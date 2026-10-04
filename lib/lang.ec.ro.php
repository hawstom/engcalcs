<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='fracție';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/sec';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% ridicare/drum';
$ec_lang['u_grade']='ridicare/drum';
$ec_lang['u_in2']='in^2';
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
$ec_lang['u_afd']='ac-ft/zi';
$ec_lang['u_lpm']='L/min';
$ec_lang['u_cmh']='m^3/h';
$ec_lang['u_cmd']='m^3/zi';
$ec_lang['u_mh2o']='m H2O';
$ec_lang['u_mld']='ML/zi';
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
$ec_lang['u_s']='sec';
$ec_lang['u_hr']='oră';
$ec_lang['u_day']='zi';
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
$ec_lang['menu_brand']='Calculatoare HawsEDC';
$ec_lang['menu_main_hydraulics']='Hidraulică';
$ec_lang['menu_help']='Ajutor';
$ec_lang['menu_libre']='Software liber';
$ec_lang['template_welcome']='Lasă temerile la ușă; dragostea se vorbește aici. Nu stricați totul. Bucurați-vă și de <a target="_blank" href="https://hawsedc.com/download.php">instrumentele gratuite HawsEDC AutoCAD</a>.';
$ec_lang['template_feedback']='Puteți sugera o formulare mai bună pentru acest text, sau altceva? Doriți să ajutați, sau să învățați să creați instrumente ca acestea? Vă rog, contactați-mă.';
$ec_lang['template_printable_title']='Titlu tipărit';
$ec_lang['template_printable_subtitle']='Subtitlu tipărit';
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
$ec_lang['consent_body']='Ne permiteți să salvăm o cifră unică (un cookie) în acest browser, pentru a ține minte că am contorizat deja această pagină? Nu înregistrează nimic despre dvs. și nimic din ce introduceți. Fără el, nu putem distinge a doua dvs. vizită de prima vizită a altcuiva.';
$ec_lang['consent_accept']='Permit acum';
$ec_lang['consent_accept_all']='Permit mereu';
$ec_lang['consent_decline']='Refuz mereu';
$ec_lang['consent_current_granted']='Ați permis aceasta. Limităm înregistrarea pentru acest profil de browser.';
$ec_lang['consent_current_denied']='Ați refuzat aceasta. Nu stocăm nimic, pentru a limita înregistrarea pentru acest profil de browser.';
$ec_lang['consent_region_label']='Alegerea dvs. privind limitarea înregistrării.';
$ec_lang['consent_settings_link']='Setări cookie-uri';
$ec_lang['privacy_link']='Politica de confidențialitate';
$ec_lang['terms_link']='Termeni de utilizare';
$ec_lang['index_main_title']='Calculatoare Inginerești Gratuite Online';
$ec_lang['index_meta_desc_plain']='Calculatoare gratuite de inginerie hidraulică pentru conducte, canale, deversoare și irigații. Rulează direct în browser, funcționează offline și sunt disponibile în 27 de limbi.';
$ec_lang['calc_set_units']='Alegeți unitatea de măsură:';
$ec_lang['calc_set_units_tip']='Stabilește unitatea de măsură pentru toate câmpurile deodată. Nedistructiv: numerele pe care le-ați introdus rămân exact așa cum sunt, iar fiecare este acum citit în noua unitate. Un 6 rămâne 6, dar acum înseamnă 6 țoli în loc de 6 milimetri.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Restabilește valorile implicite';
$ec_lang['calc_defaults_confirm']='Resetează calculatorul la valorile implicite inițiale?';
$ec_lang['points_data_note']='(sau Copiați/Lipiți folosind zona de date)';
$ec_lang['points_data_heading']='Date calculator<br />(folosiți Copiați pentru a vedea formatul)';
$ec_lang['points_data_copy']='Copiați';
$ec_lang['points_data_paste']='Lipiți';
$ec_lang['calc_inputs']='Date de intrare';
$ec_lang['calc_results']='Rezultate';
$ec_lang['view_hide_line']='Ascunde această linie';
$ec_lang['view_printable']='Versiune tipăribilă (reîncărcați/actualizați pentru a restaura)';
$ec_lang['ec_name_label']='Salvați acest calcul:';
$ec_lang['ec_name_placeholder']='Nume';
$ec_lang['ec_name_tip']='Salvează valorile introduse în URL pentru marcaj, recuperare istoric și partajare';
$ec_lang['calc_copy_link']='Copiați linkul';
$ec_lang['ec_related_calcs']='Calculatoare conexe:';
$ec_lang['calc_copy_link_done']='Copiat!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Pierdere de Sarcină Conductă Darcy-Weisbach';
$ec_lang['dw_main_title']='Calculator Gratuit Online Pierdere de Sarcină Conductă Darcy-Weisbach';
$ec_lang['dw_main_desc']='Pierdere de Sarcină Conductă Darcy-Weisbach la Diametru, Rugozitate și Debit Date';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Înălțimea de rugozitate absolută, e, a peretelui conductei. Valori tipice: oțel (nou) 0,046 mm, oțel (uzat) 0,15 mm, HDPE 0,003 mm, PVC/uPVC 0,0015 mm, beton 0,3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s pentru apă curată la 20°C">Vâscozitate cinematică, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Vâscozitate cinematică, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s pentru apă curată la 20°C';
$ec_lang['dw_reynolds_number']='Numărul Reynolds, Re';
$ec_lang['dw_flow_regime']='Regimul de curgere';
$ec_lang['dw_regime_laminar']='laminar';
$ec_lang['dw_regime_transitional']='tranzitoriu';
$ec_lang['dw_regime_turbulent']='turbulent';
$ec_lang['dw_friction_factor_method']='Metoda factorului de frecare';
$ec_lang['dw_friction_factor']='Factorul de frecare, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Pierdere de Sarcină Conductă Hazen-Williams';
$ec_lang['hw_main_title']='Calculator Gratuit Online Pierdere de Sarcină Conductă Hazen-Williams';
$ec_lang['hw_main_desc']='Pierdere de Sarcină Conductă Hazen-Williams la Diametru, Rugozitate și Debit Date';
$ec_lang['hw_hgl_1']='HGL aval';
$ec_lang['hw_hgl_2']='HGL amonte';
$ec_lang['hw_elev_up']='Cotă amonte';
$ec_lang['hw_pressure_up']='Presiune amonte';
$ec_lang['hw_elev_down']='Cotă aval';
$ec_lang['hw_pressure_down']='Presiune aval';
$ec_lang['hw_pressure_check']='Verificare presiune';
$ec_lang['hw_pressure_ok_short']='Presiune pozitivă';
$ec_lang['hw_pressure_neg_short']='Presiune negativă';
$ec_lang['hw_pressure_neg']='Presiunea aval este sub zero. HGL coboară sub conductă, astfel încât conducta nu ar curge plină, iar acest rezultat poate să nu fie valid.';
$ec_lang['hw_roughness']='Coeficientul Hazen-Williams, C';
$ec_lang['hw_note_1']='<dl><dt>Acest calculator nu modelează profilul conductei între cele două capete.</dt><dd>Utilizează doar cotele amonte și aval introduse de dumneavoastră. Dacă terenul se ridică mai sus decât oricare dintre capete undeva între ele, presiunea în acel punct înalt este mai mică decât orice presiune raportată aici. Rulați din nou calculatorul pentru lungimea de la capătul amonte până la punctul înalt pentru a-l verifica.</dd><dd>Acolo unde HGL coboară sub conductă, apa este sub presiune negativă. Aerul iese din soluție, o conductă cu pereți subțiri se poate prăbuși, iar apă subterană murdară poate fi atrasă prin îmbinări. Mențineți linia sub presiune pozitivă peste tot și luați în considerare o supapă de aer la fiecare punct înalt.</dd><dt>Presiunea amonte este o condiție la limită pe care o furnizați dumneavoastră.</dt><dd>Citiți-o de pe un manometru, de la nivelul apei dintr-un rezervor (înălțimea apei deasupra conductei) sau de pe curba pompei. O pompă furnizează o presiune mai mică pe măsură ce debitul crește, așa că folosiți punctul de pe curbă care corespunde debitului introdus mai sus.</dd><dt>Adunați dumneavoastră coeficienții de pierdere minoră (locală).</dt><dd>Însumați valorile K pentru fiecare vană, cot, teu, contor și intrare de pe linie și introduceți acel total. Urmați linkul de la acel câmp pentru valori tipice. Pe o magistrală de transport lungă, aceste pierderi sunt mici în comparație cu frecarea, dar în conductele scurte dintr-o stație ele pot reprezenta cea mai mare parte a pierderii.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Manning Canal cu Secțiune Neregulată';
$ec_lang['mi_main_title']='Calculator Gratuit Online Manning pentru Canal cu Secțiune Neregulată';
$ec_lang['mi_main_desc']='Calculator Manning de Curgere Uniformă în Canal cu Secțiune Neregulată';
$ec_lang['mi_waterSurfaceElevation']='Cota suprafeței apei';
$ec_lang['mi_q_617']='<span class="ec-help" title="Debitul compozit, Q, folosind un n compozit pentru fiecare regiune conform Chow 6-17, viteze egale">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Puncte de secțiune transversală';
$ec_lang['mi_groupPoint']='Punct';
$ec_lang['mi_groupSegment']='Segment';
$ec_lang['mi_groupRegion']='Regiune';
$ec_lang['mi_station']='Sta.';
$ec_lang['mi_elevation']='Cotă';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />limita<br />regiunii<br />(Mal)';
$ec_lang['mi_tau']='Efort<br />tangenț.<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n<br />comp.';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='n compozit';
$ec_lang['mi_notes_1_def']='Acest calculator urmează Manualul de Referință HEC-RAS în calculul n compozit de regiune folosind Chow 1959, pagina 136, ecuația 6-17 (nu 6-18).';


$ec_lang['mi_notes_2_term']='Placare cu rocă';
$ec_lang['mi_notes_2_def']='Folosiți Calculatorul Manning pentru Canal Trapezoidal pentru a proiecta placarea cu rocă. Acest calculator este mai potrivit pentru secțiuni naturale.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning Curgere Conductă';
$ec_lang['mpf_main_title']='Calculator Gratuit Online Manning Curgere Conductă';
$ec_lang['mpf_main_desc']='Formula Manning Curgere Uniformă în Conductă la Pantă și Adâncime Date';
$ec_lang['mpf_pipe_diameter']='Diametrul conductei, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Coeficientul de rugozitate Manning, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Panta de frecare, S<sub>f</sub></a><span class="ec-help" title="Uneori egală cu panta conductei. Urmați linkul pentru explicație (doar în engleză)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Adâncime relativă de curgere, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Debit, Q';
$ec_lang['mpf_flow_tip']='Debitul și adâncimea sunt calculate pentru o conductă infinit de lungă. Pentru a introduce acest debit în conductă poate fi necesară o adâncime mai mare a apei din amonte. Vedeți Notele de mai jos pentru detalii și un videoclip tutorial.';
$ec_lang['mpf_velocity']='Viteză, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Energie cinetică exprimată ca înălțime a coloanei de apă, v²/2g">Sarcina de viteză, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Aria de curgere, A';
$ec_lang['mpf_pipe_area']='Aria conductei, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Arie relativă, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Perimetrul udat, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Raza hidraulică, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Lățimea suprafeței libere, T';
$ec_lang['mpf_froude_number']='Numărul Froude, Fr';
$ec_lang['mpf_shear_stress']='Efortul tangențial mediu, τ';
$ec_lang['mpf_full_flow']='Debit la plin, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Raport față de debitul la plin, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Acesta este debitul și adâncimea în interiorul unei conducte <em>infinit lungi</em>.</dt><dd>Introducerea debitului în conductă poate necesita o adâncime a apei din amonte semnificativ mai mare. Adăugați cel puțin de 1,5 ori sarcina de viteză pentru a obține adâncimea din amonte sau <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">consultați tutorialul meu de 2 minute</a> pentru calculele standard ale nivelului din amonte ale podețelor folosind <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, programul gratuit pentru podețe al Administrației Federale a Autostrăzilor din S.U.A. (U.S. Federal Highway Administration).</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Proiectați o rețea de canalizare menajeră?</dt><dd>Consultați <a target="_blank" href="/sewslope.php">tabelele cu pantele minime ale canalizării</a> pentru conducte de la 4 la 96 inci (100 până la 2400 mm), date în m/m, mm/m și procente, și studiul <a target="_blank" href="/peakfact.php">factorilor de vârf pentru debite foarte mici</a>. Ambele sunt documente de referință disponibile doar în limba engleză.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Introduceți un Q țintă pozitiv.';
$ec_lang['mpf_solver_no_solution']='Fără soluție: Q depășește capacitatea conductei la y/d0 = 93.8% (Qmax = {qmax} în unitățile selectate).';
$ec_lang['mpf_solve_btn']='Calculează';
$ec_lang['mpf_solve_for_flow']='pentru debit, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Manning Pierdere de Sarcină Conductă';
$ec_lang['mphl_main_title']='Calculator Gratuit Online Manning Pierdere de Sarcină Conductă';
$ec_lang['mphl_main_desc']='Formula Manning Pierdere de Sarcină la Curgere Plină Dată';
$ec_lang['mphl_pipe_length']='Lungimea conductei, L';
$ec_lang['mphl_area']='Arie, A';
$ec_lang['mphl_total_junction_k']='Coeficient de pierdere minoră (locală), k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Coeficient de pierdere, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Coeficient de pierdere minoră (locală), km. Aceste pierderi apar la joncțiuni de conducte, intrări, ieșiri, coturi și vane — termenul „minoră” este convențional, dar înșelător; pe o conductă scurtă pot egala sau depăși pierderile prin frecare. Valori tipice k: intrare cu muchie ascuțită 0,5, fiecare cot de 45° 0,2–0,3, vană cu sertar (complet deschisă) 0,1, vană fluture 0,2, ieșire (spre rezervor sau atmosferă) 1,0. Însumați toate fitingurile pentru km total. Valoarea implicită 2,0 presupune o intrare, o ieșire și două coturi de 45°.';
$ec_lang['mphl_friction_slope']='Panta de frecare';
$ec_lang['mphl_friction_loss']='Pierdere prin frecare, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Pierdere minoră (locală), h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Pierdere totală, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='EGL aval';
$ec_lang['mphl_egl_2']='EGL amonte';
$ec_lang['mphl_hgl_egl_tip']='Acest rezultat poate să nu fie valid acolo unde conducta se ridică deasupra liniei piezometrice.';
$ec_lang['mphl_note_1']='<dl><dt>Acest calculator nu modelează profilul conductei între cele două capete.</dt><dd>Dacă HGL coboară sub partea superioară a conductei în orice punct, acest calcul poate să nu fie valid.</dd><dt>Pentru o condiție de intrare deschisă (podeț), este necesar să se verifice condițiile de control la intrare.</dt><dd>1. HGL amonte trebuie să fie deasupra cotei de adâncime normală amonte a curgerii (și mai sus decât conducta!).</dd><dd>2. Nivelul apei din amonte al unui podeț este mai bine reprezentat de EGL amonte decât de HGL amonte.</dd><dd>3. Consultați <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">tutorialul meu de 2 minute</a> pentru calculele simple standard ale nivelului din amonte ale podețelor folosind <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, programul gratuit pentru podețe al Administrației Federale a Autostrăzilor din S.U.A.</dd><dd>4. Această pagină rezolvă doar cazul de control la ieșire: o conductă care curge plină, unde condițiile din aval determină sarcina. Proiectarea podețelor înseamnă a decide dacă predomină controlul la intrare sau la ieșire, așa că folosiți HY-8 ori de câte ori oricare dintre cele două ar putea predomina.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Manning Canal Trapezoidal';
$ec_lang['mtc_main_title']='Calculator Gratuit Online Formula Manning Canal Trapezoidal';
$ec_lang['mtc_main_desc']='Formula Manning Curgere Uniformă în Canal Trapezoidal la Pantă și Adâncime Date';
$ec_lang['mtc_bottom_width']='Lățimea fundului, b';
$ec_lang['mtc_side_slope_1']='Taluz 1, z<sub>1</sub> (orizontal/vertical)';
$ec_lang['mtc_side_slope_2']='Taluz 2, z<sub>2</sub> (orizontal/vertical)';
$ec_lang['mtc_channel_slope']='Panta canalului, S';
$ec_lang['mtc_flow_depth']='Adâncimea de curgere, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Unghi de curbă, β</a><span class="ec-help" title="Pentru dimensionarea anrocamentului. Urmați linkul pentru schemă."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Densitate relativă la apă. Valoare tipică ≈ 2,65 pentru rocă concasată">Densitatea relativă a rocii, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Dimensiunea de proiectare a rocii, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n din dimensiunea de proiectare a rocii (metoda Strickler)';
$ec_lang['mtc_n_blodgett']='n din dimensiunea de proiectare a rocii (metoda Blodgett)';
$ec_lang['mtc_n_bathurst']='n din dimensiunea de proiectare a rocii (metoda Bathurst)';
$ec_lang['mtc_n_pi']='n din dimensiunea de proiectare a rocii (metoda Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett față de Bathurst';
$ec_lang['mtc_pi_range_check']='Verificare interval P&I';
$ec_lang['mtc_pi_ok']='d50 în intervalul P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='În afara intervalului';
$ec_lang['mtc_pi_tip']='Extrapolare în afara intervalului de date de 0,28–0,36 ft pe baza căruia a fost dezvoltată această ecuație — a se trata ca o verificare aproximativă, nu ca bază de proiectare';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Conform Isbash (1936) și Comitatul Maricopa, Arizona, SUA.">Dimensiunea necesară a rocii unghiulare de fund, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Conform Isbash (1936) și Comitatul Maricopa, Arizona, SUA.">Dimensiunea necesară a rocii unghiulare pentru taluzul 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Conform Isbash (1936) și Comitatul Maricopa, Arizona, SUA.">Dimensiunea necesară a rocii unghiulare pentru taluzul 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Conform Maynord, Ruff și Abt (1989). Într-o curbă, roca este dimensionată pentru o viteză de curbă de 4/3 din viteza medie, conform California Division of Highways (1970); valoarea proprie de 1,5 a lui Maynord se aplică canalelor naturale.">Dimensiunea necesară a rocii unghiulare, D<sub>50</sub> (Maynord, Ruff și Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Dimensiunea necesară a rocii unghiulare, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Viteză rezonabilă pentru ipotezele de curgere uniformă.';
$ec_lang['mtc_vel_low']='Viteză mică — risc de sedimentare.';
$ec_lang['mtc_vel_high']='Viteza este ridicată și poate să nu fie realistă; verificați eroziunea îmbrăcăminții canalului, adâncimea suplimentară în curbe și pierderea de energie la lărgiri sau obstacole.';
$ec_lang['mtc_iteration_tip']='Alegeți o opțiune de rugozitate (Blodgett–Bathurst recomandat) și o opțiune de dimensiune a rocii (Isbash recomandat) pentru a itera automat către o dimensiune uniformă a rocii pentru debitul dorit. Vedeți Notele de mai jos pentru metoda completă, sau introduceți propria valoare de rugozitate (urmați linkul pentru îndrumări) și ignorați dimensiunea rocii pentru a evita iterația.';
$ec_lang['mtc_note_1']='<dl><dt>Iterație automată de dimensionare a rocii și rugozității</dt><dd>Alegeți o opțiune de rugozitate (Blodgett–Bathurst recomandat) și o opțiune de dimensiune de proiectare a rocii (Isbash recomandat). Ajustați adâncimea și factorul de siguranță al dimensiunii rocii pentru a atinge debitul dorit cu o dimensiune uniformă a rocii. De fiecare dată când modificați o valoare de intrare, calculatorul repetă acești pași: 1. Rugozitatea este calculată din dimensiunea de proiectare a rocii. 2. Valoarea rugozității din metoda aleasă de dvs. este copiată în rugozitatea de intrare. 3. Debitul canalului și dimensiunea necesară a rocii sunt calculate. 4. Dimensiunea de proiectare a rocii este ajustată. 5. Repetați până când eroarea din dimensiunea de proiectare a rocii este foarte mică.</dd><dt>Calculator de bază (fără iterație)</dt><dd>Introduceți valoarea dorită de rugozitate. Ignorați zona de intrare a dimensiunii de proiectare a rocii.</dd></dl>';
$ec_lang['mtc_note_2_term']='Verificare viteză';
$ec_lang['mtc_note_2_def']='Viteza mare indică faptul că a existat o cădere de nivel mare, care a generat o energie specifică atât de ridicată. Acea energie se poate pierde rapid la lărgiri, curbe sau obstacole. Verificați dacă acest lucru este rezonabil pentru amplasament.';
$ec_lang['mtc_solver_no_solution']='Nu s-a găsit nicio soluție pentru Q dat cu aceste date de intrare ale canalului.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Deversor Simplu';
$ec_lang['ws_main_title']='Calculator Gratuit Online pentru Deversor Simplu cu Creastă Lată';
$ec_lang['ws_main_desc']='Calculator pentru Deversor Simplu cu Creastă Lată';
$ec_lang['ws_weirLength']='Lungimea deversorului, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Energie pe unitatea de greutate a apei — o înălțime a coloanei de apă, nu o presiune">Sarcină, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Coeficientul deversorului, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Note';
$ec_lang['ws_notes_we_term']='Ecuația deversorului';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Deversor Neregulat';
$ec_lang['wi_main_title']='Calculator Gratuit Online pentru Deversor Neregulat, Segmentat, cu Adâncime Variabilă';
$ec_lang['wi_main_desc']='Calculator pentru Deversor Neregulat';
$ec_lang['wi_weirPoints']='Puncte ale deversorului';
$ec_lang['wi_pondingHeight']='Înălțimea acumulării';
$ec_lang['wi_incrementalFlow']='Debit incremental';
$ec_lang['wi_cumulativeFlow']='Debit cumulat';
$ec_lang['wi_notes_we_def']='q = dacă (length = 0) atunci 0 altfel dacă (slope=0) atunci cw*length*d<sub>0</sub><sup>1.5</sup> altfel cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) unde d<sub>1</sub> și d<sub>0</sub> sunt întotdeauna pozitive sau zero';
// Orifice Flow
$ec_lang['or_main_menu']='Debit prin Orificiu';
$ec_lang['or_main_title']='Calculator Gratuit Online pentru Debitul prin Orificiu';
$ec_lang['or_main_desc']='Debit prin Orificiu — Liber sau Înecat';
$ec_lang['or_shape_circular']='Circulară';
$ec_lang['or_shape_rectangular']='Dreptunghiulară';
$ec_lang['or_diameter']='<span class="ec-help" title="Diametru pentru circular; înălțime pentru dreptunghiular">Diametru sau înălțime, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Numai deschideri dreptunghiulare">Lățime, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Fundul deschiderii">Cota radierului <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Nivelul apei amonte';
$ec_lang['or_twe']='Nivelul apei aval';
$ec_lang['or_cd']='Coeficient de debit, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Cota centroidului';
$ec_lang['or_head']='<span class="ec-help" title="Energie pe unitatea de greutate a apei — o înălțime a coloanei de apă, nu o presiune">Sarcină efectivă, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Aria deschiderii, A';
$ec_lang['or_regime']='Verificarea regimului de orificiu';
$ec_lang['or_regime_valid']='Curgere liberă';
$ec_lang['or_regime_submerged']='Orificiu înecat';
$ec_lang['or_regime_submerged_tip']='TWE deasupra centroidului — regimul de orificiu rămâne valid';
$ec_lang['or_regime_warn']='În afara regimului de orificiu';
$ec_lang['or_regime_warn_tip']='Nivelul apei amonte este sub coronamentul (partea superioară a) deschiderii';
$ec_lang['or_regime_twe_above_hwe']='Verificați datele de intrare';
$ec_lang['or_regime_twe_above_hwe_tip']='Nivelul apei aval (TWE) depășește nivelul apei amonte (HWE)';
$ec_lang['or_notes_1_term']='Ecuația orificiului';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Pentru curgere liberă: h = HWE − centroid. Pentru curgere înecată (TWE deasupra radierului): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Regimul orificiului';
$ec_lang['or_notes_2_def']='Ecuațiile de debit prin orificiu se aplică atunci când suprafața apei din amonte este deasupra coronamentului (partea superioară) deschiderii. Când nivelul din amonte este sub coronament, utilizați în schimb o ecuație de deversor.';
$ec_lang['or_notes_3_term']='Coeficient de debit';
$ec_lang['or_notes_3_def']='C<sub>d</sub> variază de la aproximativ 0,60–0,65 pentru orificii cu muchii ascuțite. Intrările rotunjite sau reintrante folosesc valori diferite. Consultați <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> sau Manualul de Referință Hidraulică HEC-RAS pentru îndrumări.';
$ec_lang['or_notes_4_term']='Înecare';
$ec_lang['or_notes_4_def']='Când TWE este deasupra radierului deschiderii, acest calculator aplică automat ecuația orificiului înecat folosind h = HWE − TWE. Când TWE este la nivelul radierului sau sub acesta, se presupune curgere liberă și h = HWE − centroid.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Micro-Hidroenergie';
$ec_lang['mhp_main_title']='Calculator gratuit online de micro-hidroenergie';
$ec_lang['mhp_main_desc']='Calculator de putere pentru micro-hidrocentrale la cursul apei (fără baraj)';
$ec_lang['mhp_gross_head']='Cădere brută, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Diametrul conductei sub presiune (conducta de alimentare)">Diametrul conductei sub presiune, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Lungimea, L';
$ec_lang['mhp_efficiency']='Randamentul centralei, η (0–1)';
$ec_lang['mhp_vel_check']='Verificarea vitezei';
$ec_lang['mhp_hl_check']='Verificarea pierderii de sarcină';
$ec_lang['mhp_hnet']='Cădere netă, H<sub>net</sub>';
$ec_lang['mhp_power']='Putere produsă, P';
$ec_lang['mhp_annual_kwh']='P ca energie anuală';
$ec_lang['mhp_vel_low']='Viteză mică — risc de sedimentare și antrenare de aer.';
$ec_lang['mhp_vel_high']='Viteză ridicată — verificați pierderile la tranziții, energia disponibilă și lovitura de berbec.';
$ec_lang['mhp_vel_ok_short']='OK';
$ec_lang['mhp_vel_high_short']='Ridicată';
$ec_lang['mhp_vel_low_short']='Mică';
$ec_lang['mhp_vel_ok_tip']='Viteza se află în intervalul eficient pentru proiectarea conductei sub presiune.';
$ec_lang['mhp_hl_ok_tip']='Pierderea de sarcină este sub 10% din sarcina brută. Această dimensiune de conductă este economică.';
$ec_lang['mhp_hl_warn_tip']='Pierderea de sarcină depășește 10% din sarcina brută. Luați în considerare o conductă mai mare.';
$ec_lang['mhp_hl_bad_tip']='Pierderea de sarcină depășește 20% din sarcina brută. Redimensionați conducta.';
$ec_lang['mhp_notes_1_term']='Pierdere de sarcină';
$ec_lang['mhp_notes_1_def']='Pierderea totală h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, unde h<sub>f</sub> = f(L/D)(v²/2g) este pierderea prin frecare Darcy-Weisbach, iar h<sub>m</sub> = k<sub>m</sub>·v²/2g acoperă intrarea, coturile și armăturile. Căderea netă H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Viteză';
$ec_lang['mhp_notes_2_def']='Verificați dacă viteza este rezonabilă pentru căderea disponibilă și costul conductei. O viteză foarte mică poate indica o conductă supradimensionată; o viteză foarte mare poate crește pierderile prin frecare și riscul de lovitură de berbec.';
$ec_lang['mhp_notes_3_term']='Ținta pierderilor de sarcină';
$ec_lang['mhp_notes_3_def']='Pierderile din conducta forțată (conducta de aducțiune) sub 10% din căderea brută sunt în general economice. Compromisul optim între costul conductei și puterea pierdută se situează adesea în jurul valorii de 4–6% atunci când prețul electricității este ridicat.';
$ec_lang['mhp_notes_6_term']='Randament';
$ec_lang['mhp_notes_6_def']='Randamentul tipic al centralei η variază între 0,70 și 0,85 pentru turbinele Pelton și cu flux încrucișat comune în micro-hidroenergie. Utilizați 0,75 ca primă estimare conservatoare.';
$ec_lang['mhp_notes_7_term']='Energie anuală';
$ec_lang['mhp_notes_7_def']='Energia anuală presupune funcționare continuă la debit maxim (8.760 de ore/an). Producția reală va fi mai mică din cauza variației sezoniere a debitului, întreruperii pentru întreținere și factorului de sarcină.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Timp de Golire a Iazului și Rezervorului';
$ec_lang['odt_main_title']='Calculator Gratuit Online Timp de Golire a Iazului, Bazinului și Rezervorului (Orificiu)';
$ec_lang['odt_main_desc']='Timp de Golire a Iazului, Bazinului sau Rezervorului — Evacuare prin Orificiu, Metoda Volumului Conic';
$ec_lang['odt_h1_elev']='Cota inițială a suprafeței apei';
$ec_lang['odt_a1']='Aria inițială, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Cota finală a suprafeței apei';
$ec_lang['odt_a0']='Aria la nivelul orificiului, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Interpolată din modelul conic la cota finală">Aria finală, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Verificarea cotei finale';
$ec_lang['odt_h2_ok']='Cota finală deasupra vârfului orificiului';
$ec_lang['odt_h2_warn']='Cota finală la nivelul sau sub vârful orificiului';
$ec_lang['odt_h2_warn_tip']='Vârful orificiului = centroid + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Diametru (circular) sau înălțime (dreptunghiular)">D orificiu <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Numai dreptunghiular">Lățimea orificiului, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Timp de golire (s)';
$ec_lang['odt_t_min']='Timp de golire (min)';
$ec_lang['odt_t_hr']='Timp de golire (ore)';
$ec_lang['odt_t_day']='Timp de golire (zile)';
$ec_lang['odt_notes_1_term']='Formulă';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) dă timpul de golire de la sarcina H până la orificiu. Timp de golire = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), unde H<sub>1</sub> = cota inițială − cota orificiului, H<sub>2</sub> = cota finală − cota orificiului.';
$ec_lang['odt_notes_2_term']='Metodă';
$ec_lang['odt_notes_2_def']='Metoda volumului conic modelează iazul sau bazinul ca o secțiune conică între aria inițială A<sub>1</sub> la suprafața inițială a apei și aria A<sub>0</sub> la cota centroidului orificiului. A<sub>2</sub>, aria iazului la cota finală, este interpolată din A<sub>1</sub> și A<sub>0</sub> folosind modelul secțiunii conice. Timpul de golire de la cota inițială la cea finală este egal cu timpul total de golire de la H<sub>1</sub> la orificiu minus timpul rămas de golire de la H<sub>2</sub> la orificiu.';
$ec_lang['odt_h1']='<span class="ec-help" title="Cota inițială a suprafeței apei minus cota centroidului orificiului">Sarcina inițială, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Debit maxim, Q<sub>max</sub>';
$ec_lang['odt_vol']='Volum golit';
$ec_lang['odt_sketch_start']='Început';
$ec_lang['odt_sketch_end']='Sfârșit';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Distanța dintre emițătoare, S<sub>e</sub>';
$ec_lang['ip_sl']='Distanța dintre laterale, S<sub>l</sub>';
$ec_lang['ip_n_e']='Emițătoare per lateral, n<sub>e</sub>';
$ec_lang['ip_n_l']='Laterale per zonă, n<sub>l</sub>';
$ec_lang['ip_d']='Adâncimea țintă de aplicare, d';
$ec_lang['ip_a_e']='Suprafața per emițător, A<sub>e</sub>';
$ec_lang['ip_pr']='Rata de aplicare, PR';
$ec_lang['ip_q_lat']='Debit pe lateral, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Debitul zonei, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Timp de funcționare (ore)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Infiltrația Canalului';
$ec_lang['cs_main_title']='Calculator Online Gratuit pentru Pierderi prin Infiltrație și Eficiența de Transport a Canalului';
$ec_lang['cs_main_desc']='Pierderi prin Infiltrație & Eficiența de Transport a Canalului — Metoda Influx-Eflux';
$ec_lang['cs_Q_in']='Influx, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Eflux, Q<sub>out</sub>';
$ec_lang['cs_L']='Lungimea tronsonului, L';
$ec_lang['cs_Q_loss']='Rata de pierderi prin infiltrație, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Verificare măsurători';
$ec_lang['cs_pct_loss']='Fracție pierdută';
$ec_lang['cs_Ec']='Eficiența de transport, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Clasificare eficiență';
$ec_lang['cs_Vol_day']='Volum pierdut zilnic';
$ec_lang['cs_Vol_year']='Volum pierdut anual';
$ec_lang['cs_Q_loss_per_L']='Pierdere pe unitate de lungime, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Valoarea apei';
$ec_lang['cs_lining_cost']='Costul căptușelii';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Obiectiv de eficiență a transportului după căptușire; fracție 0–1">Obiectiv de căptușeală, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Suprafață căptușeală, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Valoare anuală pierdută';
$ec_lang['cs_annual_value_recovered']='Valoare anuală recuperată';
$ec_lang['cs_lining_total_cost']='Costul total al căptușelii';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Amortizare simplă = costul total al căptușelii ÷ valoarea anuală recuperată">Perioadă de amortizare <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — infiltrație detectată';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — fără pierdere măsurabilă';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — verificați măsurătorile';
$ec_lang['cs_Ec_good']='Bun — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Satisfăcător — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Slab — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='Metoda influx-eflux estimează infiltrația prin măsurarea debitului la intrarea și ieșirea unui tronson de canal: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Eficiența de transport E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Volumul anual presupune funcționare continuă la debit maxim; pierderea reală este mai mică pentru canale sezoniere sau cu debit parțial.';
$ec_lang['cs_notes_2_term']='Clasificarea eficienței';
$ec_lang['cs_notes_2_def']='Canale de pământ necăptușite tipice: E<sub>c</sub> = 60–80%. Canale de pământ bine întreținute: 75–85%. Canale cu căptușeală din beton: 90–98%. Pierderi prin infiltrație peste 30% din debitul de intrare justifică adesea o investiție în căptușire. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Amortizarea Căptușelii';
$ec_lang['cs_notes_3_def']='Introduceți valoarea apei și costul căptușelii în orice monedă consistentă. Suprafață căptușeală = lungimea tronsonului × perimetrul udat — perimetrul udat al secțiunii transversale a canalului la adâncimea de curgere măsurată (lățimea fundului plus ambii taluzi udați). Valoarea anuală recuperată presupune că canalul căptușit atinge în mod continuu E<sub>c</sub> țintă. Amortizarea reală va fi mai lungă pentru canale sezoniere sau dacă căptușeala nu atinge eficiența țintă.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, ediția a 3-a (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='Despre';
$ec_lang['install_main_menu']='Instalare';
$ec_lang['install_main_title']='Instalează EngCalcs';
$ec_lang['install_main_desc']='Adaugă pe dispozitiv pentru utilizare offline';
$ec_lang['install_intro']='EngCalcs este o aplicație web progresivă (PWA). Odată instalată, toate calculatoarele funcționează complet offline — nu este nevoie de conexiune la internet.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Deschideți orice pagină de calculator în Chrome.</li><li>Atingeți butonul <strong>⬇ Instalare</strong> din bara de navigare de sus sau atingeți meniul browserului (⋮) și alegeți <strong>Adăugare pe ecranul de start</strong>.</li><li>Atingeți <strong>Instalare</strong> în fereastra care apare.</li><li>EngCalcs apare pe ecranul de start și funcționează offline.</li>';
$ec_lang['install_now_btn']='⬇ Instalează acum';
$ec_lang['install_prompt_unavailable']='Fereastra de instalare nu este disponibilă — folosiți meniul browserului.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Deschideți orice pagină de calculator în Safari.</li><li>Atingeți butonul <strong>Distribuire</strong> (pătrat cu săgeată în sus).</li><li>Derulați în jos și atingeți <strong>Adăugare pe ecranul de pornire</strong>.</li><li>Atingeți <strong>Adaugă</strong>. EngCalcs apare pe ecranul de start.</li>';
$ec_lang['install_ios_note']='Pe iOS, instalarea se face întotdeauna prin meniul Distribuire — nu există o fereastră automată de instalare.';
$ec_lang['install_desktop_heading']='Computer (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Deschideți orice pagină de calculator.</li><li>Faceți clic pe <strong>pictograma de instalare</strong> (⊕ sau pictograma unui computer) din bara de adrese a browserului sau deschideți meniul browserului și alegeți <strong>Instalare EngCalcs…</strong></li><li>Faceți clic pe <strong>Instalare</strong>. EngCalcs se deschide ca o aplicație independentă.</li>';
$ec_lang['install_firefox_heading']='Firefox / Alte browsere';
$ec_lang['install_firefox_body']='Dacă browserul dvs. nu oferă o opțiune de instalare, nu se pierde nimic: folosiți calculatoarele normal în browser, iar după prima vizită paginile sunt stocate automat în cache pentru utilizare offline. Cazul obișnuit este Firefox pe desktop.';
$ec_lang['install_cached_heading']='Ce este salvat în memoria cache';
$ec_lang['install_cached_body']='La prima instalare a EngCalcs, toate paginile calculatoarelor și fișierele lor suport (scripturi, stiluri) sunt salvate automat pe dispozitivul dvs. După aceea, totul funcționează fără conexiune la internet. Limba aleasă este reținută de la ultima vizită online.';
$ec_lang['contact_main_menu']='Contacteaza';
$ec_lang['about_main_title']='Despre calculatoarele de inginerie HawsEDC';
$ec_lang['about_main_desc']='Misiune, software liber și contribuții';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Misiune</h3><p>Calculatoarele de Inginerie HawsEDC sunt oferite gratuit online din 2010. Ele există pentru a servi ingineri și muncitori de teren din întreaga lume — în special cei care lucrează în regiuni cu deficit de apă, resurse limitate sau insuficient deservite. Aceste instrumente fac parte dintr-o misiune umanitară mai amplă: să spună fiecărui om în cel mai practic și eficient mod posibil <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">că este iubit și prețuit pentru totdeauna, că nu are nimic de care să se teamă și că nu va ruina totul</a>.</p><p>Calculatoarele sunt vehiculul. Destinația este o lume fără suferință.</p><h3>Licență de software liber și cu sursă deschisă</h3><p>Tot codul este publicat sub <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 sau mai nou</a> — liber ca în libertate. Puteți utiliza, studia, modifica și redistribui codul în aceleași condiții.</p><p>Site-ul care îl găzduiește este oferit gratuit astăzi și din 2010; dacă într-o zi nu va mai putea fi, software-ul rămâne al dumneavoastră, pentru a-l rula.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Cod Sursă</h3><p>Codul sursă complet este disponibil public pe GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Puteți răsfoi codul, semnala probleme sau face fork la depozit acolo.</p><h3>Contribuție</h3><p>Orice ajutor este binevenit. <a href="contact.php">Contactați-l pe Tom Haws</a>.</p><ul><li><strong>Traduceri:</strong> Sugerați o formulare mai bună. Îmbunătățiți sau adăugați o limbă.</li><li><strong>Rapoarte de erori:</strong> Utilizați formularul de feedback pe orice pagină de calculator sau semnalați o problemă pe GitHub.</li><li><strong>Calculatoare noi:</strong> Ideile pentru instrumente de inginerie hidraulică care servesc lucrătorilor de teren și practicienilor în irigații sunt deosebit de binevenite.</li><li><strong>Găzduire:</strong> Dacă puteți oglindi aceste calculatoare pentru o regiune cu conectivitate limitată, vă rugăm să mă contactați.</li></ul><h3>Utilizare offline</h3><p>Deschideți o dată oricare calculator cât timp sunteți conectat la internet și toate vor continua să funcționeze când nu mai sunteți: browserul dvs. stochează întreaga suită pe măsură ce lucrați. Mecanismul este o <strong>Aplicație Web Progresivă (PWA)</strong>, dacă doriți să citiți despre ea. După aceea, toate calculatoarele funcționează offline — nu este necesar internetul.</p><p>Pe Android sau iOS, folosiți opțiunea „Adaugă pe ecranul principal” din browserul dvs. pentru a instala EngCalcs ca aplicație pe dispozitivul dvs. Pe desktop, căutați pictograma de instalare în bara de adrese a browserului.</p><p>Puteți, de asemenea, să salvați orice calculator individual folosind meniul „Salvare ca…” din browser pentru utilizare offline ocazională.</p><h3>Contact</h3><p>Tom Haws, inginer hidraulic și fondatorul acestor calculatoare.<br />Folosiți formularul de feedback pe orice pagină de calculator sau accesați codul sursă pe <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Trimiteți un mesaj lui Tom Haws';
$ec_lang['contactYourName']='Numele dumneavoastră:';
$ec_lang['contactYourEmail']='Adresa dumneavoastră de e-mail:';
$ec_lang['contactSubject']='Subiect:';
$ec_lang['contact_message']='Mesaj:';
$ec_lang['contactSpamPrefix']='Cinci plus unu este egal cu';
$ec_lang['contactSpamPostfix']='(Vă rugăm să scrieți cu litere. 1=unu 2=doi 3=trei 4=patru 5=cinci 6=șase 7=șapte +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Trimiteți Mesajul';
$ec_lang['contact_success']='Mulțumesc că ați luat timp pentru a scrie.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Proiectarea Canalului Rapid de Anrocament (Robinson)';
$ec_lang['rc_main_title']='Calculator Online Gratuit pentru Proiectarea Canalului Rapid de Anrocament — Robinson (1998)';
$ec_lang['rc_main_desc']='Dimensionarea Pietrei de Protecție a Canalului Rapid — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Panta fundului canalului rapid, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Debitul pe unitate de lățime la intrarea în canalul rapid. Pentru un canal cu lățimea fundului B și debitul total Q, utilizați q_t = Q / B.">Debit unitar total, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Porozitatea pietrei de protecție, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Densitate relativă la apă. Granit sau bazalt concasat tipic ≈ 2,65. Interval valid Robinson: 2,54–2,82.">Densitatea relativă a rocii, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Abaterea standard a granulozității. Piatră uniformă ≈ 1,25. Interval valid Robinson: 1,15–1,47.">Granulozitate SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Înălțarea (Hp > yn) este benefică — reduce eroziunea în amonte. (USDA)">Adâncimea normală în canalul de intrare, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Ec. 1 (S0 < 0.10) sau Ec. 2 (0,10–0,40). Valid: D50 15–278 mm, S0 0,02–0,40. În afara intervalului: extrapolat.">Dimensiunea mediană necesară a pietrei, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Ecuație aplicată';
$ec_lang['rc_sg_check']='Verificare densitate relativă';
$ec_lang['rc_SD_check']='Verificare granulozitate SD';
$ec_lang['rc_sg_ok']='sg în intervalul valid';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']='sg sub intervalul Robinson';
$ec_lang['rc_sg_low_tip']='Interval valid: 2,54–2,82';
$ec_lang['rc_sg_high']='sg peste intervalul Robinson';
$ec_lang['rc_sg_high_tip']='Interval valid: 2,54–2,82';
$ec_lang['rc_SD_ok']='SD în intervalul valid';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']='SD sub intervalul Robinson';
$ec_lang['rc_SD_low_tip']='Interval valid: 1,15–1,47';
$ec_lang['rc_SD_high']='SD peste intervalul Robinson';
$ec_lang['rc_SD_high_tip']='Interval valid: 1,15–1,47';
$ec_lang['rc_layer']='Grosimea stratului de piatră (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Raza curbei la coronamentul superior (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Lungimea arcului curbei la coronament';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Necesară pentru susținerea structurală a pietrei canalului rapid. “Nivelul minim de apă din aval, rezultat din tronsonul de ieșire și din rezistența canalului din aval, este suficient pentru a asigura stabilitatea pietrei de protecție în tronsonul de ieșire.” (Robinson)">Lungimea radierului de ieșire (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Rugozitatea Manning în canalul rapid, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Fracțiunea din qt care curge prin porii pietrei de protecție. Restul qs curge la suprafață. Implicit np = 0,45 pentru piatră concasată cu muchii ascuțite.">Viteza prin mantaua de piatră, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Debit unitar prin mantaua de piatră, q<sub>m</sub>';
$ec_lang['rc_qs']='Debit unitar la suprafață, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Adâncimea curgerii deasupra suprafeței pietrei, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Înălțarea (Hp > yn) este benefică — reduce eroziunea în amonte. (USDA)">Sarcina hidraulică la intrare, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Verificare înălțare la intrare';
$ec_lang['rc_pond_ok']='H<sub>p</sub> > y<sub>n</sub> — înălțare în amonte';
$ec_lang['rc_pond_ok_tip']='Înălțarea în amonte de intrarea canalului rapid este benefică; reduce eroziunea în amonte. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — fără înălțare — risc de eroziune la intrare';
$ec_lang['rc_pond_warn_tip']='Nu există înălțare în amonte de intrarea canalului rapid; poate apărea eroziune în amonte. (USDA)';
$ec_lang['rc_eq1']='Ec. 1 (S<sub>0</sub> < 0,10) — pantă lină';
$ec_lang['rc_eq2']='Ec. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — pantă abruptă';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — sub intervalul de validare Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — peste intervalul de validare Robinson';
$ec_lang['rc_notes_1_term']='Ecuații de dimensionare a pietrei';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) au elaborat două ecuații empirice pentru dimensiunea mediană a pietrei de protecție D<sub>50</sub> pe baza pantei canalului și a debitului unitar. Ecuația 1 se aplică pentru pante line (S<sub>0</sub> < 0,10); Ecuația 2 se aplică pentru pante abrupte (0,10 ≤ S<sub>0</sub> ≤ 0,40). Ambele ecuații necesită q<sub>t</sub> în m²/s și returnează D<sub>50</sub> în mm. Intervalul validat este 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Debitul unitar';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> este debitul unitar total la coronamentul canalului rapid (debit total pe unitate de lățime). Pentru un canal cu lățimea fundului B și debitul total Q, se poate aproxima q<sub>t</sub> ≈ Q / B, sau se poate calcula din condiția adâncimii critice la intrarea în canalul rapid.';
$ec_lang['rc_notes_3_term']='Curgerea prin mantaua de piatră';
$ec_lang['rc_notes_3_def']='O fracțiune din debitul total se deplasează prin porii pietrei de protecție (debitul prin mantaua q<sub>m</sub>); restul curge la suprafața pietrei (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). Adâncimea de curgere d se calculează din ecuația lui Manning aplicată debitului de suprafață q<sub>s</sub> cu rugozitatea canalului rapid n. Porozitatea implicită n<sub>p</sub> = 0,45 este tipică pentru piatra concasată cu muchii ascuțite.';
$ec_lang['rc_notes_5_term']='Intervalul valid al dimensiunii pietrei';
$ec_lang['rc_notes_5_def']='Ecuațiile au fost elaborate pentru un interval D<sub>50</sub> de 15 mm până la 278 mm. Rezultatele în afara acestui interval sunt extrapolate și trebuie utilizate cu judecată inginerească suplimentară.';
$ec_lang['rc_notes_6_term']='Cota radierului de ieșire';
$ec_lang['rc_notes_6_def']='Cota suprafeței superioare a pietrei de protecție în zona de ieșire trebuie să fie la sau sub cota fundului canalului aval. Dacă este mai ridicată, piatra de protecție de la ieșire va fi instabilă.';

