<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='oran';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='ft^3/s';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/s';
$ec_lang['u_gpm']='g/d';
$ec_lang['u_gradePercent']='% Yükselme/Yatay Mesafe';
$ec_lang['u_grade']='Yükselme/Yatay Mesafe';
$ec_lang['u_in2']='inç^2';
$ec_lang['u_inh2o']='in H2O';
$ec_lang['u_in']='inç';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='L/s';
$ec_lang['u_m2']='m^2';
$ec_lang['u_m3ps']='m^3/s';
$ec_lang['u_mgd']='g*10^6/gün';
$ec_lang['u_imgd']='İg*10^6/gün';
$ec_lang['u_afd']='ac-ft/gün';
$ec_lang['u_lpm']='L/dak';
$ec_lang['u_cmh']='m^3/sa';
$ec_lang['u_cmd']='m^3/gün';
$ec_lang['u_mh2o']='m H2O';
$ec_lang['u_mld']='ML/d';
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
$ec_lang['u_s']='sn';
$ec_lang['u_hr']='sa';
$ec_lang['u_day']='gün';
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
$ec_lang['menu_brand']='HawsEDC Hesap Makineleri';
$ec_lang['menu_main_hydraulics']='Hidrolik';
$ec_lang['menu_help']='Yardım';
$ec_lang['menu_libre']='Özgür Yazılım';
$ec_lang['template_welcome']='Korkularını kapıda bırak; burada sevgi konuşulur. Her şeyi mahvetmiyorsun. <a target="_blank" href="https://hawsedc.com/download.php">Ücretsiz HawsEDC AutoCAD araçlarını</a> da deneyin.';
$ec_lang['template_feedback']='Bu sayfadaki ifadeler için daha iyi bir öneriniz mi var, yoksa başka bir şey mi? Yardımcı olmak ya da bunun gibi araçlar yapmayı öğrenmek ister misiniz? Lütfen benimle iletişime geçin.';
$ec_lang['template_printable_title']='Yazdırılabilir Başlık';
$ec_lang['template_printable_subtitle']='Yazdırılabilir Alt Başlık';
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
$ec_lang['consent_body']='Bu sayfayı zaten saydığımızı hatırlamak için bu tarayıcıda tek haneli bir çerez saklayabilir miyiz? Hakkınızda hiçbir şey ve yazdığınız hiçbir şey kaydetmez. Bu olmadan, ikinci ziyaretinizi başka birinin ilk ziyaretinden ayırt edemeyiz.';
$ec_lang['consent_accept']='Kabul et';
$ec_lang['consent_accept_all']='Her zaman kabul et';
$ec_lang['consent_decline']='Her zaman reddet';
$ec_lang['consent_current_granted']='Buna izin verdiniz. Bu tarayıcı profili için kaydı sınırlıyoruz.';
$ec_lang['consent_current_denied']='Bunu reddettiniz. Bu tarayıcı profili için kaydı sınırlamak amacıyla hiçbir şey saklamıyoruz.';
$ec_lang['consent_region_label']='Kaydı sınırlama tercihiniz.';
$ec_lang['consent_settings_link']='Çerez ayarları';
$ec_lang['privacy_link']='Gizlilik bildirimi';
$ec_lang['terms_link']='Kullanım koşulları';
$ec_lang['index_main_title']='Bedava çevrimiçi mühendislik hesaplayıcıları';
$ec_lang['index_meta_desc_plain']='Boru, kanal, savak ve sulama için ücretsiz hidrolik mühendislik hesaplayıcıları. Tarayıcınızda çalışır, çevrimdışı kullanılabilir ve 27 dilde sunulur.';
$ec_lang['calc_set_units']='Birimleri ayarla:';
$ec_lang['calc_set_units_tip']='Her alanın birimini bir kerede ayarlar. Yıkıcı değildir: yazdığınız sayılar tam olarak kaldığı gibi kalır, yalnızca artık yeni birimde okunur. 6, 6 olarak kalır, ama artık 6 milimetre yerine 6 inç anlamına gelir.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Varsayılanları geri yükle';
$ec_lang['calc_defaults_confirm']='Hesap makinesini varsayılan değerlere sıfırla?';
$ec_lang['points_data_note']='(veya veri alanını kullanarak Kopyala/Yapıştır)';
$ec_lang['points_data_heading']='Nokta verileri<br />(virgül veya sekme ile ayrılmış)';
$ec_lang['points_data_copy']='Kopyala';
$ec_lang['points_data_paste']='Yapıştır';
$ec_lang['calc_inputs']='Girdiler';
$ec_lang['calc_results']='Sonuçlar:';
$ec_lang['view_hide_line']='Bu satırı gizle';
$ec_lang['view_printable']='Yazdırılabilir sürüm (geri yüklemek için yeniden yükleyin)';
$ec_lang['ec_name_label']='Bu hesaplamayı kaydet:';
$ec_lang['ec_name_placeholder']='Ad';
$ec_lang['ec_name_tip']='Bu girdileri URL\'ye kaydeder (yer işareti, geçmiş ve paylaşım için)';
$ec_lang['calc_copy_link']='Bağlantıyı kopyala';
$ec_lang['ec_related_calcs']='İlgili hesaplayıcılar:';
$ec_lang['calc_copy_link_done']='Kopyalandı!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Darcy-Weisbach Boru Yük Kaybı';
$ec_lang['dw_main_title']='Ücretsiz Çevrimiçi Darcy-Weisbach Boru Yük Kaybı Hesaplayıcısı';
$ec_lang['dw_main_desc']='Verilen Çap, Pürüzlülük ve Akış için Darcy-Weisbach Boru Yük Kaybı';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Boru cidarının mutlak pürüzlülük yüksekliği, e. Tipik değerler: çelik (yeni) 0,046 mm, çelik (kullanılmış) 0,15 mm, HDPE 0,003 mm, PVC/uPVC 0,0015 mm, beton 0,3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="Temiz su için 20°C\'de 1×10⁻⁶ m²/s">Kinematik viskozite, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Kinematik viskozite, ν';
$ec_lang['dw_kinematic_viscosity_tip']='Temiz su için 20°C\'de 1×10⁻⁶ m²/s';
$ec_lang['dw_reynolds_number']='Reynolds sayısı, Re';
$ec_lang['dw_flow_regime']='Akış rejimi';
$ec_lang['dw_regime_laminar']='laminer';
$ec_lang['dw_regime_transitional']='geçişli';
$ec_lang['dw_regime_turbulent']='türbülanslı';
$ec_lang['dw_friction_factor_method']='Sürtünme faktörü yöntemi';
$ec_lang['dw_friction_factor']='Sürtünme faktörü, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Hazen-Williams Boru Yük Kaybı';
$ec_lang['hw_main_title']='Ücretsiz Çevrimiçi Hazen-Williams Boru Yük Kaybı Hesaplayıcısı';
$ec_lang['hw_main_desc']='Verilen Çap, Pürüzlülük ve Akış için Hazen-Williams Boru Yük Kaybı';
$ec_lang['hw_hgl_1']='Mansap HGL';
$ec_lang['hw_hgl_2']='Memba HGL';
$ec_lang['hw_elev_up']='Memba kotu';
$ec_lang['hw_pressure_up']='Memba basıncı';
$ec_lang['hw_elev_down']='Mansap kotu';
$ec_lang['hw_pressure_down']='Mansap basıncı';
$ec_lang['hw_pressure_check']='Basınç kontrolü';
$ec_lang['hw_pressure_ok_short']='Pozitif basınç';
$ec_lang['hw_pressure_neg_short']='Negatif basınç';
$ec_lang['hw_pressure_neg']='Mansap basıncı sıfırın altında. HGL borunun altına düşüyor, bu nedenle boru tam dolu akmayabilir ve bu sonuç geçerli olmayabilir.';
$ec_lang['hw_roughness']='Hazen-Williams katsayısı, C';
$ec_lang['hw_note_1']='<dl><dt>Bu hesaplayıcı, iki uç arasındaki boru profilini modellemez.</dt><dd>Yalnızca girdiğiniz memba ve mansap kotlarını kullanır. Zemin, aradaki bir noktada her iki uçtan daha yükseğe çıkıyorsa, o yüksek noktadaki basınç burada bildirilen basınçlardan daha düşüktür. Bunu kontrol etmek için hesaplayıcıyı, memba ucundan yüksek noktaya kadar olan uzunluk için tekrar çalıştırın.</dd><dd>HGL\'nin borunun altına düştüğü yerlerde, su negatif basınç altındadır. Hava çözeltiden çıkar, ince cidarlı bir boru çökebilir ve kirli yeraltı suyu eklem yerlerinden içeri çekilebilir. Hattı her yerde pozitif basınç altında tutun ve her yüksek noktada bir hava vanası kullanmayı düşünün.</dd><dt>Memba basıncı, sizin sağladığınız bir sınır koşuludur.</dt><dd>Bunu bir manometreden, bir tank su seviyesinden (borunun üzerindeki su yüksekliği) veya bir pompa eğrisinden okuyun. Debi arttıkça pompa daha az basınç sağlar, bu yüzden yukarıda girilen debiye karşılık gelen eğri üzerindeki noktayı kullanın.</dd><dt>Yerel kayıp katsayılarını kendiniz toplayın.</dt><dd>Hat üzerindeki her vana, dirsek, T-parçası, sayaç ve giriş için K değerlerini toplayın ve bu toplamı girin. Tipik değerler için o girdinin yanındaki bağlantıyı izleyin. Uzun bir iletim hattında bu kayıplar sürtünmenin yanında küçüktür, ancak kısa istasyon borulamasında kayıpların çoğunu oluşturabilirler.</dd></dl>';
$ec_lang['hw_notes_epanet_term']='Hazen-Williams sabitleri artık EPANET ile aynı (Ağustos 2026)';
$ec_lang['hw_notes_epanet_def']='Ağustos 2026\'da Hazen-Williams katsayısı ve üssü, EPANET ile aynı olacak şekilde değiştirildi. Yük kaybı sonuçları bu sayfanın önceki sürümlerinden en fazla yüzde 0,1 farklıdır; bu, C değerinin kendi belirsizliğinden çok daha küçüktür.';
// Manning Irregular
$ec_lang['mi_menu']='Manning Düzensiz Kesitli Kanal';
$ec_lang['mi_main_title']='Ücretsiz Çevrimiçi Manning Düzensiz Kesitli Kanal Hesaplayıcısı';
$ec_lang['mi_main_desc']='Düzensiz Kesitli Kanal Manning Düzgün Akış Hesaplayıcısı';
$ec_lang['mi_waterSurfaceElevation']='Su yüzeyi kotu';
$ec_lang['mi_q_617']='<span class="ec-help" title="Chow 6-17\'ye göre her bölge için bileşik n kullanılarak hesaplanan bileşik akış, Q (eşit hızlar)">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Kesit noktaları';
$ec_lang['mi_groupPoint']='Nokta';
$ec_lang['mi_groupSegment']='Bölüm';
$ec_lang['mi_groupRegion']='Bölge';
$ec_lang['mi_station']='İst.';
$ec_lang['mi_elevation']='Kot';
$ec_lang['mi_n']='n<br />böl.';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />bölge<br />sınırı<br />(Kıyı)';
$ec_lang['mi_tau']='Taban<br />kaym.<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='Bileş.<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='Bileşik n';
$ec_lang['mi_notes_1_def']='Bu hesaplayıcı, bölge bileşik n hesabı için HEC-RAS Referans Kılavuzunu takip eder: Chow 1959, sayfa 136, denklem 6-17 (6-18 değil).';
$ec_lang['mi_notes_3_term']='Düzeltmeler';
$ec_lang['mi_notes_3_def']='23 Ağustos 2026\'da bulundu ve düzeltildi. Tam dikey çizilen bir kesim — aynı istasyonda, biri diğerinin üstünde iki nokta, dikdörtgen bir kanalın, kutu menfezin veya istinat duvarının çizilme biçimi — ıslak çevreye hiçbir katkı eklemiyordu. Bu tarihten önceki sonuçlar, dikey duvarlı her kesit için gereğinden yüksektir: 10 genişliğinde ve 5 derinliğinde bir kanala, 20 yerine 10\'luk bir ıslak çevre veriliyordu ve debi, doğru değerin yaklaşık 1,6 katıydı. Ne kadar dik olursa olsun eğimli bir şev hiçbir zaman etkilenmedi, suyun üzerinde duran bir duvar da etkilenmedi. Bu sayfayı dikey duvarlı bir kesitte kullandıysanız, lütfen yeniden çalıştırın.';
$ec_lang['mi_notes_2_term']='Taş kaplama';
$ec_lang['mi_notes_2_def']='Taş kaplama tasarımı için Manning Trapezoidal Kanal Hesaplayıcısını kullanın. Bu hesaplayıcı daha çok doğal kesitler içindir.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning Boru Akışı';
$ec_lang['mpf_main_title']='Ücretsiz Çevrimiçi Manning Boru Akışı Hesaplayıcısı';
$ec_lang['mpf_main_desc']='Belirli Eğim ve Derinlikte Manning Formülü ile Düzgün Boru Akışı';
$ec_lang['mpf_pipe_diameter']='Boru çapı, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Manning pürüzlülük katsayısı, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Sürtünme eğimi, S<sub>f</sub></a><span class="ec-help" title="Bazen boru eğimine eşit. Açıklama için bağlantıyı izleyin (yalnızca İngilizce)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Göreli akış derinliği, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Debi, Q';
$ec_lang['mpf_flow_tip']='Akış ve derinlik, sonsuz uzunluktaki bir boru için hesaplanmıştır. Bu akışın boruya girebilmesi için daha yüksek bir memba derinliği gerekebilir. Ayrıntılar ve bir öğretici video için aşağıdaki Notlar bölümüne bakın.';
$ec_lang['mpf_velocity']='Hız, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Su sütunu yüksekliği olarak kinetik enerji, v²/2g">Hız yükü, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Akış alanı, A';
$ec_lang['mpf_pipe_area']='Boru alanı, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Göreli alan, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Islak çevre, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Hidrolik yarıçap, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Üst genişlik, T';
$ec_lang['mpf_froude_number']='Froude sayısı, Fr';
$ec_lang['mpf_shear_stress']='Ortalama kayma gerilmesi, τ';
$ec_lang['mpf_full_flow']='Tam akış, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Tam akışa oran, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Bu, <em>sonsuz uzunluktaki</em> bir borunun içindeki akış ve derinliktir.</dt><dd>Akışın boruya girmesi için önemli ölçüde daha yüksek memba derinliği gerekebilir. Memba derinliğini elde etmek için en az 1,5 hız yükü ekleyin ya da standart menfez memba hesaplamaları için <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">2 dakikalık öğreticime bakın</a>; bu hesaplamalarda ABD Federal Karayolları İdaresi\'nin (FHWA) ücretsiz menfez programı olan <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>\'i kullanır.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Atıksu kanalizasyon hattı mı tasarlıyorsunuz?</dt><dd>4 ila 96 inç (100 ila 2400 mm) arası borular için m/m, mm/m ve yüzde cinsinden verilen <a target="_blank" href="/sewslope.php">minimum kanalizasyon eğim tablolarına</a> ve çok düşük debiler için <a target="_blank" href="/peakfact.php">tepe debi faktörleri</a> çalışmasına bakın. Her ikisi de yalnızca İngilizce referans belgeleridir.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Pozitif bir hedef Q girin.';
$ec_lang['mpf_solver_no_solution']='Çözüm yok: Q, y/d0 = %93,8\'de boru kapasitesini aşıyor (Qmax = {qmax}, seçilen birimlerde).';
$ec_lang['mpf_solve_btn']='Hesapla';
$ec_lang['mpf_solve_for_flow']='debi için, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Manning Boru Yük Kaybı';
$ec_lang['mphl_main_title']='Ücretsiz Çevrimiçi Manning Boru Yük Kaybı Hesaplayıcısı';
$ec_lang['mphl_main_desc']='Belirli Tam Akışta Manning Formülü Yük Kaybı';
$ec_lang['mphl_pipe_length']='Uzunluk, L';
$ec_lang['mphl_area']='Alan, A';
$ec_lang['mphl_total_junction_k']='Küçük (yerel) kayıp katsayısı, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Kayıp katsayısı, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Küçük (yerel) kayıp katsayısı, km. Bu kayıplar boru bağlantılarında, girişlerde, çıkışlarda, dirseklerde ve vanalarda oluşur — "küçük" terimi geleneksel bir adlandırmadır ancak yanıltıcıdır; kısa bir hatta bu kayıplar sürtünme kayıplarına eşit olabilir, hatta onları aşabilir. Tipik k değerleri: keskin kenarlı giriş 0,5, her 45° dirsek 0,2–0,3, sürgülü vana (tam açık) 0,1, kelebek vana 0,2, çıkış (rezervuara veya atmosfere) 1,0. Toplam km için tüm bağlantı elemanlarını toplayın. Varsayılan değer olan 2,0; bir giriş, bir çıkış ve iki adet 45° dirsek varsayımına dayanır.';
$ec_lang['mphl_friction_slope']='Sürtünme eğimi';
$ec_lang['mphl_friction_loss']='Sürtünme kaybı, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Küçük (yerel) kayıp, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Toplam kayıp, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='Mansap EGL';
$ec_lang['mphl_egl_2']='Memba EGL';
$ec_lang['mphl_hgl_egl_tip']='Boru, hidrolik gradyan çizgisinin üzerine çıktığı yerde bu sonuç geçerli olmayabilir.';
$ec_lang['mphl_note_1']='<dl><dt>Bu hesaplayıcı, iki uç arasındaki boru profilini modellemez.</dt><dd>HGL herhangi bir noktada boru üstünün altına düşerse, bu hesaplama geçerli olmayabilir.</dd><dt>Açık giriş (menfez) koşulunda, giriş kontrolü koşullarının kontrol edilmesi gerekir.</dt><dd>1. Memba HGL\'si, memba normal derinlik akış kotundan (veya borudan) düşük olamaz.</dd><dd>2. Bir menfezin memba su yüzü, memba HGL\'sinden ziyade memba EGL\'si ile daha iyi temsil edilir.</dd><dd>3. Basit standart menfez memba hesaplamaları için <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">2 dakikalık öğreticime bakın</a>; bu hesaplamalarda ABD Federal Karayolları İdaresi\'nin (FHWA) ücretsiz menfez programı olan <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>\'i kullanır.</dd><dd>4. Bu sayfa yalnızca çıkış kontrolü durumunu çözer: mansap koşullarının yükü belirlediği, tam dolu akan bir boru. Menfez tasarımı, giriş kontrolünün mü yoksa çıkış kontrolünün mü geçerli olduğuna karar vermeyi gerektirir; bu yüzden ikisinden biri geçerli olabiliyorsa HY-8 kullanın.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Manning Trapezoidal Kanal';
$ec_lang['mtc_main_title']='Ücretsiz Çevrimiçi Manning Formülü Trapezoidal Kanal Hesaplayıcısı';
$ec_lang['mtc_main_desc']='Belli Eğim ve Derinlikteki Düzgün Trapezoidal Kanallar için Manning Formülü';
$ec_lang['mtc_bottom_width']='Taban genişliği, b';
$ec_lang['mtc_side_slope_1']='Yan Eğim 1, z<sub>1</sub> (yatay / dikey)';
$ec_lang['mtc_side_slope_2']='Yan Eğim 2, z<sub>2</sub> (yatay / dikey)';
$ec_lang['mtc_channel_slope']='Kanal Eğimi, S';
$ec_lang['mtc_flow_depth']='Akış Derinliği, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Kurp Açısı, β</a><span class="ec-help" title="Taş dolgu boyutlandırması için. Şema için bağlantıyı izleyin."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Suya göre yoğunluk. Kırma taş için tipik ≈ 2,65.">Taşın özgül ağırlığı, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Tasarım taş boyutu, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='Tasarım taş boyutundan n (Strickler yöntemi)';
$ec_lang['mtc_n_blodgett']='Tasarım taş boyutundan n (Blodgett yöntemi)';
$ec_lang['mtc_n_bathurst']='Tasarım taş boyutundan n (Bathurst yöntemi)';
$ec_lang['mtc_n_pi']='Tasarım taş boyutundan n (Phillips ve Ingersoll yöntemi)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett ve Bathurst karşılaştırması';
$ec_lang['mtc_pi_range_check']='P&I aralık kontrolü';
$ec_lang['mtc_pi_ok']='d50, P&I aralığında';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Aralık dışı';
$ec_lang['mtc_pi_tip']='Bu denklemin türetildiği 0.28–0.36 ft veri seti aralığının dışına ekstrapolasyon yapılıyor — tasarım esası değil, kaba bir kontrol olarak değerlendirin';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Isbash (1936) ve Maricopa County, Arizona, US\'ye göre.">Taban için gerekli köşeli taş boyutu, D<sub>50</sub> (Isbash ve MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Isbash (1936) ve Maricopa County, Arizona, US\'ye göre.">Yan eğim 1 için gerekli köşeli taş boyutu, D<sub>50</sub> (Isbash ve MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Isbash (1936) ve Maricopa County, Arizona, US\'ye göre.">Yan eğim 2 için gerekli köşeli taş boyutu, D<sub>50</sub> (Isbash ve MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Maynord, Ruff ve Abt\'a (1989) göre. Bir dönemeçte kaya, California Division of Highways\'e (1970) göre ortalamanın 4/3\'ü olan dönemeç hızına göre boyutlandırılır; Maynord\'un kendi 1,5 katsayısı doğal kanallara uygulanır.">Gerekli köşeli taş boyutu, D<sub>50</sub> (Maynord, Ruff ve Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Gerekli köşeli taş boyutu, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Hız, düzgün akış varsayımları için makul.';
$ec_lang['mtc_vel_low']='Hız düşük — çökelme riski.';
$ec_lang['mtc_vel_high']='Hız yüksek ve gerçekçi olmayabilir; kanal kaplamasının erozyonunu, dirseklerde gereken ek derinliği ve genişlemelerde veya engellerde oluşan enerji kaybını kontrol edin.';
$ec_lang['mtc_iteration_tip']='Hedef akışınız için düzgün bir taş boyutuna otomatik olarak yaklaşmak üzere bir pürüzlülük seçeneği (Blodgett–Bathurst önerilir) ve bir taş boyutu seçeneği (Isbash önerilir) seçin. Tam yöntem için aşağıdaki Notlar bölümüne bakın veya döngüyü atlamak için kendi pürüzlülük değerinizi (rehberlik için bağlantıyı izleyin) girip taş boyutunu yoksayın.';
$ec_lang['mtc_note_1']='<dl><dt>Otomatik taş boyutu ve pürüzlülük tasarım yinelemesi</dt><dd>Bir pürüzlülük seçeneği (Blodgett–Bathurst önerilir) ve bir tasarım taş boyutu seçeneği (Isbash önerilir) seçin. Tek biçimli bir taş boyutuyla hedef debinize ulaşmak için derinliği ve taş boyutu güvenlik faktörünü ayarlayın. Bir girdiyi her değiştirdiğinizde hesaplayıcı şu adımları tekrarlar: 1. Pürüzlülük, tasarım taş boyutundan hesaplanır. 2. Seçtiğiniz yöntemden gelen pürüzlülük değeri, pürüzlülük girdisine kopyalanır. 3. Kanal debisi ve gereken taş boyutu hesaplanır. 4. Tasarım taş boyutu ayarlanır. 5. Tasarım taş boyutundaki hata çok küçük olana kadar tekrarlanır.</dd><dt>Temel hesaplayıcı (yineleme yok)</dt><dd>İstediğiniz pürüzlülük değerini girin. Tasarım taş boyutu girdi alanını yoksayın.</dd></dl>';
$ec_lang['mtc_note_2_term']='Hız kontrolü';
$ec_lang['mtc_note_2_def']='Yüksek hız, bu denli yüksek özgül enerji yaratan büyük bir kot düşüşü olduğunu gösterir. Bu enerji, genişlemelerde, dirseklerde veya engellerde hızla kaybolabilir. Bunun saha için makul olduğunu doğrulayın.';
$ec_lang['mtc_solver_no_solution']='Bu kanal girdileriyle verilen Q için çözüm bulunamadı.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Basit Savak Debisi';
$ec_lang['ws_main_title']='Ücretsiz Çevrimiçi Basit Geniş Kretli Savak Debisi Hesaplayıcı';
$ec_lang['ws_main_desc']='Basit Geniş Kretli Savak Debisi Hesaplayıcı';
$ec_lang['ws_weirLength']='Savak uzunluğu, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Suyun birim ağırlığı başına enerji — su sütununun yüksekliğidir, basınç değildir">Su yükü, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Savak katsayısı, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Notlar';
$ec_lang['ws_notes_we_term']='Savak Denklemi';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Düzensiz Kretli Savak Debisi';
$ec_lang['wi_main_title']='Ücretsiz Çevrimiçi Parçalı, Değişken Derinlikli, Düzensiz Kretli Savak Debisi Hesaplayıcı';
$ec_lang['wi_main_desc']='Düzensiz Kretli Savak Debisi Hesaplayıcı';
$ec_lang['wi_weirPoints']='Savak noktaları';
$ec_lang['wi_pondingHeight']='Göllenme yüksekliği';
$ec_lang['wi_incrementalFlow']='Artımlı debi';
$ec_lang['wi_cumulativeFlow']='Kümülatif debi';
$ec_lang['wi_notes_we_def']='q = eğer (uzunluk = 0) ise 0, değilse eğer (eğim=0) ise cw*uzunluk*d<sub>0</sub><sup>1.5</sup>, değilse cw/(2.5*eğim) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>), burada d<sub>1</sub> ve d<sub>0</sub> her zaman pozitif veya sıfırdır';
// Orifice Flow
$ec_lang['or_main_menu']='Orifis Debisi';
$ec_lang['or_main_title']='Ücretsiz Çevrimiçi Orifis Debisi Hesaplayıcı';
$ec_lang['or_main_desc']='Orifis Debisi — Serbest veya Batık';
$ec_lang['or_shape_circular']='Dairesel';
$ec_lang['or_shape_rectangular']='Dikdörtgen';
$ec_lang['or_diameter']='<span class="ec-help" title="Dairesel için çap; dikdörtgen için yükseklik">Çap veya yükseklik, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Yalnızca dikdörtgen açıklıklar için">Genişlik, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Açıklığın alt noktası">Taban kotu <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Memba su yüzü kotu';
$ec_lang['or_twe']='Mansap su yüzü kotu';
$ec_lang['or_cd']='Debi katsayısı, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Ağırlık merkezi kotu';
$ec_lang['or_head']='<span class="ec-help" title="Suyun birim ağırlığı başına enerji — su sütununun yüksekliğidir, basınç değildir">Etkin su yükü, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Açıklık alanı, A';
$ec_lang['or_regime']='Orifis rejimi kontrolü';
$ec_lang['or_regime_valid']='Serbest çıkış';
$ec_lang['or_regime_submerged']='Batık orifis';
$ec_lang['or_regime_submerged_tip']='TWE ağırlık merkezinin üzerinde — orifis rejimi hâlâ geçerli';
$ec_lang['or_regime_warn']='Orifis rejimi dışında';
$ec_lang['or_regime_warn_tip']='Memba su yüzü tavanın altında';
$ec_lang['or_regime_twe_above_hwe']='Girdileri kontrol edin';
$ec_lang['or_regime_twe_above_hwe_tip']='Mansap suyu (TWE), memba suyunun (HWE) üzerinde';
$ec_lang['or_notes_1_term']='Orifis Denklemi';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Serbest çıkış için: h = HWE − ağırlık merkezi kotu. Batık akış için (TWE taban kotunun üzerinde): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Orifis Rejimi';
$ec_lang['or_notes_2_def']='Orifis akış denklemleri, memba su yüzü açıklığın tavanının (üst noktasının) üzerinde olduğunda uygulanır. Memba su yüzü tavanın altındaysa, bunun yerine bir savak denklemi kullanın.';
$ec_lang['or_notes_3_term']='Debi Katsayısı';
$ec_lang['or_notes_3_def']='C<sub>d</sub>, keskin kenarlı orifisler için yaklaşık 0,60–0,65 aralığındadır. Yuvarlatılmış veya içe girik girişler farklı değerler alır. Bkz. <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> veya HEC-RAS Hidrolik Referans Kılavuzu.';
$ec_lang['or_notes_4_term']='Batıklık';
$ec_lang['or_notes_4_def']='TWE, açıklığın taban kotunun üzerindeyken bu hesaplayıcı, h = HWE − TWE kullanarak batık orifis denklemini otomatik olarak uygular. TWE taban kotunda veya altındayken serbest çıkış varsayılır ve h = HWE − ağırlık merkezi kotu alınır.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Mikro-Hidroelektrik Güç';
$ec_lang['mhp_main_title']='Ücretsiz Çevrimiçi Mikro-Hidroelektrik Güç Hesaplayıcısı';
$ec_lang['mhp_main_desc']='Nehir Akışı Mikro-Hidroelektrik Güç Çıkışı Hesaplayıcısı';
$ec_lang['mhp_gross_head']='Brüt düşü, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Cebri boru (besleme borusu) çapı">Cebri boru çapı, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Uzunluk, L';
$ec_lang['mhp_efficiency']='Tesis verimi, η (0–1)';
$ec_lang['mhp_vel_check']='Hız kontrolü';
$ec_lang['mhp_hl_check']='Yük kaybı kontrolü';
$ec_lang['mhp_hnet']='Net düşü, H<sub>net</sub>';
$ec_lang['mhp_power']='Çıkış gücü, P';
$ec_lang['mhp_annual_kwh']='Yıllık enerji (P)';
$ec_lang['mhp_vel_low']='Hız düşük — çökelme ve hava sürüklenmesi riski.';
$ec_lang['mhp_vel_high']='Hız yüksek — geçiş kayıplarını, mevcut enerjiyi ve su darbesi riskini kontrol edin.';
$ec_lang['mhp_vel_ok_short']='Tamam';
$ec_lang['mhp_vel_high_short']='Yüksek';
$ec_lang['mhp_vel_low_short']='Düşük';
$ec_lang['mhp_vel_ok_tip']='Hız, cebri boru tasarımı için verimli aralıktadır.';
$ec_lang['mhp_hl_ok_tip']='Yük kaybı, brüt yükün %10\'undan az. Bu boru boyutu ekonomiktir.';
$ec_lang['mhp_hl_warn_tip']='Yük kaybı, brüt yükün %10\'undan fazla. Daha büyük bir boru düşünün.';
$ec_lang['mhp_hl_bad_tip']='Yük kaybı, brüt yükün %20\'sinden fazla. Boru boyutunu değiştirin.';
$ec_lang['mhp_notes_1_term']='Yük Kaybı';
$ec_lang['mhp_notes_1_def']='Toplam cebri boru kaybı h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>; burada h<sub>f</sub> = f(L/D)(v²/2g) Darcy-Weisbach sürtünme kaybıdır ve h<sub>m</sub> = k<sub>m</sub>·v²/2g giriş, dirsek ve vanaları kapsar. Net düşü H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Hız';
$ec_lang['mhp_notes_2_def']='Hızın mevcut düşü ve boru maliyeti için makul olup olmadığını kontrol edin. Çok düşük hız borunun gereğinden büyük seçildiğini gösterebilir; çok yüksek hız sürtünme kayıplarını ve su darbesi riskini artırabilir.';
$ec_lang['mhp_notes_3_term']='Yük Kaybı Hedefi';
$ec_lang['mhp_notes_3_def']='Cebri boru (besleme borusu) kayıplarının brüt yükün %10\'undan az olması genellikle ekonomiktir. Boru maliyeti ile kaybedilen güç arasındaki en uygun denge, elektrik fiyatının yüksek olduğu durumlarda genellikle %4–6 civarında kalır.';
$ec_lang['mhp_notes_6_term']='Verimlilik';
$ec_lang['mhp_notes_6_def']='Tipik tesis verimi η, mikro-hidro sistemlerinde yaygın olan Pelton ve çapraz akış türbinleri için 0,70 ile 0,85 arasında değişir. Muhafazakâr bir ilk tahmin olarak 0,75 kullanın.';
$ec_lang['mhp_notes_7_term']='Yıllık Enerji';
$ec_lang['mhp_notes_7_def']='Yıllık enerji, sürekli tam debi çalışmasını (yılda 8.760 saat) varsayar. Mevsimsel debi değişimi, bakım duruşları ve yük faktörü nedeniyle gerçek üretim daha düşük olacaktır.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Gölet & Depo Boşalma Süresi';
$ec_lang['odt_main_title']='Ücretsiz Çevrimiçi Gölet, Havuz ve Depo Boşalma Süresi Hesaplayıcısı (Orifis)';
$ec_lang['odt_main_desc']='Gölet, Havuz veya Depo Boşalma Süresi — Orifis Çıkışlı, Konik Hacim Yöntemi';
$ec_lang['odt_h1_elev']='Başlangıç su yüzeyi kotu';
$ec_lang['odt_a1']='Başlangıç alanı, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Bitiş su yüzeyi kotu';
$ec_lang['odt_a0']='Orifis seviyesindeki alan, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Bitiş kotunda konik modelden interpolasyonla elde edilir">Bitiş alanı, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Bitiş kotu kontrolü';
$ec_lang['odt_h2_ok']='Bitiş kotu orifis tavanının üzerinde';
$ec_lang['odt_h2_warn']='Bitiş kotu orifis tavanında veya altında';
$ec_lang['odt_h2_warn_tip']='Orifis tavanı = ağırlık merkezi kotu + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Çap (dairesel) veya yükseklik (dikdörtgen)">Orifis D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Yalnızca dikdörtgen için">Orifis genişliği, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Boşalma süresi (sn)';
$ec_lang['odt_t_min']='Boşalma süresi (dk)';
$ec_lang['odt_t_hr']='Boşalma süresi (sa)';
$ec_lang['odt_t_day']='Boşalma süresi (gün)';
$ec_lang['odt_notes_1_term']='Formül';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) ifadesi, H yükünden orifise kadar geçen boşalma süresini verir. Boşalma süresi = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), burada H<sub>1</sub> = başlangıç kotu − orifis kotu, H<sub>2</sub> = bitiş kotu − orifis kotu.';
$ec_lang['odt_notes_2_term']='Yöntem';
$ec_lang['odt_notes_2_def']='Konik hacim yöntemi, göleti veya havuzu, başlangıç su yüzeyindeki A<sub>1</sub> alanı ile orifis ağırlık merkezi kotundaki A<sub>0</sub> alanı arasında konik bir kesit olarak modeller. Bitiş kotundaki gölet alanı A<sub>2</sub>, konik kesit modeli kullanılarak A<sub>1</sub> ve A<sub>0</sub>\'dan interpolasyonla hesaplanır. Başlangıçtan bitiş kotuna boşalma süresi, H<sub>1</sub>\'den orifise kadar olan toplam boşalma süresinden H<sub>2</sub>\'den orifise kalan boşalma süresinin çıkarılmasına eşittir.';
$ec_lang['odt_h1']='<span class="ec-help" title="Başlangıç su yüzeyi kotu eksi orifis ağırlık merkezi kotu">Başlangıç su yükü, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Maksimum debi, Q<sub>max</sub>';
$ec_lang['odt_vol']='Boşaltılan hacim';
$ec_lang['odt_sketch_start']='Başlangıç';
$ec_lang['odt_sketch_end']='Bitiş';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Damlatıcı aralığı, S<sub>e</sub>';
$ec_lang['ip_sl']='Lateral aralığı, S<sub>l</sub>';
$ec_lang['ip_n_e']='Lateral başına damlatıcı sayısı, n<sub>e</sub>';
$ec_lang['ip_n_l']='Bölge başına lateral sayısı, n<sub>l</sub>';
$ec_lang['ip_d']='Hedef uygulama derinliği, d';
$ec_lang['ip_a_e']='Damlatıcı başına alan, A<sub>e</sub>';
$ec_lang['ip_pr']='Uygulama oranı, PR';
$ec_lang['ip_q_lat']='Lateral başına debi, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Bölge debisi, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Çalışma süresi (saat)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Kanal Sızıntısı';
$ec_lang['cs_main_title']='Ücretsiz Çevrimiçi Kanal Sızıntı Kaybı ve İletim Verimliliği Hesaplayıcısı';
$ec_lang['cs_main_desc']='Kanal Sızıntı Kaybı & İletim Verimliliği — Giriş-Çıkış Yöntemi';
$ec_lang['cs_Q_in']='Giriş debisi, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Çıkış debisi, Q<sub>out</sub>';
$ec_lang['cs_L']='Güzergah uzunluğu, L';
$ec_lang['cs_Q_loss']='Sızıntı kayıp debisi, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Ölçüm kontrolü';
$ec_lang['cs_pct_loss']='Kayıp oranı';
$ec_lang['cs_Ec']='İletim verimliliği, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Verimlilik değerlendirmesi';
$ec_lang['cs_Vol_day']='Günlük kaybedilen hacim';
$ec_lang['cs_Vol_year']='Yıllık kaybedilen hacim';
$ec_lang['cs_Q_loss_per_L']='Birim uzunluk başına kayıp, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Su değeri';
$ec_lang['cs_lining_cost']='Astar maliyeti';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Kaplamadan sonra iletim verimliliği hedefi; kesir 0–1">Astar hedefi, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Astar alanı, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Yıllık kaybedilen değer';
$ec_lang['cs_annual_value_recovered']='Yıllık kazanılan değer';
$ec_lang['cs_lining_total_cost']='Toplam astar maliyeti';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Basit geri ödeme = toplam astar maliyeti ÷ yıllık kazanılan değer">Geri ödeme süresi <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — sızıntı tespit edildi';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — ölçülebilir kayıp yok';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — ölçümleri kontrol edin';
$ec_lang['cs_Ec_good']='İyi — E<sub>c</sub> ≥ %80';
$ec_lang['cs_Ec_fair']='Orta — E<sub>c</sub> %60–80';
$ec_lang['cs_Ec_poor']='Zayıf — E<sub>c</sub> < %60';
$ec_lang['cs_notes_1_def']='Giriş-çıkış yöntemi, bir kanal güzergahının başındaki ve sonundaki akışı ölçerek sızıntıyı tahmin eder: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. İletim verimliliği E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Yıllık hacim, sürekli tam debi ile çalışma varsayımına dayanır; mevsimsel veya kısmi debi durumunda gerçek kayıp daha düşük olacaktır.';
$ec_lang['cs_notes_2_term']='Verimlilik Değerlendirmeleri';
$ec_lang['cs_notes_2_def']='Tipik astarlanmamış toprak kanallar: E<sub>c</sub> = %60–80. İyi bakımlı toprak kanallar: %75–85. Beton astarlı kanallar: %90–98. Girişin %30\'unu aşan sızıntı kayıpları çoğunlukla astar yatırımını haklı kılar. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Astar Geri Ödeme';
$ec_lang['cs_notes_3_def']='Su değerini ve astar maliyetini herhangi bir tutarlı para biriminde girin. Astar alanı = güzergah uzunluğu × ıslak çevre — ölçülen akış derinliğindeki kanal kesitinin ıslak çevresi (taban genişliği artı her iki ıslak yamaç). Kurtarılan yıllık değer, astarlı kanalın hedef E<sub>c</sub>\'yi sürekli olarak sağladığını varsayar. Mevsimsel kanallar için veya astar hedef verimliliğe ulaşmadığında gerçek geri ödeme süresi daha uzun olacaktır.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3. baskı (2001). FAO Sulama ve Drenaj Belgesi 57 (1999).';
// About
$ec_lang['about_main_menu']='Hakkında';
$ec_lang['install_main_menu']='Yükle';
$ec_lang['install_main_title']='EngCalcs\'ı Yükle';
$ec_lang['install_main_desc']='Çevrimdışı kullanım için cihazınıza ekleyin';
$ec_lang['install_intro']='EngCalcs bir Progresif Web Uygulamasıdır (PWA). Kurulduktan sonra tüm hesaplayıcılar tamamen çevrimdışı çalışır — internet bağlantısına gerek kalmaz.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Chrome\'da herhangi bir hesaplayıcı sayfasını açın.</li><li>Üst gezinme çubuğundaki <strong>⬇ Yükle</strong> düğmesine dokunun veya tarayıcı menüsüne (⋮) dokunup <strong>Ana ekrana ekle</strong> seçeneğini seçin.</li><li>Görünen istemde <strong>Yükle</strong> seçeneğine dokunun.</li><li>EngCalcs ana ekranınızda görünür ve çevrimdışı çalışır.</li>';
$ec_lang['install_now_btn']='⬇ Şimdi Yükle';
$ec_lang['install_prompt_unavailable']='Yükleme istemi kullanılamıyor — bunun yerine tarayıcı menünüzü kullanın.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Safari\'de herhangi bir hesaplayıcı sayfasını açın.</li><li><strong>Paylaş</strong> düğmesine dokunun (yukarı ok işaretli kutu).</li><li>Aşağı kaydırıp <strong>Ana Ekrana Ekle</strong> seçeneğine dokunun.</li><li><strong>Ekle</strong> seçeneğine dokunun. EngCalcs ana ekranınızda görünür.</li>';
$ec_lang['install_ios_note']='iOS\'ta kurulum her zaman Paylaş menüsü üzerinden yapılır — otomatik bir yükleme istemi bulunmaz.';
$ec_lang['install_desktop_heading']='Masaüstü (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Herhangi bir hesaplayıcı sayfasını açın.</li><li>Tarayıcının adres çubuğundaki <strong>yükleme simgesine</strong> (⊕ veya bilgisayar simgesi) tıklayın ya da tarayıcı menüsünü açıp <strong>EngCalcs\'ı Yükle…</strong> seçeneğini seçin.</li><li><strong>Yükle</strong> seçeneğine tıklayın. EngCalcs bağımsız bir uygulama penceresi olarak açılır.</li>';
$ec_lang['install_firefox_heading']='Firefox / Diğer Tarayıcılar';
$ec_lang['install_firefox_body']='Tarayıcınız kurulum seçeneği sunmuyorsa bir şey kaybetmezsiniz: hesaplayıcıları tarayıcıda her zamanki gibi kullanın; ilk ziyaretinizden sonra sayfalar çevrimdışı kullanım için otomatik olarak önbelleğe alınır. Masaüstünde Firefox bunun en sık görülen örneğidir.';
$ec_lang['install_cached_heading']='Önbelleğe Alınanlar';
$ec_lang['install_cached_body']='EngCalcs\'ı ilk kez yüklediğinizde, tüm hesaplayıcı sayfaları ve bunları destekleyen dosyalar (betikler, stiller) cihazınıza otomatik olarak kaydedilir. Bundan sonra her şey internet bağlantısı olmadan çalışır. Dil tercihiniz son çevrimiçi ziyaretinizden hatırlanır.';
$ec_lang['contact_main_menu']='İletişim';
$ec_lang['about_main_title']='HawsEDC Mühendislik Hesaplayıcıları Hakkında';
$ec_lang['about_main_desc']='Misyon, Özgür Yazılım ve Katkı';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Misyon</h3><p>HawsEDC Mühendislik Hesap Makineleri, dünya genelindeki mühendislere ve saha çalışanlarına hizmet etmek için var — özellikle su kıtlığı olan, kaynak yetersizliği çeken veya ihmal edilmiş bölgelerde çalışanlara. Bu araçlar, daha geniş bir insani misyonun parçasıdır: her insana en pratik ve etkili şekilde, sonsuza dek sevildiğini ve değer gördüğünü, hiçbir şeyden korkmasına gerek olmadığını ve her şeyi mahvetmeyeceğini söylemek.</p><p>Hesap makineleri araçtır. Hedef, acısız bir dünyadır.</p><h3>Özgür (Libre) ve Açık Kaynak Lisansı</h3><p>Tüm kod, <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU Genel Kamu Lisansı v3.0 veya üzeri</a> kapsamında yayınlanmıştır — özgürlük anlamında özgür. Kodu aynı koşullar altında kullanabilir, inceleyebilir, değiştirebilir ve yeniden dağıtabilirsiniz.</p><p>Bu bir davettir, bir fiyat değil. Ücretli bir katman, geri alınabilecek bir ücretsiz katman ya da kodun size ait olmasından önce bir bekleme süresi yoktur. Bugün gördüğünüz tam sürüm, şimdi ve sonsuza dek herkesin kullanmasına ve değiştirmesine açıktır.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Kaynak Kodu</h3><p>Tam kaynak kodu GitHub\'ta herkese açık olarak mevcuttur:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Orada kodu inceleyebilir, sorun bildirebilir veya depoyu çatallandırabilirsiniz.</p><h3>Katkıda Bulunma</h3><p>Her türlü yardım memnuniyetle karşılanır. <a href="contact.php">Tom Haws ile iletişime geçin</a>.</p><ul><li><strong>Çeviriler:</strong> Daha iyi bir ifade önerin. Bir dili geliştirin veya yeni bir dil ekleyin.</li><li><strong>Hata raporları:</strong> Herhangi bir hesap makinesi sayfasındaki geri bildirim formunu kullanın veya GitHub\'ta bir sorun bildirin.</li><li><strong>Yeni hesap makineleri:</strong> Saha çalışanlarına ve sulama uzmanlarına hizmet eden hidrolik mühendislik araçları için fikirler özellikle memnuniyetle karşılanır.</li><li><strong>Barındırma:</strong> Bu hesap makinelerini sınırlı bağlantısı olan bir bölge için yansıtabilirseniz lütfen benimle iletişime geçin.</li></ul><h3>Çevrimdışı Kullanım</h3><p>Bu hesap makineleri bir <strong>Aşamalı Web Uygulaması (PWA)</strong> olarak çalışır. İnternete bağlıyken herhangi bir hesap makinesi sayfasını ziyaret edin; tarayıcınız tüm hesap makinelerini otomatik olarak önbelleğe alacaktır. Bundan sonra tüm hesap makineleri çevrimdışı çalışır — internet gerekmez.</p><p>Android veya iOS\'ta, EngCalcs\'ı cihazınıza uygulama olarak yüklemek için tarayıcınızın "Ana Ekrana Ekle" seçeneğini kullanın. Masaüstünde, tarayıcınızın adres çubuğundaki yükleme simgesini arayın.</p><p>Ayrıca herhangi bir hesap makinesini tek seferlik çevrimdışı kullanım için tarayıcınızın "Farklı kaydet…" menüsünü kullanarak kaydedebilirsiniz.</p><h3>İletişim</h3><p>Tom Haws — hidrolik mühendisi ve bu hesap makinelerinin yazarı.<br />Herhangi bir hesap makinesi sayfasındaki geri bildirim formunu kullanın veya <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>\'taki kaynak koda erişin.</p>';
$ec_lang['contactSendMessage']='Tom Haws\'a bir mesaj gönderin';
$ec_lang['contactYourName']='Isim:';
$ec_lang['contactYourEmail']='E-mail Adresi:';
$ec_lang['contactSubject']='Konu:';
$ec_lang['contact_message']='Mesaj:';
$ec_lang['contactSpamPrefix']='Bes arti bir';
$ec_lang['contactSpamPostfix']='(Lütfen yaziyla gösterin. 1= bir 2=iki 3=üç 4=dört 5=bes 6=alti 7=yedi +=arti 5+1=6)';
$ec_lang['contactSubmitButton']='Gönder';
$ec_lang['contact_success']='Yazmanız için zaman ayırdığınız için teşekkür ederiz.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Taş Düşü Tasarımı (Robinson)';
$ec_lang['rc_main_title']='Ücretsiz Çevrimiçi Taş Düşü Tasarım Hesaplayıcısı — Robinson (1998)';
$ec_lang['rc_main_desc']='Taş Düşü Taş Dolgu Boyutlandırması — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Düşü taban eğimi, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Düşü girişinde birim genişlik başına debi. B taban genişliğinde ve Q toplam debili bir kanal için q_t = Q / B kullanın.">Toplam birim debi, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Taş dolgu gözenekliliği, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Suya göre yoğunluk. Kırma granit veya bazalt için tipik ≈ 2,65. Robinson geçerli aralığı: 2,54–2,82.">Kaya özgül ağırlığı, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Granülometri standart sapması. Tekdüze kaya ≈ 1,25. Robinson geçerli aralığı: 1,15–1,47.">Granülometri SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Göllenme (Hp > yn) olumludur — memba erozyonunu azaltır. (USDA)">Giriş kanalında normal derinlik, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Denklem 1 (S0 < 0,10) veya Denklem 2 (0,10–0,40). Geçerli: D50 15–278 mm, S0 0,02–0,40. Aralık dışı: ekstrapolasyon.">Gerekli ortanca kaya boyutu, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Uygulanan denklem';
$ec_lang['rc_sg_check']='Özgül ağırlık kontrolü';
$ec_lang['rc_SD_check']='Granülometri SD kontrolü';
$ec_lang['rc_sg_ok']   ='sg geçerli aralıkta';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg Robinson aralığının altında';
$ec_lang['rc_sg_low_tip']='Geçerli aralık: 2,54–2,82';
$ec_lang['rc_sg_high'] ='sg Robinson aralığının üzerinde';
$ec_lang['rc_sg_high_tip']='Geçerli aralık: 2,54–2,82';
$ec_lang['rc_SD_ok']   ='SD geçerli aralıkta';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD Robinson aralığının altında';
$ec_lang['rc_SD_low_tip']='Geçerli aralık: 1,15–1,47';
$ec_lang['rc_SD_high'] ='SD Robinson aralığının üzerinde';
$ec_lang['rc_SD_high_tip']='Geçerli aralık: 1,15–1,47';
$ec_lang['rc_layer']='Taş dolgu kalınlığı (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Üst eşik eğri yarıçapı (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Üst eşik eğri yay uzunluğu';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Düşü taşının yapısal desteği için gereklidir. “Çıkış kesimi ve mansap kanal direncinden kaynaklanan minimum kuyruk suyu, çıkış kesimindeki taş dolgunun stabilitesini sağlamaya yeterlidir.” (Robinson)">Çıkış apronu uzunluğu (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Düşüde Manning pürüzlülüğü, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Kaya gözeneklerinden geçen qt fraksiyonu. Kalan qs yüzeyden akar. Varsayılan np = 0,45 köşeli kırma kaya için tipiktir.">Taş mantosu içindeki hız, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Manto içinden birim debi, q<sub>m</sub>';
$ec_lang['rc_qs']='Yüzey birim debisi, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Taş dolgu yüzeyi üzerindeki akış derinliği, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Göllenme (Hp > yn) olumludur — memba erozyonunu azaltır. (USDA)">Giriş savak yükü, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Giriş göllenmesi kontrolü';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — memba göllenmesi';
$ec_lang['rc_pond_ok_tip']='Düşü girişinin membasında göllenme olumludur; membadaki erozyonu azaltır. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — göllenme yok — giriş erozyon potansiyeli';
$ec_lang['rc_pond_warn_tip']='Düşü girişinin membasında göllenme yok; membada erozyon oluşabilir. (USDA)';
$ec_lang['rc_eq1']='Denk. 1 (S<sub>0</sub> < 0,10) — hafif eğim';
$ec_lang['rc_eq2']='Denk. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — dik eğim';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — Robinson doğrulama aralığının altında';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — Robinson doğrulama aralığının üzerinde';
$ec_lang['rc_notes_1_term']='Taş Boyutlandırma Denklemleri';
$ec_lang['rc_notes_1_def']='Robinson, Rice ve Kadavy (1998), kanal eğimi ve birim debiden ortanca taş kaplama boyutu D<sub>50</sub> için iki ampirik denklem geliştirdi. Denklem 1, yumuşak eğimler için geçerlidir (S<sub>0</sub> < 0,10); Denklem 2, dik eğimler için geçerlidir (0,10 ≤ S<sub>0</sub> ≤ 0,40). Her iki denklem de q<sub>t</sub>\'yi m²/s biriminde gerektirir ve D<sub>50</sub>\'yi mm biriminde verir. Doğrulanmış aralık 0,02 ≤ S<sub>0</sub> ≤ 0,40\'tır.';
$ec_lang['rc_notes_2_term']='Birim Debi';
$ec_lang['rc_notes_2_def']='q<sub>t</sub>, düşü eşiğindeki toplam birim debidir (birim genişlik başına toplam debi). B taban genişliğinde ve Q toplam debili bir kanal için q<sub>t</sub> ≈ Q / B olarak yaklaşık alınabilir veya düşü girişindeki kritik derinlik koşulundan hesaplanabilir.';
$ec_lang['rc_notes_3_term']='Taş Mantosu İçinden Akış';
$ec_lang['rc_notes_3_def']='Toplam akışın bir kısmı taş dolgu gözeneklerinden geçer (manto akışı q<sub>m</sub>); geri kalanı taş yüzeyinden akar (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). Akış derinliği d, düşü pürüzlülüğü n kullanılarak yüzey akışı q<sub>s</sub>\'ye uygulanan Manning denkleminden hesaplanır. Varsayılan gözeneklilik n<sub>p</sub> = 0,45, köşeli kırma kaya için tipiktir.';
$ec_lang['rc_notes_5_term']='Geçerli Kaya Boyutu Aralığı';
$ec_lang['rc_notes_5_def']='Denklemler 15 mm ile 278 mm arasındaki D<sub>50</sub> aralığı kullanılarak geliştirilmiştir. Bu aralık dışındaki sonuçlar ekstrapolasyon değeridir ve ek mühendislik değerlendirmesiyle kullanılmalıdır.';
$ec_lang['rc_notes_6_term']='Çıkış Apronu Kotu';
$ec_lang['rc_notes_6_def']='Çıkış kesimindeki taş dolgunun üst yüzey kotu, mansap kanal taban kotunda veya altında olmalıdır. Daha yüksekse çıkıştaki taş kararsız olacaktır.';
$ec_lang['rc_notes_7_term']='Giriş Göllenmesi';
$ec_lang['rc_notes_7_def']='Giriş kanalındaki normal derinlik, q<sub>t</sub>\'yi iletmek için gerekli savak yükü (H<sub>p</sub>)\'ndan az olduğunda, düşü girişinin membasında kısıtlı akış veya göllenme oluşur. Bu genellikle kabul edilebilirdir — göllenme hızı düşürür ve memba erozyonunu önler. Kontrol için: verilen q<sub>t</sub> ve eşik genişliği için bir savak hesaplayıcısıyla H<sub>p</sub>\'yi bulun ve giriş kanalı normal derinliğiyle karşılaştırın. H<sub>p</sub> normal derinliği aşarsa göllenme oluşacaktır.';
$ec_lang['rc_notes_4_term']='Kaynak';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS aynı yönteme dayalı bir <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel tablosu</a> da yayınlamaktadır.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Filtre';
$ec_lang['rc_sketch_top_crest_curve'] = 'Üst Eşik Eğrisi';
$ec_lang['rc_sketch_outlet_apron']    = 'Çıkış Apronu';
$ec_lang['rc_sketch_radius']          = 'yarıçap';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Sulama Basıncı';
$ec_lang['ip_main_title']='Ücretsiz Çevrimiçi Sulama Basıncı ve Dağılım Düzgünlüğü Hesaplayıcısı';
$ec_lang['ip_main_desc']='Test Dalı Basıncı ve Düzgünlük Tahmini';
$ec_lang['ip_h_supply']='Beslenme basıncı';
$ec_lang['ip_elev_supply']='Beslenme kotu, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Damlatıcı tasarım debisi, q<sub>design</sub>';
$ec_lang['ip_h_design']='Damlatıcı tasarım basıncı';
$ec_lang['ip_x']='<span class="ec-help" title="Standart kompanse etmeyen damlatıcılar için 0,5; kompanse edici damlatıcılar için 0\'a yakın">Damlatıcı deşarj üssü, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Test yolu';
$ec_lang['ip_group_reach']='Hat';
$ec_lang['ip_group_upstream']='Memba';
$ec_lang['ip_group_downstream']='Mansap';
$ec_lang['ip_group_loss']='Kayıp';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="İşaretli: bu hat test lateral\'inin bir parçasıdır, bireysel damlatıcılar tarafından çekilir. İşaretli değil: bu hat bir ana hattır, sadece test yolunda olmayan lateral\'lere akış iletir.">Lat. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Lateral satırları: bu hattaki damlatıcılar sadece. Ana satırları: bu hattan dallanan diğer lateral\'lerdeki toplam damlatıcılar. Test lateral\'inin kendi alındığı hat için, bu aynı zamanda o alındıktan sonra ana hat boyunca diğer lateral\'leri veya aynı kavşağı paylaşan (örneğin ters taraf lateral) damlatıcıları içerir — akışları bu aynı hattan dallanır, bu tabloda başka yerde göründükleri olsa da.">Damlatıcılar <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Bu hattın mansap uç kotu. İç satırlarda isteğe bağlı (boş bırakılırsa düz olarak varsayılır / yukarıdaki düğümle aynı). Son satırda gerekli: bu değer son damlatıcının kotudur, doğrudan gerekli beslenme basıncını belirler.">MS Kot. <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Son damlatıcı kotu (son satır) boş bırakıldı ve düz olarak varsayıldı — doğru sonuç için girin';
$ec_lang['ip_press']='Bas.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Toplam hat kaybı, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Düşük/negatif basınç — atmosfer altı koşulları kontrol edin';
$ec_lang['ip_pressure_warn_short']='Düşük';
$ec_lang['ip_pressure_high']='Yüksek basınçlı yerlerde basınç düşürme gerekir';
$ec_lang['ip_pressure_high_short']='Yüksek';
$ec_lang['ip_max_head']='İzin ver. maks. boru basıncı';
$ec_lang['ip_max_head_tip']='Basıncı bu değeri aşan hatlar işaretlenir. Yüksek basınç kontrolünü atlamak için boş bırakın.';
$ec_lang['ip_h_far']='Son damlatıcı basıncı';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Sadece modellenen test yoluna giren debi, tüm bölge/sistem değil — Uygulama Tasarımı aşağısında Q_zone için bkz.">Test yolu beslenme debisi, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Son damlatıcı debisi, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Ortalama damlatıcı debisi (test lateral), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="Bu test lateral\'ine kıyasla tipik/ortalama lateral\'in ne kadar daha yüksek (veya daha düşük) çalıştığına inanıyorsunuz. Test lateral kasıtlı olarak en kötü durum varsayıldığından, kendi ortalaması saha ortalaması için taraflı-düşük bir yaklaşımdır — 0\'da bırakıldığında, aşağıdaki düzgünlük kontrolü ve uygulama tasarımı sayıları test lateral\'inin kendi (muhtemelen iyimser) ortalamasını olduğu gibi kullanır.">Tah. Δbasınç, ort. vs. test lateral <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral yeniden değerlendirilir her lateral satırındaki basınç artı yukarıda girilen basınç farkında — test lateral\'inin en kötü durum varsayıldığı değil temsilci olan için düzeltme denemesi. Aşağıdaki düzgünlük kontrolü ve uygulama tasarımı bölümünün her ikisini de besler.">Tah. saha-ortalama damlatıcı debisi, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Son damlatıcının hesaplanan debisi, tahmini saha-ortalama damlatıcı debisine bölünür — bu, standart düşük-çeyrek Dağılım Düzgünlüğü\'nün (düşük-grup ortalama ÷ nüfus ortalaması) bir yaklaşımıdır; ancak bu, tam saha istatistiksel örneği yerine küçük bir modellenen örnekten ve kullanıcı tarafından tahmin edilen bir düzeltmeden elde edilir. 1\'e eşit veya üzerindeki değerler mümkündür ve geçerlidir: bunlar yalnızca son damlatıcının basıncının tahmini saha ortalamasında veya üzerinde olduğu, dolayısıyla en düşük basınç noktasının başka bir damlatıcı olduğu anlamına gelir. Bunun nedeni son damlatıcının alçak zeminde olması veya Δbasınç tahmininin çok küçük olması olabilir.">Düzgünlük kontrolü, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Test damlatıcısındaki basınç ≥ besleme basıncı. Bu muhtemelen en kötü durumdaki damlatıcı değildir, ya da borular daha küçük seçilebilir.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Bu, standart düzgünlük ölçüsüne ilişkin yaklaşımımızdan farklıdır.">Son damlatıcı debisi ÷ tasarım debisi, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Çözüm yok: gerekli beslenme basıncı girilen beslenme basıncını aşıyor. Beslenme basıncını artırın, talep azaltın, veya daha büyük boru kullanın.';
$ec_lang['ip_notes_1_def']='Son (en uzak) damlatıcıdaki basıncı tahmin eder, ardından Enerji Seviye Hattını beslenme doğrultusunda geri doğru, hat hat hareket ettirir, yol boyunca sürtünme ve ikincil kayıpları ekler. Yükseklik ve hız yükü her düğümde geri alınır ve orada gerçek basınç bildirilir. Tahmin edilen uzak uç basıncı, hesaplanan gerekli beslenme basıncı girilen beslenme basıncına eşleşene kadar ayarlanır (ikiye bölme yöntemi) — Manning Boru Akımı hesaplayıcısındaki boru akımı çözücüsü tarafından ele alınan aynı kapalı devre problemi, dallı bir ağa genişletilmiştir.';
$ec_lang['ip_notes_2_term']='Ana Hat vs. Lateral Hatlar';
$ec_lang['ip_notes_2_def']='Her satır beslenme kaynağından son damlatıcıya tekil hidrolik olarak en kötü yol (test yolu) boyunca bir hattır. Ana hat sadece test yolunda olmayan lateral\'lere akış iletir, bu nedenle kaynağı düz çarpım (tasarım debisi × hattın toplam damlatıcı sayısı) — yerel basınç hassasiyeti yok. Ana hat paylaşılan gövde borusudur, bu nedenle test lateral\'inin kendi alındığı hattın hemen sağında sadece kendi uç noktaları arasındaki lateral\'leri değil, aynı zamanda o alındıktan sonra ana hat boyunca diğer lateral\'leri veya aynı kavşağı paylaşan lateral\'leri (örneğin ters taraf lateral) dahil etmelidir — akışları bu aynı hattan dallanır, bu tabloda başka yerde göründükleri olsa da. Lateral hat test lateral\'inin kendisinin bir parçasıdır: damlatıcı deşarjı gerçek yerel basınç aracılığıyla q = k·H<sup>x</sup> hesaplanır, ve sürtünme kaybı her damlatıcının hattın dışını çekmesiyle akış adımını hesaplamak için Christiansen\'in F(n) faktörü tarafından azaltılır.';
$ec_lang['ip_notes_3_term']='Sınırlamalar';
$ec_lang['ip_notes_3_def']='Tek bir sabit besleme basıncı (pompa eğrisi yok), yalnızca tek bir test yolu (tüm saha değil) ve 2 parametreli bir damlatıcı eğrisi (basınç-telafili bir damlatıcıyı yaklaşık olarak modellemek için üssü 0\'a yakın ayarlayın) modellenir. İki farklı düzgünlük oranı raporlanır ve bunlar bilerek ayrı tutulur: q<sub>last</sub>/q<sub>avg,field</sub>, standart düşük-çeyrek Dağılım Düzgünlüğü\'nün (düşük-grup ortalama ÷ nüfus ortalaması) bir yaklaşımıdır; ancak bu, standart tam saha istatistiksel örneği yerine küçük bir modellenen örnekten ve kullanıcı tarafından tahmin edilen bir düzeltmeden elde edilir. Ayrıca, test laterali kasıtlı olarak varsayılan en kötü durum olduğundan, düzeltilmemiş ham ortalaması gerçek saha ortalamasını olduğundan düşük gösterir ve düzgünlüğü olduğundan daha iyi gösterir; Δbasınç girdisi tam olarak bu sapmayı gidermek için vardır. 1\'e eşit veya üzerindeki düzgünlük değerleri yine de mümkündür: bunlar yalnızca son damlatıcının basıncının tahmini saha ortalamasında veya üzerinde olduğu, dolayısıyla en düşük basınç noktasının başka bir damlatıcı olduğu anlamına gelir. Bunun nedeni son damlatıcının alçak zeminde olması veya Δbasınç tahmininin çok küçük olması olabilir. q<sub>last</sub>/q<sub>design</sub> ise üreticinin nominal debisine karşı yapılan farklı, düzgünlükle ilgili olmayan bir kontroldür — sistemin genel olarak aşırı veya yetersiz basınçlandırılmış olduğunu tespit etmek için yararlıdır, ancak düzgünlük sayısıyla birlikte okunması gereken ayrı bir kontroldür, çünkü tasarım/nominal debi, sistemin gerçek ortalama işletme basıncından bağımsızdır.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Tarımsal Deneme İstasyonu Bülteni 670. ASAE/ASABE mikrosulama tasarımı standartları aynı çok çıkışlı sürtünme-kayıp yaklaşımını kullanır.';
$ec_lang['ip_notes_5_term']='Uygulama Tasarımı';
$ec_lang['ip_notes_5_def']='Uygulama oranı ve sistem/bölge debi tahmini saha-ortalama damlatıcı debisini (q<sub>avg,field</sub> — test lateral\'inin kendi ortalaması, girilen Δbasınç tahmini tarafından düzeltilmiş), tahmin edilen oran değil kullanır: PR = q<sub>avg,field</sub> / A<sub>e</sub>, düzeltilmiş modellenen değer tarafından beslenmiş. Aralık ve sistem-geniş lateral/damlatıcı sayıları ayrı girdilerdir çünkü test yolu sadece bir en kötü durum dalı modeller, sahada her lateral değil.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Dallı Boru Şebekesi';
$ec_lang['bpn_main_title']='Ücretsiz Çevrimiçi Dallı Boru Şebekesi Basınç Hesaplayıcısı (Döngüsüz)';
$ec_lang['bpn_main_desc']='Dallı (Ağaç) Boru Şebekesi Debi ve Basınç';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Statik besleme yükü: sıfır debideki kaynak yükü. Besleme kotunun üzerindeki bir rezervuar veya tank su yüzü kotu, ya da bir pompanın kapatma yükü. Bir pompa veya değişken besleme eğrisi tanımlamak için 2 ve 3 numaralı besleme noktalarını ekleyin; araç, tasarım debisindeki yükü okur.';
$ec_lang['bpn_elev_source']='Besleme kotu';
$ec_lang['bpn_q_total']='Toplam debi';
$ec_lang['bpn_q_total_tip']='Kaynaktan çıkan toplam debi (şebekedeki tüm talep debilerinin toplamı).';
$ec_lang['bpn_p_min']='En düşük basınç';
$ec_lang['bpn_p_min_tip']='Şebekede herhangi bir yerdeki en düşük mansap basıncı; kritik teslim noktası.';
$ec_lang['bpn_method']='Sürtünme yöntemi';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Boru hatları';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Bu boru hattının adı. Diğer hatlar, Memba sütununda bu hatta atıfta bulunur.';
$ec_lang['bpn_upstream']='Memba ID';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='Bu hattı besleyen hattın ID\'si. Doğrudan üstündeki hattı izlemesi için boş bırakın (düz bir seri boru hattı). Farklı bir hattan dallanmak için buraya bir ID girin.';
$ec_lang['bpn_roughness_tip']='Seçilen sürtünme yöntemi için boru pürüzlülüğü: Manning n, Hazen-Williams C veya Darcy-Weisbach pürüzlülük yüksekliği e (bir uzunluk). Tipik düz plastik boru: n yaklaşık 0,009, C yaklaşık 150, e yaklaşık 0,0015 mm.';
$ec_lang['bpn_demand']='Talep';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Bu hattın mansap ucunda teslim edilen sabit debi.';
$ec_lang['bpn_demand_mult']='Talep çarpanı';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Tepe saat veya gelecekteki büyüme senaryosu için tüm hat taleplerini aynı anda ölçeklendirir. Girildiği gibi talepler için 1 kullanın.';
$ec_lang['bpn_elev_down']='MS kot.';
$ec_lang['bpn_q_line']='Hat debisi';
$ec_lang['bpn_q_line_tip']='Bu hattın taşıdığı toplam debi: kendi talebi artı beslediği tüm mansap taleplerinin toplamı.';
$ec_lang['bpn_p_down']='MS basınç';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Bu hattın mansap düğümündeki manometrik basınç yükü. Negatif bir değer (işaretlenir), atmosfer altı basınç anlamına gelir; tasarımı kontrol edin.';
$ec_lang['bpn_sketch_heading']='Şebeke Şeması';
$ec_lang['bpn_source_label']='Kaynak';
$ec_lang['bpn_line_problem']='Bu hat kaynağa bağlı değil: bilinmeyen bir memba ID\'sine işaret ediyor, kendine işaret ediyor, başka bir hattın zaten kullandığı bir ID\'yi tekrarlıyor veya bir döngü oluşturuyor. Kaynağa bağlı olmayan hatlar çözülmeden bırakılır.';
$ec_lang['bpn_bad_id_short']='Geçersiz ID';
$ec_lang['bpn_not_connected_short']='Bağlı değil';
$ec_lang['bpn_dup_id_short']='Yinelenen ID';
$ec_lang['bpn_pressure_warn']='Düşük/negatif basınç; atmosfer altı koşulları kontrol edin';
$ec_lang['bpn_pressure_warn_short']='Düşük';
$ec_lang['bpn_notes_1_term']='Varsayılan olarak seri, istisna olarak dallanma';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Memba ID\'sini boş bırakırsanız, hat üstündeki hattı izler; düz bir seri boru hattı. Bir hattan dallanmak için o hattın ID\'sini girin. Yani: varsayılan olarak seri, gerektiğinde bir ağaç.';
$ec_lang['bpn_notes_2_term']='Yalnızca dallı şebekeler, döngü yok';
$ec_lang['bpn_notes_2_def']='Her hattın tam olarak bir memba hattı vardır (bir ağaç). Bu araç döngülü şebekeleri çözmez; bunlar yinelemeli yöntemler gerektirir (EPANET veya benzeri). Döngüleri dışarıda bırakmak, aracı basit ve kesin tutar.';
$ec_lang['bpn_notes_3_term']='Aktif basınç kontrolü yok';
$ec_lang['bpn_notes_3_def']='Sabit bir yerel kayıp vanası (bir k değeri) ekleyebilirsiniz, ancak basınç düşürücü veya basınç sürdürücü vanalar (PRV/PSV) ekleyemezsiniz. Bunların açık/kapalı durumu debiye ve basınca bağlıdır, bu da yinelemeyi zorunlu kılar.';
$ec_lang['bpn_notes_epanet_term']='Hazen-Williams sabitleri artık EPANET ile aynı (Ağustos 2026)';
$ec_lang['bpn_notes_epanet_def']='Ağustos 2026\'da Hazen-Williams katsayısı ve üssü, EPANET ile aynı olacak şekilde değiştirildi. Yük kaybı sonuçları bu sayfanın önceki sürümlerinden en fazla yüzde 0,1 farklıdır; bu, C değerinin kendi belirsizliğinden çok daha küçüktür.';
$ec_lang['bpn_supply2_q']='Besleme debisi 2';
$ec_lang['bpn_supply2_h']='Besleme yükü 2';
$ec_lang['bpn_supply3_q']='Besleme debisi 3';
$ec_lang['bpn_supply3_h']='Besleme yükü 3';
$ec_lang['bpn_supply_pt_tip']='İsteğe bağlı besleme eğrisi noktaları 2 ve 3. Bir pompayı veya daha fazla debi verdikçe yükü düşen herhangi bir kaynağı modellemek için her biri için bir debi ve yük girin; araç, tasarım debisindeki yükü okur. Yukarıdaki 1. nokta, sıfır debideki statik yüktür. Sabit bir rezervuar yükü için 2 ve 3\'ü boş bırakın.';
$ec_lang['bpn_h_supply']='Besleme yükü';
$ec_lang['bpn_h_supply_tip']='Besleme eğrisinden okunan, tasarım debisindeki kaynak yükü. Eğri düz olduğunda (bir rezervuar) girilen kaynak yüküne eşittir.';
$ec_lang['bpn_supply1_h']='Statik besleme yükü';
$ec_lang['lpn_main_menu']='Su Şebekesi';
$ec_lang['lpn_main_title']='EPANET Çözücüsüyle Ücretsiz Çevrimiçi Su Dağıtım Şebekesi Modellemesi';
$ec_lang['lpn_main_desc']='Su Şebekesi Analizi: Halkalı Boru Şebekesi Çizin veya EPANET Dosyaları İçe Aktarın';
$ec_lang['lpn_title_units']='{units} Birimleri';
$ec_lang['lpn_tool_select']='Seç';
$ec_lang['lpn_tool_add_junction']='Düğüm';
$ec_lang['lpn_tool_add_reservoir']='Rezervuar';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Depo';
$ec_lang['lpn_tool_add_pipe']='Boru';
$ec_lang['lpn_tool_add_pump']='Pompa';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Vana';
$ec_lang['lpn_tool_add_text']='Metin';
$ec_lang['lpn_tool_vertices']='Kırılma noktaları';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Müşteri';
$ec_lang['lpn_tool_add_meter_tip']='Müşterinin bulunduğu yere tıklayın, ardından onu besleyen boruya veya düğüme tıklayın. Müşteriye verdiğiniz talep, o borunun yakın ucundaki düğüme eklenir.';
$ec_lang['lpn_mode_add_meter']='Müşteri: müşterinin bulunduğu yere tıklayın, ardından onu besleyen boruya veya düğüme tıklayın. İptal etmek için Esc kullanın.';
$ec_lang['lpn_pane_tab_customers']='Müşteriler';
$ec_lang['lpn_customer_heading']='Müşteri {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Servis başına talep';
$ec_lang['lpn_field_meter_demand_tip']='Bu müşterideki her bir servisin ihtiyaç duyduğu talep. Bul ve değiştir, boş ile 0 arasındaki farktan yararlanabilir.';
$ec_lang['lpn_field_meter_count']='Servis sayısı';
$ec_lang['lpn_field_meter_count_tip']='Bu tek müşterinin kaç özdeş servisi temsil ettiği; böylece bir ana boru boyunca kırk iki tek aileli bağlantı, tek bir yerde tek bir simge olabilir. Aşağıdaki toplam, yukarıdaki talebin bu sayı ile çarpımıdır.';
$ec_lang['lpn_field_meter_total']='Toplam talep';
$ec_lang['lpn_field_meter_total_tip']='Servis başına talebin servis sayısıyla çarpımı. Bu, aşağıda adı geçen düğüme eklenen sayıdır.';
$ec_lang['lpn_field_meter_pipe']='Bağlı varlık';
$ec_lang['lpn_field_meter_pipe_suggest']='En yakın varlık {id}. Bu müşteriyi ondan beslemek için buraya yazın.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Bağlı olduğu';
$ec_lang['lpn_field_meter_node_tip']='Bu müşterinin bağlı olduğu düğüm. Bunun yerine bir boru üzerindeki bir istasyondan beslemek için bağlantı noktasını bir boruya sürükleyin.';
$ec_lang['lpn_meter_pipe_unknown']='Bu projede {id} adında hiçbir şey yok, bu yüzden müşteri olduğu yerde bırakıldı.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='Bu müşterinin talebinin çalışma boyunca nasıl yükselip alçaldığı. Toplam talebi çarpar, bu yüzden bu müşterinin temsil ettiği her servise etki eder. Projenin Varsayılan talep deseni\'ni izlemesi için Desen yok olarak bırakın.';
$ec_lang['lpn_meter_pattern_unknown']='Bu projede {id} adında hiçbir desen yok, bu yüzden müşteri olduğu gibi bırakıldı.';
$ec_lang['lpn_meter_placed']='Müşteri {id} eklendi. Açıklaması ve talebi Müşteriler tablosuna yazılır, ya da kutusunu açmak için Seç modunda üzerine basın.';
$ec_lang['lpn_field_meter_pipe_tip']='Bu servisin bağlandığı varlık. Değiştirmek için buraya veya Müşteriler tablosuna başka birini yazın, ya da bağlantı noktasını farklı bir varlığa sürükleyin.';
$ec_lang['lpn_field_meter_station']='Boru boyunca konum (%)';
$ec_lang['lpn_field_meter_station_tip']='Servisin borunun neresine bağlandığı, borunun birinci düğümünden ikincisine olan uzunluğunun yüzdesi olarak. 0 bir uçta, 100 diğer uçtadır. Boru üzerindeki daire, aynı işi işaretçiyle yapar.';
$ec_lang['lpn_field_meter_offset']='Borudan kaçıklık';
$ec_lang['lpn_field_meter_offset_tip']='Pozitif değer, birinci düğümünden ikincisine bakıldığında borunun sağındadır. Buraya bir değer yazmak müşteriyi ana borunun diğer tarafına taşıyabilir ve servis hattını her zaman ana boruya dik açıyla hizalar.';
$ec_lang['lpn_field_meter_lumped']='Eklendiği düğüm';
$ec_lang['lpn_field_meter_lumped_tip']='En yakın düğüm; bu müşterinin talepleri orada toplanır.';
$ec_lang['lpn_node_customers']='Müşteri talepleri';
$ec_lang['lpn_node_customers_tip']='Bu düğüme eklenmiş müşterilerin listesi (bu düğüm en yakını olduğu için). Müşteri talepleri, burada listelenen diğer taleplere ek olarak eklenir. Bir müşteri, haritadaki yerinde veya Müşteriler tablosunda düzenlenir.';
$ec_lang['lpn_node_customers_sum']='{n} Müşteriden {total} {unit}';
$ec_lang['lpn_customer_detached']='⚠ Bu müşteri bir boruya bağlı değil, bu yüzden talebi sonuçlarda yok. Silin, ya da bir boru çizip müşteriyi onun üzerine taşıyın.';
$ec_lang['lpn_customer_fixed_head']='⚠ O borunun yakın ucu sabit bir su yüzeyi tutuyor, bu yüzden bu talep simülasyonu etkilemez.';
$ec_lang['lpn_customer_detached_count']='{n} müşteri bir boruya bağlı değil. Talepleri hesaba katılmıyor.';
$ec_lang['lpn_meter_pick_pipe']='Şimdi bu müşteriyi besleyen boruya veya düğüme tıklayın. Müşteri, koyduğunuz yerde kalır. İptal etmek için Escape\'e basın.';
$ec_lang['lpn_inp_export_flat_customers']='Bir EPANET dosyasında müşteri yoktur. Bu projedeki {n} müşterinin talebi, her birinin eklendiği düğüm üzerinde bir talep satırı olarak dosyaya girer, ve her satır müşterinin etiketiyle adlandırılır. Dosyanın tutamadığı şey müşterinin kendisidir: nerede durduğu, hangi borunun onu beslediği, o boru boyunca servisin nerede bağlandığı ve bir müşterinin kaç servisi temsil ettiği. Kendi proje dosyanız bunların hepsini tutar.';

