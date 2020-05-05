<?php

// All missing text declarations will fall back to English.

// Birimler (alphabetical order)
// Hesap makinası birim seçimi için gerekli
$ec_lang['u_depthFrac']='oran';
$ec_lang['u_depthPercent']="%";
$ec_lang['u_ft2']="ft^2";
$ec_lang['u_ft3ps']="ft^3/s";
$ec_lang['u_ft']="ft";
$ec_lang['u_fth2o']="ft H2O";
$ec_lang['u_ftps']="ft/s";
$ec_lang['u_gpm']="g/d";
$ec_lang['u_gradePercent']='% Yükselme/İlerleme';
$ec_lang['u_grade']="Yükselme/İlerleme";
$ec_lang['u_in2']="inç^2";
$ec_lang['u_inh2o']="in H2O";
$ec_lang['u_in']="inç";
$ec_lang['u_knpcm2']="kN/cm^2";
$ec_lang['u_knpm2']="kN/m^2";
$ec_lang['u_kpa']="kPa";
$ec_lang['u_lps']="l/s";
$ec_lang['u_m2']="m^2";
$ec_lang['u_m3ps']="m^3/s";
$ec_lang['u_mgd']="g*10^6/gün";
$ec_lang['u_mh2o']="m H2O";
$ec_lang['u_mld']="Ml/d";
$ec_lang['u_m']="m";
$ec_lang['u_mm2']="mm^2";
$ec_lang['u_mmh2o']="mm H2O";
$ec_lang['u_mm']="mm";
$ec_lang['u_mps']="m/s";
$ec_lang['u_npm2']="N/m^2";
$ec_lang['u_pa']="Pa";
$ec_lang['u_psf']="psf";
$ec_lang['u_psi']="psi";
$ec_lang['u_s']="sec";

