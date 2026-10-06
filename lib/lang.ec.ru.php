<?php

// Кириллица — All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='доля';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/s';
$ec_lang['u_gpm']='гал/мин';
$ec_lang['u_gradePercent']='% уклона';
$ec_lang['u_grade']='уклон';
$ec_lang['u_in2']='in^2';
$ec_lang['u_inh2o']='in H2O';
$ec_lang['u_in']='in';
$ec_lang['u_knpcm2']='кН/см^2';
$ec_lang['u_knpm2']='кН/м^2';
$ec_lang['u_kpa']='кПа';
$ec_lang['u_lps']='л/с';
$ec_lang['u_m2']='м^2';
$ec_lang['u_m3ps']='м^3/с';
$ec_lang['u_mgd']='MGD';
$ec_lang['u_imgd']='МГД (брит.)';
$ec_lang['u_afd']='акр-фут/сут';
$ec_lang['u_lpm']='л/мин';
$ec_lang['u_cmh']='м^3/ч';
$ec_lang['u_cmd']='м^3/сут';
$ec_lang['u_mh2o']='м вод.ст.';
$ec_lang['u_mld']='Мл/сут';
$ec_lang['u_m']='м';
$ec_lang['u_mm2']='мм^2';
$ec_lang['u_mmh2o']='мм вод.ст.';
$ec_lang['u_mm']='мм';
$ec_lang['u_mps']='м/с';
$ec_lang['u_npm2']='Н/м^2';
$ec_lang['u_pa']='Па';
$ec_lang['u_psf']='фунт/фут^2';
$ec_lang['u_psi']='psi';
$ec_lang['u_bar']='бар';
$ec_lang['u_kgfcm2']='кгс/см^2';
$ec_lang['u_s']='с';
$ec_lang['u_hr']='ч';
$ec_lang['u_day']='сут';
$ec_lang['u_lph']='л/ч';
$ec_lang['u_gph']='гал/ч';
$ec_lang['u_mmph']='мм/ч';
$ec_lang['u_inph']='in/hr';
$ec_lang['u_acft']='акр·фут';
$ec_lang['u_ft3']='ft^3';
$ec_lang['u_m3']='м^3';
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
$ec_lang['menu_brand']='Калькуляторы HawsEDC';
$ec_lang['menu_main_hydraulics']='Гидравлика';
$ec_lang['menu_help']='Справка';
$ec_lang['menu_libre']='Свободное ПО';
$ec_lang['template_welcome']='Оставьте страхи за дверью; здесь говорят на языке любви. Вы не разрушаете всё. Наслаждайтесь также <a target="_blank" href="https://hawsedc.com/download.php">бесплатными инструментами HawsEDC для AutoCAD.</a>';
$ec_lang['template_feedback']='Можете предложить более удачные формулировки на этой странице или что-нибудь ещё? Хотите помочь или научиться создавать такие инструменты? Пожалуйста, напишите мне.';
$ec_lang['template_printable_title']='Печатный заголовок';
$ec_lang['template_printable_subtitle']='Печатный подзаголовок';
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
$ec_lang['consent_body']='Разрешите нам сохранить в этом браузере одну цифру-cookie, чтобы запомнить, что эта страница уже учтена? Она не записывает ничего о вас и ничего из того, что вы вводите. Без неё мы не можем отличить ваш второй визит от первого визита другого человека.';
$ec_lang['consent_accept']='Принять';
$ec_lang['consent_accept_all']='Всегда принимать';
$ec_lang['consent_decline']='Всегда отклонять';
$ec_lang['consent_current_granted']='Вы разрешили это. Мы ограничиваем учёт посещений для этого профиля браузера.';
$ec_lang['consent_current_denied']='Вы отказали в этом. Мы ничего не храним, чтобы ограничить учёт посещений для этого профиля браузера.';
$ec_lang['consent_region_label']='Ваш выбор об ограничении учёта посещений.';
$ec_lang['consent_settings_link']='Настройки файлов cookie';
$ec_lang['privacy_link']='Политика конфиденциальности';
$ec_lang['terms_link']='Условия использования';
$ec_lang['index_main_title']='Бесплатные инженерные калькуляторы онлайн';
$ec_lang['index_meta_desc_plain']='Бесплатные калькуляторы для гидравлических расчётов труб, каналов, водосливов и орошения. Работают прямо в браузере, в том числе офлайн, на 27 языках.';
$ec_lang['calc_set_units']='Установить единицы:';
$ec_lang['calc_set_units_tip']='Устанавливает единицу измерения сразу для всех полей. Без изменения чисел: введённые вами числа остаются точно такими же, но теперь читаются в новой единице измерения. 6 остаётся 6, но теперь означает 6 дюймов вместо 6 миллиметров.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Восстановить значения по умолчанию';
$ec_lang['calc_defaults_confirm']='Сбросить калькулятор на исходные значения по умолчанию?';
$ec_lang['points_data_note']='(или Копировать/Вставить через область данных)';
$ec_lang['points_data_heading']='Данные точек<br />(чтобы увидеть формат, нажмите «Копировать»)';
$ec_lang['points_data_copy']='Копировать';
$ec_lang['points_data_paste']='Вставить';
$ec_lang['calc_inputs']='Входные данные';
$ec_lang['calc_results']='Результаты';
$ec_lang['view_hide_line']='Скрыть эту строку';
$ec_lang['view_printable']='Версия для печати (обновить страницу для восстановления)';
$ec_lang['ec_name_label']='Сохранить этот расчёт:';
$ec_lang['ec_name_placeholder']='Имя';
$ec_lang['ec_name_tip']='Сохраняет входные данные в URL для сохранения в закладках, получения из истории и обмена';
$ec_lang['calc_copy_link']='Копировать ссылку';
$ec_lang['ec_related_calcs']='Похожие калькуляторы:';
$ec_lang['calc_copy_link_done']='Скопировано!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Потери напора в трубе Дарси-Вейсбах';
$ec_lang['dw_main_title']='Бесплатный онлайн-калькулятор потерь напора в трубе Дарси-Вейсбах';
$ec_lang['dw_main_desc']='Потери напора в трубе по Дарси-Вейсбах при заданных диаметре, шероховатости и расходе';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Абсолютная высота шероховатости стенки трубы, e. Типичные значения: сталь (новая) 0,046 мм, сталь (бывшая в употреблении) 0,15 мм, HDPE 0,003 мм, PVC/uPVC 0,0015 мм, бетон 0,3–3 мм.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ м²/с для чистой воды при 20°C">Кинематическая вязкость, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Кинематическая вязкость, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ м²/с для чистой воды при 20°C';
$ec_lang['dw_reynolds_number']='Число Рейнольдса, Re';
$ec_lang['dw_flow_regime']='Режим течения';
$ec_lang['dw_regime_laminar']='ламинарный';
$ec_lang['dw_regime_transitional']='переходный';
$ec_lang['dw_regime_turbulent']='турбулентный';
$ec_lang['dw_friction_factor_method']='Метод коэффициента сопротивления';
$ec_lang['dw_friction_factor']='Коэффициент сопротивления, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Потери напора в трубе Хазен-Уильямс';
$ec_lang['hw_main_title']='Бесплатный онлайн-калькулятор потерь напора в трубе Хазен-Уильямс';
$ec_lang['hw_main_desc']='Потери напора в трубе по Хазен-Уильямс при заданных диаметре, коэффициенте C и расходе';
$ec_lang['hw_hgl_1']='ГГЛ ниже по потоку';
$ec_lang['hw_hgl_2']='ГГЛ выше по потоку';
$ec_lang['hw_elev_up']='Отметка выше по потоку';
$ec_lang['hw_pressure_up']='Давление выше по потоку';
$ec_lang['hw_elev_down']='Отметка ниже по потоку';
$ec_lang['hw_pressure_down']='Давление ниже по потоку';
$ec_lang['hw_pressure_check']='Проверка давления';
$ec_lang['hw_pressure_ok_short']='Положительное давление';
$ec_lang['hw_pressure_neg_short']='Отрицательное давление';
$ec_lang['hw_pressure_neg']='Давление ниже по потоку ниже нуля. ГГЛ опускается ниже трубы, поэтому труба не будет течь полным сечением, и этот результат может быть недействителен.';
$ec_lang['hw_roughness']='Коэффициент Хазен-Уильямс, C';
$ec_lang['hw_note_1']='<dl><dt>Этот калькулятор не учитывает профиль трубы между её двумя концами.</dt><dd>Он использует только введённые вами отметки выше и ниже по потоку. Если местность где-то между ними поднимается выше любого из концов, давление в этой высшей точке будет ниже любого давления, указанного здесь. Чтобы проверить это, выполните расчёт заново для участка от начала трубы до высшей точки.</dd><dd>Там, где ГГЛ опускается ниже трубы, вода находится под отрицательным давлением. Из воды выделяется воздух, тонкостенная труба может смяться, а через стыки может засасываться загрязнённая грунтовая вода. Поддерживайте положительное давление на всей линии и предусмотрите воздушный клапан в каждой высшей точке.</dd><dt>Давление выше по потоку — это граничное условие, которое вы задаёте.</dt><dd>Определите его по манометру, по уровню воды в резервуаре (высота столба воды над трубой) или по характеристике насоса. С ростом расхода насос создаёт меньшее давление, поэтому используйте точку на характеристике, соответствующую расходу, введённому выше.</dd><dt>Суммируйте коэффициенты местных потерь самостоятельно.</dt><dd>Сложите значения K для каждого клапана, колена, тройника, счётчика и входа на линии и введите эту сумму. По ссылке при этом поле приведены типовые значения. На длинном магистральном трубопроводе эти потери малы по сравнению с потерями на трение, но на коротком трубопроводе внутри станции они могут составлять большую часть потерь.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Русло произвольного сечения Маннинга';
$ec_lang['mi_main_title']='Бесплатный онлайн калькулятор русла произвольного сечения по Маннингу';
$ec_lang['mi_main_desc']='Калькулятор равномерного течения по формуле Маннинга в русле произвольного сечения';
$ec_lang['mi_waterSurfaceElevation']='Отметка уровня воды';
$ec_lang['mi_q_617']='<span class="ec-help" title="Составной расход Q с использованием составного n для каждой зоны по Chow 6-17 (равные скорости)">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Точки поперечного сечения';
$ec_lang['mi_groupPoint']='Точка';
$ec_lang['mi_groupSegment']='Сегмент';
$ec_lang['mi_groupRegion']='Зона';
$ec_lang['mi_station']='Пикет';
$ec_lang['mi_elevation']='Отм.';
$ec_lang['mi_n']='n<br />сег-<br />мента';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />граница<br />зоны<br />(Берег)';
$ec_lang['mi_tau']='Дон. кас.<br />напр. τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='Составной<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='Составной n';
$ec_lang['mi_notes_1_def']='Этот калькулятор следует справочному руководству HEC-RAS при расчёте составного n зоны по Chow 1959, стр. 136, уравнение 6-17 (не 6-18).';


$ec_lang['mi_notes_2_term']='Каменное крепление';
$ec_lang['mi_notes_2_def']='Для проектирования каменного крепления используйте Калькулятор трапецеидального канала Маннинга. Этот калькулятор больше подходит для природных сечений.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Расход в трубе по Маннингу';
$ec_lang['mpf_main_title']='Бесплатный онлайн-калькулятор расхода в трубе по Маннингу';
$ec_lang['mpf_main_desc']='Формула Маннинга для равномерного течения в трубе при заданном уклоне и глубине';
$ec_lang['mpf_pipe_diameter']='Диаметр трубы, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Коэффициент шероховатости Маннинга, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Уклон трения, S<sub>f</sub></a><span class="ec-help" title="Иногда равен уклону трубы. Перейдите по ссылке для объяснения (только на английском)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Относительная глубина наполнения, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Расход, Q';
$ec_lang['mpf_flow_tip']='Расход и глубина рассчитаны для бесконечно длинной трубы. Чтобы обеспечить такой расход на входе в трубу, может потребоваться бóльшая глубина уровня подпора. Подробности и видеоурок — в примечаниях ниже.';
$ec_lang['mpf_velocity']='Скорость, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Кинетическая энергия в виде высоты столба воды, v²/2g">Скоростной напор, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Площадь живого сечения, A';
$ec_lang['mpf_pipe_area']='Площадь сечения трубы, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Относительная площадь, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Смоченный периметр, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Гидравлический радиус, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Ширина по зеркалу воды, T';
$ec_lang['mpf_froude_number']='Число Фруда, Fr';
$ec_lang['mpf_shear_stress']='Среднее касательное напряжение, τ';
$ec_lang['mpf_full_flow']='Расход при полном сечении, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Отношение к полному расходу, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Это расход и глубина внутри <em>бесконечно длинной</em> трубы.</dt><dd>Для подачи расхода в трубу может потребоваться значительно большая высота уровня воды. Добавьте не менее 1,5 скоростного напора к глубине уровня подпора или <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">см. 2-минутное руководство</a> по стандартным расчётам водопропускных труб с помощью <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> — бесплатной программы для расчёта водопропускных труб Федерального управления шоссейных дорог США.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Проектируете бытовую канализацию?</dt><dd>См. <a target="_blank" href="/sewslope.php">таблицы минимальных уклонов канализационных труб</a> для труб от 4 до 96 дюймов (от 100 до 2400 мм), приведённые в м/м, мм/м и процентах, а также исследование <a target="_blank" href="/peakfact.php">пиковых коэффициентов для очень малых расходов</a>. Оба документа доступны только на английском языке.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Введите положительное значение целевого Q.';
$ec_lang['mpf_solver_no_solution']='Решение отсутствует: Q превышает пропускную способность трубы при y/d0 = 93.8% (Qmax = {qmax} в выбранных единицах измерения).';
$ec_lang['mpf_solve_btn']='Вычислить';
$ec_lang['mpf_solve_for_flow']='для расхода, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Потери напора в трубе по Маннингу';
$ec_lang['mphl_main_title']='Бесплатный онлайн-калькулятор потерь напора в трубе по Маннингу';
$ec_lang['mphl_main_desc']='Потери напора по формуле Маннинга при полном расходе';
$ec_lang['mphl_pipe_length']='Длина, L';
$ec_lang['mphl_area']='Площадь, A';
$ec_lang['mphl_total_junction_k']='Суммарный коэффициент местных потерь, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Коэффициент потерь, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Коэффициент местных потерь, km. Эти потери возникают в местах соединения труб, на входе, выходе, поворотах и арматуре — термин «местные» иногда переводят как «незначительные», но это вводит в заблуждение: на коротком участке они могут быть равны потерям на трение или превышать их. Типичные значения k: острая входная кромка 0,5, каждый поворот на 45° 0,2–0,3, задвижка (полностью открыта) 0,1, дисковый затвор 0,2, выход (в резервуар или атмосферу) 1,0. Суммируйте все фитинги для получения общего km. Значение по умолчанию 2,0 предполагает один вход, один выход и два поворота на 45°.';
$ec_lang['mphl_friction_slope']='Уклон трения';
$ec_lang['mphl_friction_loss']='Потери на трение, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Местные потери, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Суммарные потери, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='НЭЛ ниже по потоку';
$ec_lang['mphl_egl_2']='НЭЛ выше по потоку';
$ec_lang['mphl_hgl_egl_tip']='Этот результат может быть недействителен там, где труба поднимается выше линии гидравлического уклона.';
$ec_lang['mphl_note_1']='<dl><dt>Этот калькулятор не учитывает профиль трубы между её двумя концами.</dt><dd>Если ГГЛ в какой-либо точке опускается ниже верха трубы, этот расчёт может быть недействителен.</dd><dt>Для условия открытого входа (водопропускная труба) необходимо проверить условия управления на входе.</dt><dd>1. ГГЛ выше по потоку должна быть выше отметки нормальной глубины течения выше по потоку (и выше самой трубы!).</dd><dd>2. Подпор водопропускной трубы лучше представляется НЭЛ, чем ГГЛ выше по потоку.</dd><dd>3. См. <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">2-минутное руководство</a> по простым стандартным расчётам подпора водопропускных труб с помощью <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> — бесплатной программы для расчёта водопропускных труб Федерального управления шоссейных дорог США.</dd><dd>4. Этот расчёт решает только случай управления на выходе: труба течёт полным сечением, и напор задаётся условиями ниже по потоку. Проектирование водопропускной трубы включает определение того, что управляет расчётом — вход или выход, поэтому используйте HY-8 всегда, когда возможен любой из этих случаев.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Трапецеидальный канал Маннинга';
$ec_lang['mtc_main_title']='Бесплатный онлайн калькулятор трапецеидального канала по Маннингу';
$ec_lang['mtc_main_desc']='Формула Маннинга равномерного течения в трапецеидальном канале при заданном уклоне и глубине';
$ec_lang['mtc_bottom_width']='Ширина дна, b';
$ec_lang['mtc_side_slope_1']='Откос 1, z<sub>1</sub> (гориз./верт.)';
$ec_lang['mtc_side_slope_2']='Откос 2, z<sub>2</sub> (гориз./верт.)';
$ec_lang['mtc_channel_slope']='Уклон канала, S';
$ec_lang['mtc_flow_depth']='Глубина потока, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Угол поворота, β</a><span class="ec-help" title="Для подбора каменной наброски. Перейдите по ссылке для схемы."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Плотность относительно воды. Обычно ≈ 2,65 для дробленого камня.">Относительная плотность камня, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Расчётный размер камня, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n для расчётного размера камня (метод Стриклера)';
$ec_lang['mtc_n_blodgett']='n для расчётного размера камня (метод Блодгетта)';
$ec_lang['mtc_n_bathurst']='n для расчётного размера камня (метод Батхёрста)';
$ec_lang['mtc_n_pi']='n для расчётного размера камня (метод Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Блодгетт против Батхёрста';
$ec_lang['mtc_pi_range_check']='Проверка диапазона P&I';
$ec_lang['mtc_pi_ok']='d50 в диапазоне P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 фута (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Вне диапазона';
$ec_lang['mtc_pi_tip']='Экстраполяция за пределы диапазона исходных данных 0,28–0,36 фута, на основе которого выведено это уравнение — используйте как приблизительную проверку, а не как основу для проектирования';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="По Isbash (1936) и Maricopa County, Arizona, US.">Требуемый размер угловатого камня на дне, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="По Isbash (1936) и Maricopa County, Arizona, US.">Требуемый размер угловатого камня, откос 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="По Isbash (1936) и Maricopa County, Arizona, US.">Требуемый размер угловатого камня, откос 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Рассчитывает эту сеть на каждом гидравлическом шаге по времени.';
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="По Maynord, Ruff и Abt (1989). На повороте камень подбирается по скорости в повороте, равной 4/3 от средней, по California Division of Highways (1970); собственное значение Мейнорда 1,5 применяется к естественным руслам.">Требуемый размер угловатого камня, D<sub>50</sub> (Maynord, Ruff и Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Требуемый размер угловатого камня, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Скорость приемлема для допущений равномерного течения.';
$ec_lang['mtc_vel_low']='Скорость низкая — риск заиления.';
$ec_lang['mtc_vel_high']='Скорость высокая и может быть нереалистичной — проверьте эрозию крепления русла, дополнительную глубину на поворотах и потери энергии на расширениях или препятствиях.';
$ec_lang['mtc_iteration_tip']='Выберите вариант шероховатости (рекомендуется Блодгетт–Батхёрст) и вариант расчётного размера камня (рекомендуется Isbash) для автоматического подбора равномерного размера камня под заданный расход. Полное описание метода — в примечаниях ниже; либо введите собственное значение шероховатости (перейдите по ссылке для справки) и не заполняйте размер камня, чтобы пропустить итерацию.';
$ec_lang['mtc_note_1']='<dl><dt>Автоматическая итерация подбора камня и шероховатости</dt><dd>Выберите вариант шероховатости (рекомендуется Блодгетт–Батхёрст) и вариант расчётного размера камня (рекомендуется Isbash). Подберите глубину и коэффициент надёжности камня для получения желаемого расхода с равномерным размером камня. При каждом изменении входного значения запускается итерационный цикл: 1. Шероховатость вычисляется из расчётного размера камня. 2. Требуемое значение шероховатости копируется во входную шероховатость. 3. Расход в канале и требуемый размер камня вычисляются. 4. Расчётный размер камня корректируется. 5. Повторять до достижения малой погрешности в расчётном размере камня.</dd><dt>Базовый калькулятор (без итерации)</dt><dd>Введите желаемое значение шероховатости. Игнорируйте поле ввода расчётного размера камня.</dd></dl>';
$ec_lang['mtc_note_2_term']='Проверка скорости';
$ec_lang['mtc_note_2_def']='Высокая скорость означает высокую удельную энергию от имеющегося перепада. Эта энергия может быть быстро потеряна на расширениях, поворотах или препятствиях. Убедитесь, что это приемлемо для данного участка.';
$ec_lang['mtc_solver_no_solution']='Для заданного Q при этих параметрах канала решение не найдено.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Простой водослив';
$ec_lang['ws_main_title']='Бесплатный онлайн-калькулятор расхода через простой водослив с широким порогом';
$ec_lang['ws_main_desc']='Калькулятор расхода через простой водослив с широким порогом';
$ec_lang['ws_weirLength']='Длина водослива, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Энергия на единицу веса воды — высота столба воды, а не давление">Напор, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Коэффициент водослива, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Примечания';
$ec_lang['ws_notes_we_term']='Уравнение водослива';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Водослив переменного профиля';
$ec_lang['wi_main_title']='Бесплатный онлайн-калькулятор расхода через сегментированный водослив переменного профиля (произвольной глубины)';
$ec_lang['wi_main_desc']='Калькулятор расхода через водослив переменного профиля';
$ec_lang['wi_weirPoints']='Точки водослива';
$ec_lang['wi_pondingHeight']='Высота подпора';
$ec_lang['wi_incrementalFlow']='Приращение расхода';
$ec_lang['wi_cumulativeFlow']='Суммарный расход';
$ec_lang['wi_notes_we_def']='q = если (длина = 0), то 0; иначе если (уклон = 0), то cw*длина*d<sub>0</sub><sup>1.5</sup>; иначе cw/(2.5*уклон) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>), где d<sub>1</sub> и d<sub>0</sub> всегда положительны или равны нулю';
// Orifice Flow
$ec_lang['or_main_menu']='Расход через отверстие';
$ec_lang['or_main_title']='Бесплатный онлайн-калькулятор расхода через отверстие';
$ec_lang['or_main_desc']='Расход через отверстие — свободный или затопленный';
$ec_lang['or_shape_circular']='Круглое';
$ec_lang['or_shape_rectangular']='Прямоугольное';
$ec_lang['or_diameter']='<span class="ec-help" title="Диаметр для круглых; высота для прямоугольных">Диаметр или высота, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Только для прямоугольных отверстий">Ширина, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Дно отверстия">Отметка низа <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Отметка верхнего бьефа';
$ec_lang['or_twe']='Отметка нижнего бьефа';
$ec_lang['or_cd']='Коэффициент расхода, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Отметка центроида';
$ec_lang['or_head']='<span class="ec-help" title="Энергия на единицу веса воды — высота столба воды, а не давление">Действующий напор, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Площадь отверстия, A';
$ec_lang['or_regime']='Проверка режима отверстия';
$ec_lang['or_regime_valid']='Свободное истечение';
$ec_lang['or_regime_submerged']='Затопленное отверстие';
$ec_lang['or_regime_submerged_tip']='TWE выше центроида — режим отверстия по-прежнему действителен';
$ec_lang['or_regime_warn']='Вне режима отверстия';
$ec_lang['or_regime_warn_tip']='Верхний бьеф ниже шелыги';
$ec_lang['or_regime_twe_above_hwe']='Проверьте исходные данные';
$ec_lang['or_regime_twe_above_hwe_tip']='Нижний бьеф (TWE) выше верхнего бьефа (HWE)';
$ec_lang['or_notes_1_term']='Уравнение отверстия';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Для свободного истечения: h = HWE − центроид. Для затопленного истечения (TWE выше низа): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Режим отверстия';
$ec_lang['or_notes_2_def']='Уравнения истечения через отверстие применяются, когда уровень верхнего бьефа выше шелыги (верха) отверстия. Если верхний бьеф ниже шелыги, используйте уравнение водослива.';
$ec_lang['or_notes_3_term']='Коэффициент расхода';
$ec_lang['or_notes_3_def']='C<sub>d</sub> составляет примерно 0,60–0,65 для острокромочных отверстий. Скруглённые или заглублённые входы имеют другие значения. См. <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> или Гидравлическое справочное руководство HEC-RAS.';
$ec_lang['or_notes_4_term']='Затопление';
$ec_lang['or_notes_4_def']='Когда TWE выше низа отверстия, калькулятор автоматически применяет уравнение затопленного отверстия: h = HWE − TWE. Когда TWE на уровне низа или ниже, принимается свободное истечение: h = HWE − центроид.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Микро-ГЭС';
$ec_lang['mhp_main_title']='Бесплатный онлайн-калькулятор мощности микро-ГЭС';
$ec_lang['mhp_main_desc']='Калькулятор выработки мощности русловой микро-ГЭС';
$ec_lang['mhp_gross_head']='Полный напор, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Диаметр напорного трубопровода (подводящей трубы)">Диаметр напорного трубопровода, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Длина, L';
$ec_lang['mhp_efficiency']='КПД установки, η (0–1)';
$ec_lang['mhp_vel_check']='Проверка скорости';
$ec_lang['mhp_hl_check']='Проверка потерь напора';
$ec_lang['mhp_hnet']='Рабочий напор, H<sub>net</sub>';
$ec_lang['mhp_power']='Выходная мощность, P';
$ec_lang['mhp_annual_kwh']='P в виде годовой энергии';
$ec_lang['mhp_vel_low']='Скорость низкая — риск заиления и вовлечения воздуха.';
$ec_lang['mhp_vel_high']='Скорость высокая — проверьте потери в местах перехода, имеющуюся энергию и риск гидравлического удара.';
$ec_lang['mhp_vel_ok_short']='Хорошо';
$ec_lang['mhp_vel_high_short']='Высокая';
$ec_lang['mhp_vel_low_short']='Низкая';
$ec_lang['mhp_vel_ok_tip']='Скорость находится в эффективном диапазоне для расчёта напорного трубопровода.';
$ec_lang['mhp_hl_ok_tip']='Потери напора меньше 10% полного напора. Этот диаметр трубы экономичен.';
$ec_lang['mhp_hl_warn_tip']='Потери напора превышают 10% полного напора. Рассмотрите трубу большего диаметра.';
$ec_lang['mhp_hl_bad_tip']='Потери напора превышают 20% полного напора. Измените диаметр трубы.';
$ec_lang['mhp_notes_1_term']='Потери напора';
$ec_lang['mhp_notes_1_def']='Суммарные потери в напорном трубопроводе (подводящей трубе) h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, где h<sub>f</sub> = f(L/D)(v²/2g) — потери на трение по Дарси–Вейсбаху, а h<sub>m</sub> = k<sub>m</sub>·v²/2g учитывает вход, повороты и задвижки. Рабочий напор H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Скорость';
$ec_lang['mhp_notes_2_def']='Проверьте, что скорость приемлема с учётом располагаемого перепада и стоимости трубы. Слишком низкая скорость может указывать на завышенный диаметр трубы; слишком высокая скорость увеличивает потери на трение и риск гидравлического удара.';
$ec_lang['mhp_notes_3_term']='Допустимые потери напора';
$ec_lang['mhp_notes_3_def']='Потери в напорном трубопроводе (подводящей трубе) менее 10% от полного напора обычно экономически оправданы. Оптимальный компромисс между стоимостью трубы и потерянной мощностью часто составляет 4–6% там, где цена на электроэнергию высока.';
$ec_lang['mhp_notes_6_term']='КПД';
$ec_lang['mhp_notes_6_def']='Типичный КПД установки η составляет от 0,70 до 0,85 для турбин Пелтона и поперечноструйных турбин, распространённых в малой гидроэнергетике. Используйте 0,75 в качестве консервативной первоначальной оценки.';
$ec_lang['mhp_notes_7_term']='Годовая выработка энергии';
$ec_lang['mhp_notes_7_def']='Годовая выработка рассчитана при непрерывной работе на полном расходе (8760 часов/год). Фактическая выработка будет ниже вследствие сезонных колебаний расхода, простоев на техническое обслуживание и коэффициента нагрузки.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Время опорожнения пруда & резервуара';
$ec_lang['odt_main_title']='Бесплатный онлайн-калькулятор времени опорожнения пруда, бассейна и резервуара (через отверстие)';
$ec_lang['odt_main_desc']='Время опорожнения пруда, бассейна или резервуара — выпуск через отверстие, метод конического объёма';
$ec_lang['odt_h1_elev']='Начальная отметка уровня воды';
$ec_lang['odt_a1']='Начальная площадь, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Конечная отметка уровня воды';
$ec_lang['odt_a0']='Площадь на отметке отверстия, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Интерполируется по конической модели на конечной отметке">Конечная площадь, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Проверка конечной отметки';
$ec_lang['odt_h2_ok']='Конечная отметка выше верха отверстия';
$ec_lang['odt_h2_warn']='Конечная отметка на уровне или ниже верха отверстия';
$ec_lang['odt_h2_warn_tip']='Верх отверстия = центроид + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Диаметр (для круглых) или высота (для прямоугольных)">Отверстие, D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Только для прямоугольных">Ширина отверстия, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Время опорожнения (с)';
$ec_lang['odt_t_min']='Время опорожнения (мин)';
$ec_lang['odt_t_hr']='Время опорожнения (ч)';
$ec_lang['odt_t_day']='Время опорожнения (дн)';
$ec_lang['odt_notes_1_term']='Формула';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) даёт время опорожнения от напора H до отверстия. Время опорожнения = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), где H<sub>1</sub> = начальная отметка − отметка отверстия, H<sub>2</sub> = конечная отметка − отметка отверстия.';
$ec_lang['odt_notes_2_term']='Метод';
$ec_lang['odt_notes_2_def']='Метод конического объёма моделирует пруд или бассейн как коническое сечение между начальной площадью A<sub>1</sub> у начального уровня воды и площадью A<sub>0</sub> на отметке центроида отверстия. Площадь A<sub>2</sub> на конечной отметке интерполируется из A<sub>1</sub> и A<sub>0</sub> по модели конического сечения. Время опорожнения от начальной до конечной отметки равно полному времени опорожнения от H<sub>1</sub> до отверстия минус оставшееся время от H<sub>2</sub> до отверстия.';
$ec_lang['odt_h1']='<span class="ec-help" title="Начальная отметка уровня воды минус отметка центроида отверстия">Начальный напор, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Макс. расход, Q<sub>max</sub>';
$ec_lang['odt_vol']='Слитый объём';
$ec_lang['odt_sketch_start']='Начало';
$ec_lang['odt_sketch_end']='Конец';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Расстояние между эмиттерами, S<sub>e</sub>';
$ec_lang['ip_sl']='Расстояние между латералями, S<sub>l</sub>';
$ec_lang['ip_n_e']='Эмиттеров на латераль, n<sub>e</sub>';
$ec_lang['ip_n_l']='Латералей на зону, n<sub>l</sub>';
$ec_lang['ip_d']='Целевая глубина полива, d';
$ec_lang['ip_a_e']='Площадь на один эмиттер, A<sub>e</sub>';
$ec_lang['ip_pr']='Интенсивность полива, PR';
$ec_lang['ip_q_lat']='Расход на латераль, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Расход зоны, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Продолжительность полива (ч)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Фильтрация из канала';
$ec_lang['cs_main_title']='Бесплатный онлайн-калькулятор фильтрационных потерь канала и КПД транспортировки воды';
$ec_lang['cs_main_desc']='Фильтрационные потери канала и КПД транспортировки воды — метод баланса расходов';
$ec_lang['cs_Q_in']='Приток, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Отток, Q<sub>out</sub>';
$ec_lang['cs_L']='Длина участка, L';
$ec_lang['cs_Q_loss']='Расход фильтрационных потерь, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Проверка измерений';
$ec_lang['cs_pct_loss']='Доля потерь';
$ec_lang['cs_Ec']='КПД транспортировки воды, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Оценка КПД';
$ec_lang['cs_Vol_day']='Суточный объём потерь';
$ec_lang['cs_Vol_year']='Годовой объём потерь';
$ec_lang['cs_Q_loss_per_L']='Потери на единицу длины, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Стоимость воды';
$ec_lang['cs_lining_cost']='Стоимость облицовки';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Целевой КПД транспортировки воды после облицовки; доля 0–1">Целевой КПД, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Площадь облицовки, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Годовая стоимость потерь';
$ec_lang['cs_annual_value_recovered']='Годовая восстановленная стоимость';
$ec_lang['cs_lining_total_cost']='Общая стоимость облицовки';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Простая окупаемость = общая стоимость облицовки ÷ годовая восстановленная стоимость">Период окупаемости <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — обнаружена фильтрация';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — измеримых потерь нет';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — проверьте измерения';
$ec_lang['cs_Ec_good']='Хорошо — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Удовлетворительно — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Плохо — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='Метод баланса расходов оценивает фильтрацию путём измерения расхода у входа и выхода канального участка: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. КПД транспортировки воды E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Годовой объём рассчитан при непрерывной работе на полном расходе; фактические потери ниже для сезонных или частично загруженных каналов.';
$ec_lang['cs_notes_2_term']='Оценочные показатели КПД';
$ec_lang['cs_notes_2_def']='Типичные незакреплённые земляные каналы: E<sub>c</sub> = 60–80%. Хорошо ухоженные земляные каналы: 75–85%. Каналы с бетонным лотком: 90–98%. Фильтрационные потери свыше 30% от притока, как правило, обосновывают устройство облицовки. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Окупаемость облицовки';
$ec_lang['cs_notes_3_def']='Введите стоимость воды и стоимость облицовки в любой согласованной валюте. Площадь облицовки = длина участка × смоченный периметр — смоченный периметр поперечного сечения канала на измеренной глубине потока (ширина дна плюс оба смоченных откоса). Годовая восстановленная стоимость предполагает, что облицованный канал достигает целевого E<sub>c</sub> постоянно. Фактический период окупаемости будет больше для сезонных каналов или если облицовка не достигает целевого КПД.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3-е изд. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='О нас';
$ec_lang['install_main_menu']='Установить';
$ec_lang['install_main_title']='Установить EngCalcs';
$ec_lang['install_main_desc']='Добавить на устройство для работы офлайн';
$ec_lang['install_intro']='EngCalcs — это прогрессивное веб-приложение (PWA). После установки все калькуляторы полностью работают без интернета — подключение не требуется.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Откройте любую страницу калькулятора в Chrome.</li><li>Нажмите кнопку <strong>⬇ Установить</strong> на верхней панели навигации либо откройте меню браузера (⋮) и выберите <strong>Добавить на главный экран</strong>.</li><li>В появившемся окне нажмите <strong>Установить</strong>.</li><li>Значок EngCalcs появится на главном экране, и приложение будет работать без интернета.</li>';
$ec_lang['install_now_btn']='⬇ Установить';
$ec_lang['install_prompt_unavailable']='Предложение установить недоступно — используйте меню браузера.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Откройте любую страницу калькулятора в Safari.</li><li>Нажмите кнопку <strong>«Поделиться»</strong> (квадрат со стрелкой вверх).</li><li>Прокрутите вниз и выберите <strong>«На экран «Домой»»</strong>.</li><li>Нажмите <strong>«Добавить»</strong>. Значок EngCalcs появится на главном экране.</li>';
$ec_lang['install_ios_note']='В iOS установка всегда выполняется через меню «Поделиться» — автоматического предложения установки нет.';
$ec_lang['install_desktop_heading']='Компьютер (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Откройте любую страницу калькулятора.</li><li>Нажмите на <strong>значок установки</strong> (⊕ или значок компьютера) в адресной строке браузера либо откройте меню браузера и выберите <strong>«Установить EngCalcs…»</strong></li><li>Нажмите <strong>«Установить»</strong>. EngCalcs откроется в отдельном окне приложения.</li>';
$ec_lang['install_firefox_heading']='Firefox и другие браузеры';
$ec_lang['install_firefox_body']='Firefox не поддерживает установку PWA на компьютере. Вы всё равно можете пользоваться всеми калькуляторами прямо в браузере — после первого посещения страницы автоматически сохраняются в кэш для работы без интернета.';
$ec_lang['install_cached_heading']='Что сохраняется в кэш';
$ec_lang['install_cached_body']='При первой установке EngCalcs все страницы калькуляторов и сопутствующие файлы (скрипты, стили) автоматически сохраняются на вашем устройстве. После этого всё работает без подключения к интернету. Выбранный вами язык запоминается с последнего посещения онлайн.';
$ec_lang['contact_main_menu']='Контакт';
$ec_lang['about_main_title']='Об инженерных калькуляторах HawsEDC';
$ec_lang['about_main_desc']='Миссия, свободное программное обеспечение и вклад';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Миссия</h3><p>Инженерные Калькуляторы HawsEDC бесплатно доступны в интернете с 2010 года. Они созданы для инженеров и полевых работников по всему миру — особенно тех, кто работает в регионах с дефицитом воды, ограниченными ресурсами или слабым обеспечением. Эти инструменты являются частью более широкой гуманитарной миссии: сказать каждому человеку наиболее практичным и эффективным способом, <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">что он любим и дорог навсегда, что ему нечего бояться и что он не разрушит всё</a>.</p><p>Калькуляторы — это средство. Цель — мир, свободный от страданий.</p><h3>Свободное программное обеспечение с открытым исходным кодом</h3><p>Весь код выпущен под <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">Стандартной Общественной Лицензией GNU v3.0 или более поздней версии</a> — свободный в смысле свободы, а не цены. Вы можете использовать, изучать, изменять и распространять код на тех же условиях.</p><p>Сайт, который его обслуживает, бесплатен сегодня и с 2010 года; если однажды этого не получится, программа всё равно останется вашей, и вы сможете запускать её сами.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Исходный Код</h3><p>Полный исходный код общедоступен на GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Там можно просматривать код, сообщать о проблемах или форкнуть репозиторий.</p><h3>Вклад</h3><p>Любая помощь приветствуется. <a href="contact.php">Свяжитесь с Tom Haws</a>.</p><ul><li><strong>Переводы:</strong> Предложите более удачную формулировку. Улучшите или добавьте язык.</li><li><strong>Отчёты об ошибках:</strong> Используйте форму обратной связи на любой странице калькулятора или сообщите о проблеме на GitHub.</li><li><strong>Новые калькуляторы:</strong> Особенно приветствуются идеи гидравлических инженерных инструментов для полевых работников и специалистов по орошению.</li><li><strong>Хостинг:</strong> Если вы можете разместить зеркало этих калькуляторов для региона с ограниченным доступом к интернету, пожалуйста, свяжитесь со мной.</li></ul><h3>Работа без интернета</h3><p>Откройте любой калькулятор один раз, пока вы в сети, и все они продолжат работать, когда сети нет: браузер сохраняет весь набор по ходу работы. Механизм называется <strong>прогрессивное веб-приложение (PWA)</strong>, если захотите о нём почитать. После этого все калькуляторы работают офлайн — интернет не нужен.</p><p>На Android или iOS используйте функцию «Добавить на главный экран» в браузере, чтобы установить EngCalcs как приложение на вашем устройстве. На компьютере ищите значок установки в адресной строке браузера.</p><p>Вы также можете сохранить любой отдельный калькулятор через меню «Сохранить как…» в браузере для разового использования офлайн.</p><h3>Контакт</h3><p>Tom Haws — гидравлический инженер и автор этих калькуляторов.<br />Используйте форму обратной связи на любой странице калькулятора или перейдите к исходному коду на <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Отправить сообщение Tom Haws';
$ec_lang['contactYourName']='Ваше имя:';
$ec_lang['contactYourEmail']='Ваш адрес e-mail:';
$ec_lang['contactSubject']='Тема:';
$ec_lang['contact_message']='Сообщение:';
$ec_lang['contactSpamPrefix']='Пять плюс один равно';
$ec_lang['contactSpamPostfix']='(Пожалуйста, напишите по-английски. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Отправить сообщение';
$ec_lang['contact_success']='Спасибо, что потратили время на письмо.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Проектирование каменного быстротока (Robinson)';
$ec_lang['rc_main_title']='Бесплатный онлайн-калькулятор проектирования каменного быстротока — Robinson (1998)';
$ec_lang['rc_main_desc']='Подбор размера каменной наброски для быстротока — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Уклон дна быстротока, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Расход на единицу ширины у входа в быстроток. Для канала с шириной дна B и полным расходом Q используйте q_t = Q / B.">Суммарный удельный расход, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Пористость каменной наброски, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Плотность относительно воды. Обычно дроблёный гранит или базальт ≈ 2,65. Допустимый диапазон по Robinson: от 2,54 до 2,82.">Относительная плотность камня, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Стандартное отклонение гранулометрического состава. Однородный камень ≈ 1,25. Диапазон по Robinson: 1,15 до 1,47.">Градационное СО SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Подпор (Hp > yn) — это хорошо: снижает эрозию выше по течению. (USDA)">Нормальная глубина во входном канале, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Ур. 1 (S0 < 0,10) или Ур. 2 (0,10–0,40). Действителен: D50 15–278 мм, S0 0,02–0,40. За пределами диапазона: экстраполяция.">Требуемый медианный размер камня, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Применённое уравнение';
$ec_lang['rc_sg_check']='Проверка относительной плотности';
$ec_lang['rc_SD_check']='Проверка градационного СО';
$ec_lang['rc_sg_ok']   ='sg в допустимом диапазоне';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg ниже диапазона Robinson';
$ec_lang['rc_sg_low_tip']='Допустимый диапазон: 2,54–2,82';
$ec_lang['rc_sg_high'] ='sg выше диапазона Robinson';
$ec_lang['rc_sg_high_tip']='Допустимый диапазон: 2,54–2,82';
$ec_lang['rc_SD_ok']   ='SD в допустимом диапазоне';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD ниже диапазона Robinson';
$ec_lang['rc_SD_low_tip']='Допустимый диапазон: 1,15–1,47';
$ec_lang['rc_SD_high'] ='SD выше диапазона Robinson';
$ec_lang['rc_SD_high_tip']='Допустимый диапазон: 1,15–1,47';
$ec_lang['rc_layer']='Толщина слоя наброски (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Радиус кривой гребня (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Длина дуги кривой гребня';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Необходима для конструктивной поддержки камня быстротока. «Минимальная глубина нижнего бьефа, возникающая вследствие сопротивления выходного участка и нижерасположенного канала, достаточна для обеспечения устойчивости наброски на выходном участке.» (Robinson)">Длина водобойной плиты на выходе (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Коэффициент шероховатости Маннинга в быстротоке, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Часть q_t, протекающая через поры камня. Остаток qs течёт по поверхности. По умолчанию np = 0,45 для угловатого дроблёного камня.">Скорость через каменную мантию, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Удельный расход через мантию, q<sub>m</sub>';
$ec_lang['rc_qs']='Поверхностный удельный расход, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Глубина потока над поверхностью наброски, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Подпор (Hp > yn) — это хорошо: снижает эрозию выше по течению. (USDA)">Напор на входном пороге, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Проверка подпора у входа';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — подпор выше по течению';
$ec_lang['rc_pond_ok_tip']='Подпор выше входа в быстроток — это хорошо: он снижает эрозию выше по течению. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — подпора нет — риск эрозии у входа';
$ec_lang['rc_pond_warn_tip']='Подпора выше входа в быстроток нет; возможна эрозия выше по течению. (USDA)';
$ec_lang['rc_eq1']='Ур. 1 (S<sub>0</sub> < 0,10) — пологий уклон';
$ec_lang['rc_eq2']='Ур. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — крутой уклон';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — ниже диапазона валидации Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — выше диапазона валидации Robinson';
$ec_lang['rc_notes_1_term']='Уравнения подбора размера камня';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) разработали два эмпирических уравнения для медианного размера наброски D<sub>50</sub> на основе уклона быстротока и удельного расхода. Уравнение 1 применяется для пологих уклонов (S<sub>0</sub> < 0,10); Уравнение 2 — для крутых уклонов (0,10 ≤ S<sub>0</sub> ≤ 0,40). Оба уравнения требуют q<sub>t</sub> в м²/с и возвращают D<sub>50</sub> в мм. Проверенный диапазон: 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Удельный расход';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> — суммарный удельный расход у гребня быстротока (полный расход на единицу ширины). Для канала с шириной дна B и полным расходом Q приближённо q<sub>t</sub> ≈ Q / B, либо вычислите его из условия критической глубины у входа в быстроток.';
$ec_lang['rc_notes_3_term']='Фильтрационный поток через каменную мантию';
$ec_lang['rc_notes_3_def']='Часть полного расхода проходит через поры каменной наброски (расход через мантию q<sub>m</sub>); остаток течёт по поверхности камня (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). Глубина потока d вычисляется по уравнению Маннинга для поверхностного расхода q<sub>s</sub> с использованием шероховатости быстротока n. Пористость по умолчанию n<sub>p</sub> = 0,45 типична для угловатого дроблёного камня.';
$ec_lang['rc_notes_5_term']='Допустимый диапазон размера камня';
$ec_lang['rc_notes_5_def']='Уравнения разработаны для диапазона D<sub>50</sub> от 15 мм до 278 мм. Результаты за пределами этого диапазона являются экстраполяцией и должны применяться с дополнительной инженерной осторожностью.';
$ec_lang['rc_notes_6_term']='Отметка водобойной плиты на выходе';
$ec_lang['rc_notes_6_def']='Отметка верха наброски на выходном участке должна быть на уровне или ниже отметки дна нижнего канала. Если она выше — выходной камень будет неустойчивым.';

