<?php

// àáèéìíòóùú — All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='frazione';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/s';
$ec_lang['u_gpm']='gal/min';
$ec_lang['u_gradePercent']='% pendenza';
$ec_lang['u_grade']='pendenza';
$ec_lang['u_in2']='poll^2';
$ec_lang['u_inh2o']='poll H2O';
$ec_lang['u_in']='poll';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='L/s';
$ec_lang['u_m2']='m^2';
$ec_lang['u_m3ps']='m^3/s';
$ec_lang['u_mgd']='MGD';
$ec_lang['u_imgd']='Mgal imp/g';
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
$ec_lang['u_psf']='lb/ft^2';
$ec_lang['u_psi']='psi';
$ec_lang['u_bar']='bar';
$ec_lang['u_kgfcm2']='kgf/cm^2';
$ec_lang['u_s']='s';
$ec_lang['u_hr']='h';
$ec_lang['u_day']='giorno';
$ec_lang['u_lph']='L/hr';
$ec_lang['u_gph']='gal/hr';
$ec_lang['u_mmph']='mm/hr';
$ec_lang['u_inph']='poll/hr';
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
$ec_lang['menu_brand']='Calcolatori HawsEDC';
$ec_lang['menu_main_hydraulics']='Idraulica';
$ec_lang['menu_help']='Guida';
$ec_lang['menu_libre']='Software libero';
$ec_lang['template_welcome']='Lasciate le paure alla porta; qui l\'amore è la nostra lingua. Non state rovinando tutto. Godetevi anche gli <a target="_blank" href="https://hawsedc.com/download.php">strumenti gratuiti HawsEDC per AutoCAD.</a>';
$ec_lang['template_feedback']='Sa suggerire una formulazione migliore per questa pagina, o qualcos\'altro? Vuole aiutare, o imparare a creare strumenti come questi? La prego di contattarmi.';
$ec_lang['template_printable_title']='Titolo stampabile';
$ec_lang['template_printable_subtitle']='Sottotitolo stampabile';
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
$ec_lang['consent_body']='Possiamo salvare un cookie di una sola cifra in questo browser per ricordare che abbiamo già conteggiato questa pagina? Non registra nulla su di te né ciò che digiti. Senza di esso non possiamo distinguere una tua seconda visita dalla prima visita di qualcun altro.';
$ec_lang['consent_accept']='Accetta';
$ec_lang['consent_accept_all']='Accetta sempre';
$ec_lang['consent_decline']='Rifiuta sempre';
$ec_lang['consent_current_granted']='Hai acconsentito. Limitiamo la registrazione per questo profilo del browser.';
$ec_lang['consent_current_denied']='Hai rifiutato. Non conserviamo nulla per limitare la registrazione per questo profilo del browser.';
$ec_lang['consent_region_label']='La tua scelta sulla limitazione della registrazione.';
$ec_lang['consent_settings_link']='Impostazioni cookie';
$ec_lang['privacy_link']='Informativa sulla privacy';
$ec_lang['terms_link']='Termini di utilizzo';
$ec_lang['index_main_title']='Calcolatori ingegneristici gratuiti online';
$ec_lang['index_meta_desc_plain']='Calcolatori gratuiti di ingegneria idraulica per tubazioni, canali, stramazzi e irrigazione. Funzionano nel browser, anche offline, e sono disponibili in 27 lingue.';
$ec_lang['calc_set_units']='Imposta unità:';
$ec_lang['calc_set_units_tip']='Imposta l\'unità di tutti i campi in una volta. Non distruttivo: i numeri che hai digitato restano esattamente come sono, e ognuno viene ora letto nella nuova unità. Un 6 resta un 6, ma ora significa 6 pollici invece di 6 millimetri.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Ripristina predefiniti';
$ec_lang['calc_defaults_confirm']='Ripristinare il calcolatore ai valori predefiniti originali?';
$ec_lang['points_data_note']='(o Copia/Incolla usando l\'area dati)';
$ec_lang['points_data_heading']='Dati punti<br />(separati da virgola o tabulazione)';
$ec_lang['points_data_copy']='Copia';
$ec_lang['points_data_paste']='Incolla';
$ec_lang['calc_inputs']='Dati di input';
$ec_lang['calc_results']='Risultati';
$ec_lang['view_hide_line']='[Nascondi questa riga]';
$ec_lang['view_printable']='Versione stampabile (ricaricare per ripristinare)';
$ec_lang['ec_name_label']='Salva questo calcolo:';
$ec_lang['ec_name_placeholder']='Nome';
$ec_lang['ec_name_tip']='Salva questi dati inseriti nell\'URL per segnalibri, recupero della cronologia e condivisione';
$ec_lang['calc_copy_link']='Copia collegamento';
$ec_lang['ec_related_calcs']='Calcolatori correlati:';
$ec_lang['calc_copy_link_done']='Copiato!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Perdita di carico Darcy-Weisbach';
$ec_lang['dw_main_title']='Calcolatore gratuito online perdita di carico Darcy-Weisbach';
$ec_lang['dw_main_desc']='Perdita di carico in tubazione con Darcy-Weisbach a diametro, scabrezza e portata dati';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Altezza di scabrezza assoluta, e, della parete della tubazione. Valori tipici: acciaio (nuovo) 0,046 mm, acciaio (usato) 0,15 mm, HDPE 0,003 mm, PVC/uPVC 0,0015 mm, calcestruzzo 0,3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s per acqua pulita a 20°C">Viscosità cinematica, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Viscosità cinematica, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s per acqua pulita a 20°C';
$ec_lang['dw_reynolds_number']='Numero di Reynolds, Re';
$ec_lang['dw_flow_regime']='Regime di flusso';
$ec_lang['dw_regime_laminar']='laminare';
$ec_lang['dw_regime_transitional']='di transizione';
$ec_lang['dw_regime_turbulent']='turbolento';
$ec_lang['dw_friction_factor_method']='Metodo del fattore di attrito';
$ec_lang['dw_friction_factor']='Fattore di attrito, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Perdita di carico Hazen-Williams';
$ec_lang['hw_main_title']='Calcolatore gratuito online perdita di carico Hazen-Williams';
$ec_lang['hw_main_desc']='Perdita di carico in tubazione con Hazen-Williams a diametro, scabrezza e portata dati';
$ec_lang['hw_hgl_1']='HGL a valle';
$ec_lang['hw_hgl_2']='HGL a monte';
$ec_lang['hw_elev_up']='Quota a monte';
$ec_lang['hw_pressure_up']='Pressione a monte';
$ec_lang['hw_elev_down']='Quota a valle';
$ec_lang['hw_pressure_down']='Pressione a valle';
$ec_lang['hw_pressure_check']='Verifica della pressione';
$ec_lang['hw_pressure_ok_short']='Pressione positiva';
$ec_lang['hw_pressure_neg_short']='Pressione negativa';
$ec_lang['hw_pressure_neg']='La pressione a valle è inferiore a zero. La linea piezometrica scende sotto la tubazione, quindi la tubazione non scorrerebbe a sezione piena e questo risultato potrebbe non essere valido.';
$ec_lang['hw_roughness']='Coefficiente Hazen-Williams, C';
$ec_lang['hw_note_1']='<dl><dt>Questo calcolatore non tiene conto del profilo della tubazione tra le due estremità.</dt><dd>Utilizza solo le quote a monte e a valle inserite dall\'utente. Se il terreno si innalza al di sopra di una delle due estremità in un punto intermedio, la pressione in quel punto alto è inferiore a qualsiasi pressione qui riportata. Eseguire nuovamente il calcolo per la lunghezza dall\'estremità a monte al punto alto per verificarla.</dd><dd>Dove la linea piezometrica scende sotto la tubazione, l\'acqua è in pressione negativa. L\'aria fuoriesce dalla soluzione, una tubazione a parete sottile può collassare e l\'acqua di falda contaminata può essere richiamata attraverso i giunti. Mantenere la linea in pressione positiva ovunque e prevedere una valvola d\'aria in ogni punto alto.</dd><dt>La pressione a monte è una condizione al contorno fornita dall\'utente.</dt><dd>Leggerla da un manometro, dal livello dell\'acqua in un serbatoio (l\'altezza dell\'acqua sopra la tubazione) o dalla curva caratteristica di una pompa. Una pompa fornisce meno pressione all\'aumentare della portata, quindi utilizzare il punto della curva corrispondente alla portata inserita sopra.</dd><dt>Sommare autonomamente i coefficienti di perdita di carico concentrata.</dt><dd>Sommare i valori di K per ogni valvola, curva, raccordo a T, contatore e imbocco presenti sulla linea, e inserire quel totale. Seguire il collegamento su quel campo per i valori tipici. Su una condotta di adduzione lunga queste perdite sono piccole rispetto all\'attrito, ma nelle tubazioni corte di una stazione di pompaggio possono costituire la maggior parte della perdita.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Canale irregolare Manning';
$ec_lang['mi_main_title']='Calcolatore gratuito online di Manning per canale a sezione irregolare';
$ec_lang['mi_main_desc']='Calcolatore flusso uniforme di Manning per canale a sezione irregolare';
$ec_lang['mi_waterSurfaceElevation']='Quota pelo libero';
$ec_lang['mi_q_617']='<span class="ec-help" title="La portata composita, Q, usando un n composto per ciascuna regione secondo Chow 6-17, velocità uguali">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Punti sezione trasversale';
$ec_lang['mi_groupPoint']='Punto';
$ec_lang['mi_groupSegment']='Segmento';
$ec_lang['mi_groupRegion']='Regione';
$ec_lang['mi_station']='Prog.';
$ec_lang['mi_elevation']='Quota';
$ec_lang['mi_n']='n<br />del seg-<br />mento';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />confine<br />regione<br />(Sponda)';
$ec_lang['mi_tau']='Tensione<br />tang.<br />di fondo<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n com-<br />posto';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='n composto';
$ec_lang['mi_notes_1_def']='Questo calcolatore segue il manuale di riferimento HEC-RAS nel calcolo del n composto della regione usando Chow 1959, pagina 136, equazione 6-17 (non 6-18).';


$ec_lang['mi_notes_2_term']='Rivestimento in roccia';
$ec_lang['mi_notes_2_def']='Usare il Calcolatore Canale Trapezoidale Manning per progettare il rivestimento in roccia. Questo calcolatore è più adatto per sezioni naturali.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Portata in tubazione Manning';
$ec_lang['mpf_main_title']='Calcolatore gratuito online portata in tubazione Manning';
$ec_lang['mpf_main_desc']='Formula di Manning per flusso uniforme in tubazione a pendenza e profondità date';
$ec_lang['mpf_pipe_diameter']='Diametro tubazione, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Scabrezza di Manning, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Pendenza di attrito, S<sub>f</sub></a><span class="ec-help" title="Talvolta uguale alla pendenza della tubazione. Segui il link per la spiegazione (solo in inglese)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Rapporto di riempimento, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Portata, Q';
$ec_lang['mpf_flow_tip']='Portata e profondità calcolate per una tubazione infinitamente lunga. Per immettere questa portata nella tubazione può essere necessaria un\'altezza idraulica a monte maggiore. Vedere le Note sotto per i dettagli e un video tutorial.';
$ec_lang['mpf_velocity']='Velocità, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Energia cinetica come altezza della colonna d\'acqua, v²/2g">Altezza cinetica, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Area bagnata, A';
$ec_lang['mpf_pipe_area']='Area tubazione, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Area relativa, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Perimetro bagnato, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Raggio idraulico, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Larghezza pelo libero, T';
$ec_lang['mpf_froude_number']='Numero di Froude, Fr';
$ec_lang['mpf_shear_stress']='Tensione tangenziale media, τ';
$ec_lang['mpf_full_flow']='Portata a sezione piena, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Rapporto alla portata piena, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Questa è la portata e la profondità all\'interno di una tubazione <em>infinitamente lunga</em>.</dt><dd>L\'immissione della portata nella tubazione può richiedere un\'altezza idraulica significativamente maggiore. Aggiungere almeno 1,5 volte l\'altezza cinetica per l\'altezza idraulica o <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">vedere il tutorial di 2 minuti</a> per i calcoli standard del livello idraulico nei tombini con <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, il programma gratuito per tombini della U.S. Federal Highway Administration (l\'amministrazione federale delle autostrade degli Stati Uniti).</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Stai progettando una fognatura nera?</dt><dd>Consulta le <a target="_blank" href="/sewslope.php">tabelle delle pendenze minime delle fognature</a> per tubazioni da 4 a 96 pollici (100 a 2400 mm), espresse in m/m, mm/m e percentuale, e lo studio sui <a target="_blank" href="/peakfact.php">fattori di punta per portate molto basse</a>. Entrambi sono documenti di riferimento solo in inglese.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Inserire un valore positivo per Q.';
$ec_lang['mpf_solver_no_solution']='Nessuna soluzione: Q supera la capacità della tubazione a y/d0 = 93.8% (Qmax = {qmax} nelle unità selezionate).';
$ec_lang['mpf_solve_btn']='Calcola';
$ec_lang['mpf_solve_for_flow']='per portata, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Perdita di carico in tubazione Manning';
$ec_lang['mphl_main_title']='Calcolatore gratuito online perdita di carico in tubazione Manning';
$ec_lang['mphl_main_desc']='Formula di Manning perdita di carico a portata piena data';
$ec_lang['mphl_pipe_length']='Lunghezza, L';
$ec_lang['mphl_area']='Area, A';
$ec_lang['mphl_total_junction_k']='Coefficiente di perdita di carico concentrata, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Coefficiente di perdita, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Perdita di carico (localizzata) concentrata, km. Queste perdite si verificano in corrispondenza di giunti di tubazione, imbocchi, sbocchi, curve e valvole — il termine "concentrata" indica che la perdita è localizzata in un punto, non che sia piccola; in un tratto corto possono eguagliare o superare le perdite per attrito. Valori tipici di k: imbocco a spigolo vivo 0,5, ogni curva a 45° 0,2–0,3, valvola a saracinesca (tutta aperta) 0,1, valvola a farfalla 0,2, sbocco (verso serbatoio o atmosfera) 1,0. Sommare tutti i raccordi per ottenere il km totale. Il valore predefinito 2,0 presuppone un imbocco, uno sbocco e due curve a 45°.';
$ec_lang['mphl_friction_slope']='Pendenza di attrito';
$ec_lang['mphl_friction_loss']='Perdita di carico distribuita, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Perdita di carico concentrata, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Perdita di carico totale, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='EGL a valle';
$ec_lang['mphl_egl_2']='EGL a monte';
$ec_lang['mphl_hgl_egl_tip']='Questo risultato potrebbe non essere valido dove la tubazione sale sopra la linea dei carichi piezometrici.';
$ec_lang['mphl_note_1']='<dl><dt>Questo calcolatore non tiene conto del profilo della tubazione tra le due estremità.</dt><dd>Se l\'HGL scende sotto la sommità della tubazione in un qualsiasi punto, questo calcolo potrebbe non essere valido.</dd><dt>Per una condizione di imbocco aperto (tombino), è necessario verificare le condizioni di controllo all\'imbocco.</dt><dd>1. L\'HGL a monte non può essere inferiore alla quota di deflusso a profondità normale a monte (o inferiore alla tubazione!).</dd><dd>2. Il livello idraulico di un tombino è meglio rappresentato dall\'EGL a monte che dall\'HGL a monte.</dd><dd>3. <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">Vedere il tutorial di 2 minuti</a> per semplici calcoli standard del livello idraulico nei tombini con <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, il programma gratuito per tombini della U.S. Federal Highway Administration (l\'amministrazione federale delle autostrade degli Stati Uniti).</dd><dd>4. Questa pagina risolve solo il caso di controllo allo sbocco: una tubazione che scorre a sezione piena, in cui le condizioni a valle determinano il carico idraulico. La progettazione di un tombino consiste nello stabilire se prevale il controllo all\'imbocco o allo sbocco, quindi usare HY-8 ogni volta che entrambi i casi sono possibili.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Canale trapezoidale Manning';
$ec_lang['mtc_main_title']='Calcolatore gratuito online formula di Manning canale trapezoidale';
$ec_lang['mtc_main_desc']='Flusso uniforme Manning in canale trapezoidale a pendenza e profondità date';
$ec_lang['mtc_bottom_width']='Larghezza di fondo, b';
$ec_lang['mtc_side_slope_1']='Scarpata lato 1, z<sub>1</sub> (orizz./vert.)';
$ec_lang['mtc_side_slope_2']='Scarpata lato 2, z<sub>2</sub> (orizz./vert.)';
$ec_lang['mtc_channel_slope']='Pendenza canale, S';
$ec_lang['mtc_flow_depth']='Profondità di flusso, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Angolo di curva, β</a><span class="ec-help" title="Per dimensionamento massi. Segui il link per lo schema."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Densità relativa rispetto all\'acqua. Tipicamente ≈ 2,65 per roccia frantumata.">Peso specifico relativo della roccia, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Dimensione roccia di progetto, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n dalla dimensione della roccia di progetto (metodo Strickler)';
$ec_lang['mtc_n_blodgett']='n dalla dimensione della roccia di progetto (metodo Blodgett)';
$ec_lang['mtc_n_bathurst']='n dalla dimensione della roccia di progetto (metodo Bathurst)';
$ec_lang['mtc_n_pi']='n dalla dimensione della roccia di progetto (metodo Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett contro Bathurst';
$ec_lang['mtc_pi_range_check']='Verifica intervallo P&I';
$ec_lang['mtc_pi_ok']='d50 nell\'intervallo P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Fuori intervallo';
$ec_lang['mtc_pi_tip']='Estrapolazione oltre l\'intervallo di dati 0,28–0,36 ft su cui questa equazione è stata sviluppata: da considerare come verifica indicativa, non come base di progetto';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Secondo Isbash (1936) e Maricopa County, Arizona, US.">Dimensione roccia angolare richiesta sul fondo, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Secondo Isbash (1936) e Maricopa County, Arizona, US.">Dimensione roccia angolare richiesta scarpata 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Secondo Isbash (1936) e Maricopa County, Arizona, US.">Dimensione roccia angolare richiesta scarpata 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Secondo Maynord, Ruff e Abt (1989). In una curva la roccia è dimensionata per una velocità di curva pari a 4/3 della media, secondo California Division of Highways (1970); il valore originale di Maynord di 1,5 si applica ai canali naturali.">Dimensione roccia angolare richiesta, D<sub>50</sub> (Maynord, Ruff, e Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Dimensione roccia angolare richiesta, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Velocità ragionevole per le ipotesi di flusso uniforme.';
$ec_lang['mtc_vel_low']='Velocità bassa — rischio di sedimentazione.';
$ec_lang['mtc_vel_high']='La velocità è elevata e potrebbe non essere realistica; verificare l\'erosione del rivestimento del canale, il tirante aggiuntivo nelle curve e la perdita di energia in corrispondenza di espansioni o ostruzioni.';
$ec_lang['mtc_iteration_tip']='Scegliere un\'opzione di scabrezza (Blodgett-Bathurst raccomandato) e un\'opzione di dimensione roccia (Isbash raccomandato) per iterare automaticamente verso una dimensione roccia uniforme per la portata desiderata. Vedere le Note sotto per il metodo completo, oppure inserire un proprio valore di scabrezza (seguire il link per indicazioni) e ignorare la dimensione roccia per saltare l\'iterazione.';
$ec_lang['mtc_note_1']='<dl><dt>Iterazione automatica di dimensionamento roccia e scabrezza</dt><dd>Scegliere un\'opzione di scabrezza (Blodgett–Bathurst raccomandato) e un\'opzione di dimensione roccia di progetto (Isbash raccomandato). Regolare la profondità e il fattore di sicurezza della dimensione roccia per raggiungere la portata desiderata con una dimensione roccia uniforme. Ogni volta che si cambia un valore in ingresso, il calcolatore ripete questi passaggi: 1. La scabrezza viene calcolata dalla dimensione roccia di progetto. 2. Il valore di scabrezza dal metodo scelto viene copiato nel campo di scabrezza in ingresso. 3. Vengono calcolati la portata nel canale e la dimensione roccia richiesta. 4. La dimensione roccia di progetto viene aggiornata. 5. Si ripete finché l\'errore nella dimensione roccia di progetto non è molto piccolo.</dd><dt>Calcolatore di base (senza iterazione)</dt><dd>Inserire il valore di scabrezza desiderato. Ignorare l\'area di input della dimensione roccia di progetto.</dd></dl>';
$ec_lang['mtc_note_2_term']='Controllo della velocità';
$ec_lang['mtc_note_2_def']='Velocità elevata implica elevata energia specifica derivante da una caduta disponibile. Tale energia può dissiparsi rapidamente in corrispondenza di espansioni, curve o ostruzioni. Verificare che ciò sia ragionevole per il sito.';
$ec_lang['mtc_solver_no_solution']='Nessuna soluzione trovata per il Q indicato con questi dati del canale.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Stramazzo semplice';
$ec_lang['ws_main_title']='Calcolatore gratuito online del deflusso su stramazzo semplice a soglia larga';
$ec_lang['ws_main_desc']='Calcolatore del deflusso su stramazzo semplice a soglia larga';
$ec_lang['ws_weirLength']='Lunghezza dello stramazzo, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Energia per unità di peso dell\'acqua — un\'altezza della colonna d\'acqua, non una pressione">Carico, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Coefficiente dello stramazzo, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Note';
$ec_lang['ws_notes_we_term']='Equazione dello stramazzo';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Stramazzo irregolare';
$ec_lang['wi_main_title']='Calcolatore gratuito online del deflusso su stramazzo irregolare, segmentato, a profondità variabile';
$ec_lang['wi_main_desc']='Calcolatore del deflusso su stramazzo irregolare';
$ec_lang['wi_weirPoints']='Punti dello stramazzo';
$ec_lang['wi_pondingHeight']='Altezza di invaso';
$ec_lang['wi_incrementalFlow']='Portata incrementale';
$ec_lang['wi_cumulativeFlow']='Portata cumulativa';
$ec_lang['wi_notes_we_def']='q = se (length = 0) allora 0 altrimenti se (slope=0) allora cw*length*d<sub>0</sub><sup>1.5</sup> altrimenti cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) dove d<sub>1</sub> e d<sub>0</sub> sono sempre positivi o zero';
// Orifice Flow
$ec_lang['or_main_menu']='Deflusso a orifizio';
$ec_lang['or_main_title']='Calcolatore gratuito online del deflusso a orifizio';
$ec_lang['or_main_desc']='Deflusso a orifizio — libero o sommerso';
$ec_lang['or_shape_circular']='Circolare';
$ec_lang['or_shape_rectangular']='Rettangolare';
$ec_lang['or_diameter']='<span class="ec-help" title="Diametro per forma circolare; altezza per forma rettangolare">Diametro o altezza, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Solo per aperture rettangolari">Larghezza, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Parte inferiore dell\'apertura">Quota di fondo <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Quota pelo libero a monte';
$ec_lang['or_twe']='Quota pelo libero a valle';
$ec_lang['or_cd']='Coefficiente di efflusso, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Quota del centroide';
$ec_lang['or_head']='<span class="ec-help" title="Energia per unità di peso dell\'acqua — un\'altezza della colonna d\'acqua, non una pressione">Carico efficace, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Area dell\'apertura, A';
$ec_lang['or_regime']='Verifica del regime di orifizio';
$ec_lang['or_regime_valid']='Scarico libero';
$ec_lang['or_regime_submerged']='Orifizio sommerso';
$ec_lang['or_regime_submerged_tip']='TWE sopra il centroide — il regime di orifizio resta valido';
$ec_lang['or_regime_warn']='Fuori dal regime di orifizio';
$ec_lang['or_regime_warn_tip']='Pelo libero a monte sotto la sommità dell\'apertura';
$ec_lang['or_regime_twe_above_hwe']='Verificare i dati';
$ec_lang['or_regime_twe_above_hwe_tip']='Pelo libero a valle (TWE) sopra il pelo libero a monte (HWE)';
$ec_lang['or_notes_1_term']='Equazione dell\'orifizio';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Per scarico libero: h = HWE − centroide. Per deflusso sommerso (TWE sopra la quota di fondo): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Regime di orifizio';
$ec_lang['or_notes_2_def']='Le equazioni del deflusso a orifizio si applicano quando il pelo libero a monte è sopra la sommità (il punto più alto) dell\'apertura. Quando il pelo libero a monte è sotto la sommità, utilizzare invece un\'equazione di stramazzo.';
$ec_lang['or_notes_3_term']='Coefficiente di efflusso';
$ec_lang['or_notes_3_def']='C<sub>d</sub> varia da circa 0,60 a 0,65 per orifizi a spigolo vivo. Imbocchi arrotondati o rientranti richiedono valori diversi. Vedere <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> o il Manuale di Riferimento Idraulico HEC-RAS per maggiori indicazioni.';
$ec_lang['or_notes_4_term']='Sommersione';
$ec_lang['or_notes_4_def']='Quando TWE è sopra la quota di fondo dell\'apertura, questo calcolatore applica automaticamente l\'equazione dell\'orifizio sommerso usando h = HWE − TWE. Quando TWE è pari o inferiore alla quota di fondo, si assume lo scarico libero e h = HWE − centroide.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Micro-Idroelettrico';
$ec_lang['mhp_main_title']='Calcolatore Gratuito di Potenza Micro-Idroelettrica';
$ec_lang['mhp_main_desc']='Calcolatore di Potenza Micro-Idroelettrica ad Acqua Fluente';
$ec_lang['mhp_gross_head']='Altezza lorda, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Diametro della condotta forzata (tubo di alimentazione)">Diametro della condotta forzata, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Lunghezza, L';
$ec_lang['mhp_efficiency']='Rendimento dell\'impianto, η (0–1)';
$ec_lang['mhp_vel_check']='Verifica della velocità';
$ec_lang['mhp_hl_check']='Verifica della perdita di carico';
$ec_lang['mhp_hnet']='Altezza netta, H<sub>net</sub>';
$ec_lang['mhp_power']='Potenza prodotta, P';
$ec_lang['mhp_annual_kwh']='P come energia annua';
$ec_lang['mhp_vel_low']='Velocità bassa — rischio di sedimentazione e trascinamento d\'aria.';
$ec_lang['mhp_vel_high']='Velocità elevata — verificare le perdite di transizione, l\'energia disponibile e il colpo d\'ariete.';
$ec_lang['mhp_vel_ok_short']='OK';
$ec_lang['mhp_vel_high_short']='Alto';
$ec_lang['mhp_vel_low_short']='Basso';
$ec_lang['mhp_vel_ok_tip']='La velocità è nell\'intervallo efficiente per il dimensionamento della condotta forzata.';
$ec_lang['mhp_hl_ok_tip']='La perdita di carico è inferiore al 10% del carico lordo. Questa dimensione di tubazione è economica.';
$ec_lang['mhp_hl_warn_tip']='La perdita di carico supera il 10% del carico lordo. Considerare una tubazione più grande.';
$ec_lang['mhp_hl_bad_tip']='La perdita di carico supera il 20% del carico lordo. Ridimensionare la tubazione.';
$ec_lang['mhp_notes_1_term']='Perdita di carico';
$ec_lang['mhp_notes_1_def']='Perdita totale nella condotta forzata h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, dove h<sub>f</sub> = f(L/D)(v²/2g) è la perdita per attrito di Darcy-Weisbach e h<sub>m</sub> = k<sub>m</sub>·v²/2g comprende imbocchi, curve e valvole. Altezza netta H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Velocità';
$ec_lang['mhp_notes_2_def']='Verificare che la velocità sia ragionevole per il dislivello disponibile e il costo della tubazione. Una velocità molto bassa può indicare un sovradimensionamento; una velocità molto alta può aumentare le perdite per attrito e il rischio di colpo d\'ariete.';
$ec_lang['mhp_notes_3_term']='Obiettivo di perdita di carico';
$ec_lang['mhp_notes_3_def']='Perdite nella condotta forzata (tubazione di alimentazione) inferiori al 10% del carico lordo sono generalmente economiche. Il compromesso ottimale tra costo della tubazione e potenza persa si attesta spesso intorno al 4–6% dove il prezzo dell\'elettricità è elevato.';
$ec_lang['mhp_notes_6_term']='Rendimento';
$ec_lang['mhp_notes_6_def']='Il rendimento tipico dell\'impianto η varia da 0,70 a 0,85 per le turbine Pelton e cross-flow comuni negli impianti micro-idroelettrici. Usare 0,75 come stima conservativa iniziale.';
$ec_lang['mhp_notes_7_term']='Energia annua';
$ec_lang['mhp_notes_7_def']='L\'energia annua presuppone un funzionamento continuativo a portata piena (8760 ore/anno). La produzione reale sarà inferiore a causa della variazione stagionale di portata, dei tempi di fermo per manutenzione e del fattore di carico.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Laghetto e serbatoio: tempo di svuotamento';
$ec_lang['odt_main_title']='Calcolatore online gratuito del tempo di svuotamento di laghetto, vasca e serbatoio (orifizio)';
$ec_lang['odt_main_desc']='Tempo di svuotamento di laghetto, vasca o serbatoio — Scarico a orifizio, metodo del volume conico';
$ec_lang['odt_h1_elev']='Quota iniziale del pelo libero';
$ec_lang['odt_a1']='Area iniziale, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Quota finale del pelo libero';
$ec_lang['odt_a0']='Area alla quota dell\'orifizio, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Interpolata dal modello conico alla quota finale">Area finale, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Verifica della quota finale';
$ec_lang['odt_h2_ok']='Quota finale sopra la sommità dell\'orifizio';
$ec_lang['odt_h2_warn']='Quota finale pari o inferiore alla sommità dell\'orifizio';
$ec_lang['odt_h2_warn_tip']='Sommità dell\'orifizio = centroide + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Diametro (circolare) o altezza (rettangolare)">D dell\'orifizio <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Solo rettangolare">Larghezza dell\'orifizio, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Tempo di svuotamento (s)';
$ec_lang['odt_t_min']='Tempo di svuotamento (min)';
$ec_lang['odt_t_hr']='Tempo di svuotamento (h)';
$ec_lang['odt_t_day']='Tempo di svuotamento (giorni)';
$ec_lang['odt_notes_1_term']='Formula';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) fornisce il tempo di svuotamento dal carico H all\'orifizio. Tempo di svuotamento = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), dove H<sub>1</sub> = quota iniziale − quota orifizio, H<sub>2</sub> = quota finale − quota orifizio.';
$ec_lang['odt_notes_2_term']='Metodo';
$ec_lang['odt_notes_2_def']='Il metodo del volume conico modella il laghetto o la vasca come una sezione conica tra l\'area iniziale A<sub>1</sub> al pelo libero iniziale e l\'area A<sub>0</sub> alla quota del centroide dell\'orifizio. A<sub>2</sub>, l\'area del laghetto alla quota finale, è interpolata da A<sub>1</sub> e A<sub>0</sub> usando il modello della sezione conica. Il tempo di svuotamento dalla quota iniziale alla finale equivale al tempo totale di svuotamento da H<sub>1</sub> all\'orifizio meno il tempo di svuotamento rimanente da H<sub>2</sub> all\'orifizio.';
$ec_lang['odt_h1']='<span class="ec-help" title="Quota iniziale del pelo libero meno quota del centroide dell\'orifizio">Carico iniziale, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Portata massima, Q<sub>max</sub>';
$ec_lang['odt_vol']='Volume svuotato';
$ec_lang['odt_sketch_start']='Inizio';
$ec_lang['odt_sketch_end']='Fine';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Spaziatura tra gli emettitori, S<sub>e</sub>';
$ec_lang['ip_sl']='Spaziatura delle ali laterali, S<sub>l</sub>';
$ec_lang['ip_n_e']='Emettitori per ala laterale, n<sub>e</sub>';
$ec_lang['ip_n_l']='Ali laterali per zona, n<sub>l</sub>';
$ec_lang['ip_d']='Profondità di applicazione obiettivo, d';
$ec_lang['ip_a_e']='Area per emettitore, A<sub>e</sub>';
$ec_lang['ip_pr']='Tasso di applicazione, PR';
$ec_lang['ip_q_lat']='Portata per ala laterale, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Portata di zona, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Durata di funzionamento (ore)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Infiltrazione del canale';
$ec_lang['cs_main_title']='Calcolatrice online gratuita per la perdita per infiltrazione del canale e l\'efficienza di trasporto';
$ec_lang['cs_main_desc']='Perdita per infiltrazione del canale & efficienza di trasporto — metodo ingresso-uscita';
$ec_lang['cs_Q_in']='Portata in ingresso, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Portata in uscita, Q<sub>out</sub>';
$ec_lang['cs_L']='Lunghezza del tratto, L';
$ec_lang['cs_Q_loss']='Tasso di perdita per infiltrazione, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Verifica della misurazione';
$ec_lang['cs_pct_loss']='Frazione persa';
$ec_lang['cs_Ec']='Efficienza di trasporto, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Valutazione dell\'efficienza';
$ec_lang['cs_Vol_day']='Volume perso giornaliero';
$ec_lang['cs_Vol_year']='Volume perso annuo';
$ec_lang['cs_Q_loss_per_L']='Perdita per unità di lunghezza, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Valore dell\'acqua';
$ec_lang['cs_lining_cost']='Costo del rivestimento';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Obiettivo di efficienza di trasporto dopo il rivestimento; frazione 0–1">Obiettivo di rivestimento, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Area di rivestimento, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Valore annuo perso';
$ec_lang['cs_annual_value_recovered']='Valore annuo recuperato';
$ec_lang['cs_lining_total_cost']='Costo totale del rivestimento';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Ammortamento semplice = costo totale del rivestimento ÷ valore annuo recuperato">Periodo di ammortamento <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — infiltrazione rilevata';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — nessuna perdita misurabile';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — verificare le misurazioni';
$ec_lang['cs_Ec_good']='Buona — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Discreta — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Scarsa — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='Il metodo ingresso-uscita stima l\'infiltrazione misurando la portata a monte e a valle di un tratto di canale: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. L\'efficienza di trasporto E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Il volume annuo presuppone un funzionamento continuo a piena portata; la perdita effettiva è inferiore per i canali stagionali o a portata parziale.';
$ec_lang['cs_notes_2_term']='Valutazioni dell\'efficienza';
$ec_lang['cs_notes_2_def']='Canali in terra tipici non rivestiti: E<sub>c</sub> = 60–80%. Canali in terra ben mantenuti: 75–85%. Canali rivestiti in calcestruzzo: 90–98%. Perdite per infiltrazione superiori al 30% della portata in ingresso spesso giustificano un investimento nel rivestimento. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Ammortamento del rivestimento';
$ec_lang['cs_notes_3_def']='Inserire il valore dell\'acqua e il costo del rivestimento in qualsiasi valuta coerente. L\'area di rivestimento = lunghezza del tratto × perimetro bagnato — il perimetro bagnato della sezione trasversale del canale alla profondità di flusso misurata (larghezza di fondo più entrambe le sponde bagnate). Il valore annuo recuperato presuppone che il canale rivestito raggiunga l\'efficienza obiettivo E<sub>c</sub> in modo continuo. L\'ammortamento effettivo sarà più lungo per i canali stagionali o se il rivestimento non raggiunge l\'efficienza obiettivo.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3ª ed. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='Informazioni';
$ec_lang['install_main_menu']='Installa';
$ec_lang['install_main_title']='Installa EngCalcs';
$ec_lang['install_main_desc']='Aggiungi al tuo dispositivo per l\'uso offline';
$ec_lang['install_intro']='EngCalcs è una Progressive Web App (PWA). Una volta installata, tutti i calcolatori funzionano completamente offline: non serve alcuna connessione a Internet.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Apri una qualsiasi pagina di calcolo in Chrome.</li><li>Tocca il pulsante <strong>⬇ Installa</strong> nella barra di navigazione superiore, oppure tocca il menu del browser (⋮) e scegli <strong>Aggiungi a schermata Home</strong>.</li><li>Tocca <strong>Installa</strong> nella richiesta che compare.</li><li>EngCalcs comparirà nella schermata Home e funzionerà offline.</li>';
$ec_lang['install_now_btn']='⬇ Installa ora';
$ec_lang['install_prompt_unavailable']='Richiesta di installazione non disponibile: usa invece il menu del browser.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Apri una qualsiasi pagina di calcolo in Safari.</li><li>Tocca il pulsante <strong>Condividi</strong> (il riquadro con la freccia verso l\'alto).</li><li>Scorri verso il basso e tocca <strong>Aggiungi a Home</strong>.</li><li>Tocca <strong>Aggiungi</strong>. EngCalcs comparirà nella schermata Home.</li>';
$ec_lang['install_ios_note']='Su iOS l\'installazione avviene sempre tramite il menu Condividi: non compare alcuna richiesta di installazione automatica.';
$ec_lang['install_desktop_heading']='Desktop (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Apri una qualsiasi pagina di calcolo.</li><li>Fai clic sull\'<strong>icona di installazione</strong> (⊕ o icona a forma di computer) nella barra degli indirizzi del browser, oppure apri il menu del browser e scegli <strong>Installa EngCalcs…</strong></li><li>Fai clic su <strong>Installa</strong>. EngCalcs si aprirà come app autonoma in una propria finestra.</li>';
$ec_lang['install_firefox_heading']='Firefox / Altri browser';
$ec_lang['install_firefox_body']='Se il tuo browser non offre alcuna opzione di installazione, non perdi nulla: usa i calcolatori normalmente nel browser, e dopo la prima visita le pagine vengono memorizzate automaticamente nella cache per l\'uso offline. Firefox su desktop è il caso comune.';
$ec_lang['install_cached_heading']='Cosa viene memorizzato nella cache';
$ec_lang['install_cached_body']='La prima volta che installi EngCalcs, tutte le pagine dei calcolatori e i relativi file di supporto (script, stili) vengono salvati automaticamente sul tuo dispositivo. Da quel momento, tutto funziona senza connessione a Internet. La lingua scelta viene ricordata dall\'ultima visita online.';
$ec_lang['contact_main_menu']='Contatto';
$ec_lang['about_main_title']='Informazioni sui calcolatori HawsEDC';
$ec_lang['about_main_desc']='Missione, software libero e contributi';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Missione</h3><p>Le Calcolatrici di Ingegneria HawsEDC esistono per servire ingegneri e operatori sul campo in tutto il mondo — in particolare coloro che lavorano in regioni con scarsità d\'acqua, risorse limitate o poco servite. Questi strumenti fanno parte di una missione umanitaria più ampia: dire a ogni essere umano nel modo più pratico ed efficace possibile che è amato e prezioso per sempre, che non ha nulla da temere e che non rovinerà tutto.</p><p>Le calcolatrici sono il mezzo. La destinazione è un mondo libero dalla sofferenza.</p><h3>Licenza di software libero e open source</h3><p>Tutto il codice è rilasciato sotto la <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">Licenza Pubblica Generale GNU v3.0 o successiva</a> — libero come nella libertà. Puoi usare, studiare, modificare e ridistribuire il codice secondo gli stessi termini.</p><p>Questo è un invito, non un prezzo. Non esiste un livello a pagamento, né un livello gratuito che possa essere ritirato, né un ritardo prima che il codice diventi tuo. La versione completa che vedi oggi è libera per chiunque, ora e per sempre, da usare e da modificare.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Codice Sorgente</h3><p>Il codice sorgente completo è disponibile pubblicamente su GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Puoi sfogliare il codice, segnalare problemi o fare un fork del repository lì.</p><h3>Contribuire</h3><p>Ogni aiuto è benvenuto. <a href="contact.php">Contatta Tom Haws</a>.</p><ul><li><strong>Traduzioni:</strong> Suggerisci una formulazione migliore. Migliora o aggiungi una lingua.</li><li><strong>Segnalazioni di bug:</strong> Usa il modulo di feedback su qualsiasi pagina della calcolatrice, o segnala un problema su GitHub.</li><li><strong>Nuove calcolatrici:</strong> Le idee per strumenti di ingegneria idraulica al servizio di operatori sul campo e professionisti dell\'irrigazione sono particolarmente benvenute.</li><li><strong>Hosting:</strong> Se puoi ospitare una copia di queste calcolatrici per una regione con connettività limitata, contattami.</li></ul><h3>Uso offline</h3><p>Questi calcolatori funzionano come una <strong>App Web Progressiva (PWA)</strong>. Visita qualsiasi pagina del calcolatore mentre sei connesso e il tuo browser memorizzerà automaticamente tutti i calcolatori nella cache. Dopodiché, tutti i calcolatori funzionano offline — senza necessità di internet.</p><p>Su Android o iOS, usa l\'opzione "Aggiungi alla schermata iniziale" del tuo browser per installare EngCalcs come app sul tuo dispositivo. Su desktop, cerca l\'icona di installazione nella barra degli indirizzi del browser.</p><p>Puoi anche salvare qualsiasi calcolatore individuale usando il menu "Salva con nome…" del tuo browser per un utilizzo offline occasionale.</p><h3>Contatto</h3><p>Tom Haws, ingegnere idraulico e fondatore di queste calcolatrici.<br />Usa il modulo di feedback su qualsiasi pagina della calcolatrice, o accedi al codice sorgente su <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Invia un messaggio a Tom Haws';
$ec_lang['contactYourName']='Nome:';
$ec_lang['contactYourEmail']='Indirizzo e-mail:';
$ec_lang['contactSubject']='Oggetto:';
$ec_lang['contact_message']='Messaggio:';
$ec_lang['contactSpamPrefix']='Cinque più uno è';
$ec_lang['contactSpamPostfix']='(Scrivere in inglese. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Invia messaggio';
$ec_lang['contact_success']='Grazie per aver dedicato il tempo a scrivere.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Progetto di Scivolo in Pietrame (Robinson)';
$ec_lang['rc_main_title']='Calcolatore Gratuito per Progetto di Scivolo in Pietrame — Robinson (1998)';
$ec_lang['rc_main_desc']='Dimensionamento del Pietrame per Scivolo — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Pendenza del fondo dello scivolo, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Portata per unità di larghezza all\'ingresso dello scivolo. Per un canale di larghezza di fondo B con portata totale Q, usare q_t = Q / B.">Portata specifica totale, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Porosità del pietrame, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Densità relativa rispetto all\'acqua. Tipicamente granito o basalto frantumato ≈ 2,65. Intervallo valido Robinson: 2,54 a 2,82.">Densità relativa della roccia, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Deviazione standard granulometrica. Roccia uniforme ≈ 1,25. Intervallo valido Robinson: 1,15 a 1,47.">Gradazione SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Il rigurgito (Hp > yn) è favorevole — riduce l\'erosione a monte. (USDA)">Tirante normale nel canale di ingresso, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Eq. 1 (S0 < 0,10) o Eq. 2 (0,10–0,40). Valido: D50 15–278 mm, S0 0,02–0,40. Fuori intervallo: estrapolato.">Dimensione mediana richiesta della roccia, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Equazione applicata';
$ec_lang['rc_sg_check']='Verifica della densità relativa';
$ec_lang['rc_SD_check']='Verifica della gradazione SD';
$ec_lang['rc_sg_ok']   ='sg nell\'intervallo valido';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg al di sotto dell\'intervallo Robinson';
$ec_lang['rc_sg_low_tip']='Intervallo valido: 2,54–2,82';
$ec_lang['rc_sg_high'] ='sg al di sopra dell\'intervallo Robinson';
$ec_lang['rc_sg_high_tip']='Intervallo valido: 2,54–2,82';
$ec_lang['rc_SD_ok']   ='SD nell\'intervallo valido';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD al di sotto dell\'intervallo Robinson';
$ec_lang['rc_SD_low_tip']='Intervallo valido: 1,15–1,47';
$ec_lang['rc_SD_high'] ='SD al di sopra dell\'intervallo Robinson';
$ec_lang['rc_SD_high_tip']='Intervallo valido: 1,15–1,47';
$ec_lang['rc_layer']='Spessore dello strato di pietrame (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Raggio di curvatura in sommità (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Lunghezza d\'arco in sommità';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Necessario per il supporto strutturale della roccia dello scivolo. “Il tirante minimo di valle risultante dal tratto di uscita e dalla resistenza del canale a valle è sufficiente a garantire la stabilità del pietrame nel tratto di uscita.” (Robinson)">Lunghezza della platea di uscita (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Scabrezza di Manning nello scivolo, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Frazione di qt che scorre attraverso i pori della roccia. Il resto qs scorre in superficie. np predefinito = 0,45 per roccia frantumata angolare.">Velocità attraverso il mantello di roccia, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Portata specifica nel mantello, q<sub>m</sub>';
$ec_lang['rc_qs']='Portata specifica superficiale, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Altezza idrica sopra la superficie del pietrame, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Il rigurgito (Hp > yn) è favorevole — riduce l\'erosione a monte. (USDA)">Carico sulla soglia di ingresso, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Verifica del rigurgito all\'imbocco';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — rigurgito a monte';
$ec_lang['rc_pond_ok_tip']='Il rigurgito a monte dell\'imbocco dello scivolo è favorevole; riduce l\'erosione a monte. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — nessun rigurgito — rischio di erosione all\'imbocco';
$ec_lang['rc_pond_warn_tip']='Nessun rigurgito a monte dell\'imbocco dello scivolo; potrebbe verificarsi erosione a monte. (USDA)';
$ec_lang['rc_eq1']='Eq. 1 (S<sub>0</sub> < 0,10) — pendenza dolce';
$ec_lang['rc_eq2']='Eq. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — pendenza ripida';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — al di sotto dell\'intervallo di validazione Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — al di sopra dell\'intervallo di validazione Robinson';
$ec_lang['rc_notes_1_term']='Equazioni di dimensionamento della roccia';
$ec_lang['rc_notes_1_def']='Robinson, Rice e Kadavy (1998) hanno sviluppato due equazioni empiriche per la dimensione mediana del pietrame D<sub>50</sub> a partire dalla pendenza del canale e dalla portata unitaria. L\'equazione 1 si applica a pendenze dolci (S<sub>0</sub> < 0,10); l\'equazione 2 si applica a pendenze ripide (0,10 ≤ S<sub>0</sub> ≤ 0,40). Entrambe le equazioni richiedono q<sub>t</sub> in m²/s e restituiscono D<sub>50</sub> in mm. L\'intervallo validato è 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Portata specifica';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> è la portata specifica totale alla sommità dello scivolo (portata totale per unità di larghezza). Per un canale di larghezza di fondo B con portata totale Q, q<sub>t</sub> ≈ Q / B, oppure si calcola dalla condizione di tirante critico all\'ingresso dello scivolo.';
$ec_lang['rc_notes_3_term']='Deflusso attraverso il mantello di roccia';
$ec_lang['rc_notes_3_def']='Una frazione della portata totale scorre attraverso i pori del pietrame (portata di mantello q<sub>m</sub>); il resto scorre sulla superficie della roccia (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). L\'altezza idrica d è calcolata con l\'equazione di Manning applicata alla portata superficiale q<sub>s</sub> usando la scabrezza n dello scivolo. La porosità predefinita n<sub>p</sub> = 0,45 è tipica per roccia frantumata angolare.';
$ec_lang['rc_notes_5_term']='Intervallo valido di dimensione della roccia';
$ec_lang['rc_notes_5_def']='Le equazioni sono state sviluppate per un intervallo D<sub>50</sub> da 15 mm a 278 mm. I risultati al di fuori di questo intervallo sono estrapolati e devono essere utilizzati con ulteriore giudizio ingegneristico.';
$ec_lang['rc_notes_6_term']='Quota della superficie della platea di uscita';
$ec_lang['rc_notes_6_def']='La quota della sommità del pietrame nel tratto di uscita deve essere pari o inferiore alla quota del fondo del canale a valle. Se è più alta, la roccia di uscita sarà instabile.';

