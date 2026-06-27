<?php

// All missing text declarations will fall back to English.

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
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning protok kroz cijev';
$ec_lang['mpf_main_title']='Besplatni online kalkulator Manning protoka kroz cijev';
$ec_lang['mpf_main_desc']='Manning formula — jednolik protok kroz cijev pri zadanom nagibu i dubini';
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
$ec_lang['mpf_solve_for_dd0']='Izračunaj y/d<sub>0</sub> za zadani Q';
$ec_lang['mpf_solve_desc']='Koristeći D<sub>0</sub>, n i S<sub>0</sub> iz obrasca kalkulatora, pronalazi najmanji y/d<sub>0</sub> za zadani Q.';
$ec_lang['mpf_solve_button']='Izračunaj';
// Orifice Flow
$ec_lang['or_main_menu']='Protok kroz otvor';
$ec_lang['or_main_title']='Besplatni online kalkulator protoka kroz otvor';
$ec_lang['or_main_desc']='Protok kroz otvor — Slobodan ili potopljeni';
$ec_lang['or_shape']='Oblik otvora';
$ec_lang['or_shape_circular']='Kružni';
$ec_lang['or_shape_rectangular']='Pravokutni';
$ec_lang['or_diameter']='Promjer ili visina, D <span title="Diameter for circular; height for rectangular" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['or_width']='Širina, W <span title="Rectangular openings only" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['or_invert']='Kota dna otvora <span title="Bottom of opening" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
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
$ec_lang['or_regime_twe_above_hwe']='Upozorenje: nizvodni nivo (TWE) iznad uzvodnog nivoa (HWE) — provjerite unos';
$ec_lang['or_notes_1_term']='Jednadžba otvora';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> &times; A &times; &radic;(2gh). Slobodan istjecaj: h = HWE &minus; težište. Potopljeni (TWE iznad dna): h = HWE &minus; TWE.';
$ec_lang['or_notes_2_term']='Režim otvora';
$ec_lang['or_notes_2_def']='Jednadžbe protoka kroz otvor primjenjuju se kada je uzvodni nivo iznad tjemena otvora. Kada je ispod tjemena, koristite jednadžbu preljeva.';
$ec_lang['or_notes_3_term']='Koeficijent protoka';
$ec_lang['or_notes_3_def']='C<sub>d</sub> iznosi oko 0,60&ndash;0,65 za oštrobridne otvore. Zaobljeni ili uvučeni ulazi imaju različite vrijednosti. Pogledajte <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venture-d_590.html">Engineering Toolbox</a> ili HEC-RAS Hidraulički referentni priručnik.';
$ec_lang['or_notes_4_term']='Potopljenost';
$ec_lang['or_notes_4_def']='Kada je TWE iznad dna otvora, kalkulator automatski primjenjuje jednadžbu potopljenog otvora s h = HWE &minus; TWE. Kada je TWE na razini ili ispod dna, pretpostavlja se slobodan istjecaj i h = HWE &minus; težište.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Vrijeme pražnjenja otvora';
$ec_lang['odt_main_title']='Besplatni online kalkulator vremena pražnjenja otvora — jezerce, bazen ili rezervoar';
$ec_lang['odt_main_desc']='Vrijeme pražnjenja jezerca ili bazena kroz otvor &mdash; metoda koničnog volumena';
$ec_lang['odt_h1_elev']='Početna kota razine vode <span title="Starting water surface elevation" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['odt_a1']='Početna površina, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Završna kota razine vode';
$ec_lang['odt_h_orifice']='Kota težišta otvora';
$ec_lang['odt_a0']='Površina na koti otvora, A<sub>0</sub>';
$ec_lang['odt_a_ending']='Završna površina, A<sub>2</sub> <span title="Interpolated from conic model at ending elevation" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['odt_h2_check']='Provjera završne kote';
$ec_lang['odt_h2_ok']='Završna kota iznad gornjeg ruba otvora ✓';
$ec_lang['odt_h2_warn']='Upozorenje: završna kota na razini ili ispod gornjeg ruba otvora (težište + D/2)';
$ec_lang['odt_d']='Promjer otvora, D <span title="Diameter (circular) or height (rectangular)" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['odt_w']='Širina otvora, W <span title="Rectangular only" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['odt_t_sec']='Vrijeme pražnjenja (s)';
$ec_lang['odt_t_min']='Vrijeme pražnjenja (min)';
$ec_lang['odt_t_hr']='Vrijeme pražnjenja (hr)';
$ec_lang['odt_t_day']='Vrijeme pražnjenja (days)';
$ec_lang['odt_notes_1_term']='Formula';
$ec_lang['odt_notes_1_def']='t = &radic;H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> &radic;(2g)) &times; (2A<sub>x</sub>/5 + 8&radic;(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) daje vrijeme pražnjenja od visine H do otvora. Vrijeme pražnjenja = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) &minus; t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), gdje je H<sub>1</sub> = početna kota &minus; kota otvora, H<sub>2</sub> = završna kota &minus; kota otvora.';
$ec_lang['odt_notes_2_term']='Metoda';
$ec_lang['odt_notes_2_def']='Metoda koničnog volumena modelira jezerce ili bazen kao konični presjek između početne površine A<sub>1</sub> na početnoj razini vode i površine A<sub>0</sub> na koti težišta otvora. A<sub>2</sub>, površina jezerca na završnoj koti, interpolira se iz A<sub>1</sub> i A<sub>0</sub> pomoću modela koničnog presjeka. Vrijeme pražnjenja od početne do završne kote jednako je ukupnom vremenu pražnjenja od H<sub>1</sub> do otvora minus preostalo vrijeme pražnjenja od H<sub>2</sub> do otvora.';
$ec_lang['odt_h1']='Početna visina, H<sub>1</sub> <span title="Starting WSE minus orifice centroid elevation" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['odt_q_max']='Maksimalni protok, Q<sub>max</sub>';
$ec_lang['odt_vol']='Ispražnjeni volumen';
$ec_lang['odt_sketch_start']='Početak';
$ec_lang['odt_sketch_end']='Kraj';

// Units (alphabetical order)
$ec_lang['u_depthFrac']='udio';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/s';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% uspon/trčanje';
$ec_lang['u_grade']='uspon/trčanje';
$ec_lang['u_in2']='sq. in.';
$ec_lang['u_inh2o']='in H2O';
$ec_lang['u_in']='in';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='l/s';
$ec_lang['u_m2']='m^2';
$ec_lang['u_m3ps']='m^3/s';
$ec_lang['u_mgd']='MGD';
$ec_lang['u_mh2o']='m H2O';
$ec_lang['u_mld']='Ml/d';
$ec_lang['u_m']='m';
$ec_lang['u_mm2']='mm^2';
$ec_lang['u_mmh2o']='mm H2O';
$ec_lang['u_mm']='mm';
$ec_lang['u_mps']='m/s';
$ec_lang['u_npm2']='N/m^2';
$ec_lang['u_pa']='Pa';
$ec_lang['u_psf']='psf';
$ec_lang['u_psi']='psi';
$ec_lang['u_s']='s';

