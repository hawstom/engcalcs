<?php

// All missing text declarations will fall back to English.

// Units (alphabetical order)
// Necessary for calculator units selectors
$ec_lang['u_depthFrac']="съотношение";
$ec_lang['u_depthPercent']="%";
$ec_lang['u_ft2']="ft^2";
$ec_lang['u_ft3ps']="cfs";
$ec_lang['u_ft']="ft";
$ec_lang['u_fth2o']="ft H2O";
$ec_lang['u_ftps']="ft/sec";
$ec_lang['u_gpm']="gpm";
$ec_lang['u_gradePercent']='% наклон';
$ec_lang['u_grade']="височина/дължина";
$ec_lang['u_in2']="sq. in.";
$ec_lang['u_inh2o']="in H2O";
$ec_lang['u_in']="in";
$ec_lang['u_knpcm2']="kN/cm^2";
$ec_lang['u_knpm2']="kN/m^2";
$ec_lang['u_kpa']="kPa";
$ec_lang['u_lps']="l/s";
$ec_lang['u_m2']="m^2";
$ec_lang['u_m3ps']="m^3/s";
$ec_lang['u_mgd']="MGD";
$ec_lang['u_mh2o']="m H2O";
$ec_lang['u_mld']="Ml/d";
$ec_lang['u_m']="m";
$ec_lang['u_mm2']="mm^2";
$ec_lang['u_mmh2o']="mm H2O";
$ec_lang['u_mm']="mm";
$ec_lang['u_mps']="m/s";
$ec_lang['u_npm2']="N/m^2";
$ec_lang['u_pa']="Pa";
$ec_lang['u_psf']="psf";
$ec_lang['u_psi']="psi";
$ec_lang['u_s']="sec";
$ec_lang['u_acft']="ac-ft";
$ec_lang['u_ft3']="ft^3";
$ec_lang['u_m3']="m^3";
$ec_lang['u_kw']='kW';
$ec_lang['u_mw']='MW';
$ec_lang['u_kwh_yr']='kWh/yr';
$ec_lang['u_mwh_yr']='MWh/yr';
$ec_lang['u_hp']='hp';