$ec_lang['rc_notes_7_def']='Când adâncimea normală în canalul de intrare este mai mică decât sarcina hidraulică (H<sub>p</sub>) necesară pentru a evacua q<sub>t</sub>, apare restricție de debit sau înălțare în amonte de intrarea în canal. Aceasta este în general acceptabilă — înălțarea reduce viteza și previne eroziunea în amonte. Verificare: utilizați un calculator de deversor pentru a determina H<sub>p</sub> pentru q<sub>t</sub> și lățimea crestei date, și comparați cu adâncimea normală a canalului de intrare. Dacă H<sub>p</sub> depășește adâncimea normală, va apărea înălțare.';
$ec_lang['rc_notes_4_term']='Referință';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS publică, de asemenea, un <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">tabel Excel</a> bazat pe aceeași metodă.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Filtru';
$ec_lang['rc_sketch_top_crest_curve'] = 'Curbă de coronament';
$ec_lang['rc_sketch_outlet_apron']    = 'Radier de ieșire';
$ec_lang['rc_sketch_radius']          = 'rază';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Presiune Irigație';
$ec_lang['ip_main_title']='Calculator Online Gratuit pentru Presiunea de Irigație & Uniformitatea Distribuției';
$ec_lang['ip_main_desc']='Presiunea Ramurii Test și Estimarea Uniformității';
$ec_lang['ip_h_supply']='Presiune de alimentare';
$ec_lang['ip_elev_supply']='Cota de alimentare, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Debit de proiectare al emițătorului, q<sub>design</sub>';
$ec_lang['ip_h_design']='Presiune de proiectare a emițătorului';
$ec_lang['ip_x']='<span class="ec-help" title="0,5 pentru emițători standard necompensați; aproape de 0 pentru emițători cu compensare de presiune">Exponentul de debit al emițătorului, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Calea test';
$ec_lang['ip_group_reach']='Tronson';
$ec_lang['ip_group_upstream']='Amonte';
$ec_lang['ip_group_downstream']='Aval';
$ec_lang['ip_group_loss']='Pierdere';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Bifat: acest tronson este un segment al lateralului test, din care emițătorii individuali preiau apă. Nebifat: acest tronson este o conductă principală, transmițând doar debit către laterale care nu sunt pe calea test.">Lat. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Rânduri laterale: emițători doar în acest tronson. Rânduri principale: total emițători pe laterale ALTELE decât acesta, care se ramifică din acest tronson. Pentru tronsonul liniei principale care se termină la linia lateralului test, aceasta include și orice laterale dincolo de acel punct de-a lungul principalului, sau care împart aceeași joncțiune (de ex. un lateral de partea opusă) — debitul lor se ramifică tot din acest tronson.">Emițători <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Cota capătului aval al acestui tronson. Opțional pe rândurile interioare (implicit plat / la fel ca nodul de deasupra dacă se lasă gol). Necesară pe rândul final: acea valoare este cota ultimului emițător, care stabilește direct presiunea de alimentare necesară.">Cota Aval <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Cota ultimului emițător (rândul final) a fost lăsată goală și s-a setat implicit la plat — introduceți-o pentru un rezultat exact';
$ec_lang['ip_press']='Pres.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Pierderea totală a tronsonului, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Presiune scăzută/negativă — verificați condițiile subatmosferice';
$ec_lang['ip_pressure_warn_short']='Scăzută';
$ec_lang['ip_pressure_high']='Presiune ridicată — necesită reducerea presiunii';
$ec_lang['ip_pressure_high_short']='Ridicată';
$ec_lang['ip_max_head']='Presiune max. adm. conductă';
$ec_lang['ip_max_head_tip']='Tronsoanele a căror presiune depășește această valoare sunt semnalate. Lăsați necompletat pentru a omite verificarea presiunii ridicate.';
$ec_lang['ip_h_far']='Presiunea ultimului emițător';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Debitul care intră doar în calea test modelată — pentru întreaga zonă/sistem, vezi Q_zone în Proiectarea Aplicației de mai jos.">Debitul de alimentare al căii test, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Debitul ultimului emițător, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Debitul mediu al emițătorului (lateralul test), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="Cât de mult mai mare (sau mai mic) estimați că funcționează un lateral tipic în comparație cu acest lateral test. Lateralul test este presupus în mod deliberat cazul cel mai defavorabil, deci media sa proprie subestimează media de teren — lăsat la 0, verificarea uniformității și cifrele de proiectare a aplicației de mai jos folosesc media proprie a lateralului test (probabil optimistă) ca atare.">Est. Δpresiune, medie vs. lateralul test <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral reevaluat la presiunea fiecărui rând lateral, plus diferența de presiune introdusă mai sus — o încercare de a corecta faptul că lateralul test este presupus a fi cazul cel mai defavorabil, nu unul reprezentativ. Alimentează atât verificarea uniformității, cât și secțiunea de proiectare a aplicației de mai jos.">Est. debitul mediu al emițătorului pe teren, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Debitul calculat al ultimului emițător împărțit la debitul mediu estimat al emițătorului pe teren — aceasta este o aproximare a Uniformității Distribuției de sfert inferior standard (media grupului inferior ÷ media populației); provine dintr-un eșantion modelat mic și o corecție estimată de utilizator, nu dintr-un eșantion statistic complet de teren. Valorile la sau peste 1 sunt posibile și valide: înseamnă doar că presiunea ultimului emițător este la sau peste media estimată de teren, deci un alt emițător este punctul de presiune minimă. Aceasta se poate datora faptului că ultimul emițător se află pe teren jos sau că estimarea Δpresiune este prea mică.">Verificarea uniformității, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Presiunea la emițătorul test ≥ presiunea de alimentare. Acesta probabil nu este emițătorul de caz cel mai defavorabil, sau conductele ar putea fi micșorate.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Aceasta este diferită de aproximarea noastră a măsurii standard de uniformitate.">Debitul ultimului emițător ÷ debitul de proiectare, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Fără soluție: presiunea de alimentare necesară depășește presiunea de alimentare introdusă. Măriți presiunea de alimentare, reduceți cererea sau utilizați o conductă mai mare.';
$ec_lang['ip_notes_1_def']='Estimează presiunea la ultimul (cel mai îndepărtat) emițător, apoi retrasează Linia Energetică înapoi către alimentare, tronson cu tronson, adăugând pierderi prin frecare și pierderi locale pe parcurs. Elevația și sarcina de viteză sunt scăzute la fiecare nod pentru a raporta presiunea reală acolo. Presiunea estimată la capătul îndepărtat este ajustată (prin bisecție) până când presiunea de alimentare calculată necesară corespunde cu presiunea de alimentare introdusă — aceeași problemă cu buclă închisă abordată de rezolvatorul curgerii în conductă din calculatorul Manning Pipe Flow, extinsă la o rețea ramificată.';
$ec_lang['ip_notes_2_term']='Tronsoane Principale vs. Laterale';
$ec_lang['ip_notes_2_def']='Fiecare rând este un tronson de-a lungul singurei căi hidraulic celei mai defavorabile (calea test) de la alimentare până la ultimul emițător. Un tronson Principal transmite debit doar către laterale care nu sunt pe calea test, deci extragerea sa este o simplă multiplicare (debitul de proiectare × numărul total de emițători ai tronsonului) — fără sensibilitate la presiunea locală. Conducta principală este o conductă trunchi partajată, deci tronsonul liniei principale care se termină la linia lateralului test trebuie să includă nu doar laterale între propriile sale capete, ci și orice laterale aflate mai departe de-a lungul principalului dincolo de acel punct, sau care împart aceeași joncțiune (de ex. un lateral de partea opusă) — debitul lor trece prin acest tronson înainte de a se ramifica, indiferent dacă apar sau nu în altă parte a acestui tabel. Un tronson Lateral este un segment al lateralului test propriu-zis: debitul emițătorului se calculează din presiunea locală reală via q = k·H<sup>x</sup>, iar pierderea prin frecare este redusă cu factorul F(n) al lui Christiansen pentru a ține cont de scăderea debitului pe măsură ce fiecare emițător din tronson preia apă.';
$ec_lang['ip_notes_3_term']='Limitări';
$ec_lang['ip_notes_3_def']='Modelează o singură presiune de alimentare fixă (fără curbă de pompă), o singură cale test (nu întregul teren), și o curbă a emițătorului cu 2 parametri (setați exponentul aproape de 0 pentru a aproxima un emițător cu compensare de presiune). Sunt raportate două rapoarte de uniformitate diferite, păstrate deliberat separate: q<sub>last</sub>/q<sub>avg,field</sub> este o aproximare a Uniformității Distribuției de sfert inferior standard (media grupului inferior ÷ media populației); dar aceasta provine dintr-un eșantion modelat mic și o corecție estimată de utilizator, în loc de eșantionul statistic complet de teren standard. De asemenea, lateralul test este presupus în mod deliberat a fi cazul cel mai defavorabil, deci media sa brută, necorectată, ar subestima media reală de teren și ar face uniformitatea să pară mai bună decât este; intrarea Δpresiune există special pentru a contracara această denaturare. Valorile de uniformitate la sau peste 1 sunt totuși posibile: ele înseamnă doar că presiunea ultimului emițător este la sau peste media estimată de teren, deci un alt emițător este punctul de presiune minimă. Aceasta se poate datora faptului că ultimul emițător se află pe teren jos sau că estimarea Δpresiune este prea mică. q<sub>last</sub>/q<sub>design</sub> este o verificare diferită, non-uniformitate, față de debitul nominal al fabricantului — utilă pentru detectarea unui sistem supra- sau subpresurizat în ansamblu, dar este o verificare separată, de citit alături de cifra de uniformitate, deoarece debitul de proiectare/nominal este independent de presiunea medie reală de funcționare a sistemului.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” Buletin 670 al Stației de Experiment Agricol California. Standardele ASAE/ASABE pentru proiectarea microirigației folosesc aceeași abordare a pierderii prin frecare cu ieșiri multiple.';
$ec_lang['ip_notes_5_term']='Proiectarea Aplicației';
$ec_lang['ip_notes_5_def']='Rata de aplicare și debitul sistemului/zonei folosesc debitul mediu estimat al emițătorului pe teren (q<sub>avg,field</sub> — media proprie a lateralului test, corectată prin estimarea Δpresiune introdusă), nu o rată ghicită: PR = q<sub>avg,field</sub> / A<sub>e</sub>, alimentată de valoarea modelată corectată. Distanța și numărul de laterale/emițători la nivelul întregului sistem sunt intrări separate aici, deoarece calea test modelează doar o singură ramură de caz cel mai defavorabil, nu fiecare lateral din teren.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Rețea de conducte ramificată';
$ec_lang['bpn_main_title']='Calculator online gratuit de presiune pentru rețele de conducte ramificate (fără bucle)';
$ec_lang['bpn_main_desc']='Debit și presiune în rețea de conducte ramificată (arborescentă)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Sarcina statică de alimentare: sarcina sursei la debit zero. Nivelul apei într-un rezervor sau bazin deasupra cotei de alimentare, sau sarcina la vană închisă a unei pompe. Adăugați punctele de alimentare 2 și 3 pentru a defini o pompă sau o curbă de alimentare variabilă; instrumentul citește sarcina la debitul de proiectare.';
$ec_lang['bpn_elev_source']='Cota de alimentare';
$ec_lang['bpn_q_total']='Debit total';
$ec_lang['bpn_q_total_tip']='Debitul total care iese din sursă (suma tuturor cerințelor din rețea).';
$ec_lang['bpn_p_min']='Presiunea minimă';
$ec_lang['bpn_p_min_tip']='Cea mai mică presiune aval din întreaga rețea; punctul critic de livrare.';
$ec_lang['bpn_method']='Metoda de frecare';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Tronsoane de conductă';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Numele acestui tronson de conductă. Alte tronsoane îl referențiază în coloana ID amonte.';
$ec_lang['bpn_upstream']='ID amonte';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID-ul tronsonului care alimentează acest tronson. Lăsați necompletat pentru a urma tronsonul direct de deasupra (o conductă simplă în serie). Introduceți un ID aici pentru a ramifica dintr-un alt tronson.';
$ec_lang['bpn_roughness_tip']='Rugozitatea conductei pentru metoda de frecare selectată: n Manning, C Hazen-Williams, sau înălțimea de rugozitate e Darcy-Weisbach (o lungime). Conductă din plastic neted, valori tipice: n circa 0,009, C circa 150, e circa 0,0015 mm.';
$ec_lang['bpn_demand']='Cerință';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Debit fix livrat la capătul aval al acestui tronson.';
$ec_lang['bpn_demand_mult']='Multiplicator de debit';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Scalează simultan debitul tuturor tronsoanelor, pentru un calcul de oră de vârf sau de creștere viitoare. Utilizați 1 pentru debitele introduse ca atare.';
$ec_lang['bpn_elev_down']='Cotă av.';
$ec_lang['bpn_q_line']='Debit tronson';
$ec_lang['bpn_q_line_tip']='Debitul total transportat de acest tronson: cerința sa proprie plus fiecare cerință aval pe care o alimentează.';
$ec_lang['bpn_p_down']='Pres. av.';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Sarcina de presiune manometrică la nodul aval al acestui tronson. O valoare negativă (semnalată) înseamnă presiune subatmosferică; verificați proiectul.';
$ec_lang['bpn_sketch_heading']='Schema rețelei';
$ec_lang['bpn_source_label']='Sursă';
$ec_lang['bpn_line_problem']='Acest tronson nu este conectat la sursă: indică un ID amonte necunoscut, se referă la sine, repetă un ID deja folosit de alt tronson sau formează o buclă. Tronsoanele neconectate rămân nerezolvate.';
$ec_lang['bpn_bad_id_short']='ID incorect';


$ec_lang['bpn_pressure_warn']='Presiune scăzută/negativă; verificați condițiile subatmosferice';
$ec_lang['bpn_pressure_warn_short']='Scăzută';
$ec_lang['bpn_notes_1_term']='În serie implicit, ramificare prin excepție';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Lăsați ID amonte necompletat și un tronson îl urmează pe cel de deasupra; o conductă simplă în serie. Introduceți ID-ul unui tronson amonte pentru a ramifica din el. Deci: în serie implicit, un arbore când aveți nevoie.';
$ec_lang['bpn_notes_2_term']='Doar rețele ramificate, fără bucle';
$ec_lang['bpn_notes_2_def']='Fiecare tronson are exact un tronson amonte (un arbore). Acest instrument nu rezolvă rețele cu bucle; acestea necesită metode iterative (EPANET sau similar). Excluderea buclelor este ceea ce menține instrumentul simplu și exact.';
$ec_lang['bpn_notes_3_term']='Fără controale active de presiune';
$ec_lang['bpn_notes_3_def']='Puteți adăuga o vană cu pierdere locală fixă (o valoare k), dar nu vane reductoare sau susținătoare de presiune (PRV/PSV). Starea lor deschis/închis depinde de debit și presiune, ceea ce ar forța iterația.';


$ec_lang['bpn_supply2_q']='Debit de alimentare 2';
$ec_lang['bpn_supply2_h']='Sarcină de alimentare 2';
$ec_lang['bpn_supply3_q']='Debit de alimentare 3';
$ec_lang['bpn_supply3_h']='Sarcină de alimentare 3';
$ec_lang['bpn_supply_pt_tip']='Puncte opționale 2 și 3 ale curbei de alimentare. Introduceți un debit și o sarcină pentru fiecare pentru a modela o pompă, sau orice sursă a cărei sarcină scade pe măsură ce livrează mai mult debit; instrumentul citește sarcina la debitul de proiectare. Punctul 1 de mai sus este sarcina statică la debit zero. Lăsați 2 și 3 necompletate pentru o sarcină de rezervor constantă.';
$ec_lang['bpn_h_supply']='Sarcină de alimentare';
$ec_lang['bpn_h_supply_tip']='Sarcina sursei la debitul de proiectare, citită din curba de alimentare. Este egală cu sarcina sursei introdusă atunci când curba este plată (un rezervor).';
$ec_lang['bpn_supply1_h']='Sarcină statică de alimentare';
$ec_lang['lpn_main_menu']='Rețea de apă';
$ec_lang['lpn_main_title']='Modelare online gratuită a rețelelor de distribuție a apei, cu rezolvitorul EPANET';
$ec_lang['lpn_main_desc']='Analiza rețelei de alimentare cu apă: desenați o rețea de conducte inelară sau importați fișiere EPANET';
$ec_lang['lpn_title_units']='Unități {units}';
$ec_lang['lpn_tool_select']='Selectare';
$ec_lang['lpn_tool_add_junction']='Joncțiune';
$ec_lang['lpn_tool_add_reservoir']='Rezervor';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Bazin';
$ec_lang['lpn_tool_add_pipe']='Conductă';
$ec_lang['lpn_tool_add_pump']='Pompă';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Vană';
$ec_lang['lpn_tool_add_text']='Text';
$ec_lang['lpn_tool_vertices']='Vârfuri';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Abonat';
$ec_lang['lpn_tool_add_meter_tip']='Faceți clic unde se află abonatul, apoi faceți clic pe conducta sau nodul care îl deservește. Cerința pe care o dați abonatului este adăugată joncțiunii de la capătul apropiat al acelei conducte.';
$ec_lang['lpn_mode_add_meter']='Abonat: faceți clic unde se află abonatul, apoi faceți clic pe conducta sau nodul care îl deservește. Sau folosiți Esc pentru a anula.';
$ec_lang['lpn_pane_tab_customers']='Abonați';
$ec_lang['lpn_customer_heading']='Abonat {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Cerință per branșament';
$ec_lang['lpn_field_meter_count']='Numărul de branșamente';
$ec_lang['lpn_field_meter_total']='Cerință totală';
$ec_lang['lpn_field_meter_total_tip']='Cerința per branșament înmulțită cu numărul de branșamente. Acesta este numărul adăugat joncțiunii numite mai jos.';
$ec_lang['lpn_field_meter_pipe']='Element conectat';
$ec_lang['lpn_field_meter_pipe_suggest']='Cel mai apropiat element este {id}. Tastați-l aici pentru a deservi acest abonat de la el.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Conectat la';
$ec_lang['lpn_field_meter_node_tip']='Joncțiunea la care este conectat acest abonat. Trageți punctul de conectare pe o conductă pentru a-l deservi în schimb dintr-un punct de-a lungul acelei conducte.';
$ec_lang['lpn_meter_pipe_unknown']='Nimic din acest proiect nu se numește {id}, deci abonatul a fost lăsat unde era.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='Cum crește și scade cerința acestui abonat pe parcursul rulării. Multiplică cerința totală, deci acționează asupra fiecărui branșament pe care îl reprezintă acest abonat. Lăsați-l la Niciun model pentru a urma Modelul implicit de cerință al proiectului.';
$ec_lang['lpn_meter_pattern_unknown']='Niciun model din acest proiect nu se numește {id}, deci abonatul a fost lăsat cum era.';
$ec_lang['lpn_meter_placed']='Abonatul {id} a fost adăugat. Descrierea și cerința sa se tastează în tabelul Abonați, sau apăsați-l în Selectare pentru a-i deschide caseta.';
$ec_lang['lpn_field_meter_pipe_tip']='Elementul la care se conectează acest branșament. Tastați altul aici sau în tabelul Abonați pentru a-l schimba, sau trageți punctul de conectare la un alt element.';
$ec_lang['lpn_field_meter_station']='Poziție de-a lungul conductei (%)';
$ec_lang['lpn_field_meter_station_tip']='Cât de departe de-a lungul conductei se conectează branșamentul, ca procent al conductei de la primul ei nod la al doilea. 0 este la un capăt, iar 100 la celălalt. Cercul de pe conductă face același lucru cu indicatorul.';
$ec_lang['lpn_field_meter_offset']='Decalaj față de conductă';
$ec_lang['lpn_field_meter_offset_tip']='Pozitiv înseamnă la dreapta conductei, privind de la primul ei nod spre al doilea. Tastarea unei valori aici poate muta abonatul de cealaltă parte a magistralei, iar linia de branșament este întotdeauna perpendiculară pe magistrală.';
$ec_lang['lpn_field_meter_lumped']='Adăugat la nod';
$ec_lang['lpn_field_meter_lumped_tip']='Cel mai apropiat nod; cerințele acestui abonat sunt adăugate acolo.';
$ec_lang['lpn_node_customers']='Cerințe ale abonaților';
$ec_lang['lpn_node_customers_tip']='Lista abonaților adăugați la acest nod (pentru că a fost cel mai apropiat). Cerințele abonaților se adaugă la celelalte cerințe listate aici. Un abonat se editează acolo unde se află pe hartă sau în tabelul Abonați.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} de la {n} abonați';
$ec_lang['lpn_customer_detached']='⚠ Acest abonat nu este conectat la nicio conductă, deci cerința sa nu este inclusă în rezultate. Ștergeți-l, sau desenați o conductă și mutați abonatul pe ea.';
$ec_lang['lpn_customer_fixed_head']='⚠ Capătul apropiat al acelei conducte are o suprafață de apă fixă, deci această cerință nu afectează simularea.';
$ec_lang['lpn_customer_detached_count']='{n} abonați nu sunt conectați la nicio conductă. Cerința lor nu este luată în calcul.';
$ec_lang['lpn_meter_pick_pipe']='Acum faceți clic pe conducta sau nodul care deservește acest abonat. Abonatul rămâne unde l-ați pus. Apăsați Escape pentru a anula.';
$ec_lang['lpn_inp_export_flat_customers']='Un fișier EPANET nu are abonați. Cerința celor {n} abonați din acest proiect intră în fișier ca un rând de cerință pe joncțiunea la care este adăugat fiecare, iar fiecare rând este numit cu marcajul abonatului. Ceea ce fișierul nu poate păstra este abonatul: unde se află, ce conductă îl deservește, unde de-a lungul acelei conducte se conectează branșamentul, și câte branșamente reprezintă un abonat. Propriul dvs. fișier de proiect păstrează toate acestea.';

