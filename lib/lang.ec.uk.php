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
$ec_lang['consent_body']='Чи можемо ми зберігати одноцифровий cookie-файл у цьому браузері, щоб пам\'ятати, що ми вже врахували цю сторінку? Він не фіксує нічого про вас і нічого з того, що ви вводите. Без нього ми не можемо відрізнити ваше друге відвідування від першого відвідування іншої людини.';
$ec_lang['consent_accept']='Прийняти цей запит';
$ec_lang['consent_accept_all']='Приймати завжди';
$ec_lang['consent_decline']='Відхиляти завжди';
$ec_lang['consent_current_granted']='Ви дозволили це. Ми обмежуємо реєстрацію відвідувань для цього профілю браузера.';
$ec_lang['consent_current_denied']='Ви відхилили це. Ми нічого не зберігаємо, щоб обмежити реєстрацію відвідувань для цього профілю браузера.';
$ec_lang['consent_region_label']='Ваш вибір щодо обмеження реєстрації відвідувань.';
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
$ec_lang['points_data_copy']='Копіювати';
$ec_lang['points_data_paste']='Вставити';
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
$ec_lang['mtc_n_blodgett']='n за розрахунковим розміром каменю (метод Blodgett)';
$ec_lang['mtc_n_bathurst']='n за розрахунковим розміром каменю (метод Bathurst)';
$ec_lang['mtc_n_pi']='n за розрахунковим розміром каменю (метод Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett проти Bathurst';
$ec_lang['mtc_pi_range_check']='Перевірка діапазону P&I';
$ec_lang['mtc_pi_ok']='d50 у діапазоні P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 фута (Phillips & Ingersoll, 1998)';
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
$ec_lang['mtc_iteration_tip']='Виберіть варіант шорсткості (рекомендується Blodgett–Bathurst) та варіант розміру каменю (рекомендується Isbash), щоб автоматично підібрати ітерацією однорідний розмір каменю для потрібної витрати. Повний метод — у примітках нижче; або введіть власне значення шорсткості (перейдіть за посиланням для довідки) й не зважайте на розмір каменю, щоб пропустити ітерацію.';
$ec_lang['mtc_note_1']='<dl><dt>Автоматична ітерація розміру каменю та шорсткості</dt><dd>Виберіть варіант шорсткості (рекомендується Blodgett–Bathurst) та варіант розрахункового розміру каменю (рекомендується Isbash). Підберіть глибину та коефіцієнт запасу розміру каменю для досягнення бажаної витрати з однорідним розміром каменю. Щоразу при зміні вхідного значення калькулятор повторює ці кроки: 1. Шорсткість розраховується за розрахунковим розміром каменю. 2. Результат розрахунку шорсткості копіюється у вхідну шорсткість. 3. Розраховуються витрата русла та необхідний розмір каменю. 4. Розрахунковий розмір каменю коригується. 5. Повторювати до досягнення дуже малої похибки розміру каменю.</dd><dt>Базовий калькулятор (без ітерації)</dt><dd>Введіть бажане значення шорсткості. Поле розрахункового розміру каменю ігноруйте.</dd></dl>';
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
$ec_lang['install_firefox_body']='Якщо ваш браузер не пропонує варіанту встановлення, нічого не втрачено: користуйтеся калькуляторами звичайним способом у браузері, і після першого відвідування сторінки автоматично кешуються для роботи офлайн. Firefox на комп\'ютері — типовий такий випадок.';
$ec_lang['install_cached_heading']='Що зберігається в кеші';
$ec_lang['install_cached_body']='Під час першого встановлення EngCalcs усі сторінки калькуляторів та допоміжні файли (скрипти, стилі) автоматично зберігаються на вашому пристрої. Після цього все працює без інтернет-з’єднання. Обрана мова запам’ятовується з вашого останнього онлайн-візиту.';
$ec_lang['contact_main_menu']='Контакт';
$ec_lang['about_main_title']='Про інженерні калькулятори HawsEDC';
$ec_lang['about_main_desc']='Місія, вільне програмне забезпечення і внесок';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Місія</h3><p>Інженерні Калькулятори HawsEDC безкоштовно доступні онлайн з 2010 року. Вони існують для обслуговування інженерів і польових працівників по всьому світу — особливо тих, хто працює в регіонах з дефіцитом води, обмеженими ресурсами або недостатнім забезпеченням. Ці інструменти є частиною ширшої гуманітарної місії: сказати кожній людині найбільш практичним і дієвим способом, <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">що вона кохана і дорога назавжди, що їй нема чого боятися і що вона не зруйнує все</a>.</p><p>Калькулятори — це засіб. Мета — світ без страждань.</p><h3>Вільна ліцензія з відкритим кодом</h3><p>Весь код опубліковано за <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 or later</a> — вільний у сенсі свободи, а не безкоштовності. Ви можете використовувати, вивчати, змінювати і поширювати код на тих самих умовах.</p><p>Сайт, що його обслуговує, безкоштовний сьогодні й з 2010 року; якщо колись його не стане, програмою все одно можна користуватися самостійно.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Вихідний Код</h3><p>Повний вихідний код публічно доступний на GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Там можна переглядати код, повідомляти про проблеми або зробити форк репозиторію.</p><h3>Внесок</h3><p>Будь-яка допомога вітається. <a href="contact.php">Зв\'яжіться з Tom Haws</a>.</p><ul><li><strong>Переклади:</strong> Запропонуйте кращі формулювання. Покращіть або додайте мову.</li><li><strong>Звіти про помилки:</strong> Скористайтеся формою зворотного зв\'язку на будь-якій сторінці калькулятора або повідомте про проблему на GitHub.</li><li><strong>Нові калькулятори:</strong> Особливо вітаються ідеї гідравлічно-інженерних інструментів для польових працівників і фахівців із зрошення.</li><li><strong>Хостинг:</strong> Якщо ви можете розмістити дзеркало цих калькуляторів для регіону з обмеженим підключенням до інтернету, будь ласка, зв\'яжіться зі мною.</li></ul><h3>Використання без інтернету</h3><p>Відкрийте будь-який калькулятор один раз, поки є інтернет, і всі вони продовжать працювати без нього: браузер зберігає весь набір у процесі роботи. Механізм називається <strong>прогресивний веб-додаток (PWA)</strong>, якщо захочете про нього почитати. Після цього всі калькулятори працюють без інтернету — підключення не потрібне.</p><p>На Android або iOS скористайтеся функцією «Додати на головний екран» у браузері, щоб встановити EngCalcs як додаток на своєму пристрої. На комп\'ютері шукайте значок встановлення в адресному рядку браузера.</p><p>Ви також можете зберегти будь-який окремий калькулятор за допомогою меню «Зберегти як…» у браузері для разового використання без інтернету.</p><h3>Контакт</h3><p>Tom Haws — гідравлічний інженер і автор цих калькуляторів.<br />Скористайтеся формою зворотного зв\'язку на будь-якій сторінці калькулятора або перейдіть до вихідного коду на <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
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
$ec_lang['rc_yn']='<span class="ec-help" title="Підпір (Hp > yn) — це добре: знижує ерозію вище за течією. (USDA)">Нормальна глибина у вхідному каналі, y<sub>n</sub> <span class="ec-tip">?</span></span>';
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
$ec_lang['rc_Hp']='<span class="ec-help" title="Підпір (Hp > yn) — це добре: знижує ерозію вище за течією. (USDA)">Напір на вхідному водозливі, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Перевірка підпору на вході';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — підпір вище за течією';
$ec_lang['rc_pond_ok_tip']='Підпір вище за течією від входу в швидкотік — це добре: він знижує ерозію вище за течією. (USDA)';
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
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Помічено: ця ділянка є сегментом тестової гілки, з якої приходять окремі емітери. Не помічено: ця ділянка є магістраллю, яка передає витрату тільки латеральним, що не входять у тестовий шлях.">Лат. <span class="ec-tip">?</span></span>';
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
$ec_lang['bpn_q_line']='Витрата ділянки';
$ec_lang['bpn_q_line_tip']='Загальна витрата, що проходить через цю ділянку: власна витрата споживання плюс усі витрати споживання нижче за течією, які вона живить.';
$ec_lang['bpn_p_down']='Тиск НТ';
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
$ec_lang['bpn_notes_1_def']='Залиште ID верхньої за течією порожнім, і ділянка слідує за тією, що вище; звичайний послідовний трубопровід. Введіть ID верхньої ділянки, щоб відгалузитися від неї. Отже: послідовно за замовчуванням, дерево — коли потрібно.';
$ec_lang['bpn_notes_2_term']='Лише розгалужені мережі, без кілець';
$ec_lang['bpn_notes_2_def']='Кожна ділянка має рівно одну ділянку вище за течією (дерево). Цей інструмент не розраховує кільцеві мережі; для них потрібні ітераційні методи (EPANET або подібні). Виключення кілець і є тим, що робить розрахунок простим і точним.';
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
$ec_lang['lpn_tool_add_meter_tip']='Клацніть, де перебуває абонент, а потім клацніть трубу або вузол, що його обслуговує. Витрата, яку ви вкажете для абонента, додається до вузла на ближньому кінці цієї труби.';
$ec_lang['lpn_mode_add_meter']='Абонент: клацніть, де перебуває абонент, а потім клацніть трубу або вузол, що його обслуговує. Або натисніть Esc, щоб скасувати.';
$ec_lang['lpn_pane_tab_customers']='Абоненти';
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
$ec_lang['lpn_field_meter_total_tip']='Витрата на одне приєднання, помножена на кількість приєднань. Це число додається до вузла, названого нижче.';
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
$ec_lang['lpn_field_meter_pattern_tip']='Як витрата цього абонента зростає й спадає протягом розрахунку. Він множить загальну витрату, тож діє на кожне приєднання, яке представляє цей абонент. Залиште «Без графіка», щоб використовувався «Графік споживання за замовчуванням» проєкту.';
$ec_lang['lpn_meter_pattern_unknown']='У цьому проєкті немає графіка з іменем {id}, тож абонента залишено як був.';
$ec_lang['lpn_meter_placed']='Абонента {id} додано. Його опис і витрату вводять у таблиці «Абоненти», або натисніть на нього в режимі «Вибрати», щоб відкрити його вікно.';
$ec_lang['lpn_field_meter_pipe_tip']='Елемент, до якого під’єднано це приєднання. Введіть інший тут або в таблиці «Абоненти», щоб змінити його, або перетягніть точку під’єднання на інший елемент.';
$ec_lang['lpn_field_meter_station']='Положення вздовж труби (%)';
$ec_lang['lpn_field_meter_station_tip']='Наскільки далеко вздовж труби під’єднано приєднання, у відсотках труби від її першого вузла до другого. 0 — на одному кінці, 100 — на іншому. Коло на трубі робить те саме вказівником миші.';
$ec_lang['lpn_field_meter_offset']='Зміщення від труби';
$ec_lang['lpn_field_meter_offset_tip']='Додатне значення — праворуч від труби, якщо дивитися від її першого вузла до другого. Введення значення тут може перемістити абонента на інший бік магістралі, і завжди ставить лінію приєднання під прямим кутом до магістралі.';
$ec_lang['lpn_field_meter_lumped']='Додано до вузла';
$ec_lang['lpn_field_meter_lumped_tip']='Найближчий вузол; витрати цього абонента додаються туди.';
$ec_lang['lpn_node_customers']='Витрати абонентів';
$ec_lang['lpn_node_customers_tip']='Список абонентів, доданих до цього вузла (бо він був найближчим). Витрати абонентів додаються до інших витрат, перелічених тут. Абонента редагують там, де він розміщений на карті, або в таблиці «Абоненти».';
$ec_lang['lpn_node_customers_sum']='{total} {unit} від {n} абонентів';
$ec_lang['lpn_customer_detached']='⚠ Цей абонент не під’єднаний до труби, тож його витрата не входить у результати. Видаліть його або намалюйте трубу й перемістіть абонента на неї.';
$ec_lang['lpn_customer_fixed_head']='⚠ На ближньому кінці цієї труби фіксований рівень води, тож ця витрата не впливає на розрахунок.';
$ec_lang['lpn_customer_detached_count']='{n} абонентів не під’єднано до труби. Їхня витрата не врахована.';
$ec_lang['lpn_meter_pick_pipe']='Тепер клацніть трубу або вузол, що обслуговує цього абонента. Абонент залишиться там, де ви його розмістили. Натисніть Escape, щоб скасувати.';
$ec_lang['lpn_inp_export_flat_customers']='Файл EPANET не містить абонентів. Витрата {n} абонентів цього проєкту потрапляє у файл як рядок витрати на вузлі, до якого кожного з них додано, і кожен рядок названо тегом абонента. Файл не може зберегти самого абонента: де він перебуває, яка труба його обслуговує, де вздовж цієї труби під’єднано приєднання і скільки приєднань представляє один абонент. Ваш власний файл проєкту зберігає все це.';

$ec_lang['lpn_area_hint_window_start']='Клацніть по одному куту вікна.';
$ec_lang['lpn_area_hint_window_go']='Клацніть по протилежному куту, щоб завершити.';
$ec_lang['lpn_area_hint_lasso_start']='Клацніть, щоб почати контур.';
$ec_lang['lpn_area_hint_lasso_go']='Рухайте курсор, щоб намалювати контур. Клацніть, щоб завершити.';
$ec_lang['lpn_area_hint_polygon_start']='Клацніть, щоб намалювати область-багатокутник. Двічі клацніть, щоб завершити.';
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
$ec_lang['lpn_pane_pasted']='Вставлено {n} клітинок. {skipped} не змінено.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Вставлено {n} рядків, і {created} з них додано до мережі.';
$ec_lang['lpn_pane_pasted_rows_skipped']='Вставлено {n} рядків, і {created} з них додано до мережі. {skipped} клітинок не змінено.';
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
$ec_lang['lpn_pane_paste_overflow']='У цій вставці {n} рядків, і {fit} з них поміщаються в таблицю. Додати решту {extra} як нові рядки в кінець?';
$ec_lang['lpn_pane_paste_overflow_add']='Додати {extra} рядків';
$ec_lang['lpn_pane_paste_overflow_fit']='Вставити лише {fit}, що поміщаються';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='У цій вставці {n} рядків, і {fit} з них поміщаються в таблицю. Решту {extra} не можна додати як нові рядки: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} ID не збігаються. Усе одно вставити?';
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
$ec_lang['lpn_pane_paste_no_customer_ref']='Рядок {row}: новому Абоненту потрібна під’єднана труба або вузол.';
$ec_lang['lpn_pane_paste_no_pipe']='Рядок {row}: труби {id} ще не існує. Спершу вставте свої труби, потім абонентів.';
$ec_lang['lpn_pane_paste_no_customer_node']='Рядок {row}: вузла {id} ще не існує. Спершу вставте свої вузли, потім абонентів.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Рядок {row}: у вузла {id} немає труби, до якої міг би приєднатися Абонент.';