// Menu and General
$ec_lang['menu_brand']='HawsEDC Kalkulatori';
$ec_lang['menu_main_list']='Popis kalkulatora';
$ec_lang['menu_main_hydraulics']='Hidraulika';
$ec_lang['menu_main_language']='Jezik';
$ec_lang['menu_more']='Više';
$ec_lang['template_welcome']='&gt;&gt; Ostavite strahove na ulazu; ovdje se govori ljubav. Ne kvarite sve. Uživajte u <a target="_blank" href="https://hawsedc.com/download.php">besplatnim HawsEDC AutoCAD alatima</a> također. &lt;&lt;';
$ec_lang['template_translation_help']='Imate li sjajnu viziju za kalkulator koji biste ovdje dodali?  Možete li mi pomoći poboljšati prijevode, programirati ili ugostiti ove kalkulatore?  ';
$ec_lang['template_feedback']='Molimo podijelite svoje dragocjene prijedloge ili pohvale. Je li ovaj besplatni kalkulator premašio vaša očekivanja u svakom pogledu?';
$ec_lang['template_printable_title']='Naslov za ispis';
$ec_lang['template_printable_subtitle']='Podnaslov za ispis';
$ec_lang['index_title']='Besplatni online inženjerski kalkulatori';
$ec_lang['calc_set_units']='Postavi jedinice:';
$ec_lang['calc_inputs']='Unosi';
$ec_lang['calc_results']='Rezultati';
$ec_lang['view_hide_line']='[Sakrij ovaj redak]';
$ec_lang['view_printable']='Verzija za ispis (osvježite stranicu za povratak)';
$ec_lang['ec_name_label']='Spremi ovaj izračun:';
$ec_lang['ec_name_placeholder']='Naziv';
$ec_lang['ec_name_hint']='Sprema ove unesene vrijednosti u URL za zabilješke, preuzimanje iz povijesti i zajedničko korištenje';
$ec_lang['ec_name_invalid']='Koristite samo slova, brojeve, razmake, – _ .';
$ec_lang['points_data_help']='(ili Kopiraj/Zalijepi pomoću područja podataka)';
$ec_lang['points_data_title']='Podaci točaka<br />(odvojeni zarezom ili tabulatorom)';
$ec_lang['points_data_copy']='Kopiraj';
$ec_lang['points_data_paste']='Zalijepi';

// Darcy-Weisbach
$ec_lang['dw_main_menu']='Darcy-Weisbach gubitak tlaka u cijevi';
$ec_lang['dw_main_title']='Besplatni online kalkulator Darcy-Weisbach gubitka tlaka u cijevi';
$ec_lang['dw_main_desc']='Darcy-Weisbach gubitak tlaka u cijevi pri zadanom promjeru, hrapavosti i protoku';
$ec_lang['dw_roughness']='Darcy-Weisbach apsolutna hrapavost, e';
$ec_lang['dw_kinematic_viscosity']='Kinematička viskoznost, &nu; <span title="1×10⁻⁶ m²/s for clean water at 20°C" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['dw_reynolds_number']='Reynoldsov broj, Re';
$ec_lang['dw_flow_regime']='Režim tečenja';
$ec_lang['dw_regime_laminar']='laminarno';
$ec_lang['dw_regime_transitional']='prijelazno';
$ec_lang['dw_regime_turbulent']='turbulentno';
$ec_lang['dw_friction_factor_method']='Metoda koeficijenta trenja';
$ec_lang['dw_friction_factor']='Koeficijent trenja, f';

// Hazen-Williams
$ec_lang['hw_main_menu']='Hazen-Williams gubitak tlaka u cijevi';
$ec_lang['hw_main_title']='Besplatni online kalkulator Hazen-Williams gubitka tlaka u cijevi';
$ec_lang['hw_main_desc']='Hazen-Williams gubitak tlaka u cijevi pri zadanom promjeru, hrapavosti i protoku';
$ec_lang['hw_hgl_1']='Nizvodni HGL';
$ec_lang['hw_hgl_2']='Uzvodni HGL';
$ec_lang['hw_roughness']='Hazen-Williams koeficijent, C';

// Manning Irregular
$ec_lang['mi_menu']='Manning nepravilni kanal';
$ec_lang['mi_main_title']='Besplatni online kalkulator Manning nepravilnog kanala';
$ec_lang['mi_main_desc']='Kalkulator jednolikog tečenja u nepravilnom kanalu prema Manningu';
$ec_lang['mi_waterSurfaceElevation']='Kota razine vode';
$ec_lang['mi_q_617']='Q';
$ec_lang['mi_xSecPoints']='Točke poprečnog presjeka';
$ec_lang['mi_groupPoint']='Točka';
$ec_lang['mi_groupSegment']='Segment';
$ec_lang['mi_groupRegion']='Područje';
$ec_lang['mi_station']='Stacionaža';
$ec_lang['mi_elevation']='Kota';
$ec_lang['mi_d50in']='Obloga<br />medijalna<br />veličina<br />kamena';
$ec_lang['mi_n']='n<br />za seg-<br />ment';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />granica<br />područja<br />(Brijeg)';
$ec_lang['mi_tau']='Posmično<br />naprezanje<br />dna &tau;';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='Složeni<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='H<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes']='Napomene';
$ec_lang['mi_notes_1_term']='Složeni n';
$ec_lang['mi_notes_1_def']='Ovaj kalkulator slijedi HEC-RAS referentni priručnik u izračunu složenog n za područje prema Chow 1959, str. 136, jednadžba 6-17 (ne 6-18).';
$ec_lang['mi_notes_2_term']='Kamena obloga';
$ec_lang['mi_notes_2_def']='Koristite kalkulator trapezoidnog kanala prema Manningu za projektiranje kamene obloge. Ovaj kalkulator je više namijenjen prirodnim presjecima.';

