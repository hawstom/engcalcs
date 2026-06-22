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
$ec_lang['odt_h1_elev']='Početna kota razine vode';
$ec_lang['odt_a1']='Početna površina jezerca ili bazena, A1';
$ec_lang['odt_h2_elev']='Završna kota razine vode';
$ec_lang['odt_h_orifice']='Kota težišta otvora';
$ec_lang['odt_a0']='Površina jezerca ili bazena na koti otvora, A0';
$ec_lang['odt_a_ending']='Završna površina jezerca, A2 (interpolirano)';
$ec_lang['odt_h2_check']='Provjera završne kote';
$ec_lang['odt_h2_ok']='Završna kota iznad gornjeg ruba otvora ✓';
$ec_lang['odt_h2_warn']='Upozorenje: završna kota na razini ili ispod gornjeg ruba otvora (težište + D/2)';
$ec_lang['odt_d']='Promjer otvora (kružni) ili visina (pravokutni), D';
$ec_lang['odt_w']='Širina otvora, W (samo pravokutni)';
$ec_lang['odt_t_sec']='Vrijeme pražnjenja (sekunde)';
$ec_lang['odt_t_min']='Vrijeme pražnjenja (minute)';
$ec_lang['odt_t_hr']='Vrijeme pražnjenja (sati)';
$ec_lang['odt_t_day']='Vrijeme pražnjenja (dani)';
$ec_lang['odt_notes_1_term']='Formula';
$ec_lang['odt_notes_1_def']='t = &radic;H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> &radic;(2g)) &times; (2A<sub>x</sub>/5 + 8&radic;(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) daje vrijeme pražnjenja od visine H do otvora. Vrijeme pražnjenja = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) &minus; t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), gdje je H<sub>1</sub> = početna kota &minus; kota otvora, H<sub>2</sub> = završna kota &minus; kota otvora.';
$ec_lang['odt_notes_2_term']='Metoda';
$ec_lang['odt_notes_2_def']='Metoda koničnog volumena modelira jezerce ili bazen kao konični presjek između početne površine A<sub>1</sub> na početnoj razini vode i površine A<sub>0</sub> na koti težišta otvora. A<sub>2</sub>, površina jezerca na završnoj koti, interpolira se iz A<sub>1</sub> i A<sub>0</sub> pomoću modela koničnog presjeka. Vrijeme pražnjenja od početne do završne kote jednako je ukupnom vremenu pražnjenja od H<sub>1</sub> do otvora minus preostalo vrijeme pražnjenja od H<sub>2</sub> do otvora.';
$ec_lang['odt_h1']='Početna visina, H<sub>1</sub> (WSE &minus; težište)';
$ec_lang['odt_q_max']='Maksimalni (početni) protok, Q<sub>max</sub>';
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
$ec_lang['template_welcome']='&gt;&gt; Ostavite strahove na ulazu; ovdje se govori ljubav. Uživajte u <a href="https://hawsedc.com/download.php">besplatnim HawsEDC AutoCAD alatima</a> također. &lt;&lt;';
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
$ec_lang['points_data_help']='(ili Kopiraj/Zalijepi pomoću područja podataka)';
$ec_lang['points_data_title']='Podaci točaka<br />(odvojeni zarezom ili tabulatorom)';
$ec_lang['points_data_copy']='Kopiraj';
$ec_lang['points_data_paste']='Zalijepi';

// Darcy-Weisbach
$ec_lang['dw_main_menu']='Darcy-Weisbach gubitak tlaka u cijevi';
$ec_lang['dw_main_title']='Besplatni online kalkulator Darcy-Weisbach gubitka tlaka u cijevi';
$ec_lang['dw_main_desc']='Darcy-Weisbach gubitak tlaka u cijevi pri zadanom promjeru, hrapavosti i protoku';
$ec_lang['dw_roughness']='Darcy-Weisbach apsolutna hrapavost, e';
$ec_lang['dw_kinematic_viscosity']='Kinematička viskoznost, v, u m<sup>2</sup>/s (1E-6 za čistu vodu na sobnoj temperaturi)';
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
$ec_lang['mpf_note_1']='<dl><dt>Ovo je protok i dubina unutar <em>beskonačno dugačke</em> cijevi.</dt><dd>Uvođenje protoka u cijev može zahtijevati znatno veću dubinu uzvodne vode. Dodajte najmanje 1,5 puta energetsku visinu za dobivanje dubine uzvodne vode ili <a href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">pogledajte moj 2-minutni tutorial</a> za standardne proračune uzvodne razine propusta pomoću HY-8.</dd>';
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
$ec_lang['mphl_note_1']='<dl><dt>Za uvjete otvorenog ulaza (propust) potrebno je provjeriti uvjete kontrole ulaza.</dt><dd>1. Uzvodni HGL ne može biti niži od kote normalnog tečenja uzvodnog toka (niti niži od cijevi!).</dd><dd>2. Uzvodna razina propusta bolje je predstavljena uzvodnim EGL-om nego uzvodnim HGL-om.</dd><dd>3. Pogledajte <a href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">moj 2-minutni tutorial</a> za jednostavne standardne proračune uzvodne razine propusta pomoću HY-8.</dd>';

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
$ec_lang['mtc_d50_bottom']='Potrebna veličina uglatog kamena dna, D50 (Isbash i MC) <a href="javascript:alert(\'Prema Isbash (1936) i Maricopa County, Arizona, US.\')">?</a>';
$ec_lang['mtc_d50_z1']='Potrebna veličina uglatog kamena bočne strane 1, D50 (Isbash i MC) <a href="javascript:alert(\'Prema Isbash (1936) i Maricopa County, Arizona, US.\')">?</a>';
$ec_lang['mtc_d50_z2']='Potrebna veličina uglatog kamena bočne strane 2, D50 (Isbash i MC) <a href="javascript:alert(\'Prema Isbash (1936) i Maricopa County, Arizona, US.\')">?</a>';
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
$ec_lang['or_velocity']='Brzina na otvoru, v';