$ec_lang['lpn_area_hint_window_start']='Pencerenin bir köşesine tıklayın.';
$ec_lang['lpn_area_hint_window_go']='Bitirmek için karşı köşeye tıklayın.';
$ec_lang['lpn_area_hint_lasso_start']='Ana hattı başlatmak için tıklayın.';
$ec_lang['lpn_area_hint_lasso_go']='Ana hattı çizmek için imleci hareket ettirin. Bitirmek için tıklayın.';
$ec_lang['lpn_area_hint_polygon_start']='Çokgen alanı çizmek için tıklayın. Bitirmek için çift tıklayın.';
$ec_lang['lpn_area_hint_polygon_go']='Her köşeye tıklayın. Bitirmek için sonuncusuna çift tıklayın.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Var olan seçime devam etmek ve seçtiğinizi eklemek veya çıkarmak (değiştirmek) için seçim yaparken Shift tuşunu basılı tutun.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Haritaya basılı tutun ve istediğiniz alanın çevresinde sürükleyin, sonra parmağınızı kaldırın.';
$ec_lang['lpn_area_hint_touch_go']='İstediğiniz alanın çevresinde sürükleyin, bitirmek için parmağınızı kaldırın.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Bunu göster';
$ec_lang['lpn_multi_title']='{n} seçildi';
$ec_lang['lpn_multi_varies']='Değişken';
$ec_lang['lpn_multi_applied']='{prop}, {n} öğede ayarlandı.';
$ec_lang['lpn_multi_no_fields']='Bunların burada birlikte ayarlanabilecek hiçbir özelliği yok.';
$ec_lang['lpn_pane_pasted']='{n} hücre yapıştırıldı. {skipped} tanesi değiştirilmedi.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='{n} satır yapıştırıldı ve {created} tanesi şebekeye eklendi.';
$ec_lang['lpn_pane_pasted_rows_skipped']='{n} satır yapıştırıldı ve {created} tanesi şebekeye eklendi. {skipped} hücre değiştirilmedi.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Eklemek için buraya tıklayın ve bir elektronik tablodan satır yapıştırın.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Tablonun sonuna yeni satır olarak yapıştır';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Kopyalanan satırları bu tablonun altına eklemek için Ctrl+V\'ye basın. İptal etmek için Esc\'e basın.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Bu yapıştırmada {n} satır var, ve bunlardan {fit} tanesi tabloya sığıyor. Diğer {extra} tanesi tablonun altına yeni satır olarak eklensin mi?';
$ec_lang['lpn_pane_paste_overflow_add']='{extra} satır ekle';
$ec_lang['lpn_pane_paste_overflow_fit']='Yalnızca sığan {fit} taneyi yapıştır';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Bu yapıştırmada {n} satır var, ve bunlardan {fit} tanesi tabloya sığıyor. Diğer {extra} tanesi yeni satır olarak eklenemez: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} ID uyuşmuyor. Yine de yapıştırılsın mı?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Hiçbir şey yapıştırılmadı. {reasons}';
$ec_lang['lpn_pane_paste_more']='Burada gösterilmeyen sorunlu satırlar: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Satır {row}: yeni bir satırın bir ID\'si olmalı.';
$ec_lang['lpn_pane_paste_bad_id']='Satır {row}: {id} ID\'sinde bir boşluk veya tırnak işareti var.';
$ec_lang['lpn_pane_paste_id_taken']='Satır {row}: {id} ID\'si zaten kullanımda.';
$ec_lang['lpn_pane_paste_id_twice']='Satır {row}: {id} ID\'si bu yapıştırmada iki kez kullanılmış.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Satır {row}: yeni bir düğümün hem {first} hem de {second} değerine ihtiyacı var.';
$ec_lang['lpn_pane_paste_no_ends']='Satır {row}: yeni bir hattın bir Başlangıç düğümü ve bir Bitiş düğümü olmalı.';
$ec_lang['lpn_pane_paste_no_node']='Satır {row}: {id} düğümü henüz yok. Önce düğümlerinizi, sonra hatlarınızı yapıştırın.';
$ec_lang['lpn_pane_paste_same_ends']='Satır {row}: Başlangıç ve Bitiş aynı düğüm.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Satır {row}: {text}, geçerli bir {col} değil.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Satır {row}: yeni bir Metnin hem {first} hem de {second} değerine ihtiyacı var.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Satır {row}: {id} bu ağda henüz bir düğüm veya boru değil. Önce onu, sonra bu Metni yapıştırın.';
$ec_lang['lpn_pane_paste_customer_no_position']='Satır {row}: yeni bir Müşterinin hem {first} hem de {second} değerine ihtiyacı var.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Satır {row}: yeni bir Müşterinin bağlı bir boru veya düğüme ihtiyacı var.';
$ec_lang['lpn_pane_paste_no_pipe']='Satır {row}: {id} borusu henüz yok. Önce borularınızı, sonra müşterilerinizi yapıştırın.';
$ec_lang['lpn_pane_paste_no_customer_node']='Satır {row}: {id} düğümü henüz yok. Önce düğümlerinizi, sonra müşterilerinizi yapıştırın.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Satır {row}: {id} düğümünün bir Müşterinin bağlanabileceği borusu yok.';
$ec_lang['lpn_pane_filled']='{n} hücre aşağı dolduruldu. {skipped} tanesi değiştirilmedi.';
$ec_lang['lpn_pane_filldown']='Aşağı doldur';
$ec_lang['lpn_pane_fill_none']='Bu seçimde aşağı doldurulabilecek hiçbir şey yok.';
$ec_lang['lpn_pane_ctrlenter_filled']='{n} hücre dolduruldu. {skipped} tanesi değiştirilmedi.';
$ec_lang['lpn_pane_hide_col']='Bu sütunu gizle';
$ec_lang['lpn_pane_hide_cols']='Bu sütunları gizle';
$ec_lang['lpn_pane_show_all_cols']='Tüm sütunları göster';
$ec_lang['lpn_pane_sort_asc']='Artan sırala';
$ec_lang['lpn_pane_manage_cols']='Sütunları yönet…';
$ec_lang['lpn_pane_manage_cols_title']='Sütunları yönet';
$ec_lang['lpn_pane_manage_cols_show']='Göster';
$ec_lang['lpn_pane_manage_cols_up']='Yukarı taşı';
$ec_lang['lpn_pane_manage_cols_down']='Aşağı taşı';
$ec_lang['lpn_pane_manage_cols_top']='Başa taşı';
$ec_lang['lpn_pane_manage_cols_bottom']='Sona taşı';
$ec_lang['lpn_pane_colmenu_tip']='Sütunları gizle veya yönet';
$ec_lang['lpn_pane_sortarrow_tip']='Sıralamayı ters çevir';
$ec_lang['lpn_tool_area_window']='Pencere seç';
$ec_lang['lpn_tool_area_lasso']='Kement seç';
$ec_lang['lpn_tool_area_polygon']='Çokgen seç';
$ec_lang['lpn_tool_delete']='Sil';
$ec_lang['lpn_tool_zoom_extent']='Tümünü göster';
$ec_lang['lpn_tool_zoom_window']='Pencere Yakınlaştır';
$ec_lang['lpn_zoom_in']='Yakınlaştır';
$ec_lang['lpn_zoom_out']='Uzaklaştır';
$ec_lang['lpn_new_text']='Metin';
$ec_lang['lpn_field_text_bold']='Kalın metin';
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
$ec_lang['lpn_field_text_anchor']='Bağlı olduğu';
$ec_lang['lpn_field_text_align']='Yatay hizalama';
$ec_lang['lpn_field_text_align_left']='Sol';
$ec_lang['lpn_field_text_align_center']='Orta';
$ec_lang['lpn_field_text_align_right']='Sağ';
$ec_lang['lpn_field_text_valign']='Dikey hizalama';
$ec_lang['lpn_field_text_valign_top']='Üst';
$ec_lang['lpn_field_text_valign_middle']='Orta';
$ec_lang['lpn_field_text_valign_bottom']='Alt';
$ec_lang['lpn_field_text_rotation']='Açı (derece)';
$ec_lang['lpn_field_text_match_pipe']='En yakın hattın açısına dönün';
$ec_lang['lpn_field_text_flip']='180° döndür';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Bağlı öğe';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Bu metin bir öğeye takip edecek kadar yakın yerleştirildi, bu yüzden o öğeyle birlikte hareket eder ve bir yönlendirici çizgisi vardır. Yönlendirici çizgili bir metin, yatay ve dikey hizalamasını bulunduğu taraftan alır; bu iki satırın bağlıyken sunulmamasının nedeni budur.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Emiter katsayısı';
$ec_lang['lpn_field_emitter_tip']='Basınca bağlı ek bir çıkış akışı; bir yağmurlama başlığı, açık bir çıkış veya modellenen bir sızıntı için. Bu emiterin bıraktığı akış, bu katsayının basıncın emiter üssüne yükseltilmiş değeriyle çarpımıdır; üs, Ayarlar, Hesaplama, Hidrolik altında tüm şebeke için bir kez belirlenir. Sıradan bir düğümde boş bırakın.';
$ec_lang['lpn_field_elev']='Kot';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='Bu düğümdeki zemin veya boru kotu. İstediğiniz herhangi bir sıfır noktasından ölçebilirsiniz, yeter ki tüm düğümler aynı sıfırı kullansın.';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='Yük';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Rezervuardaki su yüzü kotu, basınç olarak değil yükseklik olarak ölçülür. Su yüzünü rezervuar kotuna yerleştirmek için boş bırakın.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='Depo tabanının kotu. Depodaki su derinlikleri buradan yukarı doğru ölçülür.';
$ec_lang['lpn_field_tank_level']='Su derinliği';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Depoda duran suyun derinliği, depo tabanından yukarı doğru ölçülür.';
$ec_lang['lpn_field_tank_minlevel']='En düşük su derinliği';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='İzin verilen en az derinlik, depo tabanından yukarı doğru ölçülür.';
$ec_lang['lpn_field_tank_maxlevel']='En yüksek su derinliği';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='İzin verilen en fazla derinlik, depo tabanından yukarı doğru ölçülür.';
$ec_lang['lpn_field_tank_diameter']='Depo çapı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Dikey bir silindir için. Kot ile aynı birimdedir, boru çapı birimleriyle değil. Verilen bir derinliğin ne kadar su tuttuğunu belirler.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Depodaki su yüzü kotu: depo tabanı kotu artı su derinliği.';
$ec_lang['lpn_close']='Kapat';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Özellikler';
$ec_lang['lpn_empty_hint']='Bir örnek açmak için Dosya, Yeni proje\'yi kullanın. Ya da araç çubuğundan bir rezervuar, düğüm ve boru ekleyerek başlayın.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Şebekeniz bozulmadan duruyor.';
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
$ec_lang['lpn_examples_welcome']='EPANET çözücüsüyle su dağıtım şebekesi modellemeye hoş geldiniz';
$ec_lang['lpn_examples_heading']='Bir örneğin kendi kopyanızı açın';
$ec_lang['lpn_examples_sub']='Her biri kendi kopyanız olarak açılır. Değiştirin, kaydedin veya yeni bir kopya açıp yeniden başlayın.';
$ec_lang['lpn_examples_open']='Aç';
$ec_lang['lpn_examples_menu']='Örnek aç…';
$ec_lang['lpn_examples_blank']='Ya da buradan başlayın';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='Düğümler: {nodes}, hatlar: {links}';
$ec_lang['lpn_examples_failed']='Örnekler yüklenemedi. Bir çizime başlamak için Dosya, Yeni proje\'yi kullanın.';
$ec_lang['lpn_examples_loading']='Örnekler yükleniyor…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Bir sorunu düzelt';
$ec_lang['lpn_help_notes']='Bu sayfa hakkında notlar';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Burada bir sorun mu var?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Bir tıklama, bu sayfada bir şeylerin yanlış olduğunu bize bildirir. Bu sayfanın adını, hangi dilde okuduğunuzu ve haritada bir mesaj varsa onu gönderir. Yazdığınız hiçbir şeyi, hiçbir adresi ve çiziminizden hiçbir şeyi göndermez. Kimse size geri yazamaz, çünkü bu, kim olduğunuz hakkında hiçbir şey söylemez. Daha fazlasını söylemek istediğinizde Yardım, Bir şey düzelt\'i kullanın.';
$ec_lang['lpn_wrong_thanks']='Teşekkürler. Bu bize ulaştı.';
$ec_lang['lpn_status_example_opened']='{name} açıldı. Bu sizin kopyanız: Dosya, Farklı kaydet ile kaydedin.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Bu sayfa çizim alanının boyutunu hesaplayamadı, bu yüzden harita hesaplayabildiği son görünümü gösteriyor. Pencereyi yeniden boyutlandırmak yeniden denemesini sağlar. Bu sürekli oluyorsa, genellikle sayfa ölçümlerini engelleyen bir tarayıcı uzantısı nedenidir.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Temel şebeke, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Buradan başlayın. Bir rezervuar, bir pompa ve küçük bir halka: bir su şebekesi olarak çalışan en küçük düzenleme. Saniyede litre, metre ve milimetre birimleriyle.';
$ec_lang['lpn_ex_basic_us_title']='Temel şebeke, g/d (ABD)';
$ec_lang['lpn_ex_basic_us_desc']='Aynı başlangıç şebekesi, dakikada galon, fit ve inç birimleriyle.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 artı kural tabanlı kontroller';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='EPANET\'in kendi üç örnek şebekesinin en küçüğü: bir rezervuar, bir pompa ve tek bir halka.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='EPANET\'in örneklerinden, depolu dallı bir dağıtım sistemi.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='EPANET\'in büyük örneği: 92 düğüm, 3 depo ve 2 rezervuar, biri bir nehir. Gerçek boyutlu bir modelin haritada nasıl göründüğünü görmek için açmaya değer.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, enlem/boylam';
$ec_lang['lpn_ex_net3_world_desc']='EPANET Net3 şebekesi, Novato, CA\'da enlem/boylama dönüştürülmüş hâli; arkasında dünya haritası çizilidir.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Bir vaziyet planı üzerine çizilmiş, tek bir anda maksimum gün talebine ek olarak yangın debisi için çözülmüş ticari bir alan.';
$ec_lang['lpn_tool_undo']='Geri al';
$ec_lang['lpn_confirm_example']='Bu, örneği mevcut şebekenize ekler. Devam edilsin mi?';
$ec_lang['lpn_field_diameter']='Çap';
$ec_lang['lpn_demand_tip']='Bu düğümde şebekeden çekilen debiler. Buraya şebekeye verilen debi için negatif bir sayı girin.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Bu birim, girdilerinizin ne anlama geldiğini belirler';
$ec_lang['lpn_units_warn_lead']='{unit}, şunun için girdiğiniz değerin birimidir:';
$ec_lang['lpn_units_options_head']='Bir birimi değiştirdiğinizde:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Yıkıcı değil';
$ec_lang['lpn_units_nondestructive_desc']='Yıkıcı değil: her girdiyi olduğu gibi bırakır ve yeni birimde yeniden yorumlar.';
$ec_lang['lpn_units_destructive']='Yıkıcı';
$ec_lang['lpn_units_destructive_desc']='Yıkıcı: her girdiyi matematiksel bir dönüşümle yeniden yazar, böylece şebeke dönüşüm toleransları içinde fiziksel olarak neredeyse aynı kalır. Özgün girdileri kaybeder. Geri al, onları geri getirir.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} değer artık {unit} anlamına geliyor. Hiçbir şey yeniden yazılmadı.';
$ec_lang['lpn_status_converted']='{n} değer {unit} birimine yeniden yazıldı.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='Şebekeyi tek bir niceliğe göre renklendirin, böylece büyük bir harita bir bakışta okunabilsin. Genellikle önemli olan iki nicelik basınç ve hızdır.';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Uzunluk';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Harita koordinatları';
$ec_lang['lpn_units_mapcoords_deg']='derece';
$ec_lang['lpn_units_usft']='ABD ölçüm ft';
$ec_lang['lpn_units_elevhead']='Kot ve yük';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Yük kaybı eğimi';
$ec_lang['lpn_result_gradient_tip']='Yük kaybının boru uzunluğuna bölünmesi. Farklı uzunluktaki boruları tek bir tasarım sınırına göre karşılaştırmak için kullanın.';
$ec_lang['lpn_result_water_age']='Su yaşı';
$ec_lang['lpn_result_water_age_tip']='Bu noktaya ulaşan suyun sistemde ne kadar süredir bulunduğu. Akışların birleştiği yerlerde, gelen su farklı yaşların bir karışımını taşır ve buradaki sayı, bunların debiyle ağırlıklandırılmış ortalamasıdır: çoğunlukla kısa ve yeni bir ana hattan beslenen bir düğüm, uzun bir çıkmaz hat da onu besliyor olsa bile düşük bir yaş gösterir. Bir depoda bu, tutulan suyun ortalama yaşıdır; bu yüzden yavaş devreden bir depo genellikle bir şebekedeki en eski sudur. Karşılaştırılacak bir yönetmelik sınırı yoktur, bu yüzden sayıyı kendi sisteminize göre değerlendirin.';
$ec_lang['lpn_result_source_share']='Kaynak payı';
$ec_lang['lpn_result_source_share_tip']='Bu noktaya ulaşan suyun ne kadarının izlenen düğümden geldiği. Kaynak izleme analizinin bildirdiği değer budur.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Ortalama su yaşı';
$ec_lang['lpn_result_avg_source_share']='Ortalama kaynak payı';
$ec_lang['lpn_result_avg_concentration']='Ortalama derişim';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Sürtünme faktörü';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Reaksiyon hızı';
$ec_lang['lpn_result_status']='Durum';
$ec_lang['lpn_result_status_open']='Açık';
$ec_lang['lpn_result_status_closed']='Kapalı';
$ec_lang['lpn_result_head']='Yük';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Bu düğümdeki suyun enerjisi, su sütunu yüksekliği olarak ifade edilir. Bu mutlak bir yükseklik olup, basınç ise bir gösterge ölçümüdür.';
$ec_lang['lpn_result_pressure']='Basınç';
$ec_lang['lpn_result_flow']='Debi';
$ec_lang['lpn_result_velocity']='Hız';
$ec_lang['lpn_result_headloss']='Yük kaybı';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Yalnızca bu projenin ayarlarını sıfırlar. Çiziminiz ve diğer projeleriniz değişmez. Sevdiğiniz ayarları yeniden kullanmak için, yalnızca ayarları içeren bir proje dosyası kaydedin.';
$ec_lang['lpn_reset_all_tip']='Her projeyi, her arka plan görüntüsünü, her ayarı ve birim seçimlerinizi siler, ardından sayfayı ilk kez ziyaret eden birinin gördüğü haliyle yeniden yükler. Her şeyi temizleyen tek sıfırlama budur.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Bu hesaplayıcı proje birimlerini ve girdileri girildiği gibi saklar, ancak eskiden sayıları depolama için SI birimlerine dönüştürürdü. Bu proje o değişiklikten önce kaydedildiğinden, sayıları SI olarak saklanmıştı. Bunları son bir kez geçerli birimlere dönüştürelim mi? Değerlendirebilmeniz için, dönüştürülecek bazı çaplar ile öncesi ve sonrası değerleri aşağıdadır:';
$ec_lang['lpn_v2_restore_yes']='Dönüştür';
$ec_lang['lpn_v2_restore_never']='Hayır. Bir daha sorma.';
$ec_lang['lpn_v2_restore_no']='Kapat, önce geçerli birimleri kontrol edeyim';
$ec_lang['lpn_storage_too_new']='Bu proje, sayfanın daha yeni bir sürümüyle kaydedilmiş, bu yüzden burada açılamaz.';
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
$ec_lang['lpn_tool_file']='Dosya';
$ec_lang['lpn_menu_edit']='Düzen';
$ec_lang['lpn_menu_insert']='Ekle';
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
$ec_lang['lpn_menu_map']='Harita';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Sokak haritasını göster';
$ec_lang['lpn_basemap_satellite_show']='Uydu görüntülerini göster';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='Coğrafi referanslı';
$ec_lang['lpn_xymap']='Yerel';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Farklı dönüştür…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='{name} kopyası';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Farklı dönüştür';
$ec_lang['lpn_convas_coordsys_tip']='Kopyanın dönüştürüleceği koordinat sistemi. Bu, projenizinkinden farklı olduğunda iki yerleştirme adımı izler. Nerede olduğunu zaten bilen bir proje, her iki adımı da yanıtlanmış olarak açar; böylece onları olduğu gibi kabul edebilir ya da değiştirebilirsiniz.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Şimdiki: {crs}';
$ec_lang['lpn_convas_epsg']='EPSG koordinat sistemi';
$ec_lang['lpn_convas_epsg_tip']='EPSG kayıt defterinden bir koordinat sistemi seçin. Enlem ve boylam, WGS 84\'tür (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Adsız (yerel) coğrafi referans';
$ec_lang['lpn_convas_unnamed_tip']='Uzunluk biriminde yerel koordinatlar, dünya haritası eklenmiş olarak.';
$ec_lang['lpn_convas_none_tip']='Uzunluk biriminde yerel koordinatlar, şimdilik dünya haritası olmadan.';
$ec_lang['lpn_convas_units_tip']='Kopyanın dönüştürüleceği birimler. Orijinal, kendi sayılarını ve birimlerini korur.';
$ec_lang['lpn_convas_round']='Dönüştürülen değerleri yuvarla';
$ec_lang['lpn_convas_round_tip']='Yalnızca bu dönüşümün yeniden yazdığı sayıları, seçtiğiniz en yakın adıma yuvarlar. Birimi değişmeyen değerler olduğu gibi bırakılır.';
$ec_lang['lpn_convas_round_none']='Yuvarlama yok';
$ec_lang['lpn_convas_round_flow']='Talep ve debi';
$ec_lang['lpn_convas_label_col']='Sonek';
$ec_lang['lpn_convas_label_tip']='Kopyanın harita etiketlerinde bu değerden sonra eklenen metin, \' mm\' veya \' gpm\' gibi. Yukarıda seçilen birimden önceden doldurulur; sonek istemiyorsanız temizleyin.';
$ec_lang['lpn_convas_oneway']='Geri dönüştürmek ikinci bir dönüşümdür, geri alma değildir. Dönüştürülüp geri dönüştürülen bir sayı, yazıldığı haliyle tam olarak geri gelmeyebilir.';
$ec_lang['lpn_convas_ok']='Dönüştür';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs}, kullanılabilir projeksiyon bilgisi olmayan birkaç listelenmiş koordinat sisteminden biri, bu yüzden ona veya ondan dönüştürülemez. Hiçbir şey dönüştürülmedi.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='Dönüştürülen kopya {name}. Orijinal proje değişmedi.';
$ec_lang['lpn_convas_cancelled']='Hiçbir şey dönüştürülmedi. Kopya kapatıldı ve orijinal proje değişmedi.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Bu projeyi yeni bir sekmeye kopyalar ve kopyayı seçtiğiniz koordinat sistemine ve birimlere dönüştürür. Koordinat sistemi değiştiğinde, bir sihirbaz önce haritayı şebekenizin arkasında yaklaşık olarak yakınlaştırmanız için, sonra şebekenizi harita üzerinde daha hassas biçimde ölçeklendirip döndürmeniz için size rehberlik eder. Bu proje tam olarak olduğu gibi bırakılır. Hiçbir şeyi dönüştürmeden coğrafi referans vermek için bunun yerine Harita, Dünya haritası, Ekle\'yi kullanın.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Bu proje zaten coğrafi referanslı, bu yüzden şebeke zaten harita üzerinde ve hiçbir şey taşınmadı. Doğru yerde olduğunu kontrol edin, sonra Modeli buraya koy düğmesine ve Bu yerleşimi koru düğmesine basın.';
$ec_lang['lpn_georef_intro']='Modeli yerleştirmek iki adım gerektirir. 1. adım hızlı olandır: model yerinde durur, siz arkasındaki haritayı, sahanız modelin altında kabaca doğru boyutta olana kadar hareket ettirirsiniz. Henüz döndürme yoktur. 2. adım hassas olandır: modelin kendisini sürükler, yeniden boyutlandırır ve döndürürsünüz. Projeniz başlangıçta tüm dünyanın haritası üzerindedir, bu yüzden önce konumunuzu bulun, sonra Modeli buraya koy düğmesine basın.';
$ec_lang['lpn_georef_adjust']='Model artık zeminde, bu yüzden haritayla birlikte hareket eder. Taşımak için modeli sürükleyin, yeniden boyutlandırmak için bir köşeyi sürükleyin, döndürmek için modelin üstündeki yuvarlak tutamacı sürükleyin. Ya da aşağıya zemin mesafesini ve dönüş açısını yazın.';
$ec_lang['lpn_georef_step1']='2 adımdan 1. adım — hızlı';
$ec_lang['lpn_georef_step2']='2 adımdan 2. adım — hassas';
$ec_lang['lpn_georef_step1_hint']='Projeniz ekranda olduğu yerde kalır. Arkasındaki zemin kabaca doğru yere ve kabaca doğru boyuta gelene kadar altındaki haritayı kaydırıp yakınlaştırın, sonra Modeli buraya koy düğmesine basın.';
$ec_lang['lpn_georef_detach']='Tekrar al';
$ec_lang['lpn_georef_size_prompt']='Saha, tüm proje boyunca yaklaşık ne kadar geniş?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Kısayol: {key} tuşuna basın.';
$ec_lang['lpn_tool_key_hint_two']='Kısayol: {key} veya {key2} tuşuna basın.';
$ec_lang['lpn_tool_add_junction_tip']='Bir düğüm eklemek için haritaya tıklayın: boruların birleştiği ya da suyun kullanıldığı bir nokta.';
$ec_lang['lpn_tool_add_reservoir_tip']='Bir rezervuar eklemek için haritaya tıklayın: sabit bir su seviyesi olan sonsuz bir kaynak.';
$ec_lang['lpn_tool_add_tank_tip']='Bir depo eklemek için haritaya tıklayın: dolup boşaldıkça su seviyesi yükselip alçalan depolama.';
$ec_lang['lpn_tool_add_pipe_tip']='Aralarında bir boru çizmek için önce bir düğüme, sonra başka bir düğüme tıklayın.';
$ec_lang['lpn_tool_add_pump_tip']='Aralarına bir pompa koymak için önce bir düğüme, sonra başka bir düğüme tıklayın.';
$ec_lang['lpn_tool_add_valve_tip']='Aralarına bir vana koymak için önce bir düğüme, sonra başka bir düğüme tıklayın.';
$ec_lang['lpn_tool_add_text_tip']='Çizimin üzerine bir not yazmak için haritaya tıklayın.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Şeklin içindeki her şeyi seçmek için haritaya, talimat verildiği gibi tıklayın. Şekli pencere, kement ve çokgen arasında değiştirmek için bu düğmeye tekrar basın. Var olan seçime devam etmek ve seçtiğinizi eklemek veya çıkarmak (değiştirmek) için seçim yaparken Shift tuşunu basılı tutun.';
$ec_lang['lpn_area_selected']='{n} seçildi.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='O alanda hiçbir şey bulunamadı.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Haritada bir boruyu şekillendiren kırılma noktalarını ekleyin ve kaldırın. Bir kırılma noktası eklemek için boruya tıklayın, kaldırmak için bir kırılma noktasına tıklayın, taşımak için bir kırılma noktasını sürükleyin. Bir kırılma noktası yalnızca çizilen güzergahı değiştirir, hidroliği değiştirmez.';
$ec_lang['lpn_tool_delete_tip']='Kaldırmak için haritadaki herhangi bir şeye tıklayın.';
$ec_lang['lpn_tool_undo_tip']='Son değişikliği geri alın.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Tüm şebekeyi pencereye sığdırın.';
$ec_lang['lpn_tool_zoom_window_tip']='Yakınlaştırmak için haritada bir kutunun iki karşı köşesine tıklayın veya birini sürükleyin. Tümünü göster için bu düğmeye tekrar basın.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Yakınlaştır. Kısayol: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Uzaklaştır. Kısayol: -';
$ec_lang['lpn_tool_settings_tip']='Bu proje için ayarları açın.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Bir öğeyi kimliğine göre bulun, ya da bir koşulu karşılayan tüm öğeleri bulun, ve hepsini aynı anda değiştirin.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Araç çubuğu simgelerinin anlamı';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Görünürlük';
$ec_lang['lpn_pane_right_toggle_tip']='Haritanın sağındaki paneli gösterin ya da gizleyin. Etiket ve renk seçimlerini içerir.';
$ec_lang['lpn_color_legend_open_tip']='Görünürlük panelini açıp bu renkleri değiştirmek için tıklayın.';
$ec_lang['lpn_color_node_field']='Düğümleri şuna göre renklendir';
$ec_lang['lpn_color_link_field']='Boruları şuna göre renklendir';
$ec_lang['lpn_color_ramp_sequential']='Sıralı';
$ec_lang['lpn_color_ramp_diverging']='Iraksak';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Aralık sayısı';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Aralık dağıtımı';
$ec_lang['lpn_color_ranges_note']='Aşağıdaki sınırlar bir kez ayarlandıktan sonra sabittir; sonuçlar değiştikçe onları izlemezler. Yukarıda bir veri sınıflandırma yöntemi seçmek, sınırları sistemin şu anki durumundan belirler. Herhangi bir değeri elle değiştirirseniz yukarıdaki yöntem Elle olur.';
$ec_lang['lpn_color_criterion_note']='Bu yöntem sınırlarını bir tasarım standardından alır, bu yüzden bu yöntem seçiliyken renk sayısı sabittir.';
$ec_lang['lpn_color_break_number']='Bir sınır bir sayı olmalıdır. Harita değişmedi.';
$ec_lang['lpn_color_break_order']='Her sınır, kendinden öncekinden büyük olmalıdır. Harita değişmedi.';
$ec_lang['lpn_color_break_count']='Renk sayısından bir eksik sınır olmalıdır. Harita değişmedi.';
$ec_lang['lpn_color_ramp_qualitative']='Nitel';
$ec_lang['lpn_color_ramp_rainbow']='Gökkuşağı';
$ec_lang['lpn_color_ramp_rainbow_eg']='EPANET ile eşleşir';
$ec_lang['lpn_color_example_material']='Malzeme';
$ec_lang['lpn_color_ramp_ylgnbu']='Sarıdan maviye';
$ec_lang['lpn_color_ramp_rdylbu']='Kırmızıdan maviye, sarı üzerinden';
$ec_lang['lpn_georef_drop']='Modeli buraya koy';
$ec_lang['lpn_georef_finish']='Bu yerleşimi koru';
$ec_lang['lpn_georef_scale']='Çizim birimi başına yer mesafesi';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Çiziminizin bir biriminin yerde ne kadar uzağa ulaştığı. Düz bir ızgara üzerinde yapılan bir çizim genelde bu konuda bir şey söylemez, bu yüzden burada ayarlayın — ya da Git\'in size sahanın ne kadar geniş olduğunu sorup bunu hesaplamasına izin verin.';
$ec_lang['lpn_georef_rotation']='Saat yönünün tersine döndür (derece)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Kuzeyi kuzeyi gösterecek şekilde tüm modelin saat yönünün tersine ne kadar döndürüleceği.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Model buraya kalıcı olarak yerleştirilsin mi? Sonrasında yine de öğeleri tek tek sürükleyebilirsiniz, ancak çizim bir xy projesi olmaktan çıkar. xy\'ye geri dönmek için bu projeyi kaydetmeden kapatın.';
$ec_lang['lpn_georef_done']='Bu artık bir enlem/boylam projesi. Herhangi bir öğeyi gerçekte olduğu yere daha yakın taşımak için sürükleyin.';
$ec_lang['lpn_georef_backdrop_unrotated']='Arka plan görüntüsü modelle birlikte taşındı ve yeniden boyutlandırıldı, ancak döndürülemedi. Hizalamak için Harita, Arka plan görüntüsü, Taşı\'yı kullanın.';
$ec_lang['lpn_georef_empty']='O dosyada şebeke yok, bu yüzden yerleştirilecek bir şey yok.';
$ec_lang['lpn_georef_unavailable']='Yerleştirme aracı yüklenmedi. Sayfayı yeniden yükleyip tekrar deneyin.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Projeler arasında geçiş yapmadan önce yerleşimi "Bu yerleşimi koru" düğmesiyle bitirin veya İptal\'e basın. Yerleşim bu projeye aittir ve sizinle başka bir projeye geçemez.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Kaydetmeden önce yerleştirmeyi "Bu yerleşimi koru" düğmesiyle bitirin veya İptal’e basın. Proje hâlâ yerleştirilmekte olduğu için ekranda görünen şey henüz dosyaya yazılacak şey değildir.';
$ec_lang['lpn_goto_menu']='Bir enlem ve boylama git…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='Haritayı zaten koordinatlarını bildiğiniz bir yere taşıyın. Bir haritanın verdiği sırayla önce enlem, sonra boylam, aralarında bir boşlukla: 38 -122';
$ec_lang['lpn_goto_prompt']='Bu sırayla enlem ve boylam';
$ec_lang['lpn_goto_bad']='Bu bir enlem ve bir boylam değil. Aralarında bir boşlukla 38 -122 deneyin.';
$ec_lang['lpn_georef_goto']='Git…';
$ec_lang['lpn_georef_twopt']='İki bilinen noktayı kullan';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Çiziminizdeki iki noktanın gerçekte nerede olduğunu zaten biliyorsanız, modeli tam olarak yerleştirin. Bunlardan birine tıklayın, enlemini ve boylamını yazın, sonra ikinci nokta için aynısını yapın. Konum, ölçek ve dönüş bu iki noktadan belirlenir. Seçmeyi durdurmak için bu düğmeye tekrar basın.';
$ec_lang['lpn_georef_twopt_pick1']='Çiziminizde enlemini ve boylamını bildiğiniz bir noktaya tıklayın.';
$ec_lang['lpn_georef_twopt_pick2']='Şimdi, birincisinden olabildiğince uzak ikinci bilinen bir noktaya tıklayın.';
$ec_lang['lpn_georef_twopt_same']='Bu, önce seçtiğiniz nokta. Farklı bir tane seçin.';
$ec_lang['lpn_georef_twopt_done']='Model artık verdiğiniz iki nokta üzerinde duruyor. Kontrol edin, sonra Bu yerleşimi koru düğmesine basın.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Alt panel';
$ec_lang['lpn_pane_toggle_tip']='Haritanın altındaki paneli gösterin ya da gizleyin. Profili ve her parça türü için bir tablo içerir.';
$ec_lang['lpn_pane_resize']='Paneli daha uzun ya da daha kısa yapmak için sürükleyin';
$ec_lang['lpn_pane_tab_junctions']='Düğümler';
$ec_lang['lpn_pane_tab_reservoirs']='Rezervuarlar';
$ec_lang['lpn_pane_tab_tanks']='Depolar';
$ec_lang['lpn_pane_tab_pipes']='Borular';
$ec_lang['lpn_pane_tab_pumps']='Pompalar';
$ec_lang['lpn_pane_tab_valves']='Vanalar';
$ec_lang['lpn_pane_tab_tip']='Bu sekme, bu türdeki öğeleri sıralayabileceğiniz ve düzenleyebileceğiniz bir tablo olarak gösterir. Sonuç sütunları düzenlenemez.';
$ec_lang['lpn_pane_none']='Bu şebekede henüz bunlardan yok.';
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
$ec_lang['lpn_pane_text_attached']='Bağlı';
$ec_lang['lpn_pane_not_used']='Kullanılmıyor';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='{q} ile filtrelendi. {all} öğeden {n} tanesi gösteriliyor.';
$ec_lang['lpn_pane_filter_clear']='Hepsini göster';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Bu tabloda filtreyle eşleşen hiçbir şey yok.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Yakınlaştır ve seç';
$ec_lang['lpn_goto_on_map']='Haritada göster';
$ec_lang['lpn_pane_select_on_map']='Haritada seç';
$ec_lang['lpn_pane_unselect_on_map']='Haritada seçimi kaldır';
$ec_lang['lpn_pane_print']='Tabloyu yazdır';
$ec_lang['lpn_pane_print_tip']='Şu anda baktığınız tabloyu, proje adı, tablo adı ve başlıklardaki birimlerle birlikte yazdırır. Satırlar, sıraladığınız düzende yazdırılır.';

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
$ec_lang['lpn_menu_project']='Su';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Su şebekesi modellemesiyle ilgili her şey, animasyon oynatma denetimleri dışında, burada tek bir yerde. Bir şeylerin nerede olduğunu tahmin etmenize gerek yok.';
$ec_lang['lpn_tables_menu']='Tablolar';
$ec_lang['lpn_tables_menu_tip']='Haritanın altındaki paneli, bu şebekedeki parçaların bir tablosuyla açar. Her parça türü için bir tablo vardır ve orada sıralayıp düzenleyebilirsiniz.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Bu şebekeyi şimdi yeniden hesaplar. Çalıştır düğmesini mi arıyorsunuz? Otomatik olarak yeniden hesapla ayarı açıkken gizlidir. Düğmeyi geri getirmek için Ayarlar, Hesaplama, Hidrolik altında Otomatik olarak yeniden hesapla\'yı kapatın.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Otomatik olarak yeniden hesapla';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Bu açıkken, bu proje yaptığınız her değişiklikten kısa bir süre sonra yeniden hesaplanır ve Hesapla düğmesi artık yapacak bir işi kalmadığı için araç çubuğundan kaldırılır. Her değişikliğin yeniden hesaplanmasını beklemenin yazmanıza engel olduğu büyük bir şebekede bunu kapatın; Hesapla düğmesi geri gelir, böylece ne zaman çalıştıracağınızı siz seçersiniz.';
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
$ec_lang['lpn_time_run_slow']='Bu şebekenin hesaplanması {secs} sn sürdü ve her değişiklikten sonra yeniden hesaplanacak şekilde ayarlı. Bunu durdurup bir Hesapla düğmesi geri almak için Ayarlar\'da, Hesaplama, Hidrolik altında “Otomatik olarak yeniden hesapla”yı kapatın.';
$ec_lang['lpn_time_no_report']='Henüz bir çalışma raporu yok. Rapor, EPANET\'in kendi metnidir, bu yüzden bu şebeke EPANET çözücüsüyle hesaplandığında görünür.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Yardım';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Ekran görüntüsü galerisi';
$ec_lang['lpn_help_walkthroughs']='Rehberler';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Şebekeyi sil';
$ec_lang['lpn_confirm_delete_network']='Bu projedeki her düğüm, boru ve metin etiketi silinsin mi? Arka plan görüntüsü, proje adı ve ayarlarınız korunur. Bu işlem geri alınamaz.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Bul ve değiştir';
$ec_lang['lpn_find_title']='Bul ve değiştir';
$ec_lang['lpn_find_scope']='Nerede aransın';
$ec_lang['lpn_find_scope_all']='Her şey';
$ec_lang['lpn_find_property']='Özellik';
$ec_lang['lpn_find_condition']='Koşul';
$ec_lang['lpn_find_value']='Değer';
$ec_lang['lpn_find_btn']='Bul';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Geçerli tabloda filtrele';
$ec_lang['lpn_find_filter_tip']='Haritanın altındaki tablolardan birinde yalnızca bu sorguyla eşleşen parçaları gösterin. Çizim değişmez ve hiçbir şey silinmez.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {all} içinden {n}';
$ec_lang['lpn_find_filter_summary']='{q} ile süzüldü. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Bu sorgu hiçbir tabloya uygulanmıyor.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='içerir';
$ec_lang['lpn_find_op_equals']='şuna eşit';
$ec_lang['lpn_find_op_gt']='şundan büyük';
$ec_lang['lpn_find_op_lt']='şundan küçük';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='boş';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} bulundu. Birine gitmek için tıklayın.';
$ec_lang['lpn_find_shift_hint']='Ekleyip çıkarmak için Shift+tıklayın: seçim kümesinde değilse eklenir, zaten kümedeyse çıkarılır.';
$ec_lang['lpn_find_none']='Hiçbir şey eşleşmedi.';
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
$ec_lang['lpn_find_op_top']='En yüksek {n}';
$ec_lang['lpn_find_op_bottom']='En düşük {n}';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Aranacak şeyi yazın.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Bağlantı';
$ec_lang['lpn_find_prop_demand_desc']='Bu talep kategorisinin açıklaması';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='düğümde bağlantı yok';
$ec_lang['lpn_find_op_conn_noopen']='düğümde açık bağlantı yok';
$ec_lang['lpn_find_op_conn_nolinksource']='kaynağa giden bağlantı yolu yok';
$ec_lang['lpn_find_op_conn_noopensource']='kaynağa giden açık yol yok';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Her düğüm bağlı.';
$ec_lang['lpn_find_conn_no_fixed']='Bu şebekede rezervuar veya depo yok, bu yüzden ulaşılacak bir kaynak da yok. Yalnızca düğümde bağlantı yok ve düğümde açık bağlantı yok aranabilir.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Aynı arama, tek satır olarak yazılmış. Denetimleri değiştirmek bu satırı yeniden yazar, bu satıra yazmak da denetimleri günceller.';
$ec_lang['lpn_find_query_label']='Sorgu';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Koşulları VE, VEYA ve () ile birleştirin';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='VE';
$ec_lang['lpn_find_q_or']='VEYA';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Denetimler aşağıdaki sorguyu ifade edemez, bu yüzden gizlendiler.';
$ec_lang['lpn_find_q_restore']='Bunun yerine denetimleri kullan';
$ec_lang['lpn_replace_q_bad']='Bu sorgu anlaşılamadı, bu yüzden hiçbir şey değiştirilemez. Önce yukarıda düzeltin.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='({n}. karakterde)';
$ec_lang['lpn_find_q_err_empty']='Sorgu boş, bu yüzden hiçbir şey aranmayacak.';
$ec_lang['lpn_find_q_err_scope']='{w} adında aranacak bir şey yok. Şunlardan birini deneyin: {list}';
$ec_lang['lpn_find_q_err_dot']='Aranacak şeyle özelliği arasına Düğüm.ID gibi bir nokta koyun';
$ec_lang['lpn_find_q_err_prop']='{scope} özelliği değil: {w}. Şunlardan birini deneyin: {list}';
$ec_lang['lpn_find_q_err_op']='{prop} için bir koşul değil: {w}. Şunlardan birini deneyin: {list}';
$ec_lang['lpn_find_q_err_value']='Bu koşuldan sonra bir değer gerekir: {op}';
$ec_lang['lpn_find_q_err_quote']='Bir metin değerini tırnak içine alın: {w} bir sayı değil.';
$ec_lang['lpn_find_q_err_quote_end']='Bu tırnaklı metnin kapanış tırnağı yok.';
$ec_lang['lpn_find_q_err_close']='Bu ( parantezi açıldı ve hiç kapatılmadı.';
$ec_lang['lpn_find_q_err_open']='Bu ) parantezi hiçbir şeyi kapatmıyor.';
$ec_lang['lpn_find_q_err_end']='Bundan sonra hiçbir şey beklenmiyordu. İki aramayı {and} veya {or} ile birleştirin.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Bulunanları değiştir';
$ec_lang['lpn_replace_prop']='Değiştirilecek özellik';
$ec_lang['lpn_replace_value']='Yeni değer';
$ec_lang['lpn_replace_source']='Yeni değer kaynağı';
$ec_lang['lpn_replace_asked']='{n} düğüm için kot istendi. Sonuçlar yolda.';
$ec_lang['lpn_replace_btn']='Değiştir';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='{n} öğe değiştirilsin mi?';
$ec_lang['lpn_replace_apply']='Değiştir';
$ec_lang['lpn_replace_done']='{n} öğe değiştirildi. Bunu tek adımda geri alabilirsiniz.';
$ec_lang['lpn_replace_none']='Hiçbir şey değişmeyecek.';
$ec_lang['lpn_replace_no_value']='Yeni değeri yazın.';
$ec_lang['lpn_replace_scope']='Değerlerini değiştirmek için yukarıda bir öğe türü seçin.';
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
$ec_lang['lpn_profile_tip']='Şebeke boyunca bir yol üzerinde zemini ve hidrolik gradyan çizgisini çizin.';
$ec_lang['lpn_profile_title']='Bir yol boyunca profil';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Yolun başladığı düğümü tıklayın.';
$ec_lang['lpn_profile_draw_more']='Yolu görmek için haritada gezinin. Eklemek için bir düğümü tıklayın. Bitirmek için çift tıklayın. Esc iptal eder.';
$ec_lang['lpn_profile_draw_blocked']='{a}\'dan {b}\'ye bir güzergah yok. Başka bir düğüm seçin.';
$ec_lang['lpn_profile_tap_start']='Yolun başladığı düğüme dokunun.';
$ec_lang['lpn_profile_tap_more']='Yolu görmek için bir düğüme dokunun. Eklemek için basılı tutun. Bitirmek için iki kez dokunun. İptal etmek için tekrar Profil\'e basın.';
$ec_lang['lpn_profile_say_idle']='Haritada yeni bir yol seçmek için tekrar Profil\'e basın.';
$ec_lang['lpn_profile_none']='Henüz bir yol yok. Haritada bir tane seçmek için tekrar Profil\'e basın.';
$ec_lang['lpn_profile_choose']='Bir başlangıç düğümü ve bir bitiş düğümü seçin.';
$ec_lang['lpn_profile_no_path']='Bu iki düğüm herhangi bir güzergahla bağlı değil.';
$ec_lang['lpn_profile_no_solve']='Henüz sonuç yok, bu yüzden yalnızca zemin çizgisi çizildi.';
$ec_lang['lpn_profile_summary']='Düğümler: {n}, uzunluk: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Güzergah boyunca mesafe ({u})';
$ec_lang['lpn_profile_axis_elev']='Kot ve yük ({u})';
$ec_lang['lpn_profile_ground']='Zemin yüzeyi';
$ec_lang['lpn_profile_hgl']='Hidrolik gradyan çizgisi';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Düzenle';
$ec_lang['lpn_profile_edit_tip']='Yolun bir ucunu değiştirin veya yoldan bir düğüm çıkarın, yolun tamamını yeniden çizmeden.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Yol üzerindeki herhangi bir noktayı taşımak için sürükleyin. Eklediğiniz bir noktayı çıkarmak için ona tıklayın.';
$ec_lang['lpn_profile_edit_tap']='Yol üzerindeki herhangi bir noktayı taşımak için sürükleyin. Eklediğiniz bir noktayı çıkarmak için ona dokunun.';
$ec_lang['lpn_profile_edit_nowhere']='Yol üzerindeki bir nokta bir düğüm olmalıdır. Yol değişmedi.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Kaydedilmiş yollar';
$ec_lang['lpn_profile_new']='Yeni kaydedilmiş yol…';
$ec_lang['lpn_profile_new_name']='Yol {n}';
$ec_lang['lpn_profile_rename']='Yolu yeniden adlandır…';
$ec_lang['lpn_profile_delete']='Yolu sil';
$ec_lang['lpn_profile_prompt_name']='Bu yol için ad';
$ec_lang['lpn_profile_delete_confirm']='{name} kaydedilmiş yolu silinsin mi? Çizimin kendisi değişmez.';
$ec_lang['lpn_profile_none_saved']='Henüz kaydedilmiş yol yok';
$ec_lang['lpn_profile_missing']='Kaydedilmiş {name} yolu bu projede olmayan düğümler kullanıyor: {ids}';
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
$ec_lang['lpn_ts_menu']='Zaman serisi';
$ec_lang['lpn_ts_tip']='Bir veya daha fazla varlığı, uzatılmış dönem simülasyonu boyunca zamana karşı çizin.';
$ec_lang['lpn_ts_title']='Zamana karşı değerler';
$ec_lang['lpn_ts_group_tip']='Grafiğin düğümleri mi yoksa hatları mı gösterdiği.';
$ec_lang['lpn_ts_group_nodes']='Düğümler';
$ec_lang['lpn_ts_group_links']='Hatlar';
$ec_lang['lpn_ts_quantity_tip']='Zamana karşı hangi değerin çizileceği.';
$ec_lang['lpn_ts_add']='Seçileni ekle';
$ec_lang['lpn_ts_add_tip']='Şu anda haritada seçili olan her şeyi grafiğe koyar.';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Haritada o türden hiçbir şey seçili değil.';
$ec_lang['lpn_ts_clear']='Hepsini kaldır';
$ec_lang['lpn_ts_chip_tip']='{id} öğesini grafikten çıkar';
$ec_lang['lpn_ts_none']='Henüz çizilecek bir şey yok. Haritada varlıklar seçin ve Seçileni ekle\'ye basın.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Henüz uzatılmış dönem sonucu yok. Simülasyonu çalıştırmak için Hesapla\'ya basın.';
$ec_lang['lpn_ts_summary']='Varlıklar: {n}, raporlama zamanları: {steps}';
$ec_lang['lpn_ts_axis_time']='Geçen süre';
$ec_lang['lpn_freq_menu']='Frekans';
$ec_lang['lpn_freq_tip']='Geçerli zaman adımındaki tüm düğümler veya tüm borular üzerinde bir özelliğin frekans dağılımını çizin.';
$ec_lang['lpn_freq_title']='Değerlerin dağılımı';
$ec_lang['lpn_freq_group_tip']='Grafiğin düğümleri mi yoksa boruları mı gösterdiği.';
$ec_lang['lpn_freq_quantity_tip']='Hangi değerin çizileceği.';
$ec_lang['lpn_freq_none']='Bu değer için henüz sonuç yok, bu yüzden çizilecek bir şey yok.';
$ec_lang['lpn_freq_summary']='Çizilen: {n} / {total}';
$ec_lang['lpn_freq_summary_time']='Çizilen: {n} / {total}, {time} zamanında';
$ec_lang['lpn_freq_axis_percent']='Altında kalan yüzde';
$ec_lang['lpn_view_units']='Birimler';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Tümünü kaydet';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Proje{n}';
$ec_lang['lpn_project_copy_suffix']='(kopya)';
$ec_lang['lpn_project_rename']='Yeniden adlandır';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Yeni proje…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Yeni proje';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Koordinat sistemi';
$ec_lang['lpn_new_coordsys_tip']='Şebekenizin koordinat sistemini seçin. Bu kalıcıdır; bir şebekeyi farklı koordinatlara dönüştürmenin tek yolu "Dosya, Yeni koordinatlara aç" seçeneğidir ve bu yaklaşık bir dönüşümdür.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Yerel, şematik veya özel';
$ec_lang['lpn_new_coordsys_local_tip']='Coğrafi referanslı değildir. Kendi arka plan görüntünüzü ekleyin veya hiçbirini kullanmayın.';
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
$ec_lang['lpn_crs_view']='Harita görünümüne göre filtrele';
$ec_lang['lpn_crs_view_tip']='Yalnızca haritanın baktığı yeri kapsayan projeksiyonları sunar. Tüm listeyi görmek için kapatın.';
$ec_lang['lpn_crs_place']='Yer adı arama';
$ec_lang['lpn_crs_place_tip']='Bir kasaba, adres veya işaret noktası yazın; harita görünümü oraya taşınır. Yazdığınız sözcükler, ilk seferinde izninizi isteyen OpenStreetMap yer adı hizmetine gönderilir. Yeni bir coğrafi proje de burada bulduğunuz yerden başlar.';
$ec_lang['lpn_crs_search']='Ara';
$ec_lang['lpn_crs_name']='Projeksiyon adı filtresi';
$ec_lang['lpn_crs_name_tip']='Adı veya EPSG kodu yazdığınızı içeren yalnızca projeksiyonları gösterir. Bir bölge numarası, UTM veya Mercator deneyin.';
$ec_lang['lpn_crs_list_tip']='Yukarıdaki iki filtreden kalan projeksiyonlar. Birini seçin ve Seç’e basın.';
$ec_lang['lpn_crs_choose']='Seç';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Henüz bir yer aranmadı, bu yüzden tüm liste sunuluyor. Yukarıdan bir yer arayın veya listeyi daraltmak için haritayı yakınlaştırın.';
$ec_lang['lpn_crs_count']='{total} projeksiyondan {n} tanesi listelendi.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='Bu şebekeyi {total} koordinat sisteminden {n} tanesi kapsıyor.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(harita yok)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs}, kullanılabilir projeksiyon bilgisi olmayan birkaç listelenmiş koordinat sisteminden biri. Bu, dünya haritasının, yer adı aramasının ve DEM kotlarının çalışmadığı anlamına gelir. Koordinatlarınız etkilenmez.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='adsız';
$ec_lang['lpn_crs_none']='Coğrafi referanslı değil';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Bir proje kendi birimlerini tutar, bu yüzden bu seçim yalnızca bu projeye aittir ve burada hiçbir şey bir tarayıcı ayarı olarak kaydedilmez. Yeni projeleri belirli bir şekilde başlatmak için boş bir projeyi şablonunuz olarak kaydedin ve her seferinde bir kopyasını yapın.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Petaluma, Kaliforniya';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Oluştur';
$ec_lang['lpn_file_open']='Aç…';
$ec_lang['lpn_file_save']='Kaydet';
$ec_lang['lpn_file_saveas']='Farklı kaydet…';
$ec_lang['lpn_file_revert']='Eski haline getir';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Son dosyalar';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='Bilgisayarınızda aramanıza gerek kalmadan {file} dosyasını tekrar açın.';
$ec_lang['lpn_recent_denied']='O dosyayı açma izni verilmediği için açılmadı.';
$ec_lang['lpn_recent_gone']='{file} açılamadı. Taşınmış, yeniden adlandırılmış veya silinmiş olabilir, bu yüzden son dosyalar listesinden çıkarıldı.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Yeni proje';
$ec_lang['lpn_tab_all']='Tüm projeler';
$ec_lang['lpn_tab_menu']='Proje menüsü';
$ec_lang['lpn_tab_duplicate']='Çoğalt';
$ec_lang['lpn_tab_move_left']='Sola taşı';
$ec_lang['lpn_tab_move_right']='Sağa taşı';
$ec_lang['lpn_tab_unsaved']='Bir dosyaya kaydedilmedi';
$ec_lang['lpn_import_bad_file']='O dosya, bu sayfadan kaydedilmiş bir proje olarak okunamadı.';
$ec_lang['lpn_import_no_room']='Bu projeyi eklemek için tarayıcı depolama alanında yeterli yer kalmadı. İhtiyacınız olmayan bir projeyi silip tekrar deneyin.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='Tamam';
$ec_lang['lpn_file_import_inp']='EPANET dosyası içe aktar…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Bir EPANET dosyasından — ister .inp metin dosyası ister EPANET\'in kaydettiği .net dosyası olsun — bir şebeke okur ve bu tarayıcıda yeni bir proje olarak kaydeder.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='EPANET dosyası dışa aktar…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Bu şebekeyi bir EPANET .inp dosyası olarak yazıp indirir. Yazdığınız sayılar tam olarak yazdığınız gibi yazılır. .inp biçiminin tutamadığı her şey sonrasında sizin için listelenir.';
$ec_lang['lpn_status_inp_exported']='{file} dışa aktarıldı.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='.inp biçiminin tutamadığı {n} şey.';
$ec_lang['lpn_inp_export_refused']='Bu proje bir EPANET dosyası olarak yazılamaz: {detail}';
$ec_lang['lpn_inp_bad_file']='O dosya bir EPANET şebeke dosyası olarak okunamadı.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Bu bir EPANET .net dosyasına benziyor, ancak bu sayfa onu okuyamadı. EPANET\'te açın ve orada Dosya, Dışa Aktar, Şebeke komutunu kullanarak .inp dosyası olarak kaydedin, ardından onu içe aktarın.';
$ec_lang['lpn_inp_report_heading']='{file} içe aktarıldı';
$ec_lang['lpn_inp_report_counts']='{units} biriminde {nodes} düğüm, rezervuar ve depo, {links} boru, pompa ve vana.';
$ec_lang['lpn_inp_report_clean']='Dosyadaki her şey aktarıldı. Hiçbir şey dışarıda bırakılmadı.';
$ec_lang['lpn_inp_report_label_anchor']='Metin etiketleri, EPANET\'in yerleştirdiği gibi sol üst köşelerinden yerleştirilir.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='EPANET dosyaları koordinat sistemi içermez, bu yüzden bu dosya başlangıçta coğrafi referanslı olmayacak. Bir dünya haritası üzerine yerleştirmek için Harita, Dünya haritası…\'nı kullanın. Koordinatlarını dönüştürmek için Dosya, Farklı dönüştür…\'ü kullanın.';
$ec_lang['lpn_inp_report_lead']='Bu sayfa EPANET\'in kullandığı her şeyi kullanmaz, ama dosyanızdaki hiçbir şey atılmaz. Aşağıda, dosyanızın tuttuğu ve bu sayfanın kullanmadan koruduğu şeyler ile dosya okunurken neyin değiştiği var:';
$ec_lang['lpn_inp_drop_headloss']='Bu dosya Hazen-Williams formülünü kullanmıyor. Bu sayfa Hazen-Williams hesapladığından, boru pürüzlülük sayıları tam olarak yazıldığı gibi korundu, ancak buradaki sonuçlar EPANET\'teki sonuçlarla eşleşmeyecek.';
$ec_lang['lpn_inp_drop_tank_curve']='Bu depolar düz kenarlı değildir: dosya şekillerini bir eğri olarak veriyor. Eğri Kitaplıklar kutusunda tutulur, depo hâlâ ona başvurur ve bir zaman dilimi hesaplaması, depoyu bu eğrinin verdiği takvimde doldurup boşaltır. Tek bir an için sonuç aynıdır, çünkü su yüzeyi dosyanın belirlediği seviyededir. Dosyada yazılı çap, eğrinin yanında tutulur ve eğrisiz bir deponun hangi çapla çizilip çözüleceğini belirler.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Bu kısma vanaları, dosyanın verdiği aynı kaybı taşıyan kısma vanaları olarak aktarıldı. Her iki çözücü de bunları çözebilir.';
$ec_lang['lpn_inp_drop_valve_active']='Bu vanalar basıncı veya debiyi kontrol eder ve su değiştikçe kendiliğinden açılıp kapanır. Aktarım sırasında hiçbir şey kaybolmadı, ve bu sayfa bunları EPANET çözücüsüyle çözer, bu şebeke için o çözücüyü kendiliğinden devreye alarak.';
$ec_lang['lpn_inp_drop_valve']='Bu vanalar bir eğriyle veya sabit bir basınç düşüşüyle tanımlanıyor, ve bu sayfada böyle bir öğe yok. Açık borular olarak geldi, bu yüzden şebeke hâlâ bağlı, ancak artık orada basıncı veya debiyi kontrol eden bir şey yok.';
$ec_lang['lpn_inp_drop_cv']='EPANET\'te bu borular suyun yalnızca tek yönde geçmesine izin verir. Sıradan borular olarak aktarıldılar, bu yüzden artık su içlerinden her iki yönde de akabilir.';
$ec_lang['lpn_inp_drop_demands']='Bu düğümlerin birden fazla talebi vardı. Talepler, bu sayfanın tuttuğu tek talep içinde toplandı.';
$ec_lang['lpn_inp_drop_patterns']='Bu sayfa talep desenlerini okumadı, çünkü zaman dilimi hesaplamasını çalıştıran bölümü yüklenmedi. Her talep, dosyada yazılı sayıdır.';
$ec_lang['lpn_inp_drop_demand_pattern']='Bu düğümlerin talebi çalışma boyunca değişiyor. Desenleri tam olarak geldi ve gördüğünüz talep, saatin gösterdiği andaki taleptir.';
$ec_lang['lpn_inp_drop_emitters']='Bu düğümlerin bir yağmurlama veya sızıntı katsayısı var. Korundu ve çözülüyor, ancak bu sayfada henüz onu görecek veya değiştirecek bir yer yok.';
$ec_lang['lpn_inp_drop_curve_long']='Bu pompa eğrisinin üçten fazla noktası vardı. En düşük, orta ve en yüksek noktaları korundu, çünkü bu sayfa en fazla üç noktaya bir eğri uydurur.';
$ec_lang['lpn_inp_drop_curve_missing']='Bu pompa, dosyada bulunmayan bir eğriye başvuruyor. Pompa eğrisiz geldi, bu yüzden hiç yük eklemiyor.';
$ec_lang['lpn_inp_drop_pump_other']='Bu pompa bir eğriyle değil, çektiği güçle tanımlanıyor. Eğrisiz olarak geldi, bu yüzden hiç yük eklemiyor.';
$ec_lang['lpn_inp_drop_head_pattern']='Bu rezervuarların su seviyesi çalışma boyunca yükselip alçalıyor. Desenleri tam olarak geldi ve gördüğünüz su seviyesi, saatin gösterdiği andaki seviyedir.';
$ec_lang['lpn_inp_drop_pump_speed']='Bu pompalar, eğrilerinin ölçüldüğü hızdan farklı bir hızda çalışıyor veya çalışma boyunca hız değiştiriyor. Hız ve deseni tam olarak geldi ve gördüğünüz yük, saatin gösterdiği andaki yüktür.';
$ec_lang['lpn_inp_drop_setting']='Bu borular, pompalar ve vanalar bu sayfanın tutamadığı bir ayar taşıyor. Açık olarak aktarıldılar.';
$ec_lang['lpn_inp_drop_rules']='Bu dosyada kural tabanlı kontroller var. Bu sayfa bunları okur ve kullanır. Modeli EPANET motoruyla çalıştırın; kurallar uygulanır ve içlerindeki her seviye, basınç ve debi bu projenin gösterdiği birimlere çevrilir. Bir kuralı okumak veya değiştirmek için Kitaplıklar altında Kurallar\'ı açın. Dosyanın belirttiği haliyle aynen korunurlar ve bir EPANET dosyası kaydederseniz geri yazılırlar.';
$ec_lang['lpn_inp_drop_eps']='Bu dosya bir zaman dilimi hesaplamasını tanımlıyor. Bu sayfanın zaman dilimi hesaplamasını çalıştıran bölümü yüklenmedi, bu yüzden yalnızca başlangıç koşulları geldi.';
$ec_lang['lpn_inp_drop_quality']='Bu dosya, su kalitesinin taşınırken nasıl değiştiğini tanımlıyor: suda başlangıçta ne olduğu ve o maddenin borularda ve depolarda ne kadar hızlı tepkimeye girdiği. Bu sayfa bu sayıları okur ve kullanır. Ayarlar, Hesaplama, Su kalitesi altında bir kimyasal seçin, sonra modeli EPANET motoruyla çalıştırın; derişim, çalışma ilerledikçe şebeke boyunca hesaplanır. Satırlar korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
$ec_lang['lpn_inp_drop_sources_mixing']='Bu dosya, bir kimyasalın şebekeye nerede dozlandığını ve bir depodaki suyun nasıl karıştığını belirtir. Bir doz, eklendiği düğümde görünür ve bir depo hangi karışım modelini izlediğini belirtir. Hem doz hem de karışım modeli yalnızca EPANET motoru tarafından hesaplanır.';
$ec_lang['lpn_inp_drop_energy']='Bu EPANET dosyası, pompalama maliyeti modelleme verisi içeriyor. Bu sayfa bunu okuyup kullanıyor. Modeli EPANET motoruyla çalıştırın, sonra her pompanın ne kadar çalıştığını, çektiği gücü, kullandığı enerjiyi ve bunun maliyetini görmek için Su, Raporlar, Pompa enerjisi\'ni açın. Satırlar korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Bu dosya, bazı düğümlerine, borularına veya diğer öğelerine etiket veriyor. Her etiket tam olarak geldi ve her biri kendi öğesinin özelliklerinde durur; orada okuyabilir veya değiştirebilirsiniz.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Bu dosya, EPANET\'in yazdırdığı raporu nasıl biçimlendireceğine dair kendi ayarlarını tutuyor. Motorun raporunu burada, Raporlar, EPANET çalıştırması altında okuyabilirsiniz, ama bu, bu ayarların istediği biçim yerine motorun standart biçiminde çıkar. Satırlar korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
$ec_lang['lpn_inp_drop_sections']='Bu dosya, bu sayfanın hiç okumadığı bir bölüm içeriyor. Burada kullanılmaz. Bütün olarak korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
$ec_lang['lpn_inp_drop_quality_options']='Bu dosya EPANET su kalitesi seçeneklerini belirtiyor: su kalitesi analizinin türünü adlandıran Kalite seçeneği, ve bir kimyasalla ilgili iki ayar, Bağıl difüzivite ve Kalite toleransı. Üçü de korunur ve üçü de kullanılır. Su yaşı, kaynak izleme ve bir kimyasal burada ayrı ayrı hesaplanır, ve bir kimyasal çalıştırdığınızda bu iki kimyasal ayarı EPANET motoruna verilir. Bir EPANET dosyası kaydederseniz hepsi geri yazılır.';
$ec_lang['lpn_inp_drop_file_options']='Bu dosya, koordinatları tutan Harita ya da önceden hesaplanmış hidroliği tutan Hidrolik gibi yardımcı bir dosyaya başvuruyor. Bu sayfa bunlardan hiçbirini açamaz, bu yüzden satırlar oldukları gibi korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
$ec_lang['lpn_inp_drop_demand_model']='Bu dosya, basınç düşük olduğunda bir düğümün talebinden daha azını aldığı basınç güdümlü bir analiz (PDA) istiyor. Bu sayfa talep güdümlü çözer, bu yüzden burada her düğüm, hangi basınç ortaya çıkarsa çıksın, dosyanın belirttiği talebi alır. Satır korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
$ec_lang['lpn_inp_drop_other_options']='Bu dosya, bu sayfanın okumadığı seçenekler belirtiyor. Burada kullanılmazlar. Korunurlar ve bir EPANET dosyası kaydederseniz geri yazılırlar.';
$ec_lang['lpn_inp_drop_net_options']='Bu EPANET .net dosyası, bu sayfanın bir denetimi olmayan ayarlar belirtiyor, bu yüzden değerleri aktarılmak yerine burada listelenir. Geri kalan her şey aktarıldı. Bunlara ihtiyacınız varsa, dosyayı EPANET\'te açın ve bir .inp dosyası olarak kaydetmek için Dosya, Dışa aktar, Şebeke\'yi kullanın, sonra onu içe aktarın.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Bu bir EPANET .net dosyasıydı. Bu, EPANET\'in kendi proje dosyasıdır, yayımlanmış bir tanımı yoktur ve bu sayfa biçimini örnek dosyalardan çözerek okur; bu yüzden onu güvenilir bir yol olarak değil, elinizde başka bir şey olmadığında kullanın. .inp dosyası, diğer her programın okuduğu belgelenmiş biçimdir: EPANET\'te bir tane yazmak için Dosya, Dışa aktar, Şebeke\'yi kullanın ve mümkün olduğunda onu içe aktarın.';
$ec_lang['lpn_inp_drop_backdrop']='Bu dosya bir arka plan görüntüsü adlandırıyor ancak görüntünün kendisini içermiyor. Dosya, Arka plan görüntüsü, Görüntü ekle ile kendiniz ekleyin.';
$ec_lang['lpn_inp_drop_dangling']='Bu borular dosyada bulunmayan bir düğümü adlandırıyor, bu yüzden dışarıda bırakıldılar.';
$ec_lang['lpn_inp_drop_units']='Bu dosyada belirtilen debi birimi bu sayfanın tanıdığı bir birim değil, bu yüzden her sayı dakikada galon olarak okundu. Yanıtları kullanmadan önce her sayıyı kontrol edin.';
$ec_lang['lpn_inp_drop_anchor_missing']='Bu metin, dosyada bulunmayan bir düğüme, rezervuara veya depoya bağlıydı. Dosyanın koyduğu yerde serbest metin olarak geldi ve artık hiçbir şeyi izlemiyor.';
$ec_lang['lpn_import_notes_heading']='Bu proje bir EPANET dosyasından okundu. O dosyanın tuttuklarının bir kısmı korunur ama bu sayfada kullanılmaz.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='{name} bir dosyadan açıldı ve bu tarayıcıya yeni bir proje olarak eklendi.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Proje dosyası';
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
$ec_lang['lpn_file_upload_explain']='Bu tarayıcı bir dosyaya bağlanamıyor, bu yüzden burada bir dosya açmak aslında bir yükleme işlemidir: proje bu tarayıcıya kopyalanır ve çalışmanızı dosyaya geri kaydetmenin tek yolu, Dosya, Farklı Kaydet ile dosyanın üzerine yazmaktır.';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='Bu sayfadan kaydedilmiş bir proje dosyası açın.';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='Bağlı dosyaya kaydeder.';
$ec_lang['lpn_file_saveas_tip']='Kaydedilecek bir dosya seçin. Bu proje o dosyaya bağlanır ve bundan sonra Kaydet o dosyaya yazar.';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='Tarayıcınızın İndirme ayarlarını kullanarak kaydeder. Bu tarayıcı bir dosyaya bağlanamadığından Kaydet devre dışıdır, yalnızca Farklı Kaydet kullanılabilir. Tarayıcınızın "Her dosyanın nereye kaydedileceğini sor" ayarını açarsanız, orijinal dosyayı seçip üzerine yazabilirsiniz.';
$ec_lang['lpn_status_uploaded']='Proje dosyası yüklendi. Buna bir bağlantı sürdürülemez, bu yüzden ona geri kaydetmenin tek yolu Dosya, Farklı Kaydet kullanmaktır.';
$ec_lang['lpn_status_downloaded']='{file} indirildi. Bu tarayıcı bir dosyaya bağlanamadığından, bu proje bir dosyaya kaydedilmemiş olarak işaretli kalır.';
$ec_lang['lpn_status_file_opened']='{file} açıldı.';
$ec_lang['lpn_status_already_open']='O dosya burada zaten {name} olarak açık, bu yüzden ikinci bir kopya açmak yerine ona geçildi.';
$ec_lang['lpn_status_already_open_dirty']='O dosya burada zaten {name} olarak açık ve henüz kaydetmediğiniz değişiklikler içeriyor. İkinci bir kopya açmak yerine ona geçildi. Bunun yerine diskteki sürümü istiyorsanız Dosya, Eski Haline Getir\'i kullanın.';
$ec_lang['lpn_status_saved']='{file} kaydedildi.';
$ec_lang['lpn_status_reverted']='{file} diskten yeniden yüklendi.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Kapatmadan önce {name} üzerindeki değişiklikleriniz kaydedilsin mi?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} yalnızca bu tarayıcıda tutuluyor. Bir dosyaya kaydetmeden kapatırsanız, kalıcı olarak kaybolur.';
$ec_lang['lpn_close_discard']='Kaydetmeden kapat';
$ec_lang['lpn_cancel']='İptal';
$ec_lang['lpn_revert_confirm']='Yaptığınız değişiklikler atılsın ve {file} diskten yeniden yüklensin mi?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Bu proje {file} dosyasından geldi, ancak o dosyayla bağlantı kayboldu. Yeniden bağlanmak için dosyayı tekrar seçin.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Dosyaya yazılamadı. Dosya taşınmış veya yeniden adlandırılmış olabilir, ya da izin geri alınmış olabilir. Çalışmanız bu tarayıcıda hâlâ kayıtlıdır.';
$ec_lang['lpn_file_changed_elsewhere']='Siz açtıktan sonra başka biri bu dosyaya kaydetti, bu yüzden şimdi kaydetmek onun çalışmasının üzerine yazar. Değişikliklerinizi kendi dosyanızda tutmak için Dosya, Farklı Kaydet\'i, kendinizinkini atıp onunkini yüklemek için Dosya, Eski Haline Getir\'i kullanın.';
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
$ec_lang['lpn_lock_somebody']='Başka biri';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} bu dosyayı açık tutuyor.';
$ec_lang['lpn_lock_open_readonly']='Salt okunur aç';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Kilidini kaldır';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Bu dosya kullanımda görünüyor.';
$ec_lang['lpn_lock_open_care']='Veri kaybını önlemek için aşağıdaki seçeneklerden dikkatle seçin.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='{x} süredir kullanımda.';
$ec_lang['lpn_lock_age_edited']='{x} önce son kez düzenlendi.';
$ec_lang['lpn_lock_age_saved']='{x} önce son kez kaydedildi.';
$ec_lang['lpn_lock_age_never_saved']='Bu dosyaya henüz hiçbir şey kaydedilmedi.';
$ec_lang['lpn_lock_age_unknown']='Ne kadar süredir kullanımda olduğuna, ya da en son ne zaman kaydedildiğine veya düzenlendiğine dair bir kayıt yok.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"Sor", bu dosyayı açık tutan kişiye onu istediğinizi bildirir ve başka hiçbir şeyi değiştirmez. "Salt okunur aç", buraya kaydedemeden ona bakmanızı ve istediğiniz her şeyi değiştirmenizi sağlar. "Kilidi kır", dosyanın üzerine kaydetmenizi sağlar; onların kaydedilmemiş çalışması kaybolmaz, ama artık buraya kaydedemezler ve birinin ikisini elle birleştirmesi gerekebilir.';
$ec_lang['lpn_lock_ask']='Sor';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Soran kişi olarak kimin adını verelim? Baş harfleriniz ideal olur. Bu dosyanın kilidiyle birlikte sunucumuzda, dosyayı o anda açık tutan herkes için saklanır ve 30 gün içinde silinir.';
$ec_lang['lpn_lock_ask_sent']='Bu dosyayı açık tutan kişiden onu kapatmasını istedik. Sayfası hâlâ açıksa bir dakika içinde görecek. Başka hiçbir şey değişmedi ve dosya, o kapatana kadar hâlâ onun.';
$ec_lang['lpn_lock_ask_failed']='Mesajınız iletilemedi. Ya şu anda bu dosyayı açık tutan kimse yok, ya da sunucuya ulaşılamadı.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='O dosya açılmadı ve burada hiçbir şey değişmedi. Başka biri onu hâlâ açık tutuyor.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name}, bu dosyayı düzenlemek istiyor. Hazır olduğunuzda çalışmanızı kaydedin ve onu devretmek için Dosya, Projeyi kapat\'ı kullanın.';
$ec_lang['lpn_ago_seconds']='{n} saniye';
$ec_lang['lpn_ago_minutes']='{n} dakika';
$ec_lang['lpn_ago_hours']='{n} saat';
$ec_lang['lpn_ago_days']='{n} gün';
$ec_lang['lpn_ago_unknown']='bilinmeyen bir süre';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Mesajlar';
$ec_lang['lpn_msglog_heading']='Son mesajlar';
$ec_lang['lpn_msglog_empty']='Henüz mesaj yok.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} önce';
$ec_lang['lpn_msglog_note']='En yeni önce. Bu sayfa açıkken son {n} mesajı tutar ve bilgisayarınızda hiçbir şey saklanmaz.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Salt okunur: {name} bu dosyayı açık tutuyor. Burada istediğiniz her şeyi değiştirebilirsiniz, ancak kaydedemezsiniz. Farklı bir dosyaya kaydetmek için Dosya, Farklı Kaydet\'i kullanın.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Dikkat: bu proje üzerinde bir kilidi kontrol etmek veya oluşturmak için sunucuya ulaşılamadı, bu yüzden bir meslektaşınızın aynı dosyayı aynı anda düzenlemesini hiçbir şey engellemiyor. Kilitleme yeniden çalışmaya başlarsa size bildirilecektir.';
$ec_lang['lpn_lock_storage_error']='Dikkat: bu site kilit kayıtlarını kaydedemiyor, bu yüzden bir meslektaşınızın aynı dosyayı aynı anda düzenlemesini hiçbir şey engellemiyor. Bu, sunucudaki bir kurulum hatasıdır, burada düzeltebileceğiniz bir şey değildir — kilit klasörü web sunucusu tarafından yazılabilir değil.';
$ec_lang['lpn_lock_full_error']='Dikkat: bu site kimin hangi projeyi açık tuttuğunu kaydedecek yerinin tükendi, bu yüzden bir meslektaşınızın aynı dosyayı aynı anda düzenlemesini hiçbir şey engellemiyor. Bu, sunucudaki bir kurulum hatasıdır, burada düzeltebileceğiniz bir şey değildir.';
$ec_lang['lpn_lock_not_asked']='Bu proje için kilitleme çalışmıyor, bu yüzden bir meslektaşınızın aynı dosyayı aynı anda düzenlemesini hiçbir şey engellemiyor. Bu projenin henüz bir tanımlayıcısı yok, ve onu bir dosyaya kaydetmek ona bir tanımlayıcı verir.';
$ec_lang['lpn_lock_restored']='Kilitleme yeniden çalışıyor ve bu dosya artık sizin kaydedebileceğiniz bir dosya.';
$ec_lang['lpn_lock_dismiss']='Bu mesajı gizle';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Projeniz bu bilgisayardaki bir dosyaya kaydedilecek. Yalnızca siz istediğinizde kaydedilir, başka hiçbir zaman değil, bu yüzden o dosyaya haberiniz olmadan hiçbir şey yazılmaz.';
$ec_lang['lpn_file_training_2']='İki kişinin aynı dosyayı aynı anda düzenlememesi için bu site kimin dosyayı açık tuttuğunu takip eder. Biri zaten açmışsa, yine de açıp bakabilir veya kendi kopyanızı tutabilirsiniz.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='İlk kaydettiğinizde, tarayıcınız bu sitenin dosyayı düzenleyip düzenleyemeyeceğini soracaktır. Bu soru bizden değil tarayıcınızdan gelir ve evet demeniz, Kaydet\'in çalışmanızı geri yazmasını sağlar. Genellikle dosya başına yalnızca bir kez sorulur.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Devam et';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Dosyayı tekrar seçin';
$ec_lang['lpn_file_reconnect']='Bu dosyayla yeniden bağlan';
$ec_lang['lpn_file_reconnect_alert']='Bu proje {file} dosyasından geldi. Tarayıcınızın ona yazabilmesi için izninize yeniden ihtiyacı var. Aşağıdan yeniden bağlanın.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Bu, başka birinin açık tuttuğu aynı dosya, bu yüzden üzerine kaydedilemez. Farklı bir dosya veya farklı bir isim seçin.';
$ec_lang['lpn_saveas_overwrites_project']='O dosya zaten farklı bir proje içeriyor, {name}. Buraya kaydetmek onu tamamen değiştirir. Devam edilsin mi?';
$ec_lang['lpn_saveas_overwrites_newer']='O dosya siz son gördüğünüzden beri değişti, bu yüzden neredeyse kesinlikle başka biri ona kaydetti. Buraya kaydetmek onun sürümünü sizinkiyle değiştirir. Devam edilsin mi?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Bu proje için isim';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='{closed} kapatıldı. Şimdi {opened} gösteriliyor.';
$ec_lang['lpn_status_closed_empty']='{closed} kapatıldı. Yeni boş bir proje başlatıldı.';
$ec_lang['lpn_storage_full']='Kaydedilmedi. Tarayıcı depolama alanı dolu veya kullanılamıyor, bu yüzden bu sekmeyi kapattığınızda son değişiklikleriniz kaybolacak.';
$ec_lang['lpn_storage_unreadable']='Kaydedilmedi. Bu proje tarayıcı deposundan okunamadı. Depolanan kopyası olduğu gibi bırakılacak ve üzerine yazılmayacak, bu yüzden bu sekmede hiçbir şey kaydedilmiyor. Çalışmaya devam etmek için bir dosya açın veya yeni bir proje oluşturun.';
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
$ec_lang['lpn_about_credits']='Emeği geçenler';
$ec_lang['lpn_help_welcome']='Karşılama sayfası';
$ec_lang['lpn_about_license']='GNU Genel Kamu Lisansı v3.0 veya sonraki bir sürümü altında lisanslanmıştır.';
$ec_lang['lpn_notes_1_term']='Nasıl çözüldüğü';
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
$ec_lang['lpn_notes_1_def']='Bu şebekeyi EPANET çözücüsü çözer. Bir toplam çalışma süresi belirleyin ve her raporlama adımı sırayla hesaplanır: depolar dolar ve boşalır, talepler desenlerini izler, ve araç çubuğu çalışmayı geri oynatır.';
$ec_lang['lpn_notes_2_term']='Ne yapmadığı';
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
$ec_lang['lpn_notes_2_def']='Su kalitesi modellenir: su yaşı, kaynak izleme, ve boru cidarlarında ve suyun kendisinde tepkimeye giren bir kimyasal. Dalgalanma ve su darbesi modellenmez: buradaki her sonuç, zaten düzenli akan su içindir, bir vananın aniden kapanmasıyla oluşan basınç dalgası için değildir.';
$ec_lang['lpn_notes_3_term']='Projeleri kaydetme';
$ec_lang['lpn_notes_3_def']='Her proje bir sekmedir ve çalışırken her sekme bu tarayıcıya kaydedilir. Tarayıcı verilerinizi temizlemek hepsini siler, bu yüzden çalışmanızı bir dosyada tutun: Dosya, Farklı Kaydet. Bir sekmedeki yıldız işareti, bir dosyada olmayan değişiklikler taşıdığı anlamına gelir. Siz istemedikçe hiçbir şey bir dosyaya yazılmaz. Bazı tarayıcılarda bir proje, kaydettiğiniz dosyaya bağlanır ve Dosya, Kaydet bundan sonra o aynı dosyaya geri yazar; diğerlerinde bağlantı mümkün değildir, bu yüzden Kaydet devre dışıdır ve yalnızca Farklı Kaydet kullanılabilir. Bir proje dosyası paylaşılan bir sürücüde tutulduğunda, bu sayfa bir meslektaşınızın onu zaten açık tutup tutmadığını size söyler, böylece iki kişi birbirinin üzerine yazmaz.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Pompa eğrisi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Bir pompa H = H₀ − aQ^b denklemini izler; burada H pompanın eklediği yük, Q ise içinden geçen debidir. Üreticinin eğrisinden bir, iki veya üç nokta girin. Üç nokta — sıfır debideki yük, normal çalışma noktası ve en yüksek debi noktası — H₀, a ve b\'yi doğrudan belirler ve yayımlanan bir eğriyi en yakından izler. İki nokta, tepe noktası sıfır debide olan bir parabole (b = 2) oturtulur. Tek nokta yaygın bir kural kullanır: sıfır debideki yük, girdiğiniz yükün 1,33 katıdır ve en yüksek debi, girdiğiniz debinin 2 katıdır; bu da yine b = 2 verir. Hiç nokta girilmemiş bir pompa hiç yük eklemez. Eğri sıfırda durdurulmaz, bu yüzden bir pompadan eğrisinin sağlayabileceğinden daha fazla debi istemek negatif bir yük verir. Çözüm daha büyük bir pompa veya daha küçük bir taleptir, farklı bir eğri uydurması değil. Bir eğri üçten fazla nokta tutabilir, ve verdiğiniz her nokta okunur.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='Bu sayfada ayrıca';
$ec_lang['lpn_notes_4_def']='Bir proje, arkasında bir sokak haritası olan gerçek bir zemin üzerinde durabilir. EPANET .inp dosyaları okunabilir ve yazılabilir. Alt panel bir güzergah boyunca profil çizer ve düğümleri listeler. Öğeler sonuçlarına göre renklendirilebilir, ve Bul, belirlediğiniz bir koşulu karşılayan her öğeyi seçer.';
$ec_lang['lpn_notes_6_term']='Tablo sütunları yardımı';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Sütun seç</td><td>Başlığa tıklayın</td></tr><tr><td>Sütun seçimini ekle veya genişlet</td><td>Başka bir başlığa Ctrl+tıklama veya Shift+tıklama yapın</td></tr><tr><td>Seçili sütun(lar)ı taşı (yeniden sırala)</td><td>Sürükleyin ya da sağ tık veya ⋮ menüsünde Sütunları yönet…\'i kullanın</td></tr><tr><td>⋮ menüsü ve sıralama oku.</td><td>Bir başlığın üst köşesinin üzerine gelin, ya da bir başlığı seçin veya Tab ile içine girin</td></tr><tr><td>Gizle, Tümünü göster, ya da görünürlüğü ve sırayı yönet</td><td>Başlığa sağ tıklayın ya da başlığın sağ üst köşesindeki ⋮ menüsü</td></tr><tr><td>Sütuna göre sırala</td><td>Başlığın sağ üst köşesindeki ok simgesi</td></tr><tr><td>Tablonun sonuna yeni satır olarak yapıştır</td><td>Sağ tık, başlığın sağ üst köşesindeki ⋮ menüsü, ya da Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Tablo klavye kısayolları';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Ok tuşları</td><td>Gezinin.</td></tr><tr><td>Tab, Enter</td><td>Girişi tamamlayın ve bir hücre yatayda / aşağıda gezinin.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Geriye doğru gezinin.</td></tr><tr><td>Shift+ok tuşları</td><td>Seçimi genişletin.</td></tr><tr><td>Ctrl+C</td><td>Seçimi kopyalayın.</td></tr><tr><td>Ctrl+D</td><td>Seçimi en üst satırından aşağı doldurun.</td></tr><tr><td>Ctrl+Enter</td><td>Seçimi etkin hücrenin değeriyle doldurun.</td></tr><tr><td>Ctrl+A</td><td>Tüm tabloyu seçin.</td></tr><tr><td>Ctrl+Shift+V</td><td>Tablonun sonuna yeni satır olarak yapıştırın.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Sonraki veya önceki tabloya geçin.</td></tr><tr><td>Delete</td><td>Bir hücreyi temizleyin.</td></tr><tr><td>F2</td><td>Bir hücreyi düzenlemek için açın.</td></tr><tr><td>Esc</td><td>Bir düzenlemeyi iptal edin.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Renk bandı sınırları aynı kalır';
$ec_lang['lpn_notes_color_def']='Renk bandı sınırları, bir veri sınıflandırma yöntemi seçtiğinizde belirlenir. Her zaman adımında yeniden belirlenmez, çünkü bu, renklerin her adımda yeni bir şey ifade etmesine yol açar ve bu, sisteminizi görselleştirmek için yararlı değildir. EPANET de aynı şekilde çalışır. Yeni sınırlar almak için yöntemi yeniden seçin veya kendi sınırlarınızı yazın.';
$ec_lang['lpn_notes_epanet_term']='Hazen-Williams sabitleri artık EPANET ile eşleşiyor';
$ec_lang['lpn_notes_epanet_def']='Ağustos 2026\'da Hazen-Williams katsayısı ve üssü, EPANET ile eşleşecek şekilde değiştirildi. Yük kaybı sonuçları bu sayfanın önceki sürümlerinden en fazla yüzde 0,1 farklıdır; bu, C değerinin kendisindeki belirsizlikten çok daha küçüktür.';
$ec_lang['lpn_notes_engine_term']='Bu sayfa hangi EPANET\'i çalıştırıyor';
$ec_lang['lpn_notes_engine_def']='Bu sayfadaki EPANET çözücüsü, 20 Şubat 2025\'te yayımlanan OWA-EPANET 2.3.5\'tir. EPANET, Aralık 2019\'da 2.2.0 sürümünü yayımlayan Amerika Birleşik Devletleri Çevre Koruma Ajansı ile çalışan bir topluluk olan Open Water Analytics tarafından geliştirilir. Çalışma raporu ona 2.3.05 der, çünkü motor son sayıyı iki basamakla yazar. Bu sayfaya, Luke Butler\'ın MIT lisansı altındaki epanet-js 0.9.0\'ı üzerinden ulaşır ve tarayıcınızın içinde çalışır: şebekeniz çözülmek üzere hiçbir yere gönderilmez.';
$ec_lang['lpn_id_invalid']='Boşluk ve tırnak işareti içermeyen bir kimlik girin.';
$ec_lang['lpn_id_taken']='Bu kimlik zaten kullanılıyor.';
$ec_lang['lpn_diag_no_fixed_head']='Bir rezervuar veya depo ekleyin. Şebekenin çözülebilmesi için en az bir bilinen su seviyesine ihtiyacı var.';
$ec_lang['lpn_diag_dangling_link']='Bir boru veya pompa, artık var olmayan bir düğüme bağlanıyor:';
$ec_lang['lpn_diag_unreachable']='Bu düğümlerin bir rezervuara giden yolu yok:';
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
$ec_lang['lpn_engine_fetching']='EPANET çözücüsü alınıyor. Bir kez indirilir ve ardından bu cihazda tutulur, böylece daha sonra çevrimdışı çalışır.';
$ec_lang['lpn_engine_ready']='EPANET çözücüsü artık bu cihazda ve çevrimdışı çalışıyor.';
$ec_lang['lpn_engine_fetching_valve']='EPANET çözücüsü alınıyor, böylece bu vana şimdi ve daha sonra çevrimdışı çözülebilir.';
$ec_lang['lpn_engine_ready_valve']='EPANET çözücüsü artık bu cihazda. Kendiliğinden açılıp kapanan vanalar çevrimdışı çalışacak.';
$ec_lang['lpn_engine_unavailable']='Kendiliğinden açılıp kapanan vanaları çözen EPANET çözücüsü alınamadı. İnternete bir kez bağlanın, böylece o andan itibaren bu cihazda tutulur.';
$ec_lang['lpn_engine_needed_loading']='Siz kurarken EPANET çözücüsü yükleniyor. Sonuçlar tamamen yüklendiğinde kullanılabilir olacak.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Çözücü yükleme ilerlemesi';
$ec_lang['lpn_engine_wait']='Çözücü yükleniyor. Sonuçlar kısa süre gecikecek. Çalışmaya devam edebilirsiniz.';
$ec_lang['lpn_engine_wait_pct']='Çözücü %{percent} yüklendi.';
$ec_lang['lpn_engine_wait_bytes']='Çözücü şimdiye kadar {kb} KB yüklendi. Toplam bilinmediğinden tamamlanma yüzdesi de bilinmiyor.';
$ec_lang['lpn_engine_needed_failed']='EPANET çözücüsü henüz yüklenmedi, yüklenemiyor ve bu şebeke yalnızca onun tarafından çözülebilir. İnternete bağlandığınızda yüklenecektir.';
$ec_lang['lpn_diag_valve_needs_epanet']='Bu vanalar kendiliğinden açılıp kapanır ve yalnızca EPANET çözücüsü bunları hesaplayabilir. EPANET çözücüsü yüklenemedi, bu yüzden şu sonuçlar eksik:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Bu vanalar doğrudan bir rezervuara veya depoya bağlı, ve orada su seviyesi zaten belirlenmiş durumda, bu yüzden vananın kontrol edecek bir şeyi kalmıyor. Vana ile rezervuar veya depo arasına kısa bir boru ekleyin:';
$ec_lang['lpn_diag_not_converged']='Bir çözüm bulunamadı. Sıfır çap gibi gerçek olamayacak değerleri kontrol edin.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Çözüm yakınsamadı. Bu sayılar son yineleme olup bir yanıt değildir. Bunları kullanmayın.';
$ec_lang['lpn_diag_not_converged_trials']='{iterations} yinelemeden sonra durdu.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='{accuracy} Doğruluk ayarına ulaşamayan {error} bağıl hatasında, {iterations} yinelemeden sonra durdu.';
$ec_lang['lpn_field_roughness']='Pürüzlülük';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Hazen-Williams C. Daha yüksek bir sayı daha pürüzsüz bir boru anlamına gelir: yeni plastik için yaklaşık 150, yeni çelik veya demir için 130 ve eski boru için 100.';
$ec_lang['lpn_field_length']='Uzunluk';
$ec_lang['lpn_field_from']='Başlangıç';
$ec_lang['lpn_field_to']='Bitiş';
$ec_lang['lpn_field_length_tip']='Borunun uzunluğu. Otomatik açıkken bu, çizdiğinizi izler. Çizimden farklı bir uzunluk yazmak için Otomatik\'i kapatın.';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Vana tipi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Vananın ne yaptığı. Bir kısma vanası sabit bir kayıp tutar. Diğer üçü bir basıncı veya debiyi korur, ve su değiştikçe tam açılır, kapanır veya kısmen kapanır. Tipler farklı hidrolik özellikleri denetler, bu yüzden tip değiştirildiğinde ayarlar kaybolabilir.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Kısma (TCV)';
$ec_lang['lpn_valve_type_prv']='Basınç düşürücü (PRV)';
$ec_lang['lpn_valve_type_psv']='Basınç sürdürücü (PSV)';
$ec_lang['lpn_valve_type_fcv']='Debi kontrol (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Basınç kırıcı (PBV)';
$ec_lang['lpn_valve_type_gpv']='Genel amaçlı (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Basınç düşüşü';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='Vananın giderdiği basınç. Bir basınç kırıcı vana, suyun akış yönü ne olursa olsun her zaman tam olarak bu kadar basıncı giderir. Bu, vana üzerindeki bir düşüştür, tutulan bir basınç değildir.';
$ec_lang['lpn_inp_drop_gpv_curve']='Bu vana, dosyada bulunmayan bir yük kaybı eğrisine başvuruyor. Vana eğrisiz geldi, bu yüzden siz bir eğri verene kadar tam açık kalır.';
$ec_lang['lpn_gpv_curve_source']='Vana yük kaybı eğrisi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Bu vananın her debide ne kadar yük kaybettiğini belirten, Kitaplıklar kutusundaki eğri. Birden çok vana aynı eğriyi kullanabilir, ve onu orada düzenlemek hepsini değiştirir. Bu vana yalnızca başvuruyu tutar; noktaların kendisi Kitaplıklar, Eğriler altında okunur ve düzenlenir.';
$ec_lang['lpn_field_valve_setting_pressure']='Basınç ayarı';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Vananın koruduğu basınç. Bir basınç düşürücü vana, mansap tarafındaki basıncı bu değerde veya altında tutar. Bir basınç sürdürücü vana, memba tarafındaki basıncı bu değerde veya üstünde tutar.';
$ec_lang['lpn_field_valve_setting_flow']='Debi ayarı';
$ec_lang['lpn_field_valve_setting_flow_tip']='Vananın geçirdiği en fazla su. Bundan daha az su geçmek istediğinde, vana tam açık durur ve hiçbir kayıp eklemez.';
$ec_lang['lpn_field_valve_setting']='Ayar';
$ec_lang['lpn_field_valve_setting_loss']='Kayıp katsayısı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Kısma vanasının, hız yükünün bir katı olarak sayılan, ne kadar yük giderdiği. Tam açık duran bir vana için 0 kullanın. Bu tek sayı, bir kısma vanasının kaybının tamamıdır.';
$ec_lang['lpn_field_valve_diameter_tip']='Vananın içinden geçen açıklığın genişliği. Suyun vanadan geçiş hızı bu genişlikten hesaplanır, ve kayıp bu hızdan çıkarılır.';
$ec_lang['lpn_field_valve_km_tip']='Vana ayarının giderdiğinin üzerine, vana tam açık dururken vana gövdesinden kaynaklanan kayıp. Hız yükünün bir katı olarak sayılır. Yoksaymak için 0 kullanın.';
$ec_lang['lpn_field_km']='Küçük (yerel) kayıp katsayısı, k';
$ec_lang['lpn_field_km_tip']='Bu borudaki dirsek, vana ve bağlantı parçalarından kaynaklanan kayıp, hız yükünün bir katı olarak sayılır. Düz bir boru için 0 kullanın.';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Küçük kayıp, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Pompa yük eğrisi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Bu pompanın her debide ne kadar yük eklediğini belirten, Kitaplıklar kutusundaki eğri. Birden çok pompa aynı eğriyi kullanabilir, ve onu orada düzenlemek hepsini değiştirir. Bu pompa yalnızca başvuruyu tutar; noktaların kendisi Kitaplıklar, Eğriler altında okunur ve düzenlenir.';
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
$ec_lang['lpn_field_desc']='Açıklama';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='Kendi kullanımınız için, bir sokak köşesi veya bir borunun neden yapıldığı gibi. EPANET dosyasına girip çıkar, orada parçanın kendi satırının sonunda durur. Hiçbir hesaplama onu okumaz. Bir satır sonu, boşluğa dönüşür, çünkü dosyanın onu koyacağı bir yer yoktur.';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Etiket';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Bir etiket, bir basınç bölgesi veya bir iş emri gibi istediğiniz herhangi bir anlamı taşıyabilir. Ne burada ne de EPANET\'te hiçbir hesaplama onu okumaz. Bir etiket tek bir sözcüktür: EPANET ilk boşlukta okumayı durdurur, bu yüzden yazarken bir boşluk reddedilir. EPANET dosyasına ve ondan geri taşınır.';
$ec_lang['lpn_pump_effic_curve']='Pompa verim eğrisi';
$ec_lang['lpn_pump_effic_curve_tip']='Bu pompanın her debide ne kadar verimli olduğunu belirten, Kitaplıklar kutusundaki eğri. Birden çok pompa aynı eğriyi kullanabilir, ve onu orada düzenlemek hepsini değiştirir. Bu pompa yalnızca başvuruyu tutar; noktaların kendisi Kitaplıklar, Eğriler altında okunur ve düzenlenir.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Eğri seçilmedi';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Eğriler';
$ec_lang['lpn_curve_library_link_tip']='Kitaplıklar kutusunu Eğriler bölümünde açar; burada bir eğri eklenir, tanımlanır, düzenlenir ve silinir. Bir öğe hangi eğriyi kullandığını belirtir.';
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
$ec_lang['lpn_curve_kind_head']='Pompa yükü';
$ec_lang['lpn_curve_kind_effic']='Pompa verimi';
$ec_lang['lpn_curve_kind_volume']='Depo hacmi';
$ec_lang['lpn_curve_kind_headloss']='Vana yük kaybı';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Tür belirtilmedi';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Hacim';
$ec_lang['lpn_pump_effic_col']='Verim';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Bu pompanın seçili bir verim eğrisi yok, bu yüzden tüm şebeke için belirlenen verimle, {percent}, çalışır.';
$ec_lang['lpn_pump_effic_unstated']='Bu pompa, bu projede hiçbir şeyin tanımlamadığı {name} adlı bir verim eğrisine başvuruyor, bu yüzden tüm şebeke için belirlenen verimle, {percent}, çalışır.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Mod: Seç. Görmek veya değiştirmek için bir öğeye ya da etikete tıklayın. Bir düğümü, bir kırılma noktasını ya da bir etiketi taşımak için sürükleyin. Bir borudaki bükümleri eklemek veya kaldırmak için Kırılma noktaları aracını kullanın.';
$ec_lang['lpn_mode_delete']='Mod: Sil. Kaldırmak için bir öğeye tıklayın.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Mod: Kırılma noktaları. Her borunun kırılma noktaları küçük kare tutamaçlar olarak gösterilir. Bir kırılma noktası eklemek için boruya tıklayın, kaldırmak için bir tutamaca tıklayın veya taşımak için bir tutamacı sürükleyin. Bu modda haritada başka hiçbir şey değişmez.';
$ec_lang['lpn_mode_zoom_window']='Mod: Pencere yakınlaştır. Yakınlaştırmak için haritada bir kutunun iki karşı köşesine tıklayın veya birini sürükleyin.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Hiçbir şey seçili değil. Önce haritada bir öğeye tıklayın, sonra Sil\'e basın.';
$ec_lang['lpn_mode_add_junction']='Mod: Düğüm Ekle. Bir düğüm yerleştirmek için haritaya tıklayın. Öğeleri ve etiketleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_reservoir']='Mod: Rezervuar Ekle. Bir rezervuar yerleştirmek için haritaya tıklayın. Öğeleri ve etiketleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_tank']='Mod: Depo Ekle. Bir depo yerleştirmek için haritaya tıklayın. Öğeleri ve etiketleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_pipe']='Mod: Boru Ekle. Bağlamak için bir düğüme, ardından başka bir düğüme tıklayın. Aralarında boş bir yere tıklayarak çizgiyi bükün, ya da yeniden başlamak için Escape\'e basın. Öğeleri ve etiketleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_pump']='Mod: Pompa Ekle. Bağlamak için bir düğüme, ardından başka bir düğüme tıklayın. Aralarında boş bir yere tıklayarak çizgiyi bükün, ya da yeniden başlamak için Escape\'e basın. Öğeleri ve etiketleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_valve']='Mod: Vana Ekle. Bağlamak için bir düğüme, ardından başka bir düğüme tıklayın. Aralarında boş bir yere tıklayarak çizgiyi bükün, ya da yeniden başlamak için Escape\'e basın. Öğeleri ve etiketleri değiştirmek veya taşımak için Seç moduna geçin.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Mod: Metin Ekle. Bir Metin yerleştirmek için haritaya tıklayın. Metni bir düğüme bağlamak için ona yakın bir yere tıklayın. Öğeleri ve etiketleri değiştirmek veya taşımak için Seç moduna geçin.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Haritadaki şeyleri değiştirmek, taşımak ve sürüklemek için bu modu kullanın. Sayfanın varsayılan olarak döndüğü mod budur: bir proje açmak gibi bazı işlemlerden sonra kendiliğinden buraya döner. Esc tuşuna ikinci kez basmak, seçili olan her şeyin seçimini kaldırır.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='Bir etiketi taşımak için sürükleyebilirsiniz. Taşındığını size bildirmek için etiket kısa süreliğine vurgulanır. Bir etiketi yerine geri koymak için çift tıklayın.';
$ec_lang['lpn_field_auto']='Otomatik';
$ec_lang['lpn_method_switch_confirm']='Sürtünme yöntemini değiştirmek, borularınıza zaten yazılmış olan pürüzlülük sayılarını değiştirmez, ve bir yöntem için pürüzlülük diğeri için anlamsızdır. Bundan sonra her boruyu kontrol edin. Yine de değiştirilsin mi?';
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
$ec_lang['lpn_field_closed']='Kapalı';
$ec_lang['lpn_field_closed_tip']='Bu boruyu kapatın, böylece hiç su geçemesin. Boru haritada kalır ve tüm sayılarını korur, ve istediğiniz zaman tekrar açabilirsiniz.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Boylam';
$ec_lang['lpn_field_lat']='Enlem';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Kuzeylik';
$ec_lang['lpn_field_easting']='Doğuluk';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='K';
$ec_lang['lpn_field_easting_abbr']='D';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Enl.';
$ec_lang['lpn_field_lon_abbr']='Boy.';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Bu düğümü tam olarak yerleştirmek için bir koordinat konumu yazın. Bir senaryoda bu konum yalnızca o senaryoda geçerlidir, tıpkı sürüklemek gibi; Temel\'de düğümü her yerde yerleştirir.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Bu, haritanın dışında. Pseudo Mercator enlemi -85,05 ile 85,05 arasında, boylamı ise -180 ile 180 arasındadır.';
$ec_lang['lpn_field_text_size']='Boyut çarpanı';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Tüm yakınlaştırma düzeylerinde göster';
$ec_lang['lpn_field_text_all_zoom_tip']='Ne kadar uzaklaşırsanız uzaklaşın, bu metni çizimde tutar. İşareti kaldırırsanız, görünüm Harita ve sayfa altında ayarlanan etiketleme eşiğinden daha genişlediğinde metin, diğer etiketlerle birlikte gizlenir.';
$ec_lang['lpn_tool_labels']='Etiketler';
$ec_lang['lpn_labels_heading_node']='Düğüm etiketleri';
$ec_lang['lpn_labels_heading_link']='Hat etiketleri';
$ec_lang['lpn_labels_decimals_tip']='Bu etiket için gösterilen ondalık basamak sayısı';
$ec_lang['lpn_labels_mark_extrema']='En yüksek ve en düşük değerleri işaretle';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Haritada etiketlenen her özelliğin en yüksek değerinin üstüne bir çizgi (üstçizgi), en düşük değerinin altına bir çizgi (altçizgi) çizer; böylece sayıları okumadan en yükseği ve en düşüğü ayırt edebilirsiniz.';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Tümüne uygula';
$ec_lang['lpn_settings_apply_to_all_tip']='Bu türden zaten çizilmiş her öğe, bu metinle başlayan bir kimlik alır. Her biri kendi numarasını korur. Bir sayıyla bitmeyen kimlik olduğu gibi bırakılır.';
$ec_lang['lpn_confirm_apply_prefix']='{n} öge, kimlikleri {prefix} ile başlayacak şekilde yeniden adlandırılsın mı? Her biri kendi numarasını korur.';
$ec_lang['lpn_prefix_applied']='{n} öge yeniden adlandırıldı. {skipped} diğeri olduğu gibi bırakıldı.';
$ec_lang['lpn_labels_prefix_tip']='Harita etiketlerinde bu özellikten önce eklenen metin';
$ec_lang['lpn_labels_suffix_tip']='Harita etiketlerinde bu özellikten sonra eklenen metin';
$ec_lang['lpn_labels_suffix_gradient_tip']='Harita etiketlerinde yük kaybı eğiminden sonra eklenen metin. Buraya yüzde işareti yazmayın. Birimler yüzde olduğunda sizin için otomatik eklenir.';
$ec_lang['lpn_labels_separator']='Değerler arasındaki metin';
$ec_lang['lpn_labels_separator_tip']='Bir etikette bir özellikle bir sonraki arasındaki metin. Varsayılan olarak bir boşluktur.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Öncelik';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='Bir etiket sığmadığında değerlerin bırakılma sırası. 1 en uzun süre tutulur.';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='İki düğüm etiketi çakıştığında değerlerin bırakılma sırası. 1 numaralı değer önce bırakılır. Yalnızca bir değer kaldığında ve etiketler hâlâ çakışıyorsa, etiketin tamamı gizlenir: talebi daha düşük olan, basıncı aralığın ortasına daha yakın olan, ya da kotu veya yükü komşu düğümlerinkine daha yakın olan etiket.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Önek';
$ec_lang['lpn_labels_col_after']='Sonek';
$ec_lang['lpn_labels_col_decimals']='Ondalık';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Göster';
$ec_lang['lpn_labels_show_tip']='Değerlerin bir etikette görünme sırası. 1 numaralı değer önce gelir: yığılmış bir etikette en üstte, tek satırlık bir etikette ise başta.';
$ec_lang['lpn_labels_priority_customer_tip']='Değerlerin bir müşteri etiketinden bırakılma sırası. 1 numaralı değer önce bırakılır.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Birimleri kullan';
$ec_lang['lpn_labels_use_units_tip']='Birimin Sonra kutusunda ve etikette gösterilmesi ve birimler değiştiğinde onunla birlikte güncellenmesi için işaretleyin. Kendi Sonra metninizi yazmak için işareti kaldırın.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Başlangıç durumu';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Düğüm renkleri';
$ec_lang['lpn_settings_sym_link_colors']='Hat renkleri';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Arka plan görüntüsü...';
$ec_lang['lpn_backdrop_add']='Ekle';
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
$ec_lang['lpn_backdrop_scale']='Seçerek ölçekle';
$ec_lang['lpn_backdrop_scale_entry']='World dosyası veya haritadaki bir pikselin boyutuyla ölçekle';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Mevcut boyuttan, seçtiğiniz bir nokta etrafında ölçeklendir';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Arka plan görüntüsünde olduğu yerde kalması gereken noktaya tıklayın.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Mevcut boyutundan ölçeklendirin. 1 aynı bırakır, 1,1 %10 büyütür, 0,9 %10 küçültür.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Haritadaki bir pikselin boyutunu girin veya görüntünün world dosyasının tüm içeriğini yapıştırın';
$ec_lang['lpn_backdrop_scale_entry_bad']='Haritadaki bir pikselin boyutu için tek bir sayı yazın veya bir world dosyasının altı satırının tamamını yapıştırın.';
$ec_lang['lpn_backdrop_wld_bad']='Bu world dosyası görüntüyü döndürüyor, yansıtıyor veya iki yönde eşit olmayan biçimde geriyor. Harita bir görüntüyü yalnızca taşıyabilir ve her iki yönde aynı oranda yeniden boyutlandırabilir, bu yüzden dosya kullanılmadı.';
$ec_lang['lpn_backdrop_unreadable']='Bu resim web tarayıcınızda gösterilemiyor. Resmi PNG veya JPEG olarak kaydedip yeniden ekleyin.';
$ec_lang['lpn_backdrop_position']='Taşı';
$ec_lang['lpn_backdrop_remove']='Kaldır';
$ec_lang['lpn_backdrop_remove_confirm']='Arka plan görüntüsü kaldırılsın mı?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Dünya haritası…';
$ec_lang['lpn_map_attach_tip']='Dünya haritasını, bu projeyi başka hiçbir şekilde değiştirmeden bu projeye ekler.';
$ec_lang['lpn_map_attach_add']='Ekle';
$ec_lang['lpn_map_attach_readjust']='Yeniden ayarla';
$ec_lang['lpn_map_attach_readjust_tip']='Harita ekleme sürecinin 2. adımına geri dönün.';
$ec_lang['lpn_map_attach_scale_from']='Şimdiki boyuttan ölçekle…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Haritayı, çiziminizin ortasına göre şimdiki boyutundan ölçekleyin. 1 aynı bırakır, 1,1 %10 büyütür, 0,9 %10 küçültür.';
$ec_lang['lpn_map_attach_scale_from_bad']='Sıfırdan büyük tek bir sayı yazın.';
$ec_lang['lpn_map_attach_scale_from_done']='Harita yeniden boyutlandırıldı ve çiziminiz ile içindeki her koordinat tam olarak olduğu gibi kaldı.';
$ec_lang['lpn_map_attach_none']='Bu projeye henüz eklenmiş bir dünya haritası yok. Önce Harita, Dünya haritası, Ekle\'yi kullanın.';
$ec_lang['lpn_map_attach_remove']='Kaldır';
$ec_lang['lpn_map_attach_remove_tip']='Dünya haritasını kaldırır. Çizim ve koordinatları her iki durumda da dokunulmamış kalır.';
$ec_lang['lpn_map_attach_done']='Dünya haritası artık çiziminizin arkasında ve projeniz değişmedi. Onu tekrar kaldırmak için Harita, Dünya haritası, Kaldır\'ı kullanın.';
$ec_lang['lpn_map_attach_removed']='Dünya haritası gitti ve çizim tam olarak olduğu gibi.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Çiziminiz, sıfır enlem ve sıfır boylamda, okyanusun ortasında, tüm dünyanın haritası üzerinde. Önce kendi yerinizi bulun: çizimin arkasındaki haritayı kaydırıp yakınlaştırın, bir yer adı arayın, ya da bir enlem ve boylam yazın. Çizimin kendisi hareket etmez.';
$ec_lang['lpn_mapgeo_step1']='2 adımdan 1\'i: dünyadaki yerinizi bulun';
$ec_lang['lpn_mapgeo_step2']='2 adımdan 2\'si: haritayı çiziminizin arkasına oturtun';
$ec_lang['lpn_mapgeo_hint1']='Çiziminizin arkasındaki haritayı kaydırıp yakınlaştırın, ya da bir yer arayın, ya da bir enlem ve boylam yazın. Sonra Yaklaşık yerleştir\'e basın.';
$ec_lang['lpn_mapgeo_readjust_intro']='Çiziminiz, en son yerleştirdiğiniz yerde. Onu başka bir yere taşımak için, çizimin arkasındaki haritayı kaydırıp yakınlaştırın, bir yer adı arayın, ya da bir enlem ve boylam yazın. Çizimin kendisi hareket etmez.';
$ec_lang['lpn_mapgeo_hint2']='Haritayı çiziminizin altında kaydırmak için herhangi bir yere sürükleyin. Çiziminiz ve içindeki her koordinat tam olarak oldukları yerde kalır. Harita doğru olduğunda Burada coğrafi referans ver\'e basın.';
$ec_lang['lpn_mapgeo_gestures']='Yakınlaştırma, çiziminizi ve haritayı birlikte hareket ettirir, böylece ne kadar iyi hizalandıklarını görebilirsiniz. Sürüklemek yalnızca haritayı hareket ettirir.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Haritayı döndür';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} derece';
$ec_lang['lpn_mapgeo_dial_size']='Harita boyutu';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} kat';
$ec_lang['lpn_mapgeo_dial_help']='Haritayı büyütüp küçültmek ve döndürmek için iki çubuğu kaydırın, ya da üstlerindeki kutulara yazın. Her çubuğun ortası, 1. adımda bırakılan yerdir, bu yüzden 1 ve 0 dokunmayın anlamına gelir. Ok tuşları her ikisinde de çalışır.';
$ec_lang['lpn_mapgeo_place']='Yaklaşık yerleştir';
$ec_lang['lpn_mapgeo_finish']='Burada coğrafi referans ver';
$ec_lang['lpn_mapgeo_cancelled']='Dünya haritası olduğu yere geri döndü ve çiziminiz hiç hareket etmedi.';
$ec_lang['lpn_mapgeo_locked']='Projeleri değiştirmeden veya kaydetmeden önce Burada coğrafi referans ver düğmesiyle bitirin, ya da İptal\'e basın. Dünya haritası hâlâ yerleştiriliyor.';
$ec_lang['lpn_backdrop_scale_prompt1']='Arka plan görüntüsü üzerinde iki nokta tıklayın, örneğin bir ölçek çubuğunun iki ucu. Ardından aralarındaki gerçek mesafeyi yazın.';
$ec_lang['lpn_backdrop_scale_prompt2']='İki nokta arasındaki gerçek mesafe';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Taşıma için taban noktasına (görüntü üzerinde) tıklayın.';
$ec_lang['lpn_backdrop_position_prompt2']='Hedef nokta için yöntemi seçin, ardından Devam Et\'e tıklayın.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Arka plan görüntüsü ayarlanıyor.';
$ec_lang['lpn_backdrop_target_label']='Şuraya taşı:';
$ec_lang['lpn_backdrop_target_node']='Bir düğüm';
$ec_lang['lpn_backdrop_target_free']='Harita üzerinde herhangi bir nokta';
$ec_lang['lpn_backdrop_target_coords']='Yazılan koordinatlar';
$ec_lang['lpn_backdrop_coords_prompt']='O noktanın taşınacağı X,Y\'yi yazın';
$ec_lang['lpn_backdrop_continue']='Devam et';
$ec_lang['lpn_tool_settings']='Ayarlar';
$ec_lang['lpn_settings_show_titles']='Sayfa başlıklarını göster';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='Sayfa başlığını ve çizimin üstündeki karşılama satırını gizler, böylece çalışmak için haritaya daha fazla yer kalır. Yazdırmada her zaman yalnızca sade bir harita gösterilir.';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Bu başlıkları gizle';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Seçim yardımını göster';
$ec_lang['lpn_settings_area_hint_tip']='Bir alan seçerken bir sonraki tıklamanızın ne yapacağını söyleyen balonu haritanın üzerinde gösterir.';
$ec_lang['lpn_settings_id_prefixes']='Kimlik önekleri';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Başlangıç değerleri';
$ec_lang['lpn_settings_defaults_note']='Bundan sonra oluşturduğunuz öğeler için kullanılır. Mevcut öğeler değişmez.';
$ec_lang['lpn_settings_push_note']='Yalnızca şu anda etiketleri gösterilen özellikler uygulanır.';
$ec_lang['lpn_settings_push_btn']='Bu yeni öğe değerlerini mevcut her öğeye uygula';
$ec_lang['lpn_push_confirm']='Bu özellikler, mevcut her öğede şimdi yeni öğeler için ayarlanmış değerlerle değiştirilsin mi? Yazdığınız değerlerin üzerine yazılır. Bunu geri alabilirsiniz.';
$ec_lang['lpn_push_properties']='Özellikler:';
$ec_lang['lpn_push_assets']='Düğümler ve borular:';
$ec_lang['lpn_push_none_displayed']='Şu anda etiket olarak gösterilen bir başlangıç değeri yok, bu yüzden uygulanacak bir şey yok. İstediğiniz özelliklerin etiketlerini Etiketler panelinde açın, ardından tekrar deneyin.';
$ec_lang['lpn_push_nothing']='Mevcut hiçbir öğe, uygulanan özelliklerden hiçbirine sahip değil.';
$ec_lang['lpn_push_no_change']='Her öğe bu değerlere zaten sahip, bu yüzden hiçbir şey değişmez.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Özel özellikler';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Kendi amaçlarınız için kendinizin tanımladığı özellikler. Diğer tüm özellikler gibi projeyle ve senaryolarla birlikte saklanırlar.';
$ec_lang['lpn_cp_design']='Tasarım';
$ec_lang['lpn_cp_design_tip']='Her özel özellik için bir satır; her biri açıldığında şunları gösterir: Anahtar, Etiket, Uygulanır, Şu şekilde doğrula, İzin ver veya kısıtla, bu seçimin adlandırdığı karakter alanı, Uzunluk alt sınırı, Uzunluk üst sınırı, Alt sınır, Üst sınır.';
$ec_lang['lpn_cp_add']='Özel özellik ekle';
$ec_lang['lpn_cp_add_tip']='Tasarım tablosuna bir satır ekler ve düzenlemek üzere açar.';
$ec_lang['lpn_cp_remove_tip']='Bu özelliği tasarım tablosundan kaldırır. Varlıklarınıza zaten yazılmış değerler dosyada saklı kalır ve aynı anahtarı yeniden tasarlarsanız geri gelir.';
$ec_lang['lpn_cp_none']='Henüz tasarlanmış bir özel özellik yok.';
$ec_lang['lpn_cp_unnamed']='Henüz adlandırılmadı';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Anahtar';
$ec_lang['lpn_cp_key_tip']='Anahtar: Bir özellik bu ad altında saklanır. Boşluklara izin verilmez ve anahtarınızın yerleşik bir alanla asla çakışmaması için sizin için bir ön ek eklenir.';
$ec_lang['lpn_cp_label']='Etiket';
$ec_lang['lpn_cp_label_tip']='Etiket: Bir okuyucu bunu özellikler kutusunda, Bul’da ve bir tablo sütununun başlığında görür.';
$ec_lang['lpn_cp_applies']='Uygulanır';
$ec_lang['lpn_cp_applies_tip']='Uygulanır: J, L, R gibi bu özelliği kullanan varlıklar için virgülle ayrılmış kimlik ön eki listesi.';
$ec_lang['lpn_cp_validate']='Şu şekilde doğrula';
$ec_lang['lpn_cp_validate_tip']='Şu şekilde doğrula: Bu, iyi bir değerin neye benzediğini belirtir. Büyük/küçük harf kuralları yalnızca İngiliz alfabesini okur; bu belirtilmiş bir sınırdır. Her şeyi kabul etmek için Doğrulama yapma’yı seçin.';
$ec_lang['lpn_cp_restrict']='Bu karakterleri kısıtla';
$ec_lang['lpn_cp_restrict_tip']='Bu karakterleri kısıtla: Bir değer yalnızca burada listelenen karakterleri kullanabilir veya hiçbirini kullanamaz; burada "@" herhangi bir harf, "#" herhangi bir sayısal basamak anlamına gelir ve izinliyse "-", "." ve "," ayrıca listelenmelidir; ayrıca herhangi bir boşluk karakteri diğer karakterlerin arasında olmalıdır.';
$ec_lang['lpn_cp_restrict_mode']='İzin ver veya kısıtla';
$ec_lang['lpn_cp_restrict_mode_tip']='İzin ver veya kısıtla: Verilen karakterler ya bir değerin kullanabileceği tek karakterlerdir ya da kullanamayacağı karakterlerdir.';
$ec_lang['lpn_cp_restrict_allow']='Yalnızca bu karakterlere izin ver';
$ec_lang['lpn_cp_minlength']='Uzunluk alt sınırı';
$ec_lang['lpn_cp_minlength_tip']='Uzunluk alt sınırı: Daha kısa herhangi bir giriş işaretlenir; boş ve yarım yazılmış girişleri bu şekilde bulursunuz.';
$ec_lang['lpn_cp_length']='Uzunluk üst sınırı';
$ec_lang['lpn_cp_length_tip']='Uzunluk üst sınırı: Daha uzun herhangi bir giriş işaretlenir.';
$ec_lang['lpn_cp_low']='Alt sınır';
$ec_lang['lpn_cp_low_tip']='Alt sınır: Beklediğiniz en küçük değer budur. Sayılar sayı olarak, metin ise sözlük sırasına göre karşılaştırılır.';
$ec_lang['lpn_cp_high']='Üst sınır';
$ec_lang['lpn_cp_high_tip']='Üst sınır: Beklediğiniz en büyük değer budur. Sayılar sayı olarak, metin ise sözlük sırasına göre karşılaştırılır.';
$ec_lang['lpn_cp_val_none']='Doğrulama yapma';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Sayı .';
$ec_lang['lpn_cp_val_number_comma']='Sayı ,';
$ec_lang['lpn_cp_val_integer']='Tam sayı';
$ec_lang['lpn_cp_val_upper']='TÜMÜ BÜYÜK HARF';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Değer tam olarak yazdığınız şekilde saklandı.';
$ec_lang['lpn_cp_bad_number']='Bu değer, bu özellik için gereken bir sayı değil.';
$ec_lang['lpn_cp_bad_integer']='Bu değer, bu özellik için gereken bir tam sayı değil.';
$ec_lang['lpn_cp_bad_case']='Bu değer, bu özellik için gereken şekilde TÜMÜ BÜYÜK HARF değil.';
$ec_lang['lpn_cp_bad_chars']='Bu değer, bu özelliğin izin vermediği bir karakter kullanıyor.';
$ec_lang['lpn_cp_bad_space']='Boşluğa yalnızca diğer karakterler arasında izin verilir.';
$ec_lang['lpn_cp_bad_minlength']='Bu değer, bu özelliğin izin verdiğinden daha kısa.';
$ec_lang['lpn_cp_bad_length']='Bu değer, bu özelliğin izin verdiğinden daha uzun.';
$ec_lang['lpn_cp_bad_low']='Bu değer, bu özelliğin alt sınırının altında.';
$ec_lang['lpn_cp_bad_high']='Bu değer, bu özelliğin üst sınırının üstünde.';
$ec_lang['lpn_cp_key_needed']='Bu özel özelliğe boşluk içermeyen bir anahtar verin.';
$ec_lang['lpn_cp_key_taken']='Başka bir özel özellik zaten bu anahtarı kullanıyor.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Senaryo';
$ec_lang['lpn_scenario_base']='Temel';
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
$ec_lang['lpn_scenario_overrides']='Kendi değer sayısı';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Kehribar renkli halka, bu öğenin yalnızca {name} senaryosuna ait bir değer taşıdığı anlamına gelir.';
$ec_lang['lpn_scenario_overrides_tip']='Bu değerlerin her biri haritada kehribar renkli bir halkayla işaretlenir. Bunlar olmadan çizimi görmek için {base}\'e geçin.';
$ec_lang['lpn_scenario_menu']='Senaryolar';
$ec_lang['lpn_scenario_tip']='Çizimin şu anda gösterdiği ve sayfanın şu anda çözdüğü değerler kümesi. Senaryo değiştirmek, ya da bir tanesini eklemek, yeniden adlandırmak veya silmek için tıklayın.';
$ec_lang['lpn_scenario_new']='Yeni senaryo…';
$ec_lang['lpn_scenario_new_name']='Senaryo {n}';
$ec_lang['lpn_scenario_prompt_name']='Bu senaryo için ad';
$ec_lang['lpn_scenario_rename']='Senaryoyu yeniden adlandır…';
$ec_lang['lpn_scenario_delete']='Senaryoyu sil';
$ec_lang['lpn_scenario_delete_confirm']='{name} senaryosu ve yalnızca ona ait olan {n} değer silinsin mi? Çizimin kendisi değişmez.';
$ec_lang['lpn_scenario_override']='Yalnızca bu senaryoda';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='İşaretlemek, bu senaryonun bu değer için — Temel ile aynı sayı olsa bile — kendi girişine sahip olduğu anlamına gelir. Kutuyu boşaltarak yeniden Temel değerini kullanın.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Temel senaryo: {value}';
$ec_lang['lpn_scenario_deactivated']='{id}, {scenario} içinde şebeke dışında. Hâlâ çizimde ve diğer senaryolarınızda bulunuyor.';
$ec_lang['lpn_scenario_push_btn']='Temel değerlerini tüm senaryolara uygula';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Şu anda gösterilen etiketlere sahip özellikler için her senaryo Temel değerine döner. Herhangi bir senaryoda bu özellikler için girilmiş değerler atılır.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Her senaryo bu özellikler için Temel değerlerini kullansın mı? Herhangi bir senaryoda bu özellikler için girilmiş değerler atılır. Bunu geri alabilirsiniz.';
$ec_lang['lpn_scenario_push_scenarios']='Etkilenen senaryolar:';
$ec_lang['lpn_scenario_push_values']='Atılan değerler:';
$ec_lang['lpn_scenario_push_none']='Hiçbir senaryonun bu özelliklerden herhangi biri için kendi değeri yok, bu yüzden hiçbir şey değişmez. Hiçbir şey atılmaz.';
$ec_lang['lpn_delete_drops_overrides']='Bu öğeyi silmek, senaryolarınızın onun için tuttuğu {n} değeri de atar. Devam edilsin mi?';
$ec_lang['lpn_push_base_only']='Bu işlem çizimin kendisini değiştirir, bu yüzden yalnızca {base} içinde yapılabilir. {base}\'e geçin ve tekrar deneyin.';
$ec_lang['lpn_field_active']='Bu şebekenin parçası';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Öğeyi çizimde bırakıp şebeke dışına almak için bu kutunun işaretini kaldırın: gri çizilir ve çözücü onu görmezden gelir. Bir senaryoda, bir borunun açılıp kapatılması bu şekilde yapılır.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Emiter üssü';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='EPANET\'in yağmurlamalar ve sızıntılar için damlatıcı denkleminde üs: debi = katsayı x basıncın bu üsse yükseltilmiş hali. Yalnızca bir düğümde damlatıcı olduğunda yanıtı değiştirir, bu da şimdilik bir EPANET dosyasından okunan bir şebeke anlamına gelir.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='DEM\'i oku';
$ec_lang['lpn_elev_dem_sample_tip']='Bu düğümde DEM\'in kotunu okur ve aşağıda gösterir. Kot kutusunda hiçbir şey değişmez. Yatay DEM çözünürlüğü, Dünya\'nın çoğu için yaklaşık 30 m\'dir, daha iyi veri olan yerlerde daha incedir.';
$ec_lang['lpn_elev_dem_use']='DEM\'i kullan';
$ec_lang['lpn_elev_dem_use_tip']='Bu düğümde DEM\'in kotunu, yukarıdaki Kot kutusuna, orada olanın yerine koyar. Henüz okunmadıysa önce DEM\'i okur. Tek bir Geri al eski haline döndürür.';
$ec_lang['lpn_elev_dem_none']='DEM\'de bu düğüm için kot yok.';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM {v} {u} diyor.';
$ec_lang['lpn_settings_elev_source']='Kot kaynağı';
$ec_lang['lpn_settings_elev_source_tip']='Yeni bir düğümün kotunu nereden aldığı. Zemin yüzeyi, Dünya\'nın çoğunda yaklaşık 30 m çözünürlüğünde olan ve daha iyi veri olan yerlerde daha ince olan Mapbox DEM\'den okunur.';
$ec_lang['lpn_settings_elev_source_typed']='Yukarıda yazılan kot';
$ec_lang['lpn_settings_elev_source_dem']='Mapbox DEM verisi';
$ec_lang['lpn_settings_accuracy']='Doğruluk';
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
$ec_lang['lpn_settings_default_is']='Varsayılan {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Çözücünün durmadan önce ne kadar yaklaşması gerektiği; debilerin bir denemeden diğerine hâlâ ne kadar değiştiğiyle ölçülür. Daha küçük bir sayı daha kesindir ve daha uzun sürer. Her iki çözücü de bu tek kutuyu okur, ancak her biri bu değişimi farklı bir toplama göre ölçer: yerleşik çözücü taleplerin toplamına göre, EPANET hat debilerinin toplamına göre. Boş bırakılırsa bu sayfa, EPANET\'in kendi varsayılanından daha sıkı bir doğruluk kullanır.';
$ec_lang['lpn_settings_specific_gravity']='Özgül ağırlık';
$ec_lang['lpn_settings_specific_gravity_tip']='Akışkanın ağırlığının suya göre oranı. Bir göstergenin okuyacağı basınçları değiştirir, debileri değil.';
$ec_lang['lpn_settings_viscosity']='Bağıl viskozite';
$ec_lang['lpn_settings_viscosity_tip']='Akışkanın viskozitesinin 20 santigrat derecedeki suya göre oranı. Yalnızca Darcy-Weisbach yönteminde yanıtı değiştirir.';
$ec_lang['lpn_settings_trials']='Azami deneme sayısı';
$ec_lang['lpn_settings_trials_tip']='Yakınsamayan bir şebekede çözücünün pes etmeden önce kaç deneme yapmasına izin verildiği.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Yakınsamazsa';
$ec_lang['lpn_settings_unbalanced_tip']='Deneme sayısını tüketmiş ve hâlâ yakınsamamış bir şebekeyle ne yapılacağı. Ek denemelere izin vermek çoğunlukla yakınsamaya ulaşır. Durdurmak, son denemeyi olduğu gibi bildirir; bu bir çözüm değildir. Yalnızca EPANET çözücüsü bu kutuyu okur. Yerleşik çözücü her zaman durur ve yanıtı yakınsamadı olarak işaretler.';
$ec_lang['lpn_settings_unbalanced_continue']='Ek denemelere izin ver';
$ec_lang['lpn_settings_unbalanced_stop']='Dur ve son denemeyi bildir';
$ec_lang['lpn_settings_unbalanced_trials']='Bildirmeden önce ek deneme sayısı';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Yukarıdaki azami sayı tükendikten sonra, son deneme bildirilmeden önce kaç ek denemeye daha izin verileceği. Yalnızca EPANET çözücüsü bu kutuyu okur.';
$ec_lang['lpn_settings_head_error']='Yük hatası sınırı';
$ec_lang['lpn_settings_head_error_tip']='Çözücünün durmadan önce geçmesi gereken ek bir sınama: herhangi bir borudaki kalan en büyük yük hatası. Sıfır, bu sınamanın uygulanmayacağı anlamına gelir. Yalnızca EPANET çözücüsü bu kutuyu okur.';
$ec_lang['lpn_settings_flow_change']='Debi değişimi sınırı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Çözücünün durmadan önce geçmesi gereken ek bir sınama: herhangi bir borunun debisinin bir denemeden diğerine en büyük değişimi. Sıfır, bu sınamanın uygulanmayacağı anlamına gelir. Yalnızca EPANET çözücüsü bu kutuyu okur.';
$ec_lang['lpn_settings_damp_limit']='Sönümleme şurada başlar';
$ec_lang['lpn_settings_damp_limit_tip']='Çözücünün, salınan bir şebekenin yakınsamasına yardımcı olabilecek daha küçük adımlar atmaya başladığı doğruluk. Sıfır, çözücünün hiç sönümleme yapmayacağı anlamına gelir. Yalnızca EPANET çözücüsü bu kutuyu okur.';
$ec_lang['lpn_settings_option_unset']='Belirtilmemiş';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Şebekedeki her talebe aynı anda uygulanan tek bir katsayı. Sistemin bugünkü kullanımdan daha fazla veya daha az kullanımda ne yaptığını sormak için kullanın. Yazdığınız sayıları değiştirmez. Bir senaryo kendi çarpanını taşıyabilir, böylece ortalama gün, azami gün ve tepe saat birer sayı olur; projeninkini kullanmak için bir senaryoda boş bırakın.';
$ec_lang['lpn_settings_engine_native']='EPANET çözücüsüyle çöz';
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
$ec_lang['lpn_settings_engine_native_tip']='Bunu etkinleştirirseniz yerleşik çözücü mümkün olduğunda kullanılır. Aksi halde, ABD EPA\'dan EPANET çözücüsü her zaman kullanılır. Yerleşik çözücü, uzun süreli benzetimlerde veya etkin bir PRV, PSV ya da FCV varken kullanılmaz. EPANET çözücüsü ilk kez kullanıldığında yaklaşık 650 KB indirilir ve ardından bu cihazda tutulur. Bir boru küçük (yerel) kayıp taşıdığında, iki çözücü son basamaklarda farklılaşır: EPANET yer çekimi için kullandığı değeri yuvarladığından, onun küçük kayıpları tam ifadeye göre çok az daha düşük çıkar.';
$ec_lang['lpn_engine_loading']='EPANET çözücüsü yükleniyor…';
$ec_lang['lpn_engine_failed']='EPANET çözücüsü yüklenemedi. Bunun yerine yerleşik çözücü gösteriliyor.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='EPANET çözücüsüyle çözüldü, çünkü bu vanalar kendiliğinden açılıp kapanır:';
$ec_lang['lpn_unit_unknown']='Bu çizim, bu sayfanın sunmadığı bir birim belirtiyor: {unit}. Her şey geldiği gibi tutulup gösterildi, hiçbir şey değiştirilmedi. Bu sayfa bu birimi tanımadığı sürece yanıt verilemez, çünkü ne kadar büyük olduğunu anlamanın bir yolu yoktur.';
$ec_lang['lpn_engine_manning_note']='Not: Manning pürüzlülüğüyle, EPANET yük kaybını yerleşik çözücüye göre yaklaşık %0,6 daha düşük hesaplar.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='EPANET çözücüsü bu şebekeyi kabul etmedi, bu yüzden çalışmadı.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='EPANET çözücüsü şunu söyledi: {message}';
$ec_lang['lpn_engine_refused_fallback']='Ekrandaki sayılar bunun yerine yerleşik çözücüden geldi.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Ekrandaki sayılar bunun yerine yerleşik çözücüden geldi. Bu çözücü bir seferde tek bir anı hesaplar, bu yüzden bu, yalnızca {time} anındaki şebekedir; her depo hâlâ başlangıç seviyesindedir.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Bu kontroller, artık bu projede olmayan bir öğeyi adlandırıyor, bu yüzden dışarıda bırakıldı: {ids}';
$ec_lang['lpn_control_unreadable_note']='Bu kontroller okunamadı, bu yüzden dışarıda bırakıldı: {ids}';
$ec_lang['lpn_rule_dangling_note']='Bu kurallar artık bu projede olmayan bir öğeye başvuruyor, bu yüzden bu çalıştırmada dikkate alınmadılar: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Bu kurallar okunamadı, bu yüzden bu çalıştırmada dikkate alınmadılar: {ids}';
$ec_lang['lpn_settings_text_size']='Metin boyutu (piksel)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Sembol boyutu (piksel)';
$ec_lang['lpn_settings_link_width']='Hat çizgisi genişliği (piksel)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Debi yönü okları';
$ec_lang['lpn_settings_show_arrows_tip']='Her boruda suyun hangi yöne aktığını gösteren bir ok çizer. Oklar bir çalışmadan sonra görünür, kapatmak sonuçları değiştirmez. Bu ayar projeyle birlikte kaydedilir.';
$ec_lang['lpn_settings_align_labels']='Boru etiketlerini borularla hizala';
$ec_lang['lpn_settings_readability_bias']='Etiketin ters çevrilmeden önce dikeyden sola kayabileceği derece';
$ec_lang['lpn_settings_readability_bias_tip']='Bir etiket, dikeyden sola bu kadar dereceden fazla yatarsa, doğru yönde durması için ters çevrilir.';
$ec_lang['lpn_settings_mask_labels']='Etiketlerin arkasında dolgu arka plan';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Bağlantı çizgilerini belirli açılara yasla';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='Bir etiketi adlandırdığı şeyden uzağa sürüklediğinizde, belirli açılardan birine yakın sürüklerseniz ona geri dönen çizgi en yakın açıya çekilir. Sürüklemeye devam ederseniz yaslama bırakır, böylece her açı hâlâ kullanılabilir. Kapalıyken serbestçe sürüklenir, bu sayfanın her zaman yaptığı budur.';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Etiketleri bu harita genişliğinde veya daha azında yakınlaştırıldığında göster';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Etiketler yalnızca harita görünümü bu genişlikte veya daha dar olduğunda çizilir. Her yakınlaştırmada çizmek için kutuyu boş bırakın. Hiçbir yakınlaştırmada bir etiket çizmemek için 0 yazın.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Her zaman göster';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='Düğümlerin şundan daha büyük ölçeklenmesini önle';
$ec_lang['lpn_settings_symbol_cap_mid']='kat, şu yüzdelik borunun';
$ec_lang['lpn_settings_symbol_cap_post']='uzunluğu';
$ec_lang['lpn_settings_symbol_cap_tip']='Bir düğümün çapı, şebekedeki tüm boru uzunluklarının bu yüzdelik dilimindeki borunun uzunluğunun bu kadar katı olduğunda, zeminde büyümeyi durdurur. Haritada bu noktadan sonra, uzaklaştıkça düğümler, borular ve diğer simgeler zeminde büyümek yerine ekranda küçülür. Rezervuarlar ve depolar bunun dışındadır ve her yakınlaştırmada ekran boyutlarını korur.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Sembol opaklığı (0 ile 1 arası)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Arka plan görüntüsü opaklığı (0 ile 1 arası)';
$ec_lang['lpn_settings_map_display']='Görünüm';
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
$ec_lang['lpn_settings_legend_position']='Etiket lejantı konumu';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Yok';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Kapalı';
$ec_lang['lpn_settings_legend_top_left']='Sol üst';
$ec_lang['lpn_settings_legend_top_right']='Sağ üst';
$ec_lang['lpn_settings_legend_middle_left']='Sol orta';
$ec_lang['lpn_settings_legend_middle_right']='Sağ orta';
$ec_lang['lpn_settings_legend_bottom_left']='Sol alt';
$ec_lang['lpn_settings_legend_bottom_right']='Sağ alt';
$ec_lang['lpn_settings_color_node_field']='Düğüm rengi';
$ec_lang['lpn_settings_color_link_field']='Boru rengi';
$ec_lang['lpn_settings_color_ramp']='Renk düzeni';
$ec_lang['lpn_settings_color_credits']='Kaynaklar';
$ec_lang['lpn_color_ramp_epanet']='Maviden kırmızıya (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Mordan sarıya (renkleri birbirinden ayırt etmek daha kolay)';
$ec_lang['lpn_color_ramp_gray']='Açıktan koyu griye';
$ec_lang['lpn_settings_color_reverse']='Renk sırasını ters çevir';
$ec_lang['lpn_color_none']='Renk yok';
$ec_lang['lpn_settings_color_key_position']='Renk lejantı konumu';
$ec_lang['lpn_settings_color_breaks']='Renk bandı sınırları';
$ec_lang['lpn_settings_color_equal_intervals']='Eşit aralıklar';
$ec_lang['lpn_settings_color_equal_counts']='Eşit sayılar';
$ec_lang['lpn_settings_color_no_values']='Henüz üzerinde çalışılacak değer yok. Önce şebekeyi çözün.';
$ec_lang['lpn_confirm_restore_defaults']='Tüm ayarlar (kimlik önekleri, başlangıç değerleri, çözücü ayarları, harita görünümü, lejant konumu ve görünür etiketler) orijinal değerlerine sıfırlansın mı? Şebekeniz değişmez. Ayarlar açık projeye aittir, bu yüzden diğer projeleriniz kendi ayarlarını korur.';
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
$ec_lang['lpn_settings_wipe_btn']='Yeniden başlayın';
$ec_lang['lpn_confirm_wipe']='Yeniden başlayın ve bu sayfa için kaydedilmiş HER ŞEY silinsin mi: her proje, her arka plan görüntüsü, tüm ayarlar ve birim seçimleriniz? Sayfa, tam olarak yepyeni bir ziyaretçinin göreceği gibi yeniden yüklenir. Bu işlem geri alınamaz.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Bu bağlantıyı kopyalayın:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Zaman';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Toplam çalışma süresi';
$ec_lang['lpn_time_hyd_step']='Hidrolik zaman adımı';
$ec_lang['lpn_time_pattern_step']='Desen zaman adımı';
$ec_lang['lpn_time_pattern_start']='Desen başlangıç zamanı';
$ec_lang['lpn_time_report_step']='Rapor zaman adımı';
$ec_lang['lpn_time_report_start']='Rapor başlangıç zamanı';
$ec_lang['lpn_time_clock_start']='Başlangıçtaki saat';
$ec_lang['lpn_time_clock_day']='Gün {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Bir zamanı saat ve dakika olarak yazın, örneğin 2:30. Düz bir sayı saat anlamına gelir; yani 8, sekiz saattir. Yarım saat 0:30 olarak yazılır.';
$ec_lang['lpn_time_running']='Zaman dilimi hesaplaması EPANET çözücüsüyle hesaplanıyor.';
$ec_lang['lpn_time_no_engine']='Yerleşik çözücü bir seferde yalnızca bir anı hesaplar, bu yüzden bu yalnızca {time} anındaki şebekedir: her desen o anda okunur ve her depo dolup boşalmak yerine hâlâ başlangıç seviyesindedir. Bir zaman dilimi hesaplaması çalıştıran EPANET çözücüsünü almak için bir kez internete bağlanın.';
$ec_lang['lpn_time_slider']='Geçen benzetim süresi';
$ec_lang['lpn_time_no_period']='Bu projede bir zaman dilimi hesaplaması ayarlanmamış, bu yüzden gösterilecek tek bir an var. Bir zaman dilimi hesaplaması çalıştırmak için Ayarlar, Hesaplama, Zaman altında bir Toplam çalışma süresi belirleyin.';
$ec_lang['lpn_time_first']='Başa git';
$ec_lang['lpn_time_prev']='Geri adım';
$ec_lang['lpn_time_play']='Oynat';
$ec_lang['lpn_time_play_tip']='Canlandırmayı oynat';
$ec_lang['lpn_time_pause_tip']='Canlandırmayı duraklat';
$ec_lang['lpn_time_pause']='Duraklat';
$ec_lang['lpn_time_next']='İleri adım';
$ec_lang['lpn_time_last']='Sona git';
$ec_lang['lpn_time_tank']='Depo';
$ec_lang['lpn_time_level']='Su seviyesi';
$ec_lang['lpn_time_run']='Hesapla';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Bu şebekeyi her hidrolik zaman adımında çözer.';
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
$ec_lang['lpn_time_run_done']='Çalışma bitti. Raporlama zamanları: {frames}. Geçen süre: {secs} sn.';
$ec_lang['lpn_time_runbox_hide']='Bu kutuyu bir daha gösterme';
$ec_lang['lpn_settings_runbox']='Çalıştırma ilerleme kutusunu göster';
$ec_lang['lpn_settings_runbox_tip']='Bir çalıştırmanın ne kadar ilerlediğini ve ne bulduğunu bildiren bir kutu. Kapalıyken, biten bir çalıştırma aynı bilgiyi birkaç saniyeliğine durum satırında verir. Bu, proje için değil bu tarayıcı için bir ayardır.';
$ec_lang['lpn_time_run_failed']='Çalışma bitmedi, bu yüzden sonraki zamanlar için sonuç yok.';
$ec_lang['lpn_time_run_report']='EPANET çalışma raporu';
$ec_lang['lpn_time_run_report_copy']='Kopyala';
$ec_lang['lpn_time_run_report_copied']='Kopyalandı';
$ec_lang['lpn_time_run_report_tip']='EPANET çözücüsünün son çalışma hakkında kendisinin yazdırdığı metin: yakınsayıp yakınsamadığı ve uyardığı her şey. Bu, çözücünün kendi metnidir, bizim değil.';