$ec_lang['lpn_area_hint_window_start']='Faceți clic pe un colț al ferestrei.';
$ec_lang['lpn_area_hint_window_go']='Faceți clic pe colțul opus pentru a termina.';
$ec_lang['lpn_area_hint_lasso_start']='Faceți clic pentru a începe conturul.';
$ec_lang['lpn_area_hint_lasso_go']='Deplasați pentru a desena conturul. Faceți clic pentru a termina.';
$ec_lang['lpn_area_hint_polygon_start']='Faceți clic pentru a desena zona poligonală. Faceți dublu clic pentru a termina.';
$ec_lang['lpn_area_hint_polygon_go']='Faceți clic pe fiecare colț. Faceți dublu clic pe ultimul pentru a termina.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Țineți apăsat Shift în timp ce selectați pentru a continua cu selecția existentă, adăugând sau eliminând (comutare) ceea ce selectați.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Apăsați pe hartă și trageți în jurul a ceea ce doriți, apoi ridicați degetul.';
$ec_lang['lpn_area_hint_touch_go']='Trageți în jurul a ceea ce doriți, apoi ridicați degetul pentru a termina.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Afișează aceasta';
$ec_lang['lpn_multi_title']='{n} selectate';
$ec_lang['lpn_multi_varies']='Diverse';
$ec_lang['lpn_multi_applied']='S-a setat {prop} pe {n}.';
$ec_lang['lpn_multi_no_fields']='Acestea nu au nimic ce poate fi setat împreună aici.';
$ec_lang['lpn_pane_pasted']='S-au lipit {n} celule. {skipped} nu au fost modificate.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='S-au lipit {n} rânduri și {created} dintre ele au fost adăugate în rețea.';
$ec_lang['lpn_pane_pasted_rows_skipped']='S-au lipit {n} rânduri și {created} dintre ele au fost adăugate în rețea. {skipped} celule nu au fost modificate.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Faceți clic aici și lipiți rânduri dintr-un tabel de calcul pentru a le adăuga.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Lipește ca rânduri noi la sfârșitul tabelului';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Apăsați Ctrl+V pentru a adăuga rândurile copiate la sfârșitul acestui tabel. Apăsați Esc pentru a anula.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Această lipire are {n} rânduri, iar {fit} dintre ele încap în tabel. Adăugați celelalte {extra} ca rânduri noi la sfârșit?';
$ec_lang['lpn_pane_paste_overflow_add']='Adaugă {extra} rânduri';
$ec_lang['lpn_pane_paste_overflow_fit']='Lipește doar cele {fit} care încap';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Această lipire are {n} rânduri, iar {fit} dintre ele încap în tabel. Celelalte {extra} nu pot fi adăugate ca rânduri noi: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} ID-uri nu se potrivesc. Lipiți oricum?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Nimic nu a fost lipit. {reasons}';
$ec_lang['lpn_pane_paste_more']='Rânduri cu probleme neafișate aici: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Rândul {row}: un rând nou are nevoie de un ID.';
$ec_lang['lpn_pane_paste_bad_id']='Rândul {row}: ID-ul {id} conține un spațiu sau un ghilimele.';
$ec_lang['lpn_pane_paste_id_taken']='Rândul {row}: ID-ul {id} este deja folosit.';
$ec_lang['lpn_pane_paste_id_twice']='Rândul {row}: ID-ul {id} este folosit de două ori în această lipire.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Rândul {row}: un nod nou are nevoie atât de {first} cât și de {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Rândul {row}: o legătură nouă are nevoie de un nod De la și un nod Către.';
$ec_lang['lpn_pane_paste_no_node']='Rândul {row}: nodul {id} nu există încă. Lipiți mai întâi nodurile, apoi legăturile.';
$ec_lang['lpn_pane_paste_same_ends']='Rândul {row}: De la și Către sunt același nod.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Rândul {row}: {text} nu este un {col} valid.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Rândul {row}: un Text nou are nevoie atât de {first} cât și de {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Rândul {row}: {id} nu este încă un nod sau o conductă în această rețea. Lipiți-l mai întâi, apoi acest Text.';
$ec_lang['lpn_pane_paste_customer_no_position']='Rândul {row}: un Abonat nou are nevoie atât de {first} cât și de {second}.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Rândul {row}: un Abonat nou are nevoie de o conductă sau un nod conectat.';
$ec_lang['lpn_pane_paste_no_pipe']='Rândul {row}: conducta {id} nu există încă. Lipiți mai întâi conductele, apoi abonații.';
$ec_lang['lpn_pane_paste_no_customer_node']='Rândul {row}: nodul {id} nu există încă. Lipiți mai întâi joncțiunile, apoi abonații.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Rândul {row}: nodul {id} nu are nicio conductă de care să se atașeze un Abonat.';