$ec_lang['rc_notes_7_def']='Quando il tirante normale nel canale di ingresso è inferiore al carico sullo stramazzo (H<sub>p</sub>) necessario per transitare q<sub>t</sub>, si verifica un deflusso limitato o un rigurgito a monte dell\'imbocco dello scivolo. Ciò è generalmente accettabile — il rigurgito riduce la velocità e previene l\'erosione a monte. Per verificare: utilizzare un calcolatore di stramazzo per trovare H<sub>p</sub> per il q<sub>t</sub> e la larghezza di cresta dati, e confrontarlo con il tirante normale del canale di ingresso. Se H<sub>p</sub> supera il tirante normale, si verificherà rigurgito.';
$ec_lang['rc_notes_4_term']='Riferimento';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., e Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. L\'USDA ARS pubblica anche un <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">foglio di calcolo Excel</a> basato sullo stesso metodo.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Filtro';
$ec_lang['rc_sketch_top_crest_curve'] = 'Curva di cresta';
$ec_lang['rc_sketch_outlet_apron']    = 'Platea di uscita';
$ec_lang['rc_sketch_radius']          = 'raggio';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Pressione di irrigazione';
$ec_lang['ip_main_title']='Calcolatrice online gratuita per la pressione di irrigazione e l\'uniformità di distribuzione';
$ec_lang['ip_main_desc']='Verifica della pressione nel ramo di prova e stima dell\'uniformità';
$ec_lang['ip_h_supply']='Pressione di alimentazione';
$ec_lang['ip_elev_supply']='Quota di alimentazione, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Portata di progetto dell\'emettitore, q<sub>design</sub>';
$ec_lang['ip_h_design']='Pressione di progetto dell\'emettitore';
$ec_lang['ip_x']='<span class="ec-help" title="0,5 per emettitori standard non compensati; vicino a 0 per emettitori autocompensanti">Esponente di scarico dell\'emettitore, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Percorso di prova';
$ec_lang['ip_group_reach']='Tratto';
$ec_lang['ip_group_upstream']='A monte';
$ec_lang['ip_group_downstream']='A valle';
$ec_lang['ip_group_loss']='Perdita';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Selezionato: questo tratto è un segmento dell\'ala laterale di prova, dalla quale i singoli emettitori prelevano acqua. Non selezionato: questo tratto è una condotta principale, che si limita a trasmettere la portata alle ali laterali non presenti nel percorso di prova.">Lat. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Righe ala laterale: emettitori solo in questo tratto. Righe condotta principale: numero totale di emettitori sulle ali laterali DIVERSE da questa che si diramano da questo tratto. Per il tratto della condotta principale che termina all\'ala laterale di prova, questo include anche tutte le ali laterali oltre quel punto lungo la condotta principale, o che condividono lo stesso nodo (ad esempio un\'ala laterale sul lato opposto) — anche la loro portata si dirama da questo stesso tratto.">Emettitori <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Quota all\'estremità di valle di questo tratto. Facoltativa nelle righe interne (predefinita: piatta, cioè uguale al nodo superiore, se lasciata vuota). Obbligatoria nell\'ultima riga: quel valore è la quota dell\'ultimo emettitore, che determina direttamente la pressione di alimentazione richiesta.">Elev. V. <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='La quota dell\'ultimo emettitore (ultima riga) è stata lasciata vuota ed è stata impostata come piatta per impostazione predefinita — inserirla per un risultato accurato';
$ec_lang['ip_flow']='Portata';
$ec_lang['ip_press']='Press.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Perdita totale del tratto, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Pressione bassa/negativa — verificare eventuali condizioni subatmosferiche';
$ec_lang['ip_pressure_warn_short']='Bassa';
$ec_lang['ip_pressure_high']='Pressione alta — necessaria la riduzione della pressione';
$ec_lang['ip_pressure_high_short']='Alta';
$ec_lang['ip_max_head']='Press. max. amm. tubo';
$ec_lang['ip_max_head_tip']='Le linee la cui pressione supera questo valore vengono segnalate. Lasciare vuoto per saltare il controllo dell\'alta pressione.';
$ec_lang['ip_h_far']='Pressione all\'ultimo emettitore';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Portata in ingresso al solo percorso di prova modellato — per l\'intera zona/sistema, vedere Q_zone in Progettazione dell\'applicazione qui sotto.">Portata di alimentazione del percorso di prova, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Portata dell\'ultimo emettitore, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Portata media dell\'emettitore (ala laterale di prova), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="Quanto più alta (o più bassa) si stima che un\'ala laterale tipica operi rispetto a questa ala laterale di prova. L\'ala laterale di prova è deliberatamente il caso peggiore presunto, quindi la sua stessa media è una sottostima della media di campo — se lasciato a 0, la verifica di uniformità e i valori di progettazione dell\'applicazione qui sotto usano la media dell\'ala laterale di prova stessa (probabilmente ottimistica) così com\'è.">Stima Δpressione, media rispetto all\'ala laterale di prova <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral rivalutata alla pressione di ciascuna riga dell\'ala laterale più la differenza di pressione inserita sopra — un tentativo di correggere il fatto che l\'ala laterale di prova sia il caso peggiore presunto, non uno rappresentativo. Alimenta sia la verifica di uniformità sia la sezione di progettazione dell\'applicazione qui sotto.">Stima della portata media di campo dell\'emettitore, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Portata calcolata dell\'ultimo emettitore divisa per la portata media di campo stimata dell\'emettitore — questa è un\'approssimazione della uniformità di distribuzione del quarto inferiore standard (media del gruppo inferiore ÷ media della popolazione); questa deriva da un piccolo campione modellato e da una correzione stimata dall\'utente anziché da un campione statistico completo sul campo. Valori pari o superiori a 1 sono possibili e validi: significano solo che la pressione dell\'ultimo emettitore è pari o superiore alla media di campo stimata, quindi qualche altro emettitore è il punto di pressione più bassa. Ciò potrebbe essere dovuto al fatto che l\'ultimo emettitore si trova su un terreno più basso oppure che la stima di Δpressione è troppo piccola.">Verifica di uniformità, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='La pressione all\'emettitore di prova è ≥ alla pressione di alimentazione. Probabilmente questo non è l\'emettitore nel caso peggiore, oppure le tubazioni potrebbero essere ridotte.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Questo è diverso dalla nostra approssimazione della misura di uniformità standard.">Portata dell\'ultimo emettitore ÷ portata di progetto, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Nessuna soluzione: la pressione di alimentazione richiesta supera la pressione di alimentazione inserita. Aumentare la pressione di alimentazione, ridurre la domanda, oppure utilizzare una tubazione più grande.';
$ec_lang['ip_notes_1_def']='Ipotizza la pressione all\'ultimo emettitore (il più remoto), poi retrocede la linea dei carichi totali verso l\'alimentazione, tratto per tratto, aggiungendo le perdite per attrito e le perdite concentrate lungo il percorso. La quota e l\'altezza cinetica vengono sottratte a ogni nodo per calcolare la pressione effettiva in quel punto. La pressione ipotizzata all\'estremità remota viene regolata (bisezione) finché la pressione di alimentazione richiesta calcolata non corrisponde alla pressione di alimentazione inserita — lo stesso problema a circuito chiuso affrontato dal risolutore di flusso in tubazione della calcolatrice Manning Pipe Flow, esteso a una rete ramificata.';
$ec_lang['ip_notes_2_term']='Tratti di condotta principale e ala laterale';
$ec_lang['ip_notes_2_def']='Ogni riga è un tratto lungo l\'unico percorso idraulicamente peggiore (il percorso di prova) dall\'alimentazione all\'ultimo emettitore. Un tratto di condotta principale trasmette solamente la portata alle ali laterali non presenti nel percorso di prova, quindi il suo prelievo è una semplice moltiplicazione (portata di progetto × il numero totale di emettitori del tratto) — nessuna sensibilità di pressione locale. La condotta principale è una tubazione tronco condivisa, quindi il tratto della condotta principale che termina all\'ala laterale di prova deve includere non solo le ali laterali comprese tra i propri estremi, ma anche qualsiasi ala laterale ulteriore lungo la condotta principale oltre quel punto, o che condivide lo stesso nodo (ad esempio un\'ala laterale sul lato opposto) — la loro portata attraversa quello stesso tratto prima di diramarsi, che appaiano o meno altrove in questa tabella. Un tratto di ala laterale è un segmento dell\'ala laterale di prova stessa: la portata dell\'emettitore viene calcolata dalla pressione locale effettiva tramite q = k·H<sup>x</sup>, e la perdita per attrito viene ridotta dal fattore F(n) di Christiansen per tenere conto della diminuzione della portata man mano che ciascun emettitore nel tratto preleva acqua.';
$ec_lang['ip_notes_3_term']='Limitazioni';
$ec_lang['ip_notes_3_def']='Modella una pressione di alimentazione fissa (nessuna curva di pompa), un solo percorso di prova (non l\'intero campo), e una curva dell\'emettitore a 2 parametri (impostare l\'esponente vicino a 0 per approssimare un emettitore autocompensante). Vengono riportati due diversi rapporti di uniformità, tenuti deliberatamente separati: q<sub>last</sub>/q<sub>avg,field</sub> è un\'approssimazione della uniformità di distribuzione del quarto inferiore standard (media del gruppo inferiore ÷ media della popolazione); ma questa deriva da un piccolo campione modellato e da una correzione stimata dall\'utente anziché dal campione statistico completo standard sul campo. Inoltre, l\'ala laterale di prova è deliberatamente il caso peggiore presunto, quindi la sua media grezza, non corretta, sottostimerebbe la vera media di campo e farebbe apparire l\'uniformità migliore di quanto sia in realtà; l\'input di Δpressione esiste specificamente per contrastare questo effetto. Valori di uniformità pari o superiori a 1 restano possibili: significano solo che la pressione dell\'ultimo emettitore è pari o superiore alla media di campo stimata, quindi qualche altro emettitore è il punto di pressione più bassa. Ciò potrebbe essere dovuto al fatto che l\'ultimo emettitore si trova su un terreno più basso oppure che la stima di Δpressione è troppo piccola. q<sub>last</sub>/q<sub>design</sub> è una verifica diversa, non di uniformità, rispetto alla portata nominale del produttore — utile per rilevare un sistema complessivamente sovra- o sottopressurizzato, ma è una verifica separata da leggere insieme al valore di uniformità, poiché la portata di progetto/nominale è indipendente dalla pressione media di esercizio effettiva del sistema.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. Gli standard ASAE/ASABE per la progettazione della microirrigazione utilizzano lo stesso approccio alla perdita per attrito multi-uscita.';
$ec_lang['ip_notes_5_term']='Progettazione dell\'applicazione';
$ec_lang['ip_notes_5_def']='Il tasso di applicazione e la portata di sistema/zona utilizzano la portata media di campo stimata dell\'emettitore (q<sub>avg,field</sub> — la media dell\'ala laterale di prova stessa, corretta dalla stima di Δpressione inserita), non un tasso ipotizzato: PR = q<sub>avg,field</sub> / A<sub>e</sub>, alimentato dal valore modellato corretto. La spaziatura e il numero di ali laterali/emettitori dell\'intero sistema sono input separati qui, poiché il percorso di prova modella solo un ramo nel caso peggiore, non ogni ala laterale del campo.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Rete di tubazioni ramificata';
$ec_lang['bpn_main_title']='Calcolatore online gratuito di pressione per reti di tubazioni ramificate (senza anelli)';
$ec_lang['bpn_main_desc']='Portata e pressione in rete di tubazioni ramificata (ad albero)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Carico statico di alimentazione: il carico della fonte a portata zero. Il livello dell\'acqua di un serbatoio o cisterna sopra la quota di alimentazione, oppure il carico a valvola chiusa di una pompa. Aggiungere i punti di alimentazione 2 e 3 per definire una pompa o una curva di alimentazione variabile; lo strumento legge il carico alla portata di progetto.';
$ec_lang['bpn_elev_source']='Quota di alimentazione';
$ec_lang['bpn_q_total']='Portata totale';
$ec_lang['bpn_q_total_tip']='Portata totale in uscita dalla fonte (la somma di tutte le richieste della rete).';
$ec_lang['bpn_p_min']='Pressione minima';
$ec_lang['bpn_p_min_tip']='La pressione più bassa a valle in qualsiasi punto della rete; il punto critico di erogazione.';
$ec_lang['bpn_method']='Metodo di attrito';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Tratti di tubazione';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Nome di questo tratto di tubazione. Altri tratti lo richiamano nella colonna Monte.';
$ec_lang['bpn_upstream']='ID a monte';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID del tratto che alimenta questo. Lasciare vuoto per seguire il tratto direttamente sopra (una tubazione in serie semplice). Inserire un ID qui per ramificarsi da un tratto diverso.';
$ec_lang['bpn_roughness_tip']='Scabrezza della tubazione per il metodo di attrito selezionato: n di Manning, C di Hazen-Williams, oppure altezza di scabrezza e di Darcy-Weisbach (una lunghezza). Tubazione in plastica liscia tipica: n circa 0,009, C circa 150, e circa 0,0015 mm.';
$ec_lang['bpn_demand']='Richiesta';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Portata fissa erogata all\'estremità a valle di questo tratto.';
$ec_lang['bpn_demand_mult']='Moltiplicatore della domanda';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Applica un fattore di scala a tutte le domande dei tratti contemporaneamente, per un\'analisi dell\'ora di punta o della crescita futura. Usare 1 per le domande così come inserite.';
$ec_lang['bpn_elev_down']='Quota valle';
$ec_lang['bpn_q_line']='Portata del tratto';
$ec_lang['bpn_q_line_tip']='Portata totale trasportata da questo tratto: la propria richiesta più ogni richiesta a valle che alimenta.';
$ec_lang['bpn_p_down']='Press. valle';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Carico di pressione relativa al nodo di valle di questo tratto. Un valore negativo (segnalato) indica pressione subatmosferica; verificare il progetto.';
$ec_lang['bpn_sketch_heading']='Schema della rete';
$ec_lang['bpn_show_length']='Lunghezza';
$ec_lang['bpn_show_diameter']='Diametro';
$ec_lang['bpn_show_q']='Portata';
$ec_lang['bpn_show_p']='Pressione';
$ec_lang['bpn_source_label']='Fonte';
$ec_lang['bpn_line_problem']='Questo tratto non è collegato alla fonte: punta a un ID a monte sconosciuto, punta a se stesso, ripete un ID già usato da un altro tratto, oppure forma un anello. I tratti non collegati restano irrisolti.';
$ec_lang['bpn_bad_id_short']='ID non valido';


$ec_lang['bpn_pressure_warn']='Pressione bassa/negativa; verificare eventuali condizioni subatmosferiche';
$ec_lang['bpn_pressure_warn_short']='Bassa';
$ec_lang['bpn_notes_1_term']='In serie per impostazione predefinita, ramificata per eccezione';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Lasciare l\'ID a monte vuoto e un tratto segue quello sopra; una tubazione in serie semplice. Inserire l\'ID di un tratto a monte per ramificarsi da esso. Quindi: in serie per impostazione predefinita, un albero quando serve.';
$ec_lang['bpn_notes_2_term']='Solo reti ramificate, senza anelli';
$ec_lang['bpn_notes_2_def']='Ogni tratto ha esattamente un tratto a monte (un albero). Questo strumento non risolve reti ad anello; quelle richiedono metodi iterativi (EPANET o simili). Escludere gli anelli è ciò che mantiene lo strumento semplice ed esatto.';
$ec_lang['bpn_notes_3_term']='Nessun controllo di pressione attivo';
$ec_lang['bpn_notes_3_def']='È possibile aggiungere una valvola a perdita di carico concentrata fissa (un valore k), ma non valvole riduttrici o sostenitrici di pressione (PRV/PSV). Il loro stato aperto/chiuso dipende da portata e pressione, il che richiederebbe l\'iterazione.';