// Page text
// In page order for easiest maintenance.
$ec_lang['menu_brand']='HawsEDC Калкулатори';
$ec_lang['menu_main_list']='Списък с калкулатори'; 
$ec_lang['menu_main_hydraulics']='Хидравлика'; 
$ec_lang['menu_main_language']='Език';
$ec_lang['template_welcome']='&gt;&gt; Оставете страховете си на прага; тук любовта е нашият език. Не съсипвате всичко. Насладете се и на <a target="_blank" href="https://hawsedc.com/download.php">безплатните инструменти HawsEDC за AutoCAD.</a> &lt;&lt;';
$ec_lang['template_translation_help']='Имате ли страхотна идея за калкулатор, който да добавите тук?  Можете ли да ми помогнете с превода, програмирането или хостинга за тези калкулатори?';
$ec_lang['template_feedback']='Моля споделете мнението си под формата на предложение или похвала. Този безплатен калкулатор надмина ли всичките ви очаквания?'; 
$ec_lang['template_printable_title']='Заглавие за принтиране'; 
$ec_lang['template_printable_subtitle']='Подзаглавие за принтиране'; 
$ec_lang['index_title']='Безплатни Oнлайн Инженерни Калкулатори'; 
$ec_lang['calc_set_units']='Изберете мерни единици:';
$ec_lang['calc_inputs']='Входни данни';
$ec_lang['calc_results']='Резултати';
$ec_lang['view_hide_line']='[Скрий този ред]';
$ec_lang['view_printable']='Версия за печат (презаредете за възстановяване)';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Хидравлични загуби в тръбопровод по Дарси-Вайсбах';
$ec_lang['dw_main_title']='Безплатен онлайн калкулатор за хидравлични загуби по Дарси-Вайсбах';
$ec_lang['dw_main_desc']='Хидравлични загуби по Дарси-Вайсбах при зададени диаметър, грапавост и дебит';
$ec_lang['dw_roughness']='Абсолютна грапавост по Дарси-Вайсбах, e';
$ec_lang['dw_kinematic_viscosity']='Кинематична вискозност, v, в m<sup>2</sup>/s (1E-6 за чиста вода при стайна температура)';
$ec_lang['dw_reynolds_number']='Число на Рейнолдс, Re';
$ec_lang['dw_flow_regime']='Режим на течението';
$ec_lang['dw_regime_laminar']='ламинарен';
$ec_lang['dw_regime_transitional']='преходен';
$ec_lang['dw_regime_turbulent']='турбулентен';
$ec_lang['dw_friction_factor_method']='Метод за коефициент на триене';
$ec_lang['dw_friction_factor']='Коефициент на триене, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Хидравлични загуби в тръбопровод по Хейзен-Уилямс';
$ec_lang['hw_main_title']='Безплатен онлайн калкулатор за хидравлични загуби по Хейзен-Уилямс';
$ec_lang['hw_main_desc']='Хидравлични загуби по Хейзен-Уилямс при зададени диаметър, грапавост и дебит';
$ec_lang['hw_hgl_1']='HGL надолу по течението';
$ec_lang['hw_hgl_2']='HGL нагоре по течението';
$ec_lang['hw_roughness']='Коефициент на Хейзен-Уилямс, C';
// (duplicate assignments removed — see above)
// Manning Irregular
$ec_lang['mi_menu']='Нередовен канал по Манинг';
$ec_lang['mi_main_title']='Безплатен онлайн калкулатор за нередовен канал по Манинг';
$ec_lang['mi_main_desc']='Калкулатор за равномерно течение в нередовен канал по Манинг';
$ec_lang['mi_waterSurfaceElevation']='Кота на водната повърхност';
$ec_lang['mi_q_617']='Q';
$ec_lang['mi_xSecPoints']='Точки на напречното сечение';
$ec_lang['mi_groupPoint']='Точка';
$ec_lang['mi_groupSegment']='Сегмент';
$ec_lang['mi_groupRegion']='Регион';
$ec_lang['mi_station']='Ст.';
$ec_lang['mi_elevation']='Кота';
$ec_lang['mi_n']='n<br />за сег-<br />мент';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />граница<br />регион<br />(Бряг)';
$ec_lang['mi_tau']='Дъно<br />срязв.<br />&tau;';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='Комп.<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='H<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes']='Бележки';
$ec_lang['mi_notes_1_term']='Съставно n';
$ec_lang['mi_notes_1_def']='Калкулаторът следва наръчника HEC-RAS за изчисляване на съставното n по региони съгласно Chow 1959, стр. 136, уравнение 6-17 (а не 6-18).';
$ec_lang['mi_notes_2_term']='Каменна облицовка';
$ec_lang['mi_notes_2_def']='Използвайте калкулатора за трапецовиден канал на Манинг за проектиране на каменна облицовка. Този калкулатор е предназначен за естествени напречни сечения.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Изчисления на Тръбопроводи по Манинг'; 
$ec_lang['mpf_main_title']='Безплатен Онлайн Калкулатор за Изчлиснения на Тръбопроводи по Манинг ';  
$ec_lang['mpf_main_desc']='Формула на Манинг за Равномерно Движение в Тръбопровод при Зададени Наклон И Воден Стълб'; 
$ec_lang['mpf_pipe_diameter']='Диаметър на тръбата, d<sub>0</sub>'; 
$ec_lang['mpf_manningRoughness']='Грапавина по Манинг, n'; 
$ec_lang['mpf_friction_slope']='Хидравличен наклон (често <a target="_blank" href="../pressureslope.php">?</a> равен на наклона на тръбата), J'; 
$ec_lang['mpf_depth_ratio']='Процентно запълване (или съотношение) към пълното запълване (100% или 1 при пълно запълване)'; 
$ec_lang['mpf_flow']='Водно количество, Q'; 
$ec_lang['mpf_velocity']='Скорост, V'; 
$ec_lang['mpf_velocity_head']='Скоростен напор, h<sub>v</sub>';  
$ec_lang['mpf_flow_area']='Водна площ'; 
$ec_lang['mpf_wetted_perimeter']='Мокър периметър'; 
$ec_lang['mpf_hydraulic_radius']='Хидравличен радиус'; 
$ec_lang['mpf_top_width']='Горна ширина, T'; 
$ec_lang['mpf_froude_number']='Число на Фруд, F'; 
$ec_lang['mpf_shear_stress']='Срязващo напрежение average (теглителна сила), tau'; 
$ec_lang['mpf_solve_for_dd0']='Намерете y/d<sub>0</sub> при дадено Q';
$ec_lang['mpf_solve_desc']='Използвайки D<sub>0</sub>, n и S<sub>0</sub> от формуляра на калкулатора, намира най-ниското y/d<sub>0</sub> за даденото Q.';
$ec_lang['mpf_solve_button']='Изчисли';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Хидравлични Загуби в Напорен Тръбопровод по Манинг'; 
$ec_lang['mphl_main_title']='Безплатен Онлайн Калкулатор: Хидравлични Загуби в Напорен Тръбопровод'; 
$ec_lang['mphl_main_desc']='Формула на Манинг за Хидравлични Загуби при Зададено Водно Количество'; 
$ec_lang['mphl_pipe_length']='Дължина на Тръбата, L'; 
$ec_lang['mphl_area']='площ, A';
$ec_lang['mphl_total_junction_k']='Общ Коефициент на Местните Съпротивления, ?'; 
$ec_lang['mphl_friction_loss']='Загуби по дължина';
$ec_lang['mphl_junction_loss']='Местни загуби'; 
$ec_lang['mphl_total_loss']='Общи загуби'; 
$ec_lang['mphl_egl_1']='EGL надолу по течение';
$ec_lang['mphl_egl_2']='EGL нагоре по течение';
$ec_lang['mphl_hgl_2']='Upstream HGL in pipe (Вижте бележките)';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Изчисления на Трапецовидни Канали по Манинг'; 
$ec_lang['mtc_main_title']='Безплатен Онлайн Калкулатор за Изчисления на Трапецовидни Канали по Манинг'; 
$ec_lang['mtc_main_desc']='Формула на Манинг за Равномерно Движение в Трапецовиден Канал при Зададени Наклон и Воден Стълб'; 
$ec_lang['mtc_bottom_width']='Ширина на Дъното'; 
$ec_lang['mtc_side_slope_1']='Страничен откос 1 (хориз./верт.)'; 
$ec_lang['mtc_side_slope_2']='Страничен откос 2 (хориз./верт.)'; 
$ec_lang['mtc_channel_slope']='Наклон на канала'; 
$ec_lang['mtc_flow_depth']='Воден стълб'; 
$ec_lang['mtc_bend_angle']='Bend Angle<a href="riprap-bend-angle.png" title="Click for image">?</a> (for riprap sizing)'; //No need
$ec_lang['mtc_sgrock']='Stone specific gravity (2.65)'; //No need
$ec_lang['mtc_d50_bottom']='Required bottom angular riprap size, D50, Maricopa County <a href="javascript:alert(\'For S0 < 2% per Isbash (1936) and Maricopa County, Arizona, US. For S >= 2% per Robinson Rock Chute \')">?</a>';
$ec_lang['mtc_d50_z1']='Required side slope 1 angular riprap size, D50, Maricopa County <a href="javascript:alert(\'For S0 < 2% per Isbash (1936) and Maricopa County, Arizona, US. For S >= 2% per Robinson Rock Chute \')">?</a>';
$ec_lang['mtc_d50_z2']='Required side slope 2 angular riprap size, D50, Maricopa County <a href="javascript:alert(\'For S0 < 2% per Isbash (1936) and Maricopa County, Arizona, US. For S >= 2% per Robinson Rock Chute \')">?</a>';
$ec_lang['mtc_d50_mra']='Required angular riprap size, D50, per Maynord, Ruff, and Abt (1989)'; //No need
$ec_lang['mtc_d50_searcy']='Required angular riprap size, D50, per Searcy (1967)'; //No need
// Robinson Rock Chute
$ec_lang['rrc_main_menu']="Бързоток Robinson Rock"; 
$ec_lang['rrc_main_desc']="Оразмеряване на бързоток по Robinson Rock - таблица"; 
// Weir Flow Simple
$ec_lang['ws_main_menu']='Хидравлични изчисления за преливник'; 
$ec_lang['ws_main_title']='Калкулатор за изчисляване на преливник с широк праг'; 
$ec_lang['ws_main_desc']='Калкулатор за изчисляване на преливник с широк праг'; 
$ec_lang['ws_weirLength']='Преливна широчина, b'; 
$ec_lang['ws_headWaterHeight']='Преливна височина, h'; 
$ec_lang['ws_weirCoefficient']='Коефициент на преливника, Cw'; 
$ec_lang['ws_notes_heading']='Забележки'; 
$ec_lang['ws_notes_we_term']='Уравнение на преливника'; 
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Преливник с нередовна геометрия';
$ec_lang['wi_main_title']='Безплатен онлайн калкулатор за преливник с нередовна геометрия и променлива дълбочина';
$ec_lang['wi_main_desc']='Калкулатор за преливник с нередовна геометрия';
$ec_lang['wi_headWaterelevation']='Кота на горната вода';
$ec_lang['wi_weirPoints']='Точки на преливника';
$ec_lang['wi_station']='Станция';
$ec_lang['wi_elevation']='Кота';
$ec_lang['wi_pondingHeight']='Дълбочина на подпор';
$ec_lang['wi_incrementalFlow']='Частичен дебит';
$ec_lang['wi_cumulativeFlow']='Натрупан дебит';
$ec_lang['wi_save_and_calculate']='Запази и изчисли';
$ec_lang['wi_notes_we_term']='Уравнение на преливника';
$ec_lang['wi_notes_we_def']='q = ако (дължина = 0) тогава 0 иначе ако (наклон=0) тогава cw*дължина*d<sub>0</sub><sup>1,5</sup> иначе cw/(2,5*наклон) * (d<sub>0</sub><sup>2,5</sup> - d<sub>1</sub><sup>2,5</sup>) където d<sub>1</sub> и d<sub>0</sub> са винаги положителни или нула';
// Orifice Flow
$ec_lang['or_main_menu']='Дебит през отвор';
$ec_lang['or_main_title']='Безплатен онлайн калкулатор за дебит през отвор';
$ec_lang['or_main_desc']='Дебит през отвор — Свободно или потопено изтичане';
$ec_lang['or_shape']='Форма на отвора';
$ec_lang['or_shape_circular']='Кръгъл';
$ec_lang['or_shape_rectangular']='Правоъгълен';
$ec_lang['or_diameter']='Диаметър (кръгъл) или височина (правоъгълен), D';
$ec_lang['or_width']='Ширина, W (само за правоъгълен)';
$ec_lang['or_invert']='Кота на дъното на отвора';
$ec_lang['or_hwe']='Кота на горната вода';
$ec_lang['or_twe']='Кота на долната вода';
$ec_lang['or_cd']='Коефициент на дебит, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Кота на центроида';
$ec_lang['or_head']='Ефективен напор, h';
$ec_lang['or_area']='Площ на отвора, A';
$ec_lang['or_flow']='Дебит, Q';
$ec_lang['or_regime']='Проверка на режима на изтичане';
$ec_lang['or_regime_valid']='Свободно изтичане — режим на отвор ✓';
$ec_lang['or_regime_submerged']='Потопен отвор (TWE над дъното) — валидно ✓';
$ec_lang['or_regime_warn']='Предупреждение: горната вода е под горния ръб — не е режим на отвор';
$ec_lang['or_regime_twe_above_hwe']='Предупреждение: нивото надолу по течение (TWE) е над нивото нагоре по течение (HWE) — проверете входните данни';
$ec_lang['or_notes_1_term']='Уравнение за отвор';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> &times; A &times; &radic;(2gh). При свободно изтичане: h = HWE &minus; центроид. При потопено (TWE над дъното): h = HWE &minus; TWE.';
$ec_lang['or_notes_2_term']='Режим на отвор';
$ec_lang['or_notes_2_def']='Уравнението за отвор е приложимо, когато горната вода е над горния ръб на отвора. При по-ниска горна вода използвайте уравнение за преливник.';
$ec_lang['or_notes_3_term']='Коефициент на дебит';
$ec_lang['or_notes_3_def']='C<sub>d</sub> е приблизително 0,60&ndash;0,65 за остри ръбове. Закръглени или вдлъбнати входове имат различни стойности. Вижте <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venture-d_590.html">Engineering Toolbox</a> или Хидравличния справочник на HEC-RAS.';
$ec_lang['or_notes_4_term']='Потопяване';
$ec_lang['or_notes_4_def']='Когато TWE е над дъното на отвора, калкулаторът автоматично прилага уравнението за потопен отвор с h = HWE &minus; TWE. Когато TWE е на или под дъното, се приема свободно изтичане и h = HWE &minus; центроид.';
// Orifice Drain Time
$ec_lang['odt_main_menu']='Време за изпразване на отвор';
$ec_lang['odt_main_title']='Безплатен онлайн калкулатор за времето за изпразване на отвор — Езерце, басейн или резервоар';
$ec_lang['odt_main_desc']='Време за изпразване на езерце или басейн през отвор &mdash; Метод на коничния обем';
$ec_lang['odt_h1_elev']='Начална кота на водната повърхност';
$ec_lang['odt_a1']='Начална площ на езерцето или басейна, A1';
$ec_lang['odt_h2_elev']='Крайна кота на водната повърхност';
$ec_lang['odt_h_orifice']='Кота на центроида на отвора';
$ec_lang['odt_a0']='Площ на езерцето или басейна при кота на отвора, A0';
$ec_lang['odt_a_ending']='Крайна площ на езерцето, A2 (интерполирана)';
$ec_lang['odt_h2_check']='Проверка на крайната кота';
$ec_lang['odt_h2_ok']='Крайната кота е над горния ръб на отвора ✓';
$ec_lang['odt_h2_warn']='Предупреждение: крайната кота е на или под горния ръб на отвора (центроид + D/2)';
$ec_lang['odt_d']='Диаметър на отвора (кръгъл) или височина (правоъгълен), D';
$ec_lang['odt_w']='Ширина на отвора, W (само за правоъгълен)';
$ec_lang['odt_t_sec']='Време за изпразване (секунди)';
$ec_lang['odt_t_min']='Време за изпразване (минути)';
$ec_lang['odt_t_hr']='Време за изпразване (часове)';
$ec_lang['odt_t_day']='Време за изпразване (дни)';
$ec_lang['odt_notes_1_term']='Формула';
$ec_lang['odt_notes_1_def']='t = &radic;H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> &radic;(2g)) &times; (2A<sub>x</sub>/5 + 8&radic;(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) дава времето за изпразване от напор H до отвора. Времето за изпразване = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) &minus; t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), където H<sub>1</sub> = начална кота &minus; кота на отвора, H<sub>2</sub> = крайна кота &minus; кота на отвора.';
$ec_lang['odt_notes_2_term']='Метод';
$ec_lang['odt_notes_2_def']='Методът на коничния обем моделира езерцето или басейна като конично сечение между началната площ A<sub>1</sub> при началната водна повърхност и площта A<sub>0</sub> при кота на центроида на отвора. A<sub>2</sub>, площта на езерцето при крайната кота, се интерполира от A<sub>1</sub> и A<sub>0</sub> по модела на коничното сечение. Времето за изпразване от началната до крайната кота е равно на общото време за изпразване от H<sub>1</sub> до отвора минус оставащото времe за изпразване от H<sub>2</sub> до отвора.';
$ec_lang['odt_h1']='Начален напор, H<sub>1</sub> (WSE &minus; центроид)';
$ec_lang['odt_q_max']='Максимален (начален) дебит, Q<sub>max</sub>';
$ec_lang['odt_vol']='Изпразнен обем';
$ec_lang['odt_sketch_start']='Начало';
$ec_lang['odt_sketch_end']='Край';
// Contact us.

