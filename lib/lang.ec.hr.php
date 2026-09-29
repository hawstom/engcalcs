<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='udio';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/s';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% uspon/horizontala';
$ec_lang['u_grade']='uspon/horizontala';
$ec_lang['u_in2']='sq. in.';
$ec_lang['u_inh2o']='in H2O';
$ec_lang['u_in']='in';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='L/s';
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
$ec_lang['u_bar']='bar';
$ec_lang['u_kgfcm2']='kgf/cm^2';
$ec_lang['u_s']='s';
$ec_lang['u_hr']='h';
$ec_lang['u_day']='dan';
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
$ec_lang['menu_brand']='HawsEDC Kalkulatori';
$ec_lang['menu_main_hydraulics']='Hidraulika';
$ec_lang['menu_help']='Pomoć';
$ec_lang['menu_libre']='Slobodni softver';
$ec_lang['template_welcome']='Ostavite strahove na ulazu; ovdje se govori ljubav. Ne kvarite sve. Uživajte u <a target="_blank" href="https://hawsedc.com/download.php">besplatnim HawsEDC AutoCAD alatima</a> također.';
$ec_lang['template_feedback']='Možete li predložiti bolju formulaciju ovog teksta ili nešto drugo? Želite li pomoći ili naučiti izrađivati ovakve alate? Javite mi se.';
$ec_lang['template_printable_title']='Naslov za ispis';
$ec_lang['template_printable_subtitle']='Podnaslov za ispis';
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
$ec_lang['consent_body']='Smijemo li zadržati jednu znamenku po stranici u pohrani ovog profila preglednika kako bismo spriječili ponovljeno bilježenje njegovih posjeta?';
$ec_lang['consent_accept']='Prihvati ovo';
$ec_lang['consent_accept_all']='Prihvati uvijek';
$ec_lang['consent_decline']='Odbij uvijek';
$ec_lang['consent_current_granted']='Dopustili ste ovo. Ograničavamo bilježenje za ovaj profil preglednika.';
$ec_lang['consent_current_denied']='Odbili ste ovo. Ne pohranjujemo ništa za ograničavanje bilježenja za ovaj profil preglednika.';
$ec_lang['consent_region_label']='Vaš izbor o ograničavanju bilježenja.';
$ec_lang['consent_settings_link']='Postavke kolačića';
$ec_lang['privacy_link']='Obavijest o privatnosti';
$ec_lang['terms_link']='Uvjeti korištenja';
$ec_lang['index_main_title']='Besplatni online inženjerski kalkulatori';
$ec_lang['index_meta_desc_plain']='Besplatni hidrotehnički kalkulatori za cijevi, kanale, preljeve i navodnjavanje. Rade u vašem pregledniku, funkcioniraju bez interneta i dostupni su na 27 jezika.';
$ec_lang['calc_set_units']='Postavi jedinice:';
$ec_lang['calc_set_units_tip']='Postavlja jedinicu za sva polja odjednom. Nedestruktivno: brojevi koje ste upisali ostaju točno onakvi kakvi jesu, a svaki se sada čita u novoj jedinici. 6 ostaje 6, ali sada znači 6 inča umjesto 6 milimetara.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Vrati zadane vrijednosti';
$ec_lang['calc_defaults_confirm']='Resetiraj kalkulator na izvorne zadane vrijednosti?';
$ec_lang['points_data_note']='(ili Kopiraj/Zalijepi pomoću područja podataka)';
$ec_lang['points_data_heading']='Podaci točaka<br />(odvojeni zarezom ili tabulatorom)';
$ec_lang['points_data_copy']='Kopiraj';
$ec_lang['points_data_paste']='Zalijepi';
$ec_lang['calc_inputs']='Unosi';
$ec_lang['calc_results']='Rezultati';
$ec_lang['view_hide_line']='Sakrij ovaj redak';
$ec_lang['view_printable']='Verzija za ispis (osvježite stranicu za povratak)';
$ec_lang['ec_name_label']='Spremi ovaj izračun:';
$ec_lang['ec_name_placeholder']='Naziv';
$ec_lang['ec_name_tip']='Sprema ove unesene vrijednosti u URL za zabilješke, preuzimanje iz povijesti i zajedničko korištenje';
$ec_lang['calc_copy_link']='Kopiraj poveznicu';
$ec_lang['ec_related_calcs']='Povezani kalkulatori:';
$ec_lang['calc_copy_link_done']='Kopirano!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Darcy-Weisbach gubitak tlačne visine u cijevi';
$ec_lang['dw_main_title']='Besplatni online kalkulator Darcy-Weisbach gubitka tlačne visine u cijevi';
$ec_lang['dw_main_desc']='Darcy-Weisbach gubitak tlačne visine u cijevi pri zadanom promjeru, hrapavosti i protoku';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Apsolutna visina hrapavosti, e, stijenke cijevi. Tipične vrijednosti: čelik (novi) 0,046 mm, čelik (rabljeni) 0,15 mm, HDPE 0,003 mm, PVC/uPVC 0,0015 mm, beton 0,3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s za čistu vodu pri 20°C">Kinematička viskoznost, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Kinematička viskoznost, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s za čistu vodu pri 20°C';
$ec_lang['dw_reynolds_number']='Reynoldsov broj, Re';
$ec_lang['dw_flow_regime']='Režim tečenja';
$ec_lang['dw_regime_laminar']='laminarno';
$ec_lang['dw_regime_transitional']='prijelazno';
$ec_lang['dw_regime_turbulent']='turbulentno';
$ec_lang['dw_friction_factor_method']='Metoda faktora trenja';
$ec_lang['dw_friction_factor']='Faktor trenja, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Hazen-Williams gubitak tlačne visine u cijevi';
$ec_lang['hw_main_title']='Besplatni online kalkulator Hazen-Williams gubitka tlačne visine u cijevi';
$ec_lang['hw_main_desc']='Hazen-Williams gubitak tlačne visine u cijevi pri zadanom promjeru, Hazen-Williams koeficijentu C i protoku';
$ec_lang['hw_hgl_1']='Nizvodni HGL';
$ec_lang['hw_hgl_2']='Uzvodni HGL';
$ec_lang['hw_elev_up']='Uzvodna kota';
$ec_lang['hw_pressure_up']='Uzvodni tlak';
$ec_lang['hw_elev_down']='Nizvodna kota';
$ec_lang['hw_pressure_down']='Nizvodni tlak';
$ec_lang['hw_pressure_check']='Provjera tlaka';
$ec_lang['hw_pressure_ok_short']='Pozitivan tlak';
$ec_lang['hw_pressure_neg_short']='Negativan tlak';
$ec_lang['hw_pressure_neg']='Nizvodni tlak je ispod nule. Hidraulička linija (HGL) pada ispod cijevi, pa cijev ne bi tekla puna i ovaj rezultat možda nije valjan.';
$ec_lang['hw_roughness']='Hazen-Williams koeficijent, C';
$ec_lang['hw_note_1']='<dl><dt>Ovaj kalkulator ne modelira profil cijevi između dva kraja.</dt><dd>Koristi samo uzvodnu i nizvodnu kotu koje unesete. Ako teren negdje između ta dva kraja raste više od bilo kojeg od njih, tlak na toj najvišoj točki niži je od bilo kojeg tlaka prikazanog ovdje. Pokrenite kalkulator ponovno za dužinu od uzvodnog kraja do najviše točke kako biste to provjerili.</dd><dd>Tamo gdje hidraulička linija (HGL) padne ispod cijevi, voda je pod negativnim tlakom. Zrak izlazi iz otopine, tankostjena cijev može se urušiti, a onečišćena podzemna voda može se uvući kroz spojeve. Održavajte pozitivan tlak u cijeloj dionici i razmotrite ugradnju zračnog ventila na svakoj visokoj točki.</dd><dt>Uzvodni tlak je rubni uvjet koji sami unosite.</dt><dd>Očitajte ga s manometra, s razine vode u spremniku (visina vode iznad cijevi) ili s krivulje pumpe. Pumpa isporučuje niži tlak kako protok raste, stoga koristite točku na krivulji koja odgovara protoku unesenom iznad.</dd><dt>Zbrojite koeficijente lokalnih (manjih) gubitaka sami.</dt><dd>Zbrojite K vrijednosti za svaki ventil, koljeno, T-komad, mjerač i ulaz na dionici i unesite taj zbroj. Slijedite poveznicu uz to polje za tipične vrijednosti. Na dugom transportnom cjevovodu ti su gubici mali u odnosu na trenje, ali u kratkim cjevovodima unutar postrojenja mogu činiti većinu ukupnog gubitka.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Manning kanal nepravilnog presjeka';
$ec_lang['mi_main_title']='Besplatni online Manningov kalkulator za kanal nepravilnog presjeka';
$ec_lang['mi_main_desc']='Kalkulator jednolikog tečenja u kanalu nepravilnog presjeka prema Manningu';
$ec_lang['mi_waterSurfaceElevation']='Kota razine vode';
$ec_lang['mi_q_617']='<span class="ec-help" title="Složeni protok Q, uz složeni n za svako područje prema Chow 6-17, uz jednake brzine">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Točke poprečnog presjeka';
$ec_lang['mi_groupPoint']='Točka';
$ec_lang['mi_groupSegment']='Segment';
$ec_lang['mi_groupRegion']='Područje';
$ec_lang['mi_station']='Stacionaža';
$ec_lang['mi_elevation']='Kota';
$ec_lang['mi_n']='n<br />za seg-<br />ment';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />granica<br />područja<br />(Obala)';
$ec_lang['mi_tau']='Posmično<br />naprezanje<br />dna τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='Složeni<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='Složeni n';
$ec_lang['mi_notes_1_def']='Ovaj kalkulator slijedi HEC-RAS referentni priručnik u izračunu složenog n za područje prema Chow 1959, str. 136, jednadžba 6-17 (ne 6-18).';


$ec_lang['mi_notes_2_term']='Kamena obloga';
$ec_lang['mi_notes_2_def']='Koristite kalkulator trapezoidnog kanala prema Manningu za projektiranje kamene obloge. Ovaj kalkulator je više namijenjen prirodnim presjecima.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning protok kroz cijev';
$ec_lang['mpf_main_title']='Besplatni online kalkulator Manning protoka kroz cijev';
$ec_lang['mpf_main_desc']='Manning formula — jednolik protok kroz cijev pri zadanom nagibu i dubini';
$ec_lang['mpf_pipe_diameter']='Promjer cijevi, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Manningov koeficijent hrapavosti, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Nagib trenja, S<sub>f</sub></a><span class="ec-help" title="Ponekad jednak nagibu cijevi. Slijedite poveznicu za objašnjenje (samo na engleskom)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Relativna dubina toka, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Protok, Q';
$ec_lang['mpf_flow_tip']='Protok i dubina izračunati su za beskonačno dugu cijev. Za postizanje ovog protoka pri ulazu u cijev možda će biti potrebna veća dubina uzvodne vode. Pojedinosti i video s uputama potražite u Napomenama u nastavku.';
$ec_lang['mpf_velocity']='Brzina, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Kinetička energija izražena kao visina vodenog stupca, v²/2g">Brzinska visina, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Površina toka, A';
$ec_lang['mpf_pipe_area']='Površina cijevi, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Relativna površina, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Močeni opseg, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Hidraulički polumjer, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Gornja širina, T';
$ec_lang['mpf_froude_number']='Froudeov broj, Fr';
$ec_lang['mpf_shear_stress']='Prosječno posmično naprezanje, τ';
$ec_lang['mpf_full_flow']='Puni protok, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Omjer prema punom protoku, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Ovo je protok i dubina unutar <em>beskonačno dugačke</em> cijevi.</dt><dd>Uvođenje protoka u cijev može zahtijevati znatno veću dubinu uzvodne vode. Dodajte barem 1,5 puta brzinsku visinu za procjenu dubine uzvodne vode, ili <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">pogledajte moj 2-minutni tutorial</a> za standardne proračune uzvodne razine propusta pomoću <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, besplatnog programa za propuste Savezne uprave za autoceste SAD-a (U.S. Federal Highway Administration).</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Projektirate sanitarnu kanalizaciju?</dt><dd>Pogledajte <a target="_blank" href="/sewslope.php">tablice minimalnog nagiba kanalizacije</a> za cijevi od 4 do 96 inča (100 do 2400 mm), izražene u m/m, mm/m i postotku, te studiju <a target="_blank" href="/peakfact.php">faktora vršnog opterećenja za vrlo male protoke</a>. Oba dokumenta dostupna su samo na engleskom jeziku.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Unesite pozitivan ciljani Q.';
$ec_lang['mpf_solver_no_solution']='Nema rješenja: Q premašuje kapacitet cijevi pri y/d0 = 93.8% (Qmax = {qmax} u odabranim jedinicama).';
$ec_lang['mpf_solve_btn']='Izračunaj';
$ec_lang['mpf_solve_for_flow']='za protok, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Manning gubitak tlačne visine u cijevi';
$ec_lang['mphl_main_title']='Besplatni online kalkulator Manning gubitka tlačne visine u cijevi';
$ec_lang['mphl_main_desc']='Manning formula — gubitak tlačne visine pri zadanom punom protoku';
$ec_lang['mphl_pipe_length']='Duljina cijevi, L';
$ec_lang['mphl_area']='Površina, A';
$ec_lang['mphl_total_junction_k']='Koeficijent manjeg (lokalnog) gubitka, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Koeficijent gubitka, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Koeficijent lokalnog gubitka, km. Ovi gubici nastaju na spojevima cijevi, na ulazima, izlazima, koljenima i ventilima — naziv „manji” gubici uobičajen je, ali zavarava, jer na kratkoj dionici cjevovoda mogu biti jednaki gubicima trenja ili ih premašiti. Tipične vrijednosti k: oštar ulazni otvor 0,5, svako koljeno od 45° 0,2–0,3, zasunski ventil (potpuno otvoren) 0,1, leptirasti ventil 0,2, izlaz (u spremnik ili atmosferu) 1,0. Zbrojite sve fitinge za ukupni km. Zadana vrijednost 2,0 pretpostavlja jedan ulaz, jedan izlaz i dva koljena od 45°.';
$ec_lang['mphl_friction_slope']='Nagib trenja';
$ec_lang['mphl_friction_loss']='Gubitak trenja, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Manji (lokalni) gubitak, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Ukupni gubitak, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='Nizvodni EGL';
$ec_lang['mphl_egl_2']='Uzvodni EGL';
$ec_lang['mphl_hgl_egl_tip']='Ovaj rezultat možda nije valjan ondje gdje cijev raste iznad hidrauličke linije (HGL).';
$ec_lang['mphl_note_1']='<dl><dt>Ovaj kalkulator ne modelira profil cijevi između dva kraja.</dt><dd>Ako HGL na bilo kojoj točki padne ispod vrha cijevi, ovaj proračun možda nije valjan.</dd><dt>Za uvjete otvorenog ulaza (propust) potrebno je provjeriti uvjete kontrole ulaza.</dt><dd>1. Uzvodni HGL ne može biti niži od kote normalnog tečenja uzvodnog toka (niti niži od cijevi!).</dd><dd>2. Uzvodna razina propusta bolje je predstavljena uzvodnim EGL-om nego uzvodnim HGL-om.</dd><dd>3. Pogledajte <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">moj 2-minutni tutorial</a> za jednostavne standardne proračune uzvodne razine propusta pomoću <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, besplatnog programa za propuste Savezne uprave za autoceste SAD-a (U.S. Federal Highway Administration).</dd><dd>4. Ova stranica rješava samo slučaj kontrole na izlazu: cijev koja teče puna, gdje nizvodni uvjeti određuju tlačnu visinu. Projektiranje propusta uključuje odluku o tome vlada li kontrola na ulazu ili na izlazu, stoga koristite HY-8 kad god je moguće bilo koje od toga.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Manning trapezoidni kanal';
$ec_lang['mtc_main_title']='Besplatni online kalkulator Manning formule za trapezoidni kanal';
$ec_lang['mtc_main_desc']='Manning formula — jednolik protok u trapezoidnom kanalu pri zadanom nagibu i dubini';
$ec_lang['mtc_bottom_width']='Širina dna, b';
$ec_lang['mtc_side_slope_1']='Nagib bočne strane 1, z<sub>1</sub> (horiz./vert.)';
$ec_lang['mtc_side_slope_2']='Nagib bočne strane 2, z<sub>2</sub> (horiz./vert.)';
$ec_lang['mtc_channel_slope']='Nagib kanala, S';
$ec_lang['mtc_flow_depth']='Dubina tečenja, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Kut zavoja, β</a><span class="ec-help" title="Za dimenzioniranje kamenitog nasipa. Slijedite poveznicu za shemu."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Gustoća u odnosu na vodu. Tipično ≈ 2,65 za drobljeni kamen.">Relativna gustoća kamena, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Projektna veličina kamena, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n iz projektne veličine kamena (Stricklerova metoda)';
$ec_lang['mtc_n_blodgett']='n iz projektne veličine kamena (Blodgettova metoda)';
$ec_lang['mtc_n_bathurst']='n iz projektne veličine kamena (Bathurstova metoda)';
$ec_lang['mtc_n_pi']='n iz projektne veličine kamena (metoda Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett nasuprot Bathurstu';
$ec_lang['mtc_pi_range_check']='P&I provjera raspona';
$ec_lang['mtc_pi_ok']='d50 u P&I rasponu';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Izvan raspona';
$ec_lang['mtc_pi_tip']='Ekstrapolacija izvan raspona podataka od 0,28–0,36 ft na kojem je ova jednadžba razvijena — smatrajte je okvirnom provjerom, a ne osnovom za projektiranje';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Prema Isbash (1936) i Maricopa County, Arizona, US.">Potrebna veličina uglatog kamena dna, D<sub>50</sub> (Isbash i MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Prema Isbash (1936) i Maricopa County, Arizona, US.">Potrebna veličina uglatog kamena bočne strane 1, D<sub>50</sub> (Isbash i MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Prema Isbash (1936) i Maricopa County, Arizona, US.">Potrebna veličina uglatog kamena bočne strane 2, D<sub>50</sub> (Isbash i MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Prema Maynordu, Ruffu i Abtu (1989). U zavoju je kamen dimenzioniran za brzinu u zavoju od 4/3 prosječne brzine, prema California Division of Highways (1970); Maynordova vlastita vrijednost 1,5 primjenjuje se na prirodne kanale.">Potrebna veličina uglatog kamena, D<sub>50</sub> (Maynord, Ruff i Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Potrebna veličina uglatog kamena, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Brzina prihvatljiva za pretpostavke jednolikog tečenja.';
$ec_lang['mtc_vel_low']='Brzina niska — opasnost od sedimentacije.';
$ec_lang['mtc_vel_high']='Brzina je visoka i možda nije realna; provjerite eroziju obloge kanala, dodatnu dubinu u zavojima i gubitak energije na proširenjima ili preprekama.';
$ec_lang['mtc_iteration_tip']='Odaberite opciju hrapavosti (preporučuje se Blodgett–Bathurst) i opciju veličine kamena (preporučuje se Isbash) kako biste automatskom iteracijom dobili jedinstvenu veličinu kamena za željeni protok. Cjeloviti postupak potražite u Napomenama u nastavku, ili unesite vlastitu vrijednost hrapavosti (slijedite poveznicu za smjernice) i zanemarite veličinu kamena kako biste preskočili iteraciju.';
$ec_lang['mtc_note_1']='<dl><dt>Automatizirana iteracija dimenzioniranja kamena i hrapavosti</dt><dd>Odaberite opciju hrapavosti (preporučuje se Blodgett–Bathurst) i opciju projektne veličine kamena (preporučuje se Isbash). Prilagodite dubinu i faktor sigurnosti veličine kamena kako biste postigli željeni protok s jednoličnom veličinom kamena. Svaki put kada promijenite ulazni podatak, kalkulator ponavlja ove korake: 1. Hrapavost se izračunava iz projektne veličine kamena. 2. Vrijednost hrapavosti iz odabrane metode kopira se u polje za unos hrapavosti. 3. Izračunavaju se protok kroz kanal i potrebna veličina kamena. 4. Projektna veličina kamena se prilagođava. 5. Ponavlja se dok pogreška u projektnoj veličini kamena ne postane vrlo mala.</dd><dt>Osnovni kalkulator (bez iteracije)</dt><dd>Unesite željenu vrijednost hrapavosti. Zanemarite područje unosa projektne veličine kamena.</dd></dl>';
$ec_lang['mtc_note_2_term']='Provjera brzine';
$ec_lang['mtc_note_2_def']='Visoka brzina podrazumijeva visoku specifičnu energiju uslijed raspoloživog pada. Ta energija može se brzo izgubiti na proširenjima, zavojima ili preprekama. Provjerite je li to razumno za dano gradilište.';
$ec_lang['mtc_solver_no_solution']='Nije pronađeno rješenje za zadani Q s ovim ulaznim podacima kanala.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Protok preko jednostavnog preljeva';
$ec_lang['ws_main_title']='Besplatni online kalkulator protoka preko jednostavnog preljeva široke krune';
$ec_lang['ws_main_desc']='Kalkulator protoka preko jednostavnog preljeva široke krune';
$ec_lang['ws_weirLength']='Duljina preljeva, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Energija po jedinici težine vode — visina vodenog stupca, a ne tlak">Preljevna visina, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Koeficijent preljeva, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Napomene';
$ec_lang['ws_notes_we_term']='Jednadžba preljeva';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Protok preko preljeva nepravilnog profila';
$ec_lang['wi_main_title']='Besplatni online kalkulator protoka preko segmentiranog preljeva promjenjive dubine i nepravilnog profila';
$ec_lang['wi_main_desc']='Kalkulator protoka preko preljeva nepravilnog profila';
$ec_lang['wi_weirPoints']='Točke preljeva';
$ec_lang['wi_pondingHeight']='Visina uspora';
$ec_lang['wi_incrementalFlow']='Parcijalni protok';
$ec_lang['wi_cumulativeFlow']='Kumulativni protok';
$ec_lang['wi_notes_we_def']='q = ako (length = 0) onda 0 inače ako (slope=0) onda cw*length*d<sub>0</sub><sup>1.5</sup> inače cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) gdje su d<sub>1</sub> i d<sub>0</sub> uvijek pozitivni ili nula';
// Orifice Flow
$ec_lang['or_main_menu']='Protok kroz otvor';
$ec_lang['or_main_title']='Besplatni online kalkulator protoka kroz otvor';
$ec_lang['or_main_desc']='Protok kroz otvor — slobodan ili potopljeni';
$ec_lang['or_shape_circular']='Kružni';
$ec_lang['or_shape_rectangular']='Pravokutni';
$ec_lang['or_diameter']='<span class="ec-help" title="Promjer za kružni oblik; visina za pravokutni oblik">Promjer ili visina, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Samo za pravokutne otvore">Širina, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Dno otvora">Kota dna otvora <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Kota uzvodne razine vode';
$ec_lang['or_twe']='Kota nizvodne razine vode';
$ec_lang['or_cd']='Koeficijent istjecanja, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Kota težišta';
$ec_lang['or_head']='<span class="ec-help" title="Energija po jedinici težine vode — visina vodenog stupca, a ne tlak">Efektivna visina, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Površina otvora, A';
$ec_lang['or_regime']='Provjera režima otvora';
$ec_lang['or_regime_valid']='Slobodni istjecaj';
$ec_lang['or_regime_submerged']='Potopljeni otvor';
$ec_lang['or_regime_submerged_tip']='TWE iznad težišta — režim otvora i dalje vrijedi';
$ec_lang['or_regime_warn']='Izvan režima otvora';
$ec_lang['or_regime_warn_tip']='Uzvodna razina vode ispod tjemena';
$ec_lang['or_regime_twe_above_hwe']='Provjerite unos';
$ec_lang['or_regime_twe_above_hwe_tip']='Nizvodna razina vode (TWE) iznad uzvodne razine vode (HWE)';
$ec_lang['or_notes_1_term']='Jednadžba otvora';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Za slobodni istjecaj: h = HWE − težište. Za potopljeni tok (TWE iznad dna): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Režim otvora';
$ec_lang['or_notes_2_def']='Jednadžbe protoka kroz otvor primjenjuju se kada je uzvodna razina vode iznad tjemena (vrha) otvora. Kada je uzvodna razina vode ispod tjemena, umjesto toga koristite jednadžbu preljeva.';
$ec_lang['or_notes_3_term']='Koeficijent istjecanja';
$ec_lang['or_notes_3_def']='C<sub>d</sub> iznosi otprilike 0,60–0,65 za oštrobridne otvore. Zaobljeni ili uvučeni ulazi imaju druge vrijednosti. Pogledajte <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> ili HEC-RAS Hidraulički referentni priručnik za smjernice.';
$ec_lang['or_notes_4_term']='Potopljenost';
$ec_lang['or_notes_4_def']='Kada je TWE iznad dna otvora, kalkulator automatski primjenjuje jednadžbu potopljenog otvora koristeći h = HWE − TWE. Kada je TWE na razini dna ili ispod nje, pretpostavlja se slobodni istjecaj i h = HWE − težište.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Mala hidroelektrana';
$ec_lang['mhp_main_title']='Besplatni online kalkulator za malu hidroelektranu';
$ec_lang['mhp_main_desc']='Kalkulator izlazne snage male hidroelektrane protočnog tipa';
$ec_lang['mhp_gross_head']='Bruto visinski pad, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Promjer tlačnog cjevovoda (dovodne cijevi)">Promjer dovodne cijevi, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Duljina, L';
$ec_lang['mhp_efficiency']='Učinkovitost postrojenja, η (0–1)';
$ec_lang['mhp_vel_check']='Provjera brzine';
$ec_lang['mhp_hl_check']='Provjera gubitka tlačne visine';
$ec_lang['mhp_hnet']='Neto visinski pad, H<sub>net</sub>';
$ec_lang['mhp_power']='Izlazna snaga, P';
$ec_lang['mhp_annual_kwh']='P kao godišnja energija';
$ec_lang['mhp_vel_low']='Brzina niska — rizik od sedimentacije i usisa zraka.';
$ec_lang['mhp_vel_high']='Brzina visoka — provjerite gubitke pri tranziciji, raspoloživu energiju i rizik od vodnog udara.';
$ec_lang['mhp_vel_ok_short']='U redu';
$ec_lang['mhp_vel_high_short']='Visoka';
$ec_lang['mhp_vel_low_short']='Niska';
$ec_lang['mhp_vel_ok_tip']='Brzina je u učinkovitom rasponu za projektiranje dovodne cijevi.';
$ec_lang['mhp_hl_ok_tip']='Gubitak tlačne visine je manji od 10% bruto tlačne visine. Ova veličina cijevi je ekonomična.';
$ec_lang['mhp_hl_warn_tip']='Gubitak tlačne visine prelazi 10% bruto tlačne visine. Razmislite o većoj cijevi.';
$ec_lang['mhp_hl_bad_tip']='Gubitak tlačne visine prelazi 20% bruto tlačne visine. Prilagodite veličinu cijevi.';
$ec_lang['mhp_notes_1_term']='Gubitak tlačne visine';
$ec_lang['mhp_notes_1_def']='Ukupni gubitak dovodne cijevi h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, gdje je h<sub>f</sub> = f(L/D)(v²/2g) gubitak trenjem prema Darcy-Weisbachu, a h<sub>m</sub> = k<sub>m</sub>·v²/2g obuhvaća ulaz, koljena i ventile. Neto visinski pad H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Brzina';
$ec_lang['mhp_notes_2_def']='Provjerite je li brzina razumna s obzirom na raspoloživi pad i cijenu cijevi. Vrlo niska brzina može upućivati na predimenzioniranu cijev; vrlo visoka brzina može povećati gubitke trenjem i rizik od vodnog udara.';
$ec_lang['mhp_notes_3_term']='Ciljni gubitak tlačne visine';
$ec_lang['mhp_notes_3_def']='Gubici u dovodnoj cijevi ispod 10% bruto visinskog pada uglavnom su ekonomični. Optimalni kompromis između cijene cijevi i izgubljene snage obično je oko 4–6% ondje gdje je električna energija najvrjednija.';
$ec_lang['mhp_notes_6_term']='Učinkovitost';
$ec_lang['mhp_notes_6_def']='Tipična učinkovitost postrojenja η kreće se od 0,70 do 0,85 za Pelton i protočne (cross-flow) turbine uobičajene u malim hidroelektranama. Koristite 0,75 kao konzervativnu prvu procjenu.';
$ec_lang['mhp_notes_7_term']='Godišnja energija';
$ec_lang['mhp_notes_7_def']='Godišnja energija pretpostavlja neprekidan rad pri punom protoku (8760 sati/godišnje). Stvarna proizvodnja bit će niža zbog sezonskih varijacija protoka, zastoja za održavanje i faktora opterećenja.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Vrijeme pražnjenja jezerca i spremnika';
$ec_lang['odt_main_title']='Besplatni online kalkulator vremena pražnjenja jezerca, bazena i spremnika (otvor)';
$ec_lang['odt_main_desc']='Vrijeme pražnjenja jezerca, bazena ili spremnika — izljev kroz otvor, metoda koničnog volumena';
$ec_lang['odt_h1_elev']='Početna kota razine vode';
$ec_lang['odt_a1']='Početna površina, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Završna kota razine vode';
$ec_lang['odt_a0']='Površina na koti otvora, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Interpolirano iz koničnog modela na završnoj koti">Završna površina, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Provjera završne kote';
$ec_lang['odt_h2_ok']='Završna kota iznad gornjeg ruba otvora';
$ec_lang['odt_h2_warn']='Završna kota na razini ili ispod gornjeg ruba otvora';
$ec_lang['odt_h2_warn_tip']='Gornji rub otvora = težište + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Promjer (kružni) ili visina (pravokutni)">D otvora <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Samo za pravokutni oblik">Širina otvora, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Vrijeme pražnjenja (s)';
$ec_lang['odt_t_min']='Vrijeme pražnjenja (min)';
$ec_lang['odt_t_hr']='Vrijeme pražnjenja (h)';
$ec_lang['odt_t_day']='Vrijeme pražnjenja (dana)';
$ec_lang['odt_notes_1_term']='Formula';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) daje vrijeme pražnjenja od visine H do otvora. Vrijeme pražnjenja = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), gdje je H<sub>1</sub> = početna kota − kota otvora, H<sub>2</sub> = završna kota − kota otvora.';
$ec_lang['odt_notes_2_term']='Metoda';
$ec_lang['odt_notes_2_def']='Metoda koničnog volumena modelira jezerce ili bazen kao konični presjek između početne površine A<sub>1</sub> na početnoj razini vode i površine A<sub>0</sub> na koti težišta otvora. A<sub>2</sub>, površina jezerca na završnoj koti, interpolira se iz A<sub>1</sub> i A<sub>0</sub> pomoću modela koničnog presjeka. Vrijeme pražnjenja od početne do završne kote jednako je ukupnom vremenu pražnjenja od H<sub>1</sub> do otvora umanjenom za preostalo vrijeme pražnjenja od H<sub>2</sub> do otvora.';
$ec_lang['odt_h1']='<span class="ec-help" title="Početna kota razine vode umanjena za kotu težišta otvora">Početna visina, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Maksimalni protok, Q<sub>max</sub>';
$ec_lang['odt_vol']='Ispražnjeni volumen';
$ec_lang['odt_sketch_start']='Početak';
$ec_lang['odt_sketch_end']='Kraj';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Razmak emitera, S<sub>e</sub>';
$ec_lang['ip_sl']='Razmak laterala, S<sub>l</sub>';
$ec_lang['ip_n_e']='Emiteri po laterali, n<sub>e</sub>';
$ec_lang['ip_n_l']='Laterale po zoni, n<sub>l</sub>';
$ec_lang['ip_d']='Ciljna dubina navodnjavanja, d';
$ec_lang['ip_a_e']='Površina po emiteru, A<sub>e</sub>';
$ec_lang['ip_pr']='Norma navodnjavanja, PR';
$ec_lang['ip_q_lat']='Protok po laterali, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Protok zone, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Trajanje navodnjavanja (sati)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Procjeđivanje kanala';
$ec_lang['cs_main_title']='Besplatni online kalkulator gubitka procjeđivanjem u kanalu i korisnosti transporta';
$ec_lang['cs_main_desc']='Gubitak procjeđivanjem u kanalu & korisnost transporta — metoda ulaz-izlaz';
$ec_lang['cs_Q_in']='Dotok, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Otjecaj, Q<sub>out</sub>';
$ec_lang['cs_L']='Duljina dionice, L';
$ec_lang['cs_Q_loss']='Stopa gubitka procjeđivanjem, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Provjera mjerenja';
$ec_lang['cs_pct_loss']='Udio gubitka';
$ec_lang['cs_Ec']='Korisnost transporta, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Ocjena korisnosti';
$ec_lang['cs_Vol_day']='Dnevni izgubljeni volumen';
$ec_lang['cs_Vol_year']='Godišnji izgubljeni volumen';
$ec_lang['cs_Q_loss_per_L']='Gubitak po jedinici duljine, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Vrijednost vode';
$ec_lang['cs_lining_cost']='Trošak obloge';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Ciljna korisnost transporta nakon oblaganja; udio 0–1">Ciljna korisnost, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Površina obloge, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Godišnja vrijednost gubitka';
$ec_lang['cs_annual_value_recovered']='Godišnja vrijednost oporavljena';
$ec_lang['cs_lining_total_cost']='Ukupni trošak obloge';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Jednostavna amortizacija = ukupni trošak obloge ÷ godišnja oporavljena vrijednost">Razdoblje amortizacije <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — procjeđivanje otkriveno';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — nema mjerljivog gubitka';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — provjerite mjerenja';
$ec_lang['cs_Ec_good']='Dobro — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Zadovoljavajuće — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Loše — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='Metoda ulaz-izlaz procjenjuje procjeđivanje mjerenjem protoka na početku i kraju dionice kanala: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Korisnost transporta E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Godišnji volumen pretpostavlja neprekidan rad pri punom protoku; stvarni gubitak je manji za sezonske ili kanale s djelomičnim protokom.';
$ec_lang['cs_notes_2_term']='Ocjene korisnosti';
$ec_lang['cs_notes_2_def']='Tipični neobloženi zemljani kanali: E<sub>c</sub> = 60–80%. Dobro održavani zemljani kanali: 75–85%. Betonski obloženi kanali: 90–98%. Gubici procjeđivanjem iznad 30% dotoka često opravdavaju ulaganje u oblogu. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Amortizacija obloge';
$ec_lang['cs_notes_3_def']='Unesite vrijednost vode i trošak obloge u bilo kojoj konzistentnoj valuti. Površina obloge = duljina dionice × omočeni opseg — omočeni opseg kanalne poprečnog presjeka na mjernoj dubini vode (širina dna plus obje omočene padine). Godišnja vrijednost oporavljena pretpostavlja da obloženi kanal dosegne cilj E<sub>c</sub> neprekidno. Stvarna amortizacija bit će duža za sezonske kanale ili ako obloga ne dosegne ciljnu korisnost.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3. izd. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='O nama';
$ec_lang['install_main_menu']='Instaliraj';
$ec_lang['install_main_title']='Instaliraj EngCalcs';
$ec_lang['install_main_desc']='Dodaj na uređaj za korištenje bez interneta';
$ec_lang['install_intro']='EngCalcs je progresivna web aplikacija (PWA). Nakon instalacije svi kalkulatori u potpunosti rade bez interneta — internetska veza nije potrebna.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Otvorite bilo koju stranicu s kalkulatorom u Chromeu.</li><li>Dodirnite gumb <strong>⬇ Instaliraj</strong> na gornjoj navigacijskoj traci ili dodirnite izbornik preglednika (⋮) i odaberite <strong>Dodaj na početni zaslon</strong>.</li><li>Dodirnite <strong>Instaliraj</strong> u prozoru koji se pojavi.</li><li>EngCalcs se pojavljuje na vašem početnom zaslonu i radi bez interneta.</li>';
$ec_lang['install_now_btn']='⬇ Instaliraj sada';
$ec_lang['install_prompt_unavailable']='Poziv za instalaciju nije dostupan — umjesto toga upotrijebite izbornik preglednika.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Otvorite bilo koju stranicu s kalkulatorom u Safariju.</li><li>Dodirnite gumb <strong>Dijeli</strong> (kvadratić sa strelicom prema gore).</li><li>Pomaknite se prema dolje i dodirnite <strong>Dodaj na početni zaslon</strong>.</li><li>Dodirnite <strong>Dodaj</strong>. EngCalcs se pojavljuje na vašem početnom zaslonu.</li>';
$ec_lang['install_ios_note']='Na iOS-u se instalacija uvijek obavlja putem izbornika Dijeli — automatski poziv za instalaciju ne postoji.';
$ec_lang['install_desktop_heading']='Računalo (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Otvorite bilo koju stranicu s kalkulatorom.</li><li>Kliknite <strong>ikonu za instalaciju</strong> (⊕ ili ikonu računala) u adresnoj traci preglednika, ili otvorite izbornik preglednika i odaberite <strong>Instaliraj EngCalcs…</strong></li><li>Kliknite <strong>Instaliraj</strong>. EngCalcs se otvara kao samostalni prozor aplikacije.</li>';
$ec_lang['install_firefox_heading']='Firefox / drugi preglednici';
$ec_lang['install_firefox_body']='Firefox ne podržava instalaciju PWA aplikacija na računalu. Sve kalkulatore i dalje možete koristiti uobičajeno u pregledniku — nakon prvog posjeta stranice se automatski spremaju u predmemoriju za korištenje bez interneta.';
$ec_lang['install_cached_heading']='Što se sprema u predmemoriju';
$ec_lang['install_cached_body']='Prilikom prve instalacije EngCalcs-a sve stranice kalkulatora i njihove prateće datoteke (skripte, stilovi) automatski se spremaju na vaš uređaj. Nakon toga sve radi bez internetske veze. Vaš odabir jezika pamti se od posljednjeg posjeta uz internetsku vezu.';
$ec_lang['contact_main_menu']='Kontakt';
$ec_lang['about_main_title']='O HawsEDC inženjerskim kalkulatorima';
$ec_lang['about_main_desc']='Misija, slobodni softver i doprinosi';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Misija</h3><p>Inženjerski Kalkulatori HawsEDC postoje kako bi služili inženjerima i terenskim radnicima diljem svijeta — posebno onima koji rade u područjima s nedostatkom vode, ograničenim resursima ili slabom pokrivenošću. Ovi alati dio su šire humanitarne misije: reći svakom čovjeku na najpraktičniji i najučinkovitiji mogući način da je voljeni i dragi zauvijek, da nema ničeg za brinuti i da neće sve upropastiti.</p><p>Kalkulatori su sredstvo. Cilj je svijet bez patnje.</p><h3>Licencija slobodnog softvera otvorenog koda</h3><p>Sav kod objavljen je pod <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU Općom Javnom Licencijom v3.0 ili novijom</a> — slobodan u smislu slobode. Kod možete koristiti, proučavati, mijenjati i redistribuirati pod istim uvjetima.</p><p>Ovo je poziv, a ne cijena. Ne postoji plaćena razina, ne postoji besplatna razina koja se može ukinuti, i nema odgode prije nego što kod postane vaš. Puna verzija koju danas vidite besplatna je za sve, sada i zauvijek, za korištenje i mijenjanje.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Izvorni Kod</h3><p>Cjelokupni izvorni kod javno je dostupan na GitHubu:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Tamo možete pregledavati kod, prijaviti probleme ili forknuti repozitorij.</p><h3>Doprinos</h3><p>Svaka pomoć je dobrodošla. <a href="contact.php">Kontaktirajte Toma Hawsa</a>.</p><ul><li><strong>Prijevodi:</strong> Predložite bolju formulaciju. Poboljšajte ili dodajte jezik.</li><li><strong>Prijave grešaka:</strong> Koristite obrazac za povratne informacije na bilo kojoj stranici kalkulatora ili prijavite problem na GitHubu.</li><li><strong>Novi kalkulatori:</strong> Ideje za hidrauličko-inženjerske alate koji služe terenskim radnicima i stručnjacima za navodnjavanje posebno su dobrodošle.</li><li><strong>Hosting:</strong> Ako možete zrcaliti ove kalkulatore za područje s ograničenom povezivošću, javite se.</li></ul><h3>Korištenje bez interneta</h3><p>Ovi kalkulatori rade kao <strong>Progresivna web aplikacija (PWA)</strong>. Posjetite bilo koju stranicu kalkulatora dok ste povezani s internetom i vaš preglednik će automatski pohraniti sve kalkulatore u predmemoriju. Nakon toga svi kalkulatori rade bez interneta — nije potrebna internetska veza.</p><p>Na Androidu ili iOS-u koristite opciju „Dodaj na početni zaslon" u pregledniku kako biste instalirali EngCalcs kao aplikaciju na svom uređaju. Na stolnom računalu potražite ikonu instalacije u adresnoj traci preglednika.</p><p>Možete i pohraniti bilo koji pojedini kalkulator pomoću izbornika „Spremi kao…" u pregledniku za jednokratnu offline upotrebu.</p><h3>Kontakt</h3><p>Tom Haws — hidraulički inženjer i autor ovih kalkulatora.<br />Koristite obrazac za povratne informacije na bilo kojoj stranici kalkulatora ili pristupite izvornom kodu na <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHubu</a>.</p>';
$ec_lang['contactSendMessage']='Pošaljite poruku Tomu Hawsu';
$ec_lang['contactYourName']='Vaše ime:';
$ec_lang['contactYourEmail']='Vaša e-mail adresa:';
$ec_lang['contactSubject']='Predmet:';
$ec_lang['contact_message']='Poruka:';
$ec_lang['contactSpamPrefix']='Pet plus jedan jednako';
$ec_lang['contactSpamPostfix']='(Molimo napišite slovima. 1=jedan 2=dva 3=tri 4=četiri 5=pet 6=šest 7=sedam +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Pošalji poruku';
$ec_lang['contact_success']='Hvala vam što ste si odvojili vremena da napišete.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Projektiranje kamenog žlijeba (Robinson)';
$ec_lang['rc_main_title']='Besplatni online kalkulator za projektiranje kamenog žlijeba — Robinson (1998)';
$ec_lang['rc_main_desc']='Dimenzioniranje kamenitog nasipa za žlijeb — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Nagib dna žlijeba, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Protok po jedinici širine na ulazu u kameni žlijeb. Za kanal širine dna B s ukupnim protokom Q koristite q_t = Q / B.">Ukupni jedinični protok, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Poroznost kamenitog nasipa, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Gustoća u odnosu na vodu. Tipičan drobljeni granit ili bazalt ≈ 2,65. Robinsonov važeći raspon: 2,54 do 2,82.">Relativna gustoća kamena, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Standardna devijacija granulometrijskog sastava. Jednoličan kamen ≈ 1,25. Robinsonov važeći raspon: 1,15 do 1,47.">Gradacija SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Uspor (Hp > yn) je dobar — smanjuje eroziju uzvodno. (USDA)">Normalna dubina u ulaznom kanalu, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Jedn. 1 (S0 < 0,10) ili Jedn. 2 (0,10-0,40). Važeće: D50 15-278 mm, S0 0,02-0,40. Izvan raspona: ekstrapolacija.">Potrebna medijalna veličina kamena, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Primijenjena jednadžba';
$ec_lang['rc_sg_check']='Provjera relativne gustoće';
$ec_lang['rc_SD_check']='Provjera gradacije SD';
$ec_lang['rc_sg_ok']='sg u važećem rasponu';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']='sg ispod Robinsonovog važećeg raspona';
$ec_lang['rc_sg_low_tip']='Važeći raspon: 2,54–2,82';
$ec_lang['rc_sg_high']='sg iznad Robinsonovog važećeg raspona';
$ec_lang['rc_sg_high_tip']='Važeći raspon: 2,54–2,82';
$ec_lang['rc_SD_ok']='SD u važećem rasponu';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']='SD ispod Robinsonovog važećeg raspona';
$ec_lang['rc_SD_low_tip']='Važeći raspon: 1,15–1,47';
$ec_lang['rc_SD_high']='SD iznad Robinsonovog važećeg raspona';
$ec_lang['rc_SD_high_tip']='Važeći raspon: 1,15–1,47';
$ec_lang['rc_layer']='Debljina sloja kamenitog nasipa (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Polumjer krivulje grebena (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Duljina luka krivulje grebena';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Potrebno za konstruktivnu potporu kamena žlijeba. “Minimalna nizvodna dubina vode koja nastaje uslijed otpora izlazne dionice i nizvodnog kanala dovoljna je za osiguranje stabilnosti kamenitog nasipa u izlaznoj dionici.” (Robinson)">Duljina izlazne ploče (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Manningov koeficijent hrapavosti u žlijebu, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Udio qt koji protječe kroz pore kamena. Ostatak qs teče preko površine. Zadana vrijednost np = 0,45 za uglati drobljeni kamen.">Brzina kroz kameni plašt, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Jedinični protok kroz plašt, q<sub>m</sub>';
$ec_lang['rc_qs']='Površinski jedinični protok, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Dubina toka iznad površine kamenitog nasipa, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Uspor (Hp > yn) je dobar — smanjuje eroziju uzvodno. (USDA)">Visina preljeva na ulazu, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Provjera uspora na ulazu';
$ec_lang['rc_pond_ok']='H<sub>p</sub> > y<sub>n</sub> — uspor uzvodno';
$ec_lang['rc_pond_ok_tip']='Uspor uzvodno od ulaza u žlijeb je dobar; smanjuje eroziju uzvodno. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — nema uspora — mogućnost erozije na ulazu';
$ec_lang['rc_pond_warn_tip']='Nema uspora uzvodno od ulaza u žlijeb; može doći do erozije uzvodno. (USDA)';
$ec_lang['rc_eq1']='Jedn. 1 (S<sub>0</sub> < 0,10) — blagi nagib';
$ec_lang['rc_eq2']='Jedn. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — strmi nagib';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — ispod Robinsonovog raspona valjanosti';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — iznad Robinsonovog raspona valjanosti';
$ec_lang['rc_notes_1_term']='Jednadžbe za dimenzioniranje kamena';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) razvili su dvije empirijske jednadžbe za medijalnu veličinu kamenitog nasipa D<sub>50</sub> na temelju nagiba žlijeba i jediničnog protoka. Jednadžba 1 primjenjuje se za blage nagibe (S<sub>0</sub> < 0,10); Jednadžba 2 primjenjuje se za strme nagibe (0,10 ≤ S<sub>0</sub> ≤ 0,40). Obje jednadžbe zahtijevaju q<sub>t</sub> u m²/s i vraćaju D<sub>50</sub> u mm. Validirani raspon je 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Jedinični protok';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> je ukupni jedinični protok pri grebenu žlijeba (ukupni protok po jedinici širine). Za kanal širine dna B s ukupnim protokom Q, približno q<sub>t</sub> ≈ Q / B, ili ga izračunajte iz uvjeta kritične dubine pri ulazu u žlijeb.';
$ec_lang['rc_notes_3_term']='Protok kroz kameni plašt';
$ec_lang['rc_notes_3_def']='Dio ukupnog protoka prolazi kroz pore kamenitog nasipa (protok kroz plašt q<sub>m</sub>); ostatak teče preko površine kamena (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). Dubina toka d izračunava se Manningovom jednadžbom primijenjenom na površinski protok q<sub>s</sub> uz koeficijent hrapavosti žlijeba n. Zadana poroznost n<sub>p</sub> = 0,45 tipična je za uglati drobljeni kamen.';
$ec_lang['rc_notes_5_term']='Važeći raspon veličine kamena';
$ec_lang['rc_notes_5_def']='Jednadžbe su razvijene za raspon D<sub>50</sub> od 15 mm do 278 mm. Rezultati izvan ovog raspona su ekstrapolirani i trebaju se koristiti uz dodatnu inženjersku prosudbu.';
$ec_lang['rc_notes_6_term']='Kota izlazne ploče';
$ec_lang['rc_notes_6_def']='Kota vrha kamenitog nasipa u izlaznoj dionici treba biti na razini ili ispod kote dna nizvodnog kanala. Ako je viša, izlazni kamen bit će nestabilan.';