// Page text
// In page order for easiest maintenance.
// Note: Daha kolay bakım için dil değişkenlerinin sayfa sıralamasına göre ayarlanması sürecinde
$ec_lang['menu_brand']='HawsEDC Calculators';
$ec_lang['menu_main_list']='Hesap makinası listesi';
$ec_lang['menu_main_hydraulics']='Hidrolik';
$ec_lang['menu_main_language']='Dil';
$ec_lang['template_welcome']='&gt;&gt; Drop your fears at the door; love is spoken here. &lt;&lt;';
$ec_lang['template_translation_help']="Bu hesap makinesini kendi dilinize çevirmek ya da bu hesap makinesini web sitenizde göstermek ister misiniz? Türkçe çeviri için Mustafa Özbay'a tesekkür ederim.";
$ec_lang['template_feedback']='Lütfen görüslerinizi ve begenileriniz bizimle paylasin. Bu ücretsiz hesap makinesi beklentilerinizi karsilayabildi mi?';
$ec_lang['template_printable_title']='Printable Title';
$ec_lang['template_printable_subtitle']='Printable Subtitle';
$ec_lang['index_title']='Bedava çevrimiçi mühendislik hesaplayıcıları';
$ec_lang['calc_set_units']='Birimleri ayarla:';
$ec_lang['calc_inputs']='Inputs';
$ec_lang['calc_results']='Sonuçlar:';
$ec_lang['view_hide_line']='[Hide this line]';
$ec_lang['view_printable']='Printable version (reload/refresh to restore)';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Darcy-Weisbach Pipe Head Loss';
$ec_lang['dw_main_title']='Free Online Darcy-Weisbach Pipe Head Loss Calculator';
$ec_lang['dw_main_desc']='Darcy-Weisbach Pipe Head Loss at Given Diameter, Roughness, and Flow';
$ec_lang['dw_roughness']='Darcy-Weisbach absolute roughness, e';
$ec_lang['dw_kinematic_viscosity']='Kinematic viscosity, v, in m<sup>2</sup>/sec (1E-6 for clean water at room temperature)';
$ec_lang['dw_reynolds_number']='Reynolds number, Re';
$ec_lang['dw_flow_regime']='Flow regime';
$ec_lang['dw_regime_laminar']='laminar';
$ec_lang['dw_regime_transitional']='transitional';
$ec_lang['dw_regime_turbulent']='turbulent';
$ec_lang['dw_friction_factor_method']='Friction factor method';
$ec_lang['dw_friction_factor']='Friction factor, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Hazen-Williams Pipe Head Loss';
$ec_lang['hw_main_title']='Free Online Hazen-Williams Pipe Head Loss Calculator';
$ec_lang['hw_main_desc']='Hazen-Williams Pipe Head Loss at Given Diameter, Roughness, and Flow';
$ec_lang['hw_roughness']='Hazen-Williams coefficient, C';
// Manning Irregular
$ec_lang['mi_menu']='Manning Irregular Channel';
$ec_lang['mi_main_title']='Free Online Manning Irregular Channel Calculator';
$ec_lang['mi_main_desc']='Irregular Channel Manning Uniform Flow Calculator';
$ec_lang['mi_waterSurfaceElevation']='Water surface elevation';
$ec_lang['mi_q_sum']='Q by sum of segments';
$ec_lang['mi_q_617']='Q by sum of regions with composite n per Chow 6-17 equal velocities';
$ec_lang['mi_q_618']='Q by sum of regions with composite n per Chow 6-18 equilibrium of forces';
$ec_lang['mi_xSecPoints']='Cross section points';
$ec_lang['mi_station']='Sta';
$ec_lang['mi_elevation']='Elev';
$ec_lang['mi_q']='Q';
$ec_lang['mi_n']='n<br />for seg-<br />ment';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />region<br />boundary<br />(Bank)';
$ec_lang['mi_v']='v';
$ec_lang['mi_t']='T';
$ec_lang['mi_f']='f';
$ec_lang['mi_d50_strickler']='Strickler<br />Implied<br />D<sub>50</sub>';
$ec_lang['mi_d50_mc']='MC<br />Requ\'d.<br />D<sub>50</sub>';
$ec_lang['mi_d50_mra']='MRA<br />Requ\'d.<br />D<sub>50</sub>';
$ec_lang['mi_d50_searcy']='Searcy<br />Requ\'d.<br />D<sub>50</sub>';
$ec_lang['mi_hv']='H<sub>v</sub>';
$ec_lang['mi_tau']='Shear<br />&tau;';
$ec_lang['mi_a']='A';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_notes']='Notes';
$ec_lang['mi_notes_1_term']='Q Methods';
$ec_lang['mi_notes_1_def']='Q by sum of conveyances underestimates the frictional contribution from steep segments. Q by composite n overestimates the effect of wide shallow (overbank) friction on flow in deeper areas (main channel).';
$ec_lang['mi_notes_2_term']='D50 Values';
$ec_lang['mi_notes_2_def']='The Strickler D<sub>50</sub> is the size (for a straight and clean channel) implied by the roughness entered. The other D<sub>50</sub> results are required to resist erosion per 1) Maricopa County and Robinson Rock Chutes, 2) Maynord, Ruff, and Abt (1989), and 3) Searcy (1967)';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning boru akımı';
$ec_lang['mpf_main_title']="Belli Egim ve Yükseklikteki Düzgün Akis Için Manning Formülü";
$ec_lang['mpf_main_desc']="Belli Egim ve Yükseklikteki Düzgün Akis Için Manning Formülü";
$ec_lang['mpf_spreadheet_notice']='Check out our spreadsheet version of this calculator';
$ec_lang['mpf_spreadheet_link_download']='Download Spreadsheet';
$ec_lang['mpf_spreadheet_link_Google']='Open Google Sheets version';
$ec_lang['mpf_spreadheet_view_all']='View All Spreadsheets';
$ec_lang['mpf_pipe_diameter']="Boru Çapı, d0";
$ec_lang['mpf_manningRoughness']='Manning pürüzlülük katsayısı, n';
$ec_lang['mpf_friction_slope']='Basinç Egimi (<a target="_blank"
href="../pressureslope.php">Boru Egimi</a>)';
$ec_lang['mpf_depth_ratio']='Tam derinlik yüzdesi (ya da orani) (Eger tam dolu boru ise 100% ya da 1)';
$ec_lang['mpf_flow']='Akış, q';
$ec_lang['mpf_velocity']='Hız, v';
$ec_lang['mpf_velocity_head']='Hız Yükü, hv';
$ec_lang['mpf_flow_area']='Akis Alani';
$ec_lang['mpf_wetted_perimeter']='Islak Çevre';
$ec_lang['mpf_hydraulic_radius']='Hidrolik Yariçap';
$ec_lang['mpf_top_width']='Üst Genisligi, T';
$ec_lang['mpf_froude_number']='Froude Sayısı, F';
$ec_lang['mpf_shear_stress']='Kayma Gerilmesi, τ';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Tam Akis Sartlarinda Yük Kaybi';
$ec_lang['mphl_main_title']='Ücretsiz Tam Akis Sartlarinda Manning Yük Kaybi Formülü';
$ec_lang['mphl_main_desc']='Tam Akış Şartlarında Manning Yük Kaybı Formülü';
$ec_lang['mphl_pipe_length']='Boru Uzunluğu, l';
$ec_lang['mphl_elevation_1']='Elevation 1';
$ec_lang['mphl_pressure_head_1']='Pressure head 1';
$ec_lang['mphl_elevation_2']='Elevation 2';
$ec_lang['mphl_pressure_head_2']='Pressure head 2';
$ec_lang['mphl_area']='Area, A';
$ec_lang['mphl_total_junction_k']='Pürüzsüzlük Katsayısı, k';
$ec_lang['mphl_friction_slope']='Friction slope';
$ec_lang['mphl_friction_loss']='Sürtünmeye Bağlı Yük Kaybı, Hf';
$ec_lang['mphl_junction_loss']='İkincil Yük Kayıpları, Hm';
$ec_lang['mphl_total_loss']='Toplam Yük Kaybı, Hl';
$ec_lang['mphl_hgl_1']='HGL 1';
$ec_lang['mphl_hgl_2']='HGL 2';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Belli Eğim ve Derinlikteki Düzgün Trapezoidal Kanallar';
$ec_lang['mtc_main_title']='Ücretsiz Belli Eğim ve Derinlikteki Düzgün Trapezoidal Kanallar için Manning Formülü';
$ec_lang['mtc_main_desc']='Belli Eğim ve Derinlikteki Düzgün Trapezoidal Kanallar için Manning Formülü';
$ec_lang['mtc_bottom_width']='Dip Genişliği';
$ec_lang['mtc_side_slope_1']='Yan Eğim 1 (yatay / dikey)';
$ec_lang['mtc_side_slope_2']='Yan Eğim 2 (yatay / dikey)';
$ec_lang['mtc_channel_slope']='Kanal Eğimi';
$ec_lang['mtc_flow_depth']='Akış Derinliği';
$ec_lang['mtc_bend_angle']='Bend Angle<a target="_blank" href="/riprap-bend-angle.png" title="Click for image">?</a> (for riprap sizing)';
$ec_lang['mtc_sgrock']='Stone specific gravity (2.65)';
$ec_lang['mtc_d50_bottom']='<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required bottom angular riprap size Gerekli açısal taban örtüsü boyutu, D50, Maricopa County</span>';
$ec_lang['mtc_d50_mra']='Required angular riprap size Gerekli açısal taban örtüsü boyutu, D50, per Maynord, Ruff, and Abt (1989)';
$ec_lang['mtc_d50_searcy']='Required angular riprap size Gerekli açısal taban örtüsü boyutu, D50, per Searcy (1967)';
$ec_lang['mtc_d50_strickler']='<span title="per Strickler (Adjust n so this equals your design lining size n değerini ayarlayın böylece sizin tasarım örtü boyuna eşit olsun)">Implied riprap size based on n n’ye bağlı uygulanan örtü boyutu</span>';
$ec_lang['mtc_d50_z1']='<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required side slope 1 angular riprap size,yan eğim 1 için gerekli açısal örtü boyutu D50, Maricopa County</span>';
$ec_lang['mtc_d50_z2']='<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required side slope 2 angular riprap size, yan eğim 2 için gerekli açısal örtü boyutu D50, Maricopa County</span>';
// Robinson Rock Chute
$ec_lang['rrc_main_menu']="Robinson Rock Chute Design Robinson Rock Şüt(Paraşüt) Tasarımı";
$ec_lang['rrc_main_desc']="Robinson Rock Chute Design Spreadsheet Robinson Rock Şüt(Paraşüt) Tasarımı Excel Sayfası";
// Weir Flow Simple\n// Weir Flow Simple
$ec_lang['ws_main_menu']='Basit Savaklar için Debi Hesabı';
$ec_lang['ws_main_title']='Ücretsiz Basit Savaklar için Debi Hesabı Broad-crested Geniş-kretli';
$ec_lang['ws_main_desc']='Basit Savaklar için Debi Hesabı Broad-crested Geniş-kretli';
$ec_lang['ws_weirLength']='Savak Uzunluğu, l';
$ec_lang['ws_headWaterHeight']='Su Yüksekliği, h';
$ec_lang['ws_weirCoefficient']='Savak Sabiti, Cw (Savağa bağlıdır. Geniş tepeli savak için, kret genişliği, derinliği, ve üst kenar şekline bağlı olarak bu değer
feet biriminde işlem yapılıyorsa 2.3 ve 3.3 arasında değişir.)';
$ec_lang['ws_notes_heading']='Not';
$ec_lang['ws_notes_we_term']='Savak Denklemi';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Değişken Derinlikte, Düzensiz Savak Debisi Hesabı';
$ec_lang['wi_main_title']='Ücretsiz Değişken Derinlikte, Düzensiz Savak Debisi Hesabı Broad-crested Geniş-kretli';
$ec_lang['wi_main_desc']='Değişken Derinlikte, Düzensiz Savak Debisi Hesabı Broad-crested Geniş-kretli';
$ec_lang['wi_headWaterelevation']='Su Yüksekliği';
$ec_lang['wi_weirPoints']='Savak Noktaları';
$ec_lang['wi_station']="Kanal";
$ec_lang['wi_elevation']="Yükseklik";
$ec_lang['wi_pondingHeight']='Göllenme Yüksekliği';
$ec_lang['wi_incrementalFlow']='Artımlı Akış';
$ec_lang['wi_cumulativeFlow']='Kümülatif Akış';
$ec_lang['wi_save_and_calculate']='Kaydet ve Hesapla';
$ec_lang['wi_or_adjust']="ya da";
$ec_lang['wi_n_rows']="sıraların sayısı";
$ec_lang['wi_notes_we_term']='Weir Equation Weir denklemi';
$ec_lang['wi_notes_we_def']='q = eğer (uzunluk = 0) ise 0, eğer (eğim=0) ise cw*uzunluk*d01.5, ya da d1 ve d0’ın daima pozitif veya sıfır olduğu yerde q=
cw/(2.5*eğim) * (d02.5 - d12.5)';
// Contact us.
$ec_lang['contact_title']='Haws EDC Iletisim';
$ec_lang['contactSendMessage']="Tom Haws'a bir mesaj gönderin";
$ec_lang['contactYourName']='Isim:';
$ec_lang['contactYourEmail']='E-mail Adresi:';
$ec_lang['contactSubject']='Konu:';
$ec_lang['contact_message']='Mesaj:';
$ec_lang['contactSpamPrefix']='Bes arti bir';
$ec_lang['contactSpamPostfix']='(Lütfen yaziyla gösterin. 1= bir 2=iki 3=üç 4=dört 5=bes 6=alti 7=yedi +=arti 5+1=6)';
$ec_lang['contactSubmitButton']='Gönder';
?>