// Manning Pipe Flow (additional keys)
$ec_lang['mpf_see_notes']='(Vidi napomene)';
$ec_lang['mpf_pipe_area']='Površina cijevi, a0';
$ec_lang['mpf_area_ratio']='Relativna površina, a/a0';
$ec_lang['mpf_full_flow']='Puni protok, Q0';
$ec_lang['mpf_full_flow_ratio']='Omjer punog protoka, Q/Q0';
$ec_lang['mpf_note_1']='<dl><dt>Ovo je protok i dubina unutar <em>beskonačno dugačke</em> cijevi.</dt><dd>Uvođenje protoka u cijev može zahtijevati znatno veću dubinu uzvodne vode. Dodajte najmanje 1,5 puta energetsku visinu za dobivanje dubine uzvodne vode ili <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">pogledajte moj 2-minutni tutorial</a> za standardne proračune uzvodne razine propusta pomoću HY-8.</dd>';
$ec_lang['mpf_spreadheet_notice']='Pogledajte proračunsku tablicu ovog kalkulatora';

// Manning Pipe Head Loss
$ec_lang['mphl_main_menu']='Manning gubitak tlaka u cijevi';
$ec_lang['mphl_main_title']='Besplatni online kalkulator Manning gubitka tlaka u cijevi';
$ec_lang['mphl_main_desc']='Manning formula — gubitak tlaka pri punom protoku';
$ec_lang['mphl_pipe_length']='Duljina cijevi, L';
$ec_lang['mphl_area']='Površina, A';
$ec_lang['mphl_total_junction_k']='Ukupni kombinirani koeficijent lokalnog gubitka, k';
$ec_lang['mphl_friction_slope']='Linijski pad';
$ec_lang['mphl_friction_loss']='Linijski gubitak, H<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Lokalni gubitak, H<sub>m</sub>';
$ec_lang['mphl_total_loss']='Ukupni gubitak, H<sub>l</sub>';
$ec_lang['mphl_egl_1']='Nizvodni EGL';
$ec_lang['mphl_egl_2']='Uzvodni EGL';
$ec_lang['mphl_hgl_2']='Uzvodni HGL u cijevi ' . $ec_lang['mpf_see_notes'];
$ec_lang['mphl_note_1']='<dl><dt>Za uvjete otvorenog ulaza (propust) potrebno je provjeriti uvjete kontrole ulaza.</dt><dd>1. Uzvodni HGL ne može biti niži od kote normalnog tečenja uzvodnog toka (niti niži od cijevi!).</dd><dd>2. Uzvodna razina propusta bolje je predstavljena uzvodnim EGL-om nego uzvodnim HGL-om.</dd><dd>3. Pogledajte <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">moj 2-minutni tutorial</a> za jednostavne standardne proračune uzvodne razine propusta pomoću HY-8.</dd>';

// Manning Trapezoid
$ec_lang['mtc_menu']='Manning trapezoidni kanal';
$ec_lang['mtc_main_title']='Besplatni online kalkulator Manning formule za trapezoidni kanal';
$ec_lang['mtc_main_desc']='Manning formula — jednolik protok u trapezoidnom kanalu pri zadanom nagibu i dubini';
$ec_lang['mtc_bottom_width']='Širina dna, b';
$ec_lang['mtc_side_slope_1']='Nagib bočne strane 1 (horiz./vert.)';
$ec_lang['mtc_side_slope_2']='Nagib bočne strane 2 (horiz./vert.)';
$ec_lang['mtc_channel_slope']='Nagib kanala, S';
$ec_lang['mtc_flow_depth']='Dubina tečenja, y';
$ec_lang['mtc_bend_angle']='Kut zavoja <a target="_blank" href="riprap-bend-angle.png" title="Kliknite za sliku">?</a> (za dimenzioniranje riprap-a)';
$ec_lang['mtc_sgrock']='Specifična težina kamena (2,65)';
$ec_lang['mtc_d50_in']='Projektna veličina kamena, D50';
$ec_lang['mtc_n_strickler']='n za projektnu veličinu kamena prema Strickleru';
$ec_lang['mtc_n_blodgett']='n za projektnu veličinu kamena prema Blodgettu';
$ec_lang['mtc_n_bathurst']='n za projektnu veličinu kamena prema Bathurstu';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett nasuprot Bathurstu';
$ec_lang['mtc_d50_bottom']='Potrebna veličina uglatog kamena dna, D50 (Isbash i MC) <span title="Prema Isbash (1936) i Maricopa County, Arizona, US." style="cursor:help;color:#06c;font-size:0.9em">?</span>';
$ec_lang['mtc_d50_z1']='Potrebna veličina uglatog kamena bočne strane 1, D50 (Isbash i MC) <span title="Prema Isbash (1936) i Maricopa County, Arizona, US." style="cursor:help;color:#06c;font-size:0.9em">?</span>';
$ec_lang['mtc_d50_z2']='Potrebna veličina uglatog kamena bočne strane 2, D50 (Isbash i MC) <span title="Prema Isbash (1936) i Maricopa County, Arizona, US." style="cursor:help;color:#06c;font-size:0.9em">?</span>';
$ec_lang['mtc_d50_mra']='Potrebna veličina uglatog kamena, D50 (Maynord, Ruff i Abt 1989)';
$ec_lang['mtc_d50_searcy']='Potrebna veličina uglatog kamena, D50 (Searcy 1967)';
$ec_lang['mtc_note_1']='<dl><dt>Automatizirana iteracija dimenzioniranja kamena i hrapavosti</dt><dd>Odaberite radio gumb za hrapavost (preporučuje se BB) i radio gumb za projektnu veličinu kamena (preporučuje se Isbash). Fino podesite dubinu i faktor sigurnosti veličine kamena kako biste dobili željeni protok s jednoličnom veličinom kamena. Svaki put kada promijenite bilo koji ulazni podatak, odvija se sljedeći iteracijski ciklus: 1. Hrapavost se izračunava iz projektne veličine kamena. 2. Traženi izračun hrapavosti kopira se na ulaznu hrapavost. 3. Izračunavaju se protok kroz kanal i potrebna veličina kamena. 4. Projektna veličina kamena se prilagođava. 5. Ponavljati dok pogreška u projektnoj veličini kamena nije vrlo mala.</dd><dt>Osnovni kalkulator (bez iteracije)</dt><dd>Unesite željenu vrijednost hrapavosti. Zanemarite područje unosa projektne veličine kamena.</dd></dl>';

// Robinson Rock Chute
$ec_lang['rrc_main_menu']='Robinson kameniti brzotok';
$ec_lang['rrc_main_desc']='Proračunska tablica za projektiranje Robinson kamenitog brzotoka';

