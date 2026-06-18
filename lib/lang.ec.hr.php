<?php

// All missing text declarations will fall back to English.

$ec_lang['u_acft']="ac-ft";
$ec_lang['u_ft3']="ft^3";
$ec_lang['u_m3']="m^3";

// Page text
// In page order for easiest maintenance.
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning Pipe Flow';
$ec_lang['mpf_main_title']='Free Online Manning Pipe Flow Calculator';
$ec_lang['mpf_main_desc']='Manning Formula Uniform Pipe Flow at Given Slope and Depth';
$ec_lang['mpf_pipe_diameter']='Promjer cijevi, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Manningov koeficijent hrapavosti, n';
$ec_lang['mpf_friction_slope']='Linijski gubitak pritiska (moguće <a target="_blank" href="../pressureslope.php">?</a> jednak nagibu cijevi), S<sub>0</sub>';
$ec_lang['mpf_depth_ratio']='Udio ispunjenosti cijevi (u % visine promjera)';
$ec_lang['mpf_flow']='Protok, q';
$ec_lang['mpf_velocity']='Tečenja, v';
$ec_lang['mpf_velocity_head']='Energija tečenja, h<sub>v</sub>';
$ec_lang['mpf_flow_area']='Površina presjeka';
$ec_lang['mpf_wetted_perimeter']='Omočeni opseg, O';
$ec_lang['mpf_hydraulic_radius']='Hidraulički radijus, R';
$ec_lang['mpf_top_width']='Najveća širina, T';
$ec_lang['mpf_froude_number']='Froudeov broj, F';
$ec_lang['mpf_shear_stress']='Posmično naprezanje average (vučna sila), tau';
$ec_lang['mpf_solve_for_dd0']='Solve for y/d<sub>0</sub> given Q';
$ec_lang['mpf_solve_desc']='Using D<sub>0</sub>, n, and S<sub>0</sub> from the calculator form, finds the lowest y/d<sub>0</sub> for a given Q.';
$ec_lang['mpf_solve_button']='Solve';
// Orifice Flow
$ec_lang['or_main_menu']='Protok kroz otvor';
$ec_lang['or_main_title']='Besplatni online kalkulator protoka kroz otvor';
$ec_lang['or_main_desc']='Protok kroz otvor — Slobodan ili potopljeni';
$ec_lang['or_shape']='Oblik otvora';
$ec_lang['or_shape_circular']='Kružni';
$ec_lang['or_shape_rectangular']='Pravokutni';
$ec_lang['or_diameter']='Promjer (kružni) ili visina (pravokutni), D';
$ec_lang['or_width']='Širina, W (samo pravokutni)';
$ec_lang['or_invert']='Kota dna otvora';
$ec_lang['or_hwe']='Kota uzvodne razine vode';
$ec_lang['or_twe']='Kota nizvodne razine vode';
$ec_lang['or_cd']='Koeficijent protoka, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Kota težišta';
$ec_lang['or_head']='Efektivna visina, h';
$ec_lang['or_area']='Površina otvora, A';
$ec_lang['or_flow']='Protok, Q';
$ec_lang['or_regime']='Provjera režima otvora';
$ec_lang['or_regime_valid']='Slobodni istjecaj — režim otvora valjan ✓';
$ec_lang['or_regime_submerged']='Potopljeni otvor (TWE iznad dna) — valjano ✓';
$ec_lang['or_regime_warn']='Upozorenje: uzvodni nivo ispod tjemena — nije režim otvora';
$ec_lang['or_regime_twe_above_hwe']='Warning: tailwater (TWE) above headwater (HWE) — check inputs';
$ec_lang['or_notes_1_term']='Jednadžba otvora';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> &times; A &times; &radic;(2gh). Slobodan istjecaj: h = HWE &minus; težište. Potopljeni (TWE iznad dna): h = HWE &minus; TWE.';
$ec_lang['or_notes_2_term']='Režim otvora';
$ec_lang['or_notes_2_def']='Jednadžbe protoka kroz otvor primjenjuju se kada je uzvodni nivo iznad tjemena otvora. Kada je ispod tjemena, koristite jednadžbu preljeva.';
$ec_lang['or_notes_3_term']='Koeficijent protoka';
$ec_lang['or_notes_3_def']='C<sub>d</sub> iznosi oko 0,60&ndash;0,65 za oštrobridne otvore. Zaobljeni ili uvučeni ulazi imaju različite vrijednosti. Pogledajte <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venture-d_590.html">Engineering Toolbox</a> ili HEC-RAS Hidraulički referentni priručnik.';
$ec_lang['or_notes_4_term']='Potopljenost';
$ec_lang['or_notes_4_def']='Kada je TWE iznad dna otvora, kalkulator automatski primjenjuje jednadžbu potopljenog otvora s h = HWE &minus; TWE. Kada je TWE na razini ili ispod dna, pretpostavlja se slobodan istjecaj i h = HWE &minus; težište.';

// Orifice Drain Time
$ec_lang['odt_main_menu']="Orifice Drain Time";
$ec_lang['odt_main_title']="Free Online Orifice Drain Time Calculator";
$ec_lang['odt_main_desc']="Pond Orifice Drain Time &mdash; Conic Volume Method";
$ec_lang['odt_h1_elev']="Starting water surface elevation";
$ec_lang['odt_a1']="Starting pond area, A1";
$ec_lang['odt_h2_elev']="Ending water surface elevation";
$ec_lang['odt_h_orifice']='Orifice centroid elevation';
$ec_lang['odt_a0']='Pond area at orifice elevation, A0';
$ec_lang['odt_a_ending']='Ending pond area, A2 (interpolated)';
$ec_lang['odt_h2_check']='Ending elevation check';
$ec_lang['odt_h2_ok']='Ending elevation above orifice top ✓';
$ec_lang['odt_h2_warn']='Warning: ending elevation at or below orifice top (centroid + D/2)';
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
$ec_lang['odt_h1']='Starting head, H<sub>1</sub> (WSE &minus; centroid)';
$ec_lang['odt_q_max']='Max (starting) flow, Q<sub>max</sub>';
$ec_lang['odt_vol']='Drained volume';
