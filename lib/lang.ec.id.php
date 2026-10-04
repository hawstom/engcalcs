<?php

// Bahasa Indonesia — All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='fraksi';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/s';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% naik/datar';
$ec_lang['u_grade']='naik/datar';
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
$ec_lang['u_imgd']='IMGD';
$ec_lang['u_afd']='ac-ft/hari';
$ec_lang['u_lpm']='L/menit';
$ec_lang['u_cmh']='m^3/jam';
$ec_lang['u_cmd']='m^3/hari';
$ec_lang['u_mh2o']='m H2O';
$ec_lang['u_mld']='ML/hari';
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
$ec_lang['u_s']='dtk';
$ec_lang['u_hr']='jam';
$ec_lang['u_day']='hari';
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
$ec_lang['menu_brand']='Kalkulator HawsEDC';
$ec_lang['menu_main_hydraulics']='Hidraulika';
$ec_lang['menu_help']='Bantuan';
$ec_lang['menu_libre']='Perangkat Lunak Bebas';
$ec_lang['template_welcome']='Buang rasa takutmu di pintu; di sini cinta adalah bahasa kami. Kamu tidak merusak segalanya. Nikmati juga <a target="_blank" href="https://hawsedc.com/download.php">alat AutoCAD HawsEDC gratis</a>.';
$ec_lang['template_feedback']='Bisakah Anda menyarankan kata-kata yang lebih baik untuk halaman ini, atau ada hal lain yang bisa diperbaiki? Apakah Anda ingin membantu, atau belajar membuat alat seperti ini? Silakan hubungi saya.';
$ec_lang['template_printable_title']='Judul Cetak';
$ec_lang['template_printable_subtitle']='Subjudul Cetak';
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
$ec_lang['consent_body']='Bolehkah kami menyimpan satu digit angka (cookie) di peramban ini untuk mengingat bahwa kami sudah menghitung kunjungan ke halaman ini? Cookie ini tidak mencatat apa pun tentang Anda maupun apa pun yang Anda ketik. Tanpanya, kami tidak dapat membedakan kunjungan kedua Anda dari kunjungan pertama orang lain.';
$ec_lang['consent_accept']='Terima kali ini';
$ec_lang['consent_accept_all']='Selalu terima';
$ec_lang['consent_decline']='Selalu tolak';
$ec_lang['consent_current_granted']='Anda mengizinkan ini. Kami membatasi pencatatan untuk profil peramban ini.';
$ec_lang['consent_current_denied']='Anda menolak ini. Kami tidak menyimpan apa pun untuk membatasi pencatatan pada profil peramban ini.';
$ec_lang['consent_region_label']='Pilihan Anda tentang pembatasan pencatatan.';
$ec_lang['consent_settings_link']='Pengaturan cookie';
$ec_lang['privacy_link']='Kebijakan Privasi';
$ec_lang['terms_link']='Ketentuan Penggunaan';
$ec_lang['index_main_title']='Kalkulator Teknik Gratis Daring';
$ec_lang['index_meta_desc_plain']='Kalkulator teknik hidraulika gratis untuk pipa, saluran, ambang, dan irigasi. Berjalan di peramban Anda, bisa dipakai luring, dan tersedia dalam 27 bahasa.';
$ec_lang['calc_set_units']='Atur satuan:';
$ec_lang['calc_set_units_tip']='Mengatur satuan semua kolom sekaligus. Tidak merusak: angka yang Anda ketik tetap seperti semula, dan masing-masing kini dibaca dalam satuan baru. Angka 6 tetap 6, tetapi sekarang berarti 6 inci, bukan 6 milimeter.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Pulihkan Default';
$ec_lang['calc_defaults_confirm']='Setel ulang kalkulator ke nilai default asli?';
$ec_lang['points_data_note']='(atau Salin/Tempel menggunakan area data)';
$ec_lang['points_data_heading']='Data kalkulator<br />(gunakan Salin untuk melihat format)';
$ec_lang['points_data_copy']='Salin';
$ec_lang['points_data_paste']='Tempel';
$ec_lang['calc_inputs']='Masukan';
$ec_lang['calc_results']='Hasil';
$ec_lang['view_hide_line']='Sembunyikan baris ini';
$ec_lang['view_printable']='Versi cetak (muat ulang untuk memulihkan)';
$ec_lang['ec_name_label']='Simpan perhitungan ini:';
$ec_lang['ec_name_placeholder']='Nama';
$ec_lang['ec_name_tip']='Menyimpan nilai masukan ini ke URL untuk penanda halaman, pengambilan riwayat, dan berbagi';
$ec_lang['calc_copy_link']='Salin tautan';
$ec_lang['ec_related_calcs']='Kalkulator terkait:';
$ec_lang['calc_copy_link_done']='Tersalin!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Kehilangan Tinggi Tekan Pipa Darcy-Weisbach';
$ec_lang['dw_main_title']='Kalkulator Kehilangan Tinggi Tekan Pipa Darcy-Weisbach Gratis Daring';
$ec_lang['dw_main_desc']='Kehilangan Tinggi Tekan Pipa Darcy-Weisbach pada Diameter, Kekasaran, dan Debit Tertentu';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Tinggi kekasaran absolut, e, dari dinding pipa. Nilai tipikal: baja (baru) 0,046 mm, baja (bekas pakai) 0,15 mm, HDPE 0,003 mm, PVC/uPVC 0,0015 mm, beton 0,3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s untuk air bersih pada 20°C">Viskositas kinematik, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Viskositas kinematik, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s untuk air bersih pada 20°C';
$ec_lang['dw_reynolds_number']='Bilangan Reynolds, Re';
$ec_lang['dw_flow_regime']='Rezim aliran';
$ec_lang['dw_regime_laminar']='laminar';
$ec_lang['dw_regime_transitional']='transisi';
$ec_lang['dw_regime_turbulent']='turbulen';
$ec_lang['dw_friction_factor_method']='Metode faktor gesekan';
$ec_lang['dw_friction_factor']='Faktor gesekan, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Kehilangan Tinggi Tekan Pipa Hazen-Williams';
$ec_lang['hw_main_title']='Kalkulator Kehilangan Tinggi Tekan Pipa Hazen-Williams Gratis Daring';
$ec_lang['hw_main_desc']='Kehilangan Tinggi Tekan Pipa Hazen-Williams pada Diameter, Kekasaran, dan Debit Tertentu';
$ec_lang['hw_hgl_1']='HGL Hilir';
$ec_lang['hw_hgl_2']='HGL Hulu';
$ec_lang['hw_elev_up']='Elevasi hulu';
$ec_lang['hw_pressure_up']='Tekanan hulu';
$ec_lang['hw_elev_down']='Elevasi hilir';
$ec_lang['hw_pressure_down']='Tekanan hilir';
$ec_lang['hw_pressure_check']='Cek tekanan';
$ec_lang['hw_pressure_ok_short']='Tekanan positif';
$ec_lang['hw_pressure_neg_short']='Tekanan negatif';
$ec_lang['hw_pressure_neg']='Tekanan hilir di bawah nol. Garis tinggi tekan hidrolik (HGL) turun di bawah pipa, sehingga pipa tidak akan mengalir penuh dan hasil ini mungkin tidak valid.';
$ec_lang['hw_roughness']='Koefisien Hazen-Williams, C';
$ec_lang['hw_note_1']='<dl><dt>Kalkulator ini tidak memodelkan profil pipa di antara kedua ujungnya.</dt><dd>Kalkulator hanya menggunakan elevasi hulu dan hilir yang Anda masukkan. Jika permukaan tanah naik lebih tinggi daripada salah satu ujung di suatu titik di antaranya, tekanan pada titik tertinggi itu lebih rendah daripada tekanan mana pun yang dilaporkan di sini. Jalankan kembali kalkulator untuk panjang dari ujung hulu hingga titik tertinggi tersebut untuk memeriksanya.</dd><dd>Ketika garis tinggi tekan hidrolik (HGL) turun di bawah pipa, air berada dalam tekanan negatif. Udara keluar dari larutan, pipa berdinding tipis dapat runtuh, dan air tanah yang kotor dapat tertarik masuk melalui sambungan. Jaga agar jalur tetap berada dalam tekanan positif di semua titik, dan pertimbangkan pemasangan katup udara di setiap titik tertinggi.</dd><dt>Tekanan hulu adalah kondisi batas yang Anda tetapkan sendiri.</dt><dd>Baca nilainya dari alat ukur tekanan (gauge), dari muka air tangki (tinggi air di atas pipa), atau dari kurva pompa. Pompa menghasilkan tekanan yang lebih rendah seiring meningkatnya debit, jadi gunakan titik pada kurva yang sesuai dengan debit yang dimasukkan di atas.</dd><dt>Jumlahkan sendiri koefisien kehilangan kecil (lokal).</dt><dd>Totalkan nilai K untuk setiap katup, belokan, tee, meter, dan lubang masuk pada jalur pipa, lalu masukkan jumlah tersebut. Ikuti tautan pada input tersebut untuk nilai-nilai umum. Pada pipa transmisi utama yang panjang, kehilangan ini kecil dibandingkan dengan gesekan, tetapi pada pipa pendek di dalam stasiun pompa, kehilangan ini bisa menjadi bagian terbesar dari total kehilangan.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Saluran Penampang Tidak Beraturan Manning';
$ec_lang['mi_main_title']='Kalkulator Saluran Penampang Tidak Beraturan Manning Gratis Daring';
$ec_lang['mi_main_desc']='Kalkulator Aliran Seragam Saluran Penampang Tidak Beraturan dengan Rumus Manning';
$ec_lang['mi_waterSurfaceElevation']='Elevasi permukaan air';
$ec_lang['mi_q_617']='<span class="ec-help" title="Debit komposit, Q, menggunakan n komposit untuk setiap zona menurut Chow 6-17, kecepatan sama">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Titik penampang melintang';
$ec_lang['mi_groupPoint']='Titik';
$ec_lang['mi_groupSegment']='Segmen';
$ec_lang['mi_groupRegion']='Zona';
$ec_lang['mi_station']='STA';
$ec_lang['mi_elevation']='Elev';
$ec_lang['mi_n']='n<br />untuk<br />seg-<br />men';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />batas<br />zona<br />(Tebing)';
$ec_lang['mi_tau']='Tegangan<br />geser<br />dasar<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n<br />komposit';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='n komposit';
$ec_lang['mi_notes_1_def']='Kalkulator ini mengikuti Manual Referensi HEC-RAS dalam menghitung n komposit zona menggunakan Chow 1959, halaman 136, persamaan 6-17 (bukan 6-18).';


$ec_lang['mi_notes_2_term']='Pelapis batu';
$ec_lang['mi_notes_2_def']='Gunakan Kalkulator Saluran Trapesium Manning untuk merancang pelapis batu. Kalkulator ini lebih sesuai untuk penampang alami.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Aliran Pipa Manning';
$ec_lang['mpf_main_title']='Kalkulator Aliran Pipa Manning Gratis Daring';
$ec_lang['mpf_main_desc']='Rumus Manning untuk Aliran Pipa Seragam pada Kemiringan dan Kedalaman Tertentu';
$ec_lang['mpf_pipe_diameter']='Diameter pipa, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Koefisien kekasaran Manning, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Kemiringan gesekan, S<sub>f</sub></a><span class="ec-help" title="Terkadang sama dengan kemiringan pipa. Ikuti tautan untuk penjelasan (hanya dalam bahasa Inggris)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Kedalaman aliran relatif, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Debit, Q';
$ec_lang['mpf_flow_tip']='Debit dan kedalaman dihitung untuk pipa yang sangat panjang (tak terhingga). Untuk mengalirkan debit ini ke dalam pipa mungkin diperlukan kedalaman air hulu yang lebih tinggi. Lihat Catatan di bawah untuk detail dan video tutorial.';
$ec_lang['mpf_velocity']='Kecepatan, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Energi kinetik sebagai tinggi kolom air, v²/2g">Tinggi kecepatan, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Luas aliran, A';
$ec_lang['mpf_pipe_area']='Luas pipa, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Luas relatif, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Keliling basah, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Jari-jari hidrolik, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Lebar permukaan air, T';
$ec_lang['mpf_froude_number']='Bilangan Froude, Fr';
$ec_lang['mpf_shear_stress']='Tegangan geser rata-rata, τ';
$ec_lang['mpf_full_flow']='Aliran penuh, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Rasio terhadap aliran penuh, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Ini adalah debit dan kedalaman di dalam pipa yang panjangnya <em>tak terhingga</em>.</dt><dd>Memasukkan aliran ke dalam pipa mungkin memerlukan kedalaman air hulu yang jauh lebih tinggi. Tambahkan setidaknya 1,5 kali tinggi kecepatan untuk memperkirakan kedalaman air hulu, atau <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">lihat tutorial 2 menit saya</a> untuk perhitungan standar air hulu gorong-gorong menggunakan <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, program gorong-gorong gratis dari Badan Jalan Raya Federal Amerika Serikat (U.S. Federal Highway Administration).</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Sedang merancang saluran air limbah?</dt><dd>Lihat <a target="_blank" href="/sewslope.php">tabel kemiringan minimum saluran limbah</a> untuk pipa 4 hingga 96 inci (100 hingga 2400 mm), dinyatakan dalam m/m, mm/m, dan persen, serta studi <a target="_blank" href="/peakfact.php">faktor puncak untuk debit sangat rendah</a>. Keduanya adalah dokumen referensi dalam bahasa Inggris saja.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Masukkan Q target yang positif.';
$ec_lang['mpf_solver_no_solution']='Tidak ada solusi: Q melebihi kapasitas pipa pada y/d0 = 93.8% (Qmax = {qmax} dalam satuan yang dipilih).';
$ec_lang['mpf_solve_btn']='Hitung';
$ec_lang['mpf_solve_for_flow']='untuk debit, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Kehilangan Tinggi Tekan Pipa Manning';
$ec_lang['mphl_main_title']='Kalkulator Kehilangan Tinggi Tekan Pipa Manning Gratis Daring';
$ec_lang['mphl_main_desc']='Rumus Manning untuk Kehilangan Tinggi Tekan pada Aliran Penuh Tertentu';
$ec_lang['mphl_pipe_length']='Panjang, L';
$ec_lang['mphl_area']='Luas, A';
$ec_lang['mphl_total_junction_k']='Koefisien kehilangan kecil (lokal), k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Koefisien kehilangan, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Koefisien kehilangan kecil (lokal), km. Kehilangan ini terjadi pada sambungan pipa, pintu masuk, pintu keluar, belokan, dan katup — istilah "minor" bersifat konvensional namun menyesatkan; pada jalur pipa pendek, kehilangan ini dapat menyamai atau bahkan melebihi kehilangan gesekan. Nilai k tipikal: pintu masuk tajam (sharp intake) 0,5, setiap belokan 45° 0,2–0,3, katup gerbang (gate valve, terbuka penuh) 0,1, katup kupu-kupu (butterfly valve) 0,2, pintu keluar (ke reservoir atau atmosfer) 1,0. Jumlahkan semua fitting untuk mendapatkan total km. Nilai default 2,0 mengasumsikan satu pintu masuk, satu pintu keluar, dan dua belokan 45°.';
$ec_lang['mphl_friction_slope']='Kemiringan gesekan';
$ec_lang['mphl_friction_loss']='Kehilangan gesekan, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Kehilangan kecil (lokal), h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Kehilangan total, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='EGL Hilir';
$ec_lang['mphl_egl_2']='EGL Hulu';
$ec_lang['mphl_hgl_egl_tip']='Hasil ini mungkin tidak valid di tempat pipa naik di atas garis tinggi tekan hidrolik.';
$ec_lang['mphl_note_1']='<dl><dt>Kalkulator ini tidak memodelkan profil pipa di antara kedua ujungnya.</dt><dd>Jika HGL turun di bawah bagian atas pipa pada titik mana pun, perhitungan ini mungkin tidak valid.</dd><dt>Untuk kondisi saluran masuk terbuka (gorong-gorong), perlu diperiksa kondisi kendali saluran masuk.</dt><dd>1. HGL hulu harus berada di atas elevasi aliran kedalaman normal hulu (dan lebih tinggi dari pipa!).</dd><dd>2. Air hulu gorong-gorong lebih baik diwakili oleh EGL hulu daripada HGL hulu.</dd><dd>3. Lihat <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">tutorial 2 menit saya</a> untuk perhitungan standar sederhana air hulu gorong-gorong menggunakan <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, program gorong-gorong gratis dari Badan Jalan Raya Federal Amerika Serikat (U.S. Federal Highway Administration).</dd><dd>4. Halaman ini hanya menyelesaikan kasus kendali saluran keluar: pipa mengalir penuh, dengan kondisi hilir yang menentukan tinggi tekan. Desain gorong-gorong adalah tugas menentukan apakah kendali saluran masuk atau kendali saluran keluar yang berlaku, jadi gunakan HY-8 kapan pun keduanya mungkin berlaku.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Saluran Trapesium Manning';
$ec_lang['mtc_main_title']='Kalkulator Rumus Manning Saluran Trapesium Gratis Daring';
$ec_lang['mtc_main_desc']='Rumus Manning untuk Aliran Seragam Saluran Trapesium pada Kemiringan dan Kedalaman Tertentu';
$ec_lang['mtc_bottom_width']='Lebar dasar, b';
$ec_lang['mtc_side_slope_1']='Kemiringan tebing 1, z<sub>1</sub> (horiz./vert.)';
$ec_lang['mtc_side_slope_2']='Kemiringan tebing 2, z<sub>2</sub> (horiz./vert.)';
$ec_lang['mtc_channel_slope']='Kemiringan saluran, S';
$ec_lang['mtc_flow_depth']='Kedalaman aliran, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Sudut belokan, β</a><span class="ec-help" title="Untuk ukuran lapisan batu. Ikuti tautan untuk diagram."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Massa jenis relatif terhadap air. Umumnya ≈ 2,65 untuk batu pecah.">Berat jenis batu, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Ukuran batu rencana, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n untuk ukuran batu rencana menurut Strickler';
$ec_lang['mtc_n_blodgett']='n untuk ukuran batu rencana menurut Blodgett';
$ec_lang['mtc_n_bathurst']='n untuk ukuran batu rencana menurut Bathurst';
$ec_lang['mtc_n_pi']='n untuk ukuran batu rencana menurut Phillips & Ingersoll';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett dibanding Bathurst';
$ec_lang['mtc_pi_range_check']='Cek rentang P&I';
$ec_lang['mtc_pi_ok']='d50 dalam rentang P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Di luar rentang';
$ec_lang['mtc_pi_tip']='Ekstrapolasi di luar rentang data 0,28–0,36 ft yang menjadi dasar penyusunan persamaan ini — anggap sebagai pemeriksaan kasar, bukan dasar desain';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Menurut Isbash (1936) dan Maricopa County, Arizona, AS.">Ukuran batu sudut yang dibutuhkan di dasar, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Menurut Isbash (1936) dan Maricopa County, Arizona, AS.">Ukuran batu sudut yang dibutuhkan di tebing 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Menurut Isbash (1936) dan Maricopa County, Arizona, AS.">Ukuran batu sudut yang dibutuhkan di tebing 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Selesaikan jaringan ini pada setiap langkah waktu hidrolik.';
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Menurut Maynord, Ruff, dan Abt (1989). Di tikungan, batu diukur untuk kecepatan tikungan sebesar 4/3 dari rata-rata, menurut California Division of Highways (1970); nilai 1,5 dari Maynord sendiri berlaku untuk saluran alami.">Ukuran batu sudut yang dibutuhkan, D<sub>50</sub> (Maynord, Ruff, dan Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Ukuran batu sudut yang dibutuhkan, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Kecepatan wajar untuk asumsi aliran seragam.';
$ec_lang['mtc_vel_low']='Kecepatan rendah — risiko sedimentasi.';
$ec_lang['mtc_vel_high']='Kecepatan tinggi dan mungkin tidak realistis; periksa erosi lapisan saluran, tambahan kedalaman pada belokan, dan kehilangan energi pada ekspansi atau hambatan.';
$ec_lang['mtc_iteration_tip']='Pilih opsi kekasaran (Blodgett–Bathurst direkomendasikan) dan opsi ukuran batu (Isbash direkomendasikan) untuk melakukan iterasi otomatis menuju ukuran batu seragam sesuai debit target Anda. Lihat Catatan di bawah untuk metode lengkapnya, atau masukkan nilai kekasaran Anda sendiri (ikuti tautan untuk panduan) dan abaikan ukuran batu untuk melewati iterasi.';
$ec_lang['mtc_note_1']='<dl><dt>Iterasi desain otomatis ukuran batu dan kekasaran</dt><dd>Pilih opsi kekasaran (Blodgett–Bathurst direkomendasikan) dan opsi ukuran batu rencana (Isbash direkomendasikan). Sesuaikan kedalaman dan faktor keamanan ukuran batu untuk mencapai debit target Anda dengan ukuran batu yang seragam. Setiap kali Anda mengubah nilai masukan, kalkulator mengulangi langkah-langkah berikut: 1. Kekasaran dihitung dari ukuran batu rencana. 2. Nilai kekasaran dari metode yang Anda pilih disalin ke masukan kekasaran. 3. Debit saluran dan ukuran batu yang diperlukan dihitung. 4. Ukuran batu rencana disesuaikan. 5. Ulangi hingga galat pada ukuran batu rencana sangat kecil.</dd><dt>Kalkulator dasar (tanpa iterasi)</dt><dd>Masukkan nilai kekasaran yang Anda inginkan. Abaikan area masukan ukuran batu rencana.</dd></dl>';
$ec_lang['mtc_note_2_term']='Pemeriksaan kecepatan';
$ec_lang['mtc_note_2_def']='Kecepatan tinggi mengimplikasikan energi spesifik tinggi dari beda tinggi yang tersedia. Energi tersebut dapat hilang dengan cepat pada ekspansi, belokan, atau hambatan. Verifikasi bahwa ini wajar untuk kondisi lapangan.';
$ec_lang['mtc_solver_no_solution']='Tidak ditemukan solusi untuk Q yang diberikan dengan input saluran ini.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Aliran Bendung Ukur Sederhana';
$ec_lang['ws_main_title']='Kalkulator Aliran Bendung Ukur Bermercu Lebar Sederhana Gratis Daring';
$ec_lang['ws_main_desc']='Kalkulator Aliran Bendung Ukur Bermercu Lebar Sederhana';
$ec_lang['ws_weirLength']='Panjang bendung ukur, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Energi per satuan berat air — tinggi kolom air, bukan tekanan">Tinggi tekan, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Koefisien bendung ukur, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Catatan';
$ec_lang['ws_notes_we_term']='Persamaan Bendung Ukur';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Aliran Bendung Ukur Tidak Beraturan';
$ec_lang['wi_main_title']='Kalkulator Aliran Bendung Ukur Tidak Beraturan, Bersegmen, dan Kedalaman Bervariasi, Gratis Daring';
$ec_lang['wi_main_desc']='Kalkulator Aliran Bendung Ukur Tidak Beraturan';
$ec_lang['wi_weirPoints']='Titik bendung ukur';
$ec_lang['wi_pondingHeight']='Tinggi Genangan';
$ec_lang['wi_incrementalFlow']='Debit Tambahan';
$ec_lang['wi_cumulativeFlow']='Debit Kumulatif';
$ec_lang['wi_notes_we_def']='q = jika (panjang = 0) maka 0, selainnya jika (kemiringan=0) maka cw*panjang*d<sub>0</sub><sup>1.5</sup>, selainnya cw/(2.5*kemiringan) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) dengan d<sub>1</sub> dan d<sub>0</sub> selalu positif atau nol';
// Orifice Flow
$ec_lang['or_main_menu']='Debit Lubang Aliran';
$ec_lang['or_main_title']='Kalkulator Debit Lubang Aliran Gratis Daring';
$ec_lang['or_main_desc']='Debit Lubang Aliran — Bebas atau Tenggelam';
$ec_lang['or_shape_circular']='Lingkaran';
$ec_lang['or_shape_rectangular']='Persegi panjang';
$ec_lang['or_diameter']='<span class="ec-help" title="Diameter untuk bentuk lingkaran; tinggi untuk bentuk persegi panjang">Diameter atau tinggi, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Hanya untuk bukaan persegi panjang">Lebar, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Bagian bawah bukaan">Elevasi dasar <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Elevasi muka air hulu';
$ec_lang['or_twe']='Elevasi muka air hilir';
$ec_lang['or_cd']='Koefisien debit, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Elevasi sentroid';
$ec_lang['or_head']='<span class="ec-help" title="Energi per satuan berat air — tinggi kolom air, bukan tekanan">Tinggi tekan efektif, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Luas bukaan, A';
$ec_lang['or_regime']='Pemeriksaan rezim lubang aliran';
$ec_lang['or_regime_valid']='Aliran bebas';
$ec_lang['or_regime_submerged']='Lubang aliran tenggelam';
$ec_lang['or_regime_submerged_tip']='TWE di atas sentroid — masih dalam rezim lubang aliran';
$ec_lang['or_regime_warn']='Di luar rezim lubang aliran';
$ec_lang['or_regime_warn_tip']='Air hulu di bawah mahkota';
$ec_lang['or_regime_twe_above_hwe']='Periksa masukan';
$ec_lang['or_regime_twe_above_hwe_tip']='Air hilir (TWE) di atas air hulu (HWE)';
$ec_lang['or_notes_1_term']='Persamaan Lubang Aliran';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Untuk aliran bebas: h = HWE − sentroid. Untuk aliran tenggelam (TWE di atas dasar): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Rezim Lubang Aliran';
$ec_lang['or_notes_2_def']='Persamaan debit lubang aliran berlaku ketika permukaan air hulu berada di atas mahkota (bagian atas) bukaan. Ketika air hulu berada di bawah mahkota, gunakan persamaan bendung ukur.';
$ec_lang['or_notes_3_term']='Koefisien Debit';
$ec_lang['or_notes_3_def']='C<sub>d</sub> berkisar sekitar 0,60–0,65 untuk lubang aliran bersudut tajam. Saluran masuk berbentuk bulat atau re-entrant menggunakan nilai yang berbeda. Lihat <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> atau HEC-RAS Hydraulic Reference Manual untuk panduan.';
$ec_lang['or_notes_4_term']='Ketenggelaman';
$ec_lang['or_notes_4_def']='Ketika TWE berada di atas dasar bukaan, kalkulator ini secara otomatis menerapkan persamaan lubang aliran tenggelam menggunakan h = HWE − TWE. Ketika TWE sama dengan atau di bawah dasar, aliran bebas diasumsikan dan h = HWE − sentroid.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Tenaga Mikro-Hidro';
$ec_lang['mhp_main_title']='Kalkulator Tenaga Mikro-Hidro Online Gratis';
$ec_lang['mhp_main_desc']='Kalkulator Daya Keluaran Mikro-Hidro Aliran Langsung (Tanpa Bendungan)';
$ec_lang['mhp_gross_head']='Tinggi jatuh bruto, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Diameter pipa tekanan (pipa suplai)">Diameter pipa tekanan, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Panjang, L';
$ec_lang['mhp_efficiency']='Efisiensi instalasi, η (0–1)';
$ec_lang['mhp_vel_check']='Pemeriksaan kecepatan';
$ec_lang['mhp_hl_check']='Pemeriksaan kehilangan tinggi tekan';
$ec_lang['mhp_hnet']='Tinggi jatuh neto, H<sub>net</sub>';
$ec_lang['mhp_power']='Daya keluaran, P';
$ec_lang['mhp_annual_kwh']='P sebagai energi tahunan';
$ec_lang['mhp_vel_low']='Kecepatan rendah — risiko sedimentasi dan masuknya udara.';
$ec_lang['mhp_vel_high']='Kecepatan tinggi — periksa kehilangan transisi, energi yang tersedia, dan risiko pukulan air.';
$ec_lang['mhp_vel_ok_short']='OK';
$ec_lang['mhp_vel_high_short']='Tinggi';
$ec_lang['mhp_vel_low_short']='Rendah';
$ec_lang['mhp_vel_ok_tip']='Kecepatan berada dalam rentang efisien untuk desain pipa tekanan.';
$ec_lang['mhp_hl_ok_tip']='Kehilangan tinggi tekan kurang dari 10% dari tinggi jatuh bruto. Ukuran pipa ini ekonomis.';
$ec_lang['mhp_hl_warn_tip']='Kehilangan tinggi tekan lebih dari 10% dari tinggi jatuh bruto. Pertimbangkan pipa yang lebih besar.';
$ec_lang['mhp_hl_bad_tip']='Kehilangan tinggi tekan lebih dari 20% dari tinggi jatuh bruto. Ubah ukuran pipa.';
$ec_lang['mhp_notes_1_term']='Kehilangan Tinggi Tekan';
$ec_lang['mhp_notes_1_def']='Total kehilangan tinggi tekan pada pipa tekanan, h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, di mana h<sub>f</sub> = f(L/D)(v²/2g) adalah kehilangan gesekan Darcy-Weisbach dan h<sub>m</sub> = k<sub>m</sub>·v²/2g mencakup inlet, belokan, dan katup. Tinggi jatuh neto H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Kecepatan';
$ec_lang['mhp_notes_2_def']='Pastikan kecepatan wajar untuk tinggi jatuh yang tersedia dan biaya pipa. Kecepatan yang sangat rendah dapat mengindikasikan pipa terlalu besar; kecepatan yang sangat tinggi dapat meningkatkan kehilangan gesekan dan risiko pukulan air.';
$ec_lang['mhp_notes_3_term']='Target Kehilangan Tinggi Tekan';
$ec_lang['mhp_notes_3_def']='Kehilangan pada pipa tekanan di bawah 10% dari tinggi jatuh bruto umumnya ekonomis. Titik penyeimbang optimal antara biaya pipa dan daya yang hilang sering kali berada di sekitar 4–6% ketika harga listrik berada di ujung tinggi.';
$ec_lang['mhp_notes_6_term']='Efisiensi';
$ec_lang['mhp_notes_6_def']='Efisiensi instalasi tipikal η berkisar antara 0,70 hingga 0,85 untuk turbin Pelton dan turbin aliran silang yang umum digunakan dalam mikro-hidro. Gunakan 0,75 sebagai estimasi awal yang konservatif.';
$ec_lang['mhp_notes_7_term']='Energi Tahunan';
$ec_lang['mhp_notes_7_def']='Energi tahunan mengasumsikan operasi aliran penuh berkelanjutan (8.760 jam/tahun). Produksi aktual akan lebih rendah akibat variasi debit musiman, waktu henti pemeliharaan, dan faktor beban.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Waktu Pengosongan Kolam & Tangki';
$ec_lang['odt_main_title']='Kalkulator Waktu Pengosongan Kolam, Cekungan, dan Tangki Gratis Daring (Lubang Aliran)';
$ec_lang['odt_main_desc']='Waktu Pengosongan Kolam, Cekungan, atau Tangki — Keluaran Lubang Aliran, Metode Volume Konik';
$ec_lang['odt_h1_elev']='Elevasi permukaan air awal';
$ec_lang['odt_a1']='Luas awal, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Elevasi permukaan air akhir';
$ec_lang['odt_a0']='Luas pada elevasi lubang aliran, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Diinterpolasi dari model konik pada elevasi akhir">Luas akhir, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Pemeriksaan elevasi akhir';
$ec_lang['odt_h2_ok']='Elevasi akhir di atas mahkota lubang aliran';
$ec_lang['odt_h2_warn']='Elevasi akhir sama dengan atau di bawah mahkota lubang aliran';
$ec_lang['odt_h2_warn_tip']='Mahkota lubang aliran = sentroid + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Diameter (bentuk lingkaran) atau tinggi (bentuk persegi panjang)">D lubang aliran <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Hanya bentuk persegi panjang">Lebar lubang aliran, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Waktu pengosongan (detik)';
$ec_lang['odt_t_min']='Waktu pengosongan (menit)';
$ec_lang['odt_t_hr']='Waktu pengosongan (jam)';
$ec_lang['odt_t_day']='Waktu pengosongan (hari)';
$ec_lang['odt_notes_1_term']='Rumus';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) memberikan waktu pengosongan dari tinggi tekan H ke lubang aliran. Waktu pengosongan = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), dengan H<sub>1</sub> = elevasi awal − elevasi lubang aliran, H<sub>2</sub> = elevasi akhir − elevasi lubang aliran.';
$ec_lang['odt_notes_2_term']='Metode';
$ec_lang['odt_notes_2_def']='Metode volume konik memodelkan kolam atau cekungan sebagai penampang konik antara luas awal A<sub>1</sub> pada permukaan air awal dan luas A<sub>0</sub> pada elevasi sentroid lubang aliran. A<sub>2</sub>, luas kolam pada elevasi akhir, diinterpolasi dari A<sub>1</sub> dan A<sub>0</sub> menggunakan model penampang konik. Waktu pengosongan dari elevasi awal ke elevasi akhir sama dengan waktu pengosongan total dari H<sub>1</sub> ke lubang aliran dikurangi sisa waktu pengosongan dari H<sub>2</sub> ke lubang aliran.';
$ec_lang['odt_h1']='<span class="ec-help" title="Elevasi permukaan air awal dikurangi elevasi sentroid lubang aliran">Tinggi tekan awal, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Debit maksimum, Q<sub>max</sub>';
$ec_lang['odt_vol']='Volume yang dikosongkan';
$ec_lang['odt_sketch_start']='Mulai';
$ec_lang['odt_sketch_end']='Akhir';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Jarak emiter, S<sub>e</sub>';
$ec_lang['ip_sl']='Jarak lateral, S<sub>l</sub>';
$ec_lang['ip_n_e']='Emiter per lateral, n<sub>e</sub>';
$ec_lang['ip_n_l']='Lateral per zona, n<sub>l</sub>';
$ec_lang['ip_d']='Kedalaman aplikasi target, d';
$ec_lang['ip_a_e']='Luas per emiter, A<sub>e</sub>';
$ec_lang['ip_pr']='Laju pemberian air, PR';
$ec_lang['ip_q_lat']='Debit per lateral, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Debit zona, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Waktu operasi (jam)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Rembesan Saluran';
$ec_lang['cs_main_title']='Kalkulator Kehilangan Rembesan Saluran dan Efisiensi Saluran Gratis Daring';
$ec_lang['cs_main_desc']='Kehilangan Rembesan Saluran & Efisiensi Saluran — Metode Debit Masuk-Keluar';
$ec_lang['cs_Q_in']='Debit masuk, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Debit keluar, Q<sub>out</sub>';
$ec_lang['cs_L']='Panjang segmen, L';
$ec_lang['cs_Q_loss']='Laju kehilangan rembesan, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Pemeriksaan pengukuran';
$ec_lang['cs_pct_loss']='Fraksi hilang';
$ec_lang['cs_Ec']='Efisiensi saluran, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Peringkat efisiensi';
$ec_lang['cs_Vol_day']='Volume harian yang hilang';
$ec_lang['cs_Vol_year']='Volume tahunan yang hilang';
$ec_lang['cs_Q_loss_per_L']='Kehilangan per satuan panjang, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Nilai air';
$ec_lang['cs_lining_cost']='Biaya pelapisan';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Sasaran efisiensi saluran setelah pelapisan; fraksi 0–1">Target pelapisan, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Luas pelapisan, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Nilai tahunan yang hilang';
$ec_lang['cs_annual_value_recovered']='Nilai tahunan yang dipulihkan';
$ec_lang['cs_lining_total_cost']='Biaya pelapisan total';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Pengembalian sederhana = total biaya pelapisan ÷ nilai tahunan yang dipulihkan">Periode pengembalian <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — rembesan terdeteksi';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — tidak ada kehilangan terukur';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — periksa pengukuran';
$ec_lang['cs_Ec_good']='Baik — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Sedang — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Buruk — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='Metode debit masuk-keluar memperkirakan rembesan dengan mengukur debit di ujung hulu dan hilir segmen saluran: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Efisiensi saluran E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Volume tahunan mengasumsikan operasi debit penuh terus-menerus; kehilangan aktual lebih rendah untuk saluran musiman atau aliran sebagian.';
$ec_lang['cs_notes_2_term']='Peringkat Efisiensi';
$ec_lang['cs_notes_2_def']='Saluran tanah tidak dilapisi yang umum: E<sub>c</sub> = 60–80%. Saluran tanah terawat baik: 75–85%. Saluran berlapis beton: 90–98%. Kehilangan rembesan di atas 30% debit masuk sering kali membenarkan investasi pelapisan saluran. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Pengembalian Pelapisan';
$ec_lang['cs_notes_3_def']='Masukkan nilai air dan biaya pelapisan dalam mata uang apa pun yang konsisten. Luas pelapisan = panjang segmen × keliling basah — keliling basah penampang saluran pada kedalaman debit terukur (lebar dasar ditambah kedua sisi tebing basah). Nilai tahunan yang dipulihkan mengasumsikan saluran yang dilapisi mencapai E<sub>c</sub> target secara berkelanjutan. Pengembalian aktual akan lebih lama untuk saluran musiman atau jika pelapisan tidak mencapai efisiensi target.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, edisi ke-3 (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='Tentang';
$ec_lang['install_main_menu']='Instal';
$ec_lang['install_main_title']='Instal EngCalcs';
$ec_lang['install_main_desc']='Tambahkan ke perangkat Anda untuk penggunaan offline';
$ec_lang['install_intro']='EngCalcs adalah Progressive Web App (PWA). Setelah dipasang, semua kalkulator berfungsi sepenuhnya secara offline — tidak perlu koneksi internet.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Buka halaman kalkulator mana pun di Chrome.</li><li>Ketuk tombol <strong>⬇ Pasang</strong> pada bilah navigasi atas, atau ketuk menu browser (⋮) dan pilih <strong>Tambahkan ke Layar Utama</strong>.</li><li>Ketuk <strong>Pasang</strong> pada permintaan yang muncul.</li><li>EngCalcs akan muncul di layar utama Anda dan dapat digunakan secara offline.</li>';
$ec_lang['install_now_btn']='⬇ Pasang Sekarang';
$ec_lang['install_prompt_unavailable']='Permintaan pemasangan tidak tersedia — gunakan menu browser Anda sebagai gantinya.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Buka halaman kalkulator mana pun di Safari.</li><li>Ketuk tombol <strong>Bagikan</strong> (kotak dengan panah mengarah ke atas).</li><li>Gulir ke bawah dan ketuk <strong>Tambahkan ke Layar Utama</strong>.</li><li>Ketuk <strong>Tambahkan</strong>. EngCalcs akan muncul di layar utama Anda.</li>';
$ec_lang['install_ios_note']='Di iOS, pemasangan selalu dilakukan melalui menu Bagikan — tidak ada permintaan pemasangan otomatis.';
$ec_lang['install_desktop_heading']='Desktop (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Buka halaman kalkulator mana pun.</li><li>Klik <strong>ikon pasang</strong> (⊕ atau ikon komputer) pada bilah alamat browser, atau buka menu browser dan pilih <strong>Pasang EngCalcs…</strong></li><li>Klik <strong>Pasang</strong>. EngCalcs akan terbuka sebagai jendela aplikasi mandiri.</li>';
$ec_lang['install_firefox_heading']='Firefox / Browser Lain';
$ec_lang['install_firefox_body']='Jika peramban Anda tidak menawarkan pilihan pemasangan, tidak ada yang hilang: gunakan kalkulator secara normal di peramban, dan setelah kunjungan pertama, halaman akan otomatis disimpan dalam cache untuk penggunaan luring. Firefox di desktop adalah kasus yang umum.';
$ec_lang['install_cached_heading']='Apa Saja yang Disimpan dalam Cache';
$ec_lang['install_cached_body']='Saat pertama kali memasang EngCalcs, semua halaman kalkulator beserta file pendukungnya (skrip, gaya) akan otomatis tersimpan di perangkat Anda. Setelah itu, semuanya dapat berfungsi tanpa koneksi internet. Pilihan bahasa Anda akan diingat dari kunjungan online terakhir.';
$ec_lang['contact_main_menu']='Kontak';
$ec_lang['about_main_title']='Tentang Kalkulator Teknik HawsEDC';
$ec_lang['about_main_desc']='Misi, Perangkat Lunak Bebas, dan Kontribusi';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Misi</h3><p>Kalkulator Teknik HawsEDC telah ditawarkan secara gratis secara daring sejak 2010. Kalkulator ini hadir untuk melayani insinyur dan pekerja lapangan di seluruh dunia — terutama mereka yang bekerja di wilayah dengan keterbatasan air, sumber daya terbatas, atau kurang terlayani. Alat-alat ini merupakan bagian dari misi kemanusiaan yang lebih luas: menyampaikan kepada setiap manusia dengan cara yang paling praktis dan efektif <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">bahwa mereka dicintai dan disayangi selamanya, bahwa mereka tidak perlu takut, dan bahwa mereka tidak akan merusak segalanya</a>.</p><p>Kalkulator adalah kendaraannya. Tujuannya adalah dunia yang bebas dari penderitaan.</p><h3>Lisensi Perangkat Lunak Bebas dan Sumber Terbuka</h3><p>Semua kode dirilis di bawah <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 atau lebih baru</a> — bebas dalam arti kebebasan. Anda boleh menggunakan, mempelajari, memodifikasi, dan mendistribusikan ulang kode dengan syarat yang sama.</p><p>Situs web yang melayaninya ditawarkan secara gratis hari ini dan sejak 2010; jika suatu hari tidak bisa lagi, perangkat lunaknya tetap milik Anda untuk dijalankan.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Kode Sumber</h3><p>Kode sumber lengkap tersedia secara publik di GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Anda dapat menjelajahi kode, mengajukan isu, atau mem-fork repositori di sana.</p><h3>Berkontribusi</h3><p>Semua bantuan diterima dengan senang hati. <a href="contact.php">Hubungi Tom Haws</a>.</p><ul><li><strong>Terjemahan:</strong> Sarankan kata-kata yang lebih baik. Perbaiki atau tambahkan bahasa.</li><li><strong>Laporan bug:</strong> Gunakan formulir umpan balik di halaman kalkulator mana pun, atau ajukan isu di GitHub.</li><li><strong>Kalkulator baru:</strong> Ide untuk alat teknik hidrolik yang melayani pekerja lapangan dan praktisi irigasi sangat disambut.</li><li><strong>Hosting:</strong> Jika Anda dapat mencerminkan kalkulator ini untuk wilayah dengan konektivitas terbatas, silakan hubungi saya.</li></ul><h3>Penggunaan Offline</h3><p>Buka satu kalkulator saja saat Anda terhubung ke internet, dan semuanya tetap berfungsi saat Anda tidak terhubung: peramban Anda menyimpan seluruh rangkaian kalkulator seiring Anda menggunakannya. Mekanismenya adalah <strong>Aplikasi Web Progresif (PWA)</strong>, jika Anda ingin membacanya. Setelah itu, semua kalkulator berfungsi secara offline — tidak perlu internet.</p><p>Di Android atau iOS, gunakan opsi "Tambahkan ke Layar Utama" di browser Anda untuk memasang EngCalcs sebagai aplikasi di perangkat Anda. Di desktop, cari ikon pasang di bilah alamat browser Anda.</p><p>Anda juga dapat menyimpan kalkulator individual menggunakan menu "Simpan sebagai…" di browser Anda untuk penggunaan offline sekali pakai.</p><h3>Kontak</h3><p>Tom Haws, insinyur hidrolik dan pendiri kalkulator-kalkulator ini.<br />Gunakan formulir umpan balik di halaman kalkulator mana pun, atau akses kode sumber di <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Kirim pesan ke Tom Haws';
$ec_lang['contactYourName']='Nama Anda:';
$ec_lang['contactYourEmail']='Alamat e-mail Anda:';
$ec_lang['contactSubject']='Subjek:';
$ec_lang['contact_message']='Pesan:';
$ec_lang['contactSpamPrefix']='Lima ditambah satu sama dengan';
$ec_lang['contactSpamPostfix']='(Tulis dalam bahasa Inggris. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Kirim Pesan';
$ec_lang['contact_success']='Terima kasih telah meluangkan waktu untuk menulis.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Desain Saluran Curam Berbatu (Robinson)';
$ec_lang['rc_main_title']='Kalkulator Desain Saluran Curam Berbatu Gratis Online — Robinson (1998)';
$ec_lang['rc_main_desc']='Penentuan Ukuran Lapisan Batu untuk Saluran Curam — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Kemiringan dasar saluran curam, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Debit per satuan lebar di inlet saluran curam berbatu. Untuk saluran dengan lebar dasar B dan debit total Q, gunakan q_t = Q / B.">Debit satuan total, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Porositas lapisan batu, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Massa jenis relatif terhadap air. Granit atau basal pecah biasa ≈ 2,65. Rentang valid Robinson: 2,54 hingga 2,82.">Berat jenis batu, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Simpangan baku gradasi. Batu seragam ≈ 1.25. Rentang valid Robinson: 1.15 hingga 1.47.">Gradasi SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Genangan (Hp > yn) baik — mengurangi erosi di hulu. (USDA)">Kedalaman normal di saluran inlet, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Pers. 1 (S0 < 0.10) atau Pers. 2 (0.10-0.40). Valid: D50 15-278 mm, S0 0.02-0.40. Di luar rentang: diekstrapolasi.">Ukuran median batu yang diperlukan, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Persamaan yang diterapkan';
$ec_lang['rc_sg_check']='Pemeriksaan berat jenis';
$ec_lang['rc_SD_check']='Pemeriksaan gradasi SD';
$ec_lang['rc_sg_ok']='sg dalam rentang valid';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']='sg di bawah rentang Robinson';
$ec_lang['rc_sg_low_tip']='Rentang valid: 2.54–2.82';
$ec_lang['rc_sg_high']='sg di atas rentang Robinson';
$ec_lang['rc_sg_high_tip']='Rentang valid: 2.54–2.82';
$ec_lang['rc_SD_ok']='SD dalam rentang valid';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']='SD di bawah rentang Robinson';
$ec_lang['rc_SD_low_tip']='Rentang valid: 1.15–1.47';
$ec_lang['rc_SD_high']='SD di atas rentang Robinson';
$ec_lang['rc_SD_high_tip']='Rentang valid: 1.15–1.47';
$ec_lang['rc_layer']='Ketebalan lapisan batu (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Jari-jari kurva mercu atas (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Panjang busur kurva mercu atas';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Diperlukan untuk dukungan struktural lapisan batu saluran curam. “Tailwater minimum yang terjadi akibat saluran outlet dan resistansi saluran hilir cukup untuk memastikan stabilitas lapisan batu pada saluran outlet.” (Robinson)">Panjang lantai hilir outlet (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Kekasaran Manning di saluran curam, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Fraksi q_t yang mengalir melalui pori batu. Sisanya q_s mengalir di atas permukaan. Porositas default n_p = 0.45 untuk batu pecah bersudut.">Kecepatan melalui mantel batu, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Debit satuan melalui mantel, q<sub>m</sub>';
$ec_lang['rc_qs']='Debit satuan permukaan, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Kedalaman aliran di atas permukaan lapisan batu, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Genangan (Hp > yn) baik — mengurangi erosi di hulu. (USDA)">Tinggi muka air mercu inlet, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Pemeriksaan genangan di inlet';
$ec_lang['rc_pond_ok']='H<sub>p</sub> > y<sub>n</sub> — genangan di hulu';
$ec_lang['rc_pond_ok_tip']='Genangan di hulu inlet saluran curam baik; hal ini mengurangi erosi di hulu. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — tidak ada genangan — potensi erosi di inlet';
$ec_lang['rc_pond_warn_tip']='Tidak ada genangan di hulu inlet saluran curam; erosi dapat terjadi di hulu. (USDA)';
$ec_lang['rc_eq1']='Pers. 1 (S<sub>0</sub> < 0.10) — kemiringan landai';
$ec_lang['rc_eq2']='Pers. 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — kemiringan curam';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — di bawah rentang validasi Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — di atas rentang validasi Robinson';
$ec_lang['rc_notes_1_term']='Persamaan Penentuan Ukuran Batu';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) mengembangkan dua persamaan empiris untuk ukuran median lapisan batu D<sub>50</sub> berdasarkan kemiringan saluran dan debit satuan. Persamaan 1 berlaku untuk kemiringan landai (S<sub>0</sub> < 0.10); Persamaan 2 berlaku untuk kemiringan curam (0.10 ≤ S<sub>0</sub> ≤ 0.40). Kedua persamaan memerlukan q<sub>t</sub> dalam m²/s dan menghasilkan D<sub>50</sub> dalam mm. Rentang yang divalidasi adalah 0.02 ≤ S<sub>0</sub> ≤ 0.40.';
$ec_lang['rc_notes_2_term']='Debit Satuan';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> adalah debit satuan total di mercu saluran curam (total debit per satuan lebar). Untuk saluran dengan lebar dasar B yang membawa debit total Q, perkirakan q<sub>t</sub> ≈ Q / B, atau hitung dari kondisi kedalaman kritis di inlet saluran curam.';
$ec_lang['rc_notes_3_term']='Aliran Melalui Mantel Batu';
$ec_lang['rc_notes_3_def']='Sebagian dari total debit bergerak melalui pori-pori lapisan batu (debit mantel q<sub>m</sub>); sisanya mengalir di atas permukaan batu (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). Kedalaman aliran d dihitung dari persamaan Manning yang diterapkan pada debit permukaan q<sub>s</sub> menggunakan kekasaran saluran curam n. Porositas default n<sub>p</sub> = 0.45 adalah tipikal untuk batu pecah bersudut.';
$ec_lang['rc_notes_5_term']='Rentang Ukuran Batu yang Valid';
$ec_lang['rc_notes_5_def']='Persamaan dikembangkan menggunakan rentang D<sub>50</sub> dari 15 mm hingga 278 mm. Hasil di luar rentang ini diekstrapolasi dan harus digunakan dengan pertimbangan teknis tambahan.';
$ec_lang['rc_notes_6_term']='Elevasi Lantai Hilir Outlet';
$ec_lang['rc_notes_6_def']='Elevasi bagian atas lapisan batu di saluran outlet harus berada pada atau di bawah elevasi dasar saluran hilir. Jika lebih tinggi, batu outlet akan tidak stabil.';

