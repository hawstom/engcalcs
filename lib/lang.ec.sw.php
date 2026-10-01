<?php

// Kiswahili — All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='sehemu';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/sek';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% kupanda/mlalo';
$ec_lang['u_grade']='kupanda/mlalo';
$ec_lang['u_in2']='in^2';
$ec_lang['u_inh2o']='in H2O';
$ec_lang['u_in']='in';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='L/sek';
$ec_lang['u_m2']='m^2';
$ec_lang['u_m3ps']='m^3/sek';
$ec_lang['u_mgd']='MGD';
$ec_lang['u_imgd']='IMGD';
$ec_lang['u_afd']='ac-ft/d';
$ec_lang['u_lpm']='L/min';
$ec_lang['u_cmh']='m^3/h';
$ec_lang['u_cmd']='m^3/d';
$ec_lang['u_mh2o']='m H2O';
$ec_lang['u_mld']='ML/siku';
$ec_lang['u_m']='m';
$ec_lang['u_mm2']='mm^2';
$ec_lang['u_mmh2o']='mm H2O';
$ec_lang['u_mm']='mm';
$ec_lang['u_mps']='m/sek';
$ec_lang['u_npm2']='N/m^2';
$ec_lang['u_pa']='Pa';
$ec_lang['u_psf']='psf';
$ec_lang['u_psi']='psi';
$ec_lang['u_bar']='bar';
$ec_lang['u_kgfcm2']='kgf/cm^2';
$ec_lang['u_s']='sek';
$ec_lang['u_hr']='saa';
$ec_lang['u_day']='siku';
$ec_lang['u_lph']='L/hr';
$ec_lang['u_gph']='gal/hr';
$ec_lang['u_mmph']='mm/hr';
$ec_lang['u_inph']='in/hr';
$ec_lang['u_acft']='ekari-futi';
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
$ec_lang['menu_brand']='Vikokotoo vya HawsEDC';
$ec_lang['menu_main_hydraulics']='Haidroliki';
$ec_lang['menu_help']='Msaada';
$ec_lang['menu_libre']='Programu Huria';
$ec_lang['template_welcome']='Acha wasiwasi wako mlangoni; hapa upendo unasemwa. Huharibu kila kitu. Furahia <a target="_blank" href="https://hawsedc.com/download.php">zana za bure za HawsEDC AutoCAD</a> pia.';
$ec_lang['template_feedback']='Je, unaweza kupendekeza maneno bora zaidi ya ukurasa huu, au kitu kingine chochote? Unataka kusaidia, au kujifunza kutengeneza vikokotoo kama hivi? Tafadhali wasiliana nami.';
$ec_lang['template_printable_title']='Kichwa cha Kuchapishwa';
$ec_lang['template_printable_subtitle']='Kichwa Kidogo cha Kuchapishwa';
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
$ec_lang['consent_body']='Je, tunaweza kuhifadhi kuki ya tarakimu moja katika kivinjari hiki ili kukumbuka kwamba tayari tumehesabu ukurasa huu? Haihifadhi chochote kukuhusu wala chochote unachoandika. Bila hiyo, hatuwezi kutofautisha ziara yako ya pili na ziara ya kwanza ya mtu mwingine.';
$ec_lang['consent_accept']='Kubali hili';
$ec_lang['consent_accept_all']='Kubali siku zote';
$ec_lang['consent_decline']='Kataa siku zote';
$ec_lang['consent_current_granted']='Ulikubali hili. Tunapunguza urekodiaji kwa kivinjari hiki.';
$ec_lang['consent_current_denied']='Ulikataa hili. Hatuhifadhi chochote cha kupunguza urekodiaji kwa kivinjari hiki.';
$ec_lang['consent_region_label']='Chaguo lako kuhusu kupunguza urekodiaji.';
$ec_lang['consent_settings_link']='Mipangilio ya Cookie';
$ec_lang['privacy_link']='Taarifa ya Faragha';
$ec_lang['terms_link']='Masharti ya Matumizi';
$ec_lang['index_main_title']='Vikokotoo vya Uhandisi Bure Mtandaoni';
$ec_lang['index_meta_desc_plain']='Vikokotoo bure vya uhandisi wa majimaji kwa ajili ya mabomba, mifereji, vizingiti vya maji na umwagiliaji. Hufanya kazi kwenye kivinjari chako, hufanya kazi bila mtandao, na vinapatikana katika lugha 27.';
$ec_lang['calc_set_units']='Weka vitengo:';
$ec_lang['calc_set_units_tip']='Huweka kitengo cha kila sehemu mara moja. Haiharibu: namba ulizoandika zinabaki kama zilivyo, na kila moja sasa inasomwa kwa kitengo kipya. 6 inabaki 6, lakini sasa inamaanisha inchi 6 badala ya milimita 6.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Rejesha chaguo-msingi';
$ec_lang['calc_defaults_confirm']='Weka upya kikokotoo hadi thamani za awali za chaguo-msingi?';
$ec_lang['points_data_note']='(au Nakili/Bandika ukitumia eneo la data)';
$ec_lang['points_data_heading']='Data za kikokotoo<br />(tumia Nakili kuona umbizo)';
$ec_lang['points_data_copy']='Nakili';
$ec_lang['points_data_paste']='Bandika';
$ec_lang['calc_inputs']='Maingizo';
$ec_lang['calc_results']='Matokeo';
$ec_lang['view_hide_line']='Ficha mstari huu';
$ec_lang['view_printable']='Toleo la kuchapishwa (pakia upya ili kurejesha)';
$ec_lang['ec_name_label']='Hifadhi hesabu hii:';
$ec_lang['ec_name_placeholder']='Jina';
$ec_lang['ec_name_tip']='Huhifadhi maingizo haya kwenye URL kwa ajili ya kuweka alama, kurejea historia, na kushiriki';
$ec_lang['calc_copy_link']='Nakili kiungo';
$ec_lang['ec_related_calcs']='Vikokotoo vinavyohusiana:';
$ec_lang['calc_copy_link_done']='Imenakiliwa!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Upotevu wa Kimo cha Bomba la Darcy-Weisbach';
$ec_lang['dw_main_title']='Kikokotoo cha Bure Mtandaoni cha Upotevu wa Kimo cha Bomba la Darcy-Weisbach';
$ec_lang['dw_main_desc']='Upotevu wa Kimo cha Bomba la Darcy-Weisbach kwa Kipenyo, Usuguo, na Mtiririko Uliowekwa';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Kina kamili cha usuguo, e, wa ukuta wa bomba. Thamani za kawaida: chuma (kipya) 0.046 mm, chuma (kilichotumika) 0.15 mm, HDPE 0.003 mm, PVC/uPVC 0.0015 mm, zege 0.3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s kwa maji safi kwenye 20°C">Mnato wa kinematiki, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Mnato wa kinematiki, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s kwa maji safi kwenye 20°C';
$ec_lang['dw_reynolds_number']='Nambari ya Reynolds, Re';
$ec_lang['dw_flow_regime']='Utaratibu wa mtiririko';
$ec_lang['dw_regime_laminar']='tulivu';
$ec_lang['dw_regime_transitional']='mpito';
$ec_lang['dw_regime_turbulent']='msukosuko';
$ec_lang['dw_friction_factor_method']='Njia ya kipengele cha msuguano';
$ec_lang['dw_friction_factor']='Kipengele cha msuguano, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Upotevu wa Kimo cha Bomba la Hazen-Williams';
$ec_lang['hw_main_title']='Kikokotoo cha Bure Mtandaoni cha Upotevu wa Kimo cha Bomba la Hazen-Williams';
$ec_lang['hw_main_desc']='Upotevu wa Kimo cha Bomba la Hazen-Williams kwa Kipenyo, Usuguo, na Mtiririko Uliowekwa';
$ec_lang['hw_hgl_1']='HGL ya Chini ya Mkondo';
$ec_lang['hw_hgl_2']='HGL ya Juu ya Mkondo';
$ec_lang['hw_elev_up']='Mwinuko wa juu ya mkondo';
$ec_lang['hw_pressure_up']='Shinikizo la juu ya mkondo';
$ec_lang['hw_elev_down']='Mwinuko wa chini ya mkondo';
$ec_lang['hw_pressure_down']='Shinikizo la chini ya mkondo';
$ec_lang['hw_pressure_check']='Ukaguzi wa shinikizo';
$ec_lang['hw_pressure_ok_short']='Shinikizo chanya';
$ec_lang['hw_pressure_neg_short']='Shinikizo hasi';
$ec_lang['hw_pressure_neg']='Shinikizo la chini ya mkondo liko chini ya sifuri. HGL inashuka chini ya bomba, hivyo bomba halitatiririsha likiwa limejaa, na matokeo haya huenda yasiwe sahihi.';
$ec_lang['hw_roughness']='Mgawo wa Hazen-Williams, C';
$ec_lang['hw_note_1']='<dl><dt>Kikokotoo hiki hakiigi mwinuko wa bomba kati ya ncha mbili.</dt><dd>Hutumia tu miinuko ya juu na chini ya mkondo unayoingiza. Ikiwa ardhi inapanda juu zaidi ya ncha yoyote mahali fulani katikati, shinikizo katika sehemu hiyo ya juu kabisa ni ndogo kuliko shinikizo lolote lililoripotiwa hapa. Endesha kikokotoo tena kwa urefu kutoka ncha ya juu ya mkondo hadi sehemu ya juu kabisa ili kuikagua.</dd><dd>Pale HGL inaposhuka chini ya bomba, maji huwa chini ya shinikizo hasi. Hewa hutoka kwenye myeyusho, bomba lenye kuta nyembamba linaweza kubonyea, na maji machafu ya ardhini yanaweza kuvutwa ndani kupitia viungio. Weka bomba chini ya shinikizo chanya kila mahali, na fikiria kuweka vali ya hewa kwenye kila sehemu ya juu kabisa.</dd><dt>Shinikizo la juu ya mkondo ni hali ya mpaka unayoitoa wewe mwenyewe.</dt><dd>Lisome kutoka kwa kipimo (gauge), kutoka kwa kiwango cha maji cha tangi (kimo cha maji juu ya bomba), au kutoka kwa mkondo wa pampu (pump curve). Pampu hutoa shinikizo dogo zaidi kadiri mtiririko unavyoongezeka, hivyo tumia sehemu ya mkondo huo inayolingana na mtiririko ulioingizwa hapo juu.</dd><dt>Jumlisha mgawo wa upotevu mdogo (wa ndani) K mwenyewe.</dt><dd>Jumlisha thamani za K za kila vali, kigeuzo, tee, mita, na muingilio kwenye mstari, kisha ingiza jumla hiyo. Fuata kiungo kwenye ingizo hilo kupata thamani za kawaida. Katika bomba kuu refu la usafirishaji, upotevu huu ni mdogo ukilinganisha na msuguano, lakini katika mabomba mafupi ya kituo unaweza kuwa sehemu kubwa ya upotevu.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Mfereji wa Mkato Usio wa Kawaida wa Manning';
$ec_lang['mi_main_title']='Kikokotoo cha Bure Mtandaoni cha Mfereji wa Mkato Usio wa Kawaida wa Manning';
$ec_lang['mi_main_desc']='Kikokotoo cha Mtiririko Sawia wa Mfereji wa Mkato Usio wa Kawaida wa Manning';
$ec_lang['mi_waterSurfaceElevation']='Kiwango cha uso wa maji';
$ec_lang['mi_q_617']='<span class="ec-help" title="Mtiririko mchanganyiko, Q, ukitumia n mchanganyiko kwa kila eneo kulingana na Chow 6-17, kasi sawa">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Nukta za mkato mtambuka';
$ec_lang['mi_groupPoint']='Nukta';
$ec_lang['mi_groupSegment']='Sehemu';
$ec_lang['mi_groupRegion']='Eneo';
$ec_lang['mi_station']='Stn';
$ec_lang['mi_elevation']='Mwinuko';
$ec_lang['mi_n']='n kwa<br />sehemu';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />mpaka wa<br />eneo<br />(Ukingo)';
$ec_lang['mi_tau']='Msongo<br />wa chini<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n<br />mchanganyiko';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='n mchanganyiko';
$ec_lang['mi_notes_1_def']='Kikokotoo hiki kinafuata Mwongozo wa Marejeleo wa HEC-RAS katika kuhesabu n mchanganyiko wa eneo ukitumia Chow 1959, ukurasa 136, mlinganyo 6-17 (si 6-18).';


$ec_lang['mi_notes_2_term']='Kifuniko cha mawe';
$ec_lang['mi_notes_2_def']='Tumia Kikokotoo cha Mfereji wa Trapezoidi wa Manning kubuni kifuniko cha mawe. Kikokotoo hiki kinafaa zaidi kwa sehemu za asili.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Mtiririko wa Bomba la Manning';
$ec_lang['mpf_main_title']='Kikokotoo cha Bure Mtandaoni cha Mtiririko wa Bomba la Manning';
$ec_lang['mpf_main_desc']='Mtiririko Sawia wa Bomba la Fomula ya Manning kwa Mteremko na Kina Kilichowekwa';
$ec_lang['mpf_pipe_diameter']='Kipenyo cha bomba, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Mgawo wa usuguo wa Manning, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Mteremko wa msuguano, S<sub>f</sub></a><span class="ec-help" title="Labda sawa na mteremko wa bomba. Fuata kiungo kwa maelezo (kwa Kiingereza pekee)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Uwiano wa kina cha mtiririko, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Mtiririko, Q';
$ec_lang['mpf_flow_tip']='Mtiririko na kina vinahesabiwa kwa bomba refu bila kikomo. Kupata mtiririko huu ndani ya bomba huenda kukahitaji kina cha juu zaidi cha maji juu ya mlango. Angalia Maelezo hapa chini kwa maelezo zaidi na video ya mafunzo.';
$ec_lang['mpf_velocity']='Kasi, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Nishati ya kinetiki ikiwa kimo cha safu ya maji, v²/2g">Kimo cha kasi, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Eneo la mtiririko, A';
$ec_lang['mpf_pipe_area']='Eneo la bomba, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Uwiano wa eneo, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Mzingo ulioloweshwa, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Radiasi ya kihaidroliki, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Upana wa juu, T';
$ec_lang['mpf_froude_number']='Nambari ya Froude, Fr';
$ec_lang['mpf_shear_stress']='Msongo wastani wa mkato, τ';
$ec_lang['mpf_full_flow']='Mtiririko kamili, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Uwiano wa mtiririko kamili, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Huu ni mtiririko na kina ndani ya bomba la <em>urefu usio na kikomo</em>.</dt><dd>Kuingiza mtiririko kwenye bomba kunaweza kuhitaji kina cha maji juu ya mlango kinachozidi zaidi. Ongeza angalau mara 1.5 ya kimo cha kasi ili kupata kina hicho, au <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">tazama mafunzo yangu ya dakika 2</a> kwa mahesabu ya kawaida ya maji ya juu ya mkondo ya bomba la kupita ukitumia <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, programu huru ya bomba la kupita kutoka Utawala wa Shirikisho wa Barabara Kuu wa Marekani.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Unabuni mfereji wa maji taka?</dt><dd>Angalia <a target="_blank" href="/sewslope.php">majedwali ya mteremko wa chini kabisa wa mfereji wa maji taka</a> kwa bomba la inchi 4 hadi 96 (mm 100 hadi 2400), yaliyotolewa katika m/m, mm/m na asilimia, na utafiti wa <a target="_blank" href="/peakfact.php">vigezo vya kilele kwa mtiririko mdogo sana</a>. Nyaraka zote mbili ni za marejeleo kwa Kiingereza pekee.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Weka Q lengwa chanya.';
$ec_lang['mpf_solver_no_solution']='Hakuna suluhisho: Q inazidi uwezo wa bomba katika y/d0 = 93.8% (Qmax = {qmax} katika vitengo vilivyochaguliwa).';
$ec_lang['mpf_solve_btn']='Suluhisha';
$ec_lang['mpf_solve_for_flow']='kwa mtiririko, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Upotevu wa Kimo cha Bomba la Manning';
$ec_lang['mphl_main_title']='Kikokotoo cha Bure Mtandaoni cha Upotevu wa Kimo cha Bomba la Manning';
$ec_lang['mphl_main_desc']='Upotevu wa Kimo wa Fomula ya Manning kwa Mtiririko Kamili Uliowekwa';
$ec_lang['mphl_pipe_length']='Urefu wa bomba, L';
$ec_lang['mphl_area']='Eneo, A';
$ec_lang['mphl_total_junction_k']='Mgawo wa upotevu wa ndani, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Mgawo wa upotevu, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Mgawo wa upotevu wa ndani (usiotokana na msuguano), km. Upotevu huu hutokea kwenye viungio vya mabomba, maingilio, matokeo, mapinde, na vali — neno "ndani" ni la kawaida katika matumizi lakini linaweza kupotosha; katika mstari mfupi wa bomba upotevu huu unaweza kulingana na au kuzidi upotevu wa msuguano. Thamani za kawaida za k: maingilio yenye ukingo mkali 0.5, kila pinde la 45° 0.2–0.3, vali ya lango (ikiwa wazi kabisa) 0.1, vali ya kipepeo 0.2, mtoko (kuelekea hifadhi ya maji au hewani) 1.0. Jumlisha viungio vyote kupata jumla ya km. Thamani chaguo-msingi ya 2.0 inadhania maingilio moja, mtoko mmoja, na mapinde mawili ya 45°.';
$ec_lang['mphl_friction_slope']='Mteremko wa msuguano';
$ec_lang['mphl_friction_loss']='Upotevu wa msuguano, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Upotevu wa ndani, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Upotevu jumla, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='EGL ya Chini ya Mkondo';
$ec_lang['mphl_egl_2']='EGL ya Juu ya Mkondo';
$ec_lang['mphl_hgl_egl_tip']='Jibu hili huenda lisiwe sahihi pale bomba linapoinuka juu ya mstari wa kimo cha maji.';
$ec_lang['mphl_note_1']='<dl><dt>Kikokotoo hiki hakizingatii mwinuko wa bomba kati ya ncha zake mbili.</dt><dd>Ikiwa HGL inashuka chini ya sehemu ya juu ya bomba popote, hesabu hii huenda isiwe sahihi.</dd><dt>Kwa hali ya mlango wazi (bomba la kupita), ni lazima kukagua hali za udhibiti wa mlango.</dt><dd>1. HGL ya juu ya mkondo lazima iwe juu ya kiwango cha mtiririko wa kina cha kawaida cha juu ya mkondo (na juu ya bomba!).</dd><dd>2. Maji ya juu ya mkondo ya bomba la kupita yanawakilishwa vizuri zaidi na EGL ya juu ya mkondo kuliko HGL ya juu ya mkondo.</dd><dd>3. Tazama <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">mafunzo yangu ya dakika 2</a> kwa mahesabu rahisi ya kawaida ya maji ya juu ya mkondo ya bomba la kupita ukitumia <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, programu huru ya bomba la kupita kutoka Utawala wa Shirikisho wa Barabara Kuu wa Marekani.</dd><dd>4. Ukurasa huu hutatua hali ya udhibiti wa mlango wa kutokea pekee: bomba linalotiririsha likiwa limejaa, ambapo hali za chini ya mkondo ndizo huamua kimo. Ubunifu wa bomba la kupita ni kazi ya kuamua kama udhibiti wa mlango wa kuingia au mlango wa kutokea ndio unaotawala, hivyo tumia HY-8 wakati wowote ambapo lolote kati ya hayo linaweza kutokea.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Mfereji wa Trapezoidi wa Manning';
$ec_lang['mtc_main_title']='Kikokotoo cha Bure Mtandaoni cha Mfereji wa Trapezoidi wa Fomula ya Manning';
$ec_lang['mtc_main_desc']='Mtiririko Sawia wa Mfereji wa Trapezoidi wa Fomula ya Manning kwa Mteremko na Kina Vilivyowekwa';
$ec_lang['mtc_bottom_width']='Upana wa chini, b';
$ec_lang['mtc_side_slope_1']='Mteremko wa upande 1, z<sub>1</sub> (usawa/wima)';
$ec_lang['mtc_side_slope_2']='Mteremko wa upande 2, z<sub>2</sub> (usawa/wima)';
$ec_lang['mtc_channel_slope']='Mteremko wa mfereji, S';
$ec_lang['mtc_flow_depth']='Kina cha mtiririko, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Pembe ya Kona, β</a><span class="ec-help" title="Kwa kupanga ukubwa wa mawe ya kinga. Fuata kiungo kwa mchoro."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Uzito unaohusiana na maji. Kwa kawaida ≈ 2.65 kwa jiwe lililopondwa.">Uzito maalum wa jiwe, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Ukubwa wa jiwe la kubuni, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n kwa ukubwa wa jiwe la kubuni (njia ya Strickler)';
$ec_lang['mtc_n_blodgett']='n kwa ukubwa wa jiwe la kubuni (njia ya Blodgett)';
$ec_lang['mtc_n_bathurst']='n kwa ukubwa wa jiwe la kubuni (njia ya Bathurst)';
$ec_lang['mtc_n_pi']='n kwa ukubwa wa jiwe la kubuni (njia ya Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett dhidi ya Bathurst';
$ec_lang['mtc_pi_range_check']='Ukaguzi wa wigo wa P&I';
$ec_lang['mtc_pi_ok']='d50 iko ndani ya wigo wa P&I';
$ec_lang['mtc_pi_ok_tip']='futi 0.28–0.36 (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Nje ya wigo';
$ec_lang['mtc_pi_tip']='Unakadiria nje ya wigo wa data ya futi 0.28–0.36 uliotumika kutengeneza mlinganyo huu — chukulia kama ukaguzi wa haraka, si msingi wa kubuni';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Kulingana na Isbash (1936) na Maricopa County, Arizona, US.">Ukubwa wa jiwe la pembe unaohitajika chini, D<sub>50</sub> (Isbash na MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Kulingana na Isbash (1936) na Maricopa County, Arizona, US.">Ukubwa wa jiwe la pembe unaohitajika kwa mteremko wa upande 1, D<sub>50</sub> (Isbash na MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Kulingana na Isbash (1936) na Maricopa County, Arizona, US.">Ukubwa wa jiwe la pembe unaohitajika kwa mteremko wa upande 2, D<sub>50</sub> (Isbash na MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Kulingana na Maynord, Ruff, na Abt (1989). Kwenye kona, jiwe hupimwa kwa kasi ya kona ya 4/3 ya wastani, kulingana na California Division of Highways (1970); thamani ya awali ya Maynord ya 1.5 hutumika kwa mikondo ya asili.">Ukubwa wa jiwe la pembe unaohitajika, D<sub>50</sub> (Maynord, Ruff, na Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Ukubwa wa jiwe la pembe unaohitajika, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Kasi inakubalika kwa makadirio ya mtiririko sawia.';
$ec_lang['mtc_vel_low']='Kasi ya chini — hatari ya mashapo.';
$ec_lang['mtc_vel_high']='Kasi ni ya juu na huenda isiwe halisi; kagua mmomonyoko wa kifuniko cha mfereji, kina cha ziada kwenye mapinda, na upotevu wa nishati kwenye mapanuko au vizuizi.';
$ec_lang['mtc_iteration_tip']='Chagua chaguo la usuguo (Blodgett–Bathurst inapendekezwa) na chaguo la ukubwa wa jiwe (Isbash inapendekezwa) ili kikokotoo kirudie hatua kiotomatiki hadi kufikia ukubwa sawa wa jiwe kwa mtiririko unaolengwa. Angalia Maelezo hapa chini kwa mbinu kamili, au ingiza thamani yako ya usuguo (fuata kiungo kwa mwongozo) na upuuze ukubwa wa jiwe ili kuruka marudio.';
$ec_lang['mtc_note_1']='<dl><dt>Marudio ya kiotomatiki ya ubunifu wa ukubwa wa jiwe na usuguo</dt><dd>Chagua chaguo la usuguo (Blodgett–Bathurst inapendekezwa) na chaguo la ukubwa wa jiwe la kubuni (Isbash inapendekezwa). Rekebisha kina na kipengele cha usalama cha ukubwa wa jiwe ili kufikia mtiririko unaolengwa kwa ukubwa sawa wa jiwe. Kila unapobadilisha thamani ya ingizo, kikokotoo hurudia hatua hizi: 1. Ukakamavu huhesabiwa kutoka ukubwa wa jiwe la kubuni. 2. Hesabu ya usuguo iliyoombwa hunakiliwa kwenye usuguo wa ingizo. 3. Mtiririko wa mfereji na ukubwa wa jiwe unaohitajika huhesabiwa. 4. Ukubwa wa jiwe la kubuni hurekebishwa. 5. Rudia hadi hitilafu katika ukubwa wa jiwe la kubuni iwe ndogo sana.</dd><dt>Kikokotoo cha msingi (bila marudio)</dt><dd>Ingiza thamani yako ya usuguo unayotaka. Puuza eneo la ingizo la ukubwa wa jiwe la kubuni.</dd></dl>';
$ec_lang['mtc_note_2_term']='Ukaguzi wa kasi';
$ec_lang['mtc_note_2_def']='Kasi ya juu inaonyesha kulikuwa na anguko kubwa la mwinuko lililosababisha nishati mahususi ya juu namna hiyo. Nishati hiyo inaweza kupotea haraka kwenye mapanuko, mapinda, au vizuizi. Thibitisha kwamba hii inafaa kwa eneo husika.';
$ec_lang['mtc_solver_no_solution']='Hakuna suluhisho lililopatikana kwa Q iliyotolewa na ingizo hizi za mfereji.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Mtiririko wa Kizingiti cha Maji Rahisi';
$ec_lang['ws_main_title']='Kikokotoo cha Bure Mtandaoni Rahisi cha Mtiririko wa Kizingiti cha Maji Chenye Ukingo Mpana';
$ec_lang['ws_main_desc']='Kikokotoo Rahisi cha Mtiririko wa Kizingiti cha Maji Chenye Ukingo Mpana';
$ec_lang['ws_weirLength']='Urefu wa kizingiti cha maji, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Nishati kwa kila kitengo cha uzito wa maji — kimo cha safu ya maji, si shinikizo.">Kimo, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Mgawo wa kizingiti cha maji, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Maelezo';
$ec_lang['ws_notes_we_term']='Mlinganyo wa Kizingiti cha Maji';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Mtiririko wa Kizingiti cha Maji — Wasifu Usio wa Kawaida';
$ec_lang['wi_main_title']='Kikokotoo cha Bure Mtandaoni cha Mtiririko wa Kizingiti cha Maji wenye Sehemu Nyingi, Kina Kinachobadilika, na Wasifu Usio wa Kawaida';
$ec_lang['wi_main_desc']='Kikokotoo cha Mtiririko wa Kizingiti cha Maji chenye Wasifu Usio wa Kawaida';
$ec_lang['wi_weirPoints']='Vituo vya kizingiti cha maji';
$ec_lang['wi_pondingHeight']='Urefu wa Kutuama kwa Maji';
$ec_lang['wi_incrementalFlow']='Mtiririko wa Ziada';
$ec_lang['wi_cumulativeFlow']='Mtiririko Jumla';
$ec_lang['wi_notes_we_def']='q = kama (urefu = 0) basi 0 vinginevyo kama (mteremko=0) basi cw*urefu*d<sub>0</sub><sup>1.5</sup> vinginevyo cw/(2.5*mteremko) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) ambapo d<sub>1</sub> na d<sub>0</sub> daima ni chanya au sifuri';
// Orifice Flow
$ec_lang['or_main_menu']='Mtiririko wa Tundu';
$ec_lang['or_main_title']='Kikokotoo cha Bure Mtandaoni cha Mtiririko wa Tundu';
$ec_lang['or_main_desc']='Mtiririko wa Tundu — Huru au Uliozama';
$ec_lang['or_shape_circular']='Duara';
$ec_lang['or_shape_rectangular']='Mstatili';
$ec_lang['or_diameter']='<span class="ec-help" title="Kipenyo kwa duara; urefu kwa mstatili">Kipenyo au urefu, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Ufunguzi wa mstatili tu">Upana, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Chini ya ufunguzi">Kiwango cha chini <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Kiwango cha maji juu';
$ec_lang['or_twe']='Kiwango cha maji chini';
$ec_lang['or_cd']='Mgawo wa kutoka, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Kiwango cha katikati';
$ec_lang['or_head']='<span class="ec-help" title="Nishati kwa kila kitengo cha uzito wa maji — kimo cha safu ya maji, si shinikizo.">Kimo cha ufanisi, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Eneo la ufunguzi, A';
$ec_lang['or_regime']='Ukaguzi wa utaratibu wa tundu';
$ec_lang['or_regime_valid']='Kutoka huru';
$ec_lang['or_regime_submerged']='Tundu lililozama';
$ec_lang['or_regime_submerged_tip']='TWE juu ya katikati — utaratibu wa tundu bado ni halali';
$ec_lang['or_regime_warn']='Nje ya utaratibu wa tundu';
$ec_lang['or_regime_warn_tip']='Maji ya juu yako chini ya kilele (sehemu ya juu ya ndani) ya ufunguzi.';
$ec_lang['or_regime_twe_above_hwe']='Angalia maingizo';
$ec_lang['or_regime_twe_above_hwe_tip']='Maji ya chini (TWE) juu ya maji ya juu (HWE)';
$ec_lang['or_notes_1_term']='Mlinganyo wa Tundu';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Kwa kutoka huru: h = HWE − katikati. Kwa mtiririko uliozama (TWE juu ya kiwango cha chini): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Utaratibu wa Tundu';
$ec_lang['or_notes_2_def']='Mlinganyo wa mtiririko wa tundu unatumika wakati uso wa maji ya juu uko juu ya kilele (juu) ya ufunguzi. Wakati maji ya juu yako chini ya kilele, tumia mlinganyo wa kizingiti cha maji badala yake.';
$ec_lang['or_notes_3_term']='Mgawo wa Kutoka';
$ec_lang['or_notes_3_def']='C<sub>d</sub> inaanzia takriban 0.60–0.65 kwa matundu yenye makingo makali. Matundu yenye makingo ya mviringo au yanayoingia hutumia thamani tofauti. Tazama <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> au Mwongozo wa Marejeleo wa HEC-RAS Hydraulic kwa mwongozo.';
$ec_lang['or_notes_4_term']='Kuzama';
$ec_lang['or_notes_4_def']='Wakati TWE iko juu ya kiwango cha chini cha ufunguzi, kikokotoo hiki kinatumia kiotomatiki mlinganyo wa tundu lililozama ukitumia h = HWE − TWE. Wakati TWE iko kwenye au chini ya kiwango cha chini, kutoka huru kunakadiriwa na h = HWE − katikati.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Umeme Mdogo wa Maji';
$ec_lang['mhp_main_title']='Kikokotoo cha Bure cha Mtandaoni cha Umeme Mdogo wa Maji';
$ec_lang['mhp_main_desc']='Kikokotoo cha Uzalishaji wa Umeme Mdogo wa Maji kutoka Mtiririko wa Mto (Bila Bwawa)';
$ec_lang['mhp_gross_head']='Kimo cha jumla, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Kipenyo cha bomba la shinikizo (bomba la kusambaza maji)">Kipenyo cha bomba la shinikizo, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Urefu, L';
$ec_lang['mhp_efficiency']='Ufanisi wa kiwanda, η (0–1)';
$ec_lang['mhp_vel_check']='Ukaguzi wa kasi';
$ec_lang['mhp_hl_check']='Ukaguzi wa upotevu wa kimo';
$ec_lang['mhp_hnet']='Kimo halisi, H<sub>net</sub>';
$ec_lang['mhp_power']='Nguvu inayotolewa, P';
$ec_lang['mhp_annual_kwh']='P kama nishati ya kila mwaka';
$ec_lang['mhp_vel_low']='Kasi ni ya chini; hatari ya mchanga kujilimbikiza na hewa kuingia majini.';
$ec_lang['mhp_vel_high']='Kasi ni ya juu; kagua upotevu wa mpito, nishati inayopatikana, na hatari ya mshtuko wa maji.';
$ec_lang['mhp_vel_ok_short']='Sawa';
$ec_lang['mhp_vel_high_short']='Juu';
$ec_lang['mhp_vel_low_short']='Chini';
$ec_lang['mhp_vel_ok_tip']='Kasi iko katika kiwango kinachofaa kwa ubunifu wa bomba la shinikizo.';
$ec_lang['mhp_hl_ok_tip']='Upotevu wa kimo ni chini ya 10% ya kimo jumla. Ukubwa huu wa bomba ni wa kiuchumi.';
$ec_lang['mhp_hl_warn_tip']='Upotevu wa kimo unazidi 10% ya kimo jumla. Fikiria bomba kubwa zaidi.';
$ec_lang['mhp_hl_bad_tip']='Upotevu wa kimo unazidi 20% ya kimo jumla. Badilisha ukubwa wa bomba.';
$ec_lang['mhp_notes_1_term']='Upotevu wa Kimo';
$ec_lang['mhp_notes_1_def']='Jumla ya upotevu wa bomba la shinikizo h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, ambapo h<sub>f</sub> = f(L/D)(v²/2g) ni upotevu wa msuguano wa Darcy-Weisbach na h<sub>m</sub> = k<sub>m</sub>·v²/2g ni upotevu wa ndani kwenye mlango wa kuingilia, mipinda, na valvu. Kimo halisi H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Kasi';
$ec_lang['mhp_notes_2_def']='Hakikisha kasi ni ya kiasi kinachofaa kwa kushuka kunakopatikana na gharama ya bomba. Kasi ya chini sana inaweza kuonyesha bomba kubwa kupita kiasi; kasi ya juu sana inaweza kuongeza upotevu wa msuguano na hatari ya mshtuko wa maji.';
$ec_lang['mhp_notes_3_term']='Lengo la Upotevu wa Kimo';
$ec_lang['mhp_notes_3_def']='Upotevu wa bomba la kusambaza (penstock) chini ya 10% ya kimo cha jumla cha maji kwa kawaida huwa wa kiuchumi. Uwiano bora kati ya gharama ya bomba na nguvu inayopotea mara nyingi huwa karibu 4–6% pale bei ya umeme ikiwa juu zaidi.';
$ec_lang['mhp_notes_6_term']='Ufanisi';
$ec_lang['mhp_notes_6_def']='Ufanisi wa kawaida wa kiwanda η huanzia 0.70 hadi 0.85 kwa turbine za Pelton na turbine za mtiririko mtambuka zinazotumika sana katika mitambo midogo ya umeme wa maji. Tumia 0.75 kama makadirio ya awali ya kihafidhina.';
$ec_lang['mhp_notes_7_term']='Nishati ya Kila Mwaka';
$ec_lang['mhp_notes_7_def']='Nishati ya kila mwaka inadhania uendeshaji endelevu wa mtiririko kamili (masaa 8760 kwa mwaka). Uzalishaji halisi utakuwa mdogo zaidi kutokana na mabadiliko ya msimu wa mtiririko, muda wa kusimama kwa matengenezo, na kipengele cha mzigo.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Muda wa Kumwagika kwa Bwawa na Tanki';
$ec_lang['odt_main_title']='Kikokotoo cha Bure Mtandaoni cha Muda wa Kumwagika kwa Bwawa, Bonde, na Tanki (Tundu)';
$ec_lang['odt_main_desc']='Muda wa Kumwagika kwa Bwawa, Bonde, au Tanki — Utokaji wa Tundu, Njia ya Kiasi cha Koni';
$ec_lang['odt_h1_elev']='Kiwango cha awali cha uso wa maji';
$ec_lang['odt_a1']='Eneo la awali, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Kiwango cha mwisho cha uso wa maji';
$ec_lang['odt_a0']='Eneo la kiwango cha tundu, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Imekadiriwa kutoka mfano wa koni kwenye kiwango cha mwisho">Eneo la mwisho, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Ukaguzi wa kiwango cha mwisho';
$ec_lang['odt_h2_ok']='Kiwango cha mwisho juu ya sehemu ya juu ya tundu';
$ec_lang['odt_h2_warn']='Kiwango cha mwisho kwenye au chini ya sehemu ya juu ya tundu';
$ec_lang['odt_h2_warn_tip']='Sehemu ya juu ya tundu = katikati + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Kipenyo (duara) au urefu (mstatili)">Kipenyo cha tundu D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Mstatili tu">Upana wa tundu, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Muda wa kumwagika (s)';
$ec_lang['odt_t_min']='Muda wa kumwagika (dak)';
$ec_lang['odt_t_hr']='Muda wa kumwagika (saa)';
$ec_lang['odt_t_day']='Muda wa kumwagika (siku)';
$ec_lang['odt_notes_1_term']='Fomula';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) inatoa muda wa kumwagika kutoka kwa kimo H hadi kwenye tundu. Muda wa kumwagika = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), ambapo H<sub>1</sub> = kiwango cha awali − kiwango cha tundu, H<sub>2</sub> = kiwango cha mwisho − kiwango cha tundu.';
$ec_lang['odt_notes_2_term']='Njia';
$ec_lang['odt_notes_2_def']='Njia ya kiasi cha koni inamodelisha bwawa au bonde kama sehemu ya koni kati ya eneo la awali A<sub>1</sub> kwenye uso wa maji wa awali na eneo A<sub>0</sub> kwenye kiwango cha katikati cha tundu. A<sub>2</sub>, eneo la bwawa kwenye kiwango cha mwisho, hukadiriwa kutoka A<sub>1</sub> na A<sub>0</sub> ukitumia mfano wa sehemu ya koni. Muda wa kumwagika kutoka kiwango cha awali hadi mwisho ni sawa na jumla ya muda wa kumwagika kutoka H<sub>1</sub> hadi kwenye tundu ukitoa muda wa kumwagika uliobaki kutoka H<sub>2</sub> hadi kwenye tundu.';
$ec_lang['odt_h1']='<span class="ec-help" title="Kiwango cha awali cha uso wa maji ukitoa kiwango cha katikati cha tundu">Kimo cha awali, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Mtiririko wa juu, Q<sub>max</sub>';
$ec_lang['odt_vol']='Kiasi kilichomwagwa';
$ec_lang['odt_sketch_start']='Mwanzo';
$ec_lang['odt_sketch_end']='Mwisho';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Nafasi ya kituo cha maji, S<sub>e</sub>';
$ec_lang['ip_sl']='Nafasi ya bomba la tawi, S<sub>l</sub>';
$ec_lang['ip_n_e']='Vituo vya maji kwa kila bomba la tawi, n<sub>e</sub>';
$ec_lang['ip_n_l']='Mabomba ya tawi kwa kila eneo, n<sub>l</sub>';
$ec_lang['ip_d']='Kina cha lengo la kunyunyizia maji, d';
$ec_lang['ip_a_e']='Eneo kwa kila kituo cha maji, A<sub>e</sub>';
$ec_lang['ip_pr']='Kiwango cha kunyunyizia maji, PR';
$ec_lang['ip_q_lat']='Mtiririko kwa kila bomba la tawi, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Mtiririko wa eneo, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Muda wa uendeshaji (masaa)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Upotevu wa Mfereji';
$ec_lang['cs_main_title']='Kikokotoo cha Bure cha Mtandaoni cha Upotevu wa Mfereji kwa Kuingia Ardhini na Ufanisi wa Usafirishaji';
$ec_lang['cs_main_desc']='Upotevu wa Mfereji kwa Kuingia Ardhini & Ufanisi wa Usafirishaji — Njia ya Mtiririko wa Kuingia-Kutoka';
$ec_lang['cs_Q_in']='Mtiririko wa kuingia, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Mtiririko wa kutoka, Q<sub>out</sub>';
$ec_lang['cs_L']='Urefu wa sehemu, L';
$ec_lang['cs_Q_loss']='Kiwango cha upotevu wa maji ardhini, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Ukaguzi wa kipimo';
$ec_lang['cs_pct_loss']='Upotevu kama sehemu';
$ec_lang['cs_Ec']='Ufanisi wa usafirishaji, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Tathmini ya ufanisi';
$ec_lang['cs_Vol_day']='Kiasi kinachopotea kila siku';
$ec_lang['cs_Vol_year']='Kiasi kinachopotea kila mwaka';
$ec_lang['cs_Q_loss_per_L']='Upotevu kwa kila kitengo, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Thamani ya maji';
$ec_lang['cs_lining_cost']='Gharama ya kusaruji';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Lengo la ufanisi wa usafirishaji baada ya kusaruji; sehemu 0–1">Lengo la ufanisi, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Eneo la kusaruji, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Thamani ya kila mwaka inayopotea';
$ec_lang['cs_annual_value_recovered']='Thamani ya kila mwaka inayorejeshwa';
$ec_lang['cs_lining_total_cost']='Jumla ya gharama za kusaruji';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Kulipwa rahisi = jumla ya gharama za kusaruji ÷ thamani ya kila mwaka inayorejeshwa">Kipindi cha kulipwa <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — upotevu wa maji umegunduliwa';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — hakuna upotevu unaoweza kupimwa';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — kagua vipimo';
$ec_lang['cs_Ec_good']='Nzuri — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Ya kati — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Mbaya — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='Njia ya mtiririko wa kuingia-kutoka inakadiria upotevu wa maji ardhini kwa kupima mtiririko mwanzoni na mwishoni mwa sehemu ya mfereji: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Ufanisi wa usafirishaji E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Kiasi cha kila mwaka kinadhania uendeshaji wa mtiririko kamili bila kukoma; upotevu halisi ni mdogo zaidi kwa mifereji ya msimu au yenye mtiririko wa sehemu.';
$ec_lang['cs_notes_2_term']='Viwango vya Ufanisi';
$ec_lang['cs_notes_2_def']='Mifereji ya kawaida ya udongo isiyosarujiwa: E<sub>c</sub> = 60–80%. Mifereji ya udongo iliyotunzwa vizuri: 75–85%. Mifereji iliyosarujiwa: 90–98%. Upotevu wa maji ardhini zaidi ya 30% ya mtiririko wa kuingia mara nyingi unahalalisha uwekezaji wa kusaruji. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Kulipwa kwa Kusaruji';
$ec_lang['cs_notes_3_def']='Ingiza thamani ya maji na gharama ya kusaruji kwa sarafu yoyote thabiti. Eneo la kusaruji = urefu wa sehemu × mzingo ulioloweshwa — mzingo ulioloweshwa wa mkato wa mfereji kwenye kina cha mtiririko kilichopimwa (upana wa chini pamoja na miteremko yote iliyoloweshwa). Thamani ya kila mwaka inayorejeshwa inadhania mfereji uliosarujiwa unafikia lengo la E<sub>c</sub> bila kukoma. Kulipwa kwa kweli kutakuwa kwa muda mrefu zaidi kwa mifereji ya msimu au ikiwa kusaruji hakufikii ufanisi wa lengo.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, toleo la 3 (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='Kuhusu';
$ec_lang['install_main_menu']='Sakinisha';
$ec_lang['install_main_title']='Sakinisha EngCalcs';
$ec_lang['install_main_desc']='Ongeza kwenye kifaa chako kwa matumizi bila mtandao';
$ec_lang['install_intro']='EngCalcs ni Programu ya Wavuti Inayoendelea (Progressive Web App, PWA). Ikishasakinishwa, vikokotoo vyote hufanya kazi bila mtandao — hauhitaji muunganisho wa intaneti.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Fungua ukurasa wowote wa kikokotoo kwenye Chrome.</li><li>Gusa kitufe cha <strong>⬇ Sakinisha</strong> kwenye upau wa juu wa urambazaji, au gusa menyu ya kivinjari (⋮) kisha uchague <strong>Ongeza kwenye Skrini ya Kwanza</strong>.</li><li>Gusa <strong>Sakinisha</strong> kwenye ujumbe utakaotokea.</li><li>EngCalcs itaonekana kwenye skrini yako ya kwanza na itafanya kazi bila mtandao.</li>';
$ec_lang['install_now_btn']='⬇ Sakinisha Sasa';
$ec_lang['install_prompt_unavailable']='Ujumbe wa usakinishaji haupatikani — tumia menyu ya kivinjari chako badala yake.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Fungua ukurasa wowote wa kikokotoo kwenye Safari.</li><li>Gusa kitufe cha <strong>Shiriki</strong> (sanduku lenye mshale unaoelekea juu).</li><li>Telemka chini kisha ugusa <strong>Ongeza kwenye Skrini ya Kwanza</strong>.</li><li>Gusa <strong>Ongeza</strong>. EngCalcs itaonekana kwenye skrini yako ya kwanza.</li>';
$ec_lang['install_ios_note']='Kwenye iOS, usakinishaji hutumia menyu ya Shiriki pekee — hakuna ujumbe wa usakinishaji wa moja kwa moja.';
$ec_lang['install_desktop_heading']='Kompyuta ya Mezani (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Fungua ukurasa wowote wa kikokotoo.</li><li>Bofya <strong>alama ya usakinishaji</strong> (⊕ au alama ya kompyuta) kwenye upau wa anwani wa kivinjari, au fungua menyu ya kivinjari kisha uchague <strong>Sakinisha EngCalcs…</strong></li><li>Bofya <strong>Sakinisha</strong>. EngCalcs itafunguka kama dirisha huru la programu.</li>';
$ec_lang['install_firefox_heading']='Firefox / Vivinjari Vingine';
$ec_lang['install_firefox_body']='Iwapo kivinjari chako hakitoi chaguo la kusakinisha, hakuna kilichopotea: tumia vikokotoo kama kawaida kupitia kivinjari, na baada ya ziara yako ya kwanza kurasa huhifadhiwa kiotomatiki kwa matumizi bila mtandao. Firefox kwenye kompyuta ya mezani ndiyo hali ya kawaida.';
$ec_lang['install_cached_heading']='Kinachohifadhiwa';
$ec_lang['install_cached_body']='Mara ya kwanza unaposakinisha EngCalcs, kurasa zote za vikokotoo na faili zake za msaada (hati za programu, mitindo) huhifadhiwa kiotomatiki kwenye kifaa chako. Baada ya hapo, kila kitu hufanya kazi bila muunganisho wa intaneti. Chaguo lako la lugha hukumbukwa kutoka ziara yako ya mwisho ukiwa mtandaoni.';
$ec_lang['contact_main_menu']='Wasiliana';
$ec_lang['about_main_title']='Kuhusu Vikokotoo vya Uhandisi HawsEDC';
$ec_lang['about_main_desc']='Dhamira, Programu Huria, na Kuchangia';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Dhamira</h3><p>Vikokotoo vya Uhandisi vya HawsEDC vipo ili kutumikia wahandisi na wafanyakazi wa shambani duniani kote — hasa wale wanaofanya kazi katika maeneo yenye upungufu wa maji, rasilimali chache, au yanayohudumwa kidogo. Zana hizi ni sehemu ya dhamira pana ya kibinadamu: kumwambia kila mtu kwa njia ya vitendo na yenye ufanisi zaidi iwezekanavyo kwamba wanapendwa na kuthaminiwa milele, kwamba hawana chochote cha kuogopa, na kwamba hawataharabu kila kitu.</p><p>Vikokotoo ni gari. Marudio ni ulimwengu usio na mateso.</p><h3>Leseni ya Programu Huria na Chanzo Wazi</h3><p>Msimbo wote unatolewa chini ya <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 or later</a> — huru kama uhuru. Unaweza kutumia, kusoma, kubadilisha, na kusambaza tena msimbo chini ya masharti yale yale.</p><p>Huu ni mwaliko, si bei. Hakuna kiwango cha kulipia, hakuna kiwango cha bure kinachoweza kuondolewa, na hakuna kuchelewa kabla msimbo haujawa wako. Toleo kamili unaloliona leo ni huru kwa kila mtu, sasa na milele, kutumia na kubadilisha.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Msimbo wa Chanzo</h3><p>Msimbo wote wa chanzo unapatikana hadharani kwenye GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Unaweza kuvinjari msimbo, kuripoti matatizo, au kugawanya hifadhi huko.</p><h3>Kuchangia</h3><p>Msaada wowote unakaribishwa. <a href="contact.php">Wasiliana na Tom Haws</a>.</p><ul><li><strong>Tafsiri:</strong> Pendekeza maneno bora. Boresha au ongeza lugha.</li><li><strong>Ripoti za hitilafu:</strong> Tumia fomu ya maoni katika ukurasa wowote wa kikokotoo, au ripoti tatizo kwenye GitHub.</li><li><strong>Vikokotoo vipya:</strong> Mawazo ya zana za uhandisi wa majimaji zinazohudumia wafanyakazi wa shambani na wataalamu wa umwagiliaji yanakaribishwa sana.</li><li><strong>Uandikishaji:</strong> Ikiwa unaweza kuakisi vikokotoo hivi kwa eneo lenye muunganisho mdogo wa mtandao, tafadhali wasiliana nami.</li></ul><h3>Matumizi Bila Mtandao</h3><p>Vikokotoo hivi vinafanya kazi kama <strong>Programu ya Wavuti Inayoendelea (PWA)</strong>. Tembelea ukurasa wowote wa kikokotoo ukiwa umeunganishwa na mtandao, na kivinjari chako kitahifadhi vikokotoo vyote kiotomatiki. Baada ya hapo, vikokotoo vyote vinafanya kazi bila mtandao — hakuna mtandao unaohitajika.</p><p>Kwenye Android au iOS, tumia chaguo la "Ongeza kwenye Skrini ya Nyumbani" katika kivinjari chako ili kusakinisha EngCalcs kama programu kwenye kifaa chako. Kwenye kompyuta ya mezani, tafuta ikoni ya usakinishaji katika upau wa anwani wa kivinjari chako.</p><p>Unaweza pia kuhifadhi kikokotoo chochote kwa kutumia menyu ya "Hifadhi kama…" ya kivinjari chako kwa matumizi ya mara moja bila mtandao.</p><h3>Mawasiliano</h3><p>Tom Haws — mhandisi wa majimaji na mwandishi wa vikokotoo hivi.<br />Tumia fomu ya maoni katika ukurasa wowote wa kikokotoo, au fikia msimbo wa chanzo kwenye <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Tuma Tom Haws ujumbe';
$ec_lang['contactYourName']='Jina lako:';
$ec_lang['contactYourEmail']='Anwani yako ya barua pepe:';
$ec_lang['contactSubject']='Mada:';
$ec_lang['contact_message']='Ujumbe:';
$ec_lang['contactSpamPrefix']='Tano pamoja na moja ni sawa na';
$ec_lang['contactSpamPostfix']='(Tafadhali andika kwa maneno. 1=moja 2=mbili 3=tatu 4=nne 5=tano 6=sita 7=saba +=pamoja 5+1=6)';
$ec_lang['contactSubmitButton']='Tuma Ujumbe';
$ec_lang['contact_success']='Asante kwa kuchukua muda wa kuandika.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Usanifu wa Mfereji wa Mawe (Robinson)';
$ec_lang['rc_main_title']='Kikokotoo cha Bure cha Mtandaoni cha Usanifu wa Mfereji wa Mawe — Robinson (1998)';
$ec_lang['rc_main_desc']='Upimaji wa Ukubwa wa Mawe ya Kuzuia Mmomonyoko kwa Mfereji wa Mawe wa Mwinuko — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Mteremko wa sakafu ya mfereji, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Mtiririko kwa kila upana kwenye ingizo la mfereji wa mawe. Kwa mfereji wenye upana wa chini B na jumla ya mtiririko Q, tumia q_t = Q / B.">Jumla ya mtiririko wa kila upana, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Upenyo wa mawe ya kuzuia mmomonyoko, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Uzito unaohusiana na maji. Graniti au basalti iliyovunjwa kwa kawaida ≈ 2.65. Wigo halali wa Robinson: 2.54 hadi 2.82.">Uzito maalum wa mawe, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Mkengeuko wa kawaida wa mgawanyiko wa ukubwa. Mawe yenye ukubwa sawa ≈ 1.25. Wigo halali wa Robinson: 1.15 hadi 1.47.">Mgawanyiko wa ukubwa SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Kutuama kwa maji (Hp > yn) ni jambo zuri — hupunguza mmomonyoko juu ya mkondo. (USDA)">Kina cha kawaida kwenye njia ya ingizo, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Mwa. 1 (S0 < 0.10) au Mwa. 2 (0.10-0.40). Halali: D50 15-278 mm, S0 0.02-0.40. Nje ya wigo: imekadiriwa.">Ukubwa wa wastani wa mawe unaohitajika, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Mlinganyo uliotumika';
$ec_lang['rc_sg_check']='Ukaguzi wa uzito maalum';
$ec_lang['rc_SD_check']='Ukaguzi wa mgawanyiko wa ukubwa SD';
$ec_lang['rc_sg_ok']='sg iko ndani ya wigo halali';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']='sg chini ya wigo wa Robinson';
$ec_lang['rc_sg_low_tip']='Wigo halali: 2.54–2.82';
$ec_lang['rc_sg_high']='sg juu ya wigo wa Robinson';
$ec_lang['rc_sg_high_tip']='Wigo halali: 2.54–2.82';
$ec_lang['rc_SD_ok']='SD iko ndani ya wigo halali';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']='SD chini ya wigo wa Robinson';
$ec_lang['rc_SD_low_tip']='Wigo halali: 1.15–1.47';
$ec_lang['rc_SD_high']='SD juu ya wigo wa Robinson';
$ec_lang['rc_SD_high_tip']='Wigo halali: 1.15–1.47';
$ec_lang['rc_layer']='Unene wa safu ya mawe (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Radiasi ya upinde wa kilele cha juu (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Urefu wa upinde wa kilele cha juu';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Kunahitajika kwa msaada wa kimuundo wa mawe ya mfereji. “Kiwango cha chini cha maji ya mkia kinachotokana na mkondo wa kutokea na upinzani wa njia ya chini ya mkondo kinatosha kuhakikisha uthabiti wa mawe ya kuzuia mmomonyoko katika mkondo wa kutokea.” (Robinson)">Urefu wa sakafu ya kutokea (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Usuguo wa Manning ndani ya mfereji, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Sehemu ya q_t inayopita kwenye mianya ya mawe. Kiasi kilichobaki q_s hutiririka juu ya uso. Upenyo wa msingi n_p = 0.45 kwa mawe yaliyovunjwa yenye pembe kali.">Kasi kupitia tabaka la mawe, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Mtiririko wa kila upana kupitia tabaka la mawe, q<sub>m</sub>';
$ec_lang['rc_qs']='Mtiririko wa kila upana wa juu ya uso, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Kina cha mtiririko juu ya uso wa mawe, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Kutuama kwa maji (Hp > yn) ni jambo zuri — hupunguza mmomonyoko juu ya mkondo. (USDA)">Kimo cha bwawa cha ingizo, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Ukaguzi wa kutuama kwa maji kwenye ingizo';
$ec_lang['rc_pond_ok']='H<sub>p</sub> > y<sub>n</sub> — maji yanatuama juu ya mkondo';
$ec_lang['rc_pond_ok_tip']='Maji kutuama juu ya mkondo kabla ya ingizo la mfereji ni jambo zuri; hupunguza mmomonyoko juu ya mkondo. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — hakuna kutuama kwa maji — hatari ya mmomonyoko kwenye ingizo';
$ec_lang['rc_pond_warn_tip']='Hakuna kutuama kwa maji juu ya mkondo kabla ya ingizo la mfereji; mmomonyoko unaweza kutokea juu ya mkondo. (USDA)';
$ec_lang['rc_eq1']='Mwa. 1 (S<sub>0</sub> < 0.10) — mteremko laini';
$ec_lang['rc_eq2']='Mwa. 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — mteremko mkali';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — chini ya wigo wa uthibitisho wa Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — juu ya wigo wa uthibitisho wa Robinson';
$ec_lang['rc_notes_1_term']='Milinganyo ya Kupima Ukubwa wa Mawe';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) walitengeneza milinganyo miwili ya kimajaribio kwa ukubwa wa wastani wa mawe D<sub>50</sub>, kulingana na mteremko wa mfereji na mtiririko wa kila upana. Mlinganyo wa 1 unatumika kwa miteremko laini (S<sub>0</sub> < 0.10); Mlinganyo wa 2 unatumika kwa miteremko mikali (0.10 ≤ S<sub>0</sub> ≤ 0.40). Milinganyo yote miwili inahitaji q<sub>t</sub> katika m²/s na hutoa D<sub>50</sub> katika mm. Wigo ulioidhinishwa ni 0.02 ≤ S<sub>0</sub> ≤ 0.40.';
$ec_lang['rc_notes_2_term']='Mtiririko wa Kila Upana';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> ni jumla ya mtiririko wa kila upana kwenye kilele cha mfereji (jumla ya mtiririko kwa kila upana wa mfereji). Kwa mfereji wenye upana wa chini B unaobeba jumla ya mtiririko Q, kadiria q<sub>t</sub> ≈ Q / B, au ukokotoe kutoka kwa hali ya kina-muhimu kwenye ingizo la mfereji.';
$ec_lang['rc_notes_3_term']='Mtiririko Kupitia Tabaka la Mawe';
$ec_lang['rc_notes_3_def']='Sehemu ya jumla ya mtiririko hupita kupitia mianya ya mawe ya kuzuia mmomonyoko (mtiririko wa ndani wa tabaka, q<sub>m</sub>); kiasi kilichobaki hutiririka juu ya uso wa mawe (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). Kina cha mtiririko d hukokotolewa kutoka kwa mlinganyo wa Manning ukitumika kwa mtiririko wa uso q<sub>s</sub> na usuguo wa mfereji n. Upenyo wa msingi n<sub>p</sub> = 0.45 ni wa kawaida kwa mawe yaliyovunjwa yenye pembe kali.';
$ec_lang['rc_notes_5_term']='Wigo Halali wa Ukubwa wa Mawe';
$ec_lang['rc_notes_5_def']='Milinganyo ilitengenezwa ikitumia wigo wa D<sub>50</sub> kuanzia 15 mm hadi 278 mm. Matokeo nje ya wigo huu ni makadirio na yanapaswa kutumika pamoja na uamuzi wa ziada wa kihandisi.';
$ec_lang['rc_notes_6_term']='Mwinuko wa Sakafu ya Kutokea';
$ec_lang['rc_notes_6_def']='Mwinuko wa juu ya mawe katika mkondo wa kutokea unapaswa kuwa sawa na au chini ya mwinuko wa sakafu ya mkondo wa chini. Ukiwa juu zaidi, mawe ya kutokea hayatakuwa thabiti.';

