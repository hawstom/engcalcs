<?php

// ěščžřýáíúůéó — All missing text declarations will fall back to English.

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
$ec_lang['u_imgd']='Mgal imp/den';
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
$ec_lang['u_day']='den';
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
$ec_lang['menu_main_hydraulics']='Hydraulika';
$ec_lang['menu_help']='Nápověda';
$ec_lang['menu_libre']='Svobodný software';
$ec_lang['template_welcome']='Nechejte strachy za dveřmi; zde je láska naším jazykem. Nekazíte vše. Užijte si také <a target="_blank" href="https://hawsedc.com/download.php">zdarma nástroje HawsEDC pro AutoCAD.</a>';
$ec_lang['template_feedback']='Můžete navrhnout lepší znění tohoto textu, nebo máte jiný nápad? Chcete pomoci, nebo se naučit vytvářet podobné nástroje? Napište mi, prosím.';
$ec_lang['template_printable_title']='Tisknutelný název';
$ec_lang['template_printable_subtitle']='Tisknutelný podtitul';
// Consent banner and the two site documents behind it (ROADMAP Task 286). These are UI, not legal
// prose, and they are translated into all 26 languages for one reason: consent that the visitor
// cannot read is not consent. The long-form privacy notice and terms are a separate question --
// English-authoritative, and translated by a human later if at all.
// Edited by TGH 2026-09-07; the word "cookie" approved by TGH 2026-09-09.
// **REWRITTEN 2026-10-08 (Tom, call F01: "Go (random code, new consent text)")**, his draft used
// exactly. The yes now also covers a random browser code (EC_CODE_COOKIE in lib/config.inc.php), so
// "a one-digit cookie" was no longer the whole of what is asked for. The code is what the sentence
// names because it is what the yes newly buys: counting browsers, not only page loads.
//
// EC_CONSENT_VERSION WENT FROM 1 TO 2 WITH IT, because what is stored changed. Everybody who chose
// "Allow this" is asked again; "Allow all" and "Refuse all" are not. The other 26 languages keep
// their old sentence until the next translation sprint, under the same version.
$ec_lang['consent_body']='Smíme si v tomto prohlížeči uložit náhodný kód, abychom mohli počítat, kolik prohlížečů používá jednotlivé části tohoto webu? Kód se vytvoří na místě, nic o vás ani o vašem zařízení nevypovídá a nezaznamenává nic, co zadáte. Bez něj nedokážeme rozlišit vaši druhou návštěvu od první návštěvy někoho jiného.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Vypočítá tuto síť v každém hydraulickém časovém kroku.';
$ec_lang['consent_accept']='Přijmout tentokrát';
$ec_lang['consent_accept_all']='Přijmout natrvalo';
$ec_lang['consent_decline']='Odmítnout natrvalo';
$ec_lang['consent_current_granted']='Povolili jste to. Tento prohlížeč uchovává náhodný kód, abychom ho mohli započítat.';
$ec_lang['consent_current_denied']='Odmítli jste to. Neukládáme nic, co by omezovalo zaznamenávání pro tento profil prohlížeče.';
$ec_lang['consent_region_label']='Vaše volba ohledně kódu pro počítání.';
$ec_lang['consent_settings_link']='Nastavení cookies';
$ec_lang['privacy_link']='Zásady ochrany osobních údajů';
$ec_lang['terms_link']='Podmínky použití';
$ec_lang['index_main_title']='Bezplatné inženýrské kalkulačky online';
$ec_lang['index_meta_desc_plain']='Bezplatné inženýrské kalkulátory pro potrubí, koryta, přelivy a závlahy. Fungují přímo v prohlížeči, pracují offline a jsou dostupné ve 27 jazycích.';
$ec_lang['calc_set_units']='Nastavit jednotky:';
$ec_lang['calc_set_units_tip']='Nastaví jednotku všech polí najednou. Nedestruktivní: čísla, která jste zadali, zůstanou přesně stejná a každé se nyní čte v nové jednotce. Ze 6 zůstane 6, ale nyní to znamená 6 palců místo 6 milimetrů.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Obnovit výchozí hodnoty';
$ec_lang['calc_defaults_confirm']='Resetovat kalkulačku na výchozí hodnoty?';
$ec_lang['points_data_note']='(nebo Kopírovat/Vložit pomocí datové oblasti)';
$ec_lang['points_data_heading']='Data kalkulátoru<br />(formát zobrazíte tlačítkem Kopírovat)';
$ec_lang['points_data_points_heading']='Data bodů<br />(formát zobrazíte tlačítkem Kopírovat)';
$ec_lang['points_data_copy']='Kopírovat';
$ec_lang['points_data_paste']='Vložit';
$ec_lang['points_data_msg_line']='Nic nebylo vloženo. Řádek {n} nelze přečíst jako staničení a nadmořskou výšku.';
$ec_lang['points_data_msg_none']='Nic nebylo vloženo. Nebyly nalezeny žádné dvojice staničení a nadmořské výšky.';
$ec_lang['calc_inputs']='Vstupy';
$ec_lang['calc_results']='Výsledky';
$ec_lang['view_hide_line']='Skrýt tento řádek';
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
$ec_lang['mi_elevation']='Nadmořská výška';
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
$ec_lang['mphl_hgl_egl_tip']='Tento výsledek nemusí platit tam, kde se potrubí zvedá nad čáru tlakové výšky.';
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
// Edited by TGH 2026-09-07
$ec_lang['mtc_n_blodgett']='n pro návrhovou velikost kamene dle Blodgetta';
$ec_lang['mtc_n_bathurst']='n pro návrhovou velikost kamene dle Bathursta';
$ec_lang['mtc_n_pi']='n z návrhové velikosti kamene (P&I, metoda Phillipse a Ingersolla)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett oproti Bathurstovi';
$ec_lang['mtc_pi_range_check']='Kontrola rozsahu P&I';
$ec_lang['mtc_pi_ok']='d50 v rozsahu P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_not_applicable']='n/a';
$ec_lang['mtc_pi_out_of_range']='Mimo rozsah';
$ec_lang['mtc_pi_tip']='Extrapolace mimo rozsah datového souboru 0,28–0,36 ft, ze kterého byla tato rovnice odvozena — berte jako orientační kontrolu, nikoli jako podklad pro návrh';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Dle Isbash (1936) a Maricopa County, Arizona, USA.">Požadovaná velikost lomového kamene na dně, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Dle Isbash (1936) a Maricopa County, Arizona, USA.">Požadovaná velikost lomového kamene svahu 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Dle Isbash (1936) a Maricopa County, Arizona, USA.">Požadovaná velikost lomového kamene svahu 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Podle Maynorda, Ruffa a Abta (1989). V zatáčce je kámen navržen na rychlost v zatáčce rovnou 4/3 průměrné rychlosti, podle California Division of Highways (1970); Maynordova vlastní hodnota 1,5 platí pro přirozené kanály.">Požadovaná velikost lomového kamene, D<sub>50</sub> (Maynord, Ruff a Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Požadovaná velikost lomového kamene, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Rychlost přiměřená pro předpoklady rovnoměrného proudění.';
$ec_lang['mtc_vel_low']='Rychlost nízká — riziko sedimentace.';
$ec_lang['mtc_vel_high']='Rychlost je vysoká a nemusí být reálná; zkontrolujte erozi opevnění koryta, zvětšenou hloubku v obloucích a ztrátu energie na rozšířeních nebo překážkách.';
$ec_lang['mtc_iteration_tip']='Zvolte možnost drsnosti (doporučeno B/B, tedy Blodgett–Bathurst) a možnost velikosti kamene (doporučeno Isbash), aby se automaticky iterovalo k rovnoměrné velikosti kamene pro požadovaný průtok. Úplný postup najdete v Poznámkách níže. Chcete-li iteraci přeskočit, zadejte vlastní hodnotu drsnosti (viz odkaz s pokyny) a velikost kamene ignorujte.';
$ec_lang['mtc_note_1']='<dl><dt>Automatická iterace návrhu velikosti kamene a drsnosti</dt><dd>Zvolte možnost drsnosti (doporučeno B/B, tedy Blodgett–Bathurst) a možnost návrhové velikosti kamene (doporučeno Isbash). Upravte hloubku a bezpečnostní součinitel velikosti kamene, abyste dosáhli požadovaného průtoku s rovnoměrnou velikostí kamene. Při každé změně vstupu kalkulátor opakuje tyto kroky: 1. Drsnost se vypočte z návrhové velikosti kamene. 2. Hodnota drsnosti z vámi zvolené metody se zkopíruje do vstupu drsnosti. 3. Vypočte se průtok korytem a požadovaná velikost kamene. 4. Návrhová velikost kamene se upraví. 5. Kroky se opakují, dokud není chyba návrhové velikosti kamene velmi malá.</dd><dt>Základní kalkulátor (bez iterace)</dt><dd>Zadejte požadovanou hodnotu drsnosti. Oblast vstupu návrhové velikosti kamene ignorujte.</dd></dl>';
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
$ec_lang['wi_notes_we_def']='q = pokud (délka = 0) pak 0, jinak pokud (sklon = 0) pak cw*délka*d<sub>0</sub><sup>1.5</sup>, jinak cw/(2.5*sklon) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>), kde d<sub>1</sub> a d<sub>0</sub> jsou vždy kladné nebo nulové';
// Orifice Flow
$ec_lang['or_main_menu']='Průtok otvorem';
$ec_lang['or_main_title']='Bezplatný online kalkulátor průtoku otvorem';
$ec_lang['or_main_desc']='Průtok otvorem — volný nebo zatopený';
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
$ec_lang['mhp_annual_kwh']='P jako roční energie';
$ec_lang['mhp_vel_low']='Rychlost nízká — riziko sedimentace a usazování vzduchu.';
$ec_lang['mhp_vel_high']='Rychlost vysoká — zkontrolujte ztráty na přechodech, dostupnou energii a riziko vodního rázu.';
$ec_lang['mhp_vel_ok_short']='OK';
$ec_lang['mhp_vel_high_short']='Vysoká';
$ec_lang['mhp_vel_low_short']='Nízká';
$ec_lang['mhp_vel_ok_tip']='Rychlost je v efektivním rozsahu pro návrh tlakovodu.';
$ec_lang['mhp_hl_ok_tip']='Ztráta tlakové výšky je pod 10 % hrubé spádové výšky. Tato velikost potrubí je hospodárná.';
$ec_lang['mhp_hl_warn_tip']='Ztráta tlakové výšky přesahuje 10 % hrubé spádové výšky. Zvažte větší potrubí.';
$ec_lang['mhp_hl_bad_tip']='Ztráta tlakové výšky přesahuje 20 % hrubé spádové výšky. Změňte velikost potrubí.';
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
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Otevřete libovolnou stránku kalkulačky.</li><li>Klikněte na <strong>ikonu instalace</strong> (⊕ nebo ikonu počítače) v adresním řádku prohlížeče, nebo otevřete nabídku prohlížeče a zvolte <strong>Instalovat EngCalcs…</strong></li><li>Klikněte na <strong>Instalovat</strong>. EngCalcs se otevře jako samostatné okno aplikace.</li>';
$ec_lang['install_firefox_heading']='Firefox a další prohlížeče';
$ec_lang['install_firefox_body']='Pokud prohlížeč nenabízí možnost instalace, používejte kalkulačky v prohlížeči jako obvykle. Po první návštěvě se stránky automaticky ukládají do mezipaměti pro použití offline. Běžným případem je Firefox na počítači.';
$ec_lang['install_cached_heading']='Co se ukládá do mezipaměti';
$ec_lang['install_cached_body']='Při první instalaci EngCalcs se do vašeho zařízení automaticky uloží všechny stránky kalkulaček i jejich podpůrné soubory (skripty, styly). Poté vše funguje bez připojení k internetu. Vaše volba jazyka se pamatuje z poslední online návštěvy.';
$ec_lang['contact_main_menu']='Kontakt';
$ec_lang['about_main_title']='O kalkulátorech HawsEDC';
$ec_lang['about_main_desc']='Poslání, svobodný software a přispívání';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Poslání</h3><p>Inženýrské Kalkulačky HawsEDC jsou od roku 2010 volně nabízeny online. Existují, aby sloužily inženýrům a terénním pracovníkům po celém světě — zejména těm, kteří pracují v oblastech s nedostatkem vody, omezenými zdroji nebo nedostatečným zásobením. Tyto nástroje jsou součástí širšího humanitárního poslání: říci každému člověku co nejpraktičtějším a nejúčinnějším způsobem, <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">že je navždy milován a ceněn, že se nemá čeho bát a že nezkazí všechno</a>.</p><p>Kalkulačky jsou prostředkem. Cílem je svět bez utrpení.</p><h3>Svobodná licence s otevřeným zdrojovým kódem</h3><p>Veškerý kód je vydán pod <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 nebo novější</a> — svobodný ve smyslu svobody. Kód můžete za stejných podmínek používat, studovat, upravovat a šířit dál.</p><p>Web, který jej poskytuje, je nabízen zdarma dnes i od roku 2010; pokud by to jednoho dne nebylo možné, software je stále váš a můžete jej provozovat sami.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Zdrojový Kód</h3><p>Úplný zdrojový kód je veřejně dostupný na GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Tam si můžete prohlédnout kód, nahlásit problémy nebo forknout repozitář.</p><h3>Příspěvky</h3><p>Veškerá pomoc je vítána. <a href="contact.php">Kontaktujte Toma Hawse</a>.</p><ul><li><strong>Překlady:</strong> Navrhněte lepší znění. Vylepšete nebo přidejte jazyk.</li><li><strong>Hlášení chyb:</strong> Použijte formulář zpětné vazby na libovolné stránce kalkulačky nebo nahlaste problém na GitHub.</li><li><strong>Nové kalkulačky:</strong> Nápady na hydraulicko-inženýrské nástroje sloužící terénním pracovníkům a odborníkům na závlahy jsou zvláště vítány.</li><li><strong>Hosting:</strong> Pokud můžete tyto kalkulačky zrcadlit pro oblast s omezeným připojením, kontaktujte mě prosím.</li></ul><h3>Offline použití</h3><p>Otevřete jakoukoli kalkulačku jednou, dokud jste online, a všechny budou fungovat i tehdy, když online nejste: váš prohlížeč průběžně ukládá celou sadu. Tento mechanismus je <strong>progresivní webová aplikace (PWA)</strong>. Poté všechny kalkulačky fungují offline — bez potřeby internetu.</p><p>Na Androidu nebo iOS použijte možnost „Přidat na domovskou obrazovku" v prohlížeči a nainstalujte EngCalcs jako aplikaci do svého zařízení. Na počítači hledejte ikonu instalace v adresním řádku prohlížeče.</p><p>Libovolnou kalkulačku můžete také uložit pomocí nabídky „Uložit jako…" ve svém prohlížeči pro jednorázové offline použití.</p><h3>Kontakt</h3><p>Tom Haws — hydraulický inženýr a zakladatel těchto kalkulaček.<br />Použijte formulář zpětné vazby na libovolné stránce kalkulačky nebo přistupte ke zdrojovému kódu na <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
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
$ec_lang['rc_yn']='<span class="ec-help" title="Vzdutí (Hp > yn) je žádoucí, protože snižuje erozi proti proudu. (USDA)">Normální hloubka ve vtokovém korytě, y<sub>n</sub> <span class="ec-tip">?</span></span>';
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
$ec_lang['rc_Hp']='<span class="ec-help" title="Vzdutí (Hp > yn) je žádoucí, protože snižuje erozi proti proudu. (USDA)">Přepadová výška na vtoku, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Kontrola vzdutí na vtoku';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — vzdutí proti proudu';
$ec_lang['rc_pond_ok_tip']='Vzdutí proti proudu od vtoku strmého koryta je žádoucí; snižuje erozi proti proudu. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — žádné vzdutí — riziko eroze na vtoku';
$ec_lang['rc_pond_warn_tip']='Bez vzdutí proti proudu od vtoku skluzu; proti proudu může dojít k erozi. (USDA)';
$ec_lang['rc_eq1']='Rovn. 1 (S<sub>0</sub> < 0,10) — mírný sklon';
$ec_lang['rc_eq2']='Rovn. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — strmý sklon';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — pod ověřeným rozsahem Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — nad ověřeným rozsahem Robinson';
$ec_lang['rc_notes_1_term']='Rovnice pro dimenzování kamene';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) vyvinuli dvě empirické rovnice pro mediánovou velikost záhozu D<sub>50</sub> na základě sklonu koryta a měrného průtoku. Rovnice 1 platí pro mírné sklony (S<sub>0</sub> < 0,10); rovnice 2 platí pro strmé sklony (0,10 ≤ S<sub>0</sub> ≤ 0,40). Obě rovnice vyžadují q<sub>t</sub> v m²/s a vracejí D<sub>50</sub> v mm. Ověřený rozsah je 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
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
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Zaškrtnuto: tento úsek je segment testovací postranní větve, ze kterého odebírají vodu jednotlivé emitory. Nezaškrtnuto: tento úsek je hlavní potrubí, které pouze předává průtok postranním větvím mimo testovací cestu.">Postranní <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Postranní řady: emitory v tomto úseku pouze. Hlavní řady: celkový počet emitorů na postranních větvích JINÉ než zde větvící se z tohoto úseku. V úseku přímo v místě odebírání testovací postranní větve se zahrnou také všechny postranní větve dále po hlavním potrubí za tímto odběrem, nebo sdílející stejný spoj (např. postranní větev na opačné straně) — jejich průtok také prochází tímto úsekem.">Emitory <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Nadmořská výška dolního konce úseku. Volitelná v interních řadách (pokud ponecháno prázdné, defaultuje na vodorovně / stejně jako uzel výše). Povinná v poslední řadě: tato hodnota je nadmořská výška posledního emitoru, která přímo určuje požadovaný vstupní tlak.">DS Nadm. výška <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Nadmořská výška posledního emitoru (poslední řada) byla ponechána prázdná a defaultovala na vodorovně — zadejte ji pro přesný výsledek';
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
// Edited by TGH 2026-09-07
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
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID řady, která napájí tuto řadu. Ponechte prázdné pro navázání přímo na řadu výše (prostá sériová trasa). Zadejte zde ID pro odbočení z jiné řady.';
$ec_lang['bpn_roughness_tip']='Drsnost potrubí pro zvolenou metodu tření: Manning n, Hazen-Williams C, nebo výška drsnosti Darcy-Weisbach e (délka). Typické hladké plastové potrubí: n přibližně 0,009, C přibližně 150, e přibližně 0,0015 mm.';
$ec_lang['bpn_demand']='Odběr';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Pevný průtok dodávaný na dolním konci této řady.';
$ec_lang['bpn_demand_mult']='Násobitel odběru';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Škáluje odběr všech řad najednou, pro výpočet špičkové hodiny nebo budoucího růstu spotřeby. Použijte hodnotu 1 pro zadané odběry beze změny.';
$ec_lang['bpn_elev_down']='DS nadm. výška';
// Edited by TGH 2026-09-07
$ec_lang['bpn_q_line']='Průtok řady';
$ec_lang['bpn_q_line_tip']='Celkový průtok vedený touto řadou: její vlastní odběr plus všechny dolní odběry, které napájí.';
$ec_lang['bpn_p_down']='DS tlak';
// Edited by TGH 2026-09-07
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Manometrický tlak (tlaková výška) v dolním uzlu této řady. Záporná hodnota (označena) znamená podatmosférický tlak; zkontrolujte návrh.';
$ec_lang['bpn_sketch_heading']='Schéma sítě';
$ec_lang['bpn_source_label']='Zdroj';
$ec_lang['bpn_line_problem']='Tato řada není připojena ke zdroji: odkazuje na neznámé horní ID, odkazuje sama na sebe, opakuje ID, které už používá jiná řada, nebo tvoří okruh. Nepřipojené řady zůstávají nevyřešeny.';
$ec_lang['bpn_bad_id_short']='Chybné ID';


$ec_lang['bpn_pressure_warn']='Nízký/záporný tlak; zkontrolujte podatmosférické podmínky';
$ec_lang['bpn_pressure_warn_short']='Nízký';
$ec_lang['bpn_notes_1_term']='Ve výchozím stavu sériové zapojení, větvení jako výjimka';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Ponecháte-li Horní ID prázdné, řada navazuje na řadu výše jako sériové potrubí. Zadáním ID horní řady z ní odbočíte. Výchozí je sériové potrubí; strom vzniká pouze tam, kde je zadána odbočka.';
$ec_lang['bpn_notes_2_term']='Pouze větvené sítě, bez okruhů';
$ec_lang['bpn_notes_2_def']='Každá řada má právě jednu horní řadu (strom). Tento nástroj neřeší okruhové sítě, které vyžadují iterační metody (EPANET nebo podobné). Protože síť nemá okruhy, je řešení přímé a přesné.';
$ec_lang['bpn_notes_3_term']='Žádné aktivní tlakové regulátory';
$ec_lang['bpn_notes_3_def']='Lze přidat pevný ventil s místní ztrátou (hodnota k), ale ne redukční nebo udržovací tlakové ventily (PRV/PSV). Jejich otevřený/zavřený stav závisí na průtoku a tlaku, což by vyžadovalo iteraci.';
$ec_lang['bpn_supply2_q']='Dodávkový průtok 2';
$ec_lang['bpn_supply2_h']='Dodávková výška 2';
$ec_lang['bpn_supply3_q']='Dodávkový průtok 3';
$ec_lang['bpn_supply3_h']='Dodávková výška 3';
$ec_lang['bpn_supply_pt_tip']='Volitelné body dodávkové křivky 2 a 3. Zadejte průtok a výšku pro každý bod pro modelování čerpadla nebo jakéhokoli zdroje, jehož výška klesá s rostoucí dodávkou; nástroj čte výšku při návrhovém průtoku. Bod 1 výše je statická výška při nulovém průtoku. Body 2 a 3 ponechte prázdné pro konstantní výšku nádrže.';
$ec_lang['bpn_h_supply']='Dodávková výška';
$ec_lang['bpn_h_supply_tip']='Výška zdroje při návrhovém průtoku, čtená z dodávkové křivky. Rovná se zadané výšce zdroje, pokud je křivka plochá (nádrž).';
$ec_lang['bpn_supply1_h']='Statická dodávková výška';
$ec_lang['lpn_main_menu']='Vodovodní síť';
$ec_lang['lpn_main_title']='Bezplatné online modelování vodovodní sítě s řešičem EPANET';
$ec_lang['lpn_main_desc']='Analýza vodovodní sítě: Nakreslete okruhovou potrubní síť nebo importujte soubory EPANET';
$ec_lang['lpn_title_units']='Jednotky {units}';
$ec_lang['lpn_tool_select']='Výběr';
$ec_lang['lpn_tool_add_junction']='Uzel';
$ec_lang['lpn_tool_add_reservoir']='Zdroj';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Nádrž';
$ec_lang['lpn_tool_add_pipe']='Potrubí';
$ec_lang['lpn_tool_add_pump']='Čerpadlo';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Ventil';
$ec_lang['lpn_tool_add_text']='Text';
// Junction and Pipe (Task 719): Tom's WaterCAD command, a junction, a pipe, a junction, a pipe, until Escape.
$ec_lang['lpn_tool_add_chain']='Řetěz uzlů a potrubí';
$ec_lang['lpn_tool_vertices']='Vrcholy';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Odběratel';
$ec_lang['lpn_tool_add_meter_tip']='Zadejte bod odběratele a poté jeho připojení: spoj nebo uzel. Odběr, který odběrateli zadáte, se přičte k uzlu na bližším konci tohoto spoje.';
$ec_lang['lpn_mode_add_meter']='Odběratel: zadejte, kde odběratel je, a poté vyberte potrubí nebo uzel, který jej zásobuje. Nebo akci zrušte klávesou Esc.';
$ec_lang['lpn_pane_tab_customers']='Odběratelé';
// The Shape table (Task 779). Closed is a polygon's closure, not a pipe's or valve's status, so it
// is a key of its own and not lpn_field_closed: many languages use different words for the two.
// Points is the column of the Shape's points, "Shape S1, point 2" in lpn_snap_shape_point.
$ec_lang['lpn_pane_tab_shapes']='Útvary';
$ec_lang['lpn_pane_shape_closed']='Uzavřený';
$ec_lang['lpn_pane_shape_points']='Body';
$ec_lang['lpn_customer_heading']='Odběratel {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Odběr na přípojku';
$ec_lang['lpn_field_meter_count']='Počet přípojek';
$ec_lang['lpn_field_meter_total']='Celkový odběr';
$ec_lang['lpn_field_meter_total_tip']='Celkem přičteno k uzlu uvedenému níže.';
$ec_lang['lpn_field_meter_pipe']='Připojený prvek';
$ec_lang['lpn_field_meter_pipe_suggest']='Nejbližší prvek je {id}. Zadejte jej sem, aby z něj byl tento odběratel zásobován.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Připojeno k';
$ec_lang['lpn_field_meter_node_tip']='Uzel, ke kterému je tento odběratel připojen. Přetažením bodu připojení na potrubí jej napojíte na stanoviště podél tohoto potrubí.';
$ec_lang['lpn_meter_pipe_unknown']='V tomto projektu nic nemá název {id}, takže odběratel zůstal na svém místě.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='V tomto projektu nemá žádný vzorec název {id}, takže odběratel zůstal beze změny.';
$ec_lang['lpn_meter_placed']='Odběratel {id} byl přidán. Jeho popis a odběr zadejte v tabulce Odběratelé, nebo jej vyberte v režimu Výběr a otevřete okno jeho vlastností.';
$ec_lang['lpn_field_meter_pipe_tip']='Prvek, ke kterému je tato přípojka připojena. Změníte jej zadáním jiného zde nebo v tabulce Odběratelé, nebo přetažením bodu připojení na jiný prvek.';
$ec_lang['lpn_field_meter_station']='Poloha na potrubí (%)';
$ec_lang['lpn_field_meter_station_tip']='Vzdálenost podél potrubí k místu připojení přípojky, v procentech potrubí od jeho prvního uzlu k druhému. 0 je na jednom konci a 100 na druhém. Totéž dělá kroužek na potrubí při použití ukazatele.';
$ec_lang['lpn_field_meter_offset']='Odsazení od potrubí';
$ec_lang['lpn_field_meter_offset_tip']='Kladná hodnota je vpravo od potrubí při pohledu od jeho prvního uzlu k druhému. Zadáním hodnoty zde lze odběratele přesunout na druhou stranu hlavního řadu a vždy se tím přípojka vede kolmo k hlavnímu řadu.';
$ec_lang['lpn_field_meter_lumped']='Přidáno k uzlu';
$ec_lang['lpn_field_meter_lumped_tip']='Nejbližší uzel; odběry tohoto odběratele se přičítají zde.';
$ec_lang['lpn_node_customers']='Odběry odběratelů';
$ec_lang['lpn_node_customers_tip']='Seznam odběratelů přidaných zde, protože tento uzel byl jejich nejbližším uzlem. Odběry odběratelů se přičítají k ostatním zde uvedeným odběrům. Odběratel se upravuje tam, kde je na mapě, nebo v tabulce Odběratelé.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} od odběratelů ({n})';
$ec_lang['lpn_customer_detached']='⚠ Tento odběratel není připojen k potrubí, takže jeho odběr není ve výsledcích. Smažte jej, nebo nakreslete potrubí a přesuňte na něj odběratele.';
$ec_lang['lpn_customer_fixed_head']='⚠ Bližší konec tohoto potrubí má pevnou hladinu vody, takže tento odběr simulaci neovlivňuje.';
$ec_lang['lpn_customer_node_inactive']='Tento odběratel je přiřazen k uzlu, který je v tomto scénáři neaktivní, a jeho odběr proto není součástí výpočtu.';
$ec_lang['lpn_customer_detached_count']='Odběratelé nepřipojení k potrubí ({n}). Jejich odběr není zohledněn.';
$ec_lang['lpn_meter_pick_pipe']='Nyní vyberte potrubí nebo uzel, který tohoto odběratele zásobuje. Odběratel zůstane tam, kam jste jej umístili. Akci zrušíte klávesou Escape.';
$ec_lang['lpn_inp_export_flat_customers']='Soubor EPANET nemá odběratele. Odběr odběratelů v tomto projektu ({n}) je zapsán jako řádek odběru u uzlu, ke kterému je každý odběratel přiřazen, pojmenovaný značkou odběratele. Soubor nezaznamenává samotného odběratele: jeho umístění, potrubí, které jej zásobuje, místo podél tohoto potrubí, kde se přípojka připojuje, ani počet přípojek, které zastupuje. Tyto informace zůstávají v projektu; uložte soubor projektu, abyste je zachovali.';

$ec_lang['lpn_area_hint_window_start']='Zadejte jeden roh okna.';
$ec_lang['lpn_area_hint_window_go']='Zadejte protilehlý roh a dokončíte.';
$ec_lang['lpn_area_hint_lasso_start']='Zadejte bod, kterým obrys začne.';
$ec_lang['lpn_area_hint_lasso_go']='Pohybem kreslíte obrys. Zadejte poslední bod a dokončíte.';
$ec_lang['lpn_area_hint_polygon_start']='Zadejte první roh mnohoúhelníkové oblasti. Dvojitým kliknutím dokončíte.';
$ec_lang['lpn_area_hint_polygon_go']='Zadejte každý roh. Dvojitým kliknutím na poslední dokončíte.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Podržte Shift při výběru, chcete-li pokračovat ve stávajícím výběru a přidávat nebo odebírat (přepínat) to, co vybíráte.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Stiskněte mapu a tažením obtáhněte to, co chcete, poté zvedněte prst.';
$ec_lang['lpn_area_hint_touch_go']='Tažením obtáhněte to, co chcete, poté zvednutím prstu dokončíte.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Zobrazit toto';
$ec_lang['lpn_multi_title']='{n} vybráno';
$ec_lang['lpn_multi_varies']='Různé';
$ec_lang['lpn_multi_applied']='Nastaveno {prop} u {n}.';
$ec_lang['lpn_multi_no_fields']='Tyto položky nemají nic, co by šlo nastavit společně zde.';
$ec_lang['lpn_pane_pasted']='Vložené buňky ({n}). Buňky beze změny ({skipped}).';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Vložené řádky ({n}). Řádky přidané do sítě ({created}).';
$ec_lang['lpn_pane_pasted_rows_skipped']='Vložené řádky ({n}). Řádky přidané do sítě ({created}). Buňky beze změny ({skipped}).';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Vyberte tuto oblast a vložte řádky z tabulkového procesoru, aby se přidaly.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Vložit jako nové řádky na konec tabulky';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Stiskněte Ctrl+V a zkopírované řádky se přidají na konec této tabulky. Akci zrušíte klávesou Esc.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Řádky ve vložených datech ({n}). Řádky, které se vejdou do tabulky ({fit}). Přidat ostatní řádky ({extra}) jako nové řádky na konec?';
$ec_lang['lpn_pane_paste_overflow_add']='Přidat řádky ({extra})';
$ec_lang['lpn_pane_paste_overflow_fit']='Vložit jen řádky, které se vejdou ({fit})';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Řádky ve vložených datech ({n}). Řádky, které se vejdou do tabulky ({fit}). Ostatní řádky ({extra}) nelze přidat jako nové řádky: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='ID, která se neshodují ({n}). Přesto vložit?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Nic nebylo vloženo. {reasons}';
$ec_lang['lpn_pane_paste_more']='Řádky s problémy zde nezobrazené: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Řádek {row}: nový řádek potřebuje ID.';
$ec_lang['lpn_pane_paste_bad_id']='Řádek {row}: ID {id} obsahuje mezeru nebo uvozovku.';
$ec_lang['lpn_pane_paste_id_taken']='Řádek {row}: ID {id} je již použito.';
$ec_lang['lpn_pane_paste_id_twice']='Řádek {row}: ID {id} je v tomto vložení použito dvakrát.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Řádek {row}: nový uzel potřebuje {first} i {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Řádek {row}: nový spoj potřebuje uzel Od a uzel Do.';
$ec_lang['lpn_pane_paste_no_node']='Řádek {row}: uzel {id} ještě neexistuje. Nejprve vložte své uzly, a poté spoje.';
$ec_lang['lpn_pane_paste_same_ends']='Řádek {row}: Od a Do jsou stejný uzel.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Řádek {row}: {text} není platná hodnota pole {col}.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Řádek {row}: nový Text potřebuje {first} i {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Řádek {row}: {id} zatím není v této síti uzlem ani potrubím. Nejprve vložte jej, a poté tento Text.';
$ec_lang['lpn_pane_paste_customer_no_position']='Řádek {row}: nový Odběratel potřebuje {first} i {second}.';
$ec_lang['lpn_pane_paste_shape_no_points']='Řádek {row}: nový Útvar potřebuje Body.';
// {pair} is the Points heading's own pair in this project's axis words: X/Y, N/E or Lat/Lon.
$ec_lang['lpn_pane_paste_shape_bad_points']='Řádek {row}: {text} není seznam bodů. Zapište každý bod jako {pair}, s tečkou (.) jako desetinným oddělovačem, a body oddělte znakem |.';
$ec_lang['lpn_pane_paste_shape_closed_few']='Řádek {row}: uzavřený Útvar potřebuje alespoň tři body.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Řádek {row}: nový Odběratel potřebuje připojené potrubí nebo uzel.';
$ec_lang['lpn_pane_paste_no_pipe']='Řádek {row}: potrubí {id} ještě neexistuje. Nejprve vložte svá potrubí, a poté odběratele.';
$ec_lang['lpn_pane_paste_no_customer_node']='Řádek {row}: uzel {id} ještě neexistuje. Nejprve vložte své uzly, a poté odběratele.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Řádek {row}: uzel {id} nemá potrubí, ke kterému by se Odběratel mohl připojit.';
$ec_lang['lpn_pane_filled']='Buňky vyplněné dolů ({n}). Buňky beze změny ({skipped}).';
$ec_lang['lpn_pane_filldown']='Vyplnit dolů';
$ec_lang['lpn_pane_delete_element']='Odstranit prvek';
$ec_lang['lpn_pane_delete_elements']='Odstranit prvky';
$ec_lang['lpn_pane_fill_none']='Nic v tomto výběru nelze vyplnit dolů.';
$ec_lang['lpn_pane_ctrlenter_filled']='Vyplněné buňky ({n}). Buňky beze změny ({skipped}).';
$ec_lang['lpn_pane_hide_col']='Skrýt tento sloupec';
$ec_lang['lpn_pane_hide_cols']='Skrýt tyto sloupce';
$ec_lang['lpn_pane_show_all_cols']='Zobrazit všechny sloupce';
$ec_lang['lpn_pane_sort_asc']='Seřadit vzestupně';
$ec_lang['lpn_pane_sort_desc']='Seřadit sestupně';
$ec_lang['lpn_pane_manage_cols']='Spravovat sloupce…';
$ec_lang['lpn_pane_manage_cols_title']='Spravovat sloupce';
$ec_lang['lpn_pane_manage_cols_show']='Zobrazit';
$ec_lang['lpn_pane_manage_cols_up']='Přesunout nahoru';
$ec_lang['lpn_pane_manage_cols_down']='Přesunout dolů';
$ec_lang['lpn_pane_manage_cols_top']='Přesunout na začátek';
$ec_lang['lpn_pane_manage_cols_bottom']='Přesunout na konec';
$ec_lang['lpn_pane_manage_cols_width']='Šířka (em)';
$ec_lang['lpn_pane_width_tip']='Šířky sloupců se ukládají v tomto prohlížeči, nikoli v projektu. Dvojitým kliknutím na dělicí čáru sloupce obnovíte výchozí šířku.';
$ec_lang['lpn_pane_colmenu_tip']='Skrýt nebo spravovat sloupce';
$ec_lang['lpn_tool_area_window']='Vybrat okno';
$ec_lang['lpn_tool_area_lasso']='Vybrat laso';
$ec_lang['lpn_tool_area_polygon']='Vybrat polygon';
$ec_lang['lpn_tool_delete']='Smazat';
$ec_lang['lpn_tool_zoom_extent']='Zobrazit vše';
$ec_lang['lpn_tool_zoom_selection']='Přiblížit výběr';
$ec_lang['lpn_tool_zoom_window']='Přiblížit okno';
$ec_lang['lpn_zoom_in']='Přiblížit';
$ec_lang['lpn_zoom_out']='Oddálit';
$ec_lang['lpn_new_text']='Text';
$ec_lang['lpn_field_text_bold']='Tučný text';
// Justification for a Text object (Task 342). **The standard terms, and nothing invented** (Tom,
// 2026-08-17: "standard English usage would be better... Horizontal justification and Vertical
// justification; you don't even have to mention the anchor point").
//
// **NO SYNONYM ENTRY, and the reason is a rule rather than an omission** (Tom, 2026-08-18: "no syn.
// It's a technical term. We can only give a definition, which is not our job."). A plain sentence
// (dev/plain-sentences.md, then $ec_lang_syn) holds phrases that could STAND ON THE CONTROL in place of the label; a technical term has no such
// alternatives, and what a first draft put there was a definition wearing a synonym's clothes.
// The Text table's own column naming what a Text is attached to (a node or a link ID), read-only:
// attaching and detaching are map gestures, never a typed rename.
$ec_lang['lpn_field_text_anchor']='Připojeno k';
$ec_lang['lpn_field_text_align']='Vodorovné zarovnání';
$ec_lang['lpn_field_text_align_left']='Vlevo';
$ec_lang['lpn_field_text_align_center']='Na střed';
$ec_lang['lpn_field_text_align_right']='Vpravo';
$ec_lang['lpn_field_text_valign']='Svislé zarovnání';
$ec_lang['lpn_field_text_valign_top']='Nahoru';
$ec_lang['lpn_field_text_valign_middle']='Na střed';
$ec_lang['lpn_field_text_valign_bottom']='Dolů';
$ec_lang['lpn_field_text_rotation']='Úhel (stupně)';
$ec_lang['lpn_field_text_match_pipe']='Otočit na úhel nejbližšího spoje';
$ec_lang['lpn_field_text_flip']='Otočit o 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Připojený prvek';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Tento text byl umístěn dostatečně blízko k prvku, aby jej sledoval, takže se s ním pohybuje a má vodicí čáru. Text na vodicí čáře přebírá své vodorovné a svislé zarovnání podle strany, na které leží, a proto tyto dva řádky nejsou nabízeny, dokud je připojen.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Koeficient emitoru';
$ec_lang['lpn_field_emitter_tip']='Dodatečný odtok závislý na tlaku, pro postřikovač, otevřený výtok nebo modelovaný únik. Průtok, který uvolňuje, je tento koeficient násobený tlakem umocněným na exponent emitoru, který se nastavuje jednou pro celou síť v Nastavení, Výpočet, Hydraulika. U běžného uzlu ponechte prázdné.';
$ec_lang['lpn_field_elev']='Nadmořská výška';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of a plain-sentence
// entry carrying translatable payload nobody on the page can see.
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='Tlaková výška';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Hladina vody u zdroje, vyjádřená jako výška, nikoli jako tlak. Ponechte prázdné, pokud má být hladina vody na nadmořské výšce zdroje.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
// A tank has two elevations (Tom, 2026-10-11): Elevation is the ground, the pressure datum as at a
// junction; Base elevation is the tank bottom, EPANET's [TANKS] Elevation, from which depth and
// volume are measured.
$ec_lang['lpn_field_tank_base_elev']='Nadmořská výška dna';
$ec_lang['lpn_field_tank_base_elev_tip']='Nadmořská výška dna nádrže, od které se měří hloubka a objem vody. Je-li pole prázdné, je dno ve výšce terénu.';
$ec_lang['lpn_tank_ground_elev_tip']='Nadmořská výška terénu u nádrže. Tlak v nádrži se měří od ní, stejně jako u uzlu.';
$ec_lang['lpn_field_tank_level']='Hloubka vody';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Hloubka vody stojící v nádrži, měřená od dna nádrže směrem nahoru. Hladina vody je nadmořská výška dna nádrže plus tato hloubka.';
$ec_lang['lpn_field_tank_minlevel']='Nejnižší hloubka vody';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Hloubka vody, při které se nádrž považuje za prázdnou, měřená od dna nádrže směrem nahoru.';
$ec_lang['lpn_field_tank_maxlevel']='Nejvyšší hloubka vody';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Hloubka vody, při které je nádrž plná, měřená od dna nádrže směrem nahoru.';
$ec_lang['lpn_field_tank_diameter']='Průměr nádrže';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Šířka nádrže z jedné strany na druhou. Udává se ve stejných jednotkách jako nadmořská výška, ne v jednotkách průměru potrubí. Určuje, kolik vody daná hloubka pojme.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Nadmořská výška hladiny vody v nádrži: nadmořská výška dna plus hloubka vody.';
$ec_lang['lpn_close']='Zavřít';
// The corner buttons beside every standing box's X (Task 441). Each is an icon-only button, so the
// value is its name: the hover tip and the screen reader's label at once. Auto-hide is a toggle and
// says its state through aria-pressed, so one wording serves both states (AutoCAD's own word).
$ec_lang['lpn_dock_left']='Ukotvit vlevo od mapy';
$ec_lang['lpn_dock_right']='Ukotvit vpravo od mapy';
$ec_lang['lpn_dock_float']='Plovoucí';
$ec_lang['lpn_dock_autohide']='Automaticky skrýt';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Vlastnosti';
// What a docked Properties box says while nothing is selected: it stays in its dock (Tom, 2026-10-07).
$ec_lang['lpn_popup_none']='Není vybrán žádný prvek. Chcete-li zobrazit jeho vlastnosti, vyberte prvek na mapě.';
$ec_lang['lpn_empty_hint']='Otevřete Soubor, Nový projekt a začněte od příkladu. Nebo začněte přidáním zdroje, uzlu a potrubí z panelu nástrojů.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Vaše síť je neporušená.';
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
$ec_lang['lpn_examples_welcome']='Vítejte v modelování vodovodní sítě s řešičem EPANET';
$ec_lang['lpn_examples_heading']='Otevřít kopii příkladu';
$ec_lang['lpn_examples_sub']='Každý příklad se otevře jako kopie. Upravte ji a uložte, nebo otevřete novou kopii a začněte znovu.';
$ec_lang['lpn_examples_open']='Otevřít';
$ec_lang['lpn_examples_menu']='Otevřít příklad…';
$ec_lang['lpn_examples_blank']='Nebo začněte zde';
// The SAME exit, worded for the other way in, is lpn_close (Task 699 merged its own 'Close' key
// into it). Opened from File the user already has work on screen, so "start with a blank map"
// reads as "discard it" and they do not dare press the only button that leaves (Tom, 2026-08-17:
// "I can't back out of the gallery... I am forced to open an example"). Closing never touches a
// project either way.
$ec_lang['lpn_examples_size']='{nodes} uzlů, {links} potrubí';
$ec_lang['lpn_examples_failed']='Příklady se nepodařilo načíst. Použijte Soubor, Nový projekt pro zahájení kreslení.';
$ec_lang['lpn_examples_loading']='Načítání příkladů…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Opravit něco';
$ec_lang['lpn_help_notes']='Poznámky k této stránce';
$ec_lang['lpn_guide_about_heading']='O tomto kalkulátoru';
$ec_lang['lpn_guide_group_from']='Z nabídky {menu}';
$ec_lang['lpn_guide_menu_named']='Nabídka {menu}';
// **THE NEW BOX, TASK 745** (Tom, 2026-09-29: reorganize Help into three groups, with a new
// "Tables and Hotkeys" box gathering all table help and all keyboard shortcuts). One key names
// both the Help row and the box's own title bar, the same pattern lpn_help_notes already carries
// for the Notes box.
$ec_lang['lpn_help_hotkeys']='Tabulky a klávesové zkratky';
// **THE USER GUIDE** (Tom, 2026-10-06: "Maybe items 2 and 3 combined into a simple User Manual or
// whatever the 2026 thing is?"; Ida's design). Names both the Help row and the box's title bar. It
// replaces lpn_help_hotkeys and the Help > Toolbar fly-out (lpn_help_icons, which still heads the
// box's Toolbar section).
$ec_lang['lpn_help_manual']='Příručka';
// The Guide's contents rail, its search, its Boxes section and the "?" in every box's title bar.
$ec_lang['lpn_guide_contents']='Obsah';
$ec_lang['lpn_guide_rail_hide']='Skrýt obsah';
$ec_lang['lpn_guide_rail_show']='Zobrazit obsah';
$ec_lang['lpn_guide_search']='Hledat v příručce';
$ec_lang['lpn_guide_boxes_heading']='Okna';
$ec_lang['lpn_guide_boxes_intro']='Každé okno lze přesunout, změnit jeho velikost, ukotvit vlevo nebo vpravo od mapy, nebo zavřít. Znak ? v záhlaví okna otevře jeho nápovědu.';
// Tom's own wording, 2026-10-07 (his typo "to not" corrected). Below lpn_guide_boxes_intro.
$ec_lang['lpn_guide_boxes_autohide']='Když ukazatel okno opustí, okno bez fokusu se po krátké prodlevě skryje. Okno s fokusem se skryje, když kliknete mimo něj, stisknete Esc nebo z něj přejdete klávesou Tab, zatímco je ukazatel jinde.';
$ec_lang['lpn_guide_box_help']='Nápověda k tomuto oknu';
// A Boxes entry whose box shares its name with a section of the Guide ("Screenshot"), in the Guide
// only, so its Contents list does not show one word twice. Keep {box} as it is.
$ec_lang['lpn_guide_box_named']='Okno {box}';
// Above the Toolbar rows, shown only while some are dimmed (on a phone, or Calculate while
// Recalculate automatically is on): a grey name otherwise reads as a disabled button.
$ec_lang['lpn_guide_dimmed']='Zeslabený název je tlačítko, které je na panelu nástrojů právě skryté.';
// One entry in the Guide's Boxes section for each box, shown by the "?" in its title bar. Fire flow,
// Critical assets, and Demand scaling carry theirs in lpn_ff_intro and the keys that follow it.
$ec_lang['lpn_guide_text_popup']='Zobrazuje vlastnosti vybraného prvku, textu nebo odběratele, případně několika vybraných prvků. Okno se otevře vedle výběru nebo tam, kam bylo naposledy přesunuto. Upravená hodnota okamžitě změní síť a aktualizuje se popisek prvku na mapě i panel Tabulky. Vypočtené výsledky jsou zobrazeny jako řádky jen pro čtení a nelze je upravovat.';
$ec_lang['lpn_guide_text_find_popup']='Najde prvky, které splňují podmínku, například každé potrubí menší než 8 in nebo každý uzel pod 40 psi, a může jednou operací změnit jednu vlastnost u všech z nich. Použijte jej ke kontrole modelu před výpočtem (chybějící nadmořská výška, průměr zadaný v nesprávné jednotce), k vypsání problémových míst po výpočtu (nízký tlak, vysoká rychlost) a k provedení jedné opravy u mnoha prvků.\n\nSeznamy Kde hledat, Vlastnost, Podmínka a Hodnota sestaví jednu podmínku a zapíší ji jako řádek textu do pole Dotaz. Řádek lze také upravovat přímo a seznamy jej následují. Dotaz, který seznamy nedokážou vyjádřit, například dvě podmínky spojené pomocí NEBO, seznamy skryje, dokud není stisknuto tlačítko Použít místo toho ovládací prvky. Hledání spustíte stisknutím klávesy Enter v poli Dotaz nebo tlačítka Najít.';
$ec_lang['lpn_guide_text_settings_box']='Obsahuje nastavení otevřeného projektu a tohoto prohlížeče, uspořádaná do částí. Otevřete je volbou Voda, Nastavení. Obnovit výchozí hodnoty a Začít znovu jsou dvě tlačítka, která nastavení vracejí zpět. Okno lze prohledávat: zadejte jedno či více slov do pole Hledat v nastavení a zobrazí se jen nastavení, která zmiňují všechna z nich. Poloha a velikost tohoto okna se uchovávají pouze v tomto prohlížeči.';
$ec_lang['lpn_guide_text_library_box']='Obsahuje vzorce, křivky, typy potrubí, seznamy armatur, řídicí pravidla a pravidla projektu, každé v samostatné části. Otevřete je volbou Voda, Knihovny. Prvek odkazuje na vzorec, křivku, typ potrubí nebo seznam armatur pomocí ID dané položky a položka se vytváří, upravuje a maže zde. Vše se ukládá s projektem a Zpět vrátí úpravu provedenou zde. Poloha a velikost okna se uchovávají pouze v tomto prohlížeči.';
$ec_lang['lpn_guide_text_energy_box']='Uvádí spotřebu energie, špičkový příkon a náklady každého čerpadla za poslední simulaci s časovým průběhem, a to s použitím účinnosti každého čerpadla a ceny energie nastavené v Nastavení, Energie. Vyžaduje Celkovou dobu běhu v Nastavení a vypočítanou síť. Síť nemění.';
$ec_lang['lpn_guide_text_contour_box']='Řídí vrstevnicový graf vykreslený na mapě z hodnoty uzlu zvolené v části Barvit uzly podle: barevné schéma, výplň a její průhlednost, interval vrstevnic a popisky a jak daleko barva sahá od každého potrubí. Vypnutí graf skryje a ponechá barvy uzlů. Mění pouze zobrazení, nikoli síť.';
$ec_lang['lpn_guide_text_scncmp_box']='Vypočte z kopie výkresu každý scénář zaškrtnutý ve Správci scénářů, tedy všechny, pokud nebyla některá odškrtnuta, a pro každý uvede v tabulce počet specifických hodnot, násobitel odběru, celkovou dobu běhu, hydraulický časový krok, nejnižší tlak a nejvyšší rychlost. Otevřete je volbou Voda, Sestavy, Porovnání scénářů. Porovnání se spustí při otevření a znovu po každé úpravě, dokud zůstává otevřené.\n\nProjekt nemění a otevřený scénář zůstává tak, jak byl.';
$ec_lang['lpn_guide_text_rptbox']='Zobrazuje textovou sestavu zapsanou výpočetním jádrem EPANET pro poslední simulaci s časovým průběhem, včetně jejích varování a souhrnu sítě. Každá simulace s časovým průběhem ji nahradí; výpočet jednoho okamžiku ne a úprava ponechá předchozí sestavu beze změny.';
$ec_lang['lpn_guide_text_status_box']='Uvádí v časovém pořadí každou změnu během poslední simulace s časovým průběhem: otevření nebo zavření čerpadla, ventilu či potrubí, začátek plnění nebo vyprazdňování nádrže, její naplnění nebo vyprázdnění a každý časový krok, který plně nezkonvergoval. Uvedeny jsou jen změny, ne každý časový krok.';
$ec_lang['lpn_guide_text_full_box']='Uvádí každý uzel a každé potrubí při každém časovém kroku hlášení, v jednotkách zobrazených na panelu Tabulky. Bez simulace s časovým průběhem zobrazuje aktuální řešení v jediném okamžiku. Stažení nebo tisk zahrnuje všechny časové kroky, tabulka zobrazuje vždy jeden.';
$ec_lang['lpn_guide_text_calib_box']='Porovnává soubor terénních měření s vypočtenými výsledky na stejných místech a ve stejných časech, jeden soubor pro každou veličinu. Soubor se drží jen po dobu aktuální relace a neukládá se s projektem.';
$ec_lang['lpn_guide_text_hotkeys_popup']='Příručka. Její části jsou Použití příručky, Panel nástrojů, Nabídky, Mapa, Snímek obrazovky, Tabulky, Okna, O tomto kalkulátoru a Poznámky k této stránce. Panel nástrojů a Nabídky uvádějí každé tlačítko panelu nástrojů a každý řádek nabídky s klávesovou zkratkou, část Okna má položku pro každé okno a ostatní části popisují, co stránka dělá. Zvolením řádku se zobrazí, kde se tento ovládací prvek nachází; nikdy jej nespustí. Hledání spustíte stisknutím Ctrl+K nebo klávesou /, má-li příručka fokus. Ctrl+K nehledá, dokud je otevřena otázka.';
// The Find and replace chapter beyond its opening paragraphs, in the Guide's Boxes section
// (Tom, 2026-10-07). Each _def is HTML: keep the tags. A query inside <code> runs as written in
// English on a page in any language; translate it with the words the Find box shows in your
// language, or leave it in English. Asset IDs (60, 247, 330) and the numbers are measured on Net1
// and Net3 by dev/lpn-spike/user-guide-find-harness.js: never change them in translation.
$ec_lang['lpn_guide_find_query_term']='Dotazovací jazyk';
$ec_lang['lpn_guide_find_query_def']='<table class="lpn-notes-table"><tbody><tr><td><code>Scope.Property condition value</code></td><td>Jedna podmínka. Rozsah (seznam Kde hledat) je Vše, Uzel, Zdroj, Nádrž, Potrubí, Čerpadlo, Ventil, Text, Odběratel nebo Dávkování. Vlastnost je jakákoli položka seznamu Vlastnost pro tento rozsah.</td></tr><tr><td>Podmínky</td><td>rovno, větší než, menší než, obsahuje, n nejvyšších, n nejnižších a prázdné. Obsahuje platí pouze pro text. V n nejvyšších a n nejnižších je n počet, jako v 5 nejvyšších. Se samotným písmenem n, jako v <code>Pipe.Velocity n highest</code>, nebo s prázdným polem Hodnota se vypíše 10 prvků. Prázdné najde prvky, které nemají pro danou vlastnost žádnou hodnotu. Propojení má čtyři podmínky a nebere hodnotu.</td></tr><tr><td>Hodnoty</td><td>Číslo se zadává bez jednotky, v jednotce zobrazené ve Vlastnostech a na panelu Tabulky: 40, ne 40 psi. Text, včetně ID, se uzavírá do jednoduchých nebo dvojitých uvozovek: <code>\'60\'</code>.</td></tr><tr><td>A, NEBO a závorky</td><td>A se vyhodnocuje před NEBO a závorky seskupují podmínky. NOT není k dispozici.</td></tr><tr><td>Pravopis</td><td>Velikost písmen se nerozlišuje. Anglická slova se přijímají ve všech jazycích, takže dotaz zkopírovaný z této příručky funguje na stránce v libovolném jazyce.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_examples_term']='Příklady na Net3';
$ec_lang['lpn_guide_find_examples_def']='<p>Chcete-li příklady sledovat, otevřete příklad Net3. Tlak je v psi a rychlost v ft/s.</p><table class="lpn-notes-table"><tbody><tr><td><code>Everything.ID equal to \'60\'</code></td><td>Uzel 60 a potrubí 60. Uzel a potrubí mohou mít stejné ID, takže hledání ID v rozsahu Vše může vrátit více než jeden prvek.</td></tr><tr><td><code>Junction.Pressure below 40</code></td><td>Uzly 10, 40, 50, 20 a 153, nejnižší tlak první. Uzel 10 má -0,6 psi, tedy záporný tlak, který vyžaduje kontrolu.</td></tr><tr><td><code>Pipe.Velocity 5 highest</code></td><td>Potrubí 60, 125, 329, 123 a 149, nejvyšší rychlost první. Potrubím 60 protéká 9,3 ft/s.</td></tr><tr><td><code>Junction.Pressure below 20 OR Pipe.Velocity above 5</code></td><td>Uzly 10, 20, 40 a 50 a potrubí 60, 125 a 329: nízké tlaky a vysoké rychlosti v jednom seznamu.</td></tr><tr><td><code>Junction.Pressure below 40 AND Junction.Elevation above 100</code></td><td>Uzly 10, 20, 40 a 50, nízké tlaky na vysoko položeném terénu. Obě podmínky musí uvádět stejný druh prvku: <code>Junction.Pressure below 40 AND Pipe.Velocity above 3</code> nevyhovuje nic, protože žádný prvek není současně uzlem a potrubím.</td></tr><tr><td><code>Pipe.Closed equal to \'closed\'</code></td><td>Potrubí 330, jediné potrubí uzavřené v souboru Net3.</td></tr><tr><td><code>Junction.Connectivity no open path to a source</code></td><td>Nic, tak jak je soubor distribuován. S uzavřeným potrubím 247 (viz Nahradit a Zpět) uzly 215, 217, 219 a 225: uzly, které by porucha potrubí 247 nechala bez zásobování. Opakování pro každé potrubí je analýza kritičnosti.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_results_term']='Výsledky, výběr a Tabulky';
$ec_lang['lpn_guide_find_results_def']='<p>Odpovídající prvky jsou uvedeny pod tlačítkem Najít. Podmínky větší než a n nejvyšších uvádějí nejvyšší hodnotu první, menší než a n nejnižších nejnižší hodnotu první a ostatní podmínky řadí podle nalezené hodnoty, poté podle ID. Dotaz s A nebo NEBO uvádí nejprve uzly, potom potrubí, každé podle ID. Jediná shoda se na mapě zobrazí okamžitě. Výběrem řádku vycentrujete mapu na daný prvek. Pokud není nic vybráno, prvek se také vybere; pokud něco vybráno je, prvek se zvýrazní a výběr se nezmění. Shift+klik nebo Ctrl+klik na řádek jej přidá do výběru nebo odebere. Najít samo nevybere všechny shody.</p><p>Tlačítko Filtrovat v aktuální tabulce použije stejný dotaz na panel Tabulky. Každá tabulka, na kterou se dotaz vztahuje, zobrazí pouze odpovídající řádky, s dotazem a počtem řádků nad nimi. Chcete-li na mapě vybrat všechny shody, vyberte tyto řádky a z nabídky pravého tlačítka zvolte Vybrat na mapě. Filtr tabulky se neukládá s projektem a skončí po opětovném načtení stránky. Řádek upravený tak, že už neodpovídá, zůstane v tabulce, zeslabený a označený výstražnou značkou, dokud není znovu stisknuto tlačítko Filtrovat v aktuální tabulce.</p>';
$ec_lang['lpn_guide_find_replace_term']='Nahradit a Zpět';
$ec_lang['lpn_guide_find_replace_def']='<p>Část Změnit nalezené v okně zapíše jednu vlastnost u každého prvku nalezeného dotazem. Zvolte vlastnost v seznamu Vlastnost ke změně, zadejte novou hodnotu do pole Nová hodnota v zobrazené jednotce a stiskněte tlačítko Nahradit. Okno poté uvede, kolika prvků by se změna týkala, bez těch, které už novou hodnotu mají. Změnu provedete tlačítkem Změnit je, nebo ji zrušíte tlačítkem Zrušit. Jedno Zpět vrátí celou náhradu.</p><p>Příklad na Net1: <code>Pipe.Diameter below 10</code> najde potrubí 31, 122, 113 a 121. Zvolte Průměr, zadejte 10 a stiskněte Nahradit; okno zobrazí „Změnit 4 prvky?“. Tlačítkem Změnit je nastavíte všechna čtyři potrubí na 10 in. Jedno Zpět je vrátí na 6 a 8 in.</p><p>Příklad na Net3: <code>Pipe.ID equal to \'247\'</code> najde potrubí 247. Zvolte Uzavřeno, v seznamu Nová hodnota znovu zvolte Uzavřeno a stiskněte Nahradit a poté Změnit je; potrubí se tak uzavře pro příklad propojení výše. Zpět je znovu otevře.</p><p>Nahrazení vyžaduje jeden druh prvku, takže v rozsahu Everything nejprve zvolte druh prvku v seznamu Kde hledat. Ve scénáři jiném než Základní se náhrada uloží v tomto scénáři, stejně jako stejná úprava ve Vlastnostech. Tam, kde jsou k dispozici výšky z Mapbox, lze Nadmořskou výšku nahradit z Mapbox DEM místo zadané hodnoty.</p>';
$ec_lang['lpn_guide_find_notes_term']='Poznámky k použití';
$ec_lang['lpn_guide_find_notes_def']='<ul><li>Hodnoty se porovnávají v plné přesnosti a uvádějí se na čtyři desetinná místa. Rovno zřídka vyhovuje vypočtenému výsledku; použijte větší než a menší než.</li><li>Tlak, tlaková výška, průtok, rychlost a ostatní výsledky pocházejí z posledního výpočtu. Při zrušeném nastavení Přepočítávat automaticky popisují síť tak, jak byla při posledním Vypočítat.</li><li>Větší než a menší než u textu používají abecední pořadí, přičemž čísla se řadí číselně: na Net1 najde <code>Junction.ID above \'20\'</code> uzly 21, 22, 23, 31 a 32.</li><li>V rozsahu Vše jsou nabízeny jen ID, Popis, Značka a Propojení. Chcete-li vidět úplný seznam vlastností, zvolte druh prvku v seznamu Kde hledat.</li><li>Položka Text nemá ID. Hledejte ji podle jejích slov, jako v <code>Text.Text contains \'pump\'</code>.</li><li>Čtyři podmínky Propojení pro uzel jsou u uzlu nejsou žádná potrubí, u uzlu nejsou žádná otevřená potrubí, k uzlu nevede žádná cesta ke zdroji a k uzlu nevede žádná otevřená cesta ke zdroji. Zdrojem je zdroj nebo nádrž.</li></ul>';
// The Scenarios chapter, in the entry for the Scenario manager box (Task 785). Written from the code of
// feat/bentley-interop and held by dev/lpn-spike/user-guide-scenarios-harness.js. The box's own help
// (lpn_sm_help, Tom's wording of 2026-10-16) comes first in the entry; nothing here restates or
// contradicts it. Terms follow the Find and replace chapter's pattern.
$ec_lang['lpn_guide_scn_use_term']='K čemu scénář slouží';
$ec_lang['lpn_guide_scn_use_def']='<p>Scénáře uchovávají v jednom projektu mnoho návrhů, pohledů nebo situací, například průměrný den, maximální den, špičkovou hodinu, obrázek pro prezentaci v sestavě, vyřazený hlavní řad nebo navrhovanou výměnu. Síť se nakreslí jednou, v základním scénáři. Každý další scénář uchovává jen své specifické hodnoty, tedy hodnoty, které se liší od scénáře, z něhož dědí, a vše ostatní přebírá z tohoto scénáře. Úprava základního scénáře proto zasáhne každý scénář, který tuto hodnotu nepřepsal.</p><p>Nový projekt začíná šesti připravenými scénáři: 1. Zkouška průtoku: statická, 2. Zkouška průtoku: střední, 3. Zkouška průtoku: maximální, 4. Průměrný den, 5. Maximální den a 6. Špičková hodina. Jsou to běžné scénáře, které lze přejmenovat, upravit i smazat. Každý začíná jednou specifickou hodnotou, svým násobitelem odběru: 1 pro zkoušky průtoku a Průměrný den, 2 pro Maximální den a 3 pro Špičkovou hodinu. Násobitele jsou zástupné hodnoty, které je třeba nahradit hodnotami pro modelovanou soustavu. Projekt otevřený ze souboru, včetně každého příkladu, nebo importovaný ze souboru EPANET má pouze základní scénář.</p><p>Požární průtok se kontroluje v okně Požární průtok: analýza, které testuje každý uzel nebo vybrané uzly. Při jejím spuštění bývá otevřen scénář Maximální den.</p>';
$ec_lang['lpn_guide_scn_open_term']='Otevřený scénář';
$ec_lang['lpn_guide_scn_open_def']='<p>Tlačítko Scénář ve stavovém pruhu pod mapou uvádí název otevřeného scénáře a počet jeho specifických hodnot, například Scénář: Základní | Počet specifických hodnot: 0. Kliknutím na něj nebo volbou Voda, Scénáře přepnete scénář nebo přidáte, zkopírujete, přejmenujete či smažete scénář. Každý scénář v seznamu uvádí v závorce počet svých specifických hodnot a u otevřeného je zaškrtnutí. Řádek Správce scénářů otevře strom scénářů a alternativ. Je zašedlý, dokud je Základní režim zaškrtnut.</p><p>Výkres, popisky, Vlastnosti, Tabulky i výsledky patří otevřenému scénáři a stránka počítá pouze otevřený scénář. Porovnání scénářů, popsané ve vlastní položce, počítá ostatní z kopií. Otevřený scénář se ukládá s projektem.</p>';
$ec_lang['lpn_guide_scn_marks_term']='Kde se specifické hodnoty zobrazují';
$ec_lang['lpn_guide_scn_marks_def']='<p>Na mapě je prvek, který má v otevřeném scénáři specifickou hodnotu, obkroužen žlutooranžově a prvek, který dědí specifickou hodnotu z nadřazeného scénáře nebo alternativy, je obkroužen čárkovanou šedou čarou. U odběru, průměru, drsnosti, součinitele místní ztráty a délky se kroužek zobrazí jen tehdy, když Nastavení, Vizualizace, Popisky uzlů nebo Popisky spojů zobrazují tuto hodnotu na mapě; specifická hodnota jakékoli jiné vlastnosti má kroužek vždy. V Tabulkách je buňka s hodnotou nastavenou otevřeným scénářem žlutooranžová a její tip uvádí alternativu, která ji drží, například Fyzikální alt.: Větší řad. Zobrazit scénáře v nabídce buňky tabulky uvede každý prvek jednou pro každý scénář.</p><p>Každý řádek Vlastností, který může scénář přepsat, má vlevo značku. Plná tečka znamená, že hodnotu přepisuje otevřený scénář; kliknutím na ni specifickou hodnotu zrušíte. Prázdná tečka znamená, že hodnota je zděděná; kliknutím na ni se zobrazená hodnota stane specifickou hodnotou. Trojúhelník znamená, že hodnotu přepisují scénáře pod tímto; kliknutím na něj jejich specifické hodnoty po potvrzení zrušíte. Pod přepsaným řádkem je zděděná hodnota, kterou nahrazuje, například Základní scénář: 18. Okno Nastavení má jen plnou tečku a trojúhelník, protože specifickou hodnotu tvoří už samotné zadání hodnoty.</p><p>Kroužky skryjete odškrtnutím Zobrazit značky specifických hodnot na mapě v Nastavení, Mapa a stránka, Stránka, nebo volbou Mapa, Vyčistit mapu. Obojí se uchovává v tomto prohlížeči, ne v projektu. Tabulky označují specifické hodnoty v obou případech.</p>';
$ec_lang['lpn_guide_scn_make_term']='Vytváření a rušení specifických hodnot';
$ec_lang['lpn_guide_scn_make_def']='<p>Je-li otevřen jiný scénář než Základní, ukládá se úprava hodnoty, kterou scénáře mohou přepsat, jako specifická hodnota otevřeného scénáře, ať je provedena jakkoli: zadáním ve Vlastnostech, úpravou buňky v Tabulkách, volbou Nahradit v Najít a nahradit, přetažením uzlu nebo zadáním jeho souřadnic, Změnou typu (nový typ je specifická hodnota) nebo Vložením vlastností do výběru. Nastavení zadané v okně Nastavení se ukládá jako specifická hodnota, mohou-li scénáře toto nastavení přepsat. Základní scénář se nemění. V základním scénáři tytéž úpravy mění samotnou síť a zasáhnou každý scénář, který hodnotu nepřepsal.</p><p>Smazat působí jinak. Ve scénáři Smazat neodstraní prvek, který existuje v základním scénáři. Učiní prvek neaktivním v otevřeném scénáři, u uzlu i jeho potrubí, a zpráva to oznámí. Prvek zůstává ve výkresu i v ostatních scénářích. Prvek nakreslený při otevřeném scénáři je neaktivní v základním scénáři a aktivní v tomto scénáři a Smazat v tomto scénáři jej odstraní. Smazání prvku v základním scénáři smaže také jeho specifické hodnoty v každém scénáři, a to po otázce, která je spočítá. Odběratelé a Útvary nepatří žádnému scénáři a mažou se úplně.</p><p>Řádek Správce specifických hodnot v seznamu Scénáře otevře seznam všech specifických hodnot otevřeného scénáře podle kategorií, každou vedle zděděné hodnoty, kterou nahrazuje. Graf časové řady na mapě, který scénář otevřel, přesunul nebo změnil, je samostatný řádek. Zaškrtněte řádky a klikněte na Zrušit vybrané specifické hodnoty, klikněte na Zrušit specifickou hodnotu v jednom řádku nebo klikněte na Zrušit všechny specifické hodnoty. Každá hodnota se pak vrátí na zděděnou hodnotu a Zpět to vrátí. Vyberte v seznamu ID a přejdete na prvek na mapě. Tečka ve Vlastnostech a řádek Zrušit specifickou hodnotu v nabídce buňky Tabulek ruší vždy jednu specifickou hodnotu.</p>';
$ec_lang['lpn_guide_scn_scope_term']='Co scénář může a nemůže přepsat';
$ec_lang['lpn_guide_scn_scope_def']='<table class="lpn-notes-table"><tbody><tr><td>Vlastnosti</td><td>Každá vlastnost uzlu nebo spoje s výjimkou níže uvedených, včetně jeho polohy, zda je aktivní, a jeho typu (Změnit typ). Text může přepsat svá slova, polohu, velikost, zarovnání, tučné písmo, úhel a zda se zobrazuje. Vlastní vlastnost lze přepsat vždy. Vlastnosti jsou rozděleny do kategorií Fyzikální, Odběr, Aktivní topologie, Počáteční nastavení, Složka, Požární průtok, Náklady na energii, Vlastní vlastnosti, Text, Prezentace a Výpočet.</td></tr><tr><td>Nastavení</td><td>Nastavení uložená s projektem s výjimkou níže uvedených: možnosti výpočtu (například násobitel odběru, celková doba běhu, hydraulický časový krok a metoda tření), výchozí vzorec odběru, hodnoty přidělené novým prvkům a nastavení prezentace (velikosti, barvy, popisky, vrstevnice, pohled mapy a grafy časových řad na mapě).</td></tr><tr><td>Stejné v každém scénáři</td><td>ID, Popis a Značka prvku; koncové uzly a zlomy spoje; Odběratelé a Útvary; jednotky a souřadnicový systém; a obsah Knihoven (vzorce, křivky, typy potrubí, seznamy armatur, řídicí pravidla a pravidla). Úprava kteréhokoli z nich mění každý scénář. Scénář může prvku přiřadit jinou křivku, typ potrubí, seznam armatur nebo vzorec, ale nemůže měnit, co v nich je.</td></tr></tbody></table>';
$ec_lang['lpn_guide_scn_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_scn_example_def']='<p>Otevřete příklad Net1. Zvolte Voda, Scénáře, Nový scénář…, zadejte Větší řad a klikněte na OK. Vyberte na mapě Potrubí 10 a ve Vlastnostech zadejte pro Průměr 24; Základní scénář má 18 in, což je zobrazeno pod polem jako Základní scénář: 18. V seznamu Scénáře zvolte Základní, znovu zvolte Nový scénář…, zadejte Maximální den a v Nastavení, Výpočet, Hydraulika zadejte pro Násobitel odběru 1,8. Poté zvolte Voda, Sestavy, Porovnání scénářů.</p><table class="lpn-notes-table"><tbody><tr><td>Scénář</td><td>Počet specifických hodnot</td><td>Násobitel odběru</td><td>Nejnižší tlak</td><td>Nejvyšší rychlost</td></tr><tr><td>Základní</td><td>0</td><td>1</td><td>108 psi v N32, 14:00</td><td>2,76 ft/s v L11, 16:00</td></tr><tr><td>Větší řad</td><td>1</td><td>1</td><td>109 psi v N32, 14:00</td><td>2,87 ft/s v L11, 16:00</td></tr><tr><td>Maximální den</td><td>1</td><td>1,8</td><td>15,78 psi v N32, 9:00</td><td>3,49 ft/s v L10, 9:00</td></tr></tbody></table><p>Celková doba běhu je ve všech třech 24:00, takže každý nejnižší tlak a nejvyšší rychlost je extrém za den, v uvedeném čase. Větší řad zvýší nejnižší tlak asi o 1 psi. Násobitel 1,8 jej sníží na 15,78 psi v 9:00 a nejvyšší rychlost se přesune na Potrubí 10. Každý scénář má jednu specifickou hodnotu a Základní si ponechává své hodnoty.</p>';
$ec_lang['lpn_guide_scn_notes_term']='Na co dát pozor';
$ec_lang['lpn_guide_scn_notes_def']='<ul><li>Specifická hodnota rovná zděděné hodnotě je stále specifickou hodnotou. Počítá se a Správce specifických hodnot ji označuje (stejná).</li><li>Základní režim je nastavení tohoto prohlížeče, ne projektu. Je zakázán pro projekt, jehož scénáře a alternativy nedokáže zobrazit. Alternativy a Správce scénářů jsou popsány v nápovědě na začátku této položky.</li><li>Zpět uchovává 20 kroků. Každý krok obnoví spolu s výkresem také scénáře a otevřený scénář, takže přidání, přejmenování i smazání scénáře lze vrátit.</li><li>Export souboru EPANET zapíše pouze otevřený scénář, s hodnotami a polohami uzlů, které tento scénář čte. Samotné scénáře se zaznamenávají jen v souboru projektu.</li></ul>';
// The Scenario comparison chapter beyond its opening paragraphs (lpn_guide_text_scncmp_box), copied into
// the box's entry by renderGuideBoxes() from <template id="lpn_guide_more_lpn_scncmp_box">. Task 785.
$ec_lang['lpn_guide_cmp_cols_term']='Co tabulka obsahuje';
$ec_lang['lpn_guide_cmp_cols_def']='<table class="lpn-notes-table"><tbody><tr><td>Scénář</td><td>Název scénáře. Otevřený scénář je označen (právě otevřený).</td></tr><tr><td>Počet specifických hodnot</td><td>Specifické hodnoty samotného scénáře, počítané jako v seznamu Scénáře. Možnost výpočtu, například násobitel odběru, se počítá jako jedna a počítá se i specifická hodnota rovná zděděné hodnotě.</td></tr><tr><td>Násobitel odběru, Celková doba běhu, Hydraulický časový krok</td><td>Hodnoty, s nimiž byl scénář vypočten, jeho vlastní nebo hodnoty projektu. Ustálený scénář ukazuje u časového kroku pomlčku.</td></tr><tr><td>Nejnižší tlak</td><td>Nejnižší tlak v uzlu s jeho ID a časem, kdy nastane. Zdroje a nádrže jsou vynechány, protože každý má pevnou tlakovou výšku.</td></tr><tr><td>Nejvyšší rychlost</td><td>Nejvyšší rychlost v potrubí nebo ventilu s jeho ID a časem, kdy nastane. Čerpadla jsou vynechána.</td></tr></tbody></table>';
$ec_lang['lpn_guide_cmp_run_term']='Ustálené scénáře a scénáře s dlouhodobou simulací';
$ec_lang['lpn_guide_cmp_run_def']='<p>Scénář s Celkovou dobou běhu větší než 0 se počítá po celé období jádrem EPANET. Jeho nejnižší tlak a nejvyšší rychlost jsou extrémy přes všechny časové kroky, každý s uvedeným časem. Scénář s Celkovou dobou běhu 0 se řeší v jednom okamžiku. Celková doba běhu je jednou z možností, které scénář může přepsat, takže jedna tabulka může obsahovat oba druhy.</p>';
$ec_lang['lpn_guide_cmp_notes_term']='Na co dát pozor';
$ec_lang['lpn_guide_cmp_notes_def']='<ul><li>Scénář, který nelze vyřešit, ukazuje místo svých dvou výsledků důvod, například že uzel nemá cestu ke zdroji poté, co bylo potrubí učiněno neaktivním. Ostatní scénáře se přesto vypočtou. Scénář, který nekonvergoval, ukazuje své poslední výsledky a zprávu.</li><li>Blok nad tabulkou, Stejné v každém scénáři, uvádí metodu tření, jednotky, přesnost a maximální počet pokusů. Nastavení, které se mezi scénáři liší, je z bloku vynecháno.</li><li>Neexistuje žádná mez pro vyhovění či nevyhovění. Čísla posuzujte podle návrhových kritérií modelované soustavy.</li><li>Příklad uvedený v položce Správce scénářů porovnává tři scénáře na Net1.</li></ul>';
// The Libraries chapter, in the entry for the Libraries box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_library_box">. Written from the code and held by
// dev/lpn-spike/user-guide-library-harness.js.
$ec_lang['lpn_guide_lib_kinds_term']='Co která část obsahuje';
$ec_lang['lpn_guide_lib_kinds_def']='<table class="lpn-notes-table"><tbody><tr><td>Vzorce</td><td>Seznam násobitelů, který se opakuje po celou dobu běhu, jeden násobitel pro každý časový krok vzorce. Nový vzorec tvoří 24 násobitelů 1. Vložením sloupce z tabulky se vyplní pole Násobitele. Výchozí vzorec odběru je označen (výchozí) a volí se v Nastavení, Výpočet, Hydraulika.</td></tr><tr><td>Křivky</td><td>Čtyři druhy, volené jako Typ křivky: Tlaková výška čerpadla, Účinnost čerpadla, Objem nádrže a Ztráta tlakové výšky ventilu. Body se zadávají do mřížky, která přijímá vložený sloupec z tabulky nebo řádky zkopírované ze souboru EPANET. Křivka tlakové výšky čerpadla se proloží body a řádek Rovnice ukazuje proložení; jeden bod se čte jako návrhový bod s uzavírací tlakovou výškou 1,33334násobku jeho tlakové výšky a maximálním průtokem 2násobku jeho průtoku, jak jej čte EPANET. Ostatní druhy spojují své body přímkami. Čerpadlo nebo ventil uvádí svou křivku ve Vlastnostech, kde odkaz Křivky otevře tuto část.</td></tr><tr><td>Typy potrubí</td><td>Definice průměru, drsnosti a koeficientů reakcí, na kterou odkazuje více potrubí. Vlastnost může být v definici ponechána prázdná a pak se zadává u každého potrubí. Ve Vlastnostech jsou hodnoty, které typ potrubí uvádí, zakázané a Odpojit od typu potrubí je zkopíruje do potrubí a potrubí přestane typ používat.</td></tr><tr><td>Armatury</td><td>Seznamy armatur s počtem kusů u každé, sečtené do jednoho součinitele místní ztráty k pro potrubí nebo typ potrubí. Nabízeno je třináct armatur z tabulky 3.3 uživatelské příručky EPANET 2.2 a Jiná armatura. Zvolením jedné se její součinitel zkopíruje do řádku, kde jej lze změnit.</td></tr><tr><td>Řídicí pravidla</td><td>Každé je jedním příkazem v syntaxi EPANET, například <code>LINK id OPEN IF NODE id BELOW value</code>. Pod každým okno uvádí, zda mu bylo porozuměno.</td></tr><tr><td>Pravidla</td><td>Každé má několik řádků v syntaxi EPANET: RULE, IF, AND, OR, THEN, ELSE a PRIORITY. Pod každým okno uvádí, zda bylo přečteno.</td></tr></tbody></table>';
$ec_lang['lpn_guide_lib_refs_term']='Přejmenování, mazání a co na položku odkazuje';
$ec_lang['lpn_guide_lib_refs_def']='<p>ID se mění v jeho části. Prázdné ID ani ID již použité ve stejné části se nepřijme. Přejmenováním položky se přesunou všechny odkazy na ni, v základním scénáři i v každém dalším. U vzorce jsou odkazy vzorec odběru uzlu a vzorec každé jeho kategorie odběru, vzorec odběru odběratele, vzorec tlakové výšky zdroje, vzorec otáček čerpadla a výchozí vzorec odběru.</p><p>Vzorec, který se používá, lze smazat a každý odkaz na něj se zruší. Byl-li to výchozí vzorec odběru, oznámení uvede, jaký vzorec nyní používají uzly bez vzorce. Křivka, typ potrubí nebo seznam armatur, které se používají, se nemažou. Zpráva uvádí prvky, které je používají, a každému z nich je třeba nejprve přiřadit jinou křivku nebo jej odpojit od typu či seznamu.</p>';
$ec_lang['lpn_guide_lib_scn_term']='Knihovny a scénáře';
$ec_lang['lpn_guide_lib_scn_def']='<p>Knihovny jsou ve všech scénářích stejné. Scénář může prvku přiřadit jinou křivku, typ potrubí, seznam armatur nebo vzorec, což je specifická hodnota tohoto prvku, ale obsah položky se nepřepisuje. Úprava vzorce, křivky, typu potrubí, seznamu armatur, řídicího pravidla nebo pravidla ji mění pro každý scénář, ať je otevřen kterýkoli. Výchozí vzorec odběru je nastavení, nikoli položka, a scénář může mít vlastní.</p><p>Řídicí pravidlo nebo pravidlo, které uvádí prvek neaktivní v otevřeném scénáři, se při výpočtu tohoto scénáře ignoruje a okno Knihovny je vypíše. Ignoruje se s varováním také to, které uvádí prvek, jejž projekt nemá.</p>';
$ec_lang['lpn_guide_lib_ctl_term']='Řídicí pravidla a pravidla při výpočtu';
$ec_lang['lpn_guide_lib_ctl_def']='<p>Řídicí pravidlo je jeden příkaz. Pravidlo je několik řádků, které začínají RULE. Klíčová slova se zadávají anglicky bez ohledu na jazyk stránky a čísla jsou v jednotkách projektu. Přidat řídicí pravidlo vychází z příkazu sestaveného ze sítě, který se pak upraví na zamýšlený.</p><p>Řídicí pravidla a pravidla mění výsledek jen při dlouhodobé simulaci, tedy když je Celková doba běhu větší než 0. Ustálené řešení nemění ani jedno. Pravidla uplatňuje pouze jádro EPANET. Obojí se ukládá s projektem a zapisuje se do souboru EPANET.</p>';
$ec_lang['lpn_guide_lib_import_term']='Import knihoven z jiného projektu';
$ec_lang['lpn_guide_lib_import_def']='<p>Soubor, Importovat…, Importovat knihovny… otevře jiný soubor projektu a zkopíruje z něj celé knihovny do tohoto projektu. Položka, jejíž název se zde již používá, se přeskočí a vypíše, takže nic, co už zde je, se nezmění. Uvádějí-li soubor a projekt veličinu v různých jednotkách, zobrazí se varování a položky se importují tak, jak jsou zapsány. Typy potrubí, které odkazují na seznam armatur, jenž tento projekt nemá, se vypíší; vyřešíte to importem knihovny armatur ze stejného souboru.</p>';
$ec_lang['lpn_guide_lib_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_lib_example_def']='<p>Otevřete příklad Net1 a zvolte Voda, Knihovny. Vzorce obsahují vzorec 1, Demand Pattern, s 12 násobiteli po 2:00, pokrývající 24:00, označený (výchozí). Křivky obsahují křivku 1, Pump Curve for Pump 9, křivku tlakové výšky čerpadla s jedním bodem, 1500 gpm při 250 ft. Řídicí pravidla obsahují dva příkazy: první otevře Spoj 9, když Uzel 2 klesne pod 110, a druhý jej zavře, když Uzel 2 stoupne nad 140. Pravidla obsahují dvě pravidla, která testují čas hodin a hladinu Nádrže 2.</p><p>Zvolte Voda, Vypočítat a poté Voda, Sestavy, Změny stavu. Čerpadlo L9 je nyní zavřeno v 10:00, nyní otevřeno v 15:00 a nyní zavřeno v 21:00 a Nádrž N2 se nyní vyprazdňuje ve 22:00. V Řídicích pravidlech změňte ve druhém pravidle 140 na 135 a znovu zvolte Voda, Vypočítat. Poslední zavření se přesune na 20:00 a Nádrž N2 se nyní vyprazdňuje v 21:00.</p>';
$ec_lang['lpn_guide_lib_notes_term']='Na co dát pozor';
$ec_lang['lpn_guide_lib_notes_def']='<ul><li>Vzorec se opakuje po celou dobu běhu, takže nemusí pokrývat celý běh.</li><li>Soubor EPANET nemá místo pro typ potrubí ani seznam armatur. Soubor nese čísla, která každé potrubí čte, a export uvádí, která potrubí byla zploštěna.</li><li>Poloha a velikost okna Knihovny se uchovávají v tomto prohlížeči. Položky se ukládají s projektem.</li></ul>';
// The Properties chapter, in the entry for the Properties box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_popup">. Held by dev/lpn-spike/user-guide-properties-harness.js.
$ec_lang['lpn_guide_prop_open_term']='Otevření Vlastností';
$ec_lang['lpn_guide_prop_open_def']='<p>V režimu Výběr klikněte na uzel, spoj, text nebo odběratele a Vlastnosti se otevřou vedle něj nebo tam, kam bylo okno naposledy přesunuto. Kliknutím se Shiftem na další prvek jej přidáte do výběru. Je-li vybráno více prvků, okno uvádí, co lze nastavit na všech najednou (viz Vybráno více prvků níže). Útvar nemá okno Vlastností, protože jeho body se upravují na mapě.</p><p>Nabídka po kliknutí pravým tlačítkem na uzel nebo spoj obsahuje Kopírovat vlastnosti, Vložit vlastnosti do výběru a Graf časové řady. Na dotykové obrazovce stejnou nabídku vyvoláte stisknutím a podržením prvku. Graf časové řady vyžaduje výsledky dlouhodobé simulace.</p>';
$ec_lang['lpn_guide_prop_edit_term']='Úprava hodnoty';
$ec_lang['lpn_guide_prop_edit_def']='<p>Hodnota se uplatní po potvrzení pole, tedy jeho opuštěním nebo stisknutím Enter. Čte se v jednotce uvedené v jeho popisku, bez převodu, a řídí se jí popisek na mapě, Tabulky i výsledky. Vypočtené hodnoty jsou řádky jen pro čtení bez pole pro zadání. U spoje následují za jeho vstupy a u uzlu jsou mezi nimi. Jsou to výsledky posledního výpočtu v zobrazeném čase a při odškrtnutém Přepočítávat automaticky jsou to výsledky posledního Vypočítat.</p><p>Potrubí, které používá typ potrubí, zobrazuje hodnoty, jež typ uvádí, jako zakázané. Kliknutím na Odpojit od typu potrubí tyto hodnoty zkopírujete do potrubí a upravíte je tam.</p>';
$ec_lang['lpn_guide_prop_id_term']='ID';
$ec_lang['lpn_guide_prop_id_def']='<p>ID se upravuje v záhlaví okna. Nesmí obsahovat mezeru ani uvozovky a ID uzlu nesmí být shodné s ID jiného uzlu, ani ID spoje s ID jiného spoje. Uzel a spoj mohou mít stejné ID. Odmítnuté ID ponechá původní a zobrazí zprávu. Přejmenování prvku přenese jeho specifické hodnoty ve scénářích s ním.</p>';
$ec_lang['lpn_guide_prop_scn_term']='Ve scénáři';
$ec_lang['lpn_guide_prop_scn_def']='<p>V jiném scénáři než Základní se úprava hodnoty, kterou scénáře mohou přepsat, ukládá jako specifická hodnota otevřeného scénáře a řádek je vlevo označen. Položka Správce scénářů popisuje značky a uvádí, co je ve všech scénářích stejné: ID, Popis a Značka. Odběratel nemá žádné hodnoty podle scénáře. Přepnutí scénářů ponechá Vlastnosti otevřené na stejném prvku a zobrazí hodnoty scénáře, který je nyní otevřen.</p>';
$ec_lang['lpn_guide_prop_multi_term']='Vybráno více prvků';
$ec_lang['lpn_guide_prop_multi_def']='<p>Záhlaví uvádí například 2 vybráno. Okno má jednu část pro každý typ prvku ve výběru, nadepsanou názvem typu a počtem prvků tohoto typu, například Potrubí (2), a každou část lze sbalit. Část uvádí vlastnosti, které mají Tabulky jako sloupce a které lze nastavit na každém prvku v ní. Výsledky a hodnoty, které uvádí typ potrubí, se nevypisují. Řádek ukazuje hodnotu, kterou mají prvky společnou, nebo Různé, liší-li se.</p><p>Zadáním hodnoty do řádku se nastaví na každém prvku daného typu ve výběru. Řádek, kterého se nikdo nedotkne, nic nezapíše. Oznámení uvádí počet, například Nastaveno Průměr (in) na 2., a jedno Zpět vrátí celý řádek. V jiném scénáři než Základní se hodnoty ukládají jako specifické hodnoty.</p>';
$ec_lang['lpn_guide_prop_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_prop_example_def']='<p>Otevřete příklad Net1 a klikněte na Potrubí 10. Vlastnosti uvádějí jeho vstupy od Popisu po Je aktivní? a poté jeho výsledky v zobrazeném čase: Průtok 1866,2 gpm, Rychlost 2,4 ft/s a Ztráta tlakové výšky 19,12 ft H2O.</p><p>Klikněte na Potrubí 113 a klikněte se Shiftem na Potrubí 31. Záhlaví uvádí 2 vybráno, jedinou částí je Potrubí (2) a Průměr ukazuje Různé, protože Potrubí 31 má 6 in a Potrubí 113 má 8 in. Zadejte pro Průměr 10. Oznámení uvádí Nastaveno Průměr (in) na 2., obě potrubí mají 10 in a jedno Zpět je vrátí na 6 a 8 in.</p>';
// The Settings chapter, in the entry for the Settings box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_settings_box">. Held by dev/lpn-spike/user-guide-settings-harness.js.
$ec_lang['lpn_guide_set_where_term']='Části a kam se nastavení ukládají';
$ec_lang['lpn_guide_set_where_def']='<p>Seznam vlevo v okně přeskočí na část nebo podnadpis. Části jsou Vizualizace (Popisky uzlů, Barvy uzlů, Popisky spojů, Barvy spojů, Odběratel a Uzel a spoj), Mapa a stránka (Vzhled a Stránka), Prvky (Předpony ID, Hodnoty nových prvků a Vlastní vlastnosti), Výpočet (Jednotky, Čas, Hydraulika, Energie a Kvalita vody) a Poděkování. Každý podnadpis uvádí, zda jsou jeho nastavení Uloženo s projektem, nebo Uloženo v tomto prohlížeči. Vše se ukládá s projektem kromě nastavení v části Stránka a jednoho řádku v Hydraulice, Zobrazit okno průběhu výpočtu, který sám uvádí Uloženo v tomto prohlížeči.</p><p>Karta Nastavení v Tabulkách uvádí tatáž nastavení jako řádky s jejich Kategorií a Hodnotou, takže je lze najít a zkontrolovat i tam.</p>';
$ec_lang['lpn_guide_set_search_term']='Hledání';
$ec_lang['lpn_guide_set_search_def']='<p>Zadejte jedno či více slov do pole Hledat v nastavení a zobrazí se jen nastavení, která zmiňují všechna z nich, v názvu nebo v tipu. Slovo, které odpovídá nadpisu, zobrazí každé nastavení pod tímto nadpisem. Například krytí uvede Krytí symbolu (0 až 1) a Krytí podkladového obrázku (0 až 1); krytí symbolu uvede jen první; a kropení uvede Exponent emitoru, jehož tip kropení zmiňuje a jehož název nikoli. Hledání žádné nastavení nemění.</p>';
$ec_lang['lpn_guide_set_scn_term']='Nastavení ve scénáři';
$ec_lang['lpn_guide_set_scn_def']='<p>V jiném scénáři než Základní se hodnota zadaná pro nastavení, které scénáře mohou přepsat, ukládá jako specifická hodnota a řádek je označen plnou tečkou. Trojúhelník označuje nastavení, které přepisují scénáře pod otevřeným. Položka Správce scénářů uvádí, která nastavení lze přepsat. Jednotky jsou ve všech scénářích stejné. Obnovit výchozí hodnoty je mimo Základní zašedlé a Použít tyto hodnoty pro nové prvky na všechny stávající prvky je tam odmítnuto, protože mění samotný výkres.</p>';
$ec_lang['lpn_guide_set_units_term']='Změna jednotky';
$ec_lang['lpn_guide_set_units_def']='<p>Každá veličina má v části Jednotky vlastní jednotku. Jsou-li hodnoty v projektu zadány v této jednotce, změna se nejprve zeptá. Nedestruktivní ponechá každé číslo tak, jak bylo zadáno, a čte je v nové jednotce. Destruktivní přepíše čísla převodem, takže síť zůstane fyzikálně stejná, a původní čísla se ztratí, pokud nepoužijete Zpět; jedno Zpět obnoví čísla i jednotku. Zrušit ponechá vše, jak bylo.</p><p>Příklad na Net1: zvolte v Jednotkách pro Průměr mm. Destruktivní přepíše 13 hodnot a Potrubí 10 se čte 457,2 mm. Nedestruktivní 13 hodnot nechá být a Potrubí 10 se čte 18 mm.</p>';
$ec_lang['lpn_guide_set_assets_term']='Nové prvky a použití hodnot na stávající';
$ec_lang['lpn_guide_set_assets_def']='<p>Předpony ID a Hodnoty nových prvků platí pro prvky kreslené od nynějška. Již nakreslené prvky nemění. Použít na vše vedle předpony ID dá každému stávajícímu prvku tohoto druhu ID začínající předponou; každý si ponechá své číslo a ID, které nekončí číslem, se nemění. Použít tyto hodnoty pro nové prvky na všechny stávající prvky po otázce nahradí tyto vlastnosti na každém stávajícím prvku, ale jen u vlastností, jejichž popisky jsou na mapě zobrazeny. Zpět to vrátí.</p>';
$ec_lang['lpn_guide_set_reset_term']='Obnovit výchozí hodnoty a Začít znovu';
$ec_lang['lpn_guide_set_reset_def']='<p>Obnovit výchozí hodnoty se nejprve zeptá a poté vrátí předpony ID, hodnoty nových prvků, nastavení řešiče, vzhled mapy, polohu legendy a viditelné popisky otevřeného projektu na původní hodnoty. Síť se nemění, ostatní projekty to neovlivní a jedno Zpět nastavení vrátí.</p><p>Začít znovu se nejprve zeptá a poté smaže každý projekt, každý podkladový obrázek, všechna nastavení a volby jednotek uložené v tomto prohlížeči a znovu načte stránku tak, jak by ji viděl nový návštěvník. Nelze to vrátit.</p>';
// The Toolbar chapter (Task 785), terms in the Toolbar section above its rows. Held by
// dev/lpn-spike/user-guide-toolbar-harness.js.
$ec_lang['lpn_guide_tb_row_term']='Čtení řádku';
$ec_lang['lpn_guide_tb_row_def']='<p>Každý řádek je jedno tlačítko panelu nástrojů, v pořadí pruhu, s oddělovačem mezi skupinami. Řádek ukazuje ikonu tlačítka, jeho název a tip, poté jeho klávesy. Dělá-li totéž řádek nabídky, řádek za slovy Také v nabídce ukazuje i cestu nabídkou. Kliknutí na řádek ukáže na tlačítko na panelu nástrojů. Tlačítko nikdy nespustí. Není-li tlačítko na obrazovce, řádek otevře řádek nabídky, který dělá totéž.</p>';
$ec_lang['lpn_guide_tb_dim_term']='Zašedlé názvy';
$ec_lang['lpn_guide_tb_dim_def']='<p>Zašedlý název patří tlačítku, které teď není na obrazovce. Tlačítko, které na obrazovce je, není zašedlé, ať už může v daném okamžiku jednat, nebo ne. Vypočítat je zašedlé, dokud je zaškrtnuto Přepočítávat automaticky, protože se tlačítko objeví jen tehdy, je-li toto nastavení odškrtnuto.</p><p>Na telefonu v nízkém režimu zůstává na panelu nástrojů jen pět ovládacích prvků výpočtu. Každý další název je zašedlý a kliknutí na něj otevře řádek nabídky, který dělá totéž. Tlačítko Spodní panel nemá řádek nabídky, takže jeho řádek může jen uvést, že ovládací prvek není na obrazovce.</p>';
$ec_lang['lpn_guide_tb_two_term']='Tlačítka s trojúhelníkem v rohu';
$ec_lang['lpn_guide_tb_two_def']='<p>Zobrazit vše a Vybrat okno mají v pravém dolním rohu malý trojúhelník. Druhé stisknutí tlačítka, mezi nimiž nebylo stisknuto nic jiného, jej změní: Zobrazit vše se stane Přiblížit okno a Vybrat okno prochází tvary okno, laso a mnohoúhelník. Kliknutí na roh tlačítka Zobrazit vše vstoupí do Přiblížit okno hned, bez přizpůsobení pohledu.</p>';
// The Menus chapter (Task 785), two terms after the ruled keys table. Held by dev/lpn-spike/user-guide-menus-harness.js.
$ec_lang['lpn_guide_mn_list_term']='Čtení seznamu nabídek';
$ec_lang['lpn_guide_mn_list_def']='<p>Seznam je sestaven ze samotných nabídek: Soubor, Úpravy, Mapa, Voda a Nápověda, každá pod vlastním nadpisem, s řádky rozbalovací podnabídky odsazenými pod řádkem, který ji otevírá, a s oddělovačem mezi skupinami. Vynechává řádky, které jsou nyní skryté, nadpisy uvnitř nabídky a řádky pojmenované podle projektu nebo prohlížeče, například názvy scénářů. Sahá do hloubky jedné podnabídky a nemá položku pro nabídku Jazyk. Řádek, který je nyní zakázán, je přesto uveden, bez značky, že je zakázán. Kliknutí na řádek otevře nabídku a podnabídku s tímto řádkem označeným. Řádek nikdy nespustí.</p>';
$ec_lang['lpn_guide_mn_kbd_term']='Nabídky z klávesnice';
$ec_lang['lpn_guide_mn_kbd_def']='<p>Písmena za Alt+Shift jsou klávesy na pevných místech, F pro Soubor, E pro Úpravy, M pro Mapu, W pro Vodu, H pro Nápovědu a L pro Jazyk, na každém rozložení klávesnice a v každém jazyce. Po F10 nabídku otevře samotné písmeno nabídky a Esc na liště nabídek vrátí fokus tam, kde byl.</p><p>Řádky, které lze použít jen ukazovátkem, nemají písmeno a šipky je přeskakují. Patří k nim Vrcholy, tři plošné výběry, nástroje Vložit, Přiblížit okno a Snímek obrazovky.</p>';
// The Map chapter (Task 785): terms after the ruled keys table. Held by dev/lpn-spike/user-guide-map-harness.js.
$ec_lang['lpn_guide_map_undo_term']='Zpět a Znovu';
$ec_lang['lpn_guide_map_undo_def']='<p>Ctrl+Z vrátí poslední změnu a Ctrl+Y nebo Ctrl+Shift+Z ji provede znovu. V buňce Tabulek patří klávesy projektu, dokud je buňka jen vybrána, a textu buňky, jakmile začne psaní. Stránka uchovává posledních 20 kroků, pouze v paměti, a přepnutí projektů je vymaže. Krok obnoví spolu s výkresem také scénáře, otevřený scénář a jednotky.</p>';
$ec_lang['lpn_guide_map_del_term']='Smazat';
$ec_lang['lpn_guide_map_del_def']='<p>Delete nebo Backspace smaže výběr, kromě psaní do pole, kde klávesa patří poli. Když není nic vybráno, Delete to oznámí a Backspace nedělá nic. Jedno Zpět vrátí smazání několika prvků. V jiném scénáři než Základní Delete neodstraní prvek, který existuje v Základním; co dělá, popisuje položka Správce scénářů.</p>';
$ec_lang['lpn_guide_map_esc_term']='Esc';
$ec_lang['lpn_guide_map_esc_def']='<p>Esc, který zavře nabídku, rozbalovací seznam nebo okno, nedělá nic jiného. Okna Vlastnosti, Nastavení a Knihovny se zavřou jen tehdy, je-li fokus v okně a ukazatel nad ním. Není-li otevřeno nic z toho, Esc vrátí aktivní nástroj na Výběr a ve Výběru zruší výběr. Napůl nakreslené potrubí vyžaduje jedno Esc ke zrušení a druhé k návratu na Výběr. V poli patří Esc poli.</p>';
$ec_lang['lpn_guide_map_letters_term']='Písmena, číslice a klávesy zvětšení';
$ec_lang['lpn_guide_map_letters_def']='<p>W spustí Přiblížit okno, A spustí výběr oblasti (opětovné stisknutí A prochází okno, laso a mnohoúhelník) a F nakreslí Útvar. Klávesa plus nebo rovná se přibližuje a klávesa mínus oddaluje, vždy o jeden krok kolečka. Tyto klávesy a číslice 0 až 9 na mapě nic nedělají, když z nich jiná klávesa dělá zkratku, například Ctrl+C, nedělají nic při psaní do pole a písmena otevřené nabídky přenechávají jejím řádkům. Číslice napsaná na vybranou buňku Tabulek buňku přepíše, místo aby zvolila nástroj.</p>';
// The Tables chapter (Task 785): terms after the two ruled key tables. Held by dev/lpn-spike/user-guide-tables-harness.js.
$ec_lang['lpn_guide_tbl_tabs_term']='Karty';
$ec_lang['lpn_guide_tbl_tabs_def']='<p>Panel otevřete kliknutím na tlačítko Spodní panel nebo volbou Voda, Tabulky. Jeho karty zleva doprava jsou Uzly, Zdroje, Nádrže, Potrubí, Čerpadla, Ventily, Text, Odběratelé, Útvary, Nastavení, Scénáře, Časová řada, Profil, Četnost a Bilance průtoku. Karta Scénáře se zobrazí, když je Základní režim odškrtnut. Šířka, pořadí a viditelnost sloupců se uchovávají v tomto prohlížeči, ne v projektu.</p>';
$ec_lang['lpn_guide_tbl_cell_term']='Výběr, zadávání a úprava buňky';
$ec_lang['lpn_guide_tbl_cell_def']='<p>Buňka je v jednom ze tří stavů. Dokud je jen vybrána, šipky se přesouvají od buňky k buňce a Ctrl+Z je Zpět projektu. Napsání znaku přes vybranou buňku zahájí zadávání: napsaný text nahradí hodnotu a šipka jej potvrdí a přesune na další buňku. F2 nebo dvojité kliknutí buňku otevře k úpravě: kurzor je v hodnotě a šipky pohybují kurzorem. Při zadávání i při úpravě Ctrl+Z vrací psaní. Esc zadávání nebo úpravu zruší a ponechá buňku vybranou.</p>';
$ec_lang['lpn_guide_tbl_fill_term']='Vyplňování, filtry a scénáře';
$ec_lang['lpn_guide_tbl_fill_def']='<p>Ctrl+D vyplní vybraný rozsah dolů od jeho horního řádku a Ctrl+Enter jej vyplní hodnotou aktivní buňky. Obojí ponechá sloupec ID a buňky jen pro čtení beze změny a oznámení uvádí, kolik buněk bylo vyplněno a kolik nebylo změněno. Ctrl+Shift+L zobrazí jen prvky vybrané na mapě. Při zapnutém filtru působí Ctrl+A a Ctrl+D pouze na zobrazené řádky a řádek upravený tak, že filtru již neodpovídá, zůstane, dokud se filtr znovu neuplatní.</p><p>V jiném scénáři než Základní se úprava buňky, Ctrl+D, Ctrl+Enter a vložení ukládají jako specifické hodnoty otevřeného scénáře.</p>';
// The Boxes chapter (Task 785): terms after Tom's two paragraphs. Held by dev/lpn-spike/user-guide-boxes-harness.js.
$ec_lang['lpn_guide_bx_dock_term']='Ukotvení a karty';
$ec_lang['lpn_guide_bx_dock_def']='<p>V rohu záhlaví okna jsou Ukotvit vlevo od mapy, Ukotvit vpravo od mapy a Plovoucí a po ukotvení okna také Automaticky skrýt. Ukotvené okno je sloupec vedle mapy. S Automaticky skrýt je to karta na úzkém pruhu na kraji mapy. Karta otevře okno při najetí po 150 ms myší nebo perem, nebo kliknutím či klepnutím, a okno se zase schová do karty, jak je popsáno výše. Schované okno je stále otevřené. Řádek nabídky nebo tlačítko panelu nástrojů, které jej otevírá, je vysune z karty.</p><p>Přetažení ukotveného okna za záhlaví je učiní plovoucím a vypne automatické skrývání. Okna ukotvená na jedné straně sdílejí jednu šířku a mapě zůstává alespoň 320 px. Karty se přeřazují přetažením nebo stisknutím Alt+Nahoru či Alt+Dolů na kartě s fokusem.</p>';
$ec_lang['lpn_guide_bx_keep_term']='Co si okno pamatuje';
$ec_lang['lpn_guide_bx_keep_def']='<p>Každé okno si v tomto prohlížeči pamatuje, kde plave, svou velikost, zda je otevřené, stranu ukotvení, zda se automaticky skrývá, svou ukotvenou šířku a místo své karty. Vlastnosti, Kritičnost: analýza, Škálování odběru a Kalibrace si pamatují jen stranu ukotvení, automatické skrývání, místo karty a zda jsou otevřené; místo, kde plavou, vydrží jedno načtení stránky. Prohlížeč bez uloženého rozvržení začíná s několika okny ukotvenými jako karty a nic se neukládá, dokud se okno nezmění.</p>';
$ec_lang['lpn_guide_bx_phone_term']='Na telefonu';
$ec_lang['lpn_guide_bx_phone_def']='<p>Při šířce 640 px nebo méně se žádné okno neukotvuje a každé okno vyplní celé okno prohlížeče. Tlačítka ukotvení se nenabízejí. Ukotvené rozvržení se zachová a vrátí se v širším okně.</p>';
// The Fire flow analysis chapter (Task 785), in the entry for its box. Held by dev/lpn-spike/user-guide-fireflow-harness.js.
$ec_lang['lpn_guide_ff_asks_term']='Co se zjišťuje u každého uzlu';
$ec_lang['lpn_guide_ff_asks_def']='<p>Každý testovaný uzel dostane dva testy, na kopii sítě v časovém kroku na obrazovce a v otevřeném scénáři. První zjišťuje, kolik průtoku uzel dokáže dodat, zatímco udrží zbytkový tlak. V uzlu se odebírá průtok a opakovaná řešení jej zužují, až do stropu rovného 10000 gpm. Uzel, který udrží zbytkový tlak i na stropu, je uveden jako dodávající více než strop. Druhý test, návrhová kontrola, odebírá v uzlu požadovaný průtok a zjišťuje, zda některý jiný uzel v jejím rozsahu klesne pod Nejnižší povolený tlak jinde, nebo některé potrubí v jejím rozsahu překročí Nejvyšší povolenou rychlost. Návrhová kontrola se neprovádí, je-li její rozsah Žádná.</p><p>Uzel s vlastní vlastností Požadovaný požární průtok se testuje podle této hodnoty a každý další uzel podle hodnoty v okně.</p>';
$ec_lang['lpn_guide_ff_result_term']='Čtení výsledků';
$ec_lang['lpn_guide_ff_result_def']='<p>Shrnutí počítá uzly, které prošly všemi kontrolami, uzly, které selhaly při požárním průtoku, a uzly, které ovlivnily zbytek soustavy. Tabulka uvádí pro každý testovaný uzel Statický tlak před odběrem jakéhokoli požárního průtoku, Požadovaný průtok, Tlak při požadovaném průtoku, Dostupný průtok, Udržený zbytkový tlak, Nejhorší vliv a Návrhový limit návrhové kontroly, počet Výpočtů, což je počet řešení celé sítě, a Způsoby selhání. Buňka bez čísla ukazuje pomlčku, nikdy nulu. Uzel, který nešlo vyřešit, ukazuje místo čísel svůj důvod. Tabulka vytiskne nejvýše 200 uzlů a uvede, kolik jich nevytiskla.</p>';
$ec_lang['lpn_guide_ff_marks_term']='Kroužky, Zastavit a jedna analýza najednou';
$ec_lang['lpn_guide_ff_marks_def']='<p>Po výpočtu je kruh každého testovaného uzlu na mapě orámován podle jeho výsledku a obrysy se liší vzorem čárkování i barvou. Zvolte Vybrané uzly, chcete-li testovat jen uzly vybrané na mapě; cokoli jiného, co je vybráno, se započítá a netestuje se. Zastavit ukončí výpočet a ponechá již dokončené uzly. Najednou běží pouze jedna z analýz požárního průtoku, kritičnosti a škálování odběru.</p>';
$ec_lang['lpn_guide_ff_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_ff_example_def']='<p>Otevřete příklad Net1, zvolte Voda, Analýza, Požární průtok: analýza… a klikněte na Spustit s oknem tak, jak se otevřelo. Časový krok je 0:00 a výpočet řeší celou síť 135krát. Osm z devíti uzlů projde všemi kontrolami. Uzel N32 při požárním průtoku selže: jeho statický tlak je 111 psi, při požadovaných 1000 gpm zůstává jen 1,19 psi a jeho dostupný průtok je 892 gpm. Uzel N31 dokáže dodat 1339 gpm a Uzel N12 více než 10000 gpm.</p>';
// The Criticality analysis chapter (Task 785). Held by dev/lpn-spike/user-guide-criticality-harness.js.
$ec_lang['lpn_guide_cr_case_term']='Co dělá každý případ';
$ec_lang['lpn_guide_cr_case_def']='<p>U každého spoje v rozsahu se spoj učiní neaktivním na kopii sítě a kopie se vyřeší v časovém kroku na obrazovce v otevřeném scénáři. Výpočet je jedno řešení pro každý spoj a jedno navíc bez porušení. Uzel, který nemá otevřenou cestu ke zdroji nebo nádrži, je odříznut: před řešením se odstraní a jeho odběr se počítá jako Nedodaný odběr. Z uzlů, které zůstaly připojeny, Uzly pod minimem uvádějí ty, jejichž tlak klesne pod Nejnižší povolený tlak. Uzel, který je pod ním už bez porušení, se nepočítá k žádnému spoji a shrnutí uvádí, kolik jich je. Nejnižší povolený tlak je totéž nastavení jako pole Nejnižší povolený tlak jinde v okně Požární průtok: analýza.</p>';
$ec_lang['lpn_guide_cr_dead_term']='Slepá zakončení a seznam';
$ec_lang['lpn_guide_cr_dead_def']='<p>Spoj se slepým zakončením je takový, jehož odstranění odřízne uzly, které lze dosáhnout jen přes něj. Vše za ním je jeho ztrátou, takže se při zaškrtnutém Přeskočit slepá zakončení spoj nevyřeší a shrnutí uvádí, kolik jich bylo přeskočeno. Seznam uvádí pro každý spoj Nedodaný odběr, Odříznuté uzly a Uzly pod minimem, každé s počtem a prvními pěti ID, a kliknutí na ID přejde na prvek na mapě. Spoje, které soustavu něco stojí, jsou uvedeny první, dokud se kliknutím na záhlaví sloupce neseřadí, a shrnutí je počítá proti počtu testovaných spojů. Zvolte Vybrané spoje, chcete-li porušit jen spoje vybrané na mapě.</p>';
$ec_lang['lpn_guide_cr_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_cr_example_def']='<p>Otevřete příklad Net1, zvolte Voda, Analýza, Kritičnost: analýza…, zadejte pro Nejnižší povolený tlak 116 a klikněte na Spustit. Časový krok je 0:00 a výpočet řeší celou síť 14krát. Čtyři z 13 spojů srazí uzel pod 116 psi, když jsou mimo provoz: L9 (N10, N11 a N21), L10 (N11 a N21), L111 (N21 a N22) a L112 (N21 a N22). Dva uzly jsou pod 116 psi už bez porušení a nepočítají se. Protože je Net1 okruhová, ztráta jednoho spoje nikdy nenechá uzel bez zásobování.</p>';
// The Demand scaling chapter (Task 785). Held by dev/lpn-spike/user-guide-demandscale-harness.js.
$ec_lang['lpn_guide_ds_run_term']='Spustit';
$ec_lang['lpn_guide_ds_run_def']='<p>Spustit vynásobí odběry ve zvolených uzlech Měřítkem odběru na kopii sítě v časovém kroku na obrazovce a v otevřeném scénáři. Provede dvě řešení, jedno s odběry, jak jsou, a jedno škálované. Výsledek uvádí Nejnižší tlaky a Nejvyšší rychlosti, každé s hodnotou Škálováno vedle hodnoty Neškálováno, což je hodnota, kterou ukazuje mapa. Každý seznam má deset řádků a okno uvádí, kolik spojů nezobrazuje. Měřítko odběru se použije navíc k násobiteli odběru otevřeného scénáře a nikdy se neukládá v projektu.</p>';
$ec_lang['lpn_guide_ds_find_term']='Najít';
$ec_lang['lpn_guide_ds_find_def']='<p>Najít prohledává měřítka odběru od 0 do 20, s přesností na 0,01, a hledá největší, při kterém každý zvolený uzel udrží alespoň Nejnižší povolený tlak. Uvádí měřítko a nejnižší tlak při něm a totéž pro další krok nahoru, kde tlak poprvé klesne pod mez. Pokud již odběry tak, jak jsou zadány, nechávají některý uzel pod mezí, je odpověď označena výstražnou značkou. Pokud každý uzel mez udrží i při 20, odpověď to uvádí. Zastavit ukončí hledání bez odpovědi. Nejnižší povolený tlak je totéž nastavení jako pole Nejnižší povolený tlak jinde v okně Požární průtok: analýza.</p>';
$ec_lang['lpn_guide_ds_scope_term']='Uzly a časový krok';
$ec_lang['lpn_guide_ds_scope_def']='<p>S volbou Vybrané uzly se škálují a kontrolují jen uzly vybrané na mapě. Ostatní uzly zůstávají, jak jsou, a ty, které klesnou pod mez, se vypíší bez omezení odpovědi. Škáluje se jen časový krok na obrazovce a hladiny a stavy se přebírají z něj. Chcete-li testovat špičku, před spuštěním přesuňte hodiny na špičkový odběr.</p>';
$ec_lang['lpn_guide_ds_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_ds_example_def']='<p>Otevřete příklad Net1 a zvolte Voda, Analýza, Škálování odběru…. V časovém kroku 0:00 klikněte na Najít s oknem tak, jak se otevřelo. Každý uzel udrží alespoň 20 psi až do měřítka odběru 5,76, kde je nejnižší tlak 20,11 psi v uzlu N32. Při 5,77 je to 19,8 psi a hledání vyžadovalo 13 řešení. Zadejte pro Měřítko odběru 3 a klikněte na Spustit: Uzel N32 klesne ze 111 psi neškálovaných na 85,99 psi a Spoj L112 vzroste z 0,535 ft/s na 3,13 ft/s.</p>';
// The Pump energy chapter (Task 785). Held by dev/lpn-spike/user-guide-energy-harness.js.
$ec_lang['lpn_guide_en_read_term']='Čtení sestavy';
$ec_lang['lpn_guide_en_read_def']='<p>Zvolte Voda, Sestavy, Energie čerpadel. Sestava integruje výkon každého čerpadla za poslední dlouhodobou simulaci, takže vyžaduje Celkovou dobu běhu větší než 0 a výpočet. Pro každé čerpadlo uvádí % výpočtu, Účinn., Prům. kW, Špičkové kW, kWh a Náklady. Prům. kW je průměr za dobu, kdy čerpadlo běželo, nikoli za doby nečinnosti. Pod tabulkou jsou Spotřebovaná energie, Náklady na energii, Špičkový odběr výkonu, Poplatek za špičkový odběr a Celkové náklady. Síť bez čerpadel nemá co uvádět.</p>';
$ec_lang['lpn_guide_en_set_term']='Co určuje čísla';
$ec_lang['lpn_guide_en_set_def']='<p>Nastavení, Energie obsahuje Účinnost čerpadla (procenta), která se použije pro každé čerpadlo bez křivky účinnosti, Cenu elektřiny za jednu kilowatthodinu, Vzorec ceny, který násobí cenu v každém kroku vzorce, Poplatek za špičkový odběr za kW a text Měna, který se tiskne vedle nákladů a náklady nepřepočítává. Čerpadlo může mít ve Vlastnostech vlastní cenu, vzorec ceny a křivku účinnosti. Ceny, vzorec, poplatek za špičkový odběr, Účinnost čerpadla (procenta) a vlastní hodnoty čerpadla jsou v kategorii Náklady na energii, takže je scénář může přepsat. Není-li cena uvedena nebo je nulová, jsou všechny náklady nulové a sestava to uvádí. Aplikace žádnou cenu nenavrhuje.</p>';
$ec_lang['lpn_guide_en_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_en_example_def']='<p>Otevřete příklad Net1, který má celkovou dobu běhu 24:00, a vypočítejte. Zvolte Voda, Sestavy, Energie čerpadel. Čerpadlo L9 běží 65,71 % výpočtu s účinností 75 % a spotřebuje v průměru 96,22 kW, ve špičce 96,71 kW a celkem 1518 kWh. Cena není uvedena, takže náklady jsou 0 a sestava to uvádí. Zadejte v Nastavení, Energie pro Cenu elektřiny 0,12 a vypočítejte znovu: náklady L9 jsou 182, tedy Celkové náklady.</p>';
// The Contour plot chapter (Task 785). Held by dev/lpn-spike/user-guide-contour-harness.js.
$ec_lang['lpn_guide_ct_what_term']='Co je graf';
$ec_lang['lpn_guide_ct_what_def']='<p>Zvolte Voda, Grafy, Vrstevnice. Řádek zapne graf v otevřeném scénáři jako plynulou výplň s popsanými čarami, použije tlak, pokud uzly ještě nejsou obarveny, a otevře okno. Graf rozprostře barvy uzlů podél potrubí a do vzdálenosti stanoveného násobku mediánu délky potrubí vedle nich, přičemž ve vnější části slábne. Nebarví přes čerpadla, ventily ani uzavřené spoje. Řádek pod barevným klíčem uvádí, kolik uzlů a potrubí graf používá, dosah vedle potrubí a interval čar. Při příliš málo uzlech to uvede.</p>';
$ec_lang['lpn_guide_ct_box_term']='Okno';
$ec_lang['lpn_guide_ct_box_def']='<p>Zobrazit vrstevnice, je-li odškrtnuto, skryje výplň i čáry a ponechá barvy uzlů. Okno obsahuje také Barvit uzly podle a Barevné schéma, což jsou tatáž dvě nastavení jako v Nastavení, Vizualizace, Barvy uzlů, dále Výplň (Žádná, Plynulá nebo Pásy, které vykreslí každou třídu plošně), Krytí výplně, Vrstevnice s jejich Intervalem a Popisky a Dosah v násobcích mediánu délky potrubí. V projektu umístěném na Zemi může okno také převzít terén mezi uzly z Mapbox DEM, poté co návštěvník souhlasí s odesláním čísel dlaždic oblasti sítě. Tato nastavení se ukládají s projektem a scénář je může přepsat. Graf mění jen zobrazení, nikoli síť.</p>';
$ec_lang['lpn_guide_ct_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_ct_example_def']='<p>Otevřete příklad Net1 a zvolte Voda, Grafy, Vrstevnice. Uzly jsou obarveny podle tlaku a řádek pod barevným klíčem uvádí 9 uzlů, 11 potrubí, dosah 2,5násobku mediánu délky potrubí vedle nich a čáry po 5 psi. Čerpadlo, Spoj 9, není jedním z 11 potrubí. Je-li Zobrazit vrstevnice odškrtnuto, uzly zůstanou obarveny podle tlaku.</p>';
// The Run report, Status changes, and Full report chapters (Task 785). Held by dev/lpn-spike/user-guide-reports-harness.js.
$ec_lang['lpn_guide_rr_what_term']='Co zpráva obsahuje';
$ec_lang['lpn_guide_rr_what_def']='<p>Zvolte Voda, Sestavy, Výpočet. Zpráva je text, který jádro EPANET zapsalo pro poslední dlouhodobou simulaci, rozdělený na stránky. Začíná záhlavím a názvem sítě, poté počítá uzly, zdroje, nádrže, potrubí, čerpadla a ventily, pak uvádí možnosti analýzy a nakonec vypisuje hydraulický stav výpočtu s jeho varováními. Tlačítko Kopírovat text zkopíruje.</p>';
$ec_lang['lpn_guide_rr_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_rr_example_def']='<p>Otevřete příklad Net1, který již byl vypočten, a zvolte Voda, Sestavy, Výpočet. Shrnutí uvádí 9 uzlů, 1 zdroj, 1 nádrž, 12 potrubí, 1 čerpadlo a 0 ventilů. Vzorec ztráty tlakové výšky je Hazen-Williams, hydraulický časový krok je 1,00 hod a celková doba je 24,00 hod.</p>';
$ec_lang['lpn_guide_st_what_term']='Co se vypisuje';
$ec_lang['lpn_guide_st_what_def']='<p>Zvolte Voda, Sestavy, Změny stavu. Každý řádek uvádí čas změny a změnu: čerpadlo, ventil nebo potrubí nyní otevřené či zavřené, nebo nádrž nyní plnící se, vyprazdňující se, plná či prázdná. Uveden je i časový krok, který zcela nezkonvergoval. Seznam je v časovém pořadí a obsahuje jen změny, ne každý krok. Čte se ze stejné dlouhodobé simulace jako panel Tabulky a Úplná sestava.</p>';
$ec_lang['lpn_guide_st_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_st_example_def']='<p>Otevřete příklad Net1 a zvolte Voda, Sestavy, Změny stavu. Nádrž N2 se nyní plní v 1:00, vyprazdňuje v 11:00, plní v 16:00 a vyprazdňuje ve 22:00. Čerpadlo L9 je nyní zavřeno v 10:00, nyní otevřeno v 15:00 a nyní zavřeno v 21:00.</p>';
$ec_lang['lpn_guide_fr_what_term']='Co tabulka obsahuje';
$ec_lang['lpn_guide_fr_what_def']='<p>Zvolte Voda, Sestavy, Úplná. Tabulka má jeden řádek pro každý uzel a spoj v každém časovém kroku sestavy, v jednotkách panelu Tabulky. Její sloupce jsou Typ, ID, Odběr, Tlaková výška, Tlak, Koncentrace chloru, Průtok, Rychlost, Ztráta tlakové výšky, Tlaková výška čerpadla a Stav a buňka je prázdná tam, kde prvek takovou veličinu nemá. Seznam Časový krok volí zobrazený krok a Stáhnout CSV a Vytisknout sestavu obsahují každý krok. Bez dlouhodobé simulace tabulka ukazuje aktuální řešení v jednom okamžiku.</p>';
$ec_lang['lpn_guide_fr_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_fr_example_def']='<p>Otevřete příklad Net1 a zvolte Voda, Sestavy, Úplná. Uvedeno je 24 prvků ve 25 krocích sestavy, od 0:00 do 24:00, tedy 600 řádků. V 0:00 má Uzel 11 odběr 150 gpm, tlakovou výšku 985,23 ft H2O a tlak 119,26 psi.</p>';
// The Calibration chapter (Task 785). Held by dev/lpn-spike/user-guide-calibration-harness.js.
$ec_lang['lpn_guide_cal_what_term']='Co sestava porovnává';
$ec_lang['lpn_guide_cal_what_def']='<p>Zvolte Voda, Sestavy, Kalibrace. Seznam Veličina volí, co soubor měří: Odběr, Tlaková výška, Tlak, Koncentrace chloru, Průtok nebo Rychlost. Pro každou veličinu se drží jeden soubor a tlačítko Načíst kalibrační soubor… otevře výběr souboru. Sestava má tři stránky. Statistiky uvádějí pro každé místo počet pozorování, pozorovaný průměr, vypočtený průměr, střední chybu a chybu RMS, poté řádek Síť pro všechna místa dohromady a korelaci mezi průměry. Korelační graf umístí každé měření podle pozorované hodnoty vodorovně a vypočtené hodnoty svisle, s úhlopříčkou tam, kde se obě shodují. Porovnání průměrů nakreslí pozorovaný a vypočtený průměr jako dvojici sloupců pro každé místo.</p><p>Vypočtená hodnota se čte z dlouhodobé simulace a měření mezi dvěma kroky sestavy se porovnává s hodnotou interpolovanou mezi nimi. Měření mimo časy, které simulace uvedla, se přeskočí a započítá. U řešení v jednom okamžiku se každé měření porovnává s tímto jediným výsledkem, ať soubor uvádí jakýkoli čas. Sestava se vyplní po výpočtu sítě.</p>';
$ec_lang['lpn_guide_cal_file_term']='Kalibrační soubor';
$ec_lang['lpn_guide_cal_file_def']='<p>Textový soubor s ID místa, časem a naměřenou hodnotou na každém řádku. Čas se měří od začátku simulace, v desetinných hodinách nebo hodinách:minutách. Středník zahajuje komentář. Řádek jen s časem a hodnotou patří k místu nad ním. Hodnoty se čtou v jednotkách projektu a sestava uvádí, v jaké jednotce. Místo, které není v síti, se vypíše a jeho měření se počítají jako přeskočená, nečitelný řádek se vypíše podle čísla řádku a zbytek souboru se použije. Soubor se drží v paměti jen pro otevřený projekt a toto načtení stránky. Neukládá se s projektem ani v tomto zařízení. Když graf Časová řada ukazuje stejnou veličinu, naměřené hodnoty se do něj kreslí jako kroužky.</p>';
$ec_lang['lpn_guide_cal_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_cal_example_def']='<p>Otevřete příklad Net1, vypočtěte jej a zvolte Voda, Sestavy, Kalibrace. Při zvoleném Tlaku načtěte soubor, který uvádí Uzel 11 jako 118,5 psi v 0:00 a 121,0 psi ve 12:00, Uzel 31 jako 110,2 psi v 6:00 a 108,7 psi v 18:00 a Uzel 99 jako 50 psi v 0:00, následovaný řádkem, který nejsou data. Sestava uvádí, že soubor má 5 měření na 3 místech, jmenuje Uzel 99 jako nenacházející se v síti s 1 přeskočeným měřením a vypíše nečitelný řádek. Statistiky ukazují Uzel 11 se 2 pozorováními, pozorovaným průměrem 119,75 psi, vypočteným průměrem 116,53 psi, střední chybou 3,98 a chybou RMS 5,12. Uzel 31 má 109,45, 118,71, 9,26 a 9,79. Řádek Síť má 4 pozorování, střední chybu 6,62 a chybu RMS 7,81.</p>';
// Where the Guide lists its own keys, so that a search for one finds it.
$ec_lang['lpn_guide_using_heading']='Použití příručky';
$ec_lang['lpn_guide_keys_term']='Klávesové zkratky příručky';
$ec_lang['lpn_guide_keys_def']='<table class="lpn-notes-table"><tbody><tr><td>?</td><td>Otevře příručku u tlačítka panelu nástrojů nebo řádku nabídky pod ukazatelem nebo s fokusem. Jinde ji otevře s vybraným polem hledání. Klávesa ji neotevře při psaní do pole ani při otevřené otázce.</td></tr><tr><td>F1</td><td>Otevře příručku u položky okna, které má fokus.</td></tr><tr><td>Ctrl+K</td><td>Otevře příručku s vybraným polem hledání a s vybraným textem, nejvýše 80 znaků, v něm. Nahrazuje vlastní Ctrl+K prohlížeče, kromě doby otevřené otázky, kdy se příručka neotevře.</td></tr><tr><td>/</td><td>Vybere pole hledání, když má fokus příručka.</td></tr><tr><td>Esc</td><td>Když má fokus příručka, zavře ji a vrátí fokus na původní místo.</td></tr></tbody></table>';
$ec_lang['lpn_guide_use_term']='Hledání, odkazy a co se pamatuje';
$ec_lang['lpn_guide_use_def']='<p>Hledání ignoruje velká písmena a diakritiku a vypíše řádky a položky, které obsahují zadaný text. Zvolením řádku se zobrazí, kde se ovládací prvek nachází. Nikdy jej nespustí. Na telefonu, kde je panel nástrojů sbalený, řádek panelu nástrojů otevře řádek nabídky, který dělá totéž.</p><p>Adresa stránky sleduje čtenou položku, například <code>Looped-Network.php#guide</code>, takže ji lze zkopírovat jako odkaz na tuto položku. Zavřením příručky se vymaže. Příručka si v tomto prohlížeči pamatuje, zda byla otevřená, svou polohu a velikost a zda je seznam obsahu skrytý. Na telefonu je seznam obsahu zpočátku skrytý.</p>';
// Under a toolbar button in the User guide, naming the menu row that does the same thing.
// {menu} becomes a path such as "Edit > Delete", drawn with chevrons; keep {menu} as it is.
$ec_lang['lpn_guide_also']='Také v nabídce {menu}';
$ec_lang['lpn_guide_how_popup']='Vlastnosti se otevřou, když vyberete prvek nebo text.';
$ec_lang['lpn_guide_not_shown']='Tento ovládací prvek právě není na obrazovce.';
// The box's two context headings. "Tables" holds the two table-help entries that used to sit only
// in the Notes list (lpn_notes_6/7, moved rather than duplicated); "Map" is new -- the digit tool
// keys, Undo and the zoom keys had never been gathered anywhere before.
$ec_lang['lpn_hotkeys_tables_heading']='Tabulky';
$ec_lang['lpn_hotkeys_map_heading']='Mapa';
$ec_lang['lpn_hotkeys_map_term']='Klávesové zkratky mapy';
// Same shape as lpn_notes_7_def: one table, one row per key. The ten digits are LPN_TOOL_KEYS in
// js/looped-network.js; Select also answers to Esc and Delete to the Delete key
// (LPN_TOOL_ALT_KEYS); Ctrl+Z is undo(); +/- and = are keyZoom() (ROADMAP Task 682).
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>0 nebo Esc</td><td>Výběr.</td></tr><tr><td>2</td><td>Přidat uzel.</td></tr><tr><td>3</td><td>Přidat zdroj.</td></tr><tr><td>4</td><td>Přidat nádrž.</td></tr><tr><td>5</td><td>Přidat potrubí.</td></tr><tr><td>6</td><td>Přidat čerpadlo.</td></tr><tr><td>7</td><td>Přidat ventil.</td></tr><tr><td>8</td><td>Přidat odběratele.</td></tr><tr><td>9</td><td>Přidat text.</td></tr><tr><td>Delete</td><td>Smazat výběr.</td></tr><tr><td>Ctrl+Z</td><td>Vrátit poslední změnu.</td></tr><tr><td>+ nebo =</td><td>Přiblížit.</td></tr><tr><td>-</td><td>Oddálit.</td></tr></tbody></table>';
// The W row of the Map table. Its own key, spliced into the table by Looped-Network.php, because a new row in
// lpn_hotkeys_map_def is new markup that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_zoomwin_def']='Přiblížit okno: přetažením obdélníku na mapě přiblížíte danou oblast.';
// The menu chords (Task 748): Alt+Shift+letter on Windows and Linux, Ctrl+Option on a Mac, and F10.
// Exactly two rows (Tom, 2026-10-03: "show only the Alt+Shift and the F10"); the letters themselves
// are assigned per language by menuMnemonics() and shown on the menus, never listed here.
// A separate block rather than rows in lpn_hotkeys_map_def, because a new row there is new markup
// that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_menu_heading']='Nabídky';
$ec_lang['lpn_hotkeys_menu_term']='Klávesové zkratky nabídek';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+písmeno</td><td>Otevře nabídku s tímto písmenem, poté stisknutím písmene řádku zvolíte jeho položku. Písmena se zobrazují, dokud používáte klávesnici. Na Macu použijte Ctrl+Option.</td></tr><tr><td>F10</td><td>Přejde na lištu nabídek.</td></tr></tbody></table>';
// The Screenshot keys. A separate block, for the reason given above the menu block.
$ec_lang['lpn_hotkeys_snip_heading']='Snímek obrazovky';
$ec_lang['lpn_hotkeys_snip_term']='Klávesové zkratky pro snímek obrazovky';
$ec_lang['lpn_hotkeys_snip_def']='<table class="lpn-notes-table"><tbody><tr><td>S</td><td>Výřez, je-li otevřen Snímek obrazovky.</td></tr><tr><td>E</td><td>Guma, v zobrazení značkování.</td></tr><tr><td>Ctrl+Z, Ctrl+Y</td><td>Zpět a znovu, v zobrazení značkování.</td></tr><tr><td>Esc</td><td>Zruší výřez nebo ukončí gumu. V zobrazení značkování jej zavře, pokud není nic nakresleno.</td></tr></tbody></table>';
// ---- "Something wrong here?" (ROADMAP Tasks 207 and 768) ----
// Two sites, one behaviour -- a standing cell in the map's bottom strip, and the same control inside
// the solver's diagnostic box when one is on screen. The first click opens a box; Send is the second.
// The thank-you must never imply an answer: a reply comes only to somebody who left an address.
$ec_lang['lpn_wrong_btn']='Je tu něco špatně?';
// The standing message's own Hide control. A hidden message leaves the map and waits as the top row of the
// message history (the down-arrow glyph), marked by lpn_msglog_hidden, with lpn_msglog_unhide to bring it back.
$ec_lang['lpn_status_dismiss']='Skrýt tuto zprávu';
$ec_lang['lpn_msglog_hidden']='Skryté';
$ec_lang['lpn_msglog_unhide']='Zobrazit';
$ec_lang['lpn_status_hidden_tip']='Znovu zobrazí skrytou zprávu na mapě.';
// Rewritten for the two-click box (Task 768); TGH's 2026-09-07 wording described one press.
$ec_lang['lpn_wrong_tip']='Nahlásit chybu na této stránce. Otevře se okno, v němž zvolíte problém, přidáte komentář a případně zadáte e-mailovou adresu, chcete-li odpověď. Všechna pole jsou volitelná a nic se neodešle, dokud nestisknete Odeslat.';
$ec_lang['lpn_wrong_thanks']='Děkujeme. Vaše hlášení bylo přijato.';
// The box "Something wrong here?" opens (ROADMAP Task 768). Every field is optional; Send with
// nothing in it posts only the anonymous tally the button always posted. The four picks are canned
// phrases a visitor may toggle in any combination. lpn_fb_sends must stay true to send-feedback.php
// and to the "Messages you send us" row of privacy.php.
$ec_lang['lpn_fb_intro']='Předpřipravené zprávy (volitelné). Nic se neodešle, dokud nestisknete Odeslat.';
$ec_lang['lpn_fb_pick_numbers']='Čísla se zdají nesprávná';
$ec_lang['lpn_fb_pick_broken']='Něco nefungovalo';
$ec_lang['lpn_fb_pick_wording']='Formulace nebo překlad jsou nesprávné';
$ec_lang['lpn_fb_pick_confusing']='Je to nejasné';
$ec_lang['lpn_fb_comment']='Komentáře (volitelné)';
$ec_lang['lpn_fb_email']='E-mail (volitelné, pouze pokud chcete odpověď)';
$ec_lang['lpn_fb_sends']='Co se odešle: název této stránky, jazyk, verze webu, kód zprávy na mapě, pokud nějaká je, a to, co bylo zvoleno nebo napsáno. Nikdy ne výkres ani síť. E-mailová adresa se použije pouze k odpovědi.';
$ec_lang['lpn_fb_send']='Odeslat';
$ec_lang['lpn_fb_sending']='Odesílání…';
$ec_lang['lpn_fb_failed']='Zpráva k nám nedorazila. To, co jste napsali, zůstává zachováno, takže to můžete zkusit znovu.';
$ec_lang['lpn_fb_bad_email']='Tato e-mailová adresa není platná. Opravte ji, nebo pole nechte prázdné.';
$ec_lang['lpn_fb_busy']='V posledních minutách přišlo příliš mnoho zpráv. To, co jste napsali, zůstává zachováno, takže to můžete zkusit později.';
$ec_lang['lpn_status_example_opened']='Otevřeno: {name} jako kopie. Uložte ji příkazem Soubor, Uložit jako.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Tato stránka nedokázala určit velikost kresebné plochy, proto mapa zobrazuje poslední pohled, který se jí podařilo vypočítat. Změna velikosti okna měření zopakuje. Pokud to přetrvává, obvyklou příčinou je rozšíření prohlížeče, které blokuje měření stránky.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Základní síť, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Dva zdroje, čerpadlo a malý okruh. Litry za sekundu, s metry a milimetry.';
$ec_lang['lpn_ex_basic_us_title']='Základní síť, gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='Dva zdroje, čerpadlo a malý okruh. Galony za minutu, se stopami a palci.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 s řízením pomocí pravidel';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Fiktivní příklad EPANET s chlorem, 1 zdrojem a 1 nádrží.';
$ec_lang['lpn_ex_net1_si_title']='EPANET Net1 s řízením pomocí pravidel, L/s (SI)';
$ec_lang['lpn_ex_net1_si_desc']='Litry za sekundu, s metry a milimetry. Fiktivní příklad EPANET převedený z galonů za minutu, stop a palců, s chlorem, 1 zdrojem, 1 nádrží, 1 čerpadlem a dvěma řízeními pomocí pravidel.';
$ec_lang['lpn_ex_net2_si_title']='EPANET Net2, L/s (SI)';
$ec_lang['lpn_ex_net2_si_desc']='Litry za sekundu, s metry a milimetry. Příklad EPANET z Branfordu ve státě Connecticut, převedený z galonů za minutu, stop a palců: 35 uzlů a 1 nádrž, bez zdroje, bez čerpadla a bez ventilů, přibližně 2 km krát 4 km. Fluorid, nereaktivní látka, vstupuje v jednom dávkování.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Galony za minutu, se stopami a palci. Příklad EPANET z Branfordu ve státě Connecticut: 35 uzlů a 1 nádrž, bez zdroje, bez čerpadla a bez ventilů, přibližně 1 míle krát 2 míle. Fluorid, nereaktivní látka, vstupuje v jednom dávkování.';
$ec_lang['lpn_ex_net3_si_title']='EPANET Net3, L/s (SI)';
$ec_lang['lpn_ex_net3_si_desc']='Litry za sekundu, s metry a milimetry. Příklad EPANET z Novata v Kalifornii, převedený z galonů za minutu, stop a palců, s mapou světa v pozadí: 92 uzlů, 3 nádrže a 2 zdroje, bez ventilů, přibližně 8 km na stranu. 24hodinová simulace s časovým průběhem, se sledováním původu z jezera (Lake).';
$ec_lang['lpn_ex_net3_title']='EPANET Net3, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Galony za minutu, se stopami a palci. Příklad EPANET z Novata v Kalifornii, s mapou světa v pozadí: 92 uzlů, 3 nádrže a 2 zdroje, bez ventilů, přibližně 5 mil na stranu. 24hodinová simulace s časovým průběhem, se sledováním původu z jezera (Lake).';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center, gpm (US)';
$ec_lang['lpn_ex_elm_street_desc']='Galony za minutu, se stopami a palci. Prescott Valley v Arizoně: 17 uzlů, 1 zdroj a 1 čerpadlo. Komerční areál řešený pro požární průtok navíc k maximálnímu dennímu odběru, v jednom okamžiku, nakreslený na podkladu situačního plánu.';
$ec_lang['lpn_tool_undo']='Zpět';
$ec_lang['lpn_confirm_example']='Tímto se příklad přidá do sítě, kterou už máte. Pokračovat?';
$ec_lang['lpn_field_diameter']='Průměr';
$ec_lang['lpn_demand_tip']='Průtok odebíraný ze sítě v tomto uzlu. Pro průtok přiváděný do sítě zde zadejte záporné číslo.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Tato jednotka určuje, jak se čtou vaše vstupy';
$ec_lang['lpn_units_warn_lead']='{unit} je jednotka toho, co zadáváte pro:';
$ec_lang['lpn_units_options_head']='Když změníte jednotku:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Nedestruktivní';
$ec_lang['lpn_units_nondestructive_desc']='Nedestruktivní: ponechá každý vstup tak, jak je, a přečte jej v nové jednotce.';
$ec_lang['lpn_units_destructive']='Destruktivní';
$ec_lang['lpn_units_destructive_desc']='Destruktivní: přepočítá každý vstup matematickým převodem, takže síť zůstane fyzicky téměř stejná, v mezích přesnosti převodu. Původní zadané hodnoty se ztratí. Zpět je vrátí.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='Hodnoty ({n}) nyní znamenají {unit}. Nic nebylo přepsáno.';
$ec_lang['lpn_status_converted']='Hodnoty ({n}) byly přepsány na {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
// **THE NATURAL ENGLISH GOES ON THE CONTROL; the ultra-simple rendering goes to the translator**
// (Tom, 2026-08-18: *"'Input units' and 'Results units'... both more natural than the ultra simple
// English you used. While I like that you are thinking simple for translators, this should go in
// _syn and the more natural in English."*). That is the routing rule stated on a real case: simple
// English is for when an English reader would stumble, and here one would not.
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Délka';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Souřadnice mapy';
$ec_lang['lpn_units_mapcoords_deg']='stupně';
$ec_lang['lpn_units_usft']='US survey ft';
$ec_lang['lpn_units_elevhead']='Nadmořská výška a tlaková výška';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Gradient ztráty tlakové výšky';
$ec_lang['lpn_result_gradient_tip']='Ztráta tlakové výšky dělená délkou potrubí. Použijte ji k porovnání potrubí různých délek podle jednoho návrhového limitu.';
$ec_lang['lpn_result_water_age']='Stáří vody';
$ec_lang['lpn_result_water_age_tip']='Doba, kterou voda dosahující tohoto bodu strávila v systému. Kde se průtoky setkávají, je číslo průměrem stáří přitékající vody vážených průtokem. V nádrži je to průměrné stáří uložené vody, takže nádrž, která se obměňuje pomalu, obvykle drží nejstarší vodu v síti. Neexistuje žádný předpisový limit, s nímž by se dalo porovnat, proto jej posuzujte podle poměrů v modelovaném systému.';
$ec_lang['lpn_result_source_share']='Podíl původu';
$ec_lang['lpn_result_source_share_tip']='Podíl vody dosahující tohoto bodu, který pocházel ze sledovaného uzlu. To udává analýza Sledování původu.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Průměrné stáří vody';
$ec_lang['lpn_result_avg_source_share']='Průměrný podíl původu';
$ec_lang['lpn_result_avg_concentration']='Průměrná koncentrace';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Součinitel tření';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Rychlost reakce';
$ec_lang['lpn_result_status']='Stav';
$ec_lang['lpn_result_status_open']='Otevřeno';
$ec_lang['lpn_result_status_closed']='Zavřeno';
$ec_lang['lpn_result_head']='Tlaková výška';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Potenciální energie vody v tomto uzlu, zapsaná jako výška vodního sloupce. Je to absolutní výška, zatímco tlak je měřen jako přetlak.';
// A tank's depth and usable volume (Task 783). Depth is head minus the tank bottom, which is our
// Elevation. Volume is zero at the Lowest water depth, so it is NOT EPANET's tank volume, which also
// counts the water below the lowest water depth (that water is in the mixing volume, it just cannot be drawn down).
$ec_lang['lpn_result_depth']='Hloubka';
$ec_lang['lpn_result_depth_tip']='Hloubka vody v nádrži v zobrazeném čase, měřená od dna nádrže nahoru: tlaková výška minus nadmořská výška dna nádrže.';
$ec_lang['lpn_result_tank_volume']='Využitelný objem';
$ec_lang['lpn_result_tank_volume_tip']='Objem vody nad nejnižší hloubkou vody, takže je při této hloubce nulový. Objem nádrže podle EPANET zahrnuje i vodu pod nejnižší hloubkou vody, která se stále započítává do míšení a stáří vody, proto zůstává nadmořská výška dna nádrže u dna nádrže.';
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
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Obnoví nastavení pouze tohoto projektu. Výkres a ostatní projekty se nemění. Chcete-li sadu nastavení použít opakovaně, uložte soubor projektu, který obsahuje pouze nastavení.';
$ec_lang['lpn_reset_all_tip']='Smaže každý projekt, každý podkladový obrázek, každé nastavení i volby jednotek a poté znovu načte stránku přesně tak, jak ji vidí návštěvník poprvé. Je to jediné obnovení, které vymaže vše.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Tento kalkulátor ukládá jednotky a vstupy projektu tak, jak byly zadány, ale dříve převáděl čísla pro uložení na SI. Tento projekt byl uložen před touto změnou, takže jeho čísla byla uložena v SI. Převést je naposledy na aktuální jednotky? Pro lepší posouzení zde jsou některé průměry, které by se převedly, s hodnotami před převodem a po něm:';
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
$ec_lang['lpn_menu_map']='Mapa';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Zobrazit mapu ulic';
$ec_lang['lpn_basemap_satellite_show']='Zobrazit satelitní snímky';
$ec_lang['lpn_basemap_topo_show']='Zobrazit topografickou mapu';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='georeferencovaný';
$ec_lang['lpn_xymap']='místní';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Převést jako…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Kopie {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:4326), not a fourth case; EPSG:3857 is a
// projected system in meters since Task 775.
$ec_lang['lpn_convas_title']='Převést jako';
$ec_lang['lpn_convas_coordsys_tip']='Souřadnicový systém, na který se kopie převede. Liší-li se od systému tohoto projektu, následují dva kroky umístění. U projektu, který je již georeferencován, se oba kroky otevřou vyplněné, připravené k přijetí nebo změně.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Aktuální: {crs}';
$ec_lang['lpn_convas_epsg']='Souřadnicový systém EPSG';
$ec_lang['lpn_convas_epsg_tip']='Zvolte souřadnicový systém z registru EPSG. Navrženou volbou je WGS 84 (EPSG:4326), zeměpisná šířka a délka. WGS 84 / Pseudo-Mercator (EPSG:3857), běžně nazývaný Web Mercator, udává x a y v metrech a jeho vzdálenosti na mapě převyšují vzdálenosti na zemi s rostoucí vzdáleností od rovníku. Délky potrubí se v obou systémech počítají jako vzdálenosti na zemi.';
$ec_lang['lpn_convas_unnamed']='Nepojmenovaná (místní) georeference';
$ec_lang['lpn_convas_unnamed_tip']='Místní souřadnice v jednotce délky, s připojenou mapou světa.';
$ec_lang['lpn_convas_none_tip']='Místní souřadnice v jednotce délky, prozatím bez mapy světa.';
$ec_lang['lpn_convas_units_tip']='Jednotky, na které se kopie převede.';
$ec_lang['lpn_convas_round']='Zaokrouhlit převedené hodnoty';
$ec_lang['lpn_convas_round_tip']='Krok, na který se zaokrouhluje, použitý pouze na čísla, která tento převod přepisuje. Hodnoty, jejichž jednotka se nemění, zůstávají beze změny.';
$ec_lang['lpn_convas_round_none']='Bez zaokrouhlení';
$ec_lang['lpn_convas_round_flow']='Odběr a průtok';
$ec_lang['lpn_convas_label_col']='Přípona';
$ec_lang['lpn_convas_label_tip']='Text přidaný za touto hodnotou na popiscích mapy kopie, například „ mm“ nebo „ gpm“. Předvyplněno podle jednotky zvolené výše; vymažte jej, pokud nechcete žádnou příponu.';
$ec_lang['lpn_convas_oneway']='Převod zpět je druhý převod, nikoli krok zpět. Číslo převedené a převedené zpět se nemusí vrátit přesně v podobě, v jaké bylo zadáno.';
$ec_lang['lpn_convas_ok']='Převést';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} je jeden z mála uvedených souřadnicových systémů bez použitelných údajů o projekci, takže se z něj ani do něj nelze převádět. Nic nebylo převedeno.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='Převedená kopie je {name}. Původní projekt zůstává beze změny.';
$ec_lang['lpn_convas_cancelled']='Nic nebylo převedeno. Kopie je zavřena a původní projekt zůstává beze změny.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Zkopíruje tento projekt na novou kartu a převede kopii na souřadnicový systém a jednotky, které zvolíte. Mění-li se souřadnicový systém, průvodce vás provede nejprve přibližným přiblížením mapy za sítí a poté přesnějším změnou měřítka a otočením sítě na mapě. Tento projekt zůstává přesně tak, jak je. Chcete-li georeferencovat bez jakéhokoli převodu, použijte místo toho Mapa, Mapa světa, Připojit.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Tento projekt je už georeferencovaný, takže síť je už na mapě a nic se nepřesunulo. Zkontrolujte, že je na správném místě, a poté stiskněte tlačítko Umístit model sem a tlačítko Ponechat toto umístění.';
$ec_lang['lpn_georef_intro']='Umístění modelu má dva kroky. Krok 1 je přibližný: model zůstává na obrazovce pevně a vy posouváte a přibližujete mapu za ním, dokud není místo pod modelem přibližně ve správném měřítku. Tento krok nemá otočení. Krok 2 je přesný: tažením, změnou velikosti a otočením upravíte samotný model. Projekt začíná na mapě celého světa, proto nejprve najděte místo a poté stiskněte tlačítko Umístit model sem.';
$ec_lang['lpn_georef_adjust']='Model je nyní připojen k mapě, takže se pohybuje s mapou. Tažením modelu jej přesunete, tažením rohu změníte jeho velikost a tažením kulaté úchytky nad modelem jej otočíte. Nebo níže zadejte vzdálenost na zemi a úhel otočení.';
$ec_lang['lpn_georef_step1']='Krok 1 z 2 — rychlý';
$ec_lang['lpn_georef_step2']='Krok 2 z 2 — přesný';
$ec_lang['lpn_georef_step1_hint']='Projekt zůstává na obrazovce pevně. Posouvejte a přibližujte mapu pod ním, dokud mapa neukazuje přibližně správné místo v přibližně správném měřítku, a poté stiskněte tlačítko Umístit model sem.';
$ec_lang['lpn_georef_detach']='Zvednout jej znovu';
$ec_lang['lpn_georef_size_prompt']='Jak přibližně široké je pracoviště, napříč celým projektem?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Zkratka: stiskněte {key}.';
$ec_lang['lpn_tool_key_hint_two']='Zkratka: stiskněte {key} nebo {key2}.';
$ec_lang['lpn_tool_add_chain_tip']='Řetěz uzlů a potrubí: zadejte bod na mapě, kde se přidá uzel, a poté zadejte každý další bod, kde se přidá potrubí a uzel. Zadáním existujícího uzlu z něj pokračujte. Řetěz ukončíte klávesou Esc.';
// The Shape tool (Task 779). The word is Tom's: "we call it a 'Shape'".
$ec_lang['lpn_tool_add_shape']='Útvar';
$ec_lang['lpn_tool_add_shape_tip']='Nakreslí na mapě bod, lomenou čáru nebo mnohoúhelník. Útvar je poznámka a není součástí sítě. Zadejte každý bod, poté dokončete zadáním posledního bodu znovu, stisknutím klávesy Enter nebo kliknutím pravým tlačítkem. Zadáním prvního bodu znovu uzavřete Útvar do mnohoúhelníku.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Plošný výběr: okno, laso, mnohoúhelník.';
$ec_lang['lpn_area_selected']='{n} vybráno.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='V této oblasti nebylo nic nalezeno.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Přidávání a odebírání vrcholů potrubí. Zadáním bodu na potrubí přidáte vrchol, výběrem vrcholu jej odeberete a přetažením vrcholu jej přesunete. Vrchol mění automatickou délku, ale nepřidává ani nemění menší (místní) ztráty.';
$ec_lang['lpn_tool_undo_tip']='Délka historie Zpět = 20 akcí';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Přizpůsobí celou síť oknu mapy. Chcete-li přejít přímo na Přiblížit okno, stiskněte W nebo klikněte na malý trojúhelník v rohu tlačítka Zobrazit vše na panelu nástrojů. Viz také ovládání přiblížení mapy vpravo nahoře.';
$ec_lang['lpn_tool_zoom_selection_tip']='Přizpůsobí vybrané prvky oknu mapy. Nejprve vyberte jeden nebo více prvků.';
$ec_lang['lpn_tool_zoom_window_tip']='Zadejte rohy nebo přetáhněte obdélník. Opětovným stisknutím přejdete na Přiblížit vše.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Přiblížit. Klávesová zkratka: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Oddálit. Klávesová zkratka: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Jednoduché nebo složité hledání a nahrazení';
// **"Toolbar"** (Tom renamed it from "Toolbar key" to "Toolbar" on 2026-09-30).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. The row earns its place.
$ec_lang['lpn_help_icons']='Legenda panelu nástrojů';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Viditelnost';
$ec_lang['lpn_color_legend_open_tip']='Stisknutím otevřete nastavení barvení a změníte tyto barvy.';
$ec_lang['lpn_color_node_field']='Barvit uzly podle';
$ec_lang['lpn_color_link_field']='Barvit potrubí podle';
$ec_lang['lpn_color_ramp_sequential']='Sekvenční';
$ec_lang['lpn_color_ramp_diverging']='Divergentní';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Počet pásem';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Rozdělení pásem';
$ec_lang['lpn_color_ranges_note']='Hranice níže jsou po nastavení pevné; nesledují výsledky, jak se mění. Volba metody třídění dat výše nastaví hranice podle aktuálního stavu systému. Pokud kteroukoli hodnotu ručně změníte, metoda výše se změní na Ruční.';
$ec_lang['lpn_color_criterion_note']='Tato metoda přebírá své hranice z návrhové normy, takže dokud je zvolena, je počet barev pevně daný.';
$ec_lang['lpn_color_break_number']='Hranice musí být číslo. Mapa se nezměnila.';
$ec_lang['lpn_color_break_order']='Každá hranice musí být větší než ta předchozí. Mapa se nezměnila.';
$ec_lang['lpn_color_break_count']='Hranic musí být o jednu méně, než je počet barev. Mapa se nezměnila.';
$ec_lang['lpn_color_ramp_qualitative']='Kvalitativní';
$ec_lang['lpn_color_ramp_rainbow']='Duha';
$ec_lang['lpn_color_ramp_rainbow_eg']='shodné s EPANET';
$ec_lang['lpn_color_example_material']='Materiál';
$ec_lang['lpn_color_ramp_ylgnbu']='Žlutá až modrá';
$ec_lang['lpn_color_ramp_rdylbu']='Červená až modrá, přes žlutou';
$ec_lang['lpn_georef_drop']='Umístit model sem';
$ec_lang['lpn_georef_finish']='Ponechat toto umístění';
$ec_lang['lpn_georef_scale']='Vzdálenost na zemi na jednu jednotku výkresu';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Vypočteno automaticky. Úpravou lze změnit. Zadejte 1, aby se souřadnice souboru použily beze změny jako vzdálenost na zemi, například u souboru bez souřadnicového systému.';
$ec_lang['lpn_georef_rotation']='Otočení proti směru hodinových ručiček (stupně)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Otočení celého modelu proti směru hodinových ručiček, aby odpovídal novému souřadnicovému systému.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Umístit model sem natrvalo? Jednotlivé prvky lze poté stále přetahovat, ale pokračováním nyní se převedou všechny souřadnice najednou. Chcete-li získat zpět původní souřadnice, vraťte se k původnímu projektu a tento zavřete bez uložení.';
$ec_lang['lpn_georef_done']='Toto je nyní projekt lat/lon. Přetažením libovolného prvku jej přesunete blíž k jeho skutečné poloze.';
$ec_lang['lpn_georef_backdrop_unrotated']='Podkladový obrázek byl s modelem přesunut a zvětšen nebo zmenšen, ale nešlo jej otočit. K jeho zarovnání použijte Mapa, Podkladový obrázek, Přesunout.';
$ec_lang['lpn_georef_empty']='Tento soubor neobsahuje žádnou síť, takže není co umístit.';
$ec_lang['lpn_georef_unavailable']='Nástroj pro umístění se nenačetl. Načtěte stránku znovu a zkuste to znovu.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Dokončete převod tlačítkem „Ponechat toto umístění“ nebo stiskněte Zrušit, než přepnete projekt. Umístění platí pouze pro tento projekt.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Před uložením dokončete umístění tlačítkem „Ponechat toto umístění“, nebo stiskněte Zrušit. Projekt se stále umísťuje, takže to, co je na obrazovce, ještě není to, co by se zapsalo do souboru.';
$ec_lang['lpn_goto_menu']='Přejít na zeměpisnou šířku a délku…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='Zeměpisná šířka a délka, v tomto pořadí';
$ec_lang['lpn_goto_bad']='To není jedna zeměpisná šířka a jedna délka. Zkuste 38 -122, oddělené mezerou.';
$ec_lang['lpn_georef_goto']='Přejít na…';
$ec_lang['lpn_georef_twopt']='Použít dva známé body';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Umístí model přesně, jsou-li známy skutečné zeměpisné šířky a délky dvou bodů na výkresu. Zadejte jeden z nich, zadejte jeho zeměpisnou šířku a délku a totéž proveďte pro druhý bod. Poloha, měřítko a otočení se vypočtou z těchto dvou bodů. Opětovným stisknutím nebo klávesou Esc akci zrušíte.';
$ec_lang['lpn_georef_twopt_pick1']='Zadejte bod na výkresu, jehož zeměpisnou šířku a délku znáte.';
$ec_lang['lpn_georef_twopt_pick2']='Nyní zadejte druhý známý bod, co nejdál od prvního.';
$ec_lang['lpn_georef_twopt_same']='To je bod, který jste zvolili jako první. Zvolte jiný.';
$ec_lang['lpn_georef_twopt_done']='Model je nyní umístěn podle dvou zadaných bodů. Zkontrolujte jej a poté stiskněte tlačítko Ponechat toto umístění.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Spodní panel';
$ec_lang['lpn_pane_toggle_tip']='Zobrazí nebo skryje panel pod mapou. Obsahuje grafy a tabulku pro každý druh prvku.';
$ec_lang['lpn_pane_resize']='Tažením panel zvětšíte nebo zmenšíte';
$ec_lang['lpn_pane_tab_junctions']='Uzly';
$ec_lang['lpn_pane_tab_reservoirs']='Zdroje';
$ec_lang['lpn_pane_tab_tanks']='Nádrže';
$ec_lang['lpn_pane_tab_pipes']='Potrubí';
$ec_lang['lpn_pane_tab_pumps']='Čerpadla';
$ec_lang['lpn_pane_tab_valves']='Ventily';
$ec_lang['lpn_pane_tab_tip']='Upravujte prvky v tabulce podobné tabulkovému procesoru. Sloupce s výsledky nelze upravovat. Klávesové zkratky viz Nápověda, Poznámky.';
$ec_lang['lpn_pane_popout']='Otevřít v okně';
$ec_lang['lpn_pane_none']='Tato síť zatím nemá nic z tohoto druhu.';
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
$ec_lang['lpn_pane_text_attached']='Připojeno';
$ec_lang['lpn_pane_not_used']='Nepoužito';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Filtrováno podle {q}. Zobrazeno {n} z {all}.';
$ec_lang['lpn_pane_filter_clear']='Zobrazit vše';
// Added to the filtered table's line (Task 738): rows edited since Filter in table was pressed stay
// in the table even when they no longer match, dimmed and marked, until it is pressed again. {n} is
// how many. Worded as a label and a count so no plural form is needed.
$ec_lang['lpn_pane_filter_stale']='Řádky, které už neodpovídají: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Ničemu v této tabulce filtr neodpovídá.';
// Selection only (Task 757): the Tables pane filtered to what is selected on the map. Parallel to
// lpn_pane_filter_note. The line names the Find filter too when both are on.
$ec_lang['lpn_pane_filter_sel_note']='Pouze výběr. Zobrazeno {n} z {all}.';
$ec_lang['lpn_pane_filter_sel_and']='Filtrováno podle {q} a pouze výběr. Zobrazeno {n} z {all}.';
$ec_lang['lpn_pane_filter_sel_none']='Žádný z vybraných prvků není v této tabulce.';
$ec_lang['lpn_pane_sel_only']='Pouze výběr';
$ec_lang['lpn_pane_sel_only_none']='Není vybrán žádný prvek. Nejprve vyberte prvky na mapě.';
// Show scenarios (Tom, 2026-10-05): the table's cell menu switch that lists every asset once per
// scenario, with a Scenario column after ID.
$ec_lang['lpn_pane_scn_show']='Zobrazit scénáře';
// Two switches on the cell menu while Show scenarios is on (Tom, 2026-10-07): keep only the rows whose
// scenario holds a value of its own in this table, and keep only the open scenario's rows.
$ec_lang['lpn_pane_scn_ov_only']='Jen specifické hodnoty';
$ec_lang['lpn_pane_scn_cur_only']='Jen aktuální scénář';
$ec_lang['lpn_pane_inactive_show']='Zahrnout neaktivní prvky';
// The line above a table while either switch is on, beside the filter's own Show all. {filters} is one
// or both of the two switch names, joined by a comma; {n} the rows showing, {all} the rows without them.
$ec_lang['lpn_pane_scn_filter_note']='{filters}. Zobrazeno {n} z {all}.';
// The cell menu's item that removes the selected cells' scenario overrides, so each reads what its
// scenario inherits (Tom, 2026-10-06). Greyed when no selected cell holds one.
$ec_lang['lpn_ovm_child_ask']='Zrušit specifické hodnoty podřízených scénářů (celkem {n})?';
$ec_lang['lpn_ovm_child_tip']='Podřízené scénáře tuto hodnotu přepisují (celkem {n}). Kliknutím zrušíte jejich specifické hodnoty.';
$ec_lang['lpn_ovm_dot_clear']='Kliknutím ji zrušíte.';
$ec_lang['lpn_ovm_dot_set']='Zděděno. Kliknutím z ní uděláte specifickou hodnotu v tomto scénáři se zobrazenou hodnotou.';
$ec_lang['lpn_pane_clear_override']='Zrušit specifickou hodnotu';
// The tip on a table cell holding a value set in its row's scenario (Tom, 2026-10-06: "Demand alt.:
// Max day"). {category} is an lpn_alt_cat_* name; {alternative} is the alternative's name, which
// in Basic mode is its scenario's.
$ec_lang['lpn_pane_scn_alt_tip']='{category}, alt.: {alternative}';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Přiblížit a vybrat';
$ec_lang['lpn_goto_on_map']='Zobrazit na mapě';
$ec_lang['lpn_pane_select_on_map']='Vybrat na mapě';
$ec_lang['lpn_pane_unselect_on_map']='Zrušit výběr na mapě';
$ec_lang['lpn_pane_print']='Vytisknout tabulku';
// Tom, 2026-10-06. Copy with headings puts the heading line, unit included, above the selected cells; plain
// Copy never does. The two Export rows download the whole table as shown.
$ec_lang['lpn_pane_copy_heads']='Kopírovat se záhlavími sloupců';
// Tom, 2026-10-07. File, Export to, ODS/XLSX/CSV file: a box asking which tables and which scenarios.
// {format} is ODS, XLSX or CSV, the file format's own name, never translated.
$ec_lang['lpn_export_table_title']='Exportovat do {format}';
$ec_lang['lpn_export_table_current']='Aktuální';
$ec_lang['lpn_export_table_all']='Všechny';
$ec_lang['lpn_export_table_go']='Exportovat';
$ec_lang['lpn_export_table_scn_note']='Výsledky se exportují pouze pro naposledy vypočtený scénář.';

// **HIDE MAP READOUTS IS RETIRED, 2026-09-22** (Tom: "Hide map readouts was a print prep command.
// But it isn't very useful any more. Let's remove it."). lpn_clean_map, lpn_clean_map_off and
// lpn_clean_map_tip were deleted with the row; nothing else read them. lpn_clean_map and
// lpn_clean_map_tip are back since Task 805 for a DIFFERENT command (it hides controls, not readouts).
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
$ec_lang['lpn_menu_project']='Voda';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Vše, co se týká modelování vodovodní sítě (kromě ovládání přehrávání animace)';
$ec_lang['lpn_tables_menu']='Tabulky';
// Water > Morph (Task 781; Tom, 2026-10-14: *"I like the term 'Morph' (Transform) for this feature"*;
// first built as Change type, Tom, 2026-10-05: *"It would be nice to provide a tool under Water or Tables
// to Change node type for any asset, where if it has information that can't be ported to the new
// type, we alert and ask."*). The fly-out reuses lpn_tool_add_junction/_reservoir/_tank. The box it
// asks in lists one line per value lost: {id} is the asset's ID, {property} a field label the
// popup already uses, {value} the number or name with its unit, {scenario} a scenario's name.
// dev/asset-type.md.
$ec_lang['lpn_morph_menu']='Změnit typ';
$ec_lang['lpn_morph_tip']='Změní vybrané uzly na uzly, zdroje nebo nádrže, případně vybrané spoje na potrubí, čerpadla nebo ventily. Každý si ponechá své ID, své místo, svá připojení a každou hodnotu, kterou má i nový typ. Pokud by se něco ztratilo, budete nejprve dotázáni.';
$ec_lang['lpn_morph_ok']='Změnit';
// {ids} lists the selected assets of the other kind (nodes when a link type was chosen, and links
// when a node type was chosen), separated by commas.
$ec_lang['lpn_morph_other_kind']='Uzel lze změnit jen na jiný typ uzlu a spoj jen na jiný typ spoje. Typ nezměněn: {ids}';
// The Properties row shown where a scenario morphs the asset (Task 781): the type it is in this
// scenario, beside the override marker.
$ec_lang['lpn_field_type']='Typ';
$ec_lang['lpn_field_type_tip']='Typ tohoto prvku v tomto scénáři, nastavený příkazem Změnit typ. Zrušením specifické hodnoty se použije typ nadřazeného scénáře.';
$ec_lang['lpn_change_type_lost']='Tyto hodnoty budou ztraceny:';
// The key to the lines under it (Tom, 2026-10-06: *"Provide a key for the loss report. 'ID: Lost entry'."*).
$ec_lang['lpn_change_type_key']='Každý řádek: ID: vlastnost a hodnota, které by se ztratily';
$ec_lang['lpn_change_type_line']='{id}: {property} {value}';
$ec_lang['lpn_change_type_line_scenario']='{id}: {property} {value}, ve scénáři {scenario}';
$ec_lang['lpn_change_type_line_alternative']='{id}: {property} {value}, v alternativě {alternative}';
$ec_lang['lpn_change_type_more']='A dalších {n}.';
// Heads the lines a tank-to-reservoir or reservoir-to-tank change states rather than loses: the
// water surface is carried, so the new head or water depth is listed with its value.
$ec_lang['lpn_change_type_surface']='U těchto zůstane hladina vody tam, kde byla. Tlaková výška zdroje je nadmořská výška nádrže plus hloubka vody v ní a hloubka vody v nádrži je tlaková výška zdroje minus její nadmořská výška:';
$ec_lang['lpn_change_type_meaning']='Tato řízení a pravidla testují měněný uzel a budou jej číst jinak: uzel se testuje podle tlaku, nádrž nebo zdroj podle hladiny vody.';
// The link half (Tom, 2026-10-06: "Proceed."). Each heads a list of "ID: entry" lines.
$ec_lang['lpn_change_type_born']='Tyto hodnoty jsou nové a nastaví se stejně jako u nově nakresleného prvku:';
$ec_lang['lpn_change_type_no_curve']='{id}: Bez křivky tlakové výšky čerpadla, takže čerpadlo nepřidává žádnou tlakovou výšku, dokud není křivka zvolena, a export .inp je zapíše jako potrubí';
$ec_lang['lpn_change_type_becomes']='{id}: {property} {value}, ve scénáři {scenario}, se změní na {new}';
$ec_lang['lpn_change_type_customers']='Potrubí zásobuje odběratele pouze samo, proto budou tito odběratelé místo toho připojeni k uzlu uvedenému v závorkách, kde je jejich odběr již zahrnut. Zůstávají tam, kde jsou nakresleni, a jejich odběr se nemění:';
$ec_lang['lpn_change_type_setting']='Tato řízení a pravidla zadávají nebo testují nastavení měněného spoje. Nastavení je u potrubí, čerpadla a ventilu jiná veličina, proto je budou číst jinak:';
$ec_lang['lpn_change_type_rules']='Tyto řádky pravidel uvádějí spoj podle jeho druhu a místo toho uvedou jeho nový druh:';
$ec_lang['lpn_tables_menu_tip']='Zobrazení a úpravy prvků v tabulkách ve spodním panelu.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Spustit simulaci. Není nutné, je-li v Nastavení, Výpočet, Hydraulika zapnuto „Přepočítávat automaticky“. Je-li Přepočítávat vypnuto, zobrazí se na liště nástrojů tlačítko Vypočítat.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Přepočítávat automaticky';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Vypněte, je-li přepočet příliš pomalý. Dokud je zapnuto, je tlačítko Vypočítat skryté.';
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
$ec_lang['lpn_time_run_slow']='Výpočet této sítě trval {secs} s a síť je nastavena tak, aby se přepočítala po každé změně. Chcete-li to zastavit a získat zpět tlačítko Vypočítat, vypněte v Nastavení, v části Výpočet, Hydraulika, „Přepočítávat automaticky“.';
$ec_lang['lpn_time_no_report']='Zpráva o výpočtu zatím neexistuje. Zpráva je textová zpráva EPANET, takže se objeví poté, co je tato síť vypočtena.';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Nápověda';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Galerie snímků obrazovky';
$ec_lang['lpn_help_walkthroughs']='Návody';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Smazat síť';
$ec_lang['lpn_confirm_delete_network']='Smazat každý uzel, potrubí a textový popisek v tomto projektu? Podkladový obrázek, název projektu a nastavení zůstanou zachovány.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Najít a nahradit';
// Copy and Paste properties (Task 782; Tom, 2026-10-12: a clipboard, no confirmation). Identity and
// placement are never pasted.
$ec_lang['lpn_copy_props_menu']='Kopírovat vlastnosti';
$ec_lang['lpn_copy_props_done']='Zkopírovány vlastnosti prvku {id}.';
$ec_lang['lpn_copy_props_no_overrides']='Nejsou žádné specifické hodnoty ke zkopírování.';
$ec_lang['lpn_copy_props_done_ov']='Zkopírovány specifické hodnoty prvku {id} v tomto scénáři.';
$ec_lang['lpn_paste_alt_created']='Pro tento scénář byla vytvořena alternativa {name} kategorie {category}.';
$ec_lang['lpn_paste_props_menu']='Vložit vlastnosti do výběru';
$ec_lang['lpn_paste_props_off_none']='Nic není zkopírováno. Klikněte pravým tlačítkem na prvek nebo jej dlouze stiskněte a zvolte Kopírovat vlastnosti.';
$ec_lang['lpn_paste_props_off_select']='Vyberte prvky, do nichž se má vkládat, a poté zvolte Vložit vlastnosti do výběru.';
$ec_lang['lpn_paste_props_off_kind']='Žádný vybraný prvek nemůže přijmout zkopírované vlastnosti.';
$ec_lang['lpn_tsb_menu']='Graf časové řady';
// The map's right-click (and long press) menu on a Text and on a dragged label (2026-10-14). Edit text
// opens the in-place editor; Reset position sends a dragged label or an attached Text home.
$ec_lang['lpn_ctx_edit_text']='Upravit text';
$ec_lang['lpn_ctx_reset_position']='Obnovit polohu';
$ec_lang['lpn_ctx_reset_position_off_tip']='Obnovit polohu lze jen u popisku nebo připojeného textu, který byl přetažen z vlastní polohy.';
$ec_lang['lpn_tsb_off_tip']='Vyžaduje výsledky dlouhodobé simulace. Nastavte Celkovou dobu běhu v Nastavení, Výpočet, Čas a vypočítejte.';
$ec_lang['lpn_tsb_close']='Zavřít graf';
$ec_lang['lpn_tsb_resize']='Tažením změníte velikost';
$ec_lang['lpn_tsb_quantity']='Veličina grafu';
$ec_lang['lpn_tsb_max']='Před otevřením dalšího grafu jeden zavřete. Otevřeno může zůstat nejvýše {n}.';
$ec_lang['lpn_paste_done_one']='Vlastnosti prvku {id} vloženy do {to}. Změněné hodnoty: {n}.';
$ec_lang['lpn_paste_done_many']='Vlastnosti prvku {id} vloženy do {m} prvků. Změněné hodnoty: {n}.';
$ec_lang['lpn_paste_skip_breakdown']='Nevloženo: {n} (odběr je seznam kategorií).';
$ec_lang['lpn_paste_skip_valve']='Nevloženo: {n} (typy ventilů se liší).';
$ec_lang['lpn_find_title']='Najít a nahradit';
$ec_lang['lpn_find_scope']='Kde hledat';
$ec_lang['lpn_find_scope_all']='Vše';
$ec_lang['lpn_find_scope_source']='Dávkování';
$ec_lang['lpn_find_source_no_chemical']='Nesleduje se žádná chemická látka, takže žádný uzel nemá dávkování.';
$ec_lang['lpn_find_property']='Vlastnost';
$ec_lang['lpn_find_condition']='Podmínka';
$ec_lang['lpn_find_value']='Hodnota';
$ec_lang['lpn_find_btn']='Najít';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Filtrovat v aktuální tabulce';
$ec_lang['lpn_find_filter_tip']='V každé prohledávané tabulce zobrazí pouze řádky, které odpovídají poli „Kde hledat“ výše.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} z {all}';
$ec_lang['lpn_find_filter_summary']='Filtrováno podle {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Tento dotaz se netýká žádné tabulky.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='obsahuje';
$ec_lang['lpn_find_op_equals']='rovno';
$ec_lang['lpn_find_op_gt']='větší než';
$ec_lang['lpn_find_op_lt']='menší než';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='prázdné';
// {n} is a whole number.
$ec_lang['lpn_find_count']='Nalezeno: {n}. Výběrem jednoho z nich na něj přejdete.';
$ec_lang['lpn_find_shift_hint']='Shift+klik pro přepnutí: přidá prvek, pokud není ve výběru, nebo ho odebere, pokud ve výběru už je.';
$ec_lang['lpn_find_none']='Nic nevyhovuje.';
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
$ec_lang['lpn_find_op_top']='{n} nejvyšších';
$ec_lang['lpn_find_op_bottom']='{n} nejnižších';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Zadejte, co hledat.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Propojení';
$ec_lang['lpn_find_prop_demand_desc']='Popis této kategorie odběru';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='u uzlu nejsou žádná potrubí';
$ec_lang['lpn_find_op_conn_noopen']='u uzlu nejsou žádná otevřená potrubí';
$ec_lang['lpn_find_op_conn_nolinksource']='k uzlu nevede žádná cesta ke zdroji';
$ec_lang['lpn_find_op_conn_noopensource']='k uzlu nevede žádná otevřená cesta ke zdroji';
// A result row prints the NARROWEST condition true of that node beside its id, because "no links"
// says more than "no open path to a source" and both are true of the same node. It prints the
// SAME four keys above with the first letter capitalized in code (findConnLabel()), not a second
// capitalized copy of each (Task 699, Tom 2026-09-30: "do the Find redesign").
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Každý uzel je propojen.';
$ec_lang['lpn_find_conn_no_fixed']='Tato síť nemá žádný zdroj ani nádrž, takže není žádný zdroj, ke kterému by cesta vedla. Lze hledat pouze u uzlu nejsou žádná potrubí a u uzlu nejsou žádná otevřená potrubí.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Zadané hledání jako textový dotaz. Změna dotazu aktualizuje ovládací prvky výše.';
$ec_lang['lpn_find_query_label']='Dotaz';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Kombinujte podmínky pomocí A, NEBO a ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='A';
$ec_lang['lpn_find_q_or']='NEBO';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Ovládací prvky nedokážou vyjádřit dotaz níže, takže jsou skryté.';
$ec_lang['lpn_find_q_restore']='Použít místo toho ovládací prvky';
$ec_lang['lpn_replace_q_bad']='Tomuto dotazu nelze porozumět, takže nic nelze změnit. Nejprve jej opravte výše.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(na znaku {n})';
$ec_lang['lpn_find_q_err_empty']='Dotaz je prázdný, takže se nebude hledat nic.';
$ec_lang['lpn_find_q_err_scope']='Nic s názvem {w} k prohledání neexistuje. Zkuste jedno z: {list}';
$ec_lang['lpn_find_q_err_dot']='Mezi to, co hledat, a jeho vlastnost dejte tečku, například Junction.ID';
$ec_lang['lpn_find_q_err_prop']='Není vlastností {scope}: {w}. Zkuste jednu z: {list}';
$ec_lang['lpn_find_q_err_op']='Není podmínkou pro {prop}: {w}. Zkuste jednu z: {list}';
$ec_lang['lpn_find_q_err_value']='Tato podmínka potřebuje za sebou hodnotu: {op}';
$ec_lang['lpn_find_q_err_quote']='Textovou hodnotu dejte do uvozovek: {w} není číslo.';
$ec_lang['lpn_find_q_err_quote_end']='Tento text v uvozovkách nemá ukončující uvozovku.';
$ec_lang['lpn_find_q_err_close']='Tato závorka ( byla otevřena a nikdy uzavřena.';
$ec_lang['lpn_find_q_err_open']='Tato závorka ) nic neuzavírá.';
$ec_lang['lpn_find_q_err_end']='Za tímto nic nebylo očekáváno. Spojte dvě hledání pomocí {and} nebo {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Změnit nalezené';
$ec_lang['lpn_replace_prop']='Vlastnost ke změně';
$ec_lang['lpn_replace_value']='Nová hodnota';
$ec_lang['lpn_replace_source']='Zdroj nové hodnoty';
$ec_lang['lpn_replace_asked']='Nadmořské výšky vyžádané pro uzly ({n}). Výsledky se zobrazí po jejich přijetí.';
$ec_lang['lpn_replace_btn']='Nahradit';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Změnit prvky ({n})?';
$ec_lang['lpn_replace_apply']='Změnit je';
$ec_lang['lpn_replace_done']='Změněné prvky: {n}. Lze to vrátit zpět jedním krokem.';
$ec_lang['lpn_replace_none']='Nic by se nezměnilo.';
$ec_lang['lpn_replace_no_value']='Zadejte novou hodnotu.';
$ec_lang['lpn_replace_scope']='Vyberte výše jeden druh prvku, na kterém se mají hodnoty změnit.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Profil';
$ec_lang['lpn_graphs_menu']='Grafy';
// **THE SYNONYMS ARE IN dev/plain-sentences.md, THE CHANNEL MEANT FOR THEM.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission a plain sentence requires. Same text, correct channel.
$ec_lang['lpn_profile_title']='Profil podél trasy';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Vyberte uzel, kde trasa začíná.';
$ec_lang['lpn_profile_draw_more']='Pohybem po mapě zobrazíte trasu. Výběrem uzlu jej přidáte. Dvojitým kliknutím dokončíte. Esc zruší.';
$ec_lang['lpn_profile_draw_blocked']='Žádná trasa z {a} do {b}. Vyberte jiný uzel.';
$ec_lang['lpn_profile_tap_start']='Vyberte uzel, kde trasa začíná.';
$ec_lang['lpn_profile_tap_more']='Výběrem uzlu zobrazíte trasu. Podržením jej přidáte. Dvojitým klepnutím dokončíte. Dalším stisknutím Profilu zrušíte.';
$ec_lang['lpn_profile_say_idle']='Dalším stiskem Profilu vyberete na mapě novou trasu.';
$ec_lang['lpn_profile_none']='Zatím žádná trasa. Dalším stiskem Profilu ji vyberete na mapě.';
$ec_lang['lpn_profile_choose']='Vyberte počáteční a koncový uzel.';
$ec_lang['lpn_profile_no_path']='Tyto dva uzly nejsou spojeny žádnou trasou.';
$ec_lang['lpn_profile_no_solve']='Zatím žádné výsledky, takže je vykreslen jen terén.';
$ec_lang['lpn_profile_summary']='Uzlů: {n}, délka: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Vzdálenost podél trasy ({u})';
$ec_lang['lpn_profile_axis_elev']='Nadmořská výška a tlaková výška ({u})';
$ec_lang['lpn_profile_ground']='Povrch terénu';
$ec_lang['lpn_profile_hgl']='Čára tlakové výšky';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Upravit';
$ec_lang['lpn_profile_edit_tip']='Změňte jeden konec trasy, nebo z ní odeberte jeden uzel, aniž byste kreslili celou trasu znovu.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Tažením libovolného bodu na trase jej přesunete. Výběrem bodu, který jste přidali, jej odeberete.';
$ec_lang['lpn_profile_edit_tap']='Tažením libovolného bodu na trase jej přesunete. Výběrem bodu, který jste přidali, jej odeberete.';
$ec_lang['lpn_profile_edit_nowhere']='Bod na trase musí být uzel. Trasa zůstává beze změny.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Uložené trasy';
$ec_lang['lpn_profile_new']='Nová uložená trasa…';
$ec_lang['lpn_profile_new_name']='Trasa {n}';
$ec_lang['lpn_profile_rename']='Přejmenovat trasu…';
$ec_lang['lpn_profile_delete']='Smazat trasu';
$ec_lang['lpn_profile_open']='Otevřít soubor profilu EPANET…';
$ec_lang['lpn_profile_file_done']='Profil načten ze souboru: v této síti nalezeno {used} z {total} uzlů.';
$ec_lang['lpn_profile_file_missing']='Uvedeno v souboru, ale není v této síti: {ids}.';
$ec_lang['lpn_profile_file_short']='Soubor uvádí méně než dva uzly této sítě, takže není co vykreslit jako profil.';
$ec_lang['lpn_profile_prompt_name']='Název této trasy';
$ec_lang['lpn_profile_delete_confirm']='Smazat uloženou trasu {name}? Samotný výkres se nezmění.';
$ec_lang['lpn_profile_none_saved']='Zatím žádné uložené trasy';
$ec_lang['lpn_profile_missing']='Uložená trasa {name} používá uzly, které v tomto projektu nejsou: {ids}';
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
$ec_lang['lpn_ts_menu']='Časová řada';
$ec_lang['lpn_ts_tip']='Vykreslí graf jednoho nebo více prvků v průběhu simulace s časovým průběhem.';
$ec_lang['lpn_ts_title']='Hodnoty v čase';
$ec_lang['lpn_ts_group_nodes']='Uzly';
$ec_lang['lpn_ts_group_links']='Spoje';
$ec_lang['lpn_pgraph_none']='Tento prvek nemá v aktuálním výpočtu žádné výsledky.';
// The Properties graph's own selector entry for a source share (Tom, 2026-09-30: "In selector, use
// 'Source share from {trace node}'"). Distinct from the shared lpn_result_source_share, which still
// labels the bare quantity everywhere else -- the Tables column, Find's property list, the Labels
// popover and the colour legend -- where naming the trace node in every heading would be clutter.
$ec_lang['lpn_pgraph_source_share_from']='Podíl původu z uzlu {node}';
$ec_lang['lpn_result_pump_head']='Tlaková výška';
$ec_lang['lpn_result_pump_head_tip']='Tlaková výška, kterou čerpadlo přidává mezi sáním a výtlakem, zobrazená jako kladné číslo. Řešič a soubory EPANET ji nesou jako zápornou ztrátu tlakové výšky.';
// The Full report puts every node and link in one table, where a node's Head column already sits, so a
// pump's column there says whose head it is. Elsewhere the pump's own row or tab says so, and lpn_result_pump_head is enough.
$ec_lang['lpn_report_pump_head']='Tlaková výška čerpadla';
$ec_lang['lpn_ts_add']='Přidat vybrané';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Nebylo nalezeno nic k přidání.';
$ec_lang['lpn_ts_clear']='Odebrat vše';
$ec_lang['lpn_ts_chip_tip']='Odebrat {id} z grafu';
$ec_lang['lpn_ts_none']='Zatím není co vykreslit. Vyberte prvky na mapě a stiskněte Přidat vybrané.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Zatím žádné výsledky s časovým průběhem. Stiskněte Vypočítat pro spuštění simulace.';
$ec_lang['lpn_ts_summary']='Prvky: {n}, časy hlášení: {steps}';
$ec_lang['lpn_ts_axis_time']='Uplynulý čas';
// EPANET's Frequency Plot (Task 600): one value over every junction or every pipe, at the time the
// map shows, against the percent of them less than it. "Percent less than" is EPANET's own axis
// title. {n} and {total} are counts, {time} an elapsed time; all substituted, never concatenated.
// The Junctions/Pipes choice reuses lpn_pane_tab_junctions and lpn_pane_tab_pipes.
$ec_lang['lpn_freq_menu']='Četnost';
$ec_lang['lpn_freq_tip']='Rozdělení četností vlastnosti';
$ec_lang['lpn_freq_title']='Rozdělení hodnot';
$ec_lang['lpn_freq_none']='Pro tuto hodnotu zatím nejsou žádné výsledky, takže není co vykreslit.';
$ec_lang['lpn_freq_summary']='Vykresleno: {n} z {total}';
$ec_lang['lpn_freq_summary_time']='Vykresleno: {n} z {total}, v čase {time}';
$ec_lang['lpn_freq_axis_percent']='Procento nižších hodnot';
// EPANET's Contour Plot (Task 600), drawn as a layer under the map rather than in a window of its
// own, from the pipes outward. {n} and {p} are counts, {k} and {i} numbers, {u} a unit symbol, {m} a
// distance in metres; all substituted. lpn_contour_buffer_unit follows the Buffer number box.
// lpn_contour_consent_1..4 are the terrain question's four paragraphs, reworded for what the contour
// plot sends: tile numbers for the network's area, not each node's latitude and longitude.
$ec_lang['lpn_contour_menu']='Vrstevnice';
$ec_lang['lpn_contour_tip']='Zobrazí na mapě vrstevnicový graf: barvy uzlů se rozprostřou podél potrubí i vedle něj a doplní je popsané vrstevnice. Otevře okno pro jeho doladění nebo vypnutí.';
$ec_lang['lpn_contour_plot']='Vrstevnicový graf';
$ec_lang['lpn_contour_show']='Zobrazit vrstevnice';
$ec_lang['lpn_contour_show_tip']='Zrušením zaškrtnutí skryjete výplň i vrstevnice; zaškrtnutím je vrátíte tak, jak byly. Barvy uzlů zůstávají.';
$ec_lang['lpn_contour_fill']='Výplň';
$ec_lang['lpn_contour_fill_tip']='Plynulá přechází z barvy jedné třídy do druhé. Pásy vykreslí každou třídu barevné legendy jednolitě.';
$ec_lang['lpn_contour_fill_smooth']='Plynulá';
$ec_lang['lpn_contour_fill_bands']='Pásy';
$ec_lang['lpn_contour_opacity']='Krytí výplně';
$ec_lang['lpn_contour_lines']='Vrstevnice';
$ec_lang['lpn_contour_interval']='Interval';
$ec_lang['lpn_contour_buffer']='Dosah';
$ec_lang['lpn_contour_buffer_unit']='× medián délky potrubí';
$ec_lang['lpn_contour_buffer_tip']='Dosah barvy od každého potrubí, jako násobek mediánu délky potrubí. Ve vnější části postupně slábne.';
$ec_lang['lpn_contour_few']='Příliš málo uzlů pro vrstevnice.';
$ec_lang['lpn_contour_support']='Vrstevnicový graf: {n} uzlů, interpolováno podél {p} potrubí a až do {k}násobku mediánu délky potrubí vedle nich. Přes čerpadla, ventily ani uzavřené spoje se barva nepřenáší.';
$ec_lang['lpn_contour_support_lines']='Vrstevnice po {i} {u}.';
$ec_lang['lpn_contour_too_many']='Při tomto intervalu je vrstevnic příliš mnoho; zvětšete interval, aby se vykreslily.';
$ec_lang['lpn_contour_dem']='Terén mezi uzly z Mapbox DEM';
$ec_lang['lpn_contour_dem_tip']='Mezi uzly se tlak rovná interpolované tlakové výšce minus výška terénu z Mapbox DEM, takže může klesnout pod nejnižší tlak v uzlech na kopci, kde síť žádný uzel nemá. Berte terén jako vrstevnicovou mapu, ne jako zaměření.';
$ec_lang['lpn_contour_support_dem']='Mezi uzly je tlak interpolovaná tlaková výška minus nadmořská výška terénu z Mapbox DEM, vzorkovaná zhruba každých {m} m.';
$ec_lang['lpn_contour_dem_failed']='Terén se z Mapbox DEM nepodařilo přečíst, takže se tlak interpoluje pouze mezi uzly.';
$ec_lang['lpn_contour_consent_1']='Vykreslení tlaku nad terénem odešle oblast, kterou vaše síť pokrývá, jako čísla mapových dlaždic Mapbox na api.mapbox.com, aby se tam přečetla výška terénu.';
$ec_lang['lpn_contour_consent_2']='Toto je jiná otázka než mapové obrázky na pozadí vašeho projektu. Obrázky říkají jen to, kam se díváte. Tyto dlaždice říkají, kde je vaše síť. Mapbox dostane čísla těchto dlaždic a vaši IP adresu. Nic jiného neposíláme: žádné jméno, žádné potrubí, žádný projekt. Nic si o tom neevidujeme a v tomto zařízení se neukládá nic kromě vaší odpovědi na tuto otázku.';
$ec_lang['lpn_contour_consent_3']='Smíme poslat Mapboxu čísla dlaždic oblasti vaší sítě?';
$ec_lang['lpn_contour_consent_4']='Pokud odpovíte ne, vše ostatní na této stránce funguje přesně jako dosud a vrstevnicový graf se vykreslí pouze mezi uzly. Ano si pamatujeme, abychom se nemuseli ptát znovu. Ne se neukládá vůbec.';
// EPANET's System Flow plot (Task 600). "System flow" is its Graph Selection name, "System flow
// balance" its window title, "Produced" and "Consumed" its series. The definition is its own code
// (Fgraph.pas GetSysFlow): junction and reservoir demands only, split by sign; tanks in neither.
// The axis reuses lpn_result_flow and lpn_ts_axis_time.
$ec_lang['lpn_sysflow_menu']='Bilance průtoku';
$ec_lang['lpn_sysflow_tip']='Vykreslí celkový vyrobený a celkový spotřebovaný průtok v čase v rámci simulace s časovým průběhem. Nádrže nejsou v žádném z celků, takže kde se obě čáry rozcházejí, nádrže se plní nebo vyprazdňují.';
$ec_lang['lpn_sysflow_title']='Bilance průtoku';
$ec_lang['lpn_sysflow_produced']='Vyrobeno';
$ec_lang['lpn_sysflow_produced_tip']='Celkový průtok do sítě ze zdrojů a ze záporných odběrů.';
$ec_lang['lpn_sysflow_consumed']='Spotřebováno';
$ec_lang['lpn_sysflow_consumed_tip']='Součet všech kladných odběrů: voda odebraná ze sítě v uzlech a jakýkoli průtok do zdroje.';
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
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Nový projekt';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Souřadnicový systém';
$ec_lang['lpn_new_coordsys_tip']='Zvolte souřadnicový systém sítě. Jediným způsobem, jak tuto volbu změnit, je příkaz „Soubor, Převést jako…“ do nového projektu, a tento převod je přibližný.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Místní, schematický nebo vlastní';
$ec_lang['lpn_new_coordsys_local_tip']='Bez georeferencování. Připojte vlastní podkladový obrázek, nebo žádný.';
// ---- THE COORDINATE SYSTEM BOX -----------------------------------------------------------------
// Tom's summary: it "uses the map view as a UX element to filter the universe of projections to the
// ones applicable to the project (view). Lets the user filter by name and select a projection at
// any time." (His own words, kept verbatim; "projection" in visitor strings became "coordinate
// system" on 2026-09-25 -- don't expose the word "projection".) Two filters over one catalogue, and
// the catalogue itself is not keyed: a coordinate system's NAME is the EPSG register's own, exactly
// as the OpenStreetMap credit is, and a GIS reader in any language looks for those characters.
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25) is lpn_new_coordsys, as are its list label and
// the New project box's chooser button (Task 699): it names the box's own subject rather than
// either caller's radio label.
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='Filtrovat podle pohledu mapy';
$ec_lang['lpn_crs_view_tip']='Nabízí pouze souřadnicové systémy, které pokrývají místo, na které se mapa právě dívá. Zrušením zaškrtnutí zobrazíte celý seznam.';
$ec_lang['lpn_crs_place']='Vyhledávání podle názvu místa';
$ec_lang['lpn_crs_place_tip']='Hledání se odesílá do služby OpenStreetMap pro vyhledávání názvů míst a při prvním použití se vyžádá oprávnění. Nový zeměpisný projekt také začíná na zde nalezeném místě.';
$ec_lang['lpn_crs_search']='Hledat';
$ec_lang['lpn_crs_name']='Filtr podle názvu projekce';
$ec_lang['lpn_crs_name_tip']='Text, který filtruje seznam: zobrazí se pouze souřadnicové systémy, jejichž název nebo kód EPSG jej obsahuje.';
$ec_lang['lpn_crs_list_tip']='Souřadnicové systémy, které vyhovují filtrům výše. Vyberte jeden a stiskněte OK.';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Zatím nebylo vyhledáno žádné místo, takže je nabízen celý seznam. Vyhledejte místo výše nebo přibližte mapu, aby se seznam zúžil.';
$ec_lang['lpn_crs_count']='Zobrazeno {n} z {total} projekcí.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} z {total} souřadnicových systémů pokrývá tuto síť.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(bez mapy)';
// Shown beside WGS 84 (EPSG:4326) in the chooser only (Task 775), never on the status strip.
$ec_lang['lpn_crs_suggested_mark']='(navrženo)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} je jeden z mála uvedených souřadnicových systémů bez použitelných údajů o projekci. To znamená, že mapa světa, vyhledávání názvů míst a nadmořské výšky DEM nefungují. Vašich souřadnic se to netýká.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='nepojmenovaný';
$ec_lang['lpn_crs_none']='Bez georeferencování';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Jednotky a další nastavení se ukládají s každým projektem, proto tato volba platí pouze pro tento projekt a neukládá se jako nastavení prohlížeče. Chcete-li předvolby použít opakovaně, uložte prázdný projekt jako šablonu a každý nový projekt začněte z ní.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Petaluma, Kalifornie';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Vytvořit';
$ec_lang['lpn_file_open']='Otevřít…';
$ec_lang['lpn_file_save']='Uložit';
$ec_lang['lpn_file_saveas']='Uložit jako…';
$ec_lang['lpn_file_revert']='Vrátit k uloženému';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Nedávné soubory';
// Edited by TGH 2026-09-07
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
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='OK';
// **TASK 718** (Tom, 2026-09-25: *"We have three import items. It's probably time for an Import
// sub-menu."*). The three rows -- surveyed points, an EPANET file, and libraries -- now open as a
// fly-out off one row, the same submenu idiom Help > Toolbar already uses. Each row keeps its
// own existing key and tip; only this one row is new.
$ec_lang['lpn_file_import_menu']='Importovat…';
$ec_lang['lpn_file_import_inp']='Importovat soubor EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Načte síť ze souboru EPANET, ať už jde o textový soubor .inp, nebo soubor .net, který ukládá EPANET, a uloží ji v tomto prohlížeči jako nový projekt.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
// File > Export is a submenu (Tom, 2026-10-06), so its rows drop the verb the heading carries. The
// two keys above are what the rows were called before it.
$ec_lang['lpn_file_export_menu']='Exportovat…';
$ec_lang['lpn_file_export_item_inp']='Soubor EPANET…';
$ec_lang['lpn_file_export_item_geojson']='Soubor GeoJSON…';
$ec_lang['lpn_file_export_item_ods']='Soubor ODS…';
$ec_lang['lpn_file_export_item_xlsx']='Soubor XLSX…';
$ec_lang['lpn_file_export_item_csv']='Soubor CSV…';
$ec_lang['lpn_file_export_tables_tip']='Stáhne tabulky tak, jak je zobrazuje panel Tabulky, v jednom sešitu s listem pro každou tabulku (a pro každý zvolený scénář) a s listem pro každou knihovnu, na kterou se jejich ID odkazují: vzorce, křivky, typy potrubí a armatury. Výsledky jsou zahrnuty pouze pro naposledy vypočtený scénář.';
$ec_lang['lpn_file_export_csv_tip']='Stáhne tabulku tak, jak ji zobrazuje panel Tabulky. Jedna tabulka se stáhne jako jeden soubor CSV bez knihoven. Více tabulek nebo scénářů se stáhne jako jeden soubor zip se soubory CSV a s jedním souborem pro každou knihovnu, na kterou se jejich ID odkazují. Výsledky jsou zahrnuty pouze pro naposledy vypočtený scénář.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Stáhne tuto síť jako soubor EPANET .inp (případně v souboru zip spolu s obrázkem). Vše, co formát .inp nedokáže uchovat, je poté vypsáno.';
$ec_lang['lpn_status_inp_exported']='Exportováno: {file}.';
$ec_lang['lpn_status_inp_exported_picture']='Exportováno: {zip}, který obsahuje soubor EPANET {file}, jeho podkladový obrázek {picture} a světový soubor {world}. Rozbalte všechny tři soubory do jedné složky a poté tam otevřete soubor .inp v programu EPANET; obrázek se načte spolu s ním.';
$ec_lang['lpn_status_inp_exported_no_picture']='Exportováno: {file}. Podkladový obrázek se nepodařilo uložit, proto soubor .inp žádný neuvádí; v programu EPANET jej přidáte příkazem Zobrazit, Podklad, Načíst.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_flat_customers_inactive']='{n} z těchto odběratelů je přiřazeno k uzlu, který je v tomto scénáři neaktivní, a jejich odběr proto v souboru není.';
$ec_lang['lpn_inp_export_flat_inactive_controls']='Tato řídicí pravidla a pravidla odkazují na prvek, který je v tomto scénáři neaktivní, a proto v souboru nejsou: {ids}';
$ec_lang['lpn_inp_export_differences']='Věcí, které formát .inp nedokáže uchovat: {n}.';
$ec_lang['lpn_inp_export_difference_one']='Jedna věc, kterou formát .inp nedokáže obsáhnout.';
$ec_lang['lpn_inp_export_refused']='Tento projekt nelze zapsat jako soubor EPANET: {detail}';
// Task 772: File > Export DXF file. The model's data for AutoCAD and other CAD programs.
$ec_lang['lpn_file_export_item_dxf']='Soubor DXF…';
$ec_lang['lpn_file_export_dxf_tip']='Stáhne tuto síť pro AutoCAD a další programy CAD: uzly jako bloky se symboly, potrubí, čerpadla a ventily jako polyčáry a každý prvek jako blok, jehož atributy nesou jeho ID a hodnoty vlastností v jednotkách projektu.';
$ec_lang['lpn_dxf_export_no_utm']='Soubor DXF nebyl zapsán: tato síť leží mimo zeměpisné šířky, které UTM pokrývá (80° j. š. až 84° s. š.), a výkres potřebuje rovinnou souřadnicovou síť, do které se kreslí.';
$ec_lang['lpn_dxf_export_refused']='Soubor DXF nebyl zapsán: nenačetl se převod souřadnic, který je k tomu potřeba. Zkontrolujte připojení a zkuste to znovu.';
$ec_lang['lpn_dxf_export_failed']='Soubor DXF nebyl zapsán: zastavila jej chyba na této stránce ({error}).';
// The read-me written into the file as a block of attributes, on a layer that does not plot; the
// file writes it in capital letters. Each says what
// the coordinates are and claims no coordinate system the file does not have. {unit} is a length
// unit as written in English (ft, m), not translated; {crs} is a coordinate system name with its EPSG code.
$ec_lang['lpn_dxf_note_grid']='Souřadnice: X a Y tohoto projektu, v {unit}. Souřadnicový systém není uveden.';
$ec_lang['lpn_dxf_note_crs']='Souřadnice: {crs}, přesně tak, jak je projekt uvádí.';
$ec_lang['lpn_dxf_note_geo']='Souřadnice: {crs}, v metrech, nikoli zeměpisná šířka a délka. Zeměpisné šířky a délky projektu byly na tuto síť převedeny.';
$ec_lang['lpn_dxf_exported_geo']='Exportováno: {file}. Jeho souřadnice jsou {crs}, v metrech, nikoli zeměpisná šířka a délka.';
// {prefix} is the layer-name prefix, C-WATR-MODL-; {example} is a whole layer name such as
// C-WATR-MODL-NODE-BASE.
$ec_lang['lpn_dxf_note_blocks']='Hladiny (layers) se jmenují {prefix}, kód prvku, spojovník a alternativa, například {example}. Každý prvek je blok vložený v měřítku 1 s atributy vysokými 1 jednotku; výšku textu nastavíte změnou měřítka bloků. Každý atribut je viditelný; atributy jednoho prvku jsou naskládány do sloupce vedle jeho symbolu.';
// {n} is a whole number; {max} is 2049. Each shortened value ends in three periods (...).
$ec_lang['lpn_dxf_note_shortened']='Hodnoty delší, než soubor DXF dovoluje ({max} znaků): {n}. Každá byla zkrácena a končí třemi tečkami.';
// {n} is a whole number; {tag} is an attribute tag in capitals, BASE_DEMAND in English.
$ec_lang['lpn_dxf_note_categories']='Uzly s více než jednou kategorií odběru ({n}). Jejich atribut {tag} obsahuje součet základních odběrů všech kategorií.';
// GeoJSON export (Task 728). The command is worded like Export EPANET file. Positions in a GeoJSON
// file are always longitude and latitude (RFC 7946), so a project with no place on the Earth is
// refused and told how to get one, never written with an invented coordinate system.
$ec_lang['lpn_file_export_geojson_tip']='Stáhne tuto síť jako soubor GeoJSON pro QGIS, ArcGIS Pro a další programy GIS. Uzly, nádrže a zdroje jsou body, potrubí, čerpadla a ventily jsou čáry sledující své vrcholy. Polohy jsou zeměpisná šířka a délka. Výsledky jsou zahrnuty pouze tehdy, je-li síť vyřešena.';
// Workspace export and import (Tom, 2026-10-07). {file}, {n}, {r}, {u} and {version} are filled in by the page.
$ec_lang['lpn_file_export_item_workspace']='Pracovní plocha…';
$ec_lang['lpn_file_export_workspace_tip']='Stáhne malý soubor s polohou oken, jejich velikostmi, informací o tom, která jsou otevřená nebo ukotvená, a velikostmi panelů a sloupců, spolu s volbami zobrazení této stránky, například které bubliny nápovědy a karta při najetí jsou zobrazeny. Projekty, nastavení projektů a cookies (jazyk, souhlas, jednotky) v něm nejsou. Načtěte jej na jiné obrazovce nebo v jiném prohlížeči příkazem Soubor, Importovat, Pracovní plocha.';
$ec_lang['lpn_file_import_workspace']='Pracovní plocha…';
$ec_lang['lpn_file_import_workspace_tip']='Použije soubor pracovní plochy uložený příkazem Soubor, Exportovat, Pracovní plocha: polohy a velikosti oken, ukotvení, velikosti panelů a volby zobrazení této stránky, například které bubliny nápovědy a karta při najetí jsou zobrazeny. Projekty a cookies se nemění.';
$ec_lang['lpn_workspace_exported']='Pracovní plocha uložena do {file}: {n} nastavení.';
$ec_lang['lpn_workspace_imported']='Pracovní plocha použita ze souboru {file}. Použitá nastavení: {n}. Vrácená na výchozí hodnoty: {r}.';
$ec_lang['lpn_workspace_ignored']='Položky ignorované, protože nebyly rozpoznány: {u}.';
$ec_lang['lpn_workspace_refused_unreadable']='Tento soubor nešlo přečíst jako pracovní plochu, proto se nic nezměnilo.';
$ec_lang['lpn_workspace_refused_format']='Toto není soubor pracovní plochy uložený touto stránkou, proto se nic nezměnilo.';
$ec_lang['lpn_workspace_refused_newer']='Tento soubor pracovní plochy uložila novější verze této stránky (formát {version}), proto se nic nezměnilo.';
$ec_lang['lpn_workspace_confirm']='Nahradit rozvržení pracovní plochy tohoto prohlížeče rozvržením ze souboru?';
$ec_lang['lpn_workspace_refused_storage']='Úložiště prohlížeče je plné nebo nedostupné, proto pracovní plocha nebyla použita.';
$ec_lang['lpn_geojson_refused_local']='Soubor GeoJSON obsahuje pouze zeměpisnou šířku a délku, ale tento projekt je nakreslen v místní souřadnicové síti bez umístění na Zemi. Nejprve jej georeferencujte příkazem Mapa, Mapa světa, Připojit a poté exportujte znovu.';
$ec_lang['lpn_geojson_refused_range']='Tyto polohy nejsou platné zeměpisné šířky a délky: {detail}';
$ec_lang['lpn_geojson_refused_crs']='Souřadnicový systém tohoto projektu ({detail}) tato stránka nezná, proto nelze jeho polohy převést na zeměpisnou šířku a délku. Příkazem Převést jako… zkopírujte projekt do systému, který tato stránka zná, a poté exportujte znovu.';
$ec_lang['lpn_geojson_refused_empty']='Zatím není co exportovat. Nejprve nakreslete nebo otevřete síť.';
$ec_lang['lpn_geojson_results_in']='Výsledky zobrazené na obrazovce jsou zahrnuty.';
$ec_lang['lpn_geojson_results_out']='Výsledky nejsou zahrnuty, protože síť není vyřešena.';
$ec_lang['lpn_inp_bad_file']='Tento soubor se nepodařilo přečíst jako soubor sítě EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Vypadá to na soubor .net z programu EPANET, ale tato stránka jej nedokázala přečíst. Otevřete jej v programu EPANET a pomocí příkazu Soubor, Export, Síť jej tam uložte jako soubor .inp, a poté tento soubor importujte.';
$ec_lang['lpn_inp_report_heading']='Importováno {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} uzlů, zdrojů a nádrží, {links} potrubí, čerpadel a ventilů, v jednotkách {units}.';
$ec_lang['lpn_inp_report_clean']='Všechna data v souboru byla importována. Nic nebylo vynecháno.';
$ec_lang['lpn_inp_report_label_anchor']='Textové popisky jsou umístěny stejně jako v EPANETu, od jejich levého horního rohu.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='Soubory EPANET neobsahují souřadnicový systém, takže tento soubor zpočátku nebude georeferencovaný. Chcete-li jej umístit na mapu světa, použijte Mapa, Mapa světa… Chcete-li převést jeho souřadnice, použijte Soubor, Převést jako…';
$ec_lang['lpn_inp_backdrop_attach']='Připojit {file}…';
$ec_lang['lpn_inp_backdrop_attach_tip']='Webová stránka nemůže otevřít obrázek podle jeho názvu. Vyberte jej ve svém zařízení a umístí se tam, kam podle souboru patří.';
$ec_lang['lpn_inp_backdrop_attached']='Připojeno: {file}, umístěno tam, kam podle souboru patří.';
$ec_lang['lpn_inp_backdrop_attached_other']='Připojeno: {picked}, umístěno tam, kam podle souboru patří. Soubor uvádí {file}, což je jiný název.';
$ec_lang['lpn_inp_report_lead']='Tato stránka nepoužívá všechny funkce programu EPANET, ale žádná data v souboru se nezahazují. Seznam níže uvádí data v souboru, která jsou zachována, ale nepoužita, a všechny změny provedené při importu:';
$ec_lang['lpn_inp_drop_headloss']='Tento soubor nepoužívá vzorec Hazen-Williams. Tato stránka počítá podle Hazen-Williams, proto byla čísla drsnosti potrubí zachována přesně tak, jak byla zapsána, ale zde uvedené výsledky se nebudou shodovat s výsledky v programu EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Tyto nádrže nemají svislé stěny: soubor udává jejich tvar jako křivku objemu. Křivka je uložena v okně Knihovny, nádrž na ni stále odkazuje a simulace s časovým průběhem ji používá k výpočtu hladiny při plnění a vyprazdňování nádrže. Jednoobdobá analýza tím není ovlivněna, protože hladina vody je taková, jak je uvedena v souboru. Průměr uvedený v souboru je uložen vedle křivky a používá se ke kreslení a řešení nádrže bez křivky.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Tyto škrticí ventily byly importovány jako škrticí ventily se ztrátou uvedenou v souboru.';
$ec_lang['lpn_inp_drop_valve_active']='Tyto ventily regulují tlak nebo průtok a jejich stav se mění podle hydraulických podmínek. Byly importovány bez ztráty dat a tato stránka je řeší.';
$ec_lang['lpn_inp_drop_valve']='Tyto ventily jsou popsány křivkou nebo pevným poklesem tlaku a tato stránka takový prvek nemá. Byly importovány jako otevřená potrubí, takže síť zůstává propojená, ale na těchto místech se tlak a průtok již neregulují.';
$ec_lang['lpn_inp_drop_cv']='V programu EPANET tato potrubí propouštějí průtok pouze jedním směrem (zpětné ventily). Byla importována jako běžná potrubí, takže průtok jimi nyní může procházet oběma směry.';
$ec_lang['lpn_inp_drop_demands']='Tyto uzly měly více než jeden odběr. Odběry byly sečteny do jediného odběru, který tato stránka uchovává.';
$ec_lang['lpn_inp_drop_patterns']='Tato stránka nenačetla vzorce odběru, protože se nenačetl modul simulace s časovým průběhem. Každý odběr je hodnota uvedená v souboru.';
$ec_lang['lpn_inp_drop_demand_pattern']='Tyto uzly mají odběry, které se v průběhu výpočtu mění. Jejich vzorce byly importovány celé a zobrazený odběr je hodnota v čase uvedeném na hodinách.';
$ec_lang['lpn_inp_drop_emitters']='Tyto uzly mají součinitel postřikovače nebo úniku. Byl zachován a je zahrnut do výpočtu, ale na této stránce zatím není možné jej zobrazit ani změnit.';
$ec_lang['lpn_inp_drop_curve_long']='Tato křivka čerpadla měla více než tři body. Byly zachovány její nejnižší, střední a nejvyšší bod, protože tato stránka proloží křivku nejvýše třemi body.';
$ec_lang['lpn_inp_drop_curve_missing']='Toto čerpadlo odkazuje na křivku, která v souboru není. Čerpadlo bylo importováno bez křivky, takže nepřidává žádnou tlakovou výšku.';
$ec_lang['lpn_inp_drop_pump_other']='Toto čerpadlo je popsáno odebíraným příkonem, nikoli křivkou. Bylo importováno bez křivky, takže nepřidává žádnou tlakovou výšku.';
$ec_lang['lpn_inp_drop_head_pattern']='Tyto zdroje mají tlakovou výšku, která se v průběhu výpočtu mění. Jejich vzorce byly importovány celé a zobrazená hladina vody je hodnota v čase uvedeném na hodinách.';
$ec_lang['lpn_inp_drop_pump_speed']='Tato čerpadla běží jinou rychlostí, než při jaké byla změřena jejich křivka, nebo v průběhu výpočtu mění rychlost. Rychlost a její vzorec byly importovány celé a zobrazená tlaková výška je hodnota v čase uvedeném na hodinách.';
$ec_lang['lpn_inp_drop_setting']='Tato potrubí, čerpadla a ventily mají nastavení, které tato stránka neumí uchovat. Byly importovány jako otevřené.';
$ec_lang['lpn_inp_drop_rules']='Tento soubor obsahuje řízení založená na pravidlech. Tato stránka je čte a používá. Při výpočtu modelu se pravidla uplatní, přičemž každá hladina, tlak a průtok v nich se převede do jednotek, které tento projekt zobrazuje. Pravidlo zobrazíte nebo upravíte otevřením Pravidla v Knihovny. Pravidla jsou zachována přesně tak, jak jsou uvedena v souboru, a při uložení souboru EPANET se zapíší zpět.';
$ec_lang['lpn_inp_drop_eps']='Tento soubor popisuje simulaci s časovým průběhem. Modul simulace s časovým průběhem této stránky se nenačetl, proto byly importovány pouze počáteční podmínky.';
$ec_lang['lpn_inp_drop_quality']='Tento soubor popisuje kvalitu vody: počáteční koncentrace a rychlosti reakcí v potrubích a nádržích. Tato stránka tyto hodnoty čte a používá. Zvolte chemickou látku v Nastavení, Výpočet, Kvalita a poté spusťte model, aby se vypočetly koncentrace v celé síti v průběhu výpočtu. Řádky jsou zachovány a při uložení souboru EPANET se zapíší zpět.';
$ec_lang['lpn_inp_drop_sources_mixing']='Tento soubor uvádí, kde se do sítě dávkuje chemická látka a jak se voda mísí v každé nádrži. Každé dávkování se zobrazí u uzlu, kde je uplatněn, a každá nádrž ukazuje svůj model míšení. Oba se použijí, když se síť počítá po celkovou dobu běhu.';
$ec_lang['lpn_inp_drop_energy']='Tento soubor EPANET obsahuje údaje pro modelování nákladů na čerpání. Tato stránka je čte a používá. Spusťte model pomocí řešiče EPANET a pak otevřete Voda, Sestavy, Energie čerpadel, kde uvidíte, jak dlouho každé čerpadlo běželo, jaký příkon mělo, kolik energie spotřebovalo a kolik to stálo. Řádky jsou zachovány a při uložení souboru EPANET se zapíší zpět.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Tento soubor přiřazuje značky některým uzlům, potrubím nebo jiným prvkům. Každá značka byla importována a zobrazuje se ve vlastnostech svého prvku, kde ji lze zobrazit nebo upravit.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Tento soubor obsahuje nastavení formátu sestavy EPANET. Sestava výpočtu je k dispozici v Sestavy, Výpočet, ale používá standardní formát EPANET, nikoli formát, který tato nastavení určují. Řádky jsou zachovány a při uložení souboru EPANET se zapíší zpět.';
$ec_lang['lpn_inp_drop_sections']='Tento soubor obsahuje část, kterou tato stránka vůbec nečte. Nic se zde z ní nepoužívá. Je zachována celá a při uložení souboru EPANET se zapíše zpět.';
$ec_lang['lpn_inp_drop_comments']='Tyto řádky komentářů ve vzorcích nebo jednoduchých řízeních tohoto souboru nebyly importovány, protože tato stránka pro ně nemá místo (například mezi řádky jednoho vzorce). Každý vzorec a každé řízení bylo importováno celé.';
$ec_lang['lpn_inp_drop_quality_options']='Tento soubor uvádí možnosti kvality vody EPANET: možnost Quality, která určuje druh analýzy kvality vody, a dvě nastavení patřící k chemické látce, Relativní difuzivitu a Toleranci kvality. Všechny tři jsou zachovány a používány. Stáří vody, sledování zdroje a chemická látka se zde počítají a obě nastavení chemické látky se použijí při výpočtu chemické látky. Všechny se při uložení souboru EPANET zapíší zpět.';
$ec_lang['lpn_inp_drop_file_options']='Tento soubor odkazuje na pomocný soubor: Map, který obsahuje souřadnice, nebo Hydraulics, který obsahuje dříve vypočtenou hydrauliku. Tato stránka neumí otevřít ani jeden, proto jsou řádky zachovány tak, jak jsou, a při uložení souboru EPANET se zapíší zpět.';
$ec_lang['lpn_inp_drop_other_options']='Tento soubor uvádí možnosti, které tato stránka nečte. Nic se zde z nich nepoužívá. Jsou zachovány a při uložení souboru EPANET se zapíší zpět.';
$ec_lang['lpn_inp_drop_net_options']='Tento soubor EPANET .net uvádí nastavení, pro která tato stránka nemá žádný ovládací prvek, takže jejich hodnoty jsou uvedeny zde místo aby se převedly. Všechno ostatní se převedlo. Pokud je potřebujete, otevřete soubor v EPANET a pomocí File, Export, Network jej uložte jako soubor .inp, a poté ten naimportujte.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Tento soubor byl soubor EPANET .net, původní formát projektu EPANET. Formát nemá zveřejněnou specifikaci; tato stránka jej čte podle formátu odvozeného z ukázkových souborů, proto jej použijte pouze tehdy, není-li k dispozici soubor .inp. Soubor .inp je zdokumentovaný formát, který čtou jiné programy: v programu EPANET jej zapíšete příkazem File, Export, Network a kdykoli je to možné, importujte raději tento soubor.';
$ec_lang['lpn_inp_drop_backdrop']='Tento soubor odkazuje na podkladový obrázek, ale samotný obrázek neobsahuje. Přidejte jej sami pomocí Soubor, Podkladový obrázek, Přidat obrázek.';
$ec_lang['lpn_inp_drop_dangling']='Toto potrubí odkazuje na uzel, který v souboru není, proto bylo vynecháno.';
$ec_lang['lpn_inp_drop_units']='Jednotka průtoku uvedená v tomto souboru není žádná z jednotek, které tato stránka zná, proto bylo každé číslo načteno jako galony za minutu. Než výsledky použijete, zkontrolujte každou hodnotu.';
$ec_lang['lpn_inp_drop_anchor_missing']='Tento text byl připojen k uzlu, zdroji nebo nádrži, které v souboru nejsou. Byl importován jako volný text na místě uvedeném v souboru a není připojen k žádnému prvku.';
$ec_lang['lpn_import_notes_heading']='Tento projekt byl načten ze souboru EPANET. Část toho, co tento soubor obsahuje, je zachována, ale na této stránce se nepoužívá.';
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
$ec_lang['lpn_file_upload_explain']='Tento prohlížeč se neumí připojit k souboru, takže otevření souboru je zde nahrání: projekt se zkopíruje do tohoto prohlížeče a jediný způsob, jak uložit změny zpět do souboru, je přepsat jej příkazem Soubor, Uložit jako.';
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
$ec_lang['lpn_file_saveas_tip_download']='Ukládá pomocí nastavení stahování prohlížeče. Tento prohlížeč se neumí připojit k souboru, proto je Uložit zakázáno a dostupné je pouze Uložit jako. Je-li zapnuto nastavení prohlížeče „Zeptat se, kam uložit každý soubor“, lze původní soubor zvolit a přepsat.';
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
$ec_lang['lpn_close_browser_confirm']='{name} je uloženo pouze v tomto prohlížeči. Zavřete-li je bez uložení do souboru, bude trvale ztraceno.';
$ec_lang['lpn_close_discard']='Zavřít bez uložení';
$ec_lang['lpn_cancel']='Zrušit';
$ec_lang['lpn_revert_confirm']='Zahodit provedené změny a znovu načíst soubor {file} z disku?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Tento projekt pochází ze souboru {file}, ale spojení s tímto souborem bylo ztraceno. Vyberte soubor znovu, abyste se k němu připojili.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Do souboru se nepodařilo zapsat. Mohl být přesunut nebo přejmenován, nebo mohlo být odebráno oprávnění. Vaše práce je stále uložena v tomto prohlížeči.';
$ec_lang['lpn_file_changed_elsewhere']='Jiný uživatel uložil do tohoto souboru od chvíle, kdy jste jej otevřeli, takže by uložení nyní přepsalo jeho práci. Příkazem Soubor, Uložit jako uložte své změny do samostatného souboru, nebo příkazem Soubor, Vrátit k uloženému své změny zahoďte a načtěte uloženou verzi.';
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
$ec_lang['lpn_lock_somebody']='Někdo jiný';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} má tento soubor otevřený.';
$ec_lang['lpn_lock_open_readonly']='Otevřít jen pro čtení';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Převzít zámek';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Zdá se, že tento soubor se právě používá.';
$ec_lang['lpn_lock_open_care']='Abyste neztratili data, vyberte pečlivě z možností níže.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='Používá se po dobu {x}.';
$ec_lang['lpn_lock_age_edited']='Naposledy byl upraven před {x}.';
$ec_lang['lpn_lock_age_saved']='Naposledy byl uložen před {x}.';
$ec_lang['lpn_lock_age_never_saved']='Do tohoto souboru zatím nebylo nic uloženo.';
$ec_lang['lpn_lock_age_unknown']='Není záznam o tom, jak dlouho se používá, ani kdy byl naposledy uložen či upraven.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='„Zeptat se“ dá tomu, kdo má tento soubor otevřený, vědět, že byste jej chtěli, a nic jiného nezmění. „Otevřít jen pro čtení“ vám umožní jej prohlížet a cokoli v něm měnit, aniž byste mohli ukládat sem. „Převzít zámek souboru“ vám umožní uložit přes tento soubor; jejich neuložená práce se neztratí, ale už sem nebudou moci uložit, a někdo možná bude muset obě verze sloučit ručně.';
$ec_lang['lpn_lock_ask']='Zeptat se';
// Asked at the one moment the name is useful. Nothing is written to this computer for it; the lock
// broker keeps it in that file's lock record for the holder to read (Tom, 2026-09-29, correcting a
// prompt that said "stored only in this browser").
$ec_lang['lpn_lock_ask_prompt']='Koho máme uvést jako žadatele? Zadejte například své iniciály. Ukládají se spolu se zámkem tohoto souboru na našem serveru, pro toho, kdo jej má otevřený, a do 30 dnů se smažou.';
$ec_lang['lpn_lock_ask_sent']='Požádali jsme toho, kdo má tento soubor otevřený, aby jej zavřel. Uvidí to do minuty, pokud má stránku stále otevřenou. Nic jiného se nezměnilo a soubor je stále jeho, dokud jej nezavře.';
$ec_lang['lpn_lock_ask_failed']='Vaši zprávu se nepodařilo doručit. Buď tento soubor nemá nikdo otevřený, nebo se nepodařilo spojit se serverem.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Tento soubor nebyl otevřen a nic se zde nezměnilo. Někdo jiný jej stále má otevřený.';
// Task 747: a file copied outside this page keeps its original's document ID, and so its lock. Asked
// whenever this browser cannot guarantee it already knows the file (Tom, 2026-09-30). {date} is when
// the ID was minted, in the visitor's own regional date-time format.
$ec_lang['lpn_copy_title']='Označit soubor jako novou kopii?';
$ec_lang['lpn_copy_body']='Tento soubor uvádí, že vznikl {date}, a tento prohlížeč ho nepoznává. Je to originál (ponechat stejný zámek), nebo kopie (vytvořit nový zámek)?';
$ec_lang['lpn_copy_body_nodate']='Tento prohlížeč tento soubor nepoznává. Je to originál (ponechat stejný zámek), nebo kopie (vytvořit nový zámek)?';
$ec_lang['lpn_copy_original']='Originál; ponechat stejný zámek';
$ec_lang['lpn_copy_copy']='Kopie; vytvořit nový zámek';
// What "Original" does when the file's id is already open in a tab here with a different file:
// switch to the tab, without changing the tab's file.
$ec_lang['lpn_copy_kept_link']='Soubor {name} byl otevřen jako originál, přesunutý na nové místo. Uložení nyní zapisuje do tohoto souboru.';
// Tom, 2026-10-05: the copy is saved the moment it is chosen, so nobody has to remember to.
$ec_lang['lpn_copy_opened']='Soubor {file} byl otevřen jako kopie a uložen s novým zámkem.';
// Said only when that save did not happen (permission refused, file gone); the tab stays unsaved.
$ec_lang['lpn_copy_opened_unsaved']='Soubor {file} byl otevřen jako kopie s novým zámkem, který se uloží při příštím uložení souboru.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} by chtěl(a) tento soubor upravovat. Až budete připraveni, uložte svou práci a použijte Soubor, Zavřít, abyste jej předali dál.';
$ec_lang['lpn_ago_seconds']='{n} sekundami';
$ec_lang['lpn_ago_minutes']='{n} minutami';
$ec_lang['lpn_ago_hours']='{n} hodinami';
$ec_lang['lpn_ago_days']='{n} dny';
$ec_lang['lpn_ago_unknown']='neznámou dobou';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Zprávy';
$ec_lang['lpn_msglog_heading']='Poslední zprávy';
$ec_lang['lpn_msglog_empty']='Zatím žádné zprávy.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='před {x}';
$ec_lang['lpn_msglog_note']='Nejnovější první. Tato stránka uchovává posledních {n} zpráv, dokud je otevřená, a neukládá je do počítače.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Jen pro čtení: {name} má tento soubor otevřený. Cokoli zde lze změnit, ale nelze to uložit. Použijte Soubor, Uložit jako a uložte do jiného souboru.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Pozor: nepodařilo se spojit se serverem a zkontrolovat nebo vytvořit zámek tohoto projektu, takže jiný uživatel může upravovat stejný soubor současně. Pokud se zamykání obnoví, zobrazí se zpráva.';
$ec_lang['lpn_lock_storage_error']='Pozor: tento web nemůže ukládat záznamy o zámcích, takže jiný uživatel může upravovat stejný soubor současně. Jde o chybu konfigurace serveru, kterou nelze z této stránky opravit: do složky pro zámky nemůže webový server zapisovat.';
$ec_lang['lpn_lock_full_error']='Pozor: tomuto webu došlo místo pro záznamy o zámcích, takže jiný uživatel může upravovat stejný soubor současně. Jde o chybu konfigurace serveru, kterou nelze z této stránky opravit.';
$ec_lang['lpn_lock_not_asked']='Zamykání pro tento projekt není aktivní, takže jiný uživatel může upravovat stejný soubor současně. Tento projekt zatím nemá identifikátor; uložení do souboru jej přidělí.';
$ec_lang['lpn_lock_restored']='Zamykání je obnoveno a tento soubor lze nyní uložit.';
$ec_lang['lpn_lock_dismiss']='Skrýt tuto zprávu';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Projekt se uloží do souboru v tomto počítači. Ukládá se pouze tehdy, když jej uložíte, a nikdy jindy.';
$ec_lang['lpn_file_training_2']='Aby nikdy dva lidé neupravovali jeden soubor současně, tento web eviduje, kdo jej má otevřený. Pokud jej již někdo otevřený má, lze jej přesto otevřít k prohlížení nebo zkopírovat a ponechat si kopii.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='Při prvním uložení prohlížeč vyžádá povolení, aby tento web mohl soubor upravovat. Žádost pochází od prohlížeče, nikoli od tohoto webu, a povolení je nutné k tomu, aby Uložit mohlo do souboru zapisovat. Obvykle se vyžaduje pouze jednou pro každý soubor.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
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
$ec_lang['lpn_storage_unreadable']='Neuloženo. Tento projekt se nepodařilo načíst z úložiště prohlížeče. Jeho uložená kopie zůstává přesně taková, jaká je, a nebude přepsána, takže na této kartě se nic neukládá. Otevřete soubor nebo vytvořte nový projekt, abyste mohli pokračovat v práci.';
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
$ec_lang['lpn_about_credits']='Poděkování';
$ec_lang['lpn_help_welcome']='Uvítací stránka';
$ec_lang['lpn_about_license']='Licencováno pod GNU General Public License v3.0 nebo novější.';
$ec_lang['lpn_notes_1_term']='Jak se to řeší';
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
$ec_lang['lpn_notes_1_def']='Ve výchozím stavu síť řeší řešič EPANET. Je-li nastavena celková doba běhu, každý vykazovaný časový krok se vypočte postupně: nádrže se plní a vyprazdňují, odběry sledují své vzorce a panel nástrojů výpočet přehrává. Při zaškrtnutém Používat vestavěný řešič, kde je to možné lze řešení v jednom okamžiku místo toho vyřešit vestavěným řešičem, ale dlouhodobou simulaci nebo síť s ventilem rušícím tlak nebo obecným ventilem (PBV, GPV) vždy řeší řešič EPANET.';
$ec_lang['lpn_notes_2_term']='Co se nedělá';
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
$ec_lang['lpn_notes_2_def']='Ráz a vodní kladivo se nemodelují: všechny výsledky platí pro ustálené nebo pomalu se měnící proudění, nikoli pro tlakovou vlnu při prudkém uzavření ventilu.';
$ec_lang['lpn_notes_3_term']='Ukládání projektů';
$ec_lang['lpn_notes_3_def']='Každý projekt je karta a každá karta se během práce ukládá do tohoto prohlížeče. Vymazání dat prohlížeče je všechny smaže, proto patří práce do souboru: Soubor, Uložit jako. Hvězdička na kartě znamená, že obsahuje změny, které nejsou v souboru, a zavření této karty se nejprve zeptá. Do souboru se nikdy nic nezapíše, pokud není zvoleno Uložit nebo Uložit jako. V některých prohlížečích se projekt připojí k souboru, do kterého je uložen, a Soubor, Uložit od té chvíle zapisuje zpět do stejného souboru; v jiných spojení možné není, proto je Uložit zakázáno a dostupné je pouze Uložit jako. Tento server sleduje, kdo má soubor projektu otevřený, aby si dva lidé navzájem nepřepsali práci. Otevření souboru, který už má otevřený kolega, nabídne Zeptat se, Otevřít jen pro čtení a Převzít zámek. Nelze-li se k serveru připojit, varování uvede, že jiný uživatel může upravovat stejný soubor současně.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Křivka čerpadla';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Čerpadlo se řídí vztahem H = H₀ − aQ^b, kde H je tlaková výška, kterou čerpadlo přidává, a Q je průtok, který jím prochází. Body křivky se zadávají ve Voda, Knihovny jako křivka Tlaková výška čerpadla a čerpadlo tuto křivku uvádí ve Vlastnostech. Tři body – tlaková výška při nulovém průtoku, normální pracovní bod a bod nejvyššího průtoku – proloží H₀, a i b přímo a nejvěrněji sledují publikovanou křivku. Dva body proloží parabolu (b = 2) s vrcholem při nulovém průtoku. Jeden bod používá pravidlo EPANET: tlaková výška při nulovém průtoku je 1,33334násobek zadané tlakové výšky a nejvyšší průtok je 2násobek zadaného průtoku, což opět dává b = 2. Čerpadlo bez zadané křivky nepřidává žádnou tlakovou výšku. Křivka není oříznuta v místě, kde tlaková výška dosáhne nuly, takže průtok vyšší, než jaký křivka dokáže dodat, dá zápornou tlakovou výšku. Řešením je větší čerpadlo nebo menší odběr, ne jiné proložení křivky. Křivka může obsahovat i více než tři body. Řešič EPANET dostane všechny a mezi nimi interpoluje, zatímco řádek Rovnice a vestavěný řešič používají nejnižší, prostřední a nejvyšší bod.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='Nápověda ke sloupcům tabulky';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE -- the Hide/Show row beside it names the
// identical menu. **GESTURE FIRST, THEN ACTION, SINCE 2026-10-06** (Ida, User guide): the cells were
// swapped in all 27 files, by script and unchanged, so this table reads in the same order as the
// key-then-action tables beside it (lpn_notes_7_def, lpn_hotkeys_map_def).
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Klikněte na záhlaví</td><td>Vybrat sloupec</td></tr><tr><td>Ctrl+klik nebo Shift+klik na jiné záhlaví</td><td>Přidat do výběru sloupců nebo jej rozšířit</td></tr><tr><td>Přetáhněte, nebo v nabídce po kliknutí pravým tlačítkem či v nabídce ⋮ použijte Spravovat sloupce…</td><td>Přesunout (změnit pořadí) vybraných sloupců</td></tr><tr><td>Najeďte na horní roh záhlaví, nebo jej vyberte či na něj přejděte klávesou Tab</td><td>Nabídka ⋮ a šipka řazení.</td></tr><tr><td>Klikněte pravým tlačítkem na záhlaví, nebo použijte nabídku ⋮ v pravém horním rohu záhlaví</td><td>Skrýt, Zobrazit vše nebo Spravovat viditelnost a pořadí</td></tr><tr><td>Ikona šipky v pravém horním rohu záhlaví</td><td>Seřadit podle sloupce</td></tr><tr><td>Klikněte pravým tlačítkem, použijte nabídku ⋮ v pravém horním rohu záhlaví, nebo Ctrl+Shift+V</td><td>Vložit jako nové řádky na konec tabulky</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Klávesové zkratky tabulky';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Šipky</td><td>Pohyb po tabulce.</td></tr><tr><td>Tab, Enter</td><td>Dokončí zadání a přesune o jednu buňku vpravo (Tab) nebo dolů (Enter).</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Přesun o jednu buňku zpět (Shift+Tab) nebo nahoru (Shift+Enter).</td></tr><tr><td>Shift+šipky</td><td>Rozšíří výběr.</td></tr><tr><td>Ctrl+C</td><td>Zkopíruje výběr.</td></tr><tr><td>Ctrl+D</td><td>Vyplní výběr dolů z jeho horního řádku.</td></tr><tr><td>Ctrl+Enter</td><td>Vyplní výběr hodnotou aktivní buňky.</td></tr><tr><td>Ctrl+A</td><td>Vybere celou tabulku.</td></tr><tr><td>Ctrl+Shift+V</td><td>Vloží jako nové řádky na konec tabulky.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Přepne na další nebo předchozí kartu, ať už tabulku, nebo graf.</td></tr><tr><td>Delete</td><td>Vymaže aktivní buňku. Chcete-li vymazat vybranou oblast, klikněte pravým tlačítkem a zvolte Delete.</td></tr><tr><td>F2</td><td>Otevře buňku k úpravě.</td></tr><tr><td>Esc</td><td>Zruší úpravu.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Hranice barevných pásem zůstávají stejné';
$ec_lang['lpn_notes_color_def']='Hranice barevných pásem se nastaví, když se zvolí metoda třídění dat. Znovu se nenastavují při každém časovém kroku, protože by pak barvy při každém kroku znamenaly něco jiného, což pro sledování soustavy není užitečné. Scénář ukazuje hranice Základního. EPANET funguje stejně. Chcete-li nové hranice, zvolte metodu znovu nebo zadejte hranice.';
$ec_lang['lpn_notes_engine_term']='Který EPANET tato stránka používá';
$ec_lang['lpn_notes_engine_def']='Řešič EPANET na této stránce je OWA-EPANET 2.3.5, vydaný 20. února 2025. EPANET vyvíjí Open Water Analytics, komunita spolupracující s Agenturou pro ochranu životního prostředí USA (EPA), která v prosinci 2019 vydala verzi 2.2.0. Zpráva o výpočtu jej označuje jako 2.3.05, protože nástroj zapisuje poslední číslo na dvě číslice. Na tuto stránku se dostává přes epanet-js 0.9.0 od Lukea Butlera, pod licencí MIT, a běží ve vašem prohlížeči: vaše síť se nikdy nikam neposílá k výpočtu.';
// The Notes example (Task 785). Held by dev/lpn-spike/user-guide-notes-harness.js.
$ec_lang['lpn_guide_nt_example_term']='Příklad na Net1: čerpadlo za koncem křivky';
$ec_lang['lpn_guide_nt_example_def']='Otevřete příklad Net1 a zvolte Voda, Knihovny. Křivka 1, Pump Curve for Pump 9, má jeden bod, 1500 gpm při 250 ft. Tlaková výška při nulovém průtoku je 333,3 ft a nejvyšší průtok je 3000 gpm. Při 3500 gpm, což je za koncem křivky, dává křivka tlakovou výšku −120,4 ft. Řešič EPANET uvádí tutéž tlakovou výšku, ztrátu 120,4 ft na čerpadle, a varuje, že čerpadla nemohou dodat dostatečný průtok nebo tlakovou výšku.';
// The user manual's own entry (Task 785). Held by dev/lpn-spike/user-guide-own-harness.js.
$ec_lang['lpn_guide_own_example_term']='Příklad na Net1';
$ec_lang['lpn_guide_own_example_def']='<p>Otevřete příklad Net1, stiskněte Ctrl+K a napište kritičnost. Nabídky ukazují řádek Kritičnost: analýza… pod Voda, Analýza. Okna ukazují položky, které ji zmiňují, mezi nimi Najít a nahradit, Požární průtok: analýza a Kritičnost: analýza, a tuto položku. Zvolením řádku se zobrazí, kde je Kritičnost: analýza… v nabídce Analýza, a nespustí se.</p>';
$ec_lang['lpn_id_invalid']='Zadejte ID bez mezer a bez uvozovek.';
$ec_lang['lpn_id_taken']='Toto ID se už používá.';
$ec_lang['lpn_diag_no_fixed_head']='Přidejte zdroj nebo nádrž. Síť potřebuje alespoň jednu známou hladinu vody, než ji lze vyřešit.';
$ec_lang['lpn_diag_dangling_link']='Potrubí nebo čerpadlo se připojuje k uzlu, který již neexistuje:';
$ec_lang['lpn_diag_unreachable']='Tyto uzly nemají cestu ke zdroji ani k nádrži:';
// Tom, 2026-10-09: a node nothing connects to a source is left out of the run, not refused. The
// ids stand in the status bar until the network changes. Said in EPANET's own terms (junction,
// reservoir, tank) and never as an error, because the run happened.
$ec_lang['lpn_omitted_note']='Z tohoto výpočtu vynecháno, protože z nich nevede žádná cesta ke zdroji ani k nádrži: {ids}';
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
$ec_lang['lpn_engine_fetching']='Stahuje se řešič EPANET. Stáhne se jednou a poté se uloží v tomto zařízení, takže poté funguje offline.';
$ec_lang['lpn_engine_ready']='Řešič EPANET je nyní v tomto zařízení a funguje offline.';
$ec_lang['lpn_engine_unavailable']='Řešič EPANET, který je nutný k řešení ventilů rušících tlak a obecných ventilů (PBV, GPV), se nepodařilo stáhnout. Po jednom připojení k internetu se řešič uloží v tomto zařízení.';
// The cause-specific sibling: {reason} is lpn_time_engine_fetch_failed (only a download can reach this notice).
// Offline keeps the sentence above. {wrong} in lpn_time_engine_run_failed is filled with lpn_wrong_btn.
$ec_lang['lpn_engine_unavailable_why']='Ventily rušící tlak a obecné ventily (PBV, GPV) nelze řešit bez řešiče EPANET. {reason}';
$ec_lang['lpn_engine_needed_loading']='Řešič EPANET se načítá, zatímco síť vytváříte. Výsledky budou k dispozici po úplném načtení.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Průběh načítání řešiče';
$ec_lang['lpn_engine_wait']='Načítá se řešič. Výsledky budou chvíli zpožděné. Pokračujte v práci.';
$ec_lang['lpn_engine_wait_pct']='Řešič načten z {percent} %.';
$ec_lang['lpn_engine_wait_bytes']='Řešič doposud načten {kb} KB. Celková velikost není známa, proto nelze určit procento dokončení.';
$ec_lang['lpn_engine_needed_failed']='Řešič EPANET zatím nebyl načten, nelze jej načíst a tuto síť lze řešit pouze jím. Načte se, jakmile budete připojeni k internetu.';
$ec_lang['lpn_engine_needed_failed_why']='Tuto síť lze řešit pouze řešičem EPANET. {reason}';
$ec_lang['lpn_diag_valve_on_fixed_head']='Tyto ventily jsou připojeny přímo ke zdroji nebo nádrži, které v tomto uzlu určují hydraulickou výšku, takže ventil nemá co regulovat. Vložte mezi ventil a zdroj nebo nádrž krátké potrubí:';
$ec_lang['lpn_diag_not_converged']='Nebylo nalezeno žádné řešení. Zkontrolujte, zda nejsou zadány fyzikálně nemožné hodnoty, například nulový průměr.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Výpočet nedosáhl konvergence. Tato čísla jsou z poslední iterace, nejsou to výsledky. Nepoužívejte je.';
$ec_lang['lpn_diag_not_converged_trials']='Zastavil se po {iterations} iteracích.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Zastavil se po {iterations} iteracích s relativní chybou {error}, která nedosáhla nastavené Přesnosti {accuracy}.';
$ec_lang['lpn_field_roughness']='Drsnost';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Součinitel C podle Hazen-Williams. Vyšší číslo znamená hladší potrubí: přibližně 150 pro nový plast, 130 pro novou ocel nebo litinu a 100 pro staré potrubí.';
$ec_lang['lpn_field_length']='Délka';
// Task 643 (Tom, 2026-10-14): an Auto length is the slope distance. No claim about accuracy (Task 641).
$ec_lang['lpn_field_length_slope_tip']='Délka potrubí. Je-li zaškrtnuto Auto, délka se měří podél sklonu: nakreslená délka spojená s rozdílem nadmořských výšek mezi oběma koncovými uzly.';
$ec_lang['lpn_field_from']='Od';
$ec_lang['lpn_field_to']='Do';
// Tom, 2026-10-09: From and To are editable text. Said in the box a refused ID is said in.
$ec_lang['lpn_link_end_unknown']='Žádný uzel nemá ID {id}.';
$ec_lang['lpn_link_end_same']='Počáteční a koncový uzel musí být různé.';
// Tom, 2026-10-09: "Break link for node?", adapted to name the pipe. The two answers are Yes and No
// because No is not a cancel: it places the node where it was pressed, joined to nothing.
$ec_lang['lpn_split_pipe_ask']='Rozdělit potrubí {id} v tomto uzlu?';
$ec_lang['lpn_split_yes']='Ano';
$ec_lang['lpn_split_no']='Ne';
// Object snap (Task 782). The tip beside the snap glyph on a pipe vertex: "Pipe 10, vertex 2". A node
// or a pipe is named by its type word and ID alone.
$ec_lang['lpn_snap_vertex']='{link}, vrchol {n}';
// A tank, reservoir or junction snapped onto a node of another type is placed at exactly that
// position. Two nodes at one point are legal in EPANET, and the map cannot show that they are separate.
$ec_lang['lpn_snap_node_on_node']='{new} umístěn do polohy {target}. Oba uzly nejsou propojeny.';
// The same, for a node DRAGGED onto another node.
$ec_lang['lpn_snap_moved_on_node']='{moved} přesunut do polohy {target}. Oba uzly nejsou propojeny.';
// The Shape (Task 779): map annotation, a point, a polyline or a polygon. Tom, 2026-10-06: "Either
// way, we call it a 'Shape'". The tip beside the snap glyph on a Shape point: "Shape S1, point 2".
$ec_lang['lpn_snap_shape_point']='{shape}, bod {n}';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Typ ventilu';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Typ ventilu. Škrticí ventil (TCV) uplatňuje pevnou ztrátu. PRV, PSV a FCV udržují tlak nebo průtok a podle změn hydraulických podmínek se plně otevírají, zavírají nebo částečně přivírají. PBV odebírá pevný tlak a GPV sleduje křivku ztráty tlakové výšky. Typy řídí různé hydraulické veličiny, proto se při změně typu mohou nastavení ztratit.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Škrticí (TCV)';
$ec_lang['lpn_valve_type_prv']='Redukční (PRV)';
$ec_lang['lpn_valve_type_psv']='Udržovací (PSV)';
$ec_lang['lpn_valve_type_fcv']='Regulace průtoku (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Ventil rušící tlak (PBV)';
$ec_lang['lpn_valve_type_gpv']='Obecný ventil (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Úbytek tlaku';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='Tlak, který ventil odebírá. Ventil rušící tlak vždy odebere přesně tuto hodnotu tlaku, ať voda proudí kterýmkoli směrem. Jde o úbytek na ventilu, ne o tlak, který by se měl udržovat.';
$ec_lang['lpn_inp_drop_gpv_curve']='Tento ventil odkazuje na křivku ztráty tlakové výšky, která v souboru není. Ventil byl importován bez křivky, takže zůstává plně otevřený, dokud není křivka zvolena.';
$ec_lang['lpn_gpv_curve_source']='Křivka ztráty tlakové výšky ventilu';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Křivka v okně Knihovny, která udává ztrátu tlakové výšky tímto ventilem při jednotlivých průtocích. Stejnou křivku může používat více ventilů a její úprava tam změní všechny.';
$ec_lang['lpn_field_valve_setting_pressure']='Nastavený tlak';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Redukční ventil udržuje tlak na své výstupní straně na této hodnotě nebo pod ní. Udržovací ventil udržuje tlak na své vstupní straně na této hodnotě nebo nad ní.';
$ec_lang['lpn_field_valve_setting_flow']='Nastavený průtok';
$ec_lang['lpn_field_valve_setting_flow_tip']='Maximální průtok ventilem. Je-li průtok menší než tato hodnota, je ventil plně otevřený a nepřidává žádnou ztrátu.';
$ec_lang['lpn_field_valve_setting']='Nastavení';
$ec_lang['lpn_field_valve_setting_loss']='Součinitel ztráty';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Tlaková výška odebraná škrticím ventilem, jako násobek rychlostní výšky. Pro plně otevřený ventil zadejte 0. Tato jediná hodnota je celou ztrátou škrticího ventilu.';
$ec_lang['lpn_field_valve_diameter_tip']='Průměr otvoru ventilu. Z tohoto průměru se vypočte rychlost ventilem a z této rychlosti ztráta.';
$ec_lang['lpn_field_valve_km_tip']='Ztráta v tělese ventilu, když je ventil plně otevřený, navíc ke ztrátě vyplývající z nastavení ventilu. Vyjadřuje se jako násobek rychlostní výšky. Hodnotou 0 ji zanedbáte.';
$ec_lang['lpn_field_km']='Součinitel místní ztráty, k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Místní ztráta, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Křivka tlakové výšky čerpadla';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Křivka v okně Knihovny, která udává tlakovou výšku, kterou toto čerpadlo přidává při jednotlivých průtocích. Stejnou křivku může používat více čerpadel a její úprava tam změní všechna.';
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
$ec_lang['lpn_field_desc']='Popis';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Značka';
// Tom, 2026-09-06, in dev/new-english-keys.md, answering Wave 0's finding that a bare 'Tag'
// reads as markup or as a price tag in most languages: Add _syn 'Tag or user defined field
// possibly for grouping assets possibly in pressure zones'. His sentence is the commentary,
// verbatim and right of the pipe; the substitutable half is left of it, because the generator
// strips commentary by POSITION and a whole sentence on the left ships to 26 agents as a
// synonym list.
// Edited by TGH 2026-09-07
// ROADMAP Task 247. Tom's own words, given verbatim on 2026-09-19 when he shortened the label from
// "Services at this customer" to "Number of services": the short label loses the "at this customer"
// that told a translator WHOSE services are being counted, and this is where that goes back.
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Tag může mít jakýkoli význam, který potřebujete, například tlakové pásmo nebo číslo zakázky. Žádný výpočet zde ani v EPANET jej nečte. Tag je jedno slovo: EPANET přestane číst na první mezeře, takže mezera je při psaní odmítnuta. Přenáší se do souboru EPANET i z něj.';
$ec_lang['lpn_pump_effic_curve']='Křivka účinnosti čerpadla';
$ec_lang['lpn_pump_effic_curve_tip']='Křivka v okně Knihovny, která udává účinnost tohoto čerpadla při jednotlivých průtocích. Stejnou křivku může používat více čerpadel a její úprava tam změní všechna. Toto čerpadlo obsahuje pouze odkaz; samotné body se čtou a upravují v Knihovny, Křivky.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Není zvolena žádná křivka';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Křivky';
$ec_lang['lpn_curve_library_link_tip']='Otevře okno Knihovny v části Křivky, kde se křivka přidává, popisuje, upravuje a maže. Prvek uvádí, kterou křivku používá.';
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
$ec_lang['lpn_curve_kind_head']='Tlaková výška čerpadla';
$ec_lang['lpn_curve_kind_effic']='Účinnost čerpadla';
$ec_lang['lpn_curve_kind_volume']='Objem nádrže';
$ec_lang['lpn_curve_kind_headloss']='Ztráta tlakové výšky ventilu';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Druh neuveden';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Objem';
$ec_lang['lpn_pump_effic_col']='Účinnost';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Toto čerpadlo nemá zvolenou křivku účinnosti, takže běží s účinností nastavenou pro celou síť, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Toto čerpadlo odkazuje na křivku účinnosti nazvanou {name}, kterou nic v tomto projektu nedefinuje, takže běží s účinností nastavenou pro celou síť, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Režim: Výběr. Vyberte prvek, popisek nebo Text, abyste jej zobrazili nebo změnili. Přetažením přesunete uzel, popisek nebo Text. Nástrojem Vrcholy přidáte nebo odeberete zlomy potrubí.';
$ec_lang['lpn_mode_delete']='Režim: Smazat. Výběrem prvku jej odstraníte.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Režim: Vrcholy. Vrcholy každého potrubí jsou zobrazeny jako malé čtvercové úchytky. Zadáním bodu na potrubí přidáte vrchol, výběrem úchytky jej odeberete, nebo úchytku přetažením přesunete. V tomto režimu nelze na mapě měnit nic jiného.';
$ec_lang['lpn_mode_zoom_window']='Režim: Přiblížit okno. Zadejte na mapě dva protilehlé rohy obdélníku, nebo jej přetáhněte, a mapa se na něj přiblíží.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Není nic vybráno. Nejprve vyberte prvek na mapě a poté stiskněte Delete.';
$ec_lang['lpn_mode_add_junction']='Režim: Přidat uzel. Zadejte místo na mapě, kam se umístí uzel. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky, popisky a Text.';
$ec_lang['lpn_mode_add_reservoir']='Režim: Přidat zdroj. Zadejte místo na mapě, kam se umístí zdroj. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky, popisky a Text.';
$ec_lang['lpn_mode_add_tank']='Režim: Přidat nádrž. Zadejte místo na mapě, kam se umístí nádrž. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky, popisky a Text.';
$ec_lang['lpn_mode_add_pipe']='Režim: Přidat potrubí. Vyberte počáteční uzel a poté koncový uzel, abyste je propojili. Zadáním bodů na volném místě mezi nimi čáru zalomíte, nebo stiskněte Esc a začněte znovu. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky, popisky a Text.';
$ec_lang['lpn_mode_add_pump']='Režim: Přidat čerpadlo. Vyberte počáteční uzel a poté koncový uzel, abyste je propojili. Zadáním bodů na volném místě mezi nimi čáru zalomíte, nebo stiskněte Esc a začněte znovu. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky, popisky a Text.';
$ec_lang['lpn_mode_add_valve']='Režim: Přidat ventil. Vyberte počáteční uzel a poté koncový uzel, abyste je propojili. Zadáním bodů na volném místě mezi nimi čáru zalomíte, nebo stiskněte Esc a začněte znovu. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky, popisky a Text.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Režim: Přidat text. Zadejte místo na mapě, kam se umístí Text. Zadejte místo poblíž uzlu, aby se Text k tomuto uzlu připojil. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky, popisky a Text.';
$ec_lang['lpn_mode_add_chain']='Režim: Řetěz uzlů a potrubí. Zadejte bod na mapě, kde se přidá uzel, a poté zadejte každý další bod, kde se přidá potrubí a uzel. Zadáním existujícího uzlu z něj pokračujte. Řetěz ukončíte klávesou Esc. Přepněte do režimu Výběr, chcete-li měnit nebo přesouvat prvky, popisky a Text.';
$ec_lang['lpn_mode_add_shape']='Režim: Přidat útvar. Zadejte každý bod. Dokončíte zadáním posledního bodu znovu nebo stisknutím klávesy Enter; zadáním prvního bodu uzavřete mnohoúhelník.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Tento režim použijte ke změně, přesunu a přetahování prvků a textu na mapě nebo k posouvání mapy. Je to výchozí režim mapy. Druhým stisknutím klávesy Esc se výběr zruší.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Automaticky';
$ec_lang['lpn_method_switch_confirm']='Změna metody tření nemění čísla drsnosti již zadaná u potrubí a drsnost pro jednu metodu je pro jinou bezvýznamná. Poté zkontrolujte každé potrubí. Přesto změnit?';
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
$ec_lang['lpn_field_closed']='Uzavřeno';
$ec_lang['lpn_field_closed_tip']='Uzavře toto potrubí, aby jím neprotékala žádná voda. Potrubí zůstane na mapě, ponechá si všechny své hodnoty a lze je kdykoli znovu otevřít.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Zeměpisná délka';
$ec_lang['lpn_field_lat']='Zeměpisná šířka';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Severní souřadnice';
$ec_lang['lpn_field_easting']='Východní souřadnice';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='N';
$ec_lang['lpn_field_easting_abbr']='E';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Š';
$ec_lang['lpn_field_lon_abbr']='D';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Zadáním souřadnic umístíte tento uzel přesně. Ve scénáři platí toto umístění pouze v daném scénáři, stejně jako přetažení; v Základním umístí uzel ve všech scénářích.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='To je mimo mapu. Zeměpisná šířka Pseudo Mercator se pohybuje od -85,05 do 85,05 a zeměpisná délka od -180 do 180.';
$ec_lang['lpn_field_text_size']='Násobitel velikosti';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Zobrazovat při všech úrovních přiblížení';
$ec_lang['lpn_field_text_all_zoom_tip']='Ponechá tento text na výkresu bez ohledu na to, jak moc oddálíte. Zrušením zaškrtnutí se text skryje spolu s ostatními popisky, jakmile je pohled širší než práh zobrazování popisků nastavený v Mapa a stránka.';
$ec_lang['lpn_tool_labels']='Popisky';
$ec_lang['lpn_labels_heading_node']='Popisky uzlů';
$ec_lang['lpn_labels_heading_link']='Popisky spojů';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Použít na vše';
$ec_lang['lpn_settings_apply_to_all_tip']='Každý již nakreslený prvek tohoto druhu dostane ID začínající tímto textem. Každý si ponechá své číslo. ID, které nekončí číslem, se nemění.';
$ec_lang['lpn_confirm_apply_prefix']='Přejmenovat prvky ({n}), aby jejich ID začínala textem {prefix}? Každý si ponechá své číslo.';
$ec_lang['lpn_prefix_applied']='Přejmenované prvky: {n}. Prvky beze změny: {skipped}.';
$ec_lang['lpn_labels_suffix_gradient_tip']='Text přidaný za gradient ztráty tlakové výšky na popiscích mapy. Nezadávejte sem znak procenta. Přidá se automaticky, jsou-li jednotky procenta.';
$ec_lang['lpn_labels_separator']='Text mezi hodnotami';
$ec_lang['lpn_labels_separator_tip']='Text mezi jednou vlastností a další na popisku. Ve výchozím nastavení mezera.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Priorita';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='Pořadí, v němž se hodnoty vypouštějí, když se popisek nevejde. Hodnota s číslem 1 se vypouští jako první. Zbývá-li jen jedna hodnota a dva popisky se stále překrývají, jeden z nich se skryje: ten s nižším odběrem, s tlakem blíže středu rozsahu nebo s nadmořskou výškou či tlakovou výškou číselně bližší hodnotám sousedních uzlů.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Před';
$ec_lang['lpn_labels_col_after']='Za';
$ec_lang['lpn_labels_col_decimals']='Desetinná místa';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Zobrazit';
$ec_lang['lpn_labels_show_tip']='Pořadí, ve kterém se hodnoty zobrazují na popisku. Hodnota s číslem 1 je první: nahoře na svisle uspořádaném popisku a na začátku popisku na jednom řádku.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Použít jednotky';
$ec_lang['lpn_labels_use_units_tip']='Zaškrtnutím se jednotka zobrazí v poli Za i na popisku a při změně jednotek se aktualizuje. Zrušením zaškrtnutí zadáte vlastní text pole Za.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Počáteční stav';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Barvy uzlů';
$ec_lang['lpn_settings_sym_link_colors']='Barvy spojů';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Podkladový obrázek…';
$ec_lang['lpn_backdrop_add']='Přidat';
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
$ec_lang['lpn_backdrop_scale']='Nastavit měřítko';
$ec_lang['lpn_backdrop_scale_entry']='Měřítko podle world file nebo podle velikosti jednoho pixelu na mapě';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Změnit měřítko z aktuální velikosti, kolem bodu, který zvolíte';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Zadejte bod na podkladovém obrázku, který má zůstat na svém místě.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Změna měřítka z aktuální velikosti. 1 ponechá stejnou velikost, 1,1 ji zvětší o 10 %, 0,9 ji zmenší o 10 %.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Zadejte velikost jednoho pixelu na mapě, nebo vložte celý obsah world file pro tento obrázek';
$ec_lang['lpn_backdrop_scale_entry_bad']='Zadejte jedno číslo pro velikost jednoho pixelu na mapě, nebo vložte všech šest řádků světového souboru.';
$ec_lang['lpn_backdrop_wld_bad']='Tento world file otáčí, zrcadlí nebo nerovnoměrně roztahuje obrázek. Mapa může obrázek pouze přesunout a zvětšit či zmenšit stejně v obou směrech, proto nebyl soubor použit.';
$ec_lang['lpn_backdrop_unreadable']='Tento obrázek nelze ve vašem prohlížeči zobrazit. Uložte jej jako PNG nebo JPEG a přidejte znovu.';
$ec_lang['lpn_backdrop_position']='Přesunout';
$ec_lang['lpn_backdrop_remove']='Odebrat';
$ec_lang['lpn_backdrop_remove_confirm']='Odebrat podkladový obrázek?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Mapa světa…';
$ec_lang['lpn_map_attach_tip']='Připojí mapu světa k tomuto projektu, aniž by jej jinak jakkoli změnil.';
$ec_lang['lpn_map_attach_add']='Připojit';
$ec_lang['lpn_map_attach_readjust']='Upravit znovu';
$ec_lang['lpn_map_attach_readjust_tip']='Návrat ke kroku 2 procesu připojení mapy.';
$ec_lang['lpn_map_attach_scale_from']='Zvětšit nebo zmenšit z aktuální velikosti…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Zvětší nebo zmenší mapu z její aktuální velikosti kolem středu vašeho výkresu. 1 ji ponechá stejnou, 1,1 ji zvětší o 10 %, 0,9 ji zmenší o 10 %.';
$ec_lang['lpn_map_attach_scale_from_bad']='Zadejte jedno číslo větší než nula.';
$ec_lang['lpn_map_attach_scale_from_done']='Mapa má nyní novou velikost a váš výkres i každá souřadnice v něm zůstávají přesně tak, jak byly.';
$ec_lang['lpn_map_attach_none']='K tomuto projektu zatím není připojena žádná mapa světa. Nejprve použijte Mapa, Mapa světa, Připojit.';
$ec_lang['lpn_map_attach_remove']='Odpojit';
$ec_lang['lpn_map_attach_remove_tip']='Odpojí mapu světa. Síť to neovlivní.';
$ec_lang['lpn_map_attach_done']='Mapa světa je nyní zobrazena za výkresem a projekt se nemění. Odebrat ji lze příkazem Mapa, Mapa světa, Odpojit.';
// Edited by TGH 2026-10-07
$ec_lang['lpn_map_attach_removed']='Mapa světa je odpojena a síť není dotčena.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Výkres je na mapě celého světa, v oceánu na nulové zeměpisné šířce a nulové zeměpisné délce. Nejprve najděte místo projektu: posuňte a přibližte mapu za výkresem, vyhledejte název místa, nebo zadejte zeměpisnou šířku a délku. Samotný výkres se nepřesouvá.';
$ec_lang['lpn_mapgeo_step1']='Krok 1 ze 2: najděte místo projektu';
$ec_lang['lpn_mapgeo_step2']='Krok 2 ze 2: přizpůsobte mapu za vaším výkresem';
$ec_lang['lpn_mapgeo_hint1']='Posuňte a přibližte mapu za výkresem, nebo vyhledejte místo, nebo zadejte zeměpisnou šířku a délku. Poté stiskněte Umístit přibližně.';
$ec_lang['lpn_mapgeo_readjust_intro']='Výkres je tam, kam jste jej naposledy umístili. Chcete-li jej přesunout jinam, posuňte a přibližte mapu za výkresem, vyhledejte název místa, nebo zadejte zeměpisnou šířku a délku. Samotný výkres se nepřesouvá.';
$ec_lang['lpn_mapgeo_hint2']='Přetažením kdekoli posunete mapu pod svým výkresem. Váš výkres i každá souřadnice v něm zůstávají přesně tam, kde jsou. Stiskněte Georeferencovat zde, jakmile bude mapa na správném místě.';
$ec_lang['lpn_mapgeo_gestures']='Přiblížení posouvá výkres i mapu společně, aby se ukázalo, jak dobře na sebe navazují. Přetažení posouvá pouze mapu.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Otočit mapu';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} stupňů';
$ec_lang['lpn_mapgeo_dial_size']='Velikost mapy';
$ec_lang['lpn_mapgeo_dial_size_read']='{f}×';
$ec_lang['lpn_mapgeo_dial_help']='Posunutím obou posuvníků, nebo zadáním čísel do polí nad nimi, mapu zvětšíte či zmenšíte a otočíte. Střed každého posuvníku zachovává výsledek kroku 1, takže velikost 1 a otočení 0 znamenají žádnou změnu. U obou fungují šipky.';
$ec_lang['lpn_mapgeo_place']='Umístit přibližně';
$ec_lang['lpn_mapgeo_finish']='Georeferencovat zde';
$ec_lang['lpn_mapgeo_cancelled']='Mapa světa je obnovena do předchozí polohy a výkres se nepřesunul.';
$ec_lang['lpn_mapgeo_locked']='Dokončete tlačítkem Georeferencovat zde, nebo stiskněte Zrušit, než přepnete projekt nebo uložíte. Mapa světa se stále umísťuje.';
$ec_lang['lpn_backdrop_scale_prompt1']='Zadejte dva body na podkladovém obrázku, například oba konce měřítkové úsečky. Poté zadejte skutečnou vzdálenost mezi nimi.';
$ec_lang['lpn_backdrop_scale_prompt2']='Skutečná vzdálenost mezi oběma body';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Zadejte výchozí bod (na obrázku) pro přesun.';
$ec_lang['lpn_backdrop_position_prompt2']='Zvolte metodu pro cílový bod a poté stiskněte Pokračovat.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Upravuje se podkladový obrázek.';
$ec_lang['lpn_backdrop_target_label']='Přesunout tento bod na:';
$ec_lang['lpn_backdrop_target_node']='Uzel';
$ec_lang['lpn_backdrop_target_free']='Libovolný bod na mapě';
$ec_lang['lpn_backdrop_target_coords']='Souřadnice, které zadáte';
$ec_lang['lpn_backdrop_coords_prompt']='Zadejte souřadnice X,Y, na které se má bod přesunout';
$ec_lang['lpn_backdrop_continue']='Pokračovat';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// One key for the toolbar button, the Project menu row and the Settings box's own title (Task 699).
$ec_lang['lpn_tool_settings']='Nastavení';
$ec_lang['lpn_settings_show_titles']='Zobrazit nadpisy stránky';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Skrýt tyto názvy';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Zobrazit nápovědu k výběru';
$ec_lang['lpn_settings_area_hint_tip']='Zobrazí nad mapou výzvu, která uvádí další krok při výběru oblasti.';
$ec_lang['lpn_settings_hover_card']='Zobrazit všechny vlastnosti při najetí';
$ec_lang['lpn_settings_hover_card_tip']='Zastavením ukazatele na uzlu, spoji nebo odběrateli se zobrazí všechny jeho vlastnosti ve formátu zadaném v Nastavení, v libovolném měřítku, ať se popisek na mapu vejde, či nikoli. Toto nastavení platí pro tento prohlížeč, nikoli pro projekt.';
// Task 805 (Tom, 2026-10-15, R-396: "It would be good to be able to hide the amber override
// indicators from the map. Maybe a Map, Clean map button is a good idea after all"). The rings'
// own switch, in Settings, Map and page, Page; and the Map menu row that hides them with the
// controls over the drawing. Both are browser settings.
$ec_lang['lpn_settings_override_marks']='Zobrazit značky specifických hodnot na mapě';
$ec_lang['lpn_settings_override_marks_tip']='Zobrazí jantarový kroužek u prvku se specifickou hodnotou v otevřeném scénáři a čárkovaný šedý kroužek u prvku, který ji dědí. Panel Tabulky označuje specifické hodnoty v obou případech. Mapa, Vyčistit mapu skryje kroužky, dokud je zaškrtnuto. Toto nastavení platí pro tento prohlížeč, nikoli pro projekt.';
$ec_lang['lpn_clean_map']='Vyčistit mapu';
$ec_lang['lpn_clean_map_tip']='Zaškrtnuto: tlačítka přiblížení, tlačítko mapy ulic a satelitu, tlačítko Zprávy a oznámení, nápověda k výběru, tlačítko zpětné vazby a kroužky specifických hodnot jsou skryty. Odškrtnuto: jsou zobrazeny. Chyby se na mapě zobrazují i nadále a každé oznámení zůstává uloženo ve Zprávách. Toto nastavení platí pro tento prohlížeč, nikoli pro projekt.';
$ec_lang['lpn_settings_theme']='Motiv';
$ec_lang['lpn_settings_theme_tip']='Zvolte světlé nebo tmavé barvy stránky. Systém se řídí nastavením vašeho zařízení. Kresba mapy vypadá ve všech motivech stejně. Toto nastavení platí pro tento prohlížeč, nikoli pro projekt.';
$ec_lang['lpn_theme_system']='Systém';
$ec_lang['lpn_theme_light']='Světlý';
$ec_lang['lpn_theme_dark']='Tmavý';
$ec_lang['lpn_settings_id_prefixes']='Předpony ID';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Hodnoty nových prvků';
$ec_lang['lpn_settings_defaults_note']='Použije se pro prvky, které vytvoříte od nynějška. Stávající prvky se nemění.';
$ec_lang['lpn_settings_push_note']='Použijí se pouze vlastnosti, jejichž popisky jsou právě zobrazeny.';
$ec_lang['lpn_settings_push_btn']='Použít tyto hodnoty pro nové prvky na všechny stávající prvky';
$ec_lang['lpn_push_confirm']='Nahradit tyto vlastnosti u každého stávajícího prvku hodnotami nyní nastavenými pro nové prvky? Zadané hodnoty budou přepsány. Tuto akci lze vrátit zpět.';
$ec_lang['lpn_push_properties']='Vlastnosti:';
$ec_lang['lpn_push_assets']='Uzly a potrubí:';
$ec_lang['lpn_push_none_displayed']='Momentálně není zobrazen žádný popisek výchozí hodnoty, takže není co použít. Zapněte popisky požadovaných vlastností v panelu Popisky a zkuste to znovu.';
$ec_lang['lpn_push_nothing']='Žádný stávající prvek nemá žádnou z použitých vlastností.';
$ec_lang['lpn_push_no_change']='Všechny prvky už tyto hodnoty mají, takže by se nic nezměnilo.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Vlastní vlastnosti';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Uživatelem definované vlastnosti. Ukládají se s projektem a scénáři stejně jako všechny ostatní vlastnosti.';
$ec_lang['lpn_cp_design']='Návrh';
$ec_lang['lpn_cp_design_tip']='Jeden řádek na vlastní vlastnost; po otevření zobrazí: Klíč, Popisek, Platí pro, Ověřovat jako, Povolit nebo omezit, pole znaků pojmenované podle této volby, Dolní limit délky, Horní limit délky, Dolní limit, Horní limit.';
$ec_lang['lpn_cp_add']='Přidat vlastní vlastnost';
$ec_lang['lpn_cp_add_tip']='Přidá řádek do návrhové tabulky a otevře jej k úpravě.';
$ec_lang['lpn_cp_remove_tip']='Odebere tuto vlastnost z návrhové tabulky. Hodnoty již zadané u prvků zůstávají v souboru a obnoví se, bude-li znovu definována vlastnost se stejným klíčem.';
$ec_lang['lpn_cp_none']='Zatím není navržena žádná vlastní vlastnost.';
$ec_lang['lpn_cp_unnamed']='Zatím nepojmenováno';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Klíč';
$ec_lang['lpn_cp_key_tip']='Klíč: Vlastnost se ukládá pod tímto názvem. Mezery nejsou povoleny a předpona se přidává automaticky, aby váš klíč nikdy nekolidoval se vestavěným polem.';
$ec_lang['lpn_cp_label']='Popisek';
$ec_lang['lpn_cp_label_tip']='Popisek: Zobrazuje se v okně vlastností, ve funkci Najít a v záhlaví sloupce tabulky.';
$ec_lang['lpn_cp_applies']='Platí pro';
$ec_lang['lpn_cp_applies_tip']='Platí pro: Seznam předpon ID oddělený čárkami pro prvky, které tuto vlastnost používají, například J,L,R.';
$ec_lang['lpn_cp_validate']='Ověřovat jako';
$ec_lang['lpn_cp_validate_tip']='Ověřovat jako: Formát, který musí mít platná hodnota. Pravidla pro velikost písmen platí pouze pro anglickou abecedu. Volbou Neověřovat přijmete libovolnou hodnotu.';
$ec_lang['lpn_cp_restrict']='Omezit tyto znaky';
$ec_lang['lpn_cp_restrict_tip']='Zakázat tyto znaky:';
$ec_lang['lpn_cp_allow_tip']='Povolit pouze tyto znaky:';
$ec_lang['lpn_cp_characters_tip']='„@“ znamená libovolné písmeno; „#“ znamená libovolnou číslici a znaky „-“, „.“ a „,“ je nutné uvést zvlášť, pokud jsou povoleny; mezery a jiné prázdné znaky musí být mezi ostatními znaky.';
$ec_lang['lpn_cp_restrict_mode']='Povolit nebo omezit';
$ec_lang['lpn_cp_restrict_mode_tip']='Povolit nebo omezit: Zadané znaky jsou buď jediné, které hodnota smí použít, nebo naopak ty, které použít nesmí.';
$ec_lang['lpn_cp_restrict_allow']='Povolit pouze tyto znaky';
$ec_lang['lpn_cp_minlength']='Dolní limit délky';
$ec_lang['lpn_cp_minlength_tip']='Dolní limit délky: Každý kratší záznam je označen. Slouží k nalezení prázdných a neúplných záznamů.';
$ec_lang['lpn_cp_length']='Horní limit délky';
$ec_lang['lpn_cp_length_tip']='Horní limit délky: Každý delší záznam je označen.';
$ec_lang['lpn_cp_low']='Dolní limit';
$ec_lang['lpn_cp_low_tip']='Dolní limit: Toto je nejmenší hodnota, kterou očekáváte. Čísla se porovnávají jako čísla, text v abecedním pořadí.';
$ec_lang['lpn_cp_high']='Horní limit';
$ec_lang['lpn_cp_high_tip']='Horní limit: Toto je největší hodnota, kterou očekáváte. Čísla se porovnávají jako čísla, text v abecedním pořadí.';
$ec_lang['lpn_cp_val_none']='Neověřovat';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Číslo .';
$ec_lang['lpn_cp_val_number_comma']='Číslo ,';
$ec_lang['lpn_cp_val_integer']='Celé číslo';
$ec_lang['lpn_cp_val_upper']='VŠECHNA VELKÁ PÍSMENA';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Hodnota zůstává přesně taková, jak byla zadána.';
$ec_lang['lpn_valwarn_diameter']='Průměr potrubí nebo ventilu bývá obvykle mezi {min} a {max} {unit}. Zkontrolujte číslo a jednotku průměru.';
$ec_lang['lpn_valwarn_hw']='Součinitel C podle Hazen-Williams bývá obvykle mezi {min} a {max}. Číslo mimo tento rozsah je často drsnost určená pro jinou metodu tření.';
$ec_lang['lpn_valwarn_manning']='Manningovo n bývá obvykle mezi {min} a {max}. Číslo mimo tento rozsah je často drsnost určená pro jinou metodu tření.';
$ec_lang['lpn_valwarn_dw']='Drsnost podle Darcy-Weisbach je obvykle větší než 0 a nejvýše {max} {unit}. Větší číslo je často součinitel C podle Hazen-Williams nebo Manningovo n.';
$ec_lang['lpn_valwarn_positive']='EPANET zde nepřijímá nulu ani záporné číslo.';
$ec_lang['lpn_valwarn_negative']='EPANET zde nepřijímá záporné číslo.';
$ec_lang['lpn_valwarn_tank_levels']='EPANET tuto nádrž nepřijímá. Nejnižší hloubka vody nesmí překročit hloubku vody a hloubka vody nesmí překročit nejvyšší hloubku vody.';
$ec_lang['lpn_cp_bad_number']='Tato hodnota není číslo, jak tato vlastnost vyžaduje.';
$ec_lang['lpn_cp_bad_integer']='Tato hodnota není celé číslo, jak tato vlastnost vyžaduje.';
$ec_lang['lpn_cp_bad_case']='Tato hodnota není psána VŠEMI VELKÝMI PÍSMENY, jak tato vlastnost vyžaduje.';
$ec_lang['lpn_cp_bad_chars']='Tato hodnota obsahuje znak, který tato vlastnost nepovoluje.';
$ec_lang['lpn_cp_bad_space']='Mezery jsou povoleny jen mezi jinými znaky.';
$ec_lang['lpn_cp_bad_minlength']='Tato hodnota je kratší, než tato vlastnost povoluje.';
$ec_lang['lpn_cp_bad_length']='Tato hodnota je delší, než tato vlastnost povoluje.';
$ec_lang['lpn_cp_bad_low']='Tato hodnota je pod dolním limitem této vlastnosti.';
$ec_lang['lpn_cp_bad_high']='Tato hodnota je nad horním limitem této vlastnosti.';
$ec_lang['lpn_cp_key_needed']='Zadejte klíč této vlastní vlastnosti bez mezer.';
$ec_lang['lpn_cp_key_taken']='Tento klíč už používá jiná vlastní vlastnost.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Scénář';
$ec_lang['lpn_scenario_base']='Základní';
// "Base" is four letters carrying six English senses, standing alone as a proper name in a dropdown.
// KEPT, because Tom is right that it is solid where it sits (2026-08-14) and it is what WaterGEMS and
// InfoWater scenario managers call it -- so the fix belongs here, not in the English. Word list is
// his; "Original" was struck at his instruction.
// "Overrides" (Tom, 2026-10-04: *"I believe that the technical term may be 'Enter the scenario's
// override'"*; Mary found it is Bentley WaterGEMS's word, "Overriding Inheritance"). It replaced
// "custom values" (2026-08-14). The rejected alternative stays rejected for a TRANSLATION reason:
// "own values" calques onto the standard term for EIGENVALUES in most of Europe (es valores propios,
// de Eigenwerte, ru sobstvennye), and "changed values" is FALSE, because an override may equal
// Base's number (lpn_scenario_override_tip; dev/lpn-spike/scenario-harness.js). "Override" has no
// mathematical calque and says the scenario's value stands in for the parent's.
$ec_lang['lpn_scenario_overrides']='Počet specifických hodnot';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Jantarový kroužek znamená, že tento prvek má specifickou hodnotu ve scénáři {name}.';
$ec_lang['lpn_scenario_mark_inh_tip']='Čárkovaný šedý kroužek znamená, že scénář {name} dědí specifickou hodnotu tohoto prvku z nadřazeného scénáře nebo alternativy.';
$ec_lang['lpn_scenario_overrides_tip']='Každá specifická hodnota je na mapě označena jantarovým kroužkem. Přepnutím na {base} nebo jiný nadřazený scénář zobrazíte výkres bez nich.';
$ec_lang['lpn_scenario_menu']='Scénáře';
$ec_lang['lpn_scenario_tip']='Sada hodnot, kterou kresba právě zobrazuje a kterou stránka právě počítá. Kliknutím přepnete scénář, nebo scénář přidáte, přejmenujete či smažete.';
$ec_lang['lpn_scenario_new']='Nový scénář…';
$ec_lang['lpn_scenario_new_name']='Scénář {n}';
$ec_lang['lpn_scenario_prompt_name']='Název tohoto scénáře';
$ec_lang['lpn_scenario_rename']='Přejmenovat scénář…';
$ec_lang['lpn_scenario_delete']='Smazat scénář';
$ec_lang['lpn_scenario_delete_ask']='Smazat scénář {name}? Samotný výkres se nemění.';
$ec_lang['lpn_scenario_delete_goes']='Jeho specifické hodnoty ({n}) se smažou spolu s ním.';
$ec_lang['lpn_scenario_delete_stays']='Tyto alternativy, které používá, zůstanou v projektu: {list}.';
$ec_lang['lpn_scenario_delete_has_children']='Scénář {name} nelze smazat, protože má podřízené scénáře: {list}. Nejprve je smažte nebo přesuňte pod jiný nadřazený.';
// Edited by TGH 2026-09-07
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Základní scénář: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} je ve scénáři {scenario} vyloučen ze sítě. Zůstává ve výkresu a v ostatních scénářích.';
$ec_lang['lpn_scenario_delete_in_base']='Chcete-li prvek odstranit z výkresu, smažte jej ve scénáři {base}.';
$ec_lang['lpn_scenario_only_deleted']='{id} je smazán. Byl součástí pouze scénáře {scenario}.';
$ec_lang['lpn_scenario_delete_blocked']='{id} nebyl smazán, protože na něm končí potrubí {link}, které existuje i mimo scénář {scenario}. Chcete-li smazat obojí, smažte je ve scénáři {base}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_basic']='Základní režim';
$ec_lang['lpn_scenario_basic_tip']='Zaškrtnuto: alternativy jsou skryté a automatické, každý scénář ukazuje své specifické hodnoty jako vlastní a všechny nové scénáře jsou podřízené Základnímu scénáři; Správce scénářů a tabulka Scénáře se nezobrazují. Odškrtnuto: Správce scénářů a tabulka Scénáře se zobrazují a alternativy lze sdílet mezi scénáři. Správce scénářů je zakázán, dokud je Základní režim zapnut. Základní režim je zakázán, má-li projekt vztahy scénářů a alternativ, které Základní režim nedokáže zobrazit.';
$ec_lang['lpn_scenario_basic_misfit']='Tento projekt má vztahy scénářů a alternativ, které se s Základním režimem scénářů neslučují, a Základní režim je proto zakázán.';
$ec_lang['lpn_scenario_basic_misfit_base']='Základní scénář používá jinou alternativu než Základní.';
$ec_lang['lpn_scenario_copy']='Kopírovat scénář';
$ec_lang['lpn_scenario_copy_tip']='Zkopíruje otevřený scénář s jeho specifickými hodnotami a otevře kopii.';
$ec_lang['lpn_scenario_copy_off']='Kopírovat scénář funguje v Základním režimu. Při vypnutém Základním režimu přidejte scénář a zvolte jeho alternativy v tabulce Scénáře.';
$ec_lang['lpn_sm_title']='Správce scénářů';
$ec_lang['lpn_sm_menu']='Správce scénářů…';
$ec_lang['lpn_sm_basic_on']='Správce scénářů je zakázán, dokud je Základní režim zapnut.';
$ec_lang['lpn_pane_tab_scenarios']='Scénáře';
$ec_lang['lpn_sm_col_parent']='Nadřazený';
$ec_lang['lpn_sm_add_child']='Přidat potomka';
$ec_lang['lpn_sm_add_base']='Přidat základ';
$ec_lang['lpn_sm_add_base_tip']='Přidá další Základní scénář. Začíná jako kopie Základního s vlastními alternativami a pozdější úpravy Základního jej nemění.';
$ec_lang['lpn_sm_add_base_alt_tip']='Přidá další Základní alternativu. Začíná jako kopie hodnot Základní v této kategorii a pozdější úpravy Základní ji nemění.';
$ec_lang['lpn_sm_delete']='Smazat vybranou položku. Používaná položka se nesmaže.';
$ec_lang['lpn_sm_base_kept']='Základ stromu se nemaže. Další Základ přidaný příkazem Přidat základ se smaže, pokud jej nic nepoužívá.';
$ec_lang['lpn_sm_rename']='Přejmenovat';
$ec_lang['lpn_sm_rename_alts_ask']='Přejmenovat stejně pojmenované alternativy?';
$ec_lang['lpn_sm_make_current']='Učinit aktuálním';
// Tips on greyed Scenario manager commands, saying why they are greyed (Perry, 2026-10-11).
$ec_lang['lpn_sm_current_already']='Tento scénář je již aktuální scénář.';
$ec_lang['lpn_sm_none_selected']='Nejprve vyberte položku ve stromu.';
$ec_lang['lpn_sm_base_named']='Základ stromu se nepřejmenovává.';
$ec_lang['lpn_sm_copy']='Kopírovat';
$ec_lang['lpn_sm_merge_up']='Sloučit nahoru';
$ec_lang['lpn_sm_merge_up_tip']='Přesune specifické hodnoty vybrané alternativy do alternativy nad ní ve stromu. Vybraná alternativa pak tyto hodnoty dědí.';
$ec_lang['lpn_sm_merge_up_root']='Základní alternativa nemá nad sebou nic, do čeho by se dala sloučit.';
$ec_lang['lpn_sm_merge_none']='Alternativa {name} nemá žádné specifické hodnoty ke sloučení.';
$ec_lang['lpn_sm_merge_pick']='Do které alternativy sloučit specifické hodnoty {name}? Její nadřazená je uvedena první.';
$ec_lang['lpn_sm_merge_ask']='Přesunout specifické hodnoty ({n}) alternativy {name} nahoru do {target}? Poté je bude dědit místo přepisování. Lze to vrátit zpět.';
$ec_lang['lpn_sm_merge_skipped']='{between} tyto hodnoty také přepisuje. Přeskočí se a nezmění, takže {name} je bude číst z {between}, ne z {target}:';
$ec_lang['lpn_sm_merge_line']='{asset}: {property}';
$ec_lang['lpn_sm_copy_up']='Kopírovat nahoru';
$ec_lang['lpn_sm_copy_up_tip']='Zkopíruje specifické hodnoty vybrané alternativy do alternativy nad ní ve stromu. Vybraná alternativa si své specifické hodnoty ponechá.';
$ec_lang['lpn_sm_copy_up_root']='Základní alternativa nemá nad sebou nic, do čeho by se dala kopírovat.';
$ec_lang['lpn_sm_copy_none']='Alternativa {name} nemá žádné specifické hodnoty ke zkopírování.';
$ec_lang['lpn_sm_copy_pick']='Do které alternativy zkopírovat specifické hodnoty {name}? Její nadřazená je uvedena první.';
$ec_lang['lpn_sm_copy_ask']='Zkopírovat specifické hodnoty ({n}) alternativy {name} nahoru do {target}? {name} si je ponechá jako vlastní specifické hodnoty. Lze to vrátit zpět.';
$ec_lang['lpn_sm_copy_skipped']='{between} tyto hodnoty také přepisuje. Přeskočí se a nezmění, takže si ponechá své vlastní hodnoty:';
$ec_lang['lpn_sm_list_overrides']='Správce specifických hodnot…';
$ec_lang['lpn_sm_list_overrides_tip']='Vypíše specifické hodnoty scénáře podle kategorií, každou se zděděnou hodnotou, kterou přepisuje, a umožní kteroukoli zrušit.';
$ec_lang['lpn_sm_list_overrides_none']='Tento scénář nemá žádné specifické hodnoty.';
$ec_lang['lpn_ovl_title']='Správce specifických hodnot: {name}';
$ec_lang['lpn_ovl_note']='Jsou to hodnoty, které si tento scénář nastavuje sám v alternativách, které používá, každá s hodnotou, kterou nahrazuje. Hodnoty, které dědí, se nevypisují ani nepočítají. Zrušením specifické hodnoty se obnoví zděděná hodnota; Zpět to vrátí. Vyberte ID a přejdete na prvek na mapě.';
$ec_lang['lpn_ovl_clear_selected']='Zrušit vybrané specifické hodnoty';
$ec_lang['lpn_ovl_clear_all']='Zrušit všechny specifické hodnoty';
$ec_lang['lpn_ovl_clear_all_ask']='Zrušit všechny specifické hodnoty ({n}) scénáře {name}? Každá hodnota se vrátí na zděděnou hodnotu. Zpět to vrátí.';
$ec_lang['lpn_ovl_pick_tip']='Vybere tuto specifickou hodnotu pro tlačítko Zrušit vybrané specifické hodnoty.';
$ec_lang['lpn_ovl_bubble_off']='Není na mapě';
$ec_lang['lpn_ovl_bubble_moved']='{quantity}, přesunuto nebo změněna velikost';
$ec_lang['lpn_ovl_group']='{category}: {alternative}';
$ec_lang['lpn_ovl_col_override']='Specifická hodnota';
$ec_lang['lpn_ovl_col_inherited']='Zděděná hodnota';
$ec_lang['lpn_ovl_col_inherited_tip']='Hodnota, kterou tento scénář čte bez specifické hodnoty: hodnota nadřazené alternativy nebo Základní hodnota.';
$ec_lang['lpn_ovl_same']='(stejná)';
$ec_lang['lpn_ovl_same_tip']='Rovná se zděděné hodnotě. Stále je to specifická hodnota a počítá se.';
$ec_lang['lpn_sm_help']='Jak fungují scénáře a alternativy:\n\nV Základním režimu jsou alternativy skryté a automatické a všechny nové scénáře jsou podřízené Základnímu scénáři.\n\nPři vypnutém Základním režimu je k dispozici složitý strom dědičnosti a alternativy lze sdílet mezi scénáři. Výchozí chování úprav, když je potřeba nová vazba na alternativu (bez aktivní správy ze strany uživatele), je však vytvořit alternativu pojmenovanou podle aktuálního scénáře, čímž každý scénář získá vlastní sadu alternativ.\n\nVlastnosti a nastavení patří do kategorií alternativ, které se zobrazují jako sloupce tabulky scénářů a alternativ a jako možnosti správy ve Správci scénářů.\n\nSpecifické hodnoty se vytvářejí ve scénářích, ale ve skutečnosti patří příslušným alternativám přiřazeným ke scénáři; scénář je tedy jako okno do svých alternativ. Přiřazení alternativ ke scénářům se spravuje v pravém panelu Správce scénářů nebo v tabulce Scénáře ve spodním panelu. Vytvoření nového scénáře nevytváří žádné alternativy; nový scénář používá alternativy svého nadřazeného, dokud nevzniknou specifické hodnoty, které potřebují nové alternativy. Když se ve scénáři vytvoří specifické hodnoty, ukládají se do příslušné alternativy pro tento scénář; nemá-li scénář takovou alternativu, vytvoří se nová alternativa pojmenovaná podle scénáře.\n\nPříklad: Vytvoříte scénář „Obrázek: ID uzlů a spojů“ a upravíte Text tak, aby uváděl „ID uzlů a spojů“. Při vytvoření scénáře se nevytvoří žádné alternativy. V okamžiku uložení Textu se však vytvoří alternativa Textu nazvaná „Obrázek: ID uzlů a spojů“ se specifickou hodnotou Textu. V Základním režimu to vidíte jednoduše jako specifickou hodnotu ve scénáři samotném.\n\nKopírovat vlastnosti kopíruje pouze specifické hodnoty. V jakémkoli jiném scénáři než Základní kopíruje jen specifické hodnoty, které má prvek v tomto scénáři.\n\nJak scénáře spravovat:\n\n- Zvolte Scénáře nebo kategorii alternativ v seznamu nahoře a zobrazí se jeho strom.\n\n- Potomka vybrané položky vytvoříte příkazem Přidat potomka. Přidat základ přidá další Základ, který začíná jako kopie Základu tak, jak je nyní; pozdější úpravy Základu jej nemění. Nový potomek je pojmenován podle svého nadřazeného; zadáním názvu jej přejmenujete. Kopírovat zkopíruje vybranou alternativu. Sloučit nahoru přesune specifické hodnoty vybrané alternativy do alternativy nad ní, zvolené podle názvu, a vybraná alternativa je pak dědí; nejprve uvede každou hodnotu, kterou přepisuje i alternativa, jež se přeskakuje, a ta se nemění. Chcete-li zkopírovat scénář, použijte v Základním režimu Kopírovat scénář v nabídce Scénáře; zkopíruje specifické hodnoty scénáře spolu s alternativami, které je drží. Přidat základ i Kopírovat scénář vytvářejí alternativy: Přidat základ vytvoří Základní alternativu pro nový Základ v každé kategorii, která drží hodnoty, a Kopírovat scénář vytvoří novou alternativu, pojmenovanou jako kopie, pro každou alternativu, která drží specifické hodnoty scénáře.\n\n- Přetažením položky na jinou z ní uděláte potomka této položky. Scénář přesunutý pod nového nadřazeného z něj dědí vše, co nepřepsal; to, co přepsal, se nemění. Přetažením položky mezi dvě položky je přeřadíte.\n\n- Kliknutím na položku ji vyberete. Stisknutím F2 nebo volbou Přejmenovat přejmenujete vybranou položku. Přejmenování scénáře se zeptá, zda přejmenovat i alternativy, které nesou jeho název; v Základním režimu se přejmenují spolu s ním, bez dotazu. Dvojitým kliknutím na scénář nebo stisknutím Enter jej učiníte aktuálním. Kliknutím na šipku vedle položky nebo stisknutím Doleva či Doprava ji sbalíte nebo rozbalíte. Kliknutím pravým tlačítkem na položku získáte stejné příkazy jako u tlačítek.\n\n- Stisknutím Delete nebo kliknutím na tlačítko mínus vybranou položku smažete. Používaná položka se nesmaže a zpráva uvádí, co ji používá. Smazání scénáře při vypnutém Základním režimu ponechá alternativy, které používá. Smazání scénáře při zapnutém Základním režimu smaže také každou jeho alternativu, kterou nepoužívá žádný jiný scénář.\n\n- Aby scénář používal jinou alternativu, včetně Základní, zvolte ji v řádku scénáře v pravém panelu Správce scénářů nebo v tabulce Scénáře. Specifická hodnota vytvořená ve sdílené alternativě změní každý scénář, který ji používá.';
$ec_lang['lpn_sm_delete_alt_ask']='Smazat alternativu {name}?';
$ec_lang['lpn_sm_in_use']='{item}\nnelze smazat, dokud ji používá\n{list}';
$ec_lang['lpn_sm_alt_delete_has_children']='Alternativu {name} nelze smazat, protože má podřízené alternativy: {list}. Nejprve je smažte nebo přesuňte pod jiný nadřazený.';
$ec_lang['lpn_sm_item_scenario']='Scénář {name}';
$ec_lang['lpn_sm_item_alternative']='Alternativa {name}';
$ec_lang['lpn_sm_name_taken']='Název {name} se v tomto stromu již používá.';
$ec_lang['lpn_sm_cycle']='{name} nelze přesunout pod jednu z jeho vlastních podřízených položek.';
$ec_lang['lpn_sm_used_by']='Používají scénáře: {n}';
$ec_lang['lpn_sm_used_by_tip']='Používá: {list}';
$ec_lang['lpn_sm_used_by_none']='Žádný scénář nepoužívá';
$ec_lang['lpn_sm_tree_all']='Vše';
$ec_lang['lpn_sm_tree_unused']='Vše nepoužívané';
$ec_lang['lpn_sm_unused_none']='Žádné';
$ec_lang['lpn_sm_all_row_tip']='Dvojitým kliknutím jej otevřete v jeho stromu kategorie.';
$ec_lang['lpn_sm_compare_tip']='Zahrnout do Porovnání scénářů';
$ec_lang['lpn_sm_inherited']='zděděno';
$ec_lang['lpn_sm_shared_note']='Sdíleno s: {list}';
$ec_lang['lpn_scncmp_none_checked']='Pro porovnání není zaškrtnut žádný scénář. Zaškrtněte scénáře ve Správci scénářů.';
$ec_lang['lpn_time_scn_overrides']='Specifické hodnoty scénáře:';
$ec_lang['lpn_settings_table_major']='Hlavní nadpis';
$ec_lang['lpn_settings_table_minor']='Vedlejší nadpis';
$ec_lang['lpn_settings_table_category']='Kategorie';
// The Settings table's third heading level, between Minor heading and Setting: the label field, coloured
// field, asset or custom property a group of settings belongs to (Tom, 2026-10-07: "We could call it
// 'Owner'.").
$ec_lang['lpn_settings_table_owner']='Vlastník';
$ec_lang['lpn_settings_table_setting']='Nastavení';
$ec_lang['lpn_settings_table_yes']='Ano';
$ec_lang['lpn_settings_table_no']='Ne';
$ec_lang['lpn_settings_row_of']='{setting}, {member}';
$ec_lang['lpn_settings_row_labels_field']='{labels}: {field}';
$ec_lang['lpn_settings_row_labels_part']='{labels}: {field}, {part}';
$ec_lang['lpn_settings_row_labels_customer']='Popisky odběratelů';
$ec_lang['lpn_settings_row_label_before']='Text před';
$ec_lang['lpn_settings_row_label_after']='Text za';
// A label field's settings, named in the Setting column with the field itself in the Owner column
// (Tom, 2026-10-07: "Symbology.Node labels.ID.Is Active", "Show order", "Drop order"). Whether the
// value appears on the label at all; where it sits on the label (1 first); which value is given up
// first when labels crowd (1 first).
$ec_lang['lpn_settings_row_label_on']='Je aktivní';
$ec_lang['lpn_settings_row_label_show']='Pořadí zobrazení';
$ec_lang['lpn_settings_row_label_drop']='Pořadí vypouštění';
// The Setting column of an ID prefix row; the asset it applies to is in the Owner column.
$ec_lang['lpn_settings_row_id_prefix']='Předpona ID';
$ec_lang['lpn_settings_row_symbol_cap_multiple']='Největší symbol, jako násobek typické délky potrubí';
$ec_lang['lpn_settings_row_symbol_cap_percentile']='Typická délka potrubí, jako percentil všech délek potrubí';
$ec_lang['lpn_settings_row_contour_labels']='Popisky vrstevnic';
$ec_lang['lpn_settings_row_check_freq']='Četnost kontrol stavu';
$ec_lang['lpn_settings_row_max_check']='Nejvyšší počet kontrol stavu';
$ec_lang['lpn_settings_row_status_report']='Zpráva o stavu';
$ec_lang['lpn_settings_row_pda_src']='Možnosti řízení tlakem uvedené v souboru';
$ec_lang['lpn_settings_row_quality_option']='Možnost kvality, jak ji uvádí soubor';
$ec_lang['lpn_settings_row_tolerance']='Přesnost (starší projekty)';
$ec_lang['lpn_settings_row_emitter_exponent_old']='Exponent emitoru (starší projekty)';
$ec_lang['lpn_settings_row_elev_source_old']='Zdroj nadmořské výšky (starší projekty)';
$ec_lang['lpn_settings_row_basemap']='Podkladová mapa';
$ec_lang['lpn_settings_row_basemap_last']='Podkladová mapa, na kterou se vrátit';
$ec_lang['lpn_settings_row_customer_max_width']='Zobrazovat popisky odběratelů při tomto přiblížení mapy nebo blíže';
$ec_lang['lpn_settings_row_quality_step']='Časový krok kvality';
$ec_lang['lpn_settings_row_view']='Pohled mapy (střed a měřítko)';
$ec_lang['lpn_settings_row_bubbles']='Grafy časových řad na mapě';
$ec_lang['lpn_settings_row_contour_fill']='Výplň vrstevnic';
$ec_lang['lpn_settings_row_contour_opacity']='Krytí výplně vrstevnic';
$ec_lang['lpn_settings_row_contour_interval']='Interval vrstevnic';
$ec_lang['lpn_settings_row_contour_buffer']='Dosah vrstevnic';
$ec_lang['lpn_settings_row_contour_terrain']='Terén mezi uzly pro vrstevnice z Mapbox DEM';
$ec_lang['lpn_settings_row_new_asset']='Nové prvky: {setting}';
$ec_lang['lpn_settings_row_default']='{value} (výchozí)';
$ec_lang['lpn_settings_row_view_value']='Střed {x}, {y}; měřítko {s}';
$ec_lang['lpn_settings_held_in']='Specifická hodnota ve scénáři {scenario}.';
$ec_lang['lpn_settings_held_base']='{base}: {value}';
$ec_lang['lpn_settings_view_center']='Střed mapy';
$ec_lang['lpn_settings_view_scale']='Měřítko mapy';
$ec_lang['lpn_settings_view_scale_tip']='Měřítko ve středu mapy ve tvaru 1:N. Zadáním 1:2000 nebo jen 2000 se přiblíží na toto měřítko.';
$ec_lang['lpn_settings_view_top_left']='Levý horní roh';
$ec_lang['lpn_settings_view_bottom_right']='Pravý dolní roh';
$ec_lang['lpn_settings_view_save']='Uložit tento pohled do tohoto scénáře';
$ec_lang['lpn_settings_view_save_tip']='Uloží tento střed a měřítko mapy do otevřeného scénáře, takže otevření tohoto scénáře přesune mapu sem. Pozdější posun mapy nic nemění, dokud toto znovu neuděláte. Zrušením specifické hodnoty se opět sleduje pohled {base}.';
$ec_lang['lpn_settings_row_basemap_osm']='Mapa ulic';
$ec_lang['lpn_settings_row_basemap_satellite']='Satelitní snímky';
$ec_lang['lpn_settings_row_basemap_topo']='Topografická mapa';
$ec_lang['lpn_settings_units_one_project']='Jednotky jsou ve všech scénářích stejné.';
$ec_lang['lpn_settings_restore_base_only']='Chcete-li obnovit výchozí hodnoty, přepněte na Základní.';
$ec_lang['lpn_alt_cat_physical']='Fyzikální';
$ec_lang['lpn_alt_cat_demand']='Odběr';
$ec_lang['lpn_alt_cat_topology']='Aktivní topologie';
$ec_lang['lpn_alt_cat_topology_tip']='Aktivace prvků';
$ec_lang['lpn_alt_cat_initial']='Počáteční nastavení';
$ec_lang['lpn_alt_cat_constituent']='Složka';
$ec_lang['lpn_alt_cat_fireflow']='Požární průtok';
$ec_lang['lpn_alt_cat_energy']='Náklady na energii';
$ec_lang['lpn_alt_cat_userdata']='Vlastní vlastnosti';
$ec_lang['lpn_alt_cat_text']='Text';
$ec_lang['lpn_alt_cat_presentation']='Prezentace';
$ec_lang['lpn_alt_cat_calculation']='Výpočet';
// Edited by TGH 2026-09-07
// Task 721: the scenarios every new project starts with. Keep the leading number: the list sorts
// by name, and the numbers hold Tom's order in every language.
$ec_lang['lpn_scenario_preset_flow_static']='1. Zkouška průtoku: statická';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Kalibrace zkoušky průtoku pro navrhovanou síť při nulovém průtoku. V tomto scénáři nastavte odběr ve všech uzlech na 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Zkouška průtoku: střední';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Kalibrace zkoušky průtoku pro navrhovanou síť při prvním uvedeném průtoku. V tomto scénáři nastavte odběr v uzlu, kterým voda protéká, na první naměřený průtok a odběr ve všech ostatních uzlech na 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Zkouška průtoku: maximální';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Kalibrace zkoušky průtoku pro navrhovanou síť při uvedeném maximálním průtoku. V tomto scénáři nastavte odběr v uzlu, kterým voda protéká, na maximální naměřený průtok a odběr ve všech ostatních uzlech na 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Průměrný den';
$ec_lang['lpn_scenario_preset_average_day_tip']='Násobitel odběru 1: každý odběr tak, jak byl zadán, což se považuje za odběr průměrného dne.';
$ec_lang['lpn_scenario_preset_max_day']='5. Maximální den';
$ec_lang['lpn_scenario_preset_mult_tip']='Násobitel odběru {mult} × průměrný den, zástupná hodnota. Většina systémů leží mezi {lo} a {hi} (National Research Council, 2006). Hodnotu pro modelovaný systém nastavte v Nastavení, Výpočet, Hydraulika, Násobitel odběru.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Špičková hodina';
$ec_lang['lpn_delete_drops_overrides']='Smazáním tohoto prvku se smažou také jeho specifické hodnoty scénářů ({n}). Pokračovat?';
$ec_lang['lpn_push_base_only']='Tato akce mění samotnou kresbu, proto ji lze provést jen v {base}. Přepněte na {base} a zkuste to znovu.';
$ec_lang['lpn_field_active']='Je aktivní?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Zrušením zaškrtnutí tohoto pole ponecháte prvek na výkresu, ale mimo síť: vykreslí se šedě a řešič jej ignoruje. Ve scénáři se tak potrubí zapíná a vypíná.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Exponent emitoru';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='Exponent v rovnici emitoru programu EPANET pro postřikovače a úniky: průtok = součinitel × tlak umocněný na tento exponent. Ovlivňuje výsledky pouze v uzlech s koeficientem emitoru.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Načíst DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Načte nadmořskou výšku z DEM v tomto uzlu a zobrazí ji níže. Nic v poli Nadmořská výška se nemění. Vodorovné rozlišení DEM je na většině Země asi 30 m a jemnější tam, kde existují lepší data.';
$ec_lang['lpn_elev_dem_use']='Použít DEM';
$ec_lang['lpn_elev_dem_use_tip']='Vloží nadmořskou výšku z DEM v tomto uzlu do pole Nadmořská výška výše a nahradí to, co v něm je. Pokud DEM ještě nebyl načten, načte se nejprve. Jedním Zpět se původní hodnota vrátí.';
$ec_lang['lpn_elev_dem_none']='DEM pro tento uzel nemá žádnou nadmořskou výšku.';
$ec_lang['lpn_elev_dem_said']='Nadmořská výška podle Mapbox DEM: {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Zdroj nadmořské výšky';
$ec_lang['lpn_settings_elev_source_tip']='Přesnost Mapbox DEM v roce 2026, nejprve vodorovná, poté svislá: v USA 1–10 m a méně než 1 m, v Evropě a Japonsku 2–10 m a 1–3 m, globálně 30 m a 10–16 m a na pólech 90 m a více než 16 m.';
$ec_lang['lpn_settings_elev_source_typed']='Výše';
$ec_lang['lpn_settings_elev_source_dem']='Mapbox DEM (výškopis)';
$ec_lang['lpn_settings_accuracy']='Přesnost';
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
$ec_lang['lpn_settings_default_is']='Výchozí hodnota je {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Mez konvergence, které musí řešič dosáhnout, než se zastaví, měřená jako celková změna průtoku z jedné zkoušky na další, dělená celkovým průtokem ve spojích. Menší číslo je přesnější a trvá déle.';
$ec_lang['lpn_settings_specific_gravity']='Měrná hmotnost';
$ec_lang['lpn_settings_viscosity']='Poměrná viskozita';
// **THE PASHTO COLLISION THIS ANSWERS IS REAL AND IS INSIDE PASHTO** (sprint 584-wave1). ps renders
// this key with the word غلظت, which carries BOTH viscosity/thickness AND concentration -- so it
// collided with the word the same sprint used for lpn_result_concentration, on the same screen.
// Tom approved a synonym on 2026-09-06. **HIS FIRST WORDING WAS 'Relative rate of diffusion' and it
// is NOT what shipped**: that is diffusivity, and this key is viscosity. He was given a friction
// entry that quoted a translator's mistaken description of the key without anyone checking it
// against this file -- so the note below says what the number IS and what it is NOT, because two
// separate readers have now reached for a transport coefficient on a fluid property.
$ec_lang['lpn_settings_viscosity_tip']='Viskozita kapaliny ve srovnání s vodou při 20 stupních Celsia. Mění výsledek jen podle metody Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Maximální počet zkoušek';
$ec_lang['lpn_settings_trials_tip']='Maximální počet zkoušek, než se řešič zastaví u sítě, která nedosahuje konvergence.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Pokud nedosáhne konvergence';
$ec_lang['lpn_settings_unbalanced_tip']='Postup u sítě, která vyčerpala své zkoušky a stále nedosáhla konvergence. Povolení dalších zkoušek často konvergence dosáhne. Zastavení ohlásí poslední zkoušku tak, jak je, což není řešení.';
$ec_lang['lpn_settings_unbalanced_continue']='Povolit další zkoušky';
$ec_lang['lpn_settings_unbalanced_stop']='Zastavit a nahlásit poslední zkoušku';
$ec_lang['lpn_settings_unbalanced_trials']='Další zkoušky před nahlášením';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Počet dalších zkoušek povolených po vyčerpání maxima výše, než se ohlásí poslední zkouška.';
$ec_lang['lpn_settings_head_error']='Limit chyby tlakové výšky';
$ec_lang['lpn_settings_head_error_tip']='Další zkouška, kterou musí řešič projít, než se zastaví: největší zbývající chyba tlakové výšky v jakémkoli jednom potrubí. Nula znamená tuto zkoušku nepoužívat. Toto pole čte pouze řešič EPANET.';
$ec_lang['lpn_settings_flow_change']='Limit změny průtoku';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Další zkouška, kterou musí řešič projít, než se zastaví: největší změna průtoku v jakémkoli jednom potrubí mezi jednou a další zkouškou. Nula znamená tuto zkoušku nepoužívat. Toto pole čte pouze řešič EPANET.';
$ec_lang['lpn_settings_damp_limit']='Tlumení začíná na';
$ec_lang['lpn_settings_damp_limit_tip']='Přesnost, při které řešič začne dělat menší kroky, což může pomoci síti, která osciluje, dosáhnout konvergence. Nula znamená, že řešič nikdy netlumí. Toto pole čte pouze řešič EPANET.';
$ec_lang['lpn_settings_option_unset']='Neuvedeno';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Jeden činitel použitý najednou na každý odběr v síti. Každý scénář může mít samostatnou hodnotu, takže průměrný den, maximální den nebo špičkovou hodinu lze vytvořit změnou pouze tohoto nastavení.';
$ec_lang['lpn_settings_engine_native']='Používat vestavěný řešič, kde je to možné';
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
$ec_lang['lpn_settings_engine_native_tip']='Zaškrtnutím povolíte použití vestavěného řešiče, kde je to možné. Jinak se vždy použije řešič EPANET americké agentury EPA. Vestavěný řešič se nepoužívá pro dlouhodobé simulace ani pro ventily rušící tlak a obecné ventily (PBV, GPV). Při prvním použití řešiče EPANET se stáhne asi 650 KB, které se poté uchovají v tomto zařízení. Má-li potrubí místní ztrátu, oba řešiče se liší v posledních číslicích: EPANET používá zaokrouhlenou hodnotu tíhového zrychlení, takže jeho místní ztráty jsou o málo nižší než v přesném tvaru.';
$ec_lang['lpn_engine_loading']='Načítání řešiče EPANET…';
$ec_lang['lpn_engine_failed']='Řešič EPANET se nepodařilo načíst. Místo něj se zobrazuje vestavěný řešič.';
$ec_lang['lpn_engine_failed_why']='{reason} Místo něj se zobrazuje vestavěný řešič.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_unit_unknown']='Tento výkres uvádí jednotku, kterou tato stránka nepodporuje: {unit}. Všechny hodnoty jsou zachovány a zobrazeny přesně tak, jak byly importovány, a nic nebylo změněno. Nic nelze vypočítat, dokud jednotka není podporována, protože její převodní činitel není znám.';
$ec_lang['lpn_engine_manning_note']='Poznámka: u drsnosti podle Manninga EPANET zaokrouhluje konstantu v Manningově rovnici, takže ztráta tlakové výšky je asi o 0,6 % nižší než v přesném tvaru.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='Řešič EPANET tuto síť odmítl, proto se výpočet nespustil.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='Zpráva řešiče EPANET: {message}';
$ec_lang['lpn_engine_refused_fallback']='Čísla na obrazovce místo toho pocházejí z vestavěného řešiče.';
// A run EPANET started and could not finish, for example when a tank empties and the junctions it
// fed have no other source (Error 110). {time} is the run time it stopped at, H:MM.
$ec_lang['lpn_time_run_stopped']='Výpočet EPANET se zastavil v čase {time}, proto nemá žádné výsledky. Důvod uvádí jeho zpráva o výpočtu.';
$ec_lang['lpn_time_stat_stopped']='{statistic} se nezobrazuje: výpočet se zastavil před koncem období.';
$ec_lang['lpn_time_stopped_no_quality']='Nebyly vypočteny žádné výsledky kvality vody, protože analýza kvality začíná až po skončení hydraulického výpočtu.';
$ec_lang['lpn_energy_stopped']='Výpočet EPANET se zastavil před koncem období, proto nebyly vypočteny žádné výsledky energie čerpadel.';
$ec_lang['lpn_time_run_stopped_kept']='Výpočet EPANET se zastavil v čase {time}. Výsledky sahají do {solved}, posledního vyřešeného období, a po něm se žádné nezobrazují. Důvod uvádí jeho zpráva o výpočtu.';
// Why a stopped run stopped, read from EPANET's own run report (R-402). {link} is the link EPANET
// had just closed, {tank} the tank at one end of it, {nodes} the ids of the nodes EPANET then could
// not solve for, comma-separated. Follows lpn_time_run_stopped or lpn_time_run_stopped_kept.
$ec_lang['lpn_time_run_cut_off']='EPANET uzavřel {link} a poté nedokázal vyřešit {nodes}.';
$ec_lang['lpn_time_run_cut_off_full']='Nádrž {tank} byla plná, a proto EPANET uzavřel {link}, aby do ní nepřitékala voda, a poté nedokázal vyřešit {nodes}. K tomu může dojít, když z plné nádrže nic neodtéká, například když jsou všechny odběry nulové. Odběr o něco větší než nula nebo hladina nádrže o něco pod jejím maximem tomu zabrání.';
$ec_lang['lpn_time_run_cut_off_empty']='Nádrž {tank} byla prázdná, a proto EPANET uzavřel {link}, aby se dále nevyprazdňovala, a poté nedokázal vyřešit {nodes}.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Čísla na obrazovce místo toho pocházejí z vestavěného řešiče. Ten řeší vždy jen jeden okamžik, proto je to síť pouze v čase {time}, s každou nádrží na její počáteční hladině.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Tato pravidla pojmenovávají prvek, který už v tomto projektu není, takže byla vynechána: {ids}';
$ec_lang['lpn_control_unreadable_note']='Tato pravidla se nepodařilo přečíst, takže byla vynechána: {ids}';
$ec_lang['lpn_control_inactive_note']='Tato řídicí pravidla odkazují na prvek, který je v tomto scénáři neaktivní, a proto se při jeho výpočtu ignorují: {ids}';
$ec_lang['lpn_rule_inactive_note']='Tato pravidla odkazují na prvek, který je v tomto scénáři neaktivní, a proto se při jeho výpočtu ignorují: {ids}';
$ec_lang['lpn_rule_dangling_note']='Tato pravidla odkazují na prvek, který už v tomto projektu není, takže byla při tomto výpočtu ignorována: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Tato pravidla nešlo přečíst, takže byla při tomto výpočtu ignorována: {ids}';
$ec_lang['lpn_settings_text_size']='Velikost textu (v pixelech)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Velikost symbolu (v pixelech)';
$ec_lang['lpn_settings_link_width']='Šířka čáry potrubí (v pixelech)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Šipky směru průtoku';
$ec_lang['lpn_settings_show_arrows_tip']='Nakreslí na každé potrubí šipku ukazující směr proudění vody. Šipky se zobrazí po výpočtu a jejich vypnutí výsledky nemění.';
$ec_lang['lpn_settings_align_labels']='Zarovnat popisky potrubí s potrubím';
$ec_lang['lpn_settings_readability_bias']='Otočit popisek vzhůru nohama, když je nakloněný o víc než tolik stupňů vlevo od svislice';
$ec_lang['lpn_settings_readability_bias_tip']='Otočí popisek, aby zůstal čitelný vzhůru, když je nakloněný o víc než tolik stupňů vlevo od svislice.';
$ec_lang['lpn_settings_mask_labels']='Plné pozadí za popisky';
$ec_lang['lpn_settings_text_halo']='Šířka obrysu textu (procenta velikosti textu)';
$ec_lang['lpn_settings_text_halo_tip']='Šířka plného obrysu za textem na mapě v procentech velikosti textu. Platí, je-li zapnuto Plné pozadí za popisky.';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Přichytávat vodicí čáry k nastaveným úhlům';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Zobrazovat popisky při tomto přiblížení mapy nebo blíže';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Popisky se kreslí pouze tehdy, je-li pohled na mapu tak široký nebo užší. Ponecháte-li pole prázdné, kreslí se při každém přiblížení. Zadáním 0 se popisek nekreslí nikdy, při žádném přiblížení.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Vždy zobrazovat';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap_sentence']='Zabránit uzlům růst větším než {n} násobek délky {p} percentilního potrubí';
$ec_lang['lpn_settings_symbol_cap_tip']='Uzly přestanou udržovat svou velikost na obrazovce, jakmile by jejich průměr na mapě byl tolikrát větší než délka potrubí na tomto percentilu ze všech délek potrubí v síti. Za tímto bodem na mapě se uzly, potrubí a další symboly při oddalování na obrazovce zmenšují. Výjimkou jsou zdroje a nádrže, které si při každém přiblížení ponechávají velikost na obrazovce.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Krytí symbolu (0 až 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Krytí podkladového obrázku (0 až 1)';
// Task 617: a display-time filter on the street or satellite tiles only; the drawing and the credit are untouched.
$ec_lang['lpn_settings_basemap_style']='Styl podkladové mapy';
$ec_lang['lpn_basemap_style_normal']='Normální';
$ec_lang['lpn_basemap_style_muted']='Tlumený';
$ec_lang['lpn_basemap_style_faded']='Vybledlý';
$ec_lang['lpn_basemap_style_grayscale']='Odstíny šedi';
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
$ec_lang['lpn_settings_legend_position']='Umístění legendy popisků';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Žádná';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Vypnuto';
$ec_lang['lpn_settings_legend_top_left']='Vlevo nahoře';
$ec_lang['lpn_settings_legend_top_right']='Vpravo nahoře';
$ec_lang['lpn_settings_legend_middle_left']='Vlevo uprostřed';
$ec_lang['lpn_settings_legend_middle_right']='Vpravo uprostřed';
$ec_lang['lpn_settings_legend_bottom_left']='Vlevo dole';
$ec_lang['lpn_settings_legend_bottom_right']='Vpravo dole';
$ec_lang['lpn_settings_color_node_field']='Barva uzlu';
$ec_lang['lpn_settings_color_link_field']='Barva potrubí';
$ec_lang['lpn_settings_color_ramp']='Barevné schéma';
$ec_lang['lpn_settings_color_credits']='Zdroje';
$ec_lang['lpn_color_ramp_epanet']='Modrá až červená (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Fialová až žlutá (snazší rozeznání jednotlivých barev)';
$ec_lang['lpn_color_ramp_gray']='Světle až tmavě šedá';
$ec_lang['lpn_settings_color_reverse']='Obrátit pořadí barev';
$ec_lang['lpn_color_none']='Bez barvy';
$ec_lang['lpn_settings_color_key_position']='Umístění barevné legendy';
$ec_lang['lpn_settings_color_breaks']='Hranice barevných pásem';
$ec_lang['lpn_settings_color_equal_intervals']='Stejné intervaly';
$ec_lang['lpn_settings_color_equal_counts']='Stejné počty';
$ec_lang['lpn_settings_color_no_values']='Zatím nejsou k dispozici žádné hodnoty. Nejprve vyřešte síť.';
$ec_lang['lpn_confirm_restore_defaults']='Obnovit všechna nastavení (předpony ID, počáteční hodnoty, nastavení řešiče, vzhled mapy, umístění legendy a zobrazené popisky) na jejich původní hodnoty? Síť se nemění. Nastavení patří k otevřenému projektu, takže ostatní projekty nejsou dotčeny.';
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
$ec_lang['lpn_settings_wipe_btn']='Začít znovu';
$ec_lang['lpn_confirm_wipe']='Začít znovu a smazat ÚPLNĚ VŠE uložené pro tuto stránku: každý projekt, každý podkladový obrázek, všechna nastavení a vaši volbu jednotek? Stránka se znovu načte přesně tak, jak by ji viděl úplně nový návštěvník. Tuto akci nelze vrátit zpět.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Zkopírujte tento odkaz:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Čas';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Celková doba běhu';
$ec_lang['lpn_time_hyd_step']='Hydraulický časový krok';
$ec_lang['lpn_time_pattern_step']='Časový krok vzorce';
$ec_lang['lpn_time_pattern_start']='Počáteční čas vzorce';
$ec_lang['lpn_time_report_step']='Časový krok výstupu';
$ec_lang['lpn_time_report_start']='Počáteční čas výstupu';
$ec_lang['lpn_time_clock_start']='Čas na hodinách na začátku';
$ec_lang['lpn_time_statistic']='Statistika';
$ec_lang['lpn_time_stat_none']='Žádná';
$ec_lang['lpn_time_stat_averaged']='Prům.';
$ec_lang['lpn_time_stat_minimum']='Min.';
$ec_lang['lpn_time_stat_maximum']='Max.';
$ec_lang['lpn_time_stat_range']='Rozpětí';
$ec_lang['lpn_time_clock_day']='Den {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Zapište čas jako hodiny a minuty, například 2:30. Prosté číslo znamená hodiny, takže 8 je osm hodin. Půl hodiny je 0:30.';
$ec_lang['lpn_time_running']='Probíhá simulace s časovým průběhem.';
$ec_lang['lpn_time_no_engine']='Vestavěný řešič řeší vždy jen jeden okamžik, proto je to síť pouze v čase {time}: každý vzorec se čte v tomto okamžiku a každá nádrž zůstává na své počáteční hladině, místo aby se plnila a vyprazdňovala. Jednorázovým připojením k internetu stáhnete řešič EPANET, který provede simulaci s časovým průběhem.';
// lpn_time_no_engine says "connect to the internet", which is true only offline. For the other causes
// of a failed extended period run the same note ends in {reason}, one of the three sentences below.
$ec_lang['lpn_time_no_engine_why']='Vestavěný řešič řeší vždy jen jeden okamžik, proto je to síť pouze v čase {time}: každý vzorec se čte v tomto okamžiku a každá nádrž zůstává na své počáteční hladině, místo aby se plnila a vyprazdňovala. {reason}';
$ec_lang['lpn_time_engine_fetch_failed']='Stažení řešiče EPANET se nezdařilo. Načtěte stránku znovu a zkuste to znovu; může jej blokovat brána firewall, proxy server nebo rozšíření prohlížeče.';
$ec_lang['lpn_time_engine_start_failed']='Prohlížeč odmítl řešič EPANET spustit. WebAssembly může být vypnuto bezpečnostním nastavením nebo rozšířením.';
$ec_lang['lpn_time_engine_run_failed']='Výpočet EPANET selhal. Jde o chybu této stránky; nahlaste ji pomocí odkazu {wrong}.';
$ec_lang['lpn_time_slider']='Uplynulý čas simulace';
$ec_lang['lpn_time_no_period']='Tento projekt nemá nastavené časové období, takže je k zobrazení jen jeden okamžik. Nastavte Celkovou dobu běhu v Nastavení, Výpočet, Čas, aby síť počítala časové období.';
$ec_lang['lpn_time_first']='Přejít na začátek';
$ec_lang['lpn_time_prev']='Krok zpět';
$ec_lang['lpn_time_play']='Přehrát';
$ec_lang['lpn_time_play_tip']='Přehrát animaci';
$ec_lang['lpn_time_pause_tip']='Pozastavit animaci';
$ec_lang['lpn_time_pause']='Pozastavit';
$ec_lang['lpn_time_next']='Krok vpřed';
$ec_lang['lpn_time_last']='Přejít na konec';
$ec_lang['lpn_time_tank']='Nádrž';
$ec_lang['lpn_time_level']='Hladina vody';
$ec_lang['lpn_time_run']='Vypočítat';
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
$ec_lang['lpn_time_run_done']='Výpočet dokončen. Časy hlášení: {frames}. Doba trvání: {secs} s.';
$ec_lang['lpn_time_runbox_hide']='Toto okno už nezobrazovat';
$ec_lang['lpn_settings_runbox']='Zobrazit okno průběhu výpočtu';
$ec_lang['lpn_settings_runbox_tip']='Okno, které hlásí průběh a výsledek výpočtu. Je-li vypnuté, dokončený výpočet místo toho několik sekund hlásí totéž ve stavovém řádku. Je to nastavení tohoto prohlížeče, nikoli projektu.';
$ec_lang['lpn_time_run_failed']='Výpočet se nedokončil, takže pro pozdější časy nejsou žádné výsledky.';
$ec_lang['lpn_time_run_report']='Zpráva o výpočtu';
$ec_lang['lpn_time_run_report_copy']='Kopírovat';
$ec_lang['lpn_time_run_report_copied']='Zkopírováno';
$ec_lang['lpn_time_run_report_tip']='Zpráva, kterou EPANET zapsal o posledním výpočtu, doslovně: zda dosáhl konvergence a případná varování. Text vytváří řešič EPANET, nikoli tato stránka.';

$ec_lang['lpn_time_speed']='Rychlost přehrávání';
$ec_lang['lpn_time_speed_tip']='Rychlost přehrávání';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Hledat v nastavení';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Zadejte slovo nebo více slov a zobrazí se nastavení, která zmiňují všechna z nich.';
$ec_lang['lpn_settings_no_match']='Žádné nastavení toto slovo neobsahuje.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Šířka seznamu v okně Nastavení';
$ec_lang['lpn_rpane_empty']='Zatím zde nic není ukotveno. Vše, co patří celému projektu, najdete v Nastavení.';
$ec_lang['lpn_time_settings_open']='Nastavení času';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Vizualizace';
$ec_lang['lpn_settings_sec_assets']='Prvky';
$ec_lang['lpn_settings_sec_calculation']='Výpočet';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Odběratel';
$ec_lang['lpn_labels_customer_note']='Popisek odběratele zobrazuje zde zvolené hodnoty. Kreslí se stejnou velikostí textu jako každý jiný popisek na mapě.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Popisky odběratelů se kreslí pouze tehdy, je-li pohled na mapu tak široký nebo užší. Ponecháte-li pole prázdné, kreslí se při každém přiblížení. Zadáním 0 se popisek odběratele nekreslí nikdy, při žádném přiblížení. Nemá žádný účinek, je-li větší než podobné nastavení pro všechny popisky.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Použít aktuální pohled';
$ec_lang['lpn_settings_page']='Stránka';
$ec_lang['lpn_saved_project']='Uloženo s projektem';
$ec_lang['lpn_saved_browser']='Uloženo v tomto prohlížeči';
$ec_lang['lpn_saved_session']='Neuloženo';
$ec_lang['lpn_settings_hydraulics']='Hydraulika';
$ec_lang['lpn_settings_quality']='Kvalita vody';
$ec_lang['lpn_settings_quality_track']='Sledovaný parametr kvality';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Zvolte, co má výpočet sledovat v potrubích: jak dlouho je voda v systému, odkud pochází, nebo chemickou látku, která při cestě reaguje. Koeficienty potřebuje jen chemická látka.';
$ec_lang['lpn_settings_quality_source']='Sledovaný uzel';
$ec_lang['lpn_settings_quality_source_tip']='Uzel, jehož voda se sleduje. Každý ostatní uzel pak ukazuje podíl své vody, který pochází z tohoto uzlu.';
$ec_lang['lpn_quality_none']='Nic';
$ec_lang['lpn_quality_trace']='Sledování původu';
$ec_lang['lpn_quality_chemical']='Chemická látka, která reaguje';
$ec_lang['lpn_quality_needs_run']='Kvalita vody se přenáší podél potrubí v čase, takže potřebuje řešič EPANET a celkovou dobu běhu. Nastavte Celkovou dobu běhu v části Čas, poté stiskněte tlačítko Vypočítat.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Chemická látka a jednotky';
$ec_lang['lpn_quality_chemical_name_tip']='Sledovaná chemická látka, například Chlor. Ponecháte-li pole prázdné, použije se výchozí popisek programu EPANET, Chemical. Zobrazuje se v sestavách, ale ve výpočtech se nepoužívá.';
$ec_lang['lpn_quality_mass_units']='Jednotky hmotnosti';
$ec_lang['lpn_quality_mass_units_tip']='Jednotková část záznamu kvality, ze dvou voleb programu EPANET.';
$ec_lang['lpn_quality_unit_ug']='µg/l';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Tolerance kvality';
$ec_lang['lpn_quality_tolerance_tip']='Rozdíl koncentrace, pod nímž EPANET považuje dva sousedící objemy vody za jeden. Prázdné pole použije výchozí hodnotu EPANET 0,01.';
$ec_lang['lpn_quality_diffusivity']='Relativní difuzivita';
$ec_lang['lpn_quality_diffusivity_tip']='Difuzivita chemické látky ve vodě, relativně k chloru. Prázdné pole použije výchozí hodnotu EPANET 1,0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Koncentrace {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Průměrná koncentrace {chemical}';
$ec_lang['lpn_quality_initial']='Počáteční kvalita';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Množství chemické látky v tomto uzlu na začátku výpočtu. Dávkování si tuto hodnotu ponechává po celý výpočet, což je obvyklý způsob, jakým se udává zbytková koncentrace opouštějící úpravnu vody. Prázdné pole znamená 0.';
$ec_lang['lpn_result_concentration']='Koncentrace';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Množství chemické látky zbývající v tomto bodě po transportu a reakci. Jednotky jsou ty, které byly zadány spolu s názvem chemické látky v Nastavení, Výpočet, Kvalita.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Typ dávkování';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Jaký druh dávky tento uzel přidává do vody, která jím prochází. Koncentrace bere vodu vstupující zde do sítě, jako by měla hodnotu Kvalita dávkování. Hmotnostní dávkovač přidává hmotnost chemické látky každou minutu, ať je průtok jakýkoli. Dávkovač na mezní hodnotu zvýší koncentraci opouštějící tento uzel na hodnotu Kvalita dávkování, a ne výš. Dávkovač úměrný průtoku přidá hodnotu Kvalita dávkování k tomu, co už ve vodě je.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Žádný';
$ec_lang['lpn_source_type_concen']='Koncentrace';
$ec_lang['lpn_source_type_mass']='Hmotnostní dávkovač';
$ec_lang['lpn_source_type_setpoint']='Dávkovač na mezní hodnotu';
$ec_lang['lpn_source_type_flowpaced']='Dávkovač úměrný průtoku';
$ec_lang['lpn_source_quality']='Kvalita dávkování';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Síla dávky. U všech typů kromě hmotnostního dávkovače je to koncentrace v jednotkách uvedených u chemické látky v Nastavení, Výpočet, Kvalita; u hmotnostního dávkovače je to hmotnostní průtok za minutu. Prázdné pole znamená žádné dávkování chemické látky, funkčně rovnocenné 0.';
$ec_lang['lpn_source_pattern']='Vzorec dávkování';
$ec_lang['lpn_source_pattern_tip']='Časový vzorec, který v průběhu výpočtu škáluje dávku, pro dávkování, které není konstantní. Žádný vzorec znamená, že dávka je stejná v každém kroku.';
$ec_lang['lpn_mixing_model']='Model mísení';
$ec_lang['lpn_mixing_model_tip']='Model toho, jak se voda již přítomná v této nádrži mísí s přítokem. Úplné míšení okamžitě promíchá celý přítok s celým objemem nádrže. Dvoukomorové míšení nejprve plní vstupní zónu a přebytek předává do hlavní zóny. Pístový tok FIFO vypouští vodu v pořadí, v jakém přitekla. Pístový tok LIFO ji vrství, takže voda, která přitekla poslední, odtéká první. Volba ovlivňuje stáří vody a zbytkovou koncentraci, nikoli tlak ani průtok.';
$ec_lang['lpn_mixing_mixed']='Úplné mísení';
$ec_lang['lpn_mixing_2comp']='Dvoukomorové mísení';
$ec_lang['lpn_mixing_fifo']='Pístový tok FIFO';
$ec_lang['lpn_mixing_lifo']='Pístový tok LIFO';
$ec_lang['lpn_mixing_fraction']='Podíl mísení';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Podíl objemu nádrže, který zabírá vstupní zóna, mezi 0 a 1. Používá jej pouze dvoukomorové mísení. Ponechte prázdné a vstupní zónou je celá nádrž, což je to, co předpokládá EPANET.';
$ec_lang['lpn_reaction_bulk']='Koeficient objemové reakce';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Reakce v objemu vody (viz nápověda programu EPANET), použitá pro každé potrubí a nádrž, které nemají individuální koeficient. Záporné číslo chemickou látku rozkládá a kladné ji zvyšuje. Prázdné pole znamená žádnou objemovou reakci.';
$ec_lang['lpn_reaction_wall']='Koeficient stěnové reakce';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Reakce na stěně potrubí, použitá pro každé potrubí, které nemá vlastní. Záporné číslo chemickou látku rozkládá. Reakce je prvního řádu, pokud importovaný soubor EPANET neuvádí jiný řád, takže koeficient je délka za den, zapsaná v jednotce délky používané projektem. Prázdné pole znamená žádnou stěnovou reakci.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Toto potrubí samostatně. Ponechte prázdné a potrubí použije koeficient nastavený pro celou síť v Nastavení, Kvalita vody.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Koeficient reakce';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Reakce ve vodě v této nádrži jako rychlost v 1/den. Záporné číslo chemickou látku rozkládá a kladné ji zvyšuje. Voda stojí v nádrži mnohem déle než v kterémkoli potrubí, takže právě zde se zbytková koncentrace často ztrácí. Prázdné pole znamená použití koeficientu objemové reakce nastaveného pro celou síť v Nastavení, Výpočet, Kvalita.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Objemová reakce';
$ec_lang['lpn_reaction_wall_short']='Stěnová reakce';
$ec_lang['lpn_reaction_tank_short']='Reakce';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/den';
$ec_lang['lpn_reaction_day']='den';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Řád objemové reakce';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='Exponent, na který se umocňuje koncentrace při reakci v tělese vody. Je povoleno libovolné reálné číslo. Výchozí hodnota je 1 a používá se pro většinu modelování úbytku chlóru. 0 znamená, že rychlost reakce nezávisí na tom, kolik chemikálie je přítomno.';
$ec_lang['lpn_reaction_order_tank']='Řád reakce v nádrži';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='Exponent, na který se umocňuje koncentrace při reakci ve vodě v nádrži, oddělený od řádu objemové reakce, takže nádrž může reagovat v jiném řádu než potrubí. Je povoleno libovolné reálné číslo, výchozí je 1. EPANET jej v souboru uvádí jako ORDER TANK a v rozhraní programu EPANET pro něj není žádný vstup.';
$ec_lang['lpn_reaction_order_wall']='Řád stěnové reakce';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 znamená, že ke stěnové reakci dochází podle zadaného koeficientu (koeficientů). 0 znamená, že k ní nedochází. Jde o přepínač zapnuto/vypnuto. Výchozí hodnota je 1.';
$ec_lang['lpn_reaction_order_unstated']='Neuvedeno';
$ec_lang['lpn_reaction_order_zero']='0, nultý řád';
$ec_lang['lpn_reaction_order_first']='1, první řád';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Limitní potenciál';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Koncentrace, ke které se chemikálie blíží, místo aby se rozpadla na nulu nebo neomezeně rostla. Reakce se zpomaluje, jak se voda k této hodnotě přibližuje, a u ní se zastaví. Používejte konzistentní jednotky. Pokud je pole prázdné, limit není nastaven.';
$ec_lang['lpn_reaction_rough_corr']='Korelace s drsností';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Činitel, který vztahuje koeficient stěnové reakce k drsnosti každého potrubí, takže drsnější potrubí reaguje rychleji. Je-li nastaven, vypočte se koeficient stěnové reakce pro každé potrubí z jeho drsnosti a jediný koeficient stěnové reakce výše se nepoužije. Je-li pole prázdné, nepoužije se.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Tato stránka nenabízí žádný vlastní koeficient reakce. Pro něj neexistuje žádná standardní zkouška a publikované terénní hodnoty pro stejný druh vody se liší až desetinásobně, takže číslo uvedené zde by bylo čteno jako doporučení. Zadejte hodnotu, kterou jste naměřili nebo kterou můžete doložit citací, nebo pole ponechte prázdná u chemické látky, která nereaguje.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Energie';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Sestavy';
// Edited by TGH 2026-09-07
// Row label only (the box title is lpn_time_run_report). Tom, 2026-10-07: no row carries '(EPANET)';
// the tips say where a report comes from. Run is EPANET's verbatim report.
$ec_lang['lpn_reports_epanet']='Výpočet';
$ec_lang['lpn_energy_title']='Energie čerpadel: sestava';
$ec_lang['lpn_energy_menu']='Energie čerpadel';
$ec_lang['lpn_energy_efficiency']='Účinnost čerpadla (procenta)';
$ec_lang['lpn_energy_efficiency_tip']='Celková účinnost (od přívodu elektřiny po vodu) použitá pro každé čerpadlo, které nemá křivku účinnosti. Není-li uvedena žádná hodnota, EPANET používá 75 procent.';
$ec_lang['lpn_energy_price']='Cena elektřiny';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Cena jedné kilowatthodiny. Platí pro každé čerpadlo, které nemá individuální cenu. Prázdné pole znamená 0.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Cena jedné kilowatthodiny u tohoto čerpadla. Prázdné pole znamená použití ceny nastavené pro celou síť v Nastavení, Energie.';
$ec_lang['lpn_energy_price_pattern']='Vzorec ceny';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Vzorec, který v každém svém kroku násobí cenu, což je způsob, jak zadat mimošpičkovou sazbu. Ponechte prázdné pro jednu cenu po celý výpočet.';
$ec_lang['lpn_energy_demand_charge']='Poplatek za špičkový odběr';
$ec_lang['lpn_energy_demand_charge_tip']='Za kW, za špičkové zatížení požadované čerpadly';
$ec_lang['lpn_energy_currency']='Měna';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Text vytištěný vedle každé hodnoty nákladů. Jde pouze o popisek; používejte jednu měnu v celém projektu.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Tato stránka nenabízí žádnou vlastní cenu. Cena elektřiny závisí na provozovateli, zemi, hodině a roce, takže číslo uvedené zde by bylo čteno jako doporučení. Zadejte cenu z vlastního tarifu.';
$ec_lang['lpn_energy_needs_run']='Energie čerpadel je příkon integrovaný přes celý výpočet, takže potřebuje časové období: řešič EPANET a celkovou dobu běhu. Nastavte Celkovou dobu běhu v Nastavení, Výpočet, Čas, stiskněte tlačítko Vypočítat a poté otevřete Voda, Sestavy, Energie čerpadel.';
$ec_lang['lpn_energy_no_pumps']='Tato síť nemá žádná čerpadla, takže nic neodebírá elektřinu.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Porovnání scénářů';
$ec_lang['lpn_scncmp_menu_tip']='Tabulka scénářů s počtem specifických hodnot, nejnižším tlakem a nejvyšší rychlostí';
$ec_lang['lpn_scncmp_running']='Počítají se všechny scénáře…';
$ec_lang['lpn_scncmp_empty']='Zatím nic nebylo nakresleno, takže není co počítat.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Nejvyšší rychlost';
$ec_lang['lpn_scncmp_at']='{value} u {id}';
$ec_lang['lpn_scncmp_at_time']='{value} v {id}, {time}';
$ec_lang['lpn_scncmp_same']='Ve všech scénářích stejné';
$ec_lang['lpn_scncmp_period_note']='Má-li scénář celkovou dobu běhu, jeho nejnižší tlak a nejvyšší rychlost jsou extrémy celé sítě v uvedeném čase.';
$ec_lang['lpn_scncmp_current']='(právě otevřený)';
$ec_lang['lpn_scncmp_note']='Každý scénář se počítá z kopie kresby. Nic zde projekt nemění a scénář, na kterém právě pracujete, zůstává tak, jak byl.';
$ec_lang['lpn_energy_over']='Pro časové období v délce {time}';
$ec_lang['lpn_energy_col_pump']='Čerpadlo';
$ec_lang['lpn_energy_col_running']='% výpočtu';
$ec_lang['lpn_energy_col_effic']='Účinn.';
$ec_lang['lpn_energy_col_avg_kw']='Prům. kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='Průměrný příkon, když toto čerpadlo běželo. Nezprůměrňuje se přes doby nečinnosti, takže čerpadlo, které bylo většinu časového období mimo provoz, přesto vykáže příkon, který mělo, když běželo.';
$ec_lang['lpn_energy_col_peak_kw']='Špičkové kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Náklady';
$ec_lang['lpn_energy_total_kwh']='Spotřebovaná energie';
$ec_lang['lpn_energy_total_energy_cost']='Náklady na energii';
$ec_lang['lpn_energy_peak_kw']='Špičkový odběr výkonu';
$ec_lang['lpn_energy_total_demand_charge']='Poplatek za špičkový odběr';
$ec_lang['lpn_energy_total_cost']='Celkové náklady';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW AND THE BOX TITLE BOTH SAY "Status changes"** (Tom, 2026-10-07), so menu and box agree.
$ec_lang['lpn_reports_status']='Změny stavu';
$ec_lang['lpn_reports_status_tip']='Chronologická tabulka změn stavu načtených z časových kroků EPANET poslední simulace s časovým průběhem: čerpadla a ventily se otevírají nebo zavírají, nádrže se plní, vyprazdňují, naplní se nebo vyschnou, a kroky, které plně nedosáhly konvergence.';
$ec_lang['lpn_status_title']='Změny stavu';
$ec_lang['lpn_status_needs_run']='Sestava změn stavu uvádí, co se změnilo během simulace s časovým průběhem. Nastavte Celkovou dobu běhu v Nastavení, Výpočet, Čas, stiskněte Vypočítat a poté otevřete Voda, Sestavy, Změny stavu.';
$ec_lang['lpn_status_empty']='Během tohoto běhu se stav ničeho nezměnil.';
$ec_lang['lpn_status_col_event']='Událost';
$ec_lang['lpn_status_opened']='{type} {id}: nyní otevřeno';
$ec_lang['lpn_status_closed']='{type} {id}: nyní zavřeno';
$ec_lang['lpn_status_filling']='{type} {id}: nyní se plní';
$ec_lang['lpn_status_emptying']='{type} {id}: nyní se vyprazdňuje';
$ec_lang['lpn_status_full']='{type} {id}: nyní plno';
$ec_lang['lpn_status_dry']='{type} {id}: nyní prázdno';
$ec_lang['lpn_status_no_converge']='Hydraulické řešení v tomto kroku se plně nepodařilo dopočítat; zobrazená čísla jsou z jeho poslední iterace.';
$ec_lang['lpn_status_note']='Čteno ze stejného běhu s časovým průběhem jako panel Tabulky a Úplná sestava. Uvedena je pouze změna, ne každý krok.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Úplná';
$ec_lang['lpn_reports_full_tip']='Tabulka všech uzlů a spojů při každém vykazovaném časovém kroku posledního výpočtu';
$ec_lang['lpn_full_title']='Úplná sestava';
$ec_lang['lpn_full_needs_run']='Úplná sestava uvádí každý uzel a každý spoj při každém kroku hlášení. Stiskněte Vypočítat, a poté otevřete Voda, Sestavy, Úplná sestava.';
$ec_lang['lpn_full_note']='Jeden řádek na uzel nebo spoj a krok hlášení, v jednotkách zobrazených na panelu Tabulky. Prázdná buňka je sloupec, který tato veličina nemá. Stažení nebo tisk obsahuje každý časový krok; tabulka níže zobrazuje vždy jeden.';
$ec_lang['lpn_full_step_label']='Časový krok';
$ec_lang['lpn_full_download_csv']='Stáhnout CSV';
$ec_lang['lpn_full_print']='Vytisknout sestavu';
$ec_lang['lpn_full_col_time']='Čas';
$ec_lang['lpn_full_col_type']='Typ';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_heading_unit']='{label} ({unit})';
$ec_lang['lpn_result_concentration_short']='Koncentrace';
$ec_lang['lpn_quality_named_concentration_short']='Koncentrace {chemical}';
$ec_lang['lpn_full_row_count']='Řádky ({n}).';

// ---- The Calibration report (ROADMAP Task 601) -------------------------------------------------
// EPANET's Report > Calibration and its three tabbed pages, with EPANET's own column names (EPANET
// 2.2 manual, section 9.6). Mean error is EPANET's term for the mean ABSOLUTE difference. "Num obs"
// is EPANET's own column heading, kept short because results columns are narrow.
// lpn_calib_missing: keep in step with feat/profile-file's lpn_profile_file_missing (Task 604), the same sentence.
$ec_lang['lpn_reports_calib']='Kalibrace';
$ec_lang['lpn_reports_calib_tip']='Porovná naměřená terénní data z kalibračního souboru s posledním výpočtem: statistiky, korelační graf a porovnání průměrů.';
$ec_lang['lpn_calib_title']='Kalibrace: sestava';
$ec_lang['lpn_calib_param']='Veličina';
$ec_lang['lpn_calib_param_tip']='Veličina, kterou kalibrační soubor měří. Pro každou veličinu se drží jeden soubor.';
$ec_lang['lpn_calib_load']='Načíst kalibrační soubor…';
$ec_lang['lpn_calib_load_tip']='Textový soubor s identifikátorem místa, časem a naměřenou hodnotou na každém řádku. Čas se měří od začátku simulace, v desetinných hodinách nebo ve formátu hodiny:minuty. Středník zahajuje komentář. Řádek jen s časem a hodnotou patří k místu uvedenému výše.';
$ec_lang['lpn_calib_none']='Pro tuto veličinu není načten žádný kalibrační soubor.';
$ec_lang['lpn_calib_session']='Kalibrační soubor se drží jen po dobu této relace. Neukládá se s projektem ani v tomto zařízení.';
$ec_lang['lpn_calib_file']='{file}: měření ({n}) v místech ({m}).';
$ec_lang['lpn_calib_units']='Hodnoty v souboru se čtou v jednotkách tohoto projektu: {unit}.';
$ec_lang['lpn_calib_missing']='Uvedeno v souboru, ale není v této síti: {ids}.';
$ec_lang['lpn_calib_missing_count']='Přeskočená měření, jejichž místo není v této síti: {n}.';
$ec_lang['lpn_calib_bad_lines']='Řádky, které nešlo přečíst, byly přeskočeny: {lines}';
$ec_lang['lpn_calib_outside']='Přeskočená měření mimo časy, které tento výpočet hlásil: {n}.';
$ec_lang['lpn_calib_no_value']='Přeskočená měření bez vypočtené hodnoty v jejich čase: {n}.';
$ec_lang['lpn_calib_single']='Toto je výpočet jednoho okamžiku, takže se každé měření porovnává s jediným výsledkem, bez ohledu na čas uvedený v souboru.';
$ec_lang['lpn_calib_needs_run']='Zatím nejsou výsledky k porovnání. Sestava se vyplní, jakmile je síť vypočítána.';
$ec_lang['lpn_calib_no_pairs']='Nebylo možné porovnat žádné měření, takže není co vykreslit.';
$ec_lang['lpn_calib_tab_stats']='Statistiky';
$ec_lang['lpn_calib_tab_corr']='Korelační graf';
$ec_lang['lpn_calib_tab_means']='Porovnání průměrů';
$ec_lang['lpn_calib_col_location']='Místo';
$ec_lang['lpn_calib_col_n']='Počet poz.';
$ec_lang['lpn_calib_col_obs_mean']='Naměřený průměr';
$ec_lang['lpn_calib_col_sim_mean']='Vypočtený průměr';
$ec_lang['lpn_calib_col_mean_err']='Střední chyba';
$ec_lang['lpn_calib_col_mean_err_tip']='Průměr absolutních rozdílů mezi každou naměřenou hodnotou a vypočtenou hodnotou ve stejném čase.';
$ec_lang['lpn_calib_col_rms_err']='Chyba RMS';
$ec_lang['lpn_calib_col_rms_err_tip']='Střední kvadratická chyba: druhá odmocnina z průměru druhých mocnin rozdílů mezi naměřenými a vypočtenými hodnotami.';
$ec_lang['lpn_calib_network']='Síť';
$ec_lang['lpn_calib_corr_means']='Korelace mezi průměry: {r}';
$ec_lang['lpn_calib_corr_none']='Korelace mezi průměry: potřebuje alespoň dvě místa, jejichž průměry se liší.';
$ec_lang['lpn_calib_axis_obs']='Naměřeno: {q}';
$ec_lang['lpn_calib_axis_sim']='Vypočteno: {q}';
$ec_lang['lpn_calib_observed']='Naměřeno';
$ec_lang['lpn_calib_computed']='Vypočteno';
$ec_lang['lpn_calib_point']='{id}, {time}: naměřeno {o}, vypočteno {s}';
$ec_lang['lpn_calib_corr_note']='Každý bod je jedno měření. Čím blíže leží body k úhlopříčce, tím lépe vypočtené hodnoty odpovídají naměřeným.';
$ec_lang['lpn_calib_ts_point']='Měřeno v {id}, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='Kroužky jsou naměřené hodnoty z kalibračního souboru.';
$ec_lang['lpn_energy_no_price']='Není uvedena žádná cena elektřiny, takže všechny náklady zde jsou nulové. Nastavte ji v Nastavení, Energie.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Tato síť uvádí nulovou cenu, takže všechny náklady zde jsou nulové. Změňte ji v Nastavení, Energie.';
$ec_lang['lpn_energy_curve_note']='Tato čerpadla odkazují na křivku účinnosti bez bodů: {ids}. Běžela s účinností nastavenou pro celou síť.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_drop']='Vynechat';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Uzel a spoj';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Stejné intervaly';
$ec_lang['lpn_color_mode_quantile']='Kvantily (stejný počet)';
$ec_lang['lpn_color_mode_jenks']='Přirozené hranice (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Směrodatná odchylka';
$ec_lang['lpn_color_mode_pretty']='Zaokrouhlené';
$ec_lang['lpn_color_mode_log']='Logaritmické';
$ec_lang['lpn_color_mode_manual']='Ruční';

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
$ec_lang['lpn_library_menu']='Knihovny';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Vzorce';
// **THE SYNONYMS ARE TOM'S OWN, GIVEN 2026-08-24**, which is the written permission this array
// requires. "Pattern" is the discipline's standard term and stays the label; the payload exists so
// a translator who cannot recover the concept from that one word has the shape of it.
//
// "Run" was on his list and he struck it the same day, on the collision: this page's Run is the
// button that plays an extended-period simulation back, so a translator reaching for their word for
// a program run would have named the wrong thing. Tom: *"Yes. It's not the best term."*
$ec_lang['lpn_library_patterns_tip']='Vzorec je seznam násobitelů, který se opakuje. Každý platí pro jeden časový krok vzorce, takže 24 čísel s krokem jedna hodina tvoří den, který se opakuje. Odběr 10 s násobitelem 1,5 je v daný okamžik 15.';
$ec_lang['lpn_library_curves']='Křivky';
$ec_lang['lpn_library_curves_tip']='Tlaková výška nebo účinnost čerpadla v závislosti na průtoku, ztráta ventilu v závislosti na průtoku nebo objem nádrže v závislosti na hloubce';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Křivky jsou přiřazeny čerpadlům a ventilům. U křivky tlakové výšky čerpadla výpočet používá křivku proloženou body tak, jak je zobrazena; u každého jiného druhu spojuje body přímými úsečkami tak, jak je zobrazeno.';
$ec_lang['lpn_library_curve_add']='Přidat křivku';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Druh křivky';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Rovnice';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='Křivka proložená body a čára vykreslená v grafu níže. Počítá se z bodů pokaždé, když se zobrazí, a nikdy se neukládá, a její čísla jsou v jednotkách, které ukazuje tabulka výše. Vestavěný řešič počítá s touto rovnicí; řešič EPANET čte přímo samotné body.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Vyberte v tabulkovém procesoru jeden nebo dva sloupce, zkopírujte je a vložte do první cílové buňky. Řádky se přidávají podle potřeby. Lze vložit i řádky zkopírované přímo ze souboru EPANET, včetně názvu křivky.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Popis';
$ec_lang['lpn_library_curve_remove_point']='Odebrat tento bod';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Kopírovat body';
$ec_lang['lpn_library_curve_copy_tip']='Zkopíruje každý bod jako dva sloupce, připravené k vložení do tabulkového procesoru.';
$ec_lang['lpn_library_curve_copy_manual']='Kopírovat tyto body';
$ec_lang['lpn_library_curve_used_by']='Prvky používající tuto křivku';
$ec_lang['lpn_library_curve_unused']='Tuto křivku nic nepoužívá.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Tuto křivku používají prvky ({count}): {ids}. Nejprve jim přiřaďte jinou křivku a poté tuto smažte.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Typy potrubí';
$ec_lang['lpn_library_pipetypes_tip']='Typ potrubí je definice, na kterou se může odkazovat několik potrubí kvůli svému průměru, drsnosti a reakčním koeficientům. Úprava definice upraví každé potrubí, které ji používá.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Každý projekt má samostatnou knihovnu typů potrubí. Vlastnosti v definici typu potrubí lze ponechat prázdné; například typ potrubí může určovat drsnost a žádný průměr. Typy potrubí se potrubím přiřazují ve vlastnostech potrubí. Úprava definice zde změní každé potrubí, které se na ni odkazuje.';
$ec_lang['lpn_library_pipetype_add']='Přidat typ potrubí';
$ec_lang['lpn_library_pipetype_blank_tip']='Prázdné vlastnosti v definici typu potrubí zůstávají k individuálnímu zadání u každého potrubí.';
$ec_lang['lpn_library_pipetype_used_by']='Potrubí používající tento typ';
$ec_lang['lpn_library_pipetype_unused']='Tento typ potrubí nepoužívá nic.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Tento typ potrubí používají potrubí ({count}): {ids}. Před smazáním jej od nich odpojte.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Typ potrubí';
$ec_lang['lpn_field_pipetype_tip']='Typ potrubí z knihovny projektu, který toto potrubí používá. Vlastnosti obsažené v typu potrubí zde nelze upravovat. Odpojením typu potrubí zde úpravu povolíte.';
$ec_lang['lpn_pipetype_none']='Není zvolen žádný typ potrubí';
$ec_lang['lpn_pipetype_detach']='Odpojit od typu potrubí';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Zkopíruje hodnoty, které toto potrubí čte ze svého typu, přímo do potrubí a přestane typ používat. Hodnoty potrubí se nyní nemění a od této chvíle se tyto hodnoty upravují zde.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Armatury';
$ec_lang['lpn_library_fittings_tip']='Armatury s koeficienty místní ztráty seskupené do seznamů';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Každý projekt má samostatnou knihovnu armatur. Seznam armatur obsahuje armatury s počtem u každé z nich a sčítá se do jediného koeficientu místní ztráty. Na seznam se mohou odkazovat potrubí i typy potrubí.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Zde nabízených armatur je třináct z tabulky 3.3 uživatelské příručky EPANET 2.2. Výběrem se jejich koeficient zkopíruje do řádku, kde jej lze změnit. Koeficient závisí na velikosti a provedení armatury, proto berte tabulku jako výchozí bod, nikoli jako konečné hodnoty.';
$ec_lang['lpn_library_fittings_add']='Přidat seznam armatur';
$ec_lang['lpn_library_fittings_used_by']='Potrubí používající tento seznam armatur';
$ec_lang['lpn_library_fittings_unused']='Tento seznam armatur nepoužívá nic.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Tento seznam armatur používají potrubí ({count}): {ids}. Před smazáním jej od nich odpojte.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Importovat knihovny…';
$ec_lang['lpn_library_import_tip']='Zvolte jiný soubor projektu a zkopírujte z něj do tohoto projektu celé knihovny. Cokoli, jehož název je zde už použit, se přeskočí a uvede v seznamu, takže se nic, co už máte, nezmění.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Zvolte, co zkopírovat ze souboru {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Každá knihovna, kterou zaškrtnete, se zkopíruje celá. Co nechcete, poté smažte stejně jako kteroukoli jinou položku.';
$ec_lang['lpn_library_import_go']='Importovat';
$ec_lang['lpn_library_import_no_libraries']='Ten soubor projektu nemá žádné knihovny ke zkopírování.';
$ec_lang['lpn_library_import_heading']='Importováno ze souboru {file}';
$ec_lang['lpn_library_import_added']='Zkopírováno: {names}';
$ec_lang['lpn_library_import_conflict']='Přeskočeno, protože tento projekt už má položku se stejným názvem: {names}. Zde se nic nezměnilo. Přejmenujte jednu z nich a importujte znovu, chcete-li mít obě.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Ten soubor projektu nemá nic z tohoto ke zkopírování.';
$ec_lang['lpn_library_import_curve_shape']='Tyto křivky byly importovány přesně tak, jak jsou zapsány v souboru, a výpočet nemůže žádnou z nich použít, dokud její první sloupec nestoupá od každého bodu k dalšímu: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Tyto typy potrubí odkazují na seznam armatur, který tento projekt nemá: {names}. Chcete-li tyto odkazy vyřešit, importujte knihovnu armatur ze stejného souboru.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Varování: Jednotky se neshodují. Budou importovány tak, jak jsou. Nedoporučeno.';
$ec_lang['lpn_library_import_units_line']='{name}: tento projekt zobrazuje {mine}, soubor zobrazuje {theirs}.';
$ec_lang['lpn_fitting_qty']='Počet';
$ec_lang['lpn_fitting_name']='Armatura';
$ec_lang['lpn_fitting_k']='Koeficient';
$ec_lang['lpn_fitting_add']='Přidat armaturu';
$ec_lang['lpn_fitting_remove']='Odebrat';
$ec_lang['lpn_fitting_total']='Celkový koeficient místní ztráty, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Seznam armatur';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Seznam armatur z knihovny projektu. Jeho počty a koeficienty se sečtou do koeficientu místní ztráty tohoto potrubí a pole koeficientu je poté jen ke čtení. Chcete-li koeficient zadat přímo, nezvolte žádný seznam.';
$ec_lang['lpn_fittings_none']='Není zvolen žádný seznam armatur';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Sedlový ventil, plně otevřený';
$ec_lang['lpn_fitting_angle']='Rohový ventil, plně otevřený';
$ec_lang['lpn_fitting_swingcheck']='Zpětná klapka, plně otevřená';
$ec_lang['lpn_fitting_gate']='Šoupátko, plně otevřené';
$ec_lang['lpn_fitting_elbow_short']='Koleno s krátkým poloměrem';
$ec_lang['lpn_fitting_elbow_medium']='Koleno se středním poloměrem';
$ec_lang['lpn_fitting_elbow_long']='Koleno s dlouhým poloměrem';
$ec_lang['lpn_fitting_elbow_45']='Koleno 45 stupňů';
$ec_lang['lpn_fitting_return_bend']='Uzavřené vratné koleno';
$ec_lang['lpn_fitting_tee_run']='Standardní T-kus, průtok přímou větví';
$ec_lang['lpn_fitting_tee_branch']='Standardní T-kus, průtok odbočnou větví';
$ec_lang['lpn_fitting_entrance']='Ostrohranný vstup';
// Tom, 2026-09-30, ruling sprint 2026-09-30-golf item 1: _syn = "All junctions" / "Selected junctions".
$ec_lang['lpn_fitting_exit']='Výstup';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Jiná armatura';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_lead']='Exportovaný soubor EPANET je číselně rovnocenný tomuto projektu. Nemá ale místo pro následující věci:';
$ec_lang['lpn_inp_export_flat_types']='Zde potrubí ({n}) odkazuje na typy potrubí ({t}). V souboru nese každé z těchto potrubí vlastní kopii čísel, takže výsledky jsou stejné. Soubor nedokáže uchovat samotný typ potrubí, takže vazba mezi jednou definicí a každým potrubím, které ji používá, je zaznamenána pouze v souboru projektu.';
$ec_lang['lpn_inp_export_flat_coords']='Soubor EPANET uchovává jednu polohu pro každý uzel. Tento scénář umísťuje {n} z nich jinam a ty jsou polohami v souboru. Každý jiný scénář uchovává své polohy pouze v souboru projektu.';
$ec_lang['lpn_inp_export_flat_fittings']='Soubor EPANET nedokáže pojmout seznam kolen, ventilů a T-kusů z vašeho souboru projektu. Koeficient místní ztráty zde u potrubí ({n}) je sečten ze seznamu armatur. Součet se do souboru zapíše přesně tak, jak je, takže na výsledcích se nic nemění.';
$ec_lang['lpn_library_controls']='Řídicí pravidla';
$ec_lang['lpn_library_controls_tip']='Řízení je jeden příkaz, který otevře nebo zavře spoj, nebo změní jeho nastavení na základě hladiny vody v nádrži, tlaku v uzlu nebo času.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Přidat vzorec';
$ec_lang['lpn_library_pattern_values']='Násobitele';
$ec_lang['lpn_library_pattern_values_tip']='Násobitele, oddělené mezerami nebo čárkami. Vložte sloupec z tabulkového procesoru, pokud jej máte. Seznam se opakuje po celou dobu výpočtu, takže nemusí pokrýt celý jeho průběh.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='Násobitelé: {n}, po {step}, pokrývají {span}';
// Under the pattern graph, beside the clock-time row: the ordinal of each time period (1, 2, 3).
$ec_lang['lpn_library_pattern_axis_step']='Krok';
$ec_lang['lpn_library_pattern_none']='Žádný vzorec';
// The blank first option of a selector whose blank follows a project-wide default (a junction's or
// customer's demand pattern, a pump's price pattern and efficiency curve). Tom, 2026-10-04.
$ec_lang['lpn_choice_default']='Výchozí';
$ec_lang['lpn_settings_default_pattern']='Výchozí vzorec odběru';
$ec_lang['lpn_settings_default_pattern_tip']='Každý uzel bez vlastního vzorce používá tento.';
$ec_lang['lpn_junction_pattern_unknown']='Žádný vzorec v tomto projektu nemá ID {id}, proto uzel zůstal beze změny.';
$ec_lang['lpn_settings_default_pattern_none']='Žádný (konstantní)';
$ec_lang['lpn_demand_pattern_default']='(výchozí: {id})';
$ec_lang['lpn_demand_pattern_constant']='(konstantní)';
$ec_lang['lpn_library_pattern_default_mark']='(výchozí)';
$ec_lang['lpn_library_pattern_default_tip']='Výchozí vzorec odběru. Změníte jej v Nastavení, Výchozí vzorec odběru.';
$ec_lang['lpn_library_pattern_default_deleted_to']='Vzorec {id} byl výchozím vzorcem odběru. Uzly bez vzorce nyní používají vzorec {now}.';
$ec_lang['lpn_library_pattern_default_deleted_none']='Vzorec {id} byl výchozím vzorcem odběru. Uzly bez vzorce nyní používají konstantní odběr.';
$ec_lang['lpn_library_pattern_default_deleted_also']='Scénáře, které jej také používaly jako výchozí: {list}.';
$ec_lang['lpn_library_pattern_default_deleted_in']='Vzorec {id} byl v těchto scénářích výchozím vzorcem odběru: {list}.';
$ec_lang['lpn_library_control_add']='Přidat pravidlo';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Jednořádkové pravidlo v syntaxi EPANET. Používejte jednotky projektu důsledně. Klíčová slova musí být v angličtině. Příklady: LINK 12 CLOSED IF NODE 23 ABOVE 20 (potrubí 12 se uzavře, když hladina v nádrži 23 překročí 20 ft); LINK 12 OPEN IF NODE 130 BELOW 30 (potrubí 12 se otevře, pokud tlak v uzlu 130 klesne pod 30 psi); LINK PUMP02 1.5 AT TIME 16 (relativní rychlost čerpadla PUMP02 se nastaví na 1,5 v 16. hodině simulace); LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM (dvě pravidla: potrubí 12 se opakovaně uzavírá v 10:00 a otevírá ve 20:00 po celou dobu simulace)';
$ec_lang['lpn_library_control_ok']='✓ Rozpoznáno';
$ec_lang['lpn_library_control_bad']='⚠ Nerozpoznáno';
$ec_lang['lpn_library_control_missing']='⚠ Tato síť neobsahuje nic s názvem {id}';
$ec_lang['lpn_library_rules']='Pravidla';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Pravidlo otevře nebo zavře spoj, nebo změní jeho nastavení, když hladina vody, tlak, průtok nebo čas dosáhne zadané hodnoty. Pravidlo může testovat více než jednu podmínku a může určit akci, která se provede, když podmínka neplatí.';
$ec_lang['lpn_library_rule_add']='Přidat pravidlo';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Jedna klauzule na řádek. Následují popisy s příklady ve „VELKÝCH PÍSMENECH“. Řádek 1: Název pravidla, „RULE 1“. Řádek 2: Podmínka, „IF TANK 2 LEVEL BELOW 17.1“. Řádek 3: Akce, „THEN PUMP 9 STATUS IS OPEN“. Řádek 4: Priorita, „PRIORITY 1“. Přidáním řádků „AND“ nebo „OR“ otestujete více podmínek a řádky „ELSE“ určují akci, když podmínka neplatí. Podmínka může číst LEVEL, HEAD, GRADE, PRESSURE nebo DEMAND u uzlu, FLOW, STATUS nebo SETTING u spoje, nebo TIME a CLOCKTIME u SYSTEM. Používejte jednotné jednotky projektu. Klíčová slova musí být v angličtině.';
$ec_lang['lpn_library_rule_ok']='✓ Toto pravidlo bylo přečteno';
$ec_lang['lpn_library_rule_bad']='⚠ Toto pravidlo nešlo přečíst';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Základní odběr';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Průtok, který tento uzel odebírá v zobrazeném časovém kroku: každý základní odběr vynásobený svým vzorcem a sečtené dohromady. Je to výsledek, nikoli vstup.';
$ec_lang['lpn_field_demand_pattern']='Vzorec odběru';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Popis';
$ec_lang['lpn_demand_add']='Přidat kategorii odběru';
$ec_lang['lpn_demand_remove']='Odebrat tento odběr';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Vzorec hladiny';
$ec_lang['lpn_field_head_pattern_tip']='Vzorec hladiny vody tohoto zdroje v průběhu výpočtu. Tlaková výška uvedená výše se vzorcem násobí.';
$ec_lang['lpn_field_pump_speed']='Poměrná rychlost';
$ec_lang['lpn_field_pump_speed_tip']='Relativně k otáčkám, při nichž byla získána jeho zveřejněná křivka výkonu. Ignoruje se (neškáluje se), existuje-li vzorec rychlosti.';
$ec_lang['lpn_field_speed_pattern']='Vzorec rychlosti';
$ec_lang['lpn_field_speed_pattern_tip']='Každá položka vzorce udává poměrnou rychlost pro danou část výpočtu, místo aby škálovala základní hodnotu.';

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
$ec_lang['lpn_search_menu']='Hledat místo podle názvu…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Oprávnění se vyžádá při prvním použití, protože hledání se odesílá do služby názvů míst OpenStreetMap.';
$ec_lang['lpn_search_bar']='Hledat podle názvu…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Hledání podle názvu místa odešle zadaná slova na nominatim.openstreetmap.org, bezplatnou službu názvů míst nadace OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Je to jiná služba než obrázky uliční mapy za projektem. Obrázky pouze udávají, kam se díváte. Hledání udává, co jste zadali. Služba názvů míst obdrží hledaná slova a vaši IP adresu. Nic dalšího neposíláme a o vašich hledáních nevedeme žádný záznam.';
$ec_lang['lpn_search_consent_3']='Smíme vaše hledání posílat vyhledávací službě míst?';
$ec_lang['lpn_search_consent_4']='Pokud řeknete ne, vše ostatní na této stránce bude fungovat přesně jako dosud, včetně Přejít na zeměpisnou šířku a délku. Ano si zapamatujeme, abychom se nemuseli ptát znovu. Ne se nikam neukládá.';
$ec_lang['lpn_search_refused']='Hledání podle názvu místa je vypnuté a nic nebylo odesláno. Příkaz Přejít na zeměpisnou šířku a délku stále funguje.';
$ec_lang['lpn_search_prompt']='Hledejte místo podle názvu. Město, ulice, pamětihodnost — například: Petaluma, California';
$ec_lang['lpn_search_empty']='Zadejte název místa, které chcete vyhledat.';
$ec_lang['lpn_search_working']='Hledá se…';
$ec_lang['lpn_search_busy']='Hledání již probíhá. Počkejte, až skončí.';
$ec_lang['lpn_search_choose']='Vyhovuje více než jedno místo. Které z nich?';
$ec_lang['lpn_search_nochoice']='Nic nebylo vybráno, takže se mapa nepřesunula.';
$ec_lang['lpn_search_badchoice']='To není žádné z čísel v seznamu.';
$ec_lang['lpn_search_none']='Pro tento název nebylo nic nalezeno.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Služba názvů míst omezila četnost požadavků. Počkejte minutu a zkuste to znovu.';
$ec_lang['lpn_search_http']='Služba názvů míst vrátila chybu.';
$ec_lang['lpn_search_timeout']='Služba názvů míst neodpověděla včas. Vše ostatní na této stránce funguje bez ní.';
$ec_lang['lpn_search_unreadable']='Služba názvů míst vrátila odpověď, kterou tato stránka nedokázala přečíst.';
$ec_lang['lpn_search_offline']='Vyhledávací službu míst se nepodařilo spojit. Možná jste offline. Vše ostatní na této stránce funguje i bez ní, včetně Přejít na zeměpisnou šířku a délku.';
$ec_lang['lpn_search_toofast']='Služba názvů míst povoluje jedno hledání za sekundu. Zkuste to znovu za okamžik.';
$ec_lang['lpn_search_nofetch']='Tento prohlížeč se nedokáže spojit s vyhledávací službou míst.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox to sestavuje z mnoha veřejných souborů výškopisu, proto jeho přesnost závisí na místě. Kde existuje národní lidarové zaměření, například USGS 3DEP ve velké části Spojených států a jeho obdoby jinde, může být lepší než 1 m vodorovně a několik desetin metru svisle. Kde existují pouze globální data, je to asi 30 m vodorovně a několik metrů svisle. Mapbox neuvádí, který zdroj platí. Berte to jako vrstevnicovou mapu, nikoli jako geodetické zaměření, a ověřte každou hodnotu, na níž návrh závisí.';
$ec_lang['lpn_terrain_consent_1']='Doplnění nadmořských výšek odešle polohu každého uzlu, který ji potřebuje — jeho zeměpisnou šířku a délku — na api.mapbox.com, aby na tomto místě vyhledal nadmořskou výšku terénu.';
$ec_lang['lpn_terrain_consent_2']='Toto je jiná otázka než snímky mapy za vaším projektem. Snímky prozrazují jen to, kam se díváte. Tyto polohy jsou vaše síť samotná. Mapbox obdrží tyto souřadnice a vaši IP adresu. Neposíláme nic dalšího: žádný název, žádné potrubí, žádný projekt. Nevedeme si o tom žádný záznam a na tomto zařízení se neukládá nic kromě vaší odpovědi na tuto otázku.';
$ec_lang['lpn_terrain_consent_3']='Smíme polohy vašich uzlů poslat Mapboxu?';
$ec_lang['lpn_terrain_consent_4']='Odmítnete-li, vše ostatní na této stránce funguje přesně jako nyní a nadmořské výšky lze zadávat ručně jako dosud. Souhlas si zapamatujeme, abychom se nemuseli ptát znovu. Odmítnutí se neukládá vůbec.';
$ec_lang['lpn_terrain_refused']='Nadmořské výšky nebyly doplněny a nic nebylo odesláno. Lze je zadat ručně jako dosud.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Doplnit nadmořskou výšku {n} uzlů z Mapbox DEM?';
$ec_lang['lpn_terrain_confirm_default_1']='Každý uzel již má nadmořskou výšku a {n} z nich je stále na {v}, což je nadmořská výška, s níž nový uzel začíná, nikoli hodnota, kterou jste zadali.';
$ec_lang['lpn_terrain_confirm_default_2']='Nahradit nadmořskou výšku těchto uzlů ({n}) hodnotami z Mapbox DEM?';
$ec_lang['lpn_terrain_keep']='{k} uzlů již má nadmořskou výšku a nebudou změněny.';
$ec_lang['lpn_terrain_undo']='Jedno Zpět (Ctrl-Z) je všechny vrátí.';
$ec_lang['lpn_terrain_requests']='{n} požadavků na api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Nadmořské výšky se již doplňují. Počkejte na dokončení.';
$ec_lang['lpn_terrain_offmap']='Tyto polohy uzlů nejsou na mapě terénu, takže nic nebylo odesláno.';
$ec_lang['lpn_terrain_too_wide']='Tyto uzly pokrývají příliš velkou část Země, než aby se daly načíst jednou operací ({n} požadavků na dlaždice). Nic nebylo odesláno.';
$ec_lang['lpn_terrain_cancelled']='Nic se nezměnilo a nic nebylo odesláno.';
$ec_lang['lpn_terrain_nofetch']='Tento prohlížeč se nedokáže spojit se službou terénu.';
$ec_lang['lpn_terrain_working']='Načítá se povrch terénu…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Služba terénu požadavek odmítla ({status}), takže žádná nadmořská výška nebyla změněna. Token Mapbox, který tento web používá, možná nepovoluje webovou adresu, na které se nacházíte.';
$ec_lang['lpn_terrain_failed']='Se službou terénu se nepodařilo spojit, takže žádná nadmořská výška nebyla změněna. Možná jste offline. Vše ostatní na této stránce funguje i bez ní.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Služba terénu omezila četnost požadavků (429), proto nebyla změněna žádná nadmořská výška. Zkuste to znovu za minutu.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Služba terénu odpověděla chybou ({status}), takže žádná nadmořská výška nebyla změněna. S vaší sítí není nic v nepořádku.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Žádný z těchto uzlů nemá polohu na Zemi, takže nic nebylo odesláno a žádná nadmořská výška nebyla změněna. Čtení povrchu terénu vyžaduje projekt v zeměpisné šířce a délce, nebo v projekci, kterou tato stránka umí umístit.';
$ec_lang['lpn_terrain_done']='{n} nadmořských výšek doplněno.';
$ec_lang['lpn_terrain_missed']='{m} se nepodařilo přečíst a zůstávají prázdné.';
$ec_lang['lpn_terrain_partial']='Dlaždic terénu bez odpovědi: {f}.';
$ec_lang['lpn_terrain_will_ids']='Tyto uzly dostanou nadmořskou výšku: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Tyto uzly jsou: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Tyto uzly dostaly nadmořskou výšku: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Tyto uzly stále nemají nadmořskou výšku: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, a {n} dalších';

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
$ec_lang['lpn_analyze_menu']='Analýza';
$ec_lang['lpn_analyze_menu_tip']='Analýzy, které provedou výpočet sítě na kopii: požární průtok v každém uzlu, ztráta každého potrubí, čerpadla a ventilu a odběry zvětšené či zmenšené násobitelem.';
$ec_lang['lpn_ff_menu']='Požární průtok: analýza…';
$ec_lang['lpn_ff_menu_tip']='Otestuje každý vybraný uzel na požární průtok a zkontroluje dopad na zbytek systému';
$ec_lang['lpn_ff_title']='Požární průtok: analýza';
$ec_lang['lpn_ff_intro']='Každý uzel postupně odebírá požární průtok navíc ke svému stávajícímu odběru. Výpočet používá kopii sítě v časovém kroku zobrazeném na obrazovce, takže se nic v projektu nemění.\n\nPožární průtok se obvykle testuje při odběru maximálního dne, proto nejprve nastavte síť na tento stav.\n\nKaždý testovaný uzel vyžaduje asi 16 řešení celé sítě, takže velký systém trvá minuty: uzly zvolte před spuštěním a kdykoli můžete výpočet zastavit, aby se zachovaly dílčí výsledky.';
$ec_lang['lpn_ff_scope']='Uzly k otestování';
$ec_lang['lpn_ff_all']='Všechny uzly';
$ec_lang['lpn_ff_selected']='Vybrané uzly';
$ec_lang['lpn_ff_no_junctions']='Tento projekt zatím nemá žádné uzly, takže není co testovat.';
$ec_lang['lpn_ff_no_selection']='Nejsou vybrány žádné uzly. Vyberte uzly, nebo zvolte Všechny uzly.';
$ec_lang['lpn_ff_skipped']='{n} vybraných prvků nejsou uzly, takže nebyly testovány.';
$ec_lang['lpn_ff_required']='Požadovaný požární průtok';
$ec_lang['lpn_ff_required_tip']='Průtok požadovaný u hydrantu příslušným požárním předpisem nebo hasičským orgánem. Každý uzel se testuje proti této hodnotě, pokud pro něj není zadán požadovaný požární průtok.';
$ec_lang['lpn_ff_required_own']='Uzly s individuálním požadovaným požárním průtokem se místo toho testují proti této hodnotě. Počet takových uzlů: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Požární průtok požadovaný v tomto uzlu pro využití území, které obsluhuje, podle příslušného požárního předpisu nebo hasičského orgánu. Ponecháte-li pole prázdné, uzel se otestuje proti hodnotě v okně Požární průtok: analýza.';
$ec_lang['lpn_ff_residual']='Zbytkový tlak k udržení';
$ec_lang['lpn_ff_residual_tip']='Tlak, který musí uzel stále držet při odběru požárního průtoku. AWWA M31 a NFPA 291 používají 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Návrhová kontrola (vliv na síť)';
$ec_lang['lpn_ff_design_tip']='Jiná otázka než to, zda uzel dokáže dodat průtok: klesne při odběru tohoto průtoku v něm jiný uzel pod svůj minimální tlak, nebo některé potrubí překročí limit rychlosti? Tato kontrola nevyžaduje žádný další výpočet.';
$ec_lang['lpn_ff_design_off']='Žádná';
$ec_lang['lpn_ff_design_all']='Všechny';
$ec_lang['lpn_ff_design_selected']='Vybrané';
$ec_lang['lpn_ff_design_no_selection']='Rozsah návrhové kontroly je nastaven na Vybrané, ale nejsou vybrány žádné prvky. Vyberte prvky na mapě, nebo zvolte Všechny.';
$ec_lang['lpn_ff_minpressure']='Nejnižší povolený tlak jinde';
$ec_lang['lpn_ff_minpressure_tip']='Uzel, který klesne pod tuto hodnotu, zatímco jiný odebírá svůj požární průtok, je nahlášen jako návrhový problém.';
$ec_lang['lpn_ff_maxvelocity']='Nejvyšší povolená rychlost';
$ec_lang['lpn_ff_maxvelocity_tip']='Potrubí běžící nad touto hodnotou, zatímco se odebírá požární průtok, je nahlášeno jako návrhový problém.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Tlak je modelován přímo v uzlu, což je obvyklá metoda. Hydrant, jeho přípojka a jeho výtoková hubice nejsou modelovány a tlak na hubici je nižší než v uzlu.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Používá se vestavěný řešič.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Používá se řešič EPANET.';
// Edited by TGH 2026-09-07
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Výpočet požárního průtoku';
$ec_lang['lpn_ff_calculate']='Spustit';
$ec_lang['lpn_ff_stop']='Zastavit';
$ec_lang['lpn_ff_working']='Probíhá: {done} z {total} uzlů.';
$ec_lang['lpn_ff_stopped']='Zastaveno po {done} z {total} uzlů. Výsledky níže jsou ty, které už byly dokončeny.';
$ec_lang['lpn_ff_cost']='Tento výpočet vyřešil celou síť {solves}krát.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Výkres se změnil, takže výsledky požárního průtoku byly vymazány. Spusťte jej znovu.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Vymazat kroužky';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} uzlů vyhovělo všem kontrolám. {fire} uzlů nesplnilo požární průtok. {design} uzlů ovlivnilo zbytek systému.';
$ec_lang['lpn_ff_summary_error']='Uzly, které nebylo možné vyřešit ({n}).';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Otestován každý uzel';
$ec_lang['lpn_ff_col_junction']='Uzel';
$ec_lang['lpn_ff_col_static']='Statický tlak';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='Tlak u tohoto uzlu, než se odebere jakýkoli požární průtok, přičemž běžné odběry systému stále probíhají. K jeho zjištění se nic neuzavírá, takže to není tlak systému při nulovém průtoku; je to stejný tlak, jaký mapa u tohoto uzlu ukazuje. AWWA M31 i NFPA 291 tuto hodnotu nazývají statický tlak, a je to místo, kde zkouška požárního průtoku začíná.';
$ec_lang['lpn_ff_col_available']='Dostupný průtok';
$ec_lang['lpn_ff_col_required']='Požadovaný průtok';
$ec_lang['lpn_ff_col_residual']='Udržený zbytkový tlak';
$ec_lang['lpn_ff_col_atrequired']='Tlak při požadovaném průtoku';
$ec_lang['lpn_ff_col_affected']='Nejhorší vliv';
$ec_lang['lpn_ff_col_limit']='Návrhový limit';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Nekontrolováno';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Statický tlak neuspěl, proto nekontrolováno';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Způsoby selhání';
$ec_lang['lpn_ff_mode_fire']='Požár';
$ec_lang['lpn_ff_mode_design']='Návrh';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Žádný';
$ec_lang['lpn_ff_col_solves']='Výpočty';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Tlak a rychlost';
$ec_lang['lpn_ff_atleast']='více než {flow}';
$ec_lang['lpn_ff_affect_node']='{id} klesá na {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} dosahuje {velocity}';
$ec_lang['lpn_ff_more']='a {n} dalších ovlivněno';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='Nezobrazené uzly: {n}.';
$ec_lang['lpn_ff_rows_more_links']='Nezobrazené spoje: {n}.';
$ec_lang['lpn_ff_design_none']='Při postupném odběru požárního průtoku v každém testovaném uzlu nepřekročil žádný prvek v rozsahu návrhové kontroly své limity.';
$ec_lang['lpn_ff_design_off_note']='Vliv na zbytek systému nebyl v tomto výpočtu kontrolován.';
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
$ec_lang['lpn_ff_iso']='Insurance Services Office (ISO) uznává jednomu hydrantu nejvýše {flow}. Tento limit se zde neuplatňuje, protože uzel může představovat více než jeden hydrant.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Již pod zbytkovým tlakem před odběrem jakéhokoli požárního průtoku';
$ec_lang['lpn_ff_err_converge']='Síť nedosáhla konvergence.';
$ec_lang['lpn_ff_err_solve']='Řešič nahlásil chybu a nevrátil žádný výsledek.';
$ec_lang['lpn_ff_err_not_junction']='Není uzel';
$ec_lang['lpn_ff_err_unknown']='Žádný výsledek. Kód chyby: {code}';

// ---- Water > Criticality analysis (Tom, 2026-09-30) -------------------------------------------
//
// Break each asset in turn, on a copy, and report what the system loses. "Criticality analysis" is
// the industry's term (WaterGEMS, InfoWater); EPANET has no such tool and no word for it. The run
// dialog, Run, Stop, the engine sentence and the cost line are fire flow's own keys.
//
// {n}, {done} and {total} are whole numbers; {pressure} is a pressure with its unit.
$ec_lang['lpn_crit_menu']='Kritičnost: analýza…';
$ec_lang['lpn_crit_menu_tip']='Postupně odebere ze sítě každé potrubí, čerpadlo a ventil a ohlásí dopad na systém.';
$ec_lang['lpn_crit_title']='Kritičnost: analýza';
$ec_lang['lpn_crit_intro']='Každý prvek se postupně vyjme ze sítě a síť se vypočítá v časovém kroku zobrazeném na obrazovce v aktivním scénáři. Nic v projektu se nemění; celý výpočet probíhá na kopii.';
$ec_lang['lpn_crit_scope']='Spoje k přerušení';
$ec_lang['lpn_crit_scope_tip']='Všechna potrubí, čerpadla a ventily, nebo jen ty vybrané na mapě. Množinu zvolte před spuštěním.';
$ec_lang['lpn_crit_scope_all']='Všechny spoje';
$ec_lang['lpn_crit_scope_selected']='Vybrané spoje';
$ec_lang['lpn_crit_minpressure']='Nejnižší povolený tlak';
$ec_lang['lpn_crit_minpressure_tip']='Je to stejné číslo jako Nejnižší povolený tlak jinde v okně Požární průtok: analýza. Změna zde ho změní i tam.';
$ec_lang['lpn_crit_col_asset']='Prvek';
$ec_lang['lpn_crit_col_unserved']='Nedodaný odběr';
$ec_lang['lpn_crit_col_cutoff']='Odříznuté uzly';
$ec_lang['lpn_crit_col_below']='Uzly pod minimem';
$ec_lang['lpn_crit_summary']='Prvky, které nechávají odběr nedodaný nebo srazí uzel pod {pressure} ({n} z {total}).';
$ec_lang['lpn_crit_baseline_below']='Uzly, které jsou pod ním už bez jakékoli poruchy: {n}. Nepočítají se.';
$ec_lang['lpn_crit_working']='Počítá se: {done} z {total} prvků.';
$ec_lang['lpn_crit_stopped']='Zastaveno po {done} z {total} prvků. Výsledky níže jsou ty, které už byly hotové.';
$ec_lang['lpn_crit_no_selection']='Nejsou vybrány žádné spoje. Vyberte spoje, nebo zvolte Všechny spoje.';
$ec_lang['lpn_crit_no_links']='Tento projekt zatím nemá žádné spoje, takže není co přerušit.';
$ec_lang['lpn_crit_busy']='Běží jiná analýza. Zastavte ji, nebo počkejte, až skončí.';
$ec_lang['lpn_crit_skipped']='Vybraných prvků, které nejsou spoje, a proto nebyly přerušeny: {n}.';
$ec_lang['lpn_crit_stale']='Výkres se změnil, takže výsledky analýzy kritičnosti byly vymazány. Spusťte ji znovu.';
$ec_lang['lpn_crit_skipdead']='Přeskočit slepá zakončení';
$ec_lang['lpn_crit_skipdead_tip']='Spoj ve slepém zakončení je takový, jehož odstranění odřízne uzly, které se k němu dají dostat jen přes něj, bez zdroje nebo nádrže za ním. Jeho ztrátou je vše, co leží za ním, proto se nepočítá. Souhrn uvádí, kolik jich bylo přeskočeno.';
$ec_lang['lpn_crit_skipped_dead']='Přeskočené spoje ve slepých zakončeních: {n}. Každý z nich odřízne vše, co leží za ním.';

// ---- Water > Analyze > Demand scaling (ROADMAP Task 754) ----------------------------------------
//
// Tom, 2026-09-30 and 2026-10-01: the demands multiplied on a copy, like Fire flow, and "What demand
// scale can the system handle with this pressure limit?" The run dialog's Stop, the engine sentence,
// the cost line, the Junction heading and the solver's reasons are fire flow's own keys.
//
// {m} and {max} are demand scales printed as numbers (1.37); {step} is the search's tolerance
// (0.01); {n} is a whole number, always after a colon so no plural has to agree with it; {time} and
// {now} are elapsed times (6:00); {pressure} is a pressure with its unit; {id} becomes a link to the
// junction on the map; {reason} is a whole sentence saying why the solver gave no answer.
$ec_lang['lpn_ds_menu']='Škálování odběru…';
$ec_lang['lpn_ds_menu_tip']='Vynásobí odběry na kopii sítě a zobrazí tlaky a rychlosti, nebo najde největší měřítko odběru, které systém unese.';
$ec_lang['lpn_ds_title']='Škálování odběru';
$ec_lang['lpn_ds_intro']='Tlačítkem Spustit vynásobíte odběry ve vybraných uzlech měřítkem odběru a zobrazíte tlaky a rychlosti.\n\nTlačítkem Najít zjistíte největší měřítko odběru, s přesností na {step}, při kterém všechny tyto uzly udrží alespoň nejnižší povolený tlak; hledá se od 0 do {max}.\n\nObě fungují na kopii sítě, vyřešené v časovém kroku zobrazeném na obrazovce v aktivním scénáři, takže se nic v projektu nemění. Škáluje se pouze tento časový krok a hladiny a stavy se přebírají z něj; chcete-li testovat špičku, před spuštěním přesuňte hodiny na špičkový odběr.';
$ec_lang['lpn_ds_scope']='Uzly ke škálování';
$ec_lang['lpn_ds_scope_all']='Všechny uzly';
$ec_lang['lpn_ds_scope_selected']='Vybrané uzly';
$ec_lang['lpn_ds_minpressure']='Nejnižší povolený tlak';
$ec_lang['lpn_ds_minpressure_tip']='Je to totéž číslo jako Nejnižší povolený tlak jinde v okně Požární průtok: analýza. Změna zde změní i tam.';
$ec_lang['lpn_ds_head_scale']='Škálovat odběry';
$ec_lang['lpn_ds_multiplier']='Měřítko odběru';
$ec_lang['lpn_ds_multiplier_tip']='Činitel, kterým se každý odběr násobí; 1,5 je zvýšení o 50 %. Uplatňuje se navíc k násobiteli odběru aktivního scénáře, který je již v odběrech zahrnut, a v projektu se nikdy neukládá.';
$ec_lang['lpn_ds_run']='Spustit';
$ec_lang['lpn_ds_head_search']='Jaké měřítko odběru systém zvládne?';
$ec_lang['lpn_ds_head_search_selected']='Jaké měřítko odběru tyto uzly zvládnou?';
$ec_lang['lpn_ds_outside_below']='Při měřítku odběru {m} je nevybraných uzlů pod {pressure}: {n} ({ids}). Tento výsledek neomezují.';
$ec_lang['lpn_ds_holds_max']='✓ Každý uzel udrží {pressure} až do měřítka odběru {max}, horní meze hledání.';
$ec_lang['lpn_ds_below_zero']='⚠ Alespoň jeden uzel je pod {pressure}, i když jsou škálované odběry nulové.';
$ec_lang['lpn_ds_found']='✓ Každý zkontrolovaný uzel udrží alespoň {pressure} až do měřítka odběru {m}.';
$ec_lang['lpn_ds_found_below']='⚠ Odběry tak, jak jsou zadány (měřítko odběru 1), nechávají alespoň jeden uzel pod {pressure}. Největší měřítko odběru, při kterém každý uzel udrží {pressure} nebo více, je {m}.';
$ec_lang['lpn_ds_search_stopped']='Hledání bylo zastaveno dříve, než našlo výsledek.';
$ec_lang['lpn_ds_lowest_at']='Při měřítku odběru {m} je nejnižší tlak {pressure} v uzlu {id}.';
$ec_lang['lpn_ds_nosolve_at']='Při měřítku odběru {m} síť nevrátila žádný výsledek. {reason}';
$ec_lang['lpn_ds_scale_ok']='✓ Při měřítku odběru {m} každý uzel udrží {pressure}.';
$ec_lang['lpn_ds_scale_below']='⚠ Při měřítku odběru {m} je uzlů pod {pressure}: {n}.';
$ec_lang['lpn_ds_scaled_selected']='Škálované a zkontrolované uzly: {n}.';
$ec_lang['lpn_ds_head_lowest']='Nejnižší tlaky';
$ec_lang['lpn_ds_head_velocity']='Nejvyšší rychlosti';
$ec_lang['lpn_ds_col_link']='Spoj';
$ec_lang['lpn_ds_col_scaled']='Škálováno';
$ec_lang['lpn_ds_col_scaled_tip']='S odběry vynásobenými měřítkem odběru.';
$ec_lang['lpn_ds_col_unscaled']='Neškálováno';
$ec_lang['lpn_ds_col_unscaled_tip']='S odběry tak, jak jsou v aktivním scénáři v tomto časovém kroku, tedy stejná hodnota, jakou ukazuje mapa.';
$ec_lang['lpn_ds_no_junctions']='Tento projekt zatím nemá žádné uzly, takže nejsou žádné odběry ke škálování.';
$ec_lang['lpn_ds_no_selection']='Nejsou vybrány žádné uzly. Vyberte uzly nebo zvolte Všechny uzly.';
$ec_lang['lpn_ds_skipped']='Vybrané prvky, které nejsou uzly, ponechané beze změny: {n}.';
$ec_lang['lpn_ds_bad_multiplier']='Zadejte měřítko odběru nula nebo větší, například 1,5.';
$ec_lang['lpn_ds_stale']='Kresba se změnila, proto byly výsledky škálování odběru vymazány. Spusťte je znovu.';
$ec_lang['lpn_analyze_at_time']='Časový krok: {time}.';
$ec_lang['lpn_analyze_time_moved']='⚠ Výsledek byl vypočten v čase {time}, hodiny jsou nyní na {now}. Spusťte jej znovu pro časový krok zobrazený na obrazovce.';

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
$ec_lang['lpn_file_import_survey']='Importovat geodeticky zaměřené body…';
$ec_lang['lpn_file_import_survey_tip']='Načte seznam zaměřených bodů z textového souboru a vytvoří jeden uzel v každém bodě, přičemž pro vše, co soubor neuvádí, použije nastavení nových prvků. Žádné potrubí se nekreslí, pokud nezaškrtnete Číst popis jako terénní kódy, a žádný řádek není nikdy vynechán bez uvedení. Čte souřadnicový systém, který tento projekt již používá, georeferencovaný či nikoli.';
// GeoJSON import of Shapes (Task 779). Only points, lines and polygons come in, as Shapes; the
// network is imported from an EPANET file. Every feature not imported is named in the report.
$ec_lang['lpn_file_import_shapes']='Importovat útvary GeoJSON…';
$ec_lang['lpn_file_import_shapes_tip']='Načte body, čáry a mnohoúhelníky ze souboru GeoJSON do tohoto projektu jako Útvary. Prvky sítě v souboru se neimportují; síť importujte ze souboru EPANET nebo příkazem Importovat síť GeoJSON. Projekt musí být georeferencovaný nebo musí uvádět souřadnicový systém.';
$ec_lang['lpn_file_import_gjnet']='Importovat síť GeoJSON…';
$ec_lang['lpn_file_import_gjnet_tip']='Otevře soubor GeoJSON jako nový projekt. Body se importují jako uzly, zdroje nebo nádrže a čáry jako potrubí. Soubor exportovaný z této stránky se čte tak, jak byl zapsán; u jakéhokoli jiného souboru jeden krok přiřadí jeho pole k vlastnostem a jednotkám.';
$ec_lang['lpn_gjnet_refuse_crs']='{file} uvádí souřadnicový systém {crs}. Polohy GeoJSON jsou zeměpisná šířka a délka WGS 84 (RFC 7946) a tato stránka soubor GeoJSON z jiného systému nepřevádí. Exportujte vrstvu z GIS v EPSG:4326 (WGS 84) a poté importujte tento soubor.';
$ec_lang['lpn_gjnet_refuse_empty']='{file} neobsahuje žádné body ani čáry.';
$ec_lang['lpn_gjnet_target_node_type']='Typ uzlu';
$ec_lang['lpn_gjnet_target_custom']='Vlastní vlastnost';
$ec_lang['lpn_gjnet_target_skip']='Neimportovat';
$ec_lang['lpn_gjnet_points_heading']='Pole bodů (uzly, zdroje a nádrže)';
$ec_lang['lpn_gjnet_lines_heading']='Pole čar (potrubí)';
$ec_lang['lpn_gjnet_no_fields']='Tyto objekty nemají žádná pole atributů.';
$ec_lang['lpn_gjnet_col_field']='Pole';
$ec_lang['lpn_gjnet_col_example']='Příklad';
$ec_lang['lpn_gjnet_col_fills']='Vyplňuje';
$ec_lang['lpn_gjnet_col_unit']='Jednotka';
$ec_lang['lpn_gjnet_beta']='Beta: vítána zpětná vazba';
$ec_lang['lpn_gjnet_beta_tip']='Tento import byl vyzkoušen na několika souborech z programů GIS. Chcete-li nahlásit problém nebo navrhnout změnu, klikněte na {button} na stránce a popište soubor.';
$ec_lang['lpn_gjnet_intro']='Nalezeno {points} bodů a {lines} čar. Body se importují jako uzly, zdroje nebo nádrže a čáry jako potrubí. Zvolte vlastnost, kterou každé pole vyplňuje, a jednotku každého čísla.';
$ec_lang['lpn_gjnet_other']='{n} objektů není ani bodem, ani čárou a nebude se importovat; sestava je vypíše.';
$ec_lang['lpn_gjnet_tolerance']='Tolerance spojení (m)';
$ec_lang['lpn_gjnet_tolerance_tip']='Konec čáry do této vzdálenosti od bodu nebo od jiného konce čáry se k němu připojí. Konec čáry dál než tato vzdálenost od každého bodu dostane nový uzel.';
$ec_lang['lpn_gjnet_working']='Importuje se {file}…';
$ec_lang['lpn_gjnet_title']='Importovat síť GeoJSON: {file}';
$ec_lang['lpn_gjnet_report_lead']='Každá změna provedená při importu a každý neimportovaný objekt jsou uvedeny níže s důvodem:';
$ec_lang['lpn_gjnet_and_more']='a dalších {n}';
$ec_lang['lpn_gjnet_note_crs']='Soubor uvádí souřadnicový systém {crs}, tedy zeměpisnou šířku a délku WGS 84, systém, který vyžaduje RFC 7946. Polohy byly přečteny tak, jak jsou uvedeny.';
$ec_lang['lpn_gjnet_note_crs_nad83']='Soubor uvádí NAD83 (EPSG:4269). Jeho polohy byly přečteny jako WGS 84, což je umístí asi 1 až 2 m od místa, kam je umísťuje NAD83.';
$ec_lang['lpn_gjnet_note_skip_geometry']='Neimportováno: objekt není bod ani čára.';
$ec_lang['lpn_gjnet_note_skip_kind']='Neimportováno: objekt neuvádí node_type ani link_type.';
$ec_lang['lpn_gjnet_note_skip_position']='Neimportováno: poloha není platná zeměpisná šířka a délka.';
$ec_lang['lpn_gjnet_note_skip_id']='Neimportováno: název není platné ID, nebo jej má jiný prvek stejného druhu.';
$ec_lang['lpn_gjnet_note_skip_no_node']='Neimportováno: uvedený počáteční nebo koncový uzel v souboru není.';
$ec_lang['lpn_gjnet_note_skip_loop']='Neimportováno: oba konce čáry se připojují ke stejnému uzlu.';
$ec_lang['lpn_gjnet_note_id_new']='Tyto objekty neuvádějí platné ID a bylo jim přiřazeno ID uvedené v závorce.';
$ec_lang['lpn_gjnet_note_id_dup']='Tato ID uvádí více objektů stejného druhu. Každému pozdějšímu objektu bylo přiřazeno ID uvedené v závorce.';
$ec_lang['lpn_gjnet_note_unmapped_id_point']='Pro ID bodu nebylo zvoleno žádné pole, takže každému uzlu importovanému z bodu bylo přiřazeno ID.';
$ec_lang['lpn_gjnet_note_unmapped_id_line']='Pro ID čáry nebylo zvoleno žádné pole, takže každému potrubí bylo přiřazeno ID.';
$ec_lang['lpn_gjnet_note_skip_short']='Neimportováno: čára potřebuje alespoň dvě polohy.';
$ec_lang['lpn_gjnet_note_elev_taken']='Tyto uzly neuvádějí nadmořskou výšku. Každému byla dána nadmořská výška uzlu uvedeného v závorce: u uzlu přidaného na konci čáry uzlu na druhém konci jeho potrubí, jinak nejbližšího uzlu, který ji uvádí.';
$ec_lang['lpn_gjnet_note_default_elev_added']='Tyto uzly byly přidány na koncích čar a mají výchozí nadmořskou výšku {value}, protože žádný uzel v souboru nadmořskou výšku neuvádí.';
$ec_lang['lpn_gjnet_note_demand_kept']='Zdroj ani nádrž nemá odběr, proto byl odběr uvedený u těchto uzlů zachován jako vlastní vlastnost {key}.';
$ec_lang['lpn_gjnet_note_parts']='Tyto vícedílné čáry mají nespojené části a byly importovány jako jedno potrubí pro každou část.';
$ec_lang['lpn_gjnet_note_parts_points']='Tyto vícebodové objekty byly importovány jako jeden uzel pro každý bod.';
$ec_lang['lpn_gjnet_note_junction_added']='Tyto uzly byly přidány tam, kde konec čáry není do {tol} od bodu. Každý má výchozí základní odběr.';
$ec_lang['lpn_gjnet_note_end_moved']='Tato potrubí mají konec do {tol} od bodu nebo jiného konce čáry, ale ne na něm. Konec byl k němu připojen; největší vzdálenost je {dist}.';
$ec_lang['lpn_gjnet_note_end_on_pipe']='Tyto konce čar leží na potrubí uvedeném v závorce, ale ne na jeho konci, a nejsou k němu připojeny.';
$ec_lang['lpn_gjnet_note_z']='Tyto body uvádějí třetí souřadnici, která nebyla importována.';
$ec_lang['lpn_gjnet_note_default_elev']='Tyto uzly neuvádějí nadmořskou výšku a mají výchozí nadmořskou výšku {value}.';
$ec_lang['lpn_gjnet_note_unmapped_elev']='Pro nadmořskou výšku nebylo zvoleno žádné pole, takže každý uzel má výchozí nadmořskou výšku {value} a automatické délky nezahrnují žádný výškový rozdíl.';
$ec_lang['lpn_gjnet_note_default_demand']='Tyto uzly neuvádějí základní odběr a mají výchozí základní odběr {value}.';
$ec_lang['lpn_gjnet_note_unmapped_demand']='Pro základní odběr nebylo zvoleno žádné pole, takže každý uzel má výchozí základní odběr {value}.';
$ec_lang['lpn_gjnet_note_default_diameter']='Tato potrubí neuvádějí průměr a mají výchozí průměr {value}.';
$ec_lang['lpn_gjnet_note_unmapped_diameter']='Pro průměr nebylo zvoleno žádné pole, takže každé potrubí má výchozí průměr {value}.';
$ec_lang['lpn_gjnet_note_default_roughness']='Tato potrubí neuvádějí drsnost a mají výchozí drsnost {value}.';
$ec_lang['lpn_gjnet_note_unmapped_roughness']='Pro drsnost nebylo zvoleno žádné pole, takže každé potrubí má výchozí drsnost {value}.';
$ec_lang['lpn_gjnet_note_default_k']='Tato potrubí neuvádějí součinitel místní ztráty, takže každé má 0, stejně jako v souboru EPANET, který jej neuvádí.';
$ec_lang['lpn_gjnet_note_unmapped_k']='Pro součinitel místní ztráty nebylo zvoleno žádné pole, takže každé potrubí má 0, stejně jako v souboru EPANET, který jej neuvádí.';
$ec_lang['lpn_gjnet_note_default_tank']='Tyto nádrže mají výchozí hloubky vody a výchozí průměr nádrže.';
$ec_lang['lpn_gjnet_note_length_auto']='Tato potrubí neuvádějí délku. Každá délka se vypočte z čáry (Automaticky).';
$ec_lang['lpn_gjnet_note_unmapped_length']='Pro délku nebylo zvoleno žádné pole, takže se každá délka potrubí vypočte z čáry (Automaticky).';
$ec_lang['lpn_gjnet_note_value_unread']='Tyto hodnoty nejsou čísla nebo nejsou rozpoznány a nebyly použity.';
$ec_lang['lpn_gjnet_note_field_skipped']='Tato pole nebyla importována, jak bylo zvoleno.';
$ec_lang['lpn_gjnet_note_field_custom']='Tato pole byla importována jako vlastní vlastnosti.';
$ec_lang['lpn_gjnet_note_results']='Výsledky v souboru nebyly importovány. Vypočítat je vypočte znovu.';
$ec_lang['lpn_gjnet_note_demand_rows']='Tyto uzly měly více než jeden řádek odběru. Soubor GeoJSON drží jen první, který byl importován.';
$ec_lang['lpn_gjnet_note_pipe_type']='Tato potrubí uvádějí typ potrubí uvedený v závorce, jehož definici soubor GeoJSON neobsahuje. Typ potrubí nebyl importován; průměr a drsnost uvedené v souboru ano.';
$ec_lang['lpn_gjnet_note_pattern_conflict']='Tyto vzorce jsou uvedeny s různými násobiteli u různých objektů. Použit byl první.';
$ec_lang['lpn_gjnet_note_end_off_node']='Čára každého z těchto spojů nezačíná ani nekončí ve svém uzlu. Použita byla poloha uzlu.';
$ec_lang['lpn_gjnet_note_not_held']='Soubor GeoJSON neobsahuje řídicí pravidla, pravidla, nastavení času, textové popisky, možnosti EPANET ani knihovny typů potrubí, armatur a křivek účinnosti, takže nic z toho nebylo importováno.';
$ec_lang['lpn_geojson_import_done']='Importováno Útvarů: {n}, ze souboru {file}.';
$ec_lang['lpn_geojson_import_done_one']='Importován jeden Útvar ze souboru {file}.';
$ec_lang['lpn_geojson_import_renamed']='Počet názvů objektů, které nelze použít jako ID Útvarů: {n}. Každý Útvar dostal jiné ID a ponechal si název objektu: {list}.';
$ec_lang['lpn_geojson_import_renamed_one']='Jeden název objektu nelze použít jako ID Útvaru. Útvar dostal jiné ID a ponechal si název objektu: {list}.';
$ec_lang['lpn_geojson_import_skipped']='Neimportované objekty ({n}): {list}.';
$ec_lang['lpn_geojson_import_skipped_one']='Neimportován jeden objekt: {list}.';
$ec_lang['lpn_geojson_import_why_network']='prvek sítě';
$ec_lang['lpn_geojson_import_why_geometry']='není bod, čára ani mnohoúhelník';
$ec_lang['lpn_geojson_import_why_position']='poloha není platná zeměpisná šířka a délka';
$ec_lang['lpn_geojson_import_holes']='Neimportované otvory v mnohoúhelnících: {n}. Útvar má jedno ohraničení.';
$ec_lang['lpn_geojson_import_holes_one']='Neimportován jeden otvor v mnohoúhelníku. Útvar má jedno ohraničení.';
$ec_lang['lpn_geojson_import_parts']='Vícedílné objekty ({n}) importovány jako jeden Útvar pro každou část.';
$ec_lang['lpn_geojson_import_parts_one']='Jeden vícedílný objekt importován jako jeden Útvar pro každou část.';
$ec_lang['lpn_geojson_import_local']='Polohy GeoJSON jsou zeměpisná šířka a délka a tento projekt nemá na Zemi žádné místo, na které by je bylo možné převést. Nejprve jej georeferencujte pomocí Mapa, Mapa světa, Připojit a poté importujte znovu.';
$ec_lang['lpn_geojson_import_unreadable']='{file} není soubor GeoJSON: {detail}';
$ec_lang['lpn_file_import_dxf']='Importovat útvary DXF…';
$ec_lang['lpn_file_import_dxf_tip']='Načte body, čáry a lomené čáry z ASCII souboru DXF do tohoto projektu jako Útvary, přičemž název každé vrstvy zůstane zachován jako vlastnost. Ostatní entity se spočítají a vypíšou, ale neimportují. Souřadnice se čtou jako X a Y tohoto projektu, bez převodu.';
$ec_lang['lpn_file_import_shp']='Importovat útvary shapefile…';
$ec_lang['lpn_file_import_shp_tip']='Načte body, čáry a mnohoúhelníky ze souboru ESRI shapefile do tohoto projektu jako Útvary, přičemž sloupce atributů zůstanou zachovány jako vlastnosti. Vyberte buď soubor .zip, nebo soubor .shp spolu se soubory .shx, .dbf a .prj (několik souborů vyberete podržením klávesy Ctrl nebo Shift). Souřadnice v jiném souřadnicovém systému než projekt se převedou a oznámení to uvádí.';
$ec_lang['lpn_dxf_import_skipped']='Neimportované entity ({n}): {list}.';
$ec_lang['lpn_dxf_import_skipped_one']='Neimportována jedna entita: {list}.';
$ec_lang['lpn_dxf_import_inblocks']='v definicích bloků';
$ec_lang['lpn_dxf_import_bulge']='Lomené čáry s obloukovými segmenty ({n}) byly importovány jako přímé segmenty mezi svými vrcholy.';
$ec_lang['lpn_dxf_import_bulge_one']='Jedna lomená čára má obloukové segmenty, které byly importovány jako přímé segmenty mezi jejími vrcholy.';
$ec_lang['lpn_dxf_import_units']='Výkres uvádí své jednotky jako {theirs} a tento projekt používá {ours}. Čísla nebyla změněna.';
$ec_lang['lpn_dxf_import_refuse_geo']='Výkres DXF je rovinný a tento projekt je v zeměpisné šířce a délce, takže souřadnice souboru {file} v něm nemají místo. Pomocí Převést jako… zkopírujte projekt do souřadnicového systému a poté importujte znovu.';
$ec_lang['lpn_dxf_import_unreadable']='{file} není ASCII soubor DXF.';
$ec_lang['lpn_dxf_import_binary']='{file} je binární DXF. Uložte jej z programu CAD jako ASCII DXF a poté importujte znovu.';
$ec_lang['lpn_shapes_import_frame']='Souřadnice byly čteny jako {frame}, bez převodu.';
$ec_lang['lpn_shapes_frame_xy']='X a Y tohoto projektu';
$ec_lang['lpn_shapes_frame_latlon']='zeměpisná šířka a délka';
$ec_lang['lpn_shp_import_skipped']='Neimportované záznamy, jejichž typ geometrie se nečte ({n}): {list}.';
$ec_lang['lpn_shp_import_skipped_one']='Neimportován jeden záznam, jehož typ geometrie se nečte: {list}.';
$ec_lang['lpn_shp_import_attrs']='Sloupce atributů zachované jako vlastnosti každého Útvaru: {list}.';
$ec_lang['lpn_shp_import_noprj']='Chybí soubor .prj, proto byly souřadnice čteny jako {frame}, bez převodu.';
$ec_lang['lpn_shp_import_prj_same']='Soubor .prj uvádí {crs}, souřadnicový systém tohoto projektu, takže souřadnice nebyly změněny.';
$ec_lang['lpn_shp_import_converted']='Souřadnice jsou zeměpisná šířka a délka. Byly převedeny do {crs} transformací, kterou používá mapa.';
$ec_lang['lpn_shp_import_prj_other']='Soubor .prj uvádí {theirs}. Tento projekt neuvádí žádný souřadnicový systém, takže souřadnice byly čteny jako {frame}, bez převodu.';
$ec_lang['lpn_shp_import_refuse_local']='{file} je v zeměpisné šířce a délce a tento projekt nemá na Zemi žádné místo, na které by je bylo možné převést. Nejprve jej georeferencujte pomocí Mapa, Mapa světa, Připojit a poté importujte znovu.';
$ec_lang['lpn_shp_import_refuse_crs']='{file} uvádí {theirs} a tento projekt je v {ours}. Nic nebylo importováno ani převedeno.';
$ec_lang['lpn_shp_import_refuse_range']='{file} nemá soubor .prj a jeho souřadnice nejsou zeměpisné šířky a délky, takže je nelze v tomto projektu umístit.';
$ec_lang['lpn_shp_import_noshp']='{file} neobsahuje žádný soubor .shp. Vyberte buď soubor .zip shapefile, nebo soubor .shp spolu se soubory .shx, .dbf a .prj (několik souborů vyberete podržením klávesy Ctrl nebo Shift).';
$ec_lang['lpn_shp_import_manyshp']='{file} obsahuje více než jeden shapefile. Importujte je po jednom.';
$ec_lang['lpn_shp_import_unreadable']='{file} není shapefile, který tato stránka umí přečíst: {detail}';
$ec_lang['lpn_shp_import_pick_hint']='Shapefile je několik souborů. Vyberte soubor .shp spolu se soubory .shx, .dbf a .prj (několik souborů vyberete podržením klávesy Ctrl nebo Shift), nebo vyberte soubor .zip.';
$ec_lang['lpn_shp_import_webmerc_ask']='{file} nemá soubor .prj a jeho čísla nejsou zeměpisné šířky a délky, ale odpovídají metrům Web Mercator (EPSG:3857), systému používanému v QGIS a ve webových mapách. Importovat je jako EPSG:3857 a převést do tohoto projektu?';
$ec_lang['lpn_shp_import_webmerc_ok']='Importovat jako EPSG:3857';
$ec_lang['lpn_shp_import_webmerc_far_ask']='{file} uvádí {theirs} a při čtení v tomto systému leží jeho souřadnice {km} km od tohoto projektu. Při čtení jako metry Web Mercator (EPSG:3857), systém používaný v QGIS a ve webových mapách, leží tam, kde je tento projekt. Importovat je jako EPSG:3857 a převést do tohoto projektu?';
$ec_lang['lpn_shp_import_reprojected']='Souřadnice byly převedeny z {theirs} do {ours}.';
$ec_lang['lpn_shp_import_unplaced']='Záznamy se souřadnicemi, které tento projekt nemůže umístit, například se zeměpisnou šířkou za hranicí mapy: {n}. Čísla záznamů: {list}.';
$ec_lang['lpn_shp_import_unplaced_one']='Jeden záznam má souřadnice, které tento projekt nemůže umístit, například zeměpisnou šířku za hranicí mapy. Číslo záznamu: {list}.';
$ec_lang['lpn_shapes_import_none']='Ze souboru {file} nebylo nic importováno.';
$ec_lang['lpn_shp_import_convert_hint']='Pomocí Převést jako… zkopírujte projekt do {theirs} a poté importujte znovu.';
$ec_lang['lpn_shp_import_damaged']='{file} je poškozený nebo useknutý, takže nebylo nic importováno.';
$ec_lang['lpn_shp_import_deleted']='Záznamy označené v souboru .dbf jako smazané a neimportované: {n}.';
$ec_lang['lpn_shp_import_deleted_one']='Jeden záznam označený v souboru .dbf jako smazaný nebyl importován.';
$ec_lang['lpn_dxf_import_paperspace']='v prostoru papíru';
$ec_lang['lpn_shapes_import_more']='a dalších {n}';
$ec_lang['lpn_survey_read_error']='Ten soubor se nepodařilo přečíst z vašeho disku.';
$ec_lang['lpn_survey_cancelled']='Nic nebylo vytvořeno a nic se nezměnilo.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Severní souřadnice';
$ec_lang['lpn_survey_axis_east']='Východní souřadnice';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Ten soubor je prázdný.';
$ec_lang['lpn_survey_err_unreadable']='Ten soubor se nepodařilo přečíst jako seznam zaměřených bodů.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Více než jeden sloupec v tomto souboru by mohl být {axis} ({detail}) a tato stránka mezi nimi nevybírá. Ponechte pojmenován jako {axis} jen jeden z nich a zkuste to znovu.';
$ec_lang['lpn_survey_err_no_points']='Ani jeden řádek tohoto souboru se nepodařilo přečíst jako zaměřený bod. Přečtené řádky: {detail}';
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
$ec_lang['lpn_survey_format_label']='Formát souboru:';
$ec_lang['lpn_survey_format_internal']='zadaný interně';
$ec_lang['lpn_survey_create']='Vytvořit uzly';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='První řádek byl přeskočen: nejmenuje žádné sloupce, které tato stránka zná.';
$ec_lang['lpn_survey_type_label']='Typ prvku:';
$ec_lang['lpn_survey_confirm_junction']='Nalezeno {n} uzlů. Pokračovat?';
$ec_lang['lpn_survey_confirm_reservoir']='Nalezeno {n} zdrojů. Pokračovat?';
$ec_lang['lpn_survey_confirm_tank']='Nalezeno {n} nádrží. Pokračovat?';
$ec_lang['lpn_survey_report_junction']='Importováno {n} uzlů, {m} s nadmořskou výškou.';
$ec_lang['lpn_survey_report_reservoir']='Importováno {n} zdrojů, {m} s nadmořskou výškou.';
$ec_lang['lpn_survey_report_tank']='Importováno {n} nádrží, {m} s nadmořskou výškou.';
$ec_lang['lpn_survey_report_clean']='Každý bod v souboru byl importován beze změny.';
$ec_lang['lpn_survey_report_notes']='Chyby a poznámky importu:';
$ec_lang['lpn_survey_sev_error']='chyba';
$ec_lang['lpn_survey_sev_warning']='upozornění';
$ec_lang['lpn_survey_note_line']='Řádek {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Příliš málo sloupců pro výše uvedený formát souboru.';
$ec_lang['lpn_survey_note_coord_missing']='Buňka {axis} je prázdná.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} se nedá přečíst jako číslo.';
$ec_lang['lpn_survey_note_coord_range']='{axis} je mimo rozsah, který tento projekt povoluje.';
$ec_lang['lpn_survey_note_bad_elev']='Nečíselná nadmořská výška. Importováno bez nadmořské výšky.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Více než jeden sloupec mohl být nadmořská výška, takže žádný z nich nebyl přečten.';
$ec_lang['lpn_survey_note_blank_rows']='Přeskočené prázdné řádky: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Název už byl v tomto souboru použit dříve, přiřazen nový název.';
$ec_lang['lpn_survey_note_id_taken']='Název je už v projektu použit, přiřazen nový název.';
$ec_lang['lpn_survey_note_id_invalid']='Tento název zde nelze použít, přiřazen nový název.';
// Field codes (Task 771): the Description read as Carlson-style codes. See dev/survey-codes.md.
$ec_lang['lpn_survey_codes_toggle']='Číst popis jako terénní kódy';
$ec_lang['lpn_survey_codes_tip']='První slovo každého popisu se čte jako kód z tabulky. Body se stejným kódem linie se spojí do jednoho potrubí v pořadí souboru a WL1 a WL2 jsou samostatné linie. +0 linii zahájí, -0 ji ukončí a CLO ji uzavře. JPN následované názvem bodu se spojí s tímto bodem (Carlson) a Civil 3D to zapisuje jako CPN.';
$ec_lang['lpn_survey_codes_col_code']='Kód';
$ec_lang['lpn_survey_codes_col_type']='Typ prvku';
$ec_lang['lpn_survey_codes_add']='Přidat kód';
$ec_lang['lpn_survey_codes_remove']='Odebrat kód';
$ec_lang['lpn_survey_confirm_coded']='Nalezeno: uzlů {j}, zdrojů {r}, nádrží {t} a potrubí {p}. Pokračovat?';
$ec_lang['lpn_survey_report_coded']='Importováno: uzlů {j}, zdrojů {r}, nádrží {t} a potrubí {p}, z uzlů má nadmořskou výšku {m}.';
$ec_lang['lpn_survey_note_code_unknown']='Kód není v tabulce kódů, importováno jako typ prvku zvolený výše.';
$ec_lang['lpn_survey_note_code_two_nodes']='Více než jeden kód uzlu, použit byl první.';
$ec_lang['lpn_survey_note_code_unread']='Ne každé slovo je kód, který tato stránka čte, ponecháno v popisu.';
$ec_lang['lpn_survey_note_vertex_text']='Ne každé slovo je kód, který tato stránka čte, a vrchol si popis neponechává.';
$ec_lang['lpn_survey_note_join_missing']='JPN nebo CPN uvádí bod, který není v tomto souboru ani projektu, žádné potrubí pro něj nebylo nakresleno.';
$ec_lang['lpn_survey_note_join_no_line']='JPN nebo CPN u bodu bez kódu linie, žádné potrubí pro něj nebylo nakresleno.';
$ec_lang['lpn_survey_note_pipe_one_node']='Tato linie se vrací do téhož uzlu bez jiného uzlu mezi tím, žádné potrubí pro ni nebylo nakresleno.';
$ec_lang['lpn_survey_note_line_one_point']='Jediný bod své linie, žádné potrubí z něj nebylo nakresleno.';
$ec_lang['lpn_survey_note_vertices']='Body, které se staly vrcholy potrubí: {detail}. Vrchol si nezachovává název, nadmořskou výšku ani popis.';
$ec_lang['lpn_survey_note_no_desc']='Terénní kódy jsou zapnuty, ale tento soubor nemá sloupec popisu, proto nebyly přečteny žádné kódy.';
$ec_lang['lpn_survey_note_ring_junction']='Tento bod se stal uzlem, aby se mohl uzavřít okruh.';
$ec_lang['lpn_survey_note_pipe_zero_length']='Tento bod leží na stejném místě jako předchozí uzel, proto má potrubí mezi nimi nulovou délku.';
$ec_lang['lpn_survey_note_node_on_pipe']='Tento bod leží přesně na potrubí, ke kterému není připojen. Pokud jsou propojeny, přidejte JPN.';
$ec_lang['lpn_settings_demand_model']='Model odběru';
$ec_lang['lpn_settings_demand_model_tip']='Zvolte, jak uzly přijímají průtok. Model řízený odběrem (DDA) dodá každý odběr v plné výši bez ohledu na tlak. Model řízený tlakem (PDA) dodá méně, než činí odběr, kde je tlak pod požadovaným tlakem, a počítá jej pouze řešič EPANET.';
$ec_lang['lpn_settings_demand_model_dda']='Řízený odběrem';
$ec_lang['lpn_settings_demand_model_pda']='Řízený tlakem';
$ec_lang['lpn_settings_min_pressure']='Minimální tlak';
$ec_lang['lpn_settings_min_pressure_tip']='Zadejte tlak, při kterém nebo pod kterým uzel nepřijímá žádný průtok. Použijte jednotku tlaku tohoto projektu.';
$ec_lang['lpn_settings_req_pressure']='Požadovaný tlak';
$ec_lang['lpn_settings_req_pressure_tip']='Zadejte tlak, při kterém nebo nad kterým uzel přijímá plný odběr. Musí být větší než minimální tlak. Použijte jednotku tlaku tohoto projektu. Ponecháte-li pole prázdné, použije se výchozí hodnota programu EPANET, která je v psi pro americké jednotky průtoku a jinak v metrech.';
$ec_lang['lpn_settings_pressure_exponent']='Exponent tlaku';
$ec_lang['lpn_settings_pressure_exponent_tip']='Zadejte exponent křivky, která stoupá od nulového průtoku při minimálním tlaku k plnému odběru při požadovaném tlaku.';
$ec_lang['lpn_engine_pda_route']='Vyřešeno pomocí řešiče EPANET, protože model odběru je řízený tlakem.';
$ec_lang['lpn_diag_pda_needs_epanet']='Model odběru je řízený tlakem a počítat jej umí pouze řešič EPANET. Řešič EPANET se nepodařilo načíst, proto tyto výsledky chybí.';
$ec_lang['lpn_result_delivered_demand']='Dodaný odběr';
$ec_lang['lpn_result_delivered_demand_tip']='Průtok, který tento uzel skutečně přijímá podle modelu odběru řízeného tlakem. Je menší než odběr, je-li tlak pod požadovaným tlakem.';
$ec_lang['lpn_result_demand_deficit']='Nedodaný odběr';
$ec_lang['lpn_result_demand_deficit_tip']='Odběr v tomto uzlu, který není dodán, protože tlak je pod požadovaným tlakem.';
$ec_lang['lpn_pda_deficit_note']='Uzly přijímající méně, než činí jejich odběr: {n}.';
$ec_lang['lpn_diag_pda_pressures']='Požadovaný tlak musí být větší než minimální tlak. Změňte jeden z nich v Nastavení.';
$ec_lang['lpn_inp_drop_pressure_unit']='Tento soubor uvádí jinou jednotku tlaku, než jakou tato stránka čte pro jeho jednotku průtoku, což je psi pro americké jednotky a jinak metry. Každý tlak v souboru se čte tímto způsobem, proto zkontrolujte nastavení ventilů, emitory a limity řízené tlakem, které obsahuje. Řádek je zachován a zapisuje se zpět.';

// Map > Screenshot (Tom, 2026-10-05): a snipping tool that re-draws the dragged map area larger than its screen size (3x unless the Screenshot box says otherwise).
$ec_lang['lpn_screenshot_menu']='Snímek obrazovky';
$ec_lang['lpn_screenshot_tip']='Pořídí snímek oblasti mapy, kterou vyberete tažením, v rozlišení vyšším než na obrazovce. Snímek lze označit poznámkami a tlačítkem Kopírovat vložit do zprávy. Kliknutím bez tažení pořídíte snímek celé mapy.';
$ec_lang['lpn_screenshot_hint']='Přetáhněte obdélník přes mapu, nebo kliknutím pořiďte celou mapu. Esc zruší.';
$ec_lang['lpn_screenshot_copied']='Snímek obrazovky byl zkopírován.';
$ec_lang['lpn_screenshot_saved']='Schránka zde není k dispozici, proto byl snímek obrazovky stažen jako soubor PNG.';
$ec_lang['lpn_screenshot_no_basemap']='Uliční mapu nebo satelitní snímek se nepodařilo zahrnout.';
$ec_lang['lpn_screenshot_failed']='Snímek obrazovky se nepodařilo pořídit.';
$ec_lang['lpn_snip_hint_free']='Přetažením obkreslete oblast k výřezu, nebo kliknutím pořiďte celou mapu. Esc zruší.';
$ec_lang['lpn_snip_tip_rect']='Výřez obdélníku (S)';
$ec_lang['lpn_snip_tip_free']='Výřez volného tvaru (S)';
$ec_lang['lpn_snip_tip_mode']='Tvar výřezu';
$ec_lang['lpn_snip_tip_map']='Snímek celé mapy';
$ec_lang['lpn_snip_tip_pen']='Pero';
$ec_lang['lpn_snip_tip_eraser']='Guma: kliknutím na tah jej odstraníte (E)';
$ec_lang['lpn_snip_tip_undo']='Zpět (Ctrl+Z)';
$ec_lang['lpn_snip_tip_redo']='Znovu (Ctrl+Y)';
$ec_lang['lpn_snip_tip_copy']='Kopírovat (Ctrl+C)';
$ec_lang['lpn_screenshot_scale_tip']='Velikost obrázku jako násobek oblasti na obrazovce. Větší obrázek je ostřejší a vytvoří větší soubor.';
