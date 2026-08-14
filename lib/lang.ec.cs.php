<?php

// ěščžřýáíúůéó — All missing text declarations will fall back to English.

// Units (alphabetical order)
$ec_lang['u_depthFrac']='podíl';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/s';
$ec_lang['u_gpm']='gal/min';
$ec_lang['u_gradePercent']='% sklonu';
$ec_lang['u_grade']='sklon';
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
$ec_lang['menu_brand']='Kalkulačky HawsEDC';
$ec_lang['menu_main_list']='Seznam kalkulaček';
$ec_lang['menu_main_hydraulics']='Hydraulika';
$ec_lang['menu_main_language']='Jazyk';
$ec_lang['menu_more']='Více';
$ec_lang['menu_libre']='Svobodný software';
$ec_lang['template_welcome']='Nechejte strachy za dveřmi; zde je láska naším jazykem. Nekazíte vše. Užijte si také <a target="_blank" href="https://hawsedc.com/download.php">zdarma nástroje HawsEDC pro AutoCAD.</a>';
$ec_lang['template_feedback']='Můžete navrhnout lepší znění tohoto textu, nebo máte jiný nápad? Chcete pomoci, nebo se naučit vytvářet podobné nástroje? Napište mi, prosím.';
$ec_lang['template_printable_title']='Tisknutelný název';
$ec_lang['template_printable_subtitle']='Tisknutelný podtitul';
// Consent banner and the two site documents behind it (ROADMAP Task 286). These are UI, not legal
// prose, and they are translated into all 26 languages for one reason: consent that the visitor
// cannot read is not consent. The long-form privacy notice and terms are a separate question --
// English-authoritative, and translated by a human later if at all.
$ec_lang['consent_body']='Smíme si v úložišti tohoto profilu prohlížeče uchovávat jednu číslici na stránku, abychom zabránili opakovanému zaznamenávání jejích návštěv?';
$ec_lang['consent_accept']='Přijmout tentokrát';
$ec_lang['consent_accept_all']='Přijmout natrvalo';
$ec_lang['consent_decline']='Odmítnout natrvalo';
$ec_lang['consent_current_granted']='Povolili jste to. Omezujeme zaznamenávání pro tento profil prohlížeče.';
$ec_lang['consent_current_denied']='Odmítli jste to. Neukládáme nic, co by omezovalo zaznamenávání pro tento profil prohlížeče.';
$ec_lang['consent_region_label']='Vaše volba ohledně omezení zaznamenávání.';
$ec_lang['consent_settings_link']='Nastavení cookies';
$ec_lang['privacy_link']='Zásady ochrany osobních údajů';
$ec_lang['terms_link']='Podmínky použití';
$ec_lang['index_main_title']='Bezplatné inženýrské kalkulačky online';
$ec_lang['index_meta_desc_plain']='Bezplatné inženýrské kalkulátory pro potrubí, koryta, přelivy a závlahy. Fungují přímo v prohlížeči, pracují offline a jsou dostupné ve 27 jazycích.';
$ec_lang['calc_set_units']='Nastavit jednotky:';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Obnovit výchozí hodnoty';
$ec_lang['calc_defaults_confirm']='Resetovat kalkulačku na výchozí hodnoty?';
$ec_lang['points_data_note']='(nebo Kopírovat/Vložit pomocí datové oblasti)';
$ec_lang['points_data_heading']='Data bodů<br />(oddělena čárkou nebo tabulátorem)';
$ec_lang['points_data_copy']='Kopírovat';
$ec_lang['points_data_paste']='Vložit';
$ec_lang['calc_inputs']='Vstupy';
$ec_lang['calc_results']='Výsledky';
$ec_lang['view_hide_line']='[Skrýt tento řádek]';
$ec_lang['view_printable']='Verze pro tisk (obnovit pro vrácení)';
$ec_lang['ec_name_label']='Uložit tento výpočet:';
$ec_lang['ec_name_placeholder']='Název';
$ec_lang['ec_name_tip']='Uloží tyto zadané hodnoty do adresy URL pro přidání do záložek, načtení z historie a sdílení';
$ec_lang['calc_copy_link']='Kopírovat odkaz';
$ec_lang['ec_related_calcs']='Související kalkulačky:';
$ec_lang['calc_copy_link_done']='Zkopírováno!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Ztráta tlakové výšky v potrubí Darcy-Weisbach';
$ec_lang['dw_main_title']='Bezplatný online kalkulátor ztráty tlakové výšky v potrubí Darcy-Weisbach';
$ec_lang['dw_main_desc']='Ztráta tlakové výšky v potrubí dle Darcy-Weisbach při daném průměru, drsnosti a průtoku';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Absolutní drsnost stěny potrubí, e. Typické hodnoty: ocel (nová) 0,046 mm, ocel (použitá) 0,15 mm, HDPE 0,003 mm, PVC/uPVC 0,0015 mm, beton 0,3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s pro čistou vodu při 20°C">Kinematická viskozita, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Kinematická viskozita, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s pro čistou vodu při 20°C';
$ec_lang['dw_reynolds_number']='Reynoldsovo číslo, Re';
$ec_lang['dw_flow_regime']='Režim proudění';
$ec_lang['dw_regime_laminar']='laminární';
$ec_lang['dw_regime_transitional']='přechodný';
$ec_lang['dw_regime_turbulent']='turbulentní';
$ec_lang['dw_friction_factor_method']='Metoda součinitele tření';
$ec_lang['dw_friction_factor']='Součinitel tření, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Ztráta tlakové výšky v potrubí Hazen-Williams';
$ec_lang['hw_main_title']='Bezplatný online kalkulátor ztráty tlakové výšky v potrubí Hazen-Williams';
$ec_lang['hw_main_desc']='Ztráta tlakové výšky v potrubí dle Hazen-Williams při daném průměru, drsnosti a průtoku';
$ec_lang['hw_hgl_1']='HGL po proudu';
$ec_lang['hw_hgl_2']='HGL proti proudu';
$ec_lang['hw_elev_up']='Kóta proti proudu';
$ec_lang['hw_pressure_up']='Tlak proti proudu';
$ec_lang['hw_elev_down']='Kóta po proudu';
$ec_lang['hw_pressure_down']='Tlak po proudu';
$ec_lang['hw_pressure_check']='Kontrola tlaku';
$ec_lang['hw_pressure_ok_short']='Kladný tlak';
$ec_lang['hw_pressure_neg_short']='Záporný tlak';
$ec_lang['hw_pressure_neg']='Tlak po proudu je pod nulou. Čára HGL klesá pod potrubí, takže by potrubí neproudilo zcela plné a tento výsledek nemusí být platný.';
$ec_lang['hw_roughness']='Hazen-Williamsův součinitel, C';
$ec_lang['hw_note_1']='<dl><dt>Tento kalkulátor nemodeluje profil potrubí mezi oběma konci.</dt><dd>Používá pouze kóty proti proudu a po proudu, které zadáte. Pokud terén mezi oběma konci stoupá výše než kterýkoli z nich, je tlak v tomto vysokém bodě nižší než jakýkoli tlak zde uvedený. Spusťte výpočet znovu pro úsek od konce proti proudu po tento vysoký bod, abyste jej ověřili.</dd><dd>Tam, kde čára HGL klesne pod potrubí, je voda pod záporným tlakem. Z vody se uvolňuje vzduch, tenkostěnné potrubí se může zhroutit a spárami může být nasáta znečištěná podzemní voda. Udržujte na celé trase kladný tlak a zvažte osazení vzdušníku v každém vysokém bodě.</dd><dt>Tlak proti proudu je okrajová podmínka, kterou zadáváte sami.</dt><dd>Odečtěte jej z manometru, z hladiny vody v nádrži (výška vody nad potrubím) nebo z charakteristiky čerpadla. Čerpadlo dodává s rostoucím průtokem nižší tlak, proto použijte bod na křivce odpovídající průtoku zadanému výše.</dd><dt>Součinitele místních (lokálních) ztrát si sečtěte sami.</dt><dd>Sečtěte hodnoty K pro každý ventil, koleno, T-kus, vodoměr a vstup na trase a zadejte jejich součet. Typické hodnoty najdete přes odkaz u tohoto pole. U dlouhého přivaděče jsou tyto ztráty ve srovnání s třením malé, ale u krátkého potrubí ve stanici mohou tvořit většinu ztráty.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Nepravidelné koryto Manning';
$ec_lang['mi_main_title']='Bezplatný online kalkulátor nepravidelného koryta Manning';
$ec_lang['mi_main_desc']='Kalkulátor rovnoměrného proudění v nepravidelném korytě dle Manninga';
$ec_lang['mi_waterSurfaceElevation']='Kóta hladiny vody';
$ec_lang['mi_q_617']='<span class="ec-help" title="Složený průtok Q s využitím složeného n pro každou oblast dle Chow 6-17, stejné rychlosti">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Body příčného řezu';
$ec_lang['mi_groupPoint']='Bod';
$ec_lang['mi_groupSegment']='Úsek';
$ec_lang['mi_groupRegion']='Oblast';
$ec_lang['mi_station']='Sta.';
$ec_lang['mi_elevation']='Kóta';
$ec_lang['mi_d50in']='Mediánová<br />velikost<br />kamene<br />opevnění';
$ec_lang['mi_n']='n<br />seg-<br />mentu';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />hranice<br />oblasti<br />(Břeh)';
$ec_lang['mi_tau']='Tečné<br />nap. dna<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='Složený<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='Složený n';
$ec_lang['mi_notes_1_def']='Tento kalkulátor sleduje referenční příručku HEC-RAS při výpočtu složeného n oblasti pomocí Chow 1959, strana 136, rovnice 6-17 (ne 6-18).';
$ec_lang['mi_notes_2_term']='Kamenné opevnění';
$ec_lang['mi_notes_2_def']='Pro návrh kamenného opevnění použijte kalkulátor lichoběžníkového koryta Manning. Tento kalkulátor je vhodnější pro přirozené průřezy.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Průtok v potrubí Manning';
$ec_lang['mpf_main_title']='Bezplatný online kalkulátor průtoku v potrubí Manning';
$ec_lang['mpf_main_desc']='Manningova rovnice pro rovnoměrný průtok v potrubí při daném sklonu a hloubce';
$ec_lang['mpf_spreadheet_notice']='Manningova tabulka průtoku v potrubí';
$ec_lang['mpf_pipe_diameter']='Průměr potrubí, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Manningův součinitel drsnosti, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Třecí sklon, S<sub>f</sub></a><span class="ec-help" title="Někdy roven sklonu potrubí. Sledujte odkaz pro vysvětlení (pouze v angličtině)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Poměrná hloubka plnění, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Průtok, Q';
$ec_lang['mpf_flow_tip']='Průtok a hloubka jsou vypočteny pro nekonečně dlouhé potrubí. Pro dosažení tohoto průtoku v potrubí může být zapotřebí větší hloubka vzdutí na vtoku. Podrobnosti a výukové video naleznete v poznámkách níže.';
$ec_lang['mpf_velocity']='Rychlost, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Kinetická energie vyjádřená jako výška vodního sloupce, v²/2g">Rychlostní výška, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Průtočná plocha, A';
$ec_lang['mpf_pipe_area']='Plocha potrubí, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Poměrná plocha, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Smočený obvod, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Hydraulický poloměr, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Šířka hladiny, T';
$ec_lang['mpf_froude_number']='Froudovo číslo, Fr';
$ec_lang['mpf_shear_stress']='Průměrné smykové napětí, τ';
$ec_lang['mpf_full_flow']='Průtok při plném plnění, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Poměr k plnému průtoku, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Toto je průtok a hloubka uvnitř <em>nekonečně dlouhého</em> potrubí.</dt><dd>Aby průtok vůbec vtekl do potrubí, může být zapotřebí výrazně vyšší hloubka vzduté hladiny na vtoku. Pro odhad hloubky vzdutí přičtěte alespoň 1,5násobek rychlostní výšky, nebo <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">zhlédněte můj 2minutový výukový program</a> o standardním výpočtu vzdutí u propustků pomocí programu <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, bezplatného programu pro propustky od Federální správy dálnic USA (U.S. Federal Highway Administration).</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Navrhujete splaškovou kanalizaci?</dt><dd>Viz <a target="_blank" href="/sewslope.php">tabulky minimálního sklonu kanalizace</a> pro potrubí o průměru 4 až 96 palců (100 až 2400 mm), uvedené v m/m, mm/m a procentech, a studii <a target="_blank" href="/peakfact.php">špičkových součinitelů pro velmi nízké průtoky</a>. Oba dokumenty jsou k dispozici pouze v angličtině.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Zadejte kladnou cílovou hodnotu Q.';
$ec_lang['mpf_solver_no_solution']='Žádné řešení: Q překračuje kapacitu potrubí při y/d0 = 93.8% (Qmax = {qmax} ve zvolených jednotkách).';
$ec_lang['mpf_solve_btn']='Vypočítat';
$ec_lang['mpf_solve_for_flow']='pro průtok, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Ztráta tlakové výšky v potrubí Manning';
$ec_lang['mphl_main_title']='Bezplatný online kalkulátor ztráty tlakové výšky v potrubí Manning';
$ec_lang['mphl_main_desc']='Manningova rovnice ztráty tlakové výšky při plném průtoku';
$ec_lang['mphl_pipe_length']='Délka, L';
$ec_lang['mphl_area']='Plocha, A';
$ec_lang['mphl_total_junction_k']='Součinitel místní ztráty, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Součinitel ztráty, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Součinitel místní ztráty, km. Tyto ztráty vznikají v místech spojů potrubí, vstupů, výstupů, kolen a armatur — označení „místní“ je zavedené, ale zavádějící: na krátkém úseku potrubí se mohou vyrovnat třecím ztrátám nebo je i překročit. Typické hodnoty k: ostrohranný vstup 0.5, každé koleno 45° 0.2–0.3, šoupátko (plně otevřené) 0.1, klapka 0.2, výstup (do nádrže nebo do atmosféry) 1.0. Sečtěte hodnoty všech armatur a tvarovek pro celkové km. Výchozí hodnota 2.0 předpokládá jeden vstup, jeden výstup a dvě kolena 45°.';
$ec_lang['mphl_friction_slope']='Třecí sklon';
$ec_lang['mphl_friction_loss']='Ztráta třením, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Místní ztráta, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Celková ztráta, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='EGL po proudu';
$ec_lang['mphl_egl_2']='EGL proti proudu';
$ec_lang['mphl_hgl_egl_tip']='Nemusí platit, pokud je potrubí vysoko. Viz poznámky.';
$ec_lang['mphl_note_1']='<dl><dt>Tento kalkulátor nemodeluje profil potrubí mezi oběma konci.</dt><dd>Pokud HGL v kterémkoli bodě klesne pod horní hranu potrubí, nemusí být tento výpočet platný.</dd><dt>Pro podmínku otevřeného vtoku (propustek) je nutné zkontrolovat podmínky vtokového ovládání.</dt><dd>1. HGL proti proudu musí být výše než kóta hladiny při normální hloubce proudění (a výše než potrubí!).</dd><dd>2. Vzdutou hladinu propustku lépe vyjadřuje EGL proti proudu než HGL proti proudu.</dd><dd>3. Viz <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">2minutový výukový program</a> pro jednoduchý standardní výpočet vzdutí u propustků pomocí programu <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, bezplatného programu pro propustky od Federální správy dálnic USA (U.S. Federal Highway Administration).</dd><dd>4. Tato stránka řeší pouze případ výtokového ovládání: potrubí protéká zcela plné, kdy podmínky po proudu určují vzdutou výšku. Návrh propustku spočívá v rozhodnutí, zda převažuje vtokové, nebo výtokové ovládání, proto použijte HY-8, kdykoli by mohlo převažovat kterékoli z nich.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Lichoběžníkové koryto Manning';
$ec_lang['mtc_main_title']='Bezplatný online kalkulátor lichoběžníkového koryta Manning';
$ec_lang['mtc_main_desc']='Manningova rovnice rovnoměrného proudění v lichoběžníkovém korytě při daném sklonu a hloubce';
$ec_lang['mtc_bottom_width']='Šířka dna, b';
$ec_lang['mtc_side_slope_1']='Sklon svahu 1, z<sub>1</sub> (vodorovně/svisle)';
$ec_lang['mtc_side_slope_2']='Sklon svahu 2, z<sub>2</sub> (vodorovně/svisle)';
$ec_lang['mtc_channel_slope']='Sklon koryta, S';
$ec_lang['mtc_flow_depth']='Hloubka proudění, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Úhel oblouku, β</a><span class="ec-help" title="Pro velikost záhozu. Sledujte odkaz pro schéma."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Hustota vztažená k vodě. Typicky ≈ 2,65 pro lomový kámen.">Relativní hustota kamene, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Návrhová velikost kamene, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n pro návrhovou velikost kamene dle Stricklera';
$ec_lang['mtc_n_blodgett']='n pro návrhovou velikost kamene dle Blodgetta';
$ec_lang['mtc_n_bathurst']='n pro návrhovou velikost kamene dle Bathursta';
$ec_lang['mtc_n_pi']='n pro návrhovou velikost kamene dle Phillipse a Ingersolla';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett oproti Bathurstovi';
$ec_lang['mtc_pi_range_check']='Kontrola rozsahu P&I';
$ec_lang['mtc_pi_ok']='d50 v rozsahu P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Mimo rozsah';
$ec_lang['mtc_pi_tip']='Extrapolace mimo rozsah datového souboru 0,28–0,36 ft, ze kterého byla tato rovnice odvozena — berte jako orientační kontrolu, nikoli jako podklad pro návrh';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Dle Isbash (1936) a Maricopa County, Arizona, USA.">Požadovaná velikost lomového kamene na dně, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Dle Isbash (1936) a Maricopa County, Arizona, USA.">Požadovaná velikost lomového kamene svahu 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Dle Isbash (1936) a Maricopa County, Arizona, USA.">Požadovaná velikost lomového kamene svahu 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_mra']='Požadovaná velikost lomového kamene, D<sub>50</sub> (Maynord, Ruff a Abt 1989)';
$ec_lang['mtc_d50_searcy']='Požadovaná velikost lomového kamene, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Rychlost přiměřená pro předpoklady rovnoměrného proudění.';
$ec_lang['mtc_vel_low']='Rychlost nízká — riziko sedimentace.';
$ec_lang['mtc_vel_high']='Rychlost je vysoká a nemusí být reálná; zkontrolujte erozi opevnění koryta, zvětšenou hloubku v obloucích a ztrátu energie na rozšířeních nebo překážkách.';
$ec_lang['mtc_iteration_tip']='Zvolte přepínač pro drsnost (doporučeno Blodgett–Bathurst) a přepínač pro velikost kamene (doporučeno Isbash), aby se automaticky iterovala rovnoměrná velikost kamene pro požadovaný průtok. Úplný postup najdete v poznámkách níže, nebo zadejte vlastní hodnotu drsnosti (viz odkaz pro pomoc) a velikost kamene ignorujte, chcete-li iteraci přeskočit.';
$ec_lang['mtc_note_1']='<dl><dt>Automatická iterace návrhu kamene a drsnosti</dt><dd>Zvolte přepínač pro drsnost (doporučeno Blodgett–Bathurst) a přepínač pro návrhovou velikost kamene (doporučeno Isbash). Dolaďte hloubku a bezpečnostní faktor kamene pro dosažení požadovaného průtoku s rovnoměrnou velikostí kamene. Každá změna vstupní hodnoty spustí iterační cyklus: 1. Drsnost je vypočtena z návrhové velikosti kamene. 2. Požadovaný výpočet drsnosti je zkopírován do vstupní drsnosti. 3. Průtok v korytě a požadovaná velikost kamene jsou vypočteny. 4. Návrhová velikost kamene je upravena. 5. Opakovat dokud chyba v návrhové velikosti kamene není velmi malá.</dd><dt>Základní kalkulátor (bez iterace)</dt><dd>Zadejte požadovanou hodnotu drsnosti. Ignorujte oblast zadávání návrhové velikosti kamene.</dd></dl>';
$ec_lang['mtc_note_2_term']='Kontrola rychlosti';
$ec_lang['mtc_note_2_def']='Vysoká rychlost znamená vysokou specifickou energii z dostupného spádu. Tato energie může být rychle ztracena na rozšířeních, obloucích nebo překážkách. Ověřte, zda je to pro danou lokalitu přiměřené.';
$ec_lang['mtc_solver_no_solution']='Pro dané Q nebylo se zadanými parametry koryta nalezeno žádné řešení.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Jednoduchý přepad';
$ec_lang['ws_main_title']='Bezplatný online kalkulátor jednoduchého širokokorunového přepadu';
$ec_lang['ws_main_desc']='Kalkulátor průtoku jednoduchým širokokorunovým přepadem';
$ec_lang['ws_weirLength']='Délka přepadu, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Energie na jednotku hmotnosti vody — výška vodního sloupce, ne tlak">Přepadová výška, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Součinitel přepadu, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Poznámky';
$ec_lang['ws_notes_we_term']='Rovnice přepadu';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Nepravidelný přepad';
$ec_lang['wi_main_title']='Bezplatný online kalkulátor segmentovaného nepravidelného přepadu s proměnnou hloubkou';
$ec_lang['wi_main_desc']='Kalkulátor průtoku nepravidelným přepadem';
$ec_lang['wi_weirPoints']='Body přepadu';
$ec_lang['wi_pondingHeight']='Výška vzdutí';
$ec_lang['wi_incrementalFlow']='Přírůstkový průtok';
$ec_lang['wi_cumulativeFlow']='Kumulativní průtok';
$ec_lang['wi_save_and_calculate']='Uložit a vypočítat';
$ec_lang['wi_notes_we_def']='q = pokud (délka = 0) pak 0, jinak pokud (sklon = 0) pak cw*délka*d<sub>0</sub><sup>1.5</sup>, jinak cw/(2.5*sklon) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>), kde d<sub>1</sub> a d<sub>0</sub> jsou vždy kladné nebo nulové';
// Orifice Flow
$ec_lang['or_main_menu']='Průtok otvorem';
$ec_lang['or_main_title']='Bezplatný online kalkulátor průtoku otvorem';
$ec_lang['or_main_desc']='Průtok otvorem — volný nebo zatopený';
$ec_lang['or_shape']='Tvar otvoru';
$ec_lang['or_shape_circular']='Kruhový';
$ec_lang['or_shape_rectangular']='Obdélníkový';
$ec_lang['or_diameter']='<span class="ec-help" title="Průměr pro kruhový; výška pro obdélníkový">Průměr nebo výška, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Pouze obdélníkové otvory">Šířka, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Spodní hrana otvoru">Kóta dna otvoru <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Nadržená hladina';
$ec_lang['or_twe']='Hladina dolní vody';
$ec_lang['or_cd']='Součinitel výtoku, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Kóta těžiště';
$ec_lang['or_head']='<span class="ec-help" title="Energie na jednotku hmotnosti vody — výška vodního sloupce, ne tlak">Účinná výška, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Plocha otvoru, A';
$ec_lang['or_regime']='Kontrola režimu průtoku otvorem';
$ec_lang['or_regime_valid']='Volný výtok';
$ec_lang['or_regime_submerged']='Zatopený otvor';
$ec_lang['or_regime_submerged_tip']='TWE nad těžištěm otvoru — režim otvoru je stále platný';
$ec_lang['or_regime_warn']='Mimo režim otvoru';
$ec_lang['or_regime_warn_tip']='Nadržená hladina pod vrcholem otvoru';
$ec_lang['or_regime_twe_above_hwe']='Zkontrolujte vstupy';
$ec_lang['or_regime_twe_above_hwe_tip']='Hladina dolní vody (TWE) nad nadrženou hladinou (HWE)';
$ec_lang['or_notes_1_term']='Rovnice otvoru';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Volný výtok: h = HWE − těžiště. Zatopený (TWE nad dnem): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Režim otvoru';
$ec_lang['or_notes_2_def']='Rovnice průtoku otvorem platí, pokud je nadržená hladina nad vrcholem (horní hranou) otvoru. Pokud je nadržená hladina pod vrcholem, použijte místo toho rovnici přepadu.';
$ec_lang['or_notes_3_term']='Součinitel výtoku';
$ec_lang['or_notes_3_def']='C<sub>d</sub> se pohybuje přibližně od 0,60 do 0,65 pro ostrohranné otvory. Zaoblené nebo vtažené (re-entrant) vtoky mají jiné hodnoty. Viz <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> nebo Hydraulický referenční manuál HEC-RAS.';
$ec_lang['or_notes_4_term']='Zatopení';
$ec_lang['or_notes_4_def']='Pokud je TWE nad dnem otvoru, tento kalkulátor automaticky použije rovnici zatopeného otvoru s h = HWE − TWE. Pokud je TWE na úrovni dna otvoru nebo níže, předpokládá se volný výtok a h = HWE − těžiště.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Mikro-vodní elektrárna';
$ec_lang['mhp_main_title']='Bezplatný online kalkulátor výkonu mikro-vodní elektrárny';
$ec_lang['mhp_main_desc']='Kalkulátor výkonu průtočné mikro-vodní elektrárny';
$ec_lang['mhp_gross_head']='Hrubý spád, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Průměr tlakovodu (přiváděcího potrubí)">Průměr tlakovodu, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Délka, L';
$ec_lang['mhp_efficiency']='Účinnost elektrárny, η (0–1)';
$ec_lang['mhp_vel_check']='Kontrola rychlosti';
$ec_lang['mhp_hl_check']='Kontrola ztráty tlakové výšky';
$ec_lang['mhp_hnet']='Čistý spád, H<sub>net</sub>';
$ec_lang['mhp_power']='Výstupní výkon, P';
$ec_lang['mhp_annual_kwh']='Roční výroba při 100% výkonu';
$ec_lang['mhp_vel_low']='Rychlost nízká — riziko sedimentace a usazování vzduchu.';
$ec_lang['mhp_vel_high']='Rychlost vysoká — zkontrolujte ztráty na přechodech, dostupnou energii a riziko vodního rázu.';
$ec_lang['mhp_vel_ok_short']='OK';
$ec_lang['mhp_vel_high_short']='Vysoká';
$ec_lang['mhp_vel_low_short']='Nízká';
$ec_lang['mhp_vel_ok_tip']='Rychlost je v efektivním rozsahu pro návrh tlakovodu.';
$ec_lang['mhp_hl_ok_tip']='V rámci cíle 10 % — ekonomické.';
$ec_lang['mhp_hl_warn_tip']='Přesahuje cíl 10 %. Zvažte větší potrubí.';
$ec_lang['mhp_hl_bad_tip']='Přesahuje cíl 20 %. Změňte velikost potrubí.';
$ec_lang['mhp_notes_1_term']='Ztráta tlakové výšky';
$ec_lang['mhp_notes_1_def']='Celková ztráta v tlakovodu h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, kde h<sub>f</sub> = f(L/D)(v²/2g) je třecí ztráta podle Darcy-Weisbacha a h<sub>m</sub> = k<sub>m</sub>·v²/2g zahrnuje vtok, kolena a armatury. Čistý spád H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Rychlost';
$ec_lang['mhp_notes_2_def']='Zkontrolujte, zda je rychlost přiměřená vzhledem k dostupnému spádu a nákladům na potrubí. Velmi nízká rychlost může svědčit o předimenzování; velmi vysoká rychlost zvyšuje třecí ztráty a riziko vodního rázu.';
$ec_lang['mhp_notes_3_term']='Cílová ztráta tlakové výšky';
$ec_lang['mhp_notes_3_def']='Ztráty v přiváděcím potrubí pod 10% hrubého spádu jsou zpravidla hospodárné. Optimální kompromis mezi náklady na potrubí a ztrátou výkonu se obvykle pohybuje kolem 4–6% pro lokality s vysokou hodnotou elektřiny.';
$ec_lang['mhp_notes_6_term']='Účinnost';
$ec_lang['mhp_notes_6_def']='Typická účinnost elektrárny η se pohybuje od 0,70 do 0,85 pro Peltonovy a příčné turbíny běžné v mikro-vodní energetice. Jako konzervativní první odhad použijte hodnotu 0,75.';
$ec_lang['mhp_notes_7_term']='Roční výroba energie';
$ec_lang['mhp_notes_7_def']='Roční výroba energie předpokládá nepřetržitý provoz při plném průtoku (8760 hodin/rok). Skutečná výroba bude nižší z důvodu sezónní variability průtoku, prostojů při údržbě a faktoru zatížení.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Doba vypouštění rybníka a nádrže';
$ec_lang['odt_main_title']='Bezplatný online kalkulátor doby vypouštění rybníka, jímky a nádrže (otvorem)';
$ec_lang['odt_main_desc']='Doba vypouštění rybníka, jímky nebo nádrže — výtok otvorem, metoda kónického objemu';
$ec_lang['odt_h1_elev']='Počáteční kóta hladiny vody';
$ec_lang['odt_a1']='Počáteční plocha, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Koncová kóta hladiny vody';
$ec_lang['odt_a0']='Plocha na úrovni otvoru, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Interpolováno z kónického modelu na koncové kótě">Koncová plocha, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Kontrola koncové kóty';
$ec_lang['odt_h2_ok']='Koncová kóta nad vrcholem otvoru';
$ec_lang['odt_h2_warn']='Koncová kóta na úrovni nebo pod vrcholem otvoru';
$ec_lang['odt_h2_warn_tip']='Vrchol otvoru = těžiště + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Průměr (kruhový) nebo výška (obdélníkový)">Otvor D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Pouze obdélníkový">Šířka otvoru, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Doba prázdnění (s)';
$ec_lang['odt_t_min']='Doba prázdnění (min)';
$ec_lang['odt_t_hr']='Doba prázdnění (hod)';
$ec_lang['odt_t_day']='Doba prázdnění (dny)';
$ec_lang['odt_notes_1_term']='Vzorec';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) udává dobu prázdnění od výšky H k otvoru. Doba prázdnění = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), kde H<sub>1</sub> = počáteční kóta − kóta otvoru, H<sub>2</sub> = koncová kóta − kóta otvoru.';
$ec_lang['odt_notes_2_term']='Metoda';
$ec_lang['odt_notes_2_def']='Metoda kónického objemu modeluje rybník nebo nádrž jako kónický řez mezi počáteční plochou A<sub>1</sub> u počáteční hladiny a plochou A<sub>0</sub> na kótě těžiště otvoru. A<sub>2</sub>, plocha na koncové kótě, je interpolována z A<sub>1</sub> a A<sub>0</sub> pomocí modelu kónického řezu. Doba prázdnění od počáteční do koncové kóty se rovná celkové době od H<sub>1</sub> k otvoru minus zbývající doba od H<sub>2</sub> k otvoru.';
$ec_lang['odt_h1']='<span class="ec-help" title="Počáteční kóta hladiny vody minus kóta těžiště otvoru">Počáteční výška, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Maximální průtok, Q<sub>max</sub>';
$ec_lang['odt_vol']='Vyčerpaný objem';
$ec_lang['odt_sketch_start']='Začátek';
$ec_lang['odt_sketch_end']='Konec';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Rozteč emitorů, S<sub>e</sub>';
$ec_lang['ip_sl']='Rozteč postranních větví, S<sub>l</sub>';
$ec_lang['ip_n_e']='Emitory na postranní větev, n<sub>e</sub>';
$ec_lang['ip_n_l']='Postranní větve na zónu, n<sub>l</sub>';
$ec_lang['ip_d']='Cílová dávka závlahy, d';
$ec_lang['ip_a_e']='Plocha na emitor, A<sub>e</sub>';
$ec_lang['ip_pr']='Intenzita závlahy, PR';
$ec_lang['ip_q_lat']='Průtok postranní větví, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Průtok zónou, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Doba chodu (hodiny)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Průsak kanálu';
$ec_lang['cs_main_title']='Bezplatný online kalkulátor průsakové ztráty kanálu a efektivity dopravy vody';
$ec_lang['cs_main_desc']='Průsaková ztráta kanálu a efektivita dopravy vody — metoda přítok–odtok';
$ec_lang['cs_Q_in']='Přítok, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Odtok, Q<sub>out</sub>';
$ec_lang['cs_L']='Délka úseku, L';
$ec_lang['cs_Q_loss']='Rychlost průsakové ztráty, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Kontrola měření';
$ec_lang['cs_pct_loss']='Podíl ztráty';
$ec_lang['cs_Ec']='Efektivita dopravy vody, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Hodnocení účinnosti';
$ec_lang['cs_Vol_day']='Denní ztracený objem';
$ec_lang['cs_Vol_year']='Roční ztracený objem';
$ec_lang['cs_Q_loss_per_L']='Ztráta na jednotku délky, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Hodnota vody';
$ec_lang['cs_lining_cost']='Náklady na zpevnění';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Cílová efektivita dopravy vody po zpevnění; podíl 0–1">Cíl zpevnění, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Plocha zpevnění, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Roční ztracená hodnota';
$ec_lang['cs_annual_value_recovered']='Roční získaná hodnota';
$ec_lang['cs_lining_total_cost']='Celkové náklady na zpevnění';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Prostá doba návratnosti = celkové náklady na zpevnění ÷ roční získaná hodnota">Doba návratnosti <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — zjištěn průsak';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — žádná měřitelná ztráta';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — zkontrolujte měření';
$ec_lang['cs_Ec_good']='Dobrá — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Přijatelná — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Špatná — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='Metoda přítok–odtok odhaduje průsak měřením průtoku na začátku a na konci úseku kanálu: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Efektivita dopravy vody E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Roční objem předpokládá nepřetržitý provoz s plným průtokem; skutečná ztráta je nižší u sezónních kanálů nebo kanálů s částečným průtokem.';
$ec_lang['cs_notes_2_term']='Hodnocení účinnosti';
$ec_lang['cs_notes_2_def']='Typické nezpevněné zemní kanály: E<sub>c</sub> = 60–80 %. Dobře udržované zemní kanály: 75–85 %. Kanály s betonovým opevněním: 90–98 %. Průsakové ztráty nad 30 % přítoku často odůvodňují investici do zpevnění. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Návratnost zpevnění';
$ec_lang['cs_notes_3_def']='Zadejte hodnotu vody a náklady na zpevnění v jakékoli konzistentní měně. Plocha zpevnění = délka úseku × smočený obvod — smočený obvod průřezu kanálu při měřené hloubce proudění (šířka dna plus oba smočené svahy). Roční získaná hodnota předpokládá, že zpevněný kanál trvale dosahuje cílové E<sub>c</sub>. Skutečná doba návratnosti bude delší u sezónních kanálů nebo pokud zpevnění nedosáhne cílové účinnosti.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3. vyd. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='O nás';
$ec_lang['install_main_menu']='Nainstalovat';
$ec_lang['install_main_title']='Nainstalovat EngCalcs';
$ec_lang['install_main_desc']='Přidejte si na zařízení pro offline použití';
$ec_lang['install_intro']='EngCalcs je progresivní webová aplikace (PWA). Po instalaci fungují všechny kalkulačky zcela offline — není potřeba připojení k internetu.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Otevřete libovolnou stránku kalkulačky v Chromu.</li><li>Klepněte na tlačítko <strong>⬇ Instalovat</strong> v horní navigační liště, nebo klepněte na nabídku prohlížeče (⋮) a zvolte <strong>Přidat na plochu</strong>.</li><li>V zobrazené výzvě klepněte na <strong>Instalovat</strong>.</li><li>EngCalcs se objeví na ploše vašeho zařízení a funguje offline.</li>';
$ec_lang['install_now_btn']='⬇ Instalovat nyní';
$ec_lang['install_prompt_unavailable']='Výzva k instalaci není k dispozici — použijte místo toho nabídku prohlížeče.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Otevřete libovolnou stránku kalkulačky v Safari.</li><li>Klepněte na tlačítko <strong>Sdílet</strong> (obdélník se šipkou nahoru).</li><li>Posuňte se dolů a klepněte na <strong>Přidat na plochu</strong>.</li><li>Klepněte na <strong>Přidat</strong>. EngCalcs se objeví na ploše vašeho zařízení.</li>';
$ec_lang['install_ios_note']='V iOS se instalace vždy provádí přes nabídku Sdílet — automatická výzva k instalaci se nezobrazuje.';
$ec_lang['install_desktop_heading']='Počítač (Chrome / Edge)';
$ec_lang['install_desktop_steps_html']='<li>Otevřete libovolnou stránku kalkulačky.</li><li>Klikněte na <strong>ikonu instalace</strong> (⊕ nebo ikonu počítače) v adresním řádku prohlížeče, nebo otevřete nabídku prohlížeče a zvolte <strong>Instalovat EngCalcs…</strong></li><li>Klikněte na <strong>Instalovat</strong>. EngCalcs se otevře jako samostatné okno aplikace.</li>';
$ec_lang['install_firefox_heading']='Firefox a další prohlížeče';
$ec_lang['install_firefox_body']='Firefox neumožňuje instalaci aplikací PWA na počítači. Všechny kalkulačky můžete i tak běžně používat v prohlížeči — po první návštěvě se stránky automaticky uloží do mezipaměti pro použití offline.';
$ec_lang['install_cached_heading']='Co se ukládá do mezipaměti';
$ec_lang['install_cached_body']='Při první instalaci EngCalcs se do vašeho zařízení automaticky uloží všechny stránky kalkulaček i jejich podpůrné soubory (skripty, styly). Poté vše funguje bez připojení k internetu. Vaše volba jazyka se pamatuje z poslední online návštěvy.';
$ec_lang['contact_main_menu']='Kontakt';
$ec_lang['about_main_title']='O kalkulátorech HawsEDC';
$ec_lang['about_main_desc']='Poslání, svobodný software a přispívání';
$ec_lang['about_body_html']='<h3>Poslání</h3><p>Inženýrské Kalkulačky HawsEDC existují, aby sloužily inženýrům a terénním pracovníkům po celém světě — zejména těm, kteří pracují v oblastech s nedostatkem vody, omezenými zdroji nebo nedostatečným zásobením. Tyto nástroje jsou součástí širšího humanitárního poslání: říci každému člověku co nejpraktičtějším a nejúčinnějším způsobem, že je navždy milován a ceněn, že se nemá čeho bát a že nezkazí všechno.</p><p>Kalkulačky jsou prostředkem. Cílem je svět bez utrpení.</p><h3>Svobodná licence s otevřeným zdrojovým kódem</h3><p>Veškerý kód je vydán pod <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 nebo novější</a> — svobodný ve smyslu svobody. Kód můžete za stejných podmínek používat, studovat, upravovat a šířit dál.</p><p>Toto je pozvání, ne cena. Neexistuje placená verze, ani bezplatná verze, kterou by bylo možné později odebrat, ani žádné čekání, než se kód stane vaším. Plná verze, kterou vidíte dnes, je zdarma pro každého, nyní a navždy, k použití i úpravám.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Zdrojový Kód</h3><p>Úplný zdrojový kód je veřejně dostupný na GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Tam si můžete prohlédnout kód, nahlásit problémy nebo forknout repozitář.</p><h3>Příspěvky</h3><p>Veškerá pomoc je vítána. <a href="contact.php">Kontaktujte Toma Hawse</a>.</p><ul><li><strong>Překlady:</strong> Navrhněte lepší znění. Vylepšete nebo přidejte jazyk.</li><li><strong>Hlášení chyb:</strong> Použijte formulář zpětné vazby na libovolné stránce kalkulačky nebo nahlaste problém na GitHub.</li><li><strong>Nové kalkulačky:</strong> Nápady na hydraulicko-inženýrské nástroje sloužící terénním pracovníkům a odborníkům na závlahy jsou zvláště vítány.</li><li><strong>Hosting:</strong> Pokud můžete tyto kalkulačky zrcadlit pro oblast s omezeným připojením, kontaktujte mě prosím.</li></ul><h3>Offline použití</h3><p>Tyto kalkulačky fungují jako <strong>progresivní webová aplikace (PWA)</strong>. Navštivte jakoukoli stránku kalkulačky při připojeném internetu a váš prohlížeč automaticky uloží všechny kalkulačky do mezipaměti. Poté všechny kalkulačky fungují offline — bez potřeby internetu.</p><p>Na Androidu nebo iOS použijte možnost „Přidat na domovskou obrazovku" v prohlížeči a nainstalujte EngCalcs jako aplikaci do svého zařízení. Na počítači hledejte ikonu instalace v adresním řádku prohlížeče.</p><p>Libovolnou kalkulačku můžete také uložit pomocí nabídky „Uložit jako…" ve svém prohlížeči pro jednorázové offline použití.</p><h3>Kontakt</h3><p>Tom Haws — hydraulický inženýr a zakladatel těchto kalkulaček.<br />Použijte formulář zpětné vazby na libovolné stránce kalkulačky nebo přistupte ke zdrojovému kódu na <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Pošlete zprávu Tomu Hawsovi';
$ec_lang['contactYourName']='Vaše jméno:';
$ec_lang['contactYourEmail']='Vaše e-mailová adresa:';
$ec_lang['contactSubject']='Předmět:';
$ec_lang['contact_message']='Zpráva:';
$ec_lang['contactSpamPrefix']='Pět plus jedna se rovná';
$ec_lang['contactSpamPostfix']='(Prosím napište anglicky slovy. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Odeslat zprávu';
$ec_lang['contact_success']='Děkujeme za váš čas věnovaný napsání.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Návrh kamenného skluzu (Robinson)';
$ec_lang['rc_main_title']='Bezplatný online kalkulátor pro návrh kamenného skluzu — Robinson (1998)';
$ec_lang['rc_main_desc']='Dimenzování záhozu kamenného skluzu — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Sklon dna skluzu, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Průtok na jednotku šířky na vtoku skluzu. Pro koryto o šířce dna B s celkovým průtokem Q použijte q_t = Q / B.">Celkový měrný průtok, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Pórovitost záhozu, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Hustota vztažená k vodě. Typický drcený granit nebo čedič ≈ 2,65. Platný rozsah dle Robinsona: 2,54 až 2,82.">Relativní hustota horniny, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Směrodatná odchylka zrnitosti. Rovnoměrné kamení ≈ 1,25. Platný rozsah Robinson: 1,15 až 1,47.">Zrnitostní SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Vzdutí (Hp > yn) je žádoucí — snižuje erozi proti proudu od vtoku. (USDA)">Normální hloubka ve vtokové stoce, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Rovnice 1 (S0 < 0,10) nebo rovnice 2 (0,10–0,40). Platné rozmezí: D50 15–278 mm, S0 0,02–0,40. Mimo rozsah: extrapolováno.">Požadovaná mediánová velikost kamene, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Použitá rovnice';
$ec_lang['rc_sg_check']='Kontrola relativní hustoty';
$ec_lang['rc_SD_check']='Kontrola zrnitostního SD';
$ec_lang['rc_sg_ok']   ='sg v platném rozsahu';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg pod platným rozsahem Robinson';
$ec_lang['rc_sg_low_tip']='Platný rozsah: 2,54–2,82';
$ec_lang['rc_sg_high'] ='sg nad platným rozsahem Robinson';
$ec_lang['rc_sg_high_tip']='Platný rozsah: 2,54–2,82';
$ec_lang['rc_SD_ok']   ='SD v platném rozsahu';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD pod platným rozsahem Robinson';
$ec_lang['rc_SD_low_tip']='Platný rozsah: 1,15–1,47';
$ec_lang['rc_SD_high'] ='SD nad platným rozsahem Robinson';
$ec_lang['rc_SD_high_tip']='Platný rozsah: 1,15–1,47';
$ec_lang['rc_layer']='Tloušťka kamenné vrstvy (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Poloměr oblouku na koruně (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Délka oblouku na koruně';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Nezbytné pro konstrukční podporu kamene skluzu. “Minimální hladina dolní vody vznikající v důsledku odporu výtokového úseku a navazujícího koryta postačuje k zajištění stability záhozu ve výtokovém úseku.” (Robinson)">Délka vývarové desky na výtoku (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Manningova drsnost skluzu, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Část qt protékající póry kamenného záhozu. Zbytek qs teče po povrchu. Výchozí np = 0,45 pro ostrohranný drcený kámen.">Rychlost proudění kamennou vrstvou, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Měrný průtok kamennou vrstvou, q<sub>m</sub>';
$ec_lang['rc_qs']='Povrchový měrný průtok, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Hloubka proudu nad povrchem záhozu, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Vzdutí (Hp > yn) je žádoucí — snižuje erozi proti proudu od vtoku. (USDA)">Vzdutí na vtoku, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Kontrola vzdutí na vtoku';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — vzdutí proti proudu';
$ec_lang['rc_pond_ok_tip']='Vzdutí proti proudu od vtoku skluzu je žádoucí — snižuje erozi proti proudu. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — žádné vzdutí — riziko eroze na vtoku';
$ec_lang['rc_pond_warn_tip']='Bez vzdutí proti proudu od vtoku skluzu; proti proudu může dojít k erozi. (USDA)';
$ec_lang['rc_eq1']='Rovn. 1 (S<sub>0</sub> < 0,10) — mírný sklon';
$ec_lang['rc_eq2']='Rovn. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — strmý sklon';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — pod ověřeným rozsahem Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — nad ověřeným rozsahem Robinson';
$ec_lang['rc_notes_1_term']='Rovnice pro dimenzování kamene';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) vyvinuli dvě empirické rovnice pro mediánovou velikost záhozu D<sub>50</sub> na základě sklonu skluzu a měrného průtoku. Rovnice 1 platí pro mírné svahy (S<sub>0</sub> < 0,10); rovnice 2 platí pro strmé svahy (0,10 ≤ S<sub>0</sub> ≤ 0,40). Obě rovnice vyžadují q<sub>t</sub> v m²/s a vracejí D<sub>50</sub> v mm. Ověřený rozsah je 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Měrný průtok';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> je celkový měrný průtok na koruně skluzu (celkový průtok na jednotku šířky). Pro koryto s šířkou dna B a celkovým průtokem Q lze přibližně uvažovat q<sub>t</sub> ≈ Q / B, nebo jej vypočítat z podmínky kritické hloubky na vtoku skluzu.';
$ec_lang['rc_notes_3_term']='Proudění kamennou vrstvou';
$ec_lang['rc_notes_3_def']='Část celkového průtoku protéká póry kamenného záhozu (průtok vrstvou q<sub>m</sub>); zbývající část teče po povrchu kamene (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). Hloubka proudu d se vypočítá z Manningovy rovnice aplikované na povrchový průtok q<sub>s</sub> s drsností skluzu n. Výchozí pórovitost n<sub>p</sub> = 0,45 je typická pro ostrohranný drcený kámen.';
$ec_lang['rc_notes_5_term']='Platný rozsah velikosti kamene';
$ec_lang['rc_notes_5_def']='Rovnice byly vyvinuty pro rozsah D<sub>50</sub> od 15 mm do 278 mm. Výsledky mimo tento rozsah jsou extrapolované a měly by být použity s dodatečným inženýrským posouzením.';
$ec_lang['rc_notes_6_term']='Výška vývarové desky na výtoku';
$ec_lang['rc_notes_6_def']='Výška horní plochy záhozu ve výtokovém úseku by měla být na úrovni nebo pod úrovní dna dolního koryta. Pokud je výše, zához na výtoku bude nestabilní.';