$ec_lang['rc_notes_7_def']='Если нормальная глубина во входном канале меньше напора на пороге (H<sub>p</sub>), требуемого для пропуска q<sub>t</sub>, выше входного порога возникает стеснение потока или подпор. Это, как правило, допустимо — подпор снижает скорость и предотвращает эрозию выше по течению. Для проверки: воспользуйтесь калькулятором водослива, найдите H<sub>p</sub> для заданных q<sub>t</sub> и ширины гребня, затем сравните с нормальной глубиной входного канала. Если H<sub>p</sub> превышает нормальную глубину, подпор возникнет.';
$ec_lang['rc_notes_4_term']='Источник';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS также публикует <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">таблицу Excel</a> на основе того же метода.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Фильтр';
$ec_lang['rc_sketch_top_crest_curve'] = 'Кривая гребня';
$ec_lang['rc_sketch_outlet_apron']    = 'Водобойная плита';
$ec_lang['rc_sketch_radius']          = 'радиус';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Давление в ирригации';
$ec_lang['ip_main_title']='Бесплатный онлайн-калькулятор ирригационного давления и однородности распределения';
$ec_lang['ip_main_desc']='Испытание давления трассы и оценка однородности';
$ec_lang['ip_h_supply']='Давление на подаче';
$ec_lang['ip_elev_supply']='Отметка подачи, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Расход эмиттера по проекту, q<sub>design</sub>';
$ec_lang['ip_h_design']='Давление эмиттера по проекту';
$ec_lang['ip_x']='<span class="ec-help" title="0,5 для стандартных эмиттеров без компенсации давления; близко к 0 для эмиттеров с компенсацией давления">Показатель степени расхода эмиттера, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Тестовая трасса';
$ec_lang['ip_group_reach']='Участок';
$ec_lang['ip_group_upstream']='Верхний';
$ec_lang['ip_group_downstream']='Нижний';
$ec_lang['ip_group_loss']='Потеря';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Отмечено: этот участок является частью тестовой латерали, отводимой отдельными эмиттерами. Не отмечено: этот участок является магистралью, пропускающей поток только к латеральным ветвям, не входящим в тестовый путь.">Лат. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Строки латерали: эмиттеры только в этом участке. Строки магистрали: всего эмиттеров на латеральных ветвях, КРОМЕ данной, отходящих от этого участка. Для участка, расположенного в точке подключения собственной тестовой латерали, это также включает любые латерали, расположенные ниже по магистрали после подключения или соединённые в одной точке (например, латераль с противоположной стороны) — поток через них проходит также через этот же участок перед разделением, независимо от их наличия в этой таблице.">Эмиттеры <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Отметка нижнего (конечного) узла участка. Дополнительная для промежуточных строк (при отсутствии принимается горизонтально / равна узлу выше). Обязательна для последней строки: это отметка последнего эмиттера, которая непосредственно определяет требуемое давление подачи.">Отм. НБ <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Отметка последнего эмиттера (последняя строка) была оставлена пустой и установлена на горизонтальное положение — введите её для получения точного результата';
$ec_lang['ip_press']='Давл.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Полная потеря участка, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Низкое/отрицательное давление — проверьте субатмосферные условия';
$ec_lang['ip_pressure_warn_short']='Низкое';
$ec_lang['ip_pressure_high']='Места с высоким давлением требуют снижения давления';
$ec_lang['ip_pressure_high_short']='Высокое';
$ec_lang['ip_max_head']='Макс. доп. давление';
$ec_lang['ip_max_head_tip']='Участки, где давление превышает это значение, отмечаются. Оставьте поле пустым, чтобы пропустить проверку на высокое давление.';
$ec_lang['ip_h_far']='Давление последнего эмиттера';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Расход, входящий только в смоделированный тестовый путь, не во всю зону/систему — см. Q_zone в разделе «Проектирование полива» ниже для системного итога.">Расход подачи тестовой трассы, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Расход последнего эмиттера, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Средний расход эмиттера (тестовая латераль), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="На сколько выше (или ниже) вы считаете, что типичная/средняя латераль работает по сравнению с этой тестовой латералью. Тестовая латераль специально принята за наихудший случай, поэтому её собственное среднее — смещённо-низкий заменитель полевого среднего — при оставлении на 0, проверка однородности и числа из раздела «Проектирование полива» ниже используют собственное (вероятно оптимистичное) среднее тестовой латерали как есть.">Оценённая Δдавления, среднее по сравнению с тестовой латералью <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral пересчитанный при давлении каждой строки латерали плюс введённое различие давления выше — попытка учесть, что тестовая латераль принята за наихудший случай, не репрезентативную. Используется как для проверки однородности, так и для раздела «Проектирование полива» ниже.">Оценённый полевой средний расход эмиттера, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Расход последнего эмиттера, разделённый на оценённый полевой средний расход эмиттера — той же формы, что классическая равномерность распределения по нижней четверти (среднее нижней группы ÷ среднее совокупности), но вычисленная из небольшого смоделированного образца и пользовательской оценки, не полного полевого статистического образца. Значения на уровне или выше 1 возможны и это не ошибка: это просто означает, что последний эмиттер не является низкой точкой относительно оценённого полевого среднего (например, благоприятный уклон вниз, или оценка Δдавления выше слишком мала).">Проверка однородности, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Давление тестового эмиттера ≥ давления подачи. Это, вероятно, не наихудший эмиттер, либо трубы можно выбрать меньшего диаметра.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Это отличается от нашей оценки стандартного показателя однородности.">Расход последнего эмиттера к расчётному, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Нет решения: требуемое давление подачи превышает введённое давление подачи. Увеличьте давление подачи, уменьшите спрос или используйте трубу большего диаметра.';
$ec_lang['ip_notes_1_def']='Прогнозирует давление в последнем (наиболее удалённом) эмиттере, затем движется вверх по энергетической линии в направлении подачи, участок за участком, добавляя потери на трение и потери местного сопротивления вдоль пути. Отметка и скоростной напор вычисляются в каждом узле для отчёта о действительном давлении там. Прогнозируемое давление на дальнем конце корректируется (методом половинного деления) до совпадения вычисленного требуемого давления подачи с введённым давлением подачи — та же замкнутая задача, решаемая решателем потока труб в калькуляторе Расход в трубе по Маннингу, распространённая на ветвящуюся сеть.';
$ec_lang['ip_notes_2_term']='Магистраль vs. Латеральные участки';
$ec_lang['ip_notes_2_def']='Каждая строка — один участок вдоль единственного гидравлически наихудшего пути (тестовой трассы) от подачи до последнего эмиттера. Магистральный участок пропускает поток только к латеральным ветвям, не входящим в тестовый путь, поэтому его забор — простое произведение (расход по проекту × общее количество эмиттеров на участке) — без чувствительности к локальному давлению. Магистраль — общий магистральный трубопровод, поэтому участок в точке подключения собственной тестовой латерали должен включать не только латерали между её собственными концами, но и любые латерали, расположенные ниже по магистрали за этим подключением, или соединённые в одной точке (например, латераль с противоположной стороны) — поток через них проходит также через этот же участок перед разделением, независимо от их наличия в этой таблице. Участок латерали — отрезок самой тестовой латерали: расход эмиттера вычисляется из действительного локального давления через q = k·H<sup>x</sup>, и потери на трение уменьшаются коэффициентом Кристиансена F(n) для учёта снижения потока по мере забора каждым эмиттером в участке.';
$ec_lang['ip_notes_3_term']='Ограничения';
$ec_lang['ip_notes_3_def']='Моделирует одно фиксированное давление подачи (без кривой насоса), одну тестовую трассу только (не всё поле), и двухпараметрическую кривую эмиттера (установите показатель степени близко к 0, чтобы приблизительно моделировать эмиттер с компенсацией давления). Сообщаются два разных коэффициента, специально разделённые: q<sub>last</sub>/q<sub>avg,field</sub> — проверка однородности, имеющая ту же форму, что классическая равномерность распределения по нижней четверти (среднее нижней группы ÷ среднее совокупности), но вычисленная из собственных смоделированных эмиттеров тестовой латерали, скорректированная введённой оценкой Δдавления, а не полным статистическим полевым образцом — тестовая латераль специально принята за наихудший случай, поэтому её собственное некорректированное среднее занижало бы истинное полевое среднее и делало бы однородность лучше, чем она есть; вход Δдавления существует специально для противодействия этому смещению. Значения на уровне или выше 1 всё ещё возможны (например, оценка Δдавления слишком мала, или благоприятный уклон вниз). q<sub>last</sub>/q<sub>design</sub> — другая, не однородная проверка против номинального расхода производителя — полезна для выявления системы с избыточным или недостаточным давлением в целом, но не замена цифре однородности, поскольку расчётный/номинальный расход не имеет необходимой связи с фактическим средним рабочим давлением системы.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. Стандарты ASAE/ASABE для проектирования микроирригации используют тот же многоточечный подход к потерям на трение.';
$ec_lang['ip_notes_5_term']='Проектирование полива';
$ec_lang['ip_notes_5_def']='Интенсивность полива и расход системы/зоны используют оценённый средний полевой расход эмиттера (q<sub>avg,field</sub> — собственное среднее тестовой латерали, скорректированное введённой оценкой Δдавления), а не предположительную норму: PR = q<sub>avg,field</sub> / A<sub>e</sub>, снабжено скорректированным модельным значением. Расстояние, а также количество латералей и эмиттеров по всей системе — отдельные входные данные здесь потому, что тестовая трасса моделирует только одну наихудшую ветвь, не каждую латераль в поле.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Разветвлённая трубопроводная сеть';
$ec_lang['bpn_main_title']='Бесплатный онлайн-калькулятор давления в разветвлённой трубопроводной сети (без колец)';
$ec_lang['bpn_main_desc']='Расход и давление в разветвлённой (древовидной) трубопроводной сети';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Статический напор подачи: напор источника при нулевом расходе. Уровень воды в резервуаре или баке над отметкой подачи, либо напор насоса при закрытой задвижке. Добавьте точки подачи 2 и 3, чтобы задать характеристику насоса или переменную кривую подачи; инструмент считывает напор при расчётном расходе.';
$ec_lang['bpn_elev_source']='Отметка подачи';
$ec_lang['bpn_q_total']='Общий расход';
$ec_lang['bpn_q_total_tip']='Общий расход, выходящий из источника (сумма всех расходов в сети).';
$ec_lang['bpn_p_min']='Наименьшее давление';
$ec_lang['bpn_p_min_tip']='Наименьшее давление ниже по течению в любой точке сети; критическая точка подачи.';
$ec_lang['bpn_method']='Метод расчёта трения';
$ec_lang['bpn_method_hw']='Хазен-Вильямс';
$ec_lang['bpn_method_dw']='Дарси-Вейсбах';
$ec_lang['bpn_method_manning']='Маннинг';
$ec_lang['bpn_line_table_heading']='Участки трубопровода';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Название этого участка трубопровода. Другие участки ссылаются на него в столбце «Вышестоящий».';
$ec_lang['bpn_upstream']='ID вышестоящего';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID участка, питающего данный. Оставьте пустым, чтобы следовать за участком, указанным строкой выше (простой последовательный трубопровод). Введите здесь ID, чтобы ответвиться от другого участка.';
$ec_lang['bpn_roughness_tip']='Шероховатость трубы для выбранного метода расчёта трения: n Маннинга, C Хазена-Вильямса или высота шероховатости e Дарси-Вейсбаха (длина). Типичная гладкая пластиковая труба: n около 0,009, C около 150, e около 0,0015 мм.';
$ec_lang['bpn_demand']='Расход отбора';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Фиксированный расход, подаваемый в конце (ниже по течению) этого участка.';
$ec_lang['bpn_demand_mult']='Множитель расхода отбора';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Одновременно масштабирует расход отбора на всех участках — для расчёта часа пик или с учётом перспективного роста. Используйте 1, чтобы оставить расходы как введено.';
$ec_lang['bpn_elev_down']='Отм. НБ';
$ec_lang['bpn_q_line']='Расход участка';
$ec_lang['bpn_q_line_tip']='Общий расход, проходящий по этому участку: его собственный расход отбора плюс расходы всех участков ниже по течению, которые он питает.';
$ec_lang['bpn_p_down']='Давл. НБ';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Избыточное давление (напор) в узле ниже по течению этого участка. Отрицательное значение (отмечено) означает давление ниже атмосферного; проверьте проект.';
$ec_lang['bpn_sketch_heading']='Схема сети';
$ec_lang['bpn_source_label']='Источник';
$ec_lang['bpn_line_problem']='Этот участок не соединён с источником: он указывает на неизвестный вышестоящий ID, ссылается сам на себя, повторяет ID, уже использованный другим участком, или образует кольцо. Несоединённые участки остаются нерешёнными.';
$ec_lang['bpn_bad_id_short']='Неверный ID';


$ec_lang['bpn_pressure_warn']='Низкое/отрицательное давление; проверьте условия ниже атмосферного';
$ec_lang['bpn_pressure_warn_short']='Низкое';
$ec_lang['bpn_notes_1_term']='По умолчанию последовательно, ветвление — по необходимости';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Оставьте ID вышестоящего пустым, и участок будет следовать за строкой выше; простой последовательный трубопровод. Введите ID вышестоящего участка, чтобы ответвиться от него. Итак: по умолчанию последовательно, дерево — когда нужно.';
$ec_lang['bpn_notes_2_term']='Только разветвлённые сети, без колец';
$ec_lang['bpn_notes_2_def']='У каждого участка ровно один вышестоящий участок (дерево). Этот инструмент не решает кольцевые сети; для них нужны итерационные методы (EPANET или аналогичные). Отказ от колец — это то, что делает расчёт простым и точным.';
$ec_lang['bpn_notes_3_term']='Без активных регуляторов давления';
$ec_lang['bpn_notes_3_def']='Можно добавить фиксированный клапан местных потерь (коэффициент k), но не редукционные или подпорные клапаны давления (PRV/PSV). Их открытое/закрытое состояние зависит от расхода и давления, что потребовало бы итераций.';


$ec_lang['bpn_supply2_q']='Расход подачи 2';
$ec_lang['bpn_supply2_h']='Напор подачи 2';
$ec_lang['bpn_supply3_q']='Расход подачи 3';
$ec_lang['bpn_supply3_h']='Напор подачи 3';
$ec_lang['bpn_supply_pt_tip']='Необязательные точки кривой подачи 2 и 3. Введите расход и напор для каждой, чтобы смоделировать насос или любой источник, напор которого падает по мере увеличения подачи; инструмент считывает напор при расчётном расходе. Точка 1 выше — статический напор при нулевом расходе. Оставьте 2 и 3 пустыми для постоянного напора резервуара.';
$ec_lang['bpn_h_supply']='Напор подачи';
$ec_lang['bpn_h_supply_tip']='Напор источника при расчётном расходе, считанный с кривой подачи. Равен введённому напору источника, если кривая постоянна (резервуар).';
$ec_lang['bpn_supply1_h']='Статический напор подачи';
$ec_lang['lpn_main_menu']='Сеть водоснабжения';
$ec_lang['lpn_main_title']='Бесплатное онлайн-моделирование сети водоснабжения с расчётным ядром EPANET';
$ec_lang['lpn_main_desc']='Расчёт сети водоснабжения: нарисуйте кольцевую трубопроводную сеть или импортируйте файлы EPANET';
$ec_lang['lpn_title_units']='Единицы измерения {units}';
$ec_lang['lpn_tool_select']='Выбор';
$ec_lang['lpn_tool_add_junction']='Узел';
$ec_lang['lpn_tool_add_reservoir']='Резервуар';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Бак';
$ec_lang['lpn_tool_add_pipe']='Труба';
$ec_lang['lpn_tool_add_pump']='Насос';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Клапан';
$ec_lang['lpn_tool_add_text']='Текст';
$ec_lang['lpn_tool_vertices']='Вершины';
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
$ec_lang['lpn_tool_add_meter_tip']='Щёлкните там, где находится абонент, затем щёлкните трубу или узел, который его обслуживает. Расход отбора, заданный для абонента, добавляется к узлу на ближнем конце этой трубы.';
$ec_lang['lpn_mode_add_meter']='Абонент: щёлкните там, где находится абонент, затем щёлкните трубу или узел, который его обслуживает. Либо нажмите Esc, чтобы отменить.';
$ec_lang['lpn_pane_tab_customers']='Абоненты';
$ec_lang['lpn_customer_heading']='Абонент {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Расход отбора на одно подключение';
$ec_lang['lpn_field_meter_count']='Количество подключений';
$ec_lang['lpn_field_meter_total']='Суммарный расход отбора';
$ec_lang['lpn_field_meter_total_tip']='Расход отбора на одно подключение, умноженный на количество подключений. Именно это число добавляется к узлу, указанному ниже.';
$ec_lang['lpn_field_meter_pipe']='Подключённый элемент';
$ec_lang['lpn_field_meter_pipe_suggest']='Ближайший элемент — {id}. Введите его здесь, чтобы обслуживать этого абонента от него.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Подключён к';
$ec_lang['lpn_field_meter_node_tip']='Узел, к которому подключён этот абонент. Перетащите точку подключения на трубу, чтобы обслуживать его от точки на этой трубе вместо узла.';
$ec_lang['lpn_meter_pipe_unknown']='В этом проекте нет ничего с именем {id}, поэтому абонент остался там, где был.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='В этом проекте нет графика с именем {id}, поэтому абонент остался как был.';
$ec_lang['lpn_meter_placed']='Абонент {id} добавлен. Его описание и расход отбора вводятся в таблице «Абоненты», либо нажмите на него в режиме «Выбор», чтобы открыть его окно.';
$ec_lang['lpn_field_meter_pipe_tip']='Элемент, к которому подключено это подключение. Введите другой элемент здесь или в таблице «Абоненты», чтобы изменить его, либо перетащите точку подключения на другой элемент.';
$ec_lang['lpn_field_meter_station']='Положение на трубе (%)';
$ec_lang['lpn_field_meter_station_tip']='Насколько далеко вдоль трубы подключается подключение, в процентах от первого узла трубы до второго. 0 — у одного конца, 100 — у другого. Кружок на трубе делает то же самое указателем.';
$ec_lang['lpn_field_meter_offset']='Смещение от трубы';
$ec_lang['lpn_field_meter_offset_tip']='Положительное значение — вправо от трубы, если смотреть от её первого узла ко второму. Ввод значения здесь может переместить абонента на другую сторону магистрали, и при этом линия подключения всегда становится перпендикулярной магистрали.';
$ec_lang['lpn_field_meter_lumped']='Добавлено к узлу';
$ec_lang['lpn_field_meter_lumped_tip']='Ближайший узел; расход отбора этого абонента добавляется там.';
$ec_lang['lpn_node_customers']='Расход отбора абонентов';
$ec_lang['lpn_node_customers_tip']='Список абонентов, добавленных к этому узлу (потому что он оказался ближайшим). Расход отбора абонентов добавляется к другим расходам отбора, перечисленным здесь. Абонент редактируется там, где он находится на карте, или в таблице «Абоненты».';
$ec_lang['lpn_node_customers_sum']='{total} {unit} от {n} абонентов';
$ec_lang['lpn_customer_detached']='⚠ Этот абонент не подключён к трубе, поэтому его расход отбора не учтён в ответах. Удалите его либо начертите трубу и переместите абонента на неё.';
$ec_lang['lpn_customer_fixed_head']='⚠ Ближний конец этой трубы имеет фиксированный уровень воды, поэтому этот расход отбора не влияет на расчёт.';
$ec_lang['lpn_customer_detached_count']='{n} абонентов не подключены к трубе. Их расход отбора не учтён.';
$ec_lang['lpn_meter_pick_pipe']='Теперь щёлкните трубу или узел, который обслуживает этого абонента. Абонент останется там, где вы его разместили. Нажмите Escape, чтобы отменить.';
$ec_lang['lpn_inp_export_flat_customers']='В файле EPANET нет абонентов. Расход отбора {n} абонентов в этом проекте попадает в файл в виде строки расхода отбора на узле, к которому подключён каждый абонент, и каждая строка называется тегом абонента. Чего файл не может хранить, так это самого абонента: где он находится, какая труба его обслуживает, где вдоль этой трубы подключается его подключение и сколько подключений представляет собой один абонент. Ваш собственный файл проекта хранит всё это.';