// Weir Flow Simple
$ec_lang['ws_main_menu']='Protok preko preljeva (jednostavni)';
$ec_lang['ws_main_title']='Besplatni online kalkulator protoka preko preljeva sa širokom krunom';
$ec_lang['ws_main_desc']='Jednostavni kalkulator protoka preko preljeva sa širokom krunom';
$ec_lang['ws_weirLength']='Duljina preljeva, l';
$ec_lang['ws_headWaterHeight']='Visina uzvodne vode, h';
$ec_lang['ws_weirCoefficient']='Koeficijent preljeva, Cw';
$ec_lang['ws_notes_heading']='Napomene';
$ec_lang['ws_notes_we_term']='Jednadžba preljeva';

// Weir Flow Irregular
$ec_lang['wi_menu']='Protok preko nepravilnog preljeva';
$ec_lang['wi_main_title']='Besplatni online kalkulator protoka preko segmentiranog nepravilnog preljeva promjenjive dubine';
$ec_lang['wi_main_desc']='Kalkulator protoka preko nepravilnog preljeva';
$ec_lang['wi_headWaterelevation']='Kota uzvodne razine vode';
$ec_lang['wi_weirPoints']='Točke preljeva';
$ec_lang['wi_station']='Stacionaža<br />(udaljenost)';
$ec_lang['wi_elevation']='Kota';
$ec_lang['wi_pondingHeight']='Visina poniranja';
$ec_lang['wi_incrementalFlow']='Parcijalni protok';
$ec_lang['wi_cumulativeFlow']='Kumulativni protok';
$ec_lang['wi_save_and_calculate']='Spremi i izračunaj';
$ec_lang['wi_notes_we_term']='Jednadžba preljeva';
$ec_lang['wi_notes_we_def']='q = ako (duljina = 0) onda 0 inače ako (nagib=0) onda cw*duljina*d<sub>0</sub><sup>1.5</sup> inače cw/(2.5*nagib) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) gdje su d<sub>1</sub> i d<sub>0</sub> uvijek pozitivni ili nula';

// Orifice Flow (additional key)
$ec_lang['or_velocity']='Brzina, v';

// Erosion Setback and Scour Calc.
$ec_lang['essc_btbw']='Širina od obale do obale';
$ec_lang['essc_mcr']='Minimalni radijus krivine';
$ec_lang['essc_q']='Protok, Q';

// Contact us

// Irrigation
$ec_lang['irr_main_menu']='Mjerenje protoka navodnjavanja';
$ec_lang['irr_main_title']='Besplatni online kalkulatori za mjerenje protoka navodnjavanja';
$ec_lang['irr_main_desc']='Mjerenje protoka navodnjavanja — pragovi i otvori';
$ec_lang['contact_title']='HawsEDC Kontakt';
$ec_lang['contactSendMessage']='Pošaljite poruku Tomu Hawsu';
$ec_lang['contactYourName']='Vaše ime:';
$ec_lang['contactYourEmail']='Vaša e-mail adresa:';
$ec_lang['contactSubject']='Predmet:';
$ec_lang['contact_message']='Poruka:';
$ec_lang['contactSpamPrefix']='Pet plus jedan jednako';
$ec_lang['contactSpamPostfix']='(Molimo napišite slovima. 1=jedan 2=dva 3=tri 4=četiri 5=pet 6=šest 7=sedam +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Pošalji poruku';
$ec_lang['contact_success']='Hvala vam što ste si odvojili vremena da napišete.';


// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Mala hidroelektrana';
$ec_lang['mhp_main_title']='Besplatni online kalkulator za malu hidroelektranu';
$ec_lang['mhp_main_desc']='Kalkulator izlazne snage male hidroelektrane protočnog tipa';
$ec_lang['mhp_flow']='Protok, Q';
$ec_lang['mhp_gross_head']='Bruto tlačna visina, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='Promjer dovodne cijevi, D';
$ec_lang['mhp_length']='Duljina dovodne cijevi, L';
$ec_lang['mhp_roughness']='Hrapavost cijevi, e';
$ec_lang['mhp_km']='Koeficijent lokalnih gubitaka, k<sub>m</sub> <span title="Sum of all junction and fitting loss coefficients along the penstock" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['mhp_nu']='Kinematička viskoznost, &nu; <span title="1×10⁻⁶ m²/s for clean water near 20°C" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['mhp_efficiency']='Stupanj korisnog djelovanja postrojenja, &eta; (0&ndash;1)';
$ec_lang['mhp_velocity']='Brzina tečenja, v';
$ec_lang['mhp_vel_check']='Provjera brzine';
$ec_lang['mhp_f']='Koeficijent trenja, f';
$ec_lang['mhp_hf']='Gubitak tlačne visine trenjem, h<sub>f</sub>';
$ec_lang['mhp_hm']='Lokalni gubitak tlačne visine, h<sub>m</sub>';
$ec_lang['mhp_hl']='Ukupni gubitak dovodne cijevi, h<sub>L</sub>';
$ec_lang['mhp_hl_check']='Provjera gubitka tlačne visine';
$ec_lang['mhp_hnet']='Neto tlačna visina, H<sub>net</sub>';
$ec_lang['mhp_power']='Izlazna snaga, P';
$ec_lang['mhp_annual_kwh']='Godišnja energija pri 100% kapaciteta';
$ec_lang['mhp_vel_ok']='1–3 m/s — unutar ciljnog raspona ✓';
$ec_lang['mhp_vel_low']='ispod 1 m/s — smanjite promjer ⚠';
$ec_lang['mhp_vel_high']='iznad 3 m/s — povećajte promjer ⚠';
$ec_lang['mhp_hl_ok']='unutar ciljnih 10% ✓';
$ec_lang['mhp_hl_warn']='prelazi cilj od 10% — razmotriti veću cijev ⚠';
$ec_lang['mhp_hl_bad']='prelazi 20% — redimenzionirati cijev';
$ec_lang['mhp_notes_1_term']='Gubitak tlačne visine';
$ec_lang['mhp_notes_1_def']='Ukupni gubitak h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, gdje je h<sub>f</sub> = f(L/D)(v&sup2;/2g) gubitak trenjem prema Darcy-Weisbachu, a h<sub>m</sub> = k<sub>m</sub>&middot;v&sup2;/2g uključuje ulaz, koljena i ventile. Neto visina H<sub>net</sub> = H<sub>gross</sub> &minus; h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Brzina';
$ec_lang['mhp_notes_2_def']='Cilj 1&ndash;3 m/s. Ispod 1 m/s cijev je predimenzionirana; iznad 3 m/s rastu gubici trenjem i rizik od vodnog udara.';
$ec_lang['mhp_notes_3_term']='Ciljni gubitak tlačne visine';
$ec_lang['mhp_notes_3_def']='Gubici u dovodnoj cijevi ispod 10% bruto visine su ekonomični. Optimalni kompromis između cijene cijevi i izgubljene snage obično je oko 4&ndash;6% za objekte s visoko vrijednom električnom energijom.';
$ec_lang['mhp_notes_4_term']='Lokalni gubici k<sub>m</sub>';
$ec_lang['mhp_notes_4_def']='Tipične vrijednosti: oštar ulaz 0.5, svako koljeno 45&deg; između 0.2&ndash;0.3, zaporni ventil (potpuno otvoren) 0.1, leptirasti ventil 0.2. Zbroj svih fitinga daje ukupni k<sub>m</sub>. Zadana vrijednost 1.5 pretpostavlja jedan ulaz i dva koljena.';
$ec_lang['mhp_notes_5_term']='Hrapavost cijevi e';
$ec_lang['mhp_notes_5_def']='Tipična apsolutna hrapavost: čelik (nov) 0.046&nbsp;mm, čelik (rabljeni) 0.15&nbsp;mm, HDPE 0.003&nbsp;mm, PVC/uPVC 0.0015&nbsp;mm, beton 0.3&ndash;3&nbsp;mm. HDPE je uobičajen za male dovodne cijevi mikro-hidro sustava.';