$ec_lang['bpn_supply2_q']='Portata di alimentazione 2';
$ec_lang['bpn_supply2_h']='Carico di alimentazione 2';
$ec_lang['bpn_supply3_q']='Portata di alimentazione 3';
$ec_lang['bpn_supply3_h']='Carico di alimentazione 3';
$ec_lang['bpn_supply_pt_tip']='Punti opzionali 2 e 3 della curva di alimentazione. Inserire una portata e un carico per ciascuno per modellare una pompa, o qualsiasi fonte il cui carico diminuisce erogando più portata; lo strumento legge il carico alla portata di progetto. Il punto 1 sopra è il carico statico a portata zero. Lasciare 2 e 3 vuoti per un carico di serbatoio costante.';
$ec_lang['bpn_h_supply']='Carico di alimentazione';
$ec_lang['bpn_h_supply_tip']='Carico della fonte alla portata di progetto, letto dalla curva di alimentazione. Coincide con il carico di fonte inserito quando la curva è piatta (un serbatoio).';
$ec_lang['bpn_show_elevation']='Quota';
$ec_lang['bpn_supply1_h']='Carico statico di alimentazione';
$ec_lang['lpn_main_menu']='Rete di distribuzione idrica';
$ec_lang['lpn_main_title']='Modellazione online gratuita di reti di distribuzione idrica con il risolutore EPANET';
$ec_lang['lpn_main_desc']='Analisi di reti di distribuzione idrica: disegna una rete di tubazioni magliata o importa file EPANET';
$ec_lang['lpn_title_units']='Unità {units}';
$ec_lang['lpn_tool_select']='Seleziona';
$ec_lang['lpn_tool_add_junction']='Nodo';
$ec_lang['lpn_tool_add_reservoir']='Serbatoio';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Vasca';
$ec_lang['lpn_tool_add_pipe']='Tubazione';
$ec_lang['lpn_tool_add_pump']='Pompa';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Valvola';
$ec_lang['lpn_tool_add_text']='Testo';
$ec_lang['lpn_tool_vertices']='Vertici';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Cliente';
$ec_lang['lpn_tool_add_meter_tip']='Fai clic dove si trova il cliente, poi fai clic sulla tubazione o sul nodo che lo serve. La richiesta assegnata al cliente viene aggiunta al nodo all\'estremità più vicina di quella tubazione.';
$ec_lang['lpn_mode_add_meter']='Cliente: fai clic dove si trova il cliente, poi fai clic sulla tubazione o sul nodo che lo serve. Oppure premi Esc per annullare.';
$ec_lang['lpn_pane_tab_customers']='Clienti';
$ec_lang['lpn_customer_heading']='Cliente {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Richiesta per servizio';
$ec_lang['lpn_field_meter_demand_tip']='Quanto richiede ciascun servizio presso questo cliente. Trova e sostituisci può sfruttare la distinzione tra vuoto e 0.';
$ec_lang['lpn_field_meter_count']='Numero di servizi';
$ec_lang['lpn_field_meter_count_tip']='Quanti servizi identici rappresenta questo cliente, così che quarantadue allacci unifamiliari lungo una stessa condotta possano essere un unico simbolo in un unico punto. Il totale qui sotto è la richiesta sopra moltiplicata per questo numero.';
$ec_lang['lpn_field_meter_total']='Richiesta totale';
$ec_lang['lpn_field_meter_total_tip']='La richiesta per servizio moltiplicata per il numero di servizi. È il numero aggiunto al nodo indicato qui sotto.';
$ec_lang['lpn_field_meter_pipe']='Elemento collegato';
$ec_lang['lpn_field_meter_pipe_suggest']='L\'elemento più vicino è {id}. Digitalo qui per servire questo cliente da esso.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Collegato a';
$ec_lang['lpn_field_meter_node_tip']='Il nodo a cui è collegato questo cliente. Trascina il punto di collegamento su una tubazione per servirlo invece da una progressiva lungo quella tubazione.';
$ec_lang['lpn_meter_pipe_unknown']='Nessun elemento di questo progetto si chiama {id}, quindi il cliente è stato lasciato dov\'era.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='Come sale e scende la richiesta di questo cliente nel corso del calcolo. Moltiplica la richiesta totale, quindi agisce su ogni servizio che questo cliente rappresenta. Lascialo su Nessun modello per seguire il Modello di richiesta predefinito del progetto.';
$ec_lang['lpn_meter_pattern_unknown']='Nessun modello di questo progetto si chiama {id}, quindi il cliente è stato lasciato com\'era.';
$ec_lang['lpn_meter_placed']='Cliente {id} aggiunto. La sua descrizione e la sua richiesta si digitano nella tabella Clienti, oppure premilo in Seleziona per aprire il suo riquadro.';
$ec_lang['lpn_field_meter_pipe_tip']='L\'elemento a cui si collega questo servizio. Digitane un altro qui o nella tabella Clienti per cambiarlo, oppure trascina il punto di collegamento su un elemento diverso.';
$ec_lang['lpn_field_meter_station']='Progressiva lungo la tubazione (%)';
$ec_lang['lpn_field_meter_station_tip']='A che distanza lungo la tubazione si collega il servizio, come percentuale della tubazione dal suo primo nodo al secondo. 0 è a un\'estremità e 100 all\'altra. Il cerchio sulla tubazione fa la stessa cosa con il puntatore.';
$ec_lang['lpn_field_meter_offset']='Scostamento dalla tubazione';
$ec_lang['lpn_field_meter_offset_tip']='Positivo è a destra della tubazione guardando dal suo primo nodo verso il secondo. Digitare un valore qui può spostare il cliente sull\'altro lato della condotta, e mette sempre la linea di servizio ad angolo retto con la condotta.';
$ec_lang['lpn_field_meter_lumped']='Aggiunto al nodo';
$ec_lang['lpn_field_meter_lumped_tip']='Nodo più vicino; qui vengono aggiunte le richieste di questo cliente.';
$ec_lang['lpn_node_customers']='Richieste dei clienti';
$ec_lang['lpn_node_customers_tip']='Elenco dei clienti aggiunti a questo nodo (perché era il più vicino). Le richieste dei clienti si sommano alle altre richieste qui elencate. Un cliente si modifica dove si trova sulla mappa o nella tabella Clienti.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} da {n} clienti';
$ec_lang['lpn_customer_detached']='⚠ Questo cliente non è collegato a una tubazione, quindi la sua richiesta non è nei risultati. Eliminalo, oppure disegna una tubazione e sposta il cliente su di essa.';
$ec_lang['lpn_customer_fixed_head']='⚠ L\'estremità più vicina di quella tubazione ha una superficie dell\'acqua fissa, quindi questa richiesta non influisce sulla simulazione.';
$ec_lang['lpn_customer_detached_count']='{n} clienti non sono collegati a una tubazione. La loro richiesta non è considerata.';
$ec_lang['lpn_meter_pick_pipe']='Ora fai clic sulla tubazione o sul nodo che serve questo cliente. Il cliente resta dove lo hai messo. Premi Esc per annullare.';
$ec_lang['lpn_inp_export_flat_customers']='Un file EPANET non ha clienti. La richiesta dei {n} clienti di questo progetto entra nel file come riga di richiesta sul nodo a cui ciascuno è aggiunto, e ogni riga prende il nome dall\'etichetta del cliente. Ciò che il file non può contenere è il cliente stesso: dove si trova, quale tubazione lo serve, in quale punto lungo quella tubazione si collega il servizio, e quanti servizi rappresenta un cliente. Il tuo file di progetto conserva tutto questo.';

$ec_lang['lpn_area_hint_window_start']='Fai clic su un angolo della finestra.';
$ec_lang['lpn_area_hint_window_go']='Fai clic sull\'angolo opposto per terminare.';
$ec_lang['lpn_area_hint_lasso_start']='Fai clic per iniziare il contorno.';
$ec_lang['lpn_area_hint_lasso_go']='Sposta il puntatore per disegnare il contorno. Fai clic per terminare.';
$ec_lang['lpn_area_hint_polygon_start']='Fai clic per disegnare l\'area poligonale. Fai doppio clic per terminare.';
$ec_lang['lpn_area_hint_polygon_go']='Fai clic su ogni angolo. Fai doppio clic sull\'ultimo per terminare.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Tieni premuto Maiusc mentre selezioni per continuare con la selezione esistente, aggiungendo o rimuovendo (a scelta) ciò che selezioni.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Premi sulla mappa e trascina intorno a ciò che vuoi, poi solleva il dito.';
$ec_lang['lpn_area_hint_touch_go']='Trascina intorno a ciò che vuoi, poi solleva il dito per terminare.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Mostra questo';
$ec_lang['lpn_multi_title']='{n} selezionati';
$ec_lang['lpn_multi_varies']='Vari';
$ec_lang['lpn_multi_applied']='Impostato {prop} su {n}.';
$ec_lang['lpn_multi_no_fields']='Questi elementi non hanno nulla che possa essere impostato insieme qui.';
$ec_lang['lpn_pane_pasted']='Incollate {n} celle. {skipped} non sono state modificate.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Incollate {n} righe e aggiunte {created} di esse alla rete.';
$ec_lang['lpn_pane_pasted_rows_skipped']='Incollate {n} righe e aggiunte {created} di esse alla rete. {skipped} celle non sono state modificate.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Fai clic qui e incolla righe da un foglio di calcolo per aggiungerle.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Incolla come nuove righe in fondo alla tabella';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Premi Ctrl+V per aggiungere le righe copiate in fondo a questa tabella. Premi Esc per annullare.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Questo incollaggio ha {n} righe, e {fit} di esse entrano nella tabella. Aggiungere le altre {extra} come nuove righe in fondo?';
$ec_lang['lpn_pane_paste_overflow_add']='Aggiungi {extra} righe';
$ec_lang['lpn_pane_paste_overflow_fit']='Incolla solo le {fit} che entrano';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Questo incollaggio ha {n} righe, e {fit} di esse entrano nella tabella. Le altre {extra} non possono essere aggiunte come nuove righe: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} ID non corrispondono. Incollare comunque?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Non è stato incollato nulla. {reasons}';
$ec_lang['lpn_pane_paste_more']='Righe con problemi non mostrate qui: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Riga {row}: una nuova riga richiede un ID.';
$ec_lang['lpn_pane_paste_bad_id']='Riga {row}: l\'ID {id} contiene uno spazio o una virgoletta.';
$ec_lang['lpn_pane_paste_id_taken']='Riga {row}: l\'ID {id} è già in uso.';
$ec_lang['lpn_pane_paste_id_twice']='Riga {row}: l\'ID {id} è usato due volte in questo incollaggio.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Riga {row}: un nuovo nodo richiede sia {first} sia {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Riga {row}: un nuovo collegamento richiede un nodo Da e un nodo A.';
$ec_lang['lpn_pane_paste_no_node']='Riga {row}: il nodo {id} non esiste ancora. Incolla prima i nodi, poi i collegamenti.';
$ec_lang['lpn_pane_paste_same_ends']='Riga {row}: Da e A sono lo stesso nodo.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Riga {row}: {text} non è un valore valido per {col}.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Riga {row}: un nuovo Testo richiede sia {first} sia {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Riga {row}: {id} non è ancora un nodo o una tubazione in questa rete. Incollalo prima, poi questo Testo.';
$ec_lang['lpn_pane_paste_customer_no_position']='Riga {row}: un nuovo Cliente richiede sia {first} sia {second}.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Riga {row}: un nuovo Cliente richiede una tubazione o un nodo collegato.';
$ec_lang['lpn_pane_paste_no_pipe']='Riga {row}: la tubazione {id} non esiste ancora. Incolla prima le tue tubazioni, poi i tuoi clienti.';
$ec_lang['lpn_pane_paste_no_customer_node']='Riga {row}: il nodo {id} non esiste ancora. Incolla prima i tuoi nodi, poi i tuoi clienti.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Riga {row}: il nodo {id} non ha una tubazione a cui un Cliente possa collegarsi.';
$ec_lang['lpn_pane_filled']='Riempite verso il basso {n} celle. {skipped} non sono state modificate.';
$ec_lang['lpn_pane_filldown']='Riempi verso il basso';
$ec_lang['lpn_pane_fill_none']='Niente in questa selezione può essere riempito verso il basso.';
$ec_lang['lpn_pane_ctrlenter_filled']='Riempite {n} celle. {skipped} non sono state modificate.';
$ec_lang['lpn_pane_hide_col']='Nascondi questa colonna';
$ec_lang['lpn_pane_hide_cols']='Nascondi queste colonne';
$ec_lang['lpn_pane_show_all_cols']='Mostra tutte le colonne';
$ec_lang['lpn_pane_sort_asc']='Ordina in modo crescente';
$ec_lang['lpn_pane_manage_cols']='Gestisci colonne…';
$ec_lang['lpn_pane_manage_cols_title']='Gestisci colonne';
$ec_lang['lpn_pane_manage_cols_show']='Mostra';
$ec_lang['lpn_pane_manage_cols_up']='Sposta in alto';
$ec_lang['lpn_pane_manage_cols_down']='Sposta in basso';
$ec_lang['lpn_pane_manage_cols_top']='Sposta all\'inizio';
$ec_lang['lpn_pane_manage_cols_bottom']='Sposta alla fine';
$ec_lang['lpn_pane_colmenu_tip']='Nascondi o gestisci le colonne';
$ec_lang['lpn_pane_sortarrow_tip']='Inverti l\'ordinamento';
$ec_lang['lpn_tool_area_window']='Seleziona una finestra';
$ec_lang['lpn_tool_area_lasso']='Seleziona un lazo';
$ec_lang['lpn_tool_area_polygon']='Seleziona un poligono';
$ec_lang['lpn_tool_delete']='Elimina';
$ec_lang['lpn_tool_zoom_extent']='Adatta tutto alla vista';
$ec_lang['lpn_tool_zoom_window']='Zoom finestra';
$ec_lang['lpn_zoom_in']='Aumenta zoom';
$ec_lang['lpn_zoom_out']='Riduci zoom';
$ec_lang['lpn_new_text']='Testo';
$ec_lang['lpn_field_text_bold']='Testo in grassetto';
$ec_lang['lpn_field_text_anchor']='Collegato a';
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