$ec_lang['rc_notes_7_def']='Kina cha kawaida katika njia ya ingizo kinapokuwa chini ya kimo cha bwawa (H<sub>p</sub>) kinachohitajika kupitisha q<sub>t</sub>, mtiririko mdogo au kutuama kwa maji hutokea juu ya mkondo kabla ya ingizo la mfereji. Hii kwa ujumla inakubalika — kutuama kwa maji hupunguza kasi na huzuia mmomonyoko juu ya mkondo. Kukagua: tumia kikokotoo cha mtiririko wa bwawa kupata H<sub>p</sub> kwa q<sub>t</sub> na upana wa kilele uliopewa, kisha ulinganishe na kina cha kawaida cha njia ya ingizo. Ikiwa H<sub>p</sub> inazidi kina cha kawaida, kutuama kwa maji kutatokea.';
$ec_lang['rc_notes_4_term']='Marejeo';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Usanifu wa mifereji ya mawe ya mwinuko</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS pia inachapisha <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">lahajedwali la Excel</a> linalotumia mbinu ile ile.';
// Sketch labels
$ec_lang['rc_sketch_filter']='Kichujio';
$ec_lang['rc_sketch_top_crest_curve']='Upinde wa Kilele cha Juu';
$ec_lang['rc_sketch_outlet_apron']='Sakafu ya Kutokea';
$ec_lang['rc_sketch_radius']='radiasi';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Shinikizo la Umwagiliaji';
$ec_lang['ip_main_title']='Kikokotoo cha Bure cha Mtandaoni cha Shinikizo la Umwagiliaji & Usawa wa Usambazaji';
$ec_lang['ip_main_desc']='Shinikizo la Tawi la Jaribio na Ukadiriaji wa Usawa wa Usambazaji';
$ec_lang['ip_h_supply']='Shinikizo la usambazaji';
$ec_lang['ip_elev_supply']='Mwinuko wa usambazaji, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Mtiririko wa kubuni wa kituo cha maji, q<sub>design</sub>';
$ec_lang['ip_h_design']='Shinikizo la kubuni la kituo cha maji';
$ec_lang['ip_x']='<span class="ec-help" title="0.5 kwa vituo vya maji vya kawaida visivyofidia shinikizo; karibu 0 kwa vituo vya maji vinavyofidia shinikizo">Kipeo cha utoaji wa kituo cha maji, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Njia ya jaribio';
$ec_lang['ip_group_reach']='Sehemu ya bomba';
$ec_lang['ip_group_upstream']='Juu ya Mkondo';
$ec_lang['ip_group_downstream']='Chini ya Mkondo';
$ec_lang['ip_group_loss']='Upotevu';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Imechaguliwa: sehemu hii ni kipande cha bomba la tawi la jaribio, ambako vituo vya maji mmoja mmoja huchota maji. Haijachaguliwa: sehemu hii ni bomba kuu, inayopitisha mtiririko tu kwa mabomba ya tawi yasiyo kwenye njia ya jaribio.">Tawi <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Safu za tawi: vituo vya maji vilivyo katika sehemu hii tu. Safu za bomba kuu: jumla ya vituo vya maji kwenye mabomba ya tawi MENGINE yanayotokana na sehemu hii. Kwa sehemu ya bomba kuu inayoishia kwenye bomba la tawi la jaribio, hii pia inajumuisha mabomba yoyote ya tawi yaliyo mbele zaidi kwenye bomba kuu, au yanayoshiriki kiungo kile kile (k.m. tawi la upande wa pili) — mtiririko wake pia hutokana na sehemu hii hii.">Vituo vya Maji <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Mwinuko wa ncha ya chini ya mkondo ya sehemu hii. Si lazima kwa safu za ndani (ikiachwa tupu huchukuliwa kuwa tambarare / sawa na nodi ya juu). Ni lazima kwa safu ya mwisho: thamani hiyo ni mwinuko wa kituo cha mwisho cha maji, unaoamua moja kwa moja shinikizo la usambazaji linalohitajika.">Mwinuko wa Chini <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Mwinuko wa kituo cha mwisho cha maji (safu ya mwisho) uliachwa tupu na ulichukuliwa kuwa tambarare — kiingize ili kupata matokeo sahihi';
$ec_lang['ip_press']='Shin.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Jumla ya upotevu wa sehemu, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Shinikizo la chini/hasi — angalia hali za chini ya anga';
$ec_lang['ip_pressure_warn_short']='Chini';
$ec_lang['ip_pressure_high']='Sehemu zenye shinikizo kubwa zinahitaji kupunguza shinikizo';
$ec_lang['ip_pressure_high_short']='Juu';
$ec_lang['ip_max_head']='Shinikizo la juu linaloruhusiwa la bomba';
$ec_lang['ip_max_head_tip']='Mistari ambayo shinikizo lake linazidi thamani hii huwekwa alama. Acha wazi ili kuruka ukaguzi wa shinikizo kubwa.';
$ec_lang['ip_h_far']='Shinikizo la kituo cha mwisho cha maji';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Mtiririko unaoingia kwenye njia ya jaribio iliyoigwa tu — kwa eneo/mfumo mzima, angalia Q_zone katika Usanifu wa Matumizi hapa chini.">Mtiririko wa usambazaji wa njia ya jaribio, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Mtiririko wa kituo cha mwisho cha maji, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Wastani wa mtiririko wa kituo cha maji (tawi la jaribio), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="Ni kiasi gani cha juu zaidi (au chini zaidi) unavyokadiria bomba la tawi la kawaida hufanya kazi ukilinganisha na tawi hili la jaribio. Tawi la jaribio limechaguliwa makusudi kama hali mbaya zaidi inayodhaniwa, hivyo wastani wake wenyewe ni kikadirio kidogo kuliko wastani wa shambani — ikiachwa 0, ukaguzi wa usawa na namba za usanifu wa matumizi hapa chini hutumia wastani wa tawi la jaribio lenyewe (ambao huenda ni wa matumaini kupita kiasi) kama ulivyo.">Kadirio la Δshinikizo, wastani dhidi ya tawi la jaribio <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral inayokokotolewa upya kwa shinikizo la kila safu ya tawi pamoja na tofauti ya shinikizo iliyoingizwa hapo juu — jaribio la kusahihisha kwamba tawi la jaribio ni hali mbaya zaidi inayodhaniwa, si wakilishi. Hulisha ukaguzi wa usawa na sehemu ya usanifu wa matumizi hapa chini.">Kadirio la wastani wa mtiririko wa kituo cha maji shambani, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Mtiririko uliokokotolewa wa kituo cha mwisho cha maji ukigawanywa kwa kadirio la wastani wa mtiririko wa kituo cha maji shambani — hii ni kadirio la usawa wa usambazaji wa robo ya chini wa kawaida (wastani wa kundi la chini ÷ wastani wa jumla wa watu wote); hii inatokana na sampuli ndogo iliyoigwa na masahihisho yaliyokadiriwa na mtumiaji badala ya sampuli kamili ya kitakwimu ya shamba zima. Thamani sawa na au zaidi ya 1 zinawezekana na ni sahihi: zinamaanisha tu kwamba shinikizo la kituo cha mwisho cha maji liko sawa na au juu ya wastani wa shambani uliokadiriwa, hivyo kituo kingine cha maji ndicho chenye shinikizo la chini kabisa. Hili linaweza kuwa kwa sababu kituo cha mwisho cha maji kiko mahali pa chini, au kwa sababu kadirio la Δshinikizo ni dogo mno.">Ukaguzi wa usawa, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Shinikizo kwenye kituo cha maji cha jaribio ni ≥ shinikizo la usambazaji. Huenda hiki si kituo cha maji chenye hali mbaya zaidi, au mabomba yanaweza kupunguzwa ukubwa.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Hii ni tofauti na kadirio letu la kipimo cha kawaida cha usawa.">Mtiririko wa kituo cha mwisho cha maji ÷ mtiririko wa kubuni, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Hakuna suluhisho: shinikizo la usambazaji linalohitajika linazidi shinikizo la usambazaji lililoingizwa. Ongeza shinikizo la usambazaji, punguza mahitaji, au tumia bomba kubwa zaidi.';
$ec_lang['ip_notes_1_def']='Hukisia shinikizo kwenye kituo cha mwisho (cha mbali zaidi) cha maji, kisha hufuatilia Mstari wa Nishati kurudi kuelekea usambazaji, sehemu kwa sehemu, huku ukiongeza upotevu wa msuguano na upotevu wa ndani njiani. Mwinuko na kimo cha kasi hutolewa kwenye kila nodi ili kuripoti shinikizo halisi hapo. Shinikizo lililokisiwa la ncha ya mbali hurekebishwa (kwa njia ya kugawa mara mbili) hadi shinikizo la usambazaji linalohitajika lililokokotolewa lilingane na shinikizo la usambazaji lililoingizwa — tatizo lile lile la mzunguko funge linaloshughulikiwa na kisuluhishi cha mtiririko wa bomba kwenye kikokotoo cha Mtiririko wa Bomba la Manning, likipanuliwa hadi mtandao wenye matawi.';
$ec_lang['ip_notes_2_term']='Sehemu za Bomba Kuu dhidi ya za Tawi';
$ec_lang['ip_notes_2_def']='Kila safu ni sehemu moja ya bomba kwenye njia moja mbaya zaidi kihaidroliki (njia ya jaribio) kutoka usambazaji hadi kituo cha mwisho cha maji. Sehemu ya Bomba Kuu hupitisha mtiririko tu kwa mabomba ya tawi yasiyo kwenye njia ya jaribio, hivyo uchotaji wake ni kuzidisha rahisi (mtiririko wa kubuni × jumla ya vituo vya maji vya sehemu hiyo) — bila usikivu wa shinikizo la mahali. Bomba kuu ni bomba shina la pamoja, hivyo sehemu ya bomba kuu inayoishia kwenye bomba la tawi la jaribio lazima ijumuishe si tu mabomba ya tawi yaliyo kati ya ncha zake bali pia mabomba ya tawi yoyote yaliyo mbele zaidi kwenye bomba kuu baada ya mahali hapo, au yanayoshiriki kiungo kile kile (k.m. tawi la upande wa pili) — mtiririko wake hupitia sehemu ile ile kabla ya kujitenga, yawepo au yasiwepo mahali pengine kwenye jedwali hili. Sehemu ya Tawi ni kipande cha bomba la tawi la jaribio lenyewe: utoaji wa kituo cha maji hukokotolewa kutoka kwa shinikizo halisi la mahali kwa q = k·H<sup>x</sup>, na upotevu wa msuguano hupunguzwa kwa kigezo F(n) cha Christiansen ili kuzingatia kupungua kwa mtiririko kila kituo cha maji katika sehemu hiyo kinapochota maji.';
$ec_lang['ip_notes_3_term']='Vikomo';
$ec_lang['ip_notes_3_def']='Huiga shinikizo moja la usambazaji lisilobadilika (bila mkondo wa pampu), njia moja tu ya jaribio (si shamba zima), na mkondo wa kituo cha maji wenye vigezo viwili (weka kipeo karibu na 0 ili kukadiria kituo cha maji kinachofidia shinikizo). Uwiano mbili tofauti wa usawa huripotiwa, zikitenganishwa makusudi: q<sub>last</sub>/q<sub>avg,field</sub> ni kadirio la usawa wa usambazaji wa robo ya chini wa kawaida (wastani wa kundi la chini ÷ wastani wa jumla wa watu wote); lakini hii inatokana na sampuli ndogo iliyoigwa na masahihisho yaliyokadiriwa na mtumiaji badala ya sampuli kamili ya kitakwimu ya shamba zima. Zaidi ya hayo, tawi la jaribio limechaguliwa makusudi kama hali mbaya zaidi inayodhaniwa, hivyo wastani wake mbichi usiosahihishwa ungepunguza wastani halisi wa shambani na kufanya usawa uonekane bora kuliko ulivyo; ingizo la Δshinikizo lipo mahususi kupambana na upendeleo huo. Thamani za usawa sawa na au zaidi ya 1 bado zinawezekana: zinamaanisha tu kwamba shinikizo la kituo cha mwisho cha maji liko sawa na au juu ya wastani wa shambani uliokadiriwa, hivyo kituo kingine cha maji ndicho chenye shinikizo la chini kabisa. Hili linaweza kuwa kwa sababu kituo cha mwisho cha maji kiko mahali pa chini, au kwa sababu kadirio la Δshinikizo ni dogo mno. q<sub>last</sub>/q<sub>design</sub> ni ukaguzi mwingine, usiohusu usawa, dhidi ya mtiririko uliopangwa na mtengenezaji — unafaa kwa kubaini mfumo wenye shinikizo la juu au la chini kupita kiasi kwa ujumla, lakini ni ukaguzi tofauti wa kusoma pamoja na namba ya usawa, kwa kuwa mtiririko wa kubuni/uliopangwa hauna uhusiano wa lazima na shinikizo halisi la wastani la uendeshaji wa mfumo.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. Viwango vya ASAE/ASABE kwa usanifu wa umwagiliaji wa matone hutumia mbinu ile ile ya upotevu wa msuguano wa sehemu nyingi za kutoa maji.';
$ec_lang['ip_notes_5_term']='Usanifu wa Matumizi';
$ec_lang['ip_notes_5_def']='Kiwango cha kunyunyizia maji na mtiririko wa mfumo/eneo hutumia kadirio la wastani wa mtiririko wa kituo cha maji shambani (q<sub>avg,field</sub> — wastani wa tawi la jaribio lenyewe, uliosahihishwa kwa kadirio la Δshinikizo lililoingizwa), si kiwango kilichokisiwa: PR = q<sub>avg,field</sub> / A<sub>e</sub>, kikilishwa na thamani iliyoigwa iliyosahihishwa. Nafasi na idadi za mabomba ya tawi/vituo vya maji vya mfumo mzima ni maingizo tofauti hapa kwa sababu njia ya jaribio inaiga tawi moja tu la hali mbaya zaidi, si kila tawi shambani.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Mtandao wa Bomba wenye Matawi';
$ec_lang['bpn_main_title']='Kikokotoo cha Bure Mtandaoni cha Shinikizo la Mtandao wa Bomba wenye Matawi (Bila Mizunguko)';
$ec_lang['bpn_main_desc']='Mtiririko na Shinikizo la Mtandao wa Bomba wenye Matawi (Mti)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Kimo tuli cha usambazaji: kimo cha chanzo wakati mtiririko ni sifuri. Kiwango cha maji katika hifadhi au tanki juu ya mwinuko wa usambazaji, au kimo cha kufungwa cha pampu. Ongeza vituo vya usambazaji 2 na 3 kufafanua mkondo wa pampu au usambazaji unaobadilika; zana husoma kimo kwenye mtiririko wa kubuni.';
$ec_lang['bpn_elev_source']='Mwinuko wa usambazaji';
$ec_lang['bpn_q_total']='Jumla ya mtiririko';
$ec_lang['bpn_q_total_tip']='Jumla ya mtiririko unaotoka kwenye chanzo (jumla ya mahitaji yote kwenye mtandao).';
$ec_lang['bpn_p_min']='Shinikizo la chini kabisa';
$ec_lang['bpn_p_min_tip']='Shinikizo la chini kabisa chini ya mkondo popote kwenye mtandao; kituo muhimu zaidi cha kusambaza maji.';
$ec_lang['bpn_method']='Njia ya msuguano';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Mistari ya bomba';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Jina la mstari huu wa bomba. Mistari mingine hurejelea kwake katika safu ya Juu ya Mkondo.';
$ec_lang['bpn_upstream']='Kitambulisho cha Juu ya Mkondo';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='Kitambulisho cha mstari unaolisha huu. Acha wazi ili kufuata mstari ulio juu yake moja kwa moja (bomba la mfululizo rahisi). Ingiza kitambulisho hapa ili kuchipuka kutoka kwa mstari mwingine.';
$ec_lang['bpn_roughness_tip']='Usuguo wa bomba kwa njia ya msuguano iliyochaguliwa: n ya Manning, C ya Hazen-Williams, au kimo cha usuguo cha Darcy-Weisbach e (urefu). Bomba la plastiki laini la kawaida: n karibu 0.009, C karibu 150, e karibu 0.0015 mm.';
$ec_lang['bpn_demand']='Mahitaji';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Mtiririko uliowekwa unaotolewa kwenye ncha ya chini ya mkondo ya mstari huu.';
$ec_lang['bpn_demand_mult']='Kizidishi cha mahitaji';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Huzidisha mahitaji ya kila mstari kwa wakati mmoja, kwa ajili ya saa ya kilele au ukuaji wa baadaye. Tumia 1 kwa mahitaji kama yalivyoingizwa.';
$ec_lang['bpn_elev_down']='Mwinuko wa CM';
$ec_lang['bpn_q_line']='Mtiririko wa mstari';
$ec_lang['bpn_q_line_tip']='Jumla ya mtiririko unaobebwa na mstari huu: mahitaji yake yenyewe pamoja na mahitaji yote ya chini ya mkondo unayolisha.';
$ec_lang['bpn_p_down']='Shinikizo la CM';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Kimo cha shinikizo la kipimo kwenye nodi ya chini ya mkondo ya mstari huu. Thamani hasi (iliyowekwa alama) inamaanisha shinikizo lililo chini ya la anga; kagua ubunifu.';
$ec_lang['bpn_sketch_heading']='Mchoro wa Mtandao';
$ec_lang['bpn_source_label']='Chanzo';
$ec_lang['bpn_line_problem']='Mstari huu haujaunganishwa na chanzo: unaelekeza kwa kitambulisho kisichojulikana cha Juu ya Mkondo, unajirejelea wenyewe, unarudia kitambulisho kinachotumiwa na mstari mwingine, au unaunda mzunguko. Mistari isiyounganishwa na chanzo huachwa bila kusuluhishwa.';
$ec_lang['bpn_bad_id_short']='Kitambulisho kibaya';


