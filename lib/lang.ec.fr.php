<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='fraction';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='ft^3/s';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/s';
$ec_lang['u_gpm']='gal/min';
$ec_lang['u_gradePercent']='% pente';
$ec_lang['u_grade']='pente';
$ec_lang['u_in2']='po^2';
$ec_lang['u_inh2o']='po H2O';
$ec_lang['u_in']='po';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='L/s';
$ec_lang['u_m2']='m^2';
$ec_lang['u_m3ps']='m^3/s';
$ec_lang['u_mgd']='Mgal/j';
$ec_lang['u_imgd']='Mgal imp/j';
$ec_lang['u_afd']='ac-ft/j';
$ec_lang['u_lpm']='L/min';
$ec_lang['u_cmh']='m^3/h';
$ec_lang['u_cmd']='m^3/j';
$ec_lang['u_mh2o']='m H2O';
$ec_lang['u_mld']='ML/j';
$ec_lang['u_m']='m';
$ec_lang['u_mm2']='mm^2';
$ec_lang['u_mmh2o']='mm H2O';
$ec_lang['u_mm']='mm';
$ec_lang['u_mps']='m/s';
$ec_lang['u_npm2']='N/m^2';
$ec_lang['u_pa']='Pa';
$ec_lang['u_psf']='lbs/ft^2';
$ec_lang['u_psi']='lbs/po^2';
$ec_lang['u_bar']='bar';
$ec_lang['u_kgfcm2']='kgf/cm^2';
$ec_lang['u_s']='s';
$ec_lang['u_hr']='h';
$ec_lang['u_day']='j';
$ec_lang['u_lph']='L/h';
$ec_lang['u_gph']='gal/h';
$ec_lang['u_mmph']='mm/h';
$ec_lang['u_inph']='in/h';
$ec_lang['u_acft']='ac-ft';
$ec_lang['u_ft3']='ft^3';
$ec_lang['u_m3']='m^3';
$ec_lang['u_kw']='kW';
$ec_lang['u_mw']='MW';
$ec_lang['u_kwh_yr']='kWh/an';
$ec_lang['u_mwh_yr']='MWh/an';
$ec_lang['u_hp']='hp';
$ec_lang['u_m2ps']='m^2/s';
$ec_lang['u_ft2ps']='cfs/ft';

