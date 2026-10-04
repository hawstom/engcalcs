<?php

// äöüÄÖÜß — All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='Anteil';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft WS';
$ec_lang['u_ftps']='ft/s';
$ec_lang['u_gpm']='gal/min';
$ec_lang['u_gradePercent']='% Gefälle';
$ec_lang['u_grade']='Gefälle';
$ec_lang['u_in2']='in^2';
$ec_lang['u_inh2o']='in WS';
$ec_lang['u_in']='in';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='L/s';
$ec_lang['u_m2']='m^2';
$ec_lang['u_m3ps']='m^3/s';
$ec_lang['u_mgd']='MGD';
$ec_lang['u_imgd']='Mgal imp/Tag';
$ec_lang['u_afd']='ac-ft/d';
$ec_lang['u_lpm']='L/min';
$ec_lang['u_cmh']='m^3/h';
$ec_lang['u_cmd']='m^3/d';
$ec_lang['u_mh2o']='m WS';
$ec_lang['u_mld']='ML/d';
$ec_lang['u_m']='m';
$ec_lang['u_mm2']='mm^2';
$ec_lang['u_mmh2o']='mm WS';
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
$ec_lang['u_day']='d';
$ec_lang['u_lph']='L/h';
$ec_lang['u_gph']='gal/h';
$ec_lang['u_mmph']='mm/h';
$ec_lang['u_inph']='in/h';
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
$ec_lang['menu_brand']='HawsEDC Rechner';
$ec_lang['menu_main_hydraulics']='Hydraulik';
$ec_lang['menu_help']='Hilfe';
$ec_lang['menu_libre']='Freie Software';
$ec_lang['template_welcome']='Lasst Eure Ängste an der Tür; hier wird Liebe gesprochen. Ihr ruiniert nicht alles. Genießt auch die <a target="_blank" href="https://hawsedc.com/download.php">kostenlosen HawsEDC AutoCAD-Tools.</a>';
$ec_lang['template_feedback']='Fällt Ihnen eine bessere Formulierung für diese Seite auf, oder sonst etwas? Möchten Sie mitwirken oder lernen, wie man solche Werkzeuge entwickelt? Bitte kontaktieren Sie mich.';
$ec_lang['template_printable_title']='Druckbarer Titel';
$ec_lang['template_printable_subtitle']='Druckbarer Untertitel';
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
$ec_lang['consent_body']='Dürfen wir ein einstelliges Cookie in diesem Browser speichern, um uns zu merken, dass wir diese Seite bereits gezählt haben? Es speichert nichts über Sie und nichts, was Sie eingeben. Ohne dieses Cookie können wir Ihren zweiten Besuch nicht von einem ersten Besuch einer anderen Person unterscheiden.';
$ec_lang['consent_accept']='Diesmal annehmen';
$ec_lang['consent_accept_all']='Immer annehmen';
$ec_lang['consent_decline']='Immer ablehnen';
$ec_lang['consent_current_granted']='Sie haben dem zugestimmt. Wir schränken die Protokollierung für dieses Browserprofil ein.';
$ec_lang['consent_current_denied']='Sie haben dies abgelehnt. Wir speichern nichts, um die Protokollierung für dieses Browserprofil einzuschränken.';
$ec_lang['consent_region_label']='Ihre Wahl zur Einschränkung der Protokollierung.';
$ec_lang['consent_settings_link']='Cookie-Einstellungen';
$ec_lang['privacy_link']='Datenschutzerklärung';
$ec_lang['terms_link']='Nutzungsbedingungen';
$ec_lang['index_main_title']='Kostenlose Ingenieurrechner online';
$ec_lang['index_meta_desc_plain']='Kostenlose Ingenieurrechner für Hydraulik: Rohre, Kanäle, Wehre und Bewässerung. Sie laufen im Browser, funktionieren offline und sind in 27 Sprachen verfügbar.';
$ec_lang['calc_set_units']='Einheiten festlegen:';
$ec_lang['calc_set_units_tip']='Legt die Einheit aller Felder auf einmal fest. Nicht destruktiv: Die von Ihnen eingegebenen Zahlen bleiben genau wie sie sind, jede wird nur in der neuen Einheit gelesen. Eine 6 bleibt eine 6, bedeutet aber jetzt 6 Zoll statt 6 Millimeter.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Standardwerte wiederherstellen';
$ec_lang['calc_defaults_confirm']='Rechner auf die ursprünglichen Standardwerte zurücksetzen?';
$ec_lang['points_data_note']='(oder Kopieren/Einfügen im Datenbereich)';
$ec_lang['points_data_heading']='Rechnerdaten<br />(Format mit Kopieren anzeigen)';
$ec_lang['points_data_copy']='Kopieren';
$ec_lang['points_data_paste']='Einfügen';
$ec_lang['calc_inputs']='Eingaben';
$ec_lang['calc_results']='Ergebnisse';
$ec_lang['view_hide_line']='Diese Zeile ausblenden';
$ec_lang['view_printable']='Druckversion (Seite neu laden zum Zurücksetzen)';
$ec_lang['ec_name_label']='Diese Berechnung speichern:';
$ec_lang['ec_name_placeholder']='Name';
$ec_lang['ec_name_tip']='Speichert diese Eingaben in der URL zum Lesezeichen, zum Abrufen aus dem Verlauf und zum Teilen';
$ec_lang['calc_copy_link']='Link kopieren';
$ec_lang['ec_related_calcs']='Verwandte Rechner:';
$ec_lang['calc_copy_link_done']='Kopiert!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Rohrreibungsverlust Darcy-Weisbach';
$ec_lang['dw_main_title']='Kostenloser Online-Rechner Rohrreibungsverlust Darcy-Weisbach';
$ec_lang['dw_main_desc']='Rohrreibungsverlust nach Darcy-Weisbach bei gegebenem Durchmesser, Rauheit und Durchfluss';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Absolute Rauheitshöhe, e, der Rohrwand. Typische Werte: Stahl (neu) 0,046 mm, Stahl (gebraucht) 0,15 mm, HDPE 0,003 mm, PVC/uPVC 0,0015 mm, Beton 0,3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s für sauberes Wasser bei 20°C">Kinematische Viskosität, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Kinematische Viskosität, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s für sauberes Wasser bei 20°C';
$ec_lang['dw_reynolds_number']='Reynolds-Zahl, Re';
$ec_lang['dw_flow_regime']='Strömungsregime';
$ec_lang['dw_regime_laminar']='laminar';
$ec_lang['dw_regime_transitional']='Übergangsbereich';
$ec_lang['dw_regime_turbulent']='turbulent';
$ec_lang['dw_friction_factor_method']='Methode des Reibungskoeffizienten';
$ec_lang['dw_friction_factor']='Reibungskoeffizient, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Rohrreibungsverlust Hazen-Williams';
$ec_lang['hw_main_title']='Kostenloser Online-Rechner Rohrreibungsverlust Hazen-Williams';
$ec_lang['hw_main_desc']='Rohrreibungsverlust nach Hazen-Williams bei gegebenem Durchmesser, Rauheit und Durchfluss';
$ec_lang['hw_hgl_1']='HGL flussabwärts';
$ec_lang['hw_hgl_2']='HGL flussaufwärts';
$ec_lang['hw_elev_up']='Höhe flussaufwärts';
$ec_lang['hw_pressure_up']='Druck flussaufwärts';
$ec_lang['hw_elev_down']='Höhe flussabwärts';
$ec_lang['hw_pressure_down']='Druck flussabwärts';
$ec_lang['hw_pressure_check']='Druckprüfung';
$ec_lang['hw_pressure_ok_short']='Positiver Druck';
$ec_lang['hw_pressure_neg_short']='Negativer Druck';
$ec_lang['hw_pressure_neg']='Der Druck flussabwärts liegt unter null. Die HGL fällt unter das Rohr, sodass das Rohr nicht vollständig durchströmt wäre und dieses Ergebnis möglicherweise nicht gültig ist.';
$ec_lang['hw_roughness']='Hazen-Williams-Koeffizient, C';
$ec_lang['hw_note_1']='<dl><dt>Dieser Rechner bildet den Rohrverlauf zwischen den beiden Enden nicht ab.</dt><dd>Er verwendet nur die von Ihnen eingegebenen Höhen flussaufwärts und flussabwärts. Steigt das Gelände irgendwo dazwischen höher an als beide Enden, ist der Druck an diesem Hochpunkt niedriger als jeder hier angezeigte Druck. Führen Sie den Rechner erneut für die Strecke vom flussaufwärtigen Ende bis zum Hochpunkt aus, um dies zu prüfen.</dd><dd>Fällt die HGL unter das Rohr, steht das Wasser unter negativem Druck. Luft tritt aus der Lösung aus, ein dünnwandiges Rohr kann einbrechen, und verunreinigtes Grundwasser kann durch die Rohrverbindungen eindringen. Halten Sie die Leitung überall unter positivem Druck, und ziehen Sie an jedem Hochpunkt ein Entlüftungsventil in Betracht.</dd><dt>Der Druck flussaufwärts ist eine von Ihnen vorgegebene Randbedingung.</dt><dd>Lesen Sie ihn von einem Manometer, vom Wasserstand eines Behälters (der Höhe des Wassers über dem Rohr) oder von einer Pumpenkennlinie ab. Eine Pumpe liefert bei steigendem Durchfluss weniger Druck; verwenden Sie daher den Punkt auf der Kennlinie, der dem oben eingegebenen Durchfluss entspricht.</dd><dt>Addieren Sie die örtlichen (Einzel-)Verlustbeiwerte selbst.</dt><dd>Addieren Sie die K-Werte für jeden Schieber, jede Krümmung, jedes T-Stück, jeden Zähler und jeden Einlauf auf der Leitung, und geben Sie diese Summe ein. Folgen Sie dem Link bei dieser Eingabe für typische Werte. Bei einer langen Transportleitung sind diese Verluste im Vergleich zur Reibung gering, in kurzer Stationsverrohrung können sie jedoch den Großteil des Verlusts ausmachen.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Unregelmäßiges Profil Manning';
$ec_lang['mi_main_title']='Kostenloser Online-Rechner unregelmäßiges Profil Manning';
$ec_lang['mi_main_desc']='Gleichförmiger Abflussrechner für unregelmäßiges Profil nach Manning';
$ec_lang['mi_waterSurfaceElevation']='Wasserstand';
$ec_lang['mi_q_617']='<span class="ec-help" title="Der zusammengesetzte Durchfluss, Q, unter Verwendung eines zusammengesetzten n für jeden Bereich nach Chow 6-17, bei gleichen Geschwindigkeiten">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Querschnittspunkte';
$ec_lang['mi_groupPoint']='Punkt';
$ec_lang['mi_groupSegment']='Segment';
$ec_lang['mi_groupRegion']='Bereich';
$ec_lang['mi_station']='Sta.';
$ec_lang['mi_elevation']='Höhe';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />Bereich-<br />grenze<br />(Ufer)';
$ec_lang['mi_tau']='Sohl-<br />schub-<br />spg. τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='Zus.-<br />ges. n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='Zusammengesetztes n';
$ec_lang['mi_notes_1_def']='Dieser Rechner folgt dem HEC-RAS-Referenzhandbuch bei der Berechnung des zusammengesetzten n des Bereichs nach Chow 1959, Seite 136, Gleichung 6-17 (nicht 6-18).';


$ec_lang['mi_notes_2_term']='Steindeckwerk';
$ec_lang['mi_notes_2_def']='Verwenden Sie den Manning-Trapezkanal-Rechner für die Steindeckwerk-Bemessung. Dieser Rechner eignet sich besser für natürliche Querschnitte.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Rohrdurchfluss Manning';
$ec_lang['mpf_main_title']='Kostenloser Online-Rechner Rohrdurchfluss Manning';
$ec_lang['mpf_main_desc']='Manning-Formel für gleichförmigen Rohrdurchfluss bei gegebenem Gefälle und Füllhöhe';
$ec_lang['mpf_pipe_diameter']='Rohrdurchmesser, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Manning-Rauheitskoeffizient, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Reibungsgefälle, S<sub>f</sub></a><span class="ec-help" title="Mitunter gleich dem Rohrgefälle. Dem Link für die Erklärung folgen (nur auf Englisch)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Relative Füllhöhe, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Durchfluss, Q';
$ec_lang['mpf_flow_tip']='Durchfluss und Tiefe werden für ein unendlich langes Rohr berechnet. Um diesen Durchfluss tatsächlich in das Rohr einzuleiten, kann eine größere Oberwassertiefe erforderlich sein. Einzelheiten und ein Lehrvideo finden Sie unten in den Hinweisen.';
$ec_lang['mpf_velocity']='Fließgeschwindigkeit, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Kinetische Energie als Höhe der Wassersäule, v²/2g">Geschwindigkeitshöhe, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Durchflossene Fläche, A';
$ec_lang['mpf_pipe_area']='Rohrquerschnitt, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Relative Fläche, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Benetzter Umfang, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Hydraulischer Radius, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Wasserspiegelbreite, T';
$ec_lang['mpf_froude_number']='Froude-Zahl, Fr';
$ec_lang['mpf_shear_stress']='Mittlere Sohlschubspannung, τ';
$ec_lang['mpf_full_flow']='Vollfüllung, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Füllungsverhältnis, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Dies ist der Durchfluss und die Tiefe innerhalb eines <em>unendlich langen</em> Rohres.</dt><dd>Um den Durchfluss in das Rohr zu leiten, kann eine erheblich höhere Oberwassertiefe erforderlich sein. Addieren Sie mindestens das 1,5-fache der Geschwindigkeitshöhe zur Oberwassertiefe oder <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">sehen Sie das 2-Minuten-Tutorial</a> für Standard-Durchlassberechnungen mit <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, dem kostenlosen Durchlassprogramm der US-amerikanischen Bundesstraßenverwaltung (FHWA).</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Planen Sie einen Schmutzwasserkanal?</dt><dd>Siehe die <a target="_blank" href="/sewslope.php">Tabellen für das Mindestgefälle von Abwasserkanälen</a> für Rohre von 4 bis 96 Zoll (100 bis 2400 mm), angegeben in m/m, mm/m und Prozent, sowie die Studie <a target="_blank" href="/peakfact.php">Spitzenfaktoren für sehr geringe Durchflüsse</a>. Beide sind Referenzdokumente ausschließlich in englischer Sprache.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Geben Sie ein positives Ziel-Q ein.';
$ec_lang['mpf_solver_no_solution']='Keine Lösung: Q übersteigt die Rohrkapazität bei y/d0 = 93.8% (Qmax = {qmax} in den gewählten Einheiten).';
$ec_lang['mpf_solve_btn']='Berechnen';
$ec_lang['mpf_solve_for_flow']='für Durchfluss, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Rohrverlusthöhe Manning';
$ec_lang['mphl_main_title']='Kostenloser Online-Rechner Rohrverlusthöhe Manning';
$ec_lang['mphl_main_desc']='Manning-Formel Verlusthöhe bei gegebenem Vollfüllungsdurchfluss';
$ec_lang['mphl_pipe_length']='Rohrlänge, L';
$ec_lang['mphl_area']='Fläche, A';
$ec_lang['mphl_total_junction_k']='Örtlicher (Einzel-)Verlustbeiwert, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Verlustbeiwert, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Örtlicher (Einzel-)Verlustbeiwert, km. Diese Verluste treten an Rohrverzweigungen, Einläufen, Auslässen, Krümmern und Armaturen auf — die Bezeichnung „gering“ ist üblich, aber irreführend; auf einer kurzen Leitung können sie die Reibungsverluste erreichen oder übersteigen. Typische k-Werte: scharfkantiger Einlauf 0,5, je 45°-Krümmer 0,2–0,3, Schieber (vollständig geöffnet) 0,1, Klappenventil 0,2, Auslass (in Reservoir oder Atmosphäre) 1,0. Alle Formstücke zur Ermittlung des gesamten km addieren. Der Standardwert 2,0 geht von einem Einlauf, einem Auslass und zwei 45°-Krümmern aus.';
$ec_lang['mphl_friction_slope']='Reibungsgefälle';
$ec_lang['mphl_friction_loss']='Reibungsverlust, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Örtlicher (Einzel-)Verlust, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Gesamtverlust, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='EGL flussabwärts';
$ec_lang['mphl_egl_2']='EGL flussaufwärts';
$ec_lang['mphl_hgl_egl_tip']='Dieses Ergebnis ist möglicherweise nicht gültig, wo das Rohr über die Druckhöhenlinie steigt.';
$ec_lang['mphl_note_1']='<dl><dt>Dieser Rechner bildet den Rohrverlauf zwischen den beiden Enden nicht ab.</dt><dd>Liegt die HGL an irgendeiner Stelle unter der Rohroberkante, ist diese Berechnung möglicherweise nicht gültig.</dd><dt>Für einen offenen Einlauf (Durchlass) müssen die Einlaufsteuerungsbedingungen geprüft werden.</dt><dd>1. Die HGL flussaufwärts muss über der normalen Fließtiefe flussaufwärts liegen (und höher als das Rohr!).</dd><dd>2. Der Oberwasserstand eines Durchlasses wird besser durch die EGL flussaufwärts als durch die HGL flussaufwärts dargestellt.</dd><dd>3. Sehen Sie <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">das 2-Minuten-Tutorial</a> für einfache Standard-Durchlassberechnungen mit <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, dem kostenlosen Durchlassprogramm der US-amerikanischen Bundesstraßenverwaltung (FHWA).</dd><dd>4. Diese Seite löst nur den Fall der Auslasssteuerung: ein vollständig durchströmtes Rohr, bei dem die Bedingungen flussabwärts die Höhe (den Druck) vorgeben. Bei der Durchlassbemessung muss entschieden werden, ob Einlauf- oder Auslasssteuerung maßgebend ist; verwenden Sie daher HY-8, wann immer beides infrage kommen könnte.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Trapezprofil-Kanal Manning';
$ec_lang['mtc_main_title']='Kostenloser Online-Rechner Trapezkanal Manning-Formel';
$ec_lang['mtc_main_desc']='Manning-Formel gleichförmiger Abfluss im Trapezkanal bei gegebenem Gefälle und Tiefe';
$ec_lang['mtc_bottom_width']='Sohlbreite, b';
$ec_lang['mtc_side_slope_1']='Böschung 1, z<sub>1</sub> (horiz./vert.)';
$ec_lang['mtc_side_slope_2']='Böschung 2, z<sub>2</sub> (horiz./vert.)';
$ec_lang['mtc_channel_slope']='Kanalgefälle, S';
$ec_lang['mtc_flow_depth']='Fließtiefe, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Kurvenwinkel, β</a><span class="ec-help" title="Für Deckwerksbemessung. Dem Link für die Skizze folgen."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Dichte relativ zu Wasser. Typisch ≈ 2,65 für Schotter.">Relative Dichte des Steins, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Bemessungskorngröße, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n aus der Bemessungskorngröße (Methode nach Strickler)';
$ec_lang['mtc_n_blodgett']='n aus der Bemessungskorngröße (Methode nach Blodgett)';
$ec_lang['mtc_n_bathurst']='n aus der Bemessungskorngröße (Methode nach Bathurst)';
$ec_lang['mtc_n_pi']='n aus der Bemessungskorngröße (Methode nach Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett gegenüber Bathurst';
$ec_lang['mtc_pi_range_check']='P&I-Bereichsprüfung';
$ec_lang['mtc_pi_ok']='d50 im P&I-Bereich';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Außerhalb des Bereichs';
$ec_lang['mtc_pi_tip']='Extrapolation außerhalb des Datenbereichs von 0,28–0,36 ft, für den diese Gleichung entwickelt wurde — als grobe Kontrolle, nicht als Bemessungsgrundlage zu verstehen';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Nach Isbash (1936) und Maricopa County, Arizona, USA.">Erforderliche Körnung kantenreicher Steine Sohle, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Nach Isbash (1936) und Maricopa County, Arizona, USA.">Erforderliche Körnung kantenreicher Steine Böschung 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Nach Isbash (1936) und Maricopa County, Arizona, USA.">Erforderliche Körnung kantenreicher Steine Böschung 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Nach Maynord, Ruff und Abt (1989). In einer Kurve wird das Gestein für eine Kurvengeschwindigkeit von 4/3 der mittleren Geschwindigkeit bemessen, nach California Division of Highways (1970); Maynords eigener Wert von 1,5 gilt für natürliche Gerinne.">Erforderliche Körnung kantenreicher Steine, D<sub>50</sub> (Maynord, Ruff und Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Erforderliche Körnung kantenreicher Steine, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Geschwindigkeit plausibel für Gleichströmungsannahmen.';
$ec_lang['mtc_vel_low']='Geschwindigkeit niedrig – Sedimentationsrisiko.';
$ec_lang['mtc_vel_high']='Geschwindigkeit ist hoch und möglicherweise nicht realistisch – Erosion der Gerinneauskleidung, zusätzliche Tiefe in Bögen und Energieverlust an Aufweitungen oder Hindernissen prüfen.';
$ec_lang['mtc_iteration_tip']='Wählen Sie eine Rauheitsoption (Blodgett–Bathurst empfohlen) und eine Option für die Korngröße (Isbash empfohlen), um automatisch auf eine gleichmäßige Korngröße für Ihren Zieldurchfluss zu iterieren. Die vollständige Methode finden Sie unten in den Hinweisen, oder geben Sie Ihren eigenen Rauheitswert ein (dem Link für Hinweise folgen) und ignorieren Sie die Korngröße, um die Iteration zu überspringen.';
$ec_lang['mtc_note_1']='<dl><dt>Automatische Iteration Steinbemessung und Rauheit</dt><dd>Wählen Sie eine Rauheitsoption (Blodgett–Bathurst empfohlen) und eine Option für die Bemessungskorngröße (Isbash empfohlen). Stellen Sie Tiefe und Steinbemessungsfaktor ein, um den gewünschten Durchfluss mit einer gleichmäßigen Korngröße zu erzielen. Bei jeder Änderung eines Eingabewerts durchläuft der Rechner diese Schritte: 1. Die Rauheit wird aus der Bemessungskorngröße berechnet. 2. Der Rauheitswert aus der gewählten Methode wird in die Eingaberauheit kopiert. 3. Kanaldurchfluss und erforderliche Korngröße werden berechnet. 4. Die Bemessungskorngröße wird angepasst. 5. Wiederholen, bis der Fehler in der Bemessungskorngröße sehr klein ist.</dd><dt>Grundrechner (ohne Iteration)</dt><dd>Geben Sie den gewünschten Rauheitswert ein. Ignorieren Sie den Eingabebereich für die Bemessungskorngröße.</dd></dl>';
$ec_lang['mtc_note_2_term']='Geschwindigkeitsprüfung';
$ec_lang['mtc_note_2_def']='Hohe Geschwindigkeit impliziert hohe spezifische Energie aus einem verfügbaren Absturz. Diese Energie kann schnell an Aufweitungen, Bögen oder Hindernissen abgebaut werden. Prüfen Sie, ob dies für den Standort plausibel ist.';
$ec_lang['mtc_solver_no_solution']='Für das gegebene Q wurde bei diesen Kanaleingaben keine Lösung gefunden.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Einfaches Wehr';
$ec_lang['ws_main_title']='Kostenloser Online-Rechner für den Durchfluss über ein einfaches breitkroniges Wehr';
$ec_lang['ws_main_desc']='Rechner für den Durchfluss über ein einfaches breitkroniges Wehr';
$ec_lang['ws_weirLength']='Wehrlänge, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Energie pro Gewichtseinheit des Wassers – eine Höhe der Wassersäule, kein Druck">Überfallhöhe, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Wehrbeiwert, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Hinweise';
$ec_lang['ws_notes_we_term']='Wehrformel';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Unregelmäßiges Wehr';
$ec_lang['wi_main_title']='Kostenloser Online-Rechner für segmentierte, unregelmäßige Wehre mit veränderlicher Kronenhöhe';
$ec_lang['wi_main_desc']='Rechner für den Durchfluss über ein unregelmäßiges Wehr';
$ec_lang['wi_weirPoints']='Wehrpunkte';
$ec_lang['wi_pondingHeight']='Stauhöhe';
$ec_lang['wi_incrementalFlow']='Teildurchfluss';
$ec_lang['wi_cumulativeFlow']='Kumulierter Durchfluss';
$ec_lang['wi_notes_we_def']='q = wenn (Länge = 0) dann 0, sonst wenn (Gefälle=0) dann cw*Länge*d<sub>0</sub><sup>1.5</sup>, sonst cw/(2.5*Gefälle) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) wobei d<sub>1</sub> und d<sub>0</sub> immer positiv oder null sind';
// Orifice Flow
$ec_lang['or_main_menu']='Ausfluss durch Öffnung';
$ec_lang['or_main_title']='Kostenloser Online-Rechner für den Ausfluss durch Öffnungen';
$ec_lang['or_main_desc']='Ausfluss durch Öffnung — frei oder eingestaut';
$ec_lang['or_shape_circular']='Kreisförmig';
$ec_lang['or_shape_rectangular']='Rechteckig';
$ec_lang['or_diameter']='<span class="ec-help" title="Durchmesser bei kreisförmig; Höhe bei rechteckig">Durchmesser oder Höhe, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Nur bei rechteckigen Öffnungen">Breite, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Unterkante der Öffnung">Sohlhöhe <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Oberwasserstand';
$ec_lang['or_twe']='Unterwasserstand';
$ec_lang['or_cd']='Ausflusskoeffizient, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Schwerpunkthöhe';
$ec_lang['or_head']='<span class="ec-help" title="Energie pro Gewichtseinheit des Wassers – eine Höhe der Wassersäule, kein Druck">Wirksame Druckhöhe, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Öffnungsfläche, A';
$ec_lang['or_regime']='Prüfung des Öffnungsregimes';
$ec_lang['or_regime_valid']='Freier Ausfluss';
$ec_lang['or_regime_submerged']='Eingestaute Öffnung';
$ec_lang['or_regime_submerged_tip']='TWE über dem Schwerpunkt — Öffnungsregime weiterhin gültig';
$ec_lang['or_regime_warn']='Außerhalb des Öffnungsregimes';
$ec_lang['or_regime_warn_tip']='Oberwasser unter dem Scheitel der Öffnung';
$ec_lang['or_regime_twe_above_hwe']='Eingaben prüfen';
$ec_lang['or_regime_twe_above_hwe_tip']='Unterwasserstand (TWE) über Oberwasserstand (HWE)';
$ec_lang['or_notes_1_term']='Ausflussformel';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Bei freiem Ausfluss: h = HWE − Schwerpunkt. Bei eingestautem Ausfluss (TWE über Sohle): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Öffnungsregime';
$ec_lang['or_notes_2_def']='Die Ausflussformeln für Öffnungen gelten, wenn der Oberwasserspiegel über dem Scheitel (der Oberkante) der Öffnung liegt. Liegt der Oberwasserspiegel darunter, ist stattdessen eine Wehrformel zu verwenden.';
$ec_lang['or_notes_3_term']='Ausflusskoeffizient';
$ec_lang['or_notes_3_def']='C<sub>d</sub> liegt bei ca. 0,60–0,65 für scharfkantige Öffnungen. Abgerundete oder einspringende Einläufe haben andere Werte. Siehe <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> oder das HEC-RAS Hydraulic Reference Manual.';
$ec_lang['or_notes_4_term']='Einstau';
$ec_lang['or_notes_4_def']='Wenn TWE über der Sohle der Öffnung liegt, verwendet der Rechner automatisch die Formel für eingestauten Ausfluss mit h = HWE − TWE. Liegt TWE auf oder unter der Sohle, wird freier Ausfluss angenommen und h = HWE − Schwerpunkt.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Mikro-Wasserkraft';
$ec_lang['mhp_main_title']='Kostenloser Online-Rechner für Mikro-Wasserkraft';
$ec_lang['mhp_main_desc']='Leistungsrechner für Laufwasser-Mikro-Wasserkraftanlagen';
$ec_lang['mhp_gross_head']='Bruttofallhöhe, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Durchmesser der Druckrohrleitung (Zuleitung)">Rohrdurchmesser der Druckrohrleitung, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Länge, L';
$ec_lang['mhp_efficiency']='Anlagenwirkungsgrad, η (0–1)';
$ec_lang['mhp_vel_check']='Geschwindigkeitsprüfung';
$ec_lang['mhp_hl_check']='Druckverlustprüfung';
$ec_lang['mhp_hnet']='Nettofallhöhe, H<sub>net</sub>';
$ec_lang['mhp_power']='Leistungsabgabe, P';
$ec_lang['mhp_annual_kwh']='P als Jahresenergie';
$ec_lang['mhp_vel_low']='Geschwindigkeit niedrig – Risiko von Sedimentation und Lufteintrag.';
$ec_lang['mhp_vel_high']='Geschwindigkeit hoch – Übergangsverluste, verfügbare Energie und Druckstoß prüfen.';
$ec_lang['mhp_vel_ok_short']='OK';
$ec_lang['mhp_vel_high_short']='Hoch';
$ec_lang['mhp_vel_low_short']='Niedrig';
$ec_lang['mhp_vel_ok_tip']='Geschwindigkeit liegt im effizienten Bereich für die Auslegung der Druckrohrleitung.';
$ec_lang['mhp_hl_ok_tip']='Der Druckverlust liegt unter 10 % der Bruttofallhöhe. Diese Rohrgröße ist wirtschaftlich.';
$ec_lang['mhp_hl_warn_tip']='Der Druckverlust liegt über 10 % der Bruttofallhöhe. Erwägen Sie ein größeres Rohr.';
$ec_lang['mhp_hl_bad_tip']='Der Druckverlust liegt über 20 % der Bruttofallhöhe. Passen Sie die Rohrgröße an.';
$ec_lang['mhp_notes_1_term']='Druckverlust';
$ec_lang['mhp_notes_1_def']='Gesamtverlust der Druckrohrleitung h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, wobei h<sub>f</sub> = f(L/D)(v²/2g) der Darcy-Weisbach-Reibungsverlust ist und h<sub>m</sub> = k<sub>m</sub>·v²/2g Einläufe, Krümmer und Armaturen berücksichtigt. Nettofallhöhe H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Fließgeschwindigkeit';
$ec_lang['mhp_notes_2_def']='Prüfen Sie, ob die Geschwindigkeit für das verfügbare Gefälle und die Rohrkosten angemessen ist. Sehr niedrige Geschwindigkeit kann auf Überdimensionierung hindeuten; sehr hohe Geschwindigkeit kann Reibungsverluste und das Risiko eines Wasserschlags erhöhen.';
$ec_lang['mhp_notes_3_term']='Druckverlustziel';
$ec_lang['mhp_notes_3_def']='Verluste in der Druckrohrleitung (Zuleitung) unter 10 % der Bruttofallhöhe sind in der Regel wirtschaftlich. Der optimale Kompromiss zwischen Rohrkosten und Leistungsverlust liegt oft bei 4–6 %, wenn der Strompreis am oberen Ende liegt.';
$ec_lang['mhp_notes_6_term']='Wirkungsgrad';
$ec_lang['mhp_notes_6_def']='Der typische Anlagenwirkungsgrad η liegt für Pelton- und Durchströmturbinen, die in der Mikro-Wasserkraft verbreitet sind, zwischen 0,70 und 0,85. Als konservativen Anfangswert 0,75 verwenden.';
$ec_lang['mhp_notes_7_term']='Jahresenergie';
$ec_lang['mhp_notes_7_def']='Die Jahresenergie setzt einen kontinuierlichen Vollbetrieb voraus (8760 Stunden/Jahr). Die tatsächliche Produktion ist aufgrund saisonaler Durchflussschwankungen, Wartungsausfallzeiten und des Lastfaktors geringer.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Teich- & Behälter-Entleerungszeit';
$ec_lang['odt_main_title']='Kostenloser Online-Rechner für die Entleerungszeit von Teich, Becken und Behälter (Öffnung)';
$ec_lang['odt_main_desc']='Entleerungszeit von Teich, Becken oder Behälter — Auslauf durch Öffnung, Kegelvolumenmethode';
$ec_lang['odt_h1_elev']='Anfangswasserspiegelhöhe';
$ec_lang['odt_a1']='Anfangsfläche, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Endwasserspiegelhöhe';
$ec_lang['odt_a0']='Fläche auf Öffnungshöhe, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Interpoliert aus dem Kegelmodell bei der Endhöhe">Endfläche, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Prüfung der Endhöhe';
$ec_lang['odt_h2_ok']='Endhöhe über dem Scheitel der Öffnung';
$ec_lang['odt_h2_warn']='Endhöhe auf oder unter dem Scheitel der Öffnung';
$ec_lang['odt_h2_warn_tip']='Scheitel der Öffnung = Schwerpunkt + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Durchmesser (kreisförmig) oder Höhe (rechteckig)">Öffnung D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Nur rechteckig">Öffnungsbreite, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Entleerungszeit (s)';
$ec_lang['odt_t_min']='Entleerungszeit (min)';
$ec_lang['odt_t_hr']='Entleerungszeit (h)';
$ec_lang['odt_t_day']='Entleerungszeit (Tage)';
$ec_lang['odt_notes_1_term']='Formel';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) ergibt die Entleerungszeit von der Druckhöhe H bis zur Öffnung. Entleerungszeit = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), wobei H<sub>1</sub> = Anfangshöhe − Öffnungshöhe, H<sub>2</sub> = Endhöhe − Öffnungshöhe.';
$ec_lang['odt_notes_2_term']='Methode';
$ec_lang['odt_notes_2_def']='Die Kegelvolumenmethode modelliert den Teich oder das Becken als Kegelschnitt zwischen der Anfangsfläche A<sub>1</sub> beim Anfangswasserspiegel und der Fläche A<sub>0</sub> auf der Schwerpunkthöhe der Öffnung. A<sub>2</sub>, die Fläche bei der Endhöhe, wird aus A<sub>1</sub> und A<sub>0</sub> nach dem Kegelmodell interpoliert. Die Entleerungszeit von der Anfangs- bis zur Endhöhe entspricht der gesamten Entleerungszeit von H<sub>1</sub> bis zur Öffnung abzüglich der verbleibenden Entleerungszeit von H<sub>2</sub> bis zur Öffnung.';
$ec_lang['odt_h1']='<span class="ec-help" title="Anfangswasserspiegelhöhe minus Schwerpunkthöhe der Öffnung">Anfangsdruckhöhe, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Maximaler Ausfluss, Q<sub>max</sub>';
$ec_lang['odt_vol']='Entleertes Volumen';
$ec_lang['odt_sketch_start']='Anfang';
$ec_lang['odt_sketch_end']='Ende';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Emitterabstand, S<sub>e</sub>';
$ec_lang['ip_sl']='Lateralabstand, S<sub>l</sub>';
$ec_lang['ip_n_e']='Emitter pro Lateral, n<sub>e</sub>';
$ec_lang['ip_n_l']='Laterale pro Zone, n<sub>l</sub>';
$ec_lang['ip_d']='Ziel-Ausbringungstiefe, d';
$ec_lang['ip_a_e']='Fläche pro Emitter, A<sub>e</sub>';
$ec_lang['ip_pr']='Beregnungsintensität, PR';
$ec_lang['ip_q_lat']='Durchfluss pro Lateral, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Zonendurchfluss, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Laufzeit (Stunden)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Kanalversickerung';
$ec_lang['cs_main_title']='Kostenloser Online-Rechner für Kanalversickerungsverlust und Transportwirkungsgrad';
$ec_lang['cs_main_desc']='Kanalversickerungsverlust & Transportwirkungsgrad — Zu-/Abfluss-Methode';
$ec_lang['cs_Q_in']='Zufluss, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Abfluss, Q<sub>out</sub>';
$ec_lang['cs_L']='Haltungslänge, L';
$ec_lang['cs_Q_loss']='Versickerungsverlustrate, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Messungskontrolle';
$ec_lang['cs_pct_loss']='Verlorener Anteil';
$ec_lang['cs_Ec']='Transportwirkungsgrad, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Wirkungsgradbewertung';
$ec_lang['cs_Vol_day']='Täglich verlorenes Volumen';
$ec_lang['cs_Vol_year']='Jährlich verlorenes Volumen';
$ec_lang['cs_Q_loss_per_L']='Verlust je Längeneinheit, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Wasserwert';
$ec_lang['cs_lining_cost']='Auskleidungskosten';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Ziel-Transportwirkungsgrad nach Auskleidung; Anteil 0–1">Auskleidungsziel, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Auskleidungsfläche, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Jährlich verlorener Wert';
$ec_lang['cs_annual_value_recovered']='Jährlich zurückgewonnener Wert';
$ec_lang['cs_lining_total_cost']='Gesamte Auskleidungskosten';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Einfache Amortisation = gesamte Auskleidungskosten ÷ jährlich zurückgewonnener Wert">Amortisationszeit <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — Versickerung festgestellt';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — kein messbarer Verlust';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — Messungen prüfen';
$ec_lang['cs_Ec_good']='Gut — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Mittel — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Schlecht — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='Die Zu-/Abfluss-Methode schätzt die Versickerung, indem der Durchfluss am Anfang und Ende einer Kanalhaltung gemessen wird: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Der Transportwirkungsgrad E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Das Jahresvolumen setzt einen durchgehenden Vollbetrieb voraus; der tatsächliche Verlust ist bei saisonalen oder teilweise betriebenen Kanälen geringer.';
$ec_lang['cs_notes_2_term']='Wirkungsgradbewertungen';
$ec_lang['cs_notes_2_def']='Typische unbefestigte Erdkanäle: E<sub>c</sub> = 60–80 %. Gut unterhaltene Erdkanäle: 75–85 %. Betonausgekleidete Kanäle: 90–98 %. Versickerungsverluste über 30 % des Zuflusses rechtfertigen häufig eine Investition in die Auskleidung. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Amortisation der Auskleidung';
$ec_lang['cs_notes_3_def']='Geben Sie Wasserwert und Auskleidungskosten in einer beliebigen, aber einheitlichen Währung ein. Auskleidungsfläche = Haltungslänge × benetzter Umfang — der benetzte Umfang des Kanalquerschnitts bei der gemessenen Fließtiefe (Sohlbreite plus beide benetzten Böschungen). Der jährlich zurückgewonnene Wert setzt voraus, dass der ausgekleidete Kanal den Ziel-E<sub>c</sub> dauerhaft erreicht. Die tatsächliche Amortisationszeit ist bei saisonalen Kanälen oder wenn die Auskleidung die Zieleffizienz nicht erreicht, länger.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3. Aufl. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='Über';
$ec_lang['install_main_menu']='Installieren';
$ec_lang['install_main_title']='EngCalcs installieren';
$ec_lang['install_main_desc']='Zum Gerät hinzufügen für Offline-Nutzung';
$ec_lang['install_intro']='EngCalcs ist eine Progressive Web App (PWA). Nach der Installation funktionieren alle Rechner vollständig offline — keine Internetverbindung nötig.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Öffnen Sie eine beliebige Rechnerseite in Chrome.</li><li>Tippen Sie oben in der Navigationsleiste auf die Schaltfläche <strong>⬇ Installieren</strong>, oder öffnen Sie das Browsermenü (⋮) und wählen Sie <strong>Zum Startbildschirm hinzufügen</strong>.</li><li>Tippen Sie in der angezeigten Aufforderung auf <strong>Installieren</strong>.</li><li>EngCalcs erscheint auf Ihrem Startbildschirm und funktioniert offline.</li>';
$ec_lang['install_now_btn']='⬇ Jetzt installieren';
$ec_lang['install_prompt_unavailable']='Installationsaufforderung nicht verfügbar — nutzen Sie stattdessen Ihr Browsermenü.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Öffnen Sie eine beliebige Rechnerseite in Safari.</li><li>Tippen Sie auf die Schaltfläche <strong>Teilen</strong> (Kästchen mit nach oben zeigendem Pfeil).</li><li>Scrollen Sie nach unten und tippen Sie auf <strong>Zum Home-Bildschirm</strong>.</li><li>Tippen Sie auf <strong>Hinzufügen</strong>. EngCalcs erscheint auf Ihrem Startbildschirm.</li>';
$ec_lang['install_ios_note']='Unter iOS erfolgt die Installation immer über das Teilen-Menü — es gibt keine automatische Installationsaufforderung.';
$ec_lang['install_desktop_heading']='Desktop (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Öffnen Sie eine beliebige Rechnerseite.</li><li>Klicken Sie auf das <strong>Installationssymbol</strong> (⊕ oder Computersymbol) in der Adressleiste des Browsers, oder öffnen Sie das Browsermenü und wählen Sie <strong>EngCalcs installieren…</strong></li><li>Klicken Sie auf <strong>Installieren</strong>. EngCalcs öffnet sich als eigenständiges App-Fenster.</li>';
$ec_lang['install_firefox_heading']='Firefox / Andere Browser';
$ec_lang['install_firefox_body']='Bietet Ihr Browser keine Installationsoption, geht nichts verloren: Nutzen Sie die Rechner wie gewohnt im Browser — nach Ihrem ersten Besuch werden die Seiten automatisch für die Offline-Nutzung zwischengespeichert. Firefox auf dem Desktop ist der übliche Fall.';
$ec_lang['install_cached_heading']='Was zwischengespeichert wird';
$ec_lang['install_cached_body']='Beim ersten Installieren von EngCalcs werden alle Rechnerseiten und ihre zugehörigen Dateien (Skripte, Stile) automatisch auf Ihrem Gerät gespeichert. Danach funktioniert alles ohne Internetverbindung. Ihre Sprachauswahl wird von Ihrem letzten Online-Besuch übernommen.';
$ec_lang['contact_main_menu']='Kontakt';
$ec_lang['about_main_title']='Über die HawsEDC-Ingenieurrechner';
$ec_lang['about_main_desc']='Mission, Freie Software und Mitwirken';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Mission</h3><p>Die HawsEDC-Ingenieurrechner werden seit 2010 frei im Internet angeboten. Sie dienen Ingenieuren und Feldarbeitern auf der ganzen Welt — insbesondere solchen, die in wasserarmen, ressourcenarmen oder unterversorgten Regionen arbeiten. Diese Werkzeuge sind Teil einer breiteren humanitären Mission: jedem Menschen auf die praktischste und wirkungsvollste Weise zu sagen, <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">dass er für immer geliebt und geschätzt wird, dass er nichts zu befürchten hat und dass er nicht alles zunichte machen wird</a>.</p><p>Die Rechner sind das Mittel. Das Ziel ist eine Welt frei von Leid.</p><h3>Freie-Libre-Open-Source-Lizenz</h3><p>Aller Code wird unter der <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 oder später</a> veröffentlicht — frei wie in Freiheit. Sie dürfen den Code unter denselben Bedingungen nutzen, studieren, ändern und weitergeben.</p><p>Die Website, die sie bereitstellt, wird heute und seit 2010 frei angeboten; sollte das eines Tages nicht mehr möglich sein, gehört die Software immer noch Ihnen zum Betreiben.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Quellcode</h3><p>Der vollständige Quellcode ist öffentlich auf GitHub verfügbar:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Sie können dort den Code durchsuchen, Probleme melden oder das Repository forken.</p><h3>Mitwirken</h3><p>Jede Hilfe ist willkommen. <a href="contact.php">Tom Haws kontaktieren</a>.</p><ul><li><strong>Übersetzungen:</strong> Schlagen Sie eine bessere Formulierung vor. Verbessern oder ergänzen Sie eine Sprache.</li><li><strong>Fehlerberichte:</strong> Nutzen Sie das Feedback-Formular auf einer beliebigen Rechnerseite oder melden Sie ein Problem auf GitHub.</li><li><strong>Neue Rechner:</strong> Ideen für hydraulisch-ingenieurtechnische Werkzeuge, die Feldarbeitern und Bewässerungspraktikern dienen, sind besonders willkommen.</li><li><strong>Hosting:</strong> Wenn Sie diese Rechner für eine Region mit eingeschränkter Konnektivität spiegeln können, nehmen Sie bitte Kontakt auf.</li></ul><h3>Offline-Nutzung</h3><p>Öffnen Sie einen beliebigen Rechner einmal, während Sie online sind, und alle funktionieren weiter, wenn Sie es nicht sind: Ihr Browser speichert die ganze Sammlung im Laufe der Zeit. Der Mechanismus ist eine <strong>Progressive Web App (PWA)</strong>, falls Sie darüber lesen möchten. Danach funktionieren alle Rechner offline — kein Internet erforderlich.</p><p>Verwenden Sie auf Android oder iOS die Option „Zum Startbildschirm hinzufügen" Ihres Browsers, um EngCalcs als App auf Ihrem Gerät zu installieren. Auf dem Desktop suchen Sie nach dem Installationssymbol in der Adressleiste Ihres Browsers.</p><p>Sie können auch jeden einzelnen Rechner über das Menü „Speichern unter…" Ihres Browsers für die einmalige Offline-Nutzung speichern.</p><h3>Kontakt</h3><p>Tom Haws, Wasserbauingenieur und Gründer dieser Rechner.<br />Nutzen Sie das Feedback-Formular auf einer beliebigen Rechnerseite oder greifen Sie auf den Quellcode unter <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a> zu.</p>';
$ec_lang['contactSendMessage']='Senden Sie Tom Haws eine Nachricht';
$ec_lang['contactYourName']='Ihr Name:';
$ec_lang['contactYourEmail']='Ihre E-Mail-Adresse:';
$ec_lang['contactSubject']='Betreff:';
$ec_lang['contact_message']='Nachricht:';
$ec_lang['contactSpamPrefix']='Fünf plus eins ergibt';
$ec_lang['contactSpamPostfix']='(Bitte auf Englisch ausschreiben. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Nachricht senden';
$ec_lang['contact_success']='Danke, dass Sie sich die Zeit genommen haben zu schreiben.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Steingerinne-Bemessung (Robinson)';
$ec_lang['rc_main_title']='Kostenloser Online-Rechner für Steingerinne-Bemessung — Robinson (1998)';
$ec_lang['rc_main_desc']='Steingerinne Bruchsteinbemessung — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Gerinnegefälle, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Abfluss je Breiteneinheit am Gerinneeinlauf. Bei einem Gerinne mit Sohlbreite B und Gesamtabfluss Q gilt q_t = Q / B.">Gesamtspezifischer Abfluss, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Bruchsteinporosität, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Dichte relativ zu Wasser. Typisch für gebrochenen Granit oder Basalt ≈ 2,65. Gültiger Robinson-Bereich: 2,54 bis 2,82.">Relative Dichte des Gesteins, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Standardabweichung der Kornverteilung. Gleichförmiges Gestein ≈ 1,25. Gültiger Robinson-Bereich: 1,15 bis 1,47.">Kornverteilung SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Einstau (Hp > yn) ist günstig — vermindert Erosion oberstrom. (USDA)">Normaltiefe im Zulaufgerinne, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Gl. 1 (S0 < 0,10) oder Gl. 2 (0,10–0,40). Gültig: D50 15–278 mm, S0 0,02–0,40. Außerhalb des Bereichs: extrapoliert.">Erforderlicher medianer Steindurchmesser, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Angewandte Gleichung';
$ec_lang['rc_sg_check']='Prüfung relative Dichte';
$ec_lang['rc_SD_check']='Prüfung Kornverteilung SD';
$ec_lang['rc_sg_ok']   ='sg im gültigen Bereich (2,54–2,82)';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg < 2,54 — unterhalb des Robinson-Bereichs';
$ec_lang['rc_sg_low_tip']='Gültiger Bereich: 2,54–2,82';
$ec_lang['rc_sg_high'] ='sg > 2,82 — oberhalb des Robinson-Bereichs';
$ec_lang['rc_sg_high_tip']='Gültiger Bereich: 2,54–2,82';
$ec_lang['rc_SD_ok']   ='SD im gültigen Bereich (1,15–1,47)';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD < 1,15 — unterhalb des Robinson-Bereichs';
$ec_lang['rc_SD_low_tip']='Gültiger Bereich: 1,15–1,47';
$ec_lang['rc_SD_high'] ='SD > 1,47 — oberhalb des Robinson-Bereichs';
$ec_lang['rc_SD_high_tip']='Gültiger Bereich: 1,15–1,47';
$ec_lang['rc_layer']='Steinlagenstärke (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Krümmungsradius Oberkante (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Bogenlänge Oberkante';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Erforderlich zur Lagestabilisierung des Bruchsteins. “Der minimale Unterwasserstand, der durch den Auslaufbereich und den Widerstand des Unterliegergerinnes entsteht, ist ausreichend, um die Stabilität des Bruchsteins im Auslaufbereich zu gewährleisten.” (Robinson)">Vorschüttstrecke Auslauf (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Manning-Rauheit im Gerinne, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Anteil von qt, der durch die Steinporen fließt. Der Rest qs fließt über die Oberfläche. Standard np = 0,45 für gebrochenes Kantgestein.">Fließgeschwindigkeit durch Steinmatte, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Spezifischer Durchfluss durch Steinmatte, q<sub>m</sub>';
$ec_lang['rc_qs']='Oberflächenspezifischer Abfluss, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Fließtiefe über Bruchsteinoberfläche, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Einstau (Hp > yn) ist günstig — vermindert Erosion oberstrom. (USDA)">Einlaufstauhöhe, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Einstauprüfung am Einlauf';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — Einstau oberstrom';
$ec_lang['rc_pond_ok_tip']='Einstau oberstrom des Gerinneeinlaufs ist günstig; er vermindert die Erosion oberstrom. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — kein Einstau — Erosionspotenzial am Einlauf';
$ec_lang['rc_pond_warn_tip']='Kein Einstau oberstrom des Gerinneeinlaufs; es kann zu Erosion oberstrom kommen. (USDA)';
$ec_lang['rc_eq1']='Gl. 1 (S<sub>0</sub> < 0,10) — flaches Gefälle';
$ec_lang['rc_eq2']='Gl. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — steiles Gefälle';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — unterhalb des Robinson-Gültigkeitsbereichs';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — oberhalb des Robinson-Gültigkeitsbereichs';
$ec_lang['rc_notes_1_term']='Steinbemessungsgleichungen';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) entwickelten zwei empirische Gleichungen für den medianen Bruchsteindurchmesser D<sub>50</sub> aus Kanalgefälle und spezifischem Durchfluss. Gleichung 1 gilt für flache Gefälle (S<sub>0</sub> < 0,10); Gleichung 2 gilt für steile Gefälle (0,10 ≤ S<sub>0</sub> ≤ 0,40). Beide Gleichungen erfordern q<sub>t</sub> in m²/s und liefern D<sub>50</sub> in mm. Der validierte Bereich ist 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Spezifischer Abfluss';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> ist der gesamte spezifische Abfluss an der Gerinneoberkante (Gesamtabfluss je Breiteneinheit). Für ein Gerinne mit Sohlbreite B und Gesamtabfluss Q gilt näherungsweise q<sub>t</sub> ≈ Q / B, oder es wird aus der Grenztiefenbedingung am Gerinneeinlauf berechnet.';
$ec_lang['rc_notes_3_term']='Durchfluss durch die Steinmatte';
$ec_lang['rc_notes_3_def']='Ein Teil des Gesamtabflusses fließt durch die Poren des Bruchsteins (Mattendurchfluss q<sub>m</sub>); der Rest fließt über die Steinoberfläche (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). Die Fließtiefe d wird aus der Manning-Gleichung für den Oberflächenabfluss q<sub>s</sub> mit der Gerinnerauheit n berechnet. Die Standardporosität n<sub>p</sub> = 0,45 ist typisch für gebrochenes Kantgestein.';
$ec_lang['rc_notes_5_term']='Gültiger Steindurchmesserbereich';
$ec_lang['rc_notes_5_def']='Die Gleichungen wurden für einen D<sub>50</sub>-Bereich von 15 mm bis 278 mm entwickelt. Ergebnisse außerhalb dieses Bereichs sind extrapoliert und sollten mit zusätzlichem ingenieurmäßigem Urteilsvermögen verwendet werden.';
$ec_lang['rc_notes_6_term']='Höhenlage Auslaufvorschüttung';
$ec_lang['rc_notes_6_def']='Die Oberkante des Bruchsteins im Auslaufbereich sollte auf oder unter der Sohlhöhe des Unterliegergerinnes liegen. Liegt sie höher, ist der Auslaufstein instabil.';