$ec_lang['rc_notes_7_def']='Kada je normalna dubina u ulaznom kanalu manja od visine preljeva (H<sub>p</sub>) potrebne za propuštanje q<sub>t</sub>, dolazi do ograničenog protoka ili uspora uzvodno od ulaza u žlijeb. To je općenito prihvatljivo — uspor smanjuje brzinu i sprječava eroziju uzvodno. Za provjeru: upotrijebite kalkulator preljeva za pronalaženje H<sub>p</sub> za zadani q<sub>t</sub> i širinu grebena te ga usporedite s normalnom dubinom ulaznog kanala. Ako H<sub>p</sub> premašuje normalnu dubinu, doći će do uspora.';
$ec_lang['rc_notes_4_term']='Izvor';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS također objavljuje <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel tablicu</a> temeljenu na istoj metodi.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Filtar';
$ec_lang['rc_sketch_top_crest_curve']='Krivulja grebena';
$ec_lang['rc_sketch_outlet_apron']    = 'Izlazna ploča';
$ec_lang['rc_sketch_radius']          = 'polumjer';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Navodnjavanje — Tlak';
$ec_lang['ip_main_title']='Besplatni online kalkulator tlaka navodnjavanja i jednolikosti distribucije';
$ec_lang['ip_main_desc']='Tlak u testnoj grani i procijenjena jednolikost';
$ec_lang['ip_h_supply']='Tlak napajanja';
$ec_lang['ip_elev_supply']='Kota napajanja, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Projektni protok emitera, q<sub>design</sub>';
$ec_lang['ip_h_design']='Projektni tlak emitera';
$ec_lang['ip_x']='<span class="ec-help" title="0,5 za standardne nekompenzacijske emitere; blizu 0 za emitere sa kompenzacijom tlaka">Eksponent istjecanja emitera, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Testni put';
$ec_lang['ip_group_reach']='Dionica';
$ec_lang['ip_group_upstream']='Uzvodno';
$ec_lang['ip_group_downstream']='Nizvodno';
$ec_lang['ip_group_loss']='Gubitak';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Označeno: ova dionica je segment testne laterale, s pojedinačnim emiterima. Neoznačeno: ova dionica je glavna, samo prosleđuje protok lateralama koje nisu na testnom putu.">Lat. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Lateralne dionice: emiteri samo u ovoj dionici. Glavne dionice: ukupni emiteri na lateralama DRUGIMA od ove koja se grana iz ove dionice. Za dionicu na mjestu vlastite grane testne laterale, to uključuje i sve laterale dalje dolje po glavnoj cijevi ili koje dijele istu spojnu točku (npr. suprotnu lateralu) — njihov protok se grana iz iste dionice.">Emiteri <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Kota nizvodnog kraja ove dionice. Opcionalno u unutarnjim redacima (zadana vrijednost je ravno / ista kao čvor iznad ako je ostavljeno prazno). Obavezno u zadnjem redu: ta vrijednost je kota zadnjeg emitera, što izravno postavlja tlak opskrbe.">DS Kota <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Kota zadnjeg emitera (zadnji red) je ostala prazna i zadana vrijednost je ravno — unesite je za točan rezultat';
$ec_lang['ip_flow']='Protok';
$ec_lang['ip_press']='Tlak';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Ukupan gubitak dionice, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Nizak/negativan tlak — provjerite subatmosferske uvjete';
$ec_lang['ip_pressure_warn_short']='Nisko';
$ec_lang['ip_pressure_high']='Mjesta s visokim tlakom zahtijevaju smanjenje tlaka';
$ec_lang['ip_pressure_high_short']='Visoko';
$ec_lang['ip_max_head']='Maks. dop. tlak cijevi';
$ec_lang['ip_max_head_tip']='Dionice čiji tlak prelazi ovu vrijednost bit će označene. Ostavite prazno za preskakanje provjere visokog tlaka.';
$ec_lang['ip_h_far']='Tlak zadnjeg emitera';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Protok koji ulazi u modelirani testni put samo, ne u cijelu zonu/sustav — vidi Q_zone u Projektiranju primjene dolje za ukupan sustav.">Protok opskrbe testnog puta, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Protok zadnjeg emitera, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Prosječan protok emitera (testna laterala), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="Za koliko više (ili manje) mislite da u prosjeku ide tipična/prosječna laterala u odnosu na ovu testnu lateralu. Testna laterala je namjerno pretpostavljena kao najgori slučaj, zato je njezina vlastita prosječna vrijednost pristrana-niska zamjena za prosječnu vrijednost polja — ako je postavljena na 0, provjera jednolikosti i brojevi projektiranja primjene dolje koriste vlastitu testne laterale (vjerojatno optimističnu) prosječnu vrijednost kao-je.">Proc. Δtlak, prosječno prema testnoj laterali <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral ponovno evaluiran kod tlaka svakog reda laterale plus unesena razlika tlaka iznad — pokušaj da se ispravi činjenica da je testna laterala pretpostavljena kao najgori slučaj, ne reprezentativna. Hrani i provjeru jednolikosti i odjeljak projektiranja primjene dolje.">Proc. prosječan protok emitera na poljima, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Protok zadnjeg emitera podijeljen s procijenjenim prosječnim protockom emitera na poljima — isti oblik kao udžbenička jednolikost distribucije niske grupe (prosjek niske grupe ÷ srednja vrijednost populacije), ali iz malog modeliranog uzorka i korisničke procijenjene ispravke, a ne iz pune statističke poljske pretrage. Vrijednosti na ili iznad 1 su moguće i nisu greška: to samo znači da zadnji emiter nije najniska točka u odnosu na procijenjeni prosječan na poljima (npr. povoljan padajući sloj, ili je procjena Δtlaka iznad premala).">Provjera jednolikosti, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Tlak testnog emitera ≥ tlak opskrbe. Ovo vjerojatno nije emiter najgorega slučaja, ili bi cijevi mogle biti manje.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Ovo se razlikuje od naše procjene standardne mjere jednolikosti.">Protok zadnjeg emitera ÷ projektni protok, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Nema rješenja: potreban tlak opskrbe premašuje uneseni tlak opskrbe. Povećajte tlak opskrbe, smanjite potražnju ili upotrijebite veću cijev.';
$ec_lang['ip_notes_1_def']='Pogađa tlak u zadnjem (najudaljenijemu) emiteru, zatim ide s Linijom Energetskog Gradijenta prema napajanju, dionicu po dionicu, dodajući trenje i lokalne gubitke duž puta. Elevacija i brzinska energija oduzimaju se na svakom čvoru kako bi se prikazao stvarni tlak tamo. Pogađani tlak na daljnjem kraju se prilagođava (bisekcijom) dok se izračunani potreban tlak opskrbe ne poklopi s unešenim tlakom opskrbe — isti problem zatvorene petlje kojim se bavi rješavač tokova kroz cijev na kalkulatoru Manning Protok kroz cijev, proširena na granajuću mrežu.';
$ec_lang['ip_notes_2_term']='Glavne prema Lateralnim Dionicama';
$ec_lang['ip_notes_2_def']='Svaki red je jedna dionica duž jednog hidraulički najgorega puta (testnog puta) od opskrbe do zadnjeg emitera. Glavna dionica samo prosleđuje protok lateralama koje nisu na testnom putu, tako da se njezin zahvat je obična množenja (projektni protok × ukupan broj emitera te dionice) — nema lokalne osjetljivosti tlaka. Glavna je zajednička veza, tako da dionica na mjestu vlastite grane testne laterale mora uključiti ne samo laterale između vlastitih krajnjih točaka, već i sve laterale koje idu dalje dolje po glavnoj cijevi nakon tog grananja, ili koje dijele istu spojnu točku (npr. suprotnu lateralu) — njihov protok ide kroz tu istu dionicu prije nego se grananje odvoji, bez obzira pojavljuje li se drugdje u ovoj tablici. Lateralna dionica je segment same testne laterale: istjecanje emitera se izračunava iz stvarnog lokalnog tlaka preko q = k·H<sup>x</sup>, a gubitak trenja se smanjuje Christiansenovim F(n) faktorom kako bi se uzelo u obzir smanjenje protoka kako svaki emiter u dionici izvlači svoj dio.';
$ec_lang['ip_notes_3_term']='Ograničenja';
$ec_lang['ip_notes_3_def']='Modelira jedan fiksni tlak opskrbe (nema krivulje pumpe), samo jedan testni put (ne cijelo polje), i 2-parametarsku krivulju emitera (postavite eksponent blizu 0 za približavanje emiteru s kompenzacijom tlaka). Izvještavaju se dva različita omjera jednolikosti, namjerno odvojena: q<sub>last</sub>/q<sub>avg,field</sub> je približna vrijednost standardne jednolikosti distribucije niske grupe (prosjek niske grupe ÷ srednja vrijednost populacije); no ovo dolazi iz malog modeliranog uzorka i korisnički procijenjene ispravke, umjesto iz standardnog punog statističkog uzorka polja. Osim toga, testna laterala je namjerno pretpostavljeni najgori slučaj, pa bi njezin sirovi, neispravljeni prosjek podcijenio stvarni prosjek polja i učinio da jednolikost izgleda bolje nego što jest; unos Δtlaka postoji upravo da se suprotstavi toj pristranosti. Vrijednosti jednolikosti na ili iznad 1 su i dalje moguće: to samo znači da je tlak zadnjeg emitera na ili iznad procijenjenog prosjeka polja, pa je neki drugi emiter točka najniže tlaka. To može biti zato što je zadnji emiter na nižem terenu ili zato što je procjena Δtlaka premala. q<sub>last</sub>/q<sub>design</sub> je drugačija provjera, koja ne mjeri jednolikost, prema proizvođačevu nominalnom protoku — korisna za otkrivanje sustava koji je općenito pod previsokim ili preniskim tlakom, ali to je zasebna provjera koju treba čitati uz broj jednolikosti, jer projektni/nominalni protok ne ovisi o stvarnom prosječnom radnom tlaku sustava.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. ASAE/ASABE standardi za mikro-navodnjavanje koriste isti pristup gubitka trenja s više izlaza.';
$ec_lang['ip_notes_5_term']='Projektiranje Primjene';
$ec_lang['ip_notes_5_def']='Norma primjene i tok sustava/zone koriste procijenjeni prosječan protok emitera na poljima (q<sub>avg,field</sub> — vlastiti prosječan testne laterale, ispravljeni unešenom procjenom Δtlaka), ne pogađan tok: PR = q<sub>avg,field</sub> / A<sub>e</sub>, hranjena ispravljenom modeliranom vrijednosti. Razmak i broji laterala/emitera na razini cijelog sustava su odvojeni unosi jer testni put modelira samo jednu najgoru granu, ne svaku lateralu u poljima.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Razgranata cjevovodna mreža';
$ec_lang['bpn_main_title']='Besplatni online kalkulator tlaka razgranate cjevovodne mreže (bez petlji)';
$ec_lang['bpn_main_desc']='Protok i tlak razgranate (stablaste) cjevovodne mreže';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Statička tlačna visina opskrbe: tlačna visina izvora pri nultom protoku. Razina vode u spremniku ili rezervoaru iznad kote opskrbe, ili visina zatvorenog ventila pumpe (shutoff head). Dodajte točke opskrbe 2 i 3 za definiranje krivulje pumpe ili promjenjive opskrbe; alat čita tlačnu visinu pri projektnom protoku.';
$ec_lang['bpn_elev_source']='Kota opskrbe';
$ec_lang['bpn_q_total']='Ukupni protok';
$ec_lang['bpn_q_total_tip']='Ukupni protok koji izlazi iz izvora (zbroj svih potražnji u mreži).';
$ec_lang['bpn_p_min']='Najniži tlak';
$ec_lang['bpn_p_min_tip']='Najniži nizvodni tlak bilo gdje u mreži; kritična točka isporuke.';
$ec_lang['bpn_method']='Metoda trenja';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Dionice cjevovoda';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Naziv ove dionice cjevovoda. Druge dionice se na nju pozivaju u stupcu Uzvodni ID.';
$ec_lang['bpn_upstream']='Uzvodni ID';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID dionice koja napaja ovu. Ostavite prazno da slijedi dionicu izravno iznad (obična serijska cjevovodna linija). Unesite ID ovdje za grananje s druge dionice.';
$ec_lang['bpn_roughness_tip']='Hrapavost cijevi za odabranu metodu trenja: Manningov koeficijent n, Hazen-Williamsov koeficijent C ili Darcy-Weisbachova visina hrapavosti e (duljina). Tipična glatka plastična cijev: n oko 0,009, C oko 150, e oko 0,0015 mm.';
$ec_lang['bpn_demand']='Potražnja';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Fiksni protok isporučen na nizvodnom kraju ove dionice. Ostavite prazno za dionicu koja samo prenosi protok dalje.';
$ec_lang['bpn_demand_mult']='Množitelj potražnje';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Istovremeno skalira potražnju svih dionica, za proračun vršnog sata ili budućeg rasta. Upotrijebite 1 za unesene potražnje.';
$ec_lang['bpn_elev_down']='NZ kota';
$ec_lang['bpn_q_line']='Protok dionice';
$ec_lang['bpn_q_line_tip']='Ukupni protok koji nosi ova dionica: vlastita potražnja plus svaka nizvodna potražnja koju napaja.';
$ec_lang['bpn_p_down']='NZ tlak';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Manometarski tlak (tlačna visina) na nizvodnom čvoru ove dionice. Negativna vrijednost (označena) znači subatmosferski tlak; provjerite projekt.';
$ec_lang['bpn_sketch_heading']='Dijagram mreže';
$ec_lang['bpn_show_length']='Duljina';
$ec_lang['bpn_show_diameter']='Promjer';
$ec_lang['bpn_show_q']='Protok';
$ec_lang['bpn_show_p']='Tlak';
$ec_lang['bpn_source_label']='Izvor';
$ec_lang['bpn_line_problem']='Ova dionica nije povezana s izvorom: upućuje na nepoznati uzvodni ID, upućuje na samu sebe, ponavlja ID koji već koristi druga dionica, ili tvori petlju. Dionice koje nisu povezane ostaju neriješene.';
$ec_lang['bpn_bad_id_short']='Neispravan ID';


$ec_lang['bpn_pressure_warn']='Nizak/negativan tlak; provjerite subatmosferske uvjete';
$ec_lang['bpn_pressure_warn_short']='Nisko';
$ec_lang['bpn_notes_1_term']='Serijski prema zadanom, grananje po iznimci';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Ostavite Uzvodni ID prazan i dionica slijedi onu iznad; obična serijska cjevovodna linija. Unesite ID uzvodne dionice da se odvojite od nje. Dakle: serijski prema zadanom, stablo kada je potrebno.';
$ec_lang['bpn_notes_2_term']='Samo razgranate mreže, bez petlji';
$ec_lang['bpn_notes_2_def']='Svaka dionica ima točno jednu uzvodnu dionicu (stablo). Ovaj alat ne rješava mreže s petljama; za to su potrebne iterativne metode (EPANET ili slično). Izostavljanje petlji je ono što ovo održava jednostavnim i točnim.';
$ec_lang['bpn_notes_3_term']='Bez aktivnih regulatora tlaka';
$ec_lang['bpn_notes_3_def']='Možete dodati fiksni ventil s lokalnim gubitkom (k-vrijednost), ali ne i ventile za redukciju ili održavanje tlaka (PRV/PSV). Njihovo stanje otvoreno/zatvoreno ovisi o protoku i tlaku, što bi zahtijevalo iteraciju.';


