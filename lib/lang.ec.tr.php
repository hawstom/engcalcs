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
// **REWRITTEN 2026-10-08 (Tom, call F01: "Go (random code, new consent text)")**, his draft used
// exactly. The yes now also covers a random browser code (EC_CODE_COOKIE in lib/config.inc.php), so
// "a one-digit cookie" was no longer the whole of what is asked for. The code is what the sentence
// names because it is what the yes newly buys: counting browsers, not only page loads.
//
// EC_CONSENT_VERSION WENT FROM 1 TO 2 WITH IT, because what is stored changed. Everybody who chose
// "Allow this" is asked again; "Allow all" and "Refuse all" are not. The other 26 languages keep
// their old sentence until the next translation sprint, under the same version.
$ec_lang['consent_body']='Sitenin her bölümünü kaç tarayıcının kullandığını sayabilmemiz için bu tarayıcıya rastgele bir kod kaydedebilir miyiz? Kod o anda üretilir, sizin veya cihazınız hakkında hiçbir şey söylemez ve girdiğiniz hiçbir şeyi kaydetmez. Bu kod olmadan ikinci ziyaretinizi başka birinin ilk ziyaretinden ayırt edemeyiz.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Bu şebekeyi her hidrolik zaman adımında çözer.';
$ec_lang['consent_accept']='Kabul et';
$ec_lang['consent_accept_all']='Her zaman kabul et';
$ec_lang['consent_decline']='Her zaman reddet';
$ec_lang['consent_current_granted']='Buna izin verdiniz. Bu tarayıcı, sayılabilmesi için rastgele bir kod saklıyor.';
$ec_lang['consent_current_denied']='Bunu reddettiniz. Bu tarayıcı profili için kaydı sınırlamak amacıyla hiçbir şey saklamıyoruz.';
$ec_lang['consent_region_label']='Sayım kodu hakkındaki tercihiniz.';
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
$ec_lang['points_data_heading']='Hesaplayıcı verileri<br />(biçimi görmek için Kopyala\'yı kullanın)';
$ec_lang['points_data_points_heading']='Nokta verileri<br />(biçimi görmek için Kopyala\'yı kullanın)';
$ec_lang['points_data_copy']='Kopyala';
$ec_lang['points_data_paste']='Yapıştır';
$ec_lang['points_data_msg_line']='Hiçbir şey yapıştırılmadı. {n}. satır bir istasyon ve kot çifti olarak okunamadı.';
$ec_lang['points_data_msg_none']='Hiçbir şey yapıştırılmadı. İstasyon ve kot çifti bulunamadı.';
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
// Edited by TGH 2026-09-07
$ec_lang['mtc_n_blodgett']='Tasarım taş boyutundan n (Blodgett yöntemi)';
$ec_lang['mtc_n_bathurst']='Tasarım taş boyutundan n (Bathurst yöntemi)';
$ec_lang['mtc_n_pi']='Tasarım taş boyutundan n (P&I, Phillips ve Ingersoll yöntemi)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett ve Bathurst karşılaştırması';
$ec_lang['mtc_pi_range_check']='P&I aralık kontrolü';
$ec_lang['mtc_pi_ok']='d50, P&I aralığında';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_not_applicable']='Uygulanmaz';
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
$ec_lang['mtc_iteration_tip']='Hedef debiniz için düzgün bir taş boyutuna otomatik olarak yaklaşmak üzere bir pürüzlülük seçeneği (Blodgett–Bathurst için B/B önerilir) ve bir taş boyutu seçeneği (Isbash önerilir) seçin. Tam yöntem için aşağıdaki Notlar bölümüne bakın. Yinelemeyi atlamak için kendi pürüzlülük değerinizi girin (rehberlik için bağlantıyı izleyin) ve taş boyutunu yok sayın.';
$ec_lang['mtc_note_1']='<dl><dt>Otomatik taş boyutu ve pürüzlülük tasarım yinelemesi</dt><dd>Bir pürüzlülük seçeneği (Blodgett–Bathurst için B/B önerilir) ve bir tasarım taş boyutu seçeneği (Isbash önerilir) seçin. Hedef debinize düzgün bir taş boyutuyla ulaşmak için derinliği ve taş boyutu güvenlik faktörünü ayarlayın. Bir girdiyi her değiştirdiğinizde hesaplayıcı şu adımları tekrarlar: 1. Pürüzlülük, tasarım taş boyutundan hesaplanır. 2. Seçtiğiniz yöntemden gelen pürüzlülük değeri, pürüzlülük girdisine kopyalanır. 3. Kanal debisi ve gereken taş boyutu hesaplanır. 4. Tasarım taş boyutu ayarlanır. 5. Tasarım taş boyutundaki hata çok küçük olana kadar adımlar tekrarlanır.</dd><dt>Temel hesaplayıcı (yineleme yok)</dt><dd>İstediğiniz pürüzlülük değerini girin. Tasarım taş boyutu girdi alanını yok sayın.</dd></dl>';
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
$ec_lang['about_body_html']='<h3>Misyon</h3><p>HawsEDC Mühendislik Hesap Makineleri 2010\'dan beri çevrimiçi ücretsiz sunulmaktadır. Dünya genelindeki mühendislere ve saha çalışanlarına hizmet etmek için vardır, özellikle su kıtlığı olan, kaynak yetersizliği çeken veya ihmal edilmiş bölgelerde çalışanlara. Bu araçlar, daha geniş bir insani misyonun parçasıdır: her insana en pratik ve etkili şekilde, <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">sonsuza dek sevildiğini ve değer gördüğünü, hiçbir şeyden korkmasına gerek olmadığını ve her şeyi mahvetmeyeceğini</a> söylemek.</p><p>Hesap makineleri araçtır. Hedef, acısız bir dünyadır.</p><h3>Özgür (Libre) ve Açık Kaynak Lisansı</h3><p>Tüm kod, <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU Genel Kamu Lisansı v3.0 veya üzeri</a> kapsamında yayınlanmıştır — özgürlük anlamında özgür. Kodu aynı koşullar altında kullanabilir, inceleyebilir, değiştirebilir ve yeniden dağıtabilirsiniz.</p><p>Bu sitenin bugün ve 2010\'dan beri ücretsiz sunulduğu bir gerçektir; bir gün sunulamazsa bile yazılım sizin çalıştırmanız için hâlâ elinizdedir.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Kaynak Kodu</h3><p>Tam kaynak kodu GitHub\'ta herkese açık olarak mevcuttur:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Orada kodu inceleyebilir, sorun bildirebilir veya depoyu çatallandırabilirsiniz.</p><h3>Katkıda Bulunma</h3><p>Her türlü yardım memnuniyetle karşılanır. <a href="contact.php">Tom Haws ile iletişime geçin</a>.</p><ul><li><strong>Çeviriler:</strong> Daha iyi bir ifade önerin. Bir dili geliştirin veya yeni bir dil ekleyin.</li><li><strong>Hata raporları:</strong> Herhangi bir hesap makinesi sayfasındaki geri bildirim formunu kullanın veya GitHub\'ta bir sorun bildirin.</li><li><strong>Yeni hesap makineleri:</strong> Saha çalışanlarına ve sulama uzmanlarına hizmet eden hidrolik mühendislik araçları için fikirler özellikle memnuniyetle karşılanır.</li><li><strong>Barındırma:</strong> Bu hesap makinelerini sınırlı bağlantısı olan bir bölge için yansıtabilirseniz lütfen benimle iletişime geçin.</li></ul><h3>Çevrimdışı Kullanım</h3><p>Çevrimiçiyken herhangi bir hesap makinesini bir kez açın; çevrimdışıyken de hepsi çalışmaya devam eder: tarayıcınız ilerledikçe tüm paketi saklar. Mekanizma bir <strong>Aşamalı Web Uygulaması (PWA)</strong>\'dır. Bundan sonra tüm hesap makineleri çevrimdışı çalışır — internet gerekmez.</p><p>Android veya iOS\'ta, EngCalcs\'ı cihazınıza uygulama olarak yüklemek için tarayıcınızın "Ana Ekrana Ekle" seçeneğini kullanın. Masaüstünde, tarayıcınızın adres çubuğundaki yükleme simgesini arayın.</p><p>Ayrıca herhangi bir hesap makinesini tek seferlik çevrimdışı kullanım için tarayıcınızın "Farklı kaydet…" menüsünü kullanarak kaydedebilirsiniz.</p><h3>İletişim</h3><p>Tom Haws — hidrolik mühendisi ve bu hesap makinelerinin yazarı.<br />Herhangi bir hesap makinesi sayfasındaki geri bildirim formunu kullanın veya <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>\'taki kaynak koda erişin.</p>';
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
$ec_lang['rc_yn']='<span class="ec-help" title="Göllenme (Hp > yn) olumludur, çünkü memba erozyonunu azaltır. (USDA)">Giriş kanalında normal derinlik, y<sub>n</sub> <span class="ec-tip">?</span></span>';
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
$ec_lang['rc_Hp']='<span class="ec-help" title="Göllenme (Hp > yn) olumludur, çünkü memba erozyonunu azaltır. (USDA)">Giriş savak yükü, H<sub>p</sub> <span class="ec-tip">?</span></span>';
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
// Edited by TGH 2026-09-07
$ec_lang['bpn_q_line']='Hat debisi';
$ec_lang['bpn_q_line_tip']='Bu hattın taşıdığı toplam debi: kendi talebi artı beslediği tüm mansap taleplerinin toplamı.';
$ec_lang['bpn_p_down']='MS basınç';
// Edited by TGH 2026-09-07
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
$ec_lang['bpn_notes_2_def']='Her hattın tam olarak bir memba hattı vardır (bir ağaç). Bu araç, yinelemeli yöntemler (EPANET veya benzeri) gerektiren halkalı şebekeleri çözmez. Şebekede halka olmadığı için çözüm doğrudan ve kesindir.';
$ec_lang['bpn_notes_3_term']='Aktif basınç kontrolü yok';
$ec_lang['bpn_notes_3_def']='Sabit bir yerel kayıp vanası (bir k değeri) ekleyebilirsiniz, ancak basınç düşürücü veya basınç sürdürücü vanalar (PRV/PSV) ekleyemezsiniz. Bunların açık/kapalı durumu debiye ve basınca bağlıdır, bu da yinelemeyi zorunlu kılar.';
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
// Junction and Pipe (Task 719): Tom's WaterCAD command, a junction, a pipe, a junction, a pipe, until Escape.
$ec_lang['lpn_tool_add_chain']='Düğüm Boru Zinciri';
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
$ec_lang['lpn_tool_add_meter_tip']='Müşteri noktasını, ardından bağlantısını belirtin: bir hat veya düğüm. Müşteriye verdiğiniz talep, o hattın yakın ucundaki düğüme eklenir.';
$ec_lang['lpn_mode_add_meter']='Müşteri: müşterinin bulunduğu yeri belirtin, ardından onu besleyen boruyu veya düğümü seçin. İptal etmek için Esc kullanın.';
$ec_lang['lpn_pane_tab_customers']='Müşteriler';
// The Shape table (Task 779). Closed is a polygon's closure, not a pipe's or valve's status, so it
// is a key of its own and not lpn_field_closed: many languages use different words for the two.
// Points is the column of the Shape's points, "Shape S1, point 2" in lpn_snap_shape_point.
$ec_lang['lpn_pane_tab_shapes']='Figürler';
$ec_lang['lpn_pane_shape_closed']='Kapalı';
$ec_lang['lpn_pane_shape_points']='Noktalar';
$ec_lang['lpn_customer_heading']='Müşteri {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Servis başına talep';
$ec_lang['lpn_field_meter_count']='Servis sayısı';
$ec_lang['lpn_field_meter_total']='Toplam talep';
$ec_lang['lpn_field_meter_total_tip']='Aşağıda adı geçen düğüme eklenen toplam.';
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
$ec_lang['lpn_meter_pattern_unknown']='Bu projede {id} adında hiçbir desen yok, bu yüzden müşteri olduğu gibi bırakıldı.';
$ec_lang['lpn_meter_placed']='Müşteri {id} eklendi. Açıklamasını ve talebini Müşteriler tablosuna girin ya da özellikler kutusunu açmak için Seç modunda müşteriyi seçin.';
$ec_lang['lpn_field_meter_pipe_tip']='Bu servisin bağlandığı varlık. Değiştirmek için buraya veya Müşteriler tablosuna başka birini yazın, ya da bağlantı noktasını farklı bir varlığa sürükleyin.';
$ec_lang['lpn_field_meter_station']='Boru boyunca konum (%)';
$ec_lang['lpn_field_meter_station_tip']='Servisin borunun neresine bağlandığı, borunun birinci düğümünden ikincisine olan uzunluğunun yüzdesi olarak. 0 bir uçta, 100 diğer uçtadır. Boru üzerindeki daire, aynı işi işaretçiyle yapar.';
$ec_lang['lpn_field_meter_offset']='Borudan kaçıklık';
$ec_lang['lpn_field_meter_offset_tip']='Pozitif değer, birinci düğümünden ikincisine bakıldığında borunun sağındadır. Buraya bir değer yazmak müşteriyi ana borunun diğer tarafına taşıyabilir ve servis hattını her zaman ana boruya dik açıyla hizalar.';
$ec_lang['lpn_field_meter_lumped']='Eklendiği düğüm';
$ec_lang['lpn_field_meter_lumped_tip']='En yakın düğüm; bu müşterinin talepleri orada toplanır.';
$ec_lang['lpn_node_customers']='Müşteri talepleri';
$ec_lang['lpn_node_customers_tip']='Bu düğüme eklenmiş müşterilerin listesi (bu düğüm en yakını olduğu için). Müşteri talepleri, burada listelenen diğer taleplere ek olarak eklenir. Bir müşteri, haritadaki yerinde veya Müşteriler tablosunda düzenlenir.';
$ec_lang['lpn_node_customers_sum']='Müşterilerden ({n}) {total} {unit}';
$ec_lang['lpn_customer_detached']='⚠ Bu müşteri bir boruya bağlı değil, bu yüzden talebi sonuçlarda yok. Silin, ya da bir boru çizip müşteriyi onun üzerine taşıyın.';
$ec_lang['lpn_customer_fixed_head']='⚠ O borunun yakın ucu sabit bir su yüzeyi tutuyor, bu yüzden bu talep simülasyonu etkilemez.';
$ec_lang['lpn_customer_node_inactive']='Bu müşteri, bu senaryoda etkin olmayan bir düğüme atanmıştır; bu nedenle talebi çözüme dahil değildir.';
$ec_lang['lpn_customer_detached_count']='Bir boruya bağlı olmayan müşteriler ({n}). Talepleri hesaba katılmıyor.';
$ec_lang['lpn_meter_pick_pipe']='Şimdi bu müşteriyi besleyen boruyu veya düğümü seçin. Müşteri, koyduğunuz yerde kalır. İptal etmek için Esc tuşuna basın.';
$ec_lang['lpn_inp_export_flat_customers']='Bir EPANET dosyasında müşteri yoktur. Bu projedeki müşterilerin ({n}) talebi, her birinin atandığı düğüm üzerinde bir talep satırı olarak yazılır ve müşterinin etiketiyle adlandırılır. Dosya müşterinin kendisini kaydetmez: konumunu, onu besleyen boruyu, servisin bu boru boyunca nerede bağlandığını veya kaç servisi temsil ettiğini. Bu bilgi projede kalır; korumak için proje dosyasını kaydedin.';

$ec_lang['lpn_area_hint_window_start']='Pencerenin bir köşesini belirtin.';
$ec_lang['lpn_area_hint_window_go']='Bitirmek için karşı köşeyi belirtin.';
$ec_lang['lpn_area_hint_lasso_start']='Anahattı başlatmak için bir nokta belirtin.';
$ec_lang['lpn_area_hint_lasso_go']='Anahattı çizmek için imleci hareket ettirin. Bitirmek için son noktayı belirtin.';
$ec_lang['lpn_area_hint_polygon_start']='Çokgen alanın ilk köşesini belirtin. Bitirmek için çift tıklayın.';
$ec_lang['lpn_area_hint_polygon_go']='Her köşeyi belirtin. Bitirmek için sonuncusuna çift tıklayın.';
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
$ec_lang['lpn_pane_pasted']='Yapıştırılan hücreler ({n}). Değiştirilmeyen hücreler ({skipped}).';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Yapıştırılan satırlar ({n}). Şebekeye eklenen satırlar ({created}).';
$ec_lang['lpn_pane_pasted_rows_skipped']='Yapıştırılan satırlar ({n}). Şebekeye eklenen satırlar ({created}). Değiştirilmeyen hücreler ({skipped}).';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Bu alanı seçin ve eklemek için bir elektronik tablodan satırlar yapıştırın.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Tablonun sonuna yeni satır olarak yapıştır';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Kopyalanan satırları bu tablonun altına eklemek için Ctrl+V\'ye basın. İptal etmek için Esc\'e basın.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Bu yapıştırmadaki satırlar ({n}). Tabloya sığan satırlar ({fit}). Diğer satırlar ({extra}) tablonun altına yeni satır olarak eklensin mi?';
$ec_lang['lpn_pane_paste_overflow_add']='Satırları ekle ({extra})';
$ec_lang['lpn_pane_paste_overflow_fit']='Yalnızca sığan satırları yapıştır ({fit})';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Bu yapıştırmadaki satırlar ({n}). Tabloya sığan satırlar ({fit}). Diğer satırlar ({extra}) yeni satır olarak eklenemez: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='Uyuşmayan kimlikler ({n}). Yine de yapıştırılsın mı?';
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
$ec_lang['lpn_pane_paste_shape_no_points']='Satır {row}: yeni bir Figürün Noktalar değerine ihtiyacı var.';
// {pair} is the Points heading's own pair in this project's axis words: X/Y, N/E or Lat/Lon.
$ec_lang['lpn_pane_paste_shape_bad_points']='Satır {row}: {text} bir nokta listesi değil. Her noktayı {pair} biçiminde yazın, ondalık ayırıcı olarak nokta (.) kullanın ve noktaları | ile ayırın.';
$ec_lang['lpn_pane_paste_shape_closed_few']='Satır {row}: kapalı bir Figür en az üç nokta gerektirir.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Satır {row}: yeni bir Müşterinin bağlı bir boru veya düğüme ihtiyacı var.';
$ec_lang['lpn_pane_paste_no_pipe']='Satır {row}: {id} borusu henüz yok. Önce borularınızı, sonra müşterilerinizi yapıştırın.';
$ec_lang['lpn_pane_paste_no_customer_node']='Satır {row}: {id} düğümü henüz yok. Önce düğümlerinizi, sonra müşterilerinizi yapıştırın.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Satır {row}: {id} düğümünün bir Müşterinin bağlanabileceği borusu yok.';
$ec_lang['lpn_pane_filled']='Aşağı doldurulan hücreler ({n}). Değiştirilmeyen hücreler ({skipped}).';
$ec_lang['lpn_pane_filldown']='Aşağı doldur';
$ec_lang['lpn_pane_delete_element']='Öğeyi sil';
$ec_lang['lpn_pane_delete_elements']='Öğeleri sil';
$ec_lang['lpn_pane_fill_none']='Bu seçimde aşağı doldurulabilecek hiçbir şey yok.';
$ec_lang['lpn_pane_ctrlenter_filled']='Doldurulan hücreler ({n}). Değiştirilmeyen hücreler ({skipped}).';
$ec_lang['lpn_pane_hide_col']='Bu sütunu gizle';
$ec_lang['lpn_pane_hide_cols']='Bu sütunları gizle';
$ec_lang['lpn_pane_show_all_cols']='Tüm sütunları göster';
$ec_lang['lpn_pane_sort_asc']='Artan sırala';
$ec_lang['lpn_pane_sort_desc']='Azalan sırala';
$ec_lang['lpn_pane_manage_cols']='Sütunları yönet…';
$ec_lang['lpn_pane_manage_cols_title']='Sütunları yönet';
$ec_lang['lpn_pane_manage_cols_show']='Göster';
$ec_lang['lpn_pane_manage_cols_up']='Yukarı taşı';
$ec_lang['lpn_pane_manage_cols_down']='Aşağı taşı';
$ec_lang['lpn_pane_manage_cols_top']='Başa taşı';
$ec_lang['lpn_pane_manage_cols_bottom']='Sona taşı';
$ec_lang['lpn_pane_manage_cols_width']='Genişlik (em)';
$ec_lang['lpn_pane_width_tip']='Sütun genişlikleri projede değil, bu tarayıcıda saklanır. Varsayılan genişliği geri yüklemek için bir sütun ayırıcısına çift tıklayın.';
$ec_lang['lpn_pane_colmenu_tip']='Sütunları gizle veya yönet';
$ec_lang['lpn_tool_area_window']='Pencere seç';
$ec_lang['lpn_tool_area_lasso']='Kement seç';
$ec_lang['lpn_tool_area_polygon']='Çokgen seç';
$ec_lang['lpn_tool_delete']='Sil';
$ec_lang['lpn_tool_zoom_extent']='Tümünü göster';
$ec_lang['lpn_tool_zoom_selection']='Seçime yakınlaştır';
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
// It's a technical term. We can only give a definition, which is not our job."). A plain sentence
// (dev/plain-sentences.md, then $ec_lang_syn) holds phrases that could STAND ON THE CONTROL in place of the label; a technical term has no such
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
// protocol, a visible tip is the preferred home for a definition, in place of a plain-sentence
// entry carrying translatable payload nobody on the page can see.
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
// A tank has two elevations (Tom, 2026-10-11): Elevation is the ground, the pressure datum as at a
// junction; Base elevation is the tank bottom, EPANET's [TANKS] Elevation, from which depth and
// volume are measured.
$ec_lang['lpn_field_tank_base_elev']='Taban kotu';
$ec_lang['lpn_field_tank_base_elev_tip']='Depo tabanının kotu; su derinliği ve hacim buradan ölçülür. Boş bırakılırsa taban, zemin kotundadır.';
$ec_lang['lpn_tank_ground_elev_tip']='Deponun bulunduğu yerdeki zemin kotu. Depodaki basınç, bir düğümdeki gibi buradan ölçülür.';
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
// The corner buttons beside every standing box's X (Task 441). Each is an icon-only button, so the
// value is its name: the hover tip and the screen reader's label at once. Auto-hide is a toggle and
// says its state through aria-pressed, so one wording serves both states (AutoCAD's own word).
$ec_lang['lpn_dock_left']='Haritanın soluna yerleştir';
$ec_lang['lpn_dock_right']='Haritanın sağına yerleştir';
$ec_lang['lpn_dock_float']='Yüzdür';
$ec_lang['lpn_dock_autohide']='Otomatik gizle';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Özellikler';
// What a docked Properties box says while nothing is selected: it stays in its dock (Tom, 2026-10-07).
$ec_lang['lpn_popup_none']='Hiçbir şey seçili değil. Özelliklerini görmek için haritada bir öğe seçin.';
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
// The SAME exit, worded for the other way in, is lpn_close (Task 699 merged its own 'Close' key
// into it). Opened from File the user already has work on screen, so "start with a blank map"
// reads as "discard it" and they do not dare press the only button that leaves (Tom, 2026-08-17:
// "I can't back out of the gallery... I am forced to open an example"). Closing never touches a
// project either way.
$ec_lang['lpn_examples_size']='Düğümler: {nodes}, hatlar: {links}';
$ec_lang['lpn_examples_failed']='Örnekler yüklenemedi. Bir çizime başlamak için Dosya, Yeni proje\'yi kullanın.';
$ec_lang['lpn_examples_loading']='Örnekler yükleniyor…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Bir sorunu düzelt';
$ec_lang['lpn_help_notes']='Bu sayfa hakkında notlar';
$ec_lang['lpn_guide_about_heading']='Bu hesaplayıcı hakkında';
$ec_lang['lpn_guide_group_from']='{menu} menüsünden';
$ec_lang['lpn_guide_menu_named']='{menu} menüsü';
// **THE NEW BOX, TASK 745** (Tom, 2026-09-29: reorganize Help into three groups, with a new
// "Tables and Hotkeys" box gathering all table help and all keyboard shortcuts). One key names
// both the Help row and the box's own title bar, the same pattern lpn_help_notes already carries
// for the Notes box.
$ec_lang['lpn_help_hotkeys']='Tablolar ve Kısayol Tuşları';
// **THE USER GUIDE** (Tom, 2026-10-06: "Maybe items 2 and 3 combined into a simple User Manual or
// whatever the 2026 thing is?"; Ida's design). Names both the Help row and the box's title bar. It
// replaces lpn_help_hotkeys and the Help > Toolbar fly-out (lpn_help_icons, which still heads the
// box's Toolbar section).
$ec_lang['lpn_help_manual']='Kılavuz';
// The Guide's contents rail, its search, its Boxes section and the "?" in every box's title bar.
$ec_lang['lpn_guide_contents']='İçindekiler';
$ec_lang['lpn_guide_rail_hide']='İçindekileri gizle';
$ec_lang['lpn_guide_rail_show']='İçindekileri göster';
$ec_lang['lpn_guide_search']='Kılavuzda ara';
$ec_lang['lpn_guide_boxes_heading']='Kutular';
$ec_lang['lpn_guide_boxes_intro']='Her kutu taşınabilir, yeniden boyutlandırılabilir, haritanın soluna veya sağına yerleştirilebilir ya da kapatılabilir. Kutunun başlık çubuğundaki ? simgesi yardımını açar.';
// Tom's own wording, 2026-10-07 (his typo "to not" corrected). Below lpn_guide_boxes_intro.
$ec_lang['lpn_guide_boxes_autohide']='İşaretçi uzaklaştığında, odağı olmayan bir kutu kısa bir gecikmeden sonra gizlenir. Odağı olan bir kutu, dışına tıkladığınızda, Esc tuşuna bastığınızda ya da işaretçi başka bir yerdeyken Tab ile ondan çıktığınızda gizlenir.';
$ec_lang['lpn_guide_box_help']='Bu kutunun yardımı';
// A Boxes entry whose box shares its name with a section of the Guide ("Screenshot"), in the Guide
// only, so its Contents list does not show one word twice. Keep {box} as it is.
$ec_lang['lpn_guide_box_named']='{box} kutusu';
// Above the Toolbar rows, shown only while some are dimmed (on a phone, or Calculate while
// Recalculate automatically is on): a grey name otherwise reads as a disabled button.
$ec_lang['lpn_guide_dimmed']='Soluk bir ad, araç çubuğunda şu anda gizli olan bir düğmedir.';
// One entry in the Guide's Boxes section for each box, shown by the "?" in its title bar. Fire flow,
// Critical assets, and Demand scaling carry theirs in lpn_ff_intro and the keys that follow it.
$ec_lang['lpn_guide_text_popup']='Seçili varlığın, Metnin veya Müşterinin ya da birden çok seçili varlığın özelliklerini gösterir. Kutu, seçimin yanında veya en son taşındığı yerde açılır. Düzenlenen bir değer şebekeyi hemen değiştirir; varlığın harita etiketi ve Tablolar paneli güncellenir. Hesaplanan sonuçlar salt okunur satırlar olarak gösterilir ve düzenlenemez.';
$ec_lang['lpn_guide_text_find_popup']='Bir koşulu sağlayan varlıkları bulur (8 inçten küçük her boru veya 40 psi altındaki her düğüm gibi) ve hepsinde tek bir özelliği tek işlemle değiştirebilir. Bir modeli çözülmeden önce denetlemek (eksik bir kot, yanlış birimde girilmiş bir çap), çözüldükten sonra sorunlu yerleri listelemek (düşük basınç, yüksek hız) ve birçok varlıkta tek bir düzeltme yapmak için kullanın.\n\nNerede aransın, Özellik, Koşul ve Değer listeleri tek bir koşul oluşturur ve onu Sorgu kutusuna bir metin satırı olarak yazar. Satır doğrudan da düzenlenebilir ve listeler onu izler. Listelerin ifade edemediği bir sorgu, örneğin VEYA ile bağlanmış iki koşul, Bunun yerine denetimleri kullan düğmesine basılana kadar listeleri gizler. Aramak için Sorgu kutusunda Enter tuşuna basın veya Bul düğmesine basın.';
$ec_lang['lpn_guide_text_settings_box']='Açık projenin ve bu tarayıcının ayarlarını bölümler halinde barındırır. Açmak için Su, Ayarlar öğesini seçin. Varsayılanları geri yükle ve Yeniden başlayın adlı iki düğme ayarları sıfırlar. Kutuda arama yapılabilir: Ayarlarda ara alanına bir veya daha fazla sözcük yazın; yalnızca hepsinden söz eden ayarlar listelenir. Bu kutunun konumu ve boyutu yalnızca bu tarayıcıda tutulur.';
$ec_lang['lpn_guide_text_library_box']='Projenin desenlerini, eğrilerini, boru türlerini, bağlantı parçası listelerini, kontrollerini ve kurallarını, her biri ayrı bir bölümde barındırır. Açmak için Su, Kitaplıklar öğesini seçin. Bir varlık, bir desene, eğriye, boru türüne veya bağlantı parçası listesine o öğenin ID\'siyle başvurur; öğe burada oluşturulur, düzenlenir ve silinir. Hepsi projeyle birlikte kaydedilir ve Geri al burada yapılan bir düzenlemeyi geri alır. Kutunun konumu ve boyutu yalnızca bu tarayıcıda tutulur.';
$ec_lang['lpn_guide_text_energy_box']='Son uzun süreli simülasyon boyunca her pompanın enerji kullanımını, tepe gücünü ve maliyetini, her pompanın verimini ve Ayarlar, Enerji altında belirlenen enerji fiyatını kullanarak raporlar. Ayarlarda bir Toplam çalışma süresi ve çözülmüş bir şebeke gerektirir. Şebekeyi değiştirmez.';
$ec_lang['lpn_guide_text_contour_box']='Haritada, Düğümleri şuna göre renklendir listesinde seçilen düğüm değerinden çizilen eş değer eğrisi grafiğini denetler: renk şeması, dolgu ve opaklığı, eş değer eğrisi aralığı ve etiketleri ve rengin her borudan ne kadar uzağa ulaştığı. Kapatmak grafiği gizler ve düğüm renklerini bırakır. Yalnızca görüntüyü değiştirir, şebekeyi değiştirmez.';
$ec_lang['lpn_guide_text_scncmp_box']='Senaryo yöneticisinde işaretli her senaryoyu (işaretler kaldırılmadıkça hepsini) çizimin bir kopyasından çözer ve her biri için senaryo değeri sayısını, talep çarpanını, toplam çalışma süresini, hidrolik zaman adımını, en düşük basıncı ve en yüksek hızı tablolaştırır. Açmak için Su, Raporlar, Senaryo karşılaştırması öğesini seçin. Karşılaştırma kutu açılırken başlar ve kutu açık kaldığı sürece her düzenlemeden sonra yeniden başlar.\n\nProjeyi değiştirmez; açık olan senaryo olduğu gibi bırakılır.';
$ec_lang['lpn_guide_text_rptbox']='Son uzun süreli simülasyon için EPANET motorunun yazdığı metin raporunu, uyarıları ve şebeke özetiyle birlikte gösterir. Her uzun süreli simülasyon onun yerine geçer; tek bir andaki çözüm geçmez ve bir düzenleme önceki raporu yerinde bırakır.';
$ec_lang['lpn_guide_text_status_box']='Son uzun süreli simülasyon sırasındaki her değişikliği zaman sırasıyla listeler: bir pompanın, vananın veya borunun açılıp kapanması, bir deponun dolmaya veya boşalmaya başlaması ya da dolması veya boşalması ve tam yakınsamayan her zaman adımı. Yalnızca değişiklikler listelenir, her zaman adımı değil.';
$ec_lang['lpn_guide_text_full_box']='Her düğümü ve her hattı her raporlama zaman adımında, Tablolar panelinde gösterilen birimlerle listeler. Uzun süreli simülasyon yoksa tek bir andaki geçerli çözümü gösterir. İndirme veya yazdırma her zaman adımını içerir; tablo ise her seferinde birini gösterir.';
$ec_lang['lpn_guide_text_calib_box']='Bir saha ölçümü dosyasını, aynı yerlerdeki ve zamanlardaki hesaplanan sonuçlarla karşılaştırır; her parametre için bir dosya kullanılır. Dosya yalnızca geçerli oturum için tutulur ve projeyle birlikte kaydedilmez.';
$ec_lang['lpn_guide_text_hotkeys_popup']='Kılavuz. Bölümleri Kılavuzu kullanma, Araç çubuğu, Menüler, Harita, Ekran görüntüsü, Tablolar, Kutular, Bu hesaplayıcı hakkında ve Bu sayfa hakkında notlardır. Araç çubuğu ve Menüler, her araç çubuğu düğmesini ve menü satırını klavye kısayoluyla listeler; Kutular her kutu için bir girdi içerir; diğer bölümler sayfanın ne yaptığını anlatır. Bir satırı seçmek o denetimin nerede olduğunu gösterir; onu asla çalıştırmaz. Aramak için Ctrl+K tuşlarına veya kılavuzda odak varken / tuşuna basın. Bir soru açıkken Ctrl+K arama yapmaz.';
// The Find and replace chapter beyond its opening paragraphs, in the Guide's Boxes section
// (Tom, 2026-10-07). Each _def is HTML: keep the tags. A query inside <code> runs as written in
// English on a page in any language; translate it with the words the Find box shows in your
// language, or leave it in English. Asset IDs (60, 247, 330) and the numbers are measured on Net1
// and Net3 by dev/lpn-spike/user-guide-find-harness.js: never change them in translation.
$ec_lang['lpn_guide_find_query_term']='Sorgu dili';
$ec_lang['lpn_guide_find_query_def']='<table class="lpn-notes-table"><tbody><tr><td><code>Scope.Property condition value</code></td><td>Tek bir koşul. Kapsam Her şey, Düğüm, Rezervuar, Depo, Boru, Pompa, Vana, Metin, Müşteri veya Kaynak olabilir. Özellik, o kapsam için Özellik listesindeki herhangi bir girdidir.</td></tr><tr><td>Koşullar</td><td>şuna eşit, şundan büyük, şundan küçük, içerir, en yüksek n, en düşük n ve boş. İçerir yalnızca metne uygulanır. En yüksek n ve en düşük n koşullarında n bir sayıdır, En yüksek 5 gibi. n harfinin kendisiyle (<code>Pipe.Velocity n highest</code> gibi) ya da Değer kutusu boşken 10 varlık listelenir. Boş, özelliği için değeri olmayan varlıkları bulur. Bağlantı özelliğinin dört koşulu vardır ve değer almaz.</td></tr><tr><td>Değerler</td><td>Bir sayı birimi olmadan, Özellikler\'de ve Tablolar panelinde gösterilen birimle girilir: 40 psi değil, 40. Bir kimlik (ID) dahil metin, tek veya çift tırnak içine alınır: <code>\'60\'</code>.</td></tr><tr><td>VE, VEYA ve parantezler</td><td>VE, VEYA\'dan önce değerlendirilir ve parantezler koşulları gruplar. DEĞİL kullanılamaz.</td></tr><tr><td>Yazım</td><td>Sözcüklerde büyük/küçük harf ayrımı yoktur. İngilizce sözcükler her dilde kabul edilir, bu yüzden bu kılavuzdan kopyalanan bir sorgu her dildeki bir sayfada çalışır.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_examples_term']='Net3 üzerinde örnekler';
$ec_lang['lpn_guide_find_examples_def']='<p>Bunları izlemek için Net3 örneğini açın. Basınç psi, hız ft/s cinsindendir.</p><table class="lpn-notes-table"><tbody><tr><td><code>Everything.ID equal to \'60\'</code></td><td>60 numaralı düğüm ve 60 numaralı boru. Bir düğüm ve bir boru aynı kimliğe (ID) sahip olabilir, bu yüzden Her şey altında bir ID araması birden fazla varlık döndürebilir.</td></tr><tr><td><code>Junction.Pressure below 40</code></td><td>10, 40, 50, 20 ve 153 numaralı düğümler, en düşük basınç önce. 10 numaralı düğüm -0,6 psi\'dedir, bu incelenmesi gereken negatif bir basınçtır.</td></tr><tr><td><code>Pipe.Velocity 5 highest</code></td><td>60, 329, 125, 123 ve 149 numaralı borular, en yüksek hız önce. 60 numaralı boru 9,3 ft/s taşır.</td></tr><tr><td><code>Junction.Pressure below 20 OR Pipe.Velocity above 5</code></td><td>10, 20, 40 ve 50 numaralı düğümler ile 60, 125 ve 329 numaralı borular: düşük basınçlar ve yüksek hızlar tek bir listede.</td></tr><tr><td><code>Junction.Pressure below 40 AND Junction.Elevation above 100</code></td><td>10, 20, 40 ve 50 numaralı düğümler, yüksek arazideki düşük basınçlar. Her iki koşul da aynı türde bir varlığı adlandırmalıdır: <code>Junction.Pressure below 40 AND Pipe.Velocity above 3</code> hiçbir şeyle eşleşmez, çünkü hiçbir varlık hem düğüm hem boru değildir.</td></tr><tr><td><code>Pipe.Closed equal to \'closed\'</code></td><td>330 numaralı boru, Net3 dosyasında kapalı olan tek boru.</td></tr><tr><td><code>Junction.Connectivity no open path to a source</code></td><td>Dosya dağıtıldığı haliyle hiçbir şey. 247 numaralı boru kapalıyken (bkz. Değiştir ve Geri al), 215, 217, 219 ve 225 numaralı düğümler: 247 numaralı borudaki bir kırılmanın susuz bırakacağı düğümler. Bunu her boru için tekrarlamak bir kritiklik analizidir.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_results_term']='Sonuçlar, seçim ve Tablolar';
$ec_lang['lpn_guide_find_results_def']='<p>Eşleşen varlıklar Bul düğmesinin altında listelenir. Şundan büyük ve en yüksek n önce en yüksek değeri, şundan küçük ve en düşük n önce en düşük değeri listeler; diğer koşullar bulunan değere göre, sonra ID\'ye göre listeler. VE veya VEYA içeren bir sorgu önce düğümleri, sonra hatları, her birini ID\'ye göre listeler. Tek bir eşleşme haritada hemen gösterilir. Haritayı o varlığa ortalamak için bir satırı seçin. Hiçbir şey seçili değilse varlık da seçilir; bir şey seçiliyse varlık vurgulanır ve seçim değişmez. Seçime eklemek veya çıkarmak için bir satırı Shift+tıklayın ya da Ctrl+tıklayın. Bul kendi başına tüm eşleşmeleri seçmez.</p><p>Geçerli tabloda filtrele düğmesi aynı sorguyu Tablolar paneline uygular. Sorgunun uygulandığı her tablo yalnızca eşleşen satırları gösterir; sorgu ve satır sayısı üstlerinde yer alır. Haritada tüm eşleşmeleri seçmek için bu satırları seçin ve sağ tık menüsünden Haritada seç\'i seçin. Bir tablo filtresi projeyle birlikte kaydedilmez ve sayfa yeniden yüklendiğinde sona erer. Artık eşleşmeyecek şekilde düzenlenen bir satır, Geçerli tabloda filtrele düğmesine yeniden basılana kadar tabloda soluk ve bir uyarı işaretiyle kalır.</p>';
$ec_lang['lpn_guide_find_replace_term']='Değiştir ve Geri al';
$ec_lang['lpn_guide_find_replace_def']='<p>Kutunun Bulunanları değiştir bölümü, sorgunun bulduğu her varlıkta tek bir özelliği yazar. Değiştirilecek özellik listesinden özelliği seçin, yeni değeri Yeni değer kutusuna görüntülenen birimle girin ve Değiştir düğmesine basın. Kutu, yeni değere zaten sahip olanlar sayılmadan kaç varlığın değişeceğini bildirir. Değişikliği uygulamak için Bunları değiştir düğmesine basın veya İptal\'i seçin. Tek bir Geri al, değiştirmenin tamamını geri alır.</p><p>Net1 üzerinde örnek: <code>Pipe.Diameter below 10</code> 31, 122, 113 ve 121 numaralı boruları bulur. Çap\'ı seçin, 10 girin ve Değiştir\'e basın; kutu "4 varlık değiştirilsin mi?" gösterir. Dört boruyu da 10 inç yapmak için Bunları değiştir\'e basın. Tek bir Geri al onları 6 ve 8 inçe döndürür.</p><p>Net3 üzerinde örnek: <code>Pipe.ID equal to \'247\'</code> 247 numaralı boruyu bulur. Kapalı\'yı seçin, Yeni değer listesinde yine Kapalı\'yı seçin ve boruyu yukarıdaki bağlantı durumu örneği için kapatmak üzere Değiştir\'e, ardından Bunları değiştir\'e basın. Geri al onu yeniden açar.</p><p>Değiştirme tek bir tür varlık gerektirir, bu yüzden Her şey altında önce Nerede aransın listesinden bir varlık türü seçin. Temel dışındaki bir senaryoda, değiştirme o senaryoda saklanır, Özellikler\'deki aynı düzenleme gibi. Mapbox kotlarının bulunduğu yerlerde, Kot yazılan bir değer yerine Mapbox DEM verisinden değiştirilebilir.</p>';
$ec_lang['lpn_guide_find_notes_term']='Dikkat edilecek noktalar';
$ec_lang['lpn_guide_find_notes_def']='<ul><li>Değerler tam duyarlılıkla karşılaştırılır ve dört ondalık basamakla listelenir. Şuna eşit, hesaplanmış bir sonuçla nadiren eşleşir; şundan büyük ve şundan küçük kullanın.</li><li>Basınç, yük, debi, hız ve diğer sonuçlar son hesaplamanınkilerdir. Otomatik olarak yeniden hesapla ayarı kapalıyken, şebekeyi son Hesapla\'daki haliyle tanımlarlar.</li><li>Metinde şundan büyük ve şundan küçük sözlük sırasını kullanır; sayılar sayısal sıradadır: Net1\'de <code>Junction.ID above \'20\'</code> 21, 22, 23, 31 ve 32 numaralı düğümleri bulur.</li><li>Her şey altında yalnızca ID, Açıklama, Etiket ve Bağlantı sunulur. Özelliklerin tam listesini görmek için Nerede aransın listesinden bir varlık türü seçin.</li><li>Bir Metin öğesinin ID\'si yoktur. Onu sözcükleriyle arayın: <code>Text.Text contains \'pump\'</code> gibi.</li><li>Bir düğüm için dört Bağlantı koşulu düğümde bağlantı yok, düğümde açık bağlantı yok, kaynağa giden bağlantı yolu yok ve kaynağa giden açık yol yok koşullarıdır. Kaynak bir rezervuar veya depodur.</li></ul>';
// The Scenarios chapter, in the entry for the Scenario manager box (Task 785). Written from the code of
// feat/bentley-interop and held by dev/lpn-spike/user-guide-scenarios-harness.js. The box's own help
// (lpn_sm_help, Tom's wording of 2026-10-16) comes first in the entry; nothing here restates or
// contradicts it. Terms follow the Find and replace chapter's pattern.
$ec_lang['lpn_guide_scn_use_term']='Senaryo ne işe yarar';
$ec_lang['lpn_guide_scn_use_def']='<p>Senaryolar, aynı projede birçok tasarımı, görünümü veya durumu saklar; örneğin ortalama gün, en yüksek gün, pik saat, rapor sunumu için bir şekil, devre dışı bir ana boru veya önerilen bir değişim. Şebeke yalnızca bir kez, Temel senaryoda çizilir. Her diğer senaryo yalnızca kendi senaryo değerlerini, yani devraldığı senaryodan farklı olan değerleri tutar ve geri kalan her şeyi o senaryodan okur. Bu nedenle Temel senaryoda yapılan bir düzenleme, o değeri kendi senaryo değeriyle değiştirmemiş her senaryoya ulaşır.</p><p>Yeni bir proje altı hazır senaryoyla başlar: 1. Debi testi: Statik, 2. Debi testi: Orta, 3. Debi testi: Maks, 4. Ortalama gün, 5. Maksimum gün ve 6. Pik saat. Bunlar yeniden adlandırılabilen, düzenlenebilen ve silinebilen sıradan senaryolardır. Her biri tek bir senaryo değeriyle, yani talep çarpanıyla başlar: debi testleri ve Ortalama gün için 1, Maksimum gün için 2 ve Pik saat için 3. Çarpanlar, modellenen sistemin değerleriyle değiştirilmesi gereken yer tutuculardır. Bir dosyadan açılan, her örnek dahil, veya bir EPANET dosyasından içe aktarılan bir projede yalnızca Temel senaryo bulunur.</p><p>Yangın debisi, her düğümü veya seçili düğümleri sınayan Yangın debisi analiziyle denetlenir. Maksimum gün, çalıştırıldığında normalde açık olan senaryodur.</p>';
$ec_lang['lpn_guide_scn_open_term']='Açık senaryo';
$ec_lang['lpn_guide_scn_open_def']='<p>Haritanın altındaki durum şeridinde bulunan Senaryo düğmesi açık senaryoyu adlandırır ve senaryo değerlerini sayar; örneğin Senaryo: Temel | Senaryo değeri sayısı: 0. Senaryolar arasında geçmek veya bir senaryo eklemek, kopyalamak, yeniden adlandırmak ya da silmek için ona tıklayın veya Su, Senaryolar öğesini seçin. Listedeki her senaryo senaryo değeri sayısını parantez içinde gösterir ve açık olanın yanında bir onay işareti bulunur. Senaryo yöneticisi satırı, senaryo ve alternatif ağacını açar. Temel mod işaretliyken soluk görünür.</p><p>Çizim, etiketler, Özellikler, Tablolar ve sonuçların hepsi açık senaryoya aittir ve sayfa yalnızca açık senaryoyu çözer. Kendi girdisinde açıklanan Senaryo karşılaştırması diğerlerini kopyalardan çözer. Açık senaryo projeyle birlikte kaydedilir.</p>';
$ec_lang['lpn_guide_scn_marks_term']='Senaryo değerleri nerede görünür';
$ec_lang['lpn_guide_scn_marks_def']='<p>Haritada, açık senaryoda bir senaryo değeri olan varlık kehribar renkli bir halkayla, üst senaryodan veya alternatiften bir senaryo değeri devralan varlık ise kesikli gri bir halkayla çevrelenir. Talep, çap, pürüzlülük, küçük (yerel) kayıp katsayısı ve uzunluk için halka yalnızca Ayarlar, Görselleştirme, Düğüm etiketleri veya Hat etiketleri o değeri haritada gösterirken görünür; başka herhangi bir özelliğin senaryo değerinin halkası her zaman vardır. Tablolarda, açık senaryonun belirlediği bir değeri tutan hücre kehribar renklidir ve ipucu onu tutan alternatifi söyler; örneğin Fiziksel alt.: Daha büyük ana boru. Bir tablonun hücre menüsündeki Senaryoları göster, her varlığı her senaryo için bir kez listeler.</p><p>Bir senaryonun değiştirebildiği Özellikler satırlarının her birinin solunda bir işaret vardır. Dolu bir nokta, açık senaryonun değeri kendi senaryo değeriyle değiştirdiği anlamına gelir; senaryo değerini temizlemek için ona tıklayın. İçi boş bir nokta, değerin devralındığı anlamına gelir; gösterilen değeri bir senaryo değeri yapmak için ona tıklayın. Bir üçgen, bunun altındaki senaryoların değeri değiştirdiği anlamına gelir; onaydan sonra onların senaryo değerlerini temizlemek için ona tıklayın. Senaryo değeri olan bir satırın altında, onun yerini aldığı devralınan değer görünür; örneğin Temel senaryo: 18. Ayarlar kutusunda yalnızca dolu nokta ve üçgen vardır, çünkü orada bir değer yazmak senaryo değeri oluşturur.</p><p>Halkaları gizlemek için Ayarlar, Harita ve sayfa, Sayfa altındaki Senaryo değeri işaretlerini haritada göster ayarının işaretini kaldırın veya Harita, Temiz harita öğesini seçin. İkisi de projede değil, bu tarayıcıda tutulur. Tablolar her iki durumda da senaryo değerlerini işaretler.</p>';
$ec_lang['lpn_guide_scn_make_term']='Senaryo değerlerini oluşturma ve temizleme';
$ec_lang['lpn_guide_scn_make_def']='<p>Temel dışında bir senaryo açıkken, senaryoların değiştirebildiği bir değerde yapılan düzenleme, nasıl yapılırsa yapılsın, açık senaryoda bir senaryo değeri olarak saklanır: Özelliklerde yazmak, Tablolarda bir hücreyi düzenlemek, Bul ve değiştir içinde Değiştir, bir düğümü sürüklemek veya koordinatlarını girmek, Türü değiştir (yeni tür senaryo değeridir) ya da Özellikleri seçime yapıştır. Ayarlar kutusunda yazılan bir ayar, senaryolar o ayarı değiştirebiliyorsa senaryo değeri olarak saklanır. Temel senaryo değişmez. Temelde aynı düzenlemeler şebekenin kendisini değiştirir ve değeri değiştirmemiş her senaryoya ulaşır.</p><p>Sil farklı davranır. Bir senaryoda Sil, Temelde bulunan bir varlığı kaldırmaz. Varlığı açık senaryoda etkin olmayan hale getirir; bir düğüm için boruları da, ve bir ileti bunu bildirir. Varlık çizimde ve diğer senaryolarda durmaya devam eder. Bir senaryo açıkken çizilen varlık Temelde etkin değildir, o senaryoda etkindir ve o senaryoda Sil onu kaldırır. Temelde bir varlığı silmek, onu sayan bir sorudan sonra, her senaryodaki senaryo değerlerini de siler. Müşteriler ve Figürler hiçbir senaryoya ait değildir ve doğrudan silinir.</p><p>Senaryolar listesindeki Senaryo değeri yöneticisi satırı, açık senaryonun her senaryo değerinin kategoriye göre bir listesini, her birinin yanında değiştirdiği devralınan değerle birlikte açar. Senaryonun açtığı, taşıdığı veya değiştirdiği haritadaki bir zaman serisi grafiği ayrı bir satırdır. Satırları işaretleyin ve Seçili senaryo değerlerini temizle düğmesine tıklayın, bir satırdaki Senaryo değerini temizle düğmesine tıklayın veya Tüm senaryo değerlerini temizle düğmesine tıklayın. Her değer devralınan değere döner ve Geri al bunu geri alır. Haritada varlığa gitmek için listeden bir ID seçin. Özelliklerdeki nokta ve Tabloların hücre menüsündeki Senaryo değerini temizle satırı, senaryo değerlerini tek tek temizler.</p>';
$ec_lang['lpn_guide_scn_scope_term']='Bir senaryo neyi değiştirebilir ve neyi değiştiremez';
$ec_lang['lpn_guide_scn_scope_def']='<table class="lpn-notes-table"><tbody><tr><td>Özellikler</td><td>Bir düğümün veya hattın, aşağıda sayılanlar dışındaki her özelliği; konumu, etkin olup olmadığı ve türü (Türü değiştir) dahil. Bir Metin; sözcüklerini, konumunu, boyutunu, hizalamasını, kalın olup olmadığını, açısını ve gösterilip gösterilmediğini değiştirebilir. Özel bir özellik her zaman değiştirilebilir. Özellikler şu kategorilerde tutulur: Fiziksel, Talep, Etkin topoloji, Başlangıç ayarları, Madde, Yangın debisi, Enerji maliyeti, Özel özellikler, Metin, Sunum ve Hesaplama.</td></tr><tr><td>Ayarlar</td><td>Projeyle birlikte kaydedilen ayarlar, aşağıda sayılanlar hariç: hesaplama seçenekleri (örneğin talep çarpanı, toplam çalışma süresi, hidrolik zaman adımı ve sürtünme yöntemi), varsayılan talep deseni, yeni varlıklara verilen değerler ve sunum ayarları (boyutlar, renkler, etiketler, eş eğriler, harita görünümü ve haritadaki zaman serisi grafikleri).</td></tr><tr><td>Her senaryoda aynı olanlar</td><td>Bir varlığın ID\'si, Açıklaması ve Künyesi; bir hattın uç düğümleri ve kırılma noktaları; Müşteriler ve Figürler; birimler ve koordinat sistemi; ve Kitaplıkların içeriği (desenler, eğriler, boru türleri, bağlantı parçası listeleri, kontroller ve kurallar). Bunlardan herhangi birinde yapılan düzenleme her senaryoyu değiştirir. Bir senaryo bir varlığı farklı bir eğriye, boru türüne, bağlantı parçası listesine veya desene yönlendirebilir, ancak onların içindekileri değiştiremez.</td></tr></tbody></table>';
$ec_lang['lpn_guide_scn_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_scn_example_def']='<p>Net1 örneğini açın. Su, Senaryolar, Yeni senaryo… öğesini seçin, Daha büyük ana boru yazın ve Tamam\'a tıklayın. Haritada Boru 10\'u seçin ve Özelliklerde Çap için 24 girin; Temelde 18 inç vardır ve alanın altında Temel senaryo: 18 olarak gösterilir. Senaryolar listesinde Temel\'i seçin, yine Yeni senaryo… öğesini seçin, En yüksek gün yazın ve Ayarlar, Hesaplama, Hidrolik içinde Talep çarpanı için 1,8 girin. Sonra Su, Raporlar, Senaryo karşılaştırması öğesini seçin.</p><table class="lpn-notes-table"><tbody><tr><td>Senaryo</td><td>Senaryo değeri sayısı</td><td>Talep çarpanı</td><td>En düşük basınç</td><td>En yüksek hız</td></tr><tr><td>Temel</td><td>0</td><td>1</td><td>108 psi, N32, 14:00</td><td>2,76 ft/sn, L11, 16:00</td></tr><tr><td>Daha büyük ana boru</td><td>1</td><td>1</td><td>109 psi, N32, 14:00</td><td>2,87 ft/sn, L11, 16:00</td></tr><tr><td>En yüksek gün</td><td>1</td><td>1,8</td><td>15,77 psi, N32, 9:00</td><td>3,49 ft/sn, L10, 8:00</td></tr></tbody></table><p>Toplam çalışma süresi üçünde de 24:00\'dır; bu yüzden her en düşük basınç ve en yüksek hız, gösterilen zamandaki gün boyu uç değerdir. Daha büyük ana boru en düşük basıncı yaklaşık 1 psi artırır. 1,8 çarpanı onu 9:00\'da 15,77 psi\'ye düşürür ve en yüksek hız Boru 10\'a geçer. Her senaryo bir senaryo değeri tutar ve Temel değerlerini korur.</p>';
$ec_lang['lpn_guide_scn_notes_term']='Dikkat edilecek noktalar';
$ec_lang['lpn_guide_scn_notes_def']='<ul><li>Devralınan değere eşit bir senaryo değeri de yine bir senaryo değeridir. Sayılır ve Senaryo değeri yöneticisi onu (aynı) ile işaretler.</li><li>Temel mod, proje için değil, bu tarayıcı için bir ayardır. Senaryolarını ve alternatiflerini gösteremediği bir proje için devre dışıdır. Alternatifler ve Senaryo yöneticisi bu girdinin başındaki yardımda açıklanmıştır.</li><li>Geri al 20 adım tutar. Her adım, çizimle birlikte senaryoları ve açık senaryoyu da geri yükler; bu yüzden bir senaryo eklemek, yeniden adlandırmak ve silmek geri alınabilir.</li><li>Bir EPANET dosyasını dışa aktarmak yalnızca açık senaryoyu, o senaryonun okuduğu değerler ve düğüm konumlarıyla yazar. Senaryoların kendileri yalnızca proje dosyasına kaydedilir.</li></ul>';
// The Scenario comparison chapter beyond its opening paragraphs (lpn_guide_text_scncmp_box), copied into
// the box's entry by renderGuideBoxes() from <template id="lpn_guide_more_lpn_scncmp_box">. Task 785.
$ec_lang['lpn_guide_cmp_cols_term']='Tablonun içeriği';
$ec_lang['lpn_guide_cmp_cols_def']='<table class="lpn-notes-table"><tbody><tr><td>Senaryo</td><td>Senaryonun adı. Açık senaryo (şu anda açık) ile işaretlenir.</td></tr><tr><td>Senaryo değeri sayısı</td><td>Senaryonun kendi senaryo değerleri, Senaryolar listesindeki gibi sayılır. Talep çarpanı gibi bir hesaplama seçeneği bir sayılır ve devralınan değere eşit bir senaryo değeri de sayılır.</td></tr><tr><td>Talep çarpanı, Toplam çalışma süresi, Hidrolik zaman adımı</td><td>Senaryonun çözüldüğü değerler; kendisine ait olanlar veya projeninkiler. Daimi rejimli bir senaryo zaman adımı için tire gösterir.</td></tr><tr><td>En düşük basınç</td><td>Bir düğümdeki en düşük basınç; ID\'si ve oluştuğu zamanla birlikte. Rezervuarlar ve depolar, her birinin yükü sabit olduğu için dışarıda bırakılır.</td></tr><tr><td>En yüksek hız</td><td>Bir boruda veya vanadaki en yüksek hız; ID\'si ve oluştuğu zamanla birlikte. Pompalar dışarıda bırakılır.</td></tr></tbody></table>';
$ec_lang['lpn_guide_cmp_run_term']='Daimi rejimli ve uzun süreli senaryolar';
$ec_lang['lpn_guide_cmp_run_def']='<p>Toplam çalışma süresi 0\'dan büyük olan bir senaryo, EPANET motoruyla tüm dönem boyunca çalıştırılır. En düşük basıncı ve en yüksek hızı, her biri zamanıyla birlikte gösterilen, her zaman adımındaki uç değerlerdir. Toplam çalışma süresi 0 olan bir senaryo tek bir anda çözülür. Toplam çalışma süresi bir senaryonun değiştirebildiği seçeneklerden biridir; bu yüzden tek bir tablo iki türü de tutabilir.</p>';
$ec_lang['lpn_guide_cmp_notes_term']='Dikkat edilecek noktalar';
$ec_lang['lpn_guide_cmp_notes_def']='<ul><li>Çözülemeyen bir senaryo, iki sonucunun yerinde nedenini gösterir; örneğin bir boru etkin olmayan hale getirildikten sonra bir düğümün kaynağa yolu kalmaması. Diğer senaryolar yine de çözülür. Yakınsamayan bir senaryo son sonuçlarını ve bir ileti gösterir.</li><li>Tablonun üstündeki Her senaryoda aynı olanlar bloğu sürtünme yöntemini, birimleri, doğruluğu ve en fazla deneme sayısını bildirir. Senaryolar arasında farklı olan bir ayar bloğun dışında bırakılır.</li><li>Geçti veya kaldı eşiği yoktur. Sayıları, modellenen sistemin tasarım ölçütlerine göre okuyun.</li><li>Senaryo yöneticisi girdisinde verilen örnek, Net1 üzerinde üç senaryoyu karşılaştırır.</li></ul>';
// The Libraries chapter, in the entry for the Libraries box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_library_box">. Written from the code and held by
// dev/lpn-spike/user-guide-library-harness.js.
$ec_lang['lpn_guide_lib_kinds_term']='Her bölümün içeriği';
$ec_lang['lpn_guide_lib_kinds_def']='<table class="lpn-notes-table"><tbody><tr><td>Desenler</td><td>Bir çalıştırma sürdüğü kadar tekrarlanan bir çarpan listesi; her desen zaman adımı için bir çarpan. Yeni bir desen, 1 değerinde 24 çarpandır. Bir elektronik tablo sütununu yapıştırmak Çarpanlar kutusunu doldurur. Varsayılan talep deseni (varsayılan) ile işaretlenir ve Ayarlar, Hesaplama, Hidrolik içinde seçilir.</td></tr><tr><td>Eğriler</td><td>Eğri türü olarak seçilen dört tür: Pompa yükü, Pompa verimi, Depo hacmi ve Vana yük kaybı. Noktalar, yapıştırılmış bir elektronik tablo sütununu veya bir EPANET dosyasından kopyalanmış satırları kabul eden bir ızgaraya girilir. Bir pompa yük eğrisi noktalarından geçecek şekilde uydurulur ve Denklem satırı uydurmayı gösterir; tek nokta tasarım noktası olarak okunur, EPANET\'in okuduğu gibi kapama yükü o yükün 1,33334 katı ve en yüksek debi o debinin 2 katıdır. Diğer türler noktalarını düz çizgilerle birleştirir. Bir pompa veya vana eğrisini Özelliklerde belirtir; oradaki Eğriler bağlantısı bu bölümü açar.</td></tr><tr><td>Boru türleri</td><td>Birçok borunun başvurduğu çap, pürüzlülük ve reaksiyon katsayıları tanımı. Bir özellik tanımda boş bırakılabilir ve sonra her boru için girilir. Özelliklerde, bir boru türünün belirttiği değerler devre dışıdır ve Boru türünden ayır bunları boruya kopyalar ve borunun türü kullanmasını durdurur.</td></tr><tr><td>Bağlantı parçaları</td><td>Her biri için bir adet bulunan bağlantı parçası listeleri; bir boru veya boru türü için tek bir küçük (yerel) kayıp katsayısı, k, olarak toplanır. Sunulan bağlantı parçaları EPANET 2.2 kullanım kılavuzunun Tablo 3.3\'ündeki on üç parça ve Diğer bağlantı parçasıdır. Birini seçmek katsayısını satıra kopyalar; orada değiştirilebilir.</td></tr><tr><td>Kontroller</td><td>Her biri EPANET sözdiziminde tek bir ifade, <code>LINK id OPEN IF NODE id BELOW value</code> gibi. Her birinin altında kutu, ifadenin anlaşılıp anlaşılmadığını bildirir.</td></tr><tr><td>Kurallar</td><td>Her biri EPANET sözdiziminde birkaç satır: RULE, IF, AND, OR, THEN, ELSE ve PRIORITY. Her birinin altında kutu, kuralın okunup okunmadığını bildirir.</td></tr></tbody></table>';
$ec_lang['lpn_guide_lib_refs_term']='Yeniden adlandırma, silme ve bir öğeye başvuranlar';
$ec_lang['lpn_guide_lib_refs_def']='<p>Bir ID, kendi bölümünde değiştirilir. Boş bir ID veya aynı bölümde zaten kullanılan bir ID kabul edilmez. Bir öğeyi yeniden adlandırmak, ona yapılan her başvuruyu, Temelde ve her senaryoda taşır. Bir desen için başvurular şunlardır: bir düğümün talep deseni ve talep kategorilerinin her birinin deseni, bir Müşterinin talep deseni, bir rezervuarın yük deseni, bir pompanın hız deseni ve varsayılan talep deseni.</p><p>Kullanımda olan bir desen silinebilir ve ona yapılan her başvuru temizlenir. Varsayılan talep deseni olsaydı, bir bildirim deseni olmayan düğümlerin artık neyi kullandığını bildirir. Kullanımda olan bir eğri, boru türü veya bağlantı parçası listesi silinmez. İleti onu kullanan varlıkları adlandırır ve her birine önce başka bir eğri verilmelidir ya da türden veya listeden ayrılmalıdır.</p>';
$ec_lang['lpn_guide_lib_scn_term']='Kitaplıklar ve senaryolar';
$ec_lang['lpn_guide_lib_scn_def']='<p>Kitaplıklar her senaryoda aynıdır. Bir senaryo bir varlığı farklı bir eğriye, boru türüne, bağlantı parçası listesine veya desene yönlendirebilir; bu, o varlığın bir senaryo değeridir, ancak bir öğenin içeriği değiştirilmez. Bir desende, eğride, boru türünde, bağlantı parçası listesinde, kontrolde veya kuralda yapılan düzenleme, hangi senaryo açık olursa olsun her senaryo için değişir. Varsayılan talep deseni bir öğe değil bir ayardır ve bir senaryonun kendi varsayılan deseni olabilir.</p><p>Açık senaryoda etkin olmayan bir varlığı adlandıran kontrol veya kural, o senaryonun çalıştırmasında yok sayılır ve Kitaplıklar kutusu onu listeler. Projede bulunmayan bir varlığı adlandıran da bir uyarıyla birlikte yok sayılır.</p>';
$ec_lang['lpn_guide_lib_ctl_term']='Bir çalıştırmada kontroller ve kurallar';
$ec_lang['lpn_guide_lib_ctl_def']='<p>Bir kontrol tek bir ifadedir. Bir kural, RULE ile başlayan birkaç satırdır. Anahtar sözcükler sayfanın dili ne olursa olsun İngilizce yazılır ve sayılar projenin birimlerindedir. Kontrol ekle, şebekeden oluşturulan bir ifadeyle başlar; bu ifade sonra amaçlanana dönüşecek biçimde düzenlenir.</p><p>Kontroller ve kurallar bir sonucu yalnızca uzun süreli bir benzetimde, yani Toplam çalışma süresi 0\'dan büyükken değiştirir. Daimi rejimli bir çözümü hiçbiri değiştirmez. Kurallar yalnızca EPANET motoruyla uygulanır. İkisi de projeyle birlikte kaydedilir ve bir EPANET dosyasına yazılır.</p>';
$ec_lang['lpn_guide_lib_import_term']='Kitaplıkları başka bir projeden içe aktarma';
$ec_lang['lpn_guide_lib_import_def']='<p>Dosya, İçe aktar…, Kitaplıkları içe aktar… başka bir proje dosyasını açar ve ondan tüm kitaplıkları bu projeye kopyalar. Adı burada zaten kullanılan bir öğe atlanır ve listelenir; böylece burada zaten bulunan hiçbir şey değişmez. Dosya ve proje bir büyüklüğü farklı birimlerde belirtiyorsa bir uyarı gösterilir ve öğeler yazıldığı gibi içe aktarılır. Bu projede bulunmayan bir bağlantı parçası listesine başvuran boru türleri listelenir; bunları çözmek için bağlantı parçaları kitaplığını aynı dosyadan içe aktarın.</p>';
$ec_lang['lpn_guide_lib_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_lib_example_def']='<p>Net1 örneğini açın ve Su, Kitaplıklar öğesini seçin. Desenler, 2:00 aralıklı, 24:00\'ü kapsayan 12 çarpanlı, (varsayılan) ile işaretli 1 numaralı deseni, Demand Pattern\'i tutar. Eğriler, bir noktalı bir Pompa yükü eğrisi olan 1 numaralı eğriyi, Pump 9 için Pump Curve\'ü tutar: 250 ft\'te 1500 gpm. Kontroller iki ifade tutar: birincisi 2 numaralı düğüm 110\'un altına düştüğünde Hat 9\'u açar, ikincisi 2 numaralı düğüm 140\'ın üstüne çıktığında kapatır. Kurallar, saat zamanını ve Depo 2\'nin seviyesini sınayan iki kural tutar.</p><p>Su, Hesapla öğesini ve sonra Su, Raporlar, Durum değişiklikleri öğesini seçin. Pompa L9 artık 10:00\'da kapalı, 15:00\'te açık ve 21:00\'de kapalıdır ve Depo N2 artık 22:00\'de boşalmaktadır. Kontrollerde ikinci kontroldeki 140\'ı 135 yapın ve Su, Hesapla öğesini yine seçin. Son kapanma 20:00\'ye kayar ve Depo N2 artık 21:00\'de boşalmaktadır.</p>';
$ec_lang['lpn_guide_lib_notes_term']='Dikkat edilecek noktalar';
$ec_lang['lpn_guide_lib_notes_def']='<ul><li>Bir desen bir çalıştırma sürdüğü kadar tekrarlanır; bu yüzden tüm çalıştırmayı kapsaması gerekmez.</li><li>Bir EPANET dosyasında bir boru türü veya bağlantı parçası listesi için yer yoktur. Dosya, her borunun okuduğu sayıları taşır ve dışa aktarma hangi boruların düzleştirildiğini söyler.</li><li>Kitaplıklar kutusunun konumu ve boyutu bu tarayıcıda tutulur. Öğeler projeyle birlikte kaydedilir.</li></ul>';
// The Properties chapter, in the entry for the Properties box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_popup">. Held by dev/lpn-spike/user-guide-properties-harness.js.
$ec_lang['lpn_guide_prop_open_term']='Özellikleri açma';
$ec_lang['lpn_guide_prop_open_def']='<p>Seç modunda, Özelliklerin yanında veya kutunun en son taşındığı yerde açılması için bir düğüme, hatta, Metne veya Müşteriye tıklayın. Seçime eklemek için başka bir varlığa Shift ile tıklayın. Birden çok varlık seçiliyken kutu, hepsinde birden ayarlanabilecekleri listeler (aşağıdaki Birden çok varlık seçili bölümüne bakın). Bir Figürün Özellikler kutusu yoktur, çünkü noktaları haritada düzenlenir.</p><p>Bir düğümün veya hattın sağ tıklama menüsünde Özellikleri kopyala, Özellikleri seçime yapıştır ve Zaman serisi grafiği vardır. Dokunmatik ekranda aynı menü için varlığa basılı tutun. Zaman serisi grafiği, uzun süreli bir benzetimin sonuçlarını gerektirir.</p>';
$ec_lang['lpn_guide_prop_edit_term']='Bir değeri düzenleme';
$ec_lang['lpn_guide_prop_edit_def']='<p>Bir değer, alan bırakılarak veya Enter\'a basılarak işlendiğinde etkili olur. Etiketinde adı geçen birimde, dönüştürme yapılmadan okunur ve harita etiketi, Tablolar ve sonuçlar onu izler. Hesaplanan değerler, yazılacak kutusu olmayan salt okunur satırlardır. Bir hat için girdilerini izlerler, bir düğüm için ise onların arasında yer alırlar. Bunlar son hesaplamanın sonuçlarıdır, gösterilen zamandadır ve Otomatik olarak yeniden hesapla işareti kaldırılmışsa son Hesapla\'nınkilerdir.</p><p>Bir boru türü kullanan boru, türün belirttiği değerleri devre dışı gösterir. Bu değerleri boruya kopyalamak ve orada düzenlemek için Boru türünden ayır\'a tıklayın.</p>';
$ec_lang['lpn_guide_prop_id_term']='ID';
$ec_lang['lpn_guide_prop_id_def']='<p>ID, başlık çubuğunda düzenlenir. Boşluk veya tırnak işareti içeremez; bir düğümün ID\'si başka bir düğümün ID\'si olamaz, bir hattın ID\'si de başka bir hattın ID\'si olamaz. Bir düğüm ve bir hat aynı ID\'ye sahip olabilir. Reddedilen bir ID eskisini yerinde bırakır ve bir ileti gösterir. Bir varlığı yeniden adlandırmak senaryo değerlerini de onunla birlikte taşır.</p>';
$ec_lang['lpn_guide_prop_scn_term']='Bir senaryoda';
$ec_lang['lpn_guide_prop_scn_def']='<p>Temel dışındaki bir senaryoda, senaryoların değiştirebildiği bir değerde yapılan düzenleme, açık senaryonun bir senaryo değeri olarak saklanır ve satır solunda işaretlenir. Senaryo yöneticisi girdisi işaretleri açıklar ve her senaryoda aynı olanları listeler: ID, Açıklama ve Künye bunlardandır. Bir Müşterinin senaryo değerleri yoktur. Senaryolar arasında geçmek, Özellikleri aynı varlıkta açık bırakır ve şimdi açık olan senaryonun değerlerini gösterir.</p>';
$ec_lang['lpn_guide_prop_multi_term']='Birden çok varlık seçili';
$ec_lang['lpn_guide_prop_multi_def']='<p>Başlık, örneğin, 2 seçili yazar. Kutunun seçimdeki her varlık türü için bir bölümü vardır; başlığı türün adı ve o türden varlık sayısıdır, Borular (2) gibi, ve her bölüm daraltılabilir. Bir bölüm, Tabloların sütun olarak sahip olduğu ve içindeki her varlıkta ayarlanabilen özellikleri listeler. Sonuçlar ve bir boru türünün belirttiği değerler listelenmez. Bir satır, varlıkların paylaştığı değeri veya farklı oldukları yerde Değişken gösterir.</p><p>Bir satıra değer yazmak, seçimdeki o türden her varlığa onu ayarlar. Dokunulmayan bir satır hiçbir şey yazmaz. Bir bildirim sayıyı bildirir, 2 üzerinde Çap (inç) ayarlandı. gibi, ve tek bir Geri al satırın tamamını geri alır. Temel dışındaki bir senaryoda değerler senaryo değeri olarak saklanır.</p>';
$ec_lang['lpn_guide_prop_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_prop_example_def']='<p>Net1 örneğini açın ve Boru 10\'a tıklayın. Özellikler, Açıklama\'dan Etkin mi?\'ye girdilerini ve sonra gösterilen zamandaki sonuçlarını listeler: Debi 1866,2 gpm, Hız 2,4 ft/sn ve Yük kaybı 19,12 ft H2O.</p><p>Boru 113\'e tıklayın ve Boru 31\'e Shift ile tıklayın. Başlık 2 seçili yazar, tek bölüm Borular (2)\'dir ve Çap Değişken gösterir, çünkü Boru 31 6 inç, Boru 113 ise 8 inçtir. Çap için 10 girin. Bildirim 2 üzerinde Çap (inç) ayarlandı. yazar, iki boru da 10 inçtir ve tek bir Geri al onları 6 ve 8 inç değerlerine döndürür.</p>';
// The Settings chapter, in the entry for the Settings box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_settings_box">. Held by dev/lpn-spike/user-guide-settings-harness.js.
$ec_lang['lpn_guide_set_where_term']='Bölümler ve ayarların nerede kaydedildiği';
$ec_lang['lpn_guide_set_where_def']='<p>Kutunun solundaki liste bir bölüme veya alt başlığa atlar. Bölümler Görselleştirme (Düğüm etiketleri, Düğüm renkleri, Hat etiketleri, Hat renkleri, Müşteri ve Tümü), Harita ve sayfa (Görünüm ve Sayfa), Öğeler (ID önekleri, Değerler ve Özel özellikler), Hesaplama (Birimler, Zaman, Hidrolik, Enerji ve Su kalitesi) ve Emeği geçenlerdir. Her alt başlık, ayarlarının Projeyle kaydedildiğini mi yoksa Bu tarayıcıda kaydedildiğini mi bildirir. Sayfa altındaki ayarlar ve Hidrolik içindeki, kendisi Bu tarayıcıda kaydedilir diyen bir satır olan Çalıştırma ilerleme kutusunu göster dışında her şey projeyle birlikte kaydedilir.</p><p>Tablolardaki Ayarlar sekmesi aynı ayarları Kategori ve Değer ile satırlar olarak listeler; böylece bir ayar orada da bulunabilir ve denetlenebilir.</p>';
$ec_lang['lpn_guide_set_search_term']='Arama';
$ec_lang['lpn_guide_set_search_def']='<p>Ayarlarda ara alanına bir veya daha fazla sözcük yazarak yalnızca hepsinden adında veya ipucunda söz eden ayarları listeleyin. Bir başlıkla eşleşen sözcük, o başlık altındaki her ayarı gösterir. Örneğin opaklık, Simge opaklığı (0 ile 1) ve Arka plan görüntüsü opaklığı (0 ile 1) ayarlarını listeler; opaklık simge yalnızca birincisini listeler; ve yağmurlama, ipucunda yağmurlamadan söz eden ancak adında etmeyen Damlatıcı üssünü listeler. Arama hiçbir ayarı değiştirmez.</p>';
$ec_lang['lpn_guide_set_scn_term']='Bir senaryoda ayarlar';
$ec_lang['lpn_guide_set_scn_def']='<p>Temel dışındaki bir senaryoda, senaryoların değiştirebildiği bir ayar için yazılan değer bir senaryo değeri olarak saklanır ve satır dolu bir noktayla işaretlenir. Bir üçgen, açık olanın altındaki senaryoların değiştirdiği bir ayarı işaretler. Hangi ayarların değiştirilebildiği Senaryo yöneticisi girdisinde listelenir. Birimler her senaryoda aynıdır. Varsayılanları geri yükle Temel dışında soluktur ve Yeni varlık değerlerini her mevcut varlığa uygula orada reddedilir, çünkü çizimin kendisini değiştirir.</p>';
$ec_lang['lpn_guide_set_units_term']='Bir birimi değiştirme';
$ec_lang['lpn_guide_set_units_def']='<p>Her büyüklüğün Birimlerde kendi birimi vardır. Projedeki değerler o birimde girilmişse birimi değiştirmek önce bir soru sorar. Yıkıcı olmayan, her sayıyı yazıldığı gibi tutar ve yeni birimde okur. Yıkıcı, sayıları dönüştürerek yeniden yazar; böylece şebeke fiziksel olarak aynı kalır ve Geri al kullanılmadıkça özgün sayılar kaybolur; tek bir Geri al sayıları ve birimi geri yükler. İptal her şeyi olduğu gibi bırakır.</p><p>Net1 üzerinde örnek: Birimlerde Çap için mm seçin. Yıkıcı 13 değeri yeniden yazar ve Boru 10 457,2 mm okur. Yıkıcı olmayan 13 değere dokunmaz ve Boru 10 18 mm okur.</p>';
$ec_lang['lpn_guide_set_assets_term']='Yeni varlıklar ve değerleri mevcut olanlara uygulama';
$ec_lang['lpn_guide_set_assets_def']='<p>ID önekleri ve Değerler, bundan sonra çizilecek varlıklar içindir. Zaten çizilmiş varlıkları değiştirmezler. Bir ID önekinin yanındaki Tümüne uygula, o türden her mevcut varlığa öneğiyle başlayan bir ID verir; her biri numarasını korur ve bir sayıyla bitmeyen bir ID değişmez. Yeni varlık değerlerini her mevcut varlığa uygula, bir sorudan sonra bu özellikleri her mevcut varlıkta değiştirir, ancak yalnızca etiketleri haritada gösterilen özellikler için. Geri al bunu geri alır.</p>';
$ec_lang['lpn_guide_set_reset_term']='Varsayılanları geri yükle ve Yeniden başlayın';
$ec_lang['lpn_guide_set_reset_def']='<p>Varsayılanları geri yükle önce sorar ve sonra açık projenin ID öneklerini, yeni varlık değerlerini, çözücü ayarlarını, harita görünümünü, gösterge konumunu ve görünür etiketlerini özgün değerlerine döndürür. Şebeke değişmez, diğer projeler etkilenmez ve tek bir Geri al ayarları geri koyar.</p><p>Yeniden başlayın önce sorar ve sonra bu tarayıcıda kaydedilen her projeyi, her arka plan görüntüsünü, tüm ayarları ve birim seçimlerini siler ve sayfayı yeni bir ziyaretçinin göreceği gibi yeniden yükler. Geri alınamaz.</p>';
// The Toolbar chapter (Task 785), terms in the Toolbar section above its rows. Held by
// dev/lpn-spike/user-guide-toolbar-harness.js.
$ec_lang['lpn_guide_tb_row_term']='Bir satırı okuma';
$ec_lang['lpn_guide_tb_row_def']='<p>Her satır, şeridin sırasıyla bir araç çubuğu düğmesidir ve gruplar arasında bir çizgi bulunur. Bir satır düğmenin simgesini, adını ve ipucunu, sonra tuşlarını gösterir. Bir menü satırı aynı şeyi yapıyorsa satır ayrıca menü yolunu, arkasından içinde ayrıca sözleriyle gösterir. Bir satıra tıklamak araç çubuğundaki düğmeyi işaret eder. Düğmeyi asla çalıştırmaz. Düğme ekranda değilse satır, aynı şeyi yapan menü satırını açar.</p>';
$ec_lang['lpn_guide_tb_dim_term']='Soluk adlar';
$ec_lang['lpn_guide_tb_dim_def']='<p>Soluk bir ad, şu anda ekranda olmayan bir düğmeye aittir. Ekranda olan bir düğme, o anda işlem yapıp yapamamasına bakılmaksızın soluk değildir. Hesapla, Otomatik olarak yeniden hesapla işaretliyken soluktur, çünkü düğme yalnızca o ayarın işareti kaldırıldığında görünür.</p><p>Dik modda bir telefonda araç çubuğunda yalnızca beş çalıştırma denetimi kalır. Diğer her ad soludur ve birine tıklamak aynı şeyi yapan menü satırını açar. Alt panel düğmesinin menü satırı yoktur; bu yüzden satırı yalnızca denetimin ekranda olmadığını söyleyebilir.</p>';
$ec_lang['lpn_guide_tb_two_term']='Köşesinde üçgen bulunan düğmeler';
$ec_lang['lpn_guide_tb_two_def']='<p>Tümünü göster ve Pencere seç düğmelerinin sağ alt köşesinde küçük bir üçgen vardır. Arada hiçbir şeye basmadan düğmeye ikinci kez basmak onu değiştirir: Tümünü göster, Pencere Yakınlaştır olur ve Pencere seç pencere, kement ve çokgen biçimleri arasında döner. Tümünü göster düğmesinin köşesine tıklamak, görünümü sığdırmadan hemen Pencere Yakınlaştır\'a girer.</p>';
// The Menus chapter (Task 785), two terms after the ruled keys table. Held by dev/lpn-spike/user-guide-menus-harness.js.
$ec_lang['lpn_guide_mn_list_term']='Menü listesini okuma';
$ec_lang['lpn_guide_mn_list_def']='<p>Liste menülerin kendilerinden çizilir: Dosya, Düzen, Harita, Su ve Yardım, her biri kendi başlığı altında, bir alt menünün satırları onu açan satırın altında girintili ve gruplar arasında bir çizgiyle. Şu anda gizli olan satırları, bir menü içindeki başlıkları ve senaryo adları gibi projeden veya tarayıcıdan adlandırılan satırları dışarıda bırakır. Bir alt menü derinliğe kadar gider ve Dil menüsü için girdisi yoktur. Şu anda devre dışı olan bir satır yine de listelenir ve devre dışı olduğunu gösteren bir işaret taşımaz. Bir satıra tıklamak, o satır işaretlenmiş olarak menüyü ve alt menüyü açar. Satırı asla çalıştırmaz.</p>';
$ec_lang['lpn_guide_mn_kbd_term']='Klavyeden menüler';
$ec_lang['lpn_guide_mn_kbd_def']='<p>Alt+Shift\'ten sonraki harfler her klavye düzeninde ve her dilde sabit konumlardaki tuşlardır: Dosya için F, Düzen için E, Harita için M, Su için W, Yardım için H ve Dil için L. F10\'dan sonra bir menünün harfi tek başına onu açar ve menü çubuğunda Esc odağı önceki yerine döndürür.</p><p>Yalnızca bir işaretçinin kullanabildiği satırların harfi yoktur ve ok tuşları onları atlar. Bunlar arasında Kırılma noktaları, üç alan seçimi, Ekle araçları, Pencere Yakınlaştır ve Ekran görüntüsü vardır.</p>';
// The Map chapter (Task 785): terms after the ruled keys table. Held by dev/lpn-spike/user-guide-map-harness.js.
$ec_lang['lpn_guide_map_undo_term']='Geri al ve Yinele';
$ec_lang['lpn_guide_map_undo_def']='<p>Ctrl+Z son değişikliği geri alır; Ctrl+Y veya Ctrl+Shift+Z yineler. Bir Tablolar hücresinde tuşlar, hücre yalnızca seçiliyken projeye, yazmaya başlandıktan sonra hücrenin metnine aittir. Sayfa son 20 adımı yalnızca bellekte tutar ve projeleri değiştirmek bunları temizler. Bir adım, çizimle birlikte senaryoları, açık senaryoyu ve birimleri geri yükler.</p>';
$ec_lang['lpn_guide_map_del_term']='Sil';
$ec_lang['lpn_guide_map_del_def']='<p>Sil veya Backspace seçimi siler; tuşun alana ait olduğu bir alanda yazarken hariç. Hiçbir şey seçili değilken Sil bunu söyler ve Backspace hiçbir şey yapmaz. Tek bir Geri al, birkaç varlığın silinmesini geri alır. Temel dışındaki bir senaryoda Sil, Temelde bulunan bir varlığı kaldırmaz; Senaryo yöneticisi girdisi ne yaptığını açıklar.</p>';
$ec_lang['lpn_guide_map_esc_term']='Esc';
$ec_lang['lpn_guide_map_esc_def']='<p>Bir menüyü, bir açılır listeyi veya bir kutuyu kapatan Esc başka bir şey yapmaz. Özellikler, Ayarlar ve Kitaplıklar kutuları yalnızca odak kutudayken ve işaretçi üzerindeyken kapanır. Bunların hiçbiri açık değilken Esc etkin aracı Seç\'e döndürür ve Seç\'te seçimi temizler. Yarım çizilmiş bir boruyu vazgeçmek için bir Esc, Seç\'e dönmek için ikinci bir Esc gerekir. Bir alanda Esc alana aittir.</p>';
$ec_lang['lpn_guide_map_letters_term']='Harfler, rakamlar ve yakınlaştırma tuşları';
$ec_lang['lpn_guide_map_letters_def']='<p>W Pencere Yakınlaştır\'ı başlatır, A bir alan seçmeyi başlatır (A\'ya yeniden basmak pencere, kement ve çokgen arasında döndürür) ve F bir Figür çizer. Artı veya eşittir tuşu bir tekerlek adımı kadar yakınlaştırır, eksi tuşu uzaklaştırır. Bu tuşlar ve 0 ile 9 rakamları, başka bir tuş onları Ctrl+C gibi bir kısayol yaptığında haritada hiçbir şey yapmaz, bir alanda yazarken hiçbir şey yapmaz ve açık bir menünün harflerini satırlarına bırakır. Seçili bir Tablolar hücresine yazılan rakam, bir araç seçmek yerine hücrenin üzerine yazar.</p>';
// The Tables chapter (Task 785): terms after the two ruled key tables. Held by dev/lpn-spike/user-guide-tables-harness.js.
$ec_lang['lpn_guide_tbl_tabs_term']='Sekmeler';
$ec_lang['lpn_guide_tbl_tabs_def']='<p>Paneli açmak için Alt panel düğmesine tıklayın veya Su, Tablolar öğesini seçin. Sekmeleri soldan sağa şunlardır: Düğümler, Rezervuarlar, Depolar, Borular, Pompalar, Vanalar, Metin, Müşteriler, Figürler, Ayarlar, Senaryolar, Zaman serisi, Profil, Frekans ve Debi dengesi. Senaryolar sekmesi Temel mod işareti kaldırıldığında gösterilir. Sütun genişliği, sırası ve görünürlüğü projede değil, bu tarayıcıda tutulur.</p>';
$ec_lang['lpn_guide_tbl_cell_term']='Bir hücreyi seçme, girme ve düzenleme';
$ec_lang['lpn_guide_tbl_cell_def']='<p>Bir hücre üç durumdan birindedir. Yalnızca seçiliyken ok tuşları hücreden hücreye geçer ve Ctrl+Z projenin Geri al komutudur. Seçili bir hücrenin üzerine bir karakter yazmak bir giriş başlatır: yazılan metin değerin yerini alır ve bir ok tuşu onu işler ve sonraki hücreye geçer. F2 veya çift tıklama hücreyi düzenlemek için açar: imleç değerin içindedir ve ok tuşları imleci hareket ettirir. Bir girişte ve bir düzenlemede Ctrl+Z yazmayı geri alır. Esc girişi veya düzenlemeyi iptal eder ve hücreyi seçili bırakır.</p>';
$ec_lang['lpn_guide_tbl_fill_term']='Doldurma, süzgeçler ve senaryolar';
$ec_lang['lpn_guide_tbl_fill_def']='<p>Ctrl+D seçili bir aralığı üst satırından aşağı doldurur ve Ctrl+Enter onu etkin hücrenin değeriyle doldurur. İkisi de ID sütununa ve salt okunur hücrelere dokunmaz ve bir bildirim kaç hücrenin doldurulduğunu ve kaçının değiştirilmediğini bildirir. Ctrl+Shift+L yalnızca haritada seçili varlıkları gösterir. Bir süzgeç açıkken Ctrl+A ve Ctrl+D yalnızca gösterilen satırlarda işlem yapar ve artık eşleşmeyecek biçimde düzenlenen bir satır, süzgeç yeniden uygulanana kadar kalır.</p><p>Temel dışındaki bir senaryoda bir hücre düzenlemesi, Ctrl+D, Ctrl+Enter ve bir yapıştırma, açık senaryonun senaryo değerleri olarak saklanır.</p>';
// The Boxes chapter (Task 785): terms after Tom's two paragraphs. Held by dev/lpn-spike/user-guide-boxes-harness.js.
$ec_lang['lpn_guide_bx_dock_term']='Yerleştirme ve sekmeler';
$ec_lang['lpn_guide_bx_dock_def']='<p>Bir kutunun başlık çubuğunun köşesinde Haritanın soluna yerleştir, Haritanın sağına yerleştir ve Yüzdür ile, kutu yerleştirildikten sonra, Otomatik gizle bulunur. Yerleştirilmiş bir kutu haritanın yanında bir sütundur. Otomatik gizle ile haritanın kenarındaki dar bir şeritte bir sekmedir. Sekme, bir fareyle veya kalemle 150 ms sonra üzerine gelindiğinde ya da tıklanınca veya dokunulunca kutuyu açar ve kutu yukarıda açıklandığı gibi sekmesine geri çekilir. Çekilmiş bir kutu hâlâ açıktır. Onu açan bir menü satırı veya araç çubuğu düğmesi kutuyu sekmesinden çıkarır.</p><p>Yerleştirilmiş bir kutuyu başlık çubuğundan sürüklemek onu yüzdürür ve otomatik gizlemeyi kapatır. Bir kenara yerleştirilmiş kutular tek bir genişliği paylaşır ve harita en az 320 px korur. Sekmeler sürüklenerek veya odaktaki bir sekmede Alt+Yukarı ya da Alt+Aşağı tuşlarına basılarak yeniden sıralanır.</p>';
$ec_lang['lpn_guide_bx_keep_term']='Bir kutunun hatırladıkları';
$ec_lang['lpn_guide_bx_keep_def']='<p>Her kutu bu tarayıcıda nerede yüzdüğünü, boyutunu, açık olup olmadığını, yerleştirildiği tarafı, otomatik gizlenip gizlenmediğini, yerleştirilmiş genişliğini ve sekmesinin yerini tutar. Özellikler, Kritiklik analizi, Talep ölçekleme ve Kalibrasyon yalnızca yerleştirildikleri tarafı, otomatik gizlemeyi, sekme yerini ve açık olup olmadıklarını tutar; yüzdükleri yer bir sayfa yüklemesi boyunca sürer. Kayıtlı düzeni olmayan bir tarayıcı bazı kutular sekme olarak yerleştirilmiş şekilde başlar ve bir kutu değiştirilene kadar hiçbir şey saklanmaz.</p>';
$ec_lang['lpn_guide_bx_phone_term']='Bir telefonda';
$ec_lang['lpn_guide_bx_phone_def']='<p>640 px veya daha darda hiçbir kutu yerleşmez ve her kutu pencereyi doldurur. Yerleştirme düğmeleri sunulmaz. Yerleştirilmiş bir düzen saklanır ve daha geniş bir pencerede geri gelir.</p>';
// The Fire flow analysis chapter (Task 785), in the entry for its box. Held by dev/lpn-spike/user-guide-fireflow-harness.js.
$ec_lang['lpn_guide_ff_asks_term']='Her düğümden ne istenir';
$ec_lang['lpn_guide_ff_asks_def']='<p>Sınanan her düğüm, şebekenin ekrandaki zaman adımında ve açık senaryodaki bir kopyası üzerinde iki sınav alır. Birincisi, düğümün kalıntı basıncı korurken ne kadar debi verebileceğini sorar. Düğümden bir debi çekilir ve tekrarlanan çözümler onu daraltır; üst sınır 10000 gpm\'e eşittir. Üst sınırda hâlâ kalıntı basıncı koruyan bir düğüm, üst sınırdan fazlasını verdiği şeklinde bildirilir. İkinci sınav, tasarım denetimi, düğümden gereken debiyi çeker ve kapsamındaki başka bir düğümün Başka yerde izin verilen en düşük basıncın altına düşüp düşmediğini ya da kapsamındaki herhangi bir borunun İzin verilen en yüksek hızın üstünde çalışıp çalışmadığını sorar. Kapsamı Yok olduğunda tasarım denetimi yapılmaz.</p><p>Kendi Gereken yangın debisi özelliği olan bir düğüm bu değere göre, diğer her düğüm ise kutudaki değere göre sınanır.</p>';
$ec_lang['lpn_guide_ff_result_term']='Sonuçları okuma';
$ec_lang['lpn_guide_ff_result_def']='<p>Özet, tüm denetimleri geçen düğümleri, yangın debisinde başarısız olan düğümleri ve sistemin geri kalanını etkileyen düğümleri sayar. Tablo, sınanan her düğüm için şunları listeler: herhangi bir yangın debisi çekilmeden önceki Statik basınç, Gereken debi, Gereken debideki basınç, Mevcut debi, Korunan kalıntı, tasarım denetiminin En kötü etkisi ve Tasarım sınırı, tüm şebekenin çözüm sayısı olan Çalıştırma sayısı ve Başarısızlık türleri. Sayısı olmayan bir hücre asla sıfır değil, tire gösterir. Çözülemeyen bir düğüm, sayıların yerinde nedenini gösterir. Tablo en fazla 200 düğüm yazdırır ve kaçını yazdırmadığını bildirir.</p>';
$ec_lang['lpn_guide_ff_marks_term']='Halkalar, Durdur ve aynı anda tek bir analiz';
$ec_lang['lpn_guide_ff_marks_def']='<p>Bir çalıştırmadan sonra, sınanan her düğümün çemberi haritada sonucuna göre dış çizgiyle çevrilir ve çizgiler renkte olduğu kadar kesik deseninde de farklıdır. Yalnızca haritada seçili düğümleri sınamak için Seçili düğümler\'i seçin; seçili olan başka her şey sayılır ve sınanmaz. Durdur bir çalıştırmayı bitirir ve tamamlanmış düğümleri korur. Yangın debisi, kritiklik ve talep ölçekleme analizlerinden yalnızca biri aynı anda çalışır.</p>';
$ec_lang['lpn_guide_ff_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_ff_example_def']='<p>Net1 örneğini açın, Su, Analiz, Yangın debisi analizi… öğesini seçin ve kutu açıldığı gibi Çalıştır\'a tıklayın. Zaman adımı 0:00\'dır ve çalıştırma tüm şebekeyi 135 kez çözer. Dokuz düğümün sekizi tüm denetimleri geçer. N32 düğümü yangın debisinde başarısız olur: statik basıncı 111 psi\'dir, gereken 1000 gpm\'de yalnızca 1,19 psi kalır ve mevcut debisi 892 gpm\'dir. N31 düğümü 1339 gpm verebilir, N12 düğümü ise 10000 gpm\'den fazla.</p>';
// The Criticality analysis chapter (Task 785). Held by dev/lpn-spike/user-guide-criticality-harness.js.
$ec_lang['lpn_guide_cr_case_term']='Her durumun yaptığı';
$ec_lang['lpn_guide_cr_case_def']='<p>Kapsamdaki her hat için hat, şebekenin bir kopyasında etkin olmayan hale getirilir ve kopya, ekrandaki zaman adımında ve açık senaryoda çözülür. Bir çalıştırma, her hat için bir çözüm ve hiçbir şey bozulmadan bir çözüm daha demektir. Bir rezervuara veya depoya açık yolu kalmayan bir düğüm ayrılmıştır: çözümden önce kaldırılır ve talebi Karşılanmayan talep olarak sayılır. Hâlâ bağlı olan düğümlerden, Asgarinin altındaki düğümler basıncı İzin verilen en düşük basıncın altına düşenleri listeler. Hiçbir şey bozulmadan zaten onun altında olan bir düğüm hiçbir hat aleyhine sayılmaz ve özet kaç tane olduğunu bildirir. İzin verilen en düşük basınç, Yangın debisi analizinin Başka yerde izin verilen en düşük basınç kutusuyla aynı ayardır.</p>';
$ec_lang['lpn_guide_cr_dead_term']='Çıkmaz uçlar ve liste';
$ec_lang['lpn_guide_cr_dead_def']='<p>Çıkmaz uçlu hat, kaldırılması yalnızca ondan geçilerek ulaşılabilen düğümleri ayıran hattır. Ötesindeki her şey onun kaybıdır; bu yüzden Çıkmaz uçları atla işaretliyken hat çözülmez ve özet kaçının atlandığını bildirir. Liste her hat için Karşılanmayan talebi, Ayrılan düğümleri ve Asgarinin altındaki düğümleri, her biri sayı ve ilk beş ID ile gösterir ve bir ID\'ye tıklamak haritada ona gider. Sistemin bir şeye mal olduğu hatlar, bir sütun başlığına tıklanıp sıralanana kadar ilk sırada listelenir ve özet onları sınanan hat sayısına göre sayar. Yalnızca haritada seçili hatları bozmak için Seçili hatlar\'ı seçin.</p>';
$ec_lang['lpn_guide_cr_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_cr_example_def']='<p>Net1 örneğini açın, Su, Analiz, Kritiklik analizi… öğesini seçin, İzin verilen en düşük basınç için 116 girin ve Çalıştır\'a tıklayın. Zaman adımı 0:00\'dır ve çalıştırma tüm şebekeyi 14 kez çözer. 13 hattan dördü devre dışıyken bir düğümü 116 psi\'nin altına düşürür: L9 (N10, N11 ve N21), L10 (N11 ve N21), L111 (N21 ve N22) ve L112 (N21 ve N22). İki düğüm hiçbir şey bozulmadan zaten 116 psi\'nin altındadır ve sayılmaz. Net1 halkalı olduğu için bir hattı kaybetmek hiçbir düğümü susuz bırakmaz.</p>';
// The Demand scaling chapter (Task 785). Held by dev/lpn-spike/user-guide-demandscale-harness.js.
$ec_lang['lpn_guide_ds_run_term']='Çalıştır';
$ec_lang['lpn_guide_ds_run_def']='<p>Çalıştır, seçilen düğümlerdeki talepleri, şebekenin ekrandaki zaman adımındaki ve açık senaryodaki bir kopyası üzerinde, Talep ölçeğiyle çarpar. İki çözüm yapar: biri talepler olduğu gibi, biri ölçeklenmiş. Sonuç, haritanın gösterdiği değer olan Ölçeksiz değerin yanında Ölçekli değerle birlikte En düşük basınçları ve En yüksek hızları listeler. Her liste on satır tutar ve kutu kaç hattı göstermediğini bildirir. Talep ölçeği, açık senaryonun talep çarpanına ek olarak uygulanır ve asla projeye kaydedilmez.</p>';
$ec_lang['lpn_guide_ds_find_term']='Bul';
$ec_lang['lpn_guide_ds_find_def']='<p>Bul, 0\'dan 20\'ye kadar talep ölçeklerini 0,01\'e yakın aralıkla arar ve seçilen her düğümün en az İzin verilen en düşük basıncı koruduğu en büyük ölçeği bulur. Ölçeği ve oradaki en düşük basıncı, ve basıncın ilk kez sınırın altına düştüğü bir sonraki adım için aynısını bildirir. Girildiği gibi talepler zaten bir düğümü sınırın altında bırakıyorsa yanıt bir uyarı işaretiyle işaretlenir. 20\'de her düğüm sınırı koruyorsa yanıt bunu söyler. Durdur bir aramayı yanıt vermeden bitirir. İzin verilen en düşük basınç, Yangın debisi analizinin Başka yerde izin verilen en düşük basınç kutusuyla aynı ayardır.</p>';
$ec_lang['lpn_guide_ds_scope_term']='Düğümler ve zaman adımı';
$ec_lang['lpn_guide_ds_scope_def']='<p>Seçili düğümler ile yalnızca haritada seçili düğümler ölçeklenir ve denetlenir. Diğer düğümler olduğu gibi bırakılır ve sınırın altına düşenler yanıtı sınırlamadan listelenir. Yalnızca ekrandaki zaman adımı ölçeklenir ve seviyeler ile durumlar ondan alınır. Pik değeri sınamak için çalıştırmadan önce saati pik talebe getirin.</p>';
$ec_lang['lpn_guide_ds_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_ds_example_def']='<p>Net1 örneğini açın ve Su, Analiz, Talep ölçekleme… öğesini seçin. 0:00 zaman adımında, kutu açıldığı gibi Bul\'a tıklayın. Her düğüm, en düşük basıncın N32 düğümünde 20,11 psi olduğu 5,76 talep ölçeğine kadar en az 20 psi korur. 5,77\'de 19,8 psi\'dir ve arama 13 çözüm aldı. Talep ölçeği için 3 girin ve Çalıştır\'a tıklayın: N32 düğümü ölçeksiz 111 psi\'den 85,99 psi\'ye düşer ve L112 hattı 0,535 ft/sn\'den 3,13 ft/sn\'ye çıkar.</p>';
// The Pump energy chapter (Task 785). Held by dev/lpn-spike/user-guide-energy-harness.js.
$ec_lang['lpn_guide_en_read_term']='Raporu okuma';
$ec_lang['lpn_guide_en_read_def']='<p>Su, Raporlar, Pompa enerjisi öğesini seçin. Rapor, her pompanın gücünü son uzun süreli benzetim boyunca integre eder; bu yüzden 0\'dan büyük bir Toplam çalışma süresi ve bir hesaplama gerektirir. Her pompa için Çalışma %\'sini, Verimi, Ort. kW\'ı, Tepe kW\'ı, kWh\'yi ve Maliyeti listeler. Ort. kW, boşta kalınan dönemler üzerinden değil, pompa çalışırken ortalamadır. Tablonun altında Kullanılan enerji, Enerji maliyeti, Tepe güç kullanımı, Tepe talep maliyeti ve Toplam maliyet bulunur. Pompası olmayan bir şebekede raporlanacak bir şey yoktur.</p>';
$ec_lang['lpn_guide_en_set_term']='Sayıları belirleyen';
$ec_lang['lpn_guide_en_set_def']='<p>Ayarlar, Enerji; verim eğrisi olmayan her pompa için kullanılan Pompa verimi (yüzde), bir kilovatsaat için Enerji fiyatı, fiyatı her desen adımında çarpan bir Fiyat deseni, kW başına Tepe talep ücreti ve maliyetlerin yanında yazdırılan, maliyetleri dönüştürmeyen bir Para birimi metni tutar. Bir pompanın Özelliklerde kendi fiyatı, fiyat deseni ve verim eğrisi olabilir. Fiyatlar, desen, tepe talep ücreti, Pompa verimi (yüzde) ve bir pompanın kendi değerleri Enerji maliyeti kategorisindedir; bu yüzden bir senaryo onları değiştirebilir. Hiçbir fiyat belirtilmediğinde veya fiyat sıfır olduğunda her maliyet sıfırdır ve rapor bunu söyler. Uygulama hiçbir fiyat önermez.</p>';
$ec_lang['lpn_guide_en_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_en_example_def']='<p>Toplam çalışma süresi 24:00 olan Net1 örneğini açın ve hesaplayın. Su, Raporlar, Pompa enerjisi öğesini seçin. Pompa L9 çalışmanın %65,71\'inde %75 verimle çalışır ve ortalama 96,22 kW, tepede 96,71 kW ve 1518 kWh kullanır. Hiçbir fiyat belirtilmediği için maliyet 0\'dır ve rapor bunu söyler. Ayarlar, Enerji içinde Enerji fiyatı için 0,12 girin ve yeniden hesaplayın: L9\'un maliyeti 182\'dir, Toplam maliyet.</p>';
// The Contour plot chapter (Task 785). Held by dev/lpn-spike/user-guide-contour-harness.js.
$ec_lang['lpn_guide_ct_what_term']='Grafik nedir';
$ec_lang['lpn_guide_ct_what_def']='<p>Su, Grafikler, Eş eğri öğesini seçin. Satır grafiği açık senaryoda, düğümler henüz renklendirilmemişse basıncı kullanarak, etiketli çizgilerle yumuşak bir dolgu olarak açar ve kutuyu açar. Grafik düğüm renklerini borular boyunca ve yanlarında ortanca boru uzunluğunun belirli bir katına kadar yayar; dış kısımda soluklaşır. Pompaların, vanaların veya kapalı hatların üzerinden renklendirmez. Renk anahtarının altındaki satır, grafiğin kaç düğüm ve boru kullandığını, boruların yanındaki erişimi ve çizgilerin aralığını bildirir. Çok az düğümle bunu söyler.</p>';
$ec_lang['lpn_guide_ct_box_term']='Kutu';
$ec_lang['lpn_guide_ct_box_def']='<p>Eş eğrileri göster, işareti kaldırıldığında dolguyu ve çizgileri gizler ve düğüm renklerini korur. Kutuda ayrıca Ayarlar, Görselleştirme, Düğüm renkleri içindeki aynı iki ayar olan Düğümleri şuna göre renklendir ve Renk düzeni, Dolgu (Yok, Yumuşak veya her sınıfı düz boyayan Bantlar), Dolgu opaklığı, Aralığı ve Etiketleri olan Eş eğri çizgileri ve ortanca boru uzunluğunun katı olarak Tampon bulunur. Dünya üzerine yerleştirilmiş bir projede kutu, ziyaretçi şebekenin alanının karo numaralarını göndermeyi kabul ettikten sonra düğümler arasındaki zemini Mapbox DEM\'den de alabilir. Bu ayarlar projeyle birlikte kaydedilir ve bir senaryo tarafından değiştirilebilir. Grafik yalnızca görüntüyü değiştirir, şebekeyi değiştirmez.</p>';
$ec_lang['lpn_guide_ct_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_ct_example_def']='<p>Net1 örneğini açın ve Su, Grafikler, Eş eğri öğesini seçin. Düğümler basınca göre renklendirilir ve renk anahtarının altındaki satır 9 düğümü, 11 boruyu, yanlarında ortanca boru uzunluğunun 2,5 katı erişimi ve her 5 psi\'de çizgileri bildirir. Pompa, Hat 9, 11 borudan biri değildir. Eş eğrileri göster işareti kaldırıldığında düğümler basınca göre renkli kalır.</p>';
// The Run report, Status changes, and Full report chapters (Task 785). Held by dev/lpn-spike/user-guide-reports-harness.js.
$ec_lang['lpn_guide_rr_what_term']='Raporun içeriği';
$ec_lang['lpn_guide_rr_what_def']='<p>Su, Raporlar, Çalıştırma öğesini seçin. Rapor, EPANET motorunun son uzun süreli benzetim için yazdığı metindir; sayfalara bölünmüştür. Başlık ve şebeke adıyla başlar, sonra düğümleri, rezervuarları, depoları, boruları, pompaları ve vanaları sayar, sonra analiz seçeneklerini bildirir ve sonra çalıştırmanın hidrolik durumunu uyarılarıyla birlikte listeler. Kopyala düğmesi metni kopyalar.</p>';
$ec_lang['lpn_guide_rr_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_rr_example_def']='<p>Zaten hesaplanmış olan Net1 örneğini açın ve Su, Raporlar, Çalıştırma öğesini seçin. Özet 9 düğümü, 1 rezervuarı, 1 depoyu, 12 boruyu, 1 pompayı ve 0 vanayı sayar. Yük kaybı formülü Hazen-Williams\'tır, hidrolik zaman adımı 1,00 saattir ve toplam süre 24,00 saattir.</p>';
$ec_lang['lpn_guide_st_what_term']='Neler listelenir';
$ec_lang['lpn_guide_st_what_def']='<p>Su, Raporlar, Durum değişiklikleri öğesini seçin. Her satır bir değişikliğin zamanını ve değişikliği verir: artık açık veya artık kapalı olan bir pompa, vana ya da boru ya da artık dolan, boşalan, dolu veya boş olan bir depo. Tam olarak yakınsamayan bir zaman adımı da listelenir. Liste zaman sırasındadır ve her adımı değil yalnızca değişiklikleri tutar. Tablolar paneli ve Tam rapor ile aynı uzun süreli çalıştırmadan okunur.</p>';
$ec_lang['lpn_guide_st_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_st_example_def']='<p>Net1 örneğini açın ve Su, Raporlar, Durum değişiklikleri öğesini seçin. N2 deposu 1:00\'de dolmakta, 11:00\'de boşalmakta, 16:00\'da dolmakta ve 22:00\'de boşalmaktadır. L9 pompası 10:00\'da kapalı, 15:00\'te açık ve 21:00\'de kapalıdır.</p>';
$ec_lang['lpn_guide_fr_what_term']='Tablonun içeriği';
$ec_lang['lpn_guide_fr_what_def']='<p>Su, Raporlar, Tam öğesini seçin. Tablo, Tablolar panelinin birimlerinde, her raporlama zaman adımında her düğüm ve hat için bir satıra sahiptir. Sütunları Tür, ID, Talep, Yük, Basınç, Klor derişimi, Debi, Hız, Yük kaybı, Pompa yükü ve Durum\'dur ve varlığın böyle bir büyüklüğü olmayan yerde hücre boştur. Zaman adımı listesi gösterilen adımı seçer; CSV indir ve Raporu yazdır her adımı taşır. Uzun süreli benzetim olmadan tablo, geçerli çözümü tek bir anda gösterir.</p>';
$ec_lang['lpn_guide_fr_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_fr_example_def']='<p>Net1 örneğini açın ve Su, Raporlar, Tam öğesini seçin. 24 varlık, 0:00\'dan 24:00\'a 25 raporlama adımında listelenir; bu 600 satırdır. 0:00\'da 11 düğümünün talebi 150 gpm, yükü 985,23 ft H2O ve basıncı 119,26 psi\'dir.</p>';
// The Calibration chapter (Task 785). Held by dev/lpn-spike/user-guide-calibration-harness.js.
$ec_lang['lpn_guide_cal_what_term']='Raporun karşılaştırdığı';
$ec_lang['lpn_guide_cal_what_def']='<p>Su, Raporlar, Kalibrasyon öğesini seçin. Parametre listesi dosyanın neyi ölçtüğünü seçer: Talep, Yük, Basınç, Klor derişimi, Debi veya Hız. Her parametre için bir dosya tutulur ve Kalibrasyon dosyası yükle… düğmesi bir dosya seçici açar. Rapor üç sayfalıdır. İstatistikler her konum için gözlem sayısını, gözlenen ortalamayı, hesaplanan ortalamayı, ortalama hatayı ve RMS hatayı, sonra tüm konumlar için birlikte bir Şebeke satırını ve ortalamalar arasındaki korelasyonu verir. Korelasyon grafiği her ölçümü yatayda gözlenen değeri ve dikeyde hesaplanan değeri olacak şekilde koyar; ikisinin uyuştuğu yerde bir köşegen çizgi vardır. Ortalama karşılaştırmaları gözlenen ve hesaplanan ortalamaları her konum için bir çift çubuk olarak çizer.</p><p>Hesaplanan değer uzun süreli çalıştırmadan okunur ve iki raporlama adımı arasındaki bir ölçüm, aralarında enterpole edilen değerle karşılaştırılır. Çalıştırmanın raporladığı zamanların dışındaki bir ölçüm atlanır ve sayılır. Tek anlık bir çözümde, dosyanın verdiği zaman ne olursa olsun, her ölçüm o tek sonuçla karşılaştırılır. Rapor, şebeke hesaplandıktan sonra dolar.</p>';
$ec_lang['lpn_guide_cal_file_term']='Kalibrasyon dosyası';
$ec_lang['lpn_guide_cal_file_def']='<p>Her satırda bir konum ID\'si, bir zaman ve bir ölçülen değer bulunan bir metin dosyası. Zaman, benzetimin başından itibaren ondalık saat veya saat:dakika olarak ölçülür. Noktalı virgül bir yorum başlatır. Yalnızca bir zaman ve bir değer içeren satır, üstündeki konuma aittir. Değerler projenin birimlerinde okunur ve rapor hangi birim olduğunu söyler. Şebekede olmayan bir konum listelenir ve ölçümleri atlanmış sayılır, okunamayan bir satır satır numarasıyla listelenir ve dosyanın geri kalanı kullanılır. Bir dosya yalnızca açık proje ve bu sayfa yüklemesi için bellekte tutulur. Projeyle birlikte veya bu cihazda kaydedilmez. Zaman serisi grafiği aynı büyüklüğü gösterdiğinde ölçülen değerler üzerinde halkalar olarak çizilir.</p>';
$ec_lang['lpn_guide_cal_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_cal_example_def']='<p>Net1 örneğini açın, hesaplayın ve Su, Raporlar, Kalibrasyon öğesini seçin. Basınç seçiliyken, 11 düğümünü 0:00\'da 118,5 psi ve 12:00\'de 121,0 psi, 31 düğümünü 6:00\'da 110,2 psi ve 18:00\'de 108,7 psi, 99 düğümünü 0:00\'da 50 psi olarak veren ve ardından veri olmayan bir satır içeren bir dosya yükleyin. Rapor, dosyada 3 konumda 5 ölçüm olduğunu söyler, 99 düğümünü şebekede olmayan ve 1 ölçümü atlanmış olarak adlandırır ve okunamayan satırı listeler. İstatistikler, 11 düğümünü 2 gözlem, 119,75 psi gözlenen ortalama, 116,53 psi hesaplanan ortalama, 3,98 ortalama hata ve 5,12 RMS hata ile gösterir. 31 düğümü 109,45, 118,71, 9,26 ve 9,79 değerlerine sahiptir. Şebeke satırı 4 gözlem, 6,62 ortalama hata ve 7,81 RMS hata içerir.</p>';
// Where the Guide lists its own keys, so that a search for one finds it.
$ec_lang['lpn_guide_using_heading']='Kılavuzu kullanma';
$ec_lang['lpn_guide_keys_term']='Kılavuz klavye kısayolları';
$ec_lang['lpn_guide_keys_def']='<table class="lpn-notes-table"><tbody><tr><td>?</td><td>Kılavuzu, işaretçinin altındaki veya odağı olan araç çubuğu düğmesinde ya da menü satırında açar. Başka yerde arama alanı seçili olarak açar. Tuş, bir alana yazılırken veya bir soru açıkken açmaz.</td></tr><tr><td>F1</td><td>Kılavuzu, odağı olan kutunun girdisinde açar.</td></tr><tr><td>Ctrl+K</td><td>Kılavuzu arama alanı seçili olarak ve içinde seçili metin (en fazla 80 karakter) varsa onunla açar. Bir soru açıkken, kılavuz açılmaz; bunun dışında tarayıcının kendi Ctrl+K komutunun yerini alır.</td></tr><tr><td>/</td><td>Kılavuzda odak varken arama alanını seçer.</td></tr><tr><td>Esc</td><td>Kılavuzda odak varken onu kapatır ve odağı önceki yerine döndürür.</td></tr></tbody></table>';
$ec_lang['lpn_guide_use_term']='Arama, bağlantılar ve hatırlananlar';
$ec_lang['lpn_guide_use_def']='<p>Arama büyük harfleri ve aksanları yok sayar ve yazılan metni içeren satırları ve girdileri listeler. Bir satırı seçmek o denetimin nerede olduğunu gösterir. Denetimi asla çalıştırmaz. Araç çubuğunun katlandığı bir telefonda, bir araç çubuğu satırı aynı şeyi yapan menü satırını açar.</p><p>Sayfanın adresi, okunan girdiyi izler; <code>Looped-Network.php#guide</code> gibi, böylece o girdiye bir bağlantı olarak kopyalanabilir. Kılavuzu kapatmak onu temizler. Kılavuz, bu tarayıcıda açık olup olmadığını, konumunu ve boyutunu ve içindekiler listesinin gizli olup olmadığını hatırlar. Bir telefonda içindekiler listesi gizli başlar.</p>';
// Under a toolbar button in the User guide, naming the menu row that does the same thing.
// {menu} becomes a path such as "Edit > Delete", drawn with chevrons; keep {menu} as it is.
$ec_lang['lpn_guide_also']='{menu} içinde ayrıca';
$ec_lang['lpn_guide_how_popup']='Bir varlık veya metin seçtiğinizde Özellikler açılır.';
$ec_lang['lpn_guide_not_shown']='Bu denetim şu anda ekranda değil.';
// The box's two context headings. "Tables" holds the two table-help entries that used to sit only
// in the Notes list (lpn_notes_6/7, moved rather than duplicated); "Map" is new -- the digit tool
// keys, Undo and the zoom keys had never been gathered anywhere before.
$ec_lang['lpn_hotkeys_tables_heading']='Tablolar';
$ec_lang['lpn_hotkeys_map_heading']='Harita';
$ec_lang['lpn_hotkeys_map_term']='Harita klavye kısayolları';
// Same shape as lpn_notes_7_def: one table, one row per key. The ten digits are LPN_TOOL_KEYS in
// js/looped-network.js; Select also answers to Esc and Delete to the Delete key
// (LPN_TOOL_ALT_KEYS); Ctrl+Z is undo(); +/- and = are keyZoom() (ROADMAP Task 682).
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>0 veya Esc</td><td>Seçin.</td></tr><tr><td>2</td><td>Düğüm ekleyin.</td></tr><tr><td>3</td><td>Rezervuar ekleyin.</td></tr><tr><td>4</td><td>Depo ekleyin.</td></tr><tr><td>5</td><td>Boru ekleyin.</td></tr><tr><td>6</td><td>Pompa ekleyin.</td></tr><tr><td>7</td><td>Vana ekleyin.</td></tr><tr><td>8</td><td>Müşteri ekleyin.</td></tr><tr><td>9</td><td>Metin ekleyin.</td></tr><tr><td>Delete</td><td>Seçimi silin.</td></tr><tr><td>Ctrl+Z</td><td>Son değişikliği geri alın.</td></tr><tr><td>+ veya =</td><td>Yakınlaştırın.</td></tr><tr><td>-</td><td>Uzaklaştırın.</td></tr></tbody></table>';
// The W row of the Map table. Its own key, spliced into the table by Looped-Network.php, because a new row in
// lpn_hotkeys_map_def is new markup that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_zoomwin_def']='Pencere Yakınlaştır: o alana yakınlaştırmak için haritada bir dikdörtgen sürükleyin.';
// The menu chords (Task 748): Alt+Shift+letter on Windows and Linux, Ctrl+Option on a Mac, and F10.
// Exactly two rows (Tom, 2026-10-03: "show only the Alt+Shift and the F10"); the letters themselves
// are assigned per language by menuMnemonics() and shown on the menus, never listed here.
// A separate block rather than rows in lpn_hotkeys_map_def, because a new row there is new markup
// that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_menu_heading']='Menüler';
$ec_lang['lpn_hotkeys_menu_term']='Menü klavye kısayolları';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+harf</td><td>O harfle başlayan menüyü açın, sonra seçmek için bir satırın harfine basın. Klavyeyi kullandığınız sürece harfler görünür. Mac\'te Ctrl+Option kullanın.</td></tr><tr><td>F10</td><td>Menü çubuğuna gidin.</td></tr></tbody></table>';
// The Screenshot keys. A separate block, for the reason given above the menu block.
$ec_lang['lpn_hotkeys_snip_heading']='Ekran görüntüsü';
$ec_lang['lpn_hotkeys_snip_term']='Ekran görüntüsü klavye kısayolları';
$ec_lang['lpn_hotkeys_snip_def']='<table class="lpn-notes-table"><tbody><tr><td>S</td><td>Ekran görüntüsü açıkken kırp.</td></tr><tr><td>E</td><td>Silgi, işaretleme görünümünde.</td></tr><tr><td>Ctrl+Z, Ctrl+Y</td><td>İşaretleme görünümünde geri al ve yinele.</td></tr><tr><td>Esc</td><td>Bir kırpmayı iptal eder veya silgiden çıkar. İşaretleme görünümünde, hiçbir şey çizilmemişse görünümü kapatır.</td></tr></tbody></table>';
// ---- "Something wrong here?" (ROADMAP Tasks 207 and 768) ----
// Two sites, one behaviour -- a standing cell in the map's bottom strip, and the same control inside
// the solver's diagnostic box when one is on screen. The first click opens a box; Send is the second.
// The thank-you must never imply an answer: a reply comes only to somebody who left an address.
$ec_lang['lpn_wrong_btn']='Burada bir sorun mu var?';
// The standing message's own Hide control. A hidden message leaves the map and waits as the top row of the
// message history (the down-arrow glyph), marked by lpn_msglog_hidden, with lpn_msglog_unhide to bring it back.
$ec_lang['lpn_status_dismiss']='Bu mesajı gizle';
$ec_lang['lpn_msglog_hidden']='Gizli';
$ec_lang['lpn_msglog_unhide']='Göster';
$ec_lang['lpn_status_hidden_tip']='Gizlenen mesajı haritada yeniden göster.';
// Rewritten for the two-click box (Task 768); TGH's 2026-09-07 wording described one press.
$ec_lang['lpn_wrong_tip']='Bu sayfadaki bir hatayı bildirin. Bu, sorunu seçmek, bir yorum eklemek ve yanıt isteniyorsa bir e-posta adresi girmek için bir kutu açar. Tüm alanlar isteğe bağlıdır ve Gönder\'e basana kadar hiçbir şey gönderilmez.';
$ec_lang['lpn_wrong_thanks']='Teşekkürler. Bildiriminiz alındı.';
// The box "Something wrong here?" opens (ROADMAP Task 768). Every field is optional; Send with
// nothing in it posts only the anonymous tally the button always posted. The four picks are canned
// phrases a visitor may toggle in any combination. lpn_fb_sends must stay true to send-feedback.php
// and to the "Messages you send us" row of privacy.php.
$ec_lang['lpn_fb_intro']='Hazır iletiler (isteğe bağlı). Gönder\'e basana kadar hiçbir şey gönderilmez.';
$ec_lang['lpn_fb_pick_numbers']='Sayılar yanlış görünüyor';
$ec_lang['lpn_fb_pick_broken']='Bir şey çalışmadı';
$ec_lang['lpn_fb_pick_wording']='İfade veya çeviri yanlış';
$ec_lang['lpn_fb_pick_confusing']='Bu kafa karıştırıcı';
$ec_lang['lpn_fb_comment']='Yorumlar (isteğe bağlı)';
$ec_lang['lpn_fb_email']='E-posta (isteğe bağlı, yalnızca yanıt istiyorsanız)';
$ec_lang['lpn_fb_sends']='Bunun gönderdikleri: bu sayfanın adı, diliniz, sitenin sürümü, varsa haritadaki iletinin kodu ve seçtiğiniz ya da yazdığınız şey. Çiziminiz veya şebekeniz asla gönderilmez. E-posta adresiniz yalnızca size yanıt vermek için kullanılır.';
$ec_lang['lpn_fb_send']='Gönder';
$ec_lang['lpn_fb_sending']='Gönderiliyor…';
$ec_lang['lpn_fb_failed']='Bu bize ulaşmadı. Yazdığınız şey burada duruyor, bu yüzden yeniden deneyebilirsiniz.';
$ec_lang['lpn_fb_bad_email']='Bu e-posta adresi doğru görünmüyor. Düzeltin veya boş bırakın.';
$ec_lang['lpn_fb_busy']='Son birkaç dakikada çok fazla ileti geldi. Yazdığınız şey burada duruyor, bu yüzden daha sonra yeniden deneyebilirsiniz.';
$ec_lang['lpn_status_example_opened']='{name} bir kopya olarak açıldı. Dosya, Farklı kaydet ile kaydedin.';
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
$ec_lang['lpn_ex_basic_si_desc']='İki rezervuar, bir pompa ve küçük bir halka. Saniyede litre, metre ve milimetre birimleriyle.';
$ec_lang['lpn_ex_basic_us_title']='Temel şebeke, g/d (ABD)';
$ec_lang['lpn_ex_basic_us_desc']='İki rezervuar, bir pompa ve küçük bir halka. Dakikada galon, fit ve inç birimleriyle.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 artı kural tabanlı kontroller';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Klor içeren kurgusal bir EPANET örneği, 1 rezervuar ve 1 depo.';
$ec_lang['lpn_ex_net1_si_title']='EPANET Net1 artı kural tabanlı kontroller, L/s (SI)';
$ec_lang['lpn_ex_net1_si_desc']='Saniyede litre, metre ve milimetre birimleriyle. Dakikada galon, fit ve inç biriminden dönüştürülmüş kurgusal bir EPANET örneği: klor, 1 rezervuar, 1 depo, 1 pompa ve iki kural tabanlı kontrol içerir.';
$ec_lang['lpn_ex_net2_si_title']='EPANET Net2, L/sn (SI)';
$ec_lang['lpn_ex_net2_si_desc']='Saniyede litre, metre ve milimetre birimleriyle. Branford, Connecticut\'taki bir EPANET örneği; dakikada galon, fit ve inç biriminden dönüştürülmüştür: 35 düğüm ve 1 depo, rezervuar, pompa ve vana yok, yaklaşık 2 km × 4 km. Tepkimeye girmeyen bir madde olan florür, bir kaynaktan girer.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2, g/d (ABD)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Dakikada galon, fit ve inç birimleriyle. Branford, Connecticut\'taki bir EPANET örneği: 35 düğüm ve 1 depo, rezervuar, pompa ve vana yok, yaklaşık 1 mil × 2 mil. Tepkimeye girmeyen bir madde olan florür, bir kaynaktan girer.';
$ec_lang['lpn_ex_net3_si_title']='EPANET Net3, L/sn (SI)';
$ec_lang['lpn_ex_net3_si_desc']='Saniyede litre, metre ve milimetre birimleriyle. Novato, California\'daki bir EPANET örneği; dakikada galon, fit ve inç biriminden dönüştürülmüştür, arkasında dünya haritasıyla: 92 düğüm, 3 depo ve 2 rezervuar, vana yok, yaklaşık 8 km kare. 24 saatlik uzun süreli simülasyon, Göl\'den bir kaynak izleme ile.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3, g/d (ABD)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Dakikada galon, fit ve inç birimleriyle. Novato, California\'daki bir EPANET örneği, arkasında dünya haritasıyla: 92 düğüm, 3 depo ve 2 rezervuar, vana yok, yaklaşık 5 mil kare. 24 saatlik uzun süreli simülasyon, Göl\'den bir kaynak izleme ile.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center, g/d (ABD)';
$ec_lang['lpn_ex_elm_street_desc']='Dakikada galon, fit ve inç birimleriyle. Prescott Valley, Arizona: 17 düğüm, 1 rezervuar ve 1 pompa. Bir vaziyet planı üzerine çizilmiş, tek bir anda maksimum gün talebine ek olarak yangın debisi için çözülmüş ticari bir alan.';
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
$ec_lang['lpn_status_reinterpreted']='Değerler ({n}) artık {unit} anlamına geliyor. Hiçbir şey yeniden yazılmadı.';
$ec_lang['lpn_status_converted']='Değerler ({n}) {unit} birimine yeniden yazıldı.';
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
$ec_lang['lpn_result_water_age_tip']='Bu noktaya ulaşan suyun sistemde geçirdiği süre. Akışların birleştiği yerlerde sayı, gelen yaşların debiyle ağırlıklandırılmış ortalamasıdır. Bir depoda bu, tutulan suyun ortalama yaşıdır; bu yüzden yavaş devreden bir depo genellikle bir şebekedeki en eski suyu tutar. Karşılaştırılacak bir yönetmelik sınırı yoktur, bu yüzden değeri modellenen sistemdeki koşullara göre değerlendirin.';
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
// A tank's depth and usable volume (Task 783). Depth is head minus the tank bottom, which is our
// Elevation. Volume is zero at the Lowest water depth, so it is NOT EPANET's tank volume, which also
// counts the water below the lowest water depth (that water is in the mixing volume, it just cannot be drawn down).
$ec_lang['lpn_result_depth']='Derinlik';
$ec_lang['lpn_result_depth_tip']='Gösterilen andaki depodaki su derinliği, depo tabanından yukarı doğru ölçülür: yük eksi depo kotu.';
$ec_lang['lpn_result_tank_volume']='Kullanılabilir hacim';
$ec_lang['lpn_result_tank_volume_tip']='En düşük su derinliğinin üzerindeki su hacmi, bu yüzden o derinlikte sıfırdır. EPANET depo hacmi, en düşük su derinliğinin altındaki suyu da içerir; bu su karışım ve su yaşı için hâlâ sayılır, bu yüzden depo kotu depo tabanında kalır.';
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
$ec_lang['lpn_basemap_topo_show']='Topografik haritayı göster';
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
// and not georeferenced". lat/lon is one EPSG system (EPSG:4326), not a fourth case; EPSG:3857 is a
// projected system in meters since Task 775.
$ec_lang['lpn_convas_title']='Farklı dönüştür';
$ec_lang['lpn_convas_coordsys_tip']='Kopyanın dönüştürüleceği koordinat sistemi. Bu, projenizinkinden farklı olduğunda iki yerleştirme adımı izler. Nerede olduğunu zaten bilen bir proje, her iki adımı da yanıtlanmış olarak açar; böylece onları olduğu gibi kabul edebilir ya da değiştirebilirsiniz.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Şimdiki: {crs}';
$ec_lang['lpn_convas_epsg']='EPSG koordinat sistemi';
$ec_lang['lpn_convas_epsg_tip']='EPSG kayıt defterinden bir koordinat sistemi seçin. Enlem ve boylam olan WGS 84 (EPSG:4326) önerilen seçimdir. Genellikle Web Mercator denen WGS 84 / Pseudo-Mercator (EPSG:3857) x ve y değerlerini metre cinsinden verir ve haritadaki mesafeleri ekvatordan uzaklaştıkça zemin mesafelerini aşar. Boru uzunlukları her iki sistemde de zemin mesafesi olarak hesaplanır.';
$ec_lang['lpn_convas_unnamed']='Adsız (yerel) coğrafi referans';
$ec_lang['lpn_convas_unnamed_tip']='Uzunluk biriminde yerel koordinatlar, dünya haritası eklenmiş olarak.';
$ec_lang['lpn_convas_none_tip']='Uzunluk biriminde yerel koordinatlar, şimdilik dünya haritası olmadan.';
$ec_lang['lpn_convas_units_tip']='Kopyanın dönüştürüleceği birimler.';
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
$ec_lang['lpn_georef_intro']='Modeli yerleştirmek iki adım gerektirir. 1. adım yaklaşıktır: siz arkasındaki haritayı kaydırıp yakınlaştırırken model ekranda sabit kalır; saha, modelin altında kabaca doğru ölçekte olana kadar. Bu adımda döndürme yoktur. 2. adım hassastır: modelin kendisini sürükler, yeniden boyutlandırır ve döndürürsünüz. Proje tüm dünyanın haritası üzerinde başlar, bu yüzden önce konumu bulun, sonra Modeli buraya koy düğmesine basın.';
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
$ec_lang['lpn_tool_add_chain_tip']='Düğümleri ve boruları zincirleyin: bir düğüm eklemek için haritada bir nokta belirtin, sonra her bir sonraki noktayı belirterek bir boru ve bir düğüm ekleyin. Oradan devam etmek için mevcut bir düğümü belirtin. Zinciri bitirmek için Esc tuşuna basın.';
// The Shape tool (Task 779). The word is Tom's: "we call it a 'Shape'".
$ec_lang['lpn_tool_add_shape']='Figür';
$ec_lang['lpn_tool_add_shape_tip']='Haritada bir nokta, çoklu çizgi veya çokgen çizin. Figür yalnızca haritaya eklenen bir çizimdir ve şebekenin parçası değildir. Her noktayı belirtin, ardından bitirmek için son noktayı yeniden belirtin, Enter tuşuna basın veya sağ tıklayın. Figürü çokgen olarak kapatmak için ilk noktayı yeniden belirtin.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Pencere, kement veya çokgenle alan seçimi.';
$ec_lang['lpn_area_selected']='{n} seçildi.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='O alanda hiçbir şey bulunamadı.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Boru kırılma noktalarını ekleyin ve kaldırın. Bir kırılma noktası eklemek için bir boru üzerinde nokta belirtin, kaldırmak için bir kırılma noktasını seçin, taşımak için bir kırılma noktasını sürükleyin. Bir kırılma noktası otomatik uzunluğu değiştirir, ancak küçük (yerel) kayıpları eklemez veya değiştirmez.';
$ec_lang['lpn_tool_undo_tip']='Geri alma geçmişi uzunluğu = 20 eylem';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Tüm şebekeyi harita penceresine sığdırın. Bunun yerine sürüklediğiniz bir dikdörtgene yakınlaştırmak için W tuşuna basın veya Tümünü göster araç çubuğu düğmesinin köşesindeki küçük üçgeni seçin. Ayrıca haritanın sağ üstündeki yakınlaştırma denetimlerine bakın.';
$ec_lang['lpn_tool_zoom_selection_tip']='Seçili öğeleri harita penceresine sığdırın. Önce bir veya daha fazla öğe seçin.';
$ec_lang['lpn_tool_zoom_window_tip']='Köşeleri belirtin veya bir dikdörtgen sürükleyin. Tümünü göster için tekrar basın.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Yakınlaştır. Kısayol: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Uzaklaştır. Kısayol: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Basit veya karmaşık bul ve değiştir';
// **"Toolbar"** (Tom renamed it from "Toolbar key" to "Toolbar" on 2026-09-30).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. The row earns its place.
$ec_lang['lpn_help_icons']='Araç çubuğu';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Görünürlük';
$ec_lang['lpn_color_legend_open_tip']='Renklendirme ayarlarını açıp bu renkleri değiştirmek için basın.';
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
$ec_lang['lpn_georef_scale_tip']='Otomatik hesaplanır. Değiştirmek için düzenleyin. Dosya koordinatlarını zemin mesafesi olarak değiştirmeden kullanmak için 1 girin, örneğin koordinat sistemi olmayan bir dosya için.';
$ec_lang['lpn_georef_rotation']='Saat yönünün tersine döndür (derece)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Yeni koordinat sistemiyle hizalamak için tüm modelin saat yönünün tersine dönüşü.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Model buraya kalıcı olarak yerleştirilsin mi? Sonrasında öğeler yine tek tek sürüklenebilir, ancak şimdi devam etmek tüm koordinatları bir kerede dönüştürür. Eski koordinatları geri almak için özgün projeye dönün ve bunu kaydetmeden kapatın.';
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
$ec_lang['lpn_goto_prompt']='Bu sırayla enlem ve boylam';
$ec_lang['lpn_goto_bad']='Bu bir enlem ve bir boylam değil. Aralarında bir boşlukla 38 -122 deneyin.';
$ec_lang['lpn_georef_goto']='Git…';
$ec_lang['lpn_georef_twopt']='İki bilinen noktayı kullan';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Çizimdeki iki noktanın gerçek enlemi ve boylamı biliniyorsa modeli tam olarak yerleştirin. Bunlardan birini belirtin, enlemini ve boylamını girin, sonra ikinci nokta için aynısını yapın. Konum, ölçek ve dönüş bu iki noktadan hesaplanır. İptal etmek için tekrar basın veya Esc tuşuna basın.';
$ec_lang['lpn_georef_twopt_pick1']='Çiziminizde enlemini ve boylamını bildiğiniz bir noktayı belirtin.';
$ec_lang['lpn_georef_twopt_pick2']='Şimdi, birincisinden olabildiğince uzak, bilinen ikinci bir noktayı belirtin.';
$ec_lang['lpn_georef_twopt_same']='Bu, önce seçtiğiniz nokta. Farklı bir tane seçin.';
$ec_lang['lpn_georef_twopt_done']='Model artık verdiğiniz iki nokta üzerinde duruyor. Kontrol edin, sonra Bu yerleşimi koru düğmesine basın.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Alt panel';
$ec_lang['lpn_pane_toggle_tip']='Haritanın altındaki paneli gösterin ya da gizleyin. Grafikleri ve her öğe türü için bir tablo içerir.';
$ec_lang['lpn_pane_resize']='Paneli daha uzun ya da daha kısa yapmak için sürükleyin';
$ec_lang['lpn_pane_tab_junctions']='Düğümler';
$ec_lang['lpn_pane_tab_reservoirs']='Rezervuarlar';
$ec_lang['lpn_pane_tab_tanks']='Depolar';
$ec_lang['lpn_pane_tab_pipes']='Borular';
$ec_lang['lpn_pane_tab_pumps']='Pompalar';
$ec_lang['lpn_pane_tab_valves']='Vanalar';
$ec_lang['lpn_pane_tab_tip']='Öğeleri tabloya benzer bir çizelge olarak düzenleyin. Sonuç sütunları düzenlenemez. Klavye kısayolları için Yardım, Notlar bölümüne bakın.';
$ec_lang['lpn_pane_popout']='Kutuda aç';
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
// Added to the filtered table's line (Task 738): rows edited since Filter in table was pressed stay
// in the table even when they no longer match, dimmed and marked, until it is pressed again. {n} is
// how many. Worded as a label and a count so no plural form is needed.
$ec_lang['lpn_pane_filter_stale']='Artık eşleşmeyen satırlar: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Bu tabloda filtreyle eşleşen hiçbir şey yok.';
// Selection only (Task 757): the Tables pane filtered to what is selected on the map. Parallel to
// lpn_pane_filter_note. The line names the Find filter too when both are on.
$ec_lang['lpn_pane_filter_sel_note']='Yalnızca seçim. {all} öğeden {n} tanesi gösteriliyor.';
$ec_lang['lpn_pane_filter_sel_and']='{q} ile süzüldü ve yalnızca seçim. {all} öğeden {n} tanesi gösteriliyor.';
$ec_lang['lpn_pane_filter_sel_none']='Seçili öğelerin hiçbiri bu tabloda değil.';
$ec_lang['lpn_pane_sel_only']='Yalnızca seçim';
$ec_lang['lpn_pane_sel_only_none']='Hiçbir öğe seçili değil. Önce haritada öğeleri seçin.';
// Show scenarios (Tom, 2026-10-05): the table's cell menu switch that lists every asset once per
// scenario, with a Scenario column after ID.
$ec_lang['lpn_pane_scn_show']='Senaryoları göster';
// Two switches on the cell menu while Show scenarios is on (Tom, 2026-10-07): keep only the rows whose
// scenario holds a value of its own in this table, and keep only the open scenario's rows.
$ec_lang['lpn_pane_scn_ov_only']='Yalnızca senaryo değerleri';
$ec_lang['lpn_pane_scn_cur_only']='Yalnızca geçerli senaryo';
$ec_lang['lpn_pane_inactive_show']='Etkin olmayan topolojiyi dahil et';
// The line above a table while either switch is on, beside the filter's own Show all. {filters} is one
// or both of the two switch names, joined by a comma; {n} the rows showing, {all} the rows without them.
$ec_lang['lpn_pane_scn_filter_note']='{filters}. {all} öğeden {n} tanesi gösteriliyor.';
// The cell menu's item that removes the selected cells' scenario overrides, so each reads what its
// scenario inherits (Tom, 2026-10-06). Greyed when no selected cell holds one.
$ec_lang['lpn_ovm_child_ask']='Alt senaryo değerleri temizlensin mi (toplam {n})?';
$ec_lang['lpn_ovm_child_tip']='Alt senaryolar bu değeri değiştiriyor (toplam {n}). Senaryo değerlerini temizlemek için tıklayın.';
$ec_lang['lpn_ovm_dot_clear']='Temizlemek için tıklayın.';
$ec_lang['lpn_ovm_dot_set']='Devralınmış. Bu senaryoda, gösterilen değeri tutan bir senaryo değeri yapmak için tıklayın.';
$ec_lang['lpn_pane_clear_override']='Senaryo değerini temizle';
// The tip on a table cell holding a value set in its row's scenario (Tom, 2026-10-06: "Demand alt.:
// Max day"). {category} is an lpn_alt_cat_* name; {alternative} is the alternative's name, which
// in Basic mode is its scenario's.
$ec_lang['lpn_pane_scn_alt_tip']='{category} alternatifi: {alternative}';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Yakınlaştır ve seç';
$ec_lang['lpn_goto_on_map']='Haritada göster';
$ec_lang['lpn_pane_select_on_map']='Haritada seç';
$ec_lang['lpn_pane_unselect_on_map']='Haritada seçimi kaldır';
$ec_lang['lpn_pane_print']='Tabloyu yazdır';
// Tom, 2026-10-06. Copy with headings puts the heading line, unit included, above the selected cells; plain
// Copy never does. The two Export rows download the whole table as shown.
$ec_lang['lpn_pane_copy_heads']='Sütun başlıklarıyla kopyala';
// Tom, 2026-10-07. File, Export to, ODS/XLSX/CSV file: a box asking which tables and which scenarios.
// {format} is ODS, XLSX or CSV, the file format's own name, never translated.
$ec_lang['lpn_export_table_title']='{format} olarak dışa aktar';
$ec_lang['lpn_export_table_current']='Geçerli';
$ec_lang['lpn_export_table_all']='Tümü';
$ec_lang['lpn_export_table_go']='Dışa aktar';
$ec_lang['lpn_export_table_scn_note']='Sonuçlar yalnızca en son hesaplanan senaryo için dışa aktarılır.';

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
$ec_lang['lpn_menu_project']='Su';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Su şebekesi modellemesine özgü her şey (animasyon oynatma denetimleri hariç)';
$ec_lang['lpn_tables_menu']='Tablolar';
// Water > Morph (Task 781; Tom, 2026-10-14: *"I like the term 'Morph' (Transform) for this feature"*;
// first built as Change type, Tom, 2026-10-05: *"It would be nice to provide a tool under Water or Tables
// to Change node type for any asset, where if it has information that can't be ported to the new
// type, we alert and ask."*). The fly-out reuses lpn_tool_add_junction/_reservoir/_tank. The box it
// asks in lists one line per value lost: {id} is the asset's ID, {property} a field label the
// popup already uses, {value} the number or name with its unit, {scenario} a scenario's name.
// dev/asset-type.md.
$ec_lang['lpn_morph_menu']='Türü değiştir';
$ec_lang['lpn_morph_tip']='Seçili düğümleri düğüme, rezervuara veya depoya, ya da seçili hatları boruya, pompaya veya vanaya dönüştürün. Her biri kimliğini, yerini, bağlantılarını ve yeni türün de taşıdığı her değeri korur. Bir şey kaybolacaksa önce size sorulur.';
$ec_lang['lpn_morph_ok']='Değiştir';
// {ids} lists the selected assets of the other kind (nodes when a link type was chosen, and links
// when a node type was chosen), separated by commas.
$ec_lang['lpn_morph_other_kind']='Bir düğümün türü yalnızca başka bir düğüm türüne, bir hattın türü yalnızca başka bir hat türüne değiştirilebilir. Değiştirilmeyenler: {ids}';
// The Properties row shown where a scenario morphs the asset (Task 781): the type it is in this
// scenario, beside the override marker.
$ec_lang['lpn_field_type']='Tür';
$ec_lang['lpn_field_type_tip']='Bu varlığın bu senaryodaki türü; Türü değiştir ile belirlenir. Üst senaryonun türünü kullanmak için senaryo değerini temizleyin.';
$ec_lang['lpn_change_type_lost']='Bu değerler kaybolacak:';
// The key to the lines under it (Tom, 2026-10-06: *"Provide a key for the loss report. 'ID: Lost entry'."*).
$ec_lang['lpn_change_type_key']='Her satır: ID: kaybolacak özellik ve değer';
$ec_lang['lpn_change_type_line']='{id}: {property} {value}';
$ec_lang['lpn_change_type_line_scenario']='{id}: {property} {value}, {scenario} senaryosunda';
$ec_lang['lpn_change_type_line_alternative']='{id}: {property} {value}, {alternative} alternatifinde';
$ec_lang['lpn_change_type_more']='Ve {n} tane daha.';
// Heads the lines a tank-to-reservoir or reservoir-to-tank change states rather than loses: the
// water surface is carried, so the new head or water depth is listed with its value.
$ec_lang['lpn_change_type_surface']='Bunlar su yüzeyini olduğu yerde tutar. Bir rezervuarın yükü, deponun kotu ile su derinliğinin toplamıdır; bir deponun su derinliği ise rezervuarın yükü eksi kotudur:';
$ec_lang['lpn_change_type_meaning']='Bu kontroller ve kurallar değiştirilen bir düğümü sınar ve onu farklı okuyacaktır: bir düğüm basıncıyla, bir depo veya rezervuar ise su seviyesiyle sınanır.';
// The link half (Tom, 2026-10-06: "Proceed."). Each heads a list of "ID: entry" lines.
$ec_lang['lpn_change_type_born']='Bu değerler yenidir, yeni çizilmiş bir öğedeki gibi ayarlanmıştır:';
$ec_lang['lpn_change_type_no_curve']='{id}: Pompa yük eğrisi yok, bu yüzden bir eğri seçilene kadar pompa yük eklemez ve .inp dışa aktarımı onu boru olarak yazar';
$ec_lang['lpn_change_type_becomes']='{id}: {property} {value}, {scenario} senaryosunda, {new} olur';
$ec_lang['lpn_change_type_customers']='Yalnızca bir boru müşterilere hizmet eder, bu yüzden bu müşteriler bunun yerine parantez içinde gösterilen düğüme bağlanır; talepleri orada zaten uygulanmıştır. Çizildikleri yerde kalırlar ve talepleri değişmez:';
$ec_lang['lpn_change_type_setting']='Bu kontroller ve kurallar, değiştirilen bir hattın ayarını verir veya sınar. Bir ayar, boruda, pompada ve vanada farklı bir niceliktir, bu yüzden bunlar onu farklı okuyacaktır:';
$ec_lang['lpn_change_type_rules']='Bu kural satırları bir hattı türüyle adlandırır ve bunun yerine yeni türünü adlandıracaktır:';
$ec_lang['lpn_tables_menu_tip']='Varlıkları alt panelde tablolarda görüntüleyin ve düzenleyin.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Simülasyonu çalıştırır. Ayarlar, Hesaplama, Hidrolik altında "Otomatik olarak yeniden hesapla" açıkken gerekli değildir. Yeniden hesapla kapalıyken araç çubuğunda bir Hesapla düğmesi görünür.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Otomatik olarak yeniden hesapla';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Yeniden hesaplama çok yavaşsa kapatın. Bu açıkken Hesapla düğmesi gizlenir.';
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
$ec_lang['lpn_confirm_delete_network']='Bu projedeki her düğüm, boru ve metin etiketi silinsin mi? Arka plan görüntüsü, proje adı ve ayarlarınız korunur.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Bul ve değiştir';
// Copy and Paste properties (Task 782; Tom, 2026-10-12: a clipboard, no confirmation). Identity and
// placement are never pasted.
$ec_lang['lpn_copy_props_menu']='Özellikleri kopyala';
$ec_lang['lpn_copy_props_done']='{id} özellikleri kopyalandı.';
$ec_lang['lpn_copy_props_no_overrides']='Kopyalanacak senaryo değeri yok.';
$ec_lang['lpn_copy_props_done_ov']='{id} varlığının bu senaryodaki senaryo değerleri kopyalandı.';
$ec_lang['lpn_paste_alt_created']='Bu senaryo için {category} alternatifi {name} oluşturuldu.';
$ec_lang['lpn_paste_props_menu']='Özellikleri seçime yapıştır';
$ec_lang['lpn_paste_props_off_none']='Hiçbir şey kopyalanmadı. Bir varlığa sağ tıklayın veya uzun basın ve Özellikleri kopyala öğesini seçin.';
$ec_lang['lpn_paste_props_off_select']='Yapıştırılacak varlıkları seçin, sonra Özellikleri seçime yapıştır öğesini seçin.';
$ec_lang['lpn_paste_props_off_kind']='Seçili hiçbir varlık kopyalanan özellikleri alamaz.';
$ec_lang['lpn_tsb_menu']='Zaman serisi grafiği';
// The map's right-click (and long press) menu on a Text and on a dragged label (2026-10-14). Edit text
// opens the in-place editor; Reset position sends a dragged label or an attached Text home.
$ec_lang['lpn_ctx_edit_text']='Metni düzenle';
$ec_lang['lpn_ctx_reset_position']='Konumu sıfırla';
$ec_lang['lpn_ctx_reset_position_off_tip']='Yalnızca kendi konumundan sürüklenmiş bir etiket veya bağlı bir Metin sıfırlanabilir.';
$ec_lang['lpn_tsb_off_tip']='Uzun süreli benzetim sonuçları gerekir. Ayarlar, Hesaplama, Zaman içinde bir Toplam çalışma süresi belirleyin ve hesaplayın.';
$ec_lang['lpn_tsb_close']='Grafiği kapat';
$ec_lang['lpn_tsb_resize']='Boyutlandırmak için sürükleyin';
$ec_lang['lpn_tsb_quantity']='Grafiği çizilecek büyüklük';
$ec_lang['lpn_tsb_max']='Başka birini açmadan önce bir grafiği kapatın. En fazla {n} açık kalır.';
$ec_lang['lpn_paste_done_one']='{id} özellikleri {to} varlığına yapıştırıldı. Değişen değerler: {n}.';
$ec_lang['lpn_paste_done_many']='{id} özellikleri {m} varlığa yapıştırıldı. Değişen değerler: {n}.';
$ec_lang['lpn_paste_skip_breakdown']='Yapıştırılmadı: {n} (talep bir kategori listesidir).';
$ec_lang['lpn_paste_skip_valve']='Yapıştırılmadı: {n} (vana türleri farklı).';
$ec_lang['lpn_find_title']='Bul ve değiştir';
$ec_lang['lpn_find_scope']='Nerede aransın';
$ec_lang['lpn_find_scope_all']='Her şey';
$ec_lang['lpn_find_scope_source']='Kaynak';
$ec_lang['lpn_find_source_no_chemical']='Hiçbir kimyasal izlenmiyor, bu yüzden hiçbir düğümün kaynağı yok.';
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
$ec_lang['lpn_find_count']='{n} bulundu. Birine gitmek için seçin.';
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
// A result row prints the NARROWEST condition true of that node beside its id, because "no links"
// says more than "no open path to a source" and both are true of the same node. It prints the
// SAME four keys above with the first letter capitalized in code (findConnLabel()), not a second
// capitalized copy of each (Task 699, Tom 2026-09-30: "do the Find redesign").
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Her düğüm bağlı.';
$ec_lang['lpn_find_conn_no_fixed']='Bu şebekede rezervuar veya depo yok, bu yüzden ulaşılacak bir kaynak da yok. Yalnızca düğümde bağlantı yok ve düğümde açık bağlantı yok aranabilir.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Verilen arama, bir metin sorgusu olarak. Sorguyu değiştirmek yukarıdaki denetimleri günceller.';
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
$ec_lang['lpn_replace_asked']='Kotu istenen düğümler ({n}). Sonuçlar alındıkça görünür.';
$ec_lang['lpn_replace_btn']='Değiştir';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Öğeler ({n}) değiştirilsin mi?';
$ec_lang['lpn_replace_apply']='Bunları değiştir';
$ec_lang['lpn_replace_done']='Değiştirilen öğeler: {n}. Bu, tek adımda geri alınabilir.';
$ec_lang['lpn_replace_none']='Hiçbir şey değişmeyecek.';
$ec_lang['lpn_replace_no_value']='Yeni değeri yazın.';
$ec_lang['lpn_replace_scope']='Değerlerini değiştirmek için yukarıda bir öğe türü seçin.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Profil';
$ec_lang['lpn_graphs_menu']='Grafikler';
// **THE SYNONYMS ARE IN dev/plain-sentences.md, THE CHANNEL MEANT FOR THEM.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission a plain sentence requires. Same text, correct channel.
$ec_lang['lpn_profile_title']='Bir yol boyunca profil';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Yolun başladığı düğümü seçin.';
$ec_lang['lpn_profile_draw_more']='Yolu görmek için haritanın üzerinde gezinin. Eklemek için bir düğüm seçin. Bitirmek için çift tıklayın. Esc iptal eder.';
$ec_lang['lpn_profile_draw_blocked']='{a}\'dan {b}\'ye bir güzergah yok. Başka bir düğüm seçin.';
$ec_lang['lpn_profile_tap_start']='Yolun başladığı düğümü seçin.';
$ec_lang['lpn_profile_tap_more']='Yolu görmek için bir düğüm seçin. Eklemek için basılı tutun. Bitirmek için iki kez dokunun. İptal etmek için tekrar Profil\'e basın.';
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
$ec_lang['lpn_profile_edit_click']='Yol üzerindeki herhangi bir noktayı taşımak için sürükleyin. Eklediğiniz bir noktayı çıkarmak için onu seçin.';
$ec_lang['lpn_profile_edit_tap']='Yol üzerindeki herhangi bir noktayı taşımak için sürükleyin. Eklediğiniz bir noktayı çıkarmak için onu seçin.';
$ec_lang['lpn_profile_edit_nowhere']='Yol üzerindeki bir nokta bir düğüm olmalıdır. Yol değişmedi.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Kaydedilmiş yollar';
$ec_lang['lpn_profile_new']='Yeni kaydedilmiş yol…';
$ec_lang['lpn_profile_new_name']='Yol {n}';
$ec_lang['lpn_profile_rename']='Yolu yeniden adlandır…';
$ec_lang['lpn_profile_delete']='Yolu sil';
$ec_lang['lpn_profile_open']='EPANET profil dosyasını aç…';
$ec_lang['lpn_profile_file_done']='Profil dosyadan okundu: bu şebekede {total} düğümden {used} tanesi bulundu.';
$ec_lang['lpn_profile_file_missing']='Dosyada adı geçen ama bu şebekede olmayanlar: {ids}.';
$ec_lang['lpn_profile_file_short']='Dosya bu şebekede ikiden az düğümün adını veriyor, bu yüzden çizilecek bir profil yok.';
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
$ec_lang['lpn_ts_group_nodes']='Düğümler';
$ec_lang['lpn_ts_group_links']='Hatlar';
$ec_lang['lpn_pgraph_none']='Bu öğenin mevcut çalıştırmada sonucu yok.';
// The Properties graph's own selector entry for a source share (Tom, 2026-09-30: "In selector, use
// 'Source share from {trace node}'"). Distinct from the shared lpn_result_source_share, which still
// labels the bare quantity everywhere else -- the Tables column, Find's property list, the Labels
// popover and the colour legend -- where naming the trace node in every heading would be clutter.
$ec_lang['lpn_pgraph_source_share_from']='{node} düğümünden kaynak payı';
$ec_lang['lpn_result_pump_head']='Yük';
$ec_lang['lpn_result_pump_head_tip']='Pompanın emişten basmaya kadar eklediği yük, pozitif bir sayı olarak gösterilir. Çözücü ve EPANET dosyaları onu negatif bir yük kaybı olarak taşır.';
// The Full report puts every node and link in one table, where a node's Head column already sits, so a
// pump's column there says whose head it is. Elsewhere the pump's own row or tab says so, and lpn_result_pump_head is enough.
$ec_lang['lpn_report_pump_head']='Pompa yükü';
$ec_lang['lpn_ts_add']='Seçileni ekle';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Eklenecek bir şey bulunamadı.';
$ec_lang['lpn_ts_clear']='Hepsini kaldır';
$ec_lang['lpn_ts_chip_tip']='{id} öğesini grafikten çıkar';
$ec_lang['lpn_ts_none']='Henüz çizilecek bir şey yok. Haritada varlıklar seçin ve Seçileni ekle\'ye basın.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Henüz uzatılmış dönem sonucu yok. Simülasyonu çalıştırmak için Hesapla\'ya basın.';
$ec_lang['lpn_ts_summary']='Varlıklar: {n}, raporlama zamanları: {steps}';
$ec_lang['lpn_ts_axis_time']='Geçen süre';
// EPANET's Frequency Plot (Task 600): one value over every junction or every pipe, at the time the
// map shows, against the percent of them less than it. "Percent less than" is EPANET's own axis
// title. {n} and {total} are counts, {time} an elapsed time; all substituted, never concatenated.
// The Junctions/Pipes choice reuses lpn_pane_tab_junctions and lpn_pane_tab_pipes.
$ec_lang['lpn_freq_menu']='Frekans';
$ec_lang['lpn_freq_tip']='Bir özelliğin frekans dağılımı';
$ec_lang['lpn_freq_title']='Değerlerin dağılımı';
$ec_lang['lpn_freq_none']='Bu değer için henüz sonuç yok, bu yüzden çizilecek bir şey yok.';
$ec_lang['lpn_freq_summary']='Çizilen: {n} / {total}';
$ec_lang['lpn_freq_summary_time']='Çizilen: {n} / {total}, {time} zamanında';
$ec_lang['lpn_freq_axis_percent']='Altında kalan yüzde';
// EPANET's Contour Plot (Task 600), drawn as a layer under the map rather than in a window of its
// own, from the pipes outward. {n} and {p} are counts, {k} and {i} numbers, {u} a unit symbol, {m} a
// distance in metres; all substituted. lpn_contour_buffer_unit follows the Buffer number box.
// lpn_contour_consent_1..4 are the terrain question's four paragraphs, reworded for what the contour
// plot sends: tile numbers for the network's area, not each node's latitude and longitude.
$ec_lang['lpn_contour_menu']='Eş eğri';
$ec_lang['lpn_contour_tip']='Haritada bir eş eğri grafiği gösterin: düğüm renkleri boruların boyunca ve yanlarında yayılır, etiketli eş eğri çizgileriyle birlikte. Ayarlamak veya kapatmak için bir kutu açar.';
$ec_lang['lpn_contour_plot']='Eş eğri grafiği';
$ec_lang['lpn_contour_show']='Eş eğrileri göster';
$ec_lang['lpn_contour_show_tip']='Dolguyu ve eş eğri çizgilerini gizlemek için işareti kaldırın; olduğu gibi geri getirmek için işaretleyin. Düğüm renkleri kalır.';
$ec_lang['lpn_contour_fill']='Dolgu';
$ec_lang['lpn_contour_fill_tip']='Yumuşak, renkleri bir sınıftan ötekine harmanlar. Bantlar, renk anahtarının her sınıfını düz boyar.';
$ec_lang['lpn_contour_fill_smooth']='Yumuşak';
$ec_lang['lpn_contour_fill_bands']='Bantlar';
$ec_lang['lpn_contour_opacity']='Dolgu opaklığı';
$ec_lang['lpn_contour_lines']='Eş eğri çizgileri';
$ec_lang['lpn_contour_interval']='Aralık';
$ec_lang['lpn_contour_buffer']='Tampon';
$ec_lang['lpn_contour_buffer_unit']='× ortanca boru uzunluğu';
$ec_lang['lpn_contour_buffer_tip']='Rengin her borudan ne kadar uzağa ulaştığı, ortanca boru uzunluğunun katı olarak. Dış kısımda giderek solar.';
$ec_lang['lpn_contour_few']='Eş eğri çizmek için çok az düğüm var.';
$ec_lang['lpn_contour_support']='Eş eğri grafiği: {n} düğüm, {p} boru boyunca ve yanlarında ortanca boru uzunluğunun {k} katına kadar enterpole edildi. Pompaların, vanaların veya kapalı hatların karşısında renk yok.';
$ec_lang['lpn_contour_support_lines']='Eş eğri çizgileri her {i} {u} aralıkla.';
$ec_lang['lpn_contour_too_many']='Bu aralıkta çok fazla eş eğri çizgisi var; çizmek için aralığı genişletin.';
$ec_lang['lpn_contour_dem']='Düğümler arasındaki zemin, Mapbox DEM\'den';
$ec_lang['lpn_contour_dem_tip']='Düğümler arasında basınç, enterpole edilmiş yük eksi Mapbox DEM\'deki zemin yüksekliği olur; bu yüzden şebekenin üzerinde düğümü olmayan bir tepede en düşük düğüm basıncının altına inebilir. Zemini bir eş eğri haritası olarak görün, bir ölçüm olarak değil.';
$ec_lang['lpn_contour_support_dem']='Düğümler arasında basınç, enterpole edilmiş yük eksi Mapbox DEM\'den gelen zemin kotudur ve yaklaşık her {m} m\'de bir örneklenir.';
$ec_lang['lpn_contour_dem_failed']='Zemin Mapbox DEM\'den okunamadı, bu yüzden basınç yalnızca düğümler arasında enterpole edildi.';
$ec_lang['lpn_contour_consent_1']='Basıncı zeminin üzerine çizmek, şebekenizin kapladığı alanı, Mapbox harita karo numaraları olarak, oradaki zemin yüksekliğini okumak için api.mapbox.com\'a gönderir.';
$ec_lang['lpn_contour_consent_2']='Bu, projenizin arkasındaki harita görüntülerinden farklı bir sorudur. Görüntüler yalnızca nereye baktığınızı söyler. Bu karolar ise şebekenizin nerede olduğunu söyler. Mapbox bu karo numaralarını ve IP adresinizi alacaktır. Başka hiçbir şey göndermeyiz: ne ad, ne boru, ne de proje. Bunun hiçbir kaydını tutmayız ve bu soruya verdiğiniz yanıt dışında bu cihazda hiçbir şey saklanmaz.';
$ec_lang['lpn_contour_consent_3']='Şebekenizin bulunduğu alanın karo numaralarını Mapbox\'a gönderebilir miyiz?';
$ec_lang['lpn_contour_consent_4']='Hayır derseniz, bu sayfadaki her şey şimdi çalıştığı gibi çalışmaya devam eder ve eş eğri grafiği yalnızca düğümler arasında çizilir. Tekrar sormamak için bir evet\'i hatırlarız. Bir hayır hiç saklanmaz.';
// EPANET's System Flow plot (Task 600). "System flow" is its Graph Selection name, "System flow
// balance" its window title, "Produced" and "Consumed" its series. The definition is its own code
// (Fgraph.pas GetSysFlow): junction and reservoir demands only, split by sign; tanks in neither.
// The axis reuses lpn_result_flow and lpn_ts_axis_time.
$ec_lang['lpn_sysflow_menu']='Debi dengesi';
$ec_lang['lpn_sysflow_tip']='Üretilen toplam debiyi ve tüketilen toplam debiyi, uzatılmış dönem simülasyonu boyunca zamana göre çizin. Depolar iki toplamın da dışındadır, bu yüzden iki çizgi ayrıldığında depolar doluyor ya da boşalıyordur.';
$ec_lang['lpn_sysflow_title']='Debi dengesi';
$ec_lang['lpn_sysflow_produced']='Üretilen';
$ec_lang['lpn_sysflow_produced_tip']='Rezervuarlardan ve negatif taleplerden şebekeye giren toplam debi.';
$ec_lang['lpn_sysflow_consumed']='Tüketilen';
$ec_lang['lpn_sysflow_consumed_tip']='Her pozitif talebin toplamı: şebekeden düğümlerde çekilen su ve bir rezervuara giden her debi.';
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
$ec_lang['lpn_new_coordsys_tip']='Şebekenizin koordinat sistemini seçin. Bu seçimi değiştirmenin tek yolu yeni bir projeye “Dosya, Farklı dönüştür…” yapmaktır ve bu dönüşüm yaklaşıktır.';
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
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25) is lpn_new_coordsys, as are its list label and
// the New project box's chooser button (Task 699): it names the box's own subject rather than
// either caller's radio label.
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='Harita görünümüne göre filtrele';
$ec_lang['lpn_crs_view_tip']='Yalnızca haritanın baktığı yeri kapsayan projeksiyonları sunar. Tüm listeyi görmek için kapatın.';
$ec_lang['lpn_crs_place']='Yer adı arama';
$ec_lang['lpn_crs_place_tip']='Aramalar OpenStreetMap yer adı hizmetine gönderilir ve ilk seferinde izin istenir. Yeni bir coğrafi proje de burada bulunan yerden başlar.';
$ec_lang['lpn_crs_search']='Ara';
$ec_lang['lpn_crs_name']='Projeksiyon adı filtresi';
$ec_lang['lpn_crs_name_tip']='Listeyi süzen metin: yalnızca adı veya EPSG kodu bunu içeren koordinat sistemleri gösterilir.';
$ec_lang['lpn_crs_list_tip']='Yukarıdaki iki filtreden kalan projeksiyonlar. Birini seçin ve Seç’e basın.';
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
// Shown beside WGS 84 (EPSG:4326) in the chooser only (Task 775), never on the status strip.
$ec_lang['lpn_crs_suggested_mark']='(önerilen)';
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
$ec_lang['lpn_new_units_tip']='Birimler ve diğer ayarlar her projeyle birlikte saklanır, bu yüzden bu seçim yalnızca bu projeye uygulanır ve tarayıcı ayarı olarak kaydedilmez. Tercihleri yeniden kullanmak için boş bir projeyi şablon olarak kaydedin ve her yeni projeye ondan başlayın.';
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
// **TASK 718** (Tom, 2026-09-25: *"We have three import items. It's probably time for an Import
// sub-menu."*). The three rows -- surveyed points, an EPANET file, and libraries -- now open as a
// fly-out off one row, the same submenu idiom Help > Toolbar already uses. Each row keeps its
// own existing key and tip; only this one row is new.
$ec_lang['lpn_file_import_menu']='İçe aktar…';
$ec_lang['lpn_file_import_inp']='EPANET dosyası içe aktar…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Bir EPANET dosyasından — ister .inp metin dosyası ister EPANET\'in kaydettiği .net dosyası olsun — bir şebeke okur ve bu tarayıcıda yeni bir proje olarak kaydeder.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
// File > Export is a submenu (Tom, 2026-10-06), so its rows drop the verb the heading carries. The
// two keys above are what the rows were called before it.
$ec_lang['lpn_file_export_menu']='Dışa aktar…';
$ec_lang['lpn_file_export_item_inp']='EPANET dosyası…';
$ec_lang['lpn_file_export_item_geojson']='GeoJSON dosyası…';
$ec_lang['lpn_file_export_item_ods']='ODS dosyası…';
$ec_lang['lpn_file_export_item_xlsx']='XLSX dosyası…';
$ec_lang['lpn_file_export_item_csv']='CSV dosyası…';
$ec_lang['lpn_file_export_tables_tip']='Tabloları Tablolar panelinin gösterdiği şekilde, her tablo için (ve seçtiğiniz her senaryo için) bir sayfa ve kimliklerinin (ID) başvurduğu her kitaplık için bir sayfa içeren tek bir çalışma kitabı olarak indirin: desenler, eğriler, boru türleri ve bağlantı parçaları. Sonuçlar yalnızca en son hesaplanan senaryo için eklenir.';
$ec_lang['lpn_file_export_csv_tip']='Bir tabloyu Tablolar panelinin gösterdiği şekilde indirin. Tek bir tablo, kitaplık içermeyen tek bir CSV dosyası olarak gelir. Birden çok tablo veya senaryo, kimliklerinin (ID) başvurduğu her kitaplık için bir dosyayla birlikte, CSV dosyalarından oluşan tek bir zip dosyası olarak gelir. Sonuçlar yalnızca en son hesaplanan senaryo için eklenir.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Bu şebekeyi bir EPANET .inp dosyası olarak indirir (varsa görüntüsüyle birlikte bir zip dosyası içinde). .inp biçiminin tutamadığı her şey sonrasında sizin için listelenir.';
$ec_lang['lpn_status_inp_exported']='{file} dışa aktarıldı.';
$ec_lang['lpn_status_inp_exported_picture']='{zip} dışa aktarıldı; içinde EPANET dosyası {file}, arka plan görüntüsü {picture} ve world dosyası {world} var. Üçünü de tek bir klasöre çıkarın, sonra oradaki .inp dosyasını EPANET\'te açın; görüntü onunla birlikte gelir.';
$ec_lang['lpn_status_inp_exported_no_picture']='{file} dışa aktarıldı. Arka plan görüntüsü kaydedilemedi, bu yüzden .inp hiçbirini adlandırmıyor; EPANET\'te Görünüm > Arka plan > Yükle ile ekleyin.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_flat_customers_inactive']='Bu müşterilerin {n} tanesi bu senaryoda etkin olmayan bir düğüme atanmıştır; bu nedenle talepleri dosyada yoktur.';
$ec_lang['lpn_inp_export_flat_inactive_controls']='Bu kontroller ve kurallar bu senaryoda etkin olmayan bir varlığa başvurur; bu nedenle dosyada yoktur: {ids}';
$ec_lang['lpn_inp_export_differences']='.inp biçiminin tutamadığı {n} şey.';
$ec_lang['lpn_inp_export_difference_one']='.inp biçiminin tutamadığı bir şey.';
$ec_lang['lpn_inp_export_refused']='Bu proje bir EPANET dosyası olarak yazılamaz: {detail}';
// Task 772: File > Export DXF file. The model's data for AutoCAD and other CAD programs.
$ec_lang['lpn_file_export_item_dxf']='DXF dosyası…';
$ec_lang['lpn_file_export_dxf_tip']='Bu şebekeyi AutoCAD ve diğer CAD programları için indirin: düğümler sembol blokları olarak, borular, pompalar ve vanalar çoklu çizgi olarak ve her varlık, öznitelikleri kimliğini (ID) ve özellik değerlerini proje birimlerinde taşıyan bir blok olarak.';
$ec_lang['lpn_dxf_export_no_utm']='DXF dosyası yazılmadı: bu şebeke UTM\'nin kapsadığı enlemlerin (80° G ile 84° K) dışında kalıyor ve bir çizimin üzerine çizileceği düz bir ızgaraya ihtiyacı var.';
$ec_lang['lpn_dxf_export_refused']='DXF dosyası yazılmadı: gereken koordinat dönüşümü yüklenmedi. Bağlantıyı denetleyip yeniden deneyin.';
$ec_lang['lpn_dxf_export_failed']='DXF dosyası yazılmadı: bu sayfadaki bir hata onu durdurdu ({error}).';
// The read-me written into the file as a block of attributes, on a layer that does not plot; the
// file writes it in capital letters. Each says what
// the coordinates are and claims no coordinate system the file does not have. {unit} is a length
// unit as written in English (ft, m), not translated; {crs} is a coordinate system name with its EPSG code.
$ec_lang['lpn_dxf_note_grid']='Koordinatlar: bu projenin X ve Y değerleri, {unit} cinsinden. Hiçbir koordinat sistemi belirtilmemiştir.';
$ec_lang['lpn_dxf_note_crs']='Koordinatlar: {crs}, bu projenin belirttiği şekliyle.';
$ec_lang['lpn_dxf_note_geo']='Koordinatlar: {crs}, metre cinsinden, enlem ve boylam değil. Projenin enlemleri ve boylamları bu ızgaraya dönüştürüldü.';
$ec_lang['lpn_dxf_exported_geo']='{file} dışa aktarıldı. Koordinatları {crs}, metre cinsinden, enlem ve boylam değil.';
// {prefix} is the layer-name prefix, C-WATR-MODL-; {example} is a whole layer name such as
// C-WATR-MODL-NODE-BASE.
$ec_lang['lpn_dxf_note_blocks']='Katmanlar {prefix}, varlık kodu, bir tire ve alternatif olarak adlandırılır, {example} örneğindeki gibi. Her öğe, 1 birim yüksekliğinde özniteliklerle 1 ölçeğinde yerleştirilmiş bir bloktur; metin yüksekliğini ayarlamak için blokları ölçekleyin. Her öznitelik görünürdür; bir öğenin öznitelikleri sembolünün yanında bir sütun halinde dizilir.';
// {n} is a whole number; {max} is 2049. Each shortened value ends in three periods (...).
$ec_lang['lpn_dxf_note_shortened']='Bir DXF dosyasının izin verdiğinden ({max} karakter) uzun değerler: {n}. Her biri kısaltıldı ve üç noktayla bitiyor.';
// {n} is a whole number; {tag} is an attribute tag in capitals, BASE_DEMAND in English.
$ec_lang['lpn_dxf_note_categories']='Birden fazla talep kategorisi olan düğümler: {n}. Bunların {tag} özniteliği, tüm kategorilerin temel taleplerinin toplamını tutar.';
// GeoJSON export (Task 728). The command is worded like Export EPANET file. Positions in a GeoJSON
// file are always longitude and latitude (RFC 7946), so a project with no place on the Earth is
// refused and told how to get one, never written with an invented coordinate system.
$ec_lang['lpn_file_export_geojson_tip']='Bu şebekeyi QGIS, ArcGIS Pro ve diğer CBS programları için GeoJSON dosyası olarak indirin. Düğümler, depolar ve rezervuarlar noktadır; borular, pompalar ve vanalar köşe noktalarını izleyen çizgilerdir. Konumlar enlem ve boylamdır. Sonuçlar yalnızca şebeke çözüldüyse dahil edilir.';
// Workspace export and import (Tom, 2026-10-07). {file}, {n}, {r}, {u} and {version} are filled in by the page.
$ec_lang['lpn_file_export_item_workspace']='Çalışma alanı…';
$ec_lang['lpn_file_export_workspace_tip']='Kutularınızın nerede durduğunu, boyutlarını, hangilerinin açık veya yerleştirilmiş olduğunu, panel ve sütun boyutlarınızı ve bu sayfanın görüntü seçeneklerini, örneğin hangi yardım balonlarının ve fare üstü kartının gösterildiğini tutan küçük bir dosya indirin. Projeleriniz, proje ayarlarınız ve çerezleriniz (dil, onay, birimler) içinde yer almaz. Başka bir ekranda veya tarayıcıda Dosya, İçe aktar, Çalışma alanı ile yükleyin.';
$ec_lang['lpn_file_import_workspace']='Çalışma alanı…';
$ec_lang['lpn_file_import_workspace_tip']='Dosya, Dışa aktar, Çalışma alanı ile kaydedilmiş bir çalışma alanı dosyasını uygulayın: kutu konumları ve boyutları, yerleştirme, panel boyutları ve bu sayfanın görüntü seçenekleri, örneğin hangi yardım balonlarının ve fare üstü kartının gösterildiği. Projelerinize ve çerezlerinize dokunulmaz.';
$ec_lang['lpn_workspace_exported']='Çalışma alanı {file} dosyasına kaydedildi: {n} ayar.';
$ec_lang['lpn_workspace_imported']='Çalışma alanı {file} dosyasından uygulandı. Uygulanan ayarlar: {n}. Varsayılanlarına döndürülenler: {r}.';
$ec_lang['lpn_workspace_ignored']='Tanınmadığı için yok sayılan girdiler: {u}.';
$ec_lang['lpn_workspace_refused_unreadable']='Bu dosya bir çalışma alanı olarak okunamadı, bu yüzden hiçbir şey değiştirilmedi.';
$ec_lang['lpn_workspace_refused_format']='Bu, bu sayfanın kaydettiği bir çalışma alanı dosyası değil, bu yüzden hiçbir şey değiştirilmedi.';
$ec_lang['lpn_workspace_refused_newer']='Bu çalışma alanı dosyası bu sayfanın daha yeni bir sürümü tarafından kaydedildi (biçim {version}), bu yüzden hiçbir şey değiştirilmedi.';
$ec_lang['lpn_workspace_confirm']='Bu tarayıcının çalışma alanı düzeni, dosyadakiyle değiştirilsin mi?';
$ec_lang['lpn_workspace_refused_storage']='Tarayıcı depolama alanı dolu veya kullanılamıyor, bu yüzden çalışma alanı uygulanmadı.';
$ec_lang['lpn_geojson_refused_local']='Bir GeoJSON dosyası yalnızca enlem ve boylam tutar; bu proje ise Dünya üzerinde yeri olmayan yerel bir ızgarada çizilmiş. Önce Harita, Dünya haritası, Ekle ile coğrafi referanslayın, sonra yeniden dışa aktarın.';
$ec_lang['lpn_geojson_refused_range']='Bu konumlar geçerli enlem ve boylam değil: {detail}';
$ec_lang['lpn_geojson_refused_crs']='Bu projenin koordinat sistemi ({detail}) bu sayfa tarafından tanınmıyor, bu yüzden konumları enlem ve boylama dönüştürülemiyor. Projeyi bu sayfanın tanıdığı bir sisteme kopyalamak için Farklı dönüştür… komutunu kullanın, sonra yeniden dışa aktarın.';
$ec_lang['lpn_geojson_refused_empty']='Henüz dışa aktarılacak bir şey yok. Önce bir şebeke çizin veya açın.';
$ec_lang['lpn_geojson_results_in']='Ekrandaki sonuçlar dahil edilmiştir.';
$ec_lang['lpn_geojson_results_out']='Şebeke çözülmediği için hiçbir sonuç dahil edilmemiştir.';
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
$ec_lang['lpn_inp_backdrop_attach']='{file} dosyasını bağla…';
$ec_lang['lpn_inp_backdrop_attach_tip']='Bir web sayfası görüntüyü adıyla açamaz. Onu cihazınızda seçin; dosyanın belirttiği yere yerleştirilir.';
$ec_lang['lpn_inp_backdrop_attached']='{file} bağlandı, dosyanın belirttiği yere yerleştirildi.';
$ec_lang['lpn_inp_backdrop_attached_other']='{picked} bağlandı, dosyanın belirttiği yere yerleştirildi. Dosya {file} adını veriyor, bu farklı bir ad.';
$ec_lang['lpn_inp_report_lead']='Bu sayfa EPANET\'in kullandığı her şeyi kullanmaz, ama dosyanızdaki hiçbir şey atılmaz. Aşağıda, dosyanızın tuttuğu ve bu sayfanın kullanmadan koruduğu şeyler ile dosya okunurken neyin değiştiği var:';
$ec_lang['lpn_inp_drop_headloss']='Bu dosya Hazen-Williams formülünü kullanmıyor. Bu sayfa Hazen-Williams hesapladığından, boru pürüzlülük sayıları tam olarak yazıldığı gibi korundu, ancak buradaki sonuçlar EPANET\'teki sonuçlarla eşleşmeyecek.';
$ec_lang['lpn_inp_drop_tank_curve']='Bu depolar düz kenarlı değildir: dosya şekillerini bir hacim eğrisi olarak veriyor. Eğri Kitaplıklar kutusunda tutulur, depo hâlâ ona başvurur ve bir zaman dilimi hesaplaması, depo dolup boşalırken seviyeyi hesaplamak için onu kullanır. Tek dönemli bir analiz etkilenmez, çünkü su yüzeyi dosyada belirtilen seviyededir. Dosyadaki çap eğrinin yanında tutulur ve eğrisiz bir depoyu çizmek ve çözmek için kullanılır.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Bu kısma vanaları, dosyada belirtilen kayıpla kısma vanaları olarak aktarıldı.';
$ec_lang['lpn_inp_drop_valve_active']='Bu vanalar basıncı veya debiyi kontrol eder ve durumları hidrolik koşullarla değişir. Veri kaybı olmadan aktarıldılar ve bu sayfa bunları çözer.';
$ec_lang['lpn_inp_drop_valve']='Bu vanalar bir eğriyle veya sabit bir basınç düşüşüyle tanımlanıyor, ve bu sayfada böyle bir öğe yok. Açık borular olarak geldi, bu yüzden şebeke hâlâ bağlı, ancak artık orada basıncı veya debiyi kontrol eden bir şey yok.';
$ec_lang['lpn_inp_drop_cv']='EPANET\'te bu borular suyun yalnızca tek yönde geçmesine izin verir (çek vanalar). Sıradan borular olarak aktarıldılar, bu yüzden artık su içlerinden her iki yönde de akabilir.';
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
$ec_lang['lpn_inp_drop_rules']='Bu dosyada kural tabanlı kontroller var. Bu sayfa bunları okur ve uygular. Model çalıştırıldığında kurallar uygulanır ve içlerindeki her seviye, basınç ve debi bu projenin gösterdiği birimlere çevrilir. Bir kuralı görüntülemek veya düzenlemek için Kitaplıklar altında Kurallar\'ı açın. Kurallar dosyada belirtildiği haliyle aynen korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
$ec_lang['lpn_inp_drop_eps']='Bu dosya bir zaman dilimi hesaplamasını tanımlıyor. Bu sayfanın zaman dilimi hesaplamasını çalıştıran bölümü yüklenmedi, bu yüzden yalnızca başlangıç koşulları geldi.';
$ec_lang['lpn_inp_drop_quality']='Bu dosya su kalitesini tanımlıyor: borulardaki ve depolardaki başlangıç derişimleri ve tepkime hızları. Bu sayfa bu değerleri okur ve kullanır. Ayarlar, Hesaplama, Su kalitesi altında bir kimyasal seçin, sonra çalışma boyunca şebekedeki derişimleri hesaplamak için modeli çalıştırın. Satırlar korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
$ec_lang['lpn_inp_drop_sources_mixing']='Bu dosya, bir kimyasalın şebekeye nerede enjekte edildiğini ve her depoda suyun nasıl karıştığını belirtir. Her kaynak uygulandığı düğümde, her depo da karışım modelini gösterir. İkisi de şebeke bir toplam çalışma süresi boyunca çalıştırıldığında kullanılır.';
$ec_lang['lpn_inp_drop_energy']='Bu EPANET dosyası, pompalama maliyeti modelleme verisi içeriyor. Bu sayfa bunu okuyup kullanıyor. Modeli EPANET motoruyla çalıştırın, sonra her pompanın ne kadar çalıştığını, çektiği gücü, kullandığı enerjiyi ve bunun maliyetini görmek için Su, Raporlar, Pompa enerjisi\'ni açın. Satırlar korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Bu dosya, bazı düğümlerine, borularına veya diğer öğelerine künye atıyor. Her künye tam olarak geldi ve her biri kendi öğesinin özelliklerinde durur; orada okuyabilir veya değiştirebilirsiniz.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Bu dosya EPANET rapor biçimi ayarları içeriyor. Çalıştırma raporu Raporlar, Çalıştırma altında bulunur, ancak bu ayarların belirttiği biçimi değil, standart EPANET biçimini kullanır. Satırlar korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
$ec_lang['lpn_inp_drop_sections']='Bu dosya, bu sayfanın hiç okumadığı bir bölüm içeriyor. Burada kullanılmaz. Bütün olarak korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
$ec_lang['lpn_inp_drop_comments']='Bu dosyanın desenlerindeki veya basit kontrollerindeki bu yorum satırları içe aktarılmadı, çünkü bu sayfada onları tutacak bir yer yok (örneğin bir desenin satırları arasında). Her desen ve kontrol eksiksiz olarak aktarıldı.';
$ec_lang['lpn_inp_drop_quality_options']='Bu dosya EPANET su kalitesi seçeneklerini belirtiyor: su kalitesi analizinin türünü adlandıran Kalite seçeneği ve bir kimyasalla birlikte giden iki ayar, Bağıl difüzivite ve Kalite toleransı. Üçü de korunur ve kullanılır. Su yaşı, kaynak izleme ve bir kimyasal burada hesaplanır; iki kimyasal ayarı ise bir kimyasal çalıştırıldığında kullanılır. Bir EPANET dosyası kaydederseniz hepsi geri yazılır.';
$ec_lang['lpn_inp_drop_file_options']='Bu dosya, koordinatları tutan Harita ya da önceden hesaplanmış hidroliği tutan Hidrolik gibi yardımcı bir dosyaya başvuruyor. Bu sayfa bunlardan hiçbirini açamaz, bu yüzden satırlar oldukları gibi korunur ve bir EPANET dosyası kaydederseniz geri yazılır.';
$ec_lang['lpn_inp_drop_other_options']='Bu dosya, bu sayfanın okumadığı seçenekler belirtiyor. Burada kullanılmazlar. Korunurlar ve bir EPANET dosyası kaydederseniz geri yazılırlar.';
$ec_lang['lpn_inp_drop_net_options']='Bu EPANET .net dosyası, bu sayfanın bir denetimi olmayan ayarlar belirtiyor, bu yüzden değerleri aktarılmak yerine burada listelenir. Geri kalan her şey aktarıldı. Bunlara ihtiyacınız varsa, dosyayı EPANET\'te açın ve bir .inp dosyası olarak kaydetmek için Dosya, Dışa aktar, Şebeke\'yi kullanın, sonra onu içe aktarın.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Bu bir EPANET .net dosyasıydı; bu, EPANET\'in yerel proje biçimidir. Biçimin yayımlanmış bir tanımı yoktur; bu sayfa onu örnek dosyalardan çıkarılan bir biçimle okur, bu yüzden yalnızca elinizde .inp dosyası yokken kullanın. .inp dosyası, diğer programların okuduğu belgelenmiş biçimdir: EPANET\'te bir tane yazmak için Dosya, Dışa aktar, Şebeke\'yi kullanın ve mümkün olduğunda onun yerine o dosyayı içe aktarın.';
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
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
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
// Asked at the one moment the name is useful. Nothing is written to this computer for it; the lock
// broker keeps it in that file's lock record for the holder to read (Tom, 2026-09-29, correcting a
// prompt that said "stored only in this browser").
$ec_lang['lpn_lock_ask_prompt']='Soran kişi olarak kimin adını verelim? Örneğin baş harflerinizi yazın. Bunlar bu dosyanın kilidiyle birlikte sunucumuzda, dosyayı açık tutan herkes için saklanır ve 30 gün içinde silinir.';
$ec_lang['lpn_lock_ask_sent']='Bu dosyayı açık tutan kişiden onu kapatmasını istedik. Sayfası hâlâ açıksa bir dakika içinde görecek. Başka hiçbir şey değişmedi ve dosya, o kapatana kadar hâlâ onun.';
$ec_lang['lpn_lock_ask_failed']='Mesajınız iletilemedi. Ya şu anda bu dosyayı açık tutan kimse yok, ya da sunucuya ulaşılamadı.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='O dosya açılmadı ve burada hiçbir şey değişmedi. Başka biri onu hâlâ açık tutuyor.';
// Task 747: a file copied outside this page keeps its original's document ID, and so its lock. Asked
// whenever this browser cannot guarantee it already knows the file (Tom, 2026-09-30). {date} is when
// the ID was minted, in the visitor's own regional date-time format.
$ec_lang['lpn_copy_title']='Dosya yeni kopya olarak işaretlensin mi?';
$ec_lang['lpn_copy_body']='Bu dosya {date} tarihinde oluşturulduğunu söylüyor ve bu tarayıcı onu tanımıyor. Bu Orijinal dosya mı (aynı kilit korunur), yoksa bir Kopya mı (yeni kilit oluşturulur)?';
$ec_lang['lpn_copy_body_nodate']='Bu tarayıcı bu dosyayı tanımıyor. Bu Orijinal dosya mı (aynı kilit korunur), yoksa bir Kopya mı (yeni kilit oluşturulur)?';
$ec_lang['lpn_copy_original']='Orijinal; aynı kilit korunsun';
$ec_lang['lpn_copy_copy']='Bir kopya; yeni kilit oluşturulsun';
// What "Original" does when the file's id is already open in a tab here with a different file:
// switch to the tab, without changing the tab's file.
$ec_lang['lpn_copy_kept_link']='{name} orijinal olarak, yeni bir yere taşınmış hâlde açıldı. Kaydet artık bu dosyaya yazar.';
// Tom, 2026-10-05: the copy is saved the moment it is chosen, so nobody has to remember to.
$ec_lang['lpn_copy_opened']='{file} bir kopya olarak, yeni bir kilitle açıldı ve kaydedildi.';
// Said only when that save did not happen (permission refused, file gone); the tab stays unsaved.
$ec_lang['lpn_copy_opened_unsaved']='{file} bir kopya olarak açıldı; yeni bir kilitle, ve bu kilit bir sonraki dosya kaydıyla kaydedilecek.';
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
$ec_lang['lpn_msglog_note']='En yeni önce. Bu sayfa açıkken son {n} mesajı tutar ve bunları bilgisayarınızda saklamaz.';
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
$ec_lang['lpn_lock_full_error']='Dikkat: bu sitede kilit kayıtları için depolama alanı kalmadı, bu yüzden başka bir kullanıcı aynı dosyayı aynı anda düzenleyebilir. Bu, bu sayfadan düzeltilemeyen bir sunucu yapılandırma hatasıdır.';
$ec_lang['lpn_lock_not_asked']='Bu proje için kilitleme çalışmıyor, bu yüzden bir meslektaşınızın aynı dosyayı aynı anda düzenlemesini hiçbir şey engellemiyor. Bu projenin henüz bir tanımlayıcısı yok, ve onu bir dosyaya kaydetmek ona bir tanımlayıcı verir.';
$ec_lang['lpn_lock_restored']='Kilitleme yeniden çalışıyor ve bu dosya artık sizin kaydedebileceğiniz bir dosya.';
$ec_lang['lpn_lock_dismiss']='Bu mesajı gizle';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Proje, bu bilgisayardaki bir dosyaya kaydedilecek. Yalnızca siz kaydettiğinizde kaydedilir, başka hiçbir zaman değil.';
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
$ec_lang['lpn_notes_1_def']='Varsayılan olarak şebeke EPANET çözücüsüyle çözülür. Bir toplam çalışma süresi belirlendiğinde her raporlama zaman adımı sırayla hesaplanır: depolar dolar ve boşalır, talepler desenlerini izler ve araç çubuğu çalıştırmayı oynatır. Mümkün olduğunda yerleşik çözücüyü kullan işaretliyken tek anlık bir çözüm yerleşik çözücüyle çözülebilir; ancak uzun süreli bir benzetim veya bir basınç kırıcı ya da genel amaçlı vana (PBV, GPV) içeren bir şebeke her zaman EPANET çözücüsüyle çözülür.';
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
$ec_lang['lpn_notes_2_def']='Dalgalanma ve su darbesi modellenmez: tüm sonuçlar daimi veya yavaş değişen akış içindir, vananın hızla kapanmasının neden olduğu geçici basınç dalgası için değildir.';
$ec_lang['lpn_notes_3_term']='Projeleri kaydetme';
$ec_lang['lpn_notes_3_def']='Her proje bir sekmedir ve çalışırken her sekme bu tarayıcıya kaydedilir. Tarayıcı verilerinin temizlenmesi hepsini siler; bu yüzden çalışma bir dosyada tutulmalıdır: Dosya, Farklı kaydet. Bir sekmedeki yıldız işareti, bir dosyada olmayan değişiklikler taşıdığı anlamına gelir ve o sekmeyi kapatmak önce sorar. Kaydet veya Farklı kaydet seçilmedikçe hiçbir şey asla bir dosyaya yazılmaz. Bazı tarayıcılarda bir proje, kaydedildiği dosyaya bağlanır ve Dosya, Kaydet bundan sonra o aynı dosyaya geri yazar; diğerlerinde bağlantı mümkün değildir, bu yüzden Kaydet devre dışıdır ve yalnızca Farklı kaydet kullanılabilir. Bu site, iki kişi birbirinin üzerine yazmasın diye bir proje dosyasını kimin açık tuttuğunu izler. Bir meslektaşın zaten açık tuttuğu bir dosyayı açmak Sor, Salt okunur aç ve Kilidi kır seçeneklerini sunar. Sunucuya ulaşılamazsa bir uyarı, başka bir kullanıcının aynı dosyayı aynı anda düzenleyebileceğini bildirir.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Pompa eğrisi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Bir pompa H = H₀ − aQ^b denklemini izler; burada H pompanın eklediği yük, Q ise içinden geçen debidir. Eğrinin noktaları Su, Kitaplıklar içinde bir Pompa yükü eğrisi olarak girilir ve pompa o eğriyi Özelliklerde belirtir. Üç nokta — sıfır debideki yük, normal çalışma noktası ve en yüksek debi noktası — H₀, a ve b\'yi doğrudan belirler ve yayımlanmış bir eğriyi en yakından izler. İki nokta, tepe noktası sıfır debide olan bir parabole (b = 2) oturtulur. Tek nokta EPANET\'in kuralını kullanır: sıfır debideki yük girilen yükün 1,33334 katıdır ve en yüksek debi girilen debinin 2 katıdır; bu da yine b = 2 verir. Eğrisi belirtilmemiş bir pompa yük eklemez. Eğri, yükün sıfıra ulaştığı yerde kesilmez; bu yüzden eğrinin sağlayabileceğinden daha büyük bir debi negatif bir yük üretir. Çare daha büyük bir pompa veya daha küçük bir taleptir, farklı bir eğri uydurması değil. Bir eğri üçten fazla nokta tutabilir. EPANET çözücüsüne hepsi verilir ve aralarında enterpolasyon yapar; Denklem satırı ve yerleşik çözücü ise en düşük, orta ve en yüksek noktaları kullanır.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='Tablo sütunları yardımı';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE -- the Hide/Show row beside it names the
// identical menu. **GESTURE FIRST, THEN ACTION, SINCE 2026-10-06** (Ida, User guide): the cells were
// swapped in all 27 files, by script and unchanged, so this table reads in the same order as the
// key-then-action tables beside it (lpn_notes_7_def, lpn_hotkeys_map_def).
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Başlığa tıklayın</td><td>Sütun seç</td></tr><tr><td>Başka bir başlığa Ctrl+tıklama veya Shift+tıklama yapın</td><td>Sütun seçimini ekle veya genişlet</td></tr><tr><td>Sürükleyin ya da sağ tık veya ⋮ menüsünde Sütunları yönet…\'i kullanın</td><td>Seçili sütun(lar)ı taşı (yeniden sırala)</td></tr><tr><td>Bir başlığın üst köşesinin üzerine gelin, ya da bir başlığı seçin veya Tab ile içine girin</td><td>⋮ menüsü ve sıralama oku.</td></tr><tr><td>Başlığa sağ tıklayın ya da başlığın sağ üst köşesindeki ⋮ menüsü</td><td>Gizle, Tümünü göster, ya da görünürlüğü ve sırayı yönet</td></tr><tr><td>Başlığın sağ üst köşesindeki ok simgesi</td><td>Sütuna göre sırala</td></tr><tr><td>Sağ tık, başlığın sağ üst köşesindeki ⋮ menüsü, ya da Ctrl+Shift+V</td><td>Tablonun sonuna yeni satır olarak yapıştır</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Tablo klavye kısayolları';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Ok tuşları</td><td>Gezinin.</td></tr><tr><td>Tab, Enter</td><td>Girişi tamamlayın ve bir hücre yana (Tab) veya aşağı (Enter) geçin.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Bir hücre geri (Shift+Tab) veya yukarı (Shift+Enter) geçin.</td></tr><tr><td>Shift+ok tuşları</td><td>Seçimi genişletin.</td></tr><tr><td>Ctrl+C</td><td>Seçimi kopyalayın.</td></tr><tr><td>Ctrl+D</td><td>Seçimi en üst satırından aşağı doldurun.</td></tr><tr><td>Ctrl+Enter</td><td>Seçimi etkin hücrenin değeriyle doldurun.</td></tr><tr><td>Ctrl+A</td><td>Tüm tabloyu seçin.</td></tr><tr><td>Ctrl+Shift+V</td><td>Tablonun sonuna yeni satır olarak yapıştırın.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Sonraki veya önceki sekmeye geçin; tablo da olsa grafik de olsa.</td></tr><tr><td>Delete</td><td>Etkin hücreyi temizleyin. Seçili bir aralığı temizlemek için sağ tıklayıp Sil\'i seçin.</td></tr><tr><td>F2</td><td>Bir hücreyi düzenlemek için açın.</td></tr><tr><td>Esc</td><td>Bir düzenlemeyi iptal edin.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Renk bandı sınırları aynı kalır';
$ec_lang['lpn_notes_color_def']='Renk bandı sınırları, bir veri sınıflandırma yöntemi seçildiğinde belirlenir. Her zaman adımında yeniden belirlenmez, çünkü bu, renklerin her adımda yeni bir şey ifade etmesine yol açar ve bu, bir sistemi görselleştirmek için yararlı değildir. Bir senaryo Temelin sınırlarını gösterir. EPANET de aynı şekilde çalışır. Yeni sınırlar almak için bir yöntemi yeniden seçin veya sınırları girin.';
$ec_lang['lpn_notes_engine_term']='Bu sayfa hangi EPANET\'i çalıştırıyor';
$ec_lang['lpn_notes_engine_def']='Bu sayfadaki EPANET çözücüsü, 20 Şubat 2025\'te yayımlanan OWA-EPANET 2.3.5\'tir. EPANET, Aralık 2019\'da 2.2.0 sürümünü yayımlayan Amerika Birleşik Devletleri Çevre Koruma Ajansı ile çalışan bir topluluk olan Open Water Analytics tarafından geliştirilir. Çalışma raporu ona 2.3.05 der, çünkü motor son sayıyı iki basamakla yazar. Bu sayfaya, Luke Butler\'ın MIT lisansı altındaki epanet-js 0.9.0\'ı üzerinden ulaşır ve tarayıcınızın içinde çalışır: şebekeniz çözülmek üzere hiçbir yere gönderilmez.';
// The Notes example (Task 785). Held by dev/lpn-spike/user-guide-notes-harness.js.
$ec_lang['lpn_guide_nt_example_term']='Net1 üzerinde örnek: eğrisinin ötesindeki bir pompa';
$ec_lang['lpn_guide_nt_example_def']='Net1 örneğini açın ve Su, Kitaplıklar öğesini seçin. Pump 9 için Pump Curve olan 1 numaralı eğri tek noktalıdır: 250 ft\'te 1500 gpm. Sıfır debideki yük 333,3 ft ve en yüksek debi 3000 gpm\'dir. Eğrinin sonunun ötesinde olan 3500 gpm\'de eğri −120,4 ft yük verir. EPANET çözücüsü aynı yükü, pompa boyunca 120,4 ft\'lik bir kayıp olarak bildirir ve pompaların yeterli debi veya yük sağlayamadığı konusunda uyarır.';
// The user manual's own entry (Task 785). Held by dev/lpn-spike/user-guide-own-harness.js.
$ec_lang['lpn_guide_own_example_term']='Net1 üzerinde örnek';
$ec_lang['lpn_guide_own_example_def']='<p>Net1 örneğini açın, Ctrl+K tuşlarına basın ve critical yazın. Menüler, Su, Analiz altındaki Kritiklik analizi… satırını gösterir. Kutular, ondan söz eden girdileri gösterir; bunların arasında Bul ve değiştir, Yangın debisi analizi ve Kritiklik analizi ile bu girdi vardır. Satırı seçmek Kritiklik analizi…\'nin Analiz menüsünde nerede olduğunu gösterir ve onu çalıştırmaz.</p>';
$ec_lang['lpn_id_invalid']='Boşluk ve tırnak işareti içermeyen bir kimlik girin.';
$ec_lang['lpn_id_taken']='Bu kimlik zaten kullanılıyor.';
$ec_lang['lpn_diag_no_fixed_head']='Bir rezervuar veya depo ekleyin. Şebekenin çözülebilmesi için en az bir bilinen su seviyesine ihtiyacı var.';
$ec_lang['lpn_diag_dangling_link']='Bir boru veya pompa, artık var olmayan bir düğüme bağlanıyor:';
$ec_lang['lpn_diag_unreachable']='Bu düğümlerin bir rezervuara veya depoya giden yolu yok:';
// Tom, 2026-10-09: a node nothing connects to a source is left out of the run, not refused. The
// ids stand in the status bar until the network changes. Said in EPANET's own terms (junction,
// reservoir, tank) and never as an error, because the run happened.
$ec_lang['lpn_omitted_note']='Bu çalıştırmanın dışında bırakıldı, çünkü onlardan bir rezervuara veya depoya giden yol yok: {ids}';
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
$ec_lang['lpn_engine_unavailable']='Basınç kırıcı ve genel amaçlı vanaları (PBV, GPV) çözmek için gerekli olan EPANET çözücüsü indirilemedi. İnternete bir kez bağlandıktan sonra çözücü bu cihazda saklanır.';
// The cause-specific sibling: {reason} is lpn_time_engine_fetch_failed (only a download can reach this notice).
// Offline keeps the sentence above. {wrong} in lpn_time_engine_run_failed is filled with lpn_wrong_btn.
$ec_lang['lpn_engine_unavailable_why']='Basınç kırıcı ve genel amaçlı vanalar (PBV, GPV) EPANET çözücüsü olmadan çözülemez. {reason}';
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
$ec_lang['lpn_engine_needed_failed_why']='Bu şebeke yalnızca EPANET çözücüsüyle çözülebilir. {reason}';
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
// Task 643 (Tom, 2026-10-14): an Auto length is the slope distance. No claim about accuracy (Task 641).
$ec_lang['lpn_field_length_slope_tip']='Boru uzunluğu. Otomatik işaretliyken uzunluk eğim boyunca ölçülür: çizilen uzunluk ile iki uç düğüm arasındaki kot farkı birleştirilir.';
$ec_lang['lpn_field_from']='Başlangıç';
$ec_lang['lpn_field_to']='Bitiş';
// Tom, 2026-10-09: From and To are editable text. Said in the box a refused ID is said in.
$ec_lang['lpn_link_end_unknown']='{id} kimliğine (ID) sahip bir düğüm yok.';
$ec_lang['lpn_link_end_same']='Başlangıç ve Bitiş farklı düğümler olmalıdır.';
// Tom, 2026-10-09: "Break link for node?", adapted to name the pipe. The two answers are Yes and No
// because No is not a cancel: it places the node where it was pressed, joined to nothing.
$ec_lang['lpn_split_pipe_ask']='{id} borusu bu düğümde bölünsün mü?';
$ec_lang['lpn_split_yes']='Evet';
$ec_lang['lpn_split_no']='Hayır';
// Object snap (Task 782). The tip beside the snap glyph on a pipe vertex: "Pipe 10, vertex 2". A node
// or a pipe is named by its type word and ID alone.
$ec_lang['lpn_snap_vertex']='{link}, kırılma noktası {n}';
// A tank, reservoir or junction snapped onto a node of another type is placed at exactly that
// position. Two nodes at one point are legal in EPANET, and the map cannot show that they are separate.
$ec_lang['lpn_snap_node_on_node']='{new}, {target} konumuna yerleştirildi. İki düğüm bağlı değil.';
// The same, for a node DRAGGED onto another node.
$ec_lang['lpn_snap_moved_on_node']='{moved}, {target} konumuna taşındı. İki düğüm bağlı değil.';
// The Shape (Task 779): map annotation, a point, a polyline or a polygon. Tom, 2026-10-06: "Either
// way, we call it a 'Shape'". The tip beside the snap glyph on a Shape point: "Shape S1, point 2".
$ec_lang['lpn_snap_shape_point']='{shape}, nokta {n}';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Vana tipi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Vana türü. Bir kısma vanası (TCV) sabit bir kayıp uygular. PRV, PSV ve FCV bir basıncı veya debiyi korur; hidrolik koşullar değiştikçe tam açılır, kapanır veya kısmen kapanır. Bir PBV sabit bir basıncı giderir ve bir GPV bir yük kaybı eğrisini izler. Türler farklı hidrolik özellikleri denetler, bu yüzden tür değiştirildiğinde ayarlar kaybolabilir.';
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
$ec_lang['lpn_inp_drop_gpv_curve']='Bu vana, dosyada bulunmayan bir yük kaybı eğrisine başvuruyor. Vana eğrisiz içe aktarıldı, bu yüzden bir eğri seçilene kadar tam açık kalır.';
$ec_lang['lpn_gpv_curve_source']='Vana yük kaybı eğrisi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Kitaplıklar kutusunda, bu vanadan geçen yük kaybını her debide veren eğri. Birden çok vana aynı eğriyi kullanabilir ve onu orada düzenlemek hepsini değiştirir.';
$ec_lang['lpn_field_valve_setting_pressure']='Basınç ayarı';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Bir basınç düşürücü vana, mansap tarafındaki basıncı bu değerde veya altında tutar. Bir basınç sürdürücü vana, memba tarafındaki basıncı bu değerde veya üstünde tutar.';
$ec_lang['lpn_field_valve_setting_flow']='Debi ayarı';
$ec_lang['lpn_field_valve_setting_flow_tip']='Vananın geçirdiği en fazla su. Bundan daha az su geçmek istediğinde, vana tam açık durur ve hiçbir kayıp eklemez.';
$ec_lang['lpn_field_valve_setting']='Ayar';
$ec_lang['lpn_field_valve_setting_loss']='Kayıp katsayısı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Kısma vanasının, hız yükünün bir katı olarak sayılan, ne kadar yük giderdiği. Tam açık duran bir vana için 0 kullanın. Bu tek sayı, bir kısma vanasının kaybının tamamıdır.';
$ec_lang['lpn_field_valve_diameter_tip']='Vananın içinden geçen açıklığın genişliği. Suyun vanadan geçiş hızı bu genişlikten hesaplanır, ve kayıp bu hızdan çıkarılır.';
$ec_lang['lpn_field_valve_km_tip']='Vana ayarının giderdiğinin üzerine, vana tam açık dururken vana gövdesinden kaynaklanan kayıp. Hız yükünün bir katı olarak sayılır. Yoksaymak için 0 kullanın.';
$ec_lang['lpn_field_km']='Küçük (yerel) kayıp katsayısı, k';
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
$ec_lang['lpn_pump_curve_source_tip']='Kitaplıklar kutusunda, bu pompanın her debide eklediği yükü veren eğri. Birden çok pompa aynı eğriyi kullanabilir ve onu orada düzenlemek hepsini değiştirir.';
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
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Künye';
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
$ec_lang['lpn_field_tag_tip']='Bir künye, bir basınç bölgesi veya bir iş emri gibi istediğiniz herhangi bir anlamı taşıyabilir. Ne burada ne de EPANET\'te hiçbir hesaplama onu okumaz. Bir künye tek bir sözcüktür: EPANET ilk boşlukta okumayı durdurur, bu yüzden yazarken bir boşluk reddedilir. EPANET dosyasına ve ondan geri taşınır.';
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
$ec_lang['lpn_mode_select']='Mod: Seç. Görmek veya değiştirmek için bir öğe, bir etiket ya da bir Metin seçin. Bir düğümü, bir etiketi veya bir Metni taşımak için sürükleyin. Bir borudaki bükümleri eklemek veya kaldırmak için Kırılma noktaları aracını kullanın.';
$ec_lang['lpn_mode_delete']='Mod: Sil. Kaldırmak için bir öğe seçin.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Mod: Kırılma noktaları. Her borunun kırılma noktaları küçük kare tutamaçlar olarak gösterilir. Bir kırılma noktası eklemek için bir boru üzerinde nokta belirtin, kaldırmak için bir tutamaç seçin veya taşımak için bir tutamacı sürükleyin. Bu modda haritada başka hiçbir şey değiştirilemez.';
$ec_lang['lpn_mode_zoom_window']='Mod: Pencere yakınlaştır. Yakınlaştırmak için haritada bir kutunun iki karşı köşesini belirtin veya birini sürükleyin.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Hiçbir şey seçili değil. Önce haritada bir öğe seçin, sonra Sil\'e basın.';
$ec_lang['lpn_mode_add_junction']='Mod: Düğüm Ekle. Bir düğüm yerleştirmek için haritada bir konum belirtin. Öğeleri, etiketleri ve Metinleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_reservoir']='Mod: Rezervuar Ekle. Bir rezervuar yerleştirmek için haritada bir konum belirtin. Öğeleri, etiketleri ve Metinleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_tank']='Mod: Depo Ekle. Bir depo yerleştirmek için haritada bir konum belirtin. Öğeleri, etiketleri ve Metinleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_pipe']='Mod: Boru Ekle. Bağlamak için bir başlangıç düğümünü, ardından bir bitiş düğümünü seçin. Çizgiyi bükmek için aradaki boş yerde noktalar belirtin ya da yeniden başlamak için Esc tuşuna basın. Öğeleri, etiketleri ve Metinleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_pump']='Mod: Pompa Ekle. Bağlamak için bir başlangıç düğümünü, ardından bir bitiş düğümünü seçin. Çizgiyi bükmek için aradaki boş yerde noktalar belirtin ya da yeniden başlamak için Esc tuşuna basın. Öğeleri, etiketleri ve Metinleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_valve']='Mod: Vana Ekle. Bağlamak için bir başlangıç düğümünü, ardından bir bitiş düğümünü seçin. Çizgiyi bükmek için aradaki boş yerde noktalar belirtin ya da yeniden başlamak için Esc tuşuna basın. Öğeleri, etiketleri ve Metinleri değiştirmek veya taşımak için Seç moduna geçin.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Mod: Metin Ekle. Bir Metin yerleştirmek için haritada bir konum belirtin. Metni bir düğüme bağlamak için düğümün yakınında bir konum belirtin. Öğeleri, etiketleri ve Metinleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_chain']='Mod: Düğüm Boru Zinciri. Bir düğüm eklemek için haritada bir nokta belirtin, sonra her bir sonraki noktayı belirterek bir boru ve bir düğüm ekleyin. Oradan devam etmek için mevcut bir düğümü belirtin. Zinciri bitirmek için Esc tuşuna basın. Öğeleri, etiketleri ve Metinleri değiştirmek veya taşımak için Seç moduna geçin.';
$ec_lang['lpn_mode_add_shape']='Mod: Figür Ekle. Her noktayı belirtin. Bitirmek için son noktayı yeniden belirtin veya Enter tuşuna basın; çokgeni kapatmak için ilk noktayı belirtin.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Harita öğelerini değiştirmek, taşımak ve sürüklemek ya da haritayı kaydırmak için bu modu kullanın. Bu, harita için varsayılan moddur. Esc tuşuna ikinci kez basmak, seçili olan her şeyin seçimini kaldırır.';
// Edited by TGH 2026-09-07
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
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Tümüne uygula';
$ec_lang['lpn_settings_apply_to_all_tip']='Bu türden zaten çizilmiş her öğe, bu metinle başlayan bir kimlik alır. Her biri kendi numarasını korur. Bir sayıyla bitmeyen kimlik olduğu gibi bırakılır.';
$ec_lang['lpn_confirm_apply_prefix']='Öğeler ({n}) kimlikleri {prefix} ile başlayacak şekilde yeniden adlandırılsın mı? Her biri kendi numarasını korur.';
$ec_lang['lpn_prefix_applied']='Yeniden adlandırılan öğeler: {n}. Değiştirilmeyen öğeler: {skipped}.';
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
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='Bir etiket sığmadığında değerlerin bırakılma sırası. 1 numaralı değer önce bırakılır. Yalnızca bir değer kaldığında ve iki etiket hâlâ çakışıyorsa, bunlardan biri gizlenir: talebi daha düşük olan, basıncı aralığın ortasına daha yakın olan, ya da kotu veya yükü komşu düğümlerinkine daha çok benzeyen.';
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
$ec_lang['lpn_backdrop_scale_from_prompt1']='Arka plan görüntüsünde olduğu yerde kalması gereken noktayı belirtin.';
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
$ec_lang['lpn_map_attach_remove_tip']='Dünya haritasını kaldırır. Şebekeyi etkilemez.';
$ec_lang['lpn_map_attach_done']='Dünya haritası artık çiziminizin arkasında ve projeniz değişmedi. Onu tekrar kaldırmak için Harita, Dünya haritası, Kaldır\'ı kullanın.';
// Edited by TGH 2026-10-07
$ec_lang['lpn_map_attach_removed']='Dünya haritası kaldırıldı ve şebeke etkilenmedi.';
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
$ec_lang['lpn_mapgeo_dial_help']='Haritayı büyütüp küçültmek ve döndürmek için iki çubuğu kaydırın ya da üstlerindeki kutulara sayı yazın. Her çubuğun ortası 1. adımdaki yerleşimi korur, bu yüzden 1 boyut ve 0 dönüş değişiklik yok anlamına gelir. Ok tuşları her ikisinde de çalışır.';
$ec_lang['lpn_mapgeo_place']='Yaklaşık yerleştir';
$ec_lang['lpn_mapgeo_finish']='Burada coğrafi referans ver';
$ec_lang['lpn_mapgeo_cancelled']='Dünya haritası olduğu yere geri döndü ve çiziminiz hiç hareket etmedi.';
$ec_lang['lpn_mapgeo_locked']='Projeleri değiştirmeden veya kaydetmeden önce Burada coğrafi referans ver düğmesiyle bitirin, ya da İptal\'e basın. Dünya haritası hâlâ yerleştiriliyor.';
$ec_lang['lpn_backdrop_scale_prompt1']='Arka plan görüntüsü üzerinde iki nokta belirtin, örneğin bir ölçek çubuğunun iki ucu. Ardından aralarındaki gerçek mesafeyi yazın.';
$ec_lang['lpn_backdrop_scale_prompt2']='İki nokta arasındaki gerçek mesafe';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Taşıma için taban noktasını (görüntü üzerinde) belirtin.';
$ec_lang['lpn_backdrop_position_prompt2']='Hedef nokta için yöntemi seçin, ardından Devam et düğmesine basın.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Arka plan görüntüsü ayarlanıyor.';
$ec_lang['lpn_backdrop_target_label']='Şuraya taşı:';
$ec_lang['lpn_backdrop_target_node']='Bir düğüm';
$ec_lang['lpn_backdrop_target_free']='Harita üzerinde herhangi bir nokta';
$ec_lang['lpn_backdrop_target_coords']='Yazılan koordinatlar';
$ec_lang['lpn_backdrop_coords_prompt']='O noktanın taşınacağı X,Y\'yi yazın';
$ec_lang['lpn_backdrop_continue']='Devam et';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// One key for the toolbar button, the Project menu row and the Settings box's own title (Task 699).
$ec_lang['lpn_tool_settings']='Ayarlar';
$ec_lang['lpn_settings_show_titles']='Sayfa başlıklarını göster';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Bu başlıkları gizle';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Seçim yardımını göster';
$ec_lang['lpn_settings_area_hint_tip']='Bir alan seçerken bir sonraki adımı veren istemi haritanın üzerinde gösterir.';
$ec_lang['lpn_settings_hover_card']='Üzerine gelince tüm özellikleri göster';
$ec_lang['lpn_settings_hover_card_tip']='İşaretçiyi bir düğümün, hattın veya müşterinin üzerinde tutarak tüm özelliklerini Ayarlarda belirtilen biçimde, her ölçekte ve etiket haritaya sığsın ya da sığmasın görün. Bu, proje için değil, bu tarayıcı için bir ayardır.';
// Task 805 (Tom, 2026-10-15, R-396: "It would be good to be able to hide the amber override
// indicators from the map. Maybe a Map, Clean map button is a good idea after all"). The rings'
// own switch, in Settings, Map and page, Page; and the Map menu row that hides them with the
// controls over the drawing. Both are browser settings.
$ec_lang['lpn_settings_override_marks']='Senaryo değeri işaretlerini haritada göster';
$ec_lang['lpn_settings_override_marks_tip']='Açık senaryoda bir senaryo değeri olan varlıkta kehribar renkli halkayı ve bir tane devralan varlıkta kesikli gri halkayı gösterir. Tablolar paneli senaryo değerlerini her iki durumda da işaretler. Harita, Temiz harita işaretliyken halkaları gizler. Bu, proje için değil, bu tarayıcı için bir ayardır.';
$ec_lang['lpn_clean_map']='Temiz harita';
$ec_lang['lpn_clean_map_tip']='İşaretliyse: yakınlaştırma düğmeleri, sokak haritası ve uydu düğmesi, Mesajlar düğmesi ve bildirimler, seçim yardımı, geri bildirim düğmesi ve senaryo değeri halkaları gizlenir. İşaretsizse: gösterilir. Hatalar yine haritada gösterilir ve her bildirim yine Mesajlarda tutulur. Bu, proje için değil, bu tarayıcı için bir ayardır.';
$ec_lang['lpn_settings_theme']='Tema';
$ec_lang['lpn_settings_theme_tip']='Sayfa için açık veya koyu renkleri seçin. Sistem, cihazınızın ayarını izler. Harita çizimi her temada aynı görünür. Bu, proje için değil, bu tarayıcı için bir ayardır.';
$ec_lang['lpn_theme_system']='Sistem';
$ec_lang['lpn_theme_light']='Açık';
$ec_lang['lpn_theme_dark']='Koyu';
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
$ec_lang['lpn_cp_validate_tip']='Şu şekilde doğrula: Geçerli bir değerin sahip olması gereken biçim. Büyük/küçük harf kuralları yalnızca İngiliz alfabesi için geçerlidir. Her değeri kabul etmek için Doğrulama yapma\'yı seçin.';
$ec_lang['lpn_cp_restrict']='Bu karakterleri kısıtla';
$ec_lang['lpn_cp_restrict_tip']='Bu karakterleri kısıtla:';
$ec_lang['lpn_cp_allow_tip']='Yalnızca bu karakterlere izin ver:';
$ec_lang['lpn_cp_characters_tip']='"@" herhangi bir harf, "#" herhangi bir sayısal basamak demektir; "-", "." ve "," izinliyse ayrıca listelenmelidir; boşluk karakterleri ise diğer karakterlerin arasında olmalıdır.';
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
$ec_lang['lpn_valwarn_diameter']='Bir boru veya vana çapı normalde {min} ile {max} {unit} arasındadır. Sayıyı ve çap birimini kontrol edin.';
$ec_lang['lpn_valwarn_hw']='Bir Hazen-Williams C değeri normalde {min} ile {max} arasındadır. Bu aralığın dışındaki bir sayı çoğunlukla başka bir sürtünme yöntemi için olan bir pürüzlülüktür.';
$ec_lang['lpn_valwarn_manning']='Bir Manning n değeri normalde {min} ile {max} arasındadır. Bu aralığın dışındaki bir sayı çoğunlukla başka bir sürtünme yöntemi için olan bir pürüzlülüktür.';
$ec_lang['lpn_valwarn_dw']='Bir Darcy-Weisbach pürüzlülüğü normalde 0\'dan büyük ve en çok {max} {unit} olur. Daha büyük bir sayı çoğunlukla bir Hazen-Williams C veya bir Manning n değeridir.';
$ec_lang['lpn_valwarn_positive']='EPANET burada sıfır veya negatif bir sayıyı kabul etmez.';
$ec_lang['lpn_valwarn_negative']='EPANET burada negatif bir sayıyı kabul etmez.';
$ec_lang['lpn_valwarn_tank_levels']='EPANET bu depoyu kabul etmez. En düşük su derinliği su derinliğini aşmamalı, su derinliği de en yüksek su derinliğini aşmamalıdır.';
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
$ec_lang['lpn_scenario_overrides']='Senaryo değeri sayısı';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Kehribar renkli halka, bu öğenin yalnızca {name} senaryosuna ait bir değer taşıdığı anlamına gelir.';
$ec_lang['lpn_scenario_mark_inh_tip']='Kesikli gri halka, {name} senaryosunun bu varlık için üst senaryosundan veya alternatifinden bir senaryo değeri devraldığı anlamına gelir.';
$ec_lang['lpn_scenario_overrides_tip']='Bu değerlerin her biri haritada kehribar renkli bir halkayla işaretlenir. Bunlar olmadan çizimi görmek için {base}\'e geçin.';
$ec_lang['lpn_scenario_menu']='Senaryolar';
$ec_lang['lpn_scenario_tip']='Çizimin şu anda gösterdiği ve sayfanın şu anda çözdüğü değerler kümesi. Senaryo değiştirmek, ya da bir tanesini eklemek, yeniden adlandırmak veya silmek için tıklayın.';
$ec_lang['lpn_scenario_new']='Yeni senaryo…';
$ec_lang['lpn_scenario_new_name']='Senaryo {n}';
$ec_lang['lpn_scenario_prompt_name']='Bu senaryo için ad';
$ec_lang['lpn_scenario_rename']='Senaryoyu yeniden adlandır…';
$ec_lang['lpn_scenario_delete']='Senaryoyu sil';
$ec_lang['lpn_scenario_delete_ask']='{name} senaryosu silinsin mi? Çizimin kendisi değişmez.';
$ec_lang['lpn_scenario_delete_goes']='Senaryo değerleri ({n}) onunla birlikte silinir.';
$ec_lang['lpn_scenario_delete_stays']='Kullandığı bu alternatifler projede kalır: {list}.';
$ec_lang['lpn_scenario_delete_has_children']='{name} senaryosu silinemez, çünkü alt senaryoları var: {list}. Önce onları silin veya başka bir üst senaryoya taşıyın.';
// Edited by TGH 2026-09-07
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Temel senaryo: {value}';
$ec_lang['lpn_scenario_deactivated']='{id}, {scenario} içinde şebeke dışında. Hâlâ çizimde ve diğer senaryolarınızda bulunuyor.';
$ec_lang['lpn_scenario_delete_in_base']='Çizimden kaldırmak için {base} senaryosunda silin.';
$ec_lang['lpn_scenario_only_deleted']='{id} silindi. Yalnızca {scenario} senaryosunun parçasıydı.';
$ec_lang['lpn_scenario_delete_blocked']='{id} silinmedi, çünkü {link} hattı onda bitiyor ve bu hat {scenario} dışında da var. İkisini birden silmek için {base} senaryosunda silin.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_basic']='Temel mod';
$ec_lang['lpn_scenario_basic_tip']='İşaretliyse: alternatifler gizli ve otomatiktir, her senaryo senaryo değerlerini kendisine ait gösterir ve tüm yeni senaryolar Temel senaryonun alt senaryosudur; Senaryo yöneticisi ve Senaryolar tablosu gösterilmez. İşaretsizse: Senaryo yöneticisi ve Senaryolar tablosu gösterilir ve alternatifler senaryolar arasında paylaşılabilir. Temel mod açıkken Senaryo yöneticisi devre dışıdır. Temel mod, bir projenin Temel modun gösteremediği senaryo ve alternatif ilişkileri varsa devre dışıdır.';
$ec_lang['lpn_scenario_basic_misfit']='Bu projede Senaryolar Temel moduyla uyumlu olmayan senaryo ve alternatif ilişkileri var; bu nedenle Temel mod devre dışıdır.';
$ec_lang['lpn_scenario_basic_misfit_base']='Temel senaryo, Temel dışında bir alternatif kullanıyor.';
$ec_lang['lpn_scenario_copy']='Senaryoyu kopyala';
$ec_lang['lpn_scenario_copy_tip']='Açık senaryoyu ve senaryo değerlerini kopyalar ve kopyayı açar.';
$ec_lang['lpn_scenario_copy_off']='Senaryoyu kopyala, Temel modda çalışır. Temel mod kapalıyken bir senaryo ekleyin ve alternatiflerini Senaryolar tablosunda seçin.';
$ec_lang['lpn_sm_title']='Senaryo yöneticisi';
$ec_lang['lpn_sm_menu']='Senaryo yöneticisi…';
$ec_lang['lpn_sm_basic_on']='Temel mod açıkken Senaryo yöneticisi devre dışıdır.';
$ec_lang['lpn_pane_tab_scenarios']='Senaryolar';
$ec_lang['lpn_sm_col_parent']='Üst';
$ec_lang['lpn_sm_add_child']='Alt öğe ekle';
$ec_lang['lpn_sm_add_base']='Temel ekle';
$ec_lang['lpn_sm_add_base_tip']='Başka bir Temel senaryo ekler. Temelin bir kopyası olarak, kendi alternatifleriyle başlar ve Temelde sonradan yapılan düzenlemeler onu değiştirmez.';
$ec_lang['lpn_sm_add_base_alt_tip']='Başka bir Temel alternatif ekler. Temelin bu kategorideki değerlerinin bir kopyası olarak başlar ve Temelde sonradan yapılan düzenlemeler onu değiştirmez.';
$ec_lang['lpn_sm_delete']='Seçili öğeyi siler. Kullanımdaki bir öğe silinmez.';
$ec_lang['lpn_sm_base_kept']='Bir ağacın Temeli silinmez. Temel ekle ile eklenen başka bir Temel, hiçbir şey onu kullanmadığında silinir.';
$ec_lang['lpn_sm_rename']='Yeniden adlandır';
$ec_lang['lpn_sm_rename_alts_ask']='Aynı adlı alternatifler de yeniden adlandırılsın mı?';
$ec_lang['lpn_sm_make_current']='Geçerli yap';
// Tips on greyed Scenario manager commands, saying why they are greyed (Perry, 2026-10-11).
$ec_lang['lpn_sm_current_already']='Bu senaryo zaten geçerli senaryodur.';
$ec_lang['lpn_sm_none_selected']='Önce ağaçta bir öğe seçin.';
$ec_lang['lpn_sm_base_named']='Bir ağacın Temeli yeniden adlandırılmaz.';
$ec_lang['lpn_sm_copy']='Kopyala';
$ec_lang['lpn_sm_merge_up']='Yukarı birleştir';
$ec_lang['lpn_sm_merge_up_tip']='Seçili alternatifin senaryo değerlerini ağaçta üstündeki bir alternatife taşır. Seçili alternatif bu değerleri sonra devralır.';
$ec_lang['lpn_sm_merge_up_root']='Bir Temel alternatifin üstünde birleştirilecek bir şey yoktur.';
$ec_lang['lpn_sm_merge_none']='{name} alternatifinin birleştirilecek senaryo değeri yok.';
$ec_lang['lpn_sm_merge_pick']='{name} senaryo değerleri hangi alternatife birleştirilsin? Üstü ilk sırada listelenir.';
$ec_lang['lpn_sm_merge_ask']='{name} senaryo değerleri ({n}) {target} içine taşınsın mı? Sonrasında bunları değiştirmek yerine devralır. Bunu geri alabilirsiniz.';
$ec_lang['lpn_sm_merge_skipped']='{between} de bu değerleri değiştiriyor. Atlanır ve değiştirilmez; bu yüzden {name} bunları {target} yerine {between} alternatifinden okuyacak:';
$ec_lang['lpn_sm_merge_line']='{asset}: {property}';
$ec_lang['lpn_sm_copy_up']='Yukarı kopyala';
$ec_lang['lpn_sm_copy_up_tip']='Seçili alternatifin senaryo değerlerini ağaçta üstündeki bir alternatife kopyalar. Seçili alternatif senaryo değerlerini korur.';
$ec_lang['lpn_sm_copy_up_root']='Bir Temel alternatifin üstünde kopyalanacak bir yer yoktur.';
$ec_lang['lpn_sm_copy_none']='{name} alternatifinin kopyalanacak senaryo değeri yok.';
$ec_lang['lpn_sm_copy_pick']='{name} senaryo değerleri hangi alternatife kopyalansın? Üstü ilk sırada listelenir.';
$ec_lang['lpn_sm_copy_ask']='{name} senaryo değerleri ({n}) {target} içine kopyalansın mı? {name} bunları kendi senaryo değerleri olarak korur. Bunu geri alabilirsiniz.';
$ec_lang['lpn_sm_copy_skipped']='{between} de bu değerleri değiştiriyor. Atlanır ve değiştirilmez; bu yüzden bunlar için kendi değerlerini korur:';
$ec_lang['lpn_sm_list_overrides']='Senaryo değeri yöneticisi…';
$ec_lang['lpn_sm_list_overrides_tip']='Senaryonun senaryo değerlerini kategoriye göre, her birini değiştirdiği devralınan değerle birlikte listeler ve herhangi birini temizlemeyi sağlar.';
$ec_lang['lpn_sm_list_overrides_none']='Bu senaryonun senaryo değeri yok.';
$ec_lang['lpn_ovl_title']='Senaryo değeri yöneticisi: {name}';
$ec_lang['lpn_ovl_note']='Bunlar bu senaryonun kullandığı alternatiflerde kendisinin belirlediği değerlerdir; her biri değiştirdiği değerle birlikte gösterilir. Devraldığı değerler ne listelenir ne de sayılır. Devralınan değeri geri yüklemek için bir senaryo değerini temizleyin; Geri al bunu geri alır. Haritada varlığa gitmek için bir ID seçin.';
$ec_lang['lpn_ovl_clear_selected']='Seçili senaryo değerlerini temizle';
$ec_lang['lpn_ovl_clear_all']='Tüm senaryo değerlerini temizle';
$ec_lang['lpn_ovl_clear_all_ask']='{name} senaryosunun tüm senaryo değerleri ({n}) temizlensin mi? Her değer devralınan değere döner. Geri al bunu geri alır.';
$ec_lang['lpn_ovl_pick_tip']='Bu senaryo değerini Seçili senaryo değerlerini temizle düğmesi için seçin.';
$ec_lang['lpn_ovl_bubble_off']='Haritada değil';
$ec_lang['lpn_ovl_bubble_moved']='{quantity}, taşındı veya yeniden boyutlandırıldı';
$ec_lang['lpn_ovl_group']='{category}: {alternative}';
$ec_lang['lpn_ovl_col_override']='Senaryo değeri';
$ec_lang['lpn_ovl_col_inherited']='Devralınan değer';
$ec_lang['lpn_ovl_col_inherited_tip']='Bu senaryonun senaryo değeri olmadan okuduğu değer: alternatifin üstünün değeri veya Temel değer.';
$ec_lang['lpn_ovl_same']='(aynı)';
$ec_lang['lpn_ovl_same_tip']='Devralınan değere eşit. Yine de bir senaryo değeridir ve sayılır.';
$ec_lang['lpn_sm_help']='Senaryolar ve alternatifler nasıl çalışır:\n\nTemel modda alternatifler gizli ve otomatiktir ve tüm yeni senaryolar Temel senaryonun alt senaryosudur.\n\nTemel mod kapalıyken karmaşık bir devralma ağacı kullanılabilir ve alternatifler senaryolar arasında paylaşılabilir. Ancak yeni bir alternatif ilişkisi gerektiğinde (kullanıcı tarafından önceden yönetilmediğinde) düzenlemelerin varsayılan davranışı, geçerli senaryo gibi adlandırılmış bir alternatif oluşturmaktır; bu da her senaryoya kendine özgü bir alternatif kümesi verir.\n\nÖzellikler ve ayarlar, senaryolar ve alternatifler tablosunun sütunları olarak ve Senaryo yöneticisinde yönetim seçenekleri olarak görünen alternatif kategorilerine aittir.\n\nSenaryo değerleri senaryolarda oluşturulur, ancak gerçekte senaryoyla ilişkili alternatiflere aittir; yani bir senaryo, alternatiflerine açılan bir pencere gibidir. Alternatiflerin senaryolarla ilişkileri, Senaryo yöneticisinin sağ bölmesinde veya alt paneldeki Senaryolar tablosunda yönetilir. Yeni bir senaryo oluşturmak hiçbir alternatif oluşturmaz; yeni senaryo, yeni alternatifler gerektiren senaryo değerleri oluşturulana kadar üst senaryosunun alternatiflerini kullanır. Bir senaryoda senaryo değerleri oluşturulduğunda, senaryo için ilgili alternatiflerinde saklanırlar; senaryonun böyle bir alternatifi yoksa senaryonun adı kullanılarak yeni bir alternatif oluşturulur.\n\nÖrnek: "Şekil: Düğüm ve hat ID\'leri" adlı bir senaryo oluşturur ve bir Metni "Düğüm ve Hat ID\'leri" diyecek şekilde düzenlersiniz. Senaryoyu oluşturduğunuzda hiçbir alternatif oluşturulmaz. Ancak Metni kaydettiğiniz anda, Metin değeri senaryo değeriyle "Şekil: Düğüm ve hat ID\'leri" adlı bir Metin alternatifi oluşturulur. Temel modda bunu yalnızca senaryonun kendisinde bir senaryo değeri olarak görürsünüz.\n\nÖzellikleri kopyala yalnızca senaryo değerlerini kopyalar. Temel dışındaki herhangi bir senaryoda, yalnızca varlığın o senaryoda sahip olduğu senaryo değerlerini kopyalar.\n\nSenaryolar nasıl yönetilir:\n\n- Ağacını göstermek için en üstteki listeden Senaryolar\'ı veya bir alternatif kategorisini seçin.\n\n- Seçili öğenin bir alt öğesini Alt öğe ekle ile oluşturun. Temel ekle başka bir Temel ekler; bu, Temelin şimdiki halinin bir kopyası olarak başlar ve Temelde sonradan yapılan düzenlemeler onu değiştirmez. Yeni bir alt öğe üstünün adını alır; yeniden adlandırmak için bir ad yazın. Kopyala seçili alternatifi kopyalar. Yukarı birleştir, seçili alternatifin senaryo değerlerini adıyla seçilen üstündeki bir alternatife taşır ve seçili alternatif sonra bunları devralır; önce atladığı bir alternatifin de değiştirdiği, değişmeyecek bir değeri adlandırır. Bir senaryoyu kopyalamak için Temel modda Senaryolar menüsündeki Senaryoyu kopyala\'yı kullanın; senaryonun senaryo değerlerini, onları tutan alternatiflerle birlikte kopyalar. Temel ekle ve Senaryoyu kopyala her biri alternatif oluşturur: Temel ekle, değer tutan her kategoride yeni Temel için bir Temel alternatif oluşturur ve Senaryoyu kopyala, senaryonun senaryo değerlerini tutan her alternatif için kopya gibi adlandırılmış yeni bir alternatif oluşturur.\n\n- Bir öğeyi başka birinin üzerine sürüklemek onu o öğenin alt öğesi yapar. Yeni bir üste taşınan senaryo, senaryo değeri yapmadığı her şeyi ondan devralır; senaryo değeri yaptıkları değişmez. İki öğe arasına sürüklemek onları yeniden sıralar.\n\n- Seçmek için bir öğeye tıklayın. Seçili öğeyi yeniden adlandırmak için F2\'ye basın veya Yeniden adlandır\'ı seçin. Bir senaryoyu yeniden adlandırmak, adını taşıyan alternatiflerin yeniden adlandırılıp adlandırılmayacağını sorar; Temel modda sormadan onunla birlikte yeniden adlandırılırlar. Bir senaryoyu geçerli yapmak için çift tıklayın veya Enter\'a basın. Daraltmak veya genişletmek için öğenin yanındaki oka tıklayın veya Sol ya da Sağ\'a basın. Düğmelerle aynı komutlar için bir öğeye sağ tıklayın.\n\n- Seçili öğeyi silmek için Delete\'e basın veya eksi düğmesine tıklayın. Kullanımdaki bir öğe silinmez ve ileti onu neyin kullandığını adlandırır. Temel mod kapalıyken bir senaryoyu silmek kullandığı alternatifleri korur. Temel mod açıkken bir senaryoyu silmek, başka hiçbir senaryonun kullanmadığı alternatiflerini de siler.\n\n- Bir senaryoyu Temel dahil başka bir alternatifi kullandırmak için, onu Senaryo yöneticisinin sağ bölmesindeki veya Senaryolar tablosundaki senaryonun satırında seçin. Paylaşılan bir alternatifte yapılan senaryo değeri, onu kullanan her senaryoyu değiştirir.';
$ec_lang['lpn_sm_delete_alt_ask']='{name} alternatifi silinsin mi?';
$ec_lang['lpn_sm_in_use']='{item}\nşu tarafından kullanıldığı sürece silinemez:\n{list}';
$ec_lang['lpn_sm_alt_delete_has_children']='{name} alternatifi silinemez, çünkü alt öğeleri var: {list}. Önce onları silin veya başka bir üste taşıyın.';
$ec_lang['lpn_sm_item_scenario']='{name} senaryosu';
$ec_lang['lpn_sm_item_alternative']='{name} alternatifi';
$ec_lang['lpn_sm_name_taken']='{name} adı bu ağaçta zaten kullanılıyor.';
$ec_lang['lpn_sm_cycle']='{name}, kendi alt öğelerinden birinin altına taşınamaz.';
$ec_lang['lpn_sm_used_by']='Kullanan senaryolar: {n}';
$ec_lang['lpn_sm_used_by_tip']='Kullananlar: {list}';
$ec_lang['lpn_sm_used_by_none']='Hiçbir senaryo tarafından kullanılmıyor';
$ec_lang['lpn_sm_tree_all']='Tümü';
$ec_lang['lpn_sm_tree_unused']='Kullanılmayanların tümü';
$ec_lang['lpn_sm_unused_none']='Yok';
$ec_lang['lpn_sm_all_row_tip']='Kategori ağacında açmak için çift tıklayın.';
$ec_lang['lpn_sm_compare_tip']='Senaryo karşılaştırmasına dahil et';
$ec_lang['lpn_sm_inherited']='devralınmış';
$ec_lang['lpn_sm_shared_note']='Paylaşılan: {list}';
$ec_lang['lpn_scncmp_none_checked']='Karşılaştırma için hiçbir senaryo işaretli değil. Senaryo yöneticisinde senaryoları işaretleyin.';
$ec_lang['lpn_time_scn_overrides']='Senaryo değerleri:';
$ec_lang['lpn_settings_table_major']='Ana başlık';
$ec_lang['lpn_settings_table_minor']='Alt başlık';
$ec_lang['lpn_settings_table_category']='Kategori';
// The Settings table's third heading level, between Minor heading and Setting: the label field, coloured
// field, asset or custom property a group of settings belongs to (Tom, 2026-10-07: "We could call it
// 'Owner'.").
$ec_lang['lpn_settings_table_owner']='Sahibi';
$ec_lang['lpn_settings_table_setting']='Ayar';
$ec_lang['lpn_settings_table_yes']='Evet';
$ec_lang['lpn_settings_table_no']='Hayır';
$ec_lang['lpn_settings_row_of']='{setting}, {member}';
$ec_lang['lpn_settings_row_labels_field']='{labels}: {field}';
$ec_lang['lpn_settings_row_labels_part']='{labels}: {field}, {part}';
$ec_lang['lpn_settings_row_labels_customer']='Müşteri etiketleri';
$ec_lang['lpn_settings_row_label_before']='Önceki metin';
$ec_lang['lpn_settings_row_label_after']='Sonraki metin';
// A label field's settings, named in the Setting column with the field itself in the Owner column
// (Tom, 2026-10-07: "Symbology.Node labels.ID.Is Active", "Show order", "Drop order"). Whether the
// value appears on the label at all; where it sits on the label (1 first); which value is given up
// first when labels crowd (1 first).
$ec_lang['lpn_settings_row_label_on']='Etkin';
$ec_lang['lpn_settings_row_label_show']='Gösterim sırası';
$ec_lang['lpn_settings_row_label_drop']='Bırakma sırası';
// The Setting column of an ID prefix row; the asset it applies to is in the Owner column.
$ec_lang['lpn_settings_row_id_prefix']='ID öneki';
$ec_lang['lpn_settings_row_symbol_cap_multiple']='En büyük simge, tipik bir boru uzunluğunun katı olarak';
$ec_lang['lpn_settings_row_symbol_cap_percentile']='Tipik boru uzunluğu, tüm boru uzunluklarının yüzdelik dilimi olarak';
$ec_lang['lpn_settings_row_contour_labels']='Eş eğri etiketleri';
$ec_lang['lpn_settings_row_check_freq']='Durum denetimi sıklığı';
$ec_lang['lpn_settings_row_max_check']='En fazla durum denetimi';
$ec_lang['lpn_settings_row_status_report']='Durum raporu';
$ec_lang['lpn_settings_row_pda_src']='Dosyada belirtilen basınca bağlı seçenekler';
$ec_lang['lpn_settings_row_quality_option']='Dosyanın belirttiği su kalitesi seçeneği';
$ec_lang['lpn_settings_row_tolerance']='Doğruluk (eski projeler)';
$ec_lang['lpn_settings_row_emitter_exponent_old']='Damlatıcı üssü (eski projeler)';
$ec_lang['lpn_settings_row_elev_source_old']='Kot kaynağı (eski projeler)';
$ec_lang['lpn_settings_row_basemap']='Altlık harita';
$ec_lang['lpn_settings_row_basemap_last']='Dönülecek altlık harita';
$ec_lang['lpn_settings_row_customer_max_width']='Müşteri etiketlerini harita genişliği bu değere veya daha azına yakınlaştırıldığında göster';
$ec_lang['lpn_settings_row_quality_step']='Su kalitesi zaman adımı';
$ec_lang['lpn_settings_row_view']='Harita görünümü (merkez ve ölçek)';
$ec_lang['lpn_settings_row_bubbles']='Haritadaki zaman serisi grafikleri';
$ec_lang['lpn_settings_row_contour_fill']='Eş eğri dolgusu';
$ec_lang['lpn_settings_row_contour_opacity']='Eş eğri dolgu opaklığı';
$ec_lang['lpn_settings_row_contour_interval']='Eş eğri aralığı';
$ec_lang['lpn_settings_row_contour_buffer']='Eş eğri tamponu';
$ec_lang['lpn_settings_row_contour_terrain']='Düğümler arasındaki zemini Mapbox DEM\'den eş eğrilendir';
$ec_lang['lpn_settings_row_new_asset']='Yeni varlıklar: {setting}';
$ec_lang['lpn_settings_row_default']='{value} (varsayılan)';
$ec_lang['lpn_settings_row_view_value']='Merkez {x}, {y}; ölçek {s}';
$ec_lang['lpn_settings_held_in']='{scenario} içinde senaryo değeri.';
$ec_lang['lpn_settings_held_base']='{base}: {value}';
$ec_lang['lpn_settings_view_center']='Harita merkezi';
$ec_lang['lpn_settings_view_scale']='Harita ölçeği';
$ec_lang['lpn_settings_view_scale_tip']='Haritanın merkezindeki ölçek, 1:N olarak. O ölçeğe yakınlaştırmak için 1:2000 veya yalnızca 2000 yazın.';
$ec_lang['lpn_settings_view_top_left']='Sol üst köşe';
$ec_lang['lpn_settings_view_bottom_right']='Sağ alt köşe';
$ec_lang['lpn_settings_view_save']='Bu görünümü bu senaryoda kaydet';
$ec_lang['lpn_settings_view_save_tip']='Bu harita merkezini ve ölçeğini açık senaryoda saklar; böylece o senaryo açıldığında harita buraya taşınır. Haritayı sonradan hareket ettirmek, buna yeniden basana kadar hiçbir şeyi değiştirmez. {base} görünümünü yeniden izlemek için senaryo değerini temizleyin.';
$ec_lang['lpn_settings_row_basemap_osm']='Sokak haritası';
$ec_lang['lpn_settings_row_basemap_satellite']='Uydu görüntüleri';
$ec_lang['lpn_settings_row_basemap_topo']='Topografik harita';
$ec_lang['lpn_settings_units_one_project']='Birimler her senaryoda aynıdır.';
$ec_lang['lpn_settings_restore_base_only']='Varsayılanları geri yüklemek için Temel\'e geçin.';
$ec_lang['lpn_alt_cat_physical']='Fiziksel';
$ec_lang['lpn_alt_cat_demand']='Talep';
$ec_lang['lpn_alt_cat_topology']='Etkin topoloji';
$ec_lang['lpn_alt_cat_topology_tip']='Varlık etkinleştirme';
$ec_lang['lpn_alt_cat_initial']='Başlangıç ayarları';
$ec_lang['lpn_alt_cat_constituent']='Madde';
$ec_lang['lpn_alt_cat_fireflow']='Yangın debisi';
$ec_lang['lpn_alt_cat_energy']='Enerji maliyeti';
$ec_lang['lpn_alt_cat_userdata']='Özel özellikler';
$ec_lang['lpn_alt_cat_text']='Metin';
$ec_lang['lpn_alt_cat_presentation']='Sunum';
$ec_lang['lpn_alt_cat_calculation']='Hesaplama';
// Edited by TGH 2026-09-07
// Task 721: the scenarios every new project starts with. Keep the leading number: the list sorts
// by name, and the numbers hold Tom's order in every language.
$ec_lang['lpn_scenario_preset_flow_static']='1. Debi testi: Statik';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Tasarım şebekesi için, debi sıfırken debi testi kalibrasyonu. Bu senaryoda tüm düğümlerdeki talebi 0 yapın.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Debi testi: Orta';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Tasarım şebekesi için, bildirilen ilk debide debi testi kalibrasyonu. Bu senaryoda akış olan düğümdeki talebi ölçülen ilk debiye, diğer tüm düğümlerdeki talebi 0\'a ayarlayın.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Debi testi: Maks';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Tasarım şebekesi için, bildirilen en yüksek debide debi testi kalibrasyonu. Bu senaryoda akış olan düğümdeki talebi ölçülen en yüksek debiye, diğer tüm düğümlerdeki talebi 0\'a ayarlayın.';
$ec_lang['lpn_scenario_preset_average_day']='4. Ortalama gün';
$ec_lang['lpn_scenario_preset_average_day_tip']='Talep çarpanı 1: girildiği haliyle her talep, ortalama gün talebi olarak kabul edilir.';
$ec_lang['lpn_scenario_preset_max_day']='5. Maksimum gün';
$ec_lang['lpn_scenario_preset_mult_tip']='Talep çarpanı, ortalama günün {mult} katıdır; yer tutucu bir değerdir. Çoğu sistem {lo} ile {hi} arasındadır (National Research Council, 2006). Modellenen sistemin değerini Ayarlar, Hesaplama, Hidrolik, Talep çarpanı bölümünde ayarlayın.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Pik saat';
$ec_lang['lpn_delete_drops_overrides']='Bu öğeyi silmek, senaryo değerlerini ({n}) da siler. Devam edilsin mi?';
$ec_lang['lpn_push_base_only']='Bu işlem çizimin kendisini değiştirir, bu yüzden yalnızca {base} içinde yapılabilir. {base}\'e geçin ve tekrar deneyin.';
$ec_lang['lpn_field_active']='Etkin mi?';
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
$ec_lang['lpn_settings_emitter_exponent_tip']='EPANET\'in yağmurlama ve sızıntılar için emiter denkleminde üs: debi = katsayı x basıncın bu üsse yükseltilmiş hali. Sonuçları yalnızca emiter katsayısı olan düğümlerde etkiler.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='DEM\'i oku';
$ec_lang['lpn_elev_dem_sample_tip']='Bu düğümde DEM\'in kotunu okur ve aşağıda gösterir. Kot kutusunda hiçbir şey değişmez. Yatay DEM çözünürlüğü, Dünya\'nın çoğu için yaklaşık 30 m\'dir, daha iyi veri olan yerlerde daha incedir.';
$ec_lang['lpn_elev_dem_use']='DEM\'i kullan';
$ec_lang['lpn_elev_dem_use_tip']='Bu düğümde DEM\'in kotunu, yukarıdaki Kot kutusuna, orada olanın yerine koyar. Henüz okunmadıysa önce DEM\'i okur. Tek bir Geri al eski haline döndürür.';
$ec_lang['lpn_elev_dem_none']='DEM\'de bu düğüm için kot yok.';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM kotu: {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Kot kaynağı';
$ec_lang['lpn_settings_elev_source_tip']='2026\'da Mapbox DEM doğruluğu, önce yatay sonra düşey: ABD\'de 1–10 m ve 1 m\'nin altı, Avrupa ve Japonya\'da 2–10 m ve 1–3 m, dünya genelinde 30 m ve 10–16 m, kutuplarda 90 m ve 16 m\'nin üzeri.';
$ec_lang['lpn_settings_elev_source_typed']='Yukarıdaki';
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
$ec_lang['lpn_settings_accuracy_tip']='Çözücünün durmadan önce ulaşması gereken yakınsama sınırı; bir denemeden diğerine debideki toplam değişimin, hatlardaki toplam debiye bölünmesiyle ölçülür. Daha küçük bir sayı daha kesindir ve daha uzun sürer.';
$ec_lang['lpn_settings_specific_gravity']='Özgül ağırlık';
$ec_lang['lpn_settings_viscosity']='Bağıl viskozite';
// **THE PASHTO COLLISION THIS ANSWERS IS REAL AND IS INSIDE PASHTO** (sprint 584-wave1). ps renders
// this key with the word غلظت, which carries BOTH viscosity/thickness AND concentration -- so it
// collided with the word the same sprint used for lpn_result_concentration, on the same screen.
// Tom approved a synonym on 2026-09-06. **HIS FIRST WORDING WAS 'Relative rate of diffusion' and it
// is NOT what shipped**: that is diffusivity, and this key is viscosity. He was given a friction
// entry that quoted a translator's mistaken description of the key without anyone checking it
// against this file -- so the note below says what the number IS and what it is NOT, because two
// separate readers have now reached for a transport coefficient on a fluid property.
$ec_lang['lpn_settings_viscosity_tip']='Akışkanın viskozitesinin 20 santigrat derecedeki suya göre oranı. Yalnızca Darcy-Weisbach yönteminde yanıtı değiştirir.';
$ec_lang['lpn_settings_trials']='Azami deneme sayısı';
$ec_lang['lpn_settings_trials_tip']='Yakınsamayan bir şebekede çözücü durmadan önceki en fazla deneme sayısı.';
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
$ec_lang['lpn_settings_unbalanced_tip']='Denemelerini tüketmiş ve hâlâ yakınsamamış bir şebeke için eylem. Ek denemelere izin vermek çoğunlukla yakınsamaya ulaşır. Durdurmak, son denemeyi olduğu gibi bildirir; bu bir çözüm değildir.';
$ec_lang['lpn_settings_unbalanced_continue']='Ek denemelere izin ver';
$ec_lang['lpn_settings_unbalanced_stop']='Dur ve son denemeyi bildir';
$ec_lang['lpn_settings_unbalanced_trials']='Bildirmeden önce ek deneme sayısı';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Yukarıdaki en fazla sayı tükendikten sonra, son deneme bildirilmeden önce izin verilen ek deneme sayısı.';
$ec_lang['lpn_settings_head_error']='Yük hatası sınırı';
$ec_lang['lpn_settings_head_error_tip']='Çözücünün durmadan önce geçmesi gereken ek bir sınama: herhangi bir borudaki kalan en büyük yük hatası. Sıfır, bu sınamanın uygulanmayacağı anlamına gelir. Yalnızca EPANET çözücüsü bu kutuyu okur.';
$ec_lang['lpn_settings_flow_change']='Debi değişimi sınırı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Çözücünün durmadan önce geçmesi gereken ek bir sınama: herhangi bir borunun debisinin bir denemeden diğerine en büyük değişimi. Sıfır, bu sınamanın uygulanmayacağı anlamına gelir. Yalnızca EPANET çözücüsü bu kutuyu okur.';
$ec_lang['lpn_settings_damp_limit']='Sönümleme şurada başlar';
$ec_lang['lpn_settings_damp_limit_tip']='Çözücünün, salınan bir şebekenin yakınsamasına yardımcı olabilecek daha küçük adımlar atmaya başladığı doğruluk. Sıfır, çözücünün hiç sönümleme yapmayacağı anlamına gelir. Yalnızca EPANET çözücüsü bu kutuyu okur.';
$ec_lang['lpn_settings_option_unset']='Belirtilmemiş';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Şebekedeki her talebe aynı anda uygulanan tek bir katsayı. Her senaryo ayrı bir değere sahip olabilir, bu yüzden ortalama gün, en yüksek gün veya tepe saat yalnızca bu ayar değiştirilerek oluşturulabilir.';
$ec_lang['lpn_settings_engine_native']='Mümkün olduğunda yerleşik çözücüyü kullan';
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
$ec_lang['lpn_settings_engine_native_tip']='Bunu etkinleştirirseniz yerleşik çözücü mümkün olduğunda kullanılır. Aksi halde ABD EPA\'dan EPANET çözücüsü her zaman kullanılır. Yerleşik çözücü, uzun süreli benzetimler veya basınç kırıcı ve genel amaçlı vanalar (PBV, GPV) için kullanılmaz. EPANET çözücüsü ilk kez kullanıldığında yaklaşık 650 KB indirilir ve ardından bu cihazda tutulur. Bir boruda küçük (yerel) kayıp olduğunda, iki çözücü son basamaklarda farklılaşır: EPANET yer çekimi ivmesi için yuvarlatılmış bir değer kullandığından, onun küçük kayıpları tam ifadeye göre çok az daha düşük çıkar.';
$ec_lang['lpn_engine_loading']='EPANET çözücüsü yükleniyor…';
$ec_lang['lpn_engine_failed']='EPANET çözücüsü yüklenemedi. Bunun yerine yerleşik çözücü gösteriliyor.';
$ec_lang['lpn_engine_failed_why']='{reason} Bunun yerine yerleşik çözücü gösteriliyor.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_unit_unknown']='Bu çizim, bu sayfanın sunmadığı bir birim belirtiyor: {unit}. Her şey geldiği gibi tutulup gösterildi, hiçbir şey değiştirilmedi. Bu sayfa bu birimi tanımadığı sürece yanıt verilemez, çünkü ne kadar büyük olduğunu anlamanın bir yolu yoktur.';
$ec_lang['lpn_engine_manning_note']='Not: Manning pürüzlülüğüyle EPANET, Manning denklemindeki sabiti yuvarlar; bu yüzden yük kaybı tam biçimden yaklaşık %0,6 daha düşüktür.';
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
// A run EPANET started and could not finish, for example when a tank empties and the junctions it
// fed have no other source (Error 110). {time} is the run time it stopped at, H:MM.
$ec_lang['lpn_time_run_stopped']='EPANET çalışması {time} anında durdu, bu yüzden sonucu yok. Çalışma raporu nedenini söyler.';
$ec_lang['lpn_time_stat_stopped']='{statistic} gösterilmiyor: çalışma dönemin sonundan önce durdu.';
$ec_lang['lpn_time_stopped_no_quality']='Su kalitesi sonuçları hesaplanmadı, çünkü kalite analizi hidrolik çalışma bittikten sonra başlar.';
$ec_lang['lpn_energy_stopped']='EPANET çalışması dönemin sonundan önce durdu, bu yüzden pompa enerjisi sonuçları hesaplanmadı.';
$ec_lang['lpn_time_run_stopped_kept']='EPANET çalışması {time} anında durdu. Sonuçlar, çözdüğü son dönem olan {solved} kadar uzanır ve ondan sonrası için hiçbiri gösterilmez. Çalışma raporu nedenini söyler.';
// Why a stopped run stopped, read from EPANET's own run report (R-402). {link} is the link EPANET
// had just closed, {tank} the tank at one end of it, {nodes} the ids of the nodes EPANET then could
// not solve for, comma-separated. Follows lpn_time_run_stopped or lpn_time_run_stopped_kept.
$ec_lang['lpn_time_run_cut_off']='EPANET {link} hattını kapattı ve sonra {nodes} için çözemedi.';
$ec_lang['lpn_time_run_cut_off_full']='{tank} deposu doluydu; bu yüzden EPANET suyu içine almamak için {link} hattını kapattı ve sonra {nodes} için çözemedi. Bu, dolu bir depodan su çıkmadığında, örneğin her talep sıfır olduğunda olabilir. Sıfırın biraz üzerinde bir talep veya en yüksek değerinin biraz altında bir depo seviyesi bunu önler.';
$ec_lang['lpn_time_run_cut_off_empty']='{tank} deposu boştu; bu yüzden EPANET daha fazla boşalmasını önlemek için {link} hattını kapattı ve sonra {nodes} için çözemedi.';
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
$ec_lang['lpn_control_inactive_note']='Bu kontroller bu senaryoda etkin olmayan bir varlığa başvurur; bu yüzden onun çalıştırmasında yok sayılır: {ids}';
$ec_lang['lpn_rule_inactive_note']='Bu kurallar bu senaryoda etkin olmayan bir varlığa başvurur; bu yüzden onun çalıştırmasında yok sayılır: {ids}';
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
$ec_lang['lpn_settings_show_arrows_tip']='Her boruda suyun hangi yöne aktığını gösteren bir ok çizer. Oklar bir çalıştırmadan sonra görünür, kapatmak sonuçları değiştirmez.';
$ec_lang['lpn_settings_align_labels']='Boru etiketlerini borularla hizala';
$ec_lang['lpn_settings_readability_bias']='Etiketin ters çevrilmeden önce dikeyden sola kayabileceği derece';
$ec_lang['lpn_settings_readability_bias_tip']='Bir etiket, dikeyden sola bu kadar dereceden fazla yatarsa, doğru yönde durması için ters çevrilir.';
$ec_lang['lpn_settings_mask_labels']='Etiketlerin arkasında dolgu arka plan';
$ec_lang['lpn_settings_text_halo']='Metin halesi genişliği (metin boyutunun yüzdesi)';
$ec_lang['lpn_settings_text_halo_tip']='Haritadaki metnin arkasındaki dolu dış çizginin genişliği, metin boyutunun yüzdesi olarak. Etiketlerin arkasındaki dolu arka plan açıkken uygulanır.';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Bağlantı çizgilerini belirli açılara yasla';
// Edited by TGH 2026-09-07
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
$ec_lang['lpn_settings_symbol_cap_sentence']='Düğümlerin şundan daha büyük ölçeklenmesini önle {n} kat, şu yüzdelik borunun {p} uzunluğu';
$ec_lang['lpn_settings_symbol_cap_tip']='Bir düğümün çapı, şebekedeki tüm boru uzunluklarının bu yüzdelik dilimindeki borunun uzunluğunun bu kadar katı olduğunda, zeminde büyümeyi durdurur. Haritada bu noktadan sonra, uzaklaştıkça düğümler, borular ve diğer simgeler zeminde büyümek yerine ekranda küçülür. Rezervuarlar ve depolar bunun dışındadır ve her yakınlaştırmada ekran boyutlarını korur.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Sembol opaklığı (0 ile 1 arası)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Arka plan görüntüsü opaklığı (0 ile 1 arası)';
// Task 617: a display-time filter on the street or satellite tiles only; the drawing and the credit are untouched.
$ec_lang['lpn_settings_basemap_style']='Altlık harita biçimi';
$ec_lang['lpn_basemap_style_normal']='Normal';
$ec_lang['lpn_basemap_style_muted']='Soluk';
$ec_lang['lpn_basemap_style_faded']='Silik';
$ec_lang['lpn_basemap_style_grayscale']='Gri tonlamalı';
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
$ec_lang['lpn_time_statistic']='İstatistik';
$ec_lang['lpn_time_stat_none']='Yok';
$ec_lang['lpn_time_stat_averaged']='Ort.';
$ec_lang['lpn_time_stat_minimum']='Min.';
$ec_lang['lpn_time_stat_maximum']='Maks.';
$ec_lang['lpn_time_stat_range']='Aralık';
$ec_lang['lpn_time_clock_day']='Gün {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Bir zamanı saat ve dakika olarak yazın, örneğin 2:30. Düz bir sayı saat anlamına gelir; yani 8, sekiz saattir. Yarım saat 0:30 olarak yazılır.';
$ec_lang['lpn_time_running']='Uzun süreli simülasyon çalıştırılıyor.';
$ec_lang['lpn_time_no_engine']='Yerleşik çözücü bir seferde yalnızca bir anı hesaplar, bu yüzden bu yalnızca {time} anındaki şebekedir: her desen o anda okunur ve her depo dolup boşalmak yerine hâlâ başlangıç seviyesindedir. Bir zaman dilimi hesaplaması çalıştıran EPANET çözücüsünü almak için bir kez internete bağlanın.';
// lpn_time_no_engine says "connect to the internet", which is true only offline. For the other causes
// of a failed extended period run the same note ends in {reason}, one of the three sentences below.
$ec_lang['lpn_time_no_engine_why']='Yerleşik çözücü her seferinde tek bir anı çözer, bu yüzden bu, şebekenin yalnızca {time} anındaki halidir: her desen o anda okunur ve her depo dolup boşalmak yerine ilk seviyesinde kalır. {reason}';
$ec_lang['lpn_time_engine_fetch_failed']='EPANET çözücüsünün indirilmesi başarısız oldu. Yeniden denemek için sayfayı yeniden yükleyin; bir güvenlik duvarı, vekil sunucu veya tarayıcı eklentisi onu engelliyor olabilir.';
$ec_lang['lpn_time_engine_start_failed']='Tarayıcı EPANET çözücüsünü başlatmayı reddetti. WebAssembly bir güvenlik ayarı veya bir eklenti tarafından kapatılmış olabilir.';
$ec_lang['lpn_time_engine_run_failed']='EPANET çalıştırması başarısız oldu. Bu bu sayfada bir kusurdur; bildirmek için {wrong} bağlantısını kullanın.';
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
$ec_lang['lpn_time_run_report']='Çalıştırma raporu';
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
$ec_lang['lpn_labels_customer_note']='Bir müşteri etiketi, burada seçilen değerleri gösterir. Haritadaki diğer her etiketle aynı metin boyutunda çizilir.';
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
$ec_lang['lpn_saved_project']='Projeyle birlikte kaydedildi';
$ec_lang['lpn_saved_browser']='Bu tarayıcıda kaydedildi';
$ec_lang['lpn_saved_session']='Kaydedilmedi';
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
$ec_lang['lpn_source_quality_tip']='Dozun gücü. Kütle güçlendirici dışındaki her tür için bu, Ayarlar, Hesaplama, Su kalitesi altında kimyasalın yanında adlandırılan birimlerde bir derişimdir; bir kütle güçlendirici için dakika başına kütle debisidir. Boş bırakmak kimyasal kaynağı olmaması demektir ve işlevsel olarak 0\'a eşdeğerdir.';
$ec_lang['lpn_source_pattern']='Kaynak deseni';
$ec_lang['lpn_source_pattern_tip']='Sabit olmayan bir besleme için, dozu çalışma boyunca ölçekleyen bir zaman deseni. Desen yok, dozun her adımda aynı olduğu anlamına gelir.';
$ec_lang['lpn_mixing_model']='Karışım modeli';
$ec_lang['lpn_mixing_model_tip']='Bu depoda zaten bulunan suyun gelen suyla nasıl karıştığının modeli. Tam karışım, gelen suyun tamamını anında deponun tüm hacmiyle karıştırır. İki bölmeli karışım önce bir giriş bölgesini doldurur ve taşanı ana bölgeye geçirir. FIFO tıkaç akışı suyu geldiği sırayla boşaltır. LIFO tıkaç akışı onu üst üste yığar, bu yüzden son giren su ilk çıkan sudur. Seçim su yaşını ve kalıntıyı etkiler, basıncı veya debiyi etkilemez.';
$ec_lang['lpn_mixing_mixed']='Tam karışım';
$ec_lang['lpn_mixing_2comp']='İki bölmeli karışım';
$ec_lang['lpn_mixing_fifo']='FIFO tıkaç akışı';
$ec_lang['lpn_mixing_lifo']='LIFO tıkaç akışı';
$ec_lang['lpn_mixing_fraction']='Karışım oranı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Giriş bölgesinin depo hacminden aldığı pay, 0 ile 1 arasında. Yalnızca iki bölmeli karışım bunu kullanır. Boş bırakırsanız tüm depo giriş bölgesi olur; EPANET\'in varsaydığı da budur.';
$ec_lang['lpn_reaction_bulk']='Kütle tepkime katsayısı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Suyun gövdesindeki tepkime (bkz. EPANET Yardım); kendi katsayısı olmayan her boru ve depo için kullanılır. Negatif bir sayı kimyasalı azaltır, pozitif bir sayı ise artırır. Boş bırakılırsa kütle tepkimesi yoktur.';
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
// Row label only (the box title is lpn_time_run_report). Tom, 2026-10-07: no row carries '(EPANET)';
// the tips say where a report comes from. Run is EPANET's verbatim report.
$ec_lang['lpn_reports_epanet']='Çalıştırma';
$ec_lang['lpn_energy_title']='Pompa enerjisi raporu';
$ec_lang['lpn_energy_menu']='Pompa enerjisi';
$ec_lang['lpn_energy_efficiency']='Pompa verimi (yüzde)';
$ec_lang['lpn_energy_efficiency_tip']='Kendi verim eğrisini taşımayan her pompa için kullanılan, elektrikten suya verim. Hiçbir şey belirtilmediğinde EPANET yüzde 75 kullanır.';
$ec_lang['lpn_energy_price']='Enerji fiyatı';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Bir kilovatsaatin maliyeti. Kendi fiyatı olmayan her pompaya uygulanır. Boş bırakılırsa 0 demektir.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Bu pompada bir kilovatsaatin maliyeti. Boş bırakılırsa Ayarlar, Enerji altında tüm şebeke için belirlenen fiyat kullanılır.';
$ec_lang['lpn_energy_price_pattern']='Fiyat deseni';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Fiyatı her desen adımında çarpan bir desen; bir düşük tarife dönemi böyle belirtilir. Çalışma boyunca tek bir fiyat için boş bırakın.';
$ec_lang['lpn_energy_demand_charge']='Tepe talep ücreti';
$ec_lang['lpn_energy_demand_charge_tip']='Pompaların talep ettiği tepe yük için kW başına';
$ec_lang['lpn_energy_currency']='Para birimi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Her maliyet değerinin yanına yazdırılan metin. Yalnızca bir etikettir; baştan sona tek bir para birimi kullanın.';
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
$ec_lang['lpn_scncmp_menu_tip']='Senaryo değeri sayısı, en düşük basınç ve en yüksek hız ile senaryoların tablosu';
$ec_lang['lpn_scncmp_running']='Her senaryo çözülüyor…';
$ec_lang['lpn_scncmp_empty']='Henüz hiçbir şey çizilmedi, bu yüzden çözülecek bir şey yok.';
$ec_lang['lpn_scncmp_col_maxvelocity']='En yüksek hız';
$ec_lang['lpn_scncmp_at']='{id}\'de {value}';
$ec_lang['lpn_scncmp_at_time']='{id} düğümünde {value}, {time}';
$ec_lang['lpn_scncmp_same']='Her senaryoda aynı';
$ec_lang['lpn_scncmp_period_note']='Bir senaryonun toplam çalışma süresi varsa, en düşük basıncı ve en yüksek hızı, gösterilen zamanda tüm şebekenin uç değerleridir.';
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
// **THE ROW AND THE BOX TITLE BOTH SAY "Status changes"** (Tom, 2026-10-07), so menu and box agree.
$ec_lang['lpn_reports_status']='Durum değişiklikleri';
$ec_lang['lpn_reports_status_tip']='Son uzun süreli simülasyonun EPANET zaman adımlarından okunan durum değişikliklerinin kronolojik tablosu: açılan veya kapanan pompalar ve vanalar, dolan, boşalan, dolup taşan veya kuruyan depolar ve tam olarak yakınsamayan adımlar.';
$ec_lang['lpn_status_title']='Durum değişiklikleri';
$ec_lang['lpn_status_needs_run']='Durum raporu, bir uzun süreli simülasyon boyunca neyin değiştiğini listeler. Ayarlar, Hesaplama, Zaman altında bir Toplam çalışma süresi belirleyin, Hesapla\'ya basın, sonra Su, Raporlar, Durum değişiklikleri\'ni açın.';
$ec_lang['lpn_status_empty']='Bu çalışma boyunca hiçbir şeyin durumu değişmedi.';
$ec_lang['lpn_status_col_event']='Olay';
$ec_lang['lpn_status_opened']='{type} {id} şimdi açıldı';
$ec_lang['lpn_status_closed']='{type} {id} şimdi kapandı';
$ec_lang['lpn_status_filling']='{type} {id} şimdi doluyor';
$ec_lang['lpn_status_emptying']='{type} {id} şimdi boşalıyor';
$ec_lang['lpn_status_full']='{type} {id} şimdi doldu';
$ec_lang['lpn_status_dry']='{type} {id} şimdi boşaldı';
$ec_lang['lpn_status_no_converge']='Bu adımdaki hidrolik çözüm tam olarak yakınsamadı; gösterilen sayılar son iterasyonuna ait.';
$ec_lang['lpn_status_note']='Tablolar panosu ve Tam rapor ile aynı uzatılmış dönem çalışmasından okunur. Yalnızca bir değişiklik listelenir, her adım değil.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Tam';
$ec_lang['lpn_reports_full_tip']='Son çalışmanın her raporlama zaman adımındaki tüm düğümlerin ve hatların tablosu';
$ec_lang['lpn_full_title']='Tam rapor';
$ec_lang['lpn_full_needs_run']='Tam rapor, her raporlama zaman adımındaki her düğümü ve her hattı listeler. Hesapla\'ya basın, sonra Su, Raporlar, Tam rapor\'u açın.';
$ec_lang['lpn_full_note']='Tablolar panosunda gösterilen birimlerde, düğüm veya hat başına raporlama zaman adımı başına bir satır. Boş bir hücre, o niceliğin sahip olmadığı bir sütundur. İndirme veya yazdırma her zaman adımını taşır; aşağıdaki tablo bir kerede bir tanesini gösterir.';
$ec_lang['lpn_full_step_label']='Zaman adımı';
$ec_lang['lpn_full_download_csv']='CSV indir';
$ec_lang['lpn_full_print']='Raporu yazdır';
$ec_lang['lpn_full_col_time']='Zaman';
$ec_lang['lpn_full_col_type']='Tür';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='Satırlar ({n}).';

// ---- The Calibration report (ROADMAP Task 601) -------------------------------------------------
// EPANET's Report > Calibration and its three tabbed pages, with EPANET's own column names (EPANET
// 2.2 manual, section 9.6). Mean error is EPANET's term for the mean ABSOLUTE difference. "Num obs"
// is EPANET's own column heading, kept short because results columns are narrow.
// lpn_calib_missing: keep in step with feat/profile-file's lpn_profile_file_missing (Task 604), the same sentence.
$ec_lang['lpn_reports_calib']='Kalibrasyon';
$ec_lang['lpn_reports_calib_tip']='Bir kalibrasyon dosyasındaki ölçülmüş saha verilerini son çalıştırmayla karşılaştırın: istatistikler, bir korelasyon grafiği ve ortalama karşılaştırmaları.';
$ec_lang['lpn_calib_title']='Kalibrasyon raporu';
$ec_lang['lpn_calib_param']='Parametre';
$ec_lang['lpn_calib_param_tip']='Kalibrasyon dosyasının ölçtüğü büyüklük. Her parametre için bir dosya tutulur.';
$ec_lang['lpn_calib_load']='Kalibrasyon dosyası yükle…';
$ec_lang['lpn_calib_load_tip']='Her satırında bir konum kimliği, bir zaman ve ölçülmüş bir değer bulunan bir metin dosyası. Zaman, simülasyonun başından itibaren ondalık saat veya saat:dakika olarak ölçülür. Noktalı virgül bir yorum başlatır. Yalnızca zaman ve değer içeren bir satır, üstündeki konuma aittir.';
$ec_lang['lpn_calib_none']='Bu parametre için yüklü bir kalibrasyon dosyası yok.';
$ec_lang['lpn_calib_session']='Kalibrasyon dosyası yalnızca bu oturum için tutulur. Projeyle birlikte veya bu cihazda kaydedilmez.';
$ec_lang['lpn_calib_file']='{file}: ölçümler ({n}), konumlar ({m}).';
$ec_lang['lpn_calib_units']='Dosyadaki değerler bu projenin biriminde okunur: {unit}.';
$ec_lang['lpn_calib_missing']='Dosyada adı geçen ama bu şebekede olmayanlar: {ids}.';
$ec_lang['lpn_calib_missing_count']='Konumu bu şebekede olmadığı için atlanan ölçümler: {n}.';
$ec_lang['lpn_calib_bad_lines']='Okunamadığı için atlanan satırlar: {lines}';
$ec_lang['lpn_calib_outside']='Bu çalıştırmanın raporladığı zamanların dışında kaldığı için atlanan ölçümler: {n}.';
$ec_lang['lpn_calib_no_value']='Zamanlarında hesaplanmış değeri olmadığı için atlanan ölçümler: {n}.';
$ec_lang['lpn_calib_single']='Bu tek dönemlik bir çalıştırmadır, bu yüzden dosya hangi zamanı verirse versin her ölçüm tek sonucuyla karşılaştırılır.';
$ec_lang['lpn_calib_needs_run']='Karşılaştırılacak sonuç henüz yok. Şebeke hesaplandığında rapor dolar.';
$ec_lang['lpn_calib_no_pairs']='Hiçbir ölçüm karşılaştırılamadı, bu yüzden çizilecek bir şey yok.';
$ec_lang['lpn_calib_tab_stats']='İstatistikler';
$ec_lang['lpn_calib_tab_corr']='Korelasyon grafiği';
$ec_lang['lpn_calib_tab_means']='Ortalama karşılaştırmaları';
$ec_lang['lpn_calib_col_location']='Konum';
$ec_lang['lpn_calib_col_n']='Gözlem sayısı';
$ec_lang['lpn_calib_col_obs_mean']='Gözlenen ortalama';
$ec_lang['lpn_calib_col_sim_mean']='Hesaplanan ortalama';
$ec_lang['lpn_calib_col_mean_err']='Ortalama hata';
$ec_lang['lpn_calib_col_mean_err_tip']='Her gözlenen değerle aynı zamandaki hesaplanan değer arasındaki mutlak farkların ortalaması.';
$ec_lang['lpn_calib_col_rms_err']='RMS hatası';
$ec_lang['lpn_calib_col_rms_err_tip']='Kareler ortalamasının karekökü hatası: gözlenen ve hesaplanan değerler arasındaki farkların karelerinin ortalamasının karekökü.';
$ec_lang['lpn_calib_network']='Şebeke';
$ec_lang['lpn_calib_corr_means']='Ortalamalar arasındaki korelasyon: {r}';
$ec_lang['lpn_calib_corr_none']='Ortalamalar arasındaki korelasyon: ortalamaları farklı en az iki konum gerekir.';
$ec_lang['lpn_calib_axis_obs']='Gözlenen: {q}';
$ec_lang['lpn_calib_axis_sim']='Hesaplanan: {q}';
$ec_lang['lpn_calib_observed']='Gözlenen';
$ec_lang['lpn_calib_computed']='Hesaplanan';
$ec_lang['lpn_calib_point']='{id}, {time}: gözlenen {o}, hesaplanan {s}';
$ec_lang['lpn_calib_corr_note']='Her nokta bir ölçümdür. Noktalar köşegen çizgiye ne kadar yakınsa, hesaplanan değerler gözlenenlerle o kadar yakın uyuşur.';
$ec_lang['lpn_calib_ts_point']='{id} konumunda, {time} anında ölçüldü: {v}';
$ec_lang['lpn_calib_ts_note']='Halkalar, kalibrasyon dosyasındaki ölçülmüş değerlerdir.';
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
$ec_lang['lpn_labels_col_decimals_example']='0,000';
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
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Desenler';
// **THE SYNONYMS ARE TOM'S OWN, GIVEN 2026-08-24**, which is the written permission this array
// requires. "Pattern" is the discipline's standard term and stays the label; the payload exists so
// a translator who cannot recover the concept from that one word has the shape of it.
//
// "Run" was on his list and he struck it the same day, on the collision: this page's Run is the
// button that plays an extended-period simulation back, so a translator reaching for their word for
// a program run would have named the wrong thing. Tom: *"Yes. It's not the best term."*
$ec_lang['lpn_library_patterns_tip']='Bir desen, tekrarlanan bir çarpanlar listesidir. Her biri bir desen zaman adımı için geçerlidir, bu yüzden bir saatlik adımda 24 sayı, tekrarlanan bir günü oluşturur. Çarpanı 1,5 olan 10\'luk bir talep, o anda 15\'tir.';
$ec_lang['lpn_library_curves']='Eğriler';
$ec_lang['lpn_library_curves_tip']='Pompa yükü veya verimi - debi, vana kaybı - debi, ya da depo hacmi - derinlik';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Eğriler pompalara ve vanalara bağlanır. Bir pompa yük eğrisi için çalışma, gösterildiği gibi noktalardan geçirilerek uydurulmuş bir eğriyi kullanır; diğer her tür için noktalar, gösterildiği gibi düz çizgilerle birleştirilir.';
$ec_lang['lpn_library_curve_add']='Bir eğri ekle';
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
$ec_lang['lpn_library_curve_in_use']='Bu eğri öğeler ({count}) tarafından kullanılıyor: {ids}. Önce onları başka bir eğriye yönlendirin, sonra bunu silin.';
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
$ec_lang['lpn_library_pipetype_in_use']='Bu boru türü borular ({count}) tarafından kullanılıyor: {ids}. Silmeden önce onlardan ayırın.';
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
$ec_lang['lpn_library_fittings_tip']='Yerel kayıp katsayılı bağlantı parçalarının listeler halinde gruplanması';
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
$ec_lang['lpn_library_fittings_in_use']='Bu bağlantı parçası listesi borular ({count}) tarafından kullanılıyor: {ids}. Silmeden önce onlardan ayırın.';
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
$ec_lang['lpn_field_fittings_tip']='Proje kitaplığından bir bağlantı parçası listesi. Miktarları ve katsayıları bu borunun küçük (yerel) kayıp katsayısında toplanır ve katsayı kutusu bu durumda salt okunur olur. Katsayıyı kendiniz girmek için hiçbir liste seçmeyin.';
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
// Tom, 2026-09-30, ruling sprint 2026-09-30-golf item 1: _syn = "All junctions" / "Selected junctions".
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
$ec_lang['lpn_inp_export_flat_types']='Buradaki borular ({n}) boru türlerine ({t}) başvuruyor. Dosyada bu boruların her biri sayıların kendi kopyasını taşır, bu yüzden sonuçlar aynıdır. Dosyanın tutamadığı şey boru türünün kendisidir; bu yüzden bir tanım ile onu kullanan her boru arasındaki bağ yalnızca proje dosyasında kaydedilir.';
$ec_lang['lpn_inp_export_flat_coords']='Bir EPANET dosyası her düğüm için tek bir konum tutar. Bu senaryo bunlardan {n} tanesini başka bir yere yerleştiriyor, ve dosyadaki konumlar bunlardır. Diğer her senaryo kendi konumlarını yalnızca proje dosyanızda tutar.';
$ec_lang['lpn_inp_export_flat_fittings']='Bir EPANET dosyası, proje dosyanızdaki dirsek, vana ve T bağlantı listesini tutamaz. Buradaki boruların ({n}) küçük (yerel) kayıp katsayısı bir bağlantı parçası listesinden toplanır. Toplam olduğu gibi dosyaya yazılır, bu yüzden cevaplarla ilgili hiçbir şey değişmez.';
$ec_lang['lpn_library_controls']='Kontroller';
$ec_lang['lpn_library_controls_tip']='Bir kontrol, bir depo su seviyesine, bir düğüm basıncına veya zamana göre bir hattı açan veya kapatan ya da ayarını değiştiren tek bir ifadedir.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Bir desen ekle';
$ec_lang['lpn_library_pattern_values']='Çarpanlar';
$ec_lang['lpn_library_pattern_values_tip']='Boşluk veya virgülle ayrılmış çarpanlar. Varsa bir elektronik tablodan bir sütun yapıştırın. Liste, çalışma sürdüğü sürece tekrarlanır, bu yüzden çalışmanın tamamını kapsaması gerekmez.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='Çarpanlar: {n}, {step} aralıklı, {span} kapsıyor';
// Under the pattern graph, beside the clock-time row: the ordinal of each time period (1, 2, 3).
$ec_lang['lpn_library_pattern_axis_step']='Adım';
$ec_lang['lpn_library_pattern_none']='Desen yok';
// The blank first option of a selector whose blank follows a project-wide default (a junction's or
// customer's demand pattern, a pump's price pattern and efficiency curve). Tom, 2026-10-04.
$ec_lang['lpn_choice_default']='Varsayılan';
$ec_lang['lpn_settings_default_pattern']='Varsayılan talep deseni';
$ec_lang['lpn_settings_default_pattern_tip']='Deseni olmayan her düğüm bunu kullanır.';
$ec_lang['lpn_junction_pattern_unknown']='Bu projede {id} kimliğine (ID) sahip bir desen yok, bu yüzden düğüm olduğu gibi bırakıldı.';
$ec_lang['lpn_settings_default_pattern_none']='Yok (sabit)';
$ec_lang['lpn_demand_pattern_default']='(varsayılan: {id})';
$ec_lang['lpn_demand_pattern_constant']='(sabit)';
$ec_lang['lpn_library_pattern_default_mark']='(varsayılan)';
$ec_lang['lpn_library_pattern_default_tip']='Varsayılan talep deseni. Ayarlar, Varsayılan talep deseni altından değiştirin.';
$ec_lang['lpn_library_pattern_default_deleted_to']='{id} deseni varsayılan talep desenidi. Deseni olmayan düğümler artık {now} desenini kullanıyor.';
$ec_lang['lpn_library_pattern_default_deleted_none']='{id} deseni varsayılan talep desenidi. Deseni olmayan düğümler artık sabit bir talep kullanıyor.';
$ec_lang['lpn_library_pattern_default_deleted_also']='Bunu varsayılanları olarak da kullanan senaryolar: {list}.';
$ec_lang['lpn_library_pattern_default_deleted_in']='{id} deseni şu senaryolarda varsayılan talep deseniydi: {list}.';
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
$ec_lang['lpn_library_rules_tip']='Bir kural, bir su seviyesi, bir basınç, bir debi veya zaman belirli bir değere ulaştığında bir hattı açar ya da kapatır veya ayarını değiştirir. Bir kural birden fazla koşulu sınayabilir ve koşul yanlış olduğunda yapılacak eylemi belirtebilir.';
$ec_lang['lpn_library_rule_add']='Bir kural ekle';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Satır başına bir yan tümce. Aşağıda "BÜYÜK HARFLE" örneklerle açıklamalar var. 1. satır: Kuralın adı, "RULE 1". 2. satır: Bir koşul, "IF TANK 2 LEVEL BELOW 17.1". 3. satır: Bir eylem, "THEN PUMP 9 STATUS IS OPEN". 4. satır: Bir öncelik, "PRIORITY 1". Birden fazla koşulu sınamak için "AND" veya "OR" satırları, koşul yanlış olduğunda eylemi belirtmek için "ELSE" satırları ekleyin. Bir koşul, bir düğümde LEVEL, HEAD, GRADE, PRESSURE veya DEMAND\'i, bir hatta FLOW, STATUS veya SETTING\'i, ya da SYSTEM\'de TIME ve CLOCKTIME\'ı okuyabilir. Tutarlı proje birimleri kullanın. Anahtar sözcükler İngilizce olmalıdır.';
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
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Açıklama';
$ec_lang['lpn_demand_add']='Talep kategorisi ekle';
$ec_lang['lpn_demand_remove']='Bu talebi kaldır';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Yük deseni';
$ec_lang['lpn_field_head_pattern_tip']='Bu rezervuarın su seviyesinin çalışma boyunca deseni. Yukarıdaki yük, desenle çarpılır.';
$ec_lang['lpn_field_pump_speed']='Bağıl hız';
$ec_lang['lpn_field_pump_speed_tip']='Yayımlanmış performans eğrisini oluşturmak için kullanılan dönüş hızına göre bağıl hız. Bir hız deseni varsa yok sayılır (ölçeklenmez).';
$ec_lang['lpn_field_speed_pattern']='Hız deseni';
$ec_lang['lpn_field_speed_pattern_tip']='Her desen girdisi, bir taban değeri ölçeklemek yerine çalışmanın o bölümü için bağıl hızı verir.';

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
$ec_lang['lpn_search_tip']='İlk kullanımda izin istenir, çünkü aramalar OpenStreetMap yer adı hizmetine gönderilir.';
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
$ec_lang['lpn_search_busy']='Bir arama zaten sürüyor. Bitmesini bekleyin.';
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
$ec_lang['lpn_search_toofast']='Yer adı hizmeti saniyede bir aramaya izin verir. Birazdan yeniden deneyin.';
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
$ec_lang['lpn_terrain_confirm_default_2']='Bu düğümlerin ({n}) kotu Mapbox DEM\'den gelen değerlerle değiştirilsin mi?';
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
$ec_lang['lpn_analyze_menu']='Analiz';
$ec_lang['lpn_analyze_menu_tip']='Şebekeyi bir kopya üzerinde çalıştıran analizler: her düğümde yangın debisi, her borunun, pompanın ve vananın kaybı, ve yukarı ya da aşağı ölçeklenen talepler.';
$ec_lang['lpn_ff_menu']='Yangın debisi analizi…';
$ec_lang['lpn_ff_menu_tip']='Seçili her düğümü yangın debisi için sınayın ve sistemin geri kalanı üzerindeki etkiyi kontrol edin';
$ec_lang['lpn_ff_title']='Yangın debisi analizi';
$ec_lang['lpn_ff_intro']='Her düğüm sırayla, mevcut talebinin üzerine bir yangın debisi çeker. Çalıştırma, ekrandaki zaman adımında şebekenin bir kopyasını kullanır, bu yüzden projenizde hiçbir şey değişmez.\n\nYangın debisi normalde en yüksek gün talebinde sınanır, bu yüzden önce şebekeyi o koşula ayarlayın.\n\nSınanan her düğüm, tüm şebekenin yaklaşık 16 çözümünü gerektirir, bu yüzden büyük bir sistem dakikalar sürer: çalıştırmadan önce düğümleri seçin ve kısmi sonuçları korumak için istediğiniz zaman durdurun.';
$ec_lang['lpn_ff_scope']='Sınanacak düğümler';
$ec_lang['lpn_ff_all']='Tüm düğümler';
$ec_lang['lpn_ff_selected']='Seçili düğümler';
$ec_lang['lpn_ff_no_junctions']='Bu projede henüz düğüm yok, bu yüzden sınanacak bir şey yok.';
$ec_lang['lpn_ff_no_selection']='Hiçbir düğüm seçili değil. Düğümleri seçin veya Tümü seçeneğini seçin.';
$ec_lang['lpn_ff_skipped']='{n} seçili öğe düğüm değil, bu yüzden test edilmedi.';
$ec_lang['lpn_ff_required']='Gereken yangın debisi';
$ec_lang['lpn_ff_required_tip']='Yangın yönetmeliğinizin veya itfaiye teşkilatınızın bir yangın musluğunda istediği debi. Her düğüm, kendi gereken yangın debisini taşımadığı sürece bu sayıya karşı sınanır.';
$ec_lang['lpn_ff_required_own']='Kendi gereken yangın debisini taşıyan düğümler, onun yerine ona karşı sınanır. Sayıları: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Bu düğümün hizmet ettiği arazi kullanımı için yangın yönetmeliğinizin veya itfaiye teşkilatınızın istediği yangın debisi. Boş bırakırsanız düğüm, Yangın debisi analizi kutusundaki sayıya karşı sınanır.';
$ec_lang['lpn_ff_residual']='Korunacak kalıntı basınç';
$ec_lang['lpn_ff_residual_tip']='Düğümün, yangın debisini sağlarken hâlâ koruması gereken basınç. AWWA M31 ve NFPA 291, 20 psi (140 kPa) kullanır.';
$ec_lang['lpn_ff_design']='Tasarım kontrolü (sistem üzerindeki etki)';
$ec_lang['lpn_ff_design_tip']='Düğümün debiyi sağlayıp sağlayamayacağından ayrı bir soru: orada o debi çekilirken başka bir şey asgari basıncının altına düşer mi veya hız sınırını aşar mı? Bunu kontrol etmeyi seçmek ek bir hesaplamaya mal olmaz.';
$ec_lang['lpn_ff_design_off']='Yok';
$ec_lang['lpn_ff_design_all']='Tümü';
$ec_lang['lpn_ff_design_selected']='Seçili';
$ec_lang['lpn_ff_design_no_selection']='Tasarım kontrolü Seçili olarak ayarlı, ama hiçbir öğe seçili değil. Öğeleri seçin veya Tümü seçeneğini seçin.';
$ec_lang['lpn_ff_minpressure']='Başka yerde izin verilen en düşük basınç';
$ec_lang['lpn_ff_minpressure_tip']='Başka bir düğüm yangın debisini çekerken bunun altına düşen bir düğüm, tasarım sorunu olarak bildirilir.';
$ec_lang['lpn_ff_maxvelocity']='İzin verilen en yüksek hız';
$ec_lang['lpn_ff_maxvelocity_tip']='Bir yangın debisi çekilirken bunun üzerinde çalışan bir boru, tasarım sorunu olarak bildirilir.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Basınç, olağan yöntem olan düğümün kendisinde modellenir. Yangın musluğu, ona bağlı boru ve lülesi modellenmez; lüledeki basınç düğümdekinden düşüktür.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Bu, yerleşik çözücüyle hesaplanır.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Bu, EPANET motoruyla hesaplanır.';
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
$ec_lang['lpn_ff_summary_error']='Çözülemeyen düğümler ({n}).';
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
$ec_lang['lpn_ff_rows_more_links']='{n} hat daha gösterilmiyor.';
$ec_lang['lpn_ff_design_none']='Sınanan her düğümün yangın debisi sırayla çekildiğinde, tasarım kontrolü kapsamındaki hiçbir şey sınırlarını aşmadı.';
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
$ec_lang['lpn_ff_iso']='Sigorta Hizmetleri Ofisi (ISO), tek bir yangın musluğuna en fazla {flow} tanır. Bir düğüm birden fazla yangın musluğunu temsil edebileceği için bu sınır burada uygulanmaz.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Herhangi bir yangın debisi çekilmeden önce zaten kalıntının altında';
$ec_lang['lpn_ff_err_converge']='Şebeke yakınsamadı.';
$ec_lang['lpn_ff_err_solve']='Çözücü bir hata bildirdi ve yanıt vermedi.';
$ec_lang['lpn_ff_err_not_junction']='Düğüm değil';
$ec_lang['lpn_ff_err_unknown']='Sonuç yok. Hata kodu: {code}';

// ---- Water > Criticality analysis (Tom, 2026-09-30) -------------------------------------------
//
// Break each asset in turn, on a copy, and report what the system loses. "Criticality analysis" is
// the industry's term (WaterGEMS, InfoWater); EPANET has no such tool and no word for it. The run
// dialog, Run, Stop, the engine sentence and the cost line are fire flow's own keys.
//
// {n}, {done} and {total} are whole numbers; {pressure} is a pressure with its unit.
$ec_lang['lpn_crit_menu']='Kritiklik analizi…';
$ec_lang['lpn_crit_menu_tip']='Her boruyu, pompayı ve vanayı sırayla şebekeden çıkarın ve sistem üzerindeki etkiyi bildirin.';
$ec_lang['lpn_crit_title']='Kritiklik analizi';
$ec_lang['lpn_crit_intro']='Her varlık sırayla şebekeden çıkarılır ve şebeke, etkin senaryoda ekrandaki zaman adımında çözülür. Projenizde hiçbir şey değişmez; çalıştırmanın tamamı bir kopya üzerinde yapılır.';
$ec_lang['lpn_crit_scope']='Kırılacak hatlar';
$ec_lang['lpn_crit_scope_tip']='Tüm borular, pompalar ve vanalar, ya da yalnızca haritada seçilenler. Çalıştırmadan önce kümeyi seçin.';
$ec_lang['lpn_crit_scope_all']='Tüm hatlar';
$ec_lang['lpn_crit_scope_selected']='Seçili hatlar';
$ec_lang['lpn_crit_minpressure']='İzin verilen en düşük basınç';
$ec_lang['lpn_crit_minpressure_tip']='Bu, Yangın debisi analizindeki İzin verilen en düşük basınç ile aynı sayıdır. Burada değiştirmek orada da değiştirir.';
$ec_lang['lpn_crit_col_asset']='Varlık';
$ec_lang['lpn_crit_col_unserved']='Karşılanmayan talep';
$ec_lang['lpn_crit_col_cutoff']='Ayrılan düğümler';
$ec_lang['lpn_crit_col_below']='Asgarinin altındaki düğümler';
$ec_lang['lpn_crit_summary']='Talebi karşılanmamış bırakan veya bir düğümü {pressure} altına düşüren öğeler ({n} / {total}).';
$ec_lang['lpn_crit_baseline_below']='Hiçbir şey kırılmamışken zaten bunun altında olan düğümler: {n}. Bunlar sayılmaz.';
$ec_lang['lpn_crit_working']='Çalışıyor: {total} varlığın {done} tanesi.';
$ec_lang['lpn_crit_stopped']='{total} varlığın {done} tanesinden sonra durduruldu. Aşağıdaki sonuçlar tamamlanmış olanlardır.';
$ec_lang['lpn_crit_no_selection']='Hiçbir hat seçili değil. Hatları seçin veya Tüm hatlar\'ı seçin.';
$ec_lang['lpn_crit_no_links']='Bu projede henüz hat yok, bu yüzden kırılacak bir şey yok.';
$ec_lang['lpn_crit_busy']='Başka bir analiz çalışıyor. Durdurun ya da bitmesini bekleyin.';
$ec_lang['lpn_crit_skipped']='Seçili öğelerden {n} tanesi hat değil, bu yüzden kırılmadı.';
$ec_lang['lpn_crit_stale']='Çizim değişti, bu yüzden kritiklik sonuçları temizlendi. Yeniden çalıştırın.';
$ec_lang['lpn_crit_skipdead']='Çıkmaz uçları atla';
$ec_lang['lpn_crit_skipdead_tip']='Çıkmaz uçlu hat, kaldırıldığında yalnızca kendisi üzerinden ulaşılabilen düğümleri ayıran ve ötesinde rezervuar veya depo bulunmayan hattır. Kaybı, ötesindeki her şeydir, bu yüzden çözülmez. Özet kaçının atlandığını söyler.';
$ec_lang['lpn_crit_skipped_dead']='Atlanan çıkmaz uçlu hatlar: {n}. Her biri ötesindeki her şeyi ayırır.';

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
$ec_lang['lpn_ds_menu']='Talep ölçekleme…';
$ec_lang['lpn_ds_menu_tip']='Şebekenin bir kopyasında talepleri çarpın ve basınçları ile hızları görün, ya da sistemin taşıyabileceği en büyük talep ölçeğini bulun.';
$ec_lang['lpn_ds_title']='Talep ölçekleme';
$ec_lang['lpn_ds_intro']='Seçili düğümlerdeki talepleri talep ölçeğiyle çarpmak ve basınçları ile hızları görmek için Çalıştır düğmesine basın.\n\nBu düğümlerin tümünün izin verilen en düşük basıncı koruduğu en büyük talep ölçeğini {step} yaklaşıklığıyla bulmak için Bul düğmesine basın; arama 0\'dan {max}\'a kadar yapılır.\n\nİkisi de şebekenin bir kopyası üzerinde çalışır; kopya, etkin senaryoda ekrandaki zaman adımında çözülür, bu yüzden projenizde hiçbir şey değişmez. Yalnızca o zaman adımı ölçeklenir, seviyeler ve durumlar ondan alınır; tepe talebi sınamak için çalıştırmadan önce saati tepe talebine getirin.';
$ec_lang['lpn_ds_scope']='Ölçeklenecek düğümler';
$ec_lang['lpn_ds_scope_all']='Tüm düğümler';
$ec_lang['lpn_ds_scope_selected']='Seçili düğümler';
$ec_lang['lpn_ds_minpressure']='İzin verilen en düşük basınç';
$ec_lang['lpn_ds_minpressure_tip']='Bu, Yangın debisi analizindeki başka yerde izin verilen en düşük basınçla aynı sayıdır. Burada değiştirmek orada da değiştirir.';
$ec_lang['lpn_ds_head_scale']='Talepleri ölçekle';
$ec_lang['lpn_ds_multiplier']='Talep ölçeği';
$ec_lang['lpn_ds_multiplier_tip']='Her talebin çarpıldığı katsayı; 1,5 yüzde 50 artış demektir. Talepler içinde zaten bulunan etkin senaryonun talep çarpanına ek olarak uygulanır ve projeye asla kaydedilmez.';
$ec_lang['lpn_ds_run']='Çalıştır';
$ec_lang['lpn_ds_head_search']='Sistem hangi talep ölçeğini kaldırabilir?';
$ec_lang['lpn_ds_head_search_selected']='Bu düğümler hangi talep ölçeğini kaldırabilir?';
$ec_lang['lpn_ds_outside_below']='{m} talep ölçeğinde, seçili olmayan ve {pressure} değerinin altında olan düğümler: {n} ({ids}). Bunlar bu yanıtı sınırlamaz.';
$ec_lang['lpn_ds_holds_max']='✓ Her düğüm, aramanın üst sınırı olan {max} talep ölçeğine kadar {pressure} değerini korur.';
$ec_lang['lpn_ds_below_zero']='⚠ Ölçeklenmiş talepler sıfır olsa bile en az bir düğüm {pressure} değerinin altındadır.';
$ec_lang['lpn_ds_found']='✓ Denetlenen her düğüm, {m} talep ölçeğine kadar en az {pressure} değerini korur.';
$ec_lang['lpn_ds_found_below']='⚠ Girildiği gibi talepler (1 talep ölçeği), en az bir düğümü {pressure} değerinin altında bırakır. Her düğümü {pressure} veya üstünde tutan en büyük talep ölçeği {m} değeridir.';
$ec_lang['lpn_ds_search_stopped']='Arama, bir yanıt bulmadan durduruldu.';
$ec_lang['lpn_ds_lowest_at']='{m} talep ölçeğinde en düşük basınç, {id} düğümünde {pressure} değeridir.';
$ec_lang['lpn_ds_nosolve_at']='{m} talep ölçeğinde şebeke yanıt vermedi. {reason}';
$ec_lang['lpn_ds_scale_ok']='✓ {m} talep ölçeğinde her düğüm {pressure} değerini korur.';
$ec_lang['lpn_ds_scale_below']='⚠ {m} talep ölçeğinde {pressure} değerinin altındaki düğümler: {n}.';
$ec_lang['lpn_ds_scaled_selected']='Ölçeklenen ve denetlenen düğümler: {n}.';
$ec_lang['lpn_ds_head_lowest']='En düşük basınçlar';
$ec_lang['lpn_ds_head_velocity']='En yüksek hızlar';
$ec_lang['lpn_ds_col_link']='Hat';
$ec_lang['lpn_ds_col_scaled']='Ölçekli';
$ec_lang['lpn_ds_col_scaled_tip']='Talepler talep ölçeğiyle çarpılmış olarak.';
$ec_lang['lpn_ds_col_unscaled']='Ölçeksiz';
$ec_lang['lpn_ds_col_unscaled_tip']='Talepler etkin senaryoda bu zaman adımındaki haliyle, haritanın gösterdiği aynı değer.';
$ec_lang['lpn_ds_no_junctions']='Bu projede henüz düğüm yok, bu yüzden ölçeklenecek talep yok.';
$ec_lang['lpn_ds_no_selection']='Hiçbir düğüm seçili değil. Düğümleri seçin veya Tüm düğümler\'i seçin.';
$ec_lang['lpn_ds_skipped']='Düğüm olmayan, olduğu gibi bırakılan seçili öğeler: {n}.';
$ec_lang['lpn_ds_bad_multiplier']='Sıfır veya daha büyük bir talep ölçeği girin, örneğin 1,5.';
$ec_lang['lpn_ds_stale']='Çizim değişti, bu yüzden talep ölçekleme sonuçları temizlendi. Yeniden çalıştırın.';
$ec_lang['lpn_analyze_at_time']='Zaman adımı: {time}.';
$ec_lang['lpn_analyze_time_moved']='⚠ Bu {time} anında hesaplandı ve saat şimdi {now} anında. Ekrandaki zaman adımı için yeniden çalıştırın.';

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
$ec_lang['lpn_file_import_survey_tip']='Bir metin dosyasından ölçülmüş noktaların bir listesini okur ve her noktada bir düğüm oluşturur; dosyanın belirtmediği her şey için yeni varlık ayarlarını kullanır. Saha kodları olarak açıklamayı oku kutusunu işaretlemediğiniz sürece hiçbir boru çizilmez ve hiçbir satır adı belirtilmeden atlanmaz. Bu projenin zaten kullandığı koordinat sistemini okur, coğrafi referanslı olsun ya da olmasın.';
// GeoJSON import of Shapes (Task 779). Only points, lines and polygons come in, as Shapes; the
// network is imported from an EPANET file. Every feature not imported is named in the report.
$ec_lang['lpn_file_import_shapes']='GeoJSON figürlerini içe aktar…';
$ec_lang['lpn_file_import_shapes_tip']='Bir GeoJSON dosyasındaki noktaları, çizgileri ve çokgenleri bu projeye Figür olarak okur. Dosyadaki şebeke varlıkları içe aktarılmaz; şebekeyi bir EPANET dosyasından veya GeoJSON şebekesini içe aktar ile içe aktarın. Proje coğrafi referanslı olmalı veya bir koordinat sistemi belirtmelidir.';
$ec_lang['lpn_file_import_gjnet']='GeoJSON şebekesini içe aktar…';
$ec_lang['lpn_file_import_gjnet_tip']='Bir GeoJSON dosyasını yeni bir proje olarak açar. Noktalar düğüm, rezervuar veya depo olarak, çizgiler boru olarak içe aktarılır. Bu sayfadan dışa aktarılmış bir dosya yazıldığı gibi okunur; başka herhangi bir dosya için bir adım, alanlarını özelliklere ve birimlere eşler.';
$ec_lang['lpn_gjnet_refuse_crs']='{file}, {crs} koordinat sistemini belirtiyor. GeoJSON konumları WGS 84 enlem ve boylamıdır (RFC 7946) ve bu sayfa başka bir sistemdeki GeoJSON dosyasını dönüştürmez. Katmanı CBS\'den EPSG:4326 (WGS 84) olarak dışa aktarın, sonra o dosyayı içe aktarın.';
$ec_lang['lpn_gjnet_refuse_empty']='{file} hiç nokta veya çizgi içermiyor.';
$ec_lang['lpn_gjnet_target_node_type']='Düğüm türü';
$ec_lang['lpn_gjnet_target_custom']='Özel özellik';
$ec_lang['lpn_gjnet_target_skip']='İçe aktarma';
$ec_lang['lpn_gjnet_points_heading']='Nokta alanları (düğümler, rezervuarlar ve depolar)';
$ec_lang['lpn_gjnet_lines_heading']='Çizgi alanları (borular)';
$ec_lang['lpn_gjnet_no_fields']='Bu nesnelerin öznitelik alanı yok.';
$ec_lang['lpn_gjnet_col_field']='Alan';
$ec_lang['lpn_gjnet_col_example']='Örnek';
$ec_lang['lpn_gjnet_col_fills']='Doldurduğu';
$ec_lang['lpn_gjnet_col_unit']='Birim';
$ec_lang['lpn_gjnet_beta']='Beta: geri bildirim isteniyor';
$ec_lang['lpn_gjnet_beta_tip']='Bu içe aktarma, CBS programlarından gelen az sayıda dosyada denendi. Bir sorunu bildirmek veya bir değişiklik önermek için sayfadaki {button} düğmesine basın ve dosyayı anlatın.';
$ec_lang['lpn_gjnet_intro']='{points} nokta ve {lines} çizgi bulundu. Noktalar düğüm, rezervuar veya depo olarak, çizgiler boru olarak içe aktarılır. Her alanın doldurduğu özelliği ve her sayının birimini seçin.';
$ec_lang['lpn_gjnet_other']='{n} nesne ne nokta ne çizgi olduğundan içe aktarılmayacak; rapor bunları listeler.';
$ec_lang['lpn_gjnet_tolerance']='Birleştirme toleransı (m)';
$ec_lang['lpn_gjnet_tolerance_tip']='Bir noktaya veya başka bir çizgi ucuna bu uzaklık içindeki bir çizgi ucu ona bağlanır. Her noktadan bundan daha uzak bir çizgi ucu yeni bir düğüm alır.';
$ec_lang['lpn_gjnet_working']='{file} içe aktarılıyor…';
$ec_lang['lpn_gjnet_title']='GeoJSON şebekesini içe aktar: {file}';
$ec_lang['lpn_gjnet_report_lead']='İçe aktarma sırasında yapılan her değişiklik ve içe aktarılmayan her nesne, nedeniyle birlikte aşağıda listelenir:';
$ec_lang['lpn_gjnet_and_more']='ve {n} tane daha';
$ec_lang['lpn_gjnet_note_crs']='Dosya, RFC 7946\'nın gerektirdiği sistem olan WGS 84 enlem ve boylamı olan {crs} koordinat sistemini belirtiyor. Konumlar belirtildiği gibi okundu.';
$ec_lang['lpn_gjnet_note_crs_nad83']='Dosya NAD83\'ü (EPSG:4269) belirtiyor. Konumları WGS 84 olarak okundu; bu, onları NAD83\'ün koyduğu yerin yaklaşık 1 ila 2 m yakınına yerleştirir.';
$ec_lang['lpn_gjnet_note_skip_geometry']='İçe aktarılmadı: nesne bir nokta veya çizgi değil.';
$ec_lang['lpn_gjnet_note_skip_kind']='İçe aktarılmadı: nesne node_type veya link_type belirtmiyor.';
$ec_lang['lpn_gjnet_note_skip_position']='İçe aktarılmadı: bir konum geçerli bir enlem ve boylam değil.';
$ec_lang['lpn_gjnet_note_skip_id']='İçe aktarılmadı: ad geçerli bir ID değil veya aynı türden başka bir öğe onu taşıyor.';
$ec_lang['lpn_gjnet_note_skip_no_node']='İçe aktarılmadı: adı verilen başlangıç veya bitiş düğümü dosyada yok.';
$ec_lang['lpn_gjnet_note_skip_loop']='İçe aktarılmadı: çizginin her iki ucu da aynı düğüme bağlanıyor.';
$ec_lang['lpn_gjnet_note_id_new']='Bu nesneler geçerli bir ID belirtmiyor ve parantez içinde gösterilen ID atandı.';
$ec_lang['lpn_gjnet_note_id_dup']='Bu ID\'ler aynı türden birden fazla nesne tarafından belirtiliyor. Her sonraki nesneye parantez içinde gösterilen ID atandı.';
$ec_lang['lpn_gjnet_note_unmapped_id_point']='Nokta ID\'si için bir alan seçilmedi; bu yüzden bir noktadan içe aktarılan her düğüme bir ID atandı.';
$ec_lang['lpn_gjnet_note_unmapped_id_line']='Çizgi ID\'si için bir alan seçilmedi; bu yüzden her boruya bir ID atandı.';
$ec_lang['lpn_gjnet_note_skip_short']='İçe aktarılmadı: bir çizgi en az iki konum gerektirir.';
$ec_lang['lpn_gjnet_note_elev_taken']='Bu düğümler kot belirtmiyor. Her birine parantez içinde gösterilen düğümün kotu verildi: bir çizgi ucunda eklenen düğüm için borusunun öbür ucundaki düğümün, aksi halde kot belirten en yakın düğümün.';
$ec_lang['lpn_gjnet_note_default_elev_added']='Bu düğümler çizgi uçlarında eklendi ve varsayılan kota, {value}, sahip; çünkü dosyada hiçbir düğüm kot belirtmiyor.';
$ec_lang['lpn_gjnet_note_demand_kept']='Bir rezervuarın veya deponun talebi yoktur; bu yüzden bu düğümlerde belirtilen talep {key} özel özelliği olarak tutuldu.';
$ec_lang['lpn_gjnet_note_parts']='Bu çok parçalı çizgilerin bağlı olmayan parçaları var ve her parça için bir boru olarak içe aktarıldı.';
$ec_lang['lpn_gjnet_note_parts_points']='Bu çok noktalı nesneler her nokta için bir düğüm olarak içe aktarıldı.';
$ec_lang['lpn_gjnet_note_junction_added']='Bu düğümler, bir çizgi ucunun bir noktanın {tol} yakınında olmadığı yerlere eklendi. Her birinin varsayılan temel talebi var.';
$ec_lang['lpn_gjnet_note_end_moved']='Bu boruların bir noktanın veya başka bir çizgi ucunun {tol} yakınında, ama üzerinde olmayan bir ucu var. Uç ona bağlandı; en büyük uzaklık {dist}.';
$ec_lang['lpn_gjnet_note_end_on_pipe']='Bu çizgi uçları parantez içinde gösterilen borunun üzerinde, ama ucunda değil ve ona bağlı değil.';
$ec_lang['lpn_gjnet_note_z']='Bu noktalar içe aktarılmayan üçüncü bir koordinat belirtiyor.';
$ec_lang['lpn_gjnet_note_default_elev']='Bu düğümler kot belirtmiyor ve varsayılan kota, {value}, sahip.';
$ec_lang['lpn_gjnet_note_unmapped_elev']='Kot için bir alan seçilmedi; bu yüzden her düğümün varsayılan kotu, {value}, var ve otomatik uzunluklar kot farkı içermez.';
$ec_lang['lpn_gjnet_note_default_demand']='Bu düğümler temel talep belirtmiyor ve varsayılan temel talebe, {value}, sahip.';
$ec_lang['lpn_gjnet_note_unmapped_demand']='Temel talep için bir alan seçilmedi; bu yüzden her düğümün varsayılan temel talebi, {value}, var.';
$ec_lang['lpn_gjnet_note_default_diameter']='Bu borular çap belirtmiyor ve varsayılan çapa, {value}, sahip.';
$ec_lang['lpn_gjnet_note_unmapped_diameter']='Çap için bir alan seçilmedi; bu yüzden her borunun varsayılan çapı, {value}, var.';
$ec_lang['lpn_gjnet_note_default_roughness']='Bu borular pürüzlülük belirtmiyor ve varsayılan pürüzlülüğe, {value}, sahip.';
$ec_lang['lpn_gjnet_note_unmapped_roughness']='Pürüzlülük için bir alan seçilmedi; bu yüzden her borunun varsayılan pürüzlülüğü, {value}, var.';
$ec_lang['lpn_gjnet_note_default_k']='Bu borular küçük kayıp katsayısı belirtmiyor; bu yüzden her birinin değeri, hiçbirini belirtmeyen bir EPANET dosyasındaki gibi 0.';
$ec_lang['lpn_gjnet_note_unmapped_k']='Küçük kayıp katsayısı için bir alan seçilmedi; bu yüzden her borunun değeri, hiçbirini belirtmeyen bir EPANET dosyasındaki gibi 0.';
$ec_lang['lpn_gjnet_note_default_tank']='Bu depoların varsayılan su derinlikleri ve depo çapı var.';
$ec_lang['lpn_gjnet_note_length_auto']='Bu borular uzunluk belirtmiyor. Her uzunluk çizgiden hesaplanır (Otomatik).';
$ec_lang['lpn_gjnet_note_unmapped_length']='Uzunluk için bir alan seçilmedi; bu yüzden her boru uzunluğu çizgiden hesaplanır (Otomatik).';
$ec_lang['lpn_gjnet_note_value_unread']='Bu değerler sayı değil veya tanınmıyor ve kullanılmadı.';
$ec_lang['lpn_gjnet_note_field_skipped']='Bu alanlar, seçildiği gibi içe aktarılmadı.';
$ec_lang['lpn_gjnet_note_field_custom']='Bu alanlar özel özellikler olarak içe aktarıldı.';
$ec_lang['lpn_gjnet_note_results']='Dosyadaki sonuçlar içe aktarılmadı. Hesapla bunları yeniden hesaplar.';
$ec_lang['lpn_gjnet_note_demand_rows']='Bu düğümlerin birden fazla talep satırı vardı. Bir GeoJSON dosyası yalnızca ilkini tutar ve o içe aktarıldı.';
$ec_lang['lpn_gjnet_note_pipe_type']='Bu borular, tanımını bir GeoJSON dosyasının tutmadığı, parantez içinde gösterilen boru türünü belirtiyor. Boru türü içe aktarılmadı; dosyada belirtilen çap ve pürüzlülük içe aktarıldı.';
$ec_lang['lpn_gjnet_note_pattern_conflict']='Bu desenler farklı nesnelerde farklı çarpanlarla belirtilmiş. İlki kullanıldı.';
$ec_lang['lpn_gjnet_note_end_off_node']='Bu hatların her birinin çizgisi düğümünde başlamıyor veya bitmiyor. Düğüm konumu kullanıldı.';
$ec_lang['lpn_gjnet_note_not_held']='Bir GeoJSON dosyası kontrolleri, kuralları, zaman ayarlarını, metin etiketlerini, EPANET seçeneklerini veya boru türü, bağlantı parçası ve verim eğrisi kitaplıklarını tutmaz; bu yüzden bunların hiçbiri içe aktarılmadı.';
$ec_lang['lpn_geojson_import_done']='{n} Figür {file} dosyasından içe aktarıldı.';
$ec_lang['lpn_geojson_import_done_one']='{file} dosyasından bir Figür içe aktarıldı.';
$ec_lang['lpn_geojson_import_renamed']='{n} nesne adı Figür ID\'si olarak kullanılamaz. Her Figüre başka bir ID verildi ve nesne adı korundu: {list}.';
$ec_lang['lpn_geojson_import_renamed_one']='Bir nesne adı Figür ID\'si olarak kullanılamaz. Figüre başka bir ID verildi ve nesne adı korundu: {list}.';
$ec_lang['lpn_geojson_import_skipped']='{n} nesne içe aktarılmadı: {list}.';
$ec_lang['lpn_geojson_import_skipped_one']='Bir nesne içe aktarılmadı: {list}.';
$ec_lang['lpn_geojson_import_why_network']='şebeke varlığı';
$ec_lang['lpn_geojson_import_why_geometry']='nokta, çizgi veya çokgen değil';
$ec_lang['lpn_geojson_import_why_position']='konum geçerli bir enlem ve boylam değil';
$ec_lang['lpn_geojson_import_holes']='{n} çokgen deliği içe aktarılmadı. Bir Figürün tek bir sınırı vardır.';
$ec_lang['lpn_geojson_import_holes_one']='Bir çokgen deliği içe aktarılmadı. Bir Figürün tek bir sınırı vardır.';
$ec_lang['lpn_geojson_import_parts']='{n} çok parçalı nesne, her parça için ayrı bir Figür olarak içe aktarıldı.';
$ec_lang['lpn_geojson_import_parts_one']='Bir çok parçalı nesne, her parça için ayrı bir Figür olarak içe aktarıldı.';
$ec_lang['lpn_geojson_import_local']='GeoJSON konumları enlem ve boylamdır ve bu projenin, bunların dönüştürülebileceği Dünya üzerinde bir yeri yoktur. Önce Harita, Dünya haritası, Ekle ile coğrafi referanslayın, sonra yeniden içe aktarın.';
$ec_lang['lpn_geojson_import_unreadable']='{file} bir GeoJSON dosyası değil: {detail}';
$ec_lang['lpn_file_import_dxf']='DXF figürlerini içe aktar…';
$ec_lang['lpn_file_import_dxf_tip']='Bir ASCII DXF dosyasındaki noktaları, çizgileri ve çoklu çizgileri bu projeye Figür olarak okur; her katman adı bir özellik olarak korunur. Diğer öğeler sayılır ve listelenir, içe aktarılmaz. Koordinatlar dönüşüm yapılmadan bu projenin X ve Y değerleri olarak okunur.';
$ec_lang['lpn_file_import_shp']='Shapefile figürlerini içe aktar…';
$ec_lang['lpn_file_import_shp_tip']='Bir ESRI shapefile dosyasındaki noktaları, çizgileri ve çokgenleri bu projeye Figür olarak okur; öznitelik sütunları özellik olarak korunur. .zip dosyasını ya da .shp dosyasını .shx, .dbf ve .prj dosyalarıyla birlikte seçin (birden çok dosya seçmek için Ctrl veya Shift tuşunu basılı tutun). Projeden farklı bir koordinat sistemindeki koordinatlar dönüştürülür ve bildirimde bu belirtilir.';
$ec_lang['lpn_dxf_import_skipped']='{n} öğe içe aktarılmadı: {list}.';
$ec_lang['lpn_dxf_import_skipped_one']='Bir öğe içe aktarılmadı: {list}.';
$ec_lang['lpn_dxf_import_inblocks']='blok tanımlarında';
$ec_lang['lpn_dxf_import_bulge']='{n} çoklu çizgide yay segmentleri var; bunlar kırılma noktaları arasında düz segmentler olarak içe aktarıldı.';
$ec_lang['lpn_dxf_import_bulge_one']='Bir çoklu çizgide yay segmentleri var; bunlar kırılma noktaları arasında düz segmentler olarak içe aktarıldı.';
$ec_lang['lpn_dxf_import_units']='Çizim birimlerini {theirs} olarak belirtiyor, bu proje ise {ours} kullanıyor. Sayılar değiştirilmedi.';
$ec_lang['lpn_dxf_import_refuse_geo']='Bir DXF çizimi düzlemseldir ve bu proje enlem ve boylamdadır, bu yüzden {file} dosyasının koordinatlarının projede yeri yoktur. Projeyi bir koordinat sistemine kopyalamak için Farklı dönüştür… komutunu kullanın, sonra yeniden içe aktarın.';
$ec_lang['lpn_dxf_import_unreadable']='{file} bir ASCII DXF dosyası değil.';
$ec_lang['lpn_dxf_import_binary']='{file} ikili bir DXF dosyasıdır. CAD programınızdan ASCII DXF olarak kaydedin, sonra yeniden içe aktarın.';
$ec_lang['lpn_shapes_import_frame']='Koordinatlar dönüşüm yapılmadan {frame} olarak okundu.';
$ec_lang['lpn_shapes_frame_xy']='bu projenin X ve Y değerleri';
$ec_lang['lpn_shapes_frame_latlon']='enlem ve boylam';
$ec_lang['lpn_shp_import_skipped']='{n} kayıt, geometri türü okunmadığı için içe aktarılmadı: {list}.';
$ec_lang['lpn_shp_import_skipped_one']='Bir kayıt, geometri türü okunmadığı için içe aktarılmadı: {list}.';
$ec_lang['lpn_shp_import_attrs']='Her Figürün özellikleri olarak korunan öznitelik sütunları: {list}.';
$ec_lang['lpn_shp_import_noprj']='.prj dosyası yok, bu yüzden koordinatlar dönüşüm yapılmadan {frame} olarak okundu.';
$ec_lang['lpn_shp_import_prj_same']='.prj dosyası {crs} değerini belirtiyor; bu, bu projenin koordinat sistemidir, bu yüzden koordinatlar değiştirilmedi.';
$ec_lang['lpn_shp_import_converted']='Koordinatlar enlem ve boylamdır. Haritanın kullandığı dönüşümle {crs} sistemine dönüştürüldü.';
$ec_lang['lpn_shp_import_prj_other']='.prj dosyası {theirs} değerini belirtiyor. Bu proje bir koordinat sistemi belirtmiyor, bu yüzden koordinatlar dönüşüm yapılmadan {frame} olarak okundu.';
$ec_lang['lpn_shp_import_refuse_local']='{file} enlem ve boylamdadır ve bu projenin, bunların dönüştürülebileceği Dünya üzerinde bir yeri yoktur. Önce Harita, Dünya haritası, Ekle ile coğrafi referanslayın, sonra yeniden içe aktarın.';
$ec_lang['lpn_shp_import_refuse_crs']='{file} {theirs} değerini belirtiyor ve bu proje {ours} sistemindedir. Hiçbir şey içe aktarılmadı ve hiçbir şey dönüştürülmedi.';
$ec_lang['lpn_shp_import_refuse_range']='{file} dosyasında .prj dosyası yok ve koordinatları enlem ve boylam değil, bu yüzden bu projeye yerleştirilemez.';
$ec_lang['lpn_shp_import_noshp']='{file} içinde .shp dosyası yok. Bir shapefile\'ın .zip dosyasını ya da .shp dosyasını .shx, .dbf ve .prj dosyalarıyla birlikte seçin (birden çok dosya seçmek için Ctrl veya Shift tuşunu basılı tutun).';
$ec_lang['lpn_shp_import_manyshp']='{file} birden fazla shapefile içeriyor. Birer birer içe aktarın.';
$ec_lang['lpn_shp_import_unreadable']='{file} bu sayfanın okuyabildiği bir shapefile değil: {detail}';
$ec_lang['lpn_shp_import_pick_hint']='Bir shapefile birkaç dosyadan oluşur. .shp dosyasını .shx, .dbf ve .prj dosyalarıyla birlikte seçin (birden çok dosya seçmek için Ctrl veya Shift tuşunu basılı tutun) ya da .zip dosyasını seçin.';
$ec_lang['lpn_shp_import_webmerc_ask']='{file} dosyasında .prj dosyası yok ve sayıları enlem ve boylam değil; ancak QGIS\'in ve web haritalarının kullandığı Web Mercator metresine (EPSG:3857) uyuyor. EPSG:3857 olarak içe aktarılıp bu projeye dönüştürülsün mü?';
$ec_lang['lpn_shp_import_webmerc_ok']='EPSG:3857 olarak içe aktar';
$ec_lang['lpn_shp_import_webmerc_far_ask']='{file} dosyası {theirs} değerini belirtiyor ve bu sistemde okunduğunda koordinatları bu projeden {km} km uzağa düşüyor. QGIS\'in ve web haritalarının kullandığı Web Mercator metresi (EPSG:3857) olarak okunduğunda, bu projenin bulunduğu yere düşüyor. EPSG:3857 olarak içe aktarılıp bu projeye dönüştürülsün mü?';
$ec_lang['lpn_shp_import_reprojected']='Koordinatlar {theirs} sisteminden {ours} sistemine dönüştürüldü.';
$ec_lang['lpn_shp_import_unplaced']='{n} kaydın, bu projenin yerleştiremediği koordinatları var, örneğin haritanın sınırını aşan bir enlem. Kayıt numaraları: {list}.';
$ec_lang['lpn_shp_import_unplaced_one']='Bir kaydın, bu projenin yerleştiremediği koordinatları var, örneğin haritanın sınırını aşan bir enlem. Kayıt numarası: {list}.';
$ec_lang['lpn_shapes_import_none']='{file} dosyasından hiçbir şey içe aktarılmadı.';
$ec_lang['lpn_shp_import_convert_hint']='Projeyi {theirs} sistemine kopyalamak için Farklı dönüştür… komutunu kullanın, sonra yeniden içe aktarın.';
$ec_lang['lpn_shp_import_damaged']='{file} hasarlı veya yarım kesilmiş, bu yüzden hiçbir şey içe aktarılmadı.';
$ec_lang['lpn_shp_import_deleted']='{n} kayıt .dbf dosyasında silinmiş olarak işaretli olduğu için içe aktarılmadı.';
$ec_lang['lpn_shp_import_deleted_one']='Bir kayıt .dbf dosyasında silinmiş olarak işaretli olduğu için içe aktarılmadı.';
$ec_lang['lpn_dxf_import_paperspace']='kâğıt uzayında';
$ec_lang['lpn_shapes_import_more']='ve {n} tane daha';
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
$ec_lang['lpn_survey_report_clean']='Dosyadaki her nokta değişiklik olmadan içe aktarıldı.';
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
// Field codes (Task 771): the Description read as Carlson-style codes. See dev/survey-codes.md.
$ec_lang['lpn_survey_codes_toggle']='Açıklamayı saha kodları olarak oku';
$ec_lang['lpn_survey_codes_tip']='Her açıklamanın ilk sözcüğünü tablodaki bir kod olarak okuyun. Aynı hat koduna sahip noktalar dosya sırasına göre tek bir boruya birleşir; WL1 ve WL2 ayrı hatlardır. +0 bir hattı başlatır, -0 bitirir ve CLO kapatır. JPN ve ardından bir nokta adı, o noktaya bağlanır (Carlson); Civil 3D bunu CPN olarak yazar.';
$ec_lang['lpn_survey_codes_col_code']='Kod';
$ec_lang['lpn_survey_codes_col_type']='Öğe türü';
$ec_lang['lpn_survey_codes_add']='Kod ekle';
$ec_lang['lpn_survey_codes_remove']='Kodu kaldır';
$ec_lang['lpn_survey_confirm_coded']='{j} düğüm, {r} rezervuar, {t} depo ve {p} boru bulundu. Devam edilsin mi?';
$ec_lang['lpn_survey_report_coded']='{j} düğüm, {r} rezervuar, {t} depo ve {p} boru içe aktarıldı; düğümlerden {m} tanesi kotlu.';
$ec_lang['lpn_survey_note_code_unknown']='Kod tablosunda yok, yukarıda seçilen öğe türü olarak içe aktarıldı.';
$ec_lang['lpn_survey_note_code_two_nodes']='Birden fazla düğüm kodu var, ilki kullanıldı.';
$ec_lang['lpn_survey_note_code_unread']='Her sözcük bu sayfanın okuduğu bir kod değil, açıklamada tutuldu.';
$ec_lang['lpn_survey_note_vertex_text']='Her sözcük bu sayfanın okuduğu bir kod değil ve bir kırılma noktası açıklama tutmaz.';
$ec_lang['lpn_survey_note_join_missing']='JPN veya CPN, bu dosyada ya da projede olmayan bir noktayı adlandırıyor; bunun için boru çizilmedi.';
$ec_lang['lpn_survey_note_join_no_line']='JPN veya CPN, hat kodu olmayan bir noktada; bunun için boru çizilmedi.';
$ec_lang['lpn_survey_note_pipe_one_node']='Bu hat, arada başka düğüm olmadan aynı düğüme dönüyor; bunun için boru çizilmedi.';
$ec_lang['lpn_survey_note_line_one_point']='Hattındaki tek nokta olduğu için ondan boru çizilmedi.';
$ec_lang['lpn_survey_note_vertices']='Boru kırılma noktası olan noktalar: {detail}. Bir kırılma noktası ad, kot veya açıklama tutmaz.';
$ec_lang['lpn_survey_note_no_desc']='Saha kodları açık, ancak bu dosyada açıklama sütunu yok, bu yüzden kod okunmadı.';
$ec_lang['lpn_survey_note_ring_junction']='Bu nokta, halka kapanabilsin diye düğüm oldu.';
$ec_lang['lpn_survey_note_pipe_zero_length']='Bu nokta kendinden önceki düğümle aynı yerde, bu yüzden aralarındaki borunun uzunluğu yok.';
$ec_lang['lpn_survey_note_node_on_pipe']='Bu nokta, bağlı olmadığı bir borunun tam üzerinde. Bağlanıyorlarsa, bunu belirtmek için JPN ekleyin.';
$ec_lang['lpn_settings_demand_model']='Talep modeli';
$ec_lang['lpn_settings_demand_model_tip']='Düğümlerin debiyi nasıl aldığını seçin. Talebe dayalı (DDA) model, basınç ne olursa olsun her talebi tam olarak karşılar. Basınca dayalı (PDA) model, basıncın gereken basıncın altında olduğu yerde talepten daha azını karşılar ve onu yalnızca EPANET çözücüsü hesaplar.';
$ec_lang['lpn_settings_demand_model_dda']='Talebe dayalı';
$ec_lang['lpn_settings_demand_model_pda']='Basınca dayalı';
$ec_lang['lpn_settings_min_pressure']='Asgari basınç';
$ec_lang['lpn_settings_min_pressure_tip']='Bir düğümün hiç debi almadığı basıncı veya altını girin. Bu projenin basınç birimini kullanın.';
$ec_lang['lpn_settings_req_pressure']='Gereken basınç';
$ec_lang['lpn_settings_req_pressure_tip']='Bir düğümün talebinin tamamını aldığı basıncı veya üstünü girin. Asgari basınçtan büyük olmalıdır. Bu projenin basınç birimini kullanın. EPANET\'in varsayılanını kullanmak için boş bırakın; bu, ABD debi birimlerinde psi, diğerlerinde metredir.';
$ec_lang['lpn_settings_pressure_exponent']='Basınç üssü';
$ec_lang['lpn_settings_pressure_exponent_tip']='Asgari basınçta sıfır debiden gereken basınçta talebin tamamına yükselen eğrinin üssünü girin.';
$ec_lang['lpn_engine_pda_route']='Talep modeli basınca dayalı olduğu için EPANET çözücüsüyle çözüldü.';
$ec_lang['lpn_diag_pda_needs_epanet']='Talep modeli basınca dayalıdır ve onu yalnızca EPANET çözücüsü hesaplayabilir. EPANET çözücüsü yüklenemedi, bu yüzden bu sonuçlar eksik.';
$ec_lang['lpn_result_delivered_demand']='Karşılanan talep';
$ec_lang['lpn_result_delivered_demand_tip']='Bu düğümün basınca dayalı talep modeli altında gerçekte aldığı debi. Basınç gereken basıncın altındaysa talepten azdır.';
$ec_lang['lpn_result_demand_deficit']='Talep açığı';
$ec_lang['lpn_result_demand_deficit_tip']='Basınç gereken basıncın altında olduğu için karşılanmayan, bu düğümdeki talep.';
$ec_lang['lpn_pda_deficit_note']='Talebinden azını alan düğümler: {n}.';
$ec_lang['lpn_diag_pda_pressures']='Gereken basınç, Asgari basınçtan büyük olmalıdır. Ayarlar\'da birini değiştirin.';
$ec_lang['lpn_inp_drop_pressure_unit']='Bu dosya, bu sayfanın debi birimi için okuduğundan (ABD birimlerinde psi, diğerlerinde metre) farklı bir basınç birimi belirtiyor. Dosyadaki her basınç bu şekilde okunur, bu yüzden içerdiği vana ayarlarını, damlatıcıları ve basınca dayalı sınırları kontrol edin. Satır korunur ve geri yazılır.';

// Map > Screenshot (Tom, 2026-10-05): a snipping tool that re-draws the dragged map area larger than its screen size (3x unless the Screenshot box says otherwise).
$ec_lang['lpn_screenshot_menu']='Ekran görüntüsü';
$ec_lang['lpn_screenshot_tip']='Sürüklediğiniz harita alanının ekrandan daha yüksek çözünürlükte bir görüntüsünü alın. Üzerine işaretlemeler yapın, ardından Kopyala düğmesiyle bir rapora kopyalayın. Tüm haritayı almak için sürüklemeden tıklayın.';
$ec_lang['lpn_screenshot_hint']='Harita üzerinde bir dikdörtgen sürükleyin veya tüm harita için tıklayın. Esc iptal eder.';
$ec_lang['lpn_screenshot_copied']='Ekran görüntüsü kopyalandı.';
$ec_lang['lpn_screenshot_saved']='Pano burada kullanılamıyor, bu yüzden ekran görüntüsü PNG dosyası olarak indirildi.';
$ec_lang['lpn_screenshot_no_basemap']='Sokak haritası veya uydu görüntüsü dahil edilemedi.';
$ec_lang['lpn_screenshot_failed']='Ekran görüntüsü yapılamadı.';
$ec_lang['lpn_snip_hint_free']='Kırpılacak alanın çevresinde sürükleyin veya tüm harita için tıklayın. Esc iptal eder.';
$ec_lang['lpn_snip_tip_rect']='Dikdörtgen kırp (S)';
$ec_lang['lpn_snip_tip_free']='Serbest biçimli şekil kırp (S)';
$ec_lang['lpn_snip_tip_mode']='Kırpma şekli';
$ec_lang['lpn_snip_tip_map']='Tüm haritanın ekran görüntüsü';
$ec_lang['lpn_snip_tip_pen']='Kalem';
$ec_lang['lpn_snip_tip_eraser']='Silgi: kaldırmak için bir çizgiye tıklayın (E)';
$ec_lang['lpn_snip_tip_undo']='Geri al (Ctrl+Z)';
$ec_lang['lpn_snip_tip_redo']='Yinele (Ctrl+Y)';
$ec_lang['lpn_snip_tip_copy']='Kopyala (Ctrl+C)';
$ec_lang['lpn_screenshot_scale_tip']='Görüntünün boyutu, ekrandaki alanın katı olarak. Daha büyük olanı daha keskindir ve daha büyük bir dosya oluşturur.';