// Page text
// In page order for easiest maintenance.
// Menu and General
$ec_lang['menu_brand']='Calculateurs HawsEDC';
$ec_lang['menu_main_hydraulics']='Hydraulique';
$ec_lang['menu_help']='Aide';
$ec_lang['menu_libre']='Logiciel libre';
$ec_lang['template_welcome']='Laissez vos peurs à la porte; l\'amour est parlé ici. Vous ne ruinez pas tout. Profitez également des <a target="_blank" href="https://hawsedc.com/download.php">outils AutoCAD gratuits HawsEDC</a>.';
$ec_lang['template_feedback']='Pouvez-vous suggérer une meilleure formulation pour cette page, ou autre chose ? Voulez-vous m\'aider ou apprendre à créer des outils comme ceux-ci ? N\'hésitez pas à me contacter.';
$ec_lang['template_printable_title']='Titre imprimable';
$ec_lang['template_printable_subtitle']='Sous-titre imprimable';
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
$ec_lang['consent_body']='Pouvons-nous enregistrer un cookie d\'un seul chiffre dans ce navigateur pour nous souvenir que nous avons déjà compté cette page ? Il n\'enregistre rien sur vous ni rien de ce que vous saisissez. Sans lui, nous ne pouvons pas distinguer votre deuxième visite de la première visite de quelqu\'un d\'autre.';
$ec_lang['consent_accept']='Accepter cette fois';
$ec_lang['consent_accept_all']='Toujours accepter';
$ec_lang['consent_decline']='Toujours refuser';
$ec_lang['consent_current_granted']='Vous avez autorisé cela. Nous limitons l\'enregistrement pour ce profil de navigateur.';
$ec_lang['consent_current_denied']='Vous avez refusé cela. Nous ne conservons rien pour limiter l\'enregistrement pour ce profil de navigateur.';
$ec_lang['consent_region_label']='Votre choix concernant la limitation de l\'enregistrement.';
$ec_lang['consent_settings_link']='Paramètres des cookies';
$ec_lang['privacy_link']='Politique de confidentialité';
$ec_lang['terms_link']='Conditions d\'utilisation';
$ec_lang['index_main_title']='Calculateurs d\'ingénierie gratuits en ligne';
$ec_lang['index_meta_desc_plain']='Calculateurs gratuits d\'ingénierie hydraulique pour conduites, canaux, déversoirs et irrigation. Ils fonctionnent dans votre navigateur, hors ligne, et sont disponibles en 27 langues.';
$ec_lang['calc_set_units']='Définir les unités:';
$ec_lang['calc_set_units_tip']='Définit l\'unité de tous les champs à la fois. Non destructif : les nombres que vous avez saisis restent exactement les mêmes, et chacun est maintenant lu dans la nouvelle unité. Un 6 reste un 6, mais il signifie désormais 6 pouces au lieu de 6 millimètres.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Rétablir les valeurs par défaut';
$ec_lang['calc_defaults_confirm']='Réinitialiser le calculateur aux valeurs par défaut d\'origine ?';
$ec_lang['points_data_note']='(ou Copier/Coller via la zone de données)';
$ec_lang['points_data_heading']='Données du calculateur<br />(utilisez Copier pour voir le format)';
$ec_lang['points_data_copy']='Copier';
$ec_lang['points_data_paste']='Coller';
$ec_lang['calc_inputs']='Données';
$ec_lang['calc_results']='Résultats:';
$ec_lang['view_hide_line']='Masquer cette ligne';
$ec_lang['view_printable']='Version imprimable (recharger pour restaurer)';
$ec_lang['ec_name_label']='Enregistrer ce calcul :';
$ec_lang['ec_name_placeholder']='Nom';
$ec_lang['ec_name_tip']='Enregistre les données saisies dans l\'URL pour les signets, la récupération de l\'historique et le partage';
$ec_lang['calc_copy_link']='Copier le lien';
$ec_lang['ec_related_calcs']='Calculateurs associés :';
$ec_lang['calc_copy_link_done']='Copié !';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Perte de charge Darcy-Weisbach';
$ec_lang['dw_main_title']='Calculateur gratuit en ligne de perte de charge Darcy-Weisbach';
$ec_lang['dw_main_desc']='Perte de charge Darcy-Weisbach pour un diamètre, une rugosité et un débit donnés';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Hauteur de rugosité absolue, e, de la paroi de la conduite. Valeurs typiques : acier (neuf) 0,046 mm, acier (usagé) 0,15 mm, HDPE 0,003 mm, PVC/uPVC 0,0015 mm, béton 0,3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s pour l\'eau claire à 20°C">Viscosité cinématique, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Viscosité cinématique, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s pour l\'eau claire à 20°C';
$ec_lang['dw_reynolds_number']='Nombre de Reynolds, Re';
$ec_lang['dw_flow_regime']='Régime d’écoulement';
$ec_lang['dw_regime_laminar']='laminaire';
$ec_lang['dw_regime_transitional']='de transition';
$ec_lang['dw_regime_turbulent']='turbulent';
$ec_lang['dw_friction_factor_method']='Méthode du facteur de frottement';
$ec_lang['dw_friction_factor']='Facteur de frottement, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Perte de charge Hazen-Williams';
$ec_lang['hw_main_title']='Calculateur gratuit en ligne de perte de charge Hazen-Williams';
$ec_lang['hw_main_desc']='Perte de charge Hazen-Williams pour un diamètre, un coefficient de Hazen-Williams C et un débit donnés';
$ec_lang['hw_hgl_1']='LHP aval';
$ec_lang['hw_hgl_2']='LHP amont';
$ec_lang['hw_elev_up']='Cote amont';
$ec_lang['hw_pressure_up']='Pression amont';
$ec_lang['hw_elev_down']='Cote aval';
$ec_lang['hw_pressure_down']='Pression aval';
$ec_lang['hw_pressure_check']='Vérification de la pression';
$ec_lang['hw_pressure_ok_short']='Pression positive';
$ec_lang['hw_pressure_neg_short']='Pression négative';
$ec_lang['hw_pressure_neg']='La pression aval est inférieure à zéro. La LHP passe sous la conduite, si bien que celle-ci ne s\'écoulerait pas pleine et ce résultat peut ne pas être valide.';
$ec_lang['hw_roughness']='Coefficient Hazen-Williams, C';
$ec_lang['hw_note_1']='<dl><dt>Cet outil de calcul ne modélise pas le profil de la conduite entre les deux extrémités.</dt><dd>Il n\'utilise que les cotes amont et aval que vous saisissez. Si le terrain s\'élève plus haut que l\'une ou l\'autre extrémité en un point intermédiaire, la pression en ce point haut est inférieure à toute pression indiquée ici. Relancez le calcul pour la longueur allant de l\'extrémité amont jusqu\'au point haut afin de le vérifier.</dd><dd>Là où la LHP passe sous la conduite, l\'eau est sous pression négative. L\'air sort de solution, une conduite à paroi mince peut s\'effondrer, et de l\'eau souterraine contaminée peut être aspirée par les joints. Maintenez une pression positive partout le long de la conduite et prévoyez une ventouse (purgeur d\'air) à chaque point haut.</dd><dt>La pression amont est une condition aux limites que vous fournissez.</dt><dd>Relevez-la sur un manomètre, à partir du niveau d\'eau d\'un réservoir (la hauteur d\'eau au-dessus de la conduite), ou à partir d\'une courbe de pompe. Une pompe fournit une pression moindre lorsque le débit augmente ; utilisez donc le point de la courbe correspondant au débit saisi ci-dessus.</dd><dt>Additionnez vous-même les coefficients de perte de charge singulière.</dt><dd>Totalisez les valeurs K de chaque vanne, coude, té, compteur et entrée de la conduite, et saisissez ce total. Suivez le lien de ce champ pour des valeurs typiques. Sur une conduite d\'adduction longue, ces pertes sont faibles par rapport au frottement, mais dans une tuyauterie de station courte, elles peuvent représenter l\'essentiel de la perte.</dd></dl>';
$ec_lang['hw_notes_epanet_term']='Les constantes de Hazen-Williams correspondent maintenant à EPANET (août 2026)';
$ec_lang['hw_notes_epanet_def']='En août 2026, le coefficient et l\'exposant de Hazen-Williams ont été modifiés pour correspondre à EPANET. Les résultats de perte de charge diffèrent de ceux des versions précédentes de cette page de 0,1 pour cent au maximum, bien moins que l\'incertitude sur la valeur de C elle-même.';
// Manning Irregular
$ec_lang['mi_menu']='Canal à section irrégulière Manning';
$ec_lang['mi_main_title']='Calculateur Manning gratuit en ligne de canal à section irrégulière';
$ec_lang['mi_main_desc']='Calculateur d\'écoulement uniforme Manning en canal à section irrégulière';
$ec_lang['mi_waterSurfaceElevation']='Cote de la surface libre';
$ec_lang['mi_q_617']='<span class="ec-help" title="Le débit composé, Q, utilisant un n composé pour chaque région selon Chow 6-17, vitesses égales">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Points de la section en travers';
$ec_lang['mi_groupPoint']='Point';
$ec_lang['mi_groupSegment']='Segment';
$ec_lang['mi_groupRegion']='Région';
$ec_lang['mi_station']='Sta.';
$ec_lang['mi_elevation']='Cote';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />limite de<br />région<br />(Berge)';
$ec_lang['mi_tau']='Cisaill.<br />fond<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n<br />composé';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='n composé';
$ec_lang['mi_notes_1_def']='Ce calculateur suit le manuel de référence HEC-RAS pour calculer le n composé par région selon Chow 1959, page 136, équation 6-17 (et non 6-18).';
$ec_lang['mi_notes_3_term']='Erratum';
$ec_lang['mi_notes_3_def']='Trouvée et corrigée le 23 août 2026. Un segment tracé exactement à la verticale — deux points à la même station, l\'un au-dessus de l\'autre, comme on dessine un canal rectangulaire, un dalot ou un mur de soutènement — n\'ajoutait aucun périmètre mouillé. Les résultats obtenus avant cette date sont trop élevés pour toute section comportant un mur vertical : un canal de 10 de large et 5 de profond recevait un périmètre mouillé de 10 au lieu de 20, et un débit environ 1,6 fois trop élevé. Une berge en pente, même raide, n\'a jamais été affectée, pas plus qu\'un mur s\'élevant au-dessus de l\'eau. Si vous avez utilisé cette page sur une section comportant un mur vertical, relancez le calcul.';
$ec_lang['mi_notes_2_term']='Revêtement rocheux';
$ec_lang['mi_notes_2_def']='Utilisez le calculateur de canal trapézoïdal Manning pour dimensionner le revêtement rocheux. Ce calculateur est destiné aux sections naturelles.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Écoulement Manning en conduite';
$ec_lang['mpf_main_title']='Calculateur gratuit en ligne de la formule Manning pour l\'écoulement en conduite';
$ec_lang['mpf_main_desc']='Écoulement uniforme Manning en conduite à pente et taux de remplissage donnés';
$ec_lang['mpf_pipe_diameter']='Diamètre de la conduite, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Rugosité de Manning, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Pente de frottement, S<sub>f</sub></a><span class="ec-help" title="Parfois égale à la pente de la conduite. Suivez le lien pour l\'explication (en anglais seulement)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Taux de remplissage, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Débit, Q';
$ec_lang['mpf_flow_tip']='Débit et profondeur calculés pour une conduite de longueur infinie. Faire entrer ce débit dans la conduite peut nécessiter une charge amont plus élevée. Voir les notes ci-dessous pour plus de détails et une vidéo explicative.';
$ec_lang['mpf_velocity']='Vitesse, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Énergie cinétique exprimée en hauteur de colonne d\'eau, v²/2g">Charge cinétique, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Section mouillée, A';
$ec_lang['mpf_pipe_area']='Section de la conduite, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Rapport des sections, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Périmètre mouillé, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Rayon hydraulique, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Largeur au miroir, T';
$ec_lang['mpf_froude_number']='Nombre de Froude, Fr';
$ec_lang['mpf_shear_stress']='Contrainte de cisaillement moyenne, τ';
$ec_lang['mpf_full_flow']='Débit à section pleine, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Rapport au débit à section pleine, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Il s\'agit du débit (et de la profondeur) à l\'intérieur d\'une conduite de <em>longueur infinie</em>.</dt><dd>Faire entrer le débit dans la conduite peut nécessiter une charge amont nettement plus élevée. Ajoutez au moins 1,5 fois la charge cinétique pour obtenir la charge amont, ou <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">consultez mon tutoriel de 2 minutes</a> pour les calculs standard de charge amont de buse à l\'aide de <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, le logiciel gratuit de calcul de buses de la Federal Highway Administration (administration fédérale des routes) des États-Unis.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Vous concevez un égout sanitaire ?</dt><dd>Consultez les <a target="_blank" href="/sewslope.php">tableaux de pente minimale d\'égout</a> pour les conduites de 4 à 96 pouces (100 à 2400 mm), donnés en m/m, mm/m et pourcentage, ainsi que l\'étude sur les <a target="_blank" href="/peakfact.php">facteurs de pointe pour les très faibles débits</a>. Ces deux documents de référence sont uniquement en anglais.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Entrez un Q cible positif.';
$ec_lang['mpf_solver_no_solution']='Aucune solution : Q dépasse la capacité de la conduite à y/d0 = 93.8% (Qmax = {qmax} dans les unités sélectionnées).';
$ec_lang['mpf_solve_btn']='Calculer';
$ec_lang['mpf_solve_for_flow']='pour débit, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Perte de charge Manning en conduite';
$ec_lang['mphl_main_title']='Calculateur gratuit en ligne de perte de charge Manning en conduite';
$ec_lang['mphl_main_desc']='Formule de Manning — perte de charge pour un débit à section pleine donné';
$ec_lang['mphl_pipe_length']='Longueur de conduite, L';
$ec_lang['mphl_area']='Section, A';
$ec_lang['mphl_total_junction_k']='Coefficient de perte de charge singulière (locale), k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Coefficient de perte, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Coefficient de perte de charge singulière (locale), km. Ces pertes se produisent aux jonctions de conduites, aux entrées, aux sorties, aux coudes et aux vannes — le terme « singulière » est conventionnel mais trompeur ; dans une conduite courte, elles peuvent égaler ou dépasser les pertes par frottement. Valeurs typiques de k : entrée à arête vive 0.5, chaque coude à 45° 0.2–0.3, vanne-guillotine (entièrement ouverte) 0.1, vanne papillon 0.2, sortie (vers un réservoir ou l\'atmosphère) 1.0. Additionnez tous les raccords pour obtenir le km total. La valeur par défaut de 2.0 suppose une entrée, une sortie et deux coudes à 45°.';
$ec_lang['mphl_friction_slope']='Pente de frottement';
$ec_lang['mphl_friction_loss']='Perte de charge par frottement, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Perte de charge singulière (locale), h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Perte de charge totale, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='LHE aval';
$ec_lang['mphl_egl_2']='LHE amont';
$ec_lang['mphl_hgl_egl_tip']='Ce résultat peut ne pas être valide aux endroits où la conduite s\'élève au-dessus de la ligne piézométrique.';
$ec_lang['mphl_note_1']='<dl><dt>Cet outil de calcul ne modélise pas le profil de la conduite entre les deux extrémités.</dt><dd>Si la LHP descend sous le sommet de la conduite en un point quelconque, ce calcul peut ne pas être valide.</dd><dt>Pour une entrée libre (buse), il est nécessaire de vérifier les conditions de contrôle à l\'entrée.</dt><dd>1. La LHP amont doit être supérieure à la cote de profondeur normale amont (et plus haute que la conduite elle-même !).</dd><dd>2. La charge amont d\'une buse est mieux représentée par la LHE amont que par la LHP amont.</dd><dd>3. Voir <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">mon tutoriel de 2 minutes</a> pour les calculs simples et standard de charge amont de buse à l\'aide de <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, le logiciel gratuit de calcul de buses de la Federal Highway Administration (administration fédérale des routes) des États-Unis.</dd><dd>4. Cette page ne résout que le cas du contrôle à la sortie : une conduite en charge sur toute sa longueur, où les conditions aval déterminent la charge. La conception d\'une buse consiste justement à déterminer si c\'est le contrôle à l\'entrée ou à la sortie qui gouverne, donc utilisez HY-8 dès que l\'un des deux cas est possible.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Canal trapézoïdal Manning';
$ec_lang['mtc_main_title']='Calculateur gratuit en ligne de la formule Manning pour canal trapézoïdal';
$ec_lang['mtc_main_desc']='Écoulement uniforme Manning en canal trapézoïdal à pente et profondeur données';
$ec_lang['mtc_bottom_width']='Largeur du fond, b';
$ec_lang['mtc_side_slope_1']='Talus 1, z<sub>1</sub> (horiz./vert.)';
$ec_lang['mtc_side_slope_2']='Talus 2, z<sub>2</sub> (horiz./vert.)';
$ec_lang['mtc_channel_slope']='Pente du canal, S';
$ec_lang['mtc_flow_depth']='Profondeur d\'écoulement, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Angle de courbure, β</a><span class="ec-help" title="Pour le dimensionnement des enrochements. Suivez le lien pour le schéma."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Densité relative à l\'eau. Valeur typique ≈ 2,65 pour la roche concassée.">Densité relative de la roche, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Granulométrie de conception, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n selon la taille des enrochements de calcul (méthode Strickler)';
$ec_lang['mtc_n_blodgett']='n selon la taille des enrochements de calcul (méthode Blodgett)';
$ec_lang['mtc_n_bathurst']='n selon la taille des enrochements de calcul (méthode Bathurst)';
$ec_lang['mtc_n_pi']='n selon la taille des enrochements de calcul (méthode Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett c. Bathurst';
$ec_lang['mtc_pi_range_check']='Vérification de plage P&I';
$ec_lang['mtc_pi_ok']='d50 dans la plage P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Hors plage';
$ec_lang['mtc_pi_tip']='Extrapolation hors de la plage de données (0,28–0,36 ft) à partir de laquelle cette équation a été établie — à considérer comme une vérification approximative, pas comme une base de conception';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Selon Isbash (1936) et le comté de Maricopa, Arizona, États-Unis.">Granulométrie d\'enrochement anguleux requise au fond, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Selon Isbash (1936) et le comté de Maricopa, Arizona, États-Unis.">Granulométrie d\'enrochement anguleux requise sur talus 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Selon Isbash (1936) et le comté de Maricopa, Arizona, États-Unis.">Granulométrie d\'enrochement anguleux requise sur talus 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Résout ce réseau à chaque pas de temps hydraulique.';
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Selon Maynord, Ruff et Abt (1989). Dans une courbe, la roche est dimensionnée pour une vitesse de courbure de 4/3 de la moyenne, selon California Division of Highways (1970) ; le facteur 1,5 propre à Maynord s\'applique aux chenaux naturels.">Granulométrie d\'enrochement anguleux requise, D<sub>50</sub> (Maynord, Ruff et Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Granulométrie d\'enrochement anguleux requise, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Vitesse raisonnable pour les hypothèses d\'écoulement uniforme.';
$ec_lang['mtc_vel_low']='Vitesse faible — risque de sédimentation.';
$ec_lang['mtc_vel_high']='La vitesse est élevée et peut ne pas être réaliste : vérifier l\'érosion du revêtement du canal, le tirant d\'eau supplémentaire dans les coudes et la perte d\'énergie aux élargissements ou obstacles.';
$ec_lang['mtc_iteration_tip']='Choisissez une option de rugosité (Blodgett–Bathurst recommandée) et une option de granulométrie (Isbash recommandée) pour itérer automatiquement vers une granulométrie uniforme adaptée à votre débit cible. Voir les notes ci-dessous pour la méthode complète, ou saisissez votre propre valeur de rugosité (suivez le lien pour des conseils) et ignorez la granulométrie pour éviter l\'itération.';
$ec_lang['mtc_note_1']='<dl><dt>Itération automatique de conception de la taille des enrochements et de la rugosité</dt><dd>Choisissez une option de rugosité (Blodgett–Bathurst recommandée) et une option de taille d\'enrochement de conception (Isbash recommandée). Ajustez la profondeur et le facteur de sécurité sur la taille des enrochements pour atteindre votre débit cible avec une taille d\'enrochement uniforme. À chaque modification d\'une saisie, le calculateur répète ces étapes : 1. La rugosité est calculée à partir de la taille d\'enrochement de conception. 2. La valeur de rugosité issue de la méthode choisie est copiée dans la saisie de rugosité. 3. Le débit du canal et la taille d\'enrochement requise sont calculés. 4. La taille d\'enrochement de conception est ajustée. 5. Répétez jusqu\'à ce que l\'erreur sur la taille d\'enrochement de conception soit très faible.</dd><dt>Calculateur simple (sans itération)</dt><dd>Saisissez la valeur de rugosité souhaitée. Ignorez la zone de saisie de la taille d\'enrochement de conception.</dd></dl>';
$ec_lang['mtc_note_2_term']='Vérification de la vitesse';
$ec_lang['mtc_note_2_def']='Une vitesse élevée implique une chute de niveau importante ayant produit une énergie spécifique élevée. Cette énergie peut être dissipée rapidement aux élargissements, coudes ou obstacles. Vérifiez que cela est raisonnable pour le site.';
$ec_lang['mtc_solver_no_solution']='Aucune solution trouvée pour le Q donné avec ces paramètres de canal.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Déversoir simple';
$ec_lang['ws_main_title']='Calculateur gratuit en ligne de débit sur déversoir simple à seuil large';
$ec_lang['ws_main_desc']='Calculateur de débit sur déversoir simple à seuil large';
$ec_lang['ws_weirLength']='Longueur du déversoir, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Énergie par unité de poids d\'eau — une hauteur de colonne d\'eau, non une pression">Charge, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Coefficient de déversoir, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Remarques';
$ec_lang['ws_notes_we_term']='Équation du déversoir';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Déversoir irrégulier';
$ec_lang['wi_main_title']='Calculateur gratuit en ligne de débit sur déversoir irrégulier segmenté à profondeur variable';
$ec_lang['wi_main_desc']='Calculateur de débit sur déversoir irrégulier';
$ec_lang['wi_weirPoints']='Points du déversoir';
$ec_lang['wi_pondingHeight']='Hauteur de remous';
$ec_lang['wi_incrementalFlow']='Débit élémentaire';
$ec_lang['wi_cumulativeFlow']='Débit cumulé';
$ec_lang['wi_notes_we_def']='q = si (longueur = 0) alors 0 sinon si (pente=0) alors cw*longueur*d<sub>0</sub><sup>1.5</sup> sinon cw/(2.5*pente) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) où d<sub>1</sub> et d<sub>0</sub> sont toujours positifs ou nuls';
// Orifice Flow
$ec_lang['or_main_menu']='Débit par orifice';
$ec_lang['or_main_title']='Calculateur gratuit en ligne de débit par orifice';
$ec_lang['or_main_desc']='Débit par orifice — libre ou noyé';
$ec_lang['or_shape_circular']='Circulaire';
$ec_lang['or_shape_rectangular']='Rectangulaire';
$ec_lang['or_diameter']='<span class="ec-help" title="Diamètre pour une ouverture circulaire ; hauteur pour une ouverture rectangulaire">Diamètre ou hauteur, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Ouvertures rectangulaires uniquement">Largeur, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Bas de l\'ouverture">Cote du radier <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Niveau d\'eau amont';
$ec_lang['or_twe']='Niveau d\'eau aval';
$ec_lang['or_cd']='Coefficient de décharge, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Cote du centroïde';
$ec_lang['or_head']='<span class="ec-help" title="Énergie par unité de poids d\'eau — une hauteur de colonne d\'eau, non une pression">Charge effective, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Aire de l\'ouverture, A';
$ec_lang['or_regime']='Vérification du régime d\'orifice';
$ec_lang['or_regime_valid']='Déversement libre';
$ec_lang['or_regime_submerged']='Orifice noyé';
$ec_lang['or_regime_submerged_tip']='TWE au-dessus du centroïde — régime d\'orifice toujours valide';
$ec_lang['or_regime_warn']='Hors régime d\'orifice';
$ec_lang['or_regime_warn_tip']='Niveau d\'eau amont sous la couronne';
$ec_lang['or_regime_twe_above_hwe']='Vérifier les données';
$ec_lang['or_regime_twe_above_hwe_tip']='Niveau d\'eau aval (TWE) au-dessus du niveau d\'eau amont (HWE)';
$ec_lang['or_notes_1_term']='Équation d\'orifice';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Pour un déversement libre : h = HWE − centroïde. Pour un écoulement noyé (TWE au-dessus du radier) : h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Régime d\'orifice';
$ec_lang['or_notes_2_def']='Les équations de débit par orifice s\'appliquent lorsque la surface d\'eau amont est au-dessus de la couronne (le sommet) de l\'ouverture. Lorsqu\'elle est en dessous de la couronne, utilisez plutôt une équation de déversoir.';
$ec_lang['or_notes_3_term']='Coefficient de décharge';
$ec_lang['or_notes_3_def']='C<sub>d</sub> varie d\'environ 0,60 à 0,65 pour les orifices à arête vive. Les entrées arrondies ou en retrait ont des valeurs différentes. Voir l\'<a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> ou le Manuel de référence hydraulique HEC-RAS pour plus d\'indications.';
$ec_lang['or_notes_4_term']='Submersion';
$ec_lang['or_notes_4_def']='Lorsque le niveau d\'eau aval (TWE) est au-dessus du radier de l\'ouverture, ce calculateur applique automatiquement l\'équation d\'orifice noyé avec h = HWE − TWE. Lorsque TWE est au niveau du radier ou en dessous, un déversement libre est supposé et h = HWE − centroïde.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Micro-Hydroélectricité';
$ec_lang['mhp_main_title']='Calculateur Gratuit de Puissance Micro-Hydroélectrique';
$ec_lang['mhp_main_desc']='Calculateur de Puissance Micro-Hydroélectrique au Fil de l\'Eau';
$ec_lang['mhp_gross_head']='Hauteur brute, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Diamètre de la conduite forcée (conduite d\'alimentation)">Diamètre de la conduite forcée, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Longueur, L';
$ec_lang['mhp_efficiency']='Rendement de l\'installation, η (0–1)';
$ec_lang['mhp_vel_check']='Vérification de la vitesse';
$ec_lang['mhp_hl_check']='Vérification de la perte de charge';
$ec_lang['mhp_hnet']='Hauteur nette, H<sub>net</sub>';
$ec_lang['mhp_power']='Puissance produite, P';
$ec_lang['mhp_annual_kwh']='P en énergie annuelle';
$ec_lang['mhp_vel_low']='Vitesse faible : risque de sédimentation et d\'entraînement d\'air.';
$ec_lang['mhp_vel_high']='Vitesse élevée : vérifier les pertes de transition, l\'énergie disponible et le coup de bélier.';
$ec_lang['mhp_vel_ok_short']='Bien';
$ec_lang['mhp_vel_high_short']='Élevée';
$ec_lang['mhp_vel_low_short']='Faible';
$ec_lang['mhp_vel_ok_tip']='La vitesse se situe dans la plage efficace pour la conception de la conduite forcée.';
$ec_lang['mhp_hl_ok_tip']='La perte de charge est inférieure à 10 % de la charge brute. Ce diamètre de conduite est économique.';
$ec_lang['mhp_hl_warn_tip']='La perte de charge dépasse 10 % de la charge brute. Envisagez une conduite plus grande.';
$ec_lang['mhp_hl_bad_tip']='La perte de charge dépasse 20 % de la charge brute. Redimensionnez la conduite.';
$ec_lang['mhp_notes_1_term']='Perte de charge';
$ec_lang['mhp_notes_1_def']='La perte totale dans la conduite forcée h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, où h<sub>f</sub> = f(L/D)(v²/2g) est la perte par frottement de Darcy-Weisbach et h<sub>m</sub> = k<sub>m</sub>·v²/2g couvre les entrées, coudes et vannes. Hauteur nette H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Vitesse';
$ec_lang['mhp_notes_2_def']='Vérifiez que la vitesse est raisonnable compte tenu de la chute disponible et du coût de la conduite. Une vitesse très faible peut indiquer un surdimensionnement ; une vitesse très élevée peut augmenter les pertes par frottement et le risque de coup de bélier.';
$ec_lang['mhp_notes_3_term']='Objectif de perte de charge';
$ec_lang['mhp_notes_3_def']='Des pertes dans la conduite forcée (conduite d\'amenée) inférieures à 10 % de la hauteur brute sont généralement économiques. Le compromis optimal entre le coût de la conduite et la puissance perdue se situe souvent autour de 4–6 %, là où le prix de l\'électricité est élevé.';
$ec_lang['mhp_notes_6_term']='Rendement';
$ec_lang['mhp_notes_6_def']='Le rendement typique de l\'installation η varie de 0,70 à 0,85 pour les turbines Pelton et à flux croisé courantes en micro-hydroélectricité. Utilisez 0,75 comme première estimation prudente.';
$ec_lang['mhp_notes_7_term']='Énergie annuelle';
$ec_lang['mhp_notes_7_def']='L\'énergie annuelle suppose un fonctionnement continu à débit plein (8760 heures/an). La production réelle sera plus faible en raison de la variation saisonnière du débit, des temps d\'arrêt pour maintenance et du facteur de charge.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Temps de vidange d\'étang et de réservoir';
$ec_lang['odt_main_title']='Calculateur gratuit en ligne du temps de vidange d\'étang, de bassin et de réservoir (orifice)';
$ec_lang['odt_main_desc']='Temps de vidange d\'un étang, bassin ou réservoir — Sortie par orifice, méthode du volume conique';
$ec_lang['odt_h1_elev']='Cote initiale de la surface libre';
$ec_lang['odt_a1']='Superficie initiale, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Cote finale de la surface libre';
$ec_lang['odt_a0']='Superficie à la cote du centroïde, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Interpolée à partir du modèle conique à la cote finale">Superficie finale, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Vérification de la cote finale';
$ec_lang['odt_h2_ok']='Cote finale au-dessus du sommet de l\'orifice';
$ec_lang['odt_h2_warn']='Cote finale au niveau ou en dessous du sommet de l\'orifice';
$ec_lang['odt_h2_warn_tip']='Sommet de l\'orifice = centroïde + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Diamètre (circulaire) ou hauteur (rectangulaire)">Orifice D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Rectangulaire uniquement">Largeur de l\'orifice, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Temps de vidange (s)';
$ec_lang['odt_t_min']='Temps de vidange (min)';
$ec_lang['odt_t_hr']='Temps de vidange (h)';
$ec_lang['odt_t_day']='Temps de vidange (j)';
$ec_lang['odt_notes_1_term']='Formule';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) donne le temps de vidange depuis la charge H jusqu\'à l\'orifice. Temps de vidange = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), où H<sub>1</sub> = cote de départ − cote de l\'orifice, H<sub>2</sub> = cote finale − cote de l\'orifice.';
$ec_lang['odt_notes_2_term']='Méthode';
$ec_lang['odt_notes_2_def']='La méthode du volume conique modélise le bassin ou l\'étang comme une section conique entre la superficie initiale A<sub>1</sub> à la surface libre de départ et la superficie A<sub>0</sub> à la cote du centroïde de l\'orifice. A<sub>2</sub>, la superficie du bassin à la cote finale, est interpolée à partir de A<sub>1</sub> et A<sub>0</sub> selon le modèle conique. Le temps de vidange de la cote de départ à la cote finale est égal au temps de vidange total de H<sub>1</sub> à l\'orifice moins le temps de vidange restant de H<sub>2</sub> à l\'orifice.';
$ec_lang['odt_h1']='<span class="ec-help" title="Cote initiale de la surface libre moins cote du centroïde de l\'orifice">Charge initiale, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Débit max, Q<sub>max</sub>';
$ec_lang['odt_vol']='Volume vidangé';
$ec_lang['odt_sketch_start']='Début';
$ec_lang['odt_sketch_end']='Fin';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Espacement des goutteurs, S<sub>e</sub>';
$ec_lang['ip_sl']='Espacement des rampes, S<sub>l</sub>';
$ec_lang['ip_n_e']='Goutteurs par rampe, n<sub>e</sub>';
$ec_lang['ip_n_l']='Rampes par zone, n<sub>l</sub>';
$ec_lang['ip_d']='Profondeur d\'application cible, d';
$ec_lang['ip_a_e']='Surface par goutteur, A<sub>e</sub>';
$ec_lang['ip_pr']='Taux d\'application, PR';
$ec_lang['ip_q_lat']='Débit par rampe, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Débit de la zone, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Durée (heures)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Infiltration en Canal';
$ec_lang['cs_main_title']='Calculateur gratuit en ligne des pertes par infiltration et du rendement de transport d\'eau en canal';
$ec_lang['cs_main_desc']='Pertes par Infiltration en Canal & Rendement de Transport d\'Eau — Méthode Entrée-Sortie';
$ec_lang['cs_Q_in']='Débit entrant, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Débit sortant, Q<sub>out</sub>';
$ec_lang['cs_L']='Longueur du bief, L';
$ec_lang['cs_Q_loss']='Taux de perte par infiltration, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Vérification de la mesure';
$ec_lang['cs_pct_loss']='Fraction perdue';
$ec_lang['cs_Ec']='Rendement de transport d\'eau, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Classe de rendement';
$ec_lang['cs_Vol_day']='Volume perdu quotidiennement';
$ec_lang['cs_Vol_year']='Volume perdu annuellement';
$ec_lang['cs_Q_loss_per_L']='Perte par unité de longueur, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Valeur de l\'eau';
$ec_lang['cs_lining_cost']='Coût du revêtement';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Objectif de rendement de transport d\'eau après revêtement ; fraction 0–1">Objectif de revêtement, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Surface de revêtement, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Valeur annuelle perdue';
$ec_lang['cs_annual_value_recovered']='Valeur annuelle récupérée';
$ec_lang['cs_lining_total_cost']='Coût total du revêtement';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Récupération simple = coût total du revêtement ÷ valeur annuelle récupérée">Période de récupération <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — infiltration détectée';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — aucune perte mesurable';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — vérifiez les mesures';
$ec_lang['cs_Ec_good']='Bonne — E<sub>c</sub> ≥ 80 %';
$ec_lang['cs_Ec_fair']='Moyenne — E<sub>c</sub> 60–80 %';
$ec_lang['cs_Ec_poor']='Mauvaise — E<sub>c</sub> < 60 %';
$ec_lang['cs_notes_1_def']='La méthode entrée-sortie estime l\'infiltration en mesurant le débit en tête et en queue d\'un bief de canal : Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Rendement de transport d\'eau E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Le volume annuel suppose un fonctionnement continu à plein débit ; la perte réelle est plus faible pour les canaux saisonniers ou à débit partiel.';
$ec_lang['cs_notes_2_term']='Classes de Rendement';
$ec_lang['cs_notes_2_def']='Canaux en terre non revêtus typiques : E<sub>c</sub> = 60–80 %. Canaux en terre bien entretenus : 75–85 %. Canaux en béton : 90–98 %. Des pertes par infiltration supérieures à 30 % du débit entrant justifient souvent un investissement de revêtement. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Délai de Récupération du Revêtement';
$ec_lang['cs_notes_3_def']='Saisissez la valeur de l\'eau et le coût du revêtement dans une devise cohérente quelconque. Surface de revêtement = longueur du bief × périmètre mouillé — le périmètre mouillé de la section transversale du canal à la profondeur d\'écoulement mesurée (largeur du fond plus les deux talus mouillés). La valeur annuelle récupérée suppose que le canal revêtu atteint l\'E<sub>c</sub> cible en continu. Le délai de récupération réel sera plus long pour les canaux saisonniers ou si le revêtement n\'atteint pas le rendement cible.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3e éd. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='À propos';
$ec_lang['install_main_menu']='Installer';
$ec_lang['install_main_title']='Installer EngCalcs';
$ec_lang['install_main_desc']='Ajouter à votre appareil pour une utilisation hors ligne';
$ec_lang['install_intro']='EngCalcs est une application web progressive (PWA). Une fois installée, tous les calculateurs fonctionnent entièrement hors ligne — aucune connexion internet n\'est nécessaire.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Ouvrez une page de calculateur dans Chrome.</li><li>Appuyez sur le bouton <strong>⬇ Installer</strong> dans la barre de navigation en haut, ou appuyez sur le menu du navigateur (⋮) et choisissez <strong>Ajouter à l\'écran d\'accueil</strong>.</li><li>Appuyez sur <strong>Installer</strong> dans la fenêtre qui s\'affiche.</li><li>EngCalcs apparaît sur votre écran d\'accueil et fonctionne hors ligne.</li>';
$ec_lang['install_now_btn']='⬇ Installer maintenant';
$ec_lang['install_prompt_unavailable']='Fenêtre d\'installation indisponible — utilisez plutôt le menu de votre navigateur.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Ouvrez une page de calculateur dans Safari.</li><li>Appuyez sur le bouton <strong>Partager</strong> (carré avec une flèche vers le haut).</li><li>Faites défiler vers le bas et appuyez sur <strong>Sur l\'écran d\'accueil</strong>.</li><li>Appuyez sur <strong>Ajouter</strong>. EngCalcs apparaît sur votre écran d\'accueil.</li>';
$ec_lang['install_ios_note']='Sur iOS, l\'installation passe toujours par le menu Partager — il n\'y a pas de fenêtre d\'installation automatique.';
$ec_lang['install_desktop_heading']='Ordinateur (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Ouvrez une page de calculateur.</li><li>Cliquez sur l\'<strong>icône d\'installation</strong> (⊕ ou icône d\'ordinateur) dans la barre d\'adresse du navigateur, ou ouvrez le menu du navigateur et choisissez <strong>Installer EngCalcs…</strong></li><li>Cliquez sur <strong>Installer</strong>. EngCalcs s\'ouvre dans sa propre fenêtre d\'application.</li>';
$ec_lang['install_firefox_heading']='Firefox / Autres navigateurs';
$ec_lang['install_firefox_body']='Si votre navigateur ne propose pas d\'option d\'installation, rien n\'est perdu : utilisez les calculateurs normalement dans le navigateur, et après votre première visite, les pages sont automatiquement mises en cache pour une utilisation hors ligne. C\'est le cas courant de Firefox sur ordinateur.';
$ec_lang['install_cached_heading']='Ce qui est mis en cache';
$ec_lang['install_cached_body']='La première fois que vous installez EngCalcs, toutes les pages de calculateurs et leurs fichiers associés (scripts, styles) sont enregistrés automatiquement sur votre appareil. Ensuite, tout fonctionne sans connexion internet. Votre choix de langue est mémorisé depuis votre dernière visite en ligne.';
$ec_lang['contact_main_menu']='Contact';
$ec_lang['about_main_title']='À propos des calculateurs HawsEDC';
$ec_lang['about_main_desc']='Mission, logiciel libre et contribution';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Mission</h3><p>Les Calculatrices d\'Ingénierie HawsEDC sont offertes gratuitement en ligne depuis 2010. Elles existent pour servir les ingénieurs et les travailleurs de terrain du monde entier — en particulier ceux qui travaillent dans des régions à faibles ressources en eau, à ressources limitées ou peu desservies. Ces outils font partie d\'une mission humanitaire plus large : dire à chaque être humain, de la manière la plus concrète et la plus efficace possible, <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">qu\'il est aimé et chéri pour toujours, qu\'il n\'a rien à craindre, et qu\'il ne va pas tout gâcher</a>.</p><p>Les calculatrices sont le véhicule. La destination est un monde libéré de la souffrance.</p><h3>Licence libre et open source</h3><p>Tout le code est publié sous la <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">Licence Publique Générale GNU v3.0 ou ultérieure</a> — libre comme dans liberté. Vous pouvez utiliser, étudier, modifier et redistribuer le code selon les mêmes termes.</p><p>Le site qui les héberge est offert gratuitement aujourd\'hui et depuis 2010 ; si un jour il ne peut plus l\'être, le logiciel reste à vous pour l\'exécuter.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Code Source</h3><p>Le code source complet est disponible publiquement sur GitHub :</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Vous pouvez parcourir le code, signaler des problèmes ou créer une bifurcation (fork) du dépôt là-bas.</p><h3>Contribuer</h3><p>Toute aide est la bienvenue. <a href="contact.php">Contactez Tom Haws</a>.</p><ul><li><strong>Traductions :</strong> Proposez une meilleure formulation. Améliorez ou ajoutez une langue.</li><li><strong>Rapports de bogues :</strong> Utilisez le formulaire de commentaires sur n\'importe quelle page de calculatrice, ou signalez un problème sur GitHub.</li><li><strong>Nouvelles calculatrices :</strong> Les idées d\'outils de génie hydraulique au service des travailleurs de terrain et des praticiens de l\'irrigation sont particulièrement bienvenues.</li><li><strong>Hébergement :</strong> Si vous pouvez héberger une copie miroir de ces calculatrices pour une région à connectivité limitée, veuillez me contacter.</li></ul><h3>Utilisation hors ligne</h3><p>Ouvrez n\'importe quelle calculatrice une fois en étant connecté, et toutes continuent de fonctionner quand vous ne l\'êtes pas : votre navigateur stocke toute la suite au fur et à mesure. Le mécanisme est une <strong>Application Web Progressive (PWA)</strong>, si vous voulez en savoir plus. Ensuite, toutes les calculatrices fonctionnent hors ligne — sans connexion internet requise.</p><p>Sur Android ou iOS, utilisez l\'option « Ajouter à l\'écran d\'accueil » de votre navigateur pour installer EngCalcs comme application sur votre appareil. Sur ordinateur, recherchez l\'icône d\'installation dans la barre d\'adresse de votre navigateur.</p><p>Vous pouvez également enregistrer n\'importe quelle calculatrice individuelle grâce au menu « Enregistrer sous… » de votre navigateur, pour une utilisation hors ligne ponctuelle.</p><h3>Contact</h3><p>Tom Haws, ingénieur hydraulique et fondateur de ces calculatrices.<br />Utilisez le formulaire de commentaires sur n\'importe quelle page de calculatrice, ou accédez au code source sur <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Envoyer un message à Tom Haws';
$ec_lang['contactYourName']='Votre nom:';
$ec_lang['contactYourEmail']='Votre adresse e-mail:';
$ec_lang['contactSubject']='Sujet:';
$ec_lang['contact_message']='Message :';
$ec_lang['contactSpamPrefix']='Cinq plus un égale';
$ec_lang['contactSpamPostfix']='(Veuillez l\'écrire en lettres. 1=un 2=deux 3=trois 4=quatre 5=cinq 6=six 7=sept +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Envoyer le message';
$ec_lang['contact_success']='Merci d\'avoir pris le temps d\'écrire.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Conception de Coursier en Enrochement (Robinson)';
$ec_lang['rc_main_title']='Calculateur Gratuit de Conception de Coursier en Enrochement — Robinson (1998)';
$ec_lang['rc_main_desc']='Dimensionnement de l\'Enrochement du Coursier — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Pente du radier du coursier, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Débit par unité de largeur à l\'entrée du coursier. Pour un canal de largeur de fond B avec débit total Q, utiliser q_t = Q / B.">Débit unitaire total, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Porosité de l\'enrochement, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Densité relative à l\'eau. Granit concassé ou basalte typique ≈ 2,65. Plage valide de Robinson : 2,54 à 2,82.">Densité relative du matériau, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Écart-type granulométrique. Enrochement uniforme ≈ 1,25. Plage valide Robinson : 1,15 à 1,47.">Granulométrie SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="La mise en charge (Hp > yn) est favorable — réduit l\'érosion en amont. (USDA)">Tirant d\'eau normal dans le canal amont, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Éq. 1 (S0 < 0,10) ou Éq. 2 (0,10–0,40). Valide : D50 15–278 mm, S0 0,02–0,40. Hors plage : extrapolé.">Taille médiane requise des blocs, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Équation appliquée';
$ec_lang['rc_sg_check']='Vérification de la densité relative';
$ec_lang['rc_SD_check']='Vérification de la granulométrie SD';
$ec_lang['rc_sg_ok']   ='sg dans la plage valide';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg inférieur à la plage Robinson';
$ec_lang['rc_sg_low_tip']='Plage valide : 2,54–2,82';
$ec_lang['rc_sg_high'] ='sg supérieur à la plage Robinson';
$ec_lang['rc_sg_high_tip']='Plage valide : 2,54–2,82';
$ec_lang['rc_SD_ok']   ='SD dans la plage valide';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD inférieur à la plage Robinson';
$ec_lang['rc_SD_low_tip']='Plage valide : 1,15–1,47';
$ec_lang['rc_SD_high'] ='SD supérieur à la plage Robinson';
$ec_lang['rc_SD_high_tip']='Plage valide : 1,15–1,47';
$ec_lang['rc_layer']='Épaisseur de la couche de blocs (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Rayon de courbure en crête (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Longueur d\'arc en crête';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Requis pour le support structurel de l\'enrochement du coursier. « La hauteur d\'eau minimale à l\'aval résultant du tronçon de sortie et de la résistance du canal aval est suffisante pour assurer la stabilité de l\'enrochement dans le tronçon de sortie. » (Robinson)">Longueur du radier de sortie (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Rugosité de Manning dans le coursier, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Fraction de qt s\'écoulant à travers les pores des blocs. Le reste qs s\'écoule en surface. np par défaut = 0,45 pour roche concassée anguleuse.">Vitesse à travers le manteau rocheux, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Débit unitaire dans le manteau, q<sub>m</sub>';
$ec_lang['rc_qs']='Débit unitaire de surface, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Profondeur d\'écoulement au-dessus de la surface d\'enrochement, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="La mise en charge (Hp > yn) est favorable — réduit l\'érosion en amont. (USDA)">Charge au déversoir d\'entrée, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Vérification de la mise en charge à l\'entrée';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — mise en charge en amont';
$ec_lang['rc_pond_ok_tip']='La mise en charge en amont de l\'entrée du coursier est favorable ; elle réduit l\'érosion en amont. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — pas de mise en charge — risque d\'érosion à l\'entrée';
$ec_lang['rc_pond_warn_tip']='Pas de mise en charge en amont de l\'entrée du coursier ; une érosion pourrait se produire en amont. (USDA)';
$ec_lang['rc_eq1']='Éq. 1 (S<sub>0</sub> < 0,10) — pente douce';
$ec_lang['rc_eq2']='Éq. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — pente forte';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — en dessous de la plage de validation Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — au-dessus de la plage de validation Robinson';
$ec_lang['rc_notes_1_term']='Équations de dimensionnement des blocs';
$ec_lang['rc_notes_1_def']='Robinson, Rice et Kadavy (1998) ont développé deux équations empiriques pour la taille médiane d\'enrochement D<sub>50</sub> à partir de la pente du canal et du débit unitaire. L\'équation 1 s\'applique aux pentes douces (S<sub>0</sub> < 0,10) ; l\'équation 2 s\'applique aux pentes fortes (0,10 ≤ S<sub>0</sub> ≤ 0,40). Les deux équations exigent q<sub>t</sub> en m²/s et renvoient D<sub>50</sub> en mm. La plage validée est 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Débit unitaire';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> est le débit unitaire total à la crête du coursier (débit total par unité de largeur). Pour un canal de largeur de fond B transportant un débit total Q, q<sub>t</sub> ≈ Q / B, ou calculé à partir de la condition de tirant critique à l\'entrée du coursier.';
$ec_lang['rc_notes_3_term']='Écoulement à travers le manteau rocheux';
$ec_lang['rc_notes_3_def']='Une fraction du débit total s\'écoule à travers les pores de l\'enrochement (débit de manteau q<sub>m</sub>) ; le reste s\'écoule en surface (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). La profondeur d\'écoulement d est calculée par l\'équation de Manning appliquée au débit de surface q<sub>s</sub> avec la rugosité n du coursier. La porosité par défaut n<sub>p</sub> = 0,45 est typique pour la roche concassée anguleuse.';
$ec_lang['rc_notes_5_term']='Plage valide de taille de blocs';
$ec_lang['rc_notes_5_def']='Les équations ont été développées pour une plage D<sub>50</sub> de 15 mm à 278 mm. Les résultats hors de cette plage sont extrapolés et doivent être utilisés avec un jugement d\'ingénierie complémentaire.';
$ec_lang['rc_notes_6_term']='Cote du radier de sortie';
$ec_lang['rc_notes_6_def']='La cote du dessus de l\'enrochement dans le tronçon de sortie doit être égale ou inférieure à la cote du fond du canal aval. Si elle est plus haute, l\'enrochement de sortie sera instable.';
$ec_lang['rc_notes_7_term']='Mise en charge à l\'entrée';
$ec_lang['rc_notes_7_def']='Lorsque le tirant d\'eau normal dans le canal d\'entrée est inférieur à la charge de déversoir (H<sub>p</sub>) nécessaire pour transiter q<sub>t</sub>, un écoulement limité ou une mise en charge se produit en amont de l\'entrée du coursier. Ceci est généralement acceptable — la mise en charge réduit la vitesse et prévient l\'érosion en amont. Pour vérifier : utiliser un calculateur d\'écoulement de déversoir pour trouver H<sub>p</sub> pour le q<sub>t</sub> et la largeur de crête donnés, puis comparer au tirant d\'eau normal du canal d\'entrée. Si H<sub>p</sub> dépasse le tirant d\'eau normal, une mise en charge se produira.';
$ec_lang['rc_notes_4_term']='Référence';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., et Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. L\'USDA ARS publie également un <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">tableur Excel</a> basé sur la même méthode.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Filtre';
$ec_lang['rc_sketch_top_crest_curve'] = 'Courbe de crête';
$ec_lang['rc_sketch_outlet_apron']    = 'Radier de sortie';
$ec_lang['rc_sketch_radius']          = 'rayon';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Pression d\'Irrigation';
$ec_lang['ip_main_title']='Calculateur gratuit en ligne de pression d\'irrigation et d\'uniformité de distribution';
$ec_lang['ip_main_desc']='Pression de la branche de test et estimation de l\'uniformité';
$ec_lang['ip_h_supply']='Pression d\'alimentation';
$ec_lang['ip_elev_supply']='Cote d\'alimentation, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Débit de conception du goutteur, q<sub>design</sub>';
$ec_lang['ip_h_design']='Pression de conception du goutteur';
$ec_lang['ip_x']='<span class="ec-help" title="0,5 pour les goutteurs non compensés standards ; proche de 0 pour les goutteurs autorégulés (compensés en pression)">Exposant de débit du goutteur, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Cheminement de test';
$ec_lang['ip_group_reach']='Tronçon';
$ec_lang['ip_group_upstream']='Amont';
$ec_lang['ip_group_downstream']='Aval';
$ec_lang['ip_group_loss']='Perte';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Coché : ce tronçon est un segment de la rampe testée, dont les goutteurs individuels prélèvent l\'eau. Non coché : ce tronçon est une conduite principale, qui ne fait que transmettre le débit vers des rampes ne faisant pas partie du cheminement testé.">Lat. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Rangées de rampe : goutteurs présents dans ce tronçon uniquement. Rangées de conduite principale : nombre total de goutteurs sur les rampes AUTRES que celle testée qui se raccordent à ce tronçon. Pour le tronçon de la conduite principale qui aboutit à la rampe testée, ceci inclut aussi toute rampe située plus loin le long de la conduite principale au-delà de ce point, ou partageant le même embranchement (par exemple une rampe du côté opposé) — leur débit se sépare aussi à partir de ce même tronçon.">Goutteurs <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Cote de l\'extrémité aval de ce tronçon. Optionnelle sur les rangées intérieures (par défaut plane / identique au nœud ci-dessus si laissée vide). Obligatoire sur la dernière rangée : cette valeur est la cote du dernier goutteur, qui détermine directement la pression d\'alimentation requise.">Cote av. <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='La cote du dernier goutteur (dernière rangée) a été laissée vide et définie par défaut à plane — saisissez-la pour un résultat précis';
$ec_lang['ip_press']='Press.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Perte totale du tronçon, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Pression faible ou négative — vérifiez les conditions sous-atmosphériques';
$ec_lang['ip_pressure_warn_short']='Faible';
$ec_lang['ip_pressure_high']='Pression élevée — nécessite une réduction de pression';
$ec_lang['ip_pressure_high_short']='Élevée';
$ec_lang['ip_max_head']='Pression adm. max. conduite';
$ec_lang['ip_max_head_tip']='Les tronçons dont la pression dépasse cette valeur sont signalés. Laisser vide pour ignorer le contrôle de pression élevée.';
$ec_lang['ip_h_far']='Pression du dernier goutteur';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Débit entrant uniquement dans le cheminement de test modélisé — pour l\'ensemble de la zone/du système, voir Q_zone dans Conception d\'Application ci-dessous.">Débit d\'alimentation du cheminement de test, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Débit du dernier goutteur, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Débit moyen des goutteurs (rampe testée), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="De combien une rampe typique fonctionne-t-elle à une pression plus haute (ou plus basse) que cette rampe testée, selon votre estimation. La rampe testée est délibérément le cas le plus défavorable présumé, donc sa propre moyenne sous-estime la moyenne réelle du champ — laissé à 0, le contrôle d\'uniformité et les valeurs de conception d\'application ci-dessous utilisent telle quelle la moyenne (probablement optimiste) de la rampe testée elle-même.">Est. Δpression, moy. vs. rampe testée <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral réévalué à la pression de chaque rangée de rampe, plus la différence de pression saisie ci-dessus — une tentative de correction du fait que la rampe testée est le cas le plus défavorable présumé, et non un cas représentatif. Alimente à la fois le contrôle d\'uniformité et la section de conception d\'application ci-dessous.">Est. débit moyen des goutteurs sur le terrain, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Débit calculé du dernier goutteur divisé par le débit moyen estimé des goutteurs sur le terrain — ceci est une approximation de l\'uniformité de distribution du quart inférieur standard (moyenne du quart inférieur ÷ moyenne de la population) ; il s\'agit ici d\'un petit échantillon modélisé et d\'une correction estimée par l\'utilisateur, et non d\'un échantillon statistique complet sur le terrain. Des valeurs égales ou supérieures à 1 sont possibles et valides : elles signifient seulement que la pression du dernier goutteur est égale ou supérieure à la moyenne estimée du terrain, donc qu\'un autre goutteur est le point de pression la plus basse. Cela peut être dû au fait que le dernier goutteur se trouve en terrain bas, ou que l\'estimation de Δpression est trop faible.">Contrôle d\'uniformité, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='La pression au goutteur testé est supérieure ou égale à la pression d\'alimentation. Il ne s\'agit probablement pas du goutteur le plus défavorable, ou les conduites pourraient être réduites.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Ceci diffère de notre approximation de la mesure d\'uniformité standard.">Débit du dernier goutteur ÷ débit de conception, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Pas de solution : la pression d\'alimentation requise dépasse la pression d\'alimentation saisie. Augmentez la pression d\'alimentation, réduisez la demande, ou utilisez une conduite plus grande.';
$ec_lang['ip_notes_1_def']='Estime la pression au dernier (le plus éloigné) goutteur, puis remonte la ligne d\'énergie vers l\'alimentation, tronçon par tronçon, en ajoutant en chemin les pertes par frottement et les pertes de charge singulières. L\'élévation et la charge de vitesse sont soustraites à chaque nœud pour obtenir la pression réelle à cet endroit. La pression estimée à l\'extrémité éloignée est ajustée (par bissection) jusqu\'à ce que la pression d\'alimentation requise calculée corresponde à la pression d\'alimentation saisie — le même problème en boucle fermée que résout le solveur d\'écoulement en conduite du calculateur Manning Pipe Flow, étendu ici à un réseau ramifié.';
$ec_lang['ip_notes_2_term']='Tronçons de Conduite Principale et de Rampe';
$ec_lang['ip_notes_2_def']='Chaque rangée représente un tronçon le long de l\'unique cheminement hydrauliquement le plus défavorable (le cheminement de test), de l\'alimentation jusqu\'au dernier goutteur. Un tronçon de conduite principale ne fait que transmettre le débit vers des rampes ne faisant pas partie du cheminement testé, donc son prélèvement est une simple multiplication (débit de conception × nombre total de goutteurs du tronçon) — sans sensibilité à la pression locale. La conduite principale étant un tronc commun, le tronçon de la conduite principale qui aboutit à la rampe testée doit inclure non seulement les rampes situées entre ses propres extrémités, mais aussi toute rampe plus en aval sur la conduite principale au-delà de ce point, ou partageant le même embranchement (par exemple une rampe du côté opposé) — leur débit traverse ce même tronçon avant de s\'en séparer, qu\'elles apparaissent ou non ailleurs dans ce tableau. Un tronçon de rampe est un segment de la rampe testée elle-même : le débit du goutteur est calculé à partir de la pression locale réelle via q = k·H<sup>x</sup>, et la perte par frottement est réduite par le facteur F(n) de Christiansen pour tenir compte de la diminution du débit à mesure que chaque goutteur du tronçon prélève de l\'eau.';
$ec_lang['ip_notes_3_term']='Limites';
$ec_lang['ip_notes_3_def']='Modélise une seule pression d\'alimentation fixe (pas de courbe de pompe), un seul cheminement de test (pas le champ entier), et une courbe de goutteur à 2 paramètres (réglez l\'exposant près de 0 pour approximer un goutteur autorégulé). Deux ratios d\'uniformité distincts sont rapportés, délibérément séparés : q<sub>last</sub>/q<sub>avg,field</sub> est une approximation de l\'uniformité de distribution du quart inférieur standard (moyenne du quart inférieur ÷ moyenne de la population) ; mais elle provient d\'un petit échantillon modélisé et d\'une correction estimée par l\'utilisateur, et non de l\'échantillon statistique complet sur le terrain habituel. De plus, la rampe testée est délibérément le cas le plus défavorable présumé, de sorte que sa moyenne brute, non corrigée, sous-estimerait la véritable moyenne du terrain et ferait paraître l\'uniformité meilleure qu\'elle ne l\'est ; la saisie de Δpression existe précisément pour corriger ce biais. Des valeurs d\'uniformité égales ou supérieures à 1 restent possibles : elles signifient seulement que la pression du dernier goutteur est égale ou supérieure à la moyenne estimée du terrain, donc qu\'un autre goutteur est le point de pression la plus basse. Cela peut être dû au fait que le dernier goutteur se trouve en terrain bas, ou que l\'estimation de Δpression est trop faible. q<sub>last</sub>/q<sub>design</sub> est un contrôle différent, indépendant de l\'uniformité, comparé au débit nominal du fabricant — utile pour détecter un système globalement sur- ou sous-pressurisé, mais c\'est un contrôle distinct à lire à côté du chiffre d\'uniformité, puisque le débit de conception/nominal est indépendant de la pression moyenne de fonctionnement réelle du système.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. Les normes ASAE/ASABE pour la conception de la micro-irrigation utilisent la même approche de perte de charge par frottement à sorties multiples.';
$ec_lang['ip_notes_5_term']='Conception d\'Application';
$ec_lang['ip_notes_5_def']='Le taux d\'application et le débit du système/de la zone utilisent le débit moyen estimé des goutteurs sur le terrain (q<sub>avg,field</sub> — la moyenne propre de la rampe testée, corrigée par l\'estimation de Δpression saisie), et non un taux deviné : PR = q<sub>avg,field</sub> / A<sub>e</sub>, alimenté par la valeur modélisée corrigée. L\'espacement et le nombre de rampes/goutteurs à l\'échelle du système sont des entrées séparées ici, car le cheminement de test ne modélise qu\'une seule branche dans le cas le plus défavorable, et non chaque rampe du champ.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Réseau de conduites ramifié';
$ec_lang['bpn_main_title']='Calculateur en ligne gratuit de pression pour réseau de conduites ramifié (sans boucles)';
$ec_lang['bpn_main_desc']='Débit et pression d\'un réseau de conduites ramifié (arborescent)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Charge statique d\'alimentation : la charge à la source à débit nul. Le niveau d\'eau d\'un réservoir ou d\'une bâche au-dessus de la cote d\'alimentation, ou la hauteur d\'arrêt (à débit nul) d\'une pompe. Ajoutez les points d\'alimentation 2 et 3 pour définir une courbe de pompe ou d\'alimentation variable ; l\'outil lit la charge au débit de dimensionnement.';
$ec_lang['bpn_elev_source']='Cote d\'alimentation';
$ec_lang['bpn_q_total']='Débit total';
$ec_lang['bpn_q_total_tip']='Débit total sortant de la source (somme de toutes les demandes du réseau).';
$ec_lang['bpn_p_min']='Pression la plus basse';
$ec_lang['bpn_p_min_tip']='La pression aval la plus basse dans tout le réseau ; le point de livraison critique.';
$ec_lang['bpn_method']='Méthode de frottement';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Tronçons de conduite';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Nom de ce tronçon de conduite. Les autres tronçons s\'y réfèrent dans la colonne Amont.';
$ec_lang['bpn_upstream']='ID amont';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID du tronçon qui alimente celui-ci. Laisser vide pour suivre le tronçon situé juste au-dessus (une simple conduite en série). Saisir un ID ici pour se brancher sur un autre tronçon.';
$ec_lang['bpn_roughness_tip']='Rugosité de la conduite pour la méthode de frottement sélectionnée : n de Manning, C de Hazen-Williams, ou hauteur de rugosité e de Darcy-Weisbach (une longueur). Conduite plastique lisse typique : n environ 0,009, C environ 150, e environ 0,0015 mm.';
$ec_lang['bpn_demand']='Demande';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Débit fixe livré à l\'extrémité aval de ce tronçon.';
$ec_lang['bpn_demand_mult']='Multiplicateur de demande';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Multiplie simultanément toutes les demandes des tronçons, pour un calcul en heure de pointe ou de croissance future. Utiliser 1 pour les demandes telles que saisies.';
$ec_lang['bpn_elev_down']='Cote av.';
$ec_lang['bpn_q_line']='Débit du tronçon';
$ec_lang['bpn_q_line_tip']='Débit total transporté par ce tronçon : sa propre demande plus toutes les demandes aval qu\'il alimente.';
$ec_lang['bpn_p_down']='Press. av.';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Charge de pression relative au nœud aval de ce tronçon. Une valeur négative (signalée) indique une pression subatmosphérique ; vérifier la conception.';
$ec_lang['bpn_sketch_heading']='Schéma du réseau';
$ec_lang['bpn_source_label']='Source';
$ec_lang['bpn_line_problem']='Ce tronçon n\'est pas connecté à la source : il pointe vers un ID amont inconnu, se réfère à lui-même, reprend un ID déjà utilisé par un autre tronçon, ou forme une boucle. Les tronçons non connectés ne sont pas résolus.';
$ec_lang['bpn_bad_id_short']='ID incorrect';
$ec_lang['bpn_not_connected_short']='Non connecté';
$ec_lang['bpn_dup_id_short']='ID en double';
$ec_lang['bpn_pressure_warn']='Pression basse/négative ; vérifier les conditions subatmosphériques';
$ec_lang['bpn_pressure_warn_short']='Basse';
$ec_lang['bpn_notes_1_term']='Série par défaut, ramification par exception';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Laissez l\'ID amont vide et un tronçon suit celui du dessus ; une simple conduite en série. Saisissez l\'ID d\'un tronçon amont pour s\'y brancher. Ainsi : série par défaut, arborescence quand vous en avez besoin.';
$ec_lang['bpn_notes_2_term']='Réseaux ramifiés uniquement, sans boucles';
$ec_lang['bpn_notes_2_def']='Chaque tronçon a exactement un tronçon amont (une arborescence). Cet outil ne résout pas les réseaux maillés (bouclés) ; ceux-ci nécessitent des méthodes itératives (EPANET ou similaire). C\'est en excluant les boucles que l\'outil reste simple et exact.';
$ec_lang['bpn_notes_3_term']='Pas de régulation active de pression';
$ec_lang['bpn_notes_3_def']='Vous pouvez ajouter une vanne à perte de charge singulière fixe (une valeur k), mais pas de vannes réductrices ou stabilisatrices de pression (PRV/PSV). Leur état ouvert/fermé dépend du débit et de la pression, ce qui imposerait des itérations.';
$ec_lang['bpn_notes_epanet_term']='Les constantes de Hazen-Williams correspondent maintenant à EPANET (août 2026)';
$ec_lang['bpn_notes_epanet_def']='En août 2026, le coefficient et l\'exposant de Hazen-Williams ont été modifiés pour correspondre à EPANET. Les résultats de perte de charge diffèrent de ceux des versions précédentes de cette page de 0,1 pour cent au maximum, bien moins que l\'incertitude sur la valeur de C elle-même.';
$ec_lang['bpn_supply2_q']='Débit d\'alimentation 2';
$ec_lang['bpn_supply2_h']='Charge d\'alimentation 2';
$ec_lang['bpn_supply3_q']='Débit d\'alimentation 3';
$ec_lang['bpn_supply3_h']='Charge d\'alimentation 3';
$ec_lang['bpn_supply_pt_tip']='Points optionnels 2 et 3 de la courbe d\'alimentation. Saisissez un débit et une charge pour chacun afin de modéliser une pompe, ou toute source dont la charge diminue à mesure qu\'elle délivre davantage ; l\'outil lit la charge au débit de dimensionnement. Le point 1 ci-dessus est la charge statique à débit nul. Laissez 2 et 3 vides pour une charge de réservoir constante.';
$ec_lang['bpn_h_supply']='Charge d\'alimentation';
$ec_lang['bpn_h_supply_tip']='Charge à la source au débit de dimensionnement, lue sur la courbe d\'alimentation. Égale la charge à la source saisie lorsque la courbe est plate (un réservoir).';
$ec_lang['bpn_supply1_h']='Charge statique d\'alimentation';
$ec_lang['lpn_main_menu']='Réseau d\'eau potable';
$ec_lang['lpn_main_title']='Modélisation gratuite en ligne de réseau de distribution d\'eau avec le solveur EPANET';
$ec_lang['lpn_main_desc']='Analyse de réseau de distribution d\'eau : dessinez un réseau maillé ou importez des fichiers EPANET';
$ec_lang['lpn_title_units']='Unités {units}';
$ec_lang['lpn_tool_select']='Sélectionner';
$ec_lang['lpn_tool_add_junction']='Jonction';
$ec_lang['lpn_tool_add_reservoir']='Réservoir';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Bâche';
$ec_lang['lpn_tool_add_pipe']='Conduite';
$ec_lang['lpn_tool_add_pump']='Pompe';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Vanne';
$ec_lang['lpn_tool_add_text']='Texte';
$ec_lang['lpn_tool_vertices']='Sommets';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Client';
$ec_lang['lpn_tool_add_meter_tip']='Cliquez à l\'emplacement du client, puis cliquez sur la conduite ou le nœud qui le dessert. La demande que vous donnez au client est ajoutée à la jonction à l\'extrémité proche de cette conduite.';
$ec_lang['lpn_mode_add_meter']='Client : cliquez à l\'emplacement du client, puis cliquez sur la conduite ou le nœud qui le dessert. Ou utilisez Esc pour annuler.';
$ec_lang['lpn_pane_tab_customers']='Clients';
$ec_lang['lpn_customer_heading']='Client {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Demande par branchement';
$ec_lang['lpn_field_meter_count']='Nombre de branchements';
$ec_lang['lpn_field_meter_total']='Demande totale';
$ec_lang['lpn_field_meter_total_tip']='La demande par branchement multipliée par le nombre de branchements. C\'est ce nombre qui est ajouté à la jonction nommée ci-dessous.';
$ec_lang['lpn_field_meter_pipe']='Élément connecté';
$ec_lang['lpn_field_meter_pipe_suggest']='L\'élément le plus proche est {id}. Saisissez-le ici pour desservir ce client depuis celui-ci.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Connecté à';
$ec_lang['lpn_field_meter_node_tip']='La jonction à laquelle ce client est connecté. Faites glisser le point de raccordement sur une conduite pour le desservir plutôt depuis une station le long de cette conduite.';
$ec_lang['lpn_meter_pipe_unknown']='Rien dans ce projet ne s\'appelle {id}, le client a donc été laissé où il était.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='Aucune courbe de modulation de ce projet ne s\'appelle {id}, le client a donc été laissé tel qu\'il était.';
$ec_lang['lpn_meter_placed']='Client {id} ajouté. Sa description et sa demande se saisissent dans le tableau Clients, ou appuyez dessus en mode Sélectionner pour ouvrir sa boîte de propriétés.';
$ec_lang['lpn_field_meter_pipe_tip']='L\'élément auquel ce branchement se connecte. Saisissez-en un autre ici ou dans le tableau Clients pour le modifier, ou faites glisser le point de raccordement vers un autre élément.';
$ec_lang['lpn_field_meter_station']='Station le long de la conduite (%)';
$ec_lang['lpn_field_meter_station_tip']='À quelle distance le long de la conduite le branchement se raccorde, en pourcentage de la conduite entre son premier nœud et son second. 0 est à une extrémité et 100 à l\'autre. Le cercle sur la conduite fait la même chose avec le pointeur.';
$ec_lang['lpn_field_meter_offset']='Décalage par rapport à la conduite';
$ec_lang['lpn_field_meter_offset_tip']='Positif est à droite de la conduite en regardant depuis son premier nœud vers son second. Saisir une valeur ici peut déplacer le client de l\'autre côté de la conduite principale, et cela met toujours la ligne de branchement à angle droit avec la conduite principale.';
$ec_lang['lpn_field_meter_lumped']='Ajoutée au nœud';
$ec_lang['lpn_field_meter_lumped_tip']='Nœud le plus proche ; les demandes de ce client y sont ajoutées.';
$ec_lang['lpn_node_customers']='Demandes des clients';
$ec_lang['lpn_node_customers_tip']='Liste des clients ajoutés à ce nœud (parce que c\'était le plus proche). Les demandes des clients s\'ajoutent aux autres demandes indiquées ici. Un client se modifie à l\'endroit où il se trouve sur la carte ou dans le tableau Clients.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} provenant de {n} clients';
$ec_lang['lpn_customer_detached']='⚠ Ce client n\'est connecté à aucune conduite, sa demande n\'est donc pas dans les résultats. Supprimez-le, ou dessinez une conduite et déplacez le client dessus.';
$ec_lang['lpn_customer_fixed_head']='⚠ L\'extrémité proche de cette conduite se trouve à une surface d\'eau fixe, cette demande n\'affecte donc pas la simulation.';
$ec_lang['lpn_customer_detached_count']='{n} clients ne sont connectés à aucune conduite. Leur demande n\'est pas prise en compte.';
$ec_lang['lpn_meter_pick_pipe']='Cliquez maintenant sur la conduite ou le nœud qui dessert ce client. Le client reste où vous l\'avez placé. Appuyez sur Esc pour annuler.';
$ec_lang['lpn_inp_export_flat_customers']='Un fichier EPANET ne contient pas de clients. La demande des {n} clients de ce projet est inscrite dans le fichier comme une ligne de demande sur la jonction à laquelle chacun est ajouté, et chaque ligne est nommée avec la balise du client. Ce que le fichier ne peut pas conserver, c\'est le client lui-même : où il se trouve, quelle conduite le dessert, à quel endroit de cette conduite le branchement se raccorde, et combien de branchements ce client représente. Votre propre fichier de projet conserve tout cela.';