$ec_lang['bpn_supply2_q']='Protok opskrbe 2';
$ec_lang['bpn_supply2_h']='Tlačna visina opskrbe 2';
$ec_lang['bpn_supply3_q']='Protok opskrbe 3';
$ec_lang['bpn_supply3_h']='Tlačna visina opskrbe 3';
$ec_lang['bpn_supply_pt_tip']='Neobavezne točke krivulje opskrbe 2 i 3. Unesite protok i tlačnu visinu za svaku kako biste modelirali pumpu, ili bilo koji izvor čija tlačna visina pada kako isporučuje više; alat čita tlačnu visinu pri projektnom protoku. Točka 1 iznad je statička tlačna visina pri nultom protoku. Ostavite 2 i 3 prazne za konstantnu tlačnu visinu rezervoara.';
$ec_lang['bpn_h_supply']='Tlačna visina opskrbe';
$ec_lang['bpn_h_supply_tip']='Tlačna visina izvora pri projektnom protoku, očitana s krivulje opskrbe. Jednaka unesenoj tlačnoj visini izvora kada je krivulja ravna (rezervoar).';
$ec_lang['bpn_show_elevation']='Kota';
$ec_lang['bpn_supply1_h']='Statička tlačna visina opskrbe';
$ec_lang['lpn_main_menu']='Vodoopskrbna mreža';
$ec_lang['lpn_main_title']='Besplatni online kalkulator vodoopskrbne mreže s EPANET rješavačem';
$ec_lang['lpn_main_desc']='Analiza vodoopskrbne mreže: nacrtajte prstenastu cjevovodnu mrežu ili uvezite EPANET datoteke';
$ec_lang['lpn_title_units']='Jedinice: {units}';
$ec_lang['lpn_tool_select']='Odabir';
$ec_lang['lpn_tool_add_junction']='Čvor';
$ec_lang['lpn_tool_add_reservoir']='Rezervoar';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Spremnik';
$ec_lang['lpn_tool_add_pipe']='Cijev';
$ec_lang['lpn_tool_add_pump']='Pumpa';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Ventil';
$ec_lang['lpn_tool_add_text']='Tekst';
$ec_lang['lpn_tool_vertices']='Točke loma';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Korisnik';
$ec_lang['lpn_tool_add_meter_tip']='Kliknite mjesto na kojem se nalazi korisnik, zatim kliknite cijev ili čvor koji ga opskrbljuje. Potražnja koju dodijelite korisniku dodaje se čvoru na bližem kraju te cijevi.';
$ec_lang['lpn_mode_add_meter']='Način rada: Dodaj korisnika. Kliknite mjesto na kojem se nalazi korisnik, zatim kliknite cijev ili čvor koji ga opskrbljuje. Ili pritisnite Esc za prekid.';
$ec_lang['lpn_pane_tab_customers']='Korisnici';
$ec_lang['lpn_customer_heading']='Korisnik {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Potražnja po priključku';
$ec_lang['lpn_field_meter_demand_tip']='Koliko zahtijeva svaki priključak kod ovog korisnika. Pronađi i zamijeni može iskoristiti razliku između praznog polja i 0.';
$ec_lang['lpn_field_meter_count']='Broj priključaka';
$ec_lang['lpn_field_meter_count_tip']='Koliko istovjetnih priključaka predstavlja ovaj jedan korisnik, tako da četrdeset dva jednoobiteljska priključka duž jednog magistralnog voda mogu biti jedan simbol na jednom mjestu. Zbroj ispod jednak je potražnji iznad pomnoženoj ovim brojem.';
$ec_lang['lpn_field_meter_total']='Ukupna potražnja';
$ec_lang['lpn_field_meter_total_tip']='Potražnja po priključku pomnožena brojem priključaka. To je broj koji se dodaje čvoru navedenom ispod.';
$ec_lang['lpn_field_meter_pipe']='Povezani element';
$ec_lang['lpn_field_meter_pipe_suggest']='Najbliži element je {id}. Upišite ga ovdje da ovaj korisnik bude opskrbljen s njega.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Povezano s';
$ec_lang['lpn_field_meter_node_tip']='Čvor s kojim je ovaj korisnik povezan. Povucite točku povezivanja na cijev da ga umjesto toga opskrbite sa stanice duž te cijevi.';
$ec_lang['lpn_meter_pipe_unknown']='Ništa u ovom projektu nije nazvano {id}, pa je korisnik ostavljen ondje gdje je bio.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='Kako potražnja ovog korisnika raste i pada tijekom pokretanja. Množi ukupnu potražnju, pa djeluje na svaki priključak koji ovaj korisnik predstavlja. Ostavite na Bez obrasca da slijedi Zadani obrazac potražnje projekta.';
$ec_lang['lpn_meter_pattern_unknown']='Nijedan obrazac u ovom projektu nije nazvan {id}, pa je korisnik ostavljen kakav je bio.';
$ec_lang['lpn_meter_placed']='Korisnik {id} dodan. Njegov opis i potražnja upisuju se u tablici Korisnici, ili ga pritisnite u načinu Odabir da otvorite njegov okvir.';
$ec_lang['lpn_field_meter_pipe_tip']='Element na koji se ovaj priključak povezuje. Upišite drugi ovdje ili u tablici Korisnici da ga promijenite, ili povucite točku povezivanja na drugi element.';
$ec_lang['lpn_field_meter_station']='Položaj duž cijevi (%)';
$ec_lang['lpn_field_meter_station_tip']='Koliko daleko duž cijevi se priključak povezuje, kao postotak cijevi od njezinog prvog čvora do drugog. 0 je na jednom kraju, a 100 na drugom. Kružić na cijevi radi isto pomoću pokazivača.';
$ec_lang['lpn_field_meter_offset']='Odmak od cijevi';
$ec_lang['lpn_field_meter_offset_tip']='Pozitivno je desno od cijevi gledajući od njezinog prvog čvora prema drugom. Upisivanje vrijednosti ovdje može premjestiti korisnika na drugu stranu magistrale, a uvijek postavlja priključni vod pod pravim kutom na magistralu.';
$ec_lang['lpn_field_meter_lumped']='Dodano čvoru';
$ec_lang['lpn_field_meter_lumped_tip']='Najbliži čvor; potražnja ovog korisnika se ondje dodaje.';
$ec_lang['lpn_node_customers']='Potražnje korisnika';
$ec_lang['lpn_node_customers_tip']='Popis korisnika dodanih na ovom čvoru (jer je bio najbliži). Potražnje korisnika dodaju se ostalim ovdje navedenim potražnjama. Korisnik se uređuje ondje gdje se nalazi na karti ili u tablici Korisnici.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} od {n} korisnika';
$ec_lang['lpn_customer_detached']='⚠ Ovaj korisnik nije povezan s cijevi, pa njegova potražnja nije uključena u rezultate. Izbrišite ga, ili nacrtajte cijev i premjestite korisnika na nju.';
$ec_lang['lpn_customer_fixed_head']='⚠ Bliži kraj te cijevi ima fiksnu vodenu površinu, pa ova potražnja ne utječe na simulaciju.';
$ec_lang['lpn_customer_detached_count']='{n} korisnika nije povezano s cijevi. Njihova potražnja nije uzeta u obzir.';
$ec_lang['lpn_meter_pick_pipe']='Sada kliknite cijev ili čvor koji opskrbljuje ovog korisnika. Korisnik ostaje ondje gdje ste ga postavili. Pritisnite Escape za prekid.';
$ec_lang['lpn_inp_export_flat_customers']='EPANET datoteka nema korisnike. Potražnja {n} korisnika u ovom projektu upisuje se u datoteku kao redak potražnje na čvoru kojemu je svaki dodan, a svaki redak nazvan je oznakom korisnika. Ono što datoteka ne može sadržavati jest korisnik: gdje se nalazi, koja ga cijev opskrbljuje, gdje duž te cijevi se priključak povezuje, i koliko priključaka jedan korisnik predstavlja. Vaša vlastita projektna datoteka čuva sve to.';

$ec_lang['lpn_area_hint_window_start']='Kliknite jedan kut prozora.';
$ec_lang['lpn_area_hint_window_go']='Kliknite suprotni kut da završite.';
$ec_lang['lpn_area_hint_lasso_start']='Kliknite da započnete obris.';
$ec_lang['lpn_area_hint_lasso_go']='Pomičite se da nacrtate obris. Kliknite da završite.';
$ec_lang['lpn_area_hint_polygon_start']='Kliknite da nacrtate poligonsko područje. Dvaput kliknite da završite.';
$ec_lang['lpn_area_hint_polygon_go']='Kliknite svaki kut. Dvaput kliknite posljednji da završite.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Držite Shift dok odabirete da nastavite s postojećim odabirom, dodajući ili uklanjajući (preklapajući) ono što odabirete.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Pritisnite na kartu i povucite oko onoga što želite, zatim otpustite.';
$ec_lang['lpn_area_hint_touch_go']='Povucite oko onoga što želite, zatim otpustite da završite.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Prikaži ovo';
$ec_lang['lpn_multi_title']='{n} odabrano';
$ec_lang['lpn_multi_varies']='Razlikuje se';
$ec_lang['lpn_multi_applied']='Postavljeno {prop} na {n}.';
$ec_lang['lpn_multi_no_fields']='Ovi elementi nemaju ništa što se ovdje može zajednički postaviti.';
$ec_lang['lpn_pane_pasted']='Zalijepljeno {n} ćelija. {skipped} nije promijenjeno.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Zalijepljeno {n} redaka, dodano {created} od njih u mrežu.';
$ec_lang['lpn_pane_pasted_rows_skipped']='Zalijepljeno {n} redaka, dodano {created} od njih u mrežu. {skipped} ćelija nije promijenjeno.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Kliknite ovdje i zalijepite retke iz proračunske tablice da ih dodate.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Zalijepi kao nove retke na kraju tablice';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Pritisnite Ctrl+V da dodate kopirane retke na dno ove tablice. Pritisnite Esc za prekid.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Ovo lijepljenje ima {n} redaka, a {fit} od njih stane u tablicu. Dodati ostalih {extra} kao nove retke na dnu?';
$ec_lang['lpn_pane_paste_overflow_add']='Dodaj {extra} redaka';
$ec_lang['lpn_pane_paste_overflow_fit']='Zalijepi samo {fit} koji stanu';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Ovo lijepljenje ima {n} redaka, a {fit} od njih stane u tablicu. Ostalih {extra} ne mogu se dodati kao novi retci: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} ID-ova se ne podudara. Ipak zalijepiti?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Ništa nije zalijepljeno. {reasons}';
$ec_lang['lpn_pane_paste_more']='Retci s problemima koji ovdje nisu prikazani: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Redak {row}: novi redak treba ID.';
$ec_lang['lpn_pane_paste_bad_id']='Redak {row}: ID {id} sadrži razmak ili navodnik.';
$ec_lang['lpn_pane_paste_id_taken']='Redak {row}: ID {id} je već u upotrebi.';
$ec_lang['lpn_pane_paste_id_twice']='Redak {row}: ID {id} se koristi dvaput u ovom lijepljenju.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Redak {row}: novi čvor treba i {first} i {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Redak {row}: novi vod treba čvor Od i čvor Do.';
$ec_lang['lpn_pane_paste_no_node']='Redak {row}: čvor {id} još ne postoji. Prvo zalijepite svoje čvorove, zatim vodove.';
$ec_lang['lpn_pane_paste_same_ends']='Redak {row}: Od i Do su isti čvor.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Redak {row}: {text} nije valjan(a) {col}.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).

// {id} is what the Text table's own Attached to cell named.






$ec_lang['lpn_pane_filled']='Popunjeno prema dolje {n} ćelija. {skipped} nije promijenjeno.';
$ec_lang['lpn_pane_filldown']='Popuni prema dolje';
$ec_lang['lpn_pane_fill_none']='Ništa u ovom odabiru ne može se popuniti prema dolje.';
$ec_lang['lpn_pane_ctrlenter_filled']='Popunjeno {n} ćelija. {skipped} nije promijenjeno.';
$ec_lang['lpn_pane_hide_col']='Sakrij ovaj stupac';
$ec_lang['lpn_pane_hide_cols']='Sakrij ove stupce';
$ec_lang['lpn_pane_show_all_cols']='Prikaži sve stupce';
$ec_lang['lpn_pane_sort_asc']='Razvrstaj uzlazno';
$ec_lang['lpn_pane_manage_cols']='Upravljaj stupcima…';
$ec_lang['lpn_pane_manage_cols_title']='Upravljanje stupcima';
$ec_lang['lpn_pane_manage_cols_show']='Prikaži';
$ec_lang['lpn_pane_manage_cols_up']='Pomakni gore';
$ec_lang['lpn_pane_manage_cols_down']='Pomakni dolje';
$ec_lang['lpn_pane_manage_cols_top']='Pomakni na početak';
$ec_lang['lpn_pane_manage_cols_bottom']='Pomakni na kraj';
$ec_lang['lpn_pane_colmenu_tip']='Sakrij ili upravljaj stupcima';
$ec_lang['lpn_pane_sortarrow_tip']='Obrni redoslijed razvrstavanja';
$ec_lang['lpn_tool_area_window']='Odaberi prozor';
$ec_lang['lpn_tool_area_lasso']='Odaberi laso';
$ec_lang['lpn_tool_area_polygon']='Odaberi poligon';
$ec_lang['lpn_tool_delete']='Izbriši';
$ec_lang['lpn_tool_zoom_extent']='Prikaži sve';
$ec_lang['lpn_tool_zoom_window']='Zumiraj prozor';
$ec_lang['lpn_zoom_in']='Uvećaj';
$ec_lang['lpn_zoom_out']='Umanji';
$ec_lang['lpn_new_text']='Tekst';
$ec_lang['lpn_field_text_bold']='Podebljani tekst';
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

$ec_lang['lpn_field_text_align']='Vodoravno poravnanje';
$ec_lang['lpn_field_text_align_left']='Lijevo';
$ec_lang['lpn_field_text_align_center']='Sredina';
$ec_lang['lpn_field_text_align_right']='Desno';
$ec_lang['lpn_field_text_valign']='Okomito poravnanje';
$ec_lang['lpn_field_text_valign_top']='Vrh';
$ec_lang['lpn_field_text_valign_middle']='Sredina';
$ec_lang['lpn_field_text_valign_bottom']='Dno';
$ec_lang['lpn_field_text_rotation']='Kut (stupnjevi)';
$ec_lang['lpn_field_text_match_pipe']='Okreni prema kutu najbližeg voda';
$ec_lang['lpn_field_text_flip']='Zakreni za 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Pridruženi element';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Ovaj je tekst postavljen dovoljno blizu elementa da ga prati, pa se pomiče s tim elementom i ima izvodnicu. Tekst na izvodnici preuzima svoje vodoravno i okomito poravnanje sa strane na kojoj se nalazi, zato ta dva retka nisu ponuđena dok je pridružen.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Koeficijent emitera';
$ec_lang['lpn_field_emitter_tip']='Dodatni istok koji ovisi o tlaku, za prskalicu, otvoreni izlaz ili modelirano curenje. Protok koji oslobađa jest ovaj koeficijent pomnožen tlakom podignutim na eksponent emitera, koji se postavlja jednom za cijelu mrežu pod Postavke, Proračun, Hidraulika. Ostavite prazno na običnom čvoru.';
$ec_lang['lpn_field_elev']='Kota';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='Razina terena ili cijevi na ovom čvoru. Mjerite je od bilo koje nulte točke, sve dok svi čvorovi koriste istu.';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='Tlačna visina';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Razina vodene površine u rezervoaru, izražena kao visina, a ne kao tlak. Ostavite prazno da vodena površina bude na koti rezervoara.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='Kota dna spremnika. Dubine vode u spremniku mjere se od ove točke prema gore.';
$ec_lang['lpn_field_tank_level']='Dubina vode';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Dubina vode u spremniku, mjerena od dna spremnika prema gore. Razina vodene površine jednaka je koti dna spremnika uvećanoj za ovu dubinu.';
$ec_lang['lpn_field_tank_minlevel']='Najmanja dubina vode';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Dubina vode pri kojoj se spremnik smatra praznim, mjerena od dna spremnika prema gore.';
$ec_lang['lpn_field_tank_maxlevel']='Najveća dubina vode';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Dubina vode pri kojoj je spremnik pun, mjerena od dna spremnika prema gore.';
$ec_lang['lpn_field_tank_diameter']='Promjer spremnika';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Širina spremnika od jedne strane do druge. Izražava se u istim jedinicama kao kota, a ne u jedinicama promjera cijevi. Određuje koliko vode zadana dubina sadrži.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Kota vodene površine u spremniku: kota dna spremnika uvećana za dubinu vode. To je razina koju rješavač koristi za spremnik.';
$ec_lang['lpn_close']='Zatvori';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Svojstva';
$ec_lang['lpn_empty_hint']='Upotrijebite Datoteka, Novi projekt da otvorite primjer. Ili počnite dodavanjem rezervoara, čvora i cijevi s alatne trake.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Vaša mreža je netaknuta.';
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
$ec_lang['lpn_examples_welcome']='Dobrodošli u modeliranje vodoopskrbne mreže, s EPANET rješavačem';
$ec_lang['lpn_examples_heading']='Otvorite primjer';
$ec_lang['lpn_examples_sub']='Svaki se otvara kao vaša vlastita kopija. Promijenite je, spremite je ili otvorite novu kopiju i počnite iznova.';
$ec_lang['lpn_examples_open']='Otvori';
$ec_lang['lpn_examples_menu']='Otvori primjer…';
$ec_lang['lpn_examples_blank']='Ili počnite s praznom kartom';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_close']='Zatvori';
$ec_lang['lpn_examples_size']='Čvorovi: {nodes}, vodovi: {links}';
$ec_lang['lpn_examples_failed']='Primjere nije bilo moguće učitati. Upotrijebite Datoteka, Novi projekt da započnete crtež.';
$ec_lang['lpn_examples_loading']='Učitavanje primjera…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Ispravi nešto';
$ec_lang['lpn_help_notes']='Napomene na ovoj stranici';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Nešto ovdje ne valja?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Jedan pritisak javlja nam da nešto na ovoj stranici nije u redu. Šalje naziv ove stranice, jezik na kojem je čitate i poruku na karti ako postoji. Ne šalje ništa što ste upisali, nikakvu adresu, i ništa iz vašeg crteža. Nitko vam ne može odgovoriti, jer ovo nam ne govori tko ste. Koristite Pomoć, Ispravi nešto kada želite reći više.';
$ec_lang['lpn_wrong_thanks']='Hvala. To je stiglo do nas.';
$ec_lang['lpn_status_example_opened']='Otvoreno: {name}. To je vaša kopija: spremite je pomoću Datoteka, Spremi kao.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Ova stranica nije mogla odrediti veličinu područja crtanja, pa karta prikazuje posljednji prikaz koji je uspjela izračunati. Promjena veličine prozora navodi je da pokuša ponovno. Ako se to nastavlja događati, uobičajen je uzrok proširenje preglednika koje blokira mjerenja stranice.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Osnovna mreža, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Počnite ovdje. Rezervoar, pumpa i mala petlja: najmanji raspored koji još uvijek funkcionira kao vodovodna mreža. Litre u sekundi, uz metre i milimetre.';
$ec_lang['lpn_ex_basic_us_title']='Osnovna mreža, gpm (SAD)';
$ec_lang['lpn_ex_basic_us_desc']='Ista početna mreža u galonima po minuti, uz stope i inče.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Najmanja od tri EPANET-ove vlastite primjerne mreže: jedan rezervoar, pumpa i jedna petlja.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Razgranati distribucijski sustav sa spremnikom, iz EPANET-ovih primjera.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='EPANET-ov veliki primjer: 92 čvora, 3 spremnika i 2 rezervoara, od kojih je jedan rijeka. Vrijedi ga otvoriti da vidite kako model stvarne veličine izgleda na karti.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='Ista mreža kao EPANET Net3, smještena na proizvoljnom mjestu na globusu: njezine koordinate su zemljopisna širina i dužina, a iza nje je nacrtana karta ulica.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Poslovni objekt riješen za protok za gašenje požara uz najveću dnevnu potražnju, u jednom trenutku, nacrtan preko situacijskog plana.';
$ec_lang['lpn_tool_undo']='Poništi';
$ec_lang['lpn_confirm_example']='Ovo dodaje primjer u mrežu koju već imate. Nastaviti?';
$ec_lang['lpn_field_diameter']='Promjer';
$ec_lang['lpn_demand_tip']='Protok koji se uzima iz mreže na ovom čvoru. Unesite negativan broj za protok koji se ovdje dodaje u mrežu.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Ova jedinica određuje što vaši unosi znače';
$ec_lang['lpn_units_warn_lead']='{unit} je jedinica za ono što unosite za:';
$ec_lang['lpn_units_options_head']='Kada promijenite jedinicu:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Nedestruktivno';
$ec_lang['lpn_units_nondestructive_desc']='Nedestruktivno: svaki unos ostavlja onakvim kakav jest i ponovno ga tumači u novoj jedinici.';
$ec_lang['lpn_units_destructive']='Destruktivno';
$ec_lang['lpn_units_destructive_desc']='Destruktivno: matematičkom pretvorbom prepisuje svaki unos, tako da mreža ostaje fizički gotovo ista, unutar tolerancija pretvorbe. Time se gube izvorni unosi. Poništi ih vraća natrag.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} vrijednosti sada znače {unit}. Ništa nije prepisano.';
$ec_lang['lpn_status_converted']='{n} vrijednosti je prepisano u {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='Oboji mrežu prema jednoj veličini, tako da se velika karta može pročitati na prvi pogled. Tlak i brzina obično su najvažniji.';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Duljina i koordinate karte';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Koordinate karte';
$ec_lang['lpn_units_mapcoords_deg']='stupnjevi';
$ec_lang['lpn_units_usft']='US izmjerena stopa';
$ec_lang['lpn_units_elevhead']='Kota i tlačna visina';
$ec_lang['lpn_units_pressure']='Tlak';
$ec_lang['lpn_units_flow']='Protok';
$ec_lang['lpn_units_velocity']='Brzina';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Gradijent gubitka tlačne visine';
$ec_lang['lpn_result_gradient_tip']='Gubitak tlačne visine podijeljen duljinom cijevi. Koristite ga za usporedbu cijevi različitih duljina prema jednom projektnom ograničenju.';
$ec_lang['lpn_result_water_age']='Starost vode';
$ec_lang['lpn_result_water_age_tip']='Koliko je dugo voda koja stiže do ove točke bila u sustavu. Gdje se protoci spajaju, voda koja stiže nosi mješavinu starosti, a broj ovdje je njihov prosjek ponderiran protokom: čvor koji uglavnom napaja kratak novi vod pokazuje nisku starost čak i ako ga napaja i dugi slijepi vod. U spremniku je to prosječna starost vode koju drži, zato je spremnik koji se sporo izmjenjuje obično najstarija voda u mreži. Ne postoji propisano ograničenje s kojim biste tu vrijednost uspoređivali, pa broj prosudite prema vlastitom sustavu.';
$ec_lang['lpn_result_source_share']='Udio izvora';
$ec_lang['lpn_result_source_share_tip']='Koliki dio vode koja stiže do ove točke potječe iz čvora praćenja. To je ono što prikazuje analiza Praćenje izvora.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Prosječna starost vode';
$ec_lang['lpn_result_avg_source_share']='Prosječni udio izvora';
$ec_lang['lpn_result_avg_concentration']='Prosječna koncentracija';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Faktor trenja';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Stopa reakcije';
$ec_lang['lpn_result_status']='Status';
$ec_lang['lpn_result_status_open']='Otvoreno';
$ec_lang['lpn_result_status_closed']='Zatvoreno';
$ec_lang['lpn_result_head']='Tlačna visina';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Energija vode na ovom čvoru, izražena kao visina vodenog stupca. To je visina, a ne tlak.';
$ec_lang['lpn_result_pressure']='Tlak';
$ec_lang['lpn_result_flow']='Protok';
$ec_lang['lpn_result_velocity']='Brzina';
$ec_lang['lpn_result_headloss']='Gubitak tlačne visine';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Vraća samo postavke ovog projekta. Vaš crtež i vaši drugi projekti se ne mijenjaju. Da biste sačuvali omiljene postavke za ponovnu upotrebu, spremite projektnu datoteku koja sadrži samo postavke.';
$ec_lang['lpn_reset_all_tip']='Briše svaki projekt, svaku pozadinsku sliku, sve postavke i vaš odabir jedinica, a zatim ponovno učitava stranicu točno onako kako je vidi posjetitelj koji dolazi prvi put. Ovo je jedino vraćanje koje briše sve.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Ovaj kalkulator pohranjuje jedinice i unose projekta onako kako su uneseni, ali je ranije brojeve pretvarao u SI za pohranu. Ovaj projekt spremljen je prije te promjene, pa su njegovi brojevi pohranjeni u SI. Pretvoriti ih posljednji put u trenutne jedinice? Kako biste mogli procijeniti, evo nekoliko promjera koji bi bili pretvoreni, s vrijednostima prije i poslije:';
$ec_lang['lpn_v2_restore_yes']='Pretvori';
$ec_lang['lpn_v2_restore_never']='Ne. Ne pitaj me više.';
$ec_lang['lpn_v2_restore_no']='Zatvori da najprije provjerim trenutne jedinice';
$ec_lang['lpn_storage_too_new']='Ovaj projekt spremljen je novijom verzijom stranice, pa se ovdje ne može otvoriti.';
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
$ec_lang['lpn_tool_file']='Datoteka';
$ec_lang['lpn_menu_edit']='Uredi';
$ec_lang['lpn_menu_insert']='Umetni';
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
$ec_lang['lpn_menu_map']='Karta';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Prikaži kartu ulica';
$ec_lang['lpn_basemap_satellite_show']='Prikaži satelitske snimke';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='georeferencirano';
$ec_lang['lpn_xymap']='lokalno';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Pretvori kao…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Kopija od {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Pretvori kao';
$ec_lang['lpn_convas_coordsys_tip']='Koordinatni sustav u koji se kopija pretvara. Kada se razlikuje od koordinatnog sustava ovog projekta, slijede dva koraka postavljanja. Projekt koji već zna gdje se nalazi otvara oba koraka već odgovorena, pa ih možete prihvatiti kakvi jesu ili ih promijeniti.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Trenutačno: {crs}';
$ec_lang['lpn_convas_epsg']='EPSG koordinatni sustav';
$ec_lang['lpn_convas_epsg_tip']='Odaberite koordinatni sustav iz EPSG registra. Zemljopisna širina i dužina je WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Neimenovano (lokalno) georeferenciranje';
$ec_lang['lpn_convas_unnamed_tip']='Lokalne koordinate u jedinici dužine, s pridruženom kartom svijeta.';
$ec_lang['lpn_convas_none_tip']='Lokalne koordinate u jedinici dužine, zasad bez karte svijeta.';
$ec_lang['lpn_convas_units_tip']='Jedinice u koje se kopija pretvara. Izvornik zadržava svoje vlastite brojeve i jedinice.';
$ec_lang['lpn_convas_round']='Zaokruži pretvorene vrijednosti';
$ec_lang['lpn_convas_round_tip']='Zaokružuje samo brojeve koje ova pretvorba prepisuje, na najbliži korak koji odaberete. Vrijednosti čija se jedinica ne mijenja ostaju kakve jesu.';
$ec_lang['lpn_convas_round_none']='Bez zaokruživanja';
$ec_lang['lpn_convas_round_flow']='Potražnja i protok';
$ec_lang['lpn_convas_label_col']='Sufiks';
$ec_lang['lpn_convas_label_tip']='Tekst dodan nakon ove vrijednosti na oznakama karte kopije, poput \' mm\' ili \' gpm\'. Unaprijed ispunjeno prema jedinici odabranoj iznad; obrišite ga za bez sufiksa.';
$ec_lang['lpn_convas_oneway']='Pretvaranje natrag je druga pretvorba, a ne poništavanje. Broj pretvoren i zatim pretvoren natrag možda se neće vratiti točno onakav kakav je bio upisan.';
$ec_lang['lpn_convas_ok']='Pretvori';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} jedan je od rijetkih navedenih koordinatnih sustava bez upotrebljivih podataka o projekciji, pa se ne može pretvoriti u njega ni iz njega. Ništa nije pretvoreno.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='Pretvorena kopija je {name}. Izvorni projekt nije promijenjen.';
$ec_lang['lpn_convas_cancelled']='Ništa nije pretvoreno. Kopija je zatvorena, a izvorni projekt nije promijenjen.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Kopira ovaj projekt na novu karticu i pretvara kopiju u koordinatni sustav i jedinice koje odaberete. Kada se koordinatni sustav mijenja, čarobnjak vas vodi kroz približno zumiranje karte iza vaše mreže, a zatim kroz preciznije mjerilo i zakretanje vaše mreže na karti. Ovaj projekt ostaje potpuno nepromijenjen. Za georeferenciranje bez pretvaranja ičega, koristite Karta, Karta svijeta, Pridruži.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Ovaj projekt je već georeferenciran, pa je mreža već na karti i ništa nije pomaknuto. Provjerite je li na pravom mjestu, zatim pritisnite gumb Postavi model ovdje i gumb Zadrži ovaj položaj.';
$ec_lang['lpn_georef_intro']='Postavljanje modela ima dva koraka. Korak 1 je brzi: model miruje, a vi pomičete kartu iza njega, dok se vaša lokacija ne nađe ispod modela otprilike prave veličine. Zakretanja još nema. Korak 2 je precizni: povlačite, mijenjate veličinu i zakrećete sam model. Vaš je projekt isprva na karti cijelog svijeta, pa prvo pronađite svoju lokaciju, zatim pritisnite gumb Postavi model ovdje.';
$ec_lang['lpn_georef_adjust']='Model je sada na tlu, pa se pomiče zajedno s kartom. Povucite model da ga pomaknete, povucite kut da mu promijenite veličinu, povucite okruglo hvatište iznad modela da ga okrenete. Ili upišite udaljenost na tlu i kut zakreta ispod.';
$ec_lang['lpn_georef_step1']='Korak 1 od 2 — brzi';
$ec_lang['lpn_georef_step2']='Korak 2 od 2 — precizni';
$ec_lang['lpn_georef_step1_hint']='Vaš projekt ostaje ondje gdje je na zaslonu. Pomičite i zumirajte kartu ispod njega dok tlo iza njega ne bude otprilike na pravom mjestu i otprilike prave veličine, zatim pritisnite gumb Postavi model ovdje.';
$ec_lang['lpn_georef_detach']='Ponovno ga podignite';
$ec_lang['lpn_georef_size_prompt']='Otprilike koliko je široko gradilište, preko cijelog projekta?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Prečac: pritisnite {key}.';
$ec_lang['lpn_tool_key_hint_two']='Prečac: pritisnite {key} ili {key2}.';
$ec_lang['lpn_tool_add_junction_tip']='Kliknite kartu da dodate čvor: točku gdje se cijevi spajaju ili gdje se troši voda.';
$ec_lang['lpn_tool_add_reservoir_tip']='Kliknite kartu da dodate rezervoar: izvor koji drži jednu stalnu razinu vode.';
$ec_lang['lpn_tool_add_tank_tip']='Kliknite kartu da dodate spremnik: skladište čija razina vode raste i pada dok se puni i prazni.';
$ec_lang['lpn_tool_add_pipe_tip']='Kliknite jedan čvor, a zatim drugi da nacrtate cijev između njih.';
$ec_lang['lpn_tool_add_pump_tip']='Kliknite jedan čvor, a zatim drugi da postavite pumpu između njih.';
$ec_lang['lpn_tool_add_valve_tip']='Kliknite jedan čvor, a zatim drugi da postavite ventil između njih.';
$ec_lang['lpn_tool_add_text_tip']='Kliknite kartu da napišete bilješku na crtežu.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Kliknite na kartu prema uputama da odaberete sve unutar oblika. Ponovno pritisnite ovaj gumb da promijenite oblik između prozora, lasa i poligona. Držite Shift dok odabirete da nastavite s postojećim odabirom, dodajući ili uklanjajući (preklapajući) ono što odabirete.';
$ec_lang['lpn_area_selected']='{n} odabrano.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='Ništa nije pronađeno u tom području.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Dodajte i uklonite točke loma koje oblikuju cijev na karti. Kliknite cijev da dodate točku loma, kliknite točku loma da je uklonite, a povucite točku loma da je pomaknete. Točka loma mijenja samo nacrtanu rutu, ne i hidrauliku.';
$ec_lang['lpn_tool_delete_tip']='Kliknite bilo što na karti da to uklonite.';
$ec_lang['lpn_tool_undo_tip']='Poništi posljednju promjenu.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Prikaži cijelu mrežu u prozoru.';
$ec_lang['lpn_tool_zoom_window_tip']='Kliknite dva nasuprotna kuta okvira, ili ga povucite, na karti da zumirate na njega. Pritisnite ovaj gumb ponovno za Zumiraj na cijelo.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Uvećaj. Prečac: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Umanji. Prečac: -';
$ec_lang['lpn_tool_settings_tip']='Otvori postavke za ovaj projekt.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Pronađite element prema njegovom ID-u, ili pronađite svaki element koji zadovoljava uvjet, i promijenite ih sve odjednom.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Što znače ikone alatne trake';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Vidljivost';
$ec_lang['lpn_pane_right_toggle_tip']='Prikaži ili sakrij ploču s desne strane karte. Ona sadrži izbore oznaka i boja.';
$ec_lang['lpn_color_legend_open_tip']='Kliknite da otvorite ploču Vidljivost i promijenite ove boje.';
$ec_lang['lpn_color_node_field']='Boji čvorove prema';
$ec_lang['lpn_color_link_field']='Boji cijevi prema';
$ec_lang['lpn_color_ramp_sequential']='Sekvencijalna';
$ec_lang['lpn_color_ramp_diverging']='Divergentna';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Broj raspona';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Raspodjela raspona';
$ec_lang['lpn_color_ranges_note']='Granice ispod su fiksne nakon što su postavljene; ne prate rezultate kako se mijenjaju. Odabir metode klasifikacije podataka iznad postavlja granice prema trenutačnom stanju sustava. Ako ručno promijenite bilo koju vrijednost, metoda iznad postaje Ručno.';
$ec_lang['lpn_color_criterion_note']='Ova metoda uzima svoje granice iz projektnog standarda, pa je broj boja fiksan dok je ova metoda odabrana.';
$ec_lang['lpn_color_break_number']='Granica mora biti broj. Karta je nepromijenjena.';
$ec_lang['lpn_color_break_order']='Svaka granica mora biti veća od prethodne. Karta je nepromijenjena.';
$ec_lang['lpn_color_break_count']='Mora postojati jedna granica manje nego što ima boja. Karta je nepromijenjena.';
$ec_lang['lpn_color_ramp_qualitative']='Kvalitativna';
$ec_lang['lpn_color_ramp_rainbow']='Duga';
$ec_lang['lpn_color_ramp_rainbow_eg']='odgovara EPANET-u';
$ec_lang['lpn_color_example_status']='Status';
$ec_lang['lpn_color_example_material']='Materijal';
$ec_lang['lpn_color_ramp_ylgnbu']='Žuta do plave';
$ec_lang['lpn_color_ramp_rdylbu']='Crvena do plave, preko žute';
$ec_lang['lpn_georef_drop']='Postavi model ovdje';
$ec_lang['lpn_georef_finish']='Zadrži ovaj položaj';
$ec_lang['lpn_georef_cancel']='Odustani';
$ec_lang['lpn_georef_scale']='Udaljenost na terenu po jedinici crteža';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Koliko daleko na terenu doseže jedna jedinica vašeg crteža. Crtež napravljen na običnoj mreži obično o ovome ništa ne govori, pa to postavite ovdje — ili neka vas Idi na… pita koliko je gradilište široko i sam to izračuna.';
$ec_lang['lpn_georef_rotation']='Zakret suprotno od kazaljke na satu (stupnjevi)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Koliko zakrenuti cijeli model, suprotno od kazaljke na satu, tako da njegov sjever pokazuje prema sjeveru.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Trajno postaviti model ovdje? Pojedinačne elemente i dalje možete povlačiti naknadno, ali crtež prestaje biti xy projekt. Da biste dobili xy natrag, zatvorite ovaj projekt bez spremanja.';
$ec_lang['lpn_georef_done']='Ovo je sada lat/lon projekt. Povucite bilo koji element da ga pomaknete bliže mjestu gdje se stvarno nalazi.';
$ec_lang['lpn_georef_backdrop_unrotated']='Pozadinska slika pomaknuta je i promijenjena joj je veličina zajedno s modelom, ali nije se mogla zaokrenuti. Koristite Karta, Pozadinska slika, Pomakni da je poravnate.';
$ec_lang['lpn_georef_empty']='Ta datoteka nema mrežu u sebi, pa nema ništa za postaviti.';
$ec_lang['lpn_georef_unavailable']='Alat za postavljanje se nije učitao. Ponovno učitajte stranicu i pokušajte ponovno.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Završite postavljanje gumbom \'Zadrži ovo postavljanje\' ili pritisnite Odustani prije nego što promijenite projekt. Postavljanje pripada ovom projektu i ne može vas pratiti u drugi.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Prije spremanja dovršite postavljanje gumbom „Zadrži ovaj položaj” ili pritisnite Odustani. Projekt se još uvijek postavlja, pa ono što je na zaslonu još nije ono što bi se zapisalo u datoteku.';
$ec_lang['lpn_goto_menu']='Idi na zemljopisnu širinu i dužinu…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='Pomaknite kartu na mjesto za koje već imate koordinate. Prvo zemljopisna širina, zatim dužina, onako kako ih daje karta, s razmakom između njih: 38 -122';
$ec_lang['lpn_goto_prompt']='Zemljopisna širina i dužina, tim redoslijedom';
$ec_lang['lpn_goto_bad']='To nije jedna zemljopisna širina i jedna dužina. Pokušajte 38 -122, s razmakom između njih.';
$ec_lang['lpn_georef_goto']='Idi na…';
$ec_lang['lpn_georef_twopt']='Koristi dvije poznate točke';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Postavite model točno, kada već znate gdje se dvije točke na vašem crtežu stvarno nalaze. Kliknite jednu od njih, upišite njezinu zemljopisnu širinu i dužinu, zatim učinite isto za drugu točku. Položaj, mjerilo i zakret svi proizlaze iz te dvije točke. Ponovno pritisnite ovaj gumb da prestanete birati.';
$ec_lang['lpn_georef_twopt_pick1']='Kliknite točku na svom crtežu čiju zemljopisnu širinu i dužinu znate.';
$ec_lang['lpn_georef_twopt_pick2']='Sada kliknite drugu poznatu točku, što dalje od prve.';
$ec_lang['lpn_georef_twopt_same']='To je točka koju ste odabrali prvu. Odaberite drugu.';
$ec_lang['lpn_georef_twopt_done']='Model sada leži na dvije točke koje ste dali. Provjerite ga, zatim pritisnite gumb Zadrži ovaj položaj.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Donja ploča';
$ec_lang['lpn_pane_toggle_tip']='Prikaži ili sakrij ploču ispod karte. Ona sadrži profil i tablicu za svaku vrstu dijela.';
$ec_lang['lpn_pane_resize']='Povucite da ploču učinite višom ili nižom';
$ec_lang['lpn_pane_tab_junctions']='Čvorovi';
$ec_lang['lpn_pane_tab_reservoirs']='Rezervoari';
$ec_lang['lpn_pane_tab_tanks']='Spremnici';
$ec_lang['lpn_pane_tab_pipes']='Cijevi';
$ec_lang['lpn_pane_tab_pumps']='Pumpe';
$ec_lang['lpn_pane_tab_valves']='Ventili';
$ec_lang['lpn_pane_tab_tip']='Ova kartica prikazuje elemente ove vrste kao tablicu koju možete razvrstati i urediti. Stupci rezultata ne mogu se uređivati.';
$ec_lang['lpn_pane_none']='Ova mreža još nema nijedan od njih.';
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
$ec_lang['lpn_pane_text_attached']='Pridruženo';
$ec_lang['lpn_pane_not_used']='Ne koristi se';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Filtrirano po {q}. Prikazano {n} od {all}.';
$ec_lang['lpn_pane_filter_clear']='Prikaži sve';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Ništa u ovoj tablici ne odgovara filtru.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Zumiraj i odaberi';