$ec_lang['rc_notes_7_def']='Wenn die Normaltiefe im Zulaufgerinne kleiner ist als die erforderliche Wehrstauhöhe (H<sub>p</sub>) für den Abfluss q<sub>t</sub>, kommt es oberstrom der Einlaufschüttung zu eingeschränktem Abfluss oder Einstau. Dies ist grundsätzlich akzeptabel — Einstau vermindert die Fließgeschwindigkeit und verhindert Erosion oberstrom. Zur Prüfung: mit einem Wehrrechner H<sub>p</sub> für das gegebene q<sub>t</sub> und die Breite berechnen und mit der Normaltiefe im Zulaufgerinne vergleichen. Übersteigt H<sub>p</sub> die Normaltiefe, tritt Einstau auf.';
$ec_lang['rc_notes_4_term']='Literatur';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., und Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. Der USDA ARS veröffentlicht auch ein <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel-Arbeitsblatt</a> auf Basis derselben Methode.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Filter';
$ec_lang['rc_sketch_top_crest_curve'] = 'Oberkantenkurve';
$ec_lang['rc_sketch_outlet_apron']    = 'Auslaufvorschüttung';
$ec_lang['rc_sketch_radius']          = 'Radius';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Bewässerungsdruck';
$ec_lang['ip_main_title']='Kostenloser Online-Rechner für Bewässerungsdruck und Verteilungsgleichmäßigkeit';
$ec_lang['ip_main_desc']='Testzweig-Druck und Gleichmäßigkeitsschätzung';
$ec_lang['ip_h_supply']='Versorgungsdruck';
$ec_lang['ip_elev_supply']='Versorgungshöhe, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Emitter-Bemessungsdurchfluss, q<sub>design</sub>';
$ec_lang['ip_h_design']='Emitter-Bemessungsdruck';
$ec_lang['ip_x']='<span class="ec-help" title="0,5 für Standard-Emitter ohne Druckausgleich; nahe 0 für druckkompensierte Emitter">Emitter-Abflussexponent, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Testpfad';
$ec_lang['ip_group_reach']='Strecke';
$ec_lang['ip_group_upstream']='Oberstrom';
$ec_lang['ip_group_downstream']='Unterstrom';
$ec_lang['ip_group_loss']='Verlust';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Aktiviert: Diese Strecke ist ein Segment der Testleitung (Lateral), aus der einzelne Emitter Wasser entnehmen. Nicht aktiviert: Diese Strecke ist eine Hauptleitung, die den Durchfluss nur an Laterale weiterleitet, die nicht auf dem Testpfad liegen.">Lat. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Lateral-Zeilen: nur die Emitter in dieser Strecke. Hauptleitungs-Zeilen: Gesamtzahl der Emitter auf Lateralen AUSSER diesem, die von dieser Strecke abzweigen. Für die Strecke der Hauptleitung, die an der Testleitung endet, zählen zusätzlich alle Laterale, die weiter entlang der Hauptleitung liegen, oder die denselben Knotenpunkt teilen (z. B. ein gegenüberliegendes Lateral) — ihr Durchfluss zweigt ebenfalls von dieser Strecke ab.">Emitter <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Höhe am unterstromigen Ende dieser Strecke. Optional bei inneren Zeilen (Standard: eben / gleich wie der Knoten darüber, falls leer gelassen). Erforderlich in der letzten Zeile: dieser Wert ist die Höhe des letzten Emitters, der direkt den erforderlichen Versorgungsdruck bestimmt.">US Höhe <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Höhe des letzten Emitters (letzte Zeile) wurde leer gelassen und standardmäßig auf eben gesetzt — für ein genaues Ergebnis bitte eingeben';
$ec_lang['ip_press']='Druck';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Gesamter Streckenverlust, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Niedriger/negativer Druck — auf subatmosphärische Bedingungen prüfen';
$ec_lang['ip_pressure_warn_short']='Niedrig';
$ec_lang['ip_pressure_high']='Hoher Druck — Druckminderung erforderlich';
$ec_lang['ip_pressure_high_short']='Hoch';
$ec_lang['ip_max_head']='Max. zul. Druck';
$ec_lang['ip_max_head_tip']='Leitungen, deren Druck diesen Wert überschreitet, werden markiert. Leer lassen, um die Prüfung auf zu hohen Druck zu überspringen.';
$ec_lang['ip_h_far']='Druck am letzten Emitter';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Durchfluss, der nur in den modellierten Testpfad eintritt — für die gesamte Zone/das System siehe Q_zone unter Anwendungsauslegung weiter unten.">Versorgungsdurchfluss des Testpfads, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Durchfluss des letzten Emitters, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Durchschnittlicher Emitter-Durchfluss (Testleitung), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="Wie viel höher (oder niedriger) Sie schätzen, dass eine typische Leitung im Vergleich zu dieser Testleitung arbeitet. Die Testleitung ist bewusst der angenommene schlechteste Fall, daher unterschätzt ihr eigener Durchschnitt den Feld-Durchschnitt — bei 0 belassen, verwenden die Gleichmäßigkeitsprüfung und die Zahlen zur Anwendungsauslegung unten den eigenen (wahrscheinlich optimistischen) Durchschnitt der Testleitung unverändert.">Geschätzte Δ-Druckdifferenz, Durchschn. gegenüber Testleitung <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral neu bewertet bei jeder Lateral-Zeile mit deren Druck plus der oben eingegebenen Druckdifferenz — ein Versuch, dafür zu korrigieren, dass die Testleitung der angenommene schlechteste Fall ist und nicht repräsentativ. Fließt sowohl in die Gleichmäßigkeitsprüfung als auch in den Abschnitt Anwendungsauslegung weiter unten ein.">Geschätzter Feld-Durchschnitt Emitter-Durchfluss, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Der berechnete Durchfluss des letzten Emitters geteilt durch den geschätzten Feld-Durchschnitt des Emitter-Durchflusses — dies ist eine Annäherung an die standardmäßige Verteilungsgleichmäßigkeit des unteren Viertels (Durchschnitt der unteren Gruppe ÷ Populationsmittelwert); sie stammt jedoch aus einer klein modellierten Stichprobe und einer vom Benutzer geschätzten Korrektur statt aus einer vollständigen statistischen Feldstichprobe. Werte bei oder über 1 sind möglich und gültig: Sie bedeuten nur, dass der Druck des letzten Emitters bei oder über dem geschätzten Feld-Durchschnitt liegt, sodass ein anderer Emitter der Punkt mit dem niedrigsten Druck ist. Dies kann daran liegen, dass der letzte Emitter auf tiefer gelegenem Gelände liegt, oder daran, dass die Δ-Druck-Schätzung zu klein ist.">Gleichmäßigkeitsprüfung, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Der Druck am Testemitter ist ≥ Versorgungsdruck. Dies ist wahrscheinlich nicht der Emitter mit dem schlechtesten Fall, oder die Rohre könnten kleiner dimensioniert werden.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Dies unterscheidet sich von unserer Annäherung an das standardmäßige Gleichmäßigkeitsmaß.">Durchfluss des letzten Emitters ÷ Bemessungsdurchfluss, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Keine Lösung: Der erforderliche Versorgungsdruck übersteigt den eingegebenen Versorgungsdruck. Erhöhen Sie den Versorgungsdruck, verringern Sie den Bedarf, oder verwenden Sie ein größeres Rohr.';
$ec_lang['ip_notes_1_def']='Schätzt den Druck am letzten (entferntesten) Emitter und führt dann die Energielinie Strecke für Strecke zurück zur Versorgung, wobei Reibungs- und örtliche (Einzel-)Verluste addiert werden. Höhe und Geschwindigkeitshöhe werden an jedem Knoten abgezogen, um dort den tatsächlichen Druck auszugeben. Der geschätzte Druck am Fernende wird (per Bisektion) so lange angepasst, bis der berechnete erforderliche Versorgungsdruck mit dem eingegebenen Versorgungsdruck übereinstimmt — dasselbe geschlossene Problem, das auch der Rohrdurchfluss-Löser im Rechner Manning-Rohrdurchfluss löst, hier erweitert auf ein verzweigtes Netz.';
$ec_lang['ip_notes_2_term']='Hauptleitungs- und Lateralstrecken';
$ec_lang['ip_notes_2_def']='Jede Zeile ist eine Strecke entlang des einzigen hydraulisch schlechtesten Pfades (des Testpfads) von der Versorgung zum letzten Emitter. Eine Hauptleitungsstrecke leitet den Durchfluss nur an Laterale weiter, die nicht auf dem Testpfad liegen, daher ist ihre Entnahme eine einfache Multiplikation (Bemessungsdurchfluss × Gesamtzahl der Emitter dieser Strecke) — ohne lokale Druckabhängigkeit. Die Hauptleitung ist ein gemeinsames Stammrohr, daher muss die Strecke der Hauptleitung, die an der Testleitung endet, nicht nur die Laterale zwischen ihren eigenen Endpunkten einschließen, sondern auch alle Laterale, die noch weiter unten an der Hauptleitung liegen, oder die denselben Knotenpunkt teilen (z. B. ein gegenüberliegendes Lateral) — deren Durchfluss verläuft durch dieselbe Strecke, bevor er abzweigt, unabhängig davon, ob sie sonst irgendwo in dieser Tabelle auftauchen. Eine Lateralstrecke ist ein Segment der Testleitung selbst: Die Emitterabgabe wird aus dem tatsächlichen lokalen Druck über q = k·H<sup>x</sup> berechnet, und der Reibungsverlust wird durch Christiansens F(n)-Faktor verringert, um die Abnahme des Durchflusses zu berücksichtigen, da jeder Emitter in der Strecke Wasser entnimmt.';
$ec_lang['ip_notes_3_term']='Einschränkungen';
$ec_lang['ip_notes_3_def']='Modelliert einen festen Versorgungsdruck (keine Pumpenkennlinie), nur einen Testpfad (nicht das gesamte Feld) und eine Emitterkurve mit 2 Parametern (setzen Sie den Exponenten nahe 0, um einen druckkompensierten Emitter anzunähern). Es werden zwei unterschiedliche Gleichmäßigkeitsverhältnisse ausgegeben, die bewusst getrennt gehalten werden: q<sub>last</sub>/q<sub>avg,field</sub> ist eine Annäherung an die standardmäßige Verteilungsgleichmäßigkeit des unteren Viertels (Durchschnitt der unteren Gruppe ÷ Populationsmittelwert); dies stammt jedoch aus einer klein modellierten Stichprobe und einer vom Benutzer geschätzten Korrektur anstelle der vollständigen statistischen Feldstichprobe. Außerdem ist die Testleitung bewusst der angenommene schlechteste Fall, sodass ihr roher, unkorrigierter Durchschnitt den wahren Feld-Durchschnitt unterschätzen und die Gleichmäßigkeit besser erscheinen lassen würde, als sie ist; die Δ-Druck-Eingabe existiert eigens, um diese Verzerrung auszugleichen. Werte für die Gleichmäßigkeit bei oder über 1 sind weiterhin möglich: Sie bedeuten nur, dass der Druck des letzten Emitters bei oder über dem geschätzten Feld-Durchschnitt liegt, sodass ein anderer Emitter der Punkt mit dem niedrigsten Druck ist. Dies kann daran liegen, dass der letzte Emitter auf tiefer gelegenem Gelände liegt, oder daran, dass die Δ-Druck-Schätzung zu klein ist. q<sub>last</sub>/q<sub>design</sub> ist eine andere, nicht auf Gleichmäßigkeit bezogene Prüfung gegen den vom Hersteller angegebenen Nenndurchfluss — nützlich, um ein insgesamt über- oder unterdruckbeaufschlagtes System zu erkennen, aber es ist eine separate Prüfung, die zusammen mit dem Gleichmäßigkeitswert zu lesen ist, da der Bemessungs-/Nenndurchfluss unabhängig vom tatsächlichen mittleren Betriebsdruck des Systems ist.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). „Irrigation by sprinkling." California Agricultural Experiment Station Bulletin 670. Die ASAE/ASABE-Normen für die Mikrobewässerungsauslegung verwenden denselben Mehrfachauslass-Reibungsverlust-Ansatz.';
$ec_lang['ip_notes_5_term']='Anwendungsauslegung';
$ec_lang['ip_notes_5_def']='Beregnungsintensität und System-/Zonendurchfluss verwenden den geschätzten Feld-Durchschnitt des Emitter-Durchflusses (q<sub>avg,field</sub> — der eigene Durchschnitt der Testleitung, korrigiert durch die eingegebene Δ-Druck-Schätzung), nicht eine geschätzte Rate: PR = q<sub>avg,field</sub> / A<sub>e</sub>, gespeist vom korrigierten modellierten Wert. Abstand sowie systemweite Lateral-/Emitterzahlen sind hier separate Eingaben, da der Testpfad nur einen Zweig mit dem schlechtesten Fall modelliert, nicht jedes Lateral im Feld.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Verzweigtes Rohrnetz';
$ec_lang['bpn_main_title']='Kostenloser Online-Druckrechner für verzweigte Rohrnetze (ohne Ringschluss)';
$ec_lang['bpn_main_desc']='Durchfluss und Druck im verzweigten Rohrnetz (Baumstruktur)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Statische Versorgungshöhe: die Quellhöhe bei Durchfluss null. Ein Wasserspiegel in Reservoir oder Tank über der Versorgungshöhe, oder die Nullförderhöhe einer Pumpe. Punkte 2 und 3 hinzufügen, um eine Pumpen- oder veränderliche Versorgungskennlinie festzulegen; das Werkzeug liest die Höhe beim Bemessungsdurchfluss ab.';
$ec_lang['bpn_elev_source']='Versorgungshöhe';
$ec_lang['bpn_q_total']='Gesamtdurchfluss';
$ec_lang['bpn_q_total_tip']='Gesamtdurchfluss, der die Quelle verlässt (Summe aller Entnahmen im Netz).';
$ec_lang['bpn_p_min']='Niedrigster Druck';
$ec_lang['bpn_p_min_tip']='Der niedrigste unterstromige Druck im gesamten Netz; der kritische Übergabepunkt.';
$ec_lang['bpn_method']='Reibungsmethode';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Rohrleitungen';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Name dieser Rohrleitung. Andere Leitungen verweisen in der Spalte Oberstrom-ID darauf.';
$ec_lang['bpn_upstream']='Oberstrom-ID';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID der Leitung, die diese speist. Leer lassen, um der unmittelbar darüberliegenden Leitung zu folgen (einfache Reihenleitung). Hier eine ID eingeben, um von einer anderen Leitung abzuzweigen.';
$ec_lang['bpn_roughness_tip']='Rohrrauheit für die gewählte Reibungsmethode: Manning n, Hazen-Williams C oder Darcy-Weisbach-Rauheitshöhe e (eine Länge). Typisches glattes Kunststoffrohr: n etwa 0,009, C etwa 150, e etwa 0,0015 mm.';
$ec_lang['bpn_demand']='Entnahme';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Fester Durchfluss, der am unterstromigen Ende dieser Leitung entnommen wird.';
$ec_lang['bpn_demand_mult']='Entnahmefaktor';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Skaliert die Entnahme aller Leitungen gleichzeitig — etwa für eine Spitzenstunden- oder Zukunftsprognose. Für die eingegebenen Entnahmewerte 1 verwenden.';
$ec_lang['bpn_elev_down']='US-Höhe';
$ec_lang['bpn_q_line']='Leitungsdurchfluss';
$ec_lang['bpn_q_line_tip']='Gesamtdurchfluss, den diese Leitung führt: ihre eigene Entnahme plus jede unterstromige Entnahme, die sie versorgt.';
$ec_lang['bpn_p_down']='US-Druck';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Druckhöhe (Überdruck) am unterstromigen Knoten dieser Leitung. Ein negativer Wert (markiert) bedeutet Unterdruck (unter Atmosphärendruck); Bemessung prüfen.';
$ec_lang['bpn_sketch_heading']='Netzdiagramm';
$ec_lang['bpn_source_label']='Quelle';
$ec_lang['bpn_line_problem']='Diese Leitung ist nicht mit der Quelle verbunden: Sie verweist auf eine unbekannte Oberstrom-ID, verweist auf sich selbst, wiederholt eine ID, die eine andere Leitung bereits verwendet, oder bildet einen Ringschluss. Nicht verbundene Leitungen bleiben ungelöst.';
$ec_lang['bpn_bad_id_short']='Fehlerhafte ID';


$ec_lang['bpn_pressure_warn']='Niedriger/negativer Druck; auf Unterdruck (unter Atmosphärendruck) prüfen';
$ec_lang['bpn_pressure_warn_short']='Niedrig';
$ec_lang['bpn_notes_1_term']='Standardmäßig in Reihe, verzweigt nur bei Bedarf';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Oberstrom-ID leer lassen, und eine Leitung folgt der darüberliegenden; eine einfache Reihenleitung. Die ID einer Oberstromleitung eingeben, um von ihr abzuzweigen. Also: standardmäßig in Reihe, ein Baum, wenn er gebraucht wird.';
$ec_lang['bpn_notes_2_term']='Nur verzweigte Netze, keine Ringschlüsse';
$ec_lang['bpn_notes_2_def']='Jede Leitung hat genau eine Oberstromleitung (ein Baum). Dieses Werkzeug löst keine vermaschten (Ring-)Netze; dafür sind iterative Methoden nötig (EPANET oder ähnlich). Der Verzicht auf Ringschlüsse hält es einfach und exakt.';
$ec_lang['bpn_notes_3_term']='Keine aktiven Druckregler';
$ec_lang['bpn_notes_3_def']='Ein fester Einzelverlust-Ventilbeiwert (ein k-Wert) kann hinzugefügt werden, aber keine Druckminder- oder Druckhalteventile (PRV/PSV). Deren Öffnungs-/Schließzustand hängt von Durchfluss und Druck ab, was Iteration erzwingen würde.';


$ec_lang['bpn_supply2_q']='Versorgungsdurchfluss 2';
$ec_lang['bpn_supply2_h']='Versorgungshöhe 2';
$ec_lang['bpn_supply3_q']='Versorgungsdurchfluss 3';
$ec_lang['bpn_supply3_h']='Versorgungshöhe 3';
$ec_lang['bpn_supply_pt_tip']='Optionale Punkte 2 und 3 der Versorgungskennlinie. Für jeden einen Durchfluss und eine Höhe eingeben, um eine Pumpe oder jede Quelle abzubilden, deren Höhe mit steigender Abgabe sinkt; das Werkzeug liest die Höhe beim Bemessungsdurchfluss ab. Punkt 1 oben ist die statische Höhe bei Durchfluss null. 2 und 3 für eine konstante Reservoirhöhe leer lassen.';
$ec_lang['bpn_h_supply']='Versorgungshöhe';
$ec_lang['bpn_h_supply_tip']='Quellhöhe beim Bemessungsdurchfluss, abgelesen von der Versorgungskennlinie. Entspricht der eingegebenen Quellhöhe, wenn die Kennlinie flach verläuft (ein Reservoir).';
$ec_lang['bpn_supply1_h']='Statische Versorgungshöhe';
$ec_lang['lpn_main_menu']='Wasserversorgungsnetz';
$ec_lang['lpn_main_title']='Kostenlose Online-Modellierung von Wasserverteilungsnetzen mit dem EPANET-Löser';
$ec_lang['lpn_main_desc']='Wasserversorgungsnetz-Analyse: Zeichnen Sie ein vermaschtes Rohrnetz oder importieren Sie EPANET-Dateien';
$ec_lang['lpn_title_units']='{units}-Einheiten';
$ec_lang['lpn_tool_select']='Auswählen';
$ec_lang['lpn_tool_add_junction']='Entnahmeknoten';
$ec_lang['lpn_tool_add_reservoir']='Reservoir';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Tank';
$ec_lang['lpn_tool_add_pipe']='Rohr';
$ec_lang['lpn_tool_add_pump']='Pumpe';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Ventil';
$ec_lang['lpn_tool_add_text']='Text';
$ec_lang['lpn_tool_vertices']='Stützpunkte';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Kunde';
$ec_lang['lpn_tool_add_meter_tip']='Klicken Sie dort, wo sich der Kunde befindet, und klicken Sie dann auf das Rohr oder den Knoten, der ihn versorgt. Die Entnahme, die Sie dem Kunden zuweisen, wird dem Entnahmeknoten am nahen Ende dieses Rohrs hinzugefügt.';
$ec_lang['lpn_mode_add_meter']='Modus: Kunde hinzufügen. Klicken Sie dort, wo sich der Kunde befindet, und klicken Sie dann auf das Rohr oder den Knoten, der ihn versorgt. Oder verwenden Sie Esc, um abzubrechen.';
$ec_lang['lpn_pane_tab_customers']='Kunden';
$ec_lang['lpn_customer_heading']='Kunde {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Entnahme je Anschluss';
$ec_lang['lpn_field_meter_count']='Anzahl der Anschlüsse';
$ec_lang['lpn_field_meter_total']='Gesamtentnahme';
$ec_lang['lpn_field_meter_total_tip']='Die Entnahme je Anschluss mal die Anzahl der Anschlüsse. Dies ist die Zahl, die dem unten genannten Entnahmeknoten hinzugefügt wird.';
$ec_lang['lpn_field_meter_pipe']='Verbundenes Element';
$ec_lang['lpn_field_meter_pipe_suggest']='Das nächstgelegene Element ist {id}. Geben Sie es hier ein, um diesen Kunden von dort aus zu versorgen.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Verbunden mit';
$ec_lang['lpn_field_meter_node_tip']='Der Entnahmeknoten, mit dem dieser Kunde verbunden ist. Ziehen Sie den Anschlusspunkt auf ein Rohr, um ihn stattdessen von einer Station entlang dieses Rohrs zu versorgen.';
$ec_lang['lpn_meter_pipe_unknown']='Nichts in diesem Projekt heißt {id}, daher wurde der Kunde dort belassen, wo er war.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='Kein Muster in diesem Projekt heißt {id}, daher wurde der Kunde unverändert belassen.';
$ec_lang['lpn_meter_placed']='Kunde {id} hinzugefügt. Seine Beschreibung und Entnahme werden in der Tabelle Kunden eingegeben, oder klicken Sie ihn im Modus Auswählen an, um sein Feld zu öffnen.';
$ec_lang['lpn_field_meter_pipe_tip']='Das Element, mit dem dieser Anschluss verbunden ist. Geben Sie hier oder in der Tabelle Kunden ein anderes ein, um es zu ändern, oder ziehen Sie den Anschlusspunkt auf ein anderes Element.';
$ec_lang['lpn_field_meter_station']='Station entlang des Rohrs (%)';
$ec_lang['lpn_field_meter_station_tip']='Wie weit entlang des Rohrs der Anschluss ansetzt, als Prozentsatz des Rohrs von seinem ersten Knoten zu seinem zweiten. 0 liegt an einem Ende, 100 am anderen. Der Kreis auf dem Rohr bewirkt dasselbe mit dem Zeiger.';
$ec_lang['lpn_field_meter_offset']='Abstand vom Rohr';
$ec_lang['lpn_field_meter_offset_tip']='Positiv ist rechts vom Rohr, vom ersten Knoten zum zweiten gesehen. Die Eingabe eines Werts hier kann den Kunden auf die andere Seite der Hauptleitung verschieben, und die Anschlussleitung steht dabei immer rechtwinklig zur Hauptleitung.';
$ec_lang['lpn_field_meter_lumped']='Zum Knoten hinzugefügt';
$ec_lang['lpn_field_meter_lumped_tip']='Nächstgelegener Knoten; die Entnahmen dieses Kunden werden dort hinzugefügt.';
$ec_lang['lpn_node_customers']='Kundenentnahmen';
$ec_lang['lpn_node_customers_tip']='Liste der an diesem Knoten hinzugefügten Kunden (weil dieser der nächstgelegene war). Kundenentnahmen kommen zu den anderen hier aufgeführten Entnahmen hinzu. Ein Kunde wird dort bearbeitet, wo er auf der Karte sitzt, oder in der Tabelle Kunden.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} von {n} Kunden';
$ec_lang['lpn_customer_detached']='⚠ Dieser Kunde ist mit keinem Rohr verbunden, daher steckt seine Entnahme nicht in den Ergebnissen. Löschen Sie ihn, oder zeichnen Sie ein Rohr und verschieben Sie den Kunden darauf.';
$ec_lang['lpn_customer_fixed_head']='⚠ Das nahe Ende dieses Rohrs hat einen festen Wasserspiegel, daher wirkt sich diese Entnahme nicht auf die Simulation aus.';
$ec_lang['lpn_customer_detached_count']='{n} Kunden sind mit keinem Rohr verbunden. Ihre Entnahme wird nicht berücksichtigt.';
$ec_lang['lpn_meter_pick_pipe']='Klicken Sie jetzt auf das Rohr oder den Knoten, der diesen Kunden versorgt. Der Kunde bleibt, wo Sie ihn platziert haben. Drücken Sie Escape, um abzubrechen.';
$ec_lang['lpn_inp_export_flat_customers']='Eine EPANET-Datei kennt keine Kunden. Die Entnahme der {n} Kunden in diesem Projekt geht als Entnahmezeile am Entnahmeknoten in die Datei ein, dem jeder Kunde zugeordnet ist, und jede Zeile trägt das Tag des Kunden als Namen. Was die Datei nicht aufnehmen kann, ist der Kunde selbst: wo er sitzt, welches Rohr ihn versorgt, wo entlang dieses Rohrs der Anschluss ansetzt, und wie viele Anschlüsse ein Kunde vertritt. Ihre eigene Projektdatei bewahrt all das.';