$ec_lang['rc_notes_7_def']='Ketika kedalaman normal di saluran inlet lebih kecil dari tinggi muka air mercu (H<sub>p</sub>) yang diperlukan untuk mengalirkan q<sub>t</sub>, terjadi aliran terbatas atau genangan di hulu inlet. Hal ini umumnya dapat diterima — genangan mengurangi kecepatan dan mencegah erosi di hulu. Untuk memeriksa: gunakan kalkulator aliran mercu untuk mencari H<sub>p</sub> bagi q<sub>t</sub> dan lebar mercu yang diberikan, lalu bandingkan dengan kedalaman normal saluran inlet. Jika H<sub>p</sub> melebihi kedalaman normal, genangan akan terjadi.';
$ec_lang['rc_notes_4_term']='Referensi';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS juga menerbitkan <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">lembar kerja Excel</a> berdasarkan metode yang sama.';
// Sketch labels
$ec_lang['rc_sketch_filter']='Filter';
$ec_lang['rc_sketch_top_crest_curve']='Kurva Mercu Atas';
$ec_lang['rc_sketch_outlet_apron']='Lantai Hilir';
$ec_lang['rc_sketch_radius']='jari-jari';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Tekanan Irigasi';
$ec_lang['ip_main_title']='Kalkulator Tekanan Irigasi & Keseragaman Distribusi Gratis Daring';
$ec_lang['ip_main_desc']='Tekanan Cabang Pengujian dan Estimasi Keseragaman';
$ec_lang['ip_h_supply']='Tekanan pasokan';
$ec_lang['ip_elev_supply']='Elevasi pasokan, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Debit desain emiter, q<sub>design</sub>';
$ec_lang['ip_h_design']='Tekanan desain emiter';
$ec_lang['ip_x']='<span class="ec-help" title="0.5 untuk emiter non-kompensasi standar; mendekati 0 untuk emiter kompensasi tekanan">Eksponen debit emiter, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Jalur pengujian';
$ec_lang['ip_group_reach']='Segmen';
$ec_lang['ip_group_upstream']='Hulu';
$ec_lang['ip_group_downstream']='Hilir';
$ec_lang['ip_group_loss']='Kehilangan';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Dicentang: segmen ini adalah bagian dari lateral pengujian tempat emiter-emiter individual mengambil air. Tidak dicentang: segmen ini adalah pipa utama, hanya mengalirkan debit ke lateral yang tidak berada pada jalur pengujian.">Lat. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Baris lateral: emiter pada segmen ini saja. Baris pipa utama: total emiter pada lateral SELAIN lateral ini yang bercabang dari segmen ini. Untuk segmen pipa utama yang berakhir pada lateral pengujian, ini juga mencakup lateral mana pun yang lebih jauh di sepanjang pipa utama melewati titik tersebut, atau yang berbagi persimpangan yang sama (misalnya lateral di sisi berlawanan) — debit lateral tersebut juga bercabang dari segmen yang sama ini.">Emiter <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Elevasi ujung hilir segmen ini. Opsional pada baris tengah (default datar / sama dengan simpul di atasnya jika dikosongkan). Wajib pada baris terakhir: nilai tersebut adalah elevasi emiter terakhir, yang secara langsung menentukan tekanan pasokan yang diperlukan.">Elev. Hilir <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Elevasi emiter terakhir (baris terakhir) dibiarkan kosong dan menggunakan default datar — masukkan nilainya untuk hasil yang akurat';
$ec_lang['ip_press']='Tek.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Total kehilangan segmen, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Tekanan rendah/negatif — periksa kemungkinan kondisi di bawah tekanan atmosfer';
$ec_lang['ip_pressure_warn_short']='Rendah';
$ec_lang['ip_pressure_high']='Lokasi tekanan tinggi memerlukan reduksi tekanan';
$ec_lang['ip_pressure_high_short']='Tinggi';
$ec_lang['ip_max_head']='Tek. kerja maks. pipa';
$ec_lang['ip_max_head_tip']='Jalur yang tekanannya melebihi nilai ini akan ditandai. Biarkan kosong untuk melewati pemeriksaan tekanan tinggi.';
$ec_lang['ip_h_far']='Tekanan emiter terakhir';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Debit yang masuk ke jalur pengujian model ini saja — untuk seluruh zona/sistem, lihat Q_zone pada Desain Aplikasi di bawah.">Debit pasokan jalur pengujian, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Debit emiter terakhir, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Debit emiter rata-rata (lateral pengujian), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="Seberapa jauh lebih tinggi (atau lebih rendah) Anda memperkirakan lateral tipikal beroperasi dibandingkan lateral pengujian ini. Lateral pengujian sengaja dianggap sebagai kasus terburuk, sehingga rata-ratanya sendiri merupakan estimasi yang terlalu rendah untuk rata-rata lapangan — jika dibiarkan pada 0, pemeriksaan keseragaman dan angka desain aplikasi di bawah menggunakan rata-rata lateral pengujian itu sendiri (kemungkinan optimistis) apa adanya.">Est. Δtekanan, rata-rata vs. lateral pengujian <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral dievaluasi ulang pada tekanan setiap baris lateral ditambah selisih tekanan yang dimasukkan di atas — upaya untuk mengoreksi anggapan bahwa lateral pengujian adalah kasus terburuk, bukan kasus yang representatif. Menjadi input bagi pemeriksaan keseragaman dan bagian desain aplikasi di bawah.">Est. debit emiter rata-rata lapangan, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Debit emiter terakhir yang dihitung dibagi dengan estimasi debit emiter rata-rata lapangan — ini adalah pendekatan dari Keseragaman Distribusi kuartal-bawah standar (rata-rata kelompok terendah ÷ rata-rata populasi); ini berasal dari sampel model kecil dan koreksi perkiraan pengguna, bukan sampel statistik lapangan penuh. Nilai pada atau di atas 1 mungkin dan valid: itu hanya berarti tekanan emiter terakhir berada pada atau di atas rata-rata lapangan yang diestimasi, sehingga emiter lain menjadi titik tekanan terendah. Ini bisa terjadi karena emiter terakhir berada di tanah rendah atau karena estimasi Δtekanan terlalu kecil.">Pemeriksaan keseragaman, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Tekanan pada emiter pengujian ≥ tekanan pasokan. Ini mungkin bukan emiter kasus terburuk, atau ukuran pipa bisa diperkecil.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Ini berbeda dari pendekatan kami terhadap ukuran keseragaman standar.">Debit emiter terakhir ÷ debit desain, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Tidak ada solusi: tekanan pasokan yang diperlukan melebihi tekanan pasokan yang dimasukkan. Tingkatkan tekanan pasokan, kurangi permintaan, atau gunakan pipa yang lebih besar.';
$ec_lang['ip_notes_1_def']='Menebak tekanan pada emiter terakhir (paling jauh), lalu menelusuri Garis Energi mundur menuju pasokan, segmen demi segmen, menambahkan kehilangan gesekan dan kehilangan lokal di sepanjang jalan. Elevasi dan tinggi kecepatan dikurangkan pada setiap simpul untuk melaporkan tekanan aktual di sana. Tekanan ujung jauh yang ditebak disesuaikan (biseksi) hingga tekanan pasokan yang diperlukan hasil hitungan cocok dengan tekanan pasokan yang dimasukkan — masalah loop tertutup yang sama yang ditangani oleh pemecah aliran pipa pada kalkulator Aliran Pipa Manning, diperluas ke jaringan bercabang.';
$ec_lang['ip_notes_2_term']='Segmen Pipa Utama vs. Lateral';
$ec_lang['ip_notes_2_def']='Setiap baris adalah satu segmen di sepanjang jalur tunggal yang secara hidraulis paling buruk (jalur pengujian) dari pasokan ke emiter terakhir. Segmen Pipa Utama hanya mengalirkan debit ke lateral yang tidak berada pada jalur pengujian, sehingga pengambilannya adalah perkalian sederhana (debit desain × jumlah total emiter segmen tersebut) — tanpa kepekaan terhadap tekanan lokal. Pipa utama adalah pipa batang bersama, sehingga segmen pipa utama yang berakhir pada lateral pengujian harus mencakup bukan hanya lateral di antara titik-titik ujungnya sendiri, tetapi juga lateral mana pun yang lebih jauh di sepanjang pipa utama melewati titik tersebut, atau yang berbagi persimpangan yang sama (misalnya lateral di sisi berlawanan) — debit lateral-lateral tersebut melewati segmen yang sama sebelum bercabang, baik lateral itu muncul di tempat lain dalam tabel ini maupun tidak. Segmen Lateral adalah segmen dari lateral pengujian itu sendiri: debit emiter dihitung dari tekanan lokal aktual melalui q = k·H<sup>x</sup>, dan kehilangan gesekan dikurangi oleh faktor F(n) Christiansen untuk memperhitungkan debit yang menurun seiring setiap emiter pada segmen tersebut mengambil air.';
$ec_lang['ip_notes_3_term']='Keterbatasan';
$ec_lang['ip_notes_3_def']='Memodelkan satu tekanan pasokan tetap (tanpa kurva pompa), satu jalur pengujian saja (bukan seluruh lapangan), dan kurva emiter 2-parameter (atur eksponen mendekati 0 untuk mendekati emiter kompensasi tekanan). Dua rasio keseragaman yang berbeda dilaporkan, sengaja dipisahkan: q<sub>last</sub>/q<sub>avg,field</sub> adalah pendekatan dari Keseragaman Distribusi kuartal-bawah standar (rata-rata kelompok terendah ÷ rata-rata populasi); tetapi ini berasal dari sampel model kecil dan koreksi perkiraan pengguna, bukan sampel statistik lapangan penuh standar. Selain itu, lateral pengujian sengaja dianggap sebagai kasus terburuk, sehingga rata-ratanya yang mentah dan tidak dikoreksi akan meremehkan rata-rata lapangan yang sebenarnya dan membuat keseragaman terlihat lebih baik daripada kenyataannya; input Δtekanan ada khusus untuk mengatasi bias tersebut. Nilai keseragaman pada atau di atas 1 tetap dimungkinkan: itu hanya berarti tekanan emiter terakhir berada pada atau di atas rata-rata lapangan yang diestimasi, sehingga emiter lain menjadi titik tekanan terendah. Ini bisa terjadi karena emiter terakhir berada di tanah rendah atau karena estimasi Δtekanan terlalu kecil. q<sub>last</sub>/q<sub>design</sub> adalah pemeriksaan non-keseragaman yang berbeda terhadap debit yang dinilai oleh pabrikan — berguna untuk mendeteksi sistem yang secara keseluruhan bertekanan terlalu tinggi atau terlalu rendah, tetapi merupakan pemeriksaan terpisah yang dibaca bersama angka keseragaman, karena debit desain/nilai pabrikan tidak bergantung pada tekanan operasi rata-rata sistem yang sebenarnya.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. Standar ASAE/ASABE untuk desain mikroirigasi menggunakan pendekatan kehilangan gesekan multi-outlet yang sama.';
$ec_lang['ip_notes_5_term']='Desain Aplikasi';
$ec_lang['ip_notes_5_def']='Laju pemberian air dan debit sistem/zona menggunakan estimasi debit emiter rata-rata lapangan (q<sub>avg,field</sub> — rata-rata lateral pengujian itu sendiri, dikoreksi oleh estimasi Δtekanan yang dimasukkan), bukan laju yang ditebak: PR = q<sub>avg,field</sub> / A<sub>e</sub>, dipasok oleh nilai model yang telah dikoreksi. Jarak dan jumlah lateral/emiter seluruh sistem merupakan input terpisah di sini karena jalur pengujian hanya memodelkan satu cabang kasus terburuk, bukan setiap lateral di lapangan.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Jaringan Pipa Bercabang';
$ec_lang['bpn_main_title']='Kalkulator Tekanan Jaringan Pipa Bercabang Online Gratis (Tanpa Loop)';
$ec_lang['bpn_main_desc']='Debit dan Tekanan Jaringan Pipa Bercabang (Pohon)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Tinggi tekan pasokan statis: tinggi tekan sumber pada debit nol. Muka air reservoir atau tangki di atas elevasi pasokan, atau tinggi tekan tertutup (shutoff head) pompa. Tambahkan titik pasokan 2 dan 3 untuk menentukan kurva pompa atau pasokan yang bervariasi; alat ini membaca tinggi tekan pada debit rencana.';
$ec_lang['bpn_elev_source']='Elevasi pasokan';
$ec_lang['bpn_q_total']='Debit total';
$ec_lang['bpn_q_total_tip']='Debit total yang keluar dari sumber (jumlah seluruh kebutuhan dalam jaringan).';
$ec_lang['bpn_p_min']='Tekanan terendah';
$ec_lang['bpn_p_min_tip']='Tekanan hilir terendah di mana pun dalam jaringan; titik penyaluran kritis.';
$ec_lang['bpn_method']='Metode gesekan';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Jalur pipa';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Nama jalur pipa ini. Jalur lain merujuknya pada kolom Hulu.';
$ec_lang['bpn_upstream']='ID Hulu';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID jalur yang memasok jalur ini. Biarkan kosong untuk mengikuti jalur tepat di atasnya (pipa seri biasa). Isi ID di sini untuk bercabang dari jalur lain.';
$ec_lang['bpn_roughness_tip']='Kekasaran pipa untuk metode gesekan yang dipilih: n Manning, C Hazen-Williams, atau tinggi kekasaran e Darcy-Weisbach (suatu panjang). Pipa plastik halus umumnya: n sekitar 0,009, C sekitar 150, e sekitar 0,0015 mm.';
$ec_lang['bpn_demand']='Kebutuhan';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Debit tetap yang disalurkan di ujung hilir jalur ini.';
$ec_lang['bpn_demand_mult']='Faktor pengali kebutuhan';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Mengalikan semua kebutuhan jalur sekaligus, untuk skenario jam puncak atau pertumbuhan di masa depan. Gunakan 1 untuk kebutuhan sesuai yang dimasukkan.';
$ec_lang['bpn_elev_down']='Elev. hilir';
$ec_lang['bpn_q_line']='Debit jalur';
$ec_lang['bpn_q_line_tip']='Debit total yang dialirkan jalur ini: kebutuhannya sendiri ditambah seluruh kebutuhan hilir yang dipasoknya.';
$ec_lang['bpn_p_down']='Tekanan hilir';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Tinggi tekan ukur (gauge) di simpul hilir jalur ini. Nilai negatif (ditandai) berarti tekanan di bawah atmosfer; periksa kembali desainnya.';
$ec_lang['bpn_sketch_heading']='Diagram Jaringan';
$ec_lang['bpn_source_label']='Sumber';
$ec_lang['bpn_line_problem']='Jalur ini tidak terhubung ke sumber: jalur ini menunjuk ke ID hulu yang tidak dikenal, menunjuk dirinya sendiri, mengulang ID yang sudah digunakan jalur lain, atau membentuk loop. Jalur yang tidak terhubung dibiarkan tidak terselesaikan.';
$ec_lang['bpn_bad_id_short']='ID salah';


$ec_lang['bpn_pressure_warn']='Tekanan rendah/negatif; periksa kemungkinan kondisi di bawah tekanan atmosfer';
$ec_lang['bpn_pressure_warn_short']='Rendah';
$ec_lang['bpn_notes_1_term']='Seri secara baku, cabang bila diperlukan';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Biarkan ID Hulu kosong dan jalur akan mengikuti jalur di atasnya; pipa seri biasa. Isi ID jalur hulu untuk bercabang darinya. Jadi: seri secara baku, pohon bila diperlukan.';
$ec_lang['bpn_notes_2_term']='Hanya jaringan bercabang, tanpa loop';
$ec_lang['bpn_notes_2_def']='Setiap jalur hanya memiliki satu jalur hulu (sebuah pohon). Alat ini tidak menyelesaikan jaringan berloop; jaringan seperti itu memerlukan metode iteratif (EPANET atau sejenisnya). Meniadakan loop adalah yang membuat alat ini tetap sederhana dan akurat.';
$ec_lang['bpn_notes_3_term']='Tanpa kendali tekanan aktif';
$ec_lang['bpn_notes_3_def']='Anda dapat menambahkan katup kehilangan lokal tetap (nilai-k), tetapi bukan katup penurun tekanan atau penopang tekanan (PRV/PSV). Status buka/tutup katup tersebut bergantung pada debit dan tekanan, yang akan memaksa perhitungan iteratif.';


$ec_lang['bpn_supply2_q']='Debit pasokan 2';
$ec_lang['bpn_supply2_h']='Tinggi tekan pasokan 2';
$ec_lang['bpn_supply3_q']='Debit pasokan 3';
$ec_lang['bpn_supply3_h']='Tinggi tekan pasokan 3';
$ec_lang['bpn_supply_pt_tip']='Titik kurva pasokan opsional 2 dan 3. Isi debit dan tinggi tekan untuk masing-masing guna memodelkan pompa, atau sumber mana pun yang tinggi tekannya menurun seiring bertambahnya debit yang disalurkan; alat ini membaca tinggi tekan pada debit rencana. Titik 1 di atas adalah tinggi tekan statis pada debit nol. Biarkan 2 dan 3 kosong untuk tinggi tekan reservoir yang konstan.';
$ec_lang['bpn_h_supply']='Tinggi tekan pasokan';
$ec_lang['bpn_h_supply_tip']='Tinggi tekan sumber pada debit rencana, dibaca dari kurva pasokan. Sama dengan tinggi tekan sumber yang dimasukkan bila kurvanya datar (reservoir).';
$ec_lang['bpn_supply1_h']='Tinggi tekan pasokan statis';
$ec_lang['lpn_main_menu']='Jaringan Distribusi Air';
$ec_lang['lpn_main_title']='Pemodelan Daring Gratis Jaringan Distribusi Air dengan Penyelesai EPANET';
$ec_lang['lpn_main_desc']='Analisis Jaringan Distribusi Air: Gambar Jaringan Pipa Tertutup atau Impor Berkas EPANET';
$ec_lang['lpn_title_units']='Satuan {units}';
$ec_lang['lpn_tool_select']='Pilih';
$ec_lang['lpn_tool_add_junction']='Simpul';
$ec_lang['lpn_tool_add_reservoir']='Reservoir';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Tangki';
$ec_lang['lpn_tool_add_pipe']='Pipa';
$ec_lang['lpn_tool_add_pump']='Pompa';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Katup';
$ec_lang['lpn_tool_add_text']='Teks';
$ec_lang['lpn_tool_vertices']='Verteks';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Pelanggan';
$ec_lang['lpn_tool_add_meter_tip']='Klik tempat pelanggan berada, lalu klik pipa atau simpul yang melayaninya. Kebutuhan yang Anda berikan kepada pelanggan ditambahkan ke simpul pada ujung terdekat pipa itu.';
$ec_lang['lpn_mode_add_meter']='Pelanggan: klik tempat pelanggan berada, lalu klik pipa atau simpul yang melayaninya. Atau gunakan Esc untuk membatalkan.';
$ec_lang['lpn_pane_tab_customers']='Pelanggan';
$ec_lang['lpn_customer_heading']='Pelanggan {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Kebutuhan per sambungan';
$ec_lang['lpn_field_meter_count']='Jumlah sambungan';
$ec_lang['lpn_field_meter_total']='Total kebutuhan';
$ec_lang['lpn_field_meter_total_tip']='Kebutuhan per sambungan dikalikan jumlah sambungan. Inilah angka yang ditambahkan ke simpul yang disebutkan di bawah ini.';
$ec_lang['lpn_field_meter_pipe']='Elemen terhubung';
$ec_lang['lpn_field_meter_pipe_suggest']='Elemen terdekat adalah {id}. Ketik di sini untuk melayani pelanggan ini darinya.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Terhubung ke';
$ec_lang['lpn_field_meter_node_tip']='Simpul tempat pelanggan ini terhubung. Seret titik sambungan ke sebuah pipa agar pelanggan dilayani dari suatu titik di sepanjang pipa itu.';
$ec_lang['lpn_meter_pipe_unknown']='Tidak ada yang bernama {id} dalam proyek ini, sehingga pelanggan dibiarkan di tempatnya semula.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='Tidak ada pola dalam proyek ini yang bernama {id}, sehingga pelanggan dibiarkan seperti semula.';
$ec_lang['lpn_meter_placed']='Pelanggan {id} ditambahkan. Deskripsi dan kebutuhannya diketik pada tabel Pelanggan, atau tekan pelanggan itu dalam mode Pilih untuk membuka kotaknya.';
$ec_lang['lpn_field_meter_pipe_tip']='Elemen tempat sambungan ini terhubung. Ketik elemen lain di sini atau pada tabel Pelanggan untuk mengubahnya, atau seret titik sambungan ke elemen lain.';
$ec_lang['lpn_field_meter_station']='Titik di sepanjang pipa (%)';
$ec_lang['lpn_field_meter_station_tip']='Seberapa jauh sambungan ini terletak di sepanjang pipa, sebagai persentase pipa dari simpul pertamanya ke simpul keduanya. 0 berada di satu ujung dan 100 di ujung lainnya. Lingkaran pada pipa melakukan hal yang sama dengan penunjuk.';
$ec_lang['lpn_field_meter_offset']='Jarak dari pipa';
$ec_lang['lpn_field_meter_offset_tip']='Nilai positif berada di sebelah kanan pipa jika dilihat dari simpul pertamanya menuju simpul keduanya. Mengetik nilai di sini dapat memindahkan pelanggan ke sisi lain pipa utama, dan selalu membuat garis sambungan tegak lurus terhadap pipa utama.';
$ec_lang['lpn_field_meter_lumped']='Ditambahkan ke simpul';
$ec_lang['lpn_field_meter_lumped_tip']='Simpul terdekat; kebutuhan pelanggan ini ditambahkan di sana.';
$ec_lang['lpn_node_customers']='Kebutuhan pelanggan';
$ec_lang['lpn_node_customers_tip']='Daftar pelanggan yang ditambahkan pada simpul ini (karena simpul ini yang terdekat). Kebutuhan pelanggan ditambahkan di luar kebutuhan lain yang tercantum di sini. Pelanggan diedit di tempatnya pada peta atau pada tabel Pelanggan.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} dari {n} Pelanggan';
$ec_lang['lpn_customer_detached']='⚠ Pelanggan ini tidak terhubung ke pipa, sehingga kebutuhannya tidak termasuk dalam hasil. Hapus pelanggan ini, atau gambar sebuah pipa dan pindahkan pelanggan ke atasnya.';
$ec_lang['lpn_customer_fixed_head']='⚠ Ujung terdekat pipa itu memiliki muka air tetap, sehingga kebutuhan ini tidak memengaruhi simulasi.';
$ec_lang['lpn_customer_detached_count']='{n} pelanggan tidak terhubung ke pipa. Kebutuhan mereka tidak diperhitungkan.';
$ec_lang['lpn_meter_pick_pipe']='Sekarang klik pipa atau simpul yang melayani pelanggan ini. Pelanggan tetap berada di tempat Anda meletakkannya. Tekan Escape untuk membatalkan.';
$ec_lang['lpn_inp_export_flat_customers']='Berkas EPANET tidak memiliki pelanggan. Kebutuhan dari {n} pelanggan dalam proyek ini masuk ke berkas sebagai baris kebutuhan pada simpul tempat masing-masing ditambahkan, dan setiap baris diberi nama sesuai tag pelanggan itu. Yang tidak dapat disimpan oleh berkas adalah pelanggannya sendiri: di mana letaknya, pipa mana yang melayaninya, di mana sepanjang pipa itu sambungannya berada, dan berapa banyak sambungan yang diwakili satu pelanggan. Berkas proyek Anda sendiri menyimpan semua itu.';