$ec_lang['bpn_pressure_warn']='Shinikizo dogo/hasi; kagua hali za shinikizo lililo chini ya la anga';
$ec_lang['bpn_pressure_warn_short']='Dogo';
$ec_lang['bpn_notes_1_term']='Mfululizo kwa kawaida, tawi kwa ubaguzi';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Acha Kitambulisho cha Juu ya Mkondo wazi na mstari hufuata ule ulio juu yake; bomba la mfululizo rahisi. Ingiza kitambulisho cha mstari wa juu ya mkondo ili kuchipuka kutoka kwake. Kwa hiyo: mfululizo kwa kawaida, mti unapohitajika.';
$ec_lang['bpn_notes_2_term']='Mitandao yenye matawi tu, bila mizunguko';
$ec_lang['bpn_notes_2_def']='Kila mstari una mstari mmoja tu wa juu ya mkondo (mti). Zana hii haisuluhishi mitandao yenye mizunguko; hiyo inahitaji mbinu za marudio (EPANET au kama hiyo). Kuacha mizunguko nje ndiko kunakoifanya iwe rahisi na sahihi.';
$ec_lang['bpn_notes_3_term']='Hakuna vidhibiti hai vya shinikizo';
$ec_lang['bpn_notes_3_def']='Unaweza kuongeza vali ya upotevu wa ndani uliowekwa (thamani ya k), lakini si vali za kupunguza au kudumisha shinikizo (PRV/PSV). Hali yao ya kufunguka/kufungwa hutegemea mtiririko na shinikizo, jambo ambalo lingelazimisha marudio.';


$ec_lang['bpn_supply2_q']='Mtiririko wa usambazaji 2';
$ec_lang['bpn_supply2_h']='Kimo cha usambazaji 2';
$ec_lang['bpn_supply3_q']='Mtiririko wa usambazaji 3';
$ec_lang['bpn_supply3_h']='Kimo cha usambazaji 3';
$ec_lang['bpn_supply_pt_tip']='Vituo vya hiari vya mkondo wa usambazaji 2 na 3. Ingiza mtiririko na kimo kwa kila kimoja ili kuiga pampu, au chanzo chochote ambacho kimo chake hupungua kadiri kinavyosambaza zaidi; zana husoma kimo kwenye mtiririko wa kubuni. Kituo 1 hapo juu ni kimo tuli wakati mtiririko ni sifuri. Acha 2 na 3 wazi kwa kimo cha hifadhi kisichobadilika.';
$ec_lang['bpn_h_supply']='Kimo cha usambazaji';
$ec_lang['bpn_h_supply_tip']='Kimo cha chanzo kwenye mtiririko wa kubuni, kilichosomwa kutoka kwenye mkondo wa usambazaji. Ni sawa na kimo cha chanzo kilichoingizwa wakati mkondo ni tambarare (hifadhi ya maji).';
$ec_lang['bpn_supply1_h']='Kimo tuli cha usambazaji';
$ec_lang['lpn_main_menu']='Mtandao wa Usambazaji Maji';
$ec_lang['lpn_main_title']='Uigaji wa Bure Mtandaoni wa Mtandao wa Usambazaji Maji kwa Kitatuzi cha EPANET';
$ec_lang['lpn_main_desc']='Uchambuzi wa Mtandao wa Usambazaji Maji: Chora Mtandao wa Bomba wenye Mizunguko au Leta Faili za EPANET';
$ec_lang['lpn_title_units']='Vitengo vya {units}';
$ec_lang['lpn_tool_select']='Chagua';
$ec_lang['lpn_tool_add_junction']='Muunganiko';
$ec_lang['lpn_tool_add_reservoir']='Hifadhi ya Maji';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Tanki';
$ec_lang['lpn_tool_add_pipe']='Bomba';
$ec_lang['lpn_tool_add_pump']='Pampu';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Vali';
$ec_lang['lpn_tool_add_text']='Maandishi';
$ec_lang['lpn_tool_vertices']='Kona';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Mteja';
$ec_lang['lpn_tool_add_meter_tip']='Bofya pale mteja alipo, kisha bofya bomba au kifundo kinachomhudumia. Mahitaji unayompa mteja huongezwa kwenye muunganiko ulio karibu zaidi wa bomba hilo.';
$ec_lang['lpn_mode_add_meter']='Mteja: bofya pale mteja alipo, kisha bofya bomba au kifundo kinachomhudumia. Au tumia Esc kughairi.';
$ec_lang['lpn_pane_tab_customers']='Wateja';
$ec_lang['lpn_customer_heading']='Mteja {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Mahitaji kwa huduma moja';
$ec_lang['lpn_field_meter_demand_tip']='Kiwango kinachohitajika na kila huduma kwa mteja huyu. Tafuta na ubadilishe kinaweza kutumia tofauti kati ya wazi na 0.';
$ec_lang['lpn_field_meter_count']='Idadi ya huduma';
$ec_lang['lpn_field_meter_count_tip']='Ni huduma ngapi zinazofanana ambazo mteja huyu mmoja anaziwakilisha, ili miunganisho arobaini na mbili ya nyumba moja kando ya bomba kuu moja iweze kuwa alama moja mahali pamoja. Jumla iliyo chini ni mahitaji yaliyo juu mara idadi hii.';
$ec_lang['lpn_field_meter_total']='Jumla ya mahitaji';
$ec_lang['lpn_field_meter_total_tip']='Mahitaji kwa huduma moja mara idadi ya huduma. Hii ndiyo namba inayoongezwa kwenye muunganiko ulioitwa hapa chini.';
$ec_lang['lpn_field_meter_pipe']='Kipengele kilichounganishwa';
$ec_lang['lpn_field_meter_pipe_suggest']='Kipengele kilicho karibu zaidi ni {id}. Kiandike hapa ili kumhudumia mteja huyu kutoka humo.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Imeunganishwa na';
$ec_lang['lpn_field_meter_node_tip']='Muunganiko ambao mteja huyu ameunganishwa nao. Buruta kidoti cha muunganisho kwenda kwenye bomba ili amhudumie kutoka kituo kando ya bomba hilo badala yake.';
$ec_lang['lpn_meter_pipe_unknown']='Hakuna kitu katika mradi huu kilichoitwa {id}, hivyo mteja ameachwa mahali alipokuwa.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='Jinsi mahitaji ya mteja huyu yanavyopanda na kushuka wakati wa uendeshaji. Huzidisha jumla ya mahitaji, hivyo huathiri kila huduma anayowakilisha mteja huyu. Iache kwenye Hakuna muundo ili kufuata Muundo wa mahitaji wa Msingi wa mradi.';
$ec_lang['lpn_meter_pattern_unknown']='Hakuna muundo katika mradi huu ulioitwa {id}, hivyo mteja ameachwa kama alivyokuwa.';
$ec_lang['lpn_meter_placed']='Mteja {id} ameongezwa. Maelezo yake na mahitaji yake yanaandikwa kwenye jedwali la Wateja, au mbonyeze katika Chagua ili kufungua kisanduku chake.';
$ec_lang['lpn_field_meter_pipe_tip']='Kipengele ambacho huduma hii imeunganishwa nacho. Andika kingine hapa au kwenye jedwali la Wateja ili kukibadilisha, au buruta kidoti cha muunganisho kwenda kwenye kipengele kingine.';
$ec_lang['lpn_field_meter_station']='Nafasi kando ya bomba (%)';
$ec_lang['lpn_field_meter_station_tip']='Ni mbali kiasi gani kando ya bomba ambapo huduma inaunganishwa, kama asilimia ya bomba kutoka kifundo chake cha kwanza hadi cha pili. 0 iko ncha moja na 100 iko ncha nyingine. Duara lililo kwenye bomba hufanya kitu kile kile kwa kishale.';
$ec_lang['lpn_field_meter_offset']='Mkengeuko kutoka kwenye bomba';
$ec_lang['lpn_field_meter_offset_tip']='Chanya ni upande wa kulia wa bomba ukitazama kutoka kifundo chake cha kwanza kuelekea cha pili. Kuandika thamani hapa kunaweza kumhamisha mteja kwenda upande mwingine wa bomba kuu, na daima hunyoosha mstari wa huduma sawia na bomba kuu.';
$ec_lang['lpn_field_meter_lumped']='Imeongezwa kwenye kifundo';
$ec_lang['lpn_field_meter_lumped_tip']='Kifundo kilicho karibu zaidi; mahitaji ya mteja huyu huongezwa hapo.';
$ec_lang['lpn_node_customers']='Mahitaji ya wateja';
$ec_lang['lpn_node_customers_tip']='Orodha ya wateja walioongezwa kwenye kifundo hiki (kwa sababu hiki ndicho kilikuwa karibu zaidi). Mahitaji ya wateja ni nyongeza ya mahitaji mengine yaliyoorodheshwa hapa. Mteja huhaririwa pale alipo kwenye ramani au kwenye jedwali la Wateja.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} kutoka kwa Wateja {n}';
$ec_lang['lpn_customer_detached']='⚠ Mteja huyu hajaunganishwa na bomba lolote, hivyo mahitaji yake hayamo kwenye majibu. Mfute, au chora bomba kisha umhamishie juu yake.';
$ec_lang['lpn_customer_fixed_head']='⚠ Ncha iliyo karibu ya bomba hilo ina uso wa maji usiobadilika, hivyo mahitaji haya hayaathiri uigaji.';
$ec_lang['lpn_customer_detached_count']='Wateja {n} hawajaunganishwa na bomba lolote. Mahitaji yao hayajahesabiwa.';
$ec_lang['lpn_meter_pick_pipe']='Sasa bofya bomba au kifundo kinachomhudumia mteja huyu. Mteja hubaki mahali ulipomweka. Bonyeza Escape kughairi.';
$ec_lang['lpn_inp_export_flat_customers']='Faili la EPANET halina wateja. Mahitaji ya wateja {n} wa mradi huu huingia kwenye faili kama safu mlalo ya mahitaji kwenye muunganiko ambao kila mmoja ameongezwa kwao, na kila safu mlalo huitwa kwa lebo ya mteja huyo. Kisichoweza kubebwa na faili ni mteja mwenyewe: mahali alipo, bomba gani linalomhudumia, wapi kando ya bomba hilo huduma inaunganishwa, na huduma ngapi anazowakilisha mteja mmoja. Faili lako mwenyewe la mradi huhifadhi hayo yote.';

$ec_lang['lpn_area_hint_window_start']='Bofya kona moja ya dirisha.';
$ec_lang['lpn_area_hint_window_go']='Bofya kona iliyo kinyume ili kumaliza.';
$ec_lang['lpn_area_hint_lasso_start']='Bofya ili kuanza mstari wa nje.';
$ec_lang['lpn_area_hint_lasso_go']='Sogeza ili kuchora mstari wa nje. Bofya ili kumaliza.';
$ec_lang['lpn_area_hint_polygon_start']='Bofya ili kuchora eneo la poligoni. Bofya mara mbili ili kumaliza.';
$ec_lang['lpn_area_hint_polygon_go']='Bofya kila kona. Bofya mara mbili kwenye ya mwisho ili kumaliza.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Shikilia Shift wakati unachagua ili kuendelea na uchaguzi uliopo, ukiongeza au kuondoa (kubadilisha hali) unachochagua.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Bonyeza kwenye ramani na uburute kuzunguka unachotaka, kisha uondoe kidole.';
$ec_lang['lpn_area_hint_touch_go']='Buruta kuzunguka unachotaka, kisha uondoe kidole ili kumaliza.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Onyesha hii';
$ec_lang['lpn_multi_title']='{n} zimechaguliwa';
$ec_lang['lpn_multi_varies']='Tofauti';
$ec_lang['lpn_multi_applied']='Weka {prop} kwenye {n}.';
$ec_lang['lpn_multi_no_fields']='Hivi havina chochote kinachoweza kuwekwa pamoja hapa.';
$ec_lang['lpn_pane_pasted']='Zimebandikwa seli {n}. {skipped} hazikubadilishwa.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Zimebandikwa safu mlalo {n} na {created} kati yake zimeongezwa kwenye mtandao.';
$ec_lang['lpn_pane_pasted_rows_skipped']='Zimebandikwa safu mlalo {n} na {created} kati yake zimeongezwa kwenye mtandao. Seli {skipped} hazikubadilishwa.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Bofya hapa kisha bandika safu mlalo kutoka kwenye lahajedwali ili kuziongeza.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Bandika kama safu mlalo mpya mwishoni mwa jedwali';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Bonyeza Ctrl+V kuongeza safu mlalo zilizonakiliwa chini ya jedwali hili. Bonyeza Esc kughairi.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Kibandiko hiki kina safu mlalo {n}, na {fit} kati yake zinatoshea kwenye jedwali. Ongeza {extra} zilizobaki kama safu mlalo mpya chini?';
$ec_lang['lpn_pane_paste_overflow_add']='Ongeza safu mlalo {extra}';
$ec_lang['lpn_pane_paste_overflow_fit']='Bandika {fit} zinazotoshea pekee';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Kibandiko hiki kina safu mlalo {n}, na {fit} kati yake zinatoshea kwenye jedwali. {extra} zilizobaki haziwezi kuongezwa kama safu mlalo mpya: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='Vitambulisho {n} havilingani. Bandika hata hivyo?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Hakuna kilichobandikwa. {reasons}';
$ec_lang['lpn_pane_paste_more']='Safu mlalo zenye matatizo zisizoonyeshwa hapa: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Safu mlalo {row}: safu mlalo mpya inahitaji kitambulisho.';
$ec_lang['lpn_pane_paste_bad_id']='Safu mlalo {row}: kitambulisho {id} kina nafasi au alama ya nukuu ndani yake.';
$ec_lang['lpn_pane_paste_id_taken']='Safu mlalo {row}: kitambulisho {id} kinatumika tayari.';
$ec_lang['lpn_pane_paste_id_twice']='Safu mlalo {row}: kitambulisho {id} kimetumika mara mbili kwenye kibandiko hiki.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Safu mlalo {row}: kifundo kipya kinahitaji {first} na {second} zote mbili.';
$ec_lang['lpn_pane_paste_no_ends']='Safu mlalo {row}: kiungo kipya kinahitaji kifundo cha Kutoka na kifundo cha Kwenda.';
$ec_lang['lpn_pane_paste_no_node']='Safu mlalo {row}: kifundo {id} bado hakipo. Bandika vifundo vyako kwanza, kisha viungo vyako.';
$ec_lang['lpn_pane_paste_same_ends']='Safu mlalo {row}: Kutoka na Kwenda ni kifundo kile kile.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Safu mlalo {row}: {text} si {col} sahihi.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Safu mlalo {row}: Maandishi mapya yanahitaji {first} na {second} zote mbili.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Safu mlalo {row}: {id} si kifundo wala bomba katika mtandao huu bado. Bandika hicho kwanza, kisha Maandishi haya.';
$ec_lang['lpn_pane_paste_customer_no_position']='Safu mlalo {row}: Mteja mpya anahitaji {first} na {second} zote mbili.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Safu mlalo {row}: Mteja mpya anahitaji bomba au kifundo kilichounganishwa.';
$ec_lang['lpn_pane_paste_no_pipe']='Safu mlalo {row}: bomba {id} bado halipo. Bandika mabomba yako kwanza, kisha wateja wako.';
$ec_lang['lpn_pane_paste_no_customer_node']='Safu mlalo {row}: kifundo {id} bado hakipo. Bandika miunganiko yako kwanza, kisha wateja wako.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Safu mlalo {row}: kifundo {id} hakina bomba ambalo Mteja anaweza kuambatanishwa nalo.';
$ec_lang['lpn_pane_filled']='Zimejazwa chini seli {n}. {skipped} hazikubadilishwa.';
$ec_lang['lpn_pane_filldown']='Jaza chini';
$ec_lang['lpn_pane_fill_none']='Hakuna kitu katika uteuzi huu kinachoweza kujazwa chini.';
$ec_lang['lpn_pane_ctrlenter_filled']='Zimejazwa seli {n}. {skipped} hazikubadilishwa.';
$ec_lang['lpn_pane_hide_col']='Ficha safu hii';
$ec_lang['lpn_pane_hide_cols']='Ficha safu hizi';
$ec_lang['lpn_pane_show_all_cols']='Onyesha safu zote';
$ec_lang['lpn_pane_sort_asc']='Panga kwa kupanda';
$ec_lang['lpn_pane_manage_cols']='Simamia safu…';
$ec_lang['lpn_pane_manage_cols_title']='Simamia safu';
$ec_lang['lpn_pane_manage_cols_show']='Onyesha';
$ec_lang['lpn_pane_manage_cols_up']='Hamisha juu';
$ec_lang['lpn_pane_manage_cols_down']='Hamisha chini';
$ec_lang['lpn_pane_manage_cols_top']='Hamisha mwanzoni';
$ec_lang['lpn_pane_manage_cols_bottom']='Hamisha mwishoni';
$ec_lang['lpn_pane_colmenu_tip']='Ficha au simamia safu';
$ec_lang['lpn_pane_sortarrow_tip']='Geuza mpangilio';
$ec_lang['lpn_tool_area_window']='Chagua dirisha';
$ec_lang['lpn_tool_area_lasso']='Chagua kitanzi';
$ec_lang['lpn_tool_area_polygon']='Chagua poligoni';
$ec_lang['lpn_tool_delete']='Futa';
$ec_lang['lpn_tool_zoom_extent']='Onyesha Yote';
$ec_lang['lpn_tool_zoom_window']='Kuza Eneo';
$ec_lang['lpn_zoom_in']='Kuza';
$ec_lang['lpn_zoom_out']='Punguza';
$ec_lang['lpn_new_text']='Maandishi';
$ec_lang['lpn_field_text_bold']='Maandishi mazito';
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
$ec_lang['lpn_field_text_anchor']='Imeambatanishwa na';
$ec_lang['lpn_field_text_align']='Mpangilio mlalo';
$ec_lang['lpn_field_text_align_left']='Kushoto';
$ec_lang['lpn_field_text_align_center']='Katikati';
$ec_lang['lpn_field_text_align_right']='Kulia';
$ec_lang['lpn_field_text_valign']='Mpangilio wima';
$ec_lang['lpn_field_text_valign_top']='Juu';
$ec_lang['lpn_field_text_valign_middle']='Katikati';
$ec_lang['lpn_field_text_valign_bottom']='Chini';
$ec_lang['lpn_field_text_rotation']='Pembe (nyuzi)';
$ec_lang['lpn_field_text_match_pipe']='Elekeza kulingana na pembe ya kiungo cha karibu';
$ec_lang['lpn_field_text_flip']='Geuza 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Kipengele kilichoambatanishwa';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Maandishi haya yaliwekwa karibu vya kutosha na kipengele hivi kwamba yanakifuata, hivyo yanahamia pamoja na kipengele hicho na yana kiongozi. Maandishi kwenye kiongozi hupata mpangilio wake wa mlalo na wima kutoka upande ulioegemea, ndiyo maana safu hizo mbili hazitolewi wakati yameambatanishwa.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Mgawo wa kituo cha maji';
$ec_lang['lpn_field_emitter_tip']='Mtoko wa ziada unaotegemea shinikizo, kwa ajili ya kinyunyizio, mtoko wazi, au uvujaji uliogeuzwa kuwa mfano. Mtiririko unaotolewa ni mgawo huu ukizidishwa na shinikizo lililoinuliwa kwa kipeo cha kituo cha maji, ambacho hupangwa mara moja kwa mtandao mzima chini ya Mipangilio, Hesabu, Hidroliki. Acha wazi kwenye muunganiko wa kawaida.';
$ec_lang['lpn_field_elev']='Mwinuko';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='Kiwango cha ardhi au bomba katika kifundo hiki. Pima kutoka mahali popote unapotaka kuwa sifuri, mradi kila kifundo kitumie kiwango kimoja cha kuanzia.';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='Kimo';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Kiwango cha uso wa maji katika hifadhi, kilichopimwa kama kimo, si kama shinikizo. Acha wazi ili uso wa maji uwe kwenye mwinuko wa hifadhi.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='Mwinuko wa sakafu ya tanki. Kina cha maji tangani hupimwa kutoka hapa kwenda juu.';
$ec_lang['lpn_field_tank_level']='Kina cha maji';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Kina cha maji yaliyosimama tangani, kikipimwa kutoka sakafu ya tanki kwenda juu. Uso wa maji ni mwinuko wa sakafu ya tanki pamoja na kina hiki.';
$ec_lang['lpn_field_tank_minlevel']='Kina cha chini kabisa cha maji';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Kina cha maji ambapo tanki huchukuliwa kuwa tupu, kikipimwa kutoka sakafu ya tanki kwenda juu.';
$ec_lang['lpn_field_tank_maxlevel']='Kina cha juu kabisa cha maji';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Kina cha maji ambapo tanki huchukuliwa kuwa imejaa, kikipimwa kutoka sakafu ya tanki kwenda juu.';
$ec_lang['lpn_field_tank_diameter']='Kipenyo cha tanki';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Upana wa tanki kutoka upande mmoja hadi mwingine. Uko katika vitengo vile vile vya mwinuko, si vitengo vya kipenyo cha bomba. Huamua kiasi cha maji kinachoshikiliwa na kina fulani.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Mwinuko wa uso wa maji tangani: mwinuko wa sakafu ya tanki pamoja na kina cha maji. Hiki ndicho kiwango kinachotumiwa na kitatuzi kwa tanki hili.';
$ec_lang['lpn_close']='Funga';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Sifa';
$ec_lang['lpn_empty_hint']='Tumia Faili, Mradi Mpya ili kufungua mfano. Au anza kwa kuongeza hifadhi ya maji, muunganiko, na bomba kutoka kwenye upau wa zana.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Mtandao wako uko salama.';
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
$ec_lang['lpn_examples_welcome']='Karibu kwenye uigaji wa mtandao wa usambazaji maji, ukitumia kitatuzi cha EPANET';
$ec_lang['lpn_examples_heading']='Fungua nakala yako mwenyewe ya mfano';
$ec_lang['lpn_examples_sub']='Kila mmoja hufunguka kama nakala yako mwenyewe. Ibadilishe, ihifadhi, au fungua nakala mpya na uanze tena.';
$ec_lang['lpn_examples_open']='Fungua';
$ec_lang['lpn_examples_menu']='Fungua mfano…';
$ec_lang['lpn_examples_blank']='Au anzia hapa';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='Vifundo {nodes}, viungo {links}';
$ec_lang['lpn_examples_failed']='Mifano haikuweza kupakiwa. Tumia Faili, Mradi Mpya ili kuanza mchoro.';
$ec_lang['lpn_examples_loading']='Inapakia mifano…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Rekebisha kitu';
$ec_lang['lpn_help_notes']='Maelezo kuhusu ukurasa huu';
$ec_lang['lpn_help_hotkeys']='Jedwali na Vitufe vya Mkato';
$ec_lang['lpn_hotkeys_tables_heading']='Jedwali';
$ec_lang['lpn_hotkeys_map_heading']='Ramani';
$ec_lang['lpn_hotkeys_map_term']='Vitufe vya mkato vya ramani';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 au Esc</td><td>Chagua.</td></tr><tr><td>2</td><td>Ongeza muunganiko.</td></tr><tr><td>3</td><td>Ongeza hifadhi ya maji.</td></tr><tr><td>4</td><td>Ongeza tanki.</td></tr><tr><td>5</td><td>Ongeza bomba.</td></tr><tr><td>6</td><td>Ongeza pampu.</td></tr><tr><td>7</td><td>Ongeza vali.</td></tr><tr><td>8</td><td>Ongeza mteja.</td></tr><tr><td>9</td><td>Ongeza maandishi.</td></tr><tr><td>Delete</td><td>Futa uteuzi.</td></tr><tr><td>Ctrl+Z</td><td>Tengua badiliko la mwisho.</td></tr><tr><td>+ au =</td><td>Kuza karibu.</td></tr><tr><td>-</td><td>Punguza.</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Kuna tatizo hapa?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Kubonyeza mara moja kunatuambia kuwa kuna tatizo kwenye ukurasa huu. Kunatuma jina la ukurasa huu, lugha unayoisoma, na ujumbe ulio kwenye ramani kama upo. Hakuna chochote unachokiandika, hakuna anwani, na hakuna kitu chochote kutoka kwenye mchoro wako kinachotumwa. Hakuna anayeweza kukujibu, kwa sababu hii haituambii chochote kuhusu wewe ni nani. Tumia Msaada, Rekebisha kitu unapotaka kusema zaidi.';
$ec_lang['lpn_wrong_thanks']='Asante. Hilo limetufikia.';
$ec_lang['lpn_status_example_opened']='Umefungua {name}. Hii ni nakala yako: ihifadhi kwa Faili, Hifadhi kama.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Ukurasa huu haukuweza kubaini ukubwa wa eneo la ramani, hivyo ramani inaonyesha mwonekano wa mwisho iliyoweza kuuhesabu. Kubadilisha ukubwa wa dirisha hufanya ijaribu tena. Ikiendelea kutokea, kiongezi cha kivinjari kinachozuia vipimo vya ukurasa ndicho kinachosababisha mara nyingi.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Mtandao wa msingi, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Anza hapa. Hifadhi ya maji, pampu, na mzunguko mdogo: mpangilio mdogo kabisa unaofanya kazi kama mtandao wa maji. Lita kwa sekunde, kwa mita na milimita.';
$ec_lang['lpn_ex_basic_us_title']='Mtandao wa msingi, gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='Mtandao ule ule wa kuanzia kwa galoni kwa dakika, kwa futi na inchi.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 pamoja na vidhibiti vinavyotegemea kanuni';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Mdogo kabisa kati ya mitandao mitatu ya mifano ya EPANET yenyewe: hifadhi moja ya maji, pampu moja, na mzunguko mmoja.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Mfumo wa usambazaji wenye matawi, wenye tanki, kutoka kwenye mifano ya EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Mfano mkubwa wa EPANET: miunganiko 92, matanki 3, na hifadhi 2 za maji, moja ikiwa mto. Inafaa kuufungua ili kuona jinsi mfano wa ukubwa halisi unavyoonekana kwenye ramani.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='Mtandao wa EPANET Net3 uliobadilishwa kuwa latitudo/longitudo huko Novato, CA, ukiwa na ramani ya dunia nyuma yake.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Eneo la kibiashara lililotatuliwa kwa mtiririko wa kuzimia moto juu ya mahitaji ya juu ya siku, kwa wakati mmoja, likichorwa juu ya ramani ya eneo.';
$ec_lang['lpn_tool_undo']='Tengua';
$ec_lang['lpn_confirm_example']='Hii inaongeza mfano kwenye mtandao ulio nao tayari. Endelea?';
$ec_lang['lpn_field_diameter']='Kipenyo';
$ec_lang['lpn_demand_tip']='Mtiririko unaotolewa kwenye mtandao katika kifundo hiki. Ingiza namba hasi kwa mtiririko unaoingizwa kwenye mtandao hapa.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Kitengo hiki huamua maana ya namba zako';
$ec_lang['lpn_units_warn_lead']='{unit} ndicho kitengo cha unachoandika kwa ajili ya:';
$ec_lang['lpn_units_options_head']='Unapobadilisha kitengo:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Haiharibu';
$ec_lang['lpn_units_nondestructive_desc']='Haiharibu: huacha kila ulichoandika kama kilivyo na kukisoma tena kwa kitengo kipya.';
$ec_lang['lpn_units_destructive']='Huharibu';
$ec_lang['lpn_units_destructive_desc']='Huharibu: huandika upya kila ulichoingiza kwa kubadilisha kihesabu, ili mtandao ubaki karibu sawa kimaumbile, ndani ya mipaka ya ubadilishaji. Namba za awali zinapotea. Tendua huzirudisha.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='Thamani {n} sasa zinamaanisha {unit}. Hakuna kilichoandikwa upya.';
$ec_lang['lpn_status_converted']='Thamani {n} ziliandikwa upya kuwa {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='Paka rangi mtandao kwa kigezo kimoja, ili ramani kubwa isomeke kwa mtazamo mmoja. Shinikizo na kasi ndivyo vigezo viwili vinavyohitajika mara nyingi.';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Urefu';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Kuratibu za ramani';
$ec_lang['lpn_units_mapcoords_deg']='digrii';
$ec_lang['lpn_units_usft']='futi za upimaji za Marekani';
$ec_lang['lpn_units_elevhead']='Mwinuko na Kimo';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Mteremko wa Upotevu wa Kimo';
$ec_lang['lpn_result_gradient_tip']='Upotevu wa kimo ukigawanywa na urefu wa bomba. Tumia hii kulinganisha mabomba ya urefu tofauti dhidi ya kikomo kimoja cha kubuni.';
$ec_lang['lpn_result_water_age']='Umri wa maji';
$ec_lang['lpn_result_water_age_tip']='Muda ambao maji yanayofika hapa yamekuwa ndani ya mfumo. Pale mitiririko inapokutana, maji yanayowasili yanabeba mchanganyiko wa miaka tofauti, na namba hapa ni wastani wao uliopimwa kwa mtiririko: muunganiko unaolishwa zaidi na bomba fupi jipya huonyesha umri mdogo hata kama mwisho mrefu uliokufa pia unaulisha. Kwenye tanki ni wastani wa umri wa maji yaliyohifadhiwa, ndiyo maana tanki linalobadilisha maji yake polepole mara nyingi lina maji ya zamani zaidi kwenye mtandao. Hakuna kikomo cha kisheria cha kulinganisha nacho, hivyo pima namba hii dhidi ya mfumo wako mwenyewe.';
$ec_lang['lpn_result_source_share']='Mgao wa chanzo';
$ec_lang['lpn_result_source_share_tip']='Ni kiasi gani cha maji yanayofika hapa yalitoka kwenye kifundo cha ufuatiliaji. Hii ndiyo inayoripotiwa na uchambuzi wa Ufuatiliaji wa chanzo.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Wastani wa umri wa maji';
$ec_lang['lpn_result_avg_source_share']='Wastani wa mgao wa chanzo';
$ec_lang['lpn_result_avg_concentration']='Wastani wa mkusanyiko';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Sababu ya msuguano';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Kiwango cha mmenyuko';
$ec_lang['lpn_result_status']='Hali';
$ec_lang['lpn_result_status_open']='Wazi';
$ec_lang['lpn_result_status_closed']='Imefungwa';
$ec_lang['lpn_result_head']='Kimo';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Nishati ya maji katika kifundo hiki, ikionyeshwa kama kimo cha maji. Ni kimo kamili, wakati shinikizo ni kipimo cha gauge.';
$ec_lang['lpn_result_pressure']='Shinikizo';
$ec_lang['lpn_result_flow']='Mtiririko';
$ec_lang['lpn_result_velocity']='Kasi';
$ec_lang['lpn_result_headloss']='Upotevu wa Kimo';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Inarejesha mipangilio ya mradi huu tu. Mchoro wako na miradi yako mingine haibadiliki. Ili kuhifadhi mipangilio unayoipenda kwa matumizi tena, hifadhi faili la mradi lisilo na chochote isipokuwa mipangilio.';
$ec_lang['lpn_reset_all_tip']='Inafuta kila mradi, kila picha ya nyuma, kila mpangilio, na chaguo lako la vitengo, kisha inapakia upya ukurasa kama vile mtembeleaji wa mara ya kwanza anavyouona. Hii ndiyo urejeshaji pekee unaofuta kila kitu.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Kikokotoo hiki huhifadhi vitengo na maingizo ya mradi kama yalivyoingizwa, lakini hapo awali kilibadilisha namba kuwa SI kwa ajili ya kuhifadhi. Mradi huu ulihifadhiwa kabla ya mabadiliko hayo, hivyo namba zake zilihifadhiwa kwa SI. Ubadilishe mara ya mwisho kwenda vitengo vya sasa? Ili uweze kuamua, hapa kuna baadhi ya vipenyo ambavyo vingebadilishwa, pamoja na thamani zake kabla na baada:';
$ec_lang['lpn_v2_restore_yes']='Badilisha';
$ec_lang['lpn_v2_restore_never']='Hapana. Usiulize tena.';
$ec_lang['lpn_v2_restore_no']='Funga ili nikague vitengo vya sasa kwanza';
$ec_lang['lpn_storage_too_new']='Mradi huu ulihifadhiwa na toleo jipya zaidi la ukurasa huu, hivyo hauwezi kufunguliwa hapa.';
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
$ec_lang['lpn_tool_file']='Faili';
$ec_lang['lpn_menu_edit']='Hariri';
$ec_lang['lpn_menu_insert']='Ingiza';
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
$ec_lang['lpn_menu_map']='Ramani';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Onyesha ramani ya barabara';
$ec_lang['lpn_basemap_satellite_show']='Onyesha picha za satelaiti';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='za kijiografia';
$ec_lang['lpn_xymap']='za ndani';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Badilisha kama…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Nakala ya {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Badilisha kama';
$ec_lang['lpn_convas_coordsys_tip']='Mfumo wa kuratibu ambao nakala inabadilishwa kwenda kwao. Ukitofautiana na wa mradi huu, hatua mbili za uwekaji hufuata. Mradi ambao tayari unajua uko wapi hufungua hatua zote mbili zikiwa tayari zimejibiwa, hivyo unaweza kuzikubali kama zilivyo au kufanya mabadiliko.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Sasa hivi: {crs}';
$ec_lang['lpn_convas_epsg']='Mfumo wa kuratibu wa EPSG';
$ec_lang['lpn_convas_epsg_tip']='Chagua mfumo wa kuratibu kutoka kwenye sajili ya EPSG. Latitudo na longitudo ni WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Marejeleo ya kijiografia yasiyo na jina (ya ndani)';
$ec_lang['lpn_convas_unnamed_tip']='Kuratibu za ndani katika kitengo cha urefu, zikiwa na ramani ya dunia imeambatishwa.';
$ec_lang['lpn_convas_none_tip']='Kuratibu za ndani katika kitengo cha urefu, bila ramani ya dunia kwa sasa.';
$ec_lang['lpn_convas_units_tip']='Vitengo ambavyo nakala inabadilishwa kwenda kwao. Nakala asili inabaki na namba na vitengo vyake vyenyewe.';
$ec_lang['lpn_convas_round']='Rundisha thamani zilizobadilishwa';
$ec_lang['lpn_convas_round_tip']='Hurundisha namba ambazo ubadilishaji huu unaandika upya pekee, hadi hatua iliyo karibu zaidi unayochagua. Thamani ambazo kitengo chake hakibadiliki huachwa kama zilivyo.';
$ec_lang['lpn_convas_round_none']='Bila kurundisha';
$ec_lang['lpn_convas_round_flow']='Mahitaji na mtiririko';
$ec_lang['lpn_convas_label_col']='Kiambishi tamati';
$ec_lang['lpn_convas_label_tip']='Maandishi yanayoongezwa baada ya thamani hii kwenye lebo za ramani za nakala, kama vile \' mm\' au \' gpm\'. Yamejazwa mapema kutoka kwa kitengo kilichochaguliwa hapo juu; yafute ili kutokuwa na kiambishi tamati.';
$ec_lang['lpn_convas_oneway']='Kubadilisha kurudi ni ubadilishaji wa pili, si kutengua. Namba iliyobadilishwa kisha kubadilishwa kurudi huenda isirudi sawasawa na ilivyoandikwa.';
$ec_lang['lpn_convas_ok']='Badilisha';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} ni mojawapo ya mifumo michache ya kuratibu iliyoorodheshwa isiyo na taarifa za mchoro wa dunia (projection) zinazoweza kutumika, hivyo haiwezi kubadilishwa kwenda au kutoka humo. Hakuna kilichobadilishwa.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='Nakala iliyobadilishwa ni {name}. Mradi asili haujabadilika.';
$ec_lang['lpn_convas_cancelled']='Hakuna kilichobadilishwa. Nakala imefungwa, na mradi asili haujabadilika.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Hunakili mradi huu kwenda kichupo kipya na kuibadilisha nakala kwenda kwenye mfumo wa kuratibu na vitengo unavyochagua. Mfumo wa kuratibu unapobadilika, mchawi hukuongoza kukuza ramani iliyo nyuma ya mtandao wako kwa ukadiriaji, kisha kupima na kuzungusha mtandao wako kwenye ramani kwa ukaribu zaidi. Mradi huu unaachwa sawasawa kama ulivyo. Kuweka marejeleo ya kijiografia bila kubadilisha chochote, tumia Ramani, Ramani ya dunia, Ambatisha badala yake.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Mradi huu tayari una marejeleo ya kijiografia, hivyo mtandao tayari uko kwenye ramani na hakuna kilichohamishwa. Hakikisha uko mahali sahihi, kisha bonyeza kitufe cha Weka mchoro hapa na kitufe cha Weka mahali hapa.';
$ec_lang['lpn_georef_intro']='Kuweka mchoro kunachukua hatua mbili. Hatua ya 1 ni ya haraka: mchoro hubaki bila kutikisika na wewe unahamisha ramani iliyo nyuma yake, hadi eneo lako liwe chini ya mchoro kwa ukubwa unaokaribia sahihi. Bado hakuna mzunguko. Hatua ya 2 ni ya sahihi: unaburuta, kubadilisha ukubwa, na kuzungusha mchoro wenyewe. Mradi wako uko kwenye ramani ya dunia nzima mwanzoni, hivyo tafuta eneo lako kwanza, kisha bofya kitufe cha Weka mchoro hapa.';
$ec_lang['lpn_georef_adjust']='Buruta mchoro ili kuuhamisha, buruta kona ili kubadilisha ukubwa wake, buruta kishikizo cha duara juu ya mchoro ili kuuzungusha. Au andika umbali wa ardhini na pembe ya mzunguko hapa chini.';
$ec_lang['lpn_georef_step1']='Hatua 1 ya 2 — haraka';
$ec_lang['lpn_georef_step2']='Hatua 2 ya 2 — sahihi';
$ec_lang['lpn_georef_step1_hint']='Mradi wako unabaki mahali ulipo kwenye skrini. Sogeza na ukuze ramani iliyo chini yake mpaka ardhi iliyo nyuma yake iwe karibu na mahali sahihi na ukubwa sahihi, kisha bofya Weka mchoro hapa.';
$ec_lang['lpn_georef_detach']='Ichukue tena';
$ec_lang['lpn_georef_size_prompt']='Eneo hili lina upana kiasi gani, kutoka ncha moja ya mradi hadi nyingine?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Njia ya mkato: bonyeza {key}.';
$ec_lang['lpn_tool_key_hint_two']='Njia ya mkato: bonyeza {key} au {key2}.';
$ec_lang['lpn_tool_add_junction_tip']='Bofya ramani ili kuongeza muunganiko: mahali ambapo mabomba hukutana au maji hutumika.';
$ec_lang['lpn_tool_add_reservoir_tip']='Bofya ramani ili kuongeza hifadhi ya maji: chanzo chenye kiwango kimoja cha maji kisichobadilika.';
$ec_lang['lpn_tool_add_tank_tip']='Bofya ramani ili kuongeza tanki: hifadhi ambayo uso wa maji wake hupanda na kushuka linapojaa na kupungua.';
$ec_lang['lpn_tool_add_pipe_tip']='Bofya kifundo kimoja kisha kingine ili kuchora bomba kati yao.';
$ec_lang['lpn_tool_add_pump_tip']='Bofya kifundo kimoja kisha kingine ili kuweka pampu kati yao.';
$ec_lang['lpn_tool_add_valve_tip']='Bofya kifundo kimoja kisha kingine ili kuweka vali kati yao.';
$ec_lang['lpn_tool_add_text_tip']='Bofya ramani ili kuandika maelezo kwenye mchoro.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Bofya kwenye ramani kama ilivyoelekezwa ili kuchagua kila kitu kilicho ndani ya umbo. Bonyeza kitufe hiki tena ili kubadilisha umbo kati ya dirisha, kitanzi, na poligoni. Shikilia Shift wakati unachagua ili kuendelea na uchaguzi uliopo, ukiongeza au kuondoa (kubadilisha hali) unachochagua.';
$ec_lang['lpn_area_selected']='{n} zimechaguliwa.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='Hakuna kilichopatikana katika eneo hilo.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Ongeza na uondoe kona zinazounda njia ya bomba kwenye ramani. Bofya bomba ili kuongeza kona, bofya kona ili kuiondoa, na buruta kona ili kuisogeza. Kona hubadilisha njia ya mchoro tu, si haidroliki.';
$ec_lang['lpn_tool_delete_tip']='Bofya kitu chochote kwenye ramani ili kukiondoa.';
$ec_lang['lpn_tool_undo_tip']='Tengua mabadiliko ya mwisho.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Onyesha mtandao wote ndani ya dirisha.';
$ec_lang['lpn_tool_zoom_window_tip']='Bofya pembe mbili zinazopingana za kisanduku, au buruta moja, kwenye ramani ili kukuza eneo hilo. Bonyeza kitufe hiki tena kwa Onyesha Yote.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Kuza. Njia ya mkato: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Punguza. Njia ya mkato: -';
$ec_lang['lpn_tool_settings_tip']='Fungua mipangilio ya mradi huu.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Tafuta kipengele kwa kitambulisho chake, au tafuta kila kipengele kinachokidhi sharti, kisha vibadilishe vyote mara moja.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Alama za upau wa zana';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Uonekanaji';
$ec_lang['lpn_pane_right_toggle_tip']='Onyesha au ficha kidirisha kilicho kulia kwa ramani. Kina chaguo za lebo na rangi.';
$ec_lang['lpn_color_legend_open_tip']='Bofya ili kufungua kidirisha cha Uonekanaji na kubadilisha rangi hizi.';
$ec_lang['lpn_color_node_field']='Paka rangi vifundo kwa';
$ec_lang['lpn_color_link_field']='Paka rangi mabomba kwa';
$ec_lang['lpn_color_ramp_sequential']='Mfululizo';
$ec_lang['lpn_color_ramp_diverging']='Inayotofautiana';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Idadi ya wigo';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Mgawanyo wa wigo';
$ec_lang['lpn_color_ranges_note']='Mipaka iliyo chini imefungwa mara ikiwekwa; haifuati matokeo yanapobadilika. Kuchagua mbinu ya kuainisha data hapo juu huweka mipaka kutoka hali ya sasa ya mfumo. Ukibadilisha thamani yoyote kwa mkono, mbinu hapo juu inakuwa Mwenyewe.';
$ec_lang['lpn_color_criterion_note']='Mbinu hii hutoa mipaka yake kutoka kiwango cha kubuni, hivyo idadi ya wigo haibadiliki wakati mbinu hii imechaguliwa.';
$ec_lang['lpn_color_break_number']='Mpaka wa wigo lazima uwe namba. Ramani haijabadilika.';
$ec_lang['lpn_color_break_order']='Kila mpaka wa wigo lazima uwe mkubwa kuliko uliotangulia. Ramani haijabadilika.';
$ec_lang['lpn_color_break_count']='Idadi ya mipaka lazima iwe pungufu kwa moja ya idadi ya wigo. Ramani haijabadilika.';
$ec_lang['lpn_color_ramp_qualitative']='Kimaelezo';
$ec_lang['lpn_color_ramp_rainbow']='Upinde wa mvua';
$ec_lang['lpn_color_ramp_rainbow_eg']='sawa na EPANET';
$ec_lang['lpn_color_example_material']='Nyenzo';
$ec_lang['lpn_color_ramp_ylgnbu']='Njano hadi bluu';
$ec_lang['lpn_color_ramp_rdylbu']='Nyekundu hadi bluu, kupitia njano';
$ec_lang['lpn_georef_drop']='Weka mchoro hapa';
$ec_lang['lpn_georef_finish']='Weka mahali hapa';
$ec_lang['lpn_georef_scale']='Umbali wa ardhini kwa kila kitengo cha mchoro';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Umbali unaofikiwa ardhini na kitengo kimoja cha mchoro wako. Mchoro uliochorwa kwenye gridi wazi kwa kawaida hausemi lolote kuhusu hili, hivyo kipange hapa — au acha Nenda kwa… kukuuliza upana wa eneo na kukikokotoa.';
$ec_lang['lpn_georef_rotation']='Zungusha kinyume cha saa (nyuzi)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Ni kiasi gani cha kuzungusha mchoro wote, kinyume cha saa, ili kaskazini yake ielekeze kaskazini.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Weka mchoro hapa kabisa? Bado utaweza kuburuta vipengele mmoja mmoja baadaye, lakini mchoro utaacha kuwa mradi wa xy. Ili kurudisha xy, funga mradi huu bila kuhifadhi.';
$ec_lang['lpn_georef_done']='Huu sasa ni mradi wa lat/lon. Buruta kipengele chochote ili kukisogeza karibu na mahali kilipo halisi.';
$ec_lang['lpn_georef_backdrop_unrotated']='Picha ya nyuma ilihamishwa na kubadilishwa ukubwa pamoja na mchoro, lakini haikuweza kuzungushwa. Tumia Ramani, Picha ya Nyuma, Hamisha ili kuilinganisha.';
$ec_lang['lpn_georef_empty']='Faili hilo halina mtandao ndani yake, hivyo hakuna cha kuweka.';
$ec_lang['lpn_georef_unavailable']='Zana ya kuweka mchoro haikupakia. Pakia upya ukurasa na ujaribu tena.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Maliza uwekaji kwa kitufe cha "Weka mahali hapa", au bonyeza Ghairi, kabla ya kubadilisha mradi. Uwekaji huu ni wa mradi huu na hauwezi kukufuata kwenda mwingine.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Maliza uwekaji kwa kitufe cha "Weka mahali hapa", au bonyeza Ghairi, kabla ya kuhifadhi. Mradi bado unawekwa mahali, hivyo kilichopo skrini si bado kile ambacho kingeandikwa kwenye faili.';
$ec_lang['lpn_goto_menu']='Nenda kwenye latitudo na longitudo…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='Hamisha ramani hadi mahali ambapo tayari una kuratibu zake. Latitudo kwanza, kisha longitudo, kama ramani inavyozitoa, ukiwa na nafasi kati yake: 38 -122';
$ec_lang['lpn_goto_prompt']='Latitudo na longitudo, kwa mpangilio huo';
$ec_lang['lpn_goto_bad']='Hiyo si latitudo moja na longitudo moja. Jaribu 38 -122, ukiwa na nafasi kati yake.';
$ec_lang['lpn_georef_goto']='Nenda kwa…';
$ec_lang['lpn_georef_twopt']='Tumia sehemu mbili zinazojulikana';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Weka mchoro mahali sahihi kabisa, ikiwa tayari unajua sehemu mbili kwenye mchoro wako zilipo kihalisia. Bofya moja yake, andika latitudo na longitudo yake, kisha fanya vivyo hivyo kwa sehemu ya pili. Nafasi, kipimo, na mzunguko vyote hufuata kutoka sehemu hizo mbili. Bofya kitufe hiki tena ili kusitisha kuchagua.';
$ec_lang['lpn_georef_twopt_pick1']='Bofya sehemu kwenye mchoro wako ambayo unajua latitudo na longitudo yake.';
$ec_lang['lpn_georef_twopt_pick2']='Sasa bofya sehemu ya pili unayoijua, iliyo mbali iwezekanavyo na ya kwanza.';
$ec_lang['lpn_georef_twopt_same']='Hiyo ndiyo sehemu uliyochagua kwanza. Chagua nyingine.';
$ec_lang['lpn_georef_twopt_done']='Mchoro sasa umewekwa kwenye sehemu mbili ulizotoa. Ukague, kisha bofya kitufe cha Weka mahali hapa.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Kidirisha cha chini';
$ec_lang['lpn_pane_toggle_tip']='Onyesha au ficha kidirisha kilicho chini ya ramani. Kina wasifu na jedwali kwa kila aina ya kipengele.';
$ec_lang['lpn_pane_resize']='Buruta ili kufanya kidirisha kirefu zaidi au kifupi zaidi';
$ec_lang['lpn_pane_tab_junctions']='Miunganiko';
$ec_lang['lpn_pane_tab_reservoirs']='Hifadhi za Maji';
$ec_lang['lpn_pane_tab_tanks']='Matanki';
$ec_lang['lpn_pane_tab_pipes']='Mabomba';
$ec_lang['lpn_pane_tab_pumps']='Pampu';
$ec_lang['lpn_pane_tab_valves']='Vali';
$ec_lang['lpn_pane_tab_tip']='Kichupo hiki kinaonyesha vipengele vya aina hii kama jedwali unaloweza kupanga na kuhariri. Safu za matokeo haziwezi kuhaririwa.';
$ec_lang['lpn_pane_none']='Mtandao huu bado hauna hivi.';
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
$ec_lang['lpn_pane_text_attached']='Imeambatanishwa';
$ec_lang['lpn_pane_not_used']='Haitumiki';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Imechujwa kwa {q}. Inaonyesha {n} kati ya {all}.';
$ec_lang['lpn_pane_filter_clear']='Onyesha vyote';
$ec_lang['lpn_pane_filter_stale']='Safu mlalo ambazo hazilingani tena: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Hakuna kitu kwenye jedwali hili kinacholingana na kichujio.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Kuza na chagua';
$ec_lang['lpn_goto_on_map']='Onyesha kwenye ramani';
$ec_lang['lpn_pane_select_on_map']='Chagua kwenye ramani';
$ec_lang['lpn_pane_unselect_on_map']='Ondoa uteuzi kwenye ramani';