$ec_lang['lpn_area_hint_window_start']='Cliquez sur un coin de la fenêtre.';
$ec_lang['lpn_area_hint_window_go']='Cliquez sur le coin opposé pour terminer.';
$ec_lang['lpn_area_hint_lasso_start']='Cliquez pour commencer le contour.';
$ec_lang['lpn_area_hint_lasso_go']='Déplacez pour dessiner le contour. Cliquez pour terminer.';
$ec_lang['lpn_area_hint_polygon_start']='Cliquez pour dessiner la zone du polygone. Double-cliquez pour terminer.';
$ec_lang['lpn_area_hint_polygon_go']='Cliquez sur chaque coin. Double-cliquez sur le dernier pour terminer.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Maintenez Maj enfoncée pendant la sélection pour continuer avec la sélection existante, en ajoutant ou en retirant (bascule) ce que vous sélectionnez.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Appuyez sur la carte et faites glisser autour de ce que vous voulez, puis relâchez.';
$ec_lang['lpn_area_hint_touch_go']='Faites glisser autour de ce que vous voulez, puis relâchez pour terminer.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Afficher ceci';
$ec_lang['lpn_multi_title']='{n} sélectionnés';
$ec_lang['lpn_multi_varies']='Variable';
$ec_lang['lpn_multi_applied']='{prop} défini sur {n}.';
$ec_lang['lpn_multi_no_fields']='Ces éléments n\'ont rien qui puisse être défini ensemble ici.';
$ec_lang['lpn_pane_pasted']='{n} cellules collées. {skipped} n\'ont pas été modifiées.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Collé {n} lignes, dont {created} ont été ajoutées au réseau.';
$ec_lang['lpn_pane_pasted_rows_skipped']='Collé {n} lignes, dont {created} ont été ajoutées au réseau. {skipped} cellules n\'ont pas été modifiées.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Cliquez ici et collez des lignes depuis un tableur pour les ajouter.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Coller comme nouvelles lignes à la fin du tableau';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Appuyez sur Ctrl+V pour ajouter les lignes copiées au bas de ce tableau. Appuyez sur Esc pour annuler.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Ce collage contient {n} lignes, dont {fit} tiennent dans le tableau. Ajouter les {extra} autres comme nouvelles lignes au bas du tableau ?';
$ec_lang['lpn_pane_paste_overflow_add']='Ajouter {extra} lignes';
$ec_lang['lpn_pane_paste_overflow_fit']='Coller seulement les {fit} qui tiennent';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Ce collage contient {n} lignes, dont {fit} tiennent dans le tableau. Les {extra} autres ne peuvent pas être ajoutées comme nouvelles lignes : {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} identifiants ne correspondent pas. Coller quand même ?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Rien n\'a été collé. {reasons}';
$ec_lang['lpn_pane_paste_more']='Lignes posant problème non affichées ici : {n}.';
$ec_lang['lpn_pane_paste_no_id']='Ligne {row} : une nouvelle ligne a besoin d\'un identifiant.';
$ec_lang['lpn_pane_paste_bad_id']='Ligne {row} : l\'identifiant {id} contient une espace ou un guillemet.';
$ec_lang['lpn_pane_paste_id_taken']='Ligne {row} : l\'identifiant {id} est déjà utilisé.';
$ec_lang['lpn_pane_paste_id_twice']='Ligne {row} : l\'identifiant {id} est utilisé deux fois dans ce collage.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Ligne {row} : un nouveau nœud a besoin à la fois de {first} et de {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Ligne {row} : une nouvelle liaison a besoin d\'un nœud De et d\'un nœud À.';
$ec_lang['lpn_pane_paste_no_node']='Ligne {row} : le nœud {id} n\'existe pas encore. Collez d\'abord vos nœuds, puis vos liaisons.';
$ec_lang['lpn_pane_paste_same_ends']='Ligne {row} : De et À désignent le même nœud.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Ligne {row} : {text} n\'est pas une valeur valide pour {col}.';
$ec_lang['lpn_pane_paste_text_no_position']='Ligne {row} : un nouveau texte a besoin à la fois de {first} et de {second}.';
$ec_lang['lpn_pane_paste_no_anchor']='Ligne {row} : {id} n\'est encore ni un nœud ni une conduite de ce réseau. Collez-le d\'abord, puis ce texte.';
$ec_lang['lpn_pane_paste_customer_no_position']='Ligne {row} : un nouveau client a besoin à la fois de {first} et de {second}.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Ligne {row} : un nouveau client a besoin d\'une conduite ou d\'un nœud connecté.';
$ec_lang['lpn_pane_paste_no_pipe']='Ligne {row} : la conduite {id} n\'existe pas encore. Collez d\'abord vos conduites, puis vos clients.';
$ec_lang['lpn_pane_paste_no_customer_node']='Ligne {row} : le nœud {id} n\'existe pas encore. Collez d\'abord vos jonctions, puis vos clients.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Ligne {row} : le nœud {id} n\'a aucune conduite à laquelle un client puisse se rattacher.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).

// {id} is what the Text table's own Attached to cell named.






$ec_lang['lpn_pane_filled']='Rempli {n} cellules vers le bas. {skipped} n\'ont pas été modifiées.';
$ec_lang['lpn_pane_filldown']='Remplir vers le bas';
$ec_lang['lpn_pane_fill_none']='Rien dans cette sélection ne peut être rempli vers le bas.';
$ec_lang['lpn_pane_ctrlenter_filled']='Rempli {n} cellules. {skipped} n\'ont pas été modifiées.';
$ec_lang['lpn_pane_hide_col']='Masquer cette colonne';
$ec_lang['lpn_pane_hide_cols']='Masquer ces colonnes';
$ec_lang['lpn_pane_show_all_cols']='Afficher toutes les colonnes';
$ec_lang['lpn_pane_sort_asc']='Trier par ordre croissant';
$ec_lang['lpn_pane_manage_cols']='Gérer les colonnes…';
$ec_lang['lpn_pane_manage_cols_title']='Gérer les colonnes';
$ec_lang['lpn_pane_manage_cols_show']='Afficher';
$ec_lang['lpn_pane_manage_cols_up']='Déplacer vers le haut';
$ec_lang['lpn_pane_manage_cols_down']='Déplacer vers le bas';
$ec_lang['lpn_pane_manage_cols_top']='Déplacer au début';
$ec_lang['lpn_pane_manage_cols_bottom']='Déplacer à la fin';
$ec_lang['lpn_pane_colmenu_tip']='Masquer ou gérer les colonnes';
$ec_lang['lpn_tool_area_window']='Sélectionner une fenêtre';
$ec_lang['lpn_tool_area_lasso']='Sélectionner un lasso';
$ec_lang['lpn_tool_area_polygon']='Sélectionner un polygone';
$ec_lang['lpn_tool_delete']='Supprimer';
$ec_lang['lpn_tool_zoom_extent']='Zoom sur l\'étendue';
$ec_lang['lpn_tool_zoom_window']='Fenêtre de zoom';
$ec_lang['lpn_zoom_in']='Zoom avant';
$ec_lang['lpn_zoom_out']='Zoom arrière';
$ec_lang['lpn_new_text']='Texte';
$ec_lang['lpn_field_text_anchor']='Associé à';
$ec_lang['lpn_field_text_bold']='Texte en gras';
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

$ec_lang['lpn_field_text_align']='Alignement horizontal';
$ec_lang['lpn_field_text_align_left']='Gauche';
$ec_lang['lpn_field_text_align_center']='Centre';
$ec_lang['lpn_field_text_align_right']='Droite';
$ec_lang['lpn_field_text_valign']='Alignement vertical';
$ec_lang['lpn_field_text_valign_top']='Haut';
$ec_lang['lpn_field_text_valign_middle']='Milieu';
$ec_lang['lpn_field_text_valign_bottom']='Bas';
$ec_lang['lpn_field_text_rotation']='Angle (degrés)';
$ec_lang['lpn_field_text_match_pipe']='Aligner sur l\'angle de la liaison la plus proche';
$ec_lang['lpn_field_text_flip']='Tourner de 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Élément associé';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Ce texte a été placé assez près d\'un élément pour le suivre : il se déplace donc avec cet élément et possède une ligne de renvoi. Un texte sur une ligne de renvoi tire son alignement horizontal et vertical du côté où il se trouve, c\'est pourquoi ces deux lignes ne sont pas proposées tant qu\'il est associé.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Coefficient d\'émetteur';
$ec_lang['lpn_field_emitter_tip']='Un débit sortant supplémentaire qui dépend de la pression, pour un arroseur, une sortie ouverte ou une fuite modélisée. Le débit qu\'il libère est ce coefficient multiplié par la pression élevée à l\'exposant d\'émetteur, défini une seule fois pour tout le réseau dans Réglages, Calcul, Hydraulique. Laissez ce champ vide sur une jonction ordinaire.';
$ec_lang['lpn_field_elev']='Cote';
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
$ec_lang['lpn_field_head']='Charge';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Niveau de la surface libre dans le réservoir, exprimé comme une hauteur, pas comme une pression. Laissez ce champ vide pour placer la surface libre à la cote du réservoir.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='Cote du fond de la bâche. Les hauteurs d\'eau dans la bâche sont mesurées à partir de là.';
$ec_lang['lpn_field_tank_level']='Hauteur d\'eau';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Hauteur d\'eau présente dans la bâche, mesurée à partir du fond de la bâche. La surface de l\'eau est la cote du fond de la bâche plus cette hauteur.';
$ec_lang['lpn_field_tank_minlevel']='Hauteur d\'eau minimale';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Hauteur d\'eau à laquelle la bâche est considérée comme vide, mesurée à partir du fond de la bâche.';
$ec_lang['lpn_field_tank_maxlevel']='Hauteur d\'eau maximale';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Hauteur d\'eau à laquelle la bâche est pleine, mesurée à partir du fond de la bâche.';
$ec_lang['lpn_field_tank_diameter']='Diamètre de la bâche';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Largeur de la bâche d\'un côté à l\'autre. Elle est exprimée dans les mêmes unités que la cote, pas dans les unités de diamètre des conduites. Elle détermine le volume d\'eau que contient une hauteur donnée.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Cote de la surface de l\'eau dans la bâche : la cote du fond de la bâche plus la hauteur d\'eau. C\'est le niveau que le solveur utilise pour la bâche.';
$ec_lang['lpn_close']='Fermer';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Propriétés';
$ec_lang['lpn_empty_hint']='Utilisez Fichier, Nouveau projet pour ouvrir un exemple. Ou commencez par ajouter un réservoir, une jonction et une conduite depuis la barre d\'outils.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Votre réseau est intact.';
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
$ec_lang['lpn_examples_welcome']='Bienvenue dans la modélisation de réseaux d\'eau potable';
$ec_lang['lpn_examples_heading']='Ouvrir votre propre copie d\'un exemple';
$ec_lang['lpn_examples_sub']='Chaque exemple s\'ouvre comme votre propre copie. Modifiez-la, enregistrez-la, ou ouvrez une nouvelle copie pour recommencer.';
$ec_lang['lpn_examples_open']='Ouvrir';
$ec_lang['lpn_examples_menu']='Ouvrir un exemple…';
$ec_lang['lpn_examples_blank']='Ou commencer ici';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='Nœuds : {nodes}, liaisons : {links}';
$ec_lang['lpn_examples_failed']='Les exemples n\'ont pas pu être chargés. Utilisez Fichier, Nouveau projet pour commencer un dessin.';
$ec_lang['lpn_examples_loading']='Chargement des exemples…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Corriger un problème';
$ec_lang['lpn_help_notes']='Notes sur cette page';
$ec_lang['lpn_help_hotkeys']='Tableaux et raccourcis clavier';
$ec_lang['lpn_hotkeys_tables_heading']='Tableaux';
$ec_lang['lpn_hotkeys_map_heading']='Carte';
$ec_lang['lpn_hotkeys_map_term']='Raccourcis clavier de la carte';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 ou Esc</td><td>Sélectionner.</td></tr><tr><td>2</td><td>Ajouter une jonction.</td></tr><tr><td>3</td><td>Ajouter un réservoir.</td></tr><tr><td>4</td><td>Ajouter une bâche.</td></tr><tr><td>5</td><td>Ajouter une conduite.</td></tr><tr><td>6</td><td>Ajouter une pompe.</td></tr><tr><td>7</td><td>Ajouter une vanne.</td></tr><tr><td>8</td><td>Ajouter un client.</td></tr><tr><td>9</td><td>Ajouter du texte.</td></tr><tr><td>Delete</td><td>Supprimer la sélection.</td></tr><tr><td>Ctrl+Z</td><td>Annuler la dernière modification.</td></tr><tr><td>+ ou =</td><td>Zoom avant.</td></tr><tr><td>-</td><td>Zoom arrière.</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Quelque chose ne va pas ici ?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Une pression suffit à nous signaler qu\'il y a un problème sur cette page. Cela envoie le nom de cette page, la langue dans laquelle vous la lisez, et le message affiché sur la carte s\'il y en a un. Cela n\'envoie rien de ce que vous avez tapé, aucune adresse, et rien du tout de votre dessin. Personne ne peut vous répondre, car cela ne nous dit rien sur qui vous êtes. Utilisez Aide, Signaler un problème quand vous voulez en dire plus.';
$ec_lang['lpn_wrong_thanks']='Merci. C\'est bien arrivé.';
$ec_lang['lpn_status_example_opened']='Ouvert : {name}. C\'est votre copie : enregistrez-la avec Fichier, Enregistrer sous.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Cette page n\'a pas pu déterminer la taille de la zone de dessin ; la carte affiche donc la dernière vue qu\'elle a pu calculer. Redimensionner la fenêtre la fait réessayer. Si cela persiste, une extension de navigateur qui bloque les mesures de page en est généralement la cause.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Réseau de base, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Commencez ici. Un réservoir, une pompe et une petite boucle : le plus petit agencement qui fonctionne encore comme réseau d\'eau. En litres par seconde, avec mètres et millimètres.';
$ec_lang['lpn_ex_basic_us_title']='Réseau de base, gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='Le même réseau de départ en gallons par minute, avec pieds et pouces.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 avec commandes par règles';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Le plus petit des trois réseaux d\'exemple d\'EPANET : un réservoir, une pompe et une seule boucle.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Un réseau de distribution ramifié avec une bâche, tiré des exemples d\'EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Le grand exemple d\'EPANET : 92 jonctions, 3 bâches et 2 réservoirs, dont l\'un est une rivière. À ouvrir pour voir à quoi ressemble un modèle de taille réelle sur la carte.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='Le réseau EPANET Net3 converti en latitude/longitude à Novato, en Californie, avec la carte du monde en arrière-plan.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Un site commercial résolu pour la lutte contre l\'incendie en plus de la demande du jour de pointe, à un instant donné, dessiné sur un plan de site.';
$ec_lang['lpn_tool_undo']='Annuler';
$ec_lang['lpn_confirm_example']='Ceci ajoute l\'exemple au réseau que vous avez déjà. Continuer ?';
$ec_lang['lpn_field_diameter']='Diamètre';
$ec_lang['lpn_demand_tip']='Débits prélevés du réseau à ce nœud. Saisissez un nombre négatif pour un débit injecté dans le réseau ici.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Cette unité détermine le sens de vos saisies';
$ec_lang['lpn_units_warn_lead']='{unit} est l\'unité de ce que vous saisissez pour :';
$ec_lang['lpn_units_options_head']='Quand vous changez une unité :';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Non destructif';
$ec_lang['lpn_units_nondestructive_desc']='Non destructif : laisse chaque saisie telle quelle et la réinterprète dans la nouvelle unité.';
$ec_lang['lpn_units_destructive']='Destructif';
$ec_lang['lpn_units_destructive_desc']='Destructif : réécrit chaque saisie par une conversion mathématique, afin que le réseau reste physiquement à peu près le même, aux tolérances de conversion près. Les valeurs saisies à l\'origine sont perdues. Annuler les rétablit.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} valeurs signifient désormais {unit}. Rien n\'a été réécrit.';
$ec_lang['lpn_status_converted']='{n} valeurs ont été réécrites en {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Longueur';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Coordonnées cartographiques';
$ec_lang['lpn_units_mapcoords_deg']='degrés';
$ec_lang['lpn_units_usft']='pied américain d\'arpentage';
$ec_lang['lpn_units_elevhead']='Cote et charge';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Gradient de perte de charge';
$ec_lang['lpn_result_gradient_tip']='Perte de charge divisée par la longueur de la conduite. Sert à comparer des conduites de longueurs différentes à une même limite de conception.';
$ec_lang['lpn_result_water_age']='Âge de l\'eau';
$ec_lang['lpn_result_water_age_tip']='Depuis combien de temps l\'eau qui arrive ici se trouve dans le réseau. Là où des débits se rejoignent, l\'eau qui arrive porte un mélange d\'âges, et le nombre indiqué ici est leur moyenne pondérée par le débit : une jonction alimentée surtout par une conduite courte et récente affiche un âge faible même si une longue impasse l\'alimente aussi. Dans une bâche, c\'est l\'âge moyen de l\'eau contenue, ce qui explique pourquoi une bâche qui se renouvelle lentement porte souvent l\'eau la plus ancienne d\'un réseau. Il n\'existe pas de limite réglementaire à laquelle la comparer : jugez ce nombre en fonction de votre propre réseau.';
$ec_lang['lpn_result_source_share']='Part de la source';
$ec_lang['lpn_result_source_share_tip']='La part de l\'eau qui arrive ici et qui provient du nœud de traçage. C\'est ce que rapporte l\'analyse de traçage de la source.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Âge moyen de l\'eau';
$ec_lang['lpn_result_avg_source_share']='Part moyenne de la source';
$ec_lang['lpn_result_avg_concentration']='Concentration moyenne';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Facteur de frottement';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Taux de réaction';
$ec_lang['lpn_result_status']='État';
$ec_lang['lpn_result_status_open']='Ouvert';
$ec_lang['lpn_result_status_closed']='Fermé';
$ec_lang['lpn_result_head']='Charge';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Énergie de l\'eau à ce nœud, exprimée comme une hauteur de colonne d\'eau. C\'est une hauteur absolue, alors que la pression est une grandeur manométrique.';
$ec_lang['lpn_result_pressure']='Pression';
$ec_lang['lpn_result_flow']='Débit';
$ec_lang['lpn_result_velocity']='Vitesse';
$ec_lang['lpn_result_headloss']='Perte de charge';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Réinitialise uniquement les paramètres de ce projet. Votre dessin et vos autres projets ne sont pas modifiés. Pour réutiliser vos paramètres favoris, enregistrez un fichier de projet ne contenant que les paramètres.';
$ec_lang['lpn_reset_all_tip']='Supprime tous les projets, toutes les images de fond, tous les paramètres et vos choix d\'unités, puis recharge la page exactement comme la voit un nouveau visiteur. C\'est la seule réinitialisation qui efface tout.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Ce calculateur enregistre les unités du projet et les valeurs saisies telles quelles, mais il convertissait autrefois les nombres en unités SI pour les enregistrer. Ce projet a été enregistré avant ce changement : ses nombres ont donc été enregistrés en unités SI. Faut-il les convertir une dernière fois vers les unités actuelles ? Pour vous permettre de vérifier, voici quelques diamètres qui seront convertis. Les valeurs avant et après sont indiquées :';
$ec_lang['lpn_v2_restore_yes']='Convertir';
$ec_lang['lpn_v2_restore_never']='Non. Ne plus me le demander.';
$ec_lang['lpn_v2_restore_no']='Fermer pour que je vérifie d\'abord les unités actuelles';
$ec_lang['lpn_storage_too_new']='Ce projet a été enregistré par une version plus récente de la page, il ne peut donc pas être ouvert ici.';
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
$ec_lang['lpn_tool_file']='Fichier';
$ec_lang['lpn_menu_edit']='Édition';
$ec_lang['lpn_menu_insert']='Insertion';
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
$ec_lang['lpn_menu_map']='Carte';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Afficher le fond de carte';
$ec_lang['lpn_basemap_satellite_show']='Afficher les images satellite';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='géoréférencé';
$ec_lang['lpn_xymap']='local';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Convertir sous…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Copie de {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Convertir sous';
$ec_lang['lpn_convas_coordsys_tip']='Le système de coordonnées vers lequel la copie est convertie. Lorsqu\'il diffère de celui de ce projet, deux étapes de placement suivent. Un projet qui sait déjà où il se trouve ouvre les deux étapes déjà répondues, vous pouvez donc les accepter telles quelles ou y apporter des modifications.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Actuel : {crs}';
$ec_lang['lpn_convas_epsg']='Système de coordonnées EPSG';
$ec_lang['lpn_convas_epsg_tip']='Choisissez un système de coordonnées dans le registre EPSG. Latitude et longitude correspond au WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Géoréférence (locale) sans nom';
$ec_lang['lpn_convas_unnamed_tip']='Coordonnées locales dans l\'unité de longueur, avec la carte du monde attachée.';
$ec_lang['lpn_convas_none_tip']='Coordonnées locales dans l\'unité de longueur, sans carte du monde pour l\'instant.';
$ec_lang['lpn_convas_units_tip']='Les unités vers lesquelles la copie est convertie. L\'original conserve ses propres nombres et unités.';
$ec_lang['lpn_convas_round']='Arrondir les valeurs converties';
$ec_lang['lpn_convas_round_tip']='Arrondit uniquement les nombres que cette conversion réécrit, au pas le plus proche que vous choisissez. Les valeurs dont l\'unité ne change pas restent telles quelles.';
$ec_lang['lpn_convas_round_none']='Aucun arrondi';
$ec_lang['lpn_convas_round_flow']='Demande et débit';
$ec_lang['lpn_convas_label_col']='Suffixe';
$ec_lang['lpn_convas_label_tip']='Texte ajouté après cette valeur sur les étiquettes de la carte de la copie, comme « mm » ou « gpm ». Pré-rempli à partir de l\'unité choisie ci-dessus ; effacez-le pour n\'avoir aucun suffixe.';
$ec_lang['lpn_convas_oneway']='Reconvertir dans l\'autre sens est une seconde conversion, pas une annulation. Un nombre converti puis reconverti peut ne pas redevenir exactement ce qui avait été saisi.';
$ec_lang['lpn_convas_ok']='Convertir';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} fait partie des quelques systèmes de coordonnées listés sans information de projection utilisable, il ne peut donc pas servir de départ ni d\'arrivée à une conversion. Rien n\'a été converti.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='La copie convertie est {name}. Le projet d\'origine est inchangé.';
$ec_lang['lpn_convas_cancelled']='Rien n\'a été converti. La copie est fermée, et le projet d\'origine est inchangé.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Copie ce projet dans un nouvel onglet et convertit la copie vers le système de coordonnées et les unités que vous choisissez. Lorsque le système de coordonnées change, un assistant vous guide pour zoomer approximativement la carte derrière votre réseau, puis mettre à l\'échelle et faire pivoter votre réseau sur la carte plus précisément. Ce projet reste exactement tel qu\'il est. Pour géoréférencer sans rien convertir, utilisez plutôt Carte, Carte du monde, Attacher.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Ce projet est déjà géoréférencé, le réseau est donc déjà sur la carte et rien n\'a été déplacé. Vérifiez qu\'il est au bon endroit, puis appuyez sur le bouton Placer le modèle ici et sur le bouton Conserver ce placement.';
$ec_lang['lpn_georef_intro']='Placer le modèle se fait en deux étapes. L\'étape 1 est la rapide : le modèle reste immobile et vous déplacez la carte en dessous, jusqu\'à ce que votre site se trouve sous le modèle, à peu près à la bonne taille. Il n\'y a pas encore de rotation. L\'étape 2 est la précise : vous faites glisser, redimensionnez et faites pivoter le modèle lui-même. Votre projet se trouve d\'abord sur une carte du monde entier ; repérez donc votre emplacement, puis appuyez sur le bouton Placer le modèle ici.';
$ec_lang['lpn_georef_adjust']='Le modèle est maintenant posé sur le terrain, il se déplace donc avec la carte. Faites glisser le modèle pour le déplacer, faites glisser un coin pour le redimensionner, faites glisser la poignée ronde au-dessus du modèle pour le tourner. Ou saisissez la distance au sol et l\'angle de rotation ci-dessous.';
$ec_lang['lpn_georef_step1']='Étape 1 sur 2 — rapide';
$ec_lang['lpn_georef_step2']='Étape 2 sur 2 — précise';
$ec_lang['lpn_georef_step1_hint']='Votre projet reste où il est à l\'écran. Déplacez et zoomez la carte en dessous jusqu\'à ce que le terrain derrière lui soit à peu près au bon endroit et à peu près à la bonne taille, puis appuyez sur le bouton Placer le modèle ici.';
$ec_lang['lpn_georef_detach']='Le reprendre en main';
$ec_lang['lpn_georef_size_prompt']='Quelle est environ la largeur du site, sur l\'ensemble du projet ?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Raccourci : appuyez sur {key}.';
$ec_lang['lpn_tool_key_hint_two']='Raccourci : appuyez sur {key} ou {key2}.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Cliquez sur la carte comme indiqué pour sélectionner tout ce qui se trouve à l\'intérieur de la forme. Appuyez de nouveau sur ce bouton pour changer la forme entre une fenêtre, un lasso et un polygone. Maintenez Maj enfoncée pendant la sélection pour continuer avec la sélection existante, en ajoutant ou en retirant (bascule) ce que vous sélectionnez.';
$ec_lang['lpn_area_selected']='{n} sélectionnés.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='Rien trouvé dans cette zone.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Ajoutez et retirez les sommets qui donnent sa forme à une conduite sur la carte. Cliquez sur une conduite pour ajouter un sommet, cliquez sur un sommet pour le retirer, et faites-le glisser pour le déplacer. Un sommet ne change que le tracé dessiné, pas l\'hydraulique.';
$ec_lang['lpn_tool_undo_tip']='Annuler la dernière modification.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Ajuster tout le réseau à la fenêtre de la carte. Appuyez à nouveau sur ce bouton pour Zoom fenêtre, qui zoome sur une zone dont vous cliquez deux coins opposés, ou que vous délimitez en faisant glisser, sur la carte. Ou appuyez sur + ou - pour zoomer ou dézoomer autour du centre de la carte.';
$ec_lang['lpn_tool_zoom_window_tip']='Cliquez sur deux coins opposés d\'un rectangle, ou faites-en glisser un, sur la carte pour zoomer dessus. Appuyez de nouveau sur ce bouton pour Zoom sur l\'étendue.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Zoom avant. Raccourci : +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Zoom arrière. Raccourci : -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Trouvez un élément par son identifiant, ou trouvez tous les éléments répondant à une condition simple ou personnalisée, et modifiez-les tous à la fois.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Légende de la barre d\'outils';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Visibilité';
$ec_lang['lpn_color_legend_open_tip']='Cliquez pour ouvrir le panneau Visibilité et modifier ces couleurs.';
$ec_lang['lpn_color_node_field']='Colorer les nœuds selon';
$ec_lang['lpn_color_link_field']='Colorer les conduites selon';
$ec_lang['lpn_color_ramp_sequential']='Séquentielle';
$ec_lang['lpn_color_ramp_diverging']='Divergente';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Nombre de plages';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Répartition des plages';
$ec_lang['lpn_color_ranges_note']='Les limites ci-dessous sont fixes une fois définies ; elles ne suivent pas les résultats lorsqu\'ils changent. Choisir une méthode de classification des données ci-dessus définit les limites à partir de l\'état actuel du réseau. Si vous modifiez une valeur à la main, la méthode ci-dessus devient Manuel.';
$ec_lang['lpn_color_criterion_note']='Cette méthode tire ses limites d\'une norme de conception, le nombre de couleurs est donc fixe tant que cette méthode est choisie.';
$ec_lang['lpn_color_break_number']='Une limite doit être un nombre. La carte reste inchangée.';
$ec_lang['lpn_color_break_order']='Chaque limite doit être supérieure à la précédente. La carte reste inchangée.';
$ec_lang['lpn_color_break_count']='Il doit y avoir une limite de moins que le nombre de couleurs. La carte reste inchangée.';
$ec_lang['lpn_color_ramp_qualitative']='Catégorielle';
$ec_lang['lpn_color_ramp_rainbow']='Arc-en-ciel';
$ec_lang['lpn_color_ramp_rainbow_eg']='identique à EPANET';
$ec_lang['lpn_color_example_material']='Matériau';
$ec_lang['lpn_color_ramp_ylgnbu']='Jaune à bleu';
$ec_lang['lpn_color_ramp_rdylbu']='Rouge à bleu, en passant par le jaune';
$ec_lang['lpn_georef_drop']='Placer le modèle ici';
$ec_lang['lpn_georef_finish']='Conserver ce placement';
$ec_lang['lpn_georef_scale']='Distance au sol par unité de dessin';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Calculée automatiquement. Modifiez-la pour la changer. Saisissez 1 pour utiliser tels quels les nombres propres au fichier comme distance au sol, par exemple pour un fichier sans système de coordonnées propre.';
$ec_lang['lpn_georef_rotation']='Rotation antihoraire (degrés)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='De combien faire pivoter tout le modèle dans le sens antihoraire pour l\'aligner sur le nouveau système de coordonnées.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Placer le modèle ici de façon définitive ? Vous pourrez encore déplacer des éléments un par un ensuite, mais continuer maintenant convertit toutes les coordonnées en une seule fois. Pour retrouver les anciennes coordonnées, revenez au projet d\'origine et fermez celui-ci sans l\'enregistrer.';
$ec_lang['lpn_georef_done']='Ce projet utilise désormais le nouveau système de coordonnées. Vous pouvez continuer à déplacer tout élément nécessitant un ajustement supplémentaire.';
$ec_lang['lpn_georef_backdrop_unrotated']='L\'image de fond a été déplacée et redimensionnée avec le modèle, mais elle n\'a pas pu être pivotée. Utilisez Carte, Image de fond, Déplacer pour l\'aligner.';
$ec_lang['lpn_georef_empty']='Ce fichier ne contient aucun réseau ; il n\'y a donc rien à placer.';
$ec_lang['lpn_georef_unavailable']='L\'outil de placement ne s\'est pas chargé. Rechargez la page et réessayez.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Terminez le placement avec le bouton « Conserver ce placement », ou appuyez sur Annuler, avant de changer de projet. Le placement appartient à ce projet et ne peut pas vous suivre vers un autre.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Terminez le placement avec le bouton « Conserver ce placement », ou appuyez sur Annuler, avant d\'enregistrer. Le placement du projet n\'est pas terminé, donc ce qui est affiché à l\'écran n\'est pas encore ce qui serait écrit dans le fichier.';
$ec_lang['lpn_goto_menu']='Aller à une latitude et une longitude…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='Latitude puis longitude, dans cet ordre, séparées par une virgule ou un espace';
$ec_lang['lpn_goto_bad']='Coordonnées illisibles. Réessayez. Exemples : 38,-122 ou 38.122 ou 38 -122';
$ec_lang['lpn_georef_goto']='Aller à…';
$ec_lang['lpn_georef_twopt']='Utiliser deux points connus';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Placez le modèle avec exactitude lorsque vous connaissez déjà l\'emplacement réel de deux points de votre dessin. Cliquez sur l\'un d\'eux, saisissez sa latitude et sa longitude, puis faites de même pour un second point. La position, l\'échelle et la rotation découlent toutes de ces deux points. Appuyez de nouveau sur ce bouton pour arrêter la sélection.';
$ec_lang['lpn_georef_twopt_pick1']='Cliquez sur un point de votre dessin dont vous connaissez la latitude et la longitude.';
$ec_lang['lpn_georef_twopt_pick2']='Cliquez maintenant sur un second point connu, aussi loin du premier que possible.';
$ec_lang['lpn_georef_twopt_same']='C\'est le point que vous avez choisi en premier. Choisissez-en un autre.';
$ec_lang['lpn_georef_twopt_done']='Le modèle repose maintenant sur les deux points que vous avez indiqués. Vérifiez-le, puis appuyez sur le bouton Conserver ce placement.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Panneau inférieur';
$ec_lang['lpn_pane_toggle_tip']='Affiche ou masque le panneau sous la carte. Il contient le profil et un tableau pour chaque type d\'élément.';
$ec_lang['lpn_pane_resize']='Faites glisser pour agrandir ou réduire le panneau';
$ec_lang['lpn_pane_tab_junctions']='Jonctions';
$ec_lang['lpn_pane_tab_reservoirs']='Réservoirs';
$ec_lang['lpn_pane_tab_tanks']='Bâches';
$ec_lang['lpn_pane_tab_pipes']='Conduites';
$ec_lang['lpn_pane_tab_pumps']='Pompes';
$ec_lang['lpn_pane_tab_valves']='Vannes';
$ec_lang['lpn_pane_tab_tip']='Cet onglet affiche les éléments de ce type sous forme de tableau semblable à un tableur. Les colonnes de résultats ne peuvent pas être modifiées. Voir Aide, Notes pour les raccourcis clavier.';
$ec_lang['lpn_pane_none']='Ce réseau n\'en a encore aucun.';
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
$ec_lang['lpn_pane_text_attached']='Associé';
$ec_lang['lpn_pane_not_used']='Non utilisé';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Filtré par {q}. Affichage de {n} sur {all}.';
$ec_lang['lpn_pane_filter_clear']='Tout afficher';
$ec_lang['lpn_pane_filter_stale']='Lignes qui ne correspondent plus : {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Rien dans ce tableau ne correspond au filtre.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Zoomer et sélectionner';
$ec_lang['lpn_goto_on_map']='Afficher sur la carte';
$ec_lang['lpn_pane_select_on_map']='Sélectionner sur la carte';
$ec_lang['lpn_pane_unselect_on_map']='Désélectionner sur la carte';