$ec_lang['lpn_area_hint_window_start']='Klicken Sie auf eine Ecke des Fensters.';
$ec_lang['lpn_area_hint_window_go']='Klicken Sie auf die gegenüberliegende Ecke, um abzuschließen.';
$ec_lang['lpn_area_hint_lasso_start']='Klicken Sie, um den Umriss zu beginnen.';
$ec_lang['lpn_area_hint_lasso_go']='Bewegen Sie sich, um den Umriss zu zeichnen. Klicken Sie zum Abschließen.';
$ec_lang['lpn_area_hint_polygon_start']='Klicken Sie, um die Polygonfläche zu zeichnen. Doppelklicken Sie zum Abschließen.';
$ec_lang['lpn_area_hint_polygon_go']='Klicken Sie auf jede Ecke. Doppelklicken Sie auf die letzte, um abzuschließen.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Halten Sie beim Auswählen die Umschalttaste gedrückt, um mit der bestehenden Auswahl fortzufahren und Ihre Auswahl hinzuzufügen oder zu entfernen (umschalten).';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Drücken Sie auf die Karte, ziehen Sie um das Gewünschte und lassen Sie dann los.';
$ec_lang['lpn_area_hint_touch_go']='Ziehen Sie um das Gewünschte und lassen Sie zum Abschließen los.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Dies anzeigen';
$ec_lang['lpn_multi_title']='{n} ausgewählt';
$ec_lang['lpn_multi_varies']='Unterschiedlich';
$ec_lang['lpn_multi_applied']='{prop} bei {n} festgelegt.';
$ec_lang['lpn_multi_no_fields']='Diese haben nichts, was hier gemeinsam festgelegt werden kann.';
$ec_lang['lpn_pane_pasted']='{n} Zellen eingefügt. {skipped} wurden nicht geändert.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='{n} Zeilen eingefügt, davon {created} zum Netz hinzugefügt.';
$ec_lang['lpn_pane_pasted_rows_skipped']='{n} Zeilen eingefügt, davon {created} zum Netz hinzugefügt. {skipped} Zellen wurden nicht geändert.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Klicken Sie hier und fügen Sie Zeilen aus einer Tabellenkalkulation ein, um sie hinzuzufügen.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Als neue Zeilen am Ende der Tabelle einfügen';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Drücken Sie Ctrl+V, um die kopierten Zeilen unten in dieser Tabelle hinzuzufügen. Drücken Sie Esc, um abzubrechen.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Dieser Einfügevorgang hat {n} Zeilen, von denen {fit} in die Tabelle passen. Die übrigen {extra} als neue Zeilen unten hinzufügen?';
$ec_lang['lpn_pane_paste_overflow_add']='{extra} Zeilen hinzufügen';
$ec_lang['lpn_pane_paste_overflow_fit']='Nur die {fit} passenden einfügen';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Dieser Einfügevorgang hat {n} Zeilen, von denen {fit} in die Tabelle passen. Die übrigen {extra} können nicht als neue Zeilen hinzugefügt werden: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} IDs stimmen nicht überein. Trotzdem einfügen?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Es wurde nichts eingefügt. {reasons}';
$ec_lang['lpn_pane_paste_more']='Weitere Zeilen mit Problemen, hier nicht angezeigt: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Zeile {row}: Eine neue Zeile braucht eine ID.';
$ec_lang['lpn_pane_paste_bad_id']='Zeile {row}: Die ID {id} enthält ein Leerzeichen oder ein Anführungszeichen.';
$ec_lang['lpn_pane_paste_id_taken']='Zeile {row}: Die ID {id} wird bereits verwendet.';
$ec_lang['lpn_pane_paste_id_twice']='Zeile {row}: Die ID {id} wird in diesem Einfügevorgang zweimal verwendet.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Zeile {row}: Ein neuer Knoten braucht sowohl {first} als auch {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Zeile {row}: Eine neue Verbindung braucht einen Von-Knoten und einen Nach-Knoten.';
$ec_lang['lpn_pane_paste_no_node']='Zeile {row}: Der Knoten {id} existiert noch nicht. Fügen Sie zuerst Ihre Knoten ein, dann Ihre Verbindungen.';
$ec_lang['lpn_pane_paste_same_ends']='Zeile {row}: Von und Nach sind derselbe Knoten.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Zeile {row}: {text} ist kein gültiger Wert für {col}.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Zeile {row}: Ein neuer Text braucht sowohl {first} als auch {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Zeile {row}: {id} ist noch kein Knoten oder Rohr in diesem Netz. Fügen Sie es zuerst ein, dann diesen Text.';
$ec_lang['lpn_pane_paste_customer_no_position']='Zeile {row}: Ein neuer Kunde braucht sowohl {first} als auch {second}.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Zeile {row}: Ein neuer Kunde braucht ein verbundenes Rohr oder einen verbundenen Knoten.';
$ec_lang['lpn_pane_paste_no_pipe']='Zeile {row}: Das Rohr {id} existiert noch nicht. Fügen Sie zuerst Ihre Rohre ein, dann Ihre Kunden.';
$ec_lang['lpn_pane_paste_no_customer_node']='Zeile {row}: Der Knoten {id} existiert noch nicht. Fügen Sie zuerst Ihre Entnahmeknoten ein, dann Ihre Kunden.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Zeile {row}: Der Knoten {id} hat kein Rohr, an das ein Kunde angeschlossen werden kann.';

$ec_lang['lpn_pane_filled']='{n} Zellen nach unten ausgefüllt. {skipped} wurden nicht geändert.';
$ec_lang['lpn_pane_filldown']='Nach unten ausfüllen';
$ec_lang['lpn_pane_fill_none']='In dieser Auswahl kann nichts nach unten ausgefüllt werden.';
$ec_lang['lpn_pane_ctrlenter_filled']='{n} Zellen ausgefüllt. {skipped} wurden nicht geändert.';
$ec_lang['lpn_pane_hide_col']='Diese Spalte ausblenden';
$ec_lang['lpn_pane_hide_cols']='Diese Spalten ausblenden';
$ec_lang['lpn_pane_show_all_cols']='Alle Spalten anzeigen';
$ec_lang['lpn_pane_sort_asc']='Aufsteigend sortieren';
$ec_lang['lpn_pane_manage_cols']='Spalten verwalten…';
$ec_lang['lpn_pane_manage_cols_title']='Spalten verwalten';
$ec_lang['lpn_pane_manage_cols_show']='Anzeigen';
$ec_lang['lpn_pane_manage_cols_up']='Nach oben verschieben';
$ec_lang['lpn_pane_manage_cols_down']='Nach unten verschieben';
$ec_lang['lpn_pane_manage_cols_top']='An den Anfang verschieben';
$ec_lang['lpn_pane_manage_cols_bottom']='An das Ende verschieben';
$ec_lang['lpn_pane_colmenu_tip']='Spalten ausblenden oder verwalten';
$ec_lang['lpn_tool_area_window']='Fenster auswählen';
$ec_lang['lpn_tool_area_lasso']='Lasso auswählen';
$ec_lang['lpn_tool_area_polygon']='Polygon auswählen';
$ec_lang['lpn_tool_delete']='Löschen';
$ec_lang['lpn_tool_zoom_extent']='Alles anzeigen';
$ec_lang['lpn_tool_zoom_window']='Fenster zoomen';
$ec_lang['lpn_zoom_in']='Vergrößern';
$ec_lang['lpn_zoom_out']='Verkleinern';
$ec_lang['lpn_new_text']='Text';
$ec_lang['lpn_field_text_bold']='Fetter Text';
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
$ec_lang['lpn_field_text_anchor']='Angeschlossen an';

