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
$ec_lang['menu_more']='Altro';
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
$ec_lang['consent_decline']='Rifiuta';
$ec_lang['consent_current_granted']='Hai acconsentito. Limitiamo la registrazione per questo profilo del browser.';
$ec_lang['consent_current_denied']='Hai rifiutato. Non conserviamo nulla per limitare la registrazione per questo profilo del browser.';
$ec_lang['consent_region_label']='La tua scelta sulla limitazione della registrazione.';
$ec_lang['consent_settings_link']='Impostazioni cookie';
$ec_lang['privacy_link']='Informativa sulla privacy';
$ec_lang['terms_link']='Termini di utilizzo';
$ec_lang['index_title']='Calcolatori ingegneristici gratuiti online';
$ec_lang['index_meta_desc_plain']='Calcolatori gratuiti di ingegneria idraulica per tubazioni, canali, stramazzi e irrigazione. Funzionano nel browser, anche offline, e sono disponibili in 27 lingue.';
$ec_lang['calc_set_units']='Imposta unità:';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Ripristina predefiniti';
$ec_lang['calc_defaults_confirm']='Ripristinare il calcolatore ai valori predefiniti originali?';
$ec_lang['points_data_help']='(o Copia/Incolla usando l\'area dati)';
$ec_lang['points_data_title']='Dati punti<br />(separati da virgola o tabulazione)';
$ec_lang['points_data_copy']='Copia';
$ec_lang['points_data_paste']='Incolla';
$ec_lang['calc_inputs']='Dati di input';
$ec_lang['calc_results']='Risultati';
$ec_lang['view_hide_line']='[Nascondi questa riga]';
$ec_lang['view_printable']='Versione stampabile (ricaricare per ripristinare)';
$ec_lang['ec_name_label']='Salva questo calcolo:';
$ec_lang['ec_name_placeholder']='Nome';
$ec_lang['ec_name_hint']='Salva questi dati inseriti nell\'URL per segnalibri, recupero della cronologia e condivisione';
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
$ec_lang['mi_d50in']='Diam.<br />mediano<br />rivestim.';
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
$ec_lang['mtc_d50_mra']='Dimensione roccia angolare richiesta, D<sub>50</sub> (Maynord, Ruff, e Abt 1989)';
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
$ec_lang['contact_title']='Contatti HawsEDC';
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
$ec_lang['ip_reach_table_title']='Percorso di prova';
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
$ec_lang['bpn_line_table_title']='Tratti di tubazione';
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
$ec_lang['bpn_sketch_title']='Schema della rete';
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
$ec_lang['lpn_empty_hint']='Inizia aggiungendo un\'immagine di sfondo o un serbatoio dalla barra degli strumenti, oppure apri File, Nuovo progetto per partire da un esempio.';
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
$ec_lang['lpn_v2_restore_prompt']='Questo calcolatore conserva le unità e i dati del progetto così come sono stati inseriti, ma in precedenza convertiva i numeri in unità SI per la memorizzazione. Questo progetto è stato salvato prima di quel cambiamento, quindi i suoi numeri sono memorizzati in SI. Convertirli un\'ultima volta nelle unità attuali? Per aiutarti a decidere, ecco alcuni diametri che verrebbero convertiti, con i valori prima e dopo:';
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
$ec_lang['lpn_new_blank_us']='Progetto vuoto, unità USA (gpm)';
$ec_lang['lpn_new_blank_si']='Progetto vuoto, unità SI (l/s)';
$ec_lang['lpn_new_from_examples']='Dagli esempi';
// The flow unit is IN the label, not left implied by "US"/"SI": gpm and l/s are what a water
// engineer recognises at a glance, and this is the moment the choice is being made.
$ec_lang['lpn_new_example_us']='Rete di base, unità USA (gpm)';
$ec_lang['lpn_new_example_si']='Rete di base, unità SI (l/s)';
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
$ec_lang['lpn_inp_report_counts']='{nodes} nodi e serbatoi, {links} tubazioni e pompe, in {units}.';
$ec_lang['lpn_inp_report_clean']='Tutto il contenuto del file è stato importato. Nulla è stato tralasciato.';
$ec_lang['lpn_inp_report_lead']='Questa pagina non gestisce tutto ciò che gestisce EPANET. Ecco cosa è cambiato durante l\'importazione:';
$ec_lang['lpn_inp_drop_headloss']='Questo file non usa la formula di Hazen-Williams. Questa pagina calcola con Hazen-Williams, quindi i valori di scabrezza delle tubazioni sono stati mantenuti esattamente come scritti, ma i risultati qui non corrisponderanno a quelli di EPANET.';
$ec_lang['lpn_inp_drop_tanks']='I serbatoi di accumulo (vasche) sono stati tralasciati. Questa pagina ha i serbatoi, che mantengono un livello dell\'acqua fisso. Una vasca di accumulo non mantiene un livello fisso, quindi non è un serbatoio.';
$ec_lang['lpn_inp_drop_tank_links']='Queste tubazioni sono state tralasciate perché si collegano a una vasca che è stata tralasciata.';
$ec_lang['lpn_inp_drop_tcv']='Queste valvole di regolazione a strozzamento (TCV) sono state importate come tubazioni molto corte che portano la stessa perdita concentrata. L\'acqua si comporta allo stesso modo; l\'elemento non è lo stesso.';
$ec_lang['lpn_inp_drop_valve']='Queste valvole controllano la pressione o la portata, e questa pagina non ha un elemento di questo tipo. Sono state importate come tubazioni aperte, quindi la rete resta collegata, ma nulla la controlla più.';
$ec_lang['lpn_inp_drop_cv']='In EPANET queste tubazioni lasciano passare l\'acqua in una sola direzione. Sono state importate come tubazioni ordinarie, quindi ora l\'acqua può scorrere in entrambi i sensi.';
$ec_lang['lpn_inp_drop_demands']='Questi nodi avevano più di una richiesta. Le richieste sono state sommate in un\'unica richiesta, come previsto da questa pagina.';
$ec_lang['lpn_inp_drop_patterns']='I modelli temporali di richiesta sono stati tralasciati. Questa pagina risolve un solo istante nel tempo, quindi ogni richiesta è il numero scritto nel file.';
$ec_lang['lpn_inp_drop_emitters']='Questi nodi hanno un coefficiente di erogatore (irrigatore) o di perdita. È stato conservato e viene risolto, ma al momento non c\'è dove vederlo o modificarlo su questa pagina.';
$ec_lang['lpn_inp_drop_curve_long']='Questa curva di pompa aveva più di tre punti. Sono stati conservati il punto più basso, quello centrale e quello più alto, perché questa pagina adatta una curva ad al massimo tre punti.';
$ec_lang['lpn_inp_drop_curve_missing']='Questa pompa fa riferimento a una curva che non è nel file. È stata importata senza curva, quindi non aggiunge carico.';
$ec_lang['lpn_inp_drop_pump_other']='Questa pompa è descritta da potenza, velocità o programma orario, anziché da una curva. È stata importata senza curva, quindi non aggiunge carico.';
$ec_lang['lpn_inp_drop_setting']='Queste tubazioni, pompe e valvole hanno un\'impostazione che questa pagina non può gestire. Sono state importate aperte.';
$ec_lang['lpn_inp_drop_controls']='I controlli e le regole sono stati tralasciati. Ogni tubazione, pompa e valvola è stata importata nello stato scritto nel file, e non cambia.';
$ec_lang['lpn_inp_drop_eps']='Questo file descrive una simulazione che si estende nel tempo. Questa pagina risolve un solo istante, quindi sono state importate solo le condizioni iniziali.';
$ec_lang['lpn_inp_drop_quality']='La qualità dell\'acqua, le reazioni chimiche e le impostazioni di energia delle pompe sono state tralasciate. Questa pagina risolve solo portata e pressione.';
$ec_lang['lpn_inp_drop_backdrop']='Questo file indica un\'immagine di sfondo ma non ne contiene i dati. Aggiungila tu stesso con File, Immagine di sfondo, Aggiungi immagine.';
$ec_lang['lpn_inp_drop_dangling']='Queste tubazioni fanno riferimento a un nodo che non è nel file, quindi sono state tralasciate.';
$ec_lang['lpn_inp_drop_units']='Le unità di portata in questo file non sono state riconosciute, quindi sono stati assunti i galloni al minuto. Controlla ogni numero prima di usare i risultati.';
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
$ec_lang['lpn_close_save_prompt']='Salvare le modifiche a {name} prima di chiuderlo?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_prompt']='{name} è conservato solo in questo browser. Se lo chiudi senza salvarlo su file, andrà perso per sempre.';
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
$ec_lang['lpn_file_reconnect_prompt']='Questo progetto proviene da {file}. Il tuo browser ha bisogno di nuovo del tuo permesso prima di poterci scrivere. Ricollegati qui sotto.';
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
$ec_lang['lpn_notes_1_def']='Risolve un solo insieme di richieste alla volta, usando lo stesso algoritmo del gradiente globale usato da EPANET. Non modella come la rete cambia nel tempo.';
$ec_lang['lpn_notes_2_term']='Non modellato';
$ec_lang['lpn_notes_2_def']='Le vasche, la qualità dell\'acqua e le valvole di controllo che si aprono e chiudono da sole (PRV, PSV, FCV) non sono modellate. Una tubazione può portare una perdita concentrata fissa, ma non una valvola il cui stato aperto o chiuso dipende dalla portata che si sta risolvendo.';
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
$ec_lang['lpn_diag_no_fixed_head']='Aggiungi un serbatoio. La rete ha bisogno di almeno un livello dell\'acqua noto prima di poter essere risolta.';
$ec_lang['lpn_diag_dangling_link']='Una tubazione o una pompa si collega a un nodo che non esiste più:';
$ec_lang['lpn_diag_unreachable']='Questi nodi non hanno un percorso verso un serbatoio:';
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
$ec_lang['lpn_pump_point1']='Punto 1 (obbligatorio)';
$ec_lang['lpn_pump_point2']='Punto 2 (facoltativo)';
$ec_lang['lpn_pump_point3']='Punto 3 (facoltativo)';
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
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Immagine di sfondo…';
$ec_lang['lpn_backdrop_add']='Aggiungi immagine';
// "Scale image" / "Position image" rather than the bare verbs (Tom, 2026-08-04). They read fine
// under the toolbar select's own "Background image..." heading and read as orphans in the Insert
// menu, where nothing above them says what is being scaled. Naming the object costs one word and
// works in both places.
$ec_lang['lpn_backdrop_scale']='Imposta la scala dell\'immagine';
$ec_lang['lpn_backdrop_position']='Sposta immagine';
$ec_lang['lpn_backdrop_remove']='Rimuovi immagine';
$ec_lang['lpn_backdrop_remove_confirm']='Rimuovere l\'immagine di sfondo?';
$ec_lang['lpn_backdrop_scale_prompt1']='Fai clic su due punti dell\'immagine di sfondo, ad esempio i due estremi di una scala grafica. Poi digita la distanza reale tra loro.';
$ec_lang['lpn_backdrop_scale_prompt2']='Distanza reale tra i due punti';
$ec_lang['lpn_backdrop_position_prompt1']='Fai clic su un punto qualsiasi dell\'immagine di sfondo. Questo è il punto che sposterai.';
$ec_lang['lpn_backdrop_position_prompt2']='Scegli dove deve andare quel punto, poi fai clic su Continua.';
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
$ec_lang['lpn_settings_engine_epanet_tip']='Esegue il risolutore EPANET dell\'agenzia statunitense EPA, qui nel tuo browser. Il risolutore integrato dà gli stessi risultati ed è più veloce, quindi lascialo disattivato a meno che tu non abbia bisogno proprio di EPANET.';
$ec_lang['lpn_engine_loading']='Caricamento del risolutore EPANET…';
$ec_lang['lpn_engine_failed']='Impossibile caricare il risolutore EPANET. Viene mostrato il risolutore integrato.';
$ec_lang['lpn_engine_manning_note']='Nota: con la scabrezza di Manning, EPANET calcola una perdita di carico di circa lo 0,6% più bassa rispetto al risolutore integrato.';
$ec_lang['lpn_settings_text_size']='Dimensione del testo';
$ec_lang['lpn_settings_text_size_map']='Distanza sulla mappa';
$ec_lang['lpn_settings_text_size_screen']='Pixel dello schermo';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Dimensione dei simboli (relativa al testo)';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Opacità dei simboli (da 0 a 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Opacità dell\'immagine di sfondo (da 0 a 1)';
$ec_lang['lpn_settings_text_size_units']='Unità della dimensione del testo';
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
$ec_lang['lpn_confirm_restore_defaults']='Ripristinare tutte le impostazioni (prefissi degli ID, valori iniziali, impostazioni del risolutore, aspetto della mappa, posizione della legenda ed etichette visibili) ai valori originali? La tua rete non viene modificata. Le impostazioni appartengono al progetto aperto, quindi gli altri progetti conservano le proprie.';
$ec_lang['lpn_settings_wipe_btn']='Cancella tutto su questa pagina';
$ec_lang['lpn_confirm_wipe']='Eliminare TUTTO ciò che è salvato per questa pagina — ogni progetto, ogni immagine di sfondo, tutte le impostazioni e le tue scelte di unità di misura — e ricaricare la pagina come la vedrebbe un visitatore alla primissima visita? Questa azione non può essere annullata.';