$ec_lang['lpn_pane_print']='Imprimer le tableau';

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
$ec_lang['lpn_menu_project']='Eau';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Tout ce qui concerne la modélisation du réseau d\'eau se trouve ici, au même endroit, sauf les commandes de lecture de l\'animation. Inutile de deviner où se trouvent les choses.';
$ec_lang['lpn_tables_menu']='Tableaux';
$ec_lang['lpn_tables_menu_tip']='Ouvre, dans le panneau sous la carte, un tableau des éléments de ce réseau. Il y a un tableau pour chaque type d\'élément, que vous pouvez y trier et y modifier.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Recalcule ce réseau maintenant. Vous cherchez le bouton Calculer ? Il est masqué tant que le réglage « Calculer automatiquement » est activé. Pour faire réapparaître le bouton, désactivez « Calculer automatiquement » dans Paramètres, sous Calcul, Hydraulique.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Calculer automatiquement';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Quand cette option est activée, ce projet se recalcule peu après chaque modification que vous faites, et le bouton Calculer disparaît de la barre d\'outils car il n\'a plus rien à faire. Désactivez-la sur un grand réseau, où attendre le recalcul après chaque modification gêne la saisie ; le bouton Calculer réapparaît alors, pour que vous choisissiez quand lancer le calcul.';
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
$ec_lang['lpn_time_run_slow']='Ce réseau a mis {secs} s à se calculer, et il est réglé pour se recalculer après chaque modification. Pour arrêter cela et retrouver un bouton Calculer, désactivez « Calculer automatiquement » dans Paramètres, sous Calcul, Hydraulique.';
$ec_lang['lpn_time_no_report']='Il n\'y a pas encore de rapport de calcul. Ce rapport est le texte propre d\'EPANET ; il apparaît donc une fois ce réseau calculé avec le solveur EPANET.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Aide';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Galerie de captures d\'écran';
$ec_lang['lpn_help_walkthroughs']='Tutoriels';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Supprimer le réseau';
$ec_lang['lpn_confirm_delete_network']='Supprimer tous les nœuds, conduites et étiquettes de texte de ce projet ? L\'image de fond, le nom du projet et vos paramètres sont conservés.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Rechercher et remplacer';
$ec_lang['lpn_find_title']='Rechercher et remplacer';
$ec_lang['lpn_find_scope']='Quoi rechercher';
$ec_lang['lpn_find_scope_all']='Tout';
$ec_lang['lpn_find_property']='Propriété';
$ec_lang['lpn_find_condition']='Critère';
$ec_lang['lpn_find_value']='Valeur';
$ec_lang['lpn_find_btn']='Rechercher';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Filtrer dans le tableau actuel';
$ec_lang['lpn_find_filter_tip']='N\'affiche que les éléments correspondant à cette requête dans l\'un des tableaux sous la carte. Le dessin n\'est pas modifié et rien n\'est supprimé.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table} : {n} sur {all}';
$ec_lang['lpn_find_filter_summary']='Filtré par {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Cette recherche ne s\'applique à aucun tableau.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='contient';
$ec_lang['lpn_find_op_equals']='égal à';
$ec_lang['lpn_find_op_gt']='supérieur à';
$ec_lang['lpn_find_op_lt']='inférieur à';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='vide';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} trouvé(s). Cliquez sur l\'un d\'eux pour y aller.';

$ec_lang['lpn_find_shift_hint']='Maj+clic pour basculer : ajoute l\'élément s\'il n\'est pas dans la sélection, le retire s\'il y est déjà.';
$ec_lang['lpn_find_none']='Aucune correspondance.';
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
$ec_lang['lpn_find_op_top']='{n} plus élevés';
$ec_lang['lpn_find_op_bottom']='{n} plus faibles';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Saisissez ce que vous cherchez.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Connectivité';
$ec_lang['lpn_find_prop_demand_desc']='Description de cette catégorie de demande';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='aucune liaison au nœud';
$ec_lang['lpn_find_op_conn_noopen']='aucune liaison ouverte au nœud';
$ec_lang['lpn_find_op_conn_nolinksource']='aucun chemin de liaisons vers une source';
$ec_lang['lpn_find_op_conn_noopensource']='aucun chemin ouvert vers une source';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Tous les nœuds sont connectés.';
$ec_lang['lpn_find_conn_no_fixed']='Ce réseau n\'a ni réservoir ni bâche, il n\'y a donc aucune source à atteindre. Seuls « aucune liaison au nœud » et « aucune liaison ouverte au nœud » peuvent être recherchés.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='La même recherche, écrite sur une seule ligne. Modifier les commandes réécrit cette ligne, et saisir du texte dans cette ligne met à jour les commandes.';
$ec_lang['lpn_find_query_label']='Requête';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Combinez les conditions avec ET, OU et ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='ET';
$ec_lang['lpn_find_q_or']='OU';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Les commandes ne peuvent pas exprimer la requête ci-dessous ; elles sont donc masquées.';
$ec_lang['lpn_find_q_restore']='Utiliser les commandes à la place';
$ec_lang['lpn_replace_q_bad']='Cette requête est incompréhensible ; rien ne peut donc être modifié. Corrigez-la d\'abord ci-dessus.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(au caractère {n})';
$ec_lang['lpn_find_q_err_empty']='La requête est vide ; rien ne sera donc recherché.';
$ec_lang['lpn_find_q_err_scope']='Il n\'y a rien nommé {w} à rechercher. Essayez l\'un de : {list}';
$ec_lang['lpn_find_q_err_dot']='Mettez un point entre ce qu\'il faut rechercher et sa propriété, comme Jonction.ID';
$ec_lang['lpn_find_q_err_prop']='N\'est pas une propriété de {scope} : {w}. Essayez l\'une de : {list}';
$ec_lang['lpn_find_q_err_op']='N\'est pas une condition pour {prop} : {w}. Essayez l\'une de : {list}';
$ec_lang['lpn_find_q_err_value']='Cette condition a besoin d\'une valeur après elle : {op}';
$ec_lang['lpn_find_q_err_quote']='Mettez des guillemets autour d\'une valeur textuelle : {w} n\'est pas un nombre.';
$ec_lang['lpn_find_q_err_quote_end']='Ce texte entre guillemets n\'a pas de guillemet fermant.';
$ec_lang['lpn_find_q_err_close']='Cette parenthèse ( a été ouverte et jamais fermée.';
$ec_lang['lpn_find_q_err_open']='Cette parenthèse ) ne ferme rien.';
$ec_lang['lpn_find_q_err_end']='Rien n\'était attendu après ceci. Reliez deux recherches avec {and} ou {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Modifier ce qui a été trouvé';
$ec_lang['lpn_replace_prop']='Propriété à modifier';
$ec_lang['lpn_replace_value']='Nouvelle valeur';
$ec_lang['lpn_replace_source']='Source de la nouvelle valeur';
$ec_lang['lpn_replace_asked']='Cotes demandées pour {n} nœuds. Les résultats arrivent.';
$ec_lang['lpn_replace_btn']='Remplacer';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Modifier {n} éléments ?';
$ec_lang['lpn_replace_apply']='Les modifier';
$ec_lang['lpn_replace_done']='{n} éléments modifiés. Vous pouvez annuler cette action en une seule étape.';
$ec_lang['lpn_replace_none']='Rien ne changerait.';
$ec_lang['lpn_replace_no_value']='Saisissez la nouvelle valeur.';
$ec_lang['lpn_replace_scope']='Choisissez ci-dessus un type d\'élément sur lequel modifier des valeurs.';
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
$ec_lang['lpn_profile_title']='Profil le long d\'un trajet';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Cliquez sur le nœud où le tracé commence.';
$ec_lang['lpn_profile_draw_more']='Déplacez le curseur sur la carte pour voir le tracé. Cliquez sur un nœud pour l\'ajouter. Double-cliquez pour terminer. Échap annule.';
$ec_lang['lpn_profile_draw_blocked']='Aucun chemin de {a} à {b}. Choisissez un autre nœud.';
$ec_lang['lpn_profile_tap_start']='Touchez le nœud où le tracé commence.';
$ec_lang['lpn_profile_tap_more']='Touchez un nœud pour voir le tracé. Appuyez de manière prolongée pour l\'ajouter. Touchez deux fois pour terminer. Appuyez de nouveau sur Profil pour annuler.';
$ec_lang['lpn_profile_say_idle']='Appuyez de nouveau sur Profil pour choisir un nouveau tracé sur la carte.';
$ec_lang['lpn_profile_none']='Pas encore de tracé. Appuyez de nouveau sur Profil pour en choisir un sur la carte.';
$ec_lang['lpn_profile_choose']='Choisissez un nœud de départ et un nœud d\'arrivée.';
$ec_lang['lpn_profile_no_path']='Ces deux nœuds ne sont reliés par aucun trajet.';
$ec_lang['lpn_profile_no_solve']='Pas encore de résultats, donc seul le terrain naturel est tracé.';
$ec_lang['lpn_profile_summary']='Nœuds : {n}, longueur : {len} {u}';
$ec_lang['lpn_profile_axis_station']='Distance le long du trajet ({u})';
$ec_lang['lpn_profile_axis_elev']='Cote et charge ({u})';
$ec_lang['lpn_profile_ground']='Terrain naturel';
$ec_lang['lpn_profile_hgl']='Ligne piézométrique';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Modifier';
$ec_lang['lpn_profile_edit_tip']='Changez une extrémité du trajet, ou retirez-en un nœud, sans redessiner tout le trajet.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Faites glisser n\'importe quel point du trajet pour le déplacer. Cliquez sur un point que vous avez ajouté pour le retirer.';
$ec_lang['lpn_profile_edit_tap']='Faites glisser n\'importe quel point du trajet pour le déplacer. Touchez un point que vous avez ajouté pour le retirer.';
$ec_lang['lpn_profile_edit_nowhere']='Un point du trajet doit être un nœud. Le trajet reste inchangé.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Trajets enregistrés';
$ec_lang['lpn_profile_new']='Nouveau trajet enregistré…';
$ec_lang['lpn_profile_new_name']='Trajet {n}';
$ec_lang['lpn_profile_rename']='Renommer le trajet…';
$ec_lang['lpn_profile_delete']='Supprimer le trajet';
$ec_lang['lpn_profile_prompt_name']='Nom de ce trajet';
$ec_lang['lpn_profile_delete_confirm']='Supprimer le trajet enregistré {name} ? Le dessin lui-même n\'est pas modifié.';
$ec_lang['lpn_profile_none_saved']='Aucun trajet enregistré pour l\'instant';
$ec_lang['lpn_profile_missing']='Le trajet enregistré {name} utilise des nœuds absents de ce projet : {ids}';
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
$ec_lang['lpn_ts_menu']='Série temporelle';
$ec_lang['lpn_ts_tip']='Trace un ou plusieurs éléments en fonction du temps sur une simulation en période prolongée.';
$ec_lang['lpn_ts_title']='Valeurs en fonction du temps';
$ec_lang['lpn_ts_group_nodes']='Nœuds';
$ec_lang['lpn_ts_group_links']='Liaisons';
$ec_lang['lpn_ts_add']='Ajouter la sélection';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Rien de ce type n\'est sélectionné sur la carte.';
$ec_lang['lpn_ts_clear']='Tout retirer';
$ec_lang['lpn_ts_chip_tip']='Retirer {id} du graphique';
$ec_lang['lpn_ts_none']='Rien à tracer pour l\'instant. Sélectionnez des éléments sur la carte et appuyez sur Ajouter la sélection.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Pas encore de résultats en période prolongée. Appuyez sur Calculer pour lancer la simulation.';
$ec_lang['lpn_ts_summary']='Éléments : {n}, pas de temps de rapport : {steps}';
$ec_lang['lpn_ts_axis_time']='Temps écoulé';
$ec_lang['lpn_freq_menu']='Fréquence';
$ec_lang['lpn_freq_tip']='Graphique de la distribution de fréquence d\'une propriété sur toutes les jonctions ou toutes les conduites au pas de temps actuel.';
$ec_lang['lpn_freq_title']='Distribution des valeurs';
$ec_lang['lpn_freq_none']='Aucun résultat pour cette valeur pour l\'instant, donc rien à tracer.';
$ec_lang['lpn_freq_summary']='Tracé : {n} sur {total}';
$ec_lang['lpn_freq_summary_time']='Tracé : {n} sur {total}, à {time}';
$ec_lang['lpn_freq_axis_percent']='Pourcentage inférieur à';
$ec_lang['lpn_view_units']='Unités';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Tout enregistrer';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Projet{n}';
$ec_lang['lpn_project_copy_suffix']='(copie)';
$ec_lang['lpn_project_rename']='Renommer';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Nouveau projet…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Nouveau projet';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Système de coordonnées';
$ec_lang['lpn_new_coordsys_tip']='Sélectionnez le système de coordonnées de votre réseau. Ce choix est permanent ; le seul moyen de convertir un réseau vers d\'autres coordonnées est « Fichier, Ouvrir vers de nouvelles coordonnées », et c\'est une conversion approximative.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Locale, schématique ou personnalisée';
$ec_lang['lpn_new_coordsys_local_tip']='Non géoréférencé. Associez votre propre image de fond, ou aucune.';
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
$ec_lang['lpn_crs_view']='Filtrer selon la vue de la carte';
$ec_lang['lpn_crs_view_tip']='Ne propose que les projections qui couvrent l\'endroit affiché par la carte. Désactivez cette option pour voir la liste complète.';
$ec_lang['lpn_crs_place']='Recherche par nom de lieu';
$ec_lang['lpn_crs_place_tip']='Saisissez une ville, une adresse ou un lieu remarquable, et la vue de la carte s\'y déplace. Les mots que vous tapez sont envoyés au service de recherche de lieux d\'OpenStreetMap, qui vous demande votre autorisation la première fois. Un nouveau projet géographique démarre aussi à l\'endroit trouvé ici.';
$ec_lang['lpn_crs_search']='Rechercher';
$ec_lang['lpn_crs_name']='Filtre par nom de projection';
$ec_lang['lpn_crs_name_tip']='N\'affiche que les projections dont le nom ou le code EPSG contient ce que vous tapez. Essayez un numéro de zone, ou UTM, ou Mercator.';
$ec_lang['lpn_crs_list_tip']='Les projections restantes après les deux filtres ci-dessus. Choisissez-en une et appuyez sur Sélectionner.';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Aucun lieu n\'a encore été recherché, donc la liste complète est proposée. Recherchez un lieu ci-dessus ou zoomez la carte pour la restreindre.';
$ec_lang['lpn_crs_count']='{n} projection(s) sur {total} listée(s).';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} systèmes de coordonnées sur {total} couvrent ce réseau.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(pas de carte)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} fait partie des quelques systèmes de coordonnées listés sans information de projection utilisable. Cela signifie que la carte du monde, la recherche par nom de lieu et les cotes du MNT ne fonctionnent pas. Vos coordonnées ne sont pas affectées.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='sans nom';
$ec_lang['lpn_crs_none']='Non géoréférencé';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Un projet garde ses propres unités, donc ce choix n\'appartient qu\'à ce projet et rien ici n\'est enregistré comme réglage du navigateur. Pour créer systématiquement de nouveaux projets d\'une certaine façon, enregistrez un projet vide comme modèle et faites-en une copie à chaque fois.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Petaluma, Californie';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Créer';
$ec_lang['lpn_file_open']='Ouvrir…';
$ec_lang['lpn_file_save']='Enregistrer';
$ec_lang['lpn_file_saveas']='Enregistrer sous…';
$ec_lang['lpn_file_revert']='Rétablir';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Fichiers récents';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='L\'autorisation d\'ouvrir ce fichier n\'a pas été accordée ; il n\'a donc pas été ouvert.';
$ec_lang['lpn_recent_gone']='Impossible d\'ouvrir {file}. Ce fichier a peut-être été déplacé, renommé ou supprimé ; il a donc été retiré de la liste des fichiers récents.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Nouveau projet';
$ec_lang['lpn_tab_all']='Tous les projets';
$ec_lang['lpn_tab_menu']='Menu du projet';
$ec_lang['lpn_tab_duplicate']='Dupliquer';
$ec_lang['lpn_tab_move_left']='Déplacer à gauche';
$ec_lang['lpn_tab_move_right']='Déplacer à droite';
$ec_lang['lpn_tab_unsaved']='Non enregistré dans un fichier';
$ec_lang['lpn_import_bad_file']='Ce fichier n\'a pas pu être lu comme un projet enregistré depuis cette page.';
$ec_lang['lpn_import_no_room']='Il ne reste pas assez d\'espace de stockage dans le navigateur pour ajouter ce projet. Supprimez un projet dont vous n\'avez plus besoin et réessayez.';
$ec_lang['lpn_file_import_menu']='Importer…';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='OK';
$ec_lang['lpn_file_import_inp']='Importer un fichier EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Crée un nouveau projet à partir d\'un fichier EPANET, au format d\'exportation .inp (à privilégier) ou au format natif .net (en dernier recours).';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='Exporter le fichier EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Télécharger ce réseau sous forme de fichier EPANET .inp. Tout ce que le format .inp ne peut pas contenir vous est ensuite signalé.';
$ec_lang['lpn_status_inp_exported']='{file} exporté.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} éléments que le format .inp ne peut pas contenir.';
$ec_lang['lpn_inp_export_refused']='Ce projet ne peut pas être écrit comme fichier EPANET : {detail}';
$ec_lang['lpn_inp_bad_file']='Ce fichier n\'a pas pu être lu comme un fichier de réseau EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Ceci ressemble à un fichier .net d\'EPANET, mais cette page n\'a pas pu le lire. Ouvrez-le dans EPANET et utilisez-y la commande Fichier, Exporter, Réseau pour l\'enregistrer en fichier .inp, puis importez celui-ci.';
$ec_lang['lpn_inp_report_heading']='{file} importé';
$ec_lang['lpn_inp_report_counts']='{nodes} jonctions, réservoirs et bâches, {links} conduites, pompes et vannes, en {units}.';
$ec_lang['lpn_inp_report_clean']='Tout le contenu du fichier a été repris. Rien n\'a été laissé de côté.';
$ec_lang['lpn_inp_report_label_anchor']='Les étiquettes de texte sont placées comme EPANET les place, depuis leur coin supérieur gauche.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='Les fichiers EPANET ne contiennent pas de système de coordonnées, ce fichier ne sera donc pas géoréférencé au départ. Pour le placer sur une carte du monde, utilisez Carte, Carte du monde… Pour convertir ses coordonnées, utilisez Fichier, Convertir sous…';
$ec_lang['lpn_inp_report_lead']='Cette page n\'utilise pas tout ce qu\'EPANET utilise, mais rien de votre fichier n\'est jeté. Voici ce que votre fichier contient et que cette page conserve sans l\'utiliser, ainsi que ce qui a été modifié lors de la lecture du fichier :';
$ec_lang['lpn_inp_drop_headloss']='Ce fichier n\'utilise pas la formule de Hazen-Williams. Cette page calcule avec Hazen-Williams, les valeurs de rugosité des conduites ont donc été conservées telles quelles, mais les résultats obtenus ici ne correspondront pas à ceux d\'EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Ces bâches ne sont pas à parois verticales droites : le fichier donne leur forme sous forme de courbe. La courbe est conservée dans les Bibliothèques, la bâche continue de la désigner, et une simulation sur toute la période la remplit et la vide selon le calendrier que donne cette courbe. Un instant unique reste identique dans les deux cas, car la surface de l\'eau est le niveau fixé par le fichier. Le diamètre indiqué dans le fichier est conservé à côté de la courbe, et c\'est celui utilisé pour dessiner et calculer une bâche sans courbe.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Ces vannes de régulation par étranglement (TCV) sont entrées comme des vannes de régulation par étranglement, portant la même perte de charge que le fichier leur donne.';
$ec_lang['lpn_inp_drop_valve_active']='Ces vannes régulent la pression ou le débit, et s\'ouvrent et se ferment d\'elles-mêmes selon l\'évolution de l\'eau. Rien n\'a été perdu lors de l\'importation, et cette page les résout avec le solveur EPANET, en activant ce solveur automatiquement pour ce réseau.';
$ec_lang['lpn_inp_drop_valve']='Ces vannes sont décrites par une courbe ou par une perte de pression fixe, et cette page ne possède pas ce type d\'élément. Elles ont été importées comme des conduites ouvertes, le réseau reste donc raccordé, mais plus rien n\'y contrôle la pression ou le débit.';
$ec_lang['lpn_inp_drop_cv']='Dans EPANET, ces conduites ne laissent passer l\'eau que dans un seul sens. Elles sont entrées comme des conduites ordinaires, l\'eau peut donc désormais y circuler dans les deux sens.';
$ec_lang['lpn_inp_drop_demands']='Ces jonctions avaient plus d\'une demande. Les demandes ont été additionnées pour former la demande unique que cette page conserve.';
$ec_lang['lpn_inp_drop_patterns']='Cette page n\'a pas lu les courbes de modulation de la demande, car la partie qui simule un réseau dans le temps ne s\'est pas chargée. Chaque demande est le nombre écrit dans le fichier.';
$ec_lang['lpn_inp_drop_demand_pattern']='Ces jonctions font varier leur demande au cours du calcul. Leurs courbes de modulation ont été importées intégralement, et la demande affichée est celle de l\'instant indiqué par l\'horloge.';
$ec_lang['lpn_inp_drop_emitters']='Ces jonctions ont un coefficient d\'arroseur ou de fuite. Il a été conservé, il est pris en compte dans le calcul, et chacune de ces jonctions l\'affiche dans le champ Coefficient d\'émetteur de ses propriétés.';
$ec_lang['lpn_inp_drop_curve_long']='Cette courbe de pompe comptait plus de trois points. Son point le plus bas, son point médian et son point le plus haut ont été conservés, car cette page ajuste une courbe sur trois points au plus.';
$ec_lang['lpn_inp_drop_curve_missing']='Cette pompe désigne une courbe absente du fichier. Elle est entrée sans courbe, elle n\'ajoute donc aucune charge.';
$ec_lang['lpn_inp_drop_pump_other']='Cette pompe est décrite par la puissance qu\'elle consomme, plutôt que par une courbe. Elle a été importée sans courbe, elle n\'ajoute donc aucune charge.';
$ec_lang['lpn_inp_drop_head_pattern']='Ces réservoirs montent et descendent au cours du calcul. Leurs courbes de modulation ont été importées intégralement, et le niveau d\'eau affiché est celui de l\'instant indiqué par l\'horloge.';
$ec_lang['lpn_inp_drop_pump_speed']='Ces pompes tournent à une vitesse différente de celle à laquelle leur courbe a été mesurée, ou changent de vitesse au cours du calcul. La vitesse et sa courbe de modulation ont été importées intégralement, et la charge affichée est celle de l\'instant indiqué par l\'horloge.';
$ec_lang['lpn_inp_drop_setting']='Ces conduites, pompes et vannes portent un réglage que cette page ne peut pas conserver. Elles sont entrées ouvertes.';
$ec_lang['lpn_inp_drop_rules']='Ce fichier contient des contrôles basés sur des règles. Cette page les lit et les utilise. Calculez le modèle avec le moteur EPANET et les règles sont appliquées, chaque niveau, pression et débit qu\'elles contiennent étant converti dans les unités affichées par ce projet. Ouvrez Règles sous Bibliothèques pour en lire une ou la modifier. Elles sont conservées exactement telles que le fichier les énonce, et elles sont réécrites si vous enregistrez un fichier EPANET.';
$ec_lang['lpn_inp_drop_eps']='Ce fichier décrit une simulation qui s\'étend sur une période. La partie de cette page qui simule un réseau dans le temps ne s\'est pas chargée, donc seules les conditions initiales ont été importées.';
$ec_lang['lpn_inp_drop_quality']='Ce fichier décrit comment la qualité de l\'eau évolue au fil de son parcours : ce que contient l\'eau au départ, et à quelle vitesse cette substance réagit dans les conduites et dans les bâches. Cette page lit ces nombres et les utilise. Choisissez un produit chimique sous Paramètres, Calcul, Qualité, puis calculez le modèle, et la concentration est déterminée le long du réseau au fil du calcul. Ces lignes sont conservées, et elles sont réécrites si vous enregistrez un fichier EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='Ce fichier indique où un produit chimique est injecté dans le réseau, et comment l\'eau se mélange dans une bâche. Une injection apparaît sur le nœud où elle est ajoutée, et une bâche indique quel modèle de mélange elle suit. L\'injection et le modèle de mélange sont tous deux calculés uniquement par le moteur EPANET.';
$ec_lang['lpn_inp_drop_energy']='Ce fichier EPANET contient des données de modélisation du coût de pompage. Cette page les lit et les utilise. Calculez le modèle avec le moteur EPANET, puis ouvrez Eau, Rapports, Énergie des pompes pour voir la durée de fonctionnement de chaque pompe, la puissance qu\'elle a consommée, l\'énergie utilisée et ce qu\'elle a coûté. Ces lignes sont conservées, et elles sont réécrites si vous enregistrez un fichier EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Ce fichier attribue des balises à certaines de ses jonctions, conduites ou autres éléments. Chaque balise a été importée intégralement, et chacune figure dans les propriétés de son propre élément, où vous pouvez la lire ou la modifier.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Ce fichier contient les propres réglages d\'EPANET pour la mise en forme du rapport qu\'il imprime. Vous pouvez lire le rapport du moteur ici, sous Rapports, Calcul EPANET, mais il sort dans le format standard du moteur plutôt que dans celui que ces réglages demandent. Ces lignes sont conservées, et elles sont réécrites si vous enregistrez un fichier EPANET.';
$ec_lang['lpn_inp_drop_sections']='Ce fichier contient une section que cette page ne lit pas du tout. Rien ici ne l\'utilise. Elle est conservée intégralement, et elle est réécrite si vous enregistrez un fichier EPANET.';
$ec_lang['lpn_inp_drop_quality_options']='Ce fichier indique des options EPANET de qualité de l\'eau : l\'option Qualité, qui nomme le type d\'analyse de qualité de l\'eau, et deux réglages liés à un produit chimique, Diffusivité relative et Tolérance de qualité. Ces trois éléments sont conservés et utilisés. L\'âge de l\'eau, le traçage de la source et un produit chimique sont chacun calculés ici, et les deux réglages chimiques sont transmis au moteur EPANET lorsque vous calculez un produit chimique. Tous sont réécrits si vous enregistrez un fichier EPANET.';
$ec_lang['lpn_inp_drop_file_options']='Ce fichier fait référence à un fichier auxiliaire : Map, qui contient des coordonnées, ou Hydraulics, qui contient une hydraulique déjà calculée. Cette page ne peut ouvrir ni l\'un ni l\'autre, donc ces lignes sont conservées telles quelles et réécrites si vous enregistrez un fichier EPANET.';
$ec_lang['lpn_inp_drop_other_options']='Ce fichier indique des options que cette page ne lit pas. Rien ici ne les utilise. Elles sont conservées et réécrites si vous enregistrez un fichier EPANET.';
$ec_lang['lpn_inp_drop_net_options']='Ce fichier EPANET .net indique des réglages pour lesquels cette page n\'a pas de contrôle, donc leurs valeurs sont listées ici plutôt que reportées. Tout le reste a été importé. Si vous en avez besoin, ouvrez le fichier dans EPANET et utilisez Fichier, Exporter, Réseau pour l\'enregistrer en fichier .inp, puis importez celui-ci.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Ceci était un fichier EPANET .net. C\'est le format de projet propre à EPANET, il n\'a pas de description publiée, et cette page le lit en devinant le format à partir d\'exemples de fichiers, donc n\'utilisez ce format qu\'en dernier recours plutôt que comme une méthode fiable. Le fichier .inp est le format documenté que tout autre programme sait lire : dans EPANET, utilisez Fichier, Exporter, Réseau pour en écrire un, et importez-le à la place chaque fois que possible.';
$ec_lang['lpn_inp_drop_backdrop']='Ce fichier nomme une image de fond mais ne contient pas l\'image elle-même. Ajoutez-la vous-même avec Fichier, Image de fond, Ajouter une image.';
$ec_lang['lpn_inp_drop_dangling']='Ces conduites désignent une jonction absente du fichier, elles ont donc été laissées de côté.';
$ec_lang['lpn_inp_drop_units']='L\'unité de débit indiquée dans ce fichier n\'est pas une unité que cette page connaît, donc chaque nombre a été lu en gallons par minute. Vérifiez chaque nombre avant d\'utiliser les résultats.';
$ec_lang['lpn_inp_drop_anchor_missing']='Ce texte était attaché à une jonction, un réservoir ou une bâche absent du fichier. Il a été importé comme texte libre, à l\'emplacement indiqué par le fichier, et ne suit plus rien désormais.';
$ec_lang['lpn_import_notes_heading']='Ce projet a été importé depuis un fichier EPANET. Certains éléments contenus dans ce fichier sont conservés mais ne sont pas utilisés sur cette page.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='{name} a été ouvert depuis un fichier et ajouté à ce navigateur comme nouveau projet.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Fichier de projet';
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
$ec_lang['lpn_file_upload_explain']='Ce navigateur ne peut pas se connecter à un fichier, donc ouvrir un fichier ici revient à le téléverser : le projet est copié dans ce navigateur, et le seul moyen d\'enregistrer votre travail dans le fichier est d\'écraser celui-ci avec Fichier, Enregistrer sous.';
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
$ec_lang['lpn_file_saveas_tip_download']='Enregistre selon les paramètres de téléchargement de votre navigateur. Ce navigateur ne peut pas se connecter à un fichier, donc Enregistrer est désactivé et seul Enregistrer sous est disponible. Si vous activez le paramètre de votre navigateur « Demander où enregistrer chaque fichier », vous pouvez choisir le fichier d\'origine et l\'écraser.';
$ec_lang['lpn_status_uploaded']='Fichier de projet téléversé. Aucune connexion ne peut être maintenue avec lui, donc le seul moyen d\'y enregistrer votre travail est d\'utiliser Fichier, Enregistrer sous.';
$ec_lang['lpn_status_downloaded']='{file} téléchargé. Ce navigateur ne peut pas se connecter à un fichier, donc ce projet reste marqué comme non enregistré dans un fichier.';
$ec_lang['lpn_status_file_opened']='{file} ouvert.';
$ec_lang['lpn_status_already_open']='Ce fichier est déjà ouvert ici sous le nom {name}, ce qui a donc basculé vers lui plutôt que d\'en ouvrir une seconde copie.';
$ec_lang['lpn_status_already_open_dirty']='Ce fichier est déjà ouvert ici sous le nom {name}, avec des modifications que vous n\'y avez pas enregistrées. Ceci a basculé vers lui plutôt que d\'en ouvrir une seconde copie. Utilisez Fichier, Rétablir si vous préférez la version sur le disque.';
$ec_lang['lpn_status_saved']='{file} enregistré.';
$ec_lang['lpn_status_reverted']='{file} chargé à nouveau depuis le disque.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Enregistrer vos modifications dans {name} avant de le fermer ?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} n\'est conservé que dans ce navigateur. Si vous le fermez sans l\'enregistrer dans un fichier, il sera perdu définitivement.';
$ec_lang['lpn_close_discard']='Fermer sans enregistrer';
$ec_lang['lpn_cancel']='Annuler';
$ec_lang['lpn_revert_confirm']='Abandonner les modifications que vous avez faites et recharger {file} depuis le disque ?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Ce projet provient de {file}, mais la connexion à ce fichier a été perdue. Choisissez à nouveau le fichier pour vous y reconnecter.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Impossible d\'écrire dans le fichier. Il a peut-être été déplacé ou renommé, ou l\'autorisation a peut-être été retirée. Votre travail est toujours enregistré dans ce navigateur. Utilisez Enregistrer dans le fichier pour choisir le fichier à nouveau.';
$ec_lang['lpn_file_changed_elsewhere']='Quelqu\'un d\'autre a enregistré dans ce fichier depuis que vous l\'avez ouvert, donc enregistrer maintenant écraserait son travail. Utilisez Fichier, Enregistrer sous pour conserver vos modifications dans un fichier à vous, ou Fichier, Rétablir pour abandonner les vôtres et charger les siennes.';
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
$ec_lang['lpn_lock_somebody']='Quelqu\'un d\'autre';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} a ce fichier ouvert.';
$ec_lang['lpn_lock_open_readonly']='Ouvrir en lecture seule';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Forcer le verrou';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Ce fichier semble être en cours d\'utilisation.';
$ec_lang['lpn_lock_open_care']='Pour éviter une perte de données, choisissez soigneusement parmi les options ci-dessous.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='Il est utilisé depuis {x}.';
$ec_lang['lpn_lock_age_edited']='Il a été modifié pour la dernière fois il y a {x}.';
$ec_lang['lpn_lock_age_saved']='Il a été enregistré pour la dernière fois il y a {x}.';
$ec_lang['lpn_lock_age_never_saved']='Rien n\'a encore été enregistré dans ce fichier.';
$ec_lang['lpn_lock_age_unknown']='Il n\'existe aucune trace de la durée d\'utilisation, ni de la date du dernier enregistrement ou de la dernière modification.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='« Demander » indique à la personne qui a ce fichier ouvert que vous le souhaitez, et ne change rien d\'autre. « Ouvrir en lecture seule » vous permet de le consulter et d\'y modifier ce que vous voulez, sans pouvoir enregistrer ici. « Forcer le verrou » vous permet d\'enregistrer par-dessus le fichier ; leur travail non enregistré n\'est pas perdu, mais ils ne pourront plus l\'enregistrer ici, et quelqu\'un devra peut-être fusionner les deux à la main.';
$ec_lang['lpn_lock_ask']='Demander';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Qui devons-nous dire que c\'est ? Vos initiales sont idéales. Elles sont conservées avec le verrou de ce fichier sur notre serveur, pour quiconque l\'a ouvert, et supprimées sous 30 jours.';
$ec_lang['lpn_lock_ask_sent']='Nous avons demandé à la personne qui a ce fichier ouvert de le fermer. Elle le verra dans la minute, si sa page est toujours ouverte. Rien d\'autre n\'a changé, et le fichier lui appartient toujours jusqu\'à ce qu\'elle le ferme.';
$ec_lang['lpn_lock_ask_failed']='Votre message n\'a pas pu être délivré. Soit personne n\'a ce fichier ouvert actuellement, soit le serveur n\'a pas pu être joint.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Ce fichier n\'a pas été ouvert, et rien n\'a changé ici. Quelqu\'un d\'autre l\'a toujours ouvert.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} aimerait modifier ce fichier. Quand vous serez prêt, enregistrez votre travail et utilisez Fichier, Fermer pour le lui céder.';
$ec_lang['lpn_ago_seconds']='{n} secondes';
$ec_lang['lpn_ago_minutes']='{n} minutes';
$ec_lang['lpn_ago_hours']='{n} heures';
$ec_lang['lpn_ago_days']='{n} jours';
$ec_lang['lpn_ago_unknown']='un temps inconnu';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Messages';
$ec_lang['lpn_msglog_heading']='Messages récents';
$ec_lang['lpn_msglog_empty']='Aucun message pour l\'instant.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='il y a {x}';
$ec_lang['lpn_msglog_note']='Les plus récents en premier. Cette page conserve les {n} derniers messages tant qu\'elle est ouverte, et rien n\'est stocké sur votre ordinateur.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Lecture seule : {name} a ce fichier ouvert. Vous pouvez modifier ce que vous voulez ici, mais vous ne pouvez pas enregistrer. Utilisez Fichier, Enregistrer sous pour enregistrer dans un autre fichier.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Attention : impossible de contacter le serveur pour vérifier ou créer un verrou sur ce projet, donc rien n\'empêche un collègue de modifier le même fichier en même temps. Vous serez averti si le verrouillage se remet à fonctionner.';
$ec_lang['lpn_lock_storage_error']='Attention : ce site ne peut pas enregistrer les fichiers de verrouillage, donc rien n\'empêche un collègue de modifier le même fichier en même temps. Il s\'agit d\'un problème de configuration du serveur, que vous ne pouvez pas corriger ici — le dossier de verrouillage n\'est pas accessible en écriture par le serveur web.';
$ec_lang['lpn_lock_full_error']='Attention : ce site n\'a plus de place pour enregistrer qui a quel projet ouvert, donc rien n\'empêche un collègue de modifier le même fichier en même temps. Il s\'agit d\'un problème de configuration du serveur, que vous ne pouvez pas corriger ici.';
$ec_lang['lpn_lock_not_asked']='Le verrouillage ne fonctionne pas pour ce projet, donc rien n\'empêche un collègue de modifier le même fichier en même temps. Ce projet n\'a pas encore d\'identifiant ; l\'enregistrer dans un fichier lui en donnera un.';
$ec_lang['lpn_lock_restored']='Le verrouillage fonctionne à nouveau, et ce fichier est maintenant le vôtre pour y enregistrer.';
$ec_lang['lpn_lock_dismiss']='Masquer ce message';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Votre projet sera enregistré dans un fichier sur cet ordinateur. Il est enregistré quand vous le demandez, et à aucun autre moment, donc rien n\'est écrit dans ce fichier à votre insu.';
$ec_lang['lpn_file_training_2']='Pour que deux personnes ne modifient jamais un même fichier en même temps, ce site garde la trace de qui l\'a ouvert. Si quelqu\'un l\'a déjà ouvert, vous pouvez quand même l\'ouvrir pour le consulter, ou en conserver votre propre copie.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='La première fois que vous enregistrez, votre navigateur demandera si ce site peut modifier le fichier. Cette question vient du navigateur, pas de nous, et répondre oui est ce qui permet à Enregistrer d\'écrire votre travail dans le fichier. Elle n\'est généralement posée qu\'une fois par fichier.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Continuer';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Choisir à nouveau le fichier';
$ec_lang['lpn_file_reconnect']='Se reconnecter à ce fichier';
$ec_lang['lpn_file_reconnect_alert']='Ce projet provient de {file}. Votre navigateur a de nouveau besoin de votre autorisation pour pouvoir y écrire. Reconnectez-vous ci-dessous.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='C\'est le même fichier qu\'un autre a déjà ouvert, il ne peut donc pas être écrasé. Choisissez un fichier ou un nom différent.';
$ec_lang['lpn_saveas_overwrites_project']='Ce fichier contient déjà un autre projet, {name}. Enregistrer ici le remplacera complètement. Continuer ?';
$ec_lang['lpn_saveas_overwrites_newer']='Ce fichier a changé depuis la dernière fois que vous l\'avez vu, donc quelqu\'un d\'autre y a presque certainement enregistré. Enregistrer ici remplacera sa version par la vôtre. Continuer ?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Nom de ce projet';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='{closed} fermé. {opened} affiché maintenant.';
$ec_lang['lpn_status_closed_empty']='{closed} fermé. Un nouveau projet vide a été créé.';
$ec_lang['lpn_storage_full']='Non enregistré. Le stockage du navigateur est plein ou indisponible, donc vos modifications récentes seront perdues à la fermeture de cet onglet.';
$ec_lang['lpn_storage_unreadable']='Non enregistré. Ce projet n\'a pas pu être lu depuis le stockage du navigateur. Sa copie enregistrée reste exactement telle quelle et ne sera pas écrasée ; rien n\'est donc enregistré depuis cet onglet. Ouvrez un fichier ou créez un nouveau projet pour continuer à travailler.';
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
$ec_lang['lpn_about_credits']='Crédits';
$ec_lang['lpn_help_welcome']='Page d\'accueil';
$ec_lang['lpn_about_license']='Distribué sous licence GNU General Public License v3.0 ou ultérieure.';
$ec_lang['lpn_notes_1_term']='Comment il est résolu';
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
$ec_lang['lpn_notes_1_def']='Le solveur EPANET calcule ce réseau. Réglez une durée totale de simulation et chaque pas de temps du rapport est calculé tour à tour : les bâches se remplissent et se vident, les demandes suivent leurs courbes de modulation, et la barre d\'outils permet de rejouer le calcul.';
$ec_lang['lpn_notes_2_term']='Ce qu\'il ne fait pas';
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
$ec_lang['lpn_notes_2_def']='La qualité de l\'eau est modélisée : l\'âge de l\'eau, le traçage de la source, et un produit chimique qui réagit dans les parois des conduites et dans le corps de l\'eau. Le coup de bélier ne l\'est pas : chaque résultat ici concerne un écoulement déjà stable, non l\'onde de pression provoquée par la fermeture brutale d\'une vanne.';
$ec_lang['lpn_notes_3_term']='Enregistrement des projets';
$ec_lang['lpn_notes_3_def']='Chaque projet est un onglet, et chaque onglet est enregistré dans ce navigateur au fur et à mesure que vous travaillez. Effacer les données de votre navigateur les supprime tous, alors conservez votre travail dans un fichier : Fichier, Enregistrer sous. Un astérisque sur un onglet signifie qu\'il contient des modifications absentes d\'un fichier. Rien n\'est jamais écrit dans un fichier sans que vous le demandiez. Dans certains navigateurs, un projet se connecte au fichier dans lequel vous l\'enregistrez, et Fichier, Enregistrer y écrit désormais à chaque fois ; dans d\'autres, aucune connexion n\'est possible, donc Enregistrer est désactivé et seul Enregistrer sous est disponible. Quand un fichier de projet est conservé sur un lecteur partagé, cette page vous indique si un collègue l\'a déjà ouvert, afin que deux personnes n\'écrivent pas l\'une par-dessus l\'autre.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Courbe de la pompe';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Une pompe suit H = H₀ − aQ^b, où H est la charge ajoutée par la pompe et Q le débit qui la traverse. Entrez un, deux ou trois points de la courbe du fabricant. Trois points — la charge à débit nul, le point de fonctionnement normal et le point de débit le plus élevé — déterminent directement H₀, a et b, et suivent au plus près une courbe publiée. Deux points ajustent une parabole (b = 2) dont le sommet est à débit nul. Un seul point applique une règle courante : la charge à débit nul vaut 1,33 × la charge saisie, et le débit le plus élevé vaut 2 × le débit saisi, ce qui redonne b = 2. Une pompe sans aucun point saisi n\'ajoute aucune charge. La courbe n\'est pas coupée là où la charge atteint zéro, donc demander à une pompe plus de débit que sa courbe ne peut en fournir donne une charge négative. La solution est une pompe plus grande ou une demande plus faible, pas un ajustement de courbe différent. Une courbe peut contenir plus de trois points, et chaque point que vous avez saisi est lu.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='Aussi sur cette page';
$ec_lang['lpn_notes_4_def']='Un projet peut reposer sur un terrain réel avec une carte routière derrière lui. Les fichiers EPANET .inp peuvent être lus et écrits. Le panneau du bas dessine un profil le long d\'un trajet et liste les jonctions. Les éléments peuvent être colorés selon leurs résultats, et Rechercher repère tous les éléments répondant à une condition que vous définissez.';
$ec_lang['lpn_notes_6_term']='Aide sur les colonnes du tableau';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Sélectionner une colonne</td><td>Cliquez sur l\'en-tête</td></tr><tr><td>Ajouter ou étendre la sélection de colonnes</td><td>Ctrl+clic ou Shift+clic sur un autre en-tête</td></tr><tr><td>Déplacer (réordonner) la ou les colonnes sélectionnées</td><td>Faites glisser, ou utilisez Gérer les colonnes… dans le clic droit ou le menu ⋮</td></tr><tr><td>Menu ⋮ et flèche de tri.</td><td>Survolez le coin supérieur d\'un en-tête, ou sélectionnez-le ou tabulez jusqu\'à lui</td></tr><tr><td>Masquer, Afficher tout, ou Gérer la visibilité et l\'ordre</td><td>Clic droit sur l\'en-tête, ou menu ⋮ dans le coin supérieur droit de l\'en-tête</td></tr><tr><td>Trier par colonne</td><td>Icône flèche dans le coin supérieur droit de l\'en-tête</td></tr><tr><td>Coller comme nouvelles lignes à la fin du tableau</td><td>Clic droit, menu ⋮ dans le coin supérieur droit de l\'en-tête, ou Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Raccourcis clavier du tableau';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Touches fléchées</td><td>Naviguer.</td></tr><tr><td>Tab, Enter</td><td>Termine la saisie et se déplace d\'une cellule vers la droite ou vers le bas.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Se déplace en arrière.</td></tr><tr><td>Shift+touches fléchées</td><td>Étend la sélection.</td></tr><tr><td>Ctrl+C</td><td>Copie la sélection.</td></tr><tr><td>Ctrl+D</td><td>Remplit la sélection vers le bas depuis sa première ligne.</td></tr><tr><td>Ctrl+Enter</td><td>Remplit la sélection avec la valeur de la cellule active.</td></tr><tr><td>Ctrl+A</td><td>Sélectionne tout le tableau.</td></tr><tr><td>Ctrl+Shift+V</td><td>Colle comme nouvelles lignes à la fin du tableau.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Passe à l\'onglet suivant ou précédent, qu\'il s\'agisse d\'un tableau ou d\'un graphique.</td></tr><tr><td>Delete</td><td>Efface une cellule.</td></tr><tr><td>F2</td><td>Ouvre une cellule pour la modifier.</td></tr><tr><td>Esc</td><td>Annule une modification.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Les limites des plages de couleurs restent les mêmes';
$ec_lang['lpn_notes_color_def']='Les limites des plages de couleurs sont définies lorsque vous choisissez une méthode de classification des données. Elles ne sont pas redéfinies à chaque pas de temps, car cela ferait signifier autre chose aux couleurs à chaque pas, ce qui ne serait pas utile pour visualiser votre réseau. EPANET fonctionne de la même façon. Pour obtenir de nouvelles limites, choisissez de nouveau une méthode ou saisissez vos propres limites.';
$ec_lang['lpn_notes_epanet_term']='Les constantes de Hazen-Williams correspondent maintenant à EPANET (août 2026)';
$ec_lang['lpn_notes_epanet_def']='En août 2026, le coefficient et l\'exposant de Hazen-Williams ont été modifiés pour correspondre à EPANET. Les résultats de perte de charge diffèrent des versions précédentes de cette page de 0,1 pour cent au plus, ce qui est bien plus petit que l\'incertitude sur la valeur de C elle-même.';
$ec_lang['lpn_notes_engine_term']='Quel EPANET fait fonctionner cette page';
$ec_lang['lpn_notes_engine_def']='Le solveur EPANET de cette page est OWA-EPANET 2.3.5, publié le 20 février 2025. EPANET est développé par Open Water Analytics, une communauté qui travaille avec l\'Agence de protection de l\'environnement des États-Unis, laquelle a publié la version 2.2.0 en décembre 2019. Le rapport de calcul l\'appelle 2.3.05, car le moteur écrit le dernier nombre sur deux chiffres. Il arrive sur cette page via epanet-js 0.9.0 de Luke Butler, sous licence MIT, et il s\'exécute dans votre navigateur : votre réseau n\'est jamais envoyé où que ce soit pour être calculé.';
$ec_lang['lpn_id_invalid']='Entrez un identifiant sans espace ni guillemets.';
$ec_lang['lpn_id_taken']='Cet identifiant est déjà utilisé.';
$ec_lang['lpn_diag_no_fixed_head']='Ajoutez un réservoir ou une bâche. Le réseau a besoin d\'au moins un niveau d\'eau connu avant de pouvoir être résolu.';
$ec_lang['lpn_diag_dangling_link']='Une conduite ou une pompe se connecte à un nœud qui n\'existe plus :';
$ec_lang['lpn_diag_unreachable']='Ces nœuds n\'ont aucun chemin vers un réservoir :';
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
$ec_lang['lpn_engine_fetching']='Récupération du solveur EPANET. Il est téléchargé une fois puis conservé sur cet appareil, afin de fonctionner hors ligne ensuite.';
$ec_lang['lpn_engine_ready']='Le solveur EPANET est maintenant sur cet appareil, et fonctionne hors ligne.';
$ec_lang['lpn_engine_fetching_valve']='Récupération du solveur EPANET, afin que cette vanne puisse être résolue maintenant et hors ligne plus tard.';
$ec_lang['lpn_engine_ready_valve']='Le solveur EPANET est maintenant sur cet appareil. Les vannes qui s\'ouvrent et se ferment automatiquement fonctionneront hors ligne.';
$ec_lang['lpn_engine_unavailable']='Impossible de récupérer le solveur EPANET, qui est ce qui résout les vannes s\'ouvrant et se fermant automatiquement. Connectez-vous à internet une seule fois ; il est ensuite conservé sur cet appareil.';
$ec_lang['lpn_engine_needed_loading']='Chargement du solveur EPANET pendant que vous construisez. Les résultats seront disponibles une fois le chargement terminé.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Progression du chargement du solveur';
$ec_lang['lpn_engine_wait']='Chargement du solveur. Les résultats seront momentanément retardés. Continuez à travailler.';
$ec_lang['lpn_engine_wait_pct']='Solveur chargé à {percent} %.';
$ec_lang['lpn_engine_wait_bytes']='Solveur : {kb} Ko chargés jusqu\'à présent. Le total n\'est pas disponible, le pourcentage d\'avancement est donc inconnu.';
$ec_lang['lpn_engine_needed_failed']='Le solveur EPANET n\'a pas encore été chargé, ne peut pas être chargé, et ce réseau ne peut être résolu que par lui. Il sera chargé lorsque vous serez connecté à internet.';
$ec_lang['lpn_diag_valve_needs_epanet']='Ces vannes s\'ouvrent et se ferment d\'elles-mêmes, et seul le solveur EPANET peut les calculer. Le solveur EPANET n\'a pas pu être chargé, donc ces résultats sont manquants :';
$ec_lang['lpn_diag_valve_on_fixed_head']='Ces vannes sont raccordées directement à un réservoir ou à une bâche, qui fixe déjà le niveau d\'eau à cet endroit, donc il ne reste rien à contrôler pour la vanne. Insérez une courte conduite entre la vanne et le réservoir ou la bâche :';
$ec_lang['lpn_diag_not_converged']='Aucune solution n\'a été trouvée. Vérifiez l\'absence de valeurs impossibles, comme un diamètre nul.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Le calcul n\'a pas convergé. Ces nombres sont ceux du dernier essai, pas un résultat. Ne les utilisez pas.';
$ec_lang['lpn_diag_not_converged_trials']='Il s\'est arrêté après {iterations} essais.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Il s\'est arrêté après {iterations} essais, à une erreur relative de {error}, qui n\'a pas atteint le réglage de précision de {accuracy}.';
$ec_lang['lpn_field_roughness']='Rugosité';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='C de Hazen-Williams. Un nombre plus élevé signifie une conduite plus lisse : environ 150 pour un plastique neuf, 130 pour un acier ou une fonte neufs, et 100 pour une conduite ancienne.';
$ec_lang['lpn_field_length']='Longueur';
$ec_lang['lpn_field_from']='De';
$ec_lang['lpn_field_to']='À';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Type de vanne';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Ce que fait la vanne. Une vanne de réglage maintient une perte fixe. Les trois autres maintiennent une pression ou un débit, et s\'ouvrent complètement, se ferment, ou se ferment partiellement selon l\'évolution de l\'eau. Changer le type inscrit un nouveau nombre de départ dans le réglage ci-dessous, car une pression n\'est pas un débit, et ni l\'un ni l\'autre n\'est un coefficient de perte.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Réglage (TCV)';
$ec_lang['lpn_valve_type_prv']='Réductrice de pression (PRV)';
$ec_lang['lpn_valve_type_psv']='Stabilisatrice de pression (PSV)';
$ec_lang['lpn_valve_type_fcv']='Régulation de débit (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Brise-pression (PBV)';
$ec_lang['lpn_valve_type_gpv']='Usage général (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Perte de pression';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='La pression que la vanne supprime. Une vanne brise-pression retire toujours exactement cette pression, quel que soit le sens de circulation de l\'eau. C\'est une chute de pression à travers la vanne, pas une pression à maintenir.';
$ec_lang['lpn_inp_drop_gpv_curve']='Cette vanne désigne une courbe de perte de charge absente du fichier. La vanne a été importée sans courbe, donc elle reste entièrement ouverte jusqu\'à ce que vous lui en donniez une.';
$ec_lang['lpn_gpv_curve_source']='Courbe de perte de charge de la vanne';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='La courbe, dans la fenêtre Bibliothèques, qui indique la charge que perd cette vanne pour chaque débit. Plusieurs vannes peuvent utiliser la même courbe, et la modifier là-bas change toutes ces vannes. Cette vanne ne conserve que la référence ; les points eux-mêmes se lisent et se modifient sous Bibliothèques, Courbes.';
$ec_lang['lpn_field_valve_setting_pressure']='Consigne de pression';
$ec_lang['lpn_field_valve_setting_pressure_tip']='La pression que la vanne maintient. Une vanne réductrice de pression maintient la pression en aval à cette valeur ou en dessous. Une vanne stabilisatrice de pression maintient la pression en amont à cette valeur ou au-dessus.';
$ec_lang['lpn_field_valve_setting_flow']='Consigne de débit';
$ec_lang['lpn_field_valve_setting_flow_tip']='Le débit maximal que la vanne laisse passer. Lorsqu\'un débit inférieur à cette valeur cherche à passer, la vanne reste complètement ouverte et n\'ajoute aucune perte.';
$ec_lang['lpn_field_valve_setting']='Consigne';
$ec_lang['lpn_field_valve_setting_loss']='Coefficient de perte';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='La charge que la vanne de réglage élimine, comptée comme un multiple de la hauteur de vitesse. Utilisez 0 pour une vanne complètement ouverte. Ce nombre unique constitue toute la perte d\'une vanne de réglage.';
$ec_lang['lpn_field_valve_diameter_tip']='Largeur de l\'ouverture à travers la vanne. La vitesse de l\'eau dans la vanne est calculée à partir de cette largeur, et la perte en découle.';
$ec_lang['lpn_field_valve_km_tip']='Perte due au corps de la vanne lorsque celle-ci est complètement ouverte, en plus de ce que la consigne de la vanne élimine. Elle est comptée comme un multiple de la hauteur de vitesse. Utilisez 0 pour l\'ignorer.';
$ec_lang['lpn_field_km']='Coefficient de perte de charge singulière, k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Perte singulière, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Courbe de charge de la pompe';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='La courbe, dans la fenêtre Bibliothèques, qui indique la charge qu\'ajoute cette pompe pour chaque débit. Plusieurs pompes peuvent utiliser la même courbe, et la modifier là-bas change toutes ces pompes. Cette pompe ne conserve que la référence ; les points eux-mêmes se lisent et se modifient sous Bibliothèques, Courbes.';
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
$ec_lang['lpn_field_desc']='Description';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Balise';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Une balise peut porter le sens que vous voulez, comme une zone de pression ou un ordre de travail. Aucun calcul, ici ou dans EPANET, ne la lit. Une balise est un seul mot : EPANET arrête la lecture au premier espace, donc un espace est refusé pendant la saisie. Elle est importée et exportée avec le fichier EPANET.';
$ec_lang['lpn_pump_effic_curve']='Courbe de rendement de la pompe';
$ec_lang['lpn_pump_effic_curve_tip']='La courbe, dans la fenêtre Bibliothèques, qui indique le rendement de cette pompe pour chaque débit. Plusieurs pompes peuvent utiliser la même courbe, et la modifier là-bas change toutes ces pompes. Cette pompe ne conserve que la référence ; les points eux-mêmes se lisent et se modifient sous Bibliothèques, Courbes.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Aucune courbe sélectionnée';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Courbes';
$ec_lang['lpn_curve_library_link_tip']='Ouvre la fenêtre Bibliothèques sur sa section Courbes, où une courbe est ajoutée, décrite, modifiée et supprimée. Un élément indique la courbe qu\'il utilise.';
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
$ec_lang['lpn_curve_kind_head']='Charge de pompe';
$ec_lang['lpn_curve_kind_effic']='Rendement de pompe';
$ec_lang['lpn_curve_kind_volume']='Volume de bâche';
$ec_lang['lpn_curve_kind_headloss']='Perte de charge de vanne';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Type non indiqué';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Vol.';
$ec_lang['lpn_pump_effic_col']='Rendement';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Cette pompe n\'a pas de courbe de rendement sélectionnée, elle fonctionne donc au rendement fixé pour tout le réseau, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Cette pompe indique une courbe de rendement appelée {name}, que rien dans ce projet ne définit, elle fonctionne donc au rendement fixé pour tout le réseau, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Mode : Sélectionner. Cliquez sur un élément ou une étiquette pour le voir ou le modifier. Faites glisser pour déplacer un nœud, un sommet ou une étiquette. Utilisez l\'outil Sommets pour ajouter ou retirer les coudes d\'une conduite.';
$ec_lang['lpn_mode_delete']='Mode : Supprimer. Cliquez sur un élément pour le retirer.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Mode : Sommets. Les sommets de chaque conduite sont représentés par de petites poignées carrées. Cliquez sur une conduite pour ajouter un sommet, cliquez sur une poignée pour la retirer, ou faites-la glisser pour la déplacer. Rien d\'autre sur la carte n\'est modifié dans ce mode.';
$ec_lang['lpn_mode_zoom_window']='Mode : Fenêtre de zoom. Cliquez sur deux coins opposés d\'un rectangle, ou faites-en glisser un, sur la carte pour zoomer dessus.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Rien n\'est sélectionné. Cliquez d\'abord sur un élément de la carte, puis appuyez sur Supprimer.';
$ec_lang['lpn_mode_add_junction']='Mode : Ajouter une jonction. Cliquez sur la carte pour placer une jonction. Passez en mode Sélectionner pour modifier ou déplacer des éléments et des étiquettes.';
$ec_lang['lpn_mode_add_reservoir']='Mode : Ajouter un réservoir. Cliquez sur la carte pour placer un réservoir. Passez en mode Sélectionner pour modifier ou déplacer des éléments et des étiquettes.';
$ec_lang['lpn_mode_add_tank']='Mode : Ajouter une bâche. Cliquez sur la carte pour placer une bâche. Passez en mode Sélectionner pour modifier ou déplacer des éléments et des étiquettes.';
$ec_lang['lpn_mode_add_pipe']='Mode : Ajouter une conduite. Cliquez sur un nœud, puis sur un autre nœud, pour les relier. Cliquez dans un espace vide entre les deux pour courber la ligne, ou appuyez sur Échap pour recommencer. Passez en mode Sélectionner pour modifier ou déplacer des éléments et des étiquettes.';
$ec_lang['lpn_mode_add_pump']='Mode : Ajouter une pompe. Cliquez sur un nœud, puis sur un autre nœud, pour les relier. Cliquez dans un espace vide entre les deux pour courber la ligne, ou appuyez sur Échap pour recommencer. Passez en mode Sélectionner pour modifier ou déplacer des éléments et des étiquettes.';
$ec_lang['lpn_mode_add_valve']='Mode : Ajouter une vanne. Cliquez sur un nœud, puis sur un autre nœud, pour les relier. Cliquez dans un espace vide entre les deux pour courber la ligne, ou appuyez sur Échap pour recommencer. Passez en mode Sélectionner pour modifier ou déplacer des éléments et des étiquettes.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Mode : Ajouter du texte. Cliquez sur la carte pour placer un Texte. Cliquez près d\'un nœud pour attacher le Texte à ce nœud. Passez en mode Sélectionner pour modifier ou déplacer des éléments et des étiquettes.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Utilisez ce mode pour modifier, déplacer et faire glisser des éléments sur la carte. C\'est le mode auquel la page revient par défaut : elle y revient d\'elle-même après certaines actions, comme l\'ouverture d\'un projet, et [Échap] vous y ramène depuis n\'importe quel autre mode.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Auto';
$ec_lang['lpn_method_switch_confirm']='Changer la méthode de frottement ne modifie pas les valeurs de rugosité déjà saisies sur vos conduites, et une rugosité pour une méthode n\'a aucun sens pour une autre. Vérifiez chaque conduite après ce changement. Continuer quand même ?';
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
$ec_lang['lpn_field_closed']='Fermée';
$ec_lang['lpn_field_closed_tip']='Ferme cette conduite pour qu\'aucune eau ne puisse y passer. La conduite reste sur le dessin et conserve toutes ses valeurs, et vous pouvez la rouvrir à tout moment.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Longitude';
$ec_lang['lpn_field_lat']='Latitude';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Nord';
$ec_lang['lpn_field_easting']='Est';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='N';
$ec_lang['lpn_field_easting_abbr']='E';
$ec_lang['lpn_field_lat_abbr']='Lat';
$ec_lang['lpn_field_lon_abbr']='Long';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.


// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Saisissez une position en coordonnées pour placer ce nœud exactement. Dans un scénario, cette position ne s\'applique qu\'à ce scénario, tout comme le fait de le faire glisser ; dans Base, elle place le nœud partout.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Ceci est hors de la carte. En pseudo-Mercator, la latitude va de -85,05 à 85,05 et la longitude de -180 à 180.';
$ec_lang['lpn_field_text_size']='Facteur de taille';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Afficher à tous les niveaux de zoom';
$ec_lang['lpn_field_text_all_zoom_tip']='Garde ce texte sur le dessin quel que soit le niveau de zoom arrière. Décochez-le et le texte se masque avec les autres étiquettes dès que la vue est plus large que le seuil d\'affichage des étiquettes défini sous Carte et page.';
$ec_lang['lpn_tool_labels']='Étiquettes';
$ec_lang['lpn_labels_heading_node']='Étiquettes des nœuds';
$ec_lang['lpn_labels_heading_link']='Étiquettes des liaisons';
$ec_lang['lpn_labels_mark_extrema']='Repérer les valeurs les plus hautes et les plus basses';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Marque la valeur la plus élevée de chaque propriété étiquetée sur la carte d\'un trait au-dessus (une surlignure), et la plus faible d\'un trait en dessous (un soulignement).';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Appliquer à tous';
$ec_lang['lpn_settings_apply_to_all_tip']='Chaque élément de ce type déjà dessiné reçoit un identifiant commençant par ce texte. Chacun conserve son numéro. Un identifiant qui ne se termine pas par un nombre est laissé tel quel.';
$ec_lang['lpn_confirm_apply_prefix']='Renommer {n} éléments pour que leurs identifiants commencent par {prefix} ? Chacun conserve son numéro.';
$ec_lang['lpn_prefix_applied']='{n} éléments renommés. {skipped} autres ont été laissés tels quels.';
$ec_lang['lpn_labels_suffix_gradient_tip']='Texte ajouté après le gradient de perte de charge sur les étiquettes de la carte. Ne saisissez pas de signe pourcentage ici. Il est ajouté automatiquement lorsque l\'unité est le pourcentage.';
$ec_lang['lpn_labels_separator']='Texte entre les valeurs';
$ec_lang['lpn_labels_separator_tip']='Texte entre une propriété et la suivante sur une étiquette. Un espace par défaut.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Priorité';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='L\'ordre dans lequel les valeurs sont abandonnées lorsque deux étiquettes de nœuds se chevaucheraient. La valeur numérotée 1 est abandonnée en premier. Lorsqu\'il ne reste plus qu\'une seule valeur et que les étiquettes se chevauchent encore, une étiquette entière est masquée : celle dont la demande est la plus faible, dont la pression est la plus proche du milieu de la plage, ou dont la cote ou la charge est la plus proche numériquement de celles des nœuds voisins.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Avant';
$ec_lang['lpn_labels_col_after']='Après';
$ec_lang['lpn_labels_col_decimals']='Décimales';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Afficher';
$ec_lang['lpn_labels_show_tip']='L\'ordre dans lequel les valeurs apparaissent sur une étiquette. La valeur numérotée 1 vient en premier : en haut d\'une étiquette empilée, et au début d\'une étiquette sur une seule ligne.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Utiliser les unités';
$ec_lang['lpn_labels_use_units_tip']='Cochez pour afficher l\'unité dans la case Après et sur l\'étiquette, et pour la maintenir à jour lorsque les unités changent. Décochez pour saisir votre propre texte dans Après.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='État initial';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Couleurs des nœuds';
$ec_lang['lpn_settings_sym_link_colors']='Couleurs des liaisons';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Image de fond...';
$ec_lang['lpn_backdrop_add']='Ajouter';
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
$ec_lang['lpn_backdrop_scale']='Échelle par pointage';
$ec_lang['lpn_backdrop_scale_entry']='Échelle par fichier de géoréférencement ou taille de pixel';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Mettre à l\'échelle depuis la taille actuelle, autour d\'un point choisi';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Cliquez sur le point de l\'image de fond qui doit rester à sa place.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Mettre à l\'échelle depuis sa taille actuelle. 1 la garde identique, 1,1 l\'agrandit de 10 %, 0,9 la réduit de 10 %.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Indiquez la taille d\'un pixel sur la carte, ou collez le contenu complet du fichier de géoréférencement de l\'image';
$ec_lang['lpn_backdrop_scale_entry_bad']='Saisissez un nombre pour la taille d\'un pixel sur la carte, ou collez les six lignes d\'un fichier de géoréférencement.';
$ec_lang['lpn_backdrop_wld_bad']='Ce fichier de géoréférencement fait pivoter, inverse ou déforme l\'image de façon inégale. La carte ne peut que déplacer une image et la redimensionner de façon identique dans les deux directions ; le fichier n\'a donc pas été utilisé.';
$ec_lang['lpn_backdrop_unreadable']='Votre navigateur web ne peut pas afficher cette image. Enregistrez-la au format PNG ou JPEG, puis ajoutez-la de nouveau.';
$ec_lang['lpn_backdrop_position']='Déplacer';
$ec_lang['lpn_backdrop_remove']='Retirer';
$ec_lang['lpn_backdrop_remove_confirm']='Retirer l\'image de fond ?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Carte du monde…';
$ec_lang['lpn_map_attach_tip']='Attache la carte du monde à ce projet sans le modifier autrement.';
$ec_lang['lpn_map_attach_add']='Attacher';
$ec_lang['lpn_map_attach_readjust']='Réajuster';
$ec_lang['lpn_map_attach_readjust_tip']='Retourne à l\'étape 2 du processus d\'attachement de la carte.';
$ec_lang['lpn_map_attach_scale_from']='Mettre à l\'échelle depuis la taille actuelle…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Met la carte à l\'échelle depuis sa taille actuelle, autour du milieu de votre dessin. 1 la laisse inchangée, 1,1 l\'agrandit de 10 %, 0,9 la réduit de 10 %.';
$ec_lang['lpn_map_attach_scale_from_bad']='Saisissez un seul nombre supérieur à zéro.';
$ec_lang['lpn_map_attach_scale_from_done']='La carte est redimensionnée, et votre dessin ainsi que chacune de ses coordonnées restent exactement ce qu\'ils étaient.';
$ec_lang['lpn_map_attach_none']='Aucune carte du monde n\'est encore attachée à ce projet. Utilisez d\'abord Carte, Carte du monde, Attacher.';
$ec_lang['lpn_map_attach_remove']='Détacher';
$ec_lang['lpn_map_attach_remove_tip']='Retire la carte du monde. Le dessin et ses coordonnées restent inchangés dans tous les cas.';
$ec_lang['lpn_map_attach_done']='La carte du monde est maintenant derrière votre dessin, et votre projet est inchangé. Utilisez Carte, Carte du monde, Détacher pour la retirer à nouveau.';
$ec_lang['lpn_map_attach_removed']='La carte du monde a disparu, et le dessin est exactement ce qu\'il était.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Votre dessin se trouve sur une carte du monde entier, dans l\'océan, à la latitude zéro et à la longitude zéro. Repérez d\'abord votre propre emplacement : déplacez et zoomez la carte derrière le dessin, recherchez un nom de lieu, ou saisissez une latitude et une longitude. Le dessin lui-même ne bouge pas.';
$ec_lang['lpn_mapgeo_step1']='Étape 1 sur 2 : repérer votre emplacement dans le monde';
$ec_lang['lpn_mapgeo_step2']='Étape 2 sur 2 : ajuster la carte derrière votre dessin';
$ec_lang['lpn_mapgeo_hint1']='Déplacez et zoomez la carte derrière votre dessin, ou recherchez un lieu, ou saisissez une latitude et une longitude. Puis appuyez sur Placer approximativement.';
$ec_lang['lpn_mapgeo_readjust_intro']='Votre dessin est à l\'endroit où vous l\'avez placé la dernière fois. Pour le déplacer ailleurs, déplacez et zoomez la carte derrière le dessin, recherchez un nom de lieu, ou saisissez une latitude et une longitude. Le dessin lui-même ne bouge pas.';
$ec_lang['lpn_mapgeo_hint2']='Faites glisser n\'importe où pour faire coulisser la carte sous votre dessin. Votre dessin et chacune de ses coordonnées restent exactement où ils sont. Appuyez sur Géoréférencer ici quand la carte convient.';
$ec_lang['lpn_mapgeo_gestures']='Le zoom déplace votre dessin et la carte ensemble, afin que vous puissiez voir à quel point ils s\'alignent. Faire glisser ne déplace que la carte.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Faire pivoter la carte';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} degrés';
$ec_lang['lpn_mapgeo_dial_size']='Taille de la carte';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} fois';
$ec_lang['lpn_mapgeo_dial_help']='Faites glisser les deux curseurs, ou saisissez une valeur dans les cases au-dessus, pour agrandir ou réduire la carte et la faire pivoter. Le milieu de chaque curseur correspond à l\'ajustement obtenu à l\'étape 1, sans modification : 1 et 0 signifient donc « ne rien changer ». Les touches fléchées fonctionnent sur les deux.';
$ec_lang['lpn_mapgeo_place']='Placer approximativement';
$ec_lang['lpn_mapgeo_finish']='Géoréférencer ici';
$ec_lang['lpn_mapgeo_cancelled']='La carte du monde est revenue à sa place, et votre dessin n\'a jamais bougé.';
$ec_lang['lpn_mapgeo_locked']='Terminez avec le bouton Géoréférencer ici, ou appuyez sur Annuler, avant de changer de projet ou d\'enregistrer. Le placement de la carte du monde n\'est pas terminé.';
$ec_lang['lpn_backdrop_scale_prompt1']='Cliquez sur deux points de l\'image de fond, par exemple les deux extrémités d\'une échelle graphique. Puis saisissez la distance réelle entre eux.';
$ec_lang['lpn_backdrop_scale_prompt2']='Distance réelle entre les deux points';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Cliquez sur le point de base (sur l\'image) pour le déplacement.';
$ec_lang['lpn_backdrop_position_prompt2']='Choisissez la méthode du point de destination, puis cliquez sur Continuer.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Ajustement de l\'image de fond.';
$ec_lang['lpn_backdrop_target_label']='Le déplacer vers :';
$ec_lang['lpn_backdrop_target_node']='Un nœud';
$ec_lang['lpn_backdrop_target_free']='N\'importe quel point de la carte';
$ec_lang['lpn_backdrop_target_coords']='Coordonnées saisies';
$ec_lang['lpn_backdrop_coords_prompt']='Saisissez les X,Y vers lesquels ce point doit se déplacer';
$ec_lang['lpn_backdrop_continue']='Continuer';
$ec_lang['lpn_tool_settings']='Paramètres';
$ec_lang['lpn_settings_show_titles']='Afficher les titres de page';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Masquer ces titres';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Afficher l\'aide de sélection';
$ec_lang['lpn_settings_area_hint_tip']='Affiche la bulle au-dessus de la carte qui indique ce que fera votre prochain clic pendant que vous sélectionnez une zone.';
$ec_lang['lpn_settings_id_prefixes']='Préfixes d\'identifiant';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Valeurs de création';
$ec_lang['lpn_settings_defaults_note']='Utilisé pour les éléments que vous créez à partir de maintenant. Les éléments existants ne sont pas modifiés.';
$ec_lang['lpn_settings_push_note']='Seules les propriétés dont les étiquettes sont actuellement affichées sont appliquées.';
$ec_lang['lpn_settings_push_btn']='Appliquer ces valeurs pour nouveaux éléments à tous les éléments existants';
$ec_lang['lpn_push_confirm']='Remplacer ces propriétés sur tous les éléments existants par les valeurs actuellement définies pour les nouveaux éléments ? Les valeurs que vous avez saisies seront écrasées. Vous pouvez annuler cette action.';
$ec_lang['lpn_push_properties']='Propriétés :';
$ec_lang['lpn_push_assets']='Nœuds et conduites :';
$ec_lang['lpn_push_none_displayed']='Aucune valeur initiale n\'est actuellement affichée comme étiquette, donc il n\'y a rien à appliquer. Activez les étiquettes des propriétés voulues dans le panneau Étiquettes, puis réessayez.';
$ec_lang['lpn_push_nothing']='Aucun élément existant ne possède l\'une des propriétés appliquées.';
$ec_lang['lpn_push_no_change']='Tous les éléments ont déjà ces valeurs ; rien ne changerait donc.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Propriétés personnalisées';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Des propriétés que vous définissez vous-même pour vos propres besoins. Elles sont enregistrées avec le projet et les scénarios comme toutes les autres propriétés.';
$ec_lang['lpn_cp_design']='Conception';
$ec_lang['lpn_cp_design_tip']='Une ligne par propriété personnalisée ; chacune s\'ouvre pour afficher : Clé, Libellé, S\'applique à, Valider comme, Autoriser ou restreindre, le champ de caractères nommé par ce choix, Limite inférieure de longueur, Limite supérieure de longueur, Limite basse, Limite haute.';
$ec_lang['lpn_cp_add']='Ajouter une propriété personnalisée';
$ec_lang['lpn_cp_add_tip']='Ajoute une ligne au tableau de conception et l\'ouvre pour modification.';
$ec_lang['lpn_cp_remove_tip']='Supprime cette propriété du tableau de conception. Les valeurs déjà saisies sur vos éléments sont conservées dans le fichier et reviennent si vous concevez de nouveau la même clé.';
$ec_lang['lpn_cp_none']='Aucune propriété personnalisée n\'est encore conçue.';
$ec_lang['lpn_cp_unnamed']='Pas encore nommée';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Clé';
$ec_lang['lpn_cp_key_tip']='Clé : une propriété est enregistrée sous ce nom. Les espaces ne sont pas autorisés, et un préfixe est ajouté automatiquement pour que votre clé ne puisse jamais entrer en collision avec un champ intégré.';
$ec_lang['lpn_cp_label']='Libellé';
$ec_lang['lpn_cp_label_tip']='Libellé : c\'est ce qu\'un lecteur voit dans la boîte de propriétés, dans Rechercher et en tête d\'une colonne de tableau.';
$ec_lang['lpn_cp_applies']='S\'applique à';
$ec_lang['lpn_cp_applies_tip']='S\'applique à : liste de préfixes d\'identifiant séparés par des virgules pour les éléments qui utilisent cette propriété, par exemple J,L,R.';
$ec_lang['lpn_cp_validate']='Valider comme';
$ec_lang['lpn_cp_validate_tip']='Valider comme : indique à quoi ressemble une valeur correcte. Les règles de casse ne lisent que l\'alphabet anglais, ce qui est une limite assumée. Choisissez Ne pas valider pour tout accepter.';
$ec_lang['lpn_cp_restrict']='Restreindre ces caractères';
$ec_lang['lpn_cp_restrict_tip']='Restreindre ces caractères : une valeur ne peut utiliser que les caractères listés ici, ou aucun d\'eux, où « @ » signifie n\'importe quelle lettre ; « # » signifie n\'importe quel chiffre, et vous devez lister séparément « - », « . » et « , » s\'ils sont autorisés ; et tout caractère d\'espacement doit se trouver entre d\'autres caractères.';
$ec_lang['lpn_cp_restrict_mode']='Autoriser ou restreindre';
$ec_lang['lpn_cp_restrict_mode_tip']='Autoriser ou restreindre : les caractères indiqués sont soit les seuls qu\'une valeur puisse utiliser, soit ceux qu\'elle ne peut pas utiliser.';
$ec_lang['lpn_cp_restrict_allow']='Autoriser uniquement ces caractères';
$ec_lang['lpn_cp_minlength']='Limite inférieure de longueur';
$ec_lang['lpn_cp_minlength_tip']='Limite inférieure de longueur : toute saisie plus courte est signalée, ce qui permet de repérer les entrées vides ou incomplètes.';
$ec_lang['lpn_cp_length']='Limite supérieure de longueur';
$ec_lang['lpn_cp_length_tip']='Limite supérieure de longueur : toute saisie plus longue est signalée.';
$ec_lang['lpn_cp_low']='Limite basse';
$ec_lang['lpn_cp_low_tip']='Limite basse : c\'est la plus petite valeur attendue. Les nombres sont comparés en tant que nombres et le texte dans l\'ordre alphabétique.';
$ec_lang['lpn_cp_high']='Limite haute';
$ec_lang['lpn_cp_high_tip']='Limite haute : c\'est la plus grande valeur attendue. Les nombres sont comparés en tant que nombres et le texte dans l\'ordre alphabétique.';
$ec_lang['lpn_cp_val_none']='Ne pas valider';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Nombre .';
$ec_lang['lpn_cp_val_number_comma']='Nombre ,';
$ec_lang['lpn_cp_val_integer']='Entier';
$ec_lang['lpn_cp_val_upper']='MAJUSCULES';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label} : {reason} La valeur est conservée exactement telle que vous l\'avez saisie.';
$ec_lang['lpn_cp_bad_number']='Cette valeur n\'est pas un nombre, comme l\'exige cette propriété.';
$ec_lang['lpn_cp_bad_integer']='Cette valeur n\'est pas un nombre entier, comme l\'exige cette propriété.';
$ec_lang['lpn_cp_bad_case']='Cette valeur n\'est pas en MAJUSCULES, comme l\'exige cette propriété.';
$ec_lang['lpn_cp_bad_chars']='Cette valeur utilise un caractère que cette propriété n\'autorise pas.';
$ec_lang['lpn_cp_bad_space']='Les espaces ne sont autorisés qu\'entre d\'autres caractères.';
$ec_lang['lpn_cp_bad_minlength']='Cette valeur est plus courte que ce que cette propriété autorise.';
$ec_lang['lpn_cp_bad_length']='Cette valeur est plus longue que ce que cette propriété autorise.';
$ec_lang['lpn_cp_bad_low']='Cette valeur est inférieure à la limite basse de cette propriété.';
$ec_lang['lpn_cp_bad_high']='Cette valeur est supérieure à la limite haute de cette propriété.';
$ec_lang['lpn_cp_key_needed']='Donnez à cette propriété personnalisée une clé sans espaces.';
$ec_lang['lpn_cp_key_taken']='Une autre propriété personnalisée utilise déjà cette clé.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Scénario';
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
$ec_lang['lpn_scenario_overrides']='Nb de valeurs personnalisées';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='L\'anneau ambré signifie que cet élément porte une valeur qui appartient uniquement au scénario {name}.';
$ec_lang['lpn_scenario_overrides_tip']='Chacune de ces valeurs est marquée sur la carte par un anneau ambré. Passez à {base} pour voir le dessin sans elles.';
$ec_lang['lpn_scenario_menu']='Scénarios';
$ec_lang['lpn_scenario_tip']='L\'ensemble de valeurs que le dessin affiche et que la page résout en ce moment. Cliquez pour changer de scénario, ou pour en ajouter, renommer ou supprimer un.';
$ec_lang['lpn_scenario_new']='Nouveau scénario…';
$ec_lang['lpn_scenario_new_name']='Scénario {n}';
$ec_lang['lpn_scenario_prompt_name']='Nom de ce scénario';
$ec_lang['lpn_scenario_rename']='Renommer le scénario…';
$ec_lang['lpn_scenario_delete']='Supprimer le scénario';
$ec_lang['lpn_scenario_delete_confirm']='Supprimer le scénario {name}, ainsi que les {n} valeurs qui n\'appartiennent qu\'à lui ? Le dessin lui-même n\'est pas modifié.';
$ec_lang['lpn_scenario_override']='Uniquement pour ce scénario';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Cochée, cette valeur appartient uniquement à ce scénario, même si elle est identique à celle de Base. Décochez la case pour utiliser de nouveau la valeur de Base.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Scénario de base : {value}';
$ec_lang['lpn_scenario_deactivated']='{id} est hors réseau dans {scenario}. Il reste dans le dessin, et dans vos autres scénarios.';
$ec_lang['lpn_scenario_push_btn']='Appliquer les valeurs de Base à tous les scénarios';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Chaque scénario revient à la valeur de Base pour les propriétés dont les étiquettes sont actuellement affichées. Les valeurs qui appartiennent uniquement à ces scénarios sont abandonnées.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Faire revenir tous les scénarios aux valeurs de Base pour ces propriétés ? Les valeurs qui leur appartiennent uniquement sont abandonnées. Vous pouvez annuler cette action.';
$ec_lang['lpn_scenario_push_scenarios']='Scénarios concernés :';
$ec_lang['lpn_scenario_push_values']='Valeurs abandonnées :';
$ec_lang['lpn_scenario_push_none']='Aucun scénario n\'a de valeur qui lui appartient pour l\'une de ces propriétés, donc rien ne changerait. Rien n\'est abandonné.';
$ec_lang['lpn_scenario_preset_flow_static']='1. Test de débit : statique';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Étalonnage du test de débit pour un réseau de conception à débit nul. Dans ce scénario, réglez la demande de toutes les jonctions à 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Test de débit : intermédiaire';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Étalonnage du test de débit pour un réseau de conception au premier débit relevé. Dans ce scénario, réglez la demande de la jonction qui débite au premier débit mesuré, et la demande de toutes les autres jonctions à 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Test de débit : maximal';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Étalonnage du test de débit pour un réseau de conception au débit maximal relevé. Dans ce scénario, réglez la demande de la jonction qui débite au débit maximal mesuré, et la demande de toutes les autres jonctions à 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Jour moyen';
$ec_lang['lpn_scenario_preset_average_day_tip']='Multiplicateur de demande 1 : chaque demande telle que saisie, considérée comme la demande du jour moyen.';
$ec_lang['lpn_scenario_preset_max_day']='5. Jour de pointe';
$ec_lang['lpn_scenario_preset_max_day_tip']='Multiplicateur de demande de 2,0 fois le jour moyen, une valeur provisoire. La plupart des réseaux se situent entre 1,2 et 3,0 (National Research Council, 2006). Réglez celle de votre réseau dans Paramètres, Calcul, Hydraulique, Multiplicateur de demande.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Heure de pointe';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='Multiplicateur de demande de 3,0 fois le jour moyen, une valeur provisoire. La plupart des réseaux se situent entre 3,0 et 6,0 (National Research Council, 2006). Réglez celle de votre réseau dans Paramètres, Calcul, Hydraulique, Multiplicateur de demande.';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. Incendie plus jour de pointe';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='Demande du jour de pointe (multiplicateur 2,0). Lancez l\'analyse du débit d\'incendie dans ce scénario : elle ajoute le débit d\'incendie à chaque jonction en plus de cette demande.';
$ec_lang['lpn_delete_drops_overrides']='Supprimer cet élément efface aussi {n} valeurs que vos scénarios détiennent pour lui. Continuer ?';
$ec_lang['lpn_push_base_only']='Cette action modifie le dessin lui-même, elle ne peut donc être effectuée que dans {base}. Passez à {base} et réessayez.';
$ec_lang['lpn_field_active']='Fait partie du réseau';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Décochez cette case pour laisser l\'élément sur le dessin mais hors du réseau : il est dessiné en gris et le solveur l\'ignore. Dans un scénario, c\'est ainsi qu\'une conduite proposée est activée ou désactivée.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Exposant de l\'émetteur';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='L\'exposant de l\'équation d\'émetteur d\'EPANET pour les asperseurs et les fuites : débit = coefficient x pression élevée à cet exposant. Il ne change le résultat que là où un nœud possède un émetteur, ce qui, pour l\'instant, signifie un réseau lu depuis un fichier EPANET.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Lire le MNT';
$ec_lang['lpn_elev_dem_sample_tip']='Lit la cote du MNT à ce nœud et l\'affiche ci-dessous. Rien n\'est modifié dans la case Cote. La résolution horizontale du MNT est d\'environ 30 m sur la majeure partie de la Terre, et plus fine là où de meilleures données existent.';
$ec_lang['lpn_elev_dem_use']='Utiliser le MNT';
$ec_lang['lpn_elev_dem_use_tip']='Place la cote du MNT à ce nœud dans la case Cote ci-dessus, en remplaçant ce qui s\'y trouve. Il lit d\'abord le MNT s\'il ne l\'a pas encore été. Un seul Annuler la rétablit.';
$ec_lang['lpn_elev_dem_none']='Le MNT n\'a pas de cote pour ce nœud.';
$ec_lang['lpn_elev_dem_said']='Le MNT Mapbox indique {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Source de la cote';
$ec_lang['lpn_settings_elev_source_tip']='D\'où un nouveau nœud tire sa cote. La surface du sol est lue depuis le MNT Mapbox, qui a une résolution d\'environ 30 m sur la majeure partie de la Terre, et plus fine là où de meilleures données existent.';
$ec_lang['lpn_settings_elev_source_typed']='La cote saisie ci-dessus';
$ec_lang['lpn_settings_elev_source_dem']='MNT Mapbox';
$ec_lang['lpn_settings_accuracy']='Précision';
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
$ec_lang['lpn_settings_default_is']='La valeur par défaut est {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='À quel point le solveur doit s\'approcher avant de s\'arrêter, mesuré par l\'ampleur du changement des débits d\'un essai à l\'autre. Un nombre plus petit est plus exact et prend plus de temps. Les deux solveurs lisent cette même case, mais chacun mesure ce changement par rapport à un total différent : le solveur intégré par rapport à la somme des demandes, EPANET par rapport à la somme des débits des liaisons. Laissée vide, cette page utilise une précision plus stricte que celle par défaut d\'EPANET.';
$ec_lang['lpn_settings_specific_gravity']='Densité';
$ec_lang['lpn_settings_viscosity']='Viscosité relative';
$ec_lang['lpn_settings_viscosity_tip']='La viscosité du fluide comparée à celle de l\'eau à 20 degrés Celsius. Elle ne change le résultat qu\'avec la méthode de Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Essais maximum';
$ec_lang['lpn_settings_trials_tip']='Combien d\'essais sont autorisés avant que le solveur abandonne un réseau qui ne converge pas.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='En cas de non-convergence';
$ec_lang['lpn_settings_unbalanced_tip']='Que faire d\'un réseau qui a épuisé ses essais sans avoir convergé. Autoriser des essais supplémentaires atteint souvent la convergence. S\'arrêter rapporte le dernier essai tel quel, ce qui n\'est pas une solution. Seul le solveur EPANET lit cette case. Le solveur intégré s\'arrête toujours et marque le résultat comme non convergé.';
$ec_lang['lpn_settings_unbalanced_continue']='Autoriser des essais supplémentaires';
$ec_lang['lpn_settings_unbalanced_stop']='S\'arrêter et rapporter le dernier essai';
$ec_lang['lpn_settings_unbalanced_trials']='Essais supplémentaires avant de rapporter';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Combien d\'essais supplémentaires autoriser une fois le maximum ci-dessus épuisé, avant que le dernier essai ne soit rapporté. Seul le solveur EPANET lit cette case.';
$ec_lang['lpn_settings_head_error']='Limite d\'erreur de charge';
$ec_lang['lpn_settings_head_error_tip']='Un test supplémentaire que le solveur doit passer avant de s\'arrêter : la plus grande erreur de charge restant dans une conduite quelconque. Zéro signifie ne pas appliquer ce test. Seul le solveur EPANET lit cette case.';
$ec_lang['lpn_settings_flow_change']='Limite de variation de débit';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Un test supplémentaire que le solveur doit passer avant de s\'arrêter : la variation maximale du débit d\'une conduite quelconque d\'un essai à l\'autre. Zéro signifie ne pas appliquer ce test. Seul le solveur EPANET lit cette case.';
$ec_lang['lpn_settings_damp_limit']='L\'amortissement commence à';
$ec_lang['lpn_settings_damp_limit_tip']='La précision à partir de laquelle le solveur commence à prendre des pas plus petits, ce qui peut aider un réseau oscillant à converger. Zéro signifie que le solveur n\'amortit jamais. Seul le solveur EPANET lit cette case.';
$ec_lang['lpn_settings_option_unset']='Non indiqué';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Un facteur unique appliqué à toutes les demandes du réseau à la fois. Utilisez-le pour savoir ce que fait le réseau à un usage plus ou moins important qu\'aujourd\'hui. Il ne change pas les nombres que vous avez saisis. Un scénario peut porter le sien, si bien que jour moyen, jour maximal et heure de pointe sont chacun un seul nombre ; laissez-le vide dans un scénario pour utiliser celui du projet.';
$ec_lang['lpn_settings_engine_native']='Résoudre avec le solveur EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='Activez cette option pour utiliser le solveur intégré partout où c\'est possible. Sinon, le solveur EPANET de l\'agence américaine de protection de l\'environnement (EPA) est toujours utilisé. Le solveur intégré n\'est pas utilisé pour les simulations en période prolongée ni pour une vanne PRV, PSV ou FCV active. La première fois que le solveur EPANET est utilisé, environ 650 Ko sont téléchargés puis conservés sur cet appareil. Là où une conduite porte une perte de charge singulière (locale), les deux solveurs diffèrent dans les derniers chiffres : EPANET arrondit la valeur qu\'il utilise pour la gravité, ce qui fait ressortir ses pertes de charge singulières très légèrement plus faibles que la forme exacte.';
$ec_lang['lpn_engine_loading']='Chargement du solveur EPANET…';
$ec_lang['lpn_engine_failed']='Le solveur EPANET n\'a pas pu être chargé. Le solveur intégré est utilisé à la place.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Résolu avec le solveur EPANET, car ces vannes s\'ouvrent et se ferment d\'elles-mêmes :';
$ec_lang['lpn_unit_unknown']='Ce dessin indique une unité que cette page ne propose pas : {unit}. Tout est conservé et affiché exactement comme reçu, et rien n\'a été modifié. Aucun résultat ne peut être donné tant que cette page ne connaît pas cette unité, car elle ne sait pas quelle est la grandeur de cette unité.';
$ec_lang['lpn_engine_manning_note']='Remarque : avec la rugosité de Manning, EPANET arrondit la constante de l\'équation de Manning, ce qui donne une perte de charge environ 0,6 % plus faible que la forme exacte.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='Le solveur EPANET a refusé ce réseau, il n\'a donc pas été calculé.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='Le solveur EPANET a répondu : {message}';
$ec_lang['lpn_engine_refused_fallback']='Les nombres affichés proviennent du solveur intégré à la place.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Les nombres affichés proviennent du solveur intégré à la place. Celui-ci calcule un instant à la fois ; il ne s\'agit donc du réseau qu\'à {time}, chaque bâche étant encore à son niveau de départ.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Ces contrôles désignent un élément qui n\'est plus dans ce projet, ils ont donc été laissés de côté : {ids}';
$ec_lang['lpn_control_unreadable_note']='Ces contrôles n\'ont pas pu être lus, ils ont donc été laissés de côté : {ids}';
$ec_lang['lpn_rule_dangling_note']='Ces règles se réfèrent à un élément qui ne fait plus partie de ce projet, elles ont donc été ignorées pour ce calcul : {ids}';
$ec_lang['lpn_rule_unreadable_note']='Ces règles n\'ont pas pu être lues, elles ont donc été ignorées pour ce calcul : {ids}';
$ec_lang['lpn_settings_text_size']='Taille du texte (pixels)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Taille des symboles (pixels)';
$ec_lang['lpn_settings_link_width']='Épaisseur des conduites (pixels)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Flèches de sens d\'écoulement';
$ec_lang['lpn_settings_show_arrows_tip']='Dessine une flèche sur chaque conduite indiquant le sens de circulation de l\'eau. Les flèches apparaissent après un calcul, et les désactiver laisse les résultats inchangés. Ce réglage est enregistré avec le projet.';
$ec_lang['lpn_settings_align_labels']='Aligner les étiquettes de conduites sur les conduites';
$ec_lang['lpn_settings_readability_bias']='Retourner une étiquette à l\'envers lorsqu\'elle penche de plus de ce nombre de degrés à gauche de la verticale';
$ec_lang['lpn_settings_readability_bias_tip']='Retourne une étiquette pour la garder à l\'endroit lorsqu\'elle penche de plus de ce nombre de degrés à gauche de la verticale.';
$ec_lang['lpn_settings_mask_labels']='Fond opaque derrière les étiquettes';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Aligner les lignes de rappel sur des angles fixes';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Afficher les étiquettes lorsque la carte est zoomée à cette largeur ou moins';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Les étiquettes ne sont dessinées que tant que la vue de la carte est de cette largeur ou plus étroite. Laissez la case vide pour les dessiner à tous les niveaux de zoom. Saisissez 0 pour ne jamais dessiner d\'étiquette, à aucun zoom.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Toujours afficher';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap_sentence']='Empêcher les nœuds de s\'agrandir à plus de {n} fois la longueur de la conduite au {p} e centile';
$ec_lang['lpn_settings_symbol_cap_tip']='Une jonction cesse de grandir sur le terrain dès que son diamètre atteindrait ce nombre de fois la longueur de la conduite à ce centile de toutes les longueurs de conduites du réseau. Au-delà de ce point sur la carte, les jonctions, les conduites et les autres symboles rétrécissent à l\'écran quand vous dézoomez, au lieu de grandir sur le terrain. Les réservoirs et les bâches font exception et conservent leur taille à l\'écran à tout niveau de zoom.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Opacité des symboles (0 à 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Opacité de l\'image de fond (0 à 1)';
$ec_lang['lpn_settings_map_display']='Apparence';
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
$ec_lang['lpn_settings_legend_position']='Position de la légende des étiquettes';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Aucune';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Désactivé';
$ec_lang['lpn_settings_legend_top_left']='En haut à gauche';
$ec_lang['lpn_settings_legend_top_right']='En haut à droite';
$ec_lang['lpn_settings_legend_middle_left']='Au milieu à gauche';
$ec_lang['lpn_settings_legend_middle_right']='Au milieu à droite';
$ec_lang['lpn_settings_legend_bottom_left']='En bas à gauche';
$ec_lang['lpn_settings_legend_bottom_right']='En bas à droite';
$ec_lang['lpn_settings_color_node_field']='Couleur des nœuds';
$ec_lang['lpn_settings_color_link_field']='Couleur des conduites';
$ec_lang['lpn_settings_color_ramp']='Palette de couleurs';
$ec_lang['lpn_settings_color_credits']='Crédits';
$ec_lang['lpn_color_ramp_epanet']='Bleu à rouge (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Violet à jaune (plus facile de distinguer une couleur de la suivante)';
$ec_lang['lpn_color_ramp_gray']='Gris clair à gris foncé';
$ec_lang['lpn_settings_color_reverse']='Inverser l\'ordre des couleurs';
$ec_lang['lpn_color_none']='Aucune couleur';
$ec_lang['lpn_settings_color_key_position']='Position de la légende des couleurs';
$ec_lang['lpn_settings_color_breaks']='Limites des plages de couleurs';
$ec_lang['lpn_settings_color_equal_intervals']='Intervalles égaux';
$ec_lang['lpn_settings_color_equal_counts']='Effectifs égaux';
$ec_lang['lpn_settings_color_no_values']='Il n\'y a pas encore de valeurs disponibles. Résolvez d\'abord le réseau.';
$ec_lang['lpn_confirm_restore_defaults']='Réinitialiser tous les paramètres (préfixes d\'identifiant, valeurs initiales, paramètres du solveur, aspect de la carte, position de la légende et étiquettes visibles) à leurs valeurs d\'origine ? Votre réseau n\'est pas modifié. Les paramètres appartiennent au projet ouvert, donc vos autres projets conservent les leurs.';
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
$ec_lang['lpn_settings_wipe_btn']='Repartir de zéro';
$ec_lang['lpn_confirm_wipe']='Repartir de zéro, en supprimant TOUT ce qui est enregistré pour cette page : chaque projet, chaque image de fond, tous les paramètres et vos choix d\'unités ? La page se recharge exactement comme la verrait un tout nouveau visiteur. Cette action est irréversible.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Copiez ce lien :';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Temps';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Durée totale de simulation';
$ec_lang['lpn_time_hyd_step']='Pas de temps hydraulique';
$ec_lang['lpn_time_pattern_step']='Pas de temps de la courbe de modulation';
$ec_lang['lpn_time_pattern_start']='Heure de départ de la courbe de modulation';
$ec_lang['lpn_time_report_step']='Pas de temps de rapport';
$ec_lang['lpn_time_report_start']='Heure de départ du rapport';
$ec_lang['lpn_time_clock_start']='Heure de l\'horloge au départ';
$ec_lang['lpn_time_clock_day']='Jour {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Écrivez une heure sous forme d\'heures et de minutes, par exemple 2:30. Un nombre seul est en heures : 8 signifie huit heures. Une demi-heure s\'écrit 0:30.';
$ec_lang['lpn_time_running']='Calcul de la simulation sur toute la période avec le solveur EPANET.';
$ec_lang['lpn_time_no_engine']='Le solveur intégré calcule un seul instant à la fois : ceci est donc le réseau à {time} uniquement — chaque courbe de modulation est lue à cet instant, et chaque bâche reste encore à son niveau de départ au lieu de se remplir et de se vider. Connectez-vous une fois à Internet pour récupérer le solveur EPANET, qui calcule toute la période.';
$ec_lang['lpn_time_slider']='Temps de simulation écoulé';
$ec_lang['lpn_time_no_period']='Ce projet n\'a pas de simulation sur toute une période, il n\'y a donc qu\'un seul instant à afficher. Réglez une Durée totale de simulation dans Paramètres, Calcul, Temps pour calculer le réseau dans le temps.';
$ec_lang['lpn_time_first']='Aller au début';
$ec_lang['lpn_time_prev']='Reculer d\'un pas';
$ec_lang['lpn_time_play']='Lecture';
$ec_lang['lpn_time_play_tip']='Lire l\'animation';
$ec_lang['lpn_time_pause_tip']='Mettre l\'animation en pause';
$ec_lang['lpn_time_pause']='Pause';
$ec_lang['lpn_time_next']='Avancer d\'un pas';
$ec_lang['lpn_time_last']='Aller à la fin';
$ec_lang['lpn_time_tank']='Bâche';
$ec_lang['lpn_time_level']='Niveau d\'eau';
$ec_lang['lpn_time_run']='Calculer';
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
$ec_lang['lpn_time_run_done']='Le calcul est terminé. Instants de rapport : {frames}. Durée : {secs} s.';
$ec_lang['lpn_time_runbox_hide']='Ne plus afficher cette boîte';
$ec_lang['lpn_settings_runbox']='Afficher la boîte de progression du calcul';
$ec_lang['lpn_settings_runbox_tip']='Une boîte qui indique où en est un calcul et ce qu\'il a trouvé. Si elle est désactivée, un calcul terminé affiche la même information dans la ligne d\'état pendant quelques secondes à la place. C\'est un réglage propre à ce navigateur, et non au projet.';
$ec_lang['lpn_time_run_failed']='Le calcul ne s\'est pas terminé, il n\'y a donc pas de résultats pour les instants suivants.';
$ec_lang['lpn_time_run_report']='Rapport de calcul EPANET';
$ec_lang['lpn_time_run_report_copy']='Copier';
$ec_lang['lpn_time_run_report_copied']='Copié';
$ec_lang['lpn_time_run_report_tip']='Ce que le solveur EPANET lui-même a imprimé au sujet du dernier calcul : s\'il a convergé, et tout ce dont il a averti. C\'est le texte du solveur lui-même, pas le nôtre.';