// Irrigation
$ec_lang['irr_main_menu']='Измерване на напоителен дебит';
$ec_lang['irr_main_title']='Безплатни онлайн калкулатори за измерване на напоителен дебит';
$ec_lang['irr_main_desc']='Измерване на напоителен дебит — прагове и отвори';
$ec_lang['contact_title']="Контакт с HawsEDC"; 
$ec_lang['contactSendMessage']='Изпратете съобщение на Tom Haws'; 
$ec_lang['contactYourName']='Вашето име:'; 
$ec_lang['contactYourEmail']='Вашият e-mail адрес:'; 
$ec_lang['contactSubject']='Относно:'; 
$ec_lang['contact_message']='Съобщение:'; 
$ec_lang['contactSpamPrefix']='Пет плюс едно е равно на';
$ec_lang['contactSpamPostfix']="(Моля, изпишете с думи. 1=едно 2=две 3=три 4=четири 5=пет 6=шест 7=седем +=плюс 5+1=6)";
$ec_lang['contactSubmitButton']='Изпратете съобщението'; 
// Erosion Setback and Scour Calc.
$ec_lang['essc_btbw']='Ширина от бряг до бряг';
$ec_lang['essc_mcr']='Минимален радиус на кривина';
$ec_lang['essc_q']='Дебит, Q';
// Manning Irregular — additional keys
$ec_lang['mi_d50in']='Облицовка<br />медиен<br />размер<br />камъни';
// Manning Pipe Flow — additional keys
$ec_lang['mpf_area_ratio']='Относителна площ, a/a0';
$ec_lang['mpf_full_flow']='Пълен дебит, Q0';
$ec_lang['mpf_full_flow_ratio']='Съотношение към пълен дебит, Q/Q0';
$ec_lang['mpf_note_1']='<dl><dt>Това е дебитът и дълбочината в <em>безкрайно дълга</em> тръба.</dt><dd>За вкарването на потока в тръбата може да е необходима значително по-голяма дълбочина на горната вода. Добавете поне 1,5 пъти скоростния напор за да получите дълбочината на горната вода или <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">вижте моя 2-минутен урок</a> за стандартни изчисления на горна вода за водостоци с HY-8.</dd>';
$ec_lang['mpf_pipe_area']='Площ на тръбата, a0';
$ec_lang['mpf_see_notes']='(Вижте бележките)';
$ec_lang['mpf_spreadheet_notice']='Вижте таблицата на Excel за тази версия на калкулатора';
// Manning Pipe Head Loss — additional keys
$ec_lang['mphl_friction_slope']='Хидравличен наклон';
$ec_lang['mphl_note_1']='<dl><dt>При отворен вход (водосток) е необходима проверка за контрол при входа.</dt><dd>1. HGL нагоре по течението не може да бъде по-ниско от котата на нормалното течение нагоре по течението (или по-ниско от тръбата!).</dd><dd>2. Горната вода на водосток се представя по-добре от EGL нагоре по течението, отколкото от HGL нагоре по течението.</dd><dd>3. Вижте <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">моя 2-минутен урок</a> за прости стандартни изчисления на горна вода за водостоци с HY-8.</dd>';
// Manning Trapezoid — additional keys
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett срещу Bathurst';
$ec_lang['mtc_d50_in']='Проектен размер на камъните, D50';
$ec_lang['mtc_n_bathurst']='n за проектния размер на камъните по Bathurst';
$ec_lang['mtc_n_blodgett']='n за проектния размер на камъните по Blodgett';
$ec_lang['mtc_n_strickler']='n за проектния размер на камъните по Strickler';
$ec_lang['mtc_note_1']='<dl><dt>Автоматична итерация за проектиране на размера и грапавината на каменната облицовка</dt><dd>Изберете радио бутон за грапавина (препоръчва се BB) и радио бутон за проектен размер на камъните (препоръчва се Isbash). Настройте дълбочината и коефициента на безопасност за размера на камъните, за да получите желания дебит с равен размер на камъните. При всяка промяна на входна стойност се изпълнява следният итерационен цикъл: 1. Грапавината се изчислява от проектния размер на камъните. 2. Избраното изчисление на грапавината се копира в входната грапавина. 3. Дебитът в канала и необходимият размер на камъните се изчисляват. 4. Проектният размер на камъните се коригира. 5. Повтаря се до много малка грешка в проектния размер.</dd><dt>Основен калкулатор (без итерация)</dt><dd>Въведете желаната стойност на грапавината. Игнорирайте полето за проектен размер на камъните.</dd></dl>';
// Orifice Flow — additional key
$ec_lang['or_velocity']='Скорост при отвора, v';
// Points data keys
$ec_lang['points_data_copy']='Копирай';
$ec_lang['points_data_help']='(или Копиране/Поставяне чрез областта с данни)';
$ec_lang['points_data_paste']='Постави';
$ec_lang['points_data_title']='Данни за точки<br />(разделени със запетая или табулация)';

// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Микро-ВЕЦ';
$ec_lang['mhp_main_title']='Безплатен онлайн калкулатор за мощност на микро-ВЕЦ';
$ec_lang['mhp_main_desc']='Калкулатор за изходна мощност на микро-ВЕЦ с деривационна схема';
$ec_lang['mhp_flow']='Дебит, Q';
$ec_lang['mhp_gross_head']='Брутен напор (разлика в нивата), H<sub>gross</sub>';
$ec_lang['mhp_head_loss']='Загуби на напор в напорния тръбопровод, h<sub>L</sub>';
$ec_lang['mhp_efficiency']='Ефективност на централата, &eta; (0&ndash;1)';
$ec_lang['mhp_net_head']='Нетен напор, H<sub>net</sub>';
$ec_lang['mhp_power']='Изходна мощност, P';
$ec_lang['mhp_annual_kwh']='Годишна енергия при 100% капацитет';
$ec_lang['mhp_notes_1_term']='Уравнение за мощност';
$ec_lang['mhp_notes_1_def']='P = &eta; &times; &rho; &times; g &times; Q &times; H<sub>net</sub>, където &rho; = 1000 kg/m&sup3; (прясна вода) и g = 9,806 m/s&sup2;.';
$ec_lang['mhp_notes_2_term']='Нетен напор';
$ec_lang['mhp_notes_2_def']='Нетен напор = брутен напор &minus; загуби на напор в напорния тръбопровод. Честа първоначална оценка е h<sub>L</sub> &asymp; 5% от H<sub>gross</sub>. Използвайте <a href="Darcy-Weisbach.php">калкулатора Darcy-Weisbach</a> за по-точни оценки на загубите в тръбопровода.';
$ec_lang['mhp_notes_3_term']='Ефективност';
$ec_lang['mhp_notes_3_def']='Типичната ефективност на централата &eta; варира от 0,70 до 0,85 за турбини тип Пелтон и напречнопоточни турбини, характерни за микро-ВЕЦ. Използвайте 0,75 като консервативна първоначална оценка.';
$ec_lang['mhp_notes_4_term']='Годишна енергия';
$ec_lang['mhp_notes_4_def']='Годишната енергия се изчислява при условие за непрекъсната работа с пълен дебит (8760 часа/год). Действителното производство ще бъде по-ниско поради сезонни колебания на дебита, престои за поддръжка и коефициент на натоварване.';
// Penstock Design
$ec_lang['ps_main_menu']='Проектиране на напорен тръбопровод';
$ec_lang['ps_main_title']='Безплатен онлайн калкулатор за напорен тръбопровод';
$ec_lang['ps_main_desc']='Оразмеряване на напорен тръбопровод за микрохидро — загуба на напор, мощност и скорост';
$ec_lang['ps_flow']='Дебит, Q';
$ec_lang['ps_gross_head']='Брутен напор, H<sub>gross</sub>';
$ec_lang['ps_diameter']='Диаметър на тръбопровода, D';
$ec_lang['ps_length']='Дължина на тръбопровода, L';
$ec_lang['ps_roughness']='Грапавост на тръбата, e';
$ec_lang['ps_km']='Коефициент на местни загуби, k<sub>m</sub>';
$ec_lang['ps_nu']='Кинематичен вискозитет, &nu;, в м<sup>2</sup>/с (1E-6 за вода при 20&deg;C)';
$ec_lang['ps_efficiency']='КПД на централата, &eta; (0&ndash;1)';
$ec_lang['ps_velocity']='Скорост на потока, v';
$ec_lang['ps_vel_check']='Проверка на скоростта';
$ec_lang['ps_f']='Коефициент на триене, f';
$ec_lang['ps_hf']='Загуба на напор от триене, h<sub>f</sub>';
$ec_lang['ps_hm']='Местни загуби на напор, h<sub>m</sub>';
$ec_lang['ps_hl']='Обща загуба в тръбопровода, h<sub>L</sub>';
$ec_lang['ps_hl_check']='Проверка на загубата на напор';
$ec_lang['ps_hnet']='Нетен напор, H<sub>net</sub>';
$ec_lang['ps_power']='Изходна мощност, P';
$ec_lang['ps_annual_kwh']='Годишна енергия при 100% натоварване';
$ec_lang['ps_vel_ok']='1–3 м/с — в целевия диапазон ✓';
$ec_lang['ps_vel_low']='под 1 м/с — увеличете диаметъра ⚠';
$ec_lang['ps_vel_high']='над 3 м/с — намалете диаметъра ⚠';
$ec_lang['ps_hl_ok']='в рамките на целевите 10% ✓';
$ec_lang['ps_hl_warn']='надвишава целевите 10% — помислете за по-голяма тръба ⚠';
$ec_lang['ps_hl_bad']='надвишава 20% — преоразмерете тръбата';
$ec_lang['ps_notes_1_term']='Загуба на напор';
$ec_lang['ps_notes_1_def']='Обща загуба h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, където h<sub>f</sub> = f(L/D)(v&sup2;/2g) е загубата от триене по Дарси-Вайсбах, а h<sub>m</sub> = k<sub>m</sub>&middot;v&sup2;/2g включва вход, колена и спирателни органи. Нетен напор H<sub>net</sub> = H<sub>gross</sub> &minus; h<sub>L</sub>.';
$ec_lang['ps_notes_2_term']='Скорост';
$ec_lang['ps_notes_2_def']='Целева скорост 1&ndash;3 м/с. Под 1 м/с тръбата е свръхоразмерена; над 3 м/с нарастват загубите от триене и рискът от хидравличен удар.';
$ec_lang['ps_notes_3_term']='Целева загуба на напор';
$ec_lang['ps_notes_3_def']='Загуба под 10% от брутния напор е икономически оправдана. Оптималният компромис между цената на тръбата и изгубената мощност обикновено е около 4&ndash;6% за обекти с висока стойност на електроенергията.';
$ec_lang['ps_notes_4_term']='Местни загуби k<sub>m</sub>';
$ec_lang['ps_notes_4_def']='Типични стойности: остър вход 0.5, всяко коляно 45&deg; между 0.2&ndash;0.3, спирателен кран (напълно отворен) 0.1, пеперудна клапа 0.2. Сумирайте всички фитинги за общ k<sub>m</sub>. Стойността по подразбиране 1.5 приема един вход и две колена.';
$ec_lang['ps_notes_5_term']='Грапавост на тръбата e';
$ec_lang['ps_notes_5_def']='Типична абсолютна грапавост: стомана (нова) 0.046&nbsp;мм, стомана (стара) 0.15&nbsp;мм, HDPE 0.003&nbsp;мм, PVC/uPVC 0.0015&nbsp;мм, бетон 0.3&ndash;3&nbsp;мм. HDPE е широко разпространен за малки микрохидро тръбопроводи.';