$ec_lang['lpn_area_hint_window_start']='Щёлкните по одному углу окна выбора.';
$ec_lang['lpn_area_hint_window_go']='Щёлкните по противоположному углу, чтобы завершить.';
$ec_lang['lpn_area_hint_lasso_start']='Щёлкните, чтобы начать обводку.';
$ec_lang['lpn_area_hint_lasso_go']='Двигайте указатель, чтобы нарисовать контур. Щёлкните, чтобы завершить.';
$ec_lang['lpn_area_hint_polygon_start']='Щёлкните, чтобы нарисовать многоугольную область. Дважды щёлкните, чтобы завершить.';
$ec_lang['lpn_area_hint_polygon_go']='Щёлкайте по каждому углу. Дважды щёлкните по последнему, чтобы завершить.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Удерживайте Shift во время выбора, чтобы дополнить текущее выделение, добавляя или убирая (переключая) то, что вы выбираете.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Нажмите на карту и обведите то, что хотите выбрать, затем отпустите.';
$ec_lang['lpn_area_hint_touch_go']='Обведите то, что хотите выбрать, затем отпустите, чтобы завершить.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Показывать это';
$ec_lang['lpn_multi_title']='Выбрано: {n}';
$ec_lang['lpn_multi_varies']='Разное';
$ec_lang['lpn_multi_applied']='Установлено «{prop}» для {n}.';
$ec_lang['lpn_multi_no_fields']='У них нет общих свойств, которые можно задать здесь одновременно.';
$ec_lang['lpn_pane_pasted']='Вставлено ячеек: {n}. Не изменено: {skipped}.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Вставлено строк: {n}, добавлено в сеть: {created}.';
$ec_lang['lpn_pane_pasted_rows_skipped']='Вставлено строк: {n}, добавлено в сеть: {created}. Не изменено ячеек: {skipped}.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Щёлкните здесь и вставьте строки из электронной таблицы, чтобы добавить их.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Вставить как новые строки в конец таблицы';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Нажмите Ctrl+V, чтобы добавить скопированные строки в конец этой таблицы. Нажмите Esc, чтобы отменить.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='В этой вставке {n} строк, и {fit} из них помещаются в таблицу. Добавить остальные {extra} как новые строки в конец?';
$ec_lang['lpn_pane_paste_overflow_add']='Добавить строк: {extra}';
$ec_lang['lpn_pane_paste_overflow_fit']='Вставить только {fit}, которые помещаются';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='В этой вставке {n} строк, и {fit} из них помещаются в таблицу. Остальные {extra} нельзя добавить как новые строки: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} идентификаторов не совпадают. Всё равно вставить?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Ничего не вставлено. {reasons}';
$ec_lang['lpn_pane_paste_more']='Строк с проблемами, не показанных здесь: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Строка {row}: новой строке нужен ID.';
$ec_lang['lpn_pane_paste_bad_id']='Строка {row}: в ID {id} есть пробел или кавычка.';
$ec_lang['lpn_pane_paste_id_taken']='Строка {row}: ID {id} уже используется.';
$ec_lang['lpn_pane_paste_id_twice']='Строка {row}: ID {id} используется в этой вставке дважды.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Строка {row}: новому узлу нужны и {first}, и {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Строка {row}: новой связи нужны узел «От» и узел «До».';
$ec_lang['lpn_pane_paste_no_node']='Строка {row}: узел {id} ещё не существует. Сначала вставьте узлы, затем связи.';
$ec_lang['lpn_pane_paste_same_ends']='Строка {row}: «От» и «До» — один и тот же узел.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Строка {row}: {text} — недопустимое значение для «{col}».';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Строка {row}: новому тексту нужны и {first}, и {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Строка {row}: {id} — это ещё не узел и не труба в этой сети. Сначала вставьте его, затем этот текст.';
$ec_lang['lpn_pane_paste_customer_no_position']='Строка {row}: новому абоненту нужны и {first}, и {second}.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Строка {row}: новому абоненту нужна подключённая труба или узел.';
$ec_lang['lpn_pane_paste_no_pipe']='Строка {row}: труба {id} ещё не существует. Сначала вставьте трубы, затем абонентов.';
$ec_lang['lpn_pane_paste_no_customer_node']='Строка {row}: узел {id} ещё не существует. Сначала вставьте узлы, затем абонентов.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Строка {row}: у узла {id} нет трубы, к которой можно подключить абонента.';

$ec_lang['lpn_pane_filled']='Заполнено вниз ячеек: {n}. Не изменено: {skipped}.';
$ec_lang['lpn_pane_filldown']='Заполнить вниз';
$ec_lang['lpn_pane_fill_none']='В этом выделении нечего заполнять вниз.';
$ec_lang['lpn_pane_ctrlenter_filled']='Заполнено ячеек: {n}. Не изменено: {skipped}.';
$ec_lang['lpn_pane_hide_col']='Скрыть этот столбец';
$ec_lang['lpn_pane_hide_cols']='Скрыть эти столбцы';
$ec_lang['lpn_pane_show_all_cols']='Показать все столбцы';
$ec_lang['lpn_pane_sort_asc']='Сортировать по возрастанию';
$ec_lang['lpn_pane_manage_cols']='Управление столбцами…';
$ec_lang['lpn_pane_manage_cols_title']='Управление столбцами';
$ec_lang['lpn_pane_manage_cols_show']='Показывать';
$ec_lang['lpn_pane_manage_cols_up']='Переместить вверх';
$ec_lang['lpn_pane_manage_cols_down']='Переместить вниз';
$ec_lang['lpn_pane_manage_cols_top']='Переместить в начало';
$ec_lang['lpn_pane_manage_cols_bottom']='Переместить в конец';
$ec_lang['lpn_pane_colmenu_tip']='Скрыть столбцы или управлять ими';
$ec_lang['lpn_tool_area_window']='Выбрать окном';
$ec_lang['lpn_tool_area_lasso']='Выбрать лассо';
$ec_lang['lpn_tool_area_polygon']='Выбрать многоугольником';
$ec_lang['lpn_tool_delete']='Удалить';
$ec_lang['lpn_tool_zoom_extent']='Показать всё';
$ec_lang['lpn_tool_zoom_window']='Окно масштабирования';
$ec_lang['lpn_zoom_in']='Увеличить';
$ec_lang['lpn_zoom_out']='Уменьшить';
$ec_lang['lpn_new_text']='Текст';
$ec_lang['lpn_field_text_bold']='Жирный текст';
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
$ec_lang['lpn_field_text_anchor']='Прикреплено к';
$ec_lang['lpn_field_text_align']='Горизонтальное выравнивание';
$ec_lang['lpn_field_text_align_left']='Слева';
$ec_lang['lpn_field_text_align_center']='По центру';
$ec_lang['lpn_field_text_align_right']='Справа';
$ec_lang['lpn_field_text_valign']='Вертикальное выравнивание';
$ec_lang['lpn_field_text_valign_top']='Сверху';
$ec_lang['lpn_field_text_valign_middle']='Посередине';
$ec_lang['lpn_field_text_valign_bottom']='Снизу';
$ec_lang['lpn_field_text_rotation']='Угол (градусы)';
$ec_lang['lpn_field_text_match_pipe']='Повернуть на угол ближайшей трубы';
$ec_lang['lpn_field_text_flip']='Повернуть на 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Прикреплённый элемент';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Этот текст был помещён достаточно близко к элементу, чтобы следовать за ним, поэтому он перемещается вместе с этим элементом и снабжён выносной линией. Текст на выносной линии берёт своё горизонтальное и вертикальное выравнивание от той стороны, на которой он расположен, поэтому эти два параметра не предлагаются, пока он прикреплён.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Коэффициент капельницы';
$ec_lang['lpn_field_emitter_tip']='Дополнительный отток, зависящий от давления: для дождевателя, открытого выпуска или смоделированной утечки. Расход через него равен этому коэффициенту, умноженному на давление в степени показателя капельницы, который задаётся один раз для всей сети в разделе «Настройки» → «Расчёт» → «Гидравлика». Оставьте поле пустым для обычного узла.';
$ec_lang['lpn_field_elev']='Отметка';
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
$ec_lang['lpn_field_head']='Напор';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Уровень воды в резервуаре, выраженный как высота, а не как давление. Оставьте поле пустым, чтобы уровень воды совпал с отметкой резервуара.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='Отметка дна бака. Глубины воды в баке отсчитываются вверх от этой точки.';
$ec_lang['lpn_field_tank_level']='Глубина воды';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Глубина воды в баке, отсчитываемая вверх от дна бака.';
$ec_lang['lpn_field_tank_minlevel']='Наименьшая глубина воды';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Минимально допустимая глубина, отсчитываемая вверх от дна бака.';
$ec_lang['lpn_field_tank_maxlevel']='Наибольшая глубина воды';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Максимально допустимая глубина, отсчитываемая вверх от дна бака.';
$ec_lang['lpn_field_tank_diameter']='Диаметр бака';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Для вертикального цилиндра. В тех же единицах, что и отметка, а не в единицах диаметра трубы. Определяет, сколько воды содержится при данной глубине.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Отметка поверхности воды в баке: отметка дна бака плюс глубина воды.';
$ec_lang['lpn_close']='Закрыть';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Свойства';
$ec_lang['lpn_empty_hint']='Чтобы открыть пример, используйте «Файл» → «Новый проект». Либо начните с добавления резервуара, узла и трубы на панели инструментов.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Ваша сеть цела.';
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
$ec_lang['lpn_examples_welcome']='Добро пожаловать в моделирование сетей водоснабжения с расчётным ядром EPANET';
$ec_lang['lpn_examples_heading']='Открыть свою копию примера';
$ec_lang['lpn_examples_sub']='Каждый пример открывается как ваша собственная копия. Измените её, сохраните или откройте новую копию и начните заново.';
$ec_lang['lpn_examples_open']='Открыть';
$ec_lang['lpn_examples_menu']='Открыть пример…';
$ec_lang['lpn_examples_blank']='Или начните здесь';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='Узлов: {nodes}, связей: {links}';
$ec_lang['lpn_examples_failed']='Не удалось загрузить примеры. Чтобы начать чертёж, используйте «Файл» → «Новый проект».';
$ec_lang['lpn_examples_loading']='Загрузка примеров…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Устранение проблем';
$ec_lang['lpn_help_notes']='Заметки об этой странице';
$ec_lang['lpn_help_hotkeys']='Таблицы и горячие клавиши';
$ec_lang['lpn_hotkeys_tables_heading']='Таблицы';
$ec_lang['lpn_hotkeys_map_heading']='Карта';
$ec_lang['lpn_hotkeys_map_term']='Горячие клавиши карты';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 или Esc</td><td>Выбрать.</td></tr><tr><td>2</td><td>Добавить узел.</td></tr><tr><td>3</td><td>Добавить резервуар.</td></tr><tr><td>4</td><td>Добавить бак.</td></tr><tr><td>5</td><td>Добавить трубу.</td></tr><tr><td>6</td><td>Добавить насос.</td></tr><tr><td>7</td><td>Добавить клапан.</td></tr><tr><td>8</td><td>Добавить потребителя.</td></tr><tr><td>9</td><td>Добавить текст.</td></tr><tr><td>Delete</td><td>Удалить выделенное.</td></tr><tr><td>Ctrl+Z</td><td>Отменить последнее изменение.</td></tr><tr><td>+ или =</td><td>Приблизить.</td></tr><tr><td>-</td><td>Отдалить.</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Что-то не так?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Одно нажатие сообщает нам, что на этой странице что-то не так. Оно отправляет название этой страницы, язык, на котором вы её читаете, и сообщение на карте, если оно есть. Оно не отправляет ничего из введённого вами, никакого адреса и вообще ничего из вашего чертежа. Никто не сможет вам ответить, потому что это ничего не сообщает о том, кто вы. Используйте «Справка» → «Устранение проблем», если хотите сказать больше.';
$ec_lang['lpn_wrong_thanks']='Спасибо. Сообщение получено.';
$ec_lang['lpn_status_example_opened']='Открыт пример «{name}». Это ваша копия: сохраните её через «Файл» → «Сохранить как».';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Эта страница не смогла определить размер области чертежа, поэтому карта показывает последний вид, который удалось вычислить. Изменение размера окна заставит её попробовать снова. Если это повторяется, обычная причина — расширение браузера, блокирующее измерение страницы.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Простая сеть, л/с (СИ)';
$ec_lang['lpn_ex_basic_si_desc']='Начните отсюда. Резервуар, насос и небольшое кольцо — самая простая схема, которая всё ещё работает как сеть водоснабжения. Литры в секунду, метры и миллиметры.';
$ec_lang['lpn_ex_basic_us_title']='Простая сеть, гал/мин (США)';
$ec_lang['lpn_ex_basic_us_desc']='Та же исходная сеть в галлонах в минуту, с футами и дюймами.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 с управлением по правилам';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Самая простая из трёх собственных примерных сетей EPANET: один резервуар, насос и одно кольцо.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Разветвлённая распределительная сеть с баком, из примеров EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Большой пример EPANET: 92 узла, 3 бака и 2 резервуара, один из них — река. Стоит открыть, чтобы увидеть, как сеть реального размера выглядит на карте.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, широта/долгота';
$ec_lang['lpn_ex_net3_world_desc']='Сеть EPANET Net3, преобразованная в широту/долготу и размещённая в Новато, Калифорния, с картой мира на фоне.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Коммерческий объект, рассчитанный на расход при пожаротушении сверх максимального суточного водопотребления, в один момент времени, начерченный поверх плана участка.';
$ec_lang['lpn_tool_undo']='Отменить';
$ec_lang['lpn_confirm_example']='Это добавит пример к уже имеющейся у вас сети. Продолжить?';
$ec_lang['lpn_field_diameter']='Диаметр';
$ec_lang['lpn_demand_tip']='Расход, забираемый из сети в этом узле. Введите отрицательное число для расхода, подаваемого в сеть здесь.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Эта единица измерения определяет, что означают ваши числа';
$ec_lang['lpn_units_warn_lead']='{unit} — это единица измерения того, что вы вводите для:';
$ec_lang['lpn_units_options_head']='При изменении единицы измерения:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Без преобразования';
$ec_lang['lpn_units_nondestructive_desc']='Без преобразования: оставляет все введённые значения без изменений и переосмысливает их в новой единице измерения.';
$ec_lang['lpn_units_destructive']='С преобразованием';
$ec_lang['lpn_units_destructive_desc']='С преобразованием: пересчитывает все введённые значения по формуле перевода единиц, поэтому сеть остаётся физически почти такой же, в пределах погрешности пересчёта. Исходные значения при этом теряются. Отмена вернёт их обратно.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='Теперь {n} значений означают {unit}. Ничего не было переписано.';
$ec_lang['lpn_status_converted']='{n} значений было переписано в {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Длина';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Координаты карты';
$ec_lang['lpn_units_mapcoords_deg']='градусы';
$ec_lang['lpn_units_usft']='Геодезический фут США';
$ec_lang['lpn_units_elevhead']='Отметка и напор';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Гидравлический уклон';
$ec_lang['lpn_result_gradient_tip']='Потери напора, делённые на длину трубы. Используйте это значение, чтобы сравнивать трубы разной длины по одному расчётному пределу.';
$ec_lang['lpn_result_water_age']='Возраст воды';
$ec_lang['lpn_result_water_age_tip']='Как долго вода, дошедшая до этой точки, находится в системе. Там, где потоки сходятся, прибывающая вода несёт смесь возрастов, и число здесь — их среднее значение, взвешенное по расходу: узел, питаемый в основном коротким новым водоводом, показывает малый возраст, даже если его также питает длинный тупиковый участок. В баке это средний возраст хранящейся воды, поэтому бак с медленным водообменом обычно содержит самую старую воду в сети. Нормативного предела для сравнения нет, поэтому оценивайте это число по своей собственной системе.';
$ec_lang['lpn_result_source_share']='Доля источника';
$ec_lang['lpn_result_source_share_tip']='Какая доля воды, дошедшей до этой точки, пришла от узла трассировки. Это то, что показывает анализ «Трассировка источника».';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Средний возраст воды';
$ec_lang['lpn_result_avg_source_share']='Средняя доля источника';
$ec_lang['lpn_result_avg_concentration']='Средняя концентрация';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Коэффициент сопротивления';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Скорость реакции';
$ec_lang['lpn_result_status']='Состояние';
$ec_lang['lpn_result_status_open']='Открыто';
$ec_lang['lpn_result_status_closed']='Закрыто';
$ec_lang['lpn_result_head']='Напор';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Энергия воды в этом узле, выраженная как высота водяного столба. Это абсолютная высота, в отличие от давления, которое измеряется манометром.';
$ec_lang['lpn_result_pressure']='Давление';
$ec_lang['lpn_result_flow']='Расход';
$ec_lang['lpn_result_velocity']='Скорость';
$ec_lang['lpn_result_headloss']='Потери напора';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Сбрасывает только настройки этого проекта. Ваш чертёж и другие проекты не изменяются. Чтобы сохранить любимые настройки для повторного использования, сохраните файл проекта, в котором нет ничего, кроме настроек.';
$ec_lang['lpn_reset_all_tip']='Удаляет все проекты, все фоновые изображения, все настройки и выбранные вами единицы измерения, затем перезагружает страницу именно так, как её видит новый посетитель. Это единственный сброс, который очищает всё.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Этот калькулятор хранит единицы измерения и введённые значения проекта в том виде, в котором они были введены, но раньше числа при сохранении переводились в единицы СИ. Этот проект был сохранён до этого изменения, поэтому его числа хранятся в единицах СИ. Перевести их в текущие единицы в последний раз? Чтобы вы могли оценить результат, вот несколько диаметров, которые будут переведены, с их значениями до и после:';
$ec_lang['lpn_v2_restore_yes']='Перевести';
$ec_lang['lpn_v2_restore_never']='Нет. Больше не спрашивать.';
$ec_lang['lpn_v2_restore_no']='Закрыть, чтобы я сначала проверил текущие единицы измерения';
$ec_lang['lpn_storage_too_new']='Этот проект был сохранён более новой версией страницы, поэтому его нельзя открыть здесь.';
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
$ec_lang['lpn_basemap_show']='Показать карту улиц';
$ec_lang['lpn_basemap_satellite_show']='Показать спутниковые снимки';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='с географической привязкой';
$ec_lang['lpn_xymap']='локальный';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Преобразовать как…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Копия {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Преобразовать как';
$ec_lang['lpn_convas_coordsys_tip']='Система координат, в которую преобразуется копия. Если она отличается от системы координат этого проекта, далее следуют два шага размещения. Проект, который уже знает, где он находится, открывает оба шага с уже готовыми ответами, поэтому вы можете принять их как есть или изменить.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Текущая: {crs}';
$ec_lang['lpn_convas_epsg']='Система координат EPSG';
$ec_lang['lpn_convas_epsg_tip']='Выберите систему координат из реестра EPSG. Широта и долгота — это WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Без названия (локальная) географическая привязка';
$ec_lang['lpn_convas_unnamed_tip']='Локальные координаты в единице длины, с прикреплённой мировой картой.';
$ec_lang['lpn_convas_none_tip']='Локальные координаты в единице длины, пока без мировой карты.';
$ec_lang['lpn_convas_units_tip']='Единицы измерения, в которые преобразуется копия. Оригинал сохраняет свои собственные числа и единицы измерения.';
$ec_lang['lpn_convas_round']='Округлять преобразованные значения';
$ec_lang['lpn_convas_round_tip']='Округляет только те числа, которые переписывает это преобразование, до ближайшего выбранного вами шага. Значения, единица которых не меняется, остаются как есть.';
$ec_lang['lpn_convas_round_none']='Без округления';
$ec_lang['lpn_convas_round_flow']='Расход отбора и расход';
$ec_lang['lpn_convas_label_col']='Суффикс';
$ec_lang['lpn_convas_label_tip']='Текст, добавляемый после этого значения на подписях карты копии, например «мм» или «gpm». Предзаполняется из единицы, выбранной выше; очистите его, чтобы не было суффикса.';
$ec_lang['lpn_convas_oneway']='Обратное преобразование — это новое преобразование, а не отмена. Число, преобразованное и преобразованное обратно, может не вернуться в точности таким, каким оно было введено.';
$ec_lang['lpn_convas_ok']='Преобразовать';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} — одна из немногих перечисленных систем координат без пригодной для использования информации о проекции, поэтому преобразовать в неё или из неё нельзя. Ничего не преобразовано.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='Преобразованная копия — {name}. Исходный проект не изменён.';
$ec_lang['lpn_convas_cancelled']='Ничего не преобразовано. Копия закрыта, исходный проект не изменён.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Копирует этот проект на новую вкладку и преобразует копию в выбранные вами систему координат и единицы измерения. Если система координат меняется, мастер проведёт вас через приблизительное масштабирование карты под вашей сетью, а затем более точное масштабирование и поворот сети на карте. Этот проект остаётся точно таким, какой он есть. Чтобы выполнить географическую привязку без каких-либо преобразований, используйте «Карта» → «Мировая карта» → «Прикрепить».';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Этот проект уже имеет географическую привязку, поэтому сеть уже на карте и ничего не было перемещено. Проверьте, что она находится в нужном месте, затем нажмите кнопку «Поместить модель сюда» и кнопку «Сохранить это положение».';
$ec_lang['lpn_georef_intro']='Размещение модели состоит из двух шагов. Шаг 1 — быстрый: модель остаётся на месте, а вы перемещаете карту под ней, пока ваш участок не окажется под моделью примерно нужного размера. Поворота пока нет. Шаг 2 — точный: вы перетаскиваете, изменяете размер и поворачиваете саму модель. Изначально ваш проект находится на карте всего мира, поэтому сначала найдите своё место, затем нажмите кнопку «Поместить модель сюда».';
$ec_lang['lpn_georef_adjust']='Модель теперь привязана к местности, поэтому она перемещается вместе с картой. Перетащите модель, чтобы переместить её, перетащите угол, чтобы изменить размер, перетащите круглый маркер над моделью, чтобы повернуть её. Либо введите расстояние на местности и угол поворота ниже.';
$ec_lang['lpn_georef_step1']='Шаг 1 из 2 — быстро';
$ec_lang['lpn_georef_step2']='Шаг 2 из 2 — точно';
$ec_lang['lpn_georef_step1_hint']='Ваш проект остаётся на том же месте на экране. Панорамируйте и масштабируйте карту под ним, пока местность под ним примерно не окажется в нужном месте и не станет примерно нужного размера, затем нажмите «Поместить модель сюда».';
$ec_lang['lpn_georef_detach']='Открепить снова';
$ec_lang['lpn_georef_size_prompt']='Какова примерная ширина участка по всему проекту?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Быстрая клавиша: нажмите {key}.';
$ec_lang['lpn_tool_key_hint_two']='Быстрая клавиша: нажмите {key} или {key2}.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Щёлкайте по карте, как указано, чтобы выбрать всё внутри фигуры. Нажмите эту кнопку ещё раз, чтобы переключить форму между окном, лассо и многоугольником. Удерживайте Shift во время выбора, чтобы дополнить текущее выделение, добавляя или убирая (переключая) то, что вы выбираете.';
$ec_lang['lpn_area_selected']='Выбрано: {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='В этой области ничего не найдено.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Добавляйте и убирайте вершины, которые задают форму трубы на карте. Щёлкните по трубе, чтобы добавить вершину, щёлкните по вершине, чтобы убрать её, и перетащите вершину, чтобы переместить её. Вершина меняет только начертанный путь трубы, а не гидравлику.';
$ec_lang['lpn_tool_undo_tip']='Отменить последнее изменение.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Вписать всю сеть в окно.';
$ec_lang['lpn_tool_zoom_window_tip']='Щёлкните два противоположных угла прямоугольника или перетащите один, чтобы приблизить карту к нему. Нажмите эту кнопку ещё раз для команды «Показать всё».';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Увеличить. Сочетание клавиш: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Уменьшить. Сочетание клавиш: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Найдите элемент по его ID или найдите все элементы, удовлетворяющие условию, и измените их все сразу.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Легенда панели инструментов';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Видимость';
$ec_lang['lpn_color_legend_open_tip']='Щёлкните, чтобы открыть панель «Видимость» и изменить эти цвета.';
$ec_lang['lpn_color_node_field']='Раскрашивать узлы по';
$ec_lang['lpn_color_link_field']='Раскрашивать трубы по';
$ec_lang['lpn_color_ramp_sequential']='Последовательная';
$ec_lang['lpn_color_ramp_diverging']='Расходящаяся';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Число диапазонов';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Распределение диапазонов';
$ec_lang['lpn_color_ranges_note']='Границы ниже фиксируются после установки: они не следуют за результатами при их изменении. Выбор метода классификации данных выше задаёт границы по текущему состоянию системы. Если вы измените любое значение вручную, метод выше становится «Вручную».';
$ec_lang['lpn_color_criterion_note']='Этот метод берёт свои границы из проектного стандарта, поэтому при его выборе число цветов фиксировано.';
$ec_lang['lpn_color_break_number']='Граница должна быть числом. Карта не изменена.';
$ec_lang['lpn_color_break_order']='Каждая граница должна быть больше предыдущей. Карта не изменена.';
$ec_lang['lpn_color_break_count']='Границ должно быть на одну меньше числа цветов. Карта не изменена.';
$ec_lang['lpn_color_ramp_qualitative']='Качественная';
$ec_lang['lpn_color_ramp_rainbow']='Радуга';
$ec_lang['lpn_color_ramp_rainbow_eg']='как в EPANET';
$ec_lang['lpn_color_example_material']='Материал';
$ec_lang['lpn_color_ramp_ylgnbu']='От жёлтого к синему';
$ec_lang['lpn_color_ramp_rdylbu']='От красного к синему через жёлтый';
$ec_lang['lpn_georef_drop']='Поместить модель сюда';
$ec_lang['lpn_georef_finish']='Сохранить это положение';
$ec_lang['lpn_georef_scale']='Расстояние на местности на единицу чертежа';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Какое расстояние на местности соответствует одной единице вашего чертежа. Чертёж, сделанный на обычной сетке, обычно ничего об этом не говорит, поэтому задайте это здесь — либо позвольте команде «Перейти к…» спросить у вас ширину участка и вычислить это значение самой.';
$ec_lang['lpn_georef_rotation']='Поворот против часовой стрелки (градусы)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='На сколько повернуть всю модель против часовой стрелки, чтобы её север указывал на север.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Разместить модель здесь окончательно? Вы всё ещё сможете перетаскивать отдельные элементы, но чертёж перестанет быть xy-проектом. Чтобы вернуть xy, закройте этот проект без сохранения.';
$ec_lang['lpn_georef_done']='Теперь это проект в формате широта/долгота. Перетащите любой элемент, чтобы приблизить его к тому месту, где он находится на самом деле.';
$ec_lang['lpn_georef_backdrop_unrotated']='Фоновое изображение было перемещено и изменено в размере вместе с моделью, но повернуть его не удалось. Используйте «Карта, Фоновое изображение, Переместить», чтобы выровнять его.';
$ec_lang['lpn_georef_empty']='В этом файле нет сети, поэтому размещать нечего.';
$ec_lang['lpn_georef_unavailable']='Инструмент привязки не загрузился. Перезагрузите страницу и попробуйте снова.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Прежде чем переключать проекты, завершите привязку кнопкой «Сохранить эту привязку» либо нажмите «Отмена». Привязка принадлежит этому проекту и не может перейти вместе с вами в другой.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Завершите привязку кнопкой «Сохранить это положение» либо нажмите «Отмена», прежде чем сохранять. Проект всё ещё находится в процессе привязки, поэтому то, что видно на экране, ещё не то, что будет записано в файл.';
$ec_lang['lpn_goto_menu']='Перейти к широте и долготе…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='Широта и долгота, в этом порядке';
$ec_lang['lpn_goto_bad']='Это не одна широта и одна долгота. Попробуйте, например, 38 -122, через пробел.';
$ec_lang['lpn_georef_goto']='Перейти к…';
$ec_lang['lpn_georef_twopt']='Использовать две известные точки';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Разместите модель точно, если вы уже знаете, где на самом деле находятся две точки вашего чертежа. Щёлкните одну из них, введите её широту и долготу, затем сделайте то же самое для второй точки. Положение, масштаб и поворот определяются по этим двум точкам. Нажмите эту кнопку ещё раз, чтобы остановить выбор точек.';
$ec_lang['lpn_georef_twopt_pick1']='Щёлкните точку на своём чертеже, широту и долготу которой вы знаете.';
$ec_lang['lpn_georef_twopt_pick2']='Теперь щёлкните вторую известную точку, как можно дальше от первой.';
$ec_lang['lpn_georef_twopt_same']='Это та же точка, что вы выбрали первой. Выберите другую.';
$ec_lang['lpn_georef_twopt_done']='Теперь модель установлена по двум заданным вами точкам. Проверьте её, затем нажмите кнопку «Сохранить это положение».';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Нижняя панель';
$ec_lang['lpn_pane_toggle_tip']='Показать или скрыть панель под картой. На ней находятся профиль и таблица для каждого вида элементов.';
$ec_lang['lpn_pane_resize']='Перетащите, чтобы увеличить или уменьшить высоту панели';
$ec_lang['lpn_pane_tab_junctions']='Узлы';
$ec_lang['lpn_pane_tab_reservoirs']='Резервуары';
$ec_lang['lpn_pane_tab_tanks']='Баки';
$ec_lang['lpn_pane_tab_pipes']='Трубы';
$ec_lang['lpn_pane_tab_pumps']='Насосы';
$ec_lang['lpn_pane_tab_valves']='Клапаны';
$ec_lang['lpn_pane_tab_tip']='Эта вкладка показывает элементы такого вида в виде таблицы, которую можно сортировать и редактировать. Столбцы результатов редактировать нельзя.';
$ec_lang['lpn_pane_none']='В этой сети пока нет ни одного из них.';
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
$ec_lang['lpn_pane_text_attached']='Прикреплён';
$ec_lang['lpn_pane_not_used']='Не используется';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Отфильтровано по «{q}». Показано {n} из {all}.';
$ec_lang['lpn_pane_filter_clear']='Показать всё';
$ec_lang['lpn_pane_filter_stale']='Строки, которые больше не соответствуют фильтру: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='В этой таблице нет совпадений с фильтром.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Приблизить и выбрать';
$ec_lang['lpn_goto_on_map']='Показать на карте';
$ec_lang['lpn_pane_select_on_map']='Выбрать на карте';
$ec_lang['lpn_pane_unselect_on_map']='Снять выбор на карте';
$ec_lang['lpn_pane_print']='Печать таблицы';

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
$ec_lang['lpn_menu_project_tip']='Всё о моделировании водопроводной сети собрано здесь в одном месте, кроме элементов управления воспроизведением анимации. Не нужно гадать, где что находится.';
$ec_lang['lpn_tables_menu']='Таблицы';
$ec_lang['lpn_tables_menu_tip']='Открывает под картой панель с таблицей частей этой сети. Для каждого вида элементов есть своя таблица, которую можно сортировать и редактировать.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Рассчитать эту сеть сейчас. Ищете кнопку «Рассчитать»? Пока этот проект пересчитывается после каждого изменения, на панели инструментов нет кнопки «Рассчитать». Отключите «Рассчитывать автоматически» в настройках, в разделе «Расчёт» → «Гидравлика», и кнопка вернётся.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Рассчитывать автоматически';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Когда это включено, проект пересчитывается вскоре после каждого вашего изменения, и кнопка «Рассчитать» убирается с панели инструментов, поскольку ей больше нечего делать. Отключите это в большой сети, где ожидание пересчёта после каждого изменения мешает набору текста, и кнопка «Рассчитать» вернётся, чтобы вы сами выбирали, когда запускать расчёт.';
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
$ec_lang['lpn_time_run_slow']='Расчёт этой сети занял {secs} с, а она настроена пересчитываться после каждого изменения. Чтобы это остановить и вернуть кнопку «Рассчитать», отключите «Рассчитывать автоматически» в настройках, в разделе «Расчёт» → «Гидравлика».';
$ec_lang['lpn_time_no_report']='Отчёта о расчёте пока нет. Отчёт — это собственный текст EPANET, поэтому он появляется только после расчёта этой сети расчётным ядром EPANET.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Справка';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Галерея снимков экрана';
$ec_lang['lpn_help_walkthroughs']='Пошаговые руководства';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Удалить сеть';
$ec_lang['lpn_confirm_delete_network']='Удалить все узлы, трубы и текстовые подписи в этом проекте? Фоновое изображение, название проекта и настройки сохранятся.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Найти и заменить';
$ec_lang['lpn_find_title']='Найти и заменить';
$ec_lang['lpn_find_scope']='Где искать';
$ec_lang['lpn_find_scope_all']='Везде';
$ec_lang['lpn_find_property']='Свойство';
$ec_lang['lpn_find_condition']='Условие';
$ec_lang['lpn_find_value']='Значение';
$ec_lang['lpn_find_btn']='Найти';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Фильтр в текущей таблице';
$ec_lang['lpn_find_filter_tip']='Показывает только те строки в таблицах под картой, которые соответствуют этому запросу. Рисунок при этом не меняется, и ничего не удаляется.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} из {all}';
$ec_lang['lpn_find_filter_summary']='Отфильтровано по {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Этот запрос не применим ни к одной таблице.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='содержит';
$ec_lang['lpn_find_op_equals']='равно';
$ec_lang['lpn_find_op_gt']='больше';
$ec_lang['lpn_find_op_lt']='меньше';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='пусто';
// {n} is a whole number.
$ec_lang['lpn_find_count']='Найдено: {n}. Щёлкните по элементу, чтобы перейти к нему.';
$ec_lang['lpn_find_shift_hint']='Shift+щелчок переключает: добавляет элемент, если он не в выборе, или убирает, если уже в выборе.';
$ec_lang['lpn_find_none']='Ничего не найдено.';
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
$ec_lang['lpn_find_op_top']='наибольшие {n}';
$ec_lang['lpn_find_op_bottom']='наименьшие {n}';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Введите, что искать.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Связность';
$ec_lang['lpn_find_prop_demand_desc']='Описание категории расхода отбора';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='нет связей у узла';
$ec_lang['lpn_find_op_conn_noopen']='нет открытых связей у узла';
$ec_lang['lpn_find_op_conn_nolinksource']='нет пути по трубам до источника';
$ec_lang['lpn_find_op_conn_noopensource']='нет открытого пути до источника';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Все узлы связаны.';
$ec_lang['lpn_find_conn_no_fixed']='В этой сети нет ни резервуара, ни бака, поэтому источника, до которого можно дойти, не существует. Искать можно только «нет связей у узла» и «нет открытых связей у узла».';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Тот же поиск, записанный одной строкой. Изменение элементов управления переписывает эту строку, а ввод текста в этой строке обновляет элементы управления.';
$ec_lang['lpn_find_query_label']='Запрос';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Объединяйте условия с помощью И, ИЛИ и ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='И';
$ec_lang['lpn_find_q_or']='ИЛИ';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Элементы управления не могут выразить запрос ниже, поэтому они скрыты.';
$ec_lang['lpn_find_q_restore']='Использовать элементы управления вместо этого';
$ec_lang['lpn_replace_q_bad']='Этот запрос не удаётся распознать, поэтому изменить ничего нельзя. Сначала исправьте его выше.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(символ {n})';
$ec_lang['lpn_find_q_err_empty']='Запрос пуст, поэтому поиск не будет выполнен.';
$ec_lang['lpn_find_q_err_scope']='Нет ничего с именем {w} для поиска. Попробуйте одно из: {list}';
$ec_lang['lpn_find_q_err_dot']='Поставьте точку между тем, что искать, и его свойством, например Junction.ID';
$ec_lang['lpn_find_q_err_prop']='Не свойство {scope}: {w}. Попробуйте одно из: {list}';
$ec_lang['lpn_find_q_err_op']='Не условие для {prop}: {w}. Попробуйте одно из: {list}';
$ec_lang['lpn_find_q_err_value']='После этого условия должно быть значение: {op}';
$ec_lang['lpn_find_q_err_quote']='Возьмите текстовое значение в кавычки: {w} — не число.';
$ec_lang['lpn_find_q_err_quote_end']='У этого текста в кавычках нет закрывающей кавычки.';
$ec_lang['lpn_find_q_err_close']='Эта открывающая скобка ( так и не была закрыта.';
$ec_lang['lpn_find_q_err_open']='Эта закрывающая скобка ) ничего не закрывает.';
$ec_lang['lpn_find_q_err_end']='После этого ничего не ожидалось. Соедините два условия поиска через {and} или {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Изменить найденное';
$ec_lang['lpn_replace_prop']='Свойство для изменения';
$ec_lang['lpn_replace_value']='Новое значение';
$ec_lang['lpn_replace_source']='Источник нового значения';
$ec_lang['lpn_replace_asked']='Запрошены отметки для {n} узлов. Результаты уже выполняются.';
$ec_lang['lpn_replace_btn']='Заменить';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Изменить {n} элементов?';
$ec_lang['lpn_replace_apply']='Изменить их';
$ec_lang['lpn_replace_done']='Изменено {n} элементов. Это можно отменить одним действием.';
$ec_lang['lpn_replace_none']='Изменений не будет.';
$ec_lang['lpn_replace_no_value']='Введите новое значение.';
$ec_lang['lpn_replace_scope']='Выберите один вид элементов выше, чтобы изменить в нём значения.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Профиль';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_title']='Профиль вдоль маршрута';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Щёлкните узел, с которого начинается маршрут.';
$ec_lang['lpn_profile_draw_more']='Перемещайте курсор по карте, чтобы увидеть маршрут. Щёлкните узел, чтобы добавить его. Двойной щелчок завершает выбор. Esc отменяет.';
$ec_lang['lpn_profile_draw_blocked']='Нет маршрута от {a} до {b}. Выберите другой узел.';
$ec_lang['lpn_profile_tap_start']='Коснитесь узла, с которого начинается маршрут.';
$ec_lang['lpn_profile_tap_more']='Коснитесь узла, чтобы увидеть маршрут. Нажмите и удерживайте, чтобы добавить его. Двойное касание завершает выбор. Нажмите «Профиль» ещё раз, чтобы отменить.';
$ec_lang['lpn_profile_say_idle']='Нажмите «Профиль» ещё раз, чтобы выбрать новый маршрут на карте.';
$ec_lang['lpn_profile_none']='Маршрут ещё не выбран. Нажмите «Профиль» ещё раз, чтобы выбрать его на карте.';
$ec_lang['lpn_profile_choose']='Выберите начальный узел и конечный узел.';
$ec_lang['lpn_profile_no_path']='Эти два узла не связаны никаким маршрутом.';
$ec_lang['lpn_profile_no_solve']='Результатов пока нет, поэтому построена только линия земли.';
$ec_lang['lpn_profile_summary']='Узлов: {n}, длина: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Расстояние вдоль маршрута ({u})';
$ec_lang['lpn_profile_axis_elev']='Отметка и напор ({u})';
$ec_lang['lpn_profile_ground']='Поверхность земли';
$ec_lang['lpn_profile_hgl']='Линия гидравлического уклона';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Изменить';
$ec_lang['lpn_profile_edit_tip']='Измените один конец пути или уберите с него один узел, не вычерчивая весь путь заново.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Перетащите любую точку пути, чтобы переместить её. Щёлкните добавленную вами точку, чтобы убрать её.';
$ec_lang['lpn_profile_edit_tap']='Перетащите любую точку пути, чтобы переместить её. Коснитесь добавленной вами точки, чтобы убрать её.';
$ec_lang['lpn_profile_edit_nowhere']='Точка на пути должна быть узлом. Путь не изменён.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Сохранённые пути';
$ec_lang['lpn_profile_new']='Новый сохранённый путь…';
$ec_lang['lpn_profile_new_name']='Путь {n}';
$ec_lang['lpn_profile_rename']='Переименовать путь…';
$ec_lang['lpn_profile_delete']='Удалить путь';
$ec_lang['lpn_profile_prompt_name']='Имя для этого пути';
$ec_lang['lpn_profile_delete_confirm']='Удалить сохранённый путь {name}? Сам чертёж не изменится.';
$ec_lang['lpn_profile_none_saved']='Сохранённых путей пока нет';
$ec_lang['lpn_profile_missing']='Сохранённый путь {name} использует узлы, которых нет в этом проекте: {ids}';
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
$ec_lang['lpn_ts_menu']='Временной ряд';
$ec_lang['lpn_ts_tip']='Строит диаграмму одного или нескольких элементов по времени за расчёт с продолжённым периодом.';
$ec_lang['lpn_ts_title']='Значения во времени';
$ec_lang['lpn_ts_group_nodes']='Узлы';
$ec_lang['lpn_ts_group_links']='Связи';
$ec_lang['lpn_ts_add']='Добавить выбранное';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='На карте не выбрано ничего такого рода.';
$ec_lang['lpn_ts_clear']='Удалить все';
$ec_lang['lpn_ts_chip_tip']='Убрать {id} с диаграммы';
$ec_lang['lpn_ts_none']='Пока нечего отображать на диаграмме. Выберите элементы на карте и нажмите «Добавить выбранное».';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Пока нет результатов расчёта с продолжённым периодом. Нажмите «Рассчитать», чтобы выполнить расчёт.';
$ec_lang['lpn_ts_summary']='Элементов: {n}, моментов отчёта: {steps}';
$ec_lang['lpn_ts_axis_time']='Прошедшее время';
$ec_lang['lpn_freq_menu']='Частота';
$ec_lang['lpn_freq_tip']='Построить график распределения частот одного свойства по всем узлам или по всем трубам на текущем шаге по времени.';
$ec_lang['lpn_freq_title']='Распределение значений';
$ec_lang['lpn_freq_none']='Пока нет результатов для этого значения, поэтому строить график не из чего.';
$ec_lang['lpn_freq_summary']='Построено: {n} из {total}';
$ec_lang['lpn_freq_summary_time']='Построено: {n} из {total}, на {time}';
$ec_lang['lpn_freq_axis_percent']='Процент меньших значений';
$ec_lang['lpn_view_units']='Единицы измерения';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Сохранить всё';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Проект{n}';
$ec_lang['lpn_project_copy_suffix']='(копия)';
$ec_lang['lpn_project_rename']='Переименовать';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Новый проект…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Новый проект';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Система координат';
$ec_lang['lpn_new_coordsys_tip']='Выберите систему координат вашей сети. Это постоянный выбор; единственный способ преобразовать сеть в другие координаты — команда «Файл» → «Открыть xy-файл на карте…», и он приближённый.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Локальная, схематическая или произвольная';
$ec_lang['lpn_new_coordsys_local_tip']='Без географической привязки. Прикрепите своё собственное фоновое изображение либо не используйте его вовсе.';
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
$ec_lang['lpn_crs_view']='Фильтровать по области карты';
$ec_lang['lpn_crs_view_tip']='Показывает только проекции, охватывающие место, на которое сейчас смотрит карта. Отключите, чтобы просмотреть весь список.';
$ec_lang['lpn_crs_place']='Поиск по названию места';
$ec_lang['lpn_crs_place_tip']='Введите город, адрес или ориентир — и карта переместится туда. То, что вы вводите, отправляется в службу поиска названий OpenStreetMap, которая в первый раз спросит ваше разрешение. Новый географический проект также начинается с места, найденного здесь.';
$ec_lang['lpn_crs_search']='Поиск';
$ec_lang['lpn_crs_name']='Фильтр по названию проекции';
$ec_lang['lpn_crs_name_tip']='Показывает только проекции, в названии или коде EPSG которых есть введённый текст. Попробуйте номер зоны, либо «UTM», либо «Меркатор».';
$ec_lang['lpn_crs_list_tip']='Проекции, оставшиеся после двух фильтров выше. Выберите одну и нажмите «Выбрать».';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Место ещё не искали, поэтому предлагается весь список. Найдите место выше или измените масштаб карты, чтобы сузить список.';
$ec_lang['lpn_crs_count']='Показано проекций: {n} из {total}.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} из {total} систем координат покрывают эту сеть.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(без карты)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} — одна из немногих перечисленных систем координат без пригодной для использования информации о проекции. Это означает, что мировая карта, поиск названий мест и отметки по данным о рельефе (DEM) не работают. На ваши координаты это не влияет.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='без названия';
$ec_lang['lpn_crs_none']='Без географической привязки';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Проект хранит свои собственные единицы измерения, поэтому этот выбор относится только к данному проекту и нигде не сохраняется как настройка браузера. Чтобы новые проекты каждый раз открывались по-своему, сохраните пустой проект как шаблон и делайте его копию каждый раз.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Петалума, Калифорния';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Создать';
$ec_lang['lpn_file_open']='Открыть…';
$ec_lang['lpn_file_save']='Сохранить';
$ec_lang['lpn_file_saveas']='Сохранить как…';
$ec_lang['lpn_file_revert']='Восстановить сохранённое';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Недавние файлы';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='Разрешение на открытие этого файла не было предоставлено, поэтому он не был открыт.';
$ec_lang['lpn_recent_gone']='Не удалось открыть {file}. Возможно, он был перемещён, переименован или удалён, поэтому он убран из списка недавних файлов.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Новый проект';
$ec_lang['lpn_tab_all']='Все проекты';
$ec_lang['lpn_tab_menu']='Меню проекта';
$ec_lang['lpn_tab_duplicate']='Дублировать';
$ec_lang['lpn_tab_move_left']='Переместить влево';
$ec_lang['lpn_tab_move_right']='Переместить вправо';
$ec_lang['lpn_tab_unsaved']='Не сохранено в файл';
$ec_lang['lpn_import_bad_file']='Этот файл не удалось прочитать как проект, сохранённый этой страницей.';
$ec_lang['lpn_import_no_room']='В хранилище браузера недостаточно места, чтобы добавить этот проект. Удалите ненужный проект и попробуйте снова.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='ОК';
$ec_lang['lpn_file_import_menu']='Импорт…';
$ec_lang['lpn_file_import_inp']='Импорт файла EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Считывает сеть из файла EPANET — текстового файла .inp или файла .net, который сохраняет EPANET, — и сохраняет её в этом браузере как новый проект.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='Экспортировать файл EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Записать эту сеть в виде файла EPANET .inp и скачать его. Введённые вами числа записываются точно так, как вы их ввели. Всё, что формат .inp не может хранить, будет затем перечислено для вас.';
$ec_lang['lpn_status_inp_exported']='Экспортировано: {file}.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} значений, которые формат .inp не поддерживает.';
$ec_lang['lpn_inp_export_refused']='Этот проект нельзя записать в виде файла EPANET: {detail}';
$ec_lang['lpn_inp_bad_file']='Этот файл не удалось прочитать как файл сети EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Похоже, это файл .net формата EPANET, но эта страница не смогла его прочитать. Откройте его в EPANET и с помощью команды «Файл» → «Экспорт» → «Сеть» сохраните его как файл .inp, а затем импортируйте этот файл.';
$ec_lang['lpn_inp_report_heading']='Импортирован файл {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} узлов, резервуаров и баков, {links} труб, насосов и клапанов, в единицах {units}.';
$ec_lang['lpn_inp_report_clean']='Всё содержимое файла перенесено полностью. Ничего не было пропущено.';
$ec_lang['lpn_inp_report_label_anchor']='Текстовые подписи размещены так же, как в EPANET, — от их верхнего левого угла.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='Файлы EPANET не содержат системы координат, поэтому этот файл изначально не будет иметь географической привязки. Чтобы разместить его на мировой карте, используйте «Карта» → «Мировая карта…». Чтобы преобразовать его координаты, используйте «Файл» → «Преобразовать как…».';
$ec_lang['lpn_inp_report_lead']='Эта страница использует не всё, что умеет EPANET, но ничего из вашего файла не отбрасывается. Ниже показано, что хранит ваш файл и что эта страница сохраняет без использования, а также что изменилось при считывании файла:';
$ec_lang['lpn_inp_drop_headloss']='Этот файл не использует формулу Хазена-Вильямса. Эта страница рассчитывает по формуле Хазена-Вильямса, поэтому числа шероховатости труб были сохранены точно как в файле, но результаты здесь не будут совпадать с результатами в EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Эти баки не имеют вертикальных прямых стенок: файл задаёт их форму в виде кривой. Кривая сохраняется в окне «Библиотеки», бак по-прежнему ссылается на неё, и расчёт с продолжённым периодом наполняет и опорожняет бак по графику, который задаёт эта кривая. Для одного момента времени результат одинаков в обоих случаях, потому что уровень воды — это значение, заданное файлом. Диаметр, записанный в файле, сохраняется рядом с кривой и используется для отрисовки и расчёта бака без кривой.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Эти дроссельные клапаны перенесены как дроссельные клапаны, сохраняя ту же потерю, что задана в файле. Их может рассчитать любое из расчётных ядер.';
$ec_lang['lpn_inp_drop_valve_active']='Эти клапаны регулируют давление или расход и сами открываются и закрываются в зависимости от изменений в сети. При переносе они не были упрощены, и эта страница рассчитывает их с помощью расчётного ядра EPANET, автоматически включая его для этой сети.';
$ec_lang['lpn_inp_drop_valve']='Эти клапаны описываются кривой или фиксированным перепадом давления, а на этой странице такого элемента нет. Они перенесены как открытые трубы, поэтому сеть остаётся соединённой, но давление или расход там больше ничем не удерживается.';
$ec_lang['lpn_inp_drop_cv']='В EPANET эти трубы пропускают воду только в одном направлении. Они перенесены как обычные трубы, поэтому теперь вода может течь по ним в любую сторону.';
$ec_lang['lpn_inp_drop_demands']='У этих узлов было более одного расхода отбора. Расходы были сложены в один общий расход, который хранит эта страница.';
$ec_lang['lpn_inp_drop_patterns']='Эта страница не прочитала графики расхода отбора, потому что часть страницы, которая выполняет расчёт с продолжённым периодом, не загрузилась. Каждый расход отбора — это число, записанное в файле.';
$ec_lang['lpn_inp_drop_demand_pattern']='Эти узлы меняют свой расход отбора в течение расчёта. Их графики перенесены целиком, а показанный расход отбора — это значение для того момента, который сейчас показывают часы.';
$ec_lang['lpn_inp_drop_emitters']='У этих узлов есть коэффициент разбрызгивателя или утечки (эмиттера). Он был сохранён и учитывается при расчёте, но пока на этой странице негде его увидеть или изменить.';
$ec_lang['lpn_inp_drop_curve_long']='У этой кривой насоса было больше трёх точек. Были сохранены её самая нижняя, средняя и самая верхняя точки, поскольку эта страница подбирает кривую не более чем по трём точкам.';
$ec_lang['lpn_inp_drop_curve_missing']='Этот насос ссылается на кривую, которой нет в файле. Насос перенесён без кривой, поэтому он не добавляет напор.';
$ec_lang['lpn_inp_drop_pump_other']='Этот насос описан потребляемой мощностью, а не кривой. Он перенесён без кривой, поэтому не добавляет напор.';
$ec_lang['lpn_inp_drop_head_pattern']='Эти резервуары поднимаются и опускаются в течение расчёта. Их графики перенесены целиком, а показанный уровень воды — это значение для того момента, который сейчас показывают часы.';
$ec_lang['lpn_inp_drop_pump_speed']='Эти насосы работают на скорости, отличной от той, при которой была измерена их кривая, либо меняют скорость в течение расчёта. Скорость и её график перенесены целиком, а показанный напор — это значение для того момента, который сейчас показывают часы.';
$ec_lang['lpn_inp_drop_setting']='Эти трубы, насосы и клапаны имеют настройку, которую эта страница не может хранить. Они перенесены в открытом состоянии.';
$ec_lang['lpn_inp_drop_rules']='В этом файле есть управления на основе правил. Эта страница читает их и использует. Рассчитайте модель расчётным ядром EPANET, и правила будут применены, а каждый уровень, давление и расход в них переведены в единицы, которые показывает этот проект. Откройте «Правила» в разделе «Библиотеки», чтобы прочитать или изменить любое из них. Они сохраняются точно в том виде, в каком их задаёт файл, и записываются обратно, если вы сохраните файл EPANET.';
$ec_lang['lpn_inp_drop_eps']='Этот файл описывает расчёт с продолжённым периодом. Часть этой страницы, которая выполняет такой расчёт, не загрузилась, поэтому перенесены только начальные условия.';
$ec_lang['lpn_inp_drop_quality']='Этот файл описывает, как меняется качество воды при её движении: что изначально содержится в воде и как быстро это вещество реагирует в трубах и в баках. Эта страница читает эти числа и использует их. Выберите химическое вещество в разделе «Настройки» → «Расчёт» → «Качество воды», затем рассчитайте модель расчётным ядром EPANET, и концентрация будет вычислена по всей сети по мере расчёта. Эти строки сохраняются и записываются обратно, если вы сохраните файл EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='Этот файл указывает, где в сеть подаётся химическое вещество и как перемешивается вода в баке. Доза относится к узлу, в который она подаётся, а бак указывает, какую модель перемешивания он использует. И доза, и модель перемешивания рассчитываются только расчётным ядром EPANET.';
$ec_lang['lpn_inp_drop_energy']='Этот файл EPANET содержит данные для расчёта стоимости перекачки. Эта страница читает их и использует. Рассчитайте модель расчётным ядром EPANET, затем откройте «Вода» → «Отчёты» → «Энергия насосов», чтобы увидеть, сколько времени работал каждый насос, какую мощность он потреблял, сколько энергии использовал и во что это обошлось. Эти строки сохраняются и записываются обратно, если вы сохраните файл EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='В этом файле некоторым узлам, трубам или другим элементам присвоены теги. Каждый тег перенесён целиком и находится в свойствах своего элемента, где его можно прочитать или изменить.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='В этом файле хранятся собственные настройки EPANET для форматирования печатаемого им отчёта. Отчёт ядра можно прочитать здесь, в разделе «Отчёты» → «Расчёт EPANET», но он выводится в стандартном формате ядра, а не в том, который задают эти настройки. Эти строки сохраняются и записываются обратно, если вы сохраните файл EPANET.';
$ec_lang['lpn_inp_drop_sections']='В этом файле есть раздел, который эта страница вообще не читает. Здесь он не используется. Он сохраняется целиком и записывается обратно, если вы сохраните файл EPANET.';
$ec_lang['lpn_inp_drop_quality_options']='В этом файле заданы параметры качества воды EPANET: параметр Quality, называющий вид анализа качества воды, и два параметра, относящихся к химическому веществу, — Relative diffusivity и Quality tolerance. Все три сохраняются и все три используются. Здесь вычисляются возраст воды, трассировка источника и химическое вещество, а оба параметра химического вещества передаются расчётному ядру EPANET при расчёте вещества. Все они записываются обратно, если вы сохраните файл EPANET.';
$ec_lang['lpn_inp_drop_file_options']='В этом файле есть ссылка на вспомогательный файл: Map — он хранит координаты, или Hydraulics — он хранит уже готовые гидравлические расчёты. Эта страница не может открыть ни один из них, поэтому строки сохраняются как есть и записываются обратно, если вы сохраните файл EPANET.';
$ec_lang['lpn_inp_drop_other_options']='В этом файле заданы параметры, которые эта страница не читает. Здесь они не используются. Они сохраняются и записываются обратно, если вы сохраните файл EPANET.';
$ec_lang['lpn_inp_drop_net_options']='Этот файл .net EPANET задаёт настройки, для которых на этой странице нет соответствующих элементов управления, поэтому их значения перечислены здесь, а не перенесены в проект. Всё остальное перенесено. Если они вам нужны, откройте файл в EPANET и используйте «Файл» → «Экспорт» → «Сеть», чтобы сохранить его как файл .inp, а затем импортируйте этот файл.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Это был файл .net EPANET — собственный формат файлов проекта EPANET. У него нет опубликованного описания, и эта страница читает его, восстановив формат по примерам файлов, поэтому используйте его только тогда, когда больше ничего нет, а не как надёжный способ. Файл .inp — задокументированный формат, который читают все остальные программы: в EPANET используйте «Файл» → «Экспорт» → «Сеть», чтобы записать такой файл, и по возможности импортируйте именно его.';
$ec_lang['lpn_inp_drop_backdrop']='В этом файле указано фоновое изображение, но само изображение в нём не содержится. Добавьте его самостоятельно через «Фоновое изображение» → «Добавить изображение».';
$ec_lang['lpn_inp_drop_dangling']='В этих трубах указан узел, которого нет в файле, поэтому они были пропущены.';
$ec_lang['lpn_inp_drop_units']='Единицы расхода в этом файле не распознаны, поэтому были приняты галлоны в минуту. Проверьте все числа, прежде чем использовать результаты.';
$ec_lang['lpn_inp_drop_anchor_missing']='Этот текст был привязан к узлу, резервуару или баку, которого нет в файле. Он перенесён как свободный текст на то место, которое указал файл, и теперь ни за чем не следует.';
$ec_lang['lpn_import_notes_heading']='Этот проект был считан из файла EPANET. Часть того, что хранит этот файл, сохраняется, но не используется на этой странице.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='Открыт {name} из файла и добавлен в этот браузер как новый проект.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Файл проекта';
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
$ec_lang['lpn_file_upload_explain']='Этот браузер не может подключаться к файлу, поэтому открытие файла здесь на самом деле является загрузкой: проект копируется в этот браузер, и единственный способ сохранить вашу работу обратно в файл — перезаписать файл командой «Файл» → «Сохранить как».';
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
$ec_lang['lpn_file_saveas_tip_download']='Сохраняет через настройки загрузок вашего браузера. Этот браузер не может подключаться к файлу, поэтому «Сохранить» отключено и доступно только «Сохранить как». Если вы включите в браузере настройку «Спрашивать, куда сохранять каждый файл», вы сможете выбрать исходный файл и перезаписать его.';
$ec_lang['lpn_status_uploaded']='Файл проекта загружен. Подключение к нему поддерживать нельзя, поэтому единственный способ сохранить обратно в него — использовать «Файл» → «Сохранить как».';
$ec_lang['lpn_status_downloaded']='Загружен {file}. Этот браузер не может подключаться к файлу, поэтому проект остаётся отмеченным как не сохранённый в файл.';
$ec_lang['lpn_status_file_opened']='Открыт {file}.';
$ec_lang['lpn_status_already_open']='Этот файл уже открыт здесь как {name}, поэтому вместо открытия второй копии произошло переключение на него.';
$ec_lang['lpn_status_already_open_dirty']='Этот файл уже открыт здесь как {name}, с изменениями, которые вы в него ещё не сохранили. Вместо открытия второй копии произошло переключение на него. Используйте «Файл» → «Восстановить сохранённое», если вам нужна версия с диска.';
$ec_lang['lpn_status_saved']='Сохранён {file}.';
$ec_lang['lpn_status_reverted']='Файл {file} снова загружен с диска.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Сохранить изменения в {name} перед закрытием?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} хранится только в этом браузере. Если закрыть его без сохранения в файл, он будет потерян безвозвратно.';
$ec_lang['lpn_close_discard']='Закрыть без сохранения';
$ec_lang['lpn_cancel']='Отмена';
$ec_lang['lpn_revert_confirm']='Отбросить сделанные вами изменения и снова загрузить {file} с диска?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Этот проект был получен из {file}, но подключение к этому файлу утрачено. Выберите файл заново, чтобы подключиться к нему.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Не удалось записать в файл. Возможно, он был перемещён или переименован, либо разрешение было отозвано. Ваша работа по-прежнему сохранена в этом браузере.';
$ec_lang['lpn_file_changed_elsewhere']='Кто-то другой сохранил изменения в этот файл с тех пор, как вы его открыли, поэтому сохранение сейчас перезапишет его работу. Используйте «Файл» → «Сохранить как», чтобы сохранить свои изменения в отдельный файл, или «Файл» → «Восстановить сохранённое», чтобы отбросить свои изменения и загрузить его версию.';
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
$ec_lang['lpn_lock_somebody']='Кто-то другой';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} держит этот файл открытым.';
$ec_lang['lpn_lock_open_readonly']='Открыть только для чтения';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Снять блокировку';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Похоже, этот файл сейчас используется.';
$ec_lang['lpn_lock_open_care']='Чтобы избежать потери данных, внимательно выберите один из вариантов ниже.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='Он используется уже {x}.';
$ec_lang['lpn_lock_age_edited']='В последний раз он редактировался {x} назад.';
$ec_lang['lpn_lock_age_saved']='В последний раз он был сохранён {x} назад.';
$ec_lang['lpn_lock_age_never_saved']='В этот файл ещё ничего не было сохранено.';
$ec_lang['lpn_lock_age_unknown']='Нет данных о том, как долго он используется, а также о том, когда он был в последний раз сохранён или отредактирован.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='«Спросить» сообщает тому, у кого сейчас открыт этот файл, что он нужен вам, и больше ничего не меняет. «Открыть только для чтения» позволяет вам просмотреть файл и изменить в нём что угодно, но без возможности сохранить здесь. «Снять блокировку» позволяет вам сохранить поверх файла; несохранённая работа другого человека не теряется, но он больше не сможет сохранить её сюда, и кому-то, возможно, придётся вручную объединить обе версии.';
$ec_lang['lpn_lock_ask']='Спросить';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Кого нам указать как спрашивающего? Ваши инициалы — лучший вариант. Они хранятся вместе с блокировкой этого файла на нашем сервере, доступны тому, у кого он сейчас открыт, и удаляются в течение 30 дней.';
$ec_lang['lpn_lock_ask_sent']='Мы попросили того, у кого сейчас открыт этот файл, закрыть его. Он увидит это в течение минуты, если его страница всё ещё открыта. Больше ничего не изменилось, и файл остаётся его, пока он его не закроет.';
$ec_lang['lpn_lock_ask_failed']='Ваше сообщение не удалось доставить. Либо сейчас никто не держит этот файл открытым, либо не удалось связаться с сервером.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Этот файл не был открыт, и здесь ничего не изменилось. Он всё ещё открыт у кого-то другого.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} хотел(а) бы редактировать этот файл. Когда будете готовы, сохраните свою работу и используйте «Файл» → «Закрыть», чтобы передать его.';
$ec_lang['lpn_ago_seconds']='{n} секунд';
$ec_lang['lpn_ago_minutes']='{n} минут';
$ec_lang['lpn_ago_hours']='{n} часов';
$ec_lang['lpn_ago_days']='{n} дней';
$ec_lang['lpn_ago_unknown']='неизвестное время';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Сообщения';
$ec_lang['lpn_msglog_heading']='Последние сообщения';
$ec_lang['lpn_msglog_empty']='Пока нет сообщений.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} назад';
$ec_lang['lpn_msglog_note']='Сначала новые. Эта страница хранит последние {n} сообщений, пока она открыта, и ничего не сохраняет на вашем компьютере.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Только для чтения: {name} держит этот файл открытым. Здесь можно изменить что угодно, но сохранить нельзя. Используйте «Файл» → «Сохранить как», чтобы сохранить в другой файл.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Внимание: не удалось связаться с сервером, чтобы проверить или создать блокировку этого проекта, поэтому ничто не мешает коллеге одновременно редактировать тот же файл. Вам сообщат, если блокировка снова заработает.';
$ec_lang['lpn_lock_storage_error']='Внимание: этот сайт не может сохранять записи о блокировках, поэтому ничто не мешает коллеге одновременно редактировать тот же файл. Это неисправность настройки на сервере, и вы не можете исправить её здесь — папка блокировок недоступна для записи веб-сервером.';
$ec_lang['lpn_lock_full_error']='Внимание: на этом сайте закончилось место для записи, кто какой проект держит открытым, поэтому ничто не мешает коллеге одновременно редактировать тот же файл. Это неисправность настройки на сервере, и вы не можете исправить её здесь.';
$ec_lang['lpn_lock_not_asked']='Блокировка не работает для этого проекта, поэтому ничто не мешает коллеге одновременно редактировать тот же файл. У этого проекта ещё нет идентификатора, и сохранение его в файл присваивает его.';
$ec_lang['lpn_lock_restored']='Блокировка снова работает, и теперь вы можете сохранять в этот файл.';
$ec_lang['lpn_lock_dismiss']='Скрыть это сообщение';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Ваш проект будет сохранён в файл на этом компьютере. Он сохраняется, когда вы это запрашиваете, и никогда иначе, так что ничего не записывается в этот файл без вашего ведома.';
$ec_lang['lpn_file_training_2']='Чтобы два человека никогда не редактировали один файл одновременно, этот сайт отслеживает, у кого он открыт. Если файл уже у кого-то открыт, вы всё равно можете открыть его и посмотреть или сохранить собственную копию.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='При первом сохранении браузер спросит, может ли этот сайт редактировать файл. Этот вопрос задаёт браузер, а не мы, и именно согласие позволяет команде «Сохранить» записывать вашу работу обратно. Обычно об этом спрашивают только один раз для каждого файла.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Продолжить';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Выбрать файл заново';
$ec_lang['lpn_file_reconnect']='Переподключиться к этому файлу';
$ec_lang['lpn_file_reconnect_alert']='Этот проект был получен из {file}. Вашему браузеру снова нужно ваше разрешение, прежде чем он сможет записать в него. Переподключитесь ниже.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Это тот же файл, который уже открыт у кого-то другого, поэтому поверх него сохранить нельзя. Выберите другой файл или другое имя.';
$ec_lang['lpn_saveas_overwrites_project']='В этом файле уже есть другой проект — {name}. Сохранение здесь полностью его заменит. Продолжить?';
$ec_lang['lpn_saveas_overwrites_newer']='Этот файл изменился с тех пор, как вы видели его в последний раз, так что кто-то почти наверняка сохранил в него изменения. Сохранение здесь заменит их версию вашей. Продолжить?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Название этого проекта';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='Закрыт {closed}. Теперь показан {opened}.';
$ec_lang['lpn_status_closed_empty']='Закрыт {closed}. Начат новый пустой проект.';
$ec_lang['lpn_storage_full']='Не сохранено. Хранилище браузера заполнено или недоступно, поэтому ваши последние изменения будут потеряны при закрытии этой вкладки.';
$ec_lang['lpn_storage_unreadable']='Не сохранено. Не удалось прочитать этот проект из хранилища браузера. Его сохранённая копия остаётся без изменений и не будет перезаписана, поэтому на этой вкладке ничего не сохраняется. Откройте файл или создайте новый проект, чтобы продолжить работу.';
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
$ec_lang['lpn_about_credits']='Благодарности';
$ec_lang['lpn_help_welcome']='Страница приветствия';
$ec_lang['lpn_about_license']='Распространяется по лицензии GNU General Public License версии 3.0 или более поздней.';
$ec_lang['lpn_notes_1_term']='Как это рассчитывается';
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
$ec_lang['lpn_notes_1_def']='Расчётное ядро EPANET рассчитывает эту сеть. Задайте общую продолжительность работы, и оно вычислит по очереди каждый шаг вывода результатов: баки наполняются и опорожняются, расходы отбора следуют своим графикам, а панель инструментов воспроизводит расчёт.';
$ec_lang['lpn_notes_2_term']='Чего не делает';
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
$ec_lang['lpn_notes_2_def']='Качество воды моделируется: возраст воды, трассировка источника и химическое вещество, реагирующее на стенке трубы и в толще воды. Гидроудар и волны давления — не моделируются: все результаты здесь относятся к воде, уже текущей установившимся потоком, а не к волне давления при резком закрытии клапана.';
$ec_lang['lpn_notes_3_term']='Сохранение проектов';
$ec_lang['lpn_notes_3_def']='Каждый проект — это вкладка, и каждая вкладка сохраняется в этом браузере по мере работы. Очистка данных браузера удаляет их все, поэтому храните свою работу в файле: «Файл» → «Сохранить как». Звёздочка на вкладке означает, что в ней есть изменения, которых нет в файле. Ничто никогда не записывается в файл, пока вы этого не попросите. В некоторых браузерах проект подключается к файлу, в который вы его сохраняете, и «Файл» → «Сохранить» с этого момента записывает в тот же файл; в других подключение невозможно, поэтому «Сохранить» отключено и доступно только «Сохранить как». Когда файл проекта хранится на общем диске, эта страница сообщает вам, если он уже открыт у коллеги, чтобы двое не писали поверх друг друга.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Кривая насоса';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Насос подчиняется формуле H = H₀ − aQ^b, где H — напор, добавляемый насосом, а Q — расход через него. Введите одну, две или три точки с кривой производителя. Три точки — напор при нулевом расходе, обычная рабочая точка и точка наибольшего расхода — напрямую определяют H₀, a и b и точнее всего следуют опубликованной кривой. Две точки подбирают параболу (b = 2) с вершиной при нулевом расходе. Одна точка использует общее правило: напор при нулевом расходе равен 1,33 × введённого вами напора, а наибольший расход равен 2 × введённого вами расхода, что снова даёт b = 2. Насос без введённых точек вообще не добавляет напор. Кривая не обрезается там, где напор достигает нуля, поэтому если запросить у насоса больше расхода, чем может дать его кривая, получится отрицательный напор. Решение — насос побольше или расход отбора поменьше, а не другой подбор кривой. Кривая может содержать более трёх точек, и учитывается каждая введённая вами точка.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='Справка по столбцам таблицы';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Щёлкните по заголовку</td><td>Выбрать столбец</td></tr><tr><td>Ctrl+щелчок или Shift+щелчок по другому заголовку</td><td>Добавить столбец к выделению или расширить его</td></tr><tr><td>Перетащите или используйте «Управление столбцами…» в контекстном меню или меню ⋮</td><td>Переместить (изменить порядок) выбранного столбца (столбцов)</td></tr><tr><td>Наведите на верхний угол заголовка или выберите заголовок либо перейдите к нему клавишей Tab</td><td>Меню ⋮ и стрелка сортировки.</td></tr><tr><td>Правый клик по заголовку или меню ⋮ в верхнем правом углу заголовка</td><td>Скрыть, показать все или управлять видимостью и порядком</td></tr><tr><td>Значок стрелки в верхнем правом углу заголовка</td><td>Сортировать по столбцу</td></tr><tr><td>Правый клик, меню ⋮ в верхнем правом углу заголовка, или Ctrl+Shift+V</td><td>Вставить как новые строки в конец таблицы</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Сочетания клавиш в таблице';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Клавиши со стрелками</td><td>Навигация.</td></tr><tr><td>Tab, Enter</td><td>Завершить ввод и перейти на одну ячейку вправо / вниз.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Перейти назад.</td></tr><tr><td>Shift+стрелки</td><td>Расширить выделение.</td></tr><tr><td>Ctrl+C</td><td>Скопировать выделение.</td></tr><tr><td>Ctrl+D</td><td>Заполнить выделение вниз от верхней строки.</td></tr><tr><td>Ctrl+Enter</td><td>Заполнить выделение значением активной ячейки.</td></tr><tr><td>Ctrl+A</td><td>Выбрать всю таблицу.</td></tr><tr><td>Ctrl+Shift+V</td><td>Вставить как новые строки в конец таблицы.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Переключиться на следующую или предыдущую вкладку, будь то таблица или график.</td></tr><tr><td>Delete</td><td>Очистить ячейку.</td></tr><tr><td>F2</td><td>Открыть ячейку для редактирования.</td></tr><tr><td>Esc</td><td>Отменить редактирование.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Границы цветовых диапазонов остаются прежними';
$ec_lang['lpn_notes_color_def']='Границы цветовых диапазонов задаются при выборе метода классификации данных. Они не пересчитываются заново на каждом временном шаге, потому что тогда цвета означали бы каждый раз что-то новое, а это не помогает наглядно представить вашу систему. EPANET работает так же. Чтобы получить новые границы, выберите метод снова или введите свои значения.';
$ec_lang['lpn_notes_epanet_term']='Константы Хазена-Вильямса соответствуют EPANET';
$ec_lang['lpn_notes_epanet_def']='В августе 2026 года коэффициент и показатель степени формулы Хазена-Вильямса были изменены, чтобы соответствовать EPANET. Результаты потерь напора отличаются от более ранних версий этой страницы не более чем на 0,1 процента, что намного меньше неопределённости самого значения C.';
$ec_lang['lpn_notes_engine_term']='Какой EPANET использует эта страница';
$ec_lang['lpn_notes_engine_def']='Расчётное ядро EPANET на этой странице — это OWA-EPANET 2.3.5, выпущенное 20 февраля 2025 года. EPANET разрабатывает Open Water Analytics — сообщество, работающее с Агентством по охране окружающей среды США (EPA), которое выпустило версию 2.2.0 в декабре 2019 года. В отчёте о расчёте оно называется 2.3.05, потому что ядро записывает последнее число двумя цифрами. На эту страницу оно попадает через библиотеку epanet-js 0.9.0 авторства Люка Батлера (Luke Butler), по лицензии MIT, и выполняется прямо в вашем браузере: ваша сеть никогда никуда не отправляется для расчёта.';
$ec_lang['lpn_id_invalid']='Введите ID без пробелов и без кавычек.';
$ec_lang['lpn_id_taken']='Этот ID уже используется.';
$ec_lang['lpn_diag_no_fixed_head']='Добавьте резервуар или бак. Прежде чем сеть можно будет решить, ей нужен хотя бы один известный уровень воды.';
$ec_lang['lpn_diag_dangling_link']='Труба или насос подключены к узлу, которого больше не существует:';
$ec_lang['lpn_diag_unreachable']='У этих узлов нет пути к резервуару:';
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
$ec_lang['lpn_engine_fetching']='Загрузка расчётного ядра EPANET. Оно скачивается один раз и затем остаётся на этом устройстве, поэтому после этого работает без подключения к интернету.';
$ec_lang['lpn_engine_ready']='Расчётное ядро EPANET теперь на этом устройстве и работает без подключения к интернету.';
$ec_lang['lpn_engine_fetching_valve']='Загрузка расчётного ядра EPANET, чтобы рассчитать этот клапан сейчас и работать с ним без интернета позже.';
$ec_lang['lpn_engine_ready_valve']='Расчётное ядро EPANET теперь на этом устройстве. Клапаны, которые сами открываются и закрываются, будут работать без подключения к интернету.';
$ec_lang['lpn_engine_unavailable']='Не удалось загрузить расчётное ядро EPANET, которое рассчитывает клапаны, сами открывающиеся и закрывающиеся. Подключитесь к интернету один раз, и дальше оно останется на этом устройстве.';
$ec_lang['lpn_engine_needed_loading']='Загрузка решателя EPANET, пока вы строите сеть. Результаты будут доступны после полной загрузки.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Прогресс загрузки расчётного ядра';
$ec_lang['lpn_engine_wait']='Загрузка расчётного ядра. Результаты появятся с небольшой задержкой. Продолжайте работу.';
$ec_lang['lpn_engine_wait_pct']='Расчётное ядро загружено на {percent}%.';
$ec_lang['lpn_engine_wait_bytes']='Расчётное ядро загружено на данный момент: {kb} КБ. Общий размер недоступен, поэтому процент выполнения неизвестен.';
$ec_lang['lpn_engine_needed_failed']='Решатель EPANET ещё не загружен, не может быть загружен, а эту сеть может решить только он. Он будет загружен, когда у вас появится подключение к интернету.';
$ec_lang['lpn_diag_valve_needs_epanet']='Эти клапаны сами открываются и закрываются, и рассчитать их может только расчётное ядро EPANET. Расчётное ядро EPANET не удалось загрузить, поэтому следующие результаты отсутствуют:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Эти клапаны присоединены напрямую к резервуару или баку, который уже сам задаёт там уровень воды, поэтому клапану нечем управлять. Вставьте короткую трубу между клапаном и резервуаром или баком:';
$ec_lang['lpn_diag_not_converged']='Решение не найдено. Проверьте значения, невозможные в реальной жизни, например нулевой диаметр.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Расчёт не сошёлся. Эти числа — последняя итерация, а не результат. Не используйте их.';
$ec_lang['lpn_diag_not_converged_trials']='Остановлено после {iterations} итераций.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Остановлено после {iterations} итераций при относительной погрешности {error}, что не достигло значения параметра «Точность» {accuracy}.';
$ec_lang['lpn_field_roughness']='Шероховатость';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Коэффициент C формулы Хазена-Вильямса. Чем больше число, тем более гладкая труба: около 150 для новой пластиковой, 130 для новой стальной или чугунной, и 100 для старой трубы.';
$ec_lang['lpn_field_length']='Длина';
$ec_lang['lpn_field_from']='От';
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
$ec_lang['lpn_field_valve_type_tip']='Что делает клапан. Дроссельный клапан поддерживает постоянную потерю напора. Остальные три поддерживают давление или расход и полностью открываются, закрываются или частично закрываются в зависимости от изменений в сети. Разные типы управляют разными гидравлическими параметрами, поэтому при смене типа заданные значения уставки могут быть потеряны.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Дроссельный (TCV)';
$ec_lang['lpn_valve_type_prv']='Понижающий давление (PRV)';
$ec_lang['lpn_valve_type_psv']='Поддерживающий давление (PSV)';
$ec_lang['lpn_valve_type_fcv']='Регулятор расхода (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Гаситель давления (PBV)';
$ec_lang['lpn_valve_type_gpv']='Общего назначения (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Падение давления';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='Давление, которое снимает клапан. Гаситель давления всегда снимает ровно столько давления, в какую бы сторону ни шла вода. Это перепад давления на клапане, а не давление, которое нужно поддерживать.';
$ec_lang['lpn_inp_drop_gpv_curve']='Этот клапан ссылается на кривую потерь напора, которой нет в файле. Клапан перенесён без кривой и остаётся полностью открытым, пока вы её не зададите.';
$ec_lang['lpn_gpv_curve_source']='Кривая потерь напора клапана';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Кривая в окне «Библиотеки», которая показывает, сколько напора теряет этот клапан при каждом расходе. Несколько клапанов могут использовать одну и ту же кривую, и её изменение там меняет их все. Этот клапан хранит только ссылку на неё; сами точки читаются и изменяются в разделе «Библиотеки» → «Кривые».';
$ec_lang['lpn_field_valve_setting_pressure']='Уставка давления';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Давление, которое поддерживает клапан. Клапан понижения давления удерживает давление на выходе на этом значении или ниже. Клапан поддержания давления удерживает давление на входе на этом значении или выше.';
$ec_lang['lpn_field_valve_setting_flow']='Уставка расхода';
$ec_lang['lpn_field_valve_setting_flow_tip']='Наибольший расход, который пропускает клапан. Если через клапан хочет пройти меньше воды, он остаётся полностью открытым и не создаёт потерь.';
$ec_lang['lpn_field_valve_setting']='Уставка';
$ec_lang['lpn_field_valve_setting_loss']='Коэффициент потерь';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Сколько напора снимает дроссельный клапан, выраженное как кратное скоростному напору. Используйте 0 для полностью открытого клапана. Это единственное число полностью определяет потерю дроссельного клапана.';
$ec_lang['lpn_field_valve_diameter_tip']='Ширина отверстия в клапане. По этой ширине вычисляется скорость воды в клапане, а по скорости — потеря напора.';
$ec_lang['lpn_field_valve_km_tip']='Потеря напора в корпусе клапана при полностью открытом клапане, в дополнение к потере от уставки клапана. Выражается как кратное скоростному напору. Используйте 0, чтобы не учитывать её.';
$ec_lang['lpn_field_km']='Коэффициент местных потерь, k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Местные потери, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Кривая напора насоса';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Кривая в окне «Библиотеки», которая показывает, сколько напора создаёт этот насос при каждом расходе. Несколько насосов могут использовать одну и ту же кривую, и её изменение там меняет их все. Этот насос хранит только ссылку на неё; сами точки читаются и изменяются в разделе «Библиотеки» → «Кривые».';
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
$ec_lang['lpn_field_tag']='Тег';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Тег может означать что угодно нужное вам, например зону давления или номер наряда на работу. Ни один расчёт здесь или в EPANET его не читает. Тег — это одно слово: EPANET прекращает чтение на первом пробеле, поэтому пробел не принимается при вводе. Он переносится в файл EPANET и обратно.';
$ec_lang['lpn_pump_effic_curve']='Кривая КПД насоса';
$ec_lang['lpn_pump_effic_curve_tip']='Кривая в окне «Библиотеки», которая показывает, какой КПД имеет этот насос при каждом расходе. Несколько насосов могут использовать одну и ту же кривую, и её изменение там меняет их все. Этот насос хранит только ссылку на неё; сами точки читаются и изменяются в разделе «Библиотеки» → «Кривые».';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Кривая не выбрана';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Кривые';
$ec_lang['lpn_curve_library_link_tip']='Открывает окно «Библиотеки» в разделе «Кривые», где кривую можно добавить, описать, изменить и удалить. Элемент указывает, какую кривую он использует.';
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
$ec_lang['lpn_curve_kind_head']='Напор насоса';
$ec_lang['lpn_curve_kind_effic']='КПД насоса';
$ec_lang['lpn_curve_kind_volume']='Объём бака';
$ec_lang['lpn_curve_kind_headloss']='Потери напора клапана';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Вид не указан';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Объём';
$ec_lang['lpn_pump_effic_col']='КПД';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Для этого насоса не выбрана кривая КПД, поэтому он работает с КПД, заданным для всей сети, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Этот насос ссылается на кривую КПД с именем {name}, которая нигде в этом проекте не определена, поэтому он работает с КПД, заданным для всей сети, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Режим: Выбор. Щёлкните элемент или подпись, чтобы посмотреть или изменить его. Перетащите, чтобы переместить узел или подпись. Используйте инструмент «Вершины», чтобы добавить или убрать изгибы трубы.';
$ec_lang['lpn_mode_delete']='Режим: Удаление. Щёлкните элемент, чтобы удалить его.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Режим: Вершины. Вершины каждой трубы показаны маленькими квадратными маркерами. Щёлкните по трубе, чтобы добавить вершину, щёлкните по маркеру, чтобы убрать её, или перетащите маркер, чтобы переместить её. В этом режиме больше ничего на карте не меняется.';
$ec_lang['lpn_mode_zoom_window']='Режим: Окно масштабирования. Щёлкните два противоположных угла прямоугольника или перетащите один, чтобы приблизить карту к нему.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Ничего не выбрано. Сначала щёлкните по элементу на карте, затем нажмите Delete.';
$ec_lang['lpn_mode_add_junction']='Режим: Добавление узла. Щёлкните карту, чтобы разместить узел. Переключитесь в режим «Выбор», чтобы изменять или перемещать элементы и подписи.';
$ec_lang['lpn_mode_add_reservoir']='Режим: Добавление резервуара. Щёлкните карту, чтобы разместить резервуар. Переключитесь в режим «Выбор», чтобы изменять или перемещать элементы и подписи.';
$ec_lang['lpn_mode_add_tank']='Режим: Добавление бака. Щёлкните карту, чтобы разместить бак. Переключитесь в режим «Выбор», чтобы изменять или перемещать элементы и подписи.';
$ec_lang['lpn_mode_add_pipe']='Режим: Добавление трубы. Щёлкните узел, затем другой узел, чтобы соединить их. Щёлкните в свободном месте между ними, чтобы согнуть линию, или нажмите Escape, чтобы начать заново. Переключитесь в режим «Выбор», чтобы изменять или перемещать элементы и подписи.';
$ec_lang['lpn_mode_add_pump']='Режим: Добавление насоса. Щёлкните узел, затем другой узел, чтобы соединить их. Щёлкните в свободном месте между ними, чтобы согнуть линию, или нажмите Escape, чтобы начать заново. Переключитесь в режим «Выбор», чтобы изменять или перемещать элементы и подписи.';
$ec_lang['lpn_mode_add_valve']='Режим: Добавление клапана. Щёлкните узел, затем другой узел, чтобы соединить их. Щёлкните в свободном месте между ними, чтобы согнуть линию, или нажмите Escape, чтобы начать заново. Переключитесь в режим «Выбор», чтобы изменять или перемещать элементы и подписи.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Режим: Добавление текста. Щёлкните карту, чтобы разместить текстовую подпись. Щёлкните рядом с узлом, чтобы прикрепить текст к этому узлу. Переключитесь в режим «Выбор», чтобы изменять или перемещать элементы и подписи.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Используйте этот режим, чтобы изменять, перемещать и перетаскивать объекты на карте. Это режим, в который страница возвращается по умолчанию: она сама возвращается сюда после некоторых действий, например открытия проекта. Повторное нажатие [Esc] снимает выделение с того, что было выбрано.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Авто';
$ec_lang['lpn_method_switch_confirm']='Изменение метода расчёта трения не меняет уже введённые значения шероховатости труб, а шероховатость для одного метода не имеет смысла для другого. Проверьте после этого каждую трубу. Всё равно изменить?';
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
$ec_lang['lpn_field_closed']='Закрыта';
$ec_lang['lpn_field_closed_tip']='Перекрыть эту трубу, чтобы вода через неё не проходила. Труба остаётся на карте и сохраняет все свои значения, и вы можете снова открыть её в любой момент.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Долгота';
$ec_lang['lpn_field_lat']='Широта';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Северная координата';
$ec_lang['lpn_field_easting']='Восточная координата';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='С';
$ec_lang['lpn_field_easting_abbr']='В';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Ш';
$ec_lang['lpn_field_lon_abbr']='Д';

// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Введите координаты, чтобы разместить этот узел точно. В сценарии это положение применяется только в этом сценарии, так же как и его перетаскивание; в Базе оно размещает узел везде.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Это за пределами карты. Широта в проекции Pseudo Mercator находится в диапазоне от -85,05 до 85,05, а долгота — от -180 до 180.';
$ec_lang['lpn_field_text_size']='Множитель размера';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Показывать при любом масштабе';
$ec_lang['lpn_field_text_all_zoom_tip']='Оставлять этот текст на чертеже при любом масштабе. Снимите отметку, и текст будет скрываться вместе с остальными подписями, как только вид становится шире порога подписей, заданного в разделе «Карта и страница».';
$ec_lang['lpn_tool_labels']='Подписи';
$ec_lang['lpn_labels_heading_node']='Подписи узлов';
$ec_lang['lpn_labels_heading_link']='Подписи связей';
$ec_lang['lpn_labels_mark_extrema']='Отмечать наибольшее и наименьшее значения';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Проводит линию над наибольшим значением каждого подписанного на карте параметра (надчёркивание) и линию под наименьшим значением этого параметра (подчёркивание).';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Применить ко всем';
$ec_lang['lpn_settings_apply_to_all_tip']='Каждый уже начерченный элемент этого типа получает идентификатор, начинающийся с этого текста. Номер у каждого сохраняется. Идентификатор, не заканчивающийся числом, остаётся без изменений.';
$ec_lang['lpn_confirm_apply_prefix']='Переименовать {n} элементов так, чтобы их идентификаторы начинались с {prefix}? Номер у каждого сохранится.';
$ec_lang['lpn_prefix_applied']='Переименовано элементов: {n}. Без изменений оставлено: {skipped}.';
$ec_lang['lpn_labels_suffix_gradient_tip']='Текст, показываемый после уклона потерь напора на карте. Не вводите здесь знак процента — он добавляется автоматически, когда единицы измерения — проценты.';
$ec_lang['lpn_labels_separator']='Текст между значениями';
$ec_lang['lpn_labels_separator_tip']='Текст между одним параметром и следующим в подписи. По умолчанию — пробел.';
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
$ec_lang['lpn_labels_priority_node_tip']='Порядок, в котором значения убираются, когда две подписи узлов перекрываются. Значение под номером 1 убирается первым. Когда остаётся только одно значение, а подписи всё ещё перекрываются, скрывается вся подпись целиком: та, у которой наименьший расход отбора, давление ближе к середине диапазона, либо отметка или напор численно ближе к значениям соседних узлов.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='До';
$ec_lang['lpn_labels_col_after']='После';
$ec_lang['lpn_labels_col_decimals']='Дес. знаки';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Показывать';
$ec_lang['lpn_labels_show_tip']='Порядок, в котором значения появляются на подписи. Значение под номером 1 идёт первым: наверху в многострочной подписи и в начале — в однострочной.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Использовать единицы измерения';
$ec_lang['lpn_labels_use_units_tip']='Отметьте, чтобы показывать единицу измерения в поле «После» и на подписи, и чтобы она менялась вместе с единицами измерения. Снимите отметку, чтобы ввести собственный текст в поле «После».';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Начальное состояние';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Цвета узлов';
$ec_lang['lpn_settings_sym_link_colors']='Цвета связей';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Фоновое изображение…';
$ec_lang['lpn_backdrop_add']='Добавить';
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
$ec_lang['lpn_backdrop_scale']='Масштабировать по точкам';
$ec_lang['lpn_backdrop_scale_entry']='Масштабировать по world-файлу или по размеру одного пикселя на карте';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Масштабировать от текущего размера, вокруг выбранной вами точки';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Щёлкните точку на фоновом изображении, которая должна остаться на месте.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Масштаб от текущего размера. 1 оставляет размер прежним, 1.1 увеличивает на 10%, 0.9 уменьшает на 10%.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Введите размер одного пикселя на карте или вставьте полное содержимое world-файла для изображения';
$ec_lang['lpn_backdrop_scale_entry_bad']='Введите одно число — размер одного пикселя на карте, — или вставьте все шесть строк world-файла.';
$ec_lang['lpn_backdrop_wld_bad']='Этот world-файл поворачивает, зеркально отражает или растягивает изображение неравномерно. Карта может только перемещать изображение и изменять его размер одинаково по обеим осям, поэтому файл не был использован.';
$ec_lang['lpn_backdrop_unreadable']='Ваш браузер не может показать это изображение. Сохраните его в формате PNG или JPEG и добавьте снова.';
$ec_lang['lpn_backdrop_position']='Переместить';
$ec_lang['lpn_backdrop_remove']='Удалить';
$ec_lang['lpn_backdrop_remove_confirm']='Удалить фоновое изображение?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Мировая карта…';
$ec_lang['lpn_map_attach_tip']='Прикрепить мировую карту к этому проекту, не меняя его больше никак.';
$ec_lang['lpn_map_attach_add']='Прикрепить';
$ec_lang['lpn_map_attach_readjust']='Настроить заново';
$ec_lang['lpn_map_attach_readjust_tip']='Вернуться к шагу 2 процесса прикрепления карты.';
$ec_lang['lpn_map_attach_scale_from']='Масштабировать от текущего размера…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Масштабировать карту от её текущего размера, вокруг середины вашего чертежа. 1 оставляет размер прежним, 1.1 увеличивает на 10%, 0.9 уменьшает на 10%.';
$ec_lang['lpn_map_attach_scale_from_bad']='Введите одно число больше нуля.';
$ec_lang['lpn_map_attach_scale_from_done']='Карта изменена в размере, а ваш чертёж и каждая координата в нём остались точно такими, какими были.';
$ec_lang['lpn_map_attach_none']='К этому проекту ещё не прикреплена мировая карта. Сначала используйте «Карта» → «Мировая карта» → «Прикрепить».';
$ec_lang['lpn_map_attach_remove']='Открепить';
$ec_lang['lpn_map_attach_remove_tip']='Убрать мировую карту. Чертёж и его координаты в любом случае не затрагиваются.';
$ec_lang['lpn_map_attach_done']='Теперь мировая карта находится за вашим чертежом, а ваш проект не изменён. Используйте «Карта» → «Мировая карта» → «Открепить», чтобы снова убрать её.';
$ec_lang['lpn_map_attach_removed']='Мировая карта убрана, а чертёж остался точно таким, каким был.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Ваш чертёж находится на карте всего мира, в океане на нулевой широте и нулевой долготе. Сначала найдите своё место: панорамируйте и масштабируйте карту под чертежом, найдите название места или введите широту и долготу. Сам чертёж не перемещается.';
$ec_lang['lpn_mapgeo_step1']='Шаг 1 из 2: найдите своё место в мире';
$ec_lang['lpn_mapgeo_step2']='Шаг 2 из 2: подгоните карту под свой чертёж';
$ec_lang['lpn_mapgeo_hint1']='Панорамируйте и масштабируйте карту под своим чертежом, либо найдите место, либо введите широту и долготу. Затем нажмите «Разместить приблизительно».';
$ec_lang['lpn_mapgeo_readjust_intro']='Ваш чертёж находится там, где вы разместили его в последний раз. Чтобы переместить его в другое место, панорамируйте и масштабируйте карту под чертежом, найдите название места или введите широту и долготу. Сам чертёж не перемещается.';
$ec_lang['lpn_mapgeo_hint2']='Перетащите в любом месте, чтобы сдвинуть карту под своим чертежом. Ваш чертёж и каждая координата в нём остаются точно на своих местах. Нажмите «Привязать здесь», когда карта окажется на нужном месте.';
$ec_lang['lpn_mapgeo_gestures']='Масштабирование перемещает ваш чертёж и карту вместе, чтобы вы могли видеть, насколько хорошо они совпадают. Перетаскивание перемещает только карту.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Повернуть карту';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} градусов';
$ec_lang['lpn_mapgeo_dial_size']='Размер карты';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} раз(а)';
$ec_lang['lpn_mapgeo_dial_help']='Передвигайте два ползунка или вводите значения в поля над ними, чтобы сделать карту больше или меньше и повернуть её. Середина каждого ползунка — это положение, оставшееся от шага подгонки 1, поэтому 1 и 0 означают «не менять». Клавиши со стрелками работают на обоих.';
$ec_lang['lpn_mapgeo_place']='Разместить приблизительно';
$ec_lang['lpn_mapgeo_finish']='Привязать здесь';
$ec_lang['lpn_mapgeo_cancelled']='Мировая карта вернулась туда, где была, а ваш чертёж вообще не перемещался.';
$ec_lang['lpn_mapgeo_locked']='Завершите кнопкой «Привязать здесь» или нажмите «Отмена», прежде чем переключать проекты или сохранять. Размещение мировой карты ещё не завершено.';
$ec_lang['lpn_backdrop_scale_prompt1']='Щёлкните две точки на фоновом изображении, например два конца полосы масштаба. Затем введите настоящее расстояние между ними.';
$ec_lang['lpn_backdrop_scale_prompt2']='Настоящее расстояние между двумя точками';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Щёлкните базовую точку (на изображении) для перемещения.';
$ec_lang['lpn_backdrop_position_prompt2']='Выберите способ задания точки назначения, затем нажмите «Продолжить».';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Изменение фонового изображения.';
$ec_lang['lpn_backdrop_target_label']='Переместить эту точку в:';
$ec_lang['lpn_backdrop_target_node']='Узел';
$ec_lang['lpn_backdrop_target_free']='Любую точку на карте';
$ec_lang['lpn_backdrop_target_coords']='Введённые вами координаты';
$ec_lang['lpn_backdrop_coords_prompt']='Введите X,Y, куда должна переместиться эта точка';
$ec_lang['lpn_backdrop_continue']='Продолжить';
$ec_lang['lpn_tool_settings']='Настройки';
$ec_lang['lpn_settings_show_titles']='Показывать заголовки страницы';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Скрыть эти заголовки';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Показывать подсказку по выбору';
$ec_lang['lpn_settings_area_hint_tip']='Показывает над картой всплывающую подсказку о том, что сделает ваш следующий щелчок, пока вы выбираете область.';
$ec_lang['lpn_settings_id_prefixes']='Префиксы ID';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Значения при создании';
$ec_lang['lpn_settings_defaults_note']='Используются для элементов, которые вы создадите начиная с этого момента. Существующие элементы не изменяются.';
$ec_lang['lpn_settings_push_note']='Применяются только те свойства, подписи которых сейчас показаны.';
$ec_lang['lpn_settings_push_btn']='Применить эти значения для новых элементов ко всем существующим элементам';
$ec_lang['lpn_push_confirm']='Заменить эти свойства у всех существующих элементов текущими начальными значениями? Введённые вами значения будут перезаписаны. Это действие можно отменить.';
$ec_lang['lpn_push_properties']='Свойства:';
$ec_lang['lpn_push_assets']='Узлы и трубы:';
$ec_lang['lpn_push_none_displayed']='Сейчас ни одно начальное значение не показано как подпись, поэтому применять нечего. Включите подписи нужных свойств на панели «Подписи» и попробуйте снова.';
$ec_lang['lpn_push_nothing']='Ни у одного существующего элемента нет ни одного из применяемых свойств.';
$ec_lang['lpn_push_no_change']='У всех элементов уже есть эти значения, поэтому ничего не изменится.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Пользовательские свойства';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Свойства, которые вы определяете сами для своих целей. Они хранятся вместе с проектом и сценариями, как и все остальные свойства.';
$ec_lang['lpn_cp_design']='Конструктор';
$ec_lang['lpn_cp_design_tip']='По одной строке на каждое пользовательское свойство; при открытии строки показываются поля: Ключ, Заголовок, Применяется к, Проверять как, Разрешить или ограничить, поле символов, названное этим выбором, Нижний предел длины, Верхний предел длины, Нижний предел, Верхний предел.';
$ec_lang['lpn_cp_add']='Добавить пользовательское свойство';
$ec_lang['lpn_cp_add_tip']='Добавляет строку в таблицу конструктора и открывает её для редактирования.';
$ec_lang['lpn_cp_remove_tip']='Удаляет это свойство из таблицы конструктора. Значения, уже введённые для ваших элементов, сохраняются в файле и появятся снова, если вы заново создадите свойство с тем же ключом.';
$ec_lang['lpn_cp_none']='Пока не создано ни одного пользовательского свойства.';
$ec_lang['lpn_cp_unnamed']='Пока без имени';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Ключ';
$ec_lang['lpn_cp_key_tip']='Ключ: свойство хранится под этим именем. Пробелы не допускаются, и к нему автоматически добавляется префикс, чтобы ваш ключ никогда не совпал со встроенным полем.';
$ec_lang['lpn_cp_label']='Заголовок';
$ec_lang['lpn_cp_label_tip']='Заголовок: то, что видит пользователь в окне свойств, в разделе «Найти» и в шапке столбца таблицы.';
$ec_lang['lpn_cp_applies']='Применяется к';
$ec_lang['lpn_cp_applies_tip']='Применяется к: список префиксов ID через запятую для элементов, использующих это свойство, например J,L,R.';
$ec_lang['lpn_cp_validate']='Проверять как';
$ec_lang['lpn_cp_validate_tip']='Проверять как: определяет, как должно выглядеть корректное значение. Правила регистра распознают только английский алфавит — это заявленное ограничение. Выберите «Не проверять», чтобы принимать любое значение.';
$ec_lang['lpn_cp_restrict']='Ограничить эти символы';
$ec_lang['lpn_cp_restrict_tip']='Ограничить эти символы: значение может использовать только перечисленные здесь символы либо, наоборот, не может использовать ни один из них; «@» означает любую букву, «#» — любую цифру, а символы «-», «.» и «,» нужно перечислять отдельно, если они разрешены; любые пробельные символы должны стоять между другими символами.';
$ec_lang['lpn_cp_restrict_mode']='Разрешить или ограничить';
$ec_lang['lpn_cp_restrict_mode_tip']='Разрешить или ограничить: указанные символы — это либо единственные, которые может использовать значение, либо те, которые оно использовать не может.';
$ec_lang['lpn_cp_restrict_allow']='Разрешить только эти символы';
$ec_lang['lpn_cp_minlength']='Нижний предел длины';
$ec_lang['lpn_cp_minlength_tip']='Нижний предел длины: любая более короткая запись отмечается — так вы находите пустые и недописанные значения.';
$ec_lang['lpn_cp_length']='Верхний предел длины';
$ec_lang['lpn_cp_length_tip']='Верхний предел длины: любая более длинная запись отмечается.';
$ec_lang['lpn_cp_low']='Нижний предел';
$ec_lang['lpn_cp_low_tip']='Нижний предел: наименьшее ожидаемое значение. Числа сравниваются как числа, а текст — в алфавитном порядке.';
$ec_lang['lpn_cp_high']='Верхний предел';
$ec_lang['lpn_cp_high_tip']='Верхний предел: наибольшее ожидаемое значение. Числа сравниваются как числа, а текст — в алфавитном порядке.';
$ec_lang['lpn_cp_val_none']='Не проверять';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Число .';
$ec_lang['lpn_cp_val_number_comma']='Число ,';
$ec_lang['lpn_cp_val_integer']='Целое число';
$ec_lang['lpn_cp_val_upper']='ВСЕ ЗАГЛАВНЫЕ';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Значение сохраняется точно так, как вы его ввели.';
$ec_lang['lpn_cp_bad_number']='Это значение не является числом, как того требует данное свойство.';
$ec_lang['lpn_cp_bad_integer']='Это значение не является целым числом, как того требует данное свойство.';
$ec_lang['lpn_cp_bad_case']='Это значение написано не ВСЕМИ ЗАГЛАВНЫМИ буквами, как того требует данное свойство.';
$ec_lang['lpn_cp_bad_chars']='Это значение содержит символ, который данное свойство не допускает.';
$ec_lang['lpn_cp_bad_space']='Пробельные символы допускаются только между другими символами.';
$ec_lang['lpn_cp_bad_minlength']='Это значение короче, чем допускает данное свойство.';
$ec_lang['lpn_cp_bad_length']='Это значение длиннее, чем допускает данное свойство.';
$ec_lang['lpn_cp_bad_low']='Это значение меньше нижнего предела данного свойства.';
$ec_lang['lpn_cp_bad_high']='Это значение больше верхнего предела данного свойства.';
$ec_lang['lpn_cp_key_needed']='Задайте этому пользовательскому свойству ключ без пробелов.';
$ec_lang['lpn_cp_key_taken']='Этот ключ уже используется другим пользовательским свойством.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Сценарий';
$ec_lang['lpn_scenario_base']='База';
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
$ec_lang['lpn_scenario_overrides']='Кол-во своих значений';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Янтарное кольцо означает, что этот элемент хранит значение, которое принадлежит только сценарию {name}.';
$ec_lang['lpn_scenario_overrides_tip']='Каждое из этих значений отмечено на карте янтарным кольцом. Переключитесь на {base}, чтобы увидеть чертёж без них.';
$ec_lang['lpn_scenario_menu']='Сценарии';
$ec_lang['lpn_scenario_tip']='Набор значений, который сейчас показан на чертеже и рассчитывается страницей. Щёлкните, чтобы переключить сценарий, добавить, переименовать или удалить его.';
$ec_lang['lpn_scenario_new']='Новый сценарий…';
$ec_lang['lpn_scenario_new_name']='Сценарий {n}';
$ec_lang['lpn_scenario_prompt_name']='Название этого сценария';
$ec_lang['lpn_scenario_rename']='Переименовать сценарий…';
$ec_lang['lpn_scenario_delete']='Удалить сценарий';
$ec_lang['lpn_scenario_delete_confirm']='Удалить сценарий {name} и {n} значений, принадлежащих только ему? Сам чертёж не изменится.';
$ec_lang['lpn_scenario_override']='Только в этом сценарии';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Если отмечено, у этого сценария есть собственное значение, даже если оно совпадает со значением в Базе. Снимите отметку, чтобы снова использовать значение из Базы.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Базовый сценарий: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} исключён из сети в сценарии {scenario}. Он по-прежнему есть на чертеже и в других ваших сценариях.';
$ec_lang['lpn_scenario_push_btn']='Применить значения Базы ко всем сценариям';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Все сценарии возвращаются к значениям Базы для свойств, метки которых показаны сейчас. Значения, введённые для них в любом сценарии, будут удалены.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Заставить все сценарии использовать значения Базы для этих свойств? Значения, введённые для них в любом сценарии, будут удалены. Это действие можно отменить.';
$ec_lang['lpn_scenario_push_scenarios']='Затронутые сценарии:';
$ec_lang['lpn_scenario_push_values']='Удаляемые значения:';
$ec_lang['lpn_scenario_push_none']='Ни один сценарий не имеет собственного значения ни для одного из этих свойств, поэтому ничего не изменится. Ничего не будет удалено.';
$ec_lang['lpn_scenario_preset_flow_static']='1. Проверка расхода: статика';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Калибровка по проверке расхода для проектируемой сети при нулевом расходе. В этом сценарии задайте расход отбора во всех узлах равным 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Проверка расхода: средний';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Калибровка по проверке расхода для проектируемой сети при первом зарегистрированном расходе. В этом сценарии задайте расход отбора в узле, где идёт расход, равным первому измеренному расходу, а расход отбора во всех остальных узлах равным 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Проверка расхода: максимальный';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Калибровка по проверке расхода для проектируемой сети при зарегистрированном максимальном расходе. В этом сценарии задайте расход отбора в узле, где идёт расход, равным максимальному измеренному расходу, а расход отбора во всех остальных узлах равным 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Средние сутки';
$ec_lang['lpn_scenario_preset_average_day_tip']='Множитель расхода отбора 1: каждый расход отбора берётся как введён, и он считается расходом отбора в средние сутки.';
$ec_lang['lpn_scenario_preset_max_day']='5. Максимальные сутки';
$ec_lang['lpn_scenario_preset_max_day_tip']='Множитель расхода отбора 2,0 от среднесуточного, значение-заполнитель. У большинства систем он лежит между 1,2 и 3,0 (National Research Council, 2006). Задайте значение для вашей системы в разделе «Настройки», «Расчёт», «Гидравлика», «Множитель расхода отбора».';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Час пик';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='Множитель расхода отбора 3,0 от среднесуточного, значение-заполнитель. У большинства систем он лежит между 3,0 и 6,0 (National Research Council, 2006). Задайте значение для вашей системы в разделе «Настройки», «Расчёт», «Гидравлика», «Множитель расхода отбора».';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. Пожар плюс максимальные сутки';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='Расход отбора в максимальные сутки (множитель 2,0). Запустите в этом сценарии анализ противопожарного расхода: он добавляет противопожарный расход в каждом узле сверх этого расхода отбора.';
$ec_lang['lpn_delete_drops_overrides']='Удаление этого элемента также удалит {n} значений, которые ваши сценарии хранят для него. Продолжить?';
$ec_lang['lpn_push_base_only']='Это действие изменяет сам чертёж, поэтому его можно выполнить только в {base}. Переключитесь в {base} и попробуйте снова.';
$ec_lang['lpn_field_active']='Часть этой сети';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Снимите эту отметку, чтобы оставить элемент на чертеже, но исключить его из сети: он показывается серым, и расчёт его игнорирует. В сценарии так включается и выключается труба.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Показатель степени эмиттера';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='Показатель степени в уравнении эмиттера EPANET для дождевателей и утечек: расход = коэффициент × давление в степени этого показателя. Он меняет результат только там, где у узла есть эмиттер, а пока это означает сеть, считанную из файла EPANET.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Считать рельеф';
$ec_lang['lpn_elev_dem_sample_tip']='Считывает отметку рельефа в этом узле и показывает её ниже. Поле «Отметка» при этом не меняется. Горизонтальное разрешение данных о рельефе — около 30 м для большей части Земли, и точнее там, где есть более качественные данные.';
$ec_lang['lpn_elev_dem_use']='Использовать рельеф';
$ec_lang['lpn_elev_dem_use_tip']='Помещает отметку рельефа в этом узле в поле «Отметка» выше, заменяя то, что там было. Если рельеф ещё не был считан, сначала считывает его. Одна «Отмена» вернёт прежнее значение.';
$ec_lang['lpn_elev_dem_none']='В данных о рельефе нет отметки для этого узла.';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM показывает {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Источник отметки';
$ec_lang['lpn_settings_elev_source_tip']='Откуда новый узел получает свою отметку. Поверхность земли считывается из Mapbox DEM, разрешение которого — около 30 м для большей части Земли, и точнее там, где есть более качественные данные.';
$ec_lang['lpn_settings_elev_source_typed']='Отметка, введённая выше';
$ec_lang['lpn_settings_elev_source_dem']='DEM Mapbox';
$ec_lang['lpn_settings_accuracy']='Точность';
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
$ec_lang['lpn_settings_default_is']='Значение по умолчанию — {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Насколько близко должен подойти расчёт, прежде чем он остановится, — измеряется как величина, на которую расходы всё ещё меняются от одной итерации к следующей. Меньшее число точнее, но требует больше времени. Оба расчётных ядра читают это же поле, но каждое измеряет это изменение относительно своей суммы: встроенное — относительно суммы расходов отбора, EPANET — относительно суммы расходов по связям. Если поле оставить пустым, эта страница использует более строгую точность, чем собственное значение по умолчанию EPANET.';
$ec_lang['lpn_settings_specific_gravity']='Относительная плотность';
$ec_lang['lpn_settings_viscosity']='Относительная вязкость';
$ec_lang['lpn_settings_viscosity_tip']='Вязкость жидкости относительно воды при 20 градусах Цельсия. Она меняет результат только при использовании метода Дарси-Вейсбаха.';
$ec_lang['lpn_settings_trials']='Максимум итераций';
$ec_lang['lpn_settings_trials_tip']='Сколько итераций допускается, прежде чем расчёт сдастся на сети, которая не сходится.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Если сеть не сходится';
$ec_lang['lpn_settings_unbalanced_tip']='Что делать с сетью, которая исчерпала свои итерации и всё ещё не сошлась. Разрешение дополнительных итераций часто позволяет достичь сходимости. Остановка сообщает последнюю итерацию как есть, а это не решение. Это поле читает только расчётное ядро EPANET. Встроенное расчётное ядро всегда останавливается и отмечает результат как несошедшийся.';
$ec_lang['lpn_settings_unbalanced_continue']='Разрешить дополнительные итерации';
$ec_lang['lpn_settings_unbalanced_stop']='Остановиться и сообщить последнюю итерацию';
$ec_lang['lpn_settings_unbalanced_trials']='Дополнительные итерации перед сообщением';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Сколько ещё итераций разрешить после того, как исчерпан указанный выше максимум, прежде чем будет сообщена последняя итерация. Это поле читает только расчётное ядро EPANET.';
$ec_lang['lpn_settings_head_error']='Предел погрешности напора';
$ec_lang['lpn_settings_head_error_tip']='Дополнительное условие, которое расчёт должен пройти перед остановкой: наибольшая оставшаяся погрешность напора в любой одной трубе. Ноль означает, что это условие не применяется. Это поле читает только расчётное ядро EPANET.';
$ec_lang['lpn_settings_flow_change']='Предел изменения расхода';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Дополнительное условие, которое расчёт должен пройти перед остановкой: наибольшее изменение расхода в любой одной трубе от одной итерации к следующей. Ноль означает, что это условие не применяется. Это поле читает только расчётное ядро EPANET.';
$ec_lang['lpn_settings_damp_limit']='Демпфирование начинается при';
$ec_lang['lpn_settings_damp_limit_tip']='Точность, при которой расчёт начинает делать меньшие шаги, что может помочь колеблющейся сети сойтись. Ноль означает, что демпфирование никогда не применяется. Это поле читает только расчётное ядро EPANET.';
$ec_lang['lpn_settings_option_unset']='Не задано';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Единый коэффициент, применяемый сразу ко всем расходам отбора в сети. Используйте его, чтобы узнать, что делает система при потреблении больше или меньше текущего. Он не меняет введённые вами числа. Сценарий может иметь собственный множитель, поэтому средние сутки, максимальные сутки и час пик — это по одному числу каждый; оставьте его пустым в сценарии, чтобы использовать множитель проекта.';
$ec_lang['lpn_settings_engine_native']='Решать с помощью расчётного ядра EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='Включите этот флажок, чтобы там, где это возможно, использовался встроенный решатель. Иначе всегда используется расчётное ядро EPANET Агентства по охране окружающей среды США. Встроенный решатель не используется для расчётов с продолжённым периодом и при наличии активного PRV, PSV или FCV. При первом использовании расчётного ядра EPANET загружается около 650 КБ, которые затем остаются на этом устройстве. Там, где труба имеет местные (локальные) потери, оба решателя расходятся в последних цифрах: EPANET округляет значение, которое использует для ускорения свободного падения, поэтому его местные потери получаются чуть ниже, чем при точном вычислении.';
$ec_lang['lpn_engine_loading']='Загрузка расчётного ядра EPANET…';
$ec_lang['lpn_engine_failed']='Не удалось загрузить расчётное ядро EPANET. Вместо него показано встроенное расчётное ядро.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Рассчитано расчётным ядром EPANET, поскольку следующие клапаны сами открываются и закрываются:';
$ec_lang['lpn_unit_unknown']='В этом чертеже указана единица измерения, которую эта страница не поддерживает: {unit}. Всё сохранено и показано точно так, как было получено, и ничего не изменено. Ответы дать нельзя, пока этой странице не станет известна эта единица измерения, так как нет способа узнать её величину.';
$ec_lang['lpn_engine_manning_note']='Примечание: при использовании коэффициента шероховатости Маннинга EPANET округляет константу в формуле Маннинга, поэтому потери напора получаются примерно на 0,6% меньше, чем при точном вычислении.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='Расчётное ядро EPANET не приняло эту сеть, поэтому расчёт не выполнялся.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='Расчётное ядро EPANET сообщило: {message}';
$ec_lang['lpn_engine_refused_fallback']='Числа на экране получены встроенным расчётным ядром вместо этого.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Числа на экране получены встроенным расчётным ядром вместо этого. Оно рассчитывает только один момент времени за раз, поэтому это сеть только на момент {time}, где каждый бак всё ещё находится на начальном уровне.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Эти управления называют элемент, которого больше нет в этом проекте, поэтому они были пропущены: {ids}';
$ec_lang['lpn_control_unreadable_note']='Эти управления не удалось прочитать, поэтому они были пропущены: {ids}';
$ec_lang['lpn_rule_dangling_note']='Эти правила ссылаются на элемент, которого больше нет в этом проекте, поэтому они не учитывались при этом расчёте: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Эти правила не удалось прочитать, поэтому они не учитывались при этом расчёте: {ids}';
$ec_lang['lpn_settings_text_size']='Размер текста (пиксели)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Размер символа (пиксели)';
$ec_lang['lpn_settings_link_width']='Ширина линии трубы (пиксели)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Стрелки направления потока';
$ec_lang['lpn_settings_show_arrows_tip']='Рисует на каждой трубе стрелку, показывающую направление течения воды. Стрелки появляются после расчёта, а их отключение не меняет результаты. Этот параметр сохраняется вместе с проектом.';
$ec_lang['lpn_settings_align_labels']='Выравнивать подписи труб по трубам';
$ec_lang['lpn_settings_readability_bias']='Переворачивать подпись, если она наклонена влево от вертикали больше, чем на это число градусов';
$ec_lang['lpn_settings_readability_bias_tip']='Переворачивает подпись, чтобы она осталась читаемой, когда она наклонена от вертикали влево больше, чем на это число градусов.';
$ec_lang['lpn_settings_mask_labels']='Сплошной фон под подписями';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Прилипание выносных линий к заданным углам';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Показывать подписи, когда масштаб карты достигает этой ширины или меньше';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Подписи отображаются, только пока вид карты не шире этого значения. Оставьте поле пустым, чтобы отображать их при любом масштабе. Введите 0, чтобы никогда не отображать подпись, при любом масштабе.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Показывать всегда';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap_sentence']='Не позволять узлам увеличиваться более чем в {n} раза от длины трубы {p} -го процентиля';
$ec_lang['lpn_settings_symbol_cap_tip']='Узел перестаёт расти в масштабе местности, как только его диаметр в натуре становится в это число раз больше длины трубы этого процентиля среди длин всех труб сети. За этой точкой на карте узлы, трубы и другие символы уменьшаются на экране по мере уменьшения масштаба, вместо того чтобы расти в натуре. Исключение — резервуары и баки: они сохраняют свой размер на экране при любом масштабе.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Непрозрачность символа (от 0 до 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Непрозрачность фонового изображения (от 0 до 1)';
$ec_lang['lpn_settings_map_display']='Внешний вид';
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
$ec_lang['lpn_settings_legend_position']='Положение легенды подписей';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Нет';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Откл.';
$ec_lang['lpn_settings_legend_top_left']='Вверху слева';
$ec_lang['lpn_settings_legend_top_right']='Вверху справа';
$ec_lang['lpn_settings_legend_middle_left']='Посередине слева';
$ec_lang['lpn_settings_legend_middle_right']='Посередине справа';
$ec_lang['lpn_settings_legend_bottom_left']='Внизу слева';
$ec_lang['lpn_settings_legend_bottom_right']='Внизу справа';
$ec_lang['lpn_settings_color_node_field']='Цвет узла';
$ec_lang['lpn_settings_color_link_field']='Цвет трубы';
$ec_lang['lpn_settings_color_ramp']='Цветовая шкала';
$ec_lang['lpn_settings_color_credits']='Источники';
$ec_lang['lpn_color_ramp_epanet']='От синего к красному (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='От фиолетового к жёлтому (легче отличать один цвет от другого)';
$ec_lang['lpn_color_ramp_gray']='От светло- к тёмно-серому';
$ec_lang['lpn_settings_color_reverse']='Обратить порядок цветов';
$ec_lang['lpn_color_none']='Без цвета';
$ec_lang['lpn_settings_color_key_position']='Положение цветовой легенды';
$ec_lang['lpn_settings_color_breaks']='Границы цветовых диапазонов';
$ec_lang['lpn_settings_color_equal_intervals']='Равные интервалы';
$ec_lang['lpn_settings_color_equal_counts']='Равные количества';
$ec_lang['lpn_settings_color_no_values']='Пока нет значений для работы. Сначала выполните расчёт сети.';
$ec_lang['lpn_confirm_restore_defaults']='Сбросить все настройки (префиксы ID, начальные значения, настройки решателя, внешний вид карты, положение легенды и видимые подписи) к исходным значениям? Ваша сеть не изменится. Настройки принадлежат открытому проекту, поэтому в других ваших проектах сохранятся свои.';
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
$ec_lang['lpn_settings_wipe_btn']='Начать заново';
$ec_lang['lpn_confirm_wipe']='Удалить ВСЁ, что сохранено для этой страницы — каждый проект, каждое фоновое изображение, все настройки и выбранные вами единицы измерения, — и перезагрузить страницу так, как её увидел бы совершенно новый посетитель? Это действие нельзя отменить.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Скопируйте эту ссылку:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Время';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Общая продолжительность работы';
$ec_lang['lpn_time_hyd_step']='Гидравлический шаг по времени';
$ec_lang['lpn_time_pattern_step']='Шаг по времени графика потребления';
$ec_lang['lpn_time_pattern_start']='Время начала графика потребления';
$ec_lang['lpn_time_report_step']='Шаг вывода результатов';
$ec_lang['lpn_time_report_start']='Время начала вывода результатов';
$ec_lang['lpn_time_clock_start']='Время на часах в начале';
$ec_lang['lpn_time_clock_day']='День {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Записывайте время как часы и минуты, например 2:30. Просто число означает часы, поэтому 8 — это восемь часов. Полчаса — это 0:30.';
$ec_lang['lpn_time_running']='Расчёт с продолжённым периодом расчётным ядром EPANET.';
$ec_lang['lpn_time_no_engine']='Встроенный решатель рассчитывает только один момент времени, поэтому это сеть только на {time}: каждый график читается на этот момент, а каждый бак по-прежнему находится на начальном уровне, а не наполняется и не опорожняется. Подключитесь к интернету один раз, чтобы загрузить расчётное ядро EPANET, которое выполняет расчёт с продолжённым периодом.';
$ec_lang['lpn_time_slider']='Прошедшее время расчёта';
$ec_lang['lpn_time_no_period']='В этом проекте не задан расчёт с продолжённым периодом, поэтому есть только один момент для показа. Задайте «Общую продолжительность работы» в разделе «Настройки» → «Расчёт» → «Время», чтобы выполнить расчёт с продолжённым периодом.';
$ec_lang['lpn_time_first']='Перейти к началу';
$ec_lang['lpn_time_prev']='Шаг назад';
$ec_lang['lpn_time_play']='Воспроизвести';
$ec_lang['lpn_time_play_tip']='Воспроизвести анимацию';
$ec_lang['lpn_time_pause_tip']='Приостановить анимацию';
$ec_lang['lpn_time_pause']='Пауза';
$ec_lang['lpn_time_next']='Шаг вперёд';
$ec_lang['lpn_time_last']='Перейти к концу';
$ec_lang['lpn_time_tank']='Бак';
$ec_lang['lpn_time_level']='Уровень воды';
$ec_lang['lpn_time_run']='Рассчитать';
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
$ec_lang['lpn_time_run_done']='Расчёт завершён. Моменты отчёта: {frames}. Затраченное время: {secs} с.';
$ec_lang['lpn_time_runbox_hide']='Больше не показывать это окно';
$ec_lang['lpn_settings_runbox']='Показывать окно хода расчёта';
$ec_lang['lpn_settings_runbox_tip']='Окно, которое сообщает, насколько продвинулся расчёт и что он обнаружил. Если оно отключено, по завершении расчёта то же самое на несколько секунд появляется в строке состояния. Это настройка браузера, а не проекта.';
$ec_lang['lpn_time_run_failed']='Расчёт не завершился, поэтому результатов для более поздних моментов времени нет.';
$ec_lang['lpn_time_run_report']='Отчёт о расчёте EPANET';
$ec_lang['lpn_time_run_report_copy']='Копировать';
$ec_lang['lpn_time_run_report_copied']='Скопировано';
$ec_lang['lpn_time_run_report_tip']='То, что само расчётное ядро EPANET вывело о последнем расчёте: как он сошёлся и о чём предупредило ядро. Это собственный текст ядра, а не наш.';