$ec_lang['lpn_time_speed']='Vitesse';
$ec_lang['lpn_time_speed_tip']='Vitesse de lecture';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Rechercher des paramètres';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Saisissez un ou plusieurs mots pour afficher les paramètres qui les mentionnent tous.';
$ec_lang['lpn_settings_no_match']='Aucun paramètre ne mentionne ce mot.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Largeur de la liste de la section Paramètres';
$ec_lang['lpn_rpane_empty']='Rien n\'est encore ancré ici. Tout ce qui concerne l\'ensemble du projet se trouve dans Paramètres.';
$ec_lang['lpn_time_settings_open']='Paramètres de temps';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Visualisation';
$ec_lang['lpn_settings_sec_map']='Carte et page';
$ec_lang['lpn_settings_sec_assets']='Éléments';
$ec_lang['lpn_settings_sec_calculation']='Calcul';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Client';
$ec_lang['lpn_labels_customer_note']='Une étiquette de client affiche les valeurs cochées ici. Elle est dessinée à la même taille de texte que toutes les autres étiquettes de la carte.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Les étiquettes de client ne sont dessinées que tant que la vue de la carte est de cette largeur ou plus étroite. Laissez la case vide pour les dessiner à tous les niveaux de zoom. Saisissez 0 pour ne jamais dessiner d\'étiquette de client, à aucun zoom. Ceci n\'a aucun effet si la valeur est plus grande que le réglage équivalent pour toutes les étiquettes.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Utiliser la vue actuelle';
$ec_lang['lpn_settings_page']='Page';
$ec_lang['lpn_settings_hydraulics']='Hydraulique';
$ec_lang['lpn_settings_quality']='Qualité de l\'eau';
$ec_lang['lpn_settings_quality_track']='Paramètre de qualité';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Choisissez ce que le calcul doit suivre à travers les conduites : depuis combien de temps l\'eau est dans le réseau, d\'où elle provient, ou un produit chimique qui réagit en chemin. Seul le produit chimique nécessite des coefficients.';
$ec_lang['lpn_settings_quality_source']='Nœud de traçage';
$ec_lang['lpn_settings_quality_source_tip']='Le nœud dont l\'eau est tracée. Chaque autre nœud affiche alors la part de son eau provenant de ce nœud.';
$ec_lang['lpn_quality_none']='Aucun';
$ec_lang['lpn_quality_trace']='Traçage de la source';
$ec_lang['lpn_quality_chemical']='Un produit chimique qui réagit';
$ec_lang['lpn_quality_needs_run']='La qualité de l\'eau se propage le long des conduites au fil du calcul ; elle nécessite donc le moteur EPANET et une durée totale de simulation. Réglez une Durée totale de simulation sous Temps, puis appuyez sur le bouton Calculer.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Produit chimique et unités';
$ec_lang['lpn_quality_chemical_name_tip']='Le produit chimique que vous suivez, par exemple Chlore. Laissez le champ vide pour l\'étiquette par défaut d\'EPANET, Chemical. Affiché dans vos rapports, mais non utilisé dans les calculs.';
$ec_lang['lpn_quality_mass_units']='Unités de masse';
$ec_lang['lpn_quality_mass_units_tip']='La partie unités de la saisie de qualité, les deux choix propres à EPANET.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Tolérance de qualité';
$ec_lang['lpn_quality_tolerance_tip']='De combien deux parcelles d\'eau adjacentes peuvent différer en concentration avant qu\'EPANET ne les traite comme une seule. Une case vide utilise la valeur par défaut propre à EPANET, 0,01.';
$ec_lang['lpn_quality_diffusivity']='Diffusivité relative';
$ec_lang['lpn_quality_diffusivity_tip']='La facilité avec laquelle le produit chimique se répand dans l\'eau, par rapport au chlore. Une case vide utilise la valeur par défaut propre à EPANET, 1,0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Concentration de {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Concentration moyenne de {chemical}';
$ec_lang['lpn_quality_initial']='Qualité initiale';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='La quantité de produit chimique que porte ce nœud au début du calcul. Un réservoir garde sa propre valeur pour tout le calcul, ce qui correspond à la façon dont on indique habituellement le résiduel en sortie d\'une usine de traitement. Laissez la case vide et le nœud démarre sans aucun produit chimique.';
$ec_lang['lpn_result_concentration']='Teneur';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='La quantité de produit chimique restant en ce point après son trajet et ses réactions. Les unités sont celles indiquées à côté du produit chimique sous Paramètres, Qualité de l\'eau.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Type de source';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Le type d\'injection que ce nœud applique à l\'eau qui le traverse. Concentration traite l\'eau entrant dans le réseau ici comme arrivant à la valeur Qualité de la source. Injection massique ajoute une masse de produit chimique chaque minute, quel que soit le débit. Injection à consigne porte la concentration sortant de ce nœud jusqu\'à la valeur Qualité de la source, sans la dépasser. Injection proportionnelle au débit ajoute la valeur Qualité de la source à ce qui se trouve déjà dans l\'eau.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Aucun';
$ec_lang['lpn_source_type_concen']='Concentration imposée';
$ec_lang['lpn_source_type_mass']='Injection massique';
$ec_lang['lpn_source_type_setpoint']='Injection à consigne';
$ec_lang['lpn_source_type_flowpaced']='Injection proportionnelle au débit';
$ec_lang['lpn_source_quality']='Qualité de la source';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='L\'intensité de l\'injection. Pour tous les types sauf l\'injection massique, c\'est une concentration, dans les unités indiquées à côté du produit chimique sous Paramètres, Qualité de l\'eau ; pour une injection massique, c\'est une masse de produit chimique par minute. Laissez la case vide et rien n\'est ajouté ici, ce qui n\'est pas la même chose qu\'un zéro : un zéro est une injection qui fonctionne et n\'ajoute rien.';
$ec_lang['lpn_source_pattern']='Courbe de modulation de la source';
$ec_lang['lpn_source_pattern_tip']='Une courbe de modulation qui module l\'injection au fil du calcul, pour une injection qui n\'est pas constante. Aucune courbe signifie que l\'injection est la même à chaque instant.';
$ec_lang['lpn_mixing_model']='Modèle de mélange';
$ec_lang['lpn_mixing_model_tip']='Comment l\'eau déjà présente dans cette bâche se mélange à l\'eau qui entre. Mélange complet brasse toute la bâche à la fois. Mélange à deux compartiments remplit d\'abord une zone d\'entrée puis fait passer le reste. Écoulement piston FIFO fait avancer l\'eau dans l\'ordre où elle est arrivée. Écoulement piston LIFO l\'empile, si bien que la dernière eau entrée est la première sortie. Ce choix change l\'âge de l\'eau et le résiduel, et ne change aucune pression ni aucun débit.';
$ec_lang['lpn_mixing_mixed']='Mélange complet';
$ec_lang['lpn_mixing_2comp']='Mélange à deux compartiments';
$ec_lang['lpn_mixing_fifo']='Écoulement piston FIFO';
$ec_lang['lpn_mixing_lifo']='Écoulement piston LIFO';
$ec_lang['lpn_mixing_fraction']='Fraction de mélange';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='La part du volume de la bâche qu\'occupe la zone d\'entrée, entre 0 et 1. Seul le mélange à deux compartiments l\'utilise. Laissez la case vide et toute la bâche est la zone d\'entrée, ce qu\'EPANET suppose par défaut.';
$ec_lang['lpn_reaction_bulk']='Coefficient de réaction en masse';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Réaction dans la masse de l\'eau, utilisée pour toute conduite qui n\'a pas de coefficient propre. Un nombre négatif décompose le produit chimique et un nombre positif l\'augmente. La réaction est d\'ordre un sauf si un fichier EPANET importé indique un autre ordre, donc le coefficient est un taux en 1/jour. Une case vide signifie aucune réaction en masse.';
$ec_lang['lpn_reaction_wall']='Coefficient de réaction en paroi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Réaction à la paroi de la conduite, utilisée pour toute conduite qui n\'a pas de coefficient propre. Un nombre négatif décompose le produit chimique. La réaction est d\'ordre un sauf si un fichier EPANET importé indique un autre ordre, donc le coefficient est une longueur par jour, écrite dans l\'unité de longueur du projet. Une case vide signifie aucune réaction en paroi.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Cette conduite seule. Laissez la case vide et la conduite utilise le coefficient fixé pour tout le réseau sous Paramètres, Qualité de l\'eau.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Coefficient de réaction';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Réaction dans l\'eau contenue dans cette bâche, sous forme de taux en 1/jour. Un nombre négatif décompose le produit chimique et un nombre positif l\'augmente. L\'eau séjourne bien plus longtemps dans une bâche que dans n\'importe quelle conduite, donc c\'est souvent là qu\'un résiduel se perd. Laissez la case vide et la bâche utilise le coefficient de réaction en masse fixé pour tout le réseau sous Paramètres, Qualité de l\'eau.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Réaction en masse';
$ec_lang['lpn_reaction_wall_short']='Réaction en paroi';
$ec_lang['lpn_reaction_tank_short']='Réaction';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/jour';
$ec_lang['lpn_reaction_day']='jour';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Ordre de réaction en masse';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='L\'exposant auquel la concentration est élevée pour la réaction dans le corps de l\'eau. Tout nombre réel est autorisé. 1 est la valeur par défaut et est utilisé pour la plupart des modélisations de décroissance du chlore. 0 rend le taux indépendant de la quantité de produit chimique présente.';
$ec_lang['lpn_reaction_order_tank']='Ordre de réaction en bâche';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='L\'exposant auquel la concentration est élevée pour la réaction dans l\'eau contenue dans une bâche, distinct de l\'ordre de réaction en masse afin qu\'une bâche puisse réagir selon un ordre différent de celui des conduites. Tout nombre réel est autorisé, et 1 est la valeur par défaut. EPANET l\'indique comme ORDER TANK dans un fichier et ne propose pas de case pour cela dans sa propre interface.';
$ec_lang['lpn_reaction_order_wall']='Ordre de réaction en paroi';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 signifie que la réaction en paroi se produit selon le ou les coefficients donnés. 0 signifie qu\'elle ne se produit pas. C\'est un interrupteur marche/arrêt. La valeur par défaut est 1.';
$ec_lang['lpn_reaction_order_unstated']='Non indiqué';
$ec_lang['lpn_reaction_order_zero']='0, ordre zéro';
$ec_lang['lpn_reaction_order_first']='1, premier ordre';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Potentiel limitant';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Une concentration vers laquelle le produit chimique tend au lieu de décroître jusqu\'à rien ou de croître sans fin. La réaction ralentit à mesure que l\'eau s\'en approche et s\'arrête à ce point. Utilisez des unités cohérentes. Pas de limite si la case est vide.';
$ec_lang['lpn_reaction_rough_corr']='Corrélation avec la rugosité';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Corrèle la réaction en paroi à la rugosité propre de chaque conduite, de sorte qu\'une conduite plus rugueuse réagit plus vite. Lorsqu\'elle est activée, un coefficient de paroi est calculé pour chaque conduite à partir de la rugosité de cette conduite, et le coefficient de paroi unique ci-dessus n\'est plus utilisé. Non utilisé si la case est vide.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Cette page ne propose pas de coefficient de réaction qui lui soit propre. Il n\'existe pas d\'essai normalisé pour cela, et les valeurs publiées sur le terrain pour un même type d\'eau varient d\'un facteur dix, donc un nombre fourni ici serait lu comme une recommandation. Saisissez une valeur que vous avez mesurée ou que vous pouvez citer, ou laissez les cases vides pour un produit chimique qui ne réagit pas.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Énergie';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Rapports';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_epanet']='Calcul EPANET';
$ec_lang['lpn_energy_title']='Rapport d\'énergie des pompes';
$ec_lang['lpn_energy_menu']='Énergie des pompes';
$ec_lang['lpn_energy_efficiency']='Rendement de pompe (pourcentage)';
$ec_lang['lpn_energy_efficiency_tip']='Le rendement global, du réseau électrique à l\'eau, utilisé pour toute pompe qui n\'a pas de courbe de rendement propre. EPANET utilise 75 pour cent lorsque rien n\'est indiqué.';
$ec_lang['lpn_energy_price']='Prix de l\'énergie';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Ce que coûte un kilowattheure. Il s\'applique à toute pompe qui n\'a pas de prix propre. Laissez la case vide et tous les coûts du rapport sont nuls.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Ce que coûte un kilowattheure pour cette pompe. Laissez la case vide et la pompe applique le prix fixé pour tout le réseau sous Paramètres, Énergie.';
$ec_lang['lpn_energy_price_pattern']='Courbe de modulation du prix';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Une courbe de modulation qui multiplie le prix à chaque pas de la courbe, ce qui permet d\'indiquer un tarif heures creuses. Laissez la case vide pour un prix unique tout au long du calcul.';
$ec_lang['lpn_energy_demand_charge']='Prime de pointe';
$ec_lang['lpn_energy_demand_charge_tip']='Ce que facture le service public par kW pour la pointe de charge demandée par les pompes du réseau.';
$ec_lang['lpn_energy_currency']='Devise';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Ce que vous écrivez ici s\'affiche à côté de chaque montant. C\'est une étiquette. Les prix et les coûts ne sont jamais convertis, donc écrivez vos prix dans la devise indiquée ici.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Cette page ne propose pas de prix qui lui soit propre. Le coût de l\'énergie dépend du service public, du pays, de l\'heure et de l\'année, donc un nombre fourni ici serait lu comme une recommandation. Saisissez le prix de votre propre tarif.';
$ec_lang['lpn_energy_needs_run']='L\'énergie des pompes est une puissance intégrée sur tout le calcul, elle nécessite donc une simulation sur toute la période : le moteur EPANET et une durée totale de simulation. Réglez une Durée totale de simulation sous Paramètres, Calcul, Temps, appuyez sur le bouton Calculer, puis ouvrez Eau, Rapports, Énergie des pompes.';
$ec_lang['lpn_energy_no_pumps']='Ce réseau n\'a pas de pompe, il n\'y a donc aucune consommation d\'énergie.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Comparaison des scénarios';
$ec_lang['lpn_scncmp_menu_tip']='Calculer chaque scénario de ce projet et les comparer côte à côte : la pression la plus basse et la vitesse la plus élevée dans chacun.';
$ec_lang['lpn_scncmp_running']='Calcul de tous les scénarios…';
$ec_lang['lpn_scncmp_empty']='Rien n\'a encore été dessiné, il n\'y a donc rien à calculer.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Vitesse la plus élevée';
$ec_lang['lpn_scncmp_at']='{value} à {id}';
$ec_lang['lpn_scncmp_current']='(actuellement ouvert)';
$ec_lang['lpn_scncmp_note']='Chaque scénario est calculé à partir d\'une copie du dessin. Rien ici ne modifie le projet, et le scénario dans lequel vous travaillez reste tel quel.';
$ec_lang['lpn_energy_over']='Pour une simulation sur toute la période de {time}';
$ec_lang['lpn_energy_col_pump']='Pompe';
$ec_lang['lpn_energy_col_running']='% du calcul';
$ec_lang['lpn_energy_col_effic']='Rend.';
$ec_lang['lpn_energy_col_avg_kw']='kW moy.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='La puissance moyenne consommée pendant que cette pompe fonctionnait. Elle n\'est pas moyennée sur les périodes d\'arrêt, donc une pompe restée à l\'arrêt pendant une grande partie de la simulation sur toute la période continue d\'indiquer la puissance qu\'elle a consommée pendant qu\'elle fonctionnait.';
$ec_lang['lpn_energy_col_peak_kw']='kW de pointe';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Coût';
$ec_lang['lpn_energy_total_kwh']='Énergie consommée';
$ec_lang['lpn_energy_total_energy_cost']='Coût de l\'énergie';
$ec_lang['lpn_energy_peak_kw']='Puissance de pointe';
$ec_lang['lpn_energy_total_demand_charge']='Coût de la pointe';
$ec_lang['lpn_energy_total_cost']='Coût total';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='État';
$ec_lang['lpn_reports_status_tip']='Ce qui a changé pendant la dernière simulation en période prolongée, dans l\'ordre chronologique : pompes et vannes qui s\'ouvrent ou se ferment, bâches qui se remplissent, se vident, deviennent pleines ou s\'assèchent, et pas de temps qui n\'ont pas complètement convergé.';
$ec_lang['lpn_status_title']='Rapport d\'état';
$ec_lang['lpn_status_needs_run']='Le rapport d\'état liste ce qui a changé pendant une simulation en période prolongée. Réglez une Durée totale de simulation sous Paramètres, Calcul, Temps, appuyez sur Calculer, puis ouvrez Eau, Rapports, Rapport d\'état.';
$ec_lang['lpn_status_empty']='Rien n\'a changé d\'état pendant ce calcul.';
$ec_lang['lpn_status_col_event']='Événement';
$ec_lang['lpn_status_opened']='{type} {id} est maintenant ouvert';
$ec_lang['lpn_status_closed']='{type} {id} est maintenant fermé';
$ec_lang['lpn_status_filling']='{type} {id} est maintenant en cours de remplissage';
$ec_lang['lpn_status_emptying']='{type} {id} est maintenant en cours de vidange';
$ec_lang['lpn_status_full']='{type} {id} est maintenant plein';
$ec_lang['lpn_status_dry']='{type} {id} est maintenant vide';
$ec_lang['lpn_status_no_converge']='La solution hydraulique à ce pas de temps n\'a pas complètement convergé ; les nombres affichés sont ceux de sa dernière itération.';
$ec_lang['lpn_status_note']='Lu depuis le même calcul en période prolongée que le panneau Tableaux et le Rapport complet. Seul un changement est listé, pas chaque pas de temps.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Complet';
$ec_lang['lpn_reports_full_tip']='Chaque nœud et chaque liaison à chaque pas de temps de rapport du dernier calcul, sous la forme d\'un seul tableau que vous pouvez télécharger ou imprimer.';
$ec_lang['lpn_full_title']='Rapport complet';
$ec_lang['lpn_full_needs_run']='Le rapport complet liste chaque nœud et chaque liaison à chaque pas de temps de rapport. Appuyez sur Calculer, puis ouvrez Eau, Rapports, Rapport complet.';
$ec_lang['lpn_full_note']='Une ligne par nœud ou liaison et par pas de temps de rapport, dans les unités affichées sur le panneau Tableaux. Une cellule vide correspond à une colonne que cette grandeur n\'a pas. Le téléchargement ou l\'impression emporte chaque pas de temps ; le tableau ci-dessous n\'en affiche qu\'un à la fois.';
$ec_lang['lpn_full_step_label']='Pas de temps';
$ec_lang['lpn_full_download_csv']='Télécharger le CSV';
$ec_lang['lpn_full_print']='Imprimer le rapport';
$ec_lang['lpn_full_col_time']='Temps';
$ec_lang['lpn_full_col_type']='Type';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} lignes.';
$ec_lang['lpn_energy_no_price']='Aucun prix de l\'énergie n\'est indiqué, donc tous les coûts ici sont nuls. Réglez-en un sous Paramètres, Énergie.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Ce réseau indique un prix de zéro, donc tous les coûts ici sont nuls. Modifiez-le sous Paramètres, Énergie.';
$ec_lang['lpn_energy_curve_note']='Ces pompes désignent une courbe de rendement sans points : {ids}. Elles ont fonctionné au rendement fixé pour tout le réseau.';
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
$ec_lang['lpn_labels_col_drop']='Abandon';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Nœud et liaison';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Intervalle égal';
$ec_lang['lpn_color_mode_quantile']='Quantile (effectifs égaux)';
$ec_lang['lpn_color_mode_jenks']='Ruptures naturelles (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Écart type';
$ec_lang['lpn_color_mode_pretty']='Valeurs arrondies';
$ec_lang['lpn_color_mode_log']='Logarithmique';
$ec_lang['lpn_color_mode_manual']='Manuel';

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
$ec_lang['lpn_library_menu']='Bibliothèques';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Courbes de modulation';
$ec_lang['lpn_library_patterns_tip']='Une courbe de modulation est une liste de coefficients multiplicateurs qui se répète. Chacun s\'applique pendant un pas de temps de la courbe, donc 24 nombres avec un pas d\'une heure forment une journée qui se répète. Une demande de 10 avec un coefficient de 1,5 vaut 15 à cet instant.';
$ec_lang['lpn_library_curves']='Courbes';
$ec_lang['lpn_library_curves_tip']='Une courbe est une liste de points qui indique comment quelque chose se comporte : la charge qu\'une pompe ajoute pour chaque débit, son rendement à ce débit, ou la charge qu\'une vanne perd pour chaque débit.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Les courbes sont associées aux pompes et aux vannes. Pour une courbe de charge de pompe, le calcul utilise une courbe ajustée sur les points, comme affiché ; pour tout autre type, il relie les points par des segments droits, comme affiché.';
$ec_lang['lpn_library_curve_add']='Ajouter une courbe';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Type de courbe';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Équation';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='La courbe ajustée sur les points, et la ligne tracée sur le graphique ci-dessous. Elle est recalculée à partir des points à chaque affichage et n\'est jamais enregistrée, et ses valeurs sont dans les unités indiquées par le tableau ci-dessus. Le solveur intégré calcule sur cette équation ; le moteur EPANET lit les points eux-mêmes.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Sélectionnez une ou deux colonnes dans un tableur, copiez-les, puis collez-les dans la première cellule où vous voulez qu\'elles arrivent. Les lignes sont ajoutées au fur et à mesure des besoins. Vous pouvez aussi coller des lignes copiées directement depuis un fichier EPANET, y compris le nom de la courbe.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Note descriptive';
$ec_lang['lpn_library_curve_remove_point']='Supprimer ce point';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Copier les points';
$ec_lang['lpn_library_curve_copy_tip']='Copie chaque point sous forme de deux colonnes, prêtes à coller dans un tableur.';
$ec_lang['lpn_library_curve_copy_manual']='Copier ces points';
$ec_lang['lpn_library_curve_used_by']='Éléments utilisant cette courbe';
$ec_lang['lpn_library_curve_unused']='Rien n\'utilise cette courbe.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Cette courbe est utilisée par {count} éléments : {ids}. Faites-les d\'abord pointer vers une autre courbe, puis supprimez celle-ci.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Types de conduite';
$ec_lang['lpn_library_pipetypes_tip']='Un type de conduite est une définition à laquelle plusieurs conduites peuvent se référer pour leur diamètre, leur rugosité et leurs coefficients de réaction. Modifier la définition modifie toutes les conduites qui l\'utilisent.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Chaque projet a sa propre bibliothèque de types de conduite. Vous pouvez laisser des propriétés vides dans une définition de type de conduite. Par exemple, un type de conduite qui indique une rugosité mais pas de diamètre est acceptable. Vous attachez des types de conduite aux conduites dans leur éditeur de propriétés. Modifier une définition ici change toutes les conduites qui s\'y réfèrent.';
$ec_lang['lpn_library_pipetype_add']='Ajouter un type de conduite';
$ec_lang['lpn_library_pipetype_blank_tip']='Les propriétés vides dans une définition de type de conduite sont laissées à saisir individuellement pour chaque conduite.';
$ec_lang['lpn_library_pipetype_used_by']='Conduites utilisant ce type';
$ec_lang['lpn_library_pipetype_unused']='Rien n\'utilise ce type de conduite.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Ce type de conduite est utilisé par {count} conduites : {ids}. Détachez-les d\'abord, puis supprimez-le.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Type de conduite';
$ec_lang['lpn_field_pipetype_tip']='Le type de conduite, dans la bibliothèque du projet, que cette conduite utilise. Les propriétés incluses dans le type de conduite ne sont pas modifiables ici. Détachez le type de conduite pour les rendre modifiables ici.';
$ec_lang['lpn_pipetype_none']='Aucun type de conduite sélectionné';
$ec_lang['lpn_pipetype_detach']='Détacher du type de conduite';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Copie dans la conduite elle-même les valeurs qu\'elle lit de son type, et cesse d\'utiliser ce type. Les valeurs de la conduite ne changent pas maintenant, et vous pouvez désormais les modifier ici.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Raccords';
$ec_lang['lpn_library_fittings_tip']='Une liste de raccords est un ensemble de raccords et de leurs quantités auquel plusieurs conduites peuvent se référer. Elle se totalise en un seul coefficient de perte de charge singulière (locale).';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Chaque projet a sa propre bibliothèque de raccords. Une liste de raccords comporte des raccords avec une quantité pour chacun, et se totalise en un seul coefficient de perte de charge singulière (locale). Les conduites et les types de conduite peuvent tous deux se référer à une liste.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Les raccords proposés ici sont les treize du tableau 3.3 du manuel de l\'utilisateur d\'EPANET 2.2. En choisir un copie son coefficient dans la ligne, où vous pouvez le modifier. Un coefficient dépend de la taille et de la marque du raccord ; considérez donc le tableau comme un point de départ plutôt que comme une réponse.';
$ec_lang['lpn_library_fittings_add']='Ajouter une liste de raccords';
$ec_lang['lpn_library_fittings_used_by']='Conduites utilisant cette liste de raccords';
$ec_lang['lpn_library_fittings_unused']='Rien n\'utilise cette liste de raccords.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Cette liste de raccords est utilisée par {count} conduites : {ids}. Détachez-la d\'elles avant de la supprimer.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Importer des bibliothèques…';
$ec_lang['lpn_library_import_tip']='Choisissez un autre fichier de projet et copiez des bibliothèques entières depuis celui-ci vers ce projet. Tout ce dont le nom est déjà utilisé ici est ignoré et listé, afin que rien de ce que vous avez déjà ne soit modifié.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Choisissez ce qu\'il faut copier depuis {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Chaque bibliothèque que vous cochez est copiée entièrement. Supprimez ensuite ce que vous ne voulez pas, comme vous supprimeriez n\'importe quelle autre entrée.';
$ec_lang['lpn_library_import_go']='Importer';
$ec_lang['lpn_library_import_no_libraries']='Ce fichier de projet n\'a aucune bibliothèque à copier.';
$ec_lang['lpn_library_import_heading']='Importé depuis {file}';
$ec_lang['lpn_library_import_added']='Copié : {names}';
$ec_lang['lpn_library_import_conflict']='Ignoré, car ce projet en possède déjà un du même nom : {names}. Rien n\'a été modifié ici. Renommez l\'un des deux et importez à nouveau si vous voulez conserver les deux.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Ce fichier de projet n\'en a aucun de ce type à copier.';
$ec_lang['lpn_library_import_curve_shape']='Ces courbes ont été importées exactement telles que le fichier les a écrites, et un calcul ne peut en utiliser une que si sa première colonne augmente d\'un point à l\'autre : {names}';
$ec_lang['lpn_library_import_needs_fittings']='Ces types de conduite se réfèrent à une liste de raccords que ce projet n\'a pas : {names}. Importez la bibliothèque de raccords depuis le même fichier et ils la trouveront.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Avertissement : incompatibilité d\'unités. Sera importé tel quel. Non recommandé.';
$ec_lang['lpn_library_import_units_line']='{name} : ce projet affiche {mine}, le fichier affiche {theirs}.';
$ec_lang['lpn_fitting_qty']='Quantité';
$ec_lang['lpn_fitting_name']='Raccord';
$ec_lang['lpn_fitting_k']='Coefficient';
$ec_lang['lpn_fitting_add']='Ajouter un raccord';
$ec_lang['lpn_fitting_remove']='Supprimer';
$ec_lang['lpn_fitting_total']='Coefficient de perte de charge singulière (locale) total, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Liste de raccords';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Une liste de raccords provenant de la bibliothèque du projet. Ses quantités et coefficients sont additionnés dans le coefficient de perte de charge singulière de cette conduite, et la case du coefficient devient alors en lecture seule. Laissez ce champ non sélectionné pour saisir le coefficient vous-même.';
$ec_lang['lpn_fittings_none']='Aucune liste de raccords sélectionnée';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Vanne à soupape (vanne globe), entièrement ouverte';
$ec_lang['lpn_fitting_angle']='Vanne d\'angle, entièrement ouverte';
$ec_lang['lpn_fitting_swingcheck']='Clapet anti-retour à battant, entièrement ouvert';
$ec_lang['lpn_fitting_gate']='Vanne-guillotine (robinet-vanne), entièrement ouverte';
$ec_lang['lpn_fitting_elbow_short']='Coude à rayon court';
$ec_lang['lpn_fitting_elbow_medium']='Coude à rayon moyen';
$ec_lang['lpn_fitting_elbow_long']='Coude à grand rayon';
$ec_lang['lpn_fitting_elbow_45']='Coude à 45 degrés';
$ec_lang['lpn_fitting_return_bend']='Coude de retour fermé (180°)';
$ec_lang['lpn_fitting_tee_run']='Té standard, écoulement dans l\'axe';
$ec_lang['lpn_fitting_tee_branch']='Té standard, écoulement dans la dérivation';
$ec_lang['lpn_fitting_entrance']='Entrée à arête vive';
$ec_lang['lpn_fitting_exit']='Sortie';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Autre raccord';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='{file} enregistré';
$ec_lang['lpn_inp_export_flat_lead']='Le fichier EPANET exporté est numériquement équivalent à ce projet. Mais il n\'a pas de place pour les éléments suivants :';
$ec_lang['lpn_inp_export_flat_types']='{n} conduites ici se réfèrent à {t} types de conduite. Dans le fichier, chacune de ces conduites porte sa propre copie des nombres, donc les réponses sont les mêmes. Ce que le fichier ne peut pas conserver, c\'est le type de conduite lui-même, donc modifier une définition et voir chaque conduite suivre est quelque chose que seul votre propre fichier de projet enregistre.';
$ec_lang['lpn_inp_export_flat_coords']='Un fichier EPANET conserve une seule position pour chaque nœud. Ce scénario en place {n} ailleurs, et ce sont ces positions qui vont dans le fichier. Chaque autre scénario garde ses propres positions uniquement dans votre fichier de projet.';
$ec_lang['lpn_inp_export_flat_fittings']='Un fichier EPANET ne peut pas contenir la liste des coudes, vannes et tés de votre fichier de projet. Le coefficient de perte de charge singulière de {n} conduites ici est calculé à partir d\'une liste de raccords. Le total est inscrit dans le fichier tel quel, donc rien ne change dans les réponses.';
$ec_lang['lpn_library_controls']='Contrôles';
$ec_lang['lpn_library_controls_tip']='Un contrôle est une phrase unique qui ouvre ou ferme une liaison, ou lui donne une consigne, lorsqu\'un niveau d\'eau, une pression ou une heure le déclenche.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Ajouter une courbe de modulation';
$ec_lang['lpn_library_pattern_values']='Coefficients multiplicateurs';
$ec_lang['lpn_library_pattern_values_tip']='Les coefficients multiplicateurs, séparés par des espaces ou des virgules. Collez une colonne de tableur si vous en avez une. La liste se répète pendant toute la durée du calcul, elle n\'a donc pas besoin de la couvrir entièrement.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} coefficients, espacés de {step}, couvrant {span}';
$ec_lang['lpn_library_pattern_none']='Aucune courbe de modulation';
$ec_lang['lpn_settings_default_pattern']='Courbe de modulation de la demande par défaut';
$ec_lang['lpn_settings_default_pattern_tip']='Toute jonction sans courbe de modulation utilise celle-ci.';
$ec_lang['lpn_library_control_add']='Ajouter un contrôle';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Une phrase unique, avec les mots employés par EPANET. Quatre formes : LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1, et LINK 12 CLOSED AT CLOCKTIME 3 AM. Au lieu de OPEN ou CLOSED, vous pouvez écrire un nombre, qui est une consigne de vanne ou une vitesse de pompe. Laissez les mots-clés en anglais ; ce sont eux que la page lit.';
$ec_lang['lpn_library_control_ok']='✓ Compris';
$ec_lang['lpn_library_control_bad']='⚠ Non compris';
$ec_lang['lpn_library_control_missing']='⚠ Ce réseau ne contient rien appelé {id}';
$ec_lang['lpn_library_rules']='Règles';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Une règle est un court paragraphe qui ouvre ou ferme une liaison, ou lui donne un réglage, lorsqu\'un niveau d\'eau, une pression, un débit ou une heure atteint une valeur que vous fixez. Les règles peuvent tester plusieurs choses à la fois, et elles peuvent indiquer quoi faire quand le test échoue.';
$ec_lang['lpn_library_rule_add']='Ajouter une règle';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Une règle, avec les mots qu\'utilise EPANET, une clause par ligne. Une première ligne la nomme : RULE 1. Puis une condition : IF TANK 2 LEVEL BELOW 17.1. Puis ce qu\'il faut faire : THEN PUMP 9 STATUS IS OPEN. Une dernière ligne peut lui donner un rang : PRIORITY 1. Ajoutez des lignes AND ou OR pour tester plusieurs choses, et des lignes ELSE pour indiquer quoi faire quand le test échoue. Une condition peut lire LEVEL, HEAD, GRADE, PRESSURE ou DEMAND sur un nœud, FLOW, STATUS ou SETTING sur une liaison, ou TIME et CLOCKTIME sur SYSTEM. Écrivez les nombres dans les unités que ce projet affiche ; ils sont convertis pour vous. Laissez les mots-clés en anglais ; ce sont eux que lisent la page et EPANET.';
$ec_lang['lpn_library_rule_ok']='✓ Cette règle a été lue';
$ec_lang['lpn_library_rule_bad']='⚠ Cette règle n\'a pas pu être lue';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Demande de base';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Le débit que ce nœud prélève au pas de temps affiché : chaque demande de base multipliée par sa propre courbe de modulation, le tout additionné. Il est calculé, non saisi ; il change donc avec l\'horloge et ne peut pas être modifié.';
$ec_lang['lpn_field_demand_pattern']='Courbe de modulation de la demande';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Libellé';
$ec_lang['lpn_demand_add']='Ajouter une catégorie de demande';
$ec_lang['lpn_demand_remove']='Retirer cette demande';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Courbe de modulation de la charge';
$ec_lang['lpn_field_head_pattern_tip']='Comment le niveau d\'eau de ce réservoir monte et descend pendant le calcul. La charge ci-dessus est multipliée par la courbe de modulation.';
$ec_lang['lpn_field_pump_speed']='Vitesse relative';
$ec_lang['lpn_field_pump_speed_tip']='1 correspond à cette pompe tournant à la vitesse à laquelle sa courbe a été mesurée. 0,9 correspond à la même pompe tournant plus lentement, ce qui réduit la charge qu\'elle ajoute et le débit qu\'elle transmet. Une courbe de modulation de vitesse remplace ce nombre pendant le calcul.';
$ec_lang['lpn_field_speed_pattern']='Courbe de modulation de vitesse';
$ec_lang['lpn_field_speed_pattern_tip']='Comment la vitesse de cette pompe monte et descend pendant le calcul. Chaque coefficient est la vitesse relative pour cette partie du calcul, et il remplace le réglage Vitesse au lieu de le multiplier, si bien qu\'un coefficient de 0 arrête la pompe.';

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
$ec_lang['lpn_search_menu']='Rechercher un lieu par son nom…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Trouve une ville, une adresse ou un lieu-dit par son nom et déplace la carte à cet endroit. La première utilisation demande votre autorisation, car les mots que vous saisissez sont envoyés au service de noms de lieux d\'OpenStreetMap.';
$ec_lang['lpn_search_bar']='Rechercher par nom…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='La recherche par nom de lieu envoie les mots que vous saisissez à nominatim.openstreetmap.org, le service gratuit de noms de lieux de l\'OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Ce service est différent des images de fond de carte derrière votre projet. Les images indiquent seulement où vous regardez. Une recherche indique ce que vous avez tapé. Le service de noms de lieux recevra vos mots de recherche et votre adresse IP. Nous n\'envoyons rien d\'autre, et nous ne conservons aucune trace de vos recherches.';
$ec_lang['lpn_search_consent_3']='Pouvons-nous envoyer vos recherches au service de noms de lieux ?';
$ec_lang['lpn_search_consent_4']='Si vous répondez non, tout le reste de cette page continue de fonctionner exactement comme maintenant, y compris Aller à une latitude et une longitude. Nous nous souvenons d\'un oui pour ne pas avoir à redemander. Un non n\'est pas du tout enregistré.';
$ec_lang['lpn_search_refused']='La recherche de noms de lieux est désactivée, et rien n\'a été envoyé. Vous pouvez toujours utiliser Aller à une latitude et une longitude.';
$ec_lang['lpn_search_prompt']='Recherchez un lieu par son nom. Une ville, une rue, un lieu-dit — par exemple : Petaluma, Californie';
$ec_lang['lpn_search_empty']='Saisissez un nom de lieu à rechercher.';
$ec_lang['lpn_search_working']='Recherche…';
$ec_lang['lpn_search_busy']='Une recherche est déjà en cours. Attendez sa réponse.';
$ec_lang['lpn_search_choose']='Plusieurs lieux correspondent. Lequel ?';
$ec_lang['lpn_search_nochoice']='Rien n\'a été choisi, la carte n\'a donc pas bougé.';
$ec_lang['lpn_search_badchoice']='Ce n\'est pas l\'un des numéros de la liste.';
$ec_lang['lpn_search_none']='Rien n\'a été trouvé pour ce nom.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Le service de noms de lieux nous demande de ralentir. Attendez une minute et réessayez.';
$ec_lang['lpn_search_http']='Le service de noms de lieux a répondu par une erreur.';
$ec_lang['lpn_search_timeout']='Le service de noms de lieux n\'a pas répondu à temps. Tout le reste de cette page fonctionne sans lui.';
$ec_lang['lpn_search_unreadable']='Le service de noms de lieux a répondu par quelque chose que cette page n\'a pas pu lire.';
$ec_lang['lpn_search_offline']='Nous n\'avons pas pu joindre le service de noms de lieux. Vous êtes peut-être hors ligne. Tout le reste de cette page fonctionne sans lui, y compris Aller à une latitude et une longitude.';
$ec_lang['lpn_search_toofast']='Une recherche par seconde — c\'est ce que permet le service de noms de lieux. Réessayez dans un instant.';
$ec_lang['lpn_search_nofetch']='Ce navigateur ne peut pas joindre le service de noms de lieux.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox assemble ces données à partir de nombreux jeux de données d\'élévation publics, donc leur qualité dépend entièrement de l\'endroit où vous êtes. Là où existe un relevé lidar national, comme USGS 3DEP dans une grande partie des États-Unis et ses équivalents ailleurs, la précision peut être meilleure qu\'un mètre à l\'horizontale et quelques dixièmes de mètre à la verticale. Là où seules des données mondiales existent, elle est d\'environ 30 m à l\'horizontale et de plusieurs mètres à la verticale. Mapbox ne nous indique pas laquelle vous avez obtenue. Traitez-la comme une carte de niveau, pas comme un relevé topographique : vérifiez tout ce sur quoi vous vous appuyez.';
$ec_lang['lpn_terrain_consent_1']='Renseigner les cotes envoie la position de chaque nœud qui en a besoin — sa latitude et sa longitude — à api.mapbox.com, afin d\'y consulter la hauteur du sol.';
$ec_lang['lpn_terrain_consent_2']='C\'est une question différente des images de fond de carte derrière votre projet. Les images indiquent seulement où vous regardez. Ces positions sont votre réseau lui-même. Mapbox recevra ces coordonnées et votre adresse IP. Nous n\'envoyons rien d\'autre : ni nom, ni conduites, ni projet. Nous n\'en conservons aucune trace, et rien n\'est enregistré sur cet appareil hormis votre réponse à cette question.';
$ec_lang['lpn_terrain_consent_3']='Pouvons-nous envoyer les positions de vos nœuds à Mapbox ?';
$ec_lang['lpn_terrain_consent_4']='Si vous répondez non, tout le reste de cette page continue de fonctionner exactement comme maintenant, et vous pouvez saisir vous-même les cotes comme auparavant. Nous nous souvenons d\'un oui pour ne pas avoir à redemander. Un non n\'est pas du tout enregistré.';
$ec_lang['lpn_terrain_refused']='Les cotes n\'ont pas été renseignées, et rien n\'a été envoyé. Vous pouvez les saisir comme auparavant.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Renseigner la cote de {n} nœud(s) depuis le MNT Mapbox ?';
$ec_lang['lpn_terrain_confirm_default_1']='Chaque nœud a déjà une cote, et {n} d\'entre eux sont encore à {v}, la cote de départ d\'un nouveau nœud, et non une valeur que vous avez saisie.';
$ec_lang['lpn_terrain_confirm_default_2']='Remplacer la cote de ces {n} nœuds par des valeurs du MNT Mapbox ?';
$ec_lang['lpn_terrain_keep']='{k} nœud(s) ont déjà une cote et ne seront pas modifiés.';
$ec_lang['lpn_terrain_undo']='Un seul Annuler (Ctrl-Z) les rétablit tous.';
$ec_lang['lpn_terrain_requests']='{n} requête(s) vers api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Les cotes sont déjà en cours de renseignement. Attendez la fin.';
$ec_lang['lpn_terrain_offmap']='Ces positions de nœuds ne sont pas sur la carte de terrain, rien n\'a donc été envoyé.';
$ec_lang['lpn_terrain_too_wide']='Ces nœuds sont répartis sur une trop grande partie de la Terre pour être lus en une seule fois ({n} requêtes de tuiles). Rien n\'a été envoyé.';
$ec_lang['lpn_terrain_cancelled']='Rien n\'a été modifié et rien n\'a été envoyé.';
$ec_lang['lpn_terrain_nofetch']='Ce navigateur ne peut pas joindre le service de terrain.';
$ec_lang['lpn_terrain_working']='Lecture de la surface du terrain…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Le service de terrain a refusé la requête ({status}), aucune cote n\'a donc été modifiée. Le jeton Mapbox utilisé par ce site n\'autorise peut-être pas l\'adresse web sur laquelle vous vous trouvez.';
$ec_lang['lpn_terrain_failed']='Nous n\'avons pas pu joindre le service de terrain, aucune cote n\'a donc été modifiée. Vous êtes peut-être hors ligne. Tout le reste de cette page fonctionne sans lui.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Le service de terrain nous demande de ralentir (429), aucune cote n\'a donc été modifiée. Réessayez dans une minute.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Le service de terrain a répondu avec une erreur ({status}), aucune cote n\'a donc été modifiée. Rien ne va mal dans votre réseau.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Aucun de ces nœuds n\'a de position sur la Terre, rien n\'a donc été envoyé et aucune cote n\'a été modifiée. Lire la surface du terrain nécessite un projet en latitude et longitude, ou sur une projection que cette page peut placer.';
$ec_lang['lpn_terrain_done']='{n} cote(s) renseignée(s).';
$ec_lang['lpn_terrain_missed']='{m} n\'ont pas pu être lues et restent vides.';
$ec_lang['lpn_terrain_partial']='{f} tuile(s) de terrain n\'ont pas répondu.';
$ec_lang['lpn_terrain_will_ids']='Ces nœuds recevront une cote : {ids}';
$ec_lang['lpn_terrain_keep_ids']='Ces nœuds sont : {ids}';
$ec_lang['lpn_terrain_filled_ids']='Ces nœuds ont reçu une cote : {ids}';
$ec_lang['lpn_terrain_blank_ids']='Ces nœuds n\'ont toujours pas de cote : {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, et {n} de plus';

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
$ec_lang['lpn_ff_menu']='Débit d\'incendie…';
$ec_lang['lpn_ff_menu_tip']='Testez les jonctions une par une : combien chacune peut-elle fournir tout en maintenant la pression résiduelle que vous avez définie, et le fait d\'y prélever le débit requis fait-il sortir autre chose des limites fixées ?';
$ec_lang['lpn_ff_title']='Débit d\'incendie';
$ec_lang['lpn_ff_intro']='Chaque jonction est tour à tour appelée à prélever un débit d\'incendie en plus de la demande qu\'elle a déjà. Rien n\'est modifié dans votre projet ; tout le calcul se fait sur une copie.';
$ec_lang['lpn_ff_scope']='Jonctions à tester';
$ec_lang['lpn_ff_scope_tip']='Choisissez l\'ensemble avant de lancer le calcul. Tester toutes les jonctions d\'un grand réseau peut prendre plusieurs minutes.';
$ec_lang['lpn_ff_all']='Toutes';
$ec_lang['lpn_ff_selected']='Sélectionnées';
$ec_lang['lpn_ff_no_junctions']='Ce projet n\'a pas encore de jonctions ; il n\'y a donc rien à tester.';
$ec_lang['lpn_ff_no_selection']='Aucune jonction n\'est sélectionnée. Sélectionnez des jonctions ou choisissez Toutes les jonctions.';
$ec_lang['lpn_ff_skipped']='{n} éléments sélectionnés ne sont pas des jonctions, ils n\'ont donc pas été testés.';
$ec_lang['lpn_ff_required']='Débit d\'incendie requis';
$ec_lang['lpn_ff_required_tip']='Le débit que votre réglementation incendie ou votre service de sécurité incendie exige à une bouche d\'incendie. Chaque jonction est testée par rapport à ce nombre, sauf si elle porte son propre débit d\'incendie requis.';
$ec_lang['lpn_ff_required_own']='Les jonctions portant leur propre débit d\'incendie requis sont testées par rapport à celui-ci à la place. Nombre d\'entre elles : {n}.';
$ec_lang['lpn_ff_required_node_tip']='Le débit d\'incendie requis à cette jonction en particulier, selon votre réglementation incendie ou votre service de sécurité incendie, pour l\'usage du sol qu\'elle dessert. Laissez-le vide et la jonction est testée par rapport au nombre indiqué dans la case Débit d\'incendie.';
$ec_lang['lpn_ff_residual']='Pression résiduelle à maintenir';
$ec_lang['lpn_ff_residual_tip']='La pression que la jonction doit encore maintenir tout en fournissant le débit d\'incendie. AWWA M31 et NFPA 291 utilisent 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Vérification de conception (effet sur le réseau)';
$ec_lang['lpn_ff_design_tip']='Une question distincte de la capacité de la jonction à fournir le débit : avec ce débit prélevé là, est-ce qu\'autre chose descend sous sa pression minimale ou dépasse sa limite de vitesse ? Choisir de le vérifier ne coûte aucun calcul supplémentaire.';
$ec_lang['lpn_ff_design_no_selection']='La vérification de conception est réglée sur Sélectionnées, et aucun élément n\'est sélectionné. Sélectionnez des éléments ou sélectionnez l\'option Toutes.';