$ec_lang['lpn_field_text_align']='Horizontale Ausrichtung';
$ec_lang['lpn_field_text_align_left']='Links';
$ec_lang['lpn_field_text_align_center']='Mitte';
$ec_lang['lpn_field_text_align_right']='Rechts';
$ec_lang['lpn_field_text_valign']='Vertikale Ausrichtung';
$ec_lang['lpn_field_text_valign_top']='Oben';
$ec_lang['lpn_field_text_valign_middle']='Mitte';
$ec_lang['lpn_field_text_valign_bottom']='Unten';
$ec_lang['lpn_field_text_rotation']='Winkel (Grad)';
$ec_lang['lpn_field_text_match_pipe']='Zum Winkel der nächsten Verbindung drehen';
$ec_lang['lpn_field_text_flip']='Um 180° drehen';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Verknüpftes Element';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Dieser Text wurde nah genug an einer Anlage platziert, um ihr zu folgen, daher bewegt er sich mit dieser Anlage und hat eine Hinweislinie. Ein Text mit Hinweislinie übernimmt seine horizontale und vertikale Ausrichtung von der Seite, an der er sitzt, weshalb diese beiden Zeilen nicht angeboten werden, solange er verknüpft ist.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Emitterkoeffizient';
$ec_lang['lpn_field_emitter_tip']='Ein zusätzlicher Abfluss, der vom Druck abhängt, etwa für einen Sprinkler, einen offenen Auslass oder ein simuliertes Leck. Der freigesetzte Durchfluss ist dieser Koeffizient mal dem Druck, potenziert mit dem Emitterexponenten, der einmal für das gesamte Netz unter Einstellungen, Berechnung, Hydraulik festgelegt wird. Lassen Sie dieses Feld bei einem gewöhnlichen Entnahmeknoten leer.';
$ec_lang['lpn_field_elev']='Höhe';
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
$ec_lang['lpn_field_head']='Druckhöhe';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Wasserspiegel im Reservoir, angegeben als Höhe, nicht als Druck. Leer lassen, um den Wasserspiegel auf die Reservoirhöhe zu setzen.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='Höhe des Tankbodens. Die Wassertiefen im Tank werden von hier aus nach oben gemessen.';
$ec_lang['lpn_field_tank_level']='Wassertiefe';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Tiefe des im Tank stehenden Wassers, gemessen vom Tankboden nach oben.';
$ec_lang['lpn_field_tank_minlevel']='Niedrigste Wassertiefe';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Minimal zulässige Tiefe, gemessen vom Tankboden nach oben.';
$ec_lang['lpn_field_tank_maxlevel']='Höchste Wassertiefe';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Maximal zulässige Tiefe, gemessen vom Tankboden nach oben.';
$ec_lang['lpn_field_tank_diameter']='Tankdurchmesser';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Für einen senkrechten Zylinder. Gleiche Einheit wie die Höhe, nicht die des Rohrdurchmessers. Sie bestimmt, wie viel Wasser eine bestimmte Tiefe fasst.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Höhe des Wasserspiegels im Tank: die Höhe des Tankbodens zuzüglich der Wassertiefe.';
$ec_lang['lpn_close']='Schließen';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Eigenschaften';
$ec_lang['lpn_empty_hint']='Verwenden Sie Datei, Neues Projekt, um ein Beispiel zu öffnen. Oder beginnen Sie, indem Sie über die Werkzeugleiste ein Reservoir, einen Entnahmeknoten und ein Rohr hinzufügen.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Ihr Netz ist unversehrt.';
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
$ec_lang['lpn_examples_welcome']='Willkommen bei der Modellierung von Wasserversorgungsnetzen, mit dem EPANET-Löser';
$ec_lang['lpn_examples_heading']='Eigene Kopie eines Beispiels öffnen';
$ec_lang['lpn_examples_sub']='Jedes Beispiel öffnet sich als Ihre eigene Kopie. Ändern Sie es, speichern Sie es, oder öffnen Sie eine neue Kopie und beginnen Sie von vorn.';
$ec_lang['lpn_examples_open']='Öffnen';
$ec_lang['lpn_examples_menu']='Beispiel öffnen…';
$ec_lang['lpn_examples_blank']='Oder hier beginnen';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='Knoten: {nodes}, Verbindungen: {links}';
$ec_lang['lpn_examples_failed']='Die Beispiele konnten nicht geladen werden. Verwenden Sie Datei, Neues Projekt, um eine Zeichnung zu beginnen.';
$ec_lang['lpn_examples_loading']='Beispiele werden geladen…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Etwas reparieren';
$ec_lang['lpn_help_notes']='Hinweise zu dieser Seite';
$ec_lang['lpn_help_hotkeys']='Tabellen und Tastenkürzel';
$ec_lang['lpn_hotkeys_tables_heading']='Tabellen';
$ec_lang['lpn_hotkeys_map_heading']='Karte';
$ec_lang['lpn_hotkeys_map_term']='Tastenkürzel der Karte';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 oder Esc</td><td>Auswählen.</td></tr><tr><td>2</td><td>Einen Entnahmeknoten hinzufügen.</td></tr><tr><td>3</td><td>Ein Reservoir hinzufügen.</td></tr><tr><td>4</td><td>Einen Tank hinzufügen.</td></tr><tr><td>5</td><td>Ein Rohr hinzufügen.</td></tr><tr><td>6</td><td>Eine Pumpe hinzufügen.</td></tr><tr><td>7</td><td>Ein Ventil hinzufügen.</td></tr><tr><td>8</td><td>Einen Kunden hinzufügen.</td></tr><tr><td>9</td><td>Text hinzufügen.</td></tr><tr><td>Delete</td><td>Die Auswahl löschen.</td></tr><tr><td>Ctrl+Z</td><td>Die letzte Änderung rückgängig machen.</td></tr><tr><td>+ oder =</td><td>Vergrößern.</td></tr><tr><td>-</td><td>Verkleinern.</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Hier stimmt etwas nicht?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Ein Klick teilt uns mit, dass etwas auf dieser Seite nicht stimmt. Er sendet den Namen dieser Seite, die Sprache, in der Sie sie lesen, und die Meldung auf der Karte, falls es eine gibt. Er sendet nichts von dem, was Sie eingegeben haben, keine Adresse und nichts aus Ihrer Zeichnung. Niemand kann Ihnen antworten, denn dies verrät uns nichts darüber, wer Sie sind. Nutzen Sie Hilfe, Etwas melden, wenn Sie mehr sagen möchten.';
$ec_lang['lpn_wrong_thanks']='Danke. Das hat uns erreicht.';
$ec_lang['lpn_status_example_opened']='{name} geöffnet. Es ist Ihre eigene Kopie: Speichern Sie sie mit Datei, Speichern unter.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Diese Seite konnte die Größe des Zeichenbereichs nicht ermitteln, daher zeigt die Karte die letzte Ansicht, die sie berechnen konnte. Durch Ändern der Fenstergröße wird ein neuer Versuch unternommen. Tritt dies weiterhin auf, ist meist eine Browsererweiterung, die Seitenmessungen blockiert, die Ursache.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Einfaches Netz, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Hier beginnen. Ein Reservoir, eine Pumpe und eine kleine Schleife: die kleinste Anordnung, die noch als Wassernetz funktioniert. Liter pro Sekunde, mit Metern und Millimetern.';
$ec_lang['lpn_ex_basic_us_title']='Einfaches Netz, gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='Dasselbe Startnetz in Gallonen pro Minute, mit Fuß und Zoll.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 plus regelbasierte Steuerungen';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Das kleinste der drei eigenen Beispielnetze von EPANET: ein Reservoir, eine Pumpe und eine einzelne Schleife.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Ein verzweigtes Verteilnetz mit einem Tank, aus den Beispielen von EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Das große Beispiel von EPANET: 92 Entnahmeknoten, 3 Tanks und 2 Reservoire, eines davon ein Fluss. Es lohnt sich, es zu öffnen, um zu sehen, wie ein Modell in echter Größe auf der Karte aussieht.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, Breite/Länge';
$ec_lang['lpn_ex_net3_world_desc']='Das EPANET-Net3-Netz, umgerechnet auf Länge/Breite in Novato, CA, mit der Weltkarte im Hintergrund.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Ein Gewerbestandort, berechnet für Löschwasser zusätzlich zum maximalen Tagesbedarf, zu einem einzelnen Zeitpunkt, über einen Lageplan gezeichnet.';
$ec_lang['lpn_tool_undo']='Rückgängig';
$ec_lang['lpn_confirm_example']='Dies fügt das Beispiel zu dem bereits vorhandenen Netz hinzu. Fortfahren?';
$ec_lang['lpn_field_diameter']='Durchmesser';
$ec_lang['lpn_demand_tip']='Durchflüsse, die diesem Knoten aus dem Netz entnommen werden. Geben Sie eine negative Zahl ein, um hier Durchfluss in das Netz einzuspeisen.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Diese Einheit legt fest, was Ihre Eingaben bedeuten';
$ec_lang['lpn_units_warn_lead']='{unit} ist die Einheit für das, was Sie eingeben bei:';
$ec_lang['lpn_units_options_head']='Wenn Sie eine Einheit ändern:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Nicht destruktiv';
$ec_lang['lpn_units_nondestructive_desc']='Nicht destruktiv: Lässt jede Eingabe unverändert und interpretiert sie in der neuen Einheit neu.';
$ec_lang['lpn_units_destructive']='Destruktiv';
$ec_lang['lpn_units_destructive_desc']='Destruktiv: Schreibt jede Eingabe mit einer mathematischen Umrechnung neu, sodass das Netz innerhalb der Umrechnungstoleranzen physisch nahezu gleich bleibt. Dabei gehen die ursprünglichen Eingaben verloren. Rückgängig stellt sie wieder her.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} Werte bedeuten jetzt {unit}. Es wurde nichts umgeschrieben.';
$ec_lang['lpn_status_converted']='{n} Werte wurden in {unit} umgerechnet.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Länge';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Kartenkoordinaten';
$ec_lang['lpn_units_mapcoords_deg']='Grad';
$ec_lang['lpn_units_usft']='US Survey Foot';
$ec_lang['lpn_units_elevhead']='Höhe und Druckhöhe';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Druckverlustgefälle';
$ec_lang['lpn_result_gradient_tip']='Druckverlust geteilt durch die Rohrlänge. Damit lassen sich Rohre unterschiedlicher Länge gegen einen gemeinsamen Grenzwert vergleichen.';
$ec_lang['lpn_result_water_age']='Wasseralter';
$ec_lang['lpn_result_water_age_tip']='Wie lange sich das Wasser, das diesen Punkt erreicht, bereits im System befindet. Wo Durchflüsse zusammentreffen, bringt das ankommende Wasser eine Mischung von Altern mit, und die Zahl hier ist ihr nach Durchfluss gewichteter Durchschnitt: Ein Entnahmeknoten, der überwiegend von einer kurzen, neuen Hauptleitung versorgt wird, zeigt ein niedriges Alter, selbst wenn ihn auch eine lange Sackleitung speist. In einem Tank ist es das durchschnittliche Alter des gehaltenen Wassers, weshalb ein Tank mit langsamem Wasserwechsel meist das älteste Wasser im Netz enthält. Es gibt keinen behördlichen Grenzwert, an dem sich die Zahl messen lässt; beurteilen Sie sie im Zusammenhang mit Ihrem eigenen System.';
$ec_lang['lpn_result_source_share']='Quellenanteil';
$ec_lang['lpn_result_source_share_tip']='Wie viel des an diesem Punkt ankommenden Wassers vom Verfolgungsknoten stammt. Das gibt die Analyse Quellenverfolgung an.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Durchschnittliches Wasseralter';
$ec_lang['lpn_result_avg_source_share']='Durchschnittlicher Quellenanteil';
$ec_lang['lpn_result_avg_concentration']='Durchschnittliche Konzentration';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Reibungskoeffizient';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Reaktionsrate';
$ec_lang['lpn_result_status']='Status';
$ec_lang['lpn_result_status_open']='Offen';
$ec_lang['lpn_result_status_closed']='Geschlossen';
$ec_lang['lpn_result_head']='Druckhöhe';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Energie des Wassers an diesem Knoten, angegeben als Höhe der Wassersäule. Es ist eine absolute Höhe; der Druck dagegen ist eine Relativmessung (Manometerdruck).';
$ec_lang['lpn_result_pressure']='Druck';
$ec_lang['lpn_result_flow']='Durchfluss';
$ec_lang['lpn_result_velocity']='Geschwindigkeit';
$ec_lang['lpn_result_headloss']='Druckverlust';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Setzt nur die Einstellungen dieses Projekts zurück. Ihre Zeichnung und Ihre anderen Projekte bleiben unverändert. Um Ihre bevorzugten Einstellungen zur Wiederverwendung zu speichern, speichern Sie eine Projektdatei, die nur Einstellungen enthält.';
$ec_lang['lpn_reset_all_tip']='Löscht jedes Projekt, jedes Hintergrundbild, jede Einstellung und Ihre Einheitenwahl und lädt die Seite dann genau so neu, wie sie ein Erstbesucher sieht. Dies ist die einzige Rücksetzung, die alles löscht.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Dieser Rechner speichert Projekteinheiten und Eingaben so, wie sie eingegeben wurden, hat Zahlen früher jedoch zur Speicherung in SI umgerechnet. Dieses Projekt wurde vor dieser Änderung gespeichert, seine Zahlen liegen also in SI vor. Sollen sie ein letztes Mal in die aktuellen Einheiten umgerechnet werden? Damit Sie das beurteilen können, hier einige Durchmesser, die umgerechnet würden, mit ihren Werten vorher und nachher:';
$ec_lang['lpn_v2_restore_yes']='Umrechnen';
$ec_lang['lpn_v2_restore_never']='Nein. Nie wieder fragen.';
$ec_lang['lpn_v2_restore_no']='Schließen, damit ich zuerst die aktuellen Einheiten prüfen kann';
$ec_lang['lpn_storage_too_new']='Dieses Projekt wurde mit einer neueren Version der Seite gespeichert und kann hier nicht geöffnet werden.';
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
$ec_lang['lpn_tool_file']='Datei';
$ec_lang['lpn_menu_edit']='Bearbeiten';
$ec_lang['lpn_menu_insert']='Einfügen';
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
$ec_lang['lpn_menu_map']='Karte';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Straßenkarte anzeigen';
$ec_lang['lpn_basemap_satellite_show']='Satellitenbilder anzeigen';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='Georeferenziert';
$ec_lang['lpn_xymap']='Lokal';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Konvertieren als…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Kopie von {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Konvertieren als';
$ec_lang['lpn_convas_coordsys_tip']='Das Koordinatensystem, in das die Kopie umgewandelt wird. Weicht es von dem dieses Projekts ab, folgen zwei Platzierungsschritte. Ein Projekt, das bereits weiß, wo es liegt, öffnet beide Schritte schon beantwortet, sodass Sie sie so übernehmen oder ändern können.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Aktuell: {crs}';
$ec_lang['lpn_convas_epsg']='EPSG-Koordinatensystem';
$ec_lang['lpn_convas_epsg_tip']='Wählen Sie ein Koordinatensystem aus dem EPSG-Register. Breite und Länge ist WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Unbenannte (lokale) Georeferenzierung';
$ec_lang['lpn_convas_unnamed_tip']='Lokale Koordinaten in der Längeneinheit, mit angehefteter Weltkarte.';
$ec_lang['lpn_convas_none_tip']='Lokale Koordinaten in der Längeneinheit, vorerst ohne Weltkarte.';
$ec_lang['lpn_convas_units_tip']='Die Einheiten, in die die Kopie umgewandelt wird. Das Original behält seine eigenen Zahlen und Einheiten.';
$ec_lang['lpn_convas_round']='Umgewandelte Werte runden';
$ec_lang['lpn_convas_round_tip']='Rundet nur die Zahlen, die diese Umwandlung neu schreibt, auf die von Ihnen gewählte nächste Schrittweite. Werte, deren Einheit sich nicht ändert, bleiben unverändert.';
$ec_lang['lpn_convas_round_none']='Nicht runden';
$ec_lang['lpn_convas_round_flow']='Entnahme und Durchfluss';
$ec_lang['lpn_convas_label_col']='Suffix';
$ec_lang['lpn_convas_label_tip']='Text, der bei den Kartenbeschriftungen der Kopie nach diesem Wert angehängt wird, etwa „ mm“ oder „ gpm“. Wird aus der oben gewählten Einheit vorausgefüllt; leeren für kein Suffix.';
$ec_lang['lpn_convas_oneway']='Ein Zurückkonvertieren ist eine zweite Umwandlung, kein Rückgängig. Eine Zahl, die umgewandelt und zurückumgewandelt wird, kehrt möglicherweise nicht genau zu dem zurück, was eingegeben wurde.';
$ec_lang['lpn_convas_ok']='Umwandeln';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} ist eines der wenigen aufgeführten Koordinatensysteme ohne verwendbare Projektionsangaben, daher kann nicht zu oder von ihm umgewandelt werden. Es wurde nichts umgewandelt.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='Die umgewandelte Kopie ist {name}. Das ursprüngliche Projekt ist unverändert.';
$ec_lang['lpn_convas_cancelled']='Es wurde nichts umgewandelt. Die Kopie wird geschlossen, und das ursprüngliche Projekt ist unverändert.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Kopiert dieses Projekt in einen neuen Tab und wandelt die Kopie in das von Ihnen gewählte Koordinatensystem und die gewählten Einheiten um. Ändert sich das Koordinatensystem, führt Sie ein Assistent zunächst durch das ungefähre Zoomen der Karte hinter Ihrem Netz und dann durch das genauere Skalieren und Drehen Ihres Netzes auf der Karte. Dieses Projekt bleibt genau, wie es ist. Um zu georeferenzieren, ohne etwas umzuwandeln, verwenden Sie stattdessen Karte, Weltkarte, Anheften.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Dieses Projekt ist bereits georeferenziert, das Netz liegt also schon auf der Karte, und nichts wurde verschoben. Prüfen Sie, ob es an der richtigen Stelle liegt, und drücken Sie dann die Schaltfläche Modell hier platzieren und die Schaltfläche Diese Platzierung übernehmen.';
$ec_lang['lpn_georef_intro']='Das Platzieren des Modells erfolgt in zwei Schritten. Schritt 1 ist der schnelle: Das Modell bleibt an seiner Stelle, und Sie bewegen die Karte darunter, bis sich Ihr Standort ungefähr in der richtigen Größe unter dem Modell befindet. Eine Drehung gibt es dabei noch nicht. Schritt 2 ist der genaue: Sie ziehen, skalieren und drehen das Modell selbst. Ihr Projekt liegt zunächst auf einer Karte der ganzen Welt, suchen Sie also zuerst Ihren Standort, und drücken Sie dann Modell hier platzieren.';
$ec_lang['lpn_georef_adjust']='Das Modell steht jetzt auf dem Boden, es bewegt sich also mit der Karte. Ziehen Sie das Modell, um es zu verschieben, ziehen Sie an einer Ecke, um es zu skalieren, ziehen Sie am runden Griff über dem Modell, um es zu drehen. Oder geben Sie unten die Bodenentfernung und den Drehwinkel ein.';
$ec_lang['lpn_georef_step1']='Schritt 1 von 2 — schnell';
$ec_lang['lpn_georef_step2']='Schritt 2 von 2 — genau';
$ec_lang['lpn_georef_step1_hint']='Ihr Projekt bleibt an seiner Stelle auf dem Bildschirm. Verschieben und zoomen Sie die Karte darunter, bis der Untergrund ungefähr an der richtigen Stelle und in der richtigen Größe liegt, und drücken Sie dann Modell hier platzieren.';
$ec_lang['lpn_georef_detach']='Wieder aufnehmen';
$ec_lang['lpn_georef_size_prompt']='Wie breit ist das Gelände ungefähr, über das gesamte Projekt hinweg?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Tastenkürzel: {key} drücken.';
$ec_lang['lpn_tool_key_hint_two']='Tastenkürzel: {key} oder {key2} drücken.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Klicken Sie wie angegeben auf die Karte, um alles innerhalb der Form auszuwählen. Drücken Sie diese Schaltfläche erneut, um die Form zwischen Fenster, Lasso und Polygon zu wechseln. Halten Sie beim Auswählen die Umschalttaste gedrückt, um mit der bestehenden Auswahl fortzufahren und Ihre Auswahl hinzuzufügen oder zu entfernen (umschalten).';
$ec_lang['lpn_area_selected']='{n} ausgewählt.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='In diesem Bereich wurde nichts gefunden.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Fügt die Stützpunkte hinzu oder entfernt sie, die den Verlauf eines Rohrs auf der Karte festlegen. Klicken Sie auf ein Rohr, um einen Stützpunkt hinzuzufügen, klicken Sie auf einen Stützpunkt, um ihn zu entfernen, und ziehen Sie einen Stützpunkt, um ihn zu verschieben. Ein Stützpunkt ändert nur den gezeichneten Verlauf, nicht die Hydraulik.';
$ec_lang['lpn_tool_undo_tip']='Macht die letzte Änderung rückgängig.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Passt das gesamte Netz in das Fenster ein.';
$ec_lang['lpn_tool_zoom_window_tip']='Klicken Sie auf zwei gegenüberliegende Ecken eines Rechtecks auf der Karte, oder ziehen Sie eines auf, um dorthin zu zoomen. Drücken Sie diese Schaltfläche erneut für Alles anzeigen.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Vergrößern. Tastenkürzel: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Verkleinern. Tastenkürzel: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Findet ein Element anhand seiner ID, oder findet alle Elemente, die eine Bedingung erfüllen, und ändert sie alle auf einmal.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Legende der Symbolleiste';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Sichtbarkeit';
$ec_lang['lpn_color_legend_open_tip']='Klicken, um das Panel Sichtbarkeit zu öffnen und diese Farben zu ändern.';
$ec_lang['lpn_color_node_field']='Knoten einfärben nach';
$ec_lang['lpn_color_link_field']='Rohre einfärben nach';
$ec_lang['lpn_color_ramp_sequential']='Sequenziell';
$ec_lang['lpn_color_ramp_diverging']='Divergierend';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Anzahl der Bereiche';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Bereichszuordnung';
$ec_lang['lpn_color_ranges_note']='Die untenstehenden Grenzen sind, einmal festgelegt, fest; sie folgen den Ergebnissen nicht, wenn diese sich ändern. Die Wahl einer Klassifizierungsmethode für die Daten oben setzt die Grenzen anhand des aktuellen Systemzustands. Wenn Sie einen Wert von Hand ändern, wird die Methode oben zu Manuell.';
$ec_lang['lpn_color_criterion_note']='Diese Methode entnimmt ihre Grenzen einer Bemessungsnorm, daher ist die Anzahl der Farben festgelegt, solange diese Methode gewählt ist.';
$ec_lang['lpn_color_break_number']='Eine Grenze muss eine Zahl sein. Die Karte bleibt unverändert.';
$ec_lang['lpn_color_break_order']='Jede Grenze muss größer sein als die vorherige. Die Karte bleibt unverändert.';
$ec_lang['lpn_color_break_count']='Es muss eine Grenze weniger geben als die Anzahl der Farben. Die Karte bleibt unverändert.';
$ec_lang['lpn_color_ramp_qualitative']='Qualitativ';
$ec_lang['lpn_color_ramp_rainbow']='Regenbogen';
$ec_lang['lpn_color_ramp_rainbow_eg']='entspricht EPANET';
$ec_lang['lpn_color_example_material']='Material';
$ec_lang['lpn_color_ramp_ylgnbu']='Gelb nach Blau';
$ec_lang['lpn_color_ramp_rdylbu']='Rot nach Blau, über Gelb';
$ec_lang['lpn_georef_drop']='Modell hier platzieren';
$ec_lang['lpn_georef_finish']='Diese Platzierung übernehmen';
$ec_lang['lpn_georef_scale']='Bodenentfernung je Zeicheneinheit';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Wie weit eine Einheit Ihrer Zeichnung auf dem Boden reicht. Eine auf einem einfachen Raster erstellte Zeichnung sagt darüber normalerweise nichts aus, legen Sie es also hier fest — oder lassen Sie Gehe zu… Sie fragen, wie breit das Gelände ist, und es daraus berechnen.';
$ec_lang['lpn_georef_rotation']='Drehung gegen den Uhrzeigersinn (Grad)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Wie weit das gesamte Modell gegen den Uhrzeigersinn gedreht wird, damit sein Norden nach Norden zeigt.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Das Modell dauerhaft hier platzieren? Sie können danach weiterhin einzelne Elemente verschieben, aber die Zeichnung ist dann kein xy-Projekt mehr. Um xy wiederherzustellen, schließen Sie dieses Projekt, ohne zu speichern.';
$ec_lang['lpn_georef_done']='Dies ist jetzt ein Breite/Länge-Projekt. Ziehen Sie ein beliebiges Element, um es näher an seine tatsächliche Lage zu bringen.';
$ec_lang['lpn_georef_backdrop_unrotated']='Das Hintergrundbild wurde mit dem Modell verschoben und skaliert, konnte aber nicht gedreht werden. Verwenden Sie Karte, Hintergrundbild, Verschieben, um es auszurichten.';
$ec_lang['lpn_georef_empty']='Diese Datei enthält kein Netz, daher gibt es nichts zu platzieren.';
$ec_lang['lpn_georef_unavailable']='Das Platzierungswerkzeug wurde nicht geladen. Laden Sie die Seite neu und versuchen Sie es erneut.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Schließen Sie die Platzierung mit der Schaltfläche „Diese Platzierung beibehalten“ ab, oder drücken Sie Abbrechen, bevor Sie das Projekt wechseln. Die Platzierung gehört zu diesem Projekt und kann Sie nicht zu einem anderen begleiten.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Schließen Sie die Platzierung mit der Schaltfläche „Diese Platzierung übernehmen“ ab, oder drücken Sie Abbrechen, bevor Sie speichern. Das Projekt wird noch platziert, daher entspricht das, was auf dem Bildschirm zu sehen ist, noch nicht dem, was in die Datei geschrieben würde.';
$ec_lang['lpn_goto_menu']='Zu einer Breite und Länge gehen…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='Breite und Länge, in dieser Reihenfolge';
$ec_lang['lpn_goto_bad']='Das ist nicht eine Breite und eine Länge. Versuchen Sie 38 -122, mit einem Leerzeichen dazwischen.';
$ec_lang['lpn_georef_goto']='Gehe zu…';
$ec_lang['lpn_georef_twopt']='Zwei bekannte Punkte verwenden';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Platziert das Modell genau, wenn Sie bereits wissen, wo zwei Punkte Ihrer Zeichnung wirklich liegen. Klicken Sie einen von ihnen an, geben Sie seine Breite und Länge ein, und tun Sie dasselbe für einen zweiten Punkt. Lage, Maßstab und Drehung ergeben sich aus diesen beiden Punkten. Drücken Sie diese Schaltfläche erneut, um die Auswahl zu beenden.';
$ec_lang['lpn_georef_twopt_pick1']='Klicken Sie einen Punkt Ihrer Zeichnung an, dessen Breite und Länge Sie kennen.';
$ec_lang['lpn_georef_twopt_pick2']='Klicken Sie nun einen zweiten bekannten Punkt an, möglichst weit vom ersten entfernt.';
$ec_lang['lpn_georef_twopt_same']='Das ist der Punkt, den Sie zuerst gewählt haben. Wählen Sie einen anderen.';
$ec_lang['lpn_georef_twopt_done']='Das Modell liegt jetzt auf den beiden von Ihnen angegebenen Punkten. Prüfen Sie es, und drücken Sie dann Diese Platzierung übernehmen.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Unteres Panel';
$ec_lang['lpn_pane_toggle_tip']='Zeigt oder verbirgt das Feld unter der Karte. Es enthält das Profil und eine Tabelle für jede Art von Element.';
$ec_lang['lpn_pane_resize']='Ziehen, um das Panel höher oder niedriger zu machen';
$ec_lang['lpn_pane_tab_junctions']='Entnahmeknoten';
$ec_lang['lpn_pane_tab_reservoirs']='Reservoire';
$ec_lang['lpn_pane_tab_tanks']='Tanks';
$ec_lang['lpn_pane_tab_pipes']='Rohre';
$ec_lang['lpn_pane_tab_pumps']='Pumpen';
$ec_lang['lpn_pane_tab_valves']='Ventile';
$ec_lang['lpn_pane_tab_tip']='Dieser Tab zeigt die Elemente dieser Art als Tabelle, die Sie sortieren und bearbeiten können. Ergebnisspalten können nicht bearbeitet werden.';
$ec_lang['lpn_pane_none']='Dieses Netz hat davon noch keine.';
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
$ec_lang['lpn_pane_text_attached']='Verknüpft';
$ec_lang['lpn_pane_not_used']='Nicht verwendet';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Gefiltert nach {q}. Zeigt {n} von {all}.';
$ec_lang['lpn_pane_filter_clear']='Alle anzeigen';
$ec_lang['lpn_pane_filter_stale']='Zeilen, die nicht mehr passen: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Nichts in dieser Tabelle entspricht dem Filter.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Zoomen & auswählen';
$ec_lang['lpn_goto_on_map']='Auf der Karte anzeigen';
$ec_lang['lpn_pane_select_on_map']='Auf der Karte auswählen';
$ec_lang['lpn_pane_unselect_on_map']='Auswahl auf der Karte aufheben';
$ec_lang['lpn_pane_print']='Tabelle drucken';
$ec_lang['lpn_pane_print_tip']='Druckt die Tabelle, die Sie gerade ansehen, mit Projektname, Tabellenname und den Einheiten in den Spaltenüberschriften. Die Zeilen werden in der Reihenfolge gedruckt, in die Sie sie sortiert haben.';

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
$ec_lang['lpn_menu_project']='Wasser';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Alles rund um die Modellierung von Wassernetzen ist hier an einem Ort versammelt, mit Ausnahme der Abspielsteuerung der Animation. Sie müssen nicht raten, wo sich etwas befindet.';
$ec_lang['lpn_tables_menu']='Tabellen';
$ec_lang['lpn_tables_menu_tip']='Öffnet im Bereich unter der Karte eine Tabelle der Teile dieses Netzes. Es gibt eine Tabelle je Teileart, die Sie dort sortieren und bearbeiten können.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Berechnet dieses Netz jetzt neu. Suchen Sie die Schaltfläche Berechnen? Sie ist ausgeblendet, solange die Einstellung Automatisch neu berechnen aktiviert ist. Um die Schaltfläche zurückzubekommen, schalten Sie Automatisch neu berechnen in den Einstellungen unter Berechnung, Hydraulik aus.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Automatisch neu berechnen';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Wenn dies aktiviert ist, berechnet dieses Projekt kurz nach jeder Änderung neu, und die Schaltfläche Berechnen wird aus der Werkzeugleiste entfernt, da für sie nichts mehr zu tun bleibt. Schalten Sie es bei einem großen Netz aus, wenn das Warten auf die Neuberechnung nach jeder Änderung das Eintippen behindert; die Schaltfläche Berechnen erscheint dann wieder, sodass Sie selbst bestimmen, wann berechnet wird.';
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
$ec_lang['lpn_time_run_slow']='Die Berechnung dieses Netzes hat {secs} s gedauert, und es ist so eingestellt, dass es nach jeder Änderung neu berechnet wird. Um das zu stoppen und eine Schaltfläche Berechnen zurückzubekommen, schalten Sie „Automatisch neu berechnen“ in den Einstellungen unter Berechnung, Hydraulik aus.';
$ec_lang['lpn_time_no_report']='Es gibt noch keinen Laufbericht. Der Bericht ist EPANETs eigener Text, er erscheint also erst, wenn dieses Netz mit dem EPANET-Löser berechnet wurde.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Hilfe';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Screenshot-Galerie';
$ec_lang['lpn_help_walkthroughs']='Anleitungen';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Netz löschen';
$ec_lang['lpn_confirm_delete_network']='Jeden Knoten, jedes Rohr und jede Textbeschriftung in diesem Projekt löschen? Das Hintergrundbild, der Projektname und Ihre Einstellungen bleiben erhalten. Dies kann nicht rückgängig gemacht werden.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Suchen und ersetzen';
$ec_lang['lpn_find_title']='Suchen und ersetzen';
$ec_lang['lpn_find_scope']='Wonach gesucht wird';
$ec_lang['lpn_find_scope_all']='Alles';
$ec_lang['lpn_find_property']='Eigenschaft';
$ec_lang['lpn_find_condition']='Bedingung';
$ec_lang['lpn_find_value']='Wert';
$ec_lang['lpn_find_btn']='Suchen';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='In aktueller Tabelle filtern';
$ec_lang['lpn_find_filter_tip']='Zeigt nur die Teile an, die dieser Abfrage in einer der Tabellen unter der Karte entsprechen. Die Zeichnung wird nicht verändert, und es wird nichts gelöscht.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} von {all}';
$ec_lang['lpn_find_filter_summary']='Gefiltert nach {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Diese Abfrage trifft auf keine Tabelle zu.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='enthält';
$ec_lang['lpn_find_op_equals']='gleich';
$ec_lang['lpn_find_op_gt']='größer als';
$ec_lang['lpn_find_op_lt']='kleiner als';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='leer';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} gefunden. Klicken Sie eines an, um dorthin zu springen.';
$ec_lang['lpn_find_shift_hint']='Shift+Klick zum Umschalten: fügt es der Auswahl hinzu, wenn es dort noch nicht enthalten ist, oder entfernt es, wenn es bereits enthalten ist.';
$ec_lang['lpn_find_none']='Keine Übereinstimmung.';
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
$ec_lang['lpn_find_op_top']='Höchste {n}';
$ec_lang['lpn_find_op_bottom']='Niedrigste {n}';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Geben Sie ein, wonach gesucht werden soll.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Konnektivität';
$ec_lang['lpn_find_prop_demand_desc']='Beschreibung dieser Verbrauchskategorie';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='ohne Verbindungen am Knoten';
$ec_lang['lpn_find_op_conn_noopen']='ohne offene Verbindungen am Knoten';
$ec_lang['lpn_find_op_conn_nolinksource']='ohne Verbindungsweg zu einer Quelle';
$ec_lang['lpn_find_op_conn_noopensource']='ohne offenen Weg zu einer Quelle';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Jeder Knoten ist verbunden.';
$ec_lang['lpn_find_conn_no_fixed']='Dieses Netz hat weder Reservoir noch Tank, es gibt also keine Quelle zu erreichen. Es können nur ohne Verbindungen am Knoten und ohne offene Verbindungen am Knoten gesucht werden.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Dieselbe Suche, als eine Zeile geschrieben. Änderungen an den Feldern schreiben diese Zeile neu, und eine Eingabe in dieser Zeile aktualisiert die Felder.';
$ec_lang['lpn_find_query_label']='Abfrage';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Bedingungen mit UND, ODER und () verbinden';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='UND';
$ec_lang['lpn_find_q_or']='ODER';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Die Felder können die untenstehende Abfrage nicht abbilden, daher sind sie ausgeblendet.';
$ec_lang['lpn_find_q_restore']='Stattdessen die Felder verwenden';
$ec_lang['lpn_replace_q_bad']='Diese Abfrage kann nicht verstanden werden, daher kann nichts geändert werden. Beheben Sie das zuerst oben.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(bei Zeichen {n})';
$ec_lang['lpn_find_q_err_empty']='Die Abfrage ist leer, daher wird nichts gesucht.';
$ec_lang['lpn_find_q_err_scope']='Es gibt nichts namens {w} zu durchsuchen. Versuchen Sie eines von: {list}';
$ec_lang['lpn_find_q_err_dot']='Setzen Sie einen Punkt zwischen das Gesuchte und seine Eigenschaft, wie Entnahmeknoten.ID';
$ec_lang['lpn_find_q_err_prop']='Keine Eigenschaft von {scope}: {w}. Versuchen Sie eine von: {list}';
$ec_lang['lpn_find_q_err_op']='Keine Bedingung für {prop}: {w}. Versuchen Sie eine von: {list}';
$ec_lang['lpn_find_q_err_value']='Diese Bedingung braucht danach einen Wert: {op}';
$ec_lang['lpn_find_q_err_quote']='Setzen Sie Anführungszeichen um einen Textwert: {w} ist keine Zahl.';
$ec_lang['lpn_find_q_err_quote_end']='Dieser Text in Anführungszeichen hat kein schließendes Anführungszeichen.';
$ec_lang['lpn_find_q_err_close']='Diese Klammer ( wurde geöffnet und nie geschlossen.';
$ec_lang['lpn_find_q_err_open']='Diese Klammer ) schließt nichts.';
$ec_lang['lpn_find_q_err_end']='Danach wurde nichts erwartet. Verbinden Sie zwei Suchen mit {and} oder {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Gefundenes ändern';
$ec_lang['lpn_replace_prop']='Zu ändernde Eigenschaft';
$ec_lang['lpn_replace_value']='Neuer Wert';
$ec_lang['lpn_replace_source']='Quelle des neuen Werts';
$ec_lang['lpn_replace_asked']='Höhen für {n} Knoten angefordert. Die Ergebnisse sind unterwegs.';
$ec_lang['lpn_replace_btn']='Ersetzen';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Änderung an {n} Elementen?';
$ec_lang['lpn_replace_apply']='Ändern';
$ec_lang['lpn_replace_done']='{n} Elemente geändert. Sie können dies in einem Schritt rückgängig machen.';
$ec_lang['lpn_replace_none']='Nichts würde sich ändern.';
$ec_lang['lpn_replace_no_value']='Geben Sie den neuen Wert ein.';
$ec_lang['lpn_replace_scope']='Wählen Sie oben eine Elementart aus, deren Werte Sie ändern möchten.';
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
$ec_lang['lpn_profile_title']='Profil entlang eines Wegs';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Klicken Sie auf den Knoten, an dem der Weg beginnt.';
$ec_lang['lpn_profile_draw_more']='Bewegen Sie sich über die Karte, um den Weg zu sehen. Klicken Sie auf einen Knoten, um ihn hinzuzufügen. Doppelklicken Sie zum Abschließen. Esc bricht ab.';
$ec_lang['lpn_profile_draw_blocked']='Keine Route von {a} nach {b}. Wählen Sie einen anderen Knoten.';
$ec_lang['lpn_profile_tap_start']='Tippen Sie auf den Knoten, an dem der Weg beginnt.';
$ec_lang['lpn_profile_tap_more']='Tippen Sie auf einen Knoten, um den Weg zu sehen. Zum Hinzufügen gedrückt halten. Zum Abschließen doppelt tippen. Drücken Sie erneut auf Profil, um abzubrechen.';
$ec_lang['lpn_profile_say_idle']='Drücken Sie erneut auf Profil, um einen neuen Weg auf der Karte zu wählen.';
$ec_lang['lpn_profile_none']='Noch kein Weg. Drücken Sie erneut auf Profil, um einen auf der Karte zu wählen.';
$ec_lang['lpn_profile_choose']='Wählen Sie einen Startknoten und einen Endknoten.';
$ec_lang['lpn_profile_no_path']='Diese beiden Knoten sind durch keine Route verbunden.';
$ec_lang['lpn_profile_no_solve']='Noch keine Ergebnisse, daher wird nur die Geländelinie gezeichnet.';
$ec_lang['lpn_profile_summary']='Knoten: {n}, Länge: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Entfernung entlang der Route ({u})';
$ec_lang['lpn_profile_axis_elev']='Höhe und Druckhöhe ({u})';
$ec_lang['lpn_profile_ground']='Geländeoberfläche';
$ec_lang['lpn_profile_hgl']='Druckhöhenlinie';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Bearbeiten';
$ec_lang['lpn_profile_edit_tip']='Ändert ein Ende des Wegs oder entfernt einen Knoten daraus, ohne den ganzen Weg neu zu zeichnen.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Ziehen Sie einen beliebigen Punkt des Wegs, um ihn zu verschieben. Klicken Sie einen von Ihnen hinzugefügten Punkt an, um ihn zu entfernen.';
$ec_lang['lpn_profile_edit_tap']='Ziehen Sie einen beliebigen Punkt des Wegs, um ihn zu verschieben. Tippen Sie einen von Ihnen hinzugefügten Punkt an, um ihn zu entfernen.';
$ec_lang['lpn_profile_edit_nowhere']='Ein Punkt des Wegs muss ein Knoten sein. Der Weg bleibt unverändert.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Gespeicherte Wege';
$ec_lang['lpn_profile_new']='Neuer gespeicherter Weg…';
$ec_lang['lpn_profile_new_name']='Weg {n}';
$ec_lang['lpn_profile_rename']='Weg umbenennen…';
$ec_lang['lpn_profile_delete']='Weg löschen';
$ec_lang['lpn_profile_prompt_name']='Name für diesen Weg';
$ec_lang['lpn_profile_delete_confirm']='Den gespeicherten Weg {name} löschen? Die Zeichnung selbst wird nicht geändert.';
$ec_lang['lpn_profile_none_saved']='Noch keine gespeicherten Wege';
$ec_lang['lpn_profile_missing']='Der gespeicherte Weg {name} verwendet Knoten, die in diesem Projekt nicht vorhanden sind: {ids}';
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
$ec_lang['lpn_ts_menu']='Zeitreihe';
$ec_lang['lpn_ts_tip']='Zeichnet ein oder mehrere Elemente über die Zeit einer Simulation mit erweitertem Zeitraum auf.';
$ec_lang['lpn_ts_title']='Werte über die Zeit';
$ec_lang['lpn_ts_group_nodes']='Knoten';
$ec_lang['lpn_ts_group_links']='Verbindungen';
$ec_lang['lpn_ts_add']='Auswahl hinzufügen';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Auf der Karte ist nichts dieser Art ausgewählt.';
$ec_lang['lpn_ts_clear']='Alle entfernen';
$ec_lang['lpn_ts_chip_tip']='{id} aus dem Graphen entfernen';
$ec_lang['lpn_ts_none']='Noch nichts zum Zeichnen vorhanden. Wählen Sie Elemente auf der Karte aus und drücken Sie Auswahl hinzufügen.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Noch keine Ergebnisse für den erweiterten Zeitraum. Drücken Sie Berechnen, um die Simulation auszuführen.';
$ec_lang['lpn_ts_summary']='Elemente: {n}, Berichtszeitpunkte: {steps}';
$ec_lang['lpn_ts_axis_time']='Verstrichene Zeit';
$ec_lang['lpn_freq_menu']='Häufigkeit';
$ec_lang['lpn_freq_tip']='Zeichnet die Häufigkeitsverteilung eines Werts über alle Entnahmeknoten oder alle Rohre zum angezeigten Zeitschritt auf.';
$ec_lang['lpn_freq_title']='Verteilung der Werte';
$ec_lang['lpn_freq_none']='Für diesen Wert liegen noch keine Ergebnisse vor, daher gibt es nichts zu zeichnen.';
$ec_lang['lpn_freq_summary']='Gezeichnet: {n} von {total}';
$ec_lang['lpn_freq_summary_time']='Gezeichnet: {n} von {total}, bei {time}';
$ec_lang['lpn_freq_axis_percent']='Prozent kleiner als';
$ec_lang['lpn_view_units']='Einheiten';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Alle speichern';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Projekt{n}';
$ec_lang['lpn_project_copy_suffix']='(Kopie)';
$ec_lang['lpn_project_rename']='Umbenennen';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Neues Projekt…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Neues Projekt';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Koordinatensystem';
$ec_lang['lpn_new_coordsys_tip']='Wählen Sie das Koordinatensystem Ihres Netzes. Diese Wahl ist endgültig; die einzige Möglichkeit, ein Netz in andere Koordinaten umzuwandeln, ist über „Datei, Eine xy-Datei auf der Karte öffnen…“, und das ist nur annähernd.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Lokal, schematisch oder benutzerdefiniert';
$ec_lang['lpn_new_coordsys_local_tip']='Nicht georeferenziert. Fügen Sie ein eigenes Hintergrundbild hinzu, oder keines.';
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
$ec_lang['lpn_crs_view']='Nach Kartenausschnitt filtern';
$ec_lang['lpn_crs_view_tip']='Bietet nur die Projektionen an, die den auf der Karte gezeigten Ort abdecken. Schalten Sie dies aus, um die gesamte Liste zu sehen.';
$ec_lang['lpn_crs_place']='Ortssuche';
$ec_lang['lpn_crs_place_tip']='Geben Sie eine Stadt, eine Adresse oder ein Wahrzeichen ein, und die Kartenansicht bewegt sich dorthin. Die eingegebenen Wörter werden an den Ortsnamensdienst von OpenStreetMap gesendet, der Sie beim ersten Mal um Erlaubnis bittet. Ein neues geografisches Projekt beginnt ebenfalls an dem Ort, den Sie hier finden.';
$ec_lang['lpn_crs_search']='Suchen';
$ec_lang['lpn_crs_name']='Projektionsnamen-Filter';
$ec_lang['lpn_crs_name_tip']='Zeigt nur die Projektionen, deren Name oder EPSG-Code den eingegebenen Text enthält. Versuchen Sie eine Zonennummer, UTM oder Mercator.';
$ec_lang['lpn_crs_list_tip']='Die Projektionen, die von den beiden Filtern oben übrig bleiben. Wählen Sie eine aus und drücken Sie Auswählen.';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Es wurde noch nach keinem Ort gesucht, daher wird die gesamte Liste angeboten. Suchen Sie oben nach einem Ort, oder zoomen Sie die Karte, um sie einzugrenzen.';
$ec_lang['lpn_crs_count']='{n} von {total} Projektionen aufgeführt.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} von {total} Koordinatensystemen decken dieses Netz ab.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(keine Karte)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} ist eines der wenigen aufgeführten Koordinatensysteme ohne verwendbare Projektionsangaben. Das bedeutet, dass Weltkarte, Ortsnamensuche und DGM-Höhen nicht funktionieren. Ihre Koordinaten sind davon nicht betroffen.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='unbenannt';
$ec_lang['lpn_crs_none']='Nicht georeferenziert';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Ein Projekt behält seine eigenen Einheiten, daher gilt diese Wahl nur für dieses Projekt und wird nirgends als Browser-Einstellung gespeichert. Um neue Projekte auf eine bestimmte Weise zu beginnen, speichern Sie ein leeres Projekt als Ihre Vorlage und kopieren Sie es jedes Mal.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Petaluma, Kalifornien';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Erstellen';
$ec_lang['lpn_file_open']='Öffnen…';
$ec_lang['lpn_file_save']='Speichern';
$ec_lang['lpn_file_saveas']='Speichern unter…';
$ec_lang['lpn_file_revert']='Zurücksetzen auf gespeicherte Version';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Zuletzt verwendete Dateien';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='Die Berechtigung, diese Datei zu öffnen, wurde nicht erteilt, daher wurde sie nicht geöffnet.';
$ec_lang['lpn_recent_gone']='{file} konnte nicht geöffnet werden. Sie wurde möglicherweise verschoben, umbenannt oder gelöscht und wurde deshalb von der Liste zuletzt verwendeter Dateien entfernt.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Neues Projekt';
$ec_lang['lpn_tab_all']='Alle Projekte';
$ec_lang['lpn_tab_menu']='Projektmenü';
$ec_lang['lpn_tab_duplicate']='Duplizieren';
$ec_lang['lpn_tab_move_left']='Nach links verschieben';
$ec_lang['lpn_tab_move_right']='Nach rechts verschieben';
$ec_lang['lpn_tab_unsaved']='Nicht in einer Datei gespeichert';
$ec_lang['lpn_import_bad_file']='Diese Datei konnte nicht als ein von dieser Seite gespeichertes Projekt gelesen werden.';
$ec_lang['lpn_import_no_room']='Es ist nicht genug Browserspeicher übrig, um dieses Projekt hinzuzufügen. Löschen Sie ein nicht mehr benötigtes Projekt und versuchen Sie es erneut.';
$ec_lang['lpn_file_import_menu']='Importieren…';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='OK';
$ec_lang['lpn_file_import_inp']='EPANET-Datei importieren…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Liest ein Netz aus einer EPANET-Datei, entweder der Textdatei .inp oder der von EPANET gespeicherten Datei .net, und speichert es in diesem Browser als neues Projekt.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='EPANET-Datei exportieren…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Schreibt dieses Netz als EPANET-.inp-Datei und lädt sie herunter. Von Ihnen eingegebene Zahlen werden genau so geschrieben, wie Sie sie eingegeben haben. Alles, was das .inp-Format nicht abbilden kann, wird Ihnen anschließend aufgelistet.';
$ec_lang['lpn_status_inp_exported']='{file} exportiert.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} Dinge, die das .inp-Format nicht abbilden kann.';
$ec_lang['lpn_inp_export_refused']='Dieses Projekt kann nicht als EPANET-Datei geschrieben werden: {detail}';
$ec_lang['lpn_inp_bad_file']='Diese Datei konnte nicht als EPANET-Netzdatei gelesen werden.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Dies sieht wie eine EPANET-.net-Datei aus, konnte von dieser Seite aber nicht gelesen werden. Öffnen Sie sie in EPANET, und speichern Sie sie dort mit dem Befehl Datei, Exportieren, Netz als .inp-Datei; importieren Sie anschließend diese.';
$ec_lang['lpn_inp_report_heading']='{file} importiert';
$ec_lang['lpn_inp_report_counts']='{nodes} Entnahmeknoten, Reservoire und Tanks, {links} Rohre, Pumpen und Ventile, in {units}.';
$ec_lang['lpn_inp_report_clean']='Alles aus der Datei wurde übernommen. Nichts wurde weggelassen.';
$ec_lang['lpn_inp_report_label_anchor']='Textbeschriftungen werden so platziert, wie EPANET sie platziert: ausgehend von ihrer oberen linken Ecke.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='EPANET-Dateien enthalten kein Koordinatensystem, daher ist diese Datei zunächst nicht georeferenziert. Um sie auf einer Weltkarte zu platzieren, verwenden Sie Karte, Weltkarte… Um ihre Koordinaten umzuwandeln, verwenden Sie Datei, Konvertieren als…';
$ec_lang['lpn_inp_report_lead']='Diese Seite verwendet nicht alles, was EPANET kann, aber nichts in Ihrer Datei geht verloren. Es folgt, was Ihre Datei enthält und diese Seite beibehält, ohne es zu verwenden, sowie was beim Einlesen der Datei geändert wurde:';
$ec_lang['lpn_inp_drop_headloss']='Diese Datei verwendet nicht die Hazen-Williams-Formel. Diese Seite rechnet mit Hazen-Williams, daher wurden die Rauheitswerte der Rohre genau wie geschrieben übernommen, aber die hier angezeigten Ergebnisse stimmen nicht mit den Ergebnissen in EPANET überein.';
$ec_lang['lpn_inp_drop_tank_curve']='Diese Tanks haben keine geraden Seitenwände: Die Datei gibt ihre Form als Kurve an. Die Kurve wird im Bibliotheken-Feld aufbewahrt, der Tank verweist weiterhin auf sie, und eine Simulation mit erweitertem Zeitraum füllt und leert den Tank nach dem Zeitplan, den diese Kurve vorgibt. Für einen einzelnen Zeitpunkt ist es in jedem Fall dasselbe, da der Wasserspiegel der von der Datei festgelegte Stand ist. Der in der Datei geschriebene Durchmesser wird neben der Kurve aufbewahrt und ist der Wert, mit dem ein Tank ohne Kurve gezeichnet und gelöst wird.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Diese Drosselventile wurden als Drosselventile übernommen und behalten den Verlust, den die Datei ihnen vorgibt. Beide Löser können sie berechnen.';
$ec_lang['lpn_inp_drop_valve_active']='Diese Ventile regeln Druck oder Durchfluss und öffnen und schließen sich selbstständig, wenn sich das Wasser ändert. Beim Import ist nichts verloren gegangen; diese Seite berechnet sie mit dem EPANET-Löser und schaltet diesen Löser für dieses Netz automatisch ein.';
$ec_lang['lpn_inp_drop_valve']='Diese Ventile werden durch eine Kennlinie oder einen festen Druckabfall beschrieben, und diese Seite kennt kein solches Element. Sie wurden als offene Rohre übernommen, sodass das Netz weiterhin verbunden ist, aber dort nichts mehr Druck oder Durchfluss hält.';
$ec_lang['lpn_inp_drop_cv']='In EPANET lassen diese Rohre Wasser nur in eine Richtung fließen. Sie wurden als gewöhnliche Rohre übernommen, sodass das Wasser jetzt in beide Richtungen fließen kann.';
$ec_lang['lpn_inp_drop_demands']='Diese Entnahmeknoten hatten mehr als eine Entnahme. Die Entnahmen wurden zu der einzelnen Entnahme addiert, die diese Seite führt.';
$ec_lang['lpn_inp_drop_patterns']='Diese Seite hat die Entnahmemuster nicht gelesen, weil der Teil, der eine Simulation mit erweitertem Zeitraum durchführt, nicht geladen wurde. Jede Entnahme ist die in der Datei geschriebene Zahl.';
$ec_lang['lpn_inp_drop_demand_pattern']='Diese Entnahmeknoten ändern ihre Entnahme im Lauf der Zeit. Ihre Muster wurden vollständig übernommen, und die angezeigte Entnahme ist die für den Zeitpunkt, den die Uhr gerade zeigt.';
$ec_lang['lpn_inp_drop_emitters']='Diese Entnahmeknoten haben einen Sprüh- oder Leckagekoeffizienten. Er wurde übernommen und wird berechnet, aber es gibt auf dieser Seite noch keine Stelle, um ihn anzuzeigen oder zu ändern.';
$ec_lang['lpn_inp_drop_curve_long']='Diese Pumpenkennlinie hatte mehr als drei Punkte. Ihr niedrigster, mittlerer und höchster Punkt wurden übernommen, denn diese Seite passt eine Kurve an höchstens drei Punkte an.';
$ec_lang['lpn_inp_drop_curve_missing']='Diese Pumpe verweist auf eine Kurve, die nicht in der Datei enthalten ist. Die Pumpe wurde ohne Kurve übernommen und fügt daher keine Druckhöhe hinzu.';
$ec_lang['lpn_inp_drop_pump_other']='Diese Pumpe wird über die von ihr aufgenommene Leistung beschrieben statt über eine Kennlinie. Sie wurde ohne Kennlinie übernommen und fügt daher keine Druckhöhe hinzu.';
$ec_lang['lpn_inp_drop_head_pattern']='Diese Reservoire steigen und sinken im Lauf der Zeit. Ihre Muster wurden vollständig übernommen, und der angezeigte Wasserspiegel ist der für den Zeitpunkt, den die Uhr gerade zeigt.';
$ec_lang['lpn_inp_drop_pump_speed']='Diese Pumpen laufen mit einer anderen Drehzahl als der, bei der ihre Kennlinie gemessen wurde, oder ändern ihre Drehzahl im Lauf der Zeit. Die Drehzahl und ihr Muster wurden vollständig übernommen, und die angezeigte Druckhöhe ist die für den Zeitpunkt, den die Uhr gerade zeigt.';
$ec_lang['lpn_inp_drop_setting']='Diese Rohre, Pumpen und Ventile tragen eine Einstellung, die diese Seite nicht abbilden kann. Sie wurden offen übernommen.';
$ec_lang['lpn_inp_drop_rules']='Diese Datei enthält regelbasierte Steuerungen. Diese Seite liest sie und verwendet sie. Rechnen Sie das Modell mit dem EPANET-Solver durch, dann werden die Regeln angewendet, wobei jeder Wasserstand, jeder Druck und jeder Durchfluss darin in die von diesem Projekt angezeigten Einheiten umgerechnet wird. Öffnen Sie Regeln unter Bibliotheken, um eine zu lesen oder zu ändern. Sie werden genau so beibehalten, wie die Datei sie angibt, und beim Speichern als EPANET-Datei zurückgeschrieben.';
$ec_lang['lpn_inp_drop_eps']='Diese Datei beschreibt eine Simulation mit erweitertem Zeitraum. Der Teil dieser Seite, der eine solche Simulation durchführt, wurde nicht geladen, daher wurden nur die Anfangsbedingungen übernommen.';
$ec_lang['lpn_inp_drop_quality']='Diese Datei beschreibt, wie sich die Wasserqualität unterwegs ändert: was anfangs im Wasser enthalten ist und wie schnell dieser Stoff in den Rohrleitungen und in den Tanks reagiert. Diese Seite liest diese Zahlen und verwendet sie. Wählen Sie eine Chemikalie unter Einstellungen, Berechnung, Wasserqualität, rechnen Sie das Modell dann mit dem EPANET-Solver durch, und die Konzentration wird im Verlauf des Netzes berechnet, während der Lauf fortschreitet. Die Zeilen werden beibehalten und beim Speichern als EPANET-Datei zurückgeschrieben.';
$ec_lang['lpn_inp_drop_sources_mixing']='Diese Datei gibt an, wo ein Stoff ins Netz eingebracht wird und wie sich das Wasser in einem Tank vermischt. Eine Dosierung erscheint an dem Knoten, an dem sie zugegeben wird, und ein Tank gibt an, welchem Mischungsmodell er folgt. Sowohl die Dosierung als auch das Mischungsmodell werden ausschließlich vom EPANET-Solver berechnet.';
$ec_lang['lpn_inp_drop_energy']='Diese EPANET-Datei enthält Daten zur Pumpenkostenmodellierung. Diese Seite liest sie und verwendet sie. Rechnen Sie das Modell mit dem EPANET-Solver durch, und öffnen Sie dann Wasser, Berichte, Pumpenenergie, um zu sehen, wie lange jede Pumpe lief, welche Leistung sie aufnahm, welche Energie sie verbrauchte und was das kostete. Die Zeilen werden beibehalten und beim Speichern als EPANET-Datei zurückgeschrieben.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Diese Datei gibt einigen ihrer Entnahmeknoten, Rohrleitungen oder anderen Anlagen Tags. Jedes Tag wurde vollständig übernommen und sitzt in den Eigenschaften seiner eigenen Anlage, wo Sie es lesen oder ändern können.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Diese Datei enthält EPANETs eigene Einstellungen dafür, wie es den gedruckten Bericht formatiert. Sie können den Bericht des Solvers hier unter Berichte, EPANET-Lauf lesen, doch er erscheint im Standardformat des Solvers statt in dem von diesen Einstellungen verlangten. Die Zeilen werden beibehalten und beim Speichern als EPANET-Datei zurückgeschrieben.';
$ec_lang['lpn_inp_drop_sections']='Diese Datei enthält einen Abschnitt, den diese Seite überhaupt nicht liest. Nichts hier verwendet ihn. Er wird vollständig beibehalten und beim Speichern als EPANET-Datei zurückgeschrieben.';
$ec_lang['lpn_inp_drop_quality_options']='Diese Datei gibt EPANET-Wasserqualitätsoptionen an: die Option Qualität, die die Art der Wasserqualitätsanalyse benennt, sowie zwei Einstellungen, die zu einer Chemikalie gehören, Relative Diffusivität und Qualitätstoleranz. Alle drei werden beibehalten und alle drei werden verwendet. Wasseralter, Quellenverfolgung und eine Chemikalie werden hier jeweils berechnet, und die beiden Chemikalieneinstellungen werden an den EPANET-Solver übergeben, wenn Sie eine Chemikalie berechnen. Alle werden beim Speichern als EPANET-Datei zurückgeschrieben.';
$ec_lang['lpn_inp_drop_file_options']='Diese Datei verweist auf eine Zusatzdatei: Karte, die Koordinaten enthält, oder Hydraulik, die bereits berechnete Hydraulik enthält. Diese Seite kann keine von beiden öffnen, daher werden die Zeilen unverändert beibehalten und beim Speichern als EPANET-Datei zurückgeschrieben.';
$ec_lang['lpn_inp_drop_demand_model']='Diese Datei verlangt eine druckabhängige Analyse (PDA), bei der ein Entnahmeknoten bei niedrigem Druck weniger als seine Entnahme erhält. Diese Seite löst entnahmegesteuert, sodass jeder Entnahmeknoten hier die in der Datei angegebene Entnahme erhält, ganz gleich, welcher Druck sich ergibt. Die Zeile wird beibehalten und beim Speichern als EPANET-Datei zurückgeschrieben.';
$ec_lang['lpn_inp_drop_other_options']='Diese Datei gibt Optionen an, die diese Seite nicht liest. Nichts hier verwendet sie. Sie werden beibehalten und beim Speichern als EPANET-Datei zurückgeschrieben.';
$ec_lang['lpn_inp_drop_net_options']='Diese EPANET-.net-Datei enthält Einstellungen, für die diese Seite keine Steuerung besitzt. Ihre Werte werden deshalb hier aufgelistet, statt übernommen zu werden. Alles andere wurde übernommen. Falls Sie sie benötigen, öffnen Sie die Datei in EPANET und nutzen Sie Datei, Exportieren, Netz, um sie als .inp-Datei zu speichern, und importieren Sie diese dann.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Dies war eine EPANET-.net-Datei. Das ist EPANETs eigenes Projektformat, es hat keine veröffentlichte Beschreibung, und diese Seite liest es, indem sie das Format aus Beispieldateien erschließt. Verwenden Sie es daher nur, wenn Ihnen nichts anderes zur Verfügung steht, nicht als verlässlichen Weg. Die .inp-Datei ist das dokumentierte Format, das jedes andere Programm liest: Nutzen Sie in EPANET Datei, Exportieren, Netz, um eine zu schreiben, und importieren Sie stattdessen diese, wann immer Sie können.';
$ec_lang['lpn_inp_drop_backdrop']='Diese Datei nennt ein Hintergrundbild, enthält das Bild selbst aber nicht. Fügen Sie es selbst über Datei, Hintergrundbild, Bild hinzufügen hinzu.';
$ec_lang['lpn_inp_drop_dangling']='Diese Rohre nennen einen Entnahmeknoten, der nicht in der Datei enthalten ist, und wurden deshalb nicht übernommen.';
$ec_lang['lpn_inp_drop_units']='Die in dieser Datei angegebene Durchflusseinheit ist dieser Seite nicht bekannt, daher wurde jede Zahl als Gallonen pro Minute gelesen. Prüfen Sie jede Zahl, bevor Sie die Ergebnisse verwenden.';
$ec_lang['lpn_inp_drop_anchor_missing']='Dieser Text war an einen Entnahmeknoten, ein Reservoir oder einen Tank angehängt, der bzw. das nicht in der Datei enthalten ist. Er wurde als freier Text an der Stelle übernommen, die die Datei angab, und folgt jetzt nichts mehr.';
$ec_lang['lpn_import_notes_heading']='Dieses Projekt wurde aus einer EPANET-Datei gelesen. Manches, was diese Datei enthält, wird beibehalten, aber auf dieser Seite nicht verwendet.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='{name} aus einer Datei geöffnet und diesem Browser als neues Projekt hinzugefügt.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Projektdatei';
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
$ec_lang['lpn_file_upload_explain']='Dieser Browser kann sich nicht mit einer Datei verbinden, daher ist das Öffnen einer Datei hier eigentlich ein Hochladen: Das Projekt wird in diesen Browser kopiert, und die einzige Möglichkeit, Ihre Arbeit in die Datei zurückzuschreiben, ist, die Datei mit Datei, Speichern unter zu überschreiben.';
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
$ec_lang['lpn_file_saveas_tip_download']='Speichert über die Download-Einstellungen Ihres Browsers. Dieser Browser kann sich nicht mit einer Datei verbinden, daher ist Speichern deaktiviert und nur Speichern unter verfügbar. Wenn Sie die Browsereinstellung "Für jede Datei nachfragen, wo sie gespeichert werden soll" aktivieren, können Sie die ursprüngliche Datei auswählen und überschreiben.';
$ec_lang['lpn_status_uploaded']='Projektdatei hochgeladen. Eine Verbindung zu ihr kann nicht aufrechterhalten werden, daher ist die einzige Möglichkeit, in sie zurückzuspeichern, Datei, Speichern unter zu verwenden.';
$ec_lang['lpn_status_downloaded']='{file} heruntergeladen. Dieser Browser kann sich nicht mit einer Datei verbinden, daher bleibt dieses Projekt als nicht in einer Datei gespeichert markiert.';
$ec_lang['lpn_status_file_opened']='{file} geöffnet.';
$ec_lang['lpn_status_already_open']='Diese Datei ist hier bereits als {name} geöffnet, daher wurde dazu gewechselt, statt eine zweite Kopie zu öffnen.';
$ec_lang['lpn_status_already_open_dirty']='Diese Datei ist hier bereits als {name} geöffnet, mit Änderungen, die Sie darin nicht gespeichert haben. Es wurde dazu gewechselt, statt eine zweite Kopie zu öffnen. Verwenden Sie Datei, Zurücksetzen auf gespeicherte Version, wenn Sie stattdessen die Version auf der Festplatte möchten.';
$ec_lang['lpn_status_saved']='{file} gespeichert.';
$ec_lang['lpn_status_reverted']='{file} erneut von der Festplatte geladen.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Ihre Änderungen an {name} vor dem Schließen speichern?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} wird nur in diesem Browser aufbewahrt. Wenn Sie es schließen, ohne es in einer Datei zu speichern, ist es unwiderruflich verloren.';
$ec_lang['lpn_close_discard']='Ohne Speichern schließen';
$ec_lang['lpn_cancel']='Abbrechen';
$ec_lang['lpn_revert_confirm']='Ihre Änderungen verwerfen und {file} erneut von der Festplatte laden?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Dieses Projekt stammt aus {file}, aber die Verbindung zu dieser Datei ist verlorengegangen. Wählen Sie die Datei erneut aus, um die Verbindung wiederherzustellen.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='In die Datei konnte nicht geschrieben werden. Sie wurde möglicherweise verschoben oder umbenannt, oder die Berechtigung wurde entzogen. Ihre Arbeit ist weiterhin in diesem Browser gespeichert.';
$ec_lang['lpn_file_changed_elsewhere']='Jemand anderes hat diese Datei gespeichert, seit Sie sie geöffnet haben, sodass ein jetziges Speichern dessen Arbeit überschreiben würde. Verwenden Sie Datei, Speichern unter, um Ihre Änderungen in einer eigenen Datei zu sichern, oder Datei, Zurücksetzen auf gespeicherte Version, um Ihre zu verwerfen und dessen Version zu laden.';
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
$ec_lang['lpn_lock_somebody']='Jemand anderes';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} hat diese Datei geöffnet.';
$ec_lang['lpn_lock_open_readonly']='Schreibgeschützt öffnen';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Deren Sperre aufheben';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Diese Datei scheint gerade verwendet zu werden.';
$ec_lang['lpn_lock_open_care']='Wählen Sie unten sorgfältig, um Datenverlust zu vermeiden.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='Sie wird seit {x} verwendet.';
$ec_lang['lpn_lock_age_edited']='Sie wurde zuletzt vor {x} bearbeitet.';
$ec_lang['lpn_lock_age_saved']='Sie wurde zuletzt vor {x} gespeichert.';
$ec_lang['lpn_lock_age_never_saved']='In dieser Datei wurde noch nichts gespeichert.';
$ec_lang['lpn_lock_age_unknown']='Es gibt keine Aufzeichnung darüber, wie lange sie schon verwendet wird oder wann sie zuletzt gespeichert oder bearbeitet wurde.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='„Fragen“ teilt demjenigen, der diese Datei geöffnet hat, mit, dass Sie sie haben möchten, und ändert sonst nichts. „Schreibgeschützt öffnen“ lässt Sie sie ansehen und beliebig ändern, ohne hier speichern zu können. „Sperre aufheben“ lässt Sie über die Datei speichern; die ungespeicherte Arbeit der anderen Person geht dabei nicht verloren, aber sie kann hier nicht mehr speichern, und jemand muss die beiden möglicherweise von Hand zusammenführen.';
$ec_lang['lpn_lock_ask']='Fragen';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Wen sollen wir als Anfragenden nennen? Ihre Initialen sind ideal. Sie werden zusammen mit der Sperre dieser Datei auf unserem Server gespeichert, für wen auch immer sie geöffnet hat, und innerhalb von 30 Tagen gelöscht.';
$ec_lang['lpn_lock_ask_sent']='Wir haben denjenigen, der diese Datei geöffnet hat, gebeten, sie zu schließen. Er sieht dies innerhalb einer Minute, sofern seine Seite noch geöffnet ist. Sonst hat sich nichts geändert, und die Datei gehört ihm weiterhin, bis er sie schließt.';
$ec_lang['lpn_lock_ask_failed']='Ihre Nachricht konnte nicht zugestellt werden. Entweder hat gerade niemand diese Datei geöffnet, oder der Server war nicht erreichbar.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Diese Datei wurde nicht geöffnet, und hier hat sich nichts geändert. Jemand anderes hat sie noch geöffnet.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} möchte diese Datei bearbeiten. Speichern Sie Ihre Arbeit, sobald Sie bereit sind, und verwenden Sie Datei, Projekt schließen, um sie zu übergeben.';
$ec_lang['lpn_ago_seconds']='{n} Sekunden';
$ec_lang['lpn_ago_minutes']='{n} Minuten';
$ec_lang['lpn_ago_hours']='{n} Stunden';
$ec_lang['lpn_ago_days']='{n} Tagen';
$ec_lang['lpn_ago_unknown']='einer unbekannten Zeit';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Meldungen';
$ec_lang['lpn_msglog_heading']='Neueste Meldungen';
$ec_lang['lpn_msglog_empty']='Noch keine Meldungen.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='vor {x}';
$ec_lang['lpn_msglog_note']='Neueste zuerst. Diese Seite behält die letzten {n} Meldungen, solange sie geöffnet ist, und nichts wird auf Ihrem Computer gespeichert.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Schreibgeschützt: {name} hat diese Datei geöffnet. Sie können hier alles ändern, was Sie möchten, aber nicht speichern. Verwenden Sie Datei, Speichern unter, um in einer anderen Datei zu speichern.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Achtung: Der Server konnte nicht erreicht werden, um eine Sperre für dieses Projekt zu prüfen oder anzulegen, daher hindert nichts einen Kollegen daran, dieselbe Datei gleichzeitig zu bearbeiten. Sie werden benachrichtigt, sobald die Sperrfunktion wieder funktioniert.';
$ec_lang['lpn_lock_storage_error']='Achtung: Diese Seite kann keine Sperrdatensätze speichern, daher hindert nichts einen Kollegen daran, dieselbe Datei gleichzeitig zu bearbeiten. Dies ist ein Einrichtungsfehler auf dem Server, den Sie hier nicht beheben können — der Sperrordner ist für den Webserver nicht beschreibbar.';
$ec_lang['lpn_lock_full_error']='Achtung: Dieser Seite ist der Platz ausgegangen, um zu vermerken, wer welches Projekt geöffnet hat, daher hindert nichts einen Kollegen daran, dieselbe Datei gleichzeitig zu bearbeiten. Dies ist ein Einrichtungsfehler auf dem Server, den Sie hier nicht beheben können.';
$ec_lang['lpn_lock_not_asked']='Für dieses Projekt läuft keine Sperrfunktion, daher hindert nichts einen Kollegen daran, dieselbe Datei gleichzeitig zu bearbeiten. Dieses Projekt hat noch keinen Bezeichner; wenn Sie es in einer Datei speichern, erhält es einen.';
$ec_lang['lpn_lock_restored']='Die Sperrfunktion läuft wieder, und diese Datei kann jetzt von Ihnen gespeichert werden.';
$ec_lang['lpn_lock_dismiss']='Diese Meldung ausblenden';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Ihr Projekt wird in einer Datei auf diesem Computer gespeichert. Es wird gespeichert, wenn Sie es verlangen, und zu keinem anderen Zeitpunkt, sodass nichts ohne Ihr Wissen in diese Datei geschrieben wird.';
$ec_lang['lpn_file_training_2']='Damit niemals zwei Personen gleichzeitig eine Datei bearbeiten, verzeichnet diese Seite, wer sie geöffnet hat. Wenn jemand sie bereits geöffnet hat, können Sie sie trotzdem öffnen und ansehen oder eine eigene Kopie behalten.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='Beim ersten Speichern fragt Ihr Browser, ob diese Seite die Datei bearbeiten darf. Diese Frage kommt vom Browser, nicht von uns, und erst ein Ja erlaubt es Speichern, Ihre Arbeit zurückzuschreiben. Sie wird meist nur einmal pro Datei gestellt.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Weiter';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Datei erneut auswählen';
$ec_lang['lpn_file_reconnect']='Verbindung zu dieser Datei wiederherstellen';
$ec_lang['lpn_file_reconnect_alert']='Dieses Projekt stammt aus {file}. Ihr Browser benötigt erneut Ihre Erlaubnis, bevor er hineinschreiben kann. Unten erneut verbinden.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Das ist dieselbe Datei, die jemand anderes geöffnet hat, daher kann nicht darüber gespeichert werden. Wählen Sie eine andere Datei oder einen anderen Namen.';
$ec_lang['lpn_saveas_overwrites_project']='Diese Datei enthält bereits ein anderes Projekt, {name}. Hier zu speichern ersetzt es vollständig. Fortfahren?';
$ec_lang['lpn_saveas_overwrites_newer']='Diese Datei hat sich geändert, seit Sie sie zuletzt gesehen haben, daher hat mit ziemlicher Sicherheit jemand anderes darin gespeichert. Hier zu speichern ersetzt dessen Version durch Ihre. Fortfahren?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Name für dieses Projekt';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='{closed} geschlossen. Zeigt jetzt {opened}.';
$ec_lang['lpn_status_closed_empty']='{closed} geschlossen. Ein neues leeres Projekt wurde gestartet.';
$ec_lang['lpn_storage_full']='Nicht gespeichert. Der Browserspeicher ist voll oder nicht verfügbar, daher gehen Ihre letzten Änderungen beim Schließen dieses Tabs verloren.';
$ec_lang['lpn_storage_unreadable']='Nicht gespeichert. Dieses Projekt konnte nicht aus dem Browserspeicher gelesen werden. Seine gespeicherte Kopie bleibt genau so erhalten, wie sie ist, und wird nicht überschrieben, daher wird auf diesem Tab nichts gespeichert. Öffnen Sie eine Datei oder erstellen Sie ein neues Projekt, um weiterzuarbeiten.';
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
$ec_lang['lpn_about_credits']='Mitwirkende';
$ec_lang['lpn_help_welcome']='Willkommensseite';
$ec_lang['lpn_about_license']='Lizenziert unter der GNU General Public License v3.0 oder später.';
$ec_lang['lpn_notes_1_term']='Wie es gelöst wird';
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
$ec_lang['lpn_notes_1_def']='Der EPANET-Löser berechnet dieses Netz. Legen Sie eine Gesamtlaufzeit fest, und jeder Berichtszeitpunkt wird der Reihe nach berechnet: Tanks füllen und leeren sich, Entnahmen folgen ihren Mustern, und die Werkzeugleiste spielt den Lauf ab.';
$ec_lang['lpn_notes_2_term']='Was hier nicht abgedeckt ist';
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
$ec_lang['lpn_notes_2_def']='Wasserqualität wird abgebildet: Wasseralter, Quellenverfolgung und eine Chemikalie, die in den Rohrwänden und im Wasserkörper reagiert. Nicht abgebildet werden Druckstoß und Wasserschlag: Jedes Ergebnis hier gilt für bereits stationär fließendes Wasser, nicht für die Druckwelle beim Zuschlagen eines Ventils.';
$ec_lang['lpn_notes_3_term']='Projekte speichern';
$ec_lang['lpn_notes_3_def']='Jedes Projekt ist ein Tab, und jeder Tab wird während der Arbeit in diesem Browser gespeichert. Das Löschen Ihrer Browserdaten löscht sie alle, bewahren Sie Ihre Arbeit deshalb in einer Datei auf: Datei, Speichern unter. Ein Sternchen an einem Tab bedeutet, dass er Änderungen enthält, die nicht in einer Datei stehen. Es wird nie in eine Datei geschrieben, ohne dass Sie es verlangen. In manchen Browsern verbindet sich ein Projekt mit der Datei, in der Sie es speichern, und Datei, Speichern schreibt von da an in dieselbe Datei zurück; in anderen ist keine Verbindung möglich, sodass Speichern deaktiviert ist und nur Speichern unter verfügbar ist. Wird eine Projektdatei auf einem gemeinsam genutzten Laufwerk aufbewahrt, teilt diese Seite mit, ob ein Kollege sie bereits geöffnet hat, damit niemand über den anderen schreibt.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Pumpenkennlinie';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Eine Pumpe folgt H = H₀ − aQ^b, wobei H die von der Pumpe hinzugefügte Druckhöhe und Q der durch sie fließende Durchfluss ist. Geben Sie einen, zwei oder drei Punkte von der Herstellerkennlinie ein. Drei Punkte, die Druckhöhe bei Durchfluss null, der normale Betriebspunkt und der Punkt des höchsten Durchflusses, bestimmen H₀, a und b direkt und folgen einer veröffentlichten Kennlinie am genauesten. Zwei Punkte passen eine Parabel (b = 2) mit ihrem Scheitelpunkt bei Durchfluss null an. Ein Punkt verwendet eine gängige Regel: Die Druckhöhe bei Durchfluss null ist das 1,33-fache der eingegebenen Druckhöhe, und der höchste Durchfluss ist das 2-fache des eingegebenen Durchflusses, was wiederum b = 2 ergibt. Eine Pumpe ohne eingegebene Punkte fügt überhaupt keine Druckhöhe hinzu. Die Kurve wird nicht dort abgeschnitten, wo die Druckhöhe null erreicht, sodass eine Pumpe, von der mehr Durchfluss verlangt wird, als ihre Kurve liefern kann, eine negative Druckhöhe ergibt. Die Lösung ist eine größere Pumpe oder eine kleinere Entnahme, nicht eine andere Kurvenanpassung. Eine Kurve kann mehr als drei Punkte enthalten, und jeder von Ihnen eingegebene Punkt wird gelesen.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='Außerdem auf dieser Seite';
$ec_lang['lpn_notes_4_def']='Ein Projekt kann auf echtem Boden liegen, mit einer Straßenkarte im Hintergrund. EPANET-.inp-Dateien können eingelesen und geschrieben werden. Das untere Feld zeichnet ein Profil entlang einer Route und listet die Entnahmeknoten auf. Elemente können nach ihren Ergebnissen eingefärbt werden, und Suchen findet jedes Element, das eine von Ihnen festgelegte Bedingung erfüllt.';
$ec_lang['lpn_notes_6_term']='Hilfe zu Tabellenspalten';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Spalte auswählen</td><td>Überschrift anklicken</td></tr><tr><td>Spaltenauswahl hinzufügen oder erweitern</td><td>Ctrl+click oder Shift+click auf eine weitere Überschrift</td></tr><tr><td>Ausgewählte Spalte(n) verschieben (neu anordnen)</td><td>Ziehen oder Spalten verwalten… im Rechtsklick- oder ⋮-Menü verwenden</td></tr><tr><td>Menü ⋮ und Sortierpfeil.</td><td>Mit dem Zeiger über die obere Ecke einer Überschrift fahren, oder eine Überschrift auswählen oder per Tab erreichen</td></tr><tr><td>Ausblenden, Alle anzeigen oder Sichtbarkeit und Reihenfolge verwalten</td><td>Überschrift rechtsklicken oder ⋮-Menü in der oberen rechten Ecke der Überschrift</td></tr><tr><td>Nach Spalte sortieren</td><td>Pfeilsymbol in der oberen rechten Ecke der Überschrift</td></tr><tr><td>Als neue Zeilen am Ende der Tabelle einfügen</td><td>Rechtsklick, ⋮-Menü in der oberen rechten Ecke der Überschrift, oder Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Tastenkürzel der Tabelle';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Pfeiltasten</td><td>Navigieren.</td></tr><tr><td>Tab, Enter</td><td>Eingabe abschließen und eine Zelle weiter / nach unten navigieren.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Rückwärts navigieren.</td></tr><tr><td>Shift+arrow keys</td><td>Auswahl erweitern.</td></tr><tr><td>Ctrl+C</td><td>Auswahl kopieren.</td></tr><tr><td>Ctrl+D</td><td>Auswahl von ihrer obersten Zeile aus nach unten ausfüllen.</td></tr><tr><td>Ctrl+Enter</td><td>Auswahl mit dem Wert der aktiven Zelle ausfüllen.</td></tr><tr><td>Ctrl+A</td><td>Die gesamte Tabelle auswählen.</td></tr><tr><td>Ctrl+Shift+V</td><td>Als neue Zeilen am Ende der Tabelle einfügen.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Zum nächsten oder vorherigen Tab wechseln, ob Tabelle oder Diagramm.</td></tr><tr><td>Delete</td><td>Zelle leeren.</td></tr><tr><td>F2</td><td>Eine Zelle zum Bearbeiten öffnen.</td></tr><tr><td>Esc</td><td>Bearbeitung abbrechen.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Farbbandgrenzen bleiben gleich';
$ec_lang['lpn_notes_color_def']='Die Grenzen der Farbbänder werden festgelegt, wenn Sie eine Klassifizierungsmethode für die Daten wählen. Sie werden nicht bei jedem Zeitschritt neu festgelegt, denn dann würden die Farben bei jedem Schritt etwas Neues bedeuten, was für die Visualisierung Ihres Systems nicht hilfreich ist. EPANET arbeitet auf dieselbe Weise. Um neue Grenzen zu erhalten, wählen Sie erneut eine Methode, oder geben Sie eigene Grenzen ein.';
$ec_lang['lpn_notes_epanet_term']='Hazen-Williams-Konstanten stimmen mit EPANET überein';
$ec_lang['lpn_notes_epanet_def']='Im August 2026 wurden der Hazen-Williams-Koeffizient und -Exponent geändert, damit sie mit EPANET übereinstimmen. Die Druckverlust-Ergebnisse weichen um bis zu 0,1 Prozent von früheren Versionen dieser Seite ab, was weit kleiner ist als die Unsicherheit im C-Wert selbst.';
$ec_lang['lpn_notes_engine_term']='Welches EPANET diese Seite verwendet';
$ec_lang['lpn_notes_engine_def']='Der EPANET-Löser auf dieser Seite ist OWA-EPANET 2.3.5, veröffentlicht am 20. Februar 2025. EPANET wird von Open Water Analytics entwickelt, einer Gemeinschaft, die mit der US-amerikanischen Umweltschutzbehörde zusammenarbeitet, die im Dezember 2019 Version 2.2.0 veröffentlichte. Der Laufbericht nennt es 2.3.05, weil die Engine die letzte Zahl zweistellig schreibt. Es erreicht diese Seite über epanet-js 0.9.0 von Luke Butler unter der MIT-Lizenz und läuft in Ihrem Browser: Ihr Netz wird nie irgendwohin gesendet, um gelöst zu werden.';
$ec_lang['lpn_id_invalid']='Geben Sie eine ID ohne Leerzeichen und ohne Anführungszeichen ein.';
$ec_lang['lpn_id_taken']='Diese ID wird bereits verwendet.';
$ec_lang['lpn_diag_no_fixed_head']='Fügen Sie ein Reservoir oder einen Tank hinzu. Das Netz benötigt mindestens einen bekannten Wasserspiegel, bevor es gelöst werden kann.';
$ec_lang['lpn_diag_dangling_link']='Ein Rohr oder eine Pumpe ist mit einem Knoten verbunden, der nicht mehr existiert:';
$ec_lang['lpn_diag_unreachable']='Diese Knoten haben keinen Weg zu einem Reservoir:';
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
$ec_lang['lpn_engine_fetching']='Der EPANET-Löser wird geholt. Er wird einmal heruntergeladen und dann auf diesem Gerät behalten, sodass er danach auch offline funktioniert.';
$ec_lang['lpn_engine_ready']='Der EPANET-Löser ist jetzt auf diesem Gerät und funktioniert offline.';
$ec_lang['lpn_engine_fetching_valve']='Der EPANET-Löser wird geholt, damit dieses Ventil jetzt und später auch offline berechnet werden kann.';
$ec_lang['lpn_engine_ready_valve']='Der EPANET-Löser ist jetzt auf diesem Gerät. Ventile, die sich selbstständig öffnen und schließen, funktionieren damit auch offline.';
$ec_lang['lpn_engine_unavailable']='Der EPANET-Löser konnte nicht geholt werden. Er berechnet Ventile, die sich selbstständig öffnen und schließen. Verbinden Sie sich einmal mit dem Internet, dann wird er ab da auf diesem Gerät behalten.';
$ec_lang['lpn_engine_needed_loading']='EPANET-Löser wird geladen, während Sie bauen. Ergebnisse stehen zur Verfügung, sobald das Laden abgeschlossen ist.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Ladefortschritt des Lösers';
$ec_lang['lpn_engine_wait']='Löser wird geladen. Ergebnisse verzögern sich kurz. Arbeiten Sie weiter.';
$ec_lang['lpn_engine_wait_pct']='Löser zu {percent}% geladen.';
$ec_lang['lpn_engine_wait_bytes']='Löser bisher {kb} KB geladen. Die Gesamtgröße ist nicht bekannt, daher ist der Fortschritt in Prozent unbekannt.';
$ec_lang['lpn_engine_needed_failed']='Der EPANET-Löser wurde noch nicht geladen, kann nicht geladen werden, und dieses Netz kann nur von ihm gelöst werden. Er wird geladen, sobald Sie mit dem Internet verbunden sind.';
$ec_lang['lpn_diag_valve_needs_epanet']='Diese Ventile öffnen und schließen sich selbstständig, und nur der EPANET-Löser kann sie berechnen. Der EPANET-Löser konnte nicht geladen werden, daher fehlen diese Ergebnisse:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Diese Ventile sind direkt an ein Reservoir oder einen Tank angeschlossen, das bzw. der dort bereits den Wasserstand festlegt, sodass für das Ventil nichts mehr zu regeln bleibt. Setzen Sie ein kurzes Rohr zwischen das Ventil und das Reservoir oder den Tank:';
$ec_lang['lpn_diag_not_converged']='Es wurde keine Lösung gefunden. Prüfen Sie auf Werte, die in der Realität unmöglich sind, etwa einen Durchmesser von null.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Die Berechnung hat nicht konvergiert. Diese Zahlen sind der letzte Versuch, keine Lösung. Verwenden Sie sie nicht.';
$ec_lang['lpn_diag_not_converged_trials']='Sie wurde nach {iterations} Versuchen abgebrochen.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Sie wurde nach {iterations} Versuchen bei einem relativen Fehler von {error} abgebrochen, der die Genauigkeitseinstellung von {accuracy} nicht erreicht hat.';
$ec_lang['lpn_field_roughness']='Rauheit';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Hazen-Williams-C. Eine höhere Zahl bedeutet ein glatteres Rohr: etwa 150 für neuen Kunststoff, 130 für neuen Stahl oder Guss, und 100 für altes Rohr.';
$ec_lang['lpn_field_length']='Länge';
$ec_lang['lpn_field_from']='Von';
$ec_lang['lpn_field_to']='Bis';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Ventiltyp';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Was das Ventil bewirkt. Ein Drosselventil hält einen festen Verlust. Die anderen drei halten einen Druck oder einen Durchfluss und öffnen sich vollständig, schließen sich oder schließen sich teilweise, wenn sich das Wasser ändert. Die Typen steuern unterschiedliche hydraulische Eigenschaften, daher können Einstellungen beim Wechsel verloren gehen.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Drossel (TCV)';
$ec_lang['lpn_valve_type_prv']='Druckmindernd (PRV)';
$ec_lang['lpn_valve_type_psv']='Druckhaltend (PSV)';
$ec_lang['lpn_valve_type_fcv']='Durchflussregelnd (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Druckabbau (PBV)';
$ec_lang['lpn_valve_type_gpv']='Allzweck (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Druckabfall';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='Der Druck, den das Ventil abbaut. Ein Druckabbau-Ventil nimmt immer genau diesen Druck weg, unabhängig von der Fließrichtung des Wassers. Es handelt sich um einen Abfall über das Ventil, nicht um einen zu haltenden Druck.';
$ec_lang['lpn_inp_drop_gpv_curve']='Dieses Ventil verweist auf eine Druckverlustkurve, die nicht in der Datei enthalten ist. Das Ventil wurde ohne Kurve übernommen und bleibt daher vollständig offen, bis Sie ihm eine geben.';
$ec_lang['lpn_gpv_curve_source']='Ventil-Druckverlustkurve';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Die Kurve im Bibliotheken-Feld, die angibt, wie viel Druckhöhe dieses Ventil bei jedem Durchfluss verliert. Mehrere Ventile können dieselbe Kurve verwenden, und eine Änderung dort wirkt sich auf alle aus. Dieses Ventil enthält nur den Verweis; die Punkte selbst werden unter Bibliotheken, Kurven gelesen und bearbeitet.';
$ec_lang['lpn_field_valve_setting_pressure']='Solldruck';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Der Druck, den das Ventil hält. Ein druckminderndes Ventil hält den Druck auf seiner stromabwärtigen Seite bei oder unter diesem Wert. Ein druckhaltendes Ventil hält den Druck auf seiner stromaufwärtigen Seite bei oder über diesem Wert.';
$ec_lang['lpn_field_valve_setting_flow']='Solldurchfluss';
$ec_lang['lpn_field_valve_setting_flow_tip']='Die größte Wassermenge, die das Ventil durchlässt. Will weniger Wasser als dieser Wert durchfließen, steht das Ventil vollständig offen und verursacht keinen Verlust.';
$ec_lang['lpn_field_valve_setting']='Einstellung';
$ec_lang['lpn_field_valve_setting_loss']='Verlustbeiwert';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Wie viel Druckhöhe das Drosselventil abbaut, angegeben als Vielfaches der Geschwindigkeitshöhe. Verwenden Sie 0 für ein vollständig offen stehendes Ventil. Diese eine Zahl ist der gesamte Verlust eines Drosselventils.';
$ec_lang['lpn_field_valve_diameter_tip']='Weite der Öffnung im Ventil. Aus dieser Weite wird die Geschwindigkeit des Wassers durch das Ventil berechnet, und aus dieser Geschwindigkeit ergibt sich der Verlust.';
$ec_lang['lpn_field_valve_km_tip']='Verlust am Ventilkörper bei vollständig offen stehendem Ventil, zusätzlich zu allem, was die Ventileinstellung abbaut. Er wird als Vielfaches der Geschwindigkeitshöhe angegeben. Verwenden Sie 0, um ihn zu vernachlässigen.';
$ec_lang['lpn_field_km']='Örtlicher (Einzel-)Verlustbeiwert, k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Einzelverlust, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Pumpenkennlinie';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Die Kurve im Bibliotheken-Feld, die angibt, wie viel Druckhöhe diese Pumpe bei jedem Durchfluss hinzufügt. Mehrere Pumpen können dieselbe Kurve verwenden, und eine Änderung dort wirkt sich auf alle aus. Diese Pumpe enthält nur den Verweis; die Punkte selbst werden unter Bibliotheken, Kurven gelesen und bearbeitet.';
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
$ec_lang['lpn_field_desc']='Beschreibung';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Tag';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Ein Tag kann jede Bedeutung haben, die Sie benötigen, etwa eine Druckzone oder einen Arbeitsauftrag. Keine Berechnung hier oder in EPANET liest ihn aus. Ein Tag ist ein einziges Wort: EPANET liest nur bis zum ersten Leerzeichen, daher wird ein Leerzeichen schon bei der Eingabe abgelehnt. Er wird in die EPANET-Datei übernommen und aus ihr gelesen.';
$ec_lang['lpn_pump_effic_curve']='Pumpenwirkungsgradkurve';
$ec_lang['lpn_pump_effic_curve_tip']='Die Kurve im Bibliotheken-Feld, die angibt, wie effizient diese Pumpe bei jedem Durchfluss ist. Mehrere Pumpen können dieselbe Kurve verwenden, und eine Änderung dort wirkt sich auf alle aus. Diese Pumpe enthält nur den Verweis; die Punkte selbst werden unter Bibliotheken, Kurven gelesen und bearbeitet.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Keine Kurve ausgewählt';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Kurven';
$ec_lang['lpn_curve_library_link_tip']='Öffnet das Bibliotheken-Feld im Abschnitt Kurven, wo eine Kurve angelegt, beschrieben, bearbeitet und gelöscht wird. Eine Anlage gibt an, welche Kurve sie verwendet.';
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
$ec_lang['lpn_curve_kind_head']='Pumpenkennlinie';
$ec_lang['lpn_curve_kind_effic']='Pumpenwirkungsgrad';
$ec_lang['lpn_curve_kind_volume']='Tankvolumen';
$ec_lang['lpn_curve_kind_headloss']='Ventil-Druckverlust';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Art nicht angegeben';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Volumen';
$ec_lang['lpn_pump_effic_col']='Wirkungsgrad';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Für diese Pumpe ist keine Wirkungsgradkurve ausgewählt, daher läuft sie mit dem für das gesamte Netz eingestellten Wirkungsgrad von {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Diese Pumpe verweist auf eine Wirkungsgradkurve namens {name}, die in diesem Projekt nirgends definiert ist, daher läuft sie mit dem für das gesamte Netz eingestellten Wirkungsgrad von {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Modus: Auswählen. Klicken Sie auf ein Element oder eine Beschriftung, um es anzuzeigen oder zu ändern. Ziehen Sie, um einen Knoten, einen Stützpunkt oder eine Beschriftung zu verschieben. Verwenden Sie das Werkzeug Stützpunkte, um die Biegungen eines Rohrs hinzuzufügen oder zu entfernen.';
$ec_lang['lpn_mode_delete']='Modus: Löschen. Klicken Sie auf ein Element, um es zu entfernen.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Modus: Stützpunkte. Die Stützpunkte jedes Rohrs werden als kleine quadratische Griffe angezeigt. Klicken Sie auf ein Rohr, um einen Stützpunkt hinzuzufügen, klicken Sie auf einen Griff, um ihn zu entfernen, oder ziehen Sie einen Griff, um ihn zu verschieben. Sonst wird in diesem Modus nichts auf der Karte geändert.';
$ec_lang['lpn_mode_zoom_window']='Modus: Fenster zoomen. Klicken Sie auf zwei gegenüberliegende Ecken eines Rechtecks auf der Karte, oder ziehen Sie eines auf, um dorthin zu zoomen.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Nichts ist ausgewählt. Klicken Sie zuerst ein Element auf der Karte an, und drücken Sie dann Löschen.';
$ec_lang['lpn_mode_add_junction']='Modus: Entnahmeknoten hinzufügen. Klicken Sie auf die Karte, um einen Entnahmeknoten zu platzieren. Wechseln Sie zum Modus Auswählen, um Elemente und Beschriftungen zu ändern oder zu verschieben.';
$ec_lang['lpn_mode_add_reservoir']='Modus: Reservoir hinzufügen. Klicken Sie auf die Karte, um ein Reservoir zu platzieren. Wechseln Sie zum Modus Auswählen, um Elemente und Beschriftungen zu ändern oder zu verschieben.';
$ec_lang['lpn_mode_add_tank']='Modus: Tank hinzufügen. Klicken Sie auf die Karte, um einen Tank zu platzieren. Wechseln Sie zum Modus Auswählen, um Elemente und Beschriftungen zu ändern oder zu verschieben.';
$ec_lang['lpn_mode_add_pipe']='Modus: Rohr hinzufügen. Klicken Sie auf einen Knoten, dann auf einen weiteren Knoten, um sie zu verbinden. Klicken Sie in den freien Raum dazwischen, um die Linie zu biegen, oder drücken Sie Esc, um neu zu beginnen. Wechseln Sie zum Modus Auswählen, um Elemente und Beschriftungen zu ändern oder zu verschieben.';
$ec_lang['lpn_mode_add_pump']='Modus: Pumpe hinzufügen. Klicken Sie auf einen Knoten, dann auf einen weiteren Knoten, um sie zu verbinden. Klicken Sie in den freien Raum dazwischen, um die Linie zu biegen, oder drücken Sie Esc, um neu zu beginnen. Wechseln Sie zum Modus Auswählen, um Elemente und Beschriftungen zu ändern oder zu verschieben.';
$ec_lang['lpn_mode_add_valve']='Modus: Ventil hinzufügen. Klicken Sie auf einen Knoten, dann auf einen weiteren Knoten, um sie zu verbinden. Klicken Sie in den freien Raum dazwischen, um die Linie zu biegen, oder drücken Sie Esc, um neu zu beginnen. Wechseln Sie zum Modus Auswählen, um Elemente und Beschriftungen zu ändern oder zu verschieben.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Modus: Text hinzufügen. Klicken Sie auf die Karte, um einen Text zu platzieren. Klicken Sie nahe einem Knoten, um den Text an diesem Knoten zu befestigen. Wechseln Sie zum Modus Auswählen, um Elemente und Beschriftungen zu ändern oder zu verschieben.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Verwenden Sie diesen Modus, um Dinge auf der Karte zu ändern, zu verschieben und zu ziehen. Dies ist der Modus, zu dem die Seite standardmäßig zurückkehrt: Sie kehrt nach manchen Aktionen von selbst hierher zurück, etwa nach dem Öffnen eines Projekts, und [Esc] bringt Sie aus jedem anderen Modus hierher zurück.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Automatisch';
$ec_lang['lpn_method_switch_confirm']='Das Ändern der Reibungsmethode ändert nicht die bereits für Ihre Rohre eingegebenen Rauheitswerte, und ein Rauheitswert für die eine Methode ist für eine andere bedeutungslos. Prüfen Sie danach jedes Rohr. Trotzdem ändern?';
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
$ec_lang['lpn_field_closed']='Geschlossen';
$ec_lang['lpn_field_closed_tip']='Schließt dieses Rohr, sodass kein Wasser mehr hindurchfließen kann. Das Rohr bleibt auf der Karte und behält alle seine Werte; Sie können es jederzeit wieder öffnen.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Länge';
$ec_lang['lpn_field_lat']='Breite';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Hochwert';
$ec_lang['lpn_field_easting']='Rechtswert';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='H';
$ec_lang['lpn_field_easting_abbr']='R';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Br';
$ec_lang['lpn_field_lon_abbr']='Lä';

// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Geben Sie eine Koordinate ein, um diesen Knoten genau zu platzieren. In einem Szenario gilt diese Position nur für dieses Szenario, ebenso wie beim Ziehen; in Basis platziert sie den Knoten überall.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Das liegt außerhalb der Karte. Bei Pseudo-Mercator reicht die Breite von -85,05 bis 85,05 und die Länge von -180 bis 180.';
$ec_lang['lpn_field_text_size']='Größenfaktor';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Bei jeder Zoomstufe anzeigen';
$ec_lang['lpn_field_text_all_zoom_tip']='Behält diesen Text in der Zeichnung, egal wie weit Sie herauszoomen. Deaktivieren Sie es, und der Text verbirgt sich mit den anderen Beschriftungen, sobald die Ansicht breiter ist als der unter Karte und Seite festgelegte Schwellenwert für Beschriftungen.';
$ec_lang['lpn_tool_labels']='Beschriftungen';
$ec_lang['lpn_labels_heading_node']='Knotenbeschriftungen';
$ec_lang['lpn_labels_heading_link']='Verbindungsbeschriftungen';
$ec_lang['lpn_labels_mark_extrema']='Höchste und niedrigste Werte markieren';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Zeichnet auf der Karte eine Linie über dem höchsten Wert jeder beschrifteten Eigenschaft (einen Überstrich) und eine Linie unter dem niedrigsten Wert dieser Eigenschaft (einen Unterstrich).';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Auf alle anwenden';
$ec_lang['lpn_settings_apply_to_all_tip']='Jedes bereits gezeichnete Element dieser Art erhält eine ID, die mit diesem Text beginnt. Jedes behält seine Nummer. Eine ID, die nicht mit einer Zahl endet, bleibt unverändert.';
$ec_lang['lpn_confirm_apply_prefix']='Sollen {n} Elemente so umbenannt werden, dass ihre IDs mit {prefix} beginnen? Jedes behält seine Nummer.';
$ec_lang['lpn_prefix_applied']='{n} Elemente umbenannt. {skipped} weitere wurden nicht verändert.';
$ec_lang['lpn_labels_suffix_gradient_tip']='Text, der auf Kartenbeschriftungen nach dem Druckverlustgefälle eingefügt wird. Geben Sie hier kein Prozentzeichen ein. Es wird automatisch hinzugefügt, wenn die Einheit Prozent ist.';
$ec_lang['lpn_labels_separator']='Text zwischen Werten';
$ec_lang['lpn_labels_separator_tip']='Text zwischen einer Eigenschaft und der nächsten auf einer Beschriftung. Standardmäßig ein Leerzeichen.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Priorität';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='Die Reihenfolge, in der Werte fallengelassen werden, wenn sich zwei Knotenbeschriftungen überlappen würden. Der mit 1 nummerierte Wert wird zuerst fallengelassen. Bleibt nur noch ein Wert übrig und überlappen sich die Beschriftungen trotzdem noch, wird eine ganze Beschriftung ausgeblendet: die mit der niedrigeren Entnahme, dem Druck näher an der Mitte des Wertebereichs oder der Höhe bzw. Druckhöhe, die näher an den Werten benachbarter Knoten liegt.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Vor.';
$ec_lang['lpn_labels_col_after']='Nach.';
$ec_lang['lpn_labels_col_decimals']='Dezimalstellen';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Anzeigen';
$ec_lang['lpn_labels_show_tip']='Die Reihenfolge, in der Werte auf einer Beschriftung erscheinen. Der mit 1 nummerierte Wert kommt zuerst: oben bei einer gestapelten Beschriftung und am Anfang bei einer einzeiligen Beschriftung.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Einheiten verwenden';
$ec_lang['lpn_labels_use_units_tip']='Aktivieren, um die Einheit im Feld Danach und auf der Beschriftung anzuzeigen und sie bei einer Einheitenänderung automatisch mitzuführen. Deaktivieren, um einen eigenen Text für Danach einzugeben.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Anfangsstatus';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Knotenfarben';
$ec_lang['lpn_settings_sym_link_colors']='Verbindungsfarben';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Hintergrundbild…';
$ec_lang['lpn_backdrop_add']='Hinzufügen';
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
$ec_lang['lpn_backdrop_scale']='Maßstab festlegen';
$ec_lang['lpn_backdrop_scale_entry']='Maßstab per Worldfile oder Pixelgröße';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Ausgehend von der aktuellen Größe skalieren, um einen von Ihnen gewählten Punkt';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Klicken Sie den Punkt auf dem Hintergrundbild an, der an seinem Platz bleiben soll.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Skalierung ausgehend von der aktuellen Größe. 1 lässt sie unverändert, 1,1 macht sie 10 % größer, 0,9 macht sie 10 % kleiner.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Geben Sie die Größe eines Pixels auf der Karte ein, oder fügen Sie den vollständigen Inhalt der Worldfile für das Bild ein';
$ec_lang['lpn_backdrop_scale_entry_bad']='Geben Sie eine einzige Zahl für die Größe eines Pixels auf der Karte ein, oder fügen Sie alle sechs Zeilen einer Worldfile ein.';
$ec_lang['lpn_backdrop_wld_bad']='Diese Worldfile dreht, spiegelt oder verzerrt das Bild ungleichmäßig. Die Karte kann ein Bild nur verschieben und in beide Richtungen gleich stark skalieren, daher wurde die Datei nicht verwendet.';
$ec_lang['lpn_backdrop_unreadable']='Dieses Bild kann in Ihrem Browser nicht angezeigt werden. Speichern Sie es als PNG oder JPEG und fügen Sie es erneut hinzu.';
$ec_lang['lpn_backdrop_position']='Verschieben';
$ec_lang['lpn_backdrop_remove']='Entfernen';
$ec_lang['lpn_backdrop_remove_confirm']='Das Hintergrundbild entfernen?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Weltkarte…';
$ec_lang['lpn_map_attach_tip']='Heftet die Weltkarte an dieses Projekt an, ohne es sonst zu verändern.';
$ec_lang['lpn_map_attach_add']='Anheften';
$ec_lang['lpn_map_attach_readjust']='Neu anpassen';
$ec_lang['lpn_map_attach_readjust_tip']='Kehrt zu Schritt 2 des Anheftvorgangs der Karte zurück.';
$ec_lang['lpn_map_attach_scale_from']='Von der aktuellen Größe aus skalieren…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Skaliert die Karte ausgehend von ihrer aktuellen Größe, um die Mitte Ihrer Zeichnung. 1 belässt sie unverändert, 1,1 macht sie 10 % größer, 0,9 macht sie 10 % kleiner.';
$ec_lang['lpn_map_attach_scale_from_bad']='Geben Sie eine einzelne Zahl größer als null ein.';
$ec_lang['lpn_map_attach_scale_from_done']='Die Karte ist neu skaliert, und Ihre Zeichnung sowie jede Koordinate darin bleiben genau, wie sie waren.';
$ec_lang['lpn_map_attach_none']='An dieses Projekt ist noch keine Weltkarte angeheftet. Verwenden Sie zuerst Karte, Weltkarte, Anheften.';
$ec_lang['lpn_map_attach_remove']='Ablösen';
$ec_lang['lpn_map_attach_remove_tip']='Entfernt die Weltkarte. Die Zeichnung und ihre Koordinaten bleiben in jedem Fall unverändert.';
$ec_lang['lpn_map_attach_done']='Die Weltkarte liegt jetzt hinter Ihrer Zeichnung, und Ihr Projekt ist unverändert. Verwenden Sie Karte, Weltkarte, Ablösen, um sie wieder zu entfernen.';
$ec_lang['lpn_map_attach_removed']='Die Weltkarte ist entfernt, und die Zeichnung bleibt genau, wie sie war.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Ihre Zeichnung liegt auf einer Karte der ganzen Welt, im Ozean bei Breite und Länge null. Finden Sie zuerst Ihren eigenen Standort: Verschieben und zoomen Sie die Karte hinter der Zeichnung, suchen Sie nach einem Ortsnamen, oder geben Sie eine Breite und Länge ein. Die Zeichnung selbst bewegt sich dabei nicht.';
$ec_lang['lpn_mapgeo_step1']='Schritt 1 von 2: Finden Sie Ihren Standort in der Welt';
$ec_lang['lpn_mapgeo_step2']='Schritt 2 von 2: Passen Sie die Karte hinter Ihre Zeichnung ein';
$ec_lang['lpn_mapgeo_hint1']='Verschieben und zoomen Sie die Karte hinter Ihrer Zeichnung, oder suchen Sie nach einem Ort, oder geben Sie eine Breite und Länge ein. Drücken Sie dann Ungefähr platzieren.';
$ec_lang['lpn_mapgeo_readjust_intro']='Ihre Zeichnung liegt dort, wo Sie sie zuletzt platziert haben. Um sie anderswohin zu verschieben, verschieben und zoomen Sie die Karte hinter der Zeichnung, suchen Sie nach einem Ortsnamen, oder geben Sie eine Breite und Länge ein. Die Zeichnung selbst bewegt sich dabei nicht.';
$ec_lang['lpn_mapgeo_hint2']='Ziehen Sie an einer beliebigen Stelle, um die Karte unter Ihrer Zeichnung zu verschieben. Ihre Zeichnung und jede Koordinate darin bleiben genau, wo sie sind. Drücken Sie Hier georeferenzieren, wenn die Karte richtig liegt.';
$ec_lang['lpn_mapgeo_gestures']='Zoomen bewegt Ihre Zeichnung und die Karte gemeinsam, sodass Sie sehen können, wie gut sie übereinstimmen. Ziehen bewegt nur die Karte.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Karte drehen';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} Grad';
$ec_lang['lpn_mapgeo_dial_size']='Kartengröße';
$ec_lang['lpn_mapgeo_dial_size_read']='{f}-fach';
$ec_lang['lpn_mapgeo_dial_help']='Verschieben Sie die beiden Schieberegler, oder geben Sie in die Felder darüber ein, um die Karte größer oder kleiner zu machen und zu drehen. Die Mitte jedes Reglers ist der von Schritt 1 übernommene Ausgangspunkt, 1 und 0 bedeuten also unverändert lassen. Die Pfeiltasten funktionieren bei beiden.';
$ec_lang['lpn_mapgeo_place']='Ungefähr platzieren';
$ec_lang['lpn_mapgeo_finish']='Hier georeferenzieren';
$ec_lang['lpn_mapgeo_cancelled']='Die Weltkarte ist wieder dort, wo sie war, und Ihre Zeichnung hat sich nie bewegt.';
$ec_lang['lpn_mapgeo_locked']='Schließen Sie mit der Schaltfläche Hier georeferenzieren ab, oder drücken Sie Abbrechen, bevor Sie das Projekt wechseln oder speichern. Die Weltkarte wird noch platziert.';
$ec_lang['lpn_backdrop_scale_prompt1']='Klicken Sie zwei Punkte auf dem Hintergrundbild an, etwa die beiden Enden eines Maßstabsbalkens. Geben Sie dann den wirklichen Abstand zwischen ihnen ein.';
$ec_lang['lpn_backdrop_scale_prompt2']='Wirklicher Abstand zwischen den beiden Punkten';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Klicken Sie den Basispunkt (auf dem Bild) für die Verschiebung an.';
$ec_lang['lpn_backdrop_position_prompt2']='Wählen Sie die Methode für den Zielpunkt, und klicken Sie dann auf Weiter.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Hintergrundbild wird angepasst.';
$ec_lang['lpn_backdrop_target_label']='Diesen Punkt verschieben nach:';
$ec_lang['lpn_backdrop_target_node']='Ein Knoten';
$ec_lang['lpn_backdrop_target_free']='Ein beliebiger Punkt auf der Karte';
$ec_lang['lpn_backdrop_target_coords']='Von Ihnen eingegebene Koordinaten';
$ec_lang['lpn_backdrop_coords_prompt']='Geben Sie die X,Y ein, zu denen dieser Punkt verschoben werden soll';
$ec_lang['lpn_backdrop_continue']='Weiter';
$ec_lang['lpn_tool_settings']='Einstellungen';
$ec_lang['lpn_settings_show_titles']='Seitentitel anzeigen';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Diese Titel ausblenden';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Auswahlhilfe anzeigen';
$ec_lang['lpn_settings_area_hint_tip']='Zeigt die Sprechblase über der Karte, die angibt, was Ihr nächster Klick bewirkt, während Sie einen Bereich auswählen.';
$ec_lang['lpn_settings_id_prefixes']='ID-Präfixe';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Startwerte';
$ec_lang['lpn_settings_defaults_note']='Wird für Elemente verwendet, die Sie ab jetzt erstellen. Bestehende Elemente werden nicht geändert.';
$ec_lang['lpn_settings_push_note']='Nur die Eigenschaften, deren Beschriftungen gerade angezeigt werden, werden angewendet.';
$ec_lang['lpn_settings_push_btn']='Diese Werte für neue Elemente auf jedes bestehende Element anwenden';
$ec_lang['lpn_push_confirm']='Diese Eigenschaften bei jedem bestehenden Element durch die jetzt für neue Elemente festgelegten Werte ersetzen? Von Ihnen eingegebene Werte werden dabei überschrieben. Sie können dies rückgängig machen.';
$ec_lang['lpn_push_properties']='Eigenschaften:';
$ec_lang['lpn_push_assets']='Knoten und Rohre:';
$ec_lang['lpn_push_none_displayed']='Momentan wird kein Startwert als Beschriftung angezeigt, daher gibt es nichts anzuwenden. Schalten Sie im Bereich Beschriftungen die gewünschten Eigenschaften ein und versuchen Sie es erneut.';
$ec_lang['lpn_push_nothing']='Kein bestehendes Element hat eine der angewendeten Eigenschaften.';
$ec_lang['lpn_push_no_change']='Jedes Element hat diese Werte bereits, es würde sich also nichts ändern.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Benutzerdefinierte Eigenschaften';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Eigenschaften, die Sie selbst für eigene Zwecke festlegen. Sie werden wie alle anderen Eigenschaften mit dem Projekt und den Szenarien gespeichert.';
$ec_lang['lpn_cp_design']='Definition';
$ec_lang['lpn_cp_design_tip']='Eine Zeile je benutzerdefinierter Eigenschaft; jede lässt sich aufklappen und zeigt: Schlüssel, Beschriftung, Gilt für, Validieren als, Erlauben oder einschränken, das durch diese Wahl benannte Zeichenfeld, Untere Längengrenze, Obere Längengrenze, Untergrenze, Obergrenze.';
$ec_lang['lpn_cp_add']='Benutzerdefinierte Eigenschaft hinzufügen';
$ec_lang['lpn_cp_add_tip']='Fügt der Definitionstabelle eine Zeile hinzu und öffnet sie zur Bearbeitung.';
$ec_lang['lpn_cp_remove_tip']='Entfernt diese Eigenschaft aus der Definitionstabelle. Bereits bei Ihren Anlagen eingegebene Werte bleiben in der Datei erhalten und kommen zurück, wenn Sie denselben Schlüssel erneut definieren.';
$ec_lang['lpn_cp_none']='Es ist noch keine benutzerdefinierte Eigenschaft definiert.';
$ec_lang['lpn_cp_unnamed']='Noch nicht benannt';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Schlüssel';
$ec_lang['lpn_cp_key_tip']='Schlüssel: Eine Eigenschaft wird unter diesem Namen gespeichert. Leerzeichen sind nicht erlaubt, und es wird automatisch ein Präfix hinzugefügt, damit Ihr Schlüssel nie mit einem eingebauten Feld kollidieren kann.';
$ec_lang['lpn_cp_label']='Beschriftung';
$ec_lang['lpn_cp_label_tip']='Beschriftung: Dies sieht ein Leser im Eigenschaftenfeld, in Suchen und am Kopf einer Tabellenspalte.';
$ec_lang['lpn_cp_applies']='Gilt für';
$ec_lang['lpn_cp_applies_tip']='Gilt für: Durch Komma getrennte Liste von ID-Präfixen der Anlagen, die diese Eigenschaft verwenden, etwa J,L,R.';
$ec_lang['lpn_cp_validate']='Validieren als';
$ec_lang['lpn_cp_validate_tip']='Validieren als: Dies legt fest, wie ein gültiger Wert aussieht. Die Regeln für Groß-/Kleinschreibung lesen nur das englische Alphabet, eine bewusst genannte Einschränkung. Wählen Sie Nicht validieren, um jeden Wert zu akzeptieren.';
$ec_lang['lpn_cp_restrict']='Diese Zeichen einschränken';
$ec_lang['lpn_cp_restrict_tip']='Diese Zeichen einschränken: Ein Wert darf nur die hier aufgeführten Zeichen verwenden oder keines von ihnen, wobei „@“ für einen beliebigen Buchstaben steht, „#“ für eine beliebige Ziffer, und „-“, „.“ und „,“ gesondert aufgeführt werden müssen, wenn sie erlaubt sein sollen; Leerzeichen müssen dabei stets zwischen anderen Zeichen stehen.';
$ec_lang['lpn_cp_restrict_mode']='Erlauben oder einschränken';
$ec_lang['lpn_cp_restrict_mode_tip']='Erlauben oder einschränken: Die angegebenen Zeichen sind entweder die einzigen, die ein Wert verwenden darf, oder die, die er nicht verwenden darf.';
$ec_lang['lpn_cp_restrict_allow']='Nur diese Zeichen erlauben';
$ec_lang['lpn_cp_minlength']='Untere Längengrenze';
$ec_lang['lpn_cp_minlength_tip']='Untere Längengrenze: Jeder kürzere Eintrag wird markiert; so finden Sie leere und halb eingetippte Einträge.';
$ec_lang['lpn_cp_length']='Obere Längengrenze';
$ec_lang['lpn_cp_length_tip']='Obere Längengrenze: Jeder längere Eintrag wird markiert.';
$ec_lang['lpn_cp_low']='Untergrenze';
$ec_lang['lpn_cp_low_tip']='Untergrenze: Dies ist der kleinste erwartete Wert. Zahlen werden als Zahlen verglichen, Text in alphabetischer Reihenfolge.';
$ec_lang['lpn_cp_high']='Obergrenze';
$ec_lang['lpn_cp_high_tip']='Obergrenze: Dies ist der größte erwartete Wert. Zahlen werden als Zahlen verglichen, Text in alphabetischer Reihenfolge.';
$ec_lang['lpn_cp_val_none']='Nicht validieren';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Zahl .';
$ec_lang['lpn_cp_val_number_comma']='Zahl ,';
$ec_lang['lpn_cp_val_integer']='Ganzzahl';
$ec_lang['lpn_cp_val_upper']='GROSSBUCHSTABEN';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Der Wert wird genau so beibehalten, wie Sie ihn eingegeben haben.';
$ec_lang['lpn_cp_bad_number']='Dieser Wert ist keine Zahl, wie es diese Eigenschaft erfordert.';
$ec_lang['lpn_cp_bad_integer']='Dieser Wert ist keine ganze Zahl, wie es diese Eigenschaft erfordert.';
$ec_lang['lpn_cp_bad_case']='Dieser Wert ist nicht in GROSSBUCHSTABEN, wie es diese Eigenschaft erfordert.';
$ec_lang['lpn_cp_bad_chars']='Dieser Wert verwendet ein Zeichen, das diese Eigenschaft nicht zulässt.';
$ec_lang['lpn_cp_bad_space']='Leerzeichen sind nur zwischen anderen Zeichen erlaubt.';
$ec_lang['lpn_cp_bad_minlength']='Dieser Wert ist kürzer, als diese Eigenschaft zulässt.';
$ec_lang['lpn_cp_bad_length']='Dieser Wert ist länger, als diese Eigenschaft zulässt.';
$ec_lang['lpn_cp_bad_low']='Dieser Wert liegt unter der Untergrenze dieser Eigenschaft.';
$ec_lang['lpn_cp_bad_high']='Dieser Wert liegt über der Obergrenze dieser Eigenschaft.';
$ec_lang['lpn_cp_key_needed']='Geben Sie dieser benutzerdefinierten Eigenschaft einen Schlüssel ohne Leerzeichen.';
$ec_lang['lpn_cp_key_taken']='Eine andere benutzerdefinierte Eigenschaft verwendet diesen Schlüssel bereits.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Szenario';
$ec_lang['lpn_scenario_base']='Basis';
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
$ec_lang['lpn_scenario_overrides']='Anzahl individueller Werte';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Der bernsteinfarbene Ring bedeutet, dass dieses Element einen Wert trägt, der nur zum Szenario {name} gehört.';
$ec_lang['lpn_scenario_overrides_tip']='Jeder dieser Werte ist auf der Karte mit einem bernsteinfarbenen Ring gekennzeichnet. Wechseln Sie zu {base}, um die Zeichnung ohne sie zu sehen.';
$ec_lang['lpn_scenario_menu']='Szenarien';
$ec_lang['lpn_scenario_tip']='Der Satz von Werten, den die Zeichnung gerade zeigt und den die Seite gerade berechnet. Klicken Sie, um das Szenario zu wechseln oder ein Szenario hinzuzufügen, umzubenennen oder zu löschen.';
$ec_lang['lpn_scenario_new']='Neues Szenario…';
$ec_lang['lpn_scenario_new_name']='Szenario {n}';
$ec_lang['lpn_scenario_prompt_name']='Name für dieses Szenario';
$ec_lang['lpn_scenario_rename']='Szenario umbenennen…';
$ec_lang['lpn_scenario_delete']='Szenario löschen';
$ec_lang['lpn_scenario_delete_confirm']='Das Szenario {name} löschen, zusammen mit den {n} Werten, die nur ihm gehören? Die Zeichnung selbst wird nicht geändert.';
$ec_lang['lpn_scenario_override']='Nur in diesem Szenario';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Aktiviert bedeutet, dass für diesen Wert in diesem Szenario ein eigener Eintrag besteht, auch wenn er derselben Zahl wie Basis entspricht. Deaktivieren Sie das Kästchen, um wieder den Basiswert zu verwenden.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Basisszenario: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} ist in {scenario} nicht Teil des Netzes. Es befindet sich weiterhin in der Zeichnung und in Ihren anderen Szenarien.';
$ec_lang['lpn_scenario_push_btn']='Basiswerte auf alle Szenarien anwenden';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Jedes Szenario wird für die gerade angezeigten Eigenschaften auf den Basiswert zurückgesetzt. Für sie in einem Szenario eingegebene Werte werden verworfen.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Sollen alle Szenarien für diese Eigenschaften die Basiswerte verwenden? Für sie in einem Szenario eingegebene Werte werden verworfen. Sie können dies rückgängig machen.';
$ec_lang['lpn_scenario_push_scenarios']='Betroffene Szenarien:';
$ec_lang['lpn_scenario_push_values']='Verworfene Werte:';
$ec_lang['lpn_scenario_push_none']='Kein Szenario hat für diese Eigenschaften einen eigenen Wert, daher würde sich nichts ändern. Es wird nichts verworfen.';
$ec_lang['lpn_scenario_preset_flow_static']='1. Durchflusstest: Statisch';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Kalibrierung des Durchflusstests für ein Planungsnetz bei Durchfluss 0. Setzen Sie in diesem Szenario die Entnahme an allen Entnahmeknoten auf 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Durchflusstest: Mittel';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Kalibrierung des Durchflusstests für ein Planungsnetz beim zuerst gemeldeten Durchfluss. Setzen Sie in diesem Szenario die Entnahme am Entnahmeknoten, an dem Wasser abfließt, auf den zuerst gemessenen Durchfluss und die Entnahme an allen anderen Entnahmeknoten auf 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Durchflusstest: Maximum';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Kalibrierung des Durchflusstests für ein Planungsnetz beim maximal gemeldeten Durchfluss. Setzen Sie in diesem Szenario die Entnahme am Entnahmeknoten, an dem Wasser abfließt, auf den maximal gemessenen Durchfluss und die Entnahme an allen anderen Entnahmeknoten auf 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Mittlerer Tag';
$ec_lang['lpn_scenario_preset_average_day_tip']='Entnahmefaktor 1: jede Entnahme wie eingegeben, die als mittlere Tagesentnahme gilt.';
$ec_lang['lpn_scenario_preset_max_day']='5. Maximaltag';
$ec_lang['lpn_scenario_preset_max_day_tip']='Entnahmefaktor 2,0 mal mittlere Tagesentnahme, ein Platzhalterwert. Die meisten Systeme liegen zwischen 1,2 und 3,0 (National Research Council, 2006). Den Wert Ihres eigenen Systems legen Sie unter Einstellungen, Berechnung, Hydraulik, Entnahmefaktor fest.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Spitzenstunde';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='Entnahmefaktor 3,0 mal mittlere Tagesentnahme, ein Platzhalterwert. Die meisten Systeme liegen zwischen 3,0 und 6,0 (National Research Council, 2006). Den Wert Ihres eigenen Systems legen Sie unter Einstellungen, Berechnung, Hydraulik, Entnahmefaktor fest.';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. Löschwasser plus Maximaltag';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='Entnahme am Maximaltag (Faktor 2,0). Führen Sie in diesem Szenario die Löschwasserprüfung aus: Sie addiert die Löschwassermenge an jedem Entnahmeknoten zu dieser Entnahme.';
$ec_lang['lpn_delete_drops_overrides']='Beim Löschen dieses Elements gehen auch {n} Werte verloren, die Ihre Szenarien dafür enthalten. Fortfahren?';
$ec_lang['lpn_push_base_only']='Diese Aktion ändert die Zeichnung selbst und kann daher nur in {base} ausgeführt werden. Wechseln Sie zu {base} und versuchen Sie es erneut.';
$ec_lang['lpn_field_active']='Teil dieses Netzes';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Deaktivieren Sie dieses Kästchen, um das Element in der Zeichnung zu belassen, aber aus dem Netz zu nehmen: Es wird grau dargestellt, und der Löser ignoriert es. In einem Szenario wird auf diese Weise ein Rohr ein- und ausgeschaltet.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Sprühkoeffizient-Exponent';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='Der Exponent in EPANETs Sprühgleichung für Sprinkler und Lecks: Durchfluss = Koeffizient × Druck hoch diesem Exponenten. Er ändert das Ergebnis nur dort, wo ein Knoten einen Sprühkoeffizienten hat, was zurzeit ein aus einer EPANET-Datei gelesenes Netz bedeutet.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='DEM lesen';
$ec_lang['lpn_elev_dem_sample_tip']='Liest die Höhe des DEM an diesem Knoten und zeigt sie unten an. Im Feld Höhe ändert sich dadurch nichts. Die horizontale DEM-Auflösung beträgt für die meiste Erde etwa 30 m und ist feiner, wo bessere Daten vorliegen.';
$ec_lang['lpn_elev_dem_use']='DEM verwenden';
$ec_lang['lpn_elev_dem_use_tip']='Trägt die Höhe des DEM an diesem Knoten in das Feld Höhe oben ein und ersetzt damit den bisherigen Wert. Falls das DEM noch nicht gelesen wurde, wird es zuerst gelesen. Ein Rückgängig macht das wieder rückgängig.';
$ec_lang['lpn_elev_dem_none']='Das DEM hat für diesen Knoten keine Höhe.';
$ec_lang['lpn_elev_dem_said']='Mapbox-DEM sagt {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Höhenquelle';
$ec_lang['lpn_settings_elev_source_tip']='Woher ein neuer Knoten seine Höhe erhält. Die Geländeoberfläche wird aus dem Mapbox-DEM gelesen, das für die meiste Erde etwa 30 m auflöst und feiner, wo bessere Daten vorliegen.';
$ec_lang['lpn_settings_elev_source_typed']='Die oben eingegebene Höhe';
$ec_lang['lpn_settings_elev_source_dem']='Mapbox-DEM';
$ec_lang['lpn_settings_accuracy']='Genauigkeit';
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
$ec_lang['lpn_settings_default_is']='Der Standard ist {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Wie nahe der Löser kommen muss, bevor er stoppt, gemessen als der Betrag, um den sich die Durchflüsse von einem Versuch zum nächsten noch ändern. Eine kleinere Zahl ist genauer und dauert länger. Beide Löser lesen dieses eine Feld, messen diese Änderung aber jeweils an einer anderen Gesamtsumme: der eingebaute Löser an der Summe der Entnahmen, EPANET an der Summe der Rohrdurchflüsse. Bleibt das Feld leer, verwendet diese Seite eine strengere Genauigkeit als EPANETs eigener Standard.';
$ec_lang['lpn_settings_specific_gravity']='Spezifisches Gewicht';
$ec_lang['lpn_settings_specific_gravity_tip']='Das Gewicht der Flüssigkeit im Vergleich zu Wasser. Es ändert die Drücke, die ein Manometer anzeigen würde, nicht die Durchflüsse.';
$ec_lang['lpn_settings_viscosity']='Relative Viskosität';
$ec_lang['lpn_settings_viscosity_tip']='Die Viskosität der Flüssigkeit im Vergleich zu Wasser bei 20 Grad Celsius. Sie ändert das Ergebnis nur bei der Methode Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Maximale Versuche';
$ec_lang['lpn_settings_trials_tip']='Wie viele Versuche erlaubt sind, bevor der Löser ein nicht konvergierendes Netz aufgibt.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Wenn keine Konvergenz erreicht wird';
$ec_lang['lpn_settings_unbalanced_tip']='Was mit einem Netz geschehen soll, das seine Versuche aufgebraucht hat und immer noch nicht konvergiert ist. Zusätzliche Versuche erreichen oft doch noch Konvergenz. Anhalten meldet den letzten Versuch, so wie er steht, was keine Lösung ist. Nur der EPANET-Löser liest dieses Feld. Der eingebaute Löser hält immer an und kennzeichnet das Ergebnis als nicht konvergiert.';
$ec_lang['lpn_settings_unbalanced_continue']='Zusätzliche Versuche zulassen';
$ec_lang['lpn_settings_unbalanced_stop']='Anhalten und den letzten Versuch melden';
$ec_lang['lpn_settings_unbalanced_trials']='Zusätzliche Versuche vor der Meldung';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Wie viele weitere Versuche erlaubt sind, nachdem die oben genannte Höchstzahl aufgebraucht ist, bevor der letzte Versuch gemeldet wird. Nur der EPANET-Löser liest dieses Feld.';
$ec_lang['lpn_settings_head_error']='Grenzwert für Druckhöhenfehler';
$ec_lang['lpn_settings_head_error_tip']='Eine zusätzliche Prüfung, die der Löser bestehen muss, bevor er stoppt: der größte verbleibende Druckhöhenfehler in irgendeinem Rohr. Null bedeutet, diese Prüfung nicht anzuwenden. Nur der EPANET-Löser liest dieses Feld.';
$ec_lang['lpn_settings_flow_change']='Grenzwert für Durchflussänderung';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Eine zusätzliche Prüfung, die der Löser bestehen muss, bevor er stoppt: die größte Änderung des Durchflusses in irgendeinem Rohr von einem Versuch zum nächsten. Null bedeutet, diese Prüfung nicht anzuwenden. Nur der EPANET-Löser liest dieses Feld.';
$ec_lang['lpn_settings_damp_limit']='Dämpfung beginnt bei';
$ec_lang['lpn_settings_damp_limit_tip']='Die Genauigkeit, bei der der Löser beginnt, kleinere Schritte zu machen, was einem schwingenden Netz helfen kann zu konvergieren. Null bedeutet, dass der Löser nie dämpft. Nur der EPANET-Löser liest dieses Feld.';
$ec_lang['lpn_settings_option_unset']='Nicht angegeben';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Ein einzelner Faktor, der auf einmal auf jede Entnahme im Netz angewendet wird. Verwenden Sie ihn, um zu fragen, was das System bei mehr oder weniger als dem heutigen Verbrauch tut. Er ändert nicht die von Ihnen eingegebenen Zahlen. Ein Szenario kann einen eigenen tragen, sodass Tagesdurchschnitt, Tagesmaximum und Spitzenstunde je eine Zahl sind; lassen Sie ihn in einem Szenario leer, um den des Projekts zu verwenden.';
$ec_lang['lpn_settings_engine_native']='Mit dem EPANET-Löser lösen';
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
$ec_lang['lpn_settings_engine_native_tip']='Aktivieren Sie dies, um wo möglich den eingebauten Löser zu verwenden. Andernfalls wird immer der EPANET-Löser der US-Umweltbehörde EPA verwendet. Der eingebaute Löser wird nicht für Simulationen mit erweitertem Zeitraum oder ein aktives PRV, PSV oder FCV verwendet. Beim ersten Einsatz des EPANET-Lösers werden etwa 650 KB heruntergeladen und danach auf diesem Gerät gespeichert. Bei einem Rohr mit Einzel-(örtlichem) Verlust weichen die beiden Löser in den letzten Stellen voneinander ab: EPANET rundet den Wert, den es für die Erdbeschleunigung verwendet, sodass seine Einzelverluste minimal niedriger ausfallen als bei der exakten Form.';
$ec_lang['lpn_engine_loading']='Der EPANET-Löser wird geladen…';
$ec_lang['lpn_engine_failed']='Der EPANET-Löser konnte nicht geladen werden. Stattdessen wird der eingebaute Löser angezeigt.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Mit dem EPANET-Löser berechnet, weil diese Ventile sich selbstständig öffnen und schließen:';
$ec_lang['lpn_unit_unknown']='Diese Zeichnung gibt eine Einheit an, die diese Seite nicht anbietet: {unit}. Alles wird genau so übernommen und angezeigt, wie es eingelesen wurde; nichts wurde verändert. Es kann nichts berechnet werden, bis diese Seite diese Einheit kennt, denn sie weiß nicht, wie groß eine solche Einheit ist.';
$ec_lang['lpn_engine_manning_note']='Hinweis: Bei Manning-Rauheit rundet EPANET die Konstante in der Manning-Gleichung, sodass der Druckverlust etwa 0,6 % niedriger ausfällt als bei der exakten Form.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='Der EPANET-Löser hat dieses Netz nicht akzeptiert, daher wurde es nicht berechnet.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='Der EPANET-Löser meldete: {message}';
$ec_lang['lpn_engine_refused_fallback']='Die angezeigten Zahlen stammen stattdessen vom eingebauten Löser.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Die angezeigten Zahlen stammen stattdessen vom eingebauten Löser. Er berechnet jeweils nur einen Zeitpunkt, daher zeigt dies das Netz nur zum Zeitpunkt {time}, wobei jeder Tank noch auf seinem Startstand steht.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Diese Steuerungen nennen ein Element, das nicht mehr in diesem Projekt vorhanden ist, und wurden daher weggelassen: {ids}';
$ec_lang['lpn_control_unreadable_note']='Diese Steuerungen konnten nicht gelesen werden und wurden daher weggelassen: {ids}';
$ec_lang['lpn_rule_dangling_note']='Diese Regeln beziehen sich auf eine Anlage, die nicht mehr in diesem Projekt vorhanden ist, daher wurden sie in diesem Lauf ignoriert: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Diese Regeln konnten nicht gelesen werden, daher wurden sie in diesem Lauf ignoriert: {ids}';
$ec_lang['lpn_settings_text_size']='Textgröße (Pixel)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Symbolgröße (Pixel)';
$ec_lang['lpn_settings_link_width']='Verbindungslinienbreite (Pixel)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Durchflussrichtungspfeile';
$ec_lang['lpn_settings_show_arrows_tip']='Zeichnet auf jedem Rohr einen Pfeil, der zeigt, in welche Richtung das Wasser fließt. Die Pfeile erscheinen nach einer Berechnung, und sie auszuschalten lässt die Ergebnisse unverändert. Diese Einstellung wird mit dem Projekt gespeichert.';
$ec_lang['lpn_settings_align_labels']='Rohrbeschriftungen an Rohren ausrichten';
$ec_lang['lpn_settings_readability_bias']='Beschriftung auf den Kopf stellen, wenn sie mehr als so viele Grad links von der Senkrechten geneigt ist';
$ec_lang['lpn_settings_readability_bias_tip']='Dreht eine Beschriftung um, damit sie aufrecht bleibt, wenn sie mehr als so viele Grad links von der Senkrechten geneigt ist.';
$ec_lang['lpn_settings_mask_labels']='Deckender Hintergrund hinter Beschriftungen';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Verweislinien auf feste Winkel einrasten';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Beschriftungen anzeigen, wenn auf diese Kartenbreite oder weniger gezoomt ist';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Beschriftungen werden nur gezeichnet, solange die Kartenansicht diese Breite oder schmaler ist. Lassen Sie das Feld leer, um sie bei jedem Zoom zu zeichnen. Geben Sie 0 ein, um bei keinem Zoom eine Beschriftung zu zeichnen.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Immer anzeigen';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='Knoten daran hindern, größer zu werden als';
$ec_lang['lpn_settings_symbol_cap_mid']='mal die Länge des';
$ec_lang['lpn_settings_symbol_cap_post']='Perzentil-Rohrs';
$ec_lang['lpn_settings_symbol_cap_tip']='Ein Entnahmeknoten hört auf, am Boden mitzuwachsen, sobald sein Durchmesser so viele Male die Länge des Rohrs bei diesem Perzentil aller Rohrlängen im Netz erreichen würde. Jenseits dieses Punkts schrumpfen Entnahmeknoten, Rohre und andere Symbole auf der Karte auf dem Bildschirm, statt am Boden weiterzuwachsen, wenn Sie herauszoomen. Reservoire und Tanks sind die Ausnahme und behalten bei jedem Zoom ihre Bildschirmgröße.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Symboldeckkraft (0 bis 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Deckkraft des Hintergrundbilds (0 bis 1)';
$ec_lang['lpn_settings_map_display']='Darstellung';
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
$ec_lang['lpn_settings_legend_position']='Position der Beschriftungslegende';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Keine';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Aus';
$ec_lang['lpn_settings_legend_top_left']='Oben links';
$ec_lang['lpn_settings_legend_top_right']='Oben rechts';
$ec_lang['lpn_settings_legend_middle_left']='Mitte links';
$ec_lang['lpn_settings_legend_middle_right']='Mitte rechts';
$ec_lang['lpn_settings_legend_bottom_left']='Unten links';
$ec_lang['lpn_settings_legend_bottom_right']='Unten rechts';
$ec_lang['lpn_settings_color_node_field']='Knotenfarbe';
$ec_lang['lpn_settings_color_link_field']='Rohrfarbe';
$ec_lang['lpn_settings_color_ramp']='Farbschema';
$ec_lang['lpn_settings_color_credits']='Quellenangabe';
$ec_lang['lpn_color_ramp_epanet']='Blau nach Rot (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Violett nach Gelb (Farben leichter unterscheidbar)';
$ec_lang['lpn_color_ramp_gray']='Hellgrau nach Dunkelgrau';
$ec_lang['lpn_settings_color_reverse']='Farbreihenfolge umkehren';
$ec_lang['lpn_color_none']='Keine Farbe';
$ec_lang['lpn_settings_color_key_position']='Position der Farblegende';
$ec_lang['lpn_settings_color_breaks']='Grenzen der Farbbänder';
$ec_lang['lpn_settings_color_equal_intervals']='Gleiche Abstände';
$ec_lang['lpn_settings_color_equal_counts']='Gleiche Anzahl';
$ec_lang['lpn_settings_color_no_values']='Es liegen noch keine Werte vor, mit denen gearbeitet werden kann. Berechnen Sie zuerst das Netz.';
$ec_lang['lpn_confirm_restore_defaults']='Alle Einstellungen (ID-Präfixe, Startwerte, Löser-Einstellungen, Kartendarstellung, Position der Legende und sichtbare Beschriftungen) auf ihre ursprünglichen Werte zurücksetzen? Ihr Netz wird nicht verändert. Die Einstellungen gehören zum geöffneten Projekt, Ihre anderen Projekte behalten also ihre eigenen.';
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
$ec_lang['lpn_settings_wipe_btn']='Neu beginnen';
$ec_lang['lpn_confirm_wipe']='Neu beginnen und ALLES löschen, was für diese Seite gespeichert ist: jedes Projekt, jedes Hintergrundbild, alle Einstellungen und Ihre Einheitenwahl? Die Seite wird genau so neu geladen, wie sie ein ganz neuer Besucher sehen würde. Dies kann nicht rückgängig gemacht werden.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Diesen Link kopieren:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Zeit';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Gesamtlaufzeit';
$ec_lang['lpn_time_hyd_step']='Hydraulischer Zeitschritt';
$ec_lang['lpn_time_pattern_step']='Muster-Zeitschritt';
$ec_lang['lpn_time_pattern_start']='Musterstartzeit';
$ec_lang['lpn_time_report_step']='Berichts-Zeitschritt';
$ec_lang['lpn_time_report_start']='Berichtsstartzeit';
$ec_lang['lpn_time_clock_start']='Uhrzeit zu Beginn';
$ec_lang['lpn_time_clock_day']='Tag {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Geben Sie eine Zeit als Stunden und Minuten an, wie 2:30. Eine reine Zahl bedeutet Stunden, also sind 8 acht Stunden. Eine halbe Stunde ist 0:30.';
$ec_lang['lpn_time_running']='Die Simulation mit erweitertem Zeitraum wird mit dem EPANET-Solver berechnet.';
$ec_lang['lpn_time_no_engine']='Der eingebaute Solver berechnet jeweils nur einen Zeitpunkt, daher zeigt dies das Netz nur zum Zeitpunkt {time}: Jedes Muster wird zu diesem Zeitpunkt gelesen, und jeder Tank steht weiterhin auf seinem Startstand, statt sich zu füllen oder zu leeren. Stellen Sie einmal eine Internetverbindung her, um den EPANET-Solver zu laden, der eine Simulation mit erweitertem Zeitraum durchführt.';
$ec_lang['lpn_time_slider']='Verstrichene Simulationszeit';
$ec_lang['lpn_time_no_period']='Dieses Projekt hat keine Simulation mit erweitertem Zeitraum eingestellt, daher gibt es nur einen Zeitpunkt zu zeigen. Legen Sie unter Einstellungen, Berechnung, Zeit eine Gesamtlaufzeit fest, um eine Simulation mit erweitertem Zeitraum durchzuführen.';
$ec_lang['lpn_time_first']='Zum Anfang springen';
$ec_lang['lpn_time_prev']='Einen Schritt zurück';
$ec_lang['lpn_time_play']='Abspielen';
$ec_lang['lpn_time_play_tip']='Animation abspielen';
$ec_lang['lpn_time_pause_tip']='Animation pausieren';
$ec_lang['lpn_time_pause']='Pause';
$ec_lang['lpn_time_next']='Einen Schritt vor';
$ec_lang['lpn_time_last']='Zum Ende springen';
$ec_lang['lpn_time_tank']='Tank';
$ec_lang['lpn_time_level']='Wasserspiegel';
$ec_lang['lpn_time_run']='Berechnen';
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
$ec_lang['lpn_time_run_done']='Der Lauf ist abgeschlossen. Berichtszeitpunkte: {frames}. Benötigte Zeit: {secs} s.';
$ec_lang['lpn_time_runbox_hide']='Dieses Feld nicht mehr anzeigen';
$ec_lang['lpn_settings_runbox']='Das Fortschrittsfeld des Laufs anzeigen';
$ec_lang['lpn_settings_runbox_tip']='Ein Feld, das anzeigt, wie weit ein Lauf fortgeschritten ist und was er ergeben hat. Ist es ausgeschaltet, zeigt ein abgeschlossener Lauf dasselbe stattdessen für ein paar Sekunden in der Statuszeile. Dies ist eine Einstellung für diesen Browser, nicht für das Projekt.';
$ec_lang['lpn_time_run_failed']='Der Lauf wurde nicht abgeschlossen, daher gibt es keine Ergebnisse für die späteren Zeitpunkte.';
$ec_lang['lpn_time_run_report']='EPANET-Laufbericht';
$ec_lang['lpn_time_run_report_copy']='Kopieren';
$ec_lang['lpn_time_run_report_copied']='Kopiert';
$ec_lang['lpn_time_run_report_tip']='Was der EPANET-Löser selbst über den letzten Lauf ausgegeben hat: ob er konvergiert ist und wovor er gewarnt hat. Es ist der eigene Text des Lösers, nicht unserer.';

