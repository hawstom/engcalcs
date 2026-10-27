<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='съотношение';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/sec';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% наклон';
$ec_lang['u_grade']='височина/дължина';
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
$ec_lang['u_bar']='бар';
$ec_lang['u_kgfcm2']='кгс/см²';
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
$ec_lang['menu_main_hydraulics']='Хидравлика';
$ec_lang['menu_help']='Помощ';
$ec_lang['menu_libre']='Свободен софтуер';
$ec_lang['template_welcome']='Оставете страховете си на прага; тук любовта е нашият език. Не съсипвате всичко. Насладете се и на <a target="_blank" href="https://hawsedc.com/download.php">безплатните инструменти HawsEDC за AutoCAD.</a>';
$ec_lang['template_feedback']='Можете ли да предложите по-добра формулировка на този текст или нещо друго? Искате ли да помогнете или да се научите да създавате инструменти като тези? Моля, свържете се с мен.';
$ec_lang['template_printable_title']='Заглавие за принтиране';
$ec_lang['template_printable_subtitle']='Подзаглавие за принтиране';
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
$ec_lang['consent_body']='Можем ли да запазим случаен код в този браузър, за да броим колко браузъра използват всяка част от този сайт? Кодът се създава на момента, не казва нищо за вас или за вашето устройство и не записва нищо от въведеното от вас. Без него не можем да различим вашето второ посещение от първото посещение на друг човек.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Решава тази мрежа при всяка хидравлична времева стъпка.';
$ec_lang['consent_accept']='Приемам';
$ec_lang['consent_accept_all']='Приемам винаги';
$ec_lang['consent_decline']='Отказвам винаги';
$ec_lang['consent_current_granted']='Разрешихте това. Този браузър пази случаен код, за да можем да го преброим.';
$ec_lang['consent_current_denied']='Отказахте това. Не съхраняваме нищо, за да ограничим записването за този профил на браузъра.';
$ec_lang['consent_region_label']='Вашият избор относно кода за преброяване.';
$ec_lang['consent_settings_link']='Настройки на бисквитките';
$ec_lang['privacy_link']='Политика за поверителност';
$ec_lang['terms_link']='Условия за ползване';
$ec_lang['index_main_title']='Безплатни онлайн инженерни калкулатори';
$ec_lang['index_meta_desc_plain']='Безплатни калкулатори по хидравлично инженерство за тръби, канали, преливници и напояване. Работят във вашия браузър офлайн и са налични на 27 езика.';
$ec_lang['calc_set_units']='Изберете мерни единици:';
$ec_lang['calc_set_units_tip']='Задава мерната единица за всички полета наведнъж. Не е разрушително: числата, които сте въвели, остават точно такива, каквито са, но всяко от тях вече се чете в новата единица. 6 си остава 6, но вече означава 6 инча вместо 6 милиметра.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Възстанови по подразбиране';
$ec_lang['calc_defaults_confirm']='Нулирай ли калкулатора до първоначалните стойности?';
$ec_lang['points_data_note']='(или Копиране/Поставяне чрез областта с данни)';
$ec_lang['points_data_heading']='Данни на калкулатора<br />(използвайте Копирай, за да видите формата)';
$ec_lang['points_data_points_heading']='Данни за точките<br />(използвайте Копирай, за да видите формата)';
$ec_lang['points_data_copy']='Копирай';
$ec_lang['points_data_paste']='Постави';
$ec_lang['points_data_msg_line']='Нищо не е поставено. Ред {n} не можа да се прочете като пикет и кота.';
$ec_lang['points_data_msg_none']='Нищо не е поставено. Не са намерени двойки пикет и кота.';
$ec_lang['calc_inputs']='Входни данни';
$ec_lang['calc_results']='Резултати';
$ec_lang['view_hide_line']='[Скрий този ред]';
$ec_lang['view_printable']='Версия за печат (презаредете за възстановяване)';
$ec_lang['ec_name_label']='Запазете това изчисление:';
$ec_lang['ec_name_placeholder']='Име';
$ec_lang['ec_name_tip']='Запазва тези входни стойности в URL адреса за добавяне в отметки, извличане от история и споделяне';
$ec_lang['calc_copy_link']='Копирай връзка';
$ec_lang['ec_related_calcs']='Свързани калкулатори:';
$ec_lang['calc_copy_link_done']='Копирано!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Загуба на напор в тръбопровод по Дарси-Вайсбах';
$ec_lang['dw_main_title']='Безплатен онлайн калкулатор за загуба на напор по Дарси-Вайсбах';
$ec_lang['dw_main_desc']='Загуба на напор по Дарси-Вайсбах при зададени диаметър, грапавост и водно количество';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Абсолютна грапавост на стената на тръбата, e. Типични стойности: стомана (нова) 0,046 мм, стомана (употребявана) 0,15 мм, HDPE 0,003 мм, PVC/uPVC 0,0015 мм, бетон 0,3–3 мм.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s за чиста вода при 20°C">Кинематична вискозност, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Кинематична вискозност, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s за чиста вода при 20°C';
$ec_lang['dw_reynolds_number']='Число на Рейнолдс, Re';
$ec_lang['dw_flow_regime']='Режим на течението';
$ec_lang['dw_regime_laminar']='ламинарен';
$ec_lang['dw_regime_transitional']='преходен';
$ec_lang['dw_regime_turbulent']='турбулентен';
$ec_lang['dw_friction_factor_method']='Метод за коефициент на триене';
$ec_lang['dw_friction_factor']='Коефициент на триене, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Загуба на напор в тръбопровод по Хейзен-Уилямс';
$ec_lang['hw_main_title']='Безплатен онлайн калкулатор за загуба на напор по Хейзен-Уилямс';
$ec_lang['hw_main_desc']='Загуба на напор по Хейзен-Уилямс при зададени диаметър, грапавост и водно количество';
$ec_lang['hw_hgl_1']='HGL надолу по течението';
$ec_lang['hw_hgl_2']='HGL нагоре по течението';
$ec_lang['hw_elev_up']='Кота нагоре по течението';
$ec_lang['hw_pressure_up']='Налягане нагоре по течението';
$ec_lang['hw_elev_down']='Кота надолу по течението';
$ec_lang['hw_pressure_down']='Налягане надолу по течението';
$ec_lang['hw_pressure_check']='Проверка на налягането';
$ec_lang['hw_pressure_ok_short']='Положително налягане';
$ec_lang['hw_pressure_neg_short']='Отрицателно налягане';
$ec_lang['hw_pressure_neg']='Налягането надолу по течението е под нулата. Хидравличната линия на напора (HGL) пада под тръбата, така че тръбата не би текла пълна и този резултат може да не е валиден.';
$ec_lang['hw_roughness']='Коефициент на Хейзен-Уилямс, C';
$ec_lang['hw_note_1']='<dl><dt>Този калкулатор не моделира профила на тръбата между двата края.</dt><dd>Той използва само въведените от вас коти нагоре и надолу по течението. Ако теренът се издига по-високо от който и да е от двата края някъде между тях, налягането в тази висока точка е по-ниско от всяко налягане, показано тук. Изпълнете калкулатора отново за участъка от горния край до високата точка, за да я проверите.</dd><dd>Където хидравличната линия на напора (HGL) пада под тръбата, водата е под отрицателно налягане. Въздухът излиза от разтвора, тънкостенна тръба може да хлътне, а замърсени подземни води могат да бъдат засмукани през фугите. Поддържайте линията под положително налягане навсякъде и обмислете въздушен клапан на всяка висока точка.</dd><dt>Налягането нагоре по течението е гранично условие, което вие задавате.</dt><dd>Отчетете го от манометър, от нивото на водата в резервоар (височината на водата над тръбата) или от кривата на помпата. Помпата дава по-ниско налягане при по-голямо водно количество, затова използвайте точката от кривата, която отговаря на въведеното по-горе водно количество.</dd><dt>Съберете сами коефициентите на местни (локални) загуби.</dt><dd>Съберете стойностите K за всеки вентил, коляно, тройник, водомер и вход по трасето и въведете тази сума. Последвайте връзката до това поле за типични стойности. В дълъг транзитен водопровод тези загуби са малки в сравнение с триенето, но в къси станционни тръбопроводи те могат да бъдат по-голямата част от загубите.</dd></dl>';
// Manning Irregular
$ec_lang['mi_menu']='Канал с произволно сечение по Манинг';
$ec_lang['mi_main_title']='Безплатен онлайн калкулатор за канал с произволно сечение по Манинг';
$ec_lang['mi_main_desc']='Калкулатор за равномерно течение в канал с произволно сечение по Манинг';
$ec_lang['mi_waterSurfaceElevation']='Кота на водната повърхност';
$ec_lang['mi_q_617']='<span class="ec-help" title="Съставно водно количество Q, изчислено със съставно n за всеки регион съгласно Chow 6-17, при равни скорости">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Точки на напречното сечение';
$ec_lang['mi_groupPoint']='Точка';
$ec_lang['mi_groupSegment']='Сегмент';
$ec_lang['mi_groupRegion']='Регион';
$ec_lang['mi_station']='Ст.';
$ec_lang['mi_elevation']='Кота';
$ec_lang['mi_n']='n<br />за сег-<br />мент';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />граница<br />регион<br />(Бряг)';
$ec_lang['mi_tau']='Дъно<br />срязв.<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='Съст.<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='Съставно n';
$ec_lang['mi_notes_1_def']='Калкулаторът следва наръчника HEC-RAS за изчисляване на съставното n по региони съгласно Chow 1959, стр. 136, уравнение 6-17 (а не 6-18).';


$ec_lang['mi_notes_2_term']='Каменна облицовка';
$ec_lang['mi_notes_2_def']='Използвайте калкулатора за трапецовиден канал на Манинг за проектиране на каменна облицовка. Този калкулатор е предназначен за естествени напречни сечения.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Водно количество в тръбопровод по Манинг';
$ec_lang['mpf_main_title']='Безплатен онлайн калкулатор за водно количество в тръбопровод по Манинг';
$ec_lang['mpf_main_desc']='Равномерно водно количество в тръбопровод по формулата на Манинг при зададени наклон и дълбочина';
$ec_lang['mpf_pipe_diameter']='Диаметър на тръбата, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Коефициент на грапавост на Манинг, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Хидравличен наклон, S<sub>f</sub></a><span class="ec-help" title="Понякога равен на наклона на тръбата. Последвайте връзката за обяснение (само на английски)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Относителна дълбочина на потока, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Водно количество, Q';
$ec_lang['mpf_flow_tip']='Водното количество и дълбочината са изчислени за безкрайно дълга тръба. За да навлезе това водно количество в тръбата, може да е необходима по-голяма дълбочина на горната вода. Вижте бележките по-долу за подробности и обучително видео.';
$ec_lang['mpf_velocity']='Скорост, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Кинетична енергия, изразена като височина на воден стълб, v²/2g">Скоростен напор, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Площ на потока, A';
$ec_lang['mpf_pipe_area']='Площ на тръбата, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Относителна площ, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Омокрен периметър, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Хидравличен радиус, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Горна ширина, T';
$ec_lang['mpf_froude_number']='Число на Фруд, Fr';
$ec_lang['mpf_shear_stress']='Средно срязващо напрежение, τ';
$ec_lang['mpf_full_flow']='Пълно водно количество, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Съотношение към пълно водно количество, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Това е водното количество и дълбочината в <em>безкрайно дълга</em> тръба.</dt><dd>За вкарването на потока в тръбата може да е необходима значително по-голяма дълбочина на горната вода. Добавете поне 1,5 пъти скоростния напор за да получите дълбочината на горната вода или <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">вижте моя 2-минутен урок</a> за стандартни изчисления на горна вода за водостоци с <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, безплатната програма за водостоци на Федералната администрация по пътищата на САЩ (U.S. Federal Highway Administration).</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Проектирате битова канализация?</dt><dd>Вижте таблиците за <a target="_blank" href="/sewslope.php">минимален наклон на канализационни тръби</a> за тръби от 4 до 96 инча (100 до 2400 мм), дадени в м/м, мм/м и проценти, както и изследването за <a target="_blank" href="/peakfact.php">коефициенти на върхово натоварване при много малки водни количества</a>. И двете са справочни документи само на английски език.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Въведете положителна целева стойност на Q.';
$ec_lang['mpf_solver_no_solution']='Няма решение: Q надвишава капацитета на тръбата при y/d0 = 93.8% (Qmax = {qmax} в избраните мерни единици).';
$ec_lang['mpf_solve_btn']='Изчисли';
$ec_lang['mpf_solve_for_flow']='за водно количество, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Загуба на напор в тръбопровод по Манинг';
$ec_lang['mphl_main_title']='Безплатен онлайн калкулатор за загуба на напор в тръбопровод по Манинг';
$ec_lang['mphl_main_desc']='Загуба на напор по формулата на Манинг при зададено пълно водно количество';
$ec_lang['mphl_pipe_length']='Дължина, L';
$ec_lang['mphl_area']='Площ, A';
$ec_lang['mphl_total_junction_k']='Коефициент на местни (локални) загуби, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Коефициент на загуби, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Коефициент на местни (локални) загуби, km. Тези загуби възникват при тръбни съединения, входове, изходи, колена и спирателни органи — терминът „местни“ е утвърден, но подвеждащ; в къс тръбопровод те могат да се изравнят или да надвишат загубите от триене. Типични стойности на k: остър входен отвор 0,5, всяко коляно от 45° 0,2–0,3, шибърен вентил (напълно отворен) 0,1, пеперудков клапан 0,2, изход (към резервоар или атмосферата) 1,0. Сборувайте всички фитинги за общия km. Стойността по подразбиране 2,0 приема един вход, един изход и две колена от 45°.';
$ec_lang['mphl_friction_slope']='Хидравличен наклон';
$ec_lang['mphl_friction_loss']='Загуби от триене, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Местни (локални) загуби, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Общи загуби, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='EGL надолу по течението';
$ec_lang['mphl_egl_2']='EGL нагоре по течението';
$ec_lang['mphl_hgl_egl_tip']='Този резултат може да не е валиден там, където тръбата се издига над хидравличната линия на напора.';
$ec_lang['mphl_note_1']='<dl><dt>Този калкулатор не моделира профила на тръбата между двата края.</dt><dd>Ако HGL падне под горния ръб на тръбата в която и да е точка, това изчисление може да не е валидно.</dd><dt>При отворен вход (водосток) е необходима проверка за условия на контрол при входа.</dt><dd>1. HGL нагоре по течението трябва да бъде над котата на нормалната дълбочина на течението нагоре по течението (и по-високо от тръбата!).</dd><dd>2. Горната вода на водосток се представя по-добре чрез EGL нагоре по течението, отколкото чрез HGL нагоре по течението.</dd><dd>3. Вижте <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">моя 2-минутен урок</a> за прости стандартни изчисления на горна вода за водостоци с <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, безплатната програма за водостоци на Федералната администрация по пътищата на САЩ (U.S. Federal Highway Administration).</dd><dd>4. Тази страница решава само случая на контрол при изхода: тръба, течаща пълна, при която условията надолу по течението определят напора. Проектирането на водостоци изисква да се прецени дали контролът е при входа или при изхода, затова използвайте HY-8, когато е възможен всеки от двата случая.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Изчисления на трапецовидни канали по Манинг';
$ec_lang['mtc_main_title']='Безплатен онлайн калкулатор за изчисления на трапецовидни канали по Манинг';
$ec_lang['mtc_main_desc']='Формула на Манинг за равномерно движение в трапецовиден канал при зададени наклон и дълбочина';
$ec_lang['mtc_bottom_width']='Ширина на дъното, b';
$ec_lang['mtc_side_slope_1']='Страничен откос 1, z<sub>1</sub> (хориз./верт.)';
$ec_lang['mtc_side_slope_2']='Страничен откос 2, z<sub>2</sub> (хориз./верт.)';
$ec_lang['mtc_channel_slope']='Наклон на канала, S';
$ec_lang['mtc_flow_depth']='Дълбочина, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Ъгъл на завоя, β</a><span class="ec-help" title="За оразмеряване на каменната облицовка. Последвайте връзката за схема."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Плътност спрямо водата. Обичайно ≈ 2,65 за трошен камък.">Относителна плътност на камъка, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Проектен размер на камъните, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n за проектния размер на камъните по метода на Strickler';
// Edited by TGH 2026-09-07
$ec_lang['mtc_n_blodgett']='n за проектния размер на камъните по метода на Blodgett';
$ec_lang['mtc_n_bathurst']='n за проектния размер на камъните по метода на Bathurst';
$ec_lang['mtc_n_pi']='n за проектния размер на камъните по метода на Phillips & Ingersoll (P&I)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett срещу Bathurst';
$ec_lang['mtc_pi_range_check']='Проверка на диапазона P&I';
$ec_lang['mtc_pi_ok']='d50 в диапазона на P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_not_applicable']='н/п';
$ec_lang['mtc_pi_out_of_range']='Извън диапазона';
$ec_lang['mtc_pi_tip']='Екстраполация извън диапазона на набора от данни 0,28–0,36 ft, от който е изведено това уравнение — приемайте резултата само като груба проверка, а не като основа за проектиране';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Съгласно Isbash (1936) и Maricopa County, Аризона, САЩ.">Необходим размер на ъглести камъни за дъното, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Съгласно Isbash (1936) и Maricopa County, Аризона, САЩ.">Необходим размер на ъглести камъни за страничен откос 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Съгласно Isbash (1936) и Maricopa County, Аризона, САЩ.">Необходим размер на ъглести камъни за страничен откос 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Според Maynord, Ruff и Abt (1989). На завой камъкът се оразмерява за скорост на завоя 4/3 от средната, съгласно California Division of Highways (1970); собствената стойност 1,5 на Maynord важи за естествени канали.">Необходим размер на ъглести камъни, D<sub>50</sub> (Maynord, Ruff и Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Необходим размер на ъглести камъни, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Скоростта е разумна за предположения за равномерно течение.';
$ec_lang['mtc_vel_low']='Ниска скорост — риск от утаяване.';
$ec_lang['mtc_vel_high']='Скоростта е висока и може да не е реалистична; проверете ерозията на облицовката на канала, допълнителната дълбочина при завоите и загубата на енергия при разширения или препятствия.';
$ec_lang['mtc_iteration_tip']='Изберете опция за грапавина (препоръчва се B/B за Blodgett–Bathurst) и опция за размер на камъните (препоръчва се Isbash), за да се итерира автоматично към равномерен размер на камъните за целевото водно количество. Вижте бележките по-долу за пълния метод. За да пропуснете итерацията, въведете собствена стойност на грапавината (последвайте връзката за насоки) и игнорирайте размера на камъните.';
$ec_lang['mtc_note_1']='<dl><dt>Автоматична итерация за проектиране на размера на камъните и грапавината</dt><dd>Изберете опция за грапавина (препоръчва се B/B за Blodgett–Bathurst) и опция за проектен размер на камъните (препоръчва се Isbash). Настройте дълбочината и коефициента на безопасност за размера на камъните, за да получите целевото водно количество с равномерен размер на камъните. При всяка промяна на входна стойност калкулаторът повтаря следните стъпки: 1. Грапавината се изчислява от проектния размер на камъните. 2. Стойността на грапавината по избрания от вас метод се копира във входа за грапавина. 3. Изчисляват се водното количество в канала и необходимият размер на камъните. 4. Проектният размер на камъните се коригира. 5. Стъпките се повтарят, докато грешката в проектния размер на камъните стане съвсем малка.</dd><dt>Основен калкулатор (без итерация)</dt><dd>Въведете желаната стойност на грапавината. Игнорирайте областта за въвеждане на проектния размер на камъните.</dd></dl>';
$ec_lang['mtc_note_2_term']='Проверка на скоростта';
$ec_lang['mtc_note_2_def']='Високата скорост означава висока специфична енергия от наличния пад. Тази енергия може да се загуби бързо при разширения, завои или препятствия. Проверете дали това е разумно за конкретния обект.';
$ec_lang['mtc_solver_no_solution']='Не е намерено решение за даденото Q с тези входни данни за канала.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Прост преливник';
$ec_lang['ws_main_title']='Безплатен онлайн калкулатор за водно количество на прост преливник с широк праг';
$ec_lang['ws_main_desc']='Калкулатор за водно количество на прост преливник с широк праг';
$ec_lang['ws_weirLength']='Дължина на преливника, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Енергия на единица тегло вода — височина на воден стълб, а не налягане">Напор, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Коефициент на преливника, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Забележки';
$ec_lang['ws_notes_we_term']='Уравнение на преливника';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Преливник с произволно сечение';
$ec_lang['wi_main_title']='Безплатен онлайн калкулатор за сегментиран преливник с произволно сечение и променлива дълбочина';
$ec_lang['wi_main_desc']='Калкулатор за преливник с произволно сечение';
$ec_lang['wi_weirPoints']='Точки на преливника';
$ec_lang['wi_pondingHeight']='Дълбочина на подпор';
$ec_lang['wi_incrementalFlow']='Частично водно количество';
$ec_lang['wi_cumulativeFlow']='Натрупано водно количество';
$ec_lang['wi_notes_we_def']='q = ако (дължина = 0) тогава 0 иначе ако (наклон=0) тогава cw*дължина*d<sub>0</sub><sup>1,5</sup> иначе cw/(2,5*наклон) * (d<sub>0</sub><sup>2,5</sup> - d<sub>1</sub><sup>2,5</sup>) където d<sub>1</sub> и d<sub>0</sub> са винаги положителни или нула';
// Orifice Flow
$ec_lang['or_main_menu']='Водно количество през отвор';
$ec_lang['or_main_title']='Безплатен онлайн калкулатор за водно количество през отвор';
$ec_lang['or_main_desc']='Водно количество през отвор — свободно или потопено изтичане';
$ec_lang['or_shape_circular']='Кръгъл';
$ec_lang['or_shape_rectangular']='Правоъгълен';
$ec_lang['or_diameter']='<span class="ec-help" title="Диаметър за кръгъл отвор; височина за правоъгълен">Диаметър или височина, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Само за правоъгълни отвори">Ширина, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Дъно на отвора">Инвертна кота <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Кота на горната вода';
$ec_lang['or_twe']='Кота на долната вода';
$ec_lang['or_cd']='Коефициент на изтичане, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Кота на центроида';
$ec_lang['or_head']='<span class="ec-help" title="Енергия на единица тегло вода — височина на воден стълб, а не налягане">Ефективен напор, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Площ на отвора, A';
$ec_lang['or_regime']='Проверка на режима на отвор';
$ec_lang['or_regime_valid']='Свободно изтичане';
$ec_lang['or_regime_submerged']='Потопен отвор';
$ec_lang['or_regime_submerged_tip']='TWE над центроида на отвора — режимът на отвор остава валиден';
$ec_lang['or_regime_warn']='Извън режима на отвор';
$ec_lang['or_regime_warn_tip']='Горната вода е под горния ръб на отвора';
$ec_lang['or_regime_twe_above_hwe']='Проверете входните данни';
$ec_lang['or_regime_twe_above_hwe_tip']='Долната вода (TWE) е над горната вода (HWE)';
$ec_lang['or_notes_1_term']='Уравнение за отвор';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). При свободно изтичане: h = HWE − центроид. При потопено (TWE над дъното): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Режим на отвор';
$ec_lang['or_notes_2_def']='Уравнението за отвор е приложимо, когато нивото на горната вода е над горния ръб (върха) на отвора. Когато горната вода е под горния ръб, използвайте уравнение за преливник.';
$ec_lang['or_notes_3_term']='Коефициент на изтичане';
$ec_lang['or_notes_3_def']='C<sub>d</sub> е приблизително 0,60–0,65 за отвори с остри ръбове. Заоблени или вдлъбнати (re-entrant) входове използват различни стойности. Вижте <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> или Наръчника по хидравлика на HEC-RAS за насоки.';
$ec_lang['or_notes_4_term']='Потопяване';
$ec_lang['or_notes_4_def']='Когато TWE е над дъното на отвора, калкулаторът автоматично прилага уравнението за потопен отвор с h = HWE − TWE. Когато TWE е на или под дъното, се приема свободно изтичане и h = HWE − центроид.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Микро-ВЕЦ';
$ec_lang['mhp_main_title']='Безплатен онлайн калкулатор за мощност на микро-ВЕЦ';
$ec_lang['mhp_main_desc']='Калкулатор за изходна мощност на микро-ВЕЦ с деривационна схема';
$ec_lang['mhp_gross_head']='Брутен напор, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Диаметър на напорния тръбопровод (захранваща тръба)">Диаметър на напорния тръбопровод, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_efficiency']='КПД на централата, η (0–1)';
$ec_lang['mhp_vel_check']='Проверка на скоростта';
$ec_lang['mhp_hl_check']='Проверка на загубата на напор';
$ec_lang['mhp_hnet']='Нетен напор, H<sub>net</sub>';
$ec_lang['mhp_power']='Изходна мощност, P';
$ec_lang['mhp_annual_kwh']='P като годишна енергия';
$ec_lang['mhp_vel_low']='Ниска скорост — риск от утаяване и попадане на въздух.';
$ec_lang['mhp_vel_high']='Висока скорост — проверете загубите при преходи, наличната енергия и хидравличния удар.';
$ec_lang['mhp_vel_ok_short']='ОК';
$ec_lang['mhp_vel_high_short']='Висока';
$ec_lang['mhp_vel_low_short']='Ниска';
$ec_lang['mhp_vel_ok_tip']='Скоростта е в ефективния диапазон за проектиране на напорен тръбопровод.';
$ec_lang['mhp_hl_ok_tip']='Загубата на напор е под 10% от общия напор. Този размер на тръбата е икономичен.';
$ec_lang['mhp_hl_warn_tip']='Загубата на напор надвишава 10% от общия напор. Обмислете по-голяма тръба.';
$ec_lang['mhp_hl_bad_tip']='Загубата на напор надвишава 20% от общия напор. Преоразмерете тръбата.';
$ec_lang['mhp_notes_1_term']='Загуба на напор';
$ec_lang['mhp_notes_1_def']='Обща загуба h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, където h<sub>f</sub> = f(L/D)(v²/2g) е загубата от триене по Дарси-Вайсбах, а h<sub>m</sub> = k<sub>m</sub>·v²/2g включва вход, колена и спирателни органи. Нетен напор H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Скорост';
$ec_lang['mhp_notes_2_def']='Проверете дали скоростта е разумна предвид наличния пад и цената на тръбата. Твърде ниска скорост може да означава свръхоразмерена тръба; твърде висока скорост увеличава загубите от триене и риска от хидравличен удар.';
$ec_lang['mhp_notes_3_term']='Целева загуба на напор';
$ec_lang['mhp_notes_3_def']='Загубите в напорния тръбопровод (захранващата тръба) под 10% от брутния напор обикновено са икономически оправдани. Оптималният компромис между цената на тръбата и изгубената мощност обикновено е около 4–6% при висока цена на електроенергията.';
$ec_lang['mhp_notes_6_term']='Ефективност';
$ec_lang['mhp_notes_6_def']='Типичното КПД на централата η е в диапазона 0,70–0,85 за турбини Pelton и напречно-проточни турбини, характерни за микро-ВЕЦ. Използвайте 0,75 като консервативна първоначална оценка.';
$ec_lang['mhp_notes_7_term']='Годишна енергия';
$ec_lang['mhp_notes_7_def']='Годишната енергия предполага непрекъсната работа при пълно водно количество (8760 часа/година). Действителното производство ще бъде по-ниско поради сезонни вариации на водното количество, престои за поддръжка и коефициент на натоварване.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Време за изпразване на езерце и резервоар';
$ec_lang['odt_main_title']='Безплатен онлайн калкулатор за времето за изпразване на езерце, басейн или резервоар (отвор)';
$ec_lang['odt_main_desc']='Време за изпразване на езерце, басейн или резервоар — изход през отвор, метод на коничния обем';
$ec_lang['odt_h1_elev']='Начална кота';
$ec_lang['odt_a1']='Начална площ, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Крайна кота';
$ec_lang['odt_a0']='Площ при котата на отвора, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Интерполирана от коничния модел при крайната кота">Крайна площ, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Проверка на крайната кота';
$ec_lang['odt_h2_ok']='Крайната кота е над горния ръб на отвора';
$ec_lang['odt_h2_warn']='Крайната кота е на или под горния ръб на отвора';
$ec_lang['odt_h2_warn_tip']='Горният ръб на отвора = центроид + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Диаметър (кръгъл) или височина (правоъгълен)">Отвор D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Само за правоъгълен">Ширина на отвор, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Време за изпразване (s)';
$ec_lang['odt_t_min']='Време за изпразване (min)';
$ec_lang['odt_t_hr']='Време за изпразване (часове)';
$ec_lang['odt_t_day']='Време за изпразване (дни)';
$ec_lang['odt_notes_1_term']='Формула';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) дава времето за изпразване от напор H до отвора. Времето за изпразване = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), където H<sub>1</sub> = начална кота − кота на отвора, H<sub>2</sub> = крайна кота − кота на отвора.';
$ec_lang['odt_notes_2_term']='Метод';
$ec_lang['odt_notes_2_def']='Методът на коничния обем моделира езерцето или басейна като конично сечение между началната площ A<sub>1</sub> при началната водна повърхност и площта A<sub>0</sub> при кота на центроида на отвора. A<sub>2</sub>, площта на езерцето при крайната кота, се интерполира от A<sub>1</sub> и A<sub>0</sub> по модела на коничното сечение. Времето за изпразване от началната до крайната кота е равно на общото време за изпразване от H<sub>1</sub> до отвора минус оставащото времe за изпразване от H<sub>2</sub> до отвора.';
$ec_lang['odt_h1']='<span class="ec-help" title="Начална кота на водната повърхност минус кота на центроида на отвора">Начален напор, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Максимално водно количество, Q<sub>max</sub>';
$ec_lang['odt_vol']='Изпразнен обем';
$ec_lang['odt_sketch_start']='Начало';
$ec_lang['odt_sketch_end']='Край';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Разстояние между емитерите, S<sub>e</sub>';
$ec_lang['ip_sl']='Разстояние между латералите, S<sub>l</sub>';
$ec_lang['ip_n_e']='Емитери на латерал, n<sub>e</sub>';
$ec_lang['ip_n_l']='Латерали на зона, n<sub>l</sub>';
$ec_lang['ip_d']='Целева дълбочина на поливане, d';
$ec_lang['ip_a_e']='Площ на емитер, A<sub>e</sub>';
$ec_lang['ip_pr']='Норма на поливане, PR';
$ec_lang['ip_q_lat']='Водно количество на латерал, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Водно количество на зоната, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Продължителност на работа (часове)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Просмукване от канал';
$ec_lang['cs_main_title']='Безплатен онлайн калкулатор за загуби от просмукване и ефективност на транспортиране на канал';
$ec_lang['cs_main_desc']='Загуби от просмукване и ефективност на транспортиране на канал — метод вход-изход';
$ec_lang['cs_Q_in']='Приток, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Изток, Q<sub>out</sub>';
$ec_lang['cs_L']='Дължина на участъка, L';
$ec_lang['cs_Q_loss']='Водно количество на загубата от просмукване, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Проверка на измерването';
$ec_lang['cs_pct_loss']='Дял на загубата';
$ec_lang['cs_Ec']='Ефективност на транспортиране, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Оценка на ефективността';
$ec_lang['cs_Vol_day']='Дневен загубен обем';
$ec_lang['cs_Vol_year']='Годишен загубен обем';
$ec_lang['cs_Q_loss_per_L']='Загуба на единица дължина, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Стойност на водата';
$ec_lang['cs_lining_cost']='Цена на облицовката';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Целева ефективност на транспортиране след облицоване; дял 0–1">Целева стойност след облицоване, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Площ на облицовката, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Годишна изгубена стойност';
$ec_lang['cs_annual_value_recovered']='Годишна възстановена стойност';
$ec_lang['cs_lining_total_cost']='Обща цена на облицовката';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Прост срок на откупуване = обща цена на облицовката ÷ годишна възстановена стойност">Срок на откупуване <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — установено просмукване';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — няма измерима загуба';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — проверете измерванията';
$ec_lang['cs_Ec_good']='Добра — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Задоволителна — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Лоша — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='Методът вход-изход оценява просмукването чрез измерване на водното количество в началото и края на участъка от канала: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Ефективността на транспортиране E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Годишният обем приема непрекъсната работа при пълно водно количество; действителната загуба е по-малка при сезонни канали или канали с частично водно количество.';
$ec_lang['cs_notes_2_term']='Оценки на ефективността';
$ec_lang['cs_notes_2_def']='Типични земни канали без облицовка: E<sub>c</sub> = 60–80%. Добре поддържани земни канали: 75–85%. Бетонирани (облицовани) канали: 90–98%. Загуби от просмукване над 30% от притока често оправдават инвестиция в облицовка. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Откупуване на облицовката';
$ec_lang['cs_notes_3_def']='Въведете стойността на водата и цената на облицовката в произволна, но последователна валута. Площ на облицовката = дължина на участъка × омокрен периметър — омокреният периметър на напречното сечение на канала при измерената дълбочина на потока (ширина на дъното плюс двата омокрени откоса). Годишната възстановена стойност предполага, че облицованият канал постига целевата E<sub>c</sub> непрекъснато. Действителният срок на откупуване ще бъде по-дълъг при сезонни канали или ако облицовката не достигне целевата ефективност.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3-то изд. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='За';
$ec_lang['install_main_menu']='Инсталирай';
$ec_lang['install_main_title']='Инсталирай EngCalcs';
$ec_lang['install_main_desc']='Добави на устройството си за офлайн използване';
$ec_lang['install_intro']='EngCalcs е прогресивно уеб приложение (PWA). След инсталиране всички калкулатори работят напълно офлайн — не е нужна връзка с интернет.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Отворете произволна страница с калкулатор в Chrome.</li><li>Докоснете бутона <strong>⬇ Инсталиране</strong> в горната лента за навигация или отворете менюто на браузъра (⋮) и изберете <strong>Добавяне към началния екран</strong>.</li><li>Докоснете <strong>Инсталиране</strong> в появилия се прозорец.</li><li>EngCalcs се появява на началния ви екран и работи офлайн.</li>';
$ec_lang['install_now_btn']='⬇ Инсталирай сега';
$ec_lang['install_prompt_unavailable']='Прозорецът за инсталиране не е наличен — използвайте менюто на браузъра.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Отворете произволна страница с калкулатор в Safari.</li><li>Докоснете бутона <strong>Споделяне</strong> (правоъгълник със стрелка нагоре).</li><li>Превъртете надолу и докоснете <strong>Добавяне към началния екран</strong>.</li><li>Докоснете <strong>Добавяне</strong>. EngCalcs се появява на началния ви екран.</li>';
$ec_lang['install_ios_note']='На iOS инсталирането винаги става през менюто за споделяне — няма автоматичен прозорец за инсталиране.';
$ec_lang['install_desktop_heading']='Настолен компютър (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Отворете произволна страница с калкулатор.</li><li>Кликнете върху <strong>иконата за инсталиране</strong> (⊕ или икона на компютър) в адресната лента на браузъра или отворете менюто на браузъра и изберете <strong>Инсталиране на EngCalcs…</strong></li><li>Кликнете <strong>Инсталиране</strong>. EngCalcs се отваря като самостоятелен прозорец на приложение.</li>';
$ec_lang['install_firefox_heading']='Firefox / Други браузъри';
$ec_lang['install_firefox_body']='Ако браузърът не предлага опция за инсталиране, използвайте калкулаторите в браузъра както обикновено. След първото посещение страниците се кешират автоматично за използване офлайн. Firefox на настолен компютър е обичайният случай.';
$ec_lang['install_cached_heading']='Какво се кешира';
$ec_lang['install_cached_body']='При първото инсталиране на EngCalcs всички страници с калкулатори и съпътстващите ги файлове (скриптове, стилове) се запазват автоматично на вашето устройство. След това всичко работи без връзка с интернет. Избраният от вас език се запомня от последното ви онлайн посещение.';
$ec_lang['contact_main_menu']='Контакт';
$ec_lang['about_main_title']='За инженерните калкулатори HawsEDC';
$ec_lang['about_main_desc']='Мисия, свободен софтуер и принос';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Мисия</h3><p>Инженерните калкулатори на HawsEDC съществуват, за да служат на инженери и полеви работници по целия свят — особено на работещите в региони с недостиг на вода, ограничени ресурси или недостатъчно обслужвани. Тези инструменти са част от по-широка хуманитарна мисия: да кажат на всеки човек по най-практичния и ефективен начин, <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">че е обичан и ценен завинаги, че няма от какво да се страхува и че няма да провали всичко</a>.</p><p>Калкулаторите са превозното средство. Дестинацията е свят без страдание.</p><h3>Свободен софтуер с отворен код</h3><p>Целият код е публикуван под <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU Общ публичен лиценз v3.0 или по-нова версия</a> — свободен в смисъла на свобода. Можете да използвате, изучавате, модифицирате и преразпространявате кода при същите условия.</p><p>Уебсайтът, който го предоставя, се предлага безплатно днес и от 2010 г.; ако един ден това не е възможно, софтуерът пак е ваш, за да го стартирате.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Изходен код</h3><p>Пълният изходен код е публично достъпен в GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Можете да разглеждате кода, да подавате проблеми или да форкнете хранилището там.</p><h3>Принос</h3><p>Всяка помощ е добре дошла. <a href="contact.php">Свържете се с Tom Haws</a>.</p><ul><li><strong>Преводи:</strong> Предложете по-добра формулировка. Подобрете или добавете език.</li><li><strong>Доклади за грешки:</strong> Използвайте формуляра за обратна връзка на всяка страница с калкулатор или подайте проблем в GitHub.</li><li><strong>Нови калкулатори:</strong> Идеи за хидроинженерни инструменти, обслужващи полеви работници и специалисти по напояване, са особено добре дошли.</li><li><strong>Хостинг:</strong> Ако можете да огледалите тези калкулатори за регион с ограничена свързаност, моля, свържете се с мен.</li></ul><h3>Използване без интернет</h3><p>Отворете който и да е калкулатор веднъж, докато сте онлайн, и всички те продължават да работят, когато не сте: браузърът ви съхранява целия комплект в движение. Механизмът е <strong>прогресивно уеб приложение (PWA)</strong>. След това всички калкулатори работят офлайн — не е необходим интернет.</p><p>На Android или iOS използвайте опцията на браузъра си „Добавяне към началния екран", за да инсталирате EngCalcs като приложение на устройството си. На настолен компютър потърсете иконата за инсталиране в адресната лента на браузъра си.</p><p>Можете също да запазите всеки отделен калкулатор чрез менюто „Запазване като…" на браузъра си за еднократна употреба офлайн.</p><h3>Контакт</h3><p>Tom Haws — хидравличен инженер и създател на тези калкулатори.<br />Използвайте формуляра за обратна връзка на всяка страница с калкулатор или достигнете до изходния код в <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Изпратете съобщение на Tom Haws';
$ec_lang['contactYourName']='Вашето име:';
$ec_lang['contactYourEmail']='Вашият e-mail адрес:';
$ec_lang['contactSubject']='Относно:';
$ec_lang['contact_message']='Съобщение:';
$ec_lang['contactSpamPrefix']='Пет плюс едно е равно на';
$ec_lang['contactSpamPostfix']='(Моля, изпишете с думи. 1=едно 2=две 3=три 4=четири 5=пет 6=шест 7=седем +=плюс 5+1=6)';
$ec_lang['contactSubmitButton']='Изпратете съобщението';
$ec_lang['contact_success']='Благодарим ви за времето, което си отделили да напишете.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Проектиране на каменен бързоток (Robinson)';
$ec_lang['rc_main_title']='Безплатен онлайн калкулатор за проектиране на каменен бързоток — Robinson (1998)';
$ec_lang['rc_main_desc']='Оразмеряване на каменна облицовка за бързоток — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Наклон на дъното на бързотока, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Водно количество на единица ширина при входа на бързотока. За канал с ширина на дъното B и общо водно количество Q използвайте q_t = Q / B.">Специфично водно количество, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Порьозност на каменната облицовка, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Плътност спрямо водата. Обичайно натрошен гранит или базалт ≈ 2,65. Валиден диапазон по Robinson: 2,54 до 2,82.">Относителна плътност на камъка, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Стандартно отклонение на гранулометричния състав. Еднороден камък ≈ 1,25. Диапазон по Robinson: 1,15 до 1,47.">Коефициент на градация SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Подпор (Hp > yn) е добре — намалява ерозията нагоре по течението. (USDA)">Дълбочина на равномерно течение във входния канал, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Ур. 1 (S0 < 0,10) или Ур. 2 (0,10–0,40). Валиден: D50 15–278 мм, S0 0,02–0,40. Извън диапазона: екстраполация.">Необходим медианен размер на камъка, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Приложено уравнение';
$ec_lang['rc_sg_check']='Проверка на относителната плътност';
$ec_lang['rc_SD_check']='Проверка на коефициента на градация';
$ec_lang['rc_sg_ok']   ='sg в допустимия диапазон';
$ec_lang['rc_sg_ok_tip']   ='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg под диапазона на Robinson';
$ec_lang['rc_sg_high'] ='sg над диапазона на Robinson';
$ec_lang['rc_sg_high_tip'] ='Допустим диапазон: 2,54–2,82';
$ec_lang['rc_SD_ok']   ='SD в допустимия диапазон';
$ec_lang['rc_SD_ok_tip']   ='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD под диапазона на Robinson';
$ec_lang['rc_SD_high'] ='SD над диапазона на Robinson';
$ec_lang['rc_SD_high_tip'] ='Допустим диапазон: 1,15–1,47';
$ec_lang['rc_layer']='Дебелина на слоя облицовка (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Радиус на кривата на гребена (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Дължина на дъгата на кривата на гребена';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Необходима за конструктивна опора на камъка на бързотока. „Минималната опашна вода, която се получава в резултат на съпротивлението на изходния участък и низходящия канал, е достатъчна да осигури стабилността на облицовката в изходния участък.“ (Robinson)">Дължина на водобойната плоча (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Коефициент на грапавост на Manning в бързотока, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Дял от q_t, протичащ през порите на камъка. Остатъкът qs тече по повърхността. По подразбиране np = 0,45 за ъглест натрошен камък.">Скорост през каменната мантия, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Специфично водно количество през мантията, q<sub>m</sub>';
$ec_lang['rc_qs']='Повърхностно специфично водно количество, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Дълбочина на потока над повърхността на облицовката, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Подпор (Hp > yn) е добре — намалява ерозията нагоре по течението. (USDA)">Напор на входния праг, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Проверка за подпор при входа';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — подпор нагоре по течението';
$ec_lang['rc_pond_ok_tip']  ='Подпорът нагоре по течението от входа на бързотока е благоприятен — намалява ерозията нагоре по течението. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — няма подпор — риск от ерозия при входа';
$ec_lang['rc_pond_warn_tip']='Няма подпор нагоре по течението от входа на бързотока — възможна е ерозия нагоре по течението. (USDA)';
$ec_lang['rc_eq1']='Ур. 1 (S<sub>0</sub> < 0,10) — полегат наклон';
$ec_lang['rc_eq2']='Ур. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — стръмен наклон';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — под диапазона за валидиране на Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — над диапазона за валидиране на Robinson';
$ec_lang['rc_notes_1_term']='Уравнения за оразмеряване на камъка';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) разработиха две емпирични уравнения за медианен размер на облицовката D<sub>50</sub> въз основа на наклона на бързотока и специфичното водно количество. Уравнение 1 се прилага за полегати наклони (S<sub>0</sub> < 0,10); Уравнение 2 — за стръмни наклони (0,10 ≤ S<sub>0</sub> ≤ 0,40). И двете уравнения изискват q<sub>t</sub> в м²/с и връщат D<sub>50</sub> в мм. Валидираният диапазон е 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Специфично водно количество';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> е общото специфично водно количество при гребена на бързотока (общо водно количество на единица ширина). За канал с ширина на дъното B и общо водно количество Q приближено q<sub>t</sub> ≈ Q / B, или го изчислете от условието за критична дълбочина при входа на бързотока.';
$ec_lang['rc_notes_3_term']='Поток през каменната мантия';
$ec_lang['rc_notes_3_def']='Част от общото водно количество преминава през порите на каменната облицовка (водно количество през мантията q<sub>m</sub>); остатъкът тече по повърхността на камъка (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). Дълбочината на потока d се изчислява по уравнението на Manning за повърхностното водно количество q<sub>s</sub> с коефициента на грапавост на бързотока n. Порьозността по подразбиране n<sub>p</sub> = 0,45 е типична за ъглест натрошен камък.';
$ec_lang['rc_notes_5_term']='Допустим диапазон на размера на камъка';
$ec_lang['rc_notes_5_def']='Уравненията са разработени за диапазон D<sub>50</sub> от 15 мм до 278 мм. Резултатите извън този диапазон са екстраполация и трябва да се използват с допълнително инженерно внимание.';
$ec_lang['rc_notes_6_term']='Кота на водобойната плоча';
$ec_lang['rc_notes_6_def']='Котата на горната повърхност на облицовката в изходния участък трябва да бъде на или под котата на дъното на низходящия канал. Ако е по-висока — изходният камък ще бъде нестабилен.';

$ec_lang['rc_notes_7_def']='Когато дълбочината на равномерно течение във входния канал е по-малка от напора на прага (H<sub>p</sub>), необходим за пропускане на q<sub>t</sub>, над входния праг възниква стесняване на потока или подпор. Това като цяло е приемливо — подпорът намалява скоростта и предотвратява ерозията нагоре по течението. За проверка: използвайте калкулатор за преливник, намерете H<sub>p</sub> за дадените q<sub>t</sub> и ширина на гребена, след което го сравнете с дълбочината на равномерно течение на входния канал. Ако H<sub>p</sub> надвишава дълбочината на равномерно течение, ще се образува подпор.';
$ec_lang['rc_notes_4_term']='Източник';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS публикува и <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">таблица в Excel</a> по същия метод.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Филтър';
$ec_lang['rc_sketch_top_crest_curve'] = 'Горна крива';
$ec_lang['rc_sketch_outlet_apron']    = 'Водобойна плоча';
$ec_lang['rc_sketch_radius']          = 'радиус';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Налягане при напояване';
$ec_lang['ip_main_title']='Безплатен онлайн калкулатор за налягане при напояване и равномерност на разпределението';
$ec_lang['ip_main_desc']='Налягане в пробния клон и оценена равномерност';
$ec_lang['ip_h_supply']='Налягане на подаването';
$ec_lang['ip_elev_supply']='Кота на подаването, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Проектно водно количество на емитера, q<sub>design</sub>';
$ec_lang['ip_h_design']='Проектно налягане на емитера';
$ec_lang['ip_x']='<span class="ec-help" title="0,5 за стандартни некомпенсиращи емитери; близо до 0 за емитери с компенсация на налягането">Показател на степента на водното количество на емитера, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Пробен път';
$ec_lang['ip_group_reach']='Участък';
$ec_lang['ip_group_upstream']='Нагоре по течението';
$ec_lang['ip_group_downstream']='Надолу по течението';
$ec_lang['ip_group_loss']='Загуба';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Отметнато: този участък е сегмент от пробния латерал, от който отделните емитери черпят вода. Неотметнато: този участък е главен тръбопровод, който само пропуска водното количество към латерали извън пробния път.">Лат. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Редове за латерал: емитерите само в този участък. Редове за главен тръбопровод: общият брой емитери на латерали, РАЗЛИЧНИ от този, които се отклоняват от този участък. За участъка на главния тръбопровод, който завършва при пробния латерал, това включва и всички латерали по-нататък по главния тръбопровод след тази точка, както и споделящите същия възел (напр. латерал от срещуположната страна) — тяхното водно количество също се отклонява от този участък.">Емитери <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Кота на долния край на този участък (надолу по течението). Незадължителна за вътрешните редове (по подразбиране хоризонтално / както възела отгоре, ако е оставена празна). Задължителна за последния ред: тази стойност е котата на последния емитер, която пряко определя необходимото налягане на подаване.">Долна кота <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Котата на последния емитер (последен ред) беше оставена празна и по подразбиране е зададена хоризонтално — въведете я за точен резултат';
$ec_lang['ip_press']='Наляг.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Обща загуба в участъка, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Ниско/отрицателно налягане — проверете за подналягане спрямо атмосферното';
$ec_lang['ip_pressure_warn_short']='Ниско';
$ec_lang['ip_pressure_high']='Места с високо налягане се нуждаят от намаляване на налягането';
$ec_lang['ip_pressure_high_short']='Високо';
$ec_lang['ip_max_head']='Макс. доп. налягане в тръбата';
$ec_lang['ip_max_head_tip']='Участъци, чието налягане превишава тази стойност, се отбелязват. Оставете празно, за да пропуснете проверката за високо налягане.';
$ec_lang['ip_h_far']='Налягане на последния емитер';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Водното количество, което постъпва само в моделирания пробен път — за целия обхват на зоната/системата вижте Q_zone в раздела Проектиране на поливането по-долу.">Водно количество на подаване по пробния път, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Водно количество на последния емитер, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Средно водно количество на емитер (пробен латерал), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="С колко по-високо (или по-ниско) налягане според вас работи типичен латерал в сравнение с този пробен латерал. Пробният латерал е нарочно предполагаемият най-неблагоприятен случай, затова собствената му средна стойност подценява средната за полето — ако се остави на 0, проверката за равномерност и числата за проектиране на поливането по-долу използват (вероятно оптимистичната) собствена средна стойност на пробния латерал без корекция.">Оценка на Δналягане, средно спрямо пробния латерал <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral, преизчислен при налягането на всеки ред от латерала плюс въведената по-горе разлика в налягането — опит за корекция на факта, че пробният латерал е предполагаемият най-неблагоприятен случай, а не представителен. Захранва както проверката за равномерност, така и раздела за проектиране на поливането по-долу.">Оценено средно водно количество на емитер за полето, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Изчисленото водно количество на последния емитер, разделено на оцененото средно водно количество на емитер за полето — това е приближение на стандартната равномерност на разпределение по долната четвърт (средно на долната група ÷ средно за съвкупността); тук обаче става дума за малка моделирана извадка и оценена от потребителя корекция, а не за пълна статистическа извадка за полето. Стойности, равни на или над 1, са възможни и валидни: те просто означават, че налягането при последния емитер е равно на или над оценената средна стойност за полето, така че друг емитер е точката с най-ниско налягане. Това може да се дължи на това, че последният емитер е на по-ниска кота, или защото оценката на Δналягане е твърде малка.">Проверка за равномерност, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Налягането при пробния емитер е ≥ налягането на подаването. Вероятно това не е емитерът с най-неблагоприятен случай, или тръбите могат да бъдат намалени.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Това е различно от нашето приближение на стандартния показател за равномерност.">Водно количество на последния емитер ÷ проектно водно количество, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Няма решение: необходимото налягане на подаването надвишава въведеното налягане на подаването. Увеличете налягането на подаването, намалете търсенето или използвайте по-голяма тръба.';
$ec_lang['ip_notes_1_def']='Предполага се налягането при последния (най-отдалечения) емитер, след което енергийната линия се проследява стъпка по стъпка обратно към подаването, участък по участък, като по пътя се добавят загубите от триене и местните загуби. Котата и скоростният напор се изваждат във всеки възел, за да се получи действителното налягане там. Предположеното налягане в далечния край се коригира (чрез бисекция), докато изчисленото необходимо налягане на подаването съвпадне с въведеното налягане на подаването — същата затворена задача, която решава решателят за водно количество в тръби в калкулатора за водно количество в тръби по Manning, разширена до разклонена мрежа.';
$ec_lang['ip_notes_2_term']='Главни спрямо латерални участъци';
$ec_lang['ip_notes_2_def']='Всеки ред е един участък по единствения хидравлично най-неблагоприятен път (пробния път) от подаването до последния емитер. Главен участък само пропуска водно количество към латерали извън пробния път, затова неговото водовземане е просто умножение (проектно водно количество × общия брой емитери на участъка) — без чувствителност към местното налягане. Главният тръбопровод е споделен ствол, затова участъкът от главния тръбопровод, който завършва при пробния латерал, трябва да включва не само латералите между собствените си краища, но и всички латерали по-нататък по главния тръбопровод след тази точка, както и споделящите същия възел (напр. латерал от срещуположната страна) — тяхното водно количество преминава през същия участък, преди да се отклони, независимо дали фигурират другаде в тази таблица. Латерален участък е сегмент от самия пробен латерал: водното количество на емитера се изчислява от действителното местно налягане чрез q = k·H<sup>x</sup>, а загубата от триене се намалява с коефициента F(n) на Christiansen, за да се отчете намаляването на водното количество с всеки емитер в участъка, който черпи вода.';
$ec_lang['ip_notes_3_term']='Ограничения';
$ec_lang['ip_notes_3_def']='Моделира се едно фиксирано налягане на подаването (без характеристика на помпа), само един пробен път (не цялото поле) и двупараметрова характеристика на емитера (задайте показателя близо до 0, за да приближите емитер с компенсация на налягането). Отчитат се две различни отношения на равномерност, нарочно разделени: q<sub>last</sub>/q<sub>avg,field</sub> е приближение на стандартната равномерност на разпределение по долната четвърт (средно на долната група ÷ средно за съвкупността); но това е от малка моделирана извадка и оценена от потребителя корекция, а не от стандартната пълна статистическа извадка за полето. Освен това пробният латерал е нарочно предполагаемият най-неблагоприятен случай, затова неговата сурова, некоригирана средна стойност би подценила истинската средна за полето и би направила равномерността да изглежда по-добра, отколкото е; входът за Δналягане съществува именно за да противодейства на това отклонение. Стойности на равномерността, равни на или над 1, все пак са възможни: те просто означават, че налягането при последния емитер е равно на или над оценената средна стойност за полето, така че друг емитер е точката с най-ниско налягане. Това може да се дължи на това, че последният емитер е на по-ниска кота, или защото оценката на Δналягане е твърде малка. q<sub>last</sub>/q<sub>design</sub> е различна проверка, несвързана с равномерността, спрямо номиналното водно количество на производителя — полезна за откриване на система с като цяло повишено или понижено налягане, но е отделна проверка, която се чете заедно с показателя за равномерност, тъй като проектното/номиналното водно количество е независимо от действителното средно работно налягане на системата.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. Стандартите на ASAE/ASABE за проектиране на микронапояване използват същия многоизходен подход за загуба от триене.';
$ec_lang['ip_notes_5_term']='Проектиране на поливането';
$ec_lang['ip_notes_5_def']='Нормата на поливане и водното количество на системата/зоната използват оцененото средно водно количество на емитер за полето (q<sub>avg,field</sub> — собствената средна стойност на пробния латерал, коригирана с въведената оценка за Δналягане), а не предполагаема норма: PR = q<sub>avg,field</sub> / A<sub>e</sub>, захранена от коригираната моделирана стойност. Разстоянията и общият брой латерали/емитери за системата са отделни входни данни тук, защото пробният път моделира само един клон с най-неблагоприятен случай, а не всеки латерал в полето.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Разклонена тръбна мрежа';
$ec_lang['bpn_main_title']='Безплатен онлайн калкулатор за налягане в разклонена тръбна мрежа (без пръстени)';
$ec_lang['bpn_main_desc']='Водно количество и налягане в разклонена (дървовидна) тръбна мрежа';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Статичен напор на подаване: напорът на източника при нулево водно количество. Ниво на водата в резервоар или водоем над котата на подаване, или напор на затворен пусков вентил на помпа. Добавете точки на подаване 2 и 3, за да зададете помпена или променлива крива на подаване; инструментът отчита напора при разчетното водно количество.';
$ec_lang['bpn_elev_source']='Кота на подаване';
$ec_lang['bpn_q_total']='Общо водно количество';
$ec_lang['bpn_q_total_tip']='Общото водно количество, напускащо източника (сборът от всички потребности в мрежата).';
$ec_lang['bpn_p_min']='Най-ниско налягане';
$ec_lang['bpn_p_min_tip']='Най-ниското налягане надолу по течението навсякъде в мрежата; критичната точка на доставка.';
$ec_lang['bpn_method']='Метод за триене';
$ec_lang['bpn_method_hw']='Хазен-Уилямс';
$ec_lang['bpn_method_dw']='Дарси-Вайсбах';
$ec_lang['bpn_method_manning']='Манинг';
$ec_lang['bpn_line_table_heading']='Тръбопроводни участъци';
$ec_lang['bpn_id_tip']='Име на този тръбопроводен участък. Другите участъци го посочват в колоната Нагоре по течението ID.';
$ec_lang['bpn_upstream']='ID нагоре по течението';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID на участъка, който захранва този. Оставете празно, за да следва участъка непосредствено над него (обикновен последователен тръбопровод). Въведете ID тук, за да се отклони от друг участък.';
$ec_lang['bpn_roughness_tip']='Грапавост на тръбата за избрания метод за триене: n на Манинг, C на Хазен-Уилямс или височина на грапавостта e на Дарси-Вайсбах (дължина). Типична гладка пластмасова тръба: n около 0,009, C около 150, e около 0,0015 мм.';
$ec_lang['bpn_demand']='Потребност';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Фиксирано водно количество, доставяно в долния край на този участък.';
$ec_lang['bpn_demand_mult']='Множител на потребността';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Мащабира потребността на всички участъци едновременно, за изчисление при пиков час или бъдещ растеж. Използвайте 1 за потребностите, както са въведени.';
$ec_lang['bpn_elev_down']='Долна кота';
// Edited by TGH 2026-09-07
$ec_lang['bpn_q_line']='Водно количество на участъка';
$ec_lang['bpn_q_line_tip']='Общото водно количество, пренасяно от този участък: собствената му потребност плюс всяка потребност надолу по течението, която захранва.';
$ec_lang['bpn_p_down']='Наляг. надолу';
// Edited by TGH 2026-09-07
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Манометрично налягане (напор) в долния възел на този участък. Отрицателна стойност (отбелязана) означава податмосферно налягане; проверете проекта.';
$ec_lang['bpn_sketch_heading']='Схема на мрежата';
$ec_lang['bpn_source_label']='Източник';
$ec_lang['bpn_line_problem']='Този участък не е свързан с източника: сочи към непознат ID нагоре по течението, сочи сам към себе си, повтаря ID, който друг участък вече използва, или образува пръстен. Участъците, които не са свързани, остават нерешени.';
$ec_lang['bpn_bad_id_short']='Невалиден ID';


$ec_lang['bpn_pressure_warn']='Ниско/отрицателно налягане; проверете за податмосферни условия';
$ec_lang['bpn_pressure_warn_short']='Ниско';
$ec_lang['bpn_notes_1_term']='По подразбиране последователно, разклонение по изключение';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Оставете ID нагоре по течението празно и участъкът следва този над него като последователен тръбопровод. Въведете ID на участък нагоре по течението, за да се отклоните от него. По подразбиране е последователен тръбопровод; дърво се образува само там, където е въведено разклонение.';
$ec_lang['bpn_notes_2_term']='Само разклонени мрежи, без пръстени';
$ec_lang['bpn_notes_2_def']='Всеки участък има точно един участък нагоре по течението (дърво). Този инструмент не решава пръстеновидни мрежи; те изискват итеративни методи (EPANET или подобен). Тъй като мрежата няма пръстени, решението е директно и точно.';
$ec_lang['bpn_notes_3_term']='Без активни регулатори на налягане';
$ec_lang['bpn_notes_3_def']='Можете да добавите фиксиран вентил с местна загуба (стойност k), но не редуцир-вентили или подпорни вентили за налягане (PRV/PSV). Тяхното отворено/затворено състояние зависи от водното количество и налягането, което би наложило итерация.';
$ec_lang['bpn_supply2_q']='Водно количество на подаване 2';
$ec_lang['bpn_supply2_h']='Напор на подаване 2';
$ec_lang['bpn_supply3_q']='Водно количество на подаване 3';
$ec_lang['bpn_supply3_h']='Напор на подаване 3';
$ec_lang['bpn_supply_pt_tip']='Незадължителни точки от кривата на подаване 2 и 3. Въведете водно количество и напор за всяка, за да зададете помпа или всеки източник, чийто напор спада с увеличаване на доставяното количество; инструментът отчита напора при разчетното водно количество. Точка 1 по-горе е статичният напор при нулево водно количество. Оставете 2 и 3 празни за постоянен напор на резервоар.';
$ec_lang['bpn_h_supply']='Напор на подаване';
$ec_lang['bpn_h_supply_tip']='Напор на източника при разчетното водно количество, отчетен от кривата на подаване. Равен на въведения напор на източника, когато кривата е плоска (резервоар).';
$ec_lang['bpn_supply1_h']='Статичен напор на подаване';
$ec_lang['lpn_main_menu']='Водоснабдителна мрежа';
$ec_lang['lpn_main_title']='Безплатно онлайн моделиране на водоразпределителна мрежа с решаващия модул EPANET';
$ec_lang['lpn_main_desc']='Анализ на водоснабдителна мрежа: начертайте пръстеновидна тръбна мрежа или импортирайте файлове на EPANET';
$ec_lang['lpn_title_units']='Единици {units}';
$ec_lang['lpn_tool_select']='Избор';
$ec_lang['lpn_tool_add_junction']='Възел';
$ec_lang['lpn_tool_add_reservoir']='Резервоар';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Цистерна';
$ec_lang['lpn_tool_add_pipe']='Тръба';
$ec_lang['lpn_tool_add_pump']='Помпа';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Вентил';
$ec_lang['lpn_tool_add_text']='Текст';
// Junction and Pipe (Task 719): Tom's WaterCAD command, a junction, a pipe, a junction, a pipe, until Escape.
$ec_lang['lpn_tool_add_chain']='Верига възел-тръба';
$ec_lang['lpn_tool_vertices']='Пречупни точки';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Абонат';
$ec_lang['lpn_tool_add_meter_tip']='Посочете точката на абоната, после връзката му: тръба или възел. Потребността, която зададете на абоната, се добавя към възела в близкия край на тази тръба.';
$ec_lang['lpn_mode_add_meter']='Абонат: посочете къде е абонатът, после изберете тръбата или възела, който го обслужва. Или използвайте Esc, за да откажете.';
$ec_lang['lpn_pane_tab_customers']='Абонати';
// The Shape table (Task 779). Closed is a polygon's closure, not a pipe's or valve's status, so it
// is a key of its own and not lpn_field_closed: many languages use different words for the two.
// Points is the column of the Shape's points, "Shape S1, point 2" in lpn_snap_shape_point.
$ec_lang['lpn_pane_tab_shapes']='Фигури';
$ec_lang['lpn_pane_shape_closed']='Затворена';
$ec_lang['lpn_pane_shape_points']='Точки';
$ec_lang['lpn_customer_heading']='Абонат {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Потребност на отклонение';
$ec_lang['lpn_field_meter_count']='Брой отклонения';
$ec_lang['lpn_field_meter_total']='Обща потребност';
$ec_lang['lpn_field_meter_total_tip']='Общо, добавено към възела, посочен по-долу.';
$ec_lang['lpn_field_meter_pipe']='Свързан обект';
$ec_lang['lpn_field_meter_pipe_suggest']='Най-близкият обект е {id}. Въведете го тук, за да обслужите този абонат от него.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Свързан с';
$ec_lang['lpn_field_meter_node_tip']='Възелът, към който е свързан този абонат. Плъзнете точката на свързване върху тръба, за да го обслужите вместо това от станция по тази тръба.';
$ec_lang['lpn_meter_pipe_unknown']='В този проект няма нищо на име {id}, затова абонатът беше оставен там, където беше.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='В този проект няма график на име {id}, затова абонатът беше оставен, както си беше.';
$ec_lang['lpn_meter_placed']='Абонат {id} е добавен. Въведете описанието и потребността му в таблицата Абонати или го изберете в режим Избор, за да отворите кутията му със свойства.';
$ec_lang['lpn_field_meter_pipe_tip']='Обектът, към който се свързва това отклонение. Въведете друг тук или в таблицата Абонати, за да го промените, или плъзнете точката на свързване към друг обект.';
$ec_lang['lpn_field_meter_station']='Позиция по тръбата (%)';
$ec_lang['lpn_field_meter_station_tip']='Колко навътре по тръбата се свързва отклонението, като процент от тръбата от първия ѝ възел до втория. 0 е в единия край, 100 — в другия. Кръгчето върху тръбата прави същото с показалеца.';
$ec_lang['lpn_field_meter_offset']='Отместване от тръбата';
$ec_lang['lpn_field_meter_offset_tip']='Положителна стойност е надясно от тръбата, гледано от първия ѝ възел към втория. Въвеждането на стойност тук може да премести абоната от другата страна на главната тръба и винаги поставя отклонението перпендикулярно на главната тръба.';
$ec_lang['lpn_field_meter_lumped']='Добавена към възел';
$ec_lang['lpn_field_meter_lumped_tip']='Най-близкият възел; потребностите на този абонат се добавят там.';
$ec_lang['lpn_node_customers']='Потребности на абонати';
$ec_lang['lpn_node_customers_tip']='Списък на абонатите, добавени тук, защото този възел им е бил най-близък. Потребностите на абонатите се добавят към другите потребности, изброени тук. Абонат се редактира там, където стои на картата, или в таблицата Абонати.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} от абонати ({n})';
$ec_lang['lpn_customer_detached']='⚠ Този абонат не е свързан с тръба, затова потребността му не е включена в резултатите. Изтрийте го или начертайте тръба и преместете абоната върху нея.';
$ec_lang['lpn_customer_fixed_head']='⚠ Близкият край на тази тръба има фиксирана водна повърхност, затова тази потребност не влияе на изчислението.';
$ec_lang['lpn_customer_node_inactive']='Този абонат е присвоен на възел, който е неактивен в този сценарий, затова потребността му не участва в изчислението.';
$ec_lang['lpn_customer_detached_count']='Абонати, несвързани с тръба ({n}). Тяхната потребност не е отчетена.';
$ec_lang['lpn_meter_pick_pipe']='Сега изберете тръбата или възела, който обслужва този абонат. Абонатът остава там, където сте го поставили. Натиснете Escape, за да откажете.';
$ec_lang['lpn_inp_export_flat_customers']='EPANET файлът няма абонати. Потребността на абонатите в този проект ({n}) се записва като ред за потребност на възела, към който е добавен всеки абонат, и е именувана с тага на абоната. Файлът не записва самия абонат: местоположението му, тръбата, която го обслужва, къде по тази тръба се свързва отклонението или колко отклонения представлява. Тази информация остава в проекта; запишете проектния файл, за да я запазите.';

$ec_lang['lpn_area_hint_window_start']='Посочете единия ъгъл на прозореца.';
$ec_lang['lpn_area_hint_window_go']='Посочете противоположния ъгъл, за да завършите.';
$ec_lang['lpn_area_hint_lasso_start']='Посочете точка, от която да започне контурът.';
$ec_lang['lpn_area_hint_lasso_go']='Преместете, за да очертаете контура. Посочете последната точка, за да завършите.';
$ec_lang['lpn_area_hint_polygon_start']='Посочете първия ъгъл на многоъгълната област. Щракнете двукратно, за да завършите.';
$ec_lang['lpn_area_hint_polygon_go']='Посочете всеки ъгъл. Щракнете двукратно върху последния, за да завършите.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Задръжте Shift по време на избора, за да продължите със съществуващия избор, добавяйки или премахвайки (превключвайки) избраното.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Натиснете върху картата и плъзнете около това, което искате, след което пуснете.';
$ec_lang['lpn_area_hint_touch_go']='Плъзнете около това, което искате, след което пуснете, за да завършите.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Показване на това';
$ec_lang['lpn_multi_title']='{n} избрани';
$ec_lang['lpn_multi_varies']='Различни';
$ec_lang['lpn_multi_applied']='Зададено {prop} за {n}.';
$ec_lang['lpn_multi_no_fields']='Тези нямат нищо общо, което може да бъде зададено тук.';
$ec_lang['lpn_pane_pasted']='Поставени клетки ({n}). Непроменени клетки ({skipped}).';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Поставени редове ({n}). Редове, добавени в мрежата ({created}).';
$ec_lang['lpn_pane_pasted_rows_skipped']='Поставени редове ({n}). Редове, добавени в мрежата ({created}). Непроменени клетки ({skipped}).';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Изберете тази област и поставете редове от електронна таблица, за да ги добавите.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Постави като нови редове в края на таблицата';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Натиснете Ctrl+V, за да добавите копираните редове в долната част на тази таблица. Натиснете Esc, за да отмените.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Редове в това поставяне ({n}). Редове, които се побират в таблицата ({fit}). Да се добавят ли останалите редове ({extra}) като нови редове в долната част?';
$ec_lang['lpn_pane_paste_overflow_add']='Добави редове ({extra})';
$ec_lang['lpn_pane_paste_overflow_fit']='Постави само редовете, които се побират ({fit})';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Редове в това поставяне ({n}). Редове, които се побират в таблицата ({fit}). Останалите редове ({extra}) не могат да бъдат добавени като нови редове: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='Идентификатори, които не съвпадат ({n}). Да се постави ли въпреки това?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Нищо не бе поставено. {reasons}';
$ec_lang['lpn_pane_paste_more']='Редове с проблеми, непоказани тук: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Ред {row}: нов ред се нуждае от идентификатор.';
$ec_lang['lpn_pane_paste_bad_id']='Ред {row}: идентификаторът {id} съдържа интервал или кавичка.';
$ec_lang['lpn_pane_paste_id_taken']='Ред {row}: идентификаторът {id} вече се използва.';
$ec_lang['lpn_pane_paste_id_twice']='Ред {row}: идентификаторът {id} се използва два пъти в това поставяне.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Ред {row}: нов възел се нуждае както от {first}, така и от {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Ред {row}: нова връзка се нуждае от начален възел (От) и краен възел (До).';
$ec_lang['lpn_pane_paste_no_node']='Ред {row}: възел {id} все още не съществува. Поставете първо възлите си, а после връзките.';
$ec_lang['lpn_pane_paste_same_ends']='Ред {row}: От и До са един и същ възел.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Ред {row}: {text} не е валидна стойност за {col}.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Ред {row}: нов текст се нуждае както от {first}, така и от {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Ред {row}: {id} все още не е нито възел, нито тръба в тази мрежа. Поставете го първо, а после този текст.';
$ec_lang['lpn_pane_paste_customer_no_position']='Ред {row}: нов абонат се нуждае както от {first}, така и от {second}.';
$ec_lang['lpn_pane_paste_shape_no_points']='Ред {row}: нова фигура се нуждае от своите точки.';
// {pair} is the Points heading's own pair in this project's axis words: X/Y, N/E or Lat/Lon.
$ec_lang['lpn_pane_paste_shape_bad_points']='Ред {row}: {text} не е списък от точки. Запишете всяка точка като {pair}, с точка (.) за десетичен знак, и разделяйте точките с |.';
$ec_lang['lpn_pane_paste_shape_closed_few']='Ред {row}: затворена фигура се нуждае от поне три точки.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Ред {row}: нов абонат се нуждае от свързана тръба или възел.';
$ec_lang['lpn_pane_paste_no_pipe']='Ред {row}: тръба {id} все още не съществува. Поставете първо тръбите си, а после абонатите.';
$ec_lang['lpn_pane_paste_no_customer_node']='Ред {row}: възел {id} все още не съществува. Поставете първо възлите си, а после абонатите.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Ред {row}: възел {id} няма тръба, към която абонат да се прикрепи.';
$ec_lang['lpn_pane_filled']='Запълнени надолу клетки ({n}). Непроменени клетки ({skipped}).';
$ec_lang['lpn_pane_filldown']='Запълни надолу';
$ec_lang['lpn_pane_delete_element']='Изтриване на елемент';
$ec_lang['lpn_pane_delete_elements']='Изтриване на елементи';
$ec_lang['lpn_pane_fill_none']='Нищо в тази селекция не може да бъде запълнено надолу.';
$ec_lang['lpn_pane_ctrlenter_filled']='Запълнени клетки ({n}). Непроменени клетки ({skipped}).';
$ec_lang['lpn_pane_hide_col']='Скрий тази колона';
$ec_lang['lpn_pane_hide_cols']='Скрий тези колони';
$ec_lang['lpn_pane_show_all_cols']='Покажи всички колони';
$ec_lang['lpn_pane_sort_asc']='Сортирай възходящо';
$ec_lang['lpn_pane_sort_desc']='Сортирай низходящо';
$ec_lang['lpn_pane_manage_cols']='Управление на колони…';
$ec_lang['lpn_pane_manage_cols_title']='Управление на колони';
$ec_lang['lpn_pane_manage_cols_show']='Показвай';
$ec_lang['lpn_pane_manage_cols_up']='Премести нагоре';
$ec_lang['lpn_pane_manage_cols_down']='Премести надолу';
$ec_lang['lpn_pane_manage_cols_top']='Премести в началото';
$ec_lang['lpn_pane_manage_cols_bottom']='Премести в края';
$ec_lang['lpn_pane_manage_cols_width']='Ширина (em)';
$ec_lang['lpn_pane_width_tip']='Ширините на колоните се запазват в този браузър, а не в проекта. Щракнете двукратно върху разделителя на колона, за да възстановите ширината по подразбиране.';
$ec_lang['lpn_pane_colmenu_tip']='Скриване или управление на колони';
$ec_lang['lpn_tool_area_window']='Избор на прозорец';
$ec_lang['lpn_tool_area_lasso']='Избор с ласо';
$ec_lang['lpn_tool_area_polygon']='Избор на многоъгълник';
$ec_lang['lpn_tool_delete']='Изтриване';
$ec_lang['lpn_tool_zoom_extent']='Покажи всичко';
$ec_lang['lpn_tool_zoom_selection']='Покажи избраните';
$ec_lang['lpn_tool_zoom_window']='Мащаб в прозорец';
$ec_lang['lpn_zoom_in']='Увеличи';
$ec_lang['lpn_zoom_out']='Намали';
$ec_lang['lpn_new_text']='Текст';
$ec_lang['lpn_field_text_bold']='Получер текст';
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
$ec_lang['lpn_field_text_anchor']='Прикрепен към';
$ec_lang['lpn_field_text_align']='Хоризонтално подравняване';
$ec_lang['lpn_field_text_align_left']='Ляво';
$ec_lang['lpn_field_text_align_center']='Центрирано';
$ec_lang['lpn_field_text_align_right']='Дясно';
$ec_lang['lpn_field_text_valign']='Вертикално подравняване';
$ec_lang['lpn_field_text_valign_top']='Горе';
$ec_lang['lpn_field_text_valign_middle']='По средата';
$ec_lang['lpn_field_text_valign_bottom']='Долу';
$ec_lang['lpn_field_text_rotation']='Ъгъл (градуси)';
$ec_lang['lpn_field_text_match_pipe']='Завърти по ъгъла на най-близкия участък';
$ec_lang['lpn_field_text_flip']='Завърти на 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Прикачен елемент';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Този текст е поставен достатъчно близо до обект, за да го следва, затова се движи заедно с този обект и има водеща линия. Текст на водеща линия взима своето хоризонтално и вертикално подравняване от страната, на която стои, което е причината тези два реда да не се предлагат, докато е прикачен.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Коефициент на дюзата';
$ec_lang['lpn_field_emitter_tip']='Допълнителен изходящ поток, който зависи от налягането, за пръскачка, отворен изход или моделиран теч. Водното количество, което освобождава, е този коефициент, умножен по налягането, повдигнато на степенния показател на дюзата, който се задава веднъж за цялата мрежа в Настройки, Изчисление, Хидравлика. Оставете празно при обикновен възел.';
$ec_lang['lpn_field_elev']='Кота';
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
$ec_lang['lpn_field_head']='Напор';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Ниво на водната повърхност в резервоара, изразено като височина, а не като налягане. Оставете празно, за да поставите водната повърхност на котата на резервоара.';
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
$ec_lang['lpn_field_tank_base_elev']='Кота на дъното';
$ec_lang['lpn_field_tank_base_elev_tip']='Кота на дъното на цистерната, от която се измерват дълбочината и обемът на водата. Ако е оставена празна, дъното е на котата на терена.';
$ec_lang['lpn_tank_ground_elev_tip']='Кота на терена при цистерната. Налягането при цистерната се измерва оттук, както при възел.';
$ec_lang['lpn_field_tank_level']='Дълбочина на водата';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Дълбочина на водата в цистерната, измерена нагоре от дъното на цистерната.';
$ec_lang['lpn_field_tank_minlevel']='Най-ниска дълбочина на водата';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Минимална допустима дълбочина, измерена нагоре от дъното на цистерната.';
$ec_lang['lpn_field_tank_maxlevel']='Най-висока дълбочина на водата';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Максимална допустима дълбочина, измерена нагоре от дъното на цистерната.';
$ec_lang['lpn_field_tank_diameter']='Диаметър на цистерната';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='За вертикален цилиндър. Същите единици като котата, не като диаметъра на тръбите. Определя колко вода побира дадена дълбочина.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Кота на водната повърхност в цистерната: котата на дъното плюс дълбочината на водата.';
$ec_lang['lpn_close']='Затвори';
// The corner buttons beside every standing box's X (Task 441). Each is an icon-only button, so the
// value is its name: the hover tip and the screen reader's label at once. Auto-hide is a toggle and
// says its state through aria-pressed, so one wording serves both states (AutoCAD's own word).
$ec_lang['lpn_dock_left']='Закрепване вляво от картата';
$ec_lang['lpn_dock_right']='Закрепване вдясно от картата';
$ec_lang['lpn_dock_float']='Плаващ';
$ec_lang['lpn_dock_autohide']='Автоматично скриване';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Свойства';
// What a docked Properties box says while nothing is selected: it stays in its dock (Tom, 2026-10-07).
$ec_lang['lpn_popup_none']='Няма избран елемент. Изберете елемент на картата, за да видите свойствата му.';
$ec_lang['lpn_empty_hint']='Използвайте Файл, Нов проект, за да отворите пример. Или започнете, като добавите резервоар, възел и тръба от лентата с инструменти.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Мрежата ви е непокътната.';
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
$ec_lang['lpn_examples_welcome']='Добре дошли в моделирането на водоснабдителни мрежи';
$ec_lang['lpn_examples_heading']='Отваряне на копие на пример';
$ec_lang['lpn_examples_sub']='Всеки пример се отваря като копие. Променете го и го запишете или отворете ново копие, за да започнете отначало.';
$ec_lang['lpn_examples_open']='Отвори';
$ec_lang['lpn_examples_menu']='Отвори пример…';
$ec_lang['lpn_examples_blank']='Или започнете тук';
// The SAME exit, worded for the other way in, is lpn_close (Task 699 merged its own 'Close' key
// into it). Opened from File the user already has work on screen, so "start with a blank map"
// reads as "discard it" and they do not dare press the only button that leaves (Tom, 2026-08-17:
// "I can't back out of the gallery... I am forced to open an example"). Closing never touches a
// project either way.
$ec_lang['lpn_examples_size']='Възли: {nodes}, тръби: {links}';
$ec_lang['lpn_examples_failed']='Примерите не можаха да бъдат заредени. Използвайте Файл, Нов проект, за да започнете чертеж.';
$ec_lang['lpn_examples_loading']='Зареждане на примери…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Поправи нещо';
$ec_lang['lpn_help_notes']='Бележки за тази страница';
$ec_lang['lpn_guide_about_heading']='За този калкулатор';
$ec_lang['lpn_guide_group_from']='От {menu}';
$ec_lang['lpn_guide_menu_named']='Меню {menu}';
// **THE NEW BOX, TASK 745** (Tom, 2026-09-29: reorganize Help into three groups, with a new
// "Tables and Hotkeys" box gathering all table help and all keyboard shortcuts). One key names
// both the Help row and the box's own title bar, the same pattern lpn_help_notes already carries
// for the Notes box.
$ec_lang['lpn_help_hotkeys']='Таблици и клавишни комбинации';
// **THE USER GUIDE** (Tom, 2026-10-06: "Maybe items 2 and 3 combined into a simple User Manual or
// whatever the 2026 thing is?"; Ida's design). Names both the Help row and the box's title bar. It
// replaces lpn_help_hotkeys and the Help > Toolbar fly-out (lpn_help_icons, which still heads the
// box's Toolbar section).
$ec_lang['lpn_help_manual']='Ръководство';
// The Guide's contents rail, its search, its Boxes section and the "?" in every box's title bar.
$ec_lang['lpn_guide_contents']='Съдържание';
$ec_lang['lpn_guide_rail_hide']='Скриване на съдържанието';
$ec_lang['lpn_guide_rail_show']='Показване на съдържанието';
$ec_lang['lpn_guide_search']='Търсене в ръководството';
$ec_lang['lpn_guide_boxes_heading']='Кутии';
$ec_lang['lpn_guide_boxes_intro']='Всяка кутия може да се премества, да се преоразмерява, да се закачва вляво или вдясно от картата или да се затваря. Знакът ? в заглавната лента на кутията отваря нейната помощ.';
// Tom's own wording, 2026-10-07 (his typo "to not" corrected). Below lpn_guide_boxes_intro.
$ec_lang['lpn_guide_boxes_autohide']='Когато показалецът излезе, кутия без фокус се скрива след кратко забавяне. Кутия с фокус се скрива, когато щракнете извън нея, натиснете Esc или излезете от нея с Tab, докато показалецът е другаде.';
$ec_lang['lpn_guide_box_help']='Помощ за тази кутия';
// A Boxes entry whose box shares its name with a section of the Guide ("Screenshot"), in the Guide
// only, so its Contents list does not show one word twice. Keep {box} as it is.
$ec_lang['lpn_guide_box_named']='Кутия {box}';
// Above the Toolbar rows, shown only while some are dimmed (on a phone, or Calculate while
// Recalculate automatically is on): a grey name otherwise reads as a disabled button.
$ec_lang['lpn_guide_dimmed']='Затъмненото име е бутон, който в момента е скрит от лентата с инструменти.';
// One entry in the Guide's Boxes section for each box, shown by the "?" in its title bar. Fire flow,
// Critical assets, and Demand scaling carry theirs in lpn_ff_intro and the keys that follow it.
$ec_lang['lpn_guide_text_popup']='Показва свойствата на избрания елемент, текст или абонат, или на няколко избрани елемента. Кутията се отваря до избраното или там, където последно е била преместена. Редактираната стойност променя мрежата веднага, а етикетът на елемента на картата и панелът Таблици се обновяват. Изчислените резултати се показват като редове само за четене и не могат да се редактират.';
$ec_lang['lpn_guide_text_find_popup']='Намира обектите, които отговарят на условие, например всяка тръба с диаметър под 8 in или всеки възел с налягане под 40 psi, и може да промени едно свойство на всички тях с една операция. Използвайте я, за да проверите модела преди решаването (липсваща кота, диаметър, въведен в грешна мерна единица), за да изброите проблемните места след решаването (ниско налягане, висока скорост) и за да направите една поправка на много обекти.\n\nСписъците Какво да се търси, Свойство, Условие и Стойност изграждат едно условие и го записват като ред текст в полето Заявка. Редът може да се редактира и директно, а списъците го следват. Заявка, която списъците не могат да изразят, например две условия, свързани с ИЛИ, скрива списъците, докато не се натисне бутонът Използвай контролите вместо това. За да търсите, натиснете Enter в полето Заявка или бутона Търси.';
$ec_lang['lpn_guide_text_settings_box']='Съдържа настройките на отворения проект и на този браузър, подредени по раздели. Изберете Вода, Настройки, за да я отворите. Два бутона, Възстановяване на настройките по подразбиране и Започни отначало, ги нулират. В кутията може да се търси: въведете една или повече думи в Търсене в настройките, за да се изброят само настройките, които съдържат всички тях. Положението и размерът на тази кутия се пазят само в този браузър.';
$ec_lang['lpn_guide_text_library_box']='Съдържа графиците, кривите, видовете тръби, списъците с фитинги, управлението и правилата на проекта, всяко в свой раздел. Изберете Вода, Библиотеки, за да я отворите. Елемент се отнася към график, крива, вид тръба или списък с фитинги чрез ID на съответния запис, а записът се създава, редактира и изтрива тук. Всички се запазват с проекта, а Отмяна връща редакция, направена тук. Положението и размерът на кутията се пазят само в този браузър.';
$ec_lang['lpn_guide_text_energy_box']='Отчита потреблението на енергия, пиковата мощност и разходите на всяка помпа при последното изчисление за период от време, като използва ефективността на всяка помпа и цената на енергията, зададена в Настройки, Енергия. Изисква Общо време на изпълнение в Настройки и решена мрежа. Не променя мрежата.';
$ec_lang['lpn_guide_text_contour_box']='Управлява графиката с изолинии, начертана на картата от стойността на възела, избрана в Оцвети възлите по: цветовата схема, запълването и неговата непрозрачност, интервала и етикетите на изолиниите и докъде от всяка тръба стига цветът. Изключването скрива графиката и оставя цветовете на възлите. Променя само показването, не мрежата.';
$ec_lang['lpn_guide_text_scncmp_box']='Изчислява всеки сценарий, който е отметнат в Сценарния мениджър (всички, освен ако отметките не са изчистени), от копие на чертежа и за всеки от тях изработва таблица с броя на свои стойности, множителя на потребността, общото време на изпълнение, хидравличната стъпка във времето, най-ниското налягане и най-високата скорост. Изберете Вода, Отчети, Сценарии: сравнение, за да я отворите. Сравнението се стартира при отварянето и се стартира отново след всяка редакция, докато кутията е отворена.\n\nТо не променя проекта, а отвореният сценарий остава такъв, какъвто е бил.';
$ec_lang['lpn_guide_text_rptbox']='Показва текстовия отчет, записан от модула на EPANET за последното изчисление за период от време, включително предупрежденията му и обобщението на мрежата. Всяко изчисление за период от време го замества; решаване за един момент не го замества, а редакция оставя предишния отчет на място.';
$ec_lang['lpn_guide_text_status_box']='Изброява по хронологичен ред всяка промяна по време на последното изчисление за период от време: отваряне или затваряне на помпа, вентил или тръба, цистерна, която започва да се пълни или изпразва или става пълна или празна, и всяка времева стъпка, която не е сходила напълно. Изброяват се само промените, не всяка времева стъпка.';
$ec_lang['lpn_guide_text_full_box']='Изброява всеки възел и всяка връзка при всяка стъпка на отчитане, в мерните единици, показани в панела Таблици. Без изчисление за период от време показва текущото решение за един момент. Изтеглянето или отпечатването включва всяка времева стъпка, а таблицата показва по една наведнъж.';
$ec_lang['lpn_guide_text_calib_box']='Сравнява файл с полеви измервания с изчислените резултати на същите места и в същото време, по един файл за всеки параметър. Файлът се държи само за текущата сесия и не се записва с проекта.';
$ec_lang['lpn_guide_text_hotkeys_popup']='Ръководството за потребителя. Разделите му са Работа с ръководството, Лента с инструменти, Менюта, Карта, Снимка на екрана, Таблици, Кутии, За този калкулатор и Бележки за тази страница. Лентата с инструменти и Менютата изброяват всеки бутон и всеки ред на менюто с клавишната му комбинация, Кутиите имат запис за всяка кутия, а останалите раздели описват какво прави страницата. Изборът на ред показва къде е този контрол; никога не го изпълнява. Натиснете Ctrl+K за търсене или / докато ръководството има фокус. Ctrl+K не търси, докато е отворен въпрос.';
// The Find and replace chapter beyond its opening paragraphs, in the Guide's Boxes section
// (Tom, 2026-10-07). Each _def is HTML: keep the tags. A query inside <code> runs as written in
// English on a page in any language; translate it with the words the Find box shows in your
// language, or leave it in English. Asset IDs (60, 247, 330) and the numbers are measured on Net1
// and Net3 by dev/lpn-spike/user-guide-find-harness.js: never change them in translation.
$ec_lang['lpn_guide_find_query_term']='Езикът на заявките';
$ec_lang['lpn_guide_find_query_def']='<table class="lpn-notes-table"><tbody><tr><td><code>Scope.Property condition value</code></td><td>Едно условие. Обхватът е Всичко, Възел, Резервоар, Цистерна, Тръба, Помпа, Вентил, Текст, Абонат или Източник. Свойството е всеки запис в списъка Свойство за този обхват.</td></tr><tr><td>Условия</td><td>равно на, по-голямо от, по-малко от, съдържа, n най-високи, n най-ниски и празно. Съдържа се отнася само за текст. В n най-високи и n най-ниски n е брой, както в 5 най-високи. С буквата n като такава, както в <code>Pipe.Velocity n highest</code>, или с празно поле Стойност се изброяват 10 обекта. Празно намира обектите, които нямат стойност за свойството. Свързаността има четири условия и не приема стойност.</td></tr><tr><td>Стойности</td><td>Числото се въвежда без мерна единица, в единицата, показана в Свойства и в панела Таблици: 40, не 40 psi. Текстът, включително ID, се заключва в единични или двойни кавички: <code>\'60\'</code>.</td></tr><tr><td>И, ИЛИ и скоби</td><td>И се изчислява преди ИЛИ, а скобите групират условията. NOT не е налично.</td></tr><tr><td>Изписване</td><td>Думите не различават главни и малки букви. Английските думи се приемат във всеки език, така че заявка, копирана от това ръководство, работи на страница на всеки език.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_examples_term']='Примери върху Net3';
$ec_lang['lpn_guide_find_examples_def']='<p>Отворете примера Net3, за да следвате тези стъпки. Налягането е в psi, а скоростта във ft/s.</p><table class="lpn-notes-table"><tbody><tr><td><code>Everything.ID equal to \'60\'</code></td><td>Възел 60 и тръба 60. Възел и тръба могат да имат един и същ ID, затова търсене по ID под Всичко може да върне повече от един обект.</td></tr><tr><td><code>Junction.Pressure below 40</code></td><td>Възли 10, 40, 50, 20 и 153, първо най-ниското налягане. Възел 10 е на -0,6 psi, отрицателно налягане, което изисква преглед.</td></tr><tr><td><code>Pipe.Velocity 5 highest</code></td><td>Тръби 60, 125, 329, 123 и 149, първо най-високата скорост. Тръба 60 носи 9,3 ft/s.</td></tr><tr><td><code>Junction.Pressure below 20 OR Pipe.Velocity above 5</code></td><td>Възли 10, 20, 40 и 50 и тръби 60, 125 и 329: ниски налягания и високи скорости в един списък.</td></tr><tr><td><code>Junction.Pressure below 40 AND Junction.Elevation above 100</code></td><td>Възли 10, 20, 40 и 50, ниските налягания на високия терен. И двете условия трябва да назовават един и същ вид обект: <code>Junction.Pressure below 40 AND Pipe.Velocity above 3</code> не съвпада с нищо, защото никой обект не е едновременно възел и тръба.</td></tr><tr><td><code>Pipe.Closed equal to \'closed\'</code></td><td>Тръба 330, единствената затворена тръба във файла Net3.</td></tr><tr><td><code>Junction.Connectivity no open path to a source</code></td><td>Нищо, както е разпространен файлът. При затворена тръба 247 (вж. Замени и Отмяна): възли 215, 217, 219 и 225, възлите, които авария на тръба 247 би оставила без водоснабдяване. Повтарянето за всяка тръба е анализ на критичността.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_results_term']='Резултати, селекцията и Таблици';
$ec_lang['lpn_guide_find_results_def']='<p>Съвпадащите обекти са изброени под бутона Търси. По-голямо от и n най-високи изброяват първо най-високата стойност, по-малко от и n най-ниски първо най-ниската, а другите условия изброяват по намерената стойност, после по ID. Заявка с И или ИЛИ изброява възлите, после връзките, всяко по ID. Едно съвпадение се показва веднага на картата. Изберете ред, за да центрирате картата върху този обект. Ако нищо не е избрано, обектът също се избира; ако нещо е избрано, обектът се подчертава, а селекцията не се променя. Shift+щракване или Ctrl+щракване върху ред го добавя към селекцията или го премахва от нея. Търсенето не избира само всички съвпадения.</p><p>Бутонът Филтриране в текущата таблица прилага същата заявка към панела Таблици. Всяка таблица, за която се отнася заявката, показва само съвпадащите редове, със заявката и броя на редовете над тях. За да изберете всички съвпадения на картата, изберете тези редове и изберете Избери на картата от менюто с десния бутон. Филтърът на таблицата не се записва с проекта и приключва при презареждане на страницата. Ред, редактиран така, че вече не съвпада, остава в таблицата, затъмнен и отбелязан със знак за предупреждение, докато бутонът Филтриране в текущата таблица не бъде натиснат отново.</p>';
$ec_lang['lpn_guide_find_replace_term']='Замени и Отмяна';
$ec_lang['lpn_guide_find_replace_def']='<p>Частта Промени намереното на кутията записва едно свойство на всеки обект, намерен от заявката. Изберете свойството в списъка Свойство за промяна, въведете новата стойност в полето Нова стойност в показаната мерна единица и натиснете бутона Замени. После кутията съобщава колко обекта биха се променили, без тези, които вече имат новата стойност. Натиснете бутона Промени ги, за да приложите промяната, или Отказ. Една Отмяна връща цялата замяна.</p><p>Пример върху Net1: <code>Pipe.Diameter below 10</code> намира тръби 31, 122, 113 и 121. Изберете Диаметър, въведете 10 и натиснете Замени; кутията показва „Да се променят ли 4 обекта?“. Натиснете Промени ги, за да зададете и четирите тръби на 10 in. Една Отмяна ги връща на 6 и 8 in.</p><p>Пример върху Net3: <code>Pipe.ID equal to \'247\'</code> намира тръба 247. Изберете Затворена, изберете отново Затворена в списъка Нова стойност и натиснете Замени, после Промени ги, за да затворите тръбата за примера за свързаност по-горе. Отмяна я отваря отново.</p><p>Замяната изисква един вид обект, затова под Всичко първо изберете вид обект в списъка Какво да се търси. В сценарий, различен от Базов, замяната се записва в този сценарий, както би се записала същата редакция в Свойства. Където са налични височини от Mapbox, Кота може да се замени от Mapbox DEM вместо с въведена стойност.</p>';
$ec_lang['lpn_guide_find_notes_def']='<ul><li>Стойностите се сравняват с пълна точност и се изброяват с четири знака след десетичната запетая. Равно на рядко съвпада с изчислен резултат; използвайте по-голямо от и по-малко от.</li><li>Налягането, напорът, водното количество, скоростта и другите резултати са тези от последното изчисление. При изчистена настройка Преизчислявай автоматично те описват мрежата такава, каквато е била при последното Изчисли.</li><li>По-голямо от и по-малко от върху текст използват речников ред, като числата са в числов ред: върху Net1 <code>Junction.ID above \'20\'</code> намира възли 21, 22, 23, 31 и 32.</li><li>Под Всичко се предлагат само ID, Описание, Таг и Свързаност. Изберете вид обект в списъка Какво да се търси, за да видите пълния му списък със свойства.</li><li>Елементът Текст няма ID. Търсете го по думите му, както в <code>Text.Text contains \'pump\'</code>.</li><li>Четирите условия за свързаност на възел са няма връзки при възела, няма отворени връзки при възела, няма път от връзки до източник и няма отворен път до източник. Източник е резервоар или цистерна.</li></ul>';
// The Scenarios chapter, in the entry for the Scenario manager box (Task 785). Written from the code of
// feat/bentley-interop and held by dev/lpn-spike/user-guide-scenarios-harness.js. The box's own help
// (lpn_sm_help, Tom's wording of 2026-10-16) comes first in the entry; nothing here restates or
// contradicts it. Terms follow the Find and replace chapter's pattern.
$ec_lang['lpn_guide_scn_use_term']='За какво служи сценарият';
$ec_lang['lpn_guide_scn_use_def']='<p>Сценариите запазват много проекти, изгледи или ситуации в един и същ проект, например средно денонощие, максимално денонощие, пиков час, фигура за отчет, изключена главна тръба или предложена подмяна. Мрежата се чертае веднъж, в Базовия сценарий. Всеки друг сценарий съдържа само своите стойности, тоест стойностите, които се различават от сценария, от който наследява, а всичко останало чете от този сценарий. Затова редакция в Базовия сценарий достига до всеки сценарий, който не е заместил тази стойност.</p><p>Нов проект започва с шест готови сценария: 1. Изпитване на водното количество: статично, 2. Изпитване на водното количество: средно, 3. Изпитване на водното количество: максимално, 4. Средно денонощие, 5. Максимално денонощие и 6. Пиков час. Те са обикновени сценарии, които могат да се преименуват, редактират и изтриват. Всеки започва с една своя стойност, множителя на потребността: 1 за изпитванията на водното количество и за средното денонощие, 2 за максималното денонощие и 3 за пиковия час. Множителите са примерни стойности, които да се заменят със стойности за моделираната система. Проект, отворен от файл (включително всеки пример) или импортиран от файл на EPANET, има само Базов сценарий.</p><p>Противопожарното водно количество се проверява в кутията „Противопожарно водно количество: анализ“, която изпитва всеки възел или избраните възли. Максималното денонощие е сценарият, който обикновено е отворен при изпълнението му.</p>';
$ec_lang['lpn_guide_scn_open_term']='Отвореният сценарий';
$ec_lang['lpn_guide_scn_open_def']='<p>Бутонът Сценарий в лентата на състоянието под картата назовава отворения сценарий и брои неговите свои стойности, както в Сценарий: Базов | Брой свои стойности: 0. Щракнете върху него или изберете Вода, Сценарии, за да превключите сценарий или да добавите, копирате, преименувате или изтриете такъв. Всеки сценарий в списъка показва броя на своите стойности в скоби, а до отворения има отметка. Редът Сценариен мениджър отваря дървото на сценариите и алтернативите. Той е затъмнен, докато Основен режим е отметнат.</p><p>Чертежът, етикетите, Свойствата, Таблиците и резултатите принадлежат на отворения сценарий, а страницата изчислява само него. „Сценарии: сравнение“, описано в собствен запис, изчислява другите от копия. Отвореният сценарий се запазва с проекта.</p>';
$ec_lang['lpn_guide_scn_marks_term']='Къде се показват свои стойности';
$ec_lang['lpn_guide_scn_marks_def']='<p>На картата елемент, който има своя стойност в отворения сценарий, е обграден с кехлибарен пръстен, а елемент, който наследява своя стойност от родителски сценарий или алтернатива, е обграден със сива прекъсната линия. За потребност, диаметър, грапавост, коефициент на местна (локална) загуба и дължина пръстенът се появява само докато Настройки, Визуализация, Етикети на възлите или Етикети на участъците показват тази стойност на картата; своя стойност на всяко друго свойство винаги има пръстен. В Таблиците клетка със стойност, зададена от отворения сценарий, е кехлибарена, а подсказката ѝ назовава алтернативата, която я държи, както във Физически алт.: По-голяма главна тръба. Показване на сценариите, в менюто на клетка на таблица, изброява всеки елемент по веднъж за всеки сценарий.</p><p>Всеки ред на Свойствата, който сценарий може да замести, има знак отляво. Плътната точка означава, че отвореният сценарий заменя стойността; щракнете върху нея, за да изчистите заместването. Празната точка означава, че стойността е наследена; щракнете върху нея, за да направите показаната стойност своя. Триъгълникът означава, че сценарии под този заменят стойността; щракнете върху него, за да изчистите техните стойности, след потвърждение. Под заместения ред е наследената стойност, която той заменя, както в Базов сценарий: 18. Кутията Настройки има само плътната точка и триъгълника, защото самото въвеждане на стойност там създава своя стойност.</p><p>За да скриете пръстените, изчистете Показвай маркерите за свои стойности на картата в Настройки, Карта и страница, Страница, или изберете Карта, Чиста карта. И двете се пазят в този браузър, не в проекта. Таблиците отбелязват своите стойности и в двата случая.</p>';
$ec_lang['lpn_guide_scn_make_term']='Създаване и изчистване на свои стойности';
$ec_lang['lpn_guide_scn_make_def']='<p>При отворен сценарий, различен от Базовия, редакция на стойност, която сценариите могат да заменят, се запазва като своя стойност в отворения сценарий, както и да е направена: чрез въвеждане в Свойствата, редактиране на клетка в Таблиците, Замяна в Търсене и замяна, влачене на възел или въвеждане на координатите му, Смяна на вида (новият вид е заместването) или Поставяне на свойства върху избраните. Настройка, въведена в кутията Настройки, се запазва като своя стойност, когато сценариите могат да заменят тази настройка. Базовият не се променя. В Базовия същите редакции променят самата мрежа и достигат до всеки сценарий, който не е заместил стойността.</p><p>Изтриването действа различно. В сценарий Изтриване не премахва елемент, който съществува в Базовия. То го прави неактивен в отворения сценарий (а за възел и неговите тръби), като съобщение го казва. Елементът все още е в чертежа и в другите сценарии. Елемент, начертан при отворен сценарий, е неактивен в Базовия и активен в този сценарий, а Изтриване в този сценарий го премахва. Изтриването на елемент в Базовия изтрива и своите му стойности във всеки сценарий, след въпрос, който ги брои. Абонатите и Фигурите не принадлежат на никой сценарий и се изтриват напълно.</p><p>Редът Собствени стойности в списъка Сценарии отваря списък на всяка своя стойност на отворения сценарий по категории, всяка до наследената стойност, която заменя. Графика на времеви ред на картата, която сценарият е отворил, преместил или променил, е отделен ред. Отметнете редове и щракнете върху Изчисти избраните свои стойности, щракнете върху Изчисти собствената стойност в един ред или щракнете върху Изчисти всички свои стойности. Тогава всяка стойност се връща към наследената, а Отмяна го връща назад. Изберете ID в списъка, за да отидете до елемента на картата. Точката в Свойствата и редът Изчисти собствената стойност в менюто на клетка на Таблиците изчистват по една своя стойност.</p>';
$ec_lang['lpn_guide_scn_scope_term']='Какво може и какво не може да замести един сценарий';
$ec_lang['lpn_guide_scn_scope_def']='<table class="lpn-notes-table"><tbody><tr><td>Свойства</td><td>Всяко свойство на възел или връзка, освен изброените по-долу, включително положението му, дали е активен и видът му (Смяна на вида). Текстът може да замести думите си, положението, размера, подравняването, получер шрифт, ъгъла и дали се показва. Потребителско свойство винаги може да бъде заместено. Свойствата се държат в категориите Физически, Потребност, Активна топология, Начални настройки, Съставка, Противопожарно водно количество, Цена на енергията, Свои свойства, Текст, Представяне и Изчисление.</td></tr><tr><td>Настройки</td><td>Настройките, запазени с проекта, освен изброените по-долу: опциите за изчисление (например множителя на потребността, общото време на изпълнение, хидравличната стъпка във времето и метода за триене), графикът на потребността по подразбиране, стойностите за нови елементи и настройките за представяне (размери, цветове, етикети, изолинии, изгледът на картата и графиките на времеви редове на картата).</td></tr><tr><td>Еднакво във всеки сценарий</td><td>ID, Описанието и Тагът на елемент; крайните възли и пречупните точки на връзка; Абонатите и Фигурите; единиците и координатната система; и съдържанието на Библиотеките (графици, криви, видове тръби, списъци с фитинги, управление и правила). Редакция на което и да е от тях променя всеки сценарий. Сценарият може да насочи елемент към друга крива, вид тръба, списък с фитинги или график, но не може да променя съдържанието им.</td></tr></tbody></table>';
$ec_lang['lpn_guide_scn_example_term']='Пример върху Net1';
$ec_lang['lpn_guide_scn_example_def']='<p>Отворете примера Net1. Изберете Вода, Сценарии, Нов сценарий…, въведете По-голяма главна тръба и щракнете върху ОК. Изберете Тръба 10 на картата и въведете 24 за Диаметър в Свойствата; Базовият има 18 in., показани под полето като Базов сценарий: 18. Изберете Базов в списъка Сценарии, изберете отново Нов сценарий…, въведете Максимално денонощие и въведете 1,8 за Множител на потребността в Настройки, Изчисление, Хидравлика. След това изберете Вода, Отчети, Сценарии: сравнение.</p><table class="lpn-notes-table"><tbody><tr><td>Сценарий</td><td>Брой свои стойности</td><td>Множител на потребността</td><td>Най-ниско налягане</td><td>Най-висока скорост</td></tr><tr><td>Базов</td><td>0</td><td>1</td><td>108 psi при N32, 14:00</td><td>2,76 ft/sec при L11, 16:00</td></tr><tr><td>По-голяма главна тръба</td><td>1</td><td>1</td><td>109 psi при N32, 14:00</td><td>2,87 ft/sec при L11, 16:00</td></tr><tr><td>Максимално денонощие</td><td>1</td><td>1,8</td><td>15,78 psi при N32, 9:00</td><td>3,49 ft/sec при L10, 9:00</td></tr></tbody></table><p>Общото време на изпълнение е 24:00 и в трите, затова всяко най-ниско налягане и всяка най-висока скорост са екстремумът за денонощието, в показания момент. По-голямата главна тръба повишава най-ниското налягане с около 1 psi. Множител 1,8 го понижава до 15,78 psi в 9:00, а най-високата скорост се премества в Тръба 10. Всеки сценарий съдържа една своя стойност, а Базовият запазва своите.</p>';
$ec_lang['lpn_guide_scn_notes_term']='Какво да се знае';
$ec_lang['lpn_guide_scn_notes_def']='<ul><li>Своя стойност, равна на наследената, пак е своя стойност. Тя се брои, а Собствените стойности я отбелязват (същата).</li><li>Основният режим е настройка за този браузър, не за проекта. Той е изключен за проект, чиито сценарии и алтернативи не може да покаже. Алтернативите и Сценарният мениджър са описани в помощта най-горе в този запис.</li><li>Отмяна пази 20 стъпки. Всяка стъпка възстановява сценариите и отворения сценарий заедно с чертежа, така че добавянето, преименуването и изтриването на сценарий могат да се отменят.</li><li>Експортирането на файл на EPANET записва само отворения сценарий, със стойностите и положенията на възлите, които този сценарий чете. Самите сценарии се записват само във файла на проекта.</li></ul>';
// The Scenario comparison chapter beyond its opening paragraphs (lpn_guide_text_scncmp_box), copied into
// the box's entry by renderGuideBoxes() from <template id="lpn_guide_more_lpn_scncmp_box">. Task 785.
$ec_lang['lpn_guide_cmp_cols_term']='Какво съдържа таблицата';
$ec_lang['lpn_guide_cmp_cols_def']='<table class="lpn-notes-table"><tbody><tr><td>Сценарий</td><td>Името на сценария. Отвореният сценарий е отбелязан (отворен в момента).</td></tr><tr><td>Брой свои стойности</td><td>Своите стойности на самия сценарий, преброени както в списъка Сценарии. Опция за изчисление като множителя на потребността се брои за една, а своя стойност, равна на наследената, също се брои.</td></tr><tr><td>Множител на потребността, Общо време на изпълнение, Хидравлична стъпка във времето</td><td>Стойностите, с които е изчислен сценарият, негови собствени или на проекта. Сценарий в установен режим показва тире за времевата стъпка.</td></tr><tr><td>Най-ниско налягане</td><td>Най-ниското налягане във възел, с неговото ID и момента, в който настъпва. Резервоарите и цистерните са изключени, защото всеки има фиксиран напор.</td></tr><tr><td>Най-висока скорост</td><td>Най-високата скорост в тръба или вентил, с неговото ID и момента, в който настъпва. Помпите са изключени.</td></tr></tbody></table>';
$ec_lang['lpn_guide_cmp_run_term']='Сценарии в установен режим и за период от време';
$ec_lang['lpn_guide_cmp_run_def']='<p>Сценарий с Общо време на изпълнение, по-голямо от 0, се изчислява за целия период чрез модула на EPANET. Най-ниското му налягане и най-високата му скорост са екстремумите за всяка времева стъпка, всяко показано с момента си. Сценарий с Общо време на изпълнение 0 се изчислява в един момент. Общото време на изпълнение е една от опциите, които сценарият може да замести, така че една таблица може да съдържа и двата вида.</p>';
$ec_lang['lpn_guide_cmp_notes_def']='<ul><li>Сценарий, който не може да се изчисли, показва причината вместо двата си резултата, например че възел няма път до източник, след като тръба е станала неактивна. Другите сценарии пак се изчисляват. Сценарий, който не е сходил, показва последните си резултати и съобщение.</li><li>Блокът над таблицата, Еднакво във всеки сценарий, посочва метода за триене, единиците, точността и максималния брой опити. Настройка, която се различава между сценариите, не е в блока.</li><li>Няма праг за успех или неуспех. Четете числата спрямо проектните критерии на моделираната система.</li><li>Примерът в записа за Сценарния мениджър сравнява три сценария върху Net1.</li></ul>';
// The Libraries chapter, in the entry for the Libraries box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_library_box">. Written from the code and held by
// dev/lpn-spike/user-guide-library-harness.js.
$ec_lang['lpn_guide_lib_kinds_term']='Какво съдържа всеки раздел';
$ec_lang['lpn_guide_lib_kinds_def']='<table class="lpn-notes-table"><tbody><tr><td>Графици</td><td>Списък от множители, който се повтаря, докато трае изчислението, по един множител за всяка стъпка на графика. Новият график е 24 множителя със стойност 1. Поставянето на колона от електронна таблица попълва кутията Множители. Графикът на потребността по подразбиране е отбелязан (по подразбиране) и се избира в Настройки, Изчисление, Хидравлика.</td></tr><tr><td>Криви</td><td>Четири вида, избирани като Вид крива: Напор на помпата, Ефективност на помпата, Обем на цистерна и Загуба на напор във вентил. Точките се въвеждат в мрежа, която приема поставена колона от електронна таблица или редове, копирани от файл на EPANET. Кривата на напора на помпата се напасва през точките си, а редът Уравнение показва напасването; една точка се чете като проектна точка, с напор при нулево водно количество 1,33334 пъти нейния напор и максимално водно количество 2 пъти нейното водно количество, както я чете EPANET. Другите видове свързват точките си с прави линии. Помпа или вентил посочва кривата си в Свойствата, където връзката Криви отваря този раздел.</td></tr><tr><td>Видове тръби</td><td>Определение на диаметър, грапавост и коефициенти на реакция, към което се отнасят няколко тръби. Свойство може да остане празно в определението и тогава да се въвежда за всяка тръба. В Свойствата стойностите, които видът тръба посочва, са недостъпни, а Прекратяване на връзката с вида тръба ги копира в тръбата и спира тръбата да използва вида.</td></tr><tr><td>Фитинги</td><td>Списъци с фитинги с количество за всеки, сумирани в един коефициент на местна (локална) загуба, k, за тръба или вид тръба. Предлаганите фитинги са тринадесетте от Таблица 3.3 на ръководството на потребителя на EPANET 2.2 и Друг фитинг. Изборът на фитинг копира неговия коефициент в реда, където може да се промени.</td></tr><tr><td>Управление</td><td>По един оператор всяко, в синтаксиса на EPANET, например <code>LINK id OPEN IF NODE id BELOW value</code>. Под всяко кутията посочва дали е разбрано.</td></tr><tr><td>Правила</td><td>По няколко реда всяко, в синтаксиса на EPANET: RULE, IF, AND, OR, THEN, ELSE и PRIORITY. Под всяко кутията посочва дали е прочетено.</td></tr></tbody></table>';
$ec_lang['lpn_guide_lib_refs_term']='Преименуване, изтриване и какво се отнася към записа';
$ec_lang['lpn_guide_lib_refs_def']='<p>ID се променя в своя раздел. Празно ID или ID, което вече се използва в същия раздел, не се приема. Преименуването на запис премества всяка препратка към него, в Базовия и във всеки сценарий. За график препратките са графикът на потребността на възела и графикът на всяка от категориите му потребност, графикът на потребността на абонат, графикът на напора на резервоар, графикът на скоростта на помпа и графикът на потребността по подразбиране.</p><p>График, който се използва, може да се изтрие и всяка препратка към него се изчиства. Ако е бил графикът на потребността по подразбиране, известие казва кой график използват сега възлите без график. Крива, вид тръба или списък с фитинги, които се използват, не се изтриват. Съобщението назовава елементите, които ги използват, и на всеки първо трябва да се зададе друга крива или да бъде откъснат от вида или списъка.</p>';
$ec_lang['lpn_guide_lib_scn_term']='Библиотеки и сценарии';
$ec_lang['lpn_guide_lib_scn_def']='<p>Библиотеките са едни и същи във всеки сценарий. Сценарият може да насочи елемент към друга крива, вид тръба, списък с фитинги или график, което е своя стойност на този елемент, но съдържанието на запис не се заменя. Редакция на график, крива, вид тръба, списък с фитинги, управление или правило я променя за всеки сценарий, независимо кой сценарий е отворен. Графикът на потребността по подразбиране е настройка, а не запис, и сценарият може да има свой.</p><p>Управление или правило, което назовава елемент, неактивен в отворения сценарий, се игнорира при изчислението на този сценарий, а кутията Библиотеки го изброява. Такова, което назовава елемент, който проектът няма, също се игнорира, с предупреждение.</p>';
$ec_lang['lpn_guide_lib_ctl_term']='Управление и правила при изчисление';
$ec_lang['lpn_guide_lib_ctl_def']='<p>Управлението е един оператор. Правилото е няколко реда, които започват с RULE. Ключовите думи се въвеждат на английски, независимо от езика на страницата, а числата са в единиците на проекта. Добавяне на управление започва от оператор, изграден от мрежата, който след това се редактира до желания.</p><p>Управлението и правилата променят резултат само при изчисление за период от време, тоест когато Общо време на изпълнение е по-голямо от 0. Решение в установен режим не се променя от нито едно от двете. Правилата се прилагат само от модула на EPANET. И двете се запазват с проекта и се записват във файл на EPANET.</p>';
$ec_lang['lpn_guide_lib_import_term']='Импортиране на библиотеки от друг проект';
$ec_lang['lpn_guide_lib_import_def']='<p>Файл, Импортиране…, Импортирай библиотеки… отваря друг файл на проект и копира цели библиотеки от него в този проект. Запис, чието име вече се използва тук, се пропуска и се изброява, така че нищо, което вече е тук, не се променя. Показва се предупреждение, когато файлът и проектът задават дадена величина в различни единици, а записите се импортират както са записани. Видовете тръби, които се отнасят към списък с фитинги, какъвто този проект няма, се изброяват; импортирайте библиотеката с фитинги от същия файл, за да ги разрешите.</p>';
$ec_lang['lpn_guide_lib_example_def']='<p>Отворете примера Net1 и изберете Вода, Библиотеки. Графици съдържа график 1, Demand Pattern, с 12 множителя през 2:00, покриващи 24:00, отбелязан (по подразбиране). Криви съдържа крива 1, Pump Curve for Pump 9, крива на напора на помпата с една точка, 1500 gpm при 250 ft. Управление съдържа два оператора: първият отваря Връзка 9, когато Възел 2 падне под 110, а вторият я затваря, когато Възел 2 се покачи над 140. Правила съдържа две правила, които проверяват часовото време и нивото на Цистерна 2.</p><p>Изберете Вода, Изчисли, а след това Вода, Отчети, Промени на състоянието. Помпа L9 вече е затворена в 10:00, вече е отворена в 15:00 и вече е затворена в 21:00, а Цистерна N2 вече се изпразва в 22:00. В Управление променете 140 на 135 във втория оператор и изберете отново Вода, Изчисли. Последното затваряне се премества в 20:00, а Цистерна N2 вече се изпразва в 21:00.</p>';
$ec_lang['lpn_guide_lib_notes_def']='<ul><li>Графикът се повтаря, докато трае изчислението, така че не е нужно да покрива цялото изчисление.</li><li>Във файл на EPANET няма място за вид тръба или списък с фитинги. Файлът носи числата, които всяка тръба чете, а експортът казва кои тръби са били изравнени.</li><li>Положението и размерът на кутията Библиотеки се пазят в този браузър. Записите се запазват с проекта.</li></ul>';
// The Properties chapter, in the entry for the Properties box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_popup">. Held by dev/lpn-spike/user-guide-properties-harness.js.
$ec_lang['lpn_guide_prop_open_term']='Отваряне на Свойствата';
$ec_lang['lpn_guide_prop_open_def']='<p>В режим Избор щракнете върху възел, връзка, текст или абонат, за да отворите Свойствата до него или там, където кутията последно е била преместена. Щракнете с Shift върху друг елемент, за да го добавите към избраните. Когато е избран повече от един елемент, кутията изброява какво може да се зададе за всички наведнъж (вижте Избрани няколко елемента, по-долу). Фигурата няма кутия със Свойства, защото точките ѝ се редактират на картата.</p><p>Менюто с десния бутон на възел или връзка има Копиране на свойствата, Поставяне на свойства върху избраните и Графика на времеви ред. На сензорен екран натиснете и задръжте елемента за същото меню. Графиката на времеви ред се нуждае от резултатите на изчисление за период от време.</p>';
$ec_lang['lpn_guide_prop_edit_term']='Редактиране на стойност';
$ec_lang['lpn_guide_prop_edit_def']='<p>Стойността влиза в сила, когато полето бъде потвърдено, като го напуснете или натиснете Enter. Тя се чете в единицата, посочена в етикета ѝ, без преобразуване, а етикетът на картата, Таблиците и резултатите я следват. Изчислените стойности са редове само за четене, без поле за въвеждане. За връзка те следват входните ѝ данни, а за възел са сред тях. Те са резултатите от последното изчисление, в показания момент, а при изчистено Преизчислявай автоматично са тези от последното Изчисли.</p><p>Тръба, която използва вид тръба, показва стойностите, които видът посочва, като недостъпни. Щракнете върху Прекратяване на връзката с вида тръба, за да копирате тези стойности в тръбата и да ги редактирате там.</p>';
$ec_lang['lpn_guide_prop_id_term']='ID';
$ec_lang['lpn_guide_prop_id_def']='<p>ID се редактира в заглавната лента. То не може да съдържа интервал или кавичка, а ID на възел не може да е това на друг възел, нито ID на връзка това на друга връзка. Възел и връзка могат да имат едно и също ID. Отказано ID оставя старото на мястото му и показва съобщение. Преименуването на елемент пренася и неговите свои стойности в сценариите.</p>';
$ec_lang['lpn_guide_prop_scn_term']='В сценарий';
$ec_lang['lpn_guide_prop_scn_def']='<p>В сценарий, различен от Базовия, редакция на стойност, която сценариите могат да заменят, се запазва като своя стойност на отворения сценарий, а редът е отбелязан отляво. Записът за Сценарния мениджър описва знаците и изброява какво е еднакво във всеки сценарий: ID, Описанието и Тагът са. Абонатът няма стойности по сценарии. Превключването на сценарии оставя Свойствата отворени за същия елемент и показва стойностите на сценария, който вече е отворен.</p>';
$ec_lang['lpn_guide_prop_multi_term']='Избрани няколко елемента';
$ec_lang['lpn_guide_prop_multi_def']='<p>Заглавието гласи например 2 избрани. Кутията има по един раздел за всеки вид елемент в избраното, озаглавен с името на вида и броя на елементите от него, както в Тръби (2), и всеки раздел може да се свие. Разделът изброява свойствата, които Таблиците имат като колони и които могат да се зададат за всеки елемент в него. Резултатите и стойностите, които вид тръба посочва, не са изброени. Редът показва стойността, която елементите споделят, или Различни, когато се различават.</p><p>Въвеждането на стойност в ред я задава за всеки елемент от този вид в избраното. Ред, който не е докосван, не записва нищо. Известие посочва броя, както в Зададено Диаметър (in) за 2., а една Отмяна връща целия ред. В сценарий, различен от Базовия, стойностите се запазват като свои стойности.</p>';
$ec_lang['lpn_guide_prop_example_def']='<p>Отворете примера Net1 и щракнете върху Тръба 10. Свойствата изброяват входните ѝ данни, от Описание до Активна ли е?, а след това резултатите ѝ в показания момент: Водно количество 1866,2 gpm, Скорост 2,4 ft/sec и Загуба на напор 19,12 ft H2O.</p><p>Щракнете върху Тръба 113 и с Shift върху Тръба 31. Заглавието гласи 2 избрани, единственият раздел е Тръби (2), а Диаметър показва Различни, защото Тръба 31 е 6 in., а Тръба 113 е 8 in. Въведете 10 за Диаметър. Известието гласи Зададено Диаметър (in) за 2., двете тръби са 10 in., а една Отмяна ги връща на 6 и 8 in.</p>';
// The Settings chapter, in the entry for the Settings box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_settings_box">. Held by dev/lpn-spike/user-guide-settings-harness.js.
$ec_lang['lpn_guide_set_where_term']='Раздели и къде се запазват настройките';
$ec_lang['lpn_guide_set_where_def']='<p>Списъкът отляво на кутията води до раздел или подзаглавие. Разделите са Визуализация (Етикети на възлите, Цветове на възлите, Етикети на участъците, Цветове на връзките, Абонат и Възли и участъци), Карта и страница (Изглед и Страница), Елементи (Представки на ID, Стойности при създаване и Свои свойства), Изчисление (Единици, Време, Хидравлика, Енергия и Качество на водата) и Благодарности. Всяко подзаглавие посочва дали настройките му са Записано с проекта или Записано в този браузър. Всичко се записва с проекта, освен настройките под Страница и един ред в Хидравлика, Показвай кутията с напредъка на изпълнението, който сам посочва Записано в този браузър.</p><p>Разделът Настройки в Таблиците изброява същите настройки като редове, с тяхната Категория и Стойност, така че настройка може да се намери и провери и там.</p>';
$ec_lang['lpn_guide_set_search_term']='Търсене';
$ec_lang['lpn_guide_set_search_def']='<p>Въведете една или повече думи в Търсене в настройките, за да се изброят само настройките, които съдържат всички тях, в името или в подсказката. Дума, която съвпада със заглавие, показва всяка настройка под това заглавие. Например opacity изброява Непрозрачност на символите (0 до 1) и Непрозрачност на фоновото изображение (0 до 1); opacity symbol изброява само първата; а sprinklers изброява Показател на разпръсквателя, чиято подсказка споменава sprinklers, а името му не. Търсенето не променя никоя настройка.</p>';
$ec_lang['lpn_guide_set_scn_term']='Настройките в сценарий';
$ec_lang['lpn_guide_set_scn_def']='<p>В сценарий, различен от Базовия, стойност, въведена за настройка, която сценариите могат да заменят, се запазва като своя стойност, а редът е отбелязан с плътна точка. Триъгълник отбелязва настройка, която сценарии под отворения заменят. Записът за Сценарния мениджър изброява кои настройки могат да се заменят. Единиците са еднакви във всеки сценарий. Възстановяването на настройките по подразбиране е затъмнено извън Базовия, а Приложи тези стойности за нови елементи към всеки съществуващ елемент се отказва там, защото променя самия чертеж.</p>';
$ec_lang['lpn_guide_set_units_term']='Смяна на единица';
$ec_lang['lpn_guide_set_units_def']='<p>Всяка величина има своя единица в Единици. Когато стойности в проекта са въведени в тази единица, смяната ѝ първо задава въпрос. Не е разрушително запазва всяко число така, както е въведено, и го чете в новата единица. Разрушително пренаписва числата чрез преобразуване, така че мрежата остава физически същата, а първоначалните числа се губят, освен ако не се използва Отмяна; една Отмяна връща числата и единицата. Отказ оставя всичко както е било.</p><p>Пример върху Net1: изберете mm за Диаметър в Единици. Разрушително пренаписва 13 стойности и Тръба 10 се чете 457,2 mm. Не е разрушително оставя 13-те стойности недокоснати и Тръба 10 се чете 18 mm.</p>';
$ec_lang['lpn_guide_set_assets_term']='Нови елементи и прилагане на стойности към съществуващите';
$ec_lang['lpn_guide_set_assets_def']='<p>Представките на ID и Стойностите при създаване важат за елементи, начертани оттук нататък. Те не променят вече начертаните. Приложи към всички, до представка на ID, дава на всеки съществуващ елемент от този вид ID, което започва с представката; всеки запазва своя номер, а ID, което не завършва с число, не се променя. Приложи тези стойности за нови елементи към всеки съществуващ елемент заменя тези свойства във всеки съществуващ елемент, след въпрос, но само за свойствата, чиито етикети се показват на картата. Отмяна го връща.</p>';
$ec_lang['lpn_guide_set_reset_term']='Възстановяване на настройките по подразбиране и Започни отначало';
$ec_lang['lpn_guide_set_reset_def']='<p>Възстановяване на настройките по подразбиране първо пита, а след това връща представките на ID, стойностите за нови елементи, настройките на решаващия модул, изгледа на картата, положението на легендата и видимите етикети на отворения проект към първоначалните им стойности. Мрежата не се променя, другите проекти не се засягат, а една Отмяна връща настройките.</p><p>Започни отначало първо пита, а след това изтрива всеки проект, всяко фоново изображение, всички настройки и избраните единици, записани в този браузър, и презарежда страницата така, както би я видял нов посетител. Не може да се отмени.</p>';
// The Toolbar chapter (Task 785), terms in the Toolbar section above its rows. Held by
// dev/lpn-spike/user-guide-toolbar-harness.js.
$ec_lang['lpn_guide_tb_row_term']='Как се чете ред';
$ec_lang['lpn_guide_tb_row_def']='<p>Всеки ред е един бутон на лентата с инструменти, в реда на лентата, с черта между групите. Редът показва иконата, името и подсказката на бутона, а след това клавишите му. Когато ред на менюто върши същото, редът показва и пътя в менюто след думите Също в. Щракването върху ред сочи бутона в лентата с инструменти. То никога не изпълнява бутона. Когато бутонът не е на екрана, редът отваря реда на менюто, който върши същото.</p>';
$ec_lang['lpn_guide_tb_dim_term']='Затъмнени имена';
$ec_lang['lpn_guide_tb_dim_def']='<p>Затъмненото име принадлежи на бутон, който в момента не е на екрана. Бутон, който е на екрана, не е затъмнен, независимо дали може да действа в този момент. Изчисли е затъмнен, докато Преизчислявай автоматично е отметнато, защото бутонът се появява само когато тази настройка е изчистена.</p><p>На телефон в изправен режим на лентата с инструменти остават само петте контрола за изчисление. Всяко друго име е затъмнено, а щракването върху него отваря реда на менюто, който върши същото. Бутонът Долен панел няма ред в менюто, така че редът му може само да каже, че контролът не е на екрана.</p>';
$ec_lang['lpn_guide_tb_two_term']='Бутони с триъгълник в ъгъла';
$ec_lang['lpn_guide_tb_two_def']='<p>Покажи всичко и Избор на прозорец имат малък триъгълник в долния десен ъгъл. Второто натискане на бутона, без да е натискано нищо между тях, го сменя: Покажи всичко става Мащаб в прозорец, а Избор на прозорец преминава през формите прозорец, ласо и многоъгълник. Щракването върху ъгъла на Покажи всичко влиза веднага в Мащаб в прозорец, без да побира изгледа.</p>';
// The Menus chapter (Task 785), two terms after the ruled keys table. Held by dev/lpn-spike/user-guide-menus-harness.js.
$ec_lang['lpn_guide_mn_list_term']='Как се чете списъкът на менютата';
$ec_lang['lpn_guide_mn_list_def']='<p>Списъкът е изграден от самите менюта: Файл, Редактиране, Карта, Вода и Помощ, всяко под свое заглавие, като редовете на подменю са с отстъп под реда, който го отваря, и с черта между групите. Той пропуска редовете, които сега са скрити, заглавията във вътрешността на меню и редовете, наименувани от проекта или браузъра, като имената на сценарии. Стига на едно подменю дълбочина и няма запис за менюто Език. Ред, който сега е недостъпен, пак е изброен, без знак, че е недостъпен. Щракването върху ред отваря менюто и подменюто с този ред посочен. То никога не изпълнява реда.</p>';
$ec_lang['lpn_guide_mn_kbd_term']='Менюта от клавиатурата';
$ec_lang['lpn_guide_mn_kbd_def']='<p>Буквите след Alt+Shift са клавиши на фиксирани места, F за Файл, E за Редактиране, M за Карта, W за Вода, H за Помощ и L за Език, при всяка клавиатурна подредба и на всеки език. След F10 буквата на менюто сама го отваря, а Esc в лентата на менютата връща фокуса там, където е бил.</p><p>Редовете, които могат да се ползват само с показалец, нямат буква, а клавишите със стрелки ги прескачат. Те включват Пречупни точки, трите избора на област, инструментите за Вмъкване, Мащаб в прозорец и Снимка на екрана.</p>';
// The Map chapter (Task 785): terms after the ruled keys table. Held by dev/lpn-spike/user-guide-map-harness.js.
$ec_lang['lpn_guide_map_undo_term']='Отмяна и Повторение';
$ec_lang['lpn_guide_map_undo_def']='<p>Ctrl+Z отменя последната промяна, а Ctrl+Y или Ctrl+Shift+Z я повтаря. В клетка на Таблиците клавишите принадлежат на проекта, докато клетката е само избрана, и на текста в клетката, след като е започнало въвеждането. Страницата пази последните 20 стъпки, само в паметта, а превключването на проекти ги изчиства. Стъпката възстановява сценариите, отворения сценарий и единиците заедно с чертежа.</p>';
$ec_lang['lpn_guide_map_del_def']='<p>Delete или Backspace изтрива избраното, освен докато се пише в поле, където клавишът принадлежи на полето. Когато нищо не е избрано, Delete го казва, а Backspace не прави нищо. Една Отмяна връща изтриването на няколко елемента. В сценарий, различен от Базовия, Изтриване не премахва елемент, който съществува в Базовия; записът за Сценарния мениджър описва какво прави.</p>';
$ec_lang['lpn_guide_map_esc_term']='Esc';
$ec_lang['lpn_guide_map_esc_def']='<p>Esc, който затваря меню, падащ списък или кутия, не прави нищо друго. Кутиите Свойства, Настройки и Библиотеки се затварят само когато фокусът е в кутията, а показалецът е над нея. Когато нито една от тях не е отворена, Esc връща активния инструмент към Избор, а в Избор изчиства избраното. Недочертана тръба иска един Esc, за да се изостави, и втори, за да се върне към Избор. В поле Esc принадлежи на полето.</p>';
$ec_lang['lpn_guide_map_letters_term']='Букви, цифри и клавиши за мащаб';
$ec_lang['lpn_guide_map_letters_def']='<p>W стартира Мащаб в прозорец, A стартира избор на област (повторното натискане на A преминава през прозорец, ласо и многоъгълник), а F чертае Фигура. Клавишът плюс или равно приближава, а клавишът минус отдалечава, с една стъпка на колелото. Тези клавиши и цифрите от 0 до 9 не правят нищо на картата, когато друг клавиш ги превръща в пряк път, като Ctrl+C, не правят нищо при писане в поле и оставят буквите на отвореното меню на неговите редове. Цифра, въведена върху избрана клетка на Таблиците, презаписва клетката, вместо да избира инструмент.</p>';
// The Tables chapter (Task 785): terms after the two ruled key tables. Held by dev/lpn-spike/user-guide-tables-harness.js.
$ec_lang['lpn_guide_tbl_tabs_term']='Разделите';
$ec_lang['lpn_guide_tbl_tabs_def']='<p>За да отворите панела, щракнете върху бутона Долен панел или изберете Вода, Таблици. Разделите му, отляво надясно, са Възли, Резервоари, Цистерни, Тръби, Помпи, Вентили, Текст, Абонати, Фигури, Настройки, Сценарии, Времеви редове, Профил, Честота и Баланс на водните количества. Разделът Сценарии се показва, когато Основен режим е изчистен. Ширината, редът и видимостта на колоните се пазят в този браузър, не в проекта.</p>';
$ec_lang['lpn_guide_tbl_cell_term']='Избиране, въвеждане и редактиране на клетка';
$ec_lang['lpn_guide_tbl_cell_def']='<p>Клетката е в едно от три състояния. Докато е само избрана, клавишите със стрелки се движат от клетка на клетка, а Ctrl+Z е Отмяната на проекта. Въвеждането на знак върху избрана клетка започва въвеждане: напечатаният текст заменя стойността, а клавиш със стрелка го потвърждава и преминава към следващата клетка. F2 или двойно щракване отваря клетката за редактиране: курсорът е в стойността, а клавишите със стрелки го движат. При въвеждане и при редактиране Ctrl+Z отменя писането. Esc отказва въвеждането или редактирането и оставя клетката избрана.</p>';
$ec_lang['lpn_guide_tbl_fill_term']='Попълване, филтри и сценарии';
$ec_lang['lpn_guide_tbl_fill_def']='<p>Ctrl+D попълва избран диапазон надолу от горния му ред, а Ctrl+Enter го попълва със стойността на активната клетка. И двете не докосват колоната ID и клетките само за четене, а известие посочва колко клетки са попълнени и колко не са променени. Ctrl+Shift+L показва само елементите, избрани на картата. При включен филтър Ctrl+A и Ctrl+D действат само върху показаните редове, а ред, редактиран така, че вече не съвпада, остава, докато филтърът не бъде приложен отново.</p><p>В сценарий, различен от Базовия, редакция на клетка, Ctrl+D, Ctrl+Enter и поставяне се запазват като свои стойности на отворения сценарий.</p>';
// The Boxes chapter (Task 785): terms after Tom's two paragraphs. Held by dev/lpn-spike/user-guide-boxes-harness.js.
$ec_lang['lpn_guide_bx_dock_term']='Закрепване и раздели';
$ec_lang['lpn_guide_bx_dock_def']='<p>В ъгъла на заглавната лента на кутията има Закрепване вляво от картата, Закрепване вдясно от картата и Плаващ, а щом кутията е закрепена, и Автоматично скриване. Закрепената кутия е колона до картата. С Автоматично скриване тя е раздел на тясна лента в края на картата. Разделът отваря кутията при посочване, след 150 ms с мишка или писалка, или при щракване или докосване, а кутията се прибира обратно в раздела си, както е описано по-горе. Прибраната кутия все още е отворена. Ред в менюто или бутон на лентата с инструменти, който я отваря, я изважда от раздела ѝ.</p><p>Влаченето на закрепена кутия за заглавната лента я прави плаваща и изключва автоматичното скриване. Кутиите, закрепени от една страна, споделят една ширина, а картата запазва поне 320 px. Разделите се пренареждат с влачене или с натискане на Alt+Нагоре или Alt+Надолу върху раздел с фокус.</p>';
$ec_lang['lpn_guide_bx_keep_term']='Какво помни една кутия';
$ec_lang['lpn_guide_bx_keep_def']='<p>Всяка кутия пази в този браузър къде плава, размера си, дали е отворена, от коя страна е закрепена, дали се скрива автоматично, закрепената си ширина и мястото на раздела си. Свойства, Критичност: анализ, Мащабиране на потребността и Калибриране пазят само страната на закрепване, автоматичното скриване, мястото на раздела и дали са отворени; къде плават, трае до презареждане на страницата. Браузър без запазена подредба започва с някои кутии, закрепени като раздели, и нищо не се съхранява, докато кутия не бъде променена.</p>';
$ec_lang['lpn_guide_bx_phone_term']='На телефон';
$ec_lang['lpn_guide_bx_phone_def']='<p>При 640 px или по-тесен екран никоя кутия не се закрепва, а всяка кутия заема целия прозорец. Бутоните за закрепване не се предлагат. Закрепената подредба се запазва и се връща при по-широк прозорец.</p>';
// The Fire flow analysis chapter (Task 785), in the entry for its box. Held by dev/lpn-spike/user-guide-fireflow-harness.js.
$ec_lang['lpn_guide_ff_asks_term']='Какво се иска от всеки възел';
$ec_lang['lpn_guide_ff_asks_def']='<p>Всеки изпитван възел получава два теста, върху копие на мрежата в показаната времева стъпка и в отворения сценарий. Първият пита колко водно количество може да достави възелът, докато държи остатъчното налягане. В възела се тегли водно количество, а повторните изчисления го стесняват, до таван, равен на 10000 gpm. Възел, който при тавана още държи остатъчното налягане, се отчита като доставящ повече от тавана. Вторият тест, проектната проверка, тегли изисканото водно количество във възела и пита дали друг възел в обхвата му пада под Най-ниско допустимо налягане другаде или някоя тръба в обхвата му надвишава Най-високата допустима скорост. Проектната проверка не се прави, когато обхватът ѝ е Няма.</p><p>Възел със собствено свойство Изисквано противопожарно водно количество се изпитва спрямо тази стойност, а всеки друг възел спрямо стойността в кутията.</p>';
$ec_lang['lpn_guide_ff_result_term']='Как се четат резултатите';
$ec_lang['lpn_guide_ff_result_def']='<p>Обобщението брои възлите, които са преминали всички проверки, възлите, които не са издържали на противопожарното водно количество, и възлите, които са повлияли на останалата част от системата. Таблицата изброява за всеки изпитан възел Статичното налягане, преди да се тегли противопожарно водно количество, Изисквано количество, Налягане при изисквано количество, Налично количество, Задържано остатъчно, Най-лош ефект и Проектна граница на проектната проверка, броя на Изчисленията, тоест броя на изчисленията на цялата мрежа, и Видовете отказ. Клетка без число показва тире, никога нула. Възел, който не може да бъде изчислен, показва причината си вместо числа. Таблицата отпечатва най-много 200 възела и посочва колко не е отпечатала.</p>';
$ec_lang['lpn_guide_ff_marks_term']='Пръстени, Спри и един анализ наведнъж';
$ec_lang['lpn_guide_ff_marks_def']='<p>След изчисление кръгът на всеки изпитан възел е очертан на картата според резултата му, а очертанията се различават по щриха, както и по цвета. Изберете Избраните възли, за да изпитате само възлите, избрани на картата; всичко друго, което е избрано, се брои и не се изпитва. Спри прекратява изчислението и запазва вече завършените възли. Само един от анализите на противопожарното водно количество, критичността и мащабирането на потребността работи в даден момент.</p>';
$ec_lang['lpn_guide_ff_example_def']='<p>Отворете примера Net1, изберете Вода, Анализ, Анализ на противопожарно водно количество… и щракнете върху Изчисли с кутията такава, каквато се отваря. Времевата стъпка е 0:00, а изчислението решава цялата мрежа 135 пъти. Осем от деветте възела преминават всички проверки. Възел N32 не издържа противопожарното водно количество: статичното му налягане е 111 psi, остават само 1,19 psi при изискваните 1000 gpm, а наличното му водно количество е 892 gpm. Възел N31 може да достави 1339 gpm, а Възел N12 повече от 10000 gpm.</p>';
// The Criticality analysis chapter (Task 785). Held by dev/lpn-spike/user-guide-criticality-harness.js.
$ec_lang['lpn_guide_cr_case_term']='Какво прави всеки случай';
$ec_lang['lpn_guide_cr_case_def']='<p>За всяка връзка в обхвата връзката се прави неактивна върху копие на мрежата, а копието се изчислява в показаната времева стъпка в отворения сценарий. Едно изчисление е по едно решение за всяка връзка и още едно без нищо повредено. Възел, останал без отворен път до резервоар или цистерна, е откъснат: той се премахва преди решението, а потребността му се брои като Неудовлетворена потребност. От възлите, които остават свързани, Възли под минимума изброява онези, чието налягане пада под Най-ниско допустимо налягане. Възел, който вече е под него без нищо повредено, не се зачита срещу никоя връзка, а обобщението посочва колко са. Най-ниско допустимо налягане е същата настройка като кутията Най-ниско допустимо налягане другаде в кутията „Противопожарно водно количество: анализ“.</p>';
$ec_lang['lpn_guide_cr_dead_term']='Задънени краища и списъкът';
$ec_lang['lpn_guide_cr_dead_def']='<p>Задънена връзка е онази, чието премахване откъсва възли, до които може да се стигне само през нея. Всичко отвъд нея е нейната загуба, затова при отметнато Пропусни задънените връзката не се изчислява, а обобщението посочва колко са пропуснати. Списъкът показва за всяка връзка Неудовлетворената потребност, Откъснатите възли и Възлите под минимума, всяка с числото и първите пет ID, а щракване върху ID отива до него на картата. Връзките, които струват нещо на системата, са изброени първи, докато не се щракне върху заглавие на колона за сортиране, а обобщението ги брои спрямо броя на изпитаните връзки. Изберете Избрани връзки, за да повредите само връзките, избрани на картата.</p>';
$ec_lang['lpn_guide_cr_example_def']='<p>Отворете примера Net1, изберете Вода, Анализ, Анализ на критичността…, въведете 116 за Най-ниско допустимо налягане и щракнете върху Изчисли. Времевата стъпка е 0:00, а изчислението решава цялата мрежа 14 пъти. Четири от 13-те връзки свалят възел под 116 psi, когато са изключени: L9 (N10, N11 и N21), L10 (N11 и N21), L111 (N21 и N22) и L112 (N21 и N22). Два възела вече са под 116 psi без нищо повредено и не се зачитат. Тъй като Net1 е с контури, загубата на една връзка никога не оставя възел без захранване.</p>';
// The Demand scaling chapter (Task 785). Held by dev/lpn-spike/user-guide-demandscale-harness.js.
$ec_lang['lpn_guide_ds_run_def']='<p>Изчисли умножава потребностите в избраните възли по Мащаба на потребността, върху копие на мрежата в показаната времева стъпка и в отворения сценарий. Прави две решения, едното с потребностите такива, каквито са, и другото мащабирано. Резултатът изброява Най-ниските налягания и Най-високите скорости, всяка със стойността Мащабирано до Немащабирано, което е стойността, която показва картата. Всеки списък има десет реда, а кутията посочва колко връзки не показва. Мащабът на потребността се прилага допълнително към множителя на потребността на отворения сценарий и никога не се записва в проекта.</p>';
$ec_lang['lpn_guide_ds_find_def']='<p>Търси претърсва мащабите на потребността от 0 до 20, до най-близките 0,01, за най-големия, при който всеки избран възел запазва поне Най-ниско допустимо налягане. Той отчита мащаба и най-ниското налягане при него, и същото за следващата стъпка нагоре, където налягането за първи път пада под границата. Ако потребностите, както са въведени, вече оставят възел под границата, отговорът е отбелязан със знак за предупреждение. Ако всеки възел запазва границата при 20, отговорът го казва. Спри прекратява търсене без отговор. Най-ниско допустимо налягане е същата настройка като кутията Най-ниско допустимо налягане другаде в кутията „Противопожарно водно количество: анализ“.</p>';
$ec_lang['lpn_guide_ds_scope_term']='Възли и времевата стъпка';
$ec_lang['lpn_guide_ds_scope_def']='<p>При Избраните възли само възлите, избрани на картата, се мащабират и проверяват. Другите възли се оставят както са, а онези, които падат под границата, се изброяват, без да ограничават отговора. Мащабира се само показаната времева стъпка, а нивата и състоянията се вземат от нея. За да изпитате пика, преместете часовника към пиковата потребност, преди да изчислите.</p>';
$ec_lang['lpn_guide_ds_example_def']='<p>Отворете примера Net1 и изберете Вода, Анализ, Мащабиране на потребността…. При времевата стъпка 0:00 щракнете върху Търси с кутията такава, каквато се отваря. Всеки възел запазва поне 20 psi до мащаб на потребността 5,76, където най-ниското налягане е 20,11 psi във възел N32. При 5,77 то е 19,8 psi, а търсенето отне 13 решения. Въведете 3 за Мащаб на потребността и щракнете върху Изчисли: Възел N32 пада от 111 psi, немащабирано, на 85,99 psi, а Връзка L112 се покачва от 0,535 ft/sec на 3,13 ft/sec.</p>';
// The Pump energy chapter (Task 785). Held by dev/lpn-spike/user-guide-energy-harness.js.
$ec_lang['lpn_guide_en_read_term']='Как се чете отчетът';
$ec_lang['lpn_guide_en_read_def']='<p>Изберете Вода, Отчети, Енергия на помпите. Отчетът интегрира мощността на всяка помпа през последното изчисление за период от време, затова изисква Общо време на изпълнение, по-голямо от 0, и изчисление. За всяка помпа той изброява % от изпълнението, Ефект., Ср. kW, Пик. kW, kWh и Разход. Ср. kW е средното, докато помпата е работила, а не за периодите на престой. Под таблицата са Използвана енергия, Разход за енергия, Пиково потребление на мощност, Разход за пиково потребление и Общ разход. Мрежа без помпи няма какво да отчете.</p>';
$ec_lang['lpn_guide_en_set_term']='Какво определя числата';
$ec_lang['lpn_guide_en_set_def']='<p>Настройки, Енергия съдържа Ефективност на помпата (процент), използвана за всяка помпа без крива на ефективност, Цена на енергията за един киловатчас, График на цената, който умножава цената на всяка стъпка от графика, Такса за пиково потребление за kW и текст Валута, който се отпечатва до разходите и не преобразува разходите. Помпа може да има своя цена, свой график на цената и своя крива на ефективност в Свойствата. Цените, графикът, таксата за пиково потребление, Ефективността на помпата (процент) и собствените стойности на помпата са в категория Цена на енергията, така че сценарий може да ги замести. Когато не е зададена цена или цената е нула, всеки разход е нула и отчетът го казва. Приложението не предлага цена.</p>';
$ec_lang['lpn_guide_en_example_def']='<p>Отворете примера Net1, който има общо време на изпълнение 24:00, и изчислете. Изберете Вода, Отчети, Енергия на помпите. Помпа L9 работи 65,71% от изпълнението с ефективност 75% и използва средно 96,22 kW, 96,71 kW в пика и 1518 kWh. Не е зададена цена, така че разходът е 0 и отчетът го казва. Въведете 0,12 за Цена на енергията в Настройки, Енергия и изчислете отново: разходът на L9 е 182, Общият разход.</p>';
// The Contour plot chapter (Task 785). Held by dev/lpn-spike/user-guide-contour-harness.js.
$ec_lang['lpn_guide_ct_what_term']='Какво е картата с изолинии';
$ec_lang['lpn_guide_ct_what_def']='<p>Изберете Вода, Графики, Изолинии. Редът включва картата в отворения сценарий, като плавно запълване с надписани линии, като използва налягането, ако възлите още не са оцветени, и отваря кутията. Картата разпростира цветовете на възлите по тръбите и до зададено кратно на медианната дължина на тръбите покрай тях, избледнявайки във външната част. Тя не оцветява през помпи, вентили или затворени връзки. Редът под цветовия ключ посочва колко възела и тръби използва картата, обхвата покрай тръбите и интервала на линиите. При твърде малко възли го казва.</p>';
$ec_lang['lpn_guide_ct_box_term']='Кутията';
$ec_lang['lpn_guide_ct_box_def']='<p>Показване на изолиниите, когато е изчистено, скрива запълването и линиите и запазва цветовете на възлите. Кутията съдържа още Оцвети възлите по и Цветова схема, които са същите две настройки като в Настройки, Визуализация, Цветове на възлите, Запълване (Няма, Плавно или Ивици, което оцветява всеки клас плоско), Непрозрачност на запълването, Изолинии с техните Интервал и Етикети, и Обхват в кратни на медианната дължина на тръбите. В проект, поставен на Земята, кутията може да вземе и терена между възлите от Mapbox DEM, след като посетителят се съгласи да изпрати номерата на плочките за областта на мрежата. Тези настройки се запазват с проекта и могат да бъдат заместени от сценарий. Картата променя само показването, не и мрежата.</p>';
$ec_lang['lpn_guide_ct_example_def']='<p>Отворете примера Net1 и изберете Вода, Графики, Изолинии. Възлите са оцветени по налягане, а редът под цветовия ключ посочва 9 възела, 11 тръби, обхват 2,5 пъти медианната дължина на тръбите покрай тях и линии през всеки 5 psi. Помпата, Връзка 9, не е една от 11-те тръби. Когато Показване на изолиниите е изчистено, възлите остават оцветени по налягане.</p>';
// The Run report, Status changes, and Full report chapters (Task 785). Held by dev/lpn-spike/user-guide-reports-harness.js.
$ec_lang['lpn_guide_rr_what_term']='Какво съдържа отчетът';
$ec_lang['lpn_guide_rr_what_def']='<p>Изберете Вода, Отчети, Изпълнение. Отчетът е текстът, който модулът на EPANET е записал за последното изчисление за период от време, на страници. Започва със заглавния ред и името на мрежата, след това брои възлите, резервоарите, цистерните, тръбите, помпите и вентилите, после посочва опциите на анализа и накрая изброява хидравличното състояние на изчислението с предупрежденията му. Бутонът Копирай копира текста.</p>';
$ec_lang['lpn_guide_rr_example_def']='<p>Отворете примера Net1, който вече е изчислен, и изберете Вода, Отчети, Изпълнение. Обобщението брои 9 възела, 1 резервоар, 1 цистерна, 12 тръби, 1 помпа и 0 вентила. Формулата за загуба на напор е Hazen-Williams, хидравличната стъпка във времето е 1,00 hrs, а общата продължителност е 24,00 hrs.</p>';
$ec_lang['lpn_guide_st_what_term']='Какво се изброява';
$ec_lang['lpn_guide_st_what_def']='<p>Изберете Вода, Отчети, Промени на състоянието. Всеки ред дава момента на промяна и самата промяна: помпа, вентил или тръба, които вече са отворени или затворени, или цистерна, която вече се пълни, изпразва, е пълна или е празна. Времева стъпка, която не се е сходила напълно, също е изброена. Списъкът е във времеви ред и съдържа само промени, не всяка стъпка. Чете се от същото изчисление за период от време като панела Таблици и Пълния отчет.</p>';
$ec_lang['lpn_guide_st_example_def']='<p>Отворете примера Net1 и изберете Вода, Отчети, Промени на състоянието. Цистерна N2 вече се пълни в 1:00, изпразва се в 11:00, пълни се в 16:00 и се изпразва в 22:00. Помпа L9 вече е затворена в 10:00, вече е отворена в 15:00 и вече е затворена в 21:00.</p>';
$ec_lang['lpn_guide_fr_what_def']='<p>Изберете Вода, Отчети, Пълен. Таблицата има по един ред за всеки възел и всяка връзка при всяка стъпка на отчитане, в единиците на панела Таблици. Колоните ѝ са Вид, ID, Потребност, Напор, Налягане, Концентрация на хлор, Водно количество, Скорост, Загуба на напор, Напор на помпата и Състояние, а клетката е празна, когато елементът няма такава величина. Списъкът Стъпка от времето избира показаната стъпка, а Изтегли CSV и Отпечатай отчета носят всяка стъпка. Без изчисление за период от време таблицата показва текущото решение в един момент.</p>';
$ec_lang['lpn_guide_fr_example_def']='<p>Отворете примера Net1 и изберете Вода, Отчети, Пълен. 24-те елемента са изброени при 25 стъпки на отчитане, от 0:00 до 24:00, което прави 600 реда. В 0:00 Възел 11 има потребност 150 gpm, напор 985,23 ft H2O и налягане 119,26 psi.</p>';
// The Calibration chapter (Task 785). Held by dev/lpn-spike/user-guide-calibration-harness.js.
$ec_lang['lpn_guide_cal_what_term']='Какво сравнява отчетът';
$ec_lang['lpn_guide_cal_what_def']='<p>Изберете Вода, Отчети, Калибриране. Списъкът Параметър избира какво измерва файлът: Потребност, Напор, Налягане, Концентрация на хлор, Водно количество или Скорост. За всеки параметър се държи по един файл, а бутонът Зареди файл за калибриране… отваря избор на файл. Отчетът има три страници. Статистики дава за всяко място броя на наблюденията, средното наблюдавано, средното изчислено, средната грешка и СКГ, след това ред Мрежа за всички места заедно и корелацията между средните. Корелационна диаграма поставя всяко измерване по наблюдаваната му стойност хоризонтално и изчислената му стойност вертикално, с диагонална линия там, където двете съвпадат. Сравнения на средните чертае наблюдаваните и изчислените средни като двойка стълбове за всяко място.</p><p>Изчислената стойност се чете от изчислението за период от време, а измерване между две стъпки на отчитане се сравнява със стойността, интерполирана между тях. Измерване извън моментите, които изчислението е отчело, се пропуска и се брои. При решение за един момент всяко измерване се сравнява с този единствен резултат, независимо какъв момент дава файлът. Отчетът се попълва, след като мрежата бъде изчислена.</p>';
$ec_lang['lpn_guide_cal_file_term']='Файлът за калибриране';
$ec_lang['lpn_guide_cal_file_def']='<p>Текстов файл с ID на място, време и измерена стойност на всеки ред. Времето се мери от началото на симулацията, в десетични часове или часове:минути. Точка и запетая започва коментар. Ред само с време и стойност принадлежи на мястото над него. Стойностите се четат в единиците на проекта, а отчетът казва коя е единицата. Място, което не е в мрежата, се изброява, а измерванията му се броят като пропуснати, ред, който не може да се прочете, се изброява по номер на ред, а останалата част от файла се използва. Файлът се държи в паметта за отворения проект и само за това зареждане на страницата. Той не се записва с проекта, нито на това устройство. Когато графиката Времеви редове показва същата величина, измерените стойности са начертани върху нея като кръгове.</p>';
$ec_lang['lpn_guide_cal_example_def']='<p>Отворете примера Net1, изчислете го и изберете Вода, Отчети, Калибриране. При избрано Налягане заредете файл, който дава Възел 11 като 118,5 psi в 0:00 и 121,0 psi в 12:00, Възел 31 като 110,2 psi в 6:00 и 108,7 psi в 18:00 и Възел 99 като 50 psi в 0:00, следвани от ред, който не е данни. Отчетът казва, че файлът има 5 измервания на 3 места, назовава Възел 99 като липсващ в мрежата с 1 пропуснато измерване и изброява нечетимия ред. Статистики показва Възел 11 с 2 наблюдения, средно наблюдавано 119,75 psi, средно изчислено 116,53 psi, средна грешка 3,98 и СКГ 5,12. Възел 31 има 109,45, 118,71, 9,26 и 9,79. Редът Мрежа има 4 наблюдения, средна грешка 6,62 и СКГ 7,81.</p>';
// Where the Guide lists its own keys, so that a search for one finds it.
$ec_lang['lpn_guide_using_heading']='Използване на ръководството';
$ec_lang['lpn_guide_keys_term']='Клавишни комбинации на ръководството';
$ec_lang['lpn_guide_keys_def']='<table class="lpn-notes-table"><tbody><tr><td>?</td><td>Отваря ръководството при бутона на лентата с инструменти или реда на менюто под показалеца или с фокус. На друго място го отваря с избрано поле за търсене. Клавишът не го отваря, докато се пише в поле или докато е отворен въпрос.</td></tr><tr><td>F1</td><td>Отваря ръководството при записа за кутията, която има фокус.</td></tr><tr><td>Ctrl+K</td><td>Отваря ръководството с избрано поле за търсене и с избрания текст, до 80 знака, в него. Заменя собственото Ctrl+K на браузъра, освен когато е отворен въпрос, тогава ръководството не се отваря.</td></tr><tr><td>/</td><td>Избира полето за търсене, докато ръководството има фокус.</td></tr><tr><td>Esc</td><td>Докато ръководството има фокус, го затваря и връща фокуса там, където е бил.</td></tr></tbody></table>';
$ec_lang['lpn_guide_use_term']='Търсене, връзки и какво се помни';
$ec_lang['lpn_guide_use_def']='<p>Търсенето пренебрегва главните букви и ударенията и изброява редовете и записите, които съдържат въведения текст. Изборът на ред показва къде е този контрол. Той никога не изпълнява контрола. На телефон, където лентата с инструменти е прибрана, ред от лентата отваря реда на менюто, който върши същото.</p><p>Адресът на страницата следва четения запис, както в <code>Looped-Network.php#guide</code>, така че може да се копира като връзка към този запис. Затварянето на ръководството го изчиства. Ръководството помни в този браузър дали е било отворено, положението и размера си и дали списъкът му със съдържание е скрит. На телефон списъкът със съдържание започва скрит.</p>';
// Under a toolbar button in the User guide, naming the menu row that does the same thing.
// {menu} becomes a path such as "Edit > Delete", drawn with chevrons; keep {menu} as it is.
$ec_lang['lpn_guide_also']='Също в {menu}';
$ec_lang['lpn_guide_how_popup']='Свойства се отваря, когато изберете обект или текст.';
$ec_lang['lpn_guide_not_shown']='Този контрол в момента не е на екрана.';
// The box's two context headings. "Tables" holds the two table-help entries that used to sit only
// in the Notes list (lpn_notes_6/7, moved rather than duplicated); "Map" is new -- the digit tool
// keys, Undo and the zoom keys had never been gathered anywhere before.
$ec_lang['lpn_hotkeys_tables_heading']='Таблици';
$ec_lang['lpn_hotkeys_map_heading']='Карта';
$ec_lang['lpn_hotkeys_map_term']='Клавишни комбинации за картата';
// Same shape as lpn_notes_7_def: one table, one row per key. The ten digits are LPN_TOOL_KEYS in
// js/looped-network.js; Select also answers to Esc and Delete to the Delete key
// (LPN_TOOL_ALT_KEYS); Ctrl+Z is undo(); +/- and = are keyZoom() (ROADMAP Task 682).
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>0 или Esc</td><td>Избор.</td></tr><tr><td>2</td><td>Добавя възел.</td></tr><tr><td>3</td><td>Добавя резервоар.</td></tr><tr><td>4</td><td>Добавя цистерна.</td></tr><tr><td>5</td><td>Добавя тръба.</td></tr><tr><td>6</td><td>Добавя помпа.</td></tr><tr><td>7</td><td>Добавя вентил.</td></tr><tr><td>8</td><td>Добавя абонат.</td></tr><tr><td>9</td><td>Добавя текст.</td></tr><tr><td>Delete</td><td>Изтрива избраното.</td></tr><tr><td>Ctrl+Z</td><td>Отменя последната промяна.</td></tr><tr><td>+ или =</td><td>Увеличава мащаба.</td></tr><tr><td>-</td><td>Намалява мащаба.</td></tr></tbody></table>';
// The W row of the Map table. Its own key, spliced into the table by Looped-Network.php, because a new row in
// lpn_hotkeys_map_def is new markup that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_zoomwin_def']='Мащаб в прозорец: плъзнете правоъгълник върху картата, за да увеличите тази област.';
// The menu chords (Task 748): Alt+Shift+letter on Windows and Linux, Ctrl+Option on a Mac, and F10.
// Exactly two rows (Tom, 2026-10-03: "show only the Alt+Shift and the F10"); the letters themselves
// are assigned per language by menuMnemonics() and shown on the menus, never listed here.
// A separate block rather than rows in lpn_hotkeys_map_def, because a new row there is new markup
// that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_menu_heading']='Менюта';
$ec_lang['lpn_hotkeys_menu_term']='Клавишни комбинации за менюто';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+буква</td><td>Отваря менюто с тази буква, после натиснете буквата на реда, за да го изберете. Буквите се виждат, докато ползвате клавиатурата. На Mac използвайте Ctrl+Option.</td></tr><tr><td>F10</td><td>Преминава към лентата с менюта.</td></tr></tbody></table>';
// The Screenshot keys. A separate block, for the reason given above the menu block.
$ec_lang['lpn_hotkeys_snip_heading']='Снимка на екрана';
$ec_lang['lpn_hotkeys_snip_term']='Клавишни комбинации за снимка на екрана';
$ec_lang['lpn_hotkeys_snip_def']='<table class="lpn-notes-table"><tbody><tr><td>S</td><td>Изрязване, докато е отворена Снимка на екрана.</td></tr><tr><td>E</td><td>Гумичка, в изгледа за маркиране.</td></tr><tr><td>Ctrl+Z, Ctrl+Y</td><td>Отмяна и повторение, в изгледа за маркиране.</td></tr><tr><td>Esc</td><td>Отказ от изрязване или излизане от гумичката. В изгледа за маркиране го затваря, когато няма нищо начертано.</td></tr></tbody></table>';
// ---- "Something wrong here?" (ROADMAP Tasks 207 and 768) ----
// Two sites, one behaviour -- a standing cell in the map's bottom strip, and the same control inside
// the solver's diagnostic box when one is on screen. The first click opens a box; Send is the second.
// The thank-you must never imply an answer: a reply comes only to somebody who left an address.
$ec_lang['lpn_wrong_btn']='Нещо не е наред тук?';
// The standing message's own Hide control. A hidden message leaves the map and waits as the top row of the
// message history (the down-arrow glyph), marked by lpn_msglog_hidden, with lpn_msglog_unhide to bring it back.
$ec_lang['lpn_msglog_hidden']='Скрито';
$ec_lang['lpn_msglog_unhide']='Показване';
$ec_lang['lpn_status_hidden_tip']='Показва скритото съобщение на картата отново.';
// Rewritten for the two-click box (Task 768); TGH's 2026-09-07 wording described one press.
$ec_lang['lpn_wrong_tip']='Докладвайте грешка на тази страница. Отваря се кутия, в която можете да изберете проблема, да добавите коментар и да въведете имейл адрес, ако желаете отговор. Всички полета са по избор и нищо не се изпраща, докато не натиснете Изпрати.';
$ec_lang['lpn_wrong_thanks']='Благодарим ви. Съобщението ви беше получено.';
// The box "Something wrong here?" opens (ROADMAP Task 768). Every field is optional; Send with
// nothing in it posts only the anonymous tally the button always posted. The four picks are canned
// phrases a visitor may toggle in any combination. lpn_fb_sends must stay true to send-feedback.php
// and to the "Messages you send us" row of privacy.php.
$ec_lang['lpn_fb_intro']='Готови съобщения (по желание). Нищо не се изпраща, докато не натиснете Изпрати.';
$ec_lang['lpn_fb_pick_numbers']='Числата изглеждат грешни';
$ec_lang['lpn_fb_pick_broken']='Нещо не работи';
$ec_lang['lpn_fb_pick_wording']='Текстът или преводът е грешен';
$ec_lang['lpn_fb_pick_confusing']='Това е неясно';
$ec_lang['lpn_fb_comment']='Коментари (по желание)';
$ec_lang['lpn_fb_email']='Имейл (по желание, само ако искате отговор)';
$ec_lang['lpn_fb_sends']='Какво се изпраща: името на тази страница, вашият език, версията на сайта, кодът на съобщението на картата, ако има такова, и това, което сте избрали или въвели. Никога чертежът или мрежата ви. Имейл адресът ви се използва само за отговор.';
$ec_lang['lpn_fb_send']='Изпрати';
$ec_lang['lpn_fb_sending']='Изпращане…';
$ec_lang['lpn_fb_failed']='Съобщението не стигна до нас. Написаното е още тук, така че можете да опитате отново.';
$ec_lang['lpn_fb_bad_email']='Този имейл адрес не изглежда правилен. Поправете го или го оставете празен.';
$ec_lang['lpn_fb_busy']='През последните няколко минути са получени твърде много съобщения. Написаното е още тук, така че можете да опитате по-късно.';
$ec_lang['lpn_status_example_opened']='Отворен е {name} като копие. Запишете го с Файл, Запиши като.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Тази страница не успя да изчисли размера на областта на картата, затова картата показва последния изглед, който е успяла да изчисли. Преоразмеряването на прозореца я кара да опита отново. Ако това продължава да се случва, обичайната причина е разширение на браузъра, което блокира измерванията на страницата.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Основна мрежа, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Два резервоара, помпа и малък пръстен. Литри в секунда, с метри и милиметри.';
$ec_lang['lpn_ex_basic_us_title']='Основна мрежа, gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='Два резервоара, помпа и малък пръстен. Галони в минута, с футове и инчове.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 плюс управления, базирани на правила';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Измислен пример на EPANET с хлор, 1 резервоар и 1 цистерна.';
$ec_lang['lpn_ex_net1_si_title']='EPANET Net1 плюс управления, базирани на правила, L/s (SI)';
$ec_lang['lpn_ex_net1_si_desc']='Литри в секунда, с метри и милиметри. Измислен пример на EPANET, преобразуван от галони в минута, футове и инчове, с хлор, 1 резервоар, 1 цистерна, 1 помпа и две управления, базирани на правила.';
$ec_lang['lpn_ex_net2_si_title']='EPANET Net2, L/s (SI)';
$ec_lang['lpn_ex_net2_si_desc']='Литри в секунда, с метри и милиметри. Пример на EPANET при Бранфорд, Кънектикът, преобразуван от галони в минута, футове и инчове: 35 възела и 1 цистерна, без резервоар, помпа и вентили, около 2 km на 4 km. Флуоридът, нереактивно вещество, постъпва през един източник.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Галони в минута, с футове и инчове. Пример на EPANET при Бранфорд, Кънектикът: 35 възела и 1 цистерна, без резервоар, помпа и вентили, около 1 миля на 2 мили. Флуоридът, нереактивно вещество, постъпва през един източник.';
$ec_lang['lpn_ex_net3_si_title']='EPANET Net3, L/s (SI)';
$ec_lang['lpn_ex_net3_si_desc']='Литри в секунда, с метри и милиметри. Пример на EPANET при Новато, Калифорния, преобразуван от галони в минута, футове и инчове, със световната карта зад него: 92 възела, 3 цистерни и 2 резервоара, без вентили, около 8 km на страна. 24-часово изчисление за период от време, с проследяване на източник от Езерото.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Галони в минута, с футове и инчове. Пример на EPANET при Новато, Калифорния, със световната карта зад него: 92 възела, 3 цистерни и 2 резервоара, без вентили, около 5 мили на страна. 24-часово изчисление за период от време, с проследяване на източник от Езерото.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center, gpm (US)';
$ec_lang['lpn_ex_elm_street_desc']='Галони в минута, с футове и инчове. Прескът Вали, Аризона: 17 възела, 1 резервоар и 1 помпа. Търговски обект, решен за пожарно водно количество върху максималната дневна потребност, в един момент от времето, начертан върху план на обекта.';
$ec_lang['lpn_tool_undo']='Отмяна';
$ec_lang['lpn_confirm_example']='Това ще добави примера към мрежата, която вече имате. Продължавате ли?';
$ec_lang['lpn_field_diameter']='Диаметър';
$ec_lang['lpn_demand_tip']='Водни количества, изтеглени от мрежата в този възел. Въведете отрицателно число за водно количество, подадено в мрежата тук.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Тази единица определя как се четат въведените стойности';
$ec_lang['lpn_units_warn_lead']='{unit} е единицата на това, което въвеждате за:';
$ec_lang['lpn_units_options_head']='Когато сменяте единица:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Не е разрушително';
$ec_lang['lpn_units_nondestructive_desc']='Не е разрушително: оставя всяко въведено число такова, каквото е, и го препрочита в новата единица.';
$ec_lang['lpn_units_destructive']='Разрушително';
$ec_lang['lpn_units_destructive_desc']='Разрушително: преизчислява всяко въведено число математически, така че мрежата остава физически почти същата, в границите на точността на преобразуването. Изходните числа се губят. Undo ги връща обратно.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='Стойности, които вече означават {unit} ({n}). Нищо не беше пренаписано.';
$ec_lang['lpn_status_converted']='Стойности, пренаписани в {unit} ({n}).';
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
$ec_lang['lpn_units_length']='Дължина';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Координати на картата';
$ec_lang['lpn_units_mapcoords_deg']='градуси';
$ec_lang['lpn_units_usft']='Американски геодезически фут';
$ec_lang['lpn_units_elevhead']='Кота и напор';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Градиент на загубата на напор';
$ec_lang['lpn_result_gradient_tip']='Загуба на напор, разделена на дължината на тръбата. Използвайте я, за да сравнявате тръби с различна дължина спрямо един и същ проектен лимит.';
$ec_lang['lpn_result_water_age']='Възраст на водата';
$ec_lang['lpn_result_water_age_tip']='Времето, през което водата, достигаща до тази точка, е била в системата. Където потоците се срещат, числото е средната стойност на пристигащите възрасти, претеглена по водно количество. В цистерна това е средната възраст на съхраняваната вода, затова цистерна с бавен обмен обикновено съдържа най-старата вода в мрежата. Няма нормативна граница, с която да се сравнява, затова оценявайте го спрямо условията в моделираната система.';
$ec_lang['lpn_result_source_share']='Дял от източника';
$ec_lang['lpn_result_source_share_tip']='Част от водата, достигаща до тази точка, която идва от възела за проследяване. Това отчита анализът Проследяване на източник.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Средна възраст на водата';
$ec_lang['lpn_result_avg_source_share']='Среден дял от източника';
$ec_lang['lpn_result_avg_concentration']='Средна концентрация';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Коефициент на триене';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Скорост на реакцията';
$ec_lang['lpn_result_status']='Състояние';
$ec_lang['lpn_result_status_open']='Отворен';
$ec_lang['lpn_result_status_closed']='Затворен';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Потенциалната енергия на водата в този възел, изразена като височина на воден стълб. Това е абсолютна височина, а налягането е манометрично измерване.';
// A tank's depth and usable volume (Task 783). Depth is head minus the tank bottom, which is our
// Elevation. Volume is zero at the Lowest water depth, so it is NOT EPANET's tank volume, which also
// counts the water below the lowest water depth (that water is in the mixing volume, it just cannot be drawn down).
$ec_lang['lpn_result_depth']='Дълбочина';
$ec_lang['lpn_result_depth_tip']='Дълбочина на водата в цистерната в показания момент, измерена нагоре от дъното на цистерната: напорът минус котата на цистерната.';
$ec_lang['lpn_result_tank_volume']='Използваем обем';
$ec_lang['lpn_result_tank_volume_tip']='Обем на водата над най-ниската дълбочина на водата, затова е нула при тази дълбочина. Обемът на цистерната в EPANET включва и водата под най-ниската дълбочина на водата, която все пак се отчита при смесването и възрастта на водата, затова котата на цистерната остава на дъното ѝ.';
$ec_lang['lpn_result_pressure']='Налягане';
$ec_lang['lpn_result_flow']='Водно количество';
$ec_lang['lpn_result_velocity']='Скорост';
$ec_lang['lpn_result_headloss']='Загуба на напор';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Нулира само настройките на този проект. Чертежът и другите проекти не се променят. За повторна употреба на набор от настройки запишете проектен файл, съдържащ само настройки.';
$ec_lang['lpn_reset_all_tip']='Изтрива всеки проект, всяко фоново изображение, всяка настройка и избраните от вас единици, след което презарежда страницата точно както я вижда посетител за първи път. Това е единственото нулиране, което изчиства всичко.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Този калкулатор съхранява единиците и въведените стойности на проекта така, както са въведени, но по-рано преобразуваше числата в SI за съхранение. Този проект е записан преди тази промяна, така че числата му са съхранени в SI. Да ги преобразуваме ли за последен път в текущите единици? За да прецените, ето някои диаметри, които биха се преобразували, с техните стойности преди и след:';
$ec_lang['lpn_v2_restore_yes']='Преобразувай';
$ec_lang['lpn_v2_restore_never']='Не. Никога не питай отново.';
$ec_lang['lpn_v2_restore_no']='Затвори, за да проверя първо текущите единици';
$ec_lang['lpn_storage_too_new']='Този проект е записан от по-нова версия на страницата, затова не може да бъде отворен тук.';
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
$ec_lang['lpn_tool_file']='Файл';
$ec_lang['lpn_menu_edit']='Редактиране';
$ec_lang['lpn_menu_insert']='Вмъкване';
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
$ec_lang['lpn_menu_map']='Карта';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Покажи уличната карта';
$ec_lang['lpn_basemap_satellite_show']='Покажи сателитни изображения';
$ec_lang['lpn_basemap_topo_show']='Показвай топографска карта';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='географски привързана';
$ec_lang['lpn_xymap']='локална';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Преобразувай като…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Копие на {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:4326), not a fourth case; EPSG:3857 is a
// projected system in meters since Task 775.
$ec_lang['lpn_convas_title']='Преобразуване като';
$ec_lang['lpn_convas_coordsys_tip']='Координатната система, в която се преобразува копието. Когато се различава от тази на проекта, следват две стъпки за поставяне. При проект, който вече е геопривързан, и двете стъпки се отварят попълнени, готови за приемане или промяна.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Текуща: {crs}';
$ec_lang['lpn_convas_epsg']='Координатна система EPSG';
$ec_lang['lpn_convas_epsg_tip']='Изберете координатна система от регистъра EPSG. Предлаганият избор е WGS 84 (EPSG:4326), географска ширина и дължина. WGS 84 / Pseudo-Mercator (EPSG:3857), обикновено наричана Web Mercator, дава x и y в метри, а разстоянията ѝ по картата надвишават разстоянията на терена, когато се отдалечавате от екватора. Дължините на тръбите се изчисляват като разстояния на терена и в двете системи.';
$ec_lang['lpn_convas_unnamed']='Неименувано (локално) геопривързване';
$ec_lang['lpn_convas_unnamed_tip']='Локални координати в мерната единица за дължина, със свързана карта на света.';
$ec_lang['lpn_convas_none_tip']='Локални координати в мерната единица за дължина, засега без карта на света.';
$ec_lang['lpn_convas_units_tip']='Мерните единици, в които се преобразува копието.';
$ec_lang['lpn_convas_round']='Закръгли преобразуваните стойности';
$ec_lang['lpn_convas_round_tip']='Закръгля само числата, които това преобразуване презаписва, до най-близката избрана от вас стъпка. Стойностите, чиято мерна единица не се променя, се оставят както са.';
$ec_lang['lpn_convas_round_none']='Без закръгляне';
$ec_lang['lpn_convas_round_flow']='Потребност и водно количество';
$ec_lang['lpn_convas_label_col']='Наставка';
$ec_lang['lpn_convas_label_tip']='Текст, добавен след тази стойност в етикетите на картата на копието, например „ mm“ или „ gpm“. Предварително попълнен от мерната единица, избрана по-горе; изчистете го за без наставка.';
$ec_lang['lpn_convas_oneway']='Обратното преобразуване е второ преобразуване, а не отмяна. Число, преобразувано и преобразувано обратно, може да не се върне точно както е било въведено.';
$ec_lang['lpn_convas_ok']='Преобразувай';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} е една от малкото изброени координатни системи без използваема информация за проекцията, затова не може да се преобразува нито към нея, нито от нея. Нищо не бе преобразувано.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='Преобразуваното копие е {name}. Оригиналният проект е непроменен.';
$ec_lang['lpn_convas_cancelled']='Нищо не бе преобразувано. Копието е затворено, а оригиналният проект е непроменен.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Копира този проект в нов раздел и преобразува копието в координатната система и мерните единици, които изберете. Когато координатната система се променя, помощник ви превежда през приблизително мащабиране на картата зад мрежата ви, а после през по-точно мащабиране и завъртане на мрежата върху картата. Този проект остава точно какъвто е. За да геопривържете, без да преобразувате нищо, използвайте вместо това Карта, Карта на света, Прикачи.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Този проект вече е географски привързан, затова мрежата вече е върху картата и нищо не е преместено. Проверете дали е на правилното място, после натиснете бутона Постави модела тук и бутона Запази това разположение.';
$ec_lang['lpn_georef_intro']='Поставянето на модела отнема две стъпки. Стъпка 1 е бързата: моделът стои неподвижен, а вие премествате картата зад него, докато обектът ви застане под модела в приблизително правилния размер. Все още няма завъртане. Стъпка 2 е прецизната: плъзгате, преоразмерявате и завъртате самия модел. Проектът ви отначало е върху карта на целия свят, затова първо намерете местоположението си, после натиснете „Постави модела тук“.';
$ec_lang['lpn_georef_adjust']='Моделът вече е на терена, затова се движи заедно с картата. Плъзнете модела, за да го преместите, плъзнете ъгъл, за да го преоразмерите, плъзнете кръглата дръжка над модела, за да го завъртите. Или въведете разстоянието на терена и ъгъла на завъртане по-долу.';
$ec_lang['lpn_georef_step1']='Стъпка 1 от 2 — бърза';
$ec_lang['lpn_georef_step2']='Стъпка 2 от 2 — прецизна';
$ec_lang['lpn_georef_step1_hint']='Проектът ви остава на мястото си на екрана. Премествайте и мащабирайте картата под него, докато теренът зад него е приблизително на правилното място и с правилния размер, после натиснете „Постави модела тук“.';
$ec_lang['lpn_georef_detach']='Вдигни го отново';
$ec_lang['lpn_georef_size_prompt']='Приблизително колко широк е обектът, през целия проект?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Пряк път: натиснете {key}.';
$ec_lang['lpn_tool_key_hint_two']='Пряк път: натиснете {key} или {key2}.';
$ec_lang['lpn_tool_add_chain_tip']='Верига от възли и тръби: посочете точка на картата, за да добавите възел, после посочете всяка следваща точка, за да добавите тръба и възел. Посочете съществуващ възел, за да продължите от него. Натиснете Escape, за да завършите веригата.';
// The Shape tool (Task 779). The word is Tom's: "we call it a 'Shape'".
$ec_lang['lpn_tool_add_shape']='Фигура';
$ec_lang['lpn_tool_add_shape_tip']='Начертайте точка, полилиния или многоъгълник на картата. Фигурата е анотация и не е част от мрежата. Посочете всяка точка, после посочете отново последната точка, натиснете Enter или щракнете с десния бутон, за да завършите. Посочете отново първата точка, за да затворите фигурата в многоъгълник.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Избор на област с прозорец, ласо или многоъгълник.';
$ec_lang['lpn_area_selected']='{n} избрани.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='В тази област не е намерено нищо.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Добавяне и премахване на пречупните точки на тръбите. Посочете точка върху тръба, за да добавите пречупна точка, изберете пречупна точка, за да я премахнете, и плъзнете пречупна точка, за да я преместите. Пречупната точка променя автоматичната дължина, но не добавя и не променя местни загуби.';
$ec_lang['lpn_tool_undo_tip']='Дължина на историята за отмяна = 20 действия';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Побира цялата мрежа в прозореца на картата. За Мащаб в прозорец без предварително побиране натиснете W или щракнете върху малкия триъгълник в ъгъла на бутона на лентата с инструменти Покажи всичко. Вижте и контролите за мащаб горе вдясно на картата.';
$ec_lang['lpn_tool_zoom_selection_tip']='Побира избраните елементи в прозореца на картата. Първо изберете един или повече елементи.';
$ec_lang['lpn_tool_zoom_window_tip']='Посочете ъгли или плъзнете правоъгълник. Натиснете отново за Покажи всичко.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Увеличи. Клавишна комбинация: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Намали. Клавишна комбинация: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Просто или сложно търсене и замяна';
// **"Toolbar"** (Tom renamed it from "Toolbar key" to "Toolbar" on 2026-09-30).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. The row earns its place.
$ec_lang['lpn_help_icons']='Легенда на лентата';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Видимост';
$ec_lang['lpn_color_legend_open_tip']='Натиснете, за да отворите настройките за оцветяване и да промените тези цветове.';
$ec_lang['lpn_color_node_field']='Оцвети възлите по';
$ec_lang['lpn_color_link_field']='Оцвети тръбите по';
$ec_lang['lpn_color_ramp_sequential']='Последователна';
$ec_lang['lpn_color_ramp_diverging']='Дивергентна';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Брой диапазони';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Разпределение на диапазоните';
$ec_lang['lpn_color_ranges_note']='Границите по-долу се фиксират, след като бъдат зададени; те не следват резултатите, докато се променят. Избирането на метод за класификация на данните по-горе задава границите от текущото състояние на системата. Ако промените която и да е стойност на ръка, методът по-горе става Ръчно.';
$ec_lang['lpn_color_criterion_note']='Този метод взема границите си от проектен стандарт, затова броят на цветовете е фиксиран, докато е избран този метод.';
$ec_lang['lpn_color_break_number']='Границата трябва да е число. Картата остава непроменена.';
$ec_lang['lpn_color_break_order']='Всяка граница трябва да е по-голяма от предходната. Картата остава непроменена.';
$ec_lang['lpn_color_break_count']='Броят на границите трябва да е с една по-малко от броя на цветовете. Картата остава непроменена.';
$ec_lang['lpn_color_ramp_qualitative']='Качествена';
$ec_lang['lpn_color_ramp_rainbow']='Дъга';
$ec_lang['lpn_color_ramp_rainbow_eg']='като в EPANET';
$ec_lang['lpn_color_example_material']='Материал';
$ec_lang['lpn_color_ramp_ylgnbu']='От жълто до синьо';
$ec_lang['lpn_color_ramp_rdylbu']='От червено до синьо, през жълто';
$ec_lang['lpn_georef_drop']='Постави модела тук';
$ec_lang['lpn_georef_finish']='Запази това разположение';
$ec_lang['lpn_georef_scale']='Разстояние на терена за единица от чертежа';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Изчислява се автоматично. Редактирайте, за да го промените. Въведете 1, за да използвате координатите на файла непроменени като разстояние на терена, например за файл без координатна система.';
$ec_lang['lpn_georef_rotation']='Завъртане обратно на часовниковата стрелка (градуси)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Завъртане на целия модел обратно на часовниковата стрелка, за да се подравни с новата координатна система.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Да се постави ли моделът тук за постоянно? След това все още можете да плъзгате елементи един по един, но продължаването сега преобразува всички координати наведнъж. За да върнете старите координати, отворете отново оригиналния проект и затворете този без записване.';
$ec_lang['lpn_georef_done']='Този проект вече е на новата координатна система. Можете да продължите да плъзгате елементи, които се нуждаят от допълнително прецизиране.';
$ec_lang['lpn_georef_backdrop_unrotated']='Фоновото изображение бе преместено и преоразмерено заедно с модела, но не можа да бъде завъртяно. Използвайте Карта, Фоново изображение, Премести, за да го подравните.';
$ec_lang['lpn_georef_empty']='Този файл няма мрежа в себе си, затова няма какво да се постави.';
$ec_lang['lpn_georef_unavailable']='Инструментът за разполагане не се зареди. Презаредете страницата и опитайте отново.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Завършете преобразуването с бутона „Запазване на това позициониране“ или натиснете Отказ, преди да превключите проекти. Позиционирането важи само за този проект.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Завършете позиционирането с бутона „Запази това разположение“ или натиснете Отказ, преди да запишете. Проектът все още се позиционира, затова това, което е на екрана, все още не е това, което би било записано във файла.';
$ec_lang['lpn_goto_menu']='Отиди до географска ширина и дължина…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='Географска ширина и дължина, в този ред, разделени със запетая или интервал';
$ec_lang['lpn_goto_bad']='Не могат да се разчетат координатите. Опитайте отново. Примери: 38,-122 или 38.122 или 38 -122';
$ec_lang['lpn_georef_goto']='Отиди до…';
$ec_lang['lpn_georef_twopt']='Използване на две известни точки';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Поставя модела точно, когато са известни истинските географска ширина и дължина на две точки от чертежа. Посочете едната, въведете нейните географска ширина и дължина, после направете същото за втора точка. Позицията, мащабът и завъртането се изчисляват от тези две точки. Натиснете отново, за да откажете, или натиснете Esc.';
$ec_lang['lpn_georef_twopt_pick1']='Посочете точка от чертежа, чиито географска ширина и дължина знаете.';
$ec_lang['lpn_georef_twopt_pick2']='Сега посочете втора известна точка, колкото се може по-далеч от първата.';
$ec_lang['lpn_georef_twopt_same']='Това е точката, която избрахте първо. Изберете различна.';
$ec_lang['lpn_georef_twopt_done']='Моделът е поставен върху двете въведени точки. Проверете го, после натиснете бутона „Запази това разположение“.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Долен панел';
$ec_lang['lpn_pane_toggle_tip']='Показва или скрива панела под картата. Съдържа графики и таблица за всеки вид елемент.';
$ec_lang['lpn_pane_resize']='Плъзнете, за да направите панела по-висок или по-нисък';
$ec_lang['lpn_pane_tab_junctions']='Възли';
$ec_lang['lpn_pane_tab_reservoirs']='Резервоари';
$ec_lang['lpn_pane_tab_tanks']='Цистерни';
$ec_lang['lpn_pane_tab_pipes']='Тръби';
$ec_lang['lpn_pane_tab_pumps']='Помпи';
$ec_lang['lpn_pane_tab_valves']='Вентили';
$ec_lang['lpn_pane_tab_tip']='Редактирайте елементите като електронна таблица. Колоните с резултати не могат да се редактират. Вижте Помощ, Бележки за клавишните комбинации.';
$ec_lang['lpn_pane_popout']='Отвори в кутия';
$ec_lang['lpn_pane_none']='Тази мрежа все още няма нито един такъв.';
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
$ec_lang['lpn_pane_text_attached']='Прикачен';
$ec_lang['lpn_pane_not_used']='Не се използва';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Филтрирано по {q}. Показани {n} от {all}.';
$ec_lang['lpn_pane_filter_clear']='Показване на всички';
// Added to the filtered table's line (Task 738): rows edited since Filter in table was pressed stay
// in the table even when they no longer match, dimmed and marked, until it is pressed again. {n} is
// how many. Worded as a label and a count so no plural form is needed.
$ec_lang['lpn_pane_filter_stale']='Редове, които вече не съответстват: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Нищо в тази таблица не отговаря на филтъра.';
// Selection only (Task 757): the Tables pane filtered to what is selected on the map. Parallel to
// lpn_pane_filter_note. The line names the Find filter too when both are on.
$ec_lang['lpn_pane_filter_sel_note']='Само избраните. Показани {n} от {all}.';
$ec_lang['lpn_pane_filter_sel_and']='Филтрирано по {q} и само избраните. Показани {n} от {all}.';
$ec_lang['lpn_pane_filter_sel_none']='Нито един от избраните елементи не е в тази таблица.';
$ec_lang['lpn_pane_sel_only']='Само избраните';
$ec_lang['lpn_pane_sel_only_none']='Няма избрани елементи. Първо изберете елементи на картата.';
// Show scenarios (Tom, 2026-10-05): the table's cell menu switch that lists every asset once per
// scenario, with a Scenario column after ID.
$ec_lang['lpn_pane_scn_show']='Показване на сценариите';
// Two switches on the cell menu while Show scenarios is on (Tom, 2026-10-07): keep only the rows whose
// scenario holds a value of its own in this table, and keep only the open scenario's rows.
$ec_lang['lpn_pane_scn_ov_only']='Само свои стойности';
$ec_lang['lpn_pane_scn_cur_only']='Само текущият сценарий';
$ec_lang['lpn_pane_inactive_show']='Включи неактивната топология';
// The line above a table while either switch is on, beside the filter's own Show all. {filters} is one
// or both of the two switch names, joined by a comma; {n} the rows showing, {all} the rows without them.
$ec_lang['lpn_pane_scn_filter_note']='{filters}. Показани са {n} от {all}.';
// The cell menu's item that removes the selected cells' scenario overrides, so each reads what its
// scenario inherits (Tom, 2026-10-06). Greyed when no selected cell holds one.
$ec_lang['lpn_ovm_child_ask']='Да се изчистят ли стойностите на дъщерните сценарии (общо {n})?';
$ec_lang['lpn_ovm_child_tip']='Дъщерни сценарии заместват тази стойност (общо {n}). Щракнете, за да изчистите техните стойности.';
$ec_lang['lpn_ovm_dot_clear']='Щракнете, за да я изчистите.';
$ec_lang['lpn_ovm_dot_set']='Наследена. Щракнете, за да я направите своя стойност в този сценарий със същата показана стойност.';
$ec_lang['lpn_pane_clear_override']='Изчистване на собствената стойност';
// The tip on a table cell holding a value set in its row's scenario (Tom, 2026-10-06: "Demand alt.:
// Max day"). {category} is an lpn_alt_cat_* name; {alternative} is the alternative's name, which
// in Basic mode is its scenario's.
$ec_lang['lpn_pane_scn_alt_tip']='{category} алт.: {alternative}';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Мащабирай и избери';
$ec_lang['lpn_goto_on_map']='Покажи на картата';
$ec_lang['lpn_pane_select_on_map']='Избери на картата';
$ec_lang['lpn_pane_unselect_on_map']='Премахни избора на картата';
$ec_lang['lpn_pane_print']='Отпечатай таблицата';
// Tom, 2026-10-06. Copy with headings puts the heading line, unit included, above the selected cells; plain
// Copy never does. The two Export rows download the whole table as shown.
$ec_lang['lpn_pane_copy_heads']='Копирай със заглавията на колоните';
// Tom, 2026-10-07. File, Export to, ODS/XLSX/CSV file: a box asking which tables and which scenarios.
// {format} is ODS, XLSX or CSV, the file format's own name, never translated.
$ec_lang['lpn_export_table_title']='Експортиране в {format}';
$ec_lang['lpn_export_table_current']='Текуща';
$ec_lang['lpn_export_table_all']='Всички';
$ec_lang['lpn_export_table_go']='Експортирай';
$ec_lang['lpn_export_table_scn_note']='Резултатите се експортират само за последно изчисления сценарий.';

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
$ec_lang['lpn_menu_project']='Вода';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Всичко, специфично за моделирането на водни мрежи (освен бутоните за възпроизвеждане на анимацията)';
$ec_lang['lpn_tables_menu']='Таблици';
// Water > Morph (Task 781; Tom, 2026-10-14: *"I like the term 'Morph' (Transform) for this feature"*;
// first built as Change type, Tom, 2026-10-05: *"It would be nice to provide a tool under Water or Tables
// to Change node type for any asset, where if it has information that can't be ported to the new
// type, we alert and ask."*). The fly-out reuses lpn_tool_add_junction/_reservoir/_tank. The box it
// asks in lists one line per value lost: {id} is the asset's ID, {property} a field label the
// popup already uses, {value} the number or name with its unit, {scenario} a scenario's name.
// dev/asset-type.md.
$ec_lang['lpn_morph_menu']='Смяна на вида';
$ec_lang['lpn_morph_tip']='Променя избраните възли на възли, резервоари или цистерни, или избраните връзки на тръби, помпи или вентили. Всеки запазва своето ID, мястото си, връзките си и всяка стойност, която има и новият вид. Ако нещо би се загубило, първо се иска потвърждение.';
$ec_lang['lpn_morph_ok']='Промени';
// {ids} lists the selected assets of the other kind (nodes when a link type was chosen, and links
// when a node type was chosen), separated by commas.
$ec_lang['lpn_morph_other_kind']='Възел може да се промени само на друг вид възел, а връзка само на друг вид връзка. Не са променени: {ids}';
// The Properties row shown where a scenario morphs the asset (Task 781): the type it is in this
// scenario, beside the override marker.
$ec_lang['lpn_field_type_tip']='Видът на този елемент в този сценарий, зададен чрез Смяна на вида. Изчистете заместването, за да се ползва видът на родителския сценарий.';
$ec_lang['lpn_change_type_lost']='Тези стойности ще бъдат загубени:';
// The key to the lines under it (Tom, 2026-10-06: *"Provide a key for the loss report. 'ID: Lost entry'."*).
$ec_lang['lpn_change_type_key']='Всеки ред: ID: свойството и стойността, които биха били загубени';
$ec_lang['lpn_change_type_line']='{id}: {property} {value}';
$ec_lang['lpn_change_type_line_scenario']='{id}: {property} {value}, в сценарий {scenario}';
$ec_lang['lpn_change_type_line_alternative']='{id}: {property} {value}, в алтернатива {alternative}';
$ec_lang['lpn_change_type_more']='И още {n}.';
// Heads the lines a tank-to-reservoir or reservoir-to-tank change states rather than loses: the
// water surface is carried, so the new head or water depth is listed with its value.
$ec_lang['lpn_change_type_surface']='Тези запазват водното ниво там, където е било. Напорът на резервоара е котата на цистерната плюс дълбочината на водата в нея, а дълбочината на водата в цистерната е напорът на резервоара минус котата му:';
$ec_lang['lpn_change_type_meaning']='Тези контроли и правила проверяват възел, който се променя, и ще го отчитат по друг начин: възелът се проверява по налягането му, а цистерната или резервоарът по водното му ниво.';
// The link half (Tom, 2026-10-06: "Proceed."). Each heads a list of "ID: entry" lines.
$ec_lang['lpn_change_type_born']='Тези стойности са нови и се задават както при новоначертан елемент:';
$ec_lang['lpn_change_type_no_curve']='{id}: Няма крива на напора на помпата, така че помпата не добавя напор, докато не бъде избрана такава, а експортът в .inp я записва като тръба';
$ec_lang['lpn_change_type_becomes']='{id}: {property} {value}, в сценарий {scenario}, става {new}';
$ec_lang['lpn_change_type_customers']='Само тръба обслужва абонати, затова тези абонати се свързват вместо това с възела, показан в скоби, където потребността им вече е приложена. Те остават там, където са начертани, а потребността им не се променя:';
$ec_lang['lpn_change_type_setting']='Тези контроли и правила задават или проверяват настройката на връзка, която се променя. Настройката е различна величина при тръба, помпа и вентил, затова те ще я отчитат по друг начин:';
$ec_lang['lpn_change_type_rules']='Тези редове от правила назовават връзка по нейния вид и вместо това ще назовават новия ѝ вид:';
$ec_lang['lpn_tables_menu_tip']='Преглед и редактиране на елементите в таблици в долния панел.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Изчисляване на мрежата. Не е необходимо, когато „Преизчислявай автоматично“ е включено в Настройки, Изчисление, Хидравлика. Когато преизчисляването е изключено, в лентата с инструменти се появява бутон „Изчисли“.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Преизчислявай автоматично';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Изключете, ако преизчисляването е твърде бавно. Докато това е включено, бутонът Изчисли е скрит.';
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
$ec_lang['lpn_time_run_slow']='Тази мрежа отне {secs} s за изчисление, и е зададена да се преизчислява след всяка промяна. За да спрете това и да върнете бутона „Изчисли“, изключете „Преизчислявай автоматично“ в Настройки, под Изчисление, Хидравлика.';
$ec_lang['lpn_time_no_report']='Все още няма отчет от изчислението. Отчетът е текстовият отчет на EPANET, затова се появява, след като тази мрежа е изчислена.';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Помощ';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Галерия със снимки на екрана';
$ec_lang['lpn_help_walkthroughs']='Ръководства';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Изтриване на мрежата';
$ec_lang['lpn_confirm_delete_network']='Да се изтрият ли всички възли, тръби и текстови етикети в този проект? Фоновото изображение, името на проекта и настройките ви се запазват.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Търсене и замяна';
// Copy and Paste properties (Task 782; Tom, 2026-10-12: a clipboard, no confirmation). Identity and
// placement are never pasted.
$ec_lang['lpn_copy_props_menu']='Копиране на свойствата';
$ec_lang['lpn_copy_props_done']='Свойствата на {id} са копирани.';
$ec_lang['lpn_copy_props_no_overrides']='Няма свои стойности за копиране.';
$ec_lang['lpn_copy_props_done_ov']='Своите стойности на {id} в този сценарий са копирани.';
$ec_lang['lpn_paste_alt_created']='Създадена е алтернатива {name} от категория {category} за този сценарий.';
$ec_lang['lpn_paste_props_menu']='Поставяне на свойства върху избраните';
$ec_lang['lpn_paste_props_off_none']='Нищо не е копирано. Щракнете с десния бутон върху елемент или го натиснете продължително и изберете Копиране на свойствата.';
$ec_lang['lpn_paste_props_off_select']='Изберете елементите, върху които да поставите, след което изберете Поставяне на свойства върху избраните.';
$ec_lang['lpn_paste_props_off_kind']='Никой избран елемент не може да приеме копираните свойства.';
$ec_lang['lpn_tsb_menu']='Графика на времеви ред';
// The map's right-click (and long press) menu on a Text and on a dragged label (2026-10-14). Edit text
// opens the in-place editor; Reset position sends a dragged label or an attached Text home.
$ec_lang['lpn_ctx_edit_text']='Редактиране на текста';
$ec_lang['lpn_ctx_reset_position']='Връщане на положението';
$ec_lang['lpn_ctx_reset_position_off_tip']='Може да се върне само етикет или прикрепен текст, който е бил изтеглен от собственото си положение.';
$ec_lang['lpn_tsb_off_tip']='Изисква резултати от изчисление за период от време. Задайте Общо време на изпълнение в Настройки, Изчисление, Време и изчислете.';
$ec_lang['lpn_tsb_close']='Затваряне на графиката';
$ec_lang['lpn_tsb_resize']='Плъзнете, за да промените размера';
$ec_lang['lpn_tsb_quantity']='Величина за графиката';
$ec_lang['lpn_tsb_max']='Затворете графика, преди да отворите друга. Остават отворени до {n}.';
$ec_lang['lpn_paste_done_one']='Свойствата на {id} са поставени върху {to}. Променени стойности: {n}.';
$ec_lang['lpn_paste_done_many']='Свойствата на {id} са поставени върху елементи ({m}). Променени стойности: {n}.';
$ec_lang['lpn_paste_skip_breakdown']='Не са поставени: {n} (потребността е списък от категории).';
$ec_lang['lpn_paste_skip_valve']='Не са поставени: {n} (видовете вентили се различават).';
$ec_lang['lpn_find_title']='Търсене и замяна';
$ec_lang['lpn_find_scope']='Какво да се търси';
$ec_lang['lpn_find_scope_all']='Всичко';
$ec_lang['lpn_find_scope_source']='Източник';
$ec_lang['lpn_find_source_no_chemical']='Не се проследява химично вещество, затова никой възел няма източник.';
$ec_lang['lpn_find_property']='Свойство';
$ec_lang['lpn_find_condition']='Условие';
$ec_lang['lpn_find_value']='Стойност';
$ec_lang['lpn_find_btn']='Търси';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Филтриране в текущата таблица';
$ec_lang['lpn_find_filter_tip']='Показва само редовете, които съответстват на „Какво да се търси“ по-горе, във всяка претърсена таблица.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} от {all}';
$ec_lang['lpn_find_filter_summary']='Филтрирано по {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Тази заявка не се отнася за нито една таблица.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='съдържа';
$ec_lang['lpn_find_op_equals']='равно на';
$ec_lang['lpn_find_op_gt']='по-голямо от';
$ec_lang['lpn_find_op_lt']='по-малко от';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='празно';
// {n} is a whole number.
$ec_lang['lpn_find_count']='Намерени: {n}. Изберете един, за да отидете до него.';
$ec_lang['lpn_find_shift_hint']='Shift+щракване за превключване: добавя, ако не е в набора за избор, или премахва, ако вече е в него.';
$ec_lang['lpn_find_none']='Нищо не съвпадна.';
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
$ec_lang['lpn_find_op_top']='{n} най-високи';
$ec_lang['lpn_find_op_bottom']='{n} най-ниски';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Въведете какво да се търси.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Свързаност';
$ec_lang['lpn_find_prop_demand_desc']='Описание на тази категория потребност';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='няма връзки при възела';
$ec_lang['lpn_find_op_conn_noopen']='няма отворени връзки при възела';
$ec_lang['lpn_find_op_conn_nolinksource']='няма път от връзки до източник';
$ec_lang['lpn_find_op_conn_noopensource']='няма отворен път до източник';
// A result row prints the NARROWEST condition true of that node beside its id, because "no links"
// says more than "no open path to a source" and both are true of the same node. It prints the
// SAME four keys above with the first letter capitalized in code (findConnLabel()), not a second
// capitalized copy of each (Task 699, Tom 2026-09-30: "do the Find redesign").
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Всеки възел е свързан.';
$ec_lang['lpn_find_conn_no_fixed']='Тази мрежа няма резервоар или цистерна, затова няма източник, до който да се стигне. Може да се търси само по „няма връзки при възела“ и „няма отворени връзки при възела“.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Зададеното търсене като текстова заявка. Промяната на заявката обновява контролите по-горе.';
$ec_lang['lpn_find_query_label']='Заявка';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Съчетавайте условия с И, ИЛИ и ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='И';
$ec_lang['lpn_find_q_or']='ИЛИ';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Контролите не могат да изразят заявката по-долу, затова са скрити.';
$ec_lang['lpn_find_q_restore']='Използвай контролите вместо това';
$ec_lang['lpn_replace_q_bad']='Тази заявка не може да бъде разбрана, затова нищо не може да се промени. Първо я коригирайте по-горе.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(на знак {n})';
$ec_lang['lpn_find_q_err_empty']='Заявката е празна, затова няма да бъде търсено нищо.';
$ec_lang['lpn_find_q_err_scope']='Няма нещо на име {w}, в което да се търси. Опитайте едно от: {list}';
$ec_lang['lpn_find_q_err_dot']='Поставете точка между това, в което се търси, и неговото свойство, например Възел.ID';
$ec_lang['lpn_find_q_err_prop']='Не е свойство на {scope}: {w}. Опитайте едно от: {list}';
$ec_lang['lpn_find_q_err_op']='Не е условие за {prop}: {w}. Опитайте едно от: {list}';
$ec_lang['lpn_find_q_err_value']='Това условие се нуждае от стойност след него: {op}';
$ec_lang['lpn_find_q_err_quote']='Поставете кавички около текстова стойност: {w} не е число.';
$ec_lang['lpn_find_q_err_quote_end']='Този текст в кавички няма затваряща кавичка.';
$ec_lang['lpn_find_q_err_close']='Тази скоба ( бе отворена и никога не бе затворена.';
$ec_lang['lpn_find_q_err_open']='Тази скоба ) не затваря нищо.';
$ec_lang['lpn_find_q_err_end']='Тук не се очакваше нищо. Съединете две търсения с {and} или {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Промени намереното';
$ec_lang['lpn_replace_prop']='Свойство за промяна';
$ec_lang['lpn_replace_value']='Нова стойност';
$ec_lang['lpn_replace_source']='Източник на новата стойност';
$ec_lang['lpn_replace_asked']='Заявени коти за възли ({n}). Резултатите се показват при получаването им.';
$ec_lang['lpn_replace_btn']='Замени';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Да се променят ли елементите ({n})?';
$ec_lang['lpn_replace_apply']='Промени ги';
$ec_lang['lpn_replace_done']='Променени елементи: {n}. Това може да се отмени с една стъпка.';
$ec_lang['lpn_replace_none']='Нищо няма да се промени.';
$ec_lang['lpn_replace_no_value']='Въведете новата стойност.';
$ec_lang['lpn_replace_scope']='Изберете един вид обект по-горе, за да променяте стойности за него.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Профил';
$ec_lang['lpn_graphs_menu']='Графики';
// **THE SYNONYMS ARE IN dev/plain-sentences.md, THE CHANNEL MEANT FOR THEM.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission a plain sentence requires. Same text, correct channel.
$ec_lang['lpn_profile_title']='Профил по маршрут';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Изберете възела, откъдето започва пътят.';
$ec_lang['lpn_profile_draw_more']='Преместете показалеца върху картата, за да видите пътя. Изберете възел, за да го добавите. Двойно щракване завършва. Esc отказва.';
$ec_lang['lpn_profile_draw_blocked']='Няма маршрут от {a} до {b}. Изберете друг възел.';
$ec_lang['lpn_profile_tap_start']='Изберете възела, откъдето започва пътят.';
$ec_lang['lpn_profile_tap_more']='Изберете възел, за да видите пътя. Натиснете и задръжте, за да го добавите. Двойно докосване завършва. Натиснете „Профил“ отново, за да откажете.';
$ec_lang['lpn_profile_say_idle']='Натиснете „Профил“ отново, за да изберете нов път на картата.';
$ec_lang['lpn_profile_none']='Все още няма път. Натиснете „Профил“ отново, за да изберете такъв на картата.';
$ec_lang['lpn_profile_choose']='Изберете начален и краен възел.';
$ec_lang['lpn_profile_no_path']='Тези два възела не са свързани от никакъв маршрут.';
$ec_lang['lpn_profile_no_solve']='Все още няма резултати, затова е начертана само линията на терена.';
$ec_lang['lpn_profile_summary']='Възли: {n}, дължина: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Разстояние по маршрута ({u})';
$ec_lang['lpn_profile_axis_elev']='Кота и напор ({u})';
$ec_lang['lpn_profile_ground']='Терен';
$ec_lang['lpn_profile_hgl']='Хидравлична линия на напора';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Редактиране';
$ec_lang['lpn_profile_edit_tip']='Промяна на единия край на маршрута или премахване на един възел от него, без да чертаете целия маршрут отново.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Плъзнете коя да е точка от пътя, за да я преместите. Изберете добавена от вас точка, за да я премахнете.';
$ec_lang['lpn_profile_edit_tap']='Плъзнете коя да е точка от пътя, за да я преместите. Изберете добавена от вас точка, за да я премахнете.';
$ec_lang['lpn_profile_edit_nowhere']='Точка от маршрута трябва да е възел. Маршрутът остава непроменен.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Запазени маршрути';
$ec_lang['lpn_profile_new']='Нов запазен маршрут…';
$ec_lang['lpn_profile_new_name']='Маршрут {n}';
$ec_lang['lpn_profile_rename']='Преименуване на маршрут…';
$ec_lang['lpn_profile_delete']='Изтриване на маршрут';
$ec_lang['lpn_profile_open']='Отваряне на файл с профил на EPANET…';
$ec_lang['lpn_profile_file_done']='Профилът е прочетен от файла: намерени са {used} от {total} възела в тази мрежа.';
$ec_lang['lpn_profile_file_missing']='Посочени във файла, но ги няма в тази мрежа: {ids}.';
$ec_lang['lpn_profile_file_short']='Файлът посочва по-малко от два възела от тази мрежа, затова няма профил за чертане.';
$ec_lang['lpn_profile_prompt_name']='Име за този маршрут';
$ec_lang['lpn_profile_delete_confirm']='Да се изтрие ли запазеният маршрут {name}? Самият чертеж не се променя.';
$ec_lang['lpn_profile_none_saved']='Все още няма запазени маршрути';
$ec_lang['lpn_profile_missing']='Запазеният маршрут {name} използва възли, които не са в този проект: {ids}';
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
$ec_lang['lpn_ts_menu']='Времеви редове';
$ec_lang['lpn_ts_tip']='Графика на един или повече елементи за изчисление за период от време.';
$ec_lang['lpn_ts_title']='Стойности спрямо времето';
$ec_lang['lpn_ts_group_nodes']='Възли';
$ec_lang['lpn_ts_group_links']='Връзки';
$ec_lang['lpn_pgraph_none']='Този елемент няма резултати в текущото изчисление.';
// The Properties graph's own selector entry for a source share (Tom, 2026-09-30: "In selector, use
// 'Source share from {trace node}'"). Distinct from the shared lpn_result_source_share, which still
// labels the bare quantity everywhere else -- the Tables column, Find's property list, the Labels
// popover and the colour legend -- where naming the trace node in every heading would be clutter.
$ec_lang['lpn_pgraph_source_share_from']='Дял от източника от {node}';
$ec_lang['lpn_result_pump_head_tip']='Напорът, който помпата добавя от смукателната до нагнетателната страна, показан като положително число. Решаващият модул и файловете на EPANET го носят като отрицателна загуба на напор.';
// The Full report puts every node and link in one table, where a node's Head column already sits, so a
// pump's column there says whose head it is. Elsewhere the pump's own row or tab says so, and lpn_result_pump_head is enough.
$ec_lang['lpn_report_pump_head']='Напор на помпата';
$ec_lang['lpn_ts_add']='Добави избраните';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Не е намерено нищо за добавяне.';
$ec_lang['lpn_ts_clear']='Премахни всички';
$ec_lang['lpn_ts_chip_tip']='Премахни {id} от графиката';
$ec_lang['lpn_ts_none']='Все още няма какво да се начертае. Изберете обекти на картата и натиснете Добави избраните.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Все още няма резултати от период от време. Натиснете Изчисли, за да изпълните изчислението.';
$ec_lang['lpn_ts_summary']='Обекти: {n}, моменти на отчитане: {steps}';
$ec_lang['lpn_ts_axis_time']='Изминало време';
// EPANET's Frequency Plot (Task 600): one value over every junction or every pipe, at the time the
// map shows, against the percent of them less than it. "Percent less than" is EPANET's own axis
// title. {n} and {total} are counts, {time} an elapsed time; all substituted, never concatenated.
// The Junctions/Pipes choice reuses lpn_pane_tab_junctions and lpn_pane_tab_pipes.
$ec_lang['lpn_freq_menu']='Честота';
$ec_lang['lpn_freq_tip']='Честотно разпределение на едно свойство';
$ec_lang['lpn_freq_title']='Разпределение на стойностите';
$ec_lang['lpn_freq_none']='Все още няма резултати за тази стойност, затова няма какво да се начертае.';
$ec_lang['lpn_freq_summary']='Начертани: {n} от {total}';
$ec_lang['lpn_freq_summary_time']='Начертани: {n} от {total}, в {time}';
$ec_lang['lpn_freq_axis_percent']='Процент по-малко от';
// EPANET's Contour Plot (Task 600), drawn as a layer under the map rather than in a window of its
// own, from the pipes outward. {n} and {p} are counts, {k} and {i} numbers, {u} a unit symbol, {m} a
// distance in metres; all substituted. lpn_contour_buffer_unit follows the Buffer number box.
// lpn_contour_consent_1..4 are the terrain question's four paragraphs, reworded for what the contour
// plot sends: tile numbers for the network's area, not each node's latitude and longitude.
$ec_lang['lpn_contour_menu']='Изолинии';
$ec_lang['lpn_contour_tip']='Показва на картата карта с изолинии: цветовете на възлите се разпростират по тръбите и встрани от тях, с надписани изолинии. Отваря кутия за настройването й или за изключването й.';
$ec_lang['lpn_contour_plot']='Изолинии: карта';
$ec_lang['lpn_contour_show']='Показване на изолиниите';
$ec_lang['lpn_contour_show_tip']='Изчистете, за да скриете запълването и изолиниите; отметнете, за да се върнат както са били. Цветовете на възлите остават.';
$ec_lang['lpn_contour_fill']='Запълване';
$ec_lang['lpn_contour_fill_tip']='При Плавно цветовете преливат от един клас към следващия. При Ивици всеки клас от цветовата скала се оцветява равномерно.';
$ec_lang['lpn_contour_fill_smooth']='Плавно';
$ec_lang['lpn_contour_fill_bands']='Ивици';
$ec_lang['lpn_contour_opacity']='Непрозрачност на запълването';
$ec_lang['lpn_contour_lines']='Изолинии';
$ec_lang['lpn_contour_interval']='Интервал';
$ec_lang['lpn_contour_buffer']='Обхват';
$ec_lang['lpn_contour_buffer_unit']='× медианната дължина на тръбите';
$ec_lang['lpn_contour_buffer_tip']='Докъде стига цветът от всяка тръба, като кратно на медианната дължина на тръбите. Във външната си част той избледнява.';
$ec_lang['lpn_contour_few']='Твърде малко възли за изолинии.';
$ec_lang['lpn_contour_support']='Карта с изолинии: {n} възела, интерполирани по {p} тръби и до {k} пъти медианната дължина на тръбите встрани от тях. Няма цвят през помпи, вентили или затворени връзки.';
$ec_lang['lpn_contour_support_lines']='Изолинии на всеки {i} {u}.';
$ec_lang['lpn_contour_too_many']='Твърде много изолинии при този интервал; увеличете го, за да се начертаят.';
$ec_lang['lpn_contour_dem']='Терен между възлите от Mapbox DEM';
$ec_lang['lpn_contour_dem_tip']='Между възлите налягането става интерполираният напор минус височината на терена от Mapbox DEM, така че може да падне под най-ниското налягане във възел на хълм, на който мрежата няма възел. Приемайте терена като картен материал, а не като геодезическо заснемане.';
$ec_lang['lpn_contour_support_dem']='Между възлите налягането е интерполираният напор минус котата на терена от Mapbox DEM, отчетена приблизително на всеки {m} m.';
$ec_lang['lpn_contour_dem_failed']='Теренът не можа да бъде прочетен от Mapbox DEM, затова налягането е интерполирано само между възлите.';
$ec_lang['lpn_contour_consent_1']='Начертаването на налягането върху терена изпраща областта, която покрива вашата мрежа, като номера на картни плочки на Mapbox, до api.mapbox.com, за да се прочете височината на терена там.';
$ec_lang['lpn_contour_consent_2']='Това е различен въпрос от картите зад вашия проект. Картите само показват накъде гледате. Тези плочки показват къде е вашата мрежа. Mapbox ще получи тези номера на плочки и вашия IP адрес. Не изпращаме нищо друго: нито име, нито тръби, нито проект. Не пазим запис за това и нищо не се съхранява на това устройство, освен отговорът ви на този въпрос.';
$ec_lang['lpn_contour_consent_3']='Може ли да изпратим на Mapbox номерата на плочките за областта на вашата мрежа?';
$ec_lang['lpn_contour_consent_4']='Ако откажете, всичко останало на тази страница продължава да работи точно както досега, а картата с изолинии се чертае само между възлите. Помним отговора „да“, за да не питаме отново. Отговорът „не“ изобщо не се съхранява.';
// EPANET's System Flow plot (Task 600). "System flow" is its Graph Selection name, "System flow
// balance" its window title, "Produced" and "Consumed" its series. The definition is its own code
// (Fgraph.pas GetSysFlow): junction and reservoir demands only, split by sign; tanks in neither.
// The axis reuses lpn_result_flow and lpn_ts_axis_time.
$ec_lang['lpn_sysflow_menu']='Баланс на водните количества';
$ec_lang['lpn_sysflow_tip']='Начертава общото произведено и общото консумирано водно количество спрямо времето за целия изчислен период от време. Цистерните не влизат в нито една от двете суми, затова там, където двете линии се разделят, цистерните се пълнят или изпразват.';
$ec_lang['lpn_sysflow_title']='Воден баланс';
$ec_lang['lpn_sysflow_produced']='Произведено';
$ec_lang['lpn_sysflow_produced_tip']='Общото водно количество, влизащо в мрежата от резервоари и от отрицателни потребности.';
$ec_lang['lpn_sysflow_consumed']='Консумирано';
$ec_lang['lpn_sysflow_consumed_tip']='Сумата на всяка положителна потребност: водата, изтеглена от мрежата във възлите, и всяко водно количество, влизащо в резервоар.';
$ec_lang['lpn_view_units']='Единици';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Запиши всички';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Проект{n}';
$ec_lang['lpn_project_copy_suffix']='(копие)';
$ec_lang['lpn_project_rename']='Преименуване';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Нов проект…';
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
$ec_lang['lpn_new_coordsys']='Координатна система';
$ec_lang['lpn_new_coordsys_tip']='Изберете координатната система на мрежата. Единственият начин да промените този избор е с „Файл, Преобразувай като…“ към нов проект, а това преобразуване е приблизително.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Локална, схематична или потребителска';
$ec_lang['lpn_new_coordsys_local_tip']='Без географско привързване. Прикачете свое собствено фоново изображение или никакво.';
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
$ec_lang['lpn_crs_view']='Филтриране по изглед на картата';
$ec_lang['lpn_crs_view_tip']='Предлага само координатните системи, които покриват мястото, към което гледа картата. Изчистете отметката, за да се прочете целият списък.';
$ec_lang['lpn_crs_place']='Търсене по име на място';
$ec_lang['lpn_crs_place_tip']='Търсенията се изпращат към услугата за имена на места на OpenStreetMap, а разрешение се иска първия път. Нов географски проект също стартира на мястото, намерено тук.';
$ec_lang['lpn_crs_search']='Търсене';
$ec_lang['lpn_crs_name']='Филтър по име на проекция';
$ec_lang['lpn_crs_name_tip']='Текст, който филтрира списъка: показват се само координатните системи, чието име или EPSG код го съдържа.';
$ec_lang['lpn_crs_list_tip']='Координатните системи, които преминават горните филтри. Изберете една, после натиснете OK.';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Все още не е търсено място, затова се предлага целият списък. Потърсете място по-горе или мащабирайте картата, за да го стесните.';
$ec_lang['lpn_crs_count']='{n} от {total} проекции в списъка.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} от {total} координатни системи покриват тази мрежа.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(без карта)';
// Shown beside WGS 84 (EPSG:4326) in the chooser only (Task 775), never on the status strip.
$ec_lang['lpn_crs_suggested_mark']='(предложена)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} е една от малкото изброени координатни системи без използваема информация за проекцията. Това означава, че картата на света, търсенето по име на място и котите от DEM не работят. Вашите координати не са засегнати.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='неименувана';
$ec_lang['lpn_crs_none']='Без географско привързване';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Мерните единици и другите настройки се записват във всеки проект, затова този избор важи само за този проект и не се запазва като настройка на браузъра. За да използвате отново предпочитанията си, запишете празен проект като шаблон и започвайте всеки нов проект от него.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Пловдив, България';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Създай';
$ec_lang['lpn_file_open']='Отвори…';
$ec_lang['lpn_file_save']='Запиши';
$ec_lang['lpn_file_saveas']='Запиши като…';
$ec_lang['lpn_file_revert']='Върни записаното';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Последни файлове';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='Не бе дадено разрешение за отваряне на този файл, затова той не бе отворен.';
$ec_lang['lpn_recent_gone']='Файлът {file} не можа да бъде отворен. Възможно е да е преместен, преименуван или изтрит, затова бе премахнат от списъка с последни файлове.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Нов проект';
$ec_lang['lpn_tab_all']='Всички проекти';
$ec_lang['lpn_tab_menu']='Меню на проекта';
$ec_lang['lpn_tab_duplicate']='Дублирай';
$ec_lang['lpn_tab_move_left']='Премести наляво';
$ec_lang['lpn_tab_move_right']='Премести надясно';
$ec_lang['lpn_tab_unsaved']='Незаписан във файл';
$ec_lang['lpn_import_bad_file']='Този файл не можа да бъде прочетен като проект, записан от тази страница.';
$ec_lang['lpn_import_no_room']='Няма достатъчно свободно място в хранилището на браузъра, за да добавите този проект. Изтрийте проект, който вече не ви трябва, и опитайте отново.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='ОК';
// **TASK 718** (Tom, 2026-09-25: *"We have three import items. It's probably time for an Import
// sub-menu."*). The three rows -- surveyed points, an EPANET file, and libraries -- now open as a
// fly-out off one row, the same submenu idiom Help > Toolbar already uses. Each row keeps its
// own existing key and tip; only this one row is new.
$ec_lang['lpn_file_import_menu']='Импортиране…';
$ec_lang['lpn_file_import_inp']='Импортиране на файл на EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Създайте нов проект от EPANET файл — или формата за износ .inp (предпочитан), или собствения формат .net (краен вариант).';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
// File > Export is a submenu (Tom, 2026-10-06), so its rows drop the verb the heading carries. The
// two keys above are what the rows were called before it.
$ec_lang['lpn_file_export_menu']='Експортиране…';
$ec_lang['lpn_file_export_item_inp']='Файл на EPANET…';
$ec_lang['lpn_file_export_item_geojson']='Файл GeoJSON…';
$ec_lang['lpn_file_export_item_ods']='Файл ODS…';
$ec_lang['lpn_file_export_item_xlsx']='Файл XLSX…';
$ec_lang['lpn_file_export_item_csv']='Файл CSV…';
$ec_lang['lpn_file_export_tables_tip']='Изтеглете таблиците така, както ги показва панелът Таблици, в една работна книга с лист за всяка таблица (и за всеки избран от вас сценарий), плюс лист за всяка библиотека, към която се отнасят техните ID: графици, криви, видове тръби и фитинги. Резултатите са включени само за последно изчисления сценарий.';
$ec_lang['lpn_file_export_csv_tip']='Изтеглете таблица така, както я показва панелът Таблици. Една таблица се получава като един CSV файл без библиотеки. Няколко таблици или сценарии се получават като един zip файл от CSV файлове, с файл за всяка библиотека, към която се отнасят техните ID. Резултатите са включени само за последно изчисления сценарий.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Изтеглете тази мрежа като файл .inp на EPANET (в zip файл с изображението ѝ, ако има такова). Всичко, което форматът .inp не може да побере, се изброява след това.';
$ec_lang['lpn_status_inp_exported']='Изнесен {file}.';
$ec_lang['lpn_status_inp_exported_picture']='Експортирани: {zip}, който съдържа файла на EPANET {file}, фоновото му изображение {picture} и файла за геопривързване {world}. Извлечете и трите в една папка, после отворете там .inp в EPANET; изображението идва с него.';
$ec_lang['lpn_status_inp_exported_no_picture']='Експортиран: {file}. Фоновото изображение не можа да бъде запазено, затова .inp не посочва такова; в EPANET го добавете чрез View > Backdrop > Load.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_flat_customers_inactive']='{n} от тези абонати са присвоени на възел, който е неактивен в този сценарий, затова потребността им не е във файла.';
$ec_lang['lpn_inp_export_flat_inactive_controls']='Тези управления и правила се отнасят към елемент, който е неактивен в този сценарий, затова не са във файла: {ids}';
$ec_lang['lpn_inp_export_differences']='{n} неща, които форматът .inp не може да побере.';
$ec_lang['lpn_inp_export_difference_one']='Едно нещо, което форматът .inp не може да побере.';
$ec_lang['lpn_inp_export_refused']='Този проект не може да бъде записан като файл на EPANET: {detail}';
// Task 772: File > Export DXF file. The model's data for AutoCAD and other CAD programs.
$ec_lang['lpn_file_export_item_dxf']='Файл DXF…';
$ec_lang['lpn_file_export_dxf_tip']='Изтеглете тази мрежа за AutoCAD и други CAD програми: възлите като блокове със символи, тръбите, помпите и вентилите като полилинии, а всеки обект като блок, чиито атрибути носят неговия ID и стойностите на свойствата му в мерните единици на проекта.';
$ec_lang['lpn_dxf_export_no_utm']='Файлът DXF не беше записан: тази мрежа се намира извън географските ширини, които UTM покрива (80° ю.ш. до 84° с.ш.), а чертежът се нуждае от плоска координатна мрежа.';
$ec_lang['lpn_dxf_export_refused']='Файлът DXF не беше записан: необходимото преобразуване на координатите не се зареди. Проверете връзката и опитайте отново.';
$ec_lang['lpn_dxf_export_failed']='Файлът DXF не беше записан: грешка в тази страница го спря ({error}).';
// The read-me written into the file as a block of attributes, on a layer that does not plot; the
// file writes it in capital letters. Each says what
// the coordinates are and claims no coordinate system the file does not have. {unit} is a length
// unit as written in English (ft, m), not translated; {crs} is a coordinate system name with its EPSG code.
$ec_lang['lpn_dxf_note_grid']='Координати: X и Y на този проект, в {unit}. Не е зададена координатна система.';
$ec_lang['lpn_dxf_note_crs']='Координати: {crs}, точно както ги задава този проект.';
$ec_lang['lpn_dxf_note_geo']='Координати: {crs}, в метри, не географска ширина и дължина. Географските ширини и дължини на проекта бяха преобразувани към тази мрежа.';
$ec_lang['lpn_dxf_exported_geo']='Експортиран {file}. Координатите му са {crs}, в метри, не географска ширина и дължина.';
// {prefix} is the layer-name prefix, C-WATR-MODL-; {example} is a whole layer name such as
// C-WATR-MODL-NODE-BASE.
$ec_lang['lpn_dxf_note_blocks']='Слоевете се назовават {prefix}, кодът на обекта, тире и алтернативата, както в {example}. Всеки елемент е блок, вмъкнат в мащаб 1, с атрибути с височина 1 единица; променете мащаба на блоковете, за да зададете височината на текста. Всеки атрибут е видим; атрибутите на един елемент са подредени в колона до неговия символ.';
// {n} is a whole number; {max} is 2049. Each shortened value ends in three periods (...).
$ec_lang['lpn_dxf_note_shortened']='Стойности, по-дълги, отколкото позволява файл DXF ({max} знака): {n}. Всяка беше съкратена и завършва с три точки.';
// {n} is a whole number; {tag} is an attribute tag in capitals, BASE_DEMAND in English.
$ec_lang['lpn_dxf_note_categories']='Възли с повече от една категория потребност: {n}. Техният атрибут {tag} съдържа сбора на базовите потребности на всички категории.';
// GeoJSON export (Task 728). The command is worded like Export EPANET file. Positions in a GeoJSON
// file are always longitude and latitude (RFC 7946), so a project with no place on the Earth is
// refused and told how to get one, never written with an invented coordinate system.
$ec_lang['lpn_file_export_geojson_tip']='Изтеглете тази мрежа като файл GeoJSON за QGIS, ArcGIS Pro и други ГИС програми. Възлите, цистерните и резервоарите са точки, а тръбите, помпите и вентилите са линии, които следват пречупните им точки. Положенията са географска ширина и дължина. Резултатите се включват само когато мрежата е изчислена.';
// Workspace export and import (Tom, 2026-10-07). {file}, {n}, {r}, {u} and {version} are filled in by the page.
$ec_lang['lpn_file_export_item_workspace']='Работна среда…';
$ec_lang['lpn_file_export_workspace_tip']='Изтеглете малък файл, който съдържа къде стоят кутиите ви, техните размери, кои са отворени или закачени, и размерите на панелите и колоните ви, плюс опциите за показване на тази страница, например кои балони с помощ и карта при посочване се показват. Проектите ви, настройките на проектите и бисквитките (език, съгласие, мерни единици) не са в него. Заредете го на друг екран или браузър с Файл, Импортиране, Работна среда.';
$ec_lang['lpn_file_import_workspace']='Работна среда…';
$ec_lang['lpn_file_import_workspace_tip']='Приложете файл на работна среда, записан с Файл, Експортиране, Работна среда: положения и размери на кутиите, закачане, размери на панелите и опциите за показване на тази страница, например кои балони с помощ и карта при посочване се показват. Проектите и бисквитките ви не се засягат.';
$ec_lang['lpn_workspace_exported']='Работната среда е записана в {file}: {n} настройки.';
$ec_lang['lpn_workspace_imported']='Работната среда е приложена от {file}. Приложени настройки: {n}. Върнати към стойностите по подразбиране: {r}.';
$ec_lang['lpn_workspace_ignored']='Пренебрегнати записи, защото не бяха разпознати: {u}.';
$ec_lang['lpn_workspace_refused_unreadable']='Този файл не можа да бъде прочетен като работна среда, затова нищо не беше променено.';
$ec_lang['lpn_workspace_refused_format']='Това не е файл на работна среда, записан от тази страница, затова нищо не беше променено.';
$ec_lang['lpn_workspace_refused_newer']='Този файл на работна среда е записан от по-нова версия на тази страница (формат {version}), затова нищо не беше променено.';
$ec_lang['lpn_workspace_confirm']='Да се замени ли подредбата на работната среда на този браузър с тази от файла?';
$ec_lang['lpn_workspace_refused_storage']='Хранилището на браузъра е пълно или недостъпно, затова работната среда не беше приложена.';
$ec_lang['lpn_geojson_refused_local']='Файлът GeoJSON съдържа само географска ширина и дължина, а този проект е начертан в локална координатна мрежа без място на Земята. Първо го геопривържете чрез Карта, Карта на света, Прикачи, после експортирайте отново.';
$ec_lang['lpn_geojson_refused_range']='Тези положения не са валидни географски ширини и дължини: {detail}';
$ec_lang['lpn_geojson_refused_crs']='Координатната система на този проект ({detail}) не е известна на тази страница, затова положенията му не могат да се преобразуват в географска ширина и дължина. Използвайте Преобразуване като…, за да копирате проекта в позната на страницата система, после експортирайте отново.';
$ec_lang['lpn_geojson_refused_empty']='Все още няма какво да се експортира. Първо начертайте или отворете мрежа.';
$ec_lang['lpn_geojson_results_in']='Включени са резултатите на екрана.';
$ec_lang['lpn_geojson_results_out']='Не са включени резултати, защото мрежата не е изчислена.';
$ec_lang['lpn_inp_bad_file']='Този файл не можа да бъде прочетен като мрежов файл на EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Това изглежда като файл .net на EPANET, но тази страница не можа да го прочете. Отворете го в EPANET и използвайте командата Файл, Експортиране, Мрежа там, за да го запишете като файл .inp, след което импортирайте него.';
$ec_lang['lpn_inp_report_heading']='Импортиран {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} възела, резервоара и цистерни, {links} тръби, помпи и вентила, в {units}.';
$ec_lang['lpn_inp_report_clean']='Всички данни във файла бяха внесени. Нищо не е пропуснато.';
$ec_lang['lpn_inp_report_label_anchor']='Текстовите етикети се поставят така, както ги поставя EPANET — от горния им ляв ъгъл.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='EPANET файловете не съдържат координатна система, затова този файл първоначално няма да бъде географски привързан. За да го поставите върху карта на света, използвайте Карта, Карта на света… За да преобразувате координатите му, използвайте Файл, Преобразувай като…';
$ec_lang['lpn_inp_backdrop_attach']='Прикачване на {file}…';
$ec_lang['lpn_inp_backdrop_attach_tip']='Уеб страница не може да отвори изображението по име. Изберете го на устройството си и то се поставя там, където файлът казва, че му е мястото.';
$ec_lang['lpn_inp_backdrop_attached']='Прикачен {file}, поставен там, където файлът казва, че му е мястото.';
$ec_lang['lpn_inp_backdrop_attached_other']='Прикачен {picked}, поставен там, където файлът казва, че му е мястото. Файлът посочва {file}, което е друго име.';
$ec_lang['lpn_inp_report_lead']='Тази страница не използва всяка функция на EPANET, но никакви данни от файла не се изхвърлят. Списъкът по-долу показва данните във файла, които се запазват, но не се използват, и всички промени, направени при внасянето:';
$ec_lang['lpn_inp_drop_headloss']='Този файл не използва формулата на Хейзън-Уилямс. Тази страница изчислява по Хейзън-Уилямс, затова числата за грапавост на тръбите бяха запазени точно както са записани, но резултатите тук няма да съвпаднат с резултатите в EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Тези цистерни нямат прави стени: файлът задава формата им като крива на обема. Кривата се пази в кутията Библиотеки, цистерната продължава да сочи към нея, а изчисление за период от време я използва, за да изчисли нивото, докато цистерната се пълни и изпразва. Изчисление за един момент не се засяга, защото водната повърхност е на нивото, зададено във файла. Диаметърът във файла се пази до кривата и се използва за чертане и изчисление на цистерна без крива.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Тези дроселиращи вентили бяха внесени като дроселиращи вентили, със загубата, зададена във файла.';
$ec_lang['lpn_inp_drop_valve_active']='Тези вентили регулират налягане или водно количество и състоянието им се променя с хидравличните условия. Внесени са без загуба на данни и тази страница ги изчислява.';
$ec_lang['lpn_inp_drop_valve']='Тези вентили са описани чрез крива или чрез фиксиран пад на налягането, а тази страница няма такъв елемент. Те бяха внесени като отворени тръби, така че мрежата остава свързана, но вече нищо не управлява налягането или водното количество там.';
$ec_lang['lpn_inp_drop_cv']='В EPANET тези тръби пропускат водата само в една посока (възвратни клапани). Те бяха внесени като обикновени тръби, така че сега водата може да тече през тях в двете посоки.';
$ec_lang['lpn_inp_drop_demands']='Тези възли имаха повече от една потребност. Потребностите бяха сумирани в единствената потребност, която тази страница поддържа.';
$ec_lang['lpn_inp_drop_patterns']='Тази страница не прочете графиците на потребността, защото модулът за изчисление за период от време не се зареди. Всяка потребност е стойността, записана във файла.';
$ec_lang['lpn_inp_drop_demand_pattern']='Тези възли променят потребността си през изчислението. Графиците им бяха внесени изцяло, а потребността, която виждате, е тази за момента, който часовникът показва.';
$ec_lang['lpn_inp_drop_emitters']='Тези възли имат коефициент за дюза (пръскачка) или изтичане. Той бе запазен, използва се в изчислението, и всеки от тях го показва в полето Коефициент на дюзата в своите свойства.';
$ec_lang['lpn_inp_drop_curve_long']='Тази помпена крива имаше повече от три точки. Бяха запазени най-ниската, средната и най-високата точка, защото тази страница пасва крива през най-много три точки.';
$ec_lang['lpn_inp_drop_curve_missing']='Тази помпа сочи крива, която не е във файла. Помпата беше внесена без крива, затова не добавя напор.';
$ec_lang['lpn_inp_drop_pump_other']='Тази помпа е описана чрез мощността, която черпи, а не чрез крива. Тя бе внесена без крива, затова не добавя напор.';
$ec_lang['lpn_inp_drop_head_pattern']='Тези резервоари имат напор, който се променя през изчислението. Графиците им бяха внесени изцяло, а водното ниво, което виждате, е стойността за момента, който часовникът показва.';
$ec_lang['lpn_inp_drop_pump_speed']='Тези помпи работят при скорост, различна от тази, при която е измерена кривата им, или сменят скоростта си през изчислението. Скоростта и графикът ѝ бяха внесени изцяло, а напорът, който виждате, е този за момента, който часовникът показва.';
$ec_lang['lpn_inp_drop_setting']='Тези тръби, помпи и вентили имат настройка, която тази страница не може да пази. Внесени са като отворени.';
$ec_lang['lpn_inp_drop_rules']='Този файл има управления, базирани на правила. Тази страница ги чете и ги използва. Изпълнете модела с решаващия модул на EPANET и правилата се прилагат, като всяко ниво, налягане и водно количество в тях се преобразуват в мерните единици, които този проект показва. Отворете Правила под Библиотеки, за да прочетете или промените правило. Те се пазят точно както файлът ги задава, и се записват обратно, ако запишете EPANET файл.';
$ec_lang['lpn_inp_drop_eps']='Този файл описва изчисление за период от време. Модулът за изчисление за период от време на тази страница не се зареди, затова бяха внесени само началните условия.';
$ec_lang['lpn_inp_drop_quality']='Този файл описва качеството на водата: начални концентрации и скорости на реакции в тръби и цистерни. Тази страница чете и използва тези стойности. Изберете химично вещество под Настройки, Изчисление, Качество на водата, после изчислете модела, за да се изчислят концентрациите по цялата мрежа през изчислението. Редовете се пазят и се записват обратно, ако запишете EPANET файл.';
$ec_lang['lpn_inp_drop_sources_mixing']='Този файл задава къде се дозира химично вещество в мрежата и как се смесва водата във всяка цистерна. Всеки източник се показва на възела, на който е приложен, а всяка цистерна показва своя модел на смесване. И двете се използват, когато мрежата се изчислява за обща продължителност на изчислението.';
$ec_lang['lpn_inp_drop_energy']='Този EPANET файл включва данни за моделиране на разходите за помпене. Тази страница ги чете и ги използва. Изпълнете модела с решаващия модул на EPANET, после отворете Вода, Отчети, Енергия на помпите, за да видите колко дълго е работила всяка помпа, каква мощност е потребявала, каква енергия е използвала и какво е струвало това. Редовете се пазят и се записват обратно, ако запишете EPANET файл.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Този файл задава тагове на някои възли, тръби или други елементи. Всеки таг е внесен и се показва в свойствата на елемента си, където може да бъде прегледан или променен.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Този файл съдържа настройки на EPANET за формата на отчета. Отчетът от изчислението е наличен под Отчети, Изпълнение, но използва стандартния формат на EPANET, а не формата, зададен от тези настройки. Редовете се пазят и се записват обратно, ако запишете EPANET файл.';
$ec_lang['lpn_inp_drop_sections']='Този файл съдържа раздел, който тази страница изобщо не чете. Нищо тук не го използва. Пази се цял и се записва обратно, ако запишете EPANET файл.';
$ec_lang['lpn_inp_drop_comments']='Тези редове с коментари в графиците или в простите управления на този файл не бяха внесени, защото тази страница няма къде да ги пази (например между редовете на един график). Всеки график и всяко управление бяха внесени изцяло.';
$ec_lang['lpn_inp_drop_quality_options']='Този файл задава опции на EPANET за качеството на водата: опцията Quality, която назовава вида анализ на качеството на водата, и две настройки, свързани с химично вещество, Relative diffusivity и Quality tolerance. И трите се пазят и използват. Възрастта на водата, проследяването на източник и химичното вещество се изчисляват тук всяко поотделно, а двете настройки за химичното вещество се използват при изчисление на химично вещество. Всички те се записват обратно, ако запишете EPANET файл.';
$ec_lang['lpn_inp_drop_file_options']='Този файл сочи към спомагателен файл: Map, който съдържа координати, или Hydraulics, който съдържа вече изчислена хидравлика. Тази страница не може да отвори нито единия, затова редовете се пазят такива, каквито са, и се записват обратно, ако запишете EPANET файл.';
$ec_lang['lpn_inp_drop_other_options']='Този файл задава опции, които тази страница не чете. Нищо тук не ги използва. Те се пазят и се записват обратно, ако запишете EPANET файл.';
$ec_lang['lpn_inp_drop_net_options']='Този EPANET .net файл задава настройки, за които тази страница няма контрола, затова стойностите им са изброени тук, вместо да бъдат пренесени. Всичко останало премина. Ако ви трябват, отворете файла в EPANET и използвайте Файл, Изнеси, Мрежа, за да го запишете като .inp файл, после внесете него.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Това беше EPANET .net файл, собственият проектен формат на EPANET. Форматът няма публикувана спецификация; тази страница го чете, като използва формат, изведен от примерни файлове, затова го използвайте само когато няма наличен .inp файл. Файлът .inp е документираният формат, който другите програми четат: в EPANET използвайте Файл, Експортиране, Мрежа, за да запишете такъв, и внесете този файл вместо това, когато е възможно.';
$ec_lang['lpn_inp_drop_backdrop']='Този файл сочи фоново изображение, но не съдържа самото изображение. Добавете го сами чрез Файл, Фоново изображение, Добави изображение.';
$ec_lang['lpn_inp_drop_dangling']='Тези тръби сочат възел, който не е във файла, затова бяха пропуснати.';
$ec_lang['lpn_inp_drop_units']='Единицата за водно количество, посочена в този файл, не е позната на тази страница, затова всяко число бе прочетено като галони в минута. Проверете всяка стойност, преди да използвате резултатите.';
$ec_lang['lpn_inp_drop_anchor_missing']='Този текст беше прикачен към възел, резервоар или цистерна, които не са във файла. Внесен е като свободен текст на мястото, зададено във файла, и не е прикачен към никакъв елемент.';
$ec_lang['lpn_import_notes_heading']='Този проект бе прочетен от EPANET файл. Част от съдържанието на файла се пази, но не се използва на тази страница.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='Отворен {name} от файл и добавен в този браузър като нов проект.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Проектен файл';
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
$ec_lang['lpn_file_upload_explain']='Този браузър не може да се свързва с файл, затова отварянето на файл тук всъщност е качване: проектът се копира в браузъра, а единственият начин да запишете работата си обратно във файла е да го презапишете чрез Файл, Запиши като.';
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
$ec_lang['lpn_file_saveas_tip_download']='Записва чрез настройките за изтегляне на браузъра. Този браузър не може да се свързва с файл, затова Запиши е изключено и е налично само Запиши като. Ако настройката на браузъра „Питай къде да запазвам всеки файл“ е включена, оригиналният файл може да бъде избран и презаписан.';
$ec_lang['lpn_status_uploaded']='Проектният файл е качен. Не може да се поддържа връзка с него, затова единственият начин да запишете обратно в него е чрез Файл, Запиши като.';
$ec_lang['lpn_status_downloaded']='Изтеглен {file}. Този браузър не може да се свързва с файл, затова проектът остава отбелязан като незаписан във файл.';
$ec_lang['lpn_status_file_opened']='Отворен {file}.';
$ec_lang['lpn_status_already_open']='Този файл вече е отворен тук като {name}, затова се превключи към него, вместо да се отвори второ копие.';
$ec_lang['lpn_status_already_open_dirty']='Този файл вече е отворен тук като {name}, с промени, които не сте записали в него. Превключи се към него, вместо да се отвори второ копие. Използвайте Файл, Върни записаното, ако искате версията от диска вместо това.';
$ec_lang['lpn_status_saved']='Записан {file}.';
$ec_lang['lpn_status_reverted']='{file} бе зареден отново от диска.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Да запишем ли промените в {name}, преди да го затворим?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} се съхранява само в този браузър. Ако го затворите, без да го запишете във файл, той ще изчезне завинаги.';
$ec_lang['lpn_close_discard']='Затвори без записване';
$ec_lang['lpn_cancel']='Отказ';
$ec_lang['lpn_revert_confirm']='Да се отхвърлят ли направените промени и да се презареди ли {file} от диска?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Този проект произхожда от {file}, но връзката с този файл е загубена. Изберете файла отново, за да се свържете с него.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Не можа да се запише във файла. Възможно е да е преместен или преименуван, или разрешението да е било оттеглено. Работата ви все още е запазена в този браузър.';
$ec_lang['lpn_file_changed_elsewhere']='Друг потребител е записал в този файл, откакто го отворихте, затова записването сега ще презапише тази работа. Използвайте Файл, Запиши като, за да запишете промените си в отделен файл, или Файл, Върни записаното, за да отхвърлите промените си и да заредите записаната версия.';
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
$ec_lang['lpn_lock_somebody']='Някой друг';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} има отворен този файл.';
$ec_lang['lpn_lock_open_readonly']='Отвори само за четене';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Разбий заключването';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Изглежда, че този файл се използва.';
$ec_lang['lpn_lock_open_care']='За да избегнете загуба на данни, изберете внимателно измежду опциите по-долу.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='Използва се от {x}.';
$ec_lang['lpn_lock_age_edited']='За последно е редактиран преди {x}.';
$ec_lang['lpn_lock_age_saved']='За последно е записан преди {x}.';
$ec_lang['lpn_lock_age_never_saved']='В този файл още не е записвано нищо.';
$ec_lang['lpn_lock_age_unknown']='Няма запис колко дълго се използва, или кога за последно е записван или редактиран.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='„Попитай“ уведомява този, който има отворен файла, че искате да го получите, и не променя нищо друго. „Отвори само за четене“ ви позволява да го разгледате и да променяте каквото пожелаете, без да можете да записвате тук. „Разбий заключването“ ви позволява да запишете върху файла; незаписаната им работа не се губи, но те вече няма да могат да записват тук, и може да се наложи някой да обедини двете ръчно.';
$ec_lang['lpn_lock_ask']='Попитай';
// Asked at the one moment the name is useful. Nothing is written to this computer for it; the lock
// broker keeps it in that file's lock record for the holder to read (Tom, 2026-09-29, correcting a
// prompt that said "stored only in this browser").
$ec_lang['lpn_lock_ask_prompt']='Кого да посочим като питащ? Например въведете инициалите си. Те се съхраняват със заключването на този файл на нашия сървър, за този, който го има отворен, и се изтриват в рамките на 30 дни.';
$ec_lang['lpn_lock_ask_sent']='Помолихме този, който има отворен файла, да го затвори. Ще видят съобщението до минута, ако страницата им е все още отворена. Нищо друго не се е променило, и файлът остава техен, докато не го затворят.';
$ec_lang['lpn_lock_ask_failed']='Съобщението ви не можа да бъде доставено. Или в момента никой няма отворен този файл, или сървърът не бе достижим.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Този файл не бе отворен, и нищо тук не се промени. Друг все още го има отворен.';
// Task 747: a file copied outside this page keeps its original's document ID, and so its lock. Asked
// whenever this browser cannot guarantee it already knows the file (Tom, 2026-09-30). {date} is when
// the ID was minted, in the visitor's own regional date-time format.
$ec_lang['lpn_copy_title']='Да се отбележи ли файлът като ново копие?';
$ec_lang['lpn_copy_body']='Този файл казва, че е създаден на {date}, а този браузър не го разпознава. Това оригиналният файл ли е (запазва се същото заключване) или копие (прави се ново заключване)?';
$ec_lang['lpn_copy_body_nodate']='Този браузър не разпознава този файл. Това оригиналният файл ли е (запазва се същото заключване) или копие (прави се ново заключване)?';
$ec_lang['lpn_copy_original']='Оригинал; запази същото заключване';
$ec_lang['lpn_copy_copy']='Копие; направи ново заключване';
// What "Original" does when the file's id is already open in a tab here with a different file:
// switch to the tab, without changing the tab's file.
$ec_lang['lpn_copy_kept_link']='Отворен е {name} като оригинал, преместен на ново място. Записването сега пише в този файл.';
// Tom, 2026-10-05: the copy is saved the moment it is chosen, so nobody has to remember to.
$ec_lang['lpn_copy_opened']='Отворен е {file} като копие и записан, с ново заключване.';
// Said only when that save did not happen (permission refused, file gone); the tab stays unsaved.
$ec_lang['lpn_copy_opened_unsaved']='{file} е отворен като копие, с ново заключване, което ще се запише със следващото записване на файла.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} желае да редактира този файл. Когато сте готови, запишете работата си и използвайте Файл, Затвори проект, за да го предадете.';
$ec_lang['lpn_ago_seconds']='{n} секунди';
$ec_lang['lpn_ago_minutes']='{n} минути';
$ec_lang['lpn_ago_hours']='{n} часа';
$ec_lang['lpn_ago_days']='{n} дни';
$ec_lang['lpn_ago_unknown']='неизвестно време';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Съобщения';
$ec_lang['lpn_msglog_heading']='Скорошни съобщения';
$ec_lang['lpn_msglog_empty']='Все още няма съобщения.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='преди {x}';
$ec_lang['lpn_msglog_note']='Най-новите първи. Тази страница пази последните {n} съобщения, докато е отворена, и не ги съхранява на компютъра.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Само за четене: {name} има отворен този файл. Тук всичко може да се променя, но не може да се записва. Използвайте Файл, Запиши като, за да запишете в друг файл.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Внимание: сървърът не можа да бъде достигнат, за да се провери или създаде заключване на този проект, затова друг потребител може да редактира същия файл едновременно. Ще се появи съобщение, ако заключването се възобнови.';
$ec_lang['lpn_lock_storage_error']='Внимание: този сайт не може да записва данни за заключване, затова друг потребител може да редактира същия файл едновременно. Това е грешка в конфигурацията на сървъра, която не може да се поправи от тази страница: папката за заключвания не е достъпна за запис от уеб сървъра.';
$ec_lang['lpn_lock_full_error']='Внимание: този сайт няма повече място за записи за заключване, затова друг потребител може да редактира същия файл едновременно. Това е грешка в конфигурацията на сървъра, която не може да се поправи от тази страница.';
$ec_lang['lpn_lock_not_asked']='Заключването не е активно за този проект, затова друг потребител може да редактира същия файл едновременно. Този проект още няма идентификатор; записването му във файл му присвоява такъв.';
$ec_lang['lpn_lock_restored']='Заключването е възстановено и този файл вече може да се записва.';
$ec_lang['lpn_lock_dismiss']='Скрий това съобщение';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Проектът ще бъде записан във файл на този компютър. Записва се само когато го запишете, и в никой друг момент.';
$ec_lang['lpn_file_training_2']='За да не редактират двама души един и същ файл едновременно, този сайт следи кой го е отворил. Ако вече е отворен от някого, все пак може да се отвори за преглед или да се копира, за да се запази.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='При първото записване браузърът пита дали този сайт може да редактира файла. Въпросът идва от браузъра, а не от този сайт, и разрешението е необходимо, за да може Запиши да записва във файла. Обикновено се иска само веднъж за файл.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Изберете файла отново';
$ec_lang['lpn_file_reconnect']='Свържи се отново с този файл';
$ec_lang['lpn_file_reconnect_alert']='Този проект произхожда от {file}. Браузърът ви отново се нуждае от разрешението ви, преди да може да записва в него. Свържете се отново по-долу.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Това е същият файл, който е отворен от някой друг, затова не може да бъде презаписан. Изберете друг файл или друго име.';
$ec_lang['lpn_saveas_overwrites_project']='Този файл вече съдържа друг проект, {name}. Записването тук ще го замени напълно. Продължавате ли?';
$ec_lang['lpn_saveas_overwrites_newer']='Този файл се е променил, откакто последно го видяхте, така че почти сигурно някой друг е записал в него. Записването тук ще замени неговата версия с вашата. Продължавате ли?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Име на този проект';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='Затворен {closed}. Сега се показва {opened}.';
$ec_lang['lpn_status_closed_empty']='Затворен {closed}. Стартиран е нов празен проект.';
$ec_lang['lpn_storage_full']='Не е записано. Хранилището на браузъра е пълно или недостъпно, затова последните ви промени ще бъдат загубени при затваряне на този раздел.';
$ec_lang['lpn_storage_unreadable']='Не е записано. Този проект не можа да бъде прочетен от хранилището на браузъра. Записаното му копие е оставено точно такова, каквото е, и няма да бъде презаписано, затова нищо в този раздел не се записва. Отворете файл или създайте нов проект, за да продължите работа.';
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
$ec_lang['lpn_about_credits']='Заслуги';
$ec_lang['lpn_help_welcome']='Начална страница';
$ec_lang['lpn_about_license']='Лицензирано под GNU Общ публичен лиценз v3.0 или по-нова версия.';
$ec_lang['lpn_notes_1_term']='Как се решава';
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
$ec_lang['lpn_notes_1_def']='По подразбиране мрежата се изчислява от решаващия модул на EPANET. Когато е зададена обща продължителност на изчислението, всяка стъпка на отчитане се изчислява последователно: цистерните се пълнят и изпразват, потребностите следват графиците си, а лентата с инструменти възпроизвежда изчислението. При отметнато Използвай вградения решаващ модул, когато е възможно, решение за един момент може да се изчисли вместо това от вградения решаващ модул, но изчисление за период от време или мрежа с вентил-прекъсвач на налягането или вентил с общо предназначение (PBV, GPV) винаги се изчислява от решаващия модул на EPANET.';
$ec_lang['lpn_notes_2_term']='Какво не прави';
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
$ec_lang['lpn_notes_2_def']='Хидравличният удар не се моделира: всички резултати са за установено или бавно променящо се течение, а не за преходната вълна на налягане при бързо затваряне на вентил.';
$ec_lang['lpn_notes_3_term']='Записване на проекти';
$ec_lang['lpn_notes_3_def']='Всеки проект е раздел (таб), и всеки раздел се записва в този браузър, докато работите. Изчистването на данните на браузъра ги изтрива всичките, затова пазете работата си във файл: Файл, Запиши като. Звездичка на раздел означава, че той съдържа промени, които не са във файл, а затварянето на този раздел първо пита. Нищо никога не се записва във файл, освен ако не е избрано Запиши или Запиши като. В някои браузъри проект се свързва с файла, в който е записан, и Файл, Запиши записва обратно в същия файл оттогава нататък; в други връзка не е възможна, затова Запиши е изключено и е налично само Запиши като. Този сайт следи кой има отворен файл на проект, за да не записват двама души един върху друг. Отварянето на файл, който колега вече е отворил, предлага Попитай, Отвори само за четене и Прекъсни заключването. Ако сървърът не може да бъде достигнат, предупреждение казва, че друг потребител може да редактира същия файл едновременно.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Помпена крива';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Помпата следва H = H₀ − aQ^b, където H е напорът, който помпата добавя, а Q е водното количество през нея. Точките на кривата се въвеждат във Вода, Библиотеки, като крива на напора на помпата, а помпата посочва тази крива в Свойствата. Три точки — напорът при нулево водно количество, нормалната работна точка и точката на най-високо водно количество — определят пряко H₀, a и b и следват публикуваната крива най-точно. Две точки определят парабола (b = 2) с връх при нулево водно количество. Една точка използва правилото на EPANET: напорът при нулево водно количество е 1,33334 пъти въведения напор, а най-високото водно количество е 2 пъти въведеното водно количество, което отново дава b = 2. Помпа без посочена крива не добавя никакъв напор. Кривата не се прекъсва там, където напорът достига нула, затова водно количество, по-голямо от това, което кривата може да достави, дава отрицателен напор. Решението е по-голяма помпа или по-малка потребност, а не различно пасване на крива. Крива може да съдържа повече от три точки. Решаващият модул на EPANET получава всички и интерполира между тях, докато редът Уравнение и вграденият решаващ модул използват най-ниската, средната и най-високата точка.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='Помощ за колоните на таблицата';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE -- the Hide/Show row beside it names the
// identical menu. **GESTURE FIRST, THEN ACTION, SINCE 2026-10-06** (Ida, User guide): the cells were
// swapped in all 27 files, by script and unchanged, so this table reads in the same order as the
// key-then-action tables beside it (lpn_notes_7_def, lpn_hotkeys_map_def).
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Щракнете върху заглавието</td><td>Избор на колона</td></tr><tr><td>Ctrl+щракване или Shift+щракване върху друго заглавие</td><td>Добавяне или разширяване на избора на колони</td></tr><tr><td>Плъзнете или използвайте Управление на колони… в менюто при десен клик или ⋮</td><td>Преместване (пренареждане) на избраната(ите) колона(и)</td></tr><tr><td>Задръжте показалеца върху горния ъгъл на заглавие, или го изберете, или преминете с Tab в него</td><td>Меню ⋮ и стрелка за сортиране.</td></tr><tr><td>Десен клик върху заглавие или менюто ⋮ в горния десен ъгъл на заглавието</td><td>Скриване, Покажи всички, или управление на видимостта и реда</td></tr><tr><td>Иконата стрелка в горния десен ъгъл на заглавието</td><td>Сортиране по колона</td></tr><tr><td>Десен клик, менюто ⋮ в горния десен ъгъл на заглавието, или Ctrl+Shift+V</td><td>Постави като нови редове в края на таблицата</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Клавишни комбинации за таблицата';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Стрелки</td><td>Придвижване.</td></tr><tr><td>Tab, Enter</td><td>Завършва въвеждането и премества с една клетка надясно (Tab) или надолу (Enter).</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Премества с една клетка назад (Shift+Tab) или нагоре (Shift+Enter).</td></tr><tr><td>Shift+стрелки</td><td>Разширява селекцията.</td></tr><tr><td>Ctrl+C</td><td>Копира селекцията.</td></tr><tr><td>Ctrl+D</td><td>Запълва селекцията надолу от горния ѝ ред.</td></tr><tr><td>Ctrl+Enter</td><td>Запълва селекцията със стойността на активната клетка.</td></tr><tr><td>Ctrl+A</td><td>Избира цялата таблица.</td></tr><tr><td>Ctrl+Shift+V</td><td>Поставя като нови редове в края на таблицата.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Превключва към следващия или предишния раздел, независимо дали е таблица или графика.</td></tr><tr><td>Delete</td><td>Изчиства активната клетка. За да изчистите избран диапазон, щракнете с десния бутон и изберете Изтриване.</td></tr><tr><td>F2</td><td>Отваря клетка за редактиране.</td></tr><tr><td>Esc</td><td>Отменя редактиране.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Границите на цветовите диапазони остават същите';
$ec_lang['lpn_notes_color_def']='Границите на цветовите диапазони се задават, когато се избере метод за класификация на данните. Те не се задават отново при всяка времева стъпка, защото това би направило цветовете да означават нещо ново на всяка стъпка, което не помага за визуализацията на система. Сценарият показва границите на Базовия. EPANET работи по същия начин. За да получите нови граници, изберете метод отново или въведете граници.';
$ec_lang['lpn_notes_engine_term']='Коя версия на EPANET изпълнява тази страница';
$ec_lang['lpn_notes_engine_def']='Решаващият модул на EPANET на тази страница е OWA-EPANET 2.3.5, издаден на 20 февруари 2025 г. EPANET се разработва от Open Water Analytics, общност, която работи с Агенцията за опазване на околната среда на САЩ, която издаде версия 2.2.0 през декември 2019 г. Отчетът от изпълнението го нарича 2.3.05, защото модулът записва последното число с две цифри. Той достига до тази страница чрез epanet-js 0.9.0 на Luke Butler, под лиценз MIT, и работи във вашия браузър: мрежата ви никога не се изпраща никъде за решаване.';
// The Notes example (Task 785). Held by dev/lpn-spike/user-guide-notes-harness.js.
$ec_lang['lpn_guide_nt_example_term']='Пример върху Net1: помпа извън кривата си';
$ec_lang['lpn_guide_nt_example_def']='Отворете примера Net1 и изберете Вода, Библиотеки. Крива 1, Pump Curve for Pump 9, има една точка, 1500 gpm при 250 ft. Напорът при нулево водно количество е 333,3 ft, а най-високото водно количество е 3000 gpm. При 3500 gpm, което е отвъд края на кривата, кривата дава напор −120,4 ft. Решаващият модул на EPANET отчита същия напор, загуба от 120,4 ft през помпата, и предупреждава, че помпите не могат да доставят достатъчно водно количество или напор.';
// The user manual's own entry (Task 785). Held by dev/lpn-spike/user-guide-own-harness.js.
$ec_lang['lpn_guide_own_example_def']='<p>Отворете примера Net1, натиснете Ctrl+K и въведете critical. Менюта показва реда Анализ на критичността… под Вода, Анализ. Кутии показва записите, които го споменават, между които Търсене и замяна, Противопожарно водно количество: анализ и Критичност: анализ, както и този запис. Изборът на реда показва къде е Анализ на критичността… в менюто Анализ и не го изпълнява.</p>';
$ec_lang['lpn_id_invalid']='Въведете ID без интервали и без кавички.';
$ec_lang['lpn_id_taken']='Този ID вече се използва.';
$ec_lang['lpn_diag_no_fixed_head']='Добавете резервоар или цистерна. Мрежата се нуждае от поне едно известно водно ниво, преди да може да бъде решена.';
$ec_lang['lpn_diag_dangling_link']='Тръба или помпа се свързва с възел, който вече не съществува:';
$ec_lang['lpn_diag_unreachable']='Тези възли нямат път до резервоар или цистерна:';
// Tom, 2026-10-09: a node nothing connects to a source is left out of the run, not refused. The
// ids stand in the status bar until the network changes. Said in EPANET's own terms (junction,
// reservoir, tank) and never as an error, because the run happened.
$ec_lang['lpn_omitted_note']='Пропуснати в това изчисление, защото от тях няма път до резервоар или цистерна: {ids}';
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
$ec_lang['lpn_engine_fetching']='Изтегляне на решаващия модул на EPANET. Той се изтегля веднъж и след това остава на това устройство, така че след това работи офлайн.';
$ec_lang['lpn_engine_ready']='Решаващият модул на EPANET вече е на това устройство и работи офлайн.';
$ec_lang['lpn_engine_unavailable']='Решаващият модул на EPANET, който е необходим за изчисляване на вентили-прекъсвачи на налягането и вентили с общо предназначение (PBV, GPV), не можа да бъде изтеглен. След едно свързване с интернет решаващият модул се запазва на това устройство.';
// The cause-specific sibling: {reason} is lpn_time_engine_fetch_failed (only a download can reach this notice).
// Offline keeps the sentence above. {wrong} in lpn_time_engine_run_failed is filled with lpn_wrong_btn.
$ec_lang['lpn_engine_unavailable_why']='Вентилите-прекъсвачи на налягането и вентилите с общо предназначение (PBV, GPV) не могат да се изчислят без решаващия модул на EPANET. {reason}';
$ec_lang['lpn_engine_needed_loading']='Решаващият модул EPANET се зарежда, докато изграждате мрежата. Резултатите ще бъдат налични, когато зареждането завърши напълно.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Напредък на зареждането на решаващия модул';
$ec_lang['lpn_engine_wait']='Зареждане на решаващия модул. Резултатите ще закъснеят за момент. Продължете да работите.';
$ec_lang['lpn_engine_wait_pct']='Решаващият модул е зареден на {percent}%.';
$ec_lang['lpn_engine_wait_bytes']='Решаващият модул е зареден дотук с {kb} KB. Общият размер не е наличен, затова процентът на завършеност е неизвестен.';
$ec_lang['lpn_engine_needed_failed']='Решаващият модул EPANET все още не е зареден, не може да бъде зареден, а тази мрежа може да бъде решена само от него. Той ще бъде зареден, когато сте свързани с интернет.';
$ec_lang['lpn_engine_needed_failed_why']='Тази мрежа може да се изчисли само с решаващия модул на EPANET. {reason}';
$ec_lang['lpn_diag_valve_on_fixed_head']='Тези вентили са свързани директно към резервоар или цистерна, които фиксират хидравличната линия на напора във възела, така че вентилът няма какво да регулира. Поставете къса тръба между вентила и резервоара или цистерната:';
$ec_lang['lpn_diag_not_converged']='Не бе намерено решение. Проверете за стойности, невъзможни в реалността, например нулев диаметър.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Решението не се сходи. Тези числа са от последната итерация, не са отговор. Не ги използвайте.';
$ec_lang['lpn_diag_not_converged_trials']='Спря след {iterations} итерации.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Спря след {iterations} итерации при относителна грешка от {error}, която не достигна настройката за точност от {accuracy}.';
$ec_lang['lpn_field_roughness']='Грапавост';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Коефициент C на Хейзън-Уилямс. По-голямо число означава по-гладка тръба: около 150 за нова пластмаса, 130 за нова стомана или чугун и 100 за стара тръба.';
$ec_lang['lpn_field_length']='Дължина';
// Task 643 (Tom, 2026-10-14): an Auto length is the slope distance. No claim about accuracy (Task 641).
$ec_lang['lpn_field_length_slope_tip']='Дължина на тръбата. Когато е отметнато Автоматично, дължината се измерва по наклона: начертаната дължина, съчетана с разликата в котите на двата крайни възела.';
$ec_lang['lpn_field_from']='От';
$ec_lang['lpn_field_to']='До';
// Tom, 2026-10-09: From and To are editable text. Said in the box a refused ID is said in.
$ec_lang['lpn_link_end_unknown']='Няма възел с ID {id}.';
$ec_lang['lpn_link_end_same']='От и До трябва да са различни възли.';
// Tom, 2026-10-09: "Break link for node?", adapted to name the pipe. The two answers are Yes and No
// because No is not a cancel: it places the node where it was pressed, joined to nothing.
$ec_lang['lpn_split_pipe_ask']='Да се раздели ли тръба {id} при този възел?';
// Object snap (Task 782). The tip beside the snap glyph on a pipe vertex: "Pipe 10, vertex 2". A node
// or a pipe is named by its type word and ID alone.
$ec_lang['lpn_snap_vertex']='{link}, пречупна точка {n}';
// A tank, reservoir or junction snapped onto a node of another type is placed at exactly that
// position. Two nodes at one point are legal in EPANET, and the map cannot show that they are separate.
$ec_lang['lpn_snap_node_on_node']='{new} е поставен на мястото на {target}. Двата възела не са свързани.';
// The same, for a node DRAGGED onto another node.
$ec_lang['lpn_snap_moved_on_node']='{moved} е преместен на мястото на {target}. Двата възела не са свързани.';
// The Shape (Task 779): map annotation, a point, a polyline or a polygon. Tom, 2026-10-06: "Either
// way, we call it a 'Shape'". The tip beside the snap glyph on a Shape point: "Shape S1, point 2".
$ec_lang['lpn_snap_shape_point']='{shape}, точка {n}';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Тип вентил';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Тип на вентила. Дроселиращият вентил (TCV) прилага постоянна загуба. PRV, PSV и FCV поддържат налягане или водно количество и се отварят напълно, затварят се или частично се затварят при промяна на хидравличните условия. PBV отнема постоянно налягане, а GPV следва крива на загубата на напор. Типовете управляват различни хидравлични свойства, затова настройките може да се загубят при смяна на типа.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Дроселиращ (TCV)';
$ec_lang['lpn_valve_type_prv']='Понижаващ налягането (PRV)';
$ec_lang['lpn_valve_type_psv']='Поддържащ налягането (PSV)';
$ec_lang['lpn_valve_type_fcv']='Регулиращ водното количество (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Прекъсвач на налягането (PBV)';
$ec_lang['lpn_valve_type_gpv']='Общо предназначение (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Спад на налягането';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='Налягането, изгубено във вентила. Прекъсвачът на налягането винаги отнема точно това налягане, независимо в коя посока тече водата. Това е спад през вентила, а не налягане, което се поддържа.';
$ec_lang['lpn_inp_drop_gpv_curve']='Този вентил сочи крива на загуба на напор, която не е във файла. Вентилът беше импортиран без крива, затова остава напълно отворен, докато не бъде избрана крива.';
$ec_lang['lpn_gpv_curve_source']='Крива на загуба на напор на вентила';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Кривата в кутията Библиотеки, която дава загубата на напор през този вентил при всяко водно количество. Няколко вентила могат да използват една и съща крива, а редактирането ѝ там променя всички тях.';
$ec_lang['lpn_field_valve_setting_pressure']='Настройка на налягането';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Вентил за понижаване на налягането (PRV) поддържа налягането от долната си страна по течението на или под тази стойност. Вентил за поддържане на налягането (PSV) поддържа налягането от горната си страна по течението на или над тази стойност.';
$ec_lang['lpn_field_valve_setting_flow']='Настройка на водното количество';
$ec_lang['lpn_field_valve_setting_flow_tip']='Максимално водно количество през вентила. Когато водното количество е по-малко от тази стойност, вентилът е напълно отворен и не добавя загуба.';
$ec_lang['lpn_field_valve_setting']='Настройка';
$ec_lang['lpn_field_valve_setting_loss']='Коефициент на загуба';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Колко напор отнема дроселиращият вентил, изразено като кратно на скоростния напор. Използвайте 0 за вентил, стоящ напълно отворен. Това единствено число е цялата загуба на дроселиращ вентил.';
$ec_lang['lpn_field_valve_diameter_tip']='Диаметър на отвора на вентила. Скоростта през вентила се изчислява от този диаметър, а загубата — от тази скорост.';
$ec_lang['lpn_field_valve_km_tip']='Загуба от тялото на вентила, докато той стои напълно отворен, в допълнение на всичко, което отнема настройката на вентила. Изразява се като кратно на скоростния напор. Използвайте 0, за да я пренебрегнете.';
$ec_lang['lpn_field_km']='Коефициент на местна загуба, k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Местна загуба, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Крива на напора на помпата';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Кривата в кутията Библиотеки, която дава напора, който тази помпа добавя при всяко водно количество. Няколко помпи могат да използват една и съща крива, а редактирането ѝ там променя всички тях.';
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
$ec_lang['lpn_field_desc']='Описание';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Таг';
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
$ec_lang['lpn_field_tag_tip']='Тагът може да носи всякакво значение, което ви е нужно, например пресова зона или работна поръчка. Никое изчисление тук или в EPANET не го чете. Тагът е една дума: EPANET спира да чете на първия интервал, затова интервал не се допуска, докато го въвеждате. Той се пренася в и от EPANET файла.';
$ec_lang['lpn_pump_effic_curve']='Крива на ефективност на помпата';
$ec_lang['lpn_pump_effic_curve_tip']='Кривата в кутията Библиотеки, която показва колко ефективна е тази помпа при всяко водно количество. Няколко помпи могат да използват една и съща крива, а редактирането ѝ там променя всички тях. Тази помпа пази само указанието към нея; самите точки се четат и редактират под Библиотеки, Криви.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Не е избрана крива';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Криви';
$ec_lang['lpn_curve_library_link_tip']='Отваря кутията Библиотеки в нейния раздел Криви, където крива се добавя, описва, редактира и изтрива. Елементът посочва коя крива използва.';
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
$ec_lang['lpn_curve_kind_head']='Напор на помпата';
$ec_lang['lpn_curve_kind_effic']='Ефективност на помпата';
$ec_lang['lpn_curve_kind_volume']='Обем на цистерната';
$ec_lang['lpn_curve_kind_headloss']='Загуба на напор на вентила';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Видът не е посочен';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Обем';
$ec_lang['lpn_pump_effic_col']='Ефективност';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Тази помпа няма избрана крива на ефективност, затова работи при ефективността, зададена за цялата мрежа, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Тази помпа сочи крива на ефективност, наречена {name}, която нищо в този проект не задава, затова работи при ефективността, зададена за цялата мрежа, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Режим: Избор. Изберете елемент, етикет или текст, за да го видите или промените. Плъзнете, за да преместите възел, етикет или текст. Използвайте инструмента Пречупни точки, за да добавяте или премахвате пречупките на тръба.';
$ec_lang['lpn_mode_delete']='Режим: Изтриване. Изберете елемент, за да го премахнете.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Режим: Пречупни точки. Пречупните точки на всяка тръба се показват като малки квадратни дръжки. Посочете точка върху тръба, за да добавите пречупна точка, изберете дръжка, за да я премахнете, или плъзнете дръжка, за да я преместите. Нищо друго на картата не може да се променя в този режим.';
$ec_lang['lpn_mode_zoom_window']='Режим: Мащаб в прозорец. Посочете два противоположни ъгъла на правоъгълник или плъзнете такъв върху картата, за да увеличите тази област.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Нищо не е избрано. Първо изберете елемент на картата, после натиснете Delete.';
$ec_lang['lpn_mode_add_junction']='Режим: Добавяне на възел. Посочете място на картата, за да поставите възел. Превключете към режим Избор, за да променяте или премествате елементи, етикети и текстове.';
$ec_lang['lpn_mode_add_reservoir']='Режим: Добавяне на резервоар. Посочете място на картата, за да поставите резервоар. Превключете към режим Избор, за да променяте или премествате елементи, етикети и текстове.';
$ec_lang['lpn_mode_add_tank']='Режим: Добавяне на цистерна. Посочете място на картата, за да поставите цистерна. Превключете към режим Избор, за да променяте или премествате елементи, етикети и текстове.';
$ec_lang['lpn_mode_add_pipe']='Режим: Добавяне на тръба. Изберете начален възел, после краен възел, за да ги свържете. Посочете точки в свободно пространство между тях, за да прегънете линията, или натиснете Escape, за да започнете отначало. Превключете към режим Избор, за да променяте или премествате елементи, етикети и текстове.';
$ec_lang['lpn_mode_add_pump']='Режим: Добавяне на помпа. Изберете начален възел, после краен възел, за да ги свържете. Посочете точки в свободно пространство между тях, за да прегънете линията, или натиснете Escape, за да започнете отначало. Превключете към режим Избор, за да променяте или премествате елементи, етикети и текстове.';
$ec_lang['lpn_mode_add_valve']='Режим: Добавяне на вентил. Изберете начален възел, после краен възел, за да ги свържете. Посочете точки в свободно пространство между тях, за да прегънете линията, или натиснете Escape, за да започнете отначало. Превключете към режим Избор, за да променяте или премествате елементи, етикети и текстове.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Режим: Добавяне на текст. Посочете място на картата, за да поставите текст. Посочете място близо до възел, за да прикачите текста към този възел. Превключете към режим Избор, за да променяте или премествате елементи, етикети и текстове.';
$ec_lang['lpn_mode_add_chain']='Режим: Верига възел-тръба. Посочете точка на картата, за да добавите възел, после посочете всяка следваща точка, за да добавите тръба и възел. Посочете съществуващ възел, за да продължите от него. Натиснете Escape, за да завършите веригата. Превключете към режим Избор, за да променяте или премествате елементи, етикети и текстове.';
$ec_lang['lpn_mode_add_shape']='Режим: Добавяне на фигура. Посочете всяка точка. Посочете отново последната точка или натиснете Enter, за да завършите; посочете първата точка, за да затворите многоъгълник.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Използвайте този режим, за да променяте, премествате и плъзгате обекти и текст на картата или да премествате картата. Това е режимът по подразбиране за картата. Второ натискане на Esc премахва селекцията.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Автоматично';
$ec_lang['lpn_method_switch_confirm']='Смяната на метода за триене не променя числата за грапавост, вече въведени за тръбите, а грапавост за един метод е безсмислена за друг. След това проверете всяка тръба. Да се смени ли въпреки това?';
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
$ec_lang['lpn_field_closed']='Затворена';
$ec_lang['lpn_field_closed_tip']='Затворете тази тръба, за да не може вода да преминава през нея. Тръбата остава на картата и запазва всичките си числа, и можете да я отворите отново по всяко време.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Географска дължина';
$ec_lang['lpn_field_lat']='Географска ширина';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Северна координата';
$ec_lang['lpn_field_easting']='Източна координата';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='С';
$ec_lang['lpn_field_easting_abbr']='И';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Шир.';
$ec_lang['lpn_field_lon_abbr']='Дълж.';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Въведете координатно местоположение, за да поставите този възел точно. В сценарий това местоположение важи само за него, точно както при плъзгане; в Базовия сценарий поставя възела навсякъде.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Това е извън картата. Географската ширина в Pseudo Mercator е от -85.05 до 85.05, а дължината — от -180 до 180.';
$ec_lang['lpn_field_text_size']='Коефициент за размер';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Показвай при всички нива на мащаба';
$ec_lang['lpn_field_text_all_zoom_tip']='Запазва този текст върху чертежа колкото и да намалите мащаба. Отметнете я, и текстът се скрива заедно с другите етикети, щом изгледът стане по-широк от прага за етикети, зададен в Карта и страница.';
$ec_lang['lpn_tool_labels']='Етикети';
$ec_lang['lpn_labels_heading_node']='Етикети на възлите';
$ec_lang['lpn_labels_heading_link']='Етикети на участъците';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Приложи към всички';
$ec_lang['lpn_settings_apply_to_all_tip']='Всеки вече начертан елемент от този вид получава ID, започващо с този текст. Всеки запазва номера си. ID, което не завършва на число, се оставя непроменено.';
$ec_lang['lpn_confirm_apply_prefix']='Да се преименуват ли елементите ({n}), така че техните ID да започват с {prefix}? Всеки запазва номера си.';
$ec_lang['lpn_prefix_applied']='Преименувани елементи: {n}. Непроменени елементи: {skipped}.';
$ec_lang['lpn_labels_suffix_gradient_tip']='Текст, добавян след градиента на загубата на напор в етикетите на картата. Не въвеждайте тук знак за процент. Той се добавя автоматично, когато мерните единици са проценти.';
$ec_lang['lpn_labels_separator']='Текст между стойностите';
$ec_lang['lpn_labels_separator_tip']='Текст между едно свойство и следващото в етикет. По подразбиране е интервал.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Приоритет';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='Редът, в който стойностите отпадат, когато етикет не се побира. Стойността с номер 1 отпада първа. Когато остане само една стойност и два етикета все още се застъпват, един от тях се скрива: този с по-ниската потребност, с налягане по-близо до средата на диапазона или с кота или напор, числено по-близки до стойностите на съседните възли.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Пр.';
$ec_lang['lpn_labels_col_after']='Сл.';
$ec_lang['lpn_labels_col_decimals']='Десетични';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_show_tip']='Редът, в който стойностите се появяват в етикет. Стойността с номер 1 идва първа: най-отгоре в подреден на редове етикет, и в началото на етикет на един ред.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Използвай мерни единици';
$ec_lang['lpn_labels_use_units_tip']='Отметнете, за да се показва мерната единица в полето След и в етикета и да се обновява при промяна на мерните единици. Изчистете отметката, за да въведете свой текст в полето След.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Начално състояние';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Цветове на възлите';
$ec_lang['lpn_settings_sym_link_colors']='Цветове на връзките';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Фоново изображение…';
$ec_lang['lpn_backdrop_add']='Добави';
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
$ec_lang['lpn_backdrop_scale']='Мащабирай чрез посочване';
$ec_lang['lpn_backdrop_scale_entry']='Мащаб по файл за геопривързване или размер на пиксел';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Мащабирай от текущия размер около избрана от вас точка';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Посочете точката от фоновото изображение, която трябва да остане на мястото си.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Мащабирайте спрямо текущия размер. 1 го запазва същото, 1,1 го прави с 10% по-голямо, 0,9 — с 10% по-малко.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Въведете размера на един пиксел на картата или поставете цялото съдържание на файла за геопривързване на изображението';
$ec_lang['lpn_backdrop_scale_entry_bad']='Въведете едно число за размера на един пиксел на картата или поставете всичките шест реда на файл за геопривързване.';
$ec_lang['lpn_backdrop_wld_bad']='Този файл за геопривързване завърта, огледално обръща или неравномерно разтяга изображението. Картата може само да премества изображение и да го мащабира еднакво и в двете посоки, затова файлът не беше използван.';
$ec_lang['lpn_backdrop_unreadable']='Вашият браузър не може да покаже това изображение. Запишете го като PNG или JPEG и го добавете отново.';
$ec_lang['lpn_backdrop_position']='Премести';
$ec_lang['lpn_backdrop_remove']='Премахни';
$ec_lang['lpn_backdrop_remove_confirm']='Да се премахне ли фоновото изображение?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Карта на света…';
$ec_lang['lpn_map_attach_tip']='Прикачва картата на света към този проект, без да го променя по друг начин.';
$ec_lang['lpn_map_attach_add']='Прикачи';
$ec_lang['lpn_map_attach_readjust']='Пренастрой';
$ec_lang['lpn_map_attach_readjust_tip']='Връща се към стъпка 2 от процеса на прикачване на картата.';
$ec_lang['lpn_map_attach_scale_from']='Мащабирай спрямо текущия размер…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Мащабирайте картата спрямо текущия ѝ размер, около средата на чертежа ви. 1 я запазва същата, 1.1 я прави с 10% по-голяма, 0.9 я прави с 10% по-малка.';
$ec_lang['lpn_map_attach_scale_from_bad']='Въведете едно число, по-голямо от нула.';
$ec_lang['lpn_map_attach_scale_from_done']='Картата е преоразмерена, а чертежът ви и всяка координата в него са точно каквито бяха.';
$ec_lang['lpn_map_attach_none']='Към този проект все още няма прикачена карта на света. Използвайте първо Карта, Карта на света, Прикачи.';
$ec_lang['lpn_map_attach_remove']='Откачи';
$ec_lang['lpn_map_attach_remove_tip']='Откача картата на света. Не засяга мрежата.';
$ec_lang['lpn_map_attach_done']='Картата на света вече се показва зад чертежа, а проектът е непроменен. Използвайте Карта, Карта на света, Откачи, за да я премахнете.';
// Edited by TGH 2026-10-07
$ec_lang['lpn_map_attach_removed']='Картата на света е откачена, а мрежата не е засегната.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Чертежът ви е върху карта на целия свят, в океана при нулева географска ширина и нулева дължина. Първо намерете своето място: премествайте и мащабирайте картата зад чертежа, потърсете име на място, или въведете географска ширина и дължина. Самият чертеж не се движи.';
$ec_lang['lpn_mapgeo_step1']='Стъпка 1 от 2: намерете местоположението на проекта';
$ec_lang['lpn_mapgeo_step2']='Стъпка 2 от 2: напаснете картата зад чертежа си';
$ec_lang['lpn_mapgeo_hint1']='Премествайте и мащабирайте картата зад чертежа си, или потърсете място, или въведете географска ширина и дължина. После натиснете Постави приблизително.';
$ec_lang['lpn_mapgeo_readjust_intro']='Чертежът ви е там, където последно сте го поставили. За да го преместите другаде, премествайте и мащабирайте картата зад чертежа, потърсете име на място, или въведете географска ширина и дължина. Самият чертеж не се движи.';
$ec_lang['lpn_mapgeo_hint2']='Плъзнете навсякъде, за да плъзнете картата под чертежа си. Чертежът ви и всяка координата в него остават точно където са. Натиснете Географски привържи тук, когато картата е правилна.';
$ec_lang['lpn_mapgeo_gestures']='Мащабирането движи чертежа ви и картата заедно, за да видите доколко добре съвпадат. Плъзгането движи само картата.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Завърти картата';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} градуса';
$ec_lang['lpn_mapgeo_dial_size']='Размер на картата';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} пъти';
$ec_lang['lpn_mapgeo_dial_help']='Плъзнете двата плъзгача, или въведете в полетата над тях, за да направите картата по-голяма или по-малка и да я завъртите. Средата на всеки плъзгач е стъпката на напасване, оставена без промяна, затова 1 и 0 означават да не я пипате. Клавишите със стрелки работят и на двата.';
$ec_lang['lpn_mapgeo_place']='Постави приблизително';
$ec_lang['lpn_mapgeo_finish']='Географски привържи тук';
$ec_lang['lpn_mapgeo_cancelled']='Картата на света е върната в предишното си положение, а чертежът не е преместван.';
$ec_lang['lpn_mapgeo_locked']='Завършете с бутона Географски привържи тук, или натиснете Отказ, преди да превключите проекти или да запишете. Картата на света все още се поставя.';
$ec_lang['lpn_backdrop_scale_prompt1']='Посочете две точки от фоновото изображение, например двата края на графичен мащаб. После въведете реалното разстояние между тях.';
$ec_lang['lpn_backdrop_scale_prompt2']='Реално разстояние между двете точки';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Посочете базовата точка (на изображението) за преместването.';
$ec_lang['lpn_backdrop_position_prompt2']='Изберете начина за определяне на крайната точка, после натиснете „Продължи“.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Настройване на фоновото изображение.';
$ec_lang['lpn_backdrop_target_label']='Премести тази точка до:';
$ec_lang['lpn_backdrop_target_node']='Възел';
$ec_lang['lpn_backdrop_target_free']='Произволна точка на картата';
$ec_lang['lpn_backdrop_target_coords']='Координати, които въвеждате';
$ec_lang['lpn_backdrop_coords_prompt']='Въведете X,Y, до които трябва да отиде тази точка';
$ec_lang['lpn_backdrop_continue']='Продължи';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// One key for the toolbar button, the Project menu row and the Settings box's own title (Task 699).
$ec_lang['lpn_tool_settings']='Настройки';
$ec_lang['lpn_settings_show_titles']='Показвай заглавията на страницата';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Скриване на тези заглавия';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Показване на помощта при избор';
$ec_lang['lpn_settings_area_hint_tip']='Показва подсказката над картата, която дава следващата стъпка, докато избирате област.';
$ec_lang['lpn_settings_hover_card']='Показвай всички свойства при посочване';
$ec_lang['lpn_settings_hover_card_tip']='Задръжте показалеца върху възел, връзка или абонат, за да видите всичките му свойства във вида, зададен в Настройки, при всеки мащаб, независимо дали етикетът се побира на картата. Това е настройка за този браузър, не за проекта.';
// Task 805 (Tom, 2026-10-15, R-396: "It would be good to be able to hide the amber override
// indicators from the map. Maybe a Map, Clean map button is a good idea after all"). The rings'
// own switch, in Settings, Map and page, Page; and the Map menu row that hides them with the
// controls over the drawing. Both are browser settings.
$ec_lang['lpn_settings_override_marks']='Показвай маркерите за свои стойности на картата';
$ec_lang['lpn_settings_override_marks_tip']='Показва кехлибарения пръстен около елемент със своя стойност в отворения сценарий и сивия прекъснат пръстен около елемент, който наследява такава. Панелът Таблици отбелязва свои стойности и в двата случая. Карта, Чиста карта скрива пръстените, докато е отметнато. Това е настройка за този браузър, не за проекта.';
$ec_lang['lpn_clean_map']='Чиста карта';
$ec_lang['lpn_clean_map_tip']='Отметнато: бутоните за мащаб, бутонът за уличната карта и сателита, бутонът Съобщения и известията, помощта за избор, бутонът за отзиви и пръстените на свои стойности са скрити. Изчистено: те са показани. Грешките пак се показват на картата, а всяко известие пак се пази в Съобщения. Това е настройка за този браузър, не за проекта.';
$ec_lang['lpn_settings_theme']='Тема';
$ec_lang['lpn_settings_theme_tip']='Изберете светли или тъмни цветове за страницата. Системна следва настройката на вашето устройство. Чертежът на картата изглежда еднакво във всяка тема. Това е настройка за този браузър, не за проекта.';
$ec_lang['lpn_theme_system']='Системна';
$ec_lang['lpn_theme_light']='Светла';
$ec_lang['lpn_theme_dark']='Тъмна';
$ec_lang['lpn_settings_id_prefixes']='Представки на ID';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Стойности при създаване';
$ec_lang['lpn_settings_defaults_note']='Използва се за елементи, които създавате оттук нататък. Съществуващите елементи не се променят.';
$ec_lang['lpn_settings_push_note']='Прилагат се само свойствата, чиито етикети се показват в момента.';
$ec_lang['lpn_settings_push_btn']='Приложи тези стойности за нови елементи към всеки съществуващ елемент';
$ec_lang['lpn_push_confirm']='Да се заменят ли тези свойства на всеки съществуващ елемент със стойностите, зададени сега за нови елементи? Въведените стойности ще бъдат презаписани. Това може да се отмени.';
$ec_lang['lpn_push_properties']='Свойства:';
$ec_lang['lpn_push_assets']='Възли и тръби:';
$ec_lang['lpn_push_none_displayed']='В момента никоя начална стойност не се показва като етикет, затова няма какво да се приложи. Включете етикетите за желаните свойства в панела Етикети и опитайте отново.';
$ec_lang['lpn_push_nothing']='Никой съществуващ елемент няма нито едно от прилаганите свойства.';
$ec_lang['lpn_push_no_change']='Всеки елемент вече има тези стойности, затова нищо няма да се промени.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Свои свойства';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Определени от потребителя свойства. Съхраняват се с проекта и сценариите като всички други свойства.';
$ec_lang['lpn_cp_design']='Дизайн';
$ec_lang['lpn_cp_design_tip']='По един ред за всяко потребителско свойство, всеки от които се отваря, за да покаже: Ключ, Етикет, Отнася се за, Валидирай като, Разреши или ограничи, полето за символи, наименувано от този избор, Долна граница на дължината, Горна граница на дължината, Долна граница, Горна граница.';
$ec_lang['lpn_cp_add']='Добави потребителско свойство';
$ec_lang['lpn_cp_add_tip']='Добавя ред към таблицата за дизайн и го отваря за редактиране.';
$ec_lang['lpn_cp_remove_tip']='Премахва това свойство от таблицата за дизайн. Стойностите, вече въведени за елементите, се запазват във файла и се възстановяват, ако отново се дефинира свойство със същия ключ.';
$ec_lang['lpn_cp_none']='Все още не е проектирано потребителско свойство.';
$ec_lang['lpn_cp_unnamed']='Още не е именувано';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Ключ';
$ec_lang['lpn_cp_key_tip']='Ключ: Свойството се съхранява под това име. Интервали не са позволени, а представка се добавя вместо вас, за да не може вашият ключ никога да съвпадне с вграден.';
$ec_lang['lpn_cp_label']='Етикет';
$ec_lang['lpn_cp_label_tip']='Етикет: Показва се в кутията със свойства, в Търсене и в заглавието на колона от таблица.';
$ec_lang['lpn_cp_applies']='Отнася се за';
$ec_lang['lpn_cp_applies_tip']='Отнася се за: Списък, разделен със запетаи, от представки на идентификатори за обектите, които използват това свойство, например J,L,R.';
$ec_lang['lpn_cp_validate']='Валидирай като';
$ec_lang['lpn_cp_validate_tip']='Валидирай като: Форматът, който трябва да има валидната стойност. Правилата за регистър важат само за английската азбука. Изберете Не валидирай, за да се приема всяка стойност.';
$ec_lang['lpn_cp_restrict']='Ограничи тези символи';
$ec_lang['lpn_cp_restrict_tip']='Ограничи тези символи:';
$ec_lang['lpn_cp_allow_tip']='Разреши само тези символи:';
$ec_lang['lpn_cp_characters_tip']='„@“ означава произволна буква; „#“ означава произволна цифра, а „-“, „.“ и „,“ трябва да изброите отделно, ако са позволени; и всички интервали трябва да са между други символи.';
$ec_lang['lpn_cp_restrict_mode']='Разреши или ограничи';
$ec_lang['lpn_cp_restrict_mode_tip']='Разреши или ограничи: Дадените символи са или единствените, които стойност може да използва, или тези, които не може.';
$ec_lang['lpn_cp_restrict_allow']='Разреши само тези символи';
$ec_lang['lpn_cp_minlength']='Долна граница на дължината';
$ec_lang['lpn_cp_minlength_tip']='Долна граница на дължината: Всеки по-кратък запис се отбелязва. Използвайте я, за да откриете празните и непълните записи.';
$ec_lang['lpn_cp_length']='Горна граница на дължината';
$ec_lang['lpn_cp_length_tip']='Горна граница на дължината: Всеки по-дълъг запис се отбелязва.';
$ec_lang['lpn_cp_low']='Долна граница';
$ec_lang['lpn_cp_low_tip']='Долна граница: Това е най-малката стойност, която очаквате. Числата се сравняват като числа, а текстът — по азбучен ред.';
$ec_lang['lpn_cp_high']='Горна граница';
$ec_lang['lpn_cp_high_tip']='Горна граница: Това е най-голямата стойност, която очаквате. Числата се сравняват като числа, а текстът — по азбучен ред.';
$ec_lang['lpn_cp_val_none']='Не валидирай';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Число .';
$ec_lang['lpn_cp_val_number_comma']='Число ,';
$ec_lang['lpn_cp_val_integer']='Цяло число';
$ec_lang['lpn_cp_val_upper']='ГЛАВНИ БУКВИ';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Стойността се запазва точно както сте я въвели.';
$ec_lang['lpn_valwarn_diameter']='Диаметърът на тръба или вентил обикновено е между {min} и {max} {unit}. Проверете числото и мерната единица на диаметъра.';
$ec_lang['lpn_valwarn_hw']='Коефициентът C на Хейзън-Уилямс обикновено е между {min} и {max}. Число извън този диапазон често е грапавост, предназначена за друг метод за триене.';
$ec_lang['lpn_valwarn_manning']='Коефициентът n на Манинг обикновено е между {min} и {max}. Число извън този диапазон често е грапавост, предназначена за друг метод за триене.';
$ec_lang['lpn_valwarn_dw']='Грапавостта по Дарси-Вайсбах обикновено е повече от 0 и най-много {max} {unit}. По-голямо число често е C на Хейзън-Уилямс или n на Манинг.';
$ec_lang['lpn_valwarn_positive']='EPANET не приема нула или отрицателно число тук.';
$ec_lang['lpn_valwarn_negative']='EPANET не приема отрицателно число тук.';
$ec_lang['lpn_valwarn_tank_levels']='EPANET не приема тази цистерна. Най-ниската дълбочина на водата не трябва да надвишава дълбочината на водата, а дълбочината на водата не трябва да надвишава най-високата дълбочина на водата.';
$ec_lang['lpn_cp_bad_number']='Тази стойност не е число, каквото се изисква за това свойство.';
$ec_lang['lpn_cp_bad_integer']='Тази стойност не е цяло число, каквото се изисква за това свойство.';
$ec_lang['lpn_cp_bad_case']='Тази стойност не е в ГЛАВНИ БУКВИ, каквото се изисква за това свойство.';
$ec_lang['lpn_cp_bad_chars']='Тази стойност използва символ, който това свойство не позволява.';
$ec_lang['lpn_cp_bad_space']='Интервал е позволен само между други символи.';
$ec_lang['lpn_cp_bad_minlength']='Тази стойност е по-къса, отколкото позволява това свойство.';
$ec_lang['lpn_cp_bad_length']='Тази стойност е по-дълга, отколкото позволява това свойство.';
$ec_lang['lpn_cp_bad_low']='Тази стойност е под долната граница на това свойство.';
$ec_lang['lpn_cp_bad_high']='Тази стойност е над горната граница на това свойство.';
$ec_lang['lpn_cp_key_needed']='Дайте на това потребителско свойство ключ без интервали.';
$ec_lang['lpn_cp_key_taken']='Друго потребителско свойство вече използва този ключ.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Сценарий';
$ec_lang['lpn_scenario_base']='Базов';
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
$ec_lang['lpn_scenario_overrides']='Брой свои стойности';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Кехлибареният пръстен означава, че този елемент има своя стойност в сценария {name}.';
$ec_lang['lpn_scenario_mark_inh_tip']='Сивият прекъснат пръстен означава, че сценарият {name} наследява своя стойност за този елемент от родителския си сценарий или алтернатива.';
$ec_lang['lpn_scenario_overrides_tip']='Всяка своя стойност е отбелязана на картата с кехлибарен пръстен. Превключете към {base} или към друг родителски сценарий, за да видите чертежа без тях.';
$ec_lang['lpn_scenario_menu']='Сценарии';
$ec_lang['lpn_scenario_tip']='Наборът от стойности, който чертежът показва и страницата решава в момента. Щракнете, за да превключите сценарии, или да добавите, преименувате, или изтриете сценарий.';
$ec_lang['lpn_scenario_new']='Нов сценарий…';
$ec_lang['lpn_scenario_new_name']='Сценарий {n}';
$ec_lang['lpn_scenario_prompt_name']='Име за този сценарий';
$ec_lang['lpn_scenario_rename']='Преименуване на сценарий…';
$ec_lang['lpn_scenario_delete']='Изтриване на сценарий';
$ec_lang['lpn_scenario_delete_ask']='Да се изтрие ли сценарият {name}? Самият чертеж не се променя.';
$ec_lang['lpn_scenario_delete_goes']='Свои стойности ({n}) се изтриват заедно с него.';
$ec_lang['lpn_scenario_delete_stays']='Тези алтернативи, които използва, остават в проекта: {list}.';
$ec_lang['lpn_scenario_delete_has_children']='Сценарият {name} не може да се изтрие, защото има дъщерни: {list}. Първо ги изтрийте или ги преместете към друг родител.';
// Edited by TGH 2026-09-07
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Базов сценарий: {value}';
$ec_lang['lpn_scenario_deactivated']='В {scenario} {id} е изключен от мрежата. Остава в чертежа и в другите сценарии.';
$ec_lang['lpn_scenario_delete_in_base']='За да го премахнете от чертежа, изтрийте го в сценарий {base}.';
$ec_lang['lpn_scenario_only_deleted']='{id} е изтрит. Той е бил част само от {scenario}.';
$ec_lang['lpn_scenario_delete_blocked']='{id} не е изтрит, защото връзка {link} завършва в него, а тази връзка съществува и извън {scenario}. За да изтриете и двете, изтрийте ги в сценарий {base}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_basic']='Основен режим';
$ec_lang['lpn_scenario_basic_tip']='Отметнато: алтернативите са скрити и автоматични, всеки сценарий показва своите стойности като свои, а всички нови сценарии са дъщерни на Базовия сценарий; Сценарният мениджър и таблицата Сценарии не се показват. Изчистено: Сценарният мениджър и таблицата Сценарии се показват, а алтернативите могат да се споделят между сценарии. Сценарният мениджър е изключен, когато Основен режим е включен. Основният режим е изключен, когато проектът има връзки между сценарии и алтернативи, които Основният режим не може да покаже.';
$ec_lang['lpn_scenario_basic_misfit']='Този проект има връзки между сценарии и алтернативи, които не са съвместими с Основния режим на сценариите, затова Основният режим е изключен.';
$ec_lang['lpn_scenario_basic_misfit_base']='Базовият сценарий използва алтернатива, различна от Базовата.';
$ec_lang['lpn_scenario_copy']='Копиране на сценарий';
$ec_lang['lpn_scenario_copy_tip']='Копира отворения сценарий и своите му стойности и отваря копието.';
$ec_lang['lpn_scenario_copy_off']='Копиране на сценарий работи в Основен режим. Когато Основният режим е изключен, добавете сценарий и изберете алтернативите му в таблицата Сценарии.';
$ec_lang['lpn_sm_title']='Сценариен мениджър';
$ec_lang['lpn_sm_menu']='Сценариен мениджър…';
$ec_lang['lpn_sm_basic_on']='Сценарният мениджър е изключен, когато Основен режим е включен.';
$ec_lang['lpn_pane_tab_scenarios']='Сценарии';
$ec_lang['lpn_sm_col_parent']='Родител';
$ec_lang['lpn_sm_add_child']='Добавяне на дъщерен';
$ec_lang['lpn_sm_add_base']='Добавяне на базов';
$ec_lang['lpn_sm_add_base_tip']='Добавя още един Базов сценарий. Започва като копие на Базовия, със свои алтернативи, а по-късни редакции на Базовия не го променят.';
$ec_lang['lpn_sm_add_base_alt_tip']='Добавя още една Базова алтернатива. Започва като копие на стойностите на Базовия в тази категория, а по-късни редакции на Базовия не я променят.';
$ec_lang['lpn_sm_delete']='Изтрива избрания елемент. Използван елемент не се изтрива.';
$ec_lang['lpn_sm_base_kept']='Базовият на дървото не се изтрива. Друг Базов, добавен с Добавяне на базов, се изтрива, когато нищо не го използва.';
$ec_lang['lpn_sm_rename']='Преименуване';
$ec_lang['lpn_sm_rename_alts_ask']='Да се преименуват ли алтернативите с еднакво име?';
$ec_lang['lpn_sm_make_current']='Направи текущ';
// Tips on greyed Scenario manager commands, saying why they are greyed (Perry, 2026-10-11).
$ec_lang['lpn_sm_current_already']='Този сценарий вече е текущият сценарий.';
$ec_lang['lpn_sm_none_selected']='Първо изберете елемент в дървото.';
$ec_lang['lpn_sm_base_named']='Базовият на дървото не се преименува.';
$ec_lang['lpn_sm_merge_up']='Сливане нагоре';
$ec_lang['lpn_sm_merge_up_tip']='Премества свои стойности на избраната алтернатива в алтернатива над нея в дървото. След това избраната алтернатива наследява тези стойности.';
$ec_lang['lpn_sm_merge_up_root']='Базова алтернатива няма нищо над себе си, в което да се слее.';
$ec_lang['lpn_sm_merge_none']='Алтернативата {name} няма свои стойности за сливане.';
$ec_lang['lpn_sm_merge_pick']='В коя алтернатива да се слеят свои стойности на {name}? Родителят ѝ е изброен първи.';
$ec_lang['lpn_sm_merge_ask']='Да се преместят ли свои стойности ({n}) на {name} нагоре в {target}? След това тя ги наследява, вместо да ги заменя. Можете да отмените това.';
$ec_lang['lpn_sm_merge_skipped']='{between} също заменя тези стойности. Пропуска се и не се променя, така че {name} ще ги чете от {between}, не от {target}:';
$ec_lang['lpn_sm_merge_line']='{asset}: {property}';
$ec_lang['lpn_sm_copy_up']='Копиране нагоре';
$ec_lang['lpn_sm_copy_up_tip']='Копира свои стойности на избраната алтернатива в алтернатива над нея в дървото. Избраната алтернатива запазва своите.';
$ec_lang['lpn_sm_copy_up_root']='Базова алтернатива няма нищо над себе си, в което да се копира.';
$ec_lang['lpn_sm_copy_none']='Алтернативата {name} няма свои стойности за копиране.';
$ec_lang['lpn_sm_copy_pick']='В коя алтернатива да се копират свои стойности на {name}? Родителят ѝ е изброен първи.';
$ec_lang['lpn_sm_copy_ask']='Да се копират ли свои стойности ({n}) на {name} нагоре в {target}? {name} ги запазва като свои стойности. Можете да отмените това.';
$ec_lang['lpn_sm_copy_skipped']='{between} също заменя тези стойности. Пропуска се и не се променя, така че запазва собствените си стойности за тях:';
$ec_lang['lpn_sm_list_overrides']='Собствени стойности…';
$ec_lang['lpn_sm_list_overrides_tip']='Изброява свои стойности на сценария по категории, всяка с наследената стойност, която заменя, и позволява да се изчисти която и да е от тях.';
$ec_lang['lpn_sm_list_overrides_none']='Този сценарий няма свои стойности.';
$ec_lang['lpn_ovl_title']='Собствени стойности: {name}';
$ec_lang['lpn_ovl_note']='Това са стойностите, които този сценарий задава сам в алтернативите, които използва, всяка със стойността, която заменя. Наследените стойности не са нито изброени, нито преброени. Изчистете своя стойност, за да възстановите наследената; Отмяна я връща. Изберете ID, за да отидете до елемента на картата.';
$ec_lang['lpn_ovl_clear_selected']='Изчисти избраните свои стойности';
$ec_lang['lpn_ovl_clear_all']='Изчисти всички свои стойности';
$ec_lang['lpn_ovl_clear_all_ask']='Да се изчистят ли всички свои стойности ({n}) на {name}? Всяка стойност се връща към наследената. Отмяна го връща.';
$ec_lang['lpn_ovl_pick_tip']='Избира тази своя стойност за бутона Изчисти избраните свои стойности.';
$ec_lang['lpn_ovl_bubble_off']='Не е на картата';
$ec_lang['lpn_ovl_bubble_moved']='{quantity}, преместена или с променен размер';
$ec_lang['lpn_ovl_group']='{category}: {alternative}';
$ec_lang['lpn_ovl_col_override']='Собствена стойност';
$ec_lang['lpn_ovl_col_inherited']='Наследена стойност';
$ec_lang['lpn_ovl_col_inherited_tip']='Стойността, която този сценарий чете без своята: стойността на родителя на алтернативата или Базовата стойност.';
$ec_lang['lpn_ovl_same']='(същата)';
$ec_lang['lpn_ovl_same_tip']='Равна на наследената стойност. Тя пак е своя стойност и се брои.';
$ec_lang['lpn_sm_help']='Как работят сценариите и алтернативите:\n\nВ Основен режим алтернативите са скрити и автоматични, а всички нови сценарии са дъщерни на Базовия сценарий.\n\nКогато Основният режим е изключен, е налично сложно дърво на наследяване и алтернативите могат да се споделят между сценарии. Но поведението по подразбиране на редакциите, когато е нужна нова връзка с алтернатива (при липса на активно управление от потребителя), е да се създаде алтернатива с името на текущия сценарий, която дава на всеки сценарий собствен набор от алтернативи.\n\nСвойствата и настройките принадлежат на категории алтернативи, които се показват като колони на таблицата на сценариите и алтернативите и като опции за управление в Сценарния мениджър.\n\nСвоите стойности се създават в сценариите, но всъщност принадлежат на съответните алтернативи, свързани със сценария; така сценарият е като прозорец към своите алтернативи. Връзките на алтернативите със сценариите се управляват в десния панел на Сценарния мениджър или в таблицата Сценарии в долния панел. Създаването на нов сценарий не създава алтернативи; новият сценарий използва алтернативите на родителя си, докато не бъдат създадени свои стойности, които изискват нови алтернативи. Когато в сценарий се създават свои стойности, те се съхраняват в съответната алтернатива за сценария; ако сценарият няма такава алтернатива, се създава нова с името на сценария.\n\nПример: Създавате сценарий „Figure: Node and link IDs“ и редактирате текст, който да гласи „Node and Link IDs“. Когато създавате сценария, не се създават алтернативи. Но в момента, в който запишете текста, се създава текстова алтернатива „Figure: Node and link IDs“ със своята стойност за текста. В Основен режим виждате това просто като своя стойност в самия сценарий.\n\nКопиране на свойствата копира само свои стойности. В сценарий, различен от Базовия, копира само своите стойности, които елементът има в този сценарий.\n\nКак се управляват сценариите:\n\n- Изберете Сценарии или категория алтернативи в списъка най-горе, за да покажете нейното дърво.\n\n- Създайте дъщерен на избрания елемент с Добавяне на дъщерен. Добавяне на базов добавя още един Базов, който започва като копие на Базовия такъв, какъвто е сега; по-късни редакции на Базовия не го променят. Новият дъщерен е наименуван по родителя си; въведете име, за да го преименувате. Копиране копира избраната алтернатива. Сливане нагоре премества свои стойности на избраната алтернатива в алтернатива над нея, избрана по име, и избраната алтернатива след това ги наследява; първо назовава всяка стойност, която алтернатива, която прескача, също заменя и която не се променя. За да копирате сценарий, използвайте Копиране на сценарий в менюто Сценарии, в Основен режим; то копира свои стойности на сценария, заедно с алтернативите, които ги държат. Добавяне на базов и Копиране на сценарий създават по алтернативи: Добавяне на базов създава Базова алтернатива за новия Базов във всяка категория, която държи стойности, а Копиране на сценарий създава нова алтернатива, наименувана като копието, за всяка алтернатива, която държи своите стойности на сценария.\n\n- Влачете елемент върху друг, за да го направите дъщерен на този елемент. Сценарий, преместен при нов родител, наследява от него всичко, което не е заместил; заместеното не се променя. Влачете елемент между два елемента, за да ги пренаредите.\n\n- Щракнете върху елемент, за да го изберете. Натиснете F2 или изберете Преименуване, за да преименувате избрания елемент. Преименуването на сценарий пита дали да се преименуват алтернативите, които носят името му; в Основен режим те се преименуват заедно с него, без да питат. Щракнете двукратно върху сценарий или натиснете Enter, за да го направите текущ. Щракнете върху стрелката до елемент или натиснете Наляво или Надясно, за да го свиете или разгънете. Щракнете с десния бутон върху елемент за същите команди като на бутоните.\n\n- Натиснете Delete или щракнете върху бутона минус, за да изтриете избрания елемент. Използван елемент не се изтрива, а съобщението назовава какво го използва. Изтриването на сценарий при изключен Основен режим запазва алтернативите, които използва. Изтриването на сценарий при включен Основен режим изтрива и всяка негова алтернатива, която никой друг сценарий не използва.\n\n- За да накарате сценарий да използва друга алтернатива, включително Базовата, изберете я в реда на сценария в десния панел на Сценарния мениджър или в таблицата Сценарии. Своя стойност, направена в споделена алтернатива, променя всеки сценарий, който я използва.';
$ec_lang['lpn_sm_delete_alt_ask']='Да се изтрие ли алтернативата {name}?';
$ec_lang['lpn_sm_in_use']='{item}\nне може да се изтрие, докато се използва от\n{list}';
$ec_lang['lpn_sm_alt_delete_has_children']='Алтернативата {name} не може да се изтрие, защото има дъщерни: {list}. Първо ги изтрийте или ги преместете към друг родител.';
$ec_lang['lpn_sm_item_scenario']='Сценарий {name}';
$ec_lang['lpn_sm_item_alternative']='Алтернатива {name}';
$ec_lang['lpn_sm_name_taken']='Името {name} вече се използва в това дърво.';
$ec_lang['lpn_sm_cycle']='{name} не може да се премести под един от собствените си дъщерни.';
$ec_lang['lpn_sm_used_by']='Използван от сценарии: {n}';
$ec_lang['lpn_sm_used_by_tip']='Използван от: {list}';
$ec_lang['lpn_sm_used_by_none']='Не се използва от никой сценарий';
$ec_lang['lpn_sm_tree_all']='Всички';
$ec_lang['lpn_sm_tree_unused']='Всички неизползвани';
$ec_lang['lpn_sm_unused_none']='Няма';
$ec_lang['lpn_sm_all_row_tip']='Щракнете двукратно, за да го отворите в дървото на категорията му.';
$ec_lang['lpn_sm_compare_tip']='Включи в Сценарии: сравнение';
$ec_lang['lpn_sm_inherited']='наследена';
$ec_lang['lpn_sm_shared_note']='Споделена с: {list}';
$ec_lang['lpn_scncmp_none_checked']='Няма сценарий, отметнат за сравнение. Отметнете сценарии в Сценарния мениджър.';
$ec_lang['lpn_time_scn_overrides']='Свои стойности на сценария:';
$ec_lang['lpn_settings_table_major']='Основно заглавие';
$ec_lang['lpn_settings_table_minor']='Подзаглавие';
$ec_lang['lpn_settings_table_category']='Категория';
// The Settings table's third heading level, between Minor heading and Setting: the label field, coloured
// field, asset or custom property a group of settings belongs to (Tom, 2026-10-07: "We could call it
// 'Owner'.").
$ec_lang['lpn_settings_table_owner']='Собственик';
$ec_lang['lpn_settings_table_setting']='Настройка';
$ec_lang['lpn_settings_table_yes']='Да';
$ec_lang['lpn_settings_table_no']='Не';
$ec_lang['lpn_settings_row_of']='{setting}, {member}';
$ec_lang['lpn_settings_row_labels_field']='{labels}: {field}';
$ec_lang['lpn_settings_row_labels_part']='{labels}: {field}, {part}';
$ec_lang['lpn_settings_row_labels_customer']='Етикети на абонатите';
$ec_lang['lpn_settings_row_label_before']='Текст преди';
$ec_lang['lpn_settings_row_label_after']='Текст след';
// A label field's settings, named in the Setting column with the field itself in the Owner column
// (Tom, 2026-10-07: "Symbology.Node labels.ID.Is Active", "Show order", "Drop order"). Whether the
// value appears on the label at all; where it sits on the label (1 first); which value is given up
// first when labels crowd (1 first).
$ec_lang['lpn_settings_row_label_on']='Активен';
$ec_lang['lpn_settings_row_label_show']='Ред на показване';
$ec_lang['lpn_settings_row_label_drop']='Ред на отпадане';
// The Setting column of an ID prefix row; the asset it applies to is in the Owner column.
$ec_lang['lpn_settings_row_id_prefix']='Представка на ID';
$ec_lang['lpn_settings_row_symbol_cap_multiple']='Най-голям символ, като кратно на типична дължина на тръба';
$ec_lang['lpn_settings_row_symbol_cap_percentile']='Типична дължина на тръба, като персентил на всички дължини на тръби';
$ec_lang['lpn_settings_row_contour_labels']='Етикети на изолиниите';
$ec_lang['lpn_settings_row_check_freq']='Честота на проверка на състоянието';
$ec_lang['lpn_settings_row_max_check']='Най-много проверки на състоянието';
$ec_lang['lpn_settings_row_status_report']='Отчет за състоянието';
$ec_lang['lpn_settings_row_pda_src']='Опции за зависимо от налягането изчисление, зададени във файла';
$ec_lang['lpn_settings_row_quality_option']='Опция за качество, както я задава файлът';
$ec_lang['lpn_settings_row_tolerance']='Точност (по-стари проекти)';
$ec_lang['lpn_settings_row_emitter_exponent_old']='Показател на разпръсквателя (по-стари проекти)';
$ec_lang['lpn_settings_row_elev_source_old']='Източник на котите (по-стари проекти)';
$ec_lang['lpn_settings_row_basemap']='Основна карта';
$ec_lang['lpn_settings_row_basemap_last']='Основна карта, към която да се върне';
$ec_lang['lpn_settings_row_customer_max_width']='Показвай етикетите на абонатите при мащаб на картата с тази ширина или по-малка';
$ec_lang['lpn_settings_row_quality_step']='Стъпка във времето за качеството';
$ec_lang['lpn_settings_row_view']='Изглед на картата (център и мащаб)';
$ec_lang['lpn_settings_row_bubbles']='Графики на времеви редове на картата';
$ec_lang['lpn_settings_row_contour_fill']='Запълване на изолиниите';
$ec_lang['lpn_settings_row_contour_opacity']='Непрозрачност на запълването на изолиниите';
$ec_lang['lpn_settings_row_contour_interval']='Интервал на изолиниите';
$ec_lang['lpn_settings_row_contour_buffer']='Обхват на изолиниите';
$ec_lang['lpn_settings_row_contour_terrain']='Терен между възлите за изолиниите от Mapbox DEM';
$ec_lang['lpn_settings_row_new_asset']='Нови елементи: {setting}';
$ec_lang['lpn_settings_row_default']='{value} (по подразбиране)';
$ec_lang['lpn_settings_row_view_value']='Център {x}, {y}; мащаб {s}';
$ec_lang['lpn_settings_held_in']='Своя стойност в {scenario}.';
$ec_lang['lpn_settings_held_base']='{base}: {value}';
$ec_lang['lpn_settings_view_center']='Център на картата';
$ec_lang['lpn_settings_view_scale']='Мащаб на картата';
$ec_lang['lpn_settings_view_scale_tip']='Мащабът в центъра на картата, във вида 1:N. Въведете 1:2000 или просто 2000, за да увеличите до този мащаб.';
$ec_lang['lpn_settings_view_top_left']='Горен ляв ъгъл';
$ec_lang['lpn_settings_view_bottom_right']='Долен десен ъгъл';
$ec_lang['lpn_settings_view_save']='Запиши този изглед в този сценарий';
$ec_lang['lpn_settings_view_save_tip']='Съхранява този център и мащаб на картата в отворения сценарий, така че отварянето на този сценарий премества картата тук. Преместването на картата след това не променя нищо, докато не натиснете това отново. Изчистете своята стойност, за да следвате отново изгледа на {base}.';
$ec_lang['lpn_settings_row_basemap_osm']='Улична карта';
$ec_lang['lpn_settings_row_basemap_satellite']='Сателитни изображения';
$ec_lang['lpn_settings_row_basemap_topo']='Топографска карта';
$ec_lang['lpn_settings_units_one_project']='Единиците са еднакви във всеки сценарий.';
$ec_lang['lpn_settings_restore_base_only']='Превключете към Базовия, за да възстановите настройките по подразбиране.';
$ec_lang['lpn_alt_cat_physical']='Физически';
$ec_lang['lpn_alt_cat_demand']='Потребност';
$ec_lang['lpn_alt_cat_topology']='Активна топология';
$ec_lang['lpn_alt_cat_topology_tip']='Активиране на елементи';
$ec_lang['lpn_alt_cat_initial']='Начални настройки';
$ec_lang['lpn_alt_cat_constituent']='Съставка';
$ec_lang['lpn_alt_cat_fireflow']='Противопожарно водно количество';
$ec_lang['lpn_alt_cat_energy']='Цена на енергията';
$ec_lang['lpn_alt_cat_text']='Текст';
$ec_lang['lpn_alt_cat_presentation']='Представяне';
// Edited by TGH 2026-09-07
// Task 721: the scenarios every new project starts with. Keep the leading number: the list sorts
// by name, and the numbers hold Tom's order in every language.
$ec_lang['lpn_scenario_preset_flow_static']='1. Изпитване на водното количество: статично';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Калибриране по изпитване на водното количество за проектна мрежа при нулево водно количество. В този сценарий задайте потреблението във всички възли на 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Изпитване на водното количество: средно';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Калибриране по изпитване на водното количество за проектна мрежа при първото отчетено водно количество. В този сценарий задайте потреблението във възела, от който тече вода, на първото измерено водно количество, а във всички останали възли на 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Изпитване на водното количество: максимално';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Калибриране по изпитване на водното количество за проектна мрежа при максималното отчетено водно количество. В този сценарий задайте потреблението във възела, от който тече вода, на максималното измерено водно количество, а във всички останали възли на 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Средно денонощие';
$ec_lang['lpn_scenario_preset_average_day_tip']='Множител на потреблението 1: всяко потребление такова, каквото е въведено, което се приема за потребление в средно денонощие.';
$ec_lang['lpn_scenario_preset_max_day']='5. Максимално денонощие';
$ec_lang['lpn_scenario_preset_mult_tip']='Коефициент на потребност {mult} пъти средния ден, примерна стойност. Повечето системи са между {lo} и {hi} (National Research Council, 2006). Задайте стойността за моделираната система в Настройки, Изчисление, Хидравлика, Множител на потребността.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Пиков час';
$ec_lang['lpn_delete_drops_overrides']='Изтриването на този елемент изтрива и неговите стойности в сценариите ({n}). Продължавате ли?';
$ec_lang['lpn_push_base_only']='Това действие променя самия чертеж, затова може да се извърши само в {base}. Превключете към {base} и опитайте отново.';
$ec_lang['lpn_field_active']='Активен ли е?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Изчистете тази отметка, за да оставите елемента на чертежа, но извън мрежата: той се показва в сиво и решаващият модул го пренебрегва. В сценарий по този начин се включва и изключва тръба.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Степенен показател на дюзата';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='Показателят в уравнението на EPANET за дюзи (емитери) при пръскачки и течове: водно количество = коефициент × налягане, повдигнато на този показател. Влияе на резултатите само във възли с коефициент на дюза.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Прочети DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Чете котата от DEM за този възел и я показва по-долу. Нищо в полето Кота не се променя. Хоризонталната разделителна способност на DEM е около 30 m за по-голямата част от Земята и по-фина, където има по-добри данни.';
$ec_lang['lpn_elev_dem_use']='Използвай DEM';
$ec_lang['lpn_elev_dem_use_tip']='Поставя котата от DEM за този възел в полето Кота по-горе, замествайки съществуващата стойност. Първо чете DEM, ако все още не е прочетен. Една отмяна я връща обратно.';
$ec_lang['lpn_elev_dem_none']='DEM няма кота за този възел.';
$ec_lang['lpn_elev_dem_said']='Кота по Mapbox DEM: {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Източник на кота';
$ec_lang['lpn_settings_elev_source_tip']='Точност на Mapbox DEM през 2026 г., първо хоризонтална, после вертикална: 1–10 m и под 1 m в САЩ, 2–10 m и 1–3 m в Европа и Япония, 30 m и 10–16 m в световен мащаб и 90 m и над 16 m при полюсите.';
$ec_lang['lpn_settings_elev_source_typed']='По-горе';
$ec_lang['lpn_settings_elev_source_dem']='Mapbox DEM';
$ec_lang['lpn_settings_accuracy']='Точност';
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
$ec_lang['lpn_settings_default_is']='Стойността по подразбиране е {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Граница на сходимост, която решаващият модул трябва да достигне, преди да спре, измерена като общата промяна на водното количество от едно изпитание до следващото, разделена на общото водно количество във връзките. По-малко число е по-точно и отнема повече време.';
$ec_lang['lpn_settings_specific_gravity']='Специфично тегло';
$ec_lang['lpn_settings_viscosity']='Относителен вискозитет';
// **THE PASHTO COLLISION THIS ANSWERS IS REAL AND IS INSIDE PASHTO** (sprint 584-wave1). ps renders
// this key with the word غلظت, which carries BOTH viscosity/thickness AND concentration -- so it
// collided with the word the same sprint used for lpn_result_concentration, on the same screen.
// Tom approved a synonym on 2026-09-06. **HIS FIRST WORDING WAS 'Relative rate of diffusion' and it
// is NOT what shipped**: that is diffusivity, and this key is viscosity. He was given a friction
// entry that quoted a translator's mistaken description of the key without anyone checking it
// against this file -- so the note below says what the number IS and what it is NOT, because two
// separate readers have now reached for a transport coefficient on a fluid property.
$ec_lang['lpn_settings_viscosity_tip']='Вискозитетът на течността спрямо вода при 20 градуса по Целзий. Променя отговора само при метода на Дарси-Вайсбах.';
$ec_lang['lpn_settings_trials']='Максимален брой изпитания';
$ec_lang['lpn_settings_trials_tip']='Максимален брой изпитания, преди решаващият модул да спре при мрежа, която не се сходи.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Ако не се сходи';
$ec_lang['lpn_settings_unbalanced_tip']='Действие за мрежа, която е изчерпала изпитанията си и все още не се е сходила. Позволяването на допълнителни изпитания често води до сходимост. Спирането отчита последното изпитание такова, каквото е, което не е решение.';
$ec_lang['lpn_settings_unbalanced_continue']='Позволи допълнителни изпитания';
$ec_lang['lpn_settings_unbalanced_stop']='Спри и отчети последното изпитание';
$ec_lang['lpn_settings_unbalanced_trials']='Допълнителни изпитания преди отчитане';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Брой допълнителни изпитания, позволени след изчерпване на горния максимум, преди да се отчете последното изпитание.';
$ec_lang['lpn_settings_head_error']='Граница на грешката в напора';
$ec_lang['lpn_settings_head_error_tip']='Допълнителна проверка, която решаващият модул трябва да премине, преди да спре: най-голямата остатъчна грешка в напора в която и да е тръба. Нула означава да не се прилага тази проверка. Само решаващият модул на EPANET чете това поле.';
$ec_lang['lpn_settings_flow_change']='Граница на промяната на водното количество';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Допълнителна проверка, която решаващият модул трябва да премине, преди да спре: най-голямата промяна на водното количество в която и да е тръба от едно изпитание до следващото. Нула означава да не се прилага тази проверка. Само решаващият модул на EPANET чете това поле.';
$ec_lang['lpn_settings_damp_limit']='Затихването започва при';
$ec_lang['lpn_settings_damp_limit_tip']='Точността, при която решаващият модул започва да прави по-малки стъпки, което може да помогне на осцилираща мрежа да се сходи. Нула означава, че решаващият модул никога не затихва. Само решаващият модул на EPANET чете това поле.';
$ec_lang['lpn_settings_option_unset']='Не е зададено';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Единствен коефициент, приложен едновременно към всяка потребност в мрежата. Всеки сценарий може да има отделна стойност, така че средно денонощие, максимално денонощие или пиков час могат да се създадат само чрез промяна на тази настройка.';
$ec_lang['lpn_settings_engine_native']='Използвай вградения решаващ модул, когато е възможно';
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
$ec_lang['lpn_settings_engine_native_tip']='Включете това, за да използвате вградения решаващ модул, където е възможно. В противен случай винаги се използва решаващият модул на EPANET от американската агенция EPA. Вграденият решаващ модул не се използва за изчисления за период от време, нито за вентили-прекъсвачи на налягането и вентили с общо предназначение (PBV, GPV). При първото използване на решаващия модул на EPANET се изтеглят около 650 KB, които след това остават на това устройство. Където тръба има местна (локална) загуба, двата решаващи модула се разминават в последните цифри: EPANET използва закръглена стойност на земното ускорение, затова местните му загуби излизат съвсем малко по-ниски от точната форма.';
$ec_lang['lpn_engine_loading']='Зареждане на решаващия модул на EPANET…';
$ec_lang['lpn_engine_failed']='Решаващият модул на EPANET не можа да бъде зареден. Вместо него се показва вграденият решаващ модул.';
$ec_lang['lpn_engine_failed_why']='{reason} Вместо това се показва вграденият решаващ алгоритъм.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_unit_unknown']='Този чертеж посочва единица, която тази страница не поддържа: {unit}. Всички стойности са запазени и показани точно както са внесени и нищо не е променено. Нищо не може да се изчисли, докато единицата не бъде поддържана, защото коефициентът ѝ за преобразуване е неизвестен.';
$ec_lang['lpn_engine_manning_note']='Забележка: при грапавост по Манинг EPANET закръгля константата в уравнението на Манинг, затова загубата на напор излиза около 0,6% по-ниска от точната форма.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='Решаващият модул на EPANET отхвърли тази мрежа, затова изчислението не започна.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='Съобщение на решаващия модул на EPANET: {message}';
$ec_lang['lpn_engine_refused_fallback']='Числата на екрана вместо това идват от вградения решаващ алгоритъм.';
// A run EPANET started and could not finish, for example when a tank empties and the junctions it
// fed have no other source (Error 110). {time} is the run time it stopped at, H:MM.
$ec_lang['lpn_time_run_stopped']='Изчислението на EPANET спря при {time}, затова няма резултати. Отчетът от изчислението показва защо.';
$ec_lang['lpn_time_stat_stopped']='{statistic} не се показва: изчислението спря преди края на периода.';
$ec_lang['lpn_time_stopped_no_quality']='Не бяха изчислени резултати за качеството на водата, защото анализът на качеството започва след края на хидравличното изчисление.';
$ec_lang['lpn_energy_stopped']='Изчислението на EPANET спря преди края на периода, затова не бяха изчислени резултати за енергията на помпите.';
$ec_lang['lpn_time_run_stopped_kept']='Изчислението на EPANET спря при {time}. Резултатите стигат до {solved}, последния изчислен момент, и след него не се показват. Отчетът от изчислението показва защо.';
// Why a stopped run stopped, read from EPANET's own run report (R-402). {link} is the link EPANET
// had just closed, {tank} the tank at one end of it, {nodes} the ids of the nodes EPANET then could
// not solve for, comma-separated. Follows lpn_time_run_stopped or lpn_time_run_stopped_kept.
$ec_lang['lpn_time_run_cut_off']='EPANET е затворил {link} и след това не е могъл да изчисли за {nodes}.';
$ec_lang['lpn_time_run_cut_off_full']='Цистерна {tank} беше пълна, затова EPANET е затворил {link}, за да не влиза вода в нея, и след това не е могъл да изчисли за {nodes}. Това може да се случи, когато от пълна цистерна не излиза вода, например когато всяка потребност е нула. Потребност малко над нула или ниво на цистерната малко под максимума го избягва.';
$ec_lang['lpn_time_run_cut_off_empty']='Цистерна {tank} беше празна, затова EPANET е затворил {link}, за да не се източва повече, и след това не е могъл да изчисли за {nodes}.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Числата на екрана вместо това идват от вградения решаващ алгоритъм. Той изчислява по един момент наведнъж, затова това е мрежата само в {time}, като всяка цистерна все още стои на началното си ниво.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Тези правила посочват елемент, който вече не е в този проект, затова бяха пропуснати: {ids}';
$ec_lang['lpn_control_unreadable_note']='Тези правила не можаха да бъдат прочетени, затова бяха пропуснати: {ids}';
$ec_lang['lpn_control_inactive_note']='Тези управления се отнасят към елемент, който е неактивен в този сценарий, затова се игнорират при изчислението му: {ids}';
$ec_lang['lpn_rule_inactive_note']='Тези правила се отнасят към елемент, който е неактивен в този сценарий, затова се игнорират при изчислението му: {ids}';
$ec_lang['lpn_rule_dangling_note']='Тези правила сочат обект, който вече не е в проекта, затова бяха пренебрегнати в това изчисление: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Тези правила не можаха да бъдат прочетени, затова бяха пренебрегнати в това изчисление: {ids}';
$ec_lang['lpn_settings_text_size']='Размер на текста (пиксели)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Размер на символите (пиксели)';
$ec_lang['lpn_settings_link_width']='Ширина на линията на тръбата (пиксели)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Стрелки за посоката на водното количество';
$ec_lang['lpn_settings_show_arrows_tip']='Чертае стрелка на всяка тръба, показваща в коя посока тече водата. Стрелките се появяват след изчисление, а изключването им не променя резултатите.';
$ec_lang['lpn_settings_align_labels']='Подравни етикетите на тръбите с тръбите';
$ec_lang['lpn_settings_readability_bias']='Обръщай етикета наопаки, когато е наклонен наляво от вертикалата с повече от толкова градуси';
$ec_lang['lpn_settings_readability_bias_tip']='Обръща етикета, за да остане изправен, когато е наклонен наляво от вертикалата с повече от посочения брой градуси.';
$ec_lang['lpn_settings_mask_labels']='Плътен фон зад етикетите';
$ec_lang['lpn_settings_text_halo']='Ширина на ореола на текста (процент от размера на текста)';
$ec_lang['lpn_settings_text_halo_tip']='Ширина на плътния контур зад текста на картата, като процент от размера на текста. Прилага се, когато е включен Плътен фон зад етикетите.';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Прилепвай водещите линии към зададени ъгли';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Показвай етикети при мащаб до тази ширина на картата или по-малко';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Етикетите се чертаят само докато изгледът на картата е с тази ширина или по-тесен. Оставете полето празно, за да ги чертаете при всеки мащаб. Въведете 0, за да не се чертае етикет никога, при никакъв мащаб.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Показвай винаги';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap_sentence']='Не позволявай на възлите да се мащабират по-големи от {n} пъти дължината на {p} тръбата на процентила';
$ec_lang['lpn_settings_symbol_cap_tip']='Възлите престават да запазват размера си на екрана, щом диаметърът им на картата би бил толкова пъти дължината на тръбата на този процентил от всички дължини на тръби в мрежата. След тази точка на картата възлите, тръбите и другите символи се смаляват на екрана при намаляване на мащаба. Резервоарите и цистерните са изключение и запазват размера си на екрана при всеки мащаб.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Непрозрачност на символите (0 до 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Непрозрачност на фоновото изображение (0 до 1)';
// Task 617: a display-time filter on the street or satellite tiles only; the drawing and the credit are untouched.
$ec_lang['lpn_settings_basemap_style']='Стил на основната карта';
$ec_lang['lpn_basemap_style_normal']='Нормален';
$ec_lang['lpn_basemap_style_muted']='Приглушен';
$ec_lang['lpn_basemap_style_faded']='Избледнял';
$ec_lang['lpn_basemap_style_grayscale']='Сивогама';
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
$ec_lang['lpn_settings_legend_position']='Позиция на легендата за етикетите';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Няма';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Изключено';
$ec_lang['lpn_settings_legend_top_left']='Горе вляво';
$ec_lang['lpn_settings_legend_top_right']='Горе вдясно';
$ec_lang['lpn_settings_legend_middle_left']='В средата вляво';
$ec_lang['lpn_settings_legend_middle_right']='В средата вдясно';
$ec_lang['lpn_settings_legend_bottom_left']='Долу вляво';
$ec_lang['lpn_settings_legend_bottom_right']='Долу вдясно';
$ec_lang['lpn_settings_color_node_field']='Цвят на възлите';
$ec_lang['lpn_settings_color_link_field']='Цвят на тръбите';
$ec_lang['lpn_settings_color_ramp']='Цветова схема';
$ec_lang['lpn_settings_color_credits']='Благодарности';
$ec_lang['lpn_color_ramp_epanet']='От синьо до червено (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='От лилаво до жълто (по-лесно се разграничава един цвят от друг)';
$ec_lang['lpn_color_ramp_gray']='От светло до тъмносиво';
$ec_lang['lpn_settings_color_reverse']='Обърни реда на цветовете';
$ec_lang['lpn_color_none']='Без цвят';
$ec_lang['lpn_settings_color_key_position']='Позиция на цветовата легенда';
$ec_lang['lpn_settings_color_breaks']='Граници на цветовите диапазони';
$ec_lang['lpn_settings_color_equal_intervals']='Равни интервали';
$ec_lang['lpn_settings_color_equal_counts']='Равен брой';
$ec_lang['lpn_settings_color_no_values']='Все още няма стойности, от които да се работи. Първо решете мрежата.';
$ec_lang['lpn_confirm_restore_defaults']='Да се нулират ли всички настройки (представки на ID, начални стойности, настройки на решаващия алгоритъм, изглед на картата, позиция на легендата и видими етикети) до първоначалните им стойности? Мрежата ви не се променя. Настройките принадлежат на отворения проект, затова другите ви проекти запазват своите.';
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
$ec_lang['lpn_settings_wipe_btn']='Започни отначало';
$ec_lang['lpn_confirm_wipe']='Да започнете ли отначало, като изтриете ВСИЧКО, записано за тази страница: всеки проект, всяко фоново изображение, всички настройки и избраните от вас единици? Страницата ще се презареди точно така, както я вижда съвсем нов посетител. Това не може да бъде отменено.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Копирайте тази връзка:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Време';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Общо време на изпълнение';
$ec_lang['lpn_time_hyd_step']='Хидравлична стъпка във времето';
$ec_lang['lpn_time_pattern_step']='Стъпка на графика във времето';
$ec_lang['lpn_time_pattern_start']='Начален момент на графика';
$ec_lang['lpn_time_report_step']='Стъпка на отчитане във времето';
$ec_lang['lpn_time_report_start']='Начален момент на отчитане';
$ec_lang['lpn_time_clock_start']='Часовниково време в началото';
$ec_lang['lpn_time_statistic']='Статистика';
$ec_lang['lpn_time_stat_none']='Няма';
$ec_lang['lpn_time_stat_averaged']='Сред.';
$ec_lang['lpn_time_stat_minimum']='Мин.';
$ec_lang['lpn_time_stat_maximum']='Макс.';
$ec_lang['lpn_time_stat_range']='Размах';
$ec_lang['lpn_time_clock_day']='Ден {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Запишете време като часове и минути, например 2:30. Голо число означава часове, така че 8 означава осем часа. Половин час е 0:30.';
$ec_lang['lpn_time_running']='Изпълнява се изчисление за период от време.';
$ec_lang['lpn_time_no_engine']='Вграденият решаващ алгоритъм изчислява по един момент наведнъж, затова това е мрежата само в {time}: всеки график се чете в този момент, а всяка цистерна остава на началното си ниво, вместо да се пълни и изпразва. Свържете се с интернет веднъж, за да изтеглите решаващия модул на EPANET, който изпълнява изчисление за период от време.';
// lpn_time_no_engine says "connect to the internet", which is true only offline. For the other causes
// of a failed extended period run the same note ends in {reason}, one of the three sentences below.
$ec_lang['lpn_time_no_engine_why']='Вграденият решаващ алгоритъм изчислява по един момент наведнъж, затова това е мрежата само в {time}: всеки график се чете в този момент, а всяка цистерна остава на началното си ниво, вместо да се пълни и изпразва. {reason}';
$ec_lang['lpn_time_engine_fetch_failed']='Изтеглянето на решаващия модул на EPANET не успя. Презаредете страницата, за да опитате отново; възможно е защитна стена, прокси или разширение на браузъра да го блокира.';
$ec_lang['lpn_time_engine_start_failed']='Браузърът отказа да стартира решаващия модул на EPANET. Възможно е WebAssembly да е изключен от настройка за сигурност или от разширение.';
$ec_lang['lpn_time_engine_run_failed']='Изчислението с EPANET не успя. Това е дефект на тази страница; използвайте връзката {wrong}, за да го докладвате.';
$ec_lang['lpn_time_slider']='Изминало време на изчислението';
$ec_lang['lpn_time_no_period']='Този проект няма зададен изчислен период от време, затова има само един момент за показване. Задайте Общо време на изпълнение в Настройки, Изчисление, Време, за да изчислите период от време.';
$ec_lang['lpn_time_first']='Отиди в началото';
$ec_lang['lpn_time_prev']='Стъпка назад';
$ec_lang['lpn_time_play']='Пусни';
$ec_lang['lpn_time_play_tip']='Пусни анимацията';
$ec_lang['lpn_time_pause_tip']='Постави анимацията на пауза';
$ec_lang['lpn_time_pause']='Пауза';
$ec_lang['lpn_time_next']='Стъпка напред';
$ec_lang['lpn_time_last']='Отиди в края';
$ec_lang['lpn_time_tank']='Цистерна';
$ec_lang['lpn_time_level']='Водно ниво';
$ec_lang['lpn_time_run']='Изчисли';
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
$ec_lang['lpn_time_run_done']='Изпълнението завърши. Отчетни моменти: {frames}. Отнесено време: {secs} s.';
$ec_lang['lpn_time_runbox_hide']='Не показвай тази кутия отново';
$ec_lang['lpn_settings_runbox']='Показвай кутията с напредъка на изпълнението';
$ec_lang['lpn_settings_runbox_tip']='Кутия, която докладва напредъка и резултата от изчисление. Когато е изключена, завършеното изчисление казва същото в реда за състояние за няколко секунди. Това е настройка за този браузър, а не за проекта.';
$ec_lang['lpn_time_run_failed']='Изпълнението не завърши, затова няма резултати за по-късните моменти.';
$ec_lang['lpn_time_run_report']='Изчисление: отчет';
$ec_lang['lpn_time_run_report_copied']='Копирано';
$ec_lang['lpn_time_run_report_tip']='Отчетът, който EPANET е записал за последното изчисление, дословно: дали се е сходил и всички предупреждения. Текстът се създава от решаващия модул на EPANET, а не от тази страница.';

$ec_lang['lpn_time_speed']='Скорост';
$ec_lang['lpn_time_speed_tip']='Скорост на възпроизвеждане';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Търсене в настройките';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Въведете дума или няколко думи, за да видите настройките, които ги споменават всичките.';
$ec_lang['lpn_settings_no_match']='Нито една настройка не споменава тази дума.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Ширина на списъка в раздела Настройки';
$ec_lang['lpn_rpane_empty']='Тук все още нищо не е закачено. Всичко, което принадлежи на целия проект, е в Настройки.';
$ec_lang['lpn_time_settings_open']='Настройки за времето';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Визуализация';
$ec_lang['lpn_settings_sec_assets']='Елементи';
$ec_lang['lpn_settings_sec_calculation']='Изчисление';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Абонат';
$ec_lang['lpn_labels_customer_note']='Етикетът на абонат показва избраните тук стойности. Чертае се със същия размер на текста като всеки друг етикет на картата.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Етикетите на абонатите се чертаят само докато изгледът на картата е с тази ширина или по-тесен. Оставете полето празно, за да ги чертаете при всеки мащаб. Въведете 0, за да не се чертае етикет на абонат никога, при никакъв мащаб. Това няма ефект, ако е по-голямо от подобната настройка за всички етикети.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Използвай текущия изглед';
$ec_lang['lpn_settings_page']='Страница';
$ec_lang['lpn_saved_project']='Записано с проекта';
$ec_lang['lpn_saved_browser']='Записано в този браузър';
$ec_lang['lpn_saved_session']='Не е записано';
$ec_lang['lpn_settings_hydraulics']='Хидравлика';
$ec_lang['lpn_settings_quality']='Качество на водата';
$ec_lang['lpn_settings_quality_track']='Параметър на качеството';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Изберете какво трябва да проследи изчислението през тръбите: колко дълго водата е била в системата, откъде идва или химично вещество, което реагира, докато се движи. Само химичното вещество се нуждае от коефициенти.';
$ec_lang['lpn_settings_quality_source']='Възел за проследяване';
$ec_lang['lpn_settings_quality_source_tip']='Възелът, чиято вода се проследява. Всеки друг възел след това показва дела на своята вода, дошъл от този възел.';
$ec_lang['lpn_quality_none']='Нищо';
$ec_lang['lpn_quality_trace']='Проследяване на източник';
$ec_lang['lpn_quality_chemical']='Химично вещество, което реагира';
$ec_lang['lpn_quality_needs_run']='Качеството на водата се пренася по тръбите, докато водата се движи, затова се нуждае от изчислен период от време: решаващия модул на EPANET и общо време на изпълнение. Задайте Общо време на изпълнение под Време, после натиснете бутона „Изчисли“.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Химично вещество и мерни единици';
$ec_lang['lpn_quality_chemical_name_tip']='Проследяваното химично вещество, например Хлор. Оставете празно, за да се използва етикетът по подразбиране на EPANET, Chemical. Показва се в отчетите, но не се използва в изчисленията.';
$ec_lang['lpn_quality_mass_units']='Мерни единици за маса';
$ec_lang['lpn_quality_mass_units_tip']='Частта с мерните единици от записа за качество, от двата избора на EPANET.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Допустимо отклонение на качеството';
$ec_lang['lpn_quality_tolerance_tip']='Разлика в концентрацията, под която EPANET третира два съседни обема вода като един. Празно използва стойността по подразбиране на EPANET — 0.01.';
$ec_lang['lpn_quality_diffusivity']='Относителна дифузивност';
$ec_lang['lpn_quality_diffusivity_tip']='Дифузивност на химичното вещество във водата, спрямо хлора. Празно използва стойността по подразбиране на EPANET — 1.0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Концентрация на {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Средна концентрация на {chemical}';
$ec_lang['lpn_quality_initial']='Начално качество';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Количество на химичното вещество в този възел, когато изчислението започва. Резервоар запазва тази стойност през цялото изчисление, което е обичайният начин за задаване на остатъка на изхода на пречиствателна станция. Празно означава 0.';
$ec_lang['lpn_result_concentration']='Концентрация';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Количество на химичното вещество, останало в тази точка след транспорт и реакция. Мерните единици са тези, въведени с името на химичното вещество в Настройки, Изчисление, Качество на водата.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Вид източник';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Какъв вид доза прилага този възел върху водата, минаваща през него. Концентрация приема, че водата, влизаща в мрежата тук, пристига със стойността Качество на източника. Масов бустер добавя маса химично вещество всяка минута, каквото и да е водното количество. Бустер на зададена стойност повдига концентрацията, напускаща този възел, до стойността Качество на източника и не по-нагоре. Бустер, пропорционален на потока, добавя стойността Качество на източника към това, което вече е във водата.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Няма';
$ec_lang['lpn_source_type_concen']='Концентрация';
$ec_lang['lpn_source_type_mass']='Масов бустер';
$ec_lang['lpn_source_type_setpoint']='Бустер на зададена стойност';
$ec_lang['lpn_source_type_flowpaced']='Бустер, пропорционален на потока';
$ec_lang['lpn_source_quality']='Качество на източника';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Силата на дозата. За всеки вид, освен масовия бустер, това е концентрация, в мерните единици, посочени до химичното вещество в Настройки, Изчисление, Качество на водата; за масов бустер това е масов дебит за минута. Празно означава без източник на химично вещество, функционално равносилно на 0.';
$ec_lang['lpn_source_pattern']='График на източника';
$ec_lang['lpn_source_pattern_tip']='Времеви график, който мащабира дозата през изчислението, за доза, която не е постоянна. Без график дозата е една и съща на всяка стъпка.';
$ec_lang['lpn_mixing_model']='Модел на смесване';
$ec_lang['lpn_mixing_model_tip']='Модел на смесване на водата, която вече е в тази цистерна, с постъпващата вода. Пълното смесване смесва мигновено цялата постъпваща вода с целия обем на цистерната. Двусекционното смесване първо запълва входната зона и предава преливането към основната зона. FIFO бутален поток изпуска водата в реда, в който е пристигнала. LIFO бутален поток я натрупва на слоеве, така че последната влязла вода е първата излязла. Изборът влияе на възрастта на водата и остатъка, но не и на налягането или водното количество.';
$ec_lang['lpn_mixing_mixed']='Пълно смесване';
$ec_lang['lpn_mixing_2comp']='Двусекционно смесване';
$ec_lang['lpn_mixing_fifo']='FIFO бутален поток';
$ec_lang['lpn_mixing_lifo']='LIFO бутален поток';
$ec_lang['lpn_mixing_fraction']='Дял на смесване';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Делът от обема на цистерната, който заема входната зона, между 0 и 1. Само двусекционното смесване го използва. Оставете полето празно и цялата цистерна е входна зона, което е допускането на EPANET.';
$ec_lang['lpn_reaction_bulk']='Коефициент на обемна реакция';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Реакция в обема на водата (вижте помощта на EPANET), използвана за всяка тръба и цистерна без индивидуален коефициент. Отрицателно число разгражда химичното вещество, а положително го увеличава. Празно означава без обемна реакция.';
$ec_lang['lpn_reaction_wall']='Коефициент на реакция при стената';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Реакция при стената на тръбата, използвана за всяка тръба, която не пази своя собствена. Отрицателно число разгражда химичното вещество. Реакцията е от първи ред, освен ако внесен EPANET файл не задава друг ред, затова коефициентът е дължина на ден, записана в мерната единица за дължина на проекта. Празно поле означава без реакция при стената.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Само тази тръба. Оставете полето празно и тръбата използва коефициента, зададен за цялата мрежа под Настройки, Качество на водата.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Коефициент на реакция';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Реакция във водата, съдържаща се в тази цистерна, като скорост в 1/ден. Отрицателно число разгражда химичното вещество, а положително го увеличава. Водата престоява в цистерна много по-дълго, отколкото в която и да е тръба, затова често именно тук се губи остатъкът. Празно означава да се използва коефициентът на обемна реакция, зададен за цялата мрежа в Настройки, Изчисление, Качество на водата.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Обемна реакция';
$ec_lang['lpn_reaction_wall_short']='Реакция при стената';
$ec_lang['lpn_reaction_tank_short']='Реакция';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/ден';
$ec_lang['lpn_reaction_day']='ден';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Ред на обемната реакция';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='Степента, на която е повдигната концентрацията за реакцията в тялото на водата. Позволено е всяко реално число. 1 е стойността по подразбиране и се използва за повечето модели на разпад на хлора. 0 прави скоростта независима от количеството налично вещество.';
$ec_lang['lpn_reaction_order_tank']='Ред на реакцията в цистерната';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='Степента, на която се повдига концентрацията при реакция във водата, съхранявана в цистерна, отделно от реда на обемната реакция, така че цистерната да може да реагира с различен ред от тръбите. Допустимо е всяко реално число, а 1 е по подразбиране. EPANET го задава като ORDER TANK във файл и няма поле за него в интерфейса на EPANET.';
$ec_lang['lpn_reaction_order_wall']='Ред на реакцията по стената';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 означава, че реакцията по стената протича според зададения(те) коефициент(и). 0 означава, че не протича. Това е превключвател включено/изключено. Стойността по подразбиране е 1.';
$ec_lang['lpn_reaction_order_zero']='0, нулев ред';
$ec_lang['lpn_reaction_order_first']='1, първи ред';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Ограничаващ потенциал';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Концентрация, към която веществото се стреми, вместо да намалява до нула или да нараства безкрайно. Реакцията се забавя, докато водата се приближава до нея, и спира там. Използвайте съгласувани мерни единици. Без ограничение, ако е празно.';
$ec_lang['lpn_reaction_rough_corr']='Корелация с грапавостта';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Коефициент, който свързва коефициента на реакция при стената с грапавостта на всяка тръба, така че по-грапавата тръба реагира по-бързо. Когато е зададен, за всяка тръба се изчислява коефициент при стената от нейната грапавост, а единичният коефициент при стената по-горе не се използва. Не се използва, ако е празно.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Тази страница не предлага свой собствен коефициент на реакция. Няма стандартен тест за такъв, а публикуваните стойности за един и същ вид вода се различават до десет пъти, затова число, зададено тук, би било прието като препоръка. Въведете стойност, която сте измерили или можете да посочите като източник, или оставете полетата празни за химично вещество, което не реагира.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Енергия';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Отчети';
// Edited by TGH 2026-09-07
// Row label only (the box title is lpn_time_run_report). Tom, 2026-10-07: no row carries '(EPANET)';
// the tips say where a report comes from. Run is EPANET's verbatim report.
$ec_lang['lpn_reports_epanet']='Изпълнение';
$ec_lang['lpn_energy_title']='Помпи: отчет за енергията';
$ec_lang['lpn_energy_menu']='Енергия на помпите';
$ec_lang['lpn_energy_efficiency']='Ефективност на помпата (процент)';
$ec_lang['lpn_energy_efficiency_tip']='Ефективността от контакта до водата, използвана за всяка помпа без крива на ефективност. EPANET използва 75 процента, когато не е зададена стойност.';
$ec_lang['lpn_energy_price']='Цена на енергията';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Цената на един киловатчас. Прилага се за всяка помпа без индивидуална цена. Празно означава 0.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Цената на един киловатчас при тази помпа. Празно означава да се използва цената, зададена за цялата мрежа в Настройки, Енергия.';
$ec_lang['lpn_energy_price_pattern']='График на цената';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='График, който умножава цената на всяка стъпка от графика, което е начинът да се зададе намалена нощна тарифа. Оставете полето празно за една цена през цялото изчисление.';
$ec_lang['lpn_energy_demand_charge']='Такса за пиково потребление';
$ec_lang['lpn_energy_demand_charge_tip']='За kW, за пиковото натоварване, изисквано от помпите';
$ec_lang['lpn_energy_currency']='Валута';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Текст, отпечатван до всяка стойност на разход. Това е само етикет; използвайте една валута навсякъде.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Тази страница не предлага своя собствена цена. Цената на енергията зависи от доставчика, страната, часа и годината, затова число, зададено тук, би било прието като препоръка. Въведете цената от вашата собствена тарифа.';
$ec_lang['lpn_energy_needs_run']='Енергията на помпите е мощност, интегрирана през изчислението, затова се нуждае от изчислен период от време: решаващия модул на EPANET и общо време на изпълнение. Задайте Общо време на изпълнение в Настройки, Изчисление, Време, натиснете бутона „Изчисли“, после отворете Вода, Отчети, Енергия на помпите.';
$ec_lang['lpn_energy_no_pumps']='Тази мрежа няма помпи, затова няма какво да потребява мощност.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Сценарии: сравнение';
$ec_lang['lpn_scncmp_menu_tip']='Таблица на сценариите с брой свои стойности, най-ниско налягане и най-висока скорост';
$ec_lang['lpn_scncmp_running']='Изчисляват се всички сценарии…';
$ec_lang['lpn_scncmp_empty']='Все още нищо не е начертано, затова няма какво да се изчисли.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Най-висока скорост';
$ec_lang['lpn_scncmp_at']='{value} при {id}';
$ec_lang['lpn_scncmp_at_time']='{value} при {id}, {time}';
$ec_lang['lpn_scncmp_same']='Еднакво във всеки сценарий';
$ec_lang['lpn_scncmp_period_note']='Когато сценарият има обща продължителност на изчислението, най-ниското му налягане и най-високата скорост са екстремумите за цялата мрежа, в показания момент.';
$ec_lang['lpn_scncmp_current']='(отворен в момента)';
$ec_lang['lpn_scncmp_note']='Всеки сценарий се изчислява от копие на чертежа. Нищо тук не променя проекта, а сценарият, в който работите, остава такъв, какъвто е бил.';
$ec_lang['lpn_energy_over']='За изчислен период от време от {time}';
$ec_lang['lpn_energy_col_pump']='Помпа';
$ec_lang['lpn_energy_col_running']='% от изпълнението';
$ec_lang['lpn_energy_col_effic']='Ефект.';
$ec_lang['lpn_energy_col_avg_kw']='Ср. kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='Средната мощност, използвана, докато тази помпа е работила. Не е осреднена спрямо периодите на бездействие, затова помпа, бездействала през по-голямата част от изчисления период от време, все пак отчита мощността, която е използвала, докато е работила.';
$ec_lang['lpn_energy_col_peak_kw']='Пик. kW';
$ec_lang['lpn_energy_col_cost']='Разход';
$ec_lang['lpn_energy_total_kwh']='Използвана енергия';
$ec_lang['lpn_energy_total_energy_cost']='Разход за енергия';
$ec_lang['lpn_energy_peak_kw']='Пиково потребление на мощност';
$ec_lang['lpn_energy_total_demand_charge']='Разход за пиково потребление';
$ec_lang['lpn_energy_total_cost']='Общ разход';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW AND THE BOX TITLE BOTH SAY "Status changes"** (Tom, 2026-10-07), so menu and box agree.
$ec_lang['lpn_reports_status']='Промени на състоянието';
$ec_lang['lpn_reports_status_tip']='Какво се е променило през последното изчисление за период от време, в хронологичен ред: помпи и вентили, отварящи се или затварящи се, цистерни, които се пълнят, изпразват, напълват докрай или пресъхват, и стъпки, които не са се сходили напълно.';
$ec_lang['lpn_status_title']='Състояние: промени';
$ec_lang['lpn_status_needs_run']='Отчетът за състоянието изброява какво се е променило по време на изчисление за период от време. Задайте Общо време на изпълнение в Настройки, Изчисление, Време, натиснете Изчисли, после отворете Вода, Отчети, Промени на състоянието.';
$ec_lang['lpn_status_empty']='Нищо не промени състоянието си по време на това изпълнение.';
$ec_lang['lpn_status_col_event']='Събитие';
$ec_lang['lpn_status_opened']='{type} {id} се отвори сега';
$ec_lang['lpn_status_closed']='{type} {id} се затвори сега';
$ec_lang['lpn_status_filling']='{type} {id} сега се пълни';
$ec_lang['lpn_status_emptying']='{type} {id} сега се изпразва';
$ec_lang['lpn_status_full']='{type} {id} се напълни докрай';
$ec_lang['lpn_status_dry']='{type} {id} се изпразни напълно';
$ec_lang['lpn_status_no_converge']='Хидравличното решение на тази стъпка не се сходи напълно; показаните числа са от последната му итерация.';
$ec_lang['lpn_status_note']='Прочетен от същото изпълнение за период от време, както панела Таблици и Пълния отчет. Изброена е само промяна, не всяка стъпка.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Пълен';
$ec_lang['lpn_reports_full_tip']='Таблица с всички възли и връзки при всяка стъпка на отчитане от последното изчисление';
$ec_lang['lpn_full_title']='Пълен отчет';
$ec_lang['lpn_full_needs_run']='Пълният отчет изброява всеки възел и всяка връзка при всяка стъпка на отчитане. Натиснете Изчисли, после отворете Вода, Отчети, Пълен отчет.';
$ec_lang['lpn_full_note']='Един ред за възел или връзка на стъпка на отчитане, в мерните единици, показани в панела Таблици. Празна клетка е колона, която тази величина няма. Изтеглянето или печатът включват всяка стъпка от времето; таблицата по-долу показва по една наведнъж.';
$ec_lang['lpn_full_step_label']='Стъпка от времето';
$ec_lang['lpn_full_download_csv']='Изтегли CSV';
$ec_lang['lpn_full_print']='Отпечатай отчета';
$ec_lang['lpn_full_col_time']='Време';
$ec_lang['lpn_full_col_type']='Вид';
$ec_lang['lpn_full_row_count']='Редове ({n}).';

// ---- The Calibration report (ROADMAP Task 601) -------------------------------------------------
// EPANET's Report > Calibration and its three tabbed pages, with EPANET's own column names (EPANET
// 2.2 manual, section 9.6). Mean error is EPANET's term for the mean ABSOLUTE difference. "Num obs"
// is EPANET's own column heading, kept short because results columns are narrow.
// lpn_calib_missing: keep in step with feat/profile-file's lpn_profile_file_missing (Task 604), the same sentence.
$ec_lang['lpn_reports_calib']='Калибриране';
$ec_lang['lpn_reports_calib_tip']='Сравнява измерени полеви данни от файл за калибриране с последното изчисление: статистики, корелационна диаграма и сравнения на средните.';
$ec_lang['lpn_calib_title']='Калибриране: отчет';
$ec_lang['lpn_calib_param']='Параметър';
$ec_lang['lpn_calib_param_tip']='Величината, която измерва файлът за калибриране. За всеки параметър се държи по един файл.';
$ec_lang['lpn_calib_load']='Зареди файл за калибриране…';
$ec_lang['lpn_calib_load_tip']='Текстов файл с идентификатор на място, време и измерена стойност на всеки ред. Времето се отчита от началото на изчислението, в десетични часове или часове:минути. Точка и запетая започва коментар. Ред само с време и стойност принадлежи на мястото над него.';
$ec_lang['lpn_calib_none']='За този параметър не е зареден файл за калибриране.';
$ec_lang['lpn_calib_session']='Файлът за калибриране се държи само за тази сесия. Не се записва с проекта, нито на това устройство.';
$ec_lang['lpn_calib_file']='{file}: измервания ({n}) на места ({m}).';
$ec_lang['lpn_calib_units']='Стойностите във файла се четат в мерните единици на този проект: {unit}.';
$ec_lang['lpn_calib_missing']='Посочени във файла, но ги няма в тази мрежа: {ids}.';
$ec_lang['lpn_calib_missing_count']='Пропуснати измервания, защото мястото им не е в тази мрежа: {n}.';
$ec_lang['lpn_calib_bad_lines']='Редове, които не можаха да се прочетат и са пропуснати: {lines}';
$ec_lang['lpn_calib_outside']='Пропуснати измервания извън моментите, отчетени от това изчисление: {n}.';
$ec_lang['lpn_calib_no_value']='Пропуснати измервания без изчислена стойност в техния момент: {n}.';
$ec_lang['lpn_calib_single']='Това е изчисление за един момент, затова всяко измерване се сравнява с единствения му резултат, независимо какво време дава файлът.';
$ec_lang['lpn_calib_needs_run']='Все още няма резултати за сравнение. Отчетът се попълва, след като мрежата бъде изчислена.';
$ec_lang['lpn_calib_no_pairs']='Нито едно измерване не можа да се сравни, затова няма какво да се начертае.';
$ec_lang['lpn_calib_tab_stats']='Статистики';
$ec_lang['lpn_calib_tab_corr']='Корелационна диаграма';
$ec_lang['lpn_calib_tab_means']='Сравнения на средните';
$ec_lang['lpn_calib_col_location']='Място';
$ec_lang['lpn_calib_col_n']='Брой набл.';
$ec_lang['lpn_calib_col_obs_mean']='Средно наблюдавано';
$ec_lang['lpn_calib_col_sim_mean']='Средно изчислено';
$ec_lang['lpn_calib_col_mean_err']='Средна грешка';
$ec_lang['lpn_calib_col_mean_err_tip']='Средната стойност на абсолютните разлики между всяка наблюдавана стойност и изчислената стойност в същия момент.';
$ec_lang['lpn_calib_col_rms_err']='СКГ';
$ec_lang['lpn_calib_col_rms_err_tip']='Средноквадратична грешка: квадратният корен от средната стойност на квадратите на разликите между наблюдаваните и изчислените стойности.';
$ec_lang['lpn_calib_network']='Мрежа';
$ec_lang['lpn_calib_corr_means']='Корелация между средните: {r}';
$ec_lang['lpn_calib_corr_none']='Корелация между средните: изискват се поне две места с различни средни.';
$ec_lang['lpn_calib_axis_obs']='Наблюдавано: {q}';
$ec_lang['lpn_calib_axis_sim']='Изчислено: {q}';
$ec_lang['lpn_calib_observed']='Наблюдавано';
$ec_lang['lpn_calib_computed']='Изчислено';
$ec_lang['lpn_calib_point']='{id}, {time}: наблюдавано {o}, изчислено {s}';
$ec_lang['lpn_calib_corr_note']='Всяка точка е едно измерване. Колкото по-близо лежат точките до диагоналната линия, толкова повече изчислените стойности съвпадат с наблюдаваните.';
$ec_lang['lpn_calib_ts_point']='Измерено в {id}, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='Кръговете са измерени стойности от файла за калибриране.';
$ec_lang['lpn_energy_no_price']='Не е зададена цена на енергията, затова всеки разход тук е нула. Задайте я под Настройки, Енергия.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Тази мрежа задава цена нула, затова всеки разход тук е нула. Променете я под Настройки, Енергия.';
$ec_lang['lpn_energy_curve_note']='Тези помпи сочат крива на ефективност без точки: {ids}. Те са работили при ефективността, зададена за цялата мрежа.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_drop']='Отпада';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Възли и участъци';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Равни интервали';
$ec_lang['lpn_color_mode_quantile']='Квантил (равен брой)';
$ec_lang['lpn_color_mode_jenks']='Естествени прекъсвания (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Стандартно отклонение';
$ec_lang['lpn_color_mode_pretty']='Закръглени граници';
$ec_lang['lpn_color_mode_log']='Логаритмичен';
$ec_lang['lpn_color_mode_manual']='Ръчно';

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
$ec_lang['lpn_library_menu']='Библиотеки';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Графици';
// **THE SYNONYMS ARE TOM'S OWN, GIVEN 2026-08-24**, which is the written permission this array
// requires. "Pattern" is the discipline's standard term and stays the label; the payload exists so
// a translator who cannot recover the concept from that one word has the shape of it.
//
// "Run" was on his list and he struck it the same day, on the collision: this page's Run is the
// button that plays an extended-period simulation back, so a translator reaching for their word for
// a program run would have named the wrong thing. Tom: *"Yes. It's not the best term."*
$ec_lang['lpn_library_patterns_tip']='Графикът е повтарящ се списък от коефициенти. Всеки от тях важи за една стъпка от времето на графика, така че 24 числа при стъпка от един час образуват денонощие, което се повтаря. Потребност от 10 с коефициент 1,5 е 15 в този момент.';
$ec_lang['lpn_library_curves']='Криви';
$ec_lang['lpn_library_curves_tip']='Напор или ефективност на помпа спрямо водното количество, загуба на вентил спрямо водното количество или обем на цистерна спрямо дълбочината';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Кривите са прикачени към помпи и вентили. За крива на напора на помпа изчислението използва крива, прекарана през точките, както е показано; за всеки друг вид то свързва точките с прави отсечки, както е показано.';
$ec_lang['lpn_library_curve_add']='Добави крива';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Вид крива';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Уравнение';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='Кривата, прекарана през точките, и линията, начертана на графиката по-долу. Тя се извежда наново от точките всеки път, когато се показва, и никога не се записва, а числата ѝ са в мерните единици, показани в таблицата по-горе. Вграденият решаващ модул изчислява по това уравнение; решаващият модул на EPANET чете самите точки.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Изберете една или две колони в електронна таблица, копирайте ги и ги поставете в първата целева клетка. Редовете се добавят при нужда. Могат да се поставят и редове, копирани директно от EPANET файл, включително името на кривата.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_remove_point']='Премахни тази точка';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Копирай точките';
$ec_lang['lpn_library_curve_copy_tip']='Копира всяка точка като две колони, готови за поставяне в електронна таблица.';
$ec_lang['lpn_library_curve_copy_manual']='Копирай тези точки';
$ec_lang['lpn_library_curve_used_by']='Обекти, използващи тази крива';
$ec_lang['lpn_library_curve_unused']='Нищо не използва тази крива.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Тази крива се използва от елементи ({count}): {ids}. Първо им задайте друга крива, после изтрийте тази.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Видове тръби';
$ec_lang['lpn_library_pipetypes_tip']='Видът тръба е дефиниция, към която няколко тръби могат да се обръщат за своя диаметър, грапавост и коефициенти на реакция. Редактирането на дефиницията редактира всяка тръба, която я използва.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Всеки проект има отделна библиотека от видове тръби. Свойства може да се оставят празни в дефиницията на вид тръба; например вид тръба може да посочва грапавост и да няма диаметър. Видовете тръби се задават на тръбите в свойствата на тръбата. Редактирането на дефиниция тук променя всяка тръба, която се позовава на нея.';
$ec_lang['lpn_library_pipetype_add']='Добавяне на вид тръба';
$ec_lang['lpn_library_pipetype_blank_tip']='Празните свойства в дефиниция на вид тръба се оставят да бъдат въведени поотделно за всяка тръба.';
$ec_lang['lpn_library_pipetype_used_by']='Тръби, използващи този вид';
$ec_lang['lpn_library_pipetype_unused']='Нищо не използва този вид тръба.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Този вид тръба се използва от тръби ({count}): {ids}. Прекратете връзката с тях, преди да го изтриете.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Вид тръба';
$ec_lang['lpn_field_pipetype_tip']='Видът тръба от библиотеката на проекта, който тази тръба използва. Свойствата, включени във вида тръба, са забранени за редактиране тук. Прекратете връзката с вида тръба, за да разрешите редактирането тук.';
$ec_lang['lpn_pipetype_none']='Не е избран вид тръба';
$ec_lang['lpn_pipetype_detach']='Прекратяване на връзката с вида тръба';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Копира стойностите, които тази тръба чете от своя вид, в самата тръба и спира да използва вида. Стойностите на тръбата не се променят сега, а оттук нататък тези стойности се редактират тук.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Фитинги';
$ec_lang['lpn_library_fittings_tip']='Фитинги с коефициенти на местни загуби, групирани в списъци';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Всеки проект има отделна библиотека от фитинги. Списъкът с фитинги съдържа фитинги с количество за всеки от тях и се сумира в един коефициент на местни загуби. И тръби, и видове тръби могат да се отнасят към списък.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Предложените тук фитинги са тринадесетте от Таблица 3.3 на ръководството за потребителя на EPANET 2.2. Избирането на един копира неговия коефициент в реда, където може да се промени. Коефициентът зависи от размера и производителя на фитинга, затова разглеждайте таблицата като отправна точка, а не като окончателни стойности.';
$ec_lang['lpn_library_fittings_add']='Добавяне на списък с фитинги';
$ec_lang['lpn_library_fittings_used_by']='Тръби, използващи този списък с фитинги';
$ec_lang['lpn_library_fittings_unused']='Нищо не използва този списък с фитинги.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Този списък с фитинги се използва от тръби ({count}): {ids}. Прекратете връзката с тях, преди да го изтриете.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Импортирай библиотеки…';
$ec_lang['lpn_library_import_tip']='Изберете друг проектен файл и копирайте цели библиотеки от него в този проект. Всичко, чието име вече е заето тук, се пропуска и изброява, така че нищо, което вече имате, не се променя.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Изберете какво да копирате от {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Всяка библиотека, която отметнете, се копира изцяло. Изтрийте после това, което не искате, по същия начин, по който изтривате всеки друг запис.';
$ec_lang['lpn_library_import_go']='Импортирай';
$ec_lang['lpn_library_import_no_libraries']='Този проектен файл няма библиотеки за копиране.';
$ec_lang['lpn_library_import_heading']='Импортирано от {file}';
$ec_lang['lpn_library_import_added']='Копирани: {names}';
$ec_lang['lpn_library_import_conflict']='Пропуснато, защото този проект вече има запис със същото име: {names}. Нищо тук не бе променено. Преименувайте единия от двата и импортирайте отново, ако искате и двата.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Този проектен файл няма нищо от това за копиране.';
$ec_lang['lpn_library_import_curve_shape']='Тези криви бяха внесени точно както са записани във файла, а изчисление не може да използва крива, докато първата ѝ колона не нараства от всяка точка към следващата: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Тези видове тръби се отнасят към списък с фитинги, който този проект няма: {names}. Внесете библиотеката с фитинги от същия файл, за да се разрешат тези препратки.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Внимание: несъответствие на мерните единици. Ще бъде импортирано както е. Не се препоръчва.';
$ec_lang['lpn_library_import_units_line']='{name}: този проект показва {mine}, файлът показва {theirs}.';
$ec_lang['lpn_fitting_qty']='Количество';
$ec_lang['lpn_fitting_name']='Фитинг';
$ec_lang['lpn_fitting_k']='Коефициент';
$ec_lang['lpn_fitting_add']='Добавяне на фитинг';
$ec_lang['lpn_fitting_remove']='Премахване';
$ec_lang['lpn_fitting_total']='Общ коефициент на местни загуби, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Списък с фитинги';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Списък с фитинги от библиотеката на проекта. Неговите количества и коефициенти се сумират в коефициента на местни загуби на тази тръба, а полето за коефициента след това е само за четене. Не избирайте списък, за да въведете коефициента сами.';
$ec_lang['lpn_fittings_none']='Не е избран списък с фитинги';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Спирателен (проходен) вентил, напълно отворен';
$ec_lang['lpn_fitting_angle']='Ъглов вентил, напълно отворен';
$ec_lang['lpn_fitting_swingcheck']='Клапен възвратен вентил, напълно отворен';
$ec_lang['lpn_fitting_gate']='Плъзгащ (клинов) вентил, напълно отворен';
$ec_lang['lpn_fitting_elbow_short']='Коляно с малък радиус';
$ec_lang['lpn_fitting_elbow_medium']='Коляно със среден радиус';
$ec_lang['lpn_fitting_elbow_long']='Коляно с голям радиус';
$ec_lang['lpn_fitting_elbow_45']='Коляно 45 градуса';
$ec_lang['lpn_fitting_return_bend']='Затворено обратно коляно';
$ec_lang['lpn_fitting_tee_run']='Стандартен тройник, поток през правия участък';
$ec_lang['lpn_fitting_tee_branch']='Стандартен тройник, поток през отклонението';
$ec_lang['lpn_fitting_entrance']='Квадратен вход';
// Tom, 2026-09-30, ruling sprint 2026-09-30-golf item 1: _syn = "All junctions" / "Selected junctions".
$ec_lang['lpn_fitting_exit']='Изход';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Друг фитинг';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_lead']='Експортираният файл на EPANET е числено еквивалентен на този проект. Но в него няма място за следните неща:';
$ec_lang['lpn_inp_export_flat_types']='Тръбите тук ({n}) се отнасят към видове тръби ({t}). Във файла всяка от тези тръби носи собствено копие на числата, така че резултатите са същите. Файлът не може да съдържа самия вид тръба, затова връзката между една дефиниция и всяка тръба, която я използва, се записва само в проектния файл.';
$ec_lang['lpn_inp_export_flat_coords']='EPANET файлът пази една позиция за всеки възел. Този сценарий поставя {n} от тях другаде и тези позиции са във файла. Всеки друг сценарий пази позициите си само в проектния файл.';
$ec_lang['lpn_inp_export_flat_fittings']='Файл на EPANET не може да съдържа списъка с колена, вентили и тройници във вашия файл на проекта. Коефициентът на местни загуби на тръбите тук ({n}) е сумиран от списък с фитинги. Общата сума влиза във файла точно както е, така че нищо в отговорите не се променя.';
$ec_lang['lpn_library_controls']='Управление';
$ec_lang['lpn_library_controls_tip']='Контролът е едно указание, което отваря или затваря връзка, или променя настройката ѝ според водното ниво в цистерна, налягането във възел или времето.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Добави график';
$ec_lang['lpn_library_pattern_values']='Коефициенти';
$ec_lang['lpn_library_pattern_values_tip']='Коефициентите, разделени с интервали или запетаи. Поставете колона от таблица, ако имате такава. Списъкът се повтаря през цялото времетраене на изчислението, затова не е нужно да покрива целия период.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='Коефициенти: {n}, през {step}, покриващи {span}';
// Under the pattern graph, beside the clock-time row: the ordinal of each time period (1, 2, 3).
$ec_lang['lpn_library_pattern_axis_step']='Стъпка';
$ec_lang['lpn_library_pattern_none']='Без график';
// The blank first option of a selector whose blank follows a project-wide default (a junction's or
// customer's demand pattern, a pump's price pattern and efficiency curve). Tom, 2026-10-04.
$ec_lang['lpn_choice_default']='По подразбиране';
$ec_lang['lpn_settings_default_pattern']='График на потребността по подразбиране';
$ec_lang['lpn_settings_default_pattern_tip']='Всеки възел без свой график използва този.';
$ec_lang['lpn_junction_pattern_unknown']='Никой график в този проект няма ID {id}, затова възелът остана какъвто е бил.';
$ec_lang['lpn_settings_default_pattern_none']='Няма (постоянна)';
$ec_lang['lpn_demand_pattern_default']='(по подразбиране: {id})';
$ec_lang['lpn_demand_pattern_constant']='(постоянна)';
$ec_lang['lpn_library_pattern_default_mark']='(по подразбиране)';
$ec_lang['lpn_library_pattern_default_tip']='Графикът на потребността по подразбиране. Променете го в Настройки, График на потребността по подразбиране.';
$ec_lang['lpn_library_pattern_default_deleted_to']='График {id} беше графикът на потребността по подразбиране. Възлите без график сега използват график {now}.';
$ec_lang['lpn_library_pattern_default_deleted_none']='График {id} беше графикът на потребността по подразбиране. Възлите без график сега използват постоянна потребност.';
$ec_lang['lpn_library_pattern_default_deleted_also']='Сценарии, които също са го използвали като свой график по подразбиране: {list}.';
$ec_lang['lpn_library_pattern_default_deleted_in']='Графикът {id} беше графикът на потребността по подразбиране в тези сценарии: {list}.';
$ec_lang['lpn_library_control_add']='Добави правило';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Правило от един ред със синтаксиса на EPANET. Използвайте последователни единици на проекта. Ключовите думи трябва да са на английски. Примери: LINK 12 CLOSED IF NODE 23 ABOVE 20 (тръба 12 ще бъде затворена, когато нивото в цистерна 23 надвиши 20 фута); LINK 12 OPEN IF NODE 130 BELOW 30 (тръба 12 ще бъде отворена, ако налягането във възел 130 падне под 30 psi); LINK PUMP02 1.5 AT TIME 16 (относителната скорост на помпа PUMP02 се задава на 1,5 на 16-ия час от изчислението); LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM (две правила: тръба 12 се затваря периодично в 10 сутринта и се отваря в 8 вечерта през цялото изчисление)';
$ec_lang['lpn_library_control_ok']='✓ Разбрано';
$ec_lang['lpn_library_control_bad']='⚠ Неразбрано';
$ec_lang['lpn_library_control_missing']='⚠ В тази мрежа няма нищо на име {id}';
$ec_lang['lpn_library_rules']='Правила';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Правилото отваря или затваря връзка, или променя настройката ѝ, когато водно ниво, налягане, водно количество или време достигне зададена стойност. Правилото може да проверява повече от едно условие и може да задава действието при неизпълнено условие.';
$ec_lang['lpn_library_rule_add']='Добави правило';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Една клауза на ред. Следват описания с примери с ГЛАВНИ БУКВИ. Ред 1: име на правилото, „RULE 1“. Ред 2: условие, „IF TANK 2 LEVEL BELOW 17.1“. Ред 3: действие, „THEN PUMP 9 STATUS IS OPEN“. Ред 4: приоритет, „PRIORITY 1“. Добавете редове „AND“ или „OR“, за да проверите повече от едно условие, и редове „ELSE“, за да зададете действието, когато условието не е изпълнено. Условие може да чете LEVEL, HEAD, GRADE, PRESSURE или DEMAND на възел, FLOW, STATUS или SETTING на връзка, или TIME и CLOCKTIME на SYSTEM. Използвайте последователни мерни единици на проекта. Ключовите думи трябва да са на английски.';
$ec_lang['lpn_library_rule_ok']='✓ Това правило беше прочетено';
$ec_lang['lpn_library_rule_bad']='⚠ Това правило не можа да бъде прочетено';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Основна потребност';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Водното количество, което този възел отнема в показаната времева стъпка: всяка основна потребност, умножена по своя график, сумирани. Това е резултат, а не входна величина.';
$ec_lang['lpn_field_demand_pattern']='График на потребността';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_demand_add']='Добави категория потребност';
$ec_lang['lpn_demand_remove']='Премахни тази потребност';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='График на напора';
$ec_lang['lpn_field_head_pattern_tip']='График на водното ниво на този резервоар през изчислението. Напорът по-горе се умножава по графика.';
$ec_lang['lpn_field_pump_speed']='Относителна скорост';
$ec_lang['lpn_field_pump_speed_tip']='Спрямо скоростта на въртене, използвана за получаване на публикуваната крива на характеристиките на помпата. Игнорира се (не се мащабира), ако има график на скоростта.';
$ec_lang['lpn_field_speed_pattern']='График на скоростта';
$ec_lang['lpn_field_speed_pattern_tip']='Всеки елемент от графика дава относителната скорост за тази част от изчислението, вместо да мащабира базова стойност.';

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
$ec_lang['lpn_search_menu']='Търси място по име…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Разрешение се иска при първата употреба, защото търсенията се изпращат към услугата за имена на места на OpenStreetMap.';
$ec_lang['lpn_search_bar']='Търси по име…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Търсенето по име на място изпраща въведените от вас думи до nominatim.openstreetmap.org, безплатната услуга на OpenStreetMap Foundation за имена на места.';
$ec_lang['lpn_search_consent_2']='Това е различна услуга от изображенията на уличната карта зад проекта ви. Изображенията показват само къде гледате. Търсенето показва какво сте въвели. Услугата за имена на места ще получи търсените от вас думи и вашия IP адрес. Не изпращаме нищо друго и не пазим запис на търсенията ви.';
$ec_lang['lpn_search_consent_3']='Разрешавате ли да изпращаме търсенията ви към услугата за имена на места?';
$ec_lang['lpn_search_consent_4']='Ако откажете, всичко останало на тази страница продължава да работи точно както сега, включително „Отиди на географска ширина и дължина“. Запомняме съгласие, за да не питаме отново. Отказ изобщо не се съхранява.';
$ec_lang['lpn_search_refused']='Търсенето по име на място е изключено и нищо не е изпратено. Командата Отиди на географска ширина и дължина все още работи.';
$ec_lang['lpn_search_prompt']='Търсете място по име. Град, улица, забележителност — например: Petaluma, California';
$ec_lang['lpn_search_empty']='Въведете име на място за търсене.';
$ec_lang['lpn_search_working']='Търсене…';
$ec_lang['lpn_search_busy']='Вече тече търсене. Изчакайте да приключи.';
$ec_lang['lpn_search_choose']='Открити са няколко съвпадащи места. Кое от тях?';
$ec_lang['lpn_search_nochoice']='Нищо не бе избрано, затова картата не се премести.';
$ec_lang['lpn_search_badchoice']='Това не е едно от числата в списъка.';
$ec_lang['lpn_search_none']='Нищо не бе намерено за това име.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Услугата за имена на места е ограничила честотата на заявките. Изчакайте минута и опитайте отново.';
$ec_lang['lpn_search_http']='Услугата за имена на места отговори с грешка.';
$ec_lang['lpn_search_timeout']='Услугата за имена на места не отговори навреме. Всичко останало на тази страница работи без нея.';
$ec_lang['lpn_search_unreadable']='Услугата за имена на места върна отговор, който тази страница не можа да прочете.';
$ec_lang['lpn_search_offline']='Не успяхме да се свържем с услугата за имена на места. Възможно е да сте офлайн. Всичко останало на тази страница работи без нея, включително „Отиди на географска ширина и дължина“.';
$ec_lang['lpn_search_toofast']='Услугата за имена на места позволява едно търсене в секунда. Опитайте отново след малко.';
$ec_lang['lpn_search_nofetch']='Този браузър не може да се свърже с услугата за имена на места.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox го съставя от много обществени набори от данни за коти, затова точността му зависи от местоположението. Където съществува национално lidar заснемане, като USGS 3DEP в голяма част от Съединените щати и еквивалентите му другаде, може да бъде по-добра от 1 m хоризонтално и няколко десети от метъра вертикално. Където съществуват само глобални данни, е около 30 m хоризонтално и няколко метра вертикално. Mapbox не съобщава кой източник се прилага. Приемайте го като карта с хоризонтали, а не като геодезическо заснемане, и проверявайте всяка стойност, от която зависи проектът.';
$ec_lang['lpn_terrain_consent_1']='Попълването на коти изпраща позицията на всеки възел, който се нуждае от такава — географската му ширина и дължина — до api.mapbox.com, за да се потърси височината на терена там.';
$ec_lang['lpn_terrain_consent_2']='Това е различен въпрос от изображенията на картата зад проекта ви. Изображенията показват само къде гледате. Тези позиции са самата ви мрежа. Mapbox ще получи тези координати и вашия IP адрес. Не изпращаме нищо друго: нито име, нито тръби, нито проект. Не пазим запис за това и нищо не се съхранява на това устройство освен отговора ви на този въпрос.';
$ec_lang['lpn_terrain_consent_3']='Разрешавате ли да изпращаме позициите на възлите ви към Mapbox?';
$ec_lang['lpn_terrain_consent_4']='Ако откажете, всичко останало на тази страница продължава да работи точно както сега, а вие можете сами да въвеждате коти, както преди. Запомняме съгласие, за да не питаме отново. Отказ изобщо не се съхранява.';
$ec_lang['lpn_terrain_refused']='Котите не бяха попълнени и нищо не е изпратено. Могат да се въведат ръчно, както преди.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Да се попълни ли котата на {n} възел(а) от Mapbox DEM?';
$ec_lang['lpn_terrain_confirm_default_1']='Всеки възел вече има кота, а {n} от тях все още са на {v} — котата, с която започва нов възел, а не такава, която сте въвели вие.';
$ec_lang['lpn_terrain_confirm_default_2']='Да се заменят ли котите на тези възли ({n}) със стойности от Mapbox DEM?';
$ec_lang['lpn_terrain_keep']='{k} възел(а) вече имат кота и няма да бъдат променени.';
$ec_lang['lpn_terrain_undo']='Едно Undo (Ctrl-Z) връща всички тях обратно.';
$ec_lang['lpn_terrain_requests']='{n} заявка(и) до api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Котите вече се попълват. Изчакайте да приключи.';
$ec_lang['lpn_terrain_offmap']='Тези позиции на възли не са върху картата на терена, затова нищо не бе изпратено.';
$ec_lang['lpn_terrain_too_wide']='Тези възли обхващат твърде голяма част от Земята, за да бъдат прочетени с една операция ({n} заявки за плочки). Нищо не е изпратено.';
$ec_lang['lpn_terrain_cancelled']='Нищо не бе променено и нищо не бе изпратено.';
$ec_lang['lpn_terrain_nofetch']='Този браузър не може да се свърже с услугата за терен.';
$ec_lang['lpn_terrain_working']='Четене на повърхността на терена…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Услугата за терен отказа заявката ({status}), затова нито една кота не бе променена. Възможно е Mapbox токенът, който този сайт използва, да не позволява уеб адреса, на който сте.';
$ec_lang['lpn_terrain_failed']='Не успяхме да се свържем с услугата за терен, затова нито една кота не бе променена. Възможно е да сте офлайн. Всичко останало на тази страница работи без нея.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Услугата за терен е ограничила честотата на заявките (429), затова нито една кота не е променена. Опитайте отново след минута.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Услугата за терен отговори с грешка ({status}), затова нито една кота не бе променена. С мрежата ви няма нищо нередно.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Никой от тези възли няма позиция на Земята, затова нищо не бе изпратено и нито една кота не бе променена. Четенето на земната повърхност изисква проект в географска ширина и дължина, или такъв в проекция, която тази страница може да постави.';
$ec_lang['lpn_terrain_done']='{n} кота(и) попълнени.';
$ec_lang['lpn_terrain_missed']='{m} не можаха да бъдат прочетени и все още са празни.';
$ec_lang['lpn_terrain_partial']='{f} плочка(и) на терена не отговориха.';
$ec_lang['lpn_terrain_will_ids']='Тези възли ще получат кота: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Тези възли са: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Тези възли получиха кота: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Тези възли все още нямат кота: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids} и още {n}';

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
$ec_lang['lpn_analyze_menu']='Анализ';
$ec_lang['lpn_analyze_menu_tip']='Анализи, които изчисляват мрежата върху копие: противопожарно водно количество във всеки възел, загубата на всяка тръба, помпа и вентил, и потребностите, мащабирани нагоре или надолу.';
$ec_lang['lpn_ff_menu']='Анализ на противопожарно водно количество…';
$ec_lang['lpn_ff_menu_tip']='Изпитва всеки избран възел за противопожарно водно количество и проверява въздействието върху останалата част от системата';
$ec_lang['lpn_ff_title']='Противопожарно водно количество: анализ';
$ec_lang['lpn_ff_intro']='От всеки възел поред се тегли противопожарно водно количество върху съществуващата му потребност. Изчислението използва копие на мрежата за времевата стъпка на екрана, така че нищо в проекта не се променя.\n\nПротивопожарното водно количество обикновено се изпитва при потребността в максималния ден, затова първо задайте мрежата на това състояние.\n\nВсеки изпитван възел отнема около 16 решения на цялата мрежа, така че голяма система отнема минути: изберете възлите, преди да изчислите, и спрете по всяко време, за да запазите частичните резултати.';
$ec_lang['lpn_ff_scope']='Възли за изпитване';
$ec_lang['lpn_ff_all']='Всички възли';
$ec_lang['lpn_ff_selected']='Избраните възли';
$ec_lang['lpn_ff_no_junctions']='Този проект все още няма възли, затова няма какво да се изпитва.';
$ec_lang['lpn_ff_no_selection']='Не е избран възел. Изберете възли или изберете опцията Всички.';
$ec_lang['lpn_ff_skipped']='{n} избрани елемента не са възли, затова не бяха изпитани.';
$ec_lang['lpn_ff_required']='Изисквано противопожарно водно количество';
$ec_lang['lpn_ff_required_tip']='Водното количество, изисквано на хидрант от приложимия противопожарен нормативен акт или противопожарен орган. Всеки възел се изпитва спрямо тази стойност, освен ако за него не е въведено изисквано противопожарно водно количество.';
$ec_lang['lpn_ff_required_own']='Възлите с индивидуално изисквано противопожарно водно количество се изпитват спрямо него вместо това. Брой: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Противопожарното водно количество, изисквано в този възел за начина на ползване на земята, който обслужва, съгласно приложимия противопожарен нормативен акт или противопожарен орган. Оставете празно, за да се изпита възелът спрямо стойността в полето Противопожарно водно количество: анализ.';
$ec_lang['lpn_ff_residual']='Остатъчно налягане за поддържане';
$ec_lang['lpn_ff_residual_tip']='Налягането, което възелът трябва все още да поддържа, докато доставя противопожарното водно количество. AWWA M31 и NFPA 291 използват 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Проектна проверка (ефект върху системата)';
$ec_lang['lpn_ff_design_tip']='Отделен въпрос от това дали възелът може да достави водното количество: докато то се тегли там, пада ли нещо друго под минималното си налягане или превишава ли ограничението си за скорост? Включването на тази проверка не струва допълнително изчисление.';
$ec_lang['lpn_ff_design_off']='Няма';
$ec_lang['lpn_ff_design_all']='Всички';
$ec_lang['lpn_ff_design_selected']='Избрани';
$ec_lang['lpn_ff_design_no_selection']='Обхватът на проектната проверка е зададен на Избрани, но не са избрани елементи. Изберете елементи на картата или изберете Всички.';
$ec_lang['lpn_ff_minpressure']='Най-ниско допустимо налягане другаде';
$ec_lang['lpn_ff_minpressure_tip']='Възел, който пада под тази стойност, докато друг тегли своето противопожарно водно количество, се отчита като проектен проблем.';
$ec_lang['lpn_ff_maxvelocity']='Най-висока допустима скорост';
$ec_lang['lpn_ff_maxvelocity_tip']='Тръба, работеща над тази стойност, докато се тегли противопожарно водно количество, се отчита като проектен проблем.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Налягането се моделира в самия възел, обичайният метод. Хидрантът, неговото отклонение и дюзата му не се моделират, а налягането при дюзата е по-малко от това във възела.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Използва се вграденият решаващ модул.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Използва се решаващият модул на EPANET.';
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
$ec_lang['lpn_ff_run_title']='Изчисление на противопожарно водно количество';
$ec_lang['lpn_ff_calculate']='Изчисли';
$ec_lang['lpn_ff_stop']='Спри';
$ec_lang['lpn_ff_working']='Работи: {done} от {total} възела.';
$ec_lang['lpn_ff_stopped']='Спряно след {done} от {total} възела. Резултатите по-долу са само вече завършените.';
$ec_lang['lpn_ff_cost']='Това изчисление реши цялата мрежа {solves} пъти.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Чертежът се промени, затова резултатите за противопожарното водно количество бяха изчистени. Изчислете отново.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Изчисти пръстените';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} възела преминаха всички проверки. {fire} възела не издържаха противопожарното водно количество. {design} възела повлияха на останалата част от системата.';
$ec_lang['lpn_ff_summary_error']='Възли, които не можаха да бъдат изчислени ({n}).';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Всеки изпитан възел';
$ec_lang['lpn_ff_col_junction']='Възел';
$ec_lang['lpn_ff_col_static']='Статично налягане';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='Налягането в този възел, преди да е изтеглено каквото и да е противопожарно водно количество, докато обичайните потребности на системата все още работят. Нищо не се спира, за да се измери, затова това не е налягане при нулево водно количество за системата; то е същото налягане, което картата показва в този възел. И AWWA M31, и NFPA 291 наричат това отчитане статично налягане, и то е мястото, откъдето започва изпитването на противопожарно водно количество.';
$ec_lang['lpn_ff_col_available']='Налично количество';
$ec_lang['lpn_ff_col_required']='Изисквано количество';
$ec_lang['lpn_ff_col_residual']='Задържано остатъчно';
$ec_lang['lpn_ff_col_atrequired']='Налягане при изисквано количество';
$ec_lang['lpn_ff_col_affected']='Най-лош ефект';
$ec_lang['lpn_ff_col_limit']='Проектна граница';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Непроверено';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Статичното не издържа, затова не е проверено';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Видове отказ';
$ec_lang['lpn_ff_mode_fire']='Пожар';
$ec_lang['lpn_ff_mode_design']='Проект';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Няма';
$ec_lang['lpn_ff_col_solves']='Изчисления';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Налягане и скорост';
$ec_lang['lpn_ff_atleast']='повече от {flow}';
$ec_lang['lpn_ff_affect_node']='{id} пада до {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} достига {velocity}';
$ec_lang['lpn_ff_more']='и още {n} засегнати';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='{n} допълнителни възела не са показани.';
$ec_lang['lpn_ff_rows_more_links']='Непоказани връзки: {n}.';
$ec_lang['lpn_ff_design_none']='Когато противопожарното водно количество на всеки изпитван възел се тегли поред, нищо в обхвата на проектната проверка не излезе извън границите си.';
$ec_lang['lpn_ff_design_off_note']='Ефектът върху останалата част от системата не бе проверен в това изчисление.';
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
$ec_lang['lpn_ff_iso']='Службата за застрахователни услуги (Insurance Services Office, ISO) признава на един хидрант най-много {flow}. Тази граница не се прилага тук, защото един възел може да представлява повече от един хидрант.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Вече под остатъчното налягане, преди да е изтеглено каквото и да е противопожарно водно количество';
$ec_lang['lpn_ff_err_converge']='Мрежата не се сходи.';
$ec_lang['lpn_ff_err_solve']='Решаващият модул отчете грешка и не даде отговор.';
$ec_lang['lpn_ff_err_not_junction']='Не е възел';
$ec_lang['lpn_ff_err_unknown']='Няма резултат. Код на грешката: {code}';

// ---- Water > Criticality analysis (Tom, 2026-09-30) -------------------------------------------
//
// Break each asset in turn, on a copy, and report what the system loses. "Criticality analysis" is
// the industry's term (WaterGEMS, InfoWater); EPANET has no such tool and no word for it. The run
// dialog, Run, Stop, the engine sentence and the cost line are fire flow's own keys.
//
// {n}, {done} and {total} are whole numbers; {pressure} is a pressure with its unit.
$ec_lang['lpn_crit_menu']='Анализ на критичността…';
$ec_lang['lpn_crit_menu_tip']='Изважда поред всяка тръба, помпа и вентил от мрежата и показва въздействието върху системата.';
$ec_lang['lpn_crit_title']='Критичност: анализ';
$ec_lang['lpn_crit_intro']='Всеки обект се изважда поред от мрежата, а мрежата се решава за времевата стъпка на екрана в активния сценарий. Нищо в проекта не се променя; цялото изчисление се прави върху копие.';
$ec_lang['lpn_crit_scope']='Връзки за прекъсване';
$ec_lang['lpn_crit_scope_tip']='Всички тръби, помпи и вентили, или само тези, избрани на картата. Изберете набора, преди да пуснете изчислението.';
$ec_lang['lpn_crit_scope_all']='Всички връзки';
$ec_lang['lpn_crit_scope_selected']='Избрани връзки';
$ec_lang['lpn_crit_minpressure']='Най-ниско допустимо налягане';
$ec_lang['lpn_crit_minpressure_tip']='Това е същото число като Най-ниско допустимо налягане другаде в Противопожарно водно количество: анализ. Промяната му тук го променя и там.';
$ec_lang['lpn_crit_col_asset']='Обект';
$ec_lang['lpn_crit_col_unserved']='Неудовлетворена потребност';
$ec_lang['lpn_crit_col_cutoff']='Откъснати възли';
$ec_lang['lpn_crit_col_below']='Възли под минимума';
$ec_lang['lpn_crit_summary']='Обекти, които оставят потребност неудовлетворена или свалят възел под {pressure} ({n} от {total}).';
$ec_lang['lpn_crit_baseline_below']='Възли, които вече са под него без нищо прекъснато: {n}. Те не се броят.';
$ec_lang['lpn_crit_working']='Работи: {done} от {total} обекта.';
$ec_lang['lpn_crit_stopped']='Спряно след {done} от {total} обекта. Резултатите по-долу са само вече завършените.';
$ec_lang['lpn_crit_no_selection']='Не са избрани връзки. Изберете връзки или изберете Всички връзки.';
$ec_lang['lpn_crit_no_links']='Този проект все още няма връзки, затова няма какво да се прекъсва.';
$ec_lang['lpn_crit_busy']='Тече друг анализ. Спрете го или изчакайте да приключи.';
$ec_lang['lpn_crit_skipped']='{n} избрани елемента не са връзки, затова не бяха прекъснати.';
$ec_lang['lpn_crit_stale']='Чертежът се промени, затова резултатите от анализа на критичността бяха изчистени. Пуснете го отново.';
$ec_lang['lpn_crit_skipdead']='Пропусни задънените';
$ec_lang['lpn_crit_skipdead_tip']='Задънена връзка е такава, чието премахване откъсва възли, до които се стига само през нея, без резервоар или цистерна отвъд. Загубата й е всичко отвъд нея, затова тя не се решава. Обобщението казва колко са пропуснати.';
$ec_lang['lpn_crit_skipped_dead']='Пропуснати задънени връзки: {n}. Всяка от тях откъсва всичко отвъд себе си.';

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
$ec_lang['lpn_ds_menu']='Мащабиране на потребността…';
$ec_lang['lpn_ds_menu_tip']='Умножава потребностите върху копие на мрежата и показва налягането и скоростите, или намира най-големия мащаб на потребността, който системата може да понесе.';
$ec_lang['lpn_ds_title']='Мащабиране на потребността';
$ec_lang['lpn_ds_intro']='Натиснете бутона Изчисли, за да умножите потребностите в избраните възли по мащаба на потребността и да видите налягането и скоростите.\n\nНатиснете бутона Намери, за да намерите най-големия мащаб на потребността, с точност до {step}, при който всички тези възли запазват поне най-ниското допустимо налягане; търсенето е от 0 до {max}.\n\nИ двете работят върху копие на мрежата, решено за времевата стъпка на екрана в активния сценарий, така че нищо в проекта не се променя. Мащабира се само тази времева стъпка, а нивата и състоянията се вземат от нея; за да изпитате пика, преместете часовника на пиковата потребност, преди да изчислите.';
$ec_lang['lpn_ds_scope']='Възли за мащабиране';
$ec_lang['lpn_ds_head_scale']='Мащабиране на потребностите';
$ec_lang['lpn_ds_multiplier']='Мащаб на потребността';
$ec_lang['lpn_ds_multiplier_tip']='Коефициентът, по който се умножава всяка потребност; 1,5 е увеличение с 50%. Прилага се в допълнение към множителя на потребността на активния сценарий, който вече е в потребностите, и никога не се записва в проекта.';
$ec_lang['lpn_ds_head_search']='Какъв мащаб на потребността може да понесе системата?';
$ec_lang['lpn_ds_head_search_selected']='Какъв мащаб на потребността могат да понесат тези възли?';
$ec_lang['lpn_ds_outside_below']='При мащаб на потребността {m} неизбраните възли под {pressure}: {n} ({ids}). Те не ограничават този отговор.';
$ec_lang['lpn_ds_holds_max']='✓ Всеки възел запазва {pressure} до мащаб на потребността {max}, горната граница на търсенето.';
$ec_lang['lpn_ds_below_zero']='⚠ Поне един възел е под {pressure} дори когато мащабираните потребности са нула.';
$ec_lang['lpn_ds_found']='✓ Всеки проверен възел запазва най-малко {pressure} до мащаб на потребността {m}.';
$ec_lang['lpn_ds_found_below']='⚠ Потребностите, както са въведени (мащаб на потребността 1), оставят поне един възел под {pressure}. Най-големият мащаб на потребността, при който всеки възел остава на {pressure} или повече, е {m}.';
$ec_lang['lpn_ds_search_stopped']='Търсенето бе спряно, преди да намери отговор.';
$ec_lang['lpn_ds_lowest_at']='При мащаб на потребността {m} най-ниското налягане е {pressure}, във възел {id}.';
$ec_lang['lpn_ds_nosolve_at']='При мащаб на потребността {m} мрежата не даде резултат. {reason}';
$ec_lang['lpn_ds_scale_ok']='✓ При мащаб на потребността {m} всеки възел запазва {pressure}.';
$ec_lang['lpn_ds_scale_below']='⚠ При мащаб на потребността {m} възли под {pressure}: {n}.';
$ec_lang['lpn_ds_scaled_selected']='Мащабирани и проверени възли: {n}.';
$ec_lang['lpn_ds_head_lowest']='Най-ниски налягания';
$ec_lang['lpn_ds_head_velocity']='Най-високи скорости';
$ec_lang['lpn_ds_col_link']='Връзка';
$ec_lang['lpn_ds_col_scaled']='Мащабирано';
$ec_lang['lpn_ds_col_scaled_tip']='С потребности, умножени по мащаба на потребността.';
$ec_lang['lpn_ds_col_unscaled']='Немащабирано';
$ec_lang['lpn_ds_col_unscaled_tip']='С потребности, каквито са в активния сценарий на тази времева стъпка, същата стойност, която показва картата.';
$ec_lang['lpn_ds_no_junctions']='Този проект още няма възли, затова няма потребности за мащабиране.';
$ec_lang['lpn_ds_skipped']='Избрани елементи, които не са възли и са оставени както са: {n}.';
$ec_lang['lpn_ds_bad_multiplier']='Въведете мащаб на потребността нула или повече, например 1,5.';
$ec_lang['lpn_ds_stale']='Чертежът се промени, затова резултатите от мащабирането на потребността бяха изчистени. Изчислете отново.';
$ec_lang['lpn_analyze_at_time']='Времева стъпка: {time}.';
$ec_lang['lpn_analyze_time_moved']='⚠ Това е изчислено при {time}, а часовникът вече е на {now}. Изчислете отново за времевата стъпка на екрана.';

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
$ec_lang['lpn_file_import_survey']='Импортирай заснети точки…';
$ec_lang['lpn_file_import_survey_tip']='Чете списък от заснети точки от текстов файл и създава по един възел на всяка точка, като взема настройките за нови елементи за всичко, което файлът не посочва. Не се чертаят тръби, освен ако не отметнете Четене на описанието като полеви кодове, и нито един ред не отпада, без да бъде назован. Чете координатната система, която този проект вече използва, геопривързана или не.';
// GeoJSON import of Shapes (Task 779). Only points, lines and polygons come in, as Shapes; the
// network is imported from an EPANET file. Every feature not imported is named in the report.
$ec_lang['lpn_file_import_shapes']='Импортиране на фигури от GeoJSON…';
$ec_lang['lpn_file_import_shapes_tip']='Чете точките, линиите и многоъгълниците от файл GeoJSON в този проект като фигури. Елементите на мрежата във файла не се импортират; импортирайте мрежата от файл на EPANET или с Импортиране на мрежа от GeoJSON. Проектът трябва да е геопривързан или да има зададена координатна система.';
$ec_lang['lpn_file_import_gjnet']='Импортиране на мрежа от GeoJSON…';
$ec_lang['lpn_file_import_gjnet_tip']='Отваря файл GeoJSON като нов проект. Точките се импортират като възли, резервоари или цистерни, а линиите като тръби. Файл, експортиран от тази страница, се чете така, както е записан; за всеки друг файл една стъпка свързва полетата му със свойства и единици.';
$ec_lang['lpn_gjnet_refuse_crs']='{file} задава координатната система {crs}. Позициите в GeoJSON са географска ширина и дължина по WGS 84 (RFC 7946), а тази страница не преобразува файл GeoJSON от друга система. Експортирайте слоя от ГИС в EPSG:4326 (WGS 84), след което импортирайте този файл.';
$ec_lang['lpn_gjnet_refuse_empty']='{file} не съдържа точки или линии.';
$ec_lang['lpn_gjnet_target_node_type']='Вид възел';
$ec_lang['lpn_gjnet_target_custom']='Свое свойство';
$ec_lang['lpn_gjnet_target_skip']='Не импортирай';
$ec_lang['lpn_gjnet_points_heading']='Полета на точките (възли, резервоари и цистерни)';
$ec_lang['lpn_gjnet_lines_heading']='Полета на линиите (тръби)';
$ec_lang['lpn_gjnet_no_fields']='Тези обекти нямат полета с атрибути.';
$ec_lang['lpn_gjnet_col_field']='Поле';
$ec_lang['lpn_gjnet_col_example']='Пример';
$ec_lang['lpn_gjnet_col_fills']='Попълва';
$ec_lang['lpn_gjnet_col_unit']='Единица';
$ec_lang['lpn_gjnet_beta']='Бета: търсят се отзиви';
$ec_lang['lpn_gjnet_beta_tip']='Този импорт е изпробван върху малко файлове от ГИС програми. За да съобщите за проблем или да предложите промяна, натиснете {button} на страницата и опишете файла.';
$ec_lang['lpn_gjnet_intro']='Намерени са точки ({points}) и линии ({lines}). Точките се импортират като възли, резервоари или цистерни, а линиите като тръби. Изберете свойството, което попълва всяко поле, и единицата на всяко число.';
$ec_lang['lpn_gjnet_other']='Обекти ({n}) не са нито точки, нито линии и няма да бъдат импортирани; отчетът ги изброява.';
$ec_lang['lpn_gjnet_tolerance']='Допуск за свързване (m)';
$ec_lang['lpn_gjnet_tolerance_tip']='Край на линия на това разстояние от точка или от друг край на линия се свързва с нея. Край на линия, по-далеч от това разстояние от всяка точка, получава нов възел.';
$ec_lang['lpn_gjnet_working']='Импортира се {file}…';
$ec_lang['lpn_gjnet_title']='Импортиране на мрежа от GeoJSON: {file}';
$ec_lang['lpn_gjnet_report_lead']='Всяка промяна, направена при импортирането, и всеки неимпортиран обект са изброени по-долу с причината:';
$ec_lang['lpn_gjnet_and_more']='и още {n}';
$ec_lang['lpn_gjnet_note_crs']='Файлът задава координатната система {crs}, която е географска ширина и дължина по WGS 84, системата, изисквана от RFC 7946. Позициите са прочетени така, както са зададени.';
$ec_lang['lpn_gjnet_note_crs_nad83']='Файлът задава NAD83 (EPSG:4269). Позициите му са прочетени като WGS 84, което ги поставя на около 1 до 2 m от мястото, където ги поставя NAD83.';
$ec_lang['lpn_gjnet_note_skip_geometry']='Не е импортиран: обектът не е точка или линия.';
$ec_lang['lpn_gjnet_note_skip_kind']='Не е импортиран: обектът не задава node_type или link_type.';
$ec_lang['lpn_gjnet_note_skip_position']='Не е импортиран: позиция не е валидна географска ширина и дължина.';
$ec_lang['lpn_gjnet_note_skip_id']='Не е импортиран: името не е валидно ID или друг елемент от същия вид го има.';
$ec_lang['lpn_gjnet_note_skip_no_node']='Не е импортиран: началният или крайният възел, който е посочен, не е във файла.';
$ec_lang['lpn_gjnet_note_skip_loop']='Не е импортиран: двата края на линията се свързват със същия възел.';
$ec_lang['lpn_gjnet_note_id_new']='Тези обекти не задават валидно ID и им е присвоено ID, показано в скоби.';
$ec_lang['lpn_gjnet_note_id_dup']='Тези ID са зададени от повече от един обект от същия вид. На всеки по-късен обект е присвоено ID, показано в скоби.';
$ec_lang['lpn_gjnet_note_unmapped_id_point']='Не е избрано поле за ID на точката, затова на всеки възел, импортиран от точка, е присвоено ID.';
$ec_lang['lpn_gjnet_note_unmapped_id_line']='Не е избрано поле за ID на линията, затова на всяка тръба е присвоено ID.';
$ec_lang['lpn_gjnet_note_skip_short']='Не е импортиран: линията се нуждае от поне две позиции.';
$ec_lang['lpn_gjnet_note_elev_taken']='Тези възли не задават кота. На всеки е дадена котата на възела, показан в скоби: за възел, добавен в край на линия, възелът в другия край на тръбата му, а иначе най-близкият възел, който задава такава.';
$ec_lang['lpn_gjnet_note_default_elev_added']='Тези възли са добавени в краища на линии и имат котата по подразбиране, {value}, защото никой възел във файла не задава кота.';
$ec_lang['lpn_gjnet_note_demand_kept']='Резервоар или цистерна няма потребност, затова потребността, зададена за тези възли, е запазена като свое свойство {key}.';
$ec_lang['lpn_gjnet_note_parts']='Тези линии от няколко части имат части, които не са свързани, и са импортирани като по една тръба за всяка част.';
$ec_lang['lpn_gjnet_note_parts_points']='Тези обекти от няколко точки са импортирани като по един възел за всяка точка.';
$ec_lang['lpn_gjnet_note_junction_added']='Тези възли са добавени там, където край на линия не е на разстояние {tol} от точка. Всеки има основната потребност по подразбиране.';
$ec_lang['lpn_gjnet_note_end_moved']='Тези тръби имат край на разстояние {tol} от точка или от друг край на линия, но не върху нея. Краят е свързан с нея; най-голямото разстояние е {dist}.';
$ec_lang['lpn_gjnet_note_end_on_pipe']='Тези краища на линии лежат върху тръбата, показана в скоби, но не в края ѝ, и не са свързани с нея.';
$ec_lang['lpn_gjnet_note_z']='Тези точки задават трета координата, която не е импортирана.';
$ec_lang['lpn_gjnet_note_default_elev']='Тези възли не задават кота и имат котата по подразбиране, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_elev']='Не е избрано поле за котата, затова всеки възел има котата по подразбиране, {value}, а автоматичните дължини не включват разлика в котите.';
$ec_lang['lpn_gjnet_note_default_demand']='Тези възли не задават основна потребност и имат основната потребност по подразбиране, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_demand']='Не е избрано поле за основната потребност, затова всеки възел има основната потребност по подразбиране, {value}.';
$ec_lang['lpn_gjnet_note_default_diameter']='Тези тръби не задават диаметър и имат диаметъра по подразбиране, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_diameter']='Не е избрано поле за диаметъра, затова всяка тръба има диаметъра по подразбиране, {value}.';
$ec_lang['lpn_gjnet_note_default_roughness']='Тези тръби не задават грапавост и имат грапавостта по подразбиране, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_roughness']='Не е избрано поле за грапавостта, затова всяка тръба има грапавостта по подразбиране, {value}.';
$ec_lang['lpn_gjnet_note_default_k']='Тези тръби не задават коефициент на местна (локална) загуба, затова всяка има 0, както във файл на EPANET, който не задава такъв.';
$ec_lang['lpn_gjnet_note_unmapped_k']='Не е избрано поле за коефициента на местна (локална) загуба, затова всяка тръба има 0, както във файл на EPANET, който не задава такъв.';
$ec_lang['lpn_gjnet_note_default_tank']='Тези цистерни имат водните дълбочини и диаметъра на цистерната по подразбиране.';
$ec_lang['lpn_gjnet_note_length_auto']='Тези тръби не задават дължина. Всяка дължина се изчислява от линията (Автоматично).';
$ec_lang['lpn_gjnet_note_unmapped_length']='Не е избрано поле за дължината, затова всяка дължина на тръба се изчислява от линията (Автоматично).';
$ec_lang['lpn_gjnet_note_value_unread']='Тези стойности не са числа или не са разпознати и не са използвани.';
$ec_lang['lpn_gjnet_note_field_skipped']='Тези полета не са импортирани, както е избрано.';
$ec_lang['lpn_gjnet_note_field_custom']='Тези полета са импортирани като свои свойства.';
$ec_lang['lpn_gjnet_note_results']='Резултатите във файла не са импортирани. Бутонът Изчисли ги изчислява отново.';
$ec_lang['lpn_gjnet_note_demand_rows']='Тези възли са имали повече от един ред с потребност. Файлът GeoJSON държи само първия, който е импортиран.';
$ec_lang['lpn_gjnet_note_pipe_type']='Тези тръби задават вида тръба, показан в скоби, чието определение файлът GeoJSON не държи. Видът тръба не е импортиран; диаметърът и грапавостта, зададени във файла, са импортирани.';
$ec_lang['lpn_gjnet_note_pattern_conflict']='Тези графици са зададени с различни множители в различни обекти. Използван е първият.';
$ec_lang['lpn_gjnet_note_end_off_node']='Линията на всяка от тези връзки не започва или не завършва във възела си. Използвано е положението на възела.';
$ec_lang['lpn_gjnet_note_not_held']='Файлът GeoJSON не държи управления, правила, настройки на времето, текстови етикети, опции на EPANET, нито библиотеките с вид тръба, фитинги и крива на ефективност, затова нищо от това не е импортирано.';
$ec_lang['lpn_geojson_import_done']='Импортирани са {n} фигури от {file}.';
$ec_lang['lpn_geojson_import_done_one']='Импортирана е една фигура от {file}.';
$ec_lang['lpn_geojson_import_renamed']='{n} имена на обекти не могат да се ползват като идентификатори на фигури. На всяка фигура е даден друг идентификатор и тя запазва името на обекта: {list}.';
$ec_lang['lpn_geojson_import_renamed_one']='Едно име на обект не може да се ползва като идентификатор на фигура. На фигурата е даден друг идентификатор и тя запазва името на обекта: {list}.';
$ec_lang['lpn_geojson_import_skipped']='{n} обекта не са импортирани: {list}.';
$ec_lang['lpn_geojson_import_skipped_one']='Един обект не е импортиран: {list}.';
$ec_lang['lpn_geojson_import_why_network']='елемент на мрежата';
$ec_lang['lpn_geojson_import_why_geometry']='не е точка, линия или многоъгълник';
$ec_lang['lpn_geojson_import_why_position']='положението не е валидна географска ширина и дължина';
$ec_lang['lpn_geojson_import_holes']='{n} отвора на многоъгълници не са импортирани. Фигурата има една граница.';
$ec_lang['lpn_geojson_import_holes_one']='Един отвор на многоъгълник не е импортиран. Фигурата има една граница.';
$ec_lang['lpn_geojson_import_parts']='{n} съставни обекта са импортирани като по една фигура за всяка част.';
$ec_lang['lpn_geojson_import_parts_one']='Един съставен обект е импортиран като по една фигура за всяка част.';
$ec_lang['lpn_geojson_import_local']='Положенията в GeoJSON са географска ширина и дължина, а този проект няма място на Земята, в което да бъдат преобразувани. Първо го геопривържете чрез Карта, Карта на света, Прикачи, после импортирайте отново.';
$ec_lang['lpn_geojson_import_unreadable']='{file} не е файл GeoJSON: {detail}';
$ec_lang['lpn_file_import_dxf']='Импортиране на фигури от DXF…';
$ec_lang['lpn_file_import_dxf_tip']='Чете точките, линиите и полилиниите от ASCII файл DXF в този проект като фигури, като името на всеки слой се запазва като свойство. Другите обекти се преброяват и изброяват, но не се импортират. Координатите се четат като X и Y на този проект, без преобразуване.';
$ec_lang['lpn_file_import_shp']='Импортиране на фигури от shapefile…';
$ec_lang['lpn_file_import_shp_tip']='Чете точките, линиите и многоъгълниците от ESRI shapefile в този проект като фигури, като колоните с атрибути се запазват като свойства. Изберете или .zip, или .shp заедно с неговите .shx, .dbf и .prj (задръжте Ctrl или Shift, за да изберете няколко). Координати в координатна система, различна от тази на проекта, се преобразуват, и съобщението го посочва.';
$ec_lang['lpn_dxf_import_skipped']='{n} обекта не са импортирани: {list}.';
$ec_lang['lpn_dxf_import_skipped_one']='Един обект не е импортиран: {list}.';
$ec_lang['lpn_dxf_import_inblocks']='в дефиниции на блокове';
$ec_lang['lpn_dxf_import_bulge']='{n} полилинии имат дъгови сегменти, които са импортирани като прави сегменти между върховете им.';
$ec_lang['lpn_dxf_import_bulge_one']='Една полилиния има дъгови сегменти, които са импортирани като прави сегменти между върховете ѝ.';
$ec_lang['lpn_dxf_import_units']='Чертежът посочва мерните си единици като {theirs}, а този проект използва {ours}. Числата не са променени.';
$ec_lang['lpn_dxf_import_refuse_geo']='Чертежът DXF е равнинен, а този проект е в географска ширина и дължина, затова координатите на {file} нямат място в него. Използвайте Преобразувай като…, за да копирате проекта в координатна система, после импортирайте отново.';
$ec_lang['lpn_dxf_import_unreadable']='{file} не е ASCII файл DXF.';
$ec_lang['lpn_dxf_import_binary']='{file} е двоичен DXF. Запишете го от вашата CAD програма като ASCII DXF, после импортирайте отново.';
$ec_lang['lpn_shapes_import_frame']='Координатите са прочетени като {frame}, без преобразуване.';
$ec_lang['lpn_shapes_frame_xy']='X и Y на този проект';
$ec_lang['lpn_shapes_frame_latlon']='географска ширина и дължина';
$ec_lang['lpn_shp_import_skipped']='{n} записа не са импортирани, защото типът им фигура не се чете: {list}.';
$ec_lang['lpn_shp_import_skipped_one']='Един запис не е импортиран, защото типът му фигура не се чете: {list}.';
$ec_lang['lpn_shp_import_attrs']='Колоните с атрибути, запазени като свойства на всяка фигура: {list}.';
$ec_lang['lpn_shp_import_noprj']='Няма файл .prj, затова координатите са прочетени като {frame}, без преобразуване.';
$ec_lang['lpn_shp_import_prj_same']='Файлът .prj посочва {crs}, координатната система на този проект, затова координатите не са променени.';
$ec_lang['lpn_shp_import_converted']='Координатите са географска ширина и дължина. Те са преобразувани в {crs} чрез трансформацията, която използва картата.';
$ec_lang['lpn_shp_import_prj_other']='Файлът .prj посочва {theirs}. Този проект няма зададена координатна система, затова координатите са прочетени като {frame}, без преобразуване.';
$ec_lang['lpn_shp_import_refuse_local']='{file} е в географска ширина и дължина, а този проект няма място на Земята, в което да бъдат преобразувани. Първо го геопривържете чрез Карта, Карта на света, Прикачи, после импортирайте отново.';
$ec_lang['lpn_shp_import_refuse_crs']='{file} посочва {theirs}, а този проект е в {ours}. Нищо не е импортирано и нищо не е преобразувано.';
$ec_lang['lpn_shp_import_refuse_range']='{file} няма файл .prj, а координатите му не са географски ширини и дължини, затова не могат да бъдат поставени в този проект.';
$ec_lang['lpn_shp_import_noshp']='{file} не съдържа файл .shp. Изберете или .zip на shapefile, или .shp заедно с неговите .shx, .dbf и .prj (задръжте Ctrl или Shift, за да изберете няколко).';
$ec_lang['lpn_shp_import_manyshp']='{file} съдържа повече от един shapefile. Импортирайте по един.';
$ec_lang['lpn_shp_import_unreadable']='{file} не е shapefile, който тази страница може да прочете: {detail}';
$ec_lang['lpn_shp_import_pick_hint']='Shapefile се състои от няколко файла. Изберете .shp заедно с неговите .shx, .dbf и .prj (задръжте Ctrl или Shift, за да изберете няколко), или изберете .zip.';
$ec_lang['lpn_shp_import_webmerc_ask']='{file} няма файл .prj, а числата му не са географски ширини и дължини, но съответстват на метри в Web Mercator (EPSG:3857), системата, която ползват QGIS и уеб картите. Да се импортират ли като EPSG:3857 и да се преобразуват ли в този проект?';
$ec_lang['lpn_shp_import_webmerc_ok']='Импортиране като EPSG:3857';
$ec_lang['lpn_shp_import_webmerc_far_ask']='{file} посочва {theirs}, а прочетени в тази система, координатите му попадат на {km} km от този проект. Прочетени като метри в Web Mercator (EPSG:3857), системата, която ползват QGIS и уеб картите, те попадат там, където е този проект. Да се импортират ли като EPSG:3857 и да се преобразуват ли в този проект?';
$ec_lang['lpn_shp_import_reprojected']='Координатите са преобразувани от {theirs} в {ours}.';
$ec_lang['lpn_shp_import_unplaced']='{n} записа имат координати, които този проект не може да постави, например географска ширина извън границата на картата. Номера на записите: {list}.';
$ec_lang['lpn_shp_import_unplaced_one']='Един запис има координати, които този проект не може да постави, например географска ширина извън границата на картата. Номер на записа: {list}.';
$ec_lang['lpn_shapes_import_none']='Нищо не е импортирано от {file}.';
$ec_lang['lpn_shp_import_convert_hint']='Използвайте Преобразувай като…, за да копирате проекта в {theirs}, после импортирайте отново.';
$ec_lang['lpn_shp_import_damaged']='{file} е повреден или съкратен, затова нищо не е импортирано.';
$ec_lang['lpn_shp_import_deleted']='{n} записа, отбелязани като изтрити в .dbf, не са импортирани.';
$ec_lang['lpn_shp_import_deleted_one']='Един запис, отбелязан като изтрит в .dbf, не е импортиран.';
$ec_lang['lpn_dxf_import_paperspace']='в пространството на листа';
$ec_lang['lpn_shapes_import_more']='и още {n}';
$ec_lang['lpn_survey_read_error']='Този файл не можа да бъде прочетен от диска ви.';
$ec_lang['lpn_survey_cancelled']='Нищо не бе създадено и нищо не бе променено.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Този файл е празен.';
$ec_lang['lpn_survey_err_unreadable']='Този файл не можа да бъде прочетен като списък от заснети точки.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Повече от една колона в този файл биха могли да бъдат {axis} ({detail}), а тази страница няма да избира между тях. Оставете само една от тях назована като {axis} и опитайте отново.';
$ec_lang['lpn_survey_err_no_points']='Нито един ред от този файл не можа да бъде прочетен като заснета точка. Прочетени редове: {detail}';
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
$ec_lang['lpn_survey_format_label']='Формат на файла:';
$ec_lang['lpn_survey_format_internal']='зададен вътрешно';
$ec_lang['lpn_survey_create']='Създай възли';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='Първият ред бе пропуснат: не назовава колони, познати на тази страница.';
$ec_lang['lpn_survey_type_label']='Вид обект:';
$ec_lang['lpn_survey_confirm_junction']='Намерени {n} възел(а). Продължавам ли?';
$ec_lang['lpn_survey_confirm_reservoir']='Намерени {n} резервоар(а). Продължавам ли?';
$ec_lang['lpn_survey_confirm_tank']='Намерени {n} цистерна(и). Продължавам ли?';
$ec_lang['lpn_survey_report_junction']='Импортирани {n} възел(а), {m} с кота.';
$ec_lang['lpn_survey_report_reservoir']='Импортирани {n} резервоар(а), {m} с кота.';
$ec_lang['lpn_survey_report_tank']='Импортирани {n} цистерна(и), {m} с кота.';
$ec_lang['lpn_survey_report_clean']='Всяка точка от файла бе внесена без промяна.';
$ec_lang['lpn_survey_report_notes']='Грешки и бележки при импортиране:';
$ec_lang['lpn_survey_sev_error']='грешка';
$ec_lang['lpn_survey_sev_warning']='предупреждение';
$ec_lang['lpn_survey_note_line']='Ред {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Твърде малко колони за посочения по-горе формат на файла.';
$ec_lang['lpn_survey_note_coord_missing']='Клетката за {axis} е празна.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} не се разчита като число.';
$ec_lang['lpn_survey_note_coord_range']='{axis} е извън диапазона, който този проект допуска.';
$ec_lang['lpn_survey_note_bad_elev']='Нечислова кота. Импортирано без кота.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Повече от една колона биха могли да бъдат котата, затова нито една не бе прочетена.';
$ec_lang['lpn_survey_note_blank_rows']='Пропуснати празни редове: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Името вече е използвано по-рано в този файл, зададено е ново име.';
$ec_lang['lpn_survey_note_id_taken']='Името вече съществува в проекта, зададено е ново име.';
$ec_lang['lpn_survey_note_id_invalid']='Името не може да се използва тук, зададено е ново име.';
// Field codes (Task 771): the Description read as Carlson-style codes. See dev/survey-codes.md.
$ec_lang['lpn_survey_codes_toggle']='Четене на описанието като полеви кодове';
$ec_lang['lpn_survey_codes_tip']='Първата дума от всяко описание се чете като код от таблицата. Точките със същия код на линия се съединяват в една тръба в реда на файла, а WL1 и WL2 са отделни линии. +0 започва линия, -0 я завършва, а CLO я затваря. JPN, следван от име на точка, се съединява с тази точка (Carlson), а Civil 3D го записва като CPN.';
$ec_lang['lpn_survey_codes_col_code']='Код';
$ec_lang['lpn_survey_codes_col_type']='Вид елемент';
$ec_lang['lpn_survey_codes_add']='Добавяне на код';
$ec_lang['lpn_survey_codes_remove']='Премахване на код';
$ec_lang['lpn_survey_confirm_coded']='Намерени: възли {j}, резервоари {r}, цистерни {t} и тръби {p}. Да се продължи ли?';
$ec_lang['lpn_survey_report_coded']='Внесени: възли {j}, резервоари {r}, цистерни {t} и тръби {p}; {m} от възлите са с кота.';
$ec_lang['lpn_survey_note_code_unknown']='Кодът го няма в таблицата с кодове, внесен като вида елемент, избран по-горе.';
$ec_lang['lpn_survey_note_code_two_nodes']='Повече от един код на възел, използван е първият.';
$ec_lang['lpn_survey_note_code_unread']='Не всяка дума е код, който тази страница чете, затова е запазена в описанието.';
$ec_lang['lpn_survey_note_vertex_text']='Не всяка дума е код, който тази страница чете, а пречупната точка не пази описание.';
$ec_lang['lpn_survey_note_join_missing']='JPN или CPN посочва точка, която не е в този файл или проект, затова не е начертана тръба за нея.';
$ec_lang['lpn_survey_note_join_no_line']='JPN или CPN при точка без код на линия, затова не е начертана тръба за нея.';
$ec_lang['lpn_survey_note_pipe_one_node']='Тази линия се връща към същия възел без друг възел между тях, затова не е начертана тръба за нея.';
$ec_lang['lpn_survey_note_line_one_point']='Единствена точка на линията си, затова не е начертана тръба от нея.';
$ec_lang['lpn_survey_note_vertices']='Точки, които станаха пречупни точки на тръби: {detail}. Пречупната точка не пази име, кота или описание.';
$ec_lang['lpn_survey_note_no_desc']='Полевите кодове са включени, но този файл няма колона с описание, затова не бяха прочетени кодове.';
$ec_lang['lpn_survey_note_ring_junction']='Тази точка стана възел, за да може пръстенът да се затвори.';
$ec_lang['lpn_survey_note_pipe_zero_length']='Тази точка е на същото място като предишния възел, затова тръбата между тях няма дължина.';
$ec_lang['lpn_survey_note_node_on_pipe']='Тази точка лежи точно върху тръба, с която не е съединена. Ако са свързани, добавете JPN, за да го посочите.';
$ec_lang['lpn_settings_demand_model']='Модел на потребността';
$ec_lang['lpn_settings_demand_model_tip']='Изберете как възлите получават водно количество. При модела, зависим от потребността (DDA), всяка потребност се доставя изцяло, независимо от налягането. При модела, зависим от налягането (PDA), се доставя по-малко от потребността там, където налягането е под изискваното налягане, и само решаващият модул на EPANET го изчислява.';
$ec_lang['lpn_settings_demand_model_dda']='Зависим от потребността';
$ec_lang['lpn_settings_demand_model_pda']='Зависим от налягането';
$ec_lang['lpn_settings_min_pressure']='Минимално налягане';
$ec_lang['lpn_settings_min_pressure_tip']='Въведете налягането, при което и под което възелът не получава вода. Използвайте мерната единица за налягане на този проект.';
$ec_lang['lpn_settings_req_pressure']='Изисквано налягане';
$ec_lang['lpn_settings_req_pressure_tip']='Въведете налягането, при което и над което възелът получава пълната си потребност. То трябва да е по-голямо от минималното налягане. Използвайте мерната единица за налягане на този проект. Оставете празно, за да се използва стойността по подразбиране на EPANET, която е в psi за американските единици за водно количество и в метри в останалите случаи.';
$ec_lang['lpn_settings_pressure_exponent']='Показател на налягането';
$ec_lang['lpn_settings_pressure_exponent_tip']='Въведете показателя на кривата, която расте от нулево водно количество при минималното налягане до пълната потребност при изисквано налягане.';
$ec_lang['lpn_engine_pda_route']='Изчислено с решаващия модул на EPANET, защото моделът на потребността е зависим от налягането.';
$ec_lang['lpn_diag_pda_needs_epanet']='Моделът на потребността е зависим от налягането и само решаващият модул на EPANET може да го изчисли. Решаващият модул на EPANET не можа да бъде зареден, затова тези резултати липсват.';
$ec_lang['lpn_result_delivered_demand']='Доставена потребност';
$ec_lang['lpn_result_delivered_demand_tip']='Водното количество, което този възел действително получава при модела на потребността, зависим от налягането. То е по-малко от потребността, когато налягането е под изискваното налягане.';
$ec_lang['lpn_result_demand_deficit']='Недостиг на потребност';
$ec_lang['lpn_result_demand_deficit_tip']='Потребността в този възел, която не се доставя, защото налягането е под изискваното налягане.';
$ec_lang['lpn_pda_deficit_note']='Възли, получаващи по-малко от потребността си: {n}.';
$ec_lang['lpn_diag_pda_pressures']='Изискваното налягане трябва да е по-голямо от Минималното налягане. Променете едното в Настройки.';
$ec_lang['lpn_inp_drop_pressure_unit']='Този файл посочва мерна единица за налягане, различна от тази, която тази страница чете за единицата му за водно количество, а тя е psi за американските единици и метри в останалите случаи. Всяко налягане във файла се чете така, затова проверете настройките на вентилите, емитерите и ограниченията за модела, зависим от налягането. Редът е запазен и се записва обратно.';

// Map > Screenshot (Tom, 2026-10-05): a snipping tool that re-draws the dragged map area larger than its screen size (3x unless the Screenshot box says otherwise).
$ec_lang['lpn_screenshot_menu']='Снимка на екрана';
$ec_lang['lpn_screenshot_tip']='Направете снимка на областта от картата, която очертаете, с по-висока разделителна способност от екрана. Отбележете върху нея, после я копирайте в отчет с бутона Копирай. Щракнете без плъзгане, за да вземете цялата карта.';
$ec_lang['lpn_screenshot_hint']='Плъзнете правоъгълник върху картата или щракнете за цялата карта. Esc отказва.';
$ec_lang['lpn_screenshot_copied']='Снимката на екрана е копирана.';
$ec_lang['lpn_screenshot_saved']='Клипбордът не е достъпен тук, затова снимката на екрана бе изтеглена като PNG файл.';
$ec_lang['lpn_screenshot_no_basemap']='Уличната карта или сателитното изображение не можаха да бъдат включени.';
$ec_lang['lpn_screenshot_failed']='Снимката на екрана не можа да бъде направена.';
$ec_lang['lpn_snip_hint_free']='Плъзнете около областта за изрязване или щракнете за цялата карта. Esc отказва.';
$ec_lang['lpn_snip_tip_rect']='Изрязване на правоъгълник (S)';
$ec_lang['lpn_snip_tip_free']='Изрязване на свободна форма (S)';
$ec_lang['lpn_snip_tip_mode']='Форма на изрязване';
$ec_lang['lpn_snip_tip_map']='Снимка на екрана на цялата карта';
$ec_lang['lpn_snip_tip_pen']='Писалка';
$ec_lang['lpn_snip_tip_eraser']='Гумичка: щракнете върху щрих, за да го премахнете (E)';
$ec_lang['lpn_snip_tip_undo']='Отмяна (Ctrl+Z)';
$ec_lang['lpn_snip_tip_redo']='Повторение (Ctrl+Y)';
$ec_lang['lpn_snip_tip_copy']='Копиране (Ctrl+C)';
$ec_lang['lpn_screenshot_scale_tip']='Размерът на картината като кратно на областта на екрана. По-голямото е по-ясно и прави по-голям файл.';