$ec_lang['lpn_area_hint_window_start']='Klik satu sudut jendela.';
$ec_lang['lpn_area_hint_window_go']='Klik sudut yang berlawanan untuk menyelesaikan.';
$ec_lang['lpn_area_hint_lasso_start']='Klik untuk memulai garis luar.';
$ec_lang['lpn_area_hint_lasso_go']='Gerakkan untuk menggambar garis luar. Klik untuk menyelesaikan.';
$ec_lang['lpn_area_hint_polygon_start']='Klik untuk menggambar area poligon. Klik dua kali untuk menyelesaikan.';
$ec_lang['lpn_area_hint_polygon_go']='Klik setiap sudut. Klik dua kali pada sudut terakhir untuk menyelesaikan.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Tahan Shift saat memilih untuk melanjutkan pemilihan yang sudah ada, menambah atau menghapus (mengalihkan) apa yang Anda pilih.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Tekan pada peta dan seret mengelilingi yang Anda inginkan, lalu lepaskan.';
$ec_lang['lpn_area_hint_touch_go']='Seret mengelilingi yang Anda inginkan, lalu lepaskan untuk menyelesaikan.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Tampilkan ini';
$ec_lang['lpn_multi_title']='{n} dipilih';
$ec_lang['lpn_multi_varies']='Beragam';
$ec_lang['lpn_multi_applied']='Menetapkan {prop} pada {n}.';
$ec_lang['lpn_multi_no_fields']='Elemen-elemen ini tidak memiliki apa pun yang dapat ditetapkan bersama di sini.';
$ec_lang['lpn_pane_pasted']='Menempelkan {n} sel. {skipped} tidak diubah.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='{n} baris ditempelkan dan {created} di antaranya ditambahkan ke jaringan.';
$ec_lang['lpn_pane_pasted_rows_skipped']='{n} baris ditempelkan dan {created} di antaranya ditambahkan ke jaringan. {skipped} sel tidak diubah.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Klik di sini lalu tempel baris dari lembar kerja untuk menambahkannya.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Tempel sebagai baris baru di akhir tabel';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Tekan Ctrl+V untuk menambahkan baris yang disalin di bagian bawah tabel ini. Tekan Esc untuk membatalkan.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Tempelan ini memiliki {n} baris, dan {fit} di antaranya muat dalam tabel. Tambahkan {extra} baris sisanya sebagai baris baru di bagian bawah?';
$ec_lang['lpn_pane_paste_overflow_add']='Tambahkan {extra} baris';
$ec_lang['lpn_pane_paste_overflow_fit']='Tempel hanya {fit} yang muat';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Tempelan ini memiliki {n} baris, dan {fit} di antaranya muat dalam tabel. {extra} baris sisanya tidak dapat ditambahkan sebagai baris baru: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} ID tidak cocok. Tetap tempel?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Tidak ada yang ditempelkan. {reasons}';
$ec_lang['lpn_pane_paste_more']='Baris bermasalah yang tidak ditampilkan di sini: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Baris {row}: baris baru memerlukan ID.';
$ec_lang['lpn_pane_paste_bad_id']='Baris {row}: ID {id} mengandung spasi atau tanda kutip.';
$ec_lang['lpn_pane_paste_id_taken']='Baris {row}: ID {id} sudah digunakan.';
$ec_lang['lpn_pane_paste_id_twice']='Baris {row}: ID {id} digunakan dua kali dalam tempelan ini.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Baris {row}: simpul baru memerlukan {first} dan {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Baris {row}: penghubung baru memerlukan simpul Dari dan simpul Ke.';
$ec_lang['lpn_pane_paste_no_node']='Baris {row}: simpul {id} belum ada. Tempel simpul Anda terlebih dahulu, lalu penghubungnya.';
$ec_lang['lpn_pane_paste_same_ends']='Baris {row}: Dari dan Ke adalah simpul yang sama.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Baris {row}: {text} bukan {col} yang valid.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Baris {row}: Teks baru memerlukan {first} dan {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Baris {row}: {id} bukan simpul atau pipa dalam jaringan ini. Tempel itu terlebih dahulu, lalu Teks ini.';
$ec_lang['lpn_pane_paste_customer_no_position']='Baris {row}: Pelanggan baru memerlukan {first} dan {second}.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Baris {row}: Pelanggan baru memerlukan pipa atau simpul yang terhubung.';
$ec_lang['lpn_pane_paste_no_pipe']='Baris {row}: pipa {id} belum ada. Tempel pipa Anda terlebih dahulu, lalu pelanggan Anda.';
$ec_lang['lpn_pane_paste_no_customer_node']='Baris {row}: simpul {id} belum ada. Tempel simpul Anda terlebih dahulu, lalu pelanggan Anda.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Baris {row}: simpul {id} tidak memiliki pipa untuk tempat Pelanggan terhubung.';
$ec_lang['lpn_pane_filled']='Mengisi ke bawah {n} sel. {skipped} tidak diubah.';
$ec_lang['lpn_pane_filldown']='Isi ke bawah';
$ec_lang['lpn_pane_fill_none']='Tidak ada yang dapat diisi ke bawah dalam pilihan ini.';
$ec_lang['lpn_pane_ctrlenter_filled']='Mengisi {n} sel. {skipped} tidak diubah.';
$ec_lang['lpn_pane_hide_col']='Sembunyikan kolom ini';
$ec_lang['lpn_pane_hide_cols']='Sembunyikan kolom-kolom ini';
$ec_lang['lpn_pane_show_all_cols']='Tampilkan semua kolom';
$ec_lang['lpn_pane_sort_asc']='Urutkan menaik';
$ec_lang['lpn_pane_manage_cols']='Kelola kolom…';
$ec_lang['lpn_pane_manage_cols_title']='Kelola kolom';
$ec_lang['lpn_pane_manage_cols_show']='Tampilkan';
$ec_lang['lpn_pane_manage_cols_up']='Pindah ke atas';
$ec_lang['lpn_pane_manage_cols_down']='Pindah ke bawah';
$ec_lang['lpn_pane_manage_cols_top']='Pindah ke awal';
$ec_lang['lpn_pane_manage_cols_bottom']='Pindah ke akhir';
$ec_lang['lpn_pane_colmenu_tip']='Sembunyikan atau kelola kolom';
$ec_lang['lpn_tool_area_window']='Pilih jendela';
$ec_lang['lpn_tool_area_lasso']='Pilih laso';
$ec_lang['lpn_tool_area_polygon']='Pilih poligon';
$ec_lang['lpn_tool_delete']='Hapus';
$ec_lang['lpn_tool_zoom_extent']='Tampilkan Semua';
$ec_lang['lpn_tool_zoom_window']='Perbesar Jendela';
$ec_lang['lpn_zoom_in']='Perbesar';
$ec_lang['lpn_zoom_out']='Perkecil';
$ec_lang['lpn_new_text']='Teks';
$ec_lang['lpn_field_text_bold']='Teks tebal';
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
$ec_lang['lpn_field_text_anchor']='Terlampir pada';

$ec_lang['lpn_field_text_align']='Perataan horizontal';
$ec_lang['lpn_field_text_align_left']='Kiri';
$ec_lang['lpn_field_text_align_center']='Tengah';
$ec_lang['lpn_field_text_align_right']='Kanan';
$ec_lang['lpn_field_text_valign']='Perataan vertikal';
$ec_lang['lpn_field_text_valign_top']='Atas';
$ec_lang['lpn_field_text_valign_middle']='Tengah';
$ec_lang['lpn_field_text_valign_bottom']='Bawah';
$ec_lang['lpn_field_text_rotation']='Sudut (derajat)';
$ec_lang['lpn_field_text_match_pipe']='Putar ke sudut penghubung terdekat';
$ec_lang['lpn_field_text_flip']='Putar 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Elemen yang dilampirkan';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Teks ini ditempatkan cukup dekat dengan sebuah aset sehingga mengikuti aset itu dan memiliki garis penunjuk. Teks pada garis penunjuk mengambil perataan horizontal dan vertikalnya dari sisi tempatnya berada, itulah sebabnya kedua baris tersebut tidak ditawarkan selama teks masih terlampir.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Koefisien emiter';
$ec_lang['lpn_field_emitter_tip']='Aliran keluar tambahan yang bergantung pada tekanan, untuk sprinkler, outlet terbuka, atau kebocoran yang dimodelkan. Aliran yang dikeluarkannya adalah koefisien ini dikalikan tekanan yang dipangkatkan eksponen emiter, yang diatur sekali untuk seluruh jaringan di Pengaturan, Perhitungan, Hidraulika. Biarkan kosong pada simpul biasa.';
$ec_lang['lpn_field_elev']='Elevasi';
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
$ec_lang['lpn_field_head']='Tinggi tekan';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Ketinggian muka air di reservoir, diukur sebagai suatu ketinggian, bukan tekanan. Biarkan kosong agar muka air berada pada elevasi reservoir.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='Elevasi dasar tangki. Kedalaman air di dalam tangki diukur ke atas dari titik ini.';
$ec_lang['lpn_field_tank_level']='Kedalaman air';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Kedalaman air yang tergenang di dalam tangki, diukur ke atas dari dasar tangki. Muka air adalah elevasi dasar tangki ditambah kedalaman ini.';
$ec_lang['lpn_field_tank_minlevel']='Kedalaman air terendah';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Kedalaman air ketika tangki dianggap kosong, diukur ke atas dari dasar tangki.';
$ec_lang['lpn_field_tank_maxlevel']='Kedalaman air tertinggi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Kedalaman air ketika tangki dianggap penuh, diukur ke atas dari dasar tangki.';
$ec_lang['lpn_field_tank_diameter']='Diameter tangki';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Lebar tangki dari sisi ke sisi. Satuannya sama dengan satuan elevasi, bukan satuan diameter pipa. Nilai ini menentukan berapa banyak air yang ditampung pada kedalaman tertentu.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Elevasi muka air di dalam tangki: elevasi dasar tangki ditambah kedalaman air. Inilah tinggi muka air yang digunakan penyelesai untuk tangki ini.';
$ec_lang['lpn_close']='Tutup';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Properti';
$ec_lang['lpn_empty_hint']='Gunakan File, Proyek baru untuk membuka contoh. Atau mulai dengan menambahkan reservoir, simpul, dan pipa dari bilah alat.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Jaringan Anda masih utuh.';
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
$ec_lang['lpn_examples_welcome']='Selamat datang di pemodelan jaringan air bersih, dengan penyelesai EPANET';
$ec_lang['lpn_examples_heading']='Buka contoh';
$ec_lang['lpn_examples_sub']='Setiap contoh terbuka sebagai salinan Anda sendiri. Ubah, simpan, atau buka salinan baru dan mulai lagi.';
$ec_lang['lpn_examples_open']='Buka';
$ec_lang['lpn_examples_menu']='Buka contoh…';
$ec_lang['lpn_examples_blank']='Atau mulai dengan peta kosong';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='Simpul: {nodes}, pipa: {links}';
$ec_lang['lpn_examples_failed']='Contoh tidak dapat dimuat. Gunakan File, Proyek baru untuk memulai gambar.';
$ec_lang['lpn_examples_loading']='Memuat contoh…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Perbaiki sesuatu';
$ec_lang['lpn_help_notes']='Catatan tentang halaman ini';
$ec_lang['lpn_help_hotkeys']='Tabel dan pintasan keyboard';
$ec_lang['lpn_hotkeys_tables_heading']='Tabel';
$ec_lang['lpn_hotkeys_map_heading']='Peta';
$ec_lang['lpn_hotkeys_map_term']='Pintasan keyboard peta';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 atau Esc</td><td>Pilih.</td></tr><tr><td>2</td><td>Tambah simpul.</td></tr><tr><td>3</td><td>Tambah reservoir.</td></tr><tr><td>4</td><td>Tambah tangki.</td></tr><tr><td>5</td><td>Tambah pipa.</td></tr><tr><td>6</td><td>Tambah pompa.</td></tr><tr><td>7</td><td>Tambah katup.</td></tr><tr><td>8</td><td>Tambah pelanggan.</td></tr><tr><td>9</td><td>Tambah teks.</td></tr><tr><td>Delete</td><td>Hapus pilihan.</td></tr><tr><td>Ctrl+Z</td><td>Urungkan perubahan terakhir.</td></tr><tr><td>+ atau =</td><td>Perbesar.</td></tr><tr><td>-</td><td>Perkecil.</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Ada yang salah di sini?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Satu kali tekan memberi tahu kami bahwa ada yang salah di halaman ini. Ini mengirimkan nama halaman ini, bahasa yang Anda gunakan untuk membacanya, dan pesan di peta jika ada. Ini tidak mengirimkan apa pun yang Anda ketik, tidak ada alamat, dan tidak ada apa pun dari gambar Anda. Tidak ada yang bisa membalas, karena ini tidak memberi tahu kami apa pun tentang siapa Anda. Gunakan Bantuan, Perbaiki sesuatu jika Anda ingin mengatakan lebih banyak.';
$ec_lang['lpn_wrong_thanks']='Terima kasih. Pesan itu telah sampai kepada kami.';
$ec_lang['lpn_status_example_opened']='{name} telah dibuka. Ini adalah salinan Anda: simpan dengan File, Simpan sebagai.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Halaman ini tidak dapat menghitung ukuran area gambar, sehingga peta menampilkan tampilan terakhir yang berhasil dihitung. Mengubah ukuran jendela akan membuatnya mencoba lagi. Jika ini terus terjadi, penyebab yang biasa adalah ekstensi peramban yang memblokir pengukuran halaman.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Jaringan dasar, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Mulai di sini. Satu reservoir, satu pompa, dan satu lingkar kecil: susunan terkecil yang masih berfungsi sebagai jaringan air. Liter per detik, dengan meter dan milimeter.';
$ec_lang['lpn_ex_basic_us_title']='Jaringan dasar, gpm (AS)';
$ec_lang['lpn_ex_basic_us_desc']='Jaringan awal yang sama dalam galon per menit, dengan kaki dan inci.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Yang terkecil dari tiga jaringan contoh milik EPANET sendiri: satu reservoir, satu pompa, dan satu lingkar.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Sistem distribusi bercabang dengan satu tangki, dari contoh-contoh EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Contoh besar dari EPANET: 92 simpul, 3 tangki, dan 2 reservoir, salah satunya sungai. Layak dibuka untuk melihat tampilan model berukuran nyata di peta.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='Jaringan yang sama dengan EPANET Net3, ditempatkan pada lokasi sembarang di permukaan bumi: koordinatnya berupa garis lintang dan garis bujur, dan peta jalan digambar di belakangnya.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Lokasi komersial yang diselesaikan untuk debit kebakaran di atas kebutuhan hari maksimum, pada satu saat tertentu, digambar di atas rencana tapak.';
$ec_lang['lpn_tool_undo']='Urungkan';
$ec_lang['lpn_confirm_example']='Ini menambahkan contoh ke jaringan yang sudah Anda miliki. Lanjutkan?';
$ec_lang['lpn_field_diameter']='Diameter';
$ec_lang['lpn_demand_tip']='Debit yang diambil dari jaringan pada simpul ini. Masukkan angka negatif untuk debit yang dimasukkan ke jaringan di sini.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Satuan ini menentukan arti masukan Anda';
$ec_lang['lpn_units_warn_lead']='{unit} adalah satuan untuk yang Anda masukkan pada:';
$ec_lang['lpn_units_options_head']='Saat Anda mengubah satuan:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Tidak merusak';
$ec_lang['lpn_units_nondestructive_desc']='Tidak merusak: membiarkan setiap masukan apa adanya dan menafsirkannya ulang dalam satuan baru.';
$ec_lang['lpn_units_destructive']='Merusak';
$ec_lang['lpn_units_destructive_desc']='Merusak: menulis ulang setiap masukan dengan konversi matematis, sehingga jaringan tetap secara fisik hampir sama, dalam batas toleransi konversi. Masukan asli hilang. Undo mengembalikannya.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} nilai sekarang berarti {unit}. Tidak ada yang ditulis ulang.';
$ec_lang['lpn_status_converted']='{n} nilai telah ditulis ulang menjadi {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Panjang';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Koordinat peta';
$ec_lang['lpn_units_mapcoords_deg']='derajat';
$ec_lang['lpn_units_usft']='Kaki survei AS';
$ec_lang['lpn_units_elevhead']='Elevasi dan tinggi tekan';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Gradien kehilangan tinggi tekan';
$ec_lang['lpn_result_gradient_tip']='Kehilangan tinggi tekan dibagi panjang pipa. Gunakan untuk membandingkan pipa dengan panjang berbeda terhadap satu batas desain.';
$ec_lang['lpn_result_water_age']='Usia air';
$ec_lang['lpn_result_water_age_tip']='Berapa lama air yang mencapai titik ini telah berada dalam sistem. Di tempat aliran bertemu, air yang datang membawa campuran usia, dan angka di sini adalah rata-ratanya yang dibobotkan menurut debit: sebuah simpul yang sebagian besar dipasok pipa utama baru yang pendek menunjukkan usia rendah meskipun sebuah jalan buntu yang panjang juga memasoknya. Pada tangki, angka ini adalah rata-rata usia air yang tersimpan, itulah sebabnya tangki yang pergantian airnya lambat biasanya menyimpan air tertua dalam suatu jaringan. Tidak ada batas regulasi untuk membandingkannya, jadi nilailah angka ini berdasarkan sistem Anda sendiri.';
$ec_lang['lpn_result_source_share']='Bagian sumber';
$ec_lang['lpn_result_source_share_tip']='Berapa banyak air yang mencapai titik ini berasal dari simpul penelusuran. Inilah yang dilaporkan oleh analisis Penelusuran sumber.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Usia air rata-rata';
$ec_lang['lpn_result_avg_source_share']='Bagian sumber rata-rata';
$ec_lang['lpn_result_avg_concentration']='Konsentrasi rata-rata';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Faktor gesekan';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Laju reaksi';
$ec_lang['lpn_result_status']='Status';
$ec_lang['lpn_result_status_open']='Terbuka';
$ec_lang['lpn_result_status_closed']='Tertutup';
$ec_lang['lpn_result_head']='Tinggi tekan';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Energi air di simpul ini, dinyatakan sebagai ketinggian kolom air. Ini adalah ketinggian mutlak, sedangkan tekanan adalah pengukuran gauge.';
$ec_lang['lpn_result_pressure']='Tekanan';
$ec_lang['lpn_result_flow']='Debit';
$ec_lang['lpn_result_velocity']='Kecepatan';
$ec_lang['lpn_result_headloss']='Kehilangan tinggi tekan';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Mengatur ulang hanya pengaturan proyek ini. Gambar dan proyek Anda yang lain tidak berubah. Untuk menyimpan pengaturan favorit Anda agar dapat digunakan kembali, simpan berkas proyek yang hanya berisi pengaturan.';
$ec_lang['lpn_reset_all_tip']='Menghapus setiap proyek, setiap gambar latar, setiap pengaturan, dan pilihan satuan Anda, lalu memuat ulang halaman persis seperti yang dilihat pengunjung pertama kali. Ini satu-satunya pengaturan ulang yang menghapus semuanya.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Kalkulator ini menyimpan satuan dan input proyek persis seperti yang dimasukkan, tetapi sebelumnya mengonversi angka ke satuan SI untuk penyimpanan. Proyek ini disimpan sebelum perubahan tersebut, sehingga angkanya tersimpan dalam SI. Konversi angka-angka ini sekali lagi ke satuan saat ini? Agar Anda dapat menilainya, berikut beberapa diameter yang akan dikonversi, beserta nilainya sebelum dan sesudah:';
$ec_lang['lpn_v2_restore_yes']='Konversi';
$ec_lang['lpn_v2_restore_never']='Tidak. Jangan tanya lagi.';
$ec_lang['lpn_v2_restore_no']='Tutup agar saya bisa memeriksa satuan saat ini terlebih dahulu';
$ec_lang['lpn_storage_too_new']='Proyek ini disimpan oleh versi halaman yang lebih baru, sehingga tidak dapat dibuka di sini.';
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
$ec_lang['lpn_tool_file']='Berkas';
$ec_lang['lpn_menu_edit']='Edit';
$ec_lang['lpn_menu_insert']='Sisipkan';
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
$ec_lang['lpn_menu_map']='Peta';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Tampilkan peta jalan';
$ec_lang['lpn_basemap_satellite_show']='Tampilkan citra satelit';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='digeoreferensi';
$ec_lang['lpn_xymap']='lokal';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Ubah menjadi…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Salinan dari {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Ubah menjadi';
$ec_lang['lpn_convas_coordsys_tip']='Sistem koordinat yang menjadi tujuan konversi salinan ini. Jika berbeda dari sistem koordinat proyek ini, dua langkah penempatan akan mengikuti. Proyek yang sudah mengetahui lokasinya membuka kedua langkah itu dengan jawaban yang sudah terisi, sehingga Anda dapat menerimanya apa adanya atau mengubahnya.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Saat ini: {crs}';
$ec_lang['lpn_convas_epsg']='Sistem koordinat EPSG';
$ec_lang['lpn_convas_epsg_tip']='Pilih sistem koordinat dari daftar EPSG. Lintang dan bujur adalah WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Georeferensi lokal tanpa nama';
$ec_lang['lpn_convas_unnamed_tip']='Koordinat lokal dalam satuan panjang, dengan peta dunia terlampir.';
$ec_lang['lpn_convas_none_tip']='Koordinat lokal dalam satuan panjang, tanpa peta dunia untuk saat ini.';
$ec_lang['lpn_convas_units_tip']='Satuan yang menjadi tujuan konversi salinan ini. Yang asli tetap memiliki angka dan satuannya sendiri.';
$ec_lang['lpn_convas_round']='Bulatkan nilai yang dikonversi';
$ec_lang['lpn_convas_round_tip']='Hanya membulatkan angka yang ditulis ulang oleh konversi ini, ke kelipatan terdekat yang Anda pilih. Nilai yang satuannya tidak berubah dibiarkan seperti semula.';
$ec_lang['lpn_convas_round_none']='Tanpa pembulatan';
$ec_lang['lpn_convas_round_flow']='Kebutuhan dan debit';
$ec_lang['lpn_convas_label_col']='Akhiran';
$ec_lang['lpn_convas_label_tip']='Teks yang ditambahkan setelah nilai ini pada label peta salinan, misalnya \' mm\' atau \' gpm\'. Terisi otomatis dari satuan yang dipilih di atas; kosongkan untuk tanpa akhiran.';
$ec_lang['lpn_convas_oneway']='Mengonversi kembali adalah konversi kedua, bukan pembatalan. Angka yang dikonversi lalu dikonversi kembali mungkin tidak kembali persis seperti yang diketik semula.';
$ec_lang['lpn_convas_ok']='Ubah';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} adalah salah satu dari sedikit sistem koordinat yang terdaftar tanpa informasi proyeksi yang dapat digunakan, sehingga tidak dapat dikonversi ke atau dari sistem itu. Tidak ada yang dikonversi.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='Salinan yang dikonversi adalah {name}. Proyek asli tidak berubah.';
$ec_lang['lpn_convas_cancelled']='Tidak ada yang dikonversi. Salinan ditutup, dan proyek asli tidak berubah.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Menyalin proyek ini ke tab baru dan mengonversi salinan itu ke sistem koordinat dan satuan yang Anda pilih. Ketika sistem koordinatnya berubah, sebuah wizard memandu Anda memperbesar peta di belakang jaringan Anda secara kasar, lalu menskalakan dan memutar jaringan Anda pada peta secara lebih tepat. Proyek ini dibiarkan persis seperti semula. Untuk menggeoreferensikan tanpa mengonversi apa pun, gunakan Peta, Peta dunia, Lampirkan.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Proyek ini sudah digeoreferensi, sehingga jaringan sudah berada pada peta dan tidak ada yang dipindahkan. Periksa apakah posisinya sudah benar, lalu tekan tombol Letakkan model di sini dan tombol Simpan penempatan ini.';
$ec_lang['lpn_georef_intro']='Menempatkan model dilakukan dalam dua langkah. Langkah 1 adalah langkah cepat: model tetap diam dan Anda menggerakkan peta di belakangnya, sampai lokasi Anda berada di bawah model dengan ukuran yang kira-kira tepat. Belum ada rotasi pada tahap ini. Langkah 2 adalah langkah presisi: Anda menyeret, mengubah ukuran, dan memutar model itu sendiri. Proyek Anda pada mulanya berada di atas peta seluruh dunia, jadi temukan lokasi Anda terlebih dahulu, lalu tekan tombol Letakkan model di sini.';
$ec_lang['lpn_georef_adjust']='Model sekarang berada di atas tanah, sehingga bergerak bersama peta. Seret model untuk memindahkannya, seret sudutnya untuk mengubah ukurannya, seret gagang bulat di atas model untuk memutarnya. Atau ketik jarak tanah dan sudut rotasi di bawah ini.';
$ec_lang['lpn_georef_step1']='Langkah 1 dari 2 — cepat';
$ec_lang['lpn_georef_step2']='Langkah 2 dari 2 — presisi';
$ec_lang['lpn_georef_step1_hint']='Proyek Anda tetap berada di tempatnya di layar. Geser dan perbesar peta di bawahnya sampai posisi dan ukurannya kira-kira tepat, lalu tekan tombol Letakkan model di sini.';
$ec_lang['lpn_georef_detach']='Angkat kembali';
$ec_lang['lpn_georef_size_prompt']='Kira-kira berapa lebar lokasi ini, di seluruh proyek?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Pintasan: tekan {key}.';
$ec_lang['lpn_tool_key_hint_two']='Pintasan: tekan {key} atau {key2}.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Klik pada peta sesuai petunjuk untuk memilih semua yang ada di dalam bentuk tersebut. Tekan tombol ini lagi untuk mengganti bentuk antara jendela, laso, dan poligon. Tahan Shift saat memilih untuk melanjutkan pemilihan yang sudah ada, menambah atau menghapus (mengalihkan) apa yang Anda pilih.';
$ec_lang['lpn_area_selected']='{n} dipilih.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='Tidak ada yang ditemukan di area tersebut.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Tambah dan hapus verteks yang membentuk pipa pada peta. Klik pipa untuk menambah verteks, klik verteks untuk menghapusnya, dan seret verteks untuk memindahkannya. Verteks hanya mengubah jalur yang digambar, bukan hidroliknya.';
$ec_lang['lpn_tool_undo_tip']='Batalkan perubahan terakhir.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Sesuaikan seluruh jaringan ke jendela.';
$ec_lang['lpn_tool_zoom_window_tip']='Klik dua sudut yang berseberangan dari sebuah kotak, atau seret salah satu sudutnya, pada peta untuk memperbesar tampilan ke area itu. Tekan tombol ini lagi untuk Tampilkan Semua.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Perbesar. Pintasan: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Perkecil. Pintasan: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Cari elemen berdasarkan ID-nya, atau cari semua elemen yang memenuhi suatu kondisi, dan ubah semuanya sekaligus.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Bilah alat';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Visibilitas';
$ec_lang['lpn_color_legend_open_tip']='Klik untuk membuka panel Visibilitas dan mengubah warna-warna ini.';
$ec_lang['lpn_color_node_field']='Warnai simpul berdasarkan';
$ec_lang['lpn_color_link_field']='Warnai pipa berdasarkan';
$ec_lang['lpn_color_ramp_sequential']='Sekuensial';
$ec_lang['lpn_color_ramp_diverging']='Divergen';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Jumlah rentang';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Pembagian rentang';
$ec_lang['lpn_color_ranges_note']='Batas di bawah ini tetap setelah ditetapkan; batas ini tidak mengikuti hasil saat berubah. Memilih Pembagian rentang di atas menetapkan batas dari keadaan sistem saat ini. Jika Anda mengubah nilai apa pun secara manual, pilihan di atas menjadi Manual.';
$ec_lang['lpn_color_criterion_note']='Metode ini mengambil batasnya dari sebuah standar desain, sehingga jumlah warna tetap selama metode ini dipilih.';
$ec_lang['lpn_color_break_number']='Batas harus berupa angka. Peta tidak berubah.';
$ec_lang['lpn_color_break_order']='Setiap batas harus lebih besar daripada batas sebelumnya. Peta tidak berubah.';
$ec_lang['lpn_color_break_count']='Jumlah batas harus satu lebih sedikit daripada jumlah warna. Peta tidak berubah.';
$ec_lang['lpn_color_ramp_qualitative']='Kualitatif';
$ec_lang['lpn_color_ramp_rainbow']='Pelangi';
$ec_lang['lpn_color_ramp_rainbow_eg']='sesuai EPANET';
$ec_lang['lpn_color_example_material']='Material';
$ec_lang['lpn_color_ramp_ylgnbu']='Kuning ke biru';
$ec_lang['lpn_color_ramp_rdylbu']='Merah ke biru, melalui kuning';
$ec_lang['lpn_georef_drop']='Letakkan model di sini';
$ec_lang['lpn_georef_finish']='Simpan penempatan ini';
$ec_lang['lpn_georef_scale']='Jarak di lapangan per satuan gambar';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Seberapa jauh satu satuan gambar Anda mencakup di lapangan. Gambar yang dibuat pada kisi polos biasanya tidak menyatakan hal ini, jadi atur di sini — atau biarkan Pergi ke… menanyakan lebar lokasi dan menghitungnya untuk Anda.';
$ec_lang['lpn_georef_rotation']='Putar berlawanan arah jarum jam (derajat)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Seberapa jauh memutar seluruh model, berlawanan arah jarum jam, agar arah utaranya menunjuk ke utara sebenarnya.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Tempatkan model di sini secara permanen? Anda tetap dapat menyeret elemen satu per satu setelahnya, tetapi gambar ini tidak lagi menjadi proyek xy. Untuk mendapatkan kembali xy, tutup proyek ini tanpa menyimpan.';
$ec_lang['lpn_georef_done']='Ini sekarang menjadi proyek lat/lon. Seret elemen mana pun untuk memindahkannya lebih dekat ke lokasi sebenarnya.';
$ec_lang['lpn_georef_backdrop_unrotated']='Gambar latar dipindahkan dan diubah ukurannya bersama model, tetapi tidak dapat diputar. Gunakan Peta, Gambar latar, Pindahkan untuk menyelaraskannya.';
$ec_lang['lpn_georef_empty']='Berkas itu tidak memiliki jaringan di dalamnya, sehingga tidak ada yang dapat ditempatkan.';
$ec_lang['lpn_georef_unavailable']='Alat penempatan tidak berhasil dimuat. Muat ulang halaman dan coba lagi.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Selesaikan penempatan dengan tombol "Simpan penempatan ini", atau tekan Batal, sebelum berpindah proyek. Penempatan ini adalah milik proyek ini dan tidak dapat mengikuti Anda ke proyek lain.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Selesaikan penempatan dengan tombol "Simpan penempatan ini", atau tekan Batal, sebelum menyimpan. Proyek masih dalam proses penempatan, sehingga yang ada di layar belum tentu sama dengan yang akan ditulis ke berkas.';
$ec_lang['lpn_goto_menu']='Pergi ke garis lintang dan bujur…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='Garis lintang dan garis bujur, dalam urutan itu';
$ec_lang['lpn_goto_bad']='Itu bukan satu garis lintang dan satu garis bujur. Coba 38 -122, dengan spasi di antara keduanya.';
$ec_lang['lpn_georef_goto']='Pergi ke…';
$ec_lang['lpn_georef_twopt']='Gunakan dua titik yang diketahui';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Tempatkan model secara tepat, ketika Anda sudah tahu letak sebenarnya dari dua titik pada gambar Anda. Klik salah satu titik, ketik garis lintang dan garis bujurnya, lalu lakukan hal yang sama untuk titik kedua. Posisi, skala, dan rotasi semuanya mengikuti dari kedua titik itu. Tekan tombol ini lagi untuk berhenti memilih.';
$ec_lang['lpn_georef_twopt_pick1']='Klik sebuah titik pada gambar Anda yang garis lintang dan garis bujurnya Anda ketahui.';
$ec_lang['lpn_georef_twopt_pick2']='Sekarang klik titik kedua yang diketahui, sejauh mungkin dari titik pertama.';
$ec_lang['lpn_georef_twopt_same']='Itu adalah titik yang Anda pilih pertama kali. Pilih titik yang berbeda.';
$ec_lang['lpn_georef_twopt_done']='Model sekarang berada pada kedua titik yang Anda berikan. Periksa hasilnya, lalu tekan tombol Simpan penempatan ini.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Panel bawah';
$ec_lang['lpn_pane_toggle_tip']='Tampilkan atau sembunyikan panel di bawah peta. Panel ini berisi profil dan tabel untuk setiap jenis elemen.';
$ec_lang['lpn_pane_resize']='Seret untuk membuat panel lebih tinggi atau lebih pendek';
$ec_lang['lpn_pane_tab_junctions']='Simpul';
$ec_lang['lpn_pane_tab_reservoirs']='Reservoir';
$ec_lang['lpn_pane_tab_tanks']='Tangki';
$ec_lang['lpn_pane_tab_pipes']='Pipa';
$ec_lang['lpn_pane_tab_pumps']='Pompa';
$ec_lang['lpn_pane_tab_valves']='Katup';
$ec_lang['lpn_pane_tab_tip']='Tab ini menampilkan elemen jenis ini sebagai tabel yang dapat Anda urutkan dan edit. Kolom hasil tidak dapat diedit.';
$ec_lang['lpn_pane_none']='Jaringan ini belum memiliki elemen jenis ini.';
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
$ec_lang['lpn_pane_text_attached']='Terlampir';
$ec_lang['lpn_pane_not_used']='Tidak digunakan';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Difilter berdasarkan {q}. Menampilkan {n} dari {all}.';
$ec_lang['lpn_pane_filter_clear']='Tampilkan semua';
$ec_lang['lpn_pane_filter_stale']='Baris yang tidak lagi cocok: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Tidak ada yang cocok dengan filter di tabel ini.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Perbesar & pilih';
$ec_lang['lpn_goto_on_map']='Tampilkan di peta';
$ec_lang['lpn_pane_select_on_map']='Pilih di peta';
$ec_lang['lpn_pane_unselect_on_map']='Batalkan pilihan di peta';