$ec_lang['rc_notes_7_def']='Pokud je normální hloubka ve vtokové stoce menší než přepadová výška (H<sub>p</sub>) potřebná k převedení q<sub>t</sub>, dochází k omezení průtoku nebo vzdutí proti proudu od vtoku skluzu. To je obecně přijatelné — vzdutí snižuje rychlost a zabraňuje erozi proti proudu. Kontrola: pomocí kalkulátoru přelivu zjistěte H<sub>p</sub> pro dané q<sub>t</sub> a šířku koruny a porovnejte ji s normální hloubkou ve vtokové stoce. Pokud H<sub>p</sub> překračuje normální hloubku, dojde ke vzdutí.';
$ec_lang['rc_notes_4_term']='Literatura';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS také zveřejňuje <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">tabulku Excel</a> založenou na stejné metodě.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Filtr';
$ec_lang['rc_sketch_top_crest_curve'] = 'Oblouk na koruně';
$ec_lang['rc_sketch_outlet_apron']    = 'Vývarová deska';
$ec_lang['rc_sketch_radius']          = 'poloměr';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Závlahový tlak';
$ec_lang['ip_main_title']='Bezplatný online kalkulátor tlaku závlahy a uniformity distribuce';
$ec_lang['ip_main_desc']='Tlak v testovací cestě a odhadovaná uniformita';
$ec_lang['ip_h_supply']='Tlak na vstupu';
$ec_lang['ip_elev_supply']='Nadmořská výška vstupu, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Návrhový průtok emitoru, q<sub>design</sub>';
$ec_lang['ip_h_design']='Návrhový tlak emitoru';
$ec_lang['ip_x']='<span class="ec-help" title="0,5 pro standardní nekompenzované emitory; blízko 0 pro tlakově kompenzované emitory">Exponent výstupního průtoku emitoru, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Testovací cesta';
$ec_lang['ip_group_reach']='Úsek';
$ec_lang['ip_group_upstream']='Proti proudu';
$ec_lang['ip_group_downstream']='Po proudu';
$ec_lang['ip_group_loss']='Ztráta';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Zaškrtnuto: tento úsek je segment testovací postranní větve, připojen jednotlivými emitory. Nezaškrtnuto: tento úsek je hlavní potrubí, pouze předávající průtok postranním větvím mimo testovací cestu.">Postranní <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Postranní řady: emitory v tomto úseku pouze. Hlavní řady: celkový počet emitorů na postranních větvích JINÉ než zde větvící se z tohoto úseku. V úseku přímo v místě odebírání testovací postranní větve se zahrnou také všechny postranní větve dále po hlavním potrubí za tímto odběrem, nebo sdílející stejný spoj (např. postranní větev na opačné straně) — jejich průtok také prochází tímto úsekem.">Emitory <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Nadmořská výška dolního konce úseku. Volitelná v interních řadách (pokud ponecháno prázdné, defaultuje na vodorovně / stejně jako uzel výše). Povinná v poslední řadě: tato hodnota je nadmořská výška posledního emitoru, která přímo určuje požadovaný vstupní tlak.">DS Nadm. výška <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Nadmořská výška posledního emitoru (poslední řada) byla ponechána prázdná a defaultovala na vodorovně — zadejte ji pro přesný výsledek';
$ec_lang['ip_flow']='Průtok';
$ec_lang['ip_press']='Tlak';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Celková ztráta v úseku, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Nízký/záporný tlak — kontrolujte podmínky pod atmosférickým tlakem';
$ec_lang['ip_pressure_warn_short']='Nízký';
$ec_lang['ip_pressure_high']='Místa s vysokým tlakem vyžadují redukci tlaku';
$ec_lang['ip_pressure_high_short']='Vysoký';
$ec_lang['ip_max_head']='Max. dov. tlak potrubí';
$ec_lang['ip_max_head_tip']='Řady, jejichž tlak překročí tuto hodnotu, jsou označeny. Ponechte prázdné pro vynechání kontroly vysokého tlaku.';
$ec_lang['ip_h_far']='Tlak posledního emitoru';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Průtok vstupující modelovanou testovací cestu pouze, ne celou zónu/systém — viz Q_zone v Návrhu aplikace níže pro systémový celkem.">Průtok vstupu testovací cesty, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Průtok posledního emitoru, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Průtok průměrného emitoru (testovací postranní větev), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="Jak moc vyšší (nebo nižší) si myslíte, že běží typická/průměrná postranní větev ve srovnání s touto testovací postranní větví. Testovací postranní větev je úmyslně nejhorší případ, takže její vlastní průměr je zkreslený dolní odhad pro skutečný průměr — ponecháno na 0, kontrola uniformity a čísla návrhu aplikace níže používají vlastní průměr testovací postranní větve jako je.">Odh. Δtlak, průměr vs. testovací postranní větev <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral přehodnocený při tlaku každé řady postranní větve plus zadaný rozdíl tlaku výše — pokus opravit, že testovací postranní větev je nejhorší případ, ne reprezentativní. Podává jak kontrolu uniformity, tak čísla návrhu aplikace níže.">Odh. průtok průměrného emitoru v poli, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Vypočítaný průtok posledního emitoru dělený odhadovaným průtokem průměrného emitoru v poli — stejný tvar jako učebnicová Uniformita distribuce nízké čtvrtiny (průměr nízké skupiny ÷ průměr populace), ale vypočítaná z malého modelovaného vzorku a uživatelsky odhadnuté opravy, ne ze statistického vzorku celého pole. Hodnoty na 1 nebo výše jsou možné a nejsou chybou: znamená to, že poslední emitor není nejnižší bod relativně k odhadovanému průměru v poli (např. příznivý svah dolů, nebo odhadnutý rozdíl tlaku výše je příliš malý).">Kontrola uniformity, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Tlak na testovacím emitoru ≥ tlak na přívodu. Toto pravděpodobně není emitor s nejhorším případem, nebo lze potrubí zmenšit.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Toto se liší od naší aproximace standardní míry uniformity.">Průtok posledního emitoru ÷ návrhový průtok, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Žádné řešení: požadovaný vstupní tlak překračuje zadaný vstupní tlak. Zvyšte vstupní tlak, snižte poptávku, nebo použijte větší potrubí.';
$ec_lang['ip_notes_1_def']='Odhadne tlak na posledním (nejdálejším) emitoru, poté postupuje po energetické čáře zpět k vstupu, úsek po úseku, přidávaje tření a místní ztráty po cestě. Nadmořská výška a rychlostní hlava jsou na každém uzlu odečítány tak, aby hlásily skutečný tlak tam. Odhadnutý tlak na konci je korigován (bisekce) až do té doby, než vypočítaný požadovaný vstupní tlak odpovídá zadanému vstupnímu tlaku — stejný problém uzavřené smyčky řešený řešičem průtoku potrubí na kalkulátoru Průtoku v Manningovém Potrubí, rozšířený na větvící se síť.';
$ec_lang['ip_notes_2_term']='Hlavní vs. Postranní Úseky';
$ec_lang['ip_notes_2_def']='Každý řádek je jeden úsek podél jedné hydraulicky nejhorší cesty (testovací cesty) od vstupu k poslednímu emitoru. Hlavní úsek pouze předává průtok postranním větvím mimo testovací cestu, takže jeho odběr je jednoduché násobení (návrhový průtok × celkový počet emitorů v úseku) — žádná citlivost na místní tlak. Hlavní potrubí je sdílený kmenový svod, takže úsek přímo v místě odebírání testovací postranní větve musí zahrnout nejen postranní větve mezi svými koncovými body, ale také všechny postranní větve stále dále po hlavním potrubí za tímto odebíráním, nebo sdílející stejný spoj (např. postranní větev na opačné straně) — jejich průtok cestuje stejným úsekem před rozštěpením, ať se v této tabulce objevují nebo ne. Postranní úsek je segment testovací postranní větve: výtok emitoru je vypočítán ze skutečného místního tlaku přes q = k·H<sup>x</sup>, a ztráta třením je snížena Christiansenův faktor F(n) aby se zohlednil pokles průtoku jak každý emitor v úseku odvádí vodu.';
$ec_lang['ip_notes_3_term']='Omezení';
$ec_lang['ip_notes_3_def']='Modeluje jeden pevný tlak na přívodu (žádná křivka čerpadla), pouze jednu testovací cestu (ne celé pole) a dvouparametrickou křivku emitoru (nastavte exponent blízko 0 pro aproximaci emitoru s kompenzací tlaku). Jsou hlášeny dva různé poměry uniformity, úmyslně oddělené: q<sub>last</sub>/q<sub>avg,field</sub> je aproximace standardní Uniformity distribuce nízké čtvrtiny (průměr nízké skupiny ÷ průměr populace); ale je vypočítána z malého modelovaného vzorku a uživatelsky odhadnuté opravy místo standardního statistického vzorku celého pole. Testovací postranní větev je navíc úmyslně předpokládaný nejhorší případ, takže její surový, neopravený průměr by podhodnocoval skutečný průměr pole a uniformita by vypadala lépe, než ve skutečnosti je; vstup Δtlaku existuje právě proto, aby toto zkreslení vyvážil. Hodnoty uniformity na 1 nebo výše jsou stále možné: znamenají pouze to, že tlak posledního emitoru je na úrovni odhadovaného průměru pole nebo vyšší, takže bod nejnižšího tlaku je u jiného emitoru. To může být proto, že poslední emitor leží v nižší nadmořské výšce, nebo proto, že odhad Δtlaku je příliš malý. q<sub>last</sub>/q<sub>design</sub> je odlišná, ne-uniformitní kontrola oproti jmenovitému průtoku výrobce — užitečná pro odhalení celkově přetlakovaného nebo nedotlakovaného systému, ale je to samostatná kontrola, kterou je třeba číst spolu s číslem uniformity, protože návrhový/jmenovitý průtok nezávisí na skutečném průměrném provozním tlaku systému.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. Standardy ASAE/ASABE pro návrh mikroirrigace používají stejný přístup ztráty třením vícečetného výstupu.';
$ec_lang['ip_notes_5_term']='Návrh aplikace';
$ec_lang['ip_notes_5_def']='Dávka aplikace a průtok systému/zóny používá odhadovaný průtok průměrného emitoru v poli (q<sub>avg,field</sub> — vlastní průměr testovací postranní větve, korigovaný zadaným odhadem Δtlaku), ne odhadovanou sazbu: PR = q<sub>avg,field</sub> / A<sub>e</sub>, podávaný korigovanou modelovanou hodnotou. Rozteče a počty postranních větví/emitorů v systému jsou oddělené vstupy zde, protože testovací cesta modeluje pouze jednu nejhorší větev, ne každou postranní větev v poli.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Větvená potrubní síť';
$ec_lang['bpn_main_title']='Bezplatný online kalkulátor tlaku ve větvené potrubní síti (bez okruhů)';
$ec_lang['bpn_main_desc']='Průtok a tlak ve větvené (stromové) potrubní síti';
$ec_lang['bpn_h_source_tip']='Statická dodávková výška: výška zdroje při nulovém průtoku. Hladina vody v nádrži nebo zásobníku nad úrovní zdroje, nebo uzavírací výška čerpadla. Přidáním dodávkových bodů 2 a 3 lze definovat čerpadlo nebo proměnnou dodávkovou křivku; nástroj čte výšku při návrhovém průtoku.';
$ec_lang['bpn_elev_source']='Nadmořská výška zdroje';
$ec_lang['bpn_q_total']='Celkový průtok';
$ec_lang['bpn_q_total_tip']='Celkový průtok opouštějící zdroj (součet všech odběrů v síti).';
$ec_lang['bpn_p_min']='Nejnižší tlak';
$ec_lang['bpn_p_min_tip']='Nejnižší dolní tlak kdekoli v síti; kritické místo dodávky.';
$ec_lang['bpn_method']='Metoda tření';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Potrubní řady';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Název této potrubní řady. Ostatní řady na ni odkazují ve sloupci Horní ID.';
$ec_lang['bpn_upstream']='Horní ID';
$ec_lang['bpn_upstream_tip']='ID řady, která napájí tuto řadu. Ponechte prázdné pro navázání přímo na řadu výše (prostá sériová trasa). Zadejte zde ID pro odbočení z jiné řady.';
$ec_lang['bpn_roughness_tip']='Drsnost potrubí pro zvolenou metodu tření: Manning n, Hazen-Williams C, nebo výška drsnosti Darcy-Weisbach e (délka). Typické hladké plastové potrubí: n přibližně 0,009, C přibližně 150, e přibližně 0,0015 mm.';
$ec_lang['bpn_demand']='Odběr';
$ec_lang['bpn_demand_tip']='Pevný průtok dodávaný na dolním konci této řady. Ponechte prázdné pro řadu, která pouze vede průtok dál.';
$ec_lang['bpn_demand_mult']='Násobitel odběru';
$ec_lang['bpn_demand_mult_tip']='Škáluje odběr všech řad najednou, pro výpočet špičkové hodiny nebo budoucího růstu spotřeby. Použijte hodnotu 1 pro zadané odběry beze změny.';
$ec_lang['bpn_elev_down']='DS nadm. výška';
$ec_lang['bpn_q_line']='Průtok řady';
$ec_lang['bpn_q_line_tip']='Celkový průtok vedený touto řadou: její vlastní odběr plus všechny dolní odběry, které napájí.';
$ec_lang['bpn_p_down']='DS tlak';
$ec_lang['bpn_p_down_tip']='Manometrický tlak (tlaková výška) v dolním uzlu této řady. Záporná hodnota (označena) znamená podatmosférický tlak; zkontrolujte návrh.';
$ec_lang['bpn_sketch_heading']='Schéma sítě';
$ec_lang['bpn_show_length']='Délka';
$ec_lang['bpn_show_diameter']='Průměr';
$ec_lang['bpn_show_q']='Průtok';
$ec_lang['bpn_show_p']='Tlak';
$ec_lang['bpn_source_label']='Zdroj';
$ec_lang['bpn_topology_warn']='Zkontrolujte sloupec Horní ID: řada odkazuje na neznámé ID, odkazuje sama na sebe, nebo tvoří okruh, takže část sítě není připojena ke zdroji. Tyto řady zůstávají nevyřešeny.';
$ec_lang['bpn_topology_warn_short']='Síť';
$ec_lang['bpn_pressure_warn']='Nízký/záporný tlak; zkontrolujte podatmosférické podmínky';
$ec_lang['bpn_pressure_warn_short']='Nízký';
$ec_lang['bpn_notes_1_term']='Ve výchozím stavu sériové zapojení, větvení jako výjimka';
$ec_lang['bpn_notes_1_def']='Ponechte Horní ID prázdné a řada naváže na řadu výše; prostá sériová trasa. Zadejte ID horní řady pro odbočení z ní. Takže: ve výchozím stavu sériové zapojení, strom podle potřeby.';
$ec_lang['bpn_notes_2_term']='Pouze větvené sítě, bez okruhů';
$ec_lang['bpn_notes_2_def']='Každá řada má právě jednu horní řadu (strom). Tento nástroj neřeší okruhové sítě; ty vyžadují iterační metody (EPANET nebo podobné). Vynechání okruhů udržuje výpočet jednoduchý a přesný.';
$ec_lang['bpn_notes_3_term']='Žádné aktivní tlakové regulátory';
$ec_lang['bpn_notes_3_def']='Lze přidat pevný ventil s místní ztrátou (hodnota k), ale ne redukční nebo udržovací tlakové ventily (PRV/PSV). Jejich otevřený/zavřený stav závisí na průtoku a tlaku, což by vyžadovalo iteraci.';


