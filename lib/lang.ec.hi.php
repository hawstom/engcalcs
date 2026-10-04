<?php

// हिन्दी — All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='भिन्न';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/से';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% चढ़ाव/आधार';
$ec_lang['u_grade']='चढ़ाव/आधार';
$ec_lang['u_in2']='वर्ग इंच';
$ec_lang['u_inh2o']='in H2O';
$ec_lang['u_in']='इंच';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='ली/से';
$ec_lang['u_m2']='मी^2';
$ec_lang['u_m3ps']='मी^3/से';
$ec_lang['u_mgd']='MGD';
$ec_lang['u_imgd']='IMGD';
$ec_lang['u_afd']='ac-ft/d';
$ec_lang['u_lpm']='ली/मिनट';
$ec_lang['u_cmh']='मी^3/घंटा';
$ec_lang['u_cmd']='मी^3/दिन';
$ec_lang['u_mh2o']='मी जल';
$ec_lang['u_mld']='ML/दिन';
$ec_lang['u_m']='मी';
$ec_lang['u_mm2']='मिमी^2';
$ec_lang['u_mmh2o']='मिमी जल';
$ec_lang['u_mm']='मिमी';
$ec_lang['u_mps']='मी/से';
$ec_lang['u_npm2']='N/m^2';
$ec_lang['u_pa']='Pa';
$ec_lang['u_psf']='psf';
$ec_lang['u_psi']='psi';
$ec_lang['u_bar']='बार';
$ec_lang['u_kgfcm2']='किग्रा/सेमी²';
$ec_lang['u_s']='सेकंड';
$ec_lang['u_hr']='घंटा';
$ec_lang['u_day']='दिन';
$ec_lang['u_lph']='ली/घंटा';
$ec_lang['u_gph']='गैलन/घंटा';
$ec_lang['u_mmph']='मिमी/घंटा';
$ec_lang['u_inph']='इंच/घंटा';
$ec_lang['u_acft']='एकड़-फुट';
$ec_lang['u_ft3']='ft^3';
$ec_lang['u_m3']='मी^3';
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
$ec_lang['menu_brand']='HawsEDC कैलकुलेटर';
$ec_lang['menu_main_hydraulics']='जलगतिकी';
$ec_lang['menu_help']='सहायता';
$ec_lang['menu_libre']='मुक्त सॉफ़्टवेयर';
$ec_lang['template_welcome']='दरवाज़े पर अपने डर छोड़ें; यहाँ प्यार हमारी भाषा है। आप सब कुछ बर्बाद नहीं कर रहे। <a target="_blank" href="https://hawsedc.com/download.php">मुफ़्त HawsEDC AutoCAD टूल</a> भी आज़माएँ।';
$ec_lang['template_feedback']='क्या आप इस पृष्ठ की भाषा को बेहतर बना सकते हैं, या कुछ और सुझाव देना चाहेंगे? क्या आप मदद करना चाहते हैं या ऐसे उपकरण बनाना सीखना चाहते हैं? कृपया मुझसे संपर्क करें।';
$ec_lang['template_printable_title']='प्रिंट करने योग्य शीर्षक';
$ec_lang['template_printable_subtitle']='प्रिंट करने योग्य उप-शीर्षक';
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
$ec_lang['consent_body']='क्या हम यह याद रखने के लिए कि हम इस पृष्ठ को पहले ही गिन चुके हैं, इस ब्राउज़र में एक अंक की कुकी सहेज सकते हैं? यह आपके बारे में कुछ भी और आपके टाइप किए गए किसी भी शब्द को रिकॉर्ड नहीं करती। इसके बिना हम आपकी दूसरी विज़िट को किसी और की पहली विज़िट से अलग नहीं बता सकते।';
$ec_lang['consent_accept']='अभी स्वीकार करें';
$ec_lang['consent_accept_all']='हमेशा के लिए स्वीकार करें';
$ec_lang['consent_decline']='हमेशा के लिए अस्वीकार करें';
$ec_lang['consent_current_granted']='आपने इसे स्वीकार किया है। हम इस ब्राउज़र प्रोफ़ाइल के लिए लॉगिंग सीमित रखते हैं।';
$ec_lang['consent_current_denied']='आपने इसे अस्वीकार किया है। लॉगिंग सीमित रखने के लिए हम कुछ भी संग्रहीत नहीं करते।';
$ec_lang['consent_region_label']='लॉगिंग सीमित करने के बारे में आपकी पसंद।';
$ec_lang['consent_settings_link']='कुकी सेटिंग्स';
$ec_lang['privacy_link']='गोपनीयता सूचना';
$ec_lang['terms_link']='उपयोग की शर्तें';
$ec_lang['index_main_title']='मुफ़्त ऑनलाइन इंजीनियरिंग कैलकुलेटर';
$ec_lang['index_meta_desc_plain']='पाइप, चैनल, वियर और सिंचाई के लिए मुफ़्त हाइड्रॉलिक इंजीनियरिंग कैलकुलेटर। ये आपके ब्राउज़र में चलते हैं, ऑफ़लाइन काम करते हैं, और 27 भाषाओं में उपलब्ध हैं।';
$ec_lang['calc_set_units']='इकाइयाँ निर्धारित करें:';
$ec_lang['calc_set_units_tip']='हर फ़ील्ड की इकाई एक साथ सेट करता है। यह विनाशकारी नहीं है: आपने जो संख्याएँ टाइप कीं वे बिल्कुल वैसी ही रहती हैं, बस अब हर एक नई इकाई में पढ़ी जाती है। 6 अब भी 6 रहता है, पर अब इसका अर्थ 6 मिलीमीटर की जगह 6 इंच है।';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='डिफ़ॉल्ट पुनर्स्थापित करें';
$ec_lang['calc_defaults_confirm']='कैलकुलेटर को मूल डिफ़ॉल्ट मानों पर रीसेट करूँ?';
$ec_lang['points_data_note']='(या डेटा क्षेत्र से कॉपी/पेस्ट करें)';
$ec_lang['points_data_heading']='कैलकुलेटर डेटा<br />(फ़ॉर्मैट देखने के लिए कॉपी का उपयोग करें)';
$ec_lang['points_data_copy']='कॉपी';
$ec_lang['points_data_paste']='पेस्ट';
$ec_lang['calc_inputs']='इनपुट';
$ec_lang['calc_results']='परिणाम';
$ec_lang['view_hide_line']='यह पंक्ति छुपाएँ';
$ec_lang['view_printable']='प्रिंट करने योग्य संस्करण (पुनर्स्थापित करने के लिए पुनः लोड करें)';
$ec_lang['ec_name_label']='इस गणना को सहेजें:';
$ec_lang['ec_name_placeholder']='नाम';
$ec_lang['ec_name_tip']='इन इनपुटों को बुकमार्किंग, इतिहास पुनः प्राप्त करने और साझा करने के लिए URL में सहेजता है';
$ec_lang['calc_copy_link']='लिंक कॉपी करें';
$ec_lang['ec_related_calcs']='संबंधित कैलकुलेटर:';
$ec_lang['calc_copy_link_done']='कॉपी किया गया!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='डार्सी-वाइसबाख पाइप शीर्ष हानि';
$ec_lang['dw_main_title']='मुफ़्त ऑनलाइन डार्सी-वाइसबाख पाइप शीर्ष हानि कैलकुलेटर';
$ec_lang['dw_main_desc']='दिए गए व्यास, खुरदरापन और प्रवाह पर डार्सी-वाइसबाख पाइप शीर्ष हानि';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='पाइप की दीवार की निरपेक्ष खुरदरापन ऊँचाई, e। विशिष्ट मान: इस्पात (नया) 0.046 mm, इस्पात (पुराना) 0.15 mm, HDPE 0.003 mm, PVC/uPVC 0.0015 mm, कंक्रीट 0.3–3 mm।';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="20°C पर स्वच्छ जल के लिए 1×10⁻⁶ मी²/से">गतिक श्यानता, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='गतिक श्यानता, ν';
$ec_lang['dw_kinematic_viscosity_tip']='20°C पर स्वच्छ जल के लिए 1×10⁻⁶ मी²/से';
$ec_lang['dw_reynolds_number']='रेनॉल्ड्स संख्या, Re';
$ec_lang['dw_flow_regime']='प्रवाह व्यवस्था';
$ec_lang['dw_regime_laminar']='स्तरीय';
$ec_lang['dw_regime_transitional']='संक्रमणीय';
$ec_lang['dw_regime_turbulent']='अशांत';
$ec_lang['dw_friction_factor_method']='घर्षण गुणांक विधि';
$ec_lang['dw_friction_factor']='घर्षण गुणांक, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='हेज़न-विलियम्स पाइप शीर्ष हानि';
$ec_lang['hw_main_title']='मुफ़्त ऑनलाइन हेज़न-विलियम्स पाइप शीर्ष हानि कैलकुलेटर';
$ec_lang['hw_main_desc']='दिए गए व्यास, खुरदरापन और प्रवाह पर हेज़न-विलियम्स पाइप शीर्ष हानि';
$ec_lang['hw_hgl_1']='अनुप्रवाह HGL';
$ec_lang['hw_hgl_2']='उर्ध्वप्रवाह HGL';
$ec_lang['hw_elev_up']='उर्ध्वप्रवाह ऊँचाई';
$ec_lang['hw_pressure_up']='उर्ध्वप्रवाह दाब';
$ec_lang['hw_elev_down']='अनुप्रवाह ऊँचाई';
$ec_lang['hw_pressure_down']='अनुप्रवाह दाब';
$ec_lang['hw_pressure_check']='दाब जाँच';
$ec_lang['hw_pressure_ok_short']='धनात्मक दाब';
$ec_lang['hw_pressure_neg_short']='नकारात्मक दाब';
$ec_lang['hw_pressure_neg']='अनुप्रवाह दाब शून्य से नीचे है। हाइड्रॉलिक ग्रेड लाइन पाइप से नीचे चली जाती है, इसलिए पाइप पूरी तरह भरकर नहीं बहेगा और यह परिणाम मान्य नहीं हो सकता।';
$ec_lang['hw_roughness']='हेज़न-विलियम्स गुणांक, C';
$ec_lang['hw_note_1']='<dl><dt>यह कैलकुलेटर दोनों सिरों के बीच पाइप प्रोफ़ाइल का मॉडल नहीं बनाता।</dt><dd>यह केवल आपके द्वारा दर्ज की गई उर्ध्वप्रवाह और अनुप्रवाह ऊँचाइयों का उपयोग करता है। यदि बीच में कहीं जमीन किसी भी छोर से ऊँची उठती है, तो उस उच्च बिंदु पर दाब यहाँ दर्शाए गए किसी भी दाब से कम होगा। उच्च बिंदु की जाँच के लिए उर्ध्वप्रवाह छोर से उच्च बिंदु तक की लंबाई के लिए कैलकुलेटर फिर से चलाएँ।</dd><dd>जहाँ हाइड्रॉलिक ग्रेड लाइन पाइप से नीचे चली जाती है, वहाँ जल नकारात्मक दाब में होता है। हवा घोल से बाहर निकलती है, पतली दीवार वाला पाइप ढह सकता है, और गंदा भूजल जोड़ों से अंदर खिंच सकता है। लाइन को हर जगह धनात्मक दाब में रखें, और प्रत्येक उच्च बिंदु पर एक एयर वाल्व लगाने पर विचार करें।</dd><dt>उर्ध्वप्रवाह दाब एक सीमा शर्त है जिसे आप स्वयं देते हैं।</dt><dd>इसे गेज से, टैंक के जल स्तर से (पाइप के ऊपर जल की ऊँचाई), या पंप वक्र से पढ़ें। प्रवाह बढ़ने पर पंप कम दाब देता है, इसलिए वक्र पर वह बिंदु उपयोग करें जो ऊपर दर्ज किए गए प्रवाह से मेल खाता हो।</dd><dt>स्थानीय हानि गुणांक स्वयं जोड़ें।</dt><dd>लाइन पर हर वाल्व, मोड़, टी, मीटर और प्रवेश के लिए K मान जोड़ें, और वह कुल दर्ज करें। सामान्य मानों के लिए उस इनपुट पर दिए गए लिंक का अनुसरण करें। एक लंबी ट्रांसमिशन मुख्य लाइन पर ये हानियाँ घर्षण की तुलना में छोटी होती हैं, लेकिन छोटी स्टेशन पाइपिंग में ये अधिकांश हानि हो सकती हैं।</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='मैनिंग अनियमित-काट नाली';
$ec_lang['mi_main_title']='मुफ़्त ऑनलाइन मैनिंग अनियमित-काट नाली कैलकुलेटर';
$ec_lang['mi_main_desc']='अनियमित-काट नाली मैनिंग एकसमान प्रवाह कैलकुलेटर';
$ec_lang['mi_waterSurfaceElevation']='जल सतह स्तर';
$ec_lang['mi_q_617']='<span class="ec-help" title="मिश्रित प्रवाह, Q, जो Chow 6-17 (समान वेग) के अनुसार प्रत्येक क्षेत्र के लिए मिश्रित n का उपयोग करता है">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='अनुप्रस्थ काट बिंदु';
$ec_lang['mi_groupPoint']='बिंदु';
$ec_lang['mi_groupSegment']='खंड';
$ec_lang['mi_groupRegion']='क्षेत्र';
$ec_lang['mi_station']='चेनेज';
$ec_lang['mi_elevation']='ऊँचाई';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q क्षेत्र सीमा (तट)';
$ec_lang['mi_tau']='तल अपरूपण τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='मिश्रित<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='मिश्रित n';
$ec_lang['mi_notes_1_def']='यह कैलकुलेटर क्षेत्र मिश्रित n की गणना में Chow 1959, पृष्ठ 136, समीकरण 6-17 (6-18 नहीं) का उपयोग करते हुए HEC-RAS संदर्भ मैनुअल का अनुसरण करता है।';


$ec_lang['mi_notes_2_term']='चट्टान अस्तर';
$ec_lang['mi_notes_2_def']='चट्टान अस्तर डिज़ाइन करने के लिए मैनिंग समलम्बाकार नाली कैलकुलेटर का उपयोग करें। यह कैलकुलेटर प्राकृतिक अनुप्रस्थ काटों के लिए अधिक उपयुक्त है।';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='मैनिंग पाइप प्रवाह';
$ec_lang['mpf_main_title']='मुफ़्त ऑनलाइन मैनिंग पाइप प्रवाह कैलकुलेटर';
$ec_lang['mpf_main_desc']='दिए गए ढलान और गहराई पर मैनिंग सूत्र एकसमान पाइप प्रवाह';
$ec_lang['mpf_pipe_diameter']='पाइप व्यास, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='मैनिंग खुरदरापन, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">घर्षण ढलान, S<sub>f</sub></a><span class="ec-help" title="कभी-कभी पाइप ढलान के बराबर। व्याख्या के लिए लिंक पर जाएं (केवल अंग्रेज़ी में)।"><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='सापेक्ष प्रवाह गहराई, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='प्रवाह, Q';
$ec_lang['mpf_flow_tip']='प्रवाह और गहराई की गणना एक अनंत लंबे पाइप के लिए की गई है। इतना प्रवाह पाइप में प्रवेश कराने के लिए अधिक शीर्ष जल गहराई की आवश्यकता हो सकती है। विवरण और ट्यूटोरियल वीडियो के लिए नीचे नोट देखें।';
$ec_lang['mpf_velocity']='वेग, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="जल स्तंभ की ऊँचाई के रूप में गतिज ऊर्जा, v²/2g">वेग शीर्ष, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='प्रवाह क्षेत्रफल, A';
$ec_lang['mpf_pipe_area']='पाइप क्षेत्रफल, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='सापेक्ष क्षेत्रफल, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='आर्द्र परिधि, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='हाइड्रोलिक त्रिज्या, R<sub>h</sub>';
$ec_lang['mpf_top_width']='शीर्ष चौड़ाई, T';
$ec_lang['mpf_froude_number']='फ्रूड संख्या, Fr';
$ec_lang['mpf_shear_stress']='औसत अपरूपण प्रतिबल, τ';
$ec_lang['mpf_full_flow']='पूर्ण प्रवाह, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='पूर्ण प्रवाह से अनुपात, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>यह एक <em>अनंत लंबे</em> पाइप के अंदर का प्रवाह और गहराई है।</dt><dd>पाइप में प्रवाह प्रवेश कराने के लिए काफी अधिक शीर्ष जल गहराई की आवश्यकता हो सकती है। शीर्ष जल गहराई का अनुमान लगाने के लिए वेग शीर्ष का कम से कम 1.5 गुना जोड़ें, या मानक पाइपनाली शीर्ष जल गणना के लिए <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">मेरा 2-मिनट का ट्यूटोरियल</a> देखें, जिसमें <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> का उपयोग होता है, जो अमेरिकी संघीय राजमार्ग प्रशासन (U.S. Federal Highway Administration) का निःशुल्क पाइपनाली कार्यक्रम है।</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>क्या आप स्वच्छता सीवर डिज़ाइन कर रहे हैं?</dt><dd>4 से 96 इंच (100 से 2400 मिमी) पाइप के लिए <a target="_blank" href="/sewslope.php">न्यूनतम सीवर ढाल तालिकाएँ</a> देखें, जो m/m, mm/m और प्रतिशत में दी गई हैं, और बहुत कम प्रवाह के लिए <a target="_blank" href="/peakfact.php">पीक कारक</a> अध्ययन देखें। दोनों केवल अंग्रेज़ी में संदर्भ दस्तावेज़ हैं।</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='एक धनात्मक लक्ष्य Q दर्ज करें।';
$ec_lang['mpf_solver_no_solution']='कोई हल नहीं: y/d0 = 93.8% पर Q पाइप की क्षमता से अधिक है (चयनित इकाइयों में Qmax = {qmax})।';
$ec_lang['mpf_solve_btn']='हल करें';
$ec_lang['mpf_solve_for_flow']='प्रवाह के लिए, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='मैनिंग पाइप शीर्ष हानि';
$ec_lang['mphl_main_title']='मुफ़्त ऑनलाइन मैनिंग पाइप शीर्ष हानि कैलकुलेटर';
$ec_lang['mphl_main_desc']='दिए गए पूर्ण प्रवाह पर मैनिंग सूत्र शीर्ष हानि';
$ec_lang['mphl_pipe_length']='पाइप लंबाई, L';
$ec_lang['mphl_area']='क्षेत्रफल, A';
$ec_lang['mphl_total_junction_k']='मामूली (स्थानीय) हानि गुणांक, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='हानि गुणांक, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='मामूली (स्थानीय) हानि गुणांक, km। ये हानियाँ पाइप जंक्शन, प्रवेश, निकास, मोड़ (बेंड), और वाल्वों पर होती हैं — "मामूली" शब्द पारंपरिक है पर भ्रामक है; एक छोटी लाइन में ये घर्षण हानियों के बराबर या उनसे अधिक हो सकती हैं। विशिष्ट k मान: तीक्ष्ण किनारे वाला प्रवेश 0.5, प्रत्येक 45° मोड़ 0.2–0.3, गेट वाल्व (पूर्ण खुला) 0.1, बटरफ्लाई वाल्व 0.2, निकास (जलाशय या वायुमंडल में) 1.0। कुल km के लिए सभी फिटिंगों को जोड़ें। डिफ़ॉल्ट मान 2.0 एक प्रवेश, एक निकास, और दो 45° मोड़ मानकर लिया गया है।';
$ec_lang['mphl_friction_slope']='घर्षण ढलान';
$ec_lang['mphl_friction_loss']='घर्षण हानि, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='मामूली (स्थानीय) हानि, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='कुल हानि, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='अनुप्रवाह EGL';
$ec_lang['mphl_egl_2']='उर्ध्वप्रवाह EGL';
$ec_lang['mphl_hgl_egl_tip']='यह परिणाम वहाँ मान्य नहीं हो सकता जहाँ पाइप हाइड्रॉलिक ग्रेड रेखा से ऊपर उठता है।';
$ec_lang['mphl_note_1']='<dl><dt>यह कैलकुलेटर दोनों सिरों के बीच पाइप प्रोफ़ाइल का मॉडल नहीं बनाता।</dt><dd>यदि किसी भी बिंदु पर HGL पाइप के शीर्ष से नीचे चली जाए, तो यह गणना मान्य नहीं हो सकती।</dd><dt>खुले इनलेट (पाइपनाली) की स्थिति के लिए, इनलेट नियंत्रण स्थितियों की जाँच आवश्यक है।</dt><dd>1. उर्ध्वप्रवाह HGL उर्ध्वप्रवाह सामान्य गहराई प्रवाह स्तर से ऊपर होनी चाहिए (और पाइप से भी ऊँची!)।</dd><dd>2. पाइपनाली का शीर्ष जल उर्ध्वप्रवाह HGL की तुलना में उर्ध्वप्रवाह EGL द्वारा बेहतर दर्शाया जाता है।</dd><dd>3. सरल मानक पाइपनाली शीर्ष जल गणना के लिए <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">मेरा 2-मिनट का ट्यूटोरियल</a> देखें, जिसमें <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> का उपयोग होता है, जो अमेरिकी संघीय राजमार्ग प्रशासन (U.S. Federal Highway Administration) का निःशुल्क पाइपनाली कार्यक्रम है।</dd><dd>4. यह पृष्ठ केवल आउटलेट नियंत्रण स्थिति को हल करता है: एक पूरी तरह भरा हुआ पाइप, जहाँ अनुप्रवाह स्थितियाँ शीर्ष निर्धारित करती हैं। पाइपनाली डिज़ाइन में यह तय करना शामिल है कि इनलेट नियंत्रण या आउटलेट नियंत्रण प्रभावी है, इसलिए जब भी दोनों में से कोई भी संभव हो, HY-8 का उपयोग करें।</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='मैनिंग समलम्बाकार नाली';
$ec_lang['mtc_main_title']='मुफ़्त ऑनलाइन मैनिंग सूत्र समलम्बाकार नाली कैलकुलेटर';
$ec_lang['mtc_main_desc']='दिए गए ढलान और गहराई पर मैनिंग सूत्र एकसमान समलम्बाकार नाली प्रवाह';
$ec_lang['mtc_bottom_width']='तल चौड़ाई, b';
$ec_lang['mtc_side_slope_1']='पार्श्व ढलान 1, z<sub>1</sub> (क्षैतिज/ऊर्ध्वाधर)';
$ec_lang['mtc_side_slope_2']='पार्श्व ढलान 2, z<sub>2</sub> (क्षैतिज/ऊर्ध्वाधर)';
$ec_lang['mtc_channel_slope']='नाली ढलान, S';
$ec_lang['mtc_flow_depth']='प्रवाह गहराई, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">मोड़ कोण, β</a><span class="ec-help" title="चट्टान अस्तर आकार निर्धारण के लिए। चित्र के लिए लिंक पर जाएं।"><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="पानी की तुलना में घनत्व। कुचली हुई चट्टान के लिए सामान्यतः ≈ 2.65">चट्टान का विशिष्ट गुरुत्व, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='डिज़ाइन चट्टान आकार, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='डिज़ाइन चट्टान आकार के लिए n (Strickler विधि)';
$ec_lang['mtc_n_blodgett']='डिज़ाइन चट्टान आकार के लिए n (Blodgett विधि)';
$ec_lang['mtc_n_bathurst']='डिज़ाइन चट्टान आकार के लिए n (Bathurst विधि)';
$ec_lang['mtc_n_pi']='डिज़ाइन चट्टान आकार के लिए n (Phillips & Ingersoll विधि)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett बनाम Bathurst';
$ec_lang['mtc_pi_range_check']='P&I सीमा जाँच';
$ec_lang['mtc_pi_ok']='d50, P&I सीमा में';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='सीमा से बाहर';
$ec_lang['mtc_pi_tip']='यह समीकरण जिस 0.28–0.36 ft डेटासेट सीमा से विकसित किया गया था, उससे बाहर एक्सट्रापोलेशन (परिसीमा-बाह्य विस्तार) — इसे केवल एक मोटा जाँच मानें, डिज़ाइन आधार नहीं';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Isbash (1936) और Maricopa County, Arizona, US के अनुसार।">तल के लिए आवश्यक कोणीय चट्टान आकार, D<sub>50</sub> (Isbash और MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Isbash (1936) और Maricopa County, Arizona, US के अनुसार।">पार्श्व ढलान 1 के लिए आवश्यक कोणीय चट्टान आकार, D<sub>50</sub> (Isbash और MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Isbash (1936) और Maricopa County, Arizona, US के अनुसार।">पार्श्व ढलान 2 के लिए आवश्यक कोणीय चट्टान आकार, D<sub>50</sub> (Isbash और MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Maynord, Ruff, and Abt (1989) के अनुसार। मोड़ पर चट्टान का आकार औसत के 4/3 गुना मोड़-वेग के लिए तय किया जाता है, California Division of Highways (1970) के अनुसार; Maynord का अपना 1.5 प्राकृतिक चैनलों पर लागू होता है।">आवश्यक कोणीय चट्टान आकार, D<sub>50</sub> (Maynord, Ruff, and Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='आवश्यक कोणीय चट्टान आकार, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='वेग एकसमान-प्रवाह मान्यताओं के लिए उचित है।';
$ec_lang['mtc_vel_low']='वेग कम है; अवसादन का जोखिम।';
$ec_lang['mtc_vel_high']='वेग अधिक है और यह वास्तविक न भी हो सकता है; चैनल अस्तर के कटाव, मोड़ों पर अतिरिक्त गहराई, और विस्तारों या बाधाओं पर ऊर्जा हानि की जाँच करें।';
$ec_lang['mtc_iteration_tip']='अपने लक्षित प्रवाह के लिए एकसमान चट्टान आकार की ओर स्वचालित पुनरावृत्ति हेतु एक खुरदरापन विकल्प (Blodgett–Bathurst अनुशंसित) और एक चट्टान आकार विकल्प (Isbash अनुशंसित) चुनें। पूरी विधि के लिए नीचे नोट देखें, या पुनरावृत्ति छोड़ने के लिए अपना खुरदरापन मान स्वयं (मार्गदर्शन के लिए लिंक देखें) दर्ज करें और चट्टान आकार को अनदेखा करें।';
$ec_lang['mtc_note_1']='<dl><dt>स्वचालित चट्टान आकार और खुरदरापन डिज़ाइन पुनरावृत्ति</dt><dd>एक खुरदरापन विकल्प चुनें (Blodgett–Bathurst अनुशंसित) और एक डिज़ाइन चट्टान आकार विकल्प चुनें (Isbash अनुशंसित)। एकसमान चट्टान आकार के साथ अपना लक्षित प्रवाह प्राप्त करने के लिए गहराई और चट्टान आकार सुरक्षा कारक को समायोजित करें। जब भी आप कोई इनपुट बदलते हैं, कैलकुलेटर ये चरण दोहराता है: 1. डिज़ाइन चट्टान आकार से खुरदरापन की गणना की जाती है। 2. आपके चुने गए तरीके से मिला खुरदरापन मान इनपुट खुरदरापन में कॉपी किया जाता है। 3. नाली प्रवाह और आवश्यक चट्टान आकार की गणना की जाती है। 4. डिज़ाइन चट्टान आकार समायोजित किया जाता है। 5. डिज़ाइन चट्टान आकार में त्रुटि बहुत छोटी होने तक दोहराएँ।</dd><dt>बुनियादी कैलकुलेटर (पुनरावृत्ति रहित)</dt><dd>अपना वांछित खुरदरापन मान दर्ज करें। डिज़ाइन चट्टान आकार इनपुट क्षेत्र को अनदेखा करें।</dd></dl>';
$ec_lang['mtc_note_2_term']='वेग जाँच';
$ec_lang['mtc_note_2_def']='उच्च वेग यह दर्शाता है कि एक बड़ा ऊँचाई ह्रास हुआ जिसने इतनी अधिक विशिष्ट ऊर्जा उत्पन्न की। वह ऊर्जा विस्तारों, मोड़ों या बाधाओं पर शीघ्रता से नष्ट हो सकती है। सत्यापित करें कि यह स्थल के लिए उचित है।';
$ec_lang['mtc_solver_no_solution']='इन नाली इनपुट के साथ दिए गए Q के लिए कोई हल नहीं मिला।';
// Weir Flow Simple
$ec_lang['ws_main_menu']='सरल वियर प्रवाह';
$ec_lang['ws_main_title']='मुफ़्त ऑनलाइन सरल चौड़ी-शिखर वियर प्रवाह कैलकुलेटर';
$ec_lang['ws_main_desc']='सरल चौड़ी-शिखर वियर प्रवाह कैलकुलेटर';
$ec_lang['ws_weirLength']='वियर लंबाई, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="पानी के प्रति इकाई भार की ऊर्जा — जल स्तंभ की एक ऊँचाई, दाब नहीं">शीर्ष, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='वियर गुणांक, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='नोट';
$ec_lang['ws_notes_we_term']='वियर समीकरण';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='अनियमित प्रोफाइल वियर प्रवाह';
$ec_lang['wi_main_title']='मुफ़्त ऑनलाइन खंडित, परिवर्तनशील गहराई, अनियमित प्रोफाइल वियर प्रवाह कैलकुलेटर';
$ec_lang['wi_main_desc']='अनियमित प्रोफाइल वियर प्रवाह कैलकुलेटर';
$ec_lang['wi_weirPoints']='वियर बिंदु';
$ec_lang['wi_pondingHeight']='ताल की ऊँचाई';
$ec_lang['wi_incrementalFlow']='वृद्धिशील प्रवाह';
$ec_lang['wi_cumulativeFlow']='संचित प्रवाह';
$ec_lang['wi_notes_we_def']='q = यदि (लंबाई = 0) तो 0 अन्यथा यदि (ढलान=0) तो cw*लंबाई*d<sub>0</sub><sup>1.5</sup> अन्यथा cw/(2.5*ढलान) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) जहाँ d<sub>1</sub> और d<sub>0</sub> सदा शून्य या धनात्मक हैं';
// Orifice Flow
$ec_lang['or_main_menu']='छिद्र प्रवाह';
$ec_lang['or_main_title']='मुफ़्त ऑनलाइन छिद्र प्रवाह कैलकुलेटर';
$ec_lang['or_main_desc']='छिद्र प्रवाह — स्वतंत्र या जलमग्न';
$ec_lang['or_shape_circular']='वृत्ताकार';
$ec_lang['or_shape_rectangular']='आयताकार';
$ec_lang['or_diameter']='<span class="ec-help" title="वृत्ताकार के लिए व्यास; आयताकार के लिए ऊँचाई">व्यास या ऊँचाई, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="केवल आयताकार उद्घाटन">चौड़ाई, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="उद्घाटन का तल">इनवर्ट स्तर <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='अपस्ट्रीम जल स्तर';
$ec_lang['or_twe']='डाउनस्ट्रीम जल स्तर';
$ec_lang['or_cd']='निर्वहन गुणांक, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='केन्द्रक स्तर';
$ec_lang['or_head']='<span class="ec-help" title="पानी के प्रति इकाई भार की ऊर्जा — जल स्तंभ की एक ऊँचाई, दाब नहीं">प्रभावी शीर्ष, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='उद्घाटन क्षेत्रफल, A';
$ec_lang['or_regime']='छिद्र व्यवस्था जाँच';
$ec_lang['or_regime_valid']='स्वतंत्र निकास';
$ec_lang['or_regime_submerged']='जलमग्न छिद्र';
$ec_lang['or_regime_submerged_tip']='TWE केन्द्रक के ऊपर है — छिद्र व्यवस्था अभी भी वैध है';
$ec_lang['or_regime_warn']='छिद्र व्यवस्था से बाहर';
$ec_lang['or_regime_warn_tip']='अपस्ट्रीम जल स्तर उद्घाटन के शिखर से नीचे है';
$ec_lang['or_regime_twe_above_hwe']='इनपुट जाँचें';
$ec_lang['or_regime_twe_above_hwe_tip']='डाउनस्ट्रीम जल (TWE) अपस्ट्रीम जल (HWE) से ऊपर';
$ec_lang['or_notes_1_term']='छिद्र समीकरण';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh)। स्वतंत्र निकास: h = HWE − केन्द्रक। जलमग्न प्रवाह (इनवर्ट के ऊपर TWE): h = HWE − TWE।';
$ec_lang['or_notes_2_term']='छिद्र व्यवस्था';
$ec_lang['or_notes_2_def']='छिद्र प्रवाह समीकरण तब लागू होते हैं जब अपस्ट्रीम जल सतह उद्घाटन के शिखर (ऊपर) से ऊपर हो। जब अपस्ट्रीम जल शिखर से नीचे हो, तो वियर समीकरण का उपयोग करें।';
$ec_lang['or_notes_3_term']='निर्वहन गुणांक';
$ec_lang['or_notes_3_def']='तीखे-किनारे वाले छिद्रों के लिए C<sub>d</sub> लगभग 0.60–0.65 तक होता है। गोलाकार या पुनः-प्रवेशी इनलेट अलग मूल्य उपयोग करते हैं। मार्गदर्शन के लिए <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> या HEC-RAS हाइड्रॉलिक संदर्भ मैनुअल देखें।';
$ec_lang['or_notes_4_term']='जलमग्नता';
$ec_lang['or_notes_4_def']='जब TWE उद्घाटन इनवर्ट के ऊपर हो, तो यह कैलकुलेटर स्वचालित रूप से h = HWE − TWE का उपयोग करके जलमग्न छिद्र समीकरण लागू करता है। जब TWE इनवर्ट पर या उससे नीचे हो, तो स्वतंत्र निकास माना जाता है और h = HWE − केन्द्रक।';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='माइक्रो-हाइड्रो पावर';
$ec_lang['mhp_main_title']='निःशुल्क ऑनलाइन माइक्रो-हाइड्रो पावर कैलकुलेटर';
$ec_lang['mhp_main_desc']='नदी-प्रवाह माइक्रो-हाइड्रो पावर आउटपुट कैलकुलेटर';
$ec_lang['mhp_gross_head']='सकल हेड, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="दबाव नली (आपूर्ति पाइप) का व्यास">दबाव नली व्यास, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='लंबाई, L';
$ec_lang['mhp_efficiency']='प्लांट दक्षता, η (0–1)';
$ec_lang['mhp_vel_check']='वेग जाँच';
$ec_lang['mhp_hl_check']='हेड हानि जाँच';
$ec_lang['mhp_hnet']='शुद्ध हेड, H<sub>net</sub>';
$ec_lang['mhp_power']='शक्ति उत्पादन, P';
$ec_lang['mhp_annual_kwh']='वार्षिक ऊर्जा के रूप में P';
$ec_lang['mhp_vel_low']='वेग कम है; अवसादन और वायु-प्रवेश का जोखिम है।';
$ec_lang['mhp_vel_high']='वेग अधिक है; संक्रमण हानियों, उपलब्ध ऊर्जा और वाटर हैमर की जाँच करें।';
$ec_lang['mhp_vel_ok_short']='ठीक';
$ec_lang['mhp_vel_high_short']='अधिक';
$ec_lang['mhp_vel_low_short']='कम';
$ec_lang['mhp_vel_ok_tip']='वेग दबाव नली डिज़ाइन के लिए दक्ष सीमा में है।';
$ec_lang['mhp_hl_ok_tip']='हेड हानि सकल हेड के 10% से कम है। यह पाइप आकार किफ़ायती है।';
$ec_lang['mhp_hl_warn_tip']='हेड हानि सकल हेड के 10% से अधिक है। बड़े पाइप पर विचार करें।';
$ec_lang['mhp_hl_bad_tip']='हेड हानि सकल हेड के 20% से अधिक है। पाइप का आकार बदलें।';
$ec_lang['mhp_notes_1_term']='हेड हानि';
$ec_lang['mhp_notes_1_def']='कुल दबाव नली (आपूर्ति पाइप) हानि h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, जहाँ h<sub>f</sub> = f(L/D)(v²/2g) डार्सी-वाइसबैक घर्षण हानि है और h<sub>m</sub> = k<sub>m</sub>·v²/2g प्रवेश, मोड़ और वाल्वों को शामिल करती है। शुद्ध हेड H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='वेग';
$ec_lang['mhp_notes_2_def']='जाँचें कि वेग उपलब्ध ड्रॉप और पाइप लागत के लिए उचित है। बहुत कम वेग अत्यधिक बड़े आकार का संकेत हो सकता है; बहुत अधिक वेग घर्षण हानि और वाटर हैमर के जोखिम को बढ़ा सकता है।';
$ec_lang['mhp_notes_3_term']='हेड हानि लक्ष्य';
$ec_lang['mhp_notes_3_def']='दबाव नली (आपूर्ति पाइप) की हानि, सकल हेड के 10% से कम, सामान्यतः किफ़ायती होती है। पाइप लागत और खोई शक्ति के बीच इष्टतम संतुलन प्रायः 4–6% के आसपास होता है, जहाँ बिजली की कीमत सबसे अधिक होती है।';
$ec_lang['mhp_notes_6_term']='दक्षता';
$ec_lang['mhp_notes_6_def']='माइक्रो-हाइड्रो में सामान्य Pelton और क्रॉस-फ्लो टर्बाइनों के लिए विशिष्ट प्लांट दक्षता η 0.70 से 0.85 तक होती है। एक रूढ़िवादी प्रारंभिक अनुमान के रूप में 0.75 का उपयोग करें।';
$ec_lang['mhp_notes_7_term']='वार्षिक ऊर्जा';
$ec_lang['mhp_notes_7_def']='वार्षिक ऊर्जा निरंतर पूर्ण-प्रवाह संचालन (8760 घंटे/वर्ष) मानती है। मौसमी प्रवाह भिन्नता, रखरखाव डाउनटाइम और लोड फैक्टर के कारण वास्तविक उत्पादन कम होगा।';

// Orifice Drain Time
$ec_lang['odt_main_menu']='तालाब और टंकी निकासी समय';
$ec_lang['odt_main_title']='मुफ़्त ऑनलाइन तालाब, बेसिन और टंकी निकासी समय कैलकुलेटर (छिद्र)';
$ec_lang['odt_main_desc']='तालाब, बेसिन या टंकी निकासी समय — छिद्र आउटलेट, शंक्वाकार आयतन विधि';
$ec_lang['odt_h1_elev']='प्रारंभिक जल सतह स्तर';
$ec_lang['odt_a1']='प्रारंभिक क्षेत्रफल, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='अंतिम जल सतह स्तर';
$ec_lang['odt_a0']='छिद्र-स्तर क्षेत्रफल, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="अंतिम स्तर पर शंक्वाकार मॉडल से प्रक्षेपित">अंतिम क्षेत्रफल, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='अंतिम स्तर जाँच';
$ec_lang['odt_h2_ok']='अंतिम स्तर छिद्र शिखर के ऊपर';
$ec_lang['odt_h2_warn']='अंतिम स्तर छिद्र शिखर पर या उससे नीचे';
$ec_lang['odt_h2_warn_tip']='छिद्र शिखर = केन्द्रक + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="व्यास (वृत्ताकार) या ऊँचाई (आयताकार)">छिद्र D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="केवल आयताकार">छिद्र चौड़ाई, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='निकासी समय (से.)';
$ec_lang['odt_t_min']='निकासी समय (मि.)';
$ec_lang['odt_t_hr']='निकासी समय (घं.)';
$ec_lang['odt_t_day']='निकासी समय (दिन)';
$ec_lang['odt_notes_1_term']='सूत्र';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) शीर्ष H से छिद्र तक निकासी समय देता है। निकासी समय = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), जहाँ H<sub>1</sub> = प्रारंभिक स्तर − छिद्र स्तर, H<sub>2</sub> = अंतिम स्तर − छिद्र स्तर।';
$ec_lang['odt_notes_2_term']='विधि';
$ec_lang['odt_notes_2_def']='शंक्वाकार आयतन विधि तालाब या बेसिन को प्रारंभिक जल सतह पर A<sub>1</sub> और छिद्र केन्द्रक स्तर पर A<sub>0</sub> के बीच एक शंक्वाकार खंड के रूप में मॉडल करती है। A<sub>2</sub>, अंतिम स्तर पर तालाब का क्षेत्रफल, शंक्वाकार खंड मॉडल का उपयोग करके A<sub>1</sub> और A<sub>0</sub> से प्रक्षेपित किया जाता है। प्रारंभिक से अंतिम स्तर तक निकासी समय H<sub>1</sub> से छिद्र तक कुल निकासी समय से H<sub>2</sub> से छिद्र तक शेष निकासी समय घटाने के बराबर है।';
$ec_lang['odt_h1']='<span class="ec-help" title="प्रारंभिक जल सतह स्तर घटा छिद्र केन्द्रक स्तर">प्रारंभिक शीर्ष, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='अधिकतम प्रवाह, Q<sub>max</sub>';
$ec_lang['odt_vol']='निकाला गया आयतन';
$ec_lang['odt_sketch_start']='प्रारंभ';
$ec_lang['odt_sketch_end']='अंत';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='उत्सर्जक अंतराल, S<sub>e</sub>';
$ec_lang['ip_sl']='पार्श्व अंतराल, S<sub>l</sub>';
$ec_lang['ip_n_e']='प्रति पार्श्व उत्सर्जक, n<sub>e</sub>';
$ec_lang['ip_n_l']='प्रति क्षेत्र पार्श्व, n<sub>l</sub>';
$ec_lang['ip_d']='लक्ष्य अनुप्रयोग गहराई, d';
$ec_lang['ip_a_e']='प्रति उत्सर्जक क्षेत्रफल, A<sub>e</sub>';
$ec_lang['ip_pr']='अनुप्रयोग दर, PR';
$ec_lang['ip_q_lat']='प्रति पार्श्व प्रवाह, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='क्षेत्र प्रवाह, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='चलने का समय (घंटे)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='नहर रिसाव';
$ec_lang['cs_main_title']='मुफ़्त ऑनलाइन नहर रिसाव हानि और संवहन दक्षता कैलकुलेटर';
$ec_lang['cs_main_desc']='नहर रिसाव हानि और संवहन दक्षता — अंतर्वाह-बहिर्वाह विधि';
$ec_lang['cs_Q_in']='अंतर्वाह, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='बहिर्वाह, Q<sub>out</sub>';
$ec_lang['cs_L']='खंड की लंबाई, L';
$ec_lang['cs_Q_loss']='रिसाव हानि दर, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='माप जाँच';
$ec_lang['cs_pct_loss']='हानि भिन्न';
$ec_lang['cs_Ec']='संवहन दक्षता, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='दक्षता रेटिंग';
$ec_lang['cs_Vol_day']='दैनिक खोया आयतन';
$ec_lang['cs_Vol_year']='वार्षिक खोया आयतन';
$ec_lang['cs_Q_loss_per_L']='हानि प्रति लंबाई, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='जल मूल्य';
$ec_lang['cs_lining_cost']='अस्तर लागत';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="अस्तर के बाद संवहन दक्षता लक्ष्य; भिन्न 0–1">अस्तर लक्ष्य, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='अस्तर क्षेत्र, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='वार्षिक खोया मूल्य';
$ec_lang['cs_annual_value_recovered']='वार्षिक वसूल मूल्य';
$ec_lang['cs_lining_total_cost']='कुल अस्तर लागत';
$ec_lang['cs_payback_years']='<span class="ec-help" title="सरल चुकौती = कुल अस्तर लागत ÷ वार्षिक वसूल मूल्य">चुकौती अवधि <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — रिसाव पाया गया';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — कोई मापनीय हानि नहीं';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — माप जाँचें';
$ec_lang['cs_Ec_good']='अच्छी — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='ठीक — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='खराब — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='अंतर्वाह-बहिर्वाह विधि नहर खंड के शीर्ष और पुच्छ पर प्रवाह मापकर रिसाव का अनुमान लगाती है: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>। संवहन दक्षता E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>। वार्षिक आयतन निरंतर पूर्ण-प्रवाह संचालन मानता है; मौसमी या आंशिक-प्रवाह नहरों में वास्तविक हानि कम होती है।';
$ec_lang['cs_notes_2_term']='दक्षता रेटिंग';
$ec_lang['cs_notes_2_def']='सामान्य बिना अस्तर की मिट्टी नहरें: E<sub>c</sub> = 60–80%। अच्छी तरह रखरखाव वाली मिट्टी नहरें: 75–85%। कंक्रीट-अस्तर नहरें: 90–98%। अंतर्वाह के 30% से अधिक रिसाव हानि अक्सर अस्तर निवेश को उचित ठहराती है। (USBR, FAO)';
$ec_lang['cs_notes_3_term']='अस्तर चुकौती';
$ec_lang['cs_notes_3_def']='जल मूल्य और अस्तर लागत को किसी भी सुसंगत मुद्रा में दर्ज करें। अस्तर क्षेत्र = खंड की लंबाई × आर्द्र परिधि — मापी गई प्रवाह गहराई पर नहर क्रॉस-सेक्शन की आर्द्र परिधि (तल की चौड़ाई प्लस दोनों आर्द्र ढलानें)। वसूल किया गया वार्षिक मूल्य मानता है कि अस्तर नहर लक्ष्य E<sub>c</sub> को निरंतर प्राप्त करती है। यदि अस्तर लक्ष्य दक्षता तक नहीं पहुँचता या नहरें मौसमी होती हैं, तो वास्तविक चुकौती अवधि अधिक होगी।';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3rd ed. (2001)। FAO Irrigation and Drainage Paper 57 (1999)।';
// About
$ec_lang['about_main_menu']='के बारे में';
$ec_lang['install_main_menu']='इंस्टॉल करें';
$ec_lang['install_main_title']='EngCalcs इंस्टॉल करें';
$ec_lang['install_main_desc']='ऑफ़लाइन उपयोग के लिए अपने डिवाइस में जोड़ें';
$ec_lang['install_intro']='EngCalcs एक प्रोग्रेसिव वेब ऐप (PWA) है। एक बार इंस्टॉल करने के बाद, सभी कैलकुलेटर पूरी तरह ऑफ़लाइन काम करते हैं — इंटरनेट कनेक्शन की ज़रूरत नहीं।';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Chrome में कोई भी कैलकुलेटर पेज खोलें।</li><li>ऊपर नेविगेशन बार में <strong>⬇ इंस्टॉल करें</strong> बटन पर टैप करें, या ब्राउज़र मेनू (⋮) पर टैप करके <strong>होम स्क्रीन पर जोड़ें</strong> चुनें।</li><li>दिखाई देने वाले प्रॉम्प्ट में <strong>इंस्टॉल करें</strong> पर टैप करें।</li><li>EngCalcs आपकी होम स्क्रीन पर दिखेगा और ऑफ़लाइन काम करेगा।</li>';
$ec_lang['install_now_btn']='⬇ अभी इंस्टॉल करें';
$ec_lang['install_prompt_unavailable']='इंस्टॉल प्रॉम्प्ट उपलब्ध नहीं है — इसके बजाय अपने ब्राउज़र मेनू का उपयोग करें।';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Safari में कोई भी कैलकुलेटर पेज खोलें।</li><li><strong>Share</strong> बटन (ऊपर की ओर तीर वाला बॉक्स) पर टैप करें।</li><li>नीचे स्क्रॉल करें और <strong>Add to Home Screen</strong> पर टैप करें।</li><li><strong>Add</strong> पर टैप करें। EngCalcs आपकी होम स्क्रीन पर दिखेगा।</li>';
$ec_lang['install_ios_note']='iOS पर, इंस्टॉल करने के लिए हमेशा Share मेनू का उपयोग होता है — कोई स्वचालित इंस्टॉल प्रॉम्प्ट नहीं आता।';
$ec_lang['install_desktop_heading']='डेस्कटॉप (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>कोई भी कैलकुलेटर पेज खोलें।</li><li>ब्राउज़र के एड्रेस बार में <strong>इंस्टॉल आइकन</strong> (⊕ या कंप्यूटर आइकन) पर क्लिक करें, या ब्राउज़र मेनू खोलकर <strong>Install EngCalcs…</strong> चुनें।</li><li><strong>इंस्टॉल करें</strong> पर क्लिक करें। EngCalcs एक स्वतंत्र ऐप विंडो के रूप में खुलेगा।</li>';
$ec_lang['install_firefox_heading']='Firefox / अन्य ब्राउज़र';
$ec_lang['install_firefox_body']='यदि आपका ब्राउज़र इंस्टॉल का विकल्प नहीं देता, तो कुछ भी खोता नहीं: कैलकुलेटरों का उपयोग ब्राउज़र में सामान्य रूप से करें, और आपकी पहली विज़िट के बाद पृष्ठ ऑफ़लाइन उपयोग के लिए स्वतः कैश हो जाते हैं। डेस्कटॉप पर Firefox यही सामान्य स्थिति है।';
$ec_lang['install_cached_heading']='क्या-क्या कैश होता है';
$ec_lang['install_cached_body']='जब आप पहली बार EngCalcs इंस्टॉल करते हैं, तो सभी कैलकुलेटर पेज और उनकी सहायक फ़ाइलें (स्क्रिप्ट, स्टाइल) आपके डिवाइस पर अपने आप सहेज ली जाती हैं। इसके बाद, सब कुछ बिना इंटरनेट कनेक्शन के काम करता है। आपकी भाषा का चुनाव आपकी पिछली ऑनलाइन विज़िट से याद रखा जाता है।';
$ec_lang['contact_main_menu']='संपर्क';
$ec_lang['about_main_title']='HawsEDC इंजीनियरिंग कैलकुलेटर के बारे में';
$ec_lang['about_main_desc']='मिशन, मुक्त सॉफ़्टवेयर और योगदान';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>मिशन</h3><p>HawsEDC इंजीनियरिंग कैलकुलेटर 2010 से ऑनलाइन मुफ़्त उपलब्ध हैं। ये दुनिया भर के इंजीनियरों और क्षेत्रीय कार्यकर्ताओं की सेवा के लिए बने हैं — विशेषकर उन लोगों के लिए जो जल-संकटग्रस्त, संसाधन-सीमित या वंचित क्षेत्रों में काम करते हैं। ये उपकरण एक व्यापक मानवीय मिशन का हिस्सा हैं: हर इंसान को सबसे व्यावहारिक और प्रभावी तरीके से यह बताना <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">कि वे हमेशा के लिए प्यार किए गए और संजोए गए हैं, कि उन्हें डरने की कोई जरूरत नहीं, और वे सब कुछ बर्बाद नहीं करेंगे</a>।</p><p>कैलकुलेटर साधन हैं। गंतव्य एक कष्ट-मुक्त संसार है।</p><h3>मुक्त एवं ओपन सोर्स लाइसेंस</h3><p>सभी कोड <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 या बाद के संस्करण</a> के तहत जारी किया गया है — स्वतंत्रता के अर्थ में मुक्त। आप कोड को उन्हीं शर्तों के तहत उपयोग, अध्ययन, संशोधन और पुनर्वितरित कर सकते हैं।</p><p>इसे चलाने वाली वेबसाइट आज और 2010 से मुफ़्त उपलब्ध कराई जाती है; यदि कभी ऐसा न हो सके, तब भी सॉफ़्टवेयर चलाना आपके हाथ में रहेगा।</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>सोर्स कोड</h3><p>पूरा सोर्स कोड GitHub पर सार्वजनिक रूप से उपलब्ध है:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>आप वहाँ कोड ब्राउज़ कर सकते हैं, समस्याएँ दर्ज कर सकते हैं, या रिपॉजिटरी फोर्क कर सकते हैं।</p><h3>योगदान</h3><p>हर सहायता का स्वागत है। <a href="contact.php">Tom Haws से संपर्क करें</a>।</p><ul><li><strong>अनुवाद:</strong> बेहतर शब्दों का सुझाव दें। किसी भाषा को सुधारें या नई भाषा जोड़ें।</li><li><strong>बग रिपोर्ट:</strong> किसी भी कैलकुलेटर पेज पर फीडबैक फॉर्म का उपयोग करें, या GitHub पर समस्या दर्ज करें।</li><li><strong>नए कैलकुलेटर:</strong> हाइड्रोलिक इंजीनियरिंग टूल के लिए विचार, जो क्षेत्रीय कार्यकर्ताओं और सिंचाई पेशेवरों की सेवा करें, विशेष रूप से स्वागत योग्य हैं।</li><li><strong>होस्टिंग:</strong> यदि आप सीमित कनेक्टिविटी वाले क्षेत्र के लिए इन कैलकुलेटरों को मिरर कर सकते हैं, तो कृपया मुझसे संपर्क करें।</li></ul><h3>ऑफ़लाइन उपयोग</h3><p>ऑनलाइन रहते हुए किसी भी कैलकुलेटर को एक बार खोलें, और ऑफ़लाइन होने पर भी सभी चलते रहेंगे: आपका ब्राउज़र आगे बढ़ते हुए पूरा सूट सहेज लेता है। यदि आप इसके बारे में पढ़ना चाहें, तो इसकी प्रणाली <strong>प्रोग्रेसिव वेब ऐप (PWA)</strong> है। उसके बाद सभी कैलकुलेटर ऑफ़लाइन काम करते हैं — इंटरनेट की आवश्यकता नहीं।</p><p>Android या iOS पर, अपने ब्राउज़र की "होम स्क्रीन में जोड़ें" सुविधा का उपयोग करके EngCalcs को अपने डिवाइस पर एक ऐप के रूप में इंस्टॉल करें। डेस्कटॉप पर, अपने ब्राउज़र के एड्रेस बार में इंस्टॉल आइकन देखें।</p><p>आप अपने ब्राउज़र के "इस रूप में सहेजें…" मेनू का उपयोग करके किसी भी कैलकुलेटर को एकल उपयोग के लिए सहेज भी सकते हैं।</p><h3>संपर्क</h3><p>Tom Haws — हाइड्रोलिक इंजीनियर और इन कैलकुलेटरों के संस्थापक।<br />किसी भी कैलकुलेटर पेज पर फीडबैक फॉर्म का उपयोग करें, या <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a> पर सोर्स कोड देखें।</p>';
$ec_lang['contactSendMessage']='Tom Haws को संदेश भेजें';
$ec_lang['contactYourName']='आपका नाम:';
$ec_lang['contactYourEmail']='आपका ई-मेल पता:';
$ec_lang['contactSubject']='विषय:';
$ec_lang['contact_message']='संदेश:';
$ec_lang['contactSpamPrefix']='पाँच जमा एक बराबर';
$ec_lang['contactSpamPostfix']='(कृपया अंग्रेज़ी में लिखें। 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='संदेश भेजें';
$ec_lang['contact_success']='आपका समय लेने के लिए धन्यवाद।';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='चट्टानी ढाल संरचना डिज़ाइन (Robinson)';
$ec_lang['rc_main_title']='मुफ्त ऑनलाइन चट्टानी ढाल संरचना डिज़ाइन कैलकुलेटर — Robinson (1998)';
$ec_lang['rc_main_desc']='तीव्र ढाल चैनल चट्टान अस्तर आकार — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='तीव्र ढाल चैनल तल ढाल, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="तीव्र ढाल चैनल इनलेट पर प्रति इकाई चौड़ाई प्रवाह। तल चौड़ाई B वाले चैनल में कुल प्रवाह Q के लिए, q_t = Q / B उपयोग करें।">कुल इकाई प्रवाह, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='चट्टान अस्तर सरंध्रता, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="पानी की तुलना में घनत्व। सामान्य कुचली ग्रेनाइट या बेसाल्ट के लिए ≈ 2.65। Robinson वैध सीमा: 2.54 से 2.82।">चट्टान आपेक्षिक घनत्व, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="श्रेणीकरण मानक विचलन। एकसमान चट्टान ≈ 1.25। Robinson वैध सीमा: 1.15 से 1.47।">श्रेणीकरण SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="ताल बनना (Hp > yn) अच्छा है — अपस्ट्रीम कटाव कम करता है। (USDA)">इनलेट चैनल में सामान्य गहराई, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="समी. 1 (S0 < 0.10) या समी. 2 (0.10-0.40)। वैध: D50 15-278 mm, S0 0.02-0.40। सीमा के बाहर: बहिर्वेशित।">आवश्यक माध्यिका चट्टान आकार, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='लागू समीकरण';
$ec_lang['rc_sg_check']='आपेक्षिक घनत्व जाँच';
$ec_lang['rc_SD_check']='श्रेणीकरण SD जाँच';
$ec_lang['rc_sg_ok']='sg वैध सीमा में';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']='sg Robinson सीमा से नीचे';
$ec_lang['rc_sg_low_tip']='वैध सीमा: 2.54–2.82';
$ec_lang['rc_sg_high']='sg Robinson सीमा से ऊपर';
$ec_lang['rc_sg_high_tip']='वैध सीमा: 2.54–2.82';
$ec_lang['rc_SD_ok']='SD वैध सीमा में';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']='SD Robinson सीमा से नीचे';
$ec_lang['rc_SD_low_tip']='वैध सीमा: 1.15–1.47';
$ec_lang['rc_SD_high']='SD Robinson सीमा से ऊपर';
$ec_lang['rc_SD_high_tip']='वैध सीमा: 1.15–1.47';
$ec_lang['rc_layer']='चट्टान परत मोटाई (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='शीर्ष क्रेस्ट वक्र त्रिज्या (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='शीर्ष क्रेस्ट वक्र चाप लंबाई';
$ec_lang['rc_apron_length']='<span class="ec-help" title="तीव्र ढाल चैनल की चट्टान अस्तर के संरचनात्मक समर्थन के लिए आवश्यक। “निर्गम खंड और अनुप्रवाह चैनल प्रतिरोध के परिणामस्वरूप उत्पन्न न्यूनतम अनुप्रवाह जल निर्गम खंड में चट्टान अस्तर की स्थिरता सुनिश्चित करने के लिए पर्याप्त है।” (Robinson)">निर्गम एप्रन लंबाई (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='तीव्र ढाल चैनल में Manning खुरदरापन, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="q_t का वह भाग जो चट्टान के छिद्रों से बहता है। शेष q_s सतह पर बहता है। कोणीय कुचली चट्टान के लिए डिफ़ॉल्ट n_p = 0.45।">चट्टान आवरण से गुज़रता वेग, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='आवरण से इकाई प्रवाह, q<sub>m</sub>';
$ec_lang['rc_qs']='सतही इकाई प्रवाह, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='चट्टान अस्तर सतह के ऊपर प्रवाह गहराई, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="ताल बनना (Hp > yn) अच्छा है — अपस्ट्रीम कटाव कम करता है। (USDA)">इनलेट वियर शीर्ष, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='इनलेट पर ताल बनने की जाँच';
$ec_lang['rc_pond_ok']='H<sub>p</sub> > y<sub>n</sub> — अपस्ट्रीम में ताल बनना';
$ec_lang['rc_pond_ok_tip']='तीव्र ढाल चैनल इनलेट के अपस्ट्रीम में ताल बनना अच्छा है; यह अपस्ट्रीम कटाव को कम करता है। (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — कोई ताल नहीं बनता — इनलेट कटाव की संभावना';
$ec_lang['rc_pond_warn_tip']='तीव्र ढाल चैनल इनलेट के अपस्ट्रीम में कोई ताल नहीं बनता; अपस्ट्रीम कटाव हो सकता है। (USDA)';
$ec_lang['rc_eq1']='समी. 1 (S<sub>0</sub> < 0.10) — सौम्य ढाल';
$ec_lang['rc_eq2']='समी. 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — तीव्र ढाल';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — Robinson सत्यापन सीमा से नीचे';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — Robinson सत्यापन सीमा से ऊपर';
$ec_lang['rc_notes_1_term']='चट्टान साइज़िंग समीकरण';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) ने चैनल ढाल और इकाई प्रवाह के आधार पर माध्यिका चट्टान अस्तर आकार D<sub>50</sub> के लिए दो अनुभवजन्य समीकरण विकसित किए। समीकरण 1 सौम्य ढालों के लिए लागू होता है (S<sub>0</sub> < 0.10); समीकरण 2 तीव्र ढालों के लिए लागू होता है (0.10 ≤ S<sub>0</sub> ≤ 0.40)। दोनों समीकरणों में q<sub>t</sub> m²/s में आवश्यक है और D<sub>50</sub> mm में प्राप्त होता है। सत्यापित सीमा 0.02 ≤ S<sub>0</sub> ≤ 0.40 है।';
$ec_lang['rc_notes_2_term']='इकाई प्रवाह';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> तीव्र ढाल चैनल क्रेस्ट पर कुल इकाई प्रवाह है (प्रति इकाई चौड़ाई कुल प्रवाह)। तल चौड़ाई B और कुल प्रवाह Q वाले चैनल के लिए, q<sub>t</sub> ≈ Q / B अनुमानित करें, या तीव्र ढाल चैनल इनलेट पर क्रांतिक गहराई की स्थिति से इसकी गणना करें।';
$ec_lang['rc_notes_3_term']='चट्टान आवरण से प्रवाह';
$ec_lang['rc_notes_3_def']='कुल प्रवाह का एक भाग चट्टान अस्तर के छिद्रों से होकर बहता है (आवरण प्रवाह q<sub>m</sub>); शेष भाग चट्टान की सतह के ऊपर बहता है (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>)। प्रवाह गहराई d की गणना तीव्र ढाल चैनल खुरदरापन n का उपयोग करते हुए सतही प्रवाह q<sub>s</sub> पर Manning के समीकरण से की जाती है। कोणीय कुचली चट्टान के लिए डिफ़ॉल्ट सरंध्रता n<sub>p</sub> = 0.45 विशिष्ट है।';
$ec_lang['rc_notes_5_term']='वैध चट्टान आकार सीमा';
$ec_lang['rc_notes_5_def']='समीकरण D<sub>50</sub> की 15 mm से 278 mm की सीमा का उपयोग करके विकसित किए गए थे। इस सीमा के बाहर के परिणाम बहिर्वेशित हैं और इन्हें अतिरिक्त इंजीनियरिंग निर्णय के साथ उपयोग किया जाना चाहिए।';
$ec_lang['rc_notes_6_term']='निर्गम एप्रन ऊँचाई';
$ec_lang['rc_notes_6_def']='निर्गम खंड में चट्टान अस्तर के शीर्ष की ऊँचाई अनुप्रवाह चैनल तल की ऊँचाई पर या उससे नीचे होनी चाहिए। यदि यह अधिक है, तो निर्गम चट्टान अस्थिर होगी।';

$ec_lang['rc_notes_7_def']='जब इनलेट चैनल में सामान्य गहराई q<sub>t</sub> को पारित करने के लिए आवश्यक वियर शीर्ष (H<sub>p</sub>) से कम होती है, तो तीव्र ढाल चैनल इनलेट के अपस्ट्रीम प्रतिबंधित प्रवाह या ताल बनना होता है। यह सामान्यतः स्वीकार्य है — ताल बनना वेग को कम करता है और अपस्ट्रीम कटाव को रोकता है। जाँचने के लिए: दी गई q<sub>t</sub> और क्रेस्ट चौड़ाई के लिए H<sub>p</sub> ज्ञात करने हेतु वियर प्रवाह कैलकुलेटर का उपयोग करें, और इसकी तुलना इनलेट चैनल की सामान्य गहराई से करें। यदि H<sub>p</sub> सामान्य गहराई से अधिक है, तो ताल बनेगा।';
$ec_lang['rc_notes_4_term']='संदर्भ';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">तीव्र ढाल चैनल चट्टान अस्तर का डिज़ाइन</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS उसी विधि पर आधारित एक <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel स्प्रेडशीट</a> भी प्रकाशित करता है।';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'फ़िल्टर';
$ec_lang['rc_sketch_top_crest_curve'] = 'शीर्ष क्रेस्ट वक्र';
$ec_lang['rc_sketch_outlet_apron']    = 'निर्गम एप्रन';
$ec_lang['rc_sketch_radius']          = 'त्रिज्या';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='सिंचाई दाब';
$ec_lang['ip_main_title']='मुफ़्त ऑनलाइन सिंचाई दाब और वितरण एकरूपता कैलकुलेटर';
$ec_lang['ip_main_desc']='परीक्षण शाखा दाब और एकरूपता अनुमान';
$ec_lang['ip_h_supply']='आपूर्ति दाब';
$ec_lang['ip_elev_supply']='आपूर्ति स्तर, z<sub>supply</sub>';
$ec_lang['ip_q_design']='उत्सर्जक डिज़ाइन प्रवाह, q<sub>design</sub>';
$ec_lang['ip_h_design']='उत्सर्जक डिज़ाइन दाब';
$ec_lang['ip_x']='<span class="ec-help" title="मानक गैर-क्षतिपूरक उत्सर्जकों के लिए 0.5; दाब-क्षतिपूरक उत्सर्जकों के लिए लगभग 0">उत्सर्जक निर्वहन घातांक, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='परीक्षण पथ';
$ec_lang['ip_group_reach']='खंड';
$ec_lang['ip_group_upstream']='ऊर्ध्वप्रवाह';
$ec_lang['ip_group_downstream']='अनुप्रवाह';
$ec_lang['ip_group_loss']='हानि';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="चेक किया गया: यह खंड परीक्षण पार्श्व नली का एक खंड है, जिसे व्यक्तिगत उत्सर्जकों द्वारा निकाला जाता है। चेक नहीं किया गया: यह खंड एक मुख्य नली है, केवल परीक्षण पथ पर न होने वाली पार्श्व नलियों को प्रवाह पास करता है।">पार्श्व <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="पार्श्व नली पंक्तियाँ: केवल इस खंड में उत्सर्जक। मुख्य नली पंक्तियाँ: इस खंड से शाखा लेने वाली अन्य पार्श्व नलियों पर कुल उत्सर्जक। परीक्षण पार्श्व नली के अपने निकालने के ठीक स्थान पर खंड के लिए, इसमें मुख्य नली के साथ उस बिंदु के बाद कोई भी पार्श्व नली, या समान जंक्शन साझा करने वाली (उदा. विपरीत-पक्ष की पार्श्व नली) भी शामिल है — उनका प्रवाह भी इसी खंड से शाखा लेता है।">उत्सर्जक <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="इस खंड का डाउनस्ट्रीम-छोर स्तर। आंतरिक पंक्तियों में वैकल्पिक (रिक्त छोड़ने पर समतल / ऊपर के नोड के समान डिफ़ॉल्ट)। अंतिम पंक्ति में आवश्यक: वह मान अंतिम उत्सर्जक का स्तर है, जो सीधे आवश्यक आपूर्ति दाब निर्धारित करता है।">DS स्तर <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='अंतिम उत्सर्जक स्तर (अंतिम पंक्ति) रिक्त छोड़ दी गई और समतल को डिफ़ॉल्ट दिया गया — सटीक परिणाम के लिए इसे दर्ज करें';
$ec_lang['ip_press']='दाब';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="खंड की कुल हानि, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='कम/नकारात्मक दाब — अवायुमंडलीय स्थितियों के लिए जाँचें';
$ec_lang['ip_pressure_warn_short']='कम';
$ec_lang['ip_pressure_high']='उच्च दाब वाले स्थानों को दाब-न्यूनीकरण की आवश्यकता होती है';
$ec_lang['ip_pressure_high_short']='उच्च';
$ec_lang['ip_max_head']='अधि. अनुज्ञेय पाइप दाब';
$ec_lang['ip_max_head_tip']='जिन लाइनों का दाब इस मान से अधिक है, उन्हें चिह्नित किया जाता है। उच्च-दाब जाँच छोड़ने के लिए रिक्त छोड़ें।';
$ec_lang['ip_h_far']='अंतिम उत्सर्जक दाब';
$ec_lang['ip_q_supply']='<span class="ec-help" title="केवल मॉडल किए गए परीक्षण पथ में प्रवेश करने वाला प्रवाह — पूरे क्षेत्र/प्रणाली के लिए नीचे अनुप्रयोग डिज़ाइन में Q_zone देखें।">परीक्षण पथ आपूर्ति प्रवाह, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='अंतिम उत्सर्जक प्रवाह, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='औसत उत्सर्जक प्रवाह (परीक्षण पार्श्व), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="विशिष्ट पार्श्व इस परीक्षण पार्श्व की तुलना में कितने अधिक (या कम) दाब पर चलता है, इसका अनुमान। परीक्षण पार्श्व को जानबूझकर सबसे बुरी स्थिति माना जाता है, इसलिए इसका अपना औसत क्षेत्र औसत का न्यून अनुमान है — 0 पर छोड़ने पर, नीचे एकरूपता जाँच और अनुप्रयोग-डिज़ाइन के आंकड़े परीक्षण पार्श्व के अपने (संभवतः आशावादी) औसत का ज्यों-का-त्यों उपयोग करते हैं।">अनु. ∆दाब, औसत बनाम परीक्षण पार्श्व <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral का प्रत्येक पार्श्व पंक्ति के दाब पर, ऊपर दर्ज किए गए दाब अंतर सहित, पुनर्मूल्यांकन — परीक्षण पार्श्व के प्रतिनिधि न होकर सबसे बुरी स्थिति माने जाने को सुधारने का प्रयास। यह नीचे एकरूपता जाँच और अनुप्रयोग-डिज़ाइन खंड दोनों को इनपुट करता है।">अनु. क्षेत्र-औसत उत्सर्जक प्रवाह, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="अंतिम उत्सर्जक का परिकलित प्रवाह, अनुमानित क्षेत्र-औसत उत्सर्जक प्रवाह से विभाजित — यह मानक निम्न-चतुर्थांश वितरण एकरूपता (निम्न-समूह औसत ÷ जनसंख्या माध्य) का सन्निकटन है; लेकिन यह एक पूर्ण-क्षेत्र सांख्यिकीय नमूने के बजाय एक छोटे मॉडल किए गए नमूने और उपयोगकर्ता-अनुमानित सुधार पर आधारित है। 1 पर या उससे ऊपर के मान संभव और मान्य हैं: इनका अर्थ केवल यह है कि अंतिम उत्सर्जक का दाब अनुमानित क्षेत्र औसत पर या उससे ऊपर है, इसलिए न्यूनतम दाब का बिंदु कोई अन्य उत्सर्जक है। ऐसा इसलिए हो सकता है क्योंकि अंतिम उत्सर्जक निचली भूमि पर है या क्योंकि ऊपर का ∆दाब अनुमान बहुत छोटा है।">एकरूपता जाँच, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='परीक्षण उत्सर्जक पर दाब ≥ आपूर्ति दाब है। यह शायद सबसे बुरी स्थिति वाला उत्सर्जक नहीं है, या पाइपों को छोटा किया जा सकता है।';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="यह हमारे मानक एकरूपता माप के सन्निकटन से भिन्न है।">अंतिम उत्सर्जक प्रवाह ÷ डिज़ाइन प्रवाह, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='कोई समाधान नहीं: आवश्यक आपूर्ति दाब दर्ज किए गए आपूर्ति दाब से अधिक है। आपूर्ति दाब बढ़ाएँ, माँग कम करें, या एक बड़ी पाइप का उपयोग करें।';
$ec_lang['ip_notes_1_def']='अंतिम (सबसे दूरस्थ) उत्सर्जक पर दाब का अनुमान लगाता है, फिर ऊर्जा ग्रेड लाइन को आपूर्ति की ओर वापस, खंड दर खंड, घर्षण और स्थानीय हानियों को जोड़ते हुए आगे बढ़ाता है। स्तर और वेग शीर्ष को प्रत्येक नोड पर घटाकर वहाँ का वास्तविक दाब रिपोर्ट किया जाता है। अनुमानित दूर-छोर दाब को तब तक समायोजित किया जाता है (समद्विभाजन द्वारा) जब तक कि गणना की गई आवश्यक आपूर्ति दाब दर्ज की गई आपूर्ति दाब से मेल न खाए — यह मैनिंग पाइप प्रवाह कैलकुलेटर के पाइप-प्रवाह समाधानकर्ता द्वारा संबोधित की गई वही बंद-लूप समस्या है, जिसे एक शाखायुक्त नेटवर्क तक विस्तारित किया गया है।';
$ec_lang['ip_notes_2_term']='मुख्य बनाम पार्श्व खंड';
$ec_lang['ip_notes_2_def']='प्रत्येक पंक्ति आपूर्ति से अंतिम उत्सर्जक तक एकल हाइड्रॉलिक रूप से सबसे बुरी पथ (परीक्षण पथ) पर एक खंड है। एक मुख्य खंड केवल परीक्षण पथ पर न होने वाली पार्श्व नलियों को प्रवाह पास करता है, इसलिए इसकी निकासी एक सरल गुणा है (डिज़ाइन प्रवाह × खंड की कुल उत्सर्जक संख्या) — कोई स्थानीय दाब संवेदनशीलता नहीं। मुख्य नली एक साझा ट्रंक पाइप है, इसलिए मुख्य नली के उस खंड में जो परीक्षण पार्श्व नली पर समाप्त होता है, न केवल अपने स्वयं के छोरों के बीच की पार्श्व नलियाँ शामिल होनी चाहिए, बल्कि उस बिंदु से आगे मुख्य नली पर स्थित कोई भी पार्श्व नली, या समान जंक्शन साझा करने वाली (उदा. विपरीत-पक्ष की पार्श्व नली) भी शामिल होनी चाहिए — उनका प्रवाह अलग होने से पहले इसी खंड से होकर गुजरता है, चाहे वे इस तालिका में कहीं भी दिखें या न दिखें। एक पार्श्व खंड स्वयं परीक्षण पार्श्व नली का एक भाग है: उत्सर्जक निर्वहन वास्तविक स्थानीय दाब से q = k·H<sup>x</sup> के माध्यम से परिकलित होता है, और घर्षण हानि को Christiansen के F(n) कारक द्वारा घटाया जाता है ताकि खंड में प्रत्येक उत्सर्जक द्वारा जल निकालने के साथ प्रवाह घटने को ध्यान में रखा जा सके।';
$ec_lang['ip_notes_3_term']='सीमाएँ';
$ec_lang['ip_notes_3_def']='एक निश्चित आपूर्ति दाब (कोई पंप वक्र नहीं), केवल एक परीक्षण पथ (पूरा खेत नहीं), और एक 2-पैरामीटर उत्सर्जक वक्र (दाब-क्षतिपूरक उत्सर्जक का सन्निकटन करने के लिए घातांक को 0 के निकट सेट करें) को मॉडल करता है। दो भिन्न एकरूपता अनुपात रिपोर्ट किए जाते हैं, जिन्हें जानबूझकर अलग रखा गया है: q<sub>last</sub>/q<sub>avg,field</sub> मानक निम्न-चतुर्थांश वितरण एकरूपता (निम्न-समूह औसत ÷ जनसंख्या माध्य) का सन्निकटन है; लेकिन यह मानक पूर्ण-क्षेत्र सांख्यिकीय नमूने के बजाय एक छोटे मॉडल किए गए नमूने और उपयोगकर्ता-अनुमानित सुधार पर आधारित है। साथ ही, परीक्षण पार्श्व को जानबूझकर सबसे बुरी स्थिति माना जाता है, इसलिए इसका कच्चा, असुधारित औसत वास्तविक क्षेत्र औसत को कम आंकेगा और एकरूपता को वास्तविकता से बेहतर दिखाएगा; ∆दाब इनपुट विशेष रूप से इस पूर्वाग्रह का प्रतिकार करने के लिए मौजूद है। एकरूपता के लिए 1 पर या उससे ऊपर के मान अब भी संभव हैं: इनका अर्थ केवल यह है कि अंतिम उत्सर्जक का दाब अनुमानित क्षेत्र औसत पर या उससे ऊपर है, इसलिए न्यूनतम दाब का बिंदु कोई अन्य उत्सर्जक है। ऐसा इसलिए हो सकता है क्योंकि अंतिम उत्सर्जक निचली भूमि पर है या क्योंकि ∆दाब अनुमान बहुत छोटा है। q<sub>last</sub>/q<sub>design</sub> निर्माता के रेटेड प्रवाह के विरुद्ध एक भिन्न, गैर-एकरूपता जाँच है — यह समग्र रूप से अधिक- या कम-दाबित प्रणाली का पता लगाने के लिए उपयोगी है, लेकिन यह एकरूपता संख्या के साथ पढ़ी जाने वाली एक अलग जाँच है, क्योंकि डिज़ाइन/रेटेड प्रवाह का प्रणाली के वास्तविक माध्य परिचालन दाब से कोई आवश्यक संबंध नहीं है।';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). "Irrigation by sprinkling." California Agricultural Experiment Station Bulletin 670. सूक्ष्म-सिंचाई डिज़ाइन के लिए ASAE/ASABE मानक समान बहु-आउटलेट घर्षण-हानि पद्धति का उपयोग करते हैं।';
$ec_lang['ip_notes_5_term']='अनुप्रयोग डिज़ाइन';
$ec_lang['ip_notes_5_def']='अनुप्रयोग दर और प्रणाली/क्षेत्र प्रवाह अनुमानित क्षेत्र-औसत उत्सर्जक प्रवाह (q<sub>avg,field</sub> — परीक्षण पार्श्व का अपना औसत, दर्ज किए गए ∆दाब अनुमान से सुधारा गया) का उपयोग करते हैं, न कि किसी अनुमानित दर का: PR = q<sub>avg,field</sub> / A<sub>e</sub>, जो सुधारे गए मॉडल किए गए मान से संचालित है। रिक्ति और प्रणाली-व्यापी पार्श्व/उत्सर्जक गणना यहाँ अलग इनपुट हैं क्योंकि परीक्षण पथ केवल एक सबसे बुरी स्थिति वाली शाखा को मॉडल करता है, खेत की हर पार्श्व नली को नहीं।';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='शाखायुक्त पाइप नेटवर्क';
$ec_lang['bpn_main_title']='मुफ़्त ऑनलाइन शाखायुक्त पाइप नेटवर्क दाब कैलकुलेटर (कोई लूप नहीं)';
$ec_lang['bpn_main_desc']='शाखायुक्त (वृक्ष) पाइप नेटवर्क प्रवाह और दाब';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='स्थिर आपूर्ति शीर्ष: शून्य प्रवाह पर स्रोत शीर्ष। आपूर्ति स्तर से ऊपर जलाशय या टैंक का जल स्तर, या पंप का शटऑफ शीर्ष। पंप या परिवर्तनशील-आपूर्ति वक्र को परिभाषित करने के लिए आपूर्ति बिंदु 2 और 3 जोड़ें; उपकरण डिज़ाइन प्रवाह पर शीर्ष पढ़ता है।';
$ec_lang['bpn_elev_source']='आपूर्ति स्तर';
$ec_lang['bpn_q_total']='कुल प्रवाह';
$ec_lang['bpn_q_total_tip']='स्रोत से निकलने वाला कुल प्रवाह (नेटवर्क में सभी माँगों का योग)।';
$ec_lang['bpn_p_min']='न्यूनतम दाब';
$ec_lang['bpn_p_min_tip']='नेटवर्क में कहीं भी सबसे कम अनुप्रवाह दाब; महत्वपूर्ण वितरण बिंदु।';
$ec_lang['bpn_method']='घर्षण विधि';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='पाइप लाइनें';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='इस पाइप लाइन का नाम। अन्य लाइनें इसे ऊर्ध्वप्रवाह कॉलम में संदर्भित करती हैं।';
$ec_lang['bpn_upstream']='ऊर्ध्वप्रवाह ID';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='उस लाइन का ID जो इसे प्रवाह देती है। इसके ठीक ऊपर वाली लाइन का अनुसरण करने के लिए रिक्त छोड़ें (एक सामान्य श्रृंखला पाइपलाइन)। किसी भिन्न लाइन से शाखा लेने के लिए यहाँ एक ID दर्ज करें।';
$ec_lang['bpn_roughness_tip']='चयनित घर्षण विधि के लिए पाइप खुरदरापन: मैनिंग n, हेज़न-विलियम्स C, या डार्सी-वाइसबाख खुरदरापन ऊँचाई e (एक लंबाई)। सामान्य चिकना प्लास्टिक पाइप: n लगभग 0.009, C लगभग 150, e लगभग 0.0015 mm।';
$ec_lang['bpn_demand']='माँग';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='इस लाइन के अनुप्रवाह छोर पर पहुँचाया जाने वाला निश्चित प्रवाह।';
$ec_lang['bpn_demand_mult']='माँग गुणक';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='चरम-माँग या भविष्य-वृद्धि गणना के लिए हर लाइन की माँग को एक साथ गुणा करता है। दर्ज माँगों के लिए 1 का उपयोग करें।';
$ec_lang['bpn_elev_down']='DS स्तर';
$ec_lang['bpn_q_line']='लाइन प्रवाह';
$ec_lang['bpn_q_line_tip']='इस लाइन द्वारा वहन किया गया कुल प्रवाह: इसकी अपनी माँग जमा हर अनुप्रवाह माँग जिसे यह पूर्ति करती है।';
$ec_lang['bpn_p_down']='DS दाब';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='इस लाइन के अनुप्रवाह नोड पर गेज दाब शीर्ष। एक नकारात्मक मान (चिह्नित) अवायुमंडलीय दाब दर्शाता है; डिज़ाइन जाँचें।';
$ec_lang['bpn_sketch_heading']='नेटवर्क आरेख';
$ec_lang['bpn_source_label']='स्रोत';
$ec_lang['bpn_line_problem']='यह लाइन स्रोत से जुड़ी नहीं है: यह किसी अज्ञात ऊर्ध्वप्रवाह ID की ओर इशारा करती है, स्वयं की ओर इशारा करती है, किसी अन्य लाइन द्वारा पहले से उपयोग की गई ID को दोहराती है, या एक लूप बनाती है। जो लाइनें जुड़ी नहीं हैं उन्हें अनसुलझा छोड़ दिया जाता है।';
$ec_lang['bpn_bad_id_short']='अमान्य ID';


$ec_lang['bpn_pressure_warn']='कम/नकारात्मक दाब — अवायुमंडलीय स्थितियों के लिए जाँचें';
$ec_lang['bpn_pressure_warn_short']='कम';
$ec_lang['bpn_notes_1_term']='डिफ़ॉल्ट रूप से श्रृंखला, अपवाद रूप से शाखा';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='ऊर्ध्वप्रवाह ID रिक्त छोड़ें और एक लाइन उसके ऊपर वाली का अनुसरण करती है; एक सामान्य श्रृंखला पाइपलाइन। किसी ऊर्ध्वप्रवाह लाइन का ID दर्ज करें ताकि उससे शाखा ली जा सके। तो: डिफ़ॉल्ट रूप से श्रृंखला, आवश्यकता होने पर एक वृक्ष।';
$ec_lang['bpn_notes_2_term']='केवल शाखायुक्त नेटवर्क, कोई लूप नहीं';
$ec_lang['bpn_notes_2_def']='प्रत्येक लाइन की ठीक एक ऊर्ध्वप्रवाह लाइन होती है (एक वृक्ष)। यह उपकरण लूप वाले नेटवर्क हल नहीं करता; उनके लिए पुनरावृत्त विधियों (EPANET या समान) की आवश्यकता होती है। लूप को बाहर रखना ही इसे सरल और सटीक बनाए रखता है।';
$ec_lang['bpn_notes_3_term']='कोई सक्रिय दाब नियंत्रण नहीं';
$ec_lang['bpn_notes_3_def']='आप एक निश्चित स्थानीय-हानि वाल्व (एक k-मान) जोड़ सकते हैं, लेकिन दाब-न्यूनीकरण या दाब-अनुरक्षण वाल्व (PRV/PSV) नहीं। उनकी खुली/बंद स्थिति प्रवाह और दाब पर निर्भर करती है, जिससे पुनरावृत्ति आवश्यक हो जाएगी।';


$ec_lang['bpn_supply2_q']='आपूर्ति प्रवाह 2';
$ec_lang['bpn_supply2_h']='आपूर्ति शीर्ष 2';
$ec_lang['bpn_supply3_q']='आपूर्ति प्रवाह 3';
$ec_lang['bpn_supply3_h']='आपूर्ति शीर्ष 3';
$ec_lang['bpn_supply_pt_tip']='वैकल्पिक आपूर्ति-वक्र बिंदु 2 और 3। पंप, या किसी भी ऐसे स्रोत को मॉडल करने के लिए प्रत्येक के लिए एक प्रवाह और शीर्ष दर्ज करें जिसका शीर्ष अधिक पहुँचाने पर घटता है; उपकरण डिज़ाइन प्रवाह पर शीर्ष पढ़ता है। ऊपर बिंदु 1 शून्य प्रवाह पर स्थिर शीर्ष है। स्थिर जलाशय शीर्ष के लिए 2 और 3 को रिक्त छोड़ें।';
$ec_lang['bpn_h_supply']='आपूर्ति शीर्ष';
$ec_lang['bpn_h_supply_tip']='आपूर्ति वक्र से पढ़ा गया, डिज़ाइन प्रवाह पर स्रोत शीर्ष। जब वक्र समतल हो (एक जलाशय), तो यह दर्ज किए गए स्रोत शीर्ष के बराबर होता है।';
$ec_lang['bpn_supply1_h']='स्थिर आपूर्ति शीर्ष';
$ec_lang['lpn_main_menu']='जल आपूर्ति नेटवर्क';
$ec_lang['lpn_main_title']='EPANET सॉल्वर के साथ मुफ़्त ऑनलाइन जल वितरण नेटवर्क मॉडलिंग';
$ec_lang['lpn_main_desc']='जल आपूर्ति नेटवर्क विश्लेषण: लूप युक्त पाइप नेटवर्क बनाएँ या EPANET फ़ाइलें आयात करें';
$ec_lang['lpn_title_units']='{units} इकाइयाँ';
$ec_lang['lpn_tool_select']='चुनें';
$ec_lang['lpn_tool_add_junction']='जंक्शन';
$ec_lang['lpn_tool_add_reservoir']='जलाशय';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='टैंक';
$ec_lang['lpn_tool_add_pipe']='पाइप';
$ec_lang['lpn_tool_add_pump']='पंप';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='वाल्व';
$ec_lang['lpn_tool_add_text']='टेक्स्ट';
$ec_lang['lpn_tool_vertices']='वर्टेक्स';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='ग्राहक';
$ec_lang['lpn_tool_add_meter_tip']='ग्राहक जहाँ है वहाँ मानचित्र पर क्लिक करें, फिर उस पाइप या नोड पर क्लिक करें जो उसे सेवा देता है। आप ग्राहक को जो माँग देते हैं वह उस पाइप के निकटतम सिरे वाले जंक्शन में जोड़ी जाती है।';
$ec_lang['lpn_mode_add_meter']='ग्राहक: ग्राहक जहाँ है वहाँ क्लिक करें, फिर उस पाइप या नोड पर क्लिक करें जो उसे सेवा देता है। या रद्द करने के लिए Esc का उपयोग करें।';
$ec_lang['lpn_pane_tab_customers']='ग्राहक';
$ec_lang['lpn_customer_heading']='ग्राहक {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='प्रति सेवा माँग';
$ec_lang['lpn_field_meter_demand_tip']='इस ग्राहक की हर सेवा को कितनी माँग चाहिए। खोजें और बदलें खाली और 0 के बीच के अंतर का उपयोग कर सकता है।';
$ec_lang['lpn_field_meter_count']='सेवाओं की संख्या';
$ec_lang['lpn_field_meter_count_tip']='यह एक ग्राहक कितनी समान सेवाओं का प्रतिनिधित्व करता है, ताकि एक मुख्य पाइप के साथ बयालीस एकल-परिवार कनेक्शन एक ही जगह एक ही चिह्न हो सकें। नीचे कुल राशि ऊपर की माँग को इसी संख्या से गुणा करके मिलती है।';
$ec_lang['lpn_field_meter_total']='कुल माँग';
$ec_lang['lpn_field_meter_total_tip']='प्रति सेवा माँग को सेवाओं की संख्या से गुणा करने पर मिलती है। यह वही संख्या है जो नीचे बताए गए जंक्शन में जोड़ी जाती है।';
$ec_lang['lpn_field_meter_pipe']='जुड़ा तत्व';
$ec_lang['lpn_field_meter_pipe_suggest']='निकटतम तत्व {id} है। इस ग्राहक को उससे सेवा देने के लिए यहाँ इसे टाइप करें।';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='से जुड़ा';
$ec_lang['lpn_field_meter_node_tip']='वह जंक्शन जिससे यह ग्राहक जुड़ा है। इसके बजाय किसी पाइप के साथ किसी स्टेशन से सेवा देने के लिए कनेक्शन बिंदु को उस पाइप पर खींचें।';
$ec_lang['lpn_meter_pipe_unknown']='इस प्रोजेक्ट में {id} नाम की कोई चीज़ नहीं है, इसलिए ग्राहक वहीं छोड़ दिया गया जहाँ वह था।';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='यह ग्राहक की माँग रन के दौरान कैसे ऊपर-नीचे होती है। यह कुल माँग को गुणा करता है, इसलिए यह उन सभी सेवाओं पर लागू होता है जिनका यह ग्राहक प्रतिनिधित्व करता है। इसे कोई पैटर्न नहीं पर छोड़ें और यह प्रोजेक्ट के डिफ़ॉल्ट डिमांड पैटर्न का पालन करेगा।';
$ec_lang['lpn_meter_pattern_unknown']='इस प्रोजेक्ट में {id} नाम का कोई पैटर्न नहीं है, इसलिए ग्राहक वैसा ही छोड़ दिया गया जैसा वह था।';
$ec_lang['lpn_meter_placed']='ग्राहक {id} जोड़ा गया। इसका विवरण और माँग Customers तालिका में टाइप करें, या इसका बॉक्स खोलने के लिए Select में इसे दबाएँ।';
$ec_lang['lpn_field_meter_pipe_tip']='वह तत्व जिससे यह सेवा जुड़ी है। इसे बदलने के लिए यहाँ या Customers तालिका में कोई और टाइप करें, या कनेक्शन बिंदु को किसी अन्य तत्व पर खींचें।';
$ec_lang['lpn_field_meter_station']='पाइप पर स्थिति (%)';
$ec_lang['lpn_field_meter_station_tip']='सेवा पाइप के साथ कितनी दूर जुड़ती है, पाइप के पहले नोड से दूसरे नोड तक की प्रतिशत दूरी के रूप में। 0 एक सिरे पर है और 100 दूसरे सिरे पर। पाइप पर बना वृत्त पॉइंटर से यही काम करता है।';
$ec_lang['lpn_field_meter_offset']='पाइप से ऑफ़सेट';
$ec_lang['lpn_field_meter_offset_tip']='पहले नोड से दूसरे की ओर देखने पर, धनात्मक पाइप के दाईं ओर है। यहाँ मान टाइप करने से ग्राहक मुख्य पाइप के दूसरी ओर जा सकता है, और यह सेवा रेखा को हमेशा मुख्य पाइप के लंबवत रखता है।';
$ec_lang['lpn_field_meter_lumped']='नोड में जोड़ा गया';
$ec_lang['lpn_field_meter_lumped_tip']='निकटतम नोड; इस ग्राहक की माँग वहीं जोड़ी जाती है।';
$ec_lang['lpn_node_customers']='ग्राहक माँगें';
$ec_lang['lpn_node_customers_tip']='इस नोड पर जोड़े गए ग्राहकों की सूची (क्योंकि यह निकटतम था)। ग्राहक माँगें यहाँ सूचीबद्ध अन्य माँगों के अतिरिक्त हैं। किसी ग्राहक को मानचित्र पर उसके स्थान पर या Customers तालिका में संपादित किया जाता है।';
$ec_lang['lpn_node_customers_sum']='{n} ग्राहकों से {total} {unit}';
$ec_lang['lpn_customer_detached']='⚠ यह ग्राहक किसी पाइप से जुड़ा नहीं है, इसलिए इसकी माँग उत्तरों में शामिल नहीं है। इसे हटाएँ, या एक पाइप खींचें और ग्राहक को उस पर ले जाएँ।';
$ec_lang['lpn_customer_fixed_head']='⚠ उस पाइप के निकटतम सिरे पर एक स्थिर जल-सतह है, इसलिए यह माँग सिमुलेशन को प्रभावित नहीं करती।';
$ec_lang['lpn_customer_detached_count']='{n} ग्राहक किसी पाइप से जुड़े नहीं हैं। उनकी माँग की गणना नहीं की गई है।';
$ec_lang['lpn_meter_pick_pipe']='अब उस पाइप या नोड पर क्लिक करें जो इस ग्राहक को सेवा देगा। ग्राहक वहीं रहेगा जहाँ आपने उसे रखा है। रद्द करने के लिए Escape दबाएँ।';
$ec_lang['lpn_inp_export_flat_customers']='EPANET फ़ाइल में कोई ग्राहक नहीं होता। इस प्रोजेक्ट के {n} ग्राहकों की माँग फ़ाइल में उस जंक्शन पर एक माँग पंक्ति के रूप में जाती है जिसमें हर एक को जोड़ा गया है, और हर पंक्ति का नाम ग्राहक के टैग से रखा जाता है। फ़ाइल जो नहीं रख सकती वह है ग्राहक: वह कहाँ बैठा है, कौन-सा पाइप उसे सेवा देता है, उस पाइप के साथ कहाँ सेवा जुड़ती है, और एक ग्राहक कितनी सेवाओं का प्रतिनिधित्व करता है। आपकी अपनी प्रोजेक्ट फ़ाइल यह सब रखती है।';

$ec_lang['lpn_area_hint_window_start']='विंडो का एक कोना क्लिक करें।';
$ec_lang['lpn_area_hint_window_go']='समाप्त करने के लिए विपरीत कोना क्लिक करें।';
$ec_lang['lpn_area_hint_lasso_start']='रूपरेखा शुरू करने के लिए क्लिक करें।';
$ec_lang['lpn_area_hint_lasso_go']='रूपरेखा खींचने के लिए घुमाएँ। समाप्त करने के लिए क्लिक करें।';
$ec_lang['lpn_area_hint_polygon_start']='बहुभुज क्षेत्र खींचने के लिए क्लिक करें। समाप्त करने के लिए डबल-क्लिक करें।';
$ec_lang['lpn_area_hint_polygon_go']='हर कोने पर क्लिक करें। समाप्त करने के लिए अंतिम कोने पर डबल-क्लिक करें।';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='चुनते समय Shift दबाए रखें ताकि मौजूदा चयन के साथ जारी रखा जा सके, जो आप चुनें उसे जोड़ते या हटाते (टॉगल करते) हुए।';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='मानचित्र पर दबाएँ और जो चाहें उसके चारों ओर खींचें, फिर उठा लें।';
$ec_lang['lpn_area_hint_touch_go']='जो चाहें उसके चारों ओर खींचें, फिर समाप्त करने के लिए उठा लें।';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='इसे दिखाएँ';
$ec_lang['lpn_multi_title']='{n} चयनित';
$ec_lang['lpn_multi_varies']='विभिन्न';
$ec_lang['lpn_multi_applied']='{n} पर {prop} सेट किया गया।';
$ec_lang['lpn_multi_no_fields']='इनमें कुछ भी ऐसा नहीं है जिसे यहाँ एक साथ सेट किया जा सके।';
$ec_lang['lpn_pane_pasted']='{n} सेल पेस्ट किए गए। {skipped} नहीं बदले गए।';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='{n} पंक्तियाँ पेस्ट कीं और उनमें से {created} को नेटवर्क में जोड़ा।';
$ec_lang['lpn_pane_pasted_rows_skipped']='{n} पंक्तियाँ पेस्ट कीं और उनमें से {created} को नेटवर्क में जोड़ा। {skipped} सेल नहीं बदले गए।';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='यहाँ क्लिक करें और स्प्रेडशीट से पंक्तियाँ जोड़ने के लिए पेस्ट करें।';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='तालिका के अंत में नई पंक्तियों के रूप में पेस्ट करें';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='कॉपी की गई पंक्तियों को इस तालिका के नीचे जोड़ने के लिए Ctrl+V दबाएँ। रद्द करने के लिए Esc दबाएँ।';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='इस पेस्ट में {n} पंक्तियाँ हैं, और उनमें से {fit} तालिका में समा जाती हैं। बाकी {extra} को नीचे नई पंक्तियों के रूप में जोड़ें?';
$ec_lang['lpn_pane_paste_overflow_add']='{extra} पंक्तियाँ जोड़ें';
$ec_lang['lpn_pane_paste_overflow_fit']='केवल वे {fit} पेस्ट करें जो समाती हैं';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='इस पेस्ट में {n} पंक्तियाँ हैं, और उनमें से {fit} तालिका में समा जाती हैं। बाकी {extra} को नई पंक्तियों के रूप में नहीं जोड़ा जा सकता: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} ID मेल नहीं खातीं। फिर भी पेस्ट करें?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='कुछ भी पेस्ट नहीं हुआ। {reasons}';
$ec_lang['lpn_pane_paste_more']='समस्या वाली पंक्तियाँ जो यहाँ नहीं दिखाई गईं: {n}।';
$ec_lang['lpn_pane_paste_no_id']='पंक्ति {row}: एक नई पंक्ति को ID चाहिए।';
$ec_lang['lpn_pane_paste_bad_id']='पंक्ति {row}: ID {id} में स्पेस या उद्धरण चिह्न है।';
$ec_lang['lpn_pane_paste_id_taken']='पंक्ति {row}: ID {id} पहले से उपयोग में है।';
$ec_lang['lpn_pane_paste_id_twice']='पंक्ति {row}: ID {id} इस पेस्ट में दो बार उपयोग हुई है।';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='पंक्ति {row}: एक नए नोड को {first} और {second} दोनों चाहिए।';
$ec_lang['lpn_pane_paste_no_ends']='पंक्ति {row}: एक नए लिंक को एक से नोड और एक तक नोड चाहिए।';
$ec_lang['lpn_pane_paste_no_node']='पंक्ति {row}: नोड {id} अभी मौजूद नहीं है। पहले अपने नोड पेस्ट करें, फिर अपने लिंक।';
$ec_lang['lpn_pane_paste_same_ends']='पंक्ति {row}: से और तक एक ही नोड हैं।';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='पंक्ति {row}: {text} एक मान्य {col} नहीं है।';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='पंक्ति {row}: एक नए टेक्स्ट को {first} और {second} दोनों चाहिए।';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='पंक्ति {row}: {id} अभी इस नेटवर्क में कोई नोड या पाइप नहीं है। पहले इसे पेस्ट करें, फिर यह टेक्स्ट।';
$ec_lang['lpn_pane_paste_customer_no_position']='पंक्ति {row}: एक नए ग्राहक को {first} और {second} दोनों चाहिए।';
$ec_lang['lpn_pane_paste_no_customer_ref']='पंक्ति {row}: एक नए ग्राहक को जुड़ा हुआ पाइप या नोड चाहिए।';
$ec_lang['lpn_pane_paste_no_pipe']='पंक्ति {row}: पाइप {id} अभी मौजूद नहीं है। पहले अपने पाइप पेस्ट करें, फिर अपने ग्राहक।';
$ec_lang['lpn_pane_paste_no_customer_node']='पंक्ति {row}: नोड {id} अभी मौजूद नहीं है। पहले अपने जंक्शन पेस्ट करें, फिर अपने ग्राहक।';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='पंक्ति {row}: नोड {id} के पास ग्राहक को जोड़ने के लिए कोई पाइप नहीं है।';

$ec_lang['lpn_pane_filled']='{n} सेल नीचे भरे गए। {skipped} नहीं बदले गए।';
$ec_lang['lpn_pane_filldown']='नीचे भरें';
$ec_lang['lpn_pane_fill_none']='इस चयन में कुछ भी नीचे नहीं भरा जा सकता।';
$ec_lang['lpn_pane_ctrlenter_filled']='{n} सेल भरे गए। {skipped} नहीं बदले गए।';
$ec_lang['lpn_pane_hide_col']='यह कॉलम छिपाएँ';
$ec_lang['lpn_pane_hide_cols']='ये कॉलम छिपाएँ';
$ec_lang['lpn_pane_show_all_cols']='सभी कॉलम दिखाएँ';
$ec_lang['lpn_pane_sort_asc']='आरोही क्रम में क्रमबद्ध करें';
$ec_lang['lpn_pane_manage_cols']='कॉलम प्रबंधित करें…';
$ec_lang['lpn_pane_manage_cols_title']='कॉलम प्रबंधित करें';
$ec_lang['lpn_pane_manage_cols_show']='दिखाएँ';
$ec_lang['lpn_pane_manage_cols_up']='ऊपर ले जाएँ';
$ec_lang['lpn_pane_manage_cols_down']='नीचे ले जाएँ';
$ec_lang['lpn_pane_manage_cols_top']='आरंभ में ले जाएँ';
$ec_lang['lpn_pane_manage_cols_bottom']='अंत में ले जाएँ';
$ec_lang['lpn_pane_colmenu_tip']='कॉलम छिपाएँ या प्रबंधित करें';
$ec_lang['lpn_pane_sortarrow_tip']='क्रम उलटें';
$ec_lang['lpn_tool_area_window']='एक विंडो चुनें';
$ec_lang['lpn_tool_area_lasso']='एक लैसो चुनें';
$ec_lang['lpn_tool_area_polygon']='एक बहुभुज चुनें';
$ec_lang['lpn_tool_delete']='हटाएँ';
$ec_lang['lpn_tool_zoom_extent']='पूरा चित्र दिखाएँ';
$ec_lang['lpn_tool_zoom_window']='ज़ूम विंडो';
$ec_lang['lpn_zoom_in']='ज़ूम इन';
$ec_lang['lpn_zoom_out']='ज़ूम आउट';
$ec_lang['lpn_new_text']='टेक्स्ट';
$ec_lang['lpn_field_text_bold']='मोटा (बोल्ड) टेक्स्ट';
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
$ec_lang['lpn_field_text_anchor']='किससे जुड़ा';

$ec_lang['lpn_field_text_align']='क्षैतिज संरेखण';
$ec_lang['lpn_field_text_align_left']='बाएँ';
$ec_lang['lpn_field_text_align_center']='मध्य';
$ec_lang['lpn_field_text_align_right']='दाएँ';
$ec_lang['lpn_field_text_valign']='ऊर्ध्वाधर संरेखण';
$ec_lang['lpn_field_text_valign_top']='ऊपर';
$ec_lang['lpn_field_text_valign_middle']='बीच';
$ec_lang['lpn_field_text_valign_bottom']='नीचे';
$ec_lang['lpn_field_text_rotation']='कोण (डिग्री)';
$ec_lang['lpn_field_text_match_pipe']='निकटतम लिंक के कोण पर घुमाएँ';
$ec_lang['lpn_field_text_flip']='180° घुमाएँ';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='संलग्न तत्व';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='यह टेक्स्ट किसी तत्व के इतना पास रखा गया था कि वह उसके साथ चलता है और उसका एक लीडर होता है। लीडर पर मौजूद टेक्स्ट अपना क्षैतिज और ऊर्ध्वाधर संरेखण उस दिशा से लेता है जिस ओर वह स्थित है, इसलिए संलग्न रहते समय ये दो पंक्तियाँ उपलब्ध नहीं होतीं।';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='उत्सर्जक गुणांक';
$ec_lang['lpn_field_emitter_tip']='दाब पर निर्भर एक अतिरिक्त बहिर्वाह, स्प्रिंकलर, खुले आउटलेट, या मॉडल की गई रिसाव के लिए। इससे निकलने वाला प्रवाह यह गुणांक गुणा दाब की उत्सर्जक घातांक तक घात है, जो पूरे नेटवर्क के लिए Settings, Calculation, Hydraulics के अंतर्गत एक बार सेट होता है। सामान्य जंक्शन पर इसे खाली छोड़ दें।';
$ec_lang['lpn_field_elev']='स्तर';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='इस नोड पर ज़मीन या पाइप का स्तर। इसे किसी भी शून्य-बिंदु से मापें, बशर्ते हर नोड के लिए वही एक बिंदु उपयोग हो।';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='हेड';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='जलाशय में जल-सतह का स्तर, ऊँचाई के रूप में मापा गया, दाब के रूप में नहीं। इसे खाली छोड़ने पर जल-सतह जलाशय के स्तर पर मानी जाती है।';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='टैंक के तल का स्तर। टैंक में जल की गहराइयाँ यहाँ से ऊपर की ओर मापी जाती हैं।';
$ec_lang['lpn_field_tank_level']='जल गहराई';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='टैंक में खड़े जल की गहराई, टैंक के तल से ऊपर की ओर मापी गई। जल-सतह टैंक के तल के स्तर और इस गहराई का योग है।';
$ec_lang['lpn_field_tank_minlevel']='न्यूनतम जल गहराई';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='वह जल गहराई जिस पर टैंक को खाली माना जाता है, टैंक के तल से ऊपर की ओर मापी गई।';
$ec_lang['lpn_field_tank_maxlevel']='अधिकतम जल गहराई';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='वह जल गहराई जिस पर टैंक को भरा माना जाता है, टैंक के तल से ऊपर की ओर मापी गई।';
$ec_lang['lpn_field_tank_diameter']='टैंक व्यास';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='टैंक की एक ओर से दूसरी ओर तक की चौड़ाई। यह स्तर की उन्हीं इकाइयों में है, पाइप व्यास की इकाइयों में नहीं। यह तय करता है कि किसी दी गई गहराई में कितना जल समाता है।';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='टैंक में जल-सतह का स्तर: टैंक के तल का स्तर और जल गहराई का योग। सॉल्वर टैंक के लिए इसी स्तर का उपयोग करता है।';
$ec_lang['lpn_close']='बंद करें';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='गुण';
$ec_lang['lpn_empty_hint']='किसी उदाहरण को खोलने के लिए File, New project का उपयोग करें। या टूलबार से जलाशय, जंक्शन और पाइप जोड़कर शुरू करें।';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='आपका नेटवर्क सही-सलामत है।';
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
$ec_lang['lpn_examples_welcome']='EPANET सॉल्वर के साथ जल आपूर्ति नेटवर्क मॉडलिंग में आपका स्वागत है';
$ec_lang['lpn_examples_heading']='किसी उदाहरण की अपनी प्रति खोलें';
$ec_lang['lpn_examples_sub']='हर उदाहरण आपकी अपनी प्रति के रूप में खुलता है। इसे बदलें, सहेजें, या फिर से एक नई प्रति खोलकर दोबारा शुरू करें।';
$ec_lang['lpn_examples_open']='खोलें';
$ec_lang['lpn_examples_menu']='उदाहरण खोलें…';
$ec_lang['lpn_examples_blank']='या यहाँ से शुरू करें';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='नोड: {nodes}, लिंक: {links}';
$ec_lang['lpn_examples_failed']='उदाहरण लोड नहीं हो सके। ड्राइंग शुरू करने के लिए File, New project का उपयोग करें।';
$ec_lang['lpn_examples_loading']='उदाहरण लोड हो रहे हैं…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='कुछ ठीक करें';
$ec_lang['lpn_help_notes']='इस पृष्ठ पर टिप्पणियाँ';
$ec_lang['lpn_help_hotkeys']='तालिकाएँ और कीबोर्ड शॉर्टकट';
$ec_lang['lpn_hotkeys_tables_heading']='तालिकाएँ';
$ec_lang['lpn_hotkeys_map_heading']='मानचित्र';
$ec_lang['lpn_hotkeys_map_term']='मानचित्र कीबोर्ड शॉर्टकट';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 या Esc</td><td>चुनें।</td></tr><tr><td>2</td><td>जंक्शन जोड़ें।</td></tr><tr><td>3</td><td>जलाशय जोड़ें।</td></tr><tr><td>4</td><td>टैंक जोड़ें।</td></tr><tr><td>5</td><td>पाइप जोड़ें।</td></tr><tr><td>6</td><td>पंप जोड़ें।</td></tr><tr><td>7</td><td>वाल्व जोड़ें।</td></tr><tr><td>8</td><td>ग्राहक जोड़ें।</td></tr><tr><td>9</td><td>टेक्स्ट जोड़ें।</td></tr><tr><td>Delete</td><td>चयन हटाएँ।</td></tr><tr><td>Ctrl+Z</td><td>पिछला बदलाव पूर्ववत करें।</td></tr><tr><td>+ या =</td><td>ज़ूम इन।</td></tr><tr><td>-</td><td>ज़ूम आउट।</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='यहाँ कुछ गड़बड़ है?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='एक बार दबाने पर हमें पता चलता है कि इस पृष्ठ पर कुछ गड़बड़ है। यह इस पृष्ठ का नाम, जिस भाषा में आप इसे पढ़ रहे हैं, और यदि मानचित्र पर कोई संदेश है तो वह भेजता है। यह आपके टाइप किए हुए कुछ भी नहीं, कोई पता नहीं, और आपकी ड्रॉइंग में से कुछ भी नहीं भेजता। कोई जवाब नहीं दे सकता, क्योंकि यह हमें आपके बारे में कुछ नहीं बताता। अधिक कहना हो तो सहायता, कुछ ठीक करें उपयोग करें।';
$ec_lang['lpn_wrong_thanks']='धन्यवाद। यह हम तक पहुँच गया।';
$ec_lang['lpn_status_example_opened']='{name} खोला गया। यह आपकी प्रति है: इसे File, Save as से सहेजें।';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='यह पृष्ठ ड्रॉइंग क्षेत्र का आकार नहीं जान सका, इसलिए मानचित्र वह अंतिम दृश्य दिखा रहा है जो वह परिकलित कर सका। विंडो का आकार बदलने पर यह फिर से प्रयास करता है। यदि यह बार-बार होता रहे, तो आमतौर पर इसका कारण कोई ब्राउज़र एक्सटेंशन होता है जो पृष्ठ के मापन को रोकता है।';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='मूल नेटवर्क, ली/से (SI)';
$ec_lang['lpn_ex_basic_si_desc']='यहाँ से शुरू करें। एक जलाशय, एक पंप और एक छोटा लूप: सबसे छोटी व्यवस्था जो जल नेटवर्क के रूप में काम करती है। लीटर प्रति सेकंड, मीटर और मिलीमीटर के साथ।';
$ec_lang['lpn_ex_basic_us_title']='मूल नेटवर्क, gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='वही शुरुआती नेटवर्क गैलन प्रति मिनट में, फ़ीट और इंच के साथ।';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 और नियम-आधारित नियंत्रण';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='EPANET के अपने तीन उदाहरण नेटवर्कों में सबसे छोटा: एक जलाशय, एक पंप और एक अकेला लूप।';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='EPANET के उदाहरणों में से एक टैंक वाला शाखायुक्त वितरण तंत्र।';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='EPANET का बड़ा उदाहरण: 92 जंक्शन, 3 टैंक और 2 जलाशय, जिनमें से एक नदी है। यह देखने लायक कि असली आकार का मॉडल मानचित्र पर कैसा दिखता है।';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='EPANET Net3 नेटवर्क को Novato, CA में अक्षांश/देशांतर में बदला गया, जिसके पीछे विश्व मानचित्र है।';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='अधिकतम दैनिक माँग के ऊपर अग्नि-प्रवाह के लिए हल किया गया एक व्यावसायिक स्थल, एक ही क्षण में, साइट योजना के ऊपर बनाया गया।';
$ec_lang['lpn_tool_undo']='पूर्ववत करें';
$ec_lang['lpn_confirm_example']='यह उदाहरण आपके मौजूदा नेटवर्क में जोड़ देगा। जारी रखें?';
$ec_lang['lpn_field_diameter']='व्यास';
$ec_lang['lpn_demand_tip']='इस नोड पर नेटवर्क से निकाला गया प्रवाह। नेटवर्क में यहाँ प्रवाह डालने के लिए ऋणात्मक संख्या दर्ज करें।';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='यह इकाई तय करती है कि आपकी संख्याओं का अर्थ क्या है';
$ec_lang['lpn_units_warn_lead']='{unit} इस चीज़ के लिए आपके द्वारा दर्ज मान की इकाई है:';
$ec_lang['lpn_units_options_head']='जब आप कोई इकाई बदलते हैं:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='अविनाशी';
$ec_lang['lpn_units_nondestructive_desc']='अविनाशी: हर इनपुट को जैसा है वैसा ही छोड़ता है और उसे नई इकाई में फिर से पढ़ता है।';
$ec_lang['lpn_units_destructive']='विनाशी';
$ec_lang['lpn_units_destructive_desc']='विनाशी: गणितीय रूपांतरण से हर इनपुट को फिर से लिखता है, ताकि नेटवर्क रूपांतरण की सीमाओं के भीतर भौतिक रूप से लगभग वही बना रहे। यह मूल इनपुट खो देता है। पूर्ववत करने से वे वापस आ जाते हैं।';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} मानों का अर्थ अब {unit} है। कुछ भी फिर से नहीं लिखा गया।';
$ec_lang['lpn_status_converted']='{n} मान {unit} में फिर से लिखे गए।';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='नेटवर्क को एक मात्रा के अनुसार रंग दें, ताकि बड़ा मानचित्र एक नज़र में पढ़ा जा सके। दाब और वेग — ये दो सामान्यतः सबसे महत्वपूर्ण होते हैं।';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='लंबाई';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='मानचित्र निर्देशांक';
$ec_lang['lpn_units_mapcoords_deg']='डिग्री';
$ec_lang['lpn_units_usft']='US सर्वेक्षण फ़ुट';
$ec_lang['lpn_units_elevhead']='स्तर और हेड';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='हेड हानि प्रवणता';
$ec_lang['lpn_result_gradient_tip']='पाइप की लंबाई से विभाजित हेड हानि। इसका उपयोग विभिन्न लंबाइयों के पाइपों की तुलना एक डिज़ाइन सीमा से करने के लिए करें।';
$ec_lang['lpn_result_water_age']='जल आयु';
$ec_lang['lpn_result_water_age_tip']='यहाँ तक पहुँचने वाला पानी सिस्टम में कितनी देर से है। जहाँ प्रवाह मिलते हैं, वहाँ आने वाला पानी मिश्रित आयु का होता है, और यहाँ दी गई संख्या प्रवाह के अनुसार भारांकित उनका औसत है: यदि किसी जंक्शन को अधिकतर एक छोटी नई मुख्य लाइन से पानी मिलता है, तो वहाँ आयु कम दिखेगी, भले ही एक लंबी डेड-एंड लाइन भी उसे पानी देती हो। टैंक में यह रखे गए पानी की औसत आयु है, इसीलिए धीरे-धीरे बदलने वाला टैंक सामान्यतः नेटवर्क का सबसे पुराना पानी रखता है। इसकी तुलना करने के लिए कोई नियामक सीमा नहीं है, इसलिए इस संख्या को अपने ही सिस्टम के हिसाब से आँकें।';
$ec_lang['lpn_result_source_share']='स्रोत हिस्सा';
$ec_lang['lpn_result_source_share_tip']='यहाँ तक पहुँचने वाले पानी का कितना हिस्सा अनुरेखण नोड से आया। यही वह है जो स्रोत अनुरेखण विश्लेषण बताता है।';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='औसत जल आयु';
$ec_lang['lpn_result_avg_source_share']='औसत स्रोत हिस्सा';
$ec_lang['lpn_result_avg_concentration']='औसत सांद्रता';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='घर्षण कारक';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='प्रतिक्रिया दर';
$ec_lang['lpn_result_status']='स्थिति';
$ec_lang['lpn_result_status_open']='खुला';
$ec_lang['lpn_result_status_closed']='बंद';
$ec_lang['lpn_result_head']='हेड';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='इस नोड पर जल की ऊर्जा, जल-स्तंभ की ऊँचाई के रूप में लिखी गई। यह एक निरपेक्ष ऊँचाई है, जबकि दाब एक गेज माप है।';
$ec_lang['lpn_result_pressure']='दाब';
$ec_lang['lpn_result_flow']='प्रवाह';
$ec_lang['lpn_result_velocity']='वेग';
$ec_lang['lpn_result_headloss']='हेड हानि';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='केवल इस प्रोजेक्ट की सेटिंग्स रीसेट करता है। आपका चित्र और आपके अन्य प्रोजेक्ट नहीं बदलते। पुनः उपयोग के लिए अपनी पसंदीदा सेटिंग्स सहेजने हेतु केवल सेटिंग्स वाली एक प्रोजेक्ट फ़ाइल सहेजें।';
$ec_lang['lpn_reset_all_tip']='हर प्रोजेक्ट, हर पृष्ठभूमि छवि, हर सेटिंग, और आपकी इकाई पसंद को मिटाकर पृष्ठ को ठीक वैसे ही फिर से लोड करता है जैसे एक पहली बार आने वाला आगंतुक देखता है। यही एकमात्र रीसेट है जो सब कुछ साफ़ करता है।';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='यह कैलकुलेटर प्रोजेक्ट की इकाइयों और इनपुट को वैसे ही संग्रहीत करता है जैसे दर्ज किए गए थे, लेकिन पहले यह संख्याओं को संग्रहण के लिए SI में बदल देता था। यह प्रोजेक्ट उस बदलाव से पहले सहेजा गया था, इसलिए इसकी संख्याएँ SI में संग्रहीत थीं। क्या उन्हें अंतिम बार वर्तमान इकाइयों में बदल दिया जाए? आपके निर्णय के लिए, यहाँ कुछ व्यास दिए गए हैं जो बदले जाएँगे, बदलाव से पहले और बाद के मानों सहित:';
$ec_lang['lpn_v2_restore_yes']='बदलें';
$ec_lang['lpn_v2_restore_never']='नहीं। फिर कभी न पूछें।';
$ec_lang['lpn_v2_restore_no']='बंद करें ताकि मैं पहले वर्तमान इकाइयाँ जाँच सकूँ';
$ec_lang['lpn_storage_too_new']='यह प्रोजेक्ट पृष्ठ के किसी नए संस्करण द्वारा सहेजा गया था, इसलिए इसे यहाँ नहीं खोला जा सकता।';
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
$ec_lang['lpn_tool_file']='फ़ाइल';
$ec_lang['lpn_menu_edit']='संपादन';
$ec_lang['lpn_menu_insert']='सम्मिलित करें';
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
$ec_lang['lpn_menu_map']='मानचित्र';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='सड़क मानचित्र दिखाएँ';
$ec_lang['lpn_basemap_satellite_show']='सैटेलाइट छवियाँ दिखाएँ';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='भू-संदर्भित';
$ec_lang['lpn_xymap']='स्थानीय';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='इस रूप में बदलें…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='{name} की प्रति';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='इस रूप में बदलें';
$ec_lang['lpn_convas_coordsys_tip']='वह निर्देशांक प्रणाली जिसमें प्रति बदली जाती है। जब यह इस प्रोजेक्ट की प्रणाली से भिन्न होती है, तो दो स्थिति-निर्धारण चरण आते हैं। जो प्रोजेक्ट पहले से जानता है कि वह कहाँ है, वह दोनों चरणों को पहले से उत्तरित खोलता है, ताकि आप उन्हें वैसे ही स्वीकार करें या बदलाव करें।';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='वर्तमान: {crs}';
$ec_lang['lpn_convas_epsg']='EPSG निर्देशांक प्रणाली';
$ec_lang['lpn_convas_epsg_tip']='EPSG रजिस्टर से एक निर्देशांक प्रणाली चुनें। अक्षांश और देशांतर WGS 84 (EPSG:4326) है।';
$ec_lang['lpn_convas_unnamed']='अनाम (स्थानीय) भू-संदर्भ';
$ec_lang['lpn_convas_unnamed_tip']='लंबाई इकाई में स्थानीय निर्देशांक, विश्व मानचित्र जुड़ा हुआ।';
$ec_lang['lpn_convas_none_tip']='लंबाई इकाई में स्थानीय निर्देशांक, अभी कोई विश्व मानचित्र नहीं।';
$ec_lang['lpn_convas_units_tip']='वे इकाइयाँ जिनमें प्रति बदली जाती है। मूल अपनी संख्याएँ और इकाइयाँ बनाए रखता है।';
$ec_lang['lpn_convas_round']='बदले गए मानों को पूर्णांकित करें';
$ec_lang['lpn_convas_round_tip']='केवल उन संख्याओं को पूर्णांकित करता है जिन्हें यह रूपांतरण फिर से लिखता है, आपके चुने गए निकटतम चरण तक। जिन मानों की इकाई नहीं बदलती, वे वैसे ही रहते हैं।';
$ec_lang['lpn_convas_round_none']='कोई पूर्णांकन नहीं';
$ec_lang['lpn_convas_round_flow']='माँग और प्रवाह';
$ec_lang['lpn_convas_label_col']='प्रत्यय';
$ec_lang['lpn_convas_label_tip']='प्रति के मानचित्र लेबल पर इस मान के बाद जोड़ा गया टेक्स्ट, जैसे \' mm\' या \' gpm\'। ऊपर चुनी गई इकाई से पहले से भरा हुआ; कोई प्रत्यय न चाहिए तो इसे खाली करें।';
$ec_lang['lpn_convas_oneway']='वापस बदलना एक दूसरा रूपांतरण है, पूर्ववत करना नहीं। एक संख्या जो बदली गई और वापस बदली गई, वह ठीक वैसी नहीं लौट सकती जैसी टाइप की गई थी।';
$ec_lang['lpn_convas_ok']='बदलें';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} उन कुछ सूचीबद्ध निर्देशांक प्रणालियों में से एक है जिनमें उपयोगी प्रक्षेपण जानकारी नहीं है, इसलिए इसे बदला या इससे बदला नहीं जा सकता। कुछ भी नहीं बदला गया।';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='बदली गई प्रति {name} है। मूल प्रोजेक्ट अपरिवर्तित है।';
$ec_lang['lpn_convas_cancelled']='कुछ भी नहीं बदला गया। प्रति बंद कर दी गई है, और मूल प्रोजेक्ट अपरिवर्तित है।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='इस प्रोजेक्ट को एक नए टैब में कॉपी करता है और प्रति को आपके चुने गए निर्देशांक प्रणाली और इकाइयों में बदलता है। जब निर्देशांक प्रणाली बदलती है, तो एक विज़ार्ड आपको पहले अपने नेटवर्क के पीछे के मानचित्र को मोटे तौर पर ज़ूम करने, फिर अपने नेटवर्क को मानचित्र पर अधिक सटीकता से मापने और घुमाने में मार्गदर्शन करता है। यह प्रोजेक्ट बिल्कुल वैसा ही रहता है जैसा है। बिना कुछ बदले भू-संदर्भित करने के लिए, इसके बजाय Map, World map, Attach का उपयोग करें।';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='यह प्रोजेक्ट पहले से भू-संदर्भित है, इसलिए नेटवर्क पहले से मानचित्र पर है और कुछ भी हिलाया नहीं गया है। जाँच लें कि यह सही जगह पर है, फिर Put the model here बटन और Keep this placement बटन दबाएँ।';
$ec_lang['lpn_georef_intro']='मॉडल को रखने में दो चरण लगते हैं। चरण 1 तेज़ वाला है: मॉडल स्थिर रहता है और आप उसके पीछे मानचित्र को हिलाते हैं, जब तक आपकी साइट मॉडल के नीचे लगभग सही आकार में न आ जाए। अभी कोई घुमाव नहीं है। चरण 2 सटीक वाला है: आप मॉडल को स्वयं खींचते, आकार बदलते और घुमाते हैं। आपका प्रोजेक्ट शुरुआत में पूरी दुनिया के मानचित्र पर है, इसलिए पहले अपनी जगह ढूँढ़ें, फिर मॉडल यहाँ रखें बटन दबाएँ।';
$ec_lang['lpn_georef_adjust']='मॉडल अब ज़मीन पर है, इसलिए वह मानचित्र के साथ चलता है। मॉडल को ले जाने के लिए उसे खींचें, आकार बदलने के लिए किसी कोने को खींचें, मॉडल के ऊपर के गोल हैंडल को खींचकर उसे घुमाएँ। या नीचे ज़मीन की दूरी और घुमाव कोण टाइप करें।';
$ec_lang['lpn_georef_step1']='चरण 1 का 2 — तेज़';
$ec_lang['lpn_georef_step2']='चरण 2 का 2 — सटीक';
$ec_lang['lpn_georef_step1_hint']='आपका प्रोजेक्ट स्क्रीन पर जहाँ है वहीं रहता है। नीचे के मानचित्र को तब तक पैन और ज़ूम करें जब तक उसके पीछे की ज़मीन मोटे तौर पर सही जगह और सही आकार की न लगे, फिर मॉडल यहाँ रखें दबाएँ।';
$ec_lang['lpn_georef_detach']='इसे फिर से उठाएँ';
$ec_lang['lpn_georef_size_prompt']='पूरे प्रोजेक्ट में, साइट लगभग कितनी चौड़ी है?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='शॉर्टकट: {key} दबाएँ।';
$ec_lang['lpn_tool_key_hint_two']='शॉर्टकट: {key} या {key2} दबाएँ।';
$ec_lang['lpn_tool_add_junction_tip']='जंक्शन जोड़ने के लिए मानचित्र पर क्लिक करें: वह बिंदु जहाँ पाइप मिलते हैं या जहाँ जल का उपयोग होता है।';
$ec_lang['lpn_tool_add_reservoir_tip']='जलाशय जोड़ने के लिए मानचित्र पर क्लिक करें: एक अनंत स्रोत जिसका जल स्तर स्थिर रहता है।';
$ec_lang['lpn_tool_add_tank_tip']='टैंक जोड़ने के लिए मानचित्र पर क्लिक करें: भंडारण, जिसका जल स्तर भरने और खाली होने के साथ ऊपर-नीचे होता है।';
$ec_lang['lpn_tool_add_pipe_tip']='दो नोड्स के बीच पाइप खींचने के लिए एक नोड पर, फिर दूसरे पर क्लिक करें।';
$ec_lang['lpn_tool_add_pump_tip']='दो नोड्स के बीच पंप लगाने के लिए एक नोड पर, फिर दूसरे पर क्लिक करें।';
$ec_lang['lpn_tool_add_valve_tip']='दो नोड्स के बीच वाल्व लगाने के लिए एक नोड पर, फिर दूसरे पर क्लिक करें।';
$ec_lang['lpn_tool_add_text_tip']='ड्राइंग पर टिप्पणी लिखने के लिए मानचित्र पर क्लिक करें।';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='आकृति के अंदर की हर चीज़ चुनने के लिए मानचित्र पर बताए अनुसार क्लिक करें। आकृति को विंडो, लैसो और बहुभुज के बीच बदलने के लिए इस बटन को फिर से दबाएँ। चुनते समय Shift दबाए रखें ताकि मौजूदा चयन के साथ जारी रखा जा सके, जो आप चुनें उसे जोड़ते या हटाते (टॉगल करते) हुए।';
$ec_lang['lpn_area_selected']='{n} चयनित।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='उस क्षेत्र में कुछ नहीं मिला।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='मानचित्र पर पाइप को आकार देने वाले वर्टेक्स जोड़ें और हटाएँ। वर्टेक्स जोड़ने के लिए पाइप पर क्लिक करें, हटाने के लिए वर्टेक्स पर क्लिक करें, और वर्टेक्स को खींचकर हिलाएँ। एक वर्टेक्स केवल खींचे गए रास्ते को बदलता है, हाइड्रॉलिक्स को नहीं।';
$ec_lang['lpn_tool_delete_tip']='किसी चीज़ को हटाने के लिए मानचित्र पर उस पर क्लिक करें।';
$ec_lang['lpn_tool_undo_tip']='पिछला बदलाव पूर्ववत करें।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='पूरे नेटवर्क को विंडो में समाएँ।';
$ec_lang['lpn_tool_zoom_window_tip']='मानचित्र पर एक बॉक्स के दो विपरीत कोनों पर क्लिक करें, या एक खींचें, उसमें ज़ूम इन करने के लिए। पूरा चित्र दिखाएँ के लिए इस बटन को फिर से दबाएँ।';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='ज़ूम इन। शॉर्टकट: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='ज़ूम आउट। शॉर्टकट: -';
$ec_lang['lpn_tool_settings_tip']='इस प्रोजेक्ट की सेटिंग्स खोलें।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='किसी तत्व को उसकी ID से खोजें, या किसी शर्त से मेल खाने वाला हर तत्व खोजें, और उन सबको एक साथ बदलें।';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='टूलबार';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='दृश्यता';
$ec_lang['lpn_pane_right_toggle_tip']='मानचित्र के दाईं ओर का पैनल दिखाएँ या छुपाएँ। इसमें लेबल और रंग के विकल्प होते हैं।';
$ec_lang['lpn_color_legend_open_tip']='इन रंगों को बदलने के लिए दृश्यता पैनल खोलने हेतु क्लिक करें।';
$ec_lang['lpn_color_node_field']='नोड्स को इसके अनुसार रंग दें';
$ec_lang['lpn_color_link_field']='पाइपों को इसके अनुसार रंग दें';
$ec_lang['lpn_color_ramp_sequential']='क्रमिक';
$ec_lang['lpn_color_ramp_diverging']='अपसारी';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='श्रेणियों की संख्या';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='श्रेणी आबंटन';
$ec_lang['lpn_color_ranges_note']='नीचे दी गई सीमाएँ एक बार सेट होने पर स्थिर रहती हैं; वे परिणामों के बदलने के साथ नहीं बदलतीं। ऊपर Data classification method चुनने से सीमाएँ सिस्टम की मौजूदा स्थिति से तय होती हैं। यदि आप किसी मान को हाथ से बदलते हैं, तो ऊपर की विधि Manual हो जाती है।';
$ec_lang['lpn_color_criterion_note']='यह विधि अपनी सीमाएँ एक डिज़ाइन मानक से लेती है, इसलिए जब तक यह विधि चुनी रहती है, रंगों की संख्या स्थिर रहती है।';
$ec_lang['lpn_color_break_number']='सीमा एक संख्या होनी चाहिए। मानचित्र में कोई बदलाव नहीं हुआ।';
$ec_lang['lpn_color_break_order']='हर सीमा पिछली सीमा से बड़ी होनी चाहिए। मानचित्र में कोई बदलाव नहीं हुआ।';
$ec_lang['lpn_color_break_count']='रंगों की संख्या से एक सीमा कम होनी चाहिए। मानचित्र में कोई बदलाव नहीं हुआ।';
$ec_lang['lpn_color_ramp_qualitative']='गुणात्मक';
$ec_lang['lpn_color_ramp_rainbow']='इंद्रधनुष';
$ec_lang['lpn_color_ramp_rainbow_eg']='EPANET जैसा';
$ec_lang['lpn_color_example_material']='सामग्री';
$ec_lang['lpn_color_ramp_ylgnbu']='पीले से नीला';
$ec_lang['lpn_color_ramp_rdylbu']='लाल से नीला, पीले से होकर';
$ec_lang['lpn_georef_drop']='मॉडल यहाँ रखें';
$ec_lang['lpn_georef_finish']='यह स्थिति रखें';
$ec_lang['lpn_georef_scale']='ड्राइंग की प्रति इकाई ज़मीनी दूरी';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='आपकी ड्राइंग की एक इकाई ज़मीन पर कितनी दूर तक पहुँचती है। सादे ग्रिड पर बनी ड्राइंग में आमतौर पर यह कहीं नहीं बताया जाता, इसलिए इसे यहाँ सेट करें — या यहाँ जाएँ… को साइट की चौड़ाई पूछने दें और इसे स्वयं निकालने दें।';
$ec_lang['lpn_georef_rotation']='वामावर्त घुमाएँ (डिग्री)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='पूरे मॉडल को वामावर्त कितना घुमाना है, ताकि उसकी उत्तर दिशा सही उत्तर की ओर इंगित करे।';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='मॉडल को यहाँ स्थायी रूप से रखें? आप बाद में भी अलग-अलग तत्वों को खींच सकते हैं, पर ड्राइंग xy प्रोजेक्ट नहीं रहेगी। xy वापस पाने के लिए इस प्रोजेक्ट को बिना सहेजे बंद करें।';
$ec_lang['lpn_georef_done']='अब यह एक lat/lon प्रोजेक्ट है। किसी भी तत्व को उसकी वास्तविक जगह के करीब ले जाने के लिए उसे खींचें।';
$ec_lang['lpn_georef_backdrop_unrotated']='पृष्ठभूमि छवि को मॉडल के साथ ले जाया और आकार बदला गया, लेकिन उसे घुमाया नहीं जा सका। इसे संरेखित करने के लिए मानचित्र, पृष्ठभूमि छवि, ले जाएँ का उपयोग करें।';
$ec_lang['lpn_georef_empty']='उस फ़ाइल में कोई नेटवर्क नहीं है, इसलिए रखने के लिए कुछ नहीं है।';
$ec_lang['lpn_georef_unavailable']='प्लेसमेंट टूल लोड नहीं हुआ। पृष्ठ फिर से लोड करें और फिर से प्रयास करें।';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='प्रोजेक्ट बदलने से पहले "यह प्लेसमेंट रखें" बटन से प्लेसमेंट पूरा करें, या Cancel दबाएँ। यह प्लेसमेंट इसी प्रोजेक्ट का है और किसी दूसरे में आपके साथ नहीं जा सकता।';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='सहेजने से पहले "यह प्लेसमेंट रखें" बटन से प्लेसमेंट पूरा करें, या Cancel दबाएँ। प्रोजेक्ट अभी भी रखा जा रहा है, इसलिए स्क्रीन पर जो दिख रहा है वह अभी तक वह नहीं है जो फ़ाइल में लिखा जाएगा।';
$ec_lang['lpn_goto_menu']='एक अक्षांश और देशांतर पर जाएँ…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='मानचित्र को उस जगह ले जाएँ जिसके निर्देशांक आपके पास पहले से हैं। पहले अक्षांश, फिर देशांतर, जैसे मानचित्र इन्हें देता है, दोनों के बीच एक स्पेस के साथ: 38 -122';
$ec_lang['lpn_goto_prompt']='अक्षांश और देशांतर, उसी क्रम में';
$ec_lang['lpn_goto_bad']='यह एक अक्षांश और एक देशांतर नहीं है। 38 -122 जैसा कुछ आज़माएँ, दोनों के बीच एक स्पेस के साथ।';
$ec_lang['lpn_georef_goto']='यहाँ जाएँ…';
$ec_lang['lpn_georef_twopt']='दो ज्ञात बिंदु उपयोग करें';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='मॉडल को ठीक-ठीक रखें, जब आपको पहले से पता हो कि आपकी ड्राइंग पर दो बिंदु वास्तव में कहाँ हैं। उनमें से एक पर क्लिक करें, उसका अक्षांश और देशांतर टाइप करें, फिर दूसरे बिंदु के लिए भी वही करें। स्थिति, स्केल और घुमाव — सब कुछ उन दो बिंदुओं से ही तय हो जाता है। चुनना रोकने के लिए इस बटन को फिर से दबाएँ।';
$ec_lang['lpn_georef_twopt_pick1']='अपनी ड्राइंग पर वह बिंदु क्लिक करें जिसका अक्षांश और देशांतर आपको पता है।';
$ec_lang['lpn_georef_twopt_pick2']='अब एक दूसरा ज्ञात बिंदु क्लिक करें, जो पहले से जितना दूर हो सके उतना दूर हो।';
$ec_lang['lpn_georef_twopt_same']='यह वही बिंदु है जो आपने पहले चुना था। कोई दूसरा बिंदु चुनें।';
$ec_lang['lpn_georef_twopt_done']='मॉडल अब आपके दिए गए दोनों बिंदुओं पर टिका है। इसकी जाँच करें, फिर यह स्थिति रखें बटन दबाएँ।';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='निचला पैनल';
$ec_lang['lpn_pane_toggle_tip']='मानचित्र के नीचे का पैनल दिखाएँ या छुपाएँ। इसमें प्रोफ़ाइल और हर तरह के भाग के लिए एक तालिका होती है।';
$ec_lang['lpn_pane_resize']='पैनल को ऊँचा या नीचा करने के लिए खींचें';
$ec_lang['lpn_pane_tab_junctions']='जंक्शन';
$ec_lang['lpn_pane_tab_reservoirs']='जलाशय';
$ec_lang['lpn_pane_tab_tanks']='टंकियाँ';
$ec_lang['lpn_pane_tab_pipes']='पाइप';
$ec_lang['lpn_pane_tab_pumps']='पंप';
$ec_lang['lpn_pane_tab_valves']='वाल्व';
$ec_lang['lpn_pane_tab_tip']='यह टैब इस तरह के तत्वों को एक तालिका के रूप में दिखाता है जिसे आप क्रमबद्ध और संपादित कर सकते हैं। परिणाम स्तंभ संपादित नहीं किए जा सकते।';
$ec_lang['lpn_pane_none']='इस नेटवर्क में अभी इनमें से कोई नहीं है।';
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
$ec_lang['lpn_pane_text_attached']='संलग्न';
$ec_lang['lpn_pane_not_used']='उपयोग नहीं हुआ';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='{q} से फ़िल्टर किया गया। {all} में से {n} दिखाए जा रहे हैं।';
$ec_lang['lpn_pane_filter_clear']='सभी दिखाएँ';
$ec_lang['lpn_pane_filter_stale']='अब मेल न खाने वाली पंक्तियाँ: {n}।';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='इस तालिका में कुछ भी इस फ़िल्टर से मेल नहीं खाता।';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='ज़ूम करें और चुनें';
$ec_lang['lpn_goto_on_map']='मानचित्र पर दिखाएँ';
$ec_lang['lpn_pane_select_on_map']='मानचित्र पर चुनें';
$ec_lang['lpn_pane_unselect_on_map']='मानचित्र पर चयन हटाएँ';
$ec_lang['lpn_pane_print']='तालिका छापें';

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
$ec_lang['lpn_menu_project']='जल';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='जल नेटवर्क मॉडलिंग से जुड़ी हर चीज़ यहीं एक जगह है, सिवाय एनिमेशन चलाने के नियंत्रणों के। चीज़ें कहाँ हैं, यह अंदाज़ा लगाने की ज़रूरत नहीं है।';
$ec_lang['lpn_tables_menu']='तालिकाएँ';
$ec_lang['lpn_tables_menu_tip']='मानचित्र के नीचे उस पैनल को खोलें जो इस नेटवर्क के भागों की तालिका दिखाता है। हर तरह के भाग के लिए एक तालिका है, और आप उसे वहाँ क्रमबद्ध और संपादित कर सकते हैं।';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='इस नेटवर्क की अभी फिर से गणना करें। Run बटन ढूँढ़ रहे हैं? जब तक Recalculate automatically सेटिंग चालू है यह छुपा रहता है। बटन वापस लाने के लिए, Settings, Calculation, Hydraulics में जाकर Recalculate automatically बंद करें।';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='स्वतः फिर से गणना करें';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='यह चालू होने पर, यह प्रोजेक्ट आपके हर बदलाव के थोड़ी देर बाद फिर से गणना करता है, और गणना करें बटन टूलबार से हटा दिया जाता है क्योंकि उसके लिए कुछ बचता नहीं है। बड़े नेटवर्क पर इसे बंद करें, जहाँ हर बदलाव की गणना का इंतज़ार करना टाइप करने में बाधा डालता है, और गणना करें बटन वापस आ जाता है ताकि आप चुन सकें कि कब चलाना है।';
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
$ec_lang['lpn_time_run_slow']='इस नेटवर्क की गणना करने में {secs} सेकंड लगे, और यह हर बदलाव के बाद फिर से गणना करने के लिए सेट है। इसे रोकने और गणना करें बटन वापस पाने के लिए, सेटिंग्स में, गणना के अंतर्गत, हाइड्रॉलिक्स में जाकर “स्वतः फिर से गणना करें” बंद करें।';
$ec_lang['lpn_time_no_report']='अभी तक कोई रन रिपोर्ट नहीं है। यह रिपोर्ट EPANET का अपना पाठ है, इसलिए यह तभी दिखती है जब इस नेटवर्क की गणना EPANET सॉल्वर से की गई हो।';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='सहायता';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='स्क्रीनशॉट गैलरी';
$ec_lang['lpn_help_walkthroughs']='मार्गदर्शिकाएँ';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='नेटवर्क हटाएँ';
$ec_lang['lpn_confirm_delete_network']='इस प्रोजेक्ट के हर नोड, पाइप और टेक्स्ट लेबल को हटाएँ? पृष्ठभूमि छवि, प्रोजेक्ट का नाम, और आपकी सेटिंग्स बनी रहेंगी। इसे पूर्ववत नहीं किया जा सकता।';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='खोजें और बदलें';
$ec_lang['lpn_find_title']='खोजें और बदलें';
$ec_lang['lpn_find_scope']='क्या खोजें';
$ec_lang['lpn_find_scope_all']='सब कुछ';
$ec_lang['lpn_find_property']='गुण';
$ec_lang['lpn_find_condition']='शर्त';
$ec_lang['lpn_find_value']='मान';
$ec_lang['lpn_find_btn']='खोजें';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='वर्तमान तालिका में फ़िल्टर करें';
$ec_lang['lpn_find_filter_tip']='मानचित्र के नीचे दी तालिकाओं में से किसी एक में केवल वे भाग दिखाएँ जो इस क्वेरी से मेल खाते हैं। ड्राइंग नहीं बदलती और कुछ भी हटाया नहीं जाता।';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {all} में से {n}';
$ec_lang['lpn_find_filter_summary']='{q} द्वारा फ़िल्टर किया गया। {rows}।';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='यह क्वेरी किसी भी तालिका पर लागू नहीं होती।';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='में शामिल है';
$ec_lang['lpn_find_op_equals']='के बराबर';
$ec_lang['lpn_find_op_gt']='से अधिक';
$ec_lang['lpn_find_op_lt']='से कम';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='खाली';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} मिले। किसी एक पर जाने के लिए क्लिक करें।';
$ec_lang['lpn_find_shift_hint']='टॉगल करने के लिए Shift+क्लिक करें: चयन सेट में न होने पर जोड़ता है, चयन सेट में पहले से होने पर हटाता है।';
$ec_lang['lpn_find_none']='कुछ भी मेल नहीं खाया।';
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
$ec_lang['lpn_find_op_top']='सबसे ऊपर के {n}';
$ec_lang['lpn_find_op_bottom']='सबसे नीचे के {n}';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='जो खोजना है वह टाइप करें।';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='जुड़ाव';
$ec_lang['lpn_find_prop_demand_desc']='इस माँग श्रेणी का विवरण';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='नोड पर कोई लिंक नहीं';
$ec_lang['lpn_find_op_conn_noopen']='नोड पर कोई खुला लिंक नहीं';
$ec_lang['lpn_find_op_conn_nolinksource']='स्रोत तक कोई लिंक पथ नहीं';
$ec_lang['lpn_find_op_conn_noopensource']='स्रोत तक कोई खुला पथ नहीं';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='हर नोड जुड़ा हुआ है।';
$ec_lang['lpn_find_conn_no_fixed']='इस नेटवर्क में कोई जलाशय या टैंक नहीं है, इसलिए पहुँचने के लिए कोई स्रोत नहीं है। केवल नोड पर कोई लिंक नहीं और नोड पर कोई खुला लिंक नहीं ही खोजे जा सकते हैं।';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='वही खोज, एक पंक्ति में लिखी हुई। नियंत्रण बदलने पर यह पंक्ति फिर से लिखी जाती है, और इस पंक्ति में टाइप करने पर नियंत्रण अपडेट होते हैं।';
$ec_lang['lpn_find_query_label']='क्वेरी';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='शर्तों को AND (और), OR (या) और कोष्ठकों () से जोड़ें।';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='और';
$ec_lang['lpn_find_q_or']='या';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='नियंत्रण नीचे दी गई क्वेरी को नहीं दिखा सकते, इसलिए उन्हें छुपा दिया गया है।';
$ec_lang['lpn_find_q_restore']='इसके बजाय नियंत्रण उपयोग करें';
$ec_lang['lpn_replace_q_bad']='यह क्वेरी समझी नहीं जा सकी, इसलिए कुछ भी नहीं बदला जा सकता। पहले इसे ऊपर ठीक करें।';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(अक्षर {n} पर)';
$ec_lang['lpn_find_q_err_empty']='क्वेरी खाली है, इसलिए कुछ भी नहीं खोजा जाएगा।';
$ec_lang['lpn_find_q_err_scope']='{w} नाम की कोई चीज़ खोजने के लिए नहीं है। इनमें से कोई आज़माएँ: {list}';
$ec_lang['lpn_find_q_err_dot']='जिसे खोजना है और उसके गुण के बीच एक डॉट लगाएँ, जैसे जंक्शन.ID';
$ec_lang['lpn_find_q_err_prop']='{scope} का कोई गुण नहीं: {w}। इनमें से कोई आज़माएँ: {list}';
$ec_lang['lpn_find_q_err_op']='{prop} के लिए कोई शर्त नहीं: {w}। इनमें से कोई आज़माएँ: {list}';
$ec_lang['lpn_find_q_err_value']='इस शर्त के बाद एक मान चाहिए: {op}';
$ec_lang['lpn_find_q_err_quote']='किसी टेक्स्ट मान के चारों ओर उद्धरण चिह्न लगाएँ: {w} एक संख्या नहीं है।';
$ec_lang['lpn_find_q_err_quote_end']='इस उद्धृत टेक्स्ट का कोई समापन उद्धरण चिह्न नहीं है।';
$ec_lang['lpn_find_q_err_close']='यह कोष्ठक ( खोला गया था और कभी बंद नहीं हुआ।';
$ec_lang['lpn_find_q_err_open']='यह कोष्ठक ) कुछ भी बंद नहीं करता।';
$ec_lang['lpn_find_q_err_end']='इसके बाद कुछ भी अपेक्षित नहीं था। दो खोजों को {and} या {or} से जोड़ें।';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='जो मिला उसे बदलें';
$ec_lang['lpn_replace_prop']='बदलने के लिए गुण';
$ec_lang['lpn_replace_value']='नया मान';
$ec_lang['lpn_replace_source']='नया मान स्रोत';
$ec_lang['lpn_replace_asked']='{n} नोड के लिए ऊँचाइयाँ माँगी गईं। परिणाम आ रहे हैं।';
$ec_lang['lpn_replace_btn']='बदलें';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='{n} तत्व बदलें?';
$ec_lang['lpn_replace_apply']='उन्हें बदलें';
$ec_lang['lpn_replace_done']='{n} तत्व बदले गए। आप इसे एक चरण में पूर्ववत कर सकते हैं।';
$ec_lang['lpn_replace_none']='कुछ नहीं बदलेगा।';
$ec_lang['lpn_replace_no_value']='नया मान टाइप करें।';
$ec_lang['lpn_replace_scope']='मान बदलने के लिए ऊपर एक तरह का तत्व चुनें।';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='प्रोफ़ाइल';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_tip']='नेटवर्क से गुज़रने वाले किसी मार्ग के साथ ज़मीन और हाइड्रॉलिक ग्रेड रेखा बनाएँ।';
$ec_lang['lpn_profile_title']='मार्ग के साथ प्रोफ़ाइल';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='उस नोड पर क्लिक करें जहाँ से पथ शुरू होता है।';
$ec_lang['lpn_profile_draw_more']='पथ देखने के लिए मानचित्र पर घुमाएँ। किसी नोड को जोड़ने के लिए उस पर क्लिक करें। पूरा करने के लिए डबल-क्लिक करें। Esc रद्द कर देता है।';
$ec_lang['lpn_profile_draw_blocked']='{a} से {b} तक कोई रास्ता नहीं है। कोई और नोड चुनें।';
$ec_lang['lpn_profile_tap_start']='उस नोड पर टैप करें जहाँ से पथ शुरू होता है।';
$ec_lang['lpn_profile_tap_more']='पथ देखने के लिए किसी नोड पर टैप करें। उसे जोड़ने के लिए दबाकर रखें। पूरा करने के लिए डबल-टैप करें। रद्द करने के लिए फिर से प्रोफ़ाइल दबाएँ।';
$ec_lang['lpn_profile_say_idle']='मानचित्र पर नया पथ चुनने के लिए फिर से प्रोफ़ाइल दबाएँ।';
$ec_lang['lpn_profile_none']='अभी तक कोई पथ नहीं है। मानचित्र पर एक चुनने के लिए फिर से प्रोफ़ाइल दबाएँ।';
$ec_lang['lpn_profile_choose']='एक आरंभिक नोड और एक अंतिम नोड चुनें।';
$ec_lang['lpn_profile_no_path']='ये दो नोड्स किसी भी मार्ग से जुड़े नहीं हैं।';
$ec_lang['lpn_profile_no_solve']='अभी कोई परिणाम नहीं है, इसलिए केवल ज़मीन की रेखा बनाई गई है।';
$ec_lang['lpn_profile_summary']='नोड्स: {n}, लंबाई: {len} {u}';
$ec_lang['lpn_profile_axis_station']='मार्ग के साथ दूरी ({u})';
$ec_lang['lpn_profile_axis_elev']='स्तर और हेड ({u})';
$ec_lang['lpn_profile_ground']='ज़मीन की सतह';
$ec_lang['lpn_profile_hgl']='हाइड्रॉलिक ग्रेड लाइन';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='बदलें';
$ec_lang['lpn_profile_edit_tip']='पूरा मार्ग फिर से बनाए बिना, मार्ग के एक छोर को बदलें, या उसमें से एक नोड हटाएँ।';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='मार्ग पर किसी भी बिंदु को खींचकर हिलाएँ। जो बिंदु आपने जोड़ा था उसे हटाने के लिए उस पर क्लिक करें।';
$ec_lang['lpn_profile_edit_tap']='मार्ग पर किसी भी बिंदु को खींचकर हिलाएँ। जो बिंदु आपने जोड़ा था उसे हटाने के लिए उसे टैप करें।';
$ec_lang['lpn_profile_edit_nowhere']='मार्ग पर एक बिंदु ज़रूर एक नोड होना चाहिए। मार्ग में कोई बदलाव नहीं हुआ।';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='सहेजे गए मार्ग';
$ec_lang['lpn_profile_new']='नया सहेजा गया मार्ग…';
$ec_lang['lpn_profile_new_name']='मार्ग {n}';
$ec_lang['lpn_profile_rename']='मार्ग का नाम बदलें…';
$ec_lang['lpn_profile_delete']='मार्ग हटाएँ';
$ec_lang['lpn_profile_prompt_name']='इस मार्ग के लिए नाम';
$ec_lang['lpn_profile_delete_confirm']='सहेजा गया मार्ग {name} हटाएँ? ड्राइंग में कोई बदलाव नहीं होगा।';
$ec_lang['lpn_profile_none_saved']='अभी तक कोई सहेजा गया मार्ग नहीं';
$ec_lang['lpn_profile_missing']='सहेजा गया मार्ग {name} ऐसे नोड उपयोग करता है जो इस प्रोजेक्ट में नहीं हैं: {ids}';
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
$ec_lang['lpn_ts_menu']='समय शृंखला';
$ec_lang['lpn_ts_tip']='विस्तारित अवधि सिमुलेशन के दौरान एक या अधिक तत्वों को समय के विरुद्ध आलेखित करें।';
$ec_lang['lpn_ts_title']='समय के विरुद्ध मान';
$ec_lang['lpn_ts_group_tip']='क्या ग्राफ नोड दिखाता है या लिंक।';
$ec_lang['lpn_ts_group_nodes']='नोड';
$ec_lang['lpn_ts_group_links']='लिंक';
$ec_lang['lpn_ts_quantity_tip']='समय के विरुद्ध कौन-सा मान आलेखित करना है।';
$ec_lang['lpn_ts_add']='चयनित जोड़ें';
$ec_lang['lpn_ts_add_tip']='मानचित्र पर अभी चुनी गई हर चीज़ को ग्राफ पर डालें।';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='मानचित्र पर उस तरह की कोई चीज़ चुनी नहीं गई है।';
$ec_lang['lpn_ts_clear']='सब हटाएँ';
$ec_lang['lpn_ts_chip_tip']='{id} को ग्राफ से हटाएँ';
$ec_lang['lpn_ts_none']='अभी आलेखित करने के लिए कुछ नहीं है। मानचित्र पर तत्व चुनें और चयनित जोड़ें दबाएँ।';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='अभी तक कोई विस्तारित अवधि परिणाम नहीं है। सिमुलेशन चलाने के लिए Calculate दबाएँ।';
$ec_lang['lpn_ts_summary']='तत्व: {n}, रिपोर्टिंग समय: {steps}';
$ec_lang['lpn_ts_axis_time']='व्यतीत समय';
$ec_lang['lpn_freq_menu']='आवृत्ति';
$ec_lang['lpn_freq_tip']='वर्तमान समय चरण पर सभी जंक्शनों या सभी पाइपों में किसी एक गुण के आवृत्ति वितरण को आलेखित करें।';
$ec_lang['lpn_freq_title']='मानों का वितरण';
$ec_lang['lpn_freq_group_tip']='क्या ग्राफ जंक्शन दिखाता है या पाइप।';
$ec_lang['lpn_freq_quantity_tip']='कौन-सा मान आलेखित करना है।';
$ec_lang['lpn_freq_none']='इस मान के लिए अभी तक कोई परिणाम नहीं है, इसलिए आलेखित करने के लिए कुछ नहीं है।';
$ec_lang['lpn_freq_summary']='आलेखित: {total} में से {n}';
$ec_lang['lpn_freq_summary_time']='आलेखित: {total} में से {n}, {time} पर';
$ec_lang['lpn_freq_axis_percent']='इससे कम प्रतिशत';
$ec_lang['lpn_view_units']='इकाइयाँ';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='सभी सहेजें';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='प्रोजेक्ट{n}';
$ec_lang['lpn_project_copy_suffix']='(प्रतिलिपि)';
$ec_lang['lpn_project_rename']='नाम बदलें';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='नया प्रोजेक्ट…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='नया प्रोजेक्ट';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='निर्देशांक प्रणाली';
$ec_lang['lpn_new_coordsys_tip']='अपने नेटवर्क की निर्देशांक प्रणाली चुनें। यह स्थायी है; नेटवर्क को अलग निर्देशांकों में बदलने का एकमात्र तरीका "File, Open to new coordinates" है, और वह अनुमानित होता है।';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='स्थानीय, योजनाबद्ध, या कस्टम';
$ec_lang['lpn_new_coordsys_local_tip']='भू-संदर्भित नहीं। अपनी खुद की पृष्ठभूमि छवि जोड़ें या कोई न जोड़ें।';
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
$ec_lang['lpn_crs_view']='मानचित्र दृश्य के अनुसार फ़िल्टर करें';
$ec_lang['lpn_crs_view_tip']='केवल वे प्रक्षेपण दिखाता है जो उस स्थान को कवर करते हैं जिसे मानचित्र दिखा रहा है। पूरी सूची देखने के लिए इसे बंद करें।';
$ec_lang['lpn_crs_place']='स्थान नाम खोज';
$ec_lang['lpn_crs_place_tip']='कोई शहर, पता, या स्थलचिह्न टाइप करें, और मानचित्र का दृश्य वहाँ चला जाएगा। आपके टाइप किए शब्द OpenStreetMap की स्थान-नाम सेवा को भेजे जाते हैं, जो पहली बार आपकी अनुमति माँगती है। एक नया भौगोलिक प्रोजेक्ट भी यहाँ खोजे गए स्थान से शुरू होता है।';
$ec_lang['lpn_crs_search']='खोजें';
$ec_lang['lpn_crs_name']='प्रक्षेपण नाम फ़िल्टर';
$ec_lang['lpn_crs_name_tip']='केवल वे प्रक्षेपण दिखाता है जिनके नाम या EPSG कोड में आपका टाइप किया हुआ शामिल है। कोई ज़ोन नंबर, या UTM, या Mercator आज़माएँ।';
$ec_lang['lpn_crs_list_tip']='ऊपर के दोनों फ़िल्टर के बाद बचे प्रक्षेपण। एक चुनें और Select दबाएँ।';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='अभी तक किसी स्थान की खोज नहीं की गई है, इसलिए पूरी सूची दिखाई जा रही है। सूची को सीमित करने के लिए ऊपर किसी स्थान को खोजें या मानचित्र को ज़ूम करें।';
$ec_lang['lpn_crs_count']='{total} में से {n} प्रक्षेपण सूचीबद्ध।';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{total} में से {n} निर्देशांक प्रणालियाँ इस नेटवर्क को कवर करती हैं।';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(कोई मानचित्र नहीं)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} उन कुछ सूचीबद्ध निर्देशांक प्रणालियों में से एक है जिनमें उपयोगी प्रक्षेपण जानकारी नहीं है। इसका अर्थ है कि विश्व मानचित्र, स्थान-नाम खोज, और DEM ऊँचाइयाँ काम नहीं करतीं। आपके निर्देशांक प्रभावित नहीं हैं।';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='अनाम';
$ec_lang['lpn_crs_none']='भू-संदर्भित नहीं';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='एक प्रोजेक्ट अपनी इकाइयाँ स्वयं रखता है, इसलिए यह चुनाव केवल इसी प्रोजेक्ट का है और यहाँ कुछ भी ब्राउज़र सेटिंग के रूप में सहेजा नहीं जाता। नए प्रोजेक्ट किसी खास तरीके से शुरू करने के लिए, एक खाली प्रोजेक्ट को अपने टेम्पलेट के रूप में सहेजें और हर बार उसकी एक प्रति बनाएँ।';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='जयपुर, राजस्थान';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='बनाएँ';
$ec_lang['lpn_file_open']='खोलें…';
$ec_lang['lpn_file_save']='सहेजें';
$ec_lang['lpn_file_saveas']='इस रूप में सहेजें…';
$ec_lang['lpn_file_revert']='सहेजा गया संस्करण फिर लोड करें';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='हाल की फ़ाइलें';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='{file} को कंप्यूटर पर ढूँढ़े बिना फिर से खोलें।';
$ec_lang['lpn_recent_denied']='उस फ़ाइल को खोलने की अनुमति नहीं दी गई, इसलिए वह नहीं खोली गई।';
$ec_lang['lpn_recent_gone']='{file} नहीं खोली जा सकी। हो सकता है इसे स्थानांतरित, नाम-परिवर्तित, या हटा दिया गया हो, इसलिए इसे हाल की सूची से हटा दिया गया।';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='नया प्रोजेक्ट';
$ec_lang['lpn_tab_all']='सभी प्रोजेक्ट';
$ec_lang['lpn_tab_menu']='प्रोजेक्ट मेनू';
$ec_lang['lpn_tab_duplicate']='डुप्लिकेट करें';
$ec_lang['lpn_tab_move_left']='बाईं ओर ले जाएँ';
$ec_lang['lpn_tab_move_right']='दाईं ओर ले जाएँ';
$ec_lang['lpn_tab_unsaved']='फ़ाइल में सहेजा नहीं गया';
$ec_lang['lpn_import_bad_file']='वह फ़ाइल इस पृष्ठ से सहेजे गए प्रोजेक्ट के रूप में नहीं पढ़ी जा सकी।';
$ec_lang['lpn_import_no_room']='इस प्रोजेक्ट को जोड़ने के लिए ब्राउज़र संग्रहण में पर्याप्त जगह नहीं है। किसी अनावश्यक प्रोजेक्ट को हटाएँ और फिर से प्रयास करें।';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='ठीक है';
$ec_lang['lpn_file_import_menu']='आयात करें…';
$ec_lang['lpn_file_import_inp']='EPANET फ़ाइल आयात करें…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='एक EPANET फ़ाइल से नेटवर्क पढ़ें, चाहे वह .inp टेक्स्ट फ़ाइल हो या EPANET द्वारा सहेजी गई .net फ़ाइल, और उसे इस ब्राउज़र में एक नए प्रोजेक्ट के रूप में सहेजें।';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='EPANET फ़ाइल निर्यात करें…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='इस नेटवर्क को EPANET .inp फ़ाइल के रूप में लिखें और डाउनलोड करें। आपके टाइप किए अंक ठीक वैसे ही लिखे जाते हैं जैसे आपने टाइप किए थे। जो कुछ .inp प्रारूप में नहीं समा सकता, वह बाद में आपको सूचीबद्ध कर दिया जाता है।';
$ec_lang['lpn_status_inp_exported']='{file} निर्यात किया गया।';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} चीज़ें जो .inp प्रारूप में नहीं समा सकतीं।';
$ec_lang['lpn_inp_export_refused']='यह प्रोजेक्ट EPANET फ़ाइल के रूप में नहीं लिखा जा सकता: {detail}';
$ec_lang['lpn_inp_bad_file']='वह फ़ाइल EPANET नेटवर्क फ़ाइल के रूप में नहीं पढ़ी जा सकी।';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='यह EPANET की .net फ़ाइल जैसी लगती है, पर यह पृष्ठ इसे पढ़ नहीं सका। इसे EPANET में खोलें और वहाँ File, Export, Network कमांड से .inp फ़ाइल के रूप में सहेजें, फिर उसे आयात करें।';
$ec_lang['lpn_inp_report_heading']='{file} आयात किया गया';
$ec_lang['lpn_inp_report_counts']='{nodes} जंक्शन, जलाशय और टैंक, {links} पाइप, पंप और वाल्व, {units} में।';
$ec_lang['lpn_inp_report_clean']='फ़ाइल का सब कुछ सफलतापूर्वक आ गया। कुछ भी छूटा नहीं।';
$ec_lang['lpn_inp_report_label_anchor']='टेक्स्ट लेबल वैसे ही रखे गए हैं जैसे EPANET उन्हें रखता है, उनके ऊपरी बाएँ कोने से।';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='EPANET फ़ाइलों में कोई निर्देशांक प्रणाली नहीं होती, इसलिए यह फ़ाइल शुरू में भू-संदर्भित नहीं होगी। इसे विश्व मानचित्र पर रखने के लिए, Map, World map… का उपयोग करें। इसके निर्देशांक बदलने के लिए, File, Convert as… का उपयोग करें।';
$ec_lang['lpn_inp_report_lead']='यह पृष्ठ वह सब कुछ उपयोग नहीं करता जो EPANET करता है, पर आपकी फ़ाइल में से कुछ भी फेंका नहीं जाता। नीचे वह है जो आपकी फ़ाइल में है और जिसे यह पृष्ठ बिना उपयोग किए रखता है, और जो फ़ाइल पढ़े जाने पर बदला गया:';
$ec_lang['lpn_inp_drop_headloss']='यह फ़ाइल Hazen-Williams सूत्र का उपयोग नहीं करती। यह पृष्ठ Hazen-Williams की गणना करता है, इसलिए पाइप की खुरदरापन संख्याएँ ठीक वैसी ही रखी गईं जैसी लिखी थीं, पर यहाँ के उत्तर EPANET के उत्तरों से मेल नहीं खाएँगे।';
$ec_lang['lpn_inp_drop_tank_curve']='ये टैंक सीधी दीवारों वाले नहीं हैं: फ़ाइल उनका आकार एक कर्व के रूप में देती है। कर्व Libraries बॉक्स में रखा जाता है, टैंक अब भी उसे संदर्भित करता है, और विस्तारित अवधि सिमुलेशन उस कर्व के अनुसार टैंक को भरता और खाली करता है। एक ही क्षण के लिए दोनों तरह से उत्तर समान है, क्योंकि जल-सतह वही स्तर है जो फ़ाइल तय करती है। फ़ाइल में लिखा व्यास कर्व के साथ रखा जाता है, और यही वह मान है जिससे बिना कर्व वाला टैंक बनाया और हल किया जाता है।';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='ये थ्रॉटल वाल्व थ्रॉटल वाल्व के रूप में ही आए, फ़ाइल में दी गई वही हानि रखते हुए। कोई भी सॉल्वर इन्हें हल कर सकता है।';
$ec_lang['lpn_inp_drop_valve_active']='ये वाल्व दाब या प्रवाह नियंत्रित करते हैं, और पानी बदलने पर स्वयं खुलते-बंद होते हैं। आने के दौरान इनके बारे में कुछ भी नहीं छूटा, और यह पृष्ठ इन्हें EPANET सॉल्वर से हल करता है, इस नेटवर्क के लिए वह सॉल्वर स्वयं चालू कर देता है।';
$ec_lang['lpn_inp_drop_valve']='ये वाल्व किसी वक्र (कर्व) या स्थिर दाब-हानि द्वारा वर्णित हैं, और इस पृष्ठ में ऐसा कोई तत्व नहीं है। ये खुले पाइपों के रूप में आए, इसलिए नेटवर्क अभी भी जुड़ा हुआ है, पर अब वहाँ दाब या प्रवाह को नियंत्रित करने वाला कुछ नहीं है।';
$ec_lang['lpn_inp_drop_cv']='EPANET में ये पाइप पानी को केवल एक दिशा में जाने देते हैं। ये सामान्य पाइपों के रूप में आए, इसलिए अब पानी इनमें किसी भी दिशा में बह सकता है।';
$ec_lang['lpn_inp_drop_demands']='इन जंक्शनों में एक से अधिक माँग थीं। माँगों को जोड़कर इस पृष्ठ की एक ही माँग बना दिया गया।';
$ec_lang['lpn_inp_drop_patterns']='इस पृष्ठ ने माँग पैटर्न नहीं पढ़े, क्योंकि इसका वह भाग जो विस्तारित अवधि सिमुलेशन चलाता है, लोड नहीं हुआ। हर माँग फ़ाइल में लिखी संख्या ही है।';
$ec_lang['lpn_inp_drop_demand_pattern']='ये जंक्शन रन के दौरान अपनी माँग बदलते हैं। इनके पैटर्न पूरी तरह आए, और आपको दिख रही माँग उसी क्षण की है जो घड़ी में दिखाया जा रहा है।';
$ec_lang['lpn_inp_drop_emitters']='इन जंक्शनों में स्प्रिंकलर या रिसाव गुणांक है। इसे रखा गया है और हल किया जा रहा है, पर इसे देखने या बदलने के लिए इस पृष्ठ पर अभी कोई जगह नहीं है।';
$ec_lang['lpn_inp_drop_curve_long']='इस पंप वक्र में तीन से अधिक बिंदु थे। इसके सबसे निचले, मध्य और सबसे ऊँचे बिंदु रखे गए, क्योंकि यह पृष्ठ अधिकतम तीन बिंदुओं पर वक्र फ़िट करता है।';
$ec_lang['lpn_inp_drop_curve_missing']='यह पंप एक ऐसे कर्व को संदर्भित करता है जो फ़ाइल में नहीं है। पंप बिना किसी कर्व के आया, इसलिए यह कोई हेड नहीं जोड़ता।';
$ec_lang['lpn_inp_drop_pump_other']='इस पंप का विवरण किसी वक्र से नहीं, बल्कि उसकी खींची गई शक्ति से दिया गया है। यह बिना किसी वक्र के आया, इसलिए यह कोई हेड नहीं जोड़ता।';
$ec_lang['lpn_inp_drop_head_pattern']='ये जलाशय रन के दौरान ऊपर-नीचे होते हैं। इनके पैटर्न पूरी तरह आए, और जो जल-स्तर आप देख रहे हैं वह उसी क्षण का है जो घड़ी में दिख रहा है।';
$ec_lang['lpn_inp_drop_pump_speed']='ये पंप उस गति से अलग गति पर चलते हैं जिस पर उनका कर्व मापा गया था, या रन के दौरान गति बदलते हैं। गति और उसका पैटर्न पूरी तरह आए, और जो हेड आप देख रहे हैं वह उसी क्षण का है जो घड़ी में दिख रहा है।';
$ec_lang['lpn_inp_drop_setting']='ये पाइप, पंप और वाल्व एक ऐसी सेटिंग रखते हैं जिसे यह पृष्ठ नहीं रख सकता। ये खुली अवस्था में आए।';
$ec_lang['lpn_inp_drop_rules']='इस फ़ाइल में नियम-आधारित नियंत्रण हैं। यह पृष्ठ उन्हें पढ़ता और उपयोग करता है। EPANET इंजन से मॉडल रन करें तो नियम लागू होते हैं, और उनमें दिया हर स्तर, दाब और प्रवाह इस प्रोजेक्ट की दिखाई जा रही इकाइयों में बदल दिया जाता है। किसी नियम को पढ़ने या बदलने के लिए Libraries के अंतर्गत Rules खोलें। इन्हें ठीक वैसे ही रखा जाता है जैसे फ़ाइल में बताया गया है, और यदि आप EPANET फ़ाइल सहेजते हैं तो वापस लिखे जाते हैं।';
$ec_lang['lpn_inp_drop_eps']='यह फ़ाइल एक विस्तारित अवधि सिमुलेशन का वर्णन करती है। इस पृष्ठ का वह भाग जो विस्तारित अवधि सिमुलेशन चलाता है, लोड नहीं हुआ, इसलिए केवल आरंभिक स्थितियाँ ही आईं।';
$ec_lang['lpn_inp_drop_quality']='यह फ़ाइल बताती है कि पानी के यात्रा के दौरान उसकी गुणवत्ता कैसे बदलती है: शुरुआत में पानी में क्या है, और वह पदार्थ पाइपों और टैंकों में कितनी तेज़ी से प्रतिक्रिया करता है। यह पृष्ठ इन संख्याओं को पढ़ता और उपयोग करता है। Settings, Calculation, Water quality के अंतर्गत एक रसायन चुनें, फिर EPANET इंजन से मॉडल रन करें, और रन के आगे बढ़ने पर नेटवर्क में सांद्रता निकाली जाती है। ये पंक्तियाँ रखी जाती हैं, और यदि आप EPANET फ़ाइल सहेजते हैं तो वापस लिखी जाती हैं।';
$ec_lang['lpn_inp_drop_sources_mixing']='यह फ़ाइल बताती है कि नेटवर्क में रसायन कहाँ डाला जाता है, और टैंक में पानी कैसे मिलता है। जिस नोड पर डोज़ जोड़ी जाती है, वह वहीं दिखती है, और टैंक बताता है कि वह किस मिश्रण मॉडल का पालन करता है। डोज़ और मिश्रण मॉडल दोनों की गणना केवल EPANET इंजन करता है।';
$ec_lang['lpn_inp_drop_energy']='इस EPANET फ़ाइल में पंपिंग लागत मॉडलिंग डेटा शामिल है। यह पृष्ठ इसे पढ़ता और उपयोग करता है। EPANET इंजन से मॉडल रन करें, फिर यह देखने के लिए कि हर पंप कितनी देर चला, उसने कितनी शक्ति खींची, कितनी ऊर्जा उपयोग की और उसकी लागत क्या रही, Water, Reports, Pump energy खोलें। ये पंक्तियाँ रखी जाती हैं, और यदि आप EPANET फ़ाइल सहेजते हैं तो वापस लिखी जाती हैं।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='यह फ़ाइल अपने कुछ जंक्शन, पाइप या अन्य तत्वों को टैग देती है। हर टैग पूरी तरह आया, और हर एक अपने ही तत्व के गुणों में रखा है, जहाँ आप उसे पढ़ या बदल सकते हैं।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='इस फ़ाइल में EPANET की अपनी वे सेटिंग्स हैं जो बताती हैं कि वह अपनी रिपोर्ट को कैसे प्रारूपित करता है। आप यहाँ, Reports, EPANET run के अंतर्गत, इंजन की रिपोर्ट पढ़ सकते हैं, पर यह इन सेटिंग्स के माँगे प्रारूप के बजाय इंजन के मानक प्रारूप में आती है। ये पंक्तियाँ रखी जाती हैं, और यदि आप EPANET फ़ाइल सहेजते हैं तो वापस लिखी जाती हैं।';
$ec_lang['lpn_inp_drop_sections']='इस फ़ाइल में एक ऐसा सेक्शन है जिसे यह पृष्ठ बिल्कुल भी नहीं पढ़ता। यहाँ उसका कोई उपयोग नहीं होता। इसे पूरा का पूरा रखा जाता है, और यदि आप EPANET फ़ाइल सहेजते हैं तो यह वापस लिखा जाता है।';
$ec_lang['lpn_inp_drop_quality_options']='यह फ़ाइल EPANET जल गुणवत्ता विकल्प बताती है: Quality विकल्प, जो जल गुणवत्ता विश्लेषण के प्रकार का नाम लेता है, और एक रसायन से जुड़ी दो सेटिंग्स, Relative diffusivity और Quality tolerance। तीनों रखी जाती हैं और तीनों का उपयोग होता है। जल आयु, स्रोत अनुरेखण और एक रसायन — हर एक यहाँ निकाला जाता है, और जब आप कोई रसायन रन करते हैं तो वे दो रसायन सेटिंग्स EPANET इंजन को सौंपी जाती हैं। यदि आप EPANET फ़ाइल सहेजते हैं तो ये सभी वापस लिखी जाती हैं।';
$ec_lang['lpn_inp_drop_file_options']='यह फ़ाइल एक सहायक फ़ाइल का हवाला देती है: मैप, जिसमें निर्देशांक होते हैं, या हाइड्रॉलिक्स, जिसमें पहले से निकाली गई हाइड्रॉलिक्स होती है। यह पृष्ठ इनमें से कोई भी नहीं खोल सकता, इसलिए ये पंक्तियाँ जैसी हैं वैसी ही रखी जाती हैं और यदि आप EPANET फ़ाइल सहेजते हैं तो वापस लिखी जाती हैं।';
$ec_lang['lpn_inp_drop_demand_model']='यह फ़ाइल दाब-चालित विश्लेषण (PDA) माँगती है, जिसमें दाब कम होने पर किसी जंक्शन को उसकी माँग से कम पानी मिलता है। यह पृष्ठ माँग-चालित तरीके से हल करता है, इसलिए यहाँ हर जंक्शन को फ़ाइल में बताई गई पूरी माँग मिलती है, चाहे नतीजे में दाब कुछ भी हो। इस पंक्ति को रखा जाता है और यदि आप EPANET फ़ाइल सहेजते हैं तो यह वापस लिखी जाती है।';
$ec_lang['lpn_inp_drop_other_options']='यह फ़ाइल ऐसे विकल्प बताती है जिन्हें यह पृष्ठ नहीं पढ़ता। यहाँ उनका कोई उपयोग नहीं होता। उन्हें रखा जाता है और यदि आप EPANET फ़ाइल सहेजते हैं तो वे वापस लिखे जाते हैं।';
$ec_lang['lpn_inp_drop_net_options']='यह EPANET .net फ़ाइल ऐसी सेटिंग्स बताती है जिनके लिए इस पृष्ठ पर कोई नियंत्रण नहीं है, इसलिए उनके मान यहाँ सूचीबद्ध किए गए हैं, स्थानांतरित नहीं किए गए। बाकी सब कुछ आ गया। यदि आपको इनकी ज़रूरत है, तो फ़ाइल को EPANET में खोलें और उसे .inp फ़ाइल के रूप में सहेजने के लिए File, Export, Network उपयोग करें, फिर उसे आयात करें।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='यह एक EPANET .net फ़ाइल थी। यह EPANET की अपनी प्रोजेक्ट फ़ाइल है, इसका कोई प्रकाशित विवरण नहीं है, और यह पृष्ठ उदाहरण फ़ाइलों से प्रारूप समझकर इसे पढ़ता है, इसलिए इसे केवल तब उपयोग करें जब आपके पास और कुछ न हो, भरोसेमंद रास्ते के रूप में नहीं। .inp फ़ाइल वह दस्तावेज़ीकृत प्रारूप है जिसे बाकी हर प्रोग्राम पढ़ता है: EPANET में एक बनाने के लिए File, Export, Network उपयोग करें, और जब भी संभव हो उसे ही आयात करें।';
$ec_lang['lpn_inp_drop_backdrop']='यह फ़ाइल एक पृष्ठभूमि चित्र का नाम लेती है पर उसमें चित्र ही नहीं है। इसे स्वयं File, Background image, Add image से जोड़ें।';
$ec_lang['lpn_inp_drop_dangling']='ये पाइप एक ऐसे जंक्शन का नाम लेते हैं जो फ़ाइल में नहीं है, इसलिए ये छोड़ दिए गए।';
$ec_lang['lpn_inp_drop_units']='इस फ़ाइल में बताई गई प्रवाह इकाई इस पृष्ठ को ज्ञात नहीं है, इसलिए हर संख्या को गैलन प्रति मिनट मानकर पढ़ा गया। उत्तरों का उपयोग करने से पहले हर संख्या जाँच लें।';
$ec_lang['lpn_inp_drop_anchor_missing']='यह टेक्स्ट किसी जंक्शन, जलाशय या टंकी से जुड़ा था जो फ़ाइल में नहीं है। यह फ़ाइल द्वारा रखी गई जगह पर मुक्त टेक्स्ट के रूप में आया, और अब यह किसी से जुड़ा नहीं है।';
$ec_lang['lpn_import_notes_heading']='यह प्रोजेक्ट एक EPANET फ़ाइल से पढ़ा गया था। उस फ़ाइल में जो कुछ है उसमें से कुछ रखा गया है पर इस पृष्ठ पर उपयोग नहीं होता।';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='{name} फ़ाइल से खोला गया, और इसे इस ब्राउज़र में नए प्रोजेक्ट के रूप में जोड़ा गया।';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='प्रोजेक्ट फ़ाइल';
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
$ec_lang['lpn_file_upload_explain']='यह ब्राउज़र किसी फ़ाइल से नहीं जुड़ सकता, इसलिए यहाँ फ़ाइल खोलना असल में अपलोड है: प्रोजेक्ट इस ब्राउज़र में कॉपी हो जाता है, और अपना काम फ़ाइल में वापस सहेजने का एकमात्र तरीका File, Save as से उस फ़ाइल पर फिर से लिखना है।';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='इस पृष्ठ से सहेजी गई प्रोजेक्ट फ़ाइल खोलें।';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='जुड़ी हुई फ़ाइल में सहेजता है।';
$ec_lang['lpn_file_saveas_tip']='सहेजने के लिए एक फ़ाइल चुनें। यह प्रोजेक्ट उस फ़ाइल से जुड़ जाता है, और उसके बाद Save उसी में लिखता है।';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='आपके ब्राउज़र की Download सेटिंग्स का उपयोग करके सहेजता है। यह ब्राउज़र किसी फ़ाइल से नहीं जुड़ सकता, इसलिए Save अक्षम है और केवल Save as उपलब्ध है। यदि आप अपने ब्राउज़र की सेटिंग "हर फ़ाइल के लिए पूछें कि कहाँ सहेजें" चालू करें, तो आप मूल फ़ाइल चुनकर उस पर फिर से लिख सकते हैं।';
$ec_lang['lpn_status_uploaded']='प्रोजेक्ट फ़ाइल अपलोड हुई। इससे कोई जुड़ाव बनाए नहीं रखा जा सकता, इसलिए इसमें वापस सहेजने का एकमात्र तरीका File, Save as का उपयोग करना है।';
$ec_lang['lpn_status_downloaded']='{file} डाउनलोड हुई। यह ब्राउज़र किसी फ़ाइल से नहीं जुड़ सकता, इसलिए यह प्रोजेक्ट "फ़ाइल में सहेजा नहीं गया" चिह्नित रहता है।';
$ec_lang['lpn_status_file_opened']='{file} खोली गई।';
$ec_lang['lpn_status_already_open']='वह फ़ाइल यहाँ पहले से ही {name} के रूप में खुली है, इसलिए दूसरी प्रतिलिपि खोलने के बजाय उसी पर स्विच कर दिया गया।';
$ec_lang['lpn_status_already_open_dirty']='वह फ़ाइल यहाँ पहले से ही {name} के रूप में खुली है, जिसमें ऐसे बदलाव हैं जो आपने अभी तक सहेजे नहीं हैं। दूसरी प्रतिलिपि खोलने के बजाय उसी पर स्विच कर दिया गया। यदि आप डिस्क वाला संस्करण चाहते हैं तो File, Revert का उपयोग करें।';
$ec_lang['lpn_status_saved']='{file} सहेजी गई।';
$ec_lang['lpn_status_reverted']='{file} डिस्क से फिर लोड की गई।';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='बंद करने से पहले क्या {name} में अपने बदलाव सहेज दिए जाएँ?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} केवल इस ब्राउज़र में रखा गया है। यदि आप इसे फ़ाइल में सहेजे बिना बंद करते हैं, तो यह हमेशा के लिए खो जाएगा।';
$ec_lang['lpn_close_discard']='बिना सहेजे बंद करें';
$ec_lang['lpn_cancel']='रद्द करें';
$ec_lang['lpn_revert_confirm']='क्या आपके किए गए बदलावों को त्यागकर {file} को डिस्क से फिर लोड किया जाए?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='यह प्रोजेक्ट {file} से आया था, पर उस फ़ाइल से जुड़ाव खो गया है। जुड़ने के लिए फ़ाइल फिर से चुनें।';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='फ़ाइल में लिखा नहीं जा सका। हो सकता है इसे स्थानांतरित या नाम-परिवर्तित किया गया हो, या अनुमति वापस ले ली गई हो। आपका काम अभी भी इस ब्राउज़र में सहेजा हुआ है।';
$ec_lang['lpn_file_changed_elsewhere']='आपके इसे खोलने के बाद किसी और ने इस फ़ाइल में सहेजा है, इसलिए अभी सहेजने से उनका काम मिट जाएगा। अपने बदलावों को अपनी फ़ाइल में रखने के लिए File, Save as का उपयोग करें, या अपने बदलाव त्यागकर उनका काम लोड करने के लिए File, Revert का उपयोग करें।';
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
$ec_lang['lpn_lock_somebody']='कोई और';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} ने यह फ़ाइल खोल रखी है।';
$ec_lang['lpn_lock_open_readonly']='केवल-पठन में खोलें';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='लॉक तोड़ें';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='यह फ़ाइल उपयोग में प्रतीत होती है।';
$ec_lang['lpn_lock_open_care']='डेटा हानि से बचने के लिए, नीचे दिए गए विकल्पों में से सावधानी से चुनें।';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='यह {x} से उपयोग में है।';
$ec_lang['lpn_lock_age_edited']='इसे अंतिम बार {x} पहले संपादित किया गया था।';
$ec_lang['lpn_lock_age_saved']='इसे अंतिम बार {x} पहले सहेजा गया था।';
$ec_lang['lpn_lock_age_never_saved']='इस फ़ाइल में अभी तक कुछ भी सहेजा नहीं गया है।';
$ec_lang['lpn_lock_age_unknown']='इसका कोई रिकॉर्ड नहीं है कि यह कितने समय से उपयोग में है, या इसे अंतिम बार कब सहेजा या संपादित किया गया था।';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"पूछें" जिसके पास भी यह फ़ाइल खुली है उसे बताता है कि आप इसे चाहते हैं, और इसके अलावा कुछ नहीं बदलता। "केवल-पठन में खोलें" आपको इसे देखने और अपनी इच्छानुसार कुछ भी बदलने देता है, बिना यहाँ सहेजने में सक्षम हुए। "उनका लॉक तोड़ें" आपको फ़ाइल के ऊपर सहेजने देता है; उनका बिना सहेजा काम नष्ट नहीं होता, लेकिन वे अब इसे यहाँ सहेज नहीं पाएँगे, और किसी को दोनों को हाथ से मिलाना पड़ सकता है।';
$ec_lang['lpn_lock_ask']='पूछें';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='हम किसे पूछने वाला बताएँ? आपके आद्याक्षर आदर्श हैं। ये जिसके पास भी यह फ़ाइल खुली है उसके लिए हमारे सर्वर पर इस फ़ाइल के लॉक के साथ रखे जाते हैं, और 30 दिनों के भीतर मिटा दिए जाते हैं।';
$ec_lang['lpn_lock_ask_sent']='हमने जिसके पास भी यह फ़ाइल खुली है उससे इसे बंद करने के लिए कहा है। यदि उनका पृष्ठ अभी भी खुला है, तो वे इसे एक मिनट के भीतर देख लेंगे। बाकी कुछ नहीं बदला है, और जब तक वे इसे बंद नहीं करते, फ़ाइल अभी भी उन्हीं की है।';
$ec_lang['lpn_lock_ask_failed']='आपका संदेश भेजा नहीं जा सका। या तो अभी किसी के पास यह फ़ाइल खुली नहीं है, या सर्वर तक नहीं पहुँचा जा सका।';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='वह फ़ाइल नहीं खोली गई, और यहाँ कुछ नहीं बदला। किसी और के पास अभी भी यह खुली है।';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} इस फ़ाइल को संपादित करना चाहता है। जब आप तैयार हों, अपना काम सहेजें और इसे सौंपने के लिए File, Close project का उपयोग करें।';
$ec_lang['lpn_ago_seconds']='{n} सेकंड';
$ec_lang['lpn_ago_minutes']='{n} मिनट';
$ec_lang['lpn_ago_hours']='{n} घंटे';
$ec_lang['lpn_ago_days']='{n} दिन';
$ec_lang['lpn_ago_unknown']='अज्ञात समय';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='संदेश';
$ec_lang['lpn_msglog_heading']='हाल के संदेश';
$ec_lang['lpn_msglog_empty']='अभी तक कोई संदेश नहीं।';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} पहले';
$ec_lang['lpn_msglog_note']='सबसे नए पहले। यह पृष्ठ खुले रहने के दौरान अंतिम {n} संदेश रखता है, और आपके कंप्यूटर पर कुछ भी संग्रहीत नहीं होता।';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='केवल-पठन: {name} ने यह फ़ाइल खोल रखी है। आप यहाँ जो चाहें बदल सकते हैं, पर सहेज नहीं सकते। किसी अलग फ़ाइल में सहेजने के लिए File, Save as का उपयोग करें।';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='सावधान: इस प्रोजेक्ट पर लॉक जाँचने या बनाने के लिए सर्वर तक नहीं पहुँचा जा सका, इसलिए कुछ भी किसी सहकर्मी को उसी फ़ाइल पर एक साथ काम करने से नहीं रोक रहा। लॉकिंग फिर से काम करने लगने पर आपको बताया जाएगा।';
$ec_lang['lpn_lock_storage_error']='सावधान: यह साइट लॉक रिकॉर्ड सहेज नहीं सकती, इसलिए कुछ भी किसी सहकर्मी को उसी फ़ाइल पर एक साथ काम करने से नहीं रोक रहा। यह सर्वर की एक सेटअप त्रुटि है, ऐसी चीज़ नहीं जिसे आप यहाँ ठीक कर सकें — लॉक फ़ोल्डर वेब सर्वर द्वारा लिखने योग्य नहीं है।';
$ec_lang['lpn_lock_full_error']='सावधान: इस साइट के पास यह रिकॉर्ड करने की जगह ख़त्म हो गई है कि किसके पास कौन सा प्रोजेक्ट खुला है, इसलिए कुछ भी किसी सहकर्मी को उसी फ़ाइल पर एक साथ काम करने से नहीं रोक रहा। यह सर्वर की एक सेटअप त्रुटि है, ऐसी चीज़ नहीं जिसे आप यहाँ ठीक कर सकें।';
$ec_lang['lpn_lock_not_asked']='इस प्रोजेक्ट के लिए लॉकिंग नहीं चल रही, इसलिए कुछ भी किसी सहकर्मी को उसी फ़ाइल पर एक साथ काम करने से नहीं रोक रहा। इस प्रोजेक्ट की अभी तक कोई पहचान नहीं है, और इसे फ़ाइल में सहेजने से यह उसे मिल जाती है।';
$ec_lang['lpn_lock_restored']='लॉकिंग फिर से काम कर रही है, और अब यह फ़ाइल आपके सहेजने के लिए है।';
$ec_lang['lpn_lock_dismiss']='यह संदेश छिपाएँ';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='आपका प्रोजेक्ट इस कंप्यूटर पर एक फ़ाइल में सहेजा जाएगा। यह तभी सहेजा जाता है जब आप कहें, किसी और समय नहीं, इसलिए उस फ़ाइल में आपकी जानकारी के बिना कुछ नहीं लिखा जाता।';
$ec_lang['lpn_file_training_2']='ताकि दो लोग कभी एक ही फ़ाइल पर एक साथ बदलाव न करें, यह साइट रखती है कि उसे किसने खोल रखा है। यदि किसी और ने पहले से खोली है, तो भी आप उसे खोलकर देख सकते हैं, या उसकी अपनी प्रतिलिपि रख सकते हैं।';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='पहली बार सहेजते समय, आपका ब्राउज़र पूछेगा कि क्या यह साइट फ़ाइल में बदलाव कर सकती है। यह सवाल ब्राउज़र से आता है, हमसे नहीं, और हाँ कहना ही Save को आपका काम वापस लिखने देता है। यह आमतौर पर हर फ़ाइल के लिए केवल एक बार पूछा जाता है।';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='जारी रखें';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='फ़ाइल फिर से चुनें';
$ec_lang['lpn_file_reconnect']='इस फ़ाइल से फिर जुड़ें';
$ec_lang['lpn_file_reconnect_alert']='यह प्रोजेक्ट {file} से आया था। इसमें लिखने से पहले आपके ब्राउज़र को आपकी अनुमति फिर से चाहिए। नीचे फिर से जुड़ें।';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='यह वही फ़ाइल है जिसे किसी और ने खोल रखा है, इसलिए इस पर सहेजा नहीं जा सकता। कोई अलग फ़ाइल या अलग नाम चुनें।';
$ec_lang['lpn_saveas_overwrites_project']='उस फ़ाइल में पहले से एक अलग प्रोजेक्ट, {name}, है। यहाँ सहेजने से वह पूरी तरह बदल जाएगा। जारी रखें?';
$ec_lang['lpn_saveas_overwrites_newer']='आपके इसे आख़िरी बार देखने के बाद उस फ़ाइल में बदलाव हुआ है, इसलिए लगभग निश्चित रूप से किसी और ने इसमें सहेजा है। यहाँ सहेजने से उनका संस्करण आपके संस्करण से बदल जाएगा। जारी रखें?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='इस प्रोजेक्ट के लिए नाम';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='{closed} बंद की गई। अब {opened} दिखाई जा रही है।';
$ec_lang['lpn_status_closed_empty']='{closed} बंद की गई। एक नया खाली प्रोजेक्ट शुरू किया गया।';
$ec_lang['lpn_storage_full']='सहेजा नहीं गया। ब्राउज़र संग्रहण भरा हुआ है या उपलब्ध नहीं है, इसलिए यह टैब बंद करने पर आपके हाल के बदलाव खो जाएँगे।';
$ec_lang['lpn_storage_unreadable']='सहेजा नहीं गया। इस प्रोजेक्ट को ब्राउज़र संग्रहण से पढ़ा नहीं जा सका। इसकी सहेजी गई प्रति बिल्कुल वैसी ही छोड़ दी गई है और उसके ऊपर कुछ नहीं लिखा जाएगा, इसलिए इस टैब पर कुछ भी सहेजा नहीं जा रहा। काम जारी रखने के लिए कोई फ़ाइल खोलें या नया प्रोजेक्ट बनाएँ।';
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
$ec_lang['lpn_about_credits']='श्रेय';
$ec_lang['lpn_help_welcome']='स्वागत पृष्ठ';
$ec_lang['lpn_about_license']='GNU General Public License v3.0 या बाद के संस्करण के अंतर्गत लाइसेंस प्राप्त।';
$ec_lang['lpn_notes_1_term']='इसे कैसे हल किया जाता है';
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
$ec_lang['lpn_notes_1_def']='EPANET सॉल्वर इस नेटवर्क को हल करता है। कुल रन समय सेट करें और हर रिपोर्टिंग चरण को बारी-बारी से परिकलित किया जाता है: टैंक भरते और खाली होते हैं, माँगें अपने पैटर्न का पालन करती हैं, और टूलबार रन को वापस चलाकर दिखाता है।';
$ec_lang['lpn_notes_2_term']='यह क्या नहीं करता';
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
$ec_lang['lpn_notes_2_def']='जल गुणवत्ता मॉडल की जाती है: जल आयु, स्रोत अनुरेखण, और एक रसायन जो पाइप की दीवारों में और जल के भीतर अभिक्रिया करता है। सर्ज और वॉटर हैमर मॉडल नहीं किए जाते: यहाँ हर उत्तर पहले से ही स्थिर गति से बहते जल के लिए है, न कि वाल्व के अचानक बंद होने पर बनने वाली दाब-तरंग के लिए।';
$ec_lang['lpn_notes_3_term']='प्रोजेक्ट सहेजना';
$ec_lang['lpn_notes_3_def']='हर प्रोजेक्ट एक टैब है, और हर टैब काम करते समय इस ब्राउज़र में सहेजा जाता है। अपने ब्राउज़र का डेटा साफ़ करने से ये सभी मिट जाते हैं, इसलिए अपना काम फ़ाइल में रखें: File, Save as। किसी टैब पर तारा (asterisk) का मतलब है कि इसमें ऐसे बदलाव हैं जो किसी फ़ाइल में नहीं हैं। जब तक आप न कहें, फ़ाइल में कभी कुछ नहीं लिखा जाता। कुछ ब्राउज़रों में एक प्रोजेक्ट उस फ़ाइल से जुड़ जाता है जिसमें आप उसे सहेजते हैं, और उसके बाद File, Save उसी फ़ाइल में वापस लिखता है; दूसरों में कोई जुड़ाव संभव नहीं है, इसलिए Save अक्षम रहता है और केवल Save as उपलब्ध होता है। जब प्रोजेक्ट फ़ाइल किसी साझा ड्राइव पर रखी हो, तो यह पृष्ठ बताता है कि क्या किसी सहकर्मी ने इसे पहले से खोल रखा है, ताकि दो लोग एक-दूसरे के काम पर न लिखें।';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='पंप वक्र';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='एक पंप H = H₀ − aQ^b के अनुसार चलता है, जहाँ H वह हेड है जो पंप जोड़ता है और Q उसमें से गुज़रता प्रवाह है। निर्माता के वक्र से एक, दो, या तीन बिंदु दर्ज करें। तीन बिंदु — शून्य प्रवाह पर हेड, सामान्य कार्य-बिंदु, और सबसे अधिक प्रवाह का बिंदु — सीधे H₀, a और b फ़िट करते हैं, और प्रकाशित वक्र से सबसे निकट मेल खाते हैं। दो बिंदु शून्य प्रवाह पर शिखर वाला परवलय (b = 2) फ़िट करते हैं। एक बिंदु एक सामान्य नियम उपयोग करता है: शून्य प्रवाह पर हेड आपके दर्ज किए हेड का 1.33 गुना है, और सबसे अधिक प्रवाह आपके दर्ज किए प्रवाह का 2 गुना है, जो फिर से b = 2 देता है। बिना कोई बिंदु दर्ज किए पंप कोई हेड नहीं जोड़ता। वक्र वहाँ नहीं काटा जाता जहाँ हेड शून्य पर पहुँचे, इसलिए पंप से उसके वक्र की क्षमता से अधिक प्रवाह माँगने पर ऋणात्मक हेड मिलता है। समाधान बड़ा पंप या छोटी माँग है, अलग वक्र फ़िट नहीं। एक वक्र तीन से अधिक बिंदु रख सकता है, और आपके दिए हर बिंदु को पढ़ा जाता है।';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='इस पृष्ठ पर यह भी है';
$ec_lang['lpn_notes_4_def']='एक प्रोजेक्ट असली ज़मीन पर बैठ सकता है, जिसके पीछे एक सड़क मानचित्र हो। EPANET .inp फ़ाइलें पढ़ी और लिखी जा सकती हैं। नीचे का पैनल किसी मार्ग के साथ एक प्रोफ़ाइल बनाता है और जंक्शनों की सूची देता है। तत्वों को उनके परिणामों के अनुसार रंगा जा सकता है, और खोजें और बदलें आपकी तय की गई किसी भी शर्त से मेल खाने वाला हर तत्व चुन लेता है।';
$ec_lang['lpn_notes_6_term']='तालिका कॉलम सहायता';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>कॉलम चुनें</td><td>शीर्षक पर क्लिक करें</td></tr><tr><td>कॉलम चयन जोड़ें या बढ़ाएँ</td><td>किसी अन्य शीर्षक पर Ctrl+click या Shift+click करें</td></tr><tr><td>चयनित कॉलम को स्थानांतरित करें (क्रम बदलें)</td><td>खींचें या राइट-क्लिक या ⋮ मेनू में Manage columns… का उपयोग करें</td></tr><tr><td>मेनू ⋮ और क्रमबद्ध तीर।</td><td>शीर्षक के ऊपरी कोने पर होवर करें, या किसी शीर्षक को चुनें या उसमें Tab करें</td></tr><tr><td>छिपाएँ, सभी दिखाएँ, या दृश्यता और क्रम प्रबंधित करें</td><td>शीर्षक पर राइट-क्लिक करें या शीर्षक के ऊपरी दाएँ कोने में ⋮ मेनू</td></tr><tr><td>कॉलम के अनुसार क्रमबद्ध करें</td><td>शीर्षक के ऊपरी दाएँ कोने में तीर आइकन</td></tr><tr><td>तालिका के अंत में नई पंक्तियों के रूप में पेस्ट करें</td><td>राइट-क्लिक करें, शीर्षक के ऊपरी दाएँ कोने में ⋮ मेनू, या Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='तालिका कीबोर्ड शॉर्टकट';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Arrow keys</td><td>नेविगेट करें।</td></tr><tr><td>Tab, Enter</td><td>प्रविष्टि पूर्ण करें और एक सेल आगे/नीचे नेविगेट करें।</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>पीछे की ओर नेविगेट करें।</td></tr><tr><td>Shift+arrow keys</td><td>चयन बढ़ाएँ।</td></tr><tr><td>Ctrl+C</td><td>चयन कॉपी करें।</td></tr><tr><td>Ctrl+D</td><td>चयन को उसकी शीर्ष पंक्ति से नीचे भरें।</td></tr><tr><td>Ctrl+Enter</td><td>चयन को सक्रिय सेल के मान से भरें।</td></tr><tr><td>Ctrl+A</td><td>पूरी तालिका चुनें।</td></tr><tr><td>Ctrl+Shift+V</td><td>तालिका के अंत में नई पंक्तियों के रूप में पेस्ट करें।</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>अगले या पिछले टैब पर जाएँ, चाहे वह तालिका हो या ग्राफ़।</td></tr><tr><td>Delete</td><td>एक सेल साफ़ करें।</td></tr><tr><td>F2</td><td>किसी सेल को संपादित करने के लिए खोलें।</td></tr><tr><td>Esc</td><td>एक संपादन रद्द करें।</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='रंग बैंड सीमाएँ वही रहती हैं';
$ec_lang['lpn_notes_color_def']='रंग बैंड सीमाएँ तब तय होती हैं जब आप कोई Data classification method चुनते हैं। ये हर समय-चरण पर फिर से तय नहीं होतीं, क्योंकि इससे रंगों का अर्थ हर चरण पर नया हो जाता, और आपके सिस्टम को देखने-समझने में यह मददगार नहीं है। EPANET भी इसी तरह काम करता है। नई सीमाएँ पाने के लिए, फिर से कोई विधि चुनें या अपनी खुद की सीमाएँ टाइप करें।';
$ec_lang['lpn_notes_epanet_term']='Hazen-Williams स्थिरांक EPANET से मेल खाते हैं';
$ec_lang['lpn_notes_epanet_def']='अगस्त 2026 में Hazen-Williams गुणांक और घातांक को EPANET से मेल खाने के लिए बदला गया। हेड हानि के परिणाम इस पृष्ठ के पहले के संस्करणों से 0.1 प्रतिशत तक भिन्न हैं, जो स्वयं C मान की अनिश्चितता से कहीं छोटा है।';
$ec_lang['lpn_notes_engine_term']='यह पृष्ठ कौन-सा EPANET चलाता है';
$ec_lang['lpn_notes_engine_def']='इस पृष्ठ पर EPANET सॉल्वर OWA-EPANET 2.3.5 है, जो 20 फ़रवरी 2025 को जारी हुआ। EPANET को Open Water Analytics द्वारा विकसित किया गया है, जो संयुक्त राज्य अमेरिका के पर्यावरण संरक्षण एजेंसी के साथ काम करने वाला एक समुदाय है, जिसने दिसंबर 2019 में संस्करण 2.2.0 जारी किया था। रन रिपोर्ट इसे 2.3.05 कहती है क्योंकि इंजन अंतिम संख्या को दो अंकों में लिखता है। यह इस पृष्ठ तक Luke Butler के epanet-js 0.9.0 के ज़रिए, MIT लाइसेंस के तहत पहुँचता है, और यह आपके ब्राउज़र के भीतर चलता है: आपका नेटवर्क हल करने के लिए कभी कहीं नहीं भेजा जाता।';
$ec_lang['lpn_id_invalid']='बिना स्पेस और बिना उद्धरण चिह्नों वाला ID दर्ज करें।';
$ec_lang['lpn_id_taken']='वह ID पहले से उपयोग में है।';
$ec_lang['lpn_diag_no_fixed_head']='एक जलाशय या टैंक जोड़ें। हल करने से पहले नेटवर्क को कम से कम एक ज्ञात जल-स्तर चाहिए।';
$ec_lang['lpn_diag_dangling_link']='एक पाइप या पंप ऐसे नोड से जुड़ा है जो अब मौजूद नहीं है:';
$ec_lang['lpn_diag_unreachable']='इन नोड्स से किसी जलाशय तक कोई रास्ता नहीं है:';
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
$ec_lang['lpn_engine_fetching']='EPANET सॉल्वर लाया जा रहा है। यह एक बार डाउनलोड होता है और फिर इस डिवाइस पर रखा जाता है, ताकि बाद में यह ऑफ़लाइन भी काम करे।';
$ec_lang['lpn_engine_ready']='EPANET सॉल्वर अब इस डिवाइस पर है, और ऑफ़लाइन काम करता है।';
$ec_lang['lpn_engine_fetching_valve']='EPANET सॉल्वर लाया जा रहा है, ताकि इस वाल्व को अभी और आगे ऑफ़लाइन भी हल किया जा सके।';
$ec_lang['lpn_engine_ready_valve']='EPANET सॉल्वर अब इस डिवाइस पर है। जो वाल्व स्वयं खुलते-बंद होते हैं, वे ऑफ़लाइन भी काम करेंगे।';
$ec_lang['lpn_engine_unavailable']='EPANET सॉल्वर नहीं मिल सका, जो उन वाल्वों को हल करता है जो स्वयं खुलते-बंद होते हैं। एक बार इंटरनेट से जुड़ें और यह तब से इस डिवाइस पर रखा रहेगा।';
$ec_lang['lpn_engine_needed_loading']='आपके बनाते समय EPANET सॉल्वर लोड हो रहा है। पूरी तरह लोड होने पर परिणाम उपलब्ध होंगे।';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='सॉल्वर लोडिंग प्रगति';
$ec_lang['lpn_engine_wait']='सॉल्वर लोड हो रहा है। परिणाम थोड़ी देर के लिए विलंबित हैं। काम जारी रखें।';
$ec_lang['lpn_engine_wait_pct']='सॉल्वर {percent}% लोड हुआ।';
$ec_lang['lpn_engine_wait_bytes']='सॉल्वर अब तक {kb} KB लोड हुआ। कुल उपलब्ध नहीं है, इसलिए पूर्णता का प्रतिशत अज्ञात है।';
$ec_lang['lpn_engine_needed_failed']='EPANET सॉल्वर अभी तक लोड नहीं हुआ है, लोड नहीं हो सकता, और यह नेटवर्क केवल इसी से हल किया जा सकता है। जब आप इंटरनेट से जुड़े होंगे, तब यह लोड होगा।';
$ec_lang['lpn_diag_valve_needs_epanet']='ये वाल्व स्वयं खुलते-बंद होते हैं, और केवल EPANET सॉल्वर ही इनकी गणना कर सकता है। EPANET सॉल्वर लोड नहीं हो सका, इसलिए ये परिणाम अनुपलब्ध हैं:';
$ec_lang['lpn_diag_valve_on_fixed_head']='ये वाल्व सीधे किसी जलाशय या टैंक से जुड़े हैं, जो वहाँ का जल स्तर पहले ही तय कर देता है, इसलिए वाल्व के नियंत्रित करने के लिए कुछ नहीं बचता। वाल्व और जलाशय या टैंक के बीच एक छोटा पाइप लगाएँ:';
$ec_lang['lpn_diag_not_converged']='कोई हल नहीं मिला। ऐसे मान जाँचें जो वास्तविक जीवन में असंभव हों, जैसे शून्य व्यास।';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='हल अभिसरित नहीं हुआ। ये संख्याएँ अंतिम पुनरावृत्ति की हैं, कोई उत्तर नहीं। इनका उपयोग न करें।';
$ec_lang['lpn_diag_not_converged_trials']='यह {iterations} पुनरावृत्तियों के बाद रुक गया।';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='यह {iterations} पुनरावृत्तियों के बाद {error} की सापेक्ष त्रुटि पर रुक गया, जो {accuracy} की सटीकता सेटिंग तक नहीं पहुँच सकी।';
$ec_lang['lpn_field_roughness']='खुरदरापन';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Hazen-Williams C। संख्या जितनी अधिक, पाइप उतना ही चिकना: नए प्लास्टिक के लिए लगभग 150, नए स्टील या लोहे के लिए 130, और पुराने पाइप के लिए 100।';
$ec_lang['lpn_field_length']='लंबाई';
$ec_lang['lpn_field_from']='से';
$ec_lang['lpn_field_to']='तक';
$ec_lang['lpn_field_length_tip']='पाइप की लंबाई। Auto चालू होने पर लंबाई आपके खींचे गए चित्र से मापी जाती है। चित्र से भिन्न लंबाई टाइप करने के लिए Auto बंद करें।';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='वाल्व प्रकार';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='वाल्व क्या करता है। थ्रॉटल वाल्व एक स्थिर हानि बनाए रखता है। अन्य तीन एक दाब या प्रवाह बनाए रखते हैं, और पानी बदलने पर पूरी तरह खुलते हैं, बंद होते हैं, या आंशिक रूप से बंद होते हैं। प्रकार बदलने पर नीचे दी गई सेटिंग में एक नया आरंभिक अंक आ जाता है, क्योंकि दाब प्रवाह नहीं है और इनमें से कोई भी हानि गुणांक नहीं है।';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='थ्रॉटल (TCV)';
$ec_lang['lpn_valve_type_prv']='दाब-न्यूनीकरण (PRV)';
$ec_lang['lpn_valve_type_psv']='दाब-अनुरक्षण (PSV)';
$ec_lang['lpn_valve_type_fcv']='प्रवाह नियंत्रण (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='दाब-विच्छेदक (PBV)';
$ec_lang['lpn_valve_type_gpv']='सामान्य प्रयोजन (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='दाब गिरावट';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='वह दाब जो वाल्व हटाता है। दाब-विच्छेदक वाल्व हमेशा ठीक इतना ही दाब हटाता है, चाहे जल किसी भी दिशा में बह रहा हो। यह वाल्व के आर-पार एक गिरावट है, बनाए रखने वाला दाब नहीं।';
$ec_lang['lpn_inp_drop_gpv_curve']='यह वाल्व एक ऐसे हेड हानि कर्व को संदर्भित करता है जो फ़ाइल में नहीं है। वाल्व बिना किसी कर्व के आया, इसलिए जब तक आप इसे एक नहीं देते, यह पूरी तरह खुला रहता है।';
$ec_lang['lpn_gpv_curve_source']='वाल्व हेड हानि कर्व';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Libraries बॉक्स में वह कर्व, जो बताता है कि यह वाल्व हर प्रवाह पर कितना हेड खोता है। कई वाल्व एक ही कर्व उपयोग कर सकते हैं, और वहाँ उसे संपादित करने से वे सभी बदल जाते हैं। यह वाल्व केवल संदर्भ रखता है; बिंदु स्वयं Libraries, Curves के अंतर्गत पढ़े और संपादित किए जाते हैं।';
$ec_lang['lpn_field_valve_setting_pressure']='दाब सेटिंग';
$ec_lang['lpn_field_valve_setting_pressure_tip']='वह दाब जो वाल्व बनाए रखता है। दाब-न्यूनीकरण वाल्व अपने अनुप्रवाह पक्ष पर दाब को इस मान पर या इससे कम बनाए रखता है। दाब-अनुरक्षण वाल्व अपने ऊर्ध्वप्रवाह पक्ष पर दाब को इस मान पर या इससे अधिक बनाए रखता है।';
$ec_lang['lpn_field_valve_setting_flow']='प्रवाह सेटिंग';
$ec_lang['lpn_field_valve_setting_flow_tip']='वाल्व से गुज़रने वाला अधिकतम जल। जब इससे कम जल गुज़रना चाहता है, तो वाल्व पूरी तरह खुला रहता है और कोई हानि नहीं जोड़ता।';
$ec_lang['lpn_field_valve_setting']='सेटिंग';
$ec_lang['lpn_field_valve_setting_loss']='हानि गुणांक';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='थ्रॉटल वाल्व कितना हेड हटाता है, वेग हेड के गुणक के रूप में गिना गया। पूरी तरह खुले वाल्व के लिए 0 उपयोग करें। यह एक अंक ही थ्रॉटल वाल्व की पूरी हानि है।';
$ec_lang['lpn_field_valve_diameter_tip']='वाल्व से होकर जाने वाले द्वार की चौड़ाई। इसी चौड़ाई से वाल्व में जल की गति की गणना की जाती है, और हानि उसी गति से निकलती है।';
$ec_lang['lpn_field_valve_km_tip']='वाल्व सेटिंग जो कुछ भी हटाती है, उसके अतिरिक्त वाल्व पूरी तरह खुले रहने पर वाल्व बॉडी से होने वाली हानि। यह वेग हेड के गुणक के रूप में गिनी जाती है। इसे अनदेखा करने के लिए 0 उपयोग करें।';
$ec_lang['lpn_field_km']='स्थानीय (लघु) हानि गुणांक, k';
$ec_lang['lpn_field_km_tip']='इस पाइप पर मोड़ों, वाल्वों और फ़िटिंग से होने वाली हानि, वेग हेड के गुणक के रूप में गिनी गई। सीधे साधारण पाइप के लिए 0 उपयोग करें।';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='स्थानीय हानि, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='पंप हेड कर्व';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Libraries बॉक्स में वह कर्व, जो बताता है कि यह पंप हर प्रवाह पर कितना हेड जोड़ता है। कई पंप एक ही कर्व उपयोग कर सकते हैं, और वहाँ उसे संपादित करने से वे सभी बदल जाते हैं। यह पंप केवल संदर्भ रखता है; बिंदु स्वयं Libraries, Curves के अंतर्गत पढ़े और संपादित किए जाते हैं।';
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
$ec_lang['lpn_field_desc']='विवरण';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='आपके अपने उपयोग के लिए, जैसे कोई गली का कोना या पाइप किस चीज़ का बना है। यह EPANET फ़ाइल में अंदर और बाहर ले जाया जाता है, जहाँ यह उस हिस्से की अपनी पंक्ति के अंत में बैठता है। कोई गणना इसे नहीं पढ़ती। एक लाइन ब्रेक एक स्पेस बन जाता है, क्योंकि फ़ाइल में उसे रखने की कोई जगह नहीं है।';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='टैग';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='टैग का कोई भी अर्थ हो सकता है जो आपको चाहिए, जैसे दाब क्षेत्र या कार्य आदेश। यहाँ या EPANET में कोई गणना इसे नहीं पढ़ती। टैग एक शब्द है: EPANET पहले स्पेस पर पढ़ना बंद कर देता है, इसलिए टाइप करते समय स्पेस अस्वीकार कर दिया जाता है। यह EPANET फ़ाइल में ले जाया और वापस लाया जाता है।';
$ec_lang['lpn_pump_effic_curve']='पंप दक्षता कर्व';
$ec_lang['lpn_pump_effic_curve_tip']='Libraries बॉक्स में वह कर्व, जो बताता है कि यह पंप हर प्रवाह पर कितना कुशल है। कई पंप एक ही कर्व उपयोग कर सकते हैं, और वहाँ उसे संपादित करने से वे सभी बदल जाते हैं। यह पंप केवल संदर्भ रखता है; बिंदु स्वयं Libraries, Curves के अंतर्गत पढ़े और संपादित किए जाते हैं।';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='कोई कर्व चयनित नहीं';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='कर्व';
$ec_lang['lpn_curve_library_link_tip']='Libraries बॉक्स को उसके Curves सेक्शन पर खोलता है, जहाँ कोई कर्व जोड़ा, वर्णित, संपादित और हटाया जाता है। एक तत्व बताता है कि वह कौन-सा कर्व उपयोग करता है।';
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
$ec_lang['lpn_curve_kind_head']='पंप हेड';
$ec_lang['lpn_curve_kind_effic']='पंप दक्षता';
$ec_lang['lpn_curve_kind_volume']='टैंक आयतन';
$ec_lang['lpn_curve_kind_headloss']='वाल्व हेड हानि';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='प्रकार नहीं बताया गया';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='आयतन';
$ec_lang['lpn_pump_effic_col']='दक्षता';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='इस पंप के लिए कोई दक्षता कर्व चयनित नहीं है, इसलिए यह पूरे नेटवर्क के लिए तय दक्षता, {percent}, पर चलता है।';
$ec_lang['lpn_pump_effic_unstated']='यह पंप {name} नाम के एक दक्षता कर्व को संदर्भित करता है, जिसे इस प्रोजेक्ट में कुछ भी परिभाषित नहीं करता, इसलिए यह पूरे नेटवर्क के लिए तय दक्षता, {percent}, पर चलता है।';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='मोड: चुनें। किसी तत्व या लेबल को देखने या बदलने के लिए क्लिक करें। किसी नोड, वर्टेक्स, या लेबल को ले जाने के लिए खींचें। पाइप में मोड़ जोड़ने या हटाने के लिए वर्टेक्स टूल उपयोग करें।';
$ec_lang['lpn_mode_delete']='मोड: हटाएँ। किसी तत्व को हटाने के लिए उस पर क्लिक करें।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='मोड: वर्टेक्स। हर पाइप के वर्टेक्स छोटे वर्गाकार हैंडल के रूप में दिखाए जाते हैं। वर्टेक्स जोड़ने के लिए पाइप पर क्लिक करें, हटाने के लिए हैंडल पर क्लिक करें, या हैंडल को खींचकर हिलाएँ। इस मोड में मानचित्र पर और कुछ नहीं बदलता।';
$ec_lang['lpn_mode_zoom_window']='मोड: ज़ूम विंडो। मानचित्र पर एक बॉक्स के दो विपरीत कोनों पर क्लिक करें, या एक खींचें, उसमें ज़ूम इन करने के लिए।';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='कुछ भी चुना नहीं गया है। पहले मानचित्र पर किसी तत्व पर क्लिक करें, फिर Delete दबाएँ।';
$ec_lang['lpn_mode_add_junction']='मोड: जंक्शन जोड़ें। जंक्शन रखने के लिए मानचित्र पर क्लिक करें। तत्वों और लेबल को बदलने या ले जाने के लिए चुनें मोड पर स्विच करें।';
$ec_lang['lpn_mode_add_reservoir']='मोड: जलाशय जोड़ें। जलाशय रखने के लिए मानचित्र पर क्लिक करें। तत्वों और लेबल को बदलने या ले जाने के लिए चुनें मोड पर स्विच करें।';
$ec_lang['lpn_mode_add_tank']='मोड: टैंक जोड़ें। टैंक रखने के लिए मानचित्र पर क्लिक करें। तत्वों और लेबल को बदलने या ले जाने के लिए चुनें मोड पर स्विच करें।';
$ec_lang['lpn_mode_add_pipe']='मोड: पाइप जोड़ें। दो नोड को जोड़ने के लिए एक नोड पर, फिर दूसरे पर क्लिक करें। बीच में खुली जगह पर क्लिक करके लाइन मोड़ें, या फिर से शुरू करने के लिए Escape दबाएँ। तत्वों और लेबल को बदलने या ले जाने के लिए चुनें मोड पर स्विच करें।';
$ec_lang['lpn_mode_add_pump']='मोड: पंप जोड़ें। दो नोड को जोड़ने के लिए एक नोड पर, फिर दूसरे पर क्लिक करें। बीच में खुली जगह पर क्लिक करके लाइन मोड़ें, या फिर से शुरू करने के लिए Escape दबाएँ। तत्वों और लेबल को बदलने या ले जाने के लिए चुनें मोड पर स्विच करें।';
$ec_lang['lpn_mode_add_valve']='मोड: वाल्व जोड़ें। दो नोड को जोड़ने के लिए एक नोड पर, फिर दूसरे पर क्लिक करें। बीच में खुली जगह पर क्लिक करके लाइन मोड़ें, या फिर से शुरू करने के लिए Escape दबाएँ। तत्वों और लेबल को बदलने या ले जाने के लिए चुनें मोड पर स्विच करें।';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='मोड: टेक्स्ट जोड़ें। टेक्स्ट रखने के लिए मानचित्र पर क्लिक करें। टेक्स्ट को किसी नोड से जोड़ने के लिए उसके पास क्लिक करें। तत्वों और लेबल को बदलने या ले जाने के लिए चुनें मोड पर स्विच करें।';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='मानचित्र पर चीज़ों को बदलने, ले जाने और खींचने के लिए यह मोड उपयोग करें। यह वह मोड है जिस पर पृष्ठ स्वतः वापस आता है: कुछ कार्यों के बाद, जैसे कोई प्रोजेक्ट खोलना, यह अपने आप यहाँ वापस आ जाता है, और किसी भी अन्य मोड से [Esc] दबाने पर आप यहाँ वापस आ जाते हैं।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='आप किसी लेबल को खींचकर ले जा सकते हैं। लेबल को उसकी स्वचालित स्थिति पर वापस भेजने के लिए उस पर डबल-क्लिक करें।';
$ec_lang['lpn_field_auto']='स्वचालित';
$ec_lang['lpn_method_switch_confirm']='घर्षण विधि बदलने से आपके पाइपों पर पहले से टाइप किए गए खुरदरापन अंक नहीं बदलते, और एक विधि के लिए खुरदरापन दूसरी विधि के लिए अर्थहीन है। इसके बाद हर पाइप जाँच लें। फिर भी बदलें?';
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
$ec_lang['lpn_field_closed']='बंद';
$ec_lang['lpn_field_closed_tip']='इस पाइप को इस तरह बंद करें कि कोई जल इससे न गुज़र सके। पाइप मानचित्र पर बना रहता है और अपने सभी अंक बनाए रखता है, और आप इसे किसी भी समय फिर से खोल सकते हैं।';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='देशांतर';
$ec_lang['lpn_field_lat']='अक्षांश';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='नॉर्थिंग';
$ec_lang['lpn_field_easting']='ईस्टिंग';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='N';
$ec_lang['lpn_field_easting_abbr']='E';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='अक्षां';
$ec_lang['lpn_field_lon_abbr']='देशां';

// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='इस नोड को ठीक से रखने के लिए एक निर्देशांक स्थान टाइप करें। किसी परिदृश्य में यह स्थान केवल उसी परिदृश्य में लागू होता है, ठीक जैसे इसे खींचना करता है; आधार में यह नोड को हर जगह रखता है।';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='वह मानचित्र से बाहर है। Pseudo Mercator में अक्षांश -85.05 से 85.05 तक होता है और देशांतर -180 से 180 तक।';
$ec_lang['lpn_field_text_size']='आकार गुणक';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='हर ज़ूम स्तर पर दिखाएँ';
$ec_lang['lpn_field_text_all_zoom_tip']='आप चाहे जितना दूर ज़ूम आउट करें, इस टेक्स्ट को ड्राइंग पर बनाए रखें। इसे अनटिक करें और जब दृश्य Map and page के अंतर्गत सेट लेबलिंग सीमा से अधिक चौड़ा हो जाता है तो यह टेक्स्ट अन्य लेबल के साथ छिप जाता है।';
$ec_lang['lpn_tool_labels']='लेबल';
$ec_lang['lpn_labels_heading_node']='नोड लेबल';
$ec_lang['lpn_labels_heading_link']='लिंक लेबल';
$ec_lang['lpn_labels_decimals_tip']='इस लेबल के लिए दिखाए जाने वाले दशमलव स्थान';
$ec_lang['lpn_labels_mark_extrema']='सबसे ऊँचे और सबसे नीचे के मान चिह्नित करें';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='मानचित्र पर हर लेबल किए गए गुण के सबसे ऊँचे मान के ऊपर एक रेखा खींचता है (ओवरलाइन), और सबसे नीचे मान के नीचे एक रेखा खींचता है (अंडरलाइन)।';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='सभी पर लागू करें';
$ec_lang['lpn_settings_apply_to_all_tip']='इस तरह के हर पहले से बने तत्व को इस टेक्स्ट से शुरू होने वाली ID मिलती है। हर एक अपना नंबर बनाए रखता है। जो ID किसी नंबर पर समाप्त नहीं होती, उसे नहीं छेड़ा जाता।';
$ec_lang['lpn_confirm_apply_prefix']='{n} तत्वों का नाम बदलें ताकि उनकी ID {prefix} से शुरू हो? हर एक अपना नंबर बनाए रखता है।';
$ec_lang['lpn_prefix_applied']='{n} तत्वों का नाम बदला गया। {skipped} अन्य को नहीं छेड़ा गया।';
$ec_lang['lpn_labels_prefix_tip']='मानचित्र लेबल पर इस गुण से पहले जोड़ा गया टेक्स्ट';
$ec_lang['lpn_labels_suffix_tip']='मानचित्र लेबल पर इस गुण के बाद जोड़ा गया टेक्स्ट';
$ec_lang['lpn_labels_suffix_gradient_tip']='मानचित्र लेबल पर हेड हानि प्रवणता के बाद जोड़ा गया टेक्स्ट। यहाँ प्रतिशत चिह्न न टाइप करें। जब इकाई प्रतिशत हो, तो यह अपने आप जुड़ जाता है।';
$ec_lang['lpn_labels_separator']='मानों के बीच का टेक्स्ट';
$ec_lang['lpn_labels_separator_tip']='लेबल पर एक गुण और अगले गुण के बीच का टेक्स्ट। डिफ़ॉल्ट रूप से एक स्पेस।';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='प्राथमिकता';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='जब लेबल फ़िट नहीं होता तो मान किस क्रम में हटाए जाते हैं। 1 सबसे अंत तक रखा जाता है।';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='जब दो नोड लेबल आपस में ओवरलैप करेंगे तो मानों को किस क्रम में छोड़ा जाए। नंबर 1 वाला मान सबसे पहले छोड़ा जाता है। जब केवल एक मान बचता है और लेबल फिर भी ओवरलैप करते हैं, तो पूरा एक लेबल छुपा दिया जाता है: जिसकी माँग कम है, या जिसका दाब सीमा के बीच के अधिक निकट है, या जिसका स्तर या हेड पड़ोसी नोड्स के अधिक निकट है, वह लेबल छुपता है।';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='उपसर्ग';
$ec_lang['lpn_labels_col_after']='प्रत्यय';
$ec_lang['lpn_labels_col_decimals']='दशमलव';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='दिखाएँ';
$ec_lang['lpn_labels_show_tip']='वह क्रम जिसमें मान किसी लेबल पर दिखाई देते हैं। संख्या 1 वाला मान पहले आता है: एक स्तरित लेबल के शीर्ष पर, और एक पंक्ति वाले लेबल के आरंभ में।';
$ec_lang['lpn_labels_priority_customer_tip']='वह क्रम जिसमें मान ग्राहक लेबल से हटाए जाते हैं। संख्या 1 वाला मान पहले हटाया जाता है।';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='इकाइयाँ उपयोग करें';
$ec_lang['lpn_labels_use_units_tip']='After बॉक्स में और लेबल पर इकाई दिखाने के लिए, और इकाइयाँ बदलने पर इसे साथ बनाए रखने के लिए टिक करें। अपना खुद का After टेक्स्ट टाइप करने के लिए अनटिक करें।';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='आरंभिक स्थिति';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='नोड रंग';
$ec_lang['lpn_settings_sym_link_colors']='लिंक रंग';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='पृष्ठभूमि छवि…';
$ec_lang['lpn_backdrop_add']='जोड़ें';
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
$ec_lang['lpn_backdrop_scale']='चुनकर पैमाना सेट करें';
$ec_lang['lpn_backdrop_scale_entry']='भू-संदर्भ फ़ाइल से या मानचित्र पर एक पिक्सेल के आकार से पैमाना सेट करें';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='मौजूदा आकार से, आपके चुने बिंदु के इर्द-गिर्द पैमाना बदलें';
$ec_lang['lpn_backdrop_scale_from_prompt1']='पृष्ठभूमि छवि पर उस बिंदु पर क्लिक करें जो अपनी जगह पर बना रहना चाहिए।';
$ec_lang['lpn_backdrop_scale_from_prompt2']='इसके मौजूदा आकार से पैमाना बदलें। 1 इसे वैसा ही रखता है, 1.1 इसे 10% बड़ा करता है, 0.9 इसे 10% छोटा करता है।';
$ec_lang['lpn_backdrop_scale_entry_prompt']='मानचित्र पर एक पिक्सेल का आकार दर्ज करें, या छवि की भू-संदर्भ फ़ाइल की पूरी सामग्री चिपकाएँ';
$ec_lang['lpn_backdrop_scale_entry_bad']='मानचित्र पर एक पिक्सेल के आकार के लिए एक संख्या टाइप करें, या भू-संदर्भ फ़ाइल की सभी छह पंक्तियाँ चिपकाएँ।';
$ec_lang['lpn_backdrop_wld_bad']='यह भू-संदर्भ फ़ाइल चित्र को घुमाती, दर्पण-प्रतिबिंबित करती, या असमान रूप से खींचती है। मानचित्र किसी चित्र को केवल स्थानांतरित कर सकता है और दोनों दिशाओं में समान मात्रा में उसका आकार बदल सकता है, इसलिए इस फ़ाइल का उपयोग नहीं किया गया।';
$ec_lang['lpn_backdrop_unreadable']='आपका ब्राउज़र यह चित्र नहीं दिखा सकता। इसे PNG या JPEG के रूप में सहेजें और फिर से जोड़ें।';
$ec_lang['lpn_backdrop_position']='ले जाएँ';
$ec_lang['lpn_backdrop_remove']='हटाएँ';
$ec_lang['lpn_backdrop_remove_confirm']='पृष्ठभूमि छवि हटाएँ?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='विश्व मानचित्र…';
$ec_lang['lpn_map_attach_tip']='इस प्रोजेक्ट में किसी अन्य तरीके से बदलाव किए बिना विश्व मानचित्र जोड़ें।';
$ec_lang['lpn_map_attach_add']='जोड़ें';
$ec_lang['lpn_map_attach_readjust']='फिर समायोजित करें';
$ec_lang['lpn_map_attach_readjust_tip']='मानचित्र जोड़ने की प्रक्रिया के चरण 2 पर लौटें।';
$ec_lang['lpn_map_attach_scale_from']='वर्तमान आकार से पैमाना बदलें…';
$ec_lang['lpn_map_attach_scale_from_prompt']='मानचित्र को उसके वर्तमान आकार से, आपकी ड्राइंग के बीचोंबीच के इर्द-गिर्द, पैमाना बदलें। 1 इसे वैसा ही रखता है, 1.1 इसे 10% बड़ा बनाता है, 0.9 इसे 10% छोटा बनाता है।';
$ec_lang['lpn_map_attach_scale_from_bad']='शून्य से बड़ी एक अकेली संख्या टाइप करें।';
$ec_lang['lpn_map_attach_scale_from_done']='मानचित्र का आकार बदल दिया गया है, और आपकी ड्राइंग और उसमें हर निर्देशांक बिल्कुल वैसे ही हैं जैसे थे।';
$ec_lang['lpn_map_attach_none']='इस प्रोजेक्ट से अभी तक कोई विश्व मानचित्र नहीं जुड़ा है। पहले Map, World map, Attach का उपयोग करें।';
$ec_lang['lpn_map_attach_remove']='अलग करें';
$ec_lang['lpn_map_attach_remove_tip']='विश्व मानचित्र को हटा दें। ड्राइंग और उसके निर्देशांक दोनों ही स्थितियों में अछूते रहते हैं।';
$ec_lang['lpn_map_attach_done']='विश्व मानचित्र अब आपकी ड्राइंग के पीछे है, और आपका प्रोजेक्ट अपरिवर्तित है। इसे फिर से हटाने के लिए Map, World map, Detach का उपयोग करें।';
$ec_lang['lpn_map_attach_removed']='विश्व मानचित्र हट गया है, और ड्राइंग बिल्कुल वैसी ही है जैसी थी।';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='आपकी ड्राइंग पूरी दुनिया के मानचित्र पर है, शून्य अक्षांश और शून्य देशांतर पर समुद्र में। पहले अपना स्थान खोजें: ड्राइंग के पीछे के मानचित्र को पैन और ज़ूम करें, किसी स्थान का नाम खोजें, या एक अक्षांश और देशांतर टाइप करें। ड्राइंग स्वयं नहीं हिलती।';
$ec_lang['lpn_mapgeo_step1']='चरण 1 का 2: दुनिया में अपना स्थान खोजें';
$ec_lang['lpn_mapgeo_step2']='चरण 2 का 2: अपनी ड्राइंग के पीछे मानचित्र फ़िट करें';
$ec_lang['lpn_mapgeo_hint1']='अपनी ड्राइंग के पीछे के मानचित्र को पैन और ज़ूम करें, या किसी स्थान को खोजें, या एक अक्षांश और देशांतर टाइप करें। फिर Place approximately दबाएँ।';
$ec_lang['lpn_mapgeo_readjust_intro']='आपकी ड्राइंग वहीं है जहाँ आपने इसे आखिरी बार रखा था। इसे कहीं और ले जाने के लिए, ड्राइंग के पीछे के मानचित्र को पैन और ज़ूम करें, किसी स्थान का नाम खोजें, या एक अक्षांश और देशांतर टाइप करें। ड्राइंग स्वयं नहीं हिलती।';
$ec_lang['lpn_mapgeo_hint2']='मानचित्र को अपनी ड्राइंग के नीचे खिसकाने के लिए कहीं भी खींचें। आपकी ड्राइंग और उसमें हर निर्देशांक बिल्कुल वहीं रहते हैं जहाँ वे हैं। जब मानचित्र सही हो तो Georeference here दबाएँ।';
$ec_lang['lpn_mapgeo_gestures']='ज़ूम करने पर आपकी ड्राइंग और मानचित्र साथ चलते हैं, ताकि आप देख सकें कि वे कितनी अच्छी तरह मेल खाते हैं। खींचने पर केवल मानचित्र चलता है।';
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
$ec_lang['lpn_mapgeo_dial_turn']='मानचित्र घुमाएँ';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} डिग्री';
$ec_lang['lpn_mapgeo_dial_size']='मानचित्र आकार';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} गुना';
$ec_lang['lpn_mapgeo_dial_help']='मानचित्र को बड़ा या छोटा करने और इसे घुमाने के लिए दो पट्टियों को खिसकाएँ, या उनके ऊपर के बॉक्स में टाइप करें। हर पट्टी का बीच वाला भाग फ़िट चरण से 1 छोड़ा हुआ है, इसलिए 1 और 0 का अर्थ है इसे वैसा ही छोड़ दें। Arrow keys दोनों पर काम करती हैं।';
$ec_lang['lpn_mapgeo_place']='लगभग रखें';
$ec_lang['lpn_mapgeo_finish']='यहाँ भू-संदर्भित करें';
$ec_lang['lpn_mapgeo_cancelled']='विश्व मानचित्र वापस वहीं है जहाँ था, और आपकी ड्राइंग कभी नहीं हिली।';
$ec_lang['lpn_mapgeo_locked']='प्रोजेक्ट बदलने या सहेजने से पहले Georeference here बटन से पूरा करें, या Cancel दबाएँ। विश्व मानचित्र अभी भी रखा जा रहा है।';
$ec_lang['lpn_backdrop_scale_prompt1']='पृष्ठभूमि छवि पर दो बिंदुओं पर क्लिक करें, जैसे किसी बार-स्केल के दोनों छोर। फिर उनके बीच की वास्तविक दूरी टाइप करें।';
$ec_lang['lpn_backdrop_scale_prompt2']='दोनों बिंदुओं के बीच वास्तविक दूरी';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='चाल के लिए आधार बिंदु (छवि पर) पर क्लिक करें।';
$ec_lang['lpn_backdrop_position_prompt2']='गंतव्य बिंदु के लिए तरीका चुनें, फिर Continue पर क्लिक करें।';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='पृष्ठभूमि छवि समायोजित की जा रही है।';
$ec_lang['lpn_backdrop_target_label']='वह बिंदु यहाँ ले जाएँ:';
$ec_lang['lpn_backdrop_target_node']='एक नोड';
$ec_lang['lpn_backdrop_target_free']='मानचित्र पर कोई भी बिंदु';
$ec_lang['lpn_backdrop_target_coords']='आपके टाइप किए निर्देशांक';
$ec_lang['lpn_backdrop_coords_prompt']='वह X,Y टाइप करें जहाँ वह बिंदु जाना चाहिए';
$ec_lang['lpn_backdrop_continue']='जारी रखें';
$ec_lang['lpn_tool_settings']='सेटिंग्स';
$ec_lang['lpn_settings_show_titles']='पृष्ठ शीर्षक दिखाएँ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='पृष्ठ शीर्षक और चित्र के ऊपर की स्वागत पंक्ति को छिपाता है, ताकि मानचित्र के लिए अधिक जगह मिले। प्रिंट करने पर हमेशा केवल एक साफ़ मानचित्र दिखता है।';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='ये शीर्षक छिपाएँ';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='चयन सहायता दिखाएँ';
$ec_lang['lpn_settings_area_hint_tip']='जब आप एक क्षेत्र चुन रहे हों, तब मानचित्र पर वह बबल दिखाता है जो बताता है कि आपका अगला क्लिक क्या करेगा।';
$ec_lang['lpn_settings_id_prefixes']='ID उपसर्ग';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='आरंभिक मान';
$ec_lang['lpn_settings_defaults_note']='अब से बनाए गए तत्वों के लिए उपयोग होता है। मौजूदा तत्व नहीं बदलते।';
$ec_lang['lpn_settings_push_note']='केवल वे गुण लागू होते हैं जिनके लेबल अभी दिखाई दे रहे हैं।';
$ec_lang['lpn_settings_push_btn']='ये नए-तत्व मान हर मौजूदा तत्व पर लागू करें';
$ec_lang['lpn_push_confirm']='हर मौजूदा तत्व पर ये गुण नए तत्वों के लिए अभी सेट किए गए मानों से बदल दें? आपके टाइप किए मान मिटा दिए जाएँगे। इसे पूर्ववत किया जा सकता है।';
$ec_lang['lpn_push_properties']='गुण:';
$ec_lang['lpn_push_assets']='नोड और पाइप:';
$ec_lang['lpn_push_none_displayed']='अभी कोई आरंभिक मान लेबल के रूप में नहीं दिख रहा, इसलिए लागू करने के लिए कुछ नहीं है। Labels पैनल में चाहे गए गुणों के लेबल चालू करें, फिर फिर से प्रयास करें।';
$ec_lang['lpn_push_nothing']='किसी भी मौजूदा तत्व में लागू किए जा रहे गुणों में से कोई नहीं है।';
$ec_lang['lpn_push_no_change']='हर तत्व में पहले से ही ये मान हैं, इसलिए कुछ नहीं बदलेगा।';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='कस्टम गुण';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='वे गुण जिन्हें आप अपने उद्देश्यों के लिए स्वयं परिभाषित करते हैं। ये अन्य सभी गुणों की तरह प्रोजेक्ट और परिदृश्यों के साथ सहेजे जाते हैं।';
$ec_lang['lpn_cp_design']='डिज़ाइन';
$ec_lang['lpn_cp_design_tip']='प्रत्येक कस्टम गुण के लिए एक पंक्ति, और हर एक खुलने पर दिखाती है: कुंजी, लेबल, इस पर लागू, इस रूप में सत्यापित करें, अनुमति दें या प्रतिबंधित करें, उस चुनाव द्वारा नामित वर्ण फ़ील्ड, लंबाई की निचली सीमा, लंबाई की ऊपरी सीमा, निचली सीमा, ऊपरी सीमा।';
$ec_lang['lpn_cp_add']='कस्टम गुण जोड़ें';
$ec_lang['lpn_cp_add_tip']='डिज़ाइन तालिका में एक पंक्ति जोड़ता है और उसे संपादन के लिए खोलता है।';
$ec_lang['lpn_cp_remove_tip']='इस गुण को डिज़ाइन तालिका से हटाता है। आपके तत्वों पर पहले से टाइप किए गए मान फ़ाइल में बने रहते हैं और यदि आप फिर से वही कुंजी डिज़ाइन करें तो वापस आ जाते हैं।';
$ec_lang['lpn_cp_none']='अभी तक कोई कस्टम गुण डिज़ाइन नहीं किया गया है।';
$ec_lang['lpn_cp_unnamed']='अभी नाम नहीं दिया गया';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='कुंजी';
$ec_lang['lpn_cp_key_tip']='कुंजी: एक गुण इसी नाम के अंतर्गत सहेजा जाता है। स्पेस की अनुमति नहीं है, और आपके लिए एक प्रीफ़िक्स स्वतः जोड़ा जाता है ताकि आपकी कुंजी किसी अंतर्निहित फ़ील्ड से कभी न टकराए।';
$ec_lang['lpn_cp_label']='लेबल';
$ec_lang['lpn_cp_label_tip']='लेबल: कोई पाठक इसे गुण बॉक्स पर, Find में, और तालिका स्तंभ के शीर्ष पर देखता है।';
$ec_lang['lpn_cp_applies']='इस पर लागू';
$ec_lang['lpn_cp_applies_tip']='इस पर लागू: उन तत्वों के ID प्रीफ़िक्स की अल्पविराम से अलग सूची जो इस गुण का उपयोग करते हैं, जैसे J,L,R।';
$ec_lang['lpn_cp_validate']='इस रूप में सत्यापित करें';
$ec_lang['lpn_cp_validate_tip']='इस रूप में सत्यापित करें: यह बताता है कि एक सही मान कैसा दिखता है। केस नियम केवल अंग्रेज़ी वर्णमाला को पढ़ते हैं, जो एक बताई गई सीमा है। कुछ भी स्वीकार करने के लिए Do not validate चुनें।';
$ec_lang['lpn_cp_restrict']='इन वर्णों को प्रतिबंधित करें';
$ec_lang['lpn_cp_restrict_tip']='इन वर्णों को प्रतिबंधित करें: एक मान यहाँ सूचीबद्ध वर्णों का ही उपयोग कर सकता है, या इनमें से किसी का नहीं, जहाँ "@" का अर्थ है कोई भी अक्षर; "#" का अर्थ है कोई भी अंक, और यदि "-", ".", और "," की अनुमति देनी हो तो इन्हें अलग से सूचीबद्ध करना होगा; और कोई भी व्हाइट स्पेस वर्ण अन्य वर्णों के बीच में ही होना चाहिए।';
$ec_lang['lpn_cp_restrict_mode']='अनुमति दें या प्रतिबंधित करें';
$ec_lang['lpn_cp_restrict_mode_tip']='अनुमति दें या प्रतिबंधित करें: दिए गए वर्ण या तो वे एकमात्र वर्ण हैं जिनका मान उपयोग कर सकता है, या वे वर्ण हैं जिनका वह उपयोग नहीं कर सकता।';
$ec_lang['lpn_cp_restrict_allow']='केवल इन वर्णों की अनुमति दें';
$ec_lang['lpn_cp_minlength']='लंबाई की निचली सीमा';
$ec_lang['lpn_cp_minlength_tip']='लंबाई की निचली सीमा: इससे छोटी कोई भी प्रविष्टि चिह्नित की जाती है, इसी तरह आप खाली और आधी-टाइप की गई प्रविष्टियाँ ढूँढ सकते हैं।';
$ec_lang['lpn_cp_length']='लंबाई की ऊपरी सीमा';
$ec_lang['lpn_cp_length_tip']='लंबाई की ऊपरी सीमा: इससे बड़ी कोई भी प्रविष्टि चिह्नित की जाती है।';
$ec_lang['lpn_cp_low']='निचली सीमा';
$ec_lang['lpn_cp_low_tip']='निचली सीमा: यह वह सबसे छोटा मान है जिसकी आप अपेक्षा करते हैं। संख्याओं की तुलना संख्या के रूप में और टेक्स्ट की तुलना शब्दकोश क्रम में की जाती है।';
$ec_lang['lpn_cp_high']='ऊपरी सीमा';
$ec_lang['lpn_cp_high_tip']='ऊपरी सीमा: यह वह सबसे बड़ा मान है जिसकी आप अपेक्षा करते हैं। संख्याओं की तुलना संख्या के रूप में और टेक्स्ट की तुलना शब्दकोश क्रम में की जाती है।';
$ec_lang['lpn_cp_val_none']='सत्यापित न करें';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='संख्या .';
$ec_lang['lpn_cp_val_number_comma']='संख्या ,';
$ec_lang['lpn_cp_val_integer']='पूर्णांक';
$ec_lang['lpn_cp_val_upper']='सभी बड़े अक्षर';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} मान बिल्कुल वैसा ही रखा गया है जैसा आपने टाइप किया।';
$ec_lang['lpn_cp_bad_number']='यह मान संख्या नहीं है, जबकि इस गुण के लिए संख्या आवश्यक है।';
$ec_lang['lpn_cp_bad_integer']='यह मान पूर्णांक नहीं है, जबकि इस गुण के लिए पूर्णांक आवश्यक है।';
$ec_lang['lpn_cp_bad_case']='यह मान सभी बड़े अक्षरों में नहीं है, जबकि इस गुण के लिए यह आवश्यक है।';
$ec_lang['lpn_cp_bad_chars']='यह मान एक ऐसे वर्ण का उपयोग करता है जिसकी इस गुण में अनुमति नहीं है।';
$ec_lang['lpn_cp_bad_space']='व्हाइट स्पेस केवल अन्य वर्णों के बीच में ही अनुमत है।';
$ec_lang['lpn_cp_bad_minlength']='यह मान इस गुण की अनुमति से छोटा है।';
$ec_lang['lpn_cp_bad_length']='यह मान इस गुण की अनुमति से बड़ा है।';
$ec_lang['lpn_cp_bad_low']='यह मान इस गुण की निचली सीमा से कम है।';
$ec_lang['lpn_cp_bad_high']='यह मान इस गुण की ऊपरी सीमा से अधिक है।';
$ec_lang['lpn_cp_key_needed']='इस कस्टम गुण को बिना स्पेस वाली एक कुंजी दें।';
$ec_lang['lpn_cp_key_taken']='एक अन्य कस्टम गुण पहले से ही उस कुंजी का उपयोग कर रहा है।';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='परिदृश्य';
$ec_lang['lpn_scenario_base']='आधार';
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
$ec_lang['lpn_scenario_overrides']='अपने मानों की संख्या';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='एम्बर रिंग का मतलब है कि इस तत्व में एक ऐसा मान है जो केवल {name} परिदृश्य का है।';
$ec_lang['lpn_scenario_overrides_tip']='उन मानों में से हर एक को मानचित्र पर एम्बर रिंग से चिह्नित किया गया है। उनके बिना ड्राइंग देखने के लिए {base} पर स्विच करें।';
$ec_lang['lpn_scenario_menu']='परिदृश्य';
$ec_lang['lpn_scenario_tip']='मानों का वह समुच्चय जो चित्र अभी दिखा रहा है और पृष्ठ अभी हल कर रहा है। परिदृश्य बदलने, या एक जोड़ने, नाम बदलने, या हटाने के लिए क्लिक करें।';
$ec_lang['lpn_scenario_new']='नया परिदृश्य…';
$ec_lang['lpn_scenario_new_name']='परिदृश्य {n}';
$ec_lang['lpn_scenario_prompt_name']='इस परिदृश्य के लिए नाम';
$ec_lang['lpn_scenario_rename']='परिदृश्य का नाम बदलें…';
$ec_lang['lpn_scenario_delete']='परिदृश्य हटाएँ';
$ec_lang['lpn_scenario_delete_confirm']='परिदृश्य {name} हटाएँ, और उसके अकेले के {n} मान भी? स्वयं चित्र नहीं बदलता।';
$ec_lang['lpn_scenario_override']='केवल इस परिदृश्य में';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='चेक होने का अर्थ है कि यह मान केवल इस परिदृश्य का है, भले ही यह आधार के समान अंक हो। आधार का मान फिर से उपयोग करने के लिए बॉक्स को अनचेक करें।';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='आधार परिदृश्य: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} {scenario} में नेटवर्क से बाहर है। यह अब भी चित्र में है, और आपके अन्य परिदृश्यों में भी।';
$ec_lang['lpn_scenario_push_btn']='सभी परिदृश्यों पर आधार मान लागू करें';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='हर परिदृश्य अभी दिख रहे लेबलों के गुणों के लिए आधार मान पर वापस चला जाता है। उन परिदृश्यों के अकेले के मान त्याग दिए जाते हैं।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='हर परिदृश्य को इन गुणों के लिए आधार मान उपयोग करवाएँ? उन परिदृश्यों के अकेले के मान त्याग दिए जाते हैं। आप इसे पूर्ववत् कर सकते हैं।';
$ec_lang['lpn_scenario_push_scenarios']='प्रभावित परिदृश्य:';
$ec_lang['lpn_scenario_push_values']='त्यागे गए मान:';
$ec_lang['lpn_scenario_push_none']='इनमें से किसी भी गुण के लिए किसी परिदृश्य के पास अपना मान नहीं है, इसलिए कुछ नहीं बदलेगा। कुछ भी त्यागा नहीं जाएगा।';
$ec_lang['lpn_scenario_preset_flow_static']='1. प्रवाह परीक्षण: स्थिर';
$ec_lang['lpn_scenario_preset_flow_static_tip']='डिज़ाइन नेटवर्क के लिए 0 प्रवाह पर प्रवाह परीक्षण अंशांकन। इस परिदृश्य में सभी जंक्शनों की माँग 0 रखें।';
$ec_lang['lpn_scenario_preset_flow_mid']='2. प्रवाह परीक्षण: मध्य';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='डिज़ाइन नेटवर्क के लिए पहले दर्ज किए गए प्रवाह पर प्रवाह परीक्षण अंशांकन। इस परिदृश्य में बहते जंक्शन की माँग को मापे गए पहले प्रवाह के बराबर और अन्य सभी जंक्शनों की माँग को 0 रखें।';
$ec_lang['lpn_scenario_preset_flow_max']='3. प्रवाह परीक्षण: अधिकतम';
$ec_lang['lpn_scenario_preset_flow_max_tip']='डिज़ाइन नेटवर्क के लिए दर्ज किए गए अधिकतम प्रवाह पर प्रवाह परीक्षण अंशांकन। इस परिदृश्य में बहते जंक्शन की माँग को मापे गए अधिकतम प्रवाह के बराबर और अन्य सभी जंक्शनों की माँग को 0 रखें।';
$ec_lang['lpn_scenario_preset_average_day']='4. औसत दिन';
$ec_lang['lpn_scenario_preset_average_day_tip']='माँग गुणक 1: हर माँग वैसी ही जैसी दर्ज की गई, जिसे औसत दिन की माँग माना जाता है।';
$ec_lang['lpn_scenario_preset_max_day']='5. अधिकतम दिन';
$ec_lang['lpn_scenario_preset_max_day_tip']='माँग गुणक औसत दिन का 2.0 गुना, जो एक प्लेसहोल्डर मान है। अधिकतर सिस्टम 1.2 और 3.0 के बीच आते हैं (National Research Council, 2006)। अपने सिस्टम का मान सेटिंग्स, गणना, हाइड्रॉलिक्स, माँग गुणक में सेट करें।';
$ec_lang['lpn_scenario_preset_peak_hour']='6. पीक घंटा';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='माँग गुणक औसत दिन का 3.0 गुना, जो एक प्लेसहोल्डर मान है। अधिकतर सिस्टम 3.0 और 6.0 के बीच आते हैं (National Research Council, 2006)। अपने सिस्टम का मान सेटिंग्स, गणना, हाइड्रॉलिक्स, माँग गुणक में सेट करें।';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. फायर और अधिकतम दिन';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='अधिकतम दिन की माँग (गुणक 2.0)। इस परिदृश्य में फायर फ्लो विश्लेषण चलाएँ: यह इस माँग के ऊपर हर जंक्शन पर फायर फ्लो जोड़ता है।';
$ec_lang['lpn_delete_drops_overrides']='इस तत्व को हटाने से आपके परिदृश्यों के पास इसके लिए रखे {n} मान भी त्याग दिए जाते हैं। जारी रखें?';
$ec_lang['lpn_push_base_only']='यह क्रिया स्वयं चित्र को बदलती है, इसलिए यह केवल {base} में ही की जा सकती है। {base} पर स्विच करें और फिर से प्रयास करें।';
$ec_lang['lpn_field_active']='इस नेटवर्क का भाग';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='तत्व को चित्र में रखते हुए नेटवर्क से बाहर छोड़ने के लिए यह बॉक्स अनचेक करें: इसे धूसर रंग में दिखाया जाता है और सॉल्वर इसे अनदेखा करता है। किसी परिदृश्य में प्रस्तावित पाइप को इसी तरह चालू या बंद किया जाता है।';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='एमिटर घातांक';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='स्प्रिंकलर और रिसाव के लिए EPANET के उत्सर्जक समीकरण में घातांक: प्रवाह = गुणांक x दाब की इस घातांक तक की घात। यह उत्तर तभी बदलता है जब किसी नोड में उत्सर्जक हो, जो अभी के लिए मतलब EPANET फ़ाइल से पढ़ा गया नेटवर्क है।';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='DEM पढ़ें';
$ec_lang['lpn_elev_dem_sample_tip']='इस नोड पर DEM की ऊँचाई पढ़ता है और उसे नीचे दिखाता है। स्तर बॉक्स में कुछ नहीं बदलता। क्षैतिज DEM रिज़ॉल्यूशन धरती के अधिकांश हिस्से में लगभग 30 मीटर है, और जहाँ बेहतर डेटा उपलब्ध है वहाँ इससे बारीक है।';
$ec_lang['lpn_elev_dem_use']='DEM उपयोग करें';
$ec_lang['lpn_elev_dem_use_tip']='इस नोड पर DEM की ऊँचाई को ऊपर दिए गए स्तर बॉक्स में डालता है, जो वहाँ पहले से है उसकी जगह लेते हुए। यदि DEM अभी तक पढ़ा नहीं गया है तो यह पहले उसे पढ़ता है। एक Undo इसे वापस कर देता है।';
$ec_lang['lpn_elev_dem_none']='इस नोड के लिए DEM में कोई ऊँचाई नहीं है।';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM के अनुसार {v} {u}।';
$ec_lang['lpn_settings_elev_source']='स्तर स्रोत';
$ec_lang['lpn_settings_elev_source_tip']='नया नोड अपनी ऊँचाई कहाँ से पाता है। ज़मीन की सतह Mapbox DEM से पढ़ी जाती है, जो धरती के अधिकांश हिस्से में लगभग 30 मीटर चौड़ा है, और जहाँ बेहतर डेटा उपलब्ध है वहाँ इससे बारीक है।';
$ec_lang['lpn_settings_elev_source_typed']='ऊपर टाइप किया गया स्तर';
$ec_lang['lpn_settings_elev_source_dem']='मैपबॉक्स DEM';
$ec_lang['lpn_settings_accuracy']='सटीकता';
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
$ec_lang['lpn_settings_default_is']='डिफ़ॉल्ट {n} है।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='सॉल्वर को रुकने से पहले कितना करीब पहुँचना है, इसे इस तरह मापा जाता है कि एक ट्रायल से अगले ट्रायल तक प्रवाह कितना बदल रहे हैं। छोटी संख्या अधिक सटीक होती है और अधिक समय लेती है। दोनों सॉल्वर इसी एक बॉक्स को पढ़ते हैं, और हर एक उस बदलाव को अलग कुल के मुकाबले मापता है: बिल्ट-इन सॉल्वर माँगों के योग के मुकाबले, EPANET लिंक प्रवाहों के योग के मुकाबले। खाली छोड़ने पर, यह पृष्ठ EPANET के अपने डिफ़ॉल्ट से अधिक सख़्त सटीकता उपयोग करता है।';
$ec_lang['lpn_settings_specific_gravity']='विशिष्ट गुरुत्व';
$ec_lang['lpn_settings_specific_gravity_tip']='पानी की तुलना में द्रव का वज़न। यह वह दाब बदलता है जो एक गेज दिखाएगा, प्रवाह नहीं।';
$ec_lang['lpn_settings_viscosity']='सापेक्ष श्यानता';
$ec_lang['lpn_settings_viscosity_tip']='20 डिग्री सेल्सियस पर पानी की तुलना में द्रव की श्यानता। यह उत्तर केवल Darcy-Weisbach विधि के तहत बदलता है।';
$ec_lang['lpn_settings_trials']='अधिकतम ट्रायल';
$ec_lang['lpn_settings_trials_tip']='एक ऐसे नेटवर्क पर जो अभिसरित नहीं होगा, सॉल्वर के हार मानने से पहले कितने ट्रायल की अनुमति है।';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='यदि यह अभिसरित नहीं होता';
$ec_lang['lpn_settings_unbalanced_tip']='एक ऐसे नेटवर्क के साथ क्या किया जाए जिसके ट्रायल खत्म हो गए हैं और वह अभी भी अभिसरित नहीं हुआ है। अतिरिक्त ट्रायल की अनुमति देने से अक्सर अभिसरण मिल जाता है। रोकने पर अंतिम ट्रायल जैसा है वैसा ही रिपोर्ट होता है, जो कोई हल नहीं है। केवल EPANET सॉल्वर यह बॉक्स पढ़ता है। बिल्ट-इन सॉल्वर हमेशा रुकता है और उत्तर को अभिसरित नहीं के रूप में चिह्नित करता है।';
$ec_lang['lpn_settings_unbalanced_continue']='अतिरिक्त ट्रायल की अनुमति दें';
$ec_lang['lpn_settings_unbalanced_stop']='रोकें और अंतिम ट्रायल रिपोर्ट करें';
$ec_lang['lpn_settings_unbalanced_trials']='रिपोर्ट करने से पहले अतिरिक्त ट्रायल';
$ec_lang['lpn_settings_unbalanced_trials_tip']='ऊपर दिए अधिकतम के खत्म होने के बाद, अंतिम ट्रायल रिपोर्ट होने से पहले, कितने और ट्रायल की अनुमति दी जाए। केवल EPANET सॉल्वर यह बॉक्स पढ़ता है।';
$ec_lang['lpn_settings_head_error']='हेड त्रुटि सीमा';
$ec_lang['lpn_settings_head_error_tip']='सॉल्वर को रुकने से पहले पास करना होने वाला एक अतिरिक्त परीक्षण: किसी भी एक पाइप में बची हुई सबसे बड़ी हेड त्रुटि। शून्य का मतलब है कि यह परीक्षण लागू न करें। केवल EPANET सॉल्वर यह बॉक्स पढ़ता है।';
$ec_lang['lpn_settings_flow_change']='प्रवाह परिवर्तन सीमा';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='सॉल्वर को रुकने से पहले पास करना होने वाला एक अतिरिक्त परीक्षण: किसी भी एक पाइप के प्रवाह में एक ट्रायल से अगले तक का अधिकतम बदलाव। शून्य का मतलब है कि यह परीक्षण लागू न करें। केवल EPANET सॉल्वर यह बॉक्स पढ़ता है।';
$ec_lang['lpn_settings_damp_limit']='डैम्पिंग यहाँ से शुरू होती है';
$ec_lang['lpn_settings_damp_limit_tip']='वह सटीकता जिस पर सॉल्वर छोटे कदम लेना शुरू करता है, जो एक दोलन करते नेटवर्क को अभिसरित होने में मदद कर सकता है। शून्य का मतलब है कि सॉल्वर कभी डैम्प नहीं करता। केवल EPANET सॉल्वर यह बॉक्स पढ़ता है।';
$ec_lang['lpn_settings_option_unset']='नहीं बताया गया';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='नेटवर्क की हर माँग पर एक साथ लागू होने वाला एक अकेला गुणक। इससे पूछा जा सकता है कि सिस्टम आज के उपयोग से ज़्यादा या कम पर क्या करता है। यह आपके टाइप किए अंकों को नहीं बदलता। एक परिदृश्य अपना खुद का गुणक रख सकता है, ताकि औसत दिन, अधिकतम दिन और पीक घंटा हर एक के लिए एक ही संख्या हो; प्रोजेक्ट का गुणक उपयोग करने के लिए परिदृश्य में इसे खाली छोड़ दें।';
$ec_lang['lpn_settings_engine_native']='EPANET सॉल्वर से हल करें';
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
$ec_lang['lpn_settings_engine_native_tip']='जहाँ संभव हो वहाँ बिल्ट-इन सॉल्वर उपयोग करने के लिए इसे चालू करें। अन्यथा, US EPA का EPANET सॉल्वर हमेशा उपयोग किया जाता है। बिल्ट-इन सॉल्वर विस्तारित अवधि सिमुलेशन या सक्रिय PRV, PSV, या FCV के लिए उपयोग नहीं किया जाता। EPANET सॉल्वर पहली बार उपयोग होने पर लगभग 650 KB डाउनलोड होता है और फिर इस डिवाइस पर रखा जाता है। जहाँ किसी पाइप में स्थानीय (लघु) हानि होती है, वहाँ दोनों सॉल्वर अंतिम अंकों में असहमत होते हैं: EPANET गुरुत्वाकर्षण के लिए उपयोग किए जाने वाले मान को पूर्णांकित करता है, इसलिए इसकी स्थानीय हानियाँ सटीक रूप से बहुत थोड़ी कम आती हैं।';
$ec_lang['lpn_engine_loading']='EPANET सॉल्वर लोड हो रहा है…';
$ec_lang['lpn_engine_failed']='EPANET सॉल्वर लोड नहीं हो सका। इसके बजाय बिल्ट-इन सॉल्वर दिखाया जा रहा है।';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='EPANET सॉल्वर से हल किया गया, क्योंकि ये वाल्व स्वयं खुलते-बंद होते हैं:';
$ec_lang['lpn_unit_unknown']='इस ड्राइंग में एक ऐसी इकाई बताई गई है जो इस पृष्ठ पर उपलब्ध नहीं है: {unit}। सब कुछ ठीक वैसे ही रखा और दिखाया गया है जैसे यह आया, और कुछ भी नहीं बदला गया। जब तक इस पृष्ठ को यह इकाई ज्ञात नहीं होती, तब तक कोई उत्तर नहीं दिया जा सकता, क्योंकि इसका आकार बताने का कोई तरीका नहीं है।';
$ec_lang['lpn_engine_manning_note']='नोट: मैनिंग खुरदरापन के साथ, EPANET मैनिंग समीकरण के स्थिरांक को पूर्णांकित करता है, इसलिए हेड हानि सटीक रूप की तुलना में लगभग 0.6% कम आती है।';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='EPANET सॉल्वर ने इस नेटवर्क को स्वीकार नहीं किया, इसलिए यह नहीं चला।';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='EPANET सॉल्वर ने कहा: {message}';
$ec_lang['lpn_engine_refused_fallback']='स्क्रीन पर दिख रही संख्याएँ इसके बजाय अंतर्निहित सॉल्वर से आईं।';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='स्क्रीन पर दिख रही संख्याएँ इसके बजाय अंतर्निहित सॉल्वर से आईं। यह एक बार में एक ही क्षण की गणना करता है, इसलिए यह केवल {time} पर का नेटवर्क है, जिसमें हर टंकी अभी भी अपने शुरुआती स्तर पर है।';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='ये नियंत्रण ऐसे तत्व का नाम लेते हैं जो अब इस प्रोजेक्ट में नहीं है, इसलिए इन्हें छोड़ दिया गया: {ids}';
$ec_lang['lpn_control_unreadable_note']='ये नियंत्रण पढ़े नहीं जा सके, इसलिए इन्हें छोड़ दिया गया: {ids}';
$ec_lang['lpn_rule_dangling_note']='ये नियम एक ऐसे तत्व को संदर्भित करते हैं जो अब इस प्रोजेक्ट में नहीं है, इसलिए इस रन में इन्हें अनदेखा किया गया: {ids}';
$ec_lang['lpn_rule_unreadable_note']='ये नियम पढ़े नहीं जा सके, इसलिए इस रन में इन्हें अनदेखा किया गया: {ids}';
$ec_lang['lpn_settings_text_size']='टेक्स्ट आकार (पिक्सेल)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='प्रतीक आकार (पिक्सेल)';
$ec_lang['lpn_settings_link_width']='लिंक लाइन चौड़ाई (पिक्सेल)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='प्रवाह दिशा तीर';
$ec_lang['lpn_settings_show_arrows_tip']='हर पाइप पर एक तीर बनाएँ जो दिखाए कि पानी किस दिशा में बह रहा है। तीर रन के बाद दिखते हैं, और उन्हें बंद करने से परिणामों में कोई बदलाव नहीं होता। यह सेटिंग प्रोजेक्ट के साथ सहेजी जाती है।';
$ec_lang['lpn_settings_align_labels']='पाइप लेबल को पाइपों के साथ संरेखित करें';
$ec_lang['lpn_settings_readability_bias']='लेबल पलटने से पहले ऊर्ध्वाधर से बाईं ओर कितनी डिग्री';
$ec_lang['lpn_settings_readability_bias_tip']='जब कोई लेबल ऊर्ध्वाधर से बाईं ओर इतनी डिग्री से अधिक झुके, तो उसे सीधा रखने के लिए पलट दें।';
$ec_lang['lpn_settings_mask_labels']='लेबलों के पीछे ठोस पृष्ठभूमि';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='लीडर लाइनों को तय कोणों पर स्नैप करें';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='जब आप किसी लेबल को उस चीज़ से दूर खींचते हैं जिसका वह नाम लेता है, तो अगर आप किसी तय कोण के पास खींचते हैं तो वापस जाने वाली लाइन उस निकटतम कोण पर खिंच जाती है। खींचना जारी रखें तो स्नैप छूट जाता है, ताकि कोई भी कोण अब भी उपलब्ध रहे। बंद करने पर यह स्वतंत्र रूप से खिंचता है, जो इस पृष्ठ ने हमेशा किया है।';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='लेबल तभी दिखाएँ जब मानचित्र की चौड़ाई इतनी या इससे कम हो';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='लेबल केवल तभी बनाए जाते हैं जब मानचित्र दृश्य इतना चौड़ा या इससे संकरा हो। हर ज़ूम पर उन्हें बनाने के लिए बॉक्स को खाली छोड़ें। किसी भी ज़ूम पर लेबल कभी न बनाने के लिए 0 टाइप करें।';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='हमेशा दिखाएँ';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='नोड्स को इससे बड़ा होने से रोकें';
$ec_lang['lpn_settings_symbol_cap_mid']='गुना, इस पाइप की लंबाई के';
$ec_lang['lpn_settings_symbol_cap_post']='पर्सेंटाइल पाइप';
$ec_lang['lpn_settings_symbol_cap_tip']='एक जंक्शन ज़मीन पर बढ़ना बंद कर देता है जब उसका व्यास नेटवर्क में सभी पाइप लंबाइयों के इस पर्सेंटाइल पर पाइप की लंबाई का इतने गुना हो जाए। मानचित्र पर उस बिंदु से आगे, जंक्शन, पाइप और अन्य प्रतीक ज़मीन पर बढ़ने के बजाय ज़ूम आउट करने पर स्क्रीन पर सिकुड़ते हैं। जलाशय और टैंक इसके अपवाद हैं और हर ज़ूम पर अपना स्क्रीन आकार बनाए रखते हैं।';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='प्रतीक अपारदर्शिता (0 से 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='पृष्ठभूमि छवि अपारदर्शिता (0 से 1)';
$ec_lang['lpn_settings_map_display']='रूप-रंग';
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
$ec_lang['lpn_settings_legend_position']='लेबल लेजेंड की स्थिति';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='कोई नहीं';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='बंद';
$ec_lang['lpn_settings_legend_top_left']='ऊपर बाईं ओर';
$ec_lang['lpn_settings_legend_top_right']='ऊपर दाईं ओर';
$ec_lang['lpn_settings_legend_middle_left']='मध्य बाईं ओर';
$ec_lang['lpn_settings_legend_middle_right']='मध्य दाईं ओर';
$ec_lang['lpn_settings_legend_bottom_left']='नीचे बाईं ओर';
$ec_lang['lpn_settings_legend_bottom_right']='नीचे दाईं ओर';
$ec_lang['lpn_settings_color_node_field']='नोड रंग';
$ec_lang['lpn_settings_color_link_field']='पाइप रंग';
$ec_lang['lpn_settings_color_ramp']='रंग योजना';
$ec_lang['lpn_settings_color_credits']='श्रेय';
$ec_lang['lpn_color_ramp_epanet']='नीला से लाल (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='बैंगनी से पीला (एक रंग को दूसरे से अलग पहचानना आसान)';
$ec_lang['lpn_color_ramp_gray']='हल्के से गहरे स्लेटी';
$ec_lang['lpn_settings_color_reverse']='रंगों का क्रम उलटें';
$ec_lang['lpn_color_none']='कोई रंग नहीं';
$ec_lang['lpn_settings_color_key_position']='रंग लेजेंड की स्थिति';
$ec_lang['lpn_settings_color_breaks']='रंग बैंड सीमाएँ';
$ec_lang['lpn_settings_color_equal_intervals']='समान अंतराल';
$ec_lang['lpn_settings_color_equal_counts']='समान गणना';
$ec_lang['lpn_settings_color_no_values']='अभी काम करने के लिए कोई मान नहीं है। पहले नेटवर्क हल करें।';
$ec_lang['lpn_confirm_restore_defaults']='सभी सेटिंग्स (ID उपसर्ग, आरंभिक मान, सॉल्वर सेटिंग्स, मानचित्र रूप-रंग, लेजेंड की स्थिति, और दिखाई देने वाले लेबल) को उनके मूल मानों पर रीसेट करें? आपका नेटवर्क नहीं बदलता। सेटिंग्स खुले हुए प्रोजेक्ट की होती हैं, इसलिए आपके अन्य प्रोजेक्ट अपनी अलग सेटिंग्स रखते हैं।';
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
$ec_lang['lpn_settings_wipe_btn']='फिर से नई शुरुआत करें';
$ec_lang['lpn_confirm_wipe']='फिर से नई शुरुआत करें, और इस पृष्ठ के लिए सहेजी गई हर चीज़ मिटा दें: हर प्रोजेक्ट, हर पृष्ठभूमि छवि, सभी सेटिंग्स, और आपकी इकाई पसंद? पृष्ठ बिल्कुल वैसे ही फिर से लोड होगा जैसे कोई बिल्कुल नया आगंतुक इसे देखता। इसे पूर्ववत नहीं किया जा सकता।';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='यह लिंक कॉपी करें:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='समय';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='कुल चलने का समय';
$ec_lang['lpn_time_hyd_step']='हाइड्रॉलिक समय चरण';
$ec_lang['lpn_time_pattern_step']='प्रतिरूप समय चरण';
$ec_lang['lpn_time_pattern_start']='प्रतिरूप आरंभ समय';
$ec_lang['lpn_time_report_step']='रिपोर्ट समय चरण';
$ec_lang['lpn_time_report_start']='रिपोर्ट आरंभ समय';
$ec_lang['lpn_time_clock_start']='आरंभ पर घड़ी का समय';
$ec_lang['lpn_time_clock_day']='दिन {day}, {clock}';
$ec_lang['lpn_time_format_tip']='समय को घंटे और मिनट के रूप में लिखें, जैसे 2:30। एक सादी संख्या का अर्थ घंटे है, इसलिए 8 का अर्थ है आठ घंटे। आधा घंटा 0:30 है।';
$ec_lang['lpn_time_running']='विस्तारित अवधि सिमुलेशन की गणना की जा रही है।';
$ec_lang['lpn_time_no_engine']='बिल्ट-इन सॉल्वर एक बार में केवल एक क्षण परिकलित करता है, इसलिए यह केवल {time} पर का नेटवर्क है: हर पैटर्न उसी क्षण पर पढ़ा जाता है, और हर टैंक अभी भी भरने और खाली होने के बजाय अपने आरंभिक स्तर पर बना रहता है। पूरी अवधि चलाने वाले EPANET सॉल्वर को लाने के लिए एक बार इंटरनेट से जुड़ें।';
$ec_lang['lpn_time_slider']='बीता हुआ सिमुलेशन समय';
$ec_lang['lpn_time_no_period']='इस प्रोजेक्ट में कोई समय अवधि नहीं है, इसलिए दिखाने के लिए एक ही क्षण है। नेटवर्क की समय के साथ गणना करने के लिए Settings में एक Total run time सेट करें।';
$ec_lang['lpn_time_first']='आरंभ पर जाएँ';
$ec_lang['lpn_time_prev']='पीछे जाएँ';
$ec_lang['lpn_time_play']='चलाएँ';
$ec_lang['lpn_time_play_tip']='एनिमेशन चलाएँ';
$ec_lang['lpn_time_pause_tip']='एनिमेशन रोकें';
$ec_lang['lpn_time_pause']='रोकें';
$ec_lang['lpn_time_next']='आगे जाएँ';
$ec_lang['lpn_time_last']='अंत पर जाएँ';
$ec_lang['lpn_time_tank']='टैंक';
$ec_lang['lpn_time_level']='जल स्तर';
$ec_lang['lpn_time_run']='गणना करें';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='इस नेटवर्क को हर हाइड्रॉलिक समय-चरण पर हल करें।';
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
$ec_lang['lpn_time_run_done']='रन पूरा हुआ। रिपोर्टिंग समय: {frames}। लगा समय: {secs} सेकंड।';
$ec_lang['lpn_time_runbox_hide']='यह बॉक्स फिर न दिखाएँ';
$ec_lang['lpn_settings_runbox']='रन प्रगति बॉक्स दिखाएँ';
$ec_lang['lpn_settings_runbox_tip']='एक बॉक्स जो बताता है कि रन कितनी दूर तक पहुँचा और उसने क्या पाया। इसे बंद करने पर, पूरा हुआ रन उसी बात को कुछ सेकंड के लिए स्टेटस लाइन में बताता है। यह इस ब्राउज़र के लिए एक सेटिंग है, प्रोजेक्ट के लिए नहीं।';
$ec_lang['lpn_time_run_failed']='रन पूरा नहीं हुआ, इसलिए बाद के समय के लिए कोई परिणाम नहीं है।';
$ec_lang['lpn_time_run_report']='EPANET रन रिपोर्ट';
$ec_lang['lpn_time_run_report_copy']='कॉपी करें';
$ec_lang['lpn_time_run_report_copied']='कॉपी हो गया';
$ec_lang['lpn_time_run_report_tip']='EPANET सॉल्वर ने पिछले रन के बारे में स्वयं जो छापा: क्या यह अभिसरित हुआ, और इसने किस बारे में चेतावनी दी। यह सॉल्वर का अपना पाठ है, हमारा नहीं।';

$ec_lang['lpn_time_speed']='गति';
$ec_lang['lpn_time_speed_tip']='प्लेबैक गति';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='सेटिंग्स खोजें';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='एक या अधिक शब्द टाइप करें ताकि केवल वे सेटिंग्स दिखें जिनमें वे सभी शब्द आते हैं।';
$ec_lang['lpn_settings_no_match']='किसी भी सेटिंग में वह शब्द नहीं है।';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Settings सेक्शन सूची की चौड़ाई';
$ec_lang['lpn_rpane_empty']='यहाँ अभी कुछ भी डॉक नहीं है। पूरे प्रोजेक्ट से जुड़ी हर चीज़ Settings में है।';
$ec_lang['lpn_time_settings_open']='समय सेटिंग्स';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='विज़ुअलाइज़ेशन';
$ec_lang['lpn_settings_sec_map']='मानचित्र और पृष्ठ';
$ec_lang['lpn_settings_sec_assets']='तत्व';
$ec_lang['lpn_settings_sec_calculation']='गणना';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='ग्राहक';
$ec_lang['lpn_labels_customer_note']='एक ग्राहक लेबल यहाँ टिक किए गए मान दिखाता है। यह मानचित्र पर हर दूसरे लेबल के समान टेक्स्ट आकार में बनाया जाता है।';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='ग्राहक लेबल केवल तभी बनाए जाते हैं जब मानचित्र दृश्य इतना चौड़ा या इससे संकरा हो। हर ज़ूम पर उन्हें बनाने के लिए बॉक्स को खाली छोड़ें। किसी भी ज़ूम पर ग्राहक लेबल कभी न बनाने के लिए 0 टाइप करें। यदि यह सभी लेबल के लिए समान सेटिंग से बड़ा है तो इसका कोई प्रभाव नहीं पड़ता।';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='वर्तमान दृश्य उपयोग करें';
$ec_lang['lpn_settings_page']='पृष्ठ';
$ec_lang['lpn_settings_page_note']='इस कैलकुलेटर में सहेजा गया, प्रोजेक्ट में नहीं।';
$ec_lang['lpn_settings_hydraulics']='हाइड्रॉलिक्स';
$ec_lang['lpn_settings_quality']='जल गुणवत्ता';
$ec_lang['lpn_settings_quality_track']='गुणवत्ता पैरामीटर';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='चुनें कि रन को पाइपों में होकर क्या खोजना चाहिए: पानी सिस्टम में कब से है, यह कहाँ से आया, या यात्रा के दौरान प्रतिक्रिया करने वाला कोई रसायन। केवल रसायन को गुणांकों की ज़रूरत होती है।';
$ec_lang['lpn_settings_quality_source']='अनुरेखण नोड';
$ec_lang['lpn_settings_quality_source_tip']='वह नोड जिसके पानी का अनुरेखण किया जाता है। इसके बाद हर दूसरा नोड यह दिखाता है कि उसके पानी का कितना हिस्सा उस नोड से आया।';
$ec_lang['lpn_quality_none']='कुछ नहीं';
$ec_lang['lpn_quality_trace']='स्रोत अनुरेखण';
$ec_lang['lpn_quality_chemical']='एक रसायन जो प्रतिक्रिया करता है';
$ec_lang['lpn_quality_needs_run']='जल गुणवत्ता समय के साथ पाइपों में साथ ले जाई जाती है, इसलिए इसके लिए EPANET इंजन और कुल रन समय चाहिए। Time के अंतर्गत एक Total run time सेट करें, फिर Calculate बटन दबाएँ।';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='रसायन और इकाइयाँ';
$ec_lang['lpn_quality_chemical_name_tip']='वह रसायन जिसे आप ट्रैक कर रहे हैं, उदाहरण के लिए क्लोरीन। EPANET के अपने डिफ़ॉल्ट लेबल, Chemical, के लिए इसे खाली छोड़ दें। यह आपकी रिपोर्ट में दिखता है, लेकिन गणनाओं में उपयोग नहीं होता।';
$ec_lang['lpn_quality_mass_units']='द्रव्यमान इकाइयाँ';
$ec_lang['lpn_quality_mass_units_tip']='गुणवत्ता प्रविष्टि का इकाई भाग, EPANET के अपने दो विकल्प।';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='गुणवत्ता सहनशीलता';
$ec_lang['lpn_quality_tolerance_tip']='जल के दो सटे हुए हिस्से सांद्रता में कितना भिन्न हो सकते हैं इससे पहले कि EPANET उन्हें एक मान ले। खाली छोड़ने पर EPANET का अपना डिफ़ॉल्ट 0.01 उपयोग होता है।';
$ec_lang['lpn_quality_diffusivity']='सापेक्ष विसरणशीलता';
$ec_lang['lpn_quality_diffusivity_tip']='रसायन जल में क्लोरीन के सापेक्ष कितनी आसानी से फैलता है। खाली छोड़ने पर EPANET का अपना डिफ़ॉल्ट 1.0 उपयोग होता है।';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='{chemical} सांद्रता';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='औसत {chemical} सांद्रता';
$ec_lang['lpn_quality_initial']='आरंभिक गुणवत्ता';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='रन शुरू होने पर यह नोड कितना रसायन रखता है। जलाशय पूरे रन के लिए अपना ही मान रखता है, जो कि उपचार संयंत्र से निकलने वाले अवशेष को सामान्यतः इसी तरह बताया जाता है। इसे खाली छोड़ें तो नोड बिना किसी रसायन के शुरू होता है।';
$ec_lang['lpn_result_concentration']='सांद्रता';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='यात्रा करने और प्रतिक्रिया करने के बाद इस बिंदु पर कितना रसायन बचा है। इकाइयाँ वे हैं जो Settings, Water quality के अंतर्गत रसायन के साथ बताई गई हैं।';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='स्रोत प्रकार';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='यह नोड अपने से गुज़रने वाले पानी पर किस तरह की डोज़ लगाता है। Concentration यहाँ नेटवर्क में प्रवेश करने वाले पानी को Source quality मान पर पहुँचा हुआ मानता है। Mass booster प्रवाह चाहे जो भी हो, हर मिनट रसायन का एक द्रव्यमान जोड़ता है। Setpoint booster इस नोड से निकलने वाली सांद्रता को Source quality मान तक उठाता है, उससे आगे नहीं। Flow-paced booster पानी में पहले से मौजूद मात्रा में Source quality मान जोड़ता है।';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='कुछ नहीं';
$ec_lang['lpn_source_type_concen']='सांद्रता';
$ec_lang['lpn_source_type_mass']='द्रव्यमान बूस्टर';
$ec_lang['lpn_source_type_setpoint']='सेटपॉइंट बूस्टर';
$ec_lang['lpn_source_type_flowpaced']='प्रवाह-गति बूस्टर';
$ec_lang['lpn_source_quality']='स्रोत गुणवत्ता';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='डोज़ कितनी तेज़ है। Mass booster को छोड़कर हर प्रकार के लिए यह एक सांद्रता है, उन इकाइयों में जो Settings, Water quality के अंतर्गत रसायन के साथ बताई गई हैं; Mass booster के लिए यह प्रति मिनट रसायन का एक द्रव्यमान है। इसे खाली छोड़ें तो यहाँ कुछ नहीं जोड़ा जाता, जो शून्य के समान नहीं है: शून्य का अर्थ है कि फ़ीड चल रही है और कुछ नहीं जोड़ रही।';
$ec_lang['lpn_source_pattern']='स्रोत पैटर्न';
$ec_lang['lpn_source_pattern_tip']='एक समय पैटर्न जो रन के दौरान डोज़ को मापता है, ऐसी फ़ीड के लिए जो स्थिर नहीं है। कोई पैटर्न न होने का अर्थ है कि डोज़ हर चरण पर समान है।';
$ec_lang['lpn_mixing_model']='मिश्रण मॉडल';
$ec_lang['lpn_mixing_model_tip']='इस टैंक में पहले से मौजूद पानी आने वाले पानी से कैसे मिलता है। Complete mixing पूरे टैंक को एक साथ मिला देता है। Two-compartment mixing पहले एक इनलेट क्षेत्र भरता है और बाकी को आगे बढ़ाता है। FIFO plug flow पानी को उसी क्रम में आगे ले जाता है जिस क्रम में वह आया। LIFO plug flow उसे परतों में रखता है, इसलिए अंदर आया अंतिम पानी सबसे पहले बाहर जाता है। यह चुनाव जल आयु और अवशेष को बदलता है, और यह किसी दाब या प्रवाह को नहीं बदलता।';
$ec_lang['lpn_mixing_mixed']='पूर्ण मिश्रण';
$ec_lang['lpn_mixing_2comp']='द्वि-कक्ष मिश्रण';
$ec_lang['lpn_mixing_fifo']='FIFO प्लग प्रवाह';
$ec_lang['lpn_mixing_lifo']='LIFO प्लग प्रवाह';
$ec_lang['lpn_mixing_fraction']='मिश्रण अंश';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='टैंक आयतन का वह हिस्सा जो इनलेट क्षेत्र घेरता है, 0 और 1 के बीच। इसे केवल Two-compartment mixing उपयोग करता है। इसे खाली छोड़ें तो पूरा टैंक इनलेट क्षेत्र माना जाता है, जो कि EPANET भी यही मानता है।';
$ec_lang['lpn_reaction_bulk']='थोक प्रतिक्रिया गुणांक';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='पानी के मुख्य भाग में होने वाली प्रतिक्रिया, हर उस पाइप के लिए उपयोग होती है जिसका अपना गुणांक नहीं है। ऋणात्मक संख्या रसायन को क्षीण करती है और धनात्मक संख्या उसे बढ़ाती है। जब तक कोई आयातित EPANET फ़ाइल कोई और कोटि न बताए, प्रतिक्रिया प्रथम कोटि की होती है, इसलिए गुणांक 1/day में एक दर है। खाली बॉक्स का अर्थ है कोई थोक प्रतिक्रिया नहीं।';
$ec_lang['lpn_reaction_wall']='दीवार प्रतिक्रिया गुणांक';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='पाइप की दीवार पर होने वाली प्रतिक्रिया, हर उस पाइप के लिए उपयोग होती है जिसका अपना गुणांक नहीं है। ऋणात्मक संख्या रसायन को क्षीण करती है। जब तक कोई आयातित EPANET फ़ाइल कोई और कोटि न बताए, प्रतिक्रिया प्रथम कोटि की होती है, इसलिए गुणांक प्रोजेक्ट की लंबाई इकाई में प्रति दिन एक लंबाई है। खाली बॉक्स का अर्थ है कोई दीवार प्रतिक्रिया नहीं।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='यह पाइप अपने आप में। इसे खाली छोड़ें तो पाइप Settings, Water quality के अंतर्गत पूरे नेटवर्क के लिए तय गुणांक उपयोग करता है।';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='प्रतिक्रिया गुणांक';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='इस टैंक में रखे पानी में होने वाली प्रतिक्रिया, 1/day में एक दर के रूप में। ऋणात्मक संख्या रसायन को क्षीण करती है और धनात्मक संख्या उसे बढ़ाती है। पानी किसी भी पाइप की तुलना में टैंक में कहीं अधिक समय तक रुका रहता है, इसलिए अक्सर यहीं अवशेष खो जाता है। इसे खाली छोड़ें तो टैंक Settings, Water quality के अंतर्गत पूरे नेटवर्क के लिए तय थोक प्रतिक्रिया गुणांक उपयोग करता है।';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='थोक प्रतिक्रिया';
$ec_lang['lpn_reaction_wall_short']='दीवार प्रतिक्रिया';
$ec_lang['lpn_reaction_tank_short']='प्रतिक्रिया';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/दिन';
$ec_lang['lpn_reaction_day']='दिन';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='थोक प्रतिक्रिया कोटि';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='वह घातांक जिस तक पानी के मुख्य भाग में प्रतिक्रिया के लिए सांद्रता बढ़ाई जाती है। कोई भी वास्तविक संख्या मान्य है। 1 डिफ़ॉल्ट मान है और अधिकांश क्लोरीन क्षय मॉडलिंग के लिए उपयोग होता है। 0 दर को इस बात से स्वतंत्र बना देता है कि वहाँ कितना रसायन है।';
$ec_lang['lpn_reaction_order_tank']='टैंक प्रतिक्रिया कोटि';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='वह घातांक जिस तक टैंक में रखे पानी में प्रतिक्रिया के लिए सांद्रता बढ़ाई जाती है, थोक प्रतिक्रिया कोटि से अलग, ताकि टैंक पाइपों से भिन्न कोटि पर प्रतिक्रिया कर सके। कोई भी वास्तविक संख्या मान्य है, और 1 डिफ़ॉल्ट है। EPANET इसे फ़ाइल में ORDER TANK के रूप में बताता है और अपने ही इंटरफ़ेस में इसके लिए कोई बॉक्स नहीं देता।';
$ec_lang['lpn_reaction_order_wall']='दीवार प्रतिक्रिया कोटि';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 का अर्थ है कि दिए गए गुणांक(गुणांकों) के अनुसार दीवार प्रतिक्रिया होती है। 0 का अर्थ है कि नहीं होती। यह एक ऑन और ऑफ स्विच है। डिफ़ॉल्ट मान 1 है।';
$ec_lang['lpn_reaction_order_unstated']='नहीं बताया गया';
$ec_lang['lpn_reaction_order_zero']='0, शून्य कोटि';
$ec_lang['lpn_reaction_order_first']='1, प्रथम कोटि';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='सीमित सांद्रता';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='एक सांद्रता जिसकी ओर रसायन बढ़ता है, न कि शून्य तक क्षीण होने या असीमित बढ़ने की ओर। जैसे-जैसे पानी इसके करीब पहुँचता है, प्रतिक्रिया धीमी होती जाती है और वहीं रुक जाती है। सुसंगत इकाइयाँ उपयोग करें। खाली छोड़ने पर कोई सीमा नहीं है।';
$ec_lang['lpn_reaction_rough_corr']='खुरदरापन सहसंबंध';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='दीवार प्रतिक्रिया को हर पाइप के अपने खुरदरापन से सहसंबंधित करता है, ताकि अधिक खुरदरा पाइप तेज़ी से प्रतिक्रिया करे। जब यह सेट होता है, तो हर पाइप के लिए उसके खुरदरापन से एक दीवार गुणांक निकाला जाता है, और ऊपर दिया एकल दीवार गुणांक अब उपयोग नहीं होता। खाली छोड़ने पर उपयोग नहीं होता।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='यह पृष्ठ अपनी ओर से कोई प्रतिक्रिया गुणांक नहीं देता। इसके लिए कोई मानक परीक्षण नहीं है, और एक ही तरह के पानी के लिए प्रकाशित क्षेत्र मान दस गुने तक भिन्न होते हैं, इसलिए यहाँ दिया गया कोई मान सुझाव के रूप में पढ़ा जाएगा। वह मान दर्ज करें जो आपने मापा है या जिसका आप हवाला दे सकते हैं, या ऐसे रसायन के लिए जो प्रतिक्रिया नहीं करता, बॉक्स खाली छोड़ दें।';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='ऊर्जा';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='रिपोर्ट';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='पंपिंग ऊर्जा लागत, परिदृश्यों की तुलना, EPANET सॉल्वर रिपोर्ट, मापे गए डेटा के विरुद्ध कैलिब्रेशन की रिपोर्टें, और विस्तारित अवधि सिमुलेशन के बाद स्थिति रिपोर्ट और पूर्ण रिपोर्ट।';
$ec_lang['lpn_reports_epanet']='EPANET रन';
$ec_lang['lpn_energy_title']='पंप ऊर्जा रिपोर्ट';
$ec_lang['lpn_energy_menu']='पंप ऊर्जा';
$ec_lang['lpn_energy_menu_tip']='पिछली विस्तारित अवधि सिमुलेशन में हर पंप कितने समय चला, उसने कितनी शक्ति खींची और उसकी लागत क्या रही।';
$ec_lang['lpn_energy_efficiency']='पंप दक्षता (प्रतिशत)';
$ec_lang['lpn_energy_efficiency_tip']='हर उस पंप के लिए उपयोग होने वाली वायर-टू-वॉटर दक्षता जिसका अपना दक्षता कर्व नहीं है। जब कुछ न बताया जाए तो EPANET 75 प्रतिशत उपयोग करता है।';
$ec_lang['lpn_energy_price']='बिजली की कीमत';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='एक किलोवाट घंटे की लागत क्या है। यह हर उस पंप पर लागू होती है जिसकी अपनी कीमत नहीं है। इसे खाली छोड़ें तो रिपोर्ट की हर लागत शून्य होती है।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='इस पंप पर एक किलोवाट घंटे की लागत क्या है। इसे खाली छोड़ें तो पंप Settings, Energy के अंतर्गत पूरे नेटवर्क के लिए तय कीमत चुकाता है।';
$ec_lang['lpn_energy_price_pattern']='कीमत पैटर्न';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='एक पैटर्न जो हर पैटर्न-चरण पर कीमत को गुणा करता है, जिससे ऑफ-पीक दर बताई जाती है। पूरे रन में एक ही कीमत के लिए इसे खाली छोड़ दें।';
$ec_lang['lpn_energy_demand_charge']='पीक माँग शुल्क';
$ec_lang['lpn_energy_demand_charge_tip']='सिस्टम के पंपों द्वारा माँगे गए पीक लोड के लिए उपयोगिता प्रति kW क्या शुल्क लेती है।';
$ec_lang['lpn_energy_currency']='मुद्रा';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='यहाँ जो भी आप लिखते हैं वह हर धनराशि के साथ छापा जाता है। यह एक लेबल है। कीमतें और लागतें कभी परिवर्तित नहीं की जातीं, इसलिए कीमतें उसी मुद्रा में लिखें जो आपने यहाँ लिखी है।';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='यह पृष्ठ अपनी ओर से कोई कीमत नहीं देता। बिजली की लागत उपयोगिता, देश, घंटे और वर्ष पर निर्भर करती है, इसलिए यहाँ दिया गया कोई मान सुझाव के रूप में पढ़ा जाएगा। अपने ही टैरिफ़ से कीमत दर्ज करें।';
$ec_lang['lpn_energy_needs_run']='पंप ऊर्जा, रन के दौरान शक्ति का समाकलन है, इसलिए इसके लिए विस्तारित अवधि सिमुलेशन चाहिए: EPANET इंजन और कुल रन समय। Settings, Calculation, Time में एक Total run time सेट करें, Calculate बटन दबाएँ, फिर Water, Reports, Pump energy खोलें।';
$ec_lang['lpn_energy_no_pumps']='इस नेटवर्क में कोई पंप नहीं है, इसलिए बिजली खींचने वाला कुछ भी नहीं है।';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='परिदृश्य तुलना';
$ec_lang['lpn_scncmp_menu_tip']='इस प्रोजेक्ट के हर परिदृश्य को हल करें और उन्हें साथ-साथ पढ़ें: हर एक में न्यूनतम दाब और अधिकतम वेग।';
$ec_lang['lpn_scncmp_running']='हर परिदृश्य हल किया जा रहा है…';
$ec_lang['lpn_scncmp_empty']='अभी तक कुछ नहीं खींचा गया है, इसलिए हल करने के लिए कुछ नहीं है।';
$ec_lang['lpn_scncmp_col_maxvelocity']='अधिकतम वेग';
$ec_lang['lpn_scncmp_at']='{id} पर {value}';
$ec_lang['lpn_scncmp_current']='(अभी खुला हुआ)';
$ec_lang['lpn_scncmp_note']='हर परिदृश्य ड्रॉइंग की एक प्रति से हल किया जाता है। यहाँ कुछ भी प्रोजेक्ट को नहीं बदलता, और जिस परिदृश्य में आप काम कर रहे हैं वह वैसा ही रहता है जैसा था।';
$ec_lang['lpn_energy_over']='{time} की विस्तारित अवधि सिमुलेशन के लिए';
$ec_lang['lpn_energy_col_pump']='पंप';
$ec_lang['lpn_energy_col_running']='रन का %';
$ec_lang['lpn_energy_col_effic']='दक्षता';
$ec_lang['lpn_energy_col_avg_kw']='औसत kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='जब यह पंप चल रहा था तब उपयोग हुई औसत शक्ति। यह निष्क्रिय अवधियों में औसत नहीं की जाती, इसलिए जो पंप विस्तारित अवधि सिमुलेशन के अधिकांश समय निष्क्रिय रहा वह भी उतनी ही शक्ति दिखाता है जो उसने चलते समय उपयोग की।';
$ec_lang['lpn_energy_col_peak_kw']='पीक kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='लागत';
$ec_lang['lpn_energy_total_kwh']='उपयोग हुई ऊर्जा';
$ec_lang['lpn_energy_total_energy_cost']='ऊर्जा की लागत';
$ec_lang['lpn_energy_peak_kw']='पीक बिजली उपयोग';
$ec_lang['lpn_energy_total_demand_charge']='पीक माँग की लागत';
$ec_lang['lpn_energy_total_cost']='कुल लागत';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='स्थिति';
$ec_lang['lpn_reports_status_tip']='पिछले विस्तारित अवधि सिमुलेशन के दौरान क्या बदला, समय क्रम में: पंप और वाल्व का खुलना या बंद होना, टैंकों का भरना, खाली होना, भर जाना या सूख जाना, और वे चरण जो पूरी तरह अभिसरित नहीं हुए।';
$ec_lang['lpn_status_title']='स्थिति रिपोर्ट';
$ec_lang['lpn_status_needs_run']='स्थिति रिपोर्ट सूचीबद्ध करती है कि विस्तारित अवधि सिमुलेशन के दौरान क्या बदला। Settings, Calculation, Time में एक Total run time सेट करें, Calculate दबाएँ, फिर Water, Reports, Status report खोलें।';
$ec_lang['lpn_status_empty']='इस रन के दौरान किसी की स्थिति नहीं बदली।';
$ec_lang['lpn_status_col_event']='घटना';
$ec_lang['lpn_status_opened']='{type} {id} अब खुला है';
$ec_lang['lpn_status_closed']='{type} {id} अब बंद है';
$ec_lang['lpn_status_filling']='{type} {id} अब भर रहा है';
$ec_lang['lpn_status_emptying']='{type} {id} अब खाली हो रहा है';
$ec_lang['lpn_status_full']='{type} {id} अब भरा है';
$ec_lang['lpn_status_dry']='{type} {id} अब खाली है';
$ec_lang['lpn_status_no_converge']='इस चरण में हाइड्रॉलिक हल पूरी तरह अभिसरित नहीं हुआ; दिखाई गई संख्याएँ इसकी अंतिम पुनरावृत्ति की हैं।';
$ec_lang['lpn_status_note']='उसी विस्तारित अवधि रन से पढ़ा गया है जैसा Tables पैनल और Full report। केवल एक बदलाव सूचीबद्ध होता है, हर चरण नहीं।';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='पूर्ण';
$ec_lang['lpn_reports_full_tip']='पिछले रन के हर रिपोर्टिंग समय-चरण पर हर नोड और हर लिंक, एक तालिका के रूप में जिसे आप डाउनलोड या प्रिंट कर सकते हैं।';
$ec_lang['lpn_full_title']='पूर्ण रिपोर्ट';
$ec_lang['lpn_full_needs_run']='पूर्ण रिपोर्ट हर रिपोर्टिंग समय-चरण पर हर नोड और हर लिंक सूचीबद्ध करती है। Calculate दबाएँ, फिर Water, Reports, Full report खोलें।';
$ec_lang['lpn_full_note']='प्रति रिपोर्टिंग समय-चरण प्रति नोड या लिंक एक पंक्ति, उन्हीं इकाइयों में जो Tables पैनल पर दिखती हैं। एक खाली सेल वह कॉलम है जिसकी वह मात्रा नहीं होती। डाउनलोड या प्रिंट हर समय-चरण को ले जाता है; नीचे की तालिका एक बार में एक दिखाती है।';
$ec_lang['lpn_full_step_label']='समय-चरण';
$ec_lang['lpn_full_download_csv']='CSV डाउनलोड करें';
$ec_lang['lpn_full_print']='रिपोर्ट प्रिंट करें';
$ec_lang['lpn_full_col_time']='समय';
$ec_lang['lpn_full_col_type']='प्रकार';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} पंक्तियाँ।';
$ec_lang['lpn_energy_no_price']='बिजली की कोई कीमत नहीं बताई गई है, इसलिए यहाँ हर लागत शून्य है। इसे Settings, Energy के अंतर्गत सेट करें।';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='यह नेटवर्क शून्य की कीमत बताता है, इसलिए यहाँ हर लागत शून्य है। इसे Settings, Energy के अंतर्गत बदलें।';
$ec_lang['lpn_energy_curve_note']='ये पंप एक ऐसे दक्षता कर्व को बुलाते हैं जिसमें कोई बिंदु नहीं है: {ids}। ये पूरे नेटवर्क के लिए तय दक्षता पर चले।';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_rank']='क्रम';
$ec_lang['lpn_labels_col_drop']='छोड़ें';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='नोड और लिंक';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='समान अंतराल';
$ec_lang['lpn_color_mode_quantile']='क्वांटाइल (समान संख्या)';
$ec_lang['lpn_color_mode_jenks']='प्राकृतिक विभाजन (Jenks)';
$ec_lang['lpn_color_mode_stddev']='मानक विचलन';
$ec_lang['lpn_color_mode_pretty']='सुघड़ (गोल)';
$ec_lang['lpn_color_mode_log']='लघुगणकीय';
$ec_lang['lpn_color_mode_manual']='मैन्युअल';

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
$ec_lang['lpn_library_menu']='लाइब्रेरी';
$ec_lang['lpn_library_menu_tip']='इस प्रोजेक्ट के लिए डिमांड पैटर्न, पंप कर्व और नियंत्रण नियमों का प्रबंधन करें।';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='पैटर्न';
$ec_lang['lpn_library_patterns_tip']='एक पैटर्न गुणकों की एक सूची है जो दोहराई जाती है। हर गुणक एक पैटर्न समय-चरण के लिए लागू होता है, इसलिए एक घंटे के चरण पर 24 संख्याएँ एक दिन बनाती हैं जो दोहराता है। 1.5 के गुणक के साथ 10 की डिमांड उस क्षण 15 होती है।';
$ec_lang['lpn_library_curves']='कर्व';
$ec_lang['lpn_library_curves_tip']='एक कर्व बिंदुओं की वह सूची है जो बताती है कि कोई चीज़ कैसा प्रदर्शन करती है: पंप हर प्रवाह पर कितना हेड जोड़ता है, वह उस प्रवाह पर कितना कुशल है, या वाल्व हर प्रवाह पर कितना हेड खोता है।';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='एक कर्व उस पंप या वाल्व का होता है जो उसका उपयोग करता है, इसलिए यह उन सबको एक जगह पढ़ने के लिए है। किसी ID पर क्लिक करके उस तत्व पर जाएँ और उसके बिंदु वहीं बदलें। पंप के लिए खींची गई रेखा वह कर्व है जिसका उपयोग रन करता है, बिंदुओं के अनुसार फ़िट की गई; वाल्व के लिए यह उनके बीच के सीधे चरण हैं।';
$ec_lang['lpn_library_curve_add']='एक कर्व जोड़ें';
$ec_lang['lpn_library_curve_type_tip']='यह कर्व क्या वर्णित करता है';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='कर्व प्रकार';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='समीकरण';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='बिंदुओं के अनुसार फ़िट किया गया कर्व, और नीचे दिए प्लॉट पर खींची गई रेखा। यह हर बार दिखाए जाने पर बिंदुओं से निकाला जाता है और कभी सहेजा नहीं जाता, और इसकी संख्याएँ ऊपर दी तालिका की इकाइयों में हैं। बिल्ट-इन सॉल्वर इसी समीकरण पर चलता है; EPANET इंजन स्वयं बिंदुओं को पढ़ता है।';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='स्प्रेडशीट में एक या दो कॉलम चुनें, उन्हें कॉपी करें, और जहाँ आप उन्हें रखना चाहते हैं उस पहली सेल में पेस्ट करें। ज़रूरत के अनुसार पंक्तियाँ जोड़ दी जाती हैं। आप EPANET फ़ाइल से सीधे कॉपी की गई पंक्तियाँ भी पेस्ट कर सकते हैं, जिसमें कर्व का नाम भी शामिल है।';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='विवरण';
$ec_lang['lpn_library_curve_note_tip']='यह कर्व क्या है, अपने ही शब्दों में। यह EPANET फ़ाइल में कर्व के ऊपर लिखा जाता है और वहीं से वापस पढ़ा जाता है।';
$ec_lang['lpn_library_curve_remove_point']='यह बिंदु हटाएँ';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='बिंदु कॉपी करें';
$ec_lang['lpn_library_curve_copy_tip']='हर बिंदु को दो कॉलम के रूप में कॉपी करता है, स्प्रेडशीट में पेस्ट करने के लिए तैयार।';
$ec_lang['lpn_library_curve_copy_manual']='ये बिंदु कॉपी करें';
$ec_lang['lpn_library_curve_used_by']='इस कर्व का उपयोग करने वाले तत्व';
$ec_lang['lpn_library_curve_unused']='कोई भी इस कर्व का उपयोग नहीं करता।';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='इस कर्व का उपयोग {count} तत्व करते हैं: {ids}। पहले उन्हें किसी अन्य कर्व की ओर इंगित करें, फिर इसे हटाएँ।';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='पाइप प्रकार';
$ec_lang['lpn_library_pipetypes_tip']='एक पाइप प्रकार एक परिभाषा है जिसे कई पाइप अपने व्यास, खुरदरापन और प्रतिक्रिया गुणांकों के लिए संदर्भित कर सकते हैं। परिभाषा संपादित करने पर उसका उपयोग करने वाला हर पाइप संपादित हो जाता है।';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='हर प्रोजेक्ट की अपनी पाइप प्रकार लाइब्रेरी होती है। आप पाइप प्रकार परिभाषा में गुण खाली छोड़ सकते हैं। उदाहरण के लिए, एक पाइप प्रकार जो खुरदरापन बताता है और व्यास नहीं, वह ठीक है। आप पाइपों को उनके गुण संपादक में पाइप प्रकार से जोड़ते हैं। यहाँ परिभाषा संपादित करने पर उसे संदर्भित करने वाला हर पाइप बदल जाता है।';
$ec_lang['lpn_library_pipetype_add']='एक पाइप प्रकार जोड़ें';
$ec_lang['lpn_library_pipetype_blank_tip']='पाइप प्रकार परिभाषा में खाली गुण हर पाइप के लिए अलग-अलग दर्ज किए जाने के लिए छोड़ दिए जाते हैं।';
$ec_lang['lpn_library_pipetype_used_by']='इस प्रकार का उपयोग करने वाले पाइप';
$ec_lang['lpn_library_pipetype_unused']='कुछ भी इस पाइप प्रकार का उपयोग नहीं करता।';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='इस पाइप प्रकार का उपयोग {count} पाइप करते हैं: {ids}। इसे हटाने से पहले उन्हें इससे अलग करें।';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='पाइप प्रकार';
$ec_lang['lpn_field_pipetype_tip']='प्रोजेक्ट लाइब्रेरी में वह पाइप प्रकार जिसका यह पाइप उपयोग करता है। पाइप प्रकार में शामिल गुण यहाँ संपादन के लिए अक्षम हैं। यहाँ संपादन सक्षम करने के लिए पाइप प्रकार को अलग करें।';
$ec_lang['lpn_pipetype_none']='कोई पाइप प्रकार चयनित नहीं';
$ec_lang['lpn_pipetype_detach']='पाइप प्रकार से अलग करें';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='यह पाइप अपने प्रकार से जो मान पढ़ता है, उन्हें पाइप में ही कॉपी कर देता है और प्रकार का उपयोग बंद कर देता है। पाइप के मान अभी नहीं बदलते, और अब से आप इन मानों को यहाँ संपादित कर सकते हैं।';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='फ़िटिंग';
$ec_lang['lpn_library_fittings_tip']='एक फ़िटिंग सूची फ़िटिंगों और उनकी मात्राओं का एक समूह है जिसे कई पाइप संदर्भित कर सकते हैं। यह जुड़कर एक स्थानीय हानि गुणांक बनाती है।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='हर प्रोजेक्ट की अपनी फ़िटिंग लाइब्रेरी होती है। एक फ़िटिंग सूची में हर फ़िटिंग की एक मात्रा होती है, और यह जुड़कर एक ही स्थानीय हानि गुणांक बनाती है। पाइप और पाइप प्रकार दोनों किसी सूची को संदर्भित कर सकते हैं।';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='यहाँ दी गई फ़िटिंगें EPANET 2.2 उपयोगकर्ता मैनुअल की तालिका 3.3 की तेरह फ़िटिंगें हैं। किसी एक को चुनने पर उसका गुणांक पंक्ति में कॉपी हो जाता है, जहाँ आप उसे बदल सकते हैं। एक गुणांक फ़िटिंग के आकार और बनावट पर निर्भर करता है, इसलिए इस तालिका को उत्तर के बजाय शुरुआती बिंदु मानें।';
$ec_lang['lpn_library_fittings_add']='एक फ़िटिंग सूची जोड़ें';
$ec_lang['lpn_library_fittings_used_by']='इस फ़िटिंग सूची का उपयोग करने वाले पाइप';
$ec_lang['lpn_library_fittings_unused']='कुछ भी इस फ़िटिंग सूची का उपयोग नहीं करता।';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='इस फ़िटिंग सूची का उपयोग {count} पाइप करते हैं: {ids}। इसे हटाने से पहले उन्हें इससे अलग करें।';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='लाइब्रेरी आयात करें…';
$ec_lang['lpn_library_import_tip']='कोई अन्य प्रोजेक्ट फ़ाइल चुनें और उससे पूरी लाइब्रेरी इस प्रोजेक्ट में कॉपी करें। जिसका नाम यहाँ पहले से लिया गया है उसे छोड़ दिया जाता है और सूचीबद्ध किया जाता है, ताकि आपके पास पहले से जो है वह न बदले।';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='{file} से कॉपी करने के लिए क्या चुनना है';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='आप जिस भी लाइब्रेरी को चेक करते हैं वह पूरी कॉपी होती है। बाद में जो नहीं चाहिए उसे उसी तरह हटाएँ जैसे आप कोई अन्य प्रविष्टि हटाते हैं।';
$ec_lang['lpn_library_import_go']='आयात करें';
$ec_lang['lpn_library_import_no_libraries']='उस प्रोजेक्ट फ़ाइल में कॉपी करने के लिए कोई लाइब्रेरी नहीं है।';
$ec_lang['lpn_library_import_heading']='{file} से आयातित';
$ec_lang['lpn_library_import_added']='कॉपी की गईं: {names}';
$ec_lang['lpn_library_import_conflict']='छोड़ी गईं, क्योंकि इस प्रोजेक्ट में पहले से उसी नाम की एक मौजूद है: {names}। यहाँ कुछ नहीं बदला गया। यदि आप दोनों चाहते हैं तो किसी एक का नाम बदलें और फिर से आयात करें।';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='उस प्रोजेक्ट फ़ाइल में इनमें से कॉपी करने के लिए कुछ भी नहीं है।';
$ec_lang['lpn_library_import_curve_shape']='ये कर्व ठीक वैसे ही आए जैसे फ़ाइल ने उन्हें लिखा था, और कोई रन इनमें से किसी का उपयोग तब तक नहीं कर सकता जब तक इसका पहला कॉलम हर बिंदु से अगले तक न बढ़े: {names}';
$ec_lang['lpn_library_import_needs_fittings']='ये पाइप प्रकार एक फ़िटिंग सूची का संदर्भ देते हैं जो इस प्रोजेक्ट में नहीं है: {names}। उसी फ़ाइल से फ़िटिंग लाइब्रेरी आयात करें और वे उसे पा लेंगे।';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='चेतावनी: इकाइयाँ मेल नहीं खातीं। जैसा है वैसा आयात किया जाएगा। अनुशंसित नहीं।';
$ec_lang['lpn_library_import_units_line']='{name}: यह प्रोजेक्ट {mine} दिखाता है, फ़ाइल {theirs} दिखाती है।';
$ec_lang['lpn_fitting_qty']='मात्रा';
$ec_lang['lpn_fitting_name']='फ़िटिंग';
$ec_lang['lpn_fitting_k']='गुणांक';
$ec_lang['lpn_fitting_add']='एक फ़िटिंग जोड़ें';
$ec_lang['lpn_fitting_remove']='हटाएँ';
$ec_lang['lpn_fitting_total']='कुल स्थानीय हानि गुणांक, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='फ़िटिंग सूची';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='प्रोजेक्ट लाइब्रेरी से फ़िटिंगों की एक सूची। इसकी मात्राएँ और गुणांक जुड़कर इस पाइप का स्थानीय हानि गुणांक बनाते हैं, और फिर गुणांक बॉक्स केवल पढ़ने योग्य रह जाता है। गुणांक स्वयं टाइप करने के लिए इसे अचयनित छोड़ें।';
$ec_lang['lpn_fittings_none']='कोई फ़िटिंग सूची चयनित नहीं';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='ग्लोब वाल्व, पूर्ण खुला';
$ec_lang['lpn_fitting_angle']='एंगल वाल्व, पूर्ण खुला';
$ec_lang['lpn_fitting_swingcheck']='स्विंग चेक वाल्व, पूर्ण खुला';
$ec_lang['lpn_fitting_gate']='गेट वाल्व, पूर्ण खुला';
$ec_lang['lpn_fitting_elbow_short']='लघु त्रिज्या एल्बो';
$ec_lang['lpn_fitting_elbow_medium']='मध्यम त्रिज्या एल्बो';
$ec_lang['lpn_fitting_elbow_long']='दीर्घ त्रिज्या एल्बो';
$ec_lang['lpn_fitting_elbow_45']='45 डिग्री एल्बो';
$ec_lang['lpn_fitting_return_bend']='बंद रिटर्न बेंड';
$ec_lang['lpn_fitting_tee_run']='मानक टी, रन से होकर प्रवाह';
$ec_lang['lpn_fitting_tee_branch']='मानक टी, शाखा से होकर प्रवाह';
$ec_lang['lpn_fitting_entrance']='वर्गाकार प्रवेश';
$ec_lang['lpn_fitting_exit']='निकास';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='अन्य फ़िटिंग';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='{file} सहेजा गया';
$ec_lang['lpn_inp_export_flat_lead']='निर्यातित EPANET फ़ाइल संख्यात्मक रूप से इस प्रोजेक्ट के बराबर है। लेकिन इसमें निम्नलिखित चीज़ों के लिए कोई स्थान नहीं है:';
$ec_lang['lpn_inp_export_flat_types']='यहाँ {n} पाइप {t} पाइप प्रकारों को संदर्भित करते हैं। फ़ाइल में उन पाइपों में से हर एक संख्याओं की अपनी प्रति रखता है, इसलिए उत्तर वही रहते हैं। फ़ाइल जो नहीं रख सकती वह है पाइप प्रकार स्वयं, इसलिए एक परिभाषा संपादित करने पर हर पाइप का उसका अनुसरण करना केवल आपकी अपनी प्रोजेक्ट फ़ाइल में दर्ज होता है।';
$ec_lang['lpn_inp_export_flat_coords']='EPANET फ़ाइल हर नोड के लिए एक स्थिति रखती है। यह परिदृश्य उनमें से {n} को कहीं और रखता है, और वे ही फ़ाइल में स्थितियाँ हैं। हर दूसरा परिदृश्य अपनी स्थितियाँ केवल आपकी प्रोजेक्ट फ़ाइल में ही रखता है।';
$ec_lang['lpn_inp_export_flat_fittings']='एक EPANET फ़ाइल आपकी प्रोजेक्ट फ़ाइल में मौजूद एल्बो, वाल्व और टी की सूची नहीं रख सकती। यहाँ {n} पाइपों का स्थानीय हानि गुणांक एक फ़िटिंग सूची से जोड़ा गया है। कुल जस का तस फ़ाइल में जाता है, इसलिए उत्तरों में कुछ नहीं बदलता।';
$ec_lang['lpn_library_controls']='नियंत्रण';
$ec_lang['lpn_library_controls_tip']='एक नियंत्रण एक वाक्य है जो किसी लिंक को खोलता या बंद करता है, या उसे कोई सेटिंग देता है, जब कोई जल-स्तर, कोई दाब या कोई समय ऐसा कहता है।';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='पैटर्न जोड़ें';
$ec_lang['lpn_library_pattern_values']='गुणक';
$ec_lang['lpn_library_pattern_values_tip']='गुणक, स्पेस या कॉमा से अलग किए हुए। यदि आपके पास स्प्रेडशीट का कोई कॉलम है तो उसे पेस्ट करें। यह सूची पूरे रन के दौरान दोहराती रहती है, इसलिए इसे पूरे रन को कवर करने की ज़रूरत नहीं है।';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} गुणक, {step} की दूरी पर, {span} को कवर करते हुए';
$ec_lang['lpn_library_pattern_none']='कोई पैटर्न नहीं';
$ec_lang['lpn_settings_default_pattern']='डिफ़ॉल्ट डिमांड पैटर्न';
$ec_lang['lpn_settings_default_pattern_tip']='बिना पैटर्न वाला हर जंक्शन इसी का उपयोग करता है।';
$ec_lang['lpn_library_control_add']='नियंत्रण जोड़ें';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='एक वाक्य, EPANET के शब्दों में। चार रूप: LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1, और LINK 12 CLOSED AT CLOCKTIME 3 AM। OPEN या CLOSED की जगह आप एक संख्या लिख सकते हैं, जो वाल्व सेटिंग या पंप गति है। कीवर्ड अंग्रेज़ी में ही रहने दें; यह पृष्ठ इन्हें ही पढ़ता है।';
$ec_lang['lpn_library_control_ok']='✓ समझ लिया गया';
$ec_lang['lpn_library_control_bad']='⚠ समझ में नहीं आया';
$ec_lang['lpn_library_control_missing']='⚠ इस नेटवर्क में {id} नाम की कोई चीज़ नहीं है';
$ec_lang['lpn_library_rules']='नियम';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='एक नियम एक छोटा अनुच्छेद है जो किसी लिंक को खोलता या बंद करता है, या उसे एक सेटिंग देता है, जब जल-स्तर, दाब, प्रवाह या समय आपके तय किए मान तक पहुँचता है। नियम एक साथ एक से अधिक चीज़ों की जाँच कर सकते हैं, और यह भी बता सकते हैं कि जाँच विफल होने पर क्या किया जाए।';
$ec_lang['lpn_library_rule_add']='एक नियम जोड़ें';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='एक नियम, EPANET के अपने शब्दों में, हर पंक्ति में एक उपवाक्य (क्लॉज़)। पहली पंक्ति उसे नाम देती है: RULE 1। फिर एक शर्त: IF TANK 2 LEVEL BELOW 17.1। फिर उसके बारे में क्या करना है: THEN PUMP 9 STATUS IS OPEN। अंतिम पंक्ति उसे क्रम दे सकती है: PRIORITY 1। एक से अधिक चीज़ों की जाँच के लिए AND या OR पंक्तियाँ जोड़ें, और जाँच विफल होने पर क्या करना है यह बताने के लिए ELSE पंक्तियाँ जोड़ें। एक शर्त किसी नोड पर LEVEL, HEAD, GRADE, PRESSURE या DEMAND पढ़ सकती है, किसी लिंक पर FLOW, STATUS या SETTING, या SYSTEM पर TIME और CLOCKTIME। संख्याएँ इस प्रोजेक्ट में दिखाई जा रही इकाइयों में लिखें; वे आपके लिए परिवर्तित की जाती हैं। कीवर्ड अंग्रेज़ी में ही रहने दें; यही वे शब्द हैं जिन्हें यह पृष्ठ और EPANET पढ़ते हैं।';
$ec_lang['lpn_library_rule_ok']='✓ यह नियम पढ़ा गया';
$ec_lang['lpn_library_rule_bad']='⚠ यह नियम पढ़ा नहीं जा सका';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='आधार माँग';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='दिखाए गए समय-चरण पर यह नोड जो प्रवाह खींचता है: हर आधार माँग को अपने पैटर्न से गुणा करके, सबको जोड़ा गया। यह परिकलित है, टाइप नहीं किया गया, इसलिए यह घड़ी के साथ बदलता है और इसे संपादित नहीं किया जा सकता।';
$ec_lang['lpn_field_demand_pattern']='डिमांड पैटर्न';
$ec_lang['lpn_field_demand_pattern_tip']='यह जंक्शन की माँग रन के दौरान कैसे ऊपर-नीचे होती है। इसे कोई पैटर्न नहीं पर छोड़ें और जंक्शन इसके बजाय प्रोजेक्ट के Default Pattern का पालन करेगा।';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='विवरण';
$ec_lang['lpn_field_demand_category_tip']='इस माँग श्रेणी का नाम या विवरण।';
$ec_lang['lpn_demand_add']='माँग श्रेणी जोड़ें';
$ec_lang['lpn_demand_add_tip']='इस जंक्शन पर एक और माँग श्रेणी जोड़ें, जिसकी अपनी आधार माँग, पैटर्न और विवरण हो। श्रेणियाँ जुड़ जाती हैं।';
$ec_lang['lpn_demand_remove']='यह माँग हटाएँ';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='हेड पैटर्न';
$ec_lang['lpn_field_head_pattern_tip']='इस जलाशय का जल-स्तर रन के दौरान कैसे ऊपर-नीचे होता है। ऊपर दिए गए हेड को पैटर्न से गुणा किया जाता है।';
$ec_lang['lpn_field_pump_speed']='सापेक्ष गति';
$ec_lang['lpn_field_pump_speed_tip']='1 का अर्थ है यह पंप उसी गति पर चल रहा है जिस पर उसका कर्व मापा गया था। 0.9 का अर्थ है वही पंप धीमा चल रहा है, जिससे यह जो हेड जोड़ता है और जो प्रवाह पास करता है, दोनों घट जाते हैं। रन के दौरान गति पैटर्न इस संख्या की जगह ले लेता है।';
$ec_lang['lpn_field_speed_pattern']='गति पैटर्न';
$ec_lang['lpn_field_speed_pattern_tip']='इस पंप की गति रन के दौरान कैसे ऊपर-नीचे होती है। हर गुणक उस भाग की सापेक्ष गति है, और यह सापेक्ष गति की जगह लेता है, न कि उसे मापता है, इसलिए 0 का गुणक पंप को रोक देता है।';

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
$ec_lang['lpn_search_menu']='नाम से कोई जगह खोजें…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='किसी शहर, पते या स्थल को नाम से खोजें और मानचित्र को वहाँ ले जाएँ। पहली बार उपयोग करने पर आपकी अनुमति माँगी जाती है, क्योंकि आपके टाइप किए शब्द OpenStreetMap की जगह-नाम सेवा को भेजे जाते हैं।';
$ec_lang['lpn_search_bar']='नाम से खोजें…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='जगह के नाम से खोजना आपके टाइप किए शब्दों को nominatim.openstreetmap.org को भेजता है, जो OpenStreetMap Foundation की मुफ़्त जगह-नाम सेवा है।';
$ec_lang['lpn_search_consent_2']='यह आपके प्रोजेक्ट के पीछे दिख रहे सड़क-मानचित्र चित्रों से अलग सेवा है। वे चित्र केवल यह बताते हैं कि आप कहाँ देख रहे हैं। एक खोज यह बताती है कि आपने क्या टाइप किया। जगह-नाम सेवा को आपके खोज-शब्द और आपका IP पता मिलेगा। हम इसके अलावा कुछ नहीं भेजते, और हम आपकी खोजों का कोई रिकॉर्ड नहीं रखते।';
$ec_lang['lpn_search_consent_3']='क्या हम आपकी खोजें जगह-नाम सेवा को भेज सकते हैं?';
$ec_lang['lpn_search_consent_4']='यदि आप ना कहते हैं, तो इस पृष्ठ पर बाकी सब कुछ बिल्कुल वैसे ही काम करता रहेगा जैसे अभी करता है, जिसमें किसी अक्षांश और देशांतर पर जाएँ भी शामिल है। हाँ को हम याद रखते हैं ताकि हमें फिर से पूछना न पड़े। ना को बिल्कुल नहीं सहेजा जाता।';
$ec_lang['lpn_search_refused']='जगह-नाम खोज बंद है, और कुछ नहीं भेजा गया। आप अब भी किसी अक्षांश और देशांतर पर जाएँ का उपयोग कर सकते हैं।';
$ec_lang['lpn_search_prompt']='नाम से कोई जगह खोजें। कोई शहर, सड़क, या स्थल — उदाहरण के लिए: Petaluma, California';
$ec_lang['lpn_search_empty']='खोजने के लिए किसी जगह का नाम टाइप करें।';
$ec_lang['lpn_search_working']='खोजा जा रहा है…';
$ec_lang['lpn_search_busy']='एक खोज पहले से चल रही है। उसके जवाब का इंतज़ार करें।';
$ec_lang['lpn_search_choose']='एक से ज़्यादा जगहें मेल खाती हैं। कौन-सी?';
$ec_lang['lpn_search_nochoice']='कुछ नहीं चुना गया, इसलिए मानचित्र नहीं हिला।';
$ec_lang['lpn_search_badchoice']='यह सूची की किसी संख्या से मेल नहीं खाता।';
$ec_lang['lpn_search_none']='उस नाम के लिए कुछ नहीं मिला।';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='जगह-नाम सेवा हमें धीमा करने के लिए कह रही है। एक मिनट रुकें और फिर कोशिश करें।';
$ec_lang['lpn_search_http']='जगह-नाम सेवा ने एक त्रुटि के साथ जवाब दिया।';
$ec_lang['lpn_search_timeout']='जगह-नाम सेवा ने समय पर जवाब नहीं दिया। इस पृष्ठ पर बाकी सब कुछ इसके बिना काम करता है।';
$ec_lang['lpn_search_unreadable']='जगह-नाम सेवा ने ऐसा कुछ भेजा जिसे यह पृष्ठ पढ़ नहीं सका।';
$ec_lang['lpn_search_offline']='हम जगह-नाम सेवा तक नहीं पहुँच सके। हो सकता है आप ऑफ़लाइन हों। इस पृष्ठ पर बाकी सब कुछ इसके बिना काम करता है, जिसमें किसी अक्षांश और देशांतर पर जाएँ भी शामिल है।';
$ec_lang['lpn_search_toofast']='एक सेकंड में एक खोज — यही जगह-नाम सेवा अनुमति देती है। थोड़ी देर बाद फिर कोशिश करें।';
$ec_lang['lpn_search_nofetch']='यह ब्राउज़र जगह-नाम सेवा तक नहीं पहुँच सकता।';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox इसे कई सार्वजनिक ऊँचाई डेटासेट से जोड़कर बनाता है, इसलिए यह कितना अच्छा है यह पूरी तरह इस पर निर्भर करता है कि आप कहाँ हैं। जहाँ कोई राष्ट्रीय lidar सर्वे मौजूद है, जैसे अमेरिका के अधिकांश हिस्से में USGS 3DEP और अन्य जगहों पर उसके समकक्ष, वहाँ यह क्षैतिज रूप से एक मीटर से बेहतर और खड़ी दिशा में कुछ दशमलव मीटर तक सटीक हो सकता है। जहाँ केवल वैश्विक डेटा मौजूद है वहाँ यह क्षैतिज रूप से लगभग 30 मीटर और खड़ी दिशा में कई मीटर तक है। Mapbox हमें नहीं बताता कि आपको इनमें से कौन सा मिला। इसे एक सर्वे नहीं, बल्कि एक कंटूर मानचित्र मानें: जिस पर आप भरोसा करते हैं उसे जाँच लें।';
$ec_lang['lpn_terrain_consent_1']='ऊँचाइयाँ भरना हर उस नोड की स्थिति भेजता है जिसे एक ऊँचाई चाहिए — उसका अक्षांश और देशांतर — api.mapbox.com को, ताकि वहाँ की ज़मीन की ऊँचाई पता की जा सके।';
$ec_lang['lpn_terrain_consent_2']='यह आपके प्रोजेक्ट के पीछे दिख रहे मानचित्र चित्रों से अलग सवाल है। वे चित्र केवल यह बताते हैं कि आप कहाँ देख रहे हैं। ये स्थितियाँ आपका नेटवर्क ही हैं। Mapbox को वे निर्देशांक और आपका IP पता मिलेगा। हम इसके अलावा कुछ नहीं भेजते: न नाम, न पाइप, न प्रोजेक्ट। हम इसका कोई रिकॉर्ड नहीं रखते, और आपके इस सवाल के जवाब के अलावा इस डिवाइस पर कुछ भी सहेजा नहीं जाता।';
$ec_lang['lpn_terrain_consent_3']='क्या हम आपके नोड की स्थितियाँ Mapbox को भेज सकते हैं?';
$ec_lang['lpn_terrain_consent_4']='यदि आप ना कहते हैं, तो इस पृष्ठ पर बाकी सब कुछ बिल्कुल वैसे ही काम करता रहेगा जैसे अभी करता है, और आप पहले की तरह खुद ऊँचाइयाँ टाइप कर सकते हैं। हाँ को हम याद रखते हैं ताकि हमें फिर से पूछना न पड़े। ना को बिल्कुल नहीं सहेजा जाता।';
$ec_lang['lpn_terrain_refused']='ऊँचाइयाँ नहीं भरी गईं, और कुछ नहीं भेजा गया। आप उन्हें पहले की तरह खुद टाइप कर सकते हैं।';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='{n} नोड की ऊँचाई Mapbox DEM से भरें?';
$ec_lang['lpn_terrain_confirm_default_1']='हर नोड की पहले से एक ऊँचाई है, और उनमें से {n} अभी भी {v} पर हैं, जो वह ऊँचाई है जिससे एक नया नोड शुरू होता है, न कि वह जो आपने टाइप की।';
$ec_lang['lpn_terrain_confirm_default_2']='उन {n} नोड की ऊँचाई को Mapbox DEM के मानों से बदलें?';
$ec_lang['lpn_terrain_keep']='{k} नोड की पहले से ही ऊँचाई है और उन्हें छुआ नहीं जाएगा।';
$ec_lang['lpn_terrain_undo']='एक Undo (Ctrl-Z) उन सबको वापस ले आता है।';
$ec_lang['lpn_terrain_requests']='{n} api.mapbox.com को अनुरोध।';
$ec_lang['lpn_terrain_busy']='ऊँचाइयाँ पहले से भरी जा रही हैं। उनका इंतज़ार करें।';
$ec_lang['lpn_terrain_offmap']='ये नोड स्थितियाँ भू-भाग मानचित्र पर नहीं हैं, इसलिए कुछ नहीं भेजा गया।';
$ec_lang['lpn_terrain_too_wide']='ये नोड पृथ्वी के इतने बड़े हिस्से में फैले हैं कि एक बार में पढ़ना संभव नहीं ({n} टाइल अनुरोध)। कुछ नहीं भेजा गया।';
$ec_lang['lpn_terrain_cancelled']='कुछ नहीं बदला और कुछ नहीं भेजा गया।';
$ec_lang['lpn_terrain_nofetch']='यह ब्राउज़र भू-भाग सेवा तक नहीं पहुँच सकता।';
$ec_lang['lpn_terrain_working']='ज़मीन की सतह पढ़ी जा रही है…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='भू-भाग सेवा ने अनुरोध अस्वीकार कर दिया ({status}), इसलिए कोई ऊँचाई नहीं बदली गई। हो सकता है कि यह साइट जिस Mapbox टोकन का उपयोग करती है वह उस वेब पते की अनुमति न देता हो जिस पर आप हैं।';
$ec_lang['lpn_terrain_failed']='हम भू-भाग सेवा तक नहीं पहुँच सके, इसलिए कोई ऊँचाई नहीं बदली गई। हो सकता है आप ऑफ़लाइन हों। इस पृष्ठ पर बाकी सब कुछ इसके बिना काम करता है।';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='भू-भाग सेवा हमें धीमा करने के लिए कह रही है (429), इसलिए कोई ऊँचाई नहीं बदली गई। एक मिनट में फिर कोशिश करें।';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='भू-भाग सेवा ने एक त्रुटि के साथ उत्तर दिया ({status}), इसलिए कोई ऊँचाई नहीं बदली गई। आपके नेटवर्क में कुछ भी गलत नहीं है।';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='उन नोड में से किसी का भी पृथ्वी पर कोई स्थान नहीं है, इसलिए कुछ नहीं भेजा गया और कोई ऊँचाई नहीं बदली गई। भूमि सतह पढ़ने के लिए अक्षांश और देशांतर में एक प्रोजेक्ट चाहिए, या ऐसे प्रक्षेपण पर जिसे यह पृष्ठ रख सके।';
$ec_lang['lpn_terrain_done']='{n} ऊँचाइयाँ भरी गईं।';
$ec_lang['lpn_terrain_missed']='{m} पढ़ी नहीं जा सकीं और अभी भी खाली हैं।';
$ec_lang['lpn_terrain_partial']='{f} भू-भाग टाइलों ने जवाब नहीं दिया।';
$ec_lang['lpn_terrain_will_ids']='इन नोड को एक ऊँचाई मिलेगी: {ids}';
$ec_lang['lpn_terrain_keep_ids']='वे नोड हैं: {ids}';
$ec_lang['lpn_terrain_filled_ids']='इन नोड को एक ऊँचाई मिल गई: {ids}';
$ec_lang['lpn_terrain_blank_ids']='इन नोड में अभी भी कोई ऊँचाई नहीं है: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, और {n} और';

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
$ec_lang['lpn_ff_menu']='फायर फ्लो विश्लेषण…';
$ec_lang['lpn_ff_menu_tip']='जंक्शनों को एक-एक करके जाँचें: आपके सेट किए गए अवशिष्ट दाब को बनाए रखते हुए हर एक कितना दे सकता है, और क्या वहाँ आवश्यक प्रवाह खींचने से कुछ और सीमा से बाहर चला जाता है?';
$ec_lang['lpn_ff_title']='फायर फ्लो विश्लेषण';
$ec_lang['lpn_ff_intro']='हर जंक्शन से बारी-बारी से पहले से मौजूद माँग के ऊपर एक फायर फ्लो खींचने को कहा जाता है। आपके प्रोजेक्ट में कुछ नहीं बदलता; पूरा रन एक प्रति पर किया जाता है।';
$ec_lang['lpn_ff_scope']='जाँचने के लिए जंक्शन';
$ec_lang['lpn_ff_scope_tip']='रन करने से पहले सेट चुनें। एक बड़े सिस्टम में हर जंक्शन जाँचने में कई मिनट लग सकते हैं।';
$ec_lang['lpn_ff_all']='सभी';
$ec_lang['lpn_ff_selected']='चयनित';
$ec_lang['lpn_ff_no_junctions']='इस प्रोजेक्ट में अभी तक कोई जंक्शन नहीं है, इसलिए जाँचने के लिए कुछ नहीं है।';
$ec_lang['lpn_ff_no_selection']='कोई जंक्शन चयनित नहीं है। जंक्शन चयनित करें या सभी जंक्शन चुनें।';
$ec_lang['lpn_ff_skipped']='{n} चयनित तत्व जंक्शन नहीं हैं, इसलिए उनका परीक्षण नहीं किया गया।';
$ec_lang['lpn_ff_required']='आवश्यक फायर फ्लो';
$ec_lang['lpn_ff_required_tip']='वह प्रवाह जो आपकी अग्नि संहिता या अग्नि प्राधिकरण किसी हाइड्रेंट पर माँगता है। हर जंक्शन इस संख्या के मुकाबले जाँचा जाता है जब तक कि उसका अपना आवश्यक फायर फ्लो न हो।';
$ec_lang['lpn_ff_required_own']='जिन जंक्शनों का अपना आवश्यक फायर फ्लो है वे इसके बजाय उसके मुकाबले जाँचे जाते हैं। उनकी संख्या: {n}।';
$ec_lang['lpn_ff_required_node_tip']='इस खास जंक्शन पर, जिस भूमि-उपयोग की यह सेवा करता है उसके लिए आवश्यक फायर फ्लो, आपकी अग्नि संहिता या अग्नि प्राधिकरण से। इसे खाली छोड़ें तो जंक्शन को Fire flow analysis बॉक्स की संख्या के मुकाबले जाँचा जाता है।';
$ec_lang['lpn_ff_residual']='बनाए रखने के लिए अवशिष्ट दाब';
$ec_lang['lpn_ff_residual_tip']='वह दाब जो जंक्शन को फायर फ्लो देते समय भी बनाए रखना होता है। AWWA M31 और NFPA 291, 20 psi (140 kPa) उपयोग करते हैं।';
$ec_lang['lpn_ff_design']='डिज़ाइन जाँच (सिस्टम पर असर)';
$ec_lang['lpn_ff_design_tip']='यह सवाल इससे अलग है कि जंक्शन प्रवाह दे सकता है या नहीं: वहाँ वह प्रवाह खींचे जाने पर, क्या कुछ और अपने न्यूनतम दाब से नीचे जाता है या अपनी वेग सीमा से आगे निकलता है? इसे जाँचने का चुनाव कोई अतिरिक्त गणना नहीं माँगता।';
$ec_lang['lpn_ff_design_no_selection']='डिज़ाइन जाँच का दायरा चयनित पर सेट है, पर कोई तत्व चयनित नहीं है। तत्व चुनें या सभी विकल्प चुनें।';

$ec_lang['lpn_ff_minpressure']='अन्यत्र अनुमत न्यूनतम दाब';
$ec_lang['lpn_ff_minpressure_tip']='एक जंक्शन जो इससे नीचे चला जाता है जबकि कोई दूसरा अपना फायर फ्लो खींच रहा है, उसे डिज़ाइन समस्या के रूप में रिपोर्ट किया जाता है।';
$ec_lang['lpn_ff_maxvelocity']='अनुमत अधिकतम वेग';
$ec_lang['lpn_ff_maxvelocity_tip']='फायर फ्लो खींचे जाने के दौरान इससे ऊपर चलने वाला पाइप डिज़ाइन समस्या के रूप में रिपोर्ट किया जाता है।';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='फायर फ्लो जंक्शन पर ही खींचा जाता है। यहाँ यही तरीका उपयोग किया जाता है, और यह सामान्य तरीका है। हाइड्रेंट, उसकी पार्श्व पाइप और उसका नोज़ल मॉडल नहीं किए जाते, इसलिए एक असली हाइड्रेंट यहाँ दिखाए गए प्रवाह से कम देता है।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='बिल्ट-इन सॉल्वर उपयोग किया जाता है।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='EPANET इंजन उपयोग किया जाता है।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='उपलब्ध फायर फ्लो एक खोज है, इसलिए जाँचे जा रहे हर जंक्शन के लिए पूरा नेटवर्क लगभग सोलह बार हल किया जाता है। एक बड़े सिस्टम में कई मिनट लगते हैं। आप इसे किसी भी समय रोक सकते हैं और अब तक जो निकाला जा चुका है उसे रख सकते हैं।';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='अभी स्क्रीन पर दिख रहे समय-चरण की ही जाँच की जाती है। फायर फ्लो सामान्यतः अधिकतम दिन माँग के ऊपर जाँचा जाता है, इसलिए रन करने से पहले नेटवर्क को उस स्थिति में सेट करें।';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='फायर फ्लो रन';
$ec_lang['lpn_ff_calculate']='रन करें';
$ec_lang['lpn_ff_stop']='रोकें';
$ec_lang['lpn_ff_working']='काम जारी: {total} में से {done} जंक्शन।';
$ec_lang['lpn_ff_stopped']='{total} में से {done} जंक्शनों के बाद रोका गया। नीचे दिए परिणाम वे हैं जो पहले ही पूरे हो चुके हैं।';
$ec_lang['lpn_ff_cost']='इस रन ने पूरे नेटवर्क को {solves} बार हल किया।';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='ड्राइंग बदल गई, इसलिए फायर फ्लो परिणाम मिटा दिए गए। इसे फिर से रन करें।';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='वलय साफ़ करें';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} जंक्शनों में कुछ भी गलत नहीं था। {fire} जंक्शन फायर फ्लो में विफल रहे। {design} जंक्शनों ने सिस्टम के बाकी हिस्से को प्रभावित किया।';
$ec_lang['lpn_ff_summary_error']='{n} जंक्शनों का उत्तर नहीं मिल सका।';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='हर जाँचा गया जंक्शन';
$ec_lang['lpn_ff_col_junction']='जंक्शन';
$ec_lang['lpn_ff_col_static']='स्थिर दाब';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='किसी फायर फ्लो के लिए पानी निकाले जाने से पहले इस जंक्शन पर दाब, जबकि सिस्टम की सामान्य माँगें अभी भी चल रही हों। इसे मापने के लिए कुछ भी बंद नहीं किया जाता, इसलिए यह सिस्टम के लिए शून्य-प्रवाह वाला दाब नहीं है; यह वही दाब है जो मानचित्र इस जंक्शन पर दिखाता है। AWWA M31 और NFPA 291 दोनों इस रीडिंग को स्थिर दाब कहते हैं, और यहीं से एक फायर फ्लो परीक्षण शुरू होता है।';
$ec_lang['lpn_ff_col_available']='उपलब्ध प्रवाह';
$ec_lang['lpn_ff_col_required']='आवश्यक प्रवाह';
$ec_lang['lpn_ff_col_residual']='बनाए रखा अवशिष्ट';
$ec_lang['lpn_ff_col_atrequired']='आवश्यक प्रवाह पर दाब';
$ec_lang['lpn_ff_col_affected']='सबसे बुरा असर';
$ec_lang['lpn_ff_col_limit']='डिज़ाइन सीमा';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='जाँचा नहीं गया';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='स्थिर विफल, इसलिए जाँचा नहीं गया';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='विफलता मोड';
$ec_lang['lpn_ff_mode_fire']='अग्नि';
$ec_lang['lpn_ff_mode_design']='डिज़ाइन';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='कोई नहीं';
$ec_lang['lpn_ff_col_solves']='रन';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='दाब और वेग';
$ec_lang['lpn_ff_atleast']='{flow} से अधिक';
$ec_lang['lpn_ff_affect_node']='{id} घटकर {pressure} हो गया';
$ec_lang['lpn_ff_affect_link']='{id} {velocity} तक पहुँचा';
$ec_lang['lpn_ff_more']='और {n} और प्रभावित';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='नहीं दिखाए गए जंक्शन: {n}।';
$ec_lang['lpn_ff_design_none']='किसी भी जंक्शन के अपना फायर फ्लो खींचते समय चुने गए सेट में कुछ भी अपनी सीमा से बाहर नहीं गया।';
$ec_lang['lpn_ff_design_off_note']='इस रन में सिस्टम के बाकी हिस्से पर असर की जाँच नहीं की गई।';
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
$ec_lang['lpn_ff_iso']='इंश्योरेंस सर्विसेज़ ऑफिस (ISO) एक अकेले हाइड्रेंट को अधिकतम {flow} का श्रेय देता है। वह श्रेय-सीमा यहाँ लागू नहीं की गई है क्योंकि हमें नहीं पता कि एक नोड कितने हाइड्रेंट का प्रतिनिधित्व कर सकता है।';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='किसी भी फायर फ्लो के खींचे जाने से पहले ही अवशिष्ट से नीचे';
$ec_lang['lpn_ff_err_converge']='नेटवर्क अभिसरित नहीं हुआ।';
$ec_lang['lpn_ff_err_solve']='सॉल्वर ने एक त्रुटि रिपोर्ट की और कोई उत्तर नहीं दिया।';
$ec_lang['lpn_ff_err_not_junction']='जंक्शन नहीं';
$ec_lang['lpn_ff_err_unknown']='कोई उत्तर नहीं। रिपोर्ट किया गया कोड {code} था।';

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
$ec_lang['lpn_file_import_survey']='सर्वेक्षित बिंदु आयात करें…';
$ec_lang['lpn_file_import_survey_tip']='किसी टेक्स्ट फ़ाइल से सर्वेक्षित बिंदुओं की सूची पढ़ें और हर बिंदु पर एक जंक्शन बनाएँ, फ़ाइल जो कुछ नहीं बताती उसके लिए नए-तत्व सेटिंग्स लेते हुए। कोई पाइप नहीं खींचा जाता, और कोई भी पंक्ति बिना नाम बताए कभी नहीं छोड़ी जाती। यह उसी निर्देशांक प्रणाली को पढ़ता है जिसका यह प्रोजेक्ट पहले से उपयोग करता है, चाहे भू-संदर्भित हो या न हो।';
$ec_lang['lpn_survey_read_error']='वह फ़ाइल आपकी डिस्क से नहीं पढ़ी जा सकी।';
$ec_lang['lpn_survey_cancelled']='कुछ भी नहीं बनाया गया और कुछ भी नहीं बदला गया।';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='नॉर्थिंग';
$ec_lang['lpn_survey_axis_east']='ईस्टिंग';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='उस फ़ाइल में कुछ भी नहीं है।';
$ec_lang['lpn_survey_err_unreadable']='वह फ़ाइल सर्वेक्षित बिंदु सूची के रूप में नहीं पढ़ी जा सकी।';
$ec_lang['lpn_survey_err_ambiguous_coord']='उस फ़ाइल में एक से अधिक कॉलम {axis} ({detail}) हो सकते हैं, और यह पृष्ठ उनके बीच नहीं चुनेगा। उनमें से एक को {axis} नाम से छोड़ दें और फिर कोशिश करें।';
$ec_lang['lpn_survey_err_no_points']='उस फ़ाइल की एक भी पंक्ति सर्वेक्षित बिंदु के रूप में नहीं पढ़ी जा सकी। पढ़ी गई पंक्तियाँ: {detail}';
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
$ec_lang['lpn_survey_format_label']='फ़ाइल प्रारूप:';
$ec_lang['lpn_survey_format_internal']='आंतरिक रूप से निर्दिष्ट';
$ec_lang['lpn_survey_create']='नोड बनाएँ';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='पहली पंक्ति छोड़ दी गई: यह किसी ऐसे कॉलम का नाम नहीं बताती जिसे यह पृष्ठ जानता है।';
$ec_lang['lpn_survey_type_label']='तत्व प्रकार:';
$ec_lang['lpn_survey_confirm_junction']='{n} जंक्शन मिले। आगे बढ़ें?';
$ec_lang['lpn_survey_confirm_reservoir']='{n} जलाशय मिले। आगे बढ़ें?';
$ec_lang['lpn_survey_confirm_tank']='{n} टैंक मिले। आगे बढ़ें?';
$ec_lang['lpn_survey_report_junction']='{n} जंक्शन आयातित, {m} स्तर सहित।';
$ec_lang['lpn_survey_report_reservoir']='{n} जलाशय आयातित, {m} स्तर सहित।';
$ec_lang['lpn_survey_report_tank']='{n} टैंक आयातित, {m} स्तर सहित।';
$ec_lang['lpn_survey_report_clean']='फ़ाइल का हर बिंदु आ गया, और आने के दौरान कुछ नहीं बदला गया।';
$ec_lang['lpn_survey_report_notes']='आयात त्रुटियाँ और टिप्पणियाँ:';
$ec_lang['lpn_survey_sev_error']='त्रुटि';
$ec_lang['lpn_survey_sev_warning']='चेतावनी';
$ec_lang['lpn_survey_note_line']='पंक्ति {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='ऊपर बताए गए फ़ाइल प्रारूप के लिए बहुत कम कॉलम हैं।';
$ec_lang['lpn_survey_note_coord_missing']='{axis} सेल खाली है।';
$ec_lang['lpn_survey_note_bad_coord']='{axis} एक संख्या के रूप में नहीं पढ़ा जाता।';
$ec_lang['lpn_survey_note_coord_range']='{axis} इस प्रोजेक्ट द्वारा अनुमत सीमा से बाहर है।';
$ec_lang['lpn_survey_note_bad_elev']='गैर-संख्यात्मक स्तर। बिना स्तर के आयातित।';
$ec_lang['lpn_survey_note_ambiguous_elev']='एक से अधिक कॉलम स्तर हो सकते थे, इसलिए उनमें से कोई भी नहीं पढ़ा गया।';
$ec_lang['lpn_survey_note_blank_rows']='खाली पंक्तियाँ छोड़ी गईं: {detail}।';
$ec_lang['lpn_survey_note_id_duplicate']='इस फ़ाइल में पहले ही यह नाम उपयोग हो चुका है, नया नाम दिया गया।';
$ec_lang['lpn_survey_note_id_taken']='यह नाम प्रोजेक्ट में पहले से मौजूद है, नया नाम दिया गया।';
$ec_lang['lpn_survey_note_id_invalid']='यह नाम यहाँ उपयोग नहीं किया जा सकता, नया नाम दिया गया।';
$ec_lang['lpn_hotkeys_menu_heading']='मेनू';
$ec_lang['lpn_hotkeys_menu_term']='मेनू कीबोर्ड शॉर्टकट';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+अक्षर</td><td>उस अक्षर वाला मेनू खोलें, फिर किसी पंक्ति का अक्षर दबाकर उसे चुनें। कीबोर्ड उपयोग करते समय अक्षर दिखाई देते हैं। Mac पर Ctrl+Option उपयोग करें।</td></tr><tr><td>F10</td><td>मेनू बार पर जाएँ।</td></tr></tbody></table>';
$ec_lang['lpn_graphs_menu']='ग्राफ';
$ec_lang['lpn_contour_menu']='कंटूर';
$ec_lang['lpn_contour_tip']='मानचित्र पर कंटूर प्लॉट दिखाएँ: नोड के रंग पाइपों के साथ और उनके दोनों ओर फैलते हैं, और कंटूर रेखाओं पर लेबल होते हैं। इसे समायोजित करने या बंद करने के लिए एक बॉक्स खुलता है।';
$ec_lang['lpn_contour_plot']='कंटूर प्लॉट';
$ec_lang['lpn_contour_fill']='भराव';
$ec_lang['lpn_contour_fill_tip']='चिकना एक श्रेणी से अगली श्रेणी तक रंगों को घुलाता है। पट्टियाँ रंग कुंजी की हर श्रेणी को एक समान रंग से भरती हैं।';
$ec_lang['lpn_contour_fill_smooth']='चिकना';
$ec_lang['lpn_contour_fill_bands']='पट्टियाँ';
$ec_lang['lpn_contour_opacity']='भराव की अपारदर्शिता';
$ec_lang['lpn_contour_lines']='कंटूर रेखाएँ';
$ec_lang['lpn_contour_interval']='अंतराल';
$ec_lang['lpn_contour_buffer']='बफ़र';
$ec_lang['lpn_contour_buffer_unit']='× पाइप की माध्यिका लंबाई';
$ec_lang['lpn_contour_buffer_tip']='रंग हर पाइप से कितनी दूर तक पहुँचता है, पाइप की माध्यिका लंबाई के गुणज के रूप में। बाहरी हिस्से में यह फीका पड़ता जाता है।';
$ec_lang['lpn_contour_few']='कंटूर बनाने के लिए नोड बहुत कम हैं।';
$ec_lang['lpn_contour_support']='कंटूर प्लॉट: {n} नोड, {p} पाइपों के साथ और उनके बगल में पाइप की माध्यिका लंबाई के {k} गुना तक अंतर्वेशित। पंपों, वाल्वों या बंद लिंकों के आर-पार कोई रंग नहीं।';
$ec_lang['lpn_contour_support_lines']='कंटूर रेखाएँ हर {i} {u} पर।';
$ec_lang['lpn_contour_too_many']='इस अंतराल पर कंटूर रेखाएँ बहुत अधिक हैं; उन्हें बनाने के लिए अंतराल बढ़ाएँ।';
$ec_lang['lpn_contour_dem']='नोडों के बीच की भूमि Mapbox DEM से';
$ec_lang['lpn_contour_dem_tip']='नोडों के बीच दाब अंतर्वेशित हेड घटा Mapbox DEM से मिली भूमि की ऊँचाई हो जाता है, इसलिए जिस पहाड़ी पर नेटवर्क का कोई नोड नहीं है, वहाँ यह सबसे कम नोड दाब से भी नीचे जा सकता है। भूमि को कंटूर मानचित्र मानें, सर्वेक्षण नहीं।';
$ec_lang['lpn_contour_support_dem']='नोडों के बीच दाब अंतर्वेशित हेड घटा Mapbox DEM से मिली भूमि का स्तर है, जिसका नमूना लगभग हर {m} मी पर लिया गया है।';
$ec_lang['lpn_contour_dem_failed']='Mapbox DEM से भूमि नहीं पढ़ी जा सकी, इसलिए दाब केवल नोडों के बीच अंतर्वेशित किया गया है।';
$ec_lang['lpn_contour_consent_1']='भूमि के ऊपर दाब को आरेखित करने पर आपके नेटवर्क का क्षेत्र, Mapbox मानचित्र टाइल की संख्याओं के रूप में, api.mapbox.com को भेजा जाता है, ताकि वहाँ की भूमि की ऊँचाई पढ़ी जा सके।';
$ec_lang['lpn_contour_consent_2']='यह आपके प्रोजेक्ट के पीछे दिखने वाले मानचित्र चित्रों से अलग सवाल है। वे चित्र केवल यह बताते हैं कि आप कहाँ देख रहे हैं। ये टाइलें बताती हैं कि आपका नेटवर्क कहाँ है। Mapbox को ये टाइल संख्याएँ और आपका IP पता मिलेगा। हम इसके अलावा कुछ नहीं भेजते: न नाम, न पाइप, न प्रोजेक्ट। हम इसका कोई रिकॉर्ड नहीं रखते, और इस डिवाइस पर इस सवाल के आपके उत्तर के सिवा कुछ भी संग्रहीत नहीं होता।';
$ec_lang['lpn_contour_consent_3']='क्या हम आपके नेटवर्क के क्षेत्र की टाइल संख्याएँ Mapbox को भेज सकते हैं?';
$ec_lang['lpn_contour_consent_4']='यदि आप मना करते हैं, तो इस पृष्ठ पर बाकी सब कुछ ठीक वैसे ही चलता रहेगा जैसे अभी चलता है, और कंटूर प्लॉट केवल नोडों के बीच बनाया जाएगा। हम हाँ को याद रखते हैं ताकि दोबारा पूछना न पड़े। ना बिल्कुल संग्रहीत नहीं की जाती।';
$ec_lang['lpn_sysflow_menu']='प्रवाह संतुलन';
$ec_lang['lpn_sysflow_tip']='विस्तारित अवधि सिमुलेशन के दौरान, उत्पादित कुल प्रवाह और उपभोग किए गए कुल प्रवाह को समय के विरुद्ध आलेखित करें। टैंक किसी भी कुल में शामिल नहीं हैं, इसलिए जहाँ दोनों रेखाएँ अलग होती हैं, वहाँ टैंक भर रहे हैं या खाली हो रहे हैं।';
$ec_lang['lpn_sysflow_produced']='उत्पादित';
$ec_lang['lpn_sysflow_produced_tip']='जलाशयों से और ऋणात्मक माँगों से नेटवर्क में आने वाला कुल प्रवाह।';
$ec_lang['lpn_sysflow_consumed']='उपभोग';
$ec_lang['lpn_sysflow_consumed_tip']='हर धनात्मक माँग का कुल योग: जंक्शनों पर नेटवर्क से निकाला गया पानी, और जलाशय में जाने वाला कोई भी प्रवाह।';
$ec_lang['lpn_copy_title']='फ़ाइल को नई प्रति के रूप में चिह्नित करें?';
$ec_lang['lpn_copy_body']='इस फ़ाइल के अनुसार यह {date} को बनाई गई थी, और यह ब्राउज़र इसे पहचानता नहीं है। क्या यह मूल फ़ाइल है (वही लॉक रखें) या प्रति है (नया लॉक बनाएँ)?';
$ec_lang['lpn_copy_body_nodate']='यह ब्राउज़र इस फ़ाइल को पहचानता नहीं है। क्या यह मूल फ़ाइल है (वही लॉक रखें) या प्रति है (नया लॉक बनाएँ)?';
$ec_lang['lpn_copy_original']='मूल; वही लॉक रखें';
$ec_lang['lpn_copy_copy']='प्रति; नया लॉक बनाएँ';
$ec_lang['lpn_copy_kept_link']='{name} को मूल के रूप में खोला गया, जो नई जगह पर चली गई है। अब Save इसी फ़ाइल में लिखता है।';
$ec_lang['lpn_copy_opened']='{file} को प्रति के रूप में खोला गया, अपने नए लॉक के साथ, जो अगली फ़ाइल सहेजने पर सहेजा जाएगा।';
$ec_lang['lpn_scenario_basic']='बेसिक मोड';
$ec_lang['lpn_scenario_basic_tip']='चुना हुआ होने पर, परिदृश्य केवल वे मान हैं जो आपने उसमें सेट किए हैं। न चुना हो तो इस मेनू में ऑल्टरनेटिव पूर्वावलोकन तालिका भी मिलती है, जो दिखाती है कि वे मान श्रेणी के अनुसार कैसे समूहित हैं, और आपकी प्रतिक्रिया आमंत्रित करती है।';
$ec_lang['lpn_alt_title']='ऑल्टरनेटिव पूर्वावलोकन';
$ec_lang['lpn_alt_note']='केवल-पठन। आधार हर श्रेणी का आधार ऑल्टरनेटिव उपयोग करता है। हर परिदृश्य को हर बदली गई श्रेणी के लिए अपना ऑल्टरनेटिव मिलता है, जो आधार वाले का चाइल्ड होता है। संख्या बताती है कि उसमें कितने बदले हुए मान हैं।';
$ec_lang['lpn_alt_cat_physical']='भौतिक';
$ec_lang['lpn_alt_cat_demand']='माँग';
$ec_lang['lpn_alt_cat_topology']='तत्व सक्रियण';
$ec_lang['lpn_alt_cat_initial']='प्रारंभिक सेटिंग्स';
$ec_lang['lpn_alt_cat_constituent']='घटक';
$ec_lang['lpn_alt_cat_fireflow']='फायर फ्लो';
$ec_lang['lpn_alt_cat_energy']='ऊर्जा लागत';
$ec_lang['lpn_alt_cat_userdata']='कस्टम गुण';
$ec_lang['lpn_alt_cat_text']='टेक्स्ट';
$ec_lang['lpn_reports_calib']='कैलिब्रेशन';
$ec_lang['lpn_reports_calib_tip']='कैलिब्रेशन फ़ाइल के मापे गए क्षेत्र-डेटा की तुलना पिछले रन से करें: सांख्यिकी, एक सहसंबंध प्लॉट, और माध्य की तुलनाएँ।';
$ec_lang['lpn_calib_title']='कैलिब्रेशन रिपोर्ट';
$ec_lang['lpn_calib_param']='प्राचल';
$ec_lang['lpn_calib_param_tip']='वह राशि जिसे कैलिब्रेशन फ़ाइल मापती है। हर प्राचल के लिए एक फ़ाइल रखी जाती है।';
$ec_lang['lpn_calib_load']='कैलिब्रेशन फ़ाइल लोड करें…';
$ec_lang['lpn_calib_load_tip']='एक टेक्स्ट फ़ाइल जिसकी हर पंक्ति में स्थान की ID, एक समय और एक मापा हुआ मान हो। समय सिमुलेशन की शुरुआत से मापा जाता है, दशमलव घंटों या घंटे:मिनट में। अर्धविराम से टिप्पणी शुरू होती है। जिस पंक्ति में केवल समय और मान हो, वह ऊपर वाले स्थान की मानी जाती है।';
$ec_lang['lpn_calib_none']='इस प्राचल के लिए कोई कैलिब्रेशन फ़ाइल लोड नहीं है।';
$ec_lang['lpn_calib_session']='कैलिब्रेशन फ़ाइल केवल इस सत्र के लिए रखी जाती है। वह प्रोजेक्ट के साथ या इस डिवाइस पर सहेजी नहीं जाती।';
$ec_lang['lpn_calib_file']='{file}: {m} स्थानों पर {n} माप।';
$ec_lang['lpn_calib_units']='फ़ाइल के मान इस प्रोजेक्ट की इकाइयों में पढ़े जाते हैं: {unit}।';
$ec_lang['lpn_calib_missing']='फ़ाइल में नामित, पर इस नेटवर्क में नहीं: {ids}।';
$ec_lang['lpn_calib_missing_count']='वे माप छोड़ दिए गए जिनका स्थान इस नेटवर्क में नहीं है: {n}।';
$ec_lang['lpn_calib_bad_lines']='जो पंक्तियाँ पढ़ी नहीं जा सकीं, छोड़ दी गईं: {lines}';
$ec_lang['lpn_calib_outside']='इस रन द्वारा रिपोर्ट किए गए समयों के बाहर के माप छोड़ दिए गए: {n}।';
$ec_lang['lpn_calib_no_value']='वे माप छोड़ दिए गए जिनके समय पर कोई परिकलित मान नहीं है: {n}।';
$ec_lang['lpn_calib_single']='यह एकल-अवधि रन है, इसलिए फ़ाइल में कोई भी समय हो, हर माप की तुलना उसके एकमात्र परिणाम से की जाती है।';
$ec_lang['lpn_calib_needs_run']='तुलना करने के लिए अभी कोई परिणाम नहीं है। नेटवर्क की गणना होने के बाद रिपोर्ट भर जाती है।';
$ec_lang['lpn_calib_no_pairs']='किसी भी माप की तुलना नहीं की जा सकी, इसलिए आलेखित करने के लिए कुछ नहीं है।';
$ec_lang['lpn_calib_tab_stats']='सांख्यिकी';
$ec_lang['lpn_calib_tab_corr']='सहसंबंध प्लॉट';
$ec_lang['lpn_calib_tab_means']='माध्य की तुलनाएँ';
$ec_lang['lpn_calib_col_location']='स्थान';
$ec_lang['lpn_calib_col_n']='प्रेक्षण संख्या';
$ec_lang['lpn_calib_col_n_tip']='प्रेक्षणों की संख्या: इस स्थान के वे माप जिनकी तुलना की गई।';
$ec_lang['lpn_calib_col_obs_mean']='प्रेक्षित माध्य';
$ec_lang['lpn_calib_col_sim_mean']='परिकलित माध्य';
$ec_lang['lpn_calib_col_mean_err']='माध्य त्रुटि';
$ec_lang['lpn_calib_col_mean_err_tip']='हर प्रेक्षित मान और उसी समय के परिकलित मान के बीच के निरपेक्ष अंतरों का माध्य।';
$ec_lang['lpn_calib_col_rms_err']='RMS त्रुटि';
$ec_lang['lpn_calib_col_rms_err_tip']='मूल माध्य वर्ग त्रुटि: प्रेक्षित और परिकलित मानों के अंतरों के वर्गों के माध्य का वर्गमूल।';
$ec_lang['lpn_calib_network']='नेटवर्क';
$ec_lang['lpn_calib_corr_means']='माध्यों के बीच सहसंबंध: {r}';
$ec_lang['lpn_calib_corr_none']='माध्यों के बीच सहसंबंध: इसके लिए कम से कम दो ऐसे स्थान चाहिए जिनके माध्य भिन्न हों।';
$ec_lang['lpn_calib_axis_obs']='प्रेक्षित: {q}';
$ec_lang['lpn_calib_axis_sim']='परिकलित: {q}';
$ec_lang['lpn_calib_observed']='प्रेक्षित';
$ec_lang['lpn_calib_computed']='परिकलित';
$ec_lang['lpn_calib_point']='{id}, {time}: प्रेक्षित {o}, परिकलित {s}';
$ec_lang['lpn_calib_corr_note']='हर बिंदु एक माप है। बिंदु विकर्ण रेखा के जितने निकट होते हैं, परिकलित मान प्रेक्षित मानों से उतने ही अधिक मेल खाते हैं।';
$ec_lang['lpn_calib_ts_point']='{id} पर मापा गया, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='वलय कैलिब्रेशन फ़ाइल के मापे गए मान हैं।';
$ec_lang['lpn_analyze_menu']='विश्लेषण';
$ec_lang['lpn_analyze_menu_tip']='ऐसे विश्लेषण जो नेटवर्क को एक प्रति पर चलाते हैं: हर जंक्शन पर फायर फ्लो, हर पाइप, पंप और वाल्व की हानि, और ऊपर या नीचे स्केल की गई माँगें।';
$ec_lang['lpn_ff_design_off']='कोई नहीं';
$ec_lang['lpn_ff_design_all']='सभी';
$ec_lang['lpn_ff_design_selected']='चयनित';
$ec_lang['lpn_ff_rows_more_links']='नहीं दिखाए गए लिंक: {n}।';
$ec_lang['lpn_crit_menu']='क्रांतिकता विश्लेषण…';
$ec_lang['lpn_crit_menu_tip']='हर पाइप, पंप और वाल्व को बारी-बारी से नेटवर्क से निकालें और देखें कि सिस्टम क्या खोता है।';
$ec_lang['lpn_crit_title']='क्रांतिकता विश्लेषण';
$ec_lang['lpn_crit_intro']='हर तत्व को बारी-बारी से नेटवर्क से निकाला जाता है, और नेटवर्क को सक्रिय परिदृश्य में स्क्रीन पर दिख रहे समय-चरण पर हल किया जाता है। आपके प्रोजेक्ट में कुछ नहीं बदलता; पूरा रन एक प्रति पर किया जाता है।';
$ec_lang['lpn_crit_scope']='तोड़ने के लिए लिंक';
$ec_lang['lpn_crit_scope_tip']='सभी पाइप, पंप और वाल्व, या केवल वे जो मानचित्र पर चयनित हैं। रन करने से पहले सेट चुनें।';
$ec_lang['lpn_crit_scope_all']='सभी लिंक';
$ec_lang['lpn_crit_scope_selected']='चयनित लिंक';
$ec_lang['lpn_crit_minpressure']='अनुमत न्यूनतम दाब';
$ec_lang['lpn_crit_minpressure_tip']='यह वही संख्या है जो फायर फ्लो विश्लेषण में अन्यत्र अनुमत न्यूनतम दाब के रूप में है। इसे यहाँ बदलने से वह वहाँ भी बदल जाती है।';
$ec_lang['lpn_crit_col_asset']='तत्व';
$ec_lang['lpn_crit_col_unserved']='अपूर्ण माँग';
$ec_lang['lpn_crit_col_cutoff']='कटे जंक्शन';
$ec_lang['lpn_crit_col_below']='न्यूनतम से नीचे जंक्शन';
$ec_lang['lpn_crit_summary']='{total} में से {n} तत्व माँग को अपूर्ण छोड़ते हैं या किसी जंक्शन को {pressure} से नीचे गिरा देते हैं।';
$ec_lang['lpn_crit_baseline_below']='वे जंक्शन जो कुछ भी टूटे बिना पहले से इससे नीचे हैं: {n}। उन्हें गिना नहीं गया है।';
$ec_lang['lpn_crit_working']='काम जारी: {total} में से {done} तत्व।';
$ec_lang['lpn_crit_stopped']='{total} में से {done} तत्वों के बाद रोका गया। नीचे दिए परिणाम वे हैं जो पहले ही पूरे हो चुके थे।';
$ec_lang['lpn_crit_no_selection']='कोई लिंक चयनित नहीं है। लिंक चयनित करें या सभी लिंक चुनें।';
$ec_lang['lpn_crit_no_links']='इस प्रोजेक्ट में अभी तक कोई लिंक नहीं है, इसलिए तोड़ने के लिए कुछ नहीं है।';
$ec_lang['lpn_crit_busy']='एक और विश्लेषण चल रहा है। उसे रोकें, या उसके पूरा होने की प्रतीक्षा करें।';
$ec_lang['lpn_crit_skipped']='{n} चयनित तत्व लिंक नहीं हैं, इसलिए उन्हें तोड़ा नहीं गया।';
$ec_lang['lpn_crit_stale']='ड्राइंग बदल गई, इसलिए क्रांतिकता परिणाम मिटा दिए गए। इसे फिर से रन करें।';
$ec_lang['lpn_crit_skipdead']='डेड एंड छोड़ें';
$ec_lang['lpn_crit_skipdead_tip']='डेड-एंड लिंक वह है जिसके हटने से वे जंक्शन कट जाते हैं जो केवल उसी के माध्यम से पहुँचे जा सकते हैं, और आगे कोई जलाशय या टैंक नहीं है। इसकी हानि वह सब कुछ है जो उसके आगे है, इसलिए इसे हल नहीं किया जाता। सारांश बताता है कि कितने छोड़े गए।';
$ec_lang['lpn_crit_skipped_dead']='छोड़े गए डेड-एंड लिंक: {n}। हर एक अपने आगे की हर चीज़ को काट देता है।';