// About
$ec_lang['about_main_menu']='O nama';
$ec_lang['install_main_menu']='Instaliraj';
$ec_lang['install_main_title']='Instaliraj EngCalcs';
$ec_lang['install_main_desc']='Dodaj na uređaj za korištenje bez interneta';
$ec_lang['contact_main_menu']='Kontakt';
$ec_lang['about_main_title']='O HawsEDC inženjerskim kalkulatorima';
$ec_lang['about_main_desc']='Misija, otvoreni izvorni kod i doprinosi';

// Drip / Sprinkler Application Rate
$ec_lang['u_lph']="L/hr";
$ec_lang['u_gph']="gal/hr";
$ec_lang['u_mmph']="mm/hr";
$ec_lang['u_inph']="in/hr";
$ec_lang['ds_main_menu']='Norma navodnjavanja (kap po kap/raspršivanje)';
$ec_lang['ds_main_title']='Besplatni online kalkulator norme navodnjavanja kap po kap/raspršivanjem';
$ec_lang['ds_main_desc']='Navodnjavanje kap po kap i raspršivanjem &mdash; norma navodnjavanja i ujednačenost';
$ec_lang['ds_q_avg']='Prosječni protok emitera, q';
$ec_lang['ds_q_min']='Minimalni protok emitera, q<sub>min</sub>';
$ec_lang['ds_se']='Razmak emitera, S<sub>e</sub>';
$ec_lang['ds_sl']='Razmak laterala, S<sub>l</sub>';
$ec_lang['ds_n_e']='Emiteri po laterali, n<sub>e</sub>';
$ec_lang['ds_n_l']='Laterale po zoni, n<sub>l</sub>';
$ec_lang['ds_d']='Ciljna dubina navodnjavanja, d';
$ec_lang['ds_a_e']='Površina po emiteru, A<sub>e</sub>';
$ec_lang['ds_pr']='Norma navodnjavanja, PR';
$ec_lang['ds_du']='Ujednačenost raspodjele, DU';
$ec_lang['ds_du_check']='Provjera kvalitete DU';
$ec_lang['ds_q_lat']='Protok po laterali, Q<sub>lat</sub>';
$ec_lang['ds_q_sys']='Protok zone, Q<sub>zone</sub>';
$ec_lang['ds_t_run']='Trajanje navodnjavanja (sati)';
$ec_lang['ds_du_excellent']='Izvrsno — DU ≥ 90% ✓';
$ec_lang['ds_du_good']='Dobro — DU ≥ 80% ✓';
$ec_lang['ds_du_acceptable']='Prihvatljivo — DU ≥ 70%';
$ec_lang['ds_du_poor']='Loše — DU < 70% — pregledati projekt ⚠';
$ec_lang['ds_notes_1_term']='Norma navodnjavanja';
$ec_lang['ds_notes_1_def']='PR = q / A<sub>e</sub>, gdje je A<sub>e</sub> = S<sub>e</sub> &times; S<sub>l</sub> površina koju opslužuje svaki emiter. Niža norma navodnjavanja daje više vremena za infiltraciju &mdash; važno na teškim tlima ili nagnutim poljima.';
$ec_lang['ds_notes_2_term']='Ujednačenost raspodjele (DU)';
$ec_lang['ds_notes_2_def']='DU = q<sub>min</sub> / q<sub>avg</sub>. DU od 1,0 (100%) znači da svi emiteri teku jednako. Vrijednosti ispod 0,80 rasipaju vodu u dobro navodnjavanim područjima, ostavljajući suša mjesta. Ujednačenost opada s prekomjernim tlačnim varijacijama duž laterale, istrošenošću emitera ili djelomičnim začepljenjem.';
$ec_lang['ds_notes_3_term']='Trajanje navodnjavanja';
$ec_lang['ds_notes_3_def']='Trajanje navodnjavanja = ciljna dubina &divide; norma navodnjavanja. Na nagnutom ili zbijenom tlu podijelite trajanje na dva ili tri kraća ciklusa s pauzama između njih kako biste izbjegli površinsko otjecanje.';

// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Procjeđivanje kanala';
$ec_lang['cs_main_title']='Besplatni online kalkulator gubitka procjeđivanjem u kanalu i korisnosti transporta';
$ec_lang['cs_main_desc']='Gubitak procjeđivanjem u kanalu &amp; korisnost transporta &mdash; metoda ulaz-izlaz';
$ec_lang['cs_Q_in']='Dotok, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Otjecaj, Q<sub>out</sub>';
$ec_lang['cs_Q_loss']='Stopa gubitka procjeđivanjem, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Provjera mjerenja';
$ec_lang['cs_pct_loss']='Udio gubitka';
$ec_lang['cs_Ec']='Korisnost transporta, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Ocjena korisnosti';
$ec_lang['cs_Vol_day']='Dnevni izgubljeni volumen';
$ec_lang['cs_Vol_year']='Godišnji izgubljeni volumen';
$ec_lang['cs_L']='Duljina dionice, L';
$ec_lang['cs_wp']='Omočeni opseg, P<sub>w</sub>';
$ec_lang['cs_Q_loss_per_L']='Gubitak po jedinici duljine, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Vrijednost vode';
$ec_lang['cs_lining_cost']='Trošak obloge';
$ec_lang['cs_Ec_target']='Ciljna korisnost, E<sub>c,target</sub> <span title="Conveyance efficiency goal after lining; fraction 0&ndash;1" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['cs_lining_area']='Površina obloge, L &times; P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Godišnja vrijednost gubitka';
$ec_lang['cs_annual_value_recovered']='Godišnja vrijednost oporavljena';
$ec_lang['cs_lining_total_cost']='Ukupni trošak obloge';
$ec_lang['cs_payback_years']='Razdoblje amortizacije <span title="Simple payback = total lining cost &divide; annual value recovered" style="cursor:help;color:steelblue;font-size:0.9em">?</span>';
$ec_lang['cs_loss_positive']='Qin > Qout — procjeđivanje otkriveno ✓';
$ec_lang['cs_loss_zero']='Qin = Qout — nema mjerljivog gubitka';
$ec_lang['cs_loss_negative']='Upozorenje: Qout > Qin — provjerite mjerenja ⚠';
$ec_lang['cs_Ec_good']='Dobro — Ec ≥ 80% ✓';
$ec_lang['cs_Ec_fair']='Zadovoljavajuće — Ec 60–80%';
$ec_lang['cs_Ec_poor']='Loše — Ec < 60% ⚠';
$ec_lang['cs_notes_1_term']='Metoda';
$ec_lang['cs_notes_1_def']='Metoda ulaz-izlaz procjenjuje procjeđivanje mjerenjem protoka na početku i kraju dionice kanala: Q<sub>loss</sub> = Q<sub>in</sub> &minus; Q<sub>out</sub>. Korisnost transporta E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Godišnji volumen pretpostavlja neprekidan rad pri punom protoku; stvarni gubitak je manji za sezonske ili kanale s djelomičnim protokom.';
$ec_lang['cs_notes_2_term']='Ocjene korisnosti';
$ec_lang['cs_notes_2_def']='Tipični neobloženi zemljani kanali: E<sub>c</sub> = 60&ndash;80%. Dobro održavani zemljani kanali: 75&ndash;85%. Betonski obloženi kanali: 90&ndash;98%. Gubici procjeđivanjem iznad 30% dotoka često opravdavaju ulaganje u oblogu. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Amortizacija obloge';
$ec_lang['cs_notes_3_def']='Unesite vrijednost vode i trošak obloge u bilo kojoj konzistentnoj valuti. Površina obloge = duljina dionice &times; omočeni opseg &mdash; omočeni opseg kanalne poprečnog presjeka na mjernoj dubini vode (širina dna plus obje omočene padine). Godišnja vrijednost oporavljena pretpostavlja da obloženi kanal dosegne cilj E<sub>c</sub> neprekidno. Stvarna amortizacija bit će duža za sezonske kanale ili ako obloga ne dosegne ciljnu iskoristivost.';
$ec_lang['cs_notes_4_term']='Izvor';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3. izd. (2001). FAO Irrigation and Drainage Paper 57 (1999).';

$ec_lang['irr_intro_html']='<p>Preljevice i otvori standardni su terenska mjernog alata za mjerenje protoka vode u sustavima navodnjavanja. Odaberite kalkulator koji odgovara vašoj građevini:</p>';
$ec_lang['irr_card_weir_uniform_head']='Preljevica — Široka Kruna (Ujednačena Širina)';
$ec_lang['irr_card_weir_uniform_desc']='Izmjerite protok preko krune skretne brane, kontrolne građevine ili preljevne daske. Unesite duljinu preljevice i dubinu vode iznad krune.';
$ec_lang['irr_card_weir_irregular_head']='Preljevica — Nepravilni Profil';
$ec_lang['irr_card_weir_irregular_desc']='Koristite kada kruna preljevice nije na jednoj jednolikoj visini — prirodne preljeve, stupnjeve s promjenjivom širinom ili višesekcijske regulacijske građevine.';
$ec_lang['irr_card_orifice_head']='Otvor — Zasun ili Cjevovodni Ispust';
$ec_lang['irr_card_orifice_desc']='Izmjerite protok kroz zasun, cjevovodni ispust ili otvor propusta. Automatski obrađuje i slobodni istjecaj i potopljene uvjete (protutlak nizvodno).';
$ec_lang['irr_card_canal_head']='Projektiranje &amp; Analiza Kanala';
$ec_lang['irr_card_canal_desc']='Projektirajte ili provjerite kanal za navodnjavanje koristeći Manningovu formulu. Koristite trapezni kalkulator za nove kanale; nepravilni kalkulator za postojeće prirodne ili izgrađene presjeke.';
$ec_lang['irr_card_drip_head']='Projektiranje Kap po Kap &amp; Orošavanja';
$ec_lang['irr_card_drip_desc']='Izračunajte stopu primjene, ravnomjernost raspodjele, protok bočnog voda, protok zone i trajanje rada za sustav kap po kap ili orošavanja. Unesite protok emitera, razmak emitera i ciljanu dubinu.';
$ec_lang['irr_card_seepage_head']='Procjeđivanje kanala &amp; korisnost transporta';
$ec_lang['irr_card_seepage_desc']='Procijenite gubitak procjeđivanjem u dionici kanala na temelju mjerenja dotoka i otjecaja. Izračunajte korisnost transporta i godišnji gubitak vode kako biste pomogli u određivanju prioriteta za ulaganje u oblogu.';
$ec_lang['irr_quickref_html']='<h3>Brzi Vodič</h3><dl><dt>Skretna brana ili kontrolna građevina</dt><dd>Izmjerite dubinu vode iznad krune preljevice. Koristite <a href="Weir-Flow-Simple.php">Jednostavnu Preljevicu</a> za jednoličnu krunu ili <a href="Weir-Flow-Irregular.php">Nepravilnu Preljevicu</a> za profiliranu ili stepenasto oblikovanu krunu.</dd><dt>Zasun ili cjevovodni ispust</dt><dd>Izmjerite visinu vodnog lica uzvodno i nizvodno (ili kotu dna pri slobodnom istjecanju). Koristite <a href="Orifice.php">Protok kroz Otvor</a>. Za kružnu cijev D&nbsp;= promjer cijevi; za pravokutni zasun unesite širinu W i visinu D.</dd><dt>Vrijeme pražnjenja akumulacije ili ribnjaka</dt><dd>Koristite <a href="Orifice-Drain-Time.php">Trajanje Pražnjenja kroz Otvor</a> za procjenu koliko je potrebno da se razina jezera ili akumulacije smanji kroz dno otvor — korisno za planiranje navodnjavačke pohrane.</dd><dt>Terenska mjerila</dt><dd>Jednadžbe protoka preljevice i otvora korištene ovdje odgovaraju postupcima USBR <em>Water Measurement Manual</em> (3. izd.), koje obično zahtijevaju vodne upravitelje i navodnjavačke okruge.</dd></dl>';
$ec_lang['about_body_html']='<h3>Misija</h3><p>Inženjerski Kalkulatori HawsEDC postoje kako bi služili inženjerima i terenskim radnicima diljem svijeta — posebno onima koji rade u područjima s nedostatkom vode, ograničenim resursima ili slabom pokrivenošću. Ovi alati dio su šire humanitarne misije: reći svakom čovjeku na najpraktičniji i najučinkovitiji mogući način da je voljeni i dragi zauvijek, da nema ničeg za brinuti i da neće sve upropastiti.</p><p>Kalkulatori su sredstvo. Cilj je svijet bez patnje.</p><h3>Licencija Otvorenog Koda</h3><p>Sav kod objavljen je pod <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU Općom Javnom Licencijom v3.0 ili novijom</a> — slobodan u smislu slobode. Kod možete koristiti, proučavati, mijenjati i redistribuirati pod istim uvjetima.</p><p>Copyright &copy; 2009&ndash;2026 Thomas Gail Haws.</p><h3>Izvorni Kod</h3><p>Cjelokupni izvorni kod javno je dostupan na Bitbucketu:</p><p><a target="_blank" href="https://bitbucket.org/hawstom/engcalcs">bitbucket.org/hawstom/engcalcs</a></p><p>Tamo možete pregledavati kod, prijaviti probleme ili forknuti repozitorij.</p><h3>Doprinos</h3><p>Pull zahtjevi su dobrodošli. Načini doprinosa:</p><ul><li><strong>Prijevodi</strong> — poboljšajte ili dodajte jezik. Otvorite pull zahtjev s promjenama u odgovarajućoj datoteci <code>lib/lang.ec.??.php</code>.</li><li><strong>Prijave grešaka</strong> — koristite obrazac za povratne informacije na bilo kojoj stranici kalkulatora ili prijavite problem na Bitbucketu.</li><li><strong>Novi kalkulatori</strong> — ideje za hidrauličko-inženjerske alate koji služe terenskim radnicima i stručnjacima za navodnjavanje posebno su dobrodošle. Pogledajte razvojni vodič <code>CLAUDE.md</code> u repozitoriju.</li><li><strong>Hosting</strong> — ako možete zrcaliti ove kalkulatore za područje s ograničenom povezivošću, javite se.</li></ul><h3>Korištenje bez interneta</h3><p>Ovi kalkulatori rade kao progresivna web aplikacija (PWA). Posjetite bilo koju stranicu kalkulatora dok ste povezani s internetom i vaš preglednik će automatski pohraniti sve kalkulatore u predmemoriju. Nakon toga svi kalkulatori rade bez interneta — nije potrebna internetska veza.</p><p>Na Androidu ili iOS-u koristite opciju „Dodaj na početni zaslon" u pregledniku kako biste instalirali EngCalcs kao aplikaciju na svom uređaju. Na stolnom računalu potražite ikonu instalacije u adresnoj traci preglednika.</p><p>Možete i pohraniti bilo koji pojedini kalkulator pomoću izbornika „Spremi kao&hellip;" u pregledniku za jednokratnu offline upotrebu.</p><h3>Kontakt</h3><p>Tom Haws — hidraulički inženjer i autor ovih kalkulatora.<br />Koristite obrazac za povratne informacije na bilo kojoj stranici kalkulatora ili pristupite izvornom kodu na <a target="_blank" href="https://bitbucket.org/hawstom/engcalcs">Bitbucketu</a>.</p>';

// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['u_m2ps']='m^2/s';
$ec_lang['u_ft2ps']='cfs/ft';
$ec_lang['rc_main_menu']='Projektiranje Kamenog Žlijeba (Robinson)';
$ec_lang['rc_main_title']='Besplatni Online Kalkulator za Projektiranje Kamenog Žlijeba — Robinson (1998)';
$ec_lang['rc_main_desc']='Dimenzioniranje Kamenog Obloga za Žlijeb &mdash; Robinson, Rice &amp; Kadavy (1998)';
$ec_lang['rc_S0']='Nagib dna žlijeba, S<sub>0</sub>';
$ec_lang['rc_qt']='Jedinični protok, q<sub>t</sub> <span title="Protok po jedinici širine na ulazu u žlijeb. Za kanal širine dna B s ukupnim protokom Q koristite q_t = Q / B." style="cursor:help;color:#06c;font-size:0.9em">?</span>';
$ec_lang['rc_np']='Poroznost kamenog obloga, n<sub>p</sub>';
$ec_lang['rc_sg']='Specifična težina kamena, sg <span title="Tipični drobljeni granit ili bazalt ≈ 2,65. Raspon po Robinson: 2,54 do 2,82." style="cursor:help;color:#06c;font-size:0.9em">?</span>';
$ec_lang['rc_SD']='Gradacijska SO SD = D<sub>84.1</sub>/D<sub>50</sub> <span title="Standardna devijacija granulometrijskog sastava. Jednolik kamen ≈ 1,25. Raspon po Robinson: 1,15 do 1,47." style="cursor:help;color:#06c;font-size:0.9em">?</span>';
$ec_lang['rc_yn']='Normalna dubina u ulaznom kanalu, y<sub>n</sub> <span title="Zadržavanje vode (Hp > yn) je dobro — smanjuje eroziju uzvodno. (USDA)" style="cursor:help;color:#06c;font-size:0.9em">?</span>';
$ec_lang['rc_D50']='Potrebna medijalna veličina kamena, D<sub>50</sub> <span title="Jed. 1 (S0 &lt; 0,10) ili Jed. 2 (0,10–0,40). Važeće: D50 15–278 mm, S0 0,02–0,40. Izvan raspona: ekstrapolacija." style="cursor:help;color:#06c;font-size:0.9em">?</span>';
$ec_lang['rc_eq_used']='Primijenjena jednadžba';
$ec_lang['rc_sg_check']='Provjera specifične težine';
$ec_lang['rc_SD_check']='Provjera gradacijske SO';
$ec_lang['rc_sg_ok']   ='sg u važećem rasponu (2,54–2,82) ✓';
$ec_lang['rc_sg_low']  ='Upozorenje: sg < 2,54 — ispod raspona Robinson';
$ec_lang['rc_sg_high'] ='Upozorenje: sg > 2,82 — iznad raspona Robinson';
$ec_lang['rc_SD_ok']   ='SD u važećem rasponu (1,15–1,47) ✓';
$ec_lang['rc_SD_low']  ='Upozorenje: SD < 1,15 — ispod raspona Robinson';
$ec_lang['rc_SD_high'] ='Upozorenje: SD > 1,47 — iznad raspona Robinson';
$ec_lang['rc_layer']='Debljina sloja obloga (2 &times; D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Polumjer krivulje grebena (40 &times; D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Duljina luka krivulje grebena';
$ec_lang['rc_apron_length']='Duljina izlazne ploče (15 &times; D<sub>50</sub>) <span title="Potrebna za konstruktivno oslanjanje kamena žlijeba. «Minimalna nizvodna dubina koja nastaje uslijed otpora izlaznog dijela i nizvodnog kanala dovoljna je za osiguranje stabilnosti obloga u izlaznom dijelu.» (Robinson)" style="cursor:help;color:#06c;font-size:0.9em">?</span>';
$ec_lang['rc_n_chute']='Manningov koeficijent hrapavosti u žlijebu, n';
$ec_lang['rc_Vm']='Brzina kroz kameni plašt, V<sub>m</sub> <span title="Udio q_t koji prolazi kroz pore kamena. Ostatak qs teče po površini. Zadana vrijednost np = 0,45 za uglati drobljeni kamen." style="cursor:help;color:#06c;font-size:0.9em">?</span>';
$ec_lang['rc_qm']='Jedinični protok kroz plašt, q<sub>m</sub>';
$ec_lang['rc_qs']='Površinski jedinični protok, q<sub>s</sub> (q<sub>t</sub> &minus; q<sub>m</sub>)';
$ec_lang['rc_d']='Dubina toka iznad površine obloga, d';
$ec_lang['rc_Hp']='Tlak na ulaznom pragu, H<sub>p</sub> <span title="Zadržavanje vode (Hp > yn) je dobro — smanjuje eroziju uzvodno. (USDA)" style="cursor:help;color:#06c;font-size:0.9em">?</span>';
$ec_lang['rc_ponding_check']='Provjera zadržavanja vode na ulazu';
$ec_lang['rc_pond_ok']  ='Hp > yn — zadržavanje vode uzvodno ✓';
$ec_lang['rc_pond_warn']='⚠ Hp ≤ yn — nema zadržavanja vode — provjerite ulaz zbog erozije';
$ec_lang['rc_eq1']='Jed. 1 (S0 < 0,10) — blagi nagib';
$ec_lang['rc_eq2']='Jed. 2 (0,10 ≤ S0 ≤ 0,40) — strmi nagib';
$ec_lang['rc_eq_warn_low']='Upozorenje: S0 < 0,02 — ispod raspona validacije Robinson';
$ec_lang['rc_eq_warn_high']='Upozorenje: S0 > 0,40 — iznad raspona validacije Robinson';
$ec_lang['rc_notes_1_term']='Jednadžbe za dimenzioniranje kamena';
$ec_lang['rc_notes_1_def']='Robinson, Rice &amp; Kadavy (1998) razvili su dvije empirijske jednadžbe za medijalnu veličinu obloga D<sub>50</sub> na temelju nagiba žlijeba i jediničnog protoka. Jednadžba 1 primjenjuje se za blage nagibe (S<sub>0</sub> &lt; 0,10); Jednadžba 2 — za strme nagibe (0,10 &le; S<sub>0</sub> &le; 0,40). Obje jednadžbe zahtijevaju q<sub>t</sub> u m&sup2;/s i vraćaju D<sub>50</sub> u mm. Validirani raspon je 0,02 &le; S<sub>0</sub> &le; 0,40.';
$ec_lang['rc_notes_2_term']='Jedinični protok';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> je ukupni jedinični protok pri grebenu žlijeba (ukupni protok po jedinici širine). Za kanal širine dna B s ukupnim protokom Q približno q<sub>t</sub> &asymp; Q / B, ili ga izračunajte iz uvjeta kritične dubine pri ulazu u žlijeb.';
$ec_lang['rc_notes_3_term']='Protok kroz kameni plašt';
$ec_lang['rc_notes_3_def']='Dio ukupnog protoka prolazi kroz pore kamenog obloga (protok kroz plašt q<sub>m</sub>); ostatak teče po površini kamena (q<sub>s</sub> = q<sub>t</sub> &minus; q<sub>m</sub>). Dubina toka d izračunava se Manningovom jednadžbom primijenjenom na površinski protok q<sub>s</sub> s koeficijentom hrapavosti žlijeba n. Zadana poroznost n<sub>p</sub> = 0,45 tipična je za uglati drobljeni kamen.';
$ec_lang['rc_notes_5_term']='Važeći raspon veličine kamena';
$ec_lang['rc_notes_5_def']='Jednadžbe su razvijene za raspon D<sub>50</sub> od 15&nbsp;mm do 278&nbsp;mm. Rezultati izvan ovog raspona su ekstrapolacija i trebaju se koristiti uz dodatnu inženjersku prosudbu.';
$ec_lang['rc_notes_6_term']='Kota izlazne ploče';
$ec_lang['rc_notes_6_def']='Kota vrha obloga u izlaznom dijelu treba biti na razini ili ispod kote dna nizvodnog kanala. Ako je viša — izlazni kamen bit će nestabilan.';
$ec_lang['rc_notes_7_term']='Provjera zadržavanja vode na ulazu';
$ec_lang['rc_notes_7_def']='Kada je normalna dubina u ulaznom kanalu manja od tlaka na pragu (H<sub>p</sub>) potrebnog za propuštanje q<sub>t</sub>, iznad ulazne ploče dolazi do sužavanja toka ili zadržavanja vode. To je u pravilu prihvatljivo — zadržavanje vode smanjuje brzinu i sprječava eroziju uzvodno. Za provjeru: koristite kalkulator za preljevicu, pronađite H<sub>p</sub> za zadane q<sub>t</sub> i širinu grebena, a zatim usporedite s normalnom dubinom ulaznog kanala. Ako H<sub>p</sub> premašuje normalnu dubinu, doći će do zadržavanja vode.';
$ec_lang['rc_notes_4_term']='Izvor';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). &ldquo;<a target="_blank" href="https://doi.org/10.13031/2013.17230">Design of rock chutes</a>.&rdquo; <em>Transactions of the ASAE</em>, 41(3), 621&ndash;626. USDA ARS također objavljuje <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel tablicu</a> temeljenu na istoj metodi.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Filter';
$ec_lang['rc_sketch_top_crest_curve'] = 'Ulazni luk';
$ec_lang['rc_sketch_outlet_apron']    = 'Izlazna ploča';
$ec_lang['rc_sketch_radius']          = 'polumjer';