$ec_lang['lpn_pane_print']='Ispiši tablicu';
$ec_lang['lpn_pane_print_tip']='Ispisuje tablicu koju trenutačno gledate, s nazivom projekta, nazivom tablice i jedinicama u zaglavljima. Retci se ispisuju redoslijedom kojim ste ih razvrstali.';

// **HIDE MAP READOUTS IS RETIRED, 2026-09-22** (Tom: "Hide map readouts was a print prep command.
// But it isn't very useful any more. Let's remove it."). lpn_clean_map, lpn_clean_map_off and
// lpn_clean_map_tip were deleted with the row; nothing else read them.
// THE PROJECT MENU (ROADMAP Task 467). Tom, 2026-08-20: "Maybe we can have a Project menu with
// Settings, Library, and Report under it?" Its rows borrow the names they already have --
// lpn_menu_settings, lpn_library_menu, lpn_time_run_report -- so a door cannot drift from the thing
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
$ec_lang['lpn_menu_project']='Voda';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Sve o modeliranju vodoopskrbne mreže nalazi se ovdje na jednom mjestu, osim upravljačkih tipki za reprodukciju animacije. Nije potrebno pogađati gdje se što nalazi.';
$ec_lang['lpn_tables_menu']='Tablice';
$ec_lang['lpn_tables_menu_tip']='Otvara ploču ispod karte na tablici dijelova ove mreže. Postoji jedna tablica za svaku vrstu dijela, a ondje je možete razvrstati i urediti.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Ponovno izračunaj ovu mrežu sada. Tražite gumb Pokreni? Skriven je dok je uključena postavka Izračunavaj automatski. Da vratite gumb, isključite Izračunavaj automatski u Postavke, Izračun, Hidraulika.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Izračunavaj automatski';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Kada je ovo uključeno, ovaj se projekt ponovno izračunava ubrzo nakon svake vaše promjene, a gumb Izračunaj uklonjen je s alatne trake jer mu više ništa ne preostaje za raditi. Isključite ovo na velikoj mreži gdje čekanje da se svaka promjena izračuna smeta upisivanju, i gumb Izračunaj se vraća kako biste sami birali kada se pokreće.';
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
$ec_lang['lpn_time_run_slow']='Izračun ove mreže trajao je {secs} s, a postavljena je da se ponovno izračunava nakon svake promjene. Da to zaustavite i vratite gumb Izračunaj, isključite „Izračunavaj automatski” u Postavkama, pod Izračun, Hidraulika.';
$ec_lang['lpn_time_no_report']='Izvještaj o pokretanju još ne postoji. Izvještaj je EPANET-ov vlastiti tekst, pa se pojavljuje tek kada je ova mreža izračunata EPANET rješavačem.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
$ec_lang['lpn_menu_settings']='Postavke';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Pomoć';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Galerija snimaka zaslona';
$ec_lang['lpn_help_walkthroughs']='Vodiči';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Izbriši mrežu';
$ec_lang['lpn_confirm_delete_network']='Izbrisati svaki čvor, cijev i tekstnu oznaku u ovom projektu? Pozadinska slika, naziv projekta i vaše postavke se zadržavaju. Ovo se ne može poništiti.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Pronađi i zamijeni';
$ec_lang['lpn_find_title']='Pronađi i zamijeni';
$ec_lang['lpn_find_scope']='Što pretražiti';
$ec_lang['lpn_find_scope_all']='Sve';
$ec_lang['lpn_find_property']='Svojstvo';
$ec_lang['lpn_find_condition']='Uvjet';
$ec_lang['lpn_find_value']='Vrijednost';
$ec_lang['lpn_find_btn']='Pronađi';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Filtriraj u trenutnoj tablici';
$ec_lang['lpn_find_filter_tip']='Prikaži samo dijelove koji odgovaraju ovom upitu u jednoj od tablica ispod karte. Crtež se ne mijenja i ništa se ne briše.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} od {all}';
$ec_lang['lpn_find_filter_summary']='Filtrirano prema {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Ovaj upit se ne odnosi ni na jednu tablicu.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='sadrži';
$ec_lang['lpn_find_op_equals']='jednako';
$ec_lang['lpn_find_op_gt']='veće od';
$ec_lang['lpn_find_op_lt']='manje od';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='prazno';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} pronađeno. Kliknite jedan da odete do njega.';

