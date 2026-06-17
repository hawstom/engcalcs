<?php

// All missing text declarations will fall back to English.

// Page text
// In page order for easiest maintenance.
$ec_lang['calc_set_units']='Alege unitate masură:';
$ec_lang['calc_results']='Rezultate';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning Pipe Flow';
$ec_lang['mpf_main_title']='Free Online Manning Pipe Flow Calculator';
$ec_lang['mpf_main_desc']='Manning Formula Uniform Pipe Flow at Given Slope and Depth';
$ec_lang['mpf_pipe_diameter']='Diametru conductă';
$ec_lang['mpf_manningRoughness']='Rugozitate';
$ec_lang['mpf_friction_slope']='Panta (possibly <a target="_blank" href="../pressureslope.php">?</a> equal to pipe slope, S<sub>0</sub> ';
$ec_lang['mpf_depth_ratio']='Procent sau fracţie din conducta plină (100% sau 1 inseamnă plină)';
$ec_lang['mpf_flow']='Debit';
$ec_lang['mpf_velocity']='Viteză';
$ec_lang['mpf_velocity_head']='Presiunea dinamică';
$ec_lang['mpf_flow_area']='Secţiune de curgere';
$ec_lang['mpf_wetted_perimeter']='Perimetrul secţiunii de curgere';
$ec_lang['mpf_hydraulic_radius']='Raza hidraulică';
$ec_lang['mpf_top_width']='Laţimea suprafeţei libere';
$ec_lang['mpf_froude_number']='Numărul Froude';
$ec_lang['mpf_shear_stress']='Efort tangenţial promedio';
// Orifice Flow
$ec_lang['or_main_menu']='Debit prin Orificiu';
$ec_lang['or_main_title']='Calculator gratuit online de debit prin orificiu';
$ec_lang['or_main_desc']='Debit prin Orificiu — Liber și Înecat';
$ec_lang['or_shape']='Forma deschiderii';
$ec_lang['or_shape_circular']='Circulară';
$ec_lang['or_shape_rectangular']='Dreptunghiulară';
$ec_lang['or_diameter']='Diametru (circular) sau înălțime (dreptunghiular), D';
$ec_lang['or_width']='Lățime, W (doar dreptunghiular)';
$ec_lang['or_invert']='Cota radierului deschiderii';
$ec_lang['or_hwe']='Nivelul apei în amonte';
$ec_lang['or_twe']='Nivelul apei în aval';
$ec_lang['or_cd']='Coeficient de debit, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Cota centroidului';
$ec_lang['or_head']='Sarcină efectivă, h';
$ec_lang['or_area']='Aria deschiderii, A';
$ec_lang['or_flow']='Debit, Q';
$ec_lang['or_regime']='Verificarea regimului de orificiu';
$ec_lang['or_regime_valid']='Curgere liberă — regim de orificiu valid ✓';
$ec_lang['or_regime_submerged']='Orificiu înecat (TWE peste radier) — valid ✓';
$ec_lang['or_regime_warn']='Atenție: nivelul amonte sub cheia arcului — nu este regim de orificiu';
$ec_lang['or_notes_1_term']='Ecuația orificiului';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> &times; A &times; &radic;(2gh). Curgere liberă: h = HWE &minus; centroid. Înecat (TWE peste radier): h = HWE &minus; TWE.';
$ec_lang['or_notes_2_term']='Regimul orificiului';
$ec_lang['or_notes_2_def']='Ecuațiile de debit prin orificiu se aplică atunci când nivelul din amonte este deasupra cheii deschiderii. Când este sub cheie, utilizați o ecuație de deversor.';
$ec_lang['or_notes_3_term']='Coeficient de debit';
$ec_lang['or_notes_3_def']='C<sub>d</sub> variază între 0,60 și 0,65 pentru orificii cu margini ascuțite. Intrările rotunjite sau reintrate au valori diferite. Consultați <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venture-d_590.html">Engineering Toolbox</a> sau Manualul de Referință Hidraulică HEC-RAS.';
$ec_lang['or_notes_4_term']='Înecare';
$ec_lang['or_notes_4_def']='Când TWE depășește radierul deschiderii, calculatorul aplică automat ecuația orificiului înecat cu h = HWE &minus; TWE. Când TWE este la nivelul sau sub radier, se presupune curgere liberă și h = HWE &minus; centroid.';
