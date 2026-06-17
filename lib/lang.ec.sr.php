<?php

// All missing text declarations will fall back to English.


// Page text
// Note: In the process of rearranging the language variables into page order for easier maintenance.
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning Pipe Flow';
$ec_lang['mpf_main_title']='Free Online Manning Pipe Flow Calculator';
$ec_lang['mpf_main_desc']='Manning Formula Uniform Pipe Flow at Given Slope and Depth';
$ec_lang['mpf_pipe_diameter']='Prečnik cevi, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Manningov koeficijent hrapavosti, n';
$ec_lang['mpf_friction_slope']='Linijski gubitak pritiska (moguće <a target="_blank" href="../pressureslope.php">?</a> jednak nagibu cijevi), S<sub>0</sub>';
$ec_lang['mpf_depth_ratio']='Udeo ispunjenosti cevi (u % visine prečnika)';
$ec_lang['mpf_flow']='Protoka, q';
$ec_lang['mpf_velocity']='Tečenja, v';
$ec_lang['mpf_velocity_head']='Energija tečenja, h<sub>v</sub>';
$ec_lang['mpf_flow_area']='Površina preseka';
$ec_lang['mpf_wetted_perimeter']='Okvašeni obim, O';
$ec_lang['mpf_hydraulic_radius']='Hidraulički radijus, R';
$ec_lang['mpf_top_width']='Najveća širina, T';
$ec_lang['mpf_froude_number']='Frudov broj, F';
$ec_lang['mpf_shear_stress']='Napon smicanja average (vučna sila), tau';
// Orifice Flow
$ec_lang['or_main_menu']='Протицај кроз отвор';
$ec_lang['or_main_title']='Бесплатни онлајн калкулатор протицаја кроз отвор';
$ec_lang['or_main_desc']='Протицај кроз отвор — Слободан и потопљен';
$ec_lang['or_shape']='Облик отвора';
$ec_lang['or_shape_circular']='Кружни';
$ec_lang['or_shape_rectangular']='Правоугаони';
$ec_lang['or_diameter']='Пречник (кружни) или висина (правоугаони), D';
$ec_lang['or_width']='Ширина, W (само правоугаони)';
$ec_lang['or_invert']='Кота дна отвора';
$ec_lang['or_hwe']='Кота узводног нивоа воде';
$ec_lang['or_twe']='Кота низводног нивоа воде';
$ec_lang['or_cd']='Коефицијент протицаја, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Кота тежишта';
$ec_lang['or_head']='Ефективна висина, h';
$ec_lang['or_area']='Површина отвора, A';
$ec_lang['or_flow']='Протицај, Q';
$ec_lang['or_regime']='Провера режима отвора';
$ec_lang['or_regime_valid']='Слободно истицање — режим отвора валидан ✓';
$ec_lang['or_regime_submerged']='Потопљен отвор (TWE изнад дна) — валидно ✓';
$ec_lang['or_regime_warn']='Упозорење: узводни ниво испод темена — није режим отвора';
$ec_lang['or_regime_twe_above_hwe']='Warning: tailwater (TWE) above headwater (HWE) — check inputs';
$ec_lang['or_notes_1_term']='Једначина отвора';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> &times; A &times; &radic;(2gh). Слободно истицање: h = HWE &minus; тежиште. Потопљени (TWE изнад дна): h = HWE &minus; TWE.';
$ec_lang['or_notes_2_term']='Режим отвора';
$ec_lang['or_notes_2_def']='Једначине протицаја кроз отвор примењују се када је узводни ниво изнад темена отвора. Када је испод темена, користите једначину прелива.';
$ec_lang['or_notes_3_term']='Коефицијент протицаја';
$ec_lang['or_notes_3_def']='C<sub>d</sub> је приближно 0,60&ndash;0,65 за оштроивичне отворе. Заобљени или увучени улази имају различите вредности. Погледајте <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venture-d_590.html">Engineering Toolbox</a> или HEC-RAS Хидраулички приручник.';
$ec_lang['or_notes_4_term']='Потапање';
$ec_lang['or_notes_4_def']='Када је TWE изнад дна отвора, калкулатор аутоматски примењује једначину потопљеног отвора са h = HWE &minus; TWE. Када је TWE на нивоу или испод дна, претпоставља се слободно истицање и h = HWE &minus; тежиште.';

// Orifice Drain Time
$ec_lang['odt_main_menu']="Orifice Drain Time";
$ec_lang['odt_main_title']="Free Online Orifice Drain Time Calculator";
$ec_lang['odt_main_desc']="Pond Orifice Drain Time &mdash; Conic Volume Method";
$ec_lang['odt_h1_elev']="Starting water surface elevation";
$ec_lang['odt_a1']="Full pond area, A1";
$ec_lang['odt_h2_elev']="Ending water surface elevation";
$ec_lang['odt_h_orifice']='Orifice centroid elevation';
$ec_lang['odt_a0']='Pond area at orifice elevation, A0';
$ec_lang['odt_a_ending']='Ending pond area, A2 (interpolated)';
$ec_lang['odt_d']="Orifice diameter (circular) or height (rectangular), D";
$ec_lang['odt_w']="Orifice width, W (rectangular only)";
$ec_lang['odt_t_sec']="Drain time (seconds)";
$ec_lang['odt_t_min']="Drain time (minutes)";
$ec_lang['odt_t_hr']="Drain time (hours)";
$ec_lang['odt_t_day']="Drain time (days)";
$ec_lang['odt_notes_1_term']="Formula";
$ec_lang['odt_notes_1_def']='t = &radic;H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> &radic;(2g)) &times; (2A<sub>x</sub>/5 + 8&radic;(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) gives drain time from head H to the orifice. Drain time = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) &minus; t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), where H<sub>1</sub> = starting elevation &minus; orifice elevation, H<sub>2</sub> = ending elevation &minus; orifice elevation.';
$ec_lang['odt_notes_2_term']="Method";
$ec_lang['odt_notes_2_def']='The conic volume method models the pond as a conic section between the starting area A<sub>1</sub> at the initial water surface and the area A<sub>0</sub> at the orifice centroid elevation. A<sub>2</sub>, the pond area at the ending elevation, is interpolated from A<sub>1</sub> and A<sub>0</sub> using the conic section model. Drain time from starting to ending elevation equals total drain time from H<sub>1</sub> to orifice minus remaining drain time from H<sub>2</sub> to orifice.';