$ec_lang['lpn_find_none']='Ništa ne odgovara.';
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
$ec_lang['lpn_find_op_top']='{n} najvećih';
$ec_lang['lpn_find_op_bottom']='{n} najmanjih';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Upišite što tražite.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Povezanost';
$ec_lang['lpn_find_prop_demand_desc']='Opis ove kategorije potražnje';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='nema veza na čvoru';
$ec_lang['lpn_find_op_conn_noopen']='nema otvorenih veza na čvoru';
$ec_lang['lpn_find_op_conn_nolinksource']='nema puta preko veza do izvora';
$ec_lang['lpn_find_op_conn_noopensource']='nema otvorenog puta do izvora';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
$ec_lang['lpn_find_conn_unlinked']='Nema veza na čvoru';
$ec_lang['lpn_find_conn_noopen']='Nema otvorenih veza na čvoru';
$ec_lang['lpn_find_conn_nolinksource']='Nema puta preko veza do izvora';
$ec_lang['lpn_find_conn_noopensource']='Nema otvorenog puta do izvora';
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Svaki čvor je povezan.';
$ec_lang['lpn_find_conn_no_fixed']='Ova mreža nema rezervoar ni spremnik, pa nema izvora do kojeg bi se moglo doći. Mogu se pretraživati samo nema veza na čvoru i nema otvorenih veza na čvoru.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Ista pretraga, napisana u jednom retku. Promjena kontrola prepisuje taj redak, a upisivanje u taj redak ažurira kontrole.';
$ec_lang['lpn_find_query_label']='Upit';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Kombinirajte uvjete pomoću I, ILI i ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='I';
$ec_lang['lpn_find_q_or']='ILI';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Kontrole ne mogu izraziti upit ispod, pa su skrivene.';
$ec_lang['lpn_find_q_restore']='Umjesto toga koristi kontrole';
$ec_lang['lpn_replace_q_bad']='Ovaj upit nije moguće razumjeti, pa se ništa ne može promijeniti. Prvo ga ispravite iznad.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(na znaku {n})';
$ec_lang['lpn_find_q_err_empty']='Upit je prazan, pa se ništa neće pretraživati.';
$ec_lang['lpn_find_q_err_scope']='Ne postoji ništa što se zove {w} za pretraživanje. Pokušajte jedno od: {list}';
$ec_lang['lpn_find_q_err_dot']='Stavite točku između onoga što tražite i njegovog svojstva, npr. Čvor.ID';
$ec_lang['lpn_find_q_err_prop']='Nije svojstvo od {scope}: {w}. Pokušajte jedno od: {list}';
$ec_lang['lpn_find_q_err_op']='Nije uvjet za {prop}: {w}. Pokušajte jedno od: {list}';
$ec_lang['lpn_find_q_err_value']='Ovaj uvjet zahtijeva vrijednost nakon sebe: {op}';
$ec_lang['lpn_find_q_err_quote']='Stavite navodnike oko tekstualne vrijednosti: {w} nije broj.';
$ec_lang['lpn_find_q_err_quote_end']='Ovaj tekst pod navodnicima nema završni navodnik.';
$ec_lang['lpn_find_q_err_close']='Ova zagrada ( otvorena je i nikad zatvorena.';
$ec_lang['lpn_find_q_err_open']='Ova zagrada ) ništa ne zatvara.';
$ec_lang['lpn_find_q_err_end']='Ovdje se ništa nije očekivalo. Spojite dvije pretrage pomoću {and} ili {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Promijeni pronađeno';
$ec_lang['lpn_replace_prop']='Svojstvo koje treba promijeniti';
$ec_lang['lpn_replace_value']='Nova vrijednost';
$ec_lang['lpn_replace_source']='Izvor nove vrijednosti';
$ec_lang['lpn_replace_asked']='Zatražene su kote za {n} čvorova. Rezultati stižu.';
$ec_lang['lpn_replace_btn']='Zamijeni';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Promijeniti {n} elemenata?';
$ec_lang['lpn_replace_apply']='Promijeni ih';
$ec_lang['lpn_replace_done']='{n} elemenata promijenjeno. Ovo možete poništiti u jednom koraku.';
$ec_lang['lpn_replace_none']='Ništa se ne bi promijenilo.';
$ec_lang['lpn_replace_no_value']='Upišite novu vrijednost.';
$ec_lang['lpn_replace_scope']='Odaberite jednu vrstu elementa iznad na kojoj ćete mijenjati vrijednosti.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Profil';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_tip']='Nacrtajte teren i hidrauličku liniju (HGL) duž rute kroz mrežu.';
$ec_lang['lpn_profile_title']='Profil duž rute';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Kliknite čvor u kojem ruta počinje.';
$ec_lang['lpn_profile_draw_more']='Pomaknite pokazivač preko karte da vidite rutu. Kliknite čvor da ga dodate. Dvoklik završava. Esc otkazuje.';
$ec_lang['lpn_profile_draw_blocked']='Nema rute od {a} do {b}. Odaberite drugi čvor.';
$ec_lang['lpn_profile_tap_start']='Dotaknite čvor u kojem ruta počinje.';
$ec_lang['lpn_profile_tap_more']='Dotaknite čvor da vidite rutu. Pritisnite i držite da ga dodate. Dvostruki dodir završava. Ponovno pritisnite Profil da otkažete.';
$ec_lang['lpn_profile_say_idle']='Ponovno pritisnite Profil da odaberete novu rutu na karti.';
$ec_lang['lpn_profile_none']='Ruta još nije odabrana. Ponovno pritisnite Profil da je odaberete na karti.';
$ec_lang['lpn_profile_choose']='Odaberite početni i završni čvor.';
$ec_lang['lpn_profile_no_path']='Ova dva čvora nisu povezana nijednom rutom.';
$ec_lang['lpn_profile_no_solve']='Još nema rezultata, pa je nacrtana samo linija terena.';
$ec_lang['lpn_profile_summary']='Čvorovi: {n}, duljina: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Udaljenost duž rute ({u})';
$ec_lang['lpn_profile_axis_elev']='Kota i tlačna visina ({u})';
$ec_lang['lpn_profile_ground']='Površina terena';
$ec_lang['lpn_profile_hgl']='Hidraulička linija (HGL)';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Uredi';
$ec_lang['lpn_profile_edit_tip']='Promijenite jedan kraj rute ili uklonite jedan čvor s nje, bez ponovnog crtanja cijele rute.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Povucite bilo koju točku na ruti da je pomaknete. Kliknite točku koju ste dodali da je uklonite.';
$ec_lang['lpn_profile_edit_tap']='Povucite bilo koju točku na ruti da je pomaknete. Dotaknite točku koju ste dodali da je uklonite.';
$ec_lang['lpn_profile_edit_nowhere']='Točka na ruti mora biti čvor. Ruta je nepromijenjena.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Spremljene rute';
$ec_lang['lpn_profile_new']='Nova spremljena ruta…';
$ec_lang['lpn_profile_new_name']='Ruta {n}';
$ec_lang['lpn_profile_rename']='Preimenuj rutu…';
$ec_lang['lpn_profile_delete']='Izbriši rutu';
$ec_lang['lpn_profile_prompt_name']='Naziv ove rute';
$ec_lang['lpn_profile_delete_confirm']='Izbrisati spremljenu rutu {name}? Sam crtež se ne mijenja.';
$ec_lang['lpn_profile_none_saved']='Još nema spremljenih ruta';
$ec_lang['lpn_profile_missing']='Spremljena ruta {name} koristi čvorove kojih nema u ovom projektu: {ids}';
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
$ec_lang['lpn_ts_menu']='Vremenski niz';
$ec_lang['lpn_ts_tip']='Prikažite grafikon jednog ili više elemenata u odnosu na vrijeme tijekom simulacije proširenog razdoblja.';
$ec_lang['lpn_ts_title']='Vrijednosti u odnosu na vrijeme';
$ec_lang['lpn_ts_group_tip']='Prikazuje li grafikon čvorove ili vodove.';
$ec_lang['lpn_ts_group_nodes']='Čvorovi';
$ec_lang['lpn_ts_group_links']='Vodovi';
$ec_lang['lpn_ts_quantity_tip']='Koju vrijednost prikazati na grafikonu u odnosu na vrijeme.';
$ec_lang['lpn_ts_add']='Dodaj odabrano';
$ec_lang['lpn_ts_add_tip']='Stavi sve trenutačno odabrano na karti na grafikon.';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Ništa te vrste nije odabrano na karti.';
$ec_lang['lpn_ts_clear']='Ukloni sve';
$ec_lang['lpn_ts_chip_tip']='Ukloni {id} s grafikona';
$ec_lang['lpn_ts_none']='Za sada nema ničega za prikaz. Odaberite elemente na karti i pritisnite Dodaj odabrano.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Još nema rezultata proširenog razdoblja. Pritisnite Izračunaj da pokrenete simulaciju.';
$ec_lang['lpn_ts_summary']='Elementi: {n}, vremena izvještavanja: {steps}';
$ec_lang['lpn_ts_axis_time']='Proteklo vrijeme';
$ec_lang['lpn_view_units']='Jedinice';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Spremi sve';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Projekt{n}';
$ec_lang['lpn_project_copy_suffix']='(kopija)';
$ec_lang['lpn_project_rename']='Preimenuj';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Novi projekt…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Novi projekt';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Koordinatni sustav';
$ec_lang['lpn_new_coordsys_tip']='Odaberite koordinatni sustav svoje mreže. Ovo je trajno; jedini način da mrežu pretvorite u druge koordinate jest naredbom „Datoteka, Otvori u nove koordinate”, i to je približno.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Lokalno, shematsko ili prilagođeno';
$ec_lang['lpn_new_coordsys_local_tip']='Nije georeferencirano. Pridružite vlastitu pozadinsku sliku ili nijednu.';
// ---- THE COORDINATE SYSTEM BOX -----------------------------------------------------------------
// Tom's summary: it "uses the map view as a UX element to filter the universe of projections to the
// ones applicable to the project (view). Lets the user filter by name and select a projection at
// any time." (His own words, kept verbatim; "projection" in visitor strings became "coordinate
// system" on 2026-09-25 -- don't expose the word "projection".) Two filters over one catalogue, and
// the catalogue itself is not keyed: a coordinate system's NAME is the EPSG register's own, exactly
// as the OpenStreetMap credit is, and a GIS reader in any language looks for those characters.
$ec_lang['lpn_new_crs']='Kartografska projekcija';
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25). Shared by the New project box and Convert as, so
// it names the box's own subject rather than either caller's radio label.
$ec_lang['lpn_crsbox_title']='Koordinatni sustav';
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='Filtriraj prema prikazu karte';
$ec_lang['lpn_crs_view_tip']='Nudi samo projekcije koje pokrivaju mjesto na koje karta gleda. Isključite da biste pročitali cijeli popis.';
$ec_lang['lpn_crs_place']='Pretraga po nazivu mjesta';
$ec_lang['lpn_crs_place_tip']='Upišite grad, adresu ili znamenitost, i prikaz karte se pomiče onamo. Riječi koje upišete šalju se usluzi OpenStreetMapa za nazive mjesta, koja prvi put traži vaše dopuštenje. Novi zemljopisni projekt također počinje na mjestu koje ovdje pronađete.';
$ec_lang['lpn_crs_search']='Pretraži';
$ec_lang['lpn_crs_name']='Filtar naziva projekcije';
$ec_lang['lpn_crs_name_tip']='Prikazuje samo projekcije čiji naziv ili EPSG kod sadrži ono što upišete. Pokušajte s brojem zone, ili UTM, ili Mercator.';
$ec_lang['lpn_crs_list']='Projekcija';
$ec_lang['lpn_crs_list_tip']='Projekcije koje su preostale nakon dva gornja filtra. Odaberite jednu i pritisnite Odaberi.';
$ec_lang['lpn_crs_choose']='Odaberi';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Još nije pretraženo nijedno mjesto, pa je ponuđen cijeli popis. Pretražite mjesto iznad ili zumirajte kartu da ga suzite.';
$ec_lang['lpn_crs_count']='{n} od {total} projekcija na popisu.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} od {total} koordinatnih sustava pokriva ovu mrežu.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(bez karte)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} jedan je od rijetkih navedenih koordinatnih sustava bez upotrebljivih podataka o projekciji. To znači da karta svijeta, pretraga naziva mjesta i DEM kote ne rade. Vaše koordinate nisu pogođene.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='neimenovano';
$ec_lang['lpn_crs_none']='Nije georeferencirano';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Projekt zadržava svoje vlastite jedinice, pa ovaj izbor pripada samo ovom projektu i ništa se ovdje ne sprema kao postavka preglednika. Da nove projekte uvijek započnete na određeni način, spremite prazan projekt kao svoj predložak i svaki put napravite njegovu kopiju.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Petaluma, Kalifornija';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Stvori';
$ec_lang['lpn_file_open']='Otvori…';
$ec_lang['lpn_file_save']='Spremi';
$ec_lang['lpn_file_saveas']='Spremi kao…';
$ec_lang['lpn_file_revert']='Vrati';
$ec_lang['lpn_file_close']='Zatvori';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Nedavne datoteke';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='Ponovno otvorite {file} bez potrebe da je tražite na svom računalu.';
$ec_lang['lpn_recent_denied']='Dopuštenje za otvaranje te datoteke nije dano, pa nije otvorena.';
$ec_lang['lpn_recent_gone']='Nije moguće otvoriti {file}. Možda je premještena, preimenovana ili izbrisana, pa je uklonjena s popisa nedavnih.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Novi projekt';
$ec_lang['lpn_tab_all']='Svi projekti';
$ec_lang['lpn_tab_menu']='Izbornik projekta';
$ec_lang['lpn_tab_duplicate']='Dupliciraj';
$ec_lang['lpn_tab_move_left']='Pomakni lijevo';
$ec_lang['lpn_tab_move_right']='Pomakni desno';
$ec_lang['lpn_tab_unsaved']='Nije spremljeno u datoteku';
$ec_lang['lpn_import_bad_file']='Tu datoteku nije moguće pročitati kao projekt spremljen s ove stranice.';
$ec_lang['lpn_import_no_room']='Nema dovoljno preostalog prostora u pohrani preglednika za dodavanje ovog projekta. Izbrišite projekt koji vam više ne treba i pokušajte ponovno.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='U redu';
$ec_lang['lpn_file_import_inp']='Uvezi EPANET datoteku…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Učitajte mrežu iz EPANET datoteke, bilo iz tekstualne .inp datoteke ili .net datoteke koju sprema EPANET, i spremite je u ovom pregledniku kao novi projekt.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='Izvezi EPANET datoteku…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Zapišite ovu mrežu kao EPANET .inp datoteku i preuzmite je. Brojevi koje ste upisali zapisuju se točno onako kako ste ih upisali. Sve što .inp format ne može sadržavati navedeno je za vas nakon toga.';
$ec_lang['lpn_status_inp_exported']='Izvezeno {file}.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} stvari koje .inp format ne može sadržavati.';
$ec_lang['lpn_inp_export_refused']='Ovaj projekt se ne može zapisati kao EPANET datoteka: {detail}';
$ec_lang['lpn_inp_bad_file']='Tu datoteku nije moguće pročitati kao EPANET datoteku mreže.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Ovo izgleda kao EPANET .net datoteka, ali je ova stranica nije mogla pročitati. Otvorite je u EPANET-u i upotrijebite naredbu Datoteka, Izvoz, Mreža da je spremite kao .inp datoteku, zatim uvezite tu.';
$ec_lang['lpn_inp_report_heading']='Uvezeno: {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} čvorova, rezervoara i spremnika, {links} cijevi, pumpi i ventila, u jedinicama {units}.';
$ec_lang['lpn_inp_report_clean']='Sve iz datoteke je preneseno. Ništa nije izostavljeno.';
$ec_lang['lpn_inp_report_label_anchor']='Tekstualne oznake postavljene su onako kako ih postavlja EPANET, od njihovog gornjeg lijevog kuta.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='EPANET datoteke ne sadrže koordinatni sustav, pa ova datoteka isprva neće biti georeferencirana. Da je postavite na kartu svijeta, koristite Karta, Karta svijeta… Da pretvorite njezine koordinate, koristite Datoteka, Pretvori kao…';
$ec_lang['lpn_inp_report_lead']='Ova stranica ne koristi sve što EPANET koristi, ali ništa se u vašoj datoteci ne odbacuje. Ispod je ono što vaša datoteka sadrži, a što ova stranica zadržava bez upotrebe, te ono što je promijenjeno prilikom učitavanja datoteke:';
$ec_lang['lpn_inp_drop_headloss']='Ova datoteka ne koristi Hazen-Williamsovu formulu. Ova stranica računa prema Hazen-Williamsu, pa su brojevi hrapavosti cijevi zadržani točno onako kako su zapisani, ali rezultati ovdje neće odgovarati rezultatima u EPANET-u.';
$ec_lang['lpn_inp_drop_tank_curve']='Ovi spremnici nemaju okomite (ravne) stijenke: datoteka njihov oblik zadaje krivuljom. Krivulja se čuva u okviru Knjižnice, spremnik i dalje na nju upućuje, a izračun kroz vrijeme puni i prazni spremnik prema rasporedu koji ta krivulja daje. Jedan trenutak jednak je u oba slučaja, jer je vodena površina razina koju datoteka postavlja. Promjer zapisan u datoteci čuva se uz krivulju i to je ono kako se spremnik bez krivulje crta i rješava.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Ovi prigušni ventili uvezeni su kao prigušni ventili, koji nose isti gubitak koji im datoteka daje. Bilo koji rješavač ih može izračunati.';
$ec_lang['lpn_inp_drop_valve_active']='Ovi ventili reguliraju tlak ili protok te se sami otvaraju i zatvaraju kako se voda mijenja. Pri uvozu nije izgubljeno ništa o njima, a ova ih stranica rješava EPANET rješavačem, koji se za ovu mrežu automatski uključuje.';
$ec_lang['lpn_inp_drop_valve']='Ovi ventili opisani su krivuljom ili fiksnim padom tlaka, a ova stranica nema takav element. Uvezeni su kao otvorene cijevi, pa je mreža i dalje povezana, ali ništa više ne regulira tlak ili protok ondje.';
$ec_lang['lpn_inp_drop_cv']='U EPANET-u ove cijevi propuštaju vodu samo u jednom smjeru. Uvezene su kao obične cijevi, pa voda sada kroz njih može teći u oba smjera.';
$ec_lang['lpn_inp_drop_demands']='Ovi čvorovi imali su više od jedne potražnje. Potražnje su zbrojene u jednu potražnju koju ova stranica drži.';
$ec_lang['lpn_inp_drop_patterns']='Ova stranica nije učitala obrasce potražnje, jer dio nje koji provodi mrežu kroz vrijeme nije učitan. Svaka potražnja je broj zapisan u datoteci.';
$ec_lang['lpn_inp_drop_demand_pattern']='Ovi čvorovi mijenjaju svoju potražnju tijekom pokretanja. Njihovi obrasci uvezeni su u cijelosti, a potražnja koju vidite ona je za trenutak koji sat pokazuje.';
$ec_lang['lpn_inp_drop_emitters']='Ovi čvorovi imaju koeficijent prskalice ili curenja. Zadržan je i uključen u rješavanje, ali na ovoj stranici ga još nije moguće vidjeti ni promijeniti.';
$ec_lang['lpn_inp_drop_curve_long']='Ova krivulja pumpe imala je više od tri točke. Zadržane su njezina najniža, srednja i najviša točka, jer ova stranica prilagođava krivulju najviše trima točkama.';
$ec_lang['lpn_inp_drop_curve_missing']='Ova pumpa navodi krivulju koja nije u datoteci. Pumpa je uvezena bez krivulje, pa ne dodaje tlačnu visinu.';
$ec_lang['lpn_inp_drop_pump_other']='Ova pumpa je opisana snagom koju troši, a ne krivuljom. Uvezena je bez krivulje, pa ne dodaje tlačnu visinu.';
$ec_lang['lpn_inp_drop_head_pattern']='Ovi rezervoari tijekom pokretanja rastu i padaju. Njihovi obrasci uvezeni su u cijelosti, a razina vode koju vidite ona je za trenutak koji sat pokazuje.';
$ec_lang['lpn_inp_drop_pump_speed']='Ove pumpe rade pri brzini različitoj od one pri kojoj je izmjerena njihova krivulja, ili mijenjaju brzinu tijekom pokretanja. Brzina i njezin obrazac uvezeni su u cijelosti, a tlačna visina koju vidite ona je za trenutak koji sat pokazuje.';
$ec_lang['lpn_inp_drop_setting']='Ove cijevi, pumpe i ventili nose postavku koju ova stranica ne može zabilježiti. Uvezeni su u otvorenom stanju.';
$ec_lang['lpn_inp_drop_rules']='Ova datoteka ima kontrole temeljene na pravilima. Ova ih stranica čita i koristi. Izračunajte model EPANET rješavačem i pravila se primjenjuju, uz svaku razinu, tlak i protok u njima pretvorene u jedinice koje ovaj projekt prikazuje. Otvorite Pravila pod Knjižnice da pročitate ili promijenite neko od njih. Zadržavaju se točno onako kako ih datoteka navodi, i zapisuju se natrag ako spremite EPANET datoteku.';
$ec_lang['lpn_inp_drop_eps']='Ova datoteka opisuje izračun kroz vrijeme. Dio ove stranice koji provodi mrežu kroz vrijeme nije učitan, pa su uvezeni samo početni uvjeti.';
$ec_lang['lpn_inp_drop_quality']='Ova datoteka opisuje kako se kvaliteta vode mijenja dok putuje: što je u vodi na početku, i kojom brzinom ta tvar reagira u cijevima i u spremnicima. Ova stranica čita te brojeve i koristi ih. Odaberite kemikaliju pod Postavke, Izračun, Kvaliteta vode, zatim izračunajte model EPANET rješavačem, i koncentracija se izračunava duž mreže kako pokretanje odmiče. Retci se zadržavaju i zapisuju natrag ako spremite EPANET datoteku.';
$ec_lang['lpn_inp_drop_sources_mixing']='Ova datoteka navodi gdje se kemikalija dozira u mrežu i kako se voda u spremniku miješa. Doza se pojavljuje na čvoru na kojem je dodana, a spremnik navodi koji model miješanja slijedi. I dozu i model miješanja izračunava isključivo EPANET rješavač.';
$ec_lang['lpn_inp_drop_energy']='Ova EPANET datoteka sadrži podatke za modeliranje troška pumpanja. Ova stranica ih čita i koristi. Izračunajte model EPANET rješavačem, zatim otvorite Voda, Izvještaji, Energija pumpi da vidite koliko je dugo svaka pumpa radila, koju je snagu trošila, koliko je energije potrošila i koliko je to koštalo. Retci se zadržavaju i zapisuju natrag ako spremite EPANET datoteku.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Ova datoteka dodjeljuje oznake nekim svojim čvorovima, cijevima ili drugim elementima. Svaka oznaka uvezena je u cijelosti, i svaka se nalazi u svojstvima svog elementa, gdje je možete pročitati ili promijeniti.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Ova datoteka sadrži EPANET-ove vlastite postavke za oblikovanje izvještaja koji ispisuje. Rješavačev izvještaj možete pročitati ovdje, pod Izvještaji, EPANET pokretanje, ali on izlazi u rješavačevu standardnom obliku, a ne u onom koji te postavke traže. Retci se zadržavaju i zapisuju natrag ako spremite EPANET datoteku.';
$ec_lang['lpn_inp_drop_sections']='Ova datoteka sadrži odjeljak koji ova stranica uopće ne čita. Ovdje se ništa od toga ne koristi. Zadržava se u cijelosti i zapisuje natrag ako spremite EPANET datoteku.';
$ec_lang['lpn_inp_drop_quality_options']='Ova datoteka navodi EPANET-ove opcije kvalitete vode: opciju Quality, koja imenuje vrstu analize kvalitete vode, i dvije postavke vezane uz kemikaliju, Relative diffusivity i Quality tolerance. Sve tri se zadržavaju i sve tri se koriste. Starost vode, praćenje izvora i kemikalija svaki se ovdje izračunavaju, a dvije postavke za kemikaliju predaju se EPANET rješavaču kada izračunate kemikaliju. Sve se zapisuju natrag ako spremite EPANET datoteku.';
$ec_lang['lpn_inp_drop_file_options']='Ova datoteka upućuje na pomoćnu datoteku: Map, koja sadrži koordinate, ili Hydraulics, koja sadrži već izračunatu hidrauliku. Ova stranica ne može otvoriti nijednu od njih, pa se retci zadržavaju kakvi jesu i zapisuju natrag ako spremite EPANET datoteku.';
$ec_lang['lpn_inp_drop_demand_model']='Ova datoteka zahtijeva analizu vođenu tlakom (PDA), u kojoj čvor prima manje od svoje potražnje kada je tlak na njemu nizak. Ova stranica rješava vođeno potražnjom, pa svaki čvor ovdje prima potražnju koju navodi datoteka, bez obzira na to koji tlak iz toga proizlazi. Redak se zadržava i zapisuje natrag ako spremite EPANET datoteku.';
$ec_lang['lpn_inp_drop_other_options']='Ova datoteka navodi opcije koje ova stranica ne čita. Ovdje se ništa od toga ne koristi. Zadržavaju se i zapisuju natrag ako spremite EPANET datoteku.';
$ec_lang['lpn_inp_drop_net_options']='Ova EPANET .net datoteka navodi postavke za koje ova stranica nema kontrolu, pa su njihove vrijednosti ovdje samo popisane, a ne prenesene. Sve ostalo je preneseno. Ako vam trebaju, otvorite datoteku u EPANET-u i upotrijebite Datoteka, Izvoz, Mreža (File, Export, Network) da je spremite kao .inp datoteku, zatim uvezite tu.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Ovo je bila EPANET .net datoteka. To je EPANET-ov vlastiti projektni format, nema objavljen opis, a ova ga stranica čita tako da izvodi format iz primjera datoteka, pa ga koristite samo kada nemate ništa drugo, a ne kao pouzdan put. Datoteka .inp dokumentirani je format koji čita svaki drugi program: u EPANET-u upotrijebite Datoteka, Izvoz, Mreža (File, Export, Network) da je zapišete, i umjesto ovoga uvijek uvezite nju.';
$ec_lang['lpn_inp_drop_backdrop']='Ova datoteka navodi pozadinsku sliku, ali ne sadrži samu sliku. Dodajte je sami putem Datoteka, Pozadinska slika, Dodaj sliku.';
$ec_lang['lpn_inp_drop_dangling']='Ove cijevi navode čvor koji nije u datoteci, pa su izostavljene.';
$ec_lang['lpn_inp_drop_units']='Jedinica protoka navedena u ovoj datoteci nije jedna od onih koje ova stranica prepoznaje, pa je svaki broj pročitan kao galoni po minuti. Provjerite svaki broj prije nego što upotrijebite rezultate.';
$ec_lang['lpn_inp_drop_anchor_missing']='Ovaj tekst bio je vezan uz čvor, rezervoar ili spremnik koji nije u datoteci. Uvezen je kao slobodan tekst na mjestu koje mu je datoteka odredila, i sada ne prati ništa.';
$ec_lang['lpn_import_notes_heading']='Ovaj projekt učitan je iz EPANET datoteke. Dio onoga što ta datoteka sadrži zadržava se, ali se ne koristi na ovoj stranici.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='Otvoreno {name} iz datoteke i dodano u ovaj preglednik kao novi projekt.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Projektna datoteka';
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
$ec_lang['lpn_file_upload_explain']='Ovaj preglednik se ne može povezati s datotekom, pa je otvaranje datoteke ovdje zapravo prijenos: projekt se kopira u ovaj preglednik, a jedini način da spremite svoj rad natrag u datoteku jest da je prepišete putem Datoteka, Spremi kao.';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='Otvorite datoteku projekta spremljenu s ove stranice.';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='Sprema u povezanu datoteku.';
$ec_lang['lpn_file_saveas_tip']='Odaberite datoteku u koju ćete spremiti. Ovaj projekt se povezuje s tom datotekom, i Spremi od tada zapisuje u nju.';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='Sprema pomoću postavki preuzimanja vašeg preglednika. Ovaj preglednik se ne može povezati s datotekom, pa je Spremi onemogućeno i dostupno je samo Spremi kao. Ako uključite postavku preglednika „Pitaj gdje spremiti svaku datoteku”, možete odabrati izvornu datoteku i prepisati je.';
$ec_lang['lpn_status_uploaded']='Projektna datoteka je prenesena. Veza s njom se ne može održavati, pa je jedini način da spremite natrag u nju putem Datoteka, Spremi kao.';
$ec_lang['lpn_status_downloaded']='Preuzeto {file}. Ovaj preglednik se ne može povezati s datotekom, pa ovaj projekt ostaje označen kao nespremljen u datoteku.';
$ec_lang['lpn_status_file_opened']='Otvoreno {file}.';
$ec_lang['lpn_status_already_open']='Ta datoteka je ovdje već otvorena kao {name}, pa je prebačeno na nju umjesto otvaranja druge kopije.';
$ec_lang['lpn_status_already_open_dirty']='Ta datoteka je ovdje već otvorena kao {name}, s promjenama koje niste spremili u nju. Prebačeno je na nju umjesto otvaranja druge kopije. Upotrijebite Datoteka, Vrati ako umjesto toga želite verziju s diska.';
$ec_lang['lpn_status_saved']='Spremljeno {file}.';
$ec_lang['lpn_status_reverted']='Ponovno učitano {file} s diska.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Spremiti promjene u {name} prije zatvaranja?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} se čuva samo u ovom pregledniku. Ako ga zatvorite bez spremanja u datoteku, zauvijek je izgubljen.';
$ec_lang['lpn_close_discard']='Zatvori bez spremanja';
$ec_lang['lpn_cancel']='Odustani';
$ec_lang['lpn_revert_confirm']='Odbaciti promjene koje ste napravili i ponovno učitati {file} s diska?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Ovaj projekt potječe iz {file}, ali veza s tom datotekom je izgubljena. Ponovno odaberite datoteku za povezivanje.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Nije moguće zapisati u datoteku. Možda je premještena ili preimenovana, ili je dopuštenje povučeno. Vaš rad je i dalje spremljen u ovom pregledniku.';
$ec_lang['lpn_file_changed_elsewhere']='Netko drugi je spremio u ovu datoteku otkako ste je otvorili, pa bi spremanje sada prepisalo njihov rad. Upotrijebite Datoteka, Spremi kao da zadržite svoje promjene u vlastitoj datoteci, ili Datoteka, Vrati da odbacite svoje i učitate njihove.';
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
$ec_lang['lpn_lock_somebody']='Netko drugi';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} ima ovu datoteku otvorenu.';
$ec_lang['lpn_lock_open_readonly']='Otvori samo za čitanje';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Preuzmi zaključavanje';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Čini se da je ova datoteka u upotrebi.';
$ec_lang['lpn_lock_open_care']='Da izbjegnete gubitak podataka, pažljivo odaberite između opcija ispod.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='U upotrebi je {x}.';
$ec_lang['lpn_lock_age_edited']='Posljednji put uređena prije {x}.';
$ec_lang['lpn_lock_age_saved']='Posljednji put spremljena prije {x}.';
$ec_lang['lpn_lock_age_never_saved']='Ništa još nije spremljeno u ovu datoteku.';
$ec_lang['lpn_lock_age_unknown']='Ne postoji zapis o tome koliko je dugo u upotrebi, ili kada je posljednji put spremljena ili uređena.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='„Pitaj” obavještava onoga tko ima ovu datoteku otvorenu da biste je željeli, i ništa drugo ne mijenja. „Otvori samo za čitanje” omogućuje vam da je pregledate i mijenjate što god želite, bez mogućnosti spremanja ovdje. „Prekini zaključavanje” omogućuje vam da spremite preko datoteke; njihov nespremljeni rad se ne gubi, ali više neće moći spremati ovdje, pa će netko možda morati ručno spojiti ta dva.';
$ec_lang['lpn_lock_ask']='Pitaj';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Koga da navedemo kao onoga tko pita? Vaši inicijali su idealni. Šalju se onome tko ima datoteku otvorenu, a pohranjuju se samo u ovom pregledniku.';
$ec_lang['lpn_lock_ask_sent']='Zamolili smo onoga tko ima ovu datoteku otvorenu da je zatvori. Vidjet će to u roku od minute, ako je njegova stranica još otvorena. Ništa se drugo nije promijenilo, a datoteka je i dalje njegova dok je ne zatvori.';
$ec_lang['lpn_lock_ask_failed']='Vaša poruka nije mogla biti dostavljena. Ili nitko trenutačno nema ovu datoteku otvorenu, ili poslužitelj nije bio dostupan.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Ta datoteka nije otvorena, a ništa se ovdje nije promijenilo. Netko drugi je i dalje ima otvorenu.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} bi želio urediti ovu datoteku. Kada budete spremni, spremite svoj rad i koristite Datoteka, Zatvori projekt da je predate.';
$ec_lang['lpn_ago_seconds']='{n} sekundi';
$ec_lang['lpn_ago_minutes']='{n} minuta';
$ec_lang['lpn_ago_hours']='{n} sati';
$ec_lang['lpn_ago_days']='{n} dana';
$ec_lang['lpn_ago_unknown']='nepoznato vrijeme';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Poruke';
$ec_lang['lpn_msglog_heading']='Nedavne poruke';
$ec_lang['lpn_msglog_empty']='Još nema poruka.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='prije {x}';
$ec_lang['lpn_msglog_note']='Najnovije prve. Ova stranica čuva posljednjih {n} poruka dok je otvorena, a ništa se ne pohranjuje na vaše računalo.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Samo za čitanje: {name} ima ovu datoteku otvorenu. Ovdje možete promijeniti što god želite, ali ne možete spremiti. Upotrijebite Datoteka, Spremi kao za spremanje u drugu datoteku.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Upozorenje: nije moguće doseći poslužitelj za provjeru ili stvaranje zaključavanja ovog projekta, pa ništa ne sprječava kolegu da istovremeno uređuje istu datoteku. Bit ćete obaviješteni ako zaključavanje ponovno počne raditi.';
$ec_lang['lpn_lock_storage_error']='Upozorenje: ova stranica ne može spremiti zapise o zaključavanju, pa ništa ne sprječava kolegu da istovremeno uređuje istu datoteku. Ovo je pogreška u postavljanju poslužitelja, nešto što ovdje ne možete popraviti — mapa za zaključavanje nije zapisiva od strane web poslužitelja.';
$ec_lang['lpn_lock_full_error']='Upozorenje: ovoj stranici je ponestalo prostora za bilježenje tko ima koji projekt otvoren, pa ništa ne sprječava kolegu da istovremeno uređuje istu datoteku. Ovo je pogreška u postavljanju poslužitelja, nešto što ovdje ne možete popraviti.';
$ec_lang['lpn_lock_not_asked']='Zaključavanje ne radi za ovaj projekt, pa ništa ne sprječava kolegu da istovremeno uređuje istu datoteku. Ovaj preglednik za vas još nema zabilježeno ime, ili projekt nema identifikator — spremanje projekta u datoteku postavlja oboje.';
$ec_lang['lpn_lock_restored']='Zaključavanje ponovno radi, i sada možete spremati u ovu datoteku.';
$ec_lang['lpn_lock_dismiss']='Sakrij ovu poruku';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Vaš projekt bit će spremljen u datoteku na ovom računalu. Sprema se kada to zatražite, i ni u jednom drugom trenutku, pa se ništa ne zapisuje u tu datoteku bez vašeg znanja.';
$ec_lang['lpn_file_training_2']='Kako dvoje ljudi nikada ne bi istovremeno uređivali jednu datoteku, ova stranica prati tko je ima otvorenu. Ako je netko već ima otvorenu, i dalje je možete otvoriti i pogledati, ili zadržati vlastitu kopiju.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='Prvi put kada spremite, vaš preglednik će pitati smije li ova stranica uređivati datoteku. To pitanje dolazi od preglednika, a ne od nas, i potvrdni odgovor je ono što omogućuje Spremi da zapiše vaš rad natrag. Obično se pita samo jednom po datoteci.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Nastavi';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Ponovno odaberite datoteku';
$ec_lang['lpn_file_reconnect']='Ponovno se poveži s ovom datotekom';
$ec_lang['lpn_file_reconnect_alert']='Ovaj projekt potječe iz {file}. Vašem pregledniku ponovno je potrebno vaše dopuštenje prije nego što može zapisivati u nju. Ponovno se povežite ispod.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='To je ista datoteka koju netko drugi ima otvorenu, pa se ne može prepisati. Odaberite drugu datoteku ili drugo ime.';
$ec_lang['lpn_saveas_overwrites_project']='Ta datoteka već sadrži drugi projekt, {name}. Spremanje ovdje ga potpuno zamjenjuje. Nastaviti?';
$ec_lang['lpn_saveas_overwrites_newer']='Ta datoteka se promijenila otkako ste je posljednji put vidjeli, pa je gotovo sigurno netko drugi spremio u nju. Spremanje ovdje zamjenjuje njihovu verziju vašom. Nastaviti?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Naziv za ovaj projekt';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='Zatvoreno {closed}. Sada prikazano {opened}.';
$ec_lang['lpn_status_closed_empty']='Zatvoreno {closed}. Pokrenut novi prazan projekt.';
$ec_lang['lpn_storage_full']='Nije spremljeno. Pohrana preglednika je puna ili nedostupna, pa će vaše nedavne promjene biti izgubljene kada zatvorite ovu karticu.';
$ec_lang['lpn_storage_unreadable']='Nije spremljeno. Ovaj se projekt nije mogao pročitati iz pohrane preglednika. Njegova pohranjena kopija ostaje točno onakva kakva jest i neće biti prepisana, pa se ništa na ovoj kartici ne sprema. Otvorite datoteku ili napravite novi projekt da biste nastavili raditi.';
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
$ec_lang['lpn_about_credits']='Zasluge';
$ec_lang['lpn_help_welcome']='Stranica dobrodošlice';
$ec_lang['lpn_about_license']='Licencirano prema GNU General Public License v3.0 ili novijoj.';
$ec_lang['lpn_notes_1_term']='Kako se rješava';
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
$ec_lang['lpn_notes_1_def']='Svaki trenutak rješava se istim algoritmom globalnog gradijenta koji koristi EPANET. Postavite ukupno vrijeme rada i EPANET rješavač izračunava svaki korak izvještavanja redom: spremnici se pune i prazne, potražnje slijede svoje obrasce, a alatna traka reproducira pokretanje. Ugrađeni rješavač izračunava jedan trenutak odjednom i drži svaki spremnik na njegovoj početnoj razini.';
$ec_lang['lpn_notes_2_term']='Nije modelirano';
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
$ec_lang['lpn_notes_2_def']='Kemija kvalitete vode nije modelirana; starost vode i praćenje izvora jesu. Ventili: prigušni ventil radi u oba rješavača, a ventili koji sami postavljaju svoj položaj (PRV, PSV, FCV) rješavaju se EPANET rješavačem, kojeg ova stranica sama uključuje kada vaša mreža sadrži jedan od tih ventila.';
$ec_lang['lpn_notes_3_term']='Spremanje projekata';
$ec_lang['lpn_notes_3_def']='Svaki projekt je kartica, a svaka kartica se sprema u ovaj preglednik dok radite. Brisanje podataka preglednika briše ih sve, pa svoj rad čuvajte u datoteci: Datoteka, Spremi kao. Zvjezdica na kartici znači da sadrži promjene koje nisu u datoteci. Ništa se nikada ne zapisuje u datoteku osim ako to ne zatražite. U nekim preglednicima projekt se povezuje s datotekom u koju ga spremite, i Datoteka, Spremi od tada zapisuje natrag u tu istu datoteku; u drugima veza nije moguća, pa je Spremi onemogućeno i dostupno je samo Spremi kao. Kada je projektna datoteka na dijeljenom disku, ova stranica vas obavještava ako je kolega već ima otvorenu, tako da dvoje ljudi ne prepisuju jedno preko drugoga.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Krivulja pumpe';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Pumpa slijedi H = H₀ − aQ^b, gdje je H tlačna visina koju pumpa dodaje, a Q protok kroz nju. Unesite jednu, dvije ili tri točke s krivulje proizvođača. Tri točke — tlačna visina pri nultom protoku, normalna radna točka i točka najvišeg protoka — izravno određuju H₀, a i b, i najbliže prate objavljenu krivulju. Dvije točke određuju parabolu (b = 2) s vrhom pri nultom protoku. Jedna točka koristi uobičajeno pravilo: tlačna visina pri nultom protoku iznosi 1,33 × tlačna visina koju unesete, a najviši protok je 2 × protok koji unesete, što ponovno daje b = 2. Pumpa bez unesenih točaka ne dodaje nikakvu tlačnu visinu. Krivulja se ne prekida tamo gdje tlačna visina dosegne nulu, pa traženje od pumpe većeg protoka nego što njezina krivulja može isporučiti daje negativnu tlačnu visinu. Rješenje je veća pumpa ili manja potražnja, a ne drugačije prilagođavanje krivulje. Krivulja može sadržavati više od tri točke. Ugrađeni rješavač čita tri od njih — prvu, srednju i posljednju — da prilagodi gornju jednadžbu; EPANET rješavač čita svaku točku koju ste unijeli.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='Također na ovoj stranici';
$ec_lang['lpn_notes_4_def']='Projekt može biti postavljen na stvarni teren s kartom ulica iza sebe. EPANET .inp datoteke mogu se učitavati i zapisivati. Donja ploča crta profil duž rute i popisuje čvorove. Elementi se mogu obojiti prema svojim rezultatima, a Pronađi izdvaja svaki element koji zadovoljava uvjet koji zadate.';
$ec_lang['lpn_notes_6_term']='Pomoć za stupce tablice';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Odaberi stupac</td><td>Klik na zaglavlje</td></tr><tr><td>Dodaj ili proširi odabir stupaca</td><td>Ctrl+klik ili Shift+klik na drugo zaglavlje</td></tr><tr><td>Pomakni (promijeni redoslijed) odabranih stupaca</td><td>Povucite ili koristite Upravljaj stupcima… u izborniku desnog klika ili ⋮</td></tr><tr><td>Izbornik ⋮ i strelica za razvrstavanje.</td><td>Pređite mišem preko gornjeg kuta zaglavlja, ili odaberite ili se Tabom prebacite u zaglavlje</td></tr><tr><td>Sakrij, Prikaži sve, ili Upravljaj vidljivošću i redoslijedom</td><td>Desni klik na zaglavlje ili izbornik ⋮ u gornjem desnom kutu zaglavlja</td></tr><tr><td>Razvrstaj prema stupcu</td><td>Ikona strelice u gornjem desnom kutu zaglavlja</td></tr><tr><td>Zalijepi kao nove retke na kraju tablice</td><td>Desni klik, izbornik ⋮ u gornjem desnom kutu zaglavlja, ili Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Tipkovnički prečaci tablice';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Tipke sa strelicama</td><td>Kretanje.</td></tr><tr><td>Tab, Enter</td><td>Završi unos i prijeđi jednu ćeliju udesno / dolje.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Kretanje unatrag.</td></tr><tr><td>Shift+tipke sa strelicama</td><td>Proširi odabir.</td></tr><tr><td>Ctrl+C</td><td>Kopiraj odabir.</td></tr><tr><td>Ctrl+D</td><td>Popuni odabir prema dolje od njegovog gornjeg retka.</td></tr><tr><td>Ctrl+Enter</td><td>Popuni odabir vrijednošću aktivne ćelije.</td></tr><tr><td>Ctrl+A</td><td>Odaberi cijelu tablicu.</td></tr><tr><td>Ctrl+Shift+V</td><td>Zalijepi kao nove retke na kraju tablice.</td></tr><tr><td>Delete</td><td>Isprazni ćeliju.</td></tr><tr><td>F2</td><td>Otvori ćeliju za uređivanje.</td></tr><tr><td>Esc</td><td>Prekini uređivanje.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Granice raspona boja ostaju iste';
$ec_lang['lpn_notes_color_def']='Granice raspona boja postavljaju se kada odaberete metodu klasifikacije podataka. Ne postavljaju se ponovno u svakom vremenskom koraku, jer bi to značilo da boje u svakom koraku znače nešto novo, što ne pomaže pri vizualizaciji vašeg sustava. EPANET radi na isti način. Da biste dobili nove granice, ponovno odaberite metodu ili upišite svoje vlastite granice.';
$ec_lang['lpn_notes_epanet_term']='Hazen-Williams konstante odgovaraju EPANET-u';
$ec_lang['lpn_notes_epanet_def']='U kolovozu 2026. koeficijent i eksponent Hazen-Williamsa promijenjeni su kako bi odgovarali EPANET-u. Rezultati gubitka tlačne visine razlikuju se od ranijih verzija ove stranice do 0,1 posto, što je znatno manje od nesigurnosti same vrijednosti C.';
$ec_lang['lpn_notes_engine_term']='Koju verziju EPANET-a ova stranica pokreće';
$ec_lang['lpn_notes_engine_def']='EPANET rješavač na ovoj stranici je OWA-EPANET 2.3.5, objavljen 20. veljače 2025. EPANET razvija Open Water Analytics, zajednica koja surađuje s Agencijom za zaštitu okoliša Sjedinjenih Američkih Država (EPA), koja je verziju 2.2.0 objavila u prosincu 2019. Izvještaj o pokretanju naziva ga 2.3.05 jer program zadnji broj zapisuje u dvije znamenke. Do ove stranice dolazi preko epanet-js 0.9.0 autora Lukea Butlera, pod MIT licencijom, i radi unutar vašeg preglednika: vaša mreža se nikada ne šalje nikamo na rješavanje.';
$ec_lang['lpn_id_invalid']='Unesite ID bez razmaka i bez navodnika.';
$ec_lang['lpn_id_taken']='Taj ID je već u upotrebi.';
$ec_lang['lpn_diag_no_fixed_head']='Dodajte rezervoar ili spremnik. Mreža treba barem jednu poznatu razinu vode prije nego što se može riješiti.';
$ec_lang['lpn_diag_dangling_link']='Cijev ili pumpa spaja se na čvor koji više ne postoji:';
$ec_lang['lpn_diag_unreachable']='Ovi čvorovi nemaju put do rezervoara:';
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
$ec_lang['lpn_engine_fetching']='Preuzimanje EPANET rješavača. Preuzima se jednom i zatim ostaje na ovom uređaju, pa nakon toga radi i bez internetske veze.';
$ec_lang['lpn_engine_ready']='EPANET rješavač sada je na ovom uređaju i radi bez internetske veze.';
$ec_lang['lpn_engine_fetching_valve']='Preuzimanje EPANET rješavača, kako bi se ovaj ventil mogao izračunati sada, a poslije i bez internetske veze.';
$ec_lang['lpn_engine_ready_valve']='EPANET rješavač sada je na ovom uređaju. Ventili koji se sami otvaraju i zatvaraju radit će i bez internetske veze.';
$ec_lang['lpn_engine_unavailable']='EPANET rješavač nije bilo moguće preuzeti, a upravo on izračunava ventile koji se sami otvaraju i zatvaraju. Povežite se s internetom jednom, i on ostaje na ovom uređaju otada.';
$ec_lang['lpn_engine_needed_loading']='Učitavanje EPANET rješavača dok gradite. Rezultati će biti dostupni kada bude potpuno učitan.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Napredak učitavanja rješavača';
$ec_lang['lpn_engine_wait']='Učitavanje rješavača. Rezultati su trenutačno odgođeni. Nastavite s radom.';
$ec_lang['lpn_engine_wait_pct']='Rješavač učitan {percent}%.';
$ec_lang['lpn_engine_wait_bytes']='Rješavač učitan {kb} KB dosad. Ukupna veličina nije dostupna, pa je postotak dovršenosti nepoznat.';
$ec_lang['lpn_engine_needed_failed']='EPANET rješavač još nije učitan, ne može se učitati, a ova mreža može se riješiti samo njime. Bit će učitan kada budete povezani s internetom.';
$ec_lang['lpn_diag_valve_needs_epanet']='Ovi ventili se sami otvaraju i zatvaraju, a izračunati ih može samo EPANET rješavač. EPANET rješavač nije se mogao učitati, pa nedostaju sljedeći rezultati:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Ovi ventili spojeni su izravno na rezervoar ili spremnik, koji već određuje razinu vode ondje, pa ventilu ne preostaje ništa za regulirati. Umetnite kratku cijev između ventila i rezervoara ili spremnika:';
$ec_lang['lpn_diag_not_converged']='Rješenje nije pronađeno. Provjerite ima li vrijednosti koje su nemoguće u stvarnosti, poput promjera nula.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Rješavanje nije konvergiralo. Ovi brojevi su posljednja iteracija, a ne rezultat. Nemojte ih koristiti.';
$ec_lang['lpn_diag_not_converged_trials']='Zaustavljeno je nakon {iterations} iteracija.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Zaustavljeno je nakon {iterations} iteracija uz relativnu pogrešku od {error}, što nije doseglo postavku Točnost od {accuracy}.';
$ec_lang['lpn_field_roughness']='Hrapavost';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Hazen-Williams C. Veći broj znači glađu cijev: oko 150 za novu plastiku, 130 za novi čelik ili željezo, i 100 za staru cijev.';
$ec_lang['lpn_field_length']='Duljina';
$ec_lang['lpn_field_from']='Od';
$ec_lang['lpn_field_to']='Do';
$ec_lang['lpn_field_length_tip']='Duljina cijevi. Kada je uključeno Automatski, duljina se mjeri prema onome što ste nacrtali. Isključite Automatski da unesete duljinu koja se razlikuje od crteža.';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Vrsta ventila';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Što ventil radi. Prigušni ventil održava fiksni gubitak. Ostala tri održavaju tlak ili protok te se potpuno otvaraju, zatvaraju ili djelomično prigušuju kako se voda mijenja. Promjena vrste postavlja novu početnu vrijednost u polje postavke ispod, jer tlak nije protok, a ni jedno ni drugo nije koeficijent gubitka.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Prigušni (TCV)';
$ec_lang['lpn_valve_type_prv']='Za redukciju tlaka (PRV)';
$ec_lang['lpn_valve_type_psv']='Za održavanje tlaka (PSV)';
$ec_lang['lpn_valve_type_fcv']='Za regulaciju protoka (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Za rasterećenje tlaka (PBV)';
$ec_lang['lpn_valve_type_gpv']='Opće namjene (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Pad tlaka';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='Tlak koji ventil oduzima. Rasterećivač tlaka uvijek uklanja točno ovoliko tlaka, bez obzira u kojem smjeru voda teče. To je pad tlaka kroz ventil, a ne tlak koji se održava.';
$ec_lang['lpn_inp_drop_gpv_curve']='Ovaj ventil navodi krivulju gubitka tlačne visine koja nije u datoteci. Ventil je uvezen bez krivulje, pa ostaje potpuno otvoren dok mu je ne dodijelite.';
$ec_lang['lpn_gpv_curve_source']='Krivulja gubitka tlačne visine ventila';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Krivulja u okviru Knjižnice koja govori koliku tlačnu visinu ovaj ventil gubi pri svakom protoku. Više ventila može koristiti istu krivulju, a njezino uređivanje ondje mijenja sve njih. Ovaj ventil sadrži samo referencu; same točke čitaju se i uređuju pod Knjižnice, Krivulje.';
$ec_lang['lpn_field_valve_setting_pressure']='Postavka tlaka';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Tlak koji ventil održava. Ventil za redukciju tlaka održava tlak na svojoj nizvodnoj strani na ovoj vrijednosti ili niže. Ventil za održavanje tlaka održava tlak na svojoj uzvodnoj strani na ovoj vrijednosti ili više.';
$ec_lang['lpn_field_valve_setting_flow']='Postavka protoka';
$ec_lang['lpn_field_valve_setting_flow_tip']='Najveća količina vode koju ventil propušta. Kad kroz njega želi proći manje vode od ove vrijednosti, ventil ostaje potpuno otvoren i ne dodaje gubitak.';
$ec_lang['lpn_field_valve_setting']='Postavka';
$ec_lang['lpn_field_valve_setting_loss']='Koeficijent gubitka';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Koliko tlačne visine prigušni ventil oduzima, izraženo kao višekratnik brzinske visine. Upotrijebite 0 za potpuno otvoren ventil. Ovaj jedan broj predstavlja cjelokupni gubitak prigušnog ventila.';
$ec_lang['lpn_field_valve_diameter_tip']='Širina otvora kroz ventil. Brzina vode kroz ventil izračunava se iz ove širine, a gubitak proizlazi iz te brzine.';
$ec_lang['lpn_field_valve_km_tip']='Gubitak iz tijela ventila dok je ventil potpuno otvoren, uz sve što oduzima postavka ventila. Izražava se kao višekratnik brzinske visine. Upotrijebite 0 da ga zanemarite.';
$ec_lang['lpn_field_km']='Koeficijent lokalnog (manjeg) gubitka, k';
$ec_lang['lpn_field_km_tip']='Gubitak od koljena, ventila i fitinga na ovoj cijevi, izražen kao višekratnik brzinske visine. Koristite 0 za običnu ravnu cijev.';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Lokalni gubitak, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Krivulja tlačne visine pumpe';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Krivulja u okviru Knjižnice koja govori koliku tlačnu visinu ova pumpa dodaje pri svakom protoku. Više pumpi može koristiti istu krivulju, a njezino uređivanje ondje mijenja sve njih. Ova pumpa sadrži samo referencu; same točke čitaju se i uređuju pod Knjižnice, Krivulje.';
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
$ec_lang['lpn_field_desc']='Opis';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='Za vašu vlastitu upotrebu, poput uličnog ugla ili materijala od kojeg je cijev izrađena. Prenosi se u EPANET datoteku i iz nje, gdje se nalazi na kraju retka tog dijela. Nijedan izračun ga ne čita. Prijelom retka postaje razmak, jer datoteka nema gdje ga smjestiti.';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Oznaka';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Oznaka može imati bilo koje značenje koje vam treba, poput zone tlaka ili radnog naloga. Nikakav izračun ovdje ni u EPANET-u je ne čita. Oznaka je jedna riječ: EPANET prestaje čitati na prvom razmaku, pa se razmak odbija dok ga upisujete. Prenosi se u EPANET datoteku i iz nje.';
$ec_lang['lpn_pump_effic_curve']='Krivulja učinkovitosti pumpe';
$ec_lang['lpn_pump_effic_curve_tip']='Krivulja u okviru Knjižnice koja govori koliko je ova pumpa učinkovita pri svakom protoku. Više pumpi može koristiti istu krivulju, a njezino uređivanje ondje mijenja sve njih. Ova pumpa sadrži samo referencu; same točke čitaju se i uređuju pod Knjižnice, Krivulje.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Nijedna krivulja nije odabrana';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Krivulje';
$ec_lang['lpn_curve_library_link_tip']='Otvara okvir Knjižnice na odjeljku Krivulje, gdje se krivulja dodaje, opisuje, uređuje i briše. Element navodi koju krivulju koristi.';
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
$ec_lang['lpn_curve_kind_head']='Tlačna visina pumpe';
$ec_lang['lpn_curve_kind_effic']='Učinkovitost pumpe';
$ec_lang['lpn_curve_kind_volume']='Volumen spremnika';
$ec_lang['lpn_curve_kind_headloss']='Gubitak tlačne visine ventila';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Vrsta nije navedena';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Volumen';
$ec_lang['lpn_pump_effic_col']='Učinkovitost';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Ova pumpa nema odabranu krivulju učinkovitosti, pa radi s učinkovitosti postavljenom za cijelu mrežu, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Ova pumpa navodi krivulju učinkovitosti pod nazivom {name}, koju ništa u ovom projektu ne definira, pa radi s učinkovitosti postavljenom za cijelu mrežu, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Način rada: Odabir. Kliknite element ili oznaku da je vidite ili promijenite. Povucite da pomaknete čvor, točku loma ili oznaku. Koristite alat Točke loma da dodate ili uklonite savijanja na cijevi.';
$ec_lang['lpn_mode_delete']='Način rada: Brisanje. Kliknite element da ga uklonite.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Način rada: Točke loma. Točke loma svake cijevi prikazane su kao mala kvadratna hvatišta. Kliknite cijev da dodate točku loma, kliknite hvatište da ga uklonite, ili ga povucite da ga pomaknete. Ništa se drugo na karti ne mijenja u ovom načinu rada.';
$ec_lang['lpn_mode_zoom_window']='Način rada: Zumiraj prozor. Kliknite dva nasuprotna kuta okvira, ili ga povucite, na karti da zumirate na njega.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Ništa nije odabrano. Prvo kliknite element na karti, a zatim pritisnite Izbriši.';
$ec_lang['lpn_mode_add_junction']='Način rada: Dodaj čvor. Kliknite kartu da postavite čvor. Prebacite se u način Odabir da promijenite ili pomaknete elemente i oznake.';
$ec_lang['lpn_mode_add_reservoir']='Način rada: Dodaj rezervoar. Kliknite kartu da postavite rezervoar. Prebacite se u način Odabir da promijenite ili pomaknete elemente i oznake.';
$ec_lang['lpn_mode_add_tank']='Način rada: Dodaj spremnik. Kliknite kartu da postavite spremnik. Prebacite se u način Odabir da promijenite ili pomaknete elemente i oznake.';
$ec_lang['lpn_mode_add_pipe']='Način rada: Dodaj cijev. Kliknite čvor, a zatim drugi čvor, da ih povežete. Kliknite otvoreni prostor između njih da savijete liniju, ili pritisnite Escape da počnete iznova. Prebacite se u način Odabir da promijenite ili pomaknete elemente i oznake.';
$ec_lang['lpn_mode_add_pump']='Način rada: Dodaj pumpu. Kliknite čvor, a zatim drugi čvor, da ih povežete. Kliknite otvoreni prostor između njih da savijete liniju, ili pritisnite Escape da počnete iznova. Prebacite se u način Odabir da promijenite ili pomaknete elemente i oznake.';
$ec_lang['lpn_mode_add_valve']='Način rada: Dodaj ventil. Kliknite čvor, a zatim drugi čvor, da ih povežete. Kliknite otvoreni prostor između njih da savijete liniju, ili pritisnite Escape da počnete iznova. Prebacite se u način Odabir da promijenite ili pomaknete elemente i oznake.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Način rada: Dodaj tekst. Kliknite kartu da postavite tekst. Kliknite blizu čvora da pridružite tekst tom čvoru. Prebacite se u način Odabir da promijenite ili pomaknete elemente i oznake.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Koristite ovaj način rada da promijenite, pomaknete i povlačite stvari na karti. Ovo je način rada u koji se stranica vraća prema zadanome: sama se ovamo vraća nakon nekih radnji, poput otvaranja projekta, a [Esc] vas iz bilo kojeg drugog načina vraća ovamo.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='Oznaku možete povući da je pomaknete. Dvaput kliknite oznaku da je vratite na automatski položaj.';
$ec_lang['lpn_field_auto']='Automatski';
$ec_lang['lpn_method_switch_confirm']='Promjena metode trenja ne mijenja brojeve hrapavosti koji su već upisani na vašim cijevima, a hrapavost za jednu metodu nema smisla za drugu. Nakon ovoga provjerite svaku cijev. Ipak promijeniti?';
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
$ec_lang['lpn_field_closed']='Zatvoreno';
$ec_lang['lpn_field_closed_tip']='Zatvorite ovu cijev tako da kroz nju ne može proći voda. Cijev ostaje na karti i zadržava sve svoje vrijednosti, a možete je ponovno otvoriti u bilo kojem trenutku.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Zemljopisna dužina';
$ec_lang['lpn_field_lat']='Zemljopisna širina';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Sjeverna koordinata';
$ec_lang['lpn_field_easting']='Istočna koordinata';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='S';
$ec_lang['lpn_field_easting_abbr']='I';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.


// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Upišite koordinatni položaj da precizno postavite ovaj čvor. U scenariju ovaj položaj vrijedi samo u tom scenariju, isto kao i povlačenje; u Bazi postavlja čvor posvuda.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='To je izvan karte. Pseudo Mercator zemljopisna širina kreće se od -85,05 do 85,05, a zemljopisna dužina od -180 do 180.';
$ec_lang['lpn_field_text_size']='Množitelj veličine';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Prikaži na svim razinama uvećanja';
$ec_lang['lpn_field_text_all_zoom_tip']='Zadrži ovaj tekst na crtežu koliko god zumirali. Isključite ovo i tekst se skriva s ostalim oznakama čim je prikaz širi od praga za prikaz oznaka postavljenog pod Karta i stranica.';
$ec_lang['lpn_tool_labels']='Oznake';
$ec_lang['lpn_labels_heading_node']='Oznake čvorova';
$ec_lang['lpn_labels_heading_link']='Oznake vodova';
$ec_lang['lpn_labels_decimals_tip']='Broj decimalnih mjesta prikazan za ovu oznaku';
$ec_lang['lpn_labels_mark_extrema']='Označi najveće i najmanje vrijednosti';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Crta liniju iznad najviše vrijednosti svakog označenog svojstva na karti (nadcrtu), i liniju ispod najniže vrijednosti tog svojstva (podcrtu), tako da možete uočiti najveću i najmanju vrijednost bez čitanja brojeva.';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Primijeni na sve';
$ec_lang['lpn_settings_apply_to_all_tip']='Svaki već nacrtani element ove vrste dobiva ID koji počinje ovim tekstom. Svaki zadržava svoj broj. ID koji ne završava brojem ostaje nepromijenjen.';
$ec_lang['lpn_confirm_apply_prefix']='Preimenovati {n} elemenata tako da njihovi ID-ovi počinju s {prefix}? Svaki zadržava svoj broj.';
$ec_lang['lpn_prefix_applied']='Preimenovano {n} elemenata. {skipped} drugih ostalo je nepromijenjeno.';
$ec_lang['lpn_labels_prefix_tip']='Tekst dodan prije ovog svojstva na oznakama karte';
$ec_lang['lpn_labels_suffix_tip']='Tekst dodan nakon ovog svojstva na oznakama karte';
$ec_lang['lpn_labels_suffix_gradient_tip']='Tekst dodan nakon gradijenta gubitka tlačne visine na oznakama karte. Ovdje nemojte upisivati znak postotka. On se dodaje umjesto vas kada su jedinice postotak.';
$ec_lang['lpn_labels_separator']='Tekst između vrijednosti';
$ec_lang['lpn_labels_separator_tip']='Tekst između jednog svojstva i sljedećeg na oznaci. Prema zadanome, razmak.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Prioritet';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='Redoslijed kojim se vrijednosti izostavljaju kada oznaka ne stane. 1 se zadržava najdulje.';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='Redoslijed kojim se svojstva izostavljaju kada bi se dvije oznake čvorova preklapale. Svojstvo s brojem 1 izostavlja se prvo, na obje oznake. Kada preostane samo jedno svojstvo, a njih dvije se i dalje preklapaju, cijela se oznaka skriva: ona čija je preostala vrijednost najmanje vrijedna prikazivanja, što znači najniža potražnja, tlak najbliži sredini raspona, ili kota ili tlačna visina najbliža susjednim čvorovima.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Prije';
$ec_lang['lpn_labels_col_after']='Poslije';
$ec_lang['lpn_labels_col_decimals']='Decimale';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Prikaži';
$ec_lang['lpn_labels_show_tip']='Redoslijed kojim se vrijednosti pojavljuju na oznaci. Vrijednost s brojem 1 dolazi prva: na vrhu slagane oznake, i na početku oznake u jednom retku.';
$ec_lang['lpn_labels_priority_customer_tip']='Redoslijed kojim se vrijednosti izostavljaju s oznake korisnika. Vrijednost s brojem 1 izostavlja se prva.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Koristi jedinice';
$ec_lang['lpn_labels_use_units_tip']='Označite da prikažete jedinicu u okviru Poslije i na oznaci, i da je držite usklađenom kada se jedinice mijenjaju. Odznačite da upišete vlastiti tekst Poslije.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Početno stanje';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Boje čvorova';
$ec_lang['lpn_settings_sym_link_colors']='Boje vodova';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Pozadinska slika…';
$ec_lang['lpn_backdrop_add']='Dodaj';
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
$ec_lang['lpn_backdrop_scale']='Postavi mjerilo';
$ec_lang['lpn_backdrop_scale_entry']='Mjerilo prema datoteci za georeferenciranje ili veličini jednog piksela na karti';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Promijeni mjerilo od trenutačne veličine, oko točke koju odaberete';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Kliknite točku na pozadinskoj slici koja treba ostati na svom mjestu.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Promijenite mjerilo od trenutačne veličine. 1 je zadržava istom, 1,1 je povećava za 10%, 0,9 je smanjuje za 10%.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Unesite veličinu jednog piksela na karti ili zalijepite cjelokupni sadržaj datoteke za georeferenciranje slike';
$ec_lang['lpn_backdrop_scale_entry_bad']='Upišite jedan broj za veličinu jednog piksela na karti ili zalijepite svih šest redaka datoteke za georeferenciranje.';
$ec_lang['lpn_backdrop_wld_bad']='Ova datoteka za georeferenciranje rotira, zrcali ili neravnomjerno rasteže sliku. Karta može samo pomaknuti sliku i promijeniti joj veličinu jednako u oba smjera, pa datoteka nije korištena.';
$ec_lang['lpn_backdrop_unreadable']='Vaš preglednik ne može prikazati ovu sliku. Spremite je kao PNG ili JPEG i dodajte je ponovno.';
$ec_lang['lpn_backdrop_position']='Pomakni';
$ec_lang['lpn_backdrop_remove']='Ukloni';
$ec_lang['lpn_backdrop_remove_confirm']='Ukloniti pozadinsku sliku?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Karta svijeta…';
$ec_lang['lpn_map_attach_tip']='Pridružite kartu svijeta ovom projektu, bez ikakve druge promjene.';
$ec_lang['lpn_map_attach_add']='Pridruži';
$ec_lang['lpn_map_attach_readjust']='Ponovno namjesti';
$ec_lang['lpn_map_attach_readjust_tip']='Vratite se na Korak 2 postupka pridruživanja karte.';
$ec_lang['lpn_map_attach_scale_from']='Promijeni mjerilo od trenutačne veličine…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Promijenite mjerilo karte od njezine trenutačne veličine, oko sredine vašeg crteža. 1 je zadržava istom, 1,1 je čini 10% većom, 0,9 je čini 10% manjom.';
$ec_lang['lpn_map_attach_scale_from_bad']='Upišite jedan broj veći od nule.';
$ec_lang['lpn_map_attach_scale_from_done']='Karti je promijenjena veličina, a vaš crtež i svaka koordinata u njemu ostaju točno kakvi su bili.';
$ec_lang['lpn_map_attach_none']='Ovom projektu još nije pridružena karta svijeta. Prvo koristite Karta, Karta svijeta, Pridruži.';
$ec_lang['lpn_map_attach_remove']='Odvoji';
$ec_lang['lpn_map_attach_remove_tip']='Uklonite kartu svijeta. Crtež i njegove koordinate ostaju netaknuti u oba slučaja.';
$ec_lang['lpn_map_attach_done']='Karta svijeta je sada iza vašeg crteža, a vaš projekt nije promijenjen. Koristite Karta, Karta svijeta, Odvoji da je ponovno uklonite.';
$ec_lang['lpn_map_attach_removed']='Karta svijeta je uklonjena, a crtež je točno kakav je bio.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Vaš crtež nalazi se na karti cijelog svijeta, u oceanu na nultoj zemljopisnoj širini i nultoj zemljopisnoj dužini. Prvo pronađite svoje mjesto: pomičite i zumirajte kartu iza crteža, pretražite naziv mjesta, ili upišite zemljopisnu širinu i dužinu. Sam crtež se ne pomiče.';
$ec_lang['lpn_mapgeo_step1']='Korak 1 od 2: pronađite svoje mjesto u svijetu';
$ec_lang['lpn_mapgeo_step2']='Korak 2 od 2: namjestite kartu iza vašeg crteža';
$ec_lang['lpn_mapgeo_hint1']='Pomičite i zumirajte kartu iza vašeg crteža, ili pretražite mjesto, ili upišite zemljopisnu širinu i dužinu. Zatim pritisnite Postavi približno.';
$ec_lang['lpn_mapgeo_readjust_intro']='Vaš crtež je ondje gdje ste ga posljednji put postavili. Da ga premjestite drugamo, pomičite i zumirajte kartu iza crteža, pretražite naziv mjesta, ili upišite zemljopisnu širinu i dužinu. Sam crtež se ne pomiče.';
$ec_lang['lpn_mapgeo_hint2']='Povucite bilo gdje da pomaknete kartu ispod svog crteža. Vaš crtež i svaka koordinata u njemu ostaju točno gdje jesu. Pritisnite Georeferenciraj ovdje kada je karta ispravna.';
$ec_lang['lpn_mapgeo_gestures']='Zumiranje pomiče vaš crtež i kartu zajedno, tako da vidite koliko se dobro poklapaju. Povlačenje pomiče samo kartu.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Zakreni kartu';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} stupnjeva';
$ec_lang['lpn_mapgeo_dial_size']='Veličina karte';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} puta';
$ec_lang['lpn_mapgeo_dial_help']='Povucite dvije trake, ili upišite u okvire iznad njih, da kartu povećate ili smanjite i da je zakrenete. Sredina svake trake je stanje kakvo je bilo nakon koraka 1, pa 1 i 0 znače ostavi kako jest. Tipke sa strelicama rade na obje.';
$ec_lang['lpn_mapgeo_place']='Postavi približno';
$ec_lang['lpn_mapgeo_finish']='Georeferenciraj ovdje';
$ec_lang['lpn_mapgeo_cancelled']='Karta svijeta je natrag ondje gdje je bila, a vaš crtež se nikad nije pomaknuo.';
$ec_lang['lpn_mapgeo_locked']='Završite gumbom Georeferenciraj ovdje, ili pritisnite Odustani, prije nego što promijenite projekt ili spremite. Karta svijeta se još uvijek postavlja.';
$ec_lang['lpn_backdrop_scale_prompt1']='Kliknite dvije točke na pozadinskoj slici, primjerice dva kraja mjerila. Zatim upišite stvarnu udaljenost između njih.';
$ec_lang['lpn_backdrop_scale_prompt2']='Stvarna udaljenost između dviju točaka';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Kliknite baznu točku (na slici) za pomicanje.';
$ec_lang['lpn_backdrop_position_prompt2']='Odaberite način za odredišnu točku, zatim kliknite Nastavi.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Prilagodba pozadinske slike.';
$ec_lang['lpn_backdrop_target_label']='Pomakni tu točku na:';
$ec_lang['lpn_backdrop_target_node']='Čvor';
$ec_lang['lpn_backdrop_target_free']='Bilo koju točku na karti';
$ec_lang['lpn_backdrop_target_coords']='Koordinate koje upišete';
$ec_lang['lpn_backdrop_coords_prompt']='Upišite X,Y na koje bi se ta točka trebala pomaknuti';
$ec_lang['lpn_backdrop_continue']='Nastavi';
$ec_lang['lpn_tool_settings']='Postavke';
$ec_lang['lpn_settings_show_titles']='Prikaži naslove stranice';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='Skriva naslov stranice i pozdravni redak iznad crteža, tako da karta ima više prostora. Ispis se ne mijenja.';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Sakrij ove naslove';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Prikaži pomoć za odabir';
$ec_lang['lpn_settings_area_hint_tip']='Prikazuje mjehurić iznad karte koji govori što će učiniti vaš sljedeći klik dok odabirete područje.';
$ec_lang['lpn_settings_id_prefixes']='Prefiksi ID-a';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Vrijednosti novih elemenata';
$ec_lang['lpn_settings_defaults_note']='Koristi se za elemente koje stvorite od sada. Postojeći elementi se ne mijenjaju.';
$ec_lang['lpn_settings_push_note']='Primjenjuju se samo svojstva čije su oznake trenutno prikazane.';
$ec_lang['lpn_settings_push_btn']='Primijeni ove vrijednosti za nove elemente na svaki postojeći element';
$ec_lang['lpn_push_confirm']='Zamijeniti ova svojstva na svakom postojećem elementu vrijednostima koje su sada postavljene za nove elemente? Vrijednosti koje ste upisali bit će prepisane. Ovo možete poništiti.';
$ec_lang['lpn_push_properties']='Svojstva:';
$ec_lang['lpn_push_assets']='Čvorovi i cijevi:';
$ec_lang['lpn_push_none_displayed']='Nijedna početna vrijednost trenutno nije prikazana kao oznaka, pa nema ništa za primijeniti. Uključite oznake za svojstva koja želite u ploči Oznake, zatim pokušajte ponovno.';
$ec_lang['lpn_push_nothing']='Nijedan postojeći element nema nijedno od svojstava koja se primjenjuju.';
$ec_lang['lpn_push_no_change']='Svaki element već ima ove vrijednosti, pa se ništa ne bi promijenilo.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Prilagođena svojstva';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Svojstva koja sami definirate za vlastite potrebe. Pohranjuju se uz projekt i scenarije kao i sva druga svojstva.';
$ec_lang['lpn_cp_design']='Oblikovanje';
$ec_lang['lpn_cp_design_tip']='Jedan redak po prilagođenom svojstvu, a svaki se otvara i prikazuje: Ključ, Naziv, Odnosi se na, Provjeri kao, Dopusti ili ograniči, polje znakova imenovano tim izborom, Donja granica duljine, Gornja granica duljine, Donja granica, Gornja granica.';
$ec_lang['lpn_cp_add']='Dodaj prilagođeno svojstvo';
$ec_lang['lpn_cp_add_tip']='Dodaje redak u tablicu oblikovanja i otvara ga za uređivanje.';
$ec_lang['lpn_cp_remove']='Ukloni';
$ec_lang['lpn_cp_remove_tip']='Uklanja ovo svojstvo iz tablice oblikovanja. Vrijednosti već upisane na vašim elementima ostaju u datoteci i vraćaju se ako ponovno oblikujete isti ključ.';
$ec_lang['lpn_cp_none']='Nijedno prilagođeno svojstvo još nije oblikovano.';
$ec_lang['lpn_cp_unnamed']='Još nije imenovano';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Ključ';
$ec_lang['lpn_cp_key_tip']='Ključ: Svojstvo se pohranjuje pod ovim nazivom. Razmaci nisu dopušteni, a predmetak vam se dodaje automatski kako se vaš ključ nikada ne bi sudario s ugrađenim poljem.';
$ec_lang['lpn_cp_label']='Naziv';
$ec_lang['lpn_cp_label_tip']='Naziv: Čitatelj ovo vidi u okviru svojstava, u opciji Pronađi i u zaglavlju stupca tablice.';
$ec_lang['lpn_cp_applies']='Odnosi se na';
$ec_lang['lpn_cp_applies_tip']='Odnosi se na: Popis predmetaka ID-a odvojenih zarezom za elemente koji koriste ovo svojstvo, poput J,L,R.';
$ec_lang['lpn_cp_validate']='Provjeri kao';
$ec_lang['lpn_cp_validate_tip']='Provjeri kao: Ovo govori kako izgleda dobra vrijednost. Pravila za veličinu slova čitaju samo englesku abecedu, što je navedeno ograničenje. Odaberite Ne provjeravaj da prihvatite bilo što.';
$ec_lang['lpn_cp_restrict']='Ograniči ove znakove';
$ec_lang['lpn_cp_restrict_tip']='Ograniči ove znakove: Vrijednost smije koristiti samo ovdje navedene znakove, ili nijedan od njih, gdje „@” znači bilo koje slovo; „#” znači bilo koju znamenku, a „-”, „.” i „,” morate zasebno navesti ako su dopušteni; a svi razmaci moraju biti između drugih znakova.';
$ec_lang['lpn_cp_restrict_mode']='Dopusti ili ograniči';
$ec_lang['lpn_cp_restrict_mode_tip']='Dopusti ili ograniči: Navedeni znakovi su ili jedini koje vrijednost smije koristiti ili oni koje ne smije.';
$ec_lang['lpn_cp_restrict_allow']='Dopusti samo ove znakove';
$ec_lang['lpn_cp_restrict_deny']='Ograniči ove znakove';
$ec_lang['lpn_cp_minlength']='Donja granica duljine';
$ec_lang['lpn_cp_minlength_tip']='Donja granica duljine: Svaki kraći unos se označava, čime pronalazite prazne i napola upisane unose.';
$ec_lang['lpn_cp_length']='Gornja granica duljine';
$ec_lang['lpn_cp_length_tip']='Gornja granica duljine: Svaki dulji unos se označava.';
$ec_lang['lpn_cp_low']='Donja granica';
$ec_lang['lpn_cp_low_tip']='Donja granica: Ovo je najmanja vrijednost koju očekujete. Brojevi se uspoređuju kao brojevi, a tekst po abecednom redu.';
$ec_lang['lpn_cp_high']='Gornja granica';
$ec_lang['lpn_cp_high_tip']='Gornja granica: Ovo je najveća vrijednost koju očekujete. Brojevi se uspoređuju kao brojevi, a tekst po abecednom redu.';
$ec_lang['lpn_cp_val_none']='Ne provjeravaj';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Broj .';
$ec_lang['lpn_cp_val_number_comma']='Broj ,';
$ec_lang['lpn_cp_val_integer']='Cijeli broj';
$ec_lang['lpn_cp_val_upper']='SVA VELIKA SLOVA';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Vrijednost se čuva točno onako kako ste je upisali.';
$ec_lang['lpn_cp_bad_number']='Ova vrijednost nije broj kako je potrebno za ovo svojstvo.';
$ec_lang['lpn_cp_bad_integer']='Ova vrijednost nije cijeli broj kako je potrebno za ovo svojstvo.';
$ec_lang['lpn_cp_bad_case']='Ova vrijednost nije napisana SVIM VELIKIM SLOVIMA kako je potrebno za ovo svojstvo.';
$ec_lang['lpn_cp_bad_chars']='Ova vrijednost koristi znak koji ovo svojstvo ne dopušta.';
$ec_lang['lpn_cp_bad_space']='Razmak je dopušten samo između drugih znakova.';
$ec_lang['lpn_cp_bad_minlength']='Ova je vrijednost kraća nego što ovo svojstvo dopušta.';
$ec_lang['lpn_cp_bad_length']='Ova je vrijednost dulja nego što ovo svojstvo dopušta.';
$ec_lang['lpn_cp_bad_low']='Ova je vrijednost ispod donje granice ovog svojstva.';
$ec_lang['lpn_cp_bad_high']='Ova je vrijednost iznad gornje granice ovog svojstva.';
$ec_lang['lpn_cp_key_needed']='Dajte ovom prilagođenom svojstvu ključ bez razmaka.';
$ec_lang['lpn_cp_key_taken']='Drugo prilagođeno svojstvo već koristi taj ključ.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Scenarij';
$ec_lang['lpn_scenario_base']='Baza';
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
$ec_lang['lpn_scenario_overrides']='Broj svojih vrijednosti';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Jantarni prsten znači da ovaj element ima vrijednost koja pripada samo scenariju {name}.';
$ec_lang['lpn_scenario_overrides_tip']='Svaka od tih vrijednosti označena je na karti jantarnim prstenom. Prebacite se na {base} da vidite crtež bez njih.';
$ec_lang['lpn_scenario_menu']='Scenariji';
$ec_lang['lpn_scenario_tip']='Skup vrijednosti koje crtež trenutačno prikazuje i koje stranica upravo rješava. Kliknite da promijenite scenarij, ili da ga dodate, preimenujete ili izbrišete.';
$ec_lang['lpn_scenario_new']='Novi scenarij…';
$ec_lang['lpn_scenario_new_name']='Scenarij {n}';
$ec_lang['lpn_scenario_prompt_name']='Naziv ovog scenarija';
$ec_lang['lpn_scenario_rename']='Preimenuj scenarij…';
$ec_lang['lpn_scenario_delete']='Izbriši scenarij';
$ec_lang['lpn_scenario_delete_confirm']='Izbrisati scenarij {name} i {n} vrijednosti koje pripadaju samo njemu? Sam crtež se ne mijenja.';
$ec_lang['lpn_scenario_override']='Samo u ovom scenariju';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Označeno znači da ova vrijednost pripada samo ovom scenariju, čak i kada je jednaka broju iz Baze. Uklonite oznaku da biste ponovno koristili vrijednost iz Baze.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Bazni scenarij: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} je izvan mreže u scenariju {scenario}. I dalje je u crtežu i u vašim drugim scenarijima.';
$ec_lang['lpn_scenario_push_btn']='Primijeni vrijednosti Baze na sve scenarije';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Svaki scenarij vraća se na vrijednost iz Baze za svojstva čije se oznake trenutačno prikazuju. Vrijednosti koje pripadaju samo tim scenarijima se odbacuju.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Postaviti da svi scenariji koriste vrijednosti iz Baze za ova svojstva? Vrijednosti koje pripadaju samo tim scenarijima bit će odbačene. Ovo možete poništiti.';
$ec_lang['lpn_scenario_push_scenarios']='Scenariji na koje ovo utječe:';
$ec_lang['lpn_scenario_push_values']='Odbačene vrijednosti:';
$ec_lang['lpn_scenario_push_none']='Nijedan scenarij nema svoju vrijednost ni za jedno od ovih svojstava, pa se ništa ne bi promijenilo. Ništa se ne odbacuje.';
$ec_lang['lpn_delete_drops_overrides']='Brisanje ovog elementa također odbacuje {n} vrijednosti koje vaši scenariji imaju za njega. Nastaviti?';
$ec_lang['lpn_push_base_only']='Ova radnja mijenja sam crtež, pa se može izvesti samo u {base}. Prijeđite na {base} i pokušajte ponovno.';
$ec_lang['lpn_field_active']='Dio ove mreže';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Uklonite oznaku iz ovog okvira da element ostane na crtežu, ali izvan mreže: prikazuje se sivo, a rješavač ga zanemaruje. U scenariju je to način na koji se predložena cijev uključuje i isključuje.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Eksponent emitera';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='Eksponent u EPANET-ovoj jednadžbi emitera za prskalice i curenja: protok = koeficijent x tlak na ovaj eksponent. Mijenja rezultat samo ondje gdje čvor ima emiter, što trenutačno znači mrežu učitanu iz EPANET datoteke.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Očitaj DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Očitava kotu DEM-a na ovom čvoru i prikazuje je ispod. Ništa se u polju Kota ne mijenja. Vodoravna razlučivost DEM-a iznosi otprilike 30 m za većinu Zemlje, a finija je ondje gdje postoje bolji podaci.';
$ec_lang['lpn_elev_dem_use']='Koristi DEM';
$ec_lang['lpn_elev_dem_use_tip']='Stavlja kotu DEM-a na ovom čvoru u polje Kota iznad, zamjenjujući ono što je ondje. Prvo očitava DEM ako još nije očitan. Jedno Poništi vraća prethodnu vrijednost.';
$ec_lang['lpn_elev_dem_none']='DEM nema kotu za ovaj čvor.';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM kaže {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Izvor kote';
$ec_lang['lpn_settings_elev_source_tip']='Odakle novi čvor dobiva svoju kotu. Površina terena očitava se iz Mapbox DEM-a, koji je otprilike 30 m širok za većinu Zemlje, a finiji je ondje gdje postoje bolji podaci.';
$ec_lang['lpn_settings_elev_source_typed']='Kota upisana iznad';
$ec_lang['lpn_settings_elev_source_dem']='DEM Mapbox';
$ec_lang['lpn_settings_accuracy']='Točnost';
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
$ec_lang['lpn_settings_default_is']='Zadana vrijednost je {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Koliko blizu rješavač mora doći prije nego što stane, mjereno iznosom za koji se protoci još uvijek mijenjaju od jedne iteracije do sljedeće. Manji broj je precizniji i traje dulje. Oba rješavača čitaju ovo isto polje, a svaki tu promjenu mjeri prema drugačijem ukupnom iznosu: ugrađeni rješavač prema zbroju potražnji, EPANET prema zbroju protoka u vodovima. Ostavljeno prazno, ova stranica koristi stroži uvjet točnosti od EPANET-ove vlastite zadane vrijednosti.';
$ec_lang['lpn_settings_specific_gravity']='Specifična težina';
$ec_lang['lpn_settings_specific_gravity_tip']='Težina tekućine u odnosu na vodu. Mijenja tlakove koje bi pokazao manometar, ne i protoke.';
$ec_lang['lpn_settings_viscosity']='Relativna viskoznost';
$ec_lang['lpn_settings_viscosity_tip']='Viskoznost tekućine u odnosu na vodu pri 20 stupnjeva Celzijevih. Mijenja rezultat samo pri metodi Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Najveći broj iteracija';
$ec_lang['lpn_settings_trials_tip']='Koliko je iteracija dopušteno prije nego što rješavač odustane od mreže koja ne konvergira.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Ako ne konvergira';
$ec_lang['lpn_settings_unbalanced_tip']='Što učiniti s mrežom koja je iskoristila sve svoje iteracije, a još uvijek nije konvergirala. Dopuštanje dodatnih iteracija često dovede do konvergencije. Zaustavljanje izvještava posljednju iteraciju kakva jest, što nije rješenje. Ovo polje čita samo EPANET rješavač. Ugrađeni rješavač uvijek staje i označava rezultat kao nekonvergiran.';
$ec_lang['lpn_settings_unbalanced_continue']='Dopusti dodatne iteracije';
$ec_lang['lpn_settings_unbalanced_stop']='Zaustavi i izvijesti posljednju iteraciju';
$ec_lang['lpn_settings_unbalanced_trials']='Dodatne iteracije prije izvještavanja';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Koliko dodatnih iteracija dopustiti nakon što se iskoristi gornji najveći broj, prije nego što se izvijesti posljednja iteracija. Ovo polje čita samo EPANET rješavač.';
$ec_lang['lpn_settings_head_error']='Granica pogreške tlačne visine';
$ec_lang['lpn_settings_head_error_tip']='Dodatni test koji rješavač mora proći prije nego što stane: najveća preostala pogreška tlačne visine u bilo kojoj cijevi. Nula znači da se ovaj test ne primjenjuje. Ovo polje čita samo EPANET rješavač.';
$ec_lang['lpn_settings_flow_change']='Granica promjene protoka';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Dodatni test koji rješavač mora proći prije nego što stane: najveća promjena protoka u bilo kojoj cijevi od jedne iteracije do sljedeće. Nula znači da se ovaj test ne primjenjuje. Ovo polje čita samo EPANET rješavač.';
$ec_lang['lpn_settings_damp_limit']='Prigušenje počinje pri';
$ec_lang['lpn_settings_damp_limit_tip']='Točnost pri kojoj rješavač počinje raditi manje korake, što može pomoći mreži koja oscilira da konvergira. Nula znači da rješavač nikad ne prigušuje. Ovo polje čita samo EPANET rješavač.';
$ec_lang['lpn_settings_option_unset']='Nije navedeno';
$ec_lang['lpn_settings_demand_multiplier']='Množitelj potražnje';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Jedan faktor koji se primjenjuje odjednom na svaku potražnju u mreži. Koristite ga da vidite što sustav radi pri većoj ili manjoj potrošnji od današnje. Ne mijenja brojeve koje ste upisali. Scenarij može imati svoj vlastiti, pa su prosječan dan, maksimalan dan i vršni sat svaki po jedan broj; ostavite ga praznim u scenariju da se koristi vrijednost projekta.';
$ec_lang['lpn_settings_engine_native']='Riješi pomoću EPANET rješavača';
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
$ec_lang['lpn_settings_engine_native_tip']='Pokreće EPANET rješavač američke agencije EPA, ovdje u vašem pregledniku. Na mreži ove veličine nećete primijetiti razliku u brzini. Ta dva rješavača slažu se vrlo blizu, ali ne točno: EPANET zaokružuje vrijednost koju koristi za gravitaciju, pa njegovi manji (lokalni) gubici izlaze oko 0,08% niži nego kod ugrađenog rješavača, a s Manningovom hrapavosti njegov gubitak tlačne visine izlazi oko 0,6% niži. Kada prvi put označite ovaj okvir, preuzima se oko 650 KB, koji zatim ostaje na ovom uređaju.';
$ec_lang['lpn_engine_loading']='Učitavanje EPANET rješavača…';
$ec_lang['lpn_engine_failed']='EPANET rješavač nije moguće učitati. Umjesto toga prikazuje se ugrađeni rješavač.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Riješeno EPANET rješavačem, jer se ovi ventili sami otvaraju i zatvaraju:';
$ec_lang['lpn_unit_unknown']='Ovaj crtež navodi jedinicu koju ova stranica ne nudi: {unit}. Sve je zadržano i prikazano točno onako kako je uneseno, i ništa nije promijenjeno. Ništa se ne može izračunati dok stranica ne nauči tu jedinicu, jer ne zna koliko je ona velika.';
$ec_lang['lpn_engine_manning_note']='Napomena: uz Manningovu hrapavost, EPANET računa gubitak tlačne visine oko 0,6% niži nego ugrađeni rješavač.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='EPANET rješavač nije prihvatio ovu mrežu, pa nije pokrenut.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='EPANET rješavač je poručio: {message}';
$ec_lang['lpn_engine_refused_fallback']='Brojevi na zaslonu umjesto toga dolaze iz ugrađenog rješavača.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Brojevi na zaslonu umjesto toga dolaze iz ugrađenog rješavača. On izračunava jedan trenutak odjednom, pa je ovo mreža samo u trenutku {time}, sa svakim spremnikom još uvijek na početnoj razini.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Ove kontrole imenuju element kojeg više nema u ovom projektu, pa su izostavljene: {ids}';
$ec_lang['lpn_control_unreadable_note']='Ove kontrole nije bilo moguće pročitati, pa su izostavljene: {ids}';
$ec_lang['lpn_rule_dangling_note']='Ova pravila navode element koji više nije u ovom projektu, pa su u ovom pokretanju zanemarena: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Ova pravila nije bilo moguće pročitati, pa su u ovom pokretanju zanemarena: {ids}';
$ec_lang['lpn_settings_text_size']='Veličina teksta (pikseli)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Veličina simbola (pikseli)';
$ec_lang['lpn_settings_link_width']='Debljina crte cijevi (pikseli)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Strelice smjera protoka';
$ec_lang['lpn_settings_show_arrows_tip']='Crta strelicu na svakoj cijevi koja pokazuje kojim smjerom voda teče. Strelice se pojavljuju nakon pokretanja, a njihovo isključivanje ne mijenja rezultate. Ova postavka se sprema s projektom.';
$ec_lang['lpn_settings_align_labels']='Poravnaj oznake cijevi s cijevima';
$ec_lang['lpn_settings_readability_bias']='Okreni oznaku naopako kada je nagnuta više od ovoliko stupnjeva lijevo od okomice';
$ec_lang['lpn_settings_readability_bias_tip']='Okreće oznaku da ostane uspravna kad je nagnuta više od ovoliko stupnjeva lijevo od okomice.';
$ec_lang['lpn_settings_mask_labels']='Neprozirna pozadina iza oznaka';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Privlači vodilice oznaka na zadane kutove';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='Kada povučete oznaku dalje od onoga što imenuje, linija natrag do nje privlači se na najbliži od zadanih kutova ako povučete blizu njega. Nastavite povlačiti i privlačenje popušta, tako da je i dalje dostupan bilo koji kut. Isključeno povlači slobodno, što je ova stranica oduvijek radila.';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Prikaži oznake pri ovoj širini karte ili manjoj';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Oznake se crtaju samo dok je prikaz karte ove širine ili uži. Ostavite okvir prazan da ih crtate pri svakom zumiranju. Upišite 0 da nikad ne crtate oznaku, ni pri kojem zumiranju.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Uvijek prikaži';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='Spriječi čvorove da rastu veći od';
$ec_lang['lpn_settings_symbol_cap_mid']='puta duljine';
$ec_lang['lpn_settings_symbol_cap_post']='percentilne cijevi';
$ec_lang['lpn_settings_symbol_cap_tip']='Čvor prestaje rasti na tlu čim bi njegov promjer bio ovoliko puta veći od duljine cijevi na ovom percentilu svih duljina cijevi u mreži. Nakon te točke na karti, čvorovi, cijevi i drugi simboli smanjuju se na zaslonu dok umanjujete, umjesto da rastu na tlu. Rezervoari i spremnici su iznimka i zadržavaju svoju veličinu na zaslonu pri svakom zumiranju.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Neprozirnost simbola (0 do 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Neprozirnost pozadinske slike (0 do 1)';
$ec_lang['lpn_settings_map_display']='Izgled karte';
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
$ec_lang['lpn_settings_legend_position']='Položaj legende oznaka';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Bez';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Isključeno';
$ec_lang['lpn_settings_legend_top_left']='Gore lijevo';
$ec_lang['lpn_settings_legend_top_right']='Gore desno';
$ec_lang['lpn_settings_legend_middle_left']='Sredina lijevo';
$ec_lang['lpn_settings_legend_middle_right']='Sredina desno';
$ec_lang['lpn_settings_legend_bottom_left']='Dolje lijevo';
$ec_lang['lpn_settings_legend_bottom_right']='Dolje desno';
$ec_lang['lpn_settings_color_node_field']='Boja čvora';
$ec_lang['lpn_settings_color_link_field']='Boja cijevi';
$ec_lang['lpn_settings_color_ramp']='Shema boja';
$ec_lang['lpn_settings_color_credits']='Zasluge';
$ec_lang['lpn_color_ramp_epanet']='Plava do crvena (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Ljubičasta do žuta (lakše razlikovati jednu boju od druge)';
$ec_lang['lpn_color_ramp_gray']='Svijetlo do tamno siva';
$ec_lang['lpn_settings_color_reverse']='Obrni redoslijed boja';
$ec_lang['lpn_color_none']='Bez boje';
$ec_lang['lpn_settings_color_key_position']='Položaj legende boja';
$ec_lang['lpn_settings_color_breaks']='Granice raspona boja';
$ec_lang['lpn_settings_color_equal_intervals']='Jednaki razmaci';
$ec_lang['lpn_settings_color_equal_counts']='Jednak broj';
$ec_lang['lpn_settings_color_no_values']='Još nema vrijednosti za rad. Prvo riješite mrežu.';
$ec_lang['lpn_confirm_restore_defaults']='Vratiti sve postavke (prefiksi ID-a, početne vrijednosti, postavke rješavača, izgled karte, položaj legende i vidljive oznake) na izvorne vrijednosti? Vaša mreža se ne mijenja. Postavke pripadaju otvorenom projektu, pa vaši drugi projekti zadržavaju svoje.';
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
$ec_lang['lpn_settings_wipe_btn']='Izbriši sve na ovoj stranici';
$ec_lang['lpn_confirm_wipe']='Izbrisati SVE spremljeno za ovu stranicu — svaki projekt, svaku pozadinsku sliku, sve postavke i vaš odabir jedinica — i ponovno učitati stranicu kako bi je vidio potpuno novi posjetitelj? Ovo se ne može poništiti.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Kopirajte ovu poveznicu:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Vrijeme';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Ukupno vrijeme rada';
$ec_lang['lpn_time_hyd_step']='Hidraulički vremenski korak';
$ec_lang['lpn_time_pattern_step']='Vremenski korak obrasca potražnje';
$ec_lang['lpn_time_pattern_start']='Početno vrijeme obrasca potražnje';
$ec_lang['lpn_time_report_step']='Vremenski korak izvješća';
$ec_lang['lpn_time_report_start']='Početno vrijeme izvješća';
$ec_lang['lpn_time_clock_start']='Vrijeme na satu na početku';
$ec_lang['lpn_time_clock_day']='Dan {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Upišite vrijeme kao sate i minute, na primjer 2:30. Obični broj znači sate, pa 8 znači osam sati. Pola sata je 0:30.';
$ec_lang['lpn_time_running']='Izračunavanje kroz vrijeme EPANET rješavačem.';
$ec_lang['lpn_time_no_engine']='Ugrađeni rješavač izračunava jedan trenutak odjednom, pa je ovo mreža samo u trenutku {time}: svaki se obrazac čita u tom trenutku, a svaki spremnik i dalje ostaje na svojoj početnoj razini umjesto da se puni i prazni. Povežite se jednom na internet da dohvatite EPANET rješavač, koji izračunava kroz vrijeme.';
$ec_lang['lpn_time_slider']='Vrijeme';
$ec_lang['lpn_time_no_period']='Ovaj projekt nema postavljen izračun kroz vrijeme, pa postoji samo jedan trenutak za prikaz. Postavite Ukupno vrijeme rada u Postavke, Izračun, Vrijeme da izračunate mrežu kroz vrijeme.';
$ec_lang['lpn_time_first']='Idi na početak';
$ec_lang['lpn_time_prev']='Korak natrag';
$ec_lang['lpn_time_play']='Reproduciraj';
$ec_lang['lpn_time_play_tip']='Reproduciraj animaciju';
$ec_lang['lpn_time_pause_tip']='Pauziraj animaciju';
$ec_lang['lpn_time_pause']='Pauziraj';
$ec_lang['lpn_time_next']='Korak naprijed';
$ec_lang['lpn_time_last']='Idi na kraj';
$ec_lang['lpn_time_tank']='Spremnik';
$ec_lang['lpn_time_level']='Razina vode';
$ec_lang['lpn_time_run']='Pokreni';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Riješi ovu mrežu u svakom hidrauličkom vremenskom koraku, od početka pokretanja do njegovog kraja.';
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
$ec_lang['lpn_time_run_done']='Pokretanje je završeno. Vremena izvještavanja: {frames}. Utrošeno vrijeme: {secs} s.';
$ec_lang['lpn_time_runbox_hide']='Više ne prikazuj ovaj okvir';
$ec_lang['lpn_settings_runbox']='Prikaži okvir napretka izvođenja';
$ec_lang['lpn_settings_runbox_tip']='Okvir koji izvještava koliko je izvođenje odmaklo i što je pronašlo. Kad je isključen, dovršeno izvođenje isto to govori u statusnom retku na nekoliko sekundi. Ovo je postavka za ovaj preglednik, ne za projekt.';
$ec_lang['lpn_time_run_failed']='Pokretanje nije završeno, pa nema rezultata za kasnija vremena.';
$ec_lang['lpn_time_run_report']='Izvještaj o EPANET pokretanju';
$ec_lang['lpn_time_run_report_copy']='Kopiraj';
$ec_lang['lpn_time_run_report_copied']='Kopirano';
$ec_lang['lpn_time_run_report_tip']='Ono što je sam EPANET rješavač ispisao o posljednjem pokretanju: je li konvergiralo, i na što je upozorio. To je vlastiti tekst rješavača, ne naš.';

$ec_lang['lpn_time_speed']='Brzina';
$ec_lang['lpn_time_speed_tip']='Koliko brzo se reproducira simulacija.';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_menu_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Pretraži postavke';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Upišite riječ da vidite samo postavke koje je spominju. Pretražuju se i objašnjenja, ne samo nazivi.';
$ec_lang['lpn_settings_no_match']='Nijedna postavka ne spominje tu riječ.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Širina popisa odjeljka Postavke';
$ec_lang['lpn_rpane_empty']='Ovdje još ništa nije usidreno. Sve što pripada cijelom projektu nalazi se u Postavkama.';
$ec_lang['lpn_time_settings_open']='Postavke vremena';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Vizualizacija';
$ec_lang['lpn_settings_sec_map']='Karta i stranica';
$ec_lang['lpn_settings_sec_assets']='Zadane vrijednosti za nove elemente';
$ec_lang['lpn_settings_sec_calculation']='Izračun';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Korisnik';
$ec_lang['lpn_labels_customer_note']='Oznaka korisnika prikazuje vrijednosti označene ovdje. Crta se u istoj veličini teksta kao svaka druga oznaka na karti.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Oznake korisnika crtaju se samo dok je prikaz karte ove širine ili uži. Ostavite okvir prazan da ih crtate pri svakom zumiranju. Upišite 0 da nikad ne crtate oznaku korisnika, ni pri kojem zumiranju. Ovo nema učinka ako je veće od slične postavke za sve oznake.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Koristi trenutačni prikaz';
$ec_lang['lpn_settings_page']='Stranica';
$ec_lang['lpn_settings_page_note']='Spremljeno u ovom kalkulatoru, a ne u projektu.';
$ec_lang['lpn_settings_hydraulics']='Hidraulika';
$ec_lang['lpn_settings_quality']='Kvaliteta vode';
$ec_lang['lpn_settings_quality_track']='Parametar kvalitete';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Odaberite što pokretanje treba pratiti kroz cijevi: koliko je dugo voda u sustavu, odakle je došla, ili kemikaliju koja reagira dok putuje. Samo kemikalija zahtijeva koeficijente.';
$ec_lang['lpn_settings_quality_source']='Čvor praćenja';
$ec_lang['lpn_settings_quality_source_tip']='Čvor čija se voda prati. Svaki drugi čvor tada prikazuje udio svoje vode koji potječe iz tog čvora.';
$ec_lang['lpn_quality_none']='Ništa';
$ec_lang['lpn_quality_age']='Starost vode';
$ec_lang['lpn_quality_trace']='Praćenje izvora';
$ec_lang['lpn_quality_chemical']='Kemikalija koja reagira';
$ec_lang['lpn_quality_needs_run']='Kvaliteta vode nosi se kroz cijevi dok voda putuje, pa je potreban izračun kroz vrijeme: EPANET rješavač i ukupno vrijeme rada. Postavite Ukupno vrijeme rada pod Vrijeme, zatim pritisnite gumb Pokreni.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Kemikalija i jedinice';
$ec_lang['lpn_quality_chemical_name_tip']='Naziv kemikalije i jedinice u kojima su zapisane njezine koncentracije: na primjer, upišite Klor mg/L kao jedan unos. Ovo je oznaka. EPANET ne pretvara koncentraciju, pa svaka koncentracija i svaki koeficijent u projektu moraju već biti zapisani u ovim jedinicama.';
$ec_lang['lpn_quality_mass_units']='Jedinice mase';
$ec_lang['lpn_quality_mass_units_tip']='Jedinična polovica unosa kakvoće, EPANET-ova vlastita dva izbora.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Tolerancija kakvoće';
$ec_lang['lpn_quality_tolerance_tip']='Koliko se dvije susjedne količine vode smiju razlikovati po koncentraciji prije nego što ih EPANET tretira kao jednu. Prazno koristi EPANET-ovu vlastitu zadanu vrijednost od 0,01.';
$ec_lang['lpn_quality_diffusivity']='Relativna difuznost';
$ec_lang['lpn_quality_diffusivity_tip']='Koliko se lako kemikalija širi kroz vodu, u odnosu na klor. Prazno koristi EPANET-ovu vlastitu zadanu vrijednost od 1,0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Koncentracija {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Prosječna koncentracija {chemical}';
$ec_lang['lpn_quality_initial']='Početna kvaliteta';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Koliko kemikalije ovaj čvor sadrži kad pokretanje počne. Rezervoar zadržava svoju vrijednost tijekom cijelog pokretanja, što je uobičajen način iskazivanja rezidualne vrijednosti koja izlazi iz uređaja za pročišćavanje. Ostavite prazno i čvor počinje bez kemikalije.';
$ec_lang['lpn_result_concentration']='Koncentracija';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Koliko je kemikalije preostalo u ovoj točki nakon što je putovala i reagirala. Jedinice su one navedene uz kemikaliju pod Postavke, Kvaliteta vode.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Vrsta izvora';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Kakvu dozu ovaj čvor dodaje vodi koja kroz njega prolazi. Koncentracija tretira vodu koja ovdje ulazi u mrežu kao da dolazi s vrijednosti Kvaliteta izvora. Maseni pojačivač dodaje masu kemikalije svake minute, bez obzira na protok. Pojačivač na zadanu vrijednost podiže koncentraciju koja izlazi iz ovog čvora na vrijednost Kvaliteta izvora i ne dalje. Pojačivač razmjeran protoku dodaje vrijednost Kvaliteta izvora onome što je već u vodi.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Ništa';
$ec_lang['lpn_source_type_concen']='Koncentracija';
$ec_lang['lpn_source_type_mass']='Maseni pojačivač';
$ec_lang['lpn_source_type_setpoint']='Pojačivač na zadanu vrijednost';
$ec_lang['lpn_source_type_flowpaced']='Pojačivač razmjeran protoku';
$ec_lang['lpn_source_quality']='Kvaliteta izvora';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Koliko je jaka doza. Za sve vrste osim masenog pojačivača ovo je koncentracija, u jedinicama navedenim uz kemikaliju pod Postavke, Kvaliteta vode; za maseni pojačivač ovo je masa kemikalije po minuti. Ostavite prazno i ovdje se ništa ne dodaje, što nije isto što i nula: nula je doziranje koje radi i ne dodaje ništa.';
$ec_lang['lpn_source_pattern']='Obrazac izvora';
$ec_lang['lpn_source_pattern_tip']='Vremenski obrazac koji tijekom pokretanja mijenja jačinu doze, za doziranje koje nije stalno. Bez obrasca doza je jednaka u svakom koraku.';
$ec_lang['lpn_mixing_model']='Model miješanja';
$ec_lang['lpn_mixing_model_tip']='Kako se voda već u ovom spremniku miješa s vodom koja ulazi. Potpuno miješanje odjednom miješa cijeli spremnik. Dvokomorno miješanje prvo puni ulaznu zonu pa ostatak propušta dalje. FIFO klipni protok pomiče vodu redoslijedom kojim je stigla. LIFO klipni protok slaže je u slojeve, pa je voda koja je posljednja ušla prva koja izlazi. Izbor mijenja starost vode i rezidual, a ne mijenja nikakav tlak ni protok.';
$ec_lang['lpn_mixing_mixed']='Potpuno miješanje';
$ec_lang['lpn_mixing_2comp']='Dvokomorno miješanje';
$ec_lang['lpn_mixing_fifo']='FIFO klipni protok';
$ec_lang['lpn_mixing_lifo']='LIFO klipni protok';
$ec_lang['lpn_mixing_fraction']='Udio miješanja';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Udio volumena spremnika koji zauzima ulazna zona, između 0 i 1. Koristi ga samo dvokomorno miješanje. Ostavite prazno i cijeli spremnik je ulazna zona, što EPANET pretpostavlja.';
$ec_lang['lpn_reaction_bulk']='Koeficijent reakcije u tekućini';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Reakcija u samoj vodi, koja se koristi za svaku cijev koja nema vlastitu. Negativan broj razgrađuje kemikaliju, a pozitivan je povećava. Reakcija je prvog reda osim ako uvezena EPANET datoteka ne navodi drugi red, pa je koeficijent brzina u 1/dan. Prazan okvir znači da nema reakcije u tekućini.';
$ec_lang['lpn_reaction_wall']='Koeficijent reakcije na stijenci';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Reakcija na stijenci cijevi, koja se koristi za svaku cijev koja nema vlastitu. Negativan broj razgrađuje kemikaliju. Reakcija je prvog reda osim ako uvezena EPANET datoteka ne navodi drugi red, pa je koeficijent duljina po danu, zapisana u jedinici duljine projekta. Prazan okvir znači da nema reakcije na stijenci.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Samo za ovu cijev. Ostavite prazno i cijev koristi koeficijent postavljen za cijelu mrežu pod Postavke, Kvaliteta vode.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Koeficijent reakcije';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Reakcija u vodi koju drži ovaj spremnik, kao brzina u 1/dan. Negativan broj razgrađuje kemikaliju, a pozitivan je povećava. Voda stoji u spremniku mnogo dulje nego u bilo kojoj cijevi, pa se rezidual ovdje često gubi. Ostavite prazno i spremnik koristi koeficijent reakcije u tekućini postavljen za cijelu mrežu pod Postavke, Kvaliteta vode.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Reakcija u tekućini';
$ec_lang['lpn_reaction_wall_short']='Reakcija na stijenci';
$ec_lang['lpn_reaction_tank_short']='Reakcija';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/dan';
$ec_lang['lpn_reaction_day']='dan';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Red reakcije u masi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='Eksponent na koji se podiže koncentracija za reakciju u masi vode. Dopušten je bilo koji realni broj. 1 je zadana vrijednost i koristi se za većinu modeliranja raspada klora. 0 čini brzinu neovisnom o količini prisutne tvari.';
$ec_lang['lpn_reaction_order_tank']='Red reakcije u spremniku';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='Eksponent na koji se podiže koncentracija za reakciju u vodi koja se nalazi u spremniku, odvojeno od reda reakcije u masi kako bi spremnik mogao reagirati po drugačijem redu od cijevi. Dopušten je bilo koji realni broj, a 1 je zadana vrijednost. EPANET ovo navodi kao ORDER TANK u datoteci i ne nudi polje za to u vlastitom sučelju.';
$ec_lang['lpn_reaction_order_wall']='Red reakcije na stijenci';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 znači da reakcija na stijenci nastupa prema zadanom koeficijentu (koeficijentima). 0 znači da ne nastupa. Ovo je prekidač uklj./isklj. Zadana vrijednost je 1.';
$ec_lang['lpn_reaction_order_unstated']='Nije navedeno';
$ec_lang['lpn_reaction_order_zero']='0, nulti red';
$ec_lang['lpn_reaction_order_first']='1, prvi red';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Granični potencijal';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Koncentracija kojoj se kemikalija približava umjesto da se raspada do nule ili raste bez kraja. Reakcija usporava kako joj se voda približava i ondje se zaustavlja. Koristite dosljedne jedinice. Nema ograničenja ako je prazno.';
$ec_lang['lpn_reaction_rough_corr']='Korelacija s hrapavošću';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Povezuje reakciju na stijenci s hrapavošću svake pojedine cijevi, tako da hrapavija cijev reagira brže. Kada je postavljeno, koeficijent stijenke izračunava se za svaku cijev iz njezine hrapavosti, a jedinstveni koeficijent stijenke iznad se više ne koristi. Ne koristi se ako je prazno.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Ova stranica ne nudi vlastiti koeficijent reakcije. Ne postoji standardni test za njega, a objavljene vrijednosti s terena za istu vrstu vode razlikuju se i za faktor deset, pa bi broj ponuđen ovdje bio shvaćen kao preporuka. Unesite onaj koji ste izmjerili ili onaj koji možete navesti kao izvor, ili ostavite okvire praznima za kemikaliju koja ne reagira.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Energija';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Izvještaji';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='Gotovi odgovori koje ova stranica daje kad je mreža izračunata: koliko koštaju pumpe, kako se scenariji uspoređuju i što je ispisao sam EPANET rješavač.';
$ec_lang['lpn_reports_epanet']='EPANET pokretanje';
$ec_lang['lpn_energy_title']='Izvještaj o energiji pumpi';
$ec_lang['lpn_energy_menu']='Energija pumpi';
$ec_lang['lpn_energy_menu_tip']='Koliki je udio pokretanja svaka pumpa radila, koju je snagu trošila i koliko je to koštalo tijekom posljednjeg izračuna kroz vrijeme.';
$ec_lang['lpn_energy_efficiency']='Učinkovitost pumpe (postotak)';
$ec_lang['lpn_energy_efficiency_tip']='Ukupna učinkovitost (od struje do vode) koja se koristi za svaku pumpu koja nema vlastitu krivulju učinkovitosti. EPANET koristi 75 posto kada ništa nije navedeno.';
$ec_lang['lpn_energy_price']='Cijena energije';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Koliko košta jedan kilovatsat. Vrijedi za svaku pumpu koja nema vlastitu cijenu. Ostavite prazno i svaki trošak u izvještaju je nula.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Koliko na ovoj pumpi košta jedan kilovatsat. Ostavite prazno i pumpa plaća cijenu postavljenu za cijelu mrežu pod Postavke, Energija.';
$ec_lang['lpn_energy_price_pattern']='Obrazac cijene';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Obrazac koji množi cijenu u svakom koraku obrasca, čime se navodi izvanvršna (jeftinija) tarifa. Ostavite prazno za jednu cijenu tijekom cijelog pokretanja.';
$ec_lang['lpn_energy_demand_charge']='Naknada za vršnu snagu';
$ec_lang['lpn_energy_demand_charge_tip']='Koliko komunalno poduzeće naplaćuje po kW za vršno opterećenje koje zatraže pumpe u sustavu.';
$ec_lang['lpn_energy_currency']='Valuta';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Što god ovdje upišete, ispisuje se uz svaki novčani iznos. Ovo je oznaka. Cijene i troškovi nikada se ne pretvaraju, pa cijene upišite u valuti koju ste ovdje naveli.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Ova stranica ne nudi vlastitu cijenu energije. Cijena energije ovisi o komunalnom poduzeću, državi, dobu dana i godini, pa bi broj ponuđen ovdje bio shvaćen kao preporuka. Unesite cijenu iz svoje vlastite tarife.';
$ec_lang['lpn_energy_needs_run']='Energija pumpi je snaga integrirana kroz pokretanje, pa je potreban izračun kroz vrijeme: EPANET rješavač i ukupno vrijeme rada. Postavite Ukupno vrijeme rada u Postavke, Izračun, Vrijeme, pritisnite gumb Pokreni, zatim otvorite Voda, Izvještaji, Energija pumpi.';
$ec_lang['lpn_energy_no_pumps']='Ova mreža nema pumpi, pa nema ništa što troši snagu.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Usporedba scenarija';
$ec_lang['lpn_scncmp_menu_tip']='Riješite svaki scenarij u ovom projektu i pročitajte ih usporedno: najniži tlak i najveću brzinu u svakome.';
$ec_lang['lpn_scncmp_running']='Rješavanje svakog scenarija…';
$ec_lang['lpn_scncmp_empty']='Ništa još nije nacrtano, pa nema što riješiti.';
$ec_lang['lpn_scncmp_col_minpressure']='Najniži tlak';
$ec_lang['lpn_scncmp_col_maxvelocity']='Najveća brzina';
$ec_lang['lpn_scncmp_at']='{value} na {id}';
$ec_lang['lpn_scncmp_current']='(trenutačno otvoren)';
$ec_lang['lpn_scncmp_note']='Svaki scenarij rješava se iz kopije crteža. Ništa se ovdje ne mijenja u projektu, a scenarij u kojem radite ostaje kakav je bio.';
$ec_lang['lpn_energy_over']='Za izračun kroz vrijeme od {time}';
$ec_lang['lpn_energy_col_pump']='Pumpa';
$ec_lang['lpn_energy_col_running']='% pokretanja';
$ec_lang['lpn_energy_col_effic']='Učink.';
$ec_lang['lpn_energy_col_avg_kw']='Prosj. kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='Prosječna snaga korištena dok je ova pumpa radila. Ne prosječi se kroz razdoblja mirovanja, pa pumpa koja je mirovala veći dio izračuna kroz vrijeme i dalje prijavljuje snagu koju je trošila dok je radila.';
$ec_lang['lpn_energy_col_peak_kw']='Vršni kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Trošak';
$ec_lang['lpn_energy_total_kwh']='Utrošena energija';
$ec_lang['lpn_energy_total_energy_cost']='Trošak energije';
$ec_lang['lpn_energy_peak_kw']='Vršna potrošnja snage';
$ec_lang['lpn_energy_total_demand_charge']='Trošak vršne snage';
$ec_lang['lpn_energy_total_cost']='Ukupni trošak';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Stanje';
$ec_lang['lpn_reports_status_tip']='Što se promijenilo tijekom posljednje simulacije proširenog razdoblja, kronološkim redom: pumpe i ventili koji se otvaraju ili zatvaraju, spremnici koji se pune, prazne, napune ili presuše, i koraci koji nisu potpuno konvergirali.';
$ec_lang['lpn_status_title']='Izvještaj o stanju';
$ec_lang['lpn_status_needs_run']='Izvještaj o stanju navodi što se promijenilo tijekom simulacije proširenog razdoblja. Postavite Ukupno vrijeme rada u Postavke, Izračun, Vrijeme, pritisnite Izračunaj, zatim otvorite Voda, Izvještaji, Izvještaj o stanju.';
$ec_lang['lpn_status_empty']='Ništa nije promijenilo stanje tijekom ovog pokretanja.';
$ec_lang['lpn_status_col_time']='Vrijeme';
$ec_lang['lpn_status_col_event']='Događaj';
$ec_lang['lpn_status_opened']='{type} {id}: otvoreno';
$ec_lang['lpn_status_closed']='{type} {id}: zatvoreno';
$ec_lang['lpn_status_filling']='{type} {id}: puni se';
$ec_lang['lpn_status_emptying']='{type} {id}: prazni se';
$ec_lang['lpn_status_full']='{type} {id}: puno';
$ec_lang['lpn_status_dry']='{type} {id}: prazno';
$ec_lang['lpn_status_no_converge']='Hidrauličko rješenje u ovom koraku nije potpuno konvergiralo; prikazani brojevi njegova su posljednja iteracija.';
$ec_lang['lpn_status_note']='Čita se iz istog pokretanja proširenog razdoblja kao ploča Tablice i Puni izvještaj. Navedena je samo promjena, ne svaki korak.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Puni';
$ec_lang['lpn_reports_full_tip']='Svaki čvor i svaki vod u svakom vremenskom koraku izvještavanja posljednjeg pokretanja, kao jedna tablica koju možete preuzeti ili ispisati.';
$ec_lang['lpn_full_title']='Puni izvještaj';
$ec_lang['lpn_full_needs_run']='Puni izvještaj navodi svaki čvor i svaki vod u svakom vremenskom koraku izvještavanja. Pritisnite Izračunaj, zatim otvorite Voda, Izvještaji, Puni izvještaj.';
$ec_lang['lpn_full_note']='Jedan redak po čvoru ili vodu po vremenskom koraku izvještavanja, u jedinicama prikazanim na ploči Tablice. Prazna ćelija je stupac koji ta veličina nema. Preuzimanje ili ispis obuhvaća svaki vremenski korak; tablica ispod prikazuje jedan po jedan.';
$ec_lang['lpn_full_step_label']='Vremenski korak';
$ec_lang['lpn_full_download_csv']='Preuzmi CSV';
$ec_lang['lpn_full_print']='Ispiši izvještaj';
$ec_lang['lpn_full_col_time']='Vrijeme';
$ec_lang['lpn_full_col_type']='Vrsta';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} redaka.';
$ec_lang['lpn_energy_no_price']='Nije navedena cijena energije, pa je svaki trošak ovdje nula. Postavite je pod Postavke, Energija.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Ova mreža navodi cijenu nula, pa je svaki trošak ovdje nula. Promijenite je pod Postavke, Energija.';
$ec_lang['lpn_energy_curve_note']='Ove pumpe pozivaju krivulju učinkovitosti bez točaka: {ids}. Radile su s učinkovitosti postavljenom za cijelu mrežu.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_rank']='Poredak';
$ec_lang['lpn_labels_col_drop']='Izostavi';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Čvor i vod';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Jednaki razmaci';
$ec_lang['lpn_color_mode_quantile']='Kvantil (jednak broj)';
$ec_lang['lpn_color_mode_jenks']='Prirodne granice (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Standardna devijacija';
$ec_lang['lpn_color_mode_pretty']='Zaokruženo';
$ec_lang['lpn_color_mode_log']='Logaritamski';
$ec_lang['lpn_color_mode_pressure']='Tlak';
$ec_lang['lpn_color_mode_manual']='Ručno';