$ec_lang['lpn_pane_filled']='Заповнено вниз {n} клітинок. {skipped} не змінено.';
$ec_lang['lpn_pane_filldown']='Заповнити вниз';
$ec_lang['lpn_pane_fill_none']='У цьому виборі немає нічого, що можна заповнити вниз.';
$ec_lang['lpn_pane_ctrlenter_filled']='Заповнено {n} клітинок. {skipped} не змінено.';
$ec_lang['lpn_pane_hide_col']='Сховати цей стовпець';
$ec_lang['lpn_pane_hide_cols']='Сховати ці стовпці';
$ec_lang['lpn_pane_show_all_cols']='Показати всі стовпці';
$ec_lang['lpn_pane_sort_asc']='Сортувати за зростанням';
$ec_lang['lpn_pane_manage_cols']='Керувати стовпцями…';
$ec_lang['lpn_pane_manage_cols_title']='Керування стовпцями';
$ec_lang['lpn_pane_manage_cols_show']='Показати';
$ec_lang['lpn_pane_manage_cols_up']='Перемістити вгору';
$ec_lang['lpn_pane_manage_cols_down']='Перемістити вниз';
$ec_lang['lpn_pane_manage_cols_top']='Перемістити на початок';
$ec_lang['lpn_pane_manage_cols_bottom']='Перемістити в кінець';
$ec_lang['lpn_pane_colmenu_tip']='Сховати стовпці або керувати ними';
$ec_lang['lpn_tool_area_window']='Вибрати вікном';
$ec_lang['lpn_tool_area_lasso']='Вибрати ласо';
$ec_lang['lpn_tool_area_polygon']='Вибрати багатокутником';
$ec_lang['lpn_tool_delete']='Видалити';
$ec_lang['lpn_tool_zoom_extent']='Показати все';
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
// It's a technical term. We can only give a definition, which is not our job."). $ec_lang_syn holds
// phrases that could STAND ON THE CONTROL in place of the label; a technical term has no such
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
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
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
$ec_lang['lpn_tank_elev_tip']='Відмітка дна ємності. Глибину води в ємності відлічують угору від цього рівня.';
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
$ec_lang['lpn_tank_head_tip']='Відмітка поверхні води в ємності: відмітка дна ємності плюс глибина води. Це рівень, який розв\'язувач використовує для цієї ємності.';
$ec_lang['lpn_close']='Закрити';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Властивості';
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
$ec_lang['lpn_examples_heading']='Відкрити власну копію прикладу';
$ec_lang['lpn_examples_sub']='Кожен приклад відкривається як ваша власна копія. Змінюйте її, зберігайте або відкрийте нову копію і почніть спочатку.';
$ec_lang['lpn_examples_open']='Відкрити';
$ec_lang['lpn_examples_menu']='Відкрити приклад…';
$ec_lang['lpn_examples_blank']='Або почніть звідси';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='Вузлів: {nodes}, з\'єднань: {links}';
$ec_lang['lpn_examples_failed']='Не вдалося завантажити приклади. Скористайтеся «Файл → Новий проєкт», щоб почати креслення.';
$ec_lang['lpn_examples_loading']='Завантаження прикладів…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Виправити щось';
$ec_lang['lpn_help_notes']='Примітки до цієї сторінки';
$ec_lang['lpn_help_hotkeys']='Таблиці та гарячі клавіші';
$ec_lang['lpn_hotkeys_tables_heading']='Таблиці';
$ec_lang['lpn_hotkeys_map_heading']='Карта';
$ec_lang['lpn_hotkeys_map_term']='Комбінації клавіш карти';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 або Esc</td><td>Вибрати.</td></tr><tr><td>2</td><td>Додати вузол.</td></tr><tr><td>3</td><td>Додати резервуар.</td></tr><tr><td>4</td><td>Додати бак.</td></tr><tr><td>5</td><td>Додати трубу.</td></tr><tr><td>6</td><td>Додати насос.</td></tr><tr><td>7</td><td>Додати клапан.</td></tr><tr><td>8</td><td>Додати споживача.</td></tr><tr><td>9</td><td>Додати текст.</td></tr><tr><td>Delete</td><td>Видалити виділене.</td></tr><tr><td>Ctrl+Z</td><td>Скасувати останню зміну.</td></tr><tr><td>+ або =</td><td>Збільшити.</td></tr><tr><td>-</td><td>Зменшити.</td></tr></tbody></table>';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+літера</td><td>Відкрийте меню з цією літерою, потім натисніть літеру потрібного рядка, щоб обрати його. Літери видно, поки ви користуєтеся клавіатурою. На Mac використовуйте Ctrl+Option.</td></tr><tr><td>F10</td><td>Перейти до рядка меню.</td></tr></tbody></table>';
$ec_lang['lpn_hotkeys_menu_term']='Комбінації клавіш меню';
$ec_lang['lpn_hotkeys_menu_heading']='Меню';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Тут щось не так?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Одне натискання повідомляє нам, що щось на цій сторінці не так. Воно надсилає назву цієї сторінки, мову, якою ви її читаєте, і повідомлення на карті, якщо воно є. Воно не надсилає нічого з того, що ви ввели, жодної адреси і взагалі нічого з вашого креслення. Ніхто не може написати вам у відповідь, бо це не повідомляє нічого про те, хто ви. Скористайтеся «Довідка, Повідомити про проблему», якщо хочете сказати більше.';
$ec_lang['lpn_wrong_thanks']='Дякуємо. Це дійшло до нас.';
$ec_lang['lpn_status_example_opened']='Відкрито «{name}». Це ваша копія: збережіть її через «Файл → Зберегти як».';
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
$ec_lang['lpn_ex_basic_si_desc']='Почніть звідси. Резервуар, насос і невелике кільце — найменше поєднання, яке все ще працює як водопровідна мережа. Літри за секунду, метри та міліметри.';
$ec_lang['lpn_ex_basic_us_title']='Базова мережа, gpm (США)';
$ec_lang['lpn_ex_basic_us_desc']='Та сама початкова мережа в галонах за хвилину, у футах і дюймах.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 із керуванням на основі правил';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Найменша з трьох власних прикладних мереж EPANET: один резервуар, насос і одне кільце.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Розгалужена розподільна система з ємністю, з прикладів EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Великий приклад EPANET: 92 вузли, 3 ємності й 2 резервуари, один із них — річка. Варто відкрити, щоб побачити, як виглядає модель реального розміру на карті.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='Мережа EPANET Net3, перетворена на широту й довготу біля Новато, штат Каліфорнія, з картою світу позаду.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Комерційна ділянка, розрахована на протипожежну витрату понад витрату максимального добового споживання, в один момент часу, накреслена поверх плану ділянки.';
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
$ec_lang['lpn_status_reinterpreted']='{n} значень тепер означають {unit}. Нічого не переписано.';
$ec_lang['lpn_status_converted']='{n} значень переписано в {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
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
$ec_lang['lpn_result_water_age_tip']='Скільки часу вода, що досягла цієї точки, перебуває в мережі. Там, де сходяться потоки, вода, що надходить, несе суміш віків, і число тут — їхнє середнє, зважене за витратою: вузол, який живиться переважно коротким новим магістральним трубопроводом, показує малий вік, навіть якщо його живить і довге тупикове відгалуження. В ємності це середній вік накопиченої води, тому ємність, яка повільно обмінює воду, зазвичай містить найстарішу воду в мережі. Нормативного обмеження для порівняння немає, тож оцінюйте це число за власною мережею.';
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
$ec_lang['lpn_result_head_tip']='Енергія води в цьому вузлі, виражена як висота стовпа води. Це абсолютна висота, тоді як тиск — це показник манометра.';
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
$ec_lang['lpn_settings_restore_tip']='Скидає лише налаштування цього проєкту. Ваше креслення та інші проєкти не змінюються. Щоб зберегти улюблені налаштування для повторного використання, збережіть файл проєкту, що містить лише налаштування.';
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
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Перетворити як';
$ec_lang['lpn_convas_coordsys_tip']='Система координат, у яку перетворюється копія. Якщо вона відрізняється від системи цього проєкту, далі йдуть два кроки розміщення. Проєкт, який уже знає, де він перебуває, відкриває обидва кроки з уже заповненими відповідями, тож ви можете прийняти їх як є або внести зміни.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Поточна: {crs}';
$ec_lang['lpn_convas_epsg']='Система координат EPSG';
$ec_lang['lpn_convas_epsg_tip']='Виберіть систему координат з реєстру EPSG. Широта й довгота — це WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Без назви (локальна) геоприв’язка';
$ec_lang['lpn_convas_unnamed_tip']='Локальні координати в одиниці довжини, з приєднаною картою світу.';
$ec_lang['lpn_convas_none_tip']='Локальні координати в одиниці довжини, поки без карти світу.';
$ec_lang['lpn_convas_units_tip']='Одиниці, у які перетворюється копія. Оригінал зберігає свої власні числа й одиниці.';
$ec_lang['lpn_convas_round']='Округлити перетворені значення';
$ec_lang['lpn_convas_round_tip']='Округлює лише числа, які перезаписує це перетворення, до найближчого кроку, який ви виберете. Значення, одиниця яких не змінюється, залишаються як є.';
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
$ec_lang['lpn_georef_intro']='Розміщення моделі складається з двох кроків. Крок 1 — швидкий: модель лишається нерухомою, а ви пересуваєте карту позаду неї, доки ваша ділянка не опиниться під моделлю приблизно потрібного розміру. Повороту ще немає. Крок 2 — точний: ви перетягуєте, змінюєте розмір і повертаєте саму модель. Спочатку ваш проєкт на карті всього світу, тож знайдіть своє місце, а потім натисніть кнопку «Розмістити модель тут».';
$ec_lang['lpn_georef_adjust']='Модель тепер на землі, тож вона рухається разом із картою. Перетягніть модель, щоб перемістити її, перетягніть кут, щоб змінити розмір, перетягніть круглий маркер над моделлю, щоб повернути її. Або введіть відстань на місцевості та кут повороту нижче.';
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
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Клацайте по карті, як зазначено, щоб вибрати все всередині фігури. Натисніть цю кнопку ще раз, щоб змінити форму між вікном, ласо й багатокутником. Утримуйте Shift під час вибору, щоб продовжити наявний вибір, додаючи або знімаючи (перемикаючи) те, що ви вибираєте.';
$ec_lang['lpn_area_selected']='{n} вибрано.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='У цій області нічого не знайдено.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Додавайте та прибирайте вершини, що формують форму труби на карті. Клацніть на трубі, щоб додати вершину, клацніть на вершині, щоб прибрати її, і перетягніть вершину, щоб перемістити її. Вершина змінює лише намальований шлях труби, а не гідравліку.';
$ec_lang['lpn_tool_undo_tip']='Скасувати останню зміну.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Вписати всю мережу у вікно.';
$ec_lang['lpn_tool_zoom_window_tip']='Клацніть два протилежні кути прямокутника або перетягніть один із них на карті, щоб наблизити цю ділянку. Натисніть цю кнопку ще раз для «Показати все».';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Наблизити. Комбінація клавіш: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Віддалити. Комбінація клавіш: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Знайдіть елемент за його ID або знайдіть усі елементи, що відповідають умові, і змініть їх усі одразу.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Панель інструментів';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Видимість';
$ec_lang['lpn_color_legend_open_tip']='Клацніть, щоб відкрити панель «Видимість» і змінити ці кольори.';
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
$ec_lang['lpn_georef_scale_tip']='Наскільки далеко на місцевості відповідає одна одиниця вашого креслення. Креслення, зроблене на звичайній сітці, зазвичай нічого про це не каже, тож задайте це тут — або дозвольте «Перейти до…» запитати, якою є ширина ділянки, і обчислити це самостійно.';
$ec_lang['lpn_georef_rotation']='Поворот проти годинникової стрілки (градуси)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='На скільки повернути всю модель проти годинникової стрілки, щоб її північ вказувала на північ.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Розмістити модель тут остаточно? Після цього ви й далі зможете перетягувати окремі елементи, але креслення перестане бути xy-проєктом. Щоб повернути xy, закрийте цей проєкт без збереження.';
$ec_lang['lpn_georef_done']='Тепер це проєкт lat/lon. Перетягніть будь-який елемент, щоб перемістити його ближче до його справжнього місця.';
$ec_lang['lpn_georef_backdrop_unrotated']='Фонове зображення перемістилося й змінило розмір разом із моделлю, але його не вдалося повернути. Скористайтеся «Карта, Фонове зображення, Перемістити», щоб вирівняти його.';
$ec_lang['lpn_georef_empty']='Цей файл не містить мережі, тож розміщувати нічого.';
$ec_lang['lpn_georef_unavailable']='Інструмент розміщення не завантажився. Перезавантажте сторінку й спробуйте ще раз.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Завершіть розміщення кнопкою «Залишити це розміщення» або натисніть «Скасувати», перш ніж перемикати проєкти. Розміщення належить цьому проєкту й не може перейти разом із вами до іншого.';
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
$ec_lang['lpn_georef_twopt_tip']='Розмістіть модель точно, якщо ви вже знаєте, де насправді розташовані дві точки на вашому кресленні. Клацніть на одній з них, введіть її широту й довготу, потім зробіть те саме для другої точки. Положення, масштаб і поворот визначаються цими двома точками. Натисніть цю кнопку ще раз, щоб зупинити вибір.';
$ec_lang['lpn_georef_twopt_pick1']='Клацніть на точці свого креслення, чиї широту й довготу ви знаєте.';
$ec_lang['lpn_georef_twopt_pick2']='Тепер клацніть на другій відомій точці, якомога далі від першої.';
$ec_lang['lpn_georef_twopt_same']='Це та сама точка, яку ви обрали першою. Оберіть іншу.';
$ec_lang['lpn_georef_twopt_done']='Тепер модель розташована за двома точками, які ви задали. Перевірте це, потім натисніть «Залишити це розміщення».';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Нижня панель';
$ec_lang['lpn_pane_toggle_tip']='Показати або сховати панель під картою. На ній розміщено профіль і таблицю для кожного виду елементів.';
$ec_lang['lpn_pane_resize']='Перетягніть, щоб зробити панель вищою або нижчою';
$ec_lang['lpn_pane_tab_junctions']='Вузли';
$ec_lang['lpn_pane_tab_reservoirs']='Резервуари';
$ec_lang['lpn_pane_tab_tanks']='Ємності';
$ec_lang['lpn_pane_tab_pipes']='Труби';
$ec_lang['lpn_pane_tab_pumps']='Насоси';
$ec_lang['lpn_pane_tab_valves']='Клапани';
$ec_lang['lpn_pane_tab_tip']='Ця вкладка показує елементи цього виду як таблицю, яку можна сортувати й редагувати. Стовпці результатів редагувати не можна.';
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
$ec_lang['lpn_pane_filter_stale']='Рядків, що більше не відповідають: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Жоден рядок цієї таблиці не відповідає фільтру.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Наблизити й вибрати';
$ec_lang['lpn_goto_on_map']='Показати на карті';
$ec_lang['lpn_pane_select_on_map']='Вибрати на карті';
$ec_lang['lpn_pane_unselect_on_map']='Скасувати вибір на карті';
$ec_lang['lpn_pane_print']='Надрукувати таблицю';
$ec_lang['lpn_pane_print_tip']='Друкує таблицю, яку ви зараз переглядаєте, із назвою проєкту, назвою таблиці та одиницями в заголовках. Рядки друкуються в тому порядку, в якому ви їх відсортували.';

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
$ec_lang['lpn_menu_project']='Вода';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Усе про моделювання водопровідної мережі зібрано тут в одному місці, крім керування відтворенням анімації. Не потрібно вгадувати, де що шукати.';
$ec_lang['lpn_tables_menu']='Таблиці';
$ec_lang['lpn_tables_menu_tip']='Відкриває під картою панель із таблицею елементів цієї мережі. Для кожного виду елемента є своя таблиця, яку можна сортувати та редагувати там же.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Перерахувати цю мережу зараз. Шукаєте кнопку «Розрахувати»? Вона прихована, поки ввімкнено налаштування «Перераховувати автоматично». Щоб повернути кнопку, вимкніть «Перераховувати автоматично» в Налаштуваннях, у розділі Розрахунок, Гідравліка.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Перераховувати автоматично';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Коли це увімкнено, проєкт перераховується невдовзі після кожної внесеної вами зміни, а кнопку Розрахувати прибрано з панелі інструментів, бо їй нема чого робити. Вимкніть це на великій мережі, де очікування перерахунку після кожної зміни заважає вводити дані, і кнопка Розрахувати повернеться, щоб ви самі обирали, коли запускати розрахунок.';
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
$ec_lang['lpn_time_no_report']='Звіту про розрахунок ще немає. Звіт — це текст самого EPANET, тож він з\'являється лише після того, як цю мережу розраховано розв\'язувачем EPANET.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
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
$ec_lang['lpn_confirm_delete_network']='Видалити всі вузли, труби й текстові підписи в цьому проєкті? Фонове зображення, назва проєкту та налаштування збережуться. Це неможливо скасувати.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Знайти й замінити';
$ec_lang['lpn_find_title']='Знайти й замінити';
$ec_lang['lpn_find_scope']='Що шукати';
$ec_lang['lpn_find_scope_all']='Усе';
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
$ec_lang['lpn_find_filter_tip']='Показує лише ті елементи, які відповідають цьому запиту, в одній із таблиць під картою. Креслення не змінюється, і нічого не видаляється.';
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
$ec_lang['lpn_find_count']='Знайдено: {n}. Клацніть, щоб перейти.';
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
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Кожен вузол з\'єднаний.';
$ec_lang['lpn_find_conn_no_fixed']='Ця мережа не має резервуара чи ємності, тож джерела, до якого можна дістатися, немає. Можна шукати лише «без з\'єднань у вузлі» та «без відкритих з\'єднань у вузлі».';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Той самий пошук, записаний одним рядком. Зміна елементів керування переписує цей рядок, а введення в цьому рядку оновлює елементи керування.';
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
$ec_lang['lpn_replace_asked']='Запитано відмітки для {n} вузлів. Результати вже в дорозі.';
$ec_lang['lpn_replace_btn']='Замінити';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Змінити {n} елементів?';
$ec_lang['lpn_replace_apply']='Змінити їх';
$ec_lang['lpn_replace_done']='Змінено {n} елементів. Це можна скасувати одним кроком.';
$ec_lang['lpn_replace_none']='Нічого не зміниться.';
$ec_lang['lpn_replace_no_value']='Введіть нове значення.';
$ec_lang['lpn_replace_scope']='Оберіть вище один вид елементів, щоб змінити на ньому значення.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Профіль';
$ec_lang['lpn_graphs_menu']='Графіки';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_title']='Профіль уздовж шляху';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Клацніть вузол, з якого починається шлях.';
$ec_lang['lpn_profile_draw_more']='Рухайте вказівником по карті, щоб побачити шлях. Клацніть вузол, щоб додати його. Подвійне клацання завершує вибір. Esc скасовує.';
$ec_lang['lpn_profile_draw_blocked']='Немає шляху від {a} до {b}. Оберіть інший вузол.';
$ec_lang['lpn_profile_tap_start']='Торкніться вузла, з якого починається шлях.';
$ec_lang['lpn_profile_tap_more']='Торкніться вузла, щоб побачити шлях. Натисніть і утримуйте, щоб додати його. Подвійний дотик завершує вибір. Натисніть Профіль ще раз, щоб скасувати.';
$ec_lang['lpn_profile_say_idle']='Натисніть Профіль ще раз, щоб обрати новий шлях на карті.';
$ec_lang['lpn_profile_none']='Шляху ще немає. Натисніть Профіль ще раз, щоб обрати його на карті.';
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
$ec_lang['lpn_ts_add']='Додати вибрані';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='На карті не вибрано нічого такого типу.';
$ec_lang['lpn_ts_clear']='Видалити все';
$ec_lang['lpn_ts_chip_tip']='Прибрати {id} з графіка';
$ec_lang['lpn_ts_none']='Поки нічого показувати на графіку. Виберіть елементи на карті й натисніть «Додати вибрані».';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Ще немає результатів розширеного періоду. Натисніть «Розрахувати», щоб виконати розрахунок.';
$ec_lang['lpn_ts_summary']='Елементів: {n}, моментів звітування: {steps}';
$ec_lang['lpn_ts_axis_time']='Час, що минув';
$ec_lang['lpn_freq_menu']='Частота';
$ec_lang['lpn_freq_tip']='Графік частотного розподілу однієї властивості за всіма вузлами або всіма трубами на поточному часовому кроці.';
$ec_lang['lpn_freq_title']='Розподіл значень';
$ec_lang['lpn_freq_none']='Поки немає результатів для цього значення, тому нічого показувати на графіку.';
$ec_lang['lpn_freq_summary']='Показано: {n} із {total}';
$ec_lang['lpn_freq_summary_time']='Показано: {n} із {total}, на {time}';
$ec_lang['lpn_freq_axis_percent']='Відсоток менших';
$ec_lang['lpn_sysflow_consumed_tip']='Сума всіх додатних споживань: вода, яку забирають із мережі у вузлах, і будь-яка витрата в резервуар.';
$ec_lang['lpn_sysflow_consumed']='Спожито';
$ec_lang['lpn_sysflow_produced_tip']='Загальна витрата, що надходить у мережу з резервуарів і від’ємних споживань.';
$ec_lang['lpn_sysflow_produced']='Вироблено';
$ec_lang['lpn_sysflow_tip']='Показує на графіку загальну вироблену й загальну спожиту витрату в часі протягом розрахунку розширеного періоду. Ємності не входять до жодної суми, тож де дві лінії розходяться, ємності наповнюються або спорожняються.';
$ec_lang['lpn_sysflow_menu']='Баланс витрат';
$ec_lang['lpn_contour_consent_4']='Якщо ви відмовитеся, усе інше на цій сторінці працюватиме так само, як зараз, а карта ізоліній малюватиметься лише між вузлами. Згоду ми запам’ятовуємо, щоб не питати знову. Відмова не зберігається взагалі.';
$ec_lang['lpn_contour_consent_3']='Чи можемо ми надіслати до Mapbox номери тайлів території вашої мережі?';
$ec_lang['lpn_contour_consent_2']='Це інше питання, ніж картинки карти за вашим проєктом. Картинки лише показують, куди ви дивитеся. Ці тайли показують, де ваша мережа. Mapbox отримає ці номери тайлів і вашу IP-адресу. Більше ми не надсилаємо нічого: ні назви, ні труб, ні проєкту. Ми нічого не записуємо, і на цьому пристрої не зберігається нічого, крім вашої відповіді на це питання.';
$ec_lang['lpn_contour_consent_1']='Щоб намалювати тиск над поверхнею землі, до api.mapbox.com надсилається територія, яку охоплює ваша мережа, у вигляді номерів тайлів карти Mapbox, щоб зчитати там висоту землі.';
$ec_lang['lpn_contour_dem_failed']='Не вдалося зчитати поверхню землі з Mapbox DEM, тож тиск інтерполюється лише між вузлами.';
$ec_lang['lpn_contour_support_dem']='Між вузлами тиск дорівнює інтерпольованому напору мінус відмітка землі з Mapbox DEM, знята приблизно через кожні {m} м.';
$ec_lang['lpn_contour_dem_tip']='Між вузлами тиск стає інтерпольованим напором мінус висота землі за Mapbox DEM, тому він може бути нижчим за найнижчий тиск у вузлах на пагорбі, де в мережі немає вузла. Сприймайте поверхню землі як карту ізоліній, а не як геодезичну зйомку.';
$ec_lang['lpn_contour_dem']='Поверхня землі між вузлами з Mapbox DEM';
$ec_lang['lpn_contour_too_many']='Забагато ліній рівня при цьому інтервалі; збільште його, щоб їх намалювати.';
$ec_lang['lpn_contour_support_lines']='Лінії рівня через кожні {i} {u}.';
$ec_lang['lpn_contour_support']='Карта ізоліній: {n} вузлів, інтерполяція вздовж {p} труб і до {k} медіанних довжин труби поруч із ними. Без кольору через насоси, клапани й закриті зʼєднання.';
$ec_lang['lpn_contour_few']='Замало вузлів для ізоліній.';
$ec_lang['lpn_contour_buffer_tip']='Як далеко колір сягає від кожної труби, як кратне медіанної довжини труби. Біля краю він згасає.';
$ec_lang['lpn_contour_buffer_unit']='× медіанна довжина труби';
$ec_lang['lpn_contour_buffer']='Буфер';
$ec_lang['lpn_contour_interval']='Інтервал';
$ec_lang['lpn_contour_lines']='Лінії рівня';
$ec_lang['lpn_contour_opacity']='Непрозорість заливки';
$ec_lang['lpn_contour_fill_bands']='Смуги';
$ec_lang['lpn_contour_fill_smooth']='Плавна';
$ec_lang['lpn_contour_fill_tip']='«Плавна» поступово переходить від кольору одного класу до наступного. «Смуги» заливають кожен клас кольорової шкали одним кольором.';
$ec_lang['lpn_contour_fill']='Заливка';
$ec_lang['lpn_contour_plot']='Карта ізоліній';
$ec_lang['lpn_contour_tip']='Показує на карті ізолінії: кольори вузлів розтікаються вздовж труб і поруч із ними, з підписаними лініями рівня. Відкриває вікно, де це можна налаштувати або вимкнути.';
$ec_lang['lpn_contour_menu']='Ізолінії';
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
$ec_lang['lpn_new_coordsys_tip']='Виберіть систему координат вашої мережі. Це постійний вибір; єдиний спосіб перевести мережу в інші координати — «Файл, Відкрити в нових координатах», і це наближено.';
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
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25). Shared by the New project box and Convert as, so
// it names the box's own subject rather than either caller's radio label.
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='Фільтрувати за виглядом карти';
$ec_lang['lpn_crs_view_tip']='Пропонує лише проєкції, що охоплюють місце, куди наразі дивиться карта. Вимкніть, щоб переглянути весь список.';
$ec_lang['lpn_crs_place']='Пошук за назвою місця';
$ec_lang['lpn_crs_place_tip']='Введіть місто, адресу або орієнтир, і вигляд карти переміститься туди. Введені слова надсилаються до служби назв місць OpenStreetMap, яка запитає ваш дозвіл першого разу. Новий географічний проєкт також починається з місця, знайденого тут.';
$ec_lang['lpn_crs_search']='Пошук';
$ec_lang['lpn_crs_name']='Фільтр за назвою проєкції';
$ec_lang['lpn_crs_name_tip']='Показує лише проєкції, назва або код EPSG яких містить введене вами. Спробуйте номер зони, або UTM, або Mercator.';
$ec_lang['lpn_crs_list_tip']='Проєкції, що залишилися після двох фільтрів вище. Виберіть одну й натисніть «Вибрати».';
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
$ec_lang['lpn_new_units_tip']='Проєкт зберігає власні одиниці виміру, тож цей вибір належить лише цьому проєкту, і нічого з нього не зберігається як налаштування браузера. Щоб нові проєкти завжди починалися певним чином, збережіть порожній проєкт як шаблон і щоразу робіть з нього копію.';
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
$ec_lang['lpn_file_import_menu']='Імпорт…';
$ec_lang['lpn_file_import_inp']='Імпортувати файл EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Зчитує мережу з файлу EPANET — текстового файлу .inp або файлу .net, який зберігає EPANET, — і зберігає її в цьому браузері як новий проєкт.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='Експортувати файл EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Записати цю мережу як файл EPANET .inp і завантажити його. Введені вами числа записуються точно так, як ви їх ввели. Усе, що формат .inp не може зберегти, буде перелічено після цього.';
$ec_lang['lpn_status_inp_exported']='Експортовано {file}.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} речей, які формат .inp не може зберегти.';
$ec_lang['lpn_inp_export_refused']='Цей проєкт неможливо записати як файл EPANET: {detail}';
$ec_lang['lpn_inp_bad_file']='Не вдалося прочитати цей файл як файл мережі EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Це схоже на файл EPANET .net, але ця сторінка не змогла його прочитати. Відкрийте його в EPANET і скористайтеся там командою «Файл → Експорт → Мережа», щоб зберегти його як файл .inp, а потім імпортуйте цей файл.';
$ec_lang['lpn_inp_report_heading']='Імпортовано {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} вузлів, резервуарів і ємностей, {links} труб, насосів і клапанів, в одиницях {units}.';
$ec_lang['lpn_inp_report_clean']='Усе з файлу перенесено. Нічого не пропущено.';
$ec_lang['lpn_inp_report_label_anchor']='Текстові підписи розміщено так само, як їх розміщує EPANET, — від верхнього лівого кута.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='Файли EPANET не містять системи координат, тож цей файл спочатку не буде геоприв’язаним. Щоб розмістити його на карті світу, скористайтеся «Карта, Карта світу…». Щоб перетворити його координати, скористайтеся «Файл, Перетворити як…».';
$ec_lang['lpn_inp_report_lead']='Ця сторінка використовує не все, що вміє EPANET, але нічого з вашого файлу не викидається. Нижче — те, що містить ваш файл і що ця сторінка зберігає, не використовуючи, а також те, що змінилося під час читання файлу:';
$ec_lang['lpn_inp_drop_headloss']='Цей файл не використовує формулу Гейзена-Вільямса. Ця сторінка обчислює за Гейзеном-Вільямсом, тому числа шорсткості труб збережено точно як записано, але відповіді тут не збігатимуться з відповідями в EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Ці ємності не мають прямих стінок: файл задає їхню форму кривою. Крива зберігається в «Бібліотеках», ємність і далі посилається на неї, а розрахунок за розширений період наповнює й спорожнює ємність за графіком, який задає ця крива. Для одного моменту часу результат однаковий, бо рівень поверхні води — це те, що задає файл. Діаметр, записаний у файлі, зберігається поряд із кривою, і саме з ним малюється й розраховується ємність без кривої.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Ці дросельні клапани імпортовано як дросельні клапани, що зберігають ті самі втрати, задані у файлі. Їх може розрахувати будь-який з розв\'язувачів.';
$ec_lang['lpn_inp_drop_valve_active']='Ці клапани регулюють тиск або витрату і самостійно відкриваються та закриваються залежно від зміни води. Під час перенесення нічого з них не втрачено, і ця сторінка розраховує їх за допомогою розв\'язувача EPANET, автоматично вмикаючи цей розв\'язувач для цієї мережі.';
$ec_lang['lpn_inp_drop_valve']='Ці клапани описано кривою або фіксованим перепадом тиску, а на цій сторінці немає такого елемента. Вони перенесені як відкриті труби, тому мережа лишається з\'єднаною, але більше ніщо там не керує тиском чи витратою.';
$ec_lang['lpn_inp_drop_cv']='В EPANET ці труби пропускають воду лише в одному напрямку. Вони перенесені як звичайні труби, тож тепер вода може текти в них у будь-якому напрямку.';
$ec_lang['lpn_inp_drop_demands']='У цих вузлів було більше однієї витрати споживання. Витрати підсумовано в одну, яку зберігає ця сторінка.';
$ec_lang['lpn_inp_drop_patterns']='Ця сторінка не зчитала графіки витрати споживання, бо частина, яка виконує розрахунок за розширений період, не завантажилася. Кожна витрата дорівнює числу, записаному у файлі.';
$ec_lang['lpn_inp_drop_demand_pattern']='Ці вузли змінюють свою витрату споживання протягом розрахунку. Їхні графіки перенесено повністю, а витрата, яку ви бачите, — це значення для моменту, який показує годинник.';
$ec_lang['lpn_inp_drop_emitters']='У цих вузлів є коефіцієнт розбризкувача або витоку. Його збережено й враховано в розрахунку, але поки що на цій сторінці немає де його побачити чи змінити.';
$ec_lang['lpn_inp_drop_curve_long']='Ця крива насоса мала більше трьох точок. Збережено її найнижчу, середню й найвищу точки, бо ця сторінка вписує криву щонайбільше в три точки.';
$ec_lang['lpn_inp_drop_curve_missing']='Цей насос посилається на криву, якої немає у файлі. Він перенесений без кривої, тому не додає напору.';
$ec_lang['lpn_inp_drop_pump_other']='Цей насос описано потужністю, яку він споживає, а не кривою. Він перенесений без кривої, тому не додає напору.';
$ec_lang['lpn_inp_drop_head_pattern']='Ці резервуари підіймаються й опускаються протягом розрахунку. Їхні графіки перенесено повністю, а рівень води, який ви бачите, — це значення для моменту, який показує годинник.';
$ec_lang['lpn_inp_drop_pump_speed']='Ці насоси працюють на швидкості, іншій за ту, на якій виміряно їхню криву, або змінюють швидкість протягом розрахунку. Швидкість і її графік перенесено повністю, а напір, який ви бачите, — це значення для моменту, який показує годинник.';
$ec_lang['lpn_inp_drop_setting']='Ці труби, насоси й клапани мають налаштування, яке ця сторінка не підтримує. Вони перенесені у відкритому стані.';
$ec_lang['lpn_inp_drop_rules']='Цей файл містить керування на основі правил. Ця сторінка зчитує їх і використовує. Розрахуйте модель за допомогою розв\'язувача EPANET, і правила буде застосовано, а кожен рівень, тиск і витрату в них переведено в одиниці, які показує цей проєкт. Відкрийте «Правила» в «Бібліотеках», щоб прочитати чи змінити правило. Вони зберігаються точно так, як їх задає файл, і записуються назад, якщо ви збережете файл EPANET.';
$ec_lang['lpn_inp_drop_eps']='Цей файл описує розрахунок за розширений період часу. Частина сторінки, яка виконує такий розрахунок, не завантажилася, тому перенесено лише початкові умови.';
$ec_lang['lpn_inp_drop_quality']='Цей файл описує, як змінюється якість води в дорозі: що спочатку є у воді і як швидко ця речовина реагує в трубах і в ємностях. Ця сторінка зчитує ці числа й використовує їх. Виберіть хімічну речовину в «Налаштування, Розрахунок, Якість води», потім розрахуйте модель за допомогою розв\'язувача EPANET, і концентрація буде обчислена по всій мережі в міру розрахунку. Рядки зберігаються і записуються назад, якщо ви збережете файл EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='Цей файл вказує, де в мережу дозується хімічна речовина і як перемішується вода в ємності. Доза показується на вузлі, де її додано, а ємність вказує, якій моделі перемішування вона підпорядковується. І дозу, і модель перемішування розраховує лише розв\'язувач EPANET.';
$ec_lang['lpn_inp_drop_energy']='Цей файл EPANET містить дані для моделювання вартості перекачування. Ця сторінка зчитує їх і використовує. Розрахуйте модель за допомогою розв\'язувача EPANET, а потім відкрийте «Вода, Звіти, Енергія насосів», щоб побачити, скільки часу працював кожен насос, яку потужність він споживав, скільки енергії витратив і скільки це коштувало. Рядки зберігаються і записуються назад, якщо ви збережете файл EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Цей файл присвоює теги деяким своїм вузлам, трубам чи іншим елементам. Кожен тег перенесено повністю, і він міститься у властивостях свого елемента, де ви можете прочитати його чи змінити.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Цей файл містить власні налаштування EPANET щодо формату звіту, який він друкує. Тут ви можете прочитати звіт розв\'язувача в «Звіти, Розрахунок EPANET», але він виходить у стандартному форматі розв\'язувача, а не в тому, який задають ці налаштування. Рядки зберігаються і записуються назад, якщо ви збережете файл EPANET.';
$ec_lang['lpn_inp_drop_sections']='Цей файл містить розділ, який ця сторінка взагалі не читає. Тут він ніде не використовується. Він зберігається цілим і буде записаний назад, якщо ви збережете файл EPANET.';
$ec_lang['lpn_inp_drop_quality_options']='Цей файл задає параметри якості води EPANET: параметр «Якість», який називає вид аналізу якості води, і два налаштування для хімічної речовини — відносну дифузійність і допуск якості. Усі три зберігаються і всі три використовуються. Вік води, трасування джерела й хімічна речовина обчислюються тут, а обидва хімічні налаштування передаються розв\'язувачу EPANET, коли ви розраховуєте хімічну речовину. Усі вони записуються назад, якщо ви збережете файл EPANET.';
$ec_lang['lpn_inp_drop_file_options']='Цей файл посилається на допоміжний файл: Map, який містить координати, або Hydraulics, який містить уже обчислену гідравліку. Ця сторінка не може відкрити жоден з них, тож ці рядки зберігаються як є і будуть записані назад, якщо ви збережете файл EPANET.';
$ec_lang['lpn_inp_drop_demand_model']='Цей файл вимагає аналізу, керованого тиском (PDA), за якого вузол отримує менше за свою витрату споживання, коли тиск у ньому низький. Ця сторінка розраховує за моделлю, керованою витратою споживання, тож кожен вузол тут отримує саме ту витрату, яку задає файл, незалежно від того, який вийде тиск. Цей рядок зберігається і буде записаний назад, якщо ви збережете файл EPANET.';
$ec_lang['lpn_inp_drop_other_options']='Цей файл задає параметри, які ця сторінка не читає. Тут вони ніде не використовуються. Вони зберігаються і будуть записані назад, якщо ви збережете файл EPANET.';
$ec_lang['lpn_inp_drop_net_options']='Цей файл EPANET .net задає налаштування, для яких на цій сторінці немає елементів керування, тож їхні значення перелічено тут, а не перенесено. Усе інше перенесено. Якщо вони вам потрібні, відкрийте файл в EPANET і скористайтеся «File, Export, Network», щоб зберегти його як файл .inp, а потім імпортуйте цей файл.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Це був файл EPANET .net. Це власний файл проєкту EPANET, він не має опублікованого опису, і ця сторінка читає його, вивівши формат із прикладів файлів, тож користуйтеся ним лише тоді, коли немає іншого варіанту, а не як надійним шляхом. Файл .inp — це задокументований формат, який читають усі інші програми: в EPANET скористайтеся «File, Export, Network», щоб записати такий файл, і імпортуйте його замість цього, коли тільки можете.';
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
$ec_lang['lpn_file_upload_explain']='Цей браузер не може підключитися до файлу, тому відкриття файлу тут — це фактично завантаження: проєкт копіюється в цей браузер, і єдиний спосіб зберегти вашу роботу назад у файл — перезаписати файл через «Файл → Зберегти як».';
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
$ec_lang['lpn_close_browser_confirm']='{name} зберігається лише в цьому браузері. Якщо закрити без збереження у файл, це буде втрачено назавжди.';
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
$ec_lang['lpn_file_changed_elsewhere']='Хтось інший зберіг зміни в цей файл, відколи ви його відкрили, тож збереження зараз перезапише його роботу. Скористайтеся «Файл → Зберегти як», щоб зберегти свої зміни в окремому файлі, або «Файл → Відновити», щоб відкинути свої й завантажити їхню версію.';
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
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Кого нам вказати як того, хто питає? Ваші ініціали — ідеальний варіант. Вони зберігаються разом із блокуванням цього файлу на нашому сервері, для того, хто його відкрив, і видаляються протягом 30 днів.';
$ec_lang['lpn_lock_ask_sent']='Ми попросили того, хто відкрив цей файл, закрити його. Він побачить це протягом хвилини, якщо його сторінка все ще відкрита. Більше нічого не змінилося, і файл усе ще належить йому, доки він його не закриє.';
$ec_lang['lpn_lock_ask_failed']='Ваше повідомлення не вдалося доставити. Або зараз ніхто не має цього файлу відкритим, або не вдалося з’єднатися із сервером.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Цей файл не відкрито, і тут нічого не змінилося. Хтось інший усе ще тримає його відкритим.';
$ec_lang['lpn_copy_opened']='Відкрито {file} як копію з власним новим блокуванням, яке буде збережено під час наступного збереження файлу.';
$ec_lang['lpn_copy_kept_link']='Відкрито {name} як оригінал, переміщений на нове місце. Тепер «Зберегти» записує в цей файл.';
$ec_lang['lpn_copy_copy']='Копія; створити нове блокування';
$ec_lang['lpn_copy_original']='Оригінал; зберегти те саме блокування';
$ec_lang['lpn_copy_body_nodate']='Цей браузер не впізнає цей файл. Це оригінал (зберегти те саме блокування) чи копія (створити нове блокування)?';
$ec_lang['lpn_copy_body']='Цей файл свідчить, що створений {date}, а цей браузер його не впізнає. Це оригінал (зберегти те саме блокування) чи копія (створити нове блокування)?';
$ec_lang['lpn_copy_title']='Позначити файл як нову копію?';
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
$ec_lang['lpn_msglog_note']='Спочатку найновіші. Ця сторінка зберігає останні {n} повідомлень, доки вона відкрита, і нічого не зберігається на вашому комп’ютері.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Лише для читання: {name} має цей файл відкритим. Тут можна змінювати що завгодно, але зберегти не можна. Скористайтеся «Файл → Зберегти як», щоб зберегти в інший файл.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Увага: не вдалося зв\'язатися із сервером, щоб перевірити чи створити блокування цього проєкту, тож ніщо не заважає колезі одночасно редагувати той самий файл. Вас повідомлять, коли блокування запрацює знову.';
$ec_lang['lpn_lock_storage_error']='Увага: цей сайт не може зберігати записи блокувань, тож ніщо не заважає колезі одночасно редагувати той самий файл. Це несправність налаштувань сервера, яку ви не можете виправити тут — папка блокувань недоступна для запису вебсервером.';
$ec_lang['lpn_lock_full_error']='Увага: на цьому сайті закінчилося місце для запису, хто який проєкт відкрив, тож ніщо не заважає колезі одночасно редагувати той самий файл. Це несправність налаштувань сервера, яку ви не можете виправити тут.';
$ec_lang['lpn_lock_not_asked']='Блокування не працює для цього проєкту, тож ніщо не заважає колезі одночасно редагувати той самий файл. Цей проєкт ще не має ідентифікатора, і збереження його у файл надає йому такий.';
$ec_lang['lpn_lock_restored']='Блокування знову працює, і тепер ви можете зберігати в цей файл.';
$ec_lang['lpn_lock_dismiss']='Приховати це повідомлення';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Ваш проєкт буде збережено у файл на цьому комп\'ютері. Він зберігається, коли ви про це просите, і ніколи інакше, тож у цей файл нічого не записується непомітно для вас.';
$ec_lang['lpn_file_training_2']='Щоб дві людини ніколи не редагували один файл одночасно, цей сайт відстежує, у кого він відкритий. Якщо файл уже в когось відкритий, ви все одно можете відкрити його й переглянути або зберегти власну копію.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='Під час першого збереження браузер запитає, чи може цей сайт редагувати файл. Це запитання від браузера, а не від нас, і відповідь «так» дозволяє команді «Зберегти» записувати вашу роботу назад. Зазвичай це запитується лише раз для кожного файлу.';
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
$ec_lang['lpn_notes_1_def']='Цю мережу розраховує розв\'язувач EPANET. Задайте загальний час роботи, і кожен звітний крок розраховується по черзі: ємності наповнюються й спорожняються, витрати споживання йдуть за своїми графіками, а панель інструментів відтворює розрахунок.';
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
$ec_lang['lpn_notes_2_def']='Якість води моделюється: вік води, трасування джерела та речовина, що реагує на стінках труб і в товщі води. Кидок тиску й гідравлічний удар не моделюються: кожна відповідь тут — для води, що вже тече усталено, а не для хвилі тиску при різкому закритті клапана.';
$ec_lang['lpn_notes_3_term']='Збереження проєктів';
$ec_lang['lpn_notes_3_def']='Кожен проєкт — це вкладка, і кожна вкладка зберігається в цьому браузері під час роботи. Очищення даних браузера видаляє їх усі, тож зберігайте свою роботу у файл: «Файл → Зберегти як». Зірочка на вкладці означає, що вона містить зміни, яких немає у файлі. У файл нічого не записується, поки ви цього не попросите. У деяких браузерах проєкт під\'єднується до файлу, у який ви його зберегли, і надалі «Файл → Зберегти» записує саме в нього; в інших під\'єднання неможливе, тож «Зберегти» вимкнено й доступне лише «Зберегти як». Коли файл проєкту зберігається на спільному диску, ця сторінка повідомляє, якщо файл уже відкритий у колеги, щоб двоє людей не перезаписували роботу одне одного.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Крива насоса';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Насос підпорядковується формулі H = H₀ − aQ^b, де H — напір, який додає насос, а Q — витрата через нього. Введіть одну, дві або три точки з кривої виробника. Три точки — напір при нульовій витраті, звичайна робоча точка та точка найбільшої витрати — визначають H₀, a і b безпосередньо й найточніше відповідають опублікованій кривій. Дві точки визначають параболу (b = 2) з вершиною при нульовій витраті. Одна точка використовує загальне правило: напір при нульовій витраті дорівнює 1,33 × введеного вами напору, а найбільша витрата дорівнює 2 × введеної вами витрати, що знову дає b = 2. Насос без жодної введеної точки не додає напору взагалі. Крива не обривається там, де напір досягає нуля, тож якщо вимагати від насоса більшу витрату, ніж може дати його крива, вийде від\'ємний напір. Виправлення — більший насос або менша витрата споживання, а не інша апроксимація кривої. Крива може містити більш ніж три точки, і кожну задану вами точку буде прочитано.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='Також на цій сторінці';
$ec_lang['lpn_notes_4_def']='Проєкт може розташовуватися на реальній землі з картою вулиць позаду. Файли EPANET .inp можна зчитувати й записувати. Нижня панель малює профіль уздовж маршруту й перелічує вузли. Елементи можна фарбувати за їхніми результатами, а «Знайти й замінити» вибирає кожен елемент, що відповідає заданій вами умові.';
$ec_lang['lpn_notes_6_term']='Довідка про стовпці таблиці';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Вибрати стовпець</td><td>Клацнути заголовок</td></tr><tr><td>Додати до вибору стовпців або розширити його</td><td>Ctrl+клацання або Shift+клацання по іншому заголовку</td></tr><tr><td>Перемістити (змінити порядок) вибраних стовпців</td><td>Перетягнути або скористатися «Керувати стовпцями…» в меню правої кнопки миші чи ⋮</td></tr><tr><td>Меню ⋮ і стрілка сортування.</td><td>Навести вказівник на верхній кут заголовка або вибрати заголовок чи перейти в нього клавішею Tab</td></tr><tr><td>Сховати, «Показати всі» або керувати видимістю й порядком</td><td>Клацнути заголовок правою кнопкою миші або меню ⋮ у верхньому правому куті заголовка</td></tr><tr><td>Сортувати за стовпцем</td><td>Піктограма стрілки у верхньому правому куті заголовка</td></tr><tr><td>Вставити як нові рядки в кінець таблиці</td><td>Клацання правою кнопкою миші, меню ⋮ у верхньому правому куті заголовка або Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Комбінації клавіш таблиці';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Клавіші зі стрілками</td><td>Навігація.</td></tr><tr><td>Tab, Enter</td><td>Завершити введення й перейти на одну клітинку вправо / вниз.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Перейти назад.</td></tr><tr><td>Shift+клавіші зі стрілками</td><td>Розширити виділення.</td></tr><tr><td>Ctrl+C</td><td>Скопіювати виділене.</td></tr><tr><td>Ctrl+D</td><td>Заповнити виділене вниз від верхнього рядка.</td></tr><tr><td>Ctrl+Enter</td><td>Заповнити виділене значенням активної клітинки.</td></tr><tr><td>Ctrl+A</td><td>Вибрати всю таблицю.</td></tr><tr><td>Ctrl+Shift+V</td><td>Вставити як нові рядки в кінець таблиці.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Перейти до наступної або попередньої вкладки, таблиці чи графіка.</td></tr><tr><td>Delete</td><td>Очистити клітинку.</td></tr><tr><td>F2</td><td>Відкрити клітинку для редагування.</td></tr><tr><td>Esc</td><td>Скасувати редагування.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Межі кольорових діапазонів лишаються незмінними';
$ec_lang['lpn_notes_color_def']='Межі кольорових діапазонів встановлюються, коли ви обираєте метод класифікації даних. Вони не встановлюються заново на кожному часовому кроці, бо тоді кольори означали б щось нове на кожному кроці, а це не допомагає бачити вашу систему. EPANET працює так само. Щоб отримати нові межі, оберіть метод ще раз або введіть свої власні межі.';
$ec_lang['lpn_notes_epanet_term']='Сталі Гейзена-Вільямса узгоджено з EPANET';
$ec_lang['lpn_notes_epanet_def']='У серпні 2026 року коефіцієнт і показник степеня Гейзена-Вільямса змінено, щоб узгодити їх з EPANET. Результати втрат напору відрізняються від попередніх версій цієї сторінки не більш ніж на 0,1 відсотка, що набагато менше за невизначеність самого значення C.';
$ec_lang['lpn_notes_engine_term']='Яку версію EPANET використовує ця сторінка';
$ec_lang['lpn_notes_engine_def']='Розв\'язувач EPANET на цій сторінці — це OWA-EPANET 2.3.5, випущений 20 лютого 2025 року. EPANET розробляє Open Water Analytics, спільнота, яка співпрацює з Агентством з охорони довкілля США, що випустило версію 2.2.0 у грудні 2019 року. У звіті про розрахунок вказано 2.3.05, бо рушій записує останнє число двома цифрами. Він потрапляє на цю сторінку через epanet-js 0.9.0 авторства Luke Butler, за ліцензією MIT, і працює просто у вашому браузері: вашу мережу ніколи нікуди не надсилають для розрахунку.';
$ec_lang['lpn_id_invalid']='Введіть ID без пробілів і лапок.';
$ec_lang['lpn_id_taken']='Цей ID уже використовується.';
$ec_lang['lpn_diag_no_fixed_head']='Додайте резервуар або ємність. Перш ніж мережу можна буде розрахувати, потрібен хоча б один відомий рівень води.';
$ec_lang['lpn_diag_dangling_link']='Труба або насос з\'єднані з вузлом, якого вже не існує:';
$ec_lang['lpn_diag_unreachable']='Ці вузли не мають шляху до резервуара:';
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
$ec_lang['lpn_engine_ready_valve']='Розв\'язувач EPANET тепер на цьому пристрої. Клапани, що самостійно відкриваються та закриваються, працюватимуть офлайн.';
$ec_lang['lpn_engine_unavailable']='Не вдалося отримати розв\'язувач EPANET, який потрібен для розрахунку клапанів, що самостійно відкриваються та закриваються. Підключіться до інтернету один раз, і надалі він зберігатиметься на цьому пристрої.';
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
$ec_lang['lpn_diag_valve_needs_epanet']='Ці клапани самостійно відкриваються та закриваються, і обчислити їх може лише розв\'язувач EPANET. Розв\'язувач EPANET не вдалося завантажити, тому цих результатів немає:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Ці клапани під\'єднано прямо до резервуара або ємності, які вже задають там рівень води, тож клапану більше нічого регулювати. Вставте коротку трубу між клапаном і резервуаром або ємністю:';
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
$ec_lang['lpn_field_from']='Від';
$ec_lang['lpn_field_to']='До';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Тип клапана';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Що робить клапан. Дросельний клапан підтримує фіксовані втрати. Інші три підтримують тиск або витрату і повністю відкриваються, закриваються або частково прикриваються залежно від зміни води. Зміна типу підставляє нове початкове число в уставку нижче, бо тиск — це не витрата, а жодне з них не є коефіцієнтом втрат.';
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
$ec_lang['lpn_inp_drop_gpv_curve']='Цей клапан посилається на криву втрат напору, якої немає у файлі. Клапан перенесено без кривої, тож він лишається повністю відкритим, доки ви не задасте її.';
$ec_lang['lpn_gpv_curve_source']='Крива втрат напору клапана';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Крива в «Бібліотеках», яка показує, який напір втрачає цей клапан при кожній витраті. Кілька клапанів можуть використовувати ту саму криву, і редагування її там змінює їх усі. Цей клапан містить лише посилання; самі точки читаються й редагуються в «Бібліотеки, Криві».';
$ec_lang['lpn_field_valve_setting_pressure']='Уставка тиску';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Тиск, який підтримує клапан. Клапан зниження тиску утримує тиск на своєму боці нижче за течією на рівні цього значення або нижче. Клапан підтримання тиску утримує тиск на своєму боці вище за течією на рівні цього значення або вище.';
$ec_lang['lpn_field_valve_setting_flow']='Уставка витрати';
$ec_lang['lpn_field_valve_setting_flow_tip']='Найбільша витрата, яку пропускає клапан. Коли крізь нього намагається пройти менше води, ніж це значення, клапан стоїть повністю відкритим і не додає втрат.';
$ec_lang['lpn_field_valve_setting']='Уставка';
$ec_lang['lpn_field_valve_setting_loss']='Коефіцієнт втрат';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Скільки напору знімає дросельний клапан, виражене як кратна величина швидкісного напору. Використовуйте 0 для клапана, що стоїть повністю відкритим. Це єдине число визначає всі втрати дросельного клапана.';
$ec_lang['lpn_field_valve_diameter_tip']='Ширина отвору клапана. Швидкість води крізь клапан обчислюється за цією шириною, а втрати випливають із цієї швидкості.';
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
$ec_lang['lpn_pump_curve_source_tip']='Крива в «Бібліотеках», яка показує, який напір додає цей насос при кожній витраті. Кілька насосів можуть використовувати ту саму криву, і редагування її там змінює їх усі. Цей насос містить лише посилання; самі точки читаються й редагуються в «Бібліотеки, Криві».';
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
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Тег може означати будь-що, що вам потрібно, наприклад зону тиску чи номер наряду на роботу. Жоден розрахунок ні тут, ні в EPANET його не читає. Тег — це одне слово: EPANET припиняє читання на першому пробілі, тож пробіл не приймається під час введення. Він переноситься у файл EPANET і назад.';
$ec_lang['lpn_pump_effic_curve']='Крива ефективності насоса';
$ec_lang['lpn_pump_effic_curve_tip']='Крива в «Бібліотеках», яка показує, наскільки ефективний цей насос при кожній витраті. Кілька насосів можуть використовувати ту саму криву, і редагування її там змінює їх усі. Цей насос містить лише посилання; самі точки читаються й редагуються в «Бібліотеки, Криві».';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Крива не вибрана';
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
$ec_lang['lpn_mode_select']='Режим: Вибір. Клацніть на елементі або підписі, щоб переглянути чи змінити його. Перетягуйте, щоб пересунути вузол, вершину або підпис. Використовуйте інструмент «Вершини», щоб додавати чи прибирати згини труби.';
$ec_lang['lpn_mode_delete']='Режим: Видалення. Клацніть на елементі, щоб видалити його.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Режим: Вершини. Вершини кожної труби показано як маленькі квадратні маркери. Клацніть на трубі, щоб додати вершину, клацніть на маркері, щоб прибрати його, або перетягніть маркер, щоб перемістити його. Більше нічого на карті в цьому режимі не змінюється.';
$ec_lang['lpn_mode_zoom_window']='Режим: наблизити вікном. Клацніть два протилежні кути прямокутника або перетягніть один із них на карті, щоб наблизити цю ділянку.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Нічого не вибрано. Спочатку клацніть елемент на карті, потім натисніть Delete.';
$ec_lang['lpn_mode_add_junction']='Режим: Додавання вузла. Клацніть на карті, щоб розмістити вузол. Перейдіть у режим «Вибір», щоб змінювати або пересувати елементи й підписи.';
$ec_lang['lpn_mode_add_reservoir']='Режим: Додавання резервуара. Клацніть на карті, щоб розмістити резервуар. Перейдіть у режим «Вибір», щоб змінювати або пересувати елементи й підписи.';
$ec_lang['lpn_mode_add_tank']='Режим: Додавання ємності. Клацніть на карті, щоб розмістити ємність. Перейдіть у режим «Вибір», щоб змінювати або пересувати елементи й підписи.';
$ec_lang['lpn_mode_add_pipe']='Режим: Додавання труби. Клацніть на вузлі, потім на іншому вузлі, щоб з\'єднати їх. Клацніть у вільному місці між ними, щоб зігнути лінію, або натисніть Escape, щоб почати заново. Перейдіть у режим «Вибір», щоб змінювати або пересувати елементи й підписи.';
$ec_lang['lpn_mode_add_pump']='Режим: Додавання насоса. Клацніть на вузлі, потім на іншому вузлі, щоб з\'єднати їх. Клацніть у вільному місці між ними, щоб зігнути лінію, або натисніть Escape, щоб почати заново. Перейдіть у режим «Вибір», щоб змінювати або пересувати елементи й підписи.';
$ec_lang['lpn_mode_add_valve']='Режим: Додавання клапана. Клацніть на вузлі, потім на іншому вузлі, щоб з\'єднати їх. Клацніть у вільному місці між ними, щоб зігнути лінію, або натисніть Escape, щоб почати заново. Перейдіть у режим «Вибір», щоб змінювати або пересувати елементи й підписи.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Режим: Додавання тексту. Клацніть на карті, щоб розмістити Текст. Клацніть біля вузла, щоб прикріпити Текст до нього. Перейдіть у режим «Вибір», щоб змінювати або пересувати елементи й підписи.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Використовуйте цей режим, щоб змінювати, пересувати й перетягувати об\'єкти на карті. Це режим, до якого сторінка повертається за замовчуванням: вона сама повертається сюди після деяких дій, наприклад відкриття проєкту, а [Esc] повертає сюди з будь-якого іншого режиму.';
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
$ec_lang['lpn_labels_mark_extrema']='Позначати найвищі й найнижчі значення';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Малює лінію над найвищим значенням кожної підписаної властивості на карті (надрядкову лінію) і лінію під найнижчим значенням цієї властивості (підрядкову лінію), щоб ви могли знайти найвище й найнижче, не читаючи цифр.';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Застосувати до всіх';
$ec_lang['lpn_settings_apply_to_all_tip']='Кожен уже накреслений елемент цього виду отримає ID, що починається з цього тексту. Кожен зберігає свій номер. ID, що не закінчується числом, лишається без змін.';
$ec_lang['lpn_confirm_apply_prefix']='Перейменувати {n} елементів так, щоб їхні ID починалися з {prefix}? Кожен збереже свій номер.';
$ec_lang['lpn_prefix_applied']='Перейменовано {n} елементів. {skipped} інших лишено без змін.';
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
$ec_lang['lpn_labels_priority_node_tip']='Порядок, у якому значення прибирають, коли два підписи вузлів накладаються. Значення під номером 1 прибирають першим. Коли лишається лише одне значення, а підписи все ще накладаються, ховають увесь підпис: той, у якого лишок менш вартий показу — тобто менша витрата споживання, тиск, ближчий до середини діапазону, або відмітка чи напір, ближчі до значень сусідніх вузлів.';
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
$ec_lang['lpn_labels_use_units_tip']='Позначте, щоб показати одиницю в полі «Після» та в підписі, і щоб вона оновлювалася при зміні одиниць. Зніміть позначку, щоб ввести свій власний текст «Після».';
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
$ec_lang['lpn_backdrop_scale_from_prompt1']='Клацніть на точці фонового зображення, яка має лишитися на своєму місці.';
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
$ec_lang['lpn_map_attach_remove_tip']='Прибрати карту світу. Креслення та його координати в будь-якому разі лишаються незмінними.';
$ec_lang['lpn_map_attach_done']='Тепер карта світу позаду вашого креслення, а проєкт не змінено. Скористайтеся «Карта, Карта світу, Від’єднати», щоб знову прибрати її.';
$ec_lang['lpn_map_attach_removed']='Карту світу прибрано, а креслення лишилося точно таким, як було.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Ваше креслення на карті всього світу, в океані на нульовій широті й нульовій довготі. Спершу знайдіть своє місце: панорамуйте й масштабуйте карту позаду креслення, знайдіть назву місця або введіть широту й довготу. Саме креслення не рухається.';
$ec_lang['lpn_mapgeo_step1']='Крок 1 з 2: знайдіть своє місце у світі';
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
$ec_lang['lpn_mapgeo_dial_help']='Пересувайте два повзунки або вводьте значення в полях над ними, щоб зробити карту більшою чи меншою та повернути її. Середина кожного повзунка — це крок 1, залишений після припасування, тож 1 і 0 означають «не змінювати». Клавіші зі стрілками працюють на обох.';
$ec_lang['lpn_mapgeo_place']='Розмістити приблизно';
$ec_lang['lpn_mapgeo_finish']='Геоприв’язати тут';
$ec_lang['lpn_mapgeo_cancelled']='Карта світу повернулася туди, де була, а ваше креслення взагалі не рухалося.';
$ec_lang['lpn_mapgeo_locked']='Завершіть кнопкою «Геоприв’язати тут» або натисніть «Скасувати», перш ніж перемикати проєкти чи зберігати. Карта світу ще перебуває в процесі розміщення.';
$ec_lang['lpn_backdrop_scale_prompt1']='Клацніть на двох точках фонового зображення, наприклад на кінцях лінійного масштабу. Потім введіть справжню відстань між ними.';
$ec_lang['lpn_backdrop_scale_prompt2']='Справжня відстань між двома точками';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Клацніть на базовій точці (на зображенні) для переміщення.';
$ec_lang['lpn_backdrop_position_prompt2']='Виберіть спосіб визначення кінцевої точки, потім клацніть «Продовжити».';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Налаштування фонового зображення.';
$ec_lang['lpn_backdrop_target_label']='Перемістити цю точку до:';
$ec_lang['lpn_backdrop_target_node']='Вузол';
$ec_lang['lpn_backdrop_target_free']='Будь-яка точка на карті';
$ec_lang['lpn_backdrop_target_coords']='Координати, які ви вводите';
$ec_lang['lpn_backdrop_coords_prompt']='Введіть X,Y, куди має переміститися ця точка';
$ec_lang['lpn_backdrop_continue']='Продовжити';
$ec_lang['lpn_tool_settings']='Налаштування';
$ec_lang['lpn_settings_show_titles']='Показувати заголовки сторінки';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Сховати ці заголовки';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Показувати підказку для вибору';
$ec_lang['lpn_settings_area_hint_tip']='Показує над картою підказку, яка пояснює, що зробить ваш наступний клац під час вибору області.';
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
$ec_lang['lpn_settings_custom_props_note']='Властивості, які ви визначаєте самостійно для власних потреб. Вони зберігаються з проєктом і сценаріями, як і всі інші властивості.';
$ec_lang['lpn_cp_design']='Проєктування';
$ec_lang['lpn_cp_design_tip']='По одному рядку на власну властивість, і кожен розкривається, показуючи: Ключ, Мітка, Застосовується до, Перевіряти як, Дозволити або обмежити, поле символів, назване цим вибором, Нижня межа довжини, Верхня межа довжини, Нижня межа, Верхня межа.';
$ec_lang['lpn_cp_add']='Додати власну властивість';
$ec_lang['lpn_cp_add_tip']='Додає рядок до таблиці проєктування й відкриває його для редагування.';
$ec_lang['lpn_cp_remove_tip']='Вилучає цю властивість із таблиці проєктування. Значення, уже введені у ваших об’єктах, зберігаються у файлі й повертаються, якщо ви знову спроєктуєте той самий ключ.';
$ec_lang['lpn_cp_none']='Жодну власну властивість ще не спроєктовано.';
$ec_lang['lpn_cp_unnamed']='Ще не названо';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Ключ';
$ec_lang['lpn_cp_key_tip']='Ключ: властивість зберігається під цим ім’ям. Пробіли не дозволені, і для вас додається префікс, щоб ваш ключ ніколи не збігався з вбудованим полем.';
$ec_lang['lpn_cp_label']='Мітка';
$ec_lang['lpn_cp_label_tip']='Мітка: читач бачить це у вікні властивостей, у пошуку та на початку стовпця таблиці.';
$ec_lang['lpn_cp_applies']='Застосовується до';
$ec_lang['lpn_cp_applies_tip']='Застосовується до: список префіксів ідентифікаторів через кому для об’єктів, що використовують цю властивість, наприклад J,L,R.';
$ec_lang['lpn_cp_validate']='Перевіряти як';
$ec_lang['lpn_cp_validate_tip']='Перевіряти як: тут вказано, як виглядає правильне значення. Правила регістру читають лише англійський алфавіт, це заявлене обмеження. Виберіть «Не перевіряти», щоб приймати будь-що.';
$ec_lang['lpn_cp_restrict']='Обмежити ці символи';
$ec_lang['lpn_cp_restrict_tip']='Обмежити ці символи: значення може використовувати лише перелічені тут символи, або жодного з них, де «@» означає будь-яку літеру; «#» означає будь-яку цифру, а «-», «.» і «,» потрібно перелічити окремо, якщо вони дозволені; будь-які пробільні символи мають бути між іншими символами.';
$ec_lang['lpn_cp_restrict_mode']='Дозволити або обмежити';
$ec_lang['lpn_cp_restrict_mode_tip']='Дозволити або обмежити: задані символи є або єдиними, які може використовувати значення, або тими, яких воно не може використовувати.';
$ec_lang['lpn_cp_restrict_allow']='Дозволити лише ці символи';
$ec_lang['lpn_cp_minlength']='Нижня межа довжини';
$ec_lang['lpn_cp_minlength_tip']='Нижня межа довжини: будь-який коротший запис позначається, так ви знаходите порожні й недописані записи.';
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
$ec_lang['lpn_scenario_overrides']='К-сть своїх значень';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Бурштиновий обідок означає, що цей елемент містить значення, яке належить лише сценарію {name}.';
$ec_lang['lpn_scenario_overrides_tip']='Кожне з цих значень позначено на карті бурштиновим обідком. Перейдіть до {base}, щоб побачити креслення без них.';
$ec_lang['lpn_scenario_menu']='Сценарії';
$ec_lang['lpn_scenario_tip']='Набір значень, які зараз показує креслення і розраховує сторінка. Клацніть, щоб перемкнути сценарій або додати, перейменувати чи видалити його.';
$ec_lang['lpn_scenario_new']='Новий сценарій…';
$ec_lang['lpn_scenario_new_name']='Сценарій {n}';
$ec_lang['lpn_scenario_prompt_name']='Назва цього сценарію';
$ec_lang['lpn_scenario_rename']='Перейменувати сценарій…';
$ec_lang['lpn_scenario_delete']='Видалити сценарій';
$ec_lang['lpn_scenario_delete_confirm']='Видалити сценарій {name} і {n} значень, які належать лише йому? Саме креслення не зміниться.';
$ec_lang['lpn_scenario_override']='Лише в цьому сценарії';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Позначено означає, що це значення належить лише цьому сценарію, навіть якщо воно збігається з числом у Базовому. Зніміть позначку, щоб знову використовувати значення Базового.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Базовий сценарій: {value}';
$ec_lang['lpn_scenario_deactivated']='Елемент {id} перебуває поза мережею в {scenario}. Він і далі є на кресленні та в інших ваших сценаріях.';
$ec_lang['lpn_scenario_push_btn']='Застосувати значення Базового до всіх сценаріїв';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Кожен сценарій повертається до значення Базового для властивостей, підписи яких зараз показано. Значення, що належать лише цим сценаріям, буде відкинуто.';
$ec_lang['lpn_alt_cat_text']='Текст';
$ec_lang['lpn_alt_cat_userdata']='Власні властивості';
$ec_lang['lpn_alt_cat_energy']='Вартість енергії';
$ec_lang['lpn_alt_cat_fireflow']='Витрата на пожежогасіння';
$ec_lang['lpn_alt_cat_constituent']='Компонент';
$ec_lang['lpn_alt_cat_initial']='Початкові налаштування';
$ec_lang['lpn_alt_cat_topology']='Активація елементів';
$ec_lang['lpn_alt_cat_demand']='Споживання';
$ec_lang['lpn_alt_cat_physical']='Фізичні';
$ec_lang['lpn_alt_note']='Лише для читання. Базовий сценарій використовує базову альтернативу кожної категорії. Кожен сценарій отримує власну альтернативу для будь-якої зміненої категорії, дочірню до базової. Число — це кількість змінених у ній значень.';
$ec_lang['lpn_alt_title']='Попередній перегляд альтернатив';
$ec_lang['lpn_scenario_basic_tip']='Якщо позначено, сценарій — це просто значення, які ви в ньому задали. Якщо не позначено, це меню також пропонує таблицю попереднього перегляду альтернатив, яка показує, як ці значення згруповано за категоріями, і запрошує до відгуків.';
$ec_lang['lpn_scenario_basic']='Базовий режим';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Змусити кожен сценарій використовувати значення Базового для цих властивостей? Значення, що належать лише цим сценаріям, буде відкинуто. Цю дію можна скасувати.';
$ec_lang['lpn_scenario_push_scenarios']='Сценарії, яких це стосується:';
$ec_lang['lpn_scenario_push_values']='Відкинуті значення:';
$ec_lang['lpn_scenario_push_none']='Жоден сценарій не має свого значення для жодної з цих властивостей, тож нічого не зміниться. Нічого не відкидається.';
$ec_lang['lpn_scenario_preset_flow_static']='1. Тест витрати: статичний';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Калібрування за тестом витрати для проєктної мережі за нульової витрати. У цьому сценарії задайте споживання в усіх вузлах рівним 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Тест витрати: середній';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Калібрування за тестом витрати для проєктної мережі за першої зафіксованої витрати. У цьому сценарії задайте споживання у вузлі з витратою рівним першій виміряній витраті, а в усіх інших вузлах 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Тест витрати: максимальний';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Калібрування за тестом витрати для проєктної мережі за максимальної зафіксованої витрати. У цьому сценарії задайте споживання у вузлі з витратою рівним максимальній виміряній витраті, а в усіх інших вузлах 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Середня доба';
$ec_lang['lpn_scenario_preset_average_day_tip']='Множник споживання 1: кожне споживання таке, як введено, і вважається споживанням середньої доби.';
$ec_lang['lpn_scenario_preset_max_day']='5. Максимальна доба';
$ec_lang['lpn_scenario_preset_max_day_tip']='Множник споживання 2,0 від середньої доби, умовне значення. Більшість систем потрапляє між 1,2 і 3,0 (Національна дослідницька рада США, 2006). Задайте власне значення для вашої системи в розділі Налаштування, Розрахунок, Гідравліка, Множник витрати.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Пікова година';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='Множник споживання 3,0 від середньої доби, умовне значення. Більшість систем потрапляє між 3,0 і 6,0 (Національна дослідницька рада США, 2006). Задайте власне значення для вашої системи в розділі Налаштування, Розрахунок, Гідравліка, Множник витрати.';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. Пожежа плюс максимальна доба';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='Споживання максимальної доби (множник 2,0). Запустіть Аналіз витрати на пожежогасіння в цьому сценарії: він додає витрату на пожежогасіння в кожному вузлі до цього споживання.';
$ec_lang['lpn_delete_drops_overrides']='Видалення цього елемента також відкине {n} значень, які ваші сценарії зберігають для нього. Продовжити?';
$ec_lang['lpn_push_base_only']='Ця дія змінює саме креслення, тому її можна виконати лише в {base}. Перейдіть до {base} і спробуйте знову.';
$ec_lang['lpn_field_active']='Частина цієї мережі';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Зніміть позначку, щоб залишити елемент на кресленні, але поза мережею: його показано сірим, і розв\'язувач його ігнорує. У сценарії так вмикають і вимикають запропоновану трубу.';
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
$ec_lang['lpn_settings_emitter_exponent_tip']='Показник степеня у формулі емітера EPANET для дощувачів і витоків: витрата = коефіцієнт x тиск у цьому степені. Він змінює відповідь лише там, де вузол має емітер, а це поки означає мережу, зчитану з файлу EPANET.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Прочитати DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Читає відмітку з DEM для цього вузла й показує її нижче. Нічого в полі «Відмітка» не змінюється. Горизонтальна роздільна здатність DEM — близько 30 м для більшості поверхні Землі, і точніша там, де є кращі дані.';
$ec_lang['lpn_elev_dem_use']='Використати DEM';
$ec_lang['lpn_elev_dem_use_tip']='Вставляє відмітку з DEM для цього вузла в поле «Відмітка» вище, замінюючи те, що там було. Спершу читає DEM, якщо він ще не був прочитаний. Одне скасування (Undo) поверне попереднє значення.';
$ec_lang['lpn_elev_dem_none']='DEM не має відмітки для цього вузла.';
$ec_lang['lpn_elev_dem_said']='DEM Mapbox повідомляє {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Джерело відмітки';
$ec_lang['lpn_settings_elev_source_tip']='Звідки новий вузол отримує свою відмітку. Поверхня землі зчитується з DEM Mapbox, роздільна здатність якого — близько 30 м для більшості поверхні Землі, і точніша там, де є кращі дані.';
$ec_lang['lpn_settings_elev_source_typed']='Відмітка, введена вище';
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
$ec_lang['lpn_settings_accuracy_tip']='Наскільки близько має підійти розв\'язувач, перш ніж зупинитися, виміряне як величина, на яку витрати ще змінюються від однієї ітерації до наступної. Менше число точніше, але триває довше. Обидва розв\'язувачі читають це саме поле, і кожен вимірює цю зміну відносно іншої суми: вбудований розв\'язувач — відносно суми витрат споживання, EPANET — відносно суми витрат у з\'єднаннях. Якщо залишити поле порожнім, ця сторінка використовує суворішу точність, ніж власне значення за замовчуванням EPANET.';
$ec_lang['lpn_settings_specific_gravity']='Питома вага';
$ec_lang['lpn_settings_specific_gravity_tip']='Вага рідини порівняно з водою. Вона змінює тиск, який показав би манометр, а не витрати.';
$ec_lang['lpn_settings_viscosity']='Відносна в\'язкість';
$ec_lang['lpn_settings_viscosity_tip']='В\'язкість рідини порівняно з водою за 20 градусів Цельсія. Вона змінює відповідь лише за методом Дарсі-Вейсбаха.';
$ec_lang['lpn_settings_trials']='Максимум ітерацій';
$ec_lang['lpn_settings_trials_tip']='Скільки ітерацій дозволено, перш ніж розв\'язувач здасться на мережі, яка не збігається.';
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
$ec_lang['lpn_settings_unbalanced_tip']='Що робити з мережею, яка вичерпала свої ітерації й досі не збіглася. Дозвіл на додаткові ітерації часто дає збіжність. Зупинка повідомляє останню ітерацію як є, а це не розв\'язок. Це поле читає лише розв\'язувач EPANET. Вбудований розв\'язувач завжди зупиняється й позначає відповідь як таку, що не збіглася.';
$ec_lang['lpn_settings_unbalanced_continue']='Дозволити додаткові ітерації';
$ec_lang['lpn_settings_unbalanced_stop']='Зупинитися й повідомити останню ітерацію';
$ec_lang['lpn_settings_unbalanced_trials']='Додаткові ітерації перед звітом';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Скільки ще ітерацій дозволити після того, як вичерпано максимум вище, перш ніж буде повідомлено останню ітерацію. Це поле читає лише розв\'язувач EPANET.';
$ec_lang['lpn_settings_head_error']='Межа похибки напору';
$ec_lang['lpn_settings_head_error_tip']='Додаткова перевірка, яку розв\'язувач має пройти, перш ніж зупинитися: найбільша похибка напору, що лишається в будь-якій одній трубі. Нуль означає не застосовувати цю перевірку. Це поле читає лише розв\'язувач EPANET.';
$ec_lang['lpn_settings_flow_change']='Межа зміни витрати';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Додаткова перевірка, яку розв\'язувач має пройти, перш ніж зупинитися: найбільша зміна витрати в будь-якій одній трубі від однієї ітерації до наступної. Нуль означає не застосовувати цю перевірку. Це поле читає лише розв\'язувач EPANET.';
$ec_lang['lpn_settings_damp_limit']='Демпфування починається з';
$ec_lang['lpn_settings_damp_limit_tip']='Точність, за якої розв\'язувач починає робити менші кроки, що може допомогти мережі, яка коливається, збігтися. Нуль означає, що розв\'язувач ніколи не демпфує. Це поле читає лише розв\'язувач EPANET.';
$ec_lang['lpn_settings_option_unset']='Не вказано';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Один коефіцієнт, застосований одразу до кожної витрати споживання в мережі. Використовуйте його, щоб дізнатися, що робить система за більшого чи меншого споживання, ніж сьогодні. Він не змінює числа, які ви ввели. Сценарій може мати власний, тож середня доба, максимальна доба й пікова година — це по одному числу кожен; залиште порожнім у сценарії, щоб використати значення проєкту.';
$ec_lang['lpn_settings_engine_native']='Розраховувати розв\'язувачем EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='Увімкніть це, щоб використовувати вбудований розв\'язувач там, де це можливо. Інакше завжди використовується розв\'язувач EPANET від Агентства з охорони довкілля США (US EPA). Вбудований розв\'язувач не застосовується для розрахунків за тривалий період чи для активних клапанів PRV, PSV або FCV. Коли розв\'язувач EPANET використовують уперше, завантажується близько 650 КБ, які потім зберігаються на цьому пристрої. Там, де труба несе місцеві втрати, розв\'язувачі трохи розходяться в останніх цифрах: EPANET округлює значення, яке використовує для прискорення вільного падіння, тому його місцеві втрати виходять трохи нижчими, ніж за точною формулою.';
$ec_lang['lpn_engine_loading']='Завантаження розв\'язувача EPANET…';
$ec_lang['lpn_engine_failed']='Не вдалося завантажити розв\'язувач EPANET. Замість нього показано вбудований розв\'язувач.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Розраховано розв\'язувачем EPANET, бо ці клапани самостійно відкриваються та закриваються:';
$ec_lang['lpn_unit_unknown']='У цьому кресленні вказано одиницю, якої немає на цій сторінці: {unit}. Усе збережено й показано точно так, як надійшло, і нічого не змінено. Відповідей не буде, доки ця сторінка не розпізнає цю одиницю, бо немає способу визначити її величину.';
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
$ec_lang['lpn_settings_show_arrows_tip']='Малює стрілку на кожній трубі, що показує, куди тече вода. Стрілки з\'являються після розрахунку, а їх вимкнення не змінює результатів. Це налаштування зберігається разом із проєктом.';
$ec_lang['lpn_settings_align_labels']='Вирівнювати підписи труб за трубами';
$ec_lang['lpn_settings_readability_bias']='Перевертати підпис, коли він нахилений більш ніж на стільки градусів ліворуч від вертикалі';
$ec_lang['lpn_settings_readability_bias_tip']='Перевертає підпис, щоб він лишався прямим, коли він нахилений ліворуч від вертикалі більш ніж на стільки градусів.';
$ec_lang['lpn_settings_mask_labels']='Суцільний фон під підписами';
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
$ec_lang['lpn_settings_symbol_cap']='Не давати вузлам масштабуватися більше, ніж';
$ec_lang['lpn_settings_symbol_cap_mid']='разів довжини';
$ec_lang['lpn_settings_symbol_cap_post']='труби цього процентиля';
$ec_lang['lpn_settings_symbol_cap_tip']='Вузол перестає рости на місцевості, щойно його діаметр стає в стільки разів більшим за довжину труби цього процентиля серед усіх довжин труб мережі. Після цієї межі на карті вузли, труби та інші символи зменшуються на екрані при віддаленні замість того, щоб рости на місцевості. Виняток становлять резервуари й ємності, які зберігають свій розмір на екрані за будь-якого масштабу.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Непрозорість символів (від 0 до 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Непрозорість фонового зображення (від 0 до 1)';
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
$ec_lang['lpn_confirm_restore_defaults']='Скинути всі налаштування (префікси ID, початкові значення, налаштування розв\'язувача, зовнішній вигляд карти, розташування умовних позначень і видимі підписи) до початкових значень? Ваша мережа не зміниться. Налаштування належать відкритому проєкту, тож інші ваші проєкти збережуть свої власні.';
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
$ec_lang['lpn_time_clock_day']='День {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Записуйте час як години і хвилини, наприклад 2:30. Просте число означає години, тож 8 — це вісім годин. Півгодини — це 0:30.';
$ec_lang['lpn_time_running']='Виконується розрахунок за розширений період розв\'язувачем EPANET.';
$ec_lang['lpn_time_no_engine']='Вбудований розв\'язувач обчислює лише один момент часу, тож це мережа станом на {time}: кожен графік зчитується на цей момент, а кожна ємність досі перебуває на початковому рівні, замість того щоб наповнюватися й спорожнюватися. Підключіться до інтернету один раз, щоб завантажити розв\'язувач EPANET, який виконує розрахунок за розширений період.';
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
$ec_lang['lpn_time_run_report']='Звіт про розрахунок EPANET';
$ec_lang['lpn_time_run_report_copy']='Копіювати';
$ec_lang['lpn_time_run_report_copied']='Скопійовано';
$ec_lang['lpn_time_run_report_tip']='Те, що сам розв\'язувач EPANET надрукував про останній розрахунок: чи він збігся та про що попередив. Це текст самого розв\'язувача, не наш.';

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
$ec_lang['lpn_settings_page_note']='Зберігається в цьому калькуляторі, а не в проєкті.';
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
$ec_lang['lpn_quality_chemical_name_tip']='Хімічна речовина, яку ви відстежуєте, наприклад Хлор. Залиште порожнім, щоб використати власну типову назву EPANET, Chemical. Відображається у ваших звітах, але не використовується в розрахунках.';
$ec_lang['lpn_quality_mass_units']='Одиниці маси';
$ec_lang['lpn_quality_mass_units_tip']='Половина запису якості, що стосується одиниць, — власні два варіанти EPANET.';
$ec_lang['lpn_quality_unit_ug']='мкг/л';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Допуск якості';
$ec_lang['lpn_quality_tolerance_tip']='Наскільки можуть відрізнятися за концентрацією дві сусідні порції води, перш ніж EPANET вважатиме їх однією. Порожнє поле використовує власне значення EPANET за замовчуванням — 0.01.';
$ec_lang['lpn_quality_diffusivity']='Відносна дифузійність';
$ec_lang['lpn_quality_diffusivity_tip']='Наскільки легко речовина поширюється у воді порівняно з хлором. Порожнє поле використовує власне значення EPANET за замовчуванням — 1.0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Концентрація {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Середня концентрація {chemical}';
$ec_lang['lpn_quality_initial']='Початкова якість';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Скільки хімічної речовини міститься в цьому вузлі на початку розрахунку. Резервуар зберігає своє значення протягом усього розрахунку, і саме так зазвичай задають залишкову концентрацію на виході зі станції очищення. Залиште поле порожнім, і вузол почне без жодної хімічної речовини.';
$ec_lang['lpn_result_concentration']='Концентрація';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Скільки хімічної речовини лишається в цій точці після того, як вона пройшла шлях і прореагувала. Одиниці — ті, що вказані поряд з хімічною речовиною в «Налаштування, Якість води».';
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
$ec_lang['lpn_source_quality_tip']='Наскільки сильна доза. Для всіх типів, крім масового дозатора, це концентрація в одиницях, указаних поряд з хімічною речовиною в «Налаштування, Якість води»; для масового дозатора — це маса хімічної речовини за хвилину. Залиште поле порожнім, і тут нічого не додається, а це не те саме, що нуль: нуль — це дозатор, який працює й нічого не додає.';
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
$ec_lang['lpn_reaction_bulk_tip']='Реакція в товщі води, застосовується для кожної труби, яка не має власного коефіцієнта. Від\'ємне число зменшує кількість хімічної речовини, додатне — збільшує. Реакція першого порядку, якщо імпортований файл EPANET не задає інший порядок, тож коефіцієнт — це швидкість у 1/добу. Порожнє поле означає відсутність реакції в товщі води.';
$ec_lang['lpn_reaction_wall']='Коефіцієнт реакції на стінці';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Реакція на стінці труби, застосовується для кожної труби, яка не має власного коефіцієнта. Від\'ємне число зменшує кількість хімічної речовини. Реакція першого порядку, якщо імпортований файл EPANET не задає інший порядок, тож коефіцієнт — це довжина за добу, записана в одиниці довжини проєкту. Порожнє поле означає відсутність реакції на стінці.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Лише для цієї труби. Залиште поле порожнім, і труба використовуватиме коефіцієнт, заданий для всієї мережі в «Налаштування, Якість води».';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Коефіцієнт реакції';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Реакція у воді, що міститься в цій ємності, як швидкість у 1/добу. Від\'ємне число зменшує кількість хімічної речовини, додатне — збільшує. Вода стоїть в ємності набагато довше, ніж у будь-якій трубі, тож саме тут найчастіше втрачається залишкова концентрація. Залиште поле порожнім, і ємність використовуватиме коефіцієнт реакції в товщі води, заданий для всієї мережі в «Налаштування, Якість води».';
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
$ec_lang['lpn_reaction_order_tank_tip']='Показник степеня, до якого підноситься концентрація для реакції у воді, що міститься в ємності, окремо від порядку реакції в товщі, тож ємність може реагувати за іншим порядком, ніж труби. Дозволено будь-яке дійсне число, 1 — стандартне значення. EPANET записує це як ORDER TANK у файлі й не пропонує для цього поля у власному інтерфейсі.';
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
$ec_lang['lpn_reaction_rough_corr_tip']='Пов\'язує реакцію на стінці з власною шорсткістю кожної труби, тож більш шорстка труба реагує швидше. Коли це задано, коефіцієнт реакції на стінці обчислюється для кожної труби за її шорсткістю, і єдиний коефіцієнт реакції на стінці вище більше не використовується. Не використовується, якщо поле порожнє.';
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
$ec_lang['lpn_reports_epanet']='Розрахунок EPANET';
$ec_lang['lpn_energy_title']='Звіт про енергію насосів';
$ec_lang['lpn_energy_menu']='Енергія насосів';
$ec_lang['lpn_energy_efficiency']='Ефективність насоса (у %)';
$ec_lang['lpn_energy_efficiency_tip']='Повна електрична ефективність (від мережі до води), яка застосовується до кожного насоса без власної кривої ефективності. EPANET використовує 75 %, якщо нічого не задано.';
$ec_lang['lpn_energy_price']='Ціна електроенергії';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Скільки коштує одна кіловат-година. Застосовується до кожного насоса без власної ціни. Залиште поле порожнім, і кожна вартість у звіті дорівнюватиме нулю.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Скільки коштує одна кіловат-година для цього насоса. Залиште поле порожнім, і насос використовуватиме ціну, задану для всієї мережі в «Налаштування, Енергія».';
$ec_lang['lpn_energy_price_pattern']='Графік ціни';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Графік, який множить ціну на кожному кроці графіка, — так задають нічний тариф. Залиште поле порожнім для однієї ціни протягом усього розрахунку.';
$ec_lang['lpn_energy_demand_charge']='Плата за пікове навантаження';
$ec_lang['lpn_energy_demand_charge_tip']='Скільки комунальне підприємство стягує за кВт за пікове навантаження, яке вимагають насоси системи.';
$ec_lang['lpn_energy_currency']='Валюта';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Усе, що ви тут напишете, друкується поряд із кожним грошовим значенням. Це лише напис. Ціни та вартості ніколи не перераховуються, тож записуйте ціни у валюті, яку ви тут указали.';
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
$ec_lang['lpn_scncmp_menu_tip']='Розрахувати кожен сценарій у цьому проєкті й переглянути їх поряд: найнижчий тиск і найвищу швидкість у кожному.';
$ec_lang['lpn_scncmp_running']='Розрахунок кожного сценарію…';
$ec_lang['lpn_scncmp_empty']='Ще нічого не намальовано, тож нічого розраховувати.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Найвища швидкість';
$ec_lang['lpn_scncmp_at']='{value} у {id}';
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
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Стан';
$ec_lang['lpn_reports_status_tip']='Що змінилося протягом останнього розрахунку розширеного періоду, у хронологічному порядку: насоси й клапани, що відкриваються чи закриваються, ємності, що наповнюються, спорожняються, наповнилися чи спорожніли, а також кроки, що не досягли повної збіжності.';
$ec_lang['lpn_status_title']='Звіт про стан';
$ec_lang['lpn_status_needs_run']='Звіт про стан перелічує, що змінилося протягом розрахунку розширеного періоду. Задайте «Загальний час роботи» в «Налаштування, Розрахунок, Час», натисніть «Розрахувати», а потім відкрийте «Вода, Звіти, Звіт про стан».';
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
$ec_lang['lpn_reports_full_tip']='Кожен вузол і кожен зв’язок на кожному моменті звітування останнього розрахунку, як одна таблиця, яку можна завантажити або надрукувати.';
$ec_lang['lpn_full_title']='Повний звіт';
$ec_lang['lpn_full_needs_run']='Повний звіт перелічує кожен вузол і кожен зв’язок на кожному моменті звітування. Натисніть «Розрахувати», а потім відкрийте «Вода, Звіти, Повний звіт».';
$ec_lang['lpn_full_note']='Один рядок на вузол чи зв’язок на кожен момент звітування, в одиницях, показаних на панелі «Таблиці». Порожня клітинка — це стовпець, якого ця величина не має. Завантаження чи друк містить кожен момент часу; таблиця нижче показує лише один за раз.';
$ec_lang['lpn_full_step_label']='Крок часу';
$ec_lang['lpn_full_download_csv']='Завантажити CSV';
$ec_lang['lpn_full_print']='Надрукувати звіт';
$ec_lang['lpn_full_col_time']='Час';
$ec_lang['lpn_full_col_type']='Тип';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} рядків.';
$ec_lang['lpn_calib_ts_note']='Кільця — це виміряні значення з файлу калібрування.';
$ec_lang['lpn_calib_ts_point']='Виміряно в {id}, {time}: {v}';
$ec_lang['lpn_calib_corr_note']='Кожна точка — одне вимірювання. Чим ближче точки лежать до діагональної лінії, тим ближче обчислені значення до спостережених.';
$ec_lang['lpn_calib_point']='{id}, {time}: спостережено {o}, обчислено {s}';
$ec_lang['lpn_calib_computed']='Обчислено';
$ec_lang['lpn_calib_observed']='Спостережено';
$ec_lang['lpn_calib_axis_sim']='Обчислено: {q}';
$ec_lang['lpn_calib_axis_obs']='Спостережено: {q}';
$ec_lang['lpn_calib_corr_none']='Кореляція між середніми: потрібно щонайменше два місця з різними середніми.';
$ec_lang['lpn_calib_corr_means']='Кореляція між середніми: {r}';
$ec_lang['lpn_calib_network']='Мережа';
$ec_lang['lpn_calib_col_rms_err_tip']='Середньоквадратична похибка: квадратний корінь із середнього квадратів різниць між спостереженими й обчисленими значеннями.';
$ec_lang['lpn_calib_col_rms_err']='СКП';
$ec_lang['lpn_calib_col_mean_err_tip']='Середнє абсолютних різниць між кожним спостереженим значенням і обчисленим значенням на той самий час.';
$ec_lang['lpn_calib_col_mean_err']='Середня похибка';
$ec_lang['lpn_calib_col_sim_mean']='Обчислене середнє';
$ec_lang['lpn_calib_col_obs_mean']='Спостережене середнє';
$ec_lang['lpn_calib_col_n']='К-ть спост.';
$ec_lang['lpn_calib_col_location']='Місце';
$ec_lang['lpn_calib_tab_means']='Порівняння середніх';
$ec_lang['lpn_calib_tab_corr']='Кореляційний графік';
$ec_lang['lpn_calib_tab_stats']='Статистика';
$ec_lang['lpn_calib_no_pairs']='Жодного вимірювання не вдалося порівняти, тож будувати нічого.';
$ec_lang['lpn_calib_needs_run']='Результатів для порівняння ще немає. Звіт заповниться після розрахунку мережі.';
$ec_lang['lpn_calib_single']='Це розрахунок одного періоду, тож кожне вимірювання порівнюється з його єдиним результатом, незалежно від часу у файлі.';
$ec_lang['lpn_calib_no_value']='Вимірювань без обчисленого значення на їхній момент пропущено: {n}.';
$ec_lang['lpn_calib_outside']='Вимірювань поза часом, про який повідомляв цей розрахунок, пропущено: {n}.';
$ec_lang['lpn_calib_bad_lines']='Рядки, які не вдалося прочитати, пропущено: {lines}';
$ec_lang['lpn_calib_missing_count']='Вимірювань пропущено, бо їхнього місця немає в цій мережі: {n}.';
$ec_lang['lpn_calib_missing']='Названо у файлі, але немає в цій мережі: {ids}.';
$ec_lang['lpn_calib_units']='Значення з файлу читаються в одиницях цього проєкту: {unit}.';
$ec_lang['lpn_calib_file']='{file}: {n} вимірювань у {m} місцях.';
$ec_lang['lpn_calib_session']='Файл калібрування зберігається лише на час цього сеансу. Його не збережено разом із проєктом чи на цьому пристрої.';
$ec_lang['lpn_calib_none']='Для цього параметра не завантажено файлу калібрування.';
$ec_lang['lpn_calib_load_tip']='Текстовий файл, у кожному рядку якого — ідентифікатор місця, час і виміряне значення. Час відлічується від початку розрахунку, у десяткових годинах або годинах:хвилинах. Крапка з комою починає коментар. Рядок лише з часом і значенням належить до місця над ним.';
$ec_lang['lpn_calib_load']='Завантажити файл калібрування…';
$ec_lang['lpn_calib_param_tip']='Величина, яку вимірює файл калібрування. Для кожного параметра зберігається один файл.';
$ec_lang['lpn_calib_param']='Параметр';
$ec_lang['lpn_calib_title']='Звіт про калібрування';
$ec_lang['lpn_reports_calib_tip']='Порівнює виміряні польові дані з файлу калібрування з останнім розрахунком: статистика, кореляційний графік і порівняння середніх.';
$ec_lang['lpn_reports_calib']='Калібрування';
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
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_rank']='Ранг';
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
$ec_lang['lpn_library_patterns_tip']='Графік — це список множників, який повторюється. Кожен діє протягом одного кроку часу графіка, тож 24 числа з кроком в одну годину складають добу, яка повторюється. Витрата 10 із множником 1,5 дає 15 у цей момент.';
$ec_lang['lpn_library_curves']='Криві';
$ec_lang['lpn_library_curves_tip']='Крива — це перелік точок, який показує, як щось працює: який напір додає насос при кожній витраті, яка в нього ефективність при цій витраті або який напір втрачає клапан при кожній витраті.';
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
$ec_lang['lpn_library_curve_in_use']='Цю криву використовують {count} елементів: {ids}. Спочатку перенаправте їх на іншу криву, а потім видаліть цю.';
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
$ec_lang['lpn_library_pipetypes_note']='Кожен проєкт має власну бібліотеку типів труб. У визначенні типу труби можна залишати властивості порожніми. Наприклад, тип труби, який задає шорсткість без діаметра, — це нормально. Типи труб прикріплюють до труб у редакторі їхніх властивостей. Редагування визначення тут змінює кожну трубу, яка на нього посилається.';
$ec_lang['lpn_library_pipetype_add']='Додати тип труби';
$ec_lang['lpn_library_pipetype_blank_tip']='Порожні властивості у визначенні типу труби залишаються для введення окремо для кожної труби.';
$ec_lang['lpn_library_pipetype_used_by']='Труби, що використовують цей тип';
$ec_lang['lpn_library_pipetype_unused']='Цей тип труби ніщо не використовує.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Цей тип труби використовують {count} труб: {ids}. Спочатку від\'єднайте його від них, а потім видаліть.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Тип труби';
$ec_lang['lpn_field_pipetype_tip']='Тип труби з бібліотеки проєкту, який використовує ця труба. Властивості, включені до типу труби, тут недоступні для редагування. Від\'єднайте тип труби, щоб увімкнути редагування тут.';
$ec_lang['lpn_pipetype_none']='Тип труби не вибрано';
$ec_lang['lpn_pipetype_detach']='Від\'єднати від типу труби';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Копіює значення, які ця труба зчитує зі свого типу, у саму трубу й припиняє використовувати тип. Значення труби зараз не змінюються, і відтепер ви можете редагувати їх тут.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Фітинги';
$ec_lang['lpn_library_fittings_tip']='Список фітингів — це набір фітингів та їхньої кількості, на який можуть посилатися кілька труб. У сумі він дає один коефіцієнт місцевих втрат.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Кожен проєкт має власну бібліотеку фітингів. Список фітингів містить фітинги з кількістю для кожного з них і в сумі дає єдиний коефіцієнт місцевих втрат. На список можуть посилатися як труби, так і типи труб.';
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
$ec_lang['lpn_library_fittings_in_use']='Цей список фітингів використовують {count} труб: {ids}. Спочатку від\'єднайте його від них, а потім видаліть.';
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
$ec_lang['lpn_library_import_needs_fittings']='Ці типи труб посилаються на список фітингів, якого цей проєкт не має: {names}. Імпортуйте бібліотеку фітингів з того самого файлу, і вони її знайдуть.';
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
$ec_lang['lpn_field_fittings_tip']='Список фітингів із бібліотеки проєкту. Його кількості та коефіцієнти підсумовуються в коефіцієнт місцевих втрат цієї труби, і тоді поле коефіцієнта стає доступним лише для читання. Залиште це поле незаповненим, щоб ввести коефіцієнт самостійно.';
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
$ec_lang['lpn_inp_export_flat_types']='{n} труб тут посилаються на {t} типів труб. У файлі кожна з цих труб несе власну копію чисел, тож відповіді однакові. Чого файл не може зберегти, так це самого типу труби, тож редагування одного визначення з наслідком для кожної труби фіксує лише ваш власний файл проєкту.';
$ec_lang['lpn_inp_export_flat_coords']='Файл EPANET зберігає одну позицію для кожного вузла. Цей сценарій розміщує {n} з них деінде, і саме ці позиції потрапляють у файл. Кожен інший сценарій зберігає власні позиції лише у вашому файлі проєкту.';
$ec_lang['lpn_inp_export_flat_fittings']='Файл EPANET не може зберегти список колін, клапанів і трійників із вашого файлу проєкту. Коефіцієнт місцевих втрат {n} труб тут підсумовано зі списку фітингів. Сума потрапляє у файл точно такою, якою вона є, тож у відповідях нічого не змінюється.';
$ec_lang['lpn_library_controls']='Керування';
$ec_lang['lpn_library_controls_tip']='Правило керування — це одне речення, яке відкриває чи закриває з\'єднання або задає йому уставку, коли про це каже рівень води, тиск або час.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Додати графік';
$ec_lang['lpn_library_pattern_values']='Множники';
$ec_lang['lpn_library_pattern_values_tip']='Множники, розділені пробілами або комами. Вставте стовпець з електронної таблиці, якщо він у вас є. Список повторюється протягом усього розрахунку, тож він не обов\'язково має охоплювати весь розрахунок.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} множників, крок {step}, охоплює {span}';
$ec_lang['lpn_library_pattern_none']='Без графіка';
$ec_lang['lpn_settings_default_pattern']='Графік споживання за замовчуванням';
$ec_lang['lpn_settings_default_pattern_tip']='Кожен вузол без свого графіка використовує цей.';
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
$ec_lang['lpn_library_rules_tip']='Правило — це короткий абзац, який відкриває чи закриває з\'єднання або задає йому налаштування, коли рівень води, тиск, витрата чи час досягає заданого вами значення. Правила можуть перевіряти кілька умов одразу й вказувати, що робити, коли перевірка не пройдена.';
$ec_lang['lpn_library_rule_add']='Додати правило';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Одне правило, словами, які використовує EPANET, по одному реченню на рядок. Перший рядок називає його: RULE 1. Потім умова: IF TANK 2 LEVEL BELOW 17.1. Потім що з цим робити: THEN PUMP 9 STATUS IS OPEN. Останній рядок може задати йому пріоритет: PRIORITY 1. Додайте рядки AND чи OR, щоб перевірити більше однієї умови, і рядки ELSE, щоб указати, що робити, коли перевірка не пройдена. Умова може читати LEVEL, HEAD, GRADE, PRESSURE чи DEMAND для вузла, FLOW, STATUS чи SETTING для з\'єднання, або TIME і CLOCKTIME для SYSTEM. Пишіть числа в одиницях, які показує цей проєкт; вони перераховуються автоматично. Залишайте ключові слова англійською; саме їх читають сторінка та EPANET.';
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
$ec_lang['lpn_result_demand_tip']='Витрата, яку цей вузол забирає на показаному часовому кроці: кожна базова витрата споживання, помножена на свій графік, підсумована разом. Це обчислюється, а не вводиться, тож змінюється з часом і не може бути відредаговано.';
$ec_lang['lpn_field_demand_pattern']='Графік споживання';
$ec_lang['lpn_field_demand_pattern_tip']='Як зростає й спадає витрата споживання цього вузла протягом розрахунку. Лишіть «Без графіка», і вузол використовуватиме «Графік споживання за замовчуванням» проєкту.';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Опис';
$ec_lang['lpn_demand_add']='Додати категорію споживання';
$ec_lang['lpn_demand_remove']='Прибрати це споживання';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Графік напору';
$ec_lang['lpn_field_head_pattern_tip']='Як підіймається й опускається рівень води цього резервуара протягом розрахунку. Напір вище множиться на графік.';
$ec_lang['lpn_field_pump_speed']='Відносна швидкість';
$ec_lang['lpn_field_pump_speed_tip']='1 означає, що цей насос обертається зі швидкістю, на якій виміряно його криву. 0,9 — той самий насос обертається повільніше, що знижує напір, який він додає, і витрату, яку він пропускає. Графік швидкості замінює це число на час розрахунку.';
$ec_lang['lpn_field_speed_pattern']='Графік швидкості';
$ec_lang['lpn_field_speed_pattern_tip']='Як зростає й спадає швидкість цього насоса протягом розрахунку. Кожен множник — це відносна швидкість для цієї частини розрахунку, і він замінює налаштування «Швидкість», а не масштабує його, тож множник 0 зупиняє насос.';

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
$ec_lang['lpn_search_tip']='Знайдіть місто, адресу чи визначну точку за назвою і перемістіть до них карту. Перше використання запитує вашу згоду, бо слова, які ви вводите, надходять до служби назв місць OpenStreetMap.';
$ec_lang['lpn_search_bar']='Пошук за назвою…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Пошук за назвою місця надсилає введені вами слова на nominatim.openstreetmap.org — безкоштовну службу назв місць фонду OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Це інша служба, ніж зображення карти вулиць позаду вашого проєкту. Зображення повідомляють лише, куди ви дивитеся. Пошук повідомляє, що саме ви ввели. Служба назв місць отримає слова вашого пошуку та вашу IP-адресу. Ми не надсилаємо нічого іншого й не зберігаємо жодного запису ваших пошуків.';
$ec_lang['lpn_search_consent_3']='Чи можемо ми надсилати ваші пошукові запити до служби назв місць?';
$ec_lang['lpn_search_consent_4']='Якщо ви відповісте «ні», усе інше на цій сторінці й далі працюватиме точно так само, включно з Перейти до широти й довготи. Ми запам\'ятовуємо «так», щоб більше не запитувати. «Ні» ніде не зберігається.';
$ec_lang['lpn_search_refused']='Пошук за назвою місця вимкнено, і нічого не надіслано. Ви й далі можете користуватися Перейти до широти й довготи.';
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
$ec_lang['lpn_search_rate']='Служба назв місць просить нас сповільнитися. Зачекайте хвилину й спробуйте ще раз.';
$ec_lang['lpn_search_http']='Служба назв місць відповіла помилкою.';
$ec_lang['lpn_search_timeout']='Служба назв місць не відповіла вчасно. Усе інше на цій сторінці працює без неї.';
$ec_lang['lpn_search_unreadable']='Служба назв місць відповіла тим, що ця сторінка не змогла прочитати.';
$ec_lang['lpn_search_offline']='Не вдалося з\'єднатися зі службою назв місць. Можливо, ви офлайн. Усе інше на цій сторінці працює без неї, включно з Перейти до широти й довготи.';
$ec_lang['lpn_search_toofast']='Один пошук за секунду — ось що дозволяє служба назв місць. Спробуйте ще раз за мить.';
$ec_lang['lpn_search_nofetch']='Цей браузер не може з\'єднатися зі службою назв місць.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox збирає ці дані з багатьох публічних наборів даних про рельєф, тож їхня якість повністю залежить від того, де ви перебуваєте. Там, де існує національна лідарна зйомка, наприклад USGS 3DEP на більшій частині території США та її аналоги в інших країнах, точність може бути кращою за метр по горизонталі та кілька десятих метра по вертикалі. Там, де є лише глобальні дані, це близько 30 м по горизонталі та кілька метрів по вертикалі. Mapbox не повідомляє нам, які саме дані ви отримали. Ставтеся до цього як до карти з горизонталями, а не як до геодезичної зйомки: перевіряйте все, на що покладаєтеся.';
$ec_lang['lpn_terrain_consent_1']='Заповнення відміток надсилає позицію кожного вузла, якому вона потрібна, — його широту й довготу — на api.mapbox.com, щоб дізнатися висоту землі в цьому місці.';
$ec_lang['lpn_terrain_consent_2']='Це інше питання, ніж зображення карти позаду вашого проєкту. Зображення повідомляють лише, куди ви дивитеся. Ці позиції — це сама ваша мережа. Mapbox отримає ці координати та вашу IP-адресу. Ми не надсилаємо нічого іншого: ні назви, ні труб, ні проєкту. Ми не зберігаємо жодного запису про це, і на цьому пристрої не зберігається нічого, крім вашої відповіді на це запитання.';
$ec_lang['lpn_terrain_consent_3']='Чи можемо ми надіслати позиції ваших вузлів у Mapbox?';
$ec_lang['lpn_terrain_consent_4']='Якщо ви відповісте «ні», усе інше на цій сторінці й далі працюватиме точно так само, і ви зможете вводити відмітки самостійно, як і раніше. Ми запам\'ятовуємо «так», щоб більше не запитувати. «Ні» ніде не зберігається.';
$ec_lang['lpn_terrain_refused']='Відмітки не заповнено, і нічого не надіслано. Ви можете ввести їх самостійно, як і раніше.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Заповнити відмітку {n} вузла(ів) з DEM Mapbox?';
$ec_lang['lpn_terrain_confirm_default_1']='Відмітка вже є в кожного вузла, і {n} із них досі мають значення {v} — це відмітка, з якою починається новий вузол, а не та, яку ви ввели.';
$ec_lang['lpn_terrain_confirm_default_2']='Замінити відмітку цих {n} вузлів значеннями з DEM Mapbox?';
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
$ec_lang['lpn_terrain_rate_limited']='Служба рельєфу просить нас сповільнитися (429), тож жодну відмітку не змінено. Спробуйте ще раз за хвилину.';
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
$ec_lang['lpn_analyze_menu_tip']='Аналізи, що запускають мережу на копії: витрата на пожежогасіння в кожному вузлі, втрати кожної труби, насоса й клапана та споживання, збільшене чи зменшене в масштабі.';
$ec_lang['lpn_analyze_menu']='Аналіз';

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
$ec_lang['lpn_ff_menu']='Аналіз витрати на пожежогасіння…';
$ec_lang['lpn_ff_menu_tip']='Перевіряє вузли по одному: скільки кожен може подати, утримуючи заданий залишковий тиск, і чи не виводить відбір потрібної витрати там щось інше за межі допустимого.';
$ec_lang['lpn_ff_title']='Аналіз витрати на пожежогасіння';
$ec_lang['lpn_ff_intro']='У кожного вузла по черзі запитують відбір витрати на пожежогасіння понад те споживання, яке він уже має. У вашому проєкті нічого не змінюється; весь розрахунок виконується на копії.';
$ec_lang['lpn_ff_scope']='Вузли для перевірки';
$ec_lang['lpn_ff_scope_tip']='Оберіть набір перед запуском. Перевірка кожного вузла у великій системі може тривати хвилини.';
$ec_lang['lpn_ff_all']='Усі';
$ec_lang['lpn_ff_selected']='Вибрані';
$ec_lang['lpn_ff_no_junctions']='У цьому проєкті ще немає вузлів, тож перевіряти нічого.';
$ec_lang['lpn_ff_no_selection']='Жодного вузла не вибрано. Виберіть вузли або оберіть «Усі вузли».';
$ec_lang['lpn_ff_skipped']='{n} вибраних елементів не є вузлами, тож їх не перевірено.';
$ec_lang['lpn_ff_required']='Потрібна витрата на пожежогасіння';
$ec_lang['lpn_ff_required_tip']='Витрата, яку ваш протипожежний норматив або пожежна служба вимагає на гідранті. Кожен вузол перевіряють за цим числом, якщо тільки він не має власної потрібної витрати на пожежогасіння.';
$ec_lang['lpn_ff_required_own']='Вузли з власною потрібною витратою на пожежогасіння перевіряють за нею замість цього. Їх кількість: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Витрата на пожежогасіння, потрібна саме в цьому вузлі для типу забудови, яку він обслуговує, — за вашим протипожежним нормативом або пожежною службою. Залиште поле порожнім, і вузол перевірять за числом у полі «Аналіз витрати на пожежогасіння».';
$ec_lang['lpn_ff_residual']='Залишковий тиск для утримання';
$ec_lang['lpn_ff_residual_tip']='Тиск, який вузол має утримувати, подаючи витрату на пожежогасіння. AWWA M31 і NFPA 291 використовують 20 psi (140 кПа).';
$ec_lang['lpn_ff_design']='Перевірка проєкту (вплив на систему)';
$ec_lang['lpn_ff_design_tip']='Окреме питання від того, чи може вузол подати витрату: коли там відбирають цю витрату, чи не падає щось інше нижче свого мінімального тиску, чи не перевищує межу швидкості? Вибір перевірити це не коштує додаткового розрахунку.';
$ec_lang['lpn_ff_design_selected']='Вибрані';
$ec_lang['lpn_ff_design_all']='Усі';
$ec_lang['lpn_ff_design_off']='Немає';
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
$ec_lang['lpn_ff_accounting']='Витрату на пожежогасіння відбирають безпосередньо у вузлі. Це метод, використаний тут, і це звичайний метод. Гідрант, його бокова труба та насадка не моделюються, тож реальний гідрант подає менше, ніж показана тут витрата.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Використано вбудований розв\'язувач.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Використано розв\'язувач EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='Доступна витрата на пожежогасіння — це пошук, тож усю мережу розраховують приблизно шістнадцять разів для кожного перевіреного вузла. Велика система триває хвилини. Ви можете зупинити це в будь-який момент і зберегти те, що вже зроблено.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Перевіряється лише той часовий крок, який зараз на екрані. Витрату на пожежогасіння зазвичай перевіряють понад споживання в максимальну добу, тож перед запуском встановіть мережу в такий стан.';
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
$ec_lang['lpn_ff_summary']='{clean} вузлів не мали жодної проблеми. {fire} вузлів не пройшли перевірку витрати на пожежогасіння. {design} вузлів вплинули на решту системи.';
$ec_lang['lpn_ff_summary_error']='{n} вузлів не вдалося оцінити.';
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
$ec_lang['lpn_ff_design_none']='Ніщо в обраному наборі не вийшло за свої межі, поки будь-який вузол відбирав свою витрату на пожежогасіння.';
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
$ec_lang['lpn_ff_iso']='Insurance Services Office (ISO) зараховує одному гідранту щонайбільше {flow}. Цю межу заліку тут не застосовано, тому що невідомо, скільки гідрантів може представляти вузол.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Уже нижче за залишковий тиск ще до відбору будь-якої витрати на пожежогасіння';
$ec_lang['lpn_ff_err_converge']='Мережа не збіглася.';
$ec_lang['lpn_ff_err_solve']='Розв\'язувач повідомив про помилку й не дав відповіді.';
$ec_lang['lpn_ff_err_not_junction']='Не вузол';
$ec_lang['lpn_ff_err_unknown']='Відповіді немає. Повідомлений код: {code}.';
$ec_lang['lpn_crit_skipped_dead']='Тупикових зʼєднань пропущено: {n}. Кожне відрізає все, що за ним.';
$ec_lang['lpn_crit_skipdead_tip']='Тупикове зʼєднання — те, чия втрата відрізає вузли, до яких можна дістатися лише через нього, без резервуара чи ємності далі. Його втрата — це все, що за ним, тому його не розв’язують. У підсумку вказано, скільки пропущено.';
$ec_lang['lpn_crit_skipdead']='Пропускати тупики';
$ec_lang['lpn_crit_stale']='Рисунок змінився, тож результати аналізу критичності очищено. Запустіть його знову.';
$ec_lang['lpn_crit_skipped']='Вибраних елементів, що не є зʼєднаннями, і тому не розірваних: {n}.';
$ec_lang['lpn_crit_busy']='Виконується інший аналіз. Зупиніть його або зачекайте, доки він завершиться.';
$ec_lang['lpn_crit_no_links']='У цьому проєкті ще немає зʼєднань, тож розривати нічого.';
$ec_lang['lpn_crit_no_selection']='Жодного зʼєднання не вибрано. Виберіть зʼєднання або оберіть «Усі зʼєднання».';
$ec_lang['lpn_crit_stopped']='Зупинено після {done} із {total} елементів. Результати нижче — ті, що вже завершені.';
$ec_lang['lpn_crit_working']='Виконується: {done} із {total} елементів.';
$ec_lang['lpn_crit_baseline_below']='Вузли, які вже нижче нього, коли нічого не зламано: {n}. Їх не враховано.';
$ec_lang['lpn_crit_summary']='{n} із {total} елементів залишають споживання непокритим або опускають вузол нижче {pressure}.';
$ec_lang['lpn_crit_col_below']='Вузли нижче мінімуму';
$ec_lang['lpn_crit_col_cutoff']='Відрізані вузли';
$ec_lang['lpn_crit_col_unserved']='Непокрите споживання';
$ec_lang['lpn_crit_col_asset']='Елемент';
$ec_lang['lpn_crit_minpressure_tip']='Це те саме число, що й «Найнижчий допустимий тиск» в інших місцях Аналізу витрати на пожежогасіння. Зміна тут змінює його й там.';
$ec_lang['lpn_crit_minpressure']='Найнижчий допустимий тиск';
$ec_lang['lpn_crit_scope_selected']='Вибрані зʼєднання';
$ec_lang['lpn_crit_scope_all']='Усі зʼєднання';
$ec_lang['lpn_crit_scope_tip']='Усі труби, насоси й клапани або лише вибрані на карті. Оберіть набір перед запуском.';
$ec_lang['lpn_crit_scope']='Зʼєднання для розриву';
$ec_lang['lpn_crit_intro']='Кожен елемент по черзі виводиться з мережі, а мережа розв’язується на показаному на екрані часовому кроці в активному сценарії. У вашому проєкті нічого не змінюється; увесь розрахунок виконується на копії.';
$ec_lang['lpn_crit_title']='Аналіз критичності';
$ec_lang['lpn_crit_menu_tip']='Виводить із мережі кожну трубу, насос і клапан по черзі й показує, що втрачає система.';
$ec_lang['lpn_crit_menu']='Аналіз критичності…';

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
$ec_lang['lpn_file_import_survey_tip']='Зчитує список геодезичних точок з текстового файлу і створює один вузол у кожній точці, беручи налаштування нових елементів для всього, що файл не вказує. Труби не малюються, і жоден рядок ніколи не відкидається без називання. Використовується система координат, яку цей проєкт уже має, геоприв’язана чи ні.';
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
