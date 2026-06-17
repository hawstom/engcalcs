<?php

// All missing text declarations will fall back to English.

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
// Orifice Flow
$ec_lang['or_main_menu']='Protok kroz otvor';
$ec_lang['or_main_title']='Besplatni online kalkulator protoka kroz otvor';
$ec_lang['or_main_desc']='Protok kroz otvor — Slobodan i potopljeni';
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
$ec_lang['or_notes_1_term']='Jednadžba otvora';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> &times; A &times; &radic;(2gh). Slobodan istjecaj: h = HWE &minus; težište. Potopljeni (TWE iznad dna): h = HWE &minus; TWE.';
$ec_lang['or_notes_2_term']='Režim otvora';
$ec_lang['or_notes_2_def']='Jednadžbe protoka kroz otvor primjenjuju se kada je uzvodni nivo iznad tjemena otvora. Kada je ispod tjemena, koristite jednadžbu preljeva.';
$ec_lang['or_notes_3_term']='Koeficijent protoka';
$ec_lang['or_notes_3_def']='C<sub>d</sub> iznosi oko 0,60&ndash;0,65 za oštrobridne otvore. Zaobljeni ili uvučeni ulazi imaju različite vrijednosti. Pogledajte <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venture-d_590.html">Engineering Toolbox</a> ili HEC-RAS Hidraulički referentni priručnik.';
$ec_lang['or_notes_4_term']='Potopljenost';
$ec_lang['or_notes_4_def']='Kada je TWE iznad dna otvora, kalkulator automatski primjenjuje jednadžbu potopljenog otvora s h = HWE &minus; TWE. Kada je TWE na razini ili ispod dna, pretpostavlja se slobodan istjecaj i h = HWE &minus; težište.';