// ---- LIBRARIES (ROADMAP Tasks 462 and 460) ---------------------------------------------------
// The document has carried patterns, curves and controls since Task 423; nothing on the page could
// see one. This is that interface. Tom, 2026-08-20: "for Water Networks, I think we also need the
// following in a group: Libraries (Patterns, Curves, Controls, Pumps, Pipes, Custom), Settings,
// Simulate, Transport, Time selectors."
//
// ONE NAME, THREE DOORS: the toolbar button, the Edit menu row and the box's own title all read
// this key, exactly as lpn_menu_settings serves the Settings box's three.
// Plural, because it is a shelf of them: a user opens Libraries to reach the patterns, not to reach
// "the library".
$ec_lang['lpn_library_menu']='Knjižnice';
$ec_lang['lpn_library_menu_tip']='Upravljajte obrascima potražnje, krivuljama pumpi i pravilima kontrole za ovaj projekt.';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Obrasci';
$ec_lang['lpn_library_patterns_tip']='Obrazac je popis množitelja koji se ponavlja. Svaki vrijedi za jedan vremenski korak obrasca, pa 24 broja s korakom od jednog sata čine dan koji se ponavlja. Potražnja od 10, s množiteljem 1,5, u tom je trenutku 15.';
$ec_lang['lpn_library_curves']='Krivulje';
$ec_lang['lpn_library_curves_tip']='Krivulja je popis točaka koji govori kako nešto radi: koliku tlačnu visinu pumpa dodaje pri svakom protoku, koliko je učinkovita pri tom protoku, ili koliku tlačnu visinu ventil gubi pri svakom protoku.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Krivulja pripada projektu, a pumpa ili ventil u svojim svojstvima navodi koju krivulju koristi. Više elemenata može koristiti istu krivulju, a njezino uređivanje ovdje mijenja sve njih. Za krivulju tlačne visine pumpe pokretanje koristi krivulju prilagođenu kroz točke, kako je prikazano; za svaku drugu vrstu točke se povezuju ravnim linijama, kako je prikazano.';
$ec_lang['lpn_library_curve_add']='Dodaj krivulju';
$ec_lang['lpn_library_curve_type_tip']='Što ova krivulja opisuje';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Vrsta krivulje';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Jednadžba';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='Krivulja prilagođena kroz točke, i linija nacrtana na grafu ispod. Izračunava se iznova svaki put kada se prikaže i nikada se ne sprema, a njezini brojevi su u jedinicama koje prikazuje tablica iznad. Ugrađeni rješavač radi s ovom jednadžbom; EPANET rješavač čita same točke.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Odaberite jedan ili dva stupca u proračunskoj tablici, kopirajte ih i zalijepite u prvu ćeliju u koju ih želite smjestiti. Retci se dodaju prema potrebi. Možete zalijepiti i retke kopirane izravno iz EPANET datoteke, uključujući naziv krivulje.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Opis';
$ec_lang['lpn_library_curve_note_tip']='Što je ova krivulja, vašim vlastitim riječima. Zapisuje se iznad krivulje u EPANET datoteci i odande se čita natrag.';
$ec_lang['lpn_library_curve_remove_point']='Ukloni ovu točku';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Kopiraj točke';
$ec_lang['lpn_library_curve_copy_tip']='Kopira svaku točku kao dva stupca, spremna za lijepljenje u proračunsku tablicu.';
$ec_lang['lpn_library_curve_copy_manual']='Kopiraj ove točke';
$ec_lang['lpn_library_curve_used_by']='Elementi koji koriste ovu krivulju';
$ec_lang['lpn_library_curve_unused']='Ništa ne koristi ovu krivulju.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Ovu krivulju koristi {count} elemenata: {ids}. Najprije ih usmjerite na drugu krivulju, zatim izbrišite ovu.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Vrste cijevi';
$ec_lang['lpn_library_pipetypes_tip']='Vrsta cijevi je definicija na koju se više cijevi može pozvati za svoj promjer, hrapavost i koeficijente reakcije. Uređivanje definicije uređuje svaku cijev koja je koristi.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Svaki projekt ima svoju vlastitu knjižnicu vrsta cijevi. Svojstva u definiciji vrste cijevi možete ostaviti prazna. Na primjer, vrsta cijevi koja navodi hrapavost, a ne i promjer, u redu je. Vrste cijevi pridružujete cijevima u njihovom uređivaču svojstava. Uređivanje definicije ovdje mijenja svaku cijev koja se na nju poziva.';
$ec_lang['lpn_library_pipetype_add']='Dodaj vrstu cijevi';
$ec_lang['lpn_library_pipetype_blank_tip']='Prazna svojstva u definiciji vrste cijevi ostaju za pojedinačni unos za svaku cijev.';
$ec_lang['lpn_library_pipetype_used_by']='Cijevi koje koriste ovu vrstu';
$ec_lang['lpn_library_pipetype_unused']='Ništa ne koristi ovu vrstu cijevi.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Ovu vrstu cijevi koristi {count} cijevi: {ids}. Odvojite je od njih prije brisanja.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Vrsta cijevi';
$ec_lang['lpn_field_pipetype_tip']='Vrsta cijevi iz knjižnice projekta koju ova cijev koristi. Svojstva uključena u vrstu cijevi ovdje su onemogućena za uređivanje. Odvojite vrstu cijevi da omogućite uređivanje ovdje.';
$ec_lang['lpn_pipetype_none']='Nije odabrana vrsta cijevi';
$ec_lang['lpn_pipetype_detach']='Odvoji od vrste cijevi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Kopira vrijednosti koje ova cijev čita iz svoje vrste u samu cijev i prestaje koristiti vrstu. Vrijednosti cijevi se sada ne mijenjaju, a od sada ih možete uređivati ovdje.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Armature';
$ec_lang['lpn_library_fittings_tip']='Popis armatura je skup armatura i njihovih količina na koji se više cijevi može pozvati. Zbraja se u jedan koeficijent lokalnog gubitka.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Svaki projekt ima svoju vlastitu knjižnicu armatura. Popis armatura ima armature s količinom za svaku, a zbraja se u jedinstveni koeficijent lokalnog gubitka. Na popis se mogu pozvati i cijevi i vrste cijevi.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Armature ponuđene ovdje su trinaest iz Tablice 3.3 EPANET 2.2 korisničkog priručnika. Odabirom jedne kopira se njezin koeficijent u redak, gdje ga možete promijeniti. Koeficijent ovisi o veličini i proizvođaču armature, pa tablicu shvatite kao polaznu točku, a ne kao odgovor.';
$ec_lang['lpn_library_fittings_add']='Dodaj popis armatura';
$ec_lang['lpn_library_fittings_used_by']='Cijevi koje koriste ovaj popis armatura';
$ec_lang['lpn_library_fittings_unused']='Ništa ne koristi ovaj popis armatura.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Ovaj popis armatura koristi {count} cijevi: {ids}. Odvojite ga od njih prije brisanja.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Uvezi knjižnice…';
$ec_lang['lpn_library_import_tip']='Odaberite drugu projektnu datoteku i kopirajte cijele knjižnice iz nje u ovaj projekt. Sve čiji je naziv ovdje već zauzet preskače se i navodi, tako da se ništa što već imate ne mijenja.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Odaberite što kopirati iz {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Svaka knjižnica koju označite kopira se u cijelosti. Izbrišite naknadno ono što ne želite, na isti način na koji brišete bilo koji drugi unos.';
$ec_lang['lpn_library_import_go']='Uvezi';
$ec_lang['lpn_library_import_no_libraries']='Ta projektna datoteka nema knjižnica za kopiranje.';
$ec_lang['lpn_library_import_heading']='Uvezeno iz {file}';
$ec_lang['lpn_library_import_added']='Kopirano: {names}';
$ec_lang['lpn_library_import_conflict']='Preskočeno, jer ovaj projekt već ima jedan s istim nazivom: {names}. Ništa ovdje nije promijenjeno. Preimenujte jedan od njih i ponovno uvezite ako želite oba.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Ta projektna datoteka nema ništa od ovoga za kopiranje.';
$ec_lang['lpn_library_import_curve_shape']='Ove krivulje prenesene su točno onako kako ih je datoteka zapisala, a pokretanje ne može koristiti jednu dok njezin prvi stupac ne raste od svake točke do sljedeće: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Ove vrste cijevi upućuju na popis fitinga koji ovaj projekt nema: {names}. Uvezite knjižnicu fitinga iz iste datoteke i pronaći će ga.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Upozorenje: Jedinice se ne podudaraju. Bit će uvezeno kako jest. Ne preporučuje se.';
$ec_lang['lpn_library_import_units_line']='{name}: ovaj projekt prikazuje {mine}, datoteka prikazuje {theirs}.';
$ec_lang['lpn_fitting_qty']='Količina';
$ec_lang['lpn_fitting_name']='Armatura';
$ec_lang['lpn_fitting_k']='Koeficijent';
$ec_lang['lpn_fitting_add']='Dodaj armaturu';
$ec_lang['lpn_fitting_remove']='Ukloni';
$ec_lang['lpn_fitting_total']='Ukupni koeficijent lokalnog (mjesnog) gubitka, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Popis armatura';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Popis armatura iz knjižnice projekta. Njegove količine i koeficijenti zbrajaju se u koeficijent lokalnog gubitka ove cijevi, a polje koeficijenta tada postaje samo za čitanje. Ostavite ovo neodabrano da sami unesete koeficijent.';
$ec_lang['lpn_fittings_none']='Nije odabran popis armatura';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Ventil s ravnim sjedištem, potpuno otvoren';
$ec_lang['lpn_fitting_angle']='Kutni ventil, potpuno otvoren';
$ec_lang['lpn_fitting_swingcheck']='Klapni nepovratni ventil, potpuno otvoren';
$ec_lang['lpn_fitting_gate']='Zasun, potpuno otvoren';
$ec_lang['lpn_fitting_elbow_short']='Koljeno malog radijusa';
$ec_lang['lpn_fitting_elbow_medium']='Koljeno srednjeg radijusa';
$ec_lang['lpn_fitting_elbow_long']='Koljeno velikog radijusa';
$ec_lang['lpn_fitting_elbow_45']='Koljeno 45 stupnjeva';
$ec_lang['lpn_fitting_return_bend']='Zatvoreno povratno koljeno';
$ec_lang['lpn_fitting_tee_run']='Standardni T-komad, protok kroz ravni dio';
$ec_lang['lpn_fitting_tee_branch']='Standardni T-komad, protok kroz odvojak';
$ec_lang['lpn_fitting_entrance']='Oštri ulaz';
$ec_lang['lpn_fitting_exit']='Izlaz';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Druga armatura';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='Spremljeno {file}';
$ec_lang['lpn_inp_export_flat_lead']='Izvezena EPANET datoteka brojčano je jednaka ovom projektu. No nema mjesta za sljedeće:';
$ec_lang['lpn_inp_export_flat_types']='{n} cijevi ovdje poziva se na {t} vrsta cijevi. U datoteci svaka od tih cijevi nosi vlastitu kopiju brojeva, pa su odgovori isti. Ono što datoteka ne može sadržavati je sama vrsta cijevi, pa je uređivanje jedne definicije, uz to da je svaka cijev slijedi, nešto što bilježi samo vaša vlastita datoteka projekta.';
$ec_lang['lpn_inp_export_flat_coords']='EPANET datoteka čuva jedan položaj za svaki čvor. Ovaj scenarij postavlja {n} od njih negdje drugdje, i to su položaji u datoteci. Svaki drugi scenarij čuva svoje vlastite položaje samo u vašoj projektnoj datoteci.';
$ec_lang['lpn_inp_export_flat_fittings']='EPANET datoteka ne može sadržavati popis koljena, ventila i T-komada iz vaše projektne datoteke. Koeficijent lokalnog gubitka za {n} cijevi ovdje zbrojen je iz popisa armatura. Ukupan iznos ide u datoteku točno onakav kakav jest, tako da se u odgovorima ništa ne mijenja.';
$ec_lang['lpn_library_controls']='Kontrole';
$ec_lang['lpn_library_controls_tip']='Kontrola je jedna rečenica koja otvara ili zatvara vod, ili mu dodjeljuje postavku, kada to nalaže razina vode, tlak ili vrijeme.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Dodaj obrazac';
$ec_lang['lpn_library_pattern_values']='Množitelji';
$ec_lang['lpn_library_pattern_values_tip']='Množitelji, odvojeni razmacima ili zarezima. Zalijepite stupac iz proračunske tablice ako ga imate. Popis se ponavlja onoliko dugo koliko traje pokretanje, pa ne mora pokrivati cijelo razdoblje.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} množitelja, razmaknutih {step}, obuhvaćaju {span}';
$ec_lang['lpn_library_pattern_none']='Bez obrasca';
$ec_lang['lpn_settings_default_pattern']='Zadani obrazac potražnje';
$ec_lang['lpn_settings_default_pattern_tip']='Svaki čvor bez obrasca koristi ovaj.';
$ec_lang['lpn_library_control_add']='Dodaj kontrolu';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Jedna rečenica, riječima koje koristi EPANET. Četiri oblika: LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1, i LINK 12 CLOSED AT CLOCKTIME 3 AM. Umjesto OPEN ili CLOSED možete napisati broj, koji je postavka ventila ili brzina pumpe. Ključne riječi ostavite na engleskom; njih stranica čita.';
$ec_lang['lpn_library_control_ok']='✓ Razumljivo';
$ec_lang['lpn_library_control_bad']='⚠ Nerazumljivo';
$ec_lang['lpn_library_control_missing']='⚠ Ova mreža nema ništa pod nazivom {id}';
$ec_lang['lpn_library_rules']='Pravila';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Pravilo je kratak odlomak koji otvara ili zatvara vod, ili mu daje postavku, kada razina vode, tlak, protok ili vrijeme dosegnu vrijednost koju postavite. Pravila mogu istovremeno testirati više stvari, i mogu reći što učiniti kada test ne prođe.';
$ec_lang['lpn_library_rule_add']='Dodaj pravilo';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Jedno pravilo, riječima koje koristi EPANET, jedna klauzula po retku. Prvi redak ga imenuje: RULE 1. Zatim uvjet: IF TANK 2 LEVEL BELOW 17.1. Zatim što učiniti: THEN PUMP 9 STATUS IS OPEN. Posljednji redak može mu dati rang: PRIORITY 1. Dodajte AND ili OR retke da testirate više stvari, i ELSE retke da kažete što učiniti kada test ne prođe. Uvjet može čitati LEVEL, HEAD, GRADE, PRESSURE ili DEMAND na čvoru, FLOW, STATUS ili SETTING na vodu, ili TIME i CLOCKTIME na SYSTEM. Brojeve pišite u jedinicama koje ovaj projekt prikazuje; oni se pretvaraju umjesto vas. Ključne riječi ostavite na engleskom; njih čitaju stranica i EPANET.';
$ec_lang['lpn_library_rule_ok']='✓ Ovo pravilo je pročitano';
$ec_lang['lpn_library_rule_bad']='⚠ Ovo pravilo nije bilo moguće pročitati';
$ec_lang['lpn_library_rule_missing']='⚠ Ova mreža nema ništa pod nazivom {id}';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Osnovna potražnja';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Protok koji ovaj čvor troši u prikazanom vremenskom koraku: svaka osnovna potražnja pomnožena svojim obrascem, zbrojena. Izračunava se, a ne upisuje, pa se mijenja sa satom i ne može se uređivati.';
$ec_lang['lpn_field_demand_pattern']='Obrazac potražnje';
$ec_lang['lpn_field_demand_pattern_tip']='Kako potražnja ovog čvora raste i pada tijekom pokretanja. Ostavite na Bez obrasca i čvor će umjesto toga slijediti Zadani obrazac potražnje.';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Opis';
$ec_lang['lpn_field_demand_category_tip']='Naziv ili opis ove kategorije potražnje.';
$ec_lang['lpn_demand_add']='Dodaj kategoriju potražnje';
$ec_lang['lpn_demand_add_tip']='Dodajte još jednu kategoriju potražnje na ovom čvoru, sa svojom osnovnom potražnjom, obrascem i opisom. Kategorije se zbrajaju.';
$ec_lang['lpn_demand_remove']='Ukloni ovu potražnju';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Obrazac tlačne visine';
$ec_lang['lpn_field_head_pattern_tip']='Kako razina vode ovog rezervoara raste i pada tijekom pokretanja. Tlačna visina iznad množi se obrascem.';
$ec_lang['lpn_field_pump_speed']='Relativna brzina';
$ec_lang['lpn_field_pump_speed_tip']='1 znači da ova pumpa radi pri brzini pri kojoj je izmjerena njezina krivulja. 0,9 je ista pumpa koja radi sporije, što smanjuje tlačnu visinu koju dodaje i protok koji propušta. Obrazac brzine zamjenjuje ovaj broj tijekom pokretanja.';
$ec_lang['lpn_field_speed_pattern']='Obrazac brzine';
$ec_lang['lpn_field_speed_pattern_tip']='Kako brzina ove pumpe raste i pada tijekom pokretanja. Svaki množitelj relativna je brzina za taj dio pokretanja, i zamjenjuje postavku Brzina umjesto da je skalira, pa množitelj 0 zaustavlja pumpu.';

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
$ec_lang['lpn_search_menu']='Pretraži mjesto po nazivu…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Pronađite grad, ulicu ili znamenitost po nazivu i pomaknite kartu do nje. Prva upotreba traži vaše dopuštenje, jer riječi koje upišete odlaze u OpenStreetMapovu uslugu pretraživanja naziva mjesta.';
$ec_lang['lpn_search_bar']='Pretraži po nazivu…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Pretraživanje po nazivu mjesta šalje riječi koje upišete na nominatim.openstreetmap.org, besplatnu uslugu pretraživanja naziva mjesta zaklade OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Ovo je drugačija usluga od slika karte ulica iza vašeg projekta. Slike govore samo gdje gledate. Pretraživanje govori što ste upisali. Usluga pretraživanja naziva mjesta primit će riječi vašeg pretraživanja i vašu IP adresu. Ne šaljemo ništa drugo i ne vodimo nikakvu evidenciju vaših pretraživanja.';
$ec_lang['lpn_search_consent_3']='Smijemo li vaša pretraživanja slati usluzi pretraživanja naziva mjesta?';
$ec_lang['lpn_search_consent_4']='Ako kažete ne, sve ostalo na ovoj stranici i dalje radi točno kao sada, uključujući Idi na zemljopisnu širinu i dužinu. Odgovor da pamtimo kako vas ne bismo morali ponovno pitati. Odgovor ne se uopće ne pohranjuje.';
$ec_lang['lpn_search_refused']='Pretraživanje naziva mjesta isključeno je i ništa nije poslano. I dalje možete koristiti Idi na zemljopisnu širinu i dužinu.';
$ec_lang['lpn_search_prompt']='Pretražite mjesto po nazivu. Grad, ulica, znamenitost — na primjer: Petaluma, California';
$ec_lang['lpn_search_empty']='Upišite naziv mjesta koje želite pretražiti.';
$ec_lang['lpn_search_working']='Pretraživanje…';
$ec_lang['lpn_search_busy']='Pretraživanje je već u tijeku. Pričekajte odgovor.';
$ec_lang['lpn_search_choose']='Više mjesta odgovara upitu. Koje?';
$ec_lang['lpn_search_nochoice']='Ništa nije odabrano, pa se karta nije pomaknula.';
$ec_lang['lpn_search_badchoice']='To nije jedan od brojeva na popisu.';
$ec_lang['lpn_search_none']='Za taj naziv ništa nije pronađeno.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Usluga pretraživanja naziva mjesta traži da usporimo. Pričekajte minutu i pokušajte ponovno.';
$ec_lang['lpn_search_http']='Usluga pretraživanja naziva mjesta odgovorila je greškom.';
$ec_lang['lpn_search_timeout']='Usluga pretraživanja naziva mjesta nije odgovorila na vrijeme. Sve ostalo na ovoj stranici radi i bez nje.';
$ec_lang['lpn_search_unreadable']='Usluga pretraživanja naziva mjesta odgovorila je nečim što ova stranica nije mogla pročitati.';
$ec_lang['lpn_search_offline']='Nismo uspjeli dosegnuti uslugu pretraživanja naziva mjesta. Možda ste izvan mreže. Sve ostalo na ovoj stranici radi i bez nje, uključujući Idi na zemljopisnu širinu i dužinu.';
$ec_lang['lpn_search_toofast']='Jedno pretraživanje u sekundi — toliko dopušta usluga pretraživanja naziva mjesta. Pokušajte ponovno za trenutak.';
$ec_lang['lpn_search_nofetch']='Ovaj preglednik ne može doseći uslugu pretraživanja naziva mjesta.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox ovo sastavlja iz mnogih javnih skupova podataka o visinama, pa koliko je dobro potpuno ovisi o tome gdje se nalazite. Ondje gdje postoji nacionalno lidarsko snimanje, poput USGS 3DEP na velikom dijelu Sjedinjenih Država i njegovih ekvivalenata drugdje, može biti bolje od jednog metra vodoravno i nekoliko desetinki metra okomito. Ondje gdje postoje samo globalni podaci, to je otprilike 30 m vodoravno i nekoliko metara okomito. Mapbox nam ne govori koji od njih ste dobili. Tretirajte ovo kao topografsku kartu, a ne geodetsko snimanje: provjerite sve na što se oslanjate.';
$ec_lang['lpn_terrain_consent_1']='Popunjavanje kota šalje položaj svakog čvora kojem je kota potrebna — njegovu zemljopisnu širinu i dužinu — na api.mapbox.com, radi očitavanja visine terena ondje.';
$ec_lang['lpn_terrain_consent_2']='Ovo je drugačije pitanje od slika karte iza vašeg projekta. Slike govore samo gdje gledate. Ovi položaji su sama vaša mreža. Mapbox će primiti te koordinate i vašu IP adresu. Ne šaljemo ništa drugo: ni ime, ni cijevi, ni projekt. Ne vodimo nikakvu evidenciju o tome, a na ovom se uređaju ne pohranjuje ništa osim vašeg odgovora na ovo pitanje.';
$ec_lang['lpn_terrain_consent_3']='Smijemo li poslati položaje vaših čvorova Mapboxu?';
$ec_lang['lpn_terrain_consent_4']='Ako kažete ne, sve ostalo na ovoj stranici i dalje radi točno kao sada, a kote i dalje možete sami upisivati kao prije. Odgovor da pamtimo kako vas ne bismo morali ponovno pitati. Odgovor ne se uopće ne pohranjuje.';
$ec_lang['lpn_terrain_refused']='Kote nisu popunjene i ništa nije poslano. Možete ih upisati kao prije.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Popuniti kotu za {n} čvor(ova) iz Mapbox DEM-a?';
$ec_lang['lpn_terrain_confirm_default_1']='Svaki čvor već ima kotu, a {n} njih još uvijek je na {v}, što je kota s kojom novi čvor počinje, a ne ona koju ste upisali.';
$ec_lang['lpn_terrain_confirm_default_2']='Zamijeniti kotu tih {n} čvorova vrijednostima iz Mapbox DEM-a?';
$ec_lang['lpn_terrain_keep']='{k} čvor(ova) već ima kotu i neće biti dirano.';
$ec_lang['lpn_terrain_undo']='Jedno Poništi (Ctrl-Z) vraća ih sve natrag.';
$ec_lang['lpn_terrain_requests']='{n} zahtjev(a) prema api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Kote se već popunjavaju. Pričekajte.';
$ec_lang['lpn_terrain_offmap']='Ovi položaji čvorova nisu na karti terena, pa ništa nije poslano.';
$ec_lang['lpn_terrain_too_wide']='Ovi čvorovi rasprostiru se preko prevelikog dijela Zemlje da bi se očitali odjednom ({n} zahtjeva za pločice). Ništa nije poslano.';
$ec_lang['lpn_terrain_cancelled']='Ništa nije promijenjeno i ništa nije poslano.';
$ec_lang['lpn_terrain_nofetch']='Ovaj preglednik ne može doseći uslugu terena.';
$ec_lang['lpn_terrain_working']='Očitavanje površine terena…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Usluga terena odbila je zahtjev ({status}), pa nijedna kota nije promijenjena. Mapbox token koji ova stranica koristi možda ne dopušta web-adresu na kojoj se nalazite.';
$ec_lang['lpn_terrain_failed']='Nismo uspjeli dosegnuti uslugu terena, pa nijedna kota nije promijenjena. Možda ste izvan mreže. Sve ostalo na ovoj stranici radi i bez nje.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Usluga terena traži od nas da usporimo (429), pa nijedna kota nije promijenjena. Pokušajte ponovno za minutu.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Usluga terena odgovorila je s greškom ({status}), pa nijedna kota nije promijenjena. Ništa nije pogrešno s vašom mrežom.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Nijedan od tih čvorova nema položaj na Zemlji, pa ništa nije poslano i nijedna kota nije promijenjena. Čitanje površine terena treba projekt u zemljopisnoj širini i dužini, ili projekciji koju ova stranica može postaviti.';
$ec_lang['lpn_terrain_done']='Popunjeno kota: {n}.';
$ec_lang['lpn_terrain_missed']='{m} nije bilo moguće očitati, pa su ostale prazne.';
$ec_lang['lpn_terrain_partial']='{f} pločica terena nije odgovorilo.';
$ec_lang['lpn_terrain_will_ids']='Ovi čvorovi će dobiti kotu: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Ti čvorovi su: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Ovi čvorovi su dobili kotu: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Ovi čvorovi još uvijek nemaju kotu: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, i još {n}';

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
$ec_lang['lpn_ff_menu']='Analiza protupožarnog protoka…';
$ec_lang['lpn_ff_menu_tip']='Testirajte čvorove jedan po jedan: koliko svaki može isporučiti dok još uvijek održava preostali tlak koji ste zadali, te izbacuje li povlačenje potrebnog protoka ondje nešto drugo izvan granica?';
$ec_lang['lpn_ff_title']='Analiza protupožarnog protoka';
$ec_lang['lpn_ff_intro']='Od svakog se čvora redom traži da povuče protupožarni protok povrh potražnje koju već ima. Ništa se u vašem projektu ne mijenja; cijelo pokretanje izvodi se na kopiji.';
$ec_lang['lpn_ff_scope']='Čvorovi za testiranje';
$ec_lang['lpn_ff_scope_tip']='Odaberite skup prije pokretanja. Testiranje svakog čvora u velikom sustavu može potrajati minutama.';
$ec_lang['lpn_ff_scope_all']='Svaki čvor';
$ec_lang['lpn_ff_scope_selected']='Samo odabrani čvor';
$ec_lang['lpn_ff_no_junctions']='Ovaj projekt još nema čvorova, pa nema ništa za testirati.';
$ec_lang['lpn_ff_no_selection']='Nijedan čvor nije odabran. Odaberite jedan na karti, ili testirajte svaki čvor.';
$ec_lang['lpn_ff_skipped']='{n} odabranih elemenata nisu čvorovi, pa nisu testirani.';
$ec_lang['lpn_ff_required']='Potrebni protupožarni protok';
$ec_lang['lpn_ff_required_tip']='Protok koji vaš protupožarni propis ili vatrogasno tijelo zahtijeva na hidrantu. Svaki se čvor testira prema ovom broju, osim ako ima vlastiti potrebni protupožarni protok.';
$ec_lang['lpn_ff_required_own']='Čvorovi koji imaju vlastiti potrebni protupožarni protok umjesto toga se testiraju prema njemu. Broj njih: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Protupožarni protok potreban na ovom određenom čvoru, prema vašem protupožarnom propisu ili vatrogasnom tijelu, za namjenu površine koju opslužuje. Ostavite prazno i čvor se testira prema broju u okviru Analiza protupožarnog protoka.';
$ec_lang['lpn_ff_residual']='Preostali tlak koji treba održati';
$ec_lang['lpn_ff_residual_tip']='Tlak koji čvor mora i dalje održavati dok isporučuje protupožarni protok. AWWA M31 i NFPA 291 koriste 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Provjera projektnih uvjeta (učinak na sustav)';
$ec_lang['lpn_ff_design_tip']='Zasebno pitanje od toga može li čvor isporučiti protok: dok se taj protok ondje povlači, pada li nešto drugo ispod svog minimalnog tlaka ili prelazi svoju graničnu brzinu? Odabir provjere ne zahtijeva dodatni izračun.';
$ec_lang['lpn_ff_design_off']='Ne provjeravaj';
$ec_lang['lpn_ff_design_all']='Svi drugi čvorovi i sve cijevi';