$ec_lang['lpn_field_text_align']='Allineamento orizzontale';
$ec_lang['lpn_field_text_align_left']='Sinistra';
$ec_lang['lpn_field_text_align_center']='Centro';
$ec_lang['lpn_field_text_align_right']='Destra';
$ec_lang['lpn_field_text_valign']='Allineamento verticale';
$ec_lang['lpn_field_text_valign_top']='Alto';
$ec_lang['lpn_field_text_valign_middle']='Centro';
$ec_lang['lpn_field_text_valign_bottom']='Basso';
$ec_lang['lpn_field_text_rotation']='Angolo (gradi)';
$ec_lang['lpn_field_text_match_pipe']='Ruota alla stessa angolazione del collegamento più vicino';
$ec_lang['lpn_field_text_flip']='Ruota di 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Elemento collegato';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Questo testo è stato posizionato abbastanza vicino a un elemento da seguirlo, quindi si sposta insieme a quell\'elemento e ha una linea di richiamo. Un testo su una linea di richiamo prende il proprio allineamento orizzontale e verticale dal lato su cui si trova, motivo per cui queste due righe non sono proposte mentre è collegato.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Coefficiente dell\'emettitore';
$ec_lang['lpn_field_emitter_tip']='Una portata aggiuntiva in uscita che dipende dalla pressione, per un irrigatore, uno scarico aperto o una perdita simulata. La portata rilasciata è questo coefficiente moltiplicato per la pressione elevata all\'esponente dell\'emettitore, impostato una sola volta per l\'intera rete in Impostazioni, Calcolo, Idraulica. Lasciare vuoto su un normale nodo.';
$ec_lang['lpn_field_elev']='Quota';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='Livello del terreno o della tubazione in questo nodo. Misuralo a partire da uno zero a piacere, purché ogni nodo usi lo stesso riferimento.';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='Carico';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Livello della superficie dell\'acqua nel serbatoio, misurato come altezza, non come pressione. Lascialo vuoto per porre la superficie dell\'acqua alla quota del serbatoio.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='Quota del fondo della vasca. Le profondità dell\'acqua nella vasca sono misurate a partire da qui.';
$ec_lang['lpn_field_tank_level']='Profondità dell\'acqua';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Profondità dell\'acqua presente nella vasca, misurata a partire dal fondo della vasca. La superficie dell\'acqua è la quota del fondo della vasca più questa profondità.';
$ec_lang['lpn_field_tank_minlevel']='Profondità minima dell\'acqua';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Profondità dell\'acqua alla quale la vasca è considerata vuota, misurata a partire dal fondo della vasca.';
$ec_lang['lpn_field_tank_maxlevel']='Profondità massima dell\'acqua';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Profondità dell\'acqua alla quale la vasca è piena, misurata a partire dal fondo della vasca.';
$ec_lang['lpn_field_tank_diameter']='Diametro della vasca';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Larghezza della vasca da un lato all\'altro. È espressa nelle stesse unità della quota, non in quelle del diametro delle tubazioni. Determina quanta acqua contiene una data profondità.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Quota della superficie dell\'acqua nella vasca: la quota del fondo della vasca più la profondità dell\'acqua. È il livello che il risolutore utilizza per la vasca.';
$ec_lang['lpn_close']='Chiudi';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Proprietà';
$ec_lang['lpn_empty_hint']='Usa File, Nuovo progetto per aprire un esempio. Oppure inizia aggiungendo un serbatoio, un nodo e una tubazione dalla barra degli strumenti.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='La tua rete è intatta.';
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
$ec_lang['lpn_examples_welcome']='Benvenuto nella modellazione delle reti di distribuzione idrica, con il risolutore EPANET';
$ec_lang['lpn_examples_heading']='Apri una tua copia di un esempio';
$ec_lang['lpn_examples_sub']='Ognuno si apre come una tua copia. Modificalo, salvalo, oppure apri una nuova copia e ricomincia.';
$ec_lang['lpn_examples_open']='Apri';
$ec_lang['lpn_examples_menu']='Apri esempio…';
$ec_lang['lpn_examples_blank']='Oppure inizia qui';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_close']='Chiudi';
$ec_lang['lpn_examples_size']='Nodi: {nodes}, collegamenti: {links}';
$ec_lang['lpn_examples_failed']='Non è stato possibile caricare gli esempi. Usa File, Nuovo progetto per iniziare un disegno.';
$ec_lang['lpn_examples_loading']='Caricamento degli esempi…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Correggi qualcosa';
$ec_lang['lpn_help_notes']='Note su questa pagina';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Qualcosa non va qui?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Una pressione ci dice che qualcosa in questa pagina non va. Invia il nome di questa pagina, la lingua in cui la stai leggendo, e il messaggio sulla mappa se ce n\'è uno. Non invia nulla di ciò che hai digitato, nessun indirizzo, e nulla del tuo disegno. Nessuno può risponderti, perché questo non ci dice nulla su chi sei. Usa Guida, Segnala un problema quando vuoi dire di più.';
$ec_lang['lpn_wrong_thanks']='Grazie. Ci è arrivato.';
$ec_lang['lpn_status_example_opened']='Aperto {name}. È una tua copia: salvala con File, Salva come.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Questa pagina non è riuscita a determinare le dimensioni dell\'area di disegno, quindi la mappa mostra l\'ultima vista che è riuscita a calcolare. Ridimensionare la finestra la fa riprovare. Se il problema persiste, la causa più comune è un\'estensione del browser che blocca le misurazioni della pagina.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Rete di base, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Inizia da qui. Un serbatoio, una pompa e un piccolo anello: la disposizione più piccola che funziona ancora come una rete idrica. Litri al secondo, con metri e millimetri.';
$ec_lang['lpn_ex_basic_us_title']='Rete di base, gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='La stessa rete di partenza in galloni al minuto, con piedi e pollici.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 con controlli basati su regole';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='La più piccola delle tre reti di esempio di EPANET: un serbatoio, una pompa e un solo anello.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Una rete di distribuzione ramificata con una vasca, dagli esempi di EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Il grande esempio di EPANET: 92 nodi, 3 vasche e 2 serbatoi, uno dei quali una sorgente fluviale. Vale la pena aprirlo per vedere come appare sulla mappa un modello di dimensioni reali.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='La rete EPANET Net3 convertita in coordinate lat/lon a Novato, CA, con la mappa del mondo sullo sfondo.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Un sito commerciale risolto per la portata antincendio sommata alla richiesta massima giornaliera, in un solo istante, disegnato su una planimetria del sito.';
$ec_lang['lpn_tool_undo']='Annulla';
$ec_lang['lpn_confirm_example']='Questo aggiunge l\'esempio alla rete che hai già. Continuare?';
$ec_lang['lpn_field_diameter']='Diametro';
$ec_lang['lpn_demand_tip']='Portate prelevate dalla rete in questo nodo. Inserisci un numero negativo per la portata immessa nella rete qui.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Questa unità decide che cosa significano i tuoi valori inseriti';
$ec_lang['lpn_units_warn_lead']='{unit} è l\'unità di ciò che inserisci per:';
$ec_lang['lpn_units_options_head']='Quando cambi un\'unità:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Non distruttivo';
$ec_lang['lpn_units_nondestructive_desc']='Non distruttivo: lascia ogni valore inserito com\'è e lo reinterpreta nella nuova unità.';
$ec_lang['lpn_units_destructive']='Distruttivo';
$ec_lang['lpn_units_destructive_desc']='Distruttivo: riscrive ogni valore inserito con una conversione matematica, così la rete resta fisicamente quasi la stessa, entro le tolleranze della conversione. Perde i valori originali. Annulla li ripristina.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} valori ora significano {unit}. Nulla è stato riscritto.';
$ec_lang['lpn_status_converted']='{n} valori sono stati riscritti in {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='Colora la rete in base a una grandezza, così una mappa grande si può leggere a colpo d\'occhio. Pressione e velocità sono le due che di solito contano di più.';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Lunghezza';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Coordinate della mappa';
$ec_lang['lpn_units_mapcoords_deg']='gradi';
$ec_lang['lpn_units_usft']='ft di rilievo USA';
$ec_lang['lpn_units_elevhead']='Quota e carico';
$ec_lang['lpn_units_pressure']='Pressione';
$ec_lang['lpn_units_flow']='Portata';
$ec_lang['lpn_units_velocity']='Velocità';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Gradiente di perdita di carico';
$ec_lang['lpn_result_gradient_tip']='Perdita di carico divisa per la lunghezza della tubazione. Usalo per confrontare tubazioni di lunghezza diversa rispetto a un unico limite di progetto.';
$ec_lang['lpn_result_water_age']='Età dell\'acqua';
$ec_lang['lpn_result_water_age_tip']='Da quanto tempo l\'acqua che arriva in questo punto è nel sistema. Dove le portate si incontrano, l\'acqua in arrivo porta con sé una miscela di età, e il numero qui è la loro media pesata sulla portata: un nodo alimentato per lo più da una condotta principale corta e nuova mostra un\'età bassa anche se lo alimenta anche un ramo cieco lungo. In una vasca è l\'età media dell\'acqua contenuta, motivo per cui una vasca che ricambia lentamente è di solito l\'acqua più vecchia di una rete. Non esiste un limite normativo con cui confrontarla, quindi valuta il numero rispetto al tuo stesso sistema.';
$ec_lang['lpn_result_source_share']='Quota di provenienza';
$ec_lang['lpn_result_source_share_tip']='Quanta parte dell\'acqua che arriva in questo punto proviene dal nodo di traccia. È ciò che riporta l\'analisi Traccia sorgente.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Età media dell\'acqua';
$ec_lang['lpn_result_avg_source_share']='Quota media della fonte';
$ec_lang['lpn_result_avg_concentration']='Concentrazione media';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Fattore di attrito';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Tasso di reazione';
$ec_lang['lpn_result_status']='Stato';
$ec_lang['lpn_result_status_open']='Aperto';
$ec_lang['lpn_result_status_closed']='Chiuso';
$ec_lang['lpn_result_head']='Carico';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Energia dell\'acqua in questo nodo, espressa come altezza di colonna d\'acqua. È un\'altezza assoluta, mentre la pressione è una misura relativa (di tipo manometrico).';
$ec_lang['lpn_result_pressure']='Pressione';
$ec_lang['lpn_result_flow']='Portata';
$ec_lang['lpn_result_velocity']='Velocità';
$ec_lang['lpn_result_headloss']='Perdita di carico';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Ripristina solo le impostazioni di questo progetto. Il disegno e gli altri progetti non vengono modificati. Per salvare le impostazioni preferite e riusarle, salva un file di progetto che contenga solo le impostazioni.';
$ec_lang['lpn_reset_all_tip']='Elimina ogni progetto, ogni immagine di sfondo, ogni impostazione e le tue scelte di unità di misura, poi ricarica la pagina esattamente come la vede un visitatore alla prima visita. Questo è l\'unico ripristino che cancella tutto.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Questo calcolatore conserva le unità e i dati del progetto così come sono stati inseriti, ma in precedenza convertiva i numeri in unità SI per la memorizzazione. Questo progetto è stato salvato prima di quel cambiamento, quindi i suoi numeri sono memorizzati in SI. Convertirli un\'ultima volta nelle unità attuali? Per aiutarti a decidere, ecco alcuni diametri che verrebbero convertiti, con i valori prima e dopo:';
$ec_lang['lpn_v2_restore_yes']='Converti';
$ec_lang['lpn_v2_restore_never']='No. Non chiedere più.';
$ec_lang['lpn_v2_restore_no']='Chiudi, così posso controllare prima le unità attuali';
$ec_lang['lpn_storage_too_new']='Questo progetto è stato salvato da una versione più recente della pagina, quindi non può essere aperto qui.';
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
$ec_lang['lpn_tool_file']='File';
$ec_lang['lpn_menu_edit']='Modifica';
$ec_lang['lpn_menu_insert']='Inserisci';
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
$ec_lang['lpn_menu_map']='Mappa';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Mostra mappa stradale';
$ec_lang['lpn_basemap_satellite_show']='Mostra immagini satellitari';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='georeferenziato';
$ec_lang['lpn_xymap']='locale';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Converti come…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Copia di {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Converti come';
$ec_lang['lpn_convas_coordsys_tip']='Il sistema di coordinate a cui viene convertita la copia. Quando differisce da quello di questo progetto, seguono due passaggi di posizionamento. Un progetto che sa già dove si trova apre entrambi i passaggi già risolti, così puoi accettarli così come sono o modificarli.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Attuale: {crs}';
$ec_lang['lpn_convas_epsg']='Sistema di coordinate EPSG';
$ec_lang['lpn_convas_epsg_tip']='Scegli un sistema di coordinate dal registro EPSG. Latitudine e longitudine è WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Georeferenziazione locale (senza nome)';
$ec_lang['lpn_convas_unnamed_tip']='Coordinate locali nell\'unità di lunghezza, con la mappa del mondo collegata.';
$ec_lang['lpn_convas_none_tip']='Coordinate locali nell\'unità di lunghezza, senza mappa del mondo per ora.';
$ec_lang['lpn_convas_units_tip']='Le unità a cui viene convertita la copia. L\'originale mantiene i propri numeri e le proprie unità.';
$ec_lang['lpn_convas_round']='Arrotonda i valori convertiti';
$ec_lang['lpn_convas_round_tip']='Arrotonda solo i numeri che questa conversione riscrive, al passo più vicino che scegli. I valori la cui unità non cambia sono lasciati come sono.';
$ec_lang['lpn_convas_round_none']='Nessun arrotondamento';
$ec_lang['lpn_convas_round_flow']='Richiesta e portata';
$ec_lang['lpn_convas_label_col']='Suffisso';
$ec_lang['lpn_convas_label_tip']='Testo aggiunto dopo questo valore nelle etichette della mappa della copia, come \' mm\' o \' gpm\'. Precompilato in base all\'unità scelta sopra; cancellalo per nessun suffisso.';
$ec_lang['lpn_convas_oneway']='Convertire all\'indietro è una seconda conversione, non un annullamento. Un numero convertito e riconvertito potrebbe non tornare esattamente come è stato digitato.';
$ec_lang['lpn_convas_ok']='Converti';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} è uno dei pochi sistemi di coordinate elencati privi di informazioni di proiezione utilizzabili, quindi non può essere usato come origine o destinazione della conversione. Non è stato convertito nulla.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='La copia convertita è {name}. Il progetto originale non è cambiato.';
$ec_lang['lpn_convas_cancelled']='Non è stato convertito nulla. La copia è chiusa, e il progetto originale non è cambiato.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Copia questo progetto in una nuova scheda e converte la copia nel sistema di coordinate e nelle unità che scegli. Quando il sistema di coordinate cambia, una procedura guidata ti accompagna prima nello zoom approssimativo della mappa dietro la tua rete, poi nel ridimensionamento e nella rotazione più precisi della rete sulla mappa. Questo progetto resta esattamente com\'è. Per georeferenziare senza convertire nulla, usa invece Mappa, Mappa del mondo, Collega.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Questo progetto è già georeferenziato, quindi la rete è già sulla mappa e non è stato spostato nulla. Verifica che sia nel punto giusto, poi premi il pulsante Colloca il modello qui e il pulsante Mantieni questo posizionamento.';
$ec_lang['lpn_georef_intro']='Collocare il modello richiede due passaggi. Il passaggio 1 è quello rapido: il modello resta fermo e sposti tu la mappa dietro di esso, finché il tuo sito non è sotto il modello all\'incirca alla dimensione giusta. Non c\'è ancora rotazione. Il passaggio 2 è quello preciso: trascini, ridimensioni e ruoti il modello stesso. Il tuo progetto si trova all\'inizio su una mappa del mondo intero, quindi trova prima la tua posizione, poi premi il pulsante Colloca il modello qui.';
$ec_lang['lpn_georef_adjust']='Il modello è ora sul terreno, quindi si sposta con la mappa. Trascina il modello per spostarlo, trascina un angolo per ridimensionarlo, trascina la maniglia rotonda sopra il modello per ruotarlo. Oppure digita la distanza sul terreno e l\'angolo di rotazione qui sotto.';
$ec_lang['lpn_georef_step1']='Passaggio 1 di 2 — rapido';
$ec_lang['lpn_georef_step2']='Passaggio 2 di 2 — preciso';
$ec_lang['lpn_georef_step1_hint']='Il tuo progetto resta dov\'è sullo schermo. Sposta e ingrandisci la mappa sottostante finché il terreno dietro di esso non è all\'incirca nel posto giusto e all\'incirca della dimensione giusta, poi premi il pulsante Colloca il modello qui.';
$ec_lang['lpn_georef_detach']='Riprendilo';
$ec_lang['lpn_georef_size_prompt']='All\'incirca quanto è largo il sito, per l\'intero progetto?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Scorciatoia: premi {key}.';
$ec_lang['lpn_tool_key_hint_two']='Scorciatoia: premere {key} o {key2}.';
$ec_lang['lpn_tool_add_junction_tip']='Fai clic sulla mappa per aggiungere un nodo: un punto dove le tubazioni si incontrano o dove l\'acqua viene utilizzata.';
$ec_lang['lpn_tool_add_reservoir_tip']='Fai clic sulla mappa per aggiungere un serbatoio: una fonte infinita con un livello dell\'acqua fisso.';
$ec_lang['lpn_tool_add_tank_tip']='Fai clic sulla mappa per aggiungere una vasca: un accumulo il cui livello dell\'acqua sale e scende man mano che si riempie e si svuota.';
$ec_lang['lpn_tool_add_pipe_tip']='Fai clic su un nodo e poi su un altro per disegnare una tubazione tra di essi.';
$ec_lang['lpn_tool_add_pump_tip']='Fai clic su un nodo e poi su un altro per inserire una pompa tra di essi.';
$ec_lang['lpn_tool_add_valve_tip']='Fai clic su un nodo e poi su un altro per inserire una valvola tra di essi.';
$ec_lang['lpn_tool_add_text_tip']='Fai clic sulla mappa per scrivere una nota sul disegno.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Fai clic sulla mappa come indicato per selezionare tutto ciò che è dentro la forma. Premi di nuovo questo pulsante per cambiare la forma tra finestra, lazo e poligono. Tieni premuto Maiusc mentre selezioni per continuare con la selezione esistente, aggiungendo o rimuovendo (a scelta) ciò che selezioni.';
$ec_lang['lpn_area_selected']='{n} selezionati.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='Nulla trovato in quell\'area.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Aggiungi e rimuovi i vertici che danno forma a una tubazione sulla mappa. Fai clic su una tubazione per aggiungere un vertice, fai clic su un vertice per rimuoverlo, e trascina un vertice per spostarlo. Un vertice cambia solo il percorso disegnato, non l\'idraulica.';
$ec_lang['lpn_tool_delete_tip']='Fai clic su qualsiasi cosa sulla mappa per rimuoverla.';
$ec_lang['lpn_tool_undo_tip']='Annulla l\'ultima modifica.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Adatta l\'intera rete alla finestra.';
$ec_lang['lpn_tool_zoom_window_tip']='Fai clic su due angoli opposti di un rettangolo, oppure trascinane uno, sulla mappa per ingrandire su di esso. Premi di nuovo questo pulsante per Adatta tutto alla vista.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Aumenta zoom. Scorciatoia: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Riduci zoom. Scorciatoia: -';
$ec_lang['lpn_tool_settings_tip']='Apri le impostazioni di questo progetto.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Trova un elemento tramite il suo ID, oppure trova ogni elemento che soddisfa una condizione, e cambiali tutti in una volta.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Che cosa significano le icone della barra degli strumenti';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Visibilità';
$ec_lang['lpn_pane_right_toggle_tip']='Mostra o nascondi il pannello a destra della mappa. Contiene le scelte di etichette e colori.';
$ec_lang['lpn_color_legend_open_tip']='Fai clic per aprire il pannello Visibilità e cambiare questi colori.';
$ec_lang['lpn_color_node_field']='Colora i nodi in base a';
$ec_lang['lpn_color_link_field']='Colora le tubazioni in base a';
$ec_lang['lpn_color_ramp_sequential']='Sequenziale';
$ec_lang['lpn_color_ramp_diverging']='Divergente';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Numero di fasce';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Assegnazione delle fasce';
$ec_lang['lpn_color_ranges_note']='I limiti qui sotto restano fissi una volta impostati; non seguono i risultati man mano che cambiano. Scegliere un metodo di classificazione dei dati qui sopra imposta i limiti in base allo stato attuale del sistema. Se cambi un valore a mano, il metodo qui sopra diventa Manuale.';
$ec_lang['lpn_color_criterion_note']='Questo metodo trae i suoi limiti da uno standard di progetto, quindi il numero di colori resta fisso finché è scelto questo metodo.';
$ec_lang['lpn_color_break_number']='Un limite deve essere un numero. La mappa non è cambiata.';
$ec_lang['lpn_color_break_order']='Ogni limite deve essere maggiore di quello precedente. La mappa non è cambiata.';
$ec_lang['lpn_color_break_count']='Ci deve essere un limite in meno rispetto al numero di colori. La mappa non è cambiata.';
$ec_lang['lpn_color_ramp_qualitative']='Qualitativo';
$ec_lang['lpn_color_ramp_rainbow']='Arcobaleno';
$ec_lang['lpn_color_ramp_rainbow_eg']='come in EPANET';
$ec_lang['lpn_color_example_status']='Stato';
$ec_lang['lpn_color_example_material']='Materiale';
$ec_lang['lpn_color_ramp_ylgnbu']='Da giallo a blu';
$ec_lang['lpn_color_ramp_rdylbu']='Da rosso a blu, passando per il giallo';
$ec_lang['lpn_georef_drop']='Colloca il modello qui';
$ec_lang['lpn_georef_finish']='Mantieni questo posizionamento';
$ec_lang['lpn_georef_cancel']='Annulla';
$ec_lang['lpn_georef_scale']='Distanza sul terreno per unità di disegno';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Quanto lontano arriva sul terreno un\'unità del tuo disegno. Un disegno fatto su una griglia semplice di solito non dice nulla su questo, quindi impostalo qui — oppure lascia che Vai a… ti chieda quanto è largo il sito e lo calcoli lui.';
$ec_lang['lpn_georef_rotation']='Rotazione antioraria (gradi)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Di quanto ruotare l\'intero modello, in senso antiorario, affinché il suo nord punti verso nord.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Collocare il modello qui in modo permanente? Potrai ancora trascinare i singoli elementi in seguito, ma il disegno smette di essere un progetto xy. Per riavere l\'xy, chiudi questo progetto senza salvare.';
$ec_lang['lpn_georef_done']='Ora questo è un progetto lat/lon. Trascina un qualsiasi elemento per avvicinarlo a dove si trova realmente.';
$ec_lang['lpn_georef_backdrop_unrotated']='L\'immagine di sfondo è stata spostata e ridimensionata insieme al modello, ma non è stato possibile ruotarla. Usa Mappa, Immagine di sfondo, Sposta per allinearla.';
$ec_lang['lpn_georef_empty']='Quel file non contiene una rete, quindi non c\'è nulla da collocare.';
$ec_lang['lpn_georef_unavailable']='Lo strumento di posizionamento non si è caricato. Ricarica la pagina e riprova.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Termina il posizionamento con il pulsante "Mantieni questo posizionamento", oppure premi Annulla, prima di passare a un altro progetto. Il posizionamento appartiene a questo progetto e non può seguirti in un altro.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Concludere il posizionamento con il pulsante “Mantieni questo posizionamento”, oppure premere Annulla, prima di salvare. Il progetto è ancora in fase di posizionamento, quindi ciò che è a schermo non è ancora ciò che verrebbe scritto nel file.';
$ec_lang['lpn_goto_menu']='Vai a una latitudine e longitudine…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='Sposta la mappa in un luogo di cui hai già le coordinate. Prima la latitudine, poi la longitudine, come le fornisce una mappa, con uno spazio tra loro: 38 -122';
$ec_lang['lpn_goto_prompt']='Latitudine e longitudine, in quest\'ordine';
$ec_lang['lpn_goto_bad']='Questa non è una latitudine e una longitudine. Prova 38 -122, con uno spazio tra loro.';
$ec_lang['lpn_georef_goto']='Vai a…';
$ec_lang['lpn_georef_twopt']='Usa due punti noti';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Colloca il modello con esattezza, quando sai già dove si trovano davvero due punti del tuo disegno. Fai clic su uno di essi, digita la sua latitudine e longitudine, poi fai lo stesso per un secondo punto. La posizione, la scala e la rotazione derivano tutte da quei due punti. Premi di nuovo questo pulsante per interrompere la selezione.';
$ec_lang['lpn_georef_twopt_pick1']='Fai clic su un punto del tuo disegno di cui conosci latitudine e longitudine.';
$ec_lang['lpn_georef_twopt_pick2']='Ora fai clic su un secondo punto noto, il più lontano possibile dal primo.';
$ec_lang['lpn_georef_twopt_same']='Quello è il punto che hai scelto per primo. Scegline uno diverso.';
$ec_lang['lpn_georef_twopt_done']='Il modello ora è collocato sui due punti che hai indicato. Controllalo, poi premi il pulsante Mantieni questo posizionamento.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Pannello inferiore';
$ec_lang['lpn_pane_toggle_tip']='Mostra o nascondi il pannello sotto la mappa. Contiene il profilo e una tabella per ogni tipo di elemento.';
$ec_lang['lpn_pane_resize']='Trascina per rendere il pannello più alto o più basso';
$ec_lang['lpn_pane_tab_junctions']='Nodi';
$ec_lang['lpn_pane_tab_reservoirs']='Serbatoi';
$ec_lang['lpn_pane_tab_tanks']='Vasche';
$ec_lang['lpn_pane_tab_pipes']='Tubazioni';
$ec_lang['lpn_pane_tab_pumps']='Pompe';
$ec_lang['lpn_pane_tab_valves']='Valvole';
$ec_lang['lpn_pane_tab_tip']='Questa scheda mostra gli elementi di questo tipo come una tabella che puoi ordinare e modificare. Le colonne dei risultati non possono essere modificate.';
$ec_lang['lpn_pane_none']='Questa rete non ha ancora nessuno di questi elementi.';
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
$ec_lang['lpn_pane_text_attached']='Collegato';
$ec_lang['lpn_pane_not_used']='Non usato';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Filtrato per {q}. Mostrati {n} di {all}.';
$ec_lang['lpn_pane_filter_clear']='Mostra tutto';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Nulla in questa tabella corrisponde al filtro.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Zoom e seleziona';
$ec_lang['lpn_goto_on_map']='Mostra sulla mappa';
$ec_lang['lpn_pane_select_on_map']='Seleziona sulla mappa';
$ec_lang['lpn_pane_unselect_on_map']='Deseleziona sulla mappa';
$ec_lang['lpn_pane_print']='Stampa tabella';
$ec_lang['lpn_pane_print_tip']='Stampa la tabella che stai guardando, con il nome del progetto, il nome della tabella e le unità nelle intestazioni. Le righe vengono stampate nell\'ordine in cui le hai ordinate.';

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
$ec_lang['lpn_menu_project']='Acqua';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Tutto ciò che riguarda la modellazione della rete idrica si trova qui, in un unico posto, tranne i comandi di riproduzione dell\'animazione. Non c\'è bisogno di indovinare dove si trovano le cose.';
$ec_lang['lpn_tables_menu']='Tabelle';
$ec_lang['lpn_tables_menu_tip']='Apre, nel pannello sotto la mappa, una tabella degli elementi di questa rete. C\'è una tabella per ogni tipo di elemento, e lì puoi ordinarla e modificarla.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Ricalcola subito questa rete. Cerchi il pulsante Calcola? È nascosto finché è attiva l\'impostazione Ricalcola automaticamente. Per far ricomparire il pulsante, disattiva Ricalcola automaticamente in Impostazioni, Calcolo, Idraulica.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Ricalcola automaticamente';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Quando è attivo, questo progetto si ricalcola poco dopo ogni modifica che fai, e il pulsante Calcola viene tolto dalla barra degli strumenti perché non gli resta nulla da fare. Disattivalo su una rete grande, dove aspettare il ricalcolo dopo ogni modifica ostacola la digitazione, e il pulsante Calcola ricompare così scegli tu quando eseguirlo.';
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
$ec_lang['lpn_time_run_slow']='Questa rete ha impiegato {secs} s per il calcolo, ed è impostata per ricalcolarsi dopo ogni modifica. Per fermarla e riavere un pulsante Calcola, disattiva “Ricalcola automaticamente” in Impostazioni, sotto Calcolo, Idraulica.';
$ec_lang['lpn_time_no_report']='Non c\'è ancora un rapporto di calcolo. Il rapporto è il testo prodotto direttamente da EPANET, quindi compare una volta che questa rete è stata calcolata con il risolutore EPANET.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
$ec_lang['lpn_menu_settings']='Impostazioni';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Guida';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Galleria di schermate';
$ec_lang['lpn_help_walkthroughs']='Esercitazioni';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Elimina rete';
$ec_lang['lpn_confirm_delete_network']='Eliminare ogni nodo, tubazione ed etichetta di testo di questo progetto? L\'immagine di sfondo, il nome del progetto e le impostazioni vengono conservati. Questa azione non può essere annullata.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Trova e sostituisci';
$ec_lang['lpn_find_title']='Trova e sostituisci';
$ec_lang['lpn_find_scope']='Cosa cercare';
$ec_lang['lpn_find_scope_all']='Tutto';
$ec_lang['lpn_find_property']='Proprietà';
$ec_lang['lpn_find_condition']='Condizione';
$ec_lang['lpn_find_value']='Valore';
$ec_lang['lpn_find_btn']='Trova';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Filtra nella tabella attuale';
$ec_lang['lpn_find_filter_tip']='Mostra solo le parti che corrispondono a questa query in una delle tabelle sotto la mappa. Il disegno non viene modificato e nulla viene eliminato.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} di {all}';
$ec_lang['lpn_find_filter_summary']='Filtrato per {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Questa ricerca non si applica a nessuna tabella.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='contiene';
$ec_lang['lpn_find_op_equals']='uguale a';
$ec_lang['lpn_find_op_gt']='maggiore di';
$ec_lang['lpn_find_op_lt']='minore di';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='vuoto';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} trovati. Fai clic su uno per andarci.';
$ec_lang['lpn_find_shift_hint']='Maiusc+clic per attivare/disattivare: aggiunge se non è nella selezione, rimuove se lo è già.';
$ec_lang['lpn_find_none']='Nessuna corrispondenza.';
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
$ec_lang['lpn_find_op_top']='{n} più alti';
$ec_lang['lpn_find_op_bottom']='{n} più bassi';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Digita che cosa cercare.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Connettività';
$ec_lang['lpn_find_prop_demand_desc']='Descrizione di questa categoria di richiesta';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='nessuna tubazione al nodo';
$ec_lang['lpn_find_op_conn_noopen']='nessuna tubazione aperta al nodo';
$ec_lang['lpn_find_op_conn_nolinksource']='nessun percorso verso una fonte';
$ec_lang['lpn_find_op_conn_noopensource']='nessun percorso aperto verso una fonte';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
$ec_lang['lpn_find_conn_unlinked']='Nessuna tubazione al nodo';
$ec_lang['lpn_find_conn_noopen']='Nessuna tubazione aperta al nodo';
$ec_lang['lpn_find_conn_nolinksource']='Nessun percorso verso una fonte';
$ec_lang['lpn_find_conn_noopensource']='Nessun percorso aperto verso una fonte';
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Ogni nodo è collegato.';
$ec_lang['lpn_find_conn_no_fixed']='Questa rete non ha un serbatoio o una vasca, quindi non c\'è una fonte da raggiungere. Si possono cercare solo nessuna tubazione al nodo e nessuna tubazione aperta al nodo.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='La stessa ricerca, scritta come un\'unica riga. Cambiando i controlli questa riga viene riscritta, e digitando in questa riga i controlli si aggiornano.';
$ec_lang['lpn_find_query_label']='Ricerca';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Combina le condizioni con AND, OR e ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='E';
$ec_lang['lpn_find_q_or']='O';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='I controlli non possono esprimere la ricerca qui sotto, quindi sono nascosti.';
$ec_lang['lpn_find_q_restore']='Usa i controlli invece';
$ec_lang['lpn_replace_q_bad']='Questa ricerca non può essere interpretata, quindi non verrà cambiato nulla. Correggila prima qui sopra.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(al carattere {n})';
$ec_lang['lpn_find_q_err_empty']='La ricerca è vuota, quindi non verrà cercato nulla.';
$ec_lang['lpn_find_q_err_scope']='Non esiste nulla chiamato {w} da cercare. Prova uno tra: {list}';
$ec_lang['lpn_find_q_err_dot']='Metti un punto tra che cosa cercare e la sua proprietà, come Junction.ID';
$ec_lang['lpn_find_q_err_prop']='Non è una proprietà di {scope}: {w}. Prova una tra: {list}';
$ec_lang['lpn_find_q_err_op']='Non è una condizione per {prop}: {w}. Prova una tra: {list}';
$ec_lang['lpn_find_q_err_value']='Questa condizione richiede un valore dopo di essa: {op}';
$ec_lang['lpn_find_q_err_quote']='Metti tra virgolette un valore di testo: {w} non è un numero.';
$ec_lang['lpn_find_q_err_quote_end']='Questo testo tra virgolette non ha la virgoletta di chiusura.';
$ec_lang['lpn_find_q_err_close']='Questa parentesi ( è stata aperta e mai chiusa.';
$ec_lang['lpn_find_q_err_open']='Questa parentesi ) non chiude nulla.';
$ec_lang['lpn_find_q_err_end']='Qui non ci si aspettava nulla. Unisci due ricerche con {and} o {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Modifica ciò che è stato trovato';
$ec_lang['lpn_replace_prop']='Proprietà da modificare';
$ec_lang['lpn_replace_value']='Nuovo valore';
$ec_lang['lpn_replace_source']='Origine del nuovo valore';
$ec_lang['lpn_replace_asked']='Quote richieste per {n} nodi. I risultati sono in arrivo.';
$ec_lang['lpn_replace_btn']='Sostituisci';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Modificare {n} elementi?';
$ec_lang['lpn_replace_apply']='Modificali';
$ec_lang['lpn_replace_done']='{n} elementi modificati. Puoi annullare l\'operazione in un solo passaggio.';
$ec_lang['lpn_replace_none']='Non cambierebbe nulla.';
$ec_lang['lpn_replace_no_value']='Digita il nuovo valore.';
$ec_lang['lpn_replace_scope']='Scegli sopra un tipo di elemento su cui modificare i valori.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Profilo';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_tip']='Disegna il terreno e la linea dei carichi piezometrici lungo un percorso attraverso la rete.';
$ec_lang['lpn_profile_title']='Profilo lungo un percorso';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Fai clic sul nodo da cui parte il percorso.';
$ec_lang['lpn_profile_draw_more']='Muovi il puntatore sulla mappa per vedere il percorso. Fai clic su un nodo per aggiungerlo. Fai doppio clic per terminare. Esc annulla.';
$ec_lang['lpn_profile_draw_blocked']='Nessun percorso da {a} a {b}. Scegli un altro nodo.';
$ec_lang['lpn_profile_tap_start']='Tocca il nodo da cui parte il percorso.';
$ec_lang['lpn_profile_tap_more']='Tocca un nodo per vedere il percorso. Tieni premuto per aggiungerlo. Tocca due volte per terminare. Premi di nuovo Profilo per annullare.';
$ec_lang['lpn_profile_say_idle']='Premi di nuovo Profilo per scegliere un nuovo percorso sulla mappa.';
$ec_lang['lpn_profile_none']='Nessun percorso ancora. Premi di nuovo Profilo per sceglierne uno sulla mappa.';
$ec_lang['lpn_profile_choose']='Scegli un nodo di partenza e un nodo di arrivo.';
$ec_lang['lpn_profile_no_path']='Questi due nodi non sono collegati da alcun percorso.';
$ec_lang['lpn_profile_no_solve']='Non ci sono ancora risultati, quindi viene disegnata solo la linea del terreno.';
$ec_lang['lpn_profile_summary']='Nodi: {n}, lunghezza: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Distanza lungo il percorso ({u})';
$ec_lang['lpn_profile_axis_elev']='Quota e carico ({u})';
$ec_lang['lpn_profile_ground']='Superficie del terreno';
$ec_lang['lpn_profile_hgl']='Linea dei carichi piezometrici';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Modifica';
$ec_lang['lpn_profile_edit_tip']='Cambia un\'estremità del percorso, o toglie un nodo da esso, senza disegnare di nuovo tutto il percorso.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Trascina un punto qualsiasi del percorso per spostarlo. Fai clic su un punto che hai aggiunto per toglierlo.';
$ec_lang['lpn_profile_edit_tap']='Trascina un punto qualsiasi del percorso per spostarlo. Tocca un punto che hai aggiunto per toglierlo.';
$ec_lang['lpn_profile_edit_nowhere']='Un punto del percorso deve essere un nodo. Il percorso non è cambiato.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Percorsi salvati';
$ec_lang['lpn_profile_new']='Nuovo percorso salvato…';
$ec_lang['lpn_profile_new_name']='Percorso {n}';
$ec_lang['lpn_profile_rename']='Rinomina percorso…';
$ec_lang['lpn_profile_delete']='Elimina percorso';
$ec_lang['lpn_profile_prompt_name']='Nome per questo percorso';
$ec_lang['lpn_profile_delete_confirm']='Eliminare il percorso salvato {name}? Il disegno stesso non viene modificato.';
$ec_lang['lpn_profile_none_saved']='Nessun percorso salvato ancora';
$ec_lang['lpn_profile_missing']='Il percorso salvato {name} usa nodi che non sono in questo progetto: {ids}';
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
$ec_lang['lpn_ts_menu']='Serie temporale';
$ec_lang['lpn_ts_tip']='Traccia il grafico di uno o più elementi rispetto al tempo lungo un calcolo esteso nel tempo.';
$ec_lang['lpn_ts_title']='Valori rispetto al tempo';
$ec_lang['lpn_ts_group_tip']='Se il grafico mostra nodi o collegamenti.';
$ec_lang['lpn_ts_group_nodes']='Nodi';
$ec_lang['lpn_ts_group_links']='Collegamenti';
$ec_lang['lpn_ts_quantity_tip']='Quale valore tracciare rispetto al tempo.';
$ec_lang['lpn_ts_add']='Aggiungi selezionati';
$ec_lang['lpn_ts_add_tip']='Metti sul grafico tutto ciò che è ora scelto sulla mappa.';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Nulla di quel tipo è scelto sulla mappa.';
$ec_lang['lpn_ts_clear']='Rimuovi tutto';
$ec_lang['lpn_ts_chip_tip']='Togli {id} dal grafico';
$ec_lang['lpn_ts_none']='Ancora nulla da tracciare. Scegli elementi sulla mappa e premi Aggiungi selezionati.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Ancora nessun risultato del calcolo esteso nel tempo. Premi Calcola per eseguire il calcolo.';
$ec_lang['lpn_ts_summary']='Elementi: {n}, intervalli di reporting: {steps}';
$ec_lang['lpn_ts_axis_time']='Tempo trascorso';
$ec_lang['lpn_freq_menu']='Frequenza';
$ec_lang['lpn_freq_tip']='Traccia il grafico della distribuzione di frequenza di una proprietà su tutti i nodi o tutte le tubazioni al passo temporale attuale.';
$ec_lang['lpn_freq_title']='Distribuzione dei valori';
$ec_lang['lpn_freq_group_tip']='Se il grafico mostra i nodi o le tubazioni.';
$ec_lang['lpn_freq_quantity_tip']='Quale valore tracciare.';
$ec_lang['lpn_freq_none']='Ancora nessun risultato per questo valore, quindi non c\'è nulla da tracciare.';
$ec_lang['lpn_freq_summary']='Tracciati: {n} di {total}';
$ec_lang['lpn_freq_summary_time']='Tracciati: {n} di {total}, a {time}';
$ec_lang['lpn_freq_axis_percent']='Percentuale inferiore a';
$ec_lang['lpn_view_units']='Unità';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Salva tutto';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Progetto{n}';
$ec_lang['lpn_project_copy_suffix']='(copia)';
$ec_lang['lpn_project_rename']='Rinomina';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Nuovo progetto…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Nuovo progetto';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Sistema di coordinate';
$ec_lang['lpn_new_coordsys_tip']='Selezionare il sistema di coordinate della rete. Questa scelta è permanente; l\'unico modo per convertire una rete in coordinate diverse è “File, Apri in nuove coordinate”, ed è approssimativo.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Locale, schematico o personalizzato';
$ec_lang['lpn_new_coordsys_local_tip']='Non georeferenziato. Collegare un\'immagine di sfondo personalizzata oppure nessuna.';
// ---- THE COORDINATE SYSTEM BOX -----------------------------------------------------------------
// Tom's summary: it "uses the map view as a UX element to filter the universe of projections to the
// ones applicable to the project (view). Lets the user filter by name and select a projection at
// any time." (His own words, kept verbatim; "projection" in visitor strings became "coordinate
// system" on 2026-09-25 -- don't expose the word "projection".) Two filters over one catalogue, and
// the catalogue itself is not keyed: a coordinate system's NAME is the EPSG register's own, exactly
// as the OpenStreetMap credit is, and a GIS reader in any language looks for those characters.
$ec_lang['lpn_new_crs']='Proiezione cartografica';
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25). Shared by the New project box and Convert as, so
// it names the box's own subject rather than either caller's radio label.
$ec_lang['lpn_crsbox_title']='Sistema di coordinate';
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='Filtra per vista mappa';
$ec_lang['lpn_crs_view_tip']='Propone solo le proiezioni che coprono il luogo inquadrato dalla mappa. Disattivarlo per leggere l\'elenco completo.';
$ec_lang['lpn_crs_place']='Ricerca per nome del luogo';
$ec_lang['lpn_crs_place_tip']='Digitare una città, un indirizzo o un punto di riferimento, e la vista della mappa si sposta lì. Le parole digitate vengono inviate al servizio di ricerca dei nomi di luogo di OpenStreetMap, che chiede il permesso la prima volta. Anche un nuovo progetto geografico parte dal luogo trovato qui.';
$ec_lang['lpn_crs_search']='Cerca';
$ec_lang['lpn_crs_name']='Filtro nome proiezione';
$ec_lang['lpn_crs_name_tip']='Mostra solo le proiezioni il cui nome o codice EPSG contiene ciò che si digita. Provare un numero di fuso, oppure UTM, oppure Mercatore.';
$ec_lang['lpn_crs_list']='Proiezione';
$ec_lang['lpn_crs_list_tip']='Le proiezioni rimaste dai due filtri precedenti. Sceglierne una e premere Seleziona.';
$ec_lang['lpn_crs_choose']='Seleziona';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Non è stato ancora cercato alcun luogo, quindi viene proposto l\'elenco completo. Cercare un luogo qui sopra oppure ingrandire la mappa per restringerlo.';
$ec_lang['lpn_crs_count']='{n} di {total} proiezioni elencate.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} di {total} sistemi di coordinate coprono questa rete.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(nessuna mappa)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} è uno dei pochi sistemi di coordinate elencati privi di informazioni di proiezione utilizzabili. Questo significa che la mappa del mondo, la ricerca per nome di luogo e le quote da DEM non funzionano. Le tue coordinate non sono influenzate.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='senza nome';
$ec_lang['lpn_crs_none']='Non georeferenziato';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Un progetto mantiene le proprie unità, quindi questa scelta appartiene solo a questo progetto e non viene salvata come impostazione del browser. Per avviare nuovi progetti in un modo particolare, salva un progetto vuoto come modello e copialo ogni volta.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Roma, Italia';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Crea';
$ec_lang['lpn_file_open']='Apri…';
$ec_lang['lpn_file_save']='Salva';
$ec_lang['lpn_file_saveas']='Salva con nome…';
$ec_lang['lpn_file_revert']='Ripristina';
$ec_lang['lpn_file_close']='Chiudi';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='File recenti';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='Riapri {file} senza doverlo cercare sul tuo computer.';
$ec_lang['lpn_recent_denied']='Il permesso di aprire quel file non è stato concesso, quindi non è stato aperto.';
$ec_lang['lpn_recent_gone']='Impossibile aprire {file}. Potrebbe essere stato spostato, rinominato o eliminato, quindi è stato tolto dall\'elenco dei file recenti.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Nuovo progetto';
$ec_lang['lpn_tab_all']='Tutti i progetti';
$ec_lang['lpn_tab_menu']='Menu del progetto';
$ec_lang['lpn_tab_duplicate']='Duplica';
$ec_lang['lpn_tab_move_left']='Sposta a sinistra';
$ec_lang['lpn_tab_move_right']='Sposta a destra';
$ec_lang['lpn_tab_unsaved']='Non salvato su file';
$ec_lang['lpn_import_bad_file']='Quel file non può essere letto come un progetto salvato da questa pagina.';
$ec_lang['lpn_import_no_room']='Non c\'è abbastanza spazio di archiviazione del browser per aggiungere questo progetto. Elimina un progetto che non ti serve più e riprova.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='OK';
$ec_lang['lpn_file_import_inp']='Importa file EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Legge una rete da un file EPANET, sia il file di testo .inp sia il file .net salvato da EPANET, e la salva in questo browser come nuovo progetto.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='Esporta file EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Scrivi questa rete come file EPANET .inp e scaricalo. I numeri che hai digitato vengono scritti esattamente come li hai digitati. Tutto ciò che il formato .inp non può contenere ti viene elencato in seguito.';
$ec_lang['lpn_status_inp_exported']='Esportato {file}.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} cose che il formato .inp non può contenere.';
$ec_lang['lpn_inp_export_refused']='Questo progetto non può essere scritto come file EPANET: {detail}';
$ec_lang['lpn_inp_bad_file']='Quel file non può essere letto come un file di rete EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Questo sembra un file .net di EPANET, ma questa pagina non è riuscita a leggerlo. Aprilo in EPANET e usa il comando File, Esporta, Rete per salvarlo come file .inp, poi importa quello.';
$ec_lang['lpn_inp_report_heading']='Importato {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} nodi, serbatoi e vasche, {links} tubazioni, pompe e valvole, in {units}.';
$ec_lang['lpn_inp_report_clean']='Tutto il contenuto del file è stato importato. Nulla è stato tralasciato.';
$ec_lang['lpn_inp_report_label_anchor']='Le etichette di testo vengono posizionate come le colloca EPANET, a partire dal loro angolo in alto a sinistra.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='I file EPANET non contengono un sistema di coordinate, quindi questo file inizialmente non sarà georeferenziato. Per collocarlo su una mappa del mondo, usa Mappa, Mappa del mondo… Per convertirne le coordinate, usa File, Converti come…';
$ec_lang['lpn_inp_report_lead']='Questa pagina non usa tutto ciò che usa EPANET, ma nulla nel tuo file viene scartato. Qui sotto trovi ciò che il tuo file contiene e che questa pagina conserva senza usare, e ciò che è stato cambiato durante la lettura del file:';
$ec_lang['lpn_inp_drop_headloss']='Questo file non usa la formula di Hazen-Williams. Questa pagina calcola con Hazen-Williams, quindi i valori di scabrezza delle tubazioni sono stati mantenuti esattamente come scritti, ma i risultati qui non corrisponderanno a quelli di EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Queste vasche non hanno pareti verticali: il file ne definisce la forma tramite una curva. La curva è conservata nella finestra Librerie, la vasca continua a farvi riferimento, e un calcolo esteso nel tempo riempie e svuota la vasca secondo l\'andamento indicato da quella curva. Un singolo istante è comunque uguale, perché la superficie dell\'acqua è il livello impostato dal file. Il diametro scritto nel file è conservato accanto alla curva ed è quello con cui una vasca senza curva viene disegnata e calcolata.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Queste valvole di regolazione a strozzamento sono state importate come valvole di regolazione a strozzamento, mantenendo la stessa perdita indicata dal file. Entrambi i risolutori possono calcolarle.';
$ec_lang['lpn_inp_drop_valve_active']='Queste valvole controllano la pressione o la portata e si aprono e si chiudono da sole al variare dell\'acqua. Nulla di esse è andato perso in fase di importazione: questa pagina le risolve con il risolutore EPANET, attivandolo automaticamente per questa rete.';
$ec_lang['lpn_inp_drop_valve']='Queste valvole sono descritte da una curva o da una perdita di pressione fissa, e questa pagina non ha un elemento di questo tipo. Sono state importate come tubazioni aperte, quindi la rete resta collegata, ma nulla ne controlla più la pressione o la portata.';
$ec_lang['lpn_inp_drop_cv']='In EPANET queste tubazioni lasciano passare l\'acqua in una sola direzione. Sono state importate come tubazioni ordinarie, quindi ora l\'acqua può scorrere in entrambi i sensi.';
$ec_lang['lpn_inp_drop_demands']='Questi nodi avevano più di una richiesta. Le richieste sono state sommate in un\'unica richiesta, come previsto da questa pagina.';
$ec_lang['lpn_inp_drop_patterns']='Questa pagina non ha letto i modelli temporali di richiesta, perché la parte di essa che calcola una rete nel tempo non si è caricata. Ogni richiesta è il numero scritto nel file.';
$ec_lang['lpn_inp_drop_demand_pattern']='Questi nodi variano la loro richiesta nel corso del calcolo. I loro modelli temporali sono stati importati per intero, e la richiesta che vedi è quella relativa al momento indicato dall\'orologio.';
$ec_lang['lpn_inp_drop_emitters']='Questi nodi hanno un coefficiente di erogatore (irrigatore) o di perdita. È stato conservato e viene risolto, ma al momento non c\'è dove vederlo o modificarlo su questa pagina.';
$ec_lang['lpn_inp_drop_curve_long']='Questa curva di pompa aveva più di tre punti. Sono stati conservati il punto più basso, quello centrale e quello più alto, perché questa pagina adatta una curva ad al massimo tre punti.';
$ec_lang['lpn_inp_drop_curve_missing']='Questa pompa fa riferimento a una curva che non è nel file. La pompa è stata importata senza curva, quindi non aggiunge carico.';
$ec_lang['lpn_inp_drop_pump_other']='Questa pompa è descritta dalla potenza che assorbe, anziché da una curva. È stata importata senza curva, quindi non aggiunge carico.';
$ec_lang['lpn_inp_drop_head_pattern']='Questi serbatoi salgono e scendono nel corso del calcolo. I loro modelli temporali sono stati importati per intero, e il livello dell\'acqua che vedi è quello relativo al momento indicato dall\'orologio.';
$ec_lang['lpn_inp_drop_pump_speed']='Queste pompe funzionano a una velocità diversa da quella a cui è stata misurata la loro curva, oppure cambiano velocità nel corso del calcolo. La velocità e il suo modello temporale sono stati importati per intero, e il carico che vedi è quello relativo al momento indicato dall\'orologio.';
$ec_lang['lpn_inp_drop_setting']='Queste tubazioni, pompe e valvole hanno un\'impostazione che questa pagina non può gestire. Sono state importate aperte.';
$ec_lang['lpn_inp_drop_rules']='Questo file contiene controlli basati su regole. Questa pagina li legge e li usa. Calcola il modello con il motore EPANET e le regole vengono applicate, con ogni livello, pressione e portata in esse convertiti nelle unità mostrate da questo progetto. Apri Regole in Librerie per leggerne una o modificarla. Sono conservate esattamente come le indica il file, e sono riscritte se salvi un file EPANET.';
$ec_lang['lpn_inp_drop_eps']='Questo file descrive una simulazione estesa nel tempo. La parte di questa pagina che calcola una rete nel tempo non si è caricata, quindi sono state importate solo le condizioni iniziali.';
$ec_lang['lpn_inp_drop_quality']='Questo file descrive come cambia la qualità dell\'acqua mentre viaggia: che cosa contiene l\'acqua all\'inizio, e con quale velocità quella sostanza reagisce nelle tubazioni e nelle vasche. Questa pagina legge questi numeri e li usa. Scegli una sostanza chimica in Impostazioni, Calcolo, Qualità dell\'acqua, poi calcola il modello con il motore EPANET, e la concentrazione viene determinata lungo la rete via via che il calcolo procede. Le righe sono conservate, e sono riscritte se salvi un file EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='Questo file indica dove viene dosata una sostanza chimica nella rete, e come si mescola l\'acqua in una vasca. Una dose compare sul nodo dove viene aggiunta, e una vasca indica quale modello di miscelazione segue. Sia la dose sia il modello di miscelazione sono calcolati solo dal motore EPANET.';
$ec_lang['lpn_inp_drop_energy']='Questo file EPANET include dati di modellazione del costo di pompaggio. Questa pagina li legge e li usa. Calcola il modello con il motore EPANET, poi apri Acqua, Rapporti, Energia delle pompe per vedere per quanto tempo ogni pompa ha funzionato, la potenza assorbita, l\'energia usata e quanto è costata. Le righe sono conservate, e sono riscritte se salvi un file EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Questo file assegna etichette identificative ad alcuni dei suoi nodi, tubazioni o altri elementi. Ogni etichetta è stata importata per intero, e ciascuna si trova nelle proprietà del proprio elemento, dove puoi leggerla o cambiarla.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Questo file contiene le impostazioni proprie di EPANET su come formattare il rapporto che stampa. Puoi leggere il rapporto del motore qui, in Rapporti, Calcolo EPANET, ma esce nel formato standard del motore invece che in quello richiesto da queste impostazioni. Le righe sono conservate, e sono riscritte se salvi un file EPANET.';
$ec_lang['lpn_inp_drop_sections']='Questo file contiene una sezione che questa pagina non legge affatto. Nulla qui la usa. È conservata per intero, ed è riscritta se salvi un file EPANET.';
$ec_lang['lpn_inp_drop_quality_options']='Questo file indica le opzioni di qualità dell\'acqua di EPANET: l\'opzione Quality, che nomina il tipo di analisi della qualità dell\'acqua, e due impostazioni legate a una sostanza chimica, Relative diffusivity e Quality tolerance. Tutte e tre sono conservate e tutte e tre sono usate. L\'età dell\'acqua, la traccia sorgente e una sostanza chimica vengono ciascuna determinate qui, e le due impostazioni chimiche sono passate al motore EPANET quando calcoli una sostanza chimica. Tutte sono riscritte se salvi un file EPANET.';
$ec_lang['lpn_inp_drop_file_options']='Questo file fa riferimento a un file ausiliario: Map, che contiene le coordinate, oppure Hydraulics, che contiene un calcolo idraulico già eseguito. Questa pagina non può aprire nessuno dei due, quindi le righe sono conservate così come sono e riscritte se salvi un file EPANET.';
$ec_lang['lpn_inp_drop_demand_model']='Questo file richiede un\'analisi guidata dalla pressione (PDA), in cui un nodo riceve meno della sua richiesta quando la pressione lì è bassa. Questa pagina risolve in modo guidato dalla richiesta, quindi ogni nodo qui riceve la richiesta indicata nel file, qualunque sia la pressione che ne risulta. La riga è conservata ed è riscritta se salvi un file EPANET.';
$ec_lang['lpn_inp_drop_other_options']='Questo file indica opzioni che questa pagina non legge. Nulla qui le usa. Sono conservate e sono riscritte se salvi un file EPANET.';
$ec_lang['lpn_inp_drop_net_options']='Questo file .net di EPANET indica impostazioni per cui questa pagina non ha un controllo, quindi i loro valori sono elencati qui invece di essere trasferiti. Tutto il resto è stato importato. Se ti servono, apri il file in EPANET e usa File, Esporta, Rete per salvarlo come file .inp, poi importa quello.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Questo era un file .net di EPANET. È il file di progetto proprio di EPANET, non ha una descrizione pubblicata, e questa pagina lo legge ricostruendo il formato da file di esempio, quindi usalo solo quando non hai altro, non come una via affidabile. Il file .inp è il formato documentato che ogni altro programma legge: in EPANET usa File, Esporta, Rete per scriverne uno, e importa quello invece ogni volta che puoi.';
$ec_lang['lpn_inp_drop_backdrop']='Questo file indica un\'immagine di sfondo ma non ne contiene i dati. Aggiungila tu stesso con File, Immagine di sfondo, Aggiungi immagine.';
$ec_lang['lpn_inp_drop_dangling']='Queste tubazioni fanno riferimento a un nodo che non è nel file, quindi sono state tralasciate.';
$ec_lang['lpn_inp_drop_units']='L\'unità di portata indicata in questo file non è tra quelle che questa pagina riconosce, quindi ogni numero è stato letto come galloni al minuto. Controlla ogni numero prima di usare i risultati.';
$ec_lang['lpn_inp_drop_anchor_missing']='Questo testo era collegato a un nodo, un serbatoio o una vasca che non è presente nel file. È stato importato come testo libero nel punto in cui il file lo collocava, e ora non segue più nulla.';
$ec_lang['lpn_import_notes_heading']='Questo progetto è stato letto da un file EPANET. Parte di ciò che quel file contiene viene conservata ma non usata su questa pagina.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='Aperto {name} da un file, e aggiunto a questo browser come nuovo progetto.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='File di progetto';
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
$ec_lang['lpn_file_upload_explain']='Questo browser non può collegarsi a un file, quindi aprire un file qui è in realtà un caricamento: il progetto viene copiato in questo browser, e l\'unico modo per salvare il tuo lavoro nel file è sovrascriverlo con File, Salva con nome.';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='Apre un file di progetto salvato da questa pagina.';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='Salva nel file collegato.';
$ec_lang['lpn_file_saveas_tip']='Scegli un file in cui salvare. Questo progetto si collega a quel file, e da quel momento Salva scrive su di esso.';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='Salva usando le impostazioni di download del tuo browser. Questo browser non può collegarsi a un file, quindi Salva è disattivato ed è disponibile solo Salva con nome. Se attivi l\'impostazione del browser "Chiedi dove salvare ogni file", puoi scegliere il file originale e sovrascriverlo.';
$ec_lang['lpn_status_uploaded']='File di progetto caricato. Non è possibile mantenere una connessione ad esso, quindi l\'unico modo per salvarci sopra è usare File, Salva con nome.';
$ec_lang['lpn_status_downloaded']='Scaricato {file}. Questo browser non può collegarsi a un file, quindi questo progetto resta contrassegnato come non salvato su file.';
$ec_lang['lpn_status_file_opened']='Aperto {file}.';
$ec_lang['lpn_status_already_open']='Quel file è già aperto qui come {name}, quindi si è passati a quello invece di aprire una seconda copia.';
$ec_lang['lpn_status_already_open_dirty']='Quel file è già aperto qui come {name}, con modifiche non ancora salvate. Si è passati a quello invece di aprire una seconda copia. Usa File, Ripristina se preferisci la versione sul disco.';
$ec_lang['lpn_status_saved']='Salvato {file}.';
$ec_lang['lpn_status_reverted']='Ricaricato {file} dal disco.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Salvare le modifiche a {name} prima di chiuderlo?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} è conservato solo in questo browser. Se lo chiudi senza salvarlo su file, andrà perso per sempre.';
$ec_lang['lpn_close_discard']='Chiudi senza salvare';
$ec_lang['lpn_cancel']='Annulla';
$ec_lang['lpn_revert_confirm']='Scartare le modifiche apportate e ricaricare {file} dal disco?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Questo progetto proviene da {file}, ma la connessione a quel file è andata persa. Scegli di nuovo il file per ricollegarti.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Impossibile scrivere sul file. Potrebbe essere stato spostato o rinominato, oppure il permesso potrebbe essere stato revocato. Il tuo lavoro è comunque salvato in questo browser.';
$ec_lang['lpn_file_changed_elsewhere']='Qualcun altro ha salvato su questo file da quando lo hai aperto, quindi salvare ora sovrascriverebbe il suo lavoro. Usa File, Salva con nome per conservare le tue modifiche in un file separato, oppure File, Ripristina per scartare le tue e caricare le sue.';
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
$ec_lang['lpn_lock_somebody']='Qualcun altro';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} ha questo file aperto.';
$ec_lang['lpn_lock_open_readonly']='Apri in sola lettura';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Forza il blocco';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Questo file sembra essere in uso.';
$ec_lang['lpn_lock_open_care']='Per evitare la perdita di dati, scegli con attenzione tra le opzioni qui sotto.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='È in uso da {x}.';
$ec_lang['lpn_lock_age_edited']='È stato modificato l\'ultima volta {x} fa.';
$ec_lang['lpn_lock_age_saved']='È stato salvato l\'ultima volta {x} fa.';
$ec_lang['lpn_lock_age_never_saved']='Non è stato ancora salvato nulla in questo file.';
$ec_lang['lpn_lock_age_unknown']='Non c\'è traccia di quanto tempo sia stato in uso, o di quando sia stato salvato o modificato l\'ultima volta.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"Chiedi" dice a chi ha questo file aperto che lo vorresti, e non cambia nient\'altro. "Apri in sola lettura" ti permette di guardarlo e modificare quello che vuoi, senza poter salvare qui. "Forza il blocco" ti permette di salvare sopra il file; il loro lavoro non salvato non va perso, ma non potranno più salvarlo qui, e qualcuno potrebbe dover unire i due a mano.';
$ec_lang['lpn_lock_ask']='Chiedi';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Chi dobbiamo dire che sta chiedendo? Le tue iniziali sono l\'ideale. Vengono conservate con il blocco di questo file sul nostro server, per chiunque lo abbia aperto, ed eliminate entro 30 giorni.';
$ec_lang['lpn_lock_ask_sent']='Abbiamo chiesto a chi ha questo file aperto di chiuderlo. Lo vedrà entro un minuto, se la sua pagina è ancora aperta. Nient\'altro è cambiato, e il file resta suo finché non lo chiude.';
$ec_lang['lpn_lock_ask_failed']='Il tuo messaggio non è stato consegnato. O nessuno ha questo file aperto ora, oppure non è stato possibile raggiungere il server.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Quel file non è stato aperto, e qui non è cambiato nulla. Qualcun altro lo ha ancora aperto.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} vorrebbe modificare questo file. Quando sei pronto, salva il tuo lavoro e usa File, Chiudi per cederlo.';
$ec_lang['lpn_ago_seconds']='{n} secondi';
$ec_lang['lpn_ago_minutes']='{n} minuti';
$ec_lang['lpn_ago_hours']='{n} ore';
$ec_lang['lpn_ago_days']='{n} giorni';
$ec_lang['lpn_ago_unknown']='un tempo sconosciuto';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Messaggi';
$ec_lang['lpn_msglog_heading']='Messaggi recenti';
$ec_lang['lpn_msglog_empty']='Ancora nessun messaggio.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} fa';
$ec_lang['lpn_msglog_note']='Dal più recente. Questa pagina conserva gli ultimi {n} messaggi finché resta aperta, e non memorizza nulla sul tuo computer.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Sola lettura: {name} ha questo file aperto. Puoi modificare qui tutto ciò che vuoi, ma non puoi salvare. Usa File, Salva con nome per salvare su un file diverso.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Attenzione: non è stato possibile contattare il server per verificare o creare un blocco su questo progetto, quindi nulla impedisce a un collega di modificare lo stesso file contemporaneamente. Sarai avvisato se il blocco tornerà a funzionare.';
$ec_lang['lpn_lock_storage_error']='Attenzione: questo sito non può salvare i record di blocco, quindi nulla impedisce a un collega di modificare lo stesso file contemporaneamente. Si tratta di un problema di configurazione del server, non qualcosa che puoi risolvere qui — la cartella dei blocchi non è scrivibile dal server web.';
$ec_lang['lpn_lock_full_error']='Attenzione: questo sito ha esaurito lo spazio per registrare chi ha quale progetto aperto, quindi nulla impedisce a un collega di modificare lo stesso file contemporaneamente. Si tratta di un problema di configurazione del server, non qualcosa che puoi risolvere qui.';
$ec_lang['lpn_lock_not_asked']='Il blocco non è attivo per questo progetto, quindi nulla impedisce a un collega di modificare lo stesso file contemporaneamente. Questo progetto non ha ancora un identificativo, e salvarlo su file gliene assegna uno.';
$ec_lang['lpn_lock_restored']='Il blocco funziona di nuovo, e ora questo file è tuo per salvarci sopra.';
$ec_lang['lpn_lock_dismiss']='Nascondi questo messaggio';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Il tuo progetto verrà salvato in un file su questo computer. Viene salvato quando lo chiedi tu, e in nessun altro momento, quindi nulla viene scritto su quel file a tua insaputa.';
$ec_lang['lpn_file_training_2']='Affinché due persone non modifichino mai lo stesso file contemporaneamente, questo sito tiene traccia di chi lo ha aperto. Se qualcuno lo ha già aperto, puoi comunque aprirlo per guardarlo, oppure conservarne una copia tua.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='La prima volta che salvi, il tuo browser chiederà se questo sito può modificare il file. Quella domanda viene dal browser, non da noi, e rispondere sì è ciò che permette a Salva di riscrivere il tuo lavoro. Di solito viene chiesto una sola volta per file.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Continua';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Scegli di nuovo il file';
$ec_lang['lpn_file_reconnect']='Ricollegati a questo file';
$ec_lang['lpn_file_reconnect_alert']='Questo progetto proviene da {file}. Il tuo browser ha bisogno di nuovo del tuo permesso prima di poterci scrivere. Ricollegati qui sotto.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Questo è lo stesso file che qualcun altro ha aperto, quindi non può essere sovrascritto. Scegli un file o un nome diverso.';
$ec_lang['lpn_saveas_overwrites_project']='Quel file contiene già un progetto diverso, {name}. Salvare qui lo sostituisce completamente. Continuare?';
$ec_lang['lpn_saveas_overwrites_newer']='Quel file è cambiato da quando lo hai visto l\'ultima volta, quindi quasi certamente qualcun altro ci ha salvato sopra. Salvare qui sostituisce la sua versione con la tua. Continuare?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Nome per questo progetto';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='Chiuso {closed}. Ora visualizzato {opened}.';
$ec_lang['lpn_status_closed_empty']='Chiuso {closed}. Avviato un nuovo progetto vuoto.';
$ec_lang['lpn_storage_full']='Non salvato. Lo spazio di archiviazione del browser è pieno o non disponibile, quindi le modifiche recenti andranno perse alla chiusura di questa scheda.';
$ec_lang['lpn_storage_unreadable']='Non salvato. Non è stato possibile leggere questo progetto dalla memoria del browser. La sua copia memorizzata resta esattamente com\'è e non verrà sovrascritta, quindi in questa scheda non viene salvato nulla. Aprire un file o creare un nuovo progetto per continuare a lavorare.';
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
$ec_lang['lpn_about_credits']='Crediti';
$ec_lang['lpn_help_welcome']='Pagina di benvenuto';
$ec_lang['lpn_about_license']='Concesso in licenza secondo la GNU General Public License v3.0 o successiva.';
$ec_lang['lpn_notes_1_term']='Come viene risolto';
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
$ec_lang['lpn_notes_1_def']='Il risolutore EPANET calcola questa rete. Imposta una durata totale del calcolo e ogni passo di riferimento viene calcolato a turno: le vasche si riempiono e si svuotano, le richieste seguono i propri modelli, e la barra degli strumenti riproduce il calcolo.';
$ec_lang['lpn_notes_2_term']='Cosa non fa';
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
$ec_lang['lpn_notes_2_def']='La qualità dell\'acqua è modellata: età dell\'acqua, traccia sorgente, e una sostanza chimica che reagisce sulle pareti delle tubazioni e nel corpo dell\'acqua. Il colpo d\'ariete e le sovrapressioni transitorie non sono modellati: ogni risultato qui riguarda l\'acqua già in moto stazionario, non l\'onda di pressione quando una valvola si chiude di scatto.';
$ec_lang['lpn_notes_3_term']='Salvataggio dei progetti';
$ec_lang['lpn_notes_3_def']='Ogni progetto è una scheda, e ogni scheda viene salvata in questo browser mentre lavori. Cancellare i dati del browser li elimina tutti, quindi conserva il tuo lavoro in un file: File, Salva con nome. Un asterisco su una scheda indica che contiene modifiche non presenti in un file. Nulla viene mai scritto su un file a meno che tu non lo chieda. In alcuni browser un progetto si collega al file in cui lo salvi, e da quel momento File, Salva scrive su quello stesso file; in altri nessuna connessione è possibile, quindi Salva è disattivato ed è disponibile solo Salva con nome. Quando un file di progetto è conservato su un\'unità condivisa, questa pagina ti avvisa se un collega lo ha già aperto, in modo che due persone non scrivano l\'una sopra il lavoro dell\'altra.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Curva della pompa';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Una pompa segue H = H₀ − aQ^b, dove H è il carico aggiunto dalla pompa e Q è la portata che l\'attraversa. Inserisci uno, due o tre punti dalla curva del produttore. Tre punti — il carico a portata zero, il punto di lavoro normale e il punto di portata massima — determinano direttamente H₀, a e b, e seguono più fedelmente una curva pubblicata. Due punti adattano una parabola (b = 2) con il vertice a portata zero. Un punto usa una regola comune: il carico a portata zero è 1,33 × il carico inserito, e la portata massima è 2 × la portata inserita, il che dà di nuovo b = 2. Una pompa senza punti inseriti non aggiunge alcun carico. La curva non viene troncata dove il carico raggiunge zero, quindi chiedere a una pompa più portata di quella che la sua curva può fornire dà un carico negativo. La soluzione è una pompa più grande o una richiesta minore, non un adattamento della curva diverso. Una curva può contenere più di tre punti, e ogni punto che hai inserito viene letto.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='Anche su questa pagina';
$ec_lang['lpn_notes_4_def']='Un progetto può appoggiarsi sul terreno reale con una mappa stradale dietro di esso. I file EPANET .inp possono essere letti e scritti. Il pannello inferiore disegna un profilo lungo un percorso ed elenca i nodi. Gli elementi possono essere colorati in base ai loro risultati, e Trova individua ogni elemento che soddisfa una condizione che imposti.';
$ec_lang['lpn_notes_6_term']='Guida alle colonne della tabella';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Seleziona colonna</td><td>Fai clic sull\'intestazione</td></tr><tr><td>Aggiungi o estendi la selezione delle colonne</td><td>Ctrl+clic o Shift+clic su un\'altra intestazione</td></tr><tr><td>Sposta (riordina) le colonne selezionate</td><td>Trascina oppure usa Gestisci colonne… nel menu del clic destro o ⋮</td></tr><tr><td>Menu ⋮ e freccia di ordinamento.</td><td>Passa il puntatore sull\'angolo superiore di un\'intestazione, oppure selezionala o raggiungila con Tab</td></tr><tr><td>Nascondi, Mostra tutte, o Gestisci visibilità e ordine</td><td>Clic destro sull\'intestazione o menu ⋮ nell\'angolo superiore destro dell\'intestazione</td></tr><tr><td>Ordina per colonna</td><td>Icona a freccia nell\'angolo superiore destro dell\'intestazione</td></tr><tr><td>Incolla come nuove righe in fondo alla tabella</td><td>Clic destro, menu ⋮ nell\'angolo superiore destro dell\'intestazione, oppure Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Scorciatoie da tastiera della tabella';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Tasti freccia</td><td>Naviga.</td></tr><tr><td>Tab, Enter</td><td>Completa l\'inserimento e sposta di una cella in orizzontale/verso il basso.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Naviga all\'indietro.</td></tr><tr><td>Shift+tasti freccia</td><td>Estende la selezione.</td></tr><tr><td>Ctrl+C</td><td>Copia la selezione.</td></tr><tr><td>Ctrl+D</td><td>Riempi la selezione verso il basso a partire dalla riga superiore.</td></tr><tr><td>Ctrl+Enter</td><td>Riempi la selezione con il valore della cella attiva.</td></tr><tr><td>Ctrl+A</td><td>Seleziona l\'intera tabella.</td></tr><tr><td>Ctrl+Shift+V</td><td>Incolla come nuove righe in fondo alla tabella.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Passa alla tabella successiva o precedente.</td></tr><tr><td>Delete</td><td>Cancella una cella.</td></tr><tr><td>F2</td><td>Apre una cella per modificarla.</td></tr><tr><td>Esc</td><td>Annulla una modifica.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='I limiti delle fasce di colore restano gli stessi';
$ec_lang['lpn_notes_color_def']='I limiti delle fasce di colore vengono impostati quando scegli un metodo di classificazione dei dati. Non vengono impostati di nuovo a ogni passo temporale, perché ciò farebbe sì che i colori assumano un significato nuovo a ogni passo, il che non aiuta a visualizzare il tuo sistema. EPANET funziona allo stesso modo. Per ottenere nuovi limiti, scegli di nuovo un metodo oppure digita i tuoi limiti.';
$ec_lang['lpn_notes_epanet_term']='Le costanti di Hazen-Williams corrispondono a EPANET';
$ec_lang['lpn_notes_epanet_def']='Nell\'agosto 2026 il coefficiente e l\'esponente di Hazen-Williams sono stati modificati per corrispondere a EPANET. I risultati di perdita di carico differiscono dalle versioni precedenti di questa pagina fino allo 0,1 percento, un valore molto più piccolo dell\'incertezza sul valore di C stesso.';
$ec_lang['lpn_notes_engine_term']='Quale EPANET esegue questa pagina';
$ec_lang['lpn_notes_engine_def']='Il risolutore EPANET di questa pagina è OWA-EPANET 2.3.5, rilasciato il 20 febbraio 2025. EPANET è sviluppato da Open Water Analytics, una comunità che collabora con l\'Agenzia per la protezione dell\'ambiente degli Stati Uniti (EPA), che ha rilasciato la versione 2.2.0 nel dicembre 2019. Il rapporto di calcolo lo chiama 2.3.05 perché il motore scrive l\'ultimo numero con due cifre. Raggiunge questa pagina tramite epanet-js 0.9.0 di Luke Butler, sotto licenza MIT, e viene eseguito all\'interno del tuo browser: la tua rete non viene mai inviata altrove per essere risolta.';
$ec_lang['lpn_id_invalid']='Inserisci un ID senza spazi e senza virgolette.';
$ec_lang['lpn_id_taken']='Quell\'ID è già in uso.';
$ec_lang['lpn_diag_no_fixed_head']='Aggiungi un serbatoio o una vasca. La rete ha bisogno di almeno un livello dell\'acqua noto prima di poter essere risolta.';
$ec_lang['lpn_diag_dangling_link']='Una tubazione o una pompa si collega a un nodo che non esiste più:';
$ec_lang['lpn_diag_unreachable']='Questi nodi non hanno un percorso verso un serbatoio:';
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
$ec_lang['lpn_engine_fetching']='Recupero del risolutore EPANET. Viene scaricato una sola volta e poi conservato su questo dispositivo, così in seguito funziona anche offline.';
$ec_lang['lpn_engine_ready']='Il risolutore EPANET è ora su questo dispositivo e funziona offline.';
$ec_lang['lpn_engine_fetching_valve']='Recupero del risolutore EPANET, così questa valvola può essere risolta ora e offline in seguito.';
$ec_lang['lpn_engine_ready_valve']='Il risolutore EPANET è ora su questo dispositivo. Le valvole che si aprono e si chiudono da sole funzioneranno offline.';
$ec_lang['lpn_engine_unavailable']='Non è stato possibile ottenere il risolutore EPANET, che è ciò che risolve le valvole che si aprono e si chiudono da sole. Connettiti a internet una sola volta e da quel momento resterà conservato su questo dispositivo.';
$ec_lang['lpn_engine_needed_loading']='Caricamento del risolutore EPANET in corso mentre costruisci. I risultati saranno disponibili quando il caricamento sarà completo.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Avanzamento caricamento del risolutore';
$ec_lang['lpn_engine_wait']='Caricamento del risolutore in corso. I risultati sono momentaneamente ritardati. Continua a lavorare.';
$ec_lang['lpn_engine_wait_pct']='Risolutore caricato al {percent}%.';
$ec_lang['lpn_engine_wait_bytes']='Risolutore: {kb} KB caricati finora. Il totale non è disponibile, quindi la percentuale di completamento è sconosciuta.';
$ec_lang['lpn_engine_needed_failed']='Il risolutore EPANET non è stato ancora caricato, non può essere caricato, e questa rete può essere risolta solo da esso. Verrà caricato quando sei connesso a internet.';
$ec_lang['lpn_diag_valve_needs_epanet']='Queste valvole si aprono e si chiudono da sole, e solo il risolutore EPANET è in grado di calcolarle. Non è stato possibile caricare il risolutore EPANET, quindi questi risultati mancano:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Queste valvole sono collegate direttamente a un serbatoio o a una vasca, che già fissa lì il livello dell\'acqua, quindi non resta nulla da controllare per la valvola. Inserire un breve tratto di tubazione tra la valvola e il serbatoio o la vasca:';
$ec_lang['lpn_diag_not_converged']='Non è stata trovata alcuna soluzione. Controlla se ci sono valori impossibili nella realtà, come un diametro pari a zero.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Il calcolo non è convergito. Questi numeri sono dell\'ultimo tentativo, non una soluzione. Non usarli.';
$ec_lang['lpn_diag_not_converged_trials']='Si è fermato dopo {iterations} tentativi.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Si è fermato dopo {iterations} tentativi a un errore relativo di {error}, che non ha raggiunto l\'impostazione di Precisione di {accuracy}.';
$ec_lang['lpn_field_roughness']='Scabrezza';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='C di Hazen-Williams. Un numero più alto indica una tubazione più liscia: circa 150 per plastica nuova, 130 per acciaio o ghisa nuovi, e 100 per tubazioni vecchie.';
$ec_lang['lpn_field_length']='Lunghezza';
$ec_lang['lpn_field_from']='Da';
$ec_lang['lpn_field_to']='A';
$ec_lang['lpn_field_length_tip']='Lunghezza della tubazione. Con Auto attivato, la lunghezza è misurata da ciò che hai disegnato. Disattiva Auto per digitare una lunghezza diversa dal disegno.';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Tipo di valvola';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Che cosa fa la valvola. Una valvola di laminazione mantiene una perdita fissa. Le altre tre mantengono una pressione o una portata, e si aprono completamente, si chiudono o si chiudono parzialmente al variare dell\'acqua. Cambiando il tipo, il valore di impostazione qui sotto viene riportato a un nuovo valore iniziale, perché una pressione non è una portata e nessuna delle due è un coefficiente di perdita.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Di laminazione (TCV)';
$ec_lang['lpn_valve_type_prv']='Riduttrice di pressione (PRV)';
$ec_lang['lpn_valve_type_psv']='Sostenitrice di pressione (PSV)';
$ec_lang['lpn_valve_type_fcv']='Regolatrice di portata (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Rompitratta di pressione (PBV)';
$ec_lang['lpn_valve_type_gpv']='Generica (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Caduta di pressione';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='La pressione che la valvola toglie. Una valvola rompitratta toglie sempre esattamente questa quantità di pressione, qualunque sia il verso in cui scorre l\'acqua. È una caduta attraverso la valvola, non una pressione da mantenere.';
$ec_lang['lpn_inp_drop_gpv_curve']='Questa valvola fa riferimento a una curva di perdita di carico che non è nel file. La valvola è stata importata senza curva, quindi resta completamente aperta finché non gliene assegni una.';
$ec_lang['lpn_gpv_curve_source']='Curva di perdita di carico della valvola';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='La curva nella finestra Librerie che indica quanto carico perde questa valvola a ogni portata. Più valvole possono usare la stessa curva, e modificarla lì la cambia per tutte. Questa valvola contiene solo il riferimento; i punti stessi si leggono e si modificano in Librerie, Curve.';
$ec_lang['lpn_field_valve_setting_pressure']='Impostazione di pressione';
$ec_lang['lpn_field_valve_setting_pressure_tip']='La pressione che la valvola mantiene. Una valvola riduttrice di pressione mantiene la pressione a valle a un valore pari o inferiore a questo. Una valvola sostenitrice di pressione mantiene la pressione a monte a un valore pari o superiore a questo.';
$ec_lang['lpn_field_valve_setting_flow']='Impostazione di portata';
$ec_lang['lpn_field_valve_setting_flow_tip']='La massima quantità d\'acqua che la valvola lascia passare. Quando la portata richiesta è inferiore a questo valore, la valvola resta completamente aperta e non introduce alcuna perdita.';
$ec_lang['lpn_field_valve_setting']='Impostazione';
$ec_lang['lpn_field_valve_setting_loss']='Coefficiente di perdita';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Quanto carico toglie la valvola di laminazione, espresso come multiplo del carico cinetico. Usare 0 per una valvola completamente aperta. Questo unico numero rappresenta l\'intera perdita della valvola di laminazione.';
$ec_lang['lpn_field_valve_diameter_tip']='Larghezza dell\'apertura della valvola. La velocità dell\'acqua attraverso la valvola è calcolata da questa larghezza, e la perdita deriva da quella velocità.';
$ec_lang['lpn_field_valve_km_tip']='Perdita dovuta al corpo della valvola quando è completamente aperta, in aggiunta a quanto toglie l\'impostazione della valvola. È espressa come multiplo del carico cinetico. Usare 0 per ignorarla.';
$ec_lang['lpn_field_km']='Coefficiente di perdita concentrata (locale), k';
$ec_lang['lpn_field_km_tip']='Perdita dovuta a curve, valvole e raccordi su questa tubazione, contata come multiplo del carico cinetico. Usa 0 per una tubazione dritta senza accessori.';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Perdita concentrata, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Curva del carico della pompa';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='La curva nella finestra Librerie che indica quanto carico aggiunge questa pompa a ogni portata. Più pompe possono usare la stessa curva, e modificarla lì la cambia per tutte. Questa pompa contiene solo il riferimento; i punti stessi si leggono e si modificano in Librerie, Curve.';
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
$ec_lang['lpn_field_desc']='Descrizione';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='Per un tuo uso personale, come un incrocio stradale o il materiale di una tubazione. Viene portata dentro e fuori dal file EPANET, dove si trova alla fine della riga propria dell\'elemento. Nessun calcolo la legge. Un a-capo diventa uno spazio, perché il file non ha dove metterlo.';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Etichetta';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Un\'etichetta può avere qualunque significato ti serva, per esempio una zona di pressione o un ordine di lavoro. Nessun calcolo qui o in EPANET la legge. Un\'etichetta è una sola parola: EPANET smette di leggere al primo spazio, quindi uno spazio viene rifiutato mentre lo digiti. Viene importata ed esportata nel file EPANET.';
$ec_lang['lpn_pump_effic_curve']='Curva di efficienza della pompa';
$ec_lang['lpn_pump_effic_curve_tip']='La curva nella finestra Librerie che indica quanto è efficiente questa pompa a ogni portata. Più pompe possono usare la stessa curva, e modificarla lì la cambia per tutte. Questa pompa contiene solo il riferimento; i punti stessi si leggono e si modificano in Librerie, Curve.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Nessuna curva selezionata';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Curve';
$ec_lang['lpn_curve_library_link_tip']='Apre la finestra Librerie sulla sua sezione Curve, dove una curva si aggiunge, si descrive, si modifica e si elimina. Un elemento indica quale curva usa.';
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
$ec_lang['lpn_curve_kind_head']='Carico della pompa';
$ec_lang['lpn_curve_kind_effic']='Efficienza della pompa';
$ec_lang['lpn_curve_kind_volume']='Volume della vasca';
$ec_lang['lpn_curve_kind_headloss']='Perdita di carico della valvola';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Tipo non indicato';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Vol.';
$ec_lang['lpn_pump_effic_col']='Efficienza';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Questa pompa non ha una curva di efficienza selezionata, quindi funziona all\'efficienza impostata per l\'intera rete, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Questa pompa fa riferimento a una curva di efficienza chiamata {name}, che nulla in questo progetto definisce, quindi funziona all\'efficienza impostata per l\'intera rete, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Modalità: Seleziona. Fai clic su un elemento o un\'etichetta per vederlo o modificarlo. Trascina per spostare un nodo, un vertice o un\'etichetta. Usa lo strumento Vertici per aggiungere o rimuovere le pieghe di una tubazione.';
$ec_lang['lpn_mode_delete']='Modalità: Elimina. Fai clic su un elemento per rimuoverlo.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Modalità: Vertici. I vertici di ogni tubazione sono mostrati come piccole maniglie quadrate. Fai clic su una tubazione per aggiungere un vertice, fai clic su una maniglia per rimuoverlo, oppure trascina una maniglia per spostarlo. In questa modalità nient\'altro sulla mappa viene modificato.';
$ec_lang['lpn_mode_zoom_window']='Modalità: Zoom finestra. Fai clic su due angoli opposti di un rettangolo, oppure trascinane uno, sulla mappa per ingrandire su di esso.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Non è selezionato nulla. Fai prima clic su un elemento sulla mappa, poi premi Elimina.';
$ec_lang['lpn_mode_add_junction']='Modalità: Aggiungi nodo. Fai clic sulla mappa per posizionare un nodo. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
$ec_lang['lpn_mode_add_reservoir']='Modalità: Aggiungi serbatoio. Fai clic sulla mappa per posizionare un serbatoio. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
$ec_lang['lpn_mode_add_tank']='Modalità: Aggiungi vasca. Fai clic sulla mappa per posizionare una vasca. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
$ec_lang['lpn_mode_add_pipe']='Modalità: Aggiungi tubazione. Fai clic su un nodo, poi su un altro nodo, per collegarli. Fai clic in uno spazio vuoto tra i due per piegare la linea, oppure premi Esc per ricominciare. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
$ec_lang['lpn_mode_add_pump']='Modalità: Aggiungi pompa. Fai clic su un nodo, poi su un altro nodo, per collegarli. Fai clic in uno spazio vuoto tra i due per piegare la linea, oppure premi Esc per ricominciare. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
$ec_lang['lpn_mode_add_valve']='Modalità: Aggiungi valvola. Fai clic su un nodo, poi su un altro nodo, per collegarli. Fai clic in uno spazio vuoto tra i due per piegare la linea, oppure premi Esc per ricominciare. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Modalità: Aggiungi testo. Fai clic sulla mappa per posizionare un Testo. Fai clic vicino a un nodo per collegare il Testo a quel nodo. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Usa questa modalità per modificare, spostare e trascinare elementi sulla mappa. È la modalità in cui la pagina torna per impostazione predefinita: vi ritorna da sola dopo alcune azioni, come l\'apertura di un progetto. Premendo Esc una seconda volta si deseleziona ciò che è selezionato.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='Puoi trascinare un\'etichetta per spostarla. L\'etichetta si evidenzia brevemente per avvisarti che è stata spostata. Fai doppio clic su un\'etichetta per riportarla alla sua posizione automatica.';
$ec_lang['lpn_field_auto']='Auto';
$ec_lang['lpn_method_switch_confirm']='Cambiare il metodo di attrito non modifica i valori di scabrezza già inseriti nelle tubazioni, e un valore di scabrezza per un metodo non ha senso per un altro. Controllare ogni tubazione dopo questa modifica. Cambiare comunque?';
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
$ec_lang['lpn_field_closed']='Chiusa';
$ec_lang['lpn_field_closed_tip']='Chiude questa tubazione in modo che l\'acqua non possa più passarvi. La tubazione resta sulla mappa e mantiene tutti i suoi valori, e può essere riaperta in qualsiasi momento.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Longitudine';
$ec_lang['lpn_field_lat']='Latitudine';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Coordinata Nord';
$ec_lang['lpn_field_easting']='Coordinata Est';
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
$ec_lang['lpn_field_coord_tip']='Digita una posizione in coordinate per collocare questo nodo esattamente. In uno scenario questa posizione si applica solo a quello scenario, proprio come trascinarlo; in Base colloca il nodo ovunque.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Questo è fuori dalla mappa. Nella proiezione Pseudo Mercator la latitudine varia da -85,05 a 85,05 e la longitudine da -180 a 180.';
$ec_lang['lpn_field_text_size']='Moltiplicatore di dimensione';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Mostra a tutti i livelli di zoom';
$ec_lang['lpn_field_text_all_zoom_tip']='Mantieni questo testo sul disegno indipendentemente da quanto rimpicciolisci lo zoom. Deselezionalo e il testo si nasconde insieme alle altre etichette quando la vista è più ampia della soglia di etichettatura impostata in Mappa e pagina.';
$ec_lang['lpn_tool_labels']='Etichette';
$ec_lang['lpn_labels_heading_node']='Etichette dei nodi';
$ec_lang['lpn_labels_heading_link']='Etichette dei collegamenti';
$ec_lang['lpn_labels_decimals_tip']='Cifre decimali mostrate per questa etichetta';
$ec_lang['lpn_labels_mark_extrema']='Segna i valori più alti e più bassi';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Disegna una linea sopra il valore più alto di ogni proprietà con etichetta sulla mappa (una soprallineatura), e una linea sotto il valore più basso di quella proprietà (una sottolineatura), così puoi individuare il più alto e il più basso senza leggere i numeri.';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Applica a tutti';
$ec_lang['lpn_settings_apply_to_all_tip']='Ogni elemento di questo tipo già disegnato riceve un ID che inizia con questo testo. Ciascuno mantiene il proprio numero. Un ID che non termina con un numero viene lasciato invariato.';
$ec_lang['lpn_confirm_apply_prefix']='Rinominare {n} elementi in modo che i loro ID inizino con {prefix}? Ciascuno mantiene il proprio numero.';
$ec_lang['lpn_prefix_applied']='Rinominati {n} elementi. {skipped} altri sono stati lasciati invariati.';
$ec_lang['lpn_labels_prefix_tip']='Testo aggiunto prima di questa proprietà nelle etichette della mappa';
$ec_lang['lpn_labels_suffix_tip']='Testo aggiunto dopo questa proprietà nelle etichette della mappa';
$ec_lang['lpn_labels_suffix_gradient_tip']='Testo aggiunto dopo il gradiente di perdita di carico nelle etichette della mappa. Non digitare qui un simbolo di percentuale. Viene aggiunto automaticamente quando le unità sono in percentuale.';
$ec_lang['lpn_labels_separator']='Testo tra i valori';
$ec_lang['lpn_labels_separator_tip']='Testo tra una proprietà e la successiva su un\'etichetta. Uno spazio per impostazione predefinita.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Priorità';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='L\'ordine in cui i valori vengono eliminati quando un\'etichetta non entra nello spazio disponibile. 1 viene mantenuto più a lungo.';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='L\'ordine in cui i valori vengono eliminati quando due etichette di nodo si sovrapporrebbero. Il valore numerato 1 viene eliminato per primo. Quando resta un solo valore e le etichette si sovrappongono ancora, un\'intera etichetta viene nascosta: quella con la richiesta più bassa, la pressione più vicina al centro dell\'intervallo, oppure la quota o il carico più simili a quelli dei nodi vicini.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Pre.';
$ec_lang['lpn_labels_col_after']='Dop.';
$ec_lang['lpn_labels_col_decimals']='Decimali';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Mostra';
$ec_lang['lpn_labels_show_tip']='L\'ordine in cui i valori compaiono su un\'etichetta. Il valore numerato 1 viene per primo: in cima a un\'etichetta impilata, e all\'inizio di un\'etichetta su una riga sola.';
$ec_lang['lpn_labels_priority_customer_tip']='L\'ordine in cui i valori vengono tolti da un\'etichetta cliente. Il valore numerato 1 viene tolto per primo.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Usa unità';
$ec_lang['lpn_labels_use_units_tip']='Seleziona per mostrare l\'unità nel riquadro Dopo e sull\'etichetta, e per mantenerla aggiornata quando le unità cambiano. Deseleziona per digitare un tuo testo personalizzato in Dopo.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Stato iniziale';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Colori dei nodi';
$ec_lang['lpn_settings_sym_link_colors']='Colori dei collegamenti';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Immagine di sfondo…';
$ec_lang['lpn_backdrop_add']='Aggiungi';
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
$ec_lang['lpn_backdrop_scale']='Ridimensiona su due punti';
$ec_lang['lpn_backdrop_scale_entry']='Ridimensiona con un file world o con la dimensione di un pixel sulla mappa';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Ridimensiona dalla dimensione attuale, attorno a un punto scelto';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Fai clic sul punto dell\'immagine di sfondo che deve restare dove si trova.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Ridimensiona a partire dalla dimensione attuale. 1 la lascia invariata, 1,1 la rende il 10% più grande, 0,9 la rende il 10% più piccola.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Inserisci la dimensione di un pixel sulla mappa, oppure incolla il contenuto completo del file world dell\'immagine';
$ec_lang['lpn_backdrop_scale_entry_bad']='Digita un numero per la dimensione di un pixel sulla mappa, oppure incolla tutte e sei le righe di un file world.';
$ec_lang['lpn_backdrop_wld_bad']='Questo file world ruota, specchia o deforma in modo non uniforme l\'immagine. La mappa può solo spostare un\'immagine e ridimensionarla della stessa quantità in entrambe le direzioni, quindi il file non è stato usato.';
$ec_lang['lpn_backdrop_unreadable']='Il browser non può mostrare questa immagine. Salvala come PNG o JPEG e aggiungila di nuovo.';
$ec_lang['lpn_backdrop_position']='Sposta';
$ec_lang['lpn_backdrop_remove']='Rimuovi';
$ec_lang['lpn_backdrop_remove_confirm']='Rimuovere l\'immagine di sfondo?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Mappa del mondo…';
$ec_lang['lpn_map_attach_tip']='Collega la mappa del mondo a questo progetto senza cambiarlo in nessun altro modo.';
$ec_lang['lpn_map_attach_add']='Collega';
$ec_lang['lpn_map_attach_readjust']='Riadatta';
$ec_lang['lpn_map_attach_readjust_tip']='Torna al Passaggio 2 del processo di collegamento della mappa.';
$ec_lang['lpn_map_attach_scale_from']='Scala rispetto alla dimensione attuale…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Scala la mappa rispetto alla sua dimensione attuale, intorno al centro del tuo disegno. 1 la lascia invariata, 1,1 la rende il 10% più grande, 0,9 la rende il 10% più piccola.';
$ec_lang['lpn_map_attach_scale_from_bad']='Digita un solo numero maggiore di zero.';
$ec_lang['lpn_map_attach_scale_from_done']='La mappa è stata ridimensionata, e il tuo disegno e ogni coordinata al suo interno sono esattamente come erano.';
$ec_lang['lpn_map_attach_none']='Non c\'è ancora una mappa del mondo collegata a questo progetto. Usa prima Mappa, Mappa del mondo, Collega.';
$ec_lang['lpn_map_attach_remove']='Scollega';
$ec_lang['lpn_map_attach_remove_tip']='Rimuove la mappa del mondo. Il disegno e le sue coordinate restano comunque intatti.';
$ec_lang['lpn_map_attach_done']='La mappa del mondo è ora dietro al tuo disegno, e il tuo progetto non è cambiato. Usa Mappa, Mappa del mondo, Scollega per rimuoverla di nuovo.';
$ec_lang['lpn_map_attach_removed']='La mappa del mondo non c\'è più, e il disegno è esattamente come era.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Il tuo disegno si trova su una mappa del mondo intero, nell\'oceano a latitudine zero e longitudine zero. Trova prima la tua posizione: sposta e ingrandisci la mappa dietro al disegno, cerca un nome di luogo, oppure digita una latitudine e una longitudine. Il disegno stesso non si sposta.';
$ec_lang['lpn_mapgeo_step1']='Passaggio 1 di 2: trova la tua posizione nel mondo';
$ec_lang['lpn_mapgeo_step2']='Passaggio 2 di 2: adatta la mappa dietro al tuo disegno';
$ec_lang['lpn_mapgeo_hint1']='Sposta e ingrandisci la mappa dietro al tuo disegno, oppure cerca un luogo, oppure digita una latitudine e una longitudine. Poi premi Colloca approssimativamente.';
$ec_lang['lpn_mapgeo_readjust_intro']='Il tuo disegno si trova dove lo hai collocato l\'ultima volta. Per spostarlo altrove, sposta e ingrandisci la mappa dietro al disegno, cerca un nome di luogo, oppure digita una latitudine e una longitudine. Il disegno stesso non si sposta.';
$ec_lang['lpn_mapgeo_hint2']='Trascina in un punto qualsiasi per far scorrere la mappa sotto il tuo disegno. Il tuo disegno e ogni coordinata al suo interno restano esattamente dove sono. Premi Georeferenzia qui quando la mappa è nella posizione giusta.';
$ec_lang['lpn_mapgeo_gestures']='Lo zoom sposta insieme il tuo disegno e la mappa, così puoi vedere quanto sono allineati. Il trascinamento sposta solo la mappa.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Ruota la mappa';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} gradi';
$ec_lang['lpn_mapgeo_dial_size']='Dimensione della mappa';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} volte';
$ec_lang['lpn_mapgeo_dial_help']='Fai scorrere le due barre, oppure digita nei riquadri sopra di esse, per rendere la mappa più grande o più piccola e per ruotarla. Il centro di ciascuna barra è il punto lasciato dal passaggio 1 di adattamento, quindi 1 e 0 significano non modificarla. I tasti freccia funzionano su entrambe.';
$ec_lang['lpn_mapgeo_place']='Colloca approssimativamente';
$ec_lang['lpn_mapgeo_finish']='Georeferenzia qui';
$ec_lang['lpn_mapgeo_cancelled']='La mappa del mondo è tornata dov\'era, e il tuo disegno non si è mai spostato.';
$ec_lang['lpn_mapgeo_locked']='Concludi con il pulsante Georeferenzia qui, oppure premi Annulla, prima di cambiare progetto o salvare. La mappa del mondo è ancora in fase di collocazione.';
$ec_lang['lpn_backdrop_scale_prompt1']='Fai clic su due punti dell\'immagine di sfondo, ad esempio i due estremi di una scala grafica. Poi digita la distanza reale tra loro.';
$ec_lang['lpn_backdrop_scale_prompt2']='Distanza reale tra i due punti';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Fai clic sul punto base (sull\'immagine) per lo spostamento.';
$ec_lang['lpn_backdrop_position_prompt2']='Scegli il metodo per il punto di destinazione, poi fai clic su Continua.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Regolazione dell\'immagine di sfondo in corso.';
$ec_lang['lpn_backdrop_target_label']='Sposta quel punto a:';
$ec_lang['lpn_backdrop_target_node']='Un nodo';
$ec_lang['lpn_backdrop_target_free']='Qualsiasi punto della mappa';
$ec_lang['lpn_backdrop_target_coords']='Coordinate che digiti';
$ec_lang['lpn_backdrop_coords_prompt']='Digita la X,Y a cui quel punto deve spostarsi';
$ec_lang['lpn_backdrop_continue']='Continua';
$ec_lang['lpn_tool_settings']='Impostazioni';
$ec_lang['lpn_settings_show_titles']='Mostra i titoli della pagina';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='Nasconde l\'intestazione della pagina e la riga di benvenuto sopra il disegno, così la mappa ha più spazio per lavorare. La stampa mostra sempre soltanto una mappa pulita, senza altro.';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Nascondi questi titoli';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Mostra l\'aiuto per la selezione';
$ec_lang['lpn_settings_area_hint_tip']='Mostra il fumetto sopra la mappa che indica che cosa farà il tuo prossimo clic mentre stai selezionando un\'area.';
$ec_lang['lpn_settings_id_prefixes']='Prefissi degli ID';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Valori iniziali';
$ec_lang['lpn_settings_defaults_note']='Usati per gli elementi che crei da questo momento in poi. Gli elementi esistenti non vengono modificati.';
$ec_lang['lpn_settings_push_note']='Vengono applicate solo le proprietà le cui etichette sono visibili in questo momento.';
$ec_lang['lpn_settings_push_btn']='Applica questi valori dei nuovi elementi a ogni elemento esistente';
$ec_lang['lpn_push_confirm']='Sostituire queste proprietà su ogni elemento esistente con i valori ora impostati per i nuovi elementi? I valori che hai digitato verranno sovrascritti. Puoi annullare questa azione.';
$ec_lang['lpn_push_properties']='Proprietà:';
$ec_lang['lpn_push_assets']='Nodi e tubazioni:';
$ec_lang['lpn_push_none_displayed']='Nessun valore iniziale è mostrato come etichetta in questo momento, quindi non c\'è nulla da applicare. Attiva le etichette per le proprietà desiderate nel pannello Etichette, poi riprova.';
$ec_lang['lpn_push_nothing']='Nessun elemento esistente ha una delle proprietà che si stanno applicando.';
$ec_lang['lpn_push_no_change']='Ogni elemento ha già questi valori, quindi nulla cambierebbe.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Proprietà personalizzate';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Proprietà definite autonomamente per scopi propri. Sono memorizzate con il progetto e gli scenari come tutte le altre proprietà.';
$ec_lang['lpn_cp_design']='Progettazione';
$ec_lang['lpn_cp_design_tip']='Una riga per ogni proprietà personalizzata; ciascuna si apre per mostrare: Chiave, Etichetta, Si applica a, Convalida come, Consenti o limita, il campo dei caratteri indicato da quella scelta, Limite inferiore di lunghezza, Limite superiore di lunghezza, Limite basso, Limite alto.';
$ec_lang['lpn_cp_add']='Aggiungi proprietà personalizzata';
$ec_lang['lpn_cp_add_tip']='Aggiunge una riga alla tabella di progettazione e la apre per la modifica.';
$ec_lang['lpn_cp_remove']='Rimuovi';
$ec_lang['lpn_cp_remove_tip']='Rimuove questa proprietà dalla tabella di progettazione. I valori già digitati sui tuoi elementi restano nel file e ricompaiono se si progetta di nuovo la stessa chiave.';
$ec_lang['lpn_cp_none']='Nessuna proprietà personalizzata è ancora stata progettata.';
$ec_lang['lpn_cp_unnamed']='Non ancora denominata';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Chiave';
$ec_lang['lpn_cp_key_tip']='Chiave: una proprietà è memorizzata con questo nome. Gli spazi non sono ammessi, e viene aggiunto automaticamente un prefisso in modo che la chiave non possa mai entrare in collisione con un campo predefinito.';
$ec_lang['lpn_cp_label']='Etichetta';
$ec_lang['lpn_cp_label_tip']='Etichetta: un lettore la vede nel riquadro delle proprietà, in Trova e in cima a una colonna della tabella.';
$ec_lang['lpn_cp_applies']='Si applica a';
$ec_lang['lpn_cp_applies_tip']='Si applica a: elenco separato da virgole dei prefissi ID degli elementi che usano questa proprietà, ad esempio J,L,R.';
$ec_lang['lpn_cp_validate']='Convalida come';
$ec_lang['lpn_cp_validate_tip']='Convalida come: indica l\'aspetto di un valore corretto. Le regole di maiuscole/minuscole leggono solo l\'alfabeto inglese, un limite dichiarato. Scegliere Non convalidare per accettare qualsiasi cosa.';
$ec_lang['lpn_cp_restrict']='Limita questi caratteri';
$ec_lang['lpn_cp_restrict_tip']='Limita questi caratteri: un valore può usare solo i caratteri elencati qui, oppure nessuno di essi, dove "@" indica qualsiasi lettera; "#" indica qualsiasi cifra numerica, e occorre elencare separatamente "-", "." e "," se sono ammessi; ed eventuali spazi bianchi devono trovarsi tra altri caratteri.';
$ec_lang['lpn_cp_restrict_mode']='Consenti o limita';
$ec_lang['lpn_cp_restrict_mode_tip']='Consenti o limita: i caratteri indicati sono o gli unici che un valore può usare, oppure quelli che non può usare.';
$ec_lang['lpn_cp_restrict_allow']='Consenti solo questi caratteri';
$ec_lang['lpn_cp_restrict_deny']='Limita questi caratteri';
$ec_lang['lpn_cp_minlength']='Limite inferiore di lunghezza';
$ec_lang['lpn_cp_minlength_tip']='Limite inferiore di lunghezza: ogni voce più corta viene segnalata, il modo per trovare le voci vuote e quelle digitate a metà.';
$ec_lang['lpn_cp_length']='Limite superiore di lunghezza';
$ec_lang['lpn_cp_length_tip']='Limite superiore di lunghezza: ogni voce più lunga viene segnalata.';
$ec_lang['lpn_cp_low']='Limite basso';
$ec_lang['lpn_cp_low_tip']='Limite basso: è il valore più piccolo previsto. I numeri sono confrontati come numeri e il testo in ordine alfabetico.';
$ec_lang['lpn_cp_high']='Limite alto';
$ec_lang['lpn_cp_high_tip']='Limite alto: è il valore più grande previsto. I numeri sono confrontati come numeri e il testo in ordine alfabetico.';
$ec_lang['lpn_cp_val_none']='Non convalidare';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Numero .';
$ec_lang['lpn_cp_val_number_comma']='Numero ,';
$ec_lang['lpn_cp_val_integer']='Intero';
$ec_lang['lpn_cp_val_upper']='TUTTO MAIUSCOLO';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Il valore viene mantenuto esattamente come digitato.';
$ec_lang['lpn_cp_bad_number']='Questo valore non è un numero come richiesto da questa proprietà.';
$ec_lang['lpn_cp_bad_integer']='Questo valore non è un numero intero come richiesto da questa proprietà.';
$ec_lang['lpn_cp_bad_case']='Questo valore non è TUTTO MAIUSCOLO come richiesto da questa proprietà.';
$ec_lang['lpn_cp_bad_chars']='Questo valore usa un carattere non consentito da questa proprietà.';
$ec_lang['lpn_cp_bad_space']='Gli spazi bianchi sono ammessi solo tra altri caratteri.';
$ec_lang['lpn_cp_bad_minlength']='Questo valore è più corto di quanto consentito da questa proprietà.';
$ec_lang['lpn_cp_bad_length']='Questo valore è più lungo di quanto consentito da questa proprietà.';
$ec_lang['lpn_cp_bad_low']='Questo valore è inferiore al limite basso di questa proprietà.';
$ec_lang['lpn_cp_bad_high']='Questo valore è superiore al limite alto di questa proprietà.';
$ec_lang['lpn_cp_key_needed']='Assegnare a questa proprietà personalizzata una chiave senza spazi.';
$ec_lang['lpn_cp_key_taken']='Un\'altra proprietà personalizzata usa già questa chiave.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Scenario';
$ec_lang['lpn_scenario_base']='Base';
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
$ec_lang['lpn_scenario_overrides']='N. di valori personalizzati';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='L\'anello ambra indica che questo elemento contiene un valore che appartiene solo allo scenario {name}.';
$ec_lang['lpn_scenario_overrides_tip']='Ognuno di quei valori è segnato sulla mappa con un anello ambra. Passa a {base} per vedere il disegno senza di essi.';
$ec_lang['lpn_scenario_menu']='Scenari';
$ec_lang['lpn_scenario_tip']='L\'insieme di valori che il disegno sta mostrando e che la pagina sta risolvendo in questo momento. Fai clic per cambiare scenario, oppure per aggiungerne, rinominarne o eliminarne uno.';
$ec_lang['lpn_scenario_new']='Nuovo scenario…';
$ec_lang['lpn_scenario_new_name']='Scenario {n}';
$ec_lang['lpn_scenario_prompt_name']='Nome per questo scenario';
$ec_lang['lpn_scenario_rename']='Rinomina scenario…';
$ec_lang['lpn_scenario_delete']='Elimina scenario';
$ec_lang['lpn_scenario_delete_confirm']='Eliminare lo scenario {name} e i {n} valori che appartengono solo ad esso? Il disegno stesso non viene modificato.';
$ec_lang['lpn_scenario_override']='Solo in questo scenario';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Selezionata significa che questo valore appartiene solo a questo scenario, anche quando è uguale al valore di Base. Deseleziona la casella per usare di nuovo il valore di Base.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Scenario base: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} è escluso dalla rete in {scenario}. Rimane comunque nel disegno e negli altri scenari.';
$ec_lang['lpn_scenario_push_btn']='Applica i valori di Base a tutti gli scenari';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Ogni scenario torna al valore di Base per le proprietà le cui etichette sono mostrate in questo momento. I valori che appartengono solo a quegli scenari vengono eliminati.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Far usare a tutti gli scenari i valori di Base per queste proprietà? I valori che appartengono solo a quegli scenari vengono eliminati. Puoi annullare questa azione.';
$ec_lang['lpn_scenario_push_scenarios']='Scenari coinvolti:';
$ec_lang['lpn_scenario_push_values']='Valori eliminati:';
$ec_lang['lpn_scenario_push_none']='Nessuno scenario ha un valore personalizzato per queste proprietà, quindi non cambierebbe nulla. Non viene eliminato nulla.';
$ec_lang['lpn_delete_drops_overrides']='Eliminare questo elemento butta via anche {n} valori che i tuoi scenari mantengono per esso. Continuare?';
$ec_lang['lpn_push_base_only']='Questa azione modifica il disegno stesso, quindi può essere eseguita solo in {base}. Passa a {base} e riprova.';
$ec_lang['lpn_field_active']='Parte di questa rete';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Deseleziona questa casella per lasciare l\'elemento nel disegno ma fuori dalla rete: viene disegnato in grigio e il risolutore lo ignora. In uno scenario è così che una tubazione proposta viene attivata e disattivata.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Esponente dell\'erogatore';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='L\'esponente nell\'equazione dell\'emettitore di EPANET per irrigatori e perdite: portata = coefficiente × pressione elevata a questo esponente. Cambia la risposta solo dove un nodo ha un emettitore, il che per ora significa una rete letta da un file EPANET.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Leggi il DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Legge la quota del DEM in questo nodo e la mostra qui sotto. Nulla nel campo Quota viene cambiato. La risoluzione orizzontale del DEM è di circa 30 m per la maggior parte della Terra, e migliore dove esistono dati più precisi.';
$ec_lang['lpn_elev_dem_use']='Usa il DEM';
$ec_lang['lpn_elev_dem_use_tip']='Inserisce la quota del DEM in questo nodo nel campo Quota qui sopra, sostituendo ciò che c\'era. Legge prima il DEM se non è ancora stato letto. Un solo Annulla la riporta indietro.';
$ec_lang['lpn_elev_dem_none']='Il DEM non ha una quota per questo nodo.';
$ec_lang['lpn_elev_dem_said']='Il DEM Mapbox indica {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Origine della quota';
$ec_lang['lpn_settings_elev_source_tip']='Da dove un nuovo nodo riceve la sua quota. Il livello del terreno viene letto dal DEM Mapbox, che è di circa 30 m nella maggior parte della Terra, e migliore dove esistono dati più precisi.';
$ec_lang['lpn_settings_elev_source_typed']='La quota digitata qui sopra';
$ec_lang['lpn_settings_elev_source_dem']='DEM Mapbox';
$ec_lang['lpn_settings_accuracy']='Precisione';
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
$ec_lang['lpn_settings_default_is']='Il valore predefinito è {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Quanto vicino deve arrivare il risolutore prima di fermarsi, misurato come la quantità di cui le portate stanno ancora cambiando da un tentativo al successivo. Un numero più piccolo è più preciso e richiede più tempo. Entrambi i risolutori leggono questo stesso campo, e ciascuno misura quel cambiamento rispetto a un totale diverso: il risolutore integrato rispetto alla somma delle richieste, EPANET rispetto alla somma delle portate nelle tubazioni. Lasciato vuoto, questa pagina usa una precisione più severa di quella predefinita di EPANET.';
$ec_lang['lpn_settings_specific_gravity']='Densità relativa';
$ec_lang['lpn_settings_specific_gravity_tip']='Il peso del fluido rispetto a quello dell\'acqua. Cambia le pressioni che un manometro leggerebbe, non le portate.';
$ec_lang['lpn_settings_viscosity']='Viscosità relativa';
$ec_lang['lpn_settings_viscosity_tip']='La viscosità del fluido rispetto a quella dell\'acqua a 20 gradi Celsius. Cambia la risposta solo con il metodo Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Tentativi massimi';
$ec_lang['lpn_settings_trials_tip']='Quanti tentativi sono consentiti prima che il risolutore rinunci su una rete che non converge.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Se non converge';
$ec_lang['lpn_settings_unbalanced_tip']='Che cosa fare con una rete che ha esaurito i suoi tentativi e ancora non è convergente. Consentire tentativi supplementari spesso porta alla convergenza. Fermarsi riporta l\'ultimo tentativo così com\'è, che non è una soluzione. Solo il risolutore EPANET legge questo campo. Il risolutore integrato si ferma sempre e segna la risposta come non convergente.';
$ec_lang['lpn_settings_unbalanced_continue']='Consenti tentativi supplementari';
$ec_lang['lpn_settings_unbalanced_stop']='Fermati e riporta l\'ultimo tentativo';
$ec_lang['lpn_settings_unbalanced_trials']='Tentativi supplementari prima di riportare';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Quanti ulteriori tentativi consentire dopo che il massimo qui sopra è stato esaurito, prima di riportare l\'ultimo tentativo. Solo il risolutore EPANET legge questo campo.';
$ec_lang['lpn_settings_head_error']='Limite dell\'errore di carico';
$ec_lang['lpn_settings_head_error_tip']='Un\'ulteriore verifica che il risolutore deve superare prima di fermarsi: il più grande errore di carico rimasto in una qualsiasi tubazione. Zero significa non applicare questa verifica. Solo il risolutore EPANET legge questo campo.';
$ec_lang['lpn_settings_flow_change']='Limite di variazione della portata';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Un\'ulteriore verifica che il risolutore deve superare prima di fermarsi: la massima variazione della portata di una qualsiasi tubazione da un tentativo al successivo. Zero significa non applicare questa verifica. Solo il risolutore EPANET legge questo campo.';
$ec_lang['lpn_settings_damp_limit']='Lo smorzamento inizia a';
$ec_lang['lpn_settings_damp_limit_tip']='La precisione alla quale il risolutore comincia a fare passi più piccoli, il che può aiutare una rete oscillante a convergere. Zero significa che il risolutore non smorza mai. Solo il risolutore EPANET legge questo campo.';
$ec_lang['lpn_settings_option_unset']='Non indicato';
$ec_lang['lpn_settings_demand_multiplier']='Moltiplicatore della richiesta';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Un unico fattore applicato in una volta a tutte le richieste della rete. Usalo per chiedere che cosa fa il sistema con un uso maggiore o minore di quello attuale. Non cambia i numeri che hai digitato. Uno scenario può avere il proprio, così che giorno medio, giorno massimo e ora di punta siano ciascuno un solo numero; lascialo vuoto in uno scenario per usare quello del progetto.';
$ec_lang['lpn_settings_engine_native']='Risolvi con il risolutore EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='Attiva questa opzione per usare il risolutore integrato dove possibile. Altrimenti viene sempre usato il risolutore EPANET dell\'agenzia statunitense EPA. Il risolutore integrato non viene usato per le simulazioni a periodo esteso né per PRV, PSV o FCV attive. La prima volta che viene usato il risolutore EPANET, vengono scaricati circa 650 KB, che restano poi conservati su questo dispositivo. Dove una tubazione ha una perdita concentrata (locale), i due risolutori differiscono nelle ultime cifre: EPANET arrotonda il valore che usa per la gravità, quindi le sue perdite concentrate risultano leggermente più basse rispetto alla forma esatta.';
$ec_lang['lpn_engine_loading']='Caricamento del risolutore EPANET…';
$ec_lang['lpn_engine_failed']='Impossibile caricare il risolutore EPANET. Viene mostrato il risolutore integrato.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Risolto con il risolutore EPANET, perché queste valvole si aprono e si chiudono da sole:';
$ec_lang['lpn_unit_unknown']='Questo disegno indica un\'unità che questa pagina non offre: {unit}. Tutto viene conservato e mostrato esattamente come è arrivato, e nulla è stato modificato. Non è possibile fornire risultati finché questa pagina non conosce quell\'unità, perché non c\'è modo di sapere quanto vale.';
$ec_lang['lpn_engine_manning_note']='Nota: con la scabrezza di Manning, EPANET arrotonda la costante nell\'equazione di Manning, quindi la perdita di carico risulta di circa lo 0,6% più bassa rispetto alla forma esatta.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='Il risolutore EPANET non ha accettato questa rete, quindi non l\'ha eseguita.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='Il risolutore EPANET ha detto: {message}';
$ec_lang['lpn_engine_refused_fallback']='I numeri sullo schermo provengono invece dal risolutore integrato.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='I numeri sullo schermo provengono invece dal risolutore integrato. Questo calcola un momento alla volta, quindi si tratta della rete solo a {time}, con ogni vasca ancora al suo livello iniziale.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Questi controlli nominano un elemento che non è più in questo progetto, quindi sono stati esclusi: {ids}';
$ec_lang['lpn_control_unreadable_note']='Non è stato possibile leggere questi controlli, quindi sono stati esclusi: {ids}';
$ec_lang['lpn_rule_dangling_note']='Queste regole fanno riferimento a un elemento non più presente in questo progetto, quindi sono state ignorate in questo calcolo: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Non è stato possibile leggere queste regole, quindi sono state ignorate in questo calcolo: {ids}';
$ec_lang['lpn_settings_text_size']='Dimensione del testo (pixel)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Dimensione dei simboli (pixel)';
$ec_lang['lpn_settings_link_width']='Spessore della linea delle tubazioni (pixel)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Frecce di direzione del flusso';
$ec_lang['lpn_settings_show_arrows_tip']='Disegna su ogni tubazione una freccia che mostra in che direzione scorre l\'acqua. Le frecce compaiono dopo un calcolo, e disattivarle lascia i risultati invariati. Questa impostazione è salvata con il progetto.';
$ec_lang['lpn_settings_align_labels']='Allinea le etichette delle tubazioni alle tubazioni';
$ec_lang['lpn_settings_readability_bias']='Gradi a sinistra della verticale prima che un\'etichetta venga capovolta';
$ec_lang['lpn_settings_readability_bias_tip']='Capovolge un\'etichetta per mantenerla dritta quando è inclinata più di questi gradi a sinistra della verticale.';
$ec_lang['lpn_settings_mask_labels']='Sfondo pieno dietro le etichette';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Aggancia le linee guida ad angoli fissi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='Quando trascini un\'etichetta lontano da ciò che nomina, la linea che la ricollega viene attratta verso l\'angolo fisso più vicino se trascini vicino a uno di essi. Continuando a trascinare l\'aggancio si stacca, quindi resta comunque disponibile qualsiasi angolo. Disattivato, il trascinamento è libero, com\'è sempre stato su questa pagina.';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Mostra le etichette quando lo zoom raggiunge questa larghezza di mappa o meno';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Le etichette vengono disegnate solo mentre la vista della mappa è larga così o meno. Lascia il riquadro vuoto per disegnarle a ogni zoom. Digita 0 per non disegnare mai un\'etichetta, a nessuno zoom.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Mostra sempre';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='Impedisci ai nodi di ingrandirsi oltre';
$ec_lang['lpn_settings_symbol_cap_mid']='volte la lunghezza della tubazione al';
$ec_lang['lpn_settings_symbol_cap_post']='percentile';
$ec_lang['lpn_settings_symbol_cap_tip']='Un nodo smette di crescere sul terreno una volta che il suo diametro sarebbe questo numero di volte la lunghezza della tubazione a questo percentile di tutte le lunghezze di tubazione nella rete. Oltre quel punto sulla mappa, nodi, tubazioni e altri simboli si rimpiccioliscono sullo schermo mentre riduci lo zoom, invece di crescere sul terreno. Serbatoi e vasche sono l\'eccezione e mantengono la loro dimensione sullo schermo a ogni zoom.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Opacità dei simboli (da 0 a 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Opacità dell\'immagine di sfondo (da 0 a 1)';
$ec_lang['lpn_settings_map_display']='Aspetto';
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
$ec_lang['lpn_settings_legend_position']='Posizione della legenda delle etichette';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Nessuna';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Disattivato';
$ec_lang['lpn_settings_legend_top_left']='In alto a sinistra';
$ec_lang['lpn_settings_legend_top_right']='In alto a destra';
$ec_lang['lpn_settings_legend_middle_left']='Al centro a sinistra';
$ec_lang['lpn_settings_legend_middle_right']='Al centro a destra';
$ec_lang['lpn_settings_legend_bottom_left']='In basso a sinistra';
$ec_lang['lpn_settings_legend_bottom_right']='In basso a destra';
$ec_lang['lpn_settings_color_node_field']='Colore dei nodi';
$ec_lang['lpn_settings_color_link_field']='Colore delle tubazioni';
$ec_lang['lpn_settings_color_ramp']='Schema di colori';
$ec_lang['lpn_settings_color_credits']='Crediti';
$ec_lang['lpn_color_ramp_epanet']='Da blu a rosso (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Da viola a giallo (più facile distinguere un colore dall\'altro)';
$ec_lang['lpn_color_ramp_gray']='Da grigio chiaro a grigio scuro';
$ec_lang['lpn_settings_color_reverse']='Inverti l\'ordine dei colori';
$ec_lang['lpn_color_none']='Nessun colore';
$ec_lang['lpn_settings_color_key_position']='Posizione della legenda dei colori';
$ec_lang['lpn_settings_color_breaks']='Limiti delle fasce di colore';
$ec_lang['lpn_settings_color_equal_intervals']='Intervalli uguali';
$ec_lang['lpn_settings_color_equal_counts']='Conteggi uguali';
$ec_lang['lpn_settings_color_no_values']='Non ci sono ancora valori da cui partire. Risolvi prima la rete.';
$ec_lang['lpn_confirm_restore_defaults']='Ripristinare tutte le impostazioni (prefissi degli ID, valori iniziali, impostazioni del risolutore, aspetto della mappa, posizione della legenda ed etichette visibili) ai valori originali? La tua rete non viene modificata. Le impostazioni appartengono al progetto aperto, quindi gli altri progetti conservano le proprie.';
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
$ec_lang['lpn_settings_wipe_btn']='Ricomincia da zero';
$ec_lang['lpn_confirm_wipe']='Vuoi ripartire da zero ed eliminare TUTTO ciò che è salvato per questa pagina: ogni progetto, ogni immagine di sfondo, tutte le impostazioni e le tue scelte di unità di misura? La pagina si ricarica esattamente come la vedrebbe un visitatore del tutto nuovo. Questa azione non può essere annullata.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Copia questo link:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Tempo';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Durata totale della simulazione';
$ec_lang['lpn_time_hyd_step']='Passo temporale idraulico';
$ec_lang['lpn_time_pattern_step']='Passo temporale del modello';
$ec_lang['lpn_time_pattern_start']='Ora di inizio del modello';
$ec_lang['lpn_time_report_step']='Passo temporale dei risultati';
$ec_lang['lpn_time_report_start']='Ora di inizio dei risultati';
$ec_lang['lpn_time_clock_start']='Orario di inizio';
$ec_lang['lpn_time_clock_day']='Giorno {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Scrivi un orario come ore e minuti, ad esempio 2:30. Un numero semplice indica le ore, quindi 8 significa otto ore. Mezz\'ora è 0:30.';
$ec_lang['lpn_time_running']='Calcolo del periodo esteso nel tempo in corso con il risolutore EPANET.';
$ec_lang['lpn_time_no_engine']='Il risolutore integrato calcola un solo istante alla volta, quindi questa è la rete solo a {time}: ogni modello temporale viene letto in quell\'istante, e ogni vasca resta comunque al proprio livello iniziale invece di riempirsi e svuotarsi. Connettiti a internet una volta per scaricare il risolutore EPANET, che calcola un periodo esteso nel tempo.';
$ec_lang['lpn_time_slider']='Tempo trascorso della simulazione';
$ec_lang['lpn_time_no_period']='Questo progetto non ha impostato un calcolo esteso nel tempo, quindi c\'è un solo istante da mostrare. Imposta una Durata totale del calcolo in Impostazioni, Calcolo, Tempo per eseguire un calcolo esteso nel tempo.';
$ec_lang['lpn_time_first']='Vai all\'inizio';
$ec_lang['lpn_time_prev']='Passo indietro';
$ec_lang['lpn_time_play']='Riproduci';
$ec_lang['lpn_time_play_tip']='Avvia animazione';
$ec_lang['lpn_time_pause_tip']='Metti in pausa animazione';
$ec_lang['lpn_time_pause']='Pausa';
$ec_lang['lpn_time_next']='Passo avanti';
$ec_lang['lpn_time_last']='Vai alla fine';
$ec_lang['lpn_time_tank']='Vasca';
$ec_lang['lpn_time_level']='Livello dell\'acqua';
$ec_lang['lpn_time_run']='Calcola';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Calcola questa rete a ogni passo temporale idraulico.';
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
$ec_lang['lpn_time_run_done']='Il calcolo è terminato. Orari di riferimento: {frames}. Tempo impiegato: {secs} s.';
$ec_lang['lpn_time_runbox_hide']='Non mostrare più questo riquadro';
$ec_lang['lpn_settings_runbox']='Mostra il riquadro di avanzamento dell\'esecuzione';
$ec_lang['lpn_settings_runbox_tip']='Un riquadro che riporta a che punto è arrivata un\'esecuzione e cosa ha trovato. Se disattivato, un\'esecuzione conclusa mostra la stessa informazione nella riga di stato per alcuni secondi. Questa è un\'impostazione per questo browser, non per il progetto.';
$ec_lang['lpn_time_run_failed']='Il calcolo non è terminato, quindi non ci sono risultati per gli orari successivi.';
$ec_lang['lpn_time_run_report']='Rapporto di calcolo EPANET';
$ec_lang['lpn_time_run_report_copy']='Copia';
$ec_lang['lpn_time_run_report_copied']='Copiato';
$ec_lang['lpn_time_run_report_tip']='Ciò che il risolutore EPANET stesso ha stampato sull\'ultimo calcolo: se è convergente, e ciò su cui ha avvisato. È il testo del risolutore stesso, non il nostro.';