$ec_lang['lpn_pane_filled']='S-au completat în jos {n} celule. {skipped} nu au fost modificate.';
$ec_lang['lpn_pane_filldown']='Completează în jos';
$ec_lang['lpn_pane_fill_none']='Nimic din această selecție nu poate fi completat în jos.';
$ec_lang['lpn_pane_ctrlenter_filled']='S-au completat {n} celule. {skipped} nu au fost modificate.';
$ec_lang['lpn_pane_hide_col']='Ascunde această coloană';
$ec_lang['lpn_pane_hide_cols']='Ascunde aceste coloane';
$ec_lang['lpn_pane_show_all_cols']='Arată toate coloanele';
$ec_lang['lpn_pane_sort_asc']='Sortare crescătoare';
$ec_lang['lpn_pane_manage_cols']='Gestionare coloane…';
$ec_lang['lpn_pane_manage_cols_title']='Gestionare coloane';
$ec_lang['lpn_pane_manage_cols_show']='Arată';
$ec_lang['lpn_pane_manage_cols_up']='Mută în sus';
$ec_lang['lpn_pane_manage_cols_down']='Mută în jos';
$ec_lang['lpn_pane_manage_cols_top']='Mută la început';
$ec_lang['lpn_pane_manage_cols_bottom']='Mută la sfârșit';
$ec_lang['lpn_pane_colmenu_tip']='Ascunde sau gestionează coloane';
$ec_lang['lpn_tool_area_window']='Selectați o fereastră';
$ec_lang['lpn_tool_area_lasso']='Selectați un lasou';
$ec_lang['lpn_tool_area_polygon']='Selectați un poligon';
$ec_lang['lpn_tool_delete']='Ștergere';
$ec_lang['lpn_tool_zoom_extent']='Încadrează tot';
$ec_lang['lpn_tool_zoom_window']='Zoom fereastră';
$ec_lang['lpn_zoom_in']='Mărire';
$ec_lang['lpn_zoom_out']='Micșorare';
$ec_lang['lpn_new_text']='Text';
$ec_lang['lpn_field_text_bold']='Text îngroșat';
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
$ec_lang['lpn_field_text_anchor']='Atașat la';
$ec_lang['lpn_field_text_align']='Aliniere orizontală';
$ec_lang['lpn_field_text_align_left']='Stânga';
$ec_lang['lpn_field_text_align_center']='Centru';
$ec_lang['lpn_field_text_align_right']='Dreapta';
$ec_lang['lpn_field_text_valign']='Aliniere verticală';
$ec_lang['lpn_field_text_valign_top']='Sus';
$ec_lang['lpn_field_text_valign_middle']='Mijloc';
$ec_lang['lpn_field_text_valign_bottom']='Jos';
$ec_lang['lpn_field_text_rotation']='Unghi (grade)';
$ec_lang['lpn_field_text_match_pipe']='Rotiți la unghiul legăturii celei mai apropiate';
$ec_lang['lpn_field_text_flip']='Rotește 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Element atașat';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Acest text a fost plasat suficient de aproape de un element pentru a-l urma, deci se mișcă odată cu acel element și are o linie de indicație. Un text pe o linie de indicație își preia alinierea orizontală și verticală din partea pe care se află, motiv pentru care aceste două rânduri nu sunt oferite cât timp este atașat.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Coeficient emițător';
$ec_lang['lpn_field_emitter_tip']='Un debit suplimentar evacuat, care depinde de presiune, pentru un stropitor, o ieșire deschisă sau o pierdere modelată. Debitul eliberat este acest coeficient înmulțit cu presiunea ridicată la exponentul emițătorului, care se stabilește o singură dată pentru întreaga rețea la Setări, Calcul, Hidraulică. Lăsați necompletat la o joncțiune obișnuită.';
$ec_lang['lpn_field_elev']='Cotă';
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
$ec_lang['lpn_field_head']='Sarcină';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Nivelul suprafeței apei în rezervor, măsurat ca înălțime, nu ca presiune. Lăsați necompletat pentru a plasa suprafața apei la cota rezervorului.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='Cota fundului bazinului. Adâncimile apei din bazin se măsoară în sus de aici.';
$ec_lang['lpn_field_tank_level']='Adâncimea apei';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Adâncimea apei din bazin, măsurată în sus de la fundul bazinului.';
$ec_lang['lpn_field_tank_minlevel']='Adâncimea minimă a apei';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Adâncimea minimă admisă, măsurată în sus de la fundul bazinului.';
$ec_lang['lpn_field_tank_maxlevel']='Adâncimea maximă a apei';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Adâncimea maximă admisă, măsurată în sus de la fundul bazinului.';
$ec_lang['lpn_field_tank_diameter']='Diametrul bazinului';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Pentru un cilindru vertical. Aceleași unități ca la cotă, nu ca la diametrul conductei. Stabilește câtă apă reține o anumită adâncime.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Cota suprafeței apei din bazin: cota fundului bazinului plus adâncimea apei.';
$ec_lang['lpn_close']='Închidere';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Proprietăți';
$ec_lang['lpn_empty_hint']='Utilizați Fișier, Proiect nou pentru a deschide un exemplu. Sau începeți prin a adăuga un rezervor, o joncțiune și o conductă din bara de instrumente.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Rețeaua dvs. este intactă.';
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
$ec_lang['lpn_examples_welcome']='Bun venit la modelarea rețelelor de alimentare cu apă, cu rezolvitorul EPANET';
$ec_lang['lpn_examples_heading']='Deschideți propria copie a unui exemplu';
$ec_lang['lpn_examples_sub']='Fiecare se deschide ca o copie proprie. Modificați-o, salvați-o sau deschideți o copie nouă și începeți din nou.';
$ec_lang['lpn_examples_open']='Deschide';
$ec_lang['lpn_examples_menu']='Deschide exemplu…';
$ec_lang['lpn_examples_blank']='Sau începeți aici';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='Noduri: {nodes}, legături: {links}';
$ec_lang['lpn_examples_failed']='Exemplele nu au putut fi încărcate. Utilizați Fișier, Proiect nou pentru a începe un desen.';
$ec_lang['lpn_examples_loading']='Se încarcă exemplele…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Reparați ceva';
$ec_lang['lpn_help_notes']='Note despre această pagină';
$ec_lang['lpn_help_hotkeys']='Tabele și taste rapide';
$ec_lang['lpn_hotkeys_tables_heading']='Tabele';
$ec_lang['lpn_hotkeys_map_heading']='Hartă';
$ec_lang['lpn_hotkeys_map_term']='Comenzi rapide de la tastatură pentru hartă';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 sau Esc</td><td>Selectare.</td></tr><tr><td>2</td><td>Adaugă o joncțiune.</td></tr><tr><td>3</td><td>Adaugă un rezervor.</td></tr><tr><td>4</td><td>Adaugă un bazin.</td></tr><tr><td>5</td><td>Adaugă o conductă.</td></tr><tr><td>6</td><td>Adaugă o pompă.</td></tr><tr><td>7</td><td>Adaugă o vană.</td></tr><tr><td>8</td><td>Adaugă un abonat.</td></tr><tr><td>9</td><td>Adaugă text.</td></tr><tr><td>Delete</td><td>Șterge selecția.</td></tr><tr><td>Ctrl+Z</td><td>Anulează ultima modificare.</td></tr><tr><td>+ sau =</td><td>Mărire.</td></tr><tr><td>-</td><td>Micșorare.</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Ceva nu este în regulă aici?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='O singură apăsare ne spune că ceva nu este în regulă pe această pagină. Trimite numele acestei pagini, limba în care o citiți și mesajul de pe hartă, dacă există unul. Nu trimite nimic din ce ați scris, nicio adresă și nimic din desenul dvs. Nimeni nu vă poate răspunde, pentru că aceasta nu spune nimic despre cine sunteți. Folosiți Ajutor, Reparați ceva atunci când doriți să spuneți mai mult.';
$ec_lang['lpn_wrong_thanks']='Mulțumim. Ne-a ajuns.';
$ec_lang['lpn_status_example_opened']='{name} a fost deschis. Este copia dvs.: salvați-o cu Fișier, Salvează ca.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Această pagină nu a putut determina dimensiunea zonei de desenare, așa că harta arată ultima vizualizare pe care a putut să o calculeze. Redimensionarea ferestrei o face să încerce din nou. Dacă acest lucru continuă, o extensie de browser care blochează măsurătorile paginii este cauza obișnuită.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Rețea de bază, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Începeți de aici. Un rezervor, o pompă și un mic inel: cel mai mic aranjament care funcționează totuși ca o rețea de apă. Litri pe secundă, cu metri și milimetri.';
$ec_lang['lpn_ex_basic_us_title']='Rețea de bază, gpm (SUA)';
$ec_lang['lpn_ex_basic_us_desc']='Aceeași rețea de pornire, în galoane pe minut, cu picioare și inci.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 plus controale bazate pe reguli';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Cea mai mică dintre cele trei rețele de exemplu ale EPANET: un rezervor, o pompă și un singur inel.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Un sistem de distribuție ramificat cu un bazin, din exemplele EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Exemplul mare al EPANET: 92 de joncțiuni, 3 bazine și 2 rezervoare, unul dintre ele un râu. Merită deschis pentru a vedea cum arată pe hartă un model de dimensiune reală.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='Rețeaua EPANET Net3 convertită în latitudine/longitudine la Novato, CA, cu harta lumii desenată în spate.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Un amplasament comercial rezolvat pentru debitul de incendiu peste cerința zilei de vârf, la un moment dat, desenat peste un plan de amplasament.';
$ec_lang['lpn_tool_undo']='Anulare';
$ec_lang['lpn_confirm_example']='Aceasta adaugă exemplul la rețeaua pe care o aveți deja. Continuați?';
$ec_lang['lpn_field_diameter']='Diametru';
$ec_lang['lpn_demand_tip']='Debite preluate din rețea în acest nod. Introduceți un număr negativ pentru debitul introdus în rețea aici.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Această unitate decide ce înseamnă datele dvs. de intrare';
$ec_lang['lpn_units_warn_lead']='{unit} este unitatea pentru ce introduceți la:';
$ec_lang['lpn_units_options_head']='Când schimbați o unitate:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Nedistructiv';
$ec_lang['lpn_units_nondestructive_desc']='Nedistructiv: lasă fiecare valoare introdusă așa cum este și o reinterpretează în noua unitate.';
$ec_lang['lpn_units_destructive']='Distructiv';
$ec_lang['lpn_units_destructive_desc']='Distructiv: rescrie fiecare valoare introdusă printr-o conversie matematică, astfel încât rețeaua rămâne aproape aceeași fizic, în limitele de toleranță ale conversiei. Se pierd valorile inițiale introduse. Anularea (Undo) le readuce.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} valori înseamnă acum {unit}. Nimic nu a fost rescris.';
$ec_lang['lpn_status_converted']='{n} valori au fost rescrise în {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Lungime';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Coordonate pe hartă';
$ec_lang['lpn_units_mapcoords_deg']='grade';
$ec_lang['lpn_units_usft']='ft topografic SUA';
$ec_lang['lpn_units_elevhead']='Cotă și sarcină';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Gradient de pierdere de sarcină';
$ec_lang['lpn_result_gradient_tip']='Pierderea de sarcină împărțită la lungimea conductei. Folosiți-o pentru a compara conducte de lungimi diferite față de o singură limită de proiectare.';
$ec_lang['lpn_result_water_age']='Vechimea apei';
$ec_lang['lpn_result_water_age_tip']='Cât timp a stat în sistem apa care ajunge în acest punct. Unde se întâlnesc debite, apa sosită poartă un amestec de vârste, iar numărul de aici este media lor ponderată cu debitul: o joncțiune alimentată mai ales dintr-o magistrală scurtă și nouă arată o vârstă mică, chiar dacă o ramificație înfundată lungă o alimentează și ea. Într-un bazin este vârsta medie a apei reținute, motiv pentru care un bazin cu reînnoire lentă este de obicei apa cea mai veche dintr-o rețea. Nu există o limită de reglementare cu care să o comparați, așa că evaluați numărul în raport cu propria dvs. rețea.';
$ec_lang['lpn_result_source_share']='Pondere din sursă';
$ec_lang['lpn_result_source_share_tip']='Cât din apa care ajunge în acest punct provine din nodul de urmărire. Aceasta este ceea ce raportează analiza Urmărire sursă.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Vechimea medie a apei';
$ec_lang['lpn_result_avg_source_share']='Ponderea medie din sursă';
$ec_lang['lpn_result_avg_concentration']='Concentrația medie';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Factor de frecare';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Rata de reacție';
$ec_lang['lpn_result_status']='Stare';
$ec_lang['lpn_result_status_open']='Deschis';
$ec_lang['lpn_result_status_closed']='Închis';
$ec_lang['lpn_result_head']='Sarcină';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Energia apei în acest nod, exprimată ca înălțime a coloanei de apă. Este o înălțime absolută, în timp ce presiunea este o măsurătoare manometrică.';
$ec_lang['lpn_result_pressure']='Presiune';
$ec_lang['lpn_result_flow']='Debit';
$ec_lang['lpn_result_velocity']='Viteză';
$ec_lang['lpn_result_headloss']='Pierdere de sarcină';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Resetează doar setările acestui proiect. Desenul dvs. și celelalte proiecte nu sunt modificate. Pentru a salva setările preferate în vederea reutilizării, salvați un fișier proiect care conține numai setări.';
$ec_lang['lpn_reset_all_tip']='Șterge fiecare proiect, fiecare imagine de fundal, fiecare setare și alegerile dvs. de unități, apoi reîncarcă pagina exact așa cum o vede un vizitator nou. Aceasta este singura resetare care șterge totul.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Acest calculator stochează unitățile și valorile introduse ale proiectului așa cum au fost tastate, dar anterior converta numerele în SI pentru stocare. Acest proiect a fost salvat înainte de această schimbare, deci numerele sale sunt stocate în SI. Le convertim o ultimă dată la unitățile curente? Pentru a vă putea decide, iată câteva diametre care ar fi convertite, cu valorile lor înainte și după:';
$ec_lang['lpn_v2_restore_yes']='Conversie';
$ec_lang['lpn_v2_restore_never']='Nu. Nu mai întrebați niciodată.';
$ec_lang['lpn_v2_restore_no']='Închide, ca să verific mai întâi unitățile curente';
$ec_lang['lpn_storage_too_new']='Acest proiect a fost salvat de o versiune mai nouă a paginii, deci nu poate fi deschis aici.';
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
$ec_lang['lpn_tool_file']='Fișier';
$ec_lang['lpn_menu_edit']='Editare';
$ec_lang['lpn_menu_insert']='Inserare';
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
$ec_lang['lpn_menu_map']='Hartă';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Afișează harta stradală';
$ec_lang['lpn_basemap_satellite_show']='Afișează imagini din satelit';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='georeferențiat';
$ec_lang['lpn_xymap']='local';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Convertește ca…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Copie a {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Convertește ca';
$ec_lang['lpn_convas_coordsys_tip']='Sistemul de coordonate în care este convertită copia. Când diferă de cel al acestui proiect, urmează doi pași de amplasare. Un proiect care își cunoaște deja locul deschide ambii pași deja completați, astfel încât îi puteți accepta ca atare sau puteți face modificări.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Actual: {crs}';
$ec_lang['lpn_convas_epsg']='Sistem de coordonate EPSG';
$ec_lang['lpn_convas_epsg_tip']='Alegeți un sistem de coordonate din registrul EPSG. Latitudine și longitudine este WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Georeferențiere nedenumită (locală)';
$ec_lang['lpn_convas_unnamed_tip']='Coordonate locale în unitatea de lungime, cu harta lumii atașată.';
$ec_lang['lpn_convas_none_tip']='Coordonate locale în unitatea de lungime, fără hartă a lumii deocamdată.';
$ec_lang['lpn_convas_units_tip']='Unitățile în care este convertită copia. Originalul își păstrează propriile numere și unități.';
$ec_lang['lpn_convas_round']='Rotunjește valorile convertite';
$ec_lang['lpn_convas_round_tip']='Rotunjește doar numerele pe care le rescrie această conversie, la cel mai apropiat pas ales de dvs. Valorile a căror unitate nu se schimbă rămân neschimbate.';
$ec_lang['lpn_convas_round_none']='Fără rotunjire';
$ec_lang['lpn_convas_round_flow']='Cerință și debit';
$ec_lang['lpn_convas_label_col']='Sufix';
$ec_lang['lpn_convas_label_tip']='Text adăugat după această valoare pe etichetele hărții copiei, cum ar fi „ mm” sau „ gpm”. Precompletat din unitatea aleasă mai sus; ștergeți-l pentru niciun sufix.';
$ec_lang['lpn_convas_oneway']='Convertirea înapoi este o a doua conversie, nu o anulare. Un număr convertit și convertit înapoi poate să nu revină exact așa cum a fost tastat.';
$ec_lang['lpn_convas_ok']='Convertește';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} este unul dintre puținele sisteme de coordonate listate fără informații de proiecție utilizabile, deci nu poate fi folosit ca țintă sau sursă a conversiei. Nimic nu a fost convertit.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='Copia convertită este {name}. Proiectul original este neschimbat.';
$ec_lang['lpn_convas_cancelled']='Nimic nu a fost convertit. Copia este închisă, iar proiectul original este neschimbat.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Copiază acest proiect într-o filă nouă și convertește copia în sistemul de coordonate și unitățile alese de dvs. Când sistemul de coordonate se schimbă, un asistent vă ghidează mai întâi prin mărirea aproximativă a hărții din spatele rețelei, apoi prin scalarea și rotirea mai precisă a rețelei pe hartă. Acest proiect rămâne exact așa cum este. Pentru a georeferenția fără a converti nimic, folosiți în schimb Hartă, Harta lumii, Atașează.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Acest proiect este deja georeferențiat, deci rețeaua se află deja pe hartă și nimic nu a fost mutat. Verificați că se află în locul corect, apoi apăsați butonul Plasează modelul aici și butonul Păstrează acest amplasament.';
$ec_lang['lpn_georef_intro']='Plasarea modelului se face în doi pași. Pasul 1 este cel rapid: modelul stă pe loc iar dvs. deplasați harta din spatele lui, până când amplasamentul dvs. se află sub model la o dimensiune aproximativ potrivită. Nu există încă nicio rotație. Pasul 2 este cel precis: trageți, redimensionați și rotiți modelul propriu-zis. Proiectul dvs. se află la început pe o hartă a întregii lumi, deci găsiți întâi locația dvs., apoi apăsați butonul Plasează modelul aici.';
$ec_lang['lpn_georef_adjust']='Modelul este acum pe teren, deci se mișcă odată cu harta. Trageți modelul pentru a-l muta, trageți un colț pentru a-l redimensiona, trageți mânerul rotund de deasupra modelului pentru a-l roti. Sau introduceți mai jos distanța pe teren și unghiul de rotație.';
$ec_lang['lpn_georef_step1']='Pasul 1 din 2 — rapid';
$ec_lang['lpn_georef_step2']='Pasul 2 din 2 — precis';
$ec_lang['lpn_georef_step1_hint']='Proiectul dvs. rămâne unde este pe ecran. Deplasați și măriți harta de dedesubt până când terenul din spate este aproximativ în locul potrivit și la dimensiunea potrivită, apoi apăsați butonul Plasează modelul aici.';
$ec_lang['lpn_georef_detach']='Ridică-l din nou';
$ec_lang['lpn_georef_size_prompt']='Cam cât de lat este amplasamentul, pe întregul proiect?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} – {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Comandă rapidă: apăsați {key}.';
$ec_lang['lpn_tool_key_hint_two']='Comandă rapidă: apăsați {key} sau {key2}.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Faceți clic pe hartă conform instrucțiunilor pentru a selecta tot ce se află în interiorul formei. Apăsați din nou acest buton pentru a schimba forma între o fereastră, un lasou și un poligon. Țineți apăsat Shift în timp ce selectați pentru a continua cu selecția existentă, adăugând sau eliminând (comutare) ceea ce selectați.';
$ec_lang['lpn_area_selected']='{n} selectate.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='Nu s-a găsit nimic în acea zonă.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Adăugați și eliminați vârfurile care dau forma unei conducte pe hartă. Faceți clic pe o conductă pentru a adăuga un vârf, faceți clic pe un vârf pentru a-l elimina și trageți un vârf pentru a-l muta. Un vârf schimbă doar traseul desenat, nu hidraulica.';
$ec_lang['lpn_tool_undo_tip']='Anulează ultima modificare.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Încadrează întreaga rețea în fereastră.';
$ec_lang['lpn_tool_zoom_window_tip']='Faceți clic pe două colțuri opuse ale unui dreptunghi, sau trageți unul, pe hartă pentru a mări pe el. Apăsați din nou acest buton pentru Încadrează tot.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Mărire. Comandă rapidă: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Micșorare. Comandă rapidă: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Găsiți un element după ID-ul lui, sau găsiți fiecare element care îndeplinește o condiție, și schimbați-le pe toate deodată.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Legenda barei de instrumente';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Vizibilitate';
$ec_lang['lpn_color_legend_open_tip']='Faceți clic pentru a deschide panoul Vizibilitate și a modifica aceste culori.';
$ec_lang['lpn_color_node_field']='Colorează nodurile după';
$ec_lang['lpn_color_link_field']='Colorează conductele după';
$ec_lang['lpn_color_ramp_sequential']='Secvențială';
$ec_lang['lpn_color_ramp_diverging']='Divergentă';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Numărul de benzi';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Distribuția benzilor';
$ec_lang['lpn_color_ranges_note']='Limitele de mai jos sunt fixe odată stabilite; ele nu urmăresc rezultatele pe măsură ce acestea se schimbă. Alegerea unei metode de clasificare a datelor de mai sus stabilește limitele din starea actuală a sistemului. Dacă schimbați manual orice valoare, metoda de mai sus devine Manuală.';
$ec_lang['lpn_color_criterion_note']='Această metodă își ia limitele dintr-un standard de proiectare, deci numărul de culori este fix cât timp această metodă este selectată.';
$ec_lang['lpn_color_break_number']='O limită trebuie să fie un număr. Harta rămâne neschimbată.';
$ec_lang['lpn_color_break_order']='Fiecare limită trebuie să fie mai mare decât cea dinaintea ei. Harta rămâne neschimbată.';
$ec_lang['lpn_color_break_count']='Trebuie să existe o limită mai puțin decât numărul de culori. Harta rămâne neschimbată.';
$ec_lang['lpn_color_ramp_qualitative']='Calitativă';
$ec_lang['lpn_color_ramp_rainbow']='Curcubeu';
$ec_lang['lpn_color_ramp_rainbow_eg']='ca în EPANET';
$ec_lang['lpn_color_example_material']='Material';
$ec_lang['lpn_color_ramp_ylgnbu']='Galben spre albastru';
$ec_lang['lpn_color_ramp_rdylbu']='Roșu spre albastru, prin galben';
$ec_lang['lpn_georef_drop']='Plasează modelul aici';
$ec_lang['lpn_georef_finish']='Păstrează acest amplasament';
$ec_lang['lpn_georef_scale']='Distanța pe teren per unitate de desen';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Cât de departe ajunge pe teren o unitate din desenul dvs. Un desen realizat pe o grilă simplă de obicei nu spune nimic despre aceasta, deci stabiliți-o aici — sau lăsați Mergi la… să vă întrebe cât de lat este amplasamentul și să o calculeze.';
$ec_lang['lpn_georef_rotation']='Rotire în sens antiorar (grade)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Cât de mult să rotiți întregul model, în sens antiorar, astfel încât nordul lui să indice nordul.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Plasați modelul aici definitiv? Puteți încă trage elemente individuale ulterior, dar desenul încetează să mai fie un proiect xy. Pentru a reveni la xy, închideți acest proiect fără să îl salvați.';
$ec_lang['lpn_georef_done']='Acesta este acum un proiect lat/lon. Trageți orice element pentru a-l apropia de locul unde se află cu adevărat.';
$ec_lang['lpn_georef_backdrop_unrotated']='Imaginea de fundal a fost mutată și redimensionată odată cu modelul, dar nu a putut fi rotită. Folosiți Hartă, Imagine de fundal, Mutare pentru a o alinia.';
$ec_lang['lpn_georef_empty']='Acel fișier nu are nicio rețea în el, deci nu este nimic de plasat.';
$ec_lang['lpn_georef_unavailable']='Instrumentul de plasare nu s-a încărcat. Reîncărcați pagina și încercați din nou.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Terminați plasarea cu butonul „Păstrează această plasare” sau apăsați Anulare, înainte de a schimba proiectele. Plasarea aparține acestui proiect și nu vă poate urma către altul.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Finalizați plasarea cu butonul "Păstrează acest amplasament" sau apăsați Anulare, înainte de a salva. Proiectul este încă în curs de plasare, deci ceea ce este pe ecran nu este încă ceea ce s-ar scrie în fișier.';
$ec_lang['lpn_goto_menu']='Mergi la o latitudine și o longitudine…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='Latitudine și longitudine, în această ordine';
$ec_lang['lpn_goto_bad']='Aceasta nu este o latitudine și o longitudine. Încercați 38 -122, cu un spațiu între ele.';
$ec_lang['lpn_georef_goto']='Mergi la…';
$ec_lang['lpn_georef_twopt']='Folosește două puncte cunoscute';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Plasați modelul exact, atunci când știți deja unde se află cu adevărat două puncte de pe desenul dvs. Faceți clic pe unul dintre ele, introduceți latitudinea și longitudinea sa, apoi faceți la fel pentru un al doilea punct. Poziția, scara și rotația rezultă toate din aceste două puncte. Apăsați din nou acest buton pentru a opri selectarea.';
$ec_lang['lpn_georef_twopt_pick1']='Faceți clic pe un punct de pe desenul dvs. a cărui latitudine și longitudine le cunoașteți.';
$ec_lang['lpn_georef_twopt_pick2']='Acum faceți clic pe un al doilea punct cunoscut, cât mai departe posibil de primul.';
$ec_lang['lpn_georef_twopt_same']='Acesta este punctul pe care l-ați ales primul. Alegeți unul diferit.';
$ec_lang['lpn_georef_twopt_done']='Modelul este acum plasat pe cele două puncte pe care le-ați dat. Verificați-l, apoi apăsați butonul Păstrează acest amplasament.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Panou inferior';
$ec_lang['lpn_pane_toggle_tip']='Afișează sau ascunde panoul de sub hartă. Acesta conține profilul și un tabel pentru fiecare tip de element.';
$ec_lang['lpn_pane_resize']='Trageți pentru a face panoul mai înalt sau mai scund';
$ec_lang['lpn_pane_tab_junctions']='Joncțiuni';
$ec_lang['lpn_pane_tab_reservoirs']='Rezervoare';
$ec_lang['lpn_pane_tab_tanks']='Bazine';
$ec_lang['lpn_pane_tab_pipes']='Conducte';
$ec_lang['lpn_pane_tab_pumps']='Pompe';
$ec_lang['lpn_pane_tab_valves']='Vane';
$ec_lang['lpn_pane_tab_tip']='Acest tab arată elementele de acest tip ca un tabel pe care îl puteți sorta și edita. Coloanele de rezultate nu pot fi editate.';
$ec_lang['lpn_pane_none']='Această rețea nu are încă niciunul dintre acestea.';
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
$ec_lang['lpn_pane_text_attached']='Atașat';
$ec_lang['lpn_pane_not_used']='Nefolosit';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Filtrat după {q}. Se afișează {n} din {all}.';
$ec_lang['lpn_pane_filter_clear']='Afișează tot';
$ec_lang['lpn_pane_filter_stale']='Rânduri care nu se mai potrivesc: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Nimic din acest tabel nu corespunde filtrului.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Mărește și selectează';
$ec_lang['lpn_goto_on_map']='Arată pe hartă';
$ec_lang['lpn_pane_select_on_map']='Selectează pe hartă';
$ec_lang['lpn_pane_unselect_on_map']='Deselectează pe hartă';
$ec_lang['lpn_pane_print']='Tipărește tabelul';
$ec_lang['lpn_pane_print_tip']='Tipărește tabelul pe care îl vedeți, cu numele proiectului, numele tabelului și unitățile de măsură în antete. Rândurile se tipăresc în ordinea în care le-ați sortat.';

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
$ec_lang['lpn_menu_project']='Apă';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Tot ce ține de modelarea rețelei de apă se află aici, într-un singur loc, cu excepția comenzilor de redare a animației. Nu trebuie să ghiciți unde se află lucrurile.';
$ec_lang['lpn_tables_menu']='Tabele';
$ec_lang['lpn_tables_menu_tip']='Deschide, sub hartă, un panou cu un tabel al elementelor din această rețea. Există câte un tabel pentru fiecare tip de element, iar acolo îl puteți sorta și edita.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Recalculează acum această rețea. Căutați butonul Calculează? Este ascuns cât timp setarea Recalculează automat este activă. Pentru a readuce butonul, dezactivați Recalculează automat din Setări, Calcul, Hidraulică.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Recalculează automat';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Când este activ, acest proiect se recalculează la scurt timp după fiecare modificare pe care o faceți, iar butonul Calculează este scos din bara de instrumente deoarece nu mai are ce să facă. Dezactivați-l pe o rețea mare, unde așteptarea recalculării după fiecare modificare încurcă tastarea, iar butonul Calculează reapare pentru a alege dvs. când se rulează.';
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
$ec_lang['lpn_time_run_slow']='Calculul acestei rețele a durat {secs} s, iar rețeaua este setată să se recalculeze după fiecare modificare. Pentru a opri asta și a readuce butonul Calculează, dezactivați „Recalculează automat” din Setări, la Calcul, Hidraulică.';
$ec_lang['lpn_time_no_report']='Nu există încă un raport de rulare. Raportul este textul propriu al EPANET, deci apare doar după ce această rețea a fost calculată cu rezolvitorul EPANET.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Ajutor';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Galerie de capturi de ecran';
$ec_lang['lpn_help_walkthroughs']='Tutoriale';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Ștergere rețea';
$ec_lang['lpn_confirm_delete_network']='Ștergeți fiecare nod, conductă și etichetă text din acest proiect? Imaginea de fundal, numele proiectului și setările dvs. sunt păstrate. Această acțiune nu poate fi anulată.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Găsire și înlocuire';
$ec_lang['lpn_find_title']='Găsire și înlocuire';
$ec_lang['lpn_find_scope']='Ce se caută';
$ec_lang['lpn_find_scope_all']='Toate';
$ec_lang['lpn_find_property']='Proprietate';
$ec_lang['lpn_find_condition']='Condiție';
$ec_lang['lpn_find_value']='Valoare';
$ec_lang['lpn_find_btn']='Găsire';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Filtrează în tabelul curent';
$ec_lang['lpn_find_filter_tip']='Afișează doar părțile care corespund acestei interogări într-unul dintre tabelele de sub hartă. Desenul nu este modificat și nimic nu este șters.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} din {all}';
$ec_lang['lpn_find_filter_summary']='Filtrat după {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Această interogare nu se aplică niciunui tabel.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='conține';
$ec_lang['lpn_find_op_equals']='egal cu';
$ec_lang['lpn_find_op_gt']='mai mare decât';
$ec_lang['lpn_find_op_lt']='mai mic decât';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='gol';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} găsite. Faceți clic pe unul pentru a merge la el.';
$ec_lang['lpn_find_shift_hint']='Shift+clic pentru a comuta: adaugă dacă elementul nu este în selecție, sau elimină dacă este deja în selecție.';
$ec_lang['lpn_find_none']='Nimic nu s-a potrivit.';
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
$ec_lang['lpn_find_op_top']='cele mai mari {n}';
$ec_lang['lpn_find_op_bottom']='cele mai mici {n}';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Introduceți ce se caută.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Conectivitate';
$ec_lang['lpn_find_prop_demand_desc']='Descrierea acestei categorii de cerință';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='fără legături la nod';
$ec_lang['lpn_find_op_conn_noopen']='fără legături deschise la nod';
$ec_lang['lpn_find_op_conn_nolinksource']='fără traseu de legături către o sursă';
$ec_lang['lpn_find_op_conn_noopensource']='fără traseu deschis către o sursă';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Fiecare nod este conectat.';
$ec_lang['lpn_find_conn_no_fixed']='Această rețea nu are niciun rezervor sau bazin, deci nu există nicio sursă de atins. Se pot căuta doar fără legături la nod și fără legături deschise la nod.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Aceeași căutare, scrisă pe o singură linie. Modificarea comenzilor rescrie această linie, iar scrierea în această linie actualizează comenzile.';
$ec_lang['lpn_find_query_label']='Interogare';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Combinați condițiile cu ȘI, SAU și ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='ȘI';
$ec_lang['lpn_find_q_or']='SAU';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Comenzile nu pot exprima interogarea de mai jos, așa că sunt ascunse.';
$ec_lang['lpn_find_q_restore']='Folosește comenzile în schimb';
$ec_lang['lpn_replace_q_bad']='Această interogare nu poate fi înțeleasă, deci nu se poate schimba nimic. Corectați-o mai sus mai întâi.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(la caracterul {n})';
$ec_lang['lpn_find_q_err_empty']='Interogarea este goală, deci nu se va căuta nimic.';
$ec_lang['lpn_find_q_err_scope']='Nu există nimic numit {w} de căutat. Încercați una dintre: {list}';
$ec_lang['lpn_find_q_err_dot']='Puneți un punct între ce se caută și proprietatea sa, ca Junction.ID';
$ec_lang['lpn_find_q_err_prop']='Nu este o proprietate a {scope}: {w}. Încercați una dintre: {list}';
$ec_lang['lpn_find_q_err_op']='Nu este o condiție pentru {prop}: {w}. Încercați una dintre: {list}';
$ec_lang['lpn_find_q_err_value']='Această condiție are nevoie de o valoare după ea: {op}';
$ec_lang['lpn_find_q_err_quote']='Puneți ghilimele în jurul unei valori text: {w} nu este un număr.';
$ec_lang['lpn_find_q_err_quote_end']='Acest text între ghilimele nu are ghilimea de închidere.';
$ec_lang['lpn_find_q_err_close']='Această paranteză ( a fost deschisă și nu a fost niciodată închisă.';
$ec_lang['lpn_find_q_err_open']='Această paranteză ) nu închide nimic.';
$ec_lang['lpn_find_q_err_end']='Nu era așteptat nimic aici. Uniți două căutări cu {and} sau {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Modifică ce a fost găsit';
$ec_lang['lpn_replace_prop']='Proprietatea de modificat';
$ec_lang['lpn_replace_value']='Valoare nouă';
$ec_lang['lpn_replace_source']='Sursa valorii noi';
$ec_lang['lpn_replace_asked']='Cote solicitate pentru {n} noduri. Rezultatele sunt pe drum.';
$ec_lang['lpn_replace_btn']='Înlocuiește';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Modificați {n} elemente?';
$ec_lang['lpn_replace_apply']='Modifică-le';
$ec_lang['lpn_replace_done']='{n} elemente modificate. Puteți anula aceasta într-un singur pas.';
$ec_lang['lpn_replace_none']='Nimic nu s-ar schimba.';
$ec_lang['lpn_replace_no_value']='Introduceți valoarea nouă.';
$ec_lang['lpn_replace_scope']='Alegeți mai sus un tip de element pentru a-i modifica valorile.';
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
$ec_lang['lpn_profile_title']='Profil de-a lungul unui traseu';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Faceți clic pe nodul de unde începe traseul.';
$ec_lang['lpn_profile_draw_more']='Deplasați cursorul pe hartă pentru a vedea traseul. Faceți clic pe un nod pentru a-l adăuga. Dublu clic pentru a termina. Esc anulează.';
$ec_lang['lpn_profile_draw_blocked']='Nu există rută de la {a} la {b}. Alegeți alt nod.';
$ec_lang['lpn_profile_tap_start']='Atingeți nodul de unde începe traseul.';
$ec_lang['lpn_profile_tap_more']='Atingeți un nod pentru a vedea traseul. Apăsați și țineți pentru a-l adăuga. Atingeți de două ori pentru a termina. Apăsați din nou Profil pentru a anula.';
$ec_lang['lpn_profile_say_idle']='Apăsați din nou Profil pentru a alege un traseu nou pe hartă.';
$ec_lang['lpn_profile_none']='Niciun traseu încă. Apăsați din nou Profil pentru a alege unul pe hartă.';
$ec_lang['lpn_profile_choose']='Alegeți un nod de start și un nod de final.';
$ec_lang['lpn_profile_no_path']='Aceste două noduri nu sunt conectate prin nicio rută.';
$ec_lang['lpn_profile_no_solve']='Încă nu există rezultate, deci este desenată doar linia terenului.';
$ec_lang['lpn_profile_summary']='Noduri: {n}, lungime: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Distanța de-a lungul rutei ({u})';
$ec_lang['lpn_profile_axis_elev']='Cotă și sarcină ({u})';
$ec_lang['lpn_profile_ground']='Suprafața terenului';
$ec_lang['lpn_profile_hgl']='Linia piezometrică';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Editare';
$ec_lang['lpn_profile_edit_tip']='Schimbați un capăt al traseului, sau eliminați un nod de pe el, fără a-l desena din nou în întregime.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Trageți orice punct de pe traseu pentru a-l muta. Faceți clic pe un punct pe care l-ați adăugat pentru a-l elimina.';
$ec_lang['lpn_profile_edit_tap']='Trageți orice punct de pe traseu pentru a-l muta. Atingeți un punct pe care l-ați adăugat pentru a-l elimina.';
$ec_lang['lpn_profile_edit_nowhere']='Un punct de pe traseu trebuie să fie un nod. Traseul rămâne neschimbat.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Trasee salvate';
$ec_lang['lpn_profile_new']='Traseu nou…';
$ec_lang['lpn_profile_new_name']='Traseul {n}';
$ec_lang['lpn_profile_rename']='Redenumire traseu…';
$ec_lang['lpn_profile_delete']='Ștergere traseu';
$ec_lang['lpn_profile_prompt_name']='Nume pentru acest traseu';
$ec_lang['lpn_profile_delete_confirm']='Ștergeți traseul salvat {name}? Desenul propriu-zis nu este modificat.';
$ec_lang['lpn_profile_none_saved']='Niciun traseu salvat încă';
$ec_lang['lpn_profile_missing']='Traseul salvat {name} folosește noduri care nu se află în acest proiect: {ids}';
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
$ec_lang['lpn_ts_menu']='Serii de timp';
$ec_lang['lpn_ts_tip']='Reprezintă grafic unul sau mai multe elemente în funcție de timp, pe parcursul unei simulări pe perioadă extinsă.';
$ec_lang['lpn_ts_title']='Valori în funcție de timp';
$ec_lang['lpn_ts_group_nodes']='Noduri';
$ec_lang['lpn_ts_group_links']='Legături';
$ec_lang['lpn_ts_add']='Adaugă selecția';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Nimic de acest fel nu este ales pe hartă.';
$ec_lang['lpn_ts_clear']='Elimină tot';
$ec_lang['lpn_ts_chip_tip']='Scoate {id} de pe grafic';
$ec_lang['lpn_ts_none']='Încă nimic de reprezentat grafic. Selectați elemente pe hartă și apăsați Adaugă selecția.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Încă niciun rezultat pe perioadă extinsă. Apăsați Calculează pentru a rula simularea.';
$ec_lang['lpn_ts_summary']='Elemente: {n}, momente de raportare: {steps}';
$ec_lang['lpn_ts_axis_time']='Timp scurs';
$ec_lang['lpn_freq_menu']='Frecvență';
$ec_lang['lpn_freq_tip']='Reprezintă grafic distribuția de frecvență a unei proprietăți pentru toate joncțiunile sau toate conductele, la pasul de timp curent.';
$ec_lang['lpn_freq_title']='Distribuția valorilor';
$ec_lang['lpn_freq_none']='Încă niciun rezultat pentru această valoare, așa că nu este nimic de reprezentat grafic.';
$ec_lang['lpn_freq_summary']='Reprezentate: {n} din {total}';
$ec_lang['lpn_freq_summary_time']='Reprezentate: {n} din {total}, la {time}';
$ec_lang['lpn_freq_axis_percent']='Procent mai mic decât';
$ec_lang['lpn_view_units']='Unități';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Salvează tot';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Proiect{n}';
$ec_lang['lpn_project_copy_suffix']='(copie)';
$ec_lang['lpn_project_rename']='Redenumire';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Proiect nou…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Proiect nou';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Sistem de coordonate';
$ec_lang['lpn_new_coordsys_tip']='Selectați sistemul de coordonate al rețelei dvs. Aceasta este permanentă; singura modalitate de a converti o rețea la alte coordonate este cu „Fișier, Deschide la coordonate noi”, iar aceasta este aproximativă.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Local, schematic sau personalizat';
$ec_lang['lpn_new_coordsys_local_tip']='Fără georeferențiere. Atașați propria imagine de fundal sau niciuna.';
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
$ec_lang['lpn_crs_view']='Filtrează după vizualizarea hărții';
$ec_lang['lpn_crs_view_tip']='Oferă doar proiecțiile care acoperă locul spre care este orientată harta. Dezactivați pentru a citi lista completă.';
$ec_lang['lpn_crs_place']='Căutare după nume de loc';
$ec_lang['lpn_crs_place_tip']='Introduceți un oraș, o adresă sau un reper, iar vizualizarea hărții se mută acolo. Cuvintele pe care le introduceți sunt trimise serviciului de denumiri de locuri al OpenStreetMap, care vă cere permisiunea prima dată. Un proiect geografic nou pornește de asemenea din locul găsit aici.';
$ec_lang['lpn_crs_search']='Caută';
$ec_lang['lpn_crs_name']='Filtru după numele proiecției';
$ec_lang['lpn_crs_name_tip']='Arată doar proiecțiile al căror nume sau cod EPSG conține ceea ce introduceți. Încercați un număr de zonă, sau UTM, sau Mercator.';
$ec_lang['lpn_crs_list_tip']='Proiecțiile rămase după cele două filtre de mai sus. Alegeți una și apăsați Selectează.';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Niciun loc nu a fost căutat încă, deci este oferită lista completă. Căutați un loc mai sus sau măriți harta pentru a o restrânge.';
$ec_lang['lpn_crs_count']='{n} din {total} proiecții listate.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} din {total} sisteme de coordonate acoperă această rețea.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(fără hartă)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} este unul dintre puținele sisteme de coordonate listate fără informații de proiecție utilizabile. Aceasta înseamnă că harta lumii, căutarea după nume de loc și cotele DEM nu funcționează. Coordonatele dvs. nu sunt afectate.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='nedenumit';
$ec_lang['lpn_crs_none']='Fără georeferențiere';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Un proiect își păstrează propriile unități, deci această alegere aparține doar acestui proiect și nimic de aici nu este salvat ca setare a browserului. Pentru a începe proiecte noi într-un anumit fel, salvați un proiect gol ca șablon și faceți o copie a lui de fiecare dată.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Sibiu, România';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Creează';
$ec_lang['lpn_file_open']='Deschidere…';
$ec_lang['lpn_file_save']='Salvare';
$ec_lang['lpn_file_saveas']='Salvare ca…';
$ec_lang['lpn_file_revert']='Revenire';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Fișiere recente';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='Nu a fost acordată permisiunea de a deschide acel fișier, deci nu a fost deschis.';
$ec_lang['lpn_recent_gone']='Nu s-a putut deschide {file}. Este posibil să fi fost mutat, redenumit sau șters, deci a fost scos din lista recentă.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Proiect nou';
$ec_lang['lpn_tab_all']='Toate proiectele';
$ec_lang['lpn_tab_menu']='Meniu proiect';
$ec_lang['lpn_tab_duplicate']='Duplicare';
$ec_lang['lpn_tab_move_left']='Mutare la stânga';
$ec_lang['lpn_tab_move_right']='Mutare la dreapta';
$ec_lang['lpn_tab_unsaved']='Nesalvat într-un fișier';
$ec_lang['lpn_import_bad_file']='Acel fișier nu a putut fi citit ca proiect salvat de pe această pagină.';
$ec_lang['lpn_import_no_room']='Nu mai există suficient spațiu de stocare în browser pentru a adăuga acest proiect. Ștergeți un proiect de care nu mai aveți nevoie și încercați din nou.';
$ec_lang['lpn_file_import_menu']='Importare…';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='OK';
$ec_lang['lpn_file_import_inp']='Import fișier EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Citește o rețea dintr-un fișier EPANET, fie fișierul text .inp, fie fișierul .net pe care îl salvează EPANET, și o salvează în acest browser ca un proiect nou.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='Export fișier EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Scrie această rețea ca fișier EPANET .inp și îl descarcă. Numerele pe care le-ați introdus sunt scrise exact așa cum le-ați scris. Tot ce formatul .inp nu poate păstra este listat pentru dvs. după aceea.';
$ec_lang['lpn_status_inp_exported']='{file} a fost exportat.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} lucruri pe care formatul .inp nu le poate păstra.';
$ec_lang['lpn_inp_export_refused']='Acest proiect nu poate fi scris ca fișier EPANET: {detail}';
$ec_lang['lpn_inp_bad_file']='Acel fișier nu a putut fi citit ca fișier de rețea EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Acesta pare a fi un fișier .net EPANET, dar această pagină nu l-a putut citi. Deschideți-l în EPANET și folosiți acolo comanda Fișier, Export, Rețea pentru a-l salva ca fișier .inp, apoi importați acel fișier.';
$ec_lang['lpn_inp_report_heading']='S-a importat {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} joncțiuni, rezervoare și bazine, {links} conducte, pompe și vane, în {units}.';
$ec_lang['lpn_inp_report_clean']='Totul din fișier a fost preluat. Nimic nu a fost omis.';
$ec_lang['lpn_inp_report_label_anchor']='Etichetele de text sunt plasate așa cum le plasează EPANET, din colțul lor stânga sus.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='Fișierele EPANET nu conțin niciun sistem de coordonate, deci acest fișier nu va fi georeferențiat inițial. Pentru a-l plasa pe o hartă a lumii, folosiți Hartă, Harta lumii… Pentru a converti coordonatele sale, folosiți Fișier, Convertește ca…';
$ec_lang['lpn_inp_report_lead']='Această pagină nu folosește tot ce folosește EPANET, dar nimic din fișierul dvs. nu este aruncat. Mai jos este ce conține fișierul dvs. și este păstrat fără a fi folosit, și ce a fost schimbat la citirea fișierului:';
$ec_lang['lpn_inp_drop_headloss']='Acest fișier nu folosește formula Hazen-Williams. Această pagină calculează cu Hazen-Williams, deci numerele de rugozitate ale conductelor au fost păstrate exact așa cum au fost scrise, dar rezultatele de aici nu vor coincide cu cele din EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Aceste bazine nu au pereți drepți: fișierul dă forma lor ca o curbă. Curba este păstrată în caseta Biblioteci, bazinul continuă să o indice, iar o simulare pe o perioadă extinsă umple și golește bazinul după programul dat de acea curbă. Un singur moment este identic în ambele cazuri, deoarece suprafața apei este nivelul stabilit de fișier. Diametrul scris în fișier este păstrat alături de curbă și este cel cu care este desenat și rezolvat un bazin fără curbă.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Aceste vane de reglare au fost importate ca vane de reglare, păstrând pierderea pe care le-o dă fișierul. Oricare dintre cei doi rezolvitori le poate calcula.';
$ec_lang['lpn_inp_drop_valve_active']='Aceste vane controlează presiunea sau debitul și se deschid și se închid singure pe măsură ce apa se schimbă. Nimic din ele nu s-a pierdut la import, iar această pagină le rezolvă cu rezolvitorul EPANET, activând singură acel rezolvitor pentru această rețea.';
$ec_lang['lpn_inp_drop_valve']='Aceste vane sunt descrise printr-o curbă sau printr-o cădere de presiune fixă, iar această pagină nu are un astfel de element. Au intrat ca și conducte deschise, deci rețeaua este încă legată, dar nimic nu mai controlează presiunea sau debitul acolo.';
$ec_lang['lpn_inp_drop_cv']='În EPANET aceste conducte lasă apa să treacă într-un singur sens. Au fost importate ca și conducte obișnuite, deci apa poate curge acum în ambele sensuri prin ele.';
$ec_lang['lpn_inp_drop_demands']='Aceste joncțiuni aveau mai mult de o cerință. Cerințele au fost însumate într-o singură cerință, pe care o păstrează această pagină.';
$ec_lang['lpn_inp_drop_patterns']='Această pagină nu a citit modelele de cerință, deoarece partea ei care rulează o simulare pe o perioadă extinsă nu s-a încărcat. Fiecare cerință este numărul scris în fișier.';
$ec_lang['lpn_inp_drop_demand_pattern']='Aceste joncțiuni își schimbă cerința pe parcursul rulării. Modelele lor au fost importate integral, iar cerința afișată este cea pentru momentul indicat de ceas.';
$ec_lang['lpn_inp_drop_emitters']='Aceste joncțiuni au un coeficient de aspersor sau scurgere. A fost păstrat și este luat în calcul, dar deocamdată nu există un loc pe această pagină unde să îl vedeți sau să îl modificați.';
$ec_lang['lpn_inp_drop_curve_long']='Această curbă de pompă avea mai mult de trei puncte. Au fost păstrate punctul cel mai jos, punctul din mijloc și punctul cel mai înalt, deoarece această pagină ajustează o curbă la cel mult trei puncte.';
$ec_lang['lpn_inp_drop_curve_missing']='Această pompă indică o curbă care nu se află în fișier. Pompa a fost importată fără curbă, deci nu adaugă nicio sarcină.';
$ec_lang['lpn_inp_drop_pump_other']='Această pompă este descrisă prin puterea pe care o consumă, nu printr-o curbă. A intrat fără nicio curbă, deci nu adaugă nicio sarcină.';
$ec_lang['lpn_inp_drop_head_pattern']='Aceste rezervoare urcă și coboară pe parcursul rulării. Modelele lor au fost importate integral, iar nivelul de apă afișat este cel pentru momentul indicat de ceas.';
$ec_lang['lpn_inp_drop_pump_speed']='Aceste pompe funcționează la o turație diferită de cea la care a fost măsurată curba lor, sau își schimbă turația pe parcursul rulării. Turația și modelul ei au fost importate integral, iar sarcina afișată este cea pentru momentul indicat de ceas.';
$ec_lang['lpn_inp_drop_setting']='Aceste conducte, pompe și vane au o setare pe care această pagină nu o poate păstra. Au fost importate deschise.';
$ec_lang['lpn_inp_drop_rules']='Acest fișier conține comenzi bazate pe reguli. Această pagină le citește și le folosește. Rulați modelul cu motorul EPANET și regulile sunt aplicate, fiecare nivel, presiune și debit din ele fiind convertite în unitățile pe care le arată acest proiect. Deschideți Reguli la Biblioteci pentru a citi sau modifica una. Sunt păstrate exact așa cum le precizează fișierul și sunt scrise înapoi dacă salvați un fișier EPANET.';
$ec_lang['lpn_inp_drop_eps']='Acest fișier descrie o simulare pe o perioadă extinsă. Partea acestei pagini care rulează o simulare pe o perioadă extinsă nu s-a încărcat, deci au fost importate doar condițiile inițiale.';
$ec_lang['lpn_inp_drop_quality']='Acest fișier descrie cum se schimbă calitatea apei pe măsură ce călătorește: ce se află inițial în apă și cât de repede reacționează acea substanță în conducte și în bazine. Această pagină citește aceste numere și le folosește. Alegeți o substanță chimică la Setări, Calcul, Calitatea apei, apoi rulați modelul cu motorul EPANET, iar concentrația este calculată de-a lungul rețelei pe măsură ce rularea avansează. Liniile sunt păstrate și sunt scrise înapoi dacă salvați un fișier EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='Acest fișier spune unde este dozată o substanță chimică în rețea și cum se amestecă apa dintr-un bazin. O doză apare la nodul unde este adăugată, iar un bazin indică ce model de amestecare urmează. Atât doza, cât și modelul de amestecare sunt calculate doar de motorul EPANET.';
$ec_lang['lpn_inp_drop_energy']='Acest fișier EPANET include date de modelare a costului pompării. Această pagină le citește și le folosește. Rulați modelul cu motorul EPANET, apoi deschideți Apă, Rapoarte, Energie pompe pentru a vedea cât a funcționat fiecare pompă, ce putere a consumat, ce energie a folosit și cât a costat. Liniile sunt păstrate și sunt scrise înapoi dacă salvați un fișier EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Acest fișier atribuie etichete unora dintre joncțiunile, conductele sau alte elemente ale sale. Fiecare etichetă a fost importată integral și se află în proprietățile propriului element, unde o puteți citi sau modifica.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Acest fișier conține propriile setări ale EPANET pentru formatul raportului pe care îl tipărește. Puteți citi raportul motorului aici, la Rapoarte, Rulare EPANET, dar acesta apare în formatul standard al motorului, nu în cel cerut de aceste setări. Liniile sunt păstrate și sunt scrise înapoi dacă salvați un fișier EPANET.';
$ec_lang['lpn_inp_drop_sections']='Acest fișier conține o secțiune pe care această pagină nu o citește deloc. Nimic aici nu o folosește. Este păstrată în întregime și este scrisă înapoi dacă salvați un fișier EPANET.';
$ec_lang['lpn_inp_drop_quality_options']='Acest fișier precizează opțiunile EPANET pentru calitatea apei: opțiunea Quality, care numește tipul de analiză a calității apei, și două setări legate de o substanță chimică, Relative diffusivity și Quality tolerance. Toate trei sunt păstrate și toate trei sunt folosite. Vechimea apei, urmărirea sursei și o substanță chimică sunt fiecare calculate aici, iar cele două setări chimice sunt transmise motorului EPANET când rulați o substanță chimică. Toate sunt scrise înapoi dacă salvați un fișier EPANET.';
$ec_lang['lpn_inp_drop_file_options']='Acest fișier face trimitere la un fișier auxiliar: Map, care conține coordonate, sau Hydraulics, care conține hidraulica deja calculată. Această pagină nu poate deschide niciunul dintre ele, deci liniile sunt păstrate așa cum sunt și scrise înapoi dacă salvați un fișier EPANET.';
$ec_lang['lpn_inp_drop_demand_model']='Acest fișier cere o analiză dependentă de presiune (PDA), în care o joncțiune primește mai puțin decât cerința ei atunci când presiunea acolo este scăzută. Această pagină rezolvă cu cerință impusă, astfel încât fiecare joncțiune de aici primește cerința declarată în fișier, indiferent ce presiune rezultă. Linia este păstrată și este scrisă înapoi dacă salvați un fișier EPANET.';
$ec_lang['lpn_inp_drop_other_options']='Acest fișier stabilește opțiuni pe care această pagină nu le citește. Nimic aici nu le folosește. Ele sunt păstrate și sunt scrise înapoi dacă salvați un fișier EPANET.';
$ec_lang['lpn_inp_drop_net_options']='Acest fișier .net EPANET precizează setări pentru care această pagină nu are niciun control, deci valorile lor sunt listate aici, în loc să fie preluate. Tot restul a fost preluat. Dacă aveți nevoie de ele, deschideți fișierul în EPANET și folosiți Fișier, Export, Rețea pentru a-l salva ca fișier .inp, apoi importați-l pe acela.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Acesta a fost un fișier .net EPANET. Acela este propriul fișier de proiect al EPANET, nu are o descriere publicată, iar această pagină îl citește deducând formatul din fișiere exemplu, deci folosiți-l doar atunci când nu aveți altă opțiune, nu ca o cale sigură. Fișierul .inp este formatul documentat pe care îl citește orice alt program: în EPANET folosiți Fișier, Export, Rețea pentru a scrie unul, și importați-l pe acela ori de câte ori puteți.';
$ec_lang['lpn_inp_drop_backdrop']='Acest fișier indică o imagine de fundal, dar nu conține imaginea propriu-zisă. Adăugați-o dvs. cu Fișier, Imagine de fundal, Adaugă imagine.';
$ec_lang['lpn_inp_drop_dangling']='Aceste conducte indică o joncțiune care nu se află în fișier, deci au fost omise.';
$ec_lang['lpn_inp_drop_units']='Unitatea de debit numită în acest fișier nu este cunoscută de această pagină, deci fiecare număr a fost citit ca galoane pe minut. Verificați fiecare număr înainte de a folosi rezultatele.';
$ec_lang['lpn_inp_drop_anchor_missing']='Acest text era atașat unei joncțiuni, unui rezervor sau unui bazin care nu se află în fișier. A fost importat ca text liber, în locul indicat de fișier, și nu mai urmărește nimic.';
$ec_lang['lpn_import_notes_heading']='Acest proiect a fost citit dintr-un fișier EPANET. O parte din ce conține acel fișier este păstrată, dar nu este folosită pe această pagină.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='S-a deschis {name} dintr-un fișier și a fost adăugat în acest browser ca proiect nou.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Fișier proiect';
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
$ec_lang['lpn_file_upload_explain']='Acest browser nu se poate conecta la un fișier, deci deschiderea unui fișier aici este de fapt o încărcare: proiectul este copiat în acest browser, iar singurul mod de a salva munca înapoi în fișier este să suprascrieți fișierul cu Fișier, Salvare ca.';
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
$ec_lang['lpn_file_saveas_tip_download']='Salvează folosind setările de Descărcare ale browserului dvs. Acest browser nu se poate conecta la un fișier, deci Salvare este dezactivată și este disponibilă doar Salvare ca. Dacă activați setarea browserului \'Întreabă unde să salvezi fiecare fișier\', puteți alege fișierul original și îl puteți suprascrie.';
$ec_lang['lpn_status_uploaded']='Fișierul proiect a fost încărcat. Nu se poate menține nicio conexiune la el, deci singurul mod de a salva înapoi în el este folosind Fișier, Salvare ca.';
$ec_lang['lpn_status_downloaded']='S-a descărcat {file}. Acest browser nu se poate conecta la un fișier, deci acest proiect rămâne marcat ca nesalvat într-un fișier.';
$ec_lang['lpn_status_file_opened']='S-a deschis {file}.';
$ec_lang['lpn_status_already_open']='Acel fișier este deja deschis aici ca {name}, deci s-a comutat la el în loc să se deschidă o a doua copie.';
$ec_lang['lpn_status_already_open_dirty']='Acel fișier este deja deschis aici ca {name}, cu modificări pe care nu le-ați salvat în el. S-a comutat la el în loc să se deschidă o a doua copie. Folosiți Fișier, Revenire dacă doriți în schimb versiunea de pe disc.';
$ec_lang['lpn_status_saved']='S-a salvat {file}.';
$ec_lang['lpn_status_reverted']='S-a încărcat din nou {file} de pe disc.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Salvați modificările din {name} înainte de a-l închide?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} este păstrat doar în acest browser. Dacă îl închideți fără să îl salvați într-un fișier, se pierde definitiv.';
$ec_lang['lpn_close_discard']='Închide fără să salvezi';
$ec_lang['lpn_cancel']='Anulare';
$ec_lang['lpn_revert_confirm']='Renunțați la modificările făcute și încărcați din nou {file} de pe disc?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Acest proiect provine din {file}, dar conexiunea la acel fișier s-a pierdut. Alegeți din nou fișierul pentru a vă conecta la el.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Nu s-a putut scrie în fișier. Este posibil să fi fost mutat sau redenumit, sau permisiunea să fi fost retrasă. Munca dvs. este în continuare salvată în acest browser.';
$ec_lang['lpn_file_changed_elsewhere']='Altcineva a salvat în acest fișier de când l-ați deschis, deci salvarea acum ar suprascrie munca lor. Folosiți Fișier, Salvare ca pentru a vă păstra modificările într-un fișier propriu, sau Fișier, Revenire pentru a renunța la ale dvs. și a le încărca pe ale lor.';
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
$ec_lang['lpn_lock_somebody']='Altcineva';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} are acest fișier deschis.';
$ec_lang['lpn_lock_open_readonly']='Deschide doar-citire';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Anulează blocarea lor';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Acest fișier pare să fie în uz.';
$ec_lang['lpn_lock_open_care']='Pentru a evita pierderea datelor, alegeți cu atenție dintre opțiunile de mai jos.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='Este în uz de {x}.';
$ec_lang['lpn_lock_age_edited']='A fost editat ultima dată acum {x}.';
$ec_lang['lpn_lock_age_saved']='A fost salvat ultima dată acum {x}.';
$ec_lang['lpn_lock_age_never_saved']='Încă nu a fost salvat nimic în acest fișier.';
$ec_lang['lpn_lock_age_unknown']='Nu există nicio evidență a duratei de utilizare, sau a momentului ultimei salvări ori editări.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='„Întreabă” anunță pe oricine are acest fișier deschis că doriți să îl folosiți, și nu schimbă nimic altceva. „Deschide doar-citire” vă permite să îl vedeți și să modificați orice doriți, fără a putea salva aici. „Anulează blocarea lor” vă permite să salvați peste fișier; munca lor nesalvată nu se pierde, dar nu vor mai putea să o salveze aici, iar cineva ar putea trebui să combine manual cele două.';
$ec_lang['lpn_lock_ask']='Întreabă';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Cine să spunem că întreabă? Inițialele dvs. sunt ideale. Sunt păstrate împreună cu blocarea acestui fișier pe serverul nostru, pentru oricine îl are deschis, și sunt șterse în cel mult 30 de zile.';
$ec_lang['lpn_lock_ask_sent']='Am cerut oricui are acest fișier deschis să îl închidă. Va vedea cererea în decurs de un minut, dacă pagina lui este încă deschisă. Nimic altceva nu s-a schimbat, iar fișierul este încă al lui până când îl închide.';
$ec_lang['lpn_lock_ask_failed']='Mesajul dvs. nu a putut fi livrat. Fie nimeni nu are acest fișier deschis acum, fie serverul nu a putut fi contactat.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Acel fișier nu a fost deschis, iar nimic de aici nu s-a schimbat. Altcineva îl are încă deschis.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} ar dori să editeze acest fișier. Când sunteți gata, salvați-vă munca și folosiți Fișier, Închidere pentru a-l preda.';
$ec_lang['lpn_ago_seconds']='{n} secunde';
$ec_lang['lpn_ago_minutes']='{n} minute';
$ec_lang['lpn_ago_hours']='{n} ore';
$ec_lang['lpn_ago_days']='{n} zile';
$ec_lang['lpn_ago_unknown']='un timp necunoscut';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Mesaje';
$ec_lang['lpn_msglog_heading']='Mesaje recente';
$ec_lang['lpn_msglog_empty']='Încă niciun mesaj.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='acum {x}';
$ec_lang['lpn_msglog_note']='Cele mai noi primele. Această pagină păstrează ultimele {n} mesaje cât timp este deschisă, și nimic nu este stocat pe computerul dvs.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Doar-citire: {name} are acest fișier deschis. Puteți modifica orice doriți aici, dar nu puteți salva. Folosiți Fișier, Salvare ca pentru a salva într-un alt fișier.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Atenție: nu s-a putut contacta serverul pentru a verifica sau crea o blocare pe acest proiect, deci nimic nu împiedică un coleg să editeze același fișier în același timp. Veți fi anunțat dacă blocarea începe din nou să funcționeze.';
$ec_lang['lpn_lock_storage_error']='Atenție: acest site nu poate salva înregistrările de blocare, deci nimic nu împiedică un coleg să editeze același fișier în același timp. Aceasta este o eroare de configurare pe server, nu ceva ce puteți remedia aici — folderul de blocare nu poate fi scris de serverul web.';
$ec_lang['lpn_lock_full_error']='Atenție: acest site a rămas fără spațiu pentru a înregistra cine are ce proiect deschis, deci nimic nu împiedică un coleg să editeze același fișier în același timp. Aceasta este o eroare de configurare pe server, nu ceva ce puteți remedia aici.';
$ec_lang['lpn_lock_not_asked']='Blocarea nu funcționează pentru acest proiect, deci nimic nu împiedică un coleg să editeze același fișier în același timp. Acest proiect nu are încă niciun identificator, iar salvarea lui într-un fișier îi atribuie unul.';
$ec_lang['lpn_lock_restored']='Blocarea funcționează din nou, iar acest fișier este acum al dvs. pentru a salva în el.';
$ec_lang['lpn_lock_dismiss']='Ascunde acest mesaj';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Proiectul dvs. va fi salvat într-un fișier pe acest calculator. Este salvat atunci când solicitați, și în niciun alt moment, deci nimic nu este scris în acel fișier fără știrea dvs.';
$ec_lang['lpn_file_training_2']='Pentru ca două persoane să nu editeze niciodată un fișier în același timp, acest site urmărește cine îl are deschis. Dacă cineva îl are deja deschis, îl puteți totuși deschide și vizualiza, sau puteți păstra propria dvs. copie.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='Prima dată când salvați, browserul dvs. vă va întreba dacă acest site poate edita fișierul. Această întrebare vine de la browser, nu de la noi, iar răspunsul afirmativ este ceea ce permite funcției Salvare să scrie munca dvs. înapoi. De obicei este întrebată o singură dată per fișier.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Continuare';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Alegeți din nou fișierul';
$ec_lang['lpn_file_reconnect']='Reconectare la acest fișier';
$ec_lang['lpn_file_reconnect_alert']='Acest proiect provine din {file}. Browserul dvs. are nevoie din nou de permisiunea dvs. înainte de a putea scrie în el. Reconectați-vă mai jos.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Acesta este același fișier pe care îl are deschis altcineva, deci nu poate fi suprascris. Alegeți un alt fișier sau un alt nume.';
$ec_lang['lpn_saveas_overwrites_project']='Acel fișier conține deja un alt proiect, {name}. Salvarea aici îl înlocuiește complet. Continuați?';
$ec_lang['lpn_saveas_overwrites_newer']='Acel fișier s-a schimbat de când l-ați văzut ultima dată, deci aproape sigur altcineva a salvat în el. Salvarea aici înlocuiește versiunea lor cu a dvs. Continuați?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Nume pentru acest proiect';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='S-a închis {closed}. Se afișează acum {opened}.';
$ec_lang['lpn_status_closed_empty']='S-a închis {closed}. S-a pornit un proiect nou, gol.';
$ec_lang['lpn_storage_full']='Nu s-a salvat. Spațiul de stocare al browserului este plin sau indisponibil, deci modificările dvs. recente se vor pierde la închiderea acestei file.';
$ec_lang['lpn_storage_unreadable']='Nu s-a salvat. Acest proiect nu a putut fi citit din stocarea browserului. Copia stocată este lăsată exact așa cum este și nu va fi suprascrisă, deci nimic din acest tab nu este salvat. Deschideți un fișier sau creați un proiect nou pentru a continua lucrul.';
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
$ec_lang['lpn_about_credits']='Mulțumiri';
$ec_lang['lpn_help_welcome']='Pagina de bun venit';
$ec_lang['lpn_about_license']='Licențiat sub GNU General Public License v3.0 sau o versiune ulterioară.';
$ec_lang['lpn_notes_1_term']='Cum se rezolvă';
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
$ec_lang['lpn_notes_1_def']='Rezolvitorul EPANET rezolvă această rețea. Stabiliți o durată totală de rulare, iar fiecare pas de raportare este calculat pe rând: bazinele se umplu și se golesc, cerințele urmează modelele lor, iar bara de instrumente redă rularea.';
$ec_lang['lpn_notes_2_term']='Ce nu face';
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
$ec_lang['lpn_notes_2_def']='Calitatea apei este modelată: vechimea apei, urmărirea sursei și o substanță chimică ce reacționează pe pereții conductei și în masa apei. Șocurile de presiune și lovitura de berbec nu sunt modelate: fiecare rezultat de aici este valabil pentru apă care curge deja constant, nu pentru unda de presiune produsă când o vană se închide brusc.';
$ec_lang['lpn_notes_3_term']='Salvarea proiectelor';
$ec_lang['lpn_notes_3_def']='Fiecare proiect este o filă, iar fiecare filă este salvată în acest browser pe măsură ce lucrați. Ștergerea datelor browserului le șterge pe toate, deci păstrați-vă munca într-un fișier: Fișier, Salvare ca. Un asterisc pe o filă înseamnă că aceasta conține modificări care nu se află într-un fișier. Nimic nu este scris vreodată într-un fișier decât dacă solicitați. În unele browsere un proiect se conectează la fișierul în care îl salvați, iar Fișier, Salvare scrie de atunci încolo în același fișier; în altele nicio conexiune nu este posibilă, deci Salvare este dezactivată și este disponibilă doar Salvare ca. Atunci când un fișier proiect este păstrat pe o unitate partajată, această pagină vă spune dacă un coleg îl are deja deschis, astfel încât două persoane să nu scrie una peste alta.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Curba pompei';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='O pompă respectă H = H₀ − aQ^b, unde H este sarcina adăugată de pompă, iar Q este debitul care trece prin ea. Introduceți unul, două sau trei puncte de pe curba producătorului. Trei puncte, sarcina la debit zero, punctul normal de funcționare și punctul de debit maxim, determină direct H₀, a și b, și urmăresc cel mai fidel o curbă publicată. Două puncte ajustează o parabolă (b = 2) cu vârful la debit zero. Un singur punct folosește o regulă uzuală: sarcina la debit zero este 1,33 × sarcina introdusă, iar debitul maxim este 2 × debitul introdus, ceea ce dă tot b = 2. O pompă fără niciun punct introdus nu adaugă nicio sarcină. Curba nu este întreruptă acolo unde sarcina ajunge la zero, deci a cere unei pompe mai mult debit decât poate oferi curba sa dă o sarcină negativă. Soluția este o pompă mai mare sau o cerință mai mică, nu o altă ajustare a curbei. O curbă poate avea mai mult de trei puncte, iar fiecare punct introdus este citit.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='De asemenea, pe această pagină';
$ec_lang['lpn_notes_4_def']='Un proiect poate fi așezat pe teren real, cu o hartă stradală în spatele lui. Fișierele EPANET .inp pot fi citite și scrise. Panoul de jos desenează un profil de-a lungul unui traseu și listează joncțiunile. Elementele pot fi colorate după rezultatele lor, iar Găsire identifică fiecare element care îndeplinește o condiție pe care o stabiliți.';
$ec_lang['lpn_notes_6_term']='Ajutor pentru coloanele tabelului';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Selectare coloană</td><td>Clic pe antet</td></tr><tr><td>Adaugă sau extinde selecția de coloane</td><td>Ctrl+clic sau Shift+clic pe alt antet</td></tr><tr><td>Mută (reordonează) coloana (coloanele) selectată(e)</td><td>Trageți sau folosiți Gestionare coloane… din meniul clic-dreapta sau ⋮</td></tr><tr><td>Meniul ⋮ și săgeata de sortare.</td><td>Treceți cu indicatorul peste colțul de sus al unui antet, sau selectați ori navigați cu Tab într-un antet</td></tr><tr><td>Ascunde, Arată toate, sau Gestionează vizibilitatea și ordinea</td><td>Clic-dreapta pe antet sau meniul ⋮ din colțul din dreapta sus al antetului</td></tr><tr><td>Sortare după coloană</td><td>Pictograma săgeată din colțul din dreapta sus al antetului</td></tr><tr><td>Lipește ca rânduri noi la sfârșitul tabelului</td><td>Clic-dreapta, meniul ⋮ din colțul din dreapta sus al antetului, sau Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Comenzi rapide de la tastatură pentru tabel';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Tastele săgeți</td><td>Navigare.</td></tr><tr><td>Tab, Enter</td><td>Finalizează introducerea și navighează o celulă la dreapta / în jos.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Navighează înapoi.</td></tr><tr><td>Shift+tastele săgeți</td><td>Extinde selecția.</td></tr><tr><td>Ctrl+C</td><td>Copiază selecția.</td></tr><tr><td>Ctrl+D</td><td>Completează selecția în jos, de la rândul de sus.</td></tr><tr><td>Ctrl+Enter</td><td>Completează selecția cu valoarea celulei active.</td></tr><tr><td>Ctrl+A</td><td>Selectează întregul tabel.</td></tr><tr><td>Ctrl+Shift+V</td><td>Lipește ca rânduri noi la sfârșitul tabelului.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Comută la fila următoare sau la cea precedentă, fie tabel, fie grafic.</td></tr><tr><td>Delete</td><td>Golește o celulă.</td></tr><tr><td>F2</td><td>Deschide o celulă pentru editare.</td></tr><tr><td>Esc</td><td>Anulează o editare.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Limitele benzilor de culoare rămân aceleași';
$ec_lang['lpn_notes_color_def']='Limitele benzilor de culoare sunt stabilite atunci când alegeți o metodă de clasificare a datelor. Ele nu sunt stabilite din nou la fiecare pas de timp, pentru că asta ar face ca fiecare culoare să însemne altceva la fiecare pas, ceea ce nu ajută la vizualizarea sistemului dvs. EPANET funcționează la fel. Pentru limite noi, alegeți din nou o metodă sau introduceți propriile limite.';
$ec_lang['lpn_notes_epanet_term']='Constantele Hazen-Williams corespund cu EPANET';
$ec_lang['lpn_notes_epanet_def']='În august 2026, coeficientul și exponentul Hazen-Williams au fost modificate pentru a corespunde cu EPANET. Rezultatele pierderii de sarcină diferă față de versiunile anterioare ale acestei pagini cu până la 0,1 procente, ceea ce este mult mai mic decât incertitudinea valorii C în sine.';
$ec_lang['lpn_notes_engine_term']='Ce versiune de EPANET rulează această pagină';
$ec_lang['lpn_notes_engine_def']='Rezolvitorul EPANET de pe această pagină este OWA-EPANET 2.3.5, lansat pe 20 februarie 2025. EPANET este dezvoltat de Open Water Analytics, o comunitate care colaborează cu Agenția pentru Protecția Mediului a Statelor Unite (EPA), care a lansat versiunea 2.2.0 în decembrie 2019. Raportul de rulare îl numește 2.3.05, deoarece motorul scrie ultimul număr pe două cifre. Ajunge pe această pagină prin epanet-js 0.9.0, de Luke Butler, sub licența MIT, și rulează în browserul dvs.: rețeaua dvs. nu este trimisă niciodată nicăieri pentru a fi rezolvată.';
$ec_lang['lpn_id_invalid']='Introduceți un ID fără spații și fără ghilimele.';
$ec_lang['lpn_id_taken']='Acel ID este deja folosit.';
$ec_lang['lpn_diag_no_fixed_head']='Adăugați un rezervor sau un bazin. Rețeaua are nevoie de cel puțin un nivel de apă cunoscut înainte de a putea fi rezolvată.';
$ec_lang['lpn_diag_dangling_link']='O conductă sau o pompă se conectează la un nod care nu mai există:';
$ec_lang['lpn_diag_unreachable']='Aceste noduri nu au niciun traseu către un rezervor:';
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
$ec_lang['lpn_engine_fetching']='Se obține rezolvitorul EPANET. Este descărcat o singură dată și apoi păstrat pe acest dispozitiv, astfel încât funcționează ulterior offline.';
$ec_lang['lpn_engine_ready']='Rezolvitorul EPANET se află acum pe acest dispozitiv și funcționează offline.';
$ec_lang['lpn_engine_fetching_valve']='Se obține rezolvitorul EPANET, astfel încât această vană poate fi rezolvată acum și offline mai târziu.';
$ec_lang['lpn_engine_ready_valve']='Rezolvitorul EPANET se află acum pe acest dispozitiv. Vanele care se deschid și se închid singure vor funcționa offline.';
$ec_lang['lpn_engine_unavailable']='Rezolvitorul EPANET nu a putut fi obținut; acesta este cel care rezolvă vanele care se deschid și se închid singure. Conectați-vă la internet o singură dată, iar apoi rămâne pe acest dispozitiv.';
$ec_lang['lpn_engine_needed_loading']='Se încarcă rezolvitorul EPANET în timp ce construiți. Rezultatele vor fi disponibile după încărcarea completă.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Progresul încărcării rezolvitorului';
$ec_lang['lpn_engine_wait']='Se încarcă rezolvitorul. Rezultatele sunt întârziate momentan. Continuați să lucrați.';
$ec_lang['lpn_engine_wait_pct']='Rezolvitor încărcat {percent}%.';
$ec_lang['lpn_engine_wait_bytes']='Rezolvitor: {kb} KB încărcați până acum. Totalul nu este disponibil, deci procentul de finalizare este necunoscut.';
$ec_lang['lpn_engine_needed_failed']='Rezolvitorul EPANET nu a fost încă încărcat, nu poate fi încărcat, iar această rețea poate fi rezolvată doar de el. Va fi încărcat atunci când sunteți conectat la internet.';
$ec_lang['lpn_diag_valve_needs_epanet']='Aceste vane se deschid și se închid singure, iar numai rezolvitorul EPANET le poate calcula. Rezolvitorul EPANET nu a putut fi încărcat, deci aceste rezultate lipsesc:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Aceste vane sunt conectate direct la un rezervor sau la un bazin, care deja stabilește nivelul apei acolo, așa că nu mai rămâne nimic de controlat pentru vană. Introduceți o conductă scurtă între vană și rezervor sau bazin:';
$ec_lang['lpn_diag_not_converged']='Nu s-a găsit nicio soluție. Verificați dacă există valori imposibile în realitate, cum ar fi un diametru zero.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Rezolvarea nu a convers. Aceste numere sunt din ultima iterație, nu un răspuns. Nu le folosiți.';
$ec_lang['lpn_diag_not_converged_trials']='S-a oprit după {iterations} iterații.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='S-a oprit după {iterations} iterații la o eroare relativă de {error}, care nu a atins setarea de Precizie de {accuracy}.';
$ec_lang['lpn_field_roughness']='Rugozitate';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Coeficientul Hazen-Williams C. Un număr mai mare înseamnă o conductă mai netedă: aproximativ 150 pentru plastic nou, 130 pentru oțel sau fontă nouă și 100 pentru conductă veche.';
$ec_lang['lpn_field_length']='Lungime';
$ec_lang['lpn_field_from']='De la';
$ec_lang['lpn_field_to']='La';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Tipul vanei';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Ce face vana. O vană de reglaj menține o pierdere fixă. Celelalte trei mențin o presiune sau un debit și se deschid complet, se închid sau se închid parțial pe măsură ce apa se schimbă. Tipurile controlează proprietăți hidraulice diferite, deci setările pot fi pierdute la schimbare.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Reglaj (TCV)';
$ec_lang['lpn_valve_type_prv']='Reducătoare de presiune (PRV)';
$ec_lang['lpn_valve_type_psv']='Susținătoare de presiune (PSV)';
$ec_lang['lpn_valve_type_fcv']='Control debit (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Cădere fixă de presiune (PBV)';
$ec_lang['lpn_valve_type_gpv']='Uz general (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Cădere de presiune';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='Presiunea pe care o elimină vana. O vană cu cădere fixă de presiune elimină întotdeauna exact această presiune, indiferent de sensul de curgere a apei. Este o cădere pe vană, nu o presiune de menținut.';
$ec_lang['lpn_inp_drop_gpv_curve']='Această vană indică o curbă de pierdere de sarcină care nu se află în fișier. Vana a fost importată fără curbă, deci rămâne complet deschisă până când îi dați una.';
$ec_lang['lpn_gpv_curve_source']='Curbă de pierdere de sarcină a vanei';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Curba din caseta Biblioteci care arată câtă sarcină pierde această vană la fiecare debit. Mai multe vane pot folosi aceeași curbă, iar modificarea ei acolo le schimbă pe toate. Această vană păstrează doar referința; punctele în sine sunt citite și editate la Biblioteci, Curbe.';
$ec_lang['lpn_field_valve_setting_pressure']='Presiune de reglare';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Presiunea pe care o menține vana. O vană reducătoare de presiune menține presiunea pe partea aval la sau sub această valoare. O vană susținătoare de presiune menține presiunea pe partea amonte la sau peste această valoare.';
$ec_lang['lpn_field_valve_setting_flow']='Debit de reglare';
$ec_lang['lpn_field_valve_setting_flow_tip']='Debitul maxim pe care vana îl lasă să treacă. Când vrea să treacă mai puțină apă decât atât, vana stă complet deschisă și nu adaugă nicio pierdere.';
$ec_lang['lpn_field_valve_setting']='Setare';
$ec_lang['lpn_field_valve_setting_loss']='Coeficient de pierdere';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Câtă sarcină elimină vana de reglaj, exprimată ca multiplu al sarcinii de viteză. Folosiți 0 pentru o vană complet deschisă. Acest singur număr reprezintă întreaga pierdere a unei vane de reglaj.';
$ec_lang['lpn_field_valve_diameter_tip']='Lățimea deschiderii prin vană. Viteza apei prin vană este calculată din această lățime, iar pierderea rezultă din acea viteză.';
$ec_lang['lpn_field_valve_km_tip']='Pierderea corpului vanei atunci când vana stă complet deschisă, pe lângă orice elimină setarea vanei. Este exprimată ca multiplu al sarcinii de viteză. Folosiți 0 pentru a o ignora.';
$ec_lang['lpn_field_km']='Coeficient de pierdere locală, k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Pierdere locală, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Curbă de sarcină a pompei';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Curba din caseta Biblioteci care arată câtă sarcină adaugă această pompă la fiecare debit. Mai multe pompe pot folosi aceeași curbă, iar modificarea ei acolo le schimbă pe toate. Această pompă păstrează doar referința; punctele în sine sunt citite și editate la Biblioteci, Curbe.';
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
$ec_lang['lpn_field_desc']='Descriere';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Marcaj';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Un marcaj poate avea orice semnificație doriți, cum ar fi o zonă de presiune sau un ordin de lucru. Niciun calcul de aici sau din EPANET nu îl citește. Un marcaj este un singur cuvânt: EPANET se oprește din citire la primul spațiu, deci un spațiu este refuzat pe măsură ce îl tastați. Este păstrat la import și la export în fișierul EPANET.';
$ec_lang['lpn_pump_effic_curve']='Curbă de eficiență a pompei';
$ec_lang['lpn_pump_effic_curve_tip']='Curba din caseta Biblioteci care arată cât de eficientă este această pompă la fiecare debit. Mai multe pompe pot folosi aceeași curbă, iar modificarea ei acolo le schimbă pe toate. Această pompă păstrează doar referința; punctele în sine sunt citite și editate la Biblioteci, Curbe.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Nicio curbă selectată';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Curbe';
$ec_lang['lpn_curve_library_link_tip']='Deschide caseta Biblioteci la secțiunea Curbe, unde o curbă este adăugată, descrisă, editată și ștearsă. Un element precizează ce curbă folosește.';
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
$ec_lang['lpn_curve_kind_head']='Sarcină pompă';
$ec_lang['lpn_curve_kind_effic']='Eficiență pompă';
$ec_lang['lpn_curve_kind_volume']='Volum bazin';
$ec_lang['lpn_curve_kind_headloss']='Pierdere de sarcină vană';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Tip nespecificat';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Volum';
$ec_lang['lpn_pump_effic_col']='Eficiență';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Această pompă nu are nicio curbă de eficiență selectată, deci funcționează la eficiența stabilită pentru întreaga rețea, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Această pompă indică o curbă de eficiență numită {name}, pe care nimic din acest proiect nu o definește, deci funcționează la eficiența stabilită pentru întreaga rețea, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Mod: Selectare. Faceți clic pe un element sau pe o etichetă pentru a-l vedea sau modifica. Trageți pentru a muta un nod, un vârf sau o etichetă. Folosiți instrumentul Vârfuri pentru a adăuga sau elimina îndoiturile unei conducte.';
$ec_lang['lpn_mode_delete']='Mod: Ștergere. Faceți clic pe un element pentru a-l elimina.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Mod: Vârfuri. Vârfurile fiecărei conducte sunt afișate ca mici mânere pătrate. Faceți clic pe o conductă pentru a adăuga un vârf, faceți clic pe un mâner pentru a-l elimina, sau trageți un mâner pentru a-l muta. Nimic altceva de pe hartă nu se schimbă în acest mod.';
$ec_lang['lpn_mode_zoom_window']='Mod: Zoom fereastră. Faceți clic pe două colțuri opuse ale unui dreptunghi, sau trageți unul, pe hartă pentru a mări pe el.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Nimic nu este selectat. Faceți mai întâi clic pe un element de pe hartă, apoi apăsați Delete.';
$ec_lang['lpn_mode_add_junction']='Mod: Adăugare joncțiune. Faceți clic pe hartă pentru a plasa o joncțiune. Comutați la modul Selectare pentru a modifica sau muta elemente și etichete.';
$ec_lang['lpn_mode_add_reservoir']='Mod: Adăugare rezervor. Faceți clic pe hartă pentru a plasa un rezervor. Comutați la modul Selectare pentru a modifica sau muta elemente și etichete.';
$ec_lang['lpn_mode_add_tank']='Mod: Adăugare bazin. Faceți clic pe hartă pentru a plasa un bazin. Comutați la modul Selectare pentru a modifica sau muta elemente și etichete.';
$ec_lang['lpn_mode_add_pipe']='Mod: Adăugare conductă. Faceți clic pe un nod, apoi pe alt nod, pentru a le conecta. Faceți clic în spațiu liber între ele pentru a îndoi linia, sau apăsați Escape pentru a începe din nou. Comutați la modul Selectare pentru a modifica sau muta elemente și etichete.';
$ec_lang['lpn_mode_add_pump']='Mod: Adăugare pompă. Faceți clic pe un nod, apoi pe alt nod, pentru a le conecta. Faceți clic în spațiu liber între ele pentru a îndoi linia, sau apăsați Escape pentru a începe din nou. Comutați la modul Selectare pentru a modifica sau muta elemente și etichete.';
$ec_lang['lpn_mode_add_valve']='Mod: Adăugare vană. Faceți clic pe un nod, apoi pe alt nod, pentru a le conecta. Faceți clic în spațiu liber între ele pentru a îndoi linia, sau apăsați Escape pentru a începe din nou. Comutați la modul Selectare pentru a modifica sau muta elemente și etichete.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Mod: Adăugare Text. Faceți clic pe hartă pentru a plasa un Text. Faceți clic lângă un nod pentru a atașa Textul la acel nod. Comutați la modul Selectare pentru a modifica sau muta elemente și etichete.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Folosiți acest mod pentru a modifica, muta și trage elemente pe hartă. Este modul implicit la care revine pagina: revine singură aici după unele acțiuni, cum ar fi deschiderea unui proiect. Apăsarea tastei Esc a doua oară deselectează orice este selectat.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Automat';
$ec_lang['lpn_method_switch_confirm']='Schimbarea metodei de frecare nu modifică numerele de rugozitate deja introduse pe conductele dvs., iar o rugozitate pentru o metodă nu are sens pentru alta. Verificați fiecare conductă după aceasta. Schimbați oricum?';
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
$ec_lang['lpn_field_closed']='Închisă';
$ec_lang['lpn_field_closed_tip']='Închideți această conductă astfel încât apa să nu poată trece prin ea. Conducta rămâne pe hartă și își păstrează toate numerele, iar dvs. o puteți redeschide oricând.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Longitudine';
$ec_lang['lpn_field_lat']='Latitudine';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Nord';
$ec_lang['lpn_field_easting']='Est';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='N';
$ec_lang['lpn_field_easting_abbr']='E';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Lat';
$ec_lang['lpn_field_lon_abbr']='Long';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Tastați o locație de coordonate pentru a amplasa exact acest nod. Într-un scenariu, această locație se aplică doar în acel scenariu, la fel ca tragerea lui; în Bază, amplasează nodul peste tot.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Aceasta este în afara hărții. Latitudinea Pseudo Mercator variază de la -85,05 la 85,05, iar longitudinea de la -180 la 180.';
$ec_lang['lpn_field_text_size']='Factor de mărime';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Arată la toate nivelurile de zoom';
$ec_lang['lpn_field_text_all_zoom_tip']='Păstrează acest text pe desen oricât de mult micșorați. Debifați și textul se ascunde împreună cu celelalte etichete de îndată ce vizualizarea devine mai largă decât pragul de etichetare stabilit la Hartă și pagină.';
$ec_lang['lpn_tool_labels']='Etichete';
$ec_lang['lpn_labels_heading_node']='Etichete noduri';
$ec_lang['lpn_labels_heading_link']='Etichete legături';
$ec_lang['lpn_labels_mark_extrema']='Marchează valorile cele mai mari și cele mai mici';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Marchează cea mai mare valoare a fiecărei proprietăți etichetate pe hartă cu o linie deasupra (o supraliniere), și cea mai mică cu o linie dedesubt (o subliniere).';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Aplică la toate';
$ec_lang['lpn_settings_apply_to_all_tip']='Fiecare element de acest tip deja desenat primește un ID care începe cu acest text. Fiecare își păstrează numărul. Un ID care nu se termină într-un număr rămâne neschimbat.';
$ec_lang['lpn_confirm_apply_prefix']='Redenumiți {n} elemente astfel încât ID-urile lor să înceapă cu {prefix}? Fiecare își păstrează numărul.';
$ec_lang['lpn_prefix_applied']='{n} elemente redenumite. {skipped} altele au fost lăsate neschimbate.';
$ec_lang['lpn_labels_suffix_gradient_tip']='Text adăugat după panta pierderii de sarcină pe etichetele hărții. Nu introduceți aici un semn de procent. Este adăugat automat când unitatea este procent.';
$ec_lang['lpn_labels_separator']='Text între valori';
$ec_lang['lpn_labels_separator_tip']='Text între o proprietate și următoarea pe o etichetă. Un spațiu în mod implicit.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Prioritate';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='Ordinea în care valorile sunt eliminate atunci când două etichete de nod s-ar suprapune. Valoarea numerotată 1 este eliminată prima. Când rămâne o singură valoare și etichetele tot se suprapun, o etichetă întreagă este ascunsă: cea cu cererea mai mică, presiunea mai apropiată de mijlocul intervalului, sau cota ori sarcina mai apropiată numeric de nodurile vecine.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Pref.';
$ec_lang['lpn_labels_col_after']='Suf.';
$ec_lang['lpn_labels_col_decimals']='Zecimale';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Arată';
$ec_lang['lpn_labels_show_tip']='Ordinea în care apar valorile pe o etichetă. Valoarea numerotată 1 vine prima: în partea de sus a unei etichete stivuite, și la începutul unei etichete pe o singură linie.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Folosește unități';
$ec_lang['lpn_labels_use_units_tip']='Bifați pentru a arăta unitatea în caseta După și pe etichetă, și pentru a o menține la zi când unitățile se schimbă. Debifați pentru a tasta propriul text După.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Stare inițială';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Culori noduri';
$ec_lang['lpn_settings_sym_link_colors']='Culori legături';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Imagine de fundal…';
$ec_lang['lpn_backdrop_add']='Adăugare';
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
$ec_lang['lpn_backdrop_scale']='Scalare prin indicare';
$ec_lang['lpn_backdrop_scale_entry']='Scalare din fișier de georeferențiere sau din dimensiunea unui pixel de pe hartă';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Scalează din dimensiunea actuală, în jurul unui punct ales de dvs.';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Faceți clic pe punctul din imaginea de fundal care trebuie să rămână pe loc.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Scalați față de dimensiunea actuală. 1 o păstrează neschimbată, 1.1 o mărește cu 10%, 0.9 o micșorează cu 10%.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Introduceți dimensiunea unui pixel de pe hartă sau lipiți conținutul complet al fișierului de georeferențiere al imaginii';
$ec_lang['lpn_backdrop_scale_entry_bad']='Introduceți un singur număr pentru dimensiunea unui pixel de pe hartă, sau lipiți toate cele șase linii ale unui fișier de georeferențiere.';
$ec_lang['lpn_backdrop_wld_bad']='Acest fișier de georeferențiere rotește, oglindește sau întinde neuniform imaginea. Harta poate doar să mute o imagine și să o redimensioneze cu același factor pe ambele direcții, așa că fișierul nu a fost utilizat.';
$ec_lang['lpn_backdrop_unreadable']='Browserul dumneavoastră nu poate afișa această imagine. Salvați-o ca PNG sau JPEG și adăugați-o din nou.';
$ec_lang['lpn_backdrop_position']='Mutare';
$ec_lang['lpn_backdrop_remove']='Eliminare';
$ec_lang['lpn_backdrop_remove_confirm']='Eliminați imaginea de fundal?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Harta lumii…';
$ec_lang['lpn_map_attach_tip']='Atașează harta lumii la acest proiect fără a-l schimba în niciun alt fel.';
$ec_lang['lpn_map_attach_add']='Atașează';
$ec_lang['lpn_map_attach_readjust']='Reajustează';
$ec_lang['lpn_map_attach_readjust_tip']='Revino la Pasul 2 al procesului de atașare a hărții.';
$ec_lang['lpn_map_attach_scale_from']='Scalează de la dimensiunea actuală…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Scalează harta de la dimensiunea sa actuală, în jurul mijlocului desenului dvs. 1 o păstrează la fel, 1,1 o face cu 10% mai mare, 0,9 o face cu 10% mai mică.';
$ec_lang['lpn_map_attach_scale_from_bad']='Tastați un singur număr mai mare decât zero.';
$ec_lang['lpn_map_attach_scale_from_done']='Harta este redimensionată, iar desenul dvs. și fiecare coordonată din el rămân exact cum erau.';
$ec_lang['lpn_map_attach_none']='Nu există încă nicio hartă a lumii atașată la acest proiect. Folosiți mai întâi Hartă, Harta lumii, Atașează.';
$ec_lang['lpn_map_attach_remove']='Detașează';
$ec_lang['lpn_map_attach_remove_tip']='Îndepărtează harta lumii. Desenul și coordonatele sale rămân neatinse în ambele cazuri.';
$ec_lang['lpn_map_attach_done']='Harta lumii se află acum în spatele desenului dvs., iar proiectul rămâne neschimbat. Folosiți Hartă, Harta lumii, Detașează pentru a o îndepărta din nou.';
$ec_lang['lpn_map_attach_removed']='Harta lumii a dispărut, iar desenul este exact cum era.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Desenul dvs. se află pe o hartă a întregii lumi, în ocean, la latitudine zero și longitudine zero. Găsiți-vă mai întâi locul: deplasați și măriți harta din spatele desenului, căutați un nume de loc, sau tastați o latitudine și o longitudine. Desenul propriu-zis nu se mișcă.';
$ec_lang['lpn_mapgeo_step1']='Pasul 1 din 2: găsiți-vă locul în lume';
$ec_lang['lpn_mapgeo_step2']='Pasul 2 din 2: potriviți harta din spatele desenului dvs.';
$ec_lang['lpn_mapgeo_hint1']='Deplasați și măriți harta din spatele desenului dvs., sau căutați un loc, sau tastați o latitudine și o longitudine. Apoi apăsați Plasează aproximativ.';
$ec_lang['lpn_mapgeo_readjust_intro']='Desenul dvs. se află acolo unde l-ați plasat ultima dată. Pentru a-l muta în altă parte, deplasați și măriți harta din spatele desenului, căutați un nume de loc, sau tastați o latitudine și o longitudine. Desenul propriu-zis nu se mișcă.';
$ec_lang['lpn_mapgeo_hint2']='Trageți oriunde pentru a glisa harta sub desenul dvs. Desenul dvs. și fiecare coordonată din el rămân exact unde sunt. Apăsați Georeferențiază aici când harta este corectă.';
$ec_lang['lpn_mapgeo_gestures']='Zoom mișcă desenul dvs. și harta împreună, astfel încât puteți vedea cât de bine se aliniază. Tragerea mișcă doar harta.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Rotește harta';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} grade';
$ec_lang['lpn_mapgeo_dial_size']='Dimensiunea hărții';
$ec_lang['lpn_mapgeo_dial_size_read']='de {f} ori';
$ec_lang['lpn_mapgeo_dial_help']='Glisați cele două bare, sau tastați în casetele de deasupra lor, pentru a face harta mai mare sau mai mică și pentru a o roti. Mijlocul fiecărei bare este pasul „lăsat neschimbat”: 1, respectiv 0 — adică 1 și 0 înseamnă să nu modificați nimic. Tastele săgeți funcționează pentru ambele.';
$ec_lang['lpn_mapgeo_place']='Plasează aproximativ';
$ec_lang['lpn_mapgeo_finish']='Georeferențiază aici';
$ec_lang['lpn_mapgeo_cancelled']='Harta lumii este înapoi unde era, iar desenul dvs. nu s-a mișcat niciodată.';
$ec_lang['lpn_mapgeo_locked']='Finalizați cu butonul Georeferențiază aici, sau apăsați Anulare, înainte de a schimba proiectele sau de a salva. Harta lumii este încă în curs de plasare.';
$ec_lang['lpn_backdrop_scale_prompt1']='Faceți clic pe două puncte de pe imaginea de fundal, cum ar fi cele două capete ale unei scări grafice. Apoi introduceți distanța reală dintre ele.';
$ec_lang['lpn_backdrop_scale_prompt2']='Distanța reală dintre cele două puncte';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Faceți clic pe punctul de bază (pe imagine) pentru mutare.';
$ec_lang['lpn_backdrop_position_prompt2']='Alegeți metoda pentru punctul de destinație, apoi faceți clic pe Continuare.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Se ajustează imaginea de fundal.';
$ec_lang['lpn_backdrop_target_label']='Mută acel punct la:';
$ec_lang['lpn_backdrop_target_node']='Un nod';
$ec_lang['lpn_backdrop_target_free']='Orice punct de pe hartă';
$ec_lang['lpn_backdrop_target_coords']='Coordonate pe care le introduceți';
$ec_lang['lpn_backdrop_coords_prompt']='Introduceți coordonatele X,Y la care ar trebui să se mute acel punct';
$ec_lang['lpn_backdrop_continue']='Continuare';
$ec_lang['lpn_tool_settings']='Setări';
$ec_lang['lpn_settings_show_titles']='Afișează titlurile paginii';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Ascunde aceste titluri';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Afișează ajutorul de selecție';
$ec_lang['lpn_settings_area_hint_tip']='Afișează balonul de peste hartă care spune ce va face următorul dvs. clic în timp ce selectați o zonă.';
$ec_lang['lpn_settings_id_prefixes']='Prefixe ID';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Valori la creare';
$ec_lang['lpn_settings_defaults_note']='Folosite pentru elementele pe care le creați de acum înainte. Elementele existente nu sunt modificate.';
$ec_lang['lpn_settings_push_note']='Sunt aplicate doar proprietățile ale căror etichete sunt afișate în acest moment.';
$ec_lang['lpn_settings_push_btn']='Aplică aceste valori pentru elemente noi la fiecare element existent';
$ec_lang['lpn_push_confirm']='Înlocuiți aceste proprietăți la fiecare element existent cu valorile stabilite acum pentru elementele noi? Valorile pe care le-ați introdus vor fi suprascrise. Puteți anula această acțiune.';
$ec_lang['lpn_push_properties']='Proprietăți:';
$ec_lang['lpn_push_assets']='Noduri și conducte:';
$ec_lang['lpn_push_none_displayed']='Nicio valoare inițială nu este afișată ca etichetă în acest moment, deci nu este nimic de aplicat. Activați etichetele pentru proprietățile dorite în panoul Etichete, apoi încercați din nou.';
$ec_lang['lpn_push_nothing']='Niciun element existent nu are vreuna dintre proprietățile care se aplică.';
$ec_lang['lpn_push_no_change']='Fiecare element are deja aceste valori, deci nimic nu s-ar schimba.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Proprietăți personalizate';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Proprietăți pe care le definiți dvs. înșivă, pentru propriile scopuri. Sunt stocate împreună cu proiectul și scenariile, la fel ca toate celelalte proprietăți.';
$ec_lang['lpn_cp_design']='Proiectare';
$ec_lang['lpn_cp_design_tip']='Un rând pentru fiecare proprietate personalizată, iar fiecare se deschide pentru a arăta: Cheie, Etichetă, Se aplică la, Validează ca, Permite sau restricționează, câmpul de caractere numit de această alegere, Limită inferioară a lungimii, Limită superioară a lungimii, Limită inferioară, Limită superioară.';
$ec_lang['lpn_cp_add']='Adaugă proprietate personalizată';
$ec_lang['lpn_cp_add_tip']='Adaugă un rând în tabelul de proiectare și îl deschide pentru editare.';
$ec_lang['lpn_cp_remove_tip']='Elimină această proprietate din tabelul de proiectare. Valorile deja introduse pe elementele dvs. sunt păstrate în fișier și revin dacă proiectați din nou aceeași cheie.';
$ec_lang['lpn_cp_none']='Nicio proprietate personalizată nu este încă proiectată.';
$ec_lang['lpn_cp_unnamed']='Nedenumită încă';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Cheie';
$ec_lang['lpn_cp_key_tip']='Cheie: O proprietate este stocată sub acest nume. Spațiile nu sunt permise, iar un prefix este adăugat automat pentru ca cheia dvs. să nu poată intra niciodată în coliziune cu un câmp predefinit.';
$ec_lang['lpn_cp_label']='Etichetă';
$ec_lang['lpn_cp_label_tip']='Etichetă: Aceasta este ceea ce vede un cititor în caseta de proprietăți, în Găsire și în capul unei coloane de tabel.';
$ec_lang['lpn_cp_applies']='Se aplică la';
$ec_lang['lpn_cp_applies_tip']='Se aplică la: Listă de prefixe de ID separate prin virgulă, pentru elementele care folosesc această proprietate, de exemplu J,L,R.';
$ec_lang['lpn_cp_validate']='Validează ca';
$ec_lang['lpn_cp_validate_tip']='Validează ca: Aceasta spune cum arată o valoare corectă. Regulile de scriere citesc doar alfabetul englez, ceea ce este o limitare declarată. Alegeți Nu valida pentru a accepta orice.';
$ec_lang['lpn_cp_restrict']='Restricționează aceste caractere';
$ec_lang['lpn_cp_restrict_tip']='Restricționează aceste caractere: O valoare poate folosi doar caracterele listate aici, sau niciunul dintre ele, unde „@” înseamnă orice literă; „#” înseamnă orice cifră numerică, iar „-”, „.” și „,” trebuie listate separat dacă sunt permise; iar orice caracter de spațiu alb trebuie să fie între alte caractere.';
$ec_lang['lpn_cp_restrict_mode']='Permite sau restricționează';
$ec_lang['lpn_cp_restrict_mode_tip']='Permite sau restricționează: Caracterele date sunt fie singurele pe care o valoare le poate folosi, fie cele pe care nu le poate folosi.';
$ec_lang['lpn_cp_restrict_allow']='Permite doar aceste caractere';
$ec_lang['lpn_cp_minlength']='Limită inferioară a lungimii';
$ec_lang['lpn_cp_minlength_tip']='Limită inferioară a lungimii: Orice intrare mai scurtă este semnalată, astfel găsiți intrările goale și pe cele introduse pe jumătate.';
$ec_lang['lpn_cp_length']='Limită superioară a lungimii';
$ec_lang['lpn_cp_length_tip']='Limită superioară a lungimii: Orice intrare mai lungă este semnalată.';
$ec_lang['lpn_cp_low']='Limită inferioară';
$ec_lang['lpn_cp_low_tip']='Limită inferioară: Aceasta este cea mai mică valoare pe care o așteptați. Numerele sunt comparate ca numere, iar textul în ordine alfabetică.';
$ec_lang['lpn_cp_high']='Limită superioară';
$ec_lang['lpn_cp_high_tip']='Limită superioară: Aceasta este cea mai mare valoare pe care o așteptați. Numerele sunt comparate ca numere, iar textul în ordine alfabetică.';
$ec_lang['lpn_cp_val_none']='Nu valida';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Număr .';
$ec_lang['lpn_cp_val_number_comma']='Număr ,';
$ec_lang['lpn_cp_val_integer']='Întreg';
$ec_lang['lpn_cp_val_upper']='MAJUSCULE';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Valoarea este păstrată exact așa cum ați introdus-o.';
$ec_lang['lpn_cp_bad_number']='Această valoare nu este un număr, așa cum se cere pentru această proprietate.';
$ec_lang['lpn_cp_bad_integer']='Această valoare nu este un număr întreg, așa cum se cere pentru această proprietate.';
$ec_lang['lpn_cp_bad_case']='Această valoare nu este scrisă cu MAJUSCULE, așa cum se cere pentru această proprietate.';
$ec_lang['lpn_cp_bad_chars']='Această valoare folosește un caracter pe care această proprietate nu îl permite.';
$ec_lang['lpn_cp_bad_space']='Spațiul alb este permis doar între alte caractere.';
$ec_lang['lpn_cp_bad_minlength']='Această valoare este mai scurtă decât permite această proprietate.';
$ec_lang['lpn_cp_bad_length']='Această valoare este mai lungă decât permite această proprietate.';
$ec_lang['lpn_cp_bad_low']='Această valoare este sub limita inferioară a acestei proprietăți.';
$ec_lang['lpn_cp_bad_high']='Această valoare este peste limita superioară a acestei proprietăți.';
$ec_lang['lpn_cp_key_needed']='Dați acestei proprietăți personalizate o cheie fără spații.';
$ec_lang['lpn_cp_key_taken']='O altă proprietate personalizată folosește deja acea cheie.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Scenariu';
$ec_lang['lpn_scenario_base']='Bază';
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
$ec_lang['lpn_scenario_overrides']='Nr. de valori specifice';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Inelul auriu înseamnă că acest element are o valoare care aparține exclusiv scenariului {name}.';
$ec_lang['lpn_scenario_overrides_tip']='Fiecare dintre acele valori este marcată pe hartă cu un inel auriu. Comutați la {base} pentru a vedea desenul fără ele.';
$ec_lang['lpn_scenario_menu']='Scenarii';
$ec_lang['lpn_scenario_tip']='Setul de valori pe care desenul le arată și pe care pagina le rezolvă acum. Faceți clic pentru a schimba scenariile, sau pentru a adăuga, redenumi sau șterge unul.';
$ec_lang['lpn_scenario_new']='Scenariu nou…';
$ec_lang['lpn_scenario_new_name']='Scenariul {n}';
$ec_lang['lpn_scenario_prompt_name']='Nume pentru acest scenariu';
$ec_lang['lpn_scenario_rename']='Redenumire scenariu…';
$ec_lang['lpn_scenario_delete']='Ștergere scenariu';
$ec_lang['lpn_scenario_delete_confirm']='Ștergeți scenariul {name} și cele {n} valori care îi aparțin exclusiv? Desenul propriu-zis nu este modificat.';
$ec_lang['lpn_scenario_override']='Doar în acest scenariu';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Bifat înseamnă că acest scenariu are o valoare proprie pentru acest câmp, chiar dacă este același număr ca la Bază. Debifați pentru a folosi din nou valoarea de Bază.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Scenariul de bază: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} este în afara rețelei în {scenario}. Rămâne pe desen și în celelalte scenarii ale dvs.';
$ec_lang['lpn_scenario_push_btn']='Aplică valorile de Bază la toate scenariile';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Fiecare scenariu revine la valoarea de Bază pentru proprietățile ale căror etichete sunt afișate acum. Valorile introduse pentru ele în orice scenariu sunt eliminate.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Faceți ca fiecare scenariu să folosească valorile de Bază pentru aceste proprietăți? Valorile introduse pentru ele în orice scenariu sunt eliminate. Puteți anula această acțiune.';
$ec_lang['lpn_scenario_push_scenarios']='Scenarii afectate:';
$ec_lang['lpn_scenario_push_values']='Valori eliminate:';
$ec_lang['lpn_scenario_push_none']='Niciun scenariu nu are o valoare specifică pentru vreuna dintre aceste proprietăți, deci nimic nu s-ar schimba. Nimic nu este eliminat.';
$ec_lang['lpn_scenario_preset_flow_static']='1. Test de debit: Static';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Calibrarea testului de debit pentru o rețea de proiectare la debit 0. În acest scenariu, setați cerința tuturor joncțiunilor la 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Test de debit: Mediu';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Calibrarea testului de debit pentru o rețea de proiectare la primul debit raportat. În acest scenariu, setați cerința joncțiunii prin care curge apa la primul debit măsurat, iar cerința tuturor celorlalte joncțiuni la 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Test de debit: Max';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Calibrarea testului de debit pentru o rețea de proiectare la debitul maxim raportat. În acest scenariu, setați cerința joncțiunii prin care curge apa la debitul maxim măsurat, iar cerința tuturor celorlalte joncțiuni la 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Zi medie';
$ec_lang['lpn_scenario_preset_average_day_tip']='Multiplicator de cerință 1: fiecare cerință așa cum a fost introdusă, considerată cerința zilei medii.';
$ec_lang['lpn_scenario_preset_max_day']='5. Zi maximă';
$ec_lang['lpn_scenario_preset_max_day_tip']='Multiplicator de cerință 2,0 ori cerința zilei medii, o valoare provizorie. Majoritatea sistemelor se situează între 1,2 și 3,0 (National Research Council, 2006). Stabiliți-l pe al sistemului dvs. în Setări, Calcul, Hidraulică, Multiplicator de cerință.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Oră de vârf';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='Multiplicator de cerință 3,0 ori cerința zilei medii, o valoare provizorie. Majoritatea sistemelor se situează între 3,0 și 6,0 (National Research Council, 2006). Stabiliți-l pe al sistemului dvs. în Setări, Calcul, Hidraulică, Multiplicator de cerință.';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. Incendiu plus zi maximă';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='Cerința zilei maxime (multiplicator 2,0). Rulați Analiza debitului de incendiu în acest scenariu: ea adaugă debitul de incendiu la fiecare joncțiune peste această cerință.';
$ec_lang['lpn_delete_drops_overrides']='Ștergerea acestui element aruncă și {n} valori pe care scenariile dvs. le au pentru el. Continuați?';
$ec_lang['lpn_push_base_only']='Această acțiune modifică desenul propriu-zis, deci poate fi făcută doar în {base}. Comutați la {base} și încercați din nou.';
$ec_lang['lpn_field_active']='Parte din rețea';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Debifați această casetă pentru a lăsa elementul pe desen dar în afara rețelei: este desenat gri, iar rezolvitorul îl ignoră. Într-un scenariu, așa se pornește și se oprește o conductă.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Exponent emițător';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='Exponentul din ecuația de emițător a EPANET pentru aspersoare și scurgeri: debit = coeficient x presiune ridicată la această putere. Schimbă răspunsul doar acolo unde un nod are un emițător, ceea ce deocamdată înseamnă o rețea citită dintr-un fișier EPANET.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Citește DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Citește cota din DEM la acest nod și o afișează mai jos. Nimic din caseta Cotă nu este schimbat. Rezoluția orizontală a DEM este de circa 30 m pentru cea mai mare parte a Pământului, și mai fină acolo unde există date mai bune.';
$ec_lang['lpn_elev_dem_use']='Folosește DEM';
$ec_lang['lpn_elev_dem_use_tip']='Pune cota din DEM la acest nod în caseta Cotă de mai sus, înlocuind ce se află acolo. Citește DEM mai întâi dacă nu a fost încă citit. Un singur Undo o readuce la loc.';
$ec_lang['lpn_elev_dem_none']='DEM nu are nicio cotă pentru acest nod.';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM spune {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Sursa cotei';
$ec_lang['lpn_settings_elev_source_tip']='De unde primește un nod nou cota sa. Suprafața terenului este citită din Mapbox DEM, care are circa 30 m pe cea mai mare parte a Pământului și mai fin acolo unde există date mai bune.';
$ec_lang['lpn_settings_elev_source_typed']='Cota introdusă mai sus';
$ec_lang['lpn_settings_elev_source_dem']='DEM Mapbox';
$ec_lang['lpn_settings_accuracy']='Precizie';
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
$ec_lang['lpn_settings_default_is']='Valoarea implicită este {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Cât de aproape trebuie să ajungă rezolvitorul înainte de a se opri, măsurat ca mărimea cu care debitele încă se schimbă de la o încercare la următoarea. Un număr mai mic este mai exact și durează mai mult. Ambele rezolvitoare citesc această singură casetă, dar fiecare măsoară acea schimbare față de un total diferit: rezolvitorul intern față de suma cerințelor, EPANET față de suma debitelor din legături. Lăsată goală, această pagină folosește o precizie mai strictă decât valoarea implicită a EPANET.';
$ec_lang['lpn_settings_specific_gravity']='Densitate relativă';
$ec_lang['lpn_settings_specific_gravity_tip']='Greutatea fluidului comparată cu a apei. Schimbă presiunile pe care le-ar citi un manometru, nu debitele.';
$ec_lang['lpn_settings_viscosity']='Vâscozitate relativă';
$ec_lang['lpn_settings_viscosity_tip']='Vâscozitatea fluidului comparată cu a apei la 20 de grade Celsius. Schimbă răspunsul doar la metoda Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Încercări maxime';
$ec_lang['lpn_settings_trials_tip']='Câte încercări sunt permise înainte ca rezolvitorul să renunțe la o rețea care nu converge.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Dacă nu converge';
$ec_lang['lpn_settings_unbalanced_tip']='Ce se face cu o rețea care și-a epuizat încercările și tot nu a convers. Permiterea unor încercări suplimentare ajunge adesea la convergență. Oprirea raportează ultima încercare așa cum este, ceea ce nu este o soluție. Doar rezolvitorul EPANET citește această casetă. Rezolvitorul intern se oprește întotdeauna și marchează răspunsul ca neconvergent.';
$ec_lang['lpn_settings_unbalanced_continue']='Permite încercări suplimentare';
$ec_lang['lpn_settings_unbalanced_stop']='Oprește și raportează ultima încercare';
$ec_lang['lpn_settings_unbalanced_trials']='Încercări suplimentare înainte de raportare';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Câte încercări suplimentare sunt permise după ce cele maxime de mai sus sunt epuizate, înainte de a raporta ultima încercare. Doar rezolvitorul EPANET citește această casetă.';
$ec_lang['lpn_settings_head_error']='Limita erorii de sarcină';
$ec_lang['lpn_settings_head_error_tip']='Un test suplimentar pe care rezolvitorul trebuie să îl treacă înainte de a se opri: cea mai mare eroare de sarcină rămasă în orice conductă. Zero înseamnă că acest test nu se aplică. Doar rezolvitorul EPANET citește această casetă.';
$ec_lang['lpn_settings_flow_change']='Limita schimbării de debit';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Un test suplimentar pe care rezolvitorul trebuie să îl treacă înainte de a se opri: cea mai mare schimbare a debitului dintr-o conductă de la o încercare la următoarea. Zero înseamnă că acest test nu se aplică. Doar rezolvitorul EPANET citește această casetă.';
$ec_lang['lpn_settings_damp_limit']='Amortizarea începe la';
$ec_lang['lpn_settings_damp_limit_tip']='Precizia la care rezolvitorul începe să facă pași mai mici, ceea ce poate ajuta o rețea oscilantă să converge. Zero înseamnă că rezolvitorul nu amortizează niciodată. Doar rezolvitorul EPANET citește această casetă.';
$ec_lang['lpn_settings_option_unset']='Nestabilit';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Un singur factor aplicat simultan tuturor cerințelor din rețea. Folosiți-l pentru a întreba ce face sistemul la o utilizare mai mare sau mai mică decât cea actuală. Nu schimbă numerele pe care le-ați introdus. Un scenariu poate avea propriul său multiplicator, astfel încât ziua medie, ziua maximă și ora de vârf sunt fiecare un singur număr; lăsați-l gol într-un scenariu pentru a folosi valoarea proiectului.';
$ec_lang['lpn_settings_engine_native']='Rezolvă cu rezolvitorul EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='Activați această opțiune pentru a folosi rezolvitorul intern acolo unde este posibil. În caz contrar, este folosit întotdeauna rezolvitorul EPANET de la US EPA. Rezolvitorul intern nu este folosit pentru simulări pe perioadă extinsă sau pentru o vană PRV, PSV sau FCV activă. Prima dată când este folosit rezolvitorul EPANET, se descarcă aproximativ 650 KB, care rămân apoi pe acest dispozitiv. Acolo unde o conductă are o pierdere locală (minoră), cele două rezolvitoare diferă în ultimele cifre: EPANET rotunjește valoarea folosită pentru gravitație, astfel încât pierderile sale locale ies puțin mai mici decât forma exactă.';
$ec_lang['lpn_engine_loading']='Se încarcă rezolvitorul EPANET…';
$ec_lang['lpn_engine_failed']='Rezolvitorul EPANET nu a putut fi încărcat. Se afișează în schimb rezolvitorul integrat.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Rezolvat cu rezolvitorul EPANET, deoarece aceste vane se deschid și se închid singure:';
$ec_lang['lpn_unit_unknown']='Acest desen indică o unitate pe care această pagină nu o oferă: {unit}. Totul este păstrat și afișat exact așa cum a fost primit, iar nimic nu a fost modificat. Nu se poate calcula nimic până când această pagină nu învață unitatea respectivă, deoarece nu știe cât de mare este aceasta.';
$ec_lang['lpn_engine_manning_note']='Notă: cu rugozitate Manning, EPANET rotunjește constanta din ecuația Manning, astfel încât pierderea de sarcină iese cu aproximativ 0,6% mai mică decât forma exactă.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='Rezolvitorul EPANET nu a acceptat această rețea, deci nu a rulat.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='Rezolvitorul EPANET a spus: {message}';
$ec_lang['lpn_engine_refused_fallback']='În schimb, numerele de pe ecran provin din rezolvitorul integrat.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='În schimb, numerele de pe ecran provin din rezolvitorul integrat. Acesta calculează câte un moment odată, deci aceasta este rețeaua doar la {time}, cu fiecare bazin încă la nivelul său inițial.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Aceste comenzi numesc un element care nu mai este în acest proiect, deci au fost omise: {ids}';
$ec_lang['lpn_control_unreadable_note']='Aceste comenzi nu au putut fi citite, deci au fost omise: {ids}';
$ec_lang['lpn_rule_dangling_note']='Aceste reguli indică un element care nu mai este în acest proiect, deci au fost ignorate la această rulare: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Aceste reguli nu au putut fi citite, deci au fost ignorate la această rulare: {ids}';
$ec_lang['lpn_settings_text_size']='Dimensiune text (pixeli)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Dimensiune simbol (pixeli)';
$ec_lang['lpn_settings_link_width']='Lățimea liniei legăturii (pixeli)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Săgeți de direcție a debitului';
$ec_lang['lpn_settings_show_arrows_tip']='Desenează o săgeată pe fiecare conductă arătând în ce sens curge apa. Săgețile apar după o rulare, iar dezactivarea lor lasă rezultatele neschimbate. Această setare este salvată odată cu proiectul.';
$ec_lang['lpn_settings_align_labels']='Aliniază etichetele conductelor cu conductele';
$ec_lang['lpn_settings_readability_bias']='Întoarce o etichetă cu susul în jos când se înclină la stânga verticalei cu mai mult de acest număr de grade';
$ec_lang['lpn_settings_readability_bias_tip']='Întoarce o etichetă pentru a o menține cu susul în sus atunci când se înclină la stânga verticalei cu mai mult de acest număr de grade.';
$ec_lang['lpn_settings_mask_labels']='Fundal opac în spatele etichetelor';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Prinde liniile indicatoare la unghiuri fixe';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Arată etichetele când sunteți măriți la această lățime a hărții sau mai puțin';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Etichetele sunt desenate doar cât timp vizualizarea hărții are această lățime sau mai puțin. Lăsați caseta necompletată pentru a le desena la orice nivel de zoom. Tastați 0 pentru a nu desena niciodată o etichetă, la niciun nivel de zoom.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Arată întotdeauna';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='Împiedică nodurile să se scaleze mai mari decât';
$ec_lang['lpn_settings_symbol_cap_mid']='ori lungimea';
$ec_lang['lpn_settings_symbol_cap_post']='conductei de percentila';
$ec_lang['lpn_settings_symbol_cap_tip']='O joncțiune încetează să crească pe teren odată ce diametrul ei ar ajunge de atâtea ori lungimea conductei la această percentilă a tuturor lungimilor de conductă din rețea. Dincolo de acel punct pe hartă, joncțiunile, conductele și celelalte simboluri se micșorează pe ecran pe măsură ce micșorați, în loc să crească pe teren. Rezervoarele și bazinele fac excepție și își păstrează dimensiunea pe ecran la orice nivel de zoom.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Opacitate simbol (0 până la 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Opacitate imagine de fundal (0 până la 1)';
$ec_lang['lpn_settings_map_display']='Aspect';
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
$ec_lang['lpn_settings_legend_position']='Poziția legendei etichetelor';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Niciuna';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Dezactivat';
$ec_lang['lpn_settings_legend_top_left']='Sus stânga';
$ec_lang['lpn_settings_legend_top_right']='Sus dreapta';
$ec_lang['lpn_settings_legend_middle_left']='Mijloc stânga';
$ec_lang['lpn_settings_legend_middle_right']='Mijloc dreapta';
$ec_lang['lpn_settings_legend_bottom_left']='Jos stânga';
$ec_lang['lpn_settings_legend_bottom_right']='Jos dreapta';
$ec_lang['lpn_settings_color_node_field']='Culoare nod';
$ec_lang['lpn_settings_color_link_field']='Culoare conductă';
$ec_lang['lpn_settings_color_ramp']='Schemă de culori';
$ec_lang['lpn_settings_color_credits']='Credite';
$ec_lang['lpn_color_ramp_epanet']='Albastru spre roșu (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Violet spre galben (mai ușor de distins o culoare de alta)';
$ec_lang['lpn_color_ramp_gray']='Gri deschis spre gri închis';
$ec_lang['lpn_settings_color_reverse']='Inversează ordinea culorilor';
$ec_lang['lpn_color_none']='Fără culoare';
$ec_lang['lpn_settings_color_key_position']='Poziția legendei de culori';
$ec_lang['lpn_settings_color_breaks']='Limitele benzilor de culoare';
$ec_lang['lpn_settings_color_equal_intervals']='Intervale egale';
$ec_lang['lpn_settings_color_equal_counts']='Frecvențe egale';
$ec_lang['lpn_settings_color_no_values']='Nu există încă valori de la care să se pornească. Rezolvați mai întâi rețeaua.';
$ec_lang['lpn_confirm_restore_defaults']='Resetați toate setările (prefixe ID, valori inițiale, setări ale rezolvitorului, aspectul hărții, poziția legendei și etichetele vizibile) la valorile lor originale? Rețeaua dvs. nu este modificată. Setările aparțin proiectului deschis, deci celelalte proiecte ale dvs. le păstrează pe ale lor.';
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
$ec_lang['lpn_settings_wipe_btn']='Începeți din nou';
$ec_lang['lpn_confirm_wipe']='Începeți din nou și ștergeți TOTUL salvat pentru această pagină: fiecare proiect, fiecare imagine de fundal, toate setările și alegerile dvs. de unități? Pagina se reîncarcă exact așa cum ar vedea-o un vizitator complet nou. Această acțiune nu poate fi anulată.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Copiați acest link:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Timp';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Durata totală de rulare';
$ec_lang['lpn_time_hyd_step']='Pas de timp hidraulic';
$ec_lang['lpn_time_pattern_step']='Pas de timp al modelului';
$ec_lang['lpn_time_pattern_start']='Ora de start a modelului';
$ec_lang['lpn_time_report_step']='Pas de timp al raportării';
$ec_lang['lpn_time_report_start']='Ora de start a raportării';
$ec_lang['lpn_time_clock_start']='Ora ceasului la start';
$ec_lang['lpn_time_clock_day']='Ziua {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Scrieți o oră ca ore și minute, de exemplu 2:30. Un număr simplu înseamnă ore, deci 8 înseamnă opt ore. O jumătate de oră este 0:30.';
$ec_lang['lpn_time_running']='Se calculează simularea pe o perioadă extinsă cu rezolvitorul EPANET.';
$ec_lang['lpn_time_no_engine']='Rezolvitorul intern calculează un singur moment o dată, deci aceasta este rețeaua doar la {time}: fiecare model este citit la acel moment, iar fiecare bazin rămâne încă la nivelul lui de pornire, în loc să se umple și să se golească. Conectați-vă la internet o singură dată pentru a obține rezolvitorul EPANET, care rulează o simulare pe o perioadă extinsă.';
$ec_lang['lpn_time_slider']='Timp de simulare scurs';
$ec_lang['lpn_time_no_period']='Acest proiect nu are stabilită o simulare pe o perioadă extinsă, deci există un singur moment de arătat. Stabiliți o Durată totală de rulare la Setări, Calcul, Timp pentru a rula o simulare pe o perioadă extinsă.';
$ec_lang['lpn_time_first']='Mergi la început';
$ec_lang['lpn_time_prev']='Pas înapoi';
$ec_lang['lpn_time_play']='Redare';
$ec_lang['lpn_time_play_tip']='Redă animația';
$ec_lang['lpn_time_pause_tip']='Pune animația în pauză';
$ec_lang['lpn_time_pause']='Pauză';
$ec_lang['lpn_time_next']='Pas înainte';
$ec_lang['lpn_time_last']='Mergi la sfârșit';
$ec_lang['lpn_time_tank']='Bazin';
$ec_lang['lpn_time_level']='Nivelul apei';
$ec_lang['lpn_time_run']='Calculează';
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
$ec_lang['lpn_time_run_done']='Rularea s-a încheiat. Momente de raportare: {frames}. Timp necesar: {secs} s.';
$ec_lang['lpn_time_runbox_hide']='Nu mai afișa această casetă';
$ec_lang['lpn_settings_runbox']='Afișează caseta de progres a rulării';
$ec_lang['lpn_settings_runbox_tip']='O casetă care raportează cât de departe a ajuns o rulare și ce a găsit. Cu ea dezactivată, o rulare terminată spune același lucru în linia de stare, timp de câteva secunde. Aceasta este o setare pentru acest browser, nu pentru proiect.';
$ec_lang['lpn_time_run_failed']='Rularea nu s-a încheiat, deci nu există rezultate pentru momentele ulterioare.';
$ec_lang['lpn_time_run_report']='Raport de rulare EPANET';
$ec_lang['lpn_time_run_report_copy']='Copiază';
$ec_lang['lpn_time_run_report_copied']='Copiat';
$ec_lang['lpn_time_run_report_tip']='Ce a tipărit chiar rezolvitorul EPANET despre ultima rulare: dacă a convers, și orice a avertizat. Este textul propriu al rezolvitorului, nu al nostru.';

$ec_lang['lpn_time_speed']='Viteză';
$ec_lang['lpn_time_speed_tip']='Viteza de redare';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Căutare setări';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Introduceți un cuvânt sau mai multe cuvinte pentru a vedea setările care le menționează pe toate.';
$ec_lang['lpn_settings_no_match']='Nicio setare nu menționează acel cuvânt.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Lățimea listei secțiunilor din Setări';
$ec_lang['lpn_rpane_empty']='Nimic nu este ancorat aici încă. Tot ce aparține întregului proiect se află în Setări.';
$ec_lang['lpn_time_settings_open']='Setări de timp';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Vizualizare';
$ec_lang['lpn_settings_sec_map']='Hartă și pagină';
$ec_lang['lpn_settings_sec_assets']='Elemente';
$ec_lang['lpn_settings_sec_calculation']='Calcul';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Abonat';
$ec_lang['lpn_labels_customer_note']='O etichetă de abonat arată valorile bifate aici. Este desenată la aceeași dimensiune de text ca orice altă etichetă de pe hartă.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Etichetele de abonat sunt desenate doar cât timp vizualizarea hărții are această lățime sau mai puțin. Lăsați caseta necompletată pentru a le desena la orice nivel de zoom. Tastați 0 pentru a nu desena niciodată o etichetă de abonat, la niciun nivel de zoom. Aceasta nu are niciun efect dacă este mai mare decât setarea similară pentru toate etichetele.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Folosește vizualizarea curentă';
$ec_lang['lpn_settings_page']='Pagină';
$ec_lang['lpn_settings_page_note']='Salvat în acest calculator, nu în proiect.';
$ec_lang['lpn_settings_hydraulics']='Hidraulică';
$ec_lang['lpn_settings_quality']='Calitatea apei';
$ec_lang['lpn_settings_quality_track']='Parametru de calitate';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Alegeți ce trebuie să urmărească rularea prin conducte: cât timp a stat apa în sistem, de unde provine, sau o substanță chimică ce reacționează pe parcurs. Doar substanța chimică are nevoie de coeficienți.';
$ec_lang['lpn_settings_quality_source']='Nod de urmărire';
$ec_lang['lpn_settings_quality_source_tip']='Nodul a cărui apă este urmărită. Fiecare alt nod arată apoi ponderea apei sale care provine din acel nod.';
$ec_lang['lpn_quality_none']='Niciuna';
$ec_lang['lpn_quality_trace']='Urmărire sursă';
$ec_lang['lpn_quality_chemical']='O substanță chimică ce reacționează';
$ec_lang['lpn_quality_needs_run']='Calitatea apei este purtată de-a lungul conductelor pe măsură ce apa călătorește, deci are nevoie de o simulare pe o perioadă extinsă: motorul EPANET și o durată totală de rulare. Stabiliți o Durată totală de rulare la Timp, apoi apăsați butonul Calculează.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Substanța chimică și unitățile';
$ec_lang['lpn_quality_chemical_name_tip']='Substanța chimică pe care o urmăriți, de exemplu Clor. Lăsați necompletat pentru eticheta implicită proprie a EPANET, Chemical. Apare în rapoartele dumneavoastră, dar nu este utilizată în calcule.';
$ec_lang['lpn_quality_mass_units']='Unități de masă';
$ec_lang['lpn_quality_mass_units_tip']='Jumătatea de unități a intrării de calitate, cele două opțiuni proprii ale EPANET.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Toleranță de calitate';
$ec_lang['lpn_quality_tolerance_tip']='Cât de mult pot diferi în concentrație două parcele de apă alăturate înainte ca EPANET să le trateze ca una singură. Necompletat folosește valoarea implicită proprie a EPANET, 0,01.';
$ec_lang['lpn_quality_diffusivity']='Difuzivitate relativă';
$ec_lang['lpn_quality_diffusivity_tip']='Cât de ușor se răspândește substanța chimică prin apă, relativ la clor. Necompletat folosește valoarea implicită proprie a EPANET, 1,0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Concentrație {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Concentrație medie {chemical}';
$ec_lang['lpn_quality_initial']='Calitate inițială';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Cât de multă substanță chimică deține acest nod la începutul rulării. Un rezervor își păstrează propria valoare pe toată durata rulării, așa cum este de obicei exprimat reziduul la ieșirea dintr-o stație de tratare. Lăsați-l gol și nodul pornește fără nicio urmă de substanță chimică.';
$ec_lang['lpn_result_concentration']='Concentrație';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Cât de multă substanță chimică mai rămâne în acest punct după ce a călătorit și a reacționat. Unitățile sunt cele indicate lângă substanța chimică la Setări, Calitatea apei.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Tip de sursă';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Ce fel de doză aplică acest nod apei care trece prin el. Concentrația tratează apa care intră aici în rețea ca sosind la valoarea Calitate sursă. Doza de masă adaugă o masă de substanță chimică în fiecare minut, indiferent de debit. Doza cu valoare fixă ridică concentrația care iese din acest nod la valoarea Calitate sursă și nu mai mult. Doza proporțională cu debitul adaugă valoarea Calitate sursă la ceea ce se află deja în apă.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Niciuna';
$ec_lang['lpn_source_type_concen']='Concentrație';
$ec_lang['lpn_source_type_mass']='Doză de masă';
$ec_lang['lpn_source_type_setpoint']='Doză cu valoare fixă';
$ec_lang['lpn_source_type_flowpaced']='Doză proporțională cu debitul';
$ec_lang['lpn_source_quality']='Calitate sursă';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Cât de puternică este doza. Pentru fiecare tip, în afară de doza de masă, aceasta este o concentrație, în unitățile indicate lângă substanța chimică la Setări, Calitatea apei; pentru o doză de masă este o masă de substanță chimică pe minut. Lăsați-l gol și nimic nu este adăugat aici, ceea ce nu este același lucru cu zero: un zero înseamnă o alimentare care funcționează și nu adaugă nimic.';
$ec_lang['lpn_source_pattern']='Model sursă';
$ec_lang['lpn_source_pattern_tip']='Un model temporal care scalează doza pe parcursul rulării, pentru o alimentare care nu este constantă. Fără model înseamnă că doza este aceeași la fiecare pas.';
$ec_lang['lpn_mixing_model']='Model de amestecare';
$ec_lang['lpn_mixing_model_tip']='Cum se amestecă apa deja aflată în acest bazin cu apa care intră. Amestecarea completă agită tot bazinul deodată. Amestecarea în două compartimente umple mai întâi o zonă de admisie și trece restul mai departe. Curgerea de tip FIFO deplasează apa în ordinea în care a sosit. Curgerea de tip LIFO o stivuiește, deci ultima apă intrată este prima ieșită. Alegerea schimbă vârsta apei și reziduul, dar nu schimbă nicio presiune sau niciun debit.';
$ec_lang['lpn_mixing_mixed']='Amestecare completă';
$ec_lang['lpn_mixing_2comp']='Amestecare în două compartimente';
$ec_lang['lpn_mixing_fifo']='Curgere de tip FIFO';
$ec_lang['lpn_mixing_lifo']='Curgere de tip LIFO';
$ec_lang['lpn_mixing_fraction']='Fracție de amestecare';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Ponderea din volumul bazinului pe care o ocupă zona de admisie, între 0 și 1. Doar amestecarea în două compartimente o folosește. Lăsați-o goală și tot bazinul este zona de admisie, ceea ce presupune EPANET.';
$ec_lang['lpn_reaction_bulk']='Coeficient de reacție în masă';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Reacția din masa apei, folosită pentru orice conductă care nu are propriul coeficient. Un număr negativ descompune substanța chimică, iar unul pozitiv o mărește. Reacția este de ordinul întâi, cu excepția cazului în care un fișier EPANET importat precizează alt ordin, deci coeficientul este o rată în 1/zi. O casetă goală înseamnă nicio reacție în masă.';
$ec_lang['lpn_reaction_wall']='Coeficient de reacție la perete';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Reacția la peretele conductei, folosită pentru orice conductă care nu are propriul coeficient. Un număr negativ descompune substanța chimică. Reacția este de ordinul întâi, cu excepția cazului în care un fișier EPANET importat precizează alt ordin, deci coeficientul este o lungime pe zi, scrisă în unitatea de lungime a proiectului. O casetă goală înseamnă nicio reacție la perete.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Doar această conductă. Lăsați-o goală și conducta folosește coeficientul stabilit pentru întreaga rețea la Setări, Calitatea apei.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Coeficient de reacție';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Reacția din apa reținută în acest bazin, ca o rată în 1/zi. Un număr negativ descompune substanța chimică, iar unul pozitiv o mărește. Apa stă într-un bazin mult mai mult timp decât stă în orice conductă, deci aici se pierde adesea un reziduu. Lăsați-l gol și bazinul folosește coeficientul de reacție în masă stabilit pentru întreaga rețea la Setări, Calitatea apei.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Reacție în masă';
$ec_lang['lpn_reaction_wall_short']='Reacție la perete';
$ec_lang['lpn_reaction_tank_short']='Reacție';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/zi';
$ec_lang['lpn_reaction_day']='zi';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Ordinul reacției în masă';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='Exponentul la care este ridicată concentrația pentru reacția din corpul apei. Este permis orice număr real. 1 este valoarea implicită și este folosită pentru majoritatea modelărilor descompunerii clorului. 0 face ca rata să fie independentă de cantitatea de substanță chimică prezentă.';
$ec_lang['lpn_reaction_order_tank']='Ordinul reacției în bazin';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='Exponentul la care este ridicată concentrația pentru reacția din apa reținută într-un bazin, separat de ordinul reacției în masă, astfel încât un bazin poate reacționa la un ordin diferit de conducte. Este permis orice număr real, iar 1 este valoarea implicită. EPANET îl indică drept ORDER TANK într-un fișier și nu oferă o casetă pentru el în propria interfață.';
$ec_lang['lpn_reaction_order_wall']='Ordinul reacției la perete';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 înseamnă că reacția la perete are loc conform coeficientului (coeficienților) dat(i). 0 înseamnă că nu are loc. Acesta este un comutator pornit-oprit. Valoarea implicită este 1.';
$ec_lang['lpn_reaction_order_unstated']='Nespecificat';
$ec_lang['lpn_reaction_order_zero']='0, ordin zero';
$ec_lang['lpn_reaction_order_first']='1, ordinul întâi';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Potențial limitativ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='O concentrație spre care se îndreaptă substanța chimică în loc să se descompună până la nimic sau să crească fără limită. Reacția încetinește pe măsură ce apa se apropie de aceasta și se oprește acolo. Folosiți unități consecvente. Fără limită dacă este necompletat.';
$ec_lang['lpn_reaction_rough_corr']='Corelație cu rugozitatea';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Corelează reacția la perete cu rugozitatea proprie a fiecărei conducte, astfel încât o conductă mai rugoasă reacționează mai repede. Când este activată, un coeficient de perete este calculat pentru fiecare conductă din rugozitatea acelei conducte, iar coeficientul unic de perete de mai sus nu mai este folosit. Nu este folosit dacă este necompletat.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Această pagină nu oferă niciun coeficient de reacție propriu. Nu există un test standard pentru unul, iar valorile de teren publicate pentru același tip de apă diferă cu un factor de zece, deci un număr furnizat aici ar fi citit ca o recomandare. Introduceți unul pe care l-ați măsurat sau pe care îl puteți cita, sau lăsați casetele goale pentru o substanță chimică ce nu reacționează.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Energie';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Rapoarte';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_epanet']='Rulare EPANET';
$ec_lang['lpn_energy_title']='Raport de energie a pompelor';
$ec_lang['lpn_energy_menu']='Energie pompe';
$ec_lang['lpn_energy_efficiency']='Eficiența pompei (procent)';
$ec_lang['lpn_energy_efficiency_tip']='Eficiența globală (de la rețeaua electrică la apă) folosită pentru orice pompă care nu are propria curbă de eficiență. EPANET folosește 75 la sută atunci când nu se precizează nimic.';
$ec_lang['lpn_energy_price']='Prețul energiei';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Cât costă un kilowatt-oră. Se aplică oricărei pompe care nu are propriul preț. Lăsați-l gol și fiecare cost din raport este zero.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Cât costă un kilowatt-oră la această pompă. Lăsați-l gol și pompa plătește prețul stabilit pentru întreaga rețea la Setări, Energie.';
$ec_lang['lpn_energy_price_pattern']='Model de preț';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Un model care multiplică prețul la fiecare pas al modelului, așa se precizează un tarif redus în afara orelor de vârf. Lăsați-l gol pentru un preț constant pe toată rularea.';
$ec_lang['lpn_energy_demand_charge']='Tarif de vârf de sarcină';
$ec_lang['lpn_energy_demand_charge_tip']='Cât percepe furnizorul pe kW pentru sarcina de vârf cerută de pompele din sistem.';
$ec_lang['lpn_energy_currency']='Monedă';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Orice scrieți aici este tipărit lângă fiecare valoare bănească. Este o etichetă. Prețurile și costurile nu sunt niciodată convertite, deci scrieți prețurile în moneda pe care ați scris-o aici.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Această pagină nu oferă niciun preț propriu. Cât costă energia depinde de furnizor, de țară, de oră și de an, deci un număr furnizat aici ar fi citit ca o recomandare. Introduceți prețul din propriul dvs. tarif.';
$ec_lang['lpn_energy_needs_run']='Energia pompelor este puterea integrată pe durata rulării, deci are nevoie de o simulare pe o perioadă extinsă: motorul EPANET și o durată totală de rulare. Stabiliți o Durată totală de rulare la Setări, Calcul, Timp, apăsați butonul Calculează, apoi deschideți Apă, Rapoarte, Energie pompe.';
$ec_lang['lpn_energy_no_pumps']='Această rețea nu are pompe, deci nu există niciun consum de putere.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Comparație scenarii';
$ec_lang['lpn_scncmp_menu_tip']='Rezolvă fiecare scenariu din acest proiect și le arată unul lângă altul: presiunea cea mai mică și viteza cea mai mare din fiecare.';
$ec_lang['lpn_scncmp_running']='Se rezolvă fiecare scenariu…';
$ec_lang['lpn_scncmp_empty']='Nu a fost desenat încă nimic, deci nu este nimic de rezolvat.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Viteză maximă';
$ec_lang['lpn_scncmp_at']='{value} la {id}';
$ec_lang['lpn_scncmp_current']='(deschis în prezent)';
$ec_lang['lpn_scncmp_note']='Fiecare scenariu este rezolvat dintr-o copie a desenului. Nimic de aici nu schimbă proiectul, iar scenariul în care lucrați rămâne așa cum era.';
$ec_lang['lpn_energy_over']='Pentru simularea pe o perioadă extinsă de {time}';
$ec_lang['lpn_energy_col_pump']='Pompă';
$ec_lang['lpn_energy_col_running']='% din rulare';
$ec_lang['lpn_energy_col_effic']='Efic.';
$ec_lang['lpn_energy_col_avg_kw']='kW med.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='Puterea medie folosită cât timp a funcționat această pompă. Nu este mediată pe perioadele de repaus, deci o pompă care a stat oprită în cea mai mare parte a simulării pe o perioadă extinsă raportează totuși puterea folosită cât timp a funcționat.';
$ec_lang['lpn_energy_col_peak_kw']='kW de vârf';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Costul';
$ec_lang['lpn_energy_total_kwh']='Energie consumată';
$ec_lang['lpn_energy_total_energy_cost']='Costul energiei';
$ec_lang['lpn_energy_peak_kw']='Consum de putere de vârf';
$ec_lang['lpn_energy_total_demand_charge']='Costul de vârf de sarcină';
$ec_lang['lpn_energy_total_cost']='Cost total';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Stare';
$ec_lang['lpn_reports_status_tip']='Ce s-a schimbat pe parcursul ultimei simulări pe perioadă extinsă, în ordine cronologică: pompe și vane care se deschid sau se închid, bazine care se umplu, se golesc, se umplu complet sau rămân fără apă, și pași care nu au convers complet.';
$ec_lang['lpn_status_title']='Raport de stare';
$ec_lang['lpn_status_needs_run']='Raportul de stare listează ce s-a schimbat pe parcursul unei simulări pe perioadă extinsă. Stabiliți o Durată totală de rulare la Setări, Calcul, Timp, apăsați Calculează, apoi deschideți Apă, Rapoarte, Raport de stare.';
$ec_lang['lpn_status_empty']='Nimic nu și-a schimbat starea în această rulare.';
$ec_lang['lpn_status_col_event']='Eveniment';
$ec_lang['lpn_status_opened']='{type} {id} s-a deschis acum';
$ec_lang['lpn_status_closed']='{type} {id} s-a închis acum';
$ec_lang['lpn_status_filling']='{type} {id} se umple acum';
$ec_lang['lpn_status_emptying']='{type} {id} se golește acum';
$ec_lang['lpn_status_full']='{type} {id} s-a umplut acum';
$ec_lang['lpn_status_dry']='{type} {id} s-a golit acum';
$ec_lang['lpn_status_no_converge']='Soluția hidraulică la acest pas nu a convers complet; numerele afișate sunt din ultima sa iterație.';
$ec_lang['lpn_status_note']='Citit din aceeași rulare pe perioadă extinsă ca panoul Tabele și Raportul complet. Este listată doar o schimbare, nu fiecare pas.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Complet';
$ec_lang['lpn_reports_full_tip']='Fiecare nod și fiecare legătură la fiecare pas de raportare al ultimei rulări, ca un singur tabel pe care îl puteți descărca sau tipări.';
$ec_lang['lpn_full_title']='Raport complet';
$ec_lang['lpn_full_needs_run']='Raportul complet listează fiecare nod și fiecare legătură la fiecare pas de raportare. Apăsați Calculează, apoi deschideți Apă, Rapoarte, Raport complet.';
$ec_lang['lpn_full_note']='Un rând per nod sau legătură per pas de raportare, în unitățile arătate în panoul Tabele. O celulă goală este o coloană pe care acea mărime nu o are. Descărcarea sau tipărirea cuprinde fiecare pas de timp; tabelul de mai jos arată câte unul pe rând.';
$ec_lang['lpn_full_step_label']='Pas de timp';
$ec_lang['lpn_full_download_csv']='Descarcă CSV';
$ec_lang['lpn_full_print']='Tipărește raportul';
$ec_lang['lpn_full_col_time']='Timp';
$ec_lang['lpn_full_col_type']='Tip';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} rânduri.';
$ec_lang['lpn_energy_no_price']='Nu este precizat niciun preț al energiei, deci fiecare cost de aici este zero. Stabiliți unul la Setări, Energie.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Această rețea precizează un preț de zero, deci fiecare cost de aici este zero. Schimbați-l la Setări, Energie.';
$ec_lang['lpn_energy_curve_note']='Aceste pompe indică o curbă de eficiență fără puncte: {ids}. Au funcționat la eficiența stabilită pentru întreaga rețea.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_rank']='Rang';
$ec_lang['lpn_labels_col_drop']='Omis';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Nod și legătură';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Interval egal';
$ec_lang['lpn_color_mode_quantile']='Cuantile (număr egal)';
$ec_lang['lpn_color_mode_jenks']='Praguri naturale (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Deviație standard';
$ec_lang['lpn_color_mode_pretty']='Frumos (rotunjit)';
$ec_lang['lpn_color_mode_log']='Logaritmic';
$ec_lang['lpn_color_mode_manual']='Manual';

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
$ec_lang['lpn_library_menu']='Biblioteci';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Modele';
$ec_lang['lpn_library_patterns_tip']='Un model este o listă de multiplicatori care se repetă. Fiecare se aplică pentru un pas de timp al modelului, deci 24 de numere cu un pas de o oră alcătuiesc o zi care se repetă. O cerință de 10 cu un multiplicator de 1,5 este 15 în acel moment.';
$ec_lang['lpn_library_curves']='Curbe';
$ec_lang['lpn_library_curves_tip']='O curbă este o listă de puncte care arată cum se comportă ceva: câtă sarcină adaugă o pompă la fiecare debit, cât de eficientă este la acel debit, sau câtă sarcină pierde o vană la fiecare debit.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Curbele sunt atașate pompelor și vanelor. Pentru o curbă de sarcină a pompei, rularea folosește o curbă ajustată prin puncte, așa cum este arătată; pentru orice alt tip, punctele sunt unite prin segmente drepte, așa cum sunt arătate.';
$ec_lang['lpn_library_curve_add']='Adaugă o curbă';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Tip de curbă';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Ecuație';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='Curba ajustată prin puncte și linia desenată pe graficul de mai jos. Este calculată din puncte de fiecare dată când este afișată și nu este niciodată stocată, iar numerele ei sunt în unitățile arătate de tabelul de mai sus. Rezolvitorul intern rulează pe această ecuație; motorul EPANET citește chiar punctele.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Selectați una sau două coloane dintr-un tabel de calcul, copiați-le și lipiți-le în prima celulă în care doriți să ajungă. Rândurile sunt adăugate pe măsură ce sunt necesare. Puteți lipi și linii copiate direct dintr-un fișier EPANET, inclusiv numele curbei.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Descriere';
$ec_lang['lpn_library_curve_remove_point']='Elimină acest punct';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Copiază punctele';
$ec_lang['lpn_library_curve_copy_tip']='Copiază fiecare punct ca două coloane, gata de lipit într-un tabel de calcul.';
$ec_lang['lpn_library_curve_copy_manual']='Copiază aceste puncte';
$ec_lang['lpn_library_curve_used_by']='Elemente care folosesc această curbă';
$ec_lang['lpn_library_curve_unused']='Nimic nu folosește această curbă.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Această curbă este folosită de {count} elemente: {ids}. Îndreptați-le mai întâi spre altă curbă, apoi ștergeți-o pe aceasta.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Tipuri de conductă';
$ec_lang['lpn_library_pipetypes_tip']='Un tip de conductă este o definiție la care se pot referi mai multe conducte pentru diametrul, rugozitatea și coeficienții de reacție ai lor. Editarea definiției editează fiecare conductă care o folosește.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Fiecare proiect are propria bibliotecă de tipuri de conductă. Puteți lăsa proprietăți necompletate într-o definiție de tip de conductă. De exemplu, un tip de conductă care specifică o rugozitate și niciun diametru este în regulă. Atașați tipurile de conductă la conducte în editorul lor de proprietăți. Editarea unei definiții aici modifică fiecare conductă care o referențiază.';
$ec_lang['lpn_library_pipetype_add']='Adaugă un tip de conductă';
$ec_lang['lpn_library_pipetype_blank_tip']='Proprietățile necompletate dintr-o definiție de tip de conductă sunt lăsate să fie introduse individual pentru fiecare conductă.';
$ec_lang['lpn_library_pipetype_used_by']='Conducte care folosesc acest tip';
$ec_lang['lpn_library_pipetype_unused']='Nimic nu folosește acest tip de conductă.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Acest tip de conductă este folosit de {count} conducte: {ids}. Detașați-l de acestea înainte de a-l șterge.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Tip de conductă';
$ec_lang['lpn_field_pipetype_tip']='Tipul de conductă din biblioteca proiectului pe care îl folosește această conductă. Proprietățile incluse în tipul de conductă sunt dezactivate pentru editare aici. Detașați tipul de conductă pentru a activa editarea aici.';
$ec_lang['lpn_pipetype_none']='Niciun tip de conductă selectat';
$ec_lang['lpn_pipetype_detach']='Detașează de tipul de conductă';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Copiază valorile pe care această conductă le citește din tipul ei direct în conductă și încetează să mai folosească tipul. Valorile conductei nu se schimbă acum, iar de acum înainte le puteți edita aici.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Fitinguri';
$ec_lang['lpn_library_fittings_tip']='O listă de fitinguri este un set de fitinguri și cantitățile lor la care se pot referi mai multe conducte. Aceasta se însumează într-un singur coeficient de pierdere locală.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Fiecare proiect are propria bibliotecă de fitinguri. O listă de fitinguri conține fitinguri cu o cantitate pentru fiecare, iar aceasta se însumează într-un singur coeficient de pierdere locală. Atât conductele, cât și tipurile de conductă se pot referi la o listă.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Fitingurile oferite aici sunt cele treisprezece din Tabelul 3.3 al manualului utilizatorului EPANET 2.2. Alegerea unuia îi copiază coeficientul în rând, unde îl puteți modifica. Un coeficient depinde de dimensiunea și marca fitingului, deci tratați tabelul ca pe un punct de plecare, nu ca pe un răspuns.';
$ec_lang['lpn_library_fittings_add']='Adaugă o listă de fitinguri';
$ec_lang['lpn_library_fittings_used_by']='Conducte care folosesc această listă de fitinguri';
$ec_lang['lpn_library_fittings_unused']='Nimic nu folosește această listă de fitinguri.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Această listă de fitinguri este folosită de {count} conducte: {ids}. Detașați-o de acestea înainte de a o șterge.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Importă biblioteci…';
$ec_lang['lpn_library_import_tip']='Alegeți un alt fișier proiect și copiați biblioteci întregi din el în acest proiect. Tot ce are deja un nume folosit aici este omis și listat, deci nimic din ce aveți deja nu se schimbă.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Alegeți ce să copiați din {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Fiecare bibliotecă bifată este copiată integral. Ștergeți ulterior ce nu doriți, în același fel în care ștergeți orice altă intrare.';
$ec_lang['lpn_library_import_go']='Importă';
$ec_lang['lpn_library_import_no_libraries']='Acel fișier proiect nu are nicio bibliotecă de copiat.';
$ec_lang['lpn_library_import_heading']='Importat din {file}';
$ec_lang['lpn_library_import_added']='Copiate: {names}';
$ec_lang['lpn_library_import_conflict']='Omise, pentru că acest proiect are deja una cu același nume: {names}. Nimic de aici nu a fost schimbat. Redenumiți una dintre ele și importați din nou dacă le doriți pe amândouă.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Acel fișier proiect nu are niciuna dintre acestea de copiat.';
$ec_lang['lpn_library_import_curve_shape']='Aceste curbe au fost preluate exact așa cum le-a scris fișierul, iar o rulare nu poate folosi una dintre ele până când prima ei coloană crește de la un punct la următorul: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Aceste tipuri de conducte se referă la o listă de fitinguri pe care acest proiect nu o are: {names}. Importați biblioteca de fitinguri din același fișier și o vor găsi.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Avertisment: Neconcordanță de unități. Va fi importat ca atare. Nerecomandat.';
$ec_lang['lpn_library_import_units_line']='{name}: acest proiect arată {mine}, fișierul arată {theirs}.';
$ec_lang['lpn_fitting_qty']='Cantitate';
$ec_lang['lpn_fitting_name']='Fiting';
$ec_lang['lpn_fitting_k']='Coeficient';
$ec_lang['lpn_fitting_add']='Adaugă un fiting';
$ec_lang['lpn_fitting_remove']='Elimină';
$ec_lang['lpn_fitting_total']='Coeficient total de pierdere locală (minoră), k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Listă de fitinguri';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='O listă de fitinguri din biblioteca proiectului. Cantitățile și coeficienții ei se însumează în coeficientul de pierdere locală al acestei conducte, iar caseta coeficientului devine apoi doar pentru citire. Lăsați aceasta neselectată pentru a introduce coeficientul dvs. înșivă.';
$ec_lang['lpn_fittings_none']='Nicio listă de fitinguri selectată';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Vană cu ventil (glob), complet deschisă';
$ec_lang['lpn_fitting_angle']='Vană de colț, complet deschisă';
$ec_lang['lpn_fitting_swingcheck']='Vană de reținere cu clapetă, complet deschisă';
$ec_lang['lpn_fitting_gate']='Vană cu sertar, complet deschisă';
$ec_lang['lpn_fitting_elbow_short']='Cot cu rază scurtă';
$ec_lang['lpn_fitting_elbow_medium']='Cot cu rază medie';
$ec_lang['lpn_fitting_elbow_long']='Cot cu rază lungă';
$ec_lang['lpn_fitting_elbow_45']='Cot de 45 de grade';
$ec_lang['lpn_fitting_return_bend']='Cot de întoarcere închis';
$ec_lang['lpn_fitting_tee_run']='Teu standard, curgere prin traseul drept';
$ec_lang['lpn_fitting_tee_branch']='Teu standard, curgere prin ramificație';
$ec_lang['lpn_fitting_entrance']='Intrare cu muchie ascuțită';
$ec_lang['lpn_fitting_exit']='Ieșire';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Alt fiting';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='S-a salvat {file}';
$ec_lang['lpn_inp_export_flat_lead']='Fișierul EPANET exportat este echivalent numeric cu acest proiect. Dar nu are loc pentru următoarele lucruri:';
$ec_lang['lpn_inp_export_flat_types']='{n} conducte de aici se referă la {t} tipuri de conductă. În fișier, fiecare dintre acele conducte poartă propria copie a numerelor, deci răspunsurile sunt aceleași. Ce nu poate reține fișierul este tipul de conductă în sine, deci editarea unei definiții cu urmarea ei de către fiecare conductă este ceva ce doar propriul dvs. fișier de proiect înregistrează.';
$ec_lang['lpn_inp_export_flat_coords']='Un fișier EPANET păstrează o singură poziție pentru fiecare nod. Acest scenariu plasează {n} dintre ele în altă parte, iar acestea sunt pozițiile din fișier. Fiecare alt scenariu își păstrează propriile poziții doar în fișierul dvs. de proiect.';
$ec_lang['lpn_inp_export_flat_fittings']='Un fișier EPANET nu poate reține lista de coturi, vane și teuri din fișierul dvs. de proiect. Coeficientul de pierdere locală al {n} conducte de aici este însumat dintr-o listă de fitinguri. Totalul intră în fișier exact așa cum este, deci nimic din răspunsuri nu se schimbă.';
$ec_lang['lpn_library_controls']='Comenzi';
$ec_lang['lpn_library_controls_tip']='O comandă este o propoziție care deschide sau închide o legătură, sau îi dă o setare, atunci când un nivel de apă, o presiune sau un moment de timp o cere.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Adaugă un model';
$ec_lang['lpn_library_pattern_values']='Multiplicatori';
$ec_lang['lpn_library_pattern_values_tip']='Multiplicatorii, separați prin spații sau virgule. Lipiți o coloană dintr-un tabel de calcul dacă aveți una. Lista se repetă cât durează rularea, deci nu trebuie să acopere întreaga rulare.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} multiplicatori, la {step} distanță, acoperind {span}';
$ec_lang['lpn_library_pattern_none']='Niciun model';
$ec_lang['lpn_settings_default_pattern']='Model implicit de cerință';
$ec_lang['lpn_settings_default_pattern_tip']='Fiecare joncțiune fără model folosește acesta.';
$ec_lang['lpn_library_control_add']='Adaugă o comandă';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='O propoziție, cu cuvintele folosite de EPANET. Patru forme: LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1, și LINK 12 CLOSED AT CLOCKTIME 3 AM. În loc de OPEN sau CLOSED puteți scrie un număr, care este o setare de vană sau o turație de pompă. Lăsați cuvintele-cheie în engleză; acestea sunt cele pe care le citește pagina.';
$ec_lang['lpn_library_control_ok']='✓ Înțeleasă';
$ec_lang['lpn_library_control_bad']='⚠ Neînțeleasă';
$ec_lang['lpn_library_control_missing']='⚠ Această rețea nu are nimic numit {id}';
$ec_lang['lpn_library_rules']='Reguli';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='O regulă este un scurt paragraf care deschide sau închide o legătură, sau îi dă o setare, atunci când un nivel de apă, o presiune, un debit sau un timp ajunge la o valoare pe care ați stabilit-o. Regulile pot testa mai multe lucruri deodată și pot spune ce trebuie făcut atunci când testul eșuează.';
$ec_lang['lpn_library_rule_add']='Adaugă o regulă';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='O regulă, în cuvintele folosite de EPANET, o clauză pe linie. Prima linie o numește: RULE 1. Apoi o condiție: IF TANK 2 LEVEL BELOW 17.1. Apoi ce trebuie făcut: THEN PUMP 9 STATUS IS OPEN. O ultimă linie îi poate stabili rangul: PRIORITY 1. Adăugați linii AND sau OR pentru a testa mai multe lucruri, și linii ELSE pentru a spune ce trebuie făcut atunci când testul eșuează. O condiție poate citi LEVEL, HEAD, GRADE, PRESSURE sau DEMAND pe un nod, FLOW, STATUS sau SETTING pe o legătură, sau TIME și CLOCKTIME pe SYSTEM. Scrieți numerele în unitățile pe care le arată acest proiect; sunt convertite pentru dvs. Lăsați cuvintele cheie în engleză; sunt cele pe care le citesc pagina și EPANET.';
$ec_lang['lpn_library_rule_ok']='✓ Această regulă a fost citită';
$ec_lang['lpn_library_rule_bad']='⚠ Această regulă nu a putut fi citită';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Cerință de bază';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Debitul pe care îl preia acest nod la pasul de timp afișat: fiecare cerință de bază înmulțită cu propriul ei model, adunate. Este calculat, nu introdus, deci se schimbă odată cu ceasul și nu poate fi editat.';
$ec_lang['lpn_field_demand_pattern']='Model de cerință';
$ec_lang['lpn_field_demand_pattern_tip']='Cum crește și scade cerința acestei joncțiuni pe parcursul rulării. Lăsați-l la Niciun model și joncțiunea urmează în schimb Modelul implicit al proiectului.';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Descriere';
$ec_lang['lpn_demand_add']='Adaugă categorie de cerință';
$ec_lang['lpn_demand_remove']='Elimină această cerință';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Model de sarcină';
$ec_lang['lpn_field_head_pattern_tip']='Cum urcă și coboară nivelul de apă al acestui rezervor de-a lungul rulării. Sarcina de mai sus este înmulțită cu modelul.';
$ec_lang['lpn_field_pump_speed']='Turație relativă';
$ec_lang['lpn_field_pump_speed_tip']='1 înseamnă că această pompă se învârte la turația la care i-a fost măsurată curba. 0,9 înseamnă aceeași pompă învârtindu-se mai încet, ceea ce scade sarcina pe care o adaugă și debitul pe care îl trece. Un model de turație ia locul acestui număr cât timp rulează.';
$ec_lang['lpn_field_speed_pattern']='Model de turație';
$ec_lang['lpn_field_speed_pattern_tip']='Cum urcă și coboară turația acestei pompe pe parcursul rulării. Fiecare multiplicator este turația relativă pentru acea parte a rulării și înlocuiește setarea Turație, nu o scalează, deci un multiplicator de 0 oprește pompa.';

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
$ec_lang['lpn_search_menu']='Căutați un loc după nume…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Găsiți un oraș, o stradă sau un reper după nume și mutați harta acolo. La prima utilizare vi se cere permisiunea, deoarece cuvintele pe care le introduceți ajung la serviciul de nume de locuri al OpenStreetMap.';
$ec_lang['lpn_search_bar']='Căutați după nume…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Căutarea după numele locului trimite cuvintele pe care le introduceți către nominatim.openstreetmap.org, serviciul gratuit de nume de locuri al OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Acesta este un serviciu diferit de imaginile hărții stradale din spatele proiectului dvs. Imaginile arată doar unde priviți. O căutare arată ce ați scris. Serviciul de nume de locuri va primi cuvintele dvs. de căutare și adresa dvs. IP. Nu trimitem nimic altceva și nu păstrăm nicio evidență a căutărilor dvs.';
$ec_lang['lpn_search_consent_3']='Ne permiteți să trimitem căutările dvs. către serviciul de nume de locuri?';
$ec_lang['lpn_search_consent_4']='Dacă răspundeți nu, totul altceva de pe această pagină continuă să funcționeze exact ca acum, inclusiv Mergi la o latitudine și o longitudine. Reținem un da, pentru a nu mai fi nevoie să întrebăm din nou. Un nu nu este stocat deloc.';
$ec_lang['lpn_search_refused']='Căutarea după numele locului este dezactivată și nu s-a trimis nimic. Puteți folosi în continuare Mergi la o latitudine și o longitudine.';
$ec_lang['lpn_search_prompt']='Căutați un loc după nume. Un oraș, o stradă, un reper — de exemplu: Petaluma, California';
$ec_lang['lpn_search_empty']='Introduceți numele unui loc de căutat.';
$ec_lang['lpn_search_working']='Se caută…';
$ec_lang['lpn_search_busy']='O căutare este deja în curs. Așteptați răspunsul.';
$ec_lang['lpn_search_choose']='Mai multe locuri se potrivesc. Care dintre ele?';
$ec_lang['lpn_search_nochoice']='Nimic nu a fost ales, deci harta nu s-a mutat.';
$ec_lang['lpn_search_badchoice']='Acesta nu este unul dintre numerele din listă.';
$ec_lang['lpn_search_none']='Nu s-a găsit nimic pentru acest nume.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Serviciul de nume de locuri ne cere să încetinim. Așteptați un minut și încercați din nou.';
$ec_lang['lpn_search_http']='Serviciul de nume de locuri a răspuns cu o eroare.';
$ec_lang['lpn_search_timeout']='Serviciul de nume de locuri nu a răspuns la timp. Tot restul acestei pagini funcționează fără el.';
$ec_lang['lpn_search_unreadable']='Serviciul de nume de locuri a răspuns cu ceva ce această pagină nu a putut citi.';
$ec_lang['lpn_search_offline']='Nu am putut contacta serviciul de nume de locuri. Este posibil să fiți offline. Tot restul acestei pagini funcționează fără el, inclusiv Mergi la o latitudine și o longitudine.';
$ec_lang['lpn_search_toofast']='O căutare pe secundă — atât permite serviciul de nume de locuri. Încercați din nou peste puțin timp.';
$ec_lang['lpn_search_nofetch']='Acest browser nu poate contacta serviciul de nume de locuri.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox asamblează aceasta din multe seturi de date publice de cotă, deci cât de bună este depinde în întregime de locul unde vă aflați. Acolo unde există o ridicare lidar națională, precum USGS 3DEP în cea mai mare parte a Statelor Unite și echivalentele ei în alte părți, poate fi mai precisă decât un metru pe orizontală și câteva zecimi de metru pe verticală. Acolo unde există doar date globale, este de circa 30 m pe orizontală și câțiva metri pe verticală. Mapbox nu ne spune pe care ați primit-o. Tratați-o ca pe o hartă cu curbe de nivel, nu ca pe o ridicare topografică: verificați tot ce contează pentru dvs.';
$ec_lang['lpn_terrain_consent_1']='Completarea cotelor trimite poziția fiecărui nod care are nevoie de una — latitudinea și longitudinea sa — către api.mapbox.com, pentru a afla înălțimea terenului acolo.';
$ec_lang['lpn_terrain_consent_2']='Aceasta este o întrebare diferită de imaginile hărții din spatele proiectului dvs. Imaginile arată doar unde priviți. Aceste poziții sunt chiar rețeaua dvs. Mapbox va primi acele coordonate și adresa dvs. IP. Nu trimitem nimic altceva: niciun nume, nicio conductă, niciun proiect. Nu păstrăm nicio evidență a acestui lucru, și nimic nu este stocat pe acest dispozitiv în afară de răspunsul dvs. la această întrebare.';
$ec_lang['lpn_terrain_consent_3']='Ne permiteți să trimitem pozițiile nodurilor dvs. către Mapbox?';
$ec_lang['lpn_terrain_consent_4']='Dacă răspundeți nu, totul altceva de pe această pagină continuă să funcționeze exact ca acum, iar dvs. puteți introduce cotele singur ca înainte. Reținem un da, pentru a nu mai fi nevoie să întrebăm din nou. Un nu nu este stocat deloc.';
$ec_lang['lpn_terrain_refused']='Cotele nu au fost completate și nu s-a trimis nimic. Le puteți introduce ca înainte.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Completați cota a {n} nod(uri) din Mapbox DEM?';
$ec_lang['lpn_terrain_confirm_default_1']='Fiecare nod are deja o cotă, iar {n} dintre ele sunt încă la {v}, care este cota cu care începe un nod nou, nu una introdusă de dvs.';
$ec_lang['lpn_terrain_confirm_default_2']='Înlocuiți cota acelor {n} noduri cu valori din Mapbox DEM?';
$ec_lang['lpn_terrain_keep']='{k} noduri au deja o cotă și nu vor fi atinse.';
$ec_lang['lpn_terrain_undo']='Un singur Undo (Ctrl-Z) le readuce pe toate.';
$ec_lang['lpn_terrain_requests']='{n} cereri către api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Cotele sunt deja în curs de completare. Așteptați.';
$ec_lang['lpn_terrain_offmap']='Aceste poziții de noduri nu se află pe harta de teren, deci nu s-a trimis nimic.';
$ec_lang['lpn_terrain_too_wide']='Aceste noduri sunt răspândite pe o suprafață prea mare a Pământului pentru a fi citite dintr-o dată ({n} cereri de dale). Nu s-a trimis nimic.';
$ec_lang['lpn_terrain_cancelled']='Nimic nu a fost schimbat și nimic nu a fost trimis.';
$ec_lang['lpn_terrain_nofetch']='Acest browser nu poate contacta serviciul de teren.';
$ec_lang['lpn_terrain_working']='Se citește suprafața terenului…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Serviciul de teren a refuzat cererea ({status}), deci nicio cotă nu a fost modificată. Este posibil ca tokenul Mapbox folosit de acest site să nu permită adresa web pe care vă aflați.';
$ec_lang['lpn_terrain_failed']='Nu am putut contacta serviciul de teren, deci nicio cotă nu a fost schimbată. Este posibil să fiți offline. Tot restul acestei pagini funcționează fără el.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Serviciul de teren ne cere să încetinim (429), deci nicio cotă nu a fost schimbată. Încercați din nou peste un minut.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Serviciul de teren a răspuns cu o eroare ({status}), deci nicio cotă nu a fost schimbată. Nimic nu este în neregulă cu rețeaua dvs.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Niciunul dintre acele noduri nu are o poziție pe Pământ, deci nu s-a trimis nimic și nicio cotă nu a fost schimbată. Citirea suprafeței terenului necesită un proiect în latitudine și longitudine, sau unul pe o proiecție pe care această pagină o poate plasa.';
$ec_lang['lpn_terrain_done']='{n} cote completate.';
$ec_lang['lpn_terrain_missed']='{m} nu au putut fi citite și sunt încă necompletate.';
$ec_lang['lpn_terrain_partial']='{f} dale de teren nu au răspuns.';
$ec_lang['lpn_terrain_will_ids']='Aceste noduri vor primi o cotă: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Acele noduri sunt: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Aceste noduri au primit o cotă: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Aceste noduri încă nu au nicio cotă: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, și încă {n}';

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
$ec_lang['lpn_ff_menu']='Analiza debitului de incendiu…';
$ec_lang['lpn_ff_menu_tip']='Testați joncțiunile pe rând: cât poate livra fiecare menținând totuși presiunea reziduală pe care ați stabilit-o, și dacă preluarea debitului necesar acolo scoate altceva din limite?';
$ec_lang['lpn_ff_title']='Analiza debitului de incendiu';
$ec_lang['lpn_ff_intro']='Fiecărei joncțiuni, pe rând, i se cere să preia un debit de incendiu peste cerința pe care o are deja. Nimic din proiectul dvs. nu este schimbat; toată rularea se face pe o copie.';
$ec_lang['lpn_ff_scope']='Joncțiuni de testat';
$ec_lang['lpn_ff_scope_tip']='Alegeți setul înainte de a rula. Testarea fiecărei joncțiuni dintr-un sistem mare poate dura minute.';
$ec_lang['lpn_ff_all']='Toate';
$ec_lang['lpn_ff_selected']='Selectate';
$ec_lang['lpn_ff_no_junctions']='Acest proiect nu are încă nicio joncțiune, deci nu este nimic de testat.';
$ec_lang['lpn_ff_no_selection']='Nicio joncțiune nu este selectată. Selectați joncțiuni sau alegeți opțiunea Toate.';
$ec_lang['lpn_ff_skipped']='{n} elemente selectate nu sunt joncțiuni, deci nu au fost testate.';
$ec_lang['lpn_ff_required']='Debit de incendiu necesar';
$ec_lang['lpn_ff_required_tip']='Debitul pe care codul dvs. de incendiu sau autoritatea dvs. pentru incendii îl cere la un hidrant. Fiecare joncțiune este testată față de acest număr, dacă nu are propriul ei debit de incendiu necesar.';
$ec_lang['lpn_ff_required_own']='Joncțiunile care au propriul lor debit de incendiu necesar sunt testate față de acela în schimb. Numărul lor: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Debitul de incendiu necesar la această joncțiune anume, pentru destinația terenului pe care îl deservește, conform normativului dvs. de incendiu sau autorității competente. Lăsați-l gol și joncțiunea este testată față de numărul din caseta Analiza debitului de incendiu.';
$ec_lang['lpn_ff_residual']='Presiune reziduală de menținut';
$ec_lang['lpn_ff_residual_tip']='Presiunea pe care joncțiunea trebuie să o mențină în continuare în timp ce livrează debitul de incendiu. AWWA M31 și NFPA 291 folosesc 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Verificare de proiectare (efect asupra sistemului)';
$ec_lang['lpn_ff_design_tip']='O întrebare separată de dacă joncțiunea poate livra debitul: cu acel debit preluat acolo, scade altceva sub presiunea sa minimă sau depășește limita sa de viteză? Alegerea de a verifica aceasta nu costă niciun calcul suplimentar.';
$ec_lang['lpn_ff_design_no_selection']='Domeniul verificării de proiectare este setat pe Selectate, dar niciun element nu este selectat. Selectați elemente sau selectați opțiunea Toate.';
$ec_lang['lpn_ff_minpressure']='Cea mai mică presiune permisă în altă parte';
$ec_lang['lpn_ff_minpressure_tip']='O joncțiune care scade sub aceasta în timp ce alta își preia debitul de incendiu este raportată ca o problemă de proiectare.';
$ec_lang['lpn_ff_maxvelocity']='Cea mai mare viteză permisă';
$ec_lang['lpn_ff_maxvelocity_tip']='O conductă care depășește aceasta în timp ce se preia un debit de incendiu este raportată ca o problemă de proiectare.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Debitul de incendiu este preluat chiar la joncțiune. Aceasta este metoda folosită aici, și este cea obișnuită. Hidrantul, conducta lui laterală și ajutajul lui nu sunt modelate, deci un hidrant real livrează mai puțin decât debitul arătat aici.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Este folosit rezolvitorul intern.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Este folosit motorul EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='Debitul de incendiu disponibil este o căutare, deci întreaga rețea este rezolvată de circa șaisprezece ori pentru fiecare joncțiune testată. Un sistem mare durează minute. Îl puteți opri oricând și păstra ce a fost deja calculat.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Este testat doar pasul de timp aflat acum pe ecran. Debitul de incendiu se testează în mod normal peste cerința zilei maxime, deci stabiliți rețeaua în acea condiție înainte de a rula.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Rulare debit de incendiu';
$ec_lang['lpn_ff_calculate']='Rulează';
$ec_lang['lpn_ff_stop']='Oprește';
$ec_lang['lpn_ff_working']='Se lucrează: {done} din {total} joncțiuni.';
$ec_lang['lpn_ff_stopped']='Oprit după {done} din {total} joncțiuni. Rezultatele de mai jos sunt cele deja terminate.';
$ec_lang['lpn_ff_cost']='Această rulare a rezolvat întreaga rețea de {solves} ori.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Desenul s-a schimbat, deci rezultatele debitului de incendiu au fost șterse. Rulați din nou.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Șterge inelele';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} joncțiuni nu au avut nimic greșit. {fire} joncțiuni au eșuat la debitul de incendiu. {design} joncțiuni au afectat restul sistemului.';
$ec_lang['lpn_ff_summary_error']='{n} joncțiuni nu au putut primi un răspuns.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Fiecare joncțiune testată';
$ec_lang['lpn_ff_col_junction']='Joncțiune';
$ec_lang['lpn_ff_col_static']='Presiune statică';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='Presiunea la această joncțiune înainte de a se prelua orice debit de incendiu, cu cerințele obișnuite ale sistemului încă în funcțiune. Nimic nu este oprit pentru a o măsura, deci aceasta nu este o presiune la debit zero pentru sistem; este aceeași presiune pe care harta o arată la această joncțiune. Atât AWWA M31, cât și NFPA 291 numesc această citire presiune statică, iar de aici pornește un test de debit de incendiu.';
$ec_lang['lpn_ff_col_available']='Debit disponibil';
$ec_lang['lpn_ff_col_required']='Debit necesar';
$ec_lang['lpn_ff_col_residual']='Reziduală menținută';
$ec_lang['lpn_ff_col_atrequired']='Presiune la debit necesar';
$ec_lang['lpn_ff_col_affected']='Cel mai grav efect';
$ec_lang['lpn_ff_col_limit']='Limită de proiectare';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Neverificat';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Statică eșuată, deci neverificat';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Moduri de eșec';
$ec_lang['lpn_ff_mode_fire']='Incendiu';
$ec_lang['lpn_ff_mode_design']='Proiectare';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Niciunul';
$ec_lang['lpn_ff_col_solves']='Rulări';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Presiune și viteză';
$ec_lang['lpn_ff_atleast']='mai mult de {flow}';
$ec_lang['lpn_ff_affect_node']='{id} scade la {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} ajunge la {velocity}';
$ec_lang['lpn_ff_more']='și încă {n} afectate';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='Încă {n} joncțiuni nu sunt afișate.';
$ec_lang['lpn_ff_design_none']='Nimic din setul ales nu a ieșit din limitele sale în timp ce vreo joncțiune și-a preluat debitul de incendiu.';
$ec_lang['lpn_ff_design_off_note']='Efectul asupra restului sistemului nu a fost verificat în această rulare.';
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
$ec_lang['lpn_ff_iso']='Insurance Services Office (ISO) creditează un singur hidrant cu cel mult {flow}. Această limită de credit nu a fost aplicată aici pentru că nu știm câți hidranți poate reprezenta un nod.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Deja sub presiunea reziduală înainte de a se prelua vreun debit de incendiu';
$ec_lang['lpn_ff_err_converge']='Rețeaua nu a convers.';
$ec_lang['lpn_ff_err_solve']='Rezolvitorul a raportat o eroare și nu a dat niciun răspuns.';
$ec_lang['lpn_ff_err_not_junction']='Nu este o joncțiune';
$ec_lang['lpn_ff_err_unknown']='Niciun răspuns. Codul raportat a fost {code}.';

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
$ec_lang['lpn_file_import_survey']='Importă puncte topografice…';
$ec_lang['lpn_file_import_survey_tip']='Citește o listă de puncte topografice dintr-un fișier text și creează câte o joncțiune la fiecare punct, preluând valorile implicite pentru elemente noi pentru tot ce fișierul nu precizează. Nu se desenează nicio conductă, iar niciun rând nu este vreodată omis fără a fi numit. Citește sistemul de coordonate pe care acest proiect îl folosește deja, georeferențiat sau nu.';
$ec_lang['lpn_survey_read_error']='Acel fișier nu a putut fi citit de pe disc.';
$ec_lang['lpn_survey_cancelled']='Nimic nu a fost creat și nimic nu a fost schimbat.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Nord';
$ec_lang['lpn_survey_axis_east']='Est';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Acel fișier nu conține nimic.';
$ec_lang['lpn_survey_err_unreadable']='Acel fișier nu a putut fi citit ca o listă de puncte topografice.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Mai multe coloane din acel fișier ar putea fi {axis} ({detail}), iar această pagină nu va alege între ele. Lăsați doar una dintre ele numită {axis} și încercați din nou.';
$ec_lang['lpn_survey_err_no_points']='Niciun rând din acel fișier nu a putut fi citit ca punct topografic. Rânduri citite: {detail}';
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
$ec_lang['lpn_survey_format_label']='Format fișier:';
$ec_lang['lpn_survey_format_internal']='specificat intern';
$ec_lang['lpn_survey_create']='Creează noduri';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='Prima linie a fost omisă: nu numește nicio coloană cunoscută de această pagină.';
$ec_lang['lpn_survey_type_label']='Tip element:';
$ec_lang['lpn_survey_confirm_junction']='{n} joncțiune(i) găsită(e). Continuați?';
$ec_lang['lpn_survey_confirm_reservoir']='{n} rezervor(oare) găsit(e). Continuați?';
$ec_lang['lpn_survey_confirm_tank']='{n} bazin(e) găsit(e). Continuați?';
$ec_lang['lpn_survey_report_junction']='{n} joncțiune(i) importată(e), {m} cu cotă.';
$ec_lang['lpn_survey_report_reservoir']='{n} rezervor(oare) importat(e), {m} cu cotă.';
$ec_lang['lpn_survey_report_tank']='{n} bazin(e) importat(e), {m} cu cotă.';
$ec_lang['lpn_survey_report_clean']='Fiecare punct din fișier a fost preluat, și nimic nu a fost schimbat la import.';
$ec_lang['lpn_survey_report_notes']='Erori și note de import:';
$ec_lang['lpn_survey_sev_error']='eroare';
$ec_lang['lpn_survey_sev_warning']='avertisment';
$ec_lang['lpn_survey_note_line']='Linia {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Prea puține coloane pentru formatul de fișier de mai sus.';
$ec_lang['lpn_survey_note_coord_missing']='Celula {axis} este goală.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} nu se citește ca număr.';
$ec_lang['lpn_survey_note_coord_range']='{axis} este în afara intervalului permis de acest proiect.';
$ec_lang['lpn_survey_note_bad_elev']='Cotă nenumerică. Importat fără cotă.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Mai multe coloane ar putea fi cota, deci niciuna dintre ele nu a fost citită.';
$ec_lang['lpn_survey_note_blank_rows']='Linii goale omise: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Nume deja folosit mai devreme în acest fișier, s-a atribuit un nume nou.';
$ec_lang['lpn_survey_note_id_taken']='Nume deja existent în proiect, s-a atribuit un nume nou.';
$ec_lang['lpn_survey_note_id_invalid']='Numele nu poate fi folosit aici, s-a atribuit un nume nou.';
$ec_lang['lpn_hotkeys_menu_heading']='Meniuri';
$ec_lang['lpn_hotkeys_menu_term']='Comenzi rapide de la tastatură pentru meniuri';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+literă</td><td>Deschide meniul cu acea literă, apoi apăsați litera unui rând pentru a-l alege. Literele se văd cât folosiți tastatura. Pe Mac, folosiți Ctrl+Option.</td></tr><tr><td>F10</td><td>Mergeți la bara de meniuri.</td></tr></tbody></table>';
$ec_lang['lpn_graphs_menu']='Grafice';
$ec_lang['lpn_contour_menu']='Contur';
$ec_lang['lpn_contour_tip']='Afișează pe hartă un grafic de contur: culorile nodurilor se întind de-a lungul și lângă conducte, cu curbe de nivel etichetate. Deschide o casetă pentru reglaj sau dezactivare.';
$ec_lang['lpn_contour_plot']='Grafic de contur';
$ec_lang['lpn_contour_fill']='Umplere';
$ec_lang['lpn_contour_fill_tip']='Neted amestecă culorile de la o clasă la alta. Benzi vopsește uniform fiecare clasă a cheii de culori.';
$ec_lang['lpn_contour_fill_smooth']='Neted';
$ec_lang['lpn_contour_fill_bands']='Benzi';
$ec_lang['lpn_contour_opacity']='Opacitatea umplerii';
$ec_lang['lpn_contour_lines']='Curbe de nivel';
$ec_lang['lpn_contour_interval']='Interval';
$ec_lang['lpn_contour_buffer']='Zonă tampon';
$ec_lang['lpn_contour_buffer_unit']='× lungimea mediană a conductelor';
$ec_lang['lpn_contour_buffer_tip']='Cât de departe ajunge culoarea de la fiecare conductă, ca multiplu al lungimii mediane a conductelor. Se estompează pe partea exterioară.';
$ec_lang['lpn_contour_few']='Prea puține noduri pentru a trasa conturul.';
$ec_lang['lpn_contour_support']='Grafic de contur: {n} noduri, interpolate de-a lungul a {p} conducte și până la de {k} ori lungimea mediană a conductelor lângă ele. Nicio culoare peste pompe, vane sau legături închise.';
$ec_lang['lpn_contour_support_lines']='Curbe de nivel la fiecare {i} {u}.';
$ec_lang['lpn_contour_too_many']='Prea multe curbe de nivel la acest interval; măriți intervalul pentru a le trasa.';
$ec_lang['lpn_contour_dem']='Terenul dintre noduri din Mapbox DEM';
$ec_lang['lpn_contour_dem_tip']='Între noduri, presiunea devine sarcina interpolată minus înălțimea terenului din Mapbox DEM, deci poate scădea sub cea mai mică presiune dintr-un nod pe un deal pe care rețeaua nu are niciun nod. Considerați terenul o hartă de curbe de nivel, nu o măsurătoare topografică.';
$ec_lang['lpn_contour_support_dem']='Între noduri, presiunea este sarcina interpolată minus cota terenului din Mapbox DEM, eșantionată aproximativ la fiecare {m} m.';
$ec_lang['lpn_contour_dem_failed']='Terenul nu a putut fi citit din Mapbox DEM, deci presiunea este interpolată doar între noduri.';
$ec_lang['lpn_contour_consent_1']='Trasarea presiunii peste teren trimite zona pe care o acoperă rețeaua dvs., sub forma numerelor de dale ale hărții Mapbox, către api.mapbox.com, pentru a afla înălțimea terenului de acolo.';
$ec_lang['lpn_contour_consent_2']='Aceasta este o întrebare diferită de imaginile hărții din spatele proiectului dvs. Imaginile arată doar unde priviți. Aceste dale arată unde se află rețeaua dvs. Mapbox va primi acele numere de dale și adresa dvs. IP. Nu trimitem nimic altceva: niciun nume, nicio conductă, niciun proiect. Nu păstrăm nicio evidență a acestui lucru, și nimic nu este stocat pe acest dispozitiv în afară de răspunsul dvs. la această întrebare.';
$ec_lang['lpn_contour_consent_3']='Ne permiteți să trimitem către Mapbox numerele de dale ale zonei rețelei dvs.?';
$ec_lang['lpn_contour_consent_4']='Dacă răspundeți nu, tot restul de pe această pagină continuă să funcționeze exact ca acum, iar graficul de contur este trasat doar între noduri. Reținem un da, pentru a nu mai fi nevoie să întrebăm din nou. Un nu nu este stocat deloc.';
$ec_lang['lpn_sysflow_menu']='Bilanț de debit';
$ec_lang['lpn_sysflow_tip']='Reprezintă grafic în funcție de timp debitul total produs și debitul total consumat, pe parcursul simulării pe perioadă extinsă. Bazinele nu sunt în niciunul dintre totaluri, deci acolo unde cele două linii se despart, bazinele se umplu sau se golesc.';
$ec_lang['lpn_sysflow_produced']='Produs';
$ec_lang['lpn_sysflow_produced_tip']='Debitul total care intră în rețea din rezervoare și din cerințe negative.';
$ec_lang['lpn_sysflow_consumed']='Consumat';
$ec_lang['lpn_sysflow_consumed_tip']='Totalul tuturor cerințelor pozitive: apa extrasă din rețea în joncțiuni și orice debit care intră într-un rezervor.';
$ec_lang['lpn_copy_title']='Marcați fișierul ca o copie nouă?';
$ec_lang['lpn_copy_body']='Acest fișier spune că a fost creat la {date}, iar acest browser nu îl recunoaște. Este fișierul Original (păstrați aceeași blocare) sau o Copie (creați o blocare nouă)?';
$ec_lang['lpn_copy_body_nodate']='Acest browser nu recunoaște acest fișier. Este fișierul Original (păstrați aceeași blocare) sau o Copie (creați o blocare nouă)?';
$ec_lang['lpn_copy_original']='Original; păstrează aceeași blocare';
$ec_lang['lpn_copy_copy']='O copie; creează o blocare nouă';
$ec_lang['lpn_copy_kept_link']='{name} a fost deschis ca original, mutat într-un loc nou. Salvează scrie acum în acest fișier.';
$ec_lang['lpn_copy_opened']='{file} a fost deschis ca o copie, cu o blocare nouă proprie, care va fi salvată la următoarea salvare a fișierului.';
$ec_lang['lpn_scenario_basic']='Mod de bază';
$ec_lang['lpn_scenario_basic_tip']='Bifat, un scenariu este pur și simplu valorile pe care le stabiliți în el. Debifat, acest meniu oferă și tabelul de previzualizare a Alternativelor, care arată cum sunt grupate acele valori pe categorii și vă invită feedbackul.';
$ec_lang['lpn_alt_title']='Previzualizare Alternative';
$ec_lang['lpn_alt_note']='Doar citire. Baza folosește alternativa Bază a fiecărei categorii. Fiecare scenariu primește propria alternativă pentru orice categorie modificată, subordonată celei de Bază. Numărul indică câte valori modificate are.';
$ec_lang['lpn_alt_cat_physical']='Fizic';
$ec_lang['lpn_alt_cat_demand']='Cerință';
$ec_lang['lpn_alt_cat_topology']='Activarea elementelor';
$ec_lang['lpn_alt_cat_initial']='Setări inițiale';
$ec_lang['lpn_alt_cat_constituent']='Constituent chimic';
$ec_lang['lpn_alt_cat_fireflow']='Debit de incendiu';
$ec_lang['lpn_alt_cat_energy']='Cost energie';
$ec_lang['lpn_alt_cat_userdata']='Proprietăți personalizate';
$ec_lang['lpn_alt_cat_text']='Text';
$ec_lang['lpn_reports_calib']='Calibrare';
$ec_lang['lpn_reports_calib_tip']='Comparați datele de teren măsurate dintr-un fișier de calibrare cu ultima rulare: statistici, un grafic de corelație și comparații de medii.';
$ec_lang['lpn_calib_title']='Raport de calibrare';
$ec_lang['lpn_calib_param']='Parametru';
$ec_lang['lpn_calib_param_tip']='Mărimea pe care o măsoară fișierul de calibrare. Se păstrează câte un fișier pentru fiecare parametru.';
$ec_lang['lpn_calib_load']='Încarcă fișier de calibrare…';
$ec_lang['lpn_calib_load_tip']='Un fișier text cu un ID de locație, un moment și o valoare măsurată pe fiecare linie. Momentul se măsoară de la începutul simulării, în ore zecimale sau ore:minute. Punctul și virgula începe un comentariu. O linie cu doar un moment și o valoare aparține locației de deasupra ei.';
$ec_lang['lpn_calib_none']='Pentru acest parametru nu este încărcat niciun fișier de calibrare.';
$ec_lang['lpn_calib_session']='Un fișier de calibrare este păstrat doar pentru această sesiune. Nu este salvat cu proiectul și nici pe acest dispozitiv.';
$ec_lang['lpn_calib_file']='{file}: {n} măsurători în {m} locații.';
$ec_lang['lpn_calib_units']='Valorile din fișier sunt citite în unitățile acestui proiect: {unit}.';
$ec_lang['lpn_calib_missing']='Numite în fișier, dar absente din această rețea: {ids}.';
$ec_lang['lpn_calib_missing_count']='Măsurători omise deoarece locația lor nu se află în această rețea: {n}.';
$ec_lang['lpn_calib_bad_lines']='Linii care nu au putut fi citite, omise: {lines}';
$ec_lang['lpn_calib_outside']='Măsurători în afara momentelor raportate de această rulare, omise: {n}.';
$ec_lang['lpn_calib_no_value']='Măsurători fără valoare calculată la momentul lor, omise: {n}.';
$ec_lang['lpn_calib_single']='Aceasta este o rulare pe o singură perioadă, deci fiecare măsurătoare este comparată cu unicul ei rezultat, indiferent de momentul indicat în fișier.';
$ec_lang['lpn_calib_needs_run']='Încă nu există rezultate de comparat. Raportul se completează după ce rețeaua a fost calculată.';
$ec_lang['lpn_calib_no_pairs']='Nicio măsurătoare nu a putut fi comparată, deci nu este nimic de reprezentat grafic.';
$ec_lang['lpn_calib_tab_stats']='Statistici';
$ec_lang['lpn_calib_tab_corr']='Grafic de corelație';
$ec_lang['lpn_calib_tab_means']='Comparații de medii';
$ec_lang['lpn_calib_col_location']='Locație';
$ec_lang['lpn_calib_col_n']='Nr. obs.';
$ec_lang['lpn_calib_col_obs_mean']='Medie observată';
$ec_lang['lpn_calib_col_sim_mean']='Medie calculată';
$ec_lang['lpn_calib_col_mean_err']='Eroare medie';
$ec_lang['lpn_calib_col_mean_err_tip']='Media diferențelor absolute dintre fiecare valoare observată și valoarea calculată la același moment.';
$ec_lang['lpn_calib_col_rms_err']='Eroare RMS';
$ec_lang['lpn_calib_col_rms_err_tip']='Eroarea pătratică medie: rădăcina pătrată a mediei pătratelor diferențelor dintre valorile observate și cele calculate.';
$ec_lang['lpn_calib_network']='Rețea';
$ec_lang['lpn_calib_corr_means']='Corelația dintre medii: {r}';
$ec_lang['lpn_calib_corr_none']='Corelația dintre medii: necesită cel puțin două locații ale căror medii diferă.';
$ec_lang['lpn_calib_axis_obs']='Observat: {q}';
$ec_lang['lpn_calib_axis_sim']='Calculat: {q}';
$ec_lang['lpn_calib_observed']='Observat';
$ec_lang['lpn_calib_computed']='Calculat';
$ec_lang['lpn_calib_point']='{id}, {time}: observat {o}, calculat {s}';
$ec_lang['lpn_calib_corr_note']='Fiecare punct este o măsurătoare. Cu cât punctele se află mai aproape de linia diagonală, cu atât valorile calculate se potrivesc mai bine cu cele observate.';
$ec_lang['lpn_calib_ts_point']='Măsurat la {id}, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='Inelele sunt valori măsurate din fișierul de calibrare.';
$ec_lang['lpn_analyze_menu']='Analiză';
$ec_lang['lpn_analyze_menu_tip']='Analize care rulează rețeaua pe o copie: debitul de incendiu la fiecare joncțiune, pierderea fiecărei conducte, pompe și vane, și cerințele mărite sau reduse proporțional.';
$ec_lang['lpn_ff_design_off']='Niciuna';
$ec_lang['lpn_ff_design_all']='Toate';
$ec_lang['lpn_ff_design_selected']='Selectate';
$ec_lang['lpn_ff_rows_more_links']='Legături neafișate: {n}.';
$ec_lang['lpn_crit_menu']='Analiza criticității…';
$ec_lang['lpn_crit_menu_tip']='Scoateți pe rând din rețea fiecare conductă, pompă și vană și vedeți ce pierde sistemul.';
$ec_lang['lpn_crit_title']='Analiza criticității';
$ec_lang['lpn_crit_intro']='Fiecare element este scos pe rând din rețea, iar rețeaua este rezolvată la pasul de timp de pe ecran, în scenariul activ. Nimic din proiectul dvs. nu este modificat; întreaga rulare se face pe o copie.';
$ec_lang['lpn_crit_scope']='Legături de întrerupt';
$ec_lang['lpn_crit_scope_tip']='Toate conductele, pompele și vanele, sau doar cele selectate pe hartă. Alegeți setul înainte de a rula.';
$ec_lang['lpn_crit_scope_all']='Toate legăturile';
$ec_lang['lpn_crit_scope_selected']='Legăturile selectate';
$ec_lang['lpn_crit_minpressure']='Cea mai mică presiune permisă';
$ec_lang['lpn_crit_minpressure_tip']='Este același număr ca Cea mai mică presiune permisă în altă parte din Analiza debitului de incendiu. Dacă îl schimbați aici, se schimbă și acolo.';
$ec_lang['lpn_crit_col_asset']='Element';
$ec_lang['lpn_crit_col_unserved']='Cerință neservită';
$ec_lang['lpn_crit_col_cutoff']='Joncțiuni izolate';
$ec_lang['lpn_crit_col_below']='Joncțiuni sub minim';
$ec_lang['lpn_crit_summary']='{n} din {total} elemente lasă cerința neservită sau coboară o joncțiune sub {pressure}.';
$ec_lang['lpn_crit_baseline_below']='Joncțiuni deja sub această valoare fără nimic întrerupt: {n}. Ele nu sunt numărate.';
$ec_lang['lpn_crit_working']='Se lucrează: {done} din {total} elemente.';
$ec_lang['lpn_crit_stopped']='Oprit după {done} din {total} elemente. Rezultatele de mai jos sunt cele deja terminate.';
$ec_lang['lpn_crit_no_selection']='Nicio legătură nu este selectată. Selectați legături sau alegeți Toate legăturile.';
$ec_lang['lpn_crit_no_links']='Acest proiect nu are încă nicio legătură, deci nu este nimic de întrerupt.';
$ec_lang['lpn_crit_busy']='Altă analiză rulează. Opriți-o sau așteptați să se termine.';
$ec_lang['lpn_crit_skipped']='{n} elemente selectate nu sunt legături, deci nu au fost întrerupte.';
$ec_lang['lpn_crit_stale']='Desenul s-a schimbat, deci rezultatele criticității au fost șterse. Rulați din nou.';
$ec_lang['lpn_crit_skipdead']='Omite capetele moarte';
$ec_lang['lpn_crit_skipdead_tip']='O legătură de capăt mort este una a cărei scoatere izolează joncțiuni care pot fi atinse doar prin ea, fără niciun rezervor sau bazin dincolo. Pierderea ei înseamnă tot ce se află dincolo de ea, deci nu este rezolvată. Sumarul spune câte au fost omise.';
$ec_lang['lpn_crit_skipped_dead']='Legături de capăt mort omise: {n}. Fiecare izolează tot ce se află dincolo de ea.';