$ec_lang['lpn_ff_minpressure']='Pression minimale admise ailleurs';
$ec_lang['lpn_ff_minpressure_tip']='Une jonction qui descend sous cette valeur pendant qu\'une autre prélève son débit d\'incendie est signalée comme un problème de conception.';
$ec_lang['lpn_ff_maxvelocity']='Vitesse maximale admise';
$ec_lang['lpn_ff_maxvelocity_tip']='Une conduite dépassant cette valeur pendant qu\'un débit d\'incendie est prélevé est signalée comme un problème de conception.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Le débit d\'incendie est prélevé à la jonction elle-même. C\'est la méthode utilisée ici, et c\'est la méthode habituelle. La bouche d\'incendie, sa conduite latérale et sa lance ne sont pas modélisées, donc une bouche d\'incendie réelle délivre moins que le débit indiqué ici.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Le solveur intégré est utilisé.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Le moteur EPANET est utilisé.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='Le débit d\'incendie disponible est une recherche : tout le réseau est donc résolu environ seize fois pour chaque jonction testée. Un grand réseau prend plusieurs minutes. Vous pouvez l\'arrêter à tout moment et conserver ce qui a déjà été calculé.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Seul le pas de temps actuellement affiché à l\'écran est testé. Le débit d\'incendie se teste normalement en plus de la demande du jour de pointe ; réglez donc le réseau sur cette condition avant de lancer le calcul.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Calcul du débit d\'incendie';
$ec_lang['lpn_ff_calculate']='Lancer';
$ec_lang['lpn_ff_stop']='Arrêter';
$ec_lang['lpn_ff_working']='En cours : {done} sur {total} jonctions.';
$ec_lang['lpn_ff_stopped']='Arrêté après {done} sur {total} jonctions. Les résultats ci-dessous sont ceux déjà terminés.';
$ec_lang['lpn_ff_cost']='Ce calcul a résolu tout le réseau {solves} fois.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Le dessin a changé, les résultats du débit d\'incendie ont donc été effacés. Relancez le calcul.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Effacer les anneaux';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} jonctions n\'avaient rien d\'anormal. {fire} jonctions ont échoué au débit d\'incendie. {design} jonctions ont affecté le reste du réseau.';
$ec_lang['lpn_ff_summary_error']='{n} jonctions n\'ont pas pu obtenir de réponse.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Toutes les jonctions testées';
$ec_lang['lpn_ff_col_junction']='Jonction';
$ec_lang['lpn_ff_col_static']='Pression statique';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='La pression à cette jonction avant tout prélèvement de débit d\'incendie, avec les demandes ordinaires du réseau toujours en cours. Rien n\'est coupé pour la mesurer, donc ce n\'est pas une pression à débit nul pour le réseau ; c\'est la même pression que celle affichée sur la carte à cette jonction. AWWA M31 et NFPA 291 appellent tous deux cette valeur la pression statique, et c\'est là que commence un essai de débit d\'incendie.';
$ec_lang['lpn_ff_col_available']='Débit disponible';
$ec_lang['lpn_ff_col_required']='Débit requis';
$ec_lang['lpn_ff_col_residual']='Résiduelle maintenue';
$ec_lang['lpn_ff_col_atrequired']='Pression au débit requis';
$ec_lang['lpn_ff_col_affected']='Pire effet';
$ec_lang['lpn_ff_col_limit']='Limite de conception';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Non vérifié';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Échec en statique, donc non vérifié';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Modes de défaillance';
$ec_lang['lpn_ff_mode_fire']='Incendie';
$ec_lang['lpn_ff_mode_design']='Conception';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Aucun';
$ec_lang['lpn_ff_col_solves']='Calculs';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Pression et vitesse';
$ec_lang['lpn_ff_atleast']='plus de {flow}';
$ec_lang['lpn_ff_affect_node']='{id} descend à {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} atteint {velocity}';
$ec_lang['lpn_ff_more']='et {n} de plus affectés';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='{n} jonctions supplémentaires ne sont pas affichées.';
$ec_lang['lpn_ff_design_none']='Rien dans l\'ensemble choisi n\'est sorti de ses limites pendant qu\'une jonction quelconque prélevait son débit d\'incendie.';
$ec_lang['lpn_ff_design_off_note']='L\'effet sur le reste du réseau n\'a pas été vérifié dans ce calcul.';
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
$ec_lang['lpn_ff_iso']='L\'Insurance Services Office (ISO) crédite une seule bouche d\'incendie d\'au plus {flow}. Cette limite de crédit n\'a pas été appliquée ici, car nous ne savons pas combien de bouches d\'incendie un nœud peut représenter.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Déjà sous la résiduelle avant tout prélèvement de débit d\'incendie';
$ec_lang['lpn_ff_err_converge']='Le réseau n\'a pas convergé.';
$ec_lang['lpn_ff_err_solve']='Le solveur a signalé une erreur et n\'a fourni aucun résultat.';
$ec_lang['lpn_ff_err_not_junction']='Pas une jonction';
$ec_lang['lpn_ff_err_unknown']='Aucun résultat. Le code signalé était {code}.';

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
$ec_lang['lpn_file_import_survey']='Importer des points relevés…';
$ec_lang['lpn_file_import_survey_tip']='Lit une liste de points relevés depuis un fichier texte et crée une jonction à chaque point, en reprenant les réglages des nouveaux éléments pour tout ce que le fichier ne précise pas. Aucune conduite n\'est dessinée, et aucune ligne n\'est jamais ignorée sans être nommée. Il utilise le système de coordonnées que ce projet emploie déjà, géoréférencé ou non.';
$ec_lang['lpn_survey_read_error']='Ce fichier n\'a pas pu être lu depuis votre disque.';
$ec_lang['lpn_survey_cancelled']='Rien n\'a été créé et rien n\'a été modifié.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Nord';
$ec_lang['lpn_survey_axis_east']='Est';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Ce fichier ne contient rien.';
$ec_lang['lpn_survey_err_unreadable']='Ce fichier n\'a pas pu être lu comme une liste de points relevés.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Plusieurs colonnes de ce fichier pourraient être le {axis} ({detail}), et cette page ne choisira pas parmi elles. Laissez une seule d\'entre elles nommée comme le {axis} et réessayez.';
$ec_lang['lpn_survey_err_no_points']='Aucune ligne de ce fichier n\'a pu être lue comme un point relevé. Lignes lues : {detail}';
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
$ec_lang['lpn_survey_format_label']='Format de fichier :';
$ec_lang['lpn_survey_format_internal']='spécifié en interne';
$ec_lang['lpn_survey_create']='Créer des nœuds';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='La première ligne a été ignorée : elle ne nomme aucune colonne connue de cette page.';
$ec_lang['lpn_survey_type_label']='Type d\'élément :';
$ec_lang['lpn_survey_confirm_junction']='{n} jonction(s) trouvée(s). Continuer ?';
$ec_lang['lpn_survey_confirm_reservoir']='{n} réservoir(s) trouvé(s). Continuer ?';
$ec_lang['lpn_survey_confirm_tank']='{n} bâche(s) trouvée(s). Continuer ?';
$ec_lang['lpn_survey_report_junction']='{n} jonction(s) importée(s), {m} avec cote.';
$ec_lang['lpn_survey_report_reservoir']='{n} réservoir(s) importé(s), {m} avec cote.';
$ec_lang['lpn_survey_report_tank']='{n} bâche(s) importée(s), {m} avec cote.';
$ec_lang['lpn_survey_report_clean']='Chaque point du fichier a été importé, et rien n\'a été modifié en cours d\'import.';
$ec_lang['lpn_survey_report_notes']='Erreurs et remarques d\'import :';
$ec_lang['lpn_survey_sev_error']='erreur';
$ec_lang['lpn_survey_sev_warning']='avertissement';
$ec_lang['lpn_survey_note_line']='Ligne {line} : {sev} : {code} : {text}';
$ec_lang['lpn_survey_note_row_short']='Trop peu de colonnes pour le format de fichier ci-dessus.';
$ec_lang['lpn_survey_note_coord_missing']='La cellule {axis} est vide.';
$ec_lang['lpn_survey_note_bad_coord']='Le {axis} ne se lit pas comme un nombre.';
$ec_lang['lpn_survey_note_coord_range']='Le {axis} est hors de la plage autorisée par ce projet.';
$ec_lang['lpn_survey_note_bad_elev']='Cote non numérique. Importé sans cote.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Plusieurs colonnes pourraient être la cote, aucune d\'elles n\'a donc été lue.';
$ec_lang['lpn_survey_note_blank_rows']='Lignes vides ignorées : {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Nom déjà utilisé plus tôt dans ce fichier, un nouveau nom a été attribué.';
$ec_lang['lpn_survey_note_id_taken']='Nom déjà présent dans le projet, un nouveau nom a été attribué.';
$ec_lang['lpn_survey_note_id_invalid']='Nom inutilisable ici, un nouveau nom a été attribué.';
$ec_lang['lpn_hotkeys_menu_heading']='Menus';
$ec_lang['lpn_hotkeys_menu_term']='Raccourcis clavier des menus';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Maj+lettre</td><td>Ouvrir le menu portant cette lettre, puis appuyer sur la lettre d\'une ligne pour la choisir. Les lettres s\'affichent pendant que vous utilisez le clavier. Sur Mac, utilisez Ctrl+Option.</td></tr><tr><td>F10</td><td>Aller à la barre de menus.</td></tr></tbody></table>';
$ec_lang['lpn_graphs_menu']='Graphiques';
$ec_lang['lpn_contour_menu']='Courbes de niveau';
$ec_lang['lpn_contour_tip']='Affiche un tracé de courbes de niveau sur la carte : les couleurs des nœuds se diffusent le long des conduites et de part et d\'autre, avec des courbes de niveau étiquetées. Ouvre une boîte pour le régler ou le désactiver.';
$ec_lang['lpn_contour_plot']='Tracé de courbes de niveau';
$ec_lang['lpn_contour_fill']='Remplissage';
$ec_lang['lpn_contour_fill_tip']='Dégradé fond les couleurs d\'une classe à la suivante. Bandes peint chaque classe de la légende des couleurs d\'un aplat.';
$ec_lang['lpn_contour_fill_smooth']='Dégradé';
$ec_lang['lpn_contour_fill_bands']='Bandes';
$ec_lang['lpn_contour_opacity']='Opacité du remplissage';
$ec_lang['lpn_contour_lines']='Courbes de niveau';
$ec_lang['lpn_contour_interval']='Intervalle';
$ec_lang['lpn_contour_buffer']='Zone d\'influence';
$ec_lang['lpn_contour_buffer_unit']='× longueur médiane des conduites';
$ec_lang['lpn_contour_buffer_tip']='Jusqu\'où la couleur s\'étend à partir de chaque conduite, en multiple de la longueur médiane des conduites. Elle s\'estompe sur la partie extérieure.';
$ec_lang['lpn_contour_few']='Trop peu de nœuds pour tracer des courbes de niveau.';
$ec_lang['lpn_contour_support']='Tracé de courbes de niveau : {n} nœuds, interpolés le long de {p} conduites et jusqu\'à {k} fois la longueur médiane des conduites de part et d\'autre. Aucune couleur au travers des pompes, des vannes ou des liaisons fermées.';
$ec_lang['lpn_contour_support_lines']='Courbes de niveau tous les {i} {u}.';
$ec_lang['lpn_contour_too_many']='Trop de courbes de niveau à cet intervalle ; élargissez-le pour les tracer.';
$ec_lang['lpn_contour_dem']='Terrain entre les nœuds d\'après le MNT de Mapbox';
$ec_lang['lpn_contour_dem_tip']='Entre les nœuds, la pression devient la charge interpolée moins la hauteur du terrain d\'après le MNT de Mapbox ; elle peut donc passer sous la pression du nœud le plus bas sur une colline où le réseau n\'a aucun nœud. Considérez le terrain comme une carte de courbes de niveau, non comme un levé.';
$ec_lang['lpn_contour_support_dem']='Entre les nœuds, la pression est la charge interpolée moins la cote du terrain d\'après le MNT de Mapbox, échantillonnée environ tous les {m} m.';
$ec_lang['lpn_contour_dem_failed']='Le terrain n\'a pas pu être lu depuis le MNT de Mapbox ; la pression est donc interpolée entre les nœuds seulement.';
$ec_lang['lpn_contour_consent_1']='Tracer la pression sur le terrain envoie la zone couverte par votre réseau, sous forme de numéros de tuiles cartographiques Mapbox, à api.mapbox.com, afin de lire la hauteur du terrain à cet endroit.';
$ec_lang['lpn_contour_consent_2']='C\'est une question différente de celle des images de carte en arrière-plan de votre projet. Ces images indiquent seulement où vous regardez. Ces tuiles indiquent où se trouve votre réseau. Mapbox recevra ces numéros de tuiles et votre adresse IP. Nous n\'envoyons rien d\'autre : ni nom, ni conduites, ni projet. Nous n\'en gardons aucune trace, et rien n\'est enregistré sur cet appareil, sauf votre réponse à cette question.';
$ec_lang['lpn_contour_consent_3']='Pouvons-nous envoyer à Mapbox les numéros de tuiles de la zone de votre réseau ?';
$ec_lang['lpn_contour_consent_4']='Si vous répondez non, tout le reste de cette page continue de fonctionner exactement comme maintenant, et le tracé de courbes de niveau est dessiné entre les nœuds seulement. Nous retenons un oui pour ne pas avoir à redemander. Un non n\'est pas enregistré du tout.';
$ec_lang['lpn_sysflow_menu']='Bilan des débits';
$ec_lang['lpn_sysflow_tip']='Trace en fonction du temps le débit total produit et le débit total consommé, sur la simulation en période prolongée. Les bâches ne figurent dans aucun des deux totaux ; là où les deux courbes s\'écartent, les bâches se remplissent ou se vident.';
$ec_lang['lpn_sysflow_produced']='Produit';
$ec_lang['lpn_sysflow_produced_tip']='Débit total entrant dans le réseau depuis les réservoirs et depuis les demandes négatives.';
$ec_lang['lpn_sysflow_consumed']='Consommé';
$ec_lang['lpn_sysflow_consumed_tip']='Total de toutes les demandes positives : l\'eau prélevée sur le réseau aux jonctions, et tout débit entrant dans un réservoir.';
$ec_lang['lpn_copy_title']='Marquer le fichier comme nouvelle copie ?';
$ec_lang['lpn_copy_body']='Ce fichier indique avoir été créé le {date}, et ce navigateur ne le reconnaît pas. S\'agit-il du fichier original (conserver le même verrou) ou d\'une copie (créer un nouveau verrou) ?';
$ec_lang['lpn_copy_body_nodate']='Ce navigateur ne reconnaît pas ce fichier. S\'agit-il du fichier original (conserver le même verrou) ou d\'une copie (créer un nouveau verrou) ?';
$ec_lang['lpn_copy_original']='Original ; conserver le même verrou';
$ec_lang['lpn_copy_copy']='Une copie ; créer un nouveau verrou';
$ec_lang['lpn_copy_kept_link']='{name} ouvert comme original, déplacé à un nouvel emplacement. Enregistrer écrit maintenant dans ce fichier.';
$ec_lang['lpn_copy_opened']='{file} ouvert comme copie, avec son propre nouveau verrou, qui sera enregistré lors du prochain enregistrement du fichier.';
$ec_lang['lpn_scenario_basic']='Mode de base';
$ec_lang['lpn_scenario_basic_tip']='Cochée, un scénario est simplement les valeurs que vous y définissez. Décochée, ce menu propose aussi le tableau d\'aperçu des Alternatives, qui montre comment ces valeurs sont regroupées par catégorie et vous invite à donner votre avis.';
$ec_lang['lpn_alt_title']='Aperçu des alternatives';
$ec_lang['lpn_alt_note']='Lecture seule. Base utilise l\'alternative Base de chaque catégorie. Chaque scénario reçoit sa propre alternative pour toute catégorie modifiée, enfant de celle de Base. Le nombre indique combien de valeurs modifiées elle contient.';
$ec_lang['lpn_alt_cat_physical']='Physique';
$ec_lang['lpn_alt_cat_demand']='Demande';
$ec_lang['lpn_alt_cat_topology']='Activation des éléments';
$ec_lang['lpn_alt_cat_initial']='Réglages initiaux';
$ec_lang['lpn_alt_cat_constituent']='Constituant';
$ec_lang['lpn_alt_cat_fireflow']='Débit d\'incendie';
$ec_lang['lpn_alt_cat_energy']='Coût énergétique';
$ec_lang['lpn_alt_cat_userdata']='Propriétés personnalisées';
$ec_lang['lpn_alt_cat_text']='Texte';
$ec_lang['lpn_reports_calib']='Calage';
$ec_lang['lpn_reports_calib_tip']='Compare les données de terrain mesurées d\'un fichier de calage avec le dernier calcul : statistiques, graphique de corrélation et comparaisons des moyennes.';
$ec_lang['lpn_calib_title']='Rapport de calage';
$ec_lang['lpn_calib_param']='Paramètre';
$ec_lang['lpn_calib_param_tip']='La grandeur que mesure le fichier de calage. Un fichier est conservé pour chaque paramètre.';
$ec_lang['lpn_calib_load']='Charger un fichier de calage…';
$ec_lang['lpn_calib_load_tip']='Un fichier texte avec, sur chaque ligne, un identifiant d\'emplacement, un temps et une valeur mesurée. Le temps est mesuré depuis le début de la simulation, en heures décimales ou en heures:minutes. Un point-virgule commence un commentaire. Une ligne contenant seulement un temps et une valeur appartient à l\'emplacement situé au-dessus.';
$ec_lang['lpn_calib_none']='Aucun fichier de calage n\'est chargé pour ce paramètre.';
$ec_lang['lpn_calib_session']='Un fichier de calage est conservé pour cette session seulement. Il n\'est enregistré ni avec le projet ni sur cet appareil.';
$ec_lang['lpn_calib_file']='{file} : {n} mesures à {m} emplacements.';
$ec_lang['lpn_calib_units']='Les valeurs du fichier sont lues dans les unités de ce projet : {unit}.';
$ec_lang['lpn_calib_missing']='Nommés dans le fichier mais absents de ce réseau : {ids}.';
$ec_lang['lpn_calib_missing_count']='Mesures ignorées parce que leur emplacement n\'est pas dans ce réseau : {n}.';
$ec_lang['lpn_calib_bad_lines']='Lignes illisibles, ignorées : {lines}';
$ec_lang['lpn_calib_outside']='Mesures hors des temps rapportés par ce calcul, ignorées : {n}.';
$ec_lang['lpn_calib_no_value']='Mesures sans valeur calculée à leur temps, ignorées : {n}.';
$ec_lang['lpn_calib_single']='Ce calcul porte sur une seule période : chaque mesure est donc comparée à son unique résultat, quel que soit le temps indiqué dans le fichier.';
$ec_lang['lpn_calib_needs_run']='Il n\'y a pas encore de résultats à comparer. Le rapport se remplit une fois le réseau calculé.';
$ec_lang['lpn_calib_no_pairs']='Aucune mesure n\'a pu être comparée, il n\'y a donc rien à tracer.';
$ec_lang['lpn_calib_tab_stats']='Statistiques';
$ec_lang['lpn_calib_tab_corr']='Graphique de corrélation';
$ec_lang['lpn_calib_tab_means']='Comparaisons des moyennes';
$ec_lang['lpn_calib_col_location']='Emplacement';
$ec_lang['lpn_calib_col_n']='Nb obs.';
$ec_lang['lpn_calib_col_obs_mean']='Moyenne observée';
$ec_lang['lpn_calib_col_sim_mean']='Moyenne calculée';
$ec_lang['lpn_calib_col_mean_err']='Erreur moyenne';
$ec_lang['lpn_calib_col_mean_err_tip']='La moyenne des différences absolues entre chaque valeur observée et la valeur calculée au même temps.';
$ec_lang['lpn_calib_col_rms_err']='Erreur RMS';
$ec_lang['lpn_calib_col_rms_err_tip']='Erreur quadratique moyenne : la racine carrée de la moyenne des carrés des différences entre les valeurs observées et calculées.';
$ec_lang['lpn_calib_network']='Réseau';
$ec_lang['lpn_calib_corr_means']='Corrélation entre les moyennes : {r}';
$ec_lang['lpn_calib_corr_none']='Corrélation entre les moyennes : il faut au moins deux emplacements dont les moyennes diffèrent.';
$ec_lang['lpn_calib_axis_obs']='Observé : {q}';
$ec_lang['lpn_calib_axis_sim']='Calculé : {q}';
$ec_lang['lpn_calib_observed']='Observé';
$ec_lang['lpn_calib_computed']='Calculé';
$ec_lang['lpn_calib_point']='{id}, {time} : observé {o}, calculé {s}';
$ec_lang['lpn_calib_corr_note']='Chaque point est une mesure. Plus les points sont proches de la droite diagonale, plus les valeurs calculées se rapprochent des valeurs observées.';
$ec_lang['lpn_calib_ts_point']='Mesuré à {id}, {time} : {v}';
$ec_lang['lpn_calib_ts_note']='Les cercles sont les valeurs mesurées du fichier de calage.';
$ec_lang['lpn_analyze_menu']='Analyser';
$ec_lang['lpn_analyze_menu_tip']='Analyses qui exécutent le réseau sur une copie : débit d\'incendie à chaque jonction, perte de charge de chaque conduite, pompe et vanne, et demandes majorées ou minorées.';
$ec_lang['lpn_ff_design_off']='Aucune vérification';
$ec_lang['lpn_ff_design_all']='Toutes les autres jonctions et toutes les conduites';
$ec_lang['lpn_ff_design_selected']='Les jonctions sélectionnées et leurs conduites';
$ec_lang['lpn_ff_rows_more_links']='Liaisons non affichées : {n}.';
$ec_lang['lpn_crit_menu']='Analyse de criticité…';
$ec_lang['lpn_crit_menu_tip']='Retirer tour à tour chaque conduite, pompe et vanne du réseau et voir ce que le système perd.';
$ec_lang['lpn_crit_title']='Analyse de criticité';
$ec_lang['lpn_crit_intro']='Chaque élément est retiré à tour de rôle du réseau, et le réseau est résolu au pas de temps affiché, dans le scénario actif. Rien n\'est modifié dans votre projet ; tout le calcul se fait sur une copie.';
$ec_lang['lpn_crit_scope']='Liaisons à rompre';
$ec_lang['lpn_crit_scope_tip']='Toutes les conduites, pompes et vannes, ou seulement celles sélectionnées sur la carte. Choisissez l\'ensemble avant de lancer le calcul.';
$ec_lang['lpn_crit_scope_all']='Toutes les liaisons';
$ec_lang['lpn_crit_scope_selected']='Liaisons sélectionnées';
$ec_lang['lpn_crit_minpressure']='Pression minimale admise';
$ec_lang['lpn_crit_minpressure_tip']='C\'est le même nombre que la Pression minimale admise ailleurs dans l\'analyse du débit d\'incendie. Le modifier ici le modifie là.';
$ec_lang['lpn_crit_col_asset']='Élément';
$ec_lang['lpn_crit_col_unserved']='Demande non desservie';
$ec_lang['lpn_crit_col_cutoff']='Jonctions isolées';
$ec_lang['lpn_crit_col_below']='Jonctions sous le minimum';
$ec_lang['lpn_crit_summary']='{n} éléments sur {total} laissent une demande non desservie ou font passer une jonction sous {pressure}.';
$ec_lang['lpn_crit_baseline_below']='Jonctions déjà sous ce seuil sans rien de rompu : {n}. Elles ne sont pas comptées.';
$ec_lang['lpn_crit_working']='En cours : {done} éléments sur {total}.';
$ec_lang['lpn_crit_stopped']='Arrêté après {done} éléments sur {total}. Les résultats ci-dessous sont ceux déjà terminés.';
$ec_lang['lpn_crit_no_selection']='Aucune liaison n\'est sélectionnée. Sélectionnez des liaisons ou choisissez Toutes les liaisons.';
$ec_lang['lpn_crit_no_links']='Ce projet n\'a pas encore de liaison, il n\'y a donc rien à rompre.';
$ec_lang['lpn_crit_busy']='Une autre analyse est en cours. Arrêtez-la, ou attendez qu\'elle se termine.';
$ec_lang['lpn_crit_skipped']='{n} éléments sélectionnés ne sont pas des liaisons ; ils n\'ont donc pas été rompus.';
$ec_lang['lpn_crit_stale']='Le dessin a changé ; les résultats de criticité ont donc été effacés. Relancez l\'analyse.';
$ec_lang['lpn_crit_skipdead']='Ignorer les bouts de réseau';
$ec_lang['lpn_crit_skipdead_tip']='Une liaison de bout de réseau est une liaison dont le retrait isole des jonctions qu\'on ne peut atteindre que par elle, sans réservoir ni bâche au-delà. Sa perte est tout ce qui se trouve au-delà, elle n\'est donc pas résolue. Le résumé indique combien ont été ignorées.';
$ec_lang['lpn_crit_skipped_dead']='Liaisons de bout de réseau ignorées : {n}. Chacune isole tout ce qui se trouve au-delà.';