$ec_lang['lpn_time_speed']='Скорость';
$ec_lang['lpn_time_speed_tip']='Скорость воспроизведения';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Поиск по настройкам';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Введите одно или несколько слов, чтобы увидеть настройки, в которых упоминаются все они.';
$ec_lang['lpn_settings_no_match']='Ни одна настройка не содержит этого слова.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Ширина списка разделов настроек';
$ec_lang['lpn_rpane_empty']='Здесь пока ничего не закреплено. Всё, что относится ко всему проекту, находится в настройках.';
$ec_lang['lpn_time_settings_open']='Настройки времени';

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
$ec_lang['lpn_settings_sec_map']='Карта и страница';
$ec_lang['lpn_settings_sec_assets']='Элементы';
$ec_lang['lpn_settings_sec_calculation']='Расчёт';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Абонент';
$ec_lang['lpn_labels_customer_note']='Подпись абонента показывает значения, отмеченные здесь. Она отображается тем же размером текста, что и все остальные подписи на карте.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Подписи абонентов отображаются, только пока вид карты не шире этого значения. Оставьте поле пустым, чтобы отображать их при любом масштабе. Введите 0, чтобы никогда не отображать подпись абонента, при любом масштабе. Это не действует, если значение больше, чем аналогичная настройка для всех подписей.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Использовать текущий вид';
$ec_lang['lpn_settings_page']='Страница';
$ec_lang['lpn_settings_hydraulics']='Гидравлика';
$ec_lang['lpn_settings_quality']='Качество';
$ec_lang['lpn_settings_quality_track']='Параметр качества';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Выберите, что должен отслеживать расчёт по сети: как долго вода находится в системе, откуда она пришла, или химическое вещество, которое реагирует по мере движения. Коэффициенты нужны только для химического вещества.';
$ec_lang['lpn_settings_quality_source']='Узел трассировки';
$ec_lang['lpn_settings_quality_source_tip']='Узел, чья вода отслеживается. Каждый другой узел затем показывает долю своей воды, пришедшую от этого узла.';
$ec_lang['lpn_quality_none']='Ничего';
$ec_lang['lpn_quality_trace']='Трассировка источника';
$ec_lang['lpn_quality_chemical']='Реагирующее химическое вещество';
$ec_lang['lpn_quality_needs_run']='Качество воды переносится по трубам во времени, поэтому для этого нужен расчёт с продолжённым периодом. Задайте «Общую продолжительность работы» в разделе «Время», затем нажмите кнопку «Рассчитать».';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Химическое вещество';
$ec_lang['lpn_quality_chemical_name_tip']='Химическое вещество, которое вы отслеживаете, например «Хлор». Оставьте поле пустым для стандартной подписи EPANET по умолчанию, «Chemical». Показывается в ваших отчётах, но не используется в расчётах.';
$ec_lang['lpn_quality_mass_units']='Единицы массы';
$ec_lang['lpn_quality_mass_units_tip']='Единичная часть значения качества воды — два собственных варианта EPANET.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Допуск качества воды';
$ec_lang['lpn_quality_tolerance_tip']='Насколько два соседних объёма воды могут различаться по концентрации, прежде чем EPANET начнёт считать их одним. Пустое поле использует собственное значение EPANET по умолчанию — 0,01.';
$ec_lang['lpn_quality_diffusivity']='Относительная диффузия';
$ec_lang['lpn_quality_diffusivity_tip']='Насколько легко вещество распространяется в воде по сравнению с хлором. Пустое поле использует собственное значение EPANET по умолчанию — 1,0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Концентрация {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Средняя концентрация {chemical}';
$ec_lang['lpn_quality_initial']='Начальное качество';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Сколько химического вещества содержится в этом узле в начале расчёта. Резервуар сохраняет своё значение на весь расчёт, что обычно и есть способ задать остаточную концентрацию на выходе с водоочистной станции. Пустое поле означает 0.';
$ec_lang['lpn_result_concentration']='Концентрация';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Сколько химического вещества остаётся в этой точке после того, как оно прошло путь и прореагировало. Единицы измерения — те, что указаны вами рядом с названием вещества в разделе «Настройки» → «Расчёт» → «Качество».';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Тип источника';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Какой тип дозирования источника вещества применяется здесь на основе значения «Качество источника»? «Источник концентрации» использует это значение как концентрацию, применяемую к внешнему притоку (из резервуара или отрицательного расхода отбора). «Массовый дозатор» добавляет фиксированный массовый расход в минуту к воде, поступающей в узел из остальной сети. «Дозатор уставки» обеспечивает, чтобы концентрация воды, выходящей из узла, была не ниже этого значения. «Дозатор, пропорциональный расходу» добавляет фиксированную концентрацию к концентрации, получающейся в результате смешения всего притока к узлу из остальной сети.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Нет';
$ec_lang['lpn_source_type_concen']='Концентрация';
$ec_lang['lpn_source_type_mass']='Массовый дозатор';
$ec_lang['lpn_source_type_setpoint']='Дозатор уставки';
$ec_lang['lpn_source_type_flowpaced']='Дозатор, пропорциональный расходу';
$ec_lang['lpn_source_quality']='Качество источника';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Насколько сильна доза. Для всех типов, кроме массового дозатора, это концентрация в единицах, указанных рядом с веществом в разделе «Настройки» → «Расчёт» → «Качество»; для массового дозатора это массовый расход в минуту. Пустое поле означает отсутствие источника вещества, что по действию равнозначно нулю.';
$ec_lang['lpn_source_pattern']='График источника';
$ec_lang['lpn_source_pattern_tip']='График во времени, который масштабирует дозу на протяжении расчёта, если подача непостоянна. Отсутствие графика означает, что доза одинакова на каждом шаге.';
$ec_lang['lpn_mixing_model']='Модель перемешивания';
$ec_lang['lpn_mixing_model_tip']='Как вода, уже находящаяся в этом баке, перемешивается с поступающей водой. «Полное перемешивание» сразу перемешивает весь бак. «Двухзонное перемешивание» сначала заполняет входную зону, а затем передаёт остальное дальше. «Вытеснение FIFO» пропускает воду в том порядке, в котором она поступила. «Вытеснение LIFO» укладывает её слоями, так что последняя поступившая вода выходит первой. Этот выбор меняет возраст воды и остаточную концентрацию и не меняет ни давление, ни расход.';
$ec_lang['lpn_mixing_mixed']='Полное перемешивание';
$ec_lang['lpn_mixing_2comp']='Двухзонное перемешивание';
$ec_lang['lpn_mixing_fifo']='Вытеснение FIFO';
$ec_lang['lpn_mixing_lifo']='Вытеснение LIFO';
$ec_lang['lpn_mixing_fraction']='Доля перемешивания';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Доля объёма бака, которую занимает входная зона, от 0 до 1. Используется только при двухзонном перемешивании. Пустое поле означает, что входной зоной считается весь бак.';
$ec_lang['lpn_reaction_bulk']='Коэффициент объёмной реакции';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Реакция в толще воды (см. справку EPANET), используемая для каждой трубы и бака, у которых нет собственного значения. Отрицательное число означает распад вещества, а положительное — его нарастание. Пустое поле означает отсутствие объёмной реакции.';
$ec_lang['lpn_reaction_wall']='Коэффициент пристеночной реакции';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Реакция на стенке трубы (см. справку EPANET), используемая для каждой трубы, у которой нет собственного значения. Отрицательное число означает распад вещества. Пустое поле означает отсутствие пристеночной реакции.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Реакция в толще воды (см. справку EPANET). Отрицательное число означает распад вещества, а положительное — его нарастание. Пустое поле означает использование коэффициента, заданного для всей сети в разделе «Настройки» → «Расчёт» → «Качество».';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Коэффициент реакции';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Реакция в воде, находящейся в этом баке, как скорость в 1/сут. Отрицательное число означает распад вещества, а положительное — его нарастание. Вода стоит в баке гораздо дольше, чем в любой трубе, поэтому именно здесь остаточная концентрация часто теряется. Пустое поле означает использование коэффициента объёмной реакции, заданного для всей сети в разделе «Настройки» → «Расчёт» → «Качество».';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Объёмная реакция';
$ec_lang['lpn_reaction_wall_short']='Пристеночная реакция';
$ec_lang['lpn_reaction_tank_short']='Реакция';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/сут';
$ec_lang['lpn_reaction_day']='сут';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Порядок объёмной реакции';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='Показатель степени, в которую возводится концентрация при реакции в толще воды. Допустимо любое действительное число. Значение по умолчанию — 1, оно используется для большинства расчётов распада хлора. Значение 0 делает скорость реакции не зависящей от того, сколько вещества присутствует.';
$ec_lang['lpn_reaction_order_tank']='Порядок реакции в баке';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='Показатель степени, в которую возводится концентрация при реакции в воде, находящейся в баке, отдельно от порядка объёмной реакции, поэтому бак может реагировать по иному порядку, чем трубы. Допустимо любое действительное число, значение по умолчанию — 1. EPANET задаёт это значение как ORDER TANK в файле и не предлагает для него поля в собственном интерфейсе.';
$ec_lang['lpn_reaction_order_wall']='Порядок пристеночной реакции';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 означает, что пристеночная реакция происходит согласно заданному коэффициенту (коэффициентам). 0 означает, что она не происходит. Это переключатель «вкл/выкл». Значение по умолчанию — 1.';
$ec_lang['lpn_reaction_order_unstated']='Не задан';
$ec_lang['lpn_reaction_order_zero']='0, нулевой порядок';
$ec_lang['lpn_reaction_order_first']='1, первый порядок';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Предельная концентрация';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Концентрация, к которой стремится вещество, вместо того чтобы распадаться до нуля или неограниченно нарастать. По мере приближения воды к этому значению реакция замедляется и на нём останавливается. Используйте единые единицы измерения. Если поле пустое, ограничения нет.';
$ec_lang['lpn_reaction_rough_corr']='Корреляция с шероховатостью';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Связывает пристеночную реакцию с собственной шероховатостью каждой трубы, так что более шероховатая труба реагирует быстрее. Когда эта опция включена, для каждой трубы по её шероховатости вычисляется собственный пристеночный коэффициент, и единый пристеночный коэффициент выше уже не используется. Не используется, если поле пустое.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Это приложение не предлагает собственных значений коэффициента реакции. Стандартного метода его определения не существует, а опубликованные полевые значения для одной и той же воды различаются в десять раз. Введите значение, которое вы измерили сами или на которое можете сослаться, либо оставьте поля пустыми для вещества, которое не реагирует.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Энергия';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Отчёты';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_epanet']='Расчёт EPANET';
$ec_lang['lpn_energy_title']='Отчёт об энергии насосов';
$ec_lang['lpn_energy_menu']='Энергия насосов';
$ec_lang['lpn_energy_efficiency']='КПД насоса (проценты)';
$ec_lang['lpn_energy_efficiency_tip']='Полный КПД «от провода до воды», используемый для каждого насоса, у которого нет собственной кривой КПД. Если ничего не указано, EPANET использует 75 процентов.';
$ec_lang['lpn_energy_price']='Цена электроэнергии';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Сколько стоит один киловатт-час. Применяется к каждому насосу, у которого нет собственной цены. Пустое поле означает 0.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Сколько стоит один киловатт-час у этого насоса. Пустое поле означает использование цены, заданной для всей сети в разделе «Настройки» → «Энергия».';
$ec_lang['lpn_energy_price_pattern']='График цены';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='График, который умножает цену на каждом шаге графика — так задаётся льготный ночной тариф. Оставьте поле пустым для постоянной цены на протяжении всего расчёта.';
$ec_lang['lpn_energy_demand_charge']='Плата за пиковую мощность';
$ec_lang['lpn_energy_demand_charge_tip']='Сколько коммунальная служба берёт за кВт пиковой нагрузки, потребляемой насосами системы.';
$ec_lang['lpn_energy_currency']='Валюта';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Всё, что вы здесь напишете, печатается рядом с каждой денежной суммой. Это просто подпись, но указывайте её одинаково везде.';
$ec_lang['lpn_energy_kwh']='кВт·ч';
$ec_lang['lpn_energy_kw']='кВт';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Это приложение не предлагает собственных значений цены. Стоимость электроэнергии зависит от коммунальной службы, страны, часа и года.';
$ec_lang['lpn_energy_needs_run']='Энергия насосов — это мощность, проинтегрированная по времени расчёта, поэтому для неё нужны расчётное ядро EPANET и общая продолжительность работы. Задайте «Общую продолжительность работы» в разделе «Настройки» → «Расчёт» → «Время», нажмите кнопку «Рассчитать», затем откройте «Вода» → «Отчёты» → «Энергия насосов».';
$ec_lang['lpn_energy_no_pumps']='В этой сети нет насосов, поэтому потреблять энергию нечему.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Сравнение сценариев';
$ec_lang['lpn_scncmp_menu_tip']='Рассчитывает каждый сценарий этого проекта и показывает их бок о бок: наименьшее давление и наибольшую скорость в каждом.';
$ec_lang['lpn_scncmp_running']='Расчёт всех сценариев…';
$ec_lang['lpn_scncmp_empty']='Пока ничего не нарисовано, поэтому рассчитывать нечего.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Наибольшая скорость';
$ec_lang['lpn_scncmp_at']='{value} в {id}';
$ec_lang['lpn_scncmp_current']='(сейчас открыт)';
$ec_lang['lpn_scncmp_note']='Каждый сценарий рассчитывается по копии чертежа. Здесь ничего не меняет проект, а сценарий, с которым вы работаете, остаётся таким же, как был.';
$ec_lang['lpn_energy_over']='Для расчёта с продолжённым периодом {time}';
$ec_lang['lpn_energy_col_pump']='Насос';
$ec_lang['lpn_energy_col_running']='% работы';
$ec_lang['lpn_energy_col_effic']='КПД';
$ec_lang['lpn_energy_col_avg_kw']='Ср. кВт';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='Средняя мощность, потребляемая, когда этот насос работал. Она не усредняется по времени простоя, поэтому насос, простоявший большую часть расчёта с продолжённым периодом, всё равно показывает мощность, которую он потреблял во время работы.';
$ec_lang['lpn_energy_col_peak_kw']='Пик. кВт';
$ec_lang['lpn_energy_col_kwh']='кВт·ч';
$ec_lang['lpn_energy_col_cost']='Стоимость';
$ec_lang['lpn_energy_total_kwh']='Использовано энергии';
$ec_lang['lpn_energy_total_energy_cost']='Стоимость энергии';
$ec_lang['lpn_energy_peak_kw']='Пиковая потребляемая мощность';
$ec_lang['lpn_energy_total_demand_charge']='Плата за пиковую мощность';
$ec_lang['lpn_energy_total_cost']='Итоговая стоимость';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Состояние';
$ec_lang['lpn_reports_status_tip']='Что изменилось за последний расчёт с продолжённым периодом, в хронологическом порядке: открытие и закрытие насосов и клапанов, наполнение, опорожнение, переполнение или осушение баков, а также шаги, которые не полностью сошлись.';
$ec_lang['lpn_status_title']='Отчёт о состоянии';
$ec_lang['lpn_status_needs_run']='Отчёт о состоянии перечисляет, что изменилось во время расчёта с продолжённым периодом. Задайте «Общую продолжительность работы» в разделе «Настройки» → «Расчёт» → «Время», нажмите «Рассчитать», затем откройте «Вода» → «Отчёты» → «Отчёт о состоянии».';
$ec_lang['lpn_status_empty']='За этот расчёт состояние ничего не изменило.';
$ec_lang['lpn_status_col_event']='Событие';
$ec_lang['lpn_status_opened']='{type} {id} теперь открыт(а)';
$ec_lang['lpn_status_closed']='{type} {id} теперь закрыт(а)';
$ec_lang['lpn_status_filling']='{type} {id} теперь наполняется';
$ec_lang['lpn_status_emptying']='{type} {id} теперь опорожняется';
$ec_lang['lpn_status_full']='{type} {id} теперь полон(на)';
$ec_lang['lpn_status_dry']='{type} {id} теперь пуст(а)';
$ec_lang['lpn_status_no_converge']='Гидравлическое решение на этом шаге не полностью сошлось; показанные числа — результат его последней итерации.';
$ec_lang['lpn_status_note']='Считывается из того же расчёта с продолжённым периодом, что и панель «Таблицы» и «Полный отчёт». Перечисляются только изменения, а не каждый шаг.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Полный';
$ec_lang['lpn_reports_full_tip']='Каждый узел и каждая связь на каждом моменте отчёта последнего расчёта в виде одной таблицы, которую можно скачать или напечатать.';
$ec_lang['lpn_full_title']='Полный отчёт';
$ec_lang['lpn_full_needs_run']='Полный отчёт перечисляет каждый узел и каждую связь на каждом моменте отчёта. Нажмите «Рассчитать», затем откройте «Вода» → «Отчёты» → «Полный отчёт».';
$ec_lang['lpn_full_note']='Одна строка на узел или связь на каждый момент отчёта, в единицах измерения, показанных на панели «Таблицы». Пустая ячейка означает, что у этого столбца нет такой величины. Скачивание или печать включает все моменты отчёта; таблица ниже показывает по одному моменту за раз.';
$ec_lang['lpn_full_step_label']='Момент времени';
$ec_lang['lpn_full_download_csv']='Скачать CSV';
$ec_lang['lpn_full_print']='Печать отчёта';
$ec_lang['lpn_full_col_time']='Время';
$ec_lang['lpn_full_col_type']='Тип';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} строк.';
$ec_lang['lpn_energy_no_price']='Цена электроэнергии не указана, поэтому все затраты здесь равны нулю. Задайте её в разделе «Настройки» → «Энергия».';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='В этой сети указана нулевая цена, поэтому все затраты здесь равны нулю. Измените её в разделе «Настройки» → «Энергия».';
$ec_lang['lpn_energy_curve_note']='Эти насосы ссылаются на кривую КПД без единой точки: {ids}. Они работали с КПД, заданным для всей сети.';
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
$ec_lang['lpn_settings_sym_all']='Узел и связь';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Равные интервалы';
$ec_lang['lpn_color_mode_quantile']='Квантили (равное число)';
$ec_lang['lpn_color_mode_jenks']='Естественные границы (Дженкс)';
$ec_lang['lpn_color_mode_stddev']='Стандартное отклонение';
$ec_lang['lpn_color_mode_pretty']='Округлённые';
$ec_lang['lpn_color_mode_log']='Логарифмическая';
$ec_lang['lpn_color_mode_manual']='Вручную';

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
$ec_lang['lpn_library_patterns']='Графики';
$ec_lang['lpn_library_patterns_tip']='График — это повторяющийся список множителей. Каждый из них применяется на один шаг времени графика, поэтому 24 числа с шагом в один час образуют повторяющиеся сутки. Расход отбора 10 с множителем 1,5 в этот момент равен 15.';
$ec_lang['lpn_library_curves']='Кривые';
$ec_lang['lpn_library_curves_tip']='Кривая — это список точек, который показывает, как что-либо работает: сколько напора создаёт насос при каждом расходе, какой у него КПД при этом расходе или сколько напора теряет клапан при каждом расходе.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Кривая принадлежит проекту, а насос или клапан указывает, какую из них использует, в своих собственных свойствах. Несколько элементов могут использовать одну и ту же кривую, и её изменение здесь меняет их все. Для кривой напора насоса расчёт использует кривую, подобранную по точкам, как показано; для всех остальных видов точки соединяются прямыми отрезками, как показано.';
$ec_lang['lpn_library_curve_add']='Добавить кривую';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Вид кривой';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Уравнение';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='Кривая, подобранная по заданным точкам и используемая для модели насоса.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Выделите один или два столбца в электронной таблице, скопируйте их и вставьте в первую ячейку, куда вы хотите их поместить. Строки добавляются по мере необходимости. Можно также вставить строки, скопированные прямо из файла EPANET, включая имя кривой.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Описание';
$ec_lang['lpn_library_curve_remove_point']='Удалить эту точку';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Копировать точки';
$ec_lang['lpn_library_curve_copy_tip']='Копирует все точки в виде двух столбцов, готовых для вставки в электронную таблицу.';
$ec_lang['lpn_library_curve_copy_manual']='Копировать эти точки';
$ec_lang['lpn_library_curve_used_by']='Элементы, использующие эту кривую';
$ec_lang['lpn_library_curve_unused']='Эту кривую ничто не использует.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Эту кривую использует {count} элементов: {ids}. Сначала перенаправьте их на другую кривую, а затем удалите эту.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Типы труб';
$ec_lang['lpn_library_pipetypes_tip']='Тип трубы — это описание, на которое могут ссылаться несколько труб для своего диаметра, шероховатости и коэффициентов реакции. Изменение описания меняет каждую трубу, которая его использует.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='У каждого проекта своя библиотека типов труб. В описании типа трубы можно оставлять свойства пустыми. Например, тип трубы, у которого задана шероховатость, но не задан диаметр, — это нормально. Типы труб присваиваются трубам в редакторе их свойств. Изменение описания здесь меняет каждую трубу, которая на него ссылается.';
$ec_lang['lpn_library_pipetype_add']='Добавить тип трубы';
$ec_lang['lpn_library_pipetype_blank_tip']='Пустые свойства в описании типа трубы оставлены для индивидуального ввода для каждой трубы.';
$ec_lang['lpn_library_pipetype_used_by']='Трубы, использующие этот тип';
$ec_lang['lpn_library_pipetype_unused']='Этот тип трубы ничто не использует.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Этот тип трубы используют {count} труб: {ids}. Прежде чем удалить его, отсоедините их от него.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Тип трубы';
$ec_lang['lpn_field_pipetype_tip']='Тип трубы из библиотеки проекта, который использует эта труба. Свойства, включённые в тип трубы, здесь недоступны для редактирования. Чтобы включить редактирование здесь, отсоедините тип трубы.';
$ec_lang['lpn_pipetype_none']='Тип трубы не выбран';
$ec_lang['lpn_pipetype_detach']='Отсоединить от типа трубы';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Копирует в саму трубу значения, которые она считывает из своего типа, и прекращает использовать этот тип. Значения трубы сейчас не изменятся, а начиная с этого момента вы сможете редактировать их здесь.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Фитинги';
$ec_lang['lpn_library_fittings_tip']='Список фитингов — это набор фитингов с их количеством, на который могут ссылаться несколько труб. В сумме он даёт один коэффициент местных потерь.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='У каждого проекта своя библиотека фитингов. Список фитингов содержит фитинги с количеством каждого из них, и в сумме он даёт единый коэффициент местных потерь. На список могут ссылаться как трубы, так и типы труб.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Здесь предложены тринадцать фитингов из таблицы 3.3 руководства пользователя EPANET 2.2. Выбор одного из них копирует его коэффициент в строку, где вы можете его изменить. Коэффициент зависит от размера и изготовителя фитинга, поэтому относитесь к таблице как к отправной точке, а не как к готовому ответу.';
$ec_lang['lpn_library_fittings_add']='Добавить список фитингов';
$ec_lang['lpn_library_fittings_used_by']='Трубы, использующие этот список фитингов';
$ec_lang['lpn_library_fittings_unused']='Этот список фитингов ничто не использует.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Этот список фитингов используют {count} труб: {ids}. Прежде чем удалить его, отсоедините их от него.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Импорт библиотек…';
$ec_lang['lpn_library_import_tip']='Выберите другой файл проекта и скопируйте из него целые библиотеки в этот проект. Всё, чьё имя здесь уже занято, пропускается и перечисляется, поэтому ничего из того, что у вас уже есть, не меняется.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Выберите, что скопировать из {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Каждая отмеченная вами библиотека копируется целиком. Удалите то, что вам не нужно, тем же способом, каким удаляете любую другую запись.';
$ec_lang['lpn_library_import_go']='Импорт';
$ec_lang['lpn_library_import_no_libraries']='В этом файле проекта нет библиотек для копирования.';
$ec_lang['lpn_library_import_heading']='Импортировано из {file}';
$ec_lang['lpn_library_import_added']='Скопировано: {names}';
$ec_lang['lpn_library_import_conflict']='Пропущено, потому что в этом проекте уже есть запись с таким же именем: {names}. Здесь ничего не изменено. Переименуйте одну из них и импортируйте заново, если хотите иметь обе.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='В этом файле проекта нет ничего из этого для копирования.';
$ec_lang['lpn_library_import_curve_shape']='Эти кривые перенесены в точности так, как их записал файл, и расчёт не сможет использовать ни одну из них, пока её первый столбец не будет возрастать от точки к точке: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Эти типы труб ссылаются на список фитингов, которого нет в этом проекте: {names}. Импортируйте библиотеку фитингов из этого же файла, и они найдут его.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Внимание: несовпадение единиц измерения. Будет импортировано как есть. Не рекомендуется.';
$ec_lang['lpn_library_import_units_line']='{name}: в этом проекте — {mine}, в файле — {theirs}.';
$ec_lang['lpn_fitting_qty']='Количество';
$ec_lang['lpn_fitting_name']='Фитинг';
$ec_lang['lpn_fitting_k']='Коэффициент';
$ec_lang['lpn_fitting_add']='Добавить фитинг';
$ec_lang['lpn_fitting_remove']='Удалить';
$ec_lang['lpn_fitting_total']='Суммарный коэффициент местных потерь, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Список фитингов';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Список фитингов из библиотеки проекта. Его количества и коэффициенты складываются в коэффициент местных потерь этой трубы, и после этого поле коэффициента доступно только для чтения. Оставьте это поле невыбранным, чтобы ввести коэффициент самостоятельно.';
$ec_lang['lpn_fittings_none']='Список фитингов не выбран';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Проходной вентиль, полностью открыт';
$ec_lang['lpn_fitting_angle']='Угловой вентиль, полностью открыт';
$ec_lang['lpn_fitting_swingcheck']='Поворотный обратный клапан, полностью открыт';
$ec_lang['lpn_fitting_gate']='Задвижка, полностью открыта';
$ec_lang['lpn_fitting_elbow_short']='Колено малого радиуса';
$ec_lang['lpn_fitting_elbow_medium']='Колено среднего радиуса';
$ec_lang['lpn_fitting_elbow_long']='Колено большого радиуса';
$ec_lang['lpn_fitting_elbow_45']='Колено 45 градусов';
$ec_lang['lpn_fitting_return_bend']='Закрытый обратный отвод (180°)';
$ec_lang['lpn_fitting_tee_run']='Стандартный тройник, поток по прямому проходу';
$ec_lang['lpn_fitting_tee_branch']='Стандартный тройник, поток через отвод';
$ec_lang['lpn_fitting_entrance']='Прямоугольная кромка входа';
$ec_lang['lpn_fitting_exit']='Выход';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Другой фитинг';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='Сохранено: {file}';
$ec_lang['lpn_inp_export_flat_lead']='Экспортированный файл EPANET численно эквивалентен этому проекту. Но в нём нет места для следующего:';
$ec_lang['lpn_inp_export_flat_types']='{n} труб здесь ссылаются на {t} типов труб. В файле каждая из этих труб несёт собственную копию чисел, поэтому ответы совпадают. Чего файл не может хранить, так это сам тип трубы, поэтому изменение одного описания с автоматическим применением ко всем трубам фиксируется только в файле вашего собственного проекта.';
$ec_lang['lpn_inp_export_flat_coords']='Файл EPANET хранит одно положение для каждого узла. Этот сценарий размещает {n} из них в другом месте, и именно эти положения попадают в файл. Все остальные сценарии хранят свои собственные положения только в вашем файле проекта.';
$ec_lang['lpn_inp_export_flat_fittings']='Файл EPANET не может хранить список колен, клапанов и тройников из вашего файла проекта. Коэффициент местных потерь {n} труб здесь складывается из списка фитингов. Итоговое значение попадает в файл в точности таким, какое оно есть, поэтому в ответах ничего не меняется.';
$ec_lang['lpn_library_controls']='Управления';
$ec_lang['lpn_library_controls_tip']='Управление — это одно предложение, которое открывает или закрывает связь либо задаёт ей уставку, когда это говорит уровень воды, давление или время.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Добавить график';
$ec_lang['lpn_library_pattern_values']='Множители';
$ec_lang['lpn_library_pattern_values_tip']='Множители, разделённые пробелами или запятыми. Вставьте столбец из электронной таблицы, если он у вас есть. Список повторяется на всё время расчёта, поэтому ему не нужно охватывать весь период целиком.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} множителей с шагом {step}, охватывают {span}';
$ec_lang['lpn_library_pattern_none']='Без графика';
$ec_lang['lpn_settings_default_pattern']='График расхода отбора по умолчанию';
$ec_lang['lpn_settings_default_pattern_tip']='Этот график использует каждый узел, у которого нет своего графика.';
$ec_lang['lpn_library_control_add']='Добавить управление';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Одно предложение на языке ключевых слов EPANET. Четыре формы: LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1 и LINK 12 CLOSED AT CLOCKTIME 3 AM. Вместо OPEN или CLOSED можно написать число — это уставка клапана или скорость насоса. Оставляйте ключевые слова на английском языке: именно их читает страница.';
$ec_lang['lpn_library_control_ok']='✓ Распознано';
$ec_lang['lpn_library_control_bad']='⚠ Не распознано';
$ec_lang['lpn_library_control_missing']='⚠ В этой сети нет ничего с именем {id}';
$ec_lang['lpn_library_rules']='Правила';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Правило — это короткий абзац, который открывает или закрывает связь либо задаёт ей уставку, когда уровень воды, давление, расход или время достигают заданного вами значения. Правило может проверять сразу несколько условий и указывать, что делать, если проверка не пройдена.';
$ec_lang['lpn_library_rule_add']='Добавить правило';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Одно правило на языке ключевых слов EPANET, по одному предложению на строку. Первая строка называет его: RULE 1. Затем условие: IF TANK 2 LEVEL BELOW 17.1. Затем действие: THEN PUMP 9 STATUS IS OPEN. Последняя строка может задать его ранг: PRIORITY 1. Добавляйте строки AND или OR, чтобы проверять сразу несколько условий, и строки ELSE, чтобы указать, что делать, если проверка не пройдена. Условие может читать LEVEL, HEAD, GRADE, PRESSURE или DEMAND узла, FLOW, STATUS или SETTING связи, либо TIME и CLOCKTIME системы SYSTEM. Пишите числа в единицах, которые показывает этот проект, — они будут пересчитаны за вас. Оставляйте ключевые слова на английском языке: именно их читают эта страница и EPANET.';
$ec_lang['lpn_library_rule_ok']='✓ Это правило распознано';
$ec_lang['lpn_library_rule_bad']='⚠ Это правило не удалось прочитать';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Базовый расход отбора';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Расход, который забирает этот узел на показанном шаге времени: каждый базовый расход отбора умножается на свой график и складывается. Это вычисляемое значение, а не введённое, поэтому оно меняется вместе с часами и не может быть изменено вручную.';
$ec_lang['lpn_field_demand_pattern']='График расхода отбора';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Описание';
$ec_lang['lpn_demand_add']='Добавить категорию расхода отбора';
$ec_lang['lpn_demand_remove']='Удалить этот расход отбора';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='График напора';
$ec_lang['lpn_field_head_pattern_tip']='Как уровень воды в этом резервуаре повышается и понижается в течение расчёта. Указанный выше напор умножается на график.';
$ec_lang['lpn_field_pump_speed']='Относительная скорость';
$ec_lang['lpn_field_pump_speed_tip']='1 означает, что этот насос вращается со скоростью, при которой была измерена его кривая. 0,9 — тот же насос, вращающийся медленнее, что снижает добавляемый им напор и пропускаемый расход. На время расчёта это число заменяется графиком скорости.';
$ec_lang['lpn_field_speed_pattern']='График скорости';
$ec_lang['lpn_field_speed_pattern_tip']='Как скорость этого насоса повышается и понижается в течение расчёта. Каждый множитель — это относительная скорость для данной части расчёта, и он заменяет собой настройку «Скорость», а не масштабирует её, поэтому множитель 0 останавливает насос.';

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
$ec_lang['lpn_search_menu']='Поиск места по названию…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Найдите город, улицу или достопримечательность по названию, и карта переместится туда. При первом использовании страница спросит ваше разрешение, потому что введённые вами слова отправляются в службу поиска названий мест OpenStreetMap.';
$ec_lang['lpn_search_bar']='Поиск по названию…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Поиск по названию места отправляет введённые вами слова на nominatim.openstreetmap.org — бесплатную службу поиска названий мест фонда OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Это отдельная служба, отличная от изображений карты улиц на фоне вашего проекта. Изображения сообщают только то, куда вы смотрите. Поиск сообщает то, что вы напечатали. Служба поиска названий мест получит слова вашего запроса и ваш IP-адрес. Мы не отправляем ничего больше и не храним никаких записей о ваших поисковых запросах.';
$ec_lang['lpn_search_consent_3']='Можно ли отправлять ваши поисковые запросы в службу поиска названий мест?';
$ec_lang['lpn_search_consent_4']='Если вы ответите «нет», всё остальное на этой странице будет работать точно так же, как сейчас, включая «Перейти к широте и долготе». Ответ «да» мы запоминаем, чтобы не спрашивать снова. Ответ «нет» вообще не сохраняется.';
$ec_lang['lpn_search_refused']='Поиск по названию места отключён, и ничего не было отправлено. Вы всё ещё можете использовать «Перейти к широте и долготе».';
$ec_lang['lpn_search_prompt']='Найдите место по названию. Город, улица, достопримечательность — например: Petaluma, California';
$ec_lang['lpn_search_empty']='Введите название места для поиска.';
$ec_lang['lpn_search_working']='Поиск…';
$ec_lang['lpn_search_busy']='Поиск уже выполняется. Подождите ответа.';
$ec_lang['lpn_search_choose']='Найдено несколько подходящих мест. Какое из них?';
$ec_lang['lpn_search_nochoice']='Ничего не выбрано, поэтому карта не переместилась.';
$ec_lang['lpn_search_badchoice']='Это не один из номеров в списке.';
$ec_lang['lpn_search_none']='По этому названию ничего не найдено.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Служба поиска названий мест просит нас снизить частоту запросов. Подождите минуту и попробуйте снова.';
$ec_lang['lpn_search_http']='Служба поиска названий мест ответила с ошибкой.';
$ec_lang['lpn_search_timeout']='Служба поиска названий мест не ответила вовремя. Всё остальное на этой странице работает и без неё.';
$ec_lang['lpn_search_unreadable']='Служба поиска названий мест ответила чем-то, что эта страница не смогла прочитать.';
$ec_lang['lpn_search_offline']='Не удалось связаться со службой поиска названий мест. Возможно, вы не подключены к интернету. Всё остальное на этой странице работает и без неё, включая «Перейти к широте и долготе».';
$ec_lang['lpn_search_toofast']='Один поиск в секунду — вот что позволяет служба поиска названий мест. Попробуйте снова через мгновение.';
$ec_lang['lpn_search_nofetch']='Этот браузер не может связаться со службой поиска названий мест.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox собирает эти данные из множества открытых наборов данных о рельефе, поэтому их качество полностью зависит от того, где вы находитесь. Там, где есть национальная лидарная съёмка, например USGS 3DEP на большей части территории США и её аналоги в других странах, точность может быть лучше метра по горизонтали и нескольких десятых метра по вертикали. Там, где есть только глобальные данные, точность составляет около 30 м по горизонтали и несколько метров по вертикали. Mapbox не сообщает нам, какие из них вы получили. Относитесь к ним как к карте с горизонталями, а не как к результатам съёмки: проверяйте всё, на что вы полагаетесь.';
$ec_lang['lpn_terrain_consent_1']='Заполнение отметок отправляет положение каждого узла, которому нужна отметка, — его широту и долготу — на api.mapbox.com, чтобы узнать высоту земли в этой точке.';
$ec_lang['lpn_terrain_consent_2']='Это другой вопрос, чем изображения карты на фоне вашего проекта. Изображения сообщают только то, куда вы смотрите. Эти положения — сама ваша сеть. Mapbox получит эти координаты и ваш IP-адрес. Мы не отправляем ничего больше: ни название, ни трубы, ни проект. Мы не храним об этом никаких записей, и на этом устройстве не сохраняется ничего, кроме вашего ответа на этот вопрос.';
$ec_lang['lpn_terrain_consent_3']='Можно ли отправлять положения ваших узлов в Mapbox?';
$ec_lang['lpn_terrain_consent_4']='Если вы ответите «нет», всё остальное на этой странице будет работать точно так же, как сейчас, и вы можете вводить отметки сами, как и раньше. Ответ «да» мы запоминаем, чтобы не спрашивать снова. Ответ «нет» вообще не сохраняется.';
$ec_lang['lpn_terrain_refused']='Отметки не были заполнены, и ничего не было отправлено. Вы можете вводить их сами, как и раньше.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Заполнить отметку {n} узла(-ов) из Mapbox DEM?';
$ec_lang['lpn_terrain_confirm_default_1']='У каждого узла уже есть отметка, и у {n} из них она до сих пор равна {v} — это отметка, с которой начинается новый узел, а не та, что вы ввели сами.';
$ec_lang['lpn_terrain_confirm_default_2']='Заменить отметку этих {n} узлов значениями из Mapbox DEM?';
$ec_lang['lpn_terrain_keep']='{k} узла(-ов) уже имеют отметку и не будут изменены.';
$ec_lang['lpn_terrain_undo']='Одна отмена (Ctrl-Z) вернёт их все обратно.';
$ec_lang['lpn_terrain_requests']='{n} запрос(ов) к api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Отметки уже заполняются. Подождите.';
$ec_lang['lpn_terrain_offmap']='Эти положения узлов находятся за пределами карты рельефа, поэтому ничего не было отправлено.';
$ec_lang['lpn_terrain_too_wide']='Эти узлы разбросаны по слишком большой территории Земли, чтобы прочитать их за один раз ({n} запросов тайлов). Ничего не было отправлено.';
$ec_lang['lpn_terrain_cancelled']='Ничего не изменено и ничего не отправлено.';
$ec_lang['lpn_terrain_nofetch']='Этот браузер не может связаться со службой данных о рельефе.';
$ec_lang['lpn_terrain_working']='Считывание рельефа местности…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Служба данных о рельефе отклонила запрос ({status}), поэтому ни одна отметка не была изменена. Возможно, токен Mapbox, используемый этим сайтом, не разрешён для адреса, на котором вы сейчас находитесь.';
$ec_lang['lpn_terrain_failed']='Не удалось связаться со службой данных о рельефе, поэтому ни одна отметка не была изменена. Возможно, вы не подключены к интернету. Всё остальное на этой странице работает и без неё.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Служба данных о рельефе просит нас снизить скорость запросов (429), поэтому ни одна отметка не была изменена. Повторите через минуту.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Служба данных о рельефе ответила с ошибкой ({status}), поэтому ни одна отметка не была изменена. С вашей сетью всё в порядке.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Ни один из этих узлов не имеет положения на Земле, поэтому ничего не было отправлено и ни одна отметка не была изменена. Для считывания рельефа местности нужен проект в широте и долготе либо в проекции, которую эта страница может разместить.';
$ec_lang['lpn_terrain_done']='Заполнено {n} отметок.';
$ec_lang['lpn_terrain_missed']='{m} не удалось прочитать, и они остаются пустыми.';
$ec_lang['lpn_terrain_partial']='{f} тайл(ов) рельефа не ответили.';
$ec_lang['lpn_terrain_will_ids']='Эти узлы получат отметку: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Это следующие узлы: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Эти узлы получили отметку: {ids}';
$ec_lang['lpn_terrain_blank_ids']='У этих узлов всё ещё нет отметки: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids} и ещё {n}';

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
$ec_lang['lpn_ff_menu']='Анализ противопожарного расхода…';
$ec_lang['lpn_ff_menu_tip']='Проверяет узлы по одному: сколько каждый может отдать, всё ещё удерживая заданное вами остаточное давление, и не выводит ли забор требуемого расхода там что-то ещё за пределы допустимого?';
$ec_lang['lpn_ff_title']='Анализ противопожарного расхода';
$ec_lang['lpn_ff_intro']='У каждого узла по очереди запрашивается забор противопожарного расхода сверх уже имеющегося расхода отбора. Ваш проект при этом не меняется: весь расчёт выполняется на копии.';
$ec_lang['lpn_ff_scope']='Проверяемые узлы';
$ec_lang['lpn_ff_scope_tip']='Выберите набор узлов перед запуском. Проверка каждого узла в большой системе может занять несколько минут.';
$ec_lang['lpn_ff_all']='Все';
$ec_lang['lpn_ff_selected']='Выбранные';
$ec_lang['lpn_ff_no_junctions']='В этом проекте пока нет узлов, поэтому проверять нечего.';
$ec_lang['lpn_ff_no_selection']='Узлы не выбраны. Выберите узлы или выберите вариант «Все».';
$ec_lang['lpn_ff_skipped']='{n} выбранных элементов не являются узлами, поэтому они не были проверены.';
$ec_lang['lpn_ff_required']='Требуемый противопожарный расход';
$ec_lang['lpn_ff_required_tip']='Расход, который ваши противопожарные нормы или ваша пожарная служба требуют на гидранте. Каждый узел проверяется по этому числу, если только у него нет собственного требуемого противопожарного расхода.';
$ec_lang['lpn_ff_required_own']='Узлы с собственным требуемым противопожарным расходом проверяются по нему вместо этого. Их число: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Противопожарный расход, требуемый именно в этом узле для вида застройки, который он обслуживает, по вашим противопожарным нормам или вашей пожарной службе. Оставьте поле пустым, и узел будет проверен по числу в окне «Анализ противопожарного расхода».';
$ec_lang['lpn_ff_residual']='Удерживаемое остаточное давление';
$ec_lang['lpn_ff_residual_tip']='Давление, которое узел должен сохранять, отдавая противопожарный расход. AWWA M31 и NFPA 291 используют 20 psi (140 кПа).';
$ec_lang['lpn_ff_design']='Проверка проекта (влияние на систему)';
$ec_lang['lpn_ff_design_tip']='Отдельный вопрос от того, может ли узел отдать этот расход: при заборе этого расхода там, не падает ли что-то ещё ниже своего минимального давления и не превышает ли предел скорости? Выбор этой проверки не требует дополнительного расчёта.';
$ec_lang['lpn_ff_design_no_selection']='Проверка проекта настроена на «Выбранные», но элементы не выбраны. Выберите элементы или выберите вариант «Все».';
$ec_lang['lpn_ff_minpressure']='Наименьшее допустимое давление в остальной сети';
$ec_lang['lpn_ff_minpressure_tip']='Узел, давление в котором падает ниже этого значения, пока другой узел отдаёт свой противопожарный расход, отмечается как проблема проекта.';
$ec_lang['lpn_ff_maxvelocity']='Наибольшая допустимая скорость';
$ec_lang['lpn_ff_maxvelocity_tip']='Труба, скорость в которой превышает это значение при заборе противопожарного расхода, отмечается как проблема проекта.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Противопожарный расход забирается в самом узле. Это метод, используемый здесь, и он обычный. Гидрант, его подводящая труба и насадок не моделируются, поэтому реальный гидрант отдаёт меньше расхода, чем показано здесь.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Это вычислено встроенным расчётным ядром.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Это вычислено расчётным ядром EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='Располагаемый противопожарный расход находится поиском, поэтому вся сеть рассчитывается около шестнадцати раз для каждого проверяемого узла. Большая система может занять несколько минут. Вы можете остановить расчёт в любой момент и сохранить то, что уже вычислено.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Проверяется только шаг времени, показанный сейчас на экране. Противопожарный расход обычно проверяется сверх расхода в сутки максимального водопотребления, поэтому перед запуском приведите сеть в это состояние.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Расчёт противопожарного расхода';
$ec_lang['lpn_ff_calculate']='Запустить';
$ec_lang['lpn_ff_stop']='Остановить';
$ec_lang['lpn_ff_working']='Выполняется: {done} из {total} узлов.';
$ec_lang['lpn_ff_stopped']='Остановлено после {done} из {total} узлов. Ниже показаны результаты уже завершённых.';
$ec_lang['lpn_ff_cost']='Этот расчёт решил всю сеть {solves} раз.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Чертёж изменился, поэтому результаты противопожарного расчёта были очищены. Запустите его снова.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Очистить кольца';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} узлов не имеют проблем. {fire} узлов не прошли проверку противопожарного расхода. {design} узлов повлияли на остальную систему.';
$ec_lang['lpn_ff_summary_error']='Для {n} узлов не удалось получить ответ.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Проверены все узлы';
$ec_lang['lpn_ff_col_junction']='Узел';
$ec_lang['lpn_ff_col_static']='Статическое давление';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='Давление в этом узле до отбора какого-либо противопожарного расхода, при обычных расходах отбора системы, продолжающих действовать. Для его измерения ничего не отключается, поэтому это не давление при нулевом расходе по всей системе; это то же давление, что карта показывает в этом узле. И AWWA M31, и NFPA 291 называют это значение статическим давлением, и именно с него начинается испытание на противопожарный расход.';
$ec_lang['lpn_ff_col_available']='Располагаемый расход';
$ec_lang['lpn_ff_col_required']='Требуемый расход';
$ec_lang['lpn_ff_col_residual']='Остаточное давление';
$ec_lang['lpn_ff_col_atrequired']='Давление при требуемом расходе';
$ec_lang['lpn_ff_col_affected']='Худший эффект';
$ec_lang['lpn_ff_col_limit']='Предел проекта';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Не проверено';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Статическое давление не пройдено, поэтому не проверено';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Виды отказа';
$ec_lang['lpn_ff_mode_fire']='Пожар';
$ec_lang['lpn_ff_mode_design']='Проект';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Нет';
$ec_lang['lpn_ff_col_solves']='Расчёты';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Давление и скорость';
$ec_lang['lpn_ff_atleast']='более {flow}';
$ec_lang['lpn_ff_affect_node']='{id} падает до {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} достигает {velocity}';
$ec_lang['lpn_ff_more']='и ещё {n} затронуто';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='Ещё {n} узлов не показано.';
$ec_lang['lpn_ff_design_none']='Ничто в выбранном наборе не вышло за свои пределы, пока какой-либо узел отдавал свой противопожарный расход.';
$ec_lang['lpn_ff_design_off_note']='Влияние на остальную систему в этом расчёте не проверялось.';
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
$ec_lang['lpn_ff_iso']='Insurance Services Office (ISO) засчитывает одному гидранту не более {flow}. Этот зачётный предел здесь не применён, поскольку неизвестно, сколько гидрантов может представлять узел.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Уже ниже остаточного давления до забора какого-либо противопожарного расхода';
$ec_lang['lpn_ff_err_converge']='Сеть не сошлась.';
$ec_lang['lpn_ff_err_solve']='Расчётное ядро сообщило об ошибке и не дало ответа.';
$ec_lang['lpn_ff_err_not_junction']='Не узел';
$ec_lang['lpn_ff_err_unknown']='Нет ответа. Сообщённый код: {code}.';

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
$ec_lang['lpn_file_import_survey']='Импорт точек съёмки…';
$ec_lang['lpn_file_import_survey_tip']='Считывает список точек съёмки из текстового файла и создаёт один узел в каждой точке, используя настройки новых элементов для всего, что файл не указывает. Трубы не рисуются, и ни одна строка никогда не отбрасывается без указания причины. Использует систему координат, которую этот проект уже использует, есть у него географическая привязка или нет.';
$ec_lang['lpn_survey_read_error']='Не удалось прочитать этот файл с вашего диска.';
$ec_lang['lpn_survey_cancelled']='Ничего не создано и ничего не изменено.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Северная координата';
$ec_lang['lpn_survey_axis_east']='Восточная координата';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='В этом файле ничего нет.';
$ec_lang['lpn_survey_err_unreadable']='Этот файл не удалось прочитать как список точек съёмки.';
$ec_lang['lpn_survey_err_ambiguous_coord']='В этом файле сразу несколько столбцов могут быть значением «{axis}» ({detail}), и эта страница не будет выбирать между ними. Оставьте только один из них с именем «{axis}» и попробуйте снова.';
$ec_lang['lpn_survey_err_no_points']='Ни одна строка этого файла не была прочитана как точка съёмки. Прочитано строк: {detail}';
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
$ec_lang['lpn_survey_format_label']='Формат файла:';
$ec_lang['lpn_survey_format_internal']='определён в самом файле';
$ec_lang['lpn_survey_create']='Создать узлы';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='Первая строка пропущена: она не называет ни одного столбца, известного этой странице.';
$ec_lang['lpn_survey_type_label']='Тип элемента:';
$ec_lang['lpn_survey_confirm_junction']='Найдено узлов: {n}. Продолжить?';
$ec_lang['lpn_survey_confirm_reservoir']='Найдено резервуаров: {n}. Продолжить?';
$ec_lang['lpn_survey_confirm_tank']='Найдено баков: {n}. Продолжить?';
$ec_lang['lpn_survey_report_junction']='Импортировано узлов: {n}, с отметкой: {m}.';
$ec_lang['lpn_survey_report_reservoir']='Импортировано резервуаров: {n}, с отметкой: {m}.';
$ec_lang['lpn_survey_report_tank']='Импортировано баков: {n}, с отметкой: {m}.';
$ec_lang['lpn_survey_report_clean']='Каждая точка из файла перенесена, и ничего не было изменено при вводе.';
$ec_lang['lpn_survey_report_notes']='Ошибки и примечания импорта:';
$ec_lang['lpn_survey_sev_error']='ошибка';
$ec_lang['lpn_survey_sev_warning']='предупреждение';
$ec_lang['lpn_survey_note_line']='Строка {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Слишком мало столбцов для указанного выше формата файла.';
$ec_lang['lpn_survey_note_coord_missing']='Ячейка «{axis}» пуста.';
$ec_lang['lpn_survey_note_bad_coord']='«{axis}» не читается как число.';
$ec_lang['lpn_survey_note_coord_range']='«{axis}» выходит за пределы диапазона, допустимого для этого проекта.';
$ec_lang['lpn_survey_note_bad_elev']='Нечисловая отметка. Импортировано без отметки.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Отметкой мог быть не один столбец, поэтому ни один из них не был прочитан.';
$ec_lang['lpn_survey_note_blank_rows']='Пропущено пустых строк: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Имя уже использовано ранее в этом файле, присвоено новое имя.';
$ec_lang['lpn_survey_note_id_taken']='Имя уже используется в проекте, присвоено новое имя.';
$ec_lang['lpn_survey_note_id_invalid']='Это имя здесь использовать нельзя, присвоено новое имя.';
$ec_lang['lpn_hotkeys_menu_heading']='Меню';
$ec_lang['lpn_hotkeys_menu_term']='Горячие клавиши меню';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+буква</td><td>Откройте меню с этой буквой, затем нажмите букву строки, чтобы выбрать её. Пока вы пользуетесь клавиатурой, буквы видны на экране. На Mac используйте Ctrl+Option.</td></tr><tr><td>F10</td><td>Перейти к строке меню.</td></tr></tbody></table>';
$ec_lang['lpn_graphs_menu']='Графики';
$ec_lang['lpn_contour_menu']='Изолинии';
$ec_lang['lpn_contour_tip']='Показать на карте поле изолиний: цвета узлов растекаются вдоль труб и рядом с ними, с подписанными линиями уровня. Открывает окно для настройки или отключения.';
$ec_lang['lpn_contour_plot']='Карта изолиний';
$ec_lang['lpn_contour_fill']='Заливка';
$ec_lang['lpn_contour_fill_tip']='«Плавная» плавно переходит от цвета одного класса к другому. «Полосы» закрашивают каждый класс цветовой шкалы одним цветом.';
$ec_lang['lpn_contour_fill_smooth']='Плавная';
$ec_lang['lpn_contour_fill_bands']='Полосы';
$ec_lang['lpn_contour_opacity']='Непрозрачность заливки';
$ec_lang['lpn_contour_lines']='Изолинии';
$ec_lang['lpn_contour_interval']='Интервал';
$ec_lang['lpn_contour_buffer']='Буфер';
$ec_lang['lpn_contour_buffer_unit']='× медианная длина трубы';
$ec_lang['lpn_contour_buffer_tip']='Как далеко цвет простирается от каждой трубы, в долях медианной длины трубы. На внешней части он постепенно исчезает.';
$ec_lang['lpn_contour_few']='Слишком мало узлов для построения изолиний.';
$ec_lang['lpn_contour_support']='Карта изолиний: {n} узлов, интерполяция вдоль {p} труб и на расстояние до {k} медианных длин трубы рядом с ними. Через насосы, клапаны и закрытые связи цвет не проводится.';
$ec_lang['lpn_contour_support_lines']='Изолинии через каждые {i} {u}.';
$ec_lang['lpn_contour_too_many']='При таком интервале изолиний слишком много; увеличьте интервал, чтобы их нарисовать.';
$ec_lang['lpn_contour_dem']='Земля между узлами по Mapbox DEM';
$ec_lang['lpn_contour_dem_tip']='Между узлами давление становится интерполированным напором за вычетом высоты земли по Mapbox DEM, поэтому оно может опускаться ниже наименьшего давления в узлах на холме, где в сети нет ни одного узла. Считайте землю картой изолиний, а не съёмкой.';
$ec_lang['lpn_contour_support_dem']='Между узлами давление равно интерполированному напору за вычетом отметки земли по Mapbox DEM, взятой примерно через каждые {m} м.';
$ec_lang['lpn_contour_dem_failed']='Не удалось прочитать землю из Mapbox DEM, поэтому давление интерполируется только между узлами.';
$ec_lang['lpn_contour_consent_1']='Чтобы показать давление над землёй, на api.mapbox.com отправляется область, которую занимает ваша сеть, в виде номеров тайлов карты Mapbox, чтобы прочитать высоту земли в этом месте.';
$ec_lang['lpn_contour_consent_2']='Это другой вопрос, чем картинки карты под вашим проектом. Картинки лишь говорят, куда вы смотрите. Эти тайлы говорят, где находится ваша сеть. Mapbox получит эти номера тайлов и ваш IP-адрес. Больше мы ничего не отправляем: ни имени, ни труб, ни проекта. Мы не ведём об этом никаких записей, и на этом устройстве не сохраняется ничего, кроме вашего ответа на этот вопрос.';
$ec_lang['lpn_contour_consent_3']='Можно ли отправить в Mapbox номера тайлов области вашей сети?';
$ec_lang['lpn_contour_consent_4']='Если вы ответите «нет», всё остальное на этой странице продолжит работать так же, как сейчас, а карта изолиний будет строиться только между узлами. Ответ «да» мы запоминаем, чтобы не спрашивать снова. Ответ «нет» не сохраняется вообще.';
$ec_lang['lpn_sysflow_menu']='Баланс расхода';
$ec_lang['lpn_sysflow_tip']='Построить график общего произведённого и общего потреблённого расхода во времени за весь расчёт с продолжённым периодом. Баки не входят ни в один из итогов, поэтому там, где две линии расходятся, баки наполняются или опорожняются.';
$ec_lang['lpn_sysflow_produced']='Произведено';
$ec_lang['lpn_sysflow_produced_tip']='Общий расход, поступающий в сеть из резервуаров и от отрицательных расходов отбора.';
$ec_lang['lpn_sysflow_consumed']='Потреблено';
$ec_lang['lpn_sysflow_consumed_tip']='Сумма всех положительных расходов отбора: вода, забираемая из сети в узлах, и любой расход в резервуар.';
$ec_lang['lpn_copy_title']='Отметить файл как новую копию?';
$ec_lang['lpn_copy_body']='В этом файле указано, что он создан {date}, а этот браузер его не узнаёт. Это оригинал (оставить ту же блокировку) или копия (создать новую блокировку)?';
$ec_lang['lpn_copy_body_nodate']='Этот браузер не узнаёт этот файл. Это оригинал (оставить ту же блокировку) или копия (создать новую блокировку)?';
$ec_lang['lpn_copy_original']='Оригинал; оставить ту же блокировку';
$ec_lang['lpn_copy_copy']='Копия; создать новую блокировку';
$ec_lang['lpn_copy_kept_link']='Открыт {name} как оригинал, перемещённый на новое место. «Сохранить» теперь записывает в этот файл.';
$ec_lang['lpn_copy_opened']='Открыт {file} как копия, с собственной новой блокировкой, которая будет сохранена при следующем сохранении файла.';
$ec_lang['lpn_scenario_basic']='Базовый режим';
$ec_lang['lpn_scenario_basic_tip']='Если отмечено, сценарий — это просто заданные в нём значения. Если снято, меню предлагает ещё таблицу предварительного просмотра «Альтернативы», которая показывает, как эти значения сгруппированы по категориям, и приглашает вас оставить отзыв.';
$ec_lang['lpn_alt_title']='Предварительный просмотр альтернатив';
$ec_lang['lpn_alt_note']='Только чтение. База использует альтернативу «База» каждой категории. Каждый сценарий получает собственную альтернативу для любой изменённой категории, дочернюю по отношению к базовой. Число — это количество изменённых в ней значений.';
$ec_lang['lpn_alt_cat_physical']='Физические';
$ec_lang['lpn_alt_cat_demand']='Расход отбора';
$ec_lang['lpn_alt_cat_topology']='Включение элементов';
$ec_lang['lpn_alt_cat_initial']='Начальные настройки';
$ec_lang['lpn_alt_cat_constituent']='Компонент';
$ec_lang['lpn_alt_cat_fireflow']='Противопожарный расход';
$ec_lang['lpn_alt_cat_energy']='Стоимость энергии';
$ec_lang['lpn_alt_cat_userdata']='Пользовательские свойства';
$ec_lang['lpn_alt_cat_text']='Текст';
$ec_lang['lpn_reports_calib']='Калибровка';
$ec_lang['lpn_reports_calib_tip']='Сравнить измеренные полевые данные из файла калибровки с последним расчётом: статистика, график корреляции и сравнение средних.';
$ec_lang['lpn_calib_title']='Отчёт о калибровке';
$ec_lang['lpn_calib_param']='Параметр';
$ec_lang['lpn_calib_param_tip']='Величина, которую измеряет файл калибровки. Для каждого параметра хранится один файл.';
$ec_lang['lpn_calib_load']='Загрузить файл калибровки…';
$ec_lang['lpn_calib_load_tip']='Текстовый файл, в каждой строке которого указаны идентификатор места, время и измеренное значение. Время отсчитывается от начала расчёта в десятичных часах или в формате часы:минуты. Точка с запятой начинает комментарий. Строка только со временем и значением относится к месту выше.';
$ec_lang['lpn_calib_none']='Для этого параметра файл калибровки не загружен.';
$ec_lang['lpn_calib_session']='Файл калибровки хранится только в течение этого сеанса. Он не сохраняется ни в проекте, ни на этом устройстве.';
$ec_lang['lpn_calib_file']='{file}: {n} измерений в {m} местах.';
$ec_lang['lpn_calib_units']='Значения из файла читаются в единицах этого проекта: {unit}.';
$ec_lang['lpn_calib_missing']='Указаны в файле, но отсутствуют в этой сети: {ids}.';
$ec_lang['lpn_calib_missing_count']='Измерений пропущено, потому что их места нет в этой сети: {n}.';
$ec_lang['lpn_calib_bad_lines']='Строки, которые не удалось прочитать, пропущены: {lines}';
$ec_lang['lpn_calib_outside']='Измерений вне времён, о которых сообщил этот расчёт, пропущено: {n}.';
$ec_lang['lpn_calib_no_value']='Измерений без вычисленного значения на их момент пропущено: {n}.';
$ec_lang['lpn_calib_single']='Это расчёт на один момент, поэтому каждое измерение сравнивается с его единственным результатом, какое бы время ни указано в файле.';
$ec_lang['lpn_calib_needs_run']='Результатов для сравнения пока нет. Отчёт заполнится после расчёта сети.';
$ec_lang['lpn_calib_no_pairs']='Ни одно измерение не удалось сравнить, поэтому строить нечего.';
$ec_lang['lpn_calib_tab_stats']='Статистика';
$ec_lang['lpn_calib_tab_corr']='График корреляции';
$ec_lang['lpn_calib_tab_means']='Сравнение средних';
$ec_lang['lpn_calib_col_location']='Место';
$ec_lang['lpn_calib_col_n']='Кол-во набл.';
$ec_lang['lpn_calib_col_obs_mean']='Наблюдаемое среднее';
$ec_lang['lpn_calib_col_sim_mean']='Вычисленное среднее';
$ec_lang['lpn_calib_col_mean_err']='Средняя ошибка';
$ec_lang['lpn_calib_col_mean_err_tip']='Среднее абсолютных разностей между каждым наблюдаемым значением и вычисленным значением на тот же момент.';
$ec_lang['lpn_calib_col_rms_err']='Ср.кв. ошибка';
$ec_lang['lpn_calib_col_rms_err_tip']='Среднеквадратичная ошибка: квадратный корень из среднего квадратов разностей между наблюдаемыми и вычисленными значениями.';
$ec_lang['lpn_calib_network']='Сеть';
$ec_lang['lpn_calib_corr_means']='Корреляция между средними: {r}';
$ec_lang['lpn_calib_corr_none']='Корреляция между средними: нужны как минимум два места с различающимися средними.';
$ec_lang['lpn_calib_axis_obs']='Наблюдаемое: {q}';
$ec_lang['lpn_calib_axis_sim']='Вычисленное: {q}';
$ec_lang['lpn_calib_observed']='Наблюдаемое';
$ec_lang['lpn_calib_computed']='Вычисленное';
$ec_lang['lpn_calib_point']='{id}, {time}: наблюдаемое {o}, вычисленное {s}';
$ec_lang['lpn_calib_corr_note']='Каждая точка — одно измерение. Чем ближе точки лежат к диагональной линии, тем ближе вычисленные значения к наблюдаемым.';
$ec_lang['lpn_calib_ts_point']='Измерено в {id}, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='Кольцами показаны измеренные значения из файла калибровки.';
$ec_lang['lpn_analyze_menu']='Анализ';
$ec_lang['lpn_analyze_menu_tip']='Анализы, которые рассчитывают сеть на копии: противопожарный расход в каждом узле, потери каждой трубы, насоса и клапана, а также расходы отбора, увеличенные или уменьшенные в заданное число раз.';
$ec_lang['lpn_ff_design_off']='Нет';
$ec_lang['lpn_ff_design_all']='Все';
$ec_lang['lpn_ff_design_selected']='Выбранные';
$ec_lang['lpn_ff_rows_more_links']='Связей не показано: {n}.';
$ec_lang['lpn_crit_menu']='Анализ критичности…';
$ec_lang['lpn_crit_menu_tip']='Поочерёдно убирает из сети каждую трубу, насос и клапан и показывает, что теряет система.';
$ec_lang['lpn_crit_title']='Анализ критичности';
$ec_lang['lpn_crit_intro']='Каждый элемент по очереди убирается из сети, и сеть рассчитывается на показанный на экране шаг времени в активном сценарии. Ваш проект при этом не меняется; весь расчёт выполняется на копии.';
$ec_lang['lpn_crit_scope']='Отключаемые связи';
$ec_lang['lpn_crit_scope_tip']='Все трубы, насосы и клапаны или только выбранные на карте. Выберите набор перед запуском.';
$ec_lang['lpn_crit_scope_all']='Все связи';
$ec_lang['lpn_crit_scope_selected']='Выбранные связи';
$ec_lang['lpn_crit_minpressure']='Наименьшее допустимое давление';
$ec_lang['lpn_crit_minpressure_tip']='Это то же число, что «Наименьшее допустимое давление в остальной сети» в анализе противопожарного расхода. Изменение здесь меняет его и там.';
$ec_lang['lpn_crit_col_asset']='Элемент';
$ec_lang['lpn_crit_col_unserved']='Неудовлетворённый расход';
$ec_lang['lpn_crit_col_cutoff']='Отрезанные узлы';
$ec_lang['lpn_crit_col_below']='Узлы ниже минимума';
$ec_lang['lpn_crit_summary']='{n} из {total} элементов оставляют расход неудовлетворённым или опускают узел ниже {pressure}.';
$ec_lang['lpn_crit_baseline_below']='Узлов, уже находящихся ниже него при целой сети: {n}. Они не учитываются.';
$ec_lang['lpn_crit_working']='Выполняется: {done} из {total} элементов.';
$ec_lang['lpn_crit_stopped']='Остановлено после {done} из {total} элементов. Ниже показаны результаты уже завершённых.';
$ec_lang['lpn_crit_no_selection']='Связи не выбраны. Выберите связи или выберите вариант «Все связи».';
$ec_lang['lpn_crit_no_links']='В этом проекте пока нет связей, поэтому отключать нечего.';
$ec_lang['lpn_crit_busy']='Выполняется другой анализ. Остановите его или дождитесь завершения.';
$ec_lang['lpn_crit_skipped']='{n} выбранных элементов не являются связями, поэтому они не отключались.';
$ec_lang['lpn_crit_stale']='Чертёж изменился, поэтому результаты анализа критичности были очищены. Запустите его снова.';
$ec_lang['lpn_crit_skipdead']='Пропускать тупики';
$ec_lang['lpn_crit_skipdead_tip']='Тупиковая связь — это связь, удаление которой отрезает узлы, до которых можно добраться только через неё, без резервуара или бака за ней. Её потеря — это всё, что находится за ней, поэтому она не рассчитывается. В сводке указано, сколько связей пропущено.';
$ec_lang['lpn_crit_skipped_dead']='Тупиковых связей пропущено: {n}. Каждая отрезает всё, что находится за ней.';