// About
$ec_lang['about_main_menu']='За';
$ec_lang['about_main_title']='За инженерните калкулатори HawsEDC';
$ec_lang['about_main_desc']='Мисия, отворен код и принос';

// Drip / Sprinkler Application Rate
$ec_lang['u_lph']="L/hr";
$ec_lang['u_gph']="gal/hr";
$ec_lang['u_mmph']="mm/hr";
$ec_lang['u_inph']="in/hr";
$ec_lang['ds_main_menu']='Drip/Sprinkler Application Rate';
$ec_lang['ds_main_title']='Free Online Drip/Sprinkler Irrigation Application Rate Calculator';
$ec_lang['ds_main_desc']='Drip &amp; Sprinkler Irrigation &mdash; Application Rate and Uniformity';
$ec_lang['ds_q_avg']='Average emitter flow rate, q';
$ec_lang['ds_q_min']='Minimum emitter flow rate, q<sub>min</sub>';
$ec_lang['ds_se']='Emitter spacing along lateral, S<sub>e</sub>';
$ec_lang['ds_sl']='Lateral spacing (row spacing), S<sub>l</sub>';
$ec_lang['ds_n_e']='Emitters per lateral, n<sub>e</sub>';
$ec_lang['ds_n_l']='Laterals per zone, n<sub>l</sub>';
$ec_lang['ds_d']='Target application depth, d';
$ec_lang['ds_a_e']='Area per emitter, A<sub>e</sub>';
$ec_lang['ds_pr']='Application rate (precipitation rate), PR';
$ec_lang['ds_du']='Distribution uniformity, DU';
$ec_lang['ds_du_check']='DU quality check';
$ec_lang['ds_q_lat']='Flow per lateral, Q<sub>lat</sub>';
$ec_lang['ds_q_sys']='Zone flow, Q<sub>zone</sub>';
$ec_lang['ds_t_run']='Runtime for target depth (hours)';
$ec_lang['ds_du_excellent']='Excellent &mdash; DU &ge; 90% ✓';
$ec_lang['ds_du_good']='Good &mdash; DU &ge; 80% ✓';
$ec_lang['ds_du_acceptable']='Acceptable &mdash; DU &ge; 70%';
$ec_lang['ds_du_poor']='Poor &mdash; DU &lt; 70% &mdash; review design ⚠';
$ec_lang['ds_notes_1_term']='Application Rate';
$ec_lang['ds_notes_1_def']='PR = q / A<sub>e</sub>, where A<sub>e</sub> = S<sub>e</sub> &times; S<sub>l</sub> is the area served by each emitter. A lower application rate gives more time for infiltration &mdash; important on heavy soils or sloped fields.';
$ec_lang['ds_notes_2_term']='Distribution Uniformity (DU)';
$ec_lang['ds_notes_2_def']='DU = q<sub>min</sub> / q<sub>avg</sub>. A DU of 1.0 (100%) means all emitters flow identically. Values below 0.80 waste water on well-watered areas while leaving drier spots. Uniformity drops with excessive pressure variation along the lateral, emitter wear, or partial clogging.';
$ec_lang['ds_notes_3_term']='Runtime';
$ec_lang['ds_notes_3_def']='Runtime = target depth &divide; application rate. On sloping or compacted soil, split the runtime into two or three shorter cycles with rest periods between them to avoid surface runoff.';