$ec_lang['lpn_pane_print']='Cetak tabel';

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
$ec_lang['lpn_menu_project']='Air';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Semua hal tentang pemodelan jaringan air ada di sini dalam satu tempat, kecuali kendali pemutaran animasi. Anda tidak perlu menebak di mana letak sesuatu.';
$ec_lang['lpn_tables_menu']='Tabel';
$ec_lang['lpn_tables_menu_tip']='Buka panel di bawah peta pada tabel bagian-bagian jaringan ini. Ada satu tabel untuk setiap jenis bagian, dan Anda dapat mengurutkan serta menyuntingnya di sana.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Hitung ulang jaringan ini sekarang. Mencari tombol Hitung? Tombol ini disembunyikan ketika pengaturan Hitung ulang otomatis aktif. Untuk memunculkan kembali tombolnya, matikan Hitung ulang otomatis di Pengaturan, Perhitungan, Hidraulika.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Hitung ulang otomatis';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Ketika ini aktif, proyek ini menghitung ulang tak lama setelah setiap perubahan yang Anda buat, dan tombol Hitung dihilangkan dari bilah alat karena tidak ada lagi yang perlu dilakukannya. Matikan ini pada jaringan besar, saat menunggu setiap perubahan dihitung ulang mengganggu pengetikan Anda, dan tombol Hitung akan muncul kembali sehingga Anda yang memilih kapan menjalankannya.';
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
$ec_lang['lpn_time_run_slow']='Jaringan ini membutuhkan {secs} s untuk dihitung, dan diatur untuk menghitung ulang setelah setiap perubahan. Untuk menghentikannya dan mendapatkan kembali tombol Hitung, matikan “Hitung ulang otomatis” di Pengaturan, pada Perhitungan, Hidraulika.';
$ec_lang['lpn_time_no_report']='Belum ada laporan proses. Laporan ini adalah teks asli dari EPANET, sehingga baru muncul setelah jaringan ini dihitung dengan penyelesai EPANET.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Bantuan';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Galeri tangkapan layar';
$ec_lang['lpn_help_walkthroughs']='Tutorial';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Hapus jaringan';
$ec_lang['lpn_confirm_delete_network']='Hapus semua simpul, pipa, dan label teks di proyek ini? Gambar latar, nama proyek, dan pengaturan Anda tetap disimpan.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Cari dan ganti';
$ec_lang['lpn_find_title']='Cari dan ganti';
$ec_lang['lpn_find_scope']='Apa yang dicari';
$ec_lang['lpn_find_scope_all']='Semuanya';
$ec_lang['lpn_find_property']='Properti';
$ec_lang['lpn_find_condition']='Kondisi';
$ec_lang['lpn_find_value']='Nilai';
$ec_lang['lpn_find_btn']='Cari';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Filter di tabel saat ini';
$ec_lang['lpn_find_filter_tip']='Tampilkan hanya bagian yang cocok dengan kueri ini pada salah satu tabel di bawah peta. Gambar tidak berubah dan tidak ada yang dihapus.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} dari {all}';
$ec_lang['lpn_find_filter_summary']='Difilter oleh {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Kueri ini tidak berlaku untuk tabel mana pun.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='mengandung';
$ec_lang['lpn_find_op_equals']='sama dengan';
$ec_lang['lpn_find_op_gt']='lebih besar dari';
$ec_lang['lpn_find_op_lt']='lebih kecil dari';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='kosong';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} ditemukan. Klik salah satu untuk menuju ke sana.';
$ec_lang['lpn_find_shift_hint']='Shift+klik untuk mengalihkan: menambahkan jika belum ada dalam kumpulan pilihan, atau menghapus jika sudah ada di dalamnya.';

$ec_lang['lpn_find_none']='Tidak ada yang cocok.';
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
$ec_lang['lpn_find_op_top']='{n} tertinggi';
$ec_lang['lpn_find_op_bottom']='{n} terendah';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Ketik apa yang dicari.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Konektivitas';
$ec_lang['lpn_find_prop_demand_desc']='Deskripsi kategori kebutuhan ini';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='tidak ada penghubung di simpul';
$ec_lang['lpn_find_op_conn_noopen']='tidak ada penghubung terbuka di simpul';
$ec_lang['lpn_find_op_conn_nolinksource']='tidak ada jalur penghubung ke sumber';
$ec_lang['lpn_find_op_conn_noopensource']='tidak ada jalur terbuka ke sumber';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Setiap simpul telah terhubung.';
$ec_lang['lpn_find_conn_no_fixed']='Jaringan ini tidak memiliki reservoir atau tangki, sehingga tidak ada sumber yang dapat dicapai. Hanya tidak ada penghubung di simpul dan tidak ada penghubung terbuka di simpul yang dapat dicari.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Pencarian yang sama, ditulis sebagai satu baris. Mengubah kendali akan menulis ulang baris ini, dan mengetik pada baris ini akan memperbarui kendali.';
$ec_lang['lpn_find_query_label']='Kueri';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Gabungkan kondisi dengan DAN, ATAU dan ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='DAN';
$ec_lang['lpn_find_q_or']='ATAU';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Kendali tidak dapat menyatakan kueri di bawah ini, sehingga disembunyikan.';
$ec_lang['lpn_find_q_restore']='Gunakan kendali sebagai gantinya';
$ec_lang['lpn_replace_q_bad']='Kueri ini tidak dapat dipahami, sehingga tidak ada yang dapat diubah. Perbaiki dahulu di atas.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(pada karakter {n})';
$ec_lang['lpn_find_q_err_empty']='Kueri ini kosong, sehingga tidak ada yang akan dicari.';
$ec_lang['lpn_find_q_err_scope']='Tidak ada yang bernama {w} untuk dicari. Coba salah satu dari: {list}';
$ec_lang['lpn_find_q_err_dot']='Beri tanda titik antara apa yang dicari dan propertinya, seperti Simpul.ID';
$ec_lang['lpn_find_q_err_prop']='Bukan properti dari {scope}: {w}. Coba salah satu dari: {list}';
$ec_lang['lpn_find_q_err_op']='Bukan kondisi untuk {prop}: {w}. Coba salah satu dari: {list}';
$ec_lang['lpn_find_q_err_value']='Kondisi ini memerlukan nilai setelahnya: {op}';
$ec_lang['lpn_find_q_err_quote']='Beri tanda kutip di sekitar nilai teks: {w} bukan angka.';
$ec_lang['lpn_find_q_err_quote_end']='Teks berkutip ini tidak memiliki tanda kutip penutup.';
$ec_lang['lpn_find_q_err_close']='Tanda kurung ( ini dibuka dan tidak pernah ditutup.';
$ec_lang['lpn_find_q_err_open']='Tanda kurung ) ini tidak menutup apa pun.';
$ec_lang['lpn_find_q_err_end']='Tidak ada yang diharapkan setelah ini. Gabungkan dua pencarian dengan {and} atau {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Ubah yang ditemukan';
$ec_lang['lpn_replace_prop']='Properti yang diubah';
$ec_lang['lpn_replace_value']='Nilai baru';
$ec_lang['lpn_replace_source']='Sumber nilai baru';
$ec_lang['lpn_replace_asked']='Elevasi diminta untuk {n} simpul. Hasilnya sedang dalam proses.';
$ec_lang['lpn_replace_btn']='Ganti';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Ubah {n} aset?';
$ec_lang['lpn_replace_apply']='Ubah semuanya';
$ec_lang['lpn_replace_done']='{n} aset diubah. Anda dapat membatalkannya dalam satu langkah.';
$ec_lang['lpn_replace_none']='Tidak ada yang akan berubah.';
$ec_lang['lpn_replace_no_value']='Ketik nilai baru.';
$ec_lang['lpn_replace_scope']='Pilih satu jenis aset di atas untuk mengubah nilainya.';
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
$ec_lang['lpn_profile_title']='Profil di sepanjang rute';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Klik simpul tempat rute dimulai.';
$ec_lang['lpn_profile_draw_more']='Gerakkan kursor di atas peta untuk melihat rutenya. Klik sebuah simpul untuk menambahkannya. Klik dua kali untuk selesai. Esc membatalkan.';
$ec_lang['lpn_profile_draw_blocked']='Tidak ada rute dari {a} ke {b}. Pilih simpul lain.';
$ec_lang['lpn_profile_tap_start']='Ketuk simpul tempat rute dimulai.';
$ec_lang['lpn_profile_tap_more']='Ketuk sebuah simpul untuk melihat rutenya. Tekan dan tahan untuk menambahkannya. Ketuk dua kali untuk selesai. Tekan Profil lagi untuk membatalkan.';
$ec_lang['lpn_profile_say_idle']='Tekan Profil lagi untuk memilih rute baru pada peta.';
$ec_lang['lpn_profile_none']='Belum ada rute. Tekan Profil lagi untuk memilihnya pada peta.';
$ec_lang['lpn_profile_choose']='Pilih simpul awal dan simpul akhir.';
$ec_lang['lpn_profile_no_path']='Kedua simpul ini tidak terhubung oleh rute mana pun.';
$ec_lang['lpn_profile_no_solve']='Belum ada hasil, sehingga hanya garis permukaan tanah yang digambar.';
$ec_lang['lpn_profile_summary']='Simpul: {n}, panjang: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Jarak di sepanjang rute ({u})';
$ec_lang['lpn_profile_axis_elev']='Elevasi dan tinggi tekan ({u})';
$ec_lang['lpn_profile_ground']='Permukaan tanah';
$ec_lang['lpn_profile_hgl']='Garis tinggi tekan hidrolik';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Sunting';
$ec_lang['lpn_profile_edit_tip']='Ubah salah satu ujung rute, atau lepaskan satu simpul darinya, tanpa perlu menggambar ulang seluruh rute.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Seret titik mana pun pada rute untuk memindahkannya. Klik titik yang Anda tambahkan untuk melepaskannya.';
$ec_lang['lpn_profile_edit_tap']='Seret titik mana pun pada rute untuk memindahkannya. Ketuk titik yang Anda tambahkan untuk melepaskannya.';
$ec_lang['lpn_profile_edit_nowhere']='Titik pada rute harus berupa simpul. Rute tidak berubah.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Rute tersimpan';
$ec_lang['lpn_profile_new']='Rute tersimpan baru…';
$ec_lang['lpn_profile_new_name']='Rute {n}';
$ec_lang['lpn_profile_rename']='Ganti nama rute…';
$ec_lang['lpn_profile_delete']='Hapus rute';
$ec_lang['lpn_profile_prompt_name']='Nama untuk rute ini';
$ec_lang['lpn_profile_delete_confirm']='Hapus rute tersimpan {name}? Gambar itu sendiri tidak berubah.';
$ec_lang['lpn_profile_none_saved']='Belum ada rute tersimpan';
$ec_lang['lpn_profile_missing']='Rute tersimpan {name} menggunakan simpul yang tidak ada dalam proyek ini: {ids}';
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
$ec_lang['lpn_ts_menu']='Deret waktu';
$ec_lang['lpn_ts_tip']='Membuat grafik satu atau beberapa elemen terhadap waktu sepanjang simulasi periode waktu.';
$ec_lang['lpn_ts_title']='Nilai terhadap waktu';
$ec_lang['lpn_ts_group_nodes']='Simpul';
$ec_lang['lpn_ts_group_links']='Penghubung';
$ec_lang['lpn_ts_add']='Tambahkan yang dipilih';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Tidak ada elemen jenis itu yang dipilih pada peta.';
$ec_lang['lpn_ts_clear']='Hapus semua';
$ec_lang['lpn_ts_chip_tip']='Keluarkan {id} dari grafik';
$ec_lang['lpn_ts_none']='Belum ada yang digrafikkan. Pilih elemen pada peta lalu tekan Tambahkan yang dipilih.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Belum ada hasil periode waktu. Tekan Hitung untuk menjalankan simulasi.';
$ec_lang['lpn_ts_summary']='Elemen: {n}, waktu pelaporan: {steps}';
$ec_lang['lpn_ts_axis_time']='Waktu berlalu';
$ec_lang['lpn_freq_menu']='Frekuensi';
$ec_lang['lpn_freq_tip']='Membuat grafik distribusi frekuensi satu properti pada semua simpul atau semua pipa pada langkah waktu saat ini.';
$ec_lang['lpn_freq_title']='Distribusi nilai';
$ec_lang['lpn_freq_none']='Belum ada hasil untuk nilai ini, sehingga tidak ada yang dapat digrafikkan.';
$ec_lang['lpn_freq_summary']='Digambarkan: {n} dari {total}';
$ec_lang['lpn_freq_summary_time']='Digambarkan: {n} dari {total}, pada {time}';
$ec_lang['lpn_freq_axis_percent']='Persen kurang dari';
$ec_lang['lpn_view_units']='Satuan';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Simpan semua';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Proyek{n}';
$ec_lang['lpn_project_copy_suffix']='(salinan)';
$ec_lang['lpn_project_rename']='Ganti nama';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Proyek baru…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Proyek baru';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Sistem koordinat';
$ec_lang['lpn_new_coordsys_tip']='Pilih sistem koordinat jaringan Anda. Ini bersifat permanen; satu-satunya cara untuk mengonversi jaringan ke koordinat yang berbeda adalah dengan "Berkas, Buka ke koordinat baru", dan hasilnya bersifat perkiraan.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Lokal, skematik, atau khusus';
$ec_lang['lpn_new_coordsys_local_tip']='Tidak digeoreferensi. Lampirkan gambar latar Anda sendiri atau tanpa gambar latar.';
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
$ec_lang['lpn_crs_view']='Saring berdasarkan tampilan peta';
$ec_lang['lpn_crs_view_tip']='Hanya menawarkan proyeksi yang mencakup tempat yang sedang dilihat peta. Matikan untuk membaca seluruh daftar.';
$ec_lang['lpn_crs_place']='Pencarian nama tempat';
$ec_lang['lpn_crs_place_tip']='Ketik nama kota, alamat, atau tempat terkenal, dan tampilan peta akan berpindah ke sana. Kata-kata yang Anda ketik dikirim ke layanan nama tempat OpenStreetMap, yang akan meminta izin Anda pada kali pertama. Proyek geografis baru juga dimulai di tempat yang Anda temukan di sini.';
$ec_lang['lpn_crs_search']='Cari';
$ec_lang['lpn_crs_name']='Saring nama proyeksi';
$ec_lang['lpn_crs_name_tip']='Hanya menampilkan proyeksi yang namanya atau kode EPSG-nya mengandung apa yang Anda ketik. Coba nomor zona, atau UTM, atau Mercator.';
$ec_lang['lpn_crs_list_tip']='Proyeksi yang tersisa dari kedua penyaring di atas. Pilih salah satu lalu tekan Pilih.';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Belum ada tempat yang dicari, sehingga seluruh daftar ditawarkan. Cari tempat di atas atau perbesar peta untuk mempersempit daftar.';
$ec_lang['lpn_crs_count']='{n} dari {total} proyeksi ditampilkan.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} dari {total} sistem koordinat mencakup jaringan ini.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(tanpa peta)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} adalah salah satu dari sedikit sistem koordinat yang terdaftar tanpa informasi proyeksi yang dapat digunakan. Ini berarti peta dunia, pencarian nama tempat, dan elevasi DEM tidak berfungsi. Koordinat Anda tidak terpengaruh.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='tanpa nama';
$ec_lang['lpn_crs_none']='Tidak digeoreferensi';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Proyek menyimpan satuannya sendiri, sehingga pilihan ini hanya berlaku untuk proyek ini saja dan tidak ada yang disimpan sebagai pengaturan peramban. Untuk memulai proyek baru dengan cara tertentu, simpan proyek kosong sebagai templat Anda dan buat salinannya setiap kali diperlukan.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Bandung, Jawa Barat';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Buat';
$ec_lang['lpn_file_open']='Buka…';
$ec_lang['lpn_file_save']='Simpan';
$ec_lang['lpn_file_saveas']='Simpan sebagai…';
$ec_lang['lpn_file_revert']='Kembalikan';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Berkas terbaru';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='Izin untuk membuka berkas itu tidak diberikan, sehingga berkas tersebut tidak dibuka.';
$ec_lang['lpn_recent_gone']='Tidak dapat membuka {file}. Berkas ini mungkin telah dipindahkan, diganti namanya, atau dihapus, sehingga dikeluarkan dari daftar terbaru.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Proyek baru';
$ec_lang['lpn_tab_all']='Semua proyek';
$ec_lang['lpn_tab_menu']='Menu proyek';
$ec_lang['lpn_tab_duplicate']='Gandakan';
$ec_lang['lpn_tab_move_left']='Pindah ke kiri';
$ec_lang['lpn_tab_move_right']='Pindah ke kanan';
$ec_lang['lpn_tab_unsaved']='Belum disimpan ke berkas';
$ec_lang['lpn_import_bad_file']='Berkas itu tidak dapat dibaca sebagai proyek yang disimpan dari halaman ini.';
$ec_lang['lpn_import_no_room']='Ruang penyimpanan peramban tidak cukup untuk menambahkan proyek ini. Hapus proyek yang sudah tidak Anda perlukan lalu coba lagi.';
$ec_lang['lpn_file_import_menu']='Impor…';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='OK';
$ec_lang['lpn_file_import_inp']='Impor berkas EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Membaca jaringan dari berkas EPANET, baik berkas teks .inp maupun berkas .net yang disimpan EPANET, lalu menyimpannya di peramban ini sebagai proyek baru.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='Ekspor berkas EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Tulis jaringan ini sebagai berkas EPANET .inp dan unduh. Angka yang Anda ketik ditulis persis seperti saat Anda mengetiknya. Apa pun yang tidak dapat ditampung format .inp akan didaftarkan untuk Anda setelahnya.';
$ec_lang['lpn_status_inp_exported']='{file} berhasil diekspor.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} hal yang tidak dapat ditampung format .inp.';
$ec_lang['lpn_inp_export_refused']='Proyek ini tidak dapat ditulis sebagai berkas EPANET: {detail}';
$ec_lang['lpn_inp_bad_file']='Berkas itu tidak dapat dibaca sebagai berkas jaringan EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Berkas ini tampaknya berkas .net EPANET, tetapi halaman ini tidak dapat membacanya. Buka berkas itu di EPANET dan gunakan perintah File, Export, Network di sana untuk menyimpannya sebagai berkas .inp, lalu impor berkas tersebut.';
$ec_lang['lpn_inp_report_heading']='Berkas {file} diimpor';
$ec_lang['lpn_inp_report_counts']='{nodes} simpul, reservoir dan tangki, {links} pipa, pompa dan katup, dalam satuan {units}.';
$ec_lang['lpn_inp_report_clean']='Semua isi berkas berhasil dibawa masuk. Tidak ada yang tertinggal.';
$ec_lang['lpn_inp_report_label_anchor']='Label teks ditempatkan sebagaimana EPANET menempatkannya, dari sudut kiri atasnya.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='Berkas EPANET tidak memuat sistem koordinat, sehingga berkas ini tidak akan digeoreferensi pada awalnya. Untuk menempatkannya pada peta dunia, gunakan Peta, Peta dunia… Untuk mengonversi koordinatnya, gunakan Berkas, Ubah menjadi…';
$ec_lang['lpn_inp_report_lead']='Halaman ini tidak menggunakan semua yang digunakan EPANET, tetapi tidak ada apa pun dalam berkas Anda yang dibuang. Berikut adalah apa yang disimpan berkas Anda tanpa digunakan oleh halaman ini, dan apa yang diubah saat berkas dibaca:';
$ec_lang['lpn_inp_drop_headloss']='Berkas ini tidak menggunakan rumus Hazen-Williams. Halaman ini menghitung dengan Hazen-Williams, sehingga angka kekasaran pipa disimpan persis seperti tertulis, tetapi hasilnya di sini tidak akan sama dengan hasil di EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Tangki-tangki ini tidak berdinding lurus: berkas menyatakan bentuknya sebagai kurva. Kurva itu disimpan di kotak Pustaka, tangki tetap merujuk padanya, dan simulasi periode waktu mengisi dan mengosongkan tangki sesuai jadwal yang diberikan kurva itu. Satu saat tunggal sama saja pada kedua cara, karena muka air adalah tingkat yang ditetapkan berkas. Diameter yang tertulis dalam berkas disimpan berdampingan dengan kurva, dan itulah yang digunakan untuk menggambar dan menyelesaikan tangki yang tidak memiliki kurva.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Katup throttle ini masuk sebagai katup throttle, dengan kehilangan yang sama seperti pada berkas asal.';
$ec_lang['lpn_inp_drop_valve_active']='Katup-katup ini mengendalikan tekanan atau debit, dan membuka serta menutup sendiri seiring perubahan air. Tidak ada yang hilang saat diimpor, dan halaman ini menyelesaikannya dengan penyelesai EPANET, yang diaktifkan sendiri untuk jaringan ini.';
$ec_lang['lpn_inp_drop_valve']='Katup-katup ini dijelaskan dengan kurva atau penurunan tekanan tetap, dan halaman ini tidak memiliki elemen semacam itu. Katup-katup ini masuk sebagai pipa terbuka, sehingga jaringan tetap tersambung, tetapi tidak ada lagi yang mengendalikan tekanan atau debit di sana.';
$ec_lang['lpn_inp_drop_cv']='Di EPANET, pipa-pipa ini hanya melewatkan air dalam satu arah. Pipa-pipa tersebut masuk sebagai pipa biasa, sehingga air kini dapat mengalir ke kedua arah melaluinya.';
$ec_lang['lpn_inp_drop_demands']='Simpul-simpul ini memiliki lebih dari satu kebutuhan. Kebutuhan-kebutuhan tersebut dijumlahkan menjadi satu kebutuhan tunggal yang ditampung halaman ini.';
$ec_lang['lpn_inp_drop_patterns']='Halaman ini tidak membaca pola kebutuhan, karena bagian yang menjalankan simulasi periode waktu tidak berhasil dimuat. Setiap kebutuhan adalah angka yang tertulis dalam berkas.';
$ec_lang['lpn_inp_drop_demand_pattern']='Simpul-simpul ini mengubah kebutuhannya sepanjang proses berjalan. Polanya masuk secara utuh, dan kebutuhan yang Anda lihat adalah kebutuhan pada saat yang ditunjukkan jam.';
$ec_lang['lpn_inp_drop_emitters']='Simpul-simpul ini memiliki koefisien sprinkler atau kebocoran. Koefisien itu disimpan dan ikut diselesaikan, dan setiap simpul menampilkannya di kotak Koefisien emiter pada propertinya.';
$ec_lang['lpn_inp_drop_curve_long']='Kurva pompa ini memiliki lebih dari tiga titik. Titik terendah, tengah, dan tertinggi disimpan, karena halaman ini mencocokkan kurva ke paling banyak tiga titik.';
$ec_lang['lpn_inp_drop_curve_missing']='Pompa ini merujuk pada kurva yang tidak ada dalam berkas. Pompa ini masuk tanpa kurva, sehingga tidak menambahkan tinggi tekan.';
$ec_lang['lpn_inp_drop_pump_other']='Pompa ini dijelaskan berdasarkan daya yang ditariknya, bukan berdasarkan kurva. Pompa ini masuk tanpa kurva, sehingga tidak menambahkan tinggi tekan.';
$ec_lang['lpn_inp_drop_head_pattern']='Reservoir-reservoir ini naik dan turun sepanjang proses berjalan. Polanya masuk secara utuh, dan muka air yang Anda lihat adalah muka air pada saat yang ditunjukkan jam.';
$ec_lang['lpn_inp_drop_pump_speed']='Pompa-pompa ini berputar pada kecepatan yang berbeda dari kecepatan saat kurvanya diukur, atau berubah kecepatan sepanjang proses berjalan. Kecepatan dan polanya masuk secara utuh, dan tinggi tekan yang Anda lihat adalah tinggi tekan pada saat yang ditunjukkan jam.';
$ec_lang['lpn_inp_drop_setting']='Pipa, pompa, dan katup ini membawa pengaturan yang tidak dapat ditampung halaman ini. Elemen-elemen tersebut masuk dalam keadaan terbuka.';
$ec_lang['lpn_inp_drop_rules']='Berkas ini memiliki kendali berbasis aturan. Halaman ini membaca dan menggunakannya. Jalankan model dengan penyelesai EPANET dan aturan itu diterapkan, dengan setiap muka air, tekanan, dan debit di dalamnya dikonversi ke satuan yang ditampilkan proyek ini. Buka Aturan di bawah Pustaka untuk membaca atau mengubah salah satunya. Aturan itu tetap disimpan persis seperti yang dinyatakan berkas, dan akan ditulis kembali jika Anda menyimpan berkas EPANET.';
$ec_lang['lpn_inp_drop_eps']='Berkas ini menjelaskan simulasi periode waktu. Bagian halaman ini yang menjalankan simulasi periode waktu tidak berhasil dimuat, sehingga hanya kondisi awal yang masuk.';
$ec_lang['lpn_inp_drop_quality']='Berkas ini menjelaskan bagaimana kualitas air berubah selama mengalir: apa yang ada dalam air pada awalnya, dan seberapa cepat zat itu bereaksi di dalam pipa dan di dalam tangki. Halaman ini membaca angka-angka tersebut dan menggunakannya. Pilih bahan kimia di bawah Pengaturan, Perhitungan, Kualitas, lalu jalankan model, dan konsentrasinya dihitung di sepanjang jaringan seiring proses berjalan. Baris-barisnya tetap disimpan, dan akan ditulis kembali jika Anda menyimpan berkas EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='Berkas ini menyatakan di mana bahan kimia diberikan dosisnya ke dalam jaringan, dan bagaimana air di dalam tangki bercampur. Dosis itu muncul pada simpul tempatnya ditambahkan, dan tangki menyatakan model pencampuran yang diikutinya. Baik dosis maupun model pencampuran hanya dihitung oleh penyelesai EPANET.';
$ec_lang['lpn_inp_drop_energy']='Berkas EPANET ini menyertakan data pemodelan biaya pemompaan. Halaman ini membaca dan menggunakannya. Jalankan model dengan penyelesai EPANET, lalu buka Air, Laporan, Energi pompa untuk melihat berapa lama setiap pompa berjalan, daya yang ditariknya, energi yang digunakannya, dan berapa biayanya. Baris-barisnya tetap disimpan, dan akan ditulis kembali jika Anda menyimpan berkas EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Berkas ini memberi tag pada sebagian simpul, pipa, atau elemen lainnya. Setiap tag masuk secara utuh, dan masing-masing berada pada properti elemennya sendiri, tempat Anda dapat membacanya atau mengubahnya.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Berkas ini menyimpan pengaturan EPANET sendiri untuk cara memformat laporan yang dicetaknya. Anda dapat membaca laporan penyelesai ini di sini, di bawah Laporan, Proses EPANET, tetapi laporan itu tercetak dalam format standar penyelesai, bukan format yang diminta pengaturan ini. Baris-barisnya tetap disimpan, dan akan ditulis kembali jika Anda menyimpan berkas EPANET.';
$ec_lang['lpn_inp_drop_sections']='Berkas ini menyimpan sebuah bagian yang sama sekali tidak dibaca oleh halaman ini. Tidak ada yang menggunakannya di sini. Bagian itu tetap disimpan utuh, dan akan ditulis kembali jika Anda menyimpan berkas EPANET.';
$ec_lang['lpn_inp_drop_quality_options']='Berkas ini menyatakan opsi kualitas air EPANET: opsi Quality, yang menyebutkan jenis analisis kualitas air, serta dua pengaturan yang menyertai bahan kimia, yaitu Relative diffusivity dan Quality tolerance. Ketiganya tetap disimpan dan ketiganya digunakan. Usia air, penelusuran sumber, dan bahan kimia masing-masing dihitung di sini, dan kedua pengaturan bahan kimia itu diserahkan ke penyelesai EPANET saat Anda menjalankan bahan kimia. Semuanya akan ditulis kembali jika Anda menyimpan berkas EPANET.';
$ec_lang['lpn_inp_drop_file_options']='Berkas ini merujuk ke berkas tambahan: Map, yang menyimpan koordinat, atau Hydraulics, yang menyimpan hasil hidraulika yang sudah dihitung. Halaman ini tidak dapat membuka keduanya, sehingga barisnya tetap disimpan apa adanya dan ditulis kembali jika Anda menyimpan berkas EPANET.';
$ec_lang['lpn_inp_drop_demand_model']='Berkas ini meminta analisis berbasis tekanan (PDA), yaitu ketika sebuah simpul menerima kurang dari kebutuhannya saat tekanan di sana rendah. Halaman ini menyelesaikan secara berbasis kebutuhan, sehingga setiap simpul di sini menerima kebutuhan yang dinyatakan berkas, apa pun tekanan yang dihasilkan. Baris tersebut tetap disimpan dan ditulis kembali jika Anda menyimpan berkas EPANET.';
$ec_lang['lpn_inp_drop_other_options']='Berkas ini menyatakan opsi yang tidak dibaca oleh halaman ini. Tidak ada yang menggunakannya di sini. Opsi itu tetap disimpan dan ditulis kembali jika Anda menyimpan berkas EPANET.';
$ec_lang['lpn_inp_drop_net_options']='Berkas .net EPANET ini menyatakan pengaturan yang tidak memiliki kendali di halaman ini, sehingga nilainya dicantumkan di sini alih-alih dibawa masuk. Semua yang lain masuk dengan baik. Jika Anda memerlukannya, buka berkas ini di EPANET dan gunakan File, Export, Network untuk menyimpannya sebagai berkas .inp, lalu impor berkas itu.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Ini adalah berkas .net EPANET. Itu adalah berkas proyek EPANET sendiri, tidak memiliki deskripsi resmi yang diterbitkan, dan halaman ini membacanya dengan menyimpulkan formatnya dari berkas-berkas contoh, sehingga gunakan berkas ini hanya bila tidak ada pilihan lain, bukan sebagai cara yang dapat diandalkan. Berkas .inp adalah format terdokumentasi yang dibaca oleh setiap program lain: di EPANET gunakan File, Export, Network untuk menulisnya, dan impor berkas itu sebagai gantinya kapan pun Anda bisa.';
$ec_lang['lpn_inp_drop_backdrop']='Berkas ini menyebut sebuah gambar latar tetapi tidak berisi gambar itu sendiri. Tambahkan sendiri melalui File, Gambar latar, Tambah gambar.';
$ec_lang['lpn_inp_drop_dangling']='Pipa-pipa ini menyebut simpul yang tidak ada di dalam berkas, sehingga tidak disertakan.';
$ec_lang['lpn_inp_drop_units']='Satuan debit yang disebutkan dalam berkas ini tidak dikenali oleh halaman ini, sehingga setiap angka dibaca sebagai galon per menit. Periksa setiap angka sebelum menggunakan hasilnya.';
$ec_lang['lpn_inp_drop_anchor_missing']='Teks ini melekat pada simpul, reservoir, atau tangki yang tidak ada dalam berkas. Teks ini masuk sebagai teks bebas di tempat yang ditentukan berkas, dan sekarang tidak mengikuti apa pun.';
$ec_lang['lpn_import_notes_heading']='Proyek ini dibaca dari berkas EPANET. Sebagian isi berkas tersebut tetap disimpan tetapi tidak digunakan di halaman ini.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='Membuka {name} dari sebuah berkas, dan menambahkannya ke peramban ini sebagai proyek baru.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Berkas proyek';
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
$ec_lang['lpn_file_upload_explain']='Peramban ini tidak dapat tersambung ke berkas, sehingga membuka berkas di sini sebenarnya adalah mengunggah: proyek disalin ke dalam peramban ini, dan satu-satunya cara menyimpan pekerjaan Anda kembali ke berkas adalah menimpa berkas itu dengan File, Simpan sebagai.';
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
$ec_lang['lpn_file_saveas_tip_download']='Menyimpan menggunakan pengaturan Unduhan peramban Anda. Peramban ini tidak dapat tersambung ke berkas, sehingga Simpan dinonaktifkan dan hanya Simpan sebagai yang tersedia. Jika Anda mengaktifkan pengaturan peramban "Tanyakan tempat menyimpan setiap berkas", Anda dapat memilih berkas aslinya dan menimpanya.';
$ec_lang['lpn_status_uploaded']='Berkas proyek diunggah. Tidak ada sambungan ke berkas itu yang dapat dipertahankan, sehingga satu-satunya cara menyimpan kembali ke berkas itu adalah menggunakan File, Simpan sebagai.';
$ec_lang['lpn_status_downloaded']='Mengunduh {file}. Peramban ini tidak dapat tersambung ke berkas, sehingga proyek ini tetap ditandai belum disimpan ke berkas.';
$ec_lang['lpn_status_file_opened']='Membuka {file}.';
$ec_lang['lpn_status_already_open']='Berkas itu sudah terbuka di sini sebagai {name}, sehingga ini beralih ke berkas tersebut, bukan membuka salinan kedua.';
$ec_lang['lpn_status_already_open_dirty']='Berkas itu sudah terbuka di sini sebagai {name}, dengan perubahan yang belum Anda simpan ke berkas tersebut. Ini beralih ke berkas tersebut, bukan membuka salinan kedua. Gunakan File, Kembalikan jika Anda ingin versi yang ada di disk.';
$ec_lang['lpn_status_saved']='Menyimpan {file}.';
$ec_lang['lpn_status_reverted']='Memuat {file} lagi dari disk.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Simpan perubahan Anda ke {name} sebelum menutupnya?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} hanya tersimpan di peramban ini. Jika Anda menutupnya tanpa menyimpannya ke berkas, proyek ini akan hilang selamanya.';
$ec_lang['lpn_close_discard']='Tutup tanpa menyimpan';
$ec_lang['lpn_cancel']='Batal';
$ec_lang['lpn_revert_confirm']='Buang perubahan yang telah Anda buat dan muat {file} lagi dari disk?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Proyek ini berasal dari {file}, tetapi sambungan ke berkas itu telah hilang. Pilih berkas itu lagi untuk tersambung ke sana.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Tidak dapat menulis ke berkas. Berkas ini mungkin telah dipindahkan atau diganti namanya, atau izin mungkin telah dicabut. Pekerjaan Anda tetap tersimpan di peramban ini.';
$ec_lang['lpn_file_changed_elsewhere']='Orang lain telah menyimpan ke berkas ini sejak Anda membukanya, sehingga menyimpan sekarang akan menimpa pekerjaan mereka. Gunakan File, Simpan sebagai untuk menyimpan perubahan Anda ke berkas Anda sendiri, atau File, Kembalikan untuk membuang perubahan Anda dan memuat milik mereka.';
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
$ec_lang['lpn_lock_somebody']='Orang lain';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} sedang membuka berkas ini.';
$ec_lang['lpn_lock_open_readonly']='Buka hanya-baca';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Ambil alih kunci';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Berkas ini tampaknya sedang digunakan.';
$ec_lang['lpn_lock_open_care']='Untuk menghindari kehilangan data, pilih dengan cermat dari opsi berikut.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='Telah digunakan selama {x}.';
$ec_lang['lpn_lock_age_edited']='Terakhir diedit {x} yang lalu.';
$ec_lang['lpn_lock_age_saved']='Terakhir disimpan {x} yang lalu.';
$ec_lang['lpn_lock_age_never_saved']='Belum ada yang disimpan ke berkas ini.';
$ec_lang['lpn_lock_age_unknown']='Tidak ada catatan tentang berapa lama berkas ini telah digunakan, atau kapan terakhir disimpan atau diedit.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"Tanya" memberi tahu siapa pun yang sedang membuka berkas ini bahwa Anda menginginkannya, dan tidak mengubah apa pun yang lain. "Buka hanya-baca" memungkinkan Anda melihatnya dan mengubah apa pun yang Anda suka, tanpa dapat menyimpan di sini. "Putuskan kunci" memungkinkan Anda menyimpan menimpa berkas ini; pekerjaan mereka yang belum tersimpan tidak hilang, tetapi mereka tidak akan bisa lagi menyimpannya di sini, dan seseorang mungkin harus menggabungkan keduanya secara manual.';
$ec_lang['lpn_lock_ask']='Tanya';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Siapa yang harus kami katakan sedang bertanya? Inisial Anda adalah pilihan yang ideal. Ini disimpan bersama kunci berkas ini di server kami, untuk siapa pun yang sedang membukanya, dan dihapus dalam waktu 30 hari.';
$ec_lang['lpn_lock_ask_sent']='Kami telah meminta siapa pun yang sedang membuka berkas ini untuk menutupnya. Mereka akan melihatnya dalam waktu satu menit, jika halaman mereka masih terbuka. Tidak ada hal lain yang berubah, dan berkas ini masih milik mereka sampai mereka menutupnya.';
$ec_lang['lpn_lock_ask_failed']='Pesan Anda tidak dapat dikirim. Entah tidak ada yang sedang membuka berkas ini sekarang, atau server tidak dapat dihubungi.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Berkas itu tidak dibuka, dan tidak ada yang berubah di sini. Orang lain masih membukanya.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} ingin menyunting berkas ini. Ketika Anda siap, simpan pekerjaan Anda dan gunakan Berkas, Tutup untuk menyerahkannya.';
$ec_lang['lpn_ago_seconds']='{n} detik';
$ec_lang['lpn_ago_minutes']='{n} menit';
$ec_lang['lpn_ago_hours']='{n} jam';
$ec_lang['lpn_ago_days']='{n} hari';
$ec_lang['lpn_ago_unknown']='waktu yang tidak diketahui';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Pesan';
$ec_lang['lpn_msglog_heading']='Pesan terbaru';
$ec_lang['lpn_msglog_empty']='Belum ada pesan.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} yang lalu';
$ec_lang['lpn_msglog_note']='Terbaru di atas. Halaman ini menyimpan {n} pesan terakhir selama masih terbuka, dan tidak ada yang disimpan di komputer Anda.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Hanya-baca: {name} sedang membuka berkas ini. Anda dapat mengubah apa pun yang Anda mau di sini, tetapi tidak dapat menyimpan. Gunakan File, Simpan sebagai untuk menyimpan ke berkas lain.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Perhatian: tidak dapat menghubungi server untuk memeriksa atau membuat kunci pada proyek ini, sehingga tidak ada yang mencegah rekan kerja menyunting berkas yang sama pada saat bersamaan. Anda akan diberi tahu jika penguncian mulai berfungsi kembali.';
$ec_lang['lpn_lock_storage_error']='Perhatian: situs ini tidak dapat menyimpan catatan kunci, sehingga tidak ada yang mencegah rekan kerja menyunting berkas yang sama pada saat bersamaan. Ini kesalahan pengaturan pada server, bukan sesuatu yang dapat Anda perbaiki di sini — folder kunci tidak dapat ditulisi oleh server web.';
$ec_lang['lpn_lock_full_error']='Perhatian: situs ini kehabisan ruang untuk mencatat siapa membuka proyek yang mana, sehingga tidak ada yang mencegah rekan kerja menyunting berkas yang sama pada saat bersamaan. Ini kesalahan pengaturan pada server, bukan sesuatu yang dapat Anda perbaiki di sini.';
$ec_lang['lpn_lock_not_asked']='Penguncian tidak berjalan untuk proyek ini, sehingga tidak ada yang mencegah rekan kerja menyunting berkas yang sama pada saat bersamaan. Proyek ini belum memiliki pengenal, dan menyimpannya ke berkas akan memberikannya satu.';
$ec_lang['lpn_lock_restored']='Penguncian berfungsi kembali, dan berkas ini kini milik Anda untuk disimpan.';
$ec_lang['lpn_lock_dismiss']='Sembunyikan pesan ini';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Proyek Anda akan disimpan dalam sebuah berkas di komputer ini. Berkas itu disimpan saat Anda memintanya, dan tidak pada saat lain, sehingga tidak ada yang ditulis ke berkas itu tanpa sepengetahuan Anda.';
$ec_lang['lpn_file_training_2']='Agar dua orang tidak pernah menyunting satu berkas pada saat bersamaan, situs ini mencatat siapa yang sedang membukanya. Jika sudah ada yang membukanya, Anda tetap dapat membukanya untuk melihat, atau menyimpan salinan Anda sendiri.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='Saat pertama kali Anda menyimpan, peramban Anda akan menanyakan apakah situs ini boleh menyunting berkas tersebut. Pertanyaan itu berasal dari peramban, bukan dari kami, dan menjawab ya adalah yang memungkinkan Simpan menuliskan kembali pekerjaan Anda. Pertanyaan ini biasanya hanya ditanyakan sekali untuk setiap berkas.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Lanjutkan';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Pilih berkas itu lagi';
$ec_lang['lpn_file_reconnect']='Sambungkan kembali ke berkas ini';
$ec_lang['lpn_file_reconnect_alert']='Proyek ini berasal dari {file}. Peramban Anda memerlukan izin Anda lagi sebelum dapat menulis ke berkas itu. Sambungkan kembali di bawah ini.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Itu adalah berkas yang sama yang sedang dibuka orang lain, sehingga tidak dapat ditimpa. Pilih berkas lain atau nama lain.';
$ec_lang['lpn_saveas_overwrites_project']='Berkas itu sudah berisi proyek lain, {name}. Menyimpan di sini akan menggantinya sepenuhnya. Lanjutkan?';
$ec_lang['lpn_saveas_overwrites_newer']='Berkas itu telah berubah sejak terakhir Anda melihatnya, sehingga hampir pasti orang lain telah menyimpan ke berkas tersebut. Menyimpan di sini akan mengganti versi mereka dengan versi Anda. Lanjutkan?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Nama untuk proyek ini';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='Menutup {closed}. Kini menampilkan {opened}.';
$ec_lang['lpn_status_closed_empty']='Menutup {closed}. Memulai proyek kosong baru.';
$ec_lang['lpn_storage_full']='Tidak tersimpan. Penyimpanan peramban penuh atau tidak tersedia, sehingga perubahan terbaru Anda akan hilang saat Anda menutup tab ini.';
$ec_lang['lpn_storage_unreadable']='Tidak tersimpan. Proyek ini tidak dapat dibaca dari penyimpanan peramban. Salinan tersimpannya dibiarkan persis seperti apa adanya dan tidak akan ditimpa, sehingga tidak ada yang sedang disimpan pada tab ini. Buka berkas atau buat proyek baru untuk terus bekerja.';
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
$ec_lang['lpn_about_credits']='Kredit';
$ec_lang['lpn_help_welcome']='Halaman sambutan';
$ec_lang['lpn_about_license']='Dilisensikan di bawah GNU General Public License v3.0 atau versi setelahnya.';
$ec_lang['lpn_notes_1_term']='Bagaimana ini diselesaikan';
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
$ec_lang['lpn_notes_1_def']='Penyelesai EPANET yang menghitung jaringan ini. Atur Total waktu berjalan dan setiap langkah pelaporan akan dihitung secara berurutan: tangki terisi dan mengosong, kebutuhan mengikuti polanya, dan bilah alat memutar ulang prosesnya.';
$ec_lang['lpn_notes_2_term']='Yang tidak dilakukannya';
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
$ec_lang['lpn_notes_2_def']='Kualitas air dimodelkan: usia air, penelusuran sumber, dan bahan kimia yang bereaksi di dinding pipa maupun di badan air. Lonjakan tekanan (surge) dan pukulan air (water hammer) tidak dimodelkan: setiap hasil di sini berlaku untuk air yang sudah mengalir secara mantap, bukan untuk gelombang tekanan saat katup menutup mendadak.';
$ec_lang['lpn_notes_3_term']='Menyimpan proyek';
$ec_lang['lpn_notes_3_def']='Setiap proyek adalah sebuah tab, dan setiap tab disimpan di peramban ini saat Anda bekerja. Membersihkan data peramban Anda akan menghapus semuanya, jadi simpan pekerjaan Anda ke berkas: File, Simpan sebagai. Tanda bintang pada tab berarti tab itu berisi perubahan yang belum ada di berkas. Tidak ada yang pernah ditulis ke berkas kecuali Anda memintanya. Pada sebagian peramban, sebuah proyek tersambung ke berkas yang Anda simpan, dan File, Simpan sejak itu menulis kembali ke berkas yang sama itu; pada peramban lain sambungan tidak dimungkinkan, sehingga Simpan dinonaktifkan dan hanya Simpan sebagai yang tersedia. Ketika berkas proyek disimpan di drive bersama, halaman ini memberi tahu Anda jika rekan kerja sudah membukanya, sehingga dua orang tidak saling menimpa pekerjaan.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Kurva pompa';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Pompa mengikuti H = H₀ − aQ^b, dengan H adalah tinggi tekan yang ditambahkan pompa dan Q adalah debit yang melaluinya. Masukkan satu, dua, atau tiga titik dari kurva pabrikan. Tiga titik — tinggi tekan pada debit nol, titik kerja normal, dan titik debit tertinggi — mencocokkan H₀, a, dan b secara langsung, dan mengikuti kurva yang diterbitkan paling dekat. Dua titik mencocokkan sebuah parabola (b = 2) dengan puncaknya pada debit nol. Satu titik menggunakan aturan umum: tinggi tekan pada debit nol adalah 1,33 × tinggi tekan yang Anda masukkan, dan debit tertinggi adalah 2 × debit yang Anda masukkan, yang kembali menghasilkan b = 2. Pompa tanpa titik yang dimasukkan tidak menambahkan tinggi tekan sama sekali. Kurva ini tidak dipotong pada titik tinggi tekan mencapai nol, sehingga meminta pompa mengalirkan debit lebih besar daripada yang dapat diberikan kurvanya menghasilkan tinggi tekan negatif. Solusinya adalah pompa yang lebih besar atau kebutuhan yang lebih kecil, bukan pencocokan kurva yang berbeda. Sebuah kurva dapat memuat lebih dari tiga titik, dan setiap titik yang Anda masukkan akan dibaca.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='Juga di halaman ini';
$ec_lang['lpn_notes_4_def']='Proyek dapat ditempatkan di atas tanah sebenarnya dengan peta jalan di belakangnya. Berkas EPANET .inp dapat dibaca dan ditulis. Panel bawah menggambar profil di sepanjang rute dan mendaftar simpul-simpulnya. Elemen dapat diwarnai berdasarkan hasilnya, dan Cari dan ganti memilih setiap elemen yang memenuhi kondisi yang Anda tetapkan.';
$ec_lang['lpn_notes_6_term']='Bantuan kolom tabel';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Pilih kolom</td><td>Klik judul kolom</td></tr><tr><td>Tambah atau perluas pilihan kolom</td><td>Ctrl+klik atau Shift+klik judul kolom lain</td></tr><tr><td>Pindahkan (urutkan ulang) kolom yang dipilih</td><td>Seret, atau gunakan Kelola kolom… pada menu klik-kanan atau menu ⋮</td></tr><tr><td>Menu ⋮ dan panah urutan.</td><td>Arahkan kursor ke sudut atas judul kolom, atau pilih atau Tab ke judul kolom</td></tr><tr><td>Sembunyikan, Tampilkan semua, atau Kelola visibilitas dan urutan</td><td>Klik-kanan judul kolom atau menu ⋮ di sudut kanan atas judul kolom</td></tr><tr><td>Urutkan berdasarkan kolom</td><td>Ikon panah di sudut kanan atas judul kolom</td></tr><tr><td>Tempel sebagai baris baru di akhir tabel</td><td>Klik-kanan, menu ⋮ di sudut kanan atas judul kolom, atau Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Pintasan keyboard tabel';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Tombol panah</td><td>Navigasi.</td></tr><tr><td>Tab, Enter</td><td>Selesaikan entri dan berpindah satu sel ke samping / ke bawah.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Navigasi mundur.</td></tr><tr><td>Shift+tombol panah</td><td>Perluas pilihan.</td></tr><tr><td>Ctrl+C</td><td>Salin pilihan.</td></tr><tr><td>Ctrl+D</td><td>Isi pilihan ke bawah mulai dari baris paling atas.</td></tr><tr><td>Ctrl+Enter</td><td>Isi pilihan dengan nilai sel aktif.</td></tr><tr><td>Ctrl+A</td><td>Pilih seluruh tabel.</td></tr><tr><td>Ctrl+Shift+V</td><td>Tempel sebagai baris baru di akhir tabel.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Beralih ke tab berikutnya atau sebelumnya, baik tabel maupun grafik.</td></tr><tr><td>Delete</td><td>Kosongkan sel.</td></tr><tr><td>F2</td><td>Buka sel untuk menyuntingnya.</td></tr><tr><td>Esc</td><td>Batalkan penyuntingan.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Batas pita warna tetap sama';
$ec_lang['lpn_notes_color_def']='Batas pita warna ditetapkan saat Anda memilih Pembagian rentang. Batas ini tidak ditetapkan ulang pada setiap langkah waktu, karena itu akan membuat warna berarti sesuatu yang baru di setiap langkah, dan itu tidak membantu untuk memvisualisasikan sistem Anda. EPANET bekerja dengan cara yang sama. Untuk mendapatkan batas baru, pilih metode lagi atau ketik batas Anda sendiri.';
$ec_lang['lpn_notes_epanet_term']='Konstanta Hazen-Williams disesuaikan dengan EPANET';
$ec_lang['lpn_notes_epanet_def']='Pada Agustus 2026, koefisien dan eksponen Hazen-Williams diubah agar sesuai dengan EPANET. Hasil kehilangan tinggi tekan berbeda dari versi halaman ini sebelumnya hingga 0.1 persen, yang jauh lebih kecil daripada ketidakpastian pada nilai C itu sendiri.';
$ec_lang['lpn_notes_engine_term']='EPANET mana yang dijalankan halaman ini';
$ec_lang['lpn_notes_engine_def']='Penyelesai EPANET pada halaman ini adalah OWA-EPANET 2.3.5, dirilis 20 Februari 2025. EPANET dikembangkan oleh Open Water Analytics, sebuah komunitas yang bekerja sama dengan Badan Perlindungan Lingkungan Amerika Serikat (EPA), yang merilis versi 2.2.0 pada Desember 2019. Laporan proses menyebutnya 2.3.05 karena mesin ini menulis angka terakhir dalam dua digit. Ia mencapai halaman ini melalui epanet-js 0.9.0 oleh Luke Butler, di bawah lisensi MIT, dan berjalan di dalam peramban Anda: jaringan Anda tidak pernah dikirim ke mana pun untuk diselesaikan.';
$ec_lang['lpn_id_invalid']='Masukkan ID tanpa spasi dan tanpa tanda kutip.';
$ec_lang['lpn_id_taken']='ID itu sudah digunakan.';
$ec_lang['lpn_diag_no_fixed_head']='Tambahkan reservoir atau tangki. Jaringan memerlukan setidaknya satu muka air yang diketahui sebelum dapat diselesaikan.';
$ec_lang['lpn_diag_dangling_link']='Sebuah pipa atau pompa tersambung ke simpul yang sudah tidak ada:';
$ec_lang['lpn_diag_unreachable']='Simpul-simpul ini tidak memiliki jalur ke reservoir:';
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
$ec_lang['lpn_engine_fetching']='Mengambil penyelesai EPANET. Ini diunduh sekali lalu disimpan di perangkat ini, sehingga berfungsi luring setelahnya.';
$ec_lang['lpn_engine_ready']='Penyelesai EPANET kini ada di perangkat ini, dan berfungsi luring.';
$ec_lang['lpn_engine_fetching_valve']='Mengambil penyelesai EPANET, agar katup ini dapat diselesaikan sekarang dan secara luring nanti.';
$ec_lang['lpn_engine_ready_valve']='Penyelesai EPANET kini ada di perangkat ini. Katup yang membuka dan menutup sendiri akan berfungsi secara luring.';
$ec_lang['lpn_engine_unavailable']='Penyelesai EPANET tidak dapat diambil. Inilah yang menyelesaikan katup yang membuka dan menutup sendiri. Sambungkan ke internet sekali, dan penyelesai ini akan disimpan di perangkat ini sejak saat itu.';
$ec_lang['lpn_engine_needed_loading']='Memuat penyelesai EPANET saat Anda membangun. Hasil akan tersedia setelah selesai dimuat sepenuhnya.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Kemajuan pemuatan penyelesai';
$ec_lang['lpn_engine_wait']='Memuat penyelesai. Hasil tertunda sesaat. Lanjutkan bekerja.';
$ec_lang['lpn_engine_wait_pct']='Penyelesai dimuat {percent}%.';
$ec_lang['lpn_engine_wait_bytes']='Penyelesai telah memuat {kb} KB sejauh ini. Total tidak tersedia, sehingga persentase penyelesaiannya tidak diketahui.';
$ec_lang['lpn_engine_needed_failed']='Penyelesai EPANET belum dimuat, tidak dapat dimuat, dan jaringan ini hanya dapat diselesaikan olehnya. Penyelesai ini akan dimuat saat Anda tersambung ke internet.';
$ec_lang['lpn_diag_valve_needs_epanet']='Katup-katup ini membuka dan menutup sendiri, dan hanya penyelesai EPANET yang dapat menghitungnya. Penyelesai EPANET tidak dapat dimuat, sehingga hasil berikut tidak tersedia:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Katup-katup ini tersambung langsung ke reservoir atau tangki, yang sudah menetapkan muka air di sana, sehingga tidak ada lagi yang dapat dikendalikan katup. Pasang pipa pendek di antara katup dan reservoir atau tangki:';
$ec_lang['lpn_diag_not_converged']='Tidak ditemukan solusi. Periksa apakah ada nilai yang tidak mungkin terjadi di dunia nyata, seperti diameter nol.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Penyelesaian ini tidak konvergen. Angka-angka ini adalah iterasi terakhir, bukan jawaban. Jangan gunakan angka ini.';
$ec_lang['lpn_diag_not_converged_trials']='Berhenti setelah {iterations} iterasi.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Berhenti setelah {iterations} iterasi pada galat relatif {error}, yang belum mencapai pengaturan Akurasi sebesar {accuracy}.';
$ec_lang['lpn_field_roughness']='Kekasaran';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='C Hazen-Williams. Angka yang lebih tinggi berarti pipa yang lebih halus: sekitar 150 untuk plastik baru, 130 untuk baja atau besi baru, dan 100 untuk pipa lama.';
$ec_lang['lpn_field_length']='Panjang';
$ec_lang['lpn_field_from']='Dari';
$ec_lang['lpn_field_to']='Ke';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Jenis katup';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Apa yang dilakukan katup ini. Katup throttle mempertahankan kehilangan tetap. Tiga jenis lainnya mempertahankan tekanan atau debit, dan membuka penuh, menutup, atau menutup sebagian seiring perubahan air. Mengganti jenis katup memberikan angka awal baru pada pengaturan di bawah, karena tekanan bukan debit, dan keduanya bukan koefisien kehilangan.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Throttle (TCV)';
$ec_lang['lpn_valve_type_prv']='Penurun tekanan (PRV)';
$ec_lang['lpn_valve_type_psv']='Penopang tekanan (PSV)';
$ec_lang['lpn_valve_type_fcv']='Pengendali debit (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Pemecah tekanan (PBV)';
$ec_lang['lpn_valve_type_gpv']='Serbaguna (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Penurunan tekanan';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='Tekanan yang dihilangkan oleh katup. Katup pemecah tekanan selalu menghilangkan tekanan sebesar ini, ke arah mana pun air mengalir. Ini adalah penurunan tekanan melintasi katup, bukan tekanan yang dipertahankan.';
$ec_lang['lpn_inp_drop_gpv_curve']='Katup ini merujuk pada kurva kehilangan tinggi tekan yang tidak ada dalam berkas. Katup ini masuk tanpa kurva, sehingga tetap terbuka penuh sampai Anda memberinya kurva.';
$ec_lang['lpn_gpv_curve_source']='Kurva kehilangan tinggi tekan katup';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Kurva di kotak Pustaka yang menyatakan berapa tinggi tekan yang hilang pada katup ini di setiap debit. Beberapa katup dapat menggunakan kurva yang sama, dan mengubahnya di sana mengubah semuanya. Katup ini hanya menyimpan rujukannya; titik-titiknya sendiri dibaca dan diubah di bawah Pustaka, Kurva.';
$ec_lang['lpn_field_valve_setting_pressure']='Pengaturan tekanan';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Tekanan yang dipertahankan katup. Katup penurun tekanan mempertahankan tekanan di sisi hilirnya pada atau di bawah nilai ini. Katup penopang tekanan mempertahankan tekanan di sisi hulunya pada atau di atas nilai ini.';
$ec_lang['lpn_field_valve_setting_flow']='Pengaturan debit';
$ec_lang['lpn_field_valve_setting_flow_tip']='Debit maksimum yang diloloskan katup. Ketika air yang ingin lewat kurang dari nilai ini, katup tetap terbuka penuh dan tidak menambah kehilangan.';
$ec_lang['lpn_field_valve_setting']='Pengaturan';
$ec_lang['lpn_field_valve_setting_loss']='Koefisien kehilangan';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Berapa banyak tinggi tekan yang dihilangkan katup throttle, dihitung sebagai kelipatan tinggi kecepatan. Gunakan 0 untuk katup yang terbuka penuh. Satu angka ini adalah seluruh kehilangan katup throttle.';
$ec_lang['lpn_field_valve_diameter_tip']='Lebar bukaan pada katup. Kecepatan air yang melalui katup dihitung dari lebar ini, dan kehilangan mengikuti dari kecepatan tersebut.';
$ec_lang['lpn_field_valve_km_tip']='Kehilangan dari badan katup saat katup terbuka penuh, di luar kehilangan yang dihasilkan oleh pengaturan katup. Dihitung sebagai kelipatan tinggi kecepatan. Gunakan 0 untuk mengabaikannya.';
$ec_lang['lpn_field_km']='Koefisien kehilangan lokal, k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Kehilangan lokal, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Kurva tinggi tekan pompa';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Kurva di kotak Pustaka yang menyatakan berapa tinggi tekan yang ditambahkan pompa ini di setiap debit. Beberapa pompa dapat menggunakan kurva yang sama, dan mengubahnya di sana mengubah semuanya. Pompa ini hanya menyimpan rujukannya; titik-titiknya sendiri dibaca dan diubah di bawah Pustaka, Kurva.';
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
$ec_lang['lpn_field_desc']='Deskripsi';
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
$ec_lang['lpn_field_tag_tip']='Tag dapat memiliki arti apa pun sesuai kebutuhan Anda, misalnya zona tekanan atau surat perintah kerja. Tidak ada perhitungan di sini maupun di EPANET yang membacanya. Tag hanya satu kata: EPANET berhenti membaca pada spasi pertama, sehingga spasi ditolak saat Anda mengetiknya. Tag ini dibawa masuk dan keluar dari berkas EPANET.';
$ec_lang['lpn_pump_effic_curve']='Kurva efisiensi pompa';
$ec_lang['lpn_pump_effic_curve_tip']='Kurva di kotak Pustaka yang menyatakan seberapa efisien pompa ini di setiap debit. Beberapa pompa dapat menggunakan kurva yang sama, dan mengubahnya di sana mengubah semuanya. Pompa ini hanya menyimpan rujukannya; titik-titiknya sendiri dibaca dan diubah di bawah Pustaka, Kurva.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Tidak ada kurva yang dipilih';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Kurva';
$ec_lang['lpn_curve_library_link_tip']='Membuka kotak Pustaka pada bagian Kurva, tempat sebuah kurva ditambahkan, dideskripsikan, diubah, dan dihapus. Setiap elemen menyatakan kurva mana yang digunakannya.';
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
$ec_lang['lpn_curve_kind_head']='Tinggi tekan pompa';
$ec_lang['lpn_curve_kind_effic']='Efisiensi pompa';
$ec_lang['lpn_curve_kind_volume']='Volume tangki';
$ec_lang['lpn_curve_kind_headloss']='Kehilangan tinggi tekan katup';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Jenis tidak dinyatakan';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Vol.';
$ec_lang['lpn_pump_effic_col']='Efisiensi';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Pompa ini tidak memiliki kurva efisiensi yang dipilih, sehingga berjalan pada efisiensi yang ditetapkan untuk seluruh jaringan, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Pompa ini merujuk pada kurva efisiensi bernama {name}, yang tidak didefinisikan di mana pun dalam proyek ini, sehingga berjalan pada efisiensi yang ditetapkan untuk seluruh jaringan, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Mode: Pilih. Klik sebuah elemen atau label untuk melihat atau mengubahnya. Seret untuk memindahkan simpul atau label. Gunakan alat Verteks untuk menambah atau menghapus tekukan pada pipa.';
$ec_lang['lpn_mode_delete']='Mode: Hapus. Klik sebuah elemen untuk menghapusnya.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Mode: Verteks. Verteks setiap pipa ditampilkan sebagai gagang kotak kecil. Klik pipa untuk menambah verteks, klik gagang untuk menghapusnya, atau seret gagang untuk memindahkannya. Tidak ada yang lain di peta yang berubah dalam mode ini.';
$ec_lang['lpn_mode_zoom_window']='Mode: Perbesar Jendela. Klik dua sudut yang berseberangan dari sebuah kotak, atau seret salah satu sudutnya, pada peta untuk memperbesar tampilan ke area itu.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Tidak ada yang dipilih. Klik sebuah elemen di peta terlebih dahulu, lalu tekan Hapus.';
$ec_lang['lpn_mode_add_junction']='Mode: Tambah Simpul. Klik peta untuk menempatkan simpul. Beralih ke mode Pilih untuk mengubah atau memindahkan elemen dan label.';
$ec_lang['lpn_mode_add_reservoir']='Mode: Tambah Reservoir. Klik peta untuk menempatkan reservoir. Beralih ke mode Pilih untuk mengubah atau memindahkan elemen dan label.';
$ec_lang['lpn_mode_add_tank']='Mode: Tambah Tangki. Klik peta untuk menempatkan tangki. Beralih ke mode Pilih untuk mengubah atau memindahkan elemen dan label.';
$ec_lang['lpn_mode_add_pipe']='Mode: Tambah Pipa. Klik satu simpul, lalu simpul lainnya, untuk menyambungkannya. Klik ruang kosong di antaranya untuk menekuk garis, atau tekan Escape untuk memulai ulang. Beralih ke mode Pilih untuk mengubah atau memindahkan elemen dan label.';
$ec_lang['lpn_mode_add_pump']='Mode: Tambah Pompa. Klik satu simpul, lalu simpul lainnya, untuk menyambungkannya. Klik ruang kosong di antaranya untuk menekuk garis, atau tekan Escape untuk memulai ulang. Beralih ke mode Pilih untuk mengubah atau memindahkan elemen dan label.';
$ec_lang['lpn_mode_add_valve']='Mode: Tambah Katup. Klik satu simpul, lalu simpul lainnya, untuk menghubungkannya. Klik ruang kosong di antaranya untuk menekuk garis, atau tekan Escape untuk memulai ulang. Beralih ke mode Pilih untuk mengubah atau memindahkan elemen dan label.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Mode: Tambah Teks. Klik peta untuk menempatkan Teks. Klik di dekat simpul untuk melampirkan Teks ke simpul itu. Beralih ke mode Pilih untuk mengubah atau memindahkan elemen dan label.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Gunakan mode ini untuk mengubah, memindahkan, dan menyeret elemen di peta. Ini adalah mode yang menjadi default halaman ini: halaman kembali ke sini dengan sendirinya setelah tindakan tertentu, seperti membuka proyek. Menekan Esc kedua kalinya akan membatalkan pilihan apa pun yang sedang dipilih.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Otomatis';
$ec_lang['lpn_method_switch_confirm']='Mengganti metode gesekan tidak mengubah angka kekasaran yang sudah dimasukkan pada pipa Anda, dan kekasaran untuk satu metode tidak bermakna untuk metode lain. Periksa setiap pipa setelah ini. Tetap ganti?';
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
$ec_lang['lpn_field_closed']='Tertutup';
$ec_lang['lpn_field_closed_tip']='Tutup pipa ini sehingga tidak ada air yang dapat melewatinya. Pipa tetap berada di peta dan menyimpan semua angkanya, dan Anda dapat membukanya kembali kapan saja.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Bujur';
$ec_lang['lpn_field_lat']='Lintang';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Utara';
$ec_lang['lpn_field_easting']='Timur';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='U';
$ec_lang['lpn_field_easting_abbr']='T';
$ec_lang['lpn_field_lat_abbr']='Lint';
$ec_lang['lpn_field_lon_abbr']='Buj';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.


// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Ketik lokasi koordinat untuk menempatkan simpul ini secara tepat. Dalam sebuah skenario, lokasi ini berlaku hanya pada skenario itu saja, sama seperti menyeretnya; dalam Dasar, ini menempatkan simpul itu di mana pun.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Itu berada di luar peta. Lintang Pseudo Mercator berkisar dari -85,05 hingga 85,05 dan bujur berkisar dari -180 hingga 180.';
$ec_lang['lpn_field_text_size']='Pengali ukuran';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Tampilkan di semua tingkat pembesaran';
$ec_lang['lpn_field_text_all_zoom_tip']='Simpan teks ini pada gambar seberapa pun jauh Anda memperkecil tampilan. Hapus centang dan teks ini akan tersembunyi bersama label lain begitu tampilan lebih lebar daripada ambang pelabelan yang diatur di bawah Peta dan halaman.';
$ec_lang['lpn_tool_labels']='Label';
$ec_lang['lpn_labels_heading_node']='Label simpul';
$ec_lang['lpn_labels_heading_link']='Label penghubung';
$ec_lang['lpn_labels_mark_extrema']='Tandai nilai tertinggi dan terendah';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Menggambar garis di atas nilai tertinggi setiap properti berlabel di peta (garis atas), dan garis di bawah nilai terendah properti tersebut (garis bawah).';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Terapkan ke semua';
$ec_lang['lpn_settings_apply_to_all_tip']='Setiap elemen sejenis yang sudah digambar mendapat ID yang diawali dengan teks ini. Setiap elemen tetap memiliki nomornya. ID yang tidak diakhiri angka dibiarkan apa adanya.';
$ec_lang['lpn_confirm_apply_prefix']='Ganti nama {n} elemen agar ID-nya dimulai dengan {prefix}? Setiap elemen tetap memiliki nomornya.';
$ec_lang['lpn_prefix_applied']='Mengganti nama {n} elemen. {skipped} lainnya dibiarkan apa adanya.';
$ec_lang['lpn_labels_suffix_gradient_tip']='Teks yang ditambahkan setelah gradien kehilangan tinggi tekan pada label peta. Jangan ketik tanda persen di sini. Tanda ini ditambahkan secara otomatis saat satuannya persen.';
$ec_lang['lpn_labels_separator']='Teks di antara nilai';
$ec_lang['lpn_labels_separator_tip']='Teks di antara satu properti dan properti berikutnya pada label. Secara default berupa spasi.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Prioritas';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='Urutan properti yang dihilangkan ketika dua label simpul akan tumpang tindih. Properti bernomor 1 dihilangkan lebih dulu, pada kedua label. Ketika hanya tersisa satu properti dan keduanya masih tumpang tindih, seluruh label disembunyikan: label yang nilai sisanya paling kurang layak ditampilkan, yaitu kebutuhan terendah, tekanan yang paling dekat ke tengah rentang, atau elevasi maupun tinggi tekan yang paling dekat dengan simpul-simpul tetangganya.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Sebelum';
$ec_lang['lpn_labels_col_after']='Setelah';
$ec_lang['lpn_labels_col_decimals']='Desimal';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Tampilkan';
$ec_lang['lpn_labels_show_tip']='Urutan nilai muncul pada sebuah label. Nilai bernomor 1 muncul lebih dulu: di bagian atas label bertumpuk, dan di awal label satu baris.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Gunakan satuan';
$ec_lang['lpn_labels_use_units_tip']='Centang untuk menampilkan satuan pada kotak Setelah dan pada label, serta menjaganya tetap sinkron ketika satuan berubah. Hapus centang untuk mengetik teks Setelah Anda sendiri.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Status awal';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Warna simpul';
$ec_lang['lpn_settings_sym_link_colors']='Warna penghubung';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Gambar latar…';
$ec_lang['lpn_backdrop_add']='Tambah';
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
$ec_lang['lpn_backdrop_scale']='Skalakan dengan memilih';
$ec_lang['lpn_backdrop_scale_entry']='Skalakan dari world file atau ukuran satu piksel di peta';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Skalakan dari ukuran saat ini, di sekitar titik yang Anda pilih';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Klik titik pada gambar latar yang harus tetap berada di tempatnya.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Skalakan dari ukurannya saat ini. 1 membuatnya tetap sama, 1.1 membuatnya 10% lebih besar, 0.9 membuatnya 10% lebih kecil.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Masukkan ukuran satu piksel di peta, atau tempel seluruh isi world file untuk gambar ini';
$ec_lang['lpn_backdrop_scale_entry_bad']='Ketik satu angka untuk ukuran satu piksel di peta, atau tempel keenam baris world file.';
$ec_lang['lpn_backdrop_wld_bad']='World file ini memutar, mencerminkan, atau meregangkan gambar secara tidak merata. Peta hanya dapat memindahkan gambar dan mengubah ukurannya dengan jumlah yang sama di kedua arah, sehingga file ini tidak digunakan.';
$ec_lang['lpn_backdrop_unreadable']='Peramban Anda tidak dapat menampilkan gambar ini. Simpan gambar sebagai PNG atau JPEG lalu tambahkan lagi.';
$ec_lang['lpn_backdrop_position']='Pindahkan';
$ec_lang['lpn_backdrop_remove']='Hapus';
$ec_lang['lpn_backdrop_remove_confirm']='Hapus gambar latar ini?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Peta dunia…';
$ec_lang['lpn_map_attach_tip']='Lampirkan peta dunia ke proyek ini tanpa mengubahnya dengan cara lain.';
$ec_lang['lpn_map_attach_add']='Lampirkan';
$ec_lang['lpn_map_attach_readjust']='Sesuaikan ulang';
$ec_lang['lpn_map_attach_readjust_tip']='Kembali ke Langkah 2 dari proses pelampiran peta.';
$ec_lang['lpn_map_attach_scale_from']='Skalakan dari ukuran saat ini…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Skalakan peta dari ukurannya saat ini, di sekitar tengah gambar Anda. 1 membuatnya tetap sama, 1,1 membuatnya 10% lebih besar, 0,9 membuatnya 10% lebih kecil.';
$ec_lang['lpn_map_attach_scale_from_bad']='Ketik satu angka yang lebih besar dari nol.';
$ec_lang['lpn_map_attach_scale_from_done']='Peta telah diubah ukurannya, dan gambar Anda beserta setiap koordinat di dalamnya persis seperti semula.';
$ec_lang['lpn_map_attach_none']='Belum ada peta dunia yang dilampirkan ke proyek ini. Gunakan Peta, Peta dunia, Lampirkan terlebih dahulu.';
$ec_lang['lpn_map_attach_remove']='Lepaskan';
$ec_lang['lpn_map_attach_remove_tip']='Hilangkan peta dunia. Gambar dan koordinatnya tidak berubah dengan cara apa pun.';
$ec_lang['lpn_map_attach_done']='Peta dunia kini berada di belakang gambar Anda, dan proyek Anda tidak berubah. Gunakan Peta, Peta dunia, Lepaskan untuk menghilangkannya lagi.';
$ec_lang['lpn_map_attach_removed']='Peta dunia telah hilang, dan gambar tetap persis seperti semula.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Gambar Anda berada pada peta seluruh dunia, di lautan pada lintang nol dan bujur nol. Temukan lokasi Anda terlebih dahulu: geser dan perbesar peta di belakang gambar, cari nama tempat, atau ketik lintang dan bujur. Gambar itu sendiri tidak berpindah.';
$ec_lang['lpn_mapgeo_step1']='Langkah 1 dari 2: temukan lokasi Anda di dunia';
$ec_lang['lpn_mapgeo_step2']='Langkah 2 dari 2: sesuaikan peta di belakang gambar Anda';
$ec_lang['lpn_mapgeo_hint1']='Geser dan perbesar peta di belakang gambar Anda, atau cari tempat, atau ketik lintang dan bujur. Lalu tekan Letakkan secara perkiraan.';
$ec_lang['lpn_mapgeo_readjust_intro']='Gambar Anda berada di tempat terakhir Anda meletakkannya. Untuk memindahkannya ke tempat lain, geser dan perbesar peta di belakang gambar, cari nama tempat, atau ketik lintang dan bujur. Gambar itu sendiri tidak berpindah.';
$ec_lang['lpn_mapgeo_hint2']='Seret di mana saja untuk menggeser peta di bawah gambar Anda. Gambar Anda beserta setiap koordinat di dalamnya tetap persis di tempatnya. Tekan Georeferensikan di sini ketika peta sudah tepat.';
$ec_lang['lpn_mapgeo_gestures']='Memperbesar/memperkecil menggerakkan gambar dan peta bersama-sama, sehingga Anda dapat melihat seberapa selaras keduanya. Menyeret hanya menggerakkan peta.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Putar peta';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} derajat';
$ec_lang['lpn_mapgeo_dial_size']='Ukuran peta';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} kali';
$ec_lang['lpn_mapgeo_dial_help']='Geser kedua bilah ini, atau ketik pada kotak di atasnya, untuk membuat peta lebih besar atau lebih kecil dan untuk memutarnya. Bagian tengah setiap bilah adalah hasil Langkah 1 yang ditinggalkan, sehingga 1 dan 0 berarti dibiarkan apa adanya. Tombol panah berfungsi pada keduanya.';
$ec_lang['lpn_mapgeo_place']='Letakkan secara perkiraan';
$ec_lang['lpn_mapgeo_finish']='Georeferensikan di sini';
$ec_lang['lpn_mapgeo_cancelled']='Peta dunia kembali ke tempatnya semula, dan gambar Anda tidak pernah berpindah.';
$ec_lang['lpn_mapgeo_locked']='Selesaikan dengan tombol Georeferensikan di sini, atau tekan Batal, sebelum berpindah proyek atau menyimpan. Peta dunia masih dalam proses penempatan.';
$ec_lang['lpn_backdrop_scale_prompt1']='Klik dua titik pada gambar latar, misalnya kedua ujung skala batang. Kemudian ketik jarak sebenarnya di antara keduanya.';
$ec_lang['lpn_backdrop_scale_prompt2']='Jarak sebenarnya antara kedua titik';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Klik titik dasar (pada gambar) untuk pemindahan ini.';
$ec_lang['lpn_backdrop_position_prompt2']='Pilih metode untuk titik tujuan, lalu klik Lanjutkan.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Menyesuaikan gambar latar.';
$ec_lang['lpn_backdrop_target_label']='Pindahkan titik itu ke:';
$ec_lang['lpn_backdrop_target_node']='Sebuah simpul';
$ec_lang['lpn_backdrop_target_free']='Titik mana pun pada peta';
$ec_lang['lpn_backdrop_target_coords']='Koordinat yang Anda ketik';
$ec_lang['lpn_backdrop_coords_prompt']='Ketik X,Y tujuan pemindahan titik itu';
$ec_lang['lpn_backdrop_continue']='Lanjutkan';
$ec_lang['lpn_tool_settings']='Pengaturan';
$ec_lang['lpn_settings_show_titles']='Tampilkan judul halaman';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Sembunyikan judul-judul ini';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Tampilkan bantuan pemilihan';
$ec_lang['lpn_settings_area_hint_tip']='Menampilkan gelembung di atas peta yang menjelaskan apa yang akan dilakukan oleh klik berikutnya saat Anda memilih area.';
$ec_lang['lpn_settings_id_prefixes']='Awalan ID';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Nilai pembuatan';
$ec_lang['lpn_settings_defaults_note']='Digunakan untuk elemen yang Anda buat mulai sekarang. Elemen yang sudah ada tidak berubah.';
$ec_lang['lpn_settings_push_note']='Hanya properti yang labelnya sedang ditampilkan saat ini yang diterapkan.';
$ec_lang['lpn_settings_push_btn']='Terapkan nilai elemen baru ini ke semua elemen yang sudah ada';
$ec_lang['lpn_push_confirm']='Ganti properti ini pada setiap elemen yang sudah ada dengan nilai yang sekarang ditetapkan untuk elemen baru? Nilai yang telah Anda ketik akan ditimpa. Anda dapat membatalkan tindakan ini.';
$ec_lang['lpn_push_properties']='Properti:';
$ec_lang['lpn_push_assets']='Simpul dan pipa:';
$ec_lang['lpn_push_none_displayed']='Tidak ada nilai awal yang sedang ditampilkan sebagai label saat ini, sehingga tidak ada yang dapat diterapkan. Aktifkan label untuk properti yang Anda inginkan di panel Label, lalu coba lagi.';
$ec_lang['lpn_push_nothing']='Tidak ada elemen yang sudah ada yang memiliki properti yang sedang diterapkan ini.';
$ec_lang['lpn_push_no_change']='Setiap elemen sudah memiliki nilai ini, sehingga tidak ada yang akan berubah.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Properti khusus';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Properti yang Anda tentukan sendiri untuk keperluan Anda sendiri. Properti ini disimpan bersama proyek dan skenario seperti properti lainnya.';
$ec_lang['lpn_cp_design']='Desain';
$ec_lang['lpn_cp_design_tip']='Satu baris untuk setiap properti khusus, dan masing-masing dapat dibuka untuk menampilkan: Kunci, Label, Berlaku untuk, Validasi sebagai, Izinkan atau batasi, kolom karakter yang diberi nama sesuai pilihan itu, Batas bawah panjang, Batas atas panjang, Batas rendah, Batas tinggi.';
$ec_lang['lpn_cp_add']='Tambah properti khusus';
$ec_lang['lpn_cp_add_tip']='Menambahkan baris ke tabel desain dan membukanya untuk diedit.';
$ec_lang['lpn_cp_remove_tip']='Menghapus properti ini dari tabel desain. Nilai yang sudah diketik pada aset Anda tetap disimpan dalam berkas dan akan kembali jika Anda mendesain kunci yang sama lagi.';
$ec_lang['lpn_cp_none']='Belum ada properti khusus yang didesain.';
$ec_lang['lpn_cp_unnamed']='Belum diberi nama';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Kunci';
$ec_lang['lpn_cp_key_tip']='Kunci: Properti disimpan dengan nama ini. Spasi tidak diperbolehkan, dan sebuah awalan ditambahkan secara otomatis sehingga kunci Anda tidak akan pernah bertabrakan dengan kolom bawaan.';
$ec_lang['lpn_cp_label']='Label';
$ec_lang['lpn_cp_label_tip']='Label: Pembaca melihat ini pada kotak properti, di Cari, dan di kepala kolom tabel.';
$ec_lang['lpn_cp_applies']='Berlaku untuk';
$ec_lang['lpn_cp_applies_tip']='Berlaku untuk: Daftar awalan ID yang dipisahkan koma untuk aset yang menggunakan properti ini, seperti J,L,R.';
$ec_lang['lpn_cp_validate']='Validasi sebagai';
$ec_lang['lpn_cp_validate_tip']='Validasi sebagai: Ini menyatakan seperti apa nilai yang baik. Aturan huruf besar/kecil hanya membaca alfabet Inggris, dan ini adalah batasan yang dinyatakan. Pilih Jangan validasi untuk menerima apa pun.';
$ec_lang['lpn_cp_restrict']='Batasi karakter ini';
$ec_lang['lpn_cp_restrict_tip']='Batasi karakter ini: Suatu nilai hanya boleh menggunakan karakter yang tercantum di sini, atau tidak satu pun dari karakter itu, di mana "@" berarti huruf apa pun; "#" berarti digit numerik apa pun, dan Anda harus mencantumkan "-", ".", dan "," secara terpisah jika karakter itu diperbolehkan; dan karakter spasi apa pun harus berada di antara karakter lain.';
$ec_lang['lpn_cp_restrict_mode']='Izinkan atau batasi';
$ec_lang['lpn_cp_restrict_mode_tip']='Izinkan atau batasi: Karakter yang diberikan adalah satu-satunya yang boleh digunakan suatu nilai, atau yang tidak boleh digunakan.';
$ec_lang['lpn_cp_restrict_allow']='Hanya izinkan karakter ini';
$ec_lang['lpn_cp_minlength']='Batas bawah panjang';
$ec_lang['lpn_cp_minlength_tip']='Batas bawah panjang: Entri yang lebih pendek akan ditandai, sehingga Anda dapat menemukan entri yang kosong dan yang setengah diketik.';
$ec_lang['lpn_cp_length']='Batas atas panjang';
$ec_lang['lpn_cp_length_tip']='Batas atas panjang: Entri yang lebih panjang akan ditandai.';
$ec_lang['lpn_cp_low']='Batas rendah';
$ec_lang['lpn_cp_low_tip']='Batas rendah: Ini adalah nilai terkecil yang Anda perkirakan. Angka dibandingkan sebagai angka dan teks dibandingkan menurut urutan kamus.';
$ec_lang['lpn_cp_high']='Batas tinggi';
$ec_lang['lpn_cp_high_tip']='Batas tinggi: Ini adalah nilai terbesar yang Anda perkirakan. Angka dibandingkan sebagai angka dan teks dibandingkan menurut urutan kamus.';
$ec_lang['lpn_cp_val_none']='Jangan validasi';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Angka .';
$ec_lang['lpn_cp_val_number_comma']='Angka ,';
$ec_lang['lpn_cp_val_integer']='Bilangan bulat';
$ec_lang['lpn_cp_val_upper']='HURUF BESAR SEMUA';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Nilai tersebut disimpan persis seperti yang Anda ketik.';
$ec_lang['lpn_cp_bad_number']='Nilai ini bukan angka seperti yang disyaratkan untuk properti ini.';
$ec_lang['lpn_cp_bad_integer']='Nilai ini bukan bilangan bulat seperti yang disyaratkan untuk properti ini.';
$ec_lang['lpn_cp_bad_case']='Nilai ini bukan HURUF BESAR SEMUA seperti yang disyaratkan untuk properti ini.';
$ec_lang['lpn_cp_bad_chars']='Nilai ini menggunakan karakter yang tidak diizinkan oleh properti ini.';
$ec_lang['lpn_cp_bad_space']='Spasi hanya diperbolehkan di antara karakter lain.';
$ec_lang['lpn_cp_bad_minlength']='Nilai ini lebih pendek daripada yang diperbolehkan oleh properti ini.';
$ec_lang['lpn_cp_bad_length']='Nilai ini lebih panjang daripada yang diperbolehkan oleh properti ini.';
$ec_lang['lpn_cp_bad_low']='Nilai ini di bawah batas rendah properti ini.';
$ec_lang['lpn_cp_bad_high']='Nilai ini di atas batas tinggi properti ini.';
$ec_lang['lpn_cp_key_needed']='Berikan properti khusus ini sebuah kunci tanpa spasi.';
$ec_lang['lpn_cp_key_taken']='Properti khusus lain sudah menggunakan kunci itu.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Skenario';
$ec_lang['lpn_scenario_base']='Dasar';
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
$ec_lang['lpn_scenario_overrides']='Jml. nilai sendiri';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Cincin ambar berarti elemen ini menyimpan nilai yang hanya dimiliki oleh skenario {name}.';
$ec_lang['lpn_scenario_overrides_tip']='Setiap nilai tersebut ditandai di peta dengan cincin ambar. Beralih ke {base} untuk melihat gambar tanpa nilai tersebut.';
$ec_lang['lpn_scenario_menu']='Skenario';
$ec_lang['lpn_scenario_tip']='Kumpulan nilai yang sedang ditampilkan pada gambar dan sedang diselesaikan oleh halaman ini. Klik untuk berpindah skenario, atau untuk menambah, mengganti nama, atau menghapus skenario.';
$ec_lang['lpn_scenario_new']='Skenario baru…';
$ec_lang['lpn_scenario_new_name']='Skenario {n}';
$ec_lang['lpn_scenario_prompt_name']='Nama untuk skenario ini';
$ec_lang['lpn_scenario_rename']='Ganti nama skenario…';
$ec_lang['lpn_scenario_delete']='Hapus skenario';
$ec_lang['lpn_scenario_delete_confirm']='Hapus skenario {name}, beserta {n} nilai yang hanya dimiliki skenario ini? Gambar itu sendiri tidak berubah.';
$ec_lang['lpn_scenario_override']='Hanya di skenario ini';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Jika dicentang, skenario ini memiliki entri untuk nilai ini, meskipun angkanya sama dengan Dasar. Hapus centang untuk menggunakan kembali nilai Dasar.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Skenario Dasar: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} berada di luar jaringan pada {scenario}. Elemen ini tetap ada di gambar, dan di skenario Anda yang lain.';
$ec_lang['lpn_scenario_push_btn']='Terapkan nilai Dasar ke semua skenario';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Setiap skenario kembali menggunakan nilai Dasar untuk properti yang labelnya sedang ditampilkan sekarang. Nilai yang dimasukkan untuk properti ini di skenario mana pun akan dibuang.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Jadikan setiap skenario menggunakan nilai Dasar untuk properti ini? Nilai yang dimasukkan untuk properti ini di skenario mana pun akan dibuang. Anda dapat membatalkan tindakan ini.';
$ec_lang['lpn_scenario_push_scenarios']='Skenario yang terpengaruh:';
$ec_lang['lpn_scenario_push_values']='Nilai yang dibuang:';
$ec_lang['lpn_scenario_push_none']='Tidak ada skenario yang memiliki nilai sendiri untuk properti-properti ini, sehingga tidak ada yang berubah. Tidak ada yang dibuang.';
$ec_lang['lpn_scenario_preset_flow_static']='1. Uji aliran: Statis';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Kalibrasi uji aliran untuk jaringan desain pada debit 0. Dalam skenario ini, atur kebutuhan di semua simpul menjadi 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Uji aliran: Menengah';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Kalibrasi uji aliran untuk jaringan desain pada debit pertama yang dilaporkan. Dalam skenario ini, atur kebutuhan di simpul yang mengalirkan air sesuai debit pertama yang diukur, dan kebutuhan di semua simpul lain menjadi 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Uji aliran: Maks';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Kalibrasi uji aliran untuk jaringan desain pada debit maksimum yang dilaporkan. Dalam skenario ini, atur kebutuhan di simpul yang mengalirkan air sesuai debit maksimum yang diukur, dan kebutuhan di semua simpul lain menjadi 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Hari rata-rata';
$ec_lang['lpn_scenario_preset_average_day_tip']='Pengali kebutuhan 1: setiap kebutuhan sesuai yang dimasukkan, yang dianggap sebagai kebutuhan hari rata-rata.';
$ec_lang['lpn_scenario_preset_max_day']='5. Hari puncak';
$ec_lang['lpn_scenario_preset_max_day_tip']='Pengali kebutuhan 2,0 kali hari rata-rata, nilai sementara. Sebagian besar sistem berada di antara 1,2 dan 3,0 (National Research Council, 2006). Atur nilai sistem Anda sendiri di Pengaturan, Perhitungan, Hidrolika, Pengali kebutuhan.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Jam puncak';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='Pengali kebutuhan 3,0 kali hari rata-rata, nilai sementara. Sebagian besar sistem berada di antara 3,0 dan 6,0 (National Research Council, 2006). Atur nilai sistem Anda sendiri di Pengaturan, Perhitungan, Hidrolika, Pengali kebutuhan.';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. Kebakaran ditambah hari puncak';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='Kebutuhan hari puncak (pengali 2,0). Jalankan Analisis debit kebakaran dalam skenario ini: analisis menambahkan debit kebakaran di setiap simpul di atas kebutuhan ini.';
$ec_lang['lpn_delete_drops_overrides']='Menghapus elemen ini juga akan membuang {n} nilai yang dimiliki skenario Anda untuknya. Lanjutkan?';
$ec_lang['lpn_push_base_only']='Tindakan ini mengubah gambar itu sendiri, sehingga hanya dapat dilakukan di {base}. Beralih ke {base} lalu coba lagi.';
$ec_lang['lpn_field_active']='Bagian dari jaringan ini';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Hapus centang pada kotak ini untuk membiarkan elemen tetap ada di gambar tetapi di luar jaringan: elemen digambar abu-abu dan diabaikan oleh penyelesai. Dalam sebuah skenario, cara inilah pipa dinyalakan dan dimatikan.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Eksponen emitter';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='Eksponen dalam persamaan emiter EPANET untuk alat penyiram dan kebocoran: debit = koefisien x tekanan dipangkatkan eksponen ini. Ini hanya mengubah jawaban pada simpul yang memiliki emiter, yang untuk saat ini berarti jaringan yang dibaca dari berkas EPANET.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Baca DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Membaca elevasi DEM pada simpul ini dan menampilkannya di bawah. Tidak ada yang berubah pada kotak Elevasi. Resolusi horizontal DEM sekitar 30 m untuk sebagian besar Bumi, dan lebih halus di tempat yang memiliki data lebih baik.';
$ec_lang['lpn_elev_dem_use']='Gunakan DEM';
$ec_lang['lpn_elev_dem_use_tip']='Memasukkan elevasi DEM pada simpul ini ke kotak Elevasi di atas, menggantikan nilai yang ada. DEM dibaca terlebih dahulu jika belum pernah dibaca. Satu kali Undo mengembalikannya.';
$ec_lang['lpn_elev_dem_none']='DEM tidak memiliki elevasi untuk simpul ini.';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM menyatakan {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Sumber elevasi';
$ec_lang['lpn_settings_elev_source_tip']='Dari mana simpul baru mendapatkan elevasinya. Permukaan tanah dibaca dari Mapbox DEM, yang beresolusi sekitar 30 m pada sebagian besar Bumi dan lebih halus di tempat yang memiliki data lebih baik.';
$ec_lang['lpn_settings_elev_source_typed']='Elevasi yang diketik di atas';
$ec_lang['lpn_settings_elev_source_dem']='DEM Mapbox';
$ec_lang['lpn_settings_accuracy']='Akurasi';
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
$ec_lang['lpn_settings_default_is']='Nilai default adalah {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Seberapa dekat penyelesai harus mencapai sebelum berhenti, diukur sebagai besarnya perubahan debit dari satu percobaan ke percobaan berikutnya. Angka yang lebih kecil lebih tepat dan memerlukan waktu lebih lama. Kedua penyelesai membaca kotak yang sama ini, dan masing-masing mengukur perubahan tersebut terhadap total yang berbeda: penyelesai bawaan terhadap jumlah kebutuhan, EPANET terhadap jumlah debit penghubung. Jika dibiarkan kosong, halaman ini menggunakan akurasi yang lebih ketat daripada default EPANET sendiri.';
$ec_lang['lpn_settings_specific_gravity']='Berat jenis';
$ec_lang['lpn_settings_viscosity']='Viskositas relatif';
$ec_lang['lpn_settings_viscosity_tip']='Viskositas fluida dibandingkan dengan air pada 20 derajat Celsius. Ini hanya mengubah jawaban pada metode Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Percobaan maksimum';
$ec_lang['lpn_settings_trials_tip']='Berapa banyak percobaan yang diizinkan sebelum penyelesai menyerah pada jaringan yang tidak kunjung konvergen.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Jika tidak konvergen';
$ec_lang['lpn_settings_unbalanced_tip']='Apa yang dilakukan pada jaringan yang telah menghabiskan percobaannya dan masih belum konvergen. Mengizinkan percobaan tambahan sering kali mencapai konvergensi. Berhenti akan melaporkan percobaan terakhir apa adanya, yang bukan merupakan solusi. Hanya penyelesai EPANET yang membaca kotak ini. Penyelesai bawaan selalu berhenti dan menandai jawabannya sebagai tidak konvergen.';
$ec_lang['lpn_settings_unbalanced_continue']='Izinkan percobaan tambahan';
$ec_lang['lpn_settings_unbalanced_stop']='Berhenti dan laporkan percobaan terakhir';
$ec_lang['lpn_settings_unbalanced_trials']='Percobaan tambahan sebelum melaporkan';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Berapa banyak percobaan lanjutan yang diizinkan setelah maksimum di atas habis, sebelum percobaan terakhir dilaporkan. Hanya penyelesai EPANET yang membaca kotak ini.';
$ec_lang['lpn_settings_head_error']='Batas galat tinggi tekan';
$ec_lang['lpn_settings_head_error_tip']='Uji tambahan yang harus dilalui penyelesai sebelum berhenti: galat tinggi tekan terbesar yang masih tersisa pada satu pipa mana pun. Nol berarti uji ini tidak diterapkan. Hanya penyelesai EPANET yang membaca kotak ini.';
$ec_lang['lpn_settings_flow_change']='Batas perubahan debit';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Uji tambahan yang harus dilalui penyelesai sebelum berhenti: perubahan terbesar debit satu pipa mana pun dari satu percobaan ke percobaan berikutnya. Nol berarti uji ini tidak diterapkan. Hanya penyelesai EPANET yang membaca kotak ini.';
$ec_lang['lpn_settings_damp_limit']='Peredaman dimulai pada';
$ec_lang['lpn_settings_damp_limit_tip']='Akurasi saat penyelesai mulai mengambil langkah yang lebih kecil, yang dapat membantu jaringan yang berosilasi untuk konvergen. Nol berarti penyelesai tidak pernah meredam. Hanya penyelesai EPANET yang membaca kotak ini.';
$ec_lang['lpn_settings_option_unset']='Tidak dinyatakan';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Satu faktor tunggal yang diterapkan pada seluruh kebutuhan dalam jaringan sekaligus. Gunakan untuk mengetahui apa yang terjadi pada sistem saat penggunaan lebih besar atau lebih kecil dari saat ini. Ini tidak mengubah angka yang Anda ketik. Sebuah skenario dapat memiliki pengalinya sendiri, sehingga hari rata-rata, hari maksimum, dan jam puncak masing-masing menjadi satu angka; biarkan kosong dalam skenario untuk menggunakan pengali milik proyek.';
$ec_lang['lpn_settings_engine_native']='Selesaikan dengan penyelesai EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='Menjalankan penyelesai EPANET dari US EPA, langsung di peramban Anda ini. Pada jaringan seukuran ini Anda tidak akan melihat perbedaan kecepatan. Kedua penyelesai memberikan hasil yang hampir sama, tetapi tidak persis sama: EPANET membulatkan nilai gravitasi yang digunakannya, sehingga kehilangan lokal (minor) yang dihasilkannya sekitar 0,08% lebih rendah daripada penyelesai bawaan, dan dengan kekasaran Manning, kehilangan tinggi tekannya sekitar 0,6% lebih rendah. Saat pertama kali Anda mencentang kotak ini, sekitar 650 KB diunduh lalu disimpan di perangkat ini.';
$ec_lang['lpn_engine_loading']='Memuat penyelesai EPANET…';
$ec_lang['lpn_engine_failed']='Penyelesai EPANET tidak dapat dimuat. Menampilkan penyelesai bawaan sebagai gantinya.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Diselesaikan dengan penyelesai EPANET, karena katup-katup ini membuka dan menutup sendiri:';
$ec_lang['lpn_unit_unknown']='Gambar ini menyatakan satuan yang tidak tersedia di halaman ini: {unit}. Semuanya disimpan dan ditampilkan persis seperti saat masuk, dan tidak ada yang diubah. Tidak ada yang dapat dihitung sampai halaman ini diajarkan satuan tersebut, karena tidak diketahui seberapa besar satu satuannya.';
$ec_lang['lpn_engine_manning_note']='Catatan: dengan kekasaran Manning, EPANET menghitung kehilangan tinggi tekan sekitar 0.6% lebih rendah daripada penyelesai bawaan.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='Penyelesai EPANET menolak jaringan ini, sehingga tidak dijalankan.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='Penyelesai EPANET mengatakan: {message}';
$ec_lang['lpn_engine_refused_fallback']='Angka pada layar berasal dari penyelesai bawaan sebagai gantinya.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Angka pada layar berasal dari penyelesai bawaan sebagai gantinya. Penyelesai ini menghitung satu saat dalam satu waktu, sehingga ini adalah jaringan pada {time} saja, dengan setiap tangki masih berada pada tingkat awalnya.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Kendali-kendali ini menyebut elemen yang sudah tidak ada dalam proyek ini, sehingga tidak disertakan: {ids}';
$ec_lang['lpn_control_unreadable_note']='Kendali-kendali ini tidak dapat dibaca, sehingga tidak disertakan: {ids}';
$ec_lang['lpn_rule_dangling_note']='Aturan-aturan ini merujuk pada elemen yang tidak lagi ada dalam proyek ini, sehingga diabaikan dalam proses ini: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Aturan-aturan ini tidak dapat dibaca, sehingga diabaikan dalam proses ini: {ids}';
$ec_lang['lpn_settings_text_size']='Ukuran teks (piksel)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Ukuran simbol (piksel)';
$ec_lang['lpn_settings_link_width']='Lebar garis penghubung (piksel)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Panah arah aliran';
$ec_lang['lpn_settings_show_arrows_tip']='Gambar panah pada setiap pipa yang menunjukkan ke arah mana air mengalir. Panah muncul setelah dijalankan, dan mematikannya tidak mengubah hasil. Pengaturan ini disimpan bersama proyek.';
$ec_lang['lpn_settings_align_labels']='Sejajarkan label pipa dengan pipanya';
$ec_lang['lpn_settings_readability_bias']='Balikkan label jika miringnya melebihi sekian derajat ke kiri dari vertikal';
$ec_lang['lpn_settings_readability_bias_tip']='Membalikkan label agar tetap tegak saat kemiringannya melebihi sekian derajat ke kiri dari vertikal.';
$ec_lang['lpn_settings_mask_labels']='Latar belakang solid di balik label';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Kunci garis penunjuk label ke sudut tertentu';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Tampilkan label ketika diperbesar hingga lebar peta ini atau kurang';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Label hanya digambar selama tampilan peta selebar ini atau lebih sempit. Biarkan kotak kosong untuk menggambarnya pada setiap tingkat pembesaran. Ketik 0 agar label tidak pernah digambar, pada tingkat pembesaran mana pun.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Selalu tampilkan';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='Cegah simpul membesar melebihi';
$ec_lang['lpn_settings_symbol_cap_mid']='kali panjang';
$ec_lang['lpn_settings_symbol_cap_post']='pipa persentil';
$ec_lang['lpn_settings_symbol_cap_tip']='Sebuah simpul berhenti membesar di lapangan begitu diameternya mencapai sekian kali panjang pipa pada persentil ini dari seluruh panjang pipa dalam jaringan. Melewati titik itu pada peta, simpul, pipa, dan simbol lainnya menyusut di layar seiring Anda memperkecil tampilan, alih-alih membesar di lapangan. Reservoir dan tangki adalah pengecualian dan mempertahankan ukuran layarnya pada setiap tingkat pembesaran.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Opasitas simbol (0 hingga 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Opasitas gambar latar (0 hingga 1)';
$ec_lang['lpn_settings_map_display']='Tampilan peta';
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
$ec_lang['lpn_settings_legend_position']='Posisi legenda label';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Tidak ada';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Nonaktif';
$ec_lang['lpn_settings_legend_top_left']='Kiri atas';
$ec_lang['lpn_settings_legend_top_right']='Kanan atas';
$ec_lang['lpn_settings_legend_middle_left']='Kiri tengah';
$ec_lang['lpn_settings_legend_middle_right']='Kanan tengah';
$ec_lang['lpn_settings_legend_bottom_left']='Kiri bawah';
$ec_lang['lpn_settings_legend_bottom_right']='Kanan bawah';
$ec_lang['lpn_settings_color_node_field']='Warna simpul';
$ec_lang['lpn_settings_color_link_field']='Warna pipa';
$ec_lang['lpn_settings_color_ramp']='Skema warna';
$ec_lang['lpn_settings_color_credits']='Kredit';
$ec_lang['lpn_color_ramp_epanet']='Biru ke merah (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Ungu ke kuning (lebih mudah membedakan satu warna dari yang lain)';
$ec_lang['lpn_color_ramp_gray']='Abu-abu terang ke gelap';
$ec_lang['lpn_settings_color_reverse']='Balikkan urutan warna';
$ec_lang['lpn_color_none']='Tanpa warna';
$ec_lang['lpn_settings_color_key_position']='Posisi legenda warna';
$ec_lang['lpn_settings_color_breaks']='Batas pita warna';
$ec_lang['lpn_settings_color_equal_intervals']='Interval sama rata';
$ec_lang['lpn_settings_color_equal_counts']='Jumlah sama rata';
$ec_lang['lpn_settings_color_no_values']='Belum ada nilai untuk diolah. Selesaikan jaringan terlebih dahulu.';
$ec_lang['lpn_confirm_restore_defaults']='Atur ulang semua pengaturan (awalan ID, nilai awal, pengaturan penyelesai, tampilan peta, posisi legenda, dan label yang terlihat) ke nilai aslinya? Jaringan Anda tidak berubah. Pengaturan menjadi milik proyek yang sedang dibuka, sehingga proyek Anda yang lain tetap memiliki pengaturannya sendiri.';
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
$ec_lang['lpn_settings_wipe_btn']='Hapus semua yang ada di halaman ini';
$ec_lang['lpn_confirm_wipe']='Hapus SEMUA yang tersimpan untuk halaman ini — setiap proyek, setiap gambar latar, semua pengaturan, dan pilihan satuan Anda — lalu muat ulang halaman ini seperti yang dilihat pengunjung baru? Tindakan ini tidak dapat dibatalkan.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Salin tautan ini:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Waktu';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Total waktu berjalan';
$ec_lang['lpn_time_hyd_step']='Langkah waktu hidrolik';
$ec_lang['lpn_time_pattern_step']='Langkah waktu pola';
$ec_lang['lpn_time_pattern_start']='Waktu mulai pola';
$ec_lang['lpn_time_report_step']='Langkah waktu laporan';
$ec_lang['lpn_time_report_start']='Waktu mulai laporan';
$ec_lang['lpn_time_clock_start']='Waktu jam pada awal';
$ec_lang['lpn_time_clock_day']='Hari {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Tulis waktu sebagai jam dan menit, seperti 2:30. Angka polos berarti jam, jadi 8 berarti delapan jam. Setengah jam adalah 0:30.';
$ec_lang['lpn_time_running']='Menghitung simulasi periode waktu dengan penyelesai EPANET.';
$ec_lang['lpn_time_no_engine']='Penyelesai bawaan menghitung satu saat dalam satu waktu, sehingga ini adalah jaringan pada {time} saja: setiap pola dibaca pada saat itu, dan setiap tangki masih berada pada tingkat awalnya, bukan terisi dan mengosong. Sambungkan ke internet satu kali untuk mengambil penyelesai EPANET, yang menjalankan simulasi periode waktu.';
$ec_lang['lpn_time_slider']='Waktu simulasi yang telah berlalu';
$ec_lang['lpn_time_no_period']='Proyek ini tidak memiliki simulasi periode waktu yang diatur, sehingga hanya ada satu saat yang dapat ditampilkan. Atur Total waktu berjalan di Pengaturan, Perhitungan, Waktu untuk menjalankan simulasi periode waktu.';
$ec_lang['lpn_time_first']='Menuju awal';
$ec_lang['lpn_time_prev']='Mundur satu langkah';
$ec_lang['lpn_time_play']='Putar';
$ec_lang['lpn_time_play_tip']='Putar animasi';
$ec_lang['lpn_time_pause_tip']='Jeda animasi';
$ec_lang['lpn_time_pause']='Jeda';
$ec_lang['lpn_time_next']='Maju satu langkah';
$ec_lang['lpn_time_last']='Menuju akhir';
$ec_lang['lpn_time_tank']='Tangki';
$ec_lang['lpn_time_level']='Muka air';
$ec_lang['lpn_time_run']='Hitung';
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
$ec_lang['lpn_time_run_done']='Proses selesai. Waktu pelaporan: {frames}. Waktu yang dibutuhkan: {secs} s.';
$ec_lang['lpn_time_runbox_hide']='Jangan tampilkan kotak ini lagi';
$ec_lang['lpn_settings_runbox']='Tampilkan kotak kemajuan proses';
$ec_lang['lpn_settings_runbox_tip']='Kotak yang melaporkan sejauh mana proses telah berjalan dan apa yang ditemukannya. Dengan ini dimatikan, proses yang selesai akan mengatakan hal yang sama pada baris status selama beberapa detik. Ini adalah pengaturan untuk peramban ini, bukan untuk proyek.';
$ec_lang['lpn_time_run_failed']='Proses tidak selesai, sehingga tidak ada hasil untuk waktu-waktu berikutnya.';
$ec_lang['lpn_time_run_report']='Laporan proses EPANET';
$ec_lang['lpn_time_run_report_copy']='Salin';
$ec_lang['lpn_time_run_report_copied']='Tersalin';
$ec_lang['lpn_time_run_report_tip']='Apa yang dicetak sendiri oleh penyelesai EPANET tentang proses terakhir: apakah hasilnya konvergen, dan apa pun yang diperingatkannya. Ini adalah teks asli dari penyelesai itu sendiri, bukan dari kami.';

$ec_lang['lpn_time_speed']='Kecepatan';
$ec_lang['lpn_time_speed_tip']='Kecepatan pemutaran';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Cari pengaturan';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Ketik satu kata atau beberapa kata untuk melihat pengaturan yang menyebutkan semuanya.';
$ec_lang['lpn_settings_no_match']='Tidak ada pengaturan yang menyebutkan kata itu.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Lebar daftar bagian Pengaturan';
$ec_lang['lpn_rpane_empty']='Belum ada yang ditempatkan di sini. Semua yang berkaitan dengan seluruh proyek ada di Pengaturan.';
$ec_lang['lpn_time_settings_open']='Pengaturan waktu';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Visualisasi';
$ec_lang['lpn_settings_sec_map']='Peta dan halaman';
$ec_lang['lpn_settings_sec_assets']='Elemen';
$ec_lang['lpn_settings_sec_calculation']='Perhitungan';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Pelanggan';
$ec_lang['lpn_labels_customer_note']='Label pelanggan menampilkan nilai yang dicentang di sini. Label ini digambar dengan ukuran teks yang sama seperti label lain mana pun pada peta.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Label pelanggan hanya digambar selama tampilan peta selebar ini atau lebih sempit. Biarkan kotak kosong untuk menggambarnya pada setiap tingkat pembesaran. Ketik 0 agar label pelanggan tidak pernah digambar, pada tingkat pembesaran mana pun. Ini tidak berpengaruh jika nilainya lebih besar daripada pengaturan serupa untuk semua label.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Gunakan tampilan saat ini';
$ec_lang['lpn_settings_page']='Halaman';
$ec_lang['lpn_settings_hydraulics']='Hidraulika';
$ec_lang['lpn_settings_quality']='Kualitas air';
$ec_lang['lpn_settings_quality_track']='Parameter kualitas';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Pilih apa yang harus diikuti proses ini di sepanjang pipa: berapa lama air telah berada dalam sistem, dari mana asalnya, atau bahan kimia yang bereaksi selama perjalanannya. Hanya bahan kimia yang memerlukan koefisien.';
$ec_lang['lpn_settings_quality_source']='Simpul penelusuran';
$ec_lang['lpn_settings_quality_source_tip']='Simpul yang airnya ditelusuri. Setiap simpul lain kemudian menampilkan bagian airnya yang berasal dari simpul tersebut.';
$ec_lang['lpn_quality_none']='Tidak ada';
$ec_lang['lpn_quality_trace']='Penelusuran sumber';
$ec_lang['lpn_quality_chemical']='Bahan kimia yang bereaksi';
$ec_lang['lpn_quality_needs_run']='Kualitas air terbawa di sepanjang pipa seiring perjalanan airnya, sehingga memerlukan simulasi periode waktu: penyelesai EPANET dan Total waktu berjalan. Atur Total waktu berjalan di bawah Waktu, lalu tekan tombol Hitung.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Bahan kimia dan satuan';
$ec_lang['lpn_quality_chemical_name_tip']='Bahan kimia yang Anda lacak, misalnya Klorin. Biarkan kosong untuk label bawaan EPANET sendiri, Chemical. Ditampilkan dalam laporan Anda, tetapi tidak digunakan dalam perhitungan.';
$ec_lang['lpn_quality_mass_units']='Satuan massa';
$ec_lang['lpn_quality_mass_units_tip']='Bagian satuan dari entri kualitas, dua pilihan EPANET sendiri.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Toleransi kualitas';
$ec_lang['lpn_quality_tolerance_tip']='Seberapa besar dua paket air yang berdampingan boleh berbeda konsentrasinya sebelum EPANET memperlakukannya sebagai satu. Kosongkan untuk menggunakan default EPANET sendiri, 0,01.';
$ec_lang['lpn_quality_diffusivity']='Difusivitas relatif';
$ec_lang['lpn_quality_diffusivity_tip']='Seberapa mudah bahan kimia menyebar melalui air, relatif terhadap klorin. Kosongkan untuk menggunakan default EPANET sendiri, 1,0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Konsentrasi {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Konsentrasi {chemical} rata-rata';
$ec_lang['lpn_quality_initial']='Kualitas awal';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Berapa banyak bahan kimia yang dimiliki simpul ini saat proses dimulai. Reservoir mempertahankan nilainya sendiri sepanjang proses, yang merupakan cara biasa menyatakan residu yang keluar dari instalasi pengolahan. Biarkan kosong dan simpul ini mulai tanpa bahan kimia sama sekali.';
$ec_lang['lpn_result_concentration']='Konsentrasi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Berapa banyak bahan kimia yang tersisa di titik ini setelah mengalir dan bereaksi. Satuannya adalah yang dinyatakan di samping bahan kimia di bawah Pengaturan, Kualitas air.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Jenis sumber';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Jenis dosis apa yang diterapkan simpul ini pada air yang melewatinya. Konsentrasi memperlakukan air yang masuk ke jaringan di sini sebagai tiba pada nilai Kualitas sumber. Penguat massa menambahkan sejumlah massa bahan kimia setiap menit, berapa pun debitnya. Penguat setpoint mengangkat konsentrasi yang meninggalkan simpul ini hingga nilai Kualitas sumber dan tidak lebih. Penguat berdasar debit menambahkan nilai Kualitas sumber pada apa pun yang sudah ada dalam air.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Tidak ada';
$ec_lang['lpn_source_type_concen']='Konsentrasi';
$ec_lang['lpn_source_type_mass']='Penguat massa';
$ec_lang['lpn_source_type_setpoint']='Penguat setpoint';
$ec_lang['lpn_source_type_flowpaced']='Penguat berdasar debit';
$ec_lang['lpn_source_quality']='Kualitas sumber';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Seberapa kuat dosisnya. Untuk setiap jenis kecuali penguat massa, ini adalah konsentrasi, dalam satuan yang dinyatakan di samping bahan kimia di bawah Pengaturan, Kualitas air; untuk penguat massa, ini adalah massa bahan kimia per menit. Biarkan kosong dan tidak ada yang ditambahkan di sini, yang tidak sama dengan nol: nol berarti pengumpanan yang berjalan tetapi tidak menambahkan apa pun.';
$ec_lang['lpn_source_pattern']='Pola sumber';
$ec_lang['lpn_source_pattern_tip']='Pola waktu yang menyesuaikan dosis sepanjang proses, untuk pengumpanan yang tidak konstan. Tanpa pola berarti dosisnya sama pada setiap langkah waktu.';
$ec_lang['lpn_mixing_model']='Model pencampuran';
$ec_lang['lpn_mixing_model_tip']='Bagaimana air yang sudah ada di dalam tangki ini bercampur dengan air yang masuk. Pencampuran sempurna mengaduk seluruh tangki sekaligus. Pencampuran dua kompartemen mengisi zona masuk terlebih dahulu dan meneruskan sisanya. Aliran sumbat FIFO menggerakkan air sesuai urutan kedatangannya. Aliran sumbat LIFO menumpuknya, sehingga air yang terakhir masuk adalah yang pertama keluar. Pilihan ini mengubah usia air dan residunya, dan tidak mengubah tekanan atau debit apa pun.';
$ec_lang['lpn_mixing_mixed']='Pencampuran sempurna';
$ec_lang['lpn_mixing_2comp']='Pencampuran dua kompartemen';
$ec_lang['lpn_mixing_fifo']='Aliran sumbat FIFO';
$ec_lang['lpn_mixing_lifo']='Aliran sumbat LIFO';
$ec_lang['lpn_mixing_fraction']='Fraksi pencampuran';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Bagian dari volume tangki yang ditempati zona masuk, antara 0 dan 1. Hanya pencampuran dua kompartemen yang menggunakannya. Biarkan kosong dan seluruh tangki menjadi zona masuk, yang merupakan asumsi EPANET.';
$ec_lang['lpn_reaction_bulk']='Koefisien reaksi badan air';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Reaksi di dalam badan air, digunakan untuk setiap pipa yang tidak memiliki koefisiennya sendiri. Angka negatif meluruhkan bahan kimia dan angka positif menambahnya. Reaksinya berorde satu kecuali berkas EPANET yang diimpor menyatakan orde lain, sehingga koefisiennya adalah laju dalam 1/hari. Kotak yang kosong berarti tidak ada reaksi badan air.';
$ec_lang['lpn_reaction_wall']='Koefisien reaksi dinding';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Reaksi pada dinding pipa, digunakan untuk setiap pipa yang tidak memiliki koefisiennya sendiri. Angka negatif meluruhkan bahan kimia. Reaksinya berorde satu kecuali berkas EPANET yang diimpor menyatakan orde lain, sehingga koefisiennya adalah panjang per hari, ditulis dalam satuan panjang proyek. Kotak yang kosong berarti tidak ada reaksi dinding.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Khusus untuk pipa ini. Biarkan kosong dan pipa ini menggunakan koefisien yang ditetapkan untuk seluruh jaringan di bawah Pengaturan, Kualitas air.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Koefisien reaksi';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Reaksi dalam air yang tersimpan di tangki ini, sebagai laju dalam 1/hari. Angka negatif meluruhkan bahan kimia dan angka positif menambahnya. Air berdiam di dalam tangki jauh lebih lama daripada di dalam pipa mana pun, sehingga di sinilah residu paling sering hilang. Biarkan kosong dan tangki ini menggunakan koefisien reaksi badan air yang ditetapkan untuk seluruh jaringan di bawah Pengaturan, Kualitas air.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Reaksi badan air';
$ec_lang['lpn_reaction_wall_short']='Reaksi dinding';
$ec_lang['lpn_reaction_tank_short']='Reaksi';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/hari';
$ec_lang['lpn_reaction_day']='hari';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Orde reaksi badan air';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='Eksponen yang menjadi pangkat konsentrasi untuk reaksi dalam badan air. Bilangan real apa pun diperbolehkan. 1 adalah nilai default dan digunakan untuk sebagian besar pemodelan peluruhan klorin. 0 membuat laju tidak bergantung pada seberapa banyak bahan kimia yang ada.';
$ec_lang['lpn_reaction_order_tank']='Orde reaksi tangki';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='Eksponen yang menjadi pangkat konsentrasi untuk reaksi dalam air yang tersimpan di tangki, terpisah dari orde reaksi badan air sehingga tangki dapat bereaksi pada orde yang berbeda dari pipa. Bilangan real apa pun diperbolehkan, dan 1 adalah default. EPANET menyatakannya sebagai ORDER TANK dalam berkas dan tidak menyediakan kotak untuknya pada antarmukanya sendiri.';
$ec_lang['lpn_reaction_order_wall']='Orde reaksi dinding';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 berarti reaksi dinding terjadi sesuai dengan koefisien yang diberikan. 0 berarti tidak terjadi. Ini adalah saklar on/off. Nilai default adalah 1.';
$ec_lang['lpn_reaction_order_unstated']='Tidak dinyatakan';
$ec_lang['lpn_reaction_order_zero']='0, orde nol';
$ec_lang['lpn_reaction_order_first']='1, orde pertama';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Potensi pembatas';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Konsentrasi yang dituju oleh bahan kimia, bukan meluruh hingga habis atau tumbuh tanpa batas. Reaksi melambat seiring air mendekatinya dan berhenti di sana. Gunakan satuan yang konsisten. Tidak ada batas jika dikosongkan.';
$ec_lang['lpn_reaction_rough_corr']='Korelasi kekasaran';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Mengorelasikan reaksi dinding dengan kekasaran masing-masing pipa, sehingga pipa yang lebih kasar bereaksi lebih cepat. Ketika ditetapkan, koefisien dinding dihitung untuk setiap pipa dari kekasaran pipa tersebut, dan koefisien dinding tunggal di atas tidak lagi digunakan. Tidak digunakan jika dikosongkan.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Halaman ini tidak menawarkan koefisien reaksi bawaannya sendiri. Tidak ada uji standar untuknya, dan nilai lapangan yang diterbitkan untuk jenis air yang sama dapat berbeda hingga sepuluh kali lipat, sehingga angka yang disediakan di sini akan dibaca sebagai sebuah rekomendasi. Masukkan nilai yang telah Anda ukur sendiri atau yang dapat Anda kutip sumbernya, atau biarkan kotaknya kosong untuk bahan kimia yang tidak bereaksi.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Energi';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Laporan';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_epanet']='Proses EPANET';
$ec_lang['lpn_energy_title']='Laporan energi pompa';
$ec_lang['lpn_energy_menu']='Energi pompa';
$ec_lang['lpn_energy_efficiency']='Efisiensi pompa (persen)';
$ec_lang['lpn_energy_efficiency_tip']='Efisiensi kawat-ke-air yang digunakan untuk setiap pompa yang tidak memiliki kurva efisiensinya sendiri. EPANET menggunakan 75 persen bila tidak ada yang dinyatakan.';
$ec_lang['lpn_energy_price']='Harga daya';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Berapa biaya satu kilowatt jam. Ini berlaku untuk setiap pompa yang tidak memiliki harganya sendiri. Biarkan kosong dan setiap biaya dalam laporan menjadi nol.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Berapa biaya satu kilowatt jam pada pompa ini. Biarkan kosong dan pompa ini memakai harga yang ditetapkan untuk seluruh jaringan di bawah Pengaturan, Energi.';
$ec_lang['lpn_energy_price_pattern']='Pola harga';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Pola yang mengalikan harga pada setiap langkah pola, yang merupakan cara menyatakan tarif luar-waktu-sibuk. Biarkan kosong untuk satu harga sepanjang proses.';
$ec_lang['lpn_energy_demand_charge']='Biaya beban puncak';
$ec_lang['lpn_energy_demand_charge_tip']='Berapa yang dikenakan utilitas per kW untuk beban puncak yang diminta pompa-pompa dalam sistem.';
$ec_lang['lpn_energy_currency']='Mata uang';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Apa pun yang Anda tulis di sini dicetak di samping setiap angka uang. Ini hanyalah label. Harga dan biaya tidak pernah dikonversi, jadi tulis harga dalam mata uang yang Anda tulis di sini.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Halaman ini tidak menawarkan harga bawaannya sendiri. Berapa biaya daya bergantung pada utilitas, negara, jam, dan tahun, sehingga angka yang disediakan di sini akan dibaca sebagai sebuah rekomendasi. Masukkan harga dari tarif Anda sendiri.';
$ec_lang['lpn_energy_needs_run']='Energi pompa adalah daya yang diintegrasikan sepanjang proses, sehingga memerlukan simulasi periode waktu: penyelesai EPANET dan Total waktu berjalan. Atur Total waktu berjalan di Pengaturan, Perhitungan, Waktu, tekan tombol Hitung, lalu buka Air, Laporan, Energi pompa.';
$ec_lang['lpn_energy_no_pumps']='Jaringan ini tidak memiliki pompa, sehingga tidak ada yang menarik daya.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Perbandingan skenario';
$ec_lang['lpn_scncmp_menu_tip']='Selesaikan setiap skenario dalam proyek ini dan bacakan berdampingan: tekanan terendah dan kecepatan tertinggi pada masing-masing.';
$ec_lang['lpn_scncmp_running']='Menyelesaikan setiap skenario…';
$ec_lang['lpn_scncmp_empty']='Belum ada yang digambar, sehingga tidak ada yang perlu diselesaikan.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Kecepatan tertinggi';
$ec_lang['lpn_scncmp_at']='{value} pada {id}';
$ec_lang['lpn_scncmp_current']='(sedang dibuka)';
$ec_lang['lpn_scncmp_note']='Setiap skenario diselesaikan dari salinan gambar. Tidak ada yang mengubah proyek di sini, dan skenario tempat Anda bekerja dibiarkan seperti semula.';
$ec_lang['lpn_energy_over']='Untuk simulasi periode waktu selama {time}';
$ec_lang['lpn_energy_col_pump']='Pompa';
$ec_lang['lpn_energy_col_running']='% proses';
$ec_lang['lpn_energy_col_effic']='Efis.';
$ec_lang['lpn_energy_col_avg_kw']='kW rerata';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='Rerata daya yang digunakan saat pompa ini menyala. Ini tidak dirata-ratakan terhadap periode diam, sehingga pompa yang diam untuk sebagian besar simulasi periode waktu tetap melaporkan daya yang digunakannya saat menyala.';
$ec_lang['lpn_energy_col_peak_kw']='kW puncak';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Biaya';
$ec_lang['lpn_energy_total_kwh']='Energi terpakai';
$ec_lang['lpn_energy_total_energy_cost']='Biaya energi';
$ec_lang['lpn_energy_peak_kw']='Penggunaan daya puncak';
$ec_lang['lpn_energy_total_demand_charge']='Biaya beban puncak';
$ec_lang['lpn_energy_total_cost']='Biaya total';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Status';
$ec_lang['lpn_reports_status_tip']='Apa yang berubah selama simulasi periode waktu terakhir, dalam urutan waktu: pompa dan katup membuka atau menutup, tangki terisi, mengosong, menjadi penuh atau menjadi kering, serta langkah yang tidak sepenuhnya konvergen.';
$ec_lang['lpn_status_title']='Laporan status';
$ec_lang['lpn_status_needs_run']='Laporan status mencantumkan apa yang berubah selama simulasi periode waktu. Atur Total waktu berjalan di Pengaturan, Perhitungan, Waktu, tekan Hitung, lalu buka Air, Laporan, Laporan status.';
$ec_lang['lpn_status_empty']='Tidak ada yang berubah status selama proses ini.';
$ec_lang['lpn_status_col_event']='Kejadian';
$ec_lang['lpn_status_opened']='{type} {id} sekarang terbuka';
$ec_lang['lpn_status_closed']='{type} {id} sekarang tertutup';
$ec_lang['lpn_status_filling']='{type} {id} sekarang sedang terisi';
$ec_lang['lpn_status_emptying']='{type} {id} sekarang sedang mengosong';
$ec_lang['lpn_status_full']='{type} {id} sekarang penuh';
$ec_lang['lpn_status_dry']='{type} {id} sekarang kosong';
$ec_lang['lpn_status_no_converge']='Solusi hidraulik pada langkah ini tidak sepenuhnya konvergen; angka yang ditampilkan adalah iterasi terakhirnya.';
$ec_lang['lpn_status_note']='Dibaca dari proses periode waktu yang sama dengan panel Tabel dan Laporan lengkap. Hanya perubahan yang dicantumkan, bukan setiap langkah.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Lengkap';
$ec_lang['lpn_reports_full_tip']='Setiap simpul dan setiap penghubung pada setiap langkah waktu pelaporan dari proses terakhir, sebagai satu tabel yang dapat Anda unduh atau cetak.';
$ec_lang['lpn_full_title']='Laporan lengkap';
$ec_lang['lpn_full_needs_run']='Laporan lengkap mencantumkan setiap simpul dan setiap penghubung pada setiap langkah waktu pelaporan. Tekan Hitung, lalu buka Air, Laporan, Laporan lengkap.';
$ec_lang['lpn_full_note']='Satu baris untuk setiap simpul atau penghubung per langkah waktu pelaporan, dalam satuan yang ditampilkan pada panel Tabel. Sel kosong adalah kolom yang tidak dimiliki besaran itu. Unduh atau cetak membawa setiap langkah waktu; tabel di bawah menampilkan satu langkah pada satu waktu.';
$ec_lang['lpn_full_step_label']='Langkah waktu';
$ec_lang['lpn_full_download_csv']='Unduh CSV';
$ec_lang['lpn_full_print']='Cetak laporan';
$ec_lang['lpn_full_col_time']='Waktu';
$ec_lang['lpn_full_col_type']='Jenis';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} baris.';
$ec_lang['lpn_energy_no_price']='Tidak ada harga daya yang dinyatakan, sehingga setiap biaya di sini adalah nol. Atur harga di bawah Pengaturan, Energi.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Jaringan ini menyatakan harga nol, sehingga setiap biaya di sini adalah nol. Ubah di bawah Pengaturan, Energi.';
$ec_lang['lpn_energy_curve_note']='Pompa-pompa ini memanggil kurva efisiensi yang tidak memiliki titik: {ids}. Pompa-pompa itu berjalan pada efisiensi yang ditetapkan untuk seluruh jaringan.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_rank']='Peringkat';
$ec_lang['lpn_labels_col_drop']='Lepas';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Simpul dan penghubung';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Interval sama';
$ec_lang['lpn_color_mode_quantile']='Kuantil (jumlah sama)';
$ec_lang['lpn_color_mode_jenks']='Jeda alami (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Simpangan baku';
$ec_lang['lpn_color_mode_pretty']='Rapi (dibulatkan)';
$ec_lang['lpn_color_mode_log']='Logaritmik';
$ec_lang['lpn_color_mode_manual']='Manual';

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
$ec_lang['lpn_library_menu']='Pustaka';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Pola';
$ec_lang['lpn_library_patterns_tip']='Pola adalah daftar pengali yang berulang. Setiap angka berlaku untuk satu langkah waktu pola, sehingga 24 angka dengan langkah satu jam membentuk satu hari yang berulang. Kebutuhan 10 dengan pengali 1.5 menjadi 15 pada saat itu.';
$ec_lang['lpn_library_curves']='Kurva';
$ec_lang['lpn_library_curves_tip']='Kurva adalah daftar titik yang menyatakan kinerja sesuatu: berapa tinggi tekan yang ditambahkan pompa pada setiap debit, seberapa efisien pompa itu pada debit tersebut, atau berapa tinggi tekan yang hilang pada katup di setiap debit.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Sebuah kurva dimiliki oleh proyek, dan pompa atau katup menyatakan kurva yang digunakannya pada propertinya sendiri. Beberapa elemen dapat menggunakan kurva yang sama, dan mengubahnya di sini mengubah semuanya. Untuk kurva tinggi tekan pompa, proses menggunakan kurva yang dicocokkan melalui titik-titiknya seperti yang ditampilkan; untuk jenis lainnya, proses menghubungkan titik-titik itu dengan garis lurus seperti yang ditampilkan.';
$ec_lang['lpn_library_curve_add']='Tambah kurva';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Jenis kurva';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Persamaan';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='Kurva yang dicocokkan melalui titik-titik, dan garis yang digambar pada plot di bawah. Persamaan ini dihitung ulang dari titik-titiknya setiap kali ditampilkan dan tidak pernah disimpan, dan angka-angkanya dalam satuan yang ditampilkan tabel di atas. Penyelesai bawaan berjalan menggunakan persamaan ini; penyelesai EPANET membaca titik-titiknya sendiri.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Pilih satu atau dua kolom pada lembar kerja, salin, lalu tempelkan pada sel pertama tempat Anda ingin data itu mendarat. Baris-barisnya ditambahkan sesuai kebutuhan. Anda juga dapat menempelkan baris yang disalin langsung dari berkas EPANET, termasuk nama kurvanya.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Deskripsi';
$ec_lang['lpn_library_curve_remove_point']='Hapus titik ini';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Salin titik';
$ec_lang['lpn_library_curve_copy_tip']='Menyalin setiap titik sebagai dua kolom, siap ditempelkan ke lembar kerja.';
$ec_lang['lpn_library_curve_copy_manual']='Salin titik-titik ini';
$ec_lang['lpn_library_curve_used_by']='Elemen yang menggunakan kurva ini';
$ec_lang['lpn_library_curve_unused']='Tidak ada yang menggunakan kurva ini.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Kurva ini digunakan oleh {count} elemen: {ids}. Arahkan elemen-elemen itu ke kurva lain terlebih dahulu, baru hapus kurva ini.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Jenis pipa';
$ec_lang['lpn_library_pipetypes_tip']='Jenis pipa adalah definisi yang dapat dirujuk oleh beberapa pipa untuk diameter, kekasaran, dan koefisien reaksinya. Mengedit definisi ini mengedit setiap pipa yang menggunakannya.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Setiap proyek memiliki pustaka jenis pipa sendiri. Anda boleh membiarkan properti kosong dalam definisi jenis pipa. Misalnya, jenis pipa yang menyatakan kekasaran tanpa diameter tidak masalah. Anda melampirkan jenis pipa ke pipa pada editor propertinya. Mengedit sebuah definisi di sini mengubah setiap pipa yang merujuk padanya.';
$ec_lang['lpn_library_pipetype_add']='Tambah jenis pipa';
$ec_lang['lpn_library_pipetype_blank_tip']='Properti kosong dalam definisi jenis pipa dibiarkan untuk diisi sendiri oleh masing-masing pipa.';
$ec_lang['lpn_library_pipetype_used_by']='Pipa yang menggunakan jenis ini';
$ec_lang['lpn_library_pipetype_unused']='Tidak ada yang menggunakan jenis pipa ini.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Jenis pipa ini digunakan oleh {count} pipa: {ids}. Lepaskan dari pipa-pipa tersebut sebelum menghapusnya.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Jenis pipa';
$ec_lang['lpn_field_pipetype_tip']='Jenis pipa dalam pustaka proyek yang digunakan pipa ini. Properti yang termasuk dalam jenis pipa dinonaktifkan untuk diedit di sini. Lepaskan jenis pipa untuk mengaktifkan pengeditan di sini.';
$ec_lang['lpn_pipetype_none']='Tidak ada jenis pipa yang dipilih';
$ec_lang['lpn_pipetype_detach']='Lepaskan dari jenis pipa';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Menyalin nilai yang dibaca pipa ini dari jenisnya ke dalam pipa itu sendiri dan berhenti menggunakan jenis tersebut. Nilai pipa tidak berubah sekarang, dan mulai sekarang Anda dapat mengedit nilai-nilai ini di sini.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Fitting';
$ec_lang['lpn_library_fittings_tip']='Daftar fitting adalah kumpulan fitting beserta jumlahnya yang dapat dirujuk oleh beberapa pipa. Daftar ini dijumlahkan menjadi satu koefisien kehilangan lokal.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Setiap proyek memiliki pustaka fitting sendiri. Daftar fitting berisi fitting dengan jumlah untuk masing-masing, dan dijumlahkan menjadi satu koefisien kehilangan lokal. Baik pipa maupun jenis pipa dapat merujuk pada suatu daftar.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Fitting yang ditawarkan di sini adalah tiga belas jenis dari Tabel 3.3 pada manual pengguna EPANET 2.2. Memilih salah satunya menyalin koefisiennya ke dalam baris, tempat Anda dapat mengubahnya. Koefisien bergantung pada ukuran dan merek fitting, sehingga perlakukan tabel ini sebagai titik awal, bukan sebagai jawaban pasti.';
$ec_lang['lpn_library_fittings_add']='Tambah daftar fitting';
$ec_lang['lpn_library_fittings_used_by']='Pipa yang menggunakan daftar fitting ini';
$ec_lang['lpn_library_fittings_unused']='Tidak ada yang menggunakan daftar fitting ini.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Daftar fitting ini digunakan oleh {count} pipa: {ids}. Lepaskan dari pipa-pipa tersebut sebelum menghapusnya.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Impor pustaka…';
$ec_lang['lpn_library_import_tip']='Pilih berkas proyek lain dan salin seluruh pustaka darinya ke dalam proyek ini. Apa pun yang namanya sudah digunakan di sini akan dilewati dan dicantumkan, sehingga tidak ada yang sudah Anda miliki berubah.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Pilih apa yang akan disalin dari {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Setiap pustaka yang Anda centang disalin secara utuh. Hapus yang tidak Anda inginkan setelahnya, dengan cara yang sama seperti menghapus entri lain mana pun.';
$ec_lang['lpn_library_import_go']='Impor';
$ec_lang['lpn_library_import_no_libraries']='Berkas proyek itu tidak memiliki pustaka untuk disalin.';
$ec_lang['lpn_library_import_heading']='Diimpor dari {file}';
$ec_lang['lpn_library_import_added']='Disalin masuk: {names}';
$ec_lang['lpn_library_import_conflict']='Dilewati, karena proyek ini sudah memiliki satu dengan nama yang sama: {names}. Tidak ada yang berubah di sini. Ganti nama salah satunya lalu impor lagi jika Anda menginginkan keduanya.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Berkas proyek itu tidak memiliki satu pun dari ini untuk disalin.';
$ec_lang['lpn_library_import_curve_shape']='Kurva-kurva ini masuk persis seperti yang ditulis oleh berkas, dan sebuah proses tidak dapat menggunakan salah satunya sampai kolom pertamanya naik dari setiap titik ke titik berikutnya: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Jenis-jenis pipa ini merujuk pada daftar fitting yang tidak dimiliki proyek ini: {names}. Impor pustaka fitting dari berkas yang sama dan jenis pipa itu akan menemukannya.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Perhatian: Satuan tidak cocok. Akan diimpor apa adanya. Tidak disarankan.';
$ec_lang['lpn_library_import_units_line']='{name}: proyek ini menampilkan {mine}, berkas menampilkan {theirs}.';
$ec_lang['lpn_fitting_qty']='Jumlah';
$ec_lang['lpn_fitting_name']='Nama fitting';
$ec_lang['lpn_fitting_k']='Koefisien';
$ec_lang['lpn_fitting_add']='Tambah fitting';
$ec_lang['lpn_fitting_remove']='Hapus';
$ec_lang['lpn_fitting_total']='Koefisien kehilangan lokal total, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Daftar fitting';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Daftar fitting dari pustaka proyek. Jumlah dan koefisiennya dijumlahkan menjadi koefisien kehilangan lokal pipa ini, dan kotak koefisien kemudian menjadi hanya-baca. Biarkan tidak dipilih untuk mengetik koefisien sendiri.';
$ec_lang['lpn_fittings_none']='Tidak ada daftar fitting yang dipilih';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Katup globe, terbuka penuh';
$ec_lang['lpn_fitting_angle']='Katup sudut, terbuka penuh';
$ec_lang['lpn_fitting_swingcheck']='Katup cek ayun, terbuka penuh';
$ec_lang['lpn_fitting_gate']='Katup gerbang, terbuka penuh';
$ec_lang['lpn_fitting_elbow_short']='Belokan radius pendek';
$ec_lang['lpn_fitting_elbow_medium']='Belokan radius sedang';
$ec_lang['lpn_fitting_elbow_long']='Belokan radius panjang';
$ec_lang['lpn_fitting_elbow_45']='Belokan 45 derajat';
$ec_lang['lpn_fitting_return_bend']='Belokan balik tertutup';
$ec_lang['lpn_fitting_tee_run']='Tee standar, aliran melalui jalur lurus';
$ec_lang['lpn_fitting_tee_branch']='Tee standar, aliran melalui cabang';
$ec_lang['lpn_fitting_entrance']='Pintu masuk persegi';
$ec_lang['lpn_fitting_exit']='Pintu keluar';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Fitting lainnya';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='Tersimpan {file}';
$ec_lang['lpn_inp_export_flat_lead']='Berkas EPANET yang diekspor secara numerik setara dengan proyek ini. Namun berkas ini tidak memiliki tempat untuk hal-hal berikut:';
$ec_lang['lpn_inp_export_flat_types']='{n} pipa di sini merujuk pada {t} jenis pipa. Dalam berkas ini, setiap pipa tersebut membawa salinan angkanya sendiri, sehingga jawabannya tetap sama. Yang tidak dapat disimpan oleh berkas ini adalah jenis pipa itu sendiri, sehingga mengedit satu definisi dan membuat setiap pipa mengikutinya hanya tercatat pada berkas proyek Anda sendiri.';
$ec_lang['lpn_inp_export_flat_coords']='Berkas EPANET menyimpan satu posisi untuk setiap simpul. Skenario ini menempatkan {n} di antaranya di tempat lain, dan itulah posisi yang ada dalam berkas. Setiap skenario lain menyimpan posisinya sendiri hanya di dalam berkas proyek Anda.';
$ec_lang['lpn_inp_export_flat_fittings']='Berkas EPANET tidak dapat menyimpan daftar belokan, katup, dan tee dalam berkas proyek Anda. Koefisien kehilangan lokal {n} pipa di sini dijumlahkan dari daftar fitting. Totalnya masuk ke dalam berkas persis seperti apa adanya, sehingga tidak ada perubahan pada jawabannya.';
$ec_lang['lpn_library_controls']='Kendali';
$ec_lang['lpn_library_controls_tip']='Sebuah kendali adalah satu kalimat yang membuka atau menutup penghubung, atau memberinya pengaturan, ketika suatu muka air, tekanan, atau waktu mengharuskannya.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Tambah pola';
$ec_lang['lpn_library_pattern_values']='Pengali';
$ec_lang['lpn_library_pattern_values_tip']='Pengali-pengali, dipisahkan dengan spasi atau koma. Tempel satu kolom dari lembar kerja jika Anda memilikinya. Daftar ini berulang selama proses berlangsung, sehingga tidak perlu mencakup seluruh proses.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} pengali, berjarak {step}, mencakup {span}';
$ec_lang['lpn_library_pattern_none']='Tidak ada pola';
$ec_lang['lpn_settings_default_pattern']='Pola kebutuhan default';
$ec_lang['lpn_settings_default_pattern_tip']='Setiap simpul tanpa pola menggunakan pola ini.';
$ec_lang['lpn_library_control_add']='Tambah kendali';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Satu kalimat, dengan kata-kata yang digunakan EPANET. Empat bentuk: LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1, dan LINK 12 CLOSED AT CLOCKTIME 3 AM. Alih-alih OPEN atau CLOSED, Anda dapat menulis sebuah angka, yaitu pengaturan katup atau kecepatan pompa. Biarkan kata kuncinya dalam bahasa Inggris; itulah yang dibaca oleh halaman ini.';
$ec_lang['lpn_library_control_ok']='✓ Dipahami';
$ec_lang['lpn_library_control_bad']='⚠ Tidak dipahami';
$ec_lang['lpn_library_control_missing']='⚠ Jaringan ini tidak memiliki apa pun bernama {id}';
$ec_lang['lpn_library_rules']='Aturan';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Sebuah aturan adalah paragraf singkat yang membuka atau menutup penghubung, atau memberinya suatu pengaturan, ketika suatu muka air, tekanan, debit, atau waktu mencapai nilai yang Anda tetapkan. Aturan dapat menguji lebih dari satu hal sekaligus, dan dapat menyatakan apa yang harus dilakukan ketika pengujian gagal.';
$ec_lang['lpn_library_rule_add']='Tambah aturan';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Satu aturan, dengan kata-kata yang digunakan EPANET, satu klausa per baris. Baris pertama menamainya: RULE 1. Lalu sebuah kondisi: IF TANK 2 LEVEL BELOW 17.1. Lalu apa yang harus dilakukan: THEN PUMP 9 STATUS IS OPEN. Baris terakhir dapat menetapkan peringkatnya: PRIORITY 1. Tambahkan baris AND atau OR untuk menguji lebih dari satu hal, dan baris ELSE untuk menyatakan apa yang harus dilakukan ketika pengujian gagal. Sebuah kondisi dapat membaca LEVEL, HEAD, GRADE, PRESSURE, atau DEMAND pada sebuah simpul, FLOW, STATUS, atau SETTING pada sebuah penghubung, atau TIME dan CLOCKTIME pada SYSTEM. Tulis angka-angkanya dalam satuan yang ditampilkan proyek ini; angka itu akan dikonversi untuk Anda. Biarkan kata kuncinya dalam bahasa Inggris; itulah yang dibaca halaman ini dan EPANET.';
$ec_lang['lpn_library_rule_ok']='✓ Aturan ini terbaca';
$ec_lang['lpn_library_rule_bad']='⚠ Aturan ini tidak dapat dibaca';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Kebutuhan dasar';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Debit yang diambil simpul ini pada langkah waktu yang ditampilkan: setiap kebutuhan dasar dikalikan dengan polanya masing-masing, lalu dijumlahkan. Nilai ini dihitung, bukan diketik, sehingga berubah mengikuti jam dan tidak dapat diedit.';
$ec_lang['lpn_field_demand_pattern']='Pola kebutuhan';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Deskripsi';
$ec_lang['lpn_demand_add']='Tambah kategori kebutuhan';
$ec_lang['lpn_demand_remove']='Hapus kebutuhan ini';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Pola tinggi tekan';
$ec_lang['lpn_field_head_pattern_tip']='Bagaimana muka air reservoir ini naik dan turun sepanjang proses. Tinggi tekan di atas dikalikan dengan pola ini.';
$ec_lang['lpn_field_pump_speed']='Kecepatan relatif';
$ec_lang['lpn_field_pump_speed_tip']='1 berarti pompa ini berputar pada kecepatan saat kurvanya diukur. 0.9 berarti pompa yang sama berputar lebih lambat, yang menurunkan tinggi tekan yang ditambahkannya dan debit yang dilewatkannya. Sebuah pola kecepatan menggantikan angka ini selama proses berlangsung.';
$ec_lang['lpn_field_speed_pattern']='Pola kecepatan';
$ec_lang['lpn_field_speed_pattern_tip']='Bagaimana kecepatan pompa ini naik dan turun sepanjang proses berjalan. Setiap pengali adalah kecepatan relatif untuk bagian proses itu, dan menggantikan pengaturan Kecepatan relatif alih-alih mengalikannya, sehingga pengali 0 menghentikan pompa.';

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
$ec_lang['lpn_search_menu']='Cari tempat berdasarkan nama…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Temukan kota, alamat, atau tempat terkenal berdasarkan nama, lalu pindahkan peta ke sana. Penggunaan pertama akan meminta izin Anda, karena kata-kata yang Anda ketik dikirim ke layanan nama tempat OpenStreetMap.';
$ec_lang['lpn_search_bar']='Cari berdasarkan nama…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Pencarian berdasarkan nama tempat mengirimkan kata-kata yang Anda ketik ke nominatim.openstreetmap.org, layanan nama tempat gratis dari OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Ini adalah layanan yang berbeda dari citra peta jalan di belakang proyek Anda. Citra itu hanya menunjukkan ke mana Anda sedang melihat. Sebuah pencarian menunjukkan apa yang Anda ketik. Layanan nama tempat akan menerima kata pencarian Anda dan alamat IP Anda. Kami tidak mengirim apa pun yang lain, dan kami tidak menyimpan catatan pencarian Anda.';
$ec_lang['lpn_search_consent_3']='Bolehkah kami mengirim pencarian Anda ke layanan nama tempat?';
$ec_lang['lpn_search_consent_4']='Jika Anda menjawab tidak, semua hal lain pada halaman ini tetap bekerja persis seperti sekarang, termasuk Pergi ke garis lintang dan bujur. Kami mengingat jawaban ya agar tidak perlu bertanya lagi. Jawaban tidak sama sekali tidak disimpan.';
$ec_lang['lpn_search_refused']='Pencarian nama tempat dimatikan, dan tidak ada yang dikirim. Anda tetap dapat menggunakan Pergi ke garis lintang dan bujur.';
$ec_lang['lpn_search_prompt']='Cari tempat berdasarkan nama. Kota, jalan, tempat terkenal — misalnya: Petaluma, California';
$ec_lang['lpn_search_empty']='Ketik nama tempat yang ingin dicari.';
$ec_lang['lpn_search_working']='Mencari…';
$ec_lang['lpn_search_busy']='Pencarian sedang berlangsung. Tunggu hasilnya.';
$ec_lang['lpn_search_choose']='Ada lebih dari satu tempat yang cocok. Yang mana?';
$ec_lang['lpn_search_nochoice']='Tidak ada yang dipilih, sehingga peta tidak berpindah.';
$ec_lang['lpn_search_badchoice']='Itu bukan salah satu angka dalam daftar.';
$ec_lang['lpn_search_none']='Tidak ditemukan apa pun untuk nama itu.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Layanan nama tempat meminta kami memperlambat. Tunggu satu menit dan coba lagi.';
$ec_lang['lpn_search_http']='Layanan nama tempat menjawab dengan sebuah galat.';
$ec_lang['lpn_search_timeout']='Layanan nama tempat tidak menjawab tepat waktu. Semua hal lain pada halaman ini tetap berfungsi tanpanya.';
$ec_lang['lpn_search_unreadable']='Layanan nama tempat menjawab dengan sesuatu yang tidak dapat dibaca halaman ini.';
$ec_lang['lpn_search_offline']='Kami tidak dapat menjangkau layanan nama tempat. Anda mungkin sedang offline. Semua hal lain pada halaman ini tetap berfungsi tanpanya, termasuk Pergi ke garis lintang dan bujur.';
$ec_lang['lpn_search_toofast']='Satu pencarian per detik — itulah batas yang diizinkan layanan nama tempat. Coba lagi sesaat lagi.';
$ec_lang['lpn_search_nofetch']='Peramban ini tidak dapat menjangkau layanan nama tempat.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox menyusun ini dari banyak kumpulan data elevasi publik, sehingga seberapa baik data ini sepenuhnya bergantung pada lokasi Anda. Di tempat survei lidar nasional tersedia, seperti USGS 3DEP di sebagian besar Amerika Serikat dan yang setara di tempat lain, akurasinya bisa lebih baik dari satu meter secara horizontal dan beberapa persepuluh meter secara vertikal. Di tempat yang hanya memiliki data global, akurasinya sekitar 30 m secara horizontal dan beberapa meter secara vertikal. Mapbox tidak memberi tahu kita data mana yang Anda dapatkan. Perlakukan ini sebagai peta kontur, bukan survei: periksa apa pun yang Anda andalkan.';
$ec_lang['lpn_terrain_consent_1']='Mengisi elevasi mengirimkan posisi setiap simpul yang membutuhkannya — garis lintang dan bujurnya — ke api.mapbox.com, untuk mencari tahu ketinggian tanah di sana.';
$ec_lang['lpn_terrain_consent_2']='Ini adalah pertanyaan yang berbeda dari citra peta di belakang proyek Anda. Citra itu hanya menunjukkan ke mana Anda sedang melihat. Posisi-posisi ini adalah jaringan Anda sendiri. Mapbox akan menerima koordinat tersebut dan alamat IP Anda. Kami tidak mengirim apa pun yang lain: tidak ada nama, tidak ada pipa, tidak ada proyek. Kami tidak menyimpan catatan apa pun, dan tidak ada yang disimpan pada perangkat ini kecuali jawaban Anda atas pertanyaan ini.';
$ec_lang['lpn_terrain_consent_3']='Bolehkah kami mengirim posisi simpul Anda ke Mapbox?';
$ec_lang['lpn_terrain_consent_4']='Jika Anda menjawab tidak, semua hal lain pada halaman ini tetap bekerja persis seperti sekarang, dan Anda tetap dapat mengetik elevasi sendiri seperti sebelumnya. Kami mengingat jawaban ya agar tidak perlu bertanya lagi. Jawaban tidak sama sekali tidak disimpan.';
$ec_lang['lpn_terrain_refused']='Elevasi tidak diisi, dan tidak ada yang dikirim. Anda tetap dapat mengetiknya seperti sebelumnya.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Isi elevasi {n} simpul dari Mapbox DEM?';
$ec_lang['lpn_terrain_confirm_default_1']='Setiap simpul sudah memiliki elevasi, dan {n} di antaranya masih berada pada {v}, yaitu elevasi awal sebuah simpul baru, bukan yang Anda ketik sendiri.';
$ec_lang['lpn_terrain_confirm_default_2']='Ganti elevasi {n} simpul tersebut dengan nilai dari Mapbox DEM?';
$ec_lang['lpn_terrain_keep']='{k} simpul sudah memiliki elevasi dan tidak akan disentuh.';
$ec_lang['lpn_terrain_undo']='Satu kali Undo (Ctrl-Z) mengembalikan semuanya.';
$ec_lang['lpn_terrain_requests']='{n} permintaan ke api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Elevasi sedang diisi. Tunggu sebentar.';
$ec_lang['lpn_terrain_offmap']='Posisi simpul-simpul ini tidak berada pada peta medan, sehingga tidak ada yang dikirim.';
$ec_lang['lpn_terrain_too_wide']='Simpul-simpul ini tersebar di area Bumi yang terlalu luas untuk dibaca sekaligus ({n} permintaan ubin). Tidak ada yang dikirim.';
$ec_lang['lpn_terrain_cancelled']='Tidak ada yang diubah dan tidak ada yang dikirim.';
$ec_lang['lpn_terrain_nofetch']='Peramban ini tidak dapat menjangkau layanan medan.';
$ec_lang['lpn_terrain_working']='Membaca permukaan tanah…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Layanan medan menolak permintaan ({status}), sehingga tidak ada elevasi yang diubah. Token Mapbox yang digunakan situs ini mungkin tidak mengizinkan alamat web yang sedang Anda gunakan.';
$ec_lang['lpn_terrain_failed']='Kami tidak dapat menjangkau layanan medan, sehingga tidak ada elevasi yang diubah. Anda mungkin sedang offline. Semua hal lain pada halaman ini tetap berfungsi tanpanya.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Layanan medan meminta kami memperlambat permintaan (429), sehingga tidak ada elevasi yang diubah. Coba lagi dalam satu menit.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Layanan medan menjawab dengan sebuah galat ({status}), sehingga tidak ada elevasi yang diubah. Tidak ada yang salah dengan jaringan Anda.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Tidak satu pun dari simpul-simpul itu memiliki posisi di Bumi, sehingga tidak ada yang dikirim dan tidak ada elevasi yang diubah. Membaca permukaan tanah memerlukan proyek dalam lintang dan bujur, atau proyek pada proyeksi yang dapat ditempatkan oleh halaman ini.';
$ec_lang['lpn_terrain_done']='{n} elevasi terisi.';
$ec_lang['lpn_terrain_missed']='{m} tidak dapat dibaca dan masih kosong.';
$ec_lang['lpn_terrain_partial']='{f} ubin medan tidak menjawab.';
$ec_lang['lpn_terrain_will_ids']='Simpul-simpul ini akan mendapatkan elevasi: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Simpul-simpul tersebut adalah: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Simpul-simpul ini telah mendapatkan elevasi: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Simpul-simpul ini masih belum memiliki elevasi: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, dan {n} lainnya';

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
$ec_lang['lpn_ff_menu']='Analisis debit kebakaran…';
$ec_lang['lpn_ff_menu_tip']='Uji simpul satu per satu: berapa banyak yang dapat disalurkan masing-masing sambil tetap mempertahankan tekanan sisa yang Anda tetapkan, dan apakah mengambil debit yang diperlukan di sana mendorong hal lain keluar dari batasnya?';
$ec_lang['lpn_ff_title']='Analisis debit kebakaran';
$ec_lang['lpn_ff_intro']='Setiap simpul secara bergiliran diminta untuk mengambil debit kebakaran di atas kebutuhan yang sudah dimilikinya. Tidak ada yang berubah pada proyek Anda; seluruh proses dijalankan pada salinan.';
$ec_lang['lpn_ff_scope']='Simpul yang akan diuji';
$ec_lang['lpn_ff_scope_tip']='Pilih kelompok simpul sebelum menjalankan. Menguji setiap simpul pada sistem besar dapat memakan waktu beberapa menit.';
$ec_lang['lpn_ff_all']='Semua';
$ec_lang['lpn_ff_selected']='Terpilih';
$ec_lang['lpn_ff_no_junctions']='Proyek ini belum memiliki simpul, sehingga tidak ada yang dapat diuji.';
$ec_lang['lpn_ff_no_selection']='Tidak ada simpul yang dipilih. Pilih simpul atau pilih Semua simpul.';
$ec_lang['lpn_ff_skipped']='{n} elemen yang dipilih bukan simpul, sehingga tidak diuji.';
$ec_lang['lpn_ff_required']='Debit kebakaran yang diperlukan';
$ec_lang['lpn_ff_required_tip']='Debit yang disyaratkan oleh kode kebakaran atau otoritas pemadam kebakaran Anda pada hidran. Setiap simpul diuji terhadap angka ini kecuali simpul tersebut memiliki debit kebakaran yang disyaratkan sendiri.';
$ec_lang['lpn_ff_required_own']='Simpul yang memiliki debit kebakaran yang disyaratkan sendiri diuji terhadap angka itu sebagai gantinya. Jumlahnya: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Debit kebakaran yang disyaratkan pada simpul ini secara khusus, dari kode kebakaran atau otoritas pemadam kebakaran Anda, untuk peruntukan lahan yang dilayaninya. Biarkan kosong dan simpul ini diuji terhadap angka pada kotak Analisis debit kebakaran.';
$ec_lang['lpn_ff_residual']='Tekanan sisa yang dipertahankan';
$ec_lang['lpn_ff_residual_tip']='Tekanan yang harus tetap dipertahankan simpul saat menyalurkan debit kebakaran. AWWA M31 dan NFPA 291 menggunakan 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Pemeriksaan desain (dampak pada sistem)';
$ec_lang['lpn_ff_design_tip']='Pertanyaan terpisah dari apakah simpul dapat menyalurkan debit tersebut: dengan debit itu diambil di sana, apakah ada hal lain yang turun di bawah tekanan minimumnya atau melampaui batas kecepatannya? Memilih untuk memeriksanya tidak memerlukan perhitungan tambahan.';
$ec_lang['lpn_ff_design_no_selection']='Cakupan pemeriksaan desain diatur ke Terpilih, tetapi tidak ada elemen yang dipilih. Pilih elemen atau pilih opsi Semua.';