$ec_lang['lpn_time_speed']='Velocità';
$ec_lang['lpn_time_speed_tip']='Velocità di riproduzione';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_menu_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Cerca nelle impostazioni';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Digita una parola o più parole per vedere le impostazioni che le menzionano tutte.';
$ec_lang['lpn_settings_no_match']='Nessuna impostazione menziona quella parola.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Larghezza dell\'elenco della sezione Impostazioni';
$ec_lang['lpn_rpane_empty']='Non c\'è ancora nulla ancorato qui. Tutto ciò che appartiene all\'intero progetto si trova in Impostazioni.';
$ec_lang['lpn_time_settings_open']='Impostazioni del tempo';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Visualizzazione';
$ec_lang['lpn_settings_sec_map']='Mappa e pagina';
$ec_lang['lpn_settings_sec_assets']='Elementi';
$ec_lang['lpn_settings_sec_calculation']='Calcolo';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Cliente';
$ec_lang['lpn_labels_customer_note']='Un\'etichetta cliente mostra i valori selezionati qui. Viene disegnata alla stessa dimensione di testo di ogni altra etichetta sulla mappa.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Le etichette cliente vengono disegnate solo mentre la vista della mappa è larga così o meno. Lascia il riquadro vuoto per disegnarle a ogni zoom. Digita 0 per non disegnare mai un\'etichetta cliente, a nessuno zoom. Non ha effetto se è maggiore dell\'impostazione simile per tutte le etichette.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Usa la vista attuale';
$ec_lang['lpn_settings_page']='Pagina';
$ec_lang['lpn_settings_page_note']='Salvato in questo calcolatore, non nel progetto.';
$ec_lang['lpn_settings_hydraulics']='Idraulica';
$ec_lang['lpn_settings_quality']='Qualità dell\'acqua';
$ec_lang['lpn_settings_quality_track']='Parametro di qualità';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Scegli che cosa deve seguire il calcolo lungo le tubazioni: da quanto tempo l\'acqua è nel sistema, da dove proviene, oppure una sostanza chimica che reagisce mentre viaggia. Solo la sostanza chimica richiede coefficienti.';
$ec_lang['lpn_settings_quality_source']='Nodo di traccia';
$ec_lang['lpn_settings_quality_source_tip']='Il nodo la cui acqua viene tracciata. Ogni altro nodo mostra quindi la quota della sua acqua che proviene da quel nodo.';
$ec_lang['lpn_quality_none']='Nessuna';
$ec_lang['lpn_quality_age']='Età dell\'acqua';
$ec_lang['lpn_quality_trace']='Traccia sorgente';
$ec_lang['lpn_quality_chemical']='Una sostanza chimica che reagisce';
$ec_lang['lpn_quality_needs_run']='La qualità dell\'acqua viene seguita lungo le tubazioni via via che l\'acqua viaggia, quindi richiede un calcolo esteso nel tempo: il motore EPANET e una durata totale del calcolo. Imposta una Durata totale del calcolo in Tempo, poi premi il pulsante Calcola.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Sostanza chimica e unità';
$ec_lang['lpn_quality_chemical_name_tip']='La sostanza chimica che stai monitorando, per esempio Cloro. Lascia vuoto per l\'etichetta predefinita di EPANET, Chemical. Viene mostrata nei tuoi report, ma non è usata nei calcoli.';
$ec_lang['lpn_quality_mass_units']='Unità di massa';
$ec_lang['lpn_quality_mass_units_tip']='La metà unità della voce di qualità, le due scelte proprie di EPANET.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Tolleranza di qualità';
$ec_lang['lpn_quality_tolerance_tip']='Di quanto possono differire in concentrazione due parcelle d\'acqua adiacenti prima che EPANET le tratti come una sola. Vuoto usa il valore predefinito di EPANET, 0,01.';
$ec_lang['lpn_quality_diffusivity']='Diffusività relativa';
$ec_lang['lpn_quality_diffusivity_tip']='Con quanta facilità la sostanza chimica si diffonde nell\'acqua, rispetto al cloro. Vuoto usa il valore predefinito di EPANET, 1,0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Concentrazione di {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Concentrazione media di {chemical}';
$ec_lang['lpn_quality_initial']='Qualità iniziale';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Quanta sostanza chimica contiene questo nodo quando il calcolo inizia. Un serbatoio mantiene il proprio valore per tutto il calcolo, che è come si indica di solito il residuo in uscita da un impianto di trattamento. Lascialo vuoto e il nodo parte senza alcuna sostanza chimica.';
$ec_lang['lpn_result_concentration']='Concentrazione';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Quanta sostanza chimica resta in questo punto dopo aver viaggiato e reagito. Le unità sono quelle indicate accanto alla sostanza chimica in Impostazioni, Qualità dell\'acqua.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Tipo di sorgente';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Che tipo di dose questo nodo applica all\'acqua che vi passa. Concentrazione tratta l\'acqua che entra nella rete qui come se arrivasse al valore Qualità della sorgente. Sorgente di massa aggiunge una massa di sostanza chimica ogni minuto, qualunque sia la portata. Sorgente a punto fisso porta la concentrazione in uscita da questo nodo al valore Qualità della sorgente e non oltre. Sorgente proporzionale alla portata aggiunge il valore Qualità della sorgente a qualunque cosa sia già presente nell\'acqua.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Nessuno';
$ec_lang['lpn_source_type_concen']='Concentrazione';
$ec_lang['lpn_source_type_mass']='Sorgente di massa';
$ec_lang['lpn_source_type_setpoint']='Sorgente a punto fisso';
$ec_lang['lpn_source_type_flowpaced']='Sorgente proporzionale alla portata';
$ec_lang['lpn_source_quality']='Qualità della sorgente';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Quanto è forte la dose. Per ogni tipo tranne la sorgente di massa questa è una concentrazione, nelle unità indicate accanto alla sostanza chimica in Impostazioni, Qualità dell\'acqua; per una sorgente di massa è una massa di sostanza chimica al minuto. Lascialo vuoto e qui non viene aggiunto nulla, il che non è lo stesso di uno zero: uno zero è una dose che sta funzionando e non aggiunge nulla.';
$ec_lang['lpn_source_pattern']='Modello della sorgente';
$ec_lang['lpn_source_pattern_tip']='Un modello temporale che scala la dose nel corso del calcolo, per una sorgente che non è costante. Nessun modello significa che la dose è la stessa a ogni istante.';
$ec_lang['lpn_mixing_model']='Modello di miscelazione';
$ec_lang['lpn_mixing_model_tip']='Come si mescola l\'acqua già presente in questa vasca con quella in arrivo. La miscelazione completa agita l\'intera vasca in una volta. La miscelazione a due scomparti riempie prima una zona di ingresso e passa il resto avanti. Il flusso a pistone FIFO sposta l\'acqua nell\'ordine in cui è arrivata. Il flusso a pistone LIFO la accumula, quindi l\'ultima acqua entrata è la prima a uscire. La scelta cambia l\'età dell\'acqua e il residuo, e non cambia alcuna pressione o portata.';
$ec_lang['lpn_mixing_mixed']='Miscelazione completa';
$ec_lang['lpn_mixing_2comp']='Miscelazione a due scomparti';
$ec_lang['lpn_mixing_fifo']='Flusso a pistone FIFO';
$ec_lang['lpn_mixing_lifo']='Flusso a pistone LIFO';
$ec_lang['lpn_mixing_fraction']='Frazione di miscelazione';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='La quota del volume della vasca occupata dalla zona di ingresso, tra 0 e 1. Solo la miscelazione a due scomparti la usa. Lasciala vuota e l\'intera vasca è la zona di ingresso, che è ciò che EPANET presume.';
$ec_lang['lpn_reaction_bulk']='Coefficiente di reazione nella massa';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Reazione nel corpo dell\'acqua, usata per ogni tubazione che non ne porta uno proprio. Un numero negativo fa decadere la sostanza chimica e uno positivo la fa aumentare. La reazione è del primo ordine a meno che un file EPANET importato non indichi un altro ordine, quindi il coefficiente è una velocità in 1/giorno. Una casella vuota significa nessuna reazione nella massa.';
$ec_lang['lpn_reaction_wall']='Coefficiente di reazione alla parete';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Reazione alla parete della tubazione, usata per ogni tubazione che non ne porta uno proprio. Un numero negativo fa decadere la sostanza chimica. La reazione è del primo ordine a meno che un file EPANET importato non indichi un altro ordine, quindi il coefficiente è una lunghezza al giorno, scritta nell\'unità di lunghezza del progetto. Una casella vuota significa nessuna reazione alla parete.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Questa tubazione da sola. Lasciala vuota e la tubazione usa il coefficiente impostato per l\'intera rete in Impostazioni, Qualità dell\'acqua.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Coefficiente di reazione';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Reazione nell\'acqua contenuta in questa vasca, come velocità in 1/giorno. Un numero negativo fa decadere la sostanza chimica e uno positivo la fa aumentare. L\'acqua sosta in una vasca molto più a lungo di quanto sosti in qualunque tubazione, quindi è spesso qui che si perde un residuo. Lasciala vuota e la vasca usa il coefficiente di reazione nella massa impostato per l\'intera rete in Impostazioni, Qualità dell\'acqua.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Reazione nella massa';
$ec_lang['lpn_reaction_wall_short']='Reazione alla parete';
$ec_lang['lpn_reaction_tank_short']='Reazione';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/giorno';
$ec_lang['lpn_reaction_day']='giorno';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Ordine di reazione nella massa';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='L\'esponente a cui è elevata la concentrazione per la reazione nella massa dell\'acqua. È ammesso qualsiasi numero reale. 1 è il valore predefinito ed è usato per la maggior parte dei modelli di decadimento del cloro. 0 rende la velocità indipendente dalla quantità di sostanza chimica presente.';
$ec_lang['lpn_reaction_order_tank']='Ordine di reazione nel serbatoio';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='L\'esponente a cui è elevata la concentrazione per la reazione nell\'acqua contenuta in un serbatoio, separato dall\'ordine di reazione nella massa in modo che un serbatoio possa reagire con un ordine diverso da quello delle tubazioni. È ammesso qualsiasi numero reale, e 1 è il valore predefinito. EPANET lo indica come ORDER TANK in un file e non offre alcuna casella per esso nella propria interfaccia.';
$ec_lang['lpn_reaction_order_wall']='Ordine di reazione alla parete';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 significa che la reazione alla parete avviene secondo il coefficiente o i coefficienti indicati. 0 significa che non avviene. È un interruttore acceso/spento. Il valore predefinito è 1.';
$ec_lang['lpn_reaction_order_unstated']='Non indicato';
$ec_lang['lpn_reaction_order_zero']='0, ordine zero';
$ec_lang['lpn_reaction_order_first']='1, primo ordine';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Potenziale limitante';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Una concentrazione verso cui tende la sostanza chimica invece di decadere fino ad annullarsi o crescere senza fine. La reazione rallenta man mano che l\'acqua si avvicina a questo valore e si ferma lì. Usa unità coerenti. Nessun limite se lasciato vuoto.';
$ec_lang['lpn_reaction_rough_corr']='Correlazione con la scabrezza';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Correla la reazione alla parete alla scabrezza di ciascuna tubazione, in modo che una tubazione più scabra reagisca più rapidamente. Quando è attivata, un coefficiente di parete viene calcolato per ogni tubazione a partire dalla scabrezza di quella tubazione, e il coefficiente di parete unico sopra non viene più usato. Non usata se lasciata vuota.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Questa pagina non offre un coefficiente di reazione proprio. Non esiste una prova standard per ricavarne uno, e i valori pubblicati sul campo per lo stesso tipo di acqua differiscono di un fattore dieci, quindi un numero fornito qui verrebbe letto come una raccomandazione. Inserisci un valore che hai misurato o uno che puoi citare, oppure lascia le caselle vuote per una sostanza chimica che non reagisce.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Energia';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Rapporti';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='Le risposte finite che questa pagina produce una volta calcolata una rete: quanto costano le pompe, come si confrontano gli scenari, e ciò che il risolutore EPANET stesso ha stampato.';
$ec_lang['lpn_reports_epanet']='Calcolo EPANET';
$ec_lang['lpn_energy_title']='Rapporto sull\'energia delle pompe';
$ec_lang['lpn_energy_menu']='Energia delle pompe';
$ec_lang['lpn_energy_menu_tip']='Quale quota del calcolo ogni pompa è rimasta accesa, quale potenza ha assorbito e quanto è costata nell\'ultimo periodo esteso nel tempo.';
$ec_lang['lpn_energy_efficiency']='Efficienza della pompa (percento)';
$ec_lang['lpn_energy_efficiency_tip']='L\'efficienza dalla rete elettrica all\'acqua usata per ogni pompa che non porta una propria curva di efficienza. EPANET usa il 75 percento quando nulla è indicato.';
$ec_lang['lpn_energy_price']='Prezzo dell\'energia';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Quanto costa un chilowattora. Si applica a ogni pompa che non porta un proprio prezzo. Lascialo vuoto e ogni costo nel rapporto è zero.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Quanto costa un chilowattora a questa pompa. Lascialo vuoto e la pompa paga il prezzo impostato per l\'intera rete in Impostazioni, Energia.';
$ec_lang['lpn_energy_price_pattern']='Modello di prezzo';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Un modello che moltiplica il prezzo a ogni passo del modello, che è come si indica una tariffa fuori picco. Lascialo vuoto per un prezzo costante per tutto il calcolo.';
$ec_lang['lpn_energy_demand_charge']='Costo di picco della domanda';
$ec_lang['lpn_energy_demand_charge_tip']='Quanto addebita l\'ente gestore per kW per il picco di carico richiesto dalle pompe nel sistema.';
$ec_lang['lpn_energy_currency']='Valuta';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Ciò che scrivi qui viene stampato accanto a ogni importo. È un\'etichetta. I prezzi e i costi non vengono mai convertiti, quindi scrivi i prezzi nella valuta che hai indicato qui.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Questa pagina non offre un prezzo proprio. Quanto costa l\'energia dipende dall\'ente gestore, dal paese, dall\'ora e dall\'anno, quindi un numero fornito qui verrebbe letto come una raccomandazione. Inserisci il prezzo della tua tariffa.';
$ec_lang['lpn_energy_needs_run']='L\'energia delle pompe è potenza integrata nel tempo, quindi richiede un calcolo esteso nel tempo: il motore EPANET e una durata totale del calcolo. Imposta una Durata totale del calcolo in Impostazioni, Calcolo, Tempo, premi il pulsante Calcola, poi apri Acqua, Rapporti, Energia delle pompe.';
$ec_lang['lpn_energy_no_pumps']='Questa rete non ha pompe, quindi non c\'è nulla che assorba potenza.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Confronto tra scenari';
$ec_lang['lpn_scncmp_menu_tip']='Calcola ogni scenario di questo progetto e leggili affiancati: la pressione più bassa e la velocità più alta di ciascuno.';
$ec_lang['lpn_scncmp_running']='Calcolo di ogni scenario in corso…';
$ec_lang['lpn_scncmp_empty']='Non è stato ancora disegnato nulla, quindi non c\'è nulla da calcolare.';
$ec_lang['lpn_scncmp_col_minpressure']='Pressione più bassa';
$ec_lang['lpn_scncmp_col_maxvelocity']='Velocità più alta';
$ec_lang['lpn_scncmp_at']='{value} a {id}';
$ec_lang['lpn_scncmp_current']='(attualmente aperto)';
$ec_lang['lpn_scncmp_note']='Ogni scenario viene calcolato da una copia del disegno. Nulla qui cambia il progetto, e lo scenario in cui stai lavorando resta come era.';
$ec_lang['lpn_energy_over']='Per un periodo esteso nel tempo di {time}';
$ec_lang['lpn_energy_col_pump']='Pompa';
$ec_lang['lpn_energy_col_running']='% del calcolo';
$ec_lang['lpn_energy_col_effic']='Rend.';
$ec_lang['lpn_energy_col_avg_kw']='kW medi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='La potenza media usata quando questa pompa era in funzione. Non è mediata sui periodi di inattività, quindi una pompa rimasta ferma per gran parte del periodo esteso nel tempo indica comunque la potenza che ha usato mentre funzionava.';
$ec_lang['lpn_energy_col_peak_kw']='kW di picco';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Costo';
$ec_lang['lpn_energy_total_kwh']='Energia usata';
$ec_lang['lpn_energy_total_energy_cost']='Costo dell\'energia';
$ec_lang['lpn_energy_peak_kw']='Utilizzo di potenza di picco';
$ec_lang['lpn_energy_total_demand_charge']='Costo del picco della domanda';
$ec_lang['lpn_energy_total_cost']='Costo totale';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Stato';
$ec_lang['lpn_reports_status_tip']='Che cosa è cambiato durante l\'ultimo calcolo esteso nel tempo, in ordine temporale: pompe e valvole che si aprono o si chiudono, vasche che si riempiono, si svuotano, arrivano a piena o restano a secco, e passi che non sono convergiti completamente.';
$ec_lang['lpn_status_title']='Rapporto di stato';
$ec_lang['lpn_status_needs_run']='Il rapporto di stato elenca ciò che è cambiato durante un calcolo esteso nel tempo. Imposta una Durata totale del calcolo in Impostazioni, Calcolo, Tempo, premi il pulsante Calcola, poi apri Acqua, Rapporti, Rapporto di stato.';
$ec_lang['lpn_status_empty']='Nulla ha cambiato stato durante questo calcolo.';
$ec_lang['lpn_status_col_time']='Tempo';
$ec_lang['lpn_status_col_event']='Evento';
$ec_lang['lpn_status_opened']='{type} {id} aperta';
$ec_lang['lpn_status_closed']='{type} {id} chiusa';
$ec_lang['lpn_status_filling']='{type} {id} si sta riempiendo';
$ec_lang['lpn_status_emptying']='{type} {id} si sta svuotando';
$ec_lang['lpn_status_full']='{type} {id} è piena';
$ec_lang['lpn_status_dry']='{type} {id} è vuota';
$ec_lang['lpn_status_no_converge']='La soluzione idraulica a questo passo non è convergita completamente; i numeri mostrati sono la sua ultima iterazione.';
$ec_lang['lpn_status_note']='Letto dallo stesso calcolo esteso nel tempo del riquadro Tabelle e del Rapporto completo. Viene elencato solo un cambiamento, non ogni passo.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Completo';
$ec_lang['lpn_reports_full_tip']='Ogni nodo e ogni collegamento a ogni passo temporale di reporting dell\'ultimo calcolo, come un\'unica tabella che puoi scaricare o stampare.';
$ec_lang['lpn_full_title']='Rapporto completo';
$ec_lang['lpn_full_needs_run']='Il rapporto completo elenca ogni nodo e ogni collegamento a ogni passo temporale di reporting. Premi Calcola, poi apri Acqua, Rapporti, Rapporto completo.';
$ec_lang['lpn_full_note']='Una riga per nodo o collegamento per ogni passo temporale di reporting, nelle unità mostrate nel riquadro Tabelle. Una cella vuota è una colonna che quella grandezza non ha. Il download o la stampa comprende ogni passo temporale; la tabella qui sotto ne mostra uno alla volta.';
$ec_lang['lpn_full_step_label']='Passo temporale';
$ec_lang['lpn_full_download_csv']='Scarica CSV';
$ec_lang['lpn_full_print']='Stampa rapporto';
$ec_lang['lpn_full_col_time']='Tempo';
$ec_lang['lpn_full_col_type']='Tipo';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} righe.';
$ec_lang['lpn_energy_no_price']='Non è indicato alcun prezzo dell\'energia, quindi ogni costo qui è zero. Impostane uno in Impostazioni, Energia.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Questa rete indica un prezzo di zero, quindi ogni costo qui è zero. Cambialo in Impostazioni, Energia.';
$ec_lang['lpn_energy_curve_note']='Queste pompe fanno riferimento a una curva di efficienza senza punti: {ids}. Hanno funzionato all\'efficienza impostata per l\'intera rete.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_rank']='Posizione';
$ec_lang['lpn_labels_col_drop']='Scarto';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Nodo e collegamento';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Intervallo uguale';
$ec_lang['lpn_color_mode_quantile']='Quantile (conteggio uguale)';
$ec_lang['lpn_color_mode_jenks']='Interruzioni naturali (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Deviazione standard';
$ec_lang['lpn_color_mode_pretty']='Arrotondato';
$ec_lang['lpn_color_mode_log']='Logaritmico';
$ec_lang['lpn_color_mode_pressure']='Pressione';
$ec_lang['lpn_color_mode_manual']='Manuale';

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
$ec_lang['lpn_library_menu']='Librerie';
$ec_lang['lpn_library_menu_tip']='Gestisci i modelli di richiesta, le curve delle pompe e le regole di controllo di questo progetto.';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Modelli';
$ec_lang['lpn_library_patterns_tip']='Un modello è un elenco di moltiplicatori che si ripete. Ognuno vale per un passo temporale del modello, quindi 24 numeri con un passo di un\'ora formano una giornata che si ripete. Una richiesta di 10 con un moltiplicatore di 1,5 è 15 in quel momento.';
$ec_lang['lpn_library_curves']='Curve';
$ec_lang['lpn_library_curves_tip']='Una curva è un elenco di punti che indica come si comporta qualcosa: quanto carico aggiunge una pompa a ogni portata, quanto è efficiente a quella portata, oppure quanto carico perde una valvola a ogni portata.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Le curve sono associate a pompe e valvole. Per una curva del carico della pompa il calcolo usa una curva interpolata sui punti come mostrato; per ogni altro tipo collega i punti con segmenti diritti come mostrato.';
$ec_lang['lpn_library_curve_add']='Aggiungi una curva';
$ec_lang['lpn_library_curve_type_tip']='Che cosa descrive questa curva';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Tipo di curva';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Equazione';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='La curva interpolata sui punti, e la linea disegnata nel grafico sottostante. Viene ricalcolata dai punti ogni volta che è mostrata e non viene mai memorizzata, e i suoi numeri sono nelle unità che mostra la tabella qui sopra. Il risolutore integrato calcola con questa equazione; il motore EPANET legge i punti stessi.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Seleziona una o due colonne in un foglio di calcolo, copiale, e incollale nella prima cella dove le vuoi far arrivare. Le righe vengono aggiunte man mano che servono. Puoi anche incollare righe copiate direttamente da un file EPANET, incluso il nome della curva.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Descrizione';
$ec_lang['lpn_library_curve_note_tip']='Che cos\'è questa curva, con le tue parole. Viene scritta sopra la curva in un file EPANET e letta di nuovo da lì.';
$ec_lang['lpn_library_curve_remove_point']='Rimuovi questo punto';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Copia i punti';
$ec_lang['lpn_library_curve_copy_tip']='Copia ogni punto come due colonne, pronte da incollare in un foglio di calcolo.';
$ec_lang['lpn_library_curve_copy_manual']='Copia questi punti';
$ec_lang['lpn_library_curve_used_by']='Elementi che usano questa curva';
$ec_lang['lpn_library_curve_unused']='Nessun elemento usa questa curva.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Questa curva è usata da {count} elementi: {ids}. Fai puntare prima quegli elementi a un\'altra curva, poi elimina questa.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Tipi di tubazione';
$ec_lang['lpn_library_pipetypes_tip']='Un tipo di tubazione è una definizione a cui più tubazioni possono fare riferimento per il proprio diametro, la scabrezza e i coefficienti di reazione. Modificare la definizione modifica ogni tubazione che la usa.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Ogni progetto ha la propria libreria di tipi di tubazione. Puoi lasciare vuote le proprietà nella definizione di un tipo di tubazione. Per esempio, un tipo di tubazione che indica una scabrezza e nessun diametro va bene. I tipi di tubazione si collegano alle tubazioni nel loro editor delle proprietà. Modificare qui una definizione cambia ogni tubazione che vi fa riferimento.';
$ec_lang['lpn_library_pipetype_add']='Aggiungi un tipo di tubazione';
$ec_lang['lpn_library_pipetype_blank_tip']='Le proprietà lasciate vuote nella definizione di un tipo di tubazione restano da inserire singolarmente per ogni tubazione.';
$ec_lang['lpn_library_pipetype_used_by']='Tubazioni che usano questo tipo';
$ec_lang['lpn_library_pipetype_unused']='Nessuna tubazione usa questo tipo di tubazione.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Questo tipo di tubazione è usato da {count} tubazioni: {ids}. Scollegale da esso prima di eliminarlo.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Tipo di tubazione';
$ec_lang['lpn_field_pipetype_tip']='Il tipo di tubazione nella libreria del progetto che questa tubazione usa. Le proprietà incluse nel tipo di tubazione non sono modificabili qui. Scollega il tipo di tubazione per abilitarne qui la modifica.';
$ec_lang['lpn_pipetype_none']='Nessun tipo di tubazione selezionato';
$ec_lang['lpn_pipetype_detach']='Scollega dal tipo di tubazione';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Copia nella tubazione stessa i valori che questa tubazione legge dal proprio tipo e smette di usare il tipo. I valori della tubazione non cambiano ora, e da questo momento puoi modificarli qui.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Raccordi';
$ec_lang['lpn_library_fittings_tip']='Un elenco di raccordi è un insieme di raccordi e delle loro quantità a cui più tubazioni possono fare riferimento. Si somma in un unico coefficiente di perdita minore (localizzata).';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Ogni progetto ha la propria libreria di raccordi. Un elenco di raccordi contiene raccordi con una quantità per ciascuno, e si somma in un unico coefficiente di perdita minore (localizzata). Sia le tubazioni sia i tipi di tubazione possono fare riferimento a un elenco.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='I raccordi offerti qui sono i tredici della Tabella 3.3 del manuale utente di EPANET 2.2. Sceglierne uno copia il suo coefficiente nella riga, dove puoi modificarlo. Un coefficiente dipende dalla dimensione e dalla marca del raccordo, quindi considera la tabella un punto di partenza e non una risposta.';
$ec_lang['lpn_library_fittings_add']='Aggiungi un elenco di raccordi';
$ec_lang['lpn_library_fittings_used_by']='Tubazioni che usano questo elenco di raccordi';
$ec_lang['lpn_library_fittings_unused']='Nessuna tubazione usa questo elenco di raccordi.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Questo elenco di raccordi è usato da {count} tubazioni: {ids}. Scollegalo da esse prima di eliminarlo.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Importa librerie…';
$ec_lang['lpn_library_import_tip']='Scegli un altro file di progetto e copia intere librerie da esso in questo progetto. Tutto ciò il cui nome è già usato qui viene saltato ed elencato, così nulla di ciò che hai già viene modificato.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Scegli che cosa copiare da {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Ogni libreria che selezioni viene copiata per intero. Elimina in seguito ciò che non vuoi, allo stesso modo in cui elimini qualsiasi altra voce.';
$ec_lang['lpn_library_import_go']='Importa';
$ec_lang['lpn_library_import_no_libraries']='Quel file di progetto non ha librerie da copiare.';
$ec_lang['lpn_library_import_heading']='Importato da {file}';
$ec_lang['lpn_library_import_added']='Copiati: {names}';
$ec_lang['lpn_library_import_conflict']='Saltati, perché questo progetto ne ha già uno con lo stesso nome: {names}. Qui non è cambiato nulla. Rinominane uno dei due e importa di nuovo se vuoi entrambi.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Quel file di progetto non ne ha nessuno di questi da copiare.';
$ec_lang['lpn_library_import_curve_shape']='Queste curve sono arrivate esattamente come le ha scritte il file, e un calcolo non può usarne una finché la sua prima colonna non cresce da ogni punto al successivo: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Questi tipi di tubazione fanno riferimento a un elenco di raccordi che questo progetto non ha: {names}. Importa la libreria dei raccordi dallo stesso file e lo troveranno.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Attenzione: le unità non corrispondono. Verrà importato così com\'è. Non consigliato.';
$ec_lang['lpn_library_import_units_line']='{name}: questo progetto mostra {mine}, il file mostra {theirs}.';
$ec_lang['lpn_fitting_qty']='Quantità';
$ec_lang['lpn_fitting_name']='Raccordo';
$ec_lang['lpn_fitting_k']='Coefficiente';
$ec_lang['lpn_fitting_add']='Aggiungi un raccordo';
$ec_lang['lpn_fitting_remove']='Rimuovi';
$ec_lang['lpn_fitting_total']='Coefficiente totale di perdita minore (localizzata), k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Elenco di raccordi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Un elenco di raccordi dalla libreria del progetto. Le sue quantità e i suoi coefficienti si sommano nel coefficiente di perdita minore di questa tubazione, e la casella del coefficiente diventa quindi di sola lettura. Lascia questo campo non selezionato per digitare tu stesso il coefficiente.';
$ec_lang['lpn_fittings_none']='Nessun elenco di raccordi selezionato';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Valvola a globo, completamente aperta';
$ec_lang['lpn_fitting_angle']='Valvola ad angolo, completamente aperta';
$ec_lang['lpn_fitting_swingcheck']='Valvola di ritegno a battente, completamente aperta';
$ec_lang['lpn_fitting_gate']='Valvola a saracinesca, completamente aperta';
$ec_lang['lpn_fitting_elbow_short']='Gomito a raggio corto';
$ec_lang['lpn_fitting_elbow_medium']='Gomito a raggio medio';
$ec_lang['lpn_fitting_elbow_long']='Gomito a raggio lungo';
$ec_lang['lpn_fitting_elbow_45']='Gomito a 45 gradi';
$ec_lang['lpn_fitting_return_bend']='Curva di ritorno chiusa';
$ec_lang['lpn_fitting_tee_run']='Raccordo a T standard, flusso in linea';
$ec_lang['lpn_fitting_tee_branch']='Raccordo a T standard, flusso in derivazione';
$ec_lang['lpn_fitting_entrance']='Imbocco a spigolo vivo';
$ec_lang['lpn_fitting_exit']='Uscita';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Altro raccordo';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='{file} salvato';
$ec_lang['lpn_inp_export_flat_lead']='Il file EPANET esportato è numericamente equivalente a questo progetto. Ma non ha spazio per le seguenti cose:';
$ec_lang['lpn_inp_export_flat_types']='{n} tubazioni qui fanno riferimento a {t} tipi di tubazione. Nel file ciascuna di quelle tubazioni porta la propria copia dei numeri, quindi le risposte sono le stesse. Ciò che il file non può contenere è il tipo di tubazione in sé, quindi modificare una definizione e vedere ogni tubazione seguirla è qualcosa che solo il tuo file di progetto registra.';
$ec_lang['lpn_inp_export_flat_coords']='Un file EPANET conserva una sola posizione per ogni nodo. Questo scenario ne colloca {n} altrove, e quelle sono le posizioni nel file. Ogni altro scenario conserva le proprie posizioni solo nel tuo file di progetto.';
$ec_lang['lpn_inp_export_flat_fittings']='Un file EPANET non può contenere l\'elenco di gomiti, valvole e raccordi a T del tuo file di progetto. Il coefficiente di perdita minore di {n} tubazioni qui è ottenuto sommando un elenco di raccordi. Il totale entra nel file esattamente com\'è, quindi nulla cambia nelle risposte.';
$ec_lang['lpn_library_controls']='Controlli';
$ec_lang['lpn_library_controls_tip']='Un controllo è una frase che apre o chiude un collegamento, oppure gli assegna un\'impostazione, quando un livello dell\'acqua, una pressione o un orario lo indicano.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Aggiungi un modello';
$ec_lang['lpn_library_pattern_values']='Moltiplicatori';
$ec_lang['lpn_library_pattern_values_tip']='I moltiplicatori, separati da spazi o virgole. Incolla una colonna da un foglio di calcolo, se ne hai una. L\'elenco si ripete per tutta la durata del calcolo, quindi non deve coprirla per intero.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} moltiplicatori, distanziati di {step}, che coprono {span}';
$ec_lang['lpn_library_pattern_none']='Nessun modello';
$ec_lang['lpn_settings_default_pattern']='Modello di richiesta predefinito';
$ec_lang['lpn_settings_default_pattern_tip']='Ogni nodo senza un modello usa questo.';
$ec_lang['lpn_library_control_add']='Aggiungi un controllo';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Una regola su una riga, con la sintassi di EPANET. Usa le unità di misura coerenti con il progetto. Le parole chiave devono essere in inglese. Esempi: LINK 12 CLOSED IF NODE 23 ABOVE 20 (Il link 12 verrà chiuso quando il livello nella vasca 23 supera 20 ft); LINK 12 OPEN IF NODE 130 BELOW 30 (Il link 12 verrà aperto se la pressione al nodo 130 scende sotto 30 psi); LINK PUMP02 1.5 AT TIME 16 (La velocità relativa della pompa PUMP02 viene impostata a 1,5 dopo 16 ore dall\'inizio della simulazione); LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM (Due regole: il link 12 viene chiuso ripetutamente alle 10 del mattino e aperto alle 20 per tutta la durata della simulazione)';
$ec_lang['lpn_library_control_ok']='✓ Compreso';
$ec_lang['lpn_library_control_bad']='⚠ Non compreso';
$ec_lang['lpn_library_control_missing']='⚠ Questa rete non ha nulla chiamato {id}';
$ec_lang['lpn_library_rules']='Regole';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Una regola è un breve paragrafo che apre o chiude un collegamento, oppure gli assegna un\'impostazione, quando un livello dell\'acqua, una pressione, una portata o un orario raggiungono un valore che imposti. Le regole possono verificare più di una condizione alla volta, e possono indicare che cosa fare quando la verifica fallisce.';
$ec_lang['lpn_library_rule_add']='Aggiungi una regola';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Una regola, con le parole usate da EPANET, una clausola per riga. Una prima riga la nomina: RULE 1. Poi una condizione: IF TANK 2 LEVEL BELOW 17.1. Poi che cosa fare: THEN PUMP 9 STATUS IS OPEN. Un\'ultima riga può darle una priorità: PRIORITY 1. Aggiungi righe AND o OR per verificare più di una condizione, e righe ELSE per indicare che cosa fare quando la verifica fallisce. Una condizione può leggere LEVEL, HEAD, GRADE, PRESSURE o DEMAND su un nodo, FLOW, STATUS o SETTING su un collegamento, oppure TIME e CLOCKTIME su SYSTEM. Scrivi i numeri nelle unità che mostra questo progetto; vengono convertiti per te. Lascia le parole chiave in inglese: sono quelle che la pagina ed EPANET leggono.';
$ec_lang['lpn_library_rule_ok']='✓ Questa regola è stata letta';
$ec_lang['lpn_library_rule_bad']='⚠ Non è stato possibile leggere questa regola';
$ec_lang['lpn_library_rule_missing']='⚠ Questa rete non ha nulla chiamato {id}';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Richiesta base';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='La portata prelevata da questo nodo nell\'istante mostrato: ogni richiesta base moltiplicata per il proprio modello, sommate insieme. È calcolata, non digitata, quindi cambia con l\'orologio e non può essere modificata.';
$ec_lang['lpn_field_demand_pattern']='Modello di richiesta';
$ec_lang['lpn_field_demand_pattern_tip']='Come sale e scende la richiesta di questo nodo nel corso del calcolo. Lascialo su Nessun modello per seguire il Modello predefinito del progetto.';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Descrizione';
$ec_lang['lpn_field_demand_category_tip']='Nome o descrizione di questa categoria di richiesta.';
$ec_lang['lpn_demand_add']='Aggiungi categoria di richiesta';
$ec_lang['lpn_demand_add_tip']='Aggiungi un\'altra categoria di richiesta a questo nodo, con una propria richiesta base, un proprio modello e una propria descrizione. Le categorie si sommano.';
$ec_lang['lpn_demand_remove']='Rimuovi questa richiesta';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Modello di carico';
$ec_lang['lpn_field_head_pattern_tip']='Come sale e scende il livello dell\'acqua di questo serbatoio nel corso del calcolo. Il carico sopra indicato viene moltiplicato per il modello.';
$ec_lang['lpn_field_pump_speed']='Velocità relativa';
$ec_lang['lpn_field_pump_speed_tip']='1 è questa pompa che gira alla velocità a cui è stata misurata la sua curva. 0,9 è la stessa pompa che gira più lentamente, il che abbassa il carico che aggiunge e la portata che fa passare. Un modello di velocità prende il posto di questo numero durante il calcolo.';
$ec_lang['lpn_field_speed_pattern']='Modello di velocità';
$ec_lang['lpn_field_speed_pattern_tip']='Come sale e scende la velocità di questa pompa nel corso del calcolo. Ogni moltiplicatore è la velocità relativa per quella parte del calcolo, e prende il posto dell\'impostazione Velocità relativa invece di scalarla, quindi un moltiplicatore di 0 ferma la pompa.';

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
$ec_lang['lpn_search_menu']='Cerca un luogo per nome…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Trova una città, un indirizzo o un punto di riferimento per nome e sposta lì la mappa. Il primo utilizzo chiede il tuo permesso, perché le parole che digiti vengono inviate al servizio di ricerca dei nomi di luogo di OpenStreetMap.';
$ec_lang['lpn_search_bar']='Cerca per nome…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='La ricerca per nome di luogo invia le parole che digiti a nominatim.openstreetmap.org, il servizio gratuito di ricerca dei nomi di luogo della OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Questo è un servizio diverso dalle immagini della mappa stradale dietro il tuo progetto. Le immagini dicono solo dove stai guardando. Una ricerca dice che cosa hai digitato. Il servizio di ricerca dei nomi di luogo riceverà le parole della tua ricerca e il tuo indirizzo IP. Non inviamo nient\'altro, e non conserviamo alcuna traccia delle tue ricerche.';
$ec_lang['lpn_search_consent_3']='Possiamo inviare le tue ricerche al servizio di ricerca dei nomi di luogo?';
$ec_lang['lpn_search_consent_4']='Se rispondi no, tutto il resto di questa pagina continua a funzionare esattamente come ora, compreso Vai a una latitudine e longitudine. Ricordiamo un sì in modo da non doverlo chiedere di nuovo. Un no non viene memorizzato affatto.';
$ec_lang['lpn_search_refused']='La ricerca per nome di luogo è disattivata, e non è stato inviato nulla. Puoi comunque usare Vai a una latitudine e longitudine.';
$ec_lang['lpn_search_prompt']='Cerca un luogo per nome. Una città, una via, un punto di riferimento: per esempio Petaluma, California';
$ec_lang['lpn_search_empty']='Digita un nome di luogo da cercare.';
$ec_lang['lpn_search_working']='Ricerca in corso…';
$ec_lang['lpn_search_busy']='Una ricerca è già in corso. Attendi la sua risposta.';
$ec_lang['lpn_search_choose']='Più di un luogo corrisponde. Quale?';
$ec_lang['lpn_search_nochoice']='Nessuna scelta effettuata, quindi la mappa non si è spostata.';
$ec_lang['lpn_search_badchoice']='Quello non è uno dei numeri nell\'elenco.';
$ec_lang['lpn_search_none']='Nessun risultato trovato per quel nome.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Il servizio di ricerca dei nomi di luogo ci chiede di rallentare. Attendi un minuto e riprova.';
$ec_lang['lpn_search_http']='Il servizio di ricerca dei nomi di luogo ha risposto con un errore.';
$ec_lang['lpn_search_timeout']='Il servizio di ricerca dei nomi di luogo non ha risposto in tempo. Tutto il resto di questa pagina funziona senza di esso.';
$ec_lang['lpn_search_unreadable']='Il servizio di ricerca dei nomi di luogo ha risposto con qualcosa che questa pagina non è riuscita a leggere.';
$ec_lang['lpn_search_offline']='Non siamo riusciti a raggiungere il servizio di ricerca dei nomi di luogo. Potresti essere offline. Tutto il resto di questa pagina funziona senza di esso, compreso Vai a una latitudine e longitudine.';
$ec_lang['lpn_search_toofast']='Una ricerca al secondo: è quanto consente il servizio di ricerca dei nomi di luogo. Riprova tra un momento.';
$ec_lang['lpn_search_nofetch']='Questo browser non può raggiungere il servizio di ricerca dei nomi di luogo.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox assembla questi dati da molti insiemi pubblici di dati altimetrici, quindi la loro qualità dipende interamente da dove ti trovi. Dove esiste un rilievo lidar nazionale, come USGS 3DEP in gran parte degli Stati Uniti e i suoi equivalenti altrove, può essere più preciso di un metro in orizzontale e di qualche decimo di metro in verticale. Dove esistono solo dati globali, la precisione è di circa 30 m in orizzontale e di diversi metri in verticale. Mapbox non ci dice quale dei due hai ottenuto. Trattali come una mappa a curve di livello, non come un rilievo: verifica tutto ciò su cui fai affidamento.';
$ec_lang['lpn_terrain_consent_1']='Compilare le quote invia la posizione di ogni nodo che ne ha bisogno – la sua latitudine e longitudine – a api.mapbox.com, per cercare l\'altezza del terreno in quel punto.';
$ec_lang['lpn_terrain_consent_2']='Questa è una questione diversa dalle immagini della mappa dietro il tuo progetto. Le immagini dicono solo dove stai guardando. Queste posizioni sono la tua rete stessa. Mapbox riceverà quelle coordinate e il tuo indirizzo IP. Non inviamo nient\'altro: nessun nome, nessuna tubazione, nessun progetto. Non ne conserviamo alcuna traccia, e su questo dispositivo non viene memorizzato nulla tranne la tua risposta a questa domanda.';
$ec_lang['lpn_terrain_consent_3']='Possiamo inviare le posizioni dei tuoi nodi a Mapbox?';
$ec_lang['lpn_terrain_consent_4']='Se rispondi no, tutto il resto di questa pagina continua a funzionare esattamente come ora, e puoi digitare tu stesso le quote come prima. Ricordiamo un sì in modo da non doverlo chiedere di nuovo. Un no non viene memorizzato affatto.';
$ec_lang['lpn_terrain_refused']='Le quote non sono state compilate, e non è stato inviato nulla. Puoi digitarle tu come prima.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Compilare la quota di {n} nodo/i dal DEM Mapbox?';
$ec_lang['lpn_terrain_confirm_default_1']='Ogni nodo ha già una quota, e {n} di essi sono ancora a {v}, che è la quota con cui parte un nuovo nodo, e non una che hai digitato.';
$ec_lang['lpn_terrain_confirm_default_2']='Sostituire la quota di quei {n} nodi con i valori del DEM Mapbox?';
$ec_lang['lpn_terrain_keep']='{k} nodo/i hanno già una quota e non verranno toccati.';
$ec_lang['lpn_terrain_undo']='Un solo Annulla (Ctrl-Z) li riporta tutti indietro.';
$ec_lang['lpn_terrain_requests']='{n} richiesta/e a api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Le quote sono già in fase di compilazione. Attendi il completamento.';
$ec_lang['lpn_terrain_offmap']='Queste posizioni dei nodi non sono sulla mappa del terreno, quindi non è stato inviato nulla.';
$ec_lang['lpn_terrain_too_wide']='Questi nodi sono distribuiti su un\'area della Terra troppo ampia per essere letta in un\'unica volta ({n} richieste di tessere). Non è stato inviato nulla.';
$ec_lang['lpn_terrain_cancelled']='Non è stato cambiato nulla e non è stato inviato nulla.';
$ec_lang['lpn_terrain_nofetch']='Questo browser non può raggiungere il servizio del terreno.';
$ec_lang['lpn_terrain_working']='Lettura della superficie del terreno…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Il servizio del terreno ha rifiutato la richiesta ({status}), quindi nessuna quota è stata modificata. Il token Mapbox usato da questo sito potrebbe non consentire l\'indirizzo web su cui ti trovi.';
$ec_lang['lpn_terrain_failed']='Non siamo riusciti a raggiungere il servizio del terreno, quindi nessuna quota è stata cambiata. Potresti essere offline. Tutto il resto di questa pagina funziona senza di esso.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Il servizio del terreno ci chiede di rallentare (429), quindi nessuna quota è stata modificata. Riprova tra un minuto.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Il servizio del terreno ha risposto con un errore ({status}), quindi nessuna quota è stata modificata. Non c\'è nulla che non va nella tua rete.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Nessuno di quei nodi ha una posizione sulla Terra, quindi non è stato inviato nulla e nessuna quota è stata modificata. Leggere la superficie del terreno richiede un progetto in latitudine e longitudine, oppure uno su una proiezione che questa pagina può collocare.';
$ec_lang['lpn_terrain_done']='{n} quota/e compilata/e.';
$ec_lang['lpn_terrain_missed']='{m} non sono state lette e restano vuote.';
$ec_lang['lpn_terrain_partial']='{f} tessera/e del terreno non ha/hanno risposto.';
$ec_lang['lpn_terrain_will_ids']='Questi nodi riceveranno una quota: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Quei nodi sono: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Questi nodi hanno ricevuto una quota: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Questi nodi sono ancora senza quota: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, e altri {n}';

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
$ec_lang['lpn_ff_menu']='Analisi della portata antincendio…';
$ec_lang['lpn_ff_menu_tip']='Verifica i nodi uno alla volta: quanto può erogare ciascuno mantenendo la pressione residua che imposti, e il fatto di prelevare lì la portata richiesta porta qualcos\'altro fuori dai limiti?';
$ec_lang['lpn_ff_title']='Analisi della portata antincendio';
$ec_lang['lpn_ff_intro']='A ogni nodo, a turno, viene chiesto di prelevare una portata antincendio in aggiunta alla richiesta che ha già. Nulla nel tuo progetto viene cambiato; l\'intero calcolo è eseguito su una copia.';
$ec_lang['lpn_ff_scope']='Nodi da verificare';
$ec_lang['lpn_ff_scope_tip']='Scegli l\'insieme prima di calcolare. Verificare ogni nodo in un sistema grande può richiedere minuti.';
$ec_lang['lpn_ff_scope_all']='Ogni nodo';
$ec_lang['lpn_ff_scope_selected']='I nodi selezionati';
$ec_lang['lpn_ff_no_junctions']='Questo progetto non ha ancora nodi, quindi non c\'è nulla da verificare.';
$ec_lang['lpn_ff_no_selection']='Nessun nodo è selezionato. Scegline uno sulla mappa, oppure verifica ogni nodo.';
$ec_lang['lpn_ff_skipped']='{n} elementi selezionati non sono nodi, quindi non sono stati verificati.';
$ec_lang['lpn_ff_required']='Portata antincendio richiesta';
$ec_lang['lpn_ff_required_tip']='La portata che il tuo codice antincendio o la tua autorità antincendio richiede a un idrante. Ogni nodo è verificato rispetto a questo numero, a meno che non ne porti uno proprio.';
$ec_lang['lpn_ff_required_own']='I nodi che portano una propria portata antincendio richiesta sono verificati rispetto a quella. Numero di essi: {n}.';
$ec_lang['lpn_ff_required_node_tip']='La portata antincendio richiesta in questo nodo per l\'uso del suolo che serve, secondo il tuo codice antincendio o la tua autorità antincendio. Lascialo vuoto e il nodo viene verificato rispetto al numero nel riquadro Analisi della portata antincendio.';
$ec_lang['lpn_ff_residual']='Pressione residua da mantenere';
$ec_lang['lpn_ff_residual_tip']='La pressione che il nodo deve ancora mantenere mentre eroga la portata antincendio. AWWA M31 e NFPA 291 usano 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Verifica di progetto (effetto sul sistema)';
$ec_lang['lpn_ff_design_tip']='Una domanda separata da se il nodo può erogare la portata: con quella portata prelevata lì, qualcos\'altro scende sotto la sua pressione minima o supera il suo limite di velocità? Scegliere di verificarlo non costa alcun calcolo aggiuntivo.';
$ec_lang['lpn_ff_design_off']='Non verificare';
$ec_lang['lpn_ff_design_all']='Tutti gli altri nodi e tutte le tubazioni';
$ec_lang['lpn_ff_design_selected']='I nodi selezionati e le loro tubazioni';
$ec_lang['lpn_ff_design_no_selection']='La verifica di progetto è impostata sui nodi selezionati, e nessuno è selezionato. Selezionane alcuni sulla mappa, oppure imposta Tutti.';
$ec_lang['lpn_ff_minpressure']='Pressione minima consentita altrove';
$ec_lang['lpn_ff_minpressure_tip']='Un nodo che scende sotto questo valore mentre un altro sta prelevando la propria portata antincendio è segnalato come un problema di progetto.';
$ec_lang['lpn_ff_maxvelocity']='Velocità massima consentita';
$ec_lang['lpn_ff_maxvelocity_tip']='Una tubazione che supera questo valore mentre viene prelevata una portata antincendio è segnalata come un problema di progetto.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='La portata antincendio viene prelevata al nodo stesso. È il metodo usato qui, ed è quello consueto. L\'idrante, la sua diramazione e il suo boccaglio non sono modellati, quindi un idrante reale eroga meno della portata mostrata qui.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Viene usato il risolutore integrato.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Viene usato il motore EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='La portata antincendio disponibile è una ricerca, quindi l\'intera rete viene risolta circa sedici volte per ogni nodo verificato. Un sistema grande richiede minuti. Puoi fermarlo in qualsiasi momento e conservare ciò che è già stato calcolato.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Viene verificato solo l\'istante ora a schermo. La portata antincendio viene normalmente verificata sopra la richiesta del giorno di massimo consumo, quindi porta la rete a quella condizione prima di calcolare.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Calcolo della portata antincendio';
$ec_lang['lpn_ff_calculate']='Calcola';
$ec_lang['lpn_ff_stop']='Ferma';
$ec_lang['lpn_ff_working']='In corso: {done} di {total} nodi.';
$ec_lang['lpn_ff_stopped']='Fermato dopo {done} di {total} nodi. I risultati qui sotto sono quelli già completati.';
$ec_lang['lpn_ff_cost']='Questo calcolo ha risolto l\'intera rete {solves} volte.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Il disegno è cambiato, quindi i risultati della portata antincendio sono stati cancellati. Calcola di nuovo.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Cancella gli anelli';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} nodi non avevano nulla di sbagliato. {fire} nodi non hanno superato la verifica della portata antincendio. {design} nodi hanno influenzato il resto del sistema.';
$ec_lang['lpn_ff_summary_error']='{n} nodi non hanno potuto ricevere una risposta.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Ogni nodo verificato';
$ec_lang['lpn_ff_col_junction']='Nodo';
$ec_lang['lpn_ff_col_static']='Pressione statica';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='La pressione a questo nodo prima che venga prelevata qualunque portata antincendio, con le richieste ordinarie del sistema ancora attive. Non viene chiuso nulla per misurarla, quindi questa non è una pressione a portata zero per il sistema; è la stessa pressione che la mappa mostra a questo nodo. AWWA M31 e NFPA 291 chiamano entrambi questa lettura la pressione statica, ed è da lì che parte una prova di portata antincendio.';
$ec_lang['lpn_ff_col_available']='Portata disponibile';
$ec_lang['lpn_ff_col_required']='Portata richiesta';
$ec_lang['lpn_ff_col_residual']='Residua mantenuta';
$ec_lang['lpn_ff_col_atrequired']='Pressione alla portata richiesta';
$ec_lang['lpn_ff_col_affected']='Effetto peggiore';
$ec_lang['lpn_ff_col_limit']='Limite di progetto';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Non verificato';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Pressione statica insufficiente, quindi non verificato';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Modi di insuccesso';
$ec_lang['lpn_ff_mode_fire']='Antincendio';
$ec_lang['lpn_ff_mode_design']='Progetto';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Nessuno';
$ec_lang['lpn_ff_col_solves']='Calcoli';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_pressure']='Pressione';
$ec_lang['lpn_ff_limit_velocity']='Velocità';
$ec_lang['lpn_ff_limit_both']='Pressione e velocità';
$ec_lang['lpn_ff_atleast']='più di {flow}';
$ec_lang['lpn_ff_affect_node']='{id} scende a {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} raggiunge {velocity}';
$ec_lang['lpn_ff_more']='e altri {n} interessati';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='Altri {n} nodi non sono mostrati.';
$ec_lang['lpn_ff_design_none']='Nulla nell\'insieme scelto è uscito dai propri limiti mentre un qualsiasi nodo prelevava la propria portata antincendio.';
$ec_lang['lpn_ff_design_off_note']='L\'effetto sul resto del sistema non è stato verificato in questo calcolo.';
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
$ec_lang['lpn_ff_iso']='L\'Insurance Services Office (ISO) accredita a un singolo idrante al massimo {flow}. Questo limite di accreditamento non è stato applicato qui perché non sappiamo quanti idranti un nodo può rappresentare.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Già sotto la pressione residua prima ancora di prelevare qualsiasi portata antincendio';
$ec_lang['lpn_ff_err_converge']='La rete non è convergente.';
$ec_lang['lpn_ff_err_solve']='Il risolutore ha segnalato un errore e non ha dato risposta.';
$ec_lang['lpn_ff_err_not_junction']='Non è un nodo';
$ec_lang['lpn_ff_err_unknown']='Nessuna risposta. Il codice segnalato era {code}.';

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
$ec_lang['lpn_file_import_survey']='Importa punti rilevati…';
$ec_lang['lpn_file_import_survey_tip']='Legge un elenco di punti rilevati da un file di testo e crea un nodo in ciascun punto, usando le impostazioni per i nuovi elementi per tutto ciò che il file non indica. Non viene disegnata alcuna tubazione, e nessuna riga viene mai scartata senza essere nominata. Legge il sistema di coordinate già usato da questo progetto, georeferenziato o no.';
$ec_lang['lpn_survey_read_error']='Non è stato possibile leggere quel file dal tuo disco.';
$ec_lang['lpn_survey_cancelled']='Non è stato creato nulla e non è stato cambiato nulla.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Coordinata Nord';
$ec_lang['lpn_survey_axis_east']='Coordinata Est';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Quel file non contiene nulla.';
$ec_lang['lpn_survey_err_unreadable']='Non è stato possibile leggere quel file come elenco di punti rilevati.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Più di una colonna in quel file potrebbe essere {axis} ({detail}), e questa pagina non sceglierà tra di esse. Lascia solo una di esse nominata come {axis} e riprova.';
$ec_lang['lpn_survey_err_no_points']='Nemmeno una riga di quel file è stata letta come punto rilevato. Righe lette: {detail}';
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
$ec_lang['lpn_survey_format_label']='Formato del file:';
$ec_lang['lpn_survey_format_internal']='specificato internamente';
$ec_lang['lpn_survey_create']='Crea nodi';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='La prima riga è stata saltata: non nomina nessuna colonna che questa pagina conosca.';
$ec_lang['lpn_survey_type_label']='Tipo di elemento:';
$ec_lang['lpn_survey_confirm_junction']='Trovati {n} nodi. Procedere?';
$ec_lang['lpn_survey_confirm_reservoir']='Trovati {n} serbatoi. Procedere?';
$ec_lang['lpn_survey_confirm_tank']='Trovate {n} vasche. Procedere?';
$ec_lang['lpn_survey_report_junction']='{n} nodi importati, {m} con quota.';
$ec_lang['lpn_survey_report_reservoir']='{n} serbatoi importati, {m} con quota.';
$ec_lang['lpn_survey_report_tank']='{n} vasche importate, {m} con quota.';
$ec_lang['lpn_survey_report_clean']='Ogni punto del file è stato importato, e nulla è stato cambiato durante l\'importazione.';
$ec_lang['lpn_survey_report_notes']='Errori e note di importazione:';
$ec_lang['lpn_survey_sev_error']='errore';
$ec_lang['lpn_survey_sev_warning']='avviso';
$ec_lang['lpn_survey_note_line']='Riga {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Troppo poche colonne per il formato di file indicato sopra.';
$ec_lang['lpn_survey_note_coord_missing']='La cella {axis} è vuota.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} non viene letto come numero.';
$ec_lang['lpn_survey_note_coord_range']='{axis} è fuori dall\'intervallo consentito da questo progetto.';
$ec_lang['lpn_survey_note_bad_elev']='Quota non numerica. Importato senza quota.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Più di una colonna potrebbe essere la quota, quindi nessuna di esse è stata letta.';
$ec_lang['lpn_survey_note_blank_rows']='Righe vuote saltate: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Nome già usato in precedenza in questo file, assegnato un nuovo nome.';
$ec_lang['lpn_survey_note_id_taken']='Nome già presente nel progetto, assegnato un nuovo nome.';
$ec_lang['lpn_survey_note_id_invalid']='Nome non utilizzabile qui, assegnato un nuovo nome.';