$ec_lang['lpn_pane_print']='Chapisha jedwali';
$ec_lang['lpn_pane_print_tip']='Chapisha jedwali unaloliangalia, likiwa na jina la mradi, jina la jedwali, na vitengo kwenye vichwa vya safu. Safu mlalo zinachapishwa kwa mpangilio ulioupanga.';

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
$ec_lang['lpn_menu_project']='Maji';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Kila kitu kuhusu uigaji wa mtandao wa maji kiko hapa mahali pamoja, isipokuwa vidhibiti vya kuchezesha uhuishaji. Hakuna haja ya kubahatisha kila kitu kiko wapi.';
$ec_lang['lpn_tables_menu']='Majedwali';
$ec_lang['lpn_tables_menu_tip']='Fungua paneli iliyo chini ya ramani kwenye jedwali la vipengele vya mtandao huu. Kuna jedwali moja kwa kila aina ya kipengele, na unaweza kulipanga na kulihariri hapo.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Kokotoa upya mtandao huu sasa hivi. Unatafuta kitufe cha Endesha? Kimefichwa wakati mpangilio wa Kokotoa upya kiotomatiki umewashwa. Ili kukirudisha, zima Kokotoa upya kiotomatiki kwenye Mipangilio, Ukokotoaji, Haidroliki.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Kokotoa upya kiotomatiki';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Hili likiwa limewashwa, mradi huu unakokotoa upya muda mfupi baada ya kila mabadiliko unayofanya, na kitufe cha Kokotoa kinaondolewa kwenye upauzana kwa sababu hakina kazi tena. Lizime kwenye mtandao mkubwa ambapo kusubiri kila mabadiliko yakokotolewe upya kunakwamisha uandishi, na kitufe cha Kokotoa kitarudi ili uchague wakati wa kuendesha.';
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
$ec_lang['lpn_time_run_slow']='Mtandao huu ulichukua sekunde {secs} kukokotoa, na umewekwa kukokotoa upya baada ya kila mabadiliko. Ili kusitisha hilo na kupata kitufe cha Kokotoa kirudi, zima “Kokotoa upya kiotomatiki” kwenye Mipangilio, chini ya Ukokotoaji, Haidroliki.';
$ec_lang['lpn_time_no_report']='Bado hakuna taarifa ya uendeshaji. Taarifa hii ni maandishi ya EPANET yenyewe, hivyo huonekana mara mtandao huu utakapokuwa umekokotolewa kwa kitatuzi cha EPANET.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Msaada';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Mkusanyiko wa picha za skrini';
$ec_lang['lpn_help_walkthroughs']='Mafunzo';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Futa mtandao';
$ec_lang['lpn_confirm_delete_network']='Futa kila kifundo, bomba, na lebo ya maandishi katika mradi huu? Picha ya nyuma, jina la mradi, na mipangilio yako vitabaki. Hili haliwezi kutenguliwa.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Tafuta na ubadilishe';
$ec_lang['lpn_find_title']='Tafuta na ubadilishe';
$ec_lang['lpn_find_scope']='Cha kutafuta';
$ec_lang['lpn_find_scope_all']='Vyote';
$ec_lang['lpn_find_property']='Sifa';
$ec_lang['lpn_find_condition']='Sharti';
$ec_lang['lpn_find_value']='Thamani';
$ec_lang['lpn_find_btn']='Tafuta';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Chuja kwenye jedwali la sasa';
$ec_lang['lpn_find_filter_tip']='Onyesha sehemu tu zinazolingana na hoja hii katika mojawapo ya majedwali chini ya ramani. Mchoro haubadilishwi na hakuna kinachofutwa.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} kati ya {all}';
$ec_lang['lpn_find_filter_summary']='Imechujwa kwa {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Hoja hii haitumiki kwa jedwali lolote.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='ina';
$ec_lang['lpn_find_op_equals']='sawa na';
$ec_lang['lpn_find_op_gt']='kubwa kuliko';
$ec_lang['lpn_find_op_lt']='ndogo kuliko';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='tupu';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} zimepatikana. Bofya moja ili kuiendea.';
$ec_lang['lpn_find_shift_hint']='Shift+bofya ili kubadilisha hali: kuongeza kama hakipo kwenye seti ya uteuzi, au kukiondoa kama tayari kipo kwenye seti ya uteuzi.';
$ec_lang['lpn_find_none']='Hakuna kilicholingana.';
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
$ec_lang['lpn_find_op_top']='{n} za juu zaidi';
$ec_lang['lpn_find_op_bottom']='{n} za chini zaidi';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Andika unachotafuta.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Muunganisho';
$ec_lang['lpn_find_prop_demand_desc']='Maelezo ya kundi hili la mahitaji';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='hakuna viungo kwenye kifundo';
$ec_lang['lpn_find_op_conn_noopen']='hakuna viungo wazi kwenye kifundo';
$ec_lang['lpn_find_op_conn_nolinksource']='hakuna njia ya kiungo kuelekea chanzo';
$ec_lang['lpn_find_op_conn_noopensource']='hakuna njia wazi kuelekea chanzo';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Kila kifundo kimeunganika.';
$ec_lang['lpn_find_conn_no_fixed']='Mtandao huu hauna hifadhi ya maji wala tanki, hivyo hakuna chanzo cha kufikia. Ni hakuna viungo kwenye kifundo na hakuna viungo wazi kwenye kifundo pekee vinavyoweza kutafutwa.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Utafutaji ule ule, ukiandikwa kama mstari mmoja. Kubadilisha vidhibiti kunaandika upya mstari huu, na kuandika kwenye mstari huu kunasasisha vidhibiti.';
$ec_lang['lpn_find_query_label']='Hoja';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Unganisha masharti kwa NA, AU na ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='NA';
$ec_lang['lpn_find_q_or']='AU';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Vidhibiti haviwezi kuonyesha hoja iliyo chini, hivyo vimefichwa.';
$ec_lang['lpn_find_q_restore']='Tumia vidhibiti badala yake';
$ec_lang['lpn_replace_q_bad']='Hoja hii haielewiki, hivyo hakuna kinachoweza kubadilishwa. Irekebishe hapo juu kwanza.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(kwenye herufi {n})';
$ec_lang['lpn_find_q_err_empty']='Hoja iko tupu, hivyo hakuna kitakachotafutwa.';
$ec_lang['lpn_find_q_err_scope']='Hakuna kinachoitwa {w} cha kutafuta. Jaribu mojawapo ya: {list}';
$ec_lang['lpn_find_q_err_dot']='Weka nukta kati ya kile cha kutafuta na sifa yake, kama Muunganiko.Kitambulisho';
$ec_lang['lpn_find_q_err_prop']='Si sifa ya {scope}: {w}. Jaribu mojawapo ya: {list}';
$ec_lang['lpn_find_q_err_op']='Si sharti la {prop}: {w}. Jaribu mojawapo ya: {list}';
$ec_lang['lpn_find_q_err_value']='Sharti hili linahitaji thamani baada yake: {op}';
$ec_lang['lpn_find_q_err_quote']='Weka alama za nukuu kuzunguka thamani ya maandishi: {w} si namba.';
$ec_lang['lpn_find_q_err_quote_end']='Maandishi haya yenye nukuu hayana alama ya kufunga.';
$ec_lang['lpn_find_q_err_close']='Mabano haya ( yalifunguliwa na hayakufungwa kamwe.';
$ec_lang['lpn_find_q_err_open']='Mabano haya ) hayafungi kitu chochote.';
$ec_lang['lpn_find_q_err_end']='Hakuna kilichotarajiwa baada ya hapa. Unganisha tafuti mbili kwa {and} au {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Badilisha vilivyopatikana';
$ec_lang['lpn_replace_prop']='Sifa ya kubadilisha';
$ec_lang['lpn_replace_value']='Thamani mpya';
$ec_lang['lpn_replace_source']='Chanzo cha thamani mpya';
$ec_lang['lpn_replace_asked']='Miinuko imeombwa kwa vifundo {n}. Matokeo yanakuja.';
$ec_lang['lpn_replace_btn']='Badilisha';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Badilisha vipengele {n}?';
$ec_lang['lpn_replace_apply']='Vibadilishe';
$ec_lang['lpn_replace_done']='Vipengele {n} vimebadilishwa. Unaweza kutendua hili kwa hatua moja.';
$ec_lang['lpn_replace_none']='Hakuna kitakachobadilika.';
$ec_lang['lpn_replace_no_value']='Andika thamani mpya.';
$ec_lang['lpn_replace_scope']='Chagua aina moja ya kipengele hapo juu ili kubadilisha thamani zake.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Wasifu';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_tip']='Chora ardhi na mstari wa kimo cha maji kwa njia iliyopita kwenye mtandao.';
$ec_lang['lpn_profile_title']='Wasifu kwa njia';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Bofya kifundo ambapo njia inaanzia.';
$ec_lang['lpn_profile_draw_more']='Sogeza juu ya ramani ili kuona njia. Bofya kifundo ili kukiongeza. Bofya mara mbili ili kumaliza. Esc inaghairi.';
$ec_lang['lpn_profile_draw_blocked']='Hakuna njia kutoka {a} hadi {b}. Chagua kifundo kingine.';
$ec_lang['lpn_profile_tap_start']='Gusa kifundo ambapo njia inaanzia.';
$ec_lang['lpn_profile_tap_more']='Gusa kifundo ili kuona njia. Bonyeza na ushikilie ili kukiongeza. Gusa mara mbili ili kumaliza. Bonyeza Wasifu tena ili kughairi.';
$ec_lang['lpn_profile_say_idle']='Bonyeza Wasifu tena ili kuchagua njia mpya kwenye ramani.';
$ec_lang['lpn_profile_none']='Bado hakuna njia. Bonyeza Wasifu tena ili kuchagua moja kwenye ramani.';
$ec_lang['lpn_profile_choose']='Chagua kifundo cha kuanzia na kifundo cha kuishia.';
$ec_lang['lpn_profile_no_path']='Vifundo hivi viwili havijaunganishwa na njia yoyote.';
$ec_lang['lpn_profile_no_solve']='Hakuna matokeo bado, hivyo mstari wa ardhi pekee ndio umechorwa.';
$ec_lang['lpn_profile_summary']='Vifundo: {n}, urefu: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Umbali kwenye njia ({u})';
$ec_lang['lpn_profile_axis_elev']='Mwinuko na kimo ({u})';
$ec_lang['lpn_profile_ground']='Uso wa ardhi';
$ec_lang['lpn_profile_hgl']='Mstari wa kimo cha maji';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Hariri';
$ec_lang['lpn_profile_edit_tip']='Badilisha ncha moja ya njia, au ondoa kifundo kimoja kutoka kwake, bila kuchora njia yote tena.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Buruta sehemu yoyote kwenye njia ili kuisogeza. Bofya sehemu uliyoiongeza ili kuiondoa.';
$ec_lang['lpn_profile_edit_tap']='Buruta sehemu yoyote kwenye njia ili kuisogeza. Gusa sehemu uliyoiongeza ili kuiondoa.';
$ec_lang['lpn_profile_edit_nowhere']='Sehemu kwenye njia lazima iwe kifundo. Njia haijabadilika.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Njia zilizohifadhiwa';
$ec_lang['lpn_profile_new']='Njia mpya iliyohifadhiwa…';
$ec_lang['lpn_profile_new_name']='Njia {n}';
$ec_lang['lpn_profile_rename']='Badilisha jina la njia…';
$ec_lang['lpn_profile_delete']='Futa njia';
$ec_lang['lpn_profile_prompt_name']='Jina la njia hii';
$ec_lang['lpn_profile_delete_confirm']='Futa njia iliyohifadhiwa {name}? Mchoro wenyewe hautabadilika.';
$ec_lang['lpn_profile_none_saved']='Bado hakuna njia zilizohifadhiwa';
$ec_lang['lpn_profile_missing']='Njia iliyohifadhiwa {name} inatumia vifundo ambavyo havimo kwenye mradi huu: {ids}';
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
$ec_lang['lpn_ts_menu']='Mfululizo wa muda';
$ec_lang['lpn_ts_tip']='Chora grafu ya kipengele kimoja au zaidi dhidi ya muda katika uigaji wa kipindi kirefu cha muda.';
$ec_lang['lpn_ts_title']='Thamani dhidi ya muda';
$ec_lang['lpn_ts_group_tip']='Kama grafu inaonyesha vifundo au viungo.';
$ec_lang['lpn_ts_group_nodes']='Vifundo';
$ec_lang['lpn_ts_group_links']='Viungo';
$ec_lang['lpn_ts_quantity_tip']='Thamani gani ya kuchora dhidi ya muda.';
$ec_lang['lpn_ts_add']='Ongeza vilivyoteuliwa';
$ec_lang['lpn_ts_add_tip']='Weka kila kilichochaguliwa sasa kwenye ramani ndani ya grafu.';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Hakuna cha aina hiyo kilichochaguliwa kwenye ramani.';
$ec_lang['lpn_ts_clear']='Ondoa vyote';
$ec_lang['lpn_ts_chip_tip']='Ondoa {id} kwenye grafu';
$ec_lang['lpn_ts_none']='Hakuna cha kuchora bado. Chagua vipengele kwenye ramani kisha bonyeza Ongeza vilivyoteuliwa.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Bado hakuna matokeo ya kipindi kirefu cha muda. Bonyeza Kokotoa ili kuendesha uigaji.';
$ec_lang['lpn_ts_summary']='Vipengele: {n}, nyakati za taarifa: {steps}';
$ec_lang['lpn_ts_axis_time']='Muda uliopita';
$ec_lang['lpn_freq_menu']='Marudio';
$ec_lang['lpn_freq_tip']='Chora grafu ya usambazaji wa marudio wa kipengele kimoja katika miunganiko yote au mabomba yote wakati wa hatua ya sasa ya muda.';
$ec_lang['lpn_freq_title']='Usambazaji wa thamani';
$ec_lang['lpn_freq_group_tip']='Kama grafu inaonyesha miunganiko au mabomba.';
$ec_lang['lpn_freq_quantity_tip']='Thamani gani ya kuchora.';
$ec_lang['lpn_freq_none']='Hakuna matokeo ya thamani hii bado, hivyo hakuna cha kuchora.';
$ec_lang['lpn_freq_summary']='Vilivyochorwa: {n} kati ya {total}';
$ec_lang['lpn_freq_summary_time']='Vilivyochorwa: {n} kati ya {total}, katika {time}';
$ec_lang['lpn_freq_axis_percent']='Asilimia iliyo chini ya';
$ec_lang['lpn_view_units']='Vitengo';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Hifadhi vyote';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Mradi{n}';
$ec_lang['lpn_project_copy_suffix']='(nakala)';
$ec_lang['lpn_project_rename']='Badilisha Jina';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Mradi Mpya…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Mradi mpya';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Mfumo wa kuratibu';
$ec_lang['lpn_new_coordsys_tip']='Chagua mfumo wa kuratibu wa mtandao wako. Hii ni ya kudumu; njia pekee ya kubadilisha mtandao kuwa kuratibu tofauti ni kwa "Faili, Fungua kwa kuratibu mpya", nayo ni ya makadirio.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Ya ndani, mchoro rahisi, au maalum';
$ec_lang['lpn_new_coordsys_local_tip']='Haijawekewa marejeleo ya kijiografia. Ambatisha picha yako mwenyewe ya nyuma au usiweke yoyote.';
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
$ec_lang['lpn_crs_view']='Chuja kwa mwonekano wa ramani';
$ec_lang['lpn_crs_view_tip']='Hutoa michoro inayofunika mahali ramani inapoangalia pekee. Izime ili kusoma orodha nzima.';
$ec_lang['lpn_crs_place']='Tafuta jina la mahali';
$ec_lang['lpn_crs_place_tip']='Andika mji, anwani, au alama, na mwonekano wa ramani utahamia hapo. Maneno unayoandika huenda kwenye huduma ya majina ya mahali ya OpenStreetMap, ambayo huomba idhini yako mara ya kwanza. Mradi mpya wa kijiografia pia huanzia mahali unapopata hapa.';
$ec_lang['lpn_crs_search']='Tafuta';
$ec_lang['lpn_crs_name']='Chuja jina la mchoro';
$ec_lang['lpn_crs_name_tip']='Huonyesha michoro ambayo jina lake au msimbo wa EPSG unaofanana na unachoandika pekee. Jaribu namba ya eneo, au UTM, au Mercator.';
$ec_lang['lpn_crs_list_tip']='Michoro iliyobaki baada ya vichujio viwili hapo juu. Chagua mmoja kisha bonyeza Chagua.';
$ec_lang['lpn_crs_choose']='Chagua';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Hakuna mahali palipotafutwa bado, hivyo orodha nzima inatolewa. Tafuta mahali hapo juu au kuza ramani ili kupunguza orodha.';
$ec_lang['lpn_crs_count']='Michoro {n} kati ya {total} imeorodheshwa.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='Mifumo {n} kati ya {total} ya kuratibu inashughulikia mtandao huu.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(hakuna ramani)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} ni mojawapo ya mifumo michache ya kuratibu iliyoorodheshwa isiyo na taarifa za mchoro wa dunia (projection) zinazoweza kutumika. Hii inamaanisha ramani ya dunia, utafutaji wa majina ya mahali, na miinuko ya DEM havifanyi kazi. Kuratibu zako hazibadiliki.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='isiyo na jina';
$ec_lang['lpn_crs_none']='Haijawekewa marejeleo ya kijiografia';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Mradi hubeba vipimo vyake vyenyewe, hivyo chaguo hili ni la mradi huu pekee na hakuna kinachohifadhiwa hapa kama mpangilio wa kivinjari. Ili kuanzisha miradi mipya kwa njia fulani, hifadhi mradi mtupu kama kiolezo chako na tengeneza nakala yake kila wakati.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Zanzibar, Tanzania';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Unda';
$ec_lang['lpn_file_open']='Fungua…';
$ec_lang['lpn_file_save']='Hifadhi';
$ec_lang['lpn_file_saveas']='Hifadhi kama…';
$ec_lang['lpn_file_revert']='Rudisha';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Faili za hivi karibuni';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='Fungua {file} tena bila kulazimika kuitafuta kwenye kompyuta yako.';
$ec_lang['lpn_recent_denied']='Ruhusa ya kufungua faili hilo haikutolewa, hivyo halikufunguliwa.';
$ec_lang['lpn_recent_gone']='Imeshindwa kufungua {file}. Huenda lilihamishwa, kubadilishwa jina, au kufutwa, hivyo liliondolewa kwenye orodha ya hivi karibuni.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Mradi mpya';
$ec_lang['lpn_tab_all']='Miradi yote';
$ec_lang['lpn_tab_menu']='Menyu ya mradi';
$ec_lang['lpn_tab_duplicate']='Nakili';
$ec_lang['lpn_tab_move_left']='Hamisha kushoto';
$ec_lang['lpn_tab_move_right']='Hamisha kulia';
$ec_lang['lpn_tab_unsaved']='Haijahifadhiwa kwenye faili';
$ec_lang['lpn_import_bad_file']='Faili hilo halikuweza kusomwa kama mradi uliohifadhiwa kutoka ukurasa huu.';
$ec_lang['lpn_import_no_room']='Hifadhi ya kivinjari haitoshi kuongeza mradi huu. Futa mradi usioutumia tena kisha ujaribu tena.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='Sawa';
$ec_lang['lpn_file_import_menu']='Leta…';
$ec_lang['lpn_file_import_inp']='Leta Faili la EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Soma mtandao kutoka faili la EPANET, iwe faili la maandishi la .inp au faili la .net linalohifadhiwa na EPANET, na ulihifadhi katika kivinjari hiki kama mradi mpya.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='Hamisha faili la EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Andika mtandao huu kama faili la EPANET .inp na ulipakue. Namba ulizoandika zinaandikwa kama ulivyoziandika kabisa. Chochote ambacho muundo wa .inp hauwezi kubeba kinaorodheshwa kwako baadaye.';
$ec_lang['lpn_status_inp_exported']='{file} imehamishwa.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='Vitu {n} ambavyo muundo wa .inp hauwezi kubeba.';
$ec_lang['lpn_inp_export_refused']='Mradi huu hauwezi kuandikwa kama faili la EPANET: {detail}';
$ec_lang['lpn_inp_bad_file']='Faili hilo halikuweza kusomwa kama faili la mtandao la EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Hii inaonekana kama faili la .net la EPANET, lakini ukurasa huu haukuweza kulisoma. Lifungue katika EPANET na utumie amri ya Faili, Hamisha, Mtandao huko ili kulihifadhi kama faili la .inp, kisha ulete hilo.';
$ec_lang['lpn_inp_report_heading']='Imeletwa {file}';
$ec_lang['lpn_inp_report_counts']='Miunganiko, hifadhi za maji na matanki {nodes}, mabomba, pampu na vali {links}, kwa vitengo vya {units}.';
$ec_lang['lpn_inp_report_clean']='Kila kitu kwenye faili kilipita salama. Hakuna kilichoachwa.';
$ec_lang['lpn_inp_report_label_anchor']='Lebo za maandishi zimewekwa jinsi EPANET inavyoziweka, kutoka kwenye kona yao ya juu kushoto.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='Mafaili ya EPANET hayana mfumo wa kuratibu, hivyo faili hili halitakuwa na marejeleo ya kijiografia mwanzoni. Kuliweka kwenye ramani ya dunia, tumia Ramani, Ramani ya dunia… Kubadilisha kuratibu zake, tumia Faili, Badilisha kama…';
$ec_lang['lpn_inp_report_lead']='Ukurasa huu hautumii kila kitu ambacho EPANET hutumia, lakini hakuna kitu kwenye faili lako kinachotupwa. Hapa chini ni kile ambacho faili lako linabeba ambacho ukurasa huu unahifadhi bila kukitumia, na kile kilichobadilika wakati faili lilisomwa:';
$ec_lang['lpn_inp_drop_headloss']='Faili hili halitumii fomula ya Hazen-Williams. Ukurasa huu unakokotoa Hazen-Williams, hivyo namba za usuguo wa bomba zilibaki kama zilivyoandikwa, lakini majibu hapa hayatalingana na majibu ya EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Matanki haya hayana kuta zilizonyooka: faili linaeleza umbo lake kama mkondo. Mkondo unahifadhiwa kwenye kisanduku cha Maktaba, tanki bado linaurejelea, na uigaji wa kipindi kirefu cha muda hulijaza na kulipunguza tanki kufuatana na ratiba anayotoa mkondo huo. Wakati mmoja peke yake ni sawa kwa njia zote mbili, kwa sababu uso wa maji ni kiwango kinachowekwa na faili. Kipenyo kilichoandikwa kwenye faili kinahifadhiwa kando ya mkondo, na ndicho tanki lisilo na mkondo linalochorwa na kukokotolewa kama.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Vali hizi za kubana ziliingia kama vali za kubana, zikiwa na upotevu uleule ambao faili linaupa. Kitatuzi chochote kati ya viwili kinaweza kuzitatua.';
$ec_lang['lpn_inp_drop_valve_active']='Vali hizi hudhibiti shinikizo au mtiririko, na hujifungua na kujifunga zenyewe maji yanapobadilika. Hakuna kilichopotea kwenye maelezo yake wakati wa kuingiza, na ukurasa huu huzitatua kwa kitatuzi cha EPANET, ukiwasha kitatuzi hicho chenyewe kwa mtandao huu.';
$ec_lang['lpn_inp_drop_valve']='Vali hizi zinaelezwa kwa mkondo au kwa upotevu wa shinikizo uliowekwa, na ukurasa huu hauna kipengele cha aina hiyo. Ziliingia kama mabomba wazi, hivyo mtandao bado umeunganika, lakini hakuna kinachodhibiti shinikizo au mtiririko huko tena.';
$ec_lang['lpn_inp_drop_cv']='Katika EPANET mabomba haya huruhusu maji kupita upande mmoja tu. Yaliingia kama mabomba ya kawaida, hivyo maji sasa yanaweza kutiririka pande zote mbili kupitia hayo.';
$ec_lang['lpn_inp_drop_demands']='Miunganiko hii ilikuwa na mahitaji zaidi ya moja. Mahitaji hayo yaliongezwa pamoja kuwa mahitaji moja anayoshikilia ukurasa huu.';
$ec_lang['lpn_inp_drop_patterns']='Ukurasa huu haukusoma miundo ya mahitaji, kwa sababu sehemu yake inayoendesha uigaji wa kipindi kirefu cha muda haikupakia. Kila mahitaji ni namba iliyoandikwa kwenye faili.';
$ec_lang['lpn_inp_drop_demand_pattern']='Miunganiko hii hubadilisha mahitaji yake wakati wa uendeshaji. Miundo yao iliingia kamili, na mahitaji unayoyaona ni yale ya wakati ambao saa inaonyesha.';
$ec_lang['lpn_inp_drop_emitters']='Miunganiko hii ina mgawo wa mvujisho au sprinkler. Ulihifadhiwa na unatatuliwa, lakini bado hakuna sehemu kwenye ukurasa huu ya kuuona au kuubadilisha.';
$ec_lang['lpn_inp_drop_curve_long']='Mkondo huu wa pampu ulikuwa na zaidi ya vituo vitatu. Vituo vyake vya chini kabisa, vya kati, na vya juu kabisa vilihifadhiwa, kwa sababu ukurasa huu hulinganisha mkondo kwa vituo vitatu zaidi zaidi.';
$ec_lang['lpn_inp_drop_curve_missing']='Pampu hii inarejelea mkondo ambao haupo kwenye faili. Pampu iliingia bila mkondo, hivyo haiongezi kimo chochote.';
$ec_lang['lpn_inp_drop_pump_other']='Pampu hii inaelezwa kwa nguvu inayochukua, badala ya mkondo. Iliingia bila mkondo, hivyo haiongezi kimo chochote.';
$ec_lang['lpn_inp_drop_head_pattern']='Hifadhi hizi za maji zinapanda na kushuka wakati wa uendeshaji. Miundo yao iliingia kamili, na kiwango cha maji unachokiona ni kile cha wakati ambao saa inaonyesha.';
$ec_lang['lpn_inp_drop_pump_speed']='Pampu hizi zinaendesha kwa kasi tofauti na ile iliyopimwa kwenye mkondo wake, au kasi yao inabadilika wakati wa uendeshaji. Kasi na muundo wake viliingia kamili, na kimo unachokiona ni cha wakati ambao saa inaonyesha.';
$ec_lang['lpn_inp_drop_setting']='Mabomba, pampu na vali hizi hubeba mpangilio ambao ukurasa huu hauwezi kuuhifadhi. Yaliingia yakiwa wazi.';
$ec_lang['lpn_inp_drop_rules']='Faili hili lina vidhibiti vya msingi wa kanuni. Ukurasa huu unavisoma na kuvitumia. Endesha muundo kwa kutumia injini ya EPANET na kanuni zinatumika, huku kila kiwango, shinikizo na mtiririko ndani yake vikibadilishwa kwenda kwenye vipimo anavyoonyesha mradi huu. Fungua Kanuni chini ya Maktaba ili kusoma au kubadilisha moja. Zinahifadhiwa sawasawa na jinsi faili linavyozitaja, na zinaandikwa tena ukihifadhi faili la EPANET.';
$ec_lang['lpn_inp_drop_eps']='Faili hili linaeleza uigaji wa kipindi kirefu cha muda. Sehemu ya ukurasa huu inayoendesha uigaji wa kipindi kirefu cha muda haikupakia, hivyo hali za mwanzo pekee ndizo zilizoingia.';
$ec_lang['lpn_inp_drop_quality']='Faili hili linaeleza jinsi ubora wa maji unavyobadilika yanaposafiri: kilichomo ndani ya maji mwanzoni, na jinsi dutu hiyo inavyoitikia haraka kiasi gani ndani ya mabomba na ndani ya matanki. Ukurasa huu unasoma namba hizo na kuzitumia. Chagua kemikali chini ya Mipangilio, Ukokotoaji, Ubora wa maji, kisha endesha muundo kwa kutumia injini ya EPANET, na kiwango cha mkusanyiko kitakokotolewa kote kwenye mtandao huku uendeshaji ukiendelea. Mistari hiyo inahifadhiwa, na inaandikwa tena ukihifadhi faili la EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='Faili hili linasema wapi kemikali inaingizwa kwenye mtandao, na jinsi maji ndani ya tanki yanavyochanganyika. Kiwango cha dozi kinaonekana kwenye kifundo kilichoongezewa, na tanki linasema mfumo gani wa uchanganyaji unaofuata. Dozi na mfumo wa uchanganyaji vyote vinakokotolewa na injini ya EPANET pekee.';
$ec_lang['lpn_inp_drop_energy']='Faili hili la EPANET lina data ya uigaji wa gharama za kusukuma maji. Ukurasa huu unaisoma na kuitumia. Endesha muundo kwa kutumia injini ya EPANET, kisha fungua Maji, Ripoti, Nishati ya pampu ili kuona kila pampu ilifanya kazi muda gani, nguvu iliyotumia, nishati iliyotumia, na gharama yake. Mistari hiyo inahifadhiwa, na inaandikwa tena ukihifadhi faili la EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Faili hili linatoa lebo kwa baadhi ya miunganiko yake, mabomba, au vipengele vingine. Kila lebo iliingia kamili, na kila moja ipo kwenye vituo vya kipengele chake, mahali unapoweza kuisoma au kuibadilisha.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Faili hili lina mipangilio ya EPANET yenyewe kuhusu jinsi ripoti yake inavyoandaliwa. Unaweza kusoma ripoti ya injini hapa, chini ya Ripoti, Uendeshaji wa EPANET, lakini inatoka katika muundo wa kawaida wa injini badala ya ule unaoombwa na mipangilio hii. Mistari hiyo inahifadhiwa, na inaandikwa tena ukihifadhi faili la EPANET.';
$ec_lang['lpn_inp_drop_sections']='Faili hili lina sehemu ambayo ukurasa huu hausomi kabisa. Hakuna kinachoitumia hapa. Inahifadhiwa yote kama ilivyo, na inaandikwa tena ukihifadhi faili la EPANET.';
$ec_lang['lpn_inp_drop_quality_options']='Faili hili linaeleza chaguo za ubora wa maji za EPANET: chaguo la Ubora wa maji, linalotaja aina ya uchambuzi wa ubora wa maji, na mipangilio miwili inayohusiana na kemikali, Usambaaji wa uwiano na Uvumilivu wa ubora. Yote matatu yanahifadhiwa na yote matatu yanatumika. Umri wa maji, ufuatiliaji wa chanzo na kemikali yanakokotolewa hapa, na mipangilio miwili ya kemikali inapelekwa kwenye injini ya EPANET unapoendesha kemikali. Yote inaandikwa tena ukihifadhi faili la EPANET.';
$ec_lang['lpn_inp_drop_file_options']='Faili hili linarejelea faili la ziada: Ramani, linaloshikilia kuratibu, au Haidroliki, linaloshikilia matokeo ya haidroliki yaliyokwisha kokotolewa. Ukurasa huu hauwezi kufungua lolote kati ya hayo, hivyo mistari hiyo inahifadhiwa kama ilivyo na inaandikwa tena ukihifadhi faili la EPANET.';
$ec_lang['lpn_inp_drop_demand_model']='Faili hili linaomba uchambuzi unaoendeshwa na shinikizo (PDA), ambapo muunganiko hupokea kiasi kidogo kuliko mahitaji yake wakati shinikizo hapo ni dogo. Ukurasa huu hutatua kwa msingi wa mahitaji, hivyo kila muunganiko hapa hupokea mahitaji yaliyotajwa kwenye faili, bila kujali shinikizo linalotokea. Mstari huo unahifadhiwa na unaandikwa tena ukihifadhi faili la EPANET.';
$ec_lang['lpn_inp_drop_other_options']='Faili hili linaeleza chaguo ambazo ukurasa huu hausomi. Hakuna kinachozitumia hapa. Zinahifadhiwa na zinaandikwa tena ukihifadhi faili la EPANET.';
$ec_lang['lpn_inp_drop_net_options']='Faili hili la .net la EPANET linaeleza mipangilio ambayo ukurasa huu hauna kidhibiti chake, hivyo thamani zake zimeorodheshwa hapa badala ya kuingizwa moja kwa moja. Kila kitu kingine kiliingia. Ikiwa unazihitaji, fungua faili kwenye EPANET na tumia Faili, Hamisha, Mtandao ili kuihifadhi kama faili la .inp, kisha liingize hilo.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Hili lilikuwa faili la .net la EPANET. Hilo ni faili la mradi la EPANET lenyewe, halina maelezo yaliyochapishwa, na ukurasa huu unalisoma kwa kubaini muundo wake kutoka kwenye mifano ya mafaili, hivyo litumie tu pale usipokuwa na kitu kingine badala ya kama njia ya kutegemewa. Faili la .inp ndilo muundo ulioandikwa ambao kila programu nyingine inasoma: kwenye EPANET tumia Faili, Hamisha, Mtandao ili kuandika moja, na liingize hilo badala yake kila unapoweza.';
$ec_lang['lpn_inp_drop_backdrop']='Faili hili linataja picha ya nyuma lakini halina picha yenyewe. Iongeze mwenyewe kwa Faili, Picha ya Nyuma, Ongeza picha.';
$ec_lang['lpn_inp_drop_dangling']='Mabomba haya yanataja kifundo ambacho hakipo kwenye faili, hivyo yaliachwa nje.';
$ec_lang['lpn_inp_drop_units']='Kitengo cha mtiririko kilichotajwa kwenye faili hili si kimojawapo ambacho ukurasa huu unakijua, hivyo kila namba ilisomwa kama galoni kwa dakika (gpm). Kagua kila namba kabla ya kutumia majibu.';
$ec_lang['lpn_inp_drop_anchor_missing']='Maandishi haya yaliambatishwa kwenye muunganiko, hifadhi ya maji, au tanki ambalo halimo kwenye faili. Yaliingia kama maandishi huru mahali faili lilipoyaweka, na sasa hayafuati chochote.';
$ec_lang['lpn_import_notes_heading']='Mradi huu ulisomwa kutoka faili la EPANET. Baadhi ya kile faili hilo linalobeba kinahifadhiwa lakini hakitumiki kwenye ukurasa huu.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='Imefunguliwa {name} kutoka faili, na kuongezwa kwenye kivinjari hiki kama mradi mpya.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Faili la mradi';
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
$ec_lang['lpn_file_upload_explain']='Kivinjari hiki hakiwezi kuunganika na faili, hivyo kufungua faili hapa ni kupakia kweli kweli: mradi unanakiliwa ndani ya kivinjari hiki, na njia pekee ya kuhifadhi kazi yako kwenye faili ni kuliandika upya kwa Faili, Hifadhi kama.';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='Fungua faili la mradi lililohifadhiwa kutoka ukurasa huu.';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='Inahifadhi kwenye faili lililounganishwa.';
$ec_lang['lpn_file_saveas_tip']='Chagua faili la kuhifadhi. Mradi huu utaunganika na faili hilo, na Hifadhi itaandika kwake tangu wakati huo.';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='Inahifadhi ukitumia mipangilio ya Upakuaji (Download) ya kivinjari chako. Kivinjari hiki hakiwezi kuunganika na faili, hivyo Hifadhi imezimwa na Hifadhi kama pekee inapatikana. Ukiwasha mpangilio wa kivinjari chako wa "Uliza mahali pa kuhifadhi kila faili", unaweza kuchagua faili la asili na kuliandika upya.';
$ec_lang['lpn_status_uploaded']='Faili la mradi limepakiwa. Hakuna muunganiko unaoweza kudumishwa nalo, hivyo njia pekee ya kuhifadhi kwake ni kutumia Faili, Hifadhi kama.';
$ec_lang['lpn_status_downloaded']='Imepakuliwa {file}. Kivinjari hiki hakiwezi kuunganika na faili, hivyo mradi huu unabaki umewekwa alama kuwa haujahifadhiwa kwenye faili.';
$ec_lang['lpn_status_file_opened']='Imefunguliwa {file}.';
$ec_lang['lpn_status_already_open']='Faili hilo tayari limefunguliwa hapa kama {name}, hivyo hii ilibadilisha kwenda kwake badala ya kufungua nakala ya pili.';
$ec_lang['lpn_status_already_open_dirty']='Faili hilo tayari limefunguliwa hapa kama {name}, likiwa na mabadiliko usiyoyahifadhi bado. Hii ilibadilisha kwenda kwake badala ya kufungua nakala ya pili. Tumia Faili, Rudisha ikiwa unataka toleo lililopo diskini badala yake.';
$ec_lang['lpn_status_saved']='Imehifadhiwa {file}.';
$ec_lang['lpn_status_reverted']='Imepakiwa {file} tena kutoka diskini.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Hifadhi mabadiliko yako kwenye {name} kabla ya kuyafunga?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} inahifadhiwa kwenye kivinjari hiki tu. Ukiifunga bila kuihifadhi kwenye faili, imepotea kabisa.';
$ec_lang['lpn_close_discard']='Funga bila kuhifadhi';
$ec_lang['lpn_cancel']='Ghairi';
$ec_lang['lpn_revert_confirm']='Tupa mabadiliko uliyoyafanya na upakie {file} tena kutoka diskini?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Mradi huu ulitoka {file}, lakini muunganiko na faili hilo umepotea. Chagua faili hilo tena ili kuunganika nalo.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Imeshindwa kuandika kwenye faili. Huenda lilihamishwa au kubadilishwa jina, au ruhusa iliondolewa. Kazi yako bado imehifadhiwa kwenye kivinjari hiki.';
$ec_lang['lpn_file_changed_elsewhere']='Mtu mwingine amehifadhi kwenye faili hili tangu ulipolifungua, hivyo kuhifadhi sasa kutaandika juu ya kazi yake. Tumia Faili, Hifadhi kama ili kuweka mabadiliko yako kwenye faili lako mwenyewe, au Faili, Rudisha ili kutupa yako na kupakia yake.';
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
$ec_lang['lpn_lock_somebody']='Mtu mwingine';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} ana faili hili wazi.';
$ec_lang['lpn_lock_open_readonly']='Fungua kwa kusoma tu';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Vunja mfungo';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Faili hili linaonekana linatumika.';
$ec_lang['lpn_lock_open_care']='Ili kuepuka kupoteza data, chagua kwa uangalifu kutoka chaguo zilizo hapa chini.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='Limekuwa likitumika kwa {x}.';
$ec_lang['lpn_lock_age_edited']='Lilihaririwa mara ya mwisho {x} zilizopita.';
$ec_lang['lpn_lock_age_saved']='Lilihifadhiwa mara ya mwisho {x} zilizopita.';
$ec_lang['lpn_lock_age_never_saved']='Hakuna kilichohifadhiwa kwenye faili hili bado.';
$ec_lang['lpn_lock_age_unknown']='Hakuna kumbukumbu ya muda gani limekuwa likitumika, au lini lilihifadhiwa au kuhaririwa mara ya mwisho.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"Uliza" humwambia yeyote aliye na faili hili wazi kwamba unalitaka, na haibadilishi kitu kingine chochote. "Fungua kwa kusoma tu" hukuruhusu kuliangalia na kubadilisha chochote unachotaka, bila uwezo wa kuhifadhi hapa. "Vunja mfungo" hukuruhusu kuhifadhi juu ya faili; kazi yao isiyohifadhiwa haipotei, lakini hawataweza tena kuihifadhi hapa, na mtu anaweza kuhitajika kuchanganya hizo mbili kwa mkono.';
$ec_lang['lpn_lock_ask']='Uliza';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Tumwambie nani anayeuliza? Herufi za mwanzo za majina yako ni bora zaidi. Zinahifadhiwa pamoja na mfungo wa faili hili kwenye seva yetu, kwa ajili ya yeyote aliye nalo wazi, na hufutwa ndani ya siku 30.';
$ec_lang['lpn_lock_ask_sent']='Tumemwomba yeyote aliye na faili hili wazi kulifunga. Ataliona ndani ya dakika moja, ikiwa ukurasa wake bado uko wazi. Hakuna kingine kilichobadilika, na faili bado ni lake hadi atakapolifunga.';
$ec_lang['lpn_lock_ask_failed']='Ujumbe wako haukuweza kufikishwa. Ima hakuna aliye na faili hili wazi sasa, au seva haikuweza kufikiwa.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Faili hilo halikufunguliwa, na hakuna kilichobadilika hapa. Bado kuna mtu mwingine aliye nalo wazi.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} angependa kuhariri faili hili. Ukiwa tayari, hifadhi kazi yako kisha tumia Faili, Funga mradi ili kulikabidhi.';
$ec_lang['lpn_ago_seconds']='sekunde {n}';
$ec_lang['lpn_ago_minutes']='dakika {n}';
$ec_lang['lpn_ago_hours']='saa {n}';
$ec_lang['lpn_ago_days']='siku {n}';
$ec_lang['lpn_ago_unknown']='muda usiojulikana';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Ujumbe';
$ec_lang['lpn_msglog_heading']='Ujumbe wa hivi karibuni';
$ec_lang['lpn_msglog_empty']='Hakuna ujumbe bado.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} zilizopita';
$ec_lang['lpn_msglog_note']='Mpya kwanza. Ukurasa huu huhifadhi ujumbe {n} wa mwisho ukiwa wazi, na hakuna kinachohifadhiwa kwenye kompyuta yako.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Kusoma tu: {name} ana faili hili wazi. Unaweza kubadilisha chochote unachotaka hapa, lakini huwezi kuhifadhi. Tumia Faili, Hifadhi kama ili kuhifadhi kwenye faili tofauti.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Onyo: imeshindikana kufikia seva kukagua au kutengeneza mfungo kwenye mradi huu, hivyo hakuna kinachozuia mwenzako kuhariri faili hilo hilo wakati mmoja. Utaarifiwa mfungo ukianza kufanya kazi tena.';
$ec_lang['lpn_lock_storage_error']='Onyo: tovuti hii haiwezi kuhifadhi rekodi za mfungo, hivyo hakuna kinachozuia mwenzako kuhariri faili hilo hilo wakati mmoja. Hili ni kosa la usanidi la seva, si kitu unachoweza kukirekebisha hapa — folda ya mfungo haiandikiki na seva ya wavuti.';
$ec_lang['lpn_lock_full_error']='Onyo: tovuti hii imeishiwa nafasi ya kurekodi ni nani ana mradi gani wazi, hivyo hakuna kinachozuia mwenzako kuhariri faili hilo hilo wakati mmoja. Hili ni kosa la usanidi la seva, si kitu unachoweza kukirekebisha hapa.';
$ec_lang['lpn_lock_not_asked']='Mfungo haufanyi kazi kwa mradi huu, hivyo hakuna kinachozuia mwenzako kuhariri faili hilo hilo wakati mmoja. Mradi huu bado hauna kitambulisho, na kuuhifadhi kwenye faili humpa kimoja.';
$ec_lang['lpn_lock_restored']='Mfungo unafanya kazi tena, na faili hili sasa ni lako kuhifadhi.';
$ec_lang['lpn_lock_dismiss']='Ficha ujumbe huu';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Mradi wako utahifadhiwa kwenye faili katika kompyuta hii. Unahifadhiwa unapoomba, na wakati mwingine wowote hapana, hivyo hakuna kinachoandikwa kwenye faili hilo bila wewe kujua.';
$ec_lang['lpn_file_training_2']='Ili watu wawili wasihariri faili moja wakati mmoja, tovuti hii hufuatilia ni nani ana faili hilo wazi. Ikiwa mtu tayari analo, bado unaweza kulifungua na kutazama, au kuweka nakala yako mwenyewe.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='Mara ya kwanza unapohifadhi, kivinjari chako kitauliza kama tovuti hii inaweza kuhariri faili hilo. Swali hilo linatoka kwa kivinjari, si kwetu, na kukubali ndiko kunakoruhusu Hifadhi kuandika kazi yako kwenye faili hilo. Kwa kawaida linaulizwa mara moja tu kwa kila faili.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Endelea';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Chagua faili tena';
$ec_lang['lpn_file_reconnect']='Unganika tena na faili hili';
$ec_lang['lpn_file_reconnect_alert']='Mradi huu ulitoka {file}. Kivinjari chako kinahitaji ruhusa yako tena kabla ya kuweza kuandika kwake. Unganika tena hapa chini.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Hilo ni faili lile lile ambalo mtu mwingine analo wazi, hivyo haliwezi kuhifadhiwa juu yake. Chagua faili tofauti au jina tofauti.';
$ec_lang['lpn_saveas_overwrites_project']='Faili hilo tayari lina mradi tofauti, {name}. Kuhifadhi hapa kunalibadilisha kabisa. Endelea?';
$ec_lang['lpn_saveas_overwrites_newer']='Faili hilo limebadilika tangu ulipoliona mara ya mwisho, hivyo mtu mwingine karibu kabisa amelihifadhi. Kuhifadhi hapa kunabadilisha toleo lao na lako. Endelea?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Jina la mradi huu';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='Imefungwa {closed}. Sasa inaonyesha {opened}.';
$ec_lang['lpn_status_closed_empty']='Imefungwa {closed}. Umeanzishwa mradi mpya tupu.';
$ec_lang['lpn_storage_full']='Haijahifadhiwa. Hifadhi ya kivinjari imejaa au haipatikani, hivyo mabadiliko yako ya hivi karibuni yatapotea ukifunga kichupo hiki.';
$ec_lang['lpn_storage_unreadable']='Hakijahifadhiwa. Mradi huu haukuweza kusomwa kutoka hifadhi ya kivinjari. Nakala yake iliyohifadhiwa imeachwa kama ilivyo hasa na haitaandikwa upya, hivyo hakuna kinachohifadhiwa kwenye kichupo hiki. Fungua faili au unda mradi mpya ili kuendelea kufanya kazi.';
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
$ec_lang['lpn_about_credits']='Shukrani';
$ec_lang['lpn_help_welcome']='Ukurasa wa karibu';
$ec_lang['lpn_about_license']='Imepewa leseni chini ya GNU General Public License v3.0 au toleo jipya zaidi.';
$ec_lang['lpn_notes_1_term']='Jinsi linavyotatuliwa';
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
$ec_lang['lpn_notes_1_def']='Kitatuzi cha EPANET ndicho kinachotatua mtandao huu. Weka muda wote wa kuendesha na kila hatua ya taarifa hukokotolewa kwa zamu: matanki hujaa na kupungua, mahitaji hufuata miundo yake, na upauzana huicheza tena uendeshaji huo.';
$ec_lang['lpn_notes_2_term']='Kisichofanya';
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
$ec_lang['lpn_notes_2_def']='Ubora wa maji umeigwa: umri wa maji, ufuatiliaji wa chanzo, na kemikali inayoathiriana na kuta za bomba pamoja na maji yenyewe. Wimbi la shinikizo na mgongano wa maji hayajaigwa: kila jibu hapa ni la maji yanayotiririka kwa hali thabiti tayari, si kwa wimbi la shinikizo linalotokea vali inapofungwa ghafla.';
$ec_lang['lpn_notes_3_term']='Kuhifadhi miradi';
$ec_lang['lpn_notes_3_def']='Kila mradi ni kichupo, na kila kichupo kinahifadhiwa kwenye kivinjari hiki unapofanya kazi. Kufuta data ya kivinjari chako kunafuta yote, hivyo weka kazi yako kwenye faili: Faili, Hifadhi kama. Alama ya nyota kwenye kichupo inamaanisha kina mabadiliko ambayo hayamo kwenye faili. Hakuna kinachoandikwa kwenye faili isipokuwa uombe. Katika baadhi ya vivinjari, mradi huunganika na faili ulilolihifadhia, na Faili, Hifadhi huandika kwenye faili hilo hilo tangu wakati huo; katika vingine muunganiko hauwezekani, hivyo Hifadhi imezimwa na Hifadhi kama pekee inapatikana. Wakati faili la mradi linahifadhiwa kwenye diski inayoshirikiwa, ukurasa huu unakuambia ikiwa mwenzako tayari analo wazi, ili watu wawili wasiandikiane kazi.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Mkondo wa pampu';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Pampu hufuata H = H₀ − aQ^b, ambapo H ni kimo ambacho pampu inaongeza na Q ni mtiririko unaopita ndani yake. Ingiza kituo kimoja, viwili, au vitatu kutoka kwenye mkondo wa mtengenezaji. Vituo vitatu — kimo katika mtiririko sifuri, kituo cha kawaida cha kufanya kazi, na kituo cha mtiririko mkubwa zaidi — hupatanisha H₀, a na b moja kwa moja, na kufuata mkondo uliochapishwa kwa ukaribu zaidi. Vituo viwili hupatanisha parabola (b = 2) yenye kilele chake kwenye mtiririko sifuri. Kituo kimoja hutumia kanuni ya kawaida: kimo katika mtiririko sifuri ni mara 1.33 ya kimo unachoingiza, na mtiririko mkubwa zaidi ni mara 2 ya mtiririko unaoingiza, jambo linalotoa tena b = 2. Pampu isiyo na kituo chochote kilichoingizwa haiongezi kimo chochote. Mkondo haukatiki pale kimo kinapofika sifuri, hivyo kuomba pampu mtiririko zaidi ya uwezo wa mkondo wake hutoa kimo hasi. Suluhisho ni pampu kubwa zaidi au mahitaji madogo zaidi, si upatanishaji tofauti wa mkondo. Mkondo unaweza kuwa na vituo zaidi ya vitatu, na kila kituo ulichokitoa husomwa.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='Pia kwenye ukurasa huu';
$ec_lang['lpn_notes_4_def']='Mradi unaweza kukaa juu ya ardhi halisi ukiwa na ramani ya barabara nyuma yake. Faili za EPANET .inp zinaweza kusomwa na kuandikwa. Kidirisha cha chini huchora wasifu kwa njia na kuorodhesha miunganiko. Vipengele vinaweza kupakwa rangi kulingana na matokeo yao, na Tafuta huchagua kila kipengele kinachokidhi sharti uliloweka.';
$ec_lang['lpn_notes_6_term']='Msaada wa safu za jedwali';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Chagua safu</td><td>Bofya kichwa</td></tr><tr><td>Ongeza au panua uteuzi wa safu</td><td>Ctrl+click au Shift+click kichwa kingine</td></tr><tr><td>Hamisha (panga upya) safu zilizoteuliwa</td><td>Buruta au tumia Simamia safu… kwenye menyu ya kubofya kulia au ⋮</td></tr><tr><td>Menyu ⋮ na mshale wa kupanga.</td><td>Elea juu ya kona ya juu ya kichwa, au chagua au Tab hadi kwenye kichwa</td></tr><tr><td>Ficha, Onyesha zote, au Simamia mwonekano na mpangilio</td><td>Bofya kulia kichwa au menyu ⋮ kwenye kona ya juu kulia ya kichwa</td></tr><tr><td>Panga kwa safu</td><td>Ikoni ya mshale kwenye kona ya juu kulia ya kichwa</td></tr><tr><td>Bandika kama safu mlalo mpya mwishoni mwa jedwali</td><td>Bofya kulia, menyu ⋮ kwenye kona ya juu kulia ya kichwa, au Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Njia za mkato za kibodi za jedwali';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Vitufe vya mshale</td><td>Songa.</td></tr><tr><td>Tab, Enter</td><td>Maliza uandishi kisha songa seli moja kando / chini.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Songa nyuma.</td></tr><tr><td>Shift+vitufe vya mshale</td><td>Panua uteuzi.</td></tr><tr><td>Ctrl+C</td><td>Nakili uteuzi.</td></tr><tr><td>Ctrl+D</td><td>Jaza uteuzi chini kutoka safu mlalo yake ya juu.</td></tr><tr><td>Ctrl+Enter</td><td>Jaza uteuzi kwa thamani ya seli inayotumika.</td></tr><tr><td>Ctrl+A</td><td>Chagua jedwali zima.</td></tr><tr><td>Ctrl+Shift+V</td><td>Bandika kama safu mlalo mpya mwishoni mwa jedwali.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Badilisha kwenda kichupo kinachofuata au kilichotangulia, iwe jedwali au grafu.</td></tr><tr><td>Delete</td><td>Futa seli.</td></tr><tr><td>F2</td><td>Fungua seli kuihariri.</td></tr><tr><td>Esc</td><td>Ghairi uhariri.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Mipaka ya bendi za rangi inabaki ile ile';
$ec_lang['lpn_notes_color_def']='Mipaka ya bendi za rangi huwekwa unapochagua njia ya kuainisha data. Haiwekwi tena kwa kila hatua ya muda, kwa sababu hilo lingefanya rangi zimaanishe kitu kipya kwa kila hatua, jambo lisilosaidia kuona mfumo wako. EPANET hufanya kazi kwa njia ile ile. Ili kupata mipaka mipya, chagua njia tena au andika yako mwenyewe.';
$ec_lang['lpn_notes_epanet_term']='Vigezo vya Hazen-Williams vinalingana na EPANET';
$ec_lang['lpn_notes_epanet_def']='Mnamo Agosti 2026 mgawo na kipeo cha Hazen-Williams vilibadilishwa ili kulingana na EPANET. Matokeo ya upotevu wa kimo yanatofautiana na matoleo ya awali ya ukurasa huu kwa hadi asilimia 0.1, jambo dogo zaidi kuliko kutokuwa na uhakika kwa thamani ya C yenyewe.';
$ec_lang['lpn_notes_engine_term']='EPANET gani inayoendeshwa na ukurasa huu';
$ec_lang['lpn_notes_engine_def']='Kitatuzi cha EPANET kinachotumika kwenye ukurasa huu ni OWA-EPANET 2.3.5, kilichotolewa tarehe 20 Februari 2025. EPANET inatengenezwa na Open Water Analytics, jumuiya inayofanya kazi na Shirika la Ulinzi wa Mazingira la Marekani (EPA), lililotoa toleo la 2.2.0 Desemba 2019. Taarifa ya uendeshaji inaiita 2.3.05 kwa sababu kitatuzi huandika namba ya mwisho kwa tarakimu mbili. Inafika kwenye ukurasa huu kupitia epanet-js 0.9.0 ya Luke Butler, chini ya leseni ya MIT, na inaendesha ndani ya kivinjari chako: mtandao wako haupelekwi popote kutatuliwa.';
$ec_lang['lpn_id_invalid']='Ingiza kitambulisho kisicho na nafasi wala alama za nukuu.';
$ec_lang['lpn_id_taken']='Kitambulisho hicho tayari kinatumika.';
$ec_lang['lpn_diag_no_fixed_head']='Ongeza hifadhi ya maji au tanki. Mtandao unahitaji angalau kiwango kimoja cha maji kinachojulikana kabla ya kutatuliwa.';
$ec_lang['lpn_diag_dangling_link']='Bomba au pampu inaunganika na kifundo ambacho hakipo tena:';
$ec_lang['lpn_diag_unreachable']='Vifundo hivi havina njia ya kufika kwenye hifadhi ya maji:';
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
$ec_lang['lpn_engine_fetching']='Inapata kitatuzi cha EPANET. Kinapakuliwa mara moja kisha kinabaki kwenye kifaa hiki, hivyo kinafanya kazi bila mtandao baadaye.';
$ec_lang['lpn_engine_ready']='Kitatuzi cha EPANET kipo kwenye kifaa hiki sasa, na kinafanya kazi bila mtandao.';
$ec_lang['lpn_engine_fetching_valve']='Inapata kitatuzi cha EPANET, ili vali hii iweze kutatuliwa sasa na bila mtandao baadaye.';
$ec_lang['lpn_engine_ready_valve']='Kitatuzi cha EPANET kipo kwenye kifaa hiki sasa. Vali zinazojifungua na kujifunga zenyewe zitafanya kazi bila mtandao.';
$ec_lang['lpn_engine_unavailable']='Imeshindwa kupata kitatuzi cha EPANET, ndicho kinachotatua vali zinazojifungua na kujifunga zenyewe. Unganisha na mtandao mara moja, na kitabaki kwenye kifaa hiki tangu hapo.';
$ec_lang['lpn_engine_needed_loading']='Inapakia kitatuzi cha EPANET wakati unajenga. Matokeo yatapatikana kitatuzi kikisha kupakiwa kikamilifu.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Maendeleo ya kupakia kitatuzi';
$ec_lang['lpn_engine_wait']='Inapakia kitatuzi. Matokeo yamecheleweshwa kwa muda mfupi. Endelea kufanya kazi.';
$ec_lang['lpn_engine_wait_pct']='Kitatuzi kimepakiwa {percent}%.';
$ec_lang['lpn_engine_wait_bytes']='Kitatuzi kimepakia KB {kb} hadi sasa. Jumla haipatikani, hivyo asilimia ya ukamilifu haijulikani.';
$ec_lang['lpn_engine_needed_failed']='Kitatuzi cha EPANET hakijapakiwa bado, hakiwezi kupakiwa, na mtandao huu unaweza kutatuliwa nacho pekee. Kitapakiwa utakapounganishwa na mtandao wa intaneti.';
$ec_lang['lpn_diag_valve_needs_epanet']='Vali hizi hujifungua na kujifunga zenyewe, na ni kitatuzi cha EPANET pekee kinachoweza kuzikokotoa. Kitatuzi cha EPANET kimeshindwa kupakiwa, hivyo majibu haya hayapo:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Vali hizi zimeunganishwa moja kwa moja kwenye hifadhi ya maji au tanki, ambayo tayari huweka kiwango cha maji hapo, hivyo hakuna kilichobaki kwa vali kudhibiti. Weka bomba fupi kati ya vali na hifadhi ya maji au tanki:';
$ec_lang['lpn_diag_not_converged']='Hakuna suluhisho lililopatikana. Kagua thamani zisizowezekana maishani halisi, kama kipenyo cha sifuri.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Suluhisho halikupatikana. Namba hizi ni za marudio ya mwisho, si jibu. Usizitumie.';
$ec_lang['lpn_diag_not_converged_trials']='Ilisimama baada ya marudio {iterations}.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Ilisimama baada ya marudio {iterations} ikiwa na hitilafu ya uwiano ya {error}, ambayo haikufikia mpangilio wa Usahihi wa {accuracy}.';
$ec_lang['lpn_field_roughness']='Usuguo';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Hazen-Williams C. Namba kubwa zaidi inamaanisha bomba laini zaidi: kama 150 kwa plastiki mpya, 130 kwa chuma au chuma pua mpya, na 100 kwa bomba kuukuu.';
$ec_lang['lpn_field_length']='Urefu';
$ec_lang['lpn_field_from']='Kutoka';
$ec_lang['lpn_field_to']='Hadi';
$ec_lang['lpn_field_length_tip']='Urefu wa bomba. Auto ikiwa imewashwa, urefu unapimwa kutoka kwenye mchoro wako. Zima Auto ili kuandika urefu unaotofautiana na mchoro.';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Aina ya vali';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Kinachofanywa na vali. Vali ya kubana hushikilia upotevu uliowekwa. Nyingine tatu hushikilia shinikizo au mtiririko, na hufunguka kabisa, kufunga, au kufunga kwa sehemu maji yanapobadilika. Kubadilisha aina huweka namba mpya ya kuanzia kwenye mpangilio hapa chini, kwa sababu shinikizo si mtiririko, wala hakuna kati ya hizo mbili kilicho mgawo wa upotevu.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Kubana (TCV)';
$ec_lang['lpn_valve_type_prv']='Kupunguza shinikizo (PRV)';
$ec_lang['lpn_valve_type_psv']='Kudumisha shinikizo (PSV)';
$ec_lang['lpn_valve_type_fcv']='Kudhibiti mtiririko (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Kuvunja shinikizo (PBV)';
$ec_lang['lpn_valve_type_gpv']='Matumizi ya jumla (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Kushuka kwa shinikizo';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='Shinikizo ambalo vali huliondoa. Kivunja shinikizo huondoa kiasi hiki hasa cha shinikizo daima, hata maji yakielekea upande gani. Ni kushuka kwenye vali, si shinikizo la kudumisha.';
$ec_lang['lpn_inp_drop_gpv_curve']='Vali hii inarejelea mkondo wa upotevu wa kimo ambao haupo kwenye faili. Vali iliingia bila mkondo, hivyo inabaki wazi kabisa mpaka utakapoipa mkondo.';
$ec_lang['lpn_gpv_curve_source']='Mkondo wa upotevu wa kimo wa vali';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Mkondo ulio kwenye kisanduku cha Maktaba unaosema kimo kiasi gani vali hii inachopoteza kwa kila mtiririko. Vali kadhaa zinaweza kutumia mkondo huo huo, na kuubadilisha huko kunabadilisha zote. Vali hii inabeba rejea pekee; vituo vyenyewe vinasomwa na kubadilishwa chini ya Maktaba, Mikondo.';
$ec_lang['lpn_field_valve_setting_pressure']='Mpangilio wa shinikizo';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Shinikizo linaloshikiliwa na vali. Vali ya kupunguza shinikizo hushikilia shinikizo upande wa chini ya mkondo kwenye thamani hii au chini yake. Vali ya kudumisha shinikizo hushikilia shinikizo upande wa juu ya mkondo kwenye thamani hii au juu yake.';
$ec_lang['lpn_field_valve_setting_flow']='Mpangilio wa mtiririko';
$ec_lang['lpn_field_valve_setting_flow_tip']='Kiwango cha juu cha maji vali inachoruhusu kupita. Kunapohitajika maji kidogo kuliko hiki kupita, vali husimama wazi kabisa na haiongezi upotevu wowote.';
$ec_lang['lpn_field_valve_setting']='Mpangilio';
$ec_lang['lpn_field_valve_setting_loss']='Mgawo wa upotevu';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Kiasi cha kimo kinachoondolewa na vali ya kubana, kikihesabiwa kama kizidishi cha kimo cha kasi. Tumia 0 kwa vali iliyosimama wazi kabisa. Namba hii moja ndiyo upotevu wote wa vali ya kubana.';
$ec_lang['lpn_field_valve_diameter_tip']='Upana wa tundu linalopitisha maji kwenye vali. Kasi ya maji kupitia vali hukokotolewa kutoka upana huu, na upotevu hutokana na kasi hiyo.';
$ec_lang['lpn_field_valve_km_tip']='Upotevu kutoka kwenye mwili wa vali wakati vali imesimama wazi kabisa, ukiongezwa juu ya chochote kinachoondolewa na mpangilio wa vali. Huhesabiwa kama kizidishi cha kimo cha kasi. Tumia 0 kuupuuza.';
$ec_lang['lpn_field_km']='Mgawo wa upotevu wa ndani (wa mahali), k';
$ec_lang['lpn_field_km_tip']='Upotevu kutoka kwenye mapinde, vali, na viungio kwenye bomba hili, ukihesabiwa kama kizidishi cha kimo cha kasi. Tumia 0 kwa bomba jepesi lililonyooka.';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Upotevu wa ndani, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Mkondo wa kimo cha pampu';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Mkondo ulio kwenye kisanduku cha Maktaba unaosema kimo kiasi gani pampu hii inachoongeza kwa kila mtiririko. Pampu kadhaa zinaweza kutumia mkondo huo huo, na kuubadilisha huko kunabadilisha zote. Pampu hii inabeba rejea pekee; vituo vyenyewe vinasomwa na kubadilishwa chini ya Maktaba, Mikondo.';
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
$ec_lang['lpn_field_desc']='Maelezo';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='Kwa matumizi yako mwenyewe, kama vile kona ya barabara au bomba limetengenezwa na nini. Hubebwa ndani na nje ya faili la EPANET, ambapo hukaa mwishoni mwa safu mlalo ya sehemu hiyo. Hakuna ukokotoaji unaoisoma. Mkato wa mstari huwa nafasi, kwa sababu faili haina mahali pa kuweka mmoja.';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Lebo';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Lebo inaweza kuwa na maana yoyote unayohitaji, kama vile eneo la shinikizo au agizo la kazi. Hakuna ukokotoaji hapa au kwenye EPANET unaoisoma. Lebo ni neno moja: EPANET husimama kusoma kwenye nafasi ya kwanza, hivyo nafasi inakataliwa unapoiandika. Inabebwa ndani na nje ya faili la EPANET.';
$ec_lang['lpn_pump_effic_curve']='Mkondo wa ufanisi wa pampu';
$ec_lang['lpn_pump_effic_curve_tip']='Mkondo ulio kwenye kisanduku cha Maktaba unaosema ufanisi wa pampu hii kwa kila mtiririko. Pampu kadhaa zinaweza kutumia mkondo huo huo, na kuubadilisha huko kunabadilisha zote. Pampu hii inabeba rejea pekee; vituo vyenyewe vinasomwa na kubadilishwa chini ya Maktaba, Mikondo.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Hakuna mkondo uliochaguliwa';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Mikondo';
$ec_lang['lpn_curve_library_link_tip']='Inafungua kisanduku cha Maktaba kwenye sehemu yake ya Mikondo, mahali mkondo unapoongezwa, kuelezwa, kubadilishwa na kufutwa. Kipengele huonyesha mkondo unaotumia.';
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
$ec_lang['lpn_curve_kind_head']='Kimo cha pampu';
$ec_lang['lpn_curve_kind_effic']='Ufanisi wa pampu';
$ec_lang['lpn_curve_kind_volume']='Ujazo wa tanki';
$ec_lang['lpn_curve_kind_headloss']='Upotevu wa kimo wa vali';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Aina haijatajwa';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Ujazo';
$ec_lang['lpn_pump_effic_col']='Ufanisi';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Pampu hii haina mkondo wa ufanisi uliochaguliwa, hivyo inaendesha kwa ufanisi uliowekwa kwa mtandao mzima, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Pampu hii inarejelea mkondo wa ufanisi uitwao {name}, ambao hakuna kitu kwenye mradi huu kinachoueleza, hivyo inaendesha kwa ufanisi uliowekwa kwa mtandao mzima, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Hali: Chagua. Bofya kipengele au lebo ili kuiona au kuibadilisha. Buruta ili kuhamisha kifundo, kona, au lebo. Tumia zana ya Kona ili kuongeza au kuondoa kona kwenye bomba.';
$ec_lang['lpn_mode_delete']='Hali: Futa. Bofya kipengele ili kukiondoa.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Hali: Kona. Kona za kila bomba zinaonyeshwa kama vishikizo vidogo vya mraba. Bofya bomba ili kuongeza kona, bofya kishikizo ili kukiondoa, au kiburute ili kukisogeza. Hakuna kingine kwenye ramani kinachobadilika katika hali hii.';
$ec_lang['lpn_mode_zoom_window']='Hali: Kuza eneo. Bofya pembe mbili zinazopingana za kisanduku, au buruta moja, kwenye ramani ili kukuza eneo hilo.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Hakuna kilichochaguliwa. Bofya kipengele kwenye ramani kwanza, kisha bonyeza Futa.';
$ec_lang['lpn_mode_add_junction']='Hali: Ongeza Muunganiko. Bofya ramani ili kuweka muunganiko. Badilisha kwenda Hali ya Chagua ili kubadilisha au kuhamisha vipengele na lebo.';
$ec_lang['lpn_mode_add_reservoir']='Hali: Ongeza Hifadhi ya Maji. Bofya ramani ili kuweka hifadhi ya maji. Badilisha kwenda Hali ya Chagua ili kubadilisha au kuhamisha vipengele na lebo.';
$ec_lang['lpn_mode_add_tank']='Hali: Ongeza Tanki. Bofya ramani ili kuweka tanki. Badilisha kwenda Hali ya Chagua ili kubadilisha au kuhamisha vipengele na lebo.';
$ec_lang['lpn_mode_add_pipe']='Hali: Ongeza Bomba. Bofya kifundo, kisha kifundo kingine, ili kuviunganisha. Bofya nafasi wazi katikati ili kupinda mstari, au bonyeza Escape ili kuanza upya. Badilisha kwenda Hali ya Chagua ili kubadilisha au kuhamisha vipengele na lebo.';
$ec_lang['lpn_mode_add_pump']='Hali: Ongeza Pampu. Bofya kifundo, kisha kifundo kingine, ili kuviunganisha. Bofya nafasi wazi katikati ili kupinda mstari, au bonyeza Escape ili kuanza upya. Badilisha kwenda Hali ya Chagua ili kubadilisha au kuhamisha vipengele na lebo.';
$ec_lang['lpn_mode_add_valve']='Hali: Ongeza Vali. Bofya kifundo, kisha kifundo kingine, ili kuviunganisha. Bofya nafasi wazi katikati ili kupinda mstari, au bonyeza Escape ili kuanza upya. Badilisha kwenda Hali ya Chagua ili kubadilisha au kuhamisha vipengele na lebo.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Hali: Ongeza Maandishi. Bofya ramani ili kuweka Maandishi. Bofya karibu na kifundo ili kuambatisha Maandishi kwenye kifundo hicho. Badilisha kwenda Hali ya Chagua ili kubadilisha au kuhamisha vipengele na lebo.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Tumia hali hii kubadilisha, kuhamisha, na kuburuta vitu kwenye ramani. Hii ndiyo hali ambayo ukurasa hurudi kwake kwa kawaida: hurudi hapa wenyewe baada ya vitendo fulani, kama vile kufungua mradi. Kubonyeza Esc mara ya pili huondoa uteuzi wa chochote kilichochaguliwa.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='Unaweza kuburuta lebo ili kuihamisha. Lebo huangaza kwa muda mfupi kukujulisha kwamba imehamishwa. Bofya mara mbili lebo ili kuirudisha kwenye nafasi yake ya kiotomatiki.';
$ec_lang['lpn_field_auto']='Auto';
$ec_lang['lpn_method_switch_confirm']='Kubadilisha njia ya msuguano hakubadilishi namba za usuguo ulizokwisha andika kwenye mabomba yako, na usuguo wa njia moja hauna maana kwa njia nyingine. Kagua kila bomba baada ya hili. Ubadilishe hata hivyo?';
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
$ec_lang['lpn_field_closed']='Imefungwa';
$ec_lang['lpn_field_closed_tip']='Funga bomba hili ili maji yasiweze kupita ndani yake. Bomba linabaki kwenye ramani na kubaki na namba zake zote, na unaweza kulifungua tena wakati wowote.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Longitudo';
$ec_lang['lpn_field_lat']='Latitudo';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Kaskazini';
$ec_lang['lpn_field_easting']='Mashariki';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='K';
$ec_lang['lpn_field_easting_abbr']='M';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Lat';
$ec_lang['lpn_field_lon_abbr']='Lon';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Andika mahali pa kuratibu ili kuweka kifundo hiki sawasawa. Katika senario, mahali hapa hutumika kwenye senario hiyo pekee, kama vile kuiburuta hufanya; katika Msingi huweka kifundo kila mahali.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Hiyo iko nje ya ramani. Latitudo ya Pseudo Mercator huanzia -85.05 hadi 85.05 na longitudo huanzia -180 hadi 180.';
$ec_lang['lpn_field_text_size']='Kizidishi cha ukubwa';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Onyesha katika kukuza yoyote';
$ec_lang['lpn_field_text_all_zoom_tip']='Weka maandishi haya kwenye mchoro haijalishi ni kiasi gani unapunguza kukuza. Ondoa alama na maandishi hujificha pamoja na lebo nyingine mara mwoneko unapokuwa mpana kuliko kiwango cha lebo kilichowekwa chini ya Ramani na ukurasa.';
$ec_lang['lpn_tool_labels']='Lebo';
$ec_lang['lpn_labels_heading_node']='Lebo za vifundo';
$ec_lang['lpn_labels_heading_link']='Lebo za viungo';
$ec_lang['lpn_labels_decimals_tip']='Idadi ya tarakimu za desimali zinazoonyeshwa kwa lebo hii';
$ec_lang['lpn_labels_mark_extrema']='Weka alama thamani za juu na za chini kabisa';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Huchora mstari juu ya thamani ya juu kabisa ya kila sifa iliyowekwa lebo kwenye ramani (mstari wa juu), na mstari chini ya thamani ya chini kabisa ya sifa hiyo (mstari wa chini).';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Tumia kwa vyote';
$ec_lang['lpn_settings_apply_to_all_tip']='Kila kipengele cha aina hii kilichokwisha chorwa hupewa kitambulisho kinachoanza na maandishi haya. Kila kimoja kinabaki na namba yake. Kitambulisho kisichoishia na namba hakiguswi.';
$ec_lang['lpn_confirm_apply_prefix']='Badilisha jina la vipengele {n} ili vitambulisho vyake vianze na {prefix}? Kila kimoja kinabaki na namba yake.';
$ec_lang['lpn_prefix_applied']='Vipengele {n} vimebadilishwa jina. Vingine {skipped} havikuguswa.';
$ec_lang['lpn_labels_prefix_tip']='Maandishi yanayoongezwa kabla ya sifa hii kwenye lebo za ramani';
$ec_lang['lpn_labels_suffix_tip']='Maandishi yanayoongezwa baada ya sifa hii kwenye lebo za ramani';
$ec_lang['lpn_labels_suffix_gradient_tip']='Maandishi yanayoongezwa baada ya mteremko wa upotevu wa kimo kwenye lebo za ramani. Usiandike alama ya asilimia hapa. Inaongezwa kwa ajili yako pale kitengo kinapokuwa asilimia.';
$ec_lang['lpn_labels_separator']='Maandishi kati ya thamani';
$ec_lang['lpn_labels_separator_tip']='Maandishi kati ya sifa moja na nyingine kwenye lebo. Nafasi (space) ndiyo chaguo-msingi.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Kipaumbele';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='Mpangilio wa kuondoa thamani wakati lebo haitoshei. 1 ndiyo inayobaki kwa muda mrefu zaidi.';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='Mpangilio wa kuacha kuonyesha thamani wakati lebo mbili za vifundo zingepishana. Thamani yenye namba 1 huachwa kwanza. Thamani moja ikibaki na lebo bado zinapishana, lebo nzima hufichwa: ile yenye mahitaji ya chini zaidi, shinikizo lililo karibu zaidi na katikati ya wigo, au mwinuko au kimo kinachofanana zaidi na vya vifundo jirani.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Kbl.';
$ec_lang['lpn_labels_col_after']='Bd.';
$ec_lang['lpn_labels_col_decimals']='Desimali';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Onyesha';
$ec_lang['lpn_labels_show_tip']='Mpangilio ambao thamani zinaonekana kwenye lebo. Thamani yenye namba 1 huja kwanza: juu ya lebo iliyorundikwa, na mwanzoni mwa lebo iliyo kwenye mstari mmoja.';
$ec_lang['lpn_labels_priority_customer_tip']='Mpangilio ambao thamani zinaondolewa kwenye lebo ya mteja. Thamani yenye namba 1 huondolewa kwanza.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Tumia vitengo';
$ec_lang['lpn_labels_use_units_tip']='Weka alama ili kuonyesha kitengo kwenye kisanduku cha Baada na kwenye lebo, na kukiweka sawa vitengo vinapobadilika. Ondoa alama ili kuandika maandishi yako mwenyewe ya Baada.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Hali ya awali';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Rangi za vifundo';
$ec_lang['lpn_settings_sym_link_colors']='Rangi za viungo';
$ec_lang['lpn_field_id']='Kitambulisho';
$ec_lang['lpn_backdrop_menu']='Picha ya Nyuma…';
$ec_lang['lpn_backdrop_add']='Ongeza';
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
$ec_lang['lpn_backdrop_scale']='Weka kipimo kwa kubofya';
$ec_lang['lpn_backdrop_scale_entry']='Weka kipimo kwa faili la kuratibu za picha au ukubwa wa pikseli moja kwenye ramani';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Badilisha kipimo kutoka ukubwa wa sasa, kuzunguka kituo unachochagua';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Bofya kituo kwenye picha ya nyuma kinachopaswa kubaki pale kilipo.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Badilisha kipimo kutoka ukubwa wake wa sasa. 1 huiacha ile ile, 1.1 huifanya kubwa zaidi kwa asilimia 10, 0.9 huifanya ndogo zaidi kwa asilimia 10.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Andika ukubwa wa pikseli moja kwenye ramani, au bandika maudhui yote ya faili la kuratibu za picha';
$ec_lang['lpn_backdrop_scale_entry_bad']='Andika nambari moja kwa ukubwa wa pikseli moja kwenye ramani, au bandika mistari yote sita ya faili la kuratibu za picha.';
$ec_lang['lpn_backdrop_wld_bad']='Faili hili la kuratibu za picha linazungusha, linaakisi, au kunyoosha picha kwa viwango visivyo sawa. Ramani inaweza tu kuhamisha picha na kubadilisha ukubwa wake kwa kiwango sawa pande zote mbili, hivyo faili halikutumika.';
$ec_lang['lpn_backdrop_unreadable']='Kivinjari chako hakiwezi kuonyesha picha hii. Ihifadhi kama PNG au JPEG kisha uiongeze tena.';
$ec_lang['lpn_backdrop_position']='Hamisha';
$ec_lang['lpn_backdrop_remove']='Ondoa';
$ec_lang['lpn_backdrop_remove_confirm']='Ondoa picha ya nyuma?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Ramani ya dunia…';
$ec_lang['lpn_map_attach_tip']='Ambatisha ramani ya dunia kwenye mradi huu bila kuubadilisha kwa njia nyingine yoyote.';
$ec_lang['lpn_map_attach_add']='Ambatisha';
$ec_lang['lpn_map_attach_readjust']='Rekebisha upya';
$ec_lang['lpn_map_attach_readjust_tip']='Rudi kwenye Hatua ya 2 ya mchakato wa kuambatisha ramani.';
$ec_lang['lpn_map_attach_scale_from']='Pima kutoka ukubwa wa sasa…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Pima ramani kutoka ukubwa wake wa sasa, kuhusu katikati ya mchoro wako. 1 huiacha sawa, 1.1 huifanya kubwa zaidi kwa 10%, 0.9 huifanya ndogo zaidi kwa 10%.';
$ec_lang['lpn_map_attach_scale_from_bad']='Andika namba moja iliyo kubwa kuliko sifuri.';
$ec_lang['lpn_map_attach_scale_from_done']='Ramani imebadilishwa ukubwa, na mchoro wako na kila kuratibu ndani yake ziko sawasawa kama zilivyokuwa.';
$ec_lang['lpn_map_attach_none']='Hakuna ramani ya dunia iliyoambatishwa kwenye mradi huu bado. Tumia Ramani, Ramani ya dunia, Ambatisha kwanza.';
$ec_lang['lpn_map_attach_remove']='Ondoa';
$ec_lang['lpn_map_attach_remove_tip']='Ondoa ramani ya dunia. Mchoro na kuratibu zake havibadiliki kwa njia yoyote.';
$ec_lang['lpn_map_attach_done']='Ramani ya dunia sasa iko nyuma ya mchoro wako, na mradi wako haujabadilika. Tumia Ramani, Ramani ya dunia, Ondoa ili kuiondoa tena.';
$ec_lang['lpn_map_attach_removed']='Ramani ya dunia imeondoka, na mchoro uko sawasawa kama ulivyokuwa.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Mchoro wako uko kwenye ramani ya dunia nzima, baharini kwenye latitudo sifuri na longitudo sifuri. Tafuta eneo lako kwanza: sogeza na ukuze ramani iliyo nyuma ya mchoro, tafuta jina la mahali, au andika latitudo na longitudo. Mchoro wenyewe hausogei.';
$ec_lang['lpn_mapgeo_step1']='Hatua ya 1 kati ya 2: tafuta mahali pako duniani';
$ec_lang['lpn_mapgeo_step2']='Hatua ya 2 kati ya 2: pima ramani iendane na mchoro wako';
$ec_lang['lpn_mapgeo_hint1']='Sogeza na ukuze ramani iliyo nyuma ya mchoro wako, au tafuta mahali, au andika latitudo na longitudo. Kisha bonyeza Weka kwa ukadiriaji.';
$ec_lang['lpn_mapgeo_readjust_intro']='Mchoro wako uko mahali ulipouweka mara ya mwisho. Kuuhamishia mahali pengine, sogeza na ukuze ramani iliyo nyuma ya mchoro, tafuta jina la mahali, au andika latitudo na longitudo. Mchoro wenyewe hausogei.';
$ec_lang['lpn_mapgeo_hint2']='Buruta mahali popote ili kuteleza ramani chini ya mchoro wako. Mchoro wako na kila kuratibu ndani yake hubaki mahali pale pale. Bonyeza Weka marejeleo ya kijiografia hapa ramani ikiwa sahihi.';
$ec_lang['lpn_mapgeo_gestures']='Kukuza husogeza mchoro wako na ramani pamoja, ili uone jinsi zinavyolingana. Kuburuta husogeza ramani pekee.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Zungusha ramani';
$ec_lang['lpn_mapgeo_dial_turn_read']='digrii {d}';
$ec_lang['lpn_mapgeo_dial_size']='Ukubwa wa ramani';
$ec_lang['lpn_mapgeo_dial_size_read']='mara {f}';
$ec_lang['lpn_mapgeo_dial_help']='Teleza pau mbili, au andika kwenye visanduku vilivyo juu yake, ili kuifanya ramani kubwa zaidi au ndogo zaidi na kuizungusha. Katikati ya kila pau ndipo ulipoacha hatua ya 1, hivyo 1 na 0 humaanisha usiibadilishe. Vitufe vya mshale hufanya kazi kwa zote mbili.';
$ec_lang['lpn_mapgeo_place']='Weka kwa ukadiriaji';
$ec_lang['lpn_mapgeo_finish']='Weka marejeleo ya kijiografia hapa';
$ec_lang['lpn_mapgeo_cancelled']='Ramani ya dunia imerudi mahali ilipokuwa, na mchoro wako haukusogea kamwe.';
$ec_lang['lpn_mapgeo_locked']='Maliza kwa kitufe cha Weka marejeleo ya kijiografia hapa, au bonyeza Ghairi, kabla ya kubadilisha miradi au kuhifadhi. Ramani ya dunia bado inawekwa.';
$ec_lang['lpn_backdrop_scale_prompt1']='Bofya vituo viwili kwenye picha ya nyuma, kama ncha mbili za kipimo cha mstari (bar scale). Kisha andika umbali halisi kati yake.';
$ec_lang['lpn_backdrop_scale_prompt2']='Umbali halisi kati ya vituo hivyo viwili';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Bofya kituo cha msingi (kwenye picha) kwa ajili ya kuhamisha.';
$ec_lang['lpn_backdrop_position_prompt2']='Chagua njia ya kupata kituo cha marudio, kisha bofya Endelea.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Inarekebisha picha ya nyuma.';
$ec_lang['lpn_backdrop_target_label']='Hamisha kituo hicho kwenda:';
$ec_lang['lpn_backdrop_target_node']='Kifundo';
$ec_lang['lpn_backdrop_target_free']='Kituo chochote kwenye ramani';
$ec_lang['lpn_backdrop_target_coords']='Kuratibu unazoandika';
$ec_lang['lpn_backdrop_coords_prompt']='Andika X,Y kituo hicho kinapaswa kuhamia';
$ec_lang['lpn_backdrop_continue']='Endelea';
$ec_lang['lpn_tool_settings']='Mipangilio';
$ec_lang['lpn_settings_show_titles']='Onyesha vichwa vya ukurasa';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='Inaficha kichwa cha ukurasa na mstari wa karibu juu ya mchoro, ili ramani ipate nafasi zaidi ya kufanyia kazi. Uchapishaji huonyesha ramani safi pekee kila wakati.';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Ficha vichwa hivi';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Onyesha msaada wa uchaguzi';
$ec_lang['lpn_settings_area_hint_tip']='Inaonyesha kiputo juu ya ramani kinachosema bofya lako lijalo litafanya nini wakati unachagua eneo.';
$ec_lang['lpn_settings_id_prefixes']='Viambishi vya kitambulisho';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Thamani za kuanzia';
$ec_lang['lpn_settings_defaults_note']='Zinatumika kwa vipengele unavyotengeneza kuanzia sasa. Vipengele vilivyopo tayari havibadiliki.';
$ec_lang['lpn_settings_push_note']='Sifa ambazo lebo zake zinaonekana sasa hivi tu ndizo zinazotumika.';
$ec_lang['lpn_settings_push_btn']='Tumia thamani hizi za vipengele vipya kwa kila kipengele kilichopo';
$ec_lang['lpn_push_confirm']='Badilisha sifa hizi kwenye kila kipengele kilichopo tayari na thamani za sasa za kuanzia? Thamani ulizoandika zitaandikwa upya. Unaweza kutengua hili.';
$ec_lang['lpn_push_properties']='Sifa:';
$ec_lang['lpn_push_assets']='Vifundo na mabomba:';
$ec_lang['lpn_push_none_displayed']='Hakuna thamani ya kuanzia inayoonekana kama lebo sasa hivi, hivyo hakuna cha kutumia. Washa lebo za sifa unazotaka kwenye Kidirisha cha Lebo, kisha jaribu tena.';
$ec_lang['lpn_push_nothing']='Hakuna kipengele kilichopo kinachomiliki sifa yoyote kati ya zinazotumiwa.';
$ec_lang['lpn_push_no_change']='Kila kipengele tayari kina thamani hizi, hivyo hakuna kitakachobadilika.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Sifa maalum';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Sifa unazozifafanua mwenyewe kwa madhumuni yako. Zinahifadhiwa pamoja na mradi na senario kama sifa nyingine zote.';
$ec_lang['lpn_cp_design']='Muundo';
$ec_lang['lpn_cp_design_tip']='Safu moja kwa kila sifa maalum, na kila moja hufunguka kuonyesha: Ufunguo, Lebo, Inatumika kwa, Thibitisha kama, Ruhusu au zuia, sehemu ya vibambo iliyotajwa na chaguo hilo, Kikomo cha chini cha urefu, Kikomo cha juu cha urefu, Kikomo cha chini, Kikomo cha juu.';
$ec_lang['lpn_cp_add']='Ongeza sifa maalum';
$ec_lang['lpn_cp_add_tip']='Huongeza safu kwenye jedwali la muundo na kuifungua kwa ajili ya kuhariri.';
$ec_lang['lpn_cp_remove_tip']='Huondoa sifa hii kwenye jedwali la muundo. Thamani zilizokwisha andikwa kwenye vipengele vyako zinabaki kwenye faili na hurejea ukiifafanua tena funguo hiyo hiyo.';
$ec_lang['lpn_cp_none']='Hakuna sifa maalum iliyofafanuliwa bado.';
$ec_lang['lpn_cp_unnamed']='Bado haijapewa jina';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Ufunguo';
$ec_lang['lpn_cp_key_tip']='Ufunguo: Sifa huhifadhiwa chini ya jina hili. Nafasi hairuhusiwi, na kiambishi huongezwa kwa niaba yako ili ufunguo wako usigongane na sehemu iliyojengwa ndani.';
$ec_lang['lpn_cp_label']='Lebo';
$ec_lang['lpn_cp_label_tip']='Lebo: Msomaji huona hii kwenye kisanduku cha sifa, kwenye Tafuta, na juu ya safu wima ya jedwali.';
$ec_lang['lpn_cp_applies']='Inatumika kwa';
$ec_lang['lpn_cp_applies_tip']='Inatumika kwa: Orodha ya viambishi vya ID vilivyotenganishwa kwa mkato, kwa vipengele vinavyotumia sifa hii, kama vile J,L,R.';
$ec_lang['lpn_cp_validate']='Thibitisha kama';
$ec_lang['lpn_cp_validate_tip']='Thibitisha kama: Hii huelezea thamani nzuri inavyoonekana. Kanuni za herufi kubwa/ndogo husoma alfabeti ya Kiingereza pekee, ambayo ni kikomo kilichotajwa. Chagua Usithibitishe ili kukubali chochote.';
$ec_lang['lpn_cp_restrict']='Zuia vibambo hivi';
$ec_lang['lpn_cp_restrict_tip']='Zuia vibambo hivi: Thamani inaweza kutumia vibambo vilivyoorodheshwa hapa pekee, au visivyokuwemo, ambapo "@" humaanisha herufi yoyote; "#" humaanisha tarakimu yoyote ya nambari, na lazima uorodheshe kando "-", ".", na "," kama vinaruhusiwa; na vibambo vyovyote vya nafasi tupu lazima viwe kati ya vibambo vingine.';
$ec_lang['lpn_cp_restrict_mode']='Ruhusu au zuia';
$ec_lang['lpn_cp_restrict_mode_tip']='Ruhusu au zuia: Vibambo vilivyotolewa ndivyo pekee thamani inaweza kutumia au ndivyo haviruhusiwi kutumika.';
$ec_lang['lpn_cp_restrict_allow']='Ruhusu vibambo hivi pekee';
$ec_lang['lpn_cp_minlength']='Kikomo cha chini cha urefu';
$ec_lang['lpn_cp_minlength_tip']='Kikomo cha chini cha urefu: Kiingizo kifupi zaidi huashiriwa, ambavyo ndivyo unavyopata viingizo tupu na vilivyoandikwa nusu.';
$ec_lang['lpn_cp_length']='Kikomo cha juu cha urefu';
$ec_lang['lpn_cp_length_tip']='Kikomo cha juu cha urefu: Kiingizo kirefu zaidi huashiriwa.';
$ec_lang['lpn_cp_low']='Kikomo cha chini';
$ec_lang['lpn_cp_low_tip']='Kikomo cha chini: Hii ndiyo thamani ndogo zaidi unayotarajia. Nambari hulinganishwa kama nambari na maandishi kwa mpangilio wa kamusi.';
$ec_lang['lpn_cp_high']='Kikomo cha juu';
$ec_lang['lpn_cp_high_tip']='Kikomo cha juu: Hii ndiyo thamani kubwa zaidi unayotarajia. Nambari hulinganishwa kama nambari na maandishi kwa mpangilio wa kamusi.';
$ec_lang['lpn_cp_val_none']='Usithibitishe';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Nambari .';
$ec_lang['lpn_cp_val_number_comma']='Nambari ,';
$ec_lang['lpn_cp_val_integer']='Namba kamili';
$ec_lang['lpn_cp_val_upper']='HERUFI KUBWA ZOTE';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Thamani imehifadhiwa kama ulivyoiandika hasa.';
$ec_lang['lpn_cp_bad_number']='Thamani hii si nambari kama inavyohitajika kwa sifa hii.';
$ec_lang['lpn_cp_bad_integer']='Thamani hii si namba kamili kama inavyohitajika kwa sifa hii.';
$ec_lang['lpn_cp_bad_case']='Thamani hii si HERUFI KUBWA ZOTE kama inavyohitajika kwa sifa hii.';
$ec_lang['lpn_cp_bad_chars']='Thamani hii inatumia kibambo ambacho sifa hii hakiruhusu.';
$ec_lang['lpn_cp_bad_space']='Nafasi tupu inaruhusiwa kati ya vibambo vingine pekee.';
$ec_lang['lpn_cp_bad_minlength']='Thamani hii ni fupi zaidi ya kile sifa hii inaruhusu.';
$ec_lang['lpn_cp_bad_length']='Thamani hii ni ndefu zaidi ya kile sifa hii inaruhusu.';
$ec_lang['lpn_cp_bad_low']='Thamani hii iko chini ya kikomo cha chini cha sifa hii.';
$ec_lang['lpn_cp_bad_high']='Thamani hii iko juu ya kikomo cha juu cha sifa hii.';
$ec_lang['lpn_cp_key_needed']='Ipe sifa hii maalum ufunguo usio na nafasi.';
$ec_lang['lpn_cp_key_taken']='Sifa nyingine maalum tayari inatumia ufunguo huo.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Senario';
$ec_lang['lpn_scenario_base']='Msingi';
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
$ec_lang['lpn_scenario_overrides']='Idadi ya thamani maalum';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Pete ya rangi ya kahawia-njano inamaanisha kipengele hiki kina thamani inayomilikiwa na senario {name} pekee.';
$ec_lang['lpn_scenario_overrides_tip']='Kila moja ya thamani hizo imewekwa alama kwenye ramani kwa pete ya rangi ya kahawia-njano. Badilisha kwenda {base} ili kuona mchoro bila hizo.';
$ec_lang['lpn_scenario_menu']='Senario';
$ec_lang['lpn_scenario_tip']='Mkusanyiko wa thamani ambazo mchoro unaonyesha na ukurasa unatatua sasa hivi. Bofya ili kubadilisha senario, au kuongeza, kubadilisha jina, au kufuta moja.';
$ec_lang['lpn_scenario_new']='Senario mpya…';
$ec_lang['lpn_scenario_new_name']='Senario {n}';
$ec_lang['lpn_scenario_prompt_name']='Jina la senario hii';
$ec_lang['lpn_scenario_rename']='Badilisha jina la senario…';
$ec_lang['lpn_scenario_delete']='Futa senario';
$ec_lang['lpn_scenario_delete_confirm']='Futa senario {name}, na thamani {n} zinazoimilikia peke yake? Mchoro wenyewe hautabadilika.';
$ec_lang['lpn_scenario_override']='Katika senario hii pekee';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Kuweka alama kunamaanisha thamani hii inamilikiwa na senario hii pekee, hata ikiwa ni namba ile ile ya Msingi. Ondoa alama ili kutumia tena thamani ya Msingi.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Senario ya Msingi: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} haimo kwenye mtandao katika {scenario}. Bado ipo kwenye mchoro, na kwenye senario zako nyingine.';
$ec_lang['lpn_scenario_push_btn']='Weka thamani za Msingi kwenye senario zote';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Kila senario inarudi kwenye thamani ya Msingi kwa sifa ambazo lebo zake zinaonyeshwa sasa hivi. Thamani zinazomilikiwa na senario hizo pekee zinatupwa.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Fanya kila senario itumie thamani za Msingi kwa sifa hizi? Thamani zinazomilikiwa na senario hizo pekee zinatupwa. Unaweza kutengua hili.';
$ec_lang['lpn_scenario_push_scenarios']='Senario zinazoathirika:';
$ec_lang['lpn_scenario_push_values']='Thamani zinazotupwa:';
$ec_lang['lpn_scenario_push_none']='Hakuna senario yenye thamani yake mwenyewe kwa sifa yoyote kati ya hizi, hivyo hakuna kitakachobadilika. Hakuna kinachotupwa.';
$ec_lang['lpn_scenario_preset_flow_static']='1. Jaribio la mtiririko: Tuli';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Urekebishaji wa jaribio la mtiririko kwa mtandao wa kubuni kwenye mtiririko 0. Katika senario hii, weka mahitaji kwenye miunganiko yote kuwa 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Jaribio la mtiririko: Wastani';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Urekebishaji wa jaribio la mtiririko kwa mtandao wa kubuni kwenye mtiririko wa kwanza ulioripotiwa. Katika senario hii, weka mahitaji kwenye muunganiko unaotiririka kuwa mtiririko wa kwanza uliopimwa, na mahitaji kwenye miunganiko mingine yote kuwa 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Jaribio la mtiririko: Upeo';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Urekebishaji wa jaribio la mtiririko kwa mtandao wa kubuni kwenye mtiririko wa juu kabisa ulioripotiwa. Katika senario hii, weka mahitaji kwenye muunganiko unaotiririka kuwa mtiririko wa juu kabisa uliopimwa, na mahitaji kwenye miunganiko mingine yote kuwa 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Siku ya wastani';
$ec_lang['lpn_scenario_preset_average_day_tip']='Kizidishi cha mahitaji 1: kila hitaji kama lilivyoingizwa, ambalo huchukuliwa kuwa mahitaji ya siku ya wastani.';
$ec_lang['lpn_scenario_preset_max_day']='5. Siku ya upeo';
$ec_lang['lpn_scenario_preset_max_day_tip']='Kizidishi cha mahitaji 2.0 mara siku ya wastani, thamani ya kishikilia nafasi. Mifumo mingi iko kati ya 1.2 na 3.0 (National Research Council, 2006). Weka ya mfumo wako mwenyewe kwenye Mipangilio, Ukokotoaji, Haidroliki, Kizidishi cha mahitaji.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Saa ya kilele';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='Kizidishi cha mahitaji 3.0 mara siku ya wastani, thamani ya kishikilia nafasi. Mifumo mingi iko kati ya 3.0 na 6.0 (National Research Council, 2006). Weka ya mfumo wako mwenyewe kwenye Mipangilio, Ukokotoaji, Haidroliki, Kizidishi cha mahitaji.';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. Moto pamoja na siku ya upeo';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='Mahitaji ya siku ya upeo (kizidishi 2.0). Endesha Uchambuzi wa mtiririko wa moto kwenye senario hii: huongeza mtiririko wa moto kwenye kila muunganiko juu ya mahitaji haya.';
$ec_lang['lpn_delete_drops_overrides']='Kufuta kipengele hiki pia kunatupa thamani {n} ambazo senario zako zinazishikilia kwa ajili yake. Endelea?';
$ec_lang['lpn_push_base_only']='Kitendo hiki kinabadilisha mchoro wenyewe, hivyo kinaweza kufanywa tu katika {base}. Badilisha kwenda {base} na ujaribu tena.';
$ec_lang['lpn_field_active']='Sehemu ya mtandao huu';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Ondoa alama kwenye kisanduku hiki ili kipengele kibaki kwenye mchoro lakini nje ya mtandao: kinachorwa kwa rangi ya kijivu na kitatuzi hukipuuza. Katika senario, hivi ndivyo bomba linalopendekezwa huwashwa na kuzimwa.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Kipeo cha emitter';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='Kipeo katika mlinganyo wa emitter wa EPANET kwa vinyunyizio na uvujaji: mtiririko = mgawo x shinikizo ukiinuliwa kwa kipeo hiki. Hubadilisha jibu tu pale kifundo kina emitter, ambayo kwa sasa inamaanisha mtandao uliosomwa kutoka faili la EPANET.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Soma DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Inasoma mwinuko wa DEM kwenye kifundo hiki na kuuonyesha hapa chini. Hakuna kinachobadilika kwenye kisanduku cha Mwinuko. Ubora wa mlalo wa DEM ni mita 30 hivi kwa sehemu kubwa ya Dunia, na bora zaidi pale data nzuri zaidi ipo.';
$ec_lang['lpn_elev_dem_use']='Tumia DEM';
$ec_lang['lpn_elev_dem_use_tip']='Inaweka mwinuko wa DEM kwenye kifundo hiki katika kisanduku cha Mwinuko hapo juu, kikibadilisha kilichokuwepo. Inasoma DEM kwanza kama bado haijasomwa. Tengua moja kinairudisha.';
$ec_lang['lpn_elev_dem_none']='DEM haina mwinuko kwa kifundo hiki.';
$ec_lang['lpn_elev_dem_said']='DEM ya Mapbox inasema {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Chanzo cha mwinuko';
$ec_lang['lpn_settings_elev_source_tip']='Mahali kifundo kipya kinapopata mwinuko wake. Usoni mwa ardhi husomwa kutoka DEM ya Mapbox, ambayo ni mita 30 hivi kwa upana katika sehemu kubwa ya Dunia, na bora zaidi pale data nzuri zaidi ipo.';
$ec_lang['lpn_settings_elev_source_typed']='Mwinuko ulioandikwa hapo juu';
$ec_lang['lpn_settings_elev_source_dem']='DEM ya Mapbox';
$ec_lang['lpn_settings_accuracy']='Usahihi';
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
$ec_lang['lpn_settings_default_is']='Chaguo-msingi ni {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Ni kwa kiasi gani kitatuzi kinatakiwa kukaribia kabla ya kusimama, kikipimwa kama kiasi ambacho mtiririko bado unabadilika kutoka jaribio moja hadi lingine. Namba ndogo zaidi ni sahihi zaidi na huchukua muda mrefu zaidi. Vitatuzi vyote viwili husoma kisanduku hiki kimoja, na kila kimoja hupima mabadiliko hayo dhidi ya jumla tofauti: kitatuzi kilichojengwa ndani dhidi ya jumla ya mahitaji, EPANET dhidi ya jumla ya mtiririko wa viungo. Kikiachwa tupu, ukurasa huu hutumia usahihi mkali zaidi kuliko chaguo-msingi la EPANET lenyewe.';
$ec_lang['lpn_settings_specific_gravity']='Uzito maalum';
$ec_lang['lpn_settings_specific_gravity_tip']='Uzito wa maji maji ukilinganishwa na maji. Hubadilisha shinikizo ambalo kipimo kingesoma, si mtiririko.';
$ec_lang['lpn_settings_viscosity']='Unato wa uwiano';
$ec_lang['lpn_settings_viscosity_tip']='Unato wa maji maji ukilinganishwa na maji kwenye nyuzi 20 Selsiasi. Hubadilisha jibu tu chini ya mbinu ya Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Idadi ya juu ya marudio';
$ec_lang['lpn_settings_trials_tip']='Ni marudio mangapi yanaruhusiwa kabla kitatuzi hakijaacha kujaribu mtandao usiopata suluhisho.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Ikiwa halijapata suluhisho';
$ec_lang['lpn_settings_unbalanced_tip']='Nini cha kufanya na mtandao ulioisha marudio yake na bado haujapata suluhisho. Kuruhusu marudio ya ziada mara nyingi hufikia suluhisho. Kusimama huripoti jaribio la mwisho jinsi lilivyo, ambalo si suluhisho. Kisanduku hiki kinasomwa na kitatuzi cha EPANET pekee. Kitatuzi kilichojengwa ndani husimama kila wakati na kuweka alama kwamba jibu halikupata suluhisho.';
$ec_lang['lpn_settings_unbalanced_continue']='Ruhusu marudio ya ziada';
$ec_lang['lpn_settings_unbalanced_stop']='Simama na uripoti jaribio la mwisho';
$ec_lang['lpn_settings_unbalanced_trials']='Marudio ya ziada kabla ya kuripoti';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Ni marudio mangapi zaidi ya kuruhusu baada ya idadi ya juu hapo juu kuisha, kabla ya jaribio la mwisho kuripotiwa. Kisanduku hiki kinasomwa na kitatuzi cha EPANET pekee.';
$ec_lang['lpn_settings_head_error']='Kikomo cha hitilafu ya kimo';
$ec_lang['lpn_settings_head_error_tip']='Jaribio la ziada ambalo kitatuzi lazima lipite kabla ya kusimama: hitilafu kubwa zaidi ya kimo iliyobaki kwenye bomba lolote moja. Sifuri inamaanisha usitumie jaribio hili. Kisanduku hiki kinasomwa na kitatuzi cha EPANET pekee.';
$ec_lang['lpn_settings_flow_change']='Kikomo cha mabadiliko ya mtiririko';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Jaribio la ziada ambalo kitatuzi lazima lipite kabla ya kusimama: mabadiliko makubwa zaidi ya mtiririko wa bomba lolote moja kutoka jaribio moja hadi lingine. Sifuri inamaanisha usitumie jaribio hili. Kisanduku hiki kinasomwa na kitatuzi cha EPANET pekee.';
$ec_lang['lpn_settings_damp_limit']='Ukandamizaji huanza kwa';
$ec_lang['lpn_settings_damp_limit_tip']='Usahihi ambao kitatuzi huanza kuchukua hatua ndogo zaidi, jambo linaloweza kusaidia mtandao unaotikisika kupata suluhisho. Sifuri inamaanisha kitatuzi hakiwahi kukandamiza. Kisanduku hiki kinasomwa na kitatuzi cha EPANET pekee.';
$ec_lang['lpn_settings_option_unset']='Haijatajwa';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Kigawo kimoja kinachotumika kwa mahitaji yote kwenye mtandao mara moja. Kitumie kuuliza mfumo unafanya nini kwa matumizi zaidi au pungufu ya ya sasa. Hakibadilishi namba ulizoandika. Senario inaweza kuwa na chake, hivyo siku ya wastani, siku ya juu kabisa, na saa ya kilele ni namba moja kila moja; kiache tupu kwenye senario ili kutumia kile cha mradi.';
$ec_lang['lpn_settings_engine_native']='Tatua kwa kitatuzi cha EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='Washa hii ili kutumia kitatuzi kilichojengwa ndani pale inapowezekana. La sivyo, kitatuzi cha EPANET kutoka Shirika la Ulinzi wa Mazingira la Marekani (US EPA) hutumika kila wakati. Kitatuzi kilichojengwa ndani hakitumiki kwa uigaji wa muda mrefu au kwa PRV, PSV, au FCV inayofanya kazi. Mara ya kwanza kitatuzi cha EPANET kinapotumika, takriban KB 650 hupakuliwa kisha kubaki kwenye kifaa hiki. Pale bomba linapobeba upotevu mdogo (wa ndani), vitatuzi viwili hutofautiana kwenye tarakimu za mwisho: EPANET hurunda thamani inayoitumia kwa mvuto wa dunia, hivyo upotevu wake mdogo hutokea chini kidogo sana kuliko fomu kamili.';
$ec_lang['lpn_engine_loading']='Inapakia kitatuzi cha EPANET…';
$ec_lang['lpn_engine_failed']='Imeshindwa kupakia kitatuzi cha EPANET. Inaonyesha kitatuzi cha ndani badala yake.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Kimetatuliwa kwa kitatuzi cha EPANET, kwa sababu vali hizi hujifungua na kujifunga zenyewe:';
$ec_lang['lpn_unit_unknown']='Mchoro huu unataja kitengo ambacho ukurasa huu hautoi: {unit}. Kila kitu kimehifadhiwa na kinaonyeshwa jinsi kilivyoingia, na hakuna kilichobadilishwa. Hakuna jibu litakalotolewa mpaka ukurasa huu ujue kitengo hicho, kwa sababu hakuna njia ya kujua ukubwa wake.';
$ec_lang['lpn_engine_manning_note']='Kumbuka: kwa usuguo wa Manning, EPANET hurunda kigezo katika mlingano wa Manning, hivyo upotevu wa kimo hutokea chini kwa takriban asilimia 0.6 kuliko fomu kamili.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='Kitatuzi cha EPANET hakikukubali mtandao huu, hivyo hakikuuendesha.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='Kitatuzi cha EPANET kilisema: {message}';
$ec_lang['lpn_engine_refused_fallback']='Namba zilizo kwenye skrini zilitoka kwenye kitatuzi cha ndani badala yake.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Namba zilizo kwenye skrini zilitoka kwenye kitatuzi cha ndani badala yake. Kinakokotoa muda mmoja kwa wakati, hivyo huu ni mtandao katika {time} pekee, huku kila tanki likiwa bado kwenye kiwango chake cha kuanzia.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Vidhibiti hivi vinataja kipengele ambacho hakimo tena kwenye mradi huu, hivyo viliachwa nje: {ids}';
$ec_lang['lpn_control_unreadable_note']='Vidhibiti hivi havikuweza kusomwa, hivyo viliachwa nje: {ids}';
$ec_lang['lpn_rule_dangling_note']='Kanuni hizi zinarejelea kipengele ambacho hakipo tena kwenye mradi huu, hivyo zilipuuzwa katika uendeshaji huu: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Kanuni hizi hazikuweza kusomwa, hivyo zilipuuzwa katika uendeshaji huu: {ids}';
$ec_lang['lpn_settings_text_size']='Ukubwa wa maandishi (pikseli)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Ukubwa wa alama (pikseli)';
$ec_lang['lpn_settings_link_width']='Upana wa mstari wa bomba (pikseli)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Mishale ya mwelekeo wa mtiririko';
$ec_lang['lpn_settings_show_arrows_tip']='Chora mshale kwenye kila bomba unaoonyesha upande maji yanayotiririka. Mishale inaonekana baada ya kuendesha, na kuizima hakubadilishi matokeo. Mpangilio huu unahifadhiwa pamoja na mradi.';
$ec_lang['lpn_settings_align_labels']='Lainisha lebo za bomba na mabomba';
$ec_lang['lpn_settings_readability_bias']='Geuza lebo chini juu ikiwa imeinama zaidi ya nyuzi hizi kushoto ya wima';
$ec_lang['lpn_settings_readability_bias_tip']='Geuza lebo ili ibaki sawa juu wakati imeinama zaidi ya nyuzi hizi kushoto ya wima.';
$ec_lang['lpn_settings_mask_labels']='Mandharinyuma imara nyuma ya lebo';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Bandika mistari inayounganisha lebo kwenye pembe zilizowekwa';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='Unapoburuta lebo mbali na kile inachokitaja, mstari unaorudi kwake huvutwa kwenye pembe iliyo karibu zaidi kati ya zilizowekwa ukiburuta karibu na moja. Endelea kuburuta na kubandika kunaachia, hivyo pembe yoyote bado inapatikana. Ukizima, huburuta kwa uhuru, ambavyo ukurasa huu umekuwa ukifanya siku zote.';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Onyesha lebo ukiwa umekuza hadi upana huu wa ramani au chini yake';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Lebo huchorwa tu wakati mwoneko wa ramani una upana huu au mwembamba zaidi. Acha kisanduku wazi ili kuzichora katika kukuza yoyote. Andika 0 ili kutochora lebo kamwe, katika kukuza yoyote.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Onyesha daima';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='Zuia vifundo visipime kubwa zaidi ya';
$ec_lang['lpn_settings_symbol_cap_mid']='mara urefu wa';
$ec_lang['lpn_settings_symbol_cap_post']='bomba la asilimia';
$ec_lang['lpn_settings_symbol_cap_tip']='Muunganiko huacha kukua ardhini pale kipenyo chake kingefikia mara hii nyingi ya urefu wa bomba katika asilimia hii ya urefu wa mabomba yote kwenye mtandao. Kupita hatua hiyo kwenye ramani, miunganiko, mabomba na alama nyingine hupungua kwenye skrini unapopunguza kukuza badala ya kukua ardhini. Hifadhi za maji na matanki ni tofauti na hubaki na ukubwa wao wa skrini katika kukuza yoyote.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Uzito wa alama (0 hadi 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Uzito wa picha ya nyuma (0 hadi 1)';
$ec_lang['lpn_settings_map_display']='Mwonekano';
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
$ec_lang['lpn_settings_legend_position']='Nafasi ya ufunguo wa lebo';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Hakuna';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Imezimwa';
$ec_lang['lpn_settings_legend_top_left']='Juu kushoto';
$ec_lang['lpn_settings_legend_top_right']='Juu kulia';
$ec_lang['lpn_settings_legend_middle_left']='Katikati kushoto';
$ec_lang['lpn_settings_legend_middle_right']='Katikati kulia';
$ec_lang['lpn_settings_legend_bottom_left']='Chini kushoto';
$ec_lang['lpn_settings_legend_bottom_right']='Chini kulia';
$ec_lang['lpn_settings_color_node_field']='Rangi ya kifundo';
$ec_lang['lpn_settings_color_link_field']='Rangi ya bomba';
$ec_lang['lpn_settings_color_ramp']='Mpangilio wa rangi';
$ec_lang['lpn_settings_color_credits']='Shukrani';
$ec_lang['lpn_color_ramp_epanet']='Bluu hadi nyekundu (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Zambarau hadi njano (rahisi zaidi kutofautisha rangi moja na nyingine)';
$ec_lang['lpn_color_ramp_gray']='Kijivu hafifu hadi kijivu kiza';
$ec_lang['lpn_settings_color_reverse']='Geuza mpangilio wa rangi';
$ec_lang['lpn_color_none']='Hakuna rangi';
$ec_lang['lpn_settings_color_key_position']='Nafasi ya ufunguo wa rangi';
$ec_lang['lpn_settings_color_breaks']='Mipaka ya bendi za rangi';
$ec_lang['lpn_settings_color_equal_intervals']='Vipindi sawa';
$ec_lang['lpn_settings_color_equal_counts']='Idadi sawa';
$ec_lang['lpn_settings_color_no_values']='Hakuna thamani za kutumia bado. Tatua mtandao kwanza.';
$ec_lang['lpn_confirm_restore_defaults']='Rejesha mipangilio yote (viambishi vya kitambulisho, thamani za kuanzia, mipangilio ya kikokotoo, mwonekano wa ramani, nafasi ya ufunguo wa ramani, na lebo zinazoonekana) kwenye thamani zake za asili? Mtandao wako haubadiliki. Mipangilio ni ya mradi ulio wazi, hivyo miradi yako mingine inabaki na yake.';
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
$ec_lang['lpn_settings_wipe_btn']='Anza upya';
$ec_lang['lpn_confirm_wipe']='Anza upya, na ufute KILA KITU kilichohifadhiwa kwa ukurasa huu: kila mradi, kila picha ya nyuma, mipangilio yote, na chaguo lako la vitengo? Ukurasa utapakiwa upya kama vile mtembeleaji mpya kabisa angeuona. Hili haliwezi kutenguliwa.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Nakili kiungo hiki:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Muda';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Muda wote wa kuendesha';
$ec_lang['lpn_time_hyd_step']='Hatua ya muda ya kihaidroliki';
$ec_lang['lpn_time_pattern_step']='Hatua ya muda ya muundo';
$ec_lang['lpn_time_pattern_start']='Muda wa kuanzia wa muundo';
$ec_lang['lpn_time_report_step']='Hatua ya muda ya taarifa';
$ec_lang['lpn_time_report_start']='Muda wa kuanzia wa taarifa';
$ec_lang['lpn_time_clock_start']='Saa mwanzoni';
$ec_lang['lpn_time_clock_day']='Siku {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Andika muda kama saa na dakika, kwa mfano 2:30. Namba peke yake inamaanisha saa, hivyo 8 ni saa nane. Nusu saa ni 0:30.';
$ec_lang['lpn_time_running']='Inakokotoa uigaji wa kipindi kirefu cha muda kwa kutumia kitatuzi cha EPANET.';
$ec_lang['lpn_time_no_engine']='Kitatuzi kilichojengwa ndani hukokotoa wakati mmoja kwa wakati, hivyo huu ni mtandao katika {time} pekee: kila muundo unasomwa wakati huo, na kila tanki bado liko kwenye kiwango chake cha mwanzo badala ya kujaa na kupungua. Unganisha kwenye intaneti mara moja ili kupakua kitatuzi cha EPANET, ambacho huendesha uigaji wa kipindi kirefu cha muda.';
$ec_lang['lpn_time_slider']='Muda';
$ec_lang['lpn_time_no_period']='Mradi huu hauna uigaji wa kipindi kirefu cha muda uliowekwa, hivyo kuna wakati mmoja tu wa kuonyesha. Weka Muda wote wa kuendesha chini ya Mipangilio, Ukokotoaji, Muda ili kuendesha uigaji wa kipindi kirefu cha muda.';
$ec_lang['lpn_time_first']='Nenda mwanzoni';
$ec_lang['lpn_time_prev']='Rudi hatua moja';
$ec_lang['lpn_time_play']='Cheza';
$ec_lang['lpn_time_play_tip']='Cheza mchoro hai';
$ec_lang['lpn_time_pause_tip']='Simamisha mchoro hai';
$ec_lang['lpn_time_pause']='Simamisha';
$ec_lang['lpn_time_next']='Songa hatua moja';
$ec_lang['lpn_time_last']='Nenda mwishoni';
$ec_lang['lpn_time_tank']='Tanki';
$ec_lang['lpn_time_level']='Kiwango cha maji';
$ec_lang['lpn_time_run']='Kokotoa';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Tatua mtandao huu kwa kila hatua ya wakati wa haidroliki, kutoka mwanzo wa uendeshaji hadi mwisho wake.';
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
$ec_lang['lpn_time_run_done']='Uendeshaji umekamilika. Nyakati za taarifa: {frames}. Muda uliochukua: sekunde {secs}.';
$ec_lang['lpn_time_runbox_hide']='Usionyeshe kisanduku hiki tena';
$ec_lang['lpn_settings_runbox']='Onyesha kisanduku cha maendeleo ya usuluhishaji';
$ec_lang['lpn_settings_runbox_tip']='Kisanduku kinachoripoti usuluhishaji umefikia wapi na kilichopata. Ikiwa imezimwa, usuluhishaji uliomalizika husema jambo lile lile kwenye mstari wa hali kwa sekunde chache badala yake. Hii ni mpangilio wa kivinjari hiki, si wa mradi.';
$ec_lang['lpn_time_run_failed']='Uendeshaji haukukamilika, hivyo hakuna matokeo kwa nyakati za baadaye.';
$ec_lang['lpn_time_run_report']='Taarifa ya uendeshaji ya EPANET';
$ec_lang['lpn_time_run_report_copy']='Nakili';
$ec_lang['lpn_time_run_report_copied']='Imenakiliwa';
$ec_lang['lpn_time_run_report_tip']='Kile ambacho kitatuzi cha EPANET chenyewe kilichapisha kuhusu uendeshaji wa mwisho: kama kilipata suluhisho, na chochote kilichoonya kuhusu. Ni maandishi ya kitatuzi chenyewe, si yetu.';