$ec_lang['lpn_ff_minpressure']='Tekanan terendah yang diizinkan di tempat lain';
$ec_lang['lpn_ff_minpressure_tip']='Simpul yang turun di bawah nilai ini saat simpul lain sedang mengambil debit kebakarannya akan dilaporkan sebagai masalah desain.';
$ec_lang['lpn_ff_maxvelocity']='Kecepatan tertinggi yang diizinkan';
$ec_lang['lpn_ff_maxvelocity_tip']='Pipa yang mengalir di atas nilai ini saat debit kebakaran sedang diambil akan dilaporkan sebagai masalah desain.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Debit kebakaran diambil langsung pada simpul itu sendiri. Itulah metode yang digunakan di sini, dan merupakan metode yang umum. Hidran, pipa lateralnya, dan noselnya tidak dimodelkan, sehingga hidran sebenarnya menyalurkan lebih sedikit daripada debit yang ditampilkan di sini.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Penyelesai bawaan digunakan.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Penyelesai EPANET digunakan.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='Debit kebakaran yang tersedia adalah hasil pencarian, sehingga seluruh jaringan diselesaikan sekitar enam belas kali untuk setiap simpul yang diuji. Sistem besar dapat memakan waktu beberapa menit. Anda dapat menghentikannya kapan saja dan tetap menyimpan apa yang telah dikerjakan.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Hanya langkah waktu yang sedang ditampilkan di layar yang diuji. Debit kebakaran biasanya diuji di atas kebutuhan hari maksimum, jadi atur jaringan ke kondisi tersebut sebelum menjalankan.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Proses debit kebakaran';
$ec_lang['lpn_ff_calculate']='Jalankan';
$ec_lang['lpn_ff_stop']='Berhenti';
$ec_lang['lpn_ff_working']='Memproses: {done} dari {total} simpul.';
$ec_lang['lpn_ff_stopped']='Berhenti setelah {done} dari {total} simpul. Hasil di bawah adalah yang sudah selesai dihitung.';
$ec_lang['lpn_ff_cost']='Proses ini menyelesaikan seluruh jaringan sebanyak {solves} kali.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Gambar telah berubah, sehingga hasil debit kebakaran dihapus. Jalankan kembali.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Hapus cincin';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} simpul tidak memiliki masalah. {fire} simpul gagal memenuhi debit kebakaran. {design} simpul memengaruhi sisa sistem.';
$ec_lang['lpn_ff_summary_error']='{n} simpul tidak dapat dihitung jawabannya.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Setiap simpul yang diuji';
$ec_lang['lpn_ff_col_junction']='Simpul';
$ec_lang['lpn_ff_col_static']='Tekanan statis';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='Tekanan pada simpul ini sebelum debit kebakaran mana pun diambil, dengan kebutuhan biasa sistem masih berjalan. Tidak ada yang dimatikan untuk mengukurnya, sehingga ini bukan tekanan debit nol untuk sistem; ini adalah tekanan yang sama seperti yang ditampilkan peta pada simpul ini. AWWA M31 dan NFPA 291 keduanya menyebut pembacaan ini tekanan statis, dan di sinilah sebuah uji debit kebakaran dimulai.';
$ec_lang['lpn_ff_col_available']='Debit tersedia';
$ec_lang['lpn_ff_col_required']='Debit diperlukan';
$ec_lang['lpn_ff_col_residual']='Sisa dipertahankan';
$ec_lang['lpn_ff_col_atrequired']='Tekanan pada debit diperlukan';
$ec_lang['lpn_ff_col_affected']='Dampak terburuk';
$ec_lang['lpn_ff_col_limit']='Batas desain';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Tidak diperiksa';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Statis gagal, sehingga tidak diperiksa';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Modus kegagalan';
$ec_lang['lpn_ff_mode_fire']='Kebakaran';
$ec_lang['lpn_ff_mode_design']='Desain';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Tidak ada';
$ec_lang['lpn_ff_col_solves']='Proses';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Tekanan dan kecepatan';
$ec_lang['lpn_ff_atleast']='lebih dari {flow}';
$ec_lang['lpn_ff_affect_node']='{id} turun ke {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} mencapai {velocity}';
$ec_lang['lpn_ff_more']='dan {n} lainnya terdampak';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='Simpul yang tidak ditampilkan: {n}.';
$ec_lang['lpn_ff_design_none']='Tidak ada elemen dalam kelompok yang dipilih yang melampaui batasnya selama simpul mana pun mengambil debit kebakarannya.';
$ec_lang['lpn_ff_design_off_note']='Dampak pada sisa sistem tidak diperiksa dalam proses ini.';
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
$ec_lang['lpn_ff_iso']='Insurance Services Office (ISO) memberi kredit maksimum {flow} untuk satu hidran. Batas kredit tersebut belum diterapkan di sini karena tidak diketahui berapa banyak hidran yang mungkin diwakili oleh satu simpul.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Sudah di bawah tekanan sisa sebelum debit kebakaran mana pun diambil';
$ec_lang['lpn_ff_err_converge']='Jaringan tidak konvergen.';
$ec_lang['lpn_ff_err_solve']='Penyelesai melaporkan galat dan tidak memberikan jawaban.';
$ec_lang['lpn_ff_err_not_junction']='Bukan simpul';
$ec_lang['lpn_ff_err_unknown']='Tidak ada jawaban. Kode yang dilaporkan adalah {code}.';

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
$ec_lang['lpn_file_import_survey']='Impor titik survei…';
$ec_lang['lpn_file_import_survey_tip']='Membaca daftar titik survei dari sebuah berkas teks dan membuat satu simpul pada setiap titik, menggunakan pengaturan elemen baru untuk semua yang tidak dinyatakan oleh berkas. Tidak ada pipa yang digambar, dan tidak ada baris yang pernah dibuang tanpa disebutkan namanya. Halaman ini membaca sistem koordinat yang sudah digunakan proyek ini, baik digeoreferensi maupun tidak.';
$ec_lang['lpn_survey_read_error']='Berkas itu tidak dapat dibaca dari disk Anda.';
$ec_lang['lpn_survey_cancelled']='Tidak ada yang dibuat dan tidak ada yang berubah.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Utara';
$ec_lang['lpn_survey_axis_east']='Timur';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Berkas itu tidak berisi apa pun.';
$ec_lang['lpn_survey_err_unreadable']='Berkas itu tidak dapat dibaca sebagai daftar titik survei.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Lebih dari satu kolom dalam berkas itu dapat menjadi {axis} ({detail}), dan halaman ini tidak akan memilih di antaranya. Biarkan salah satunya diberi nama sebagai {axis} lalu coba lagi.';
$ec_lang['lpn_survey_err_no_points']='Tidak satu baris pun dari berkas itu dapat dibaca sebagai titik survei. Baris yang dibaca: {detail}';
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
$ec_lang['lpn_survey_format_label']='Format berkas:';
$ec_lang['lpn_survey_format_internal']='ditentukan secara internal';
$ec_lang['lpn_survey_create']='Buat simpul';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='Baris pertama dilewati: baris itu tidak menyebutkan kolom mana pun yang dikenali halaman ini.';
$ec_lang['lpn_survey_type_label']='Jenis elemen:';
$ec_lang['lpn_survey_confirm_junction']='{n} simpul ditemukan. Lanjutkan?';
$ec_lang['lpn_survey_confirm_reservoir']='{n} reservoir ditemukan. Lanjutkan?';
$ec_lang['lpn_survey_confirm_tank']='{n} tangki ditemukan. Lanjutkan?';
$ec_lang['lpn_survey_report_junction']='{n} simpul diimpor, {m} dengan elevasi.';
$ec_lang['lpn_survey_report_reservoir']='{n} reservoir diimpor, {m} dengan elevasi.';
$ec_lang['lpn_survey_report_tank']='{n} tangki diimpor, {m} dengan elevasi.';
$ec_lang['lpn_survey_report_clean']='Setiap titik dalam berkas berhasil masuk, dan tidak ada yang berubah dalam prosesnya.';
$ec_lang['lpn_survey_report_notes']='Galat dan catatan impor:';
$ec_lang['lpn_survey_sev_error']='galat';
$ec_lang['lpn_survey_sev_warning']='peringatan';
$ec_lang['lpn_survey_note_line']='Baris {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Terlalu sedikit kolom untuk format berkas di atas.';
$ec_lang['lpn_survey_note_coord_missing']='Sel {axis} kosong.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} tidak terbaca sebagai angka.';
$ec_lang['lpn_survey_note_coord_range']='{axis} berada di luar rentang yang diizinkan proyek ini.';
$ec_lang['lpn_survey_note_bad_elev']='Elevasi bukan angka. Diimpor tanpa elevasi.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Lebih dari satu kolom dapat menjadi elevasi, sehingga tidak satu pun dibaca.';
$ec_lang['lpn_survey_note_blank_rows']='Baris kosong dilewati: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Nama sudah digunakan sebelumnya dalam berkas ini, nama baru diberikan.';
$ec_lang['lpn_survey_note_id_taken']='Nama sudah ada dalam proyek, nama baru diberikan.';
$ec_lang['lpn_survey_note_id_invalid']='Nama tidak dapat digunakan di sini, nama baru diberikan.';
$ec_lang['lpn_hotkeys_menu_heading']='Menu';
$ec_lang['lpn_hotkeys_menu_term']='Pintasan keyboard menu';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+huruf</td><td>Buka menu dengan huruf itu, lalu tekan huruf pada sebuah baris untuk memilihnya. Huruf-huruf itu tampil selama Anda menggunakan keyboard. Pada Mac, gunakan Ctrl+Option.</td></tr><tr><td>F10</td><td>Pindah ke bilah menu.</td></tr></tbody></table>';
$ec_lang['lpn_graphs_menu']='Grafik';
$ec_lang['lpn_contour_menu']='Kontur';
$ec_lang['lpn_contour_tip']='Tampilkan plot kontur pada peta: warna simpul menyebar di sepanjang dan di samping pipa, dengan garis kontur berlabel. Membuka kotak untuk menyetelnya atau mematikannya.';
$ec_lang['lpn_contour_plot']='Plot kontur';
$ec_lang['lpn_contour_fill']='Isian';
$ec_lang['lpn_contour_fill_tip']='Halus memadukan warna dari satu kelas ke kelas berikutnya. Pita mewarnai setiap kelas pada kunci warna secara rata.';
$ec_lang['lpn_contour_fill_smooth']='Halus';
$ec_lang['lpn_contour_fill_bands']='Pita';
$ec_lang['lpn_contour_opacity']='Opasitas isian';
$ec_lang['lpn_contour_lines']='Garis kontur';
$ec_lang['lpn_contour_interval']='Interval';
$ec_lang['lpn_contour_buffer']='Penyangga';
$ec_lang['lpn_contour_buffer_unit']='× panjang pipa median';
$ec_lang['lpn_contour_buffer_tip']='Seberapa jauh warna menjangkau dari setiap pipa, sebagai kelipatan panjang pipa median. Warna memudar di bagian luarnya.';
$ec_lang['lpn_contour_few']='Simpul terlalu sedikit untuk dikonturkan.';
$ec_lang['lpn_contour_support']='Plot kontur: {n} simpul, diinterpolasi di sepanjang {p} pipa dan hingga {k} kali panjang pipa median di sampingnya. Tidak ada warna melintasi pompa, katup, atau penghubung yang tertutup.';
$ec_lang['lpn_contour_support_lines']='Garis kontur setiap {i} {u}.';
$ec_lang['lpn_contour_too_many']='Garis kontur terlalu banyak pada interval ini; perlebar untuk menggambarnya.';
$ec_lang['lpn_contour_dem']='Permukaan tanah di antara simpul dari Mapbox DEM';
$ec_lang['lpn_contour_dem_tip']='Di antara simpul, tekanan menjadi tinggi tekan hasil interpolasi dikurangi ketinggian tanah dari Mapbox DEM, sehingga dapat turun di bawah tekanan simpul terendah pada bukit yang tidak memiliki simpul di jaringan. Perlakukan tanah sebagai peta kontur, bukan hasil survei.';
$ec_lang['lpn_contour_support_dem']='Di antara simpul, tekanan adalah tinggi tekan hasil interpolasi dikurangi elevasi tanah dari Mapbox DEM, yang disampel kira-kira setiap {m} m.';
$ec_lang['lpn_contour_dem_failed']='Permukaan tanah tidak dapat dibaca dari Mapbox DEM, sehingga tekanan diinterpolasi hanya di antara simpul.';
$ec_lang['lpn_contour_consent_1']='Menggambar tekanan di atas tanah mengirimkan area yang dicakup jaringan Anda, sebagai nomor ubin peta Mapbox, ke api.mapbox.com, untuk membaca ketinggian tanah di sana.';
$ec_lang['lpn_contour_consent_2']='Ini pertanyaan yang berbeda dari gambar peta di belakang proyek Anda. Gambar itu hanya menunjukkan ke mana Anda melihat. Ubin-ubin ini menunjukkan di mana jaringan Anda berada. Mapbox akan menerima nomor ubin tersebut dan alamat IP Anda. Kami tidak mengirim hal lain: tanpa nama, tanpa pipa, tanpa proyek. Kami tidak menyimpan catatannya, dan tidak ada yang disimpan di perangkat ini kecuali jawaban Anda atas pertanyaan ini.';
$ec_lang['lpn_contour_consent_3']='Bolehkah kami mengirim nomor ubin area jaringan Anda ke Mapbox?';
$ec_lang['lpn_contour_consent_4']='Jika Anda menjawab tidak, semua hal lain di halaman ini tetap berfungsi persis seperti sekarang, dan plot kontur digambar hanya di antara simpul. Kami mengingat jawaban ya agar tidak perlu bertanya lagi. Jawaban tidak sama sekali tidak disimpan.';
$ec_lang['lpn_sysflow_menu']='Neraca debit';
$ec_lang['lpn_sysflow_tip']='Buat grafik total debit yang dihasilkan dan total debit yang dikonsumsi terhadap waktu, sepanjang simulasi periode waktu. Tangki tidak termasuk dalam kedua total, jadi ketika kedua garis berpisah, tangki sedang terisi atau terkuras.';
$ec_lang['lpn_sysflow_produced']='Dihasilkan';
$ec_lang['lpn_sysflow_produced_tip']='Total debit yang masuk ke jaringan dari reservoir dan dari kebutuhan negatif.';
$ec_lang['lpn_sysflow_consumed']='Dikonsumsi';
$ec_lang['lpn_sysflow_consumed_tip']='Total semua kebutuhan positif: air yang diambil dari jaringan pada simpul, dan setiap debit yang masuk ke reservoir.';
$ec_lang['lpn_copy_title']='Tandai berkas sebagai salinan baru?';
$ec_lang['lpn_copy_body']='Berkas ini menyatakan dibuat pada {date}, dan peramban ini tidak mengenalinya. Apakah ini berkas Asli (pertahankan kunci yang sama) atau Salinan (buat kunci baru)?';
$ec_lang['lpn_copy_body_nodate']='Peramban ini tidak mengenali berkas ini. Apakah ini berkas Asli (pertahankan kunci yang sama) atau Salinan (buat kunci baru)?';
$ec_lang['lpn_copy_original']='Asli; pertahankan kunci yang sama';
$ec_lang['lpn_copy_copy']='Salinan; buat kunci baru';
$ec_lang['lpn_copy_kept_link']='Membuka {name} sebagai berkas asli, yang dipindahkan ke tempat baru. Simpan sekarang menulis ke berkas ini.';
$ec_lang['lpn_copy_opened']='Membuka {file} sebagai salinan, dengan kunci baru miliknya sendiri yang akan disimpan pada penyimpanan berkas berikutnya.';
$ec_lang['lpn_scenario_basic']='Mode dasar';
$ec_lang['lpn_scenario_basic_tip']='Jika dicentang, skenario hanyalah nilai-nilai yang Anda atur di dalamnya. Jika tidak dicentang, menu ini juga menawarkan tabel pratinjau Alternatif, yang menunjukkan bagaimana nilai-nilai itu dikelompokkan menurut kategori dan mengundang umpan balik Anda.';
$ec_lang['lpn_alt_title']='Pratinjau Alternatif';
$ec_lang['lpn_alt_note']='Hanya-baca. Dasar menggunakan alternatif Dasar dari setiap kategori. Setiap skenario mendapat alternatifnya sendiri untuk kategori apa pun yang diubah, turunan dari alternatif Dasar. Angkanya adalah jumlah nilai yang diubah.';
$ec_lang['lpn_alt_cat_physical']='Fisik';
$ec_lang['lpn_alt_cat_demand']='Kebutuhan';
$ec_lang['lpn_alt_cat_topology']='Pengaktifan elemen';
$ec_lang['lpn_alt_cat_initial']='Pengaturan awal';
$ec_lang['lpn_alt_cat_constituent']='Konstituen';
$ec_lang['lpn_alt_cat_fireflow']='Debit kebakaran';
$ec_lang['lpn_alt_cat_energy']='Biaya energi';
$ec_lang['lpn_alt_cat_userdata']='Properti khusus';
$ec_lang['lpn_alt_cat_text']='Teks';
$ec_lang['lpn_reports_calib']='Kalibrasi';
$ec_lang['lpn_reports_calib_tip']='Bandingkan data lapangan terukur dari berkas kalibrasi dengan proses terakhir: statistik, plot korelasi, dan perbandingan rata-rata.';
$ec_lang['lpn_calib_title']='Laporan kalibrasi';
$ec_lang['lpn_calib_param']='Parameter';
$ec_lang['lpn_calib_param_tip']='Besaran yang diukur oleh berkas kalibrasi. Satu berkas disimpan untuk setiap parameter.';
$ec_lang['lpn_calib_load']='Muat berkas kalibrasi…';
$ec_lang['lpn_calib_load_tip']='Berkas teks dengan ID lokasi, waktu, dan nilai terukur pada setiap baris. Waktu diukur dari awal simulasi, dalam jam desimal atau jam:menit. Titik koma memulai komentar. Baris yang hanya berisi waktu dan nilai termasuk dalam lokasi di atasnya.';
$ec_lang['lpn_calib_none']='Tidak ada berkas kalibrasi yang dimuat untuk parameter ini.';
$ec_lang['lpn_calib_session']='Berkas kalibrasi hanya disimpan selama sesi ini. Berkas ini tidak disimpan bersama proyek atau di perangkat ini.';
$ec_lang['lpn_calib_file']='{file}: {n} pengukuran pada {m} lokasi.';
$ec_lang['lpn_calib_units']='Nilai dalam berkas dibaca dalam satuan proyek ini: {unit}.';
$ec_lang['lpn_calib_missing']='Disebut dalam berkas tetapi tidak ada di jaringan ini: {ids}.';
$ec_lang['lpn_calib_missing_count']='Pengukuran yang dilewati karena lokasinya tidak ada di jaringan ini: {n}.';
$ec_lang['lpn_calib_bad_lines']='Baris yang tidak dapat dibaca, dilewati: {lines}';
$ec_lang['lpn_calib_outside']='Pengukuran di luar waktu yang dilaporkan proses ini, dilewati: {n}.';
$ec_lang['lpn_calib_no_value']='Pengukuran tanpa nilai hasil hitung pada waktunya, dilewati: {n}.';
$ec_lang['lpn_calib_single']='Ini adalah proses satu periode, sehingga setiap pengukuran dibandingkan dengan satu hasilnya, berapa pun waktu yang diberikan berkas.';
$ec_lang['lpn_calib_needs_run']='Belum ada hasil untuk dibandingkan. Laporan terisi setelah jaringan dihitung.';
$ec_lang['lpn_calib_no_pairs']='Tidak ada pengukuran yang dapat dibandingkan, sehingga tidak ada yang diplot.';
$ec_lang['lpn_calib_tab_stats']='Statistik';
$ec_lang['lpn_calib_tab_corr']='Plot korelasi';
$ec_lang['lpn_calib_tab_means']='Perbandingan rata-rata';
$ec_lang['lpn_calib_col_location']='Lokasi';
$ec_lang['lpn_calib_col_n']='Jml obs';
$ec_lang['lpn_calib_col_obs_mean']='Rata-rata observasi';
$ec_lang['lpn_calib_col_sim_mean']='Rata-rata hitung';
$ec_lang['lpn_calib_col_mean_err']='Galat rata-rata';
$ec_lang['lpn_calib_col_mean_err_tip']='Rata-rata selisih mutlak antara setiap nilai observasi dan nilai hasil hitung pada waktu yang sama.';
$ec_lang['lpn_calib_col_rms_err']='Galat RMS';
$ec_lang['lpn_calib_col_rms_err_tip']='Galat akar rata-rata kuadrat: akar kuadrat dari rata-rata kuadrat selisih antara nilai observasi dan nilai hasil hitung.';
$ec_lang['lpn_calib_network']='Jaringan';
$ec_lang['lpn_calib_corr_means']='Korelasi antar rata-rata: {r}';
$ec_lang['lpn_calib_corr_none']='Korelasi antar rata-rata: memerlukan sedikitnya dua lokasi yang rata-ratanya berbeda.';
$ec_lang['lpn_calib_axis_obs']='Observasi: {q}';
$ec_lang['lpn_calib_axis_sim']='Hasil hitung: {q}';
$ec_lang['lpn_calib_observed']='Observasi';
$ec_lang['lpn_calib_computed']='Hasil hitung';
$ec_lang['lpn_calib_point']='{id}, {time}: observasi {o}, hasil hitung {s}';
$ec_lang['lpn_calib_corr_note']='Setiap titik adalah satu pengukuran. Semakin dekat titik-titik dengan garis diagonal, semakin dekat nilai hasil hitung dengan nilai observasi.';
$ec_lang['lpn_calib_ts_point']='Diukur pada {id}, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='Lingkaran adalah nilai terukur dari berkas kalibrasi.';
$ec_lang['lpn_analyze_menu']='Analisis';
$ec_lang['lpn_analyze_menu_tip']='Analisis yang menjalankan jaringan pada salinan: debit kebakaran pada setiap simpul, kehilangan setiap pipa, pompa, dan katup, serta kebutuhan yang diperbesar atau diperkecil.';
$ec_lang['lpn_ff_design_off']='Tidak ada';
$ec_lang['lpn_ff_design_all']='Semua';
$ec_lang['lpn_ff_design_selected']='Terpilih';
$ec_lang['lpn_ff_rows_more_links']='Penghubung yang tidak ditampilkan: {n}.';
$ec_lang['lpn_crit_menu']='Analisis kekritisan…';
$ec_lang['lpn_crit_menu_tip']='Keluarkan setiap pipa, pompa, dan katup dari jaringan satu per satu, lalu lihat apa yang hilang dari sistem.';
$ec_lang['lpn_crit_title']='Analisis kekritisan';
$ec_lang['lpn_crit_intro']='Setiap elemen dikeluarkan dari jaringan secara bergiliran, dan jaringan diselesaikan pada langkah waktu yang tampil di layar dalam skenario aktif. Tidak ada yang berubah pada proyek Anda; seluruh proses dijalankan pada salinan.';
$ec_lang['lpn_crit_scope']='Penghubung yang diputus';
$ec_lang['lpn_crit_scope_tip']='Semua pipa, pompa, dan katup, atau hanya yang dipilih pada peta. Pilih kelompoknya sebelum menjalankan.';
$ec_lang['lpn_crit_scope_all']='Semua penghubung';
$ec_lang['lpn_crit_scope_selected']='Penghubung terpilih';
$ec_lang['lpn_crit_minpressure']='Tekanan terendah yang diizinkan';
$ec_lang['lpn_crit_minpressure_tip']='Ini angka yang sama dengan Tekanan terendah yang diizinkan di tempat lain pada Analisis debit kebakaran. Mengubahnya di sini mengubahnya di sana.';
$ec_lang['lpn_crit_col_asset']='Elemen';
$ec_lang['lpn_crit_col_unserved']='Kebutuhan tidak terlayani';
$ec_lang['lpn_crit_col_cutoff']='Simpul terputus';
$ec_lang['lpn_crit_col_below']='Simpul di bawah minimum';
$ec_lang['lpn_crit_summary']='{n} dari {total} elemen menyisakan kebutuhan yang tidak terlayani atau menurunkan sebuah simpul di bawah {pressure}.';
$ec_lang['lpn_crit_baseline_below']='Simpul yang sudah di bawahnya tanpa ada yang diputus: {n}. Simpul itu tidak dihitung.';
$ec_lang['lpn_crit_working']='Memproses: {done} dari {total} elemen.';
$ec_lang['lpn_crit_stopped']='Berhenti setelah {done} dari {total} elemen. Hasil di bawah adalah yang sudah selesai dihitung.';
$ec_lang['lpn_crit_no_selection']='Tidak ada penghubung yang dipilih. Pilih penghubung atau pilih Semua penghubung.';
$ec_lang['lpn_crit_no_links']='Proyek ini belum memiliki penghubung, sehingga tidak ada yang dapat diputus.';
$ec_lang['lpn_crit_busy']='Analisis lain sedang berjalan. Hentikan, atau tunggu sampai selesai.';
$ec_lang['lpn_crit_skipped']='{n} elemen yang dipilih bukan penghubung, sehingga tidak diputus.';
$ec_lang['lpn_crit_stale']='Gambar telah berubah, sehingga hasil analisis kekritisan dihapus. Jalankan kembali.';
$ec_lang['lpn_crit_skipdead']='Lewati ujung buntu';
$ec_lang['lpn_crit_skipdead_tip']='Penghubung ujung buntu adalah penghubung yang pelepasannya memutus simpul yang hanya dapat dicapai melaluinya, tanpa reservoir atau tangki di baliknya. Kehilangannya adalah semua yang ada di baliknya, sehingga tidak diselesaikan. Ringkasan menyebutkan berapa banyak yang dilewati.';
$ec_lang['lpn_crit_skipped_dead']='Penghubung ujung buntu yang dilewati: {n}. Masing-masing memutus semua yang ada di baliknya.';