$ec_lang['bpn_supply2_q']='Dodávkový průtok 2';
$ec_lang['bpn_supply2_h']='Dodávková výška 2';
$ec_lang['bpn_supply3_q']='Dodávkový průtok 3';
$ec_lang['bpn_supply3_h']='Dodávková výška 3';
$ec_lang['bpn_supply_pt_tip']='Volitelné body dodávkové křivky 2 a 3. Zadejte průtok a výšku pro každý bod pro modelování čerpadla nebo jakéhokoli zdroje, jehož výška klesá s rostoucí dodávkou; nástroj čte výšku při návrhovém průtoku. Bod 1 výše je statická výška při nulovém průtoku. Body 2 a 3 ponechte prázdné pro konstantní výšku nádrže.';
$ec_lang['bpn_h_supply']='Dodávková výška';
$ec_lang['bpn_h_supply_tip']='Výška zdroje při návrhovém průtoku, čtená z dodávkové křivky. Rovná se zadané výšce zdroje, pokud je křivka plochá (nádrž).';
$ec_lang['bpn_show_elevation']='Nadmořská výška';
$ec_lang['bpn_supply1_h']='Statická dodávková výška';
$ec_lang['lpn_main_menu']='Vodovodní síť';
$ec_lang['lpn_main_title']='Bezplatný online kalkulátor vodovodní sítě s řešičem EPANET';
$ec_lang['lpn_main_desc']='Analýza vodovodní sítě: Nakreslete okruhovou potrubní síť nebo importujte soubory EPANET';
$ec_lang['lpn_title_units']='Jednotky {units}';
$ec_lang['lpn_tool_select']='Výběr';
$ec_lang['lpn_tool_add_junction']='Uzel';
$ec_lang['lpn_tool_add_reservoir']='Zdroj';
$ec_lang['lpn_tool_add_pipe']='Potrubí';
$ec_lang['lpn_tool_add_pump']='Čerpadlo';
$ec_lang['lpn_tool_add_text']='Text';
$ec_lang['lpn_tool_delete']='Smazat';
$ec_lang['lpn_tool_zoom_extent']='Zobrazit vše';
$ec_lang['lpn_new_text']='Text';
$ec_lang['lpn_field_elev']='Nadmořská výška';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='Úroveň terénu nebo potrubí v tomto uzlu. Měřte ji od libovolné nuly, pokud ji použijete stejně pro všechny uzly.';
// A reservoir carries an elevation AND a head, so it doubles as a tank (Tom, 2026-07-30). Leaving
// the head blank means "the water surface is at the reservoir's own elevation"; the placeholder
// string is what shows in that empty box.
$ec_lang['lpn_field_head']='Tlaková výška';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Hladina vody u zdroje, vyjádřená jako výška, nikoli jako tlak. Ponechte prázdné, pokud má být hladina vody na nadmořské výšce zdroje.';
$ec_lang['lpn_close']='Zavřít';
$ec_lang['lpn_empty_hint']='Začněte přidáním podkladového obrázku nebo zdroje z panelu nástrojů, nebo otevřete Soubor, Nový projekt a začněte od příkladu.';
$ec_lang['lpn_tool_undo']='Zpět';
$ec_lang['lpn_confirm_example']='Tímto se příklad přidá do sítě, kterou už máte. Pokračovat?';
$ec_lang['lpn_field_diameter']='Průměr';
$ec_lang['lpn_demand_tip']='Průtok odebíraný ze sítě v tomto uzlu. Pro průtok přiváděný do sítě zde zadejte záporné číslo.';
$ec_lang['lpn_units_length']='Délka a souřadnice mapy';
$ec_lang['lpn_units_elevhead']='Nadmořská výška a tlaková výška';
$ec_lang['lpn_units_pressure']='Tlak';
$ec_lang['lpn_units_flow']='Průtok';
$ec_lang['lpn_units_velocity']='Rychlost';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Gradient ztráty tlakové výšky';
$ec_lang['lpn_result_gradient_tip']='Ztráta tlakové výšky dělená délkou potrubí. Použijte ji k porovnání potrubí různých délek podle jednoho návrhového limitu.';
$ec_lang['lpn_result_head']='Tlaková výška';
$ec_lang['lpn_result_head_tip']='Energie vody v tomto uzlu, vyjádřená jako výška vodního sloupce. Je to výška, nikoli tlak.';
$ec_lang['lpn_result_pressure']='Tlak';
$ec_lang['lpn_result_flow']='Průtok';
$ec_lang['lpn_result_velocity']='Rychlost';
$ec_lang['lpn_result_headloss']='Ztráta tlakové výšky';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
$ec_lang['lpn_settings_restore_tip']='Obnoví pouze nastavení tohoto projektu. Vaše kresba a ostatní projekty se nemění. Chcete-li si oblíbené nastavení uložit pro pozdější použití, uložte soubor projektu, který obsahuje jen nastavení.';
$ec_lang['lpn_reset_all_tip']='Smaže každý projekt, každý podkladový obrázek, všechna nastavení i vaši volbu jednotek a znovu načte stránku přesně tak, jak ji vidí návštěvník poprvé. Toto je jediné obnovení, které vymaže úplně vše.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Tento kalkulátor ukládá jednotky a zadané hodnoty projektu tak, jak byly zadány, ale dříve převáděl čísla pro uložení na jednotky SI. Tento projekt byl uložen před touto změnou, takže jeho čísla byla uložena v SI. Převést je naposledy na aktuální jednotky? Abyste mohli posoudit, zde jsou některé průměry, které by byly převedeny, s hodnotami před převodem a po něm:';
$ec_lang['lpn_v2_restore_yes']='Převést';
$ec_lang['lpn_v2_restore_never']='Ne. Už se neptat.';
$ec_lang['lpn_v2_restore_no']='Zavřít, abych si nejdřív zkontroloval aktuální jednotky';
$ec_lang['lpn_storage_too_new']='Tento projekt byl uložen novější verzí stránky, takže jej zde nelze otevřít.';
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
$ec_lang['lpn_tool_file']='Soubor';
$ec_lang['lpn_menu_edit']='Úpravy';
$ec_lang['lpn_menu_insert']='Vložit';
$ec_lang['lpn_menu_view']='Zobrazení';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
$ec_lang['lpn_menu_settings']='Nastavení';
$ec_lang['lpn_menu_help']='Nápověda';
$ec_lang['lpn_help_walkthroughs']='Návody';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Smazat síť';
$ec_lang['lpn_confirm_delete_network']='Smazat všechny uzly, potrubí a textové popisky v tomto projektu? Podkladový obrázek, název projektu a nastavení zůstanou zachovány. Tuto akci nelze vrátit zpět.';
$ec_lang['lpn_view_units']='Jednotky';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Uložit vše';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Projekt{n}';
$ec_lang['lpn_project_copy_suffix']='(kopie)';
$ec_lang['lpn_project_rename']='Přejmenovat';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Nový projekt…';
// File > New project's submenu (Task 264). `lpn_tool_example` ("Draw example network") was RETIRED
// with the toolbar button of that name -- an example is a whole network, so it starts a project
// rather than being drawn into the one you are in.
$ec_lang['lpn_new_blank_us']='Prázdný projekt, americké jednotky (gpm)';
$ec_lang['lpn_new_blank_si']='Prázdný projekt, jednotky SI (l/s)';
$ec_lang['lpn_new_from_examples']='Z příkladů';
// The flow unit is IN the label, not left implied by "US"/"SI": gpm and l/s are what a water
// engineer recognises at a glance, and this is the moment the choice is being made.
$ec_lang['lpn_new_example_us']='Základní síť, americké jednotky (gpm)';
$ec_lang['lpn_new_example_si']='Základní síť, jednotky SI (l/s)';
$ec_lang['lpn_file_open']='Otevřít…';
$ec_lang['lpn_file_save']='Uložit';
$ec_lang['lpn_file_saveas']='Uložit jako…';
$ec_lang['lpn_file_revert']='Vrátit k uloženému';
$ec_lang['lpn_file_close']='Zavřít';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Nedávné soubory';
$ec_lang['lpn_recent_tip']='Znovu otevřít {file}, aniž byste jej museli hledat v počítači.';
$ec_lang['lpn_recent_denied']='Nebylo uděleno oprávnění k otevření tohoto souboru, takže nebyl otevřen.';
$ec_lang['lpn_recent_gone']='Nepodařilo se otevřít {file}. Soubor mohl být přesunut, přejmenován nebo smazán, proto byl odebrán ze seznamu nedávných.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Nový projekt';
$ec_lang['lpn_tab_all']='Všechny projekty';
$ec_lang['lpn_tab_menu']='Nabídka projektu';
$ec_lang['lpn_tab_duplicate']='Duplikovat';
$ec_lang['lpn_tab_move_left']='Přesunout doleva';
$ec_lang['lpn_tab_move_right']='Přesunout doprava';
$ec_lang['lpn_tab_unsaved']='Neuloženo do souboru';
$ec_lang['lpn_import_bad_file']='Tento soubor se nepodařilo přečíst jako projekt uložený z této stránky.';
$ec_lang['lpn_import_no_room']='V úložišti prohlížeče není dost místa pro přidání tohoto projektu. Smažte projekt, který už nepotřebujete, a zkuste to znovu.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of element IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='OK';
$ec_lang['lpn_file_import_inp']='Importovat soubor EPANET…';
$ec_lang['lpn_file_import_inp_tip']='Načte síť ze souboru EPANET, ať už jde o textový soubor .inp, nebo soubor .net, který ukládá EPANET, a uloží ji v tomto prohlížeči jako nový projekt. Tato stránka neumí zapsat soubor EPANET zpět, proto svou práci uchovejte pomocí Soubor, Uložit jako.';
$ec_lang['lpn_inp_bad_file']='Tento soubor se nepodařilo přečíst jako soubor sítě EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Vypadá to na soubor .net z programu EPANET, ale tato stránka jej nedokázala přečíst. Otevřete jej v programu EPANET a pomocí příkazu Soubor, Export, Síť jej tam uložte jako soubor .inp, a poté tento soubor importujte.';
$ec_lang['lpn_inp_report_heading']='Importováno {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} uzlů a zdrojů, {links} potrubí a čerpadel, v jednotkách {units}.';
$ec_lang['lpn_inp_report_clean']='Vše ze souboru bylo přeneseno. Nic nebylo vynecháno.';
$ec_lang['lpn_inp_report_lead']='Tato stránka nepodporuje vše, co umí EPANET. Zde je přehled toho, co se při importu změnilo:';
$ec_lang['lpn_inp_drop_headloss']='Tento soubor nepoužívá vzorec Hazen-Williams. Tato stránka počítá podle Hazen-Williams, proto byla čísla drsnosti potrubí zachována přesně tak, jak byla zapsána, ale výsledky zde se nebudou shodovat s výsledky v programu EPANET.';
$ec_lang['lpn_inp_drop_tanks']='Akumulační nádrže byly vynechány. Tato stránka má zdroje, které udržují jednu pevnou hladinu vody. Akumulační nádrž pevnou hladinu neudržuje, proto není zdrojem.';
$ec_lang['lpn_inp_drop_tank_links']='Toto potrubí bylo vynecháno, protože se připojuje k nádrži, která byla vynechána.';
$ec_lang['lpn_inp_drop_tcv']='Tyto škrticí regulační ventily byly převedeny jako velmi krátké potrubí se stejnou místní ztrátou. Voda se chová stejně, ale prvek to není stejný.';
$ec_lang['lpn_inp_drop_valve']='Tyto ventily regulují tlak nebo průtok, a tato stránka takový prvek nemá. Byly převedeny jako otevřené potrubí, takže síť zůstává propojená, ale už ji nic neřídí.';
$ec_lang['lpn_inp_drop_cv']='V programu EPANET toto potrubí propouští vodu pouze jedním směrem. Bylo převedeno jako běžné potrubí, takže voda jím nyní může proudit oběma směry.';
$ec_lang['lpn_inp_drop_demands']='Tyto uzly měly více než jeden odběr. Odběry byly sečteny do jediného odběru, který tato stránka uchovává.';
$ec_lang['lpn_inp_drop_patterns']='Vzorce odběru v čase byly vynechány. Tato stránka řeší jeden okamžik, takže každý odběr je číslo zapsané v souboru.';
$ec_lang['lpn_inp_drop_emitters']='Tyto uzly mají součinitel postřikovače nebo úniku. Byl zachován a je zahrnut do výpočtu, ale na této stránce zatím není možné jej zobrazit ani změnit.';
$ec_lang['lpn_inp_drop_curve_long']='Tato křivka čerpadla měla více než tři body. Byly zachovány její nejnižší, střední a nejvyšší bod, protože tato stránka proloží křivku nejvýše třemi body.';
$ec_lang['lpn_inp_drop_curve_missing']='Toto čerpadlo odkazuje na křivku, která v souboru není. Bylo převedeno bez křivky, takže nepřidává žádnou tlakovou výšku.';
$ec_lang['lpn_inp_drop_pump_other']='Toto čerpadlo je popsáno výkonem, otáčkami nebo harmonogramem místo křivky. Bylo převedeno bez křivky, takže nepřidává žádnou tlakovou výšku.';
$ec_lang['lpn_inp_drop_setting']='Toto potrubí, čerpadla a ventily nesou nastavení, které tato stránka neumí uchovat. Byly převedeny v otevřeném stavu.';
$ec_lang['lpn_inp_drop_controls']='Ovládací prvky a pravidla byly vynechány. Každé potrubí, čerpadlo a ventil bylo převedeno ve stavu zapsaném v souboru a tento stav se nemění.';
$ec_lang['lpn_inp_drop_eps']='Tento soubor popisuje simulaci probíhající po určité období. Tato stránka řeší jeden okamžik, takže byly převedeny pouze počáteční podmínky.';
$ec_lang['lpn_inp_drop_quality']='Nastavení kvality vody, chemických reakcí a energie čerpadel byla vynechána. Tato stránka řeší pouze průtok a tlak.';
$ec_lang['lpn_inp_drop_backdrop']='Tento soubor odkazuje na podkladový obrázek, ale samotný obrázek neobsahuje. Přidejte jej sami pomocí Soubor, Podkladový obrázek, Přidat obrázek.';
$ec_lang['lpn_inp_drop_dangling']='Toto potrubí odkazuje na uzel, který v souboru není, proto bylo vynecháno.';
$ec_lang['lpn_inp_drop_units']='Jednotky průtoku v tomto souboru nebyly rozpoznány, proto byly předpokládány galony za minutu. Než výsledky použijete, zkontrolujte každé číslo.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='Otevřeno {name} ze souboru a přidáno do tohoto prohlížeče jako nový projekt.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Soubor projektu';
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
$ec_lang['lpn_file_upload_explain']='Tento prohlížeč se neumí připojit k souboru, takže otevření souboru zde je ve skutečnosti nahrání: projekt se zkopíruje do tohoto prohlížeče a jediný způsob, jak uložit vaši práci zpět do souboru, je přepsat jej pomocí Soubor, Uložit jako.';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='Uloží do připojeného souboru.';
$ec_lang['lpn_file_saveas_tip']='Vyberte soubor, do kterého se má uložit. Tento projekt se k danému souboru připojí a Uložit do něj od té chvíle zapisuje.';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
$ec_lang['lpn_file_saveas_tip_download']='Ukládá pomocí nastavení stahování vašeho prohlížeče. Tento prohlížeč se neumí připojit k souboru, proto je Uložit zakázáno a dostupné je pouze Uložit jako. Pokud v prohlížeči zapnete nastavení „Zeptat se, kam uložit každý soubor“, můžete vybrat původní soubor a přepsat jej.';
$ec_lang['lpn_status_uploaded']='Soubor projektu byl nahrán. Spojení s ním nelze udržet, proto je jediný způsob, jak do něj uložit, použít Soubor, Uložit jako.';
$ec_lang['lpn_status_downloaded']='Staženo {file}. Tento prohlížeč se neumí připojit k souboru, proto tento projekt zůstává označen jako neuložený do souboru.';
$ec_lang['lpn_status_file_opened']='Otevřeno {file}.';
$ec_lang['lpn_status_already_open']='Tento soubor je zde už otevřen jako {name}, proto se na něj přepnulo, místo aby se otevřela druhá kopie.';
$ec_lang['lpn_status_already_open_dirty']='Tento soubor je zde už otevřen jako {name}, se změnami, které do něj nebyly uloženy. Přepnulo se na něj, místo aby se otevřela druhá kopie. Pokud chcete místo toho verzi z disku, použijte Soubor, Vrátit k uloženému.';
$ec_lang['lpn_status_saved']='Uloženo {file}.';
$ec_lang['lpn_status_reverted']='Znovu načteno {file} z disku.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Uložit vaše změny do {name} před zavřením?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} je uchováno pouze v tomto prohlížeči. Pokud jej zavřete bez uložení do souboru, nenávratně o něj přijdete.';
$ec_lang['lpn_close_discard']='Zavřít bez uložení';
$ec_lang['lpn_cancel']='Zrušit';
$ec_lang['lpn_revert_confirm']='Zahodit provedené změny a znovu načíst {file} z disku?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Tento projekt pochází ze souboru {file}, ale spojení s tímto souborem bylo ztraceno. Vyberte soubor znovu, abyste se k němu připojili.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Do souboru se nepodařilo zapsat. Mohl být přesunut nebo přejmenován, nebo mohlo být odebráno oprávnění. Vaše práce je stále uložena v tomto prohlížeči.';
$ec_lang['lpn_file_changed_elsewhere']='Někdo jiný uložil do tohoto souboru poté, co jste jej otevřeli, takže uložení nyní by přepsalo jeho práci. Pomocí Soubor, Uložit jako uchovejte své změny ve vlastním souboru, nebo pomocí Soubor, Vrátit k uloženému zahoďte své změny a načtěte jeho verzi.';
// Project locks (Task 195 Phase 2) -- who is editing a shared project file right now. {name} is a
// person as they chose to be known ("Dave T."), never a login; word order is the translator's to
// choose. A lock never expires on its own, so none of these may suggest waiting will free it.
// Initials, and said to be public: whoever opens the same file sees this name, including outside the
// office (Tom, 2026-08-03 -- "your friendly name may need to be a cryptic name"). Asking for initials
// rather than a name makes the safe answer the obvious one.
// Corrected 2026-08-05 to match lpn_file_training_3, which Task 211 fixed and this string missed: the
// name is never written into the project file, so "anyone you send the file to" was false here too.
$ec_lang['lpn_lock_prompt_name']='Co mají kolegové vidět, když máte tento projekt otevřený? Ideální jsou vaše iniciály. Kdokoli, kdo otevře stejný soubor, to uvidí, proto nepoužívejte nic soukromého.';
// The stand-in when someone locked a project before giving a name. Reads in place of {name}
// everywhere above, so it has to work mid-sentence.
$ec_lang['lpn_lock_somebody']='Někdo jiný';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} má tento soubor otevřený.';
$ec_lang['lpn_lock_open_readonly']='Otevřít jen pro čtení';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_open_copy']='Vytvořit kopii';
$ec_lang['lpn_lock_break']='Převzít zámek souboru';
$ec_lang['lpn_lock_open_heading_times']='{name} má tento soubor otevřený; poslední úprava byla před {x}, {y} po posledním uložení.';
$ec_lang['lpn_lock_open_heading_unsaved']='{name} má tento soubor otevřený; poslední úprava byla před {x} a zatím nic z ní nebylo do tohoto souboru uloženo.';
$ec_lang['lpn_lock_open_heading_saved']='{name} má tento soubor otevřený; poslední úprava byla před {x} a práce už je uložena do souboru.';
$ec_lang['lpn_lock_open_heading_seen']='{name} má tento soubor otevřený, ale soubor zatím nebyl upraven. Poslední spojení bylo před {x}.';
$ec_lang['lpn_lock_open_choices']='Vaše možnosti: (1) Zrušit a v případě potřeby požádat danou osobu, aby soubor otevřela, pokud je to nutné, a řádně jej zavřela (zavření prohlížeče projekt nezavírá), (2) otevřít jej jen pro čtení, nebo (3) pokud nic jiného nepomůže, můžete zrušit zámek souboru. Neuložená práce se neztratí, ale nebude možné uložit přes vaše změny a někdo bude muset obě verze ručně sloučit.';
$ec_lang['lpn_ago_seconds']='{n} sekundami';
$ec_lang['lpn_ago_minutes']='{n} minutami';
$ec_lang['lpn_ago_hours']='{n} hodinami';
$ec_lang['lpn_ago_days']='{n} dny';
$ec_lang['lpn_ago_unknown']='neznámou dobou';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Jen pro čtení: {name} má tento soubor otevřený. Zde můžete měnit cokoli chcete, ale nemůžete ukládat. Použijte Soubor, Uložit jako a uložte do jiného souboru.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Pozor: nepodařilo se spojit se serverem a zkontrolovat nebo vytvořit zámek tohoto projektu, takže nic nebrání kolegovi upravovat stejný soubor současně. Jakmile začne zamykání znovu fungovat, budete o tom informováni.';
$ec_lang['lpn_lock_storage_error']='Pozor: tento web nemůže ukládat záznamy o zámcích, takže nic nebrání kolegovi upravovat stejný soubor současně. Jde o chybu nastavení serveru, kterou zde nelze opravit — složka pro zámky není zapisovatelná pro webový server.';
$ec_lang['lpn_lock_full_error']='Pozor: tomuto webu došlo místo pro záznam o tom, kdo má který projekt otevřený, takže nic nebrání kolegovi upravovat stejný soubor současně. Jde o chybu nastavení serveru, kterou zde nelze opravit.';
$ec_lang['lpn_lock_not_asked']='Pro tento projekt neběží zamykání, takže nic nebrání kolegovi upravovat stejný soubor současně. Tento prohlížeč pro vás zatím nemá zaznamenané jméno, nebo projekt nemá identifikátor — uložení projektu do souboru nastaví obojí.';
$ec_lang['lpn_lock_restored']='Zamykání znovu funguje a tento soubor je nyní váš, můžete do něj ukládat.';
$ec_lang['lpn_lock_dismiss']='Skrýt tuto zprávu';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Váš projekt bude uložen do souboru v tomto počítači. Ukládá se jen tehdy, když o to požádáte, a jindy vůbec, takže se do souboru nic nezapisuje bez vašeho vědomí.';
$ec_lang['lpn_file_training_2']='Aby dva lidé nikdy neupravovali jeden soubor současně, tento web sleduje, kdo jej má otevřený. Pokud jej už někdo má otevřený, přesto jej můžete otevřít a prohlédnout, nebo si ponechat vlastní kopii.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='Při prvním uložení se váš prohlížeč zeptá, zda tento web smí soubor upravovat. Tuto otázku klade prohlížeč, ne my, a teprve souhlas umožní Uložit zapsat vaši práci zpět. Obvykle se ptá jen jednou na soubor.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_3']='Zadejte krátké jméno, podle kterého vás kolegové poznají. Ideální jsou vaše iniciály. Kdokoli, kdo otevře stejný soubor, jej uvidí, proto nepoužívejte nic soukromého.';
$ec_lang['lpn_file_training_name']='Vaše iniciály';
$ec_lang['lpn_file_training_continue']='Pokračovat';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Vybrat soubor znovu';
$ec_lang['lpn_file_reconnect']='Znovu se připojit k tomuto souboru';
$ec_lang['lpn_file_reconnect_alert']='Tento projekt pochází ze souboru {file}. Váš prohlížeč znovu potřebuje vaše svolení, než do něj bude moci zapisovat. Připojte se znovu níže.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Jde o stejný soubor, který má otevřený někdo jiný, proto jej nelze přepsat. Vyberte jiný soubor nebo jiný název.';
$ec_lang['lpn_saveas_overwrites_project']='Tento soubor už obsahuje jiný projekt, {name}. Uložením zde jej zcela nahradíte. Pokračovat?';
$ec_lang['lpn_saveas_overwrites_newer']='Tento soubor se od chvíle, kdy jste jej naposledy viděli, změnil, takže do něj téměř jistě uložil někdo jiný. Uložením zde nahradíte cizí verzi svou vlastní. Pokračovat?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Název tohoto projektu';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='Zavřeno {closed}. Nyní zobrazeno {opened}.';
$ec_lang['lpn_status_closed_empty']='Zavřeno {closed}. Byl zahájen nový prázdný projekt.';
$ec_lang['lpn_storage_full']='Neuloženo. Úložiště prohlížeče je plné nebo nedostupné, takže vaše nedávné změny se při zavření této karty ztratí.';
$ec_lang['lpn_notes_1_term']='Ustálený stav';
$ec_lang['lpn_notes_1_def']='Řeší vždy jednu sadu odběrů, pomocí stejného algoritmu globálního gradientu, jaký používá EPANET. Nemodeluje, jak se síť mění v čase.';
$ec_lang['lpn_notes_2_term']='Nemodelováno';
$ec_lang['lpn_notes_2_def']='Nádrže, kvalita vody a regulační ventily, které se samy otevírají a zavírají (PRV, PSV, FCV), nejsou modelovány. Potrubí může nést pevnou místní ztrátu, ale ne ventil, jehož otevřený nebo zavřený stav závisí na právě počítaném průtoku.';
$ec_lang['lpn_notes_3_term']='Ukládání projektů';
$ec_lang['lpn_notes_3_def']='Každý projekt je karta a každá karta se během práce ukládá do tohoto prohlížeče. Vymazání dat prohlížeče je všechny smaže, proto si práci ukládejte do souboru: Soubor, Uložit jako. Hvězdička na kartě znamená, že obsahuje změny, které nejsou v souboru. Do souboru se nikdy nic nezapíše, pokud o to nepožádáte. V některých prohlížečích se projekt připojí k souboru, do kterého jej uložíte, a Soubor, Uložit od té chvíle zapisuje zpět do stejného souboru; v jiných spojení možné není, proto je Uložit zakázáno a dostupné je pouze Uložit jako. Když je soubor projektu uložen na sdíleném disku, tato stránka vám sdělí, pokud jej má kolega už otevřený, aby si dva lidé navzájem nepřepsali práci.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. The popup carries a one-line
// pointer to here instead (lpn_pump_curve_note).
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Křivka čerpadla';
$ec_lang['lpn_notes_5_def']='Čerpadlo se řídí vztahem H = H₀ − aQ^b, kde H je tlaková výška, kterou čerpadlo přidává, a Q je průtok, který jím prochází. Zadejte jeden, dva nebo tři body z křivky výrobce. Tři body — tlaková výška při nulovém průtoku, normální pracovní bod a bod nejvyššího průtoku — proloží H₀, a a b přímo a nejvěrněji sledují publikovanou křivku. Dva body proloží parabolu (b = 2) s vrcholem při nulovém průtoku. Jeden bod používá běžné pravidlo: tlaková výška při nulovém průtoku je 1,33 × zadaná tlaková výška a nejvyšší průtok je 2 × zadaný průtok, což opět dává b = 2. Čerpadlo bez zadaných bodů nepřidává žádnou tlakovou výšku. Křivka není oříznuta v místě, kde tlaková výška dosáhne nuly, takže požadavek na vyšší průtok, než jaký křivka dokáže dodat, dá zápornou tlakovou výšku. Řešením je větší čerpadlo nebo menší odběr, ne jiné proložení křivky.';
$ec_lang['lpn_notes_4_term']='Plánovaná rozšíření';
$ec_lang['lpn_notes_4_def']='Scénáře, aby jeden projekt mohl obsahovat několik sad odběrů. Tabulky výsledků pro uzly a potrubí. Zápis souborů EPANET .inp, aby bylo možné projekt vrátit zpět do programu EPANET. Připomínky a náměty jsou vždy vítány (viz odkaz na zpětnou vazbu výše).';
$ec_lang['lpn_notes_epanet_term']='Konstanty Hazen-Williams odpovídají programu EPANET';
$ec_lang['lpn_notes_epanet_def']='V srpnu 2026 byl součinitel a exponent Hazen-Williams upraveny tak, aby odpovídaly programu EPANET. Výsledky ztráty tlakové výšky se od dřívějších verzí této stránky liší až o 0,1 procenta, což je mnohem méně, než je nejistota samotné hodnoty C.';
$ec_lang['lpn_id_invalid']='Zadejte ID bez mezer a bez uvozovek.';
$ec_lang['lpn_id_taken']='Toto ID se už používá.';
$ec_lang['lpn_diag_no_fixed_head']='Přidejte zdroj. Síť potřebuje alespoň jednu známou hladinu vody, než ji lze vyřešit.';
$ec_lang['lpn_diag_dangling_link']='Potrubí nebo čerpadlo se připojuje k uzlu, který již neexistuje:';
$ec_lang['lpn_diag_unreachable']='Tyto uzly nemají cestu ke zdroji:';
$ec_lang['lpn_diag_not_converged']='Nebylo nalezeno žádné řešení. Zkontrolujte, zda nejsou zadány hodnoty nemožné ve skutečnosti, například nulový průměr.';
$ec_lang['lpn_field_roughness']='Drsnost';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Součinitel C podle Hazen-Williams. Vyšší číslo znamená hladší potrubí: přibližně 150 pro nový plast, 130 pro novou ocel nebo litinu a 100 pro staré potrubí.';
$ec_lang['lpn_field_length']='Délka';
$ec_lang['lpn_field_length_tip']='Délka potrubí. Je-li zapnuto Automaticky, délka se měří z toho, co jste nakreslili. Vypněte Automaticky, chcete-li zadat délku, která se od kresby liší.';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
$ec_lang['lpn_field_km']='Součinitel místní ztráty, k';
$ec_lang['lpn_field_km_tip']='Ztráta z ohybů, ventilů a tvarovek na tomto potrubí, vyjádřená jako násobek rychlostní výšky. Pro obyčejné rovné potrubí použijte 0.';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Místní ztráta, k';
// Pump curve entry (Task 146, 2026-07-30): up to 3 (flow, head) points, or a reference to
// another pump's curve so several identical pumps need the curve entered only once.
$ec_lang['lpn_pump_curve_source']='Zdroj křivky';
$ec_lang['lpn_pump_curve_own']='Zadat body níže';
$ec_lang['lpn_pump_curve_ref_note']='Použita křivka zadaná pro čerpadlo {id}.';
$ec_lang['lpn_pump_curve_note']='Jeden, dva nebo tři body — viz „Křivka čerpadla“ v poznámkách níže.';
$ec_lang['lpn_pump_point1']='Bod 1 (povinný)';
$ec_lang['lpn_pump_point2']='Bod 2 (volitelný)';
$ec_lang['lpn_pump_point3']='Bod 3 (volitelný)';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
$ec_lang['lpn_mode_select']='Režim: Výběr. Klikněte na prvek nebo popisek, chcete-li jej zobrazit nebo změnit. Přetažením přesunete uzel, zlomový bod nebo popisek. Dvojitým kliknutím na potrubí přidáte nebo odeberete zlomový bod.';
$ec_lang['lpn_mode_delete']='Režim: Smazat. Kliknutím na prvek jej odstraníte.';
$ec_lang['lpn_mode_add_junction']='Režim: Přidat uzel. Kliknutím na mapu umístíte uzel. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky a popisky.';
$ec_lang['lpn_mode_add_reservoir']='Režim: Přidat zdroj. Kliknutím na mapu umístíte zdroj. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky a popisky.';
$ec_lang['lpn_mode_add_pipe']='Režim: Přidat potrubí. Klikněte na uzel a poté na další uzel, abyste je propojili. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky a popisky.';
$ec_lang['lpn_mode_add_pump']='Režim: Přidat čerpadlo. Klikněte na uzel a poté na další uzel, abyste je propojili. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky a popisky.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Režim: Přidat text. Kliknutím na mapu umístíte textový popisek. Kliknutím poblíž uzlu jej k tomuto uzlu připojíte. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky a popisky.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Tento režim použijte ke změně, přesunu a přetažení věcí na mapě.';
$ec_lang['lpn_tip_labels_draggable']='Popisek můžete přetáhnout, abyste jej přesunuli. Dvojitým kliknutím na popisek jej vrátíte na automatickou pozici.';
$ec_lang['lpn_field_auto']='Automaticky';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
$ec_lang['lpn_field_text_size']='Násobitel velikosti';
$ec_lang['lpn_tool_labels']='Popisky';
$ec_lang['lpn_labels_heading_node']='Popisky uzlů';
$ec_lang['lpn_labels_heading_link']='Popisky spojů';
$ec_lang['lpn_labels_decimals_tip']='Počet desetinných míst zobrazených u tohoto popisku';
$ec_lang['lpn_labels_mark_extrema']='Označit nejvyšší a nejnižší hodnoty';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Podkladový obrázek…';
$ec_lang['lpn_backdrop_add']='Přidat';
// BARE VERBS: both doors now print a "Podkladový obrázek" heading above them, so the object need
// not be repeated in each command.
$ec_lang['lpn_backdrop_scale']='Nastavit měřítko';
$ec_lang['lpn_backdrop_scale_entry']='Měřítko podle world file nebo podle velikosti jednoho pixelu na mapě';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Zadejte velikost jednoho pixelu na mapě, nebo vložte celý obsah world file pro tento obrázek';
$ec_lang['lpn_backdrop_scale_entry_bad']='Zadejte jedno číslo pro velikost jednoho pixelu na mapě, nebo vložte všech šest řádků world file.';
$ec_lang['lpn_backdrop_wld_bad']='Tento world file otáčí, zrcadlí nebo nerovnoměrně roztahuje obrázek. Mapa může obrázek pouze přesunout a zvětšit či zmenšit stejně v obou směrech, proto nebyl soubor použit.';
$ec_lang['lpn_backdrop_position']='Přesunout';
$ec_lang['lpn_backdrop_remove']='Odebrat';
$ec_lang['lpn_backdrop_remove_confirm']='Odebrat podkladový obrázek?';
$ec_lang['lpn_backdrop_scale_prompt1']='Klikněte na dva body na podkladovém obrázku, například na oba konce měřítkové úsečky. Poté zadejte skutečnou vzdálenost mezi nimi.';
$ec_lang['lpn_backdrop_scale_prompt2']='Skutečná vzdálenost mezi oběma body';
$ec_lang['lpn_backdrop_position_prompt1']='Klikněte na libovolný bod podkladového obrázku. Toto je bod, který přesunete.';
$ec_lang['lpn_backdrop_position_prompt2']='Vyberte, kam se má tento bod přesunout, a poté klikněte na Pokračovat.';
$ec_lang['lpn_backdrop_target_label']='Přesunout tento bod na:';
$ec_lang['lpn_backdrop_target_node']='Uzel';
$ec_lang['lpn_backdrop_target_free']='Libovolný bod na mapě';
$ec_lang['lpn_backdrop_target_coords']='Souřadnice, které zadáte';
$ec_lang['lpn_backdrop_coords_prompt']='Zadejte souřadnice X,Y, na které se má bod přesunout';
$ec_lang['lpn_backdrop_continue']='Pokračovat';
$ec_lang['lpn_tool_settings']='Nastavení';
$ec_lang['lpn_settings_scope_project']='Nastavení projektu';
$ec_lang['lpn_settings_scope_calculator']='Nastavení kalkulátoru';
$ec_lang['lpn_settings_show_titles']='Zobrazit nadpisy stránky';
$ec_lang['lpn_settings_show_titles_tip']='Skryje nadpis stránky a uvítací řádek nad kresbou, aby měla mapa víc místa. Tisk se nemění.';
$ec_lang['lpn_settings_id_prefixes']='Předpony ID';
$ec_lang['lpn_settings_defaults']='Výchozí hodnoty';
$ec_lang['lpn_settings_defaults_note']='Použije se pro prvky, které vytvoříte od nynějška. Stávající prvky se nemění.';
$ec_lang['lpn_settings_push_note']='Použijí se pouze vlastnosti, jejichž popisky jsou právě zobrazeny.';
$ec_lang['lpn_settings_push_btn']='Použít výchozí hodnoty na všechny prvky';
$ec_lang['lpn_push_confirm']='Nahradit tyto vlastnosti u všech stávajících prvků aktuálními výchozími hodnotami? Hodnoty, které jste zadali, budou přepsány. Tuto akci lze vrátit zpět.';
$ec_lang['lpn_push_properties']='Vlastnosti:';
$ec_lang['lpn_push_elements']='Uzly a potrubí:';
$ec_lang['lpn_push_none_displayed']='Momentálně není zobrazen žádný popisek výchozí hodnoty, takže není co použít. Zapněte popisky požadovaných vlastností v panelu Popisky a zkuste to znovu.';
$ec_lang['lpn_push_nothing']='Žádný stávající prvek nemá žádnou z použitých vlastností.';
$ec_lang['lpn_push_no_change']='Všechny prvky už tyto hodnoty mají, takže by se nic nezměnilo.';
$ec_lang['lpn_settings_emitter_exponent']='Exponent emitoru';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_settings_computation']='Výpočet';
$ec_lang['lpn_settings_tolerance']='Tolerance konvergence';
$ec_lang['lpn_settings_tolerance_tip']='Jak blízko se musí řešič přiblížit, než se zastaví. Menší číslo je přesnější a trvá déle.';
$ec_lang['lpn_settings_engine_epanet']='Řešit pomocí řešiče EPANET';
$ec_lang['lpn_settings_engine_epanet_tip']='Spustí vlastní řešič EPANET od americké agentury EPA přímo ve vašem prohlížeči. Vestavěný řešič dává stejné výsledky a je rychlejší, proto tuto volbu nechte vypnutou, pokud nepotřebujete přímo EPANET.';
$ec_lang['lpn_engine_loading']='Načítání řešiče EPANET…';
$ec_lang['lpn_engine_failed']='Řešič EPANET se nepodařilo načíst. Místo něj se zobrazuje vestavěný řešič.';
$ec_lang['lpn_engine_manning_note']='Poznámka: s drsností podle Manninga počítá EPANET ztrátu tlakové výšky přibližně o 0,6 % nižší než vestavěný řešič.';
$ec_lang['lpn_settings_text_size']='Velikost textu';
$ec_lang['lpn_settings_text_size_map']='Vzdálenost na mapě';
$ec_lang['lpn_settings_text_size_screen']='Pixely obrazovky';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Velikost symbolu (vzhledem k textu)';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Krytí symbolu (0 až 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Krytí podkladového obrázku (0 až 1)';
$ec_lang['lpn_settings_text_size_units']='Jednotky velikosti textu';
$ec_lang['lpn_settings_map_display']='Vzhled mapy';
$ec_lang['lpn_settings_map_height_px']='Výška mapy (pixely obrazovky)';
// The cap in applyMapHeight() makes this field look ignored on a phone (ROADMAP Task 146.08's
// own note). It is a render cap, not a stored value -- say so instead of leaving the user to guess.
$ec_lang['lpn_settings_map_height_tip']='Na malé obrazovce se mapa vykreslí nižší než tato hodnota, aby na stránce vždy zbylo místo pro posouvání.';
$ec_lang['lpn_settings_legend_position']='Umístění legendy';
$ec_lang['lpn_settings_legend_top_left']='Vlevo nahoře';
$ec_lang['lpn_settings_legend_top_right']='Vpravo nahoře';
$ec_lang['lpn_settings_legend_middle_left']='Vlevo uprostřed';
$ec_lang['lpn_settings_legend_middle_right']='Vpravo uprostřed';
$ec_lang['lpn_settings_legend_bottom_left']='Vlevo dole';
$ec_lang['lpn_settings_legend_bottom_right']='Vpravo dole';
$ec_lang['lpn_confirm_restore_defaults']='Obnovit všechna nastavení (předpony ID, výchozí hodnoty, nastavení řešiče, vzhled mapy, umístění legendy a zobrazené popisky) na jejich původní hodnoty? Vaše síť se nemění. Nastavení patří k otevřenému projektu, takže vaše ostatní projekty si ponechají svá vlastní.';
$ec_lang['lpn_settings_wipe_btn']='Vymazat vše na této stránce';
$ec_lang['lpn_confirm_wipe']='Smazat ÚPLNĚ VŠE uložené pro tuto stránku — každý projekt, každý podkladový obrázek, všechna nastavení a vaši volbu jednotek — a znovu načíst stránku tak, jak by ji viděl úplně nový návštěvník? Tuto akci nelze vrátit zpět.';