$ec_lang['lpn_time_speed']='Wiedergabegeschwindigkeit';
$ec_lang['lpn_time_speed_tip']='Wiedergabegeschwindigkeit';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Einstellungen durchsuchen';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Geben Sie ein Wort oder mehrere Wörter ein, um die Einstellungen zu sehen, die alle davon erwähnen.';
$ec_lang['lpn_settings_no_match']='Keine Einstellung erwähnt dieses Wort.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Breite der Liste im Bereich Einstellungen';
$ec_lang['lpn_rpane_empty']='Hier ist noch nichts angedockt. Alles, was zum gesamten Projekt gehört, finden Sie in Einstellungen.';
$ec_lang['lpn_time_settings_open']='Zeiteinstellungen';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Visualisierung';
$ec_lang['lpn_settings_sec_map']='Karte und Seite';
$ec_lang['lpn_settings_sec_assets']='Elemente';
$ec_lang['lpn_settings_sec_calculation']='Berechnung';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Kunde';
$ec_lang['lpn_labels_customer_note']='Eine Kundenbeschriftung zeigt die hier angehakten Werte. Sie wird in derselben Textgröße gezeichnet wie jede andere Beschriftung auf der Karte.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Kundenbeschriftungen werden nur gezeichnet, solange die Kartenansicht diese Breite oder schmaler ist. Lassen Sie das Feld leer, um sie bei jedem Zoom zu zeichnen. Geben Sie 0 ein, um bei keinem Zoom eine Kundenbeschriftung zu zeichnen. Dies hat keine Wirkung, wenn der Wert größer ist als die entsprechende Einstellung für alle Beschriftungen.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Aktuelle Ansicht verwenden';
$ec_lang['lpn_settings_page']='Seite';
$ec_lang['lpn_settings_page_note']='Wird in diesem Rechner gespeichert, nicht im Projekt.';
$ec_lang['lpn_settings_hydraulics']='Hydraulik';
$ec_lang['lpn_settings_quality']='Wasserqualität';
$ec_lang['lpn_settings_quality_track']='Qualitätsparameter';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Wählen Sie, was der Lauf durch die Rohrleitungen verfolgen soll: wie lange sich das Wasser schon im System befindet, woher es stammt, oder eine Chemikalie, die unterwegs reagiert. Nur die Chemikalie braucht Koeffizienten.';
$ec_lang['lpn_settings_quality_source']='Verfolgungsknoten';
$ec_lang['lpn_settings_quality_source_tip']='Der Knoten, dessen Wasser verfolgt wird. Jeder andere Knoten zeigt dann den Anteil seines Wassers, der von diesem Knoten stammt.';
$ec_lang['lpn_quality_none']='Nichts';
$ec_lang['lpn_quality_trace']='Quellenverfolgung';
$ec_lang['lpn_quality_chemical']='Eine reagierende Chemikalie';
$ec_lang['lpn_quality_needs_run']='Die Wasserqualität wird beim Fließen entlang der Rohrleitungen mitgeführt, daher braucht sie eine Simulation mit erweitertem Zeitraum: den EPANET-Solver und eine Gesamtlaufzeit. Legen Sie unter Zeit eine Gesamtlaufzeit fest, und drücken Sie dann auf die Schaltfläche Berechnen.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Stoff und Einheiten';
$ec_lang['lpn_quality_chemical_name_tip']='Der Stoff, den Sie verfolgen, zum Beispiel Chlor. Lassen Sie das Feld leer für EPANETs eigene Standardbezeichnung, Chemical. Erscheint in Ihren Berichten, wird aber nicht in den Berechnungen verwendet.';
$ec_lang['lpn_quality_mass_units']='Masseneinheiten';
$ec_lang['lpn_quality_mass_units_tip']='Die Einheitenhälfte des Qualitätseintrags, EPANETs eigene zwei Möglichkeiten.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Qualitätstoleranz';
$ec_lang['lpn_quality_tolerance_tip']='Wie stark sich zwei benachbarte Wasserpakete in der Konzentration unterscheiden dürfen, bevor EPANET sie als eines behandelt. Leer verwendet EPANETs eigenen Standardwert von 0,01.';
$ec_lang['lpn_quality_diffusivity']='Relative Diffusivität';
$ec_lang['lpn_quality_diffusivity_tip']='Wie leicht sich die Chemikalie im Wasser ausbreitet, relativ zu Chlor. Leer verwendet EPANETs eigenen Standardwert von 1,0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='{chemical}-Konzentration';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Mittlere {chemical}-Konzentration';
$ec_lang['lpn_quality_initial']='Anfangskonzentration';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Wie viel von dem Stoff dieser Knoten beim Start des Laufs enthält. Ein Reservoir behält seinen eigenen Wert für den gesamten Lauf, was der üblichen Angabe des Restgehalts entspricht, der ein Wasserwerk verlässt. Bleibt es leer, startet der Knoten ohne den Stoff.';
$ec_lang['lpn_result_concentration']='Konzentration';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Wie viel von dem Stoff an dieser Stelle noch vorhanden ist, nachdem er sich fortbewegt und reagiert hat. Die Einheiten sind die, die unter Einstellungen, Wasserqualität neben dem Stoff genannt sind.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Dosierungsart';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Welche Art von Dosierung dieser Knoten dem durchfließenden Wasser zufügt. Konzentration behandelt das hier ins Netz eintretende Wasser so, als käme es mit dem Wert Quellkonzentration an. Massendosierung fügt jede Minute eine Stoffmasse hinzu, unabhängig vom Durchfluss. Sollwertdosierung hebt die den Knoten verlassende Konzentration auf den Wert Quellkonzentration an, aber nicht darüber hinaus. Durchflussproportionale Dosierung addiert den Wert Quellkonzentration zu dem, was bereits im Wasser enthalten ist.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Keine';
$ec_lang['lpn_source_type_concen']='Konzentration';
$ec_lang['lpn_source_type_mass']='Massendosierung';
$ec_lang['lpn_source_type_setpoint']='Sollwertdosierung';
$ec_lang['lpn_source_type_flowpaced']='Durchflussproportionale Dosierung';
$ec_lang['lpn_source_quality']='Quellkonzentration';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Wie stark die Dosierung ist. Für jede Art außer der Massendosierung ist dies eine Konzentration, in den Einheiten, die unter Einstellungen, Wasserqualität neben dem Stoff genannt sind; für eine Massendosierung ist es eine Stoffmasse pro Minute. Bleibt es leer, wird hier nichts hinzugefügt, was nicht dasselbe ist wie eine Null: Eine Null bedeutet eine Dosierung, die läuft und nichts hinzufügt.';
$ec_lang['lpn_source_pattern']='Dosierungsmuster';
$ec_lang['lpn_source_pattern_tip']='Ein Zeitmuster, das die Dosierung im Lauf der Zeit skaliert, für eine Dosierung, die nicht konstant ist. Kein Muster bedeutet, dass die Dosierung bei jedem Zeitschritt gleich ist.';
$ec_lang['lpn_mixing_model']='Mischungsmodell';
$ec_lang['lpn_mixing_model_tip']='Wie sich das bereits im Tank befindliche Wasser mit dem zufließenden Wasser vermischt. Vollständige Durchmischung rührt den ganzen Tank auf einmal um. Zweikammer-Mischung füllt zuerst eine Einlaufzone und leitet den Rest weiter. FIFO-Kolbenströmung bewegt das Wasser in der Reihenfolge weiter, in der es ankam. LIFO-Kolbenströmung stapelt es, sodass das zuletzt eingetretene Wasser als Erstes wieder austritt. Die Wahl ändert das Wasseralter und den Restgehalt, sie ändert weder Druck noch Durchfluss.';
$ec_lang['lpn_mixing_mixed']='Vollständige Durchmischung';
$ec_lang['lpn_mixing_2comp']='Zweikammer-Mischung';
$ec_lang['lpn_mixing_fifo']='FIFO-Kolbenströmung';
$ec_lang['lpn_mixing_lifo']='LIFO-Kolbenströmung';
$ec_lang['lpn_mixing_fraction']='Mischungsanteil';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Der Anteil des Tankvolumens, den die Einlaufzone einnimmt, zwischen 0 und 1. Nur die Zweikammer-Mischung nutzt ihn. Bleibt es leer, ist der ganze Tank die Einlaufzone, was auch EPANET annimmt.';
$ec_lang['lpn_reaction_bulk']='Reaktionskoeffizient im Wasserkörper';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Reaktion im Wasserkörper, verwendet für jede Rohrleitung, die keinen eigenen hat. Eine negative Zahl baut den Stoff ab, eine positive lässt ihn zunehmen. Die Reaktion ist erster Ordnung, sofern eine importierte EPANET-Datei keine andere Ordnung angibt, daher ist der Koeffizient eine Rate in 1/Tag. Ein leeres Feld bedeutet keine Reaktion im Wasserkörper.';
$ec_lang['lpn_reaction_wall']='Reaktionskoeffizient an der Rohrwand';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Reaktion an der Rohrwand, verwendet für jede Rohrleitung, die keinen eigenen hat. Eine negative Zahl baut den Stoff ab. Die Reaktion ist erster Ordnung, sofern eine importierte EPANET-Datei keine andere Ordnung angibt, daher ist der Koeffizient eine Länge pro Tag, geschrieben in der Längeneinheit des Projekts. Ein leeres Feld bedeutet keine Reaktion an der Rohrwand.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Diese Rohrleitung allein. Bleibt es leer, verwendet die Rohrleitung den für das gesamte Netz unter Einstellungen, Wasserqualität festgelegten Koeffizienten.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Reaktionskoeffizient';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Reaktion im Wasser, das dieser Tank hält, als Rate in 1/Tag. Eine negative Zahl baut den Stoff ab, eine positive lässt ihn zunehmen. Wasser steht in einem Tank weit länger als in irgendeiner Rohrleitung, daher geht hier oft ein Restgehalt verloren. Bleibt es leer, verwendet der Tank den für das gesamte Netz unter Einstellungen, Wasserqualität festgelegten Reaktionskoeffizienten im Wasserkörper.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Reaktion im Wasserkörper';
$ec_lang['lpn_reaction_wall_short']='Reaktion an der Wand';
$ec_lang['lpn_reaction_tank_short']='Reaktion';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/Tag';
$ec_lang['lpn_reaction_day']='Tag';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Reaktionsordnung im Wasserkörper';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='Der Exponent, mit dem die Konzentration für die Reaktion im Wasserkörper potenziert wird. Jede reelle Zahl ist zulässig. 1 ist der Standardwert und wird für die meisten Modellierungen des Chlorabbaus verwendet. 0 macht die Rate unabhängig davon, wie viel Chemikalie vorhanden ist.';
$ec_lang['lpn_reaction_order_tank']='Reaktionsordnung im Tank';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='Der Exponent, mit dem die Konzentration für die Reaktion im Wasser eines Tanks potenziert wird, getrennt von der Reaktionsordnung im Wasserkörper, damit ein Tank mit einer anderen Ordnung reagieren kann als die Rohre. Jede reelle Zahl ist zulässig, und 1 ist der Standardwert. EPANET gibt dies in einer Datei als ORDER TANK an und bietet in der eigenen Oberfläche kein Feld dafür.';
$ec_lang['lpn_reaction_order_wall']='Reaktionsordnung an der Wand';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 bedeutet, dass die Wandreaktion gemäß dem angegebenen Koeffizienten (den angegebenen Koeffizienten) erfolgt. 0 bedeutet, dass sie nicht erfolgt. Dies ist ein Ein-/Aus-Schalter. Der Standardwert ist 1.';
$ec_lang['lpn_reaction_order_unstated']='Nicht angegeben';
$ec_lang['lpn_reaction_order_zero']='0, nullter Ordnung';
$ec_lang['lpn_reaction_order_first']='1, erster Ordnung';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Grenzkonzentration';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Eine Konzentration, der sich die Chemikalie annähert, anstatt bis auf null abzubauen oder unbegrenzt zu wachsen. Die Reaktion verlangsamt sich, je näher das Wasser dieser Konzentration kommt, und kommt dort zum Stillstand. Verwenden Sie einheitliche Einheiten. Kein Grenzwert, wenn leer.';
$ec_lang['lpn_reaction_rough_corr']='Rauheitskorrelation';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Verknüpft die Wandreaktion mit der jeweiligen Rauheit jedes Rohrs, sodass ein raueres Rohr schneller reagiert. Wenn dies festgelegt ist, wird für jedes Rohr aus dessen Rauheit ein Wandkoeffizient ermittelt, und der einzelne Wandkoeffizient oben wird nicht mehr verwendet. Wird nicht verwendet, wenn leer.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Diese Seite bietet keinen eigenen Reaktionskoeffizienten an. Es gibt keinen Standardtest dafür, und veröffentlichte Feldwerte für dieselbe Wasserart weichen um das Zehnfache voneinander ab, sodass eine hier vorgegebene Zahl als Empfehlung verstanden würde. Geben Sie einen selbst gemessenen oder belegbaren Wert ein, oder lassen Sie die Felder für einen nicht reagierenden Stoff leer.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Energie';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Berichte';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_epanet']='EPANET-Lauf';
$ec_lang['lpn_energy_title']='Pumpenenergiebericht';
$ec_lang['lpn_energy_menu']='Pumpenenergie';
$ec_lang['lpn_energy_efficiency']='Pumpenwirkungsgrad (Prozent)';
$ec_lang['lpn_energy_efficiency_tip']='Der Wirkungsgrad von Strom zu Wasser, der für jede Pumpe ohne eigene Wirkungsgradkurve verwendet wird. EPANET verwendet 75 Prozent, wenn nichts angegeben ist.';
$ec_lang['lpn_energy_price']='Strompreis';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Was eine Kilowattstunde kostet. Er gilt für jede Pumpe ohne eigenen Preis. Bleibt er leer, sind alle Kosten im Bericht null.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Was eine Kilowattstunde an dieser Pumpe kostet. Bleibt es leer, zahlt die Pumpe den für das gesamte Netz unter Einstellungen, Energie festgelegten Preis.';
$ec_lang['lpn_energy_price_pattern']='Preismuster';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Ein Muster, das den Preis bei jedem Musterschritt vervielfacht, womit ein Schwachlasttarif angegeben wird. Bleibt es leer, gilt ein Preis über den ganzen Lauf.';
$ec_lang['lpn_energy_demand_charge']='Leistungspreis für Spitzenlast';
$ec_lang['lpn_energy_demand_charge_tip']='Was das Versorgungsunternehmen je kW für die von den Pumpen im System verlangte Spitzenlast berechnet.';
$ec_lang['lpn_energy_currency']='Währung';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Was Sie hier eingeben, wird neben jedem Geldbetrag ausgedruckt. Es ist nur eine Bezeichnung. Preise und Kosten werden nie umgerechnet, schreiben Sie die Preise also in der hier eingegebenen Währung.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Diese Seite bietet keinen eigenen Preis an. Was Strom kostet, hängt vom Versorgungsunternehmen, vom Land, von der Stunde und vom Jahr ab, sodass eine hier vorgegebene Zahl als Empfehlung verstanden würde. Geben Sie den Preis aus Ihrem eigenen Tarif ein.';
$ec_lang['lpn_energy_needs_run']='Pumpenenergie ist die über den Lauf integrierte Leistung, daher braucht sie eine Simulation mit erweitertem Zeitraum: den EPANET-Solver und eine Gesamtlaufzeit. Legen Sie unter Einstellungen, Berechnung, Zeit eine Gesamtlaufzeit fest, drücken Sie auf Berechnen und öffnen Sie dann Wasser, Berichte, Pumpenenergie.';
$ec_lang['lpn_energy_no_pumps']='Dieses Netz hat keine Pumpen, daher wird nirgends Leistung aufgenommen.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Szenarienvergleich';
$ec_lang['lpn_scncmp_menu_tip']='Löst jedes Szenario in diesem Projekt und stellt sie nebeneinander dar: den niedrigsten Druck und die höchste Geschwindigkeit in jedem.';
$ec_lang['lpn_scncmp_running']='Alle Szenarien werden gelöst…';
$ec_lang['lpn_scncmp_empty']='Es wurde noch nichts gezeichnet, daher gibt es nichts zu lösen.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Höchste Geschwindigkeit';
$ec_lang['lpn_scncmp_at']='{value} bei {id}';
$ec_lang['lpn_scncmp_current']='(derzeit geöffnet)';
$ec_lang['lpn_scncmp_note']='Jedes Szenario wird anhand einer Kopie der Zeichnung gelöst. Nichts hier ändert das Projekt, und das Szenario, in dem Sie arbeiten, bleibt unverändert.';
$ec_lang['lpn_energy_over']='Für eine Simulation mit erweitertem Zeitraum von {time}';
$ec_lang['lpn_energy_col_pump']='Pumpe';
$ec_lang['lpn_energy_col_running']='% der Laufzeit';
$ec_lang['lpn_energy_col_effic']='Wirkgr.';
$ec_lang['lpn_energy_col_avg_kw']='Ø kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='Die durchschnittliche Leistung, die diese Pumpe während des Betriebs aufnahm. Sie wird nicht über die Stillstandzeiten gemittelt, daher gibt eine Pumpe, die während eines Großteils der Simulation mit erweitertem Zeitraum stillstand, weiterhin die Leistung an, die sie während des Betriebs aufnahm.';
$ec_lang['lpn_energy_col_peak_kw']='Spitzen-kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Kosten';
$ec_lang['lpn_energy_total_kwh']='Verbrauchte Energie';
$ec_lang['lpn_energy_total_energy_cost']='Energiekosten';
$ec_lang['lpn_energy_peak_kw']='Spitzenleistung';
$ec_lang['lpn_energy_total_demand_charge']='Kosten für Spitzenlast';
$ec_lang['lpn_energy_total_cost']='Gesamtkosten';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Status';
$ec_lang['lpn_reports_status_tip']='Was sich während der letzten Simulation mit erweitertem Zeitraum geändert hat, in zeitlicher Reihenfolge: Pumpen und Ventile, die öffnen oder schließen, Tanks, die sich füllen, leeren, volllaufen oder trockenfallen, sowie Schritte, die nicht vollständig konvergiert sind.';
$ec_lang['lpn_status_title']='Statusbericht';
$ec_lang['lpn_status_needs_run']='Der Statusbericht listet auf, was sich während einer Simulation mit erweitertem Zeitraum geändert hat. Legen Sie unter Einstellungen, Berechnung, Zeit eine Gesamtlaufzeit fest, drücken Sie auf Berechnen und öffnen Sie dann Wasser, Berichte, Statusbericht.';
$ec_lang['lpn_status_empty']='Während dieses Laufs hat sich der Status von nichts geändert.';
$ec_lang['lpn_status_col_event']='Ereignis';
$ec_lang['lpn_status_opened']='{type} {id} ist jetzt geöffnet';
$ec_lang['lpn_status_closed']='{type} {id} ist jetzt geschlossen';
$ec_lang['lpn_status_filling']='{type} {id} füllt sich jetzt';
$ec_lang['lpn_status_emptying']='{type} {id} leert sich jetzt';
$ec_lang['lpn_status_full']='{type} {id} ist jetzt voll';
$ec_lang['lpn_status_dry']='{type} {id} ist jetzt leer';
$ec_lang['lpn_status_no_converge']='Die hydraulische Lösung dieses Schritts ist nicht vollständig konvergiert; die angezeigten Zahlen stammen aus ihrer letzten Iteration.';
$ec_lang['lpn_status_note']='Stammt aus demselben Lauf mit erweitertem Zeitraum wie das Feld Tabellen und der Vollständige Bericht. Es wird nur eine Änderung aufgeführt, nicht jeder Schritt.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Vollständig';
$ec_lang['lpn_reports_full_tip']='Jeder Knoten und jede Verbindung zu jedem Berichtszeitpunkt des letzten Laufs, als eine Tabelle, die Sie herunterladen oder drucken können.';
$ec_lang['lpn_full_title']='Vollständiger Bericht';
$ec_lang['lpn_full_needs_run']='Der vollständige Bericht listet jeden Knoten und jede Verbindung zu jedem Berichtszeitpunkt auf. Drücken Sie Berechnen, und öffnen Sie dann Wasser, Berichte, Vollständig.';
$ec_lang['lpn_full_note']='Eine Zeile pro Knoten oder Verbindung und Berichtszeitpunkt, in den im Feld Tabellen angezeigten Einheiten. Eine leere Zelle ist eine Spalte, die diese Größe nicht hat. Herunterladen oder Drucken enthält jeden Zeitschritt; die Tabelle unten zeigt jeweils einen.';
$ec_lang['lpn_full_step_label']='Zeitschritt';
$ec_lang['lpn_full_download_csv']='CSV herunterladen';
$ec_lang['lpn_full_print']='Bericht drucken';
$ec_lang['lpn_full_col_time']='Zeit';
$ec_lang['lpn_full_col_type']='Typ';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} Zeilen.';
$ec_lang['lpn_energy_no_price']='Es ist kein Strompreis angegeben, daher sind alle Kosten hier null. Legen Sie einen unter Einstellungen, Energie fest.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Dieses Netz gibt einen Preis von null an, daher sind alle Kosten hier null. Ändern Sie ihn unter Einstellungen, Energie.';
$ec_lang['lpn_energy_curve_note']='Diese Pumpen verweisen auf eine Wirkungsgradkurve ohne Punkte: {ids}. Sie liefen mit dem für das gesamte Netz festgelegten Wirkungsgrad.';
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
$ec_lang['lpn_labels_col_drop']='Weglassen';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Knoten und Verbindung';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Gleiche Intervalle';
$ec_lang['lpn_color_mode_quantile']='Quantil (gleiche Anzahl)';
$ec_lang['lpn_color_mode_jenks']='Natürliche Grenzen (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Standardabweichung';
$ec_lang['lpn_color_mode_pretty']='Gerundet';
$ec_lang['lpn_color_mode_log']='Logarithmisch';
$ec_lang['lpn_color_mode_manual']='Manuell';

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
$ec_lang['lpn_library_menu']='Bibliotheken';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Muster';
$ec_lang['lpn_library_patterns_tip']='Ein Muster ist eine sich wiederholende Liste von Multiplikatoren. Jeder gilt für einen Muster-Zeitschritt, sodass 24 Zahlen bei einem Ein-Stunden-Schritt einen sich wiederholenden Tag ergeben. Eine Entnahme von 10 mit einem Multiplikator von 1,5 ergibt zu diesem Zeitpunkt 15.';
$ec_lang['lpn_library_curves']='Kennlinien';
$ec_lang['lpn_library_curves_tip']='Eine Kurve ist eine Liste von Punkten, die angibt, wie etwas sich verhält: wie viel Druckhöhe eine Pumpe bei jedem Durchfluss hinzufügt, wie effizient sie bei diesem Durchfluss ist, oder wie viel Druckhöhe ein Ventil bei jedem Durchfluss verliert.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Kurven sind Pumpen und Ventilen zugeordnet. Für eine Pumpenkennlinie verwendet der Lauf eine wie angezeigt durch die Punkte gelegte Kurve; für jede andere Art verbindet er die Punkte wie angezeigt mit geraden Linien.';
$ec_lang['lpn_library_curve_add']='Kurve hinzufügen';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Kurventyp';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Gleichung';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='Die durch die Punkte gelegte Kurve, wie sie im Diagramm unten gezeichnet ist. Sie wird jedes Mal, wenn sie angezeigt wird, aus den Punkten neu berechnet und nie gespeichert, und ihre Werte stehen in den Einheiten der obigen Tabelle. Der eingebaute Solver rechnet mit dieser Gleichung; der EPANET-Solver liest die Punkte selbst.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Markieren Sie eine oder zwei Spalten in einer Tabellenkalkulation, kopieren Sie sie, und fügen Sie sie in die erste Zelle ein, in der sie landen sollen. Die Zeilen werden nach Bedarf hinzugefügt. Sie können auch Zeilen einfügen, die direkt aus einer EPANET-Datei kopiert wurden, einschließlich des Kurvennamens.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Beschreibung';
$ec_lang['lpn_library_curve_remove_point']='Diesen Punkt entfernen';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Punkte kopieren';
$ec_lang['lpn_library_curve_copy_tip']='Kopiert jeden Punkt als zwei Spalten, bereit zum Einfügen in eine Tabellenkalkulation.';
$ec_lang['lpn_library_curve_copy_manual']='Diese Punkte kopieren';
$ec_lang['lpn_library_curve_used_by']='Anlagen, die diese Kurve verwenden';
$ec_lang['lpn_library_curve_unused']='Nichts verwendet diese Kurve.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Diese Kurve wird von {count} Anlagen verwendet: {ids}. Weisen Sie ihnen zuerst eine andere Kurve zu, bevor Sie diese löschen.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Rohrtypen';
$ec_lang['lpn_library_pipetypes_tip']='Ein Rohrtyp ist eine Definition, auf die sich mehrere Rohre für ihren Durchmesser, ihre Rauheit und ihre Reaktionskoeffizienten beziehen können. Das Bearbeiten der Definition ändert jedes Rohr, das sie verwendet.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Jedes Projekt hat seine eigene Rohrtyp-Bibliothek. Sie können Eigenschaften in einer Rohrtyp-Definition leer lassen. Zum Beispiel ist ein Rohrtyp, der eine Rauheit, aber keinen Durchmesser angibt, in Ordnung. Sie ordnen Rohrtypen den Rohren in deren Eigenschaftseditor zu. Das Bearbeiten einer Definition hier ändert jedes Rohr, das sich darauf bezieht.';
$ec_lang['lpn_library_pipetype_add']='Rohrtyp hinzufügen';
$ec_lang['lpn_library_pipetype_blank_tip']='Leere Eigenschaften in einer Rohrtyp-Definition bleiben zur individuellen Eingabe für jedes Rohr offen.';
$ec_lang['lpn_library_pipetype_used_by']='Rohre, die diesen Typ verwenden';
$ec_lang['lpn_library_pipetype_unused']='Nichts verwendet diesen Rohrtyp.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Dieser Rohrtyp wird von {count} Rohren verwendet: {ids}. Lösen Sie ihn von diesen, bevor Sie ihn löschen.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Rohrtyp';
$ec_lang['lpn_field_pipetype_tip']='Der Rohrtyp aus der Projektbibliothek, den dieses Rohr verwendet. Eigenschaften, die im Rohrtyp enthalten sind, können hier nicht bearbeitet werden. Lösen Sie den Rohrtyp, um die Bearbeitung hier zu ermöglichen.';
$ec_lang['lpn_pipetype_none']='Kein Rohrtyp ausgewählt';
$ec_lang['lpn_pipetype_detach']='Vom Rohrtyp lösen';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Kopiert die Werte, die dieses Rohr von seinem Typ übernimmt, in das Rohr selbst und beendet die Verwendung des Typs. Die Werte des Rohrs ändern sich dadurch nicht, und Sie können diese Werte von nun an hier bearbeiten.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Formstücke';
$ec_lang['lpn_library_fittings_tip']='Eine Formstückliste ist eine Zusammenstellung von Formstücken und ihren Mengen, auf die sich mehrere Rohre beziehen können. Sie ergibt zusammen einen Einzelverlustkoeffizienten.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Jedes Projekt hat seine eigene Formstück-Bibliothek. Eine Formstückliste enthält Formstücke mit jeweils einer Menge, die zusammen einen einzigen Einzelverlustkoeffizienten ergeben. Sowohl Rohre als auch Rohrtypen können sich auf eine Liste beziehen.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Die hier angebotenen Formstücke sind die dreizehn aus Tabelle 3.3 des EPANET-2.2-Benutzerhandbuchs. Die Auswahl eines Formstücks kopiert dessen Koeffizienten in die Zeile, wo Sie ihn ändern können. Ein Koeffizient hängt von der Größe und dem Fabrikat des Formstücks ab, betrachten Sie die Tabelle daher als Ausgangspunkt und nicht als endgültige Antwort.';
$ec_lang['lpn_library_fittings_add']='Formstückliste hinzufügen';
$ec_lang['lpn_library_fittings_used_by']='Rohre, die diese Formstückliste verwenden';
$ec_lang['lpn_library_fittings_unused']='Nichts verwendet diese Formstückliste.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Diese Formstückliste wird von {count} Rohren verwendet: {ids}. Lösen Sie sie von diesen, bevor Sie sie löschen.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Bibliotheken importieren…';
$ec_lang['lpn_library_import_tip']='Wählen Sie eine andere Projektdatei und kopieren Sie ganze Bibliotheken daraus in dieses Projekt. Alles, dessen Name hier bereits vergeben ist, wird übersprungen und aufgelistet, sodass nichts, was Sie bereits haben, verändert wird.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Wählen Sie, was aus {file} kopiert werden soll';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Jede angehakte Bibliothek wird vollständig kopiert. Löschen Sie danach, was Sie nicht möchten, so wie Sie jeden anderen Eintrag löschen.';
$ec_lang['lpn_library_import_go']='Importieren';
$ec_lang['lpn_library_import_no_libraries']='Diese Projektdatei hat keine Bibliotheken zum Kopieren.';
$ec_lang['lpn_library_import_heading']='Importiert aus {file}';
$ec_lang['lpn_library_import_added']='Kopiert: {names}';
$ec_lang['lpn_library_import_conflict']='Übersprungen, weil dieses Projekt bereits einen Eintrag mit demselben Namen hat: {names}. Hier wurde nichts geändert. Benennen Sie einen der beiden um und importieren Sie erneut, wenn Sie beide möchten.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Diese Projektdatei hat nichts davon zum Kopieren.';
$ec_lang['lpn_library_import_curve_shape']='Diese Kurven wurden genau so übernommen, wie die Datei sie geschrieben hat, und ein Lauf kann eine davon erst verwenden, wenn ihre erste Spalte von Punkt zu Punkt ansteigt: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Diese Rohrtypen verweisen auf eine Formstückliste, die dieses Projekt nicht hat: {names}. Importieren Sie die Formstück-Bibliothek aus derselben Datei, damit sie gefunden wird.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Warnung: Einheiten stimmen nicht überein. Wird unverändert importiert. Nicht empfohlen.';
$ec_lang['lpn_library_import_units_line']='{name}: Dieses Projekt zeigt {mine}, die Datei zeigt {theirs}.';
$ec_lang['lpn_fitting_qty']='Menge';
$ec_lang['lpn_fitting_name']='Formstück';
$ec_lang['lpn_fitting_k']='Koeffizient';
$ec_lang['lpn_fitting_add']='Formstück hinzufügen';
$ec_lang['lpn_fitting_remove']='Entfernen';
$ec_lang['lpn_fitting_total']='Gesamter Einzelverlustkoeffizient, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Formstückliste';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Eine Formstückliste aus der Projektbibliothek. Ihre Mengen und Koeffizienten werden zum Einzelverlustkoeffizienten dieses Rohrs aufaddiert, und das Koeffizientenfeld ist dann nur lesbar. Lassen Sie dies unausgewählt, um den Koeffizienten selbst einzugeben.';
$ec_lang['lpn_fittings_none']='Keine Formstückliste ausgewählt';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Ventil (Globe), vollständig geöffnet';
$ec_lang['lpn_fitting_angle']='Winkelventil, vollständig geöffnet';
$ec_lang['lpn_fitting_swingcheck']='Rückschlagklappe, vollständig geöffnet';
$ec_lang['lpn_fitting_gate']='Schieber, vollständig geöffnet';
$ec_lang['lpn_fitting_elbow_short']='Kurzradius-Bogen';
$ec_lang['lpn_fitting_elbow_medium']='Mittelradius-Bogen';
$ec_lang['lpn_fitting_elbow_long']='Langradius-Bogen';
$ec_lang['lpn_fitting_elbow_45']='45-Grad-Bogen';
$ec_lang['lpn_fitting_return_bend']='Geschlossener Rückbogen';
$ec_lang['lpn_fitting_tee_run']='Standard-T-Stück, Durchfluss geradeaus';
$ec_lang['lpn_fitting_tee_branch']='Standard-T-Stück, Durchfluss durch Abzweig';
$ec_lang['lpn_fitting_entrance']='Rechtwinklige Einlaufkante';
$ec_lang['lpn_fitting_exit']='Auslass';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Anderes Formstück';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='{file} gespeichert';
$ec_lang['lpn_inp_export_flat_lead']='Die exportierte EPANET-Datei ist rechnerisch gleichwertig zu diesem Projekt. Für Folgendes bietet sie jedoch keinen Platz:';
$ec_lang['lpn_inp_export_flat_types']='{n} Rohre hier beziehen sich auf {t} Rohrtypen. In der Datei trägt jedes dieser Rohre eine eigene Kopie der Zahlen, sodass die Ergebnisse gleich bleiben. Was die Datei nicht enthalten kann, ist der Rohrtyp selbst, sodass nur Ihre eigene Projektdatei festhält, dass das Bearbeiten einer Definition jedem Rohr folgt.';
$ec_lang['lpn_inp_export_flat_coords']='Eine EPANET-Datei enthält eine Position für jeden Knoten. Dieses Szenario platziert {n} davon anderswo, und das sind die Positionen in der Datei. Jedes andere Szenario behält seine eigenen Positionen nur in Ihrer Projektdatei.';
$ec_lang['lpn_inp_export_flat_fittings']='Eine EPANET-Datei kann die Liste der Bögen, Ventile und T-Stücke aus Ihrer Projektdatei nicht enthalten. Der Einzelverlustkoeffizient von {n} Rohren hier wird aus einer Formstückliste aufaddiert. Die Summe wird unverändert in die Datei übernommen, sodass sich an den Ergebnissen nichts ändert.';
$ec_lang['lpn_library_controls']='Steuerungen';
$ec_lang['lpn_library_controls_tip']='Eine Steuerung ist ein Satz, der eine Verbindung öffnet oder schließt oder ihr eine Einstellung gibt, wenn ein Wasserstand, ein Druck oder eine Uhrzeit dies vorgibt.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Muster hinzufügen';
$ec_lang['lpn_library_pattern_values']='Multiplikatoren';
$ec_lang['lpn_library_pattern_values_tip']='Die Multiplikatoren, getrennt durch Leerzeichen oder Kommas. Fügen Sie bei Bedarf eine Spalte aus einer Tabellenkalkulation ein. Die Liste wiederholt sich für die gesamte Dauer des Laufs und muss diesen daher nicht vollständig abdecken.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} Multiplikatoren, im Abstand von {step}, über {span}';
$ec_lang['lpn_library_pattern_none']='Kein Muster';
$ec_lang['lpn_settings_default_pattern']='Standard-Entnahmemuster';
$ec_lang['lpn_settings_default_pattern_tip']='Jeder Entnahmeknoten ohne eigenes Muster verwendet dieses.';
$ec_lang['lpn_library_control_add']='Steuerung hinzufügen';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Ein Satz, in den Wörtern, die EPANET verwendet. Vier Formen: LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1 und LINK 12 CLOSED AT CLOCKTIME 3 AM. Statt OPEN oder CLOSED können Sie eine Zahl schreiben, die eine Ventileinstellung oder eine Pumpendrehzahl ist. Lassen Sie die Schlüsselwörter auf Englisch; sie sind es, was die Seite liest.';
$ec_lang['lpn_library_control_ok']='✓ Verstanden';
$ec_lang['lpn_library_control_bad']='⚠ Nicht verstanden';
$ec_lang['lpn_library_control_missing']='⚠ Dieses Netz enthält nichts mit dem Namen {id}';
$ec_lang['lpn_library_rules']='Regeln';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Eine Regel ist ein kurzer Abschnitt, der eine Verbindung öffnet oder schließt oder ihr eine Einstellung gibt, sobald ein Wasserstand, ein Druck, ein Durchfluss oder eine Zeit einen von Ihnen festgelegten Wert erreicht. Regeln können mehrere Dinge zugleich prüfen und können festlegen, was zu tun ist, wenn die Prüfung fehlschlägt.';
$ec_lang['lpn_library_rule_add']='Regel hinzufügen';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Eine Regel, in den von EPANET verwendeten Worten, eine Klausel pro Zeile. Eine erste Zeile benennt sie: RULE 1. Dann eine Bedingung: IF TANK 2 LEVEL BELOW 17.1. Dann, was zu tun ist: THEN PUMP 9 STATUS IS OPEN. Eine letzte Zeile kann sie einstufen: PRIORITY 1. Fügen Sie AND- oder OR-Zeilen hinzu, um mehr als eine Sache zu prüfen, und ELSE-Zeilen, um festzulegen, was bei einer fehlgeschlagenen Prüfung geschieht. Eine Bedingung kann LEVEL, HEAD, GRADE, PRESSURE oder DEMAND an einem Knoten lesen, FLOW, STATUS oder SETTING an einer Verbindung, oder TIME und CLOCKTIME an SYSTEM. Schreiben Sie die Zahlen in den Einheiten, die dieses Projekt anzeigt; sie werden für Sie umgerechnet. Lassen Sie die Schlüsselwörter auf Englisch stehen; sie sind es, was die Seite und EPANET lesen.';
$ec_lang['lpn_library_rule_ok']='✓ Diese Regel wurde gelesen';
$ec_lang['lpn_library_rule_bad']='⚠ Diese Regel konnte nicht gelesen werden';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Basisentnahme';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Der Durchfluss, den dieser Knoten zum angezeigten Zeitschritt entnimmt: jede Basisentnahme multipliziert mit ihrem eigenen Muster, aufsummiert. Er wird berechnet, nicht eingegeben, ändert sich also mit der Uhr und kann nicht bearbeitet werden.';
$ec_lang['lpn_field_demand_pattern']='Entnahmemuster';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Beschreibung';
$ec_lang['lpn_demand_add']='Entnahmekategorie hinzufügen';
$ec_lang['lpn_demand_remove']='Diese Entnahme entfernen';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Druckhöhenmuster';
$ec_lang['lpn_field_head_pattern_tip']='Wie der Wasserspiegel dieses Reservoirs im Lauf steigt und sinkt. Die oben angegebene Druckhöhe wird mit dem Muster multipliziert.';
$ec_lang['lpn_field_pump_speed']='Relative Drehzahl';
$ec_lang['lpn_field_pump_speed_tip']='1 bedeutet, dass diese Pumpe mit der Drehzahl läuft, bei der ihre Kennlinie gemessen wurde. 0,9 bedeutet, dass dieselbe Pumpe langsamer läuft, was die hinzugefügte Druckhöhe und den durchgelassenen Durchfluss verringert. Ein Drehzahlmuster tritt während des Laufs an die Stelle dieser Zahl.';
$ec_lang['lpn_field_speed_pattern']='Drehzahlmuster';
$ec_lang['lpn_field_speed_pattern_tip']='Wie die Drehzahl dieser Pumpe im Lauf steigt und sinkt. Jeder Multiplikator ist die relative Drehzahl für diesen Teil des Laufs und tritt an die Stelle der Einstellung Drehzahl, statt sie zu skalieren, sodass ein Multiplikator von 0 die Pumpe stoppt.';

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
$ec_lang['lpn_search_menu']='Nach einem Ort suchen…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Finden Sie eine Stadt, eine Straße oder ein Wahrzeichen nach Namen und bewegen Sie die Karte dorthin. Bei der ersten Nutzung werden Sie um Erlaubnis gebeten, weil die von Ihnen eingegebenen Wörter an den Ortsnamendienst von OpenStreetMap gesendet werden.';
$ec_lang['lpn_search_bar']='Nach Namen suchen…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Die Suche nach Ortsnamen sendet die von Ihnen eingegebenen Wörter an nominatim.openstreetmap.org, den kostenlosen Ortsnamendienst der OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Dies ist ein anderer Dienst als die Straßenkartenbilder hinter Ihrem Projekt. Die Bilder sagen nur, wohin Sie gerade schauen. Eine Suche sagt, was Sie eingegeben haben. Der Ortsnamendienst erhält Ihre Suchwörter und Ihre IP-Adresse. Wir senden nichts weiter, und wir führen kein Protokoll Ihrer Suchen.';
$ec_lang['lpn_search_consent_3']='Dürfen wir Ihre Suchanfragen an den Ortsnamendienst senden?';
$ec_lang['lpn_search_consent_4']='Wenn Sie Nein sagen, funktioniert alles andere auf dieser Seite genau wie jetzt weiter, einschließlich Zu einer Breite und Länge gehen. Ein Ja merken wir uns, damit wir nicht erneut fragen müssen. Ein Nein wird überhaupt nicht gespeichert.';
$ec_lang['lpn_search_refused']='Die Ortsnamensuche ist ausgeschaltet, und es wurde nichts gesendet. Sie können weiterhin Zu einer Breite und Länge gehen verwenden.';
$ec_lang['lpn_search_prompt']='Suchen Sie einen Ort nach Namen. Eine Stadt, eine Straße, ein Wahrzeichen — zum Beispiel: Petaluma, Kalifornien';
$ec_lang['lpn_search_empty']='Geben Sie einen Ortsnamen zum Suchen ein.';
$ec_lang['lpn_search_working']='Suche läuft…';
$ec_lang['lpn_search_busy']='Es läuft bereits eine Suche. Warten Sie auf die Antwort.';
$ec_lang['lpn_search_choose']='Mehr als ein Ort passt. Welcher?';
$ec_lang['lpn_search_nochoice']='Nichts ausgewählt, daher hat sich die Karte nicht bewegt.';
$ec_lang['lpn_search_badchoice']='Das ist keine der Zahlen in der Liste.';
$ec_lang['lpn_search_none']='Für diesen Namen wurde nichts gefunden.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Der Ortsnamendienst bittet uns, langsamer zu werden. Warten Sie eine Minute und versuchen Sie es erneut.';
$ec_lang['lpn_search_http']='Der Ortsnamendienst antwortete mit einem Fehler.';
$ec_lang['lpn_search_timeout']='Der Ortsnamendienst hat nicht rechtzeitig geantwortet. Alles andere auf dieser Seite funktioniert auch ohne ihn.';
$ec_lang['lpn_search_unreadable']='Der Ortsnamendienst antwortete mit etwas, das diese Seite nicht lesen konnte.';
$ec_lang['lpn_search_offline']='Wir konnten den Ortsnamendienst nicht erreichen. Möglicherweise sind Sie offline. Alles andere auf dieser Seite funktioniert auch ohne ihn, einschließlich Zu einer Breite und Länge gehen.';
$ec_lang['lpn_search_toofast']='Eine Suche pro Sekunde — mehr erlaubt der Ortsnamendienst nicht. Versuchen Sie es gleich noch einmal.';
$ec_lang['lpn_search_nofetch']='Dieser Browser kann den Ortsnamendienst nicht erreichen.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox setzt dies aus vielen öffentlichen Höhendatensätzen zusammen, daher hängt die Güte ganz davon ab, wo Sie sich befinden. Wo eine landesweite Lidar-Vermessung vorliegt, wie USGS 3DEP in weiten Teilen der Vereinigten Staaten und ihre Entsprechungen anderswo, kann sie horizontal besser als einen Meter und vertikal wenige Zehntelmeter genau sein. Wo nur globale Daten vorliegen, sind es horizontal etwa 30 m und vertikal mehrere Meter. Mapbox teilt uns nicht mit, welche der beiden Sie erhalten haben. Behandeln Sie es wie eine Höhenlinienkarte, nicht wie eine Vermessung: Prüfen Sie alles, worauf Sie sich verlassen.';
$ec_lang['lpn_terrain_consent_1']='Das Ausfüllen von Höhen sendet die Position jedes Knotens, der eine benötigt — seine Breite und Länge — an api.mapbox.com, um dort die Geländehöhe nachzuschlagen.';
$ec_lang['lpn_terrain_consent_2']='Das ist eine andere Frage als die Kartenbilder hinter Ihrem Projekt. Die Bilder sagen nur, wohin Sie gerade schauen. Diese Positionen sind Ihr Netz selbst. Mapbox erhält diese Koordinaten und Ihre IP-Adresse. Wir senden nichts weiter: keinen Namen, keine Rohre, kein Projekt. Wir führen kein Protokoll darüber, und auf diesem Gerät wird nichts gespeichert außer Ihrer Antwort auf diese Frage.';
$ec_lang['lpn_terrain_consent_3']='Dürfen wir die Positionen Ihrer Knoten an Mapbox senden?';
$ec_lang['lpn_terrain_consent_4']='Wenn Sie Nein sagen, funktioniert alles andere auf dieser Seite genau wie jetzt weiter, und Sie können Höhen wie bisher selbst eingeben. Ein Ja merken wir uns, damit wir nicht erneut fragen müssen. Ein Nein wird überhaupt nicht gespeichert.';
$ec_lang['lpn_terrain_refused']='Es wurden keine Höhen ausgefüllt, und es wurde nichts gesendet. Sie können sie wie bisher selbst eingeben.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Die Höhe von {n} Knoten aus dem Mapbox-DEM ausfüllen?';
$ec_lang['lpn_terrain_confirm_default_1']='Jeder Knoten hat bereits eine Höhe, und {n} davon stehen noch auf {v}, der Höhe, mit der ein neuer Knoten beginnt, statt einer von Ihnen eingegebenen.';
$ec_lang['lpn_terrain_confirm_default_2']='Die Höhe dieser {n} Knoten durch Werte aus dem Mapbox-DEM ersetzen?';
$ec_lang['lpn_terrain_keep']='{k} Knoten haben bereits eine Höhe und werden nicht verändert.';
$ec_lang['lpn_terrain_undo']='Ein einziges Rückgängig (Strg-Z) stellt sie alle wieder her.';
$ec_lang['lpn_terrain_requests']='{n} Anfrage(n) an api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Höhen werden bereits ausgefüllt. Warten Sie darauf.';
$ec_lang['lpn_terrain_offmap']='Diese Knotenpositionen liegen nicht auf der Geländekarte, daher wurde nichts gesendet.';
$ec_lang['lpn_terrain_too_wide']='Diese Knoten verteilen sich über zu viel der Erde, um sie in einem Zug zu lesen ({n} Kachelanfragen). Es wurde nichts gesendet.';
$ec_lang['lpn_terrain_cancelled']='Es wurde nichts geändert und nichts gesendet.';
$ec_lang['lpn_terrain_nofetch']='Dieser Browser kann den Geländedienst nicht erreichen.';
$ec_lang['lpn_terrain_working']='Geländeoberfläche wird gelesen…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Der Geländedienst hat die Anfrage abgelehnt ({status}), daher wurde keine Höhe geändert. Möglicherweise erlaubt das von dieser Seite verwendete Mapbox-Token die Webadresse, auf der Sie sich befinden, nicht.';
$ec_lang['lpn_terrain_failed']='Wir konnten den Geländedienst nicht erreichen, daher wurde keine Höhe geändert. Möglicherweise sind Sie offline. Alles andere auf dieser Seite funktioniert auch ohne ihn.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Der Geländedienst bittet uns, langsamer zu werden (429), daher wurde keine Höhe geändert. Versuchen Sie es in einer Minute erneut.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Der Geländedienst hat mit einem Fehler geantwortet ({status}), daher wurde keine Höhe geändert. An Ihrem Netz liegt es nicht.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Keiner dieser Knoten hat eine Position auf der Erde, daher wurde nichts gesendet und keine Höhe geändert. Das Einlesen der Geländeoberfläche erfordert ein Projekt in Breite und Länge, oder eines auf einer Projektion, die diese Seite platzieren kann.';
$ec_lang['lpn_terrain_done']='{n} Höhe(n) ausgefüllt.';
$ec_lang['lpn_terrain_missed']='{m} konnten nicht gelesen werden und sind noch leer.';
$ec_lang['lpn_terrain_partial']='{f} Geländekachel(n) hat/haben nicht geantwortet.';
$ec_lang['lpn_terrain_will_ids']='Diese Knoten erhalten eine Höhe: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Das sind diese Knoten: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Diese Knoten haben eine Höhe erhalten: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Diese Knoten haben noch keine Höhe: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids} und {n} weitere';

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
$ec_lang['lpn_ff_menu']='Löschwasserprüfung…';
$ec_lang['lpn_ff_menu_tip']='Testet Entnahmeknoten einzeln nacheinander: Wie viel kann jeder liefern, während er den von Ihnen festgelegten Restdruck noch hält, und bringt die Entnahme der erforderlichen Menge dort etwas anderes über seine Grenzwerte hinaus?';
$ec_lang['lpn_ff_title']='Löschwasserprüfung';
$ec_lang['lpn_ff_intro']='Jeder Entnahmeknoten wird der Reihe nach aufgefordert, zusätzlich zu seiner bisherigen Entnahme eine Löschwassermenge zu entnehmen. An Ihrem Projekt ändert sich nichts; der gesamte Lauf erfolgt auf einer Kopie.';
$ec_lang['lpn_ff_scope']='Zu testende Entnahmeknoten';
$ec_lang['lpn_ff_scope_tip']='Wählen Sie die Menge, bevor Sie starten. Das Testen jedes Entnahmeknotens in einem großen System kann Minuten dauern.';
$ec_lang['lpn_ff_all']='Alle';
$ec_lang['lpn_ff_selected']='Ausgewählte';
$ec_lang['lpn_ff_no_junctions']='Dieses Projekt hat noch keine Entnahmeknoten, daher gibt es nichts zu testen.';
$ec_lang['lpn_ff_no_selection']='Kein Entnahmeknoten ist ausgewählt. Wählen Sie Entnahmeknoten aus oder wählen Sie die Option Alle.';
$ec_lang['lpn_ff_skipped']='{n} ausgewählte Elemente sind keine Entnahmeknoten, daher wurden sie nicht geprüft.';
$ec_lang['lpn_ff_required']='Löschwasserbedarf';
$ec_lang['lpn_ff_required_tip']='Der Durchfluss, den Ihre Feuerschutzvorschrift oder Ihre Feuerwehrbehörde an einem Hydranten verlangt. Jeder Entnahmeknoten wird gegen diese Zahl getestet, sofern er nicht einen eigenen Löschwasserbedarf trägt.';
$ec_lang['lpn_ff_required_own']='Entnahmeknoten mit einem eigenen Löschwasserbedarf werden stattdessen gegen diesen getestet. Anzahl davon: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Der für diesen bestimmten Entnahmeknoten erforderliche Löschwasserbedarf für die von ihm versorgte Landnutzung, laut Ihrer Feuerschutzvorschrift oder Ihrer Feuerwehrbehörde. Bleibt es leer, wird der Entnahmeknoten gegen die Zahl im Feld Löschwasserprüfung getestet.';
$ec_lang['lpn_ff_residual']='Zu haltender Restdruck';
$ec_lang['lpn_ff_residual_tip']='Der Druck, den der Entnahmeknoten noch halten muss, während er die Löschwassermenge liefert. AWWA M31 und NFPA 291 verwenden 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Systemprüfung (Auswirkung auf das Netz)';
$ec_lang['lpn_ff_design_tip']='Eine eigene Frage, unabhängig davon, ob der Entnahmeknoten den Durchfluss liefern kann: Fällt, während dort dieser Durchfluss entnommen wird, irgendetwas anderes unter seinen Mindestdruck oder über seinen Geschwindigkeitsgrenzwert? Diese Prüfung zu wählen kostet keine zusätzliche Berechnung.';
$ec_lang['lpn_ff_design_no_selection']='Die Systemprüfung ist auf Ausgewählte eingestellt, aber es sind keine Elemente ausgewählt. Wählen Sie Elemente aus oder wählen Sie die Option Alle.';
$ec_lang['lpn_ff_minpressure']='Niedrigster zulässiger Druck andernorts';
$ec_lang['lpn_ff_minpressure_tip']='Ein Entnahmeknoten, der unter diesen Wert fällt, während ein anderer seine Löschwassermenge liefert, wird als Systemproblem gemeldet.';
$ec_lang['lpn_ff_maxvelocity']='Höchste zulässige Geschwindigkeit';
$ec_lang['lpn_ff_maxvelocity_tip']='Ein Rohr, das oberhalb dieses Werts läuft, während eine Löschwassermenge entnommen wird, wird als Systemproblem gemeldet.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Die Löschwassermenge wird am Entnahmeknoten selbst entnommen. Das ist die hier verwendete Methode, und es ist die übliche. Der Hydrant, seine Anschlussleitung und seine Düse werden nicht modelliert, daher liefert ein echter Hydrant weniger als die hier angezeigte Menge.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Der eingebaute Löser wird verwendet.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='EPANET-Löser wird verwendet.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='Die verfügbare Löschwassermenge wird durch eine Suche ermittelt, daher wird das gesamte Netz für jeden getesteten Entnahmeknoten etwa sechzehnmal berechnet. Bei einem großen System dauert das Minuten. Sie können jederzeit anhalten und behalten, was bereits berechnet wurde.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Nur der gerade angezeigte Zeitschritt wird getestet. Löschwasser wird normalerweise zusätzlich zum Tagesmaximum getestet, stellen Sie das Netz also vor dem Start auf diesen Zustand ein.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Lauf der Löschwasserprüfung';
$ec_lang['lpn_ff_calculate']='Starten';
$ec_lang['lpn_ff_stop']='Anhalten';
$ec_lang['lpn_ff_working']='In Arbeit: {done} von {total} Entnahmeknoten.';
$ec_lang['lpn_ff_stopped']='Angehalten nach {done} von {total} Entnahmeknoten. Die Ergebnisse unten sind die bereits abgeschlossenen.';
$ec_lang['lpn_ff_cost']='Dieser Lauf hat das gesamte Netz {solves} Mal berechnet.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Die Zeichnung hat sich geändert, daher wurden die Ergebnisse der Löschwasserprüfung gelöscht. Führen Sie sie erneut aus.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Ringe löschen';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} Entnahmeknoten hatten keine Auffälligkeit. {fire} Entnahmeknoten haben die Löschwasserprüfung nicht bestanden. {design} Entnahmeknoten haben das übrige Netz beeinträchtigt.';
$ec_lang['lpn_ff_summary_error']='{n} Entnahmeknoten konnten nicht beantwortet werden.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Jeder getestete Entnahmeknoten';
$ec_lang['lpn_ff_col_junction']='Entnahmeknoten';
$ec_lang['lpn_ff_col_static']='Statischer Druck';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='Der Druck an diesem Knoten, bevor überhaupt Löschwasser entnommen wird, während der normale Verbrauch des Systems weiterläuft. Zur Messung wird nichts abgesperrt, daher ist dies kein Druck bei null Durchfluss für das System; es ist derselbe Druck, den die Karte an diesem Knoten zeigt. AWWA M31 und NFPA 291 nennen diesen Messwert beide den Ruhedruck, und dort beginnt eine Löschwasserprüfung.';
$ec_lang['lpn_ff_col_available']='Verfügbare Menge';
$ec_lang['lpn_ff_col_required']='Erforderliche Menge';
$ec_lang['lpn_ff_col_residual']='Gehaltener Restdruck';
$ec_lang['lpn_ff_col_atrequired']='Druck bei Bedarf';
$ec_lang['lpn_ff_col_affected']='Stärkste Auswirkung';
$ec_lang['lpn_ff_col_limit']='Grenzwert';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Nicht geprüft';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Statisch fehlgeschlagen, daher nicht geprüft';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Fehlerarten';
$ec_lang['lpn_ff_mode_fire']='Löschwasser';
$ec_lang['lpn_ff_mode_design']='System';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Keine';
$ec_lang['lpn_ff_col_solves']='Läufe';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Druck und Geschwindigkeit';
$ec_lang['lpn_ff_atleast']='mehr als {flow}';
$ec_lang['lpn_ff_affect_node']='{id} fällt auf {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} erreicht {velocity}';
$ec_lang['lpn_ff_more']='und {n} weitere betroffen';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='{n} weitere Entnahmeknoten werden nicht angezeigt.';
$ec_lang['lpn_ff_design_none']='In der gewählten Menge ist nichts über seine Grenzwerte hinausgegangen, während irgendein Entnahmeknoten seine Löschwassermenge entnahm.';
$ec_lang['lpn_ff_design_off_note']='Die Auswirkung auf das übrige Netz wurde in diesem Lauf nicht geprüft.';
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
$ec_lang['lpn_ff_iso']='Das Insurance Services Office (ISO) rechnet einem einzelnen Hydranten höchstens {flow} an. Diese Anrechnungsgrenze wurde hier nicht angewendet, da nicht bekannt ist, wie viele Hydranten ein Knoten darstellen kann.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Bereits unter dem Restdruck, bevor überhaupt Löschwasser entnommen wird';
$ec_lang['lpn_ff_err_converge']='Das Netz ist nicht konvergiert.';
$ec_lang['lpn_ff_err_solve']='Der Löser hat einen Fehler gemeldet und keine Antwort geliefert.';
$ec_lang['lpn_ff_err_not_junction']='Kein Entnahmeknoten';
$ec_lang['lpn_ff_err_unknown']='Keine Antwort. Der gemeldete Code war {code}.';

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
$ec_lang['lpn_file_import_survey']='Vermessene Punkte importieren…';
$ec_lang['lpn_file_import_survey_tip']='Liest eine Liste vermessener Punkte aus einer Textdatei und legt an jedem Punkt einen Entnahmeknoten an, wobei für alles, was die Datei nicht angibt, die Startwerte für neue Elemente verwendet werden. Es werden keine Rohre gezeichnet, und keine Zeile wird verworfen, ohne genannt zu werden. Es wird das Koordinatensystem gelesen, das dieses Projekt bereits verwendet, georeferenziert oder nicht.';
$ec_lang['lpn_survey_read_error']='Diese Datei konnte nicht von Ihrer Festplatte gelesen werden.';
$ec_lang['lpn_survey_cancelled']='Es wurde nichts erstellt und nichts geändert.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Hochwert';
$ec_lang['lpn_survey_axis_east']='Rechtswert';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Diese Datei enthält nichts.';
$ec_lang['lpn_survey_err_unreadable']='Diese Datei konnte nicht als Liste vermessener Punkte gelesen werden.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Mehr als eine Spalte in dieser Datei könnte der {axis} sein ({detail}), und diese Seite wählt nicht zwischen ihnen. Lassen Sie eine davon als {axis} benannt und versuchen Sie es erneut.';
$ec_lang['lpn_survey_err_no_points']='Keine einzige Zeile dieser Datei konnte als vermessener Punkt gelesen werden. Gelesene Zeilen: {detail}';
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
$ec_lang['lpn_survey_format_label']='Dateiformat:';
$ec_lang['lpn_survey_format_internal']='intern festgelegt';
$ec_lang['lpn_survey_create']='Knoten erstellen';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='Die erste Zeile wurde übersprungen: Sie benennt keine Spalten, die diese Seite kennt.';
$ec_lang['lpn_survey_type_label']='Elementtyp:';
$ec_lang['lpn_survey_confirm_junction']='{n} Entnahmeknoten gefunden. Fortfahren?';
$ec_lang['lpn_survey_confirm_reservoir']='{n} Reservoir(e) gefunden. Fortfahren?';
$ec_lang['lpn_survey_confirm_tank']='{n} Tank(s) gefunden. Fortfahren?';
$ec_lang['lpn_survey_report_junction']='{n} Entnahmeknoten importiert, davon {m} mit Höhe.';
$ec_lang['lpn_survey_report_reservoir']='{n} Reservoir(e) importiert, davon {m} mit Höhe.';
$ec_lang['lpn_survey_report_tank']='{n} Tank(s) importiert, davon {m} mit Höhe.';
$ec_lang['lpn_survey_report_clean']='Jeder Punkt der Datei wurde übernommen, und nichts wurde beim Import geändert.';
$ec_lang['lpn_survey_report_notes']='Importfehler und Hinweise:';
$ec_lang['lpn_survey_sev_error']='Fehler';
$ec_lang['lpn_survey_sev_warning']='Warnung';
$ec_lang['lpn_survey_note_line']='Zeile {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Zu wenige Spalten für das oben genannte Dateiformat.';
$ec_lang['lpn_survey_note_coord_missing']='Die Zelle für {axis} ist leer.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} lässt sich nicht als Zahl lesen.';
$ec_lang['lpn_survey_note_coord_range']='{axis} liegt außerhalb des von diesem Projekt zugelassenen Bereichs.';
$ec_lang['lpn_survey_note_bad_elev']='Nicht-numerische Höhe. Ohne Höhe importiert.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Mehr als eine Spalte könnte die Höhe sein, daher wurde keine davon gelesen.';
$ec_lang['lpn_survey_note_blank_rows']='Leerzeilen übersprungen: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Name wird bereits früher in dieser Datei verwendet, neuer Name zugewiesen.';
$ec_lang['lpn_survey_note_id_taken']='Name bereits im Projekt vorhanden, neuer Name zugewiesen.';
$ec_lang['lpn_survey_note_id_invalid']='Name kann hier nicht verwendet werden, neuer Name zugewiesen.';
$ec_lang['lpn_hotkeys_menu_heading']='Menüs';
$ec_lang['lpn_hotkeys_menu_term']='Tastenkürzel der Menüs';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Umschalt+Buchstabe</td><td>Öffnet das Menü mit diesem Buchstaben; drücken Sie dann den Buchstaben einer Zeile, um sie zu wählen. Die Buchstaben werden angezeigt, solange Sie die Tastatur benutzen. Auf einem Mac verwenden Sie Strg+Option.</td></tr><tr><td>F10</td><td>Wechselt zur Menüleiste.</td></tr></tbody></table>';
$ec_lang['lpn_graphs_menu']='Graphen';
$ec_lang['lpn_contour_menu']='Konturen';
$ec_lang['lpn_contour_tip']='Zeigt auf der Karte eine Konturdarstellung: Die Farben der Knoten breiten sich entlang und neben den Rohren aus, mit beschrifteten Konturlinien. Öffnet ein Feld zum Einstellen oder zum Ausschalten.';
$ec_lang['lpn_contour_plot']='Konturdarstellung';
$ec_lang['lpn_contour_fill']='Füllung';
$ec_lang['lpn_contour_fill_tip']='Weich blendet die Farben von einer Klasse in die nächste über. Stufen malt jede Klasse der Farbskala einfarbig.';
$ec_lang['lpn_contour_fill_smooth']='Weich';
$ec_lang['lpn_contour_fill_bands']='Stufen';
$ec_lang['lpn_contour_opacity']='Deckkraft der Füllung';
$ec_lang['lpn_contour_lines']='Konturlinien';
$ec_lang['lpn_contour_interval']='Abstand';
$ec_lang['lpn_contour_buffer']='Puffer';
$ec_lang['lpn_contour_buffer_unit']='× mittlere Rohrlänge';
$ec_lang['lpn_contour_buffer_tip']='Wie weit die Farbe von jedem Rohr aus reicht, als Vielfaches der mittleren Rohrlänge (Median). Im äußeren Teil blendet sie aus.';
$ec_lang['lpn_contour_few']='Zu wenige Knoten für eine Konturdarstellung.';
$ec_lang['lpn_contour_support']='Konturdarstellung: {n} Knoten, interpoliert entlang von {p} Rohren und bis zum {k}-Fachen der mittleren Rohrlänge daneben. Keine Farbe über Pumpen, Ventile oder geschlossene Verbindungen hinweg.';
$ec_lang['lpn_contour_support_lines']='Konturlinien alle {i} {u}.';
$ec_lang['lpn_contour_too_many']='Zu viele Konturlinien bei diesem Abstand; vergrößern Sie ihn, um sie zu zeichnen.';
$ec_lang['lpn_contour_dem']='Gelände zwischen den Knoten aus Mapbox-DEM';
$ec_lang['lpn_contour_dem_tip']='Zwischen den Knoten wird der Druck zur interpolierten Druckhöhe minus der Geländehöhe aus Mapbox-DEM, sodass er an einem Hügel, auf dem das Netz keinen Knoten hat, unter den niedrigsten Knotendruck fallen kann. Betrachten Sie das Gelände als Höhenkarte, nicht als Vermessung.';
$ec_lang['lpn_contour_support_dem']='Zwischen den Knoten ist der Druck die interpolierte Druckhöhe minus die Geländehöhe aus Mapbox-DEM, etwa alle {m} m abgetastet.';
$ec_lang['lpn_contour_dem_failed']='Das Gelände konnte nicht aus Mapbox-DEM gelesen werden, daher wird der Druck nur zwischen den Knoten interpoliert.';
$ec_lang['lpn_contour_consent_1']='Das Zeichnen des Drucks über dem Gelände sendet das Gebiet, das Ihr Netz abdeckt, als Mapbox-Kachelnummern an api.mapbox.com, um dort die Geländehöhe zu lesen.';
$ec_lang['lpn_contour_consent_2']='Das ist eine andere Frage als die Kartenbilder hinter Ihrem Projekt. Die Bilder sagen nur, wohin Sie gerade schauen. Diese Kacheln sagen, wo Ihr Netz liegt. Mapbox erhält diese Kachelnummern und Ihre IP-Adresse. Wir senden nichts weiter: keinen Namen, keine Rohre, kein Projekt. Wir führen darüber keine Aufzeichnung, und auf diesem Gerät wird nichts gespeichert außer Ihrer Antwort auf diese Frage.';
$ec_lang['lpn_contour_consent_3']='Dürfen wir die Kachelnummern des Gebiets Ihres Netzes an Mapbox senden?';
$ec_lang['lpn_contour_consent_4']='Wenn Sie Nein sagen, funktioniert alles andere auf dieser Seite genau wie jetzt weiter, und die Konturdarstellung wird nur zwischen den Knoten gezeichnet. Ein Ja merken wir uns, damit wir nicht erneut fragen müssen. Ein Nein wird überhaupt nicht gespeichert.';
$ec_lang['lpn_sysflow_menu']='Durchflussbilanz';
$ec_lang['lpn_sysflow_tip']='Stellt den insgesamt erzeugten und den insgesamt verbrauchten Durchfluss über die Zeit dar, über die Simulation mit erweitertem Zeitraum. Tanks gehören zu keiner der beiden Summen; wo die beiden Linien auseinanderlaufen, füllen oder leeren sich also die Tanks.';
$ec_lang['lpn_sysflow_produced']='Erzeugt';
$ec_lang['lpn_sysflow_produced_tip']='Gesamter Durchfluss ins Netz aus Reservoiren und aus negativen Entnahmen.';
$ec_lang['lpn_sysflow_consumed']='Verbraucht';
$ec_lang['lpn_sysflow_consumed_tip']='Summe jeder positiven Entnahme: Wasser, das an Entnahmeknoten aus dem Netz entnommen wird, und jeder Durchfluss in ein Reservoir.';
$ec_lang['lpn_copy_title']='Datei als neue Kopie kennzeichnen?';
$ec_lang['lpn_copy_body']='Diese Datei gibt an, dass sie am {date} erstellt wurde, und dieser Browser erkennt sie nicht. Ist sie die Originaldatei (dieselbe Sperre behalten) oder eine Kopie (neue Sperre erzeugen)?';
$ec_lang['lpn_copy_body_nodate']='Dieser Browser erkennt diese Datei nicht. Ist sie die Originaldatei (dieselbe Sperre behalten) oder eine Kopie (neue Sperre erzeugen)?';
$ec_lang['lpn_copy_original']='Original; dieselbe Sperre behalten';
$ec_lang['lpn_copy_copy']='Eine Kopie; neue Sperre erzeugen';
$ec_lang['lpn_copy_kept_link']='{name} wurde als Original geöffnet, an einen neuen Ort verschoben. Speichern schreibt jetzt in diese Datei.';
$ec_lang['lpn_copy_opened']='{file} wurde als Kopie geöffnet, mit einer eigenen neuen Sperre, die beim nächsten Speichern der Datei mitgespeichert wird.';
$ec_lang['lpn_scenario_basic']='Basismodus';
$ec_lang['lpn_scenario_basic_tip']='Aktiviert ist ein Szenario einfach die Werte, die Sie darin festlegen. Deaktiviert bietet dieses Menü außerdem die Vorschautabelle Alternativen, die zeigt, wie diese Werte nach Kategorie gruppiert sind, und zu Ihrer Rückmeldung einlädt.';
$ec_lang['lpn_alt_title']='Vorschau der Alternativen';
$ec_lang['lpn_alt_note']='Nur lesbar. Basis verwendet die Basisalternative jeder Kategorie. Jedes Szenario erhält für jede geänderte Kategorie eine eigene Alternative, ein Kind der Basisalternative. Die Zahl gibt an, wie viele geänderte Werte sie hat.';
$ec_lang['lpn_alt_cat_physical']='Physikalisch';
$ec_lang['lpn_alt_cat_demand']='Entnahme';
$ec_lang['lpn_alt_cat_topology']='Aktivierung von Elementen';
$ec_lang['lpn_alt_cat_initial']='Anfangseinstellungen';
$ec_lang['lpn_alt_cat_constituent']='Inhaltsstoff';
$ec_lang['lpn_alt_cat_fireflow']='Löschwassermenge';
$ec_lang['lpn_alt_cat_energy']='Energiekosten';
$ec_lang['lpn_alt_cat_userdata']='Eigene Eigenschaften';
$ec_lang['lpn_alt_cat_text']='Text';
$ec_lang['lpn_reports_calib']='Kalibrierung';
$ec_lang['lpn_reports_calib_tip']='Vergleicht gemessene Felddaten aus einer Kalibrierdatei mit dem letzten Lauf: Statistiken, ein Korrelationsdiagramm und Mittelwertvergleiche.';
$ec_lang['lpn_calib_title']='Kalibrierungsbericht';
$ec_lang['lpn_calib_param']='Parameter';
$ec_lang['lpn_calib_param_tip']='Die Größe, die die Kalibrierdatei misst. Für jeden Parameter wird eine Datei gehalten.';
$ec_lang['lpn_calib_load']='Kalibrierdatei laden…';
$ec_lang['lpn_calib_load_tip']='Eine Textdatei mit einer Standort-ID, einer Zeit und einem Messwert in jeder Zeile. Die Zeit wird ab dem Beginn der Simulation gemessen, in Dezimalstunden oder Stunden:Minuten. Ein Semikolon beginnt einen Kommentar. Eine Zeile mit nur einer Zeit und einem Wert gehört zum Standort darüber.';
$ec_lang['lpn_calib_none']='Für diesen Parameter ist keine Kalibrierdatei geladen.';
$ec_lang['lpn_calib_session']='Eine Kalibrierdatei wird nur für diese Sitzung gehalten. Sie wird weder mit dem Projekt noch auf diesem Gerät gespeichert.';
$ec_lang['lpn_calib_file']='{file}: {n} Messungen an {m} Standorten.';
$ec_lang['lpn_calib_units']='Die Werte der Datei werden in den Einheiten dieses Projekts gelesen: {unit}.';
$ec_lang['lpn_calib_missing']='In der Datei genannt, aber nicht in diesem Netz: {ids}.';
$ec_lang['lpn_calib_missing_count']='Übersprungene Messungen, weil ihr Standort nicht in diesem Netz liegt: {n}.';
$ec_lang['lpn_calib_bad_lines']='Zeilen, die nicht gelesen werden konnten, übersprungen: {lines}';
$ec_lang['lpn_calib_outside']='Übersprungene Messungen außerhalb der Zeiten, die dieser Lauf ausgegeben hat: {n}.';
$ec_lang['lpn_calib_no_value']='Übersprungene Messungen ohne berechneten Wert zu ihrer Zeit: {n}.';
$ec_lang['lpn_calib_single']='Dies ist ein Lauf mit einem einzigen Zeitraum, daher wird jede Messung mit seinem einen Ergebnis verglichen, unabhängig von der Zeit, die die Datei angibt.';
$ec_lang['lpn_calib_needs_run']='Es gibt noch keine Ergebnisse zum Vergleichen. Der Bericht füllt sich, sobald das Netz berechnet wurde.';
$ec_lang['lpn_calib_no_pairs']='Keine Messung konnte verglichen werden, daher gibt es nichts darzustellen.';
$ec_lang['lpn_calib_tab_stats']='Statistik';
$ec_lang['lpn_calib_tab_corr']='Korrelationsdiagramm';
$ec_lang['lpn_calib_tab_means']='Mittelwertvergleiche';
$ec_lang['lpn_calib_col_location']='Standort';
$ec_lang['lpn_calib_col_n']='Anz. Beob.';
$ec_lang['lpn_calib_col_obs_mean']='Beobachteter Mittelwert';
$ec_lang['lpn_calib_col_sim_mean']='Berechneter Mittelwert';
$ec_lang['lpn_calib_col_mean_err']='Mittlerer Fehler';
$ec_lang['lpn_calib_col_mean_err_tip']='Der Mittelwert der Absolutbeträge der Differenzen zwischen jedem beobachteten Wert und dem berechneten Wert zur selben Zeit.';
$ec_lang['lpn_calib_col_rms_err']='RMS-Fehler';
$ec_lang['lpn_calib_col_rms_err_tip']='Quadratischer Mittelwertfehler (Root Mean Square Error): die Quadratwurzel aus dem Mittelwert der quadrierten Differenzen zwischen beobachteten und berechneten Werten.';
$ec_lang['lpn_calib_network']='Netz';
$ec_lang['lpn_calib_corr_means']='Korrelation zwischen den Mittelwerten: {r}';
$ec_lang['lpn_calib_corr_none']='Korrelation zwischen den Mittelwerten: Sie braucht mindestens zwei Standorte mit unterschiedlichen Mittelwerten.';
$ec_lang['lpn_calib_axis_obs']='Beobachtet: {q}';
$ec_lang['lpn_calib_axis_sim']='Berechnet: {q}';
$ec_lang['lpn_calib_observed']='Beobachtet';
$ec_lang['lpn_calib_computed']='Berechnet';
$ec_lang['lpn_calib_point']='{id}, {time}: beobachtet {o}, berechnet {s}';
$ec_lang['lpn_calib_corr_note']='Jeder Punkt ist eine Messung. Je näher die Punkte an der Diagonallinie liegen, desto besser stimmen die berechneten mit den beobachteten Werten überein.';
$ec_lang['lpn_calib_ts_point']='Gemessen an {id}, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='Ringe sind gemessene Werte aus der Kalibrierdatei.';
$ec_lang['lpn_analyze_menu']='Analysieren';
$ec_lang['lpn_analyze_menu_tip']='Analysen, die das Netz auf einer Kopie berechnen: Löschwassermenge an jedem Entnahmeknoten, der Verlust jedes Rohrs, jeder Pumpe und jedes Ventils sowie die hinauf- oder herunterskalierten Entnahmen.';
$ec_lang['lpn_ff_design_off']='Keine';
$ec_lang['lpn_ff_design_all']='Alle';
$ec_lang['lpn_ff_design_selected']='Ausgewählte';
$ec_lang['lpn_ff_rows_more_links']='Nicht angezeigte Verbindungen: {n}.';
$ec_lang['lpn_crit_menu']='Kritikalitätsanalyse…';
$ec_lang['lpn_crit_menu_tip']='Nimmt jedes Rohr, jede Pumpe und jedes Ventil nacheinander aus dem Netz und zeigt, was das System verliert.';
$ec_lang['lpn_crit_title']='Kritikalitätsanalyse';
$ec_lang['lpn_crit_intro']='Jedes Element wird nacheinander aus dem Netz genommen, und das Netz wird im aktuell angezeigten Zeitschritt im aktiven Szenario berechnet. An Ihrem Projekt ändert sich nichts; der gesamte Lauf erfolgt auf einer Kopie.';
$ec_lang['lpn_crit_scope']='Zu unterbrechende Verbindungen';
$ec_lang['lpn_crit_scope_tip']='Alle Rohre, Pumpen und Ventile oder nur die auf der Karte ausgewählten. Wählen Sie die Menge, bevor Sie starten.';
$ec_lang['lpn_crit_scope_all']='Alle Verbindungen';
$ec_lang['lpn_crit_scope_selected']='Ausgewählte Verbindungen';
$ec_lang['lpn_crit_minpressure']='Niedrigster zulässiger Druck';
$ec_lang['lpn_crit_minpressure_tip']='Das ist dieselbe Zahl wie Niedrigster zulässiger Druck andernorts in der Löschwasserprüfung. Wenn Sie sie hier ändern, ändert sie sich dort.';
$ec_lang['lpn_crit_col_asset']='Element';
$ec_lang['lpn_crit_col_unserved']='Nicht gedeckte Entnahme';
$ec_lang['lpn_crit_col_cutoff']='Abgetrennte Entnahmeknoten';
$ec_lang['lpn_crit_col_below']='Entnahmeknoten unter Minimum';
$ec_lang['lpn_crit_summary']='{n} von {total} Elementen lassen Entnahme ungedeckt oder lassen einen Entnahmeknoten unter {pressure} fallen.';
$ec_lang['lpn_crit_baseline_below']='Entnahmeknoten, die ohne Ausfall bereits darunter liegen: {n}. Sie werden nicht mitgezählt.';
$ec_lang['lpn_crit_working']='In Arbeit: {done} von {total} Elementen.';
$ec_lang['lpn_crit_stopped']='Angehalten nach {done} von {total} Elementen. Die Ergebnisse unten sind die bereits abgeschlossenen.';
$ec_lang['lpn_crit_no_selection']='Es sind keine Verbindungen ausgewählt. Wählen Sie Verbindungen aus oder wählen Sie Alle Verbindungen.';
$ec_lang['lpn_crit_no_links']='Dieses Projekt hat noch keine Verbindungen, daher gibt es nichts zu unterbrechen.';
$ec_lang['lpn_crit_busy']='Eine andere Analyse läuft. Halten Sie sie an oder warten Sie, bis sie fertig ist.';
$ec_lang['lpn_crit_skipped']='{n} ausgewählte Elemente sind keine Verbindungen, daher wurden sie nicht unterbrochen.';
$ec_lang['lpn_crit_stale']='Die Zeichnung hat sich geändert, daher wurden die Ergebnisse der Kritikalitätsanalyse gelöscht. Führen Sie sie erneut aus.';
$ec_lang['lpn_crit_skipdead']='Sackgassen überspringen';
$ec_lang['lpn_crit_skipdead_tip']='Eine Sackgassenverbindung ist eine, deren Entfernung Entnahmeknoten abtrennt, die nur über sie erreichbar sind, ohne Reservoir oder Tank dahinter. Ihr Verlust ist alles dahinter, daher wird sie nicht berechnet. Die Zusammenfassung nennt, wie viele übersprungen wurden.';
$ec_lang['lpn_crit_skipped_dead']='Übersprungene Sackgassenverbindungen: {n}. Jede trennt alles dahinter ab.';
