<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='частка';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/sec';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% підйом/довжина';
$ec_lang['u_grade']='підйом/довжина';
$ec_lang['u_in2']='кв. дюйм';
$ec_lang['u_inh2o']='in H2O';
$ec_lang['u_in']='in';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='л/с';
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
$ec_lang['u_bar']='бар';
$ec_lang['u_kgfcm2']='кгс/см²';
$ec_lang['u_s']='с';
$ec_lang['u_hr']='год';
$ec_lang['u_day']='дн';
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
$ec_lang['menu_brand']='Калькулятори HawsEDC';
$ec_lang['menu_main_hydraulics']='Гідравліка';
$ec_lang['menu_help']='Довідка';
$ec_lang['menu_libre']='Вільне ПЗ';
$ec_lang['template_welcome']='Залиш свої страхи за дверима; тут розмовляють мовою любові. Ти не все руйнуєш. Насолоджуйся також <a target="_blank" href="https://hawsedc.com/download.php">безкоштовними інструментами HawsEDC AutoCAD</a>.';
$ec_lang['template_feedback']='Чи можете ви запропонувати краще формулювання тексту на цій сторінці, чи щось інше? Хочете допомогти або навчитися створювати такі інструменти? Будь ласка, зв\'яжіться зі мною.';
$ec_lang['template_printable_title']='Заголовок для друку';
$ec_lang['template_printable_subtitle']='Підзаголовок для друку';
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
$ec_lang['consent_body']='Чи можемо ми зберегти у цьому браузері випадковий код, щоб підраховувати, скільки браузерів користується кожною частиною цього сайту? Код створюється на місці, нічого не говорить ні про вас, ні про ваш пристрій і не фіксує нічого з того, що ви вводите. Без нього ми не можемо відрізнити ваше друге відвідування від першого відвідування іншої людини.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Розраховує цю мережу на кожному гідравлічному часовому кроці.';
$ec_lang['consent_accept']='Прийняти цей запит';
$ec_lang['consent_accept_all']='Приймати завжди';
$ec_lang['consent_decline']='Відхиляти завжди';
$ec_lang['consent_current_granted']='Ви дозволили це. Цей браузер зберігає випадковий код, щоб ми могли його врахувати.';
$ec_lang['consent_current_denied']='Ви відхилили це. Ми нічого не зберігаємо, щоб обмежити реєстрацію відвідувань для цього профілю браузера.';
$ec_lang['consent_region_label']='Ваш вибір щодо коду для підрахунку.';
$ec_lang['consent_settings_link']='Налаштування файлів cookie';
$ec_lang['privacy_link']='Політика конфіденційності';
$ec_lang['terms_link']='Умови використання';
$ec_lang['index_main_title']='Безкоштовні онлайн-калькулятори для інженерів';
$ec_lang['index_meta_desc_plain']='Безкоштовні гідротехнічні калькулятори для труб, каналів, водозливів та зрошення. Працюють просто у браузері, навіть без інтернету, і доступні 27 мовами.';
$ec_lang['calc_set_units']='Встановити одиниці:';
$ec_lang['calc_set_units_tip']='Одразу встановлює одиницю кожного поля. Без руйнування: числа, які ви ввели, лишаються точно такими самими, лише кожне тепер читається в новій одиниці. 6 лишається 6, але тепер це 6 дюймів замість 6 міліметрів.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Скинути значення за замовчуванням';
$ec_lang['calc_defaults_confirm']='Скинути калькулятор до оригінальних значень за замовчуванням?';
$ec_lang['points_data_note']='(або Копіювати/Вставити через область даних)';
$ec_lang['points_data_heading']='Дані калькулятора<br />(щоб побачити формат, скористайтеся кнопкою «Копіювати»)';
$ec_lang['points_data_points_heading']='Дані точок<br />(щоб побачити формат, скористайтеся кнопкою «Копіювати»)';
$ec_lang['points_data_copy']='Копіювати';
$ec_lang['points_data_paste']='Вставити';
$ec_lang['points_data_msg_line']='Нічого не вставлено. Рядок {n} не вдалося прочитати як пікет і відмітку.';
$ec_lang['points_data_msg_none']='Нічого не вставлено. Пар «пікет і відмітка» не знайдено.';
$ec_lang['calc_inputs']='Вхідні дані';
$ec_lang['calc_results']='Результати';
$ec_lang['view_hide_line']='Сховати цей рядок';
$ec_lang['view_printable']='Версія для друку (перезавантажте для відновлення)';
$ec_lang['ec_name_label']='Збережіть цей розрахунок:';
$ec_lang['ec_name_placeholder']='Назва';
$ec_lang['ec_name_tip']='Зберігає ці вхідні дані у URL для створення закладки, отримання історії та спільного доступу';
$ec_lang['calc_copy_link']='Копіювати посилання';
$ec_lang['ec_related_calcs']='Пов\'язані калькулятори:';
$ec_lang['calc_copy_link_done']='Скопійовано!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Втрати напору в трубі за Darcy-Weisbach';
$ec_lang['dw_main_title']='Безкоштовний онлайн-калькулятор втрат напору в трубі за Darcy-Weisbach';
$ec_lang['dw_main_desc']='Втрати напору в трубі за Darcy-Weisbach при заданому діаметрі, шорсткості та витраті';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Абсолютна висота нерівностей (шорсткість) стінки труби, e. Типові значення: сталь (нова) 0,046 мм, сталь (уживана) 0,15 мм, HDPE 0,003 мм, PVC/uPVC 0,0015 мм, бетон 0,3–3 мм.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s для чистої води при 20°C">Кінематична в’язкість, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Кінематична в’язкість, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s для чистої води при 20°C';
$ec_lang['dw_reynolds_number']='Число Рейнольдса, Re';
$ec_lang['dw_flow_regime']='Режим течії';
$ec_lang['dw_regime_laminar']='ламінарний';
$ec_lang['dw_regime_transitional']='перехідний';
$ec_lang['dw_regime_turbulent']='турбулентний';
$ec_lang['dw_friction_factor_method']='Метод визначення коефіцієнта опору';
$ec_lang['dw_friction_factor']='Коефіцієнт опору, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Втрати напору в трубі за Hazen-Williams';
$ec_lang['hw_main_title']='Безкоштовний онлайн-калькулятор втрат напору в трубі за Hazen-Williams';
$ec_lang['hw_main_desc']='Втрати напору в трубі за Hazen-Williams при заданому діаметрі, шорсткості та витраті';
$ec_lang['hw_hgl_1']='П\'єзометрична лінія нижче за течією';
$ec_lang['hw_hgl_2']='П\'єзометрична лінія вище за течією';
$ec_lang['hw_elev_up']='Відмітка вище за течією';
$ec_lang['hw_pressure_up']='Тиск вище за течією';
$ec_lang['hw_elev_down']='Відмітка нижче за течією';
$ec_lang['hw_pressure_down']='Тиск нижче за течією';
$ec_lang['hw_pressure_check']='Перевірка тиску';
$ec_lang['hw_pressure_ok_short']='Додатний тиск';
$ec_lang['hw_pressure_neg_short']='Від\'ємний тиск';
$ec_lang['hw_pressure_neg']='Тиск нижче за течією нижчий за нуль. П\'єзометрична лінія опускається нижче труби, тому труба не буде текти повним перерізом, і цей результат може бути недійсним.';
$ec_lang['hw_roughness']='Коефіцієнт Hazen-Williams, C';
$ec_lang['hw_note_1']='<dl><dt>Цей калькулятор не моделює профіль труби між двома кінцями.</dt><dd>Він використовує лише введені вами відмітки вище та нижче за течією. Якщо десь між ними земля піднімається вище будь-якого з кінців, тиск у цій найвищій точці нижчий за будь-який тиск, наведений тут. Виконайте розрахунок ще раз для довжини від верхнього кінця до найвищої точки, щоб перевірити це.</dd><dd>Там, де п\'єзометрична лінія опускається нижче труби, вода перебуває під від\'ємним тиском. Повітря виділяється з розчину, тонкостінна труба може зруйнуватися, а забруднені підземні води можуть потрапляти через стики. Підтримуйте додатний тиск на всій лінії та розгляньте встановлення повітряного клапана в кожній найвищій точці.</dd><dt>Тиск вище за течією — це гранична умова, яку задаєте ви.</dt><dd>Візьміть його з манометра, з рівня води в резервуарі (висота води над трубою) або з напірної характеристики насоса. Насос створює менший тиск при зростанні витрати, тому використовуйте точку на характеристиці, що відповідає витраті, введеній вище.</dd><dt>Підсумуйте коефіцієнти місцевих втрат самостійно.</dt><dd>Додайте значення K для кожного клапана, коліна, трійника, лічильника та входу на лінії та введіть цю суму. Перейдіть за посиланням біля цього поля, щоб побачити типові значення. На довгому магістральному трубопроводі ці втрати малі порівняно з тертям, але в короткому трубопроводі станції вони можуть становити більшу частину втрат.</dd></dl>';
// Manning Irregular
$ec_lang['mi_menu']='Manning — Русло довільного перерізу';
$ec_lang['mi_main_title']='Безкоштовний онлайн-калькулятор Manning для русла довільного перерізу';
$ec_lang['mi_main_desc']='Калькулятор рівномірної течії Manning для русла довільного перерізу';
$ec_lang['mi_waterSurfaceElevation']='Відмітка поверхні води';
$ec_lang['mi_q_617']='<span class="ec-help" title="Складена витрата Q, з використанням складеного n для кожної зони за Chow 6-17, за умови рівних швидкостей">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Точки поперечного перерізу';
$ec_lang['mi_groupPoint']='Точка';
$ec_lang['mi_groupSegment']='Ділянка';
$ec_lang['mi_groupRegion']='Зона';
$ec_lang['mi_station']='Пікет';
$ec_lang['mi_elevation']='Відмітка';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />межа<br />зони<br />(Берег)';
$ec_lang['mi_tau']='Дон.<br />дотич.<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='Склад.<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='Складений n';
$ec_lang['mi_notes_1_def']='Цей калькулятор дотримується довідкового посібника HEC-RAS у розрахунку складеного n зони за Chow 1959, стор. 136, рівняння 6-17 (не 6-18).';


$ec_lang['mi_notes_2_term']='Кам\'яне облицювання';
$ec_lang['mi_notes_2_def']='Для проектування кам\'яного облицювання використовуйте калькулятор трапецієвидного русла Manning. Цей калькулятор призначений більше для природних перерізів.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning — Течія в трубі';
$ec_lang['mpf_main_title']='Безкоштовний онлайн-калькулятор течії в трубі за Manning';
$ec_lang['mpf_main_desc']='Рівномірна течія в трубі за формулою Manning при заданому похилі та глибині';
$ec_lang['mpf_pipe_diameter']='Діаметр труби, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Коефіцієнт шорсткості Маннінга, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Ухил тертя, S<sub>f</sub></a><span class="ec-help" title="Іноді дорівнює ухилу труби. Перейдіть за посиланням для пояснення (лише англійською)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Відносна глибина течії, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Витрата, Q';
$ec_lang['mpf_flow_tip']='Витрата і глибина розраховані для нескінченно довгої труби. Щоб пропустити цю витрату у трубу, може знадобитися більша глибина верхнього б\'єфа. Детальніше та навчальне відео — у примітках нижче.';
$ec_lang['mpf_velocity']='Швидкість, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Кінетична енергія у вигляді висоти стовпа води, v²/2g">Швидкісний напір, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Площа живого перерізу, A';
$ec_lang['mpf_pipe_area']='Площа перерізу труби, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Відносна площа, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Змочений периметр, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Гідравлічний радіус, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Ширина по поверхні, T';
$ec_lang['mpf_froude_number']='Число Фруда, Fr';
$ec_lang['mpf_shear_stress']='Середнє дотичне напруження, τ';
$ec_lang['mpf_full_flow']='Витрата при повному заповненні, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Відношення до повної витрати, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Це витрата і глибина всередині <em>нескінченно довгої</em> труби.</dt><dd>Для забезпечення надходження потоку в трубу може знадобитися значно більша глибина підпору. Додайте не менше 1.5 швидкісного напору для визначення глибини підпору, або <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">дивіться мій 2-хвилинний посібник</a> зі стандартних розрахунків підпору водопропускних труб за допомогою <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> — безкоштовної програми для розрахунку водопропускних труб від Федерального управління автомобільних доріг США.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Проєктуєте побутову каналізацію?</dt><dd>Дивіться <a target="_blank" href="/sewslope.php">таблиці мінімального ухилу каналізаційної труби</a> для труб від 4 до 96 дюймів (від 100 до 2400 мм) у м/м, мм/м і відсотках, а також дослідження <a target="_blank" href="/peakfact.php">коефіцієнтів пікового навантаження для дуже малих витрат</a>. Обидва документи є довідковими і доступні лише англійською мовою.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Введіть додатне цільове значення Q.';
$ec_lang['mpf_solver_no_solution']='Рішення відсутнє: Q перевищує пропускну здатність труби при y/d0 = 93.8% (Qmax = {qmax} у вибраних одиницях).';
$ec_lang['mpf_solve_btn']='Розрахувати';
$ec_lang['mpf_solve_for_flow']='для витрати, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Manning — Втрати напору в трубі';
$ec_lang['mphl_main_title']='Безкоштовний онлайн-калькулятор втрат напору в трубі за Manning';
$ec_lang['mphl_main_desc']='Втрати напору за формулою Manning при заданій витраті повного перерізу';
$ec_lang['mphl_pipe_length']='Довжина труби, L';
$ec_lang['mphl_area']='Площа, A';
$ec_lang['mphl_total_junction_k']='Коефіцієнт місцевих втрат, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Коефіцієнт втрат, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Коефіцієнт місцевих втрат, km. Ці втрати виникають у місцях з\'єднання трубопроводів, на вході, виході, поворотах і арматурі — термін «місцеві» умовний, але їх не варто недооцінювати: на короткій ділянці вони можуть дорівнювати втратам на тертя або перевищувати їх. Типові значення k: гострокрайній вхідний отвір 0,5, кожен поворот на 45° 0,2–0,3, засувка (повністю відкрита) 0,1, дисковий затвор 0,2, вихід (у резервуар або атмосферу) 1,0. Підсумуйте всі елементи арматури для отримання загального km. Значення за замовчуванням 2,0 відповідає одному входу, одному виходу і двом поворотам на 45°.';
$ec_lang['mphl_friction_slope']='Ухил тертя';
$ec_lang['mphl_friction_loss']='Втрати на тертя, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Місцеві втрати, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Сумарні втрати, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='Лінія енергії нижче за течією';
$ec_lang['mphl_egl_2']='Лінія енергії вище за течією';
$ec_lang['mphl_hgl_egl_tip']='Цей результат може бути недійсним там, де труба піднімається вище п\'єзометричної лінії.';
$ec_lang['mphl_note_1']='<dl><dt>Цей калькулятор не моделює профіль труби між двома кінцями.</dt><dd>Якщо п\'єзометрична лінія в якійсь точці опускається нижче верху труби, цей розрахунок може бути недійсним.</dd><dt>При відкритому вхідному (водопропускному) режимі необхідно перевірити умови управління на вході.</dt><dd>1. П\'єзометрична лінія вище за течією не може бути нижче відмітки рівномірної течії нормальної глибини вище за течією (і не може бути нижче труби!).</dd><dd>2. Підпір водопропускної труби краще характеризується лінією енергії вище за течією, а не п\'єзометричною лінією.</dd><dd>3. Дивіться <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">мій 2-хвилинний посібник</a> з простих стандартних розрахунків підпору водопропускних труб за допомогою <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> — безкоштовної програми для розрахунку водопропускних труб від Федерального управління автомобільних доріг США.</dd><dd>4. Ця сторінка розв\'язує лише випадок керування на виході: труба, що тече повним перерізом, коли умови нижче за течією визначають напір. Проєктування водопропускної труби полягає у визначенні того, що керує — вхід чи вихід, тому використовуйте HY-8, коли можливий будь-який із варіантів.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Manning — Трапецієвидне русло';
$ec_lang['mtc_main_title']='Безкоштовний онлайн-калькулятор трапецієвидного русла за формулою Manning';
$ec_lang['mtc_main_desc']='Рівномірна течія в трапецієвидному руслі за формулою Manning при заданому ухилі та глибині';
$ec_lang['mtc_bottom_width']='Ширина дна, b';
$ec_lang['mtc_side_slope_1']='Закладення укосу 1, z<sub>1</sub> (горизонт./верт.)';
$ec_lang['mtc_side_slope_2']='Закладення укосу 2, z<sub>2</sub> (горизонт./верт.)';
$ec_lang['mtc_channel_slope']='Ухил русла, S';
$ec_lang['mtc_flow_depth']='Глибина течії, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Кут повороту, β</a><span class="ec-help" title="Для підбору розміру каменю. Перейдіть за посиланням для схеми."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Густина відносно води. Типове значення ≈ 2,65 для дробленого каменю.">Відносна густина каменю, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Розрахунковий розмір каменю, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n за розрахунковим розміром каменю (метод Strickler)';
// Edited by TGH 2026-09-07
$ec_lang['mtc_n_blodgett']='n за розрахунковим розміром каменю (метод Blodgett)';
$ec_lang['mtc_n_bathurst']='n за розрахунковим розміром каменю (метод Bathurst)';
$ec_lang['mtc_n_pi']='n за розрахунковим розміром каменю (P&I, метод Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett проти Bathurst';
$ec_lang['mtc_pi_range_check']='Перевірка діапазону P&I';
$ec_lang['mtc_pi_ok']='d50 у діапазоні P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 фута (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_not_applicable']='н/з';
$ec_lang['mtc_pi_out_of_range']='Поза діапазоном';
$ec_lang['mtc_pi_tip']='Екстраполяція за межі діапазону вихідних даних 0,28–0,36 фута, на основі якого виведено це рівняння — використовуйте лише як орієнтовну перевірку, а не як основу для проєктування';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="За Isbash (1936) та округом Марікопа, Аризона, США.">Необхідний розмір кутастого каменю для дна, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="За Isbash (1936) та округом Марікопа, Аризона, США.">Необхідний розмір кутастого каменю для укосу 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="За Isbash (1936) та округом Марікопа, Аризона, США.">Необхідний розмір кутастого каменю для укосу 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="За Maynord, Ruff та Abt (1989). На повороті камінь підбирають на швидкість повороту 4/3 від середньої, за California Division of Highways (1970); власна величина Maynord\'а 1,5 застосовується до природних русел.">Необхідний розмір кутастого каменю, D<sub>50</sub> (Maynord, Ruff та Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Необхідний розмір кутастого каменю, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Швидкість прийнятна для умов рівномірної течії.';
$ec_lang['mtc_vel_low']='Швидкість низька — ризик замулення.';
$ec_lang['mtc_vel_high']='Швидкість висока і може бути нереалістичною — перевірте ерозію облицювання русла, додаткову глибину на поворотах і втрати енергії на розширеннях або перешкодах.';
$ec_lang['mtc_iteration_tip']='Виберіть варіант шорсткості (рекомендується B/B, тобто Blodgett–Bathurst) та варіант розміру каменю (рекомендується Isbash), щоб автоматично підібрати ітерацією однорідний розмір каменю для потрібної витрати. Повний метод — у примітках нижче. Щоб пропустити ітерацію, введіть власне значення шорсткості (перейдіть за посиланням для довідки) і не зважайте на розмір каменю.';
$ec_lang['mtc_note_1']='<dl><dt>Автоматична ітерація розрахункового розміру каменю та шорсткості</dt><dd>Виберіть варіант шорсткості (рекомендується B/B, тобто Blodgett–Bathurst) та варіант розрахункового розміру каменю (рекомендується Isbash). Підберіть глибину та коефіцієнт запасу розміру каменю, щоб досягти потрібної витрати з однорідним розміром каменю. Щоразу, коли ви змінюєте вхідне значення, калькулятор повторює такі кроки: 1. Шорсткість розраховується за розрахунковим розміром каменю. 2. Значення шорсткості за вибраним методом копіюється у вхідну шорсткість. 3. Розраховуються витрата русла та необхідний розмір каменю. 4. Розрахунковий розмір каменю коригується. 5. Кроки повторюються, доки похибка розрахункового розміру каменю не стане дуже малою.</dd><dt>Базовий калькулятор (без ітерації)</dt><dd>Введіть бажане значення шорсткості. Ділянку введення розрахункового розміру каменю ігноруйте.</dd></dl>';
$ec_lang['mtc_note_2_term']='Перевірка швидкості';
$ec_lang['mtc_note_2_def']='Висока швидкість означає значну питому енергію від наявного перепаду. Ця енергія може швидко розсіюватися на розширеннях, поворотах або перешкодах. Переконайтеся, що це значення є прийнятним для даної ділянки.';
$ec_lang['mtc_solver_no_solution']='Рішення для заданої Q з цими вхідними параметрами русла не знайдено.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Простий водозлив';
$ec_lang['ws_main_title']='Безкоштовний онлайн-калькулятор витрати через простий широкогребінчастий водозлив';
$ec_lang['ws_main_desc']='Калькулятор витрати через простий широкогребінчастий водозлив';
$ec_lang['ws_weirLength']='Довжина водозливу, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Енергія на одиницю ваги води — висота стовпа води, а не тиск">Напір, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Коефіцієнт водозливу, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Примітки';
$ec_lang['ws_notes_we_term']='Рівняння водозливу';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Водозлив довільного профілю';
$ec_lang['wi_main_title']='Безкоштовний онлайн-калькулятор витрати через сегментований водозлив довільного профілю зі змінною глибиною';
$ec_lang['wi_main_desc']='Калькулятор витрати через водозлив довільного профілю';
$ec_lang['wi_weirPoints']='Точки водозливу';
$ec_lang['wi_pondingHeight']='Висота підпору';
$ec_lang['wi_incrementalFlow']='Часткова витрата';
$ec_lang['wi_cumulativeFlow']='Накопичена витрата';
$ec_lang['wi_notes_we_def']='q = якщо (length = 0) тоді 0 інакше якщо (slope=0) тоді cw*length*d<sub>0</sub><sup>1.5</sup> інакше cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>), де d<sub>1</sub> і d<sub>0</sub> завжди додатні або нульові';
// Orifice Flow
$ec_lang['or_main_menu']='Витікання через отвір';
$ec_lang['or_main_title']='Безкоштовний онлайн-калькулятор витікання через отвір';
$ec_lang['or_main_desc']='Витікання через отвір — вільне або підтоплене';
$ec_lang['or_shape_circular']='Кругла';
$ec_lang['or_shape_rectangular']='Прямокутна';
$ec_lang['or_diameter']='<span class="ec-help" title="Діаметр для круглого отвору; висота для прямокутного">Діаметр або висота, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Тільки для прямокутних отворів">Ширина, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Низ отвору">Відмітка лотка <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Відмітка рівня верхнього б\'єфа';
$ec_lang['or_twe']='Відмітка рівня нижнього б\'єфа';
$ec_lang['or_cd']='Коефіцієнт витрати, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Відмітка центроїда';
$ec_lang['or_head']='<span class="ec-help" title="Енергія на одиницю ваги води — висота стовпа води, а не тиск">Ефективний напір, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Площа отвору, A';
$ec_lang['or_regime']='Перевірка режиму отвору';
$ec_lang['or_regime_valid']='Вільний злив';
$ec_lang['or_regime_submerged']='Підтоплений отвір';
$ec_lang['or_regime_submerged_tip']='TWE вище центроїда — режим отвору залишається чинним';
$ec_lang['or_regime_warn']='Поза межами режиму отвору';
$ec_lang['or_regime_warn_tip']='Верхній б\'єф нижче шелиги (верху) отвору';
$ec_lang['or_regime_twe_above_hwe']='Перевірте вхідні дані';
$ec_lang['or_regime_twe_above_hwe_tip']='Нижній б\'єф (TWE) вище верхнього б\'єфа (HWE)';
$ec_lang['or_notes_1_term']='Рівняння отвору';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Для вільного зливу: h = HWE − центроїд. Для підтопленої течії (TWE вище лотка): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Режим отвору';
$ec_lang['or_notes_2_def']='Рівняння витікання через отвір застосовуються, коли поверхня верхнього б\'єфа вища за шелигу (верх) отвору. Якщо верхній б\'єф нижче шелиги, використовуйте натомість рівняння водозливу.';
$ec_lang['or_notes_3_term']='Коефіцієнт витрати';
$ec_lang['or_notes_3_def']='C<sub>d</sub> зазвичай перебуває в межах приблизно 0.60–0.65 для гостроокрайних отворів. Для заокруглених або втоплених вхідних кромок використовуються інші значення. Див. <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> або Гідравлічний довідковий посібник HEC-RAS.';
$ec_lang['or_notes_4_term']='Підтоплення';
$ec_lang['or_notes_4_def']='Якщо TWE вище лотка отвору, цей калькулятор автоматично застосовує рівняння підтопленого отвору з h = HWE − TWE. Якщо TWE на рівні лотка або нижче, приймається вільний злив і h = HWE − центроїд.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Мікро-гідроелектростанція';
$ec_lang['mhp_main_title']='Безкоштовний онлайн-калькулятор потужності мікро-ГЕС';
$ec_lang['mhp_main_desc']='Калькулятор потужності руслової мікро-ГЕС';
$ec_lang['mhp_gross_head']='Повний напір, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Діаметр напірного трубопроводу (підвідної труби)">Діаметр напірного трубопроводу, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Довжина, L';
$ec_lang['mhp_efficiency']='Ефективність установки, η (0–1)';
$ec_lang['mhp_vel_check']='Перевірка швидкості';
$ec_lang['mhp_hl_check']='Перевірка втрат напору';
$ec_lang['mhp_hnet']='Робочий напір, H<sub>net</sub>';
$ec_lang['mhp_power']='Потужність, P';
$ec_lang['mhp_annual_kwh']='P як річна енергія';
$ec_lang['mhp_vel_low']='Швидкість низька — ризик замулення та захоплення повітря.';
$ec_lang['mhp_vel_high']='Швидкість висока — перевірте втрати на переходах, доступну енергію та ризик гідравлічного удару.';
$ec_lang['mhp_vel_ok_short']='ОК';
$ec_lang['mhp_vel_high_short']='Висока';
$ec_lang['mhp_vel_low_short']='Низька';
$ec_lang['mhp_vel_ok_tip']='Швидкість знаходиться в ефективному діапазоні для напірного трубопроводу.';
$ec_lang['mhp_hl_ok_tip']='Втрати напору менші за 10% від валового напору. Цей діаметр труби економічний.';
$ec_lang['mhp_hl_warn_tip']='Втрати напору перевищують 10% від валового напору. Розгляньте трубу більшого діаметра.';
$ec_lang['mhp_hl_bad_tip']='Втрати напору перевищують 20% від валового напору. Змініть діаметр труби.';
$ec_lang['mhp_notes_1_term']='Втрати напору';
$ec_lang['mhp_notes_1_def']='Сумарні втрати в трубопроводі h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, де h<sub>f</sub> = f(L/D)(v²/2g) — втрати на тертя за Darcy-Weisbach, а h<sub>m</sub> = k<sub>m</sub>·v²/2g — втрати на вході, поворотах і засувках. Робочий напір H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Швидкість';
$ec_lang['mhp_notes_2_def']='Перевірте, чи прийнятна швидкість для наявного перепаду висот та вартості труби. Дуже низька швидкість може вказувати на завелику трубу; дуже висока швидкість може збільшити втрати на тертя та ризик гідравлічного удару.';
$ec_lang['mhp_notes_3_term']='Цільові втрати напору';
$ec_lang['mhp_notes_3_def']='Втрати в напірному трубопроводі (підвідній трубі) нижче 10% від повного напору, як правило, є економічно обґрунтованими. Оптимальний компроміс між вартістю труби та втраченою потужністю часто припадає на 4–6% там, де ціна на електроенергію висока.';
$ec_lang['mhp_notes_6_term']='Ефективність';
$ec_lang['mhp_notes_6_def']='Типова ефективність установки η становить від 0.70 до 0.85 для турбін Пелтона та поперечно-потокових турбін, що застосовуються в мікро-ГЕС. Значення 0.75 є консервативною первинною оцінкою.';
$ec_lang['mhp_notes_7_term']='Річна енергія';
$ec_lang['mhp_notes_7_def']='Річна енергія розраховується за умови безперервної роботи при повній витраті (8760 годин/рік). Фактичне виробництво буде нижчим через сезонні коливання витрати, простої на технічне обслуговування та коефіцієнт завантаження.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Час спорожнення ставка та резервуара';
$ec_lang['odt_main_title']='Безкоштовний онлайн-калькулятор часу спорожнення ставка, басейну та резервуара (через отвір)';
$ec_lang['odt_main_desc']='Час спорожнення ставка, басейну або резервуара — випуск через отвір, метод конічного об\'єму';
$ec_lang['odt_h1_elev']='Початкова відмітка поверхні води';
$ec_lang['odt_a1']='Початкова площа, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Кінцева відмітка поверхні води';
$ec_lang['odt_a0']='Площа на рівні отвору, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Інтерпольована за конічною моделлю на кінцевій відмітці">Кінцева площа, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Перевірка кінцевої відмітки';
$ec_lang['odt_h2_ok']='Кінцева відмітка вище верху отвору';
$ec_lang['odt_h2_warn']='Кінцева відмітка на рівні або нижче верху отвору';
$ec_lang['odt_h2_warn_tip']='Верх отвору = центроїд + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Діаметр (круглий) або висота (прямокутний)">Отвір D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Тільки прямокутний">Ширина отвору, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Час спорожнення (с)';
$ec_lang['odt_t_min']='Час спорожнення (хв)';
$ec_lang['odt_t_hr']='Час спорожнення (год)';
$ec_lang['odt_t_day']='Час спорожнення (дн)';
$ec_lang['odt_notes_1_term']='Формула';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) дає час спорожнення від напору H до отвору. Час спорожнення = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), де H<sub>1</sub> = початкова відмітка − відмітка отвору, H<sub>2</sub> = кінцева відмітка − відмітка отвору.';
$ec_lang['odt_notes_2_term']='Метод';
$ec_lang['odt_notes_2_def']='Метод конічного об\'єму моделює ставок або басейн як конічний перетин між початковою площею A<sub>1</sub> на початковій поверхні води та площею A<sub>0</sub> на відмітці центроїда отвору. A<sub>2</sub>, площа ставка на кінцевій відмітці, інтерполюється між A<sub>1</sub> та A<sub>0</sub> за моделлю конічного перетину. Час спорожнення від початкової до кінцевої відмітки дорівнює повному часу спорожнення від H<sub>1</sub> до отвору мінус час, що залишається від H<sub>2</sub> до отвору.';
$ec_lang['odt_h1']='<span class="ec-help" title="Початкова відмітка поверхні води мінус відмітка центроїда отвору">Початковий напір, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Макс. витрата, Q<sub>max</sub>';
$ec_lang['odt_vol']='Спущений об\'єм';
$ec_lang['odt_sketch_start']='Початок';
$ec_lang['odt_sketch_end']='Кінець';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Розстав емітерів, S<sub>e</sub>';
$ec_lang['ip_sl']='Розстав ліній, S<sub>l</sub>';
$ec_lang['ip_n_e']='Емітери на бічний трубопровід, n<sub>e</sub>';
$ec_lang['ip_n_l']='Бічні трубопроводи на зону, n<sub>l</sub>';
$ec_lang['ip_d']='Цільова глибина поливу, d';
$ec_lang['ip_a_e']='Площа на один емітер, A<sub>e</sub>';
$ec_lang['ip_pr']='Норма поливу, PR';
$ec_lang['ip_q_lat']='Витрата на бічний трубопровід, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Витрата зони, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Час роботи (години)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Фільтрація з каналу';
$ec_lang['cs_main_title']='Безкоштовний онлайн-калькулятор фільтраційних втрат і коефіцієнта корисної дії каналу';
$ec_lang['cs_main_desc']='Фільтраційні втрати каналу & коефіцієнт корисної дії транспортування — метод витрата на вході − витрата на виході';
$ec_lang['cs_Q_in']='Витрата на вході, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Витрата на виході, Q<sub>out</sub>';
$ec_lang['cs_L']='Довжина ділянки, L';
$ec_lang['cs_Q_loss']='Інтенсивність фільтраційних втрат, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Перевірка вимірювань';
$ec_lang['cs_pct_loss']='Частка втрат';
$ec_lang['cs_Ec']='Коефіцієнт корисної дії транспортування, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Оцінка ефективності';
$ec_lang['cs_Vol_day']='Добовий об\'єм втрат';
$ec_lang['cs_Vol_year']='Річний об\'єм втрат';
$ec_lang['cs_Q_loss_per_L']='Втрата на одиницю довжини, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Вартість води';
$ec_lang['cs_lining_cost']='Вартість облицювання';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Коефіцієнт корисної дії мета після облицювання; дріб 0–1">Цільовий ККД облицювання, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Площа облицювання, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Річна вартість втрат';
$ec_lang['cs_annual_value_recovered']='Річна відновлена вартість';
$ec_lang['cs_lining_total_cost']='Вартість облицювання всього';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Простий період окупності = загальна вартість облицювання ÷ річна відновлена вартість">Період окупності <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — фільтрація виявлена';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — вимірних втрат немає';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — перевірте вимірювання';
$ec_lang['cs_Ec_good']='Добре — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Задовільно — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Незадовільно — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='Метод витрата на вході — витрата на виході визначає фільтрацію вимірюванням витрати на початку та в кінці ділянки каналу: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Коефіцієнт корисної дії транспортування E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Річний об\'єм розраховується за умови безперервної роботи на повній витраті; фактичні втрати нижчі для сезонних або частково завантажених каналів.';
$ec_lang['cs_notes_2_term']='Оцінки ефективності';
$ec_lang['cs_notes_2_def']='Типові незакріплені земляні канали: E<sub>c</sub> = 60–80%. Добре утримувані земляні канали: 75–85%. Канали з бетонним облицюванням: 90–98%. Фільтраційні втрати понад 30% від витрати на вході часто обґрунтовують вкладення в облицювання. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Окупність облицювання';
$ec_lang['cs_notes_3_def']='Введіть вартість води та вартість облицювання у будь-якій послідовній грошовій одиниці. Площа облицювання = довжина ділянки × змочений периметр — змочений периметр перерізу каналу на відмітці вимірюваної глибини (ширина дна плюс обидва змочені укоси). Річна відновлена вартість передбачає, що облицьований канал безперервно досягає цільового E<sub>c</sub>. Фактична окупність буде довшою для сезонних каналів або якщо облицювання не досягає цільової ефективності.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3-тє вид. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='Про';
$ec_lang['install_main_menu']='Встановити';
$ec_lang['install_main_title']='Встановити EngCalcs';
$ec_lang['install_main_desc']='Додайте на пристрій для використання офлайн';
$ec_lang['install_intro']='EngCalcs — це прогресивний веб-застосунок (PWA). Після встановлення всі калькулятори повністю працюють офлайн — інтернет-з’єднання не потрібне.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Відкрийте будь-яку сторінку калькулятора в Chrome.</li><li>Натисніть кнопку <strong>⬇ Встановити</strong> на верхній панелі навігації або відкрийте меню браузера (⋮) і виберіть <strong>Додати на головний екран</strong>.</li><li>Натисніть <strong>Встановити</strong> у вікні, що з’явиться.</li><li>Значок EngCalcs з’явиться на головному екрані, і застосунок працюватиме офлайн.</li>';
$ec_lang['install_now_btn']='⬇ Встановити зараз';
$ec_lang['install_prompt_unavailable']='Вікно встановлення недоступне — скористайтеся меню браузера.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Відкрийте будь-яку сторінку калькулятора в Safari.</li><li>Натисніть кнопку <strong>Поділитися</strong> (значок у вигляді квадрата зі стрілкою вгору).</li><li>Прогорніть униз і виберіть <strong>Додати на головний екран</strong>.</li><li>Натисніть <strong>Додати</strong>. Значок EngCalcs з’явиться на головному екрані.</li>';
$ec_lang['install_ios_note']='На iOS встановлення завжди виконується через меню «Поділитися» — автоматичного запиту на встановлення немає.';
$ec_lang['install_desktop_heading']='Комп’ютер (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Відкрийте будь-яку сторінку калькулятора.</li><li>Натисніть значок <strong>встановлення</strong> (⊕ або значок комп’ютера) в адресному рядку браузера, або відкрийте меню браузера і виберіть <strong>Встановити EngCalcs…</strong></li><li>Натисніть <strong>Встановити</strong>. EngCalcs відкриється як окреме вікно застосунку.</li>';
$ec_lang['install_firefox_heading']='Firefox та інші браузери';
$ec_lang['install_firefox_body']='Якщо браузер не пропонує встановлення, користуйтеся калькуляторами в браузері як зазвичай. Після першого відвідування сторінки автоматично кешуються для роботи офлайн. Firefox на комп’ютері — типовий випадок.';
$ec_lang['install_cached_heading']='Що зберігається в кеші';
$ec_lang['install_cached_body']='Під час першого встановлення EngCalcs усі сторінки калькуляторів та допоміжні файли (скрипти, стилі) автоматично зберігаються на вашому пристрої. Після цього все працює без інтернет-з’єднання. Обрана мова запам’ятовується з вашого останнього онлайн-візиту.';
$ec_lang['contact_main_menu']='Контакт';
$ec_lang['about_main_title']='Про інженерні калькулятори HawsEDC';
$ec_lang['about_main_desc']='Місія, вільне програмне забезпечення і внесок';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Місія</h3><p>Інженерні Калькулятори HawsEDC безкоштовно доступні онлайн з 2010 року. Вони існують для обслуговування інженерів і польових працівників по всьому світу — особливо тих, хто працює в регіонах з дефіцитом води, обмеженими ресурсами або недостатнім забезпеченням. Ці інструменти є частиною ширшої гуманітарної місії: сказати кожній людині найбільш практичним і дієвим способом, <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">що вона кохана і дорога назавжди, що їй нема чого боятися і що вона не зруйнує все</a>.</p><p>Калькулятори — це засіб. Мета — світ без страждань.</p><h3>Вільна ліцензія з відкритим кодом</h3><p>Весь код опубліковано за <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 or later</a> — вільний у сенсі свободи. Ви можете використовувати, вивчати, змінювати і поширювати код на тих самих умовах.</p><p>Сайт, що його обслуговує, безкоштовний сьогодні й з 2010 року; якщо колись його не стане, програмою все одно можна користуватися самостійно.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Вихідний Код</h3><p>Повний вихідний код публічно доступний на GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Там можна переглядати код, повідомляти про проблеми або зробити форк репозиторію.</p><h3>Внесок</h3><p>Будь-яка допомога вітається. <a href="contact.php">Зв\'яжіться з Tom Haws</a>.</p><ul><li><strong>Переклади:</strong> Запропонуйте кращі формулювання. Покращіть або додайте мову.</li><li><strong>Звіти про помилки:</strong> Скористайтеся формою зворотного зв\'язку на будь-якій сторінці калькулятора або повідомте про проблему на GitHub.</li><li><strong>Нові калькулятори:</strong> Особливо вітаються ідеї гідравлічно-інженерних інструментів для польових працівників і фахівців із зрошення.</li><li><strong>Хостинг:</strong> Якщо ви можете розмістити дзеркало цих калькуляторів для регіону з обмеженим підключенням до інтернету, будь ласка, зв\'яжіться зі мною.</li></ul><h3>Використання без інтернету</h3><p>Відкрийте будь-який калькулятор один раз, поки є інтернет, і всі вони продовжать працювати без нього: браузер зберігає весь набір у процесі роботи. Механізм — <strong>прогресивний веб-додаток (PWA)</strong>. Після цього всі калькулятори працюють без інтернету — підключення не потрібне.</p><p>На Android або iOS скористайтеся функцією «Додати на головний екран» у браузері, щоб встановити EngCalcs як додаток на своєму пристрої. На комп\'ютері шукайте значок встановлення в адресному рядку браузера.</p><p>Ви також можете зберегти будь-який окремий калькулятор за допомогою меню «Зберегти як…» у браузері для разового використання без інтернету.</p><h3>Контакт</h3><p>Tom Haws — гідравлічний інженер і автор цих калькуляторів.<br />Скористайтеся формою зворотного зв\'язку на будь-якій сторінці калькулятора або перейдіть до вихідного коду на <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Надіслати повідомлення Тому Хоусу';
$ec_lang['contactYourName']='Ваше ім\'я:';
$ec_lang['contactYourEmail']='Ваша адреса електронної пошти:';
$ec_lang['contactSubject']='Тема:';
$ec_lang['contact_message']='Повідомлення:';
$ec_lang['contactSpamPrefix']='П\'ять плюс один дорівнює';
$ec_lang['contactSpamPostfix']='(Будь ласка, напишіть словами. 1=один 2=два 3=три 4=чотири 5=п\'ять 6=шість 7=сім +=плюс 5+1=6)';
$ec_lang['contactSubmitButton']='Надіслати повідомлення';
$ec_lang['contact_success']='Дякуємо за ваш час та увагу.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Проектування Кам\'яного Швидкотоку (Robinson)';
$ec_lang['rc_main_title']='Безкоштовний Онлайн-Калькулятор Проектування Кам\'яного Швидкотоку — Robinson (1998)';
$ec_lang['rc_main_desc']='Підбір Розміру Кам\'яної Накидки для Швидкотоку — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Ухил дна швидкотоку, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Витрата на одиницю ширини у вхідному перерізі швидкотоку. Для каналу шириною дна B із сумарною витратою Q використовуйте q_t = Q / B.">Сумарна питома витрата, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Пористість кам\'яної накидки, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Густина відносно води. Типовий дроблений граніт або базальт ≈ 2,65. Допустимий діапазон за Robinson: 2,54–2,82.">Відносна густина каменю, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Стандартне відхилення гранулометричного складу. Однорідний камінь ≈ 1,25. Діапазон за Robinson: 1,15 до 1,47.">Гранулометричний склад SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Підпір (Hp > yn) бажаний, бо знижує ерозію вище за течією. (USDA)">Нормальна глибина у вхідному каналі, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Рівн. 1 (S0 < 0,10) або Рівн. 2 (0,10–0,40). Дійсний: D50 15–278 мм, S0 0,02–0,40. За межами діапазону: екстраполяція.">Необхідний медіанний розмір каменю, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Застосоване рівняння';
$ec_lang['rc_sg_check']='Перевірка відносної густини';
$ec_lang['rc_SD_check']='Перевірка гранулометричного складу (SD)';
$ec_lang['rc_sg_ok']   ='sg у допустимому діапазоні (2,54–2,82)';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg нижче діапазону Robinson (< 2,54)';
$ec_lang['rc_sg_low_tip']='Допустимий діапазон: 2,54–2,82';
$ec_lang['rc_sg_high'] ='sg вище діапазону Robinson (> 2,82)';
$ec_lang['rc_sg_high_tip']='Допустимий діапазон: 2,54–2,82';
$ec_lang['rc_SD_ok']   ='SD у допустимому діапазоні (1,15–1,47)';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD нижче діапазону Robinson (< 1,15)';
$ec_lang['rc_SD_low_tip']='Допустимий діапазон: 1,15–1,47';
$ec_lang['rc_SD_high'] ='SD вище діапазону Robinson (> 1,47)';
$ec_lang['rc_SD_high_tip']='Допустимий діапазон: 1,15–1,47';
$ec_lang['rc_layer']='Товщина шару накидки (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Радіус кривої гребеня (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Довжина дуги кривої гребеня';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Необхідна для конструктивної підтримки каменю швидкотоку. Мінімальний рівень нижнього б\'єфу, що утворюється завдяки вихідній ділянці та опору нижнього каналу, достатній для забезпечення стійкості накидки на вихідній ділянці. (Robinson)">Довжина водобійної плити на виході (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Коефіцієнт шорсткості Маннінга в швидкотоці, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Частка q_t, що протікає через пори каменю. Залишок qs тече по поверхні. За замовчуванням np = 0,45 для кутастого дробленого каменю.">Швидкість через кам\'яну мантію, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Питома витрата через мантію, q<sub>m</sub>';
$ec_lang['rc_qs']='Поверхнева питома витрата, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Глибина потоку над поверхнею накидки, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Підпір (Hp > yn) бажаний, бо знижує ерозію вище за течією. (USDA)">Напір на вхідному водозливі, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Перевірка підпору на вході';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — підпір вище за течією';
$ec_lang['rc_pond_ok_tip']='Підпір вище за течією від входу в швидкотік бажаний; він знижує ерозію вище за течією. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — підпору немає — можлива ерозія на вході';
$ec_lang['rc_pond_warn_tip']='Підпору вище за течією від входу немає; можлива ерозія вище за течією. (USDA)';
$ec_lang['rc_eq1']='Рівн. 1 (S<sub>0</sub> < 0,10) — пологий ухил';
$ec_lang['rc_eq2']='Рівн. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — крутий ухил';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — нижче діапазону валідації Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — вище діапазону валідації Robinson';
$ec_lang['rc_notes_1_term']='Рівняння підбору розміру каменю';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) розробили два емпіричних рівняння для медіанного розміру накидки D<sub>50</sub> на основі ухилу русла та питомої витрати. Рівняння 1 застосовується для пологих ухилів (S<sub>0</sub> < 0,10); Рівняння 2 — для крутих ухилів (0,10 ≤ S<sub>0</sub> ≤ 0,40). Обидва рівняння вимагають q<sub>t</sub> у м²/с та повертають D<sub>50</sub> у мм. Перевірений діапазон: 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Питома витрата';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> — сумарна питома витрата у гребені швидкотоку (сумарна витрата на одиницю ширини). Для каналу з шириною дна B і сумарною витратою Q наближено q<sub>t</sub> ≈ Q / B, або обчисліть його з умови критичної глибини у вхідному перерізі швидкотоку.';
$ec_lang['rc_notes_3_term']='Фільтраційний потік через кам\'яну мантію';
$ec_lang['rc_notes_3_def']='Частина сумарної витрати проходить через пори кам\'яної накидки (витрата через мантію q<sub>m</sub>); залишок тече по поверхні каменю (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). Глибина потоку d обчислюється за рівнянням Маннінга для поверхневої витрати q<sub>s</sub> з використанням шорсткості швидкотоку n. Пористість за замовчуванням n<sub>p</sub> = 0,45 типова для кутастого дробленого каменю.';
$ec_lang['rc_notes_5_term']='Допустимий діапазон розміру каменю';
$ec_lang['rc_notes_5_def']='Рівняння розроблені для діапазону D<sub>50</sub> від 15 мм до 278 мм. Результати за межами цього діапазону є екстраполяцією і мають застосовуватись з додатковою інженерною обережністю.';
$ec_lang['rc_notes_6_term']='Відмітка водобійної плити на виході';
$ec_lang['rc_notes_6_def']='Відмітка верху накидки на вихідній ділянці повинна бути на рівні або нижче відмітки дна каналу нижче за течією. Якщо вона вища — вихідний камінь буде нестійким.';

$ec_lang['rc_notes_7_def']='Якщо нормальна глибина у вхідному каналі менша за напір на водозливі (H<sub>p</sub>), необхідний для пропуску q<sub>t</sub>, вище за течією від входу в швидкотік виникає стиснення потоку або підпір. Це, як правило, допустимо — підпір знижує швидкість і запобігає ерозії вище за течією. Для перевірки: скористайтесь калькулятором водозливу, знайдіть H<sub>p</sub> для заданих q<sub>t</sub> і ширини гребеня, потім порівняйте з нормальною глибиною вхідного каналу. Якщо H<sub>p</sub> перевищує нормальну глибину, підпір виникне.';
$ec_lang['rc_notes_4_term']='Джерело';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS також публікує <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">таблицю Excel</a> на основі того ж методу.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Фільтр';
$ec_lang['rc_sketch_top_crest_curve'] = 'Крива гребеня';
$ec_lang['rc_sketch_outlet_apron']    = 'Водобійна плита';
$ec_lang['rc_sketch_radius']          = 'радіус';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Тиск зрошення';
$ec_lang['ip_main_title']='Безкоштовний онлайн-калькулятор тиску зрошення та рівномірності розподілу';
$ec_lang['ip_main_desc']='Тест тиску гілки та оцінка рівномірності';
$ec_lang['ip_h_supply']='Тиск подачі';
$ec_lang['ip_elev_supply']='Відмітка подачі, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Витрата емітера за конструкцією, q<sub>design</sub>';
$ec_lang['ip_h_design']='Тиск емітера за конструкцією';
$ec_lang['ip_x']='<span class="ec-help" title="0.5 для стандартних некомпенсованих емітерів; близько 0 для емітерів з компенсацією тиску">Показник витрати емітера, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Тестовий шлях';
$ec_lang['ip_group_reach']='Ділянка';
$ec_lang['ip_group_upstream']='Вище за течією';
$ec_lang['ip_group_downstream']='Нижче за течією';
$ec_lang['ip_group_loss']='Втрати';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Помічено: ця ділянка є сегментом тестової гілки, з якої окремі емітери відбирають воду. Не помічено: ця ділянка є магістраллю, яка передає витрату тільки латеральним, що не входять у тестовий шлях.">Лат. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Рядки латеральей: емітери у цій ділянці тільки. Рядки магістралей: загальна кількість емітерів на латеральях, ніж цій, що відводяться від цієї ділянки. Для ділянки прямо в місці відвору тестової латеральі, це також включає будь-які латеральі далі вниз по магістралі, або у тому ж з\'єднанні (наприклад, латераль з іншого боку) — їхня витрата проходить через цю саму ділянку перед розділенням, незалежно від того, наявні вони в цій таблиці чи ні.">Емітери <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Відмітка нижньої (кінцевої) частини цієї ділянки. Опціонально на проміжних рядках (за замовчуванням горизонтально / таке ж як у вузлі вище, якщо залишено порожнім). Обов\'язково на останньому рядку: це значення — відмітка останнього емітера, що безпосередньо встановлює необхідний тиск подачі.">DS Відм. <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Відмітка останнього емітера (останній рядок) залишена порожньою та за замовчуванням встановлена горизонтально — введіть її для точного результату';
$ec_lang['ip_press']='Тиск';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Загальні втрати ділянки, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Низький/негативний тиск — перевірте умови нижче атмосферного';
$ec_lang['ip_pressure_warn_short']='Низький';
$ec_lang['ip_pressure_high']='Ділянки з високим тиском потребують зниження тиску';
$ec_lang['ip_pressure_high_short']='Високий';
$ec_lang['ip_max_head']='Макс. доп. тиск труби';
$ec_lang['ip_max_head_tip']='Ділянки, тиск на яких перевищує це значення, позначаються попередженням. Залиште поле порожнім, щоб пропустити перевірку на високий тиск.';
$ec_lang['ip_h_far']='Тиск останнього емітера';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Витрата, що входить у змодельований тестовий шлях тільки, а не в усю зону/систему — дивіться Q_zone в Проектуванні поливу нижче для системного підсумку.">Витрата подачі тестового шляху, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Витрата останнього емітера, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Середня витрата емітера (тестова латераль), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="На скільки вище (або нижче) ви вважаєте, що типова/середня латераль працює в порівнянні з цією тестовою латеральлю. Тестова латераль навмисно являється передбачуваним найгіршим випадком, тому її власна середня — це упереджене занижене наближення для середньостатистичного польового значення — залишена на 0, перевірка рівномірності та цифри проектування поливу нижче використовують власну (імовірно оптимістичну) середню тестової латеральі як-є.">Орієнт. Δтиск, середній проти тестової латеральі <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral перерахована при тиску кожного рядка латеральей плюс введена вище різниця тиску — спроба коригування того факту, що тестова латераль являється передбачуваним найгіршим випадком, а не репрезентативною. Живить як перевірку рівномірності, так і розділ проектування поливу нижче.">Орієнт. середня витрата емітера поля, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Розрахункова витрата останнього емітера, поділена на орієнтовну середню витрату емітера поля — той же вигляд, що й стандартна рівномірність розподілу по низькій чверті (середня низькогрупа ÷ середня населення), але з невеликої змодельованої вибірки та користувацької орієнтовної коригування, не повної статистичної вибірки поля. Значення при або вище 1 можливі й не помилка: це просто означає, що останній емітер не являється найнижчою точкою щодо орієнтовної середньої поля (наприклад, сприятливий спуск вниз, або орієнтовна різниця тиску вище занадто мала).">Перевірка рівномірності, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Тиск тестового емітера ≥ тиску подачі. Цей шлях імовірно не є вашим найгіршим випадком, або труби можна зробити меншими.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Це відрізняється від нашого наближення стандартного показника рівномірності.">Витрата останнього емітера ÷ витрата за конструкцією, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Немає розв\'язку: необхідний тиск подачі перевищує введений тиск подачі. Збільшіть тиск подачі, зменшіть попит, або використовуйте більшу трубу.';
$ec_lang['ip_notes_1_def']='Припускає тиск у останньому (найдалечому) емітері, потім йде по лінії енергії назад до подачі, ділянка за ділянкою, додаючи втрати тертя та місцеві втрати по дорозі. Висоти та швидкісний напір вилучаються в кожному вузлі для звіту про фактичний тиск там. Припущений далекий-кінцевий тиск коригується (бісекція) до тих пір, поки розраховується потрібний тиск подачі не відповідає введеному тиску подачі — той же замкнений цикл проблеми, розглянутої вирішувачем витрати в трубі на калькуляторі Manning Pipe Flow, розширеного на розгалужену мережу.';
$ec_lang['ip_notes_2_term']='Магістраль проти Ділянки Латеральей';
$ec_lang['ip_notes_2_def']='Кожен рядок — одна ділянка вздовж єдиного гідравлічно найгіршого шляху (тестовий шлях) від подачі до останнього емітера. Ділянка магістралі тільки передає витрату латеральам, які не входять у тестовий шлях, тому її відбір — це просте множення (витрата конструкції × загальна кількість емітерів ділянки) — без локальної чутливості тиску. Магістраль — це спільна магістральна труба, тому ділянка прямо в місці свого власного відвору латеральі повинна включати не тільки латеральні між його власними кінцями, а й будь-які латеральні, які все ще далі вниз по магістралі за цим відвором, або які діляться на тому ж з\'єднанні (наприклад, латераль з іншого боку) — їхня витрата проходить через цю саму ділянку перед розділенням, незалежно від того, наявні вони десь інде в цій таблиці чи ні. Ділянка латеральей — це сегмент самої тестової латеральі: витрата емітера розраховується з фактичного локального тиску через q = k·H<sup>x</sup>, а втрати тертя зменшені на коефіцієнт F(n) Крістіансена для врахування зменшення витрати за рахунок того, що кожен емітер у ділянці відбирає воду.';
$ec_lang['ip_notes_3_term']='Обмеження';
$ec_lang['ip_notes_3_def']='Моделює один фіксований тиск подачі (без кривої насоса), лише один тестовий шлях (а не повне поле), та 2-параметрну криву емітера (встановіть показник близько 0 для наближення емітера з компенсацією тиску). Звітуються два різних показники рівномірності, навмисне тримаються окремо: q<sub>last</sub>/q<sub>avg,field</sub> — це наближення стандартної рівномірності розподілу по низькій чверті (середня низькогрупа ÷ середня населення); але це базується на невеликій змодельованій вибірці та користувацькій орієнтовній корекції, а не на стандартній повній статистичній вибірці поля. Крім того, тестова латераль навмисне є передбачуваним найгіршим випадком, тому її сира, не скоригована середня величина занизила б справжню середню поля та зробила б рівномірність кращою, ніж вона є насправді; введення різниці тиску (Δpressure) існує спеціально для протидії цьому викривленню. Значення рівномірності при або вище 1 все ще можливі: вони лише означають, що тиск останнього емітера перебуває на рівні або вище орієнтовної середньої поля, тож найнижчий тиск має якийсь інший емітер. Це може бути тому, що останній емітер розташований на нижчій ділянці рельєфу, або тому, що оцінка різниці тиску занадто мала. q<sub>last</sub>/q<sub>design</sub> — це інша, не пов’язана з рівномірністю перевірка щодо номінальної витрати виробника — корисна для виявлення перенасиченості або недостатнього тиску системи в цілому, але це окрема перевірка, яку слід читати поряд із показником рівномірності, оскільки конструктивна/номінальна витрата не залежить від фактичного середнього робочого тиску системи.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. Стандарти ASAE/ASABE для проектування мікроіригації використовують той самий підхід до втрат тертя з кількома отвірами.';
$ec_lang['ip_notes_5_term']='Проектування поливу';
$ec_lang['ip_notes_5_def']='Норма поливу та витрата системи/зони використовують орієнтовну середню витрату емітера поля (q<sub>avg,field</sub> — власна середня тестової латеральі, скоригована введеною орієнтовною різницею тиску), а не припущену норму: PR = q<sub>avg,field</sub> / A<sub>e</sub>, живлена скоригованою змодельованою цінністю. Розстави та системні/зональні рахунки бічної/емітерної кількості — окремі вхідні дані тут, оскільки тестовий шлях моделює тільки одну гірку-випадок гілки, а не кожну латераль у полі.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Розгалужена трубопровідна мережа';
$ec_lang['bpn_main_title']='Безкоштовний онлайн-калькулятор тиску розгалуженої трубопровідної мережі (без кілець)';
$ec_lang['bpn_main_desc']='Витрата й тиск розгалуженої (деревоподібної) трубопровідної мережі';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Статичний напір подачі: напір джерела при нульовій витраті. Рівень води у резервуарі чи баку над відміткою подачі, або напір насоса при закритій засувці. Додайте точки подачі 2 і 3, щоб задати криву насоса або змінного джерела; інструмент визначає напір при розрахунковій витраті.';
$ec_lang['bpn_elev_source']='Відмітка подачі';
$ec_lang['bpn_q_total']='Загальна витрата';
$ec_lang['bpn_q_total_tip']='Загальна витрата, що виходить від джерела (сума всіх витрат споживання в мережі).';
$ec_lang['bpn_p_min']='Найнижчий тиск';
$ec_lang['bpn_p_min_tip']='Найнижчий тиск нижче за течією у будь-якій точці мережі; критична точка подачі.';
$ec_lang['bpn_method']='Метод розрахунку тертя';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Ділянки труб';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Назва цієї ділянки труби. Інші ділянки посилаються на неї у стовпці «Верхня за течією».';
$ec_lang['bpn_upstream']='ID верхньої за течією';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID ділянки, що подає воду до цієї. Залиште порожнім, щоб слідувати за ділянкою безпосередньо вище (звичайний послідовний трубопровід). Введіть ID тут, щоб відгалузитися від іншої ділянки.';
$ec_lang['bpn_roughness_tip']='Шорсткість труби для обраного методу розрахунку тертя: Manning n, Hazen-Williams C або висота шорсткості Darcy-Weisbach e (довжина). Типова гладка пластикова труба: n близько 0,009, C близько 150, e близько 0,0015 мм.';
$ec_lang['bpn_demand']='Витрата споживання';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Фіксована витрата, що подається у кінці цієї ділянки нижче за течією.';
$ec_lang['bpn_demand_mult']='Множник витрати';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Масштабує витрату кожної ділянки одночасно — для розрахунку на годину пік або майбутнього зростання. Використайте 1 для витрат, введених як є.';
$ec_lang['bpn_elev_down']='Відм. НТ';
// Edited by TGH 2026-09-07
$ec_lang['bpn_q_line']='Витрата ділянки';
$ec_lang['bpn_q_line_tip']='Загальна витрата, що проходить через цю ділянку: власна витрата споживання плюс усі витрати споживання нижче за течією, які вона живить.';
$ec_lang['bpn_p_down']='Тиск НТ';
// Edited by TGH 2026-09-07
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Надлишковий тиск (напір) у вузлі нижче за течією цієї ділянки. Від\'ємне значення (позначене) означає тиск нижче атмосферного; перевірте проєкт.';
$ec_lang['bpn_sketch_heading']='Схема мережі';
$ec_lang['bpn_source_label']='Джерело';
$ec_lang['bpn_line_problem']='Ця ділянка не з\'єднана з джерелом: вона вказує на невідомий ID вище за течією, посилається сама на себе, повторює ID, який уже використовує інша ділянка, або утворює кільце. Ділянки, які не з\'єднані, лишаються нерозрахованими.';
$ec_lang['bpn_bad_id_short']='Помилковий ID';


$ec_lang['bpn_pressure_warn']='Низький/від\'ємний тиск; перевірте умови нижче атмосферного тиску';
$ec_lang['bpn_pressure_warn_short']='Низький';
$ec_lang['bpn_notes_1_term']='Послідовно за замовчуванням, розгалуження — виняток';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Якщо ID вищої за течією ділянки не вказано, ділянка продовжує попередню як послідовний трубопровід. Введіть ID вищої за течією ділянки, щоб відгалузитися від неї. За замовчуванням — послідовний трубопровід; дерево утворюється лише там, де вказано відгалуження.';
$ec_lang['bpn_notes_2_term']='Лише розгалужені мережі, без кілець';
$ec_lang['bpn_notes_2_def']='Кожна ділянка має рівно одну вищу за течією ділянку (дерево). Цей інструмент не розраховує кільцеві мережі, для яких потрібні ітераційні методи (EPANET або подібні). Оскільки в мережі немає кілець, розв’язок прямий і точний.';
$ec_lang['bpn_notes_3_term']='Без активних регуляторів тиску';
$ec_lang['bpn_notes_3_def']='Можна додати фіксований клапан місцевих втрат (значення k), але не редукційні чи підтримувальні клапани тиску (PRV/PSV). Їхній стан «відкрито/закрито» залежить від витрати й тиску, що вимагало б ітерацій.';
$ec_lang['bpn_supply2_q']='Витрата подачі 2';
$ec_lang['bpn_supply2_h']='Напір подачі 2';
$ec_lang['bpn_supply3_q']='Витрата подачі 3';
$ec_lang['bpn_supply3_h']='Напір подачі 3';
$ec_lang['bpn_supply_pt_tip']='Необов\'язкові точки кривої подачі 2 і 3. Введіть витрату й напір для кожної, щоб змоделювати насос або будь-яке джерело, напір якого падає зі збільшенням подачі; інструмент визначає напір при розрахунковій витраті. Точка 1 вище — статичний напір при нульовій витраті. Залиште точки 2 і 3 порожніми для сталого напору резервуара.';
$ec_lang['bpn_h_supply']='Напір подачі';
$ec_lang['bpn_h_supply_tip']='Напір джерела при розрахунковій витраті, визначений за кривою подачі. Дорівнює введеному напору джерела, якщо крива стала (резервуар).';
$ec_lang['bpn_supply1_h']='Статичний напір подачі';
$ec_lang['lpn_main_menu']='Мережа водопостачання';
$ec_lang['lpn_main_title']='Безкоштовне онлайн-моделювання мережі водопостачання на основі розв\'язувача EPANET';
$ec_lang['lpn_main_desc']='Аналіз мережі водопостачання: намалюйте кільцеву трубопровідну мережу або імпортуйте файли EPANET';
$ec_lang['lpn_title_units']='Одиниці {units}';
$ec_lang['lpn_tool_select']='Вибір';
$ec_lang['lpn_tool_add_junction']='Вузол';
$ec_lang['lpn_tool_add_reservoir']='Резервуар';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Ємність';
$ec_lang['lpn_tool_add_pipe']='Труба';
$ec_lang['lpn_tool_add_pump']='Насос';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Клапан';
$ec_lang['lpn_tool_add_text']='Текст';
// Junction and Pipe (Task 719): Tom's WaterCAD command, a junction, a pipe, a junction, a pipe, until Escape.
$ec_lang['lpn_tool_add_chain']='Ланцюжок вузлів і труб';
$ec_lang['lpn_tool_vertices']='Вершини';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Абонент';
$ec_lang['lpn_tool_add_meter_tip']='Укажіть точку абонента, потім його приєднання: зв’язок або вузол. Споживання, яке ви задаєте абоненту, додається до вузла на найближчому кінці цього зв’язку.';
$ec_lang['lpn_mode_add_meter']='Абонент: клацніть, де перебуває абонент, а потім клацніть трубу або вузол, що його обслуговує. Або натисніть Esc, щоб скасувати.';
$ec_lang['lpn_pane_tab_customers']='Абоненти';
// The Shape table (Task 779). Closed is a polygon's closure, not a pipe's or valve's status, so it
// is a key of its own and not lpn_field_closed: many languages use different words for the two.
// Points is the column of the Shape's points, "Shape S1, point 2" in lpn_snap_shape_point.
$ec_lang['lpn_pane_tab_shapes']='Фігури';
$ec_lang['lpn_pane_shape_closed']='Замкнена';
$ec_lang['lpn_pane_shape_points']='Точки';
$ec_lang['lpn_customer_heading']='Абонент {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Витрата на одне приєднання';
$ec_lang['lpn_field_meter_count']='Кількість приєднань';
$ec_lang['lpn_field_meter_total']='Загальна витрата';
$ec_lang['lpn_field_meter_total_tip']='Загальна витрата, що додається до вузла, названого нижче.';
$ec_lang['lpn_field_meter_pipe']='Під’єднаний елемент';
$ec_lang['lpn_field_meter_pipe_suggest']='Найближчий елемент — {id}. Введіть його тут, щоб обслуговувати цього абонента від нього.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Під’єднано до';
$ec_lang['lpn_field_meter_node_tip']='Вузол, до якого під’єднано цього абонента. Перетягніть точку під’єднання на трубу, щоб натомість обслуговувати його з певного положення вздовж цієї труби.';
$ec_lang['lpn_meter_pipe_unknown']='У цьому проєкті немає нічого з іменем {id}, тож абонента залишено там, де він був.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='У цьому проєкті немає графіка з іменем {id}, тож абонента залишено як був.';
$ec_lang['lpn_meter_placed']='Абонента {id} додано. Введіть його опис і витрату в таблиці «Абоненти» або виберіть його в режимі «Вибір», щоб відкрити вікно його властивостей.';
$ec_lang['lpn_field_meter_pipe_tip']='Елемент, до якого під’єднано це приєднання. Введіть інший тут або в таблиці «Абоненти», щоб змінити його, або перетягніть точку під’єднання на інший елемент.';
$ec_lang['lpn_field_meter_station']='Положення вздовж труби (%)';
$ec_lang['lpn_field_meter_station_tip']='Наскільки далеко вздовж труби під’єднано приєднання, у відсотках труби від її першого вузла до другого. 0 — на одному кінці, 100 — на іншому. Коло на трубі робить те саме вказівником миші.';
$ec_lang['lpn_field_meter_offset']='Зміщення від труби';
$ec_lang['lpn_field_meter_offset_tip']='Додатне значення — праворуч від труби, якщо дивитися від її першого вузла до другого. Введення значення тут може перемістити абонента на інший бік магістралі, і завжди ставить лінію приєднання під прямим кутом до магістралі.';
$ec_lang['lpn_field_meter_lumped']='Додано до вузла';
$ec_lang['lpn_field_meter_lumped_tip']='Найближчий вузол; витрати цього абонента додаються туди.';
$ec_lang['lpn_node_customers']='Витрати абонентів';
$ec_lang['lpn_node_customers_tip']='Список абонентів, доданих сюди, бо цей вузол був для них найближчим. Споживання абонентів додається до інших споживань, перелічених тут. Абонента редагують там, де він розміщений на карті, або в таблиці «Абоненти».';
$ec_lang['lpn_node_customers_sum']='{total} {unit} від абонентів ({n})';
$ec_lang['lpn_customer_detached']='⚠ Цей абонент не під’єднаний до труби, тож його витрата не входить у результати. Видаліть його або намалюйте трубу й перемістіть абонента на неї.';
$ec_lang['lpn_customer_fixed_head']='⚠ На ближньому кінці цієї труби фіксований рівень води, тож ця витрата не впливає на розрахунок.';
$ec_lang['lpn_customer_node_inactive']='Цього абонента приєднано до вузла, який у цьому сценарії неактивний, тому його споживання не входить до розрахунку.';
$ec_lang['lpn_customer_detached_count']='Абоненти, не під’єднані до труби ({n}). Їхня витрата не врахована.';
$ec_lang['lpn_meter_pick_pipe']='Тепер виберіть трубу або вузол, що обслуговує цього абонента. Абонент залишається там, де ви його розмістили. Натисніть Escape, щоб скасувати.';
$ec_lang['lpn_inp_export_flat_customers']='Файл EPANET не містить абонентів. Витрата абонентів цього проєкту ({n}) записується як рядок витрати на вузлі, до якого призначено кожного абонента, під тегом абонента. Файл не фіксує самого абонента: його положення, трубу, що його обслуговує, місце вздовж цієї труби, де під’єднано приєднання, і кількість приєднань, яку він представляє. Ця інформація залишається в проєкті; збережіть файл проєкту, щоб зберегти її.';

$ec_lang['lpn_area_hint_window_start']='Клацніть по одному куту вікна.';
$ec_lang['lpn_area_hint_window_go']='Клацніть по протилежному куту, щоб завершити.';
$ec_lang['lpn_area_hint_lasso_start']='Клацніть, щоб почати контур.';
$ec_lang['lpn_area_hint_lasso_go']='Рухайте курсор, щоб намалювати контур. Клацніть, щоб завершити.';
$ec_lang['lpn_area_hint_polygon_start']='Укажіть перший кут області-багатокутника. Двічі клацніть, щоб завершити.';
$ec_lang['lpn_area_hint_polygon_go']='Клацайте по кожному куту. Двічі клацніть по останньому, щоб завершити.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Утримуйте Shift під час вибору, щоб продовжити наявний вибір, додаючи або знімаючи (перемикаючи) те, що ви вибираєте.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Натисніть на карту й обведіть навколо потрібного, потім відпустіть.';
$ec_lang['lpn_area_hint_touch_go']='Обведіть навколо потрібного, потім відпустіть, щоб завершити.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Показувати це';
$ec_lang['lpn_multi_title']='{n} вибрано';
$ec_lang['lpn_multi_varies']='Різні';
$ec_lang['lpn_multi_applied']='Встановлено {prop} для {n}.';
$ec_lang['lpn_multi_no_fields']='У цих елементів немає нічого спільного, що можна встановити тут разом.';
$ec_lang['lpn_pane_pasted']='Вставлені клітинки ({n}). Клітинки без змін ({skipped}).';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Вставлені рядки ({n}). Рядки, додані до мережі ({created}).';
$ec_lang['lpn_pane_pasted_rows_skipped']='Вставлені рядки ({n}). Рядки, додані до мережі ({created}). Клітинки без змін ({skipped}).';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Клацніть тут і вставте рядки з електронної таблиці, щоб додати їх.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Вставити як нові рядки в кінець таблиці';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Натисніть Ctrl+V, щоб додати скопійовані рядки в кінець цієї таблиці. Натисніть Esc, щоб скасувати.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Рядки в цій вставці ({n}). Рядки, що поміщаються в таблицю ({fit}). Додати інші рядки ({extra}) як нові рядки внизу?';
$ec_lang['lpn_pane_paste_overflow_add']='Додати рядки ({extra})';
$ec_lang['lpn_pane_paste_overflow_fit']='Вставити лише рядки, що поміщаються ({fit})';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Рядки в цій вставці ({n}). Рядки, що поміщаються в таблицю ({fit}). Інші рядки ({extra}) не можна додати як нові рядки: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='ID, що не збігаються ({n}). Усе одно вставити?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Нічого не вставлено. {reasons}';
$ec_lang['lpn_pane_paste_more']='Рядки з проблемами, не показані тут: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Рядок {row}: новому рядку потрібен ID.';
$ec_lang['lpn_pane_paste_bad_id']='Рядок {row}: ID {id} містить пробіл або лапку.';
$ec_lang['lpn_pane_paste_id_taken']='Рядок {row}: ID {id} уже використовується.';
$ec_lang['lpn_pane_paste_id_twice']='Рядок {row}: ID {id} використано двічі в цій вставці.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Рядок {row}: новому вузлу потрібні і {first}, і {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Рядок {row}: новому зв’язку потрібні вузол «Від» і вузол «До».';
$ec_lang['lpn_pane_paste_no_node']='Рядок {row}: вузол {id} ще не існує. Спершу вставте вузли, потім зв’язки.';
$ec_lang['lpn_pane_paste_same_ends']='Рядок {row}: «Від» і «До» — той самий вузол.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Рядок {row}: {text} — недійсне значення для {col}.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Рядок {row}: новому Тексту потрібні і {first}, і {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Рядок {row}: {id} — це ще не вузол і не труба в цій мережі. Спершу вставте його, а потім цей Текст.';
$ec_lang['lpn_pane_paste_customer_no_position']='Рядок {row}: новому Абоненту потрібні і {first}, і {second}.';
$ec_lang['lpn_pane_paste_shape_no_points']='Рядок {row}: новій Фігурі потрібні Точки.';
// {pair} is the Points heading's own pair in this project's axis words: X/Y, N/E or Lat/Lon.
$ec_lang['lpn_pane_paste_shape_bad_points']='Рядок {row}: {text} не є списком точок. Запишіть кожну точку як {pair}, з крапкою (.) як десятковим знаком, а точки розділіть символом |.';
$ec_lang['lpn_pane_paste_shape_closed_few']='Рядок {row}: замкнена Фігура потребує щонайменше трьох точок.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Рядок {row}: новому Абоненту потрібна під’єднана труба або вузол.';
$ec_lang['lpn_pane_paste_no_pipe']='Рядок {row}: труби {id} ще не існує. Спершу вставте свої труби, потім абонентів.';
$ec_lang['lpn_pane_paste_no_customer_node']='Рядок {row}: вузла {id} ще не існує. Спершу вставте свої вузли, потім абонентів.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Рядок {row}: у вузла {id} немає труби, до якої міг би приєднатися Абонент.';
$ec_lang['lpn_pane_filled']='Заповнені вниз клітинки ({n}). Клітинки без змін ({skipped}).';
$ec_lang['lpn_pane_filldown']='Заповнити вниз';
$ec_lang['lpn_pane_delete_element']='Видалити елемент';
$ec_lang['lpn_pane_delete_elements']='Видалити елементи';
$ec_lang['lpn_pane_fill_none']='У цьому виборі немає нічого, що можна заповнити вниз.';
$ec_lang['lpn_pane_ctrlenter_filled']='Заповнені клітинки ({n}). Клітинки без змін ({skipped}).';
$ec_lang['lpn_pane_hide_col']='Сховати цей стовпець';
$ec_lang['lpn_pane_hide_cols']='Сховати ці стовпці';
$ec_lang['lpn_pane_show_all_cols']='Показати всі стовпці';
$ec_lang['lpn_pane_sort_asc']='Сортувати за зростанням';
$ec_lang['lpn_pane_sort_desc']='Сортувати за спаданням';
$ec_lang['lpn_pane_manage_cols']='Керувати стовпцями…';
$ec_lang['lpn_pane_manage_cols_title']='Керування стовпцями';
$ec_lang['lpn_pane_manage_cols_show']='Показати';
$ec_lang['lpn_pane_manage_cols_up']='Перемістити вгору';
$ec_lang['lpn_pane_manage_cols_down']='Перемістити вниз';
$ec_lang['lpn_pane_manage_cols_top']='Перемістити на початок';
$ec_lang['lpn_pane_manage_cols_bottom']='Перемістити в кінець';
$ec_lang['lpn_pane_manage_cols_width']='Ширина (em)';
$ec_lang['lpn_pane_width_tip']='Ширина стовпців зберігається в цьому браузері, а не в проєкті. Двічі клацніть роздільник стовпців, щоб відновити типову ширину.';
$ec_lang['lpn_pane_colmenu_tip']='Сховати стовпці або керувати ними';
$ec_lang['lpn_tool_area_window']='Вибрати вікном';
$ec_lang['lpn_tool_area_lasso']='Вибрати ласо';
$ec_lang['lpn_tool_area_polygon']='Вибрати багатокутником';
$ec_lang['lpn_tool_delete']='Видалити';
$ec_lang['lpn_tool_zoom_extent']='Показати все';
$ec_lang['lpn_tool_zoom_selection']='Наблизити до вибраного';
$ec_lang['lpn_tool_zoom_window']='Наблизити вікном';
$ec_lang['lpn_zoom_in']='Наблизити';
$ec_lang['lpn_zoom_out']='Віддалити';
$ec_lang['lpn_new_text']='Текст';
$ec_lang['lpn_field_text_bold']='Жирний текст';
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
$ec_lang['lpn_field_text_anchor']='Приєднано до';
$ec_lang['lpn_field_text_align']='Горизонтальне вирівнювання';
$ec_lang['lpn_field_text_align_left']='Ліворуч';
$ec_lang['lpn_field_text_align_center']='По центру';
$ec_lang['lpn_field_text_align_right']='Праворуч';
$ec_lang['lpn_field_text_valign']='Вертикальне вирівнювання';
$ec_lang['lpn_field_text_valign_top']='Згори';
$ec_lang['lpn_field_text_valign_middle']='Посередині';
$ec_lang['lpn_field_text_valign_bottom']='Знизу';
$ec_lang['lpn_field_text_rotation']='Кут (градуси)';
$ec_lang['lpn_field_text_match_pipe']='Повернути на кут найближчого з\'єднання';
$ec_lang['lpn_field_text_flip']='Повернути на 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Прикріплений елемент';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Цей текст розміщено достатньо близько до об’єкта, щоб слідувати за ним, тож він рухається разом із цим об’єктом і має виноску. Текст на виносці бере своє горизонтальне й вертикальне вирівнювання зі сторони, на якій він стоїть, тому ці два рядки не пропонуються, поки він прикріплений.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Коефіцієнт крапельниці';
$ec_lang['lpn_field_emitter_tip']='Додаткова витрата, що залежить від тиску, для дощувача, відкритого випуску або змодельованої витоку. Витрата, яку вона дає, дорівнює цьому коефіцієнту, помноженому на тиск у степені показника крапельниці, який задається один раз для всієї мережі в «Налаштування, Розрахунок, Гідравліка». Залиште поле порожнім для звичайного вузла.';
$ec_lang['lpn_field_elev']='Відмітка';
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
$ec_lang['lpn_field_head']='Напір';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Рівень водної поверхні в резервуарі, виміряний як висота, а не як тиск. Залиште поле порожнім, щоб водна поверхня збіглася з відміткою резервуара.';
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
$ec_lang['lpn_field_tank_base_elev']='Відмітка дна';
$ec_lang['lpn_field_tank_base_elev_tip']='Відмітка дна ємності, від якої відлічують глибину води й об’єм. Якщо поле порожнє, дно міститься на відмітці землі.';
$ec_lang['lpn_tank_ground_elev_tip']='Відмітка землі біля ємності. Тиск в ємності відлічують від неї, як у вузлі.';
$ec_lang['lpn_field_tank_level']='Глибина води';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Глибина води в ємності, відлічена вгору від дна ємності. Рівень поверхні води дорівнює відмітці дна ємності плюс ця глибина.';
$ec_lang['lpn_field_tank_minlevel']='Найменша глибина води';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Глибина води, за якої ємність вважається порожньою, відлічена вгору від дна ємності.';
$ec_lang['lpn_field_tank_maxlevel']='Найбільша глибина води';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Глибина води, за якої ємність вважається повною, відлічена вгору від дна ємності.';
$ec_lang['lpn_field_tank_diameter']='Діаметр ємності';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Ширина ємності від стінки до стінки. Вимірюється в тих самих одиницях, що й відмітка, а не в одиницях діаметра труби. Вона визначає, скільки води вміщує задана глибина.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Відмітка поверхні води в ємності: відмітка дна плюс глибина води.';
$ec_lang['lpn_close']='Закрити';
// The corner buttons beside every standing box's X (Task 441). Each is an icon-only button, so the
// value is its name: the hover tip and the screen reader's label at once. Auto-hide is a toggle and
// says its state through aria-pressed, so one wording serves both states (AutoCAD's own word).
$ec_lang['lpn_dock_left']='Закріпити ліворуч від карти';
$ec_lang['lpn_dock_right']='Закріпити праворуч від карти';
$ec_lang['lpn_dock_float']='Плаваюча';
$ec_lang['lpn_dock_autohide']='Автоприховування';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Властивості';
// What a docked Properties box says while nothing is selected: it stays in its dock (Tom, 2026-10-07).
$ec_lang['lpn_popup_none']='Нічого не вибрано. Виберіть елемент на карті, щоб побачити його властивості.';
$ec_lang['lpn_empty_hint']='Скористайтеся «Файл → Новий проєкт», щоб відкрити приклад. Або почніть з додавання резервуара, вузла й труби з панелі інструментів.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Ваша мережа неушкоджена.';
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
$ec_lang['lpn_examples_welcome']='Ласкаво просимо до моделювання мереж водопостачання за допомогою розв\'язувача EPANET';
$ec_lang['lpn_examples_heading']='Відкрити копію прикладу';
$ec_lang['lpn_examples_sub']='Кожен приклад відкривається як копія. Змініть і збережіть її або відкрийте нову копію, щоб почати спочатку.';
$ec_lang['lpn_examples_open']='Відкрити';
$ec_lang['lpn_examples_menu']='Відкрити приклад…';
$ec_lang['lpn_examples_blank']='Або почніть звідси';
// The SAME exit, worded for the other way in, is lpn_close (Task 699 merged its own 'Close' key
// into it). Opened from File the user already has work on screen, so "start with a blank map"
// reads as "discard it" and they do not dare press the only button that leaves (Tom, 2026-08-17:
// "I can't back out of the gallery... I am forced to open an example"). Closing never touches a
// project either way.
$ec_lang['lpn_examples_size']='Вузлів: {nodes}, з\'єднань: {links}';
$ec_lang['lpn_examples_failed']='Не вдалося завантажити приклади. Скористайтеся «Файл → Новий проєкт», щоб почати креслення.';
$ec_lang['lpn_examples_loading']='Завантаження прикладів…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Виправити щось';
$ec_lang['lpn_help_notes']='Примітки до цієї сторінки';
$ec_lang['lpn_guide_about_heading']='Про цей калькулятор';
$ec_lang['lpn_guide_group_from']='З меню «{menu}»';
$ec_lang['lpn_guide_menu_named']='Меню «{menu}»';
// **THE NEW BOX, TASK 745** (Tom, 2026-09-29: reorganize Help into three groups, with a new
// "Tables and Hotkeys" box gathering all table help and all keyboard shortcuts). One key names
// both the Help row and the box's own title bar, the same pattern lpn_help_notes already carries
// for the Notes box.
$ec_lang['lpn_help_hotkeys']='Таблиці та гарячі клавіші';
// **THE USER GUIDE** (Tom, 2026-10-06: "Maybe items 2 and 3 combined into a simple User Manual or
// whatever the 2026 thing is?"; Ida's design). Names both the Help row and the box's title bar. It
// replaces lpn_help_hotkeys and the Help > Toolbar fly-out (lpn_help_icons, which still heads the
// box's Toolbar section).
$ec_lang['lpn_help_manual']='Посібник користувача';
// The Guide's contents rail, its search, its Boxes section and the "?" in every box's title bar.
$ec_lang['lpn_guide_contents']='Зміст';
$ec_lang['lpn_guide_rail_hide']='Сховати зміст';
$ec_lang['lpn_guide_rail_show']='Показати зміст';
$ec_lang['lpn_guide_search']='Пошук у посібнику';
$ec_lang['lpn_guide_boxes_heading']='Вікна';
$ec_lang['lpn_guide_boxes_intro']='Кожне вікно можна пересувати, змінювати його розмір, закріплювати ліворуч або праворуч від карти чи закривати. Знак «?» у заголовку вікна відкриває його довідку.';
// Tom's own wording, 2026-10-07 (his typo "to not" corrected). Below lpn_guide_boxes_intro.
$ec_lang['lpn_guide_boxes_autohide']='Коли вказівник залишає вікно без фокуса, воно ховається після короткої затримки. Вікно з фокусом ховається, якщо клацнути поза ним, натиснути Esc або вийти з нього клавішею Tab, коли вказівник міститься деінде.';
$ec_lang['lpn_guide_box_help']='Довідка про це вікно';
// A Boxes entry whose box shares its name with a section of the Guide ("Screenshot"), in the Guide
// only, so its Contents list does not show one word twice. Keep {box} as it is.
$ec_lang['lpn_guide_box_named']='Вікно «{box}»';
// Above the Toolbar rows, shown only while some are dimmed (on a phone, or Calculate while
// Recalculate automatically is on): a grey name otherwise reads as a disabled button.
$ec_lang['lpn_guide_dimmed']='Затемнена назва — це кнопка, яка зараз схована на панелі інструментів.';
// One entry in the Guide's Boxes section for each box, shown by the "?" in its title bar. Fire flow,
// Critical assets, and Demand scaling carry theirs in lpn_ff_intro and the keys that follow it.
$ec_lang['lpn_guide_text_popup']='Показує властивості вибраного елемента, тексту чи абонента або кількох вибраних елементів. Вікно відкривається поруч із вибраним або там, куди його було пересунуто востаннє. Змінене значення одразу змінює мережу, а підпис елемента на карті й панель «Таблиці» оновлюються. Результати розрахунку показано рядками лише для читання, їх не можна редагувати.';
$ec_lang['lpn_guide_text_find_popup']='Знаходить елементи, що відповідають умові, наприклад усі труби менші за 8 дюймів або всі вузли з тиском нижче 40 psi, і може змінити одну властивість в усіх них однією операцією. Використовуйте його, щоб перевірити модель до розрахунку (відсутня відмітка, діаметр, уведений в неправильних одиницях), щоб перелічити проблемні місця після розрахунку (низький тиск, висока швидкість) і щоб внести одне виправлення в багатьох елементах.\n\nСписки «Що шукати», «Властивість», «Умова» та «Значення» складають одну умову й записують її рядком тексту в полі «Запит». Рядок можна також редагувати безпосередньо, і списки йому відповідатимуть. Запит, який списки не можуть виразити, наприклад дві умови, поєднані через АБО, ховає списки, доки не натиснути кнопку «Використати елементи керування натомість». Щоб виконати пошук, натисніть Enter у полі «Запит» або кнопку «Знайти».';
$ec_lang['lpn_guide_text_settings_box']='Містить налаштування відкритого проєкту й цього браузера, впорядковані за розділами. Щоб відкрити вікно, виберіть Вода, Налаштування. Дві кнопки, «Скинути значення за замовчуванням» і «Почати заново», скидають їх. У вікні працює пошук: введіть одне чи кілька слів у полі «Пошук налаштувань», щоб побачити лише ті налаштування, що містять усі ці слова. Розташування й розмір цього вікна зберігаються лише в цьому браузері.';
$ec_lang['lpn_guide_text_library_box']='Містить графіки, криві, типи труб, списки фітингів, керування й правила проєкту, по одному розділу на кожне. Щоб відкрити вікно, виберіть Вода, Бібліотеки. Елемент посилається на графік, криву, тип труби чи список фітингів за ID цього об’єкта, а сам об’єкт створюють, редагують і видаляють тут. Усе зберігається разом із проєктом, а «Скасувати» скасовує й зміну, зроблену тут. Розташування й розмір вікна зберігаються лише в цьому браузері.';
$ec_lang['lpn_guide_text_energy_box']='Показує споживання енергії, пікову потужність і вартість кожного насоса за останній розрахунок за розширений період, використовуючи ефективність кожного насоса й ціну енергії, задану в «Налаштування, Енергія». Потрібні «Загальний час роботи» в налаштуваннях і розрахована мережа. Мережу воно не змінює.';
$ec_lang['lpn_guide_text_contour_box']='Керує картою ізоліній, яку малюють на карті за значенням вузла, вибраним у полі «Забарвлювати вузли за»: кольорова схема, заливка та її непрозорість, інтервал і підписи ліній рівня та те, як далеко колір сягає від кожної труби. Вимкнення ховає карту ізоліній і залишає кольори вузлів. Змінюється лише відображення, а не мережа.';
$ec_lang['lpn_guide_text_scncmp_box']='Розраховує кожен сценарій, позначений у вікні «Сценарії: керування» (усі, якщо позначки не було знято), на копії креслення й зводить у таблицю для кожного з них кількість перевизначень, множник споживання, загальний час роботи, крок часу гідравлічного розрахунку, найнижчий тиск і найвищу швидкість. Щоб відкрити вікно, виберіть Вода, Звіти, Порівняння сценаріїв. Порівняння починається при відкритті вікна й починається знову після кожного редагування, поки вікно залишається відкритим.\n\nПроєкт воно не змінює, а відкритий сценарій лишається таким, яким був.';
$ec_lang['lpn_guide_text_rptbox']='Показує текстовий звіт, який розв’язувач EPANET записав за останній розрахунок за розширений період, разом із попередженнями й зведенням про мережу. Кожен розрахунок за розширений період замінює його; розрахунок для одного моменту не замінює, і редагування залишає попередній звіт на місці.';
$ec_lang['lpn_guide_text_status_box']='Перелічує в хронологічному порядку кожну зміну під час останнього розрахунку за розширений період: відкриття чи закриття насоса, клапана або труби, початок наповнення чи спорожнення ємності або її повне наповнення чи спорожнення, а також кожен часовий крок, що не повністю збігся. Наведено лише зміни, а не кожен часовий крок.';
$ec_lang['lpn_guide_text_full_box']='Перелічує кожен вузол і кожне з’єднання на кожному звітному часовому кроці в одиницях, показаних на панелі «Таблиці». Без розрахунку за розширений період показує поточний розв’язок для одного моменту. Завантаження чи друк охоплює кожен часовий крок, а таблиця показує по одному.';
$ec_lang['lpn_guide_text_calib_box']='Порівнює файл польових вимірювань із розрахованими результатами в тих самих місцях і в той самий час, по одному файлу для кожного параметра. Файл зберігається лише на час поточного сеансу й не зберігається разом із проєктом.';
$ec_lang['lpn_guide_text_hotkeys_popup']='Посібник користувача. Його розділи: Користування посібником, Панель інструментів, Меню, Карта, Знімок екрана, Таблиці, Вікна, Про цей калькулятор і Примітки до цієї сторінки. Розділи «Панель інструментів» і «Меню» перелічують кожну кнопку панелі й кожен рядок меню з клавіатурним скороченням, у розділі «Вікна» є запис для кожного вікна, а решта розділів описують, що робить сторінка. Вибір рядка показує, де розташовано цей елемент керування, але ніколи його не запускає. Щоб виконати пошук, натисніть Ctrl+K або /, коли фокус у посібнику. Ctrl+K не шукає, поки відкрите запитання.';
// The Find and replace chapter beyond its opening paragraphs, in the Guide's Boxes section
// (Tom, 2026-10-07). Each _def is HTML: keep the tags. A query inside <code> runs as written in
// English on a page in any language; translate it with the words the Find box shows in your
// language, or leave it in English. Asset IDs (60, 247, 330) and the numbers are measured on Net1
// and Net3 by dev/lpn-spike/user-guide-find-harness.js: never change them in translation.
$ec_lang['lpn_guide_find_query_term']='Мова запитів';
$ec_lang['lpn_guide_find_query_def']='<table class="lpn-notes-table"><tbody><tr><td><code>Scope.Property condition value</code></td><td>Одна умова. Область: Усе, Вузол, Резервуар, Ємність, Труба, Насос, Клапан, Текст, Абонент або Джерело. Властивість — будь-який запис зі списку «Властивість» для цієї області.</td></tr><tr><td>Умови</td><td>дорівнює, більше за, менше за, містить, n найбільших, n найменших і порожньо. «Містить» застосовується лише до тексту. У «n найбільших» і «n найменших» n є кількістю, як у «5 найбільших». З самою літерою n, як у <code>Pipe.Velocity n highest</code>, або з порожнім полем «Значення» перелічується 10 елементів. «Порожньо» знаходить елементи, що не мають значення цієї властивості. Для «Зв\'язність» є чотири умови, і значення не потрібне.</td></tr><tr><td>Значення</td><td>Число вводять без одиниці, в одиницях, показаних у «Властивості» та на панелі «Таблиці»: 40, а не 40 psi. Текст, зокрема ID, беруть в одинарні чи подвійні лапки: <code>\'60\'</code>.</td></tr><tr><td>І, АБО та дужки</td><td>«І» виконується раніше за «АБО», а дужки групують умови. «НЕ» недоступне.</td></tr><tr><td>Написання</td><td>Регістр слів не має значення. Англійські слова, зокрема AND і OR, приймаються в усіх мовах, тож запит, скопійований із цього посібника, працює на сторінці будь-якою мовою.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_examples_term']='Приклади на Net3';
$ec_lang['lpn_guide_find_examples_def']='<p>Відкрийте приклад Net3, щоб їх повторити. Тиск наведено в psi, швидкість у ft/s.</p><table class="lpn-notes-table"><tbody><tr><td><code>Everything.ID equal to \'60\'</code></td><td>Вузол 60 і труба 60. Вузол і труба можуть мати однаковий ID, тож пошук за ID в області «Усе» може повернути більше одного елемента.</td></tr><tr><td><code>Junction.Pressure below 40</code></td><td>Вузли 10, 40, 50, 20 і 153, спершу з найнижчим тиском. У вузлі 10 тиск -0,6 psi, тобто від’ємний, що потребує перевірки.</td></tr><tr><td><code>Pipe.Velocity 5 highest</code></td><td>Труби 60, 329, 125, 123 і 149, спершу з найвищою швидкістю. У трубі 60 швидкість 9,3 ft/s.</td></tr><tr><td><code>Junction.Pressure below 20 OR Pipe.Velocity above 5</code></td><td>Вузли 10, 20, 40 і 50 та труби 60, 125 і 329: низький тиск і висока швидкість в одному списку.</td></tr><tr><td><code>Junction.Pressure below 40 AND Junction.Elevation above 100</code></td><td>Вузли 10, 20, 40 і 50: низький тиск на високій місцевості. Обидві умови мають стосуватися одного виду елементів: <code>Junction.Pressure below 40 AND Pipe.Velocity above 3</code> нічого не знаходить, бо жоден елемент не є одночасно вузлом і трубою.</td></tr><tr><td><code>Pipe.Closed equal to \'closed\'</code></td><td>Труба 330, єдина труба, закрита у файлі Net3.</td></tr><tr><td><code>Junction.Connectivity no open path to a source</code></td><td>Нічого, у файлі в тому вигляді, в якому його поширюють. Якщо закрити трубу 247 (див. «Замінити» й «Скасувати»), то вузли 215, 217, 219 і 225: вузли, які аварія на трубі 247 залишила б без водопостачання. Повторення цього для кожної труби — це аналіз критичності.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_results_term']='Результати, вибір і таблиці';
$ec_lang['lpn_guide_find_results_def']='<p>Знайдені елементи перелічено під кнопкою «Знайти». «Більше за» і «n найбільших» перелічують спершу найбільше значення, «менше за» і «n найменших» — спершу найменше, а інші умови — за знайденим значенням, потім за ID. Запит з «І» чи «АБО» перелічує вузли, потім з’єднання, кожні за ID. Єдиний збіг одразу показується на карті. Виберіть рядок, щоб відцентрувати карту на цьому елементі. Якщо нічого не вибрано, елемент також стає вибраним; якщо щось вибрано, елемент підсвічується, а вибір не змінюється. Shift+клацання або Ctrl+клацання по рядку додає його до вибору або виключає з нього. Пошук сам не вибирає всі збіги.</p><p>Кнопка «Фільтр у поточній таблиці» застосовує той самий запит до панелі «Таблиці». Кожна таблиця, до якої застосовується запит, показує лише відповідні рядки, а над ними — запит і кількість рядків. Щоб вибрати всі збіги на карті, виберіть ці рядки й оберіть «Вибрати на карті» в контекстному меню. Фільтр таблиці не зберігається разом із проєктом і зникає після перезавантаження сторінки. Рядок, відредагований так, що він більше не відповідає, залишається в таблиці затемненим і з позначкою-попередженням, доки знову не натиснути кнопку «Фільтр у поточній таблиці».</p>';
$ec_lang['lpn_guide_find_replace_term']='Замінити й скасувати';
$ec_lang['lpn_guide_find_replace_def']='<p>Частина вікна «Зміна знайденого» записує одну властивість у кожному елементі, знайденому запитом. Виберіть властивість у списку «Властивість для зміни», введіть нове значення в полі «Нове значення» у показаних одиницях і натисніть кнопку «Замінити». Тоді вікно повідомить, скільки елементів зміниться, не рахуючи тих, що вже мають нове значення. Натисніть кнопку «Змінити їх», щоб застосувати зміну, або «Скасувати». Одне «Скасувати» відкочує всю заміну.</p><p>Приклад на Net1: <code>Pipe.Diameter below 10</code> знаходить труби 31, 122, 113 і 121. Виберіть «Діаметр», введіть 10 і натисніть «Замінити»; вікно покаже «Змінити 4 елементів?». Натисніть «Змінити їх», щоб задати всім чотирьом трубам 10 дюймів. Одне «Скасувати» повертає їм 6 і 8 дюймів.</p><p>Приклад на Net3: <code>Pipe.ID equal to \'247\'</code> знаходить трубу 247. Виберіть «Закрита», ще раз виберіть «Закрита» у списку «Нове значення» й натисніть «Замінити», потім «Змінити їх», щоб закрити трубу для наведеного вище прикладу зв’язності. «Скасувати» знову відкриває її.</p><p>Заміна потребує одного виду елементів, тож для області «Усе» спершу виберіть вид елементів у списку «Що шукати». У сценарії, відмінному від базового, заміну зберігають у цьому сценарії, як і ту саму правку у «Властивості». Де доступні відмітки Mapbox, відмітку можна замінити з DEM Mapbox замість набраного значення.</p>';
$ec_lang['lpn_guide_find_notes_term']='На що звернути увагу';
$ec_lang['lpn_guide_find_notes_def']='<ul><li>Значення порівнюються з повною точністю, а перелічуються з чотирма десятковими знаками. «Дорівнює» рідко збігається з розрахованим результатом; використовуйте «більше за» і «менше за».</li><li>Тиск, напір, витрата, швидкість та інші результати — це результати останнього розрахунку. Якщо знято позначку «Перераховувати автоматично», вони описують мережу такою, якою вона була під час останнього розрахунку.</li><li>«Більше за» і «менше за» для тексту використовують словниковий порядок, а числа — числовий: на Net1 <code>Junction.ID above \'20\'</code> знаходить вузли 21, 22, 23, 31 і 32.</li><li>В області «Усе» пропонуються лише ID, «Опис», «Тег» і «Зв\'язність». Виберіть вид елементів у списку «Що шукати», щоб побачити повний перелік його властивостей.</li><li>Елемент «Текст» не має ID. Шукайте його за словами, як у <code>Text.Text contains \'pump\'</code>.</li><li>Чотири умови «Зв\'язність» для вузла: без з’єднань у вузлі, без відкритих з’єднань у вузлі, без шляху з’єднань до джерела та без відкритого шляху до джерела. Джерело — це резервуар або ємність.</li></ul>';
// The Scenarios chapter, in the entry for the Scenario manager box (Task 785). Written from the code of
// feat/bentley-interop and held by dev/lpn-spike/user-guide-scenarios-harness.js. The box's own help
// (lpn_sm_help, Tom's wording of 2026-10-16) comes first in the entry; nothing here restates or
// contradicts it. Terms follow the Find and replace chapter's pattern.
$ec_lang['lpn_guide_scn_use_term']='Для чого потрібен сценарій';
$ec_lang['lpn_guide_scn_use_def']='<p>Сценарії зберігають у тому самому проєкті багато проєктних рішень, виглядів чи ситуацій: середню добу, максимальну добу, пікову годину, рисунок для звіту, магістраль, виведену з роботи, або запропоновану заміну. Мережу креслять один раз, у сценарії «Базовий». Кожен інший сценарій містить лише свої перевизначення, тобто значення, що відрізняються від сценарію, від якого він успадковує, а решту бере з того сценарію. Тому зміна в Базовому доходить до кожного сценарію, який не перевизначив це значення.</p><p>Новий проєкт починається з шести готових сценаріїв: 1. Тест витрати: статичний, 2. Тест витрати: середній, 3. Тест витрати: максимальний, 4. Середня доба, 5. Максимальна доба і 6. Пікова година. Це звичайні сценарії, які можна перейменовувати, редагувати й видаляти. Кожен починається з одного перевизначення, свого множника споживання: 1 для тестів витрати й Середньої доби, 2 для Максимальної доби і 3 для Пікової години. Множники є умовними значеннями, їх слід замінити значеннями для системи, яку моделюють. Проєкт, відкритий із файлу, зокрема кожен приклад, або імпортований із файлу EPANET має лише Базовий.</p><p>Витрату на пожежогасіння перевіряють у вікні «Витрата на пожежогасіння: аналіз», яке випробовує кожен вузол або вибрані вузли. Максимальна доба — це сценарій, який зазвичай відкрито, коли його запускають.</p>';
$ec_lang['lpn_guide_scn_open_term']='Відкритий сценарій';
$ec_lang['lpn_guide_scn_open_def']='<p>Кнопка «Сценарій» у смузі стану під картою називає відкритий сценарій і рахує його перевизначення, наприклад: Сценарій: Базовий | К-сть перевизначень: 0. Клацніть її або виберіть Вода, Сценарії, щоб перемкнути сценарій чи додати, скопіювати, перейменувати або видалити сценарій. Кожен сценарій у списку показує в дужках кількість своїх перевизначень, а біля відкритого стоїть позначка. Рядок «Сценарії: керування» відкриває дерево сценаріїв і альтернатив. Він затемнений, поки вибрано «Базовий режим».</p><p>Креслення, підписи, Властивості, Таблиці й результати — усе належить відкритому сценарію, і сторінка розраховує лише відкритий сценарій. Порівняння сценаріїв, описане в окремому записі, розраховує решту на копіях. Відкритий сценарій зберігається разом із проєктом.</p>';
$ec_lang['lpn_guide_scn_marks_term']='Де видно перевизначення';
$ec_lang['lpn_guide_scn_marks_def']='<p>На карті елемент, що має перевизначення у відкритому сценарії, обведено бурштиновим колом, а елемент, що успадковує перевизначення від батьківського сценарію чи альтернативи, обведено сірою пунктирною лінією. Для споживання, діаметра, шорсткості, коефіцієнта місцевих втрат і довжини коло з’являється, лише поки Налаштування, Візуалізація, Підписи вузлів чи Підписи з’єднань показує це значення на карті; перевизначення будь-якої іншої властивості завжди має своє коло. У Таблицях клітинка зі значенням, заданим відкритим сценарієм, бурштинова, а її підказка називає альтернативу, що його містить, наприклад: Фізична альт.: Більша магістраль. «Показати сценарії» в меню клітинки таблиці перелічує кожен елемент по одному разу для кожного сценарію.</p><p>Кожен рядок Властивостей, який сценарій може перевизначити, має позначку ліворуч. Суцільна крапка означає, що відкритий сценарій перевизначає значення; клацніть її, щоб скасувати перевизначення. Порожня крапка означає, що значення успадковане; клацніть її, щоб показане значення стало перевизначенням. Трикутник означає, що значення перевизначають сценарії нижче цього; клацніть його, щоб скасувати їхні перевизначення, після підтвердження. Під перевизначеним рядком стоїть успадковане значення, яке він замінює, наприклад: Базовий сценарій: 18. У вікні «Налаштування» є лише суцільна крапка й трикутник, бо перевизначенням значення стає саме введення його там.</p><p>Щоб сховати кола, зніміть «Показувати позначки перевизначень на карті» в Налаштування, Карта і сторінка, Сторінка або виберіть Карта, Очистити карту. Обидва варіанти зберігаються в цьому браузері, а не в проєкті. Таблиці позначають перевизначення в будь-якому разі.</p>';
$ec_lang['lpn_guide_scn_make_term']='Створення й скасування перевизначень';
$ec_lang['lpn_guide_scn_make_def']='<p>Коли відкрито сценарій, відмінний від Базового, зміна значення, яке сценарії можуть перевизначати, зберігається як перевизначення у відкритому сценарії, незалежно від способу: уведення у Властивостях, редагування клітинки в Таблицях, «Замінити» у вікні «Знайти й замінити», перетягування вузла чи введення його координат, зміна типу (новий тип і є перевизначенням) або «Вставити властивості у вибране». Налаштування, введене у вікні «Налаштування», зберігається як перевизначення, якщо сценарії можуть перевизначати це налаштування. Базовий не змінюється. У Базовому ті самі зміни змінюють саму мережу й доходять до кожного сценарію, який не перевизначив значення.</p><p>Видалення діє інакше. У сценарії «Видалити» не вилучає елемент, що існує в Базовому. Воно робить елемент неактивним у відкритому сценарії, а для вузла — і його труби, і про це повідомляє повідомлення. Елемент і далі є на кресленні та в інших сценаріях. Елемент, накреслений, коли відкрито сценарій, неактивний у Базовому й активний у цьому сценарії, і «Видалити» в цьому сценарії його вилучає. Видалення елемента в Базовому видаляє також його перевизначення в кожному сценарії, після запитання, яке їх підраховує. Абоненти й Фігури не належать жодному сценарію й видаляються остаточно.</p><p>Рядок «Керування перевизначеннями» у списку Сценаріїв відкриває список усіх перевизначень відкритого сценарію за категоріями, кожне поряд з успадкованим значенням, яке воно замінює. Графік часового ряду на карті, який сценарій відкрив, пересунув чи змінив, є окремим рядком. Позначте рядки й клацніть «Скасувати вибрані перевизначення», клацніть «Скасувати перевизначення» в одному рядку або клацніть «Скасувати всі перевизначення». Тоді кожне значення повертається до успадкованого, а «Скасувати» повертає це назад. Виберіть ID у списку, щоб перейти до елемента на карті. Крапка у Властивостях і рядок «Скасувати перевизначення» в меню клітинки Таблиць скасовують по одному перевизначенню.</p>';
$ec_lang['lpn_guide_scn_scope_term']='Що сценарій може й чого не може перевизначати';
$ec_lang['lpn_guide_scn_scope_def']='<table class="lpn-notes-table"><tbody><tr><td>Властивості</td><td>Кожна властивість вузла чи з’єднання, крім перелічених нижче, зокрема його положення, активність і тип («Змінити тип»). Текст може перевизначати свої слова, положення, розмір, вирівнювання, напівжирне накреслення, кут і те, чи його показано. Власну властивість можна перевизначати завжди. Властивості зібрано в категоріях Фізичні, Споживання, Активна топологія, Початкові налаштування, Компонент, Витрата на пожежогасіння, Вартість енергії, Власні властивості, Текст, Подання й Розрахунок.</td></tr><tr><td>Налаштування</td><td>Налаштування, що зберігаються разом із проєктом, крім перелічених нижче: параметри розрахунку (наприклад, множник споживання, загальний час роботи, крок часу гідравлічного розрахунку й метод тертя), графік споживання за замовчуванням, значення для нових елементів і налаштування подання (розміри, кольори, підписи, ізолінії, вид карти й графіки часових рядів на карті).</td></tr><tr><td>Однакове в кожному сценарії</td><td>ID, Опис і Тег елемента; кінцеві вузли й вигини з’єднання; Абоненти й Фігури; одиниці та система координат; і вміст Бібліотек (графіки, криві, типи труб, списки фітингів, керування й правила). Зміна будь-чого з цього змінює кожен сценарій. Сценарій може спрямувати елемент на іншу криву, тип труби, список фітингів чи графік, але не може змінити їхній вміст.</td></tr></tbody></table>';
$ec_lang['lpn_guide_scn_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_scn_example_def']='<p>Відкрийте приклад Net1. Виберіть Вода, Сценарії, Новий сценарій…, введіть Більша магістраль і клацніть OK. Виберіть на карті трубу 10 і введіть 24 для Діаметра у Властивостях; у Базовому там 18 дюймів, що видно під полем як Базовий сценарій: 18. Виберіть Базовий у списку Сценаріїв, знову виберіть Новий сценарій…, введіть Макс. доба і введіть 1.8 для Множника споживання в Налаштування, Розрахунок, Гідравліка. Потім виберіть Вода, Звіти, Порівняння сценаріїв.</p><table class="lpn-notes-table"><tbody><tr><td>Сценарій</td><td>К-сть перевизначень</td><td>Множник споживання</td><td>Найнижчий тиск</td><td>Найвища швидкість</td></tr><tr><td>Базовий</td><td>0</td><td>1</td><td>108 psi у N32, 14:00</td><td>2.76 ft/sec у L11, 16:00</td></tr><tr><td>Більша магістраль</td><td>1</td><td>1</td><td>109 psi у N32, 14:00</td><td>2.87 ft/sec у L11, 16:00</td></tr><tr><td>Макс. доба</td><td>1</td><td>1.8</td><td>15.77 psi у N32, 9:00</td><td>3.49 ft/sec у L10, 8:00</td></tr></tbody></table><p>Загальний час роботи в усіх трьох дорівнює 24:00, тож кожен найнижчий тиск і кожна найвища швидкість — це екстремум за добу, в показаний момент. Більша магістраль підвищує найнижчий тиск приблизно на 1 psi. Множник 1.8 знижує його до 15.77 psi о 9:00, а найвища швидкість переходить на трубу 10. Кожен сценарій містить одне перевизначення, а Базовий зберігає свої значення.</p>';
$ec_lang['lpn_guide_scn_notes_term']='Що слід урахувати';
$ec_lang['lpn_guide_scn_notes_def']='<ul><li>Перевизначення, що дорівнює успадкованому значенню, усе одно є перевизначенням. Його враховують, і «Керування перевизначеннями» позначає його (однакове).</li><li>Базовий режим — це налаштування для цього браузера, а не для проєкту. Він вимкнений для проєкту, сценарії й альтернативи якого він не може показати. Альтернативи й «Сценарії: керування» описано в довідці на початку цього запису.</li><li>Скасування зберігає 20 кроків. Кожен крок відновлює сценарії та відкритий сценарій разом із кресленням, тож додавання, перейменування й видалення сценарію можна скасувати.</li><li>Експорт файлу EPANET записує лише відкритий сценарій, зі значеннями й положеннями вузлів, які цей сценарій зчитує. Самі сценарії записуються лише у файлі проєкту.</li></ul>';
// The Scenario comparison chapter beyond its opening paragraphs (lpn_guide_text_scncmp_box), copied into
// the box's entry by renderGuideBoxes() from <template id="lpn_guide_more_lpn_scncmp_box">. Task 785.
$ec_lang['lpn_guide_cmp_cols_term']='Що містить таблиця';
$ec_lang['lpn_guide_cmp_cols_def']='<table class="lpn-notes-table"><tbody><tr><td>Сценарій</td><td>Назва сценарію. Відкритий сценарій позначено (зараз відкритий).</td></tr><tr><td>К-сть перевизначень</td><td>Перевизначення самого сценарію, пораховані так само, як у списку Сценаріїв. Параметр розрахунку, наприклад множник споживання, рахується за одне, і перевизначення, що дорівнює успадкованому значенню, теж рахується.</td></tr><tr><td>Множник споживання, Загальний час роботи, Крок часу гідравлічного розрахунку</td><td>Значення, за яких розраховано сценарій: його власні або проєктні. Для сценарію сталого режиму крок часу показано рискою.</td></tr><tr><td>Найнижчий тиск</td><td>Найнижчий тиск у вузлі з його ID і часом, коли він настає. Резервуари й ємності не враховано, бо кожна має фіксований напір.</td></tr><tr><td>Найвища швидкість</td><td>Найвища швидкість у трубі чи клапані з його ID і часом, коли вона настає. Насоси не враховано.</td></tr></tbody></table>';
$ec_lang['lpn_guide_cmp_run_term']='Сценарії сталого режиму й розширеного періоду';
$ec_lang['lpn_guide_cmp_run_def']='<p>Сценарій із загальним часом роботи, більшим за 0, розраховується на весь період через рушій EPANET. Його найнижчий тиск і найвища швидкість — це екстремуми за всіма часовими кроками, кожен показано з часом. Сценарій із загальним часом роботи 0 розраховується на один момент. Загальний час роботи — один із параметрів, які сценарій може перевизначати, тож в одній таблиці можуть бути обидва види.</p>';
$ec_lang['lpn_guide_cmp_notes_term']='Що слід урахувати';
$ec_lang['lpn_guide_cmp_notes_def']='<ul><li>Сценарій, який не вдається розрахувати, показує причину замість двох результатів, наприклад, що вузол не має шляху до джерела після того, як трубу зроблено неактивною. Решту сценаріїв усе одно розраховано. Сценарій, що не збігся, показує свої останні результати й повідомлення.</li><li>Блок над таблицею «Однакове в кожному сценарії» вказує метод тертя, одиниці, точність і максимальну кількість спроб. Налаштування, що різниться між сценаріями, у блок не потрапляє.</li><li>Порога «пройшло чи не пройшло» немає. Порівнюйте числа з проєктними критеріями системи, яку моделюють.</li><li>Приклад у записі «Сценарії: керування» порівнює три сценарії на Net1.</li></ul>';
// The Libraries chapter, in the entry for the Libraries box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_library_box">. Written from the code and held by
// dev/lpn-spike/user-guide-library-harness.js.
$ec_lang['lpn_guide_lib_kinds_term']='Що містить кожен розділ';
$ec_lang['lpn_guide_lib_kinds_def']='<table class="lpn-notes-table"><tbody><tr><td>Графіки</td><td>Список множників, що повторюється, поки триває розрахунок, по одному множнику на кожен крок часу графіка. Новий графік — це 24 множники 1. Вставлення стовпця з електронної таблиці заповнює поле «Множники». Графік споживання за замовчуванням позначено (за замовчуванням) і вибирають у Налаштування, Розрахунок, Гідравліка.</td></tr><tr><td>Криві</td><td>Чотири види, які вибирають як Вид кривої: Напір насоса, Ефективність насоса, Об’єм ємності й Втрати напору клапана. Точки вводять у сітці, що приймає вставлений стовпець з електронної таблиці або рядки, скопійовані з файлу EPANET. Крива напору насоса апроксимується через її точки, а рядок «Формула» показує цю апроксимацію; єдину точку зчитують як розрахункову, з напором за закритої засувки в 1.33334 раза більшим за її напір і максимальною витратою вдвічі більшою за її витрату, як це зчитує EPANET. Інші види з’єднують свої точки прямими лініями. Насос або клапан указує свою криву у Властивостях, де посилання «Криві» відкриває цей розділ.</td></tr><tr><td>Типи труб</td><td>Визначення діаметра, шорсткості та коефіцієнтів реакції, на яке посилаються кілька труб. Властивість у визначенні можна залишити порожньою, і тоді її вводять для кожної труби. У Властивостях значення, які задає тип труби, вимкнені, а «Від’єднати від типу труби» копіює їх у трубу й припиняє використання типу цією трубою.</td></tr><tr><td>Фітинги</td><td>Списки фітингів із кількістю кожного, що додаються в один коефіцієнт місцевих втрат k для труби чи типу труби. Пропоновані фітинги — тринадцять із таблиці 3.3 посібника користувача EPANET 2.2 та «Інший фітинг». Вибір одного копіює його коефіцієнт у рядок, де його можна змінити.</td></tr><tr><td>Керування</td><td>По одному операторові, із синтаксисом EPANET, наприклад <code>LINK id OPEN IF NODE id BELOW value</code>. Під кожним вікно показує, чи його зрозуміло.</td></tr><tr><td>Правила</td><td>По кілька рядків, із синтаксисом EPANET: RULE, IF, AND, OR, THEN, ELSE і PRIORITY. Під кожним вікно показує, чи його прочитано.</td></tr></tbody></table>';
$ec_lang['lpn_guide_lib_refs_term']='Перейменування, видалення та те, що посилається на елемент';
$ec_lang['lpn_guide_lib_refs_def']='<p>ID змінюють у його розділі. Порожній ID, або ID, що вже використано в тому самому розділі, не приймається. Перейменування елемента переносить усі посилання на нього, у Базовому та в кожному сценарії. Для графіка посиланнями є графік споживання вузла й графік кожної його категорії споживання, графік споживання абонента, графік напору резервуара, графік швидкості насоса та графік споживання за замовчуванням.</p><p>Графік, який використовується, можна видалити, і кожне посилання на нього очищається. Якщо це був графік споживання за замовчуванням, повідомлення вказує, який графік тепер використовують вузли без графіка. Криву, тип труби чи список фітингів, які використовуються, не видаляють. Повідомлення називає елементи, що їх використовують, і кожному з них спершу треба задати іншу криву або від’єднати його від типу чи списку.</p>';
$ec_lang['lpn_guide_lib_scn_term']='Бібліотеки й сценарії';
$ec_lang['lpn_guide_lib_scn_def']='<p>Бібліотеки однакові в кожному сценарії. Сценарій може спрямувати елемент на іншу криву, тип труби, список фітингів чи графік, і це є перевизначенням цього елемента, але вміст самого об’єкта не перевизначається. Зміна графіка, кривої, типу труби, списку фітингів, керування чи правила змінює його для кожного сценарію, який би сценарій не було відкрито. Графік споживання за замовчуванням — це налаштування, а не об’єкт, і сценарій може мати власний.</p><p>Керування чи правило, що називає елемент, який неактивний у відкритому сценарії, ігнорується під час розрахунку цього сценарію, а вікно «Бібліотеки» його перелічує. Те, що називає елемент, якого немає в проєкті, також ігнорується, з попередженням.</p>';
$ec_lang['lpn_guide_lib_ctl_term']='Керування й правила в розрахунку';
$ec_lang['lpn_guide_lib_ctl_def']='<p>Керування — це один оператор. Правило — кілька рядків, що починаються з RULE. Ключові слова вводять англійською, якою б не була мова сторінки, а числа — в одиницях проєкту. «Додати правило керування» починає з оператора, побудованого з мережі, який потім редагують до потрібного.</p><p>Керування й правила змінюють результат лише в моделюванні за розширений період, тобто коли загальний час роботи більший за 0. Розв’язок сталого режиму не змінює ні те, ні інше. Правила застосовує лише рушій EPANET. Обидва зберігаються разом із проєктом і записуються у файл EPANET.</p>';
$ec_lang['lpn_guide_lib_import_term']='Імпорт бібліотек з іншого проєкту';
$ec_lang['lpn_guide_lib_import_def']='<p>Файл, Імпорт…, Імпортувати бібліотеки… відкриває інший файл проєкту й копіює з нього цілі бібліотеки в цей проєкт. Об’єкт, назва якого вже використана тут, пропускається й виводиться в списку, тож нічого з наявного не змінюється. Коли файл і проєкт виражають величину в різних одиницях, показується попередження, а об’єкти імпортуються як записано. Типи труб, які посилаються на список фітингів, якого немає в цьому проєкті, перелічуються; імпортуйте бібліотеку фітингів з того самого файлу, щоб розв’язати це.</p>';
$ec_lang['lpn_guide_lib_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_lib_example_def']='<p>Відкрийте приклад Net1 і виберіть Вода, Бібліотеки. Графіки містять графік 1, Demand Pattern, із 12 множниками через 2:00, що охоплюють 24:00, позначений (за замовчуванням). Криві містять криву 1, Pump Curve для насоса 9, криву напору насоса з однією точкою, 1500 gpm за 250 ft. Керування містить два оператори: перший відкриває з’єднання 9, коли тиск у вузлі 2 падає нижче 110, а другий закриває його, коли тиск у вузлі 2 піднімається вище 140. Правила містять два правила, що перевіряють час за годинником і рівень в ємності 2.</p><p>Виберіть Вода, Розрахувати, а потім Вода, Звіти, Зміни стану. Насос L9 тепер закрито о 10:00, відкрито о 15:00 і закрито о 21:00, а ємність N2 тепер спорожнюється о 22:00. У Керуванні змініть 140 на 135 у другому операторі й знову виберіть Вода, Розрахувати. Останнє закриття зсувається на 20:00, а ємність N2 тепер спорожнюється о 21:00.</p>';
$ec_lang['lpn_guide_lib_notes_term']='Що слід урахувати';
$ec_lang['lpn_guide_lib_notes_def']='<ul><li>Графік повторюється, поки триває розрахунок, тож не мусить охоплювати весь розрахунок.</li><li>У файлі EPANET немає місця для типу труби чи списку фітингів. Файл містить числа, які зчитує кожна труба, а експорт повідомляє, які труби було спрощено.</li><li>Розташування й розмір вікна «Бібліотеки» зберігаються в цьому браузері. Об’єкти зберігаються разом із проєктом.</li></ul>';
// The Properties chapter, in the entry for the Properties box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_popup">. Held by dev/lpn-spike/user-guide-properties-harness.js.
$ec_lang['lpn_guide_prop_open_term']='Відкриття Властивостей';
$ec_lang['lpn_guide_prop_open_def']='<p>У режимі «Вибір» клацніть вузол, з’єднання, Текст або Абонента, щоб відкрити Властивості поруч з ним або там, куди вікно було пересунуто востаннє. Клацніть з Shift інший елемент, щоб додати його до вибраного. Коли вибрано кілька елементів, вікно перелічує те, що можна задати одразу для всіх (див. «Вибрано кілька елементів» нижче). Фігура не має вікна Властивостей, бо її точки редагують на карті.</p><p>Контекстне меню вузла чи з’єднання має пункти «Копіювати властивості», «Вставити властивості у вибране» і «Графік часового ряду». На сенсорному екрані натисніть елемент і утримуйте, щоб побачити те саме меню. «Графік часового ряду» потребує результатів моделювання за розширений період.</p>';
$ec_lang['lpn_guide_prop_edit_term']='Редагування значення';
$ec_lang['lpn_guide_prop_edit_def']='<p>Значення набуває чинності, коли поле зафіксовано, залишивши його або натиснувши Enter. Його зчитують в одиниці, названій у підписі, без перерахунку, а підпис на карті, Таблиці й результати слідують за ним. Розраховані значення — це рядки лише для читання, без поля введення. Для з’єднання вони випливають із його вхідних даних, а для вузла стоять серед них. Це результати останнього розрахунку, на показаний момент, а коли «Перераховувати автоматично» знято, це результати останнього «Розрахувати».</p><p>Труба, що використовує тип труби, показує значення, які задає тип, вимкненими. Клацніть «Від’єднати від типу труби», щоб скопіювати ці значення в трубу й редагувати їх там.</p>';
$ec_lang['lpn_guide_prop_id_term']='ID';
$ec_lang['lpn_guide_prop_id_def']='<p>ID редагують у рядку заголовка. Він не може містити пробіл або лапки, а ID вузла не може збігатися з ID іншого вузла, так само ID з’єднання — з ID іншого з’єднання. Вузол і з’єднання можуть мати однаковий ID. Відхилений ID залишає старий на місці й показує повідомлення. Перейменування елемента переносить із ним його перевизначення в сценаріях.</p>';
$ec_lang['lpn_guide_prop_scn_term']='У сценарії';
$ec_lang['lpn_guide_prop_scn_def']='<p>У сценарії, відмінному від Базового, зміна значення, яке сценарії можуть перевизначати, зберігається як перевизначення відкритого сценарію, а рядок позначається ліворуч. Запис «Сценарії: керування» описує позначки й перелічує те, що однакове в кожному сценарії: ID, Опис і Тег. Абонент не має значень у сценаріях. Перемикання сценаріїв залишає Властивості відкритими на тому самому елементі й показує значення сценарію, який тепер відкрито.</p>';
$ec_lang['lpn_guide_prop_multi_term']='Вибрано кілька елементів';
$ec_lang['lpn_guide_prop_multi_def']='<p>Заголовок виглядає, наприклад, так: Вибрано 2. У вікні є по одному розділу для кожного типу елемента у вибраному, з назвою типу та кількістю елементів цього типу в заголовку, наприклад Труби (2), і кожен розділ можна згорнути. Розділ перелічує властивості, які в Таблицях є стовпцями й які можна задати для кожного елемента в ньому. Результати та значення, які задає тип труби, не перелічено. Рядок показує значення, спільне для елементів, або «Різні», де вони відрізняються.</p><p>Введення значення в рядок задає його для кожного елемента цього типу у вибраному. Рядок, якого не торкалися, нічого не записує. Повідомлення вказує кількість, наприклад: Задано Діаметр (in) для 2., і один «Скасувати» скасовує весь рядок. У сценарії, відмінному від Базового, значення зберігаються як перевизначення.</p>';
$ec_lang['lpn_guide_prop_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_prop_example_def']='<p>Відкрийте приклад Net1 і клацніть трубу 10. Властивості перелічують її вхідні дані, від Опису до «Активний?», а потім її результати на показаний момент: Витрата 1866.2 gpm, Швидкість 2.4 ft/sec і Втрати напору 19.12 ft H2O.</p><p>Клацніть трубу 113 і клацніть з Shift трубу 31. Заголовок: Вибрано 2, єдиний розділ — Труби (2), а Діаметр показує «Різні», бо труба 31 має 6 in, а труба 113 — 8 in. Введіть 10 для Діаметра. Повідомлення: Задано Діаметр (in) для 2., обидві труби мають 10 in, і один «Скасувати» повертає їх до 6 і 8 in.</p>';
// The Settings chapter, in the entry for the Settings box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_settings_box">. Held by dev/lpn-spike/user-guide-settings-harness.js.
$ec_lang['lpn_guide_set_where_term']='Розділи й місця збереження налаштувань';
$ec_lang['lpn_guide_set_where_def']='<p>Список ліворуч у вікні переходить до розділу чи підзаголовка. Розділи: Візуалізація (Підписи вузлів, Кольори вузлів, Підписи з’єднань, Кольори з’єднань, Абонент і Усі), Карта і сторінка (Зовнішній вигляд і Сторінка), Елементи (Префікси ID, Значення при створенні та Власні властивості), Розрахунок (Одиниці, Час, Гідравліка, Енергія та Якість води) і Подяки. Кожен підзаголовок указує, чи його налаштування Зберігаються з проєктом, чи Зберігаються в цьому браузері. Усе зберігається з проєктом, крім налаштувань у розділі «Сторінка» та одного рядка в Гідравліці, «Показувати вікно перебігу розрахунку», який сам указує «Зберігається в цьому браузері».</p><p>Вкладка «Налаштування» в Таблицях перелічує ті самі налаштування рядками з їхньою Категорією й Значенням, тож налаштування можна знайти й перевірити також там.</p>';
$ec_lang['lpn_guide_set_search_term']='Пошук';
$ec_lang['lpn_guide_set_search_def']='<p>Введіть одне чи кілька слів у «Пошук налаштувань», щоб побачити лише ті налаштування, що містять усі ці слова, у назві чи в підказці. Слово, яке збігається із заголовком, показує всі налаштування під цим заголовком. Наприклад, opacity показує Symbol opacity (0 to 1) і Background image opacity (0 to 1); opacity symbol показує лише перше; а sprinklers показує Emitter exponent, підказка якого згадує sprinklers, а назва — ні. Пошук не змінює жодного налаштування.</p>';
$ec_lang['lpn_guide_set_scn_term']='Налаштування в сценарії';
$ec_lang['lpn_guide_set_scn_def']='<p>У сценарії, відмінному від Базового, значення, введене для налаштування, яке сценарії можуть перевизначати, зберігається як перевизначення, а рядок позначається суцільною крапкою. Трикутник позначає налаштування, яке перевизначають сценарії нижче відкритого. Запис «Сценарії: керування» перелічує, які налаштування можна перевизначати. Одиниці однакові в кожному сценарії. «Скинути значення за замовчуванням» затемнено поза Базовим, а «Застосувати ці значення для нових елементів до кожного наявного елемента» там відхиляється, бо воно змінює саме креслення.</p>';
$ec_lang['lpn_guide_set_units_term']='Зміна одиниці';
$ec_lang['lpn_guide_set_units_def']='<p>Кожна величина має свою одиницю в розділі «Одиниці». Коли значення в проєкті введено в цій одиниці, її зміна спершу ставить запитання. «Без руйнування» зберігає кожне число як введено й зчитує його в новій одиниці. «З перерахунком» переписує числа перерахунком, тож мережа фізично залишається тією самою, а початкові числа втрачаються, якщо не скористатися «Скасувати»; один «Скасувати» відновлює числа й одиницю. «Скасувати» у запитанні залишає все як було.</p><p>Приклад на Net1: виберіть мм для Діаметра в Одиницях. «З перерахунком» переписує 13 значень, і труба 10 має 457.2 мм. «Без руйнування» не змінює 13 значень, і труба 10 має 18 мм.</p>';
$ec_lang['lpn_guide_set_assets_term']='Нові елементи й застосування значень до наявних';
$ec_lang['lpn_guide_set_assets_def']='<p>Префікси ID і Значення при створенні призначено для елементів, що їх креслять відтепер. Вони не змінюють уже накреслені елементи. «Застосувати до всіх» поряд із префіксом ID надає кожному наявному елементу цього виду ID, що починається з префікса; кожен зберігає свій номер, а ID, що не закінчується числом, не змінюється. «Застосувати ці значення для нових елементів до кожного наявного елемента» замінює ці властивості в кожного наявного елемента, після запитання, але лише для властивостей, підписи яких показано на карті. «Скасувати» це скасовує.</p>';
$ec_lang['lpn_guide_set_reset_term']='Скинути значення за замовчуванням і Почати заново';
$ec_lang['lpn_guide_set_reset_def']='<p>«Скинути значення за замовчуванням» спершу питає, а потім повертає префікси ID, значення для нових елементів, налаштування розв’язувача, вигляд карти, положення легенди й видимі підписи відкритого проєкту до початкових значень. Мережа не змінюється, інші проєкти не зачіпаються, а один «Скасувати» повертає налаштування назад.</p><p>«Почати заново» спершу питає, а потім видаляє кожен проєкт, кожне фонове зображення, усі налаштування та вибрані одиниці, збережені в цьому браузері, і перезавантажує сторінку так, як її побачив би новий відвідувач. Це не можна скасувати.</p>';
// The Toolbar chapter (Task 785), terms in the Toolbar section above its rows. Held by
// dev/lpn-spike/user-guide-toolbar-harness.js.
$ec_lang['lpn_guide_tb_row_term']='Як читати рядок';
$ec_lang['lpn_guide_tb_row_def']='<p>Кожен рядок — це одна кнопка панелі інструментів, у порядку смуги, з лінією між групами. Рядок показує піктограму кнопки, назву й підказку, а потім її клавіші. Коли рядок меню робить те саме, рядок також показує шлях у меню після слів «Також у меню». Клацання рядка вказує на кнопку на панелі інструментів. Воно ніколи не запускає кнопку. Коли кнопки не видно на екрані, рядок відкриває рядок меню, що робить те саме.</p>';
$ec_lang['lpn_guide_tb_dim_term']='Затемнені назви';
$ec_lang['lpn_guide_tb_dim_def']='<p>Затемнена назва належить кнопці, якої зараз немає на екрані. Кнопка, яка є на екрані, не затемнена, незалежно від того, чи вона може діяти в цей момент. «Розрахувати» затемнено, поки вибрано «Перераховувати автоматично», бо кнопка з’являється лише тоді, коли це налаштування знято.</p><p>На телефоні у вертикальному режимі на панелі інструментів лишається лише п’ять елементів керування розрахунком. Усі інші назви затемнено, і клацання однієї відкриває рядок меню, що робить те саме. Кнопка «Нижня панель» не має рядка меню, тож її рядок може лише повідомити, що елемента керування немає на екрані.</p>';
$ec_lang['lpn_guide_tb_two_term']='Кнопки з трикутником у куті';
$ec_lang['lpn_guide_tb_two_def']='<p>«Показати все» і «Вибрати вікном» мають маленький трикутник у нижньому правому куті. Повторне натискання кнопки, без натискання чогось між ними, змінює її: «Показати все» стає «Наблизити вікном», а «Вибрати вікном» перебирає форми вікна, ласо й багатокутника. Клацання кута «Показати все» одразу вмикає «Наблизити вікном», не вписуючи вид.</p>';
// The Menus chapter (Task 785), two terms after the ruled keys table. Held by dev/lpn-spike/user-guide-menus-harness.js.
$ec_lang['lpn_guide_mn_list_term']='Як читати список меню';
$ec_lang['lpn_guide_mn_list_def']='<p>Список складено з самих меню: Файл, Правка, Карта, Вода й Довідка, кожне під власним заголовком, а рядки випадного підменю відступлено під рядком, що його відкриває, з лінією між групами. Він пропускає рядки, які зараз приховані, заголовки всередині меню та рядки, названі за проєктом чи браузером, наприклад назви сценаріїв. Він сягає на одне підменю вглиб і не має запису для меню «Мова». Рядок, який зараз вимкнено, усе одно перелічено, без позначки, що він вимкнений. Клацання рядка відкриває меню й підменю з указівкою на цей рядок. Воно ніколи не запускає рядок.</p>';
$ec_lang['lpn_guide_mn_kbd_term']='Меню з клавіатури';
$ec_lang['lpn_guide_mn_kbd_def']='<p>Літери після Alt+Shift — це клавіші на фіксованих позиціях: F для Файл, E для Правка, M для Карта, W для Вода, H для Довідка і L для Мова, у кожній розкладці клавіатури та кожною мовою. Після F10 літера меню сама відкриває його, а Esc у рядку меню повертає фокус туди, де він був.</p><p>Рядки, якими можна користуватися лише вказівником, літери не мають, і клавіші зі стрілками їх пропускають. Серед них Вершини, три вибори області, інструменти «Вставка», «Наблизити вікном» і «Знімок екрана».</p>';
// The Map chapter (Task 785): terms after the ruled keys table. Held by dev/lpn-spike/user-guide-map-harness.js.
$ec_lang['lpn_guide_map_undo_term']='Скасувати й Повторити';
$ec_lang['lpn_guide_map_undo_def']='<p>Ctrl+Z скасовує останню зміну, а Ctrl+Y або Ctrl+Shift+Z повторює її. У клітинці Таблиць ці клавіші належать проєкту, поки клітинку лише вибрано, і тексту клітинки, коли введення вже почалося. Сторінка зберігає останні 20 кроків, лише в пам’яті, і перемикання проєктів їх очищає. Крок відновлює сценарії, відкритий сценарій та одиниці разом із кресленням.</p>';
$ec_lang['lpn_guide_map_del_term']='Видалити';
$ec_lang['lpn_guide_map_del_def']='<p>Delete або Backspace видаляє вибране, крім випадку, коли вводять у поле, де клавіша належить полю. Коли нічого не вибрано, Delete повідомляє про це, а Backspace нічого не робить. Один «Скасувати» скасовує видалення кількох елементів. У сценарії, відмінному від Базового, Delete не вилучає елемент, що існує в Базовому; що саме воно робить, описує запис «Сценарії: керування».</p>';
$ec_lang['lpn_guide_map_esc_term']='Esc';
$ec_lang['lpn_guide_map_esc_def']='<p>Esc, що закриває меню, випадний список чи вікно, більше нічого не робить. Вікна Властивості, Налаштування й Бібліотеки закриваються, лише коли фокус у вікні й вказівник над ним. Коли жодне з них не відкрито, Esc повертає активний інструмент до «Вибір», а в режимі «Вибір» знімає вибір. Напівнакреслена труба потребує одного Esc, щоб відмовитися від неї, і другого, щоб повернутися до «Вибір». У полі Esc належить полю.</p>';
$ec_lang['lpn_guide_map_letters_term']='Літери, цифри й клавіші масштабу';
$ec_lang['lpn_guide_map_letters_def']='<p>W запускає «Наблизити вікном», A починає вибір області (повторне натискання A перебирає вікно, ласо й багатокутник), а F креслить Фігуру. Клавіша «плюс» або «дорівнює» наближає, а клавіша «мінус» віддаляє, на один крок колеса. Ці клавіші та цифри від 0 до 9 нічого не роблять на карті, коли інша клавіша робить їх скороченням, наприклад Ctrl+C, нічого не роблять під час уведення в поле й лишають літери відкритого меню його рядкам. Цифра, введена на вибраній клітинці Таблиць, перезаписує клітинку замість вибору інструмента.</p>';
// The Tables chapter (Task 785): terms after the two ruled key tables. Held by dev/lpn-spike/user-guide-tables-harness.js.
$ec_lang['lpn_guide_tbl_tabs_term']='Вкладки';
$ec_lang['lpn_guide_tbl_tabs_def']='<p>Щоб відкрити панель, клацніть кнопку «Нижня панель» або виберіть Вода, Таблиці. Її вкладки, зліва направо: Вузли, Резервуари, Ємності, Труби, Насоси, Клапани, Текст, Абоненти, Фігури, Налаштування, Сценарії, Часовий ряд, Профіль, Частота й Баланс витрат. Вкладка «Сценарії» показується, коли «Базовий режим» знято. Ширина, порядок і видимість стовпців зберігаються в цьому браузері, а не в проєкті.</p>';
$ec_lang['lpn_guide_tbl_cell_term']='Вибір, введення й редагування клітинки';
$ec_lang['lpn_guide_tbl_cell_def']='<p>Клітинка перебуває в одному з трьох станів. Поки її лише вибрано, клавіші зі стрілками переходять від клітинки до клітинки, а Ctrl+Z — це «Скасувати» проєкту. Введення символу на вибраній клітинці починає запис: набраний текст замінює значення, а клавіша зі стрілкою фіксує його й переходить до наступної клітинки. F2 або подвійне клацання відкриває клітинку для редагування: курсор у значенні, а клавіші зі стрілками рухають курсор. У записі та в редагуванні Ctrl+Z скасовує набране. Esc скасовує запис чи редагування й залишає клітинку вибраною.</p>';
$ec_lang['lpn_guide_tbl_fill_term']='Заповнення, фільтри й сценарії';
$ec_lang['lpn_guide_tbl_fill_def']='<p>Ctrl+D заповнює вибраний діапазон вниз від його верхнього рядка, а Ctrl+Enter заповнює його значенням активної клітинки. Обидві залишають без змін стовпець ID і клітинки лише для читання, а повідомлення вказує, скільки клітинок заповнено й скільки не змінено. Ctrl+Shift+L показує лише елементи, вибрані на карті. Коли фільтр увімкнено, Ctrl+A і Ctrl+D діють лише на показані рядки, а рядок, відредагований так, що він більше не відповідає фільтрові, залишається, доки фільтр не буде застосовано знову.</p><p>У сценарії, відмінному від Базового, редагування клітинки, Ctrl+D, Ctrl+Enter і вставлення зберігаються як перевизначення відкритого сценарію.</p>';
// The Boxes chapter (Task 785): terms after Tom's two paragraphs. Held by dev/lpn-spike/user-guide-boxes-harness.js.
$ec_lang['lpn_guide_bx_dock_term']='Закріплення й вкладки';
$ec_lang['lpn_guide_bx_dock_def']='<p>У куті рядка заголовка вікна є «Закріпити ліворуч від карти», «Закріпити праворуч від карти» і «Плаваюча», а коли вікно закріплено — «Автоприховування». Закріплене вікно — це колонка поряд із картою. З автоприховуванням воно стає вкладкою на вузькій смузі біля краю карти. Вкладка відкриває вікно при наведенні, після 150 мс мишею чи пером, або при клацанні чи дотику, і вікно ховається назад у вкладку, як описано вище. Сховане вікно все одно відкрите. Рядок меню або кнопка панелі інструментів, що його відкриває, виводить його з вкладки.</p><p>Перетягування закріпленого вікна за рядок заголовка робить його плаваючим і вимикає автоприховування. Вікна, закріплені з одного боку, мають спільну ширину, а карта зберігає не менш ніж 320 px. Вкладки впорядковують перетягуванням або натисканням Alt+Вгору чи Alt+Вниз на вкладці з фокусом.</p>';
$ec_lang['lpn_guide_bx_keep_term']='Що пам’ятає вікно';
$ec_lang['lpn_guide_bx_keep_def']='<p>Кожне вікно зберігає в цьому браузері, де воно плаває, свій розмір, чи воно відкрите, бік закріплення, чи воно автоматично ховається, ширину в закріпленому стані та місце своєї вкладки. Властивості, Критичність: аналіз, Масштабування споживання та Калібрування зберігають лише бік закріплення, автоприховування, місце вкладки та те, чи вони відкриті; місце, де вони плавають, діє лише одне завантаження сторінки. Браузер без збереженого розташування починає з кількома вікнами, закріпленими як вкладки, і нічого не зберігається, доки вікно не змінять.</p>';
$ec_lang['lpn_guide_bx_phone_term']='На телефоні';
$ec_lang['lpn_guide_bx_phone_def']='<p>За ширини 640 px або менше жодне вікно не закріплюється, і кожне вікно заповнює екран. Кнопок закріплення не пропонується. Закріплене розташування зберігається й повертається на ширшому вікні.</p>';
// The Fire flow analysis chapter (Task 785), in the entry for its box. Held by dev/lpn-spike/user-guide-fireflow-harness.js.
$ec_lang['lpn_guide_ff_asks_term']='Що запитують про кожен вузол';
$ec_lang['lpn_guide_ff_asks_def']='<p>Кожен перевірюваний вузол проходить два випробування, на копії мережі в показаний на екрані момент і у відкритому сценарії. Перше з’ясовує, яку витрату вузол може віддати, зберігаючи залишковий тиск. У вузлі відбирають витрату, і повторні розрахунки звужують її, до стелі, що дорівнює 10000 gpm. Вузол, який на стелі все ще зберігає залишковий тиск, зазначають як такий, що віддає більше за стелю. Друге випробування, перевірка проєкту, відбирає потрібну витрату у вузлі й з’ясовує, чи не падає будь-який інший вузол у його охопленні нижче за Найнижчий допустимий тиск деінде, або чи не перевищує будь-яка труба в його охопленні Найвищу допустиму швидкість. Перевірку проєкту не виконують, коли її охоплення — «Немає».</p><p>Вузол із власною властивістю «Потрібна витрата на пожежогасіння» перевіряють за цим значенням, а кожен інший вузол — за значенням у вікні.</p>';
$ec_lang['lpn_guide_ff_result_term']='Як читати результати';
$ec_lang['lpn_guide_ff_result_def']='<p>Підсумок рахує вузли, що пройшли всі перевірки, вузли, що не витримали витрати на пожежогасіння, і вузли, що вплинули на решту системи. Таблиця перелічує для кожного перевірюваного вузла Статичний тиск до відбору будь-якої витрати на пожежогасіння, Потрібну витрату, Тиск при потрібній витраті, Доступну витрату, Залишковий тиск, Найгірший вплив і Межу проєкту з перевірки проєкту, кількість Розрахунків, тобто кількість розв’язків усієї мережі, і Види відмов. Клітинка без числа показує риску, ніколи не нуль. Вузол, який не вдалося розрахувати, показує причину замість чисел. Таблиця друкує щонайбільше 200 вузлів і вказує, скільки не надруковано.</p>';
$ec_lang['lpn_guide_ff_marks_term']='Кола, «Зупинити» й один аналіз за раз';
$ec_lang['lpn_guide_ff_marks_def']='<p>Після розрахунку коло кожного перевіреного вузла обводиться на карті відповідно до результату, і обводки різняться як штрихом, так і кольором. Виберіть «Вибрані вузли», щоб перевірити лише вузли, вибрані на карті; усе інше вибране враховується, але не перевіряється. «Зупинити» завершує розрахунок і зберігає вузли, що вже закінчені. Одночасно виконується лише один з аналізів: витрати на пожежогасіння, критичності та масштабування споживання.</p>';
$ec_lang['lpn_guide_ff_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_ff_example_def']='<p>Відкрийте приклад Net1, виберіть Вода, Аналіз, Аналіз витрати на пожежогасіння… і клацніть «Запустити» з вікном у тому вигляді, в якому воно відкрилося. Крок часу — 0:00, і розрахунок розв’язує всю мережу 135 разів. Вісім із дев’яти вузлів проходять усі перевірки. Вузол N32 не витримує витрати на пожежогасіння: його статичний тиск 111 psi, за потрібних 1000 gpm лишається лише 1.19 psi, а доступна витрата — 892 gpm. Вузол N31 може віддати 1339 gpm, а вузол N12 — понад 10000 gpm.</p>';
// The Criticality analysis chapter (Task 785). Held by dev/lpn-spike/user-guide-criticality-harness.js.
$ec_lang['lpn_guide_cr_case_term']='Що робить кожен випадок';
$ec_lang['lpn_guide_cr_case_def']='<p>Для кожного з’єднання в охопленні з’єднання робиться неактивним на копії мережі, і копія розраховується в показаний на екрані момент у відкритому сценарії. Розрахунок — це один розв’язок для кожного з’єднання й ще один без нічого пошкодженого. Вузол, що лишився без відкритого шляху до резервуара чи ємності, відрізаний: його вилучають перед розв’язком, а його споживання враховують як Непокрите споживання. Серед вузлів, що лишаються підключеними, «Вузли нижче мінімуму» перелічує ті, тиск у яких падає нижче за Найнижчий допустимий тиск. Вузол, який уже нижче цього значення за нічого не пошкодженого, не зараховується проти жодного з’єднання, а підсумок вказує, скільки таких. Найнижчий допустимий тиск — це те саме налаштування, що й поле «Найнижчий допустимий тиск деінде» у вікні «Витрата на пожежогасіння: аналіз».</p>';
$ec_lang['lpn_guide_cr_dead_term']='Тупики й список';
$ec_lang['lpn_guide_cr_dead_def']='<p>Тупикове з’єднання — таке, вилучення якого відрізає вузли, до яких можна дістатися лише через нього. Усе за ним — його втрата, тому з позначеним «Пропускати тупики» з’єднання не розраховують, а підсумок вказує, скільки пропущено. Список показує для кожного з’єднання Непокрите споживання, Відрізані вузли та Вузли нижче мінімуму, кожне з числом і перших п’ятьма ID, а клацання ID переходить до нього на карті. З’єднання, що чогось коштують системі, перелічено першими, доки не клацнуть заголовок стовпця для сортування, а підсумок зіставляє їх з кількістю перевірених з’єднань. Виберіть «Вибрані зʼєднання», щоб пошкодити лише з’єднання, вибрані на карті.</p>';
$ec_lang['lpn_guide_cr_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_cr_example_def']='<p>Відкрийте приклад Net1, виберіть Вода, Аналіз, Аналіз критичності…, введіть 116 для Найнижчого допустимого тиску й клацніть «Запустити». Крок часу — 0:00, і розрахунок розв’язує всю мережу 14 разів. Чотири з 13 з’єднань, коли їх вимкнено, опускають вузол нижче 116 psi: L9 (N10, N11 і N21), L10 (N11 і N21), L111 (N21 і N22) та L112 (N21 і N22). Два вузли вже нижче 116 psi за нічого не пошкодженого й не зараховуються. Оскільки Net1 кільцева, втрата одного з’єднання ніколи не залишає вузол без живлення.</p>';
// The Demand scaling chapter (Task 785). Held by dev/lpn-spike/user-guide-demandscale-harness.js.
$ec_lang['lpn_guide_ds_run_term']='Запустити';
$ec_lang['lpn_guide_ds_run_def']='<p>«Запустити» множить споживання у вибраних вузлах на Масштаб споживання, на копії мережі в показаний на екрані момент і у відкритому сценарії. Вона робить два розв’язки: один зі споживанням як є й один зі збільшеним масштабом. Результат перелічує Найнижчі тиски й Найбільші швидкості, кожне зі значенням «Масштаб.» поруч зі значенням «Без масшт.», яке показує карта. Кожен список містить десять рядків, а вікно вказує, скільки з’єднань воно не показує. Масштаб споживання застосовується на додачу до множника споживання відкритого сценарію і ніколи не зберігається в проєкті.</p>';
$ec_lang['lpn_guide_ds_find_term']='Знайти';
$ec_lang['lpn_guide_ds_find_def']='<p>«Знайти» шукає масштаби споживання від 0 до 20, з точністю до 0.01, найбільший, за якого кожен вибраний вузол зберігає щонайменше Найнижчий допустимий тиск. Вона повідомляє масштаб і найнижчий тиск за нього, а також те саме для наступного кроку вгору, де тиск уперше падає нижче межі. Якщо споживання, як введено, уже залишає вузол нижче межі, відповідь позначається знаком попередження. Якщо кожен вузол зберігає межу за 20, відповідь про це повідомляє. «Зупинити» завершує пошук без відповіді. Найнижчий допустимий тиск — це те саме налаштування, що й поле «Найнижчий допустимий тиск деінде» у вікні «Витрата на пожежогасіння: аналіз».</p>';
$ec_lang['lpn_guide_ds_scope_term']='Вузли й крок часу';
$ec_lang['lpn_guide_ds_scope_def']='<p>З «Вибрані вузли» масштабуються й перевіряються лише вузли, вибрані на карті. Інші вузли залишаються як є, а ті, що падають нижче межі, перелічуються, не обмежуючи відповіді. Масштабується лише показаний на екрані крок часу, і рівні та стани беруться з нього. Щоб випробувати пік, перед запуском перемістіть годинник на пікове споживання.</p>';
$ec_lang['lpn_guide_ds_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_ds_example_def']='<p>Відкрийте приклад Net1 і виберіть Вода, Аналіз, Масштабування споживання…. На кроці часу 0:00 клацніть «Знайти» з вікном у тому вигляді, в якому воно відкрилося. Кожен вузол зберігає щонайменше 20 psi до масштабу споживання 5.76, де найнижчий тиск становить 20.11 psi у вузлі N32. За 5.77 він дорівнює 19.8 psi, а пошук зайняв 13 розв’язків. Введіть 3 для Масштабу споживання й клацніть «Запустити»: вузол N32 падає з 111 psi без масштабу до 85.99 psi, а з’єднання L112 зростає з 0.535 ft/sec до 3.13 ft/sec.</p>';
// The Pump energy chapter (Task 785). Held by dev/lpn-spike/user-guide-energy-harness.js.
$ec_lang['lpn_guide_en_read_term']='Як читати звіт';
$ec_lang['lpn_guide_en_read_def']='<p>Виберіть Вода, Звіти, Енергія насосів. Звіт інтегрує потужність кожного насоса за останнє моделювання за розширений період, тож потрібні Загальний час роботи, більший за 0, і розрахунок. Для кожного насоса він перелічує % часу, Ефект., Серед. кВт, Пік. кВт, кВт·год і Вартість. Серед. кВт — це середнє, поки насос працював, а не за періоди простою. Під таблицею стоять Використана енергія, Вартість енергії, Пікове споживання потужності, Плата за пікове навантаження та Загальна вартість. Мережа без насосів не має що звітувати.</p>';
$ec_lang['lpn_guide_en_set_term']='Що задає числа';
$ec_lang['lpn_guide_en_set_def']='<p>Налаштування, Енергія містить Ефективність насоса (у %), що її використовують для кожного насоса без кривої ефективності, Ціну електроенергії за один кіловат-годину, Графік ціни, який множить ціну на кожному кроці графіка, Плату за пікове навантаження за кВт і текст Валюти, який друкується поряд з вартостями й не перераховує вартості. Насос може мати власні ціну, графік ціни й криву ефективності у Властивостях. Ціни, графік, плата за пікове навантаження, Ефективність насоса (у %) і власні значення насоса входять до категорії Вартість енергії, тож сценарій може їх перевизначати. Коли ціну не вказано або вона дорівнює нулю, кожна вартість дорівнює нулю, і звіт про це повідомляє. Застосунок не пропонує ціни.</p>';
$ec_lang['lpn_guide_en_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_en_example_def']='<p>Відкрийте приклад Net1, в якого загальний час роботи 24:00, і розрахуйте. Виберіть Вода, Звіти, Енергія насосів. Насос L9 працює 65.71% розрахунку з ефективністю 75% і споживає в середньому 96.22 кВт, 96.71 кВт на піку та 1518 кВт·год. Ціну не вказано, тож вартість дорівнює 0, і звіт про це повідомляє. Введіть 0.12 для Ціни електроенергії в Налаштування, Енергія й розрахуйте знову: вартість L9 становить 182, це Загальна вартість.</p>';
// The Contour plot chapter (Task 785). Held by dev/lpn-spike/user-guide-contour-harness.js.
$ec_lang['lpn_guide_ct_what_term']='Що таке карта ізоліній';
$ec_lang['lpn_guide_ct_what_def']='<p>Виберіть Вода, Графіки, Ізолінії. Цей рядок вмикає карту ізоліній у відкритому сценарії, як плавну заливку з підписаними лініями, використовуючи тиск, якщо вузли ще не розфарбовані, і відкриває вікно. Карта розтягує кольори вузлів уздовж труб і поруч з ними на задану кратну медіанної довжини труби, згасаючи на зовнішній частині. Вона не забарвлює поперек насосів, клапанів чи закритих з’єднань. Рядок під шкалою кольорів вказує, скільки вузлів і труб використовує карта, охоплення поруч з трубами й інтервал ліній. Якщо вузлів замало, вона про це повідомляє.</p>';
$ec_lang['lpn_guide_ct_box_term']='Вікно';
$ec_lang['lpn_guide_ct_box_def']='<p>«Показати ізолінії», коли знято, ховає заливку й лінії та зберігає кольори вузлів. У вікні також є «Забарвлювати вузли за» та «Кольорова схема», які є тими самими двома налаштуваннями, що й у Налаштування, Візуалізація, Кольори вузлів, «Заливка» (Немає, Плавна або Смуги, що фарбує кожен клас рівномірно), «Непрозорість заливки», «Лінії рівня» з їхніми «Інтервал» і «Підписи» та «Буфер» у кратних медіанної довжини труби. У проєкті, розміщеному на Землі, вікно також може брати ґрунт між вузлами з DEM Mapbox, після того як відвідувач погодиться надіслати номери плиток області мережі. Ці налаштування зберігаються разом із проєктом і можуть бути перевизначені сценарієм. Карта змінює лише відображення, а не мережу.</p>';
$ec_lang['lpn_guide_ct_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_ct_example_def']='<p>Відкрийте приклад Net1 і виберіть Вода, Графіки, Ізолінії. Вузли забарвлено за тиском, а рядок під шкалою кольорів вказує 9 вузлів, 11 труб, охоплення в 2.5 раза більше за медіанну довжину труби поруч з ними та лінії через кожні 5 psi. Насос, з’єднання 9, не входить до 11 труб. Коли «Показати ізолінії» знято, вузли залишаються забарвленими за тиском.</p>';
// The Run report, Status changes, and Full report chapters (Task 785). Held by dev/lpn-spike/user-guide-reports-harness.js.
$ec_lang['lpn_guide_rr_what_term']='Що містить звіт';
$ec_lang['lpn_guide_rr_what_def']='<p>Виберіть Вода, Звіти, Розрахунок. Звіт — це текст, який рушій EPANET записав для останнього моделювання за розширений період, посторінково. Він починається з банера й назви мережі, потім рахує вузли, резервуари, ємності, труби, насоси й клапани, потім указує параметри аналізу, а потім перелічує гідравлічний стан розрахунку з його попередженнями. Кнопка «Копіювати» копіює текст.</p>';
$ec_lang['lpn_guide_rr_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_rr_example_def']='<p>Відкрийте приклад Net1, який уже розраховано, і виберіть Вода, Звіти, Розрахунок. Підсумок рахує 9 вузлів, 1 резервуар, 1 ємність, 12 труб, 1 насос і 0 клапанів. Формула втрат напору — Hazen-Williams, гідравлічний часовий крок — 1.00 hrs, а загальна тривалість — 24.00 hrs.</p>';
$ec_lang['lpn_guide_st_what_term']='Що перелічено';
$ec_lang['lpn_guide_st_what_def']='<p>Виберіть Вода, Звіти, Зміни стану. Кожен рядок указує час зміни та саму зміну: насос, клапан чи труба тепер відкриті або тепер закриті, чи ємність тепер наповнюється, спорожнюється, повна або порожня. Часовий крок, що не збігся повністю, теж перелічено. Список розташовано в порядку часу, і він містить лише зміни, а не кожен крок. Його зчитано з того самого розрахунку за розширений період, що й панель «Таблиці» та Повний звіт.</p>';
$ec_lang['lpn_guide_st_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_st_example_def']='<p>Відкрийте приклад Net1 і виберіть Вода, Звіти, Зміни стану. Ємність N2 тепер наповнюється о 1:00, спорожнюється об 11:00, наповнюється о 16:00 і спорожнюється о 22:00. Насос L9 тепер закрито о 10:00, тепер відкрито о 15:00 і тепер закрито о 21:00.</p>';
$ec_lang['lpn_guide_fr_what_term']='Що містить таблиця';
$ec_lang['lpn_guide_fr_what_def']='<p>Виберіть Вода, Звіти, Повний. Таблиця має по одному рядку для кожного вузла й з’єднання на кожному звітному часовому кроці, в одиницях панелі «Таблиці». Її стовпці: Тип, ID, Споживання, Напір, Тиск, Концентрація хлору, Витрата, Швидкість, Втрати напору, Напір насоса й Стан, і клітинка порожня там, де в елемента немає такої величини. Список «Крок часу» вибирає показаний крок, а «Завантажити CSV» і «Надрукувати звіт» охоплюють кожен крок. Без моделювання за розширений період таблиця показує поточний розв’язок на один момент.</p>';
$ec_lang['lpn_guide_fr_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_fr_example_def']='<p>Відкрийте приклад Net1 і виберіть Вода, Звіти, Повний. 24 елементи перелічено на 25 звітних кроках, від 0:00 до 24:00, що становить 600 рядків. О 0:00 вузол 11 має споживання 150 gpm, напір 985.23 ft H2O і тиск 119.26 psi.</p>';
// The Calibration chapter (Task 785). Held by dev/lpn-spike/user-guide-calibration-harness.js.
$ec_lang['lpn_guide_cal_what_term']='Що порівнює звіт';
$ec_lang['lpn_guide_cal_what_def']='<p>Виберіть Вода, Звіти, Калібрування. Список «Параметр» вибирає, що вимірює файл: Споживання, Напір, Тиск, Концентрацію хлору, Витрату чи Швидкість. Для кожного параметра зберігається один файл, а кнопка «Завантажити файл калібрування…» відкриває вікно вибору файлу. Звіт має три сторінки. «Статистика» дає для кожного місця кількість спостережень, спостережене середнє, обчислене середнє, середню похибку й СКП, потім рядок «Мережа» для всіх місць разом і кореляцію між середніми. «Кореляційний графік» наносить кожне вимірювання за його спостережуваним значенням по горизонталі й обчисленим по вертикалі, з діагональною лінією там, де вони збігаються. «Порівняння середніх» малює спостережене й обчислене середні парою стовпчиків для кожного місця.</p><p>Обчислене значення зчитується з розрахунку за розширений період, а вимірювання між двома звітними кроками порівнюється зі значенням, інтерпольованим між ними. Вимірювання поза часом, про який повідомив розрахунок, пропускається й рахується. Для розв’язку на один момент кожне вимірювання порівнюється з тим одним результатом, який би час не вказував файл. Звіт заповнюється після розрахунку мережі.</p>';
$ec_lang['lpn_guide_cal_file_term']='Файл калібрування';
$ec_lang['lpn_guide_cal_file_def']='<p>Текстовий файл з ID місця, часом і виміряним значенням у кожному рядку. Час відлічується від початку моделювання, в десяткових годинах або у форматі години:хвилини. Крапка з комою починає коментар. Рядок лише з часом і значенням належить місцю з рядка вище. Значення читаються в одиницях проєкту, і звіт вказує, в яких саме. Місце, якого немає в мережі, перелічується, а його вимірювання рахуються пропущеними, рядок, який неможливо прочитати, перелічується за номером рядка, а решта файлу використовується. Файл зберігається в пам’яті для відкритого проєкту лише на час цього завантаження сторінки. Він не зберігається ні з проєктом, ні на цьому пристрої. Коли діаграма «Часовий ряд» показує ту саму величину, виміряні значення малюються на ній кільцями.</p>';
$ec_lang['lpn_guide_cal_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_cal_example_def']='<p>Відкрийте приклад Net1, розрахуйте його й виберіть Вода, Звіти, Калібрування. Вибравши Тиск, завантажте файл, що вказує для вузла 11 тиск 118.5 psi о 0:00 і 121.0 psi о 12:00, для вузла 31 — 110.2 psi о 6:00 і 108.7 psi о 18:00, а для вузла 99 — 50 psi о 0:00, і далі рядок, який не є даними. Звіт повідомляє, що файл має 5 вимірювань у 3 місцях, називає вузол 99 таким, якого немає в мережі, з 1 пропущеним вимірюванням, і перелічує нечитабельний рядок. «Статистика» показує для вузла 11 2 спостереження, спостережене середнє 119.75 psi, обчислене середнє 116.53 psi, середню похибку 3.98 і СКП 5.12. Вузол 31 має 109.45, 118.71, 9.26 і 9.79. Рядок «Мережа» має 4 спостереження, середню похибку 6.62 і СКП 7.81.</p>';
// Where the Guide lists its own keys, so that a search for one finds it.
$ec_lang['lpn_guide_using_heading']='Користування посібником';
$ec_lang['lpn_guide_keys_term']='Клавіатурні скорочення посібника';
$ec_lang['lpn_guide_keys_def']='<table class="lpn-notes-table"><tbody><tr><td>?</td><td>Відкрити посібник на кнопці панелі інструментів або рядку меню під вказівником чи з фокусом. В інших місцях відкрити його з вибраним полем пошуку. Клавіша не відкриває його, поки вводять у поле або поки відкрите запитання.</td></tr><tr><td>F1</td><td>Відкрити посібник на записі про вікно, що має фокус.</td></tr><tr><td>Ctrl+K</td><td>Відкрити посібник із вибраним полем пошуку та будь-яким вибраним текстом, до 80 символів, у ньому. Вона замінює власну Ctrl+K браузера, крім випадку, коли відкрите запитання, і тоді посібник не відкривається.</td></tr><tr><td>/</td><td>Вибрати поле пошуку, коли фокус у посібнику.</td></tr><tr><td>Esc</td><td>Поки фокус у посібнику, закрити його й повернути фокус туди, де він був.</td></tr></tbody></table>';
$ec_lang['lpn_guide_use_term']='Пошук, посилання й що запам’ятовується';
$ec_lang['lpn_guide_use_def']='<p>Пошук ігнорує великі літери й акценти та перелічує рядки й записи, що містять набраний текст. Вибір рядка показує, де розташовано цей елемент керування. Він ніколи не запускає елемент. На телефоні, де панель інструментів згорнуто, рядок панелі відкриває рядок меню, що робить те саме.</p><p>Адреса сторінки слідує за записом, який читають, наприклад <code>Looped-Network.php#guide</code>, тож її можна скопіювати як посилання на цей запис. Закриття посібника її очищає. Посібник запам’ятовує в цьому браузері, чи він був відкритий, його положення й розмір та чи приховано його список змісту. На телефоні список змісту спочатку приховано.</p>';
// Under a toolbar button in the User guide, naming the menu row that does the same thing.
// {menu} becomes a path such as "Edit > Delete", drawn with chevrons; keep {menu} as it is.
$ec_lang['lpn_guide_also']='Також у меню «{menu}»';
$ec_lang['lpn_guide_how_popup']='«Властивості» відкриваються, коли вибирають елемент чи текст.';
$ec_lang['lpn_guide_not_shown']='Цього елемента керування зараз немає на екрані.';
// The box's two context headings. "Tables" holds the two table-help entries that used to sit only
// in the Notes list (lpn_notes_6/7, moved rather than duplicated); "Map" is new -- the digit tool
// keys, Undo and the zoom keys had never been gathered anywhere before.
$ec_lang['lpn_hotkeys_tables_heading']='Таблиці';
$ec_lang['lpn_hotkeys_map_heading']='Карта';
$ec_lang['lpn_hotkeys_map_term']='Комбінації клавіш карти';
// Same shape as lpn_notes_7_def: one table, one row per key. The ten digits are LPN_TOOL_KEYS in
// js/looped-network.js; Select also answers to Esc and Delete to the Delete key
// (LPN_TOOL_ALT_KEYS); Ctrl+Z is undo(); +/- and = are keyZoom() (ROADMAP Task 682).
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>0 або Esc</td><td>Вибрати.</td></tr><tr><td>2</td><td>Додати вузол.</td></tr><tr><td>3</td><td>Додати резервуар.</td></tr><tr><td>4</td><td>Додати ємність.</td></tr><tr><td>5</td><td>Додати трубу.</td></tr><tr><td>6</td><td>Додати насос.</td></tr><tr><td>7</td><td>Додати клапан.</td></tr><tr><td>8</td><td>Додати Абонента.</td></tr><tr><td>9</td><td>Додати текст.</td></tr><tr><td>Delete</td><td>Видалити виділене.</td></tr><tr><td>Ctrl+Z</td><td>Скасувати останню зміну.</td></tr><tr><td>+ або =</td><td>Збільшити.</td></tr><tr><td>-</td><td>Зменшити.</td></tr></tbody></table>';
// The W row of the Map table. Its own key, spliced into the table by Looped-Network.php, because a new row in
// lpn_hotkeys_map_def is new markup that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_zoomwin_def']='Наблизити вікном: перетягніть прямокутник на карті, щоб наблизити цю ділянку.';
// The menu chords (Task 748): Alt+Shift+letter on Windows and Linux, Ctrl+Option on a Mac, and F10.
// Exactly two rows (Tom, 2026-10-03: "show only the Alt+Shift and the F10"); the letters themselves
// are assigned per language by menuMnemonics() and shown on the menus, never listed here.
// A separate block rather than rows in lpn_hotkeys_map_def, because a new row there is new markup
// that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_menu_heading']='Меню';
$ec_lang['lpn_hotkeys_menu_term']='Комбінації клавіш меню';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+літера</td><td>Відкрийте меню з цією літерою, потім натисніть літеру потрібного рядка, щоб обрати його. Літери видно, поки ви користуєтеся клавіатурою. На Mac використовуйте Ctrl+Option.</td></tr><tr><td>F10</td><td>Перейти до рядка меню.</td></tr></tbody></table>';
// The Screenshot keys. A separate block, for the reason given above the menu block.
$ec_lang['lpn_hotkeys_snip_heading']='Знімок екрана';
$ec_lang['lpn_hotkeys_snip_term']='Клавіатурні скорочення знімка екрана';
$ec_lang['lpn_hotkeys_snip_def']='<table class="lpn-notes-table"><tbody><tr><td>S</td><td>Фрагмент, поки відкрито Знімок екрана.</td></tr><tr><td>E</td><td>Гумка, у режимі розмітки.</td></tr><tr><td>Ctrl+Z, Ctrl+Y</td><td>Скасувати й повторити, у режимі розмітки.</td></tr><tr><td>Esc</td><td>Скасувати фрагмент або вийти з гумки. У режимі розмітки закриває його, якщо нічого не намальовано.</td></tr></tbody></table>';
// ---- "Something wrong here?" (ROADMAP Tasks 207 and 768) ----
// Two sites, one behaviour -- a standing cell in the map's bottom strip, and the same control inside
// the solver's diagnostic box when one is on screen. The first click opens a box; Send is the second.
// The thank-you must never imply an answer: a reply comes only to somebody who left an address.
$ec_lang['lpn_wrong_btn']='Тут щось не так?';
// The standing message's own Hide control. A hidden message leaves the map and waits as the top row of the
// message history (the down-arrow glyph), marked by lpn_msglog_hidden, with lpn_msglog_unhide to bring it back.
$ec_lang['lpn_status_dismiss']='Сховати це повідомлення';
$ec_lang['lpn_msglog_hidden']='Сховано';
$ec_lang['lpn_msglog_unhide']='Показати';
$ec_lang['lpn_status_hidden_tip']='Знову показати на карті сховане повідомлення.';
// Rewritten for the two-click box (Task 768); TGH's 2026-09-07 wording described one press.
$ec_lang['lpn_wrong_tip']='Повідомити про помилку на цій сторінці. Відкривається вікно, у якому можна вибрати проблему, додати коментар і ввести адресу електронної пошти, якщо потрібна відповідь. Усі поля необов’язкові, і нічого не надсилається, доки ви не натиснете «Надіслати».';
$ec_lang['lpn_wrong_thanks']='Дякуємо. Ваше повідомлення отримано.';
// The box "Something wrong here?" opens (ROADMAP Task 768). Every field is optional; Send with
// nothing in it posts only the anonymous tally the button always posted. The four picks are canned
// phrases a visitor may toggle in any combination. lpn_fb_sends must stay true to send-feedback.php
// and to the "Messages you send us" row of privacy.php.
$ec_lang['lpn_fb_intro']='Готові повідомлення (необов’язково). Нічого не надсилається, доки ви не натиснете «Надіслати».';
$ec_lang['lpn_fb_pick_numbers']='Числа виглядають неправильно';
$ec_lang['lpn_fb_pick_broken']='Щось не спрацювало';
$ec_lang['lpn_fb_pick_wording']='Формулювання або переклад неправильні';
$ec_lang['lpn_fb_pick_confusing']='Це незрозуміло';
$ec_lang['lpn_fb_comment']='Коментарі (необов’язково)';
$ec_lang['lpn_fb_email']='Електронна пошта (необов’язково, лише якщо потрібна відповідь)';
$ec_lang['lpn_fb_sends']='Що надсилається: назва цієї сторінки, ваша мова, версія сайту, код повідомлення на карті, якщо воно є, і те, що ви вибрали чи ввели. Ніколи не надсилаються ваш рисунок і ваша мережа. Вашу адресу електронної пошти використовують лише для відповіді вам.';
$ec_lang['lpn_fb_send']='Надіслати';
$ec_lang['lpn_fb_sending']='Надсилання…';
$ec_lang['lpn_fb_failed']='Повідомлення до нас не дійшло. Те, що ви написали, залишається тут, тож можна спробувати ще раз.';
$ec_lang['lpn_fb_bad_email']='Ця адреса електронної пошти виглядає неправильно. Виправте її або залиште поле порожнім.';
$ec_lang['lpn_fb_busy']='За останні кілька хвилин надійшло забагато повідомлень. Те, що ви написали, залишається тут, тож можна спробувати пізніше.';
$ec_lang['lpn_status_example_opened']='Відкрито {name} як копію. Збережіть її через «Файл, Зберегти як».';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Ця сторінка не змогла визначити розмір області карти, тож карта показує останній вигляд, який вдалося обчислити. Зміна розміру вікна змушує спробувати знову. Якщо це повторюється, зазвичай причина — розширення браузера, що блокує вимірювання сторінки.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Базова мережа, л/с (СІ)';
$ec_lang['lpn_ex_basic_si_desc']='Два резервуари, насос і невелике кільце. Літри за секунду, з метрами й міліметрами.';
$ec_lang['lpn_ex_basic_us_title']='Базова мережа, gpm (США)';
$ec_lang['lpn_ex_basic_us_desc']='Два резервуари, насос і невелике кільце. Галони за хвилину, з футами й дюймами.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 із керуванням на основі правил';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Вигаданий приклад EPANET із хлором, 1 резервуаром і 1 ємністю.';
$ec_lang['lpn_ex_net1_si_title']='EPANET Net1 плюс керування на основі правил, L/s (SI)';
$ec_lang['lpn_ex_net1_si_desc']='Літри за секунду, з метрами й міліметрами. Вигаданий приклад EPANET, перерахований із галонів за хвилину, футів і дюймів, із хлором, 1 резервуаром, 1 ємністю, 1 насосом і двома керуваннями на основі правил.';
$ec_lang['lpn_ex_net2_si_title']='EPANET Net2, л/с (СІ)';
$ec_lang['lpn_ex_net2_si_desc']='Літри за секунду, з метрами й міліметрами. Приклад EPANET у Бренфорді, штат Коннектикут, перерахований із галонів за хвилину, футів і дюймів: 35 вузлів і 1 ємність, без резервуара, без насоса й без клапанів, приблизно 2 км на 4 км. Фторид, нереактивна речовина, надходить в одному джерелі.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2, gpm (США)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Галони за хвилину, з футами й дюймами. Приклад EPANET у Бренфорді, штат Коннектикут: 35 вузлів і 1 ємність, без резервуара, без насоса й без клапанів, приблизно 1 миля на 2 милі. Фторид, нереактивна речовина, надходить в одному джерелі.';
$ec_lang['lpn_ex_net3_si_title']='EPANET Net3, л/с (СІ)';
$ec_lang['lpn_ex_net3_si_desc']='Літри за секунду, з метрами й міліметрами. Приклад EPANET у Новато, штат Каліфорнія, перерахований із галонів за хвилину, футів і дюймів, зі світовою картою позаду: 92 вузли, 3 ємності й 2 резервуари, без клапанів, приблизно 8 км у поперечнику. 24-годинне моделювання за розширений період зі слідом джерела від Озера.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3, gpm (США)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Галони за хвилину, з футами й дюймами. Приклад EPANET у Новато, штат Каліфорнія, зі світовою картою позаду: 92 вузли, 3 ємності й 2 резервуари, без клапанів, приблизно 5 миль у поперечнику. 24-годинне моделювання за розширений період зі слідом джерела від Озера.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center, gpm (США)';
$ec_lang['lpn_ex_elm_street_desc']='Галони за хвилину, з футами й дюймами. Прескотт-Веллі, штат Аризона: 17 вузлів, 1 резервуар і 1 насос. Комерційна ділянка, розрахована на протипожежну витрату понад витрату максимального добового споживання, в один момент часу, накреслена поверх плану ділянки.';
$ec_lang['lpn_tool_undo']='Скасувати';
$ec_lang['lpn_confirm_example']='Це додає приклад до наявної у вас мережі. Продовжити?';
$ec_lang['lpn_field_diameter']='Діаметр';
$ec_lang['lpn_demand_tip']='Витрати, що забираються з мережі в цьому вузлі. Введіть від\'ємне число для витрати, що подається в мережу тут.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Ця одиниця визначає, що означають ваші числа';
$ec_lang['lpn_units_warn_lead']='{unit} — це одиниця того, що ви вводите для:';
$ec_lang['lpn_units_options_head']='Коли ви змінюєте одиницю:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Без руйнування';
$ec_lang['lpn_units_nondestructive_desc']='Без руйнування: кожне введене значення лишається таким, як є, і читається наново в новій одиниці.';
$ec_lang['lpn_units_destructive']='З перерахунком';
$ec_lang['lpn_units_destructive_desc']='З перерахунком: кожне введене значення переписується математичним перерахунком, тож мережа лишається фізично майже такою самою, в межах похибки перерахунку. Початкові значення втрачаються. Скасування (Undo) повертає їх.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='Значення ({n}) тепер означають {unit}. Нічого не переписано.';
$ec_lang['lpn_status_converted']='Значення ({n}) переписано в {unit}.';
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
$ec_lang['lpn_units_length']='Довжина';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Координати карти';
$ec_lang['lpn_units_mapcoords_deg']='градуси';
$ec_lang['lpn_units_usft']='фут США (геодезичний)';
$ec_lang['lpn_units_elevhead']='Відмітка і напір';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Ухил втрат напору';
$ec_lang['lpn_result_gradient_tip']='Втрати напору, поділені на довжину труби. Використовуйте це, щоб порівнювати труби різної довжини за єдиною проєктною межею.';
$ec_lang['lpn_result_water_age']='Вік води';
$ec_lang['lpn_result_water_age_tip']='Час, який вода, що досягла цієї точки, провела в системі. Там, де зустрічаються потоки, число — це середнє віків води, що надходить, зважене за витратою. В ємності це середній вік накопиченої води, тому ємність із повільним оновленням води зазвичай містить найстарішу воду в мережі. Нормативної межі для порівняння немає, тож оцінюйте його за умовами системи, що моделюється.';
$ec_lang['lpn_result_source_share']='Частка джерела';
$ec_lang['lpn_result_source_share_tip']='Яка частка води, що досягла цієї точки, надійшла з вузла трасування. Саме це показує аналіз «Трасування джерела».';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Середній вік води';
$ec_lang['lpn_result_avg_source_share']='Середня частка джерела';
$ec_lang['lpn_result_avg_concentration']='Середня концентрація';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Коефіцієнт опору';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Швидкість реакції';
$ec_lang['lpn_result_status']='Стан';
$ec_lang['lpn_result_status_open']='Відкрито';
$ec_lang['lpn_result_status_closed']='Закрито';
$ec_lang['lpn_result_head']='Напір';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Потенціальна енергія води в цьому вузлі, виражена як висота стовпа води. Це абсолютна висота, тоді як тиск — манометричне вимірювання.';
// A tank's depth and usable volume (Task 783). Depth is head minus the tank bottom, which is our
// Elevation. Volume is zero at the Lowest water depth, so it is NOT EPANET's tank volume, which also
// counts the water below the lowest water depth (that water is in the mixing volume, it just cannot be drawn down).
$ec_lang['lpn_result_depth']='Глибина';
$ec_lang['lpn_result_depth_tip']='Глибина води в ємності на показаний момент, відлічена вгору від дна ємності: напір мінус відмітка ємності.';
$ec_lang['lpn_result_tank_volume']='Доступний об’єм';
$ec_lang['lpn_result_tank_volume_tip']='Об’єм води вище за найменшу глибину води, тож за цієї глибини він дорівнює нулю. Об’єм ємності в EPANET містить і воду нижче за найменшу глибину води, яка все одно враховується для перемішування та віку води, тому відмітка ємності лишається на дні ємності.';
$ec_lang['lpn_result_pressure']='Тиск';
$ec_lang['lpn_result_flow']='Витрата';
$ec_lang['lpn_result_velocity']='Швидкість';
$ec_lang['lpn_result_headloss']='Втрати напору';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Скинути налаштування лише цього проєкту. Креслення та інші проєкти не змінюються. Щоб повторно використовувати набір налаштувань, збережіть файл проєкту, який містить лише налаштування.';
$ec_lang['lpn_reset_all_tip']='Видаляє кожен проєкт, кожне фонове зображення, кожне налаштування та ваш вибір одиниць, а потім перезавантажує сторінку так, як її бачить відвідувач уперше. Це єдине скидання, яке очищає все.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Цей калькулятор зберігає одиниці й введені значення проєкту так, як ви їх ввели, але раніше він переводив числа в СІ для зберігання. Цей проєкт був збережений до цієї зміни, тому його числа зберігалися в СІ. Перевести їх востаннє в поточні одиниці? Щоб ви могли оцінити зміну, ось кілька діаметрів, які будуть переведені, з їхніми значеннями до і після:';
$ec_lang['lpn_v2_restore_yes']='Перевести';
$ec_lang['lpn_v2_restore_never']='Ні. Більше не питати.';
$ec_lang['lpn_v2_restore_no']='Закрити, щоб я спершу перевірив поточні одиниці';
$ec_lang['lpn_storage_too_new']='Цей проєкт був збережений новішою версією сторінки, тому тут його не можна відкрити.';
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
$ec_lang['lpn_menu_edit']='Правка';
$ec_lang['lpn_menu_insert']='Вставка';
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
$ec_lang['lpn_basemap_show']='Показати карту вулиць';
$ec_lang['lpn_basemap_satellite_show']='Показати супутникові знімки';
$ec_lang['lpn_basemap_topo_show']='Показувати топографічну карту';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='Геоприв’язана';
$ec_lang['lpn_xymap']='Локальна';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Перетворити як…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Копія {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:4326), not a fourth case; EPSG:3857 is a
// projected system in meters since Task 775.
$ec_lang['lpn_convas_title']='Перетворити як';
$ec_lang['lpn_convas_coordsys_tip']='Система координат, у яку перетворюється копія. Якщо вона відрізняється від системи цього проєкту, далі йдуть два кроки розміщення. Для проєкту, який уже геоприв’язаний, обидва кроки відкриваються заповненими, готовими до прийняття чи зміни.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Поточна: {crs}';
$ec_lang['lpn_convas_epsg']='Система координат EPSG';
$ec_lang['lpn_convas_epsg_tip']='Виберіть систему координат з реєстру EPSG. Пропонований вибір — WGS 84 (EPSG:4326), широта й довгота. WGS 84 / Pseudo-Mercator (EPSG:3857), яку зазвичай називають Web Mercator, дає x та y у метрах, а її відстані на карті перевищують відстані на місцевості далі від екватора. Довжини труб обчислюються як відстані на місцевості в обох системах.';
$ec_lang['lpn_convas_unnamed']='Без назви (локальна) геоприв’язка';
$ec_lang['lpn_convas_unnamed_tip']='Локальні координати в одиниці довжини, з приєднаною картою світу.';
$ec_lang['lpn_convas_none_tip']='Локальні координати в одиниці довжини, поки без карти світу.';
$ec_lang['lpn_convas_units_tip']='Одиниці, у які перетворюється копія.';
$ec_lang['lpn_convas_round']='Округлити перетворені значення';
$ec_lang['lpn_convas_round_tip']='Крок округлення, який застосовується лише до чисел, що їх перезаписує це перетворення. Значення, одиниця яких не змінюється, залишаються як є.';
$ec_lang['lpn_convas_round_none']='Без округлення';
$ec_lang['lpn_convas_round_flow']='Витрата споживання та витрата';
$ec_lang['lpn_convas_label_col']='Суфікс';
$ec_lang['lpn_convas_label_tip']='Текст, доданий після цього значення в підписах на карті копії, наприклад « мм» або « gpm». Попередньо заповнюється з одиниці, вибраної вище; очистіть поле, щоб не було суфікса.';
$ec_lang['lpn_convas_oneway']='Перетворення назад — це друге перетворення, а не скасування. Число, перетворене й перетворене назад, може не повернутися точно таким, яким було введено.';
$ec_lang['lpn_convas_ok']='Перетворити';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} — одна з небагатьох перелічених систем координат без придатної інформації про проєкцію, тож перетворити в неї або з неї неможливо. Нічого не перетворено.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='Перетворена копія — {name}. Оригінальний проєкт не змінено.';
$ec_lang['lpn_convas_cancelled']='Нічого не перетворено. Копію закрито, а оригінальний проєкт не змінено.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Копіює цей проєкт на нову вкладку й перетворює копію в систему координат та одиниці, які ви виберете. Коли система координат змінюється, майстер проводить вас через приблизне масштабування карти позаду вашої мережі, а потім точніше масштабування й обертання вашої мережі на карті. Цей проєкт лишається точно таким, як є. Щоб геоприв’язати без будь-якого перетворення, натомість скористайтеся «Карта, Карта світу, Приєднати».';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Цей проєкт уже геоприв’язаний, тож мережа вже на карті і нічого не переміщено. Перевірте, що вона на правильному місці, а потім натисніть кнопку «Розмістити модель тут» і кнопку «Зберегти це розміщення».';
$ec_lang['lpn_georef_intro']='Розміщення моделі складається з двох кроків. Крок 1 наближений: модель лишається нерухомою на екрані, поки ви панорамуєте й масштабуєте карту за нею, доки ділянка не опиниться під моделлю приблизно в потрібному масштабі. На цьому кроці повороту немає. Крок 2 точний: перетягніть, змініть розмір і поверніть саму модель. Проєкт починається з карти всього світу, тож спершу знайдіть місце, а потім натисніть кнопку «Розмістити модель тут».';
$ec_lang['lpn_georef_adjust']='Модель тепер прикріплена до карти, тож рухається разом із нею. Перетягніть модель, щоб перемістити її, перетягніть кут, щоб змінити розмір, або перетягніть круглий маркер над моделлю, щоб повернути її. Або введіть відстань на місцевості й кут повороту нижче.';
$ec_lang['lpn_georef_step1']='Крок 1 з 2 — швидкий';
$ec_lang['lpn_georef_step2']='Крок 2 з 2 — точний';
$ec_lang['lpn_georef_step1_hint']='Ваш проєкт залишається на своєму місці на екрані. Панорамуйте й масштабуйте карту під ним, доки місцевість під ним не опиниться приблизно в потрібному місці та приблизно в потрібному масштабі, тоді натисніть «Розмістити модель тут».';
$ec_lang['lpn_georef_detach']='Підняти знову';
$ec_lang['lpn_georef_size_prompt']='Якою є приблизна ширина ділянки через увесь проєкт?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Швидка клавіша: натисніть {key}.';
$ec_lang['lpn_tool_key_hint_two']='Комбінація клавіш: натисніть {key} або {key2}.';
$ec_lang['lpn_tool_add_chain_tip']='Ланцюжок вузлів і труб: укажіть точку на карті, щоб додати вузол, потім указуйте кожну наступну точку, щоб додати трубу й вузол. Укажіть наявний вузол, щоб продовжити від нього. Натисніть Escape, щоб завершити ланцюжок.';
// The Shape tool (Task 779). The word is Tom's: "we call it a 'Shape'".
$ec_lang['lpn_tool_add_shape']='Фігура';
$ec_lang['lpn_tool_add_shape_tip']='Накреслити на карті точку, полілінію або полігон. Фігура є анотацією і не входить до мережі. Укажіть кожну точку, потім укажіть останню точку ще раз, натисніть Enter або клацніть правою кнопкою миші, щоб завершити. Укажіть першу точку ще раз, щоб замкнути Фігуру в полігон.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Вибір області: вікном, ласо або багатокутником.';
$ec_lang['lpn_area_selected']='{n} вибрано.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='У цій області нічого не знайдено.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Додавайте та прибирайте вершини труб. Укажіть точку на трубі, щоб додати вершину, виберіть вершину, щоб прибрати її, і перетягніть вершину, щоб перемістити її. Вершина змінює автоматичну довжину, але не додає й не змінює місцеві втрати.';
$ec_lang['lpn_tool_undo_tip']='Скасувати. Історія скасування — 20 дій';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Вписати всю мережу у вікно карти. Щоб скористатися «Наблизити вікном» без попереднього вписування, натисніть W або клацніть маленький трикутник у куті кнопки панелі інструментів «Показати все». Дивіться також елементи керування масштабом карти вгорі праворуч.';
$ec_lang['lpn_tool_zoom_selection_tip']='Вписати вибрані елементи у вікно карти. Спочатку виберіть один або кілька елементів.';
$ec_lang['lpn_tool_zoom_window_tip']='Укажіть кути або перетягніть прямокутник. Натисніть ще раз для «Показати все».';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Наблизити. Комбінація клавіш: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Віддалити. Комбінація клавіш: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Простий або складний пошук і заміна';
// **"Toolbar"** (Tom renamed it from "Toolbar key" to "Toolbar" on 2026-09-30).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. The row earns its place.
$ec_lang['lpn_help_icons']='Панель інструментів';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Видимість';
$ec_lang['lpn_color_legend_open_tip']='Натисніть, щоб відкрити налаштування розфарбовування й змінити ці кольори.';
$ec_lang['lpn_color_node_field']='Забарвлювати вузли за';
$ec_lang['lpn_color_link_field']='Забарвлювати труби за';
$ec_lang['lpn_color_ramp_sequential']='Послідовна';
$ec_lang['lpn_color_ramp_diverging']='Розбіжна';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Кількість діапазонів';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Розподіл діапазонів';
$ec_lang['lpn_color_ranges_note']='Межі нижче фіксуються після встановлення; вони не змінюються слідом за результатами. Вибір методу класифікації даних вище встановлює межі за поточним станом системи. Якщо ви зміните будь-яке значення вручну, метод вище стане «Вручну».';
$ec_lang['lpn_color_criterion_note']='Цей метод бере межі з проєктного стандарту, тому кількість кольорів фіксована, доки обрано цей метод.';
$ec_lang['lpn_color_break_number']='Межа має бути числом. Карту не змінено.';
$ec_lang['lpn_color_break_order']='Кожна межа має бути більшою за попередню. Карту не змінено.';
$ec_lang['lpn_color_break_count']='Меж має бути на одну менше, ніж кольорів. Карту не змінено.';
$ec_lang['lpn_color_ramp_qualitative']='Якісна';
$ec_lang['lpn_color_ramp_rainbow']='Веселка';
$ec_lang['lpn_color_ramp_rainbow_eg']='як у EPANET';
$ec_lang['lpn_color_example_material']='Матеріал';
$ec_lang['lpn_color_ramp_ylgnbu']='Від жовтого до синього';
$ec_lang['lpn_color_ramp_rdylbu']='Від червоного до синього через жовтий';
$ec_lang['lpn_georef_drop']='Розмістити модель тут';
$ec_lang['lpn_georef_finish']='Залишити це розміщення';
$ec_lang['lpn_georef_scale']='Відстань на місцевості на одиницю креслення';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Обчислюється автоматично. Змініть, щоб відредагувати. Введіть 1, щоб використати координати файлу без змін як відстані на місцевості, наприклад для файлу без системи координат.';
$ec_lang['lpn_georef_rotation']='Поворот проти годинникової стрілки (градуси)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Поворот усієї моделі проти годинникової стрілки, щоб узгодити її з новою системою координат.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Розмістити модель тут остаточно? Елементи й після цього можна перетягувати по одному, але продовження зараз перетворює всі координати одразу. Щоб повернути старі координати, поверніться до початкового проєкту й закрийте цей без збереження.';
$ec_lang['lpn_georef_done']='Тепер це проєкт lat/lon. Перетягніть будь-який елемент, щоб перемістити його ближче до його справжнього місця.';
$ec_lang['lpn_georef_backdrop_unrotated']='Фонове зображення перемістилося й змінило розмір разом із моделлю, але його не вдалося повернути. Скористайтеся «Карта, Фонове зображення, Перемістити», щоб вирівняти його.';
$ec_lang['lpn_georef_empty']='Цей файл не містить мережі, тож розміщувати нічого.';
$ec_lang['lpn_georef_unavailable']='Інструмент розміщення не завантажився. Перезавантажте сторінку й спробуйте ще раз.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Завершіть перетворення кнопкою «Залишити це розміщення» або натисніть «Скасувати», перш ніж перемикати проєкти. Розміщення стосується лише цього проєкту.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Завершіть розміщення кнопкою «Зберегти це розміщення» або натисніть «Скасувати», перш ніж зберігати. Проєкт усе ще перебуває в процесі розміщення, тож те, що на екрані, ще не те, що буде записано у файл.';
$ec_lang['lpn_goto_menu']='Перейти до широти й довготи…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='Широта і довгота, саме в такому порядку';
$ec_lang['lpn_goto_bad']='Це не одна широта й одна довгота. Спробуйте 38 -122, із пробілом між ними.';
$ec_lang['lpn_georef_goto']='Перейти до…';
$ec_lang['lpn_georef_twopt']='Використати дві відомі точки';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Розмістіть модель точно, коли відомі справжні широта й довгота двох точок на кресленні. Укажіть одну з них, введіть її широту й довготу, потім зробіть те саме для другої точки. Положення, масштаб і поворот обчислюються за цими двома точками. Натисніть ще раз, щоб скасувати, або натисніть Esc.';
$ec_lang['lpn_georef_twopt_pick1']='Клацніть на точці свого креслення, чиї широту й довготу ви знаєте.';
$ec_lang['lpn_georef_twopt_pick2']='Тепер клацніть на другій відомій точці, якомога далі від першої.';
$ec_lang['lpn_georef_twopt_same']='Це та сама точка, яку ви обрали першою. Оберіть іншу.';
$ec_lang['lpn_georef_twopt_done']='Тепер модель розташована за двома точками, які ви задали. Перевірте це, потім натисніть «Залишити це розміщення».';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Нижня панель';
$ec_lang['lpn_pane_toggle_tip']='Показати або сховати панель під картою. На ній розміщено графіки й таблицю для кожного виду елементів.';
$ec_lang['lpn_pane_resize']='Перетягніть, щоб зробити панель вищою або нижчою';
$ec_lang['lpn_pane_tab_junctions']='Вузли';
$ec_lang['lpn_pane_tab_reservoirs']='Резервуари';
$ec_lang['lpn_pane_tab_tanks']='Ємності';
$ec_lang['lpn_pane_tab_pipes']='Труби';
$ec_lang['lpn_pane_tab_pumps']='Насоси';
$ec_lang['lpn_pane_tab_valves']='Клапани';
$ec_lang['lpn_pane_tab_tip']='Редагуйте елементи як таблицю, подібну до електронної. Стовпці результатів редагувати не можна. Клавіатурні скорочення дивіться в Довідка, Примітки.';
$ec_lang['lpn_pane_popout']='Відкрити у вікні';
$ec_lang['lpn_pane_none']='У цій мережі ще немає жодного з цих елементів.';
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
$ec_lang['lpn_pane_text_attached']='Прикріплено';
$ec_lang['lpn_pane_not_used']='Не використовується';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Відфільтровано за {q}. Показано {n} з {all}.';
$ec_lang['lpn_pane_filter_clear']='Показати все';
// Added to the filtered table's line (Task 738): rows edited since Filter in table was pressed stay
// in the table even when they no longer match, dimmed and marked, until it is pressed again. {n} is
// how many. Worded as a label and a count so no plural form is needed.
$ec_lang['lpn_pane_filter_stale']='Рядків, що більше не відповідають: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Жоден рядок цієї таблиці не відповідає фільтру.';
// Selection only (Task 757): the Tables pane filtered to what is selected on the map. Parallel to
// lpn_pane_filter_note. The line names the Find filter too when both are on.
$ec_lang['lpn_pane_filter_sel_note']='Лише вибрані. Показано {n} з {all}.';
$ec_lang['lpn_pane_filter_sel_and']='Відфільтровано за {q} і лише вибрані. Показано {n} з {all}.';
$ec_lang['lpn_pane_filter_sel_none']='Жодного з вибраних елементів немає в цій таблиці.';
$ec_lang['lpn_pane_sel_only']='Лише вибрані';
$ec_lang['lpn_pane_sel_only_none']='Жодного елемента не вибрано. Спершу виберіть елементи на карті.';
// Show scenarios (Tom, 2026-10-05): the table's cell menu switch that lists every asset once per
// scenario, with a Scenario column after ID.
$ec_lang['lpn_pane_scn_show']='Показати сценарії';
// Two switches on the cell menu while Show scenarios is on (Tom, 2026-10-07): keep only the rows whose
// scenario holds a value of its own in this table, and keep only the open scenario's rows.
$ec_lang['lpn_pane_scn_ov_only']='Лише перевизначення';
$ec_lang['lpn_pane_scn_cur_only']='Лише поточний сценарій';
$ec_lang['lpn_pane_inactive_show']='Враховувати неактивну топологію';
// The line above a table while either switch is on, beside the filter's own Show all. {filters} is one
// or both of the two switch names, joined by a comma; {n} the rows showing, {all} the rows without them.
$ec_lang['lpn_pane_scn_filter_note']='{filters}. Показано {n} із {all}.';
// The cell menu's item that removes the selected cells' scenario overrides, so each reads what its
// scenario inherits (Tom, 2026-10-06). Greyed when no selected cell holds one.
$ec_lang['lpn_ovm_child_ask']='Скасувати перевизначення дочірніх сценаріїв (усього {n})?';
$ec_lang['lpn_ovm_child_tip']='Дочірні сценарії перевизначають це значення (усього {n}). Клацніть, щоб скасувати їхні перевизначення.';
$ec_lang['lpn_ovm_dot_clear']='Клацніть, щоб скасувати його.';
$ec_lang['lpn_ovm_dot_set']='Успадковано. Клацніть, щоб зробити його перевизначенням у цьому сценарії зі збереженням показаного значення.';
$ec_lang['lpn_pane_clear_override']='Скасувати перевизначення';
// The tip on a table cell holding a value set in its row's scenario (Tom, 2026-10-06: "Demand alt.:
// Max day"). {category} is an lpn_alt_cat_* name; {alternative} is the alternative's name, which
// in Basic mode is its scenario's.
$ec_lang['lpn_pane_scn_alt_tip']='{category} альт.: {alternative}';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Наблизити й вибрати';
$ec_lang['lpn_goto_on_map']='Показати на карті';
$ec_lang['lpn_pane_select_on_map']='Вибрати на карті';
$ec_lang['lpn_pane_unselect_on_map']='Скасувати вибір на карті';
$ec_lang['lpn_pane_print']='Надрукувати таблицю';
// Tom, 2026-10-06. Copy with headings puts the heading line, unit included, above the selected cells; plain
// Copy never does. The two Export rows download the whole table as shown.
$ec_lang['lpn_pane_copy_heads']='Копіювати із заголовками стовпців';
// Tom, 2026-10-07. File, Export to, ODS/XLSX/CSV file: a box asking which tables and which scenarios.
// {format} is ODS, XLSX or CSV, the file format's own name, never translated.
$ec_lang['lpn_export_table_title']='Експорт у {format}';
$ec_lang['lpn_export_table_current']='Поточна';
$ec_lang['lpn_export_table_all']='Усі';
$ec_lang['lpn_export_table_go']='Експортувати';
$ec_lang['lpn_export_table_scn_note']='Результати експортуються лише для сценарію, розрахованого останнім.';

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
$ec_lang['lpn_menu_project_tip']='Усе, що стосується моделювання водопровідних мереж (крім кнопок відтворення анімації)';
$ec_lang['lpn_tables_menu']='Таблиці';
// Water > Morph (Task 781; Tom, 2026-10-14: *"I like the term 'Morph' (Transform) for this feature"*;
// first built as Change type, Tom, 2026-10-05: *"It would be nice to provide a tool under Water or Tables
// to Change node type for any asset, where if it has information that can't be ported to the new
// type, we alert and ask."*). The fly-out reuses lpn_tool_add_junction/_reservoir/_tank. The box it
// asks in lists one line per value lost: {id} is the asset's ID, {property} a field label the
// popup already uses, {value} the number or name with its unit, {scenario} a scenario's name.
// dev/asset-type.md.
$ec_lang['lpn_morph_menu']='Змінити тип';
$ec_lang['lpn_morph_tip']='Змінює тип вибраних вузлів (вузол, резервуар або ємність) чи вибраних зв’язків (труба, насос або клапан). Кожен зберігає свій ID, місце, зв’язки та кожне значення, яке є й у новому типі. Якщо щось буде втрачено, спершу з’явиться запит.';
$ec_lang['lpn_morph_ok']='Змінити';
// {ids} lists the selected assets of the other kind (nodes when a link type was chosen, and links
// when a node type was chosen), separated by commas.
$ec_lang['lpn_morph_other_kind']='Вузол можна змінити лише на інший тип вузла, а з’єднання — лише на інший тип з’єднання. Тип не змінено: {ids}';
// The Properties row shown where a scenario morphs the asset (Task 781): the type it is in this
// scenario, beside the override marker.
$ec_lang['lpn_field_type']='Тип';
$ec_lang['lpn_field_type_tip']='Тип цього елемента в цьому сценарії, заданий через «Змінити тип». Скасуйте перевизначення, щоб використовувати тип батьківського сценарію.';
$ec_lang['lpn_change_type_lost']='Ці значення буде втрачено:';
// The key to the lines under it (Tom, 2026-10-06: *"Provide a key for the loss report. 'ID: Lost entry'."*).
$ec_lang['lpn_change_type_key']='Кожен рядок: ID: властивість і значення, які буде втрачено';
$ec_lang['lpn_change_type_line']='{id}: {property} {value}';
$ec_lang['lpn_change_type_line_scenario']='{id}: {property} {value}, у сценарії {scenario}';
$ec_lang['lpn_change_type_line_alternative']='{id}: {property} {value}, в альтернативі {alternative}';
$ec_lang['lpn_change_type_more']='І ще {n}.';
// Heads the lines a tank-to-reservoir or reservoir-to-tank change states rather than loses: the
// water surface is carried, so the new head or water depth is listed with its value.
$ec_lang['lpn_change_type_surface']='Ці зберігають поверхню води на колишньому рівні. Напір резервуара дорівнює відмітці ємності плюс глибина води в ній, а глибина води в ємності дорівнює напору резервуара мінус відмітка:';
$ec_lang['lpn_change_type_meaning']='Ці керування та правила перевіряють вузол, що змінюється, і сприйматимуть його інакше: вузол перевіряється за тиском, а ємність чи резервуар — за рівнем води.';
// The link half (Tom, 2026-10-06: "Proceed."). Each heads a list of "ID: entry" lines.
$ec_lang['lpn_change_type_born']='Ці значення нові, задані як для щойно накресленого елемента:';
$ec_lang['lpn_change_type_no_curve']='{id}: немає кривої напору насоса, тож насос не додає напору, доки її не вибрано, а експорт у .inp записує його як трубу';
$ec_lang['lpn_change_type_becomes']='{id}: {property} {value}, у сценарії {scenario}, стає {new}';
$ec_lang['lpn_change_type_customers']='Труба — єдиний елемент, що обслуговує абонентів, тож цих абонентів натомість під’єднано до вузла, показаного в дужках, де їхню витрату вже враховано. Вони залишаються там, де накреслені, а їхня витрата не змінюється:';
$ec_lang['lpn_change_type_setting']='Ці керування та правила задають або перевіряють уставку зв’язку, що змінюється. Уставка — різна величина для труби, насоса й клапана, тому її сприйматимуть інакше:';
$ec_lang['lpn_change_type_rules']='Ці рядки правил називають зв’язок за його видом і назвуть його за новим видом:';
$ec_lang['lpn_tables_menu_tip']='Переглядайте й редагуйте елементи в таблицях на нижній панелі.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Запустити розрахунок. Зайве, коли в Налаштування, Розрахунок, Гідравліка ввімкнено «Перераховувати автоматично». Коли перерахунок вимкнено, на панелі інструментів з’являється кнопка «Розрахувати».';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Перераховувати автоматично';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Вимкніть, якщо перерахунок надто повільний. Поки це ввімкнено, кнопку «Розрахувати» приховано.';
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
$ec_lang['lpn_time_run_slow']='Розрахунок цієї мережі тривав {secs} с, а вона налаштована перераховуватися після кожної зміни. Щоб зупинити це й повернути кнопку Розрахувати, вимкніть «Перераховувати автоматично» в Налаштуваннях, у розділі Розрахунок, Гідравліка.';
$ec_lang['lpn_time_no_report']='Звіту про розрахунок ще немає. Звіт — це текстовий звіт EPANET, тож він з’являється після розрахунку цієї мережі.';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Довідка';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Галерея знімків екрана';
$ec_lang['lpn_help_walkthroughs']='Покрокові посібники';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Видалити мережу';
$ec_lang['lpn_confirm_delete_network']='Видалити всі вузли, труби й тексти в цьому проєкті? Фонове зображення, назва проєкту та налаштування збережуться.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Знайти й замінити';
// Copy and Paste properties (Task 782; Tom, 2026-10-12: a clipboard, no confirmation). Identity and
// placement are never pasted.
$ec_lang['lpn_copy_props_menu']='Копіювати властивості';
$ec_lang['lpn_copy_props_done']='Властивості {id} скопійовано.';
$ec_lang['lpn_copy_props_no_overrides']='Немає перевизначень для копіювання.';
$ec_lang['lpn_copy_props_done_ov']='Перевизначення {id} у цьому сценарії скопійовано.';
$ec_lang['lpn_paste_alt_created']='Створено альтернативу {name} категорії {category} для цього сценарію.';
$ec_lang['lpn_paste_props_menu']='Вставити властивості у вибране';
$ec_lang['lpn_paste_props_off_none']='Нічого не скопійовано. Клацніть елемент правою кнопкою або натисніть його й утримуйте та виберіть «Копіювати властивості».';
$ec_lang['lpn_paste_props_off_select']='Виберіть елементи, у які треба вставити, потім виберіть «Вставити властивості у вибране».';
$ec_lang['lpn_paste_props_off_kind']='Жоден вибраний елемент не може прийняти скопійовані властивості.';
$ec_lang['lpn_tsb_menu']='Графік часового ряду';
// The map's right-click (and long press) menu on a Text and on a dragged label (2026-10-14). Edit text
// opens the in-place editor; Reset position sends a dragged label or an attached Text home.
$ec_lang['lpn_ctx_edit_text']='Редагувати текст';
$ec_lang['lpn_ctx_reset_position']='Скинути положення';
$ec_lang['lpn_ctx_reset_position_off_tip']='Скинути можна лише підпис або прикріплений Текст, який перетягнули зі свого власного положення.';
$ec_lang['lpn_tsb_off_tip']='Потрібні результати за розширений період. Задайте загальний час роботи в Налаштування, Розрахунок, Час і розрахуйте.';
$ec_lang['lpn_tsb_close']='Закрити графік';
$ec_lang['lpn_tsb_resize']='Перетягніть, щоб змінити розмір';
$ec_lang['lpn_tsb_quantity']='Величина для графіка';
$ec_lang['lpn_tsb_max']='Закрийте графік, перш ніж відкривати інший. Одночасно можна мати відкритими до {n}.';
$ec_lang['lpn_paste_done_one']='Властивості {id} вставлено в {to}. Змінено значень: {n}.';
$ec_lang['lpn_paste_done_many']='Властивості {id} вставлено; кількість елементів: {m}. Змінено значень: {n}.';
$ec_lang['lpn_paste_skip_breakdown']='Не вставлено: {n} (споживання — це список категорій).';
$ec_lang['lpn_paste_skip_valve']='Не вставлено: {n} (типи клапанів різні).';
$ec_lang['lpn_find_title']='Знайти й замінити';
$ec_lang['lpn_find_scope']='Що шукати';
$ec_lang['lpn_find_scope_all']='Усе';
$ec_lang['lpn_find_scope_source']='Джерело';
$ec_lang['lpn_find_source_no_chemical']='Жодну речовину не відстежують, тож жоден вузол не має джерела.';
$ec_lang['lpn_find_property']='Властивість';
$ec_lang['lpn_find_condition']='Умова';
$ec_lang['lpn_find_value']='Значення';
$ec_lang['lpn_find_btn']='Знайти';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Фільтр у поточній таблиці';
$ec_lang['lpn_find_filter_tip']='Показувати лише рядки, що відповідають умові «Що шукати» вище, у кожній таблиці, де виконується пошук.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} з {all}';
$ec_lang['lpn_find_filter_summary']='Відфільтровано за {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Цей запит не застосовується до жодної таблиці.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='містить';
$ec_lang['lpn_find_op_equals']='дорівнює';
$ec_lang['lpn_find_op_gt']='більше за';
$ec_lang['lpn_find_op_lt']='менше за';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='порожньо';
// {n} is a whole number.
$ec_lang['lpn_find_count']='Знайдено: {n}. Виберіть один, щоб перейти до нього.';
$ec_lang['lpn_find_shift_hint']='Shift+клацання перемикає: додає, якщо немає в наборі вибраного, або знімає, якщо вже є.';
$ec_lang['lpn_find_none']='Нічого не знайдено.';
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
$ec_lang['lpn_find_op_top']='{n} найбільших';
$ec_lang['lpn_find_op_bottom']='{n} найменших';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Введіть, що шукати.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Зв\'язність';
$ec_lang['lpn_find_prop_demand_desc']='Опис цієї категорії витрати споживання';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='без з\'єднань у вузлі';
$ec_lang['lpn_find_op_conn_noopen']='без відкритих з\'єднань у вузлі';
$ec_lang['lpn_find_op_conn_nolinksource']='без шляху з\'єднань до джерела';
$ec_lang['lpn_find_op_conn_noopensource']='без відкритого шляху до джерела';
// A result row prints the NARROWEST condition true of that node beside its id, because "no links"
// says more than "no open path to a source" and both are true of the same node. It prints the
// SAME four keys above with the first letter capitalized in code (findConnLabel()), not a second
// capitalized copy of each (Task 699, Tom 2026-09-30: "do the Find redesign").
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Кожен вузол з\'єднаний.';
$ec_lang['lpn_find_conn_no_fixed']='Ця мережа не має резервуара чи ємності, тож джерела, до якого можна дістатися, немає. Можна шукати лише «без з\'єднань у вузлі» та «без відкритих з\'єднань у вузлі».';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Заданий пошук у вигляді текстового запиту. Зміна запиту оновлює елементи керування вище.';
$ec_lang['lpn_find_query_label']='Запит';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Поєднуйте умови за допомогою І, АБО та ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='І';
$ec_lang['lpn_find_q_or']='АБО';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Елементи керування не можуть виразити запит нижче, тому їх приховано.';
$ec_lang['lpn_find_q_restore']='Використати елементи керування натомість';
$ec_lang['lpn_replace_q_bad']='Цей запит незрозумілий, тому нічого не можна змінити. Спершу виправте його вище.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(символ {n})';
$ec_lang['lpn_find_q_err_empty']='Запит порожній, тому пошук не виконуватиметься.';
$ec_lang['lpn_find_q_err_scope']='Немає нічого з назвою {w} для пошуку. Спробуйте одне з: {list}';
$ec_lang['lpn_find_q_err_dot']='Поставте крапку між тим, що шукати, і його властивістю, наприклад Junction.ID';
$ec_lang['lpn_find_q_err_prop']='Не властивість {scope}: {w}. Спробуйте одне з: {list}';
$ec_lang['lpn_find_q_err_op']='Не умова для {prop}: {w}. Спробуйте одне з: {list}';
$ec_lang['lpn_find_q_err_value']='Ця умова потребує значення після себе: {op}';
$ec_lang['lpn_find_q_err_quote']='Візьміть текстове значення в лапки: {w} — не число.';
$ec_lang['lpn_find_q_err_quote_end']='Цей текст у лапках не має завершальної лапки.';
$ec_lang['lpn_find_q_err_close']='Ця дужка ( відкрита, але не закрита.';
$ec_lang['lpn_find_q_err_open']='Ця дужка ) нічого не закриває.';
$ec_lang['lpn_find_q_err_end']='Після цього нічого не очікувалося. З\'єднайте два пошуки за допомогою {and} або {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Зміна знайденого';
$ec_lang['lpn_replace_prop']='Властивість для зміни';
$ec_lang['lpn_replace_value']='Нове значення';
$ec_lang['lpn_replace_source']='Джерело нового значення';
$ec_lang['lpn_replace_asked']='Запитано відмітки для вузлів ({n}). Результати з’являться, коли їх буде отримано.';
$ec_lang['lpn_replace_btn']='Замінити';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Змінити елементи ({n})?';
$ec_lang['lpn_replace_apply']='Змінити їх';
$ec_lang['lpn_replace_done']='Змінені елементи: {n}. Це можна скасувати одним кроком.';
$ec_lang['lpn_replace_none']='Нічого не зміниться.';
$ec_lang['lpn_replace_no_value']='Введіть нове значення.';
$ec_lang['lpn_replace_scope']='Оберіть вище один вид елементів, щоб змінити на ньому значення.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Профіль';
$ec_lang['lpn_graphs_menu']='Графіки';
// **THE SYNONYMS ARE IN dev/plain-sentences.md, THE CHANNEL MEANT FOR THEM.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission a plain sentence requires. Same text, correct channel.
$ec_lang['lpn_profile_title']='Профіль уздовж шляху';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Клацніть вузол, з якого починається шлях.';
$ec_lang['lpn_profile_draw_more']='Рухайте вказівником по карті, щоб побачити шлях. Клацніть вузол, щоб додати його. Подвійне клацання завершує вибір. Esc скасовує.';
$ec_lang['lpn_profile_draw_blocked']='Немає шляху від {a} до {b}. Виберіть інший початковий або кінцевий вузол.';
$ec_lang['lpn_profile_tap_start']='Торкніться вузла, з якого починається шлях.';
$ec_lang['lpn_profile_tap_more']='Торкніться вузла, щоб побачити шлях. Натисніть і утримуйте, щоб додати його. Подвійний дотик завершує вибір. Натисніть Профіль ще раз, щоб скасувати.';
$ec_lang['lpn_profile_say_idle']='Натисніть Профіль ще раз, щоб вибрати новий шлях на карті.';
$ec_lang['lpn_profile_none']='Шляху ще немає. Натисніть Профіль ще раз, щоб вибрати його на карті.';
$ec_lang['lpn_profile_choose']='Виберіть початковий і кінцевий вузли.';
$ec_lang['lpn_profile_no_path']='Ці два вузли не з\'єднані жодним маршрутом.';
$ec_lang['lpn_profile_no_solve']='Результатів ще немає, тому показано лише лінію землі.';
$ec_lang['lpn_profile_summary']='Вузлів: {n}, довжина: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Відстань уздовж маршруту ({u})';
$ec_lang['lpn_profile_axis_elev']='Відмітка і напір ({u})';
$ec_lang['lpn_profile_ground']='Поверхня землі';
$ec_lang['lpn_profile_hgl']='П\'єзометрична лінія';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Редагувати';
$ec_lang['lpn_profile_edit_tip']='Змініть один кінець шляху або приберіть із нього один вузол, не малюючи весь шлях заново.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Перетягніть будь-яку точку шляху, щоб перемістити її. Клацніть на доданій вами точці, щоб прибрати її.';
$ec_lang['lpn_profile_edit_tap']='Перетягніть будь-яку точку шляху, щоб перемістити її. Торкніться доданої вами точки, щоб прибрати її.';
$ec_lang['lpn_profile_edit_nowhere']='Точка на шляху має бути вузлом. Шлях не змінено.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Збережені шляхи';
$ec_lang['lpn_profile_new']='Новий збережений шлях…';
$ec_lang['lpn_profile_new_name']='Шлях {n}';
$ec_lang['lpn_profile_rename']='Перейменувати шлях…';
$ec_lang['lpn_profile_delete']='Видалити шлях';
$ec_lang['lpn_profile_open']='Відкрити файл профілю EPANET…';
$ec_lang['lpn_profile_file_done']='Профіль прочитано з файлу: у цій мережі знайдено {used} із {total} вузлів.';
$ec_lang['lpn_profile_file_missing']='Названо у файлі, але відсутні в цій мережі: {ids}.';
$ec_lang['lpn_profile_file_short']='Файл називає менше двох вузлів цієї мережі, тож профілю для побудови немає.';
$ec_lang['lpn_profile_prompt_name']='Назва цього шляху';
$ec_lang['lpn_profile_delete_confirm']='Видалити збережений шлях {name}? Саме креслення не зміниться.';
$ec_lang['lpn_profile_none_saved']='Поки що немає збережених шляхів';
$ec_lang['lpn_profile_missing']='Збережений шлях {name} використовує вузли, яких немає в цьому проєкті: {ids}';
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
$ec_lang['lpn_ts_menu']='Часовий ряд';
$ec_lang['lpn_ts_tip']='Графік одного або кількох елементів у часі протягом розширеного періоду розрахунку.';
$ec_lang['lpn_ts_title']='Значення в часі';
$ec_lang['lpn_ts_group_nodes']='Вузли';
$ec_lang['lpn_ts_group_links']='Зв’язки';
$ec_lang['lpn_pgraph_none']='Цей елемент не має результатів у поточному розрахунку.';
// The Properties graph's own selector entry for a source share (Tom, 2026-09-30: "In selector, use
// 'Source share from {trace node}'"). Distinct from the shared lpn_result_source_share, which still
// labels the bare quantity everywhere else -- the Tables column, Find's property list, the Labels
// popover and the colour legend -- where naming the trace node in every heading would be clutter.
$ec_lang['lpn_pgraph_source_share_from']='Частка джерела від {node}';
$ec_lang['lpn_result_pump_head']='Напір';
$ec_lang['lpn_result_pump_head_tip']='Напір, який насос додає від всмоктування до нагнітання, показаний як додатне число. Розв’язувач і файли EPANET подають його як від’ємні втрати напору.';
// The Full report puts every node and link in one table, where a node's Head column already sits, so a
// pump's column there says whose head it is. Elsewhere the pump's own row or tab says so, and lpn_result_pump_head is enough.
$ec_lang['lpn_report_pump_head']='Напір насоса';
$ec_lang['lpn_ts_add']='Додати вибрані';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Нічого не знайдено для додавання.';
$ec_lang['lpn_ts_clear']='Видалити все';
$ec_lang['lpn_ts_chip_tip']='Прибрати {id} з графіка';
$ec_lang['lpn_ts_none']='Поки нічого показувати на графіку. Виберіть елементи на карті й натисніть «Додати вибрані».';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Ще немає результатів розширеного періоду. Натисніть «Розрахувати», щоб виконати розрахунок.';
$ec_lang['lpn_ts_summary']='Елементів: {n}, моментів звітування: {steps}';
$ec_lang['lpn_ts_axis_time']='Час, що минув';
// EPANET's Frequency Plot (Task 600): one value over every junction or every pipe, at the time the
// map shows, against the percent of them less than it. "Percent less than" is EPANET's own axis
// title. {n} and {total} are counts, {time} an elapsed time; all substituted, never concatenated.
// The Junctions/Pipes choice reuses lpn_pane_tab_junctions and lpn_pane_tab_pipes.
$ec_lang['lpn_freq_menu']='Частота';
$ec_lang['lpn_freq_tip']='Частотний розподіл властивості';
$ec_lang['lpn_freq_title']='Розподіл значень';
$ec_lang['lpn_freq_none']='Поки немає результатів для цього значення, тому нічого показувати на графіку.';
$ec_lang['lpn_freq_summary']='Показано: {n} із {total}';
$ec_lang['lpn_freq_summary_time']='Показано: {n} із {total}, на {time}';
$ec_lang['lpn_freq_axis_percent']='Відсоток менших';
// EPANET's Contour Plot (Task 600), drawn as a layer under the map rather than in a window of its
// own, from the pipes outward. {n} and {p} are counts, {k} and {i} numbers, {u} a unit symbol, {m} a
// distance in metres; all substituted. lpn_contour_buffer_unit follows the Buffer number box.
// lpn_contour_consent_1..4 are the terrain question's four paragraphs, reworded for what the contour
// plot sends: tile numbers for the network's area, not each node's latitude and longitude.
$ec_lang['lpn_contour_menu']='Ізолінії';
$ec_lang['lpn_contour_tip']='Показує на карті ізолінії: кольори вузлів розтікаються вздовж труб і поруч із ними, з підписаними лініями рівня. Відкриває вікно, де це можна налаштувати або вимкнути.';
$ec_lang['lpn_contour_plot']='Карта ізоліній';
$ec_lang['lpn_contour_show']='Показати ізолінії';
$ec_lang['lpn_contour_show_tip']='Зніміть позначку, щоб приховати заливку та ізолінії; поставте її, щоб повернути їх як було. Кольори вузлів залишаються.';
$ec_lang['lpn_contour_fill']='Заливка';
$ec_lang['lpn_contour_fill_tip']='«Плавна» поступово переходить від кольору одного класу до наступного. «Смуги» заливають кожен клас кольорової шкали одним кольором.';
$ec_lang['lpn_contour_fill_smooth']='Плавна';
$ec_lang['lpn_contour_fill_bands']='Смуги';
$ec_lang['lpn_contour_opacity']='Непрозорість заливки';
$ec_lang['lpn_contour_lines']='Лінії рівня';
$ec_lang['lpn_contour_interval']='Інтервал';
$ec_lang['lpn_contour_buffer']='Буфер';
$ec_lang['lpn_contour_buffer_unit']='× медіанна довжина труби';
$ec_lang['lpn_contour_buffer_tip']='Охоплення кольору від кожної труби як кратне медіанної довжини труби. На зовнішній частині він згасає.';
$ec_lang['lpn_contour_few']='Замало вузлів для ізоліній.';
$ec_lang['lpn_contour_support']='Карта ізоліній: {n} вузлів, інтерполяція вздовж {p} труб і до {k} медіанних довжин труби поруч із ними. Без кольору через насоси, клапани й закриті зʼєднання.';
$ec_lang['lpn_contour_support_lines']='Лінії рівня через кожні {i} {u}.';
$ec_lang['lpn_contour_too_many']='Забагато ліній рівня при цьому інтервалі; збільште його, щоб їх намалювати.';
$ec_lang['lpn_contour_dem']='Поверхня землі між вузлами з Mapbox DEM';
$ec_lang['lpn_contour_dem_tip']='Між вузлами тиск стає інтерпольованим напором мінус висота землі за Mapbox DEM, тому він може бути нижчим за найнижчий тиск у вузлах на пагорбі, де в мережі немає вузла. Сприймайте поверхню землі як карту ізоліній, а не як геодезичну зйомку.';
$ec_lang['lpn_contour_support_dem']='Між вузлами тиск дорівнює інтерпольованому напору мінус відмітка землі з Mapbox DEM, знята приблизно через кожні {m} м.';
$ec_lang['lpn_contour_dem_failed']='Не вдалося зчитати поверхню землі з Mapbox DEM, тож тиск інтерполюється лише між вузлами.';
$ec_lang['lpn_contour_consent_1']='Щоб намалювати тиск над поверхнею землі, до api.mapbox.com надсилається територія, яку охоплює ваша мережа, у вигляді номерів тайлів карти Mapbox, щоб зчитати там висоту землі.';
$ec_lang['lpn_contour_consent_2']='Це інше питання, ніж картинки карти за вашим проєктом. Картинки лише показують, куди ви дивитеся. Ці тайли показують, де ваша мережа. Mapbox отримає ці номери тайлів і вашу IP-адресу. Більше ми не надсилаємо нічого: ні назви, ні труб, ні проєкту. Ми нічого не записуємо, і на цьому пристрої не зберігається нічого, крім вашої відповіді на це питання.';
$ec_lang['lpn_contour_consent_3']='Чи можемо ми надіслати до Mapbox номери тайлів території вашої мережі?';
$ec_lang['lpn_contour_consent_4']='Якщо ви відмовитеся, усе інше на цій сторінці працюватиме так само, як зараз, а карта ізоліній малюватиметься лише між вузлами. Згоду ми запам’ятовуємо, щоб не питати знову. Відмова не зберігається взагалі.';
// EPANET's System Flow plot (Task 600). "System flow" is its Graph Selection name, "System flow
// balance" its window title, "Produced" and "Consumed" its series. The definition is its own code
// (Fgraph.pas GetSysFlow): junction and reservoir demands only, split by sign; tanks in neither.
// The axis reuses lpn_result_flow and lpn_ts_axis_time.
$ec_lang['lpn_sysflow_menu']='Баланс витрат';
$ec_lang['lpn_sysflow_tip']='Показує на графіку загальну вироблену й загальну спожиту витрату в часі протягом розрахунку розширеного періоду. Ємності не входять до жодної суми, тож де дві лінії розходяться, ємності наповнюються або спорожняються.';
$ec_lang['lpn_sysflow_title']='Баланс витрат';
$ec_lang['lpn_sysflow_produced']='Вироблено';
$ec_lang['lpn_sysflow_produced_tip']='Загальна витрата, що надходить у мережу з резервуарів і від’ємних споживань.';
$ec_lang['lpn_sysflow_consumed']='Спожито';
$ec_lang['lpn_sysflow_consumed_tip']='Сума всіх додатних споживань: вода, яку забирають із мережі у вузлах, і будь-яка витрата в резервуар.';
$ec_lang['lpn_view_units']='Одиниці';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Зберегти все';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Проєкт{n}';
$ec_lang['lpn_project_copy_suffix']='(копія)';
$ec_lang['lpn_project_rename']='Перейменувати';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Новий проєкт…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Новий проєкт';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Система координат';
$ec_lang['lpn_new_coordsys_tip']='Виберіть систему координат вашої мережі. Змінити цей вибір можна лише через «Файл, Перетворити як…» у новий проєкт, і таке перетворення наближене.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Локальна, схематична або власна';
$ec_lang['lpn_new_coordsys_local_tip']='Не геоприв’язано. Приєднайте власне фонове зображення або жодного.';
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
$ec_lang['lpn_crs_view']='Фільтрувати за виглядом карти';
$ec_lang['lpn_crs_view_tip']='Пропонує лише проєкції, що охоплюють місце, куди наразі дивиться карта. Вимкніть, щоб переглянути весь список.';
$ec_lang['lpn_crs_place']='Пошук за назвою місця';
$ec_lang['lpn_crs_place_tip']='Запити надсилаються до служби назв місць OpenStreetMap, і під час першого запиту потрібен дозвіл. Новий географічний проєкт також починається з місця, знайденого тут.';
$ec_lang['lpn_crs_search']='Пошук';
$ec_lang['lpn_crs_name']='Фільтр за назвою проєкції';
$ec_lang['lpn_crs_name_tip']='Текст, що фільтрує список: показано лише системи координат, назва або код EPSG яких його містить.';
$ec_lang['lpn_crs_list_tip']='Системи координат, що відповідають фільтрам вище. Виберіть одну, потім натисніть «Гаразд».';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Місце ще не шукали, тож пропонується весь список. Знайдіть місце вище або наблизьте карту, щоб звузити список.';
$ec_lang['lpn_crs_count']='Показано {n} із {total} проєкцій.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} з {total} систем координат охоплюють цю мережу.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(без карти)';
// Shown beside WGS 84 (EPSG:4326) in the chooser only (Task 775), never on the status strip.
$ec_lang['lpn_crs_suggested_mark']='(пропонована)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} — одна з небагатьох перелічених систем координат без придатної інформації про проєкцію. Це означає, що карта світу, пошук за назвою місця та відмітки з цифрової моделі рельєфу не працюють. Це не впливає на ваші координати.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='без назви';
$ec_lang['lpn_crs_none']='Без геоприв’язки';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Одиниці та інші налаштування зберігаються з кожним проєктом, тож цей вибір стосується лише цього проєкту й не зберігається як налаштування браузера. Щоб повторно використовувати вподобання, збережіть порожній проєкт як шаблон і починайте кожен новий проєкт із нього.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Петалума, Каліфорнія';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Створити';
$ec_lang['lpn_file_open']='Відкрити…';
$ec_lang['lpn_file_save']='Зберегти';
$ec_lang['lpn_file_saveas']='Зберегти як…';
$ec_lang['lpn_file_revert']='Відновити';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Останні файли';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='Дозвіл на відкриття цього файлу не було надано, тому його не відкрито.';
$ec_lang['lpn_recent_gone']='Не вдалося відкрити {file}. Можливо, його перемістили, перейменували або видалили, тому його прибрано зі списку останніх.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Новий проєкт';
$ec_lang['lpn_tab_all']='Усі проєкти';
$ec_lang['lpn_tab_menu']='Меню проєкту';
$ec_lang['lpn_tab_duplicate']='Дублювати';
$ec_lang['lpn_tab_move_left']='Перемістити ліворуч';
$ec_lang['lpn_tab_move_right']='Перемістити праворуч';
$ec_lang['lpn_tab_unsaved']='Не збережено у файл';
$ec_lang['lpn_import_bad_file']='Не вдалося прочитати цей файл як проєкт, збережений із цієї сторінки.';
$ec_lang['lpn_import_no_room']='У сховищі браузера недостатньо місця, щоб додати цей проєкт. Видаліть непотрібний проєкт і спробуйте ще раз.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='Гаразд';
// **TASK 718** (Tom, 2026-09-25: *"We have three import items. It's probably time for an Import
// sub-menu."*). The three rows -- surveyed points, an EPANET file, and libraries -- now open as a
// fly-out off one row, the same submenu idiom Help > Toolbar already uses. Each row keeps its
// own existing key and tip; only this one row is new.
$ec_lang['lpn_file_import_menu']='Імпорт…';
$ec_lang['lpn_file_import_inp']='Імпортувати файл EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Зчитує мережу з файлу EPANET — текстового файлу .inp або файлу .net, який зберігає EPANET, — і зберігає її в цьому браузері як новий проєкт.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
// File > Export is a submenu (Tom, 2026-10-06), so its rows drop the verb the heading carries. The
// two keys above are what the rows were called before it.
$ec_lang['lpn_file_export_menu']='Експорт…';
$ec_lang['lpn_file_export_item_inp']='Файл EPANET…';
$ec_lang['lpn_file_export_item_geojson']='Файл GeoJSON…';
$ec_lang['lpn_file_export_item_ods']='Файл ODS…';
$ec_lang['lpn_file_export_item_xlsx']='Файл XLSX…';
$ec_lang['lpn_file_export_item_csv']='Файл CSV…';
$ec_lang['lpn_file_export_tables_tip']='Завантажити таблиці в тому вигляді, в якому їх показує панель «Таблиці», в одній книзі з аркушем для кожної таблиці (і для кожного вибраного сценарію), а також з аркушем для кожної бібліотеки, на яку посилаються їхні ID: графіки, криві, типи труб і фітинги. Результати містяться лише для сценарію, розрахованого останнім.';
$ec_lang['lpn_file_export_csv_tip']='Завантажити таблицю в тому вигляді, в якому її показує панель «Таблиці». Одна таблиця надходить єдиним файлом CSV без бібліотек. Кілька таблиць або сценаріїв надходять одним архівом zip із файлів CSV, з файлом для кожної бібліотеки, на яку посилаються їхні ID. Результати містяться лише для сценарію, розрахованого останнім.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Завантажити цю мережу як файл EPANET .inp (у файлі zip разом із зображенням, якщо воно є). Усе, що формат .inp не може зберегти, буде перелічено після цього.';
$ec_lang['lpn_status_inp_exported']='Експортовано {file}.';
$ec_lang['lpn_status_inp_exported_picture']='Експортовано {zip}, що містить файл EPANET {file}, його фонове зображення {picture} і світовий файл {world}. Розпакуйте всі три в одну теку, потім відкрийте там .inp в EPANET; зображення підтягнеться разом із ним.';
$ec_lang['lpn_status_inp_exported_no_picture']='Експортовано {file}. Фонове зображення не вдалося зберегти, тож .inp не називає жодного; в EPANET додайте його через View > Backdrop > Load.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_flat_customers_inactive']='{n} із цих абонентів приєднано до вузла, який у цьому сценарії неактивний, тож їхнього споживання у файлі немає.';
$ec_lang['lpn_inp_export_flat_inactive_controls']='Ці керування й правила посилаються на елемент, який у цьому сценарії неактивний, тому їх у файлі немає: {ids}';
$ec_lang['lpn_inp_export_differences']='{n} речей, які формат .inp не може зберегти.';
$ec_lang['lpn_inp_export_difference_one']='Одна річ, яку формат .inp не може зберегти.';
$ec_lang['lpn_inp_export_refused']='Цей проєкт неможливо записати як файл EPANET: {detail}';
// Task 772: File > Export DXF file. The model's data for AutoCAD and other CAD programs.
$ec_lang['lpn_file_export_item_dxf']='Файл DXF…';
$ec_lang['lpn_file_export_dxf_tip']='Завантажити цю мережу для AutoCAD та інших САПР: вузли як блоки-символи, труби, насоси й клапани як полілінії, а кожен елемент як блок, атрибути якого містять його ID і значення властивостей в одиницях проєкту.';
$ec_lang['lpn_dxf_export_no_utm']='Файл DXF не записано: ця мережа лежить поза широтами, які охоплює UTM (від 80° пд. ш. до 84° пн. ш.), а для креслення потрібна пласка сітка.';
$ec_lang['lpn_dxf_export_refused']='Файл DXF не записано: не завантажилося потрібне перетворення координат. Перевірте з’єднання й повторіть спробу.';
$ec_lang['lpn_dxf_export_failed']='Файл DXF не записано: його зупинила помилка на цій сторінці ({error}).';
// The read-me written into the file as a block of attributes, on a layer that does not plot; the
// file writes it in capital letters. Each says what
// the coordinates are and claims no coordinate system the file does not have. {unit} is a length
// unit as written in English (ft, m), not translated; {crs} is a coordinate system name with its EPSG code.
$ec_lang['lpn_dxf_note_grid']='Координати: X і Y цього проєкту, у {unit}. Систему координат не вказано.';
$ec_lang['lpn_dxf_note_crs']='Координати: {crs}, у точності так, як їх задає цей проєкт.';
$ec_lang['lpn_dxf_note_geo']='Координати: {crs}, у метрах, а не широта й довгота. Широти й довготи проєкту перетворено на цю сітку.';
$ec_lang['lpn_dxf_exported_geo']='Експортовано {file}. Його координати — {crs}, у метрах, а не широта й довгота.';
// {prefix} is the layer-name prefix, C-WATR-MODL-; {example} is a whole layer name such as
// C-WATR-MODL-NODE-BASE.
$ec_lang['lpn_dxf_note_blocks']='Шари названо за схемою: {prefix}, код елемента, дефіс і альтернатива, як у {example}. Кожен елемент — це блок, вставлений у масштабі 1, з атрибутами висотою 1 одиниця; щоб задати висоту тексту, змініть масштаб блоків. Кожен атрибут видимий; атрибути одного елемента складено в стовпець поруч з його символом.';
// {n} is a whole number; {max} is 2049. Each shortened value ends in three periods (...).
$ec_lang['lpn_dxf_note_shortened']='Значення, довші, ніж допускає файл DXF ({max} символів): {n}. Кожне скорочено й закінчується трьома крапками.';
// {n} is a whole number; {tag} is an attribute tag in capitals, BASE_DEMAND in English.
$ec_lang['lpn_dxf_note_categories']='Вузли з кількома категоріями споживання: {n}. Їхній атрибут {tag} містить суму базових споживань усіх категорій.';
// GeoJSON export (Task 728). The command is worded like Export EPANET file. Positions in a GeoJSON
// file are always longitude and latitude (RFC 7946), so a project with no place on the Earth is
// refused and told how to get one, never written with an invented coordinate system.
$ec_lang['lpn_file_export_geojson_tip']='Завантажити цю мережу як файл GeoJSON для QGIS, ArcGIS Pro та інших ГІС-програм. Вузли, ємності й резервуари — це точки, а труби, насоси й клапани — лінії, що йдуть за своїми вершинами. Положення подано широтою й довготою. Результати додаються лише тоді, коли мережу розраховано.';
// Workspace export and import (Tom, 2026-10-07). {file}, {n}, {r}, {u} and {version} are filled in by the page.
$ec_lang['lpn_file_export_item_workspace']='Робочий простір…';
$ec_lang['lpn_file_export_workspace_tip']='Завантажити невеликий файл, що містить розташування ваших вікон, їхні розміри, які з них відкриті чи закріплені, розміри ваших панелей і стовпців, а також параметри відображення цієї сторінки, наприклад які підказки й картка при наведенні показуються. Ваші проєкти, налаштування проєкту й файли cookie (мова, згода, одиниці) до нього не входять. Завантажте його на іншому екрані чи в іншому браузері через «Файл, Імпорт, Робочий простір».';
$ec_lang['lpn_file_import_workspace']='Робочий простір…';
$ec_lang['lpn_file_import_workspace_tip']='Застосувати файл робочого простору, збережений через «Файл, Експорт, Робочий простір»: розташування й розміри вікон, закріплення, розміри панелей і параметри відображення цієї сторінки, наприклад які підказки й картка при наведенні показуються. Ваші проєкти й файли cookie не змінюються.';
$ec_lang['lpn_workspace_exported']='Робочий простір збережено в {file}: налаштувань — {n}.';
$ec_lang['lpn_workspace_imported']='Робочий простір застосовано з {file}. Застосовано налаштувань: {n}. Повернуто до типових: {r}.';
$ec_lang['lpn_workspace_ignored']='Записів проігноровано, бо їх не розпізнано: {u}.';
$ec_lang['lpn_workspace_refused_unreadable']='Цей файл не вдалося прочитати як робочий простір, тож нічого не змінено.';
$ec_lang['lpn_workspace_refused_format']='Це не файл робочого простору, збережений цією сторінкою, тож нічого не змінено.';
$ec_lang['lpn_workspace_refused_newer']='Цей файл робочого простору збережено новішою версією цієї сторінки (формат {version}), тож нічого не змінено.';
$ec_lang['lpn_workspace_confirm']='Замінити розташування вікон робочого простору в цьому браузері розташуванням із файлу?';
$ec_lang['lpn_workspace_refused_storage']='Сховище браузера переповнене або недоступне, тож робочий простір не застосовано.';
$ec_lang['lpn_geojson_refused_local']='Файл GeoJSON містить лише широту й довготу, а цей проєкт накреслено в локальній сітці без прив’язки до Землі. Спершу геоприв’яжіть його через Карта, Карта світу, Приєднати, потім експортуйте знову.';
$ec_lang['lpn_geojson_refused_range']='Ці положення не є допустимими широтами й довготами: {detail}';
$ec_lang['lpn_geojson_refused_crs']='Систему координат цього проєкту ({detail}) ця сторінка не знає, тож його положення не можна перетворити на широту й довготу. Скористайтеся «Перетворити як…», щоб скопіювати проєкт у систему, яку сторінка знає, потім експортуйте знову.';
$ec_lang['lpn_geojson_refused_empty']='Експортувати поки нічого. Спершу накресліть або відкрийте мережу.';
$ec_lang['lpn_geojson_results_in']='Результати, показані на екрані, включено.';
$ec_lang['lpn_geojson_results_out']='Результатів не включено, бо мережу не розраховано.';
$ec_lang['lpn_inp_bad_file']='Не вдалося прочитати цей файл як файл мережі EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Це схоже на файл EPANET .net, але ця сторінка не змогла його прочитати. Відкрийте його в EPANET і скористайтеся там командою «Файл → Експорт → Мережа», щоб зберегти його як файл .inp, а потім імпортуйте цей файл.';
$ec_lang['lpn_inp_report_heading']='Імпортовано {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} вузлів, резервуарів і ємностей, {links} труб, насосів і клапанів, в одиницях {units}.';
$ec_lang['lpn_inp_report_clean']='Усе з файлу перенесено. Нічого не пропущено.';
$ec_lang['lpn_inp_report_label_anchor']='Тексти розміщено так само, як їх розміщує EPANET, — від верхнього лівого кута.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='Файли EPANET не містять системи координат, тож цей файл спочатку не буде геоприв’язаним. Щоб розмістити його на карті світу, скористайтеся «Карта, Карта світу…». Щоб перетворити його координати, скористайтеся «Файл, Перетворити як…».';
$ec_lang['lpn_inp_backdrop_attach']='Прикріпити {file}…';
$ec_lang['lpn_inp_backdrop_attach_tip']='Вебсторінка не може відкрити зображення за його назвою. Виберіть його на своєму пристрої, і воно буде розміщене там, де вказує файл.';
$ec_lang['lpn_inp_backdrop_attached']='Прикріплено {file}, розміщено там, де вказує файл.';
$ec_lang['lpn_inp_backdrop_attached_other']='Прикріплено {picked}, розміщено там, де вказує файл. Файл називає {file}, а це інша назва.';
$ec_lang['lpn_inp_report_lead']='Ця сторінка використовує не всі можливості EPANET, але жодні дані файлу не відкидаються. Список нижче показує дані файлу, які збережено, але не використано, і всі зміни, зроблені під час імпорту:';
$ec_lang['lpn_inp_drop_headloss']='Цей файл не використовує формулу Гейзена-Вільямса. Ця сторінка обчислює за Гейзеном-Вільямсом, тому числа шорсткості труб збережено точно як записано, але відповіді тут не збігатимуться з відповідями в EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Ці ємності не мають прямих стінок: файл задає їхню форму кривою. Крива зберігається в «Бібліотеках», ємність і далі посилається на неї, а розрахунок за розширений період наповнює й спорожнює ємність за графіком, який задає ця крива. Для одного моменту часу результат однаковий, бо рівень поверхні води — це те, що задає файл. Діаметр, записаний у файлі, зберігається поряд із кривою, і саме з ним малюється й розраховується ємність без кривої.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Ці дросельні клапани імпортовано як дросельні клапани з втратами, заданими у файлі.';
$ec_lang['lpn_inp_drop_valve_active']='Ці клапани регулюють тиск або витрату, а їхній стан змінюється зі зміною гідравлічних умов. Їх імпортовано без втрати даних, і ця сторінка їх розраховує.';
$ec_lang['lpn_inp_drop_valve']='Ці клапани описано кривою або фіксованим перепадом тиску, а на цій сторінці немає такого елемента. Вони перенесені як відкриті труби, тому мережа лишається з\'єднаною, але більше ніщо там не керує тиском чи витратою.';
$ec_lang['lpn_inp_drop_cv']='В EPANET ці труби пропускають воду лише в одному напрямку (зворотні клапани). Їх імпортовано як звичайні труби, тож тепер вода може текти в них в обох напрямках.';
$ec_lang['lpn_inp_drop_demands']='У цих вузлів було більше однієї витрати споживання. Витрати підсумовано в одну, яку зберігає ця сторінка.';
$ec_lang['lpn_inp_drop_patterns']='Ця сторінка не зчитала графіки витрати споживання, бо частина, яка виконує розрахунок за розширений період, не завантажилася. Кожна витрата дорівнює числу, записаному у файлі.';
$ec_lang['lpn_inp_drop_demand_pattern']='Ці вузли змінюють свою витрату споживання протягом розрахунку. Їхні графіки перенесено повністю, а витрата, яку ви бачите, — це значення для моменту, який показує годинник.';
$ec_lang['lpn_inp_drop_emitters']='У цих вузлів є коефіцієнт розбризкувача або витоку. Його збережено й враховано в розрахунку, але поки що на цій сторінці немає де його побачити чи змінити.';
$ec_lang['lpn_inp_drop_curve_long']='Ця крива насоса мала більше трьох точок. Збережено її найнижчу, середню й найвищу точки, бо ця сторінка вписує криву щонайбільше в три точки.';
$ec_lang['lpn_inp_drop_curve_missing']='Цей насос посилається на криву, якої немає у файлі. Він перенесений без кривої, тому не додає напору.';
$ec_lang['lpn_inp_drop_pump_other']='Цей насос описано потужністю, яку він споживає, а не кривою. Він перенесений без кривої, тому не додає напору.';
$ec_lang['lpn_inp_drop_head_pattern']='Ці резервуари мають напір, що змінюється протягом розрахунку. Їхні графіки імпортовано повністю, а показаний рівень води — це значення для моменту, який показує годинник.';
$ec_lang['lpn_inp_drop_pump_speed']='Ці насоси працюють на швидкості, іншій за ту, на якій виміряно їхню криву, або змінюють швидкість протягом розрахунку. Швидкість і її графік перенесено повністю, а напір, який ви бачите, — це значення для моменту, який показує годинник.';
$ec_lang['lpn_inp_drop_setting']='Ці труби, насоси й клапани мають налаштування, яке ця сторінка не підтримує. Вони перенесені у відкритому стані.';
$ec_lang['lpn_inp_drop_rules']='Цей файл містить керування на основі правил. Ця сторінка зчитує й застосовує їх. Під час розрахунку моделі правила застосовуються, а кожен рівень, тиск і витрата в них переводяться в одиниці, які показує цей проєкт. Відкрийте «Правила» в «Бібліотеках», щоб переглянути або змінити правило. Правила зберігаються точно так, як задано у файлі, і записуються назад, якщо зберегти файл EPANET.';
$ec_lang['lpn_inp_drop_eps']='Цей файл описує розрахунок за розширений період часу. Частина сторінки, яка виконує такий розрахунок, не завантажилася, тому перенесено лише початкові умови.';
$ec_lang['lpn_inp_drop_quality']='Цей файл описує якість води: початкові концентрації та швидкості реакцій у трубах і ємностях. Ця сторінка зчитує й використовує ці значення. Виберіть хімічну речовину в Налаштування, Розрахунок, Якість води, потім запустіть модель, щоб обчислити концентрації в усій мережі протягом розрахунку. Рядки зберігаються і записуються назад, якщо зберегти файл EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='Цей файл задає, де хімічна речовина вводиться в мережу і як перемішується вода в кожній ємності. Кожне джерело показано на вузлі, де його застосовано, а кожна ємність показує свою модель перемішування. Обидва використовуються, коли мережу розраховують за загальний час роботи.';
$ec_lang['lpn_inp_drop_energy']='Цей файл EPANET містить дані для моделювання вартості перекачування. Ця сторінка зчитує їх і використовує. Розрахуйте модель за допомогою розв\'язувача EPANET, а потім відкрийте «Вода, Звіти, Енергія насосів», щоб побачити, скільки часу працював кожен насос, яку потужність він споживав, скільки енергії витратив і скільки це коштувало. Рядки зберігаються і записуються назад, якщо ви збережете файл EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Цей файл присвоює теги деяким своїм вузлам, трубам чи іншим елементам. Кожен тег перенесено повністю, і він міститься у властивостях свого елемента, де ви можете прочитати його чи змінити.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Цей файл містить налаштування формату звіту EPANET. Звіт про розрахунок доступний у Звіти, Розрахунок, але він використовує стандартний формат EPANET, а не формат, який задають ці налаштування. Рядки зберігаються і записуються назад, якщо зберегти файл EPANET.';
$ec_lang['lpn_inp_drop_sections']='Цей файл містить розділ, який ця сторінка взагалі не читає. Тут він ніде не використовується. Він зберігається цілим і буде записаний назад, якщо ви збережете файл EPANET.';
$ec_lang['lpn_inp_drop_comments']='Ці рядки коментарів у графіках або простих керуваннях цього файлу не імпортовано, бо на цій сторінці немає місця, де їх зберігати (наприклад, між рядками одного графіка). Кожен графік і кожне керування імпортовано повністю.';
$ec_lang['lpn_inp_drop_quality_options']='Цей файл задає параметри якості води EPANET: параметр «Якість», що називає вид аналізу якості води, і два налаштування, пов’язані з хімічною речовиною, — відносну дифузійність і допуск якості. Усі три зберігаються й використовуються. Вік води, трасування джерела та хімічна речовина обчислюються тут, а обидва налаштування хімічної речовини використовуються під час розрахунку хімічної речовини. Усі вони записуються назад, якщо зберегти файл EPANET.';
$ec_lang['lpn_inp_drop_file_options']='Цей файл посилається на допоміжний файл: Map, який містить координати, або Hydraulics, який містить уже обчислену гідравліку. Ця сторінка не може відкрити жоден з них, тож ці рядки зберігаються як є і будуть записані назад, якщо ви збережете файл EPANET.';
$ec_lang['lpn_inp_drop_other_options']='Цей файл задає параметри, які ця сторінка не читає. Тут вони ніде не використовуються. Вони зберігаються і будуть записані назад, якщо ви збережете файл EPANET.';
$ec_lang['lpn_inp_drop_net_options']='Цей файл EPANET .net задає налаштування, для яких на цій сторінці немає елементів керування, тож їхні значення перелічено тут, а не перенесено. Усе інше перенесено. Якщо вони вам потрібні, відкрийте файл в EPANET і скористайтеся «File, Export, Network», щоб зберегти його як файл .inp, а потім імпортуйте цей файл.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Це був файл EPANET .net, власний формат проєкту EPANET. Опису цього формату не опубліковано; ця сторінка читає його за форматом, виведеним із прикладів файлів, тому користуйтеся ним лише тоді, коли файла .inp немає. Файл .inp — це задокументований формат, який читають інші програми: в EPANET скористайтеся File, Export, Network, щоб записати такий файл, і за можливості імпортуйте натомість його.';
$ec_lang['lpn_inp_drop_backdrop']='Цей файл називає фонове зображення, але не містить самого зображення. Додайте його самостійно через «Фонове зображення → Додати зображення».';
$ec_lang['lpn_inp_drop_dangling']='Ці труби посилаються на вузол, якого немає у файлі, тому їх пропущено.';
$ec_lang['lpn_inp_drop_units']='Одиниця витрати, вказана в цьому файлі, не відома цій сторінці, тому кожне число прочитано як галони на хвилину. Перевірте кожне число, перш ніж використовувати відповіді.';
$ec_lang['lpn_inp_drop_anchor_missing']='Цей текст був прикріплений до вузла, резервуара чи ємності, яких немає у файлі. Він перенесений як вільний текст на місці, де його розмістив файл, і тепер ні до чого не прикріплений.';
$ec_lang['lpn_import_notes_heading']='Цей проєкт зчитано з файлу EPANET. Дещо з того, що містить цей файл, зберігається, але не використовується на цій сторінці.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='Відкрито {name} з файлу й додано до цього браузера як новий проєкт.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Файл проєкту';
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
$ec_lang['lpn_file_upload_explain']='Цей браузер не може підключитися до файлу, тому відкриття файлу тут є завантаженням: проєкт копіюється в цей браузер, а єдиний спосіб зберегти зміни назад у файл — перезаписати його через «Файл, Зберегти як».';
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
$ec_lang['lpn_file_saveas_tip_download']='Зберігає, використовуючи налаштування завантаження вашого браузера. Цей браузер не може під\'єднатися до файлу, тому «Зберегти» вимкнено, доступно лише «Зберегти як». Якщо увімкнути в браузері налаштування «Запитувати, куди зберігати кожен файл», можна буде вибрати початковий файл і перезаписати його.';
$ec_lang['lpn_status_uploaded']='Файл проєкту завантажено. Під\'єднання до нього неможливе, тож єдиний спосіб зберегти в нього — використати «Файл → Зберегти як».';
$ec_lang['lpn_status_downloaded']='Завантажено {file}. Цей браузер не може під\'єднатися до файлу, тому проєкт лишається позначеним як не збережений у файл.';
$ec_lang['lpn_status_file_opened']='Відкрито {file}.';
$ec_lang['lpn_status_already_open']='Цей файл уже відкрито тут як {name}, тож перемкнено на нього замість відкриття другої копії.';
$ec_lang['lpn_status_already_open_dirty']='Цей файл уже відкрито тут як {name}, зі змінами, яких ви ще не зберегли в нього. Перемкнено на нього замість відкриття другої копії. Скористайтеся «Файл → Відновити», якщо потрібна версія з диска.';
$ec_lang['lpn_status_saved']='Збережено {file}.';
$ec_lang['lpn_status_reverted']='Завантажено {file} знову з диска.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Зберегти ваші зміни в {name} перед закриттям?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} зберігається лише в цьому браузері. Якщо закрити його без збереження у файл, його буде втрачено назавжди.';
$ec_lang['lpn_close_discard']='Закрити без збереження';
$ec_lang['lpn_cancel']='Скасувати';
$ec_lang['lpn_revert_confirm']='Відкинути зроблені зміни і завантажити {file} знову з диска?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Цей проєкт походить із {file}, але з\'єднання з цим файлом втрачено. Виберіть файл знову, щоб під\'єднатися до нього.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Не вдалося записати у файл. Можливо, його перемістили чи перейменували або скасували дозвіл. Ваша робота все ще збережена в цьому браузері.';
$ec_lang['lpn_file_changed_elsewhere']='Інший користувач зберіг зміни в цей файл, відколи ви його відкрили, тож збереження зараз перезапише його роботу. Скористайтеся «Файл, Зберегти як», щоб зберегти свої зміни в окремий файл, або «Файл, Відновити», щоб відкинути свої зміни й завантажити збережену версію.';
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
$ec_lang['lpn_lock_somebody']='Хтось інший';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} має цей файл відкритим.';
$ec_lang['lpn_lock_open_readonly']='Відкрити лише для читання';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Зняти блокування';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Схоже, цей файл зараз використовується.';
$ec_lang['lpn_lock_open_care']='Щоб уникнути втрати даних, ретельно виберіть один із варіантів нижче.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='Його використовують уже {x}.';
$ec_lang['lpn_lock_age_edited']='Востаннє його редагували {x} тому.';
$ec_lang['lpn_lock_age_saved']='Востаннє його збережено {x} тому.';
$ec_lang['lpn_lock_age_never_saved']='У цей файл ще нічого не збережено.';
$ec_lang['lpn_lock_age_unknown']='Немає запису про те, як довго він використовується, або коли його востаннє збережено чи відредаговано.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='«Запитати» повідомляє тому, хто відкрив цей файл, що він потрібен вам, і більше нічого не змінює. «Відкрити лише для читання» дає змогу переглядати файл і змінювати в ньому що завгодно, але без можливості зберегти тут. «Зняти блокування» дає змогу зберегти поверх файлу; незбережена робота іншої людини не втрачається, але вона більше не зможе зберегти її тут, і комусь, можливо, доведеться об’єднати обидва варіанти вручну.';
$ec_lang['lpn_lock_ask']='Запитати';
// Asked at the one moment the name is useful. Nothing is written to this computer for it; the lock
// broker keeps it in that file's lock record for the holder to read (Tom, 2026-09-29, correcting a
// prompt that said "stored only in this browser").
$ec_lang['lpn_lock_ask_prompt']='Кого вказати як того, хто звертається? Наприклад, введіть свої ініціали. Вони зберігаються разом із блокуванням цього файлу на нашому сервері для того, хто його відкрив, і видаляються протягом 30 днів.';
$ec_lang['lpn_lock_ask_sent']='Ми попросили того, хто відкрив цей файл, закрити його. Він побачить це протягом хвилини, якщо його сторінка все ще відкрита. Більше нічого не змінилося, і файл усе ще належить йому, доки він його не закриє.';
$ec_lang['lpn_lock_ask_failed']='Ваше повідомлення не вдалося доставити. Або зараз ніхто не має цього файлу відкритим, або не вдалося з’єднатися із сервером.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Цей файл не відкрито, і тут нічого не змінилося. Хтось інший усе ще тримає його відкритим.';
// Task 747: a file copied outside this page keeps its original's document ID, and so its lock. Asked
// whenever this browser cannot guarantee it already knows the file (Tom, 2026-09-30). {date} is when
// the ID was minted, in the visitor's own regional date-time format.
$ec_lang['lpn_copy_title']='Позначити файл як нову копію?';
$ec_lang['lpn_copy_body']='Цей файл свідчить, що створений {date}, а цей браузер його не впізнає. Це оригінал (зберегти те саме блокування) чи копія (створити нове блокування)?';
$ec_lang['lpn_copy_body_nodate']='Цей браузер не впізнає цей файл. Це оригінал (зберегти те саме блокування) чи копія (створити нове блокування)?';
$ec_lang['lpn_copy_original']='Оригінал; зберегти те саме блокування';
$ec_lang['lpn_copy_copy']='Копія; створити нове блокування';
// What "Original" does when the file's id is already open in a tab here with a different file:
// switch to the tab, without changing the tab's file.
$ec_lang['lpn_copy_kept_link']='Відкрито {name} як оригінал, переміщений на нове місце. Тепер «Зберегти» записує в цей файл.';
// Tom, 2026-10-05: the copy is saved the moment it is chosen, so nobody has to remember to.
$ec_lang['lpn_copy_opened']='Відкрито {file} як копію й збережено її з новим блокуванням.';
// Said only when that save did not happen (permission refused, file gone); the tab stays unsaved.
$ec_lang['lpn_copy_opened_unsaved']='Відкрито {file} як копію з новим блокуванням, яке буде збережено під час наступного збереження файлу.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} хоче редагувати цей файл. Коли будете готові, збережіть свою роботу і скористайтеся «Файл, Закрити проєкт», щоб передати його.';
$ec_lang['lpn_ago_seconds']='{n} секунд';
$ec_lang['lpn_ago_minutes']='{n} хвилин';
$ec_lang['lpn_ago_hours']='{n} годин';
$ec_lang['lpn_ago_days']='{n} днів';
$ec_lang['lpn_ago_unknown']='невідомий час';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Повідомлення';
$ec_lang['lpn_msglog_heading']='Останні повідомлення';
$ec_lang['lpn_msglog_empty']='Повідомлень ще немає.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} тому';
$ec_lang['lpn_msglog_note']='Спочатку найновіші. Ця сторінка зберігає останні {n} повідомлень, доки вона відкрита, і не зберігає їх на вашому комп’ютері.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Лише для читання: цей файл відкрито в {name}. Тут усе можна змінювати, але не можна зберегти. Скористайтеся «Файл, Зберегти як», щоб зберегти в інший файл.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Увага: не вдалося звернутися до сервера, щоб перевірити чи створити блокування цього проєкту, тож інший користувач може редагувати цей самий файл одночасно. Якщо блокування відновиться, з’явиться повідомлення.';
$ec_lang['lpn_lock_storage_error']='Увага: цей сайт не може зберігати записи блокувань, тож інший користувач може редагувати цей самий файл одночасно. Це помилка налаштування сервера, яку не можна виправити з цієї сторінки: вебсервер не може записувати в теку блокувань.';
$ec_lang['lpn_lock_full_error']='Увага: на цьому сайті не лишилося місця для записів блокувань, тож інший користувач може редагувати цей самий файл одночасно. Це помилка налаштування сервера, яку не можна виправити з цієї сторінки.';
$ec_lang['lpn_lock_not_asked']='Блокування для цього проєкту не діє, тож інший користувач може редагувати цей самий файл одночасно. Цей проєкт ще не має ідентифікатора; збереження у файл присвоює його.';
$ec_lang['lpn_lock_restored']='Блокування відновлено, і тепер цей файл можна зберігати.';
$ec_lang['lpn_lock_dismiss']='Приховати це повідомлення';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Проєкт буде збережено у файл на цьому комп’ютері. Він зберігається лише тоді, коли ви його зберігаєте, і ніколи в інший час.';
$ec_lang['lpn_file_training_2']='Щоб дві людини ніколи не редагували один файл одночасно, цей сайт відстежує, у кого він відкритий. Якщо файл уже в когось відкритий, ви все одно можете відкрити його й переглянути або зберегти власну копію.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='Під час першого збереження браузер запитає, чи може цей сайт редагувати файл. Запит надходить від браузера, а не від цього сайту, і дозвіл потрібен, щоб «Зберегти» могло записувати у файл. Зазвичай він запитується лише раз для кожного файлу.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Продовжити';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Вибрати файл знову';
$ec_lang['lpn_file_reconnect']='Під\'єднатися до цього файлу знову';
$ec_lang['lpn_file_reconnect_alert']='Цей проєкт походить із {file}. Браузеру знову потрібен ваш дозвіл, щоб записувати в нього. Під\'єднайтеся нижче.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Це той самий файл, що вже відкритий у когось іншого, тож зберегти поверх нього не можна. Виберіть інший файл або іншу назву.';
$ec_lang['lpn_saveas_overwrites_project']='У цьому файлі вже є інший проєкт, {name}. Збереження тут повністю замінить його. Продовжити?';
$ec_lang['lpn_saveas_overwrites_newer']='Цей файл змінився, відколи ви бачили його востаннє, тож хтось інший майже напевно зберіг у нього зміни. Збереження тут замінить їхню версію вашою. Продовжити?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Назва цього проєкту';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='Закрито {closed}. Тепер показано {opened}.';
$ec_lang['lpn_status_closed_empty']='Закрито {closed}. Розпочато новий порожній проєкт.';
$ec_lang['lpn_storage_full']='Не збережено. Сховище браузера заповнене або недоступне, тож ваші останні зміни буде втрачено при закритті цієї вкладки.';
$ec_lang['lpn_storage_unreadable']='Не збережено. Цей проєкт не вдалося прочитати зі сховища браузера. Його збережена копія залишена без змін і не буде перезаписана, тож нічого на цій вкладці не зберігається. Відкрийте файл або створіть новий проєкт, щоб продовжити роботу.';
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
$ec_lang['lpn_about_credits']='Подяки';
$ec_lang['lpn_help_welcome']='Вітальна сторінка';
$ec_lang['lpn_about_license']='Ліцензовано за GNU General Public License v3.0 або пізнішою версією.';
$ec_lang['lpn_notes_1_term']='Як це розраховується';
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
$ec_lang['lpn_notes_1_def']='За замовчуванням мережу розраховує розв’язувач EPANET. Коли задано загальний час роботи, кожен звітний часовий крок розраховується послідовно: ємності наповнюються й спорожняються, споживання змінюється за графіками, а панель інструментів відтворює розрахунок. Коли вибрано «Використовувати вбудований розв’язувач, коли можливо», розв’язок на один момент часу натомість може розраховувати вбудований розв’язувач, але моделювання за розширений період і мережу з клапаном-гасником тиску або клапаном загального призначення (PBV, GPV) завжди розраховує розв’язувач EPANET.';
$ec_lang['lpn_notes_2_term']='Чого не робить';
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
$ec_lang['lpn_notes_2_def']='Сплеск тиску й гідравлічний удар не моделюються: усі результати стосуються усталеної або повільно змінної течії, а не перехідної хвилі тиску, спричиненої швидким закриттям клапана.';
$ec_lang['lpn_notes_3_term']='Збереження проєктів';
$ec_lang['lpn_notes_3_def']='Кожен проєкт — це вкладка, і кожна вкладка зберігається в цьому браузері під час роботи. Очищення даних браузера видаляє їх усі, тож зберігайте роботу у файл: Файл, Зберегти як. Зірочка на вкладці означає, що вона містить зміни, яких немає у файлі, і перед закриттям такої вкладки з’являється запитання. У файл нічого не записується, поки не вибрано «Зберегти» або «Зберегти як». У деяких браузерах проєкт з’єднується з файлом, у який його збережено, і надалі «Файл, Зберегти» записує саме в цей файл; в інших з’єднання неможливе, тож «Зберегти» вимкнено й доступне лише «Зберегти як». Цей сайт відстежує, у кого відкрито файл проєкту, щоб двоє людей не перезаписували роботу одне одного. Відкриття файлу, який уже відкрито в колеги, пропонує «Запитати», «Відкрити лише для читання» і «Зняти блокування». Якщо сервер недоступний, попередження повідомляє, що інший користувач може одночасно редагувати той самий файл.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Крива насоса';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Насос підпорядковується формулі H = H₀ − aQ^b, де H — напір, який додає насос, а Q — витрата через нього. Точки кривої вводять у Вода, Бібліотеки як криву напору насоса, а насос указує цю криву у Властивостях. Три точки — напір при нульовій витраті, звичайна робоча точка та точка найбільшої витрати — визначають H₀, a і b безпосередньо й найточніше відповідають опублікованій кривій. Дві точки визначають параболу (b = 2) з вершиною при нульовій витраті. Одна точка використовує правило EPANET: напір при нульовій витраті дорівнює 1.33334 введеного напору, а найбільша витрата дорівнює 2 введеної витрати, що знову дає b = 2. Насос без указаної кривої не додає напору. Крива не обривається там, де напір досягає нуля, тож якщо вимагати витрату, більшу за ту, що може дати крива, вийде від’ємний напір. Виправлення — більший насос або менше споживання, а не інша апроксимація кривої. Крива може містити більше ніж три точки. Розв’язувач EPANET отримує всі з них й інтерполює між ними, а рядок «Формула» та вбудований розв’язувач використовують найнижчу, середню й найвищу точки.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='Довідка про стовпці таблиці';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE -- the Hide/Show row beside it names the
// identical menu. **GESTURE FIRST, THEN ACTION, SINCE 2026-10-06** (Ida, User guide): the cells were
// swapped in all 27 files, by script and unchanged, so this table reads in the same order as the
// key-then-action tables beside it (lpn_notes_7_def, lpn_hotkeys_map_def).
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Клацнути заголовок</td><td>Вибрати стовпець</td></tr><tr><td>Ctrl+клацання або Shift+клацання по іншому заголовку</td><td>Додати до вибору стовпців або розширити його</td></tr><tr><td>Перетягнути або скористатися «Керувати стовпцями…» в меню правої кнопки миші чи ⋮</td><td>Перемістити (змінити порядок) вибраних стовпців</td></tr><tr><td>Навести вказівник на верхній кут заголовка або вибрати заголовок чи перейти в нього клавішею Tab</td><td>Меню ⋮ і стрілка сортування.</td></tr><tr><td>Клацнути заголовок правою кнопкою миші або меню ⋮ у верхньому правому куті заголовка</td><td>Сховати, «Показати всі» або керувати видимістю й порядком</td></tr><tr><td>Піктограма стрілки у верхньому правому куті заголовка</td><td>Сортувати за стовпцем</td></tr><tr><td>Клацання правою кнопкою миші, меню ⋮ у верхньому правому куті заголовка або Ctrl+Shift+V</td><td>Вставити як нові рядки в кінець таблиці</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Комбінації клавіш таблиці';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Клавіші зі стрілками</td><td>Навігація.</td></tr><tr><td>Tab, Enter</td><td>Завершити введення й перейти на одну клітинку вправо (Tab) або вниз (Enter).</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Перейти на одну клітинку назад (Shift+Tab) або вгору (Shift+Enter).</td></tr><tr><td>Shift+клавіші зі стрілками</td><td>Розширити виділення.</td></tr><tr><td>Ctrl+C</td><td>Скопіювати виділене.</td></tr><tr><td>Ctrl+D</td><td>Заповнити виділене вниз від верхнього рядка.</td></tr><tr><td>Ctrl+Enter</td><td>Заповнити виділене значенням активної клітинки.</td></tr><tr><td>Ctrl+A</td><td>Вибрати всю таблицю.</td></tr><tr><td>Ctrl+Shift+V</td><td>Вставити як нові рядки в кінець таблиці.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Перейти до наступної або попередньої вкладки, таблиці чи графіка.</td></tr><tr><td>Delete</td><td>Очистити активну клітинку. Щоб очистити виділений діапазон, клацніть правою кнопкою миші й виберіть «Видалити».</td></tr><tr><td>F2</td><td>Відкрити клітинку для редагування.</td></tr><tr><td>Esc</td><td>Скасувати редагування.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Межі кольорових діапазонів лишаються незмінними';
$ec_lang['lpn_notes_color_def']='Межі кольорових діапазонів задаються, коли вибирають метод класифікації даних. На кожному часовому кроці вони не задаються заново, бо тоді кольори означали б щось нове на кожному кроці, а це не допомагає візуалізувати систему. Сценарій показує межі Базового. EPANET працює так само. Щоб отримати нові межі, виберіть метод ще раз або введіть межі вручну.';
$ec_lang['lpn_notes_engine_term']='Яку версію EPANET використовує ця сторінка';
$ec_lang['lpn_notes_engine_def']='Розв’язувач EPANET на цій сторінці — OWA-EPANET 2.3.5, випущений 20 лютого 2025 року. EPANET розробляє Open Water Analytics, спільнота, яка співпрацює з Агентством із захисту довкілля США (EPA), що випустило версію 2.2.0 у грудні 2019 року. У звіті про розрахунок вказано 2.3.05, бо рушій записує останнє число двома цифрами. Він постачається на цю сторінку через epanet-js 0.9.0 авторства Luke Butler за ліцензією MIT і працює в браузері: мережа ніколи не надсилається на сервер для розрахунку.';
// The Notes example (Task 785). Held by dev/lpn-spike/user-guide-notes-harness.js.
$ec_lang['lpn_guide_nt_example_term']='Приклад на Net1: насос за межею своєї кривої';
$ec_lang['lpn_guide_nt_example_def']='Відкрийте приклад Net1 і виберіть Вода, Бібліотеки. Крива 1, Pump Curve для насоса 9, має одну точку, 1500 gpm за 250 ft. Напір при нульовій витраті становить 333.3 ft, а найбільша витрата — 3000 gpm. За 3500 gpm, що лежить за кінцем кривої, крива дає напір −120.4 ft. Розв’язувач EPANET повідомляє той самий напір, втрату 120.4 ft на насосі, і попереджає, що насоси не можуть забезпечити достатню витрату чи напір.';
// The user manual's own entry (Task 785). Held by dev/lpn-spike/user-guide-own-harness.js.
$ec_lang['lpn_guide_own_example_term']='Приклад на Net1';
$ec_lang['lpn_guide_own_example_def']='<p>Відкрийте приклад Net1, натисніть Ctrl+K і введіть critical. У розділі «Меню» показано рядок «Аналіз критичності…» у Вода, Аналіз. У розділі «Вікна» показано записи, що його згадують, серед них «Знайти й замінити», «Витрата на пожежогасіння: аналіз» і «Критичність: аналіз», а також цей запис. Вибір рядка показує, де «Аналіз критичності…» міститься в меню «Аналіз», і не запускає його.</p>';
$ec_lang['lpn_id_invalid']='Введіть ID без пробілів і лапок.';
$ec_lang['lpn_id_taken']='Цей ID уже використовується.';
$ec_lang['lpn_diag_no_fixed_head']='Додайте резервуар або ємність. Перш ніж мережу можна буде розрахувати, потрібен хоча б один відомий рівень води.';
$ec_lang['lpn_diag_dangling_link']='Труба або насос з\'єднані з вузлом, якого вже не існує:';
$ec_lang['lpn_diag_unreachable']='Ці вузли не мають шляху до резервуара чи ємності:';
// Tom, 2026-10-09: a node nothing connects to a source is left out of the run, not refused. The
// ids stand in the status bar until the network changes. Said in EPANET's own terms (junction,
// reservoir, tank) and never as an error, because the run happened.
$ec_lang['lpn_omitted_note']='Пропущено в цьому розрахунку, бо від них немає шляху до резервуара чи ємності: {ids}';
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
$ec_lang['lpn_engine_fetching']='Отримання розв\'язувача EPANET. Його завантажують один раз і зберігають на цьому пристрої, тож надалі він працює офлайн.';
$ec_lang['lpn_engine_ready']='Розв\'язувач EPANET тепер на цьому пристрої й працює офлайн.';
$ec_lang['lpn_engine_fetching_valve']='Отримання розв\'язувача EPANET, щоб цей клапан можна було розрахувати зараз і офлайн надалі.';
$ec_lang['lpn_engine_ready_valve']='Розв’язувач EPANET тепер зберігається на цьому пристрої. Клапани-гасники тиску й клапани загального призначення (PBV, GPV) тепер можна розраховувати офлайн.';
$ec_lang['lpn_engine_unavailable']='Не вдалося завантажити розв’язувач EPANET, який потрібен для розрахунку клапанів-гасників тиску й клапанів загального призначення (PBV, GPV). Після одного підключення до інтернету розв’язувач зберігається на цьому пристрої.';
// The cause-specific sibling: {reason} is lpn_time_engine_fetch_failed (only a download can reach this notice).
// Offline keeps the sentence above. {wrong} in lpn_time_engine_run_failed is filled with lpn_wrong_btn.
$ec_lang['lpn_engine_unavailable_why']='Клапани-гасники тиску й клапани загального призначення (PBV, GPV) не можна розрахувати без розв’язувача EPANET. {reason}';
$ec_lang['lpn_engine_needed_loading']='Завантаження розв\'язувача EPANET, поки ви будуєте мережу. Результати стануть доступні після повного завантаження.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Перебіг завантаження розв’язувача';
$ec_lang['lpn_engine_wait']='Завантаження розв’язувача. Результати ненадовго затримаються. Продовжуйте роботу.';
$ec_lang['lpn_engine_wait_pct']='Розв’язувач завантажено на {percent}%.';
$ec_lang['lpn_engine_wait_bytes']='Наразі завантажено {kb} КБ розв’язувача. Загальний розмір недоступний, тож відсоток завершення невідомий.';
$ec_lang['lpn_engine_needed_failed']='Розв\'язувач EPANET ще не завантажено, його не вдається завантажити, а цю мережу може розв\'язати лише він. Він завантажиться, коли ви підключитеся до інтернету.';
$ec_lang['lpn_engine_needed_failed_why']='Цю мережу можна розрахувати лише розв’язувачем EPANET. {reason}';
$ec_lang['lpn_diag_valve_needs_epanet']='Це клапани-гасники тиску або клапани загального призначення, і обчислити їх може лише розв’язувач EPANET. Розв’язувач EPANET не вдалося завантажити, тому цих результатів немає:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Ці клапани з’єднано безпосередньо з резервуаром або ємністю, які фіксують напір у цьому вузлі, тож клапану нічого регулювати. Вставте коротку трубу між клапаном і резервуаром або ємністю:';
$ec_lang['lpn_diag_not_converged']='Розв\'язок не знайдено. Перевірте значення, неможливі в реальному житті, наприклад нульовий діаметр.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Розв\'язок не збігся. Ці числа — остання ітерація, а не відповідь. Не використовуйте їх.';
$ec_lang['lpn_diag_not_converged_trials']='Зупинено після {iterations} ітерацій.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Зупинено після {iterations} ітерацій із відносною похибкою {error}, що не досягла налаштування «Точність», яке дорівнює {accuracy}.';
$ec_lang['lpn_field_roughness']='Шорсткість';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Коефіцієнт Гейзена-Вільямса C. Більше число означає гладшу трубу: приблизно 150 для нового пластику, 130 для нової сталі чи заліза та 100 для старої труби.';
$ec_lang['lpn_field_length']='Довжина';
// Task 643 (Tom, 2026-10-14): an Auto length is the slope distance. No claim about accuracy (Task 641).
$ec_lang['lpn_field_length_slope_tip']='Довжина труби. Якщо встановлено прапорець «Авто», довжину вимірюють уздовж ухилу: накреслена довжина разом із різницею відміток між двома кінцевими вузлами.';
$ec_lang['lpn_field_from']='Від';
$ec_lang['lpn_field_to']='До';
// Tom, 2026-10-09: From and To are editable text. Said in the box a refused ID is said in.
$ec_lang['lpn_link_end_unknown']='Жоден вузол не має ID {id}.';
$ec_lang['lpn_link_end_same']='«Від» і «До» мають бути різними вузлами.';
// Tom, 2026-10-09: "Break link for node?", adapted to name the pipe. The two answers are Yes and No
// because No is not a cancel: it places the node where it was pressed, joined to nothing.
$ec_lang['lpn_split_pipe_ask']='Розділити трубу {id} у цьому вузлі?';
$ec_lang['lpn_split_yes']='Так';
$ec_lang['lpn_split_no']='Ні';
// Object snap (Task 782). The tip beside the snap glyph on a pipe vertex: "Pipe 10, vertex 2". A node
// or a pipe is named by its type word and ID alone.
$ec_lang['lpn_snap_vertex']='{link}, вершина {n}';
// A tank, reservoir or junction snapped onto a node of another type is placed at exactly that
// position. Two nodes at one point are legal in EPANET, and the map cannot show that they are separate.
$ec_lang['lpn_snap_node_on_node']='{new} розміщено в місці {target}. Ці два вузли не з’єднані.';
// The same, for a node DRAGGED onto another node.
$ec_lang['lpn_snap_moved_on_node']='{moved} переміщено в місце {target}. Ці два вузли не з’єднані.';
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
$ec_lang['lpn_field_valve_type']='Тип клапана';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Тип клапана. Дросельний клапан (TCV) створює фіксовані втрати. PRV, PSV і FCV підтримують тиск або витрату й повністю відкриваються, закриваються або частково прикриваються зі зміною гідравлічних умов. PBV знімає фіксований тиск, а GPV відповідає кривій втрат напору. Типи керують різними гідравлічними властивостями, тому під час зміни типу уставки можуть бути втрачені.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Дросельний (TCV)';
$ec_lang['lpn_valve_type_prv']='Зниження тиску (PRV)';
$ec_lang['lpn_valve_type_psv']='Підтримання тиску (PSV)';
$ec_lang['lpn_valve_type_fcv']='Регулювання витрати (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Гасіння тиску (PBV)';
$ec_lang['lpn_valve_type_gpv']='Загального призначення (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Падіння тиску';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='Тиск, який знімає клапан. Клапан гасіння тиску завжди знімає рівно стільки тиску, незалежно від напрямку руху води. Це падіння тиску на клапані, а не тиск, який потрібно підтримувати.';
$ec_lang['lpn_inp_drop_gpv_curve']='Цей клапан посилається на криву втрат напору, якої немає у файлі. Клапан перенесено без кривої, тож він лишається повністю відкритим, доки криву не вибрано.';
$ec_lang['lpn_gpv_curve_source']='Крива втрат напору клапана';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Крива в «Бібліотеках», яка задає втрати напору через цей клапан за кожної витрати. Кілька клапанів можуть використовувати ту саму криву, і її редагування там змінює їх усі.';
$ec_lang['lpn_field_valve_setting_pressure']='Уставка тиску';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Клапан зниження тиску підтримує тиск з нижнього за течією боку на рівні цього значення або нижче. Клапан підтримання тиску підтримує тиск з верхнього за течією боку на рівні цього значення або вище.';
$ec_lang['lpn_field_valve_setting_flow']='Уставка витрати';
$ec_lang['lpn_field_valve_setting_flow_tip']='Найбільша витрата, яку пропускає клапан. Коли крізь нього намагається пройти менше води, ніж це значення, клапан стоїть повністю відкритим і не додає втрат.';
$ec_lang['lpn_field_valve_setting']='Уставка';
$ec_lang['lpn_field_valve_setting_loss']='Коефіцієнт втрат';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Скільки напору знімає дросельний клапан, виражене як кратна величина швидкісного напору. Використовуйте 0 для клапана, що стоїть повністю відкритим. Це єдине число визначає всі втрати дросельного клапана.';
$ec_lang['lpn_field_valve_diameter_tip']='Діаметр отвору клапана. Швидкість крізь клапан обчислюється за цим діаметром, а втрати — за цією швидкістю.';
$ec_lang['lpn_field_valve_km_tip']='Втрати від корпусу клапана, коли клапан стоїть повністю відкритим, на додачу до всього, що знімає уставка клапана. Виражені як кратна величина швидкісного напору. Використовуйте 0, щоб не враховувати їх.';
$ec_lang['lpn_field_km']='Коефіцієнт місцевих втрат, k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Місцеві втрати, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Крива напору насоса';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Крива в «Бібліотеках», яка задає напір, що його цей насос додає за кожної витрати. Кілька насосів можуть використовувати ту саму криву, і її редагування там змінює їх усі. Цей насос зберігає лише посилання; самі точки читаються й редагуються в «Бібліотеки, Криві».';
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
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Тег';
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
$ec_lang['lpn_field_tag_tip']='Тег може означати будь-що, що вам потрібно, наприклад зону тиску чи номер наряду на роботу. Жоден розрахунок ні тут, ні в EPANET його не читає. Тег — це одне слово: EPANET припиняє читання на першому пробілі, тож пробіл не приймається під час введення. Він переноситься у файл EPANET і назад.';
$ec_lang['lpn_pump_effic_curve']='Крива ефективності насоса';
$ec_lang['lpn_pump_effic_curve_tip']='Крива в «Бібліотеках», яка показує, наскільки ефективний цей насос при кожній витраті. Кілька насосів можуть використовувати ту саму криву, і редагування її там змінює їх усі. Цей насос містить лише посилання; самі точки читаються й редагуються в «Бібліотеки, Криві».';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Криву не вибрано';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Криві';
$ec_lang['lpn_curve_library_link_tip']='Відкриває «Бібліотеки» на розділі «Криві», де криву можна додати, описати, відредагувати чи видалити. Елемент вказує, яку криву він використовує.';
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
$ec_lang['lpn_curve_kind_head']='Напір насоса';
$ec_lang['lpn_curve_kind_effic']='Ефективність насоса';
$ec_lang['lpn_curve_kind_volume']='Об\'єм ємності';
$ec_lang['lpn_curve_kind_headloss']='Втрати напору клапана';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Вид не вказано';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Об\'єм';
$ec_lang['lpn_pump_effic_col']='Ефективність';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Цей насос не має вибраної кривої ефективності, тож він працює з ефективністю, заданою для всієї мережі, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Цей насос посилається на криву ефективності з назвою {name}, яку ніщо в цьому проєкті не визначає, тож він працює з ефективністю, заданою для всієї мережі, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Режим: Вибір. Виберіть елемент, підпис або Текст, щоб переглянути чи змінити його. Перетягніть, щоб пересунути вузол, підпис або Текст. Скористайтеся інструментом «Вершини», щоб додавати чи прибирати згини труби.';
$ec_lang['lpn_mode_delete']='Режим: Видалення. Клацніть на елементі, щоб видалити його.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Режим: Вершини. Вершини кожної труби показано як маленькі квадратні маркери. Клацніть на трубі, щоб додати вершину, клацніть на маркері, щоб прибрати його, або перетягніть маркер, щоб перемістити його. Більше нічого на карті в цьому режимі не змінюється.';
$ec_lang['lpn_mode_zoom_window']='Режим: наблизити вікном. Клацніть два протилежні кути прямокутника або перетягніть один із них на карті, щоб наблизити цю ділянку.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Нічого не вибрано. Спочатку клацніть елемент на карті, потім натисніть Delete.';
$ec_lang['lpn_mode_add_junction']='Режим: Додавання вузла. Укажіть місце на карті, щоб розмістити вузол. Перейдіть у режим «Вибір», щоб змінювати чи переміщувати елементи, підписи й Текст.';
$ec_lang['lpn_mode_add_reservoir']='Режим: Додавання резервуара. Укажіть місце на карті, щоб розмістити резервуар. Перейдіть у режим «Вибір», щоб змінювати чи переміщувати елементи, підписи й Текст.';
$ec_lang['lpn_mode_add_tank']='Режим: Додавання ємності. Укажіть місце на карті, щоб розмістити ємність. Перейдіть у режим «Вибір», щоб змінювати чи переміщувати елементи, підписи й Текст.';
$ec_lang['lpn_mode_add_pipe']='Режим: Додавання труби. Виберіть початковий вузол, потім кінцевий, щоб з’єднати їх. Укажіть точки у вільному місці між ними, щоб зігнути лінію, або натисніть Escape, щоб почати заново. Перейдіть у режим «Вибір», щоб змінювати чи переміщувати елементи, підписи й Текст.';
$ec_lang['lpn_mode_add_pump']='Режим: Додавання насоса. Виберіть початковий вузол, потім кінцевий, щоб з’єднати їх. Укажіть точки у вільному місці між ними, щоб зігнути лінію, або натисніть Escape, щоб почати заново. Перейдіть у режим «Вибір», щоб змінювати чи переміщувати елементи, підписи й Текст.';
$ec_lang['lpn_mode_add_valve']='Режим: Додавання клапана. Виберіть початковий вузол, потім кінцевий, щоб з’єднати їх. Укажіть точки у вільному місці між ними, щоб зігнути лінію, або натисніть Escape, щоб почати заново. Перейдіть у режим «Вибір», щоб змінювати чи переміщувати елементи, підписи й Текст.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Режим: Додавання тексту. Укажіть місце на карті, щоб розмістити Текст. Укажіть місце біля вузла, щоб прикріпити Текст до цього вузла. Перейдіть у режим «Вибір», щоб змінювати чи переміщувати елементи, підписи й Текст.';
$ec_lang['lpn_mode_add_chain']='Режим: Ланцюжок вузлів і труб. Укажіть точку на карті, щоб додати вузол, потім указуйте кожну наступну точку, щоб додати трубу й вузол. Укажіть наявний вузол, щоб продовжити від нього. Натисніть Escape, щоб завершити ланцюжок. Перейдіть у режим «Вибір», щоб змінювати чи переміщувати елементи, підписи й Текст.';
$ec_lang['lpn_mode_add_shape']='Режим: Додавання фігури. Укажіть кожну точку. Укажіть останню точку ще раз або натисніть Enter, щоб завершити; укажіть першу точку, щоб замкнути полігон.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Використовуйте цей режим, щоб змінювати, пересувати й перетягувати елементи карти або панорамувати карту. Це типовий режим карти. Повторне натискання Esc знімає виділення з усього, що вибрано.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Авто';
$ec_lang['lpn_method_switch_confirm']='Зміна методу тертя не змінює числа шорсткості, вже введені на ваших трубах, а шорсткість для одного методу не має сенсу для іншого. Перевірте кожну трубу після цього. Усе одно змінити?';
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
$ec_lang['lpn_field_closed']='Закрита';
$ec_lang['lpn_field_closed_tip']='Перекриває цю трубу, щоб крізь неї не могла проходити вода. Труба лишається на карті й зберігає всі свої числа, і ви можете знову відкрити її будь-коли.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Довгота';
$ec_lang['lpn_field_lat']='Широта';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Північна координата';
$ec_lang['lpn_field_easting']='Східна координата';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='Пн';
$ec_lang['lpn_field_easting_abbr']='Сх';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Шир';
$ec_lang['lpn_field_lon_abbr']='Довг';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Введіть координати, щоб розмістити цей вузол точно. У сценарії це розташування застосовується лише в цьому сценарії, так само як і перетягування; в «Базовому» воно розміщує вузол всюди.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Це за межами карти. Широта в проєкції Pseudo Mercator в межах від -85.05 до 85.05, а довгота — від -180 до 180.';
$ec_lang['lpn_field_text_size']='Множник розміру';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Показувати за будь-якого масштабу';
$ec_lang['lpn_field_text_all_zoom_tip']='Залишати цей текст на кресленні, наскільки далеко ви б не віддалили масштаб. Зніміть позначку, і текст сховається разом з іншими підписами, щойно вигляд стане ширшим за поріг підписування, встановлений у «Карта і сторінка».';
$ec_lang['lpn_tool_labels']='Підписи';
$ec_lang['lpn_labels_heading_node']='Підписи вузлів';
$ec_lang['lpn_labels_heading_link']='Підписи з\'єднань';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Застосувати до всіх';
$ec_lang['lpn_settings_apply_to_all_tip']='Кожен уже накреслений елемент цього виду отримає ID, що починається з цього тексту. Кожен зберігає свій номер. ID, що не закінчується числом, лишається без змін.';
$ec_lang['lpn_confirm_apply_prefix']='Перейменувати елементи ({n}), щоб їхні ID починалися з {prefix}? Кожен збереже свій номер.';
$ec_lang['lpn_prefix_applied']='Перейменовані елементи: {n}. Елементи без змін: {skipped}.';
$ec_lang['lpn_labels_suffix_gradient_tip']='Текст, доданий після ухилу втрат напору в підписах на карті. Не вводьте тут знак відсотка — його додають автоматично, коли одиниці виражено у відсотках.';
$ec_lang['lpn_labels_separator']='Текст між значеннями';
$ec_lang['lpn_labels_separator_tip']='Текст між однією властивістю та наступною в підписі. За замовчуванням — пробіл.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Пріоритет';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='Порядок, у якому значення відкидаються, коли підпис не вміщується. Значення під номером 1 відкидається першим. Коли лишається лише одне значення, а два підписи все ще перекриваються, один із них ховається: той, що має менше споживання, тиск ближчий до середини діапазону, або відмітку чи напір, більш подібні до сусідніх вузлів.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='До';
$ec_lang['lpn_labels_col_after']='Після';
$ec_lang['lpn_labels_col_decimals']='Десяткові';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Показати';
$ec_lang['lpn_labels_show_tip']='Порядок, у якому значення з’являються в підписі. Значення під номером 1 іде першим: угорі підпису в кілька рядків і на початку підпису в один рядок.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Використовувати одиниці';
$ec_lang['lpn_labels_use_units_tip']='Виберіть, щоб показувати одиницю в полі «Після» та в підписі й оновлювати її під час зміни одиниць. Зніміть позначку, щоб ввести довільний текст «Після».';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Початковий стан';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Кольори вузлів';
$ec_lang['lpn_settings_sym_link_colors']='Кольори зв’язків';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Фонове зображення…';
$ec_lang['lpn_backdrop_add']='Додати';
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
$ec_lang['lpn_backdrop_scale']='Масштабувати клацанням';
$ec_lang['lpn_backdrop_scale_entry']='За world-файлом або розміром пікселя на карті';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Масштабувати від поточного розміру навколо обраної точки';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Укажіть точку на фоновому зображенні, яка має лишитися на своєму місці.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Масштаб від поточного розміру. 1 залишає без змін, 1.1 збільшує на 10%, 0.9 зменшує на 10%.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Введіть розмір одного пікселя на карті або вставте повний вміст world-файлу для цього зображення';
$ec_lang['lpn_backdrop_scale_entry_bad']='Введіть одне число — розмір одного пікселя на карті, або вставте всі шість рядків world-файлу.';
$ec_lang['lpn_backdrop_wld_bad']='Цей world-файл повертає, віддзеркалює або нерівномірно розтягує зображення. Карта може лише переміщувати зображення й змінювати його розмір однаково в обох напрямках, тому файл не було використано.';
$ec_lang['lpn_backdrop_unreadable']='Ваш браузер не може показати це зображення. Збережіть його у форматі PNG або JPEG і додайте знову.';
$ec_lang['lpn_backdrop_position']='Перемістити';
$ec_lang['lpn_backdrop_remove']='Видалити';
$ec_lang['lpn_backdrop_remove_confirm']='Видалити фонове зображення?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Карта світу…';
$ec_lang['lpn_map_attach_tip']='Приєднати карту світу до цього проєкту, не змінюючи його жодним іншим чином.';
$ec_lang['lpn_map_attach_add']='Приєднати';
$ec_lang['lpn_map_attach_readjust']='Скоригувати знову';
$ec_lang['lpn_map_attach_readjust_tip']='Повернутися до кроку 2 процесу приєднання карти.';
$ec_lang['lpn_map_attach_scale_from']='Масштабувати від поточного розміру…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Масштабуйте карту від її поточного розміру, відносно середини вашого креслення. 1 залишає без змін, 1.1 робить на 10% більшою, 0.9 робить на 10% меншою.';
$ec_lang['lpn_map_attach_scale_from_bad']='Введіть одне число, більше за нуль.';
$ec_lang['lpn_map_attach_scale_from_done']='Розмір карти змінено, а ваше креслення і кожна координата в ньому лишилися точно такими, як були.';
$ec_lang['lpn_map_attach_none']='До цього проєкту ще не приєднано карту світу. Спершу скористайтеся «Карта, Карта світу, Приєднати».';
$ec_lang['lpn_map_attach_remove']='Від’єднати';
$ec_lang['lpn_map_attach_remove_tip']='Від’єднати карту світу. Мережі це не зачіпає.';
$ec_lang['lpn_map_attach_done']='Карту світу тепер показано позаду креслення, а проєкт не змінено. Скористайтеся «Карта, Карта світу, Від’єднати», щоб прибрати її.';
// Edited by TGH 2026-10-07
$ec_lang['lpn_map_attach_removed']='Карту світу від’єднано, мережу не зачеплено.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Ваше креслення на карті всього світу, в океані на нульовій широті й нульовій довготі. Спершу знайдіть своє місце: панорамуйте й масштабуйте карту позаду креслення, знайдіть назву місця або введіть широту й довготу. Саме креслення не рухається.';
$ec_lang['lpn_mapgeo_step1']='Крок 1 з 2: знайдіть розташування проєкту';
$ec_lang['lpn_mapgeo_step2']='Крок 2 з 2: підженіть карту позаду вашого креслення';
$ec_lang['lpn_mapgeo_hint1']='Панорамуйте й масштабуйте карту позаду вашого креслення, або знайдіть місце, або введіть широту й довготу. Потім натисніть «Розмістити приблизно».';
$ec_lang['lpn_mapgeo_readjust_intro']='Ваше креслення там, куди ви востаннє його розмістили. Щоб перемістити його в інше місце, панорамуйте й масштабуйте карту позаду креслення, знайдіть назву місця або введіть широту й довготу. Саме креслення не рухається.';
$ec_lang['lpn_mapgeo_hint2']='Перетягніть будь-де, щоб посунути карту під вашим кресленням. Ваше креслення і кожна координата в ньому лишаються точно там, де є. Натисніть «Геоприв’язати тут», коли карта на місці.';
$ec_lang['lpn_mapgeo_gestures']='Масштабування рухає ваше креслення й карту разом, щоб ви бачили, наскільки добре вони збігаються. Перетягування рухає лише карту.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Повернути карту';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} градусів';
$ec_lang['lpn_mapgeo_dial_size']='Розмір карти';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} разів';
$ec_lang['lpn_mapgeo_dial_help']='Пересувайте два повзунки або вводьте числа в полях над ними, щоб збільшити чи зменшити карту та повернути її. Середина кожного повзунка зберігає припасування з кроку 1, тож розмір 1 і поворот 0 означають відсутність змін. Клавіші зі стрілками працюють на обох.';
$ec_lang['lpn_mapgeo_place']='Розмістити приблизно';
$ec_lang['lpn_mapgeo_finish']='Геоприв’язати тут';
$ec_lang['lpn_mapgeo_cancelled']='Карту світу повернуто в попереднє положення, креслення не переміщено.';
$ec_lang['lpn_mapgeo_locked']='Завершіть кнопкою «Геоприв’язати тут» або натисніть «Скасувати», перш ніж перемикати проєкти чи зберігати. Карта світу ще перебуває в процесі розміщення.';
$ec_lang['lpn_backdrop_scale_prompt1']='Укажіть дві точки на фоновому зображенні, наприклад кінці лінійного масштабу. Потім введіть справжню відстань між ними.';
$ec_lang['lpn_backdrop_scale_prompt2']='Справжня відстань між двома точками';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Укажіть базову точку (на зображенні) для переміщення.';
$ec_lang['lpn_backdrop_position_prompt2']='Виберіть спосіб визначення кінцевої точки, потім натисніть «Продовжити».';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Налаштування фонового зображення.';
$ec_lang['lpn_backdrop_target_label']='Перемістити цю точку до:';
$ec_lang['lpn_backdrop_target_node']='Вузол';
$ec_lang['lpn_backdrop_target_free']='Будь-яка точка на карті';
$ec_lang['lpn_backdrop_target_coords']='Координати, які ви вводите';
$ec_lang['lpn_backdrop_coords_prompt']='Введіть X,Y, у які має переміститися ця точка';
$ec_lang['lpn_backdrop_continue']='Продовжити';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// One key for the toolbar button, the Project menu row and the Settings box's own title (Task 699).
$ec_lang['lpn_tool_settings']='Налаштування';
$ec_lang['lpn_settings_show_titles']='Показувати заголовки сторінки';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Сховати ці заголовки';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Показувати підказку для вибору';
$ec_lang['lpn_settings_area_hint_tip']='Показувати над картою підказку з наступним кроком, поки вибирається область.';
$ec_lang['lpn_settings_hover_card']='Показувати всі властивості при наведенні';
$ec_lang['lpn_settings_hover_card_tip']='Наведіть вказівник на вузол, з’єднання чи абонента, щоб побачити всі його властивості в тому форматі, що визначений у «Налаштування», у будь-якому масштабі, незалежно від того, чи вміщується підпис на карті. Це налаштування цього браузера, а не проєкту.';
// Task 805 (Tom, 2026-10-15, R-396: "It would be good to be able to hide the amber override
// indicators from the map. Maybe a Map, Clean map button is a good idea after all"). The rings'
// own switch, in Settings, Map and page, Page; and the Map menu row that hides them with the
// controls over the drawing. Both are browser settings.
$ec_lang['lpn_settings_override_marks']='Показувати позначки перевизначень на карті';
$ec_lang['lpn_settings_override_marks_tip']='Показувати бурштинове коло навколо елемента з перевизначенням у відкритому сценарії та пунктирне сіре коло навколо елемента, який його успадковує. Панель «Таблиці» позначає перевизначення в будь-якому разі. Карта, Очистити карту ховає кола, поки вибрано цей параметр. Це налаштування цього браузера, а не проєкту.';
$ec_lang['lpn_clean_map']='Очистити карту';
$ec_lang['lpn_clean_map_tip']='Вибрано: кнопки масштабу, кнопку вуличної карти та супутникових знімків, кнопку «Повідомлення» й сповіщення, підказку щодо вибору, кнопку відгуку та кола перевизначень приховано. Знято: їх показано. Помилки й надалі показуються на карті, а кожне сповіщення й надалі зберігається в «Повідомленнях». Це налаштування цього браузера, а не проєкту.';
$ec_lang['lpn_settings_theme']='Тема';
$ec_lang['lpn_settings_theme_tip']='Виберіть світлі чи темні кольори сторінки. «Системна» слідує налаштуванню вашого пристрою. Малюнок на карті однаковий у кожній темі. Це налаштування цього браузера, а не проєкту.';
$ec_lang['lpn_theme_system']='Системна';
$ec_lang['lpn_theme_light']='Світла';
$ec_lang['lpn_theme_dark']='Темна';
$ec_lang['lpn_settings_id_prefixes']='Префікси ID';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Значення при створенні';
$ec_lang['lpn_settings_defaults_note']='Використовується для елементів, які ви створите віднині. Наявні елементи не змінюються.';
$ec_lang['lpn_settings_push_note']='Застосовуються лише властивості, підписи яких показано зараз.';
$ec_lang['lpn_settings_push_btn']='Застосувати ці значення нових елементів до кожного наявного елемента';
$ec_lang['lpn_push_confirm']='Замінити ці властивості в кожного наявного елемента значеннями, зараз заданими для нових елементів? Введені вами значення буде перезаписано. Це можна скасувати.';
$ec_lang['lpn_push_properties']='Властивості:';
$ec_lang['lpn_push_assets']='Вузли та труби:';
$ec_lang['lpn_push_none_displayed']='Наразі жодне початкове значення не показано як підпис, тож застосовувати нічого. Увімкніть підписи потрібних властивостей у панелі «Підписи» і спробуйте знову.';
$ec_lang['lpn_push_nothing']='Жоден наявний елемент не має жодної із застосовуваних властивостей.';
$ec_lang['lpn_push_no_change']='Кожен елемент уже має ці значення, тож нічого не зміниться.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Власні властивості';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Визначені користувачем властивості. Зберігаються з проєктом і сценаріями, як і всі інші властивості.';
$ec_lang['lpn_cp_design']='Проєктування';
$ec_lang['lpn_cp_design_tip']='По одному рядку на власну властивість, і кожен розкривається, показуючи: Ключ, Мітка, Застосовується до, Перевіряти як, Дозволити або обмежити, поле символів, назване цим вибором, Нижня межа довжини, Верхня межа довжини, Нижня межа, Верхня межа.';
$ec_lang['lpn_cp_add']='Додати власну властивість';
$ec_lang['lpn_cp_add_tip']='Додати рядок до таблиці проєктування й відкрити його для редагування.';
$ec_lang['lpn_cp_remove_tip']='Вилучити цю властивість із таблиці проєктування. Значення, уже введені для елементів, зберігаються у файлі й відновлюються, якщо знову визначити властивість з тим самим ключем.';
$ec_lang['lpn_cp_none']='Жодну власну властивість ще не спроєктовано.';
$ec_lang['lpn_cp_unnamed']='Ще не названо';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Ключ';
$ec_lang['lpn_cp_key_tip']='Ключ: властивість зберігається під цим ім’ям. Пробіли не дозволені, і для вас додається префікс, щоб ваш ключ ніколи не збігався з вбудованим полем.';
$ec_lang['lpn_cp_label']='Мітка';
$ec_lang['lpn_cp_label_tip']='Мітка: відображається у вікні властивостей, у Пошуку та на початку стовпця таблиці.';
$ec_lang['lpn_cp_applies']='Застосовується до';
$ec_lang['lpn_cp_applies_tip']='Застосовується до: список префіксів ідентифікаторів через кому для об’єктів, що використовують цю властивість, наприклад J,L,R.';
$ec_lang['lpn_cp_validate']='Перевіряти як';
$ec_lang['lpn_cp_validate_tip']='Перевіряти як: формат, якому має відповідати допустиме значення. Правила регістру стосуються лише англійського алфавіту. Виберіть «Не перевіряти», щоб приймати будь-яке значення.';
$ec_lang['lpn_cp_restrict']='Обмежити ці символи';
$ec_lang['lpn_cp_restrict_tip']='Обмежити ці символи:';
$ec_lang['lpn_cp_allow_tip']='Дозволити лише ці символи:';
$ec_lang['lpn_cp_characters_tip']='«@» означає будь-яку літеру; «#» означає будь-яку цифру, а «-», «.» і «,» слід перелічити окремо, якщо вони дозволені; будь-які пробільні символи мають стояти між іншими символами.';
$ec_lang['lpn_cp_restrict_mode']='Дозволити або обмежити';
$ec_lang['lpn_cp_restrict_mode_tip']='Дозволити або обмежити: задані символи є або єдиними, які може використовувати значення, або тими, яких воно не може використовувати.';
$ec_lang['lpn_cp_restrict_allow']='Дозволити лише ці символи';
$ec_lang['lpn_cp_minlength']='Нижня межа довжини';
$ec_lang['lpn_cp_minlength_tip']='Нижня межа довжини: будь-який коротший запис позначається. Скористайтеся нею, щоб знайти порожні й неповні записи.';
$ec_lang['lpn_cp_length']='Верхня межа довжини';
$ec_lang['lpn_cp_length_tip']='Верхня межа довжини: будь-який довший запис позначається.';
$ec_lang['lpn_cp_low']='Нижня межа';
$ec_lang['lpn_cp_low_tip']='Нижня межа: це найменше значення, яке ви очікуєте. Числа порівнюються як числа, а текст — у словниковому порядку.';
$ec_lang['lpn_cp_high']='Верхня межа';
$ec_lang['lpn_cp_high_tip']='Верхня межа: це найбільше значення, яке ви очікуєте. Числа порівнюються як числа, а текст — у словниковому порядку.';
$ec_lang['lpn_cp_val_none']='Не перевіряти';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Число .';
$ec_lang['lpn_cp_val_number_comma']='Число ,';
$ec_lang['lpn_cp_val_integer']='Ціле число';
$ec_lang['lpn_cp_val_upper']='ВЕЛИКІ ЛІТЕРИ';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Значення збережено точно так, як ви його ввели.';
$ec_lang['lpn_valwarn_diameter']='Діаметр труби або клапана зазвичай становить від {min} до {max} {unit}. Перевірте число й одиницю діаметра.';
$ec_lang['lpn_valwarn_hw']='Коефіцієнт C за Hazen-Williams зазвичай становить від {min} до {max}. Число поза цим діапазоном часто є шорсткістю, призначеною для іншого методу тертя.';
$ec_lang['lpn_valwarn_manning']='Коефіцієнт n за Manning зазвичай становить від {min} до {max}. Число поза цим діапазоном часто є шорсткістю, призначеною для іншого методу тертя.';
$ec_lang['lpn_valwarn_dw']='Шорсткість за Darcy-Weisbach зазвичай більша за 0 і не перевищує {max} {unit}. Більше число часто є C за Hazen-Williams або n за Manning.';
$ec_lang['lpn_valwarn_positive']='EPANET не приймає тут нуль або від’ємне число.';
$ec_lang['lpn_valwarn_negative']='EPANET не приймає тут від’ємне число.';
$ec_lang['lpn_valwarn_tank_levels']='EPANET не приймає цю ємність. Найменша глибина води не повинна перевищувати глибину води, а глибина води не повинна перевищувати найбільшу глибину води.';
$ec_lang['lpn_cp_bad_number']='Це значення не є числом, як вимагає ця властивість.';
$ec_lang['lpn_cp_bad_integer']='Це значення не є цілим числом, як вимагає ця властивість.';
$ec_lang['lpn_cp_bad_case']='Це значення не написане ВЕЛИКИМИ ЛІТЕРАМИ, як вимагає ця властивість.';
$ec_lang['lpn_cp_bad_chars']='Це значення містить символ, який ця властивість не дозволяє.';
$ec_lang['lpn_cp_bad_space']='Пробіли дозволені лише між іншими символами.';
$ec_lang['lpn_cp_bad_minlength']='Це значення коротше, ніж дозволяє ця властивість.';
$ec_lang['lpn_cp_bad_length']='Це значення довше, ніж дозволяє ця властивість.';
$ec_lang['lpn_cp_bad_low']='Це значення нижче нижньої межі цієї властивості.';
$ec_lang['lpn_cp_bad_high']='Це значення вище верхньої межі цієї властивості.';
$ec_lang['lpn_cp_key_needed']='Дайте цій власній властивості ключ без пробілів.';
$ec_lang['lpn_cp_key_taken']='Інша власна властивість уже використовує цей ключ.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Сценарій';
$ec_lang['lpn_scenario_base']='Базовий';
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
$ec_lang['lpn_scenario_overrides']='К-сть перевизначень';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Бурштиновий обідок означає, що цей елемент містить значення, яке належить лише сценарію {name}.';
$ec_lang['lpn_scenario_mark_inh_tip']='Пунктирне сіре коло означає, що сценарій {name} успадковує перевизначення для цього елемента від свого батьківського сценарію чи альтернативи.';
$ec_lang['lpn_scenario_overrides_tip']='Кожне перевизначення позначено на карті бурштиновим обідком. Перейдіть до {base} або іншого батьківського сценарію, щоб побачити креслення без них.';
$ec_lang['lpn_scenario_menu']='Сценарії';
$ec_lang['lpn_scenario_tip']='Набір значень, які зараз показує креслення і розраховує сторінка. Клацніть, щоб перемкнути сценарій або додати, перейменувати чи видалити його.';
$ec_lang['lpn_scenario_new']='Новий сценарій…';
$ec_lang['lpn_scenario_new_name']='Сценарій {n}';
$ec_lang['lpn_scenario_prompt_name']='Назва цього сценарію';
$ec_lang['lpn_scenario_rename']='Перейменувати сценарій…';
$ec_lang['lpn_scenario_delete']='Видалити сценарій';
$ec_lang['lpn_scenario_delete_ask']='Видалити сценарій {name}? Саме креслення не змінюється.';
$ec_lang['lpn_scenario_delete_goes']='Його перевизначення ({n}) видаляються разом із ним.';
$ec_lang['lpn_scenario_delete_stays']='Ці альтернативи, які він використовує, залишаються в проєкті: {list}.';
$ec_lang['lpn_scenario_delete_has_children']='Сценарій {name} не можна видалити, бо він має дочірні: {list}. Спершу видаліть їх або перемістіть до іншого батьківського.';
// Edited by TGH 2026-09-07
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Базовий сценарій: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} виключено з мережі в {scenario}. Він залишається на кресленні та в інших сценаріях.';
$ec_lang['lpn_scenario_delete_in_base']='Щоб вилучити його з креслення, видаліть його в сценарії «{base}».';
$ec_lang['lpn_scenario_only_deleted']='{id} видалено. Він належав лише сценарію {scenario}.';
$ec_lang['lpn_scenario_delete_blocked']='{id} не видалено, бо на ньому закінчується з’єднання {link}, яке існує й поза сценарієм {scenario}. Щоб видалити обидва, видаліть їх у сценарії «{base}».';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_basic']='Базовий режим';
$ec_lang['lpn_scenario_basic_tip']='Вибрано: альтернативи приховано й автоматичні, кожен сценарій показує свої перевизначення як власні, а всі нові сценарії є дочірніми до Базового сценарію; «Сценарії: керування» і таблицю «Сценарії» не показано. Знято: «Сценарії: керування» і таблицю «Сценарії» показано, а альтернативи можуть бути спільними для кількох сценаріїв. «Сценарії: керування» вимкнено, коли вибрано «Базовий режим». «Базовий режим» вимкнено, коли проєкт має зв’язки між сценаріями й альтернативами, які Базовий режим не може показати.';
$ec_lang['lpn_scenario_basic_misfit']='Цей проєкт має зв’язки між сценаріями й альтернативами, несумісні з Базовим режимом сценаріїв, тому Базовий режим вимкнено.';
$ec_lang['lpn_scenario_basic_misfit_base']='Базовий сценарій використовує альтернативу, відмінну від Базової.';
$ec_lang['lpn_scenario_copy']='Копіювати сценарій';
$ec_lang['lpn_scenario_copy_tip']='Копіює відкритий сценарій та його перевизначення й відкриває копію.';
$ec_lang['lpn_scenario_copy_off']='«Копіювати сценарій» працює в Базовому режимі. Коли Базовий режим вимкнено, додайте сценарій і виберіть його альтернативи в таблиці «Сценарії».';
$ec_lang['lpn_sm_title']='Сценарії: керування';
$ec_lang['lpn_sm_menu']='Сценарії: керування…';
$ec_lang['lpn_sm_basic_on']='«Сценарії: керування» вимкнено, коли вибрано «Базовий режим».';
$ec_lang['lpn_pane_tab_scenarios']='Сценарії';
$ec_lang['lpn_sm_col_parent']='Батьківський';
$ec_lang['lpn_sm_add_child']='Додати дочірній';
$ec_lang['lpn_sm_add_base']='Додати базовий';
$ec_lang['lpn_sm_add_base_tip']='Додати ще один Базовий сценарій. Він починається як копія Базового, зі своїми альтернативами, і подальші зміни Базового його не змінюють.';
$ec_lang['lpn_sm_add_base_alt_tip']='Додати ще одну Базову альтернативу. Вона починається як копія значень Базового в цій категорії, і подальші зміни Базового її не змінюють.';
$ec_lang['lpn_sm_delete']='Видалити вибраний елемент. Використаний елемент не видаляється.';
$ec_lang['lpn_sm_base_kept']='Базовий елемент дерева не видаляється. Інший Базовий, доданий через «Додати базовий», видаляється, коли ним ніхто не користується.';
$ec_lang['lpn_sm_rename']='Перейменувати';
$ec_lang['lpn_sm_rename_alts_ask']='Перейменувати альтернативи з такою самою назвою?';
$ec_lang['lpn_sm_make_current']='Зробити поточним';
// Tips on greyed Scenario manager commands, saying why they are greyed (Perry, 2026-10-11).
$ec_lang['lpn_sm_current_already']='Цей сценарій уже є поточним.';
$ec_lang['lpn_sm_none_selected']='Спершу виберіть елемент у дереві.';
$ec_lang['lpn_sm_base_named']='Базовий елемент дерева не перейменовується.';
$ec_lang['lpn_sm_copy']='Копіювати';
$ec_lang['lpn_sm_merge_up']='Об’єднати вгору';
$ec_lang['lpn_sm_merge_up_tip']='Перемістити перевизначення вибраної альтернативи в альтернативу над нею в дереві. Тоді вибрана альтернатива успадковує ці значення.';
$ec_lang['lpn_sm_merge_up_root']='Базова альтернатива не має над собою нічого, з чим можна об’єднатися.';
$ec_lang['lpn_sm_merge_none']='Альтернатива {name} не має перевизначень для об’єднання.';
$ec_lang['lpn_sm_merge_pick']='У яку альтернативу об’єднати перевизначення {name}? Її батьківська перелічена першою.';
$ec_lang['lpn_sm_merge_ask']='Перемістити перевизначення ({n}) {name} угору в {target}? Після цього вона успадковує їх замість перевизначати. Це можна скасувати.';
$ec_lang['lpn_sm_merge_skipped']='{between} теж перевизначає ці значення. Її пропущено й не змінено, тому {name} читатиме їх із {between}, а не з {target}:';
$ec_lang['lpn_sm_merge_line']='{asset}: {property}';
$ec_lang['lpn_sm_copy_up']='Копіювати вгору';
$ec_lang['lpn_sm_copy_up_tip']='Копіювати перевизначення вибраної альтернативи в альтернативу над нею в дереві. Вибрана альтернатива зберігає свої перевизначення.';
$ec_lang['lpn_sm_copy_up_root']='Базова альтернатива не має над собою нічого, у що можна копіювати.';
$ec_lang['lpn_sm_copy_none']='Альтернатива {name} не має перевизначень для копіювання.';
$ec_lang['lpn_sm_copy_pick']='У яку альтернативу копіювати перевизначення {name}? Її батьківська перелічена першою.';
$ec_lang['lpn_sm_copy_ask']='Копіювати перевизначення ({n}) {name} угору в {target}? {name} зберігає їх як власні перевизначення. Це можна скасувати.';
$ec_lang['lpn_sm_copy_skipped']='{between} теж перевизначає ці значення. Її пропущено й не змінено, тому вона зберігає для них власні значення:';
$ec_lang['lpn_sm_list_overrides']='Керування перевизначеннями…';
$ec_lang['lpn_sm_list_overrides_tip']='Перелічує перевизначення сценарію за категоріями, кожне зі значенням, яке воно перевизначає, і дає змогу скасувати будь-які з них.';
$ec_lang['lpn_sm_list_overrides_none']='Цей сценарій не має перевизначень.';
$ec_lang['lpn_ovl_title']='Керування перевизначеннями: {name}';
$ec_lang['lpn_ovl_note']='Це значення, які цей сценарій задає сам в альтернативах, що їх він використовує, кожне зі значенням, яке воно замінює. Успадковані значення не перелічено й не пораховано. Скасуйте перевизначення, щоб відновити успадковане значення; «Скасувати» повертає його назад. Виберіть ID, щоб перейти до елемента на карті.';
$ec_lang['lpn_ovl_clear_selected']='Скасувати вибрані перевизначення';
$ec_lang['lpn_ovl_clear_all']='Скасувати всі перевизначення';
$ec_lang['lpn_ovl_clear_all_ask']='Скасувати всі перевизначення ({n}) сценарію {name}? Кожне значення повертається до успадкованого. «Скасувати» повертає це назад.';
$ec_lang['lpn_ovl_pick_tip']='Виберіть це перевизначення для кнопки «Скасувати вибрані перевизначення».';
$ec_lang['lpn_ovl_bubble_off']='Не на карті';
$ec_lang['lpn_ovl_bubble_moved']='{quantity}, переміщено або змінено розмір';
$ec_lang['lpn_ovl_group']='{category}: {alternative}';
$ec_lang['lpn_ovl_col_override']='Перевизначення';
$ec_lang['lpn_ovl_col_inherited']='Успадковане значення';
$ec_lang['lpn_ovl_col_inherited_tip']='Значення, яке цей сценарій зчитує без перевизначення: значення батьківської альтернативи або Базове значення.';
$ec_lang['lpn_ovl_same']='(однакове)';
$ec_lang['lpn_ovl_same_tip']='Дорівнює успадкованому значенню. Це все одно перевизначення, і його враховано.';
$ec_lang['lpn_sm_help']='Як працюють сценарії й альтернативи:\n\nУ Базовому режимі альтернативи приховано й автоматичні, а всі нові сценарії є дочірніми до Базового сценарію.\n\nКоли Базовий режим вимкнено, доступне складне дерево успадкування, і альтернативи можуть бути спільними для кількох сценаріїв. Але типова поведінка редагувань, коли потрібен новий зв’язок з альтернативою (за відсутності активного керування з боку користувача), — створити альтернативу з назвою поточного сценарію, що надає кожному сценарію власний набір альтернатив.\n\nВластивості й налаштування належать до категорій альтернатив, які постають стовпцями таблиці сценаріїв і альтернатив та параметрами керування в «Сценарії: керування».\n\nПеревизначення створюють у сценаріях, але насправді вони належать відповідним альтернативам, пов’язаним зі сценарієм; тож сценарій — це наче вікно до його альтернатив. Зв’язками альтернатив зі сценаріями керують у правій панелі «Сценарії: керування» або в таблиці «Сценарії» в нижній панелі. Створення нового сценарію не створює альтернатив; новий сценарій використовує альтернативи свого батьківського, доки не створено перевизначення, що потребують нових альтернатив. Коли в сценарії створюють перевизначення, їх зберігають у відповідній альтернативі для цього сценарію; якщо в сценарію такої альтернативи немає, створюється нова альтернатива з назвою сценарію.\n\nПриклад: ви створюєте сценарій «Рисунок: ID вузлів і з’єднань» і редагуєте Текст, щоб він мав вигляд «ID вузлів і з’єднань». Коли ви створюєте сценарій, жодних альтернатив не створюється. Але в момент, коли ви зберігаєте Текст, створюється текстова альтернатива «Рисунок: ID вузлів і з’єднань» з перевизначенням значення Тексту. У Базовому режимі ви бачите це просто як перевизначення в самому сценарії.\n\n«Копіювати властивості» копіює лише перевизначення. У будь-якому сценарії, крім Базового, воно копіює лише перевизначення, які елемент має в цьому сценарії.\n\nЯк керувати сценаріями:\n\n- Виберіть «Сценарії» або категорію альтернатив у списку вгорі, щоб показати її дерево.\n\n- Створіть дочірній до вибраного елемент через «Додати дочірній». «Додати базовий» додає ще один Базовий, який починається як копія Базового в його теперішньому вигляді; подальші зміни Базового його не змінюють. Новий дочірній названо за його батьківським; введіть назву, щоб його перейменувати. «Копіювати» копіює вибрану альтернативу. «Об’єднати вгору» переміщує перевизначення вибраної альтернативи в альтернативу над нею, вибрану за назвою, і тоді вибрана альтернатива успадковує їх; спершу вона називає будь-яке значення, яке перевизначає також пропущена альтернатива, і це значення не змінюється. Щоб скопіювати сценарій, у Базовому режимі скористайтеся «Копіювати сценарій» у меню «Сценарії»; воно копіює перевизначення сценарію разом з альтернативами, що їх містять. «Додати базовий» і «Копіювати сценарій» кожне створюють альтернативи: «Додати базовий» створює Базову альтернативу для нового Базового в кожній категорії, що містить значення, а «Копіювати сценарій» створює нову альтернативу, названу як копія, для кожної альтернативи, що містить перевизначення сценарію.\n\n- Перетягніть елемент на інший, щоб зробити його дочірнім до того елемента. Сценарій, переміщений до нового батьківського, успадковує від нього все, що не перевизначив; те, що він перевизначив, не змінюється. Перетягніть елемент між двома елементами, щоб змінити їхній порядок.\n\n- Клацніть елемент, щоб вибрати його. Натисніть F2 або виберіть «Перейменувати», щоб перейменувати вибраний елемент. Перейменування сценарію питає, чи перейменувати альтернативи, що мають його назву; у Базовому режимі їх перейменовують разом із ним, без запитання. Двічі клацніть сценарій або натисніть Enter, щоб зробити його поточним. Клацніть стрілку поруч з елементом або натисніть Ліворуч чи Праворуч, щоб згорнути чи розгорнути його. Клацніть елемент правою кнопкою, щоб побачити ті самі команди, що й кнопки.\n\n- Натисніть Delete або клацніть кнопку «мінус», щоб видалити вибраний елемент. Елемент, що використовується, не видаляється, і повідомлення називає, що його використовує. Видалення сценарію за вимкненого Базового режиму зберігає альтернативи, які він використовує. Видалення сценарію за ввімкненого Базового режиму також видаляє кожну з його альтернатив, якої не використовує жоден інший сценарій.\n\n- Щоб сценарій використовував іншу альтернативу, зокрема Базову, виберіть її в рядку сценарію в правій панелі «Сценарії: керування» або в таблиці «Сценарії». Перевизначення, зроблене у спільній альтернативі, змінює кожен сценарій, що її використовує.';
$ec_lang['lpn_sm_delete_alt_ask']='Видалити альтернативу {name}?';
$ec_lang['lpn_sm_in_use']='{item}\nне можна видалити, поки його використовують\n{list}';
$ec_lang['lpn_sm_alt_delete_has_children']='Альтернативу {name} не можна видалити, бо вона має дочірні: {list}. Спершу видаліть їх або перемістіть до іншого батьківського.';
$ec_lang['lpn_sm_item_scenario']='Сценарій {name}';
$ec_lang['lpn_sm_item_alternative']='Альтернатива {name}';
$ec_lang['lpn_sm_name_taken']='Назву {name} уже використано в цьому дереві.';
$ec_lang['lpn_sm_cycle']='{name} не можна перемістити під один із його власних дочірніх.';
$ec_lang['lpn_sm_used_by']='Використовують сценарії: {n}';
$ec_lang['lpn_sm_used_by_tip']='Використовують: {list}';
$ec_lang['lpn_sm_used_by_none']='Жоден сценарій не використовує';
$ec_lang['lpn_sm_tree_all']='Усі';
$ec_lang['lpn_sm_tree_unused']='Усі невикористані';
$ec_lang['lpn_sm_unused_none']='Немає';
$ec_lang['lpn_sm_all_row_tip']='Двічі клацніть, щоб відкрити його у власному дереві категорії.';
$ec_lang['lpn_sm_compare_tip']='Включити в порівняння сценаріїв';
$ec_lang['lpn_sm_inherited']='успадковано';
$ec_lang['lpn_sm_shared_note']='Спільне з: {list}';
$ec_lang['lpn_scncmp_none_checked']='Жодного сценарію не позначено для порівняння. Позначте сценарії в «Сценарії: керування».';
$ec_lang['lpn_time_scn_overrides']='Перевизначення сценарію:';
$ec_lang['lpn_settings_table_major']='Основний заголовок';
$ec_lang['lpn_settings_table_minor']='Підзаголовок';
$ec_lang['lpn_settings_table_category']='Категорія';
// The Settings table's third heading level, between Minor heading and Setting: the label field, coloured
// field, asset or custom property a group of settings belongs to (Tom, 2026-10-07: "We could call it
// 'Owner'.").
$ec_lang['lpn_settings_table_owner']='Власник';
$ec_lang['lpn_settings_table_setting']='Налаштування';
$ec_lang['lpn_settings_table_yes']='Так';
$ec_lang['lpn_settings_table_no']='Ні';
$ec_lang['lpn_settings_row_of']='{setting}, {member}';
$ec_lang['lpn_settings_row_labels_field']='{labels}: {field}';
$ec_lang['lpn_settings_row_labels_part']='{labels}: {field}, {part}';
$ec_lang['lpn_settings_row_labels_customer']='Підписи абонентів';
$ec_lang['lpn_settings_row_label_before']='Текст перед';
$ec_lang['lpn_settings_row_label_after']='Текст після';
// A label field's settings, named in the Setting column with the field itself in the Owner column
// (Tom, 2026-10-07: "Symbology.Node labels.ID.Is Active", "Show order", "Drop order"). Whether the
// value appears on the label at all; where it sits on the label (1 first); which value is given up
// first when labels crowd (1 first).
$ec_lang['lpn_settings_row_label_on']='Активний';
$ec_lang['lpn_settings_row_label_show']='Порядок показу';
$ec_lang['lpn_settings_row_label_drop']='Порядок пропуску';
// The Setting column of an ID prefix row; the asset it applies to is in the Owner column.
$ec_lang['lpn_settings_row_id_prefix']='Префікс ID';
$ec_lang['lpn_settings_row_symbol_cap_multiple']='Найбільший символ, як кратне типової довжини труби';
$ec_lang['lpn_settings_row_symbol_cap_percentile']='Типова довжина труби, як процентиль усіх довжин труб';
$ec_lang['lpn_settings_row_contour_labels']='Підписи ізоліній';
$ec_lang['lpn_settings_row_check_freq']='Частота перевірок стану';
$ec_lang['lpn_settings_row_max_check']='Максимум перевірок стану';
$ec_lang['lpn_settings_row_status_report']='Звіт про стан';
$ec_lang['lpn_settings_row_pda_src']='Параметри розрахунку, залежного від тиску, указані у файлі';
$ec_lang['lpn_settings_row_quality_option']='Параметр якості води так, як його вказує файл';
$ec_lang['lpn_settings_row_tolerance']='Точність (старіші проєкти)';
$ec_lang['lpn_settings_row_emitter_exponent_old']='Показник степеня розбризкувача (старіші проєкти)';
$ec_lang['lpn_settings_row_elev_source_old']='Джерело відмітки (старіші проєкти)';
$ec_lang['lpn_settings_row_basemap']='Основа карти';
$ec_lang['lpn_settings_row_basemap_last']='Основа карти для повернення';
$ec_lang['lpn_settings_row_customer_max_width']='Показувати підписи абонентів за масштабу, коли ширина карти не перевищує цього значення';
$ec_lang['lpn_settings_row_quality_step']='Крок часу розрахунку якості води';
$ec_lang['lpn_settings_row_view']='Вид карти (центр і масштаб)';
$ec_lang['lpn_settings_row_bubbles']='Графіки часових рядів на карті';
$ec_lang['lpn_settings_row_contour_fill']='Заливка ізоліній';
$ec_lang['lpn_settings_row_contour_opacity']='Непрозорість заливки ізоліній';
$ec_lang['lpn_settings_row_contour_interval']='Інтервал ізоліній';
$ec_lang['lpn_settings_row_contour_buffer']='Буфер ізоліній';
$ec_lang['lpn_settings_row_contour_terrain']='Ґрунт між вузлами для ізоліній з DEM Mapbox';
$ec_lang['lpn_settings_row_new_asset']='Нові елементи: {setting}';
$ec_lang['lpn_settings_row_default']='{value} (за замовчуванням)';
$ec_lang['lpn_settings_row_view_value']='Центр {x}, {y}; масштаб {s}';
$ec_lang['lpn_settings_held_in']='Перевизначення в {scenario}.';
$ec_lang['lpn_settings_held_base']='{base}: {value}';
$ec_lang['lpn_settings_view_center']='Центр карти';
$ec_lang['lpn_settings_view_scale']='Масштаб карти';
$ec_lang['lpn_settings_view_scale_tip']='Масштаб у центрі карти, у вигляді 1:N. Введіть 1:2000 або просто 2000, щоб змінити масштаб на цей.';
$ec_lang['lpn_settings_view_top_left']='Лівий верхній кут';
$ec_lang['lpn_settings_view_bottom_right']='Правий нижній кут';
$ec_lang['lpn_settings_view_save']='Зберегти цей вид у цьому сценарії';
$ec_lang['lpn_settings_view_save_tip']='Зберігає цей центр і масштаб карти у відкритому сценарії, тож відкриття цього сценарію переміщує карту сюди. Подальше пересування карти нічого не змінює, доки ви не натиснете це знову. Скасуйте перевизначення, щоб знову дотримуватися виду {base}.';
$ec_lang['lpn_settings_row_basemap_osm']='Вулична карта';
$ec_lang['lpn_settings_row_basemap_satellite']='Супутникові знімки';
$ec_lang['lpn_settings_row_basemap_topo']='Топографічна карта';
$ec_lang['lpn_settings_units_one_project']='Одиниці однакові в кожному сценарії.';
$ec_lang['lpn_settings_restore_base_only']='Перейдіть до Базового, щоб скинути значення за замовчуванням.';
$ec_lang['lpn_alt_cat_physical']='Фізичні';
$ec_lang['lpn_alt_cat_demand']='Споживання';
$ec_lang['lpn_alt_cat_topology']='Активна топологія';
$ec_lang['lpn_alt_cat_topology_tip']='Активація елементів';
$ec_lang['lpn_alt_cat_initial']='Початкові налаштування';
$ec_lang['lpn_alt_cat_constituent']='Компонент';
$ec_lang['lpn_alt_cat_fireflow']='Витрата на пожежогасіння';
$ec_lang['lpn_alt_cat_energy']='Вартість енергії';
$ec_lang['lpn_alt_cat_userdata']='Власні властивості';
$ec_lang['lpn_alt_cat_text']='Текст';
$ec_lang['lpn_alt_cat_presentation']='Подання';
$ec_lang['lpn_alt_cat_calculation']='Розрахунок';
// Edited by TGH 2026-09-07
// Task 721: the scenarios every new project starts with. Keep the leading number: the list sorts
// by name, and the numbers hold Tom's order in every language.
$ec_lang['lpn_scenario_preset_flow_static']='1. Тест витрати: статичний';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Калібрування за тестом витрати для проєктної мережі за нульової витрати. У цьому сценарії задайте споживання в усіх вузлах рівним 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Тест витрати: середній';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Калібрування за тестом витрати для проєктної мережі за першої зафіксованої витрати. У цьому сценарії задайте споживання у вузлі з витратою рівним першій виміряній витраті, а в усіх інших вузлах 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Тест витрати: максимальний';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Калібрування за тестом витрати для проєктної мережі за максимальної зафіксованої витрати. У цьому сценарії задайте споживання у вузлі з витратою рівним максимальній виміряній витраті, а в усіх інших вузлах 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Середня доба';
$ec_lang['lpn_scenario_preset_average_day_tip']='Множник споживання 1: кожне споживання таке, як введено, і вважається споживанням середньої доби.';
$ec_lang['lpn_scenario_preset_max_day']='5. Максимальна доба';
$ec_lang['lpn_scenario_preset_mult_tip']='Множник споживання {mult} від середньої доби — умовне значення. Більшість систем потрапляє між {lo} і {hi} (National Research Council, 2006). Задайте значення для системи, що моделюється, у Налаштування, Розрахунок, Гідравліка, Множник споживання.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Пікова година';
$ec_lang['lpn_delete_drops_overrides']='Видалення цього елемента також видаляє його перевизначення сценаріїв ({n}). Продовжити?';
$ec_lang['lpn_push_base_only']='Ця дія змінює саме креслення, тому її можна виконати лише в {base}. Перейдіть до {base} і спробуйте знову.';
$ec_lang['lpn_field_active']='Активний?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Зніміть позначку, щоб залишити елемент на кресленні, але поза мережею: його показано сірим, і розв’язувач його ігнорує. У сценарії так вмикають і вимикають трубу.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Показник степеня розбризкувача';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='Показник степеня у формулі емітера EPANET для дощувачів і витоків: витрата = коефіцієнт × тиск у цьому степені. Впливає на результати лише у вузлах із коефіцієнтом емітера.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Прочитати DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Читає відмітку з DEM для цього вузла й показує її нижче. Нічого в полі «Відмітка» не змінюється. Горизонтальна роздільна здатність DEM — близько 30 м для більшості поверхні Землі, і точніша там, де є кращі дані.';
$ec_lang['lpn_elev_dem_use']='Використати DEM';
$ec_lang['lpn_elev_dem_use_tip']='Вставляє відмітку з DEM для цього вузла в поле «Відмітка» вище, замінюючи те, що там було. Спершу читає DEM, якщо він ще не був прочитаний. Одне скасування (Undo) поверне попереднє значення.';
$ec_lang['lpn_elev_dem_none']='DEM не має відмітки для цього вузла.';
$ec_lang['lpn_elev_dem_said']='Відмітка за DEM Mapbox: {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Джерело відмітки';
$ec_lang['lpn_settings_elev_source_tip']='Точність DEM Mapbox у 2026 році, спершу горизонтальна, потім вертикальна: 1–10 м і менше ніж 1 м у США, 2–10 м і 1–3 м у Європі та Японії, 30 м і 10–16 м у світі загалом, 90 м і понад 16 м на полюсах.';
$ec_lang['lpn_settings_elev_source_typed']='Вище';
$ec_lang['lpn_settings_elev_source_dem']='DEM Mapbox';
$ec_lang['lpn_settings_accuracy']='Точність';
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
$ec_lang['lpn_settings_default_is']='За замовчуванням: {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Межа збіжності, якої має досягти розв’язувач, перш ніж зупиниться, вимірювана як сумарна зміна витрат від однієї ітерації до наступної, поділена на сумарну витрату в зв’язках. Менше число точніше, але потребує більше часу.';
$ec_lang['lpn_settings_specific_gravity']='Питома вага';
$ec_lang['lpn_settings_viscosity']='Відносна в\'язкість';
// **THE PASHTO COLLISION THIS ANSWERS IS REAL AND IS INSIDE PASHTO** (sprint 584-wave1). ps renders
// this key with the word غلظت, which carries BOTH viscosity/thickness AND concentration -- so it
// collided with the word the same sprint used for lpn_result_concentration, on the same screen.
// Tom approved a synonym on 2026-09-06. **HIS FIRST WORDING WAS 'Relative rate of diffusion' and it
// is NOT what shipped**: that is diffusivity, and this key is viscosity. He was given a friction
// entry that quoted a translator's mistaken description of the key without anyone checking it
// against this file -- so the note below says what the number IS and what it is NOT, because two
// separate readers have now reached for a transport coefficient on a fluid property.
$ec_lang['lpn_settings_viscosity_tip']='В\'язкість рідини порівняно з водою за 20 градусів Цельсія. Вона змінює відповідь лише за методом Дарсі-Вейсбаха.';
$ec_lang['lpn_settings_trials']='Максимум ітерацій';
$ec_lang['lpn_settings_trials_tip']='Найбільша кількість ітерацій, після якої розв’язувач зупиняється на мережі, що не збігається.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Якщо не збігається';
$ec_lang['lpn_settings_unbalanced_tip']='Дія для мережі, яка вичерпала ітерації й досі не збіглася. Дозвіл додаткових ітерацій часто призводить до збіжності. Зупинка повідомляє останню ітерацію як є, а це не розв’язок.';
$ec_lang['lpn_settings_unbalanced_continue']='Дозволити додаткові ітерації';
$ec_lang['lpn_settings_unbalanced_stop']='Зупинитися й повідомити останню ітерацію';
$ec_lang['lpn_settings_unbalanced_trials']='Додаткові ітерації перед звітом';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Кількість додаткових ітерацій, дозволених після вичерпання максимуму вище, перш ніж буде повідомлено останню ітерацію.';
$ec_lang['lpn_settings_head_error']='Межа похибки напору';
$ec_lang['lpn_settings_head_error_tip']='Додаткова перевірка, яку розв\'язувач має пройти, перш ніж зупинитися: найбільша похибка напору, що лишається в будь-якій одній трубі. Нуль означає не застосовувати цю перевірку. Це поле читає лише розв\'язувач EPANET.';
$ec_lang['lpn_settings_flow_change']='Межа зміни витрати';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Додаткова перевірка, яку розв\'язувач має пройти, перш ніж зупинитися: найбільша зміна витрати в будь-якій одній трубі від однієї ітерації до наступної. Нуль означає не застосовувати цю перевірку. Це поле читає лише розв\'язувач EPANET.';
$ec_lang['lpn_settings_damp_limit']='Демпфування починається з';
$ec_lang['lpn_settings_damp_limit_tip']='Точність, за якої розв\'язувач починає робити менші кроки, що може допомогти мережі, яка коливається, збігтися. Нуль означає, що розв\'язувач ніколи не демпфує. Це поле читає лише розв\'язувач EPANET.';
$ec_lang['lpn_settings_option_unset']='Не вказано';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Єдиний коефіцієнт, що застосовується до кожного споживання в мережі одразу. Кожен сценарій може мати окреме значення, тож середню добу, максимальну добу чи пікову годину можна створити, змінивши лише це налаштування.';
$ec_lang['lpn_settings_engine_native']='Використовувати вбудований розв\'язувач, коли можливо';
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
$ec_lang['lpn_settings_engine_native_tip']='Увімкніть це, щоб використовувати вбудований розв’язувач там, де це можливо. Інакше завжди використовується розв’язувач EPANET від Агентства з охорони довкілля США (US EPA). Вбудований розв’язувач не застосовується для моделювання за розширений період, а також для клапанів-гасників тиску й клапанів загального призначення (PBV, GPV). Коли розв’язувач EPANET використовують уперше, завантажується близько 650 КБ, які потім зберігаються на цьому пристрої. Там, де труба має місцеві втрати, розв’язувачі трохи розходяться в останніх цифрах: EPANET використовує округлене значення прискорення вільного падіння, тому його місцеві втрати виходять трохи нижчими, ніж за точною формулою.';
$ec_lang['lpn_engine_loading']='Завантаження розв\'язувача EPANET…';
$ec_lang['lpn_engine_failed']='Не вдалося завантажити розв\'язувач EPANET. Замість нього показано вбудований розв\'язувач.';
$ec_lang['lpn_engine_failed_why']='{reason} Натомість показано вбудований розв’язувач.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Розраховано розв’язувачем EPANET через ці клапани-гасники тиску й клапани загального призначення:';
$ec_lang['lpn_unit_unknown']='Це креслення вказує одиницю, яку ця сторінка не підтримує: {unit}. Усі значення збережено й показано точно так, як імпортовано, і нічого не змінено. Нічого не можна обчислити, доки одиницю не буде підтримано, бо її коефіцієнт перетворення невідомий.';
$ec_lang['lpn_engine_manning_note']='Примітка: з коефіцієнтом шорсткості Маннінга EPANET округлює сталу в рівнянні Маннінга, тож втрати напору виходять приблизно на 0,6% нижчими, ніж за точною формулою.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='Розв\'язувач EPANET не прийняв цю мережу, тож розрахунок не виконано.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='Розв\'язувач EPANET повідомив: {message}';
$ec_lang['lpn_engine_refused_fallback']='Числа на екрані отримано натомість від вбудованого розв\'язувача.';
// A run EPANET started and could not finish, for example when a tank empties and the junctions it
// fed have no other source (Error 110). {time} is the run time it stopped at, H:MM.
$ec_lang['lpn_time_run_stopped']='Розрахунок EPANET зупинився на {time}, тому результатів немає. Причину вказано в його звіті про розрахунок.';
$ec_lang['lpn_time_stat_stopped']='{statistic} не показано: розрахунок зупинився до кінця періоду.';
$ec_lang['lpn_time_stopped_no_quality']='Результати якості води не розраховано, бо аналіз якості починається після завершення гідравлічного розрахунку.';
$ec_lang['lpn_energy_stopped']='Розрахунок EPANET зупинився до кінця періоду, тому результати енергії насосів не розраховано.';
$ec_lang['lpn_time_run_stopped_kept']='Розрахунок EPANET зупинився на {time}. Результати доходять до {solved}, останнього розрахованого періоду, а після нього їх не показано. Причину вказано в його звіті про розрахунок.';
// Why a stopped run stopped, read from EPANET's own run report (R-402). {link} is the link EPANET
// had just closed, {tank} the tank at one end of it, {nodes} the ids of the nodes EPANET then could
// not solve for, comma-separated. Follows lpn_time_run_stopped or lpn_time_run_stopped_kept.
$ec_lang['lpn_time_run_cut_off']='EPANET закрив {link}, а потім не зміг розв’язати для {nodes}.';
$ec_lang['lpn_time_run_cut_off_full']='Ємність {tank} була повна, тому EPANET закрив {link}, щоб не пускати в неї воду, а потім не зміг розв’язати для {nodes}. Таке може статися, коли з повної ємності нічого не відбирається, наприклад коли кожне споживання дорівнює нулю. Споживання, трохи більше за нуль, або рівень ємності, трохи нижчий за максимальний, цього уникає.';
$ec_lang['lpn_time_run_cut_off_empty']='Ємність {tank} була порожня, тому EPANET закрив {link}, щоб вона не спорожнювалася далі, а потім не зміг розв’язати для {nodes}.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Числа на екрані отримано натомість від вбудованого розв\'язувача. Він розраховує лише один момент часу, тож це мережа тільки на {time}, коли кожна ємність усе ще перебуває на своєму початковому рівні.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Ці правила керування називають елемент, якого вже немає в цьому проєкті, тож їх пропущено: {ids}';
$ec_lang['lpn_control_unreadable_note']='Ці правила керування не вдалося прочитати, тож їх пропущено: {ids}';
$ec_lang['lpn_control_inactive_note']='Ці керування посилаються на елемент, який у цьому сценарії неактивний, тому під час його розрахунку їх ігнорують: {ids}';
$ec_lang['lpn_rule_inactive_note']='Ці правила посилаються на елемент, який у цьому сценарії неактивний, тому під час його розрахунку їх ігнорують: {ids}';
$ec_lang['lpn_rule_dangling_note']='Ці правила посилаються на елемент, якого вже немає в цьому проєкті, тож їх проігноровано в цьому розрахунку: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Ці правила не вдалося прочитати, тож їх проігноровано в цьому розрахунку: {ids}';
$ec_lang['lpn_settings_text_size']='Розмір тексту (пікселі)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Розмір символів (пікселі)';
$ec_lang['lpn_settings_link_width']='Товщина лінії з\'єднання (пікселі)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Стрілки напрямку витрати';
$ec_lang['lpn_settings_show_arrows_tip']='Малювати на кожній трубі стрілку, що показує напрямок руху води. Стрілки з’являються після розрахунку, а їх вимкнення не змінює результатів.';
$ec_lang['lpn_settings_align_labels']='Вирівнювати підписи труб за трубами';
$ec_lang['lpn_settings_readability_bias']='Перевертати підпис, коли він нахилений більш ніж на стільки градусів ліворуч від вертикалі';
$ec_lang['lpn_settings_readability_bias_tip']='Перевертає підпис, щоб він лишався прямим, коли він нахилений ліворуч від вертикалі більш ніж на стільки градусів.';
$ec_lang['lpn_settings_mask_labels']='Суцільний фон під підписами';
$ec_lang['lpn_settings_text_halo']='Ширина ореолу тексту (відсоток розміру тексту)';
$ec_lang['lpn_settings_text_halo_tip']='Ширина суцільного контуру за текстом на карті, у відсотках від розміру тексту. Діє, коли ввімкнено «Суцільний фон під підписами».';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Прилипання виносних ліній до заданих кутів';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Показувати підписи при масштабі карти цієї ширини або меншому';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Підписи малюються, лише поки вигляд карти такий широкий або вужчий. Залиште поле порожнім, щоб малювати їх за будь-якого масштабу. Введіть 0, щоб ніколи не малювати підпис, за жодного масштабу.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Показувати завжди';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap_sentence']='Не давати вузлам масштабуватися більше, ніж {n} разів довжини {p} труби цього процентиля';
$ec_lang['lpn_settings_symbol_cap_tip']='Вузли перестають зберігати розмір на екрані, коли їхній діаметр на карті стає в стільки разів більшим за довжину труби цього процентиля серед усіх довжин труб мережі. За цією межею на карті вузли, труби й інші символи зменшуються на екрані під час віддалення. Резервуари й ємності становлять виняток і зберігають розмір на екрані за будь-якого масштабу.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Непрозорість символів (від 0 до 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Непрозорість фонового зображення (від 0 до 1)';
// Task 617: a display-time filter on the street or satellite tiles only; the drawing and the credit are untouched.
$ec_lang['lpn_settings_basemap_style']='Стиль основи карти';
$ec_lang['lpn_basemap_style_normal']='Звичайний';
$ec_lang['lpn_basemap_style_muted']='Приглушений';
$ec_lang['lpn_basemap_style_faded']='Вицвілий';
$ec_lang['lpn_basemap_style_grayscale']='Відтінки сірого';
$ec_lang['lpn_settings_map_display']='Зовнішній вигляд';
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
$ec_lang['lpn_settings_legend_position']='Розташування умовних позначень підписів';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Немає';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Вимкнено';
$ec_lang['lpn_settings_legend_top_left']='Вгорі ліворуч';
$ec_lang['lpn_settings_legend_top_right']='Вгорі праворуч';
$ec_lang['lpn_settings_legend_middle_left']='Посередині ліворуч';
$ec_lang['lpn_settings_legend_middle_right']='Посередині праворуч';
$ec_lang['lpn_settings_legend_bottom_left']='Внизу ліворуч';
$ec_lang['lpn_settings_legend_bottom_right']='Внизу праворуч';
$ec_lang['lpn_settings_color_node_field']='Колір вузла';
$ec_lang['lpn_settings_color_link_field']='Колір труби';
$ec_lang['lpn_settings_color_ramp']='Кольорова схема';
$ec_lang['lpn_settings_color_credits']='Атрибуція';
$ec_lang['lpn_color_ramp_epanet']='Від синього до червоного (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Від фіолетового до жовтого (легше відрізнити один колір від іншого)';
$ec_lang['lpn_color_ramp_gray']='Від світло- до темно-сірого';
$ec_lang['lpn_settings_color_reverse']='Обернути порядок кольорів';
$ec_lang['lpn_color_none']='Без кольору';
$ec_lang['lpn_settings_color_key_position']='Розташування кольорової легенди';
$ec_lang['lpn_settings_color_breaks']='Межі кольорових діапазонів';
$ec_lang['lpn_settings_color_equal_intervals']='Рівні інтервали';
$ec_lang['lpn_settings_color_equal_counts']='Рівна кількість';
$ec_lang['lpn_settings_color_no_values']='Поки що немає значень для роботи. Спершу розрахуйте мережу.';
$ec_lang['lpn_confirm_restore_defaults']='Скинути всі налаштування (префікси ID, початкові значення, налаштування розв’язувача, вигляд карти, положення легенди та видимі підписи) до початкових значень? Мережа не змінюється. Налаштування належать відкритому проєкту, тому інші проєкти не зачіпаються.';
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
$ec_lang['lpn_settings_wipe_btn']='Почати заново';
$ec_lang['lpn_confirm_wipe']='Почати заново й видалити ВСЕ, збережене для цієї сторінки: кожен проєкт, кожне фонове зображення, всі налаштування та ваш вибір одиниць? Сторінка перезавантажиться точнісінько так, як її побачив би абсолютно новий відвідувач. Це неможливо скасувати.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Скопіюйте це посилання:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Час';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Загальний час роботи';
$ec_lang['lpn_time_hyd_step']='Крок часу гідравлічного розрахунку';
$ec_lang['lpn_time_pattern_step']='Крок часу графіка';
$ec_lang['lpn_time_pattern_start']='Час початку графіка';
$ec_lang['lpn_time_report_step']='Крок часу звіту';
$ec_lang['lpn_time_report_start']='Час початку звіту';
$ec_lang['lpn_time_clock_start']='Час на годиннику на початку';
$ec_lang['lpn_time_statistic']='Статистика';
$ec_lang['lpn_time_stat_none']='Немає';
$ec_lang['lpn_time_stat_averaged']='Серед.';
$ec_lang['lpn_time_stat_minimum']='Мін.';
$ec_lang['lpn_time_stat_maximum']='Макс.';
$ec_lang['lpn_time_stat_range']='Діапазон';
$ec_lang['lpn_time_clock_day']='День {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Записуйте час як години і хвилини, наприклад 2:30. Просте число означає години, тож 8 — це вісім годин. Півгодини — це 0:30.';
$ec_lang['lpn_time_running']='Виконується розрахунок за розширений період.';
$ec_lang['lpn_time_no_engine']='Вбудований розв’язувач розраховує один момент часу за раз, тож це мережа лише на {time}: кожен графік зчитується в цей момент, а кожна ємність залишається на початковому рівні, не наповнюючись і не спорожнюючись. Підключіться до інтернету один раз, щоб завантажити розв’язувач EPANET, який виконує розрахунок за розширений період.';
// lpn_time_no_engine says "connect to the internet", which is true only offline. For the other causes
// of a failed extended period run the same note ends in {reason}, one of the three sentences below.
$ec_lang['lpn_time_no_engine_why']='Вбудований розв’язувач розраховує один момент часу за раз, тож це мережа лише на {time}: кожен графік зчитується в цей момент, а кожна ємність залишається на початковому рівні, не наповнюючись і не спорожнюючись. {reason}';
$ec_lang['lpn_time_engine_fetch_failed']='Не вдалося завантажити розв’язувач EPANET. Перезавантажте сторінку, щоб спробувати ще раз; завантаженню може заважати брандмауер, проксі або розширення браузера.';
$ec_lang['lpn_time_engine_start_failed']='Браузер відмовився запускати розв’язувач EPANET. WebAssembly може бути вимкнено параметром безпеки або розширенням.';
$ec_lang['lpn_time_engine_run_failed']='Розрахунок EPANET не вдався. Це дефект цієї сторінки; повідомте про нього через посилання {wrong}.';
$ec_lang['lpn_time_slider']='Минулий час моделювання';
$ec_lang['lpn_time_no_period']='Цей проєкт не має заданого розрахунку за розширений період, тож показати можна лише один момент. Задайте «Загальний час роботи» в «Налаштування, Розрахунок, Час», щоб виконати розрахунок за розширений період.';
$ec_lang['lpn_time_first']='Перейти на початок';
$ec_lang['lpn_time_prev']='Крок назад';
$ec_lang['lpn_time_play']='Відтворити';
$ec_lang['lpn_time_play_tip']='Відтворити анімацію';
$ec_lang['lpn_time_pause_tip']='Призупинити анімацію';
$ec_lang['lpn_time_pause']='Пауза';
$ec_lang['lpn_time_next']='Крок вперед';
$ec_lang['lpn_time_last']='Перейти в кінець';
$ec_lang['lpn_time_tank']='Ємність';
$ec_lang['lpn_time_level']='Рівень води';
$ec_lang['lpn_time_run']='Розрахувати';
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
$ec_lang['lpn_time_run_done']='Розрахунок завершено. Моменти звітування: {frames}. Витрачений час: {secs} с.';
$ec_lang['lpn_time_runbox_hide']='Більше не показувати це вікно';
$ec_lang['lpn_settings_runbox']='Показувати вікно перебігу розрахунку';
$ec_lang['lpn_settings_runbox_tip']='Вікно, що повідомляє, наскільки просунувся розрахунок і що він виявив. Якщо вимкнено, завершений розрахунок повідомляє те саме в рядку стану протягом кількох секунд. Це налаштування для цього браузера, а не для проєкту.';
$ec_lang['lpn_time_run_failed']='Розрахунок не завершився, тож результатів для пізніших моментів немає.';
$ec_lang['lpn_time_run_report']='Розрахунок: звіт';
$ec_lang['lpn_time_run_report_copy']='Копіювати';
$ec_lang['lpn_time_run_report_copied']='Скопійовано';
$ec_lang['lpn_time_run_report_tip']='Звіт, який EPANET записав про останній розрахунок, дослівно: чи він збігся, і всі попередження. Текст створює розв’язувач EPANET, а не ця сторінка.';

$ec_lang['lpn_time_speed']='Швидкість відтворення';
$ec_lang['lpn_time_speed_tip']='Швидкість відтворення';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Пошук налаштувань';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Введіть одне чи кілька слів, щоб побачити налаштування, які згадують їх усі.';
$ec_lang['lpn_settings_no_match']='Жодне налаштування не згадує це слово.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Ширина списку розділів налаштувань';
$ec_lang['lpn_rpane_empty']='Тут поки що нічого не закріплено. Усе, що стосується всього проєкту, — у Налаштуваннях.';
$ec_lang['lpn_time_settings_open']='Налаштування часу';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Візуалізація';
$ec_lang['lpn_settings_sec_map']='Карта і сторінка';
$ec_lang['lpn_settings_sec_assets']='Елементи';
$ec_lang['lpn_settings_sec_calculation']='Розрахунок';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Абонент';
$ec_lang['lpn_labels_customer_note']='Підпис абонента показує позначені тут значення. Його малюють тим самим розміром тексту, що й усі інші підписи на карті.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Підписи абонентів малюються, лише поки вигляд карти такий широкий або вужчий. Залиште поле порожнім, щоб малювати їх за будь-якого масштабу. Введіть 0, щоб ніколи не малювати підпис абонента, за жодного масштабу. Це не має ефекту, якщо значення більше за подібне налаштування для всіх підписів.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Використати поточний вигляд';
$ec_lang['lpn_settings_page']='Сторінка';
$ec_lang['lpn_saved_project']='Збережено разом із проєктом';
$ec_lang['lpn_saved_browser']='Збережено в цьому браузері';
$ec_lang['lpn_saved_session']='Не збережено';
$ec_lang['lpn_settings_hydraulics']='Гідравліка';
$ec_lang['lpn_settings_quality']='Якість води';
$ec_lang['lpn_settings_quality_track']='Параметр якості';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Виберіть, що має відстежувати розрахунок у трубах: як довго вода перебуває в системі, звідки вона надійшла, або хімічну речовину, що реагує в дорозі. Коефіцієнти потрібні лише для хімічної речовини.';
$ec_lang['lpn_settings_quality_source']='Вузол трасування';
$ec_lang['lpn_settings_quality_source_tip']='Вузол, воду якого трасують. Кожен інший вузол потім показує частку своєї води, що надійшла з цього вузла.';
$ec_lang['lpn_quality_none']='Нічого';
$ec_lang['lpn_quality_trace']='Трасування джерела';
$ec_lang['lpn_quality_chemical']='Хімічна речовина, що реагує';
$ec_lang['lpn_quality_needs_run']='Якість води переноситься трубами разом з водою, тож для цього потрібен розрахунок за розширений період: розв\'язувач EPANET і загальний час розрахунку. Задайте «Загальний час роботи» в розділі «Час», потім натисніть кнопку «Розрахувати».';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Хімічна речовина та одиниці';
$ec_lang['lpn_quality_chemical_name_tip']='Хімічна речовина, що відстежується, наприклад Хлор. Залиште порожнім, щоб використати типову позначку EPANET, Chemical. Показується у звітах, але не використовується в розрахунках.';
$ec_lang['lpn_quality_mass_units']='Одиниці маси';
$ec_lang['lpn_quality_mass_units_tip']='Частина запису якості, що стосується одиниць, з двох варіантів EPANET.';
$ec_lang['lpn_quality_unit_ug']='мкг/л';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Допуск якості';
$ec_lang['lpn_quality_tolerance_tip']='Різниця концентрацій, нижче якої EPANET вважає дві сусідні порції води однією. Порожнє поле означає типове значення EPANET, 0.01.';
$ec_lang['lpn_quality_diffusivity']='Відносна дифузійність';
$ec_lang['lpn_quality_diffusivity_tip']='Дифузійність хімічної речовини у воді відносно хлору. Порожнє поле означає типове значення EPANET, 1.0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Концентрація {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Середня концентрація {chemical}';
$ec_lang['lpn_quality_initial']='Початкова якість';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Кількість хімічної речовини в цьому вузлі на початку розрахунку. Резервуар зберігає це значення протягом усього розрахунку, і саме так зазвичай задають залишкову концентрацію на виході зі станції очищення. Порожнє поле означає 0.';
$ec_lang['lpn_result_concentration']='Концентрація';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Кількість хімічної речовини, що лишається в цій точці після переносу й реакції. Одиниці — ті, що введені разом із назвою хімічної речовини в Налаштування, Розрахунок, Якість води.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Тип джерела';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Який вид дози цей вузол додає до води, що проходить через нього. «Концентрація» вважає, що вода, яка входить у мережу тут, надходить із концентрацією «Якість джерела». «Масовий дозатор» додає масу хімічної речовини щохвилини, незалежно від витрати. «Дозатор до уставки» піднімає концентрацію на виході з цього вузла до значення «Якість джерела» і не вище. «Дозатор пропорційно витраті» додає значення «Якість джерела» до того, що вже є у воді.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Немає';
$ec_lang['lpn_source_type_concen']='Концентрація';
$ec_lang['lpn_source_type_mass']='Масовий дозатор';
$ec_lang['lpn_source_type_setpoint']='Дозатор до уставки';
$ec_lang['lpn_source_type_flowpaced']='Дозатор пропорційно витраті';
$ec_lang['lpn_source_quality']='Якість джерела';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Сила дози. Для всіх типів, крім масового підсилювача, це концентрація в одиницях, названих поряд із хімічною речовиною в Налаштування, Розрахунок, Якість води; для масового підсилювача це масова витрата за хвилину. Порожнє поле означає відсутність джерела хімічної речовини, що функціонально рівнозначно 0.';
$ec_lang['lpn_source_pattern']='Графік джерела';
$ec_lang['lpn_source_pattern_tip']='Графік у часі, який масштабує дозу протягом розрахунку — для дозатора, що працює не постійно. Відсутність графіка означає, що доза однакова на кожному кроці.';
$ec_lang['lpn_mixing_model']='Модель перемішування';
$ec_lang['lpn_mixing_model_tip']='Як вода, що вже є в цій ємності, перемішується з водою, що надходить. «Повне перемішування» перемішує всю ємність одразу. «Двокамерне перемішування» спочатку заповнює вхідну зону, а решту передає далі. «Витіснення FIFO» пропускає воду в тому порядку, у якому вона надійшла. «Витіснення LIFO» складає воду шарами, тож остання вода, що зайшла, виходить першою. Цей вибір змінює вік води та її залишкову концентрацію і не змінює жодного тиску чи витрати.';
$ec_lang['lpn_mixing_mixed']='Повне перемішування';
$ec_lang['lpn_mixing_2comp']='Двокамерне перемішування';
$ec_lang['lpn_mixing_fifo']='Витіснення FIFO';
$ec_lang['lpn_mixing_lifo']='Витіснення LIFO';
$ec_lang['lpn_mixing_fraction']='Частка перемішування';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Частка об\'єму ємності, яку займає вхідна зона, від 0 до 1. Використовується лише для двокамерного перемішування. Залиште поле порожнім, і вхідною зоною вважається вся ємність, як і передбачає EPANET.';
$ec_lang['lpn_reaction_bulk']='Коефіцієнт реакції в товщі води';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Реакція в товщі води (див. довідку EPANET), яка застосовується до кожної труби й ємності без окремого коефіцієнта. Від’ємне число зменшує кількість хімічної речовини, додатне — збільшує. Порожнє поле означає відсутність реакції в товщі води.';
$ec_lang['lpn_reaction_wall']='Коефіцієнт реакції на стінці';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Реакція на стінці труби, застосовується для кожної труби, яка не має власного коефіцієнта. Від\'ємне число зменшує кількість хімічної речовини. Реакція першого порядку, якщо імпортований файл EPANET не задає інший порядок, тож коефіцієнт — це довжина за добу, записана в одиниці довжини проєкту. Порожнє поле означає відсутність реакції на стінці.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Лише для цієї труби. Залиште поле порожнім, і труба використовуватиме коефіцієнт, заданий для всієї мережі в «Налаштування, Якість води».';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Коефіцієнт реакції';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Реакція у воді, що міститься в цій ємності, як швидкість у 1/добу. Від’ємне число зменшує кількість хімічної речовини, додатне — збільшує. Вода стоїть в ємності набагато довше, ніж у будь-якій трубі, тож саме тут часто втрачається залишкова концентрація. Порожнє поле означає використання коефіцієнта реакції в товщі води, заданого для всієї мережі в Налаштування, Розрахунок, Якість води.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Реакція в товщі';
$ec_lang['lpn_reaction_wall_short']='Реакція на стінці';
$ec_lang['lpn_reaction_tank_short']='Реакція';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/добу';
$ec_lang['lpn_reaction_day']='доба';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Порядок реакції в товщі води';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='Показник степеня, до якого підноситься концентрація для реакції в товщі води. Дозволено будь-яке дійсне число. 1 — стандартне значення, яке використовують для більшості моделей розпаду хлору. 0 робить швидкість реакції незалежною від кількості хімічної речовини.';
$ec_lang['lpn_reaction_order_tank']='Порядок реакції в ємності';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='Показник степеня, до якого підноситься концентрація для реакції у воді, що міститься в ємності, окремо від порядку реакції в товщі води, тож ємність може реагувати за іншим порядком, ніж труби. Допускається будь-яке дійсне число, типове значення — 1. EPANET записує його як ORDER TANK у файлі й не має для нього поля введення в інтерфейсі EPANET.';
$ec_lang['lpn_reaction_order_wall']='Порядок реакції на стінці';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 означає, що реакція на стінці відбувається згідно із заданим коефіцієнтом (коефіцієнтами). 0 означає, що вона не відбувається. Це перемикач «увімкнено-вимкнено». Стандартне значення — 1.';
$ec_lang['lpn_reaction_order_unstated']='Не задано';
$ec_lang['lpn_reaction_order_zero']='0, нульовий порядок';
$ec_lang['lpn_reaction_order_first']='1, перший порядок';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Гранична концентрація';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Концентрація, до якої прямує хімічна речовина, замість того щоб розпадатися до нуля або зростати необмежено. Реакція сповільнюється в міру наближення води до цього значення й зупиняється на ньому. Використовуйте узгоджені одиниці. Порожнє поле означає відсутність межі.';
$ec_lang['lpn_reaction_rough_corr']='Кореляція із шорсткістю';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Коефіцієнт, що пов’язує коефіцієнт реакції на стінці з шорсткістю кожної труби, тож шорсткіша труба реагує швидше. Коли його задано, коефіцієнт стінки обчислюється для кожної труби за її шорсткістю, а єдиний коефіцієнт стінки вище не використовується. Якщо поле порожнє, не використовується.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Ця сторінка не пропонує власного коефіцієнта реакції. Стандартного методу випробування для нього немає, а опубліковані польові значення для одного й того самого виду води відрізняються в десять разів, тож будь-яке число тут сприймали б як рекомендацію. Введіть значення, яке ви виміряли або можете підтвердити джерелом, або залиште поля порожніми для хімічної речовини, яка не реагує.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Енергія';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Звіти';
// Edited by TGH 2026-09-07
// Row label only (the box title is lpn_time_run_report). Tom, 2026-10-07: no row carries '(EPANET)';
// the tips say where a report comes from. Run is EPANET's verbatim report.
$ec_lang['lpn_reports_epanet']='Розрахунок';
$ec_lang['lpn_energy_title']='Енергія насосів: звіт';
$ec_lang['lpn_energy_menu']='Енергія насосів';
$ec_lang['lpn_energy_efficiency']='Ефективність насоса (у %)';
$ec_lang['lpn_energy_efficiency_tip']='Повний ККД (від мережі до води), який застосовується до кожного насоса без кривої ККД. EPANET використовує 75 відсотків, якщо значення не задано.';
$ec_lang['lpn_energy_price']='Ціна електроенергії';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Вартість однієї кіловат-години. Застосовується до кожного насоса без окремої ціни. Порожнє поле означає 0.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Вартість однієї кіловат-години для цього насоса. Порожнє поле означає використання ціни, заданої для всієї мережі в Налаштування, Енергія.';
$ec_lang['lpn_energy_price_pattern']='Графік ціни';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Графік, який множить ціну на кожному кроці графіка, — так задають нічний тариф. Залиште поле порожнім для однієї ціни протягом усього розрахунку.';
$ec_lang['lpn_energy_demand_charge']='Плата за пікове навантаження';
$ec_lang['lpn_energy_demand_charge_tip']='За кВт, за пікове навантаження, яке вимагають насоси';
$ec_lang['lpn_energy_currency']='Валюта';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Текст, що друкується поряд із кожним значенням вартості. Це лише напис; використовуйте одну валюту скрізь.';
$ec_lang['lpn_energy_kwh']='кВт·год';
$ec_lang['lpn_energy_kw']='кВт';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Ця сторінка не пропонує власної ціни. Вартість електроенергії залежить від постачальника, країни, години доби й року, тож будь-яке число тут сприймали б як рекомендацію. Введіть ціну з вашого власного тарифу.';
$ec_lang['lpn_energy_needs_run']='Енергія насосів — це потужність, проінтегрована за час розрахунку, тож потрібен розрахунок за розширений період: розв\'язувач EPANET і загальний час розрахунку. Задайте «Загальний час роботи» в «Налаштування, Розрахунок, Час», натисніть кнопку «Розрахувати», а потім відкрийте «Вода, Звіти, Енергія насосів».';
$ec_lang['lpn_energy_no_pumps']='Ця мережа не має насосів, тож споживати потужність нічому.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Порівняння сценаріїв';
$ec_lang['lpn_scncmp_menu_tip']='Таблиця сценаріїв із кількістю перевизначень, найнижчим тиском і найвищою швидкістю';
$ec_lang['lpn_scncmp_running']='Розрахунок кожного сценарію…';
$ec_lang['lpn_scncmp_empty']='Ще нічого не намальовано, тож нічого розраховувати.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Найвища швидкість';
$ec_lang['lpn_scncmp_at']='{value} у {id}';
$ec_lang['lpn_scncmp_at_time']='{value} у {id}, {time}';
$ec_lang['lpn_scncmp_same']='Однаково в кожному сценарії';
$ec_lang['lpn_scncmp_period_note']='Якщо сценарій має загальний час роботи, його найнижчий тиск і найбільша швидкість — це екстремуми всієї мережі в показаний момент.';
$ec_lang['lpn_scncmp_current']='(відкрито зараз)';
$ec_lang['lpn_scncmp_note']='Кожен сценарій розраховується з копії креслення. Ніщо тут не змінює проєкт, а сценарій, у якому ви працюєте, лишається таким, яким був.';
$ec_lang['lpn_energy_over']='Для розрахунку за розширений період тривалістю {time}';
$ec_lang['lpn_energy_col_pump']='Насос';
$ec_lang['lpn_energy_col_running']='% часу';
$ec_lang['lpn_energy_col_effic']='Ефект.';
$ec_lang['lpn_energy_col_avg_kw']='Серед. кВт';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='Середня потужність, яку споживав цей насос під час роботи. Вона не усереднена за періодами простою, тож насос, який більшу частину розрахунку за розширений період простоював, усе одно показує потужність, яку споживав під час роботи.';
$ec_lang['lpn_energy_col_peak_kw']='Пік. кВт';
$ec_lang['lpn_energy_col_kwh']='кВт·год';
$ec_lang['lpn_energy_col_cost']='Вартість';
$ec_lang['lpn_energy_total_kwh']='Використана енергія';
$ec_lang['lpn_energy_total_energy_cost']='Вартість енергії';
$ec_lang['lpn_energy_peak_kw']='Пікове споживання потужності';
$ec_lang['lpn_energy_total_demand_charge']='Плата за пікове навантаження';
$ec_lang['lpn_energy_total_cost']='Загальна вартість';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW AND THE BOX TITLE BOTH SAY "Status changes"** (Tom, 2026-10-07), so menu and box agree.
$ec_lang['lpn_reports_status']='Зміни стану';
$ec_lang['lpn_reports_status_tip']='Хронологічна таблиця змін стану, зчитаних із часових кроків EPANET останнього розрахунку за розширений період: насоси й клапани, що відкриваються чи закриваються, ємності, що наповнюються, спорожняються, наповнилися чи спорожніли, а також кроки, що не досягли повної збіжності.';
$ec_lang['lpn_status_title']='Зміни стану';
$ec_lang['lpn_status_needs_run']='Звіт про стан перелічує, що змінилося під час розрахунку за розширений період. Задайте Загальний час роботи в Налаштування, Розрахунок, Час, натисніть «Розрахувати», потім відкрийте Вода, Звіти, Зміни стану.';
$ec_lang['lpn_status_empty']='Під час цього розрахунку стан нічого не змінився.';
$ec_lang['lpn_status_col_event']='Подія';
$ec_lang['lpn_status_opened']='{type} {id} тепер відкрито';
$ec_lang['lpn_status_closed']='{type} {id} тепер закрито';
$ec_lang['lpn_status_filling']='{type} {id} тепер наповнюється';
$ec_lang['lpn_status_emptying']='{type} {id} тепер спорожняється';
$ec_lang['lpn_status_full']='{type} {id} тепер повний';
$ec_lang['lpn_status_dry']='{type} {id} тепер порожній';
$ec_lang['lpn_status_no_converge']='Гідравлічний розв’язок на цьому кроці не досяг повної збіжності; показані числа — це його остання ітерація.';
$ec_lang['lpn_status_note']='Зчитано з того самого розрахунку розширеного періоду, що й панель «Таблиці» та «Повний звіт». Перелічено лише зміни, а не кожен крок.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Повний';
$ec_lang['lpn_reports_full_tip']='Таблиця всіх вузлів і зв’язків на кожному звітному часовому кроці останнього розрахунку';
$ec_lang['lpn_full_title']='Повний звіт';
$ec_lang['lpn_full_needs_run']='Повний звіт перелічує кожен вузол і кожен зв’язок на кожному моменті звітування. Натисніть «Розрахувати», а потім відкрийте «Вода, Звіти, Повний звіт».';
$ec_lang['lpn_full_note']='Один рядок на вузол чи зв’язок на кожен момент звітування, в одиницях, показаних на панелі «Таблиці». Порожня клітинка — це стовпець, якого ця величина не має. Завантаження чи друк містить кожен момент часу; таблиця нижче показує лише один за раз.';
$ec_lang['lpn_full_step_label']='Крок часу';
$ec_lang['lpn_full_download_csv']='Завантажити CSV';
$ec_lang['lpn_full_print']='Надрукувати звіт';
$ec_lang['lpn_full_col_time']='Час';
$ec_lang['lpn_full_col_type']='Тип';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='Рядки ({n}).';

// ---- The Calibration report (ROADMAP Task 601) -------------------------------------------------
// EPANET's Report > Calibration and its three tabbed pages, with EPANET's own column names (EPANET
// 2.2 manual, section 9.6). Mean error is EPANET's term for the mean ABSOLUTE difference. "Num obs"
// is EPANET's own column heading, kept short because results columns are narrow.
// lpn_calib_missing: keep in step with feat/profile-file's lpn_profile_file_missing (Task 604), the same sentence.
$ec_lang['lpn_reports_calib']='Калібрування';
$ec_lang['lpn_reports_calib_tip']='Порівнює виміряні польові дані з файлу калібрування з останнім розрахунком: статистика, кореляційний графік і порівняння середніх.';
$ec_lang['lpn_calib_title']='Калібрування: звіт';
$ec_lang['lpn_calib_param']='Параметр';
$ec_lang['lpn_calib_param_tip']='Величина, яку вимірює файл калібрування. Для кожного параметра зберігається один файл.';
$ec_lang['lpn_calib_load']='Завантажити файл калібрування…';
$ec_lang['lpn_calib_load_tip']='Текстовий файл, у кожному рядку якого — ідентифікатор місця, час і виміряне значення. Час відлічується від початку розрахунку, у десяткових годинах або годинах:хвилинах. Крапка з комою починає коментар. Рядок лише з часом і значенням належить до місця над ним.';
$ec_lang['lpn_calib_none']='Для цього параметра не завантажено файлу калібрування.';
$ec_lang['lpn_calib_session']='Файл калібрування зберігається лише на час цього сеансу. Його не збережено разом із проєктом чи на цьому пристрої.';
$ec_lang['lpn_calib_file']='{file}: вимірювання ({n}) у місцях ({m}).';
$ec_lang['lpn_calib_units']='Значення з файлу читаються в одиницях цього проєкту: {unit}.';
$ec_lang['lpn_calib_missing']='Названо у файлі, але немає в цій мережі: {ids}.';
$ec_lang['lpn_calib_missing_count']='Вимірювань пропущено, бо їхнього місця немає в цій мережі: {n}.';
$ec_lang['lpn_calib_bad_lines']='Рядки, які не вдалося прочитати, пропущено: {lines}';
$ec_lang['lpn_calib_outside']='Вимірювань поза часом, про який повідомляв цей розрахунок, пропущено: {n}.';
$ec_lang['lpn_calib_no_value']='Вимірювань без обчисленого значення на їхній момент пропущено: {n}.';
$ec_lang['lpn_calib_single']='Це розрахунок одного періоду, тож кожне вимірювання порівнюється з його єдиним результатом, незалежно від часу у файлі.';
$ec_lang['lpn_calib_needs_run']='Результатів для порівняння ще немає. Звіт заповниться після розрахунку мережі.';
$ec_lang['lpn_calib_no_pairs']='Жодного вимірювання не вдалося порівняти, тож будувати нічого.';
$ec_lang['lpn_calib_tab_stats']='Статистика';
$ec_lang['lpn_calib_tab_corr']='Кореляційний графік';
$ec_lang['lpn_calib_tab_means']='Порівняння середніх';
$ec_lang['lpn_calib_col_location']='Місце';
$ec_lang['lpn_calib_col_n']='К-ть спост.';
$ec_lang['lpn_calib_col_obs_mean']='Спостережене середнє';
$ec_lang['lpn_calib_col_sim_mean']='Обчислене середнє';
$ec_lang['lpn_calib_col_mean_err']='Середня похибка';
$ec_lang['lpn_calib_col_mean_err_tip']='Середнє абсолютних різниць між кожним спостереженим значенням і обчисленим значенням на той самий час.';
$ec_lang['lpn_calib_col_rms_err']='СКП';
$ec_lang['lpn_calib_col_rms_err_tip']='Середньоквадратична похибка: квадратний корінь із середнього квадратів різниць між спостереженими й обчисленими значеннями.';
$ec_lang['lpn_calib_network']='Мережа';
$ec_lang['lpn_calib_corr_means']='Кореляція між середніми: {r}';
$ec_lang['lpn_calib_corr_none']='Кореляція між середніми: потрібно щонайменше два місця з різними середніми.';
$ec_lang['lpn_calib_axis_obs']='Спостережено: {q}';
$ec_lang['lpn_calib_axis_sim']='Обчислено: {q}';
$ec_lang['lpn_calib_observed']='Спостережено';
$ec_lang['lpn_calib_computed']='Обчислено';
$ec_lang['lpn_calib_point']='{id}, {time}: спостережено {o}, обчислено {s}';
$ec_lang['lpn_calib_corr_note']='Кожна точка — одне вимірювання. Чим ближче точки лежать до діагональної лінії, тим ближче обчислені значення до спостережених.';
$ec_lang['lpn_calib_ts_point']='Виміряно в {id}, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='Кільця — це виміряні значення з файлу калібрування.';
$ec_lang['lpn_energy_no_price']='Ціну електроенергії не вказано, тож кожна вартість тут дорівнює нулю. Задайте її в «Налаштування, Енергія».';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Ця мережа задає нульову ціну, тож кожна вартість тут дорівнює нулю. Змініть її в «Налаштування, Енергія».';
$ec_lang['lpn_energy_curve_note']='Ці насоси посилаються на криву ефективності без жодної точки: {ids}. Вони працювали з ефективністю, заданою для всієї мережі.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_drop']='Пропуск';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Вузол і з\'єднання';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Рівні інтервали';
$ec_lang['lpn_color_mode_quantile']='Квантиль (рівна кількість)';
$ec_lang['lpn_color_mode_jenks']='Природні межі (Дженкс)';
$ec_lang['lpn_color_mode_stddev']='Стандартне відхилення';
$ec_lang['lpn_color_mode_pretty']='Округлені';
$ec_lang['lpn_color_mode_log']='Логарифмічна';
$ec_lang['lpn_color_mode_manual']='Вручну';

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
$ec_lang['lpn_library_menu']='Бібліотеки';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Графіки';
// **THE SYNONYMS ARE TOM'S OWN, GIVEN 2026-08-24**, which is the written permission this array
// requires. "Pattern" is the discipline's standard term and stays the label; the payload exists so
// a translator who cannot recover the concept from that one word has the shape of it.
//
// "Run" was on his list and he struck it the same day, on the collision: this page's Run is the
// button that plays an extended-period simulation back, so a translator reaching for their word for
// a program run would have named the wrong thing. Tom: *"Yes. It's not the best term."*
$ec_lang['lpn_library_patterns_tip']='Графік — це список множників, який повторюється. Кожен діє протягом одного кроку часу графіка, тож 24 числа з кроком в одну годину складають добу, яка повторюється. Витрата 10 із множником 1,5 дає 15 у цей момент.';
$ec_lang['lpn_library_curves']='Криві';
$ec_lang['lpn_library_curves_tip']='Напір або ККД насоса залежно від витрати, втрати клапана залежно від витрати, або об’єм ємності залежно від глибини';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Криві прикріплені до насосів і клапанів. Для кривої напору насоса розрахунок використовує криву, проведену через точки, як показано; для решти видів вона з\'єднує точки прямими відрізками, як показано.';
$ec_lang['lpn_library_curve_add']='Додати криву';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Вид кривої';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Формула';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='Крива, проведена через точки, і лінія, намальована на графіку нижче. Вона обчислюється з точок щоразу, коли показується, і ніколи не зберігається, а її числа — в одиницях, які показує таблиця вище. Вбудований розв\'язувач працює за цією формулою; розв\'язувач EPANET читає самі точки.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Виберіть один або два стовпці в електронній таблиці, скопіюйте їх і вставте в першу клітинку, куди хочете їх помістити. Рядки додаються за потреби. Ви також можете вставити рядки, скопійовані прямо з файлу EPANET, разом із назвою кривої.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Опис';
$ec_lang['lpn_library_curve_remove_point']='Видалити цю точку';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Копіювати точки';
$ec_lang['lpn_library_curve_copy_tip']='Копіює кожну точку як два стовпці, готові для вставлення в електронну таблицю.';
$ec_lang['lpn_library_curve_copy_manual']='Копіювати ці точки';
$ec_lang['lpn_library_curve_used_by']='Елементи, що використовують цю криву';
$ec_lang['lpn_library_curve_unused']='Цю криву ніщо не використовує.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Цю криву використовують елементи ({count}): {ids}. Спочатку перенаправте їх на іншу криву, а потім видаліть цю.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Типи труб';
$ec_lang['lpn_library_pipetypes_tip']='Тип труби — це визначення, на яке кілька труб можуть посилатися для свого діаметра, шорсткості та коефіцієнтів реакції. Редагування визначення змінює кожну трубу, яка його використовує.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Кожен проєкт має окрему бібліотеку типів труб. У визначенні типу труби властивості можна залишати порожніми; наприклад, тип труби може задавати шорсткість без діаметра. Типи труб призначаються трубам у властивостях труби. Редагування визначення тут змінює кожну трубу, що на нього посилається.';
$ec_lang['lpn_library_pipetype_add']='Додати тип труби';
$ec_lang['lpn_library_pipetype_blank_tip']='Порожні властивості у визначенні типу труби залишаються для введення окремо для кожної труби.';
$ec_lang['lpn_library_pipetype_used_by']='Труби, що використовують цей тип';
$ec_lang['lpn_library_pipetype_unused']='Цей тип труби ніщо не використовує.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Цей тип труби використовують труби ({count}): {ids}. Спочатку від’єднайте його від них, а потім видаліть.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Тип труби';
$ec_lang['lpn_field_pipetype_tip']='Тип труби з бібліотеки проєкту, який використовує ця труба. Властивості, включені до типу труби, тут недоступні для редагування. Від\'єднайте тип труби, щоб увімкнути редагування тут.';
$ec_lang['lpn_pipetype_none']='Тип труби не вибрано';
$ec_lang['lpn_pipetype_detach']='Від\'єднати від типу труби';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Скопіювати в саму трубу значення, які вона зчитує зі свого типу, і припинити використовувати тип. Значення труби зараз не змінюються, а відтепер ці значення редагуються тут.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Фітинги';
$ec_lang['lpn_library_fittings_tip']='Фітинги з коефіцієнтами місцевих втрат, згруповані в списки';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Кожен проєкт має окрему бібліотеку фітингів. Список фітингів містить фітинги з кількістю кожного й сумується в один коефіцієнт місцевих втрат. На список можуть посилатися і труби, і типи труб.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Фітинги, запропоновані тут, — це ті тринадцять із таблиці 3.3 посібника користувача EPANET 2.2. Вибір одного з них копіює його коефіцієнт у рядок, де його можна змінити. Коефіцієнт залежить від розміру та виробника фітингу, тож сприймайте таблицю як відправну точку, а не як готову відповідь.';
$ec_lang['lpn_library_fittings_add']='Додати список фітингів';
$ec_lang['lpn_library_fittings_used_by']='Труби, що використовують цей список фітингів';
$ec_lang['lpn_library_fittings_unused']='Цей список фітингів ніщо не використовує.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Цей список фітингів використовують труби ({count}): {ids}. Спочатку від’єднайте його від них, а потім видаліть.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Імпортувати бібліотеки…';
$ec_lang['lpn_library_import_tip']='Виберіть інший файл проєкту й скопіюйте з нього цілі бібліотеки в цей проєкт. Усе, чиє ім’я тут уже зайняте, пропускається й перелічується, тож нічого з наявного у вас не змінюється.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Виберіть, що скопіювати з {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Кожну позначену бібліотеку копіюють цілком. Видаліть непотрібне пізніше, так само як видаляєте будь-який інший запис.';
$ec_lang['lpn_library_import_go']='Імпортувати';
$ec_lang['lpn_library_import_no_libraries']='У цьому файлі проєкту немає бібліотек для копіювання.';
$ec_lang['lpn_library_import_heading']='Імпортовано з {file}';
$ec_lang['lpn_library_import_added']='Скопійовано: {names}';
$ec_lang['lpn_library_import_conflict']='Пропущено, бо цей проєкт уже має об’єкт з такою самою назвою: {names}. Тут нічого не змінено. Перейменуйте один із них і імпортуйте знову, якщо хочете мати обидва.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='У цьому файлі проєкту немає нічого з цього для копіювання.';
$ec_lang['lpn_library_import_curve_shape']='Ці криві перенесено точно так, як їх записав файл, і розрахунок не може використати жодну з них, поки її перший стовпець не зростатиме від точки до точки: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Ці типи труб посилаються на список фітингів, якого немає в цьому проєкті: {names}. Імпортуйте бібліотеку фітингів з того самого файлу, щоб усунути ці посилання.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Попередження: невідповідність одиниць. Буде імпортовано як є. Не рекомендується.';
$ec_lang['lpn_library_import_units_line']='{name}: цей проєкт показує {mine}, файл показує {theirs}.';
$ec_lang['lpn_fitting_qty']='Кількість';
$ec_lang['lpn_fitting_name']='Фітинг';
$ec_lang['lpn_fitting_k']='Коефіцієнт';
$ec_lang['lpn_fitting_add']='Додати фітинг';
$ec_lang['lpn_fitting_remove']='Видалити';
$ec_lang['lpn_fitting_total']='Сумарний коефіцієнт місцевих втрат, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Список фітингів';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Список фітингів із бібліотеки проєкту. Його кількості та коефіцієнти підсумовуються в коефіцієнт місцевих втрат цієї труби, і тоді поле коефіцієнта стає доступним лише для читання. Щоб ввести коефіцієнт самостійно, не вибирайте жодного списку.';
$ec_lang['lpn_fittings_none']='Список фітингів не вибрано';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Прохідний вентиль, повністю відкритий';
$ec_lang['lpn_fitting_angle']='Кутовий вентиль, повністю відкритий';
$ec_lang['lpn_fitting_swingcheck']='Поворотний зворотний клапан, повністю відкритий';
$ec_lang['lpn_fitting_gate']='Засувка, повністю відкрита';
$ec_lang['lpn_fitting_elbow_short']='Коліно малого радіуса';
$ec_lang['lpn_fitting_elbow_medium']='Коліно середнього радіуса';
$ec_lang['lpn_fitting_elbow_long']='Коліно великого радіуса';
$ec_lang['lpn_fitting_elbow_45']='Коліно 45°';
$ec_lang['lpn_fitting_return_bend']='Закритий зворотний відвід';
$ec_lang['lpn_fitting_tee_run']='Стандартний трійник, потік по прямій ділянці';
$ec_lang['lpn_fitting_tee_branch']='Стандартний трійник, потік через відгалуження';
$ec_lang['lpn_fitting_entrance']='Гострокутний вхід';
// Tom, 2026-09-30, ruling sprint 2026-09-30-golf item 1: _syn = "All junctions" / "Selected junctions".
$ec_lang['lpn_fitting_exit']='Вихід';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Інший фітинг';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='Збережено {file}';
$ec_lang['lpn_inp_export_flat_lead']='Експортований файл EPANET чисельно еквівалентний цьому проєкту. Але в ньому немає місця для такого:';
$ec_lang['lpn_inp_export_flat_types']='Труби тут ({n}) посилаються на типи труб ({t}). У файлі кожна з цих труб має власну копію чисел, тож результати однакові. Чого файл не може зберегти, так це самого типу труби, тому зв’язок між одним визначенням і кожною трубою, що його використовує, записується лише у файлі проєкту.';
$ec_lang['lpn_inp_export_flat_coords']='Файл EPANET зберігає одне положення для кожного вузла. Цей сценарій розміщує {n} із них в іншому місці, і саме ці положення потрапляють у файл. Положення кожного іншого сценарію зберігаються лише у файлі проєкту.';
$ec_lang['lpn_inp_export_flat_fittings']='Файл EPANET не може зберегти список колін, клапанів і трійників із вашого файлу проєкту. Коефіцієнт місцевих втрат у трубах тут ({n}) підсумовано зі списку фітингів. Сума потрапляє у файл точно такою, якою вона є, тож у відповідях нічого не змінюється.';
$ec_lang['lpn_library_controls']='Керування';
$ec_lang['lpn_library_controls_tip']='Керування — це одне твердження, що відкриває чи закриває зв’язок або змінює його уставку залежно від рівня води в ємності, тиску у вузлі чи часу.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Додати графік';
$ec_lang['lpn_library_pattern_values']='Множники';
$ec_lang['lpn_library_pattern_values_tip']='Множники, розділені пробілами або комами. Вставте стовпець з електронної таблиці, якщо він у вас є. Список повторюється протягом усього розрахунку, тож він не обов\'язково має охоплювати весь розрахунок.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='Множники: {n}, крок {step}, охоплюють {span}';
// Under the pattern graph, beside the clock-time row: the ordinal of each time period (1, 2, 3).
$ec_lang['lpn_library_pattern_axis_step']='Крок';
$ec_lang['lpn_library_pattern_none']='Без графіка';
// The blank first option of a selector whose blank follows a project-wide default (a junction's or
// customer's demand pattern, a pump's price pattern and efficiency curve). Tom, 2026-10-04.
$ec_lang['lpn_choice_default']='Типово';
$ec_lang['lpn_settings_default_pattern']='Графік споживання за замовчуванням';
$ec_lang['lpn_settings_default_pattern_tip']='Кожен вузол без свого графіка використовує цей.';
$ec_lang['lpn_junction_pattern_unknown']='Жоден графік у цьому проєкті не має ID {id}, тож вузол залишено як було.';
$ec_lang['lpn_settings_default_pattern_none']='Немає (стале)';
$ec_lang['lpn_demand_pattern_default']='(типовий: {id})';
$ec_lang['lpn_demand_pattern_constant']='(стале)';
$ec_lang['lpn_library_pattern_default_mark']='(типовий)';
$ec_lang['lpn_library_pattern_default_tip']='Типовий графік споживання. Змініть його в «Налаштування, Графік споживання за замовчуванням».';
$ec_lang['lpn_library_pattern_default_deleted_to']='Графік {id} був типовим графіком споживання. Вузли без графіка тепер використовують графік {now}.';
$ec_lang['lpn_library_pattern_default_deleted_none']='Графік {id} був типовим графіком споживання. Вузли без графіка тепер використовують стале споживання.';
$ec_lang['lpn_library_pattern_default_deleted_also']='Сценарії, які також використовували його як свій графік за замовчуванням: {list}.';
$ec_lang['lpn_library_pattern_default_deleted_in']='Графік {id} був графіком споживання за замовчуванням у цих сценаріях: {list}.';
$ec_lang['lpn_library_control_add']='Додати правило керування';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Однорядкове правило синтаксисом EPANET. Використовуйте узгоджені одиниці проєкту. Ключові слова мають бути англійською. Приклади: LINK 12 CLOSED IF NODE 23 ABOVE 20 (з\'єднання 12 закриється, коли рівень в ємності 23 перевищить 20 футів); LINK 12 OPEN IF NODE 130 BELOW 30 (з\'єднання 12 відкриється, якщо тиск у вузлі 130 впаде нижче 30 psi); LINK PUMP02 1.5 AT TIME 16 (відносну швидкість насоса PUMP02 встановлено на 1,5 на 16-й годині розрахунку); LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM (два правила: з\'єднання 12 щоразу закривається о 10 ранку й відкривається о 20 годині протягом усього розрахунку)';
$ec_lang['lpn_library_control_ok']='✓ Зрозуміло';
$ec_lang['lpn_library_control_bad']='⚠ Не зрозуміло';
$ec_lang['lpn_library_control_missing']='⚠ У цій мережі немає нічого з назвою {id}';
$ec_lang['lpn_library_rules']='Правила';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Правило відкриває чи закриває зв’язок або змінює його уставку, коли рівень води, тиск, витрата чи час досягає заданого значення. Правило може перевіряти кілька умов і вказувати дію на випадок, коли умова хибна.';
$ec_lang['lpn_library_rule_add']='Додати правило';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Одне речення на рядок. Далі йдуть описи з прикладами великими літерами. Рядок 1: назва правила, «RULE 1». Рядок 2: умова, «IF TANK 2 LEVEL BELOW 17.1». Рядок 3: дія, «THEN PUMP 9 STATUS IS OPEN». Рядок 4: пріоритет, «PRIORITY 1». Додайте рядки «AND» або «OR», щоб перевірити більше однієї умови, і рядки «ELSE», щоб указати дію, коли умова хибна. Умова може читати LEVEL, HEAD, GRADE, PRESSURE або DEMAND для вузла, FLOW, STATUS або SETTING для зв’язку, або TIME і CLOCKTIME для SYSTEM. Використовуйте узгоджені одиниці проєкту. Ключові слова мають бути англійською.';
$ec_lang['lpn_library_rule_ok']='✓ Це правило прочитано';
$ec_lang['lpn_library_rule_bad']='⚠ Це правило не вдалося прочитати';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Базова витрата споживання';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Витрата, яку цей вузол відбирає на показаному часовому кроці: кожне базове споживання, помножене на свій графік, і все разом додане. Це результат, а не вхідні дані.';
$ec_lang['lpn_field_demand_pattern']='Графік споживання';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Опис';
$ec_lang['lpn_demand_add']='Додати категорію споживання';
$ec_lang['lpn_demand_remove']='Прибрати це споживання';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Графік напору';
$ec_lang['lpn_field_head_pattern_tip']='Графік рівня води цього резервуара протягом розрахунку. Напір вище множиться на графік.';
$ec_lang['lpn_field_pump_speed']='Відносна швидкість';
$ec_lang['lpn_field_pump_speed_tip']='Відносно швидкості обертання, за якої побудовано опубліковану криву характеристик. Ігнорується (не масштабується), якщо задано графік швидкості.';
$ec_lang['lpn_field_speed_pattern']='Графік швидкості';
$ec_lang['lpn_field_speed_pattern_tip']='Кожен елемент графіка задає відносну швидкість для цієї частини розрахунку, а не масштабує базове значення.';

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
$ec_lang['lpn_search_menu']='Пошук місця за назвою…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Дозвіл запитується під час першого використання, бо запити надсилаються до служби назв місць OpenStreetMap.';
$ec_lang['lpn_search_bar']='Пошук за назвою…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Пошук за назвою місця надсилає введені вами слова на nominatim.openstreetmap.org — безкоштовну службу назв місць фонду OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Це інша служба, ніж зображення карти вулиць позаду вашого проєкту. Зображення повідомляють лише, куди ви дивитеся. Пошук повідомляє, що саме ви ввели. Служба назв місць отримає слова вашого пошуку та вашу IP-адресу. Ми не надсилаємо нічого іншого й не зберігаємо жодного запису ваших пошуків.';
$ec_lang['lpn_search_consent_3']='Чи можемо ми надсилати ваші пошукові запити до служби назв місць?';
$ec_lang['lpn_search_consent_4']='Якщо ви відповісте «ні», усе інше на цій сторінці й далі працюватиме точно так само, включно з Перейти до широти й довготи. Ми запам\'ятовуємо «так», щоб більше не запитувати. «Ні» ніде не зберігається.';
$ec_lang['lpn_search_refused']='Пошук за назвою місця вимкнено, і нічого не надіслано. Команда «Перейти до широти й довготи…» працює й далі.';
$ec_lang['lpn_search_prompt']='Пошук місця за назвою. Місто, вулиця, визначна точка — наприклад: Petaluma, California';
$ec_lang['lpn_search_empty']='Введіть назву місця для пошуку.';
$ec_lang['lpn_search_working']='Пошук…';
$ec_lang['lpn_search_busy']='Пошук уже виконується. Зачекайте на відповідь.';
$ec_lang['lpn_search_choose']='Знайдено більше одного місця. Яке саме?';
$ec_lang['lpn_search_nochoice']='Нічого не обрано, тож карта не пересунулася.';
$ec_lang['lpn_search_badchoice']='Це не одне з чисел у списку.';
$ec_lang['lpn_search_none']='За цією назвою нічого не знайдено.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Служба назв місць обмежила частоту запитів. Зачекайте хвилину й спробуйте ще раз.';
$ec_lang['lpn_search_http']='Служба назв місць відповіла помилкою.';
$ec_lang['lpn_search_timeout']='Служба назв місць не відповіла вчасно. Усе інше на цій сторінці працює без неї.';
$ec_lang['lpn_search_unreadable']='Служба назв місць повернула відповідь, яку ця сторінка не змогла прочитати.';
$ec_lang['lpn_search_offline']='Не вдалося з\'єднатися зі службою назв місць. Можливо, ви офлайн. Усе інше на цій сторінці працює без неї, включно з Перейти до широти й довготи.';
$ec_lang['lpn_search_toofast']='Служба назв місць дозволяє один пошук за секунду. Спробуйте ще раз за мить.';
$ec_lang['lpn_search_nofetch']='Цей браузер не може з\'єднатися зі службою назв місць.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox збирає це з багатьох публічних наборів даних про висоти, тож точність залежить від місцевості. Там, де є національна лідарна зйомка, як-от USGS 3DEP на більшій частині США та її аналоги в інших країнах, вона може бути кращою за 1 м по горизонталі й кілька десятих метра по вертикалі. Там, де є лише глобальні дані, це близько 30 м по горизонталі й кілька метрів по вертикалі. Mapbox не повідомляє, який набір даних застосовано. Сприймайте це як карту ізоліній, а не геодезичну зйомку, і перевіряйте кожне значення, від якого залежить проєкт.';
$ec_lang['lpn_terrain_consent_1']='Заповнення відміток надсилає позицію кожного вузла, якому вона потрібна, — його широту й довготу — на api.mapbox.com, щоб дізнатися висоту землі в цьому місці.';
$ec_lang['lpn_terrain_consent_2']='Це інше питання, ніж зображення карти позаду вашого проєкту. Зображення повідомляють лише, куди ви дивитеся. Ці позиції — це сама ваша мережа. Mapbox отримає ці координати та вашу IP-адресу. Ми не надсилаємо нічого іншого: ні назви, ні труб, ні проєкту. Ми не зберігаємо жодного запису про це, і на цьому пристрої не зберігається нічого, крім вашої відповіді на це запитання.';
$ec_lang['lpn_terrain_consent_3']='Чи можемо ми надіслати позиції ваших вузлів у Mapbox?';
$ec_lang['lpn_terrain_consent_4']='Якщо ви відповісте «ні», усе інше на цій сторінці й далі працюватиме точно так само, і ви зможете вводити відмітки самостійно, як і раніше. Ми запам\'ятовуємо «так», щоб більше не запитувати. «Ні» ніде не зберігається.';
$ec_lang['lpn_terrain_refused']='Відмітки не заповнено, і нічого не надіслано. Ви можете ввести їх самостійно, як і раніше.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Заповнити відмітку {n} вузла(ів) з DEM Mapbox?';
$ec_lang['lpn_terrain_confirm_default_1']='Відмітка вже є в кожного вузла, і {n} із них досі мають значення {v} — це відмітка, з якою починається новий вузол, а не та, яку ви ввели.';
$ec_lang['lpn_terrain_confirm_default_2']='Замінити відмітку цих вузлів ({n}) значеннями з DEM Mapbox?';
$ec_lang['lpn_terrain_keep']='{k} вузлів уже мають відмітку і залишаться незмінними.';
$ec_lang['lpn_terrain_undo']='Одне Скасування (Ctrl-Z) повертає їх усі назад.';
$ec_lang['lpn_terrain_requests']='{n} запит(и) до api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Відмітки вже заповнюються. Зачекайте, поки це завершиться.';
$ec_lang['lpn_terrain_offmap']='Ці позиції вузлів поза картою рельєфу, тож нічого не надіслано.';
$ec_lang['lpn_terrain_too_wide']='Ці вузли розкидані на надто велику частину Землі, щоб прочитати за один раз ({n} запитів тайлів). Нічого не надіслано.';
$ec_lang['lpn_terrain_cancelled']='Нічого не змінено й нічого не надіслано.';
$ec_lang['lpn_terrain_nofetch']='Цей браузер не може з\'єднатися зі службою рельєфу.';
$ec_lang['lpn_terrain_working']='Читання рельєфу місцевості…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Служба рельєфу відхилила запит ({status}), тож жодну відмітку не змінено. Токен Mapbox цього сайту, можливо, не дозволяє вебадресу, на якій ви перебуваєте.';
$ec_lang['lpn_terrain_failed']='Не вдалося з\'єднатися зі службою рельєфу, тож жодну відмітку не змінено. Можливо, ви офлайн. Усе інше на цій сторінці працює без неї.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Служба рельєфу обмежила частоту запитів (429), тож жодної відмітки не змінено. Спробуйте ще раз за хвилину.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Служба рельєфу відповіла помилкою ({status}), тож жодну відмітку не змінено. З вашою мережею все гаразд.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Жоден з цих вузлів не має позиції на Землі, тож нічого не надіслано і жодну відмітку не змінено. Для читання поверхні землі потрібен проєкт у широті й довготі або в проєкції, яку ця сторінка може розмістити.';
$ec_lang['lpn_terrain_done']='Заповнено {n} відміток.';
$ec_lang['lpn_terrain_missed']='{m} не вдалося прочитати, вони й далі порожні.';
$ec_lang['lpn_terrain_partial']='{f} тайлів рельєфу не відповіли.';
$ec_lang['lpn_terrain_will_ids']='Ці вузли отримають відмітку: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Ці вузли: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Ці вузли отримали відмітку: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Ці вузли досі не мають відмітки: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids} і ще {n}';

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
$ec_lang['lpn_analyze_menu']='Аналіз';
$ec_lang['lpn_analyze_menu_tip']='Аналізи, що запускають мережу на копії: витрата на пожежогасіння в кожному вузлі, втрати кожної труби, насоса й клапана та споживання, збільшене чи зменшене в масштабі.';
$ec_lang['lpn_ff_menu']='Аналіз витрати на пожежогасіння…';
$ec_lang['lpn_ff_menu_tip']='Перевірити кожен вибраний вузол на витрату на пожежогасіння й перевірити вплив на решту системи';
$ec_lang['lpn_ff_title']='Витрата на пожежогасіння: аналіз';
$ec_lang['lpn_ff_intro']='Кожен вузол по черзі відбирає витрату на пожежогасіння понад наявне споживання. Розрахунок виконується на копії мережі для часового кроку на екрані, тож у вашому проєкті нічого не змінюється.\n\nВитрату на пожежогасіння зазвичай перевіряють за споживання в добу максимального споживання, тому спершу задайте мережі цей режим.\n\nКожен перевірений вузол потребує близько 16 розрахунків усієї мережі, тож велика система потребує хвилин: виберіть вузли перед запуском і зупиніть у будь-який момент, щоб зберегти часткові результати.';
$ec_lang['lpn_ff_scope']='Вузли для перевірки';
$ec_lang['lpn_ff_all']='Усі вузли';
$ec_lang['lpn_ff_selected']='Вибрані вузли';
$ec_lang['lpn_ff_no_junctions']='У цьому проєкті ще немає вузлів, тож перевіряти нічого.';
$ec_lang['lpn_ff_no_selection']='Жодного вузла не вибрано. Виберіть вузли або оберіть «Усі вузли».';
$ec_lang['lpn_ff_skipped']='{n} вибраних елементів не є вузлами, тож їх не перевірено.';
$ec_lang['lpn_ff_required']='Потрібна витрата на пожежогасіння';
$ec_lang['lpn_ff_required_tip']='Витрата на гідранті, потрібна згідно з чинним протипожежним нормативом або вимогами пожежної служби. Кожен вузол перевіряється за цим значенням, якщо для нього не введено потрібної витрати на пожежогасіння.';
$ec_lang['lpn_ff_required_own']='Вузли з власною потрібною витратою на пожежогасіння перевіряють за нею замість цього. Їх кількість: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Витрата на пожежогасіння, потрібна в цьому вузлі для типу забудови, яку він обслуговує, згідно з чинним протипожежним нормативом або вимогами пожежної служби. Залиште порожнім, щоб перевірити вузол за значенням у полі «Витрата на пожежогасіння: аналіз».';
$ec_lang['lpn_ff_residual']='Залишковий тиск для утримання';
$ec_lang['lpn_ff_residual_tip']='Тиск, який вузол має утримувати, подаючи витрату на пожежогасіння. AWWA M31 і NFPA 291 використовують 20 psi (140 кПа).';
$ec_lang['lpn_ff_design']='Перевірка проєкту (вплив на систему)';
$ec_lang['lpn_ff_design_tip']='Окреме питання від того, чи може вузол подати витрату: коли ця витрата відбирається там, чи не падає тиск в іншому вузлі нижче мінімального і чи не перевищує жодна труба межу швидкості? Ця перевірка не потребує додаткового розрахунку.';
$ec_lang['lpn_ff_design_off']='Немає';
$ec_lang['lpn_ff_design_all']='Усі';
$ec_lang['lpn_ff_design_selected']='Вибрані';
$ec_lang['lpn_ff_design_no_selection']='Перевірку проєкту налаштовано на «Вибрані», але жодного елемента не вибрано. Виберіть елементи або виберіть варіант «Усі».';
$ec_lang['lpn_ff_minpressure']='Найнижчий допустимий тиск деінде';
$ec_lang['lpn_ff_minpressure_tip']='Вузол, тиск у якому падає нижче цього, поки інший вузол відбирає свою витрату на пожежогасіння, повідомляється як проблема проєкту.';
$ec_lang['lpn_ff_maxvelocity']='Найвища допустима швидкість';
$ec_lang['lpn_ff_maxvelocity_tip']='Труба, швидкість у якій перевищує це значення, поки відбирають витрату на пожежогасіння, повідомляється як проблема проєкту.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Тиск моделюється у самому вузлі, як зазвичай. Гідрант, його бокове відгалуження й насадка не моделюються, а тиск на насадці менший, ніж у вузлі.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Використано вбудований розв\'язувач.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Використано розв\'язувач EPANET.';
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
$ec_lang['lpn_ff_run_title']='Розрахунок витрати на пожежогасіння';
$ec_lang['lpn_ff_calculate']='Запустити';
$ec_lang['lpn_ff_stop']='Зупинити';
$ec_lang['lpn_ff_working']='Виконується: {done} з {total} вузлів.';
$ec_lang['lpn_ff_stopped']='Зупинено після {done} з {total} вузлів. Нижче наведено результати для тих, що вже завершено.';
$ec_lang['lpn_ff_cost']='Цей запуск розрахував усю мережу {solves} разів.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Креслення змінилося, тож результати витрати на пожежогасіння очищено. Запустіть знову.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Очистити кільця';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='Вузлів, що пройшли всі перевірки: {clean}. Вузлів, що не пройшли перевірку витрати на пожежогасіння: {fire}. Вузлів, що вплинули на решту системи: {design}.';
$ec_lang['lpn_ff_summary_error']='Вузли, які не вдалося розрахувати ({n}).';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Усі перевірені вузли';
$ec_lang['lpn_ff_col_junction']='Вузол';
$ec_lang['lpn_ff_col_static']='Статичний тиск';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='Тиск у цьому вузлі до відбору будь-якої витрати на пожежогасіння, коли звичайні витрати споживання системи ще працюють. Ніщо не перекривається для його вимірювання, тож це не тиск за нульової витрати для системи; це той самий тиск, який карта показує в цьому вузлі. І AWWA M31, і NFPA 291 називають це значення статичним тиском, і саме з нього починається випробування витрати на пожежогасіння.';
$ec_lang['lpn_ff_col_available']='Доступна витрата';
$ec_lang['lpn_ff_col_required']='Потрібна витрата';
$ec_lang['lpn_ff_col_residual']='Залишковий тиск';
$ec_lang['lpn_ff_col_atrequired']='Тиск при потрібній витраті';
$ec_lang['lpn_ff_col_affected']='Найгірший вплив';
$ec_lang['lpn_ff_col_limit']='Межа проєкту';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Не перевірено';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Статичний тиск не пройшов, тож не перевірено';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Види відмов';
$ec_lang['lpn_ff_mode_fire']='Пожежа';
$ec_lang['lpn_ff_mode_design']='Проєкт';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Немає';
$ec_lang['lpn_ff_col_solves']='Розрахунки';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Тиск і швидкість';
$ec_lang['lpn_ff_atleast']='більше за {flow}';
$ec_lang['lpn_ff_affect_node']='{id} падає до {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} досягає {velocity}';
$ec_lang['lpn_ff_more']='і ще {n} постраждалих';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='Ще {n} вузлів не показано.';
$ec_lang['lpn_ff_rows_more_links']='Зʼєднань не показано: {n}.';
$ec_lang['lpn_ff_design_none']='Коли витрата на пожежогасіння кожного перевіреного вузла відбиралася по черзі, у наборі перевірки проєкту ніщо не вийшло за свої межі.';
$ec_lang['lpn_ff_design_off_note']='Вплив на решту системи в цьому запуску не перевірявся.';
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
$ec_lang['lpn_ff_iso']='Insurance Services Office (ISO) зараховує одному гідранту щонайбільше {flow}. Ця межа тут не застосовується, бо вузол може представляти більше одного гідранта.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Уже нижче за залишковий тиск ще до відбору будь-якої витрати на пожежогасіння';
$ec_lang['lpn_ff_err_converge']='Мережа не збіглася.';
$ec_lang['lpn_ff_err_solve']='Розв\'язувач повідомив про помилку й не дав відповіді.';
$ec_lang['lpn_ff_err_not_junction']='Не вузол';
$ec_lang['lpn_ff_err_unknown']='Немає результату. Код помилки: {code}';

// ---- Water > Criticality analysis (Tom, 2026-09-30) -------------------------------------------
//
// Break each asset in turn, on a copy, and report what the system loses. "Criticality analysis" is
// the industry's term (WaterGEMS, InfoWater); EPANET has no such tool and no word for it. The run
// dialog, Run, Stop, the engine sentence and the cost line are fire flow's own keys.
//
// {n}, {done} and {total} are whole numbers; {pressure} is a pressure with its unit.
$ec_lang['lpn_crit_menu']='Аналіз критичності…';
$ec_lang['lpn_crit_menu_tip']='Вилучити з мережі по черзі кожну трубу, насос і клапан і показати вплив на систему.';
$ec_lang['lpn_crit_title']='Критичність: аналіз';
$ec_lang['lpn_crit_intro']='Кожен елемент по черзі виводиться з мережі, а мережа розв’язується на показаному на екрані часовому кроці в активному сценарії. У проєкті нічого не змінюється; увесь розрахунок виконується на копії.';
$ec_lang['lpn_crit_scope']='Зʼєднання для розриву';
$ec_lang['lpn_crit_scope_tip']='Усі труби, насоси й клапани або лише вибрані на карті. Оберіть набір перед запуском.';
$ec_lang['lpn_crit_scope_all']='Усі зʼєднання';
$ec_lang['lpn_crit_scope_selected']='Вибрані зʼєднання';
$ec_lang['lpn_crit_minpressure']='Найнижчий допустимий тиск';
$ec_lang['lpn_crit_minpressure_tip']='Це те саме число, що й «Найнижчий допустимий тиск» в інших місцях вікна «Витрата на пожежогасіння: аналіз». Зміна тут змінює його й там.';
$ec_lang['lpn_crit_col_asset']='Елемент';
$ec_lang['lpn_crit_col_unserved']='Непокрите споживання';
$ec_lang['lpn_crit_col_cutoff']='Відрізані вузли';
$ec_lang['lpn_crit_col_below']='Вузли нижче мінімуму';
$ec_lang['lpn_crit_summary']='Елементи, що залишають споживання непокритим або опускають вузол нижче {pressure} ({n} із {total}).';
$ec_lang['lpn_crit_baseline_below']='Вузли, які вже нижче нього, коли нічого не зламано: {n}. Їх не враховано.';
$ec_lang['lpn_crit_working']='Виконується: {done} із {total} елементів.';
$ec_lang['lpn_crit_stopped']='Зупинено після {done} із {total} елементів. Результати нижче — ті, що вже завершені.';
$ec_lang['lpn_crit_no_selection']='Жодного зʼєднання не вибрано. Виберіть зʼєднання або оберіть «Усі зʼєднання».';
$ec_lang['lpn_crit_no_links']='У цьому проєкті ще немає зʼєднань, тож розривати нічого.';
$ec_lang['lpn_crit_busy']='Виконується інший аналіз. Зупиніть його або зачекайте, доки він завершиться.';
$ec_lang['lpn_crit_skipped']='Вибраних елементів, що не є зʼєднаннями, і тому не розірваних: {n}.';
$ec_lang['lpn_crit_stale']='Рисунок змінився, тож результати аналізу критичності очищено. Запустіть його знову.';
$ec_lang['lpn_crit_skipdead']='Пропускати тупики';
$ec_lang['lpn_crit_skipdead_tip']='Тупикове зʼєднання — те, чия втрата відрізає вузли, до яких можна дістатися лише через нього, без резервуара чи ємності далі. Його втрата — це все, що за ним, тому його не розв’язують. У підсумку вказано, скільки пропущено.';
$ec_lang['lpn_crit_skipped_dead']='Тупикових зʼєднань пропущено: {n}. Кожне відрізає все, що за ним.';

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
$ec_lang['lpn_ds_menu']='Масштабування споживання…';
$ec_lang['lpn_ds_menu_tip']='Помножити споживання на копії мережі й побачити тиски та швидкості, або знайти найбільший масштаб споживання, який може витримати система.';
$ec_lang['lpn_ds_title']='Масштабування споживання';
$ec_lang['lpn_ds_intro']='Натисніть кнопку «Запустити», щоб помножити споживання у вибраних вузлах на масштаб споживання й побачити тиски та швидкості.\n\nНатисніть кнопку «Знайти», щоб знайти найбільший масштаб споживання з точністю до {step}, за якого всі ці вузли зберігають щонайменше найнижчий допустимий тиск; пошук ведеться від 0 до {max}.\n\nОбидві дії виконуються на копії мережі, розрахованій для часового кроку на екрані в активному сценарії, тож у вашому проєкті нічого не змінюється. Масштабується лише цей часовий крок, а рівні й стани беруться з нього; щоб перевірити пік, перед запуском перемістіть годинник на пікове споживання.';
$ec_lang['lpn_ds_scope']='Вузли для масштабування';
$ec_lang['lpn_ds_scope_all']='Усі вузли';
$ec_lang['lpn_ds_scope_selected']='Вибрані вузли';
$ec_lang['lpn_ds_minpressure']='Найнижчий допустимий тиск';
$ec_lang['lpn_ds_minpressure_tip']='Це те саме число, що й «Найнижчий допустимий тиск» в інших місцях вікна «Витрата на пожежогасіння: аналіз». Зміна тут змінює його й там.';
$ec_lang['lpn_ds_head_scale']='Масштабувати споживання';
$ec_lang['lpn_ds_multiplier']='Масштаб споживання';
$ec_lang['lpn_ds_multiplier_tip']='Коефіцієнт, на який множиться кожне споживання; 1,5 означає збільшення на 50%. Він застосовується додатково до множника споживання активного сценарію, який уже враховано в споживанні, і ніколи не зберігається в проєкті.';
$ec_lang['lpn_ds_run']='Запустити';
$ec_lang['lpn_ds_head_search']='Який масштаб споживання може витримати система?';
$ec_lang['lpn_ds_head_search_selected']='Який масштаб споживання можуть витримати ці вузли?';
$ec_lang['lpn_ds_outside_below']='За масштабу споживання {m} невибрані вузли з тиском нижче {pressure}: {n} ({ids}). Вони не обмежують цю відповідь.';
$ec_lang['lpn_ds_holds_max']='✓ Кожен вузол зберігає {pressure} до масштабу споживання {max}, верхньої межі пошуку.';
$ec_lang['lpn_ds_below_zero']='⚠ Принаймні один вузол має тиск нижче {pressure}, навіть коли масштабоване споживання дорівнює нулю.';
$ec_lang['lpn_ds_found']='✓ Кожен перевірений вузол зберігає щонайменше {pressure} до масштабу споживання {m}.';
$ec_lang['lpn_ds_found_below']='⚠ Споживання, як введено (масштаб споживання 1), залишає принаймні один вузол нижче {pressure}. Найбільший масштаб споживання, за якого кожен вузол зберігає {pressure} або більше, дорівнює {m}.';
$ec_lang['lpn_ds_search_stopped']='Пошук зупинено, не знайшовши відповіді.';
$ec_lang['lpn_ds_lowest_at']='За масштабу споживання {m} найнижчий тиск становить {pressure} у вузлі {id}.';
$ec_lang['lpn_ds_nosolve_at']='За масштабу споживання {m} для мережі не отримано розв’язку. {reason}';
$ec_lang['lpn_ds_scale_ok']='✓ За масштабу споживання {m} кожен вузол зберігає {pressure}.';
$ec_lang['lpn_ds_scale_below']='⚠ За масштабу споживання {m} вузлів з тиском нижче {pressure}: {n}.';
$ec_lang['lpn_ds_scaled_selected']='Вузлів масштабовано й перевірено: {n}.';
$ec_lang['lpn_ds_head_lowest']='Найнижчі тиски';
$ec_lang['lpn_ds_head_velocity']='Найбільші швидкості';
$ec_lang['lpn_ds_col_link']='Зв’язок';
$ec_lang['lpn_ds_col_scaled']='Масштаб.';
$ec_lang['lpn_ds_col_scaled_tip']='Зі споживанням, помноженим на масштаб споживання.';
$ec_lang['lpn_ds_col_unscaled']='Без масшт.';
$ec_lang['lpn_ds_col_unscaled_tip']='Зі споживанням, яке воно має в активному сценарії на цьому часовому кроці, те саме значення, що показує карта.';
$ec_lang['lpn_ds_no_junctions']='У цьому проєкті ще немає вузлів, тож споживання масштабувати нема чого.';
$ec_lang['lpn_ds_no_selection']='Жодного вузла не вибрано. Виберіть вузли або оберіть «Усі вузли».';
$ec_lang['lpn_ds_skipped']='Вибраних елементів, які не є вузлами, залишено без змін: {n}.';
$ec_lang['lpn_ds_bad_multiplier']='Введіть масштаб споживання не менше нуля, наприклад 1,5.';
$ec_lang['lpn_ds_stale']='Креслення змінилося, тож результати масштабування споживання очищено. Запустіть розрахунок знову.';
$ec_lang['lpn_analyze_at_time']='Часовий крок: {time}.';
$ec_lang['lpn_analyze_time_moved']='⚠ Це розраховано на {time}, а годинник тепер показує {now}. Запустіть знову для часового кроку на екрані.';

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
$ec_lang['lpn_file_import_survey']='Імпортувати геодезичні точки…';
$ec_lang['lpn_file_import_survey_tip']='Зчитати список геодезичних точок з текстового файлу й створити один вузол у кожній точці, беручи налаштування нових елементів для всього, чого файл не вказує. Труби не малюються, якщо не поставити позначку «Читати опис як польові коди», і жоден рядок не відкидається, не будучи названим. Використовується система координат, яку цей проєкт уже має, геоприв’язана чи ні.';
// GeoJSON import of Shapes (Task 779). Only points, lines and polygons come in, as Shapes; the
// network is imported from an EPANET file. Every feature not imported is named in the report.
$ec_lang['lpn_file_import_shapes']='Імпортувати фігури GeoJSON…';
$ec_lang['lpn_file_import_shapes_tip']='Зчитати точки, лінії й полігони файлу GeoJSON у цей проєкт як Фігури. Елементи мережі з файлу не імпортуються; імпортуйте мережу з файлу EPANET або через «Імпортувати мережу GeoJSON». Проєкт має бути геоприв’язаним або мати вказану систему координат.';
$ec_lang['lpn_file_import_gjnet']='Імпортувати мережу GeoJSON…';
$ec_lang['lpn_file_import_gjnet_tip']='Відкрити файл GeoJSON як новий проєкт. Точки імпортуються як вузли, резервуари чи ємності, а лінії — як труби. Файл, експортований із цієї сторінки, зчитується як записано; для будь-якого іншого файлу один крок зіставляє його поля з властивостями й одиницями.';
$ec_lang['lpn_gjnet_refuse_crs']='{file} указує систему координат {crs}. Положення в GeoJSON — це широта й довгота WGS 84 (RFC 7946), і ця сторінка не перетворює файл GeoJSON з іншої системи. Експортуйте шар із ГІС в EPSG:4326 (WGS 84), потім імпортуйте цей файл.';
$ec_lang['lpn_gjnet_refuse_empty']='{file} не містить ні точок, ні ліній.';
$ec_lang['lpn_gjnet_target_node_type']='Тип вузла';
$ec_lang['lpn_gjnet_target_custom']='Власна властивість';
$ec_lang['lpn_gjnet_target_skip']='Не імпортувати';
$ec_lang['lpn_gjnet_points_heading']='Поля точок (вузли, резервуари й ємності)';
$ec_lang['lpn_gjnet_lines_heading']='Поля ліній (труби)';
$ec_lang['lpn_gjnet_no_fields']='Ці об’єкти не мають полів атрибутів.';
$ec_lang['lpn_gjnet_col_field']='Поле';
$ec_lang['lpn_gjnet_col_example']='Приклад';
$ec_lang['lpn_gjnet_col_fills']='Заповнює';
$ec_lang['lpn_gjnet_col_unit']='Одиниця';
$ec_lang['lpn_gjnet_beta']='Бета: потрібні відгуки';
$ec_lang['lpn_gjnet_beta_tip']='Цей імпорт випробувано на небагатьох файлах із ГІС-програм. Щоб повідомити про проблему чи запропонувати зміну, клацніть {button} на сторінці й опишіть файл.';
$ec_lang['lpn_gjnet_intro']='Знайдено точок: {points}, ліній: {lines}. Точки імпортуються як вузли, резервуари чи ємності, а лінії — як труби. Виберіть, яку властивість заповнює кожне поле, і одиницю кожного числа.';
$ec_lang['lpn_gjnet_other']='Об’єктів, що не є ні точками, ні лініями: {n}; їх не буде імпортовано, звіт їх перелічує.';
$ec_lang['lpn_gjnet_tolerance']='Допуск з’єднання (м)';
$ec_lang['lpn_gjnet_tolerance_tip']='Кінець лінії в межах цієї відстані від точки або від іншого кінця лінії з’єднується з нею. Кінець лінії, віддалений від кожної точки більше за це, отримує новий вузол.';
$ec_lang['lpn_gjnet_working']='Імпортується {file}…';
$ec_lang['lpn_gjnet_title']='Імпорт мережі GeoJSON: {file}';
$ec_lang['lpn_gjnet_report_lead']='Кожну зміну, зроблену під час імпорту, і кожен неімпортований об’єкт перелічено нижче з причиною:';
$ec_lang['lpn_gjnet_and_more']='і ще {n}';
$ec_lang['lpn_gjnet_note_crs']='Файл указує систему координат {crs}, тобто широту й довготу WGS 84, систему, яку вимагає RFC 7946. Положення зчитано як указано.';
$ec_lang['lpn_gjnet_note_crs_nad83']='Файл указує NAD83 (EPSG:4269). Його положення зчитано як WGS 84, що розміщує їх приблизно в межах 1–2 м від того місця, де їх розміщує NAD83.';
$ec_lang['lpn_gjnet_note_skip_geometry']='Не імпортовано: об’єкт не є ні точкою, ні лінією.';
$ec_lang['lpn_gjnet_note_skip_kind']='Не імпортовано: об’єкт не вказує ні node_type, ні link_type.';
$ec_lang['lpn_gjnet_note_skip_position']='Не імпортовано: положення не є коректною широтою й довготою.';
$ec_lang['lpn_gjnet_note_skip_id']='Не імпортовано: назва не є коректним ID, або її має інший елемент того самого виду.';
$ec_lang['lpn_gjnet_note_skip_no_node']='Не імпортовано: названого початкового чи кінцевого вузла немає у файлі.';
$ec_lang['lpn_gjnet_note_skip_loop']='Не імпортовано: обидва кінці лінії з’єднуються з одним вузлом.';
$ec_lang['lpn_gjnet_note_id_new']='Ці об’єкти не вказують коректного ID, і їм призначено ID, показаний у дужках.';
$ec_lang['lpn_gjnet_note_id_dup']='Ці ID вказано більш ніж в одному об’єкті того самого виду. Кожному пізнішому об’єкту призначено ID, показаний у дужках.';
$ec_lang['lpn_gjnet_note_unmapped_id_point']='Для ID точки не вибрано поля, тому кожному вузлу, імпортованому з точки, призначено ID.';
$ec_lang['lpn_gjnet_note_unmapped_id_line']='Для ID лінії не вибрано поля, тому кожній трубі призначено ID.';
$ec_lang['lpn_gjnet_note_skip_short']='Не імпортовано: лінія потребує щонайменше двох положень.';
$ec_lang['lpn_gjnet_note_elev_taken']='Ці вузли не вказують відмітки. Кожному надано відмітку вузла, показаного в дужках: для вузла, доданого на кінці лінії, — вузла на іншому кінці його труби, інакше — найближчого вузла, який її вказує.';
$ec_lang['lpn_gjnet_note_default_elev_added']='Ці вузли додано на кінцях ліній, і вони мають відмітку за замовчуванням, {value}, бо жоден вузол у файлі не вказує відмітки.';
$ec_lang['lpn_gjnet_note_demand_kept']='Резервуар чи ємність не має споживання, тому споживання, указане на цих вузлах, збережено як власну властивість {key}.';
$ec_lang['lpn_gjnet_note_parts']='Ці багаточастинні лінії мають непов’язані частини й імпортовані як одна труба для кожної частини.';
$ec_lang['lpn_gjnet_note_parts_points']='Ці багатоточкові об’єкти імпортовано як один вузол для кожної точки.';
$ec_lang['lpn_gjnet_note_junction_added']='Ці вузли додано там, де кінець лінії не лежить у межах {tol} від точки. Кожен має базове споживання за замовчуванням.';
$ec_lang['lpn_gjnet_note_end_moved']='Ці труби мають кінець у межах {tol} від точки чи іншого кінця лінії, але не на ньому. Кінець було з’єднано з ним; найбільша відстань — {dist}.';
$ec_lang['lpn_gjnet_note_end_on_pipe']='Ці кінці ліній лежать на трубі, показаній у дужках, але не на її кінці, і не з’єднані з нею.';
$ec_lang['lpn_gjnet_note_z']='Ці точки вказують третю координату, яку не імпортовано.';
$ec_lang['lpn_gjnet_note_default_elev']='Ці вузли не вказують відмітки й мають відмітку за замовчуванням, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_elev']='Для відмітки не вибрано поля, тому кожен вузол має відмітку за замовчуванням, {value}, а автоматичні довжини не враховують різниці відміток.';
$ec_lang['lpn_gjnet_note_default_demand']='Ці вузли не вказують базового споживання й мають базове споживання за замовчуванням, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_demand']='Для базового споживання не вибрано поля, тому кожен вузол має базове споживання за замовчуванням, {value}.';
$ec_lang['lpn_gjnet_note_default_diameter']='Ці труби не вказують діаметра й мають діаметр за замовчуванням, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_diameter']='Для діаметра не вибрано поля, тому кожна труба має діаметр за замовчуванням, {value}.';
$ec_lang['lpn_gjnet_note_default_roughness']='Ці труби не вказують шорсткості й мають шорсткість за замовчуванням, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_roughness']='Для шорсткості не вибрано поля, тому кожна труба має шорсткість за замовчуванням, {value}.';
$ec_lang['lpn_gjnet_note_default_k']='Ці труби не вказують коефіцієнта місцевих втрат, тому кожна має 0, як у файлі EPANET, що його не вказує.';
$ec_lang['lpn_gjnet_note_unmapped_k']='Для коефіцієнта місцевих втрат не вибрано поля, тому кожна труба має 0, як у файлі EPANET, що його не вказує.';
$ec_lang['lpn_gjnet_note_default_tank']='Ці ємності мають глибини води й діаметр ємності за замовчуванням.';
$ec_lang['lpn_gjnet_note_length_auto']='Ці труби не вказують довжини. Кожну довжину обчислено за лінією (Авто).';
$ec_lang['lpn_gjnet_note_unmapped_length']='Для довжини не вибрано поля, тому довжину кожної труби обчислено за лінією (Авто).';
$ec_lang['lpn_gjnet_note_value_unread']='Ці значення не є числами або не розпізнані й не використані.';
$ec_lang['lpn_gjnet_note_field_skipped']='Ці поля не імпортовано, як і було вибрано.';
$ec_lang['lpn_gjnet_note_field_custom']='Ці поля імпортовано як власні властивості.';
$ec_lang['lpn_gjnet_note_results']='Результати з файлу не імпортовано. «Розрахувати» обчислює їх знову.';
$ec_lang['lpn_gjnet_note_demand_rows']='Ці вузли мали більше ніж один рядок споживання. Файл GeoJSON містить лише перший, який і було імпортовано.';
$ec_lang['lpn_gjnet_note_pipe_type']='Ці труби вказують тип труби, показаний у дужках, визначення якого файл GeoJSON не містить. Тип труби не імпортовано; діаметр і шорсткість, указані у файлі, імпортовано.';
$ec_lang['lpn_gjnet_note_pattern_conflict']='Ці графіки задано різними множниками в різних об’єктах. Використано перший.';
$ec_lang['lpn_gjnet_note_end_off_node']='Лінія кожного з цих з’єднань не починається й не закінчується у своєму вузлі. Використано положення вузла.';
$ec_lang['lpn_gjnet_note_not_held']='Файл GeoJSON не містить керувань, правил, налаштувань часу, текстових підписів, параметрів EPANET, а також бібліотек типів труб, фітингів і кривих ефективності, тому нічого з цього не імпортовано.';
$ec_lang['lpn_geojson_import_done']='Імпортовано Фігур: {n}, з {file}.';
$ec_lang['lpn_geojson_import_done_one']='Імпортовано одну Фігуру з {file}.';
$ec_lang['lpn_geojson_import_renamed']='Назви об’єктів ({n}) не можна використати як ідентифікатори Фігур. Кожній Фігурі надано інший ідентифікатор, а назва об’єкта збережена: {list}.';
$ec_lang['lpn_geojson_import_renamed_one']='Одну назву об’єкта не можна використати як ідентифікатор Фігури. Фігурі надано інший ідентифікатор, а назва об’єкта збережена: {list}.';
$ec_lang['lpn_geojson_import_skipped']='Не імпортовано об’єктів: {n}: {list}.';
$ec_lang['lpn_geojson_import_skipped_one']='Не імпортовано один об’єкт: {list}.';
$ec_lang['lpn_geojson_import_why_network']='елемент мережі';
$ec_lang['lpn_geojson_import_why_geometry']='не точка, не лінія і не полігон';
$ec_lang['lpn_geojson_import_why_position']='позиція не є дійсною широтою й довготою';
$ec_lang['lpn_geojson_import_holes']='Не імпортовано отворів у полігонах: {n}. Фігура має одну межу.';
$ec_lang['lpn_geojson_import_holes_one']='Не імпортовано один отвір у полігоні. Фігура має одну межу.';
$ec_lang['lpn_geojson_import_parts']='Складених об’єктів, імпортованих як одна Фігура для кожної частини: {n}.';
$ec_lang['lpn_geojson_import_parts_one']='Один складений об’єкт імпортовано як одну Фігуру для кожної частини.';
$ec_lang['lpn_geojson_import_local']='Позиції GeoJSON задано широтою й довготою, а цей проєкт не має місця на Землі, до якого їх можна перетворити. Спершу геоприв’яжіть його через Карта, Карта світу, Приєднати, потім імпортуйте знову.';
$ec_lang['lpn_geojson_import_unreadable']='{file} не є файлом GeoJSON: {detail}';
$ec_lang['lpn_file_import_dxf']='Імпортувати фігури DXF…';
$ec_lang['lpn_file_import_dxf_tip']='Зчитати точки, лінії й полілінії файлу ASCII DXF у цей проєкт як Фігури, зберігаючи назву кожного шару як властивість. Інші сутності підраховуються й перелічуються, але не імпортуються. Координати читаються як X і Y цього проєкту без перетворення.';
$ec_lang['lpn_file_import_shp']='Імпортувати фігури шейп-файлу…';
$ec_lang['lpn_file_import_shp_tip']='Зчитати точки, лінії й полігони шейп-файлу ESRI у цей проєкт як Фігури, зберігаючи стовпці атрибутів як властивості. Виберіть або .zip, або .shp разом із .shx, .dbf і .prj (утримуйте Ctrl або Shift, щоб вибрати кілька). Координати в системі, відмінній від системи проєкту, перетворюються, про що сповіщає повідомлення.';
$ec_lang['lpn_dxf_import_skipped']='Не імпортовано сутностей: {n}: {list}.';
$ec_lang['lpn_dxf_import_skipped_one']='Не імпортовано одну сутність: {list}.';
$ec_lang['lpn_dxf_import_inblocks']='у визначеннях блоків';
$ec_lang['lpn_dxf_import_bulge']='Поліліній із дуговими сегментами: {n}; їх імпортовано як прямі сегменти між вершинами.';
$ec_lang['lpn_dxf_import_bulge_one']='Одна полілінія має дугові сегменти, які імпортовано як прямі сегменти між її вершинами.';
$ec_lang['lpn_dxf_import_units']='Креслення вказує одиниці як {theirs}, а цей проєкт використовує {ours}. Числа не змінено.';
$ec_lang['lpn_dxf_import_refuse_geo']='Креслення DXF є плоским, а цей проєкт задано в широті й довготі, тому координати {file} не мають у ньому місця. Скористайтеся командою «Перетворити як…», щоб скопіювати проєкт у систему координат, потім імпортуйте знову.';
$ec_lang['lpn_dxf_import_unreadable']='{file} не є файлом ASCII DXF.';
$ec_lang['lpn_dxf_import_binary']='{file} є двійковим DXF. Збережіть його у своїй програмі CAD як ASCII DXF, потім імпортуйте знову.';
$ec_lang['lpn_shapes_import_frame']='Координати прочитано як {frame} без перетворення.';
$ec_lang['lpn_shapes_frame_xy']='X і Y цього проєкту';
$ec_lang['lpn_shapes_frame_latlon']='широта й довгота';
$ec_lang['lpn_shp_import_skipped']='Не імпортовано записів, бо їхній тип фігури не читається: {n}: {list}.';
$ec_lang['lpn_shp_import_skipped_one']='Не імпортовано один запис, бо його тип фігури не читається: {list}.';
$ec_lang['lpn_shp_import_attrs']='Стовпці атрибутів, збережені як властивості кожної Фігури: {list}.';
$ec_lang['lpn_shp_import_noprj']='Файлу .prj немає, тому координати прочитано як {frame} без перетворення.';
$ec_lang['lpn_shp_import_prj_same']='Файл .prj вказує {crs}, систему координат цього проєкту, тому координати не змінено.';
$ec_lang['lpn_shp_import_converted']='Координати задано широтою й довготою. Їх перетворено в {crs} тим самим перетворенням, яке використовує карта.';
$ec_lang['lpn_shp_import_prj_other']='Файл .prj вказує {theirs}. Цей проєкт не має вказаної системи координат, тому координати прочитано як {frame} без перетворення.';
$ec_lang['lpn_shp_import_refuse_local']='{file} задано в широті й довготі, а цей проєкт не має місця на Землі, до якого їх можна перетворити. Спершу геоприв’яжіть його через Карта, Карта світу, Приєднати, потім імпортуйте знову.';
$ec_lang['lpn_shp_import_refuse_crs']='{file} вказує {theirs}, а цей проєкт задано в {ours}. Нічого не імпортовано й нічого не перетворено.';
$ec_lang['lpn_shp_import_refuse_range']='{file} не має файлу .prj, а його координати не є широтою й довготою, тому їх не можна розмістити в цьому проєкті.';
$ec_lang['lpn_shp_import_noshp']='{file} не містить файлу .shp. Виберіть або .zip шейп-файлу, або .shp разом із .shx, .dbf і .prj (утримуйте Ctrl або Shift, щоб вибрати кілька).';
$ec_lang['lpn_shp_import_manyshp']='{file} містить більше одного шейп-файлу. Імпортуйте по одному.';
$ec_lang['lpn_shp_import_unreadable']='{file} не є шейп-файлом, який ця сторінка може прочитати: {detail}';
$ec_lang['lpn_shp_import_pick_hint']='Шейп-файл складається з кількох файлів. Виберіть .shp разом із .shx, .dbf і .prj (утримуйте Ctrl або Shift, щоб вибрати кілька) або виберіть .zip.';
$ec_lang['lpn_shp_import_webmerc_ask']='{file} не має файлу .prj, а його числа не є широтою й довготою, але відповідають метрам Web Mercator (EPSG:3857), системі, яку використовують QGIS і вебкарти. Імпортувати їх як EPSG:3857 і перетворити в систему цього проєкту?';
$ec_lang['lpn_shp_import_webmerc_ok']='Імпортувати як EPSG:3857';
$ec_lang['lpn_shp_import_webmerc_far_ask']='{file} вказує {theirs}, і в цій системі його координати опиняються на відстані {km} км від цього проєкту. Прочитані як метри Web Mercator (EPSG:3857), системи, яку використовують QGIS і вебкарти, вони опиняються там, де цей проєкт. Імпортувати їх як EPSG:3857 і перетворити в систему цього проєкту?';
$ec_lang['lpn_shp_import_reprojected']='Координати перетворено з {theirs} в {ours}.';
$ec_lang['lpn_shp_import_unplaced']='Записів із координатами, яких цей проєкт не може розмістити, як-от широта за межею карти: {n}. Номери записів: {list}.';
$ec_lang['lpn_shp_import_unplaced_one']='Один запис має координати, яких цей проєкт не може розмістити, як-от широта за межею карти. Номер запису: {list}.';
$ec_lang['lpn_shapes_import_none']='З {file} нічого не імпортовано.';
$ec_lang['lpn_shp_import_convert_hint']='Скористайтеся командою «Перетворити як…», щоб скопіювати проєкт у {theirs}, потім імпортуйте знову.';
$ec_lang['lpn_shp_import_damaged']='{file} пошкоджено або обрізано, тому нічого не імпортовано.';
$ec_lang['lpn_shp_import_deleted']='Не імпортовано записів, позначених у .dbf як видалені: {n}.';
$ec_lang['lpn_shp_import_deleted_one']='Один запис, позначений у .dbf як видалений, не імпортовано.';
$ec_lang['lpn_dxf_import_paperspace']='у просторі аркуша';
$ec_lang['lpn_shapes_import_more']='і ще {n}';
$ec_lang['lpn_survey_read_error']='Цей файл не вдалося прочитати з вашого диска.';
$ec_lang['lpn_survey_cancelled']='Нічого не створено і нічого не змінено.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Північна координата';
$ec_lang['lpn_survey_axis_east']='Східна координата';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Цей файл порожній.';
$ec_lang['lpn_survey_err_unreadable']='Цей файл не вдалося прочитати як список геодезичних точок.';
$ec_lang['lpn_survey_err_ambiguous_coord']='У цьому файлі більш ніж один стовпець може бути {axis} ({detail}), і ця сторінка не вибиратиме між ними. Залиште лише один із них названим як {axis} і спробуйте знову.';
$ec_lang['lpn_survey_err_no_points']='Жоден рядок цього файлу не вдалося прочитати як геодезичну точку. Прочитані рядки: {detail}';
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
$ec_lang['lpn_survey_format_label']='Формат файлу:';
$ec_lang['lpn_survey_format_internal']='визначено внутрішньо';
$ec_lang['lpn_survey_create']='Створити вузли';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='Перший рядок пропущено: він не називає жодного стовпця, відомого цій сторінці.';
$ec_lang['lpn_survey_type_label']='Тип елемента:';
$ec_lang['lpn_survey_confirm_junction']='Знайдено вузлів: {n}. Продовжити?';
$ec_lang['lpn_survey_confirm_reservoir']='Знайдено резервуарів: {n}. Продовжити?';
$ec_lang['lpn_survey_confirm_tank']='Знайдено ємностей: {n}. Продовжити?';
$ec_lang['lpn_survey_report_junction']='Імпортовано вузлів: {n}, з відміткою: {m}.';
$ec_lang['lpn_survey_report_reservoir']='Імпортовано резервуарів: {n}, з відміткою: {m}.';
$ec_lang['lpn_survey_report_tank']='Імпортовано ємностей: {n}, з відміткою: {m}.';
$ec_lang['lpn_survey_report_clean']='Усі точки файлу перенесено, і під час імпорту нічого не змінено.';
$ec_lang['lpn_survey_report_notes']='Помилки й примітки імпорту:';
$ec_lang['lpn_survey_sev_error']='помилка';
$ec_lang['lpn_survey_sev_warning']='попередження';
$ec_lang['lpn_survey_note_line']='Рядок {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Замало стовпців для вказаного вище формату файлу.';
$ec_lang['lpn_survey_note_coord_missing']='Клітинка {axis} порожня.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} не читається як число.';
$ec_lang['lpn_survey_note_coord_range']='{axis} виходить за межі діапазону, дозволеного цим проєктом.';
$ec_lang['lpn_survey_note_bad_elev']='Нечислова відмітка. Імпортовано без відмітки.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Більш ніж один стовпець міг бути відміткою, тож жоден з них не прочитано.';
$ec_lang['lpn_survey_note_blank_rows']='Пропущено порожні рядки: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Ім’я вже використано раніше в цьому файлі, призначено нове ім’я.';
$ec_lang['lpn_survey_note_id_taken']='Ім’я вже є в проєкті, призначено нове ім’я.';
$ec_lang['lpn_survey_note_id_invalid']='Це ім’я тут використати не можна, призначено нове ім’я.';
// Field codes (Task 771): the Description read as Carlson-style codes. See dev/survey-codes.md.
$ec_lang['lpn_survey_codes_toggle']='Читати опис як польові коди';
$ec_lang['lpn_survey_codes_tip']='Читати перше слово кожного опису як код із таблиці. Точки з однаковим кодом лінії об’єднуються в одну трубу в порядку файлу, а WL1 і WL2 — окремі лінії. +0 починає лінію, -0 завершує її, а CLO замикає. JPN, за яким іде назва точки, з’єднується з цією точкою (Carlson), а Civil 3D записує це як CPN.';
$ec_lang['lpn_survey_codes_col_code']='Код';
$ec_lang['lpn_survey_codes_col_type']='Тип елемента';
$ec_lang['lpn_survey_codes_add']='Додати код';
$ec_lang['lpn_survey_codes_remove']='Вилучити код';
$ec_lang['lpn_survey_confirm_coded']='Знайдено вузлів: {j}, резервуарів: {r}, ємностей: {t}, труб: {p}. Продовжити?';
$ec_lang['lpn_survey_report_coded']='Імпортовано вузлів: {j}, резервуарів: {r}, ємностей: {t}, труб: {p}, з відміткою: {m}.';
$ec_lang['lpn_survey_note_code_unknown']='Коду немає в таблиці кодів, імпортовано як тип елемента, вибраний вище.';
$ec_lang['lpn_survey_note_code_two_nodes']='Більше одного коду вузла, використано перший.';
$ec_lang['lpn_survey_note_code_unread']='Не кожне слово є кодом, який читає ця сторінка, залишено в описі.';
$ec_lang['lpn_survey_note_vertex_text']='Не кожне слово є кодом, який читає ця сторінка, а вершина не зберігає опису.';
$ec_lang['lpn_survey_note_join_missing']='JPN або CPN називає точку, якої немає в цьому файлі чи проєкті, трубу для неї не накреслено.';
$ec_lang['lpn_survey_note_join_no_line']='JPN або CPN на точці без коду лінії, трубу для неї не накреслено.';
$ec_lang['lpn_survey_note_pipe_one_node']='Ця лінія повертається в той самий вузол без іншого вузла між ними, трубу для неї не накреслено.';
$ec_lang['lpn_survey_note_line_one_point']='Єдина точка на своїй лінії, трубу від неї не накреслено.';
$ec_lang['lpn_survey_note_vertices']='Точки, що стали вершинами труб: {detail}. Вершина не зберігає ні назви, ні відмітки, ні опису.';
$ec_lang['lpn_survey_note_no_desc']='Польові коди ввімкнено, але в цьому файлі немає стовпця опису, тож кодів не прочитано.';
$ec_lang['lpn_survey_note_ring_junction']='Ця точка стала вузлом, щоб кільце могло замкнутися.';
$ec_lang['lpn_survey_note_pipe_zero_length']='Ця точка збігається з попереднім вузлом, тож труба між ними має нульову довжину.';
$ec_lang['lpn_survey_note_node_on_pipe']='Ця точка лежить точно на трубі, до якої не приєднана. Якщо вони з’єднані, додайте JPN, щоб це вказати.';
$ec_lang['lpn_settings_demand_model']='Модель споживання';
$ec_lang['lpn_settings_demand_model_tip']='Виберіть, як вузли отримують витрату. Модель за споживанням (DDA) подає кожне споживання повністю за будь-якого тиску. Модель за тиском (PDA) подає менше за споживання там, де тиск нижчий за потрібний, і її розраховує лише розв’язувач EPANET.';
$ec_lang['lpn_settings_demand_model_dda']='За споживанням';
$ec_lang['lpn_settings_demand_model_pda']='За тиском';
$ec_lang['lpn_settings_min_pressure']='Мінімальний тиск';
$ec_lang['lpn_settings_min_pressure_tip']='Введіть тиск, за якого або нижче якого вузол не отримує витрати. Використовуйте одиницю тиску цього проєкту.';
$ec_lang['lpn_settings_req_pressure']='Потрібний тиск';
$ec_lang['lpn_settings_req_pressure_tip']='Введіть тиск, за якого або вище якого вузол отримує повне споживання. Він має бути більшим за мінімальний тиск. Використовуйте одиницю тиску цього проєкту. Залиште порожнім, щоб узяти типове значення EPANET: у psi для американських одиниць витрати, інакше в метрах.';
$ec_lang['lpn_settings_pressure_exponent']='Показник степеня тиску';
$ec_lang['lpn_settings_pressure_exponent_tip']='Введіть показник степеня кривої, що зростає від нульової витрати за мінімального тиску до повного споживання за потрібного тиску.';
$ec_lang['lpn_engine_pda_route']='Розраховано розв’язувачем EPANET, бо модель споживання задана за тиском.';
$ec_lang['lpn_diag_pda_needs_epanet']='Модель споживання задана за тиском, і її може розрахувати лише розв’язувач EPANET. Розв’язувач EPANET не вдалося завантажити, тож цих результатів немає.';
$ec_lang['lpn_result_delivered_demand']='Подане споживання';
$ec_lang['lpn_result_delivered_demand_tip']='Витрата, яку цей вузол фактично отримує за моделі споживання за тиском. Вона менша за споживання, коли тиск нижчий за потрібний.';
$ec_lang['lpn_result_demand_deficit']='Дефіцит споживання';
$ec_lang['lpn_result_demand_deficit_tip']='Частина споживання в цьому вузлі, яку не подано, бо тиск нижчий за потрібний.';
$ec_lang['lpn_pda_deficit_note']='Вузлів, що отримують менше за своє споживання: {n}.';
$ec_lang['lpn_diag_pda_pressures']='Потрібний тиск має бути більшим за мінімальний тиск. Змініть один із них у Налаштуваннях.';
$ec_lang['lpn_inp_drop_pressure_unit']='Цей файл задає одиницю тиску, відмінну від тієї, яку ця сторінка читає для своєї одиниці витрати: psi для американських одиниць, інакше метри. Кожен тиск у файлі читається саме так, тож перевірте уставки клапанів, емітери та межі за тиском, які він містить. Рядок збережено і записується назад.';

// Map > Screenshot (Tom, 2026-10-05): a snipping tool that re-draws the dragged map area larger than its screen size (3x unless the Screenshot box says otherwise).
$ec_lang['lpn_screenshot_menu']='Знімок екрана';
$ec_lang['lpn_screenshot_tip']='Зробити знімок області карти, яку ви виділите перетягуванням, з вищою роздільною здатністю, ніж на екрані. Позначте на ньому потрібне, потім скопіюйте його у звіт кнопкою «Копіювати». Клацніть без перетягування, щоб зняти всю карту.';
$ec_lang['lpn_screenshot_hint']='Перетягніть прямокутник над картою або клацніть, щоб зняти всю карту. Esc скасовує.';
$ec_lang['lpn_screenshot_copied']='Знімок екрана скопійовано.';
$ec_lang['lpn_screenshot_saved']='Буфер обміну тут недоступний, тож знімок екрана завантажено як файл PNG.';
$ec_lang['lpn_screenshot_no_basemap']='Не вдалося включити карту вулиць або супутниковий знімок.';
$ec_lang['lpn_screenshot_failed']='Не вдалося зробити знімок екрана.';
$ec_lang['lpn_snip_hint_free']='Обведіть область для фрагмента або клацніть, щоб зняти всю карту. Esc скасовує.';
$ec_lang['lpn_snip_tip_rect']='Вирізати прямокутник (S)';
$ec_lang['lpn_snip_tip_free']='Вирізати довільну форму (S)';
$ec_lang['lpn_snip_tip_mode']='Форма фрагмента';
$ec_lang['lpn_snip_tip_map']='Знімок усієї карти';
$ec_lang['lpn_snip_tip_pen']='Перо';
$ec_lang['lpn_snip_tip_eraser']='Гумка: клацніть штрих, щоб видалити його (E)';
$ec_lang['lpn_snip_tip_undo']='Скасувати (Ctrl+Z)';
$ec_lang['lpn_snip_tip_redo']='Повторити (Ctrl+Y)';
$ec_lang['lpn_snip_tip_copy']='Копіювати (Ctrl+C)';
$ec_lang['lpn_screenshot_scale_tip']='Розмір зображення як кратне області на екрані. Більший масштаб дає чіткіше зображення і більший файл.';