$ec_lang['lpn_time_speed']='Hız';
$ec_lang['lpn_time_speed_tip']='Oynatma hızı';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Ayarlarda ara';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Yalnızca bunların tümünden bahseden ayarları görmek için bir veya birden çok sözcük yazın.';
$ec_lang['lpn_settings_no_match']='Hiçbir ayar bu sözcükten bahsetmiyor.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Ayarlar bölüm listesinin genişliği';
$ec_lang['lpn_rpane_empty']='Burada henüz bir şey yerleştirilmedi. Tüm projeye ait olan her şey Ayarlar\'da.';
$ec_lang['lpn_time_settings_open']='Zaman ayarları';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Görselleştirme';
$ec_lang['lpn_settings_sec_map']='Harita ve sayfa';
$ec_lang['lpn_settings_sec_assets']='Öğeler';
$ec_lang['lpn_settings_sec_calculation']='Hesaplama';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Müşteri';
$ec_lang['lpn_labels_customer_note']='Bir müşteri etiketi, burada işaretlenen değerleri gösterir. Haritadaki diğer her etiketle aynı metin boyutunda çizilir.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Müşteri etiketleri yalnızca harita görünümü bu genişlikte veya daha dar olduğunda çizilir. Her yakınlaştırmada çizmek için kutuyu boş bırakın. Hiçbir yakınlaştırmada bir müşteri etiketi çizmemek için 0 yazın. Bu, tüm etiketler için benzer ayardan daha büyükse hiçbir etkisi olmaz.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Şimdiki görünümü kullan';
$ec_lang['lpn_settings_page']='Sayfa';
$ec_lang['lpn_settings_page_note']='Projede değil, bu hesaplayıcıda kaydedilir.';
$ec_lang['lpn_settings_hydraulics']='Hidrolik';
$ec_lang['lpn_settings_quality']='Su kalitesi';
$ec_lang['lpn_settings_quality_track']='Kalite parametresi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Çalışmanın borular boyunca neyi izleyeceğini seçin: suyun sistemde ne kadar süredir bulunduğu, nereden geldiği ya da yol boyunca tepkimeye giren bir kimyasal. Yalnızca kimyasal katsayı gerektirir.';
$ec_lang['lpn_settings_quality_source']='İzlenen düğüm';
$ec_lang['lpn_settings_quality_source_tip']='Suyu izlenen düğüm. Diğer her düğüm, o düğümden gelen suyunun payını gösterir.';
$ec_lang['lpn_quality_none']='Hiçbiri';
$ec_lang['lpn_quality_trace']='Kaynak izleme';
$ec_lang['lpn_quality_chemical']='Tepkimeye giren bir kimyasal';
$ec_lang['lpn_quality_needs_run']='Su kalitesi, su borular boyunca ilerledikçe taşınır, bu yüzden bir zaman dilimi hesaplaması gerektirir: EPANET motoru ve bir toplam çalışma süresi. Zaman altında bir Toplam çalışma süresi belirleyin, sonra Hesapla düğmesine basın.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Kimyasal ve birimler';
$ec_lang['lpn_quality_chemical_name_tip']='İzlediğiniz kimyasal, örneğin Klor. EPANET\'in kendi varsayılan etiketi olan Chemical için boş bırakın. Raporlarınızda görünür, ancak hesaplamalarda kullanılmaz.';
$ec_lang['lpn_quality_mass_units']='Kütle birimleri';
$ec_lang['lpn_quality_mass_units_tip']='Kalite girişinin birim yarısı, EPANET\'in kendi iki seçeneği.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Kalite toleransı';
$ec_lang['lpn_quality_tolerance_tip']='EPANET\'in iki bitişik su parselini bir kabul etmeden önce derişimlerinin ne kadar farklı olabileceği. Boş bırakılırsa EPANET\'in kendi varsayılanı olan 0,01 kullanılır.';
$ec_lang['lpn_quality_diffusivity']='Göreli yayınım';
$ec_lang['lpn_quality_diffusivity_tip']='Kimyasalın, klora göre suda ne kadar kolay yayıldığı. Boş bırakılırsa EPANET\'in kendi varsayılanı olan 1,0 kullanılır.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='{chemical} derişimi';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Ortalama {chemical} derişimi';
$ec_lang['lpn_quality_initial']='Başlangıç kalitesi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Bu düğümün, çalışma başladığında kimyasaldan ne kadar tuttuğu. Bir rezervuar, tüm çalışma boyunca kendi değerini tutar; bir arıtma tesisinden çıkan kalıntı genellikle böyle belirtilir. Boş bırakırsanız düğüm, hiç kimyasal olmadan başlar.';
$ec_lang['lpn_result_concentration']='Derişim';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Kimyasaldan bu noktada, yol aldıktan ve tepkimeye girdikten sonra ne kadar kaldığı. Birimler, Ayarlar, Su kalitesi altında kimyasalın yanında adlandırılanlardır.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Kaynak türü';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Bu düğümün, içinden geçen suya ne tür bir doz uyguladığı. Derişim, buradan şebekeye giren suyu Kaynak kalitesi değerine ulaşmış kabul eder. Kütle güçlendirici, debi ne olursa olsun her dakika bir kütle kimyasal ekler. Ayar noktası güçlendirici, bu düğümden çıkan derişimi Kaynak kalitesi değerine kadar yükseltir ve daha ileri gitmez. Debiyle orantılı güçlendirici, suda zaten bulunana Kaynak kalitesi değerini ekler.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Hiçbiri';
$ec_lang['lpn_source_type_concen']='Derişim';
$ec_lang['lpn_source_type_mass']='Kütle güçlendirici';
$ec_lang['lpn_source_type_setpoint']='Ayar noktası güçlendirici';
$ec_lang['lpn_source_type_flowpaced']='Debiyle orantılı güçlendirici';
$ec_lang['lpn_source_quality']='Kaynak kalitesi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Dozun ne kadar güçlü olduğu. Kütle güçlendirici dışındaki her tür için bu, Ayarlar, Su kalitesi altında kimyasalın yanında adlandırılan birimlerde bir derişimdir; bir kütle güçlendirici için dakika başına bir kütle kimyasaldır. Boş bırakırsanız burada hiçbir şey eklenmez; bu bir sıfırla aynı değildir: sıfır, çalışan ama hiçbir şey eklemeyen bir besleme demektir.';
$ec_lang['lpn_source_pattern']='Kaynak deseni';
$ec_lang['lpn_source_pattern_tip']='Sabit olmayan bir besleme için, dozu çalışma boyunca ölçekleyen bir zaman deseni. Desen yok, dozun her adımda aynı olduğu anlamına gelir.';
$ec_lang['lpn_mixing_model']='Karışım modeli';
$ec_lang['lpn_mixing_model_tip']='Bu depoda zaten bulunan suyun, gelen suyla nasıl karıştığı. Tam karışım, tüm depoyu bir kerede karıştırır. İki bölmeli karışım önce bir giriş bölgesini doldurur ve gerisini ileri geçirir. FIFO tıkaç akışı, suyu geldiği sırayla ilerletir. LIFO tıkaç akışı onu istifler, bu yüzden son giren su ilk çıkan sudur. Bu seçim su yaşını ve kalıntıyı değiştirir, herhangi bir basıncı veya debiyi değiştirmez.';
$ec_lang['lpn_mixing_mixed']='Tam karışım';
$ec_lang['lpn_mixing_2comp']='İki bölmeli karışım';
$ec_lang['lpn_mixing_fifo']='FIFO tıkaç akışı';
$ec_lang['lpn_mixing_lifo']='LIFO tıkaç akışı';
$ec_lang['lpn_mixing_fraction']='Karışım oranı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Giriş bölgesinin depo hacminden aldığı pay, 0 ile 1 arasında. Yalnızca iki bölmeli karışım bunu kullanır. Boş bırakırsanız tüm depo giriş bölgesi olur; EPANET\'in varsaydığı da budur.';
$ec_lang['lpn_reaction_bulk']='Kütle tepkime katsayısı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Suyun gövdesindeki tepkime; kendi katsayısını taşımayan her boru için kullanılır. Negatif bir sayı kimyasalı azaltır, pozitif bir sayı ise artırır. İçe aktarılan bir EPANET dosyası başka bir mertebe belirtmedikçe tepkime birinci mertebedendir, bu yüzden katsayı 1/gün cinsinden bir hızdır. Boş bir kutu, kütle tepkimesi olmadığı anlamına gelir.';
$ec_lang['lpn_reaction_wall']='Cidar tepkime katsayısı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Boru cidarındaki tepkime; kendi katsayısını taşımayan her boru için kullanılır. Negatif bir sayı kimyasalı azaltır. İçe aktarılan bir EPANET dosyası başka bir mertebe belirtmedikçe tepkime birinci mertebedendir, bu yüzden katsayı, projenin uzunluk biriminde yazılmış, gün başına bir uzunluktur. Boş bir kutu, cidar tepkimesi olmadığı anlamına gelir.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Yalnızca bu boru için. Boş bırakırsanız boru, Ayarlar, Su kalitesi altında tüm şebeke için belirlenen katsayıyı kullanır.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Tepkime katsayısı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Bu depoda tutulan sudaki tepkime, 1/gün cinsinden bir hız olarak. Negatif bir sayı kimyasalı azaltır, pozitif bir sayı ise artırır. Su, herhangi bir boruda kaldığından çok daha uzun süre bir depoda kalır, bu yüzden kalıntının kaybolduğu yer genellikle burasıdır. Boş bırakırsanız depo, Ayarlar, Su kalitesi altında tüm şebeke için belirlenen kütle tepkime katsayısını kullanır.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Kütle tepkimesi';
$ec_lang['lpn_reaction_wall_short']='Cidar tepkimesi';
$ec_lang['lpn_reaction_tank_short']='Tepkime';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/gün';
$ec_lang['lpn_reaction_day']='gün';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Kütle tepkime derecesi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='Suyun gövdesindeki tepkime için derişimin yükseltildiği üs. Herhangi bir gerçek sayıya izin verilir. Varsayılan değer 1\'dir ve çoğu klor bozunumu modellemesinde kullanılır. 0, hızı orada ne kadar kimyasal olduğundan bağımsız hale getirir.';
$ec_lang['lpn_reaction_order_tank']='Depo tepkime derecesi';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='Bir depoda tutulan suda tepkime için derişimin yükseltildiği üs; borulardan farklı bir derecede tepkime verebilmesi için kütle tepkime derecesinden ayrıdır. Herhangi bir gerçek sayıya izin verilir ve varsayılan 1\'dir. EPANET bunu bir dosyada ORDER TANK olarak belirtir ve kendi arayüzünde bunun için bir kutu sunmaz.';
$ec_lang['lpn_reaction_order_wall']='Cidar tepkime derecesi';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1, cidar tepkimesinin verilen katsayı(lar)a göre gerçekleştiği anlamına gelir. 0 ise gerçekleşmediği anlamına gelir. Bu bir açma-kapama anahtarıdır. Varsayılan değer 1\'dir.';
$ec_lang['lpn_reaction_order_unstated']='Belirtilmemiş';
$ec_lang['lpn_reaction_order_zero']='0, sıfırıncı derece';
$ec_lang['lpn_reaction_order_first']='1, birinci derece';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Sınırlayıcı potansiyel';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Kimyasalın sıfıra bozunmak veya sınırsızca artmak yerine yöneldiği bir derişim. Su bu değere yaklaştıkça tepkime yavaşlar ve orada durur. Tutarlı birimler kullanın. Boş bırakılırsa sınır yoktur.';
$ec_lang['lpn_reaction_rough_corr']='Pürüzlülük korelasyonu';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Cidar tepkimesini her borunun kendi pürüzlülüğüyle ilişkilendirir, böylece daha pürüzlü bir boru daha hızlı tepkime verir. Ayarlandığında, her boru için o borunun pürüzlülüğünden bir cidar katsayısı hesaplanır ve yukarıdaki tek cidar katsayısı artık kullanılmaz. Boş bırakılırsa kullanılmaz.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Bu sayfa kendi tepkime katsayısını sunmaz. Bunun için standart bir test yoktur ve aynı tür su için yayımlanmış saha değerleri on kata kadar farklılık gösterir, bu yüzden burada verilecek bir sayı bir öneri olarak okunur. Ölçtüğünüz veya kaynak gösterebileceğiniz bir değer girin, ya da tepkimeye girmeyen bir kimyasal için kutuları boş bırakın.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Enerji';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Raporlar';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='Bir şebeke hesaplandıktan sonra bu sayfanın ürettiği bitmiş yanıtlar: pompaların maliyeti, senaryoların birbiriyle karşılaştırılması ve EPANET çözücüsünün kendisinin yazdırdıkları.';
$ec_lang['lpn_reports_epanet']='EPANET çalıştırması';
$ec_lang['lpn_energy_title']='Pompa enerjisi raporu';
$ec_lang['lpn_energy_menu']='Pompa enerjisi';
$ec_lang['lpn_energy_menu_tip']='Son zaman dilimi hesaplaması boyunca her pompanın çalışma payının ne kadar olduğu, çektiği güç ve maliyeti.';
$ec_lang['lpn_energy_efficiency']='Pompa verimi (yüzde)';
$ec_lang['lpn_energy_efficiency_tip']='Kendi verim eğrisini taşımayan her pompa için kullanılan, elektrikten suya verim. Hiçbir şey belirtilmediğinde EPANET yüzde 75 kullanır.';
$ec_lang['lpn_energy_price']='Enerji fiyatı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Bir kilovatsaatin maliyeti. Kendi fiyatını taşımayan her pompaya uygulanır. Boş bırakırsanız rapordaki her maliyet sıfır olur.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Bu pompada bir kilovatsaatin maliyeti. Boş bırakırsanız pompa, Ayarlar, Enerji altında tüm şebeke için belirlenen fiyatı öder.';
$ec_lang['lpn_energy_price_pattern']='Fiyat deseni';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Fiyatı her desen adımında çarpan bir desen; bir düşük tarife dönemi böyle belirtilir. Çalışma boyunca tek bir fiyat için boş bırakın.';
$ec_lang['lpn_energy_demand_charge']='Tepe talep ücreti';
$ec_lang['lpn_energy_demand_charge_tip']='İşletmenin, sistemdeki pompaların talep ettiği tepe yük için kW başına aldığı ücret.';
$ec_lang['lpn_energy_currency']='Para birimi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Buraya yazdığınız her ne ise, her para rakamının yanında yazdırılır. Bu bir etikettir. Fiyatlar ve maliyetler hiçbir zaman dönüştürülmez, bu yüzden fiyatları buraya yazdığınız para biriminde yazın.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Bu sayfa kendi fiyatını sunmaz. Gücün maliyeti işletmeye, ülkeye, saate ve yıla bağlıdır, bu yüzden burada verilecek bir sayı bir öneri olarak okunur. Kendi tarifenizden fiyatı girin.';
$ec_lang['lpn_energy_needs_run']='Pompa enerjisi, çalışma boyunca gücün integralidir, bu yüzden bir zaman dilimi hesaplaması gerektirir: EPANET motoru ve bir toplam çalışma süresi. Ayarlar, Hesaplama, Zaman altında bir Toplam çalışma süresi belirleyin, Hesapla düğmesine basın, sonra Su, Raporlar, Pompa enerjisi\'ni açın.';
$ec_lang['lpn_energy_no_pumps']='Bu şebekede pompa yok, bu yüzden güç çeken bir şey yok.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Senaryo karşılaştırması';
$ec_lang['lpn_scncmp_menu_tip']='Bu projedeki her senaryoyu çözün ve yan yana okuyun: her birindeki en düşük basınç ve en yüksek hız.';
$ec_lang['lpn_scncmp_running']='Her senaryo çözülüyor…';
$ec_lang['lpn_scncmp_empty']='Henüz hiçbir şey çizilmedi, bu yüzden çözülecek bir şey yok.';
$ec_lang['lpn_scncmp_col_maxvelocity']='En yüksek hız';
$ec_lang['lpn_scncmp_at']='{id}\'de {value}';
$ec_lang['lpn_scncmp_current']='(şu anda açık)';
$ec_lang['lpn_scncmp_note']='Her senaryo, çizimin bir kopyasından çözülür. Burada hiçbir şey projeyi değiştirmez ve üzerinde çalıştığınız senaryo olduğu gibi bırakılır.';
$ec_lang['lpn_energy_over']='{time} süren zaman dilimi hesaplaması için';
$ec_lang['lpn_energy_col_pump']='Pompa';
$ec_lang['lpn_energy_col_running']='Çalışma %';
$ec_lang['lpn_energy_col_effic']='Verim';
$ec_lang['lpn_energy_col_avg_kw']='Ort. kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='Bu pompa çalışırken kullanılan ortalama güç. Boşta geçen süreler üzerinden ortalanmaz, bu yüzden zaman dilimi hesaplamasının çoğunda boşta kalan bir pompa yine de çalıştığı sürede kullandığı gücü bildirir.';
$ec_lang['lpn_energy_col_peak_kw']='Tepe kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Maliyet';
$ec_lang['lpn_energy_total_kwh']='Kullanılan enerji';
$ec_lang['lpn_energy_total_energy_cost']='Enerji maliyeti';
$ec_lang['lpn_energy_peak_kw']='Tepe güç kullanımı';
$ec_lang['lpn_energy_total_demand_charge']='Tepe talep maliyeti';
$ec_lang['lpn_energy_total_cost']='Toplam maliyet';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Durum';
$ec_lang['lpn_reports_status_tip']='Son uzatılmış dönem simülasyonu boyunca zaman sırasıyla neyin değiştiği: açılan veya kapanan pompalar ve vanalar, dolan, boşalan, dolup taşan veya kuruyan depolar, ve tam olarak yakınsamayan adımlar.';
$ec_lang['lpn_status_title']='Durum raporu';
$ec_lang['lpn_status_needs_run']='Durum raporu, bir uzatılmış dönem simülasyonu boyunca neyin değiştiğini listeler. Ayarlar, Hesaplama, Zaman altında bir Toplam çalışma süresi belirleyin, Hesapla\'ya basın, sonra Su, Raporlar, Durum raporu\'nu açın.';
$ec_lang['lpn_status_empty']='Bu çalışma boyunca hiçbir şeyin durumu değişmedi.';
$ec_lang['lpn_status_col_event']='Olay';
$ec_lang['lpn_status_opened']='{type} {id} açıldı';
$ec_lang['lpn_status_closed']='{type} {id} kapandı';
$ec_lang['lpn_status_filling']='{type} {id} doluyor';
$ec_lang['lpn_status_emptying']='{type} {id} boşalıyor';
$ec_lang['lpn_status_full']='{type} {id} dolu';
$ec_lang['lpn_status_dry']='{type} {id} boş';
$ec_lang['lpn_status_no_converge']='Bu adımdaki hidrolik çözüm tam olarak yakınsamadı; gösterilen sayılar son iterasyonuna ait.';
$ec_lang['lpn_status_note']='Tablolar panosu ve Tam rapor ile aynı uzatılmış dönem çalışmasından okunur. Yalnızca bir değişiklik listelenir, her adım değil.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Tam';
$ec_lang['lpn_reports_full_tip']='Son çalışmanın her raporlama zaman adımındaki her düğümü ve her hattı, indirebileceğiniz veya yazdırabileceğiniz tek bir tablo olarak.';
$ec_lang['lpn_full_title']='Tam rapor';
$ec_lang['lpn_full_needs_run']='Tam rapor, her raporlama zaman adımındaki her düğümü ve her hattı listeler. Hesapla\'ya basın, sonra Su, Raporlar, Tam rapor\'u açın.';
$ec_lang['lpn_full_note']='Tablolar panosunda gösterilen birimlerde, düğüm veya hat başına raporlama zaman adımı başına bir satır. Boş bir hücre, o niceliğin sahip olmadığı bir sütundur. İndirme veya yazdırma her zaman adımını taşır; aşağıdaki tablo bir kerede bir tanesini gösterir.';
$ec_lang['lpn_full_step_label']='Zaman adımı';
$ec_lang['lpn_full_download_csv']='CSV indir';
$ec_lang['lpn_full_print']='Raporu yazdır';
$ec_lang['lpn_full_col_time']='Zaman';
$ec_lang['lpn_full_col_type']='Tür';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} satır.';
$ec_lang['lpn_energy_no_price']='Bir güç fiyatı belirtilmemiş, bu yüzden buradaki her maliyet sıfırdır. Ayarlar, Enerji altında bir tane belirleyin.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Bu şebeke sıfır bir fiyat belirtiyor, bu yüzden buradaki her maliyet sıfırdır. Ayarlar, Enerji altında değiştirin.';
$ec_lang['lpn_energy_curve_note']='Bu pompalar, hiç noktası olmayan bir verim eğrisine başvuruyor: {ids}. Tüm şebeke için belirlenen verimle çalıştılar.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_rank']='Sıra';
$ec_lang['lpn_labels_col_drop']='Bırakma';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Düğüm ve hat';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Eşit aralık';
$ec_lang['lpn_color_mode_quantile']='Kantil (eşit sayı)';
$ec_lang['lpn_color_mode_jenks']='Doğal kırılımlar (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Standart sapma';
$ec_lang['lpn_color_mode_pretty']='Düzgün (yuvarlak)';
$ec_lang['lpn_color_mode_log']='Logaritmik';
$ec_lang['lpn_color_mode_manual']='Elle';

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
$ec_lang['lpn_library_menu']='Kitaplıklar';
$ec_lang['lpn_library_menu_tip']='Bu proje için talep desenlerini, pompa eğrilerini ve kontrol kurallarını yönetin.';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Desenler';
$ec_lang['lpn_library_patterns_tip']='Bir desen, tekrarlanan bir çarpanlar listesidir. Her biri bir desen zaman adımı için geçerlidir, bu yüzden bir saatlik adımda 24 sayı, tekrarlanan bir günü oluşturur. Çarpanı 1,5 olan 10\'luk bir talep, o anda 15\'tir.';
$ec_lang['lpn_library_curves']='Eğriler';
$ec_lang['lpn_library_curves_tip']='Bir eğri, bir şeyin nasıl performans gösterdiğini anlatan noktaların listesidir: bir pompanın her debide ne kadar yük eklediği, o debide ne kadar verimli olduğu veya bir vananın her debide ne kadar yük kaybettirdiği.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Eğriler pompalara ve vanalara bağlanır. Bir pompa yük eğrisi için çalışma, gösterildiği gibi noktalardan geçirilerek uydurulmuş bir eğriyi kullanır; diğer her tür için noktalar, gösterildiği gibi düz çizgilerle birleştirilir.';
$ec_lang['lpn_library_curve_add']='Bir eğri ekle';
$ec_lang['lpn_library_curve_type_tip']='Bu eğrinin neyi tanımladığı';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Eğri türü';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Denklem';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='Noktalardan geçirilerek uydurulan ve aşağıdaki grafikte çizilen eğri. Her gösterildiğinde noktalardan yeniden hesaplanır ve hiçbir zaman saklanmaz; sayıları yukarıdaki tablonun gösterdiği birimlerdedir. Yerleşik çözücü bu denklem üzerinden çalışır; EPANET motoru ise noktaların kendisini okur.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Bir çizelgede bir veya iki sütun seçin, kopyalayın ve inmelerini istediğiniz ilk hücreye yapıştırın. Satırlar gerektikçe eklenir. Bir EPANET dosyasından doğrudan kopyalanmış satırları, eğri adı dahil, da yapıştırabilirsiniz.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Açıklama';
$ec_lang['lpn_library_curve_note_tip']='Bu eğrinin ne olduğu, kendi sözlerinizle. Bir EPANET dosyasında eğrinin üzerine yazılır ve oradan geri okunur.';
$ec_lang['lpn_library_curve_remove_point']='Bu noktayı kaldır';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Noktaları kopyala';
$ec_lang['lpn_library_curve_copy_tip']='Her noktayı, bir çizelgeye yapıştırmaya hazır iki sütun olarak kopyalar.';
$ec_lang['lpn_library_curve_copy_manual']='Bu noktaları kopyala';
$ec_lang['lpn_library_curve_used_by']='Bu eğriyi kullanan öğeler';
$ec_lang['lpn_library_curve_unused']='Hiçbir şey bu eğriyi kullanmıyor.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Bu eğri {count} öğe tarafından kullanılıyor: {ids}. Önce onları başka bir eğriye yönlendirin, sonra bunu silin.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Boru türleri';
$ec_lang['lpn_library_pipetypes_tip']='Boru türü, birkaç borunun çapı, pürüzlülüğü ve tepkime katsayıları için başvurabileceği bir tanımdır. Tanımı düzenlemek, onu kullanan her boruyu düzenler.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Her projenin kendi boru türü kitaplığı vardır. Bir boru türü tanımında özellikleri boş bırakabilirsiniz. Örneğin, pürüzlülük belirten ama çap belirtmeyen bir boru türü sorun değildir. Boru türlerini, borulara kendi özellik düzenleyicilerinde eklersiniz. Buradaki bir tanımı düzenlemek, ona başvuran her boruyu değiştirir.';
$ec_lang['lpn_library_pipetype_add']='Boru türü ekle';
$ec_lang['lpn_library_pipetype_blank_tip']='Bir boru türü tanımındaki boş özellikler, her boru için ayrı ayrı girilmek üzere bırakılır.';
$ec_lang['lpn_library_pipetype_used_by']='Bu türü kullanan borular';
$ec_lang['lpn_library_pipetype_unused']='Bu boru türünü hiçbir şey kullanmıyor.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Bu boru türü {count} boru tarafından kullanılıyor: {ids}. Silmeden önce onlardan ayırın.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Boru türü';
$ec_lang['lpn_field_pipetype_tip']='Bu borunun kullandığı, proje kitaplığındaki boru türü. Boru türünde yer alan özellikler burada düzenlemeye kapalıdır. Burada düzenlemeyi etkinleştirmek için boru türünden ayırın.';
$ec_lang['lpn_pipetype_none']='Boru türü seçilmedi';
$ec_lang['lpn_pipetype_detach']='Boru türünden ayır';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Bu borunun türünden okuduğu değerleri borunun kendisine kopyalar ve türü kullanmayı bırakır. Borunun değerleri şimdi değişmez ve şu andan itibaren bu değerleri burada düzenleyebilirsiniz.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Bağlantı parçaları';
$ec_lang['lpn_library_fittings_tip']='Bir bağlantı parçası listesi, birkaç borunun başvurabileceği bir dizi bağlantı parçası ve bunların miktarlarıdır. Tek bir küçük (yerel) kayıp katsayısına toplanır.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Her projenin kendi bağlantı parçası kitaplığı vardır. Bir bağlantı parçası listesinde her biri için bir miktar bulunan bağlantı parçaları vardır ve bunlar tek bir küçük (yerel) kayıp katsayısına toplanır. Hem borular hem de boru türleri bir listeye başvurabilir.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Burada sunulan bağlantı parçaları, EPANET 2.2 kullanıcı kılavuzunun Tablo 3.3\'ündeki on üç parçadır. Birini seçmek, katsayısını değiştirebileceğiniz satıra kopyalar. Bir katsayı, bağlantı parçasının boyutuna ve markasına bağlıdır, bu yüzden tabloyu bir cevap değil bir başlangıç noktası olarak kabul edin.';
$ec_lang['lpn_library_fittings_add']='Bağlantı parçası listesi ekle';
$ec_lang['lpn_library_fittings_used_by']='Bu bağlantı parçası listesini kullanan borular';
$ec_lang['lpn_library_fittings_unused']='Bu bağlantı parçası listesini hiçbir şey kullanmıyor.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Bu bağlantı parçası listesi {count} boru tarafından kullanılıyor: {ids}. Silmeden önce onlardan ayırın.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Kitaplıkları içe aktar…';
$ec_lang['lpn_library_import_tip']='Başka bir proje dosyası seçin ve ondan bütün kitaplıkları bu projeye kopyalayın. Burada adı zaten kullanılan her şey atlanır ve listelenir, böylece sahip olduğunuz hiçbir şey değişmez.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='{file} dosyasından ne kopyalanacağını seçin';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='İşaretlediğiniz her kitaplık bütün olarak kopyalanır. İstemediklerinizi sonradan, başka bir girdiyi sildiğiniz gibi silin.';
$ec_lang['lpn_library_import_go']='İçe aktar';
$ec_lang['lpn_library_import_no_libraries']='O proje dosyasında kopyalanacak kitaplık yok.';
$ec_lang['lpn_library_import_heading']='{file} dosyasından içe aktarıldı';
$ec_lang['lpn_library_import_added']='Kopyalananlar: {names}';
$ec_lang['lpn_library_import_conflict']='Atlandı, çünkü bu projede zaten aynı adda bir tane var: {names}. Burada hiçbir şey değişmedi. İkisini de istiyorsanız birini yeniden adlandırıp yeniden içe aktarın.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='O proje dosyasında kopyalanacak bunlardan hiçbiri yok.';
$ec_lang['lpn_library_import_curve_shape']='Bu eğriler, dosyanın yazdığı haliyle aynen geldi, ve ilk sütunu her noktadan bir sonrakine yükselmedikçe bir çalışma onu kullanamaz: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Bu boru türleri, bu projenin sahip olmadığı bir bağlantı parçaları listesine başvuruyor: {names}. Aynı dosyadan bağlantı parçaları kitaplığını içe aktarın, böylece onu bulurlar.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Uyarı: Birim uyuşmazlığı. Olduğu gibi içe aktarılacak. Önerilmez.';
$ec_lang['lpn_library_import_units_line']='{name}: bu proje {mine} gösteriyor, dosya {theirs} gösteriyor.';
$ec_lang['lpn_fitting_qty']='Miktar';
$ec_lang['lpn_fitting_name']='Bağlantı parçası';
$ec_lang['lpn_fitting_k']='Katsayı';
$ec_lang['lpn_fitting_add']='Bağlantı parçası ekle';
$ec_lang['lpn_fitting_remove']='Kaldır';
$ec_lang['lpn_fitting_total']='Toplam küçük (yerel) kayıp katsayısı, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Bağlantı parçası listesi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Proje kitaplığından bir bağlantı parçası listesi. Miktarları ve katsayıları bu borunun küçük (yerel) kayıp katsayısında toplanır ve katsayı kutusu bu durumda salt okunur olur. Katsayıyı kendiniz yazmak için bunu seçili bırakmayın.';
$ec_lang['lpn_fittings_none']='Bağlantı parçası listesi seçilmedi';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Glob vana, tam açık';
$ec_lang['lpn_fitting_angle']='Açılı vana, tam açık';
$ec_lang['lpn_fitting_swingcheck']='Swing çek vana, tam açık';
$ec_lang['lpn_fitting_gate']='Sürgülü vana, tam açık';
$ec_lang['lpn_fitting_elbow_short']='Kısa yarıçaplı dirsek';
$ec_lang['lpn_fitting_elbow_medium']='Orta yarıçaplı dirsek';
$ec_lang['lpn_fitting_elbow_long']='Uzun yarıçaplı dirsek';
$ec_lang['lpn_fitting_elbow_45']='45 derece dirsek';
$ec_lang['lpn_fitting_return_bend']='Kapalı dönüş dirseği';
$ec_lang['lpn_fitting_tee_run']='Standart T, akış düz hat üzerinden';
$ec_lang['lpn_fitting_tee_branch']='Standart T, akış kol üzerinden';
$ec_lang['lpn_fitting_entrance']='Keskin kenarlı giriş';
$ec_lang['lpn_fitting_exit']='Çıkış';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Diğer bağlantı parçası';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='{file} kaydedildi';
$ec_lang['lpn_inp_export_flat_lead']='Dışa aktarılan EPANET dosyası sayısal olarak bu projeyle eşdeğerdir. Ancak aşağıdaki şeyler için bir yeri yoktur:';
$ec_lang['lpn_inp_export_flat_types']='Buradaki {n} boru, {t} boru türüne başvuruyor. Dosyada bu boruların her biri sayıların kendi kopyasını taşır, bu yüzden cevaplar aynıdır. Dosyanın tutamadığı şey boru türünün kendisidir, bu yüzden bir tanımı düzenlemek ve her borunun bunu izlemesi yalnızca kendi proje dosyanızın kaydettiği bir şeydir.';
$ec_lang['lpn_inp_export_flat_coords']='Bir EPANET dosyası her düğüm için tek bir konum tutar. Bu senaryo bunlardan {n} tanesini başka bir yere yerleştiriyor, ve dosyadaki konumlar bunlardır. Diğer her senaryo kendi konumlarını yalnızca proje dosyanızda tutar.';
$ec_lang['lpn_inp_export_flat_fittings']='Bir EPANET dosyası, proje dosyanızdaki dirsek, vana ve T bağlantı listesini tutamaz. Buradaki {n} borunun küçük (yerel) kayıp katsayısı bir bağlantı parçası listesinden toplanır. Toplam, olduğu gibi dosyaya girer, bu yüzden cevaplarla ilgili hiçbir şey değişmez.';
$ec_lang['lpn_library_controls']='Kontroller';
$ec_lang['lpn_library_controls_tip']='Bir kontrol, bir su seviyesi, bir basınç veya bir zaman böyle söylediğinde bir hattı açan veya kapatan, ya da ona bir ayar veren tek bir cümledir.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Bir desen ekle';
$ec_lang['lpn_library_pattern_values']='Çarpanlar';
$ec_lang['lpn_library_pattern_values_tip']='Boşluk veya virgülle ayrılmış çarpanlar. Varsa bir elektronik tablodan bir sütun yapıştırın. Liste, çalışma sürdüğü sürece tekrarlanır, bu yüzden çalışmanın tamamını kapsaması gerekmez.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} çarpan, {step} aralıklı, {span} kapsıyor';
$ec_lang['lpn_library_pattern_none']='Desen yok';
$ec_lang['lpn_settings_default_pattern']='Varsayılan talep deseni';
$ec_lang['lpn_settings_default_pattern_tip']='Deseni olmayan her düğüm bunu kullanır.';
$ec_lang['lpn_library_control_add']='Bir kontrol ekle';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='EPANET\'in kullandığı sözcüklerle tek bir cümle. Dört biçim: LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1 ve LINK 12 CLOSED AT CLOCKTIME 3 AM. OPEN veya CLOSED yerine bir vana ayarı veya pompa hızı olan bir sayı yazabilirsiniz. Anahtar sözcükleri İngilizce bırakın; sayfanın okuduğu şey onlardır.';
$ec_lang['lpn_library_control_ok']='✓ Anlaşıldı';
$ec_lang['lpn_library_control_bad']='⚠ Anlaşılamadı';
$ec_lang['lpn_library_control_missing']='⚠ Bu şebekede {id} adında bir şey yok';
$ec_lang['lpn_library_rules']='Kurallar';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Bir kural, bir su seviyesi, bir basınç, bir debi veya bir zaman sizin belirlediğiniz bir değere ulaştığında bir hattı açan, kapatan veya ona bir ayar veren kısa bir paragraftır. Kurallar aynı anda birden fazla şeyi sınayabilir ve sınama başarısız olduğunda ne yapılacağını söyleyebilir.';
$ec_lang['lpn_library_rule_add']='Bir kural ekle';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Tek bir kural, EPANET\'in kullandığı sözcüklerle, satır başına bir tümce. İlk satır onu adlandırır: RULE 1. Sonra bir koşul: IF TANK 2 LEVEL BELOW 17.1. Sonra bunun için ne yapılacağı: THEN PUMP 9 STATUS IS OPEN. Son bir satır ona bir sıra verebilir: PRIORITY 1. Birden fazla şeyi sınamak için AND veya OR satırları, sınama başarısız olduğunda ne yapılacağını söylemek için ELSE satırları ekleyin. Bir koşul, bir düğümde LEVEL, HEAD, GRADE, PRESSURE veya DEMAND\'i, bir hatta FLOW, STATUS veya SETTING\'i, ya da SYSTEM\'de TIME ve CLOCKTIME\'ı okuyabilir. Sayıları bu projenin gösterdiği birimlerde yazın; sizin için dönüştürülürler. Anahtar sözcükleri İngilizce bırakın; sayfanın ve EPANET\'in okuduğu şey budur.';
$ec_lang['lpn_library_rule_ok']='✓ Bu kural okundu';
$ec_lang['lpn_library_rule_bad']='⚠ Bu kural okunamadı';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Baz talep';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Bu düğümün gösterilen zaman adımında çektiği debi: her baz talebin kendi deseniyle çarpılıp toplanmasıyla bulunur. Hesaplanır, yazılmaz, bu yüzden saatle birlikte değişir ve düzenlenemez.';
$ec_lang['lpn_field_demand_pattern']='Talep deseni';
$ec_lang['lpn_field_demand_pattern_tip']='Bu düğümün talebinin çalışma boyunca nasıl yükselip alçaldığı. Desen yok olarak bırakırsanız düğüm, bunun yerine projenin Varsayılan talep deseni\'ni izler.';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Açıklama';
$ec_lang['lpn_field_demand_category_tip']='Bu talep kategorisinin adı veya açıklaması.';
$ec_lang['lpn_demand_add']='Talep kategorisi ekle';
$ec_lang['lpn_demand_add_tip']='Bu düğüme, kendi baz talebi, deseni ve açıklaması olan başka bir talep kategorisi ekleyin. Kategoriler toplanır.';
$ec_lang['lpn_demand_remove']='Bu talebi kaldır';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Yük deseni';
$ec_lang['lpn_field_head_pattern_tip']='Bu rezervuarın su seviyesinin çalışma boyunca nasıl yükselip alçaldığı. Yukarıdaki yük, desenle çarpılır.';
$ec_lang['lpn_field_pump_speed']='Bağıl hız';
$ec_lang['lpn_field_pump_speed_tip']='1, bu pompanın eğrisinin ölçüldüğü hızda dönmesidir. 0,9 ise aynı pompanın daha yavaş dönmesidir; bu, eklediği yükü ve geçirdiği debiyi düşürür. Çalışma sürerken bir hız deseni bu sayının yerini alır.';
$ec_lang['lpn_field_speed_pattern']='Hız deseni';
$ec_lang['lpn_field_speed_pattern_tip']='Bu pompanın hızının çalışma boyunca nasıl yükselip alçaldığı. Her çarpan, çalışmanın o bölümü için bağıl hızın kendisidir ve Hız ayarının yerini alır, onu ölçeklemez; bu yüzden 0 çarpanı pompayı durdurur.';

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
$ec_lang['lpn_search_menu']='Bir yeri adına göre ara…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Bir kasabayı, bir sokağı veya bir simge yapıyı adına göre bulun ve haritayı oraya taşıyın. İlk kullanımda izninizi sorar, çünkü yazdığınız sözcükler OpenStreetMap\'in yer adı hizmetine gönderilir.';
$ec_lang['lpn_search_bar']='Ada göre ara…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Yer adına göre arama, yazdığınız sözcükleri OpenStreetMap Vakfı\'nın ücretsiz yer adı hizmeti olan nominatim.openstreetmap.org\'a gönderir.';
$ec_lang['lpn_search_consent_2']='Bu, projenizin arkasındaki sokak haritası görüntülerinden farklı bir hizmettir. Görüntüler yalnızca nereye baktığınızı söyler. Bir arama ise ne yazdığınızı söyler. Yer adı hizmeti, arama sözcüklerinizi ve IP adresinizi alacaktır. Başka hiçbir şey göndermeyiz ve aramalarınızın hiçbir kaydını tutmayız.';
$ec_lang['lpn_search_consent_3']='Aramalarınızı yer adı hizmetine gönderebilir miyiz?';
$ec_lang['lpn_search_consent_4']='Hayır derseniz, Bir enlem ve boylama git dahil, bu sayfadaki her şey şimdi çalıştığı gibi çalışmaya devam eder. Tekrar sormamak için bir evet\'i hatırlarız. Bir hayır hiç saklanmaz.';
$ec_lang['lpn_search_refused']='Yer adı araması kapalı ve hiçbir şey gönderilmedi. Yine de Bir enlem ve boylama git\'i kullanabilirsiniz.';
$ec_lang['lpn_search_prompt']='Bir yeri adına göre arayın. Bir kasaba, bir sokak, bir simge yapı — örneğin: Petaluma, California';
$ec_lang['lpn_search_empty']='Aramak için bir yer adı yazın.';
$ec_lang['lpn_search_working']='Aranıyor…';
$ec_lang['lpn_search_busy']='Zaten bir arama sürüyor. Yanıt vermesini bekleyin.';
$ec_lang['lpn_search_choose']='Birden fazla yer eşleşiyor. Hangisi?';
$ec_lang['lpn_search_nochoice']='Hiçbir şey seçilmedi, bu yüzden harita hareket etmedi.';
$ec_lang['lpn_search_badchoice']='Bu, listedeki sayılardan biri değil.';
$ec_lang['lpn_search_none']='Bu ad için hiçbir şey bulunamadı.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Yer adı hizmeti bizden yavaşlamamızı istiyor. Bir dakika bekleyip yeniden deneyin.';
$ec_lang['lpn_search_http']='Yer adı hizmeti bir hatayla yanıt verdi.';
$ec_lang['lpn_search_timeout']='Yer adı hizmeti zamanında yanıt vermedi. Bu sayfadaki her şeyin geri kalanı onsuz da çalışır.';
$ec_lang['lpn_search_unreadable']='Yer adı hizmeti, bu sayfanın okuyamadığı bir şeyle yanıt verdi.';
$ec_lang['lpn_search_offline']='Yer adı hizmetine ulaşamadık. Çevrimdışı olabilirsiniz. Bir enlem ve boylama git dahil, bu sayfadaki her şeyin geri kalanı onsuz da çalışır.';
$ec_lang['lpn_search_toofast']='Saniyede bir arama — yer adı hizmetinin izin verdiği bu. Birazdan yeniden deneyin.';
$ec_lang['lpn_search_nofetch']='Bu tarayıcı yer adı hizmetine ulaşamıyor.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox bunu birçok kamuya açık kot veri setinden oluşturur, bu yüzden ne kadar iyi olduğu tamamen nerede olduğunuza bağlıdır. Amerika Birleşik Devletleri\'nin çoğunda USGS 3DEP gibi ve başka yerlerdeki eşdeğerleri gibi ulusal bir lidar çalışması olan yerlerde, yatayda bir metreden, dikeyde birkaç ondalık metreden daha iyi olabilir. Yalnızca küresel veri olan yerlerde yatayda yaklaşık 30 m, dikeyde birkaç metredir. Mapbox hangisini aldığınızı bize söylemez. Bunu bir ölçüm değil, bir kontur haritası olarak kabul edin: güvendiğiniz her şeyi kontrol edin.';
$ec_lang['lpn_terrain_consent_1']='Kotları doldurmak, ihtiyacı olan her düğümün konumunu — enlemini ve boylamını — oradaki zemin yüksekliğini bulmak için api.mapbox.com\'a gönderir.';
$ec_lang['lpn_terrain_consent_2']='Bu, projenizin arkasındaki harita görüntülerinden farklı bir sorudur. Görüntüler yalnızca nereye baktığınızı söyler. Bu konumlar ise şebekenizin ta kendisidir. Mapbox, bu koordinatları ve IP adresinizi alacaktır. Başka hiçbir şey göndermeyiz: ne ad, ne boru, ne de proje. Bunun hiçbir kaydını tutmayız ve bu soruya verdiğiniz yanıt dışında bu cihazda hiçbir şey saklanmaz.';
$ec_lang['lpn_terrain_consent_3']='Düğüm konumlarınızı Mapbox\'a gönderebilir miyiz?';
$ec_lang['lpn_terrain_consent_4']='Hayır derseniz, bu sayfadaki her şey şimdi çalıştığı gibi çalışmaya devam eder ve kotları eskisi gibi kendiniz yazabilirsiniz. Tekrar sormamak için bir evet\'i hatırlarız. Bir hayır hiç saklanmaz.';
$ec_lang['lpn_terrain_refused']='Kotlar doldurulmadı ve hiçbir şey gönderilmedi. Eskisi gibi kendiniz yazabilirsiniz.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='{n} düğümün kotu Mapbox DEM\'den doldurulsun mu?';
$ec_lang['lpn_terrain_confirm_default_1']='Her düğümün zaten bir kotu var ve bunlardan {n} tanesi hâlâ, sizin yazdığınız değil, yeni bir düğümün başladığı kot olan {v}\'de.';
$ec_lang['lpn_terrain_confirm_default_2']='Bu {n} düğümün kotu Mapbox DEM\'den gelen değerlerle değiştirilsin mi?';
$ec_lang['lpn_terrain_keep']='{k} düğümün zaten bir kotu var ve dokunulmayacak.';
$ec_lang['lpn_terrain_undo']='Tek bir Geri al (Ctrl-Z) hepsini geri getirir.';
$ec_lang['lpn_terrain_requests']='{n} api.mapbox.com\'a istek.';
$ec_lang['lpn_terrain_busy']='Kotlar zaten dolduruluyor. Bitmesini bekleyin.';
$ec_lang['lpn_terrain_offmap']='Bu düğüm konumları arazi haritasında değil, bu yüzden hiçbir şey gönderilmedi.';
$ec_lang['lpn_terrain_too_wide']='Bu düğümler, tek seferde okunamayacak kadar geniş bir alana yayılmış ({n} karo isteği). Hiçbir şey gönderilmedi.';
$ec_lang['lpn_terrain_cancelled']='Hiçbir şey değişmedi ve hiçbir şey gönderilmedi.';
$ec_lang['lpn_terrain_nofetch']='Bu tarayıcı arazi hizmetine ulaşamıyor.';
$ec_lang['lpn_terrain_working']='Zemin yüzeyi okunuyor…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Arazi hizmeti isteği reddetti ({status}), bu yüzden hiçbir kot değiştirilmedi. Bu sitenin kullandığı Mapbox belirteci, üzerinde bulunduğunuz web adresine izin vermiyor olabilir.';
$ec_lang['lpn_terrain_failed']='Arazi hizmetine ulaşamadık, bu yüzden hiçbir kot değişmedi. Çevrimdışı olabilirsiniz. Bu sayfadaki her şeyin geri kalanı onsuz da çalışır.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Arazi hizmeti bizden yavaşlamamızı istiyor (429), bu yüzden hiçbir kot değişmedi. Bir dakika sonra tekrar deneyin.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Arazi hizmeti bir hatayla yanıt verdi ({status}), bu yüzden hiçbir kot değişmedi. Şebekenizde hiçbir sorun yok.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Bu düğümlerin hiçbirinin Dünya üzerinde bir konumu yok, bu yüzden hiçbir şey gönderilmedi ve hiçbir kot değişmedi. Yer yüzeyini okumak, enlem ve boylamlı bir proje ya da bu sayfanın yerleştirebileceği bir projeksiyon üzerinde bir proje gerektirir.';
$ec_lang['lpn_terrain_done']='{n} kot dolduruldu.';
$ec_lang['lpn_terrain_missed']='{m} tanesi okunamadı ve hâlâ boş.';
$ec_lang['lpn_terrain_partial']='{f} arazi karosu yanıt vermedi.';
$ec_lang['lpn_terrain_will_ids']='Bu düğümler bir kot alacak: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Bu düğümler şunlar: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Bu düğümler bir kot aldı: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Bu düğümlerin hâlâ kotu yok: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids} ve {n} tane daha';

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
$ec_lang['lpn_ff_menu']='Yangın debisi analizi…';
$ec_lang['lpn_ff_menu_tip']='Düğümleri tek tek sınayın: her biri, belirlediğiniz kalıntı basıncı korurken ne kadar debi sağlayabilir, ve orada gereken debiyi çekmek başka bir şeyi sınırların dışına iter mi?';
$ec_lang['lpn_ff_title']='Yangın debisi analizi';
$ec_lang['lpn_ff_intro']='Her düğümden sırayla, zaten sahip olduğu talebin üzerine bir yangın debisi çekmesi istenir. Projenizde hiçbir şey değişmez; tüm çalışma bir kopya üzerinde yapılır.';
$ec_lang['lpn_ff_scope']='Sınanacak düğümler';
$ec_lang['lpn_ff_scope_tip']='Çalıştırmadan önce kümeyi seçin. Büyük bir sistemde her düğümü sınamak dakikalar sürebilir.';
$ec_lang['lpn_ff_no_junctions']='Bu projede henüz düğüm yok, bu yüzden sınanacak bir şey yok.';
$ec_lang['lpn_ff_no_selection']='Hiçbir düğüm seçili değil. Haritada bir tane seçin veya her düğümü sınayın.';
$ec_lang['lpn_ff_skipped']='{n} seçili öğe düğüm değil, bu yüzden test edilmedi.';
$ec_lang['lpn_ff_required']='Gereken yangın debisi';
$ec_lang['lpn_ff_required_tip']='Yangın yönetmeliğinizin veya itfaiye teşkilatınızın bir yangın musluğunda istediği debi. Her düğüm, kendi gereken yangın debisini taşımadığı sürece bu sayıya karşı sınanır.';
$ec_lang['lpn_ff_required_own']='Kendi gereken yangın debisini taşıyan düğümler, onun yerine ona karşı sınanır. Sayıları: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Bu düğümün hizmet ettiği arazi kullanımı için yangın yönetmeliğinizin veya itfaiye teşkilatınızın istediği yangın debisi. Boş bırakırsanız düğüm, Yangın debisi analizi kutusundaki sayıya karşı sınanır.';
$ec_lang['lpn_ff_residual']='Korunacak kalıntı basınç';
$ec_lang['lpn_ff_residual_tip']='Düğümün, yangın debisini sağlarken hâlâ koruması gereken basınç. AWWA M31 ve NFPA 291, 20 psi (140 kPa) kullanır.';
$ec_lang['lpn_ff_design']='Tasarım kontrolü (sistem üzerindeki etki)';
$ec_lang['lpn_ff_design_tip']='Düğümün debiyi sağlayıp sağlayamayacağından ayrı bir soru: orada o debi çekilirken başka bir şey asgari basıncının altına düşer mi veya hız sınırını aşar mı? Bunu kontrol etmeyi seçmek ek bir hesaplamaya mal olmaz.';
$ec_lang['lpn_ff_design_no_selection']='Tasarım kontrolü seçili düğümlere ayarlı, ama hiçbiri seçili değil. Haritada birkaçını seçin veya Diğer tüm düğümler ve tüm borular seçeneğini kullanın.';
$ec_lang['lpn_ff_minpressure']='Başka yerde izin verilen en düşük basınç';
$ec_lang['lpn_ff_minpressure_tip']='Başka bir düğüm yangın debisini çekerken bunun altına düşen bir düğüm, tasarım sorunu olarak bildirilir.';
$ec_lang['lpn_ff_maxvelocity']='İzin verilen en yüksek hız';
$ec_lang['lpn_ff_maxvelocity_tip']='Bir yangın debisi çekilirken bunun üzerinde çalışan bir boru, tasarım sorunu olarak bildirilir.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Yangın debisi düğümün kendisinden çekilir. Burada kullanılan yöntem budur ve olağan yöntemdir. Yangın musluğu, ona bağlı boru ve lülesi modellenmez, bu yüzden gerçek bir yangın musluğu burada gösterilenden daha az debi sağlar.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Bu, yerleşik çözücüyle hesaplanır.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Bu, EPANET motoruyla hesaplanır.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='Mevcut yangın debisi bir arama olduğundan, sınanan her düğüm için tüm şebeke yaklaşık on altı kez çözülür. Büyük bir sistem dakikalar sürer. İstediğiniz zaman durdurabilir ve şimdiye kadar hesaplananları saklayabilirsiniz.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Yalnızca şu anda ekranda olan zaman adımı sınanır. Yangın debisi normalde azami gün talebinin üzerinde sınanır, bu yüzden çalıştırmadan önce şebekeyi o duruma ayarlayın.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Yangın debisi çalışması';
$ec_lang['lpn_ff_calculate']='Çalıştır';
$ec_lang['lpn_ff_stop']='Durdur';
$ec_lang['lpn_ff_working']='Çalışıyor: {total} düğümden {done} tanesi.';
$ec_lang['lpn_ff_stopped']='{total} düğümden {done} tanesinden sonra durduruldu. Aşağıdaki sonuçlar şimdiye kadar bitenlerdir.';
$ec_lang['lpn_ff_cost']='Bu çalışma tüm şebekeyi {solves} kez çözdü.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Çizim değişti, bu yüzden yangın debisi sonuçları temizlendi. Tekrar çalıştırın.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Halkaları temizle';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} düğümde sorun yoktu. {fire} düğüm yangın debisinde başarısız oldu. {design} düğüm sistemin geri kalanını etkiledi.';
$ec_lang['lpn_ff_summary_error']='{n} düğüm için yanıt alınamadı.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Sınanan her düğüm';
$ec_lang['lpn_ff_col_junction']='Düğüm';
$ec_lang['lpn_ff_col_static']='Statik basınç';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='Herhangi bir yangın debisi çekilmeden önce, sistemin olağan talepleri hâlâ çalışırken bu düğümdeki basınç. Ölçmek için hiçbir şey kapatılmaz, bu yüzden bu sistem için sıfır debili bir basınç değildir; haritanın bu düğümde gösterdiği basınçla aynıdır. AWWA M31 ve NFPA 291\'in ikisi de bu okumaya statik basınç der ve bir yangın debisi testi buradan başlar.';
$ec_lang['lpn_ff_col_available']='Mevcut debi';
$ec_lang['lpn_ff_col_required']='Gereken debi';
$ec_lang['lpn_ff_col_residual']='Korunan kalıntı';
$ec_lang['lpn_ff_col_atrequired']='Gereken debideki basınç';
$ec_lang['lpn_ff_col_affected']='En kötü etki';
$ec_lang['lpn_ff_col_limit']='Tasarım sınırı';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Kontrol edilmedi';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Statik başarısız oldu, bu yüzden kontrol edilmedi';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Başarısızlık türleri';
$ec_lang['lpn_ff_mode_fire']='Yangın';
$ec_lang['lpn_ff_mode_design']='Tasarım';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Yok';
$ec_lang['lpn_ff_col_solves']='Çözümler';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Basınç ve hız';
$ec_lang['lpn_ff_atleast']='{flow}\'den fazla';
$ec_lang['lpn_ff_affect_node']='{id} {pressure}\'e düşüyor';
$ec_lang['lpn_ff_affect_link']='{id} {velocity}\'e ulaşıyor';
$ec_lang['lpn_ff_more']='ve {n} tane daha etkilendi';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='{n} düğüm daha gösterilmiyor.';
$ec_lang['lpn_ff_design_none']='Herhangi bir düğüm yangın debisini çekerken, seçilen kümedeki hiçbir şey sınırlarının dışına çıkmadı.';
$ec_lang['lpn_ff_design_off_note']='Bu çalışmada sistemin geri kalanı üzerindeki etki kontrol edilmedi.';
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
$ec_lang['lpn_ff_iso']='Sigorta Hizmetleri Ofisi (ISO), tek bir yangın musluğuna en fazla {flow} tanır. Bu tanıma sınırı burada uygulanmadı, çünkü bir düğümün kaç yangın musluğunu temsil edebileceğini bilmiyoruz.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Herhangi bir yangın debisi çekilmeden önce zaten kalıntının altında';
$ec_lang['lpn_ff_err_converge']='Şebeke yakınsamadı.';
$ec_lang['lpn_ff_err_solve']='Çözücü bir hata bildirdi ve yanıt vermedi.';
$ec_lang['lpn_ff_err_not_junction']='Düğüm değil';
$ec_lang['lpn_ff_err_unknown']='Yanıt yok. Bildirilen kod {code}.';

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
$ec_lang['lpn_file_import_survey']='Ölçülmüş noktaları içe aktar…';
$ec_lang['lpn_file_import_survey_tip']='Bir metin dosyasından ölçülmüş noktaların bir listesini okur ve her noktada bir düğüm oluşturur, dosyanın belirtmediği her şey için yeni-varlık ayarlarını kullanır. Hiçbir boru çizilmez ve hiçbir satır adlandırılmadan atlanmaz. Bu projenin zaten kullandığı koordinat sistemini okur, coğrafi referanslı olsun ya da olmasın.';
$ec_lang['lpn_survey_read_error']='O dosya diskinizden okunamadı.';
$ec_lang['lpn_survey_cancelled']='Hiçbir şey oluşturulmadı ve hiçbir şey değişmedi.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Kuzeyleme';
$ec_lang['lpn_survey_axis_east']='Doğuya kayma';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='O dosyada hiçbir şey yok.';
$ec_lang['lpn_survey_err_unreadable']='O dosya bir ölçülmüş nokta listesi olarak okunamadı.';
$ec_lang['lpn_survey_err_ambiguous_coord']='O dosyada birden fazla sütun {axis} ({detail}) olabilir, ve bu sayfa aralarında seçim yapmayacak. Onlardan birini {axis} olarak adlandırılmış bırakın ve tekrar deneyin.';
$ec_lang['lpn_survey_err_no_points']='O dosyanın tek bir satırı bile ölçülmüş bir nokta olarak okunamadı. Okunan satırlar: {detail}';
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
$ec_lang['lpn_survey_format_label']='Dosya biçimi:';
$ec_lang['lpn_survey_format_internal']='içeride belirtilmiş';
$ec_lang['lpn_survey_create']='Düğüm oluştur';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='İlk satır atlandı: bu sayfanın bildiği hiçbir sütunu adlandırmıyor.';
$ec_lang['lpn_survey_type_label']='Varlık türü:';
$ec_lang['lpn_survey_confirm_junction']='{n} düğüm bulundu. Devam edilsin mi?';
$ec_lang['lpn_survey_confirm_reservoir']='{n} rezervuar bulundu. Devam edilsin mi?';
$ec_lang['lpn_survey_confirm_tank']='{n} depo bulundu. Devam edilsin mi?';
$ec_lang['lpn_survey_report_junction']='{n} düğüm içe aktarıldı, {m} tanesi kotla.';
$ec_lang['lpn_survey_report_reservoir']='{n} rezervuar içe aktarıldı, {m} tanesi kotla.';
$ec_lang['lpn_survey_report_tank']='{n} depo içe aktarıldı, {m} tanesi kotla.';
$ec_lang['lpn_survey_report_clean']='Dosyadaki her nokta geldi, ve girişte hiçbir şey değişmedi.';
$ec_lang['lpn_survey_report_notes']='İçe aktarma hataları ve notları:';
$ec_lang['lpn_survey_sev_error']='hata';
$ec_lang['lpn_survey_sev_warning']='uyarı';
$ec_lang['lpn_survey_note_line']='Satır {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Yukarıdaki dosya biçimi için çok az sütun.';
$ec_lang['lpn_survey_note_coord_missing']='{axis} hücresi boş.';
$ec_lang['lpn_survey_note_bad_coord']='{axis}, bir sayı olarak okunmuyor.';
$ec_lang['lpn_survey_note_coord_range']='{axis}, bu projenin izin verdiği aralığın dışında.';
$ec_lang['lpn_survey_note_bad_elev']='Sayısal olmayan kot. Kotsuz içe aktarıldı.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Birden fazla sütun kot olabilir, bu yüzden hiçbiri okunmadı.';
$ec_lang['lpn_survey_note_blank_rows']='Boş satırlar atlandı: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Ad bu dosyada daha önce kullanılmış, yeni ad atandı.';
$ec_lang['lpn_survey_note_id_taken']='Ad projede zaten kullanılıyor, yeni ad atandı.';
$ec_lang['lpn_survey_note_id_invalid']='Ad burada kullanılamaz, yeni ad atandı.';