$ec_lang['lpn_ff_minpressure']='Najniži dopušteni tlak drugdje';
$ec_lang['lpn_ff_minpressure_tip']='Čvor koji padne ispod ovoga dok drugi povlači svoj protupožarni protok prijavljuje se kao problem projektiranja.';
$ec_lang['lpn_ff_maxvelocity']='Najveća dopuštena brzina';
$ec_lang['lpn_ff_maxvelocity_tip']='Cijev koja radi iznad ovoga dok se povlači protupožarni protok prijavljuje se kao problem projektiranja.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Protupožarni protok povlači se na samom čvoru. To je metoda korištena ovdje, i uobičajena je. Hidrant, njegova bočna cijev i mlaznica nisu modelirani, pa stvarni hidrant isporučuje manje od protoka prikazanog ovdje.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Ovo se izračunava ugrađenim rješavačem.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Ovo se izračunava EPANET rješavačem.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='Raspoloživi protupožarni protok je pretraga, pa se cijela mreža rješava otprilike šesnaest puta za svaki testirani čvor. Velik sustav traje minutama. Možete ga zaustaviti u bilo kojem trenutku i zadržati ono što je već izračunato.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Testira se samo vremenski korak koji je sada na zaslonu. Protupožarni protok obično se testira povrh potražnje maksimalnog dana, pa mrežu postavite na to stanje prije pokretanja.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Pokretanje protupožarnog protoka';
$ec_lang['lpn_ff_calculate']='Pokreni';
$ec_lang['lpn_ff_stop']='Zaustavi';
$ec_lang['lpn_ff_working']='U tijeku: {done} od {total} čvorova.';
$ec_lang['lpn_ff_stopped']='Zaustavljeno nakon {done} od {total} čvorova. Rezultati ispod su oni koji su već završeni.';
$ec_lang['lpn_ff_cost']='Ovo pokretanje riješilo je cijelu mrežu {solves} puta.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Crtež se promijenio, pa su rezultati protupožarnog protoka obrisani. Pokrenite ponovno.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Ukloni prstenove';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} čvorova nije imalo nikakav problem. {fire} čvorova nije zadovoljilo protupožarni protok. {design} čvorova utjecalo je na ostatak sustava.';
$ec_lang['lpn_ff_summary_error']='Za {n} čvorova nije bilo moguće dobiti odgovor.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Svaki testirani čvor';
$ec_lang['lpn_ff_col_junction']='Čvor';
$ec_lang['lpn_ff_col_static']='Statički tlak';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='Tlak na ovom čvoru prije nego što je povučen ikakav protupožarni protok, dok uobičajene potražnje sustava i dalje rade. Ništa se ne zatvara da bi se to izmjerilo, pa ovo nije tlak pri nultom protoku za sustav; to je isti tlak koji karta prikazuje na ovom čvoru. AWWA M31 i NFPA 291 oba nazivaju ovo očitanje statičkim tlakom, i ondje počinje test protupožarnog protoka.';
$ec_lang['lpn_ff_col_available']='Raspoloživi protok';
$ec_lang['lpn_ff_col_required']='Potrebni protok';
$ec_lang['lpn_ff_col_residual']='Preostalo';
$ec_lang['lpn_ff_col_atrequired']='Tlak pri potr. protoku';
$ec_lang['lpn_ff_col_affected']='Najgori učinak';
$ec_lang['lpn_ff_col_limit']='Projektna granica';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Nije provjereno';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Statički nije zadovoljen, pa nije provjereno';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Vrste neuspjeha';
$ec_lang['lpn_ff_mode_fire']='Požar';
$ec_lang['lpn_ff_mode_design']='Projekt';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Nijedna';
$ec_lang['lpn_ff_col_solves']='Pokretanja';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_pressure']='Tlak';
$ec_lang['lpn_ff_limit_velocity']='Brzina';
$ec_lang['lpn_ff_limit_both']='Tlak i brzina';
$ec_lang['lpn_ff_atleast']='više od {flow}';
$ec_lang['lpn_ff_affect_node']='{id} pada na {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} dosiže {velocity}';
$ec_lang['lpn_ff_more']='i još {n} pogođenih';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='Još {n} čvorova nije prikazano.';
$ec_lang['lpn_ff_design_none']='Ništa u odabranom skupu nije prešlo svoje granice dok je bilo koji čvor povlačio svoj protupožarni protok.';
$ec_lang['lpn_ff_design_off_note']='Učinak na ostatak sustava nije provjeren u ovom pokretanju.';
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
$ec_lang['lpn_ff_iso']='Insurance Services Office (ISO) priznaje jednom hidrantu najviše {flow}. Ta granica priznavanja ovdje nije primijenjena jer se ne zna koliko hidranata jedan čvor može predstavljati.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Već ispod preostalog tlaka prije nego što je povučen bilo kakav protupožarni protok';
$ec_lang['lpn_ff_err_converge']='Mreža nije konvergirala.';
$ec_lang['lpn_ff_err_solve']='Rješavač je prijavio pogrešku i nije dao odgovor.';
$ec_lang['lpn_ff_err_not_junction']='Nije čvor';
$ec_lang['lpn_ff_err_unknown']='Nema odgovora. Prijavljen je kod {code}.';

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
$ec_lang['lpn_file_import_survey']='Uvezi izmjerene točke…';
$ec_lang['lpn_file_import_survey_tip']='Pročitajte popis izmjerenih točaka iz tekstualne datoteke i napravite jedan čvor na svakoj točki, uzimajući postavke za nove elemente za sve što datoteka ne navodi. Nijedna cijev se ne crta, a nijedan redak se nikad ne odbacuje a da nije imenovan. Čita koordinatni sustav koji ovaj projekt već koristi, georeferenciran ili ne.';
$ec_lang['lpn_survey_read_error']='Ta datoteka nije mogla biti pročitana s vašeg diska.';
$ec_lang['lpn_survey_cancelled']='Ništa nije stvoreno i ništa nije promijenjeno.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Sjeverna koordinata';
$ec_lang['lpn_survey_axis_east']='Istočna koordinata';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Ta datoteka nema ništa u sebi.';
$ec_lang['lpn_survey_err_unreadable']='Ta datoteka nije mogla biti pročitana kao popis izmjerenih točaka.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Više od jednog stupca u toj datoteci moglo bi biti {axis} ({detail}), a ova stranica neće birati između njih. Ostavite jedan od njih nazvan kao {axis} i pokušajte ponovno.';
$ec_lang['lpn_survey_err_no_points']='Nijedan redak te datoteke nije se mogao pročitati kao izmjerena točka. Pročitani retci: {detail}';
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
$ec_lang['lpn_survey_format_label']='Format datoteke:';
$ec_lang['lpn_survey_format_internal']='određeno interno';
$ec_lang['lpn_survey_create']='Stvori čvorove';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='Prvi redak je preskočen: ne imenuje nijedan stupac koji ova stranica poznaje.';
$ec_lang['lpn_survey_type_label']='Vrsta elementa:';
$ec_lang['lpn_survey_confirm_junction']='Pronađeno {n} čvor(ova). Nastaviti?';
$ec_lang['lpn_survey_confirm_reservoir']='Pronađeno {n} rezervoar(a). Nastaviti?';
$ec_lang['lpn_survey_confirm_tank']='Pronađeno {n} spremnik(a). Nastaviti?';
$ec_lang['lpn_survey_report_junction']='Uvezeno {n} čvor(ova), {m} s kotom.';
$ec_lang['lpn_survey_report_reservoir']='Uvezeno {n} rezervoar(a), {m} s kotom.';
$ec_lang['lpn_survey_report_tank']='Uvezeno {n} spremnik(a), {m} s kotom.';
$ec_lang['lpn_survey_report_clean']='Svaka točka iz datoteke prenesena je, i ništa nije promijenjeno usput.';
$ec_lang['lpn_survey_report_notes']='Greške i napomene uvoza:';
$ec_lang['lpn_survey_sev_error']='greška';
$ec_lang['lpn_survey_sev_warning']='upozorenje';
$ec_lang['lpn_survey_note_line']='Redak {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Premalo stupaca za navedeni format datoteke.';
$ec_lang['lpn_survey_note_coord_missing']='Ćelija {axis} je prazna.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} se ne čita kao broj.';
$ec_lang['lpn_survey_note_coord_range']='{axis} je izvan raspona koji ovaj projekt dopušta.';
$ec_lang['lpn_survey_note_bad_elev']='Nenumerička kota. Uvezeno bez kote.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Više od jednog stupca moglo bi biti kota, pa nijedan od njih nije pročitan.';
$ec_lang['lpn_survey_note_blank_rows']='Preskočeni prazni retci: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Naziv je već korišten ranije u ovoj datoteci, dodijeljen je novi naziv.';
$ec_lang['lpn_survey_note_id_taken']='Naziv je već u projektu, dodijeljen je novi naziv.';
$ec_lang['lpn_survey_note_id_invalid']='Naziv se ovdje ne može koristiti, dodijeljen je novi naziv.';