$ec_lang['lpn_time_speed']='Kasi';
$ec_lang['lpn_time_speed_tip']='Ni kwa kasi gani uendeshaji unachezwa tena.';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Tafuta mipangilio';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Andika neno ili kuona mipangilio inayolitaja pekee. Maelezo pia yanatafutwa, si majina pekee.';
$ec_lang['lpn_settings_no_match']='Hakuna mpangilio unaotaja neno hilo.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Upana wa orodha ya sehemu ya Mipangilio';
$ec_lang['lpn_rpane_empty']='Hakuna kilichowekwa hapa bado. Kila kinachohusu mradi mzima kiko kwenye Mipangilio.';
$ec_lang['lpn_time_settings_open']='Mipangilio ya muda';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Taswira';
$ec_lang['lpn_settings_sec_map']='Ramani na ukurasa';
$ec_lang['lpn_settings_sec_assets']='Vipengele';
$ec_lang['lpn_settings_sec_calculation']='Ukokotoaji';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Mteja';
$ec_lang['lpn_labels_customer_note']='Lebo ya mteja huonyesha thamani zilizowekwa alama hapa. Huchorwa kwa ukubwa ule ule wa maandishi kama lebo nyingine yoyote kwenye ramani.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Lebo za wateja huchorwa tu wakati mwoneko wa ramani una upana huu au mwembamba zaidi. Acha kisanduku wazi ili kuzichora katika kukuza yoyote. Andika 0 ili kutochora lebo ya mteja kamwe, katika kukuza yoyote. Hii haina athari ikiwa ni kubwa zaidi ya mpangilio unaofanana kwa lebo zote.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Tumia mwoneko wa sasa';
$ec_lang['lpn_settings_page']='Ukurasa';
$ec_lang['lpn_settings_page_note']='Imehifadhiwa kwenye kikokotoo hiki, si kwenye mradi.';
$ec_lang['lpn_settings_hydraulics']='Haidroliki';
$ec_lang['lpn_settings_quality']='Ubora wa maji';
$ec_lang['lpn_settings_quality_track']='Kigezo cha ubora';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Chagua kile ambacho uendeshaji unapaswa kufuatilia kupitia mabomba: muda ambao maji yamekuwa ndani ya mfumo, yalikotoka, au kemikali inayoitikia inaposafiri. Kemikali pekee ndiyo inayohitaji viwango vya mwitikio.';
$ec_lang['lpn_settings_quality_source']='Kifundo cha ufuatiliaji';
$ec_lang['lpn_settings_quality_source_tip']='Kifundo ambacho maji yake yanafuatiliwa. Kila kifundo kingine kisha huonyesha mgao wa maji yake yaliyotoka kwenye kifundo hicho.';
$ec_lang['lpn_quality_none']='Hakuna';
$ec_lang['lpn_quality_trace']='Ufuatiliaji wa chanzo';
$ec_lang['lpn_quality_chemical']='Kemikali inayoitikia';
$ec_lang['lpn_quality_needs_run']='Ubora wa maji hubebwa kupitia mabomba huku maji yakisafiri, hivyo unahitaji uigaji wa kipindi kirefu cha muda: injini ya EPANET na muda wote wa kuendesha. Weka Muda wote wa kuendesha chini ya Muda, kisha bonyeza kitufe cha Kokotoa.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Kemikali na vipimo';
$ec_lang['lpn_quality_chemical_name_tip']='Kemikali unayofuatilia, kwa mfano Klorini. Acha wazi ili kutumia lebo chaguo-msingi ya EPANET yenyewe, Chemical. Inaonyeshwa kwenye ripoti zako, lakini haitumiki katika hesabu.';
$ec_lang['lpn_quality_mass_units']='Vitengo vya uzito';
$ec_lang['lpn_quality_mass_units_tip']='Sehemu ya vitengo ya ingizo la ubora wa maji, chaguo mbili za EPANET zenyewe.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Uvumilivu wa ubora';
$ec_lang['lpn_quality_tolerance_tip']='Ni kiasi gani vipande viwili vya maji vinavyopakana vinaweza kutofautiana katika mkusanyiko kabla EPANET haijavichukulia kama kimoja. Wazi hutumia chaguo-msingi la EPANET lenyewe la 0.01.';
$ec_lang['lpn_quality_diffusivity']='Usambaaji wa uwiano';
$ec_lang['lpn_quality_diffusivity_tip']='Ni kwa urahisi kiasi gani kemikali inavyoenea ndani ya maji, ikilinganishwa na klorini. Wazi hutumia chaguo-msingi la EPANET lenyewe la 1.0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Mkusanyiko wa {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Wastani wa mkusanyiko wa {chemical}';
$ec_lang['lpn_quality_initial']='Ubora wa awali';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Kiasi gani cha kemikali kifundo hiki kinabeba wakati uendeshaji unapoanza. Hifadhi ya maji hubeba thamani yake yenyewe kwa uendeshaji wote, ambavyo ndivyo kiasi kinachobaki kikitoka kwenye kiwanda cha kusafisha maji kinavyotajwa kwa kawaida. Kiache tupu na kifundo kitaanza bila kemikali yoyote.';
$ec_lang['lpn_result_concentration']='Mkusanyiko';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Kiasi gani cha kemikali kimebaki katika kiwango hiki baada ya kusafiri na kuitikia. Vipimo ni vile vilivyotajwa kando ya kemikali chini ya Mipangilio, Ubora wa maji.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Aina ya chanzo';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Ni aina gani ya dozi kifundo hiki kinachoiweka kwenye maji yanayopita kupitia kwake. Mkusanyiko unachukulia maji yanayoingia kwenye mtandao hapa kama yanawasili kwa thamani ya Ubora wa chanzo. Kiongezaji cha wingi huongeza wingi wa kemikali kila dakika, bila kujali mtiririko ni kiasi gani. Kiongezaji cha kiwango kilichowekwa hupandisha mkusanyiko unaotoka kwenye kifundo hiki hadi thamani ya Ubora wa chanzo na si zaidi. Kiongezaji kinachoendana na mtiririko huongeza thamani ya Ubora wa chanzo kwa chochote kilichomo tayari ndani ya maji.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Hakuna';
$ec_lang['lpn_source_type_concen']='Mkusanyiko';
$ec_lang['lpn_source_type_mass']='Kiongezaji cha wingi';
$ec_lang['lpn_source_type_setpoint']='Kiongezaji cha kiwango kilichowekwa';
$ec_lang['lpn_source_type_flowpaced']='Kiongezaji kinachoendana na mtiririko';
$ec_lang['lpn_source_quality']='Ubora wa chanzo';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Dozi ina nguvu kiasi gani. Kwa kila aina isipokuwa kiongezaji cha wingi, hii ni mkusanyiko, kwa vipimo vilivyotajwa kando ya kemikali chini ya Mipangilio, Ubora wa maji; kwa kiongezaji cha wingi ni wingi wa kemikali kwa dakika. Kiache tupu na hakuna kinachoongezwa hapa, jambo ambalo si sawa na sifuri: sifuri ni chanzo kinachofanya kazi lakini hakiongezi chochote.';
$ec_lang['lpn_source_pattern']='Muundo wa chanzo';
$ec_lang['lpn_source_pattern_tip']='Muundo wa muda unaozidisha dozi wakati wa uendeshaji, kwa chanzo kisicho na kiwango kimoja. Kutokuwepo muundo maana yake dozi ni ile ile kwa kila hatua.';
$ec_lang['lpn_mixing_model']='Mfumo wa uchanganyaji';
$ec_lang['lpn_mixing_model_tip']='Jinsi maji yaliyopo tayari kwenye tanki hili yanavyochanganyika na maji yanayoingia. Uchanganyaji kamili huchafua tanki lote kwa pamoja. Uchanganyaji wa vyumba viwili hujaza eneo la mlango kwanza kisha hupitisha yaliyobaki. Mtiririko wa FIFO husogeza maji kwa mpangilio yalivyowasili. Mtiririko wa LIFO huyapanga juu ya juu, hivyo maji ya mwisho kuingia ndiyo ya kwanza kutoka. Chaguo hili hubadilisha umri wa maji na kiasi kinachobaki, wala halibadilishi shinikizo au mtiririko wowote.';
$ec_lang['lpn_mixing_mixed']='Uchanganyaji kamili';
$ec_lang['lpn_mixing_2comp']='Uchanganyaji wa vyumba viwili';
$ec_lang['lpn_mixing_fifo']='Mtiririko wa FIFO';
$ec_lang['lpn_mixing_lifo']='Mtiririko wa LIFO';
$ec_lang['lpn_mixing_fraction']='Kiwango cha uchanganyaji';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Sehemu ya ujazo wa tanki inayochukuliwa na eneo la mlango, kati ya 0 na 1. Uchanganyaji wa vyumba viwili pekee ndio unaotumia hii. Kiache tupu na tanki lote litakuwa eneo la mlango, ndicho EPANET inachodhania.';
$ec_lang['lpn_reaction_bulk']='Mgawo wa mwitikio wa wingi wa maji';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Mwitikio ndani ya wingi wa maji, unaotumika kwa kila bomba lisilo na wake wenyewe. Namba hasi huozesha kemikali na namba chanya huiongeza. Mwitikio ni wa mpangilio wa kwanza isipokuwa faili la EPANET lililoingizwa linataja mpangilio mwingine, hivyo mgawo ni kiwango cha 1/siku. Kisanduku tupu maana yake hakuna mwitikio wa wingi wa maji.';
$ec_lang['lpn_reaction_wall']='Mgawo wa mwitikio wa ukuta';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Mwitikio kwenye ukuta wa bomba, unaotumika kwa kila bomba lisilo na wake wenyewe. Namba hasi huozesha kemikali. Mwitikio ni wa mpangilio wa kwanza isipokuwa faili la EPANET lililoingizwa linataja mpangilio mwingine, hivyo mgawo ni urefu kwa siku, ulioandikwa kwa kipimo cha urefu cha mradi. Kisanduku tupu maana yake hakuna mwitikio wa ukuta.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Bomba hili peke yake. Kiache tupu na bomba litatumia mgawo uliowekwa kwa mtandao mzima chini ya Mipangilio, Ubora wa maji.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Mgawo wa mwitikio';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Mwitikio ndani ya maji yaliyohifadhiwa kwenye tanki hili, kama kiwango cha 1/siku. Namba hasi huozesha kemikali na namba chanya huikuza. Maji hukaa ndani ya tanki muda mrefu zaidi kuliko yanavyokaa ndani ya bomba lolote, hivyo mara nyingi hapa ndipo kiasi kinachobaki hupotea. Kiache tupu na tanki litatumia mgawo wa mwitikio wa wingi wa maji uliowekwa kwa mtandao mzima chini ya Mipangilio, Ubora wa maji.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Mwitikio wa wingi wa maji';
$ec_lang['lpn_reaction_wall_short']='Mwitikio wa ukuta';
$ec_lang['lpn_reaction_tank_short']='Mwitikio';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/siku';
$ec_lang['lpn_reaction_day']='siku';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Mpangilio wa mwitikio wa wingi wa maji';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='Kipeo ambacho mkusanyiko hukuzwa kwa ajili ya mwitikio ndani ya wingi wa maji. Namba yoyote halisi inaruhusiwa. 1 ni thamani chaguo-msingi na hutumika kwa uigaji mwingi wa kuozesha klorini. 0 hufanya kiwango kisitegemee kiasi cha kemikali kilichopo.';
$ec_lang['lpn_reaction_order_tank']='Mpangilio wa mwitikio wa tanki';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='Kipeo ambacho mkusanyiko hukuzwa kwa ajili ya mwitikio ndani ya maji yaliyohifadhiwa kwenye tanki, tofauti na mpangilio wa mwitikio wa wingi wa maji ili tanki liweze kuwa na mwitikio wa mpangilio tofauti na mabomba. Namba yoyote halisi inaruhusiwa, na 1 ni chaguo-msingi. EPANET huliandika kama ORDER TANK kwenye faili wala haitoi kisanduku chake katika kiolesura chake chenyewe.';
$ec_lang['lpn_reaction_order_wall']='Mpangilio wa mwitikio wa ukuta';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 inamaanisha mwitikio wa ukuta hutokea kulingana na mgawo (au migawo) uliotolewa. 0 inamaanisha hautokei. Hii ni swichi ya kuwasha na kuzima. Thamani chaguo-msingi ni 1.';
$ec_lang['lpn_reaction_order_unstated']='Haikutajwa';
$ec_lang['lpn_reaction_order_zero']='0, mpangilio sifuri';
$ec_lang['lpn_reaction_order_first']='1, mpangilio wa kwanza';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Kiwango cha kikomo';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Mkusanyiko ambao kemikali huelekea badala ya kuozea kwa sifuri au kukua bila mwisho. Mwitikio hupungua kasi kadiri maji yanavyokaribia kiwango hicho na kusimama hapo. Tumia vipimo vinavyolingana. Hakuna kikomo kikiwa tupu.';
$ec_lang['lpn_reaction_rough_corr']='Uhusiano wa usuguo';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Huhusisha mwitikio wa ukuta na usuguo wa bomba lenyewe, hivyo bomba lenye usuguo mkubwa zaidi huwa na mwitikio wa haraka zaidi. Ikiwekwa, mgawo wa ukuta hukokotolewa kwa kila bomba kutokana na usuguo wa bomba hilo, na mgawo mmoja wa ukuta ulio hapo juu hautumiki tena. Haitumiki ikiwa tupu.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Ukurasa huu hautoi mgawo wowote wa mwitikio wake wenyewe. Hakuna kipimo cha kawaida cha kuupata, na thamani zilizochapishwa za uwandani kwa aina ile ile ya maji hutofautiana kwa mara kumi, hivyo namba ingetolewa hapa ingesomwa kama pendekezo. Ingiza uliyoipima wewe mwenyewe au unayoweza kuithibitisha, au acha visanduku tupu kwa kemikali isiyoitikia.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Nishati';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Ripoti';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='Majibu yaliyokamilika ambayo ukurasa huu hutoa mara mtandao unapokuwa umekokotolewa: gharama ya pampu, jinsi senario zinavyolinganishwa, na kile kitatuzi cha EPANET chenyewe kilichochapisha.';
$ec_lang['lpn_reports_epanet']='Uendeshaji wa EPANET';
$ec_lang['lpn_energy_title']='Ripoti ya nishati ya pampu';
$ec_lang['lpn_energy_menu']='Nishati ya pampu';
$ec_lang['lpn_energy_menu_tip']='Ni sehemu gani ya uendeshaji kila pampu ilikuwa ikifanya kazi, nguvu iliyotumia, na gharama yake katika uigaji wa kipindi kirefu cha muda wa mwisho.';
$ec_lang['lpn_energy_efficiency']='Ufanisi wa pampu (asilimia)';
$ec_lang['lpn_energy_efficiency_tip']='Ufanisi wa jumla kutoka umeme hadi maji, unaotumika kwa kila pampu isiyo na mkondo wake wa ufanisi. EPANET hutumia asilimia 75 wakati hakuna kilichotajwa.';
$ec_lang['lpn_energy_price']='Bei ya nguvu';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Kiasi kilowati saa moja inagharimu. Inatumika kwa kila pampu isiyo na bei yake yenyewe. Kiache tupu na kila gharama kwenye ripoti itakuwa sifuri.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Kiasi kilowati saa moja inagharimu kwenye pampu hii. Kiache tupu na pampu itatumia bei iliyowekwa kwa mtandao mzima chini ya Mipangilio, Nishati.';
$ec_lang['lpn_energy_price_pattern']='Muundo wa bei';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Muundo unaozidisha bei kwenye kila hatua ya muundo, ndivyo kiwango cha nje-ya-kilele kinavyotajwa. Kiache tupu kwa bei moja kwa uendeshaji wote.';
$ec_lang['lpn_energy_demand_charge']='Ada ya kilele cha mahitaji';
$ec_lang['lpn_energy_demand_charge_tip']='Kiasi shirika la maji linalotoza kwa kila kW kwa mzigo wa kilele unaohitajika na pampu kwenye mfumo.';
$ec_lang['lpn_energy_currency']='Sarafu';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Chochote unachoandika hapa kinachapishwa kando ya kila namba ya fedha. Ni lebo tu. Bei na gharama havibadilishwi kamwe, hivyo andika bei kwa sarafu uliyoiandika hapa.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Ukurasa huu hautoi bei yoyote yake yenyewe. Gharama ya nguvu inategemea shirika la maji, nchi, saa na mwaka, hivyo namba ingetolewa hapa ingesomwa kama pendekezo. Ingiza bei kutoka kwenye kiwango chako mwenyewe cha malipo.';
$ec_lang['lpn_energy_needs_run']='Nishati ya pampu ni nguvu iliyokusanywa katika uendeshaji wote, hivyo inahitaji uigaji wa kipindi kirefu cha muda: injini ya EPANET na muda wote wa kuendesha. Weka Muda wote wa kuendesha chini ya Mipangilio, Ukokotoaji, Muda, bonyeza kitufe cha Kokotoa, kisha fungua Maji, Ripoti, Nishati ya pampu.';
$ec_lang['lpn_energy_no_pumps']='Mtandao huu hauna pampu, hivyo hakuna kinachotumia nguvu.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Ulinganisho wa senario';
$ec_lang['lpn_scncmp_menu_tip']='Kokotoa kila senario kwenye mradi huu na uzisome bega kwa bega: shinikizo la chini kabisa na kasi ya juu kabisa katika kila moja.';
$ec_lang['lpn_scncmp_running']='Inakokotoa kila senario…';
$ec_lang['lpn_scncmp_empty']='Hakuna kilichochorwa bado, hivyo hakuna cha kukokotoa.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Kasi ya juu kabisa';
$ec_lang['lpn_scncmp_at']='{value} kwenye {id}';
$ec_lang['lpn_scncmp_current']='(iliyofunguliwa sasa)';
$ec_lang['lpn_scncmp_note']='Kila senario inakokotolewa kutoka kwenye nakala ya mchoro. Hakuna kinachobadilisha mradi hapa, na senario unayofanyia kazi inaachwa jinsi ilivyokuwa.';
$ec_lang['lpn_energy_over']='Kwa uigaji wa kipindi kirefu cha muda wa {time}';
$ec_lang['lpn_energy_col_pump']='Pampu';
$ec_lang['lpn_energy_col_running']='% ya uendeshaji';
$ec_lang['lpn_energy_col_effic']='Ufanisi';
$ec_lang['lpn_energy_col_avg_kw']='Wastani kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='Wastani wa nguvu iliyotumika wakati pampu hii ilikuwa ikifanya kazi. Haijapigwa wastani kwa vipindi vya kutofanya kazi, hivyo pampu iliyokaa bila kufanya kazi kwa muda mwingi wa uigaji wa kipindi kirefu cha muda bado inaripoti nguvu iliyoitumia ilipofanya kazi.';
$ec_lang['lpn_energy_col_peak_kw']='Kilele kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Gharama';
$ec_lang['lpn_energy_total_kwh']='Nishati iliyotumika';
$ec_lang['lpn_energy_total_energy_cost']='Gharama ya nishati';
$ec_lang['lpn_energy_peak_kw']='Matumizi ya kilele cha nguvu';
$ec_lang['lpn_energy_total_demand_charge']='Gharama ya kilele cha mahitaji';
$ec_lang['lpn_energy_total_cost']='Gharama jumla';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Hali';
$ec_lang['lpn_reports_status_tip']='Kilichobadilika katika uigaji wa mwisho wa kipindi kirefu cha muda, kwa mpangilio wa wakati: pampu na vali zikifunguka au kufungwa, matanki yakijaa, kupungua, kujaa kabisa au kukauka, na hatua ambazo hazikukaribiana kikamilifu.';
$ec_lang['lpn_status_title']='Taarifa ya hali';
$ec_lang['lpn_status_needs_run']='Taarifa ya hali huorodhesha kilichobadilika wakati wa uigaji wa kipindi kirefu cha muda. Weka Muda wote wa kuendesha chini ya Mipangilio, Ukokotoaji, Muda, bonyeza Kokotoa, kisha fungua Maji, Ripoti, Taarifa ya hali.';
$ec_lang['lpn_status_empty']='Hakuna kilichobadilisha hali wakati wa uendeshaji huu.';
$ec_lang['lpn_status_col_event']='Tukio';
$ec_lang['lpn_status_opened']='{type} {id} imefunguka';
$ec_lang['lpn_status_closed']='{type} {id} imefungwa';
$ec_lang['lpn_status_filling']='{type} {id} inajaa';
$ec_lang['lpn_status_emptying']='{type} {id} inapungua';
$ec_lang['lpn_status_full']='{type} {id} imejaa';
$ec_lang['lpn_status_dry']='{type} {id} imekauka';
$ec_lang['lpn_status_no_converge']='Suluhisho la kihaidroliki katika hatua hii halikukaribiana kikamilifu; namba zinazoonyeshwa ni marudio yake ya mwisho.';
$ec_lang['lpn_status_note']='Imesomwa kutoka kwa uendeshaji ule ule wa kipindi kirefu cha muda kama Kidirisha cha Majedwali na Taarifa Kamili. Mabadiliko pekee yanaorodheshwa, si kila hatua.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Kamili';
$ec_lang['lpn_reports_full_tip']='Kila kifundo na kila kiungo katika kila hatua ya muda ya taarifa ya uendeshaji wa mwisho, kama jedwali moja unaloweza kupakua au kuchapisha.';
$ec_lang['lpn_full_title']='Taarifa kamili';
$ec_lang['lpn_full_needs_run']='Taarifa kamili huorodhesha kila kifundo na kila kiungo katika kila hatua ya muda ya taarifa. Bonyeza Kokotoa, kisha fungua Maji, Ripoti, Taarifa kamili.';
$ec_lang['lpn_full_note']='Safu mlalo moja kwa kila kifundo au kiungo kwa kila hatua ya muda ya taarifa, katika vitengo vinavyoonyeshwa kwenye Kidirisha cha Majedwali. Seli wazi ni safu ambayo kiwango hicho hakina. Kupakua au kuchapisha hubeba kila hatua ya muda; jedwali lililo hapa chini linaonyesha moja kwa wakati mmoja.';
$ec_lang['lpn_full_step_label']='Hatua ya muda';
$ec_lang['lpn_full_download_csv']='Pakua CSV';
$ec_lang['lpn_full_print']='Chapisha taarifa';
$ec_lang['lpn_full_col_time']='Muda';
$ec_lang['lpn_full_col_type']='Aina';
$ec_lang['lpn_full_col_id']='Kitambulisho';
$ec_lang['lpn_full_row_count']='Safu mlalo {n}.';
$ec_lang['lpn_energy_no_price']='Hakuna bei ya nguvu iliyotajwa, hivyo kila gharama hapa ni sifuri. Weka moja chini ya Mipangilio, Nishati.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Mtandao huu unaeleza bei ya sifuri, hivyo kila gharama hapa ni sifuri. Ibadilishe chini ya Mipangilio, Nishati.';
$ec_lang['lpn_energy_curve_note']='Pampu hizi zinarejelea mkondo wa ufanisi usio na vituo: {ids}. Ziliendesha kwa ufanisi uliowekwa kwa mtandao mzima.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_rank']='Nafasi';
$ec_lang['lpn_labels_col_drop']='Ruka';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Kifundo na kiungo';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Vipindi sawa';
$ec_lang['lpn_color_mode_quantile']='Quantile (idadi sawa)';
$ec_lang['lpn_color_mode_jenks']='Mipaka ya asili (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Mkengeuko wa kawaida';
$ec_lang['lpn_color_mode_pretty']='Nadhifu (imezungushwa)';
$ec_lang['lpn_color_mode_log']='Logarithimu';
$ec_lang['lpn_color_mode_manual']='Mwenyewe';

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
$ec_lang['lpn_library_menu']='Maktaba';
$ec_lang['lpn_library_menu_tip']='Simamia miundo ya mahitaji, mikondo ya pampu, na kanuni za vidhibiti za mradi huu.';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Miundo';
$ec_lang['lpn_library_patterns_tip']='Muundo ni orodha ya vizidishi vinavyorudiwarudiwa. Kila kimoja kinatumika kwa hatua moja ya muda ya muundo, hivyo namba 24 kwenye hatua ya saa moja hufanya siku inayorudiwarudiwa. Mahitaji ya 10 yenye kizidishi cha 1.5 ni 15 wakati huo.';
$ec_lang['lpn_library_curves']='Mikondo';
$ec_lang['lpn_library_curves_tip']='Mkondo ni orodha ya vituo inayosema jinsi kitu kinavyofanya kazi: ni kimo kiasi gani pampu inachoongeza kwa kila mtiririko, ufanisi wake katika mtiririko huo, au kimo kiasi gani vali inachopoteza kwa kila mtiririko.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Mikondo huambatanishwa kwenye pampu na vali. Kwa mkondo wa kimo cha pampu, uendeshaji hutumia mkondo uliopatanishwa kupitia vituo kama inavyoonyeshwa; kwa kila aina nyingine unaunganisha vituo kwa mistari iliyonyooka kama inavyoonyeshwa.';
$ec_lang['lpn_library_curve_add']='Ongeza mkondo';
$ec_lang['lpn_library_curve_type_tip']='Kile mkondo huu unachoelezea';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Aina ya mkondo';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Mlingano';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='Mkondo uliopatanishwa kupitia vituo, na mstari uliochorwa kwenye kielelezo hapa chini. Unakokotolewa kutoka kwenye vituo kila unapoonyeshwa na hauhifadhiwi kamwe, na namba zake ziko kwa vipimo vinavyoonyeshwa na jedwali hapo juu. Kitatuzi kilichojengwa ndani hutumia mlingano huu; injini ya EPANET husoma vituo vyenyewe.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Chagua safu moja au mbili kwenye lahajedwali, zinakili, kisha uzibandike kwenye kiini cha kwanza unachotaka zitue. Safu mlalo huongezwa kadri zinavyohitajika. Unaweza pia kubandika mistari iliyonakiliwa moja kwa moja kutoka kwenye faili la EPANET, ikiwa ni pamoja na jina la mkondo.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Maelezo';
$ec_lang['lpn_library_curve_note_tip']='Mkondo huu ni nini, kwa maneno yako mwenyewe. Inaandikwa juu ya mkondo kwenye faili la EPANET na kusomwa tena kutoka hapo.';
$ec_lang['lpn_library_curve_remove_point']='Ondoa kituo hiki';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Nakili vituo';
$ec_lang['lpn_library_curve_copy_tip']='Inanakili kila kituo kama safu mbili, tayari kubandikwa kwenye lahajedwali.';
$ec_lang['lpn_library_curve_copy_manual']='Nakili vituo hivi';
$ec_lang['lpn_library_curve_used_by']='Vipengele vinavyotumia mkondo huu';
$ec_lang['lpn_library_curve_unused']='Hakuna kinachotumia mkondo huu.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Mkondo huu unatumiwa na vipengele {count}: {ids}. Vielekeze kwenye mkondo mwingine kwanza, kisha ufute huu.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Aina za bomba';
$ec_lang['lpn_library_pipetypes_tip']='Aina ya bomba ni ufafanuzi ambao mabomba kadhaa yanaweza kuurejelea kwa kipenyo chake, usuguo, na migawo ya mwitikio. Kuhariri ufafanuzi huhariri kila bomba linalotumia.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Kila mradi una maktaba yake mwenyewe ya aina za bomba. Unaweza kuacha sifa tupu kwenye ufafanuzi wa aina ya bomba. Kwa mfano, aina ya bomba inayotaja usuguo bila kipenyo ni sawa. Unaunganisha aina za bomba kwenye mabomba katika kihariri chao cha sifa. Kuhariri ufafanuzi hapa hubadilisha kila bomba linalourejelea.';
$ec_lang['lpn_library_pipetype_add']='Ongeza aina ya bomba';
$ec_lang['lpn_library_pipetype_blank_tip']='Sifa tupu kwenye ufafanuzi wa aina ya bomba huachwa ziingizwe kivyake kwa kila bomba.';
$ec_lang['lpn_library_pipetype_used_by']='Mabomba yanayotumia aina hii';
$ec_lang['lpn_library_pipetype_unused']='Hakuna kinachotumia aina hii ya bomba.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Aina hii ya bomba inatumiwa na mabomba {count}: {ids}. Iondoe kwao kabla ya kuifuta.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Aina ya bomba';
$ec_lang['lpn_field_pipetype_tip']='Aina ya bomba katika maktaba ya mradi ambayo bomba hili linatumia. Sifa zilizomo kwenye aina ya bomba zimezimwa kwa kuhaririwa hapa. Ondoa aina ya bomba ili kuwezesha kuhariri hapa.';
$ec_lang['lpn_pipetype_none']='Hakuna aina ya bomba iliyochaguliwa';
$ec_lang['lpn_pipetype_detach']='Ondoa kutoka aina ya bomba';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Hunakili thamani ambazo bomba hili husoma kutoka kwa aina yake kuingia kwenye bomba lenyewe na kuacha kutumia aina hiyo. Thamani za bomba hazibadiliki sasa, na kuanzia sasa unaweza kuhariri thamani hizi hapa.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Viungio';
$ec_lang['lpn_library_fittings_tip']='Orodha ya viungio ni mkusanyiko wa viungio na idadi zake ambao mabomba kadhaa yanaweza kuurejelea. Hujumlisha na kuwa mgawo mmoja wa upotevu mdogo (wa ndani).';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Kila mradi una maktaba yake mwenyewe ya viungio. Orodha ya viungio ina viungio vyenye idadi kwa kila kimoja, na hujumlisha na kuwa mgawo mmoja wa upotevu mdogo (wa ndani). Mabomba na aina za bomba zote zinaweza kurejelea orodha.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Viungio vinavyotolewa hapa ni vile kumi na vitatu vilivyo kwenye Jedwali 3.3 la mwongozo wa mtumiaji wa EPANET 2.2. Kuchagua kimoja hunakili mgawo wake kwenye safu mlalo, ambapo unaweza kuubadilisha. Mgawo hutegemea ukubwa na aina ya utengenezaji wa kiungio, hivyo lichukulie jedwali kama sehemu ya kuanzia badala ya jibu.';
$ec_lang['lpn_library_fittings_add']='Ongeza orodha ya viungio';
$ec_lang['lpn_library_fittings_used_by']='Mabomba yanayotumia orodha hii ya viungio';
$ec_lang['lpn_library_fittings_unused']='Hakuna kinachotumia orodha hii ya viungio.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Orodha hii ya viungio inatumiwa na mabomba {count}: {ids}. Iondoe kwao kabla ya kuifuta.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Ingiza maktaba…';
$ec_lang['lpn_library_import_tip']='Chagua faili lingine la mradi kisha nakili maktaba nzima kutoka humo kwenda kwenye mradi huu. Chochote ambacho jina lake linatumika tayari hapa huruka na kuorodheshwa, hivyo hakuna kilicho tayari nacho kinachobadilika.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Chagua cha kunakili kutoka {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Kila maktaba unayoiweka alama hunakiliwa nzima. Futa usichokitaka baadaye, kwa njia ile ile unayofuta ingizo lingine lolote.';
$ec_lang['lpn_library_import_go']='Ingiza';
$ec_lang['lpn_library_import_no_libraries']='Faili hilo la mradi halina maktaba za kunakili.';
$ec_lang['lpn_library_import_heading']='Imeingizwa kutoka {file}';
$ec_lang['lpn_library_import_added']='Zimenakiliwa: {names}';
$ec_lang['lpn_library_import_conflict']='Zimerukwa, kwa sababu mradi huu tayari una moja yenye jina lile lile: {names}. Hakuna kilichobadilika hapa. Badilisha jina la mojawapo kisha ingiza tena ikiwa unataka zote mbili.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Faili hilo la mradi halina lolote kati ya haya la kunakili.';
$ec_lang['lpn_library_import_curve_shape']='Mikondo hii imeingia sawasawa kama faili lilivyoiandika, na uendeshaji hauwezi kutumia mkondo hadi safu yake ya kwanza ipande kutoka kwenye kila kituo kwenda kinachofuata: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Aina hizi za mabomba zinarejelea orodha ya viungio ambayo mradi huu hauna: {names}. Ingiza maktaba ya viungio kutoka faili lile lile nazo zitaipata.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Onyo: Vitengo havilingani. Vitaingizwa kama vilivyo. Haipendekezwi.';
$ec_lang['lpn_library_import_units_line']='{name}: mradi huu unaonyesha {mine}, faili linaonyesha {theirs}.';
$ec_lang['lpn_fitting_qty']='Idadi';
$ec_lang['lpn_fitting_name']='Kiungio';
$ec_lang['lpn_fitting_k']='Mgawo';
$ec_lang['lpn_fitting_add']='Ongeza kiungio';
$ec_lang['lpn_fitting_remove']='Ondoa';
$ec_lang['lpn_fitting_total']='Jumla ya mgawo wa upotevu mdogo (wa ndani), k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Orodha ya viungio';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Orodha ya viungio kutoka maktaba ya mradi. Idadi na migawo yake hujumlishwa kuwa mgawo wa upotevu mdogo wa bomba hili, na kisha kisanduku cha mgawo huwa cha kusoma tu. Acha hii bila kuchaguliwa ili kuandika mgawo mwenyewe.';
$ec_lang['lpn_fittings_none']='Hakuna orodha ya viungio iliyochaguliwa';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Vali ya globu, wazi kabisa';
$ec_lang['lpn_fitting_angle']='Vali ya pembe, wazi kabisa';
$ec_lang['lpn_fitting_swingcheck']='Vali kinga ya kuzungusha, wazi kabisa';
$ec_lang['lpn_fitting_gate']='Vali ya lango, wazi kabisa';
$ec_lang['lpn_fitting_elbow_short']='Kigeuzo chenye mzunguko mfupi';
$ec_lang['lpn_fitting_elbow_medium']='Kigeuzo chenye mzunguko wa kati';
$ec_lang['lpn_fitting_elbow_long']='Kigeuzo chenye mzunguko mrefu';
$ec_lang['lpn_fitting_elbow_45']='Kigeuzo cha nyuzi 45';
$ec_lang['lpn_fitting_return_bend']='Kigeuzo cha kurudi kilichofungwa';
$ec_lang['lpn_fitting_tee_run']='Tee ya kawaida, mtiririko kupitia mstari mkuu';
$ec_lang['lpn_fitting_tee_branch']='Tee ya kawaida, mtiririko kupitia tawi';
$ec_lang['lpn_fitting_entrance']='Muingilio wa mraba';
$ec_lang['lpn_fitting_exit']='Mtoko';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Kiungio kingine';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='{file} imehifadhiwa';
$ec_lang['lpn_inp_export_flat_lead']='Faili la EPANET lililohamishwa ni sawa kwa hesabu na mradi huu. Lakini halina nafasi kwa mambo yafuatayo:';
$ec_lang['lpn_inp_export_flat_types']='Mabomba {n} hapa yanarejelea aina {t} za bomba. Kwenye faili kila bomba miongoni mwa hayo hubeba nakala yake mwenyewe ya namba, hivyo majibu ni yale yale. Faili haliwezi kuhifadhi aina ya bomba yenyewe, hivyo kuhariri ufafanuzi mmoja na kila bomba kufuata ni jambo ambalo faili lako la mradi pekee ndilo linaloandika.';
$ec_lang['lpn_inp_export_flat_coords']='Faili la EPANET huhifadhi nafasi moja kwa kila kifundo. Senario hii inaweka {n} kati yake mahali pengine, na hizo ndizo nafasi zilizo kwenye faili. Kila senario nyingine hubaki na nafasi zake mwenyewe kwenye faili lako la mradi pekee.';
$ec_lang['lpn_inp_export_flat_fittings']='Faili la EPANET haliwezi kuhifadhi orodha ya vigeuzo, vali, na tee zilizomo kwenye faili lako la mradi. Mgawo wa upotevu mdogo (wa ndani) wa mabomba {n} hapa umejumlishwa kutoka orodha ya viungio. Jumla hiyo huingia kwenye faili kama ilivyo hasa, hivyo hakuna kinachobadilika kuhusu majibu.';
$ec_lang['lpn_library_controls']='Vidhibiti';
$ec_lang['lpn_library_controls_tip']='Kidhibiti ni sentensi moja inayofungua au kufunga kiungo, au kukipa mpangilio, wakati kiwango cha maji, shinikizo, au muda vinaposema hivyo.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Ongeza muundo';
$ec_lang['lpn_library_pattern_values']='Vizidishi';
$ec_lang['lpn_library_pattern_values_tip']='Vizidishi, vikitenganishwa na nafasi au koma. Bandika safu wima kutoka lahajedwali ikiwa unayo. Orodha inarudiwarudiwa kwa muda wote uendeshaji unavyoendelea, hivyo haihitaji kufunika uendeshaji wote.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='vizidishi {n}, vikitenganishwa na {step}, vinavyofunika {span}';
$ec_lang['lpn_library_pattern_none']='Hakuna muundo';
$ec_lang['lpn_settings_default_pattern']='Muundo wa chaguo-msingi wa mahitaji';
$ec_lang['lpn_settings_default_pattern_tip']='Kila muunganiko usio na muundo hutumia huu.';
$ec_lang['lpn_library_control_add']='Ongeza kidhibiti';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Kanuni ya mstari mmoja kwa kutumia sintaksia ya EPANET. Tumia vitengo thabiti vya mradi. Maneno makuu lazima yawe kwa Kiingereza. Mifano: LINK 12 CLOSED IF NODE 23 ABOVE 20 (Bomba 12 litafungwa wakati kiwango katika Tanki 23 kinapozidi futi 20); LINK 12 OPEN IF NODE 130 BELOW 30 (Bomba 12 litafunguliwa iwapo shinikizo katika Kifundo 130 litashuka chini ya psi 30); LINK PUMP02 1.5 AT TIME 16 (Kasi ya jamaa ya pampu PUMP02 inawekwa kuwa 1.5 saa 16 baada ya kuanza kwa uigaji); LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM (Kanuni mbili: Bomba 12 hufungwa mara kwa mara saa 10 asubuhi na kufunguliwa saa 8 jioni katika uigaji wote)';
$ec_lang['lpn_library_control_ok']='✓ Imeeleweka';
$ec_lang['lpn_library_control_bad']='⚠ Haijaeleweka';
$ec_lang['lpn_library_control_missing']='⚠ Mtandao huu hauna kitu kinachoitwa {id}';
$ec_lang['lpn_library_rules']='Kanuni';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Kanuni ni aya fupi inayofungua au kufunga kiungo, au kukipa mpangilio, wakati kiwango cha maji, shinikizo, mtiririko au muda unafikia thamani uliyoiweka. Kanuni zinaweza kujaribu zaidi ya kitu kimoja kwa pamoja, na zinaweza kusema nini cha kufanya jaribio linaposhindwa.';
$ec_lang['lpn_library_rule_add']='Ongeza kanuni';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Kanuni moja, kwa maneno ambayo EPANET inatumia, sharti moja kwa kila mstari. Mstari wa kwanza unaitaja: RULE 1. Kisha sharti: IF TANK 2 LEVEL BELOW 17.1. Kisha nini cha kufanya kuhusu hilo: THEN PUMP 9 STATUS IS OPEN. Mstari wa mwisho unaweza kuipanga: PRIORITY 1. Ongeza mistari ya AND au OR kujaribu zaidi ya kitu kimoja, na mistari ya ELSE kusema nini cha kufanya jaribio linaposhindwa. Sharti linaweza kusoma LEVEL, HEAD, GRADE, PRESSURE au DEMAND kwenye kifundo, FLOW, STATUS au SETTING kwenye kiungo, au TIME na CLOCKTIME kwenye SYSTEM. Andika namba kwa vipimo ambavyo mradi huu unaonyesha; zinabadilishwa kwa ajili yako. Acha maneno muhimu kwa Kiingereza; hayo ndiyo ukurasa na EPANET vinavyosoma.';
$ec_lang['lpn_library_rule_ok']='✓ Kanuni hii ilisomwa';
$ec_lang['lpn_library_rule_bad']='⚠ Kanuni hii haikuweza kusomwa';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Mahitaji ya msingi';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Mtiririko ambao kifundo hiki kinachukua kwenye hatua ya muda inayoonyeshwa: kila mahitaji ya msingi yakizidishwa na muundo wake, kisha kujumlishwa. Inakokotolewa, haiandikwi, hivyo hubadilika kulingana na saa na haiwezi kuhaririwa.';
$ec_lang['lpn_field_demand_pattern']='Muundo wa mahitaji';
$ec_lang['lpn_field_demand_pattern_tip']='Jinsi mahitaji ya muunganiko huu yanavyopanda na kushuka wakati wa uendeshaji. Kiache kwenye Hakuna muundo ili kifuate Muundo wa chaguo-msingi wa mahitaji wa mradi badala yake.';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Maelezo';
$ec_lang['lpn_field_demand_category_tip']='Jina au maelezo ya jamii hii ya mahitaji.';
$ec_lang['lpn_demand_add']='Ongeza jamii ya mahitaji';
$ec_lang['lpn_demand_add_tip']='Ongeza jamii nyingine ya mahitaji kwenye muunganiko huu, ikiwa na mahitaji yake ya msingi, muundo, na maelezo. Jamii hizo hujumlishwa.';
$ec_lang['lpn_demand_remove']='Ondoa mahitaji haya';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Muundo wa kimo';
$ec_lang['lpn_field_head_pattern_tip']='Jinsi kiwango cha maji cha hifadhi hii kinavyopanda na kushuka wakati wa uendeshaji. Kimo kilichoandikwa hapo juu kinazidishwa na muundo huu.';
$ec_lang['lpn_field_pump_speed']='Kasi ya uwiano';
$ec_lang['lpn_field_pump_speed_tip']='1 ni pampu hii ikizunguka kwa kasi iliyopimwa mkondo wake. 0.9 ni pampu hiyo hiyo ikizunguka polepole zaidi, jambo linalopunguza kimo inachoongeza na mtiririko unaopita. Muundo wa kasi unachukua nafasi ya namba hii wakati uendeshaji unapoendelea.';
$ec_lang['lpn_field_speed_pattern']='Muundo wa kasi';
$ec_lang['lpn_field_speed_pattern_tip']='Jinsi kasi ya pampu hii inavyopanda na kushuka wakati wa uendeshaji. Kila kizidishi ni kasi ya uwiano kwa sehemu hiyo ya uendeshaji, na kinachukua nafasi ya mpangilio wa Kasi badala ya kuuzidisha, hivyo kizidishi cha 0 husimamisha pampu.';

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
$ec_lang['lpn_search_menu']='Tafuta mahali kwa jina…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Tafuta mji, anwani, au alama maarufu kwa jina na uhamishe ramani kuelekea huko. Matumizi ya kwanza yanauliza ruhusa yako, kwa sababu maneno unayoandika yanakwenda kwenye huduma ya majina ya mahali ya OpenStreetMap.';
$ec_lang['lpn_search_bar']='Tafuta kwa jina…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Kutafuta kwa jina la mahali kunatuma maneno unayoandika kwenda nominatim.openstreetmap.org, huduma ya bure ya majina ya mahali ya OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Hii ni huduma tofauti na picha za ramani ya mitaa zilizo nyuma ya mradi wako. Picha zinasema tu unapoangalia. Utafutaji unasema uliandika nini. Huduma ya majina ya mahali itapokea maneno yako ya utafutaji na anwani yako ya IP. Hatutumi kitu kingine chochote, na hatuhifadhi kumbukumbu ya utafutaji wako.';
$ec_lang['lpn_search_consent_3']='Je, tunaweza kutuma utafutaji wako kwenye huduma ya majina ya mahali?';
$ec_lang['lpn_search_consent_4']='Ukisema hapana, kila kitu kingine kwenye ukurasa huu kinaendelea kufanya kazi kama kinavyofanya sasa, kikiwemo Nenda kwa latitudo na longitudo. Tunakumbuka ndiyo ili tusihitaji kuuliza tena. Hapana haihifadhiwi kabisa.';
$ec_lang['lpn_search_refused']='Utafutaji wa jina la mahali umezimwa, na hakuna kilichotumwa. Bado unaweza kutumia Nenda kwa latitudo na longitudo.';
$ec_lang['lpn_search_prompt']='Tafuta mahali kwa jina. Mji, mtaa, alama maarufu — kwa mfano: Petaluma, California';
$ec_lang['lpn_search_empty']='Andika jina la mahali la kutafuta.';
$ec_lang['lpn_search_working']='Inatafuta…';
$ec_lang['lpn_search_busy']='Utafutaji tayari unaendelea. Subiri ujibu wake.';
$ec_lang['lpn_search_choose']='Mahali zaidi ya moja yanalingana. Lipi?';
$ec_lang['lpn_search_nochoice']='Hakuna kilichochaguliwa, hivyo ramani haijasogea.';
$ec_lang['lpn_search_badchoice']='Hiyo si mojawapo ya namba zilizo kwenye orodha.';
$ec_lang['lpn_search_none']='Hakuna kilichopatikana kwa jina hilo.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Huduma ya majina ya mahali inatuomba tupunguze kasi. Subiri dakika moja kisha ujaribu tena.';
$ec_lang['lpn_search_http']='Huduma ya majina ya mahali imejibu kwa hitilafu.';
$ec_lang['lpn_search_timeout']='Huduma ya majina ya mahali haikujibu kwa wakati. Kila kitu kingine kwenye ukurasa huu kinafanya kazi bila hiyo.';
$ec_lang['lpn_search_unreadable']='Huduma ya majina ya mahali imejibu kwa kitu ambacho ukurasa huu haukuweza kukisoma.';
$ec_lang['lpn_search_offline']='Hatukuweza kufikia huduma ya majina ya mahali. Huenda huna mtandao. Kila kitu kingine kwenye ukurasa huu kinafanya kazi bila hiyo, kikiwemo Nenda kwa latitudo na longitudo.';
$ec_lang['lpn_search_toofast']='Utafutaji mmoja kwa sekunde — ndivyo huduma ya majina ya mahali inavyoruhusu. Jaribu tena baada ya kitambo.';
$ec_lang['lpn_search_nofetch']='Kivinjari hiki hakiwezi kufikia huduma ya majina ya mahali.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox huikusanya kutoka hifadhidata nyingi za umma za miinuko, hivyo ubora wake unategemea kabisa uko wapi. Pale upimaji wa kitaifa wa lidar upo, kama vile USGS 3DEP katika sehemu kubwa ya Marekani na mifano yake mahali pengine, unaweza kuwa bora kuliko mita moja kimlalo na sehemu za mita kadhaa kiwima. Pale data ya kimataifa pekee ipo, ni mita 30 hivi kimlalo na mita kadhaa kiwima. Mapbox haituambii ni ipi uliyopata. Ichukulie kama ramani ya mikondo ya usawa, si upimaji sahihi: hakiki chochote unachokitegemea.';
$ec_lang['lpn_terrain_consent_1']='Kujaza miinuko kunatuma nafasi ya kila kifundo kinachohitaji mwinuko — latitudo na longitudo yake — kwenda api.mapbox.com, ili kuangalia urefu wa ardhi mahali hapo.';
$ec_lang['lpn_terrain_consent_2']='Hili ni swali tofauti na picha za ramani zilizo nyuma ya mradi wako. Picha zinasema tu unapoangalia. Nafasi hizi ni mtandao wako wenyewe. Mapbox itapokea kuratibu hizo na anwani yako ya IP. Hatutumi kitu kingine chochote: hakuna jina, hakuna mabomba, hakuna mradi. Hatuhifadhi kumbukumbu yake, na hakuna kinachohifadhiwa kwenye kifaa hiki isipokuwa jibu lako kwa swali hili.';
$ec_lang['lpn_terrain_consent_3']='Je, tunaweza kutuma nafasi za vifundo vyako kwenda Mapbox?';
$ec_lang['lpn_terrain_consent_4']='Ukisema hapana, kila kitu kingine kwenye ukurasa huu kinaendelea kufanya kazi kama kinavyofanya sasa, na unaweza kuandika miinuko mwenyewe kama zamani. Tunakumbuka ndiyo ili tusihitaji kuuliza tena. Hapana haihifadhiwi kabisa.';
$ec_lang['lpn_terrain_refused']='Miinuko haikujazwa, na hakuna kilichotumwa. Unaweza kuiandika kama zamani.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Jaza mwinuko wa vifundo {n} kutoka DEM ya Mapbox?';
$ec_lang['lpn_terrain_confirm_default_1']='Kila kifundo tayari kina mwinuko, na {n} kati yao bado viko kwenye {v}, ambao ni mwinuko ambao kifundo kipya huanzia nao badala ya ule ulioandika.';
$ec_lang['lpn_terrain_confirm_default_2']='Badilisha mwinuko wa vifundo hivyo {n} kwa thamani kutoka DEM ya Mapbox?';
$ec_lang['lpn_terrain_keep']='Vifundo {k} tayari vina mwinuko na havitaguswa.';
$ec_lang['lpn_terrain_undo']='Tendua moja (Ctrl-Z) inavirudisha vyote.';
$ec_lang['lpn_terrain_requests']='{n} ombi/maombi kwenda api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Miinuko tayari inajazwa. Isubiri.';
$ec_lang['lpn_terrain_offmap']='Nafasi za vifundo hivi hazipo kwenye ramani ya ardhi, hivyo hakuna kilichotumwa.';
$ec_lang['lpn_terrain_too_wide']='Vifundo hivi vimetapakaa sehemu kubwa mno ya Dunia kusoma kwa mara moja (maombi {n} ya vigae). Hakuna kilichotumwa.';
$ec_lang['lpn_terrain_cancelled']='Hakuna kilichobadilishwa na hakuna kilichotumwa.';
$ec_lang['lpn_terrain_nofetch']='Kivinjari hiki hakiwezi kufikia huduma ya ardhi.';
$ec_lang['lpn_terrain_working']='Inasoma usoni mwa ardhi…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Huduma ya ardhi imekataa ombi ({status}), hivyo hakuna mwinuko uliobadilishwa. Ishara ya Mapbox inayotumiwa na tovuti hii huenda isiruhusu anwani ya wavuti unayoitumia.';
$ec_lang['lpn_terrain_failed']='Hatukuweza kufikia huduma ya ardhi, hivyo hakuna mwinuko uliobadilishwa. Huenda huna mtandao. Kila kitu kingine kwenye ukurasa huu kinafanya kazi bila hiyo.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Huduma ya ardhi inatuomba tupunguze mwendo (429), hivyo hakuna mwinuko uliobadilishwa. Jaribu tena baada ya dakika moja.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Huduma ya ardhi imejibu kwa hitilafu ({status}), hivyo hakuna mwinuko uliobadilishwa. Hakuna tatizo lolote na mtandao wako.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Hakuna hata kimoja cha vifundo hivyo chenye nafasi Duniani, hivyo hakuna kilichotumwa na hakuna mwinuko uliobadilishwa. Kusoma uso wa ardhi kunahitaji mradi ulio katika latitudo na longitudo, au ulio kwenye mchoro wa dunia (projection) ambao ukurasa huu unaweza kuuweka.';
$ec_lang['lpn_terrain_done']='Miinuko {n} imejazwa.';
$ec_lang['lpn_terrain_missed']='{m} haikuweza kusomwa na bado ni tupu.';
$ec_lang['lpn_terrain_partial']='Vigae {f} vya ardhi havikujibu.';
$ec_lang['lpn_terrain_will_ids']='Vifundo hivi vitapata mwinuko: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Vifundo hivyo ni: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Vifundo hivi vimepata mwinuko: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Vifundo hivi bado havina mwinuko: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, na {n} zaidi';

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
$ec_lang['lpn_ff_menu']='Uchambuzi wa mtiririko wa moto…';
$ec_lang['lpn_ff_menu_tip']='Jaribu miunganiko mmoja mmoja: kila mmoja unaweza kutoa kiasi gani huku ukishikilia shinikizo linalobaki uliloweka, na je, kuchota mtiririko unaohitajika hapo kunasukuma kitu kingine chochote nje ya vikomo?';
$ec_lang['lpn_ff_title']='Uchambuzi wa mtiririko wa moto';
$ec_lang['lpn_ff_intro']='Kila muunganiko kwa zamu huulizwa kuchota mtiririko wa moto juu ya mahitaji aliyokwisha nayo. Hakuna kinachobadilika kwenye mradi wako; utendeshaji wote unafanywa kwenye nakala.';
$ec_lang['lpn_ff_scope']='Miunganiko ya kujaribu';
$ec_lang['lpn_ff_scope_tip']='Chagua kundi kabla ya kuendesha. Kujaribu kila muunganiko kwenye mfumo mkubwa kunaweza kuchukua dakika.';
$ec_lang['lpn_ff_all']='Yote';
$ec_lang['lpn_ff_selected']='Iliyochaguliwa';
$ec_lang['lpn_ff_no_junctions']='Mradi huu bado hauna miunganiko, hivyo hakuna cha kujaribu.';
$ec_lang['lpn_ff_no_selection']='Hakuna miunganiko iliyochaguliwa. Chagua miunganiko au chagua chaguo la Yote.';
$ec_lang['lpn_ff_skipped']='Vipengele {n} vilivyoteuliwa si miunganiko, hivyo havikujaribiwa.';
$ec_lang['lpn_ff_required']='Mtiririko wa moto unaohitajika';
$ec_lang['lpn_ff_required_tip']='Mtiririko unaohitajika na kanuni yako ya moto au mamlaka yako ya zimamoto kwenye hydranti. Kila muunganiko hujaribiwa dhidi ya namba hii isipokuwa una mtiririko wa moto unaohitajika wake mwenyewe.';
$ec_lang['lpn_ff_required_own']='Miunganiko yenye mtiririko wa moto unaohitajika wake mwenyewe hujaribiwa dhidi ya huo badala yake. Idadi yao: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Mtiririko wa moto unaohitajika kwenye muunganiko huu hasa, kwa matumizi ya ardhi anayohudumia, kutoka kanuni yako ya moto au mamlaka yako ya zimamoto. Kiache tupu na muunganiko utajaribiwa dhidi ya namba iliyo kwenye kisanduku cha Uchambuzi wa mtiririko wa moto.';
$ec_lang['lpn_ff_residual']='Shinikizo linalobaki la kushikilia';
$ec_lang['lpn_ff_residual_tip']='Shinikizo ambalo muunganiko lazima liendelee kushikilia wakati unatoa mtiririko wa moto. AWWA M31 na NFPA 291 hutumia psi 20 (kPa 140).';
$ec_lang['lpn_ff_design']='Ukaguzi wa kubuni (athari kwenye mfumo)';
$ec_lang['lpn_ff_design_tip']='Swali tofauti na kama muunganiko unaweza kutoa mtiririko: mtiririko huo ukichotwa hapo, je, kuna kitu kingine kinachoshuka chini ya shinikizo lake la chini kabisa au kuzidi kikomo chake cha kasi? Kuchagua kukagua hakugharimu ukokotoaji wa ziada.';
$ec_lang['lpn_ff_design_no_selection']='Upeo wa ukaguzi wa kubuni umewekwa kuwa Iliyochaguliwa, lakini hakuna vipengele vilivyochaguliwa. Chagua vipengele au chagua chaguo la Yote.';
$ec_lang['lpn_ff_minpressure']='Shinikizo la chini kabisa linaloruhusiwa mahali pengine';
$ec_lang['lpn_ff_minpressure_tip']='Muunganiko unaoshuka chini ya hili wakati mwingine unachota mtiririko wake wa moto huripotiwa kama tatizo la kubuni.';
$ec_lang['lpn_ff_maxvelocity']='Kasi ya juu kabisa inayoruhusiwa';
$ec_lang['lpn_ff_maxvelocity_tip']='Bomba linaloendesha juu ya hili wakati mtiririko wa moto unachotwa huripotiwa kama tatizo la kubuni.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Mtiririko wa moto unachotwa kwenye muunganiko wenyewe. Hiyo ndiyo mbinu inayotumika hapa, na ndiyo ya kawaida. Hydranti, bomba lake la pembeni, na mdomo wake havijaigwa, hivyo hydranti halisi hutoa kiasi kidogo kuliko mtiririko unaoonyeshwa hapa.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Kitatuzi kilichojengwa ndani kinatumika.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Injini ya EPANET inatumika.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='Mtiririko wa moto unaopatikana ni utafutaji, hivyo mtandao wote unatatuliwa mara kumi na sita hivi kwa kila muunganiko unaojaribiwa. Mfumo mkubwa unachukua dakika. Unaweza kuusimamisha wakati wowote na kubaki na kile ambacho tayari umekifanya.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Ni hatua ya muda iliyo kwenye skrini sasa pekee inayojaribiwa. Mtiririko wa moto kwa kawaida hujaribiwa juu ya mahitaji ya siku ya juu kabisa, hivyo weka mtandao kwenye hali hiyo kabla ya kuendesha.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Utendeshaji wa mtiririko wa moto';
$ec_lang['lpn_ff_calculate']='Endesha';
$ec_lang['lpn_ff_stop']='Simamisha';
$ec_lang['lpn_ff_working']='Inafanya kazi: {done} kati ya {total} miunganiko.';
$ec_lang['lpn_ff_stopped']='Imesimama baada ya {done} kati ya {total} miunganiko. Matokeo yaliyo chini ni yale yaliyokwisha kamilika.';
$ec_lang['lpn_ff_cost']='Utendeshaji huu ulitatua mtandao wote mara {solves}.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Mchoro umebadilika, hivyo matokeo ya mtiririko wa moto yamefutwa. Uendeshe tena.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Futa pete';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='Miunganiko {clean} haikuwa na tatizo lolote. Miunganiko {fire} ilishindwa mtiririko wa moto. Miunganiko {design} iliathiri mfumo uliobaki.';
$ec_lang['lpn_ff_summary_error']='Miunganiko {n} haikuweza kupatiwa jibu.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Kila muunganiko uliojaribiwa';
$ec_lang['lpn_ff_col_junction']='Muunganiko';
$ec_lang['lpn_ff_col_static']='Shinikizo tuli';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='Shinikizo kwenye muunganiko huu kabla ya mtiririko wowote wa moto kutolewa, huku mahitaji ya kawaida ya mfumo bado yakiendelea. Hakuna kinachozimwa ili kukipima, hivyo hili si shinikizo la mtiririko-sifuri kwa mfumo; ni shinikizo lile lile ambalo ramani inaonyesha kwenye muunganiko huu. AWWA M31 na NFPA 291 zote mbili huita usomaji huu shinikizo tuli, na ndipo jaribio la mtiririko wa moto linapoanzia.';
$ec_lang['lpn_ff_col_available']='Mtiririko unaopatikana';
$ec_lang['lpn_ff_col_required']='Mtiririko unaohitajika';
$ec_lang['lpn_ff_col_residual']='Lililobaki';
$ec_lang['lpn_ff_col_atrequired']='Shinikizo kwa mtiririko unaohitajika';
$ec_lang['lpn_ff_col_affected']='Athari mbaya zaidi';
$ec_lang['lpn_ff_col_limit']='Kikomo cha kubuni';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Haikukaguliwa';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Tuli ilishindwa, hivyo haikukaguliwa';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Aina za kushindwa';
$ec_lang['lpn_ff_mode_fire']='Moto';
$ec_lang['lpn_ff_mode_design']='Kubuni';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Hakuna';
$ec_lang['lpn_ff_col_solves']='Utatuzi';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Shinikizo na kasi';
$ec_lang['lpn_ff_atleast']='zaidi ya {flow}';
$ec_lang['lpn_ff_affect_node']='{id} inashuka hadi {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} inafika {velocity}';
$ec_lang['lpn_ff_more']='na {n} zaidi zilizoathirika';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='Miunganiko {n} zaidi haionyeshwi.';
$ec_lang['lpn_ff_design_none']='Hakuna kilichozidi vikomo vyake kwenye kundi lililochaguliwa wakati muunganiko wowote ulipochota mtiririko wake wa moto.';
$ec_lang['lpn_ff_design_off_note']='Athari kwenye mfumo uliobaki haikukaguliwa katika utendeshaji huu.';
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
$ec_lang['lpn_ff_iso']='Insurance Services Office (ISO) inatambua hydranti moja kwa kiwango cha juu cha {flow}. Kikomo hicho hakijatumika hapa kwa sababu hatujui hydranti ngapi kifundo kinaweza kuwakilisha.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Tayari chini ya kinachopaswa kubaki kabla ya mtiririko wowote wa moto kuchotwa';
$ec_lang['lpn_ff_err_converge']='Mtandao haukupata suluhisho.';
$ec_lang['lpn_ff_err_solve']='Kitatuzi kiliripoti hitilafu na hakikutoa jibu.';
$ec_lang['lpn_ff_err_not_junction']='Si muunganiko';
$ec_lang['lpn_ff_err_unknown']='Hakuna jibu. Msimbo ulioripotiwa ulikuwa {code}.';

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
$ec_lang['lpn_file_import_survey']='Ingiza vituo vilivyopimwa…';
$ec_lang['lpn_file_import_survey_tip']='Soma orodha ya vituo vilivyopimwa kutoka kwenye faili la maandishi kisha tengeneza muunganiko mmoja kwenye kila kituo, ukichukua mipangilio ya kipengele-kipya kwa chochote ambacho faili halijataja. Hakuna mabomba yanayochorwa, na hakuna safu mlalo inayoachwa bila kutajwa jina. Husoma mfumo wa kuratibu ambao mradi huu tayari unautumia, wenye marejeleo ya kijiografia au la.';
$ec_lang['lpn_survey_read_error']='Faili hilo halikuweza kusomwa kutoka kwenye kifaa chako.';
$ec_lang['lpn_survey_cancelled']='Hakuna kilichoundwa na hakuna kilichobadilika.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Kaskazini';
$ec_lang['lpn_survey_axis_east']='Mashariki';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Faili hilo halina kitu ndani yake.';
$ec_lang['lpn_survey_err_unreadable']='Faili hilo halikuweza kusomwa kama orodha ya vituo vilivyopimwa.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Safu zaidi ya moja katika faili hilo zinaweza kuwa {axis} ({detail}), na ukurasa huu hautachagua kati yake. Acha mojawapo ikiwa imeitwa {axis} kisha jaribu tena.';
$ec_lang['lpn_survey_err_no_points']='Hakuna hata safu mlalo moja ya faili hilo iliyoweza kusomwa kama kituo kilichopimwa. Safu mlalo zilizosomwa: {detail}';
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
$ec_lang['lpn_survey_format_label']='Muundo wa faili:';
$ec_lang['lpn_survey_format_internal']='umetajwa ndani';
$ec_lang['lpn_survey_create']='Unda vifundo';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='Mstari wa kwanza umerukwa: hautaji safu yoyote inayojulikana na ukurasa huu.';
$ec_lang['lpn_survey_type_label']='Aina ya kipengele:';
$ec_lang['lpn_survey_confirm_junction']='Miunganiko {n} imepatikana. Endelea?';
$ec_lang['lpn_survey_confirm_reservoir']='Hifadhi za maji {n} zimepatikana. Endelea?';
$ec_lang['lpn_survey_confirm_tank']='Matanki {n} yamepatikana. Endelea?';
$ec_lang['lpn_survey_report_junction']='Miunganiko {n} imeingizwa, {m} ikiwa na mwinuko.';
$ec_lang['lpn_survey_report_reservoir']='Hifadhi za maji {n} zimeingizwa, {m} zikiwa na mwinuko.';
$ec_lang['lpn_survey_report_tank']='Matanki {n} yameingizwa, {m} yakiwa na mwinuko.';
$ec_lang['lpn_survey_report_clean']='Kila kituo kwenye faili kimeingia, na hakuna kilichobadilika njiani.';
$ec_lang['lpn_survey_report_notes']='Hitilafu na maelezo ya kuingiza:';
$ec_lang['lpn_survey_sev_error']='hitilafu';
$ec_lang['lpn_survey_sev_warning']='onyo';
$ec_lang['lpn_survey_note_line']='Mstari {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Safu chache mno kwa muundo wa faili ulio hapo juu.';
$ec_lang['lpn_survey_note_coord_missing']='Seli ya {axis} iko wazi.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} haisomeki kama namba.';
$ec_lang['lpn_survey_note_coord_range']='{axis} iko nje ya wigo unaoruhusiwa na mradi huu.';
$ec_lang['lpn_survey_note_bad_elev']='Mwinuko usio wa kinamba. Umeingizwa bila mwinuko.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Safu zaidi ya moja zingeweza kuwa mwinuko, hivyo hakuna hata moja iliyosomwa.';
$ec_lang['lpn_survey_note_blank_rows']='Mistari mitupu imerukwa: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Jina limekwisha tumika mapema kwenye faili hili, jina jipya limetolewa.';
$ec_lang['lpn_survey_note_id_taken']='Jina liko tayari kwenye mradi, jina jipya limetolewa.';
$ec_lang['lpn_survey_note_id_invalid']='Jina haliwezi kutumika hapa, jina jipya limetolewa.';
