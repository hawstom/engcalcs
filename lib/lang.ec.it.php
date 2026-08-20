<?php

// àáèéìíòóùú — All missing text declarations will fall back to English.

// Units (alphabetical order)
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
$ec_lang['menu_main_list']='Elenco calcolatori';
$ec_lang['menu_main_hydraulics']='Idraulica';
$ec_lang['menu_main_language']='Lingua';
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
$ec_lang['consent_body']='Possiamo conservare una sola cifra per pagina nella memoria di questo profilo del browser, per evitare di registrare ripetutamente le sue visite?';
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
$ec_lang['mpf_spreadheet_notice']='Foglio di calcolo Portata in tubazione Manning';
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
$ec_lang['mphl_hgl_egl_tip']='Potrebbe non essere valido se la tubazione è in rilievo. Vedere le note.';
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
$ec_lang['mtc_n_strickler']='n per dimensione roccia di progetto secondo Strickler';
$ec_lang['mtc_n_blodgett']='n per dimensione roccia di progetto secondo Blodgett';
$ec_lang['mtc_n_bathurst']='n per dimensione roccia di progetto secondo Bathurst';
$ec_lang['mtc_n_pi']='n per dimensione roccia di progetto secondo Phillips & Ingersoll';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett contro Bathurst';
$ec_lang['mtc_pi_range_check']='Verifica intervallo P&I';
$ec_lang['mtc_pi_ok']='d50 nell\'intervallo P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Fuori intervallo';
$ec_lang['mtc_pi_tip']='Estrapolazione oltre l\'intervallo di dati 0,28–0,36 ft su cui questa equazione è stata sviluppata: da considerare come verifica indicativa, non come base di progetto';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Secondo Isbash (1936) e Maricopa County, Arizona, US.">Dimensione roccia angolare richiesta sul fondo, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Secondo Isbash (1936) e Maricopa County, Arizona, US.">Dimensione roccia angolare richiesta scarpata 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Secondo Isbash (1936) e Maricopa County, Arizona, US.">Dimensione roccia angolare richiesta scarpata 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Secondo Maynord, Ruff e Abt (1989). In una curva la roccia è dimensionata per una velocità di curva pari a 4/3 della media, secondo California Division of Highways (1970); il valore originale di Maynord di 1,5 si applica ai canali naturali.">Dimensione roccia angolare richiesta, D<sub>50</sub> (Maynord, Ruff, e Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Dimensione roccia angolare richiesta, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Velocità ragionevole per le ipotesi di flusso uniforme.';
$ec_lang['mtc_vel_low']='Velocità bassa — rischio di sedimentazione.';
$ec_lang['mtc_vel_high']='La velocità è elevata e potrebbe non essere realistica; verificare l\'erosione del rivestimento del canale, il tirante aggiuntivo nelle curve e la perdita di energia in corrispondenza di espansioni o ostruzioni.';
$ec_lang['mtc_iteration_tip']='Scegliere un\'opzione di scabrezza (Blodgett-Bathurst raccomandato) e un\'opzione di dimensione roccia (Isbash raccomandato) per iterare automaticamente verso una dimensione roccia uniforme per la portata desiderata. Vedere le Note sotto per il metodo completo, oppure inserire un proprio valore di scabrezza (seguire il link per indicazioni) e ignorare la dimensione roccia per saltare l\'iterazione.';
$ec_lang['mtc_note_1']='<dl><dt>Iterazione automatica dimensionamento roccia e scabrezza</dt><dd>Scegliere un pulsante radio per la scabrezza (Blodgett-Bathurst raccomandato) e uno per la dimensione roccia di progetto (Isbash raccomandato). Regolare profondità e fattore di sicurezza della roccia per ottenere la portata desiderata con una dimensione roccia uniforme. Ogni modifica ai dati avvia il ciclo iterativo: 1. La scabrezza viene calcolata dalla dimensione roccia di progetto. 2. La scabrezza richiesta viene copiata nella scabrezza di input. 3. La portata nel canale e la dimensione roccia richiesta vengono calcolati. 4. La dimensione roccia di progetto viene aggiornata. 5. Si ripete fino a convergenza.</dd><dt>Calcolatore base (senza iterazione)</dt><dd>Inserire il valore di scabrezza desiderato. Ignorare l\'area di input della dimensione roccia di progetto.</dd></dl>';
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
$ec_lang['wi_save_and_calculate']='Salva e calcola';
$ec_lang['wi_notes_we_def']='q = se (length = 0) allora 0 altrimenti se (slope=0) allora cw*length*d<sub>0</sub><sup>1.5</sup> altrimenti cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) dove d<sub>1</sub> e d<sub>0</sub> sono sempre positivi o zero';
// Orifice Flow
$ec_lang['or_main_menu']='Deflusso a orifizio';
$ec_lang['or_main_title']='Calcolatore gratuito online del deflusso a orifizio';
$ec_lang['or_main_desc']='Deflusso a orifizio — libero o sommerso';
$ec_lang['or_shape']='Forma dell\'apertura';
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
$ec_lang['mhp_annual_kwh']='Energia annua al 100% di capacità';
$ec_lang['mhp_vel_low']='Velocità bassa — rischio di sedimentazione e trascinamento d\'aria.';
$ec_lang['mhp_vel_high']='Velocità elevata — verificare le perdite di transizione, l\'energia disponibile e il colpo d\'ariete.';
$ec_lang['mhp_vel_ok_short']='OK';
$ec_lang['mhp_vel_high_short']='Alto';
$ec_lang['mhp_vel_low_short']='Basso';
$ec_lang['mhp_vel_ok_tip']='La velocità è nell\'intervallo efficiente per il dimensionamento della condotta forzata.';
$ec_lang['mhp_hl_ok_tip']='Entro l\'obiettivo del 10% — economico.';
$ec_lang['mhp_hl_warn_tip']='Supera l\'obiettivo del 10%. Considerare una condotta più grande.';
$ec_lang['mhp_hl_bad_tip']='Supera l\'obiettivo del 20%. Ridimensionare la condotta.';
$ec_lang['mhp_notes_1_term']='Perdita di carico';
$ec_lang['mhp_notes_1_def']='Perdita totale nella condotta forzata h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, dove h<sub>f</sub> = f(L/D)(v²/2g) è la perdita per attrito di Darcy-Weisbach e h<sub>m</sub> = k<sub>m</sub>·v²/2g comprende imbocchi, curve e valvole. Altezza netta H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Velocità';
$ec_lang['mhp_notes_2_def']='Verificare che la velocità sia ragionevole per il dislivello disponibile e il costo della tubazione. Una velocità molto bassa può indicare un sovradimensionamento; una velocità molto alta può aumentare le perdite per attrito e il rischio di colpo d\'ariete.';
$ec_lang['mhp_notes_3_term']='Obiettivo di perdita di carico';
$ec_lang['mhp_notes_3_def']='Perdite nella condotta forzata inferiori al 10% dell\'altezza lorda sono generalmente economiche. Il compromesso ottimale tra costo della tubazione e potenza persa si attesta spesso intorno al 4–6% per i siti ad alta valorizzazione dell\'energia elettrica.';
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
$ec_lang['install_desktop_steps_html']='<li>Apri una qualsiasi pagina di calcolo.</li><li>Fai clic sull\'<strong>icona di installazione</strong> (⊕ o icona a forma di computer) nella barra degli indirizzi del browser, oppure apri il menu del browser e scegli <strong>Installa EngCalcs…</strong></li><li>Fai clic su <strong>Installa</strong>. EngCalcs si aprirà come app autonoma in una propria finestra.</li>';
$ec_lang['install_firefox_heading']='Firefox / Altri browser';
$ec_lang['install_firefox_body']='Firefox non supporta l\'installazione di PWA su desktop. Puoi comunque usare tutti i calcolatori normalmente nel browser: dopo la prima visita, le pagine vengono memorizzate automaticamente nella cache per l\'uso offline.';
$ec_lang['install_cached_heading']='Cosa viene memorizzato nella cache';
$ec_lang['install_cached_body']='La prima volta che installi EngCalcs, tutte le pagine dei calcolatori e i relativi file di supporto (script, stili) vengono salvati automaticamente sul tuo dispositivo. Da quel momento, tutto funziona senza connessione a Internet. La lingua scelta viene ricordata dall\'ultima visita online.';
$ec_lang['contact_main_menu']='Contatto';
$ec_lang['about_main_title']='Informazioni sui calcolatori HawsEDC';
$ec_lang['about_main_desc']='Missione, software libero e contributi';
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
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) hanno sviluppato due equazioni empiriche per la dimensione mediana del pietrame D<sub>50</sub> in funzione della pendenza dello scivolo e della portata specifica. L\'equazione 1 si applica a pendenze dolci (S<sub>0</sub> < 0,10); l\'equazione 2 a pendenze ripide (0,10 ≤ S<sub>0</sub> ≤ 0,40). Entrambe le equazioni richiedono q<sub>t</sub> in m²/s e restituiscono D<sub>50</sub> in mm. L\'intervallo validato è 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
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
$ec_lang['bpn_upstream_tip']='ID del tratto che alimenta questo. Lasciare vuoto per seguire il tratto direttamente sopra (una tubazione in serie semplice). Inserire un ID qui per ramificarsi da un tratto diverso.';
$ec_lang['bpn_roughness_tip']='Scabrezza della tubazione per il metodo di attrito selezionato: n di Manning, C di Hazen-Williams, oppure altezza di scabrezza e di Darcy-Weisbach (una lunghezza). Tubazione in plastica liscia tipica: n circa 0,009, C circa 150, e circa 0,0015 mm.';
$ec_lang['bpn_demand']='Richiesta';
$ec_lang['bpn_demand_tip']='Portata fissa erogata all\'estremità a valle di questo tratto. Lasciare vuoto per un tratto che trasporta solo portata a valle.';
$ec_lang['bpn_demand_mult']='Moltiplicatore della domanda';
$ec_lang['bpn_demand_mult_tip']='Applica un fattore di scala a tutte le domande dei tratti contemporaneamente, per un\'analisi dell\'ora di punta o della crescita futura. Usare 1 per le domande così come inserite.';
$ec_lang['bpn_elev_down']='Quota valle';
$ec_lang['bpn_q_line']='Portata del tratto';
$ec_lang['bpn_q_line_tip']='Portata totale trasportata da questo tratto: la propria richiesta più ogni richiesta a valle che alimenta.';
$ec_lang['bpn_p_down']='Press. valle';
$ec_lang['bpn_p_down_tip']='Carico di pressione relativa al nodo di valle di questo tratto. Un valore negativo (segnalato) indica pressione subatmosferica; verificare il progetto.';
$ec_lang['bpn_sketch_heading']='Schema della rete';
$ec_lang['bpn_show_length']='Lunghezza';
$ec_lang['bpn_show_diameter']='Diametro';
$ec_lang['bpn_show_q']='Portata';
$ec_lang['bpn_show_p']='Pressione';
$ec_lang['bpn_source_label']='Fonte';
$ec_lang['bpn_topology_warn']='Verificare la colonna Monte: un tratto punta a un ID sconosciuto, fa riferimento a se stesso, oppure forma un anello, per cui parte della rete non è collegata alla fonte. Quei tratti restano irrisolti.';
$ec_lang['bpn_topology_warn_short']='Rete';
$ec_lang['bpn_pressure_warn']='Pressione bassa/negativa; verificare eventuali condizioni subatmosferiche';
$ec_lang['bpn_pressure_warn_short']='Bassa';
$ec_lang['bpn_notes_1_term']='In serie per impostazione predefinita, ramificata per eccezione';
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
$ec_lang['lpn_main_title']='Calcolatore online gratuito per reti di distribuzione idrica con il risolutore EPANET';
$ec_lang['lpn_main_desc']='Analisi di reti di distribuzione idrica: disegna una rete di tubazioni magliata o importa file EPANET';
$ec_lang['lpn_title_units']='Unità {units}';
$ec_lang['lpn_tool_select']='Seleziona';
$ec_lang['lpn_tool_add_junction']='Nodo';
$ec_lang['lpn_tool_add_reservoir']='Serbatoio';
$ec_lang['lpn_tool_add_pipe']='Tubazione';
$ec_lang['lpn_tool_add_pump']='Pompa';
$ec_lang['lpn_tool_add_text']='Testo';
$ec_lang['lpn_tool_delete']='Elimina';
$ec_lang['lpn_tool_zoom_extent']='Adatta tutto alla vista';
$ec_lang['lpn_new_text']='Testo';
$ec_lang['lpn_field_text_bold']='Testo in grassetto';
$ec_lang['lpn_field_text_rotation']='Angolo (gradi)';
$ec_lang['lpn_field_text_match_pipe']='Ruota alla stessa angolazione del collegamento più vicino';
$ec_lang['lpn_field_text_flip']='Ruota di 180°';
$ec_lang['lpn_field_elev']='Quota';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='Livello del terreno o della tubazione in questo nodo. Misuralo a partire da uno zero a piacere, purché ogni nodo usi lo stesso riferimento.';
// A reservoir carries an elevation AND a head, so it doubles as a tank (Tom, 2026-07-30). Leaving
// the head blank means "the water surface is at the reservoir's own elevation"; the placeholder
// string is what shows in that empty box.
$ec_lang['lpn_field_head']='Carico';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Livello della superficie dell\'acqua nel serbatoio, misurato come altezza, non come pressione. Lascialo vuoto per porre la superficie dell\'acqua alla quota del serbatoio.';
$ec_lang['lpn_close']='Chiudi';
$ec_lang['lpn_empty_hint']='Usa File, Nuovo progetto per aprire un esempio. Oppure inizia aggiungendo un serbatoio, un nodo e una tubazione dalla barra degli strumenti.';
$ec_lang['lpn_examples_heading']='Apri un esempio';
$ec_lang['lpn_examples_sub']='Ognuno si apre come una tua copia. Modificalo, salvalo, oppure apri una nuova copia e ricomincia.';
$ec_lang['lpn_examples_open']='Apri';
$ec_lang['lpn_examples_menu']='Apri esempio…';
$ec_lang['lpn_examples_blank']='Oppure inizia con una mappa vuota';
$ec_lang['lpn_examples_size']='Nodi: {nodes}, collegamenti: {links}';
$ec_lang['lpn_examples_failed']='Non è stato possibile caricare gli esempi. Usa File, Nuovo progetto per iniziare un disegno.';
$ec_lang['lpn_examples_loading']='Caricamento degli esempi…';
$ec_lang['lpn_help_fix']='Correggi qualcosa';
$ec_lang['lpn_help_notes']='Note su questa pagina';
$ec_lang['lpn_status_example_opened']='Aperto {name}. È una tua copia: salvala con File, Salva come.';
$ec_lang['lpn_ex_basic_si_title']='Rete di base, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Inizia da qui. Un serbatoio, una pompa e un piccolo anello: la disposizione più piccola che funziona ancora come una rete idrica. Litri al secondo, con metri e millimetri.';
$ec_lang['lpn_ex_basic_us_title']='Rete di base, gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='La stessa rete di partenza in galloni al minuto, con piedi e pollici.';
$ec_lang['lpn_ex_net1_title']='EPANET Net1';
$ec_lang['lpn_ex_net1_desc']='La più piccola delle tre reti di esempio di EPANET: un serbatoio, una pompa e un solo anello.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
$ec_lang['lpn_ex_net2_desc']='Una rete di distribuzione ramificata con una vasca, dagli esempi di EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
$ec_lang['lpn_ex_net3_desc']='Il grande esempio di EPANET: 92 nodi, 3 vasche e 2 serbatoi, uno dei quali una sorgente fluviale. Vale la pena aprirlo per vedere come appare sulla mappa un modello di dimensioni reali.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='La stessa rete di EPANET Net3, collocata in un luogo reale: le sue coordinate sono longitudine e latitudine, e dietro è disegnata una mappa stradale.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Un sito commerciale risolto per la portata antincendio sommata alla richiesta massima giornaliera, in un solo istante, disegnato su una planimetria del sito.';
$ec_lang['lpn_tool_undo']='Annulla';
$ec_lang['lpn_confirm_example']='Questo aggiunge l\'esempio alla rete che hai già. Continuare?';
$ec_lang['lpn_field_diameter']='Diametro';
$ec_lang['lpn_demand_tip']='Portata prelevata dalla rete in questo nodo. Inserisci un numero negativo per la portata immessa nella rete qui.';
$ec_lang['lpn_units_length']='Lunghezze delle tubazioni e coordinate della mappa';
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
$ec_lang['lpn_result_head']='Carico';
$ec_lang['lpn_result_head_tip']='Energia dell\'acqua in questo nodo, espressa come altezza di colonna d\'acqua. È un\'altezza, non una pressione.';
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
$ec_lang['lpn_menu_view']='Visualizza';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
$ec_lang['lpn_menu_settings']='Impostazioni';
$ec_lang['lpn_menu_help']='Guida';
$ec_lang['lpn_help_walkthroughs']='Esercitazioni';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Elimina rete';
$ec_lang['lpn_confirm_delete_network']='Eliminare ogni nodo, tubazione ed etichetta di testo di questo progetto? L\'immagine di sfondo, il nome del progetto e le impostazioni vengono conservati. Questa azione non può essere annullata.';
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
// File > New project's submenu (Task 264). `lpn_tool_example` ("Draw example network") was RETIRED
// with the toolbar button of that name -- an example is a whole network, so it starts a project
// rather than being drawn into the one you are in.
$ec_lang['lpn_new_blank_us']='Progetto xy vuoto, unità USA (gpm)';
$ec_lang['lpn_new_blank_si']='Progetto xy vuoto, unità SI (l/s)';
// The flow unit is IN the label, not left implied by "US"/"SI": gpm and l/s are what a water
// engineer recognises at a glance, and this is the moment the choice is being made.
$ec_lang['lpn_file_open']='Apri…';
$ec_lang['lpn_file_save']='Salva';
$ec_lang['lpn_file_saveas']='Salva con nome…';
$ec_lang['lpn_file_revert']='Ripristina';
$ec_lang['lpn_file_close']='Chiudi';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='File recenti';
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
// to a list of element IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='OK';
$ec_lang['lpn_file_import_inp']='Importa file EPANET…';
$ec_lang['lpn_file_import_inp_tip']='Legge una rete da un file EPANET, sia il file di testo .inp sia il file .net salvato da EPANET, e la salva in questo browser come nuovo progetto. Questa pagina non può riscrivere un file EPANET, quindi usa File, Salva con nome per conservare il tuo lavoro.';
$ec_lang['lpn_inp_bad_file']='Quel file non può essere letto come un file di rete EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Questo sembra un file .net di EPANET, ma questa pagina non è riuscita a leggerlo. Aprilo in EPANET e usa il comando File, Esporta, Rete per salvarlo come file .inp, poi importa quello.';
$ec_lang['lpn_inp_report_heading']='Importato {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} nodi, serbatoi e vasche, {links} tubazioni, pompe e valvole, in {units}.';
$ec_lang['lpn_inp_report_clean']='Tutto il contenuto del file è stato importato. Nulla è stato tralasciato.';
$ec_lang['lpn_inp_report_label_anchor']='Le etichette di testo vengono posizionate come le colloca EPANET, a partire dal loro angolo in alto a sinistra.';
$ec_lang['lpn_inp_report_lead']='Questa pagina non gestisce tutto ciò che gestisce EPANET. Ecco cosa è cambiato durante l\'importazione:';
$ec_lang['lpn_inp_drop_headloss']='Questo file non usa la formula di Hazen-Williams. Questa pagina calcola con Hazen-Williams, quindi i valori di scabrezza delle tubazioni sono stati mantenuti esattamente come scritti, ma i risultati qui non corrisponderanno a quelli di EPANET.';
$ec_lang['lpn_inp_drop_tcv']='Queste valvole di regolazione a strozzamento sono state importate come valvole di regolazione a strozzamento, mantenendo la stessa perdita indicata dal file. Entrambi i risolutori possono calcolarle.';
$ec_lang['lpn_inp_drop_valve']='Queste valvole sono descritte da una curva o da una perdita di pressione fissa, e questa pagina non ha un elemento di questo tipo. Sono state importate come tubazioni aperte, quindi la rete resta collegata, ma nulla ne controlla più la pressione o la portata.';
$ec_lang['lpn_inp_drop_cv']='In EPANET queste tubazioni lasciano passare l\'acqua in una sola direzione. Sono state importate come tubazioni ordinarie, quindi ora l\'acqua può scorrere in entrambi i sensi.';
$ec_lang['lpn_inp_drop_demands']='Questi nodi avevano più di una richiesta. Le richieste sono state sommate in un\'unica richiesta, come previsto da questa pagina.';
$ec_lang['lpn_inp_drop_patterns']='I modelli temporali di richiesta sono stati tralasciati, perché la parte di questa pagina che esegue una rete nel tempo non si è caricata. Ogni richiesta è il numero scritto nel file.';
$ec_lang['lpn_inp_drop_emitters']='Questi nodi hanno un coefficiente di erogatore (irrigatore) o di perdita. È stato conservato e viene risolto, ma al momento non c\'è dove vederlo o modificarlo su questa pagina.';
$ec_lang['lpn_inp_drop_curve_long']='Questa curva di pompa aveva più di tre punti. Sono stati conservati il punto più basso, quello centrale e quello più alto, perché questa pagina adatta una curva ad al massimo tre punti.';
$ec_lang['lpn_inp_drop_curve_missing']='Questa pompa fa riferimento a una curva che non è nel file. È stata importata senza curva, quindi non aggiunge carico.';
$ec_lang['lpn_inp_drop_pump_other']='Questa pompa è descritta da potenza, velocità o programma orario, anziché da una curva. È stata importata senza curva, quindi non aggiunge carico.';
$ec_lang['lpn_inp_drop_setting']='Queste tubazioni, pompe e valvole hanno un\'impostazione che questa pagina non può gestire. Sono state importate aperte.';
$ec_lang['lpn_inp_drop_controls']='I controlli e le regole sono stati tralasciati. Le tubazioni, le pompe e le valvole che citano sono state importate nello stato scritto nel file, e restano tali.';
$ec_lang['lpn_inp_drop_eps']='Questo file descrive una simulazione che si estende in un periodo di tempo. La parte di questa pagina che esegue una rete nel tempo non si è caricata, quindi sono state importate solo le condizioni iniziali.';
$ec_lang['lpn_inp_drop_quality']='La qualità dell\'acqua, le reazioni chimiche e le impostazioni di energia delle pompe sono state tralasciate. Questa pagina risolve solo portata e pressione.';
$ec_lang['lpn_inp_drop_backdrop']='Questo file indica un\'immagine di sfondo ma non ne contiene i dati. Aggiungila tu stesso con File, Immagine di sfondo, Aggiungi immagine.';
$ec_lang['lpn_inp_drop_dangling']='Queste tubazioni fanno riferimento a un nodo che non è nel file, quindi sono state tralasciate.';
$ec_lang['lpn_inp_drop_units']='L\'unità di portata indicata in questo file non è tra quelle che questa pagina riconosce, quindi ogni numero è stato letto come galloni al minuto. Controlla ogni numero prima di usare i risultati.';
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
$ec_lang['lpn_lock_prompt_name']='Cosa devono vedere i colleghi quando hai questo progetto aperto? Le tue iniziali sono l\'ideale. Chiunque apra lo stesso file può vederlo, quindi non usare nulla di privato.';
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
$ec_lang['lpn_lock_open_copy']='Crea una copia';
$ec_lang['lpn_lock_break']='Forza il blocco';
$ec_lang['lpn_lock_open_heading_times']='{name} ha questo file aperto; l\'ultima modifica risale a {x} fa, {y} dopo l\'ultimo salvataggio.';
$ec_lang['lpn_lock_open_heading_unsaved']='{name} ha questo file aperto; l\'ultima modifica risale a {x} fa, e nulla di essa è ancora stato salvato su questo file.';
$ec_lang['lpn_lock_open_heading_saved']='{name} ha questo file aperto; l\'ultima modifica risale a {x} fa, e il suo lavoro è salvato sul file.';
$ec_lang['lpn_lock_open_heading_seen']='{name} ha questo file aperto ma non lo ha modificato. Il suo browser ha effettuato l\'ultimo controllo {x} fa.';
$ec_lang['lpn_lock_open_choices']='Le tue opzioni: (1) Annulla e chiedi a loro di aprirlo se necessario e poi chiuderlo correttamente (chiudere il browser non chiude il progetto), (2) Apri in sola lettura, oppure (3) se tutto il resto fallisce, puoi forzare il loro blocco. Il loro lavoro non salvato non va perso, ma non potranno più salvare sopra le tue modifiche, e qualcuno potrebbe dover unire i due a mano.';
$ec_lang['lpn_ago_seconds']='{n} secondi';
$ec_lang['lpn_ago_minutes']='{n} minuti';
$ec_lang['lpn_ago_hours']='{n} ore';
$ec_lang['lpn_ago_days']='{n} giorni';
$ec_lang['lpn_ago_unknown']='un tempo sconosciuto';
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
$ec_lang['lpn_lock_not_asked']='Il blocco non è attivo per questo progetto, quindi nulla impedisce a un collega di modificare lo stesso file contemporaneamente. Questo browser non ha ancora un nome registrato per te, oppure il progetto non ha un identificativo — salvare il progetto su file imposta entrambi.';
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
$ec_lang['lpn_file_training_3']='Dai un nome breve con cui i tuoi colleghi ti riconosceranno. Le tue iniziali sono l\'ideale. Chiunque apra lo stesso file può vederlo, quindi non usare nulla di privato.';
$ec_lang['lpn_file_training_name']='Le tue iniziali';
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
$ec_lang['lpn_notes_1_term']='Regime stazionario';
$ec_lang['lpn_notes_1_def']='Risolve un solo insieme di richieste alla volta, usando lo stesso algoritmo del gradiente globale usato da EPANET. Non modella come la rete cambia nel tempo. Una vasca viene mantenuta al livello dell\'acqua che le assegni: entro una singola soluzione non si svuota mai e non si riempie mai.';
$ec_lang['lpn_notes_2_term']='Non modellato';
$ec_lang['lpn_notes_2_def']='La qualità dell\'acqua e le richieste che variano nel corso della giornata non sono modellate. Per le valvole: una valvola di regolazione a strozzamento funziona con entrambi i risolutori, mentre le valvole che si aprono e chiudono da sole (PRV, PSV, FCV) vengono risolte con il risolutore EPANET, che questa pagina attiva automaticamente quando la rete ne contiene una.';
$ec_lang['lpn_notes_3_term']='Salvataggio dei progetti';
$ec_lang['lpn_notes_3_def']='Ogni progetto è una scheda, e ogni scheda viene salvata in questo browser mentre lavori. Cancellare i dati del browser li elimina tutti, quindi conserva il tuo lavoro in un file: File, Salva con nome. Un asterisco su una scheda indica che contiene modifiche non presenti in un file. Nulla viene mai scritto su un file a meno che tu non lo chieda. In alcuni browser un progetto si collega al file in cui lo salvi, e da quel momento File, Salva scrive su quello stesso file; in altri nessuna connessione è possibile, quindi Salva è disattivato ed è disponibile solo Salva con nome. Quando un file di progetto è conservato su un\'unità condivisa, questa pagina ti avvisa se un collega lo ha già aperto, in modo che due persone non scrivano l\'una sopra il lavoro dell\'altra.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. The popup carries a one-line
// pointer to here instead (lpn_pump_curve_note).
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Curva della pompa';
$ec_lang['lpn_notes_5_def']='Una pompa segue H = H₀ − aQ^b, dove H è il carico aggiunto dalla pompa e Q è la portata che l\'attraversa. Inserisci uno, due o tre punti dalla curva del produttore. Tre punti — il carico a portata zero, il punto di lavoro normale e il punto di portata massima — determinano direttamente H₀, a e b, e seguono più fedelmente una curva pubblicata. Due punti adattano una parabola (b = 2) con il vertice a portata zero. Un punto usa una regola comune: il carico a portata zero è 1,33 × il carico inserito, e la portata massima è 2 × la portata inserita, il che dà di nuovo b = 2. Una pompa senza punti inseriti non aggiunge alcun carico. La curva non viene troncata dove il carico raggiunge zero, quindi chiedere a una pompa più portata di quella che la sua curva può fornire dà un carico negativo. La soluzione è una pompa più grande o una richiesta minore, non un adattamento della curva diverso.';
$ec_lang['lpn_notes_4_term']='Aggiunte previste';
$ec_lang['lpn_notes_4_def']='Scenari, in modo che un progetto possa contenere più insiemi di richieste. Tabelle dei risultati di nodi e tubazioni. Scrittura di file .inp EPANET, in modo che un progetto possa tornare a EPANET. Commenti e suggerimenti sono sempre benvenuti (vedi il link per il feedback qui sopra).';
$ec_lang['lpn_notes_epanet_term']='Le costanti di Hazen-Williams corrispondono a EPANET';
$ec_lang['lpn_notes_epanet_def']='Nell\'agosto 2026 il coefficiente e l\'esponente di Hazen-Williams sono stati modificati per corrispondere a EPANET. I risultati di perdita di carico differiscono dalle versioni precedenti di questa pagina fino allo 0,1 percento, un valore molto più piccolo dell\'incertezza sul valore di C stesso.';
$ec_lang['lpn_id_invalid']='Inserisci un ID senza spazi e senza virgolette.';
$ec_lang['lpn_id_taken']='Quell\'ID è già in uso.';
$ec_lang['lpn_diag_no_fixed_head']='Aggiungi un serbatoio o una vasca. La rete ha bisogno di almeno un livello dell\'acqua noto prima di poter essere risolta.';
$ec_lang['lpn_diag_dangling_link']='Una tubazione o una pompa si collega a un nodo che non esiste più:';
$ec_lang['lpn_diag_unreachable']='Questi nodi non hanno un percorso verso un serbatoio:';
$ec_lang['lpn_engine_fetching']='Recupero del risolutore EPANET. Viene scaricato una sola volta e poi conservato su questo dispositivo, così in seguito funziona anche offline.';
$ec_lang['lpn_engine_ready']='Il risolutore EPANET è ora su questo dispositivo e funziona offline.';
$ec_lang['lpn_engine_fetching_valve']='Recupero del risolutore EPANET, così questa valvola può essere risolta ora e offline in seguito.';
$ec_lang['lpn_engine_ready_valve']='Il risolutore EPANET è ora su questo dispositivo. Le valvole che si aprono e si chiudono da sole funzioneranno offline.';
$ec_lang['lpn_engine_unavailable']='Non è stato possibile ottenere il risolutore EPANET, che è ciò che risolve le valvole che si aprono e si chiudono da sole. Connettiti a internet una sola volta e da quel momento resterà conservato su questo dispositivo.';
$ec_lang['lpn_diag_not_converged']='Non è stata trovata alcuna soluzione. Controlla se ci sono valori impossibili nella realtà, come un diametro pari a zero.';
$ec_lang['lpn_field_roughness']='Scabrezza';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='C di Hazen-Williams. Un numero più alto indica una tubazione più liscia: circa 150 per plastica nuova, 130 per acciaio o ghisa nuovi, e 100 per tubazioni vecchie.';
$ec_lang['lpn_field_length']='Lunghezza';
$ec_lang['lpn_field_length_tip']='Lunghezza della tubazione. Con Auto attivato, la lunghezza è misurata da ciò che hai disegnato. Disattiva Auto per digitare una lunghezza diversa dal disegno.';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
$ec_lang['lpn_field_km']='Coefficiente di perdita concentrata (locale), k';
$ec_lang['lpn_field_km_tip']='Perdita dovuta a curve, valvole e raccordi su questa tubazione, contata come multiplo del carico cinetico. Usa 0 per una tubazione dritta senza accessori.';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Perdita concentrata, k';
// Pump curve entry (Task 146, 2026-07-30): up to 3 (flow, head) points, or a reference to
// another pump's curve so several identical pumps need the curve entered only once.
$ec_lang['lpn_pump_curve_source']='Origine della curva';
$ec_lang['lpn_pump_curve_own']='Inserisci i punti qui sotto';
$ec_lang['lpn_pump_curve_ref_note']='Usa la curva inserita per la pompa {id}.';
$ec_lang['lpn_pump_curve_note']='Uno, due o tre punti — vedi "Curva della pompa" nelle Note qui sotto.';
$ec_lang['lpn_pump_point1']='Punto 1';
$ec_lang['lpn_pump_point2']='Punto 2';
$ec_lang['lpn_pump_point3']='Punto 3';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
$ec_lang['lpn_mode_select']='Modalità: Seleziona. Fai clic su un elemento o un\'etichetta per vederlo o modificarlo. Trascina per spostare un nodo, un vertice o un\'etichetta. Fai doppio clic su una tubazione per aggiungere o rimuovere un vertice.';
$ec_lang['lpn_mode_delete']='Modalità: Elimina. Fai clic su un elemento per rimuoverlo.';
$ec_lang['lpn_mode_add_junction']='Modalità: Aggiungi nodo. Fai clic sulla mappa per posizionare un nodo. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
$ec_lang['lpn_mode_add_reservoir']='Modalità: Aggiungi serbatoio. Fai clic sulla mappa per posizionare un serbatoio. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
$ec_lang['lpn_mode_add_pipe']='Modalità: Aggiungi tubazione. Fai clic su un nodo, poi su un altro nodo, per collegarli. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
$ec_lang['lpn_mode_add_pump']='Modalità: Aggiungi pompa. Fai clic su un nodo, poi su un altro nodo, per collegarli. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Modalità: Aggiungi testo. Fai clic sulla mappa per posizionare un\'etichetta di testo. Fai clic vicino a un nodo per collegare il testo a quel nodo. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Usa questa modalità per modificare, spostare e trascinare elementi sulla mappa.';
$ec_lang['lpn_tip_labels_draggable']='Puoi trascinare un\'etichetta per spostarla. Fai doppio clic su un\'etichetta per riportarla alla sua posizione automatica.';
$ec_lang['lpn_field_auto']='Auto';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
$ec_lang['lpn_field_text_size']='Moltiplicatore di dimensione';
$ec_lang['lpn_tool_labels']='Etichette';
$ec_lang['lpn_labels_heading_node']='Etichette dei nodi';
$ec_lang['lpn_labels_heading_link']='Etichette dei collegamenti';
$ec_lang['lpn_labels_decimals_tip']='Cifre decimali mostrate per questa etichetta';
$ec_lang['lpn_labels_mark_extrema']='Segna i valori più alti e più bassi';
$ec_lang['lpn_labels_mark_extrema_tip']='Disegna una linea sopra il valore più alto di ogni tipo sulla mappa, e una linea sotto il valore più basso di quel tipo, così puoi individuare i due estremi senza leggere i numeri.';
$ec_lang['lpn_settings_apply_to_all']='Applica a tutti';
$ec_lang['lpn_settings_apply_to_all_tip']='Ogni elemento di questo tipo già disegnato riceve un ID che inizia con questo testo. Ciascuno mantiene il proprio numero. Un ID che non termina con un numero viene lasciato invariato.';
$ec_lang['lpn_confirm_apply_prefix']='Rinominare {n} elementi in modo che i loro ID inizino con {prefix}? Ciascuno mantiene il proprio numero.';
$ec_lang['lpn_prefix_applied']='Rinominati {n} elementi. {skipped} altri sono stati lasciati invariati.';
$ec_lang['lpn_labels_prefix_tip']='Testo mostrato prima di questo valore sulla mappa';
$ec_lang['lpn_labels_prefix_id_tip']='Testo mostrato prima dell\'ID sulla mappa. Lascialo vuoto e l\'ID viene mostrato da solo, a partire dalla lettera che gli è stata assegnata, come J1 o L1.';
$ec_lang['lpn_labels_suffix_tip']='Testo mostrato dopo questo valore sulla mappa';
$ec_lang['lpn_labels_suffix_gradient_tip']='Testo mostrato dopo il gradiente di perdita di carico sulla mappa. Non digitare qui il simbolo di percentuale: viene aggiunto automaticamente quando le unità sono in percentuale.';
$ec_lang['lpn_labels_separator']='Testo tra i valori';
$ec_lang['lpn_labels_separator_tip']='Testo tra un valore e il successivo in un\'etichetta. Uno spazio per impostazione predefinita.';
$ec_lang['lpn_labels_priority']='Priorità';
$ec_lang['lpn_labels_priority_link_tip']='L\'ordine in cui i valori vengono eliminati quando un\'etichetta non entra nello spazio disponibile. 1 viene mantenuto più a lungo.';
$ec_lang['lpn_labels_priority_node_tip']='Priorità per decidere quale etichetta viene eliminata per prima quando la mappa è affollata: la richiesta più bassa, la pressione più vicina al centro dell\'intervallo, oppure la quota o il carico più vicini a quelli dei nodi vicini. 1 decide per primo.';
$ec_lang['lpn_labels_col_before']='Prima';
$ec_lang['lpn_labels_col_after']='Dopo';
$ec_lang['lpn_labels_col_decimals']='Decimali';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Immagine di sfondo…';
$ec_lang['lpn_backdrop_add']='Aggiungi';
// Bare verbs (2026-08-13): the heading "Immagine di sfondo…" above these voci di menu porta già
// l'oggetto, quindi ripeterlo qui sarebbe ridondante.
$ec_lang['lpn_backdrop_scale']='Ridimensiona su due punti';
$ec_lang['lpn_backdrop_scale_entry']='Ridimensiona con un file world o con la dimensione di un pixel sulla mappa';
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
$ec_lang['lpn_backdrop_scale_prompt1']='Fai clic su due punti dell\'immagine di sfondo, ad esempio i due estremi di una scala grafica. Poi digita la distanza reale tra loro.';
$ec_lang['lpn_backdrop_scale_prompt2']='Distanza reale tra i due punti';
$ec_lang['lpn_backdrop_position_prompt1']='Fai clic sul punto base (sull\'immagine) per lo spostamento.';
$ec_lang['lpn_backdrop_position_prompt2']='Scegli il metodo per il punto di destinazione, poi fai clic su Continua.';
$ec_lang['lpn_backdrop_busy']='Regolazione dell\'immagine di sfondo in corso.';
$ec_lang['lpn_backdrop_target_label']='Sposta quel punto a:';
$ec_lang['lpn_backdrop_target_node']='Un nodo';
$ec_lang['lpn_backdrop_target_free']='Qualsiasi punto della mappa';
$ec_lang['lpn_backdrop_target_coords']='Coordinate che digiti';
$ec_lang['lpn_backdrop_coords_prompt']='Digita la X,Y a cui quel punto deve spostarsi';
$ec_lang['lpn_backdrop_continue']='Continua';
$ec_lang['lpn_tool_settings']='Impostazioni';
$ec_lang['lpn_settings_scope_project']='Impostazioni del progetto';
$ec_lang['lpn_settings_scope_calculator']='Impostazioni del calcolatore';
$ec_lang['lpn_settings_show_titles']='Mostra i titoli della pagina';
$ec_lang['lpn_settings_show_titles_tip']='Nasconde l\'intestazione della pagina e la riga di benvenuto sopra il disegno, così la mappa ha più spazio. La stampa non cambia.';
$ec_lang['lpn_settings_id_prefixes']='Prefissi degli ID';
$ec_lang['lpn_settings_defaults']='Valori iniziali';
$ec_lang['lpn_settings_defaults_note']='Usati per gli elementi che crei da questo momento in poi. Gli elementi esistenti non vengono modificati.';
$ec_lang['lpn_settings_push_note']='Vengono applicate solo le proprietà le cui etichette sono visibili in questo momento.';
$ec_lang['lpn_settings_push_btn']='Applica i valori iniziali a tutti gli elementi';
$ec_lang['lpn_push_confirm']='Sostituire queste proprietà su ogni elemento esistente con i valori iniziali attuali? I valori che hai digitato verranno sovrascritti. Puoi annullare questa azione.';
$ec_lang['lpn_push_properties']='Proprietà:';
$ec_lang['lpn_push_elements']='Nodi e tubazioni:';
$ec_lang['lpn_push_none_displayed']='Nessun valore iniziale è mostrato come etichetta in questo momento, quindi non c\'è nulla da applicare. Attiva le etichette per le proprietà desiderate nel pannello Etichette, poi riprova.';
$ec_lang['lpn_push_nothing']='Nessun elemento esistente ha una delle proprietà che si stanno applicando.';
$ec_lang['lpn_push_no_change']='Ogni elemento ha già questi valori, quindi nulla cambierebbe.';
$ec_lang['lpn_settings_emitter_exponent']='Esponente dell\'erogatore';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_settings_computation']='Calcolo';
$ec_lang['lpn_settings_tolerance']='Tolleranza di convergenza';
$ec_lang['lpn_settings_tolerance_tip']='Quanto deve avvicinarsi il risolutore prima di fermarsi. Un numero più piccolo è più esatto e richiede più tempo.';
$ec_lang['lpn_settings_engine_epanet']='Risolvi con il risolutore EPANET';
$ec_lang['lpn_settings_engine_epanet_tip']='Esegue il risolutore EPANET dell\'agenzia statunitense EPA, qui nel tuo browser. Su una rete di queste dimensioni non noterai differenze di velocità. I due risolutori danno risultati molto vicini, ma non identici: EPANET arrotonda il valore che usa per la gravità, quindi le sue perdite concentrate (locali) risultano circa lo 0,08% più basse rispetto al risolutore integrato, e con la scabrezza di Manning la sua perdita di carico risulta circa lo 0,6% più bassa. La prima volta che spunti questa casella, vengono scaricati circa 650 KB, che restano poi conservati su questo dispositivo.';
$ec_lang['lpn_engine_loading']='Caricamento del risolutore EPANET…';
$ec_lang['lpn_engine_failed']='Impossibile caricare il risolutore EPANET. Viene mostrato il risolutore integrato.';
$ec_lang['lpn_engine_manning_note']='Nota: con la scabrezza di Manning, EPANET calcola una perdita di carico di circa lo 0,6% più bassa rispetto al risolutore integrato.';
$ec_lang['lpn_settings_text_size']='Dimensione del testo (pixel)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Dimensione dei simboli (pixel)';
$ec_lang['lpn_settings_link_width']='Spessore della linea delle tubazioni (pixel)';
$ec_lang['lpn_settings_align_labels']='Allinea le etichette delle tubazioni alle tubazioni';
$ec_lang['lpn_settings_readability_bias']='Gradi a sinistra della verticale prima che un\'etichetta venga capovolta';
$ec_lang['lpn_settings_readability_bias_tip']='Capovolge un\'etichetta per mantenerla dritta quando è inclinata più di questi gradi a sinistra della verticale.';
$ec_lang['lpn_settings_mask_labels']='Sfondo pieno dietro le etichette';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Opacità dei simboli (da 0 a 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Opacità dell\'immagine di sfondo (da 0 a 1)';
$ec_lang['lpn_settings_map_display']='Aspetto della mappa';
$ec_lang['lpn_settings_map_height_px']='Altezza della mappa (pixel dello schermo)';
// The cap in applyMapHeight() makes this field look ignored on a phone (ROADMAP Task 146.08's
// own note). It is a render cap, not a stored value -- say so instead of leaving the user to guess.
$ec_lang['lpn_settings_map_height_tip']='Su uno schermo piccolo la mappa viene disegnata più bassa di questo valore, così una parte della pagina resta sempre scorrevole.';
$ec_lang['lpn_settings_legend_position']='Posizione della legenda';
$ec_lang['lpn_settings_legend_top_left']='In alto a sinistra';
$ec_lang['lpn_settings_legend_top_right']='In alto a destra';
$ec_lang['lpn_settings_legend_middle_left']='Al centro a sinistra';
$ec_lang['lpn_settings_legend_middle_right']='Al centro a destra';
$ec_lang['lpn_settings_legend_bottom_left']='In basso a sinistra';
$ec_lang['lpn_settings_legend_bottom_right']='In basso a destra';
$ec_lang['lpn_settings_colors']='Colore in base al valore';
$ec_lang['lpn_settings_color_node_field']='Colore dei nodi';
$ec_lang['lpn_settings_color_link_field']='Colore delle tubazioni';
$ec_lang['lpn_settings_color_ramp']='Schema di colori';
$ec_lang['lpn_color_ramp_epanet']='Da blu a rosso (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Da viola a giallo (più facile distinguere un colore dall\'altro)';
$ec_lang['lpn_color_ramp_gray']='Da grigio chiaro a grigio scuro';
$ec_lang['lpn_settings_color_reverse']='Inverti l\'ordine dei colori';
$ec_lang['lpn_color_none']='Nessun colore';
$ec_lang['lpn_settings_color_thematic']='Mappa tematica: solo colori, senza etichette';
$ec_lang['lpn_settings_color_thematic_tip']='Nasconde ogni etichetta, così sulla mappa restano solo i colori. Le tue scelte di etichette vengono conservate, e disattivando questa opzione ricompaiono.';
$ec_lang['lpn_settings_color_key_position']='Posizione della legenda dei colori';
$ec_lang['lpn_settings_color_breaks']='Limiti delle fasce di colore';
$ec_lang['lpn_settings_color_equal_intervals']='Intervalli uguali';
$ec_lang['lpn_settings_color_equal_counts']='Conteggi uguali';
$ec_lang['lpn_settings_color_auto']='Automatico';
$ec_lang['lpn_settings_color_no_values']='Non ci sono ancora valori da cui partire. Risolvi prima la rete.';
$ec_lang['lpn_confirm_restore_defaults']='Ripristinare tutte le impostazioni (prefissi degli ID, valori iniziali, impostazioni del risolutore, aspetto della mappa, posizione della legenda ed etichette visibili) ai valori originali? La tua rete non viene modificata. Le impostazioni appartengono al progetto aperto, quindi gli altri progetti conservano le proprie.';
$ec_lang['lpn_settings_wipe_btn']='Cancella tutto su questa pagina';
$ec_lang['lpn_confirm_wipe']='Eliminare TUTTO ciò che è salvato per questa pagina — ogni progetto, ogni immagine di sfondo, tutte le impostazioni e le tue scelte di unità di misura — e ricaricare la pagina come la vedrebbe un visitatore alla primissima visita? Questa azione non può essere annullata.';
$ec_lang['lpn_tool_add_tank']='Vasca';
$ec_lang['lpn_tool_add_valve']='Valvola';
$ec_lang['lpn_tank_elev_tip']='Quota del fondo della vasca. Le profondità dell\'acqua nella vasca sono misurate a partire da qui.';
$ec_lang['lpn_field_tank_level']='Profondità dell\'acqua';
$ec_lang['lpn_field_tank_level_tip']='Profondità dell\'acqua presente nella vasca, misurata a partire dal fondo della vasca. La superficie dell\'acqua è la quota del fondo della vasca più questa profondità.';
$ec_lang['lpn_field_tank_minlevel']='Profondità minima dell\'acqua';
$ec_lang['lpn_field_tank_minlevel_tip']='Profondità dell\'acqua alla quale la vasca è considerata vuota, misurata a partire dal fondo della vasca.';
$ec_lang['lpn_field_tank_maxlevel']='Profondità massima dell\'acqua';
$ec_lang['lpn_field_tank_maxlevel_tip']='Profondità dell\'acqua alla quale la vasca è piena, misurata a partire dal fondo della vasca.';
$ec_lang['lpn_field_tank_diameter']='Diametro della vasca';
$ec_lang['lpn_field_tank_diameter_tip']='Larghezza della vasca da un lato all\'altro. È espressa nelle stesse unità della quota, non in quelle del diametro delle tubazioni. Determina quanta acqua contiene una data profondità.';
$ec_lang['lpn_tank_head_tip']='Quota della superficie dell\'acqua nella vasca: la quota del fondo della vasca più la profondità dell\'acqua. È il livello che il risolutore utilizza per la vasca.';
$ec_lang['lpn_inp_drop_tank_curve']='Queste vasche non hanno pareti verticali: il file ne definisce la forma tramite una curva. Sono state importate come vasche cilindriche, ciascuna con il diametro indicato nel file. La superficie dell\'acqua resta quella impostata dal file, quindi i risultati coincidono; è solo la forma a essere semplificata.';
$ec_lang['lpn_inp_drop_valve_active']='Queste valvole controllano la pressione o la portata e si aprono e si chiudono da sole al variare dell\'acqua. Nulla di esse è andato perso in fase di importazione: questa pagina le risolve con il risolutore EPANET, attivandolo automaticamente per questa rete.';
$ec_lang['lpn_diag_valve_needs_epanet']='Queste valvole si aprono e si chiudono da sole, e solo il risolutore EPANET è in grado di calcolarle. Non è stato possibile caricare il risolutore EPANET, quindi questi risultati mancano:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Queste valvole sono collegate direttamente a un serbatoio o a una vasca, che già fissa lì il livello dell\'acqua, quindi non resta nulla da controllare per la valvola. Inserire un breve tratto di tubazione tra la valvola e il serbatoio o la vasca:';
$ec_lang['lpn_field_valve_type']='Tipo di valvola';
$ec_lang['lpn_field_valve_type_tip']='Che cosa fa la valvola. Una valvola di laminazione mantiene una perdita fissa. Le altre tre mantengono una pressione o una portata, e si aprono completamente, si chiudono o si chiudono parzialmente al variare dell\'acqua. Cambiando il tipo, il valore di impostazione qui sotto viene riportato a un nuovo valore iniziale, perché una pressione non è una portata e nessuna delle due è un coefficiente di perdita.';
$ec_lang['lpn_valve_type_tcv']='Di laminazione (TCV)';
$ec_lang['lpn_valve_type_prv']='Riduttrice di pressione (PRV)';
$ec_lang['lpn_valve_type_psv']='Sostenitrice di pressione (PSV)';
$ec_lang['lpn_valve_type_fcv']='Regolatrice di portata (FCV)';
$ec_lang['lpn_field_valve_setting_pressure']='Impostazione di pressione';
$ec_lang['lpn_field_valve_setting_pressure_tip']='La pressione che la valvola mantiene. Una valvola riduttrice di pressione mantiene la pressione a valle a un valore pari o inferiore a questo. Una valvola sostenitrice di pressione mantiene la pressione a monte a un valore pari o superiore a questo.';
$ec_lang['lpn_field_valve_setting_flow']='Impostazione di portata';
$ec_lang['lpn_field_valve_setting_flow_tip']='La massima quantità d\'acqua che la valvola lascia passare. Quando la portata richiesta è inferiore a questo valore, la valvola resta completamente aperta e non introduce alcuna perdita.';
$ec_lang['lpn_field_valve_setting_loss']='Coefficiente di perdita';
$ec_lang['lpn_field_valve_setting_loss_tip']='Quanto carico toglie la valvola di laminazione, espresso come multiplo del carico cinetico. Usare 0 per una valvola completamente aperta. Questo unico numero rappresenta l\'intera perdita della valvola di laminazione.';
$ec_lang['lpn_field_valve_diameter_tip']='Larghezza dell\'apertura della valvola. La velocità dell\'acqua attraverso la valvola è calcolata da questa larghezza, e la perdita deriva da quella velocità.';
$ec_lang['lpn_field_valve_km_tip']='Perdita dovuta al corpo della valvola quando è completamente aperta, in aggiunta a quanto toglie l\'impostazione della valvola. È espressa come multiplo del carico cinetico. Usare 0 per ignorarla.';
$ec_lang['lpn_mode_add_tank']='Modalità: Aggiungi vasca. Fai clic sulla mappa per posizionare una vasca. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
$ec_lang['lpn_mode_add_valve']='Modalità: Aggiungi valvola. Fai clic su un nodo, poi su un altro nodo, per collegarli. Passa alla modalità Seleziona per modificare o spostare elementi ed etichette.';
$ec_lang['lpn_method_switch_confirm']='Cambiare il metodo di attrito non modifica i valori di scabrezza già inseriti nelle tubazioni, e un valore di scabrezza per un metodo non ha senso per un altro. Controllare ogni tubazione dopo questa modifica. Cambiare comunque?';
$ec_lang['lpn_field_closed']='Chiusa';
$ec_lang['lpn_field_closed_tip']='Chiude questa tubazione in modo che l\'acqua non possa più passarvi. La tubazione resta sulla mappa e mantiene tutti i suoi valori, e può essere riaperta in qualsiasi momento.';
$ec_lang['lpn_scenario_label']='Scenario';
$ec_lang['lpn_scenario_base']='Base';
$ec_lang['lpn_scenario_overrides']='Valori personalizzati';
$ec_lang['lpn_scenario_tip']='L\'insieme di valori che il disegno sta mostrando e che la pagina sta risolvendo in questo momento. Fai clic per cambiare scenario, oppure per aggiungerne, rinominarne o eliminarne uno.';
$ec_lang['lpn_scenario_new']='Nuovo scenario…';
$ec_lang['lpn_scenario_new_name']='Scenario {n}';
$ec_lang['lpn_scenario_prompt_name']='Nome per questo scenario';
$ec_lang['lpn_scenario_rename']='Rinomina scenario…';
$ec_lang['lpn_scenario_delete']='Elimina scenario';
$ec_lang['lpn_scenario_delete_confirm']='Eliminare lo scenario {name} e i {n} valori che appartengono solo ad esso? Il disegno stesso non viene modificato.';
$ec_lang['lpn_scenario_override']='Solo in questo scenario';
$ec_lang['lpn_scenario_override_tip']='Selezionata significa che questo valore appartiene solo a questo scenario, anche quando è uguale al valore di Base. Deseleziona la casella per usare di nuovo il valore di Base.';
$ec_lang['lpn_scenario_base_value']='Scenario base: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} è escluso dalla rete in {scenario}. Rimane comunque nel disegno e negli altri scenari.';
$ec_lang['lpn_scenario_push_btn']='Applica i valori di Base a tutti gli scenari';
$ec_lang['lpn_scenario_push_tip']='Ogni scenario torna al valore di Base per le proprietà le cui etichette sono mostrate in questo momento. I valori che appartengono solo a quegli scenari vengono eliminati.';
$ec_lang['lpn_scenario_push_confirm']='Far usare a tutti gli scenari i valori di Base per queste proprietà? I valori che appartengono solo a quegli scenari vengono eliminati. Puoi annullare questa azione.';
$ec_lang['lpn_scenario_push_scenarios']='Scenari coinvolti:';
$ec_lang['lpn_scenario_push_values']='Valori eliminati:';
$ec_lang['lpn_scenario_push_none']='Nessuno scenario ha un valore personalizzato per queste proprietà, quindi non cambierebbe nulla. Non viene eliminato nulla.';
$ec_lang['lpn_delete_drops_overrides']='Eliminare questo elemento elimina anche i {n} valori che i tuoi scenari mantengono per esso. Continuare?';
$ec_lang['lpn_push_base_only']='Questa azione modifica il disegno stesso, quindi può essere eseguita solo in {base}. Passa a {base} e riprova.';
$ec_lang['lpn_field_active']='Parte di questa rete';
$ec_lang['lpn_field_active_tip']='Deseleziona questa casella per lasciare l\'elemento nel disegno ma fuori dalla rete: viene disegnato in grigio e il risolutore lo ignora. In uno scenario è così che una tubazione proposta viene attivata e disattivata.';
$ec_lang['lpn_engine_valve_route']='Risolto con il risolutore EPANET, perché queste valvole si aprono e si chiudono da sole:';
$ec_lang['lpn_unit_unknown']='Questo disegno indica un\'unità che questa pagina non offre: {unit}. Tutto viene conservato e mostrato esattamente come è arrivato, e nulla è stato modificato. Non è possibile fornire risultati finché questa pagina non conosce quell\'unità, perché non c\'è modo di sapere quanto vale.';
$ec_lang['lpn_field_text_align']='Allineamento orizzontale';
$ec_lang['lpn_field_text_align_left']='Sinistra';
$ec_lang['lpn_field_text_align_center']='Centro';
$ec_lang['lpn_field_text_align_right']='Destra';
$ec_lang['lpn_field_text_valign']='Allineamento verticale';
$ec_lang['lpn_field_text_valign_top']='Alto';
$ec_lang['lpn_field_text_valign_middle']='Centro';
$ec_lang['lpn_field_text_valign_bottom']='Basso';
$ec_lang['lpn_examples_welcome']='Benvenuto nella modellazione delle reti di distribuzione idrica, con il risolutore EPANET';
$ec_lang['lpn_examples_close']='Chiudi';
$ec_lang['lpn_units_warn_title']='Questa unità decide che cosa significano i tuoi numeri';
$ec_lang['lpn_units_warn_body']='{unit} è l\'unità di ciò che inserisci per: {list}. Reinterpreta lascia ogni numero così com\'è e lo legge nella nuova unità. Converti tutti riscrive ognuno di quei numeri, in modo che la rete copra la stessa estensione di prima.';
$ec_lang['lpn_units_reinterpret']='Reinterpreta (cambia il loro significato)';
$ec_lang['lpn_units_convert']='Converti tutti';
$ec_lang['lpn_status_reinterpreted']='{n} valori ora significano {unit}. Nulla è stato riscritto.';
$ec_lang['lpn_status_converted']='{n} valori sono stati riscritti in {unit}.';
$ec_lang['lpn_tool_color_tip']='Colora la rete in base a una grandezza, così una mappa grande si può leggere a colpo d\'occhio. Pressione e velocità sono le due che di solito contano di più.';
$ec_lang['lpn_units_group_inputs']='Unità di immissione';
$ec_lang['lpn_units_group_results']='Unità dei risultati';
$ec_lang['lpn_basemap_show']='Mostra mappa stradale';
$ec_lang['lpn_basemap_hide']='Nascondi mappa stradale';
$ec_lang['lpn_basemap_tip']='Immagini della mappa stradale da OpenStreetMap, scaricate da internet mentre sposti e ingrandisci la vista. La tua rete viene disegnata sia che la mappa stradale sia visibile sia che non lo sia.';
$ec_lang['lpn_geomap']='lat/lon';
$ec_lang['lpn_xymap']='xy';
$ec_lang['lpn_file_import_geo']='Converti in lat/lon…';
$ec_lang['lpn_file_import_geo_tip']='Da una griglia locale al mondo reale. Colloca un disegno fatto sulla griglia xy su coordinate geografiche, così si posiziona sulla mappa stradale dove appartiene. Ogni numero che hai digitato resta com\'è: solo la X e la Y diventano una longitudine e una latitudine.';
$ec_lang['lpn_georef_intro']='Convertire questo progetto xy in un progetto geografico? Il tuo progetto è stato collocato al centro di una mappa del mondo. Ingrandisci fino alla tua posizione e sposta, ridimensiona e ruota il modello quanto vuoi. Quando sei pronto a iniziare a modificare gli elementi, premi Mantieni questo posizionamento.';
$ec_lang['lpn_georef_adjust']='Trascina il modello per spostarlo, trascina un angolo per ridimensionarlo, trascina la maniglia rotonda sopra il modello per ruotarlo. Oppure digita la scala e la rotazione qui sotto.';
$ec_lang['lpn_georef_step1']='Passaggio 1 di 2 — scollegato';
$ec_lang['lpn_georef_step2']='Passaggio 2 di 2 — collegato';
$ec_lang['lpn_georef_step1_hint']='Il tuo progetto resta dov\'è sullo schermo. Sposta e ingrandisci la mappa sottostante finché il terreno dietro di esso non è all\'incirca nel posto giusto e all\'incirca della dimensione giusta, poi premi Colloca il modello qui.';
$ec_lang['lpn_georef_detach']='Riprendilo';
$ec_lang['lpn_georef_size_prompt']='All\'incirca quanto è largo il sito, per l\'intero progetto?';
$ec_lang['lpn_tip_join']='{name}: {tip}';
$ec_lang['lpn_tool_add_junction_tip']='Fai clic sulla mappa per aggiungere un nodo: un punto dove le tubazioni si incontrano o dove l\'acqua viene utilizzata.';
$ec_lang['lpn_tool_add_reservoir_tip']='Fai clic sulla mappa per aggiungere un serbatoio: una fonte che mantiene un livello dell\'acqua fisso.';
$ec_lang['lpn_tool_add_tank_tip']='Fai clic sulla mappa per aggiungere una vasca: un accumulo con una superficie dell\'acqua che imposti tu.';
$ec_lang['lpn_tool_add_pipe_tip']='Fai clic su un nodo e poi su un altro per disegnare una tubazione tra di essi.';
$ec_lang['lpn_tool_add_pump_tip']='Fai clic su un nodo e poi su un altro per inserire una pompa tra di essi.';
$ec_lang['lpn_tool_add_valve_tip']='Fai clic su un nodo e poi su un altro per inserire una valvola tra di essi.';
$ec_lang['lpn_tool_add_text_tip']='Fai clic sulla mappa per scrivere una nota sul disegno.';
$ec_lang['lpn_tool_delete_tip']='Fai clic su qualsiasi cosa sulla mappa per rimuoverla.';
$ec_lang['lpn_tool_undo_tip']='Annulla l\'ultima modifica.';
$ec_lang['lpn_tool_zoom_extent_tip']='Adatta l\'intera rete alla finestra.';
$ec_lang['lpn_tool_settings_tip']='Apri le impostazioni di questo progetto.';
$ec_lang['lpn_find_menu_tip']='Trova un elemento tramite il suo ID, oppure trova ogni elemento che soddisfa una condizione.';
$ec_lang['lpn_help_icons']='Che cosa significano le icone della barra degli strumenti';
$ec_lang['lpn_pane_right_toggle']='Visibilità';
$ec_lang['lpn_pane_right_toggle_tip']='Mostra o nascondi il pannello a destra della mappa. Contiene le scelte di etichette e colori.';
$ec_lang['lpn_color_legend_open_tip']='Fai clic per aprire il pannello Visibilità e cambiare questi colori.';
$ec_lang['lpn_color_node_field']='Colora i nodi in base a';
$ec_lang['lpn_color_link_field']='Colora le tubazioni in base a';
$ec_lang['lpn_color_ramp_sequential']='Sequenziale';
$ec_lang['lpn_color_ramp_diverging']='Divergente';
$ec_lang['lpn_settings_color_classes']='Numero di fasce';
$ec_lang['lpn_color_mode']='Assegnazione delle fasce';
$ec_lang['lpn_color_ranges_note']='La modalità qui sopra imposta questi limiti in base ai valori ora presenti sulla mappa. Digitali sopra e lo stesso numero corrisponderà sempre allo stesso colore.';
$ec_lang['lpn_color_criterion_note']='I limiti delle fasce provengono da uno standard di progetto, quindi il numero di fasce resta fisso finché è scelta questa modalità.';
$ec_lang['lpn_color_break_number']='Un limite di fascia deve essere un numero. La mappa non è cambiata.';
$ec_lang['lpn_color_break_order']='Ogni limite di fascia deve essere maggiore di quello precedente. La mappa non è cambiata.';
$ec_lang['lpn_color_break_count']='Ci deve essere un limite in meno rispetto al numero di fasce. La mappa non è cambiata.';
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
$ec_lang['lpn_georef_scale_tip']='Quanto lontano arriva sul terreno un\'unità del tuo disegno. Un disegno fatto su una griglia semplice di solito non dice nulla su questo, quindi impostalo qui — oppure lascia che Vai a… ti chieda quanto è largo il sito e lo calcoli lui.';
$ec_lang['lpn_georef_rotation']='Rotazione antioraria (gradi)';
$ec_lang['lpn_georef_rotation_tip']='Di quanto ruotare l\'intero modello, in senso antiorario, affinché il suo nord punti verso nord.';
$ec_lang['lpn_georef_confirm']='Collocare il modello qui in modo permanente? Potrai ancora trascinare i singoli elementi in seguito, ma il disegno smette di essere un progetto xy. Per riavere l\'xy, chiudi questo progetto senza salvare.';
$ec_lang['lpn_georef_done']='Ora questo è un progetto lat/lon. Trascina un qualsiasi elemento per avvicinarlo a dove si trova realmente.';
$ec_lang['lpn_georef_on_map']='Questo progetto è già su lat/lon.';
$ec_lang['lpn_georef_empty']='Disegna o apri prima una rete. Non c\'è ancora nulla da collocare.';
$ec_lang['lpn_georef_unavailable']='Lo strumento di posizionamento non si è caricato. Ricarica la pagina e riprova.';
$ec_lang['lpn_goto_menu']='Vai a una latitudine e longitudine…';
$ec_lang['lpn_goto_tip']='Sposta la mappa in un luogo di cui hai già le coordinate. Prima la latitudine, poi la longitudine, come le fornisce una mappa, con uno spazio tra loro: 38 -122';
$ec_lang['lpn_goto_prompt']='Latitudine e longitudine, in quest\'ordine';
$ec_lang['lpn_goto_bad']='Questa non è una latitudine e una longitudine. Prova 38 -122, con uno spazio tra loro.';
$ec_lang['lpn_georef_goto']='Vai a…';
$ec_lang['lpn_pane_toggle']='Pannello inferiore';
$ec_lang['lpn_pane_toggle_tip']='Mostra o nascondi il pannello sotto la mappa. Contiene il profilo e la tabella dei nodi.';
$ec_lang['lpn_pane_resize']='Trascina per rendere il pannello più alto o più basso';
$ec_lang['lpn_pane_tab_junctions']='Nodi';
$ec_lang['lpn_pane_tab_tip']='Ogni nodo in una tabella che puoi ordinare e modificare.';
$ec_lang['lpn_pane_none']='Questa rete non ha ancora nodi.';
$ec_lang['lpn_pane_sort_tip']='Ordina in base a questa colonna. Fai clic di nuovo per invertire l\'ordine.';
$ec_lang['lpn_clean_map']='Nascondi le indicazioni sulla mappa';
$ec_lang['lpn_clean_map_off']='Mostra le indicazioni sulla mappa';
$ec_lang['lpn_clean_map_tip']='Nascondi la riga della modalità e l\'indicazione delle coordinate, così una schermata mostra solo la mappa. Il tuo disegno non viene toccato, e questa scelta non viene salvata: ricaricando la pagina le indicazioni ricompaiono.';
$ec_lang['lpn_find_menu']='Trova';
$ec_lang['lpn_find_title']='Trova elementi';
$ec_lang['lpn_find_scope']='Cosa cercare';
$ec_lang['lpn_find_scope_all']='Tutto';
$ec_lang['lpn_find_property']='Proprietà';
$ec_lang['lpn_find_condition']='Condizione';
$ec_lang['lpn_find_value']='Valore';
$ec_lang['lpn_find_button']='Trova';
$ec_lang['lpn_find_op_contains']='contiene';
$ec_lang['lpn_find_op_equals']='uguale a';
$ec_lang['lpn_find_op_gt']='maggiore di';
$ec_lang['lpn_find_op_lt']='minore di';
$ec_lang['lpn_find_count']='{n} trovati. Fai clic su uno per andarci.';
$ec_lang['lpn_find_none']='Nessuna corrispondenza.';
$ec_lang['lpn_find_op_top']='N più alti';
$ec_lang['lpn_find_op_bottom']='N più bassi';
$ec_lang['lpn_find_adjacent']='Collegati';
$ec_lang['lpn_find_no_value']='Digita che cosa cercare.';
$ec_lang['lpn_profile_menu']='Profilo';
$ec_lang['lpn_profile_tip']='Disegna il terreno e la linea dei carichi piezometrici lungo un percorso attraverso la rete.';
$ec_lang['lpn_profile_title']='Profilo lungo un percorso';
$ec_lang['lpn_profile_from']='Da';
$ec_lang['lpn_profile_to']='A';
$ec_lang['lpn_profile_pick']='Aggiungi nodi al percorso facendo clic su di essi sulla mappa';
$ec_lang['lpn_profile_through']='Nodi lungo il percorso';
$ec_lang['lpn_profile_clear']='Rimuovi tutto';
$ec_lang['lpn_profile_choose']='Scegli un nodo di partenza e un nodo di arrivo.';
$ec_lang['lpn_profile_no_path']='Questi due nodi non sono collegati da alcun percorso.';
$ec_lang['lpn_profile_no_solve']='Non ci sono ancora risultati, quindi viene disegnata solo la linea del terreno.';
$ec_lang['lpn_profile_summary']='Nodi: {n}, lunghezza: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Distanza lungo il percorso ({u})';
$ec_lang['lpn_profile_axis_elev']='Quota e carico ({u})';
$ec_lang['lpn_profile_ground']='Superficie del terreno';
$ec_lang['lpn_profile_hgl']='Linea dei carichi piezometrici';
$ec_lang['lpn_new_geo_us']='Progetto lat/lon vuoto, unità USA (gpm)';
$ec_lang['lpn_new_geo_si']='Progetto lat/lon vuoto, unità SI (l/s)';
$ec_lang['lpn_file_export_inp']='Esporta file EPANET…';
$ec_lang['lpn_file_export_inp_tip']='Scrivi questa rete come file EPANET .inp e scaricalo. I numeri che hai digitato vengono scritti esattamente come li hai digitati. Tutto ciò che il formato .inp non può contenere ti viene elencato in seguito.';
$ec_lang['lpn_status_inp_exported']='Esportato {file}.';
$ec_lang['lpn_inp_export_differences']='{n} cose che il formato .inp non può contenere.';
$ec_lang['lpn_inp_export_refused']='Questo progetto non può essere scritto come file EPANET: {detail}';
$ec_lang['lpn_inp_drop_demand_pattern']='Questi nodi variano la loro richiesta nel corso della giornata. I loro modelli temporali sono stati importati per intero, e la richiesta che vedi è quella relativa al momento indicato dall\'orologio.';
$ec_lang['lpn_valve_type_pbv']='Rompitratta di pressione (PBV)';
$ec_lang['lpn_valve_type_gpv']='Generica (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Caduta di pressione';
$ec_lang['lpn_field_valve_setting_drop_tip']='La pressione che la valvola toglie. Una valvola rompitratta toglie sempre esattamente questa quantità di pressione, qualunque sia il verso in cui scorre l\'acqua. È una caduta attraverso la valvola, non una pressione da mantenere.';
$ec_lang['lpn_inp_drop_gpv_curve']='Questa valvola indica una curva di perdita di carico che non è nel file. La valvola è stata importata senza curva, quindi resta aperta finché non gliene assegni una.';
$ec_lang['lpn_gpv_curve_note']='Fino a tre punti di portata e la perdita di carico a quella portata. Lasciali vuoti e la valvola resta completamente aperta.';
$ec_lang['lpn_select_first']='Non è selezionato nulla. Fai prima clic su un elemento sulla mappa, poi premi Elimina.';
$ec_lang['lpn_field_lon']='Longitudine';
$ec_lang['lpn_field_lat']='Latitudine';
$ec_lang['lpn_engine_minor_loss_note']='Nota: con il risolutore EPANET, le perdite concentrate (locali) risultano leggermente più basse rispetto al risolutore integrato, perché EPANET arrotonda il valore che usa per la gravità.';
$ec_lang['template_share_manual']='Copia questo link:';
$ec_lang['lpn_time_menu']='Tempo';
$ec_lang['lpn_time_menu_tip']='Imposta per quanto tempo gira questa rete, e scorrila momento per momento.';
$ec_lang['lpn_time_duration']='Durata totale della simulazione';
$ec_lang['lpn_time_hyd_step']='Passo temporale idraulico';
$ec_lang['lpn_time_pattern_step']='Passo temporale del modello';
$ec_lang['lpn_time_pattern_start']='Ora di inizio del modello';
$ec_lang['lpn_time_report_step']='Passo temporale dei risultati';
$ec_lang['lpn_time_report_start']='Ora di inizio dei risultati';
$ec_lang['lpn_time_clock_start']='Orario di inizio';
$ec_lang['lpn_time_format_tip']='Scrivi un orario come ore e minuti, ad esempio 2:30. Un numero semplice indica le ore, quindi 8 significa otto ore. Mezz\'ora è 0:30.';
$ec_lang['lpn_time_running']='Calcolo dell\'intero periodo con il risolutore EPANET in corso.';
$ec_lang['lpn_time_no_engine']='Il risolutore integrato calcola un solo momento alla volta, quindi questa è la rete solo a {time}: le richieste portano i moltiplicatori del modello di quel momento, e ogni vasca resta comunque al proprio livello iniziale invece di riempirsi e svuotarsi. Connettiti a internet una volta per scaricare il risolutore EPANET, che calcola l\'intero periodo.';
$ec_lang['lpn_time_slider']='Tempo';
$ec_lang['lpn_time_no_period']='Questo progetto non ha un periodo di tempo, quindi c\'è un solo momento da mostrare. Imposta una Durata totale in Impostazioni per calcolare la rete nel tempo.';
$ec_lang['lpn_time_first']='Vai all\'inizio';
$ec_lang['lpn_time_prev']='Passo indietro';
$ec_lang['lpn_time_play']='Riproduci';
$ec_lang['lpn_time_pause']='Pausa';
$ec_lang['lpn_time_next']='Passo avanti';
$ec_lang['lpn_time_last']='Vai alla fine';
$ec_lang['lpn_time_tank']='Vasca';
$ec_lang['lpn_time_level']='Livello dell\'acqua';
$ec_lang['lpn_time_run']='Calcola';
$ec_lang['lpn_time_run_tip']='Calcola questa rete a ognuno dei suoi orari di riferimento, dal primo all\'ultimo.';
$ec_lang['lpn_time_run_note']='Stai vedendo la rete al primo orario di riferimento. Il calcolo di questa rete sull\'intero periodo di tempo richiede così tanto che i risultati per gli orari successivi non vengono aggiornati mentre lavori. Premi Calcola per aggiornarli.';
$ec_lang['lpn_time_speed']='Velocità';
$ec_lang['lpn_time_speed_tip']='Con quale velocità viene riprodotta la simulazione.';
$ec_lang['lpn_settings_search']='Cerca nelle impostazioni';
$ec_lang['lpn_settings_search_tip']='Digita una parola per vedere solo le impostazioni che la menzionano. Vengono cercate anche le spiegazioni, non solo i nomi.';
$ec_lang['lpn_settings_no_match']='Nessuna impostazione menziona quella parola.';
$ec_lang['lpn_rpane_empty']='Non c\'è ancora nulla ancorato qui. Tutto ciò che appartiene all\'intero progetto si trova in Impostazioni.';
$ec_lang['lpn_time_settings_open']='Impostazioni del tempo';
$ec_lang['lpn_settings_sec_visualization']='Visualizzazione';
$ec_lang['lpn_settings_sec_map']='Mappa e pagina';
$ec_lang['lpn_settings_sec_elements']='Nuovi elementi';
$ec_lang['lpn_settings_sec_calculation']='Calcolo';
$ec_lang['lpn_settings_node_symbology']='Simbologia dei nodi';
$ec_lang['lpn_settings_link_symbology']='Simbologia dei collegamenti';
$ec_lang['lpn_settings_page']='Pagina';
$ec_lang['lpn_settings_page_note']='Salvato in questo calcolatore, non nel progetto.';
$ec_lang['lpn_settings_hydraulics']='Idraulica';
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_rank']='Posizione';
$ec_lang['lpn_labels_col_drop']='Scarto';
$ec_lang['lpn_settings_node_link']='Nodo e collegamento';
$ec_lang['lpn_color_mode_equal']='Intervallo uguale';
$ec_lang['lpn_color_mode_quantile']='Quantile (conteggio uguale)';
$ec_lang['lpn_color_mode_jenks']='Interruzioni naturali (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Deviazione standard';
$ec_lang['lpn_color_mode_pretty']='Arrotondato';
$ec_lang['lpn_color_mode_log']='Logaritmico';
$ec_lang['lpn_color_mode_pressure']='Pressione';