// Erosion Setback and Scour Calc.
$ec_lang['essc_btbw']='Širina od obale do obale';
$ec_lang['essc_mcr']='Minimalni radijus krivine';
$ec_lang['essc_q']='Protok, Q';

// Contact us
$ec_lang['contact_title']='HawsEDC Kontakt';
$ec_lang['contactSendMessage']='Pošaljite poruku Tomu Hawsu';
$ec_lang['contactYourName']='Vaše ime:';
$ec_lang['contactYourEmail']='Vaša e-mail adresa:';
$ec_lang['contactSubject']='Predmet:';
$ec_lang['contact_message']='Poruka:';
$ec_lang['contactSpamPrefix']='Pet plus jedan jednako';
$ec_lang['contactSpamPostfix']='(Molimo napišite slovima. 1=jedan 2=dva 3=tri 4=četiri 5=pet 6=šest 7=sedam +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Pošalji poruku';

// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Mala hidroelektrana';
$ec_lang['mhp_main_title']='Besplatni online kalkulator za malu hidroelektranu';
$ec_lang['mhp_main_desc']='Kalkulator izlazne snage male hidroelektrane protočnog tipa';
$ec_lang['mhp_flow']='Protok, Q';
$ec_lang['mhp_gross_head']='Bruto pad (razlika nadmorskih visina), H<sub>gross</sub>';
$ec_lang['mhp_head_loss']='Gubici pada u dovodnom cjevovodu, h<sub>L</sub>';
$ec_lang['mhp_efficiency']='Iskoristivost postrojenja, &eta; (0&ndash;1)';
$ec_lang['mhp_net_head']='Neto pad, H<sub>net</sub>';
$ec_lang['mhp_power']='Izlazna snaga, P';
$ec_lang['mhp_annual_kwh']='Godišnja energija pri 100% kapaciteta';
$ec_lang['mhp_notes_1_term']='Jednadžba snage';
$ec_lang['mhp_notes_1_def']='P = &eta; &times; &rho; &times; g &times; Q &times; H<sub>net</sub>, gdje &rho; = 1000 kg/m&sup3; (slatka voda) i g = 9,806 m/s&sup2;.';
$ec_lang['mhp_notes_2_term']='Neto pad';
$ec_lang['mhp_notes_2_def']='Neto pad = bruto pad &minus; gubici pada u dovodnom cjevovodu. Uobičajena prva procjena je h<sub>L</sub> &asymp; 5% od H<sub>gross</sub>. Koristite <a href="Darcy-Weisbach.php">Darcy-Weisbach kalkulator</a> za preciznije procjene gubitaka u cjevovodu.';
$ec_lang['mhp_notes_3_term']='Iskoristivost';
$ec_lang['mhp_notes_3_def']='Tipična iskoristivost postrojenja &eta; kreće se od 0,70 do 0,85 za Pelton i poprečno-protočne turbine uobičajene u maloj hidroenergetici. Koristite 0,75 kao konzervativnu početnu procjenu.';
$ec_lang['mhp_notes_4_term']='Godišnja energija';
$ec_lang['mhp_notes_4_def']='Godišnja energija pretpostavlja neprekidan rad pri punom protoku (8760 sati/god). Stvarna proizvodnja bit će manja zbog sezonskih varijacija protoka, zastoja zbog održavanja i faktora opterećenja.';
// Penstock Design
$ec_lang['ps_main_menu']='Projektiranje dovodne cijevi';
$ec_lang['ps_main_title']='Besplatni online kalkulator dovodne cijevi';
$ec_lang['ps_main_desc']='Dimenzioniranje dovodne cijevi mikro-hidro — Gubitak tlaka, snaga i brzina';
$ec_lang['ps_flow']='Protok, Q';
$ec_lang['ps_gross_head']='Bruto tlačna visina, H<sub>gross</sub>';
$ec_lang['ps_diameter']='Promjer dovodne cijevi, D';
$ec_lang['ps_length']='Duljina dovodne cijevi, L';
$ec_lang['ps_roughness']='Hrapavost cijevi, e';
$ec_lang['ps_km']='Koeficijent lokalnih gubitaka, k<sub>m</sub>';
$ec_lang['ps_nu']='Kinematička viskoznost, &nu;, u m<sup>2</sup>/s (1E-6 za vodu blizu 20&deg;C)';
$ec_lang['ps_efficiency']='Stupanj korisnog djelovanja postrojenja, &eta; (0&ndash;1)';
$ec_lang['ps_velocity']='Brzina tečenja, v';
$ec_lang['ps_vel_check']='Provjera brzine';
$ec_lang['ps_f']='Koeficijent trenja, f';
$ec_lang['ps_hf']='Gubitak tlačne visine trenjem, h<sub>f</sub>';
$ec_lang['ps_hm']='Lokalni gubitak tlačne visine, h<sub>m</sub>';
$ec_lang['ps_hl']='Ukupni gubitak dovodne cijevi, h<sub>L</sub>';
$ec_lang['ps_hl_check']='Provjera gubitka tlačne visine';
$ec_lang['ps_hnet']='Neto tlačna visina, H<sub>net</sub>';
$ec_lang['ps_power']='Izlazna snaga, P';
$ec_lang['ps_annual_kwh']='Godišnja energija pri 100% kapaciteta';
$ec_lang['ps_vel_ok']='1–3 m/s — unutar ciljnog raspona ✓';
$ec_lang['ps_vel_low']='ispod 1 m/s — povećajte promjer ⚠';
$ec_lang['ps_vel_high']='iznad 3 m/s — smanjite promjer ⚠';
$ec_lang['ps_hl_ok']='unutar ciljnih 10% ✓';
$ec_lang['ps_hl_warn']='prelazi cilj od 10% — razmotriti veću cijev ⚠';
$ec_lang['ps_hl_bad']='prelazi 20% — redimenzionirati cijev';
$ec_lang['ps_notes_1_term']='Gubitak tlačne visine';
$ec_lang['ps_notes_1_def']='Ukupni gubitak h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, gdje je h<sub>f</sub> = f(L/D)(v&sup2;/2g) gubitak trenjem prema Darcy-Weisbachu, a h<sub>m</sub> = k<sub>m</sub>&middot;v&sup2;/2g uključuje ulaz, koljena i ventile. Neto visina H<sub>net</sub> = H<sub>gross</sub> &minus; h<sub>L</sub>.';
$ec_lang['ps_notes_2_term']='Brzina';
$ec_lang['ps_notes_2_def']='Cilj 1&ndash;3 m/s. Ispod 1 m/s cijev je predimenzionirana; iznad 3 m/s rastu gubici trenjem i rizik od vodnog udara.';
$ec_lang['ps_notes_3_term']='Ciljni gubitak tlačne visine';
$ec_lang['ps_notes_3_def']='Gubici u dovodnoj cijevi ispod 10% bruto visine su ekonomični. Optimalni kompromis između cijene cijevi i izgubljene snage obično je oko 4&ndash;6% za objekte s visoko vrijednom električnom energijom.';
$ec_lang['ps_notes_4_term']='Lokalni gubici k<sub>m</sub>';
$ec_lang['ps_notes_4_def']='Tipične vrijednosti: oštar ulaz 0.5, svako koljeno 45&deg; između 0.2&ndash;0.3, zaporni ventil (potpuno otvoren) 0.1, leptirasti ventil 0.2. Zbroj svih fitinga daje ukupni k<sub>m</sub>. Zadana vrijednost 1.5 pretpostavlja jedan ulaz i dva koljena.';
$ec_lang['ps_notes_5_term']='Hrapavost cijevi e';
$ec_lang['ps_notes_5_def']='Tipična apsolutna hrapavost: čelik (nov) 0.046&nbsp;mm, čelik (rabljeni) 0.15&nbsp;mm, HDPE 0.003&nbsp;mm, PVC/uPVC 0.0015&nbsp;mm, beton 0.3&ndash;3&nbsp;mm. HDPE je uobičajen za male dovodne cijevi mikro-hidro sustava.';
