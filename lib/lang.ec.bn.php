<?php

// বাংলা — All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='ভগ্নাংশ';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/s';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% উচ্চতা/দৈর্ঘ্য';
$ec_lang['u_grade']='উচ্চতা/দৈর্ঘ্য';
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
$ec_lang['u_afd']='ac-ft/d';
$ec_lang['u_lpm']='L/min';
$ec_lang['u_cmh']='m^3/h';
$ec_lang['u_cmd']='m^3/d';
$ec_lang['u_mh2o']='m H2O';
$ec_lang['u_mld']='ML/দিন';
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
$ec_lang['u_s']='সেকেন্ড';
$ec_lang['u_hr']='ঘণ্টা';
$ec_lang['u_day']='দিন';
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
$ec_lang['menu_brand']='HawsEDC ক্যালকুলেটর';
$ec_lang['menu_main_hydraulics']='হাইড্রোলিক্স';
$ec_lang['menu_help']='সাহায্য';
$ec_lang['menu_libre']='মুক্ত সফটওয়্যার';
$ec_lang['template_welcome']='দরজায় ভয় রেখে আসুন; এখানে ভালোবাসাই আমাদের ভাষা। আপনি সব কিছু নষ্ট করছেন না। <a target="_blank" href="https://hawsedc.com/download.php">বিনামূল্যে HawsEDC AutoCAD টুলগুলো</a>ও উপভোগ করুন।';
$ec_lang['template_feedback']='আপনি কি এই পাতার ভাষা আরও ভালো করার পরামর্শ দিতে পারেন, বা অন্য কিছু বলতে চান? আপনি কি সাহায্য করতে চান, নাকি এই ধরনের সরঞ্জাম তৈরি করতে শিখতে চান? দয়া করে আমার সাথে যোগাযোগ করুন।';
$ec_lang['template_printable_title']='মুদ্রণযোগ্য শিরোনাম';
$ec_lang['template_printable_subtitle']='মুদ্রণযোগ্য উপশিরোনাম';
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
$ec_lang['consent_body']='এই ব্রাউজারে আমরা কি একটি একক-সংখ্যার কুকি সংরক্ষণ করতে পারি, এই মনে রাখতে যে আমরা এই পৃষ্ঠাটি ইতিমধ্যে গণনা করেছি? এটি আপনার সম্পর্কে বা আপনি যা টাইপ করেন তার কিছুই রেকর্ড করে না। এটি ছাড়া আমরা আপনার দ্বিতীয় পরিদর্শনকে অন্য কারও প্রথম পরিদর্শন থেকে আলাদা করতে পারি না।';
$ec_lang['consent_accept']='এটি গ্রহণ করুন';
$ec_lang['consent_accept_all']='সর্বদা গ্রহণ করুন';
$ec_lang['consent_decline']='সর্বদা প্রত্যাখ্যান করুন';
$ec_lang['consent_current_granted']='আপনি এটি অনুমতি দিয়েছেন। আমরা এই ব্রাউজার প্রোফাইলের জন্য লগিং সীমিত করি।';
$ec_lang['consent_current_denied']='আপনি এটি প্রত্যাখ্যান করেছেন। এই ব্রাউজার প্রোফাইলের লগিং সীমিত করতে আমরা কিছুই সংরক্ষণ করি না।';
$ec_lang['consent_region_label']='লগিং সীমিত করা সংক্রান্ত আপনার সিদ্ধান্ত।';
$ec_lang['consent_settings_link']='কুকি সেটিংস';
$ec_lang['privacy_link']='গোপনীয়তা নীতি';
$ec_lang['terms_link']='ব্যবহারের শর্তাবলী';
$ec_lang['index_main_title']='বিনামূল্যে অনলাইন ইঞ্জিনিয়ারিং ক্যালকুলেটর';
$ec_lang['index_meta_desc_plain']='পাইপ, চ্যানেল, উইয়ার এবং সেচের জন্য বিনামূল্যে হাইড্রোলিক ইঞ্জিনিয়ারিং ক্যালকুলেটর। এগুলো আপনার ব্রাউজারে চলে, ইন্টারনেট ছাড়াও (অফলাইনে) কাজ করে, এবং ২৭টি ভাষায় পাওয়া যায়।';
$ec_lang['calc_set_units']='একক নির্ধারণ করুন:';
$ec_lang['calc_set_units_tip']='একসাথে প্রতিটি ঘরের একক নির্ধারণ করে। অ-ধ্বংসাত্মক: আপনি যে সংখ্যাগুলো লিখেছেন তা ঠিক তেমনই থাকে, শুধু প্রতিটি এখন নতুন এককে পড়া হয়। একটি ৬ ৬-ই থাকে, তবে এখন তার অর্থ ৬ মিলিমিটারের বদলে ৬ ইঞ্চি।';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='ডিফল্ট পুনরুদ্ধার করুন';
$ec_lang['calc_defaults_confirm']='ক্যালকুলেটরটি মূল ডিফল্ট মানে পুনরায় সেট করবেন?';
$ec_lang['points_data_note']='(অথবা ডেটা এলাকা ব্যবহার করে কপি/পেস্ট করুন)';
$ec_lang['points_data_heading']='ক্যালকুলেটর ডেটা<br />(ফরম্যাট দেখতে কপি ব্যবহার করুন)';
$ec_lang['points_data_copy']='কপি';
$ec_lang['points_data_paste']='পেস্ট';
$ec_lang['calc_inputs']='ইনপুট';
$ec_lang['calc_results']='ফলাফল';
$ec_lang['view_hide_line']='এই লাইনটি লুকান';
$ec_lang['view_printable']='মুদ্রণযোগ্য সংস্করণ (পুনরুদ্ধারের জন্য পুনরায় লোড করুন)';
$ec_lang['ec_name_label']='এই গণনা সংরক্ষণ করুন:';
$ec_lang['ec_name_placeholder']='নাম';
$ec_lang['ec_name_tip']='এই ইনপুটগুলি বুকমার্কিং, ইতিহাস পুনরুদ্ধার এবং শেয়ারিংয়ের জন্য URL-এ সংরক্ষণ করে';
$ec_lang['calc_copy_link']='লিঙ্ক কপি করুন';
$ec_lang['ec_related_calcs']='সম্পর্কিত ক্যালকুলেটর:';
$ec_lang['calc_copy_link_done']='কপি করা হয়েছে!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='ড্যার্সি-ওয়েইসবাখ পাইপ হেড লস';
$ec_lang['dw_main_title']='বিনামূল্যে অনলাইন ড্যার্সি-ওয়েইসবাখ পাইপ হেড লস ক্যালকুলেটর';
$ec_lang['dw_main_desc']='নির্দিষ্ট ব্যাস, রুক্ষতা ও প্রবাহে ড্যার্সি-ওয়েইসবাখ পাইপ হেড লস';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='পাইপের দেয়ালের পরম রুক্ষতার উচ্চতা, e। সাধারণ মান: ইস্পাত (নতুন) 0.046 mm, ইস্পাত (ব্যবহৃত) 0.15 mm, HDPE 0.003 mm, PVC/uPVC 0.0015 mm, কংক্রিট 0.3–3 mm।';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s, ২০°সে তাপমাত্রায় বিশুদ্ধ পানির জন্য">গতিগত সান্দ্রতা, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='গতিগত সান্দ্রতা, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s, ২০°সে তাপমাত্রায় বিশুদ্ধ পানির জন্য';
$ec_lang['dw_reynolds_number']='রেনোল্ডস সংখ্যা, Re';
$ec_lang['dw_flow_regime']='প্রবাহ ব্যবস্থা';
$ec_lang['dw_regime_laminar']='স্তরীয়';
$ec_lang['dw_regime_transitional']='ক্রান্তিকালীন';
$ec_lang['dw_regime_turbulent']='অশান্ত';
$ec_lang['dw_friction_factor_method']='ঘর্ষণ গুণাঙ্ক পদ্ধতি';
$ec_lang['dw_friction_factor']='ঘর্ষণ গুণাঙ্ক, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='হেজেন-উইলিয়ামস পাইপ হেড লস';
$ec_lang['hw_main_title']='বিনামূল্যে অনলাইন হেজেন-উইলিয়ামস পাইপ হেড লস ক্যালকুলেটর';
$ec_lang['hw_main_desc']='নির্দিষ্ট ব্যাস, রুক্ষতা ও প্রবাহে হেজেন-উইলিয়ামস পাইপ হেড লস';
$ec_lang['hw_hgl_1']='ভাটির HGL';
$ec_lang['hw_hgl_2']='উজানের HGL';
$ec_lang['hw_elev_up']='উজানের উচ্চতা';
$ec_lang['hw_pressure_up']='উজানের চাপ';
$ec_lang['hw_elev_down']='ভাটির উচ্চতা';
$ec_lang['hw_pressure_down']='ভাটির চাপ';
$ec_lang['hw_pressure_check']='চাপ পরীক্ষা';
$ec_lang['hw_pressure_ok_short']='ধনাত্মক চাপ';
$ec_lang['hw_pressure_neg_short']='ঋণাত্মক চাপ';
$ec_lang['hw_pressure_neg']='ভাটির চাপ শূন্যের নিচে। হাইড্রলিক গ্রেড লাইন পাইপের নিচে নেমে যায়, তাই পাইপ পূর্ণ প্রবাহিত হবে না এবং এই ফলাফল বৈধ নাও হতে পারে।';
$ec_lang['hw_roughness']='হেজেন-উইলিয়ামস সহগ, C';
$ec_lang['hw_note_1']='<dl><dt>এই ক্যালকুলেটর দুই প্রান্তের মধ্যে পাইপের প্রোফাইল অনুকরণ করে না।</dt><dd>এটি শুধুমাত্র আপনার দেওয়া উজান ও ভাটির উচ্চতা ব্যবহার করে। যদি মাঝখানে কোথাও ভূমি যেকোনো প্রান্তের চেয়ে উঁচু হয়ে ওঠে, তবে সেই উঁচু বিন্দুর চাপ এখানে দেখানো যেকোনো চাপের চেয়ে কম হবে। তা যাচাই করতে উজান প্রান্ত থেকে উঁচু বিন্দু পর্যন্ত দৈর্ঘ্য দিয়ে আবার হিসাব করুন।</dd><dd>যেখানে হাইড্রলিক গ্রেড লাইন পাইপের নিচে নেমে যায়, সেখানে পানি ঋণাত্মক চাপে থাকে। দ্রবীভূত বাতাস বের হয়ে আসে, পাতলা দেয়ালের পাইপ চুপসে যেতে পারে, এবং জোড়ার মধ্য দিয়ে দূষিত ভূগর্ভস্থ পানি প্রবেশ করতে পারে। সর্বত্র লাইনটি ধনাত্মক চাপে রাখুন এবং প্রতিটি উঁচু বিন্দুতে একটি এয়ার ভালভ বিবেচনা করুন।</dd><dt>উজানের চাপ আপনার দেওয়া একটি সীমানা শর্ত।</dt><dd>এটি একটি গেজ থেকে, ট্যাংকের পানির স্তর (পাইপের উপরে পানির উচ্চতা) থেকে, অথবা একটি পাম্প কার্ভ থেকে পড়ুন। প্রবাহ বাড়ার সাথে সাথে পাম্প কম চাপ সরবরাহ করে, তাই উপরে দেওয়া প্রবাহের সাথে মিলে যাওয়া কার্ভের বিন্দুটি ব্যবহার করুন।</dd><dt>ক্ষুদ্র (স্থানীয়) ক্ষতির সহগগুলো নিজে যোগ করুন।</dt><dd>লাইনের প্রতিটি ভালভ, বাঁক, টি, মিটার এবং প্রবেশপথের জন্য K মান যোগ করুন এবং সেই মোট মান লিখুন। সাধারণ মানের জন্য সেই ইনপুটের লিংক অনুসরণ করুন। একটি দীর্ঘ ট্রান্সমিশন মেইনে এই ক্ষতিগুলো ঘর্ষণের তুলনায় ছোট, কিন্তু ছোট স্টেশন পাইপিং-এ এগুলোই বেশিরভাগ ক্ষতি হতে পারে।</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='ম্যানিং অনিয়মিত চ্যানেল';
$ec_lang['mi_main_title']='বিনামূল্যে অনলাইন ম্যানিং অনিয়মিত প্রস্থচ্ছেদ চ্যানেল ক্যালকুলেটর';
$ec_lang['mi_main_desc']='অনিয়মিত প্রস্থচ্ছেদের চ্যানেলে ম্যানিং সমরূপ প্রবাহ ক্যালকুলেটর';
$ec_lang['mi_waterSurfaceElevation']='পানির পৃষ্ঠ উচ্চতা';
$ec_lang['mi_q_617']='<span class="ec-help" title="Chow 6-17 অনুযায়ী প্রতিটি অঞ্চলের জন্য যৌগিক n ব্যবহার করে, সমান বেগ অনুমানে গণনা করা যৌগিক প্রবাহ, Q">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='প্রস্থচ্ছেদ পয়েন্ট';
$ec_lang['mi_groupPoint']='পয়েন্ট';
$ec_lang['mi_groupSegment']='সেগমেন্ট';
$ec_lang['mi_groupRegion']='অঞ্চল';
$ec_lang['mi_station']='স্টা';
$ec_lang['mi_elevation']='উচ্চতা';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />অঞ্চল<br />সীমানা<br />(তীর)';
$ec_lang['mi_tau']='তলদেশ<br />কৃন্তন<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='যৌগিক<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='যৌগিক n';
$ec_lang['mi_notes_1_def']='এই ক্যালকুলেটর HEC-RAS রেফারেন্স ম্যানুয়াল অনুসরণ করে, Chow 1959, পৃষ্ঠা 136, সমীকরণ 6-17 (6-18 নয়) ব্যবহার করে প্রতিটি অঞ্চলের যৌগিক n গণনা করে।';


$ec_lang['mi_notes_2_term']='পাথরের আস্তরণ';
$ec_lang['mi_notes_2_def']='পাথরের আস্তরণ ডিজাইন করতে ম্যানিং ট্র্যাপিজোয়েডাল চ্যানেল ক্যালকুলেটর ব্যবহার করুন। এই ক্যালকুলেটরটি প্রাকৃতিক প্রস্থচ্ছেদের জন্য বেশি উপযোগী।';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='ম্যানিং পাইপ প্রবাহ';
$ec_lang['mpf_main_title']='বিনামূল্যে অনলাইন ম্যানিং পাইপ প্রবাহ ক্যালকুলেটর';
$ec_lang['mpf_main_desc']='নির্দিষ্ট ঢাল ও গভীরতায় ম্যানিং ফর্মুলা সুষম পাইপ প্রবাহ';
$ec_lang['mpf_pipe_diameter']='পাইপ ব্যাস, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='ম্যানিং রুক্ষতা, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">ঘর্ষণ ঢাল, S<sub>f</sub></a><span class="ec-help" title="কখনও কখনও পাইপ ঢালের সমান। ব্যাখ্যার জন্য লিঙ্ক অনুসরণ করুন (শুধুমাত্র ইংরেজিতে)।"><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='আপেক্ষিক প্রবাহ গভীরতা, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='প্রবাহ, Q';
$ec_lang['mpf_flow_tip']='প্রবাহ ও গভীরতা একটি অসীম দৈর্ঘ্যের পাইপের জন্য গণনা করা হয়েছে। এই প্রবাহ পাইপে প্রবেশ করাতে বেশি হেডওয়াটার গভীরতার প্রয়োজন হতে পারে। বিস্তারিত ও একটি টিউটোরিয়াল ভিডিওর জন্য নিচের নোট দেখুন।';
$ec_lang['mpf_velocity']='বেগ, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="পানির স্তম্ভের উচ্চতা হিসেবে গতিশক্তি, v²/2g">বেগ হেড, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='প্রবাহ ক্ষেত্রফল, A';
$ec_lang['mpf_pipe_area']='পাইপ ক্ষেত্রফল, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='আপেক্ষিক ক্ষেত্রফল, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='ভেজা পরিধি, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='হাইড্রোলিক ব্যাসার্ধ, R<sub>h</sub>';
$ec_lang['mpf_top_width']='শীর্ষ প্রস্থ, T';
$ec_lang['mpf_froude_number']='ফ্রুড সংখ্যা, Fr';
$ec_lang['mpf_shear_stress']='গড় কৃন্তন পীড়ন, τ';
$ec_lang['mpf_full_flow']='পূর্ণ প্রবাহ, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='পূর্ণ প্রবাহের অনুপাত, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>এটি একটি <em>অসীম দীর্ঘ</em> পাইপের মধ্যে প্রবাহ ও গভীরতা।</dt><dd>পাইপে প্রবাহ প্রবেশ করাতে উল্লেখযোগ্যভাবে বেশি হেডওয়াটার গভীরতার প্রয়োজন হতে পারে। হেডওয়াটার গভীরতা আনুমানিক করতে বেগ হেডের অন্তত ১.৫ গুণ যোগ করুন, অথবা স্ট্যান্ডার্ড কালভার্ট হেডওয়াটার গণনার জন্য <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">আমার ২ মিনিটের টিউটোরিয়াল</a> দেখুন, যেখানে <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> ব্যবহার করা হয়েছে, যা মার্কিন যুক্তরাষ্ট্রের ফেডারেল হাইওয়ে অ্যাডমিনিস্ট্রেশনের বিনামূল্যের কালভার্ট প্রোগ্রাম।</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>স্যানিটারি স্যুয়ার ডিজাইন করছেন?</dt><dd>৪ থেকে ৯৬ ইঞ্চি (১০০ থেকে ২৪০০ মিমি) পাইপের জন্য <a target="_blank" href="/sewslope.php">ন্যূনতম স্যুয়ার ঢাল সারণী</a> দেখুন, যা m/m, mm/m এবং শতাংশে দেওয়া আছে, এবং <a target="_blank" href="/peakfact.php">অতি নিম্ন প্রবাহের পিকিং ফ্যাক্টর</a> সংক্রান্ত গবেষণাটি দেখুন। উভয়ই শুধুমাত্র ইংরেজি ভাষার তথ্যসূত্র নথি।</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='একটি ধনাত্মক লক্ষ্য Q প্রবেশ করান।';
$ec_lang['mpf_solver_no_solution']='কোনো সমাধান নেই: y/d0 = 93.8%-এ Q পাইপের ধারণক্ষমতা অতিক্রম করে (Qmax = {qmax} নির্বাচিত এককে)।';
$ec_lang['mpf_solve_btn']='সমাধান করুন';
$ec_lang['mpf_solve_for_flow']='প্রবাহের জন্য, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='ম্যানিং পাইপ হেড লস';
$ec_lang['mphl_main_title']='বিনামূল্যে অনলাইন ম্যানিং পাইপ হেড লস ক্যালকুলেটর';
$ec_lang['mphl_main_desc']='নির্দিষ্ট পূর্ণ প্রবাহে ম্যানিং ফর্মুলা হেড লস';
$ec_lang['mphl_pipe_length']='দৈর্ঘ্য, L';
$ec_lang['mphl_area']='ক্ষেত্রফল, A';
$ec_lang['mphl_total_junction_k']='স্থানীয় ক্ষতি সহগ, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='ক্ষতি সহগ, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='স্থানীয় ক্ষতি সহগ, km। এই ক্ষতিগুলি পাইপ সংযোগস্থল, প্রবেশপথ, নির্গমপথ, বাঁক এবং ভালভে ঘটে — "গৌণ" শব্দটি প্রচলিত হলেও বিভ্রান্তিকর হতে পারে; একটি ছোট লাইনে এগুলি ঘর্ষণজনিত ক্ষতির সমান বা তার চেয়ে বেশি হতে পারে। সাধারণ k মান: তীক্ষ্ণ প্রবেশমুখ 0.5, প্রতিটি 45° বাঁক 0.2–0.3, গেট ভালভ (সম্পূর্ণ খোলা) 0.1, প্রজাপতি ভালভ 0.2, নির্গমপথ (জলাধার বা বায়ুমণ্ডলে) 1.0। মোট km পেতে সব ফিটিং যোগ করুন। ডিফল্ট মান 2.0 একটি প্রবেশপথ, একটি নির্গমপথ এবং দুটি 45° বাঁক ধরে নেয়।';
$ec_lang['mphl_friction_slope']='ঘর্ষণ ঢাল';
$ec_lang['mphl_friction_loss']='ঘর্ষণ ক্ষতি, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='স্থানীয় ক্ষতি, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='মোট ক্ষতি, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='ভাটির EGL';
$ec_lang['mphl_egl_2']='উজানের EGL';
$ec_lang['mphl_hgl_egl_tip']='যেখানে পাইপ হাইড্রোলিক গ্রেড লাইনের উপরে উঠে যায়, সেখানে এই ফলাফল বৈধ নাও হতে পারে।';
$ec_lang['mphl_note_1']='<dl><dt>এই ক্যালকুলেটর দুই প্রান্তের মধ্যে পাইপের প্রোফাইল অনুকরণ করে না।</dt><dd>যদি কোনো বিন্দুতে HGL পাইপের শীর্ষের নিচে চলে যায়, তবে এই গণনা বৈধ নাও হতে পারে।</dd><dt>উন্মুক্ত ইনলেট (কালভার্ট) অবস্থার জন্য ইনলেট নিয়ন্ত্রণ পরিস্থিতি পরীক্ষা করা প্রয়োজন।</dt><dd>১. উজানের HGL অবশ্যই উজানের স্বাভাবিক গভীরতা প্রবাহ উচ্চতার উপরে থাকতে হবে (এবং পাইপের চেয়েও উঁচু হতে হবে!)।</dd><dd>২. একটি কালভার্টের হেডওয়াটার উজানের HGL-এর চেয়ে উজানের EGL দ্বারা আরও ভালোভাবে প্রকাশ করা হয়।</dd><dd>৩. সহজ স্ট্যান্ডার্ড কালভার্ট হেডওয়াটার গণনার জন্য <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">আমার ২ মিনিটের টিউটোরিয়াল</a> দেখুন, যেখানে <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> ব্যবহার করা হয়েছে, যা মার্কিন যুক্তরাষ্ট্রের ফেডারেল হাইওয়ে অ্যাডমিনিস্ট্রেশনের বিনামূল্যের কালভার্ট প্রোগ্রাম।</dd><dd>৪. এই পৃষ্ঠাটি শুধুমাত্র আউটলেট নিয়ন্ত্রণের ক্ষেত্রে সমাধান করে: একটি সম্পূর্ণ পূর্ণ পাইপ, যেখানে ডাউনস্ট্রিম অবস্থা হেড নির্ধারণ করে। কালভার্ট ডিজাইনের কাজ হলো ইনলেট নিয়ন্ত্রণ নাকি আউটলেট নিয়ন্ত্রণ প্রাধান্য পাচ্ছে তা নির্ধারণ করা, তাই যেকোনো একটি সম্ভাবনা থাকলেই HY-8 ব্যবহার করুন।</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='ম্যানিং ট্র্যাপিজোয়েডাল চ্যানেল';
$ec_lang['mtc_main_title']='বিনামূল্যে অনলাইন ম্যানিং ফর্মুলা ট্র্যাপিজোয়েডাল চ্যানেল ক্যালকুলেটর';
$ec_lang['mtc_main_desc']='নির্দিষ্ট ঢাল ও গভীরতায় ম্যানিং ফর্মুলা অভিন্ন ট্র্যাপিজোয়েডাল চ্যানেল প্রবাহ';
$ec_lang['mtc_bottom_width']='তলার প্রস্থ, b';
$ec_lang['mtc_side_slope_1']='পার্শ্ব ঢাল ১, z<sub>1</sub> (অনুভূমিক/উল্লম্ব)';
$ec_lang['mtc_side_slope_2']='পার্শ্ব ঢাল ২, z<sub>2</sub> (অনুভূমিক/উল্লম্ব)';
$ec_lang['mtc_channel_slope']='চ্যানেল ঢাল, S';
$ec_lang['mtc_flow_depth']='প্রবাহ গভীরতা, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">বাঁক কোণ, β</a><span class="ec-help" title="পাথরের স্তরের আকার নির্ধারণের জন্য। চিত্রের জন্য লিঙ্ক অনুসরণ করুন।"><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="পানির সাপেক্ষে ঘনত্ব। চূর্ণ পাথরের জন্য সাধারণত ≈ 2.65।">পাথরের আপেক্ষিক গুরুত্ব, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='নকশা পাথরের আকার, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='নকশা পাথরের আকারের জন্য n (স্ট্রিকলার পদ্ধতি)';
$ec_lang['mtc_n_blodgett']='নকশা পাথরের আকারের জন্য n (ব্লডগেট পদ্ধতি)';
$ec_lang['mtc_n_bathurst']='নকশা পাথরের আকারের জন্য n (বাথার্স্ট পদ্ধতি)';
$ec_lang['mtc_n_pi']='নকশা পাথরের আকারের জন্য n (Phillips & Ingersoll পদ্ধতি)';
$ec_lang['mtc_blodgett_v_bathurst']='ব্লডগেট বনাম বাথার্স্ট';
$ec_lang['mtc_pi_range_check']='P&I পরিসর যাচাই';
$ec_lang['mtc_pi_ok']='d50, P&I পরিসরের মধ্যে';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='পরিসরের বাইরে';
$ec_lang['mtc_pi_tip']='এই সমীকরণটি যে 0.28–0.36 ft তথ্য-পরিসর থেকে তৈরি করা হয়েছে, তার বাইরে বহির্বিস্তার করা হচ্ছে — একে সঠিক নকশার ভিত্তি নয়, বরং একটি মোটামুটি যাচাই হিসেবে বিবেচনা করুন';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Isbash (1936) এবং Maricopa County, Arizona, US অনুযায়ী।">তলদেশের জন্য প্রয়োজনীয় কৌণিক পাথরের আকার, D<sub>50</sub> (Isbash ও MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Isbash (1936) এবং Maricopa County, Arizona, US অনুযায়ী।">পার্শ্ব ঢাল ১-এর জন্য প্রয়োজনীয় কৌণিক পাথরের আকার, D<sub>50</sub> (Isbash ও MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Isbash (1936) এবং Maricopa County, Arizona, US অনুযায়ী।">পার্শ্ব ঢাল ২-এর জন্য প্রয়োজনীয় কৌণিক পাথরের আকার, D<sub>50</sub> (Isbash ও MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='প্রতিটি হাইড্রোলিক সময় ধাপে এই নেটওয়ার্কটি সমাধান করুন।';
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Maynord, Ruff, এবং Abt (1989) অনুযায়ী। একটি বাঁকে পাথরকে গড়ের ৪/৩ গুণ বাঁক বেগের জন্য আকার দেওয়া হয়, California Division of Highways (1970) অনুযায়ী; Maynord-এর নিজস্ব ১.৫ প্রাকৃতিক চ্যানেলে প্রযোজ্য।">প্রয়োজনীয় কৌণিক পাথরের আকার, D<sub>50</sub> (Maynord, Ruff, এবং Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='প্রয়োজনীয় কৌণিক পাথরের আকার, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='অভিন্ন-প্রবাহ অনুমানের জন্য বেগ যুক্তিসঙ্গত।';
$ec_lang['mtc_vel_low']='বেগ কম; পলি জমার ঝুঁকি।';
$ec_lang['mtc_vel_high']='বেগ বেশি এবং তা বাস্তবসম্মত নাও হতে পারে; নালার আস্তরণের ক্ষয়, বাঁকে অতিরিক্ত গভীরতা এবং প্রসারণ বা বাধার স্থানে শক্তি ক্ষয় পরীক্ষা করুন।';
$ec_lang['mtc_iteration_tip']='আপনার লক্ষ্য প্রবাহের জন্য একটি সমান পাথরের আকারের দিকে স্বয়ংক্রিয়ভাবে পুনরাবৃত্তি করতে একটি রুক্ষতা বিকল্প (ব্লডগেট–বাথার্স্ট প্রস্তাবিত) এবং একটি পাথরের আকার বিকল্প (Isbash প্রস্তাবিত) নির্বাচন করুন। সম্পূর্ণ পদ্ধতির জন্য নিচের নোট দেখুন, অথবা পুনরাবৃত্তি এড়াতে নিজের রুক্ষতার মান (নির্দেশনার জন্য লিঙ্ক দেখুন) লিখুন এবং পাথরের আকার উপেক্ষা করুন।';
$ec_lang['mtc_note_1']='<dl><dt>স্বয়ংক্রিয় পাথরের আকার ও রুক্ষতা নকশা পুনরাবৃত্তি</dt><dd>একটি রুক্ষতা বিকল্প (Blodgett–Bathurst প্রস্তাবিত) এবং একটি নকশা পাথরের আকার বিকল্প (Isbash প্রস্তাবিত) বেছে নিন। একটি সুষম পাথরের আকার দিয়ে আপনার লক্ষ্য প্রবাহে পৌঁছাতে গভীরতা ও পাথরের আকারের নিরাপত্তা গুণক সমন্বয় করুন। আপনি যখনই একটি ইনপুট পরিবর্তন করেন, ক্যালকুলেটরটি এই ধাপগুলো পুনরাবৃত্তি করে: ১. নকশা পাথরের আকার থেকে রুক্ষতা গণনা করা হয়। ২. আপনার বেছে নেওয়া পদ্ধতি থেকে রুক্ষতার মানটি রুক্ষতা ইনপুটে কপি করা হয়। ৩. চ্যানেল প্রবাহ ও প্রয়োজনীয় পাথরের আকার গণনা করা হয়। ৪. নকশা পাথরের আকার সমন্বয় করা হয়। ৫. নকশা পাথরের আকারের ত্রুটি খুব ছোট না হওয়া পর্যন্ত পুনরাবৃত্তি করা হয়।</dd><dt>মৌলিক ক্যালকুলেটর (পুনরাবৃত্তি ছাড়া)</dt><dd>আপনার কাঙ্ক্ষিত রুক্ষতার মান লিখুন। নকশা পাথরের আকার ইনপুট এলাকা উপেক্ষা করুন।</dd></dl>';
$ec_lang['mtc_note_2_term']='বেগ পরীক্ষা';
$ec_lang['mtc_note_2_def']='উচ্চ বেগ নির্দেশ করে যে একটি বড় উচ্চতা পতন ঘটেছে যা এত উচ্চ নির্দিষ্ট শক্তি সৃষ্টি করেছে। প্রসারণ, বাঁক বা বাধার স্থানে সেই শক্তি দ্রুত ক্ষয় হতে পারে। এই স্থানের জন্য এটি যুক্তিসঙ্গত কিনা যাচাই করুন।';
$ec_lang['mtc_solver_no_solution']='এই চ্যানেল ইনপুট দিয়ে প্রদত্ত Q-এর জন্য কোনো সমাধান পাওয়া যায়নি।';
// Weir Flow Simple
$ec_lang['ws_main_menu']='সহজ ওয়্যার বা বাঁধ প্রবাহ';
$ec_lang['ws_main_title']='বিনামূল্যে অনলাইন সহজ বিস্তৃত-ক্রেস্ট ওয়্যার প্রবাহ ক্যালকুলেটর';
$ec_lang['ws_main_desc']='সহজ বিস্তৃত-ক্রেস্ট ওয়্যার বা বাঁধ প্রবাহ ক্যালকুলেটর';
$ec_lang['ws_weirLength']='ওয়্যার দৈর্ঘ্য, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="পানির একক ওজনপ্রতি শক্তি — পানির স্তম্ভের একটি উচ্চতা, চাপ নয়">হেড, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='ওয়্যার সহগ, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='নোট';
$ec_lang['ws_notes_we_term']='ওয়্যার সমীকরণ';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='অসমান ক্রেস্টের ওয়্যার প্রবাহ';
$ec_lang['wi_main_title']='বিনামূল্যে অনলাইন বিভাজিত, পরিবর্তনশীল গভীরতার অনিয়মিত ওয়্যার প্রবাহ ক্যালকুলেটর';
$ec_lang['wi_main_desc']='অনিয়মিত ওয়্যার বা বাঁধ প্রবাহ ক্যালকুলেটর';
$ec_lang['wi_weirPoints']='ওয়্যার বিন্দু';
$ec_lang['wi_pondingHeight']='পন্ডিং উচ্চতা';
$ec_lang['wi_incrementalFlow']='বৃদ্ধিমূলক প্রবাহ';
$ec_lang['wi_cumulativeFlow']='ক্রমবর্ধমান প্রবাহ';
$ec_lang['wi_notes_we_def']='q = যদি (দৈর্ঘ্য = 0) তাহলে 0 অন্যথায় যদি (ঢাল=0) তাহলে cw*দৈর্ঘ্য*d<sub>0</sub><sup>1.5</sup> অন্যথায় cw/(2.5*ঢাল) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) যেখানে d<sub>1</sub> এবং d<sub>0</sub> সর্বদা শূন্য বা ধনাত্মক';
// Orifice Flow
$ec_lang['or_main_menu']='অরিফিস বা ছিদ্র প্রবাহ';
$ec_lang['or_main_title']='বিনামূল্যে অনলাইন অরিফিস বা ছিদ্র প্রবাহ ক্যালকুলেটর';
$ec_lang['or_main_desc']='অরিফিস বা ছিদ্র প্রবাহ — মুক্ত বা নিমজ্জিত';
$ec_lang['or_shape_circular']='গোলাকার';
$ec_lang['or_shape_rectangular']='আয়তাকার';
$ec_lang['or_diameter']='<span class="ec-help" title="গোলাকারের জন্য ব্যাস; আয়তাকারের জন্য উচ্চতা">ব্যাস বা উচ্চতা, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="শুধুমাত্র আয়তাকার খোলার জন্য">প্রস্থ, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="খোলার সর্বনিম্ন বিন্দু">ইনভার্ট উচ্চতা <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='উজানের পানির উচ্চতা';
$ec_lang['or_twe']='ভাটির পানির উচ্চতা';
$ec_lang['or_cd']='স্রাব সহগ, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='কেন্দ্রবিন্দুর উচ্চতা';
$ec_lang['or_head']='<span class="ec-help" title="পানির একক ওজনপ্রতি শক্তি — পানির স্তম্ভের একটি উচ্চতা, চাপ নয়">কার্যকর হেড, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='খোলার ক্ষেত্রফল, A';
$ec_lang['or_regime']='অরিফিস ব্যবস্থা পরীক্ষা';
$ec_lang['or_regime_valid']='মুক্ত বহির্গমন';
$ec_lang['or_regime_submerged']='নিমজ্জিত অরিফিস';
$ec_lang['or_regime_submerged_tip']='TWE কেন্দ্রবিন্দুর উপরে — অরিফিস ব্যবস্থা তবুও বৈধ';
$ec_lang['or_regime_warn']='অরিফিস ব্যবস্থার বাইরে';
$ec_lang['or_regime_warn_tip']='উজানের পানির স্তর খোলার ক্রাউনের (শীর্ষ, সর্বোচ্চ ভেতরের বিন্দু) নিচে';
$ec_lang['or_regime_twe_above_hwe']='ইনপুট পরীক্ষা করুন';
$ec_lang['or_regime_twe_above_hwe_tip']='ভাটির পানি (TWE) উজানের পানির (HWE) উপরে';
$ec_lang['or_notes_1_term']='অরিফিস সমীকরণ';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh)। মুক্ত বহির্গমন: h = HWE − কেন্দ্রবিন্দু। নিমজ্জিত প্রবাহ (ইনভার্টের উপরে TWE): h = HWE − TWE।';
$ec_lang['or_notes_2_term']='অরিফিস ব্যবস্থা';
$ec_lang['or_notes_2_def']='অরিফিস প্রবাহ সমীকরণ প্রযোজ্য হয় যখন উজানের পানির পৃষ্ঠ খোলার ক্রাউনের (শীর্ষের) উপরে থাকে। উজানের পানি ক্রাউনের নিচে থাকলে, ওয়্যার সমীকরণ ব্যবহার করুন।';
$ec_lang['or_notes_3_term']='স্রাব সহগ';
$ec_lang['or_notes_3_def']='তীক্ষ্ণ-প্রান্ত অরিফিসের জন্য C<sub>d</sub> প্রায় 0.60–0.65 পর্যন্ত। গোলাকার বা পুনঃপ্রবেশী ইনলেট ভিন্ন মান ব্যবহার করে। নির্দেশিকার জন্য <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> বা HEC-RAS হাইড্রোলিক রেফারেন্স ম্যানুয়াল দেখুন।';
$ec_lang['or_notes_4_term']='নিমজ্জন';
$ec_lang['or_notes_4_def']='যখন TWE খোলার ইনভার্টের উপরে থাকে, এই ক্যালকুলেটর স্বয়ংক্রিয়ভাবে h = HWE − TWE ব্যবহার করে নিমজ্জিত অরিফিস সমীকরণ প্রয়োগ করে। যখন TWE ইনভার্টে বা তার নিচে থাকে, মুক্ত বহির্গমন ধরে নেওয়া হয় এবং h = HWE − কেন্দ্রবিন্দু।';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='মাইক্রো-হাইড্রো বিদ্যুৎ';
$ec_lang['mhp_main_title']='বিনামূল্যে অনলাইন মাইক্রো-হাইড্রো বিদ্যুৎ ক্যালকুলেটর';
$ec_lang['mhp_main_desc']='স্বাভাবিক নদীপ্রবাহ (রান-অব-রিভার) মাইক্রো-হাইড্রো বিদ্যুৎ উৎপাদন ক্যালকুলেটর';
$ec_lang['mhp_gross_head']='মোট জলশীর্ষ, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="চাপ পাইপ (সরবরাহ পাইপ) ব্যাস">চাপ পাইপ ব্যাস, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='দৈর্ঘ্য, L';
$ec_lang['mhp_efficiency']='প্লান্ট দক্ষতা, η (0–1)';
$ec_lang['mhp_vel_check']='বেগ পরীক্ষা';
$ec_lang['mhp_hl_check']='পানিশীর্ষ ক্ষতি পরীক্ষা';
$ec_lang['mhp_hnet']='নিট জলশীর্ষ, H<sub>net</sub>';
$ec_lang['mhp_power']='শক্তি আউটপুট, P';
$ec_lang['mhp_annual_kwh']='বার্ষিক শক্তি (P)';
$ec_lang['mhp_vel_low']='বেগ কম; পলি জমা ও বাতাস প্রবেশের ঝুঁকি।';
$ec_lang['mhp_vel_high']='বেগ বেশি; রূপান্তর ক্ষতি, উপলব্ধ শক্তি এবং জল-হাতুড়ির (ওয়াটার হ্যামার) ঝুঁকি পরীক্ষা করুন।';
$ec_lang['mhp_vel_ok_short']='ঠিক আছে';
$ec_lang['mhp_vel_high_short']='বেশি';
$ec_lang['mhp_vel_low_short']='কম';
$ec_lang['mhp_vel_ok_tip']='বেগ চাপ পাইপ নকশার জন্য কার্যকর সীমার মধ্যে রয়েছে।';
$ec_lang['mhp_hl_ok_tip']='জলশীর্ষ ক্ষতি মোট জলশীর্ষের ১০%-এর কম। এই পাইপের আকারটি অর্থনৈতিক।';
$ec_lang['mhp_hl_warn_tip']='জলশীর্ষ ক্ষতি মোট জলশীর্ষের ১০%-এর বেশি। একটি বড় পাইপ বিবেচনা করুন।';
$ec_lang['mhp_hl_bad_tip']='জলশীর্ষ ক্ষতি মোট জলশীর্ষের ২০%-এর বেশি। পাইপের আকার পরিবর্তন করুন।';
$ec_lang['mhp_notes_1_term']='পানিশীর্ষ ক্ষতি';
$ec_lang['mhp_notes_1_def']='মোট চাপ পাইপ (সরবরাহ পাইপ) ক্ষতি h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, যেখানে h<sub>f</sub> = f(L/D)(v²/2g) হলো ডার্সি-ওয়েইসবাক ঘর্ষণ ক্ষতি এবং h<sub>m</sub> = k<sub>m</sub>·v²/2g প্রবেশ, বাঁক ও ভালভের ক্ষতি অন্তর্ভুক্ত করে। নিট জলশীর্ষ H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>।';
$ec_lang['mhp_notes_2_term']='বেগ';
$ec_lang['mhp_notes_2_def']='উপলব্ধ পতন ও পাইপ খরচের জন্য বেগ যুক্তিসঙ্গত কিনা তা পরীক্ষা করুন। খুব কম বেগ অতিরিক্ত বড় আকারের ইঙ্গিত দিতে পারে; খুব বেশি বেগ ঘর্ষণ ক্ষতি ও জল-হাতুড়ির (ওয়াটার হ্যামার) ঝুঁকি বাড়াতে পারে।';
$ec_lang['mhp_notes_3_term']='পানিশীর্ষ ক্ষতির লক্ষ্যমাত্রা';
$ec_lang['mhp_notes_3_def']='মোট জলশীর্ষের 10% এর নিচে পেনস্টক (সরবরাহ পাইপ) ক্ষতি সাধারণত অর্থনৈতিক। পাইপ খরচ ও হারানো শক্তির মধ্যে সর্বোত্তম ভারসাম্য প্রায়ই সেসব স্থানে 4–6% এর কাছাকাছি হয় যেখানে বিদ্যুতের দাম বেশি সীমার দিকে থাকে।';
$ec_lang['mhp_notes_6_term']='দক্ষতা';
$ec_lang['mhp_notes_6_def']='মাইক্রো-হাইড্রোতে প্রচলিত Pelton ও ক্রস-ফ্লো টার্বাইনের জন্য সাধারণ প্লান্ট দক্ষতা η সাধারণত 0.70 থেকে 0.85 পর্যন্ত হয়। রক্ষণশীল প্রাথমিক অনুমান হিসেবে 0.75 ব্যবহার করুন।';
$ec_lang['mhp_notes_7_term']='বার্ষিক শক্তি';
$ec_lang['mhp_notes_7_def']='বার্ষিক শক্তি ক্রমাগত পূর্ণ-প্রবাহ পরিচালনার (8760 ঘণ্টা/বছর) অনুমানে গণনা করা হয়। ঋতুভিত্তিক প্রবাহ পরিবর্তন, রক্ষণাবেক্ষণের কারণে বন্ধ থাকা এবং লোড ফ্যাক্টরের কারণে প্রকৃত উৎপাদন কম হবে।';

// Orifice Drain Time
$ec_lang['odt_main_menu']='পুকুর ও ট্যাংক নিষ্কাশন সময়';
$ec_lang['odt_main_title']='বিনামূল্যে অনলাইন পুকুর, বেসিন ও ট্যাংক নিষ্কাশন সময় ক্যালকুলেটর (অরিফিস)';
$ec_lang['odt_main_desc']='পুকুর, বেসিন বা ট্যাংক নিষ্কাশন সময় — অরিফিস আউটলেট, শঙ্কু আয়তন পদ্ধতি';
$ec_lang['odt_h1_elev']='শুরুর জলপৃষ্ঠ উচ্চতা';
$ec_lang['odt_a1']='শুরুর ক্ষেত্রফল, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='শেষ জলপৃষ্ঠ উচ্চতা';
$ec_lang['odt_a0']='অরিফিস স্তরের ক্ষেত্রফল, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="শঙ্কু মডেল থেকে শেষ উচ্চতায় ইন্টারপোলেট করা">শেষ ক্ষেত্রফল, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='শেষ উচ্চতা পরীক্ষা';
$ec_lang['odt_h2_ok']='শেষ উচ্চতা অরিফিস ক্রাউনের উপরে';
$ec_lang['odt_h2_warn']='শেষ উচ্চতা অরিফিস ক্রাউনে বা তার নিচে';
$ec_lang['odt_h2_warn_tip']='অরিফিসের ক্রাউন = কেন্দ্রচ্যুতি + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="ব্যাস (গোলাকার) বা উচ্চতা (আয়তাকার)">অরিফিস D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="শুধুমাত্র আয়তাকার">অরিফিস প্রস্থ, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='নিষ্কাশন সময় (সেকেন্ড)';
$ec_lang['odt_t_min']='নিষ্কাশন সময় (মিনিট)';
$ec_lang['odt_t_hr']='নিষ্কাশন সময় (ঘণ্টা)';
$ec_lang['odt_t_day']='নিষ্কাশন সময় (দিন)';
$ec_lang['odt_notes_1_term']='সূত্র';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) হেড H থেকে অরিফিস পর্যন্ত নিষ্কাশন সময় দেয়। নিষ্কাশন সময় = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), যেখানে H<sub>1</sub> = শুরুর উচ্চতা − অরিফিস উচ্চতা, H<sub>2</sub> = শেষ উচ্চতা − অরিফিস উচ্চতা।';
$ec_lang['odt_notes_2_term']='পদ্ধতি';
$ec_lang['odt_notes_2_def']='শঙ্কু আয়তন পদ্ধতি পুকুর বা বেসিনকে প্রাথমিক জলের পৃষ্ঠে A<sub>1</sub> এবং অরিফিস কেন্দ্রচ্যুতি উচ্চতায় A<sub>0</sub> এর মধ্যে একটি শঙ্কু অংশ হিসাবে মডেল করে। A<sub>2</sub>, শেষ উচ্চতায় পুকুর ক্ষেত্রফল, শঙ্কু অংশ মডেল ব্যবহার করে A<sub>1</sub> এবং A<sub>0</sub> থেকে ইন্টারপোলেট করা হয়। শুরু থেকে শেষ উচ্চতা পর্যন্ত নিষ্কাশন সময় H<sub>1</sub> থেকে অরিফিস পর্যন্ত মোট নিষ্কাশন সময় বিয়োগ H<sub>2</sub> থেকে অরিফিস পর্যন্ত অবশিষ্ট নিষ্কাশন সময়ের সমান।';
$ec_lang['odt_h1']='<span class="ec-help" title="শুরুর জলপৃষ্ঠ উচ্চতা বিয়োগ অরিফিস কেন্দ্রচ্যুতি উচ্চতা">শুরুর হেড, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='সর্বোচ্চ প্রবাহ, Q<sub>max</sub>';
$ec_lang['odt_vol']='নিষ্কাশিত আয়তন';
$ec_lang['odt_sketch_start']='শুরু';
$ec_lang['odt_sketch_end']='শেষ';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='ড্রিপার ব্যবধান, S<sub>e</sub>';
$ec_lang['ip_sl']='ল্যাটারাল ব্যবধান, S<sub>l</sub>';
$ec_lang['ip_n_e']='প্রতি ল্যাটারালে ড্রিপার, n<sub>e</sub>';
$ec_lang['ip_n_l']='প্রতি জোনে ল্যাটারাল, n<sub>l</sub>';
$ec_lang['ip_d']='লক্ষ্য প্রয়োগ গভীরতা, d';
$ec_lang['ip_a_e']='প্রতি ড্রিপারে ক্ষেত্রফল, A<sub>e</sub>';
$ec_lang['ip_pr']='পানি প্রয়োগ হার, PR';
$ec_lang['ip_q_lat']='প্রতি ল্যাটারালে প্রবাহ, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='জোন প্রবাহ, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='চলমান সময় (ঘণ্টা)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='খাল অনুস্রবণ';
$ec_lang['cs_main_title']='বিনামূল্যে অনলাইন খাল অনুস্রবণ ও পরিবহন দক্ষতা ক্যালকুলেটর';
$ec_lang['cs_main_desc']='খাল অনুস্রবণ ক্ষতি & পরিবহন দক্ষতা — প্রবাহ-প্রবেশ-প্রবাহ-বহির্গমন পদ্ধতি';
$ec_lang['cs_Q_in']='প্রবাহ-প্রবেশ, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='প্রবাহ-বহির্গমন, Q<sub>out</sub>';
$ec_lang['cs_L']='অংশের দৈর্ঘ্য, L';
$ec_lang['cs_Q_loss']='অনুস্রবণ ক্ষতির হার, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='পরিমাপ যাচাই';
$ec_lang['cs_pct_loss']='হারানো ভগ্নাংশ';
$ec_lang['cs_Ec']='পরিবহন দক্ষতা, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='দক্ষতা মূল্যায়ন';
$ec_lang['cs_Vol_day']='দৈনিক হারানো আয়তন';
$ec_lang['cs_Vol_year']='বার্ষিক হারানো আয়তন';
$ec_lang['cs_Q_loss_per_L']='প্রতি একক দৈর্ঘ্যে ক্ষতি, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='পানির মূল্য';
$ec_lang['cs_lining_cost']='আস্তরণ খরচ';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="আস্তরণের পর পরিবহন দক্ষতার লক্ষ্য; ভগ্নাংশ 0–1">আস্তরণ লক্ষ্য, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='আস্তরণ ক্ষেত্রফল, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='বার্ষিক হারানো মূল্য';
$ec_lang['cs_annual_value_recovered']='বার্ষিক পুনরুদ্ধারকৃত মূল্য';
$ec_lang['cs_lining_total_cost']='মোট আস্তরণ খরচ';
$ec_lang['cs_payback_years']='<span class="ec-help" title="সরল পেব্যাক = মোট আস্তরণ খরচ ÷ বার্ষিক পুনরুদ্ধারকৃত মূল্য">পেব্যাক সময়কাল <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — অনুস্রবণ শনাক্ত হয়েছে';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — পরিমাপযোগ্য ক্ষতি নেই';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — পরিমাপ যাচাই করুন';
$ec_lang['cs_Ec_good']='ভালো — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='মোটামুটি — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='খারাপ — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='প্রবাহ-প্রবেশ-প্রবাহ-বহির্গমন পদ্ধতি একটি খাল অংশের মাথা ও লেজে প্রবাহ পরিমাপ করে অনুস্রবণ অনুমান করে: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>। পরিবহন দক্ষতা E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>। বার্ষিক আয়তন ক্রমাগত পূর্ণ-প্রবাহ পরিচালনা ধরে নেয়; মৌসুমি বা আংশিক-প্রবাহ খালে প্রকৃত ক্ষতি কম হয়।';
$ec_lang['cs_notes_2_term']='দক্ষতা রেটিং';
$ec_lang['cs_notes_2_def']='সাধারণ অরক্ষিত মাটির খাল: E<sub>c</sub> = 60–80%। সুরক্ষিত মাটির খাল: 75–85%। কংক্রিট-আস্তরণযুক্ত খাল: 90–98%। প্রবাহ-প্রবেশের ৩০%-এর বেশি অনুস্রবণ ক্ষতি প্রায়ই আস্তরণ বিনিয়োগকে ন্যায্যতা দেয়। (USBR, FAO)';
$ec_lang['cs_notes_3_term']='আস্তরণ পেব্যাক';
$ec_lang['cs_notes_3_def']='যেকোনো সামঞ্জস্যপূর্ণ মুদ্রায় পানির মূল্য ও আস্তরণ খরচ লিখুন। আস্তরণ ক্ষেত্রফল = অংশের দৈর্ঘ্য × ভেজা পরিধি — পরিমাপকৃত প্রবাহ গভীরতায় খালের প্রস্থচ্ছেদের ভেজা পরিধি (তলার প্রস্থ প্লাস উভয় ভেজা ঢাল)। বার্ষিক পুনরুদ্ধারকৃত মূল্য ধরে নেয় যে আস্তরণযুক্ত খাল ক্রমাগতভাবে লক্ষ্য E<sub>c</sub> অর্জন করে। মৌসুমি খালের ক্ষেত্রে বা আস্তরণ লক্ষ্য দক্ষতায় না পৌঁছালে প্রকৃত পেব্যাক দীর্ঘতর হবে।';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, ৩য় সংস্করণ (2001)। FAO সেচ ও নিষ্কাশন পেপার 57 (1999)।';
// About
$ec_lang['about_main_menu']='সম্পর্কে';
$ec_lang['install_main_menu']='ইনস্টল করুন';
$ec_lang['install_main_title']='EngCalcs ইনস্টল করুন';
$ec_lang['install_main_desc']='অফলাইন ব্যবহারের জন্য আপনার ডিভাইসে যোগ করুন';
$ec_lang['install_intro']='EngCalcs একটি প্রোগ্রেসিভ ওয়েব অ্যাপ (PWA)। একবার ইনস্টল করলে, সব ক্যালকুলেটর সম্পূর্ণ অফলাইনে কাজ করে — কোনো ইন্টারনেট সংযোগের প্রয়োজন হয় না।';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Chrome-এ যেকোনো ক্যালকুলেটর পৃষ্ঠা খুলুন।</li><li>উপরের নেভিগেশন বারে <strong>⬇ ইনস্টল</strong> বোতামে চাপুন, অথবা ব্রাউজার মেনুতে (⋮) চাপুন এবং <strong>হোম স্ক্রিনে যোগ করুন</strong> নির্বাচন করুন।</li><li>প্রদর্শিত প্রম্পটে <strong>ইনস্টল</strong>-এ চাপুন।</li><li>EngCalcs আপনার হোম স্ক্রিনে দেখা যাবে এবং অফলাইনে কাজ করবে।</li>';
$ec_lang['install_now_btn']='⬇ এখনই ইনস্টল করুন';
$ec_lang['install_prompt_unavailable']='ইনস্টল প্রম্পট পাওয়া যাচ্ছে না — এর পরিবর্তে আপনার ব্রাউজার মেনু ব্যবহার করুন।';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Safari-তে যেকোনো ক্যালকুলেটর পৃষ্ঠা খুলুন।</li><li><strong>শেয়ার</strong> বোতামে চাপুন (উপরের দিকে তীরচিহ্নযুক্ত বাক্স)।</li><li>নিচে স্ক্রল করুন এবং <strong>Add to Home Screen</strong>-এ চাপুন।</li><li><strong>Add</strong>-এ চাপুন। EngCalcs আপনার হোম স্ক্রিনে দেখা যাবে।</li>';
$ec_lang['install_ios_note']='iOS-এ, ইনস্টল করতে সবসময় শেয়ার মেনু ব্যবহার করতে হয় — এখানে কোনো স্বয়ংক্রিয় ইনস্টল প্রম্পট নেই।';
$ec_lang['install_desktop_heading']='ডেস্কটপ (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>যেকোনো ক্যালকুলেটর পৃষ্ঠা খুলুন।</li><li>ব্রাউজারের অ্যাড্রেস বারে <strong>ইনস্টল আইকনে</strong> (⊕ বা কম্পিউটার আইকন) ক্লিক করুন, অথবা ব্রাউজার মেনু খুলে <strong>Install EngCalcs…</strong> নির্বাচন করুন।</li><li><strong>ইনস্টল</strong>-এ ক্লিক করুন। EngCalcs একটি স্বতন্ত্র অ্যাপ উইন্ডো হিসেবে খুলবে।</li>';
$ec_lang['install_firefox_heading']='Firefox / অন্যান্য ব্রাউজার';
$ec_lang['install_firefox_body']='আপনার ব্রাউজার যদি কোনো ইনস্টল অপশন না দেয়, তাতে কিছু হারাবে না: ব্রাউজারে স্বাভাবিকভাবে ক্যালকুলেটরগুলো ব্যবহার করুন, এবং আপনার প্রথমবার দেখার পর পৃষ্ঠাগুলো অফলাইন ব্যবহারের জন্য স্বয়ংক্রিয়ভাবে ক্যাশ হয়ে যায়। ডেস্কটপে Firefox এই সাধারণ ক্ষেত্র।';
$ec_lang['install_cached_heading']='কী কী সংরক্ষিত (ক্যাশ) হয়';
$ec_lang['install_cached_body']='EngCalcs প্রথমবার ইনস্টল করার সময়, সব ক্যালকুলেটর পৃষ্ঠা এবং তাদের সহায়ক ফাইল (স্ক্রিপ্ট, স্টাইল) স্বয়ংক্রিয়ভাবে আপনার ডিভাইসে সংরক্ষিত হয়। এরপর, ইন্টারনেট সংযোগ ছাড়াই সবকিছু কাজ করে। আপনার সর্বশেষ অনলাইন ব্যবহারের ভাষা পছন্দ মনে রাখা হয়।';
$ec_lang['contact_main_menu']='যোগাযোগ';
$ec_lang['about_main_title']='HawsEDC ইঞ্জিনিয়ারিং ক্যালকুলেটর সম্পর্কে';
$ec_lang['about_main_desc']='লক্ষ্য, মুক্ত সফটওয়্যার এবং অবদান';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>লক্ষ্য</h3><p>HawsEDC ইঞ্জিনিয়ারিং ক্যালকুলেটর বিশ্বজুড়ে প্রকৌশলী ও মাঠকর্মীদের সেবার জন্য তৈরি — বিশেষত যারা পানি-সংকটগ্রস্ত, সীমিত সম্পদের বা অবহেলিত অঞ্চলে কাজ করেন। এই সরঞ্জামগুলো একটি বৃহত্তর মানবিক লক্ষ্যের অংশ: প্রতিটি মানুষকে সবচেয়ে ব্যবহারিক ও কার্যকর উপায়ে জানানো <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">যে তারা চিরকাল ভালোবাসার ও লালিত, তাদের ভয় পাওয়ার কিছু নেই, এবং তারা সব কিছু নষ্ট করে ফেলবে না</a>।</p><p>ক্যালকুলেটরগুলো মাধ্যম মাত্র। গন্তব্য একটি কষ্টমুক্ত বিশ্ব।</p><h3>মুক্ত ও ওপেন সোর্স লাইসেন্স</h3><p>সমস্ত কোড <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 বা পরবর্তী</a> সংস্করণের অধীনে প্রকাশিত — স্বাধীনতার অর্থে মুক্ত। আপনি একই শর্তে কোড ব্যবহার, অধ্যয়ন, পরিবর্তন এবং পুনরায় বিতরণ করতে পারেন।</p><p>যে ওয়েবসাইট এটি পরিবেশন করে তা আজ এবং ২০১০ সাল থেকে বিনামূল্যে দেওয়া হচ্ছে; কোনো দিন যদি তা সম্ভব না হয়, তবু সফটওয়্যারটি আপনার নিজের চালানোর জন্য থাকবে।</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>সোর্স কোড</h3><p>সম্পূর্ণ সোর্স কোড GitHub-এ সর্বজনীনভাবে পাওয়া যায়:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>আপনি সেখানে কোড ব্রাউজ করতে, সমস্যা দাখিল করতে বা রিপোজিটরি ফোর্ক করতে পারেন।</p><h3>অবদান</h3><p>সব ধরনের সাহায্য স্বাগত। <a href="contact.php">Tom Haws-এর সাথে যোগাযোগ করুন</a>।</p><ul><li><strong>অনুবাদ:</strong> ভালো শব্দচয়নের পরামর্শ দিন। কোনো ভাষা উন্নত করুন বা নতুন ভাষা যোগ করুন।</li><li><strong>বাগ রিপোর্ট:</strong> যেকোনো ক্যালকুলেটর পৃষ্ঠায় ফিডব্যাক ফর্ম ব্যবহার করুন, অথবা GitHub-এ একটি ইস্যু দাখিল করুন।</li><li><strong>নতুন ক্যালকুলেটর:</strong> মাঠকর্মী ও সেচ পেশাদারদের সেবাদানকারী হাইড্রোলিক ইঞ্জিনিয়ারিং সরঞ্জামের ধারণা বিশেষভাবে স্বাগত।</li><li><strong>হোস্টিং:</strong> সীমিত সংযোগযুক্ত অঞ্চলের জন্য এই ক্যালকুলেটরগুলোর একটি মিরর চালাতে পারলে, দয়া করে আমার সাথে যোগাযোগ করুন।</li></ul><h3>অফলাইন ব্যবহার</h3><p>অনলাইন থাকা অবস্থায় যেকোনো একটি ক্যালকুলেটর একবার খুলুন, তাহলে অনলাইনে না থাকলেও সবগুলো কাজ করতে থাকবে: আপনার ব্রাউজার চলতে চলতে পুরো সংগ্রহটি জমা করে রাখে। এর কৌশলটি একটি <strong>প্রোগ্রেসিভ ওয়েব অ্যাপ (PWA)</strong>, আপনি পড়তে চাইলে। এরপর সব ক্যালকুলেটর অফলাইনে কাজ করে — ইন্টারনেট সংযোগের প্রয়োজন নেই।</p><p>Android বা iOS-এ, আপনার ডিভাইসে EngCalcs অ্যাপ হিসেবে ইনস্টল করতে আপনার ব্রাউজারের "হোম স্ক্রিনে যোগ করুন" অপশন ব্যবহার করুন। ডেস্কটপে, আপনার ব্রাউজারের অ্যাড্রেস বারে ইনস্টল আইকন খুঁজুন।</p><p>আপনি আপনার ব্রাউজারের "এভাবে সংরক্ষণ করুন…" মেনু ব্যবহার করে এককালীন অফলাইন ব্যবহারের জন্য যেকোনো একক ক্যালকুলেটরও সংরক্ষণ করতে পারেন।</p><h3>যোগাযোগ</h3><p>Tom Haws, হাইড্রোলিক ইঞ্জিনিয়ার এবং এই ক্যালকুলেটরগুলোর প্রতিষ্ঠাতা।<br />যেকোনো ক্যালকুলেটর পৃষ্ঠায় ফিডব্যাক ফর্ম ব্যবহার করুন, অথবা <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>-এ সোর্স কোড দেখুন।</p>';
$ec_lang['contactSendMessage']='Tom Haws-কে বার্তা পাঠান';
$ec_lang['contactYourName']='আপনার নাম:';
$ec_lang['contactYourEmail']='আপনার ই-মেইল ঠিকানা:';
$ec_lang['contactSubject']='বিষয়:';
$ec_lang['contact_message']='বার্তা:';
$ec_lang['contactSpamPrefix']='পাঁচ যোগ এক সমান';
$ec_lang['contactSpamPostfix']='(ইংরেজিতে বানান করুন। 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='বার্তা পাঠান';
$ec_lang['contact_success']='সময় দিয়ে লেখার জন্য আপনাকে ধন্যবাদ।';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='পাথর-আবৃত খাড়া নালা ডিজাইন (Robinson)';
$ec_lang['rc_main_title']='বিনামূল্যে অনলাইন পাথর-আবৃত খাড়া নালা ডিজাইন ক্যালকুলেটর — Robinson (1998)';
$ec_lang['rc_main_desc']='খাড়া নালার পাথর স্তরের আকার — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='খাড়া নালার তলদেশের ঢাল, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="খাড়া নালার ইনলেটে একক প্রস্থ প্রতি প্রবাহ। তলদেশের প্রস্থ B ও মোট প্রবাহ Q সহ একটি চ্যানেলের জন্য, q_t = Q / B ব্যবহার করুন।">মোট একক প্রবাহ, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='পাথরের স্তরের ছিদ্রতা, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="পানির সাপেক্ষে ঘনত্ব। সাধারণ চূর্ণ গ্র্যানাইট বা ব্যাসাল্ট ≈ 2.65। Robinson বৈধ সীমা: 2.54 থেকে 2.82।">পাথরের আপেক্ষিক গুরুত্ব, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="গ্রেডেশনের মানক বিচ্যুতি। একসমান পাথরের জন্য ≈ 1.25। Robinson বৈধ সীমা: 1.15 থেকে 1.47।">গ্রেডেশন SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="পানি সঞ্চয় (Hp > yn) ভালো — উজানের ক্ষয় কমায়। (USDA)">ইনলেট চ্যানেলে স্বাভাবিক গভীরতা, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="সমীকরণ 1 (S0 < 0.10) অথবা সমীকরণ 2 (0.10-0.40)। বৈধ সীমা: D50 15-278 mm, S0 0.02-0.40। সীমার বাইরে হলে: বহির্বিস্তারিত (এক্সট্রাপোলেটেড)।">প্রয়োজনীয় মধ্যমা পাথরের আকার, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='প্রযুক্ত সমীকরণ';
$ec_lang['rc_sg_check']='আপেক্ষিক গুরুত্ব পরীক্ষা';
$ec_lang['rc_SD_check']='গ্রেডেশন SD পরীক্ষা';
$ec_lang['rc_sg_ok']='sg বৈধ সীমার মধ্যে';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']='sg Robinson সীমার নিচে';
$ec_lang['rc_sg_low_tip']='বৈধ সীমা: 2.54–2.82';
$ec_lang['rc_sg_high']='sg Robinson সীমার উপরে';
$ec_lang['rc_sg_high_tip']='বৈধ সীমা: 2.54–2.82';
$ec_lang['rc_SD_ok']='SD বৈধ সীমার মধ্যে';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']='SD Robinson সীমার নিচে';
$ec_lang['rc_SD_low_tip']='বৈধ সীমা: 1.15–1.47';
$ec_lang['rc_SD_high']='SD Robinson সীমার উপরে';
$ec_lang['rc_SD_high_tip']='বৈধ সীমা: 1.15–1.47';
$ec_lang['rc_layer']='পাথরের স্তর পুরুত্ব (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='শীর্ষ ক্রেস্ট বক্ররেখার ব্যাসার্ধ (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='শীর্ষ ক্রেস্ট বক্রচাপের দৈর্ঘ্য';
$ec_lang['rc_apron_length']='<span class="ec-help" title="পাথরের স্তরের কাঠামোগত সহায়তার জন্য প্রয়োজনীয়। “আউটলেট রিচ ও ভাটির চ্যানেল প্রতিরোধের ফলে যে ন্যূনতম ভাটির পানিস্তর সৃষ্টি হয়, তা আউটলেট রিচে পাথরের স্তরের স্থিতিশীলতা নিশ্চিত করার জন্য যথেষ্ট।” (Robinson)">আউটলেট এপ্রনের দৈর্ঘ্য (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='খাড়া নালায় Manning রুক্ষতা, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="q_t-এর যে অংশ পাথরের ছিদ্রের মধ্য দিয়ে প্রবাহিত হয়। অবশিষ্ট q_s পৃষ্ঠের উপর দিয়ে প্রবাহিত হয়। কোণাকার ভাঙা পাথরের জন্য ডিফল্ট np = 0.45।">পাথরের আবরণের মধ্য দিয়ে বেগ, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='আবরণের মধ্য দিয়ে একক প্রবাহ, q<sub>m</sub>';
$ec_lang['rc_qs']='পৃষ্ঠ একক প্রবাহ, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='পাথরের স্তরের পৃষ্ঠের উপরে প্রবাহ গভীরতা, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="পানি সঞ্চয় (Hp > yn) ভালো — উজানের ক্ষয় কমায়। (USDA)">ইনলেট ওয়্যার হেড, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='ইনলেট পানি সঞ্চয় পরীক্ষা';
$ec_lang['rc_pond_ok']='H<sub>p</sub> > y<sub>n</sub> — উজানে পানি সঞ্চয়';
$ec_lang['rc_pond_ok_tip']='খাড়া নালার ইনলেটের উজানে পানি সঞ্চয় ভালো; এটি উজানের ক্ষয় কমায়। (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — পানি সঞ্চয় নেই — ইনলেটে ক্ষয়ের সম্ভাবনা';
$ec_lang['rc_pond_warn_tip']='খাড়া নালার ইনলেটের উজানে পানি সঞ্চয় নেই; উজানে ক্ষয় হতে পারে। (USDA)';
$ec_lang['rc_eq1']='সমীকরণ 1 (S<sub>0</sub> < 0.10) — মৃদু ঢাল';
$ec_lang['rc_eq2']='সমীকরণ 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — খাড়া ঢাল';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — Robinson যাচাইকৃত সীমার নিচে';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — Robinson যাচাইকৃত সীমার উপরে';
$ec_lang['rc_notes_1_term']='পাথরের আকার নির্ধারণের সমীকরণ';
$ec_lang['rc_notes_1_def']='Robinson, Rice ও Kadavy (1998) চ্যানেল ঢাল ও একক প্রবাহ থেকে মধ্যক পাথর আস্তরণের আকার D<sub>50</sub> নির্ণয়ের জন্য দুটি অভিজ্ঞতামূলক সমীকরণ তৈরি করেছেন। সমীকরণ ১ মৃদু ঢালের জন্য প্রযোজ্য (S<sub>0</sub> < 0.10); সমীকরণ ২ খাড়া ঢালের জন্য প্রযোজ্য (0.10 ≤ S<sub>0</sub> ≤ 0.40)। উভয় সমীকরণেই q<sub>t</sub> m²/s এককে দরকার এবং D<sub>50</sub> mm এককে ফেরত দেয়। যাচাইকৃত পরিসীমা হলো 0.02 ≤ S<sub>0</sub> ≤ 0.40।';
$ec_lang['rc_notes_2_term']='একক প্রবাহ';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> হলো খাড়া নালার ক্রেস্টে মোট একক প্রবাহ (প্রতি একক প্রস্থে মোট প্রবাহ)। তলদেশের প্রস্থ B সহ মোট প্রবাহ Q বহনকারী একটি চ্যানেলের জন্য, q<sub>t</sub> ≈ Q / B আনুমানিক ধরুন, অথবা খাড়া নালার ইনলেটে সংকট-গভীরতা (ক্রিটিক্যাল ডেপথ) শর্ত থেকে এটি গণনা করুন।';
$ec_lang['rc_notes_3_term']='পাথরের আবরণের মধ্য দিয়ে প্রবাহ';
$ec_lang['rc_notes_3_def']='মোট প্রবাহের একটি অংশ পাথরের স্তরের ছিদ্রের মধ্য দিয়ে চলাচল করে (আবরণ প্রবাহ q<sub>m</sub>); অবশিষ্ট অংশ পাথরের পৃষ্ঠের উপর দিয়ে প্রবাহিত হয় (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>)। প্রবাহ গভীরতা d, খাড়া নালার রুক্ষতা n ব্যবহার করে পৃষ্ঠ প্রবাহ q<sub>s</sub>-এর উপর Manning-এর সমীকরণ প্রয়োগ করে গণনা করা হয়। কোণাকার ভাঙা পাথরের জন্য ডিফল্ট ছিদ্রতা n<sub>p</sub> = 0.45 স্বাভাবিক।';
$ec_lang['rc_notes_5_term']='বৈধ পাথরের আকারের সীমা';
$ec_lang['rc_notes_5_def']='সমীকরণগুলো D<sub>50</sub>-এর 15 mm থেকে 278 mm সীমা ব্যবহার করে তৈরি করা হয়েছে। এই সীমার বাইরের ফলাফল বহির্বিস্তারিত (এক্সট্রাপোলেটেড) এবং অতিরিক্ত প্রকৌশল বিচার-বিবেচনার সাথে ব্যবহার করা উচিত।';
$ec_lang['rc_notes_6_term']='আউটলেট এপ্রনের উচ্চতা';
$ec_lang['rc_notes_6_def']='আউটলেট রিচে পাথরের স্তরের শীর্ষের উচ্চতা ভাটির চ্যানেল তলদেশের উচ্চতার সমান বা তার নিচে থাকা উচিত। এর বেশি হলে আউটলেটের পাথর অস্থিতিশীল হবে।';

$ec_lang['rc_notes_7_def']='যখন ইনলেট চ্যানেলের স্বাভাবিক গভীরতা q<sub>t</sub> পার করার জন্য প্রয়োজনীয় ওয়্যার হেড (H<sub>p</sub>)-এর চেয়ে কম হয়, তখন খাড়া নালার ইনলেটের উজানে সীমাবদ্ধ প্রবাহ বা পানি সঞ্চয় ঘটে। এটি সাধারণত গ্রহণযোগ্য — পানি সঞ্চয় বেগ কমায় এবং উজানের ক্ষয় প্রতিরোধ করে। পরীক্ষা করতে: প্রদত্ত q<sub>t</sub> ও ক্রেস্ট প্রস্থের জন্য H<sub>p</sub> নির্ণয় করতে একটি ওয়্যার প্রবাহ ক্যালকুলেটর ব্যবহার করুন এবং তা ইনলেট চ্যানেলের স্বাভাবিক গভীরতার সাথে তুলনা করুন। H<sub>p</sub> স্বাভাবিক গভীরতার চেয়ে বেশি হলে পানি সঞ্চয় ঘটবে।';
$ec_lang['rc_notes_4_term']='তথ্যসূত্র';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). “<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">পাথর-আবৃত খাড়া নালার ডিজাইন</a>.” <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS একই পদ্ধতির উপর ভিত্তি করে একটি <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel স্প্রেডশিট</a>ও প্রকাশ করে।';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'ফিল্টার';
$ec_lang['rc_sketch_top_crest_curve'] = 'শীর্ষ ক্রেস্ট বক্র';
$ec_lang['rc_sketch_outlet_apron']    = 'আউটলেট এপ্রন';
$ec_lang['rc_sketch_radius']          = 'ব্যাসার্ধ';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='সেচ চাপ';
$ec_lang['ip_main_title']='বিনামূল্যে অনলাইন সেচ চাপ & বিতরণ সমতা ক্যালকুলেটর';
$ec_lang['ip_main_desc']='পরীক্ষা শাখা চাপ ও সমতা অনুমান';
$ec_lang['ip_h_supply']='সরবরাহ চাপ';
$ec_lang['ip_elev_supply']='সরবরাহ উচ্চতা, z<sub>supply</sub>';
$ec_lang['ip_q_design']='ড্রিপার নকশা প্রবাহ, q<sub>design</sub>';
$ec_lang['ip_h_design']='ড্রিপার নকশা চাপ';
$ec_lang['ip_x']='<span class="ec-help" title="মানক অ-ক্ষতিপূরণকারী ড্রিপারের জন্য 0.5; চাপ-ক্ষতিপূরণকারী ড্রিপারের জন্য 0-এর কাছাকাছি">ড্রিপার নিঃসরণ সূচক, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='পরীক্ষা পথ';
$ec_lang['ip_group_reach']='অংশ';
$ec_lang['ip_group_upstream']='উজান';
$ec_lang['ip_group_downstream']='ভাটি';
$ec_lang['ip_group_loss']='ক্ষতি';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="চেক করা: এই অংশ পরীক্ষা ল্যাটারালের একটি সেগমেন্ট, যেখান থেকে পৃথক ড্রিপার পানি গ্রহণ করে। আনচেক করা: এই অংশ একটি প্রধান লাইন, যা শুধু পরীক্ষা পথে নেই এমন ল্যাটারালে প্রবাহ পাঠায়।">ল্যাট. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="ল্যাটারাল সারি: শুধুমাত্র এই অংশের ড্রিপার। প্রধান লাইন সারি: এই অংশ থেকে শাখা নেওয়া, এই ল্যাটারাল ব্যতীত অন্য ল্যাটারালগুলোর মোট ড্রিপার। পরীক্ষা ল্যাটারাল লাইনে শেষ হওয়া প্রধান লাইনের অংশের জন্য, এতে সেই বিন্দুর পরে প্রধান লাইন বরাবর যেকোনো ল্যাটারাল, বা একই জাংশন শেয়ার করা (যেমন বিপরীত-পাশের ল্যাটারাল) অন্তর্ভুক্ত হয় — তাদের প্রবাহও এই একই অংশ থেকে শাখা নেয়।">ড্রিপার <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="এই অংশের ভাটি-প্রান্তের উচ্চতা। অভ্যন্তরীণ সারিতে ঐচ্ছিক (ফাঁকা রাখলে সমতল / উপরের নোডের মতো ডিফল্ট হয়)। শেষ সারিতে আবশ্যক: সেই মান শেষ ড্রিপারের উচ্চতা, যা সরাসরি প্রয়োজনীয় সরবরাহ চাপ নির্ধারণ করে।">ভাটি উচ্চতা <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='শেষ ড্রিপারের উচ্চতা (শেষ সারি) ফাঁকা রাখা হয়েছিল এবং সমতল হিসেবে ডিফল্ট হয়েছে — নির্ভুল ফলাফলের জন্য এটি লিখুন';
$ec_lang['ip_press']='চাপ';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="মোট অংশ ক্ষতি, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='নিম্ন/নেতিবাচক চাপ — বায়ুমণ্ডলীয় চাপের নিচের অবস্থা পরীক্ষা করুন';
$ec_lang['ip_pressure_warn_short']='নিম্ন';
$ec_lang['ip_pressure_high']='উচ্চ চাপের স্থানে চাপ হ্রাস প্রয়োজন';
$ec_lang['ip_pressure_high_short']='উচ্চ';
$ec_lang['ip_max_head']='সর্বোচ্চ অনু. পাইপ চাপ';
$ec_lang['ip_max_head_tip']='যেসব লাইনের চাপ এই মান অতিক্রম করে সেগুলো চিহ্নিত করা হয়। উচ্চ-চাপ পরীক্ষা এড়িয়ে যেতে ফাঁকা রাখুন।';
$ec_lang['ip_h_far']='শেষ ড্রিপার চাপ';
$ec_lang['ip_q_supply']='<span class="ec-help" title="শুধুমাত্র মডেল করা পরীক্ষা পথে প্রবেশকারী প্রবাহ — সম্পূর্ণ জোন/সিস্টেমের জন্য, নিচে প্রয়োগ ডিজাইনে Q_zone দেখুন।">পরীক্ষা পথ সরবরাহ প্রবাহ, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='শেষ ড্রিপার প্রবাহ, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='গড় ড্রিপার প্রবাহ (পরীক্ষা ল্যাটারাল), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="একটি সাধারণ ল্যাটারাল এই পরীক্ষা ল্যাটারালের তুলনায় কতটা বেশি (বা কম) চাপে চলে বলে আপনি অনুমান করেন। পরীক্ষা ল্যাটারালকে ইচ্ছাকৃতভাবে সবচেয়ে খারাপ ক্ষেত্র ধরে নেওয়া হয়, তাই এর নিজস্ব গড় মাঠ-গড়ের একটি অবমূল্যায়ন — 0-এ রেখে দিলে, নিচের সমতা পরীক্ষা ও প্রয়োগ-ডিজাইন সংখ্যাগুলো পরীক্ষা ল্যাটারালের নিজস্ব (সম্ভবত আশাবাদী) গড়কে যথাযথভাবে ব্যবহার করে।">আনু. Δচাপ, গড় বনাম পরীক্ষা ল্যাটারাল <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="প্রতিটি ল্যাটারাল সারির চাপে প্লাস উপরে প্রবেশ করা চাপ পার্থক্য যোগ করে q_avg_lateral পুনর্মূল্যায়ন করা হয় — পরীক্ষা ল্যাটারাল প্রতিনিধিত্বমূলক না হয়ে সবচেয়ে খারাপ ক্ষেত্র ধরে নেওয়ার সংশোধনের একটি প্রচেষ্টা। নিচের সমতা পরীক্ষা ও প্রয়োগ-ডিজাইন উভয় অংশে ব্যবহৃত হয়।">আনু. মাঠ-গড় ড্রিপার প্রবাহ, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="শেষ ড্রিপারের গণিত প্রবাহকে আনুমানিক মাঠ-গড় ড্রিপার প্রবাহ দিয়ে ভাগ করা হয় — এটি প্রমিত নিম্ন-চতুর্থাংশ বিতরণ সমতা (নিম্ন-গ্রুপ গড় ÷ জনসংখ্যার গড়)-এর একটি আনুমানিক রূপ; এটি একটি ছোট মডেলকৃত নমুনা এবং ব্যবহারকারী-অনুমিত সংশোধন থেকে পাওয়া, সম্পূর্ণ-মাঠ পরিসংখ্যানগত নমুনা থেকে নয়। 1 বা তার বেশি মান সম্ভব ও গ্রহণযোগ্য: এর অর্থ শুধু এই যে শেষ ড্রিপারের চাপ আনুমানিক মাঠ-গড়ের সমান বা তার বেশি, তাই অন্য কোনো ড্রিপার সর্বনিম্ন চাপের বিন্দু। এটি হতে পারে কারণ শেষ ড্রিপারটি নিচু জমিতে আছে, অথবা কারণ Δচাপের অনুমান খুব ছোট।">সমতা পরীক্ষা, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='পরীক্ষা ড্রিপারের চাপ ≥ সরবরাহ চাপ। এটি সম্ভবত সবচেয়ে খারাপ ক্ষেত্রের ড্রিপার নয়, অথবা পাইপগুলো ছোট করা যেতে পারে।';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="এটি প্রমিত সমতা পরিমাপের আমাদের আনুমানিক রূপ থেকে ভিন্ন।">শেষ ড্রিপার প্রবাহ ÷ নকশা প্রবাহ, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='কোনো সমাধান নেই: প্রয়োজনীয় সরবরাহ চাপ প্রবেশ করা সরবরাহ চাপকে ছাড়িয়ে যায়। সরবরাহ চাপ বাড়ান, চাহিদা কমান, অথবা বড় পাইপ ব্যবহার করুন।';
$ec_lang['ip_notes_1_def']='শেষ (সবচেয়ে দূরবর্তী) ড্রিপারে চাপ অনুমান করে, তারপর শক্তি রেখা ধাপে ধাপে সরবরাহের দিকে ফিরিয়ে নিয়ে যায়, অংশ অনুযায়ী অংশ, পথে ঘর্ষণ ও স্থানীয় ক্ষতি যোগ করতে করতে। প্রতিটি নোডে প্রকৃত চাপ জানাতে উচ্চতা ও বেগ মাথা বিয়োগ করা হয়। অনুমিত দূর-প্রান্তের চাপ সমন্বয় করা হয় (দ্বিভাজন) যতক্ষণ না গণিত প্রয়োজনীয় সরবরাহ চাপ প্রবেশ করা সরবরাহ চাপের সাথে মেলে — ম্যানিং পাইপ ফ্লো ক্যালকুলেটরের পাইপ-প্রবাহ সমাধানকারী দ্বারা সমাধান করা একই বদ্ধ-লুপ সমস্যা, একটি শাখাযুক্ত নেটওয়ার্কে বিস্তৃত।';
$ec_lang['ip_notes_2_term']='প্রধান বনাম ল্যাটারাল অংশ';
$ec_lang['ip_notes_2_def']='প্রতিটি সারি সরবরাহ থেকে শেষ ড্রিপার পর্যন্ত একক হাইড্রলিকভাবে সবচেয়ে খারাপ পথের (পরীক্ষা পথের) একটি অংশ। একটি প্রধান লাইন অংশ শুধুমাত্র পরীক্ষা পথে নেই এমন ল্যাটারালে প্রবাহ পাঠায়, তাই এর গ্রহণ একটি সরল গুণফল (নকশা প্রবাহ × অংশের মোট ড্রিপার সংখ্যা) — কোনো স্থানীয় চাপ সংবেদনশীলতা নেই। প্রধান লাইন একটি ভাগ করা ট্রাঙ্ক পাইপ, তাই পরীক্ষা ল্যাটারাল লাইনে শেষ হওয়া প্রধান লাইনের অংশে শুধু নিজের প্রান্তবিন্দুর মধ্যবর্তী ল্যাটারালই নয়, বরং সেই বিন্দুর পরে প্রধান লাইন বরাবর যেকোনো ল্যাটারাল, বা একই জাংশন শেয়ার করা (যেমন বিপরীত-পাশের ল্যাটারাল)ও অন্তর্ভুক্ত করতে হবে — তাদের প্রবাহ বিচ্ছিন্ন হওয়ার আগে এই একই অংশের মধ্য দিয়ে যায়, এই টেবিলে অন্য কোথাও দেখা যাক বা না যাক। একটি ল্যাটারাল অংশ পরীক্ষা ল্যাটারালের নিজেরই একটি সেগমেন্ট: ড্রিপার নিঃসরণ প্রকৃত স্থানীয় চাপ থেকে q = k·H<sup>x</sup> দিয়ে গণনা করা হয়, এবং প্রতিটি ড্রিপার পানি গ্রহণ করায় প্রবাহ কমে যাওয়ার হিসাব রাখতে ঘর্ষণ ক্ষতি ক্রিস্টিয়ানসেনের F(n) ফ্যাক্টর দ্বারা হ্রাস করা হয়।';
$ec_lang['ip_notes_3_term']='সীমাবদ্ধতা';
$ec_lang['ip_notes_3_def']='একটি স্থির সরবরাহ চাপ (কোনো পাম্প বক্ররেখা নেই), শুধুমাত্র একটি পরীক্ষা পথ (সম্পূর্ণ মাঠ নয়), এবং একটি ২-প্যারামিটার ড্রিপার বক্ররেখা (একটি চাপ-ক্ষতিপূরণকারী ড্রিপার আনুমানিক করতে সূচক 0-এর কাছাকাছি সেট করুন) মডেল করে। দুটি ভিন্ন সমতা অনুপাত রিপোর্ট করা হয়, ইচ্ছাকৃতভাবে আলাদা রাখা হয়: q<sub>last</sub>/q<sub>avg,field</sub> প্রমিত নিম্ন-চতুর্থাংশ বিতরণ সমতা (নিম্ন-গ্রুপ গড় ÷ জনসংখ্যার গড়)-এর একটি আনুমানিক রূপ; কিন্তু এটি প্রমিত সম্পূর্ণ-মাঠ পরিসংখ্যানগত নমুনার পরিবর্তে একটি ছোট মডেলকৃত নমুনা ও ব্যবহারকারী-অনুমিত সংশোধন থেকে পাওয়া। এছাড়া, পরীক্ষা ল্যাটারালকে ইচ্ছাকৃতভাবে সবচেয়ে খারাপ ক্ষেত্র ধরে নেওয়া হয়, তাই এর কাঁচা, অসংশোধিত গড় প্রকৃত মাঠ-গড়কে কম দেখাবে এবং সমতাকে প্রকৃতের চেয়ে ভালো দেখাবে; Δচাপ ইনপুট বিশেষভাবে সেই পক্ষপাত প্রতিরোধ করতে বিদ্যমান। সমতার জন্য 1 বা তার বেশি মান তবুও সম্ভব: এর অর্থ শুধু এই যে শেষ ড্রিপারের চাপ আনুমানিক মাঠ-গড়ের সমান বা তার বেশি, তাই অন্য কোনো ড্রিপার সর্বনিম্ন চাপের বিন্দু। এটি হতে পারে কারণ শেষ ড্রিপারটি নিচু জমিতে আছে, অথবা কারণ Δচাপের অনুমান খুব ছোট। q<sub>last</sub>/q<sub>design</sub> হলো একটি ভিন্ন, অ-সমতা পরীক্ষা যা প্রস্তুতকারকের রেটকৃত প্রবাহের বিপরীতে করা হয় — সামগ্রিকভাবে অতিরিক্ত- বা কম-চাপযুক্ত সিস্টেম শনাক্ত করতে উপযোগী, কিন্তু এটি সমতা সংখ্যার পাশাপাশি পড়ার জন্য একটি পৃথক পরীক্ষা, যেহেতু নকশা/রেটকৃত প্রবাহ সিস্টেমের প্রকৃত গড় পরিচালন চাপ থেকে স্বাধীন।';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942)। “স্প্রিংকলিং দ্বারা সেচ।” California Agricultural Experiment Station Bulletin 670। ASAE/ASABE মাইক্রো-সেচ নকশার মান একই বহু-আউটলেট ঘর্ষণ-ক্ষতি পদ্ধতি ব্যবহার করে।';
$ec_lang['ip_notes_5_term']='প্রয়োগ ডিজাইন';
$ec_lang['ip_notes_5_def']='প্রয়োগ হার এবং সিস্টেম/জোন প্রবাহ আনুমানিক মাঠ-গড় ড্রিপার প্রবাহ ব্যবহার করে (q<sub>avg,field</sub> — পরীক্ষা ল্যাটারালের নিজস্ব গড়, প্রবেশ করা Δচাপের অনুমান দ্বারা সংশোধিত), কোনো অনুমিত হার নয়: PR = q<sub>avg,field</sub> / A<sub>e</sub>, সংশোধিত মডেলকৃত মান দ্বারা চালিত। ব্যবধান এবং সিস্টেম-ব্যাপী ল্যাটারাল/ড্রিপার সংখ্যা এখানে আলাদা ইনপুট কারণ পরীক্ষা পথ শুধুমাত্র একটি সবচেয়ে-খারাপ-ক্ষেত্র শাখা মডেল করে, মাঠের প্রতিটি ল্যাটারাল নয়।';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='শাখাযুক্ত পাইপ নেটওয়ার্ক';
$ec_lang['bpn_main_title']='বিনামূল্যে অনলাইন শাখাযুক্ত পাইপ নেটওয়ার্ক চাপ ক্যালকুলেটর (কোনো লুপ নেই)';
$ec_lang['bpn_main_desc']='শাখাযুক্ত (বৃক্ষ-আকৃতির) পাইপ নেটওয়ার্কের প্রবাহ ও চাপ';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='স্থির সরবরাহ হেড: শূন্য প্রবাহে উৎসের হেড। সরবরাহ উচ্চতার উপরে জলাধার বা ট্যাংকের পানির স্তর, অথবা পাম্পের শাটঅফ হেড। পাম্প বা পরিবর্তনশীল-সরবরাহ বক্ররেখা নির্ধারণ করতে সরবরাহ বিন্দু 2 ও 3 যোগ করুন; টুলটি ডিজাইন প্রবাহে হেড পড়ে নেয়।';
$ec_lang['bpn_elev_source']='সরবরাহ উচ্চতা';
$ec_lang['bpn_q_total']='মোট প্রবাহ';
$ec_lang['bpn_q_total_tip']='উৎস থেকে নির্গত মোট প্রবাহ (নেটওয়ার্কের সব চাহিদার সমষ্টি)।';
$ec_lang['bpn_p_min']='সর্বনিম্ন চাপ';
$ec_lang['bpn_p_min_tip']='নেটওয়ার্কের যেকোনো স্থানে সর্বনিম্ন ভাটির চাপ; সংকটপূর্ণ সরবরাহ বিন্দু।';
$ec_lang['bpn_method']='ঘর্ষণ পদ্ধতি';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='পাইপ লাইন';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='এই পাইপ লাইনের নাম। অন্যান্য লাইন উজান কলামে এটির উল্লেখ করে।';
$ec_lang['bpn_upstream']='উজান ID';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='যে লাইন এটিতে প্রবাহ সরবরাহ করে তার ID। ঠিক উপরের লাইন অনুসরণ করতে (সাধারণ সিরিজ পাইপলাইন) ফাঁকা রাখুন। ভিন্ন লাইন থেকে শাখা বের করতে এখানে একটি ID লিখুন।';
$ec_lang['bpn_roughness_tip']='নির্বাচিত ঘর্ষণ পদ্ধতির জন্য পাইপের রুক্ষতা: Manning n, Hazen-Williams C, অথবা Darcy-Weisbach রুক্ষতার উচ্চতা e (একটি দৈর্ঘ্য)। সাধারণ মসৃণ প্লাস্টিক পাইপ: n প্রায় 0.009, C প্রায় 150, e প্রায় 0.0015 mm।';
$ec_lang['bpn_demand']='চাহিদা';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='এই লাইনের ভাটি প্রান্তে সরবরাহকৃত নির্দিষ্ট প্রবাহ।';
$ec_lang['bpn_demand_mult']='চাহিদা গুণক';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='পিক-আওয়ার বা ভবিষ্যৎ বৃদ্ধির জন্য একবারে প্রতিটি লাইনের চাহিদা স্কেল করে। প্রবেশকৃত চাহিদার জন্য 1 ব্যবহার করুন।';
$ec_lang['bpn_elev_down']='ভাটি উচ্চ.';
$ec_lang['bpn_q_line']='লাইন প্রবাহ';
$ec_lang['bpn_q_line_tip']='এই লাইন দ্বারা বাহিত মোট প্রবাহ: এর নিজস্ব চাহিদা এবং এটি যেসব ভাটির চাহিদা সরবরাহ করে তার সমষ্টি।';
$ec_lang['bpn_p_down']='ভাটি চাপ';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='এই লাইনের ভাটি নোডে গেজ চাপ হেড। ঋণাত্মক মান (চিহ্নিত) বায়ুমণ্ডলীয় চাপের নিচের অবস্থা নির্দেশ করে; নকশা পরীক্ষা করুন।';
$ec_lang['bpn_sketch_heading']='নেটওয়ার্ক চিত্র';
$ec_lang['bpn_source_label']='উৎস';
$ec_lang['bpn_line_problem']='এই লাইনটি উৎসের সাথে সংযুক্ত নয়: এটি একটি অজানা উজান ID নির্দেশ করে, নিজেকে নির্দেশ করে, অন্য একটি লাইন ইতিমধ্যে ব্যবহার করা একটি ID পুনরাবৃত্তি করে, অথবা একটি লুপ তৈরি করে। সংযুক্ত নয় এমন লাইনগুলো সমাধান করা হয় না।';
$ec_lang['bpn_bad_id_short']='ভুল ID';


$ec_lang['bpn_pressure_warn']='নিম্ন/নেতিবাচক চাপ; বায়ুমণ্ডলীয় চাপের নিচের অবস্থা পরীক্ষা করুন';
$ec_lang['bpn_pressure_warn_short']='নিম্ন';
$ec_lang['bpn_notes_1_term']='ডিফল্টরূপে সিরিজ, ব্যতিক্রমে শাখা';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='উজান ID ফাঁকা রাখুন এবং একটি লাইন তার উপরের লাইনটি অনুসরণ করবে; একটি সাধারণ সিরিজ পাইপলাইন। একটি উজান লাইনের ID লিখে তা থেকে শাখা বের করুন। অর্থাৎ: ডিফল্টরূপে সিরিজ, প্রয়োজনে একটি বৃক্ষ-আকৃতি।';
$ec_lang['bpn_notes_2_term']='শুধুমাত্র শাখাযুক্ত নেটওয়ার্ক, কোনো লুপ নেই';
$ec_lang['bpn_notes_2_def']='প্রতিটি লাইনের ঠিক একটি উজান লাইন থাকে (একটি বৃক্ষ)। এই টুলটি লুপযুক্ত নেটওয়ার্ক সমাধান করে না; সেগুলোর জন্য পুনরাবৃত্তিমূলক পদ্ধতি প্রয়োজন (EPANET বা অনুরূপ)। লুপ বাদ দেওয়াই একে সরল ও নির্ভুল রাখে।';
$ec_lang['bpn_notes_3_term']='কোনো সক্রিয় চাপ নিয়ন্ত্রণ নেই';
$ec_lang['bpn_notes_3_def']='আপনি একটি নির্দিষ্ট স্থানীয়-ক্ষতি ভালভ (একটি k-মান) যোগ করতে পারেন, কিন্তু চাপ-হ্রাসকারী বা চাপ-স্থিতিশীল ভালভ (PRV/PSV) নয়। তাদের খোলা/বন্ধ অবস্থা প্রবাহ ও চাপের উপর নির্ভর করে, যা পুনরাবৃত্তি প্রয়োজন করবে।';


$ec_lang['bpn_supply2_q']='সরবরাহ প্রবাহ 2';
$ec_lang['bpn_supply2_h']='সরবরাহ হেড 2';
$ec_lang['bpn_supply3_q']='সরবরাহ প্রবাহ 3';
$ec_lang['bpn_supply3_h']='সরবরাহ হেড 3';
$ec_lang['bpn_supply_pt_tip']='ঐচ্ছিক সরবরাহ-বক্ররেখা বিন্দু 2 ও 3। একটি পাম্প, বা এমন কোনো উৎস যার হেড বেশি সরবরাহ করলে কমে যায়, তা মডেল করতে প্রতিটির জন্য একটি প্রবাহ ও হেড লিখুন; টুলটি ডিজাইন প্রবাহে হেড পড়ে নেয়। উপরের বিন্দু 1 হলো শূন্য প্রবাহে স্থির হেড। স্থির জলাধার হেডের জন্য 2 ও 3 ফাঁকা রাখুন।';
$ec_lang['bpn_h_supply']='সরবরাহ হেড';
$ec_lang['bpn_h_supply_tip']='ডিজাইন প্রবাহে উৎসের হেড, সরবরাহ বক্ররেখা থেকে পড়া হয়েছে। বক্ররেখা সমতল হলে (একটি জলাধার) এটি প্রবেশ করা উৎস হেডের সমান।';
$ec_lang['bpn_supply1_h']='স্থির সরবরাহ হেড';
$ec_lang['lpn_main_menu']='পানি সরবরাহ নেটওয়ার্ক';
$ec_lang['lpn_main_title']='EPANET সমাধানকারীসহ বিনামূল্যে অনলাইন পানি সরবরাহ নেটওয়ার্ক মডেলিং';
$ec_lang['lpn_main_desc']='পানি সরবরাহ নেটওয়ার্ক বিশ্লেষণ: একটি লুপযুক্ত পাইপ নেটওয়ার্ক আঁকুন অথবা EPANET ফাইল আমদানি করুন';
$ec_lang['lpn_title_units']='{units} একক';
$ec_lang['lpn_tool_select']='নির্বাচন';
$ec_lang['lpn_tool_add_junction']='সংযোগস্থল';
$ec_lang['lpn_tool_add_reservoir']='জলাধার';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='ট্যাংক';
$ec_lang['lpn_tool_add_pipe']='পাইপ';
$ec_lang['lpn_tool_add_pump']='পাম্প';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='ভালভ';
$ec_lang['lpn_tool_add_text']='টেক্সট';
$ec_lang['lpn_tool_vertices']='শীর্ষবিন্দুসমূহ';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='গ্রাহক';
$ec_lang['lpn_tool_add_meter_tip']='গ্রাহক যেখানে আছে সেখানে ক্লিক করুন, তারপর তাকে সেবা দেয় এমন পাইপ বা নোডে ক্লিক করুন। আপনি গ্রাহককে যে চাহিদা দেন তা সেই পাইপের কাছের প্রান্তের জাংশনে যোগ করা হয়।';
$ec_lang['lpn_mode_add_meter']='গ্রাহক: গ্রাহক যেখানে আছে সেখানে ক্লিক করুন, তারপর তাকে সেবা দেয় এমন পাইপ বা নোডে ক্লিক করুন। অথবা বাতিল করতে Esc ব্যবহার করুন।';
$ec_lang['lpn_pane_tab_customers']='গ্রাহক';
$ec_lang['lpn_customer_heading']='গ্রাহক {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='প্রতি সংযোগে চাহিদা';
$ec_lang['lpn_field_meter_count']='সংযোগের সংখ্যা';
$ec_lang['lpn_field_meter_total']='মোট চাহিদা';
$ec_lang['lpn_field_meter_total_tip']='প্রতি সংযোগে চাহিদা সংযোগের সংখ্যা দিয়ে গুণ করা। নিচে নামকরণ করা জাংশনে যে সংখ্যা যোগ করা হয় সেটিই এটি।';
$ec_lang['lpn_field_meter_pipe']='সংযুক্ত উপাদান';
$ec_lang['lpn_field_meter_pipe_suggest']='নিকটতম উপাদান হলো {id}। এই গ্রাহককে এটি থেকে সেবা দিতে এখানে এটি টাইপ করুন।';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='সংযুক্ত';
$ec_lang['lpn_field_meter_node_tip']='এই গ্রাহক যে জাংশনে সংযুক্ত। এর বদলে সেই পাইপ ধরে কোনো স্টেশন থেকে সেবা দিতে সংযোগ বিন্দুটি টেনে সেই পাইপের উপর নিয়ে যান।';
$ec_lang['lpn_meter_pipe_unknown']='এই প্রকল্পে {id} নামে কিছু নেই, তাই গ্রাহককে যেখানে ছিল সেখানেই রাখা হয়েছে।';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='এই প্রকল্পে {id} নামে কোনো প্যাটার্ন নেই, তাই গ্রাহককে যেমন ছিল তেমনই রাখা হয়েছে।';
$ec_lang['lpn_meter_placed']='গ্রাহক {id} যোগ করা হয়েছে। এর বিবরণ ও চাহিদা গ্রাহক টেবিলে টাইপ করা হয়, অথবা এর বাক্স খুলতে নির্বাচন মোডে এটি চাপুন।';
$ec_lang['lpn_field_meter_pipe_tip']='এই সংযোগ যে উপাদানে সংযুক্ত। এটি পরিবর্তন করতে এখানে বা গ্রাহক টেবিলে অন্য একটি টাইপ করুন, অথবা সংযোগ বিন্দুটি অন্য একটি উপাদানে টেনে নিন।';
$ec_lang['lpn_field_meter_station']='পাইপ বরাবর অবস্থান (%)';
$ec_lang['lpn_field_meter_station_tip']='পাইপের প্রথম নোড থেকে দ্বিতীয়টি পর্যন্ত শতাংশ হিসেবে, সংযোগটি পাইপ ধরে কতদূর সংযুক্ত। 0 এক প্রান্তে এবং 100 অন্য প্রান্তে। পাইপের উপরের বৃত্তটি পয়েন্টার দিয়ে একই কাজ করে।';
$ec_lang['lpn_field_meter_offset']='পাইপ থেকে অফসেট';
$ec_lang['lpn_field_meter_offset_tip']='প্রথম নোড থেকে দ্বিতীয়টির দিকে তাকালে পাইপের ডানদিকে ধনাত্মক। এখানে একটি মান টাইপ করলে গ্রাহককে প্রধান পাইপের অন্য পাশে সরাতে পারে, এবং এটি সবসময় সংযোগ রেখাটিকে প্রধান পাইপের সাথে লম্ব করে।';
$ec_lang['lpn_field_meter_lumped']='নোডে যোগ করা হয়েছে';
$ec_lang['lpn_field_meter_lumped_tip']='নিকটতম নোড; এই গ্রাহকের চাহিদা সেখানে যোগ করা হয়।';
$ec_lang['lpn_node_customers']='গ্রাহকের চাহিদা';
$ec_lang['lpn_node_customers_tip']='এই নোডে যোগ করা গ্রাহকদের তালিকা (কারণ এটিই নিকটতম ছিল)। গ্রাহকের চাহিদা এখানে তালিকাভুক্ত অন্যান্য চাহিদার অতিরিক্ত। একজন গ্রাহককে মানচিত্রে সে যেখানে আছে সেখানে অথবা গ্রাহক টেবিলে সম্পাদনা করা হয়।';
$ec_lang['lpn_node_customers_sum']='{n}জন গ্রাহক থেকে {total} {unit}';
$ec_lang['lpn_customer_detached']='⚠ এই গ্রাহক কোনো পাইপে সংযুক্ত নয়, তাই এর চাহিদা উত্তরে নেই। এটি মুছে ফেলুন, অথবা একটি পাইপ এঁকে গ্রাহককে তার উপর নিয়ে যান।';
$ec_lang['lpn_customer_fixed_head']='⚠ সেই পাইপের কাছের প্রান্তে একটি স্থির পানির উপরিতল আছে, তাই এই চাহিদা সিমুলেশনকে প্রভাবিত করে না।';
$ec_lang['lpn_customer_detached_count']='{n}জন গ্রাহক কোনো পাইপে সংযুক্ত নয়। তাদের চাহিদা হিসাবে নেওয়া হয়নি।';
$ec_lang['lpn_meter_pick_pipe']='এখন এই গ্রাহককে সেবা দেয় এমন পাইপ বা নোডে ক্লিক করুন। গ্রাহক আপনি যেখানে রেখেছেন সেখানেই থাকবে। বাতিল করতে Escape চাপুন।';
$ec_lang['lpn_inp_export_flat_customers']='একটি EPANET ফাইলে কোনো গ্রাহক থাকে না। এই প্রকল্পের {n}জন গ্রাহকের চাহিদা ফাইলে প্রতিটি যে জাংশনে যোগ করা আছে তার উপর একটি চাহিদার সারি হিসেবে যায়, এবং প্রতিটি সারির নাম দেওয়া হয় গ্রাহকের ট্যাগ দিয়ে। ফাইলটি যা ধরে রাখতে পারে না তা হলো গ্রাহক নিজে: সে কোথায় আছে, কোন পাইপ তাকে সেবা দেয়, সেই পাইপ ধরে কোথায় সংযোগটি হয়, এবং একজন গ্রাহক কতগুলো সংযোগের প্রতিনিধিত্ব করে। আপনার নিজের প্রকল্প ফাইল এসবের সবকিছুই রাখে।';

$ec_lang['lpn_area_hint_window_start']='উইন্ডোর এক কোণে ক্লিক করুন।';
$ec_lang['lpn_area_hint_window_go']='শেষ করতে বিপরীত কোণে ক্লিক করুন।';
$ec_lang['lpn_area_hint_lasso_start']='রূপরেখা শুরু করতে ক্লিক করুন।';
$ec_lang['lpn_area_hint_lasso_go']='রূপরেখা আঁকতে সরান। শেষ করতে ক্লিক করুন।';
$ec_lang['lpn_area_hint_polygon_start']='বহুভুজ এলাকা আঁকতে ক্লিক করুন। শেষ করতে ডাবল-ক্লিক করুন।';
$ec_lang['lpn_area_hint_polygon_go']='প্রতিটি কোণে ক্লিক করুন। শেষ করতে শেষ কোণে ডাবল-ক্লিক করুন।';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='নির্বাচন করার সময় Shift চেপে ধরে রাখলে আগের নির্বাচন বজায় থাকে, এবং আপনি যা নির্বাচন করেন তা যোগ বা বাদ (টগল) হয়।';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='মানচিত্রের উপর চাপ দিন এবং আপনি যা চান তার চারপাশে টেনে আনুন, তারপর ছেড়ে দিন।';
$ec_lang['lpn_area_hint_touch_go']='আপনি যা চান তার চারপাশে টেনে আনুন, তারপর শেষ করতে ছেড়ে দিন।';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='এটি দেখান';
$ec_lang['lpn_multi_title']='{n}টি নির্বাচিত';
$ec_lang['lpn_multi_varies']='বিভিন্ন';
$ec_lang['lpn_multi_applied']='{n}-এ {prop} নির্ধারণ করা হয়েছে।';
$ec_lang['lpn_multi_no_fields']='এগুলোর এমন কিছু নেই যা এখানে একসাথে নির্ধারণ করা যায়।';
$ec_lang['lpn_pane_pasted']='{n}টি ঘর পেস্ট করা হয়েছে। {skipped}টি পরিবর্তিত হয়নি।';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='{n}টি সারি পেস্ট করা হয়েছে এবং তার মধ্যে {created}টি নেটওয়ার্কে যোগ করা হয়েছে।';
$ec_lang['lpn_pane_pasted_rows_skipped']='{n}টি সারি পেস্ট করা হয়েছে এবং তার মধ্যে {created}টি নেটওয়ার্কে যোগ করা হয়েছে। {skipped}টি কক্ষ পরিবর্তিত হয়নি।';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='স্প্রেডশিট থেকে সারি যোগ করতে এখানে ক্লিক করে পেস্ট করুন।';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='টেবিলের শেষে নতুন সারি হিসেবে পেস্ট করুন';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='কপি করা সারিগুলো এই টেবিলের নিচে যোগ করতে Ctrl+V চাপুন। বাতিল করতে Esc চাপুন।';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='এই পেস্টে {n}টি সারি আছে, এবং তার মধ্যে {fit}টি টেবিলে ধরে। বাকি {extra}টি নিচে নতুন সারি হিসেবে যোগ করবেন?';
$ec_lang['lpn_pane_paste_overflow_add']='{extra}টি সারি যোগ করুন';
$ec_lang['lpn_pane_paste_overflow_fit']='শুধু যে {fit}টি ধরে সেগুলো পেস্ট করুন';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='এই পেস্টে {n}টি সারি আছে, এবং তার মধ্যে {fit}টি টেবিলে ধরে। বাকি {extra}টি নতুন সারি হিসেবে যোগ করা যায় না: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n}টি ID মেলে না। তবুও পেস্ট করবেন?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='কিছুই পেস্ট করা হয়নি। {reasons}';
$ec_lang['lpn_pane_paste_more']='সমস্যাযুক্ত যেসব সারি এখানে দেখানো হয়নি: {n}টি।';
$ec_lang['lpn_pane_paste_no_id']='সারি {row}: একটি নতুন সারির একটি ID প্রয়োজন।';
$ec_lang['lpn_pane_paste_bad_id']='সারি {row}: ID {id}-তে একটি স্পেস বা উদ্ধৃতি চিহ্ন আছে।';
$ec_lang['lpn_pane_paste_id_taken']='সারি {row}: ID {id} ইতিমধ্যে ব্যবহৃত হচ্ছে।';
$ec_lang['lpn_pane_paste_id_twice']='সারি {row}: ID {id} এই পেস্টে দুইবার ব্যবহৃত হয়েছে।';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='সারি {row}: একটি নতুন নোডের {first} ও {second} উভয়ই প্রয়োজন।';
$ec_lang['lpn_pane_paste_no_ends']='সারি {row}: একটি নতুন লিংকের একটি From নোড ও একটি To নোড প্রয়োজন।';
$ec_lang['lpn_pane_paste_no_node']='সারি {row}: নোড {id} এখনও নেই। প্রথমে আপনার নোড পেস্ট করুন, তারপর আপনার লিংক।';
$ec_lang['lpn_pane_paste_same_ends']='সারি {row}: From ও To একই নোড।';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='সারি {row}: {text} একটি বৈধ {col} নয়।';
$ec_lang['lpn_pane_paste_text_no_position']='সারি {row}: একটি নতুন টেক্সটের {first} ও {second} উভয়ই প্রয়োজন।';
$ec_lang['lpn_pane_paste_no_anchor']='সারি {row}: {id} এই নেটওয়ার্কে এখনও কোনো নোড বা পাইপ নয়। প্রথমে এটি পেস্ট করুন, তারপর এই টেক্সট।';
$ec_lang['lpn_pane_paste_customer_no_position']='সারি {row}: একটি নতুন গ্রাহকের {first} ও {second} উভয়ই প্রয়োজন।';
$ec_lang['lpn_pane_paste_no_customer_ref']='সারি {row}: একটি নতুন গ্রাহকের একটি সংযুক্ত পাইপ বা নোড প্রয়োজন।';
$ec_lang['lpn_pane_paste_no_pipe']='সারি {row}: পাইপ {id} এখনও নেই। প্রথমে আপনার পাইপ পেস্ট করুন, তারপর আপনার গ্রাহক।';
$ec_lang['lpn_pane_paste_no_customer_node']='সারি {row}: নোড {id} এখনও নেই। প্রথমে আপনার সংযোগস্থল পেস্ট করুন, তারপর আপনার গ্রাহক।';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='সারি {row}: নোড {id}-তে গ্রাহক সংযুক্ত করার মতো কোনো পাইপ নেই।';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).

// {id} is what the Text table's own Attached to cell named.






$ec_lang['lpn_pane_filled']='{n}টি কক্ষ নিচে পূরণ করা হয়েছে। {skipped}টি পরিবর্তিত হয়নি।';
$ec_lang['lpn_pane_filldown']='নিচে পূরণ করুন';
$ec_lang['lpn_pane_fill_none']='এই নির্বাচনে নিচে পূরণ করার মতো কিছু নেই।';
$ec_lang['lpn_pane_ctrlenter_filled']='{n}টি কক্ষ পূরণ করা হয়েছে। {skipped}টি পরিবর্তিত হয়নি।';
$ec_lang['lpn_pane_hide_col']='এই কলাম লুকান';
$ec_lang['lpn_pane_hide_cols']='এই কলামগুলো লুকান';
$ec_lang['lpn_pane_show_all_cols']='সব কলাম দেখান';
$ec_lang['lpn_pane_sort_asc']='ঊর্ধ্বক্রমে সাজান';
$ec_lang['lpn_pane_manage_cols']='কলাম পরিচালনা করুন…';
$ec_lang['lpn_pane_manage_cols_title']='কলাম পরিচালনা করুন';
$ec_lang['lpn_pane_manage_cols_show']='দেখান';
$ec_lang['lpn_pane_manage_cols_up']='উপরে সরান';
$ec_lang['lpn_pane_manage_cols_down']='নিচে সরান';
$ec_lang['lpn_pane_manage_cols_top']='শুরুতে সরান';
$ec_lang['lpn_pane_manage_cols_bottom']='শেষে সরান';
$ec_lang['lpn_pane_colmenu_tip']='কলাম লুকান বা পরিচালনা করুন';
$ec_lang['lpn_tool_area_window']='একটি উইন্ডো নির্বাচন করুন';
$ec_lang['lpn_tool_area_lasso']='একটি লাসো নির্বাচন করুন';
$ec_lang['lpn_tool_area_polygon']='একটি বহুভুজ নির্বাচন করুন';
$ec_lang['lpn_tool_delete']='মুছুন';
$ec_lang['lpn_tool_zoom_extent']='সম্পূর্ণ অঙ্কন দেখান';
$ec_lang['lpn_tool_zoom_window']='জুম উইন্ডো';
$ec_lang['lpn_zoom_in']='জুম ইন';
$ec_lang['lpn_zoom_out']='জুম আউট';
$ec_lang['lpn_new_text']='টেক্সট';
$ec_lang['lpn_field_text_anchor']='সংযুক্ত';
$ec_lang['lpn_field_text_bold']='বোল্ড টেক্সট';
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

$ec_lang['lpn_field_text_align']='অনুভূমিক প্রান্তিককরণ';
$ec_lang['lpn_field_text_align_left']='বামে';
$ec_lang['lpn_field_text_align_center']='মাঝে';
$ec_lang['lpn_field_text_align_right']='ডানে';
$ec_lang['lpn_field_text_valign']='উল্লম্ব প্রান্তিককরণ';
$ec_lang['lpn_field_text_valign_top']='উপরে';
$ec_lang['lpn_field_text_valign_middle']='মাঝে';
$ec_lang['lpn_field_text_valign_bottom']='নিচে';
$ec_lang['lpn_field_text_rotation']='কোণ (ডিগ্রি)';
$ec_lang['lpn_field_text_match_pipe']='নিকটতম লিংকের কোণে ঘুরে যান';
$ec_lang['lpn_field_text_flip']='180° ঘোরান';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='সংযুক্ত উপাদান';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='এই টেক্সটটি একটি উপাদানের এত কাছে বসানো হয়েছিল যে এটি সেটিকে অনুসরণ করে, তাই এটি সেই উপাদানের সাথে সরে যায় এবং এর একটি লিডার থাকে। লিডারযুক্ত টেক্সট তার অনুভূমিক ও উল্লম্ব প্রান্তিককরণ যে পাশে বসে আছে তা থেকেই নেয়, তাই এটি সংযুক্ত থাকা অবস্থায় ওই দুটি সারি দেখানো হয় না।';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='ড্রিপার সহগ';
$ec_lang['lpn_field_emitter_tip']='চাপের উপর নির্ভরশীল একটি অতিরিক্ত বহিঃপ্রবাহ, একটি স্প্রিংকলার, একটি খোলা আউটলেট বা একটি মডেল করা লিকের জন্য। এটি যে প্রবাহ ছাড়ে তা এই সহগ গুণ চাপকে ড্রিপার সূচকের ঘাতে উন্নীত করলে যা পাওয়া যায়, যা Settings, Calculation, Hydraulics-এর অধীনে পুরো নেটওয়ার্কের জন্য একবার নির্ধারণ করা হয়। সাধারণ জাংশনে এটি খালি রাখুন।';
$ec_lang['lpn_field_elev']='উচ্চতা';
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
$ec_lang['lpn_field_head']='জলশীর্ষ';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='জলাধারে পানির উপরিতলের স্তর, উচ্চতা হিসেবে পরিমাপ করা হয়, চাপ হিসেবে নয়। খালি রাখলে পানির উপরিতল জলাধারের উচ্চতায় বসবে।';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='ট্যাংকের তলার উচ্চতা। ট্যাংকের পানির গভীরতা এখান থেকে উপরের দিকে পরিমাপ করা হয়।';
$ec_lang['lpn_field_tank_level']='পানির গভীরতা';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='ট্যাংকে দাঁড়িয়ে থাকা পানির গভীরতা, ট্যাংকের তলা থেকে উপরের দিকে পরিমাপ করা। পানির উপরিতল হলো ট্যাংকের তলার উচ্চতা যোগ এই গভীরতা।';
$ec_lang['lpn_field_tank_minlevel']='সর্বনিম্ন পানির গভীরতা';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='যে পানির গভীরতায় ট্যাংকটিকে খালি ধরা হয়, ট্যাংকের তলা থেকে উপরের দিকে পরিমাপ করা।';
$ec_lang['lpn_field_tank_maxlevel']='সর্বোচ্চ পানির গভীরতা';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='যে পানির গভীরতায় ট্যাংকটি পূর্ণ ধরা হয়, ট্যাংকের তলা থেকে উপরের দিকে পরিমাপ করা।';
$ec_lang['lpn_field_tank_diameter']='ট্যাংকের ব্যাস';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='ট্যাংকের এক পাশ থেকে অন্য পাশ পর্যন্ত প্রস্থ। এটি উচ্চতার এককে পরিমাপ করা হয়, পাইপের ব্যাসের এককে নয়। এটি নির্ধারণ করে একটি নির্দিষ্ট গভীরতায় কতটা পানি ধরে।';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='ট্যাংকে পানির উপরিতলের উচ্চতা: ট্যাংকের তলার উচ্চতা যোগ পানির গভীরতা। এই স্তরটিই সমাধানকারী ট্যাংকের জন্য ব্যবহার করে।';
$ec_lang['lpn_close']='বন্ধ করুন';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='বৈশিষ্ট্যসমূহ';
$ec_lang['lpn_empty_hint']='একটি উদাহরণ খুলতে ফাইল, নতুন প্রকল্প ব্যবহার করুন। অথবা টুলবার থেকে একটি জলাধার, জাংশন এবং পাইপ যোগ করে শুরু করুন।';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='আপনার নেটওয়ার্ক অক্ষত আছে।';
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
$ec_lang['lpn_examples_welcome']='EPANET সমাধানকারী দিয়ে পানি সরবরাহ নেটওয়ার্ক মডেলিংয়ে স্বাগতম';
$ec_lang['lpn_examples_heading']='একটি উদাহরণ খুলুন';
$ec_lang['lpn_examples_sub']='প্রতিটি আপনার নিজের একটি কপি হিসেবে খোলে। এটি পরিবর্তন করুন, সংরক্ষণ করুন, অথবা একটি নতুন কপি খুলে আবার শুরু করুন।';
$ec_lang['lpn_examples_open']='খুলুন';
$ec_lang['lpn_examples_menu']='উদাহরণ খুলুন…';
$ec_lang['lpn_examples_blank']='অথবা একটি খালি মানচিত্র দিয়ে শুরু করুন';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='নোড: {nodes}, লিংক: {links}';
$ec_lang['lpn_examples_failed']='উদাহরণগুলো লোড করা যায়নি। অঙ্কন শুরু করতে ফাইল, নতুন প্রকল্প ব্যবহার করুন।';
$ec_lang['lpn_examples_loading']='উদাহরণ লোড হচ্ছে…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='কিছু ঠিক করুন';
$ec_lang['lpn_help_notes']='এই পৃষ্ঠা সম্পর্কে নোট';
$ec_lang['lpn_help_hotkeys']='টেবিল ও হটকি';
$ec_lang['lpn_hotkeys_tables_heading']='সারণি';
$ec_lang['lpn_hotkeys_map_heading']='মানচিত্র';
$ec_lang['lpn_hotkeys_map_term']='মানচিত্রের কীবোর্ড শর্টকাট';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 বা Esc</td><td>নির্বাচন করুন।</td></tr><tr><td>2</td><td>একটি সংযোগস্থল যোগ করুন।</td></tr><tr><td>3</td><td>একটি জলাধার যোগ করুন।</td></tr><tr><td>4</td><td>একটি ট্যাংক যোগ করুন।</td></tr><tr><td>5</td><td>একটি পাইপ যোগ করুন।</td></tr><tr><td>6</td><td>একটি পাম্প যোগ করুন।</td></tr><tr><td>7</td><td>একটি ভালভ যোগ করুন।</td></tr><tr><td>8</td><td>একজন গ্রাহক যোগ করুন।</td></tr><tr><td>9</td><td>টেক্সট যোগ করুন।</td></tr><tr><td>Delete</td><td>নির্বাচিত অংশ মুছুন।</td></tr><tr><td>Ctrl+Z</td><td>শেষ পরিবর্তনটি পূর্বাবস্থায় ফিরিয়ে আনুন।</td></tr><tr><td>+ বা =</td><td>জুম ইন করুন।</td></tr><tr><td>-</td><td>জুম আউট করুন।</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='এখানে কিছু ভুল আছে?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='একবার চাপলে আমাদের জানানো হয় যে এই পৃষ্ঠার কিছুতে ভুল আছে। এটি পাঠায় এই পৃষ্ঠার নাম, আপনি যে ভাষায় এটি পড়ছেন, এবং মানচিত্রের বার্তাটি যদি থাকে। এটি আপনার লেখা কিছু, কোনো ঠিকানা, বা আপনার অঙ্কনের কিছুই পাঠায় না। কেউ উত্তর লিখতে পারে না, কারণ এটি আমাদের আপনার সম্পর্কে কিছুই জানায় না। আরও কিছু বলতে চাইলে সহায়তা, কিছু ঠিক করুন ব্যবহার করুন।';
$ec_lang['lpn_wrong_thanks']='ধন্যবাদ। এটি আমাদের কাছে পৌঁছেছে।';
$ec_lang['lpn_status_example_opened']='{name} খোলা হয়েছে। এটি আপনার কপি: এটি ফাইল, নতুন নামে সংরক্ষণ করুন দিয়ে সংরক্ষণ করুন।';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='এই পাতাটি অঙ্কন এলাকার আকার নির্ণয় করতে পারেনি, তাই মানচিত্রটি এটি যে শেষ দৃশ্য গণনা করতে পেরেছিল তা দেখাচ্ছে। উইন্ডোর আকার পরিবর্তন করলে এটি আবার চেষ্টা করে। যদি এটি বারবার ঘটতে থাকে, তাহলে সাধারণত এর কারণ এমন একটি ব্রাউজার এক্সটেনশন যা পাতা পরিমাপ করা আটকায়।';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='মৌলিক নেটওয়ার্ক, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='এখান থেকে শুরু করুন। একটি জলাধার, একটি পাম্প এবং একটি ছোট লুপ: পানির নেটওয়ার্ক হিসেবে কাজ করার জন্য সবচেয়ে ছোট বিন্যাস। লিটার প্রতি সেকেন্ড, মিটার ও মিলিমিটার সহ।';
$ec_lang['lpn_ex_basic_us_title']='মৌলিক নেটওয়ার্ক, gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='একই শুরুর নেটওয়ার্ক, গ্যালন প্রতি মিনিট এককে, ফুট ও ইঞ্চি সহ।';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='EPANET-এর নিজস্ব তিনটি নমুনা নেটওয়ার্কের মধ্যে সবচেয়ে ছোটটি: একটি জলাধার, একটি পাম্প এবং একটি একক লুপ।';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='EPANET-এর নমুনা থেকে একটি ট্যাংকসহ শাখাযুক্ত বিতরণ ব্যবস্থা।';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='EPANET-এর বড় নমুনা: 92টি জাংশন, 3টি ট্যাংক এবং 2টি জলাধার, তাদের একটি নদী। একটি বাস্তব আকারের মডেল মানচিত্রে কেমন দেখায় তা দেখার উপযুক্ত।';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='EPANET Net3-এর মতো একই নেটওয়ার্ক, পৃথিবীর একটি নির্বিচার স্থানে বসানো: এর স্থানাঙ্ক অক্ষাংশ ও দ্রাঘিমাংশ, এবং এর পেছনে একটি রাস্তার মানচিত্র আঁকা আছে।';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='একটি বাণিজ্যিক স্থান, সর্বোচ্চ দিনের চাহিদার উপর অগ্নি প্রবাহের জন্য সমাধান করা, একটি নির্দিষ্ট মুহূর্তে, একটি সাইট পরিকল্পনার উপর আঁকা।';
$ec_lang['lpn_tool_undo']='পূর্বাবস্থায় ফিরুন';
$ec_lang['lpn_confirm_example']='এটি আপনার বিদ্যমান নেটওয়ার্কে উদাহরণটি যোগ করবে। চালিয়ে যাবেন?';
$ec_lang['lpn_field_diameter']='ব্যাস';
$ec_lang['lpn_demand_tip']='এই নোডে নেটওয়ার্ক থেকে নেওয়া প্রবাহ। এখানে নেটওয়ার্কে প্রবাহ যোগ করতে ঋণাত্মক সংখ্যা লিখুন।';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='এই এককটি আপনার ইনপুটগুলোর অর্থ নির্ধারণ করে';
$ec_lang['lpn_units_warn_lead']='{unit} হলো নিচের বিষয়গুলোতে আপনি যা লেখেন তার একক:';
$ec_lang['lpn_units_options_head']='আপনি একটি একক পরিবর্তন করলে:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='অ-ধ্বংসাত্মক';
$ec_lang['lpn_units_nondestructive_desc']='অ-ধ্বংসাত্মক: প্রতিটি ইনপুট ঠিক যেমন আছে তেমনই রাখে এবং নতুন এককে তার অর্থ নতুন করে বোঝে।';
$ec_lang['lpn_units_destructive']='ধ্বংসাত্মক';
$ec_lang['lpn_units_destructive_desc']='ধ্বংসাত্মক: গাণিতিক রূপান্তর দিয়ে প্রতিটি ইনপুট নতুন করে লেখে, যাতে নেটওয়ার্কটি রূপান্তরের সহনশীলতার মধ্যে প্রায় একই ভৌত অবস্থায় থাকে। এটি মূল ইনপুটগুলো হারিয়ে ফেলে। পূর্বাবস্থায় ফেরালে সেগুলো ফিরে আসে।';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n}টি মান এখন {unit} বোঝায়। কিছুই নতুন করে লেখা হয়নি।';
$ec_lang['lpn_status_converted']='{n}টি মান {unit}-এ নতুন করে লেখা হয়েছে।';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='দৈর্ঘ্য';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='মানচিত্র স্থানাঙ্ক';
$ec_lang['lpn_units_mapcoords_deg']='ডিগ্রি';
$ec_lang['lpn_units_usft']='US survey ft';
$ec_lang['lpn_units_elevhead']='উচ্চতা ও জলশীর্ষ';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='জলশীর্ষ ক্ষতির ঢাল';
$ec_lang['lpn_result_gradient_tip']='পাইপের দৈর্ঘ্য দিয়ে ভাগ করা জলশীর্ষ ক্ষতি। ভিন্ন দৈর্ঘ্যের পাইপগুলোকে একই নকশা সীমার সাথে তুলনা করতে এটি ব্যবহার করুন।';
$ec_lang['lpn_result_water_age']='পানির বয়স';
$ec_lang['lpn_result_water_age_tip']='এই বিন্দুতে পৌঁছানো পানি সিস্টেমে কতক্ষণ ধরে আছে। যেখানে প্রবাহ একত্র হয়, সেখানে আগত পানি বিভিন্ন বয়সের মিশ্রণ বহন করে, এবং এখানকার সংখ্যাটি প্রবাহ দিয়ে ভারযুক্ত তাদের গড়: একটি ছোট নতুন মেইন দিয়ে বেশিরভাগ সরবরাহ পাওয়া একটি সংযোগস্থল কম বয়স দেখায়, যদিও একটি দীর্ঘ ডেড এন্ডও তাতে পানি দেয়। একটি ট্যাংকে এটি ধরে রাখা পানির গড় বয়স, যে কারণে ধীরে পালটে যাওয়া একটি ট্যাংক সাধারণত নেটওয়ার্কের সবচেয়ে পুরনো পানি ধরে রাখে। এর বিপরীতে তুলনা করার মতো কোনো নিয়ন্ত্রক সীমা নেই, তাই সংখ্যাটি আপনার নিজের সিস্টেমের নিরিখে বিচার করুন।';
$ec_lang['lpn_result_source_share']='উৎস অংশ';
$ec_lang['lpn_result_source_share_tip']='এই বিন্দুতে পৌঁছানো পানির কতটা ট্রেস নোড থেকে এসেছে। এটিই উৎস ট্রেস বিশ্লেষণ যা জানায়।';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='গড় পানির বয়স';
$ec_lang['lpn_result_avg_source_share']='গড় উৎস অংশ';
$ec_lang['lpn_result_avg_concentration']='গড় ঘনত্ব';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='ঘর্ষণ গুণাঙ্ক';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='বিক্রিয়ার হার';
$ec_lang['lpn_result_status']='অবস্থা';
$ec_lang['lpn_result_status_open']='খোলা';
$ec_lang['lpn_result_status_closed']='বন্ধ';
$ec_lang['lpn_result_head']='জলশীর্ষ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='এই নোডে পানির শক্তি, পানির স্তম্ভের উচ্চতা হিসেবে লেখা। এটি একটি পরম উচ্চতা, যেখানে চাপ একটি গেজ পরিমাপ।';
$ec_lang['lpn_result_pressure']='চাপ';
$ec_lang['lpn_result_flow']='প্রবাহ';
$ec_lang['lpn_result_velocity']='বেগ';
$ec_lang['lpn_result_headloss']='জলশীর্ষ ক্ষতি';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='শুধুমাত্র এই প্রকল্পের সেটিংস পুনরায় সেট করে। আপনার অঙ্কন এবং আপনার অন্যান্য প্রকল্প পরিবর্তিত হয় না। পুনরায় ব্যবহারের জন্য আপনার প্রিয় সেটিংস সংরক্ষণ করতে, শুধু সেটিংসসহ একটি প্রকল্প ফাইল সংরক্ষণ করুন।';
$ec_lang['lpn_reset_all_tip']='প্রতিটি প্রকল্প, প্রতিটি পটভূমি চিত্র, প্রতিটি সেটিং এবং আপনার একক নির্বাচন মুছে ফেলে, তারপর পৃষ্ঠাটি ঠিক একজন নতুন দর্শক যেভাবে দেখেন সেভাবে পুনরায় লোড করে। এটিই একমাত্র রিসেট যা সবকিছু মুছে ফেলে।';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='এই ক্যালকুলেটর প্রকল্পের একক ও ইনপুট যেভাবে লেখা হয়েছে সেভাবেই সংরক্ষণ করে, কিন্তু আগে এটি সংখ্যাগুলোকে SI-তে রূপান্তর করে সংরক্ষণ করত। এই প্রকল্পটি সেই পরিবর্তনের আগে সংরক্ষিত হয়েছিল, তাই এর সংখ্যাগুলো SI-তে সংরক্ষিত ছিল। এগুলো একবারের জন্য বর্তমান এককে রূপান্তর করবেন? বিচার করার সুবিধার জন্য, এখানে কিছু ব্যাসের মান দেওয়া হলো যা রূপান্তরিত হবে, রূপান্তরের আগে ও পরের মানসহ:';
$ec_lang['lpn_v2_restore_yes']='রূপান্তর করুন';
$ec_lang['lpn_v2_restore_never']='না। আর কখনো জিজ্ঞাসা করবেন না।';
$ec_lang['lpn_v2_restore_no']='বন্ধ করুন, যাতে আমি আগে বর্তমান একক পরীক্ষা করতে পারি';
$ec_lang['lpn_storage_too_new']='এই প্রকল্পটি পৃষ্ঠার একটি নতুন সংস্করণ দিয়ে সংরক্ষিত হয়েছিল, তাই এটি এখানে খোলা যাবে না।';
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
$ec_lang['lpn_tool_file']='ফাইল';
$ec_lang['lpn_menu_edit']='সম্পাদনা';
$ec_lang['lpn_menu_insert']='সন্নিবেশ';
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
$ec_lang['lpn_menu_map']='মানচিত্র';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='রাস্তার মানচিত্র দেখান';
$ec_lang['lpn_basemap_satellite_show']='উপগ্রহ চিত্র দেখান';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='জিওরেফারেন্সড';
$ec_lang['lpn_xymap']='স্থানীয়';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='এভাবে রূপান্তর করুন…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='{name}-এর কপি';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='এভাবে রূপান্তর করুন';
$ec_lang['lpn_convas_coordsys_tip']='যে স্থানাঙ্ক পদ্ধতিতে কপিটি রূপান্তরিত হয়। এটি এই প্রকল্পেরটির থেকে ভিন্ন হলে, দুটি স্থাপন ধাপ অনুসরণ করে। যে প্রকল্প ইতিমধ্যে জানে সে কোথায় আছে সেটি উভয় ধাপ আগে থেকেই উত্তর দেওয়া অবস্থায় খোলে, তাই আপনি সেগুলো যেমন আছে তেমন গ্রহণ করতে পারেন অথবা পরিবর্তন করতে পারেন।';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='বর্তমান: {crs}';
$ec_lang['lpn_convas_epsg']='EPSG স্থানাঙ্ক পদ্ধতি';
$ec_lang['lpn_convas_epsg_tip']='EPSG রেজিস্টার থেকে একটি স্থানাঙ্ক পদ্ধতি বেছে নিন। অক্ষাংশ ও দ্রাঘিমাংশ হলো WGS 84 (EPSG:4326)।';
$ec_lang['lpn_convas_unnamed']='নামহীন (স্থানীয়) জিওরেফারেন্স';
$ec_lang['lpn_convas_unnamed_tip']='দৈর্ঘ্যের এককে স্থানীয় স্থানাঙ্ক, বিশ্ব মানচিত্র সংযুক্ত অবস্থায়।';
$ec_lang['lpn_convas_none_tip']='দৈর্ঘ্যের এককে স্থানীয় স্থানাঙ্ক, আপাতত কোনো বিশ্ব মানচিত্র ছাড়া।';
$ec_lang['lpn_convas_units_tip']='যে এককে কপিটি রূপান্তরিত হয়। মূলটি তার নিজস্ব সংখ্যা ও একক ধরে রাখে।';
$ec_lang['lpn_convas_round']='রূপান্তরিত মান রাউন্ড করুন';
$ec_lang['lpn_convas_round_tip']='শুধুমাত্র এই রূপান্তর যে সংখ্যাগুলো নতুন করে লেখে সেগুলোকে, আপনার বেছে নেওয়া নিকটতম ধাপে রাউন্ড করে। যে মানগুলোর একক পরিবর্তিত হয় না সেগুলো যেমন আছে তেমনই থাকে।';
$ec_lang['lpn_convas_round_none']='কোনো রাউন্ডিং নয়';
$ec_lang['lpn_convas_round_flow']='চাহিদা ও প্রবাহ';
$ec_lang['lpn_convas_label_col']='প্রত্যয়';
$ec_lang['lpn_convas_label_tip']='কপির মানচিত্র লেবেলে এই মানের পরে যোগ করা টেক্সট, যেমন \' mm\' বা \' gpm\'। উপরে বেছে নেওয়া একক থেকে আগে থেকে পূরণ করা; কোনো প্রত্যয় না চাইলে এটি খালি করুন।';
$ec_lang['lpn_convas_oneway']='ফিরিয়ে রূপান্তর করা একটি দ্বিতীয় রূপান্তর, কোনো পূর্বাবস্থা নয়। রূপান্তরিত এবং আবার ফিরিয়ে রূপান্তরিত একটি সংখ্যা ঠিক যেমন টাইপ করা হয়েছিল তেমন নাও ফিরতে পারে।';
$ec_lang['lpn_convas_ok']='রূপান্তর করুন';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} তালিকাভুক্ত অল্প কয়েকটি স্থানাঙ্ক পদ্ধতির একটি যার ব্যবহারযোগ্য প্রক্ষেপণ তথ্য নেই, তাই এটি থেকে বা এতে রূপান্তর করা যায় না। কিছুই রূপান্তরিত হয়নি।';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='রূপান্তরিত কপিটি হলো {name}। মূল প্রকল্পটি অপরিবর্তিত আছে।';
$ec_lang['lpn_convas_cancelled']='কিছুই রূপান্তরিত হয়নি। কপিটি বন্ধ করা হয়েছে, এবং মূল প্রকল্পটি অপরিবর্তিত আছে।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='এই প্রকল্পটিকে একটি নতুন ট্যাবে কপি করে এবং আপনার বেছে নেওয়া স্থানাঙ্ক পদ্ধতি ও এককে কপিটি রূপান্তর করে। স্থানাঙ্ক পদ্ধতি পরিবর্তিত হলে, একটি উইজার্ড আপনাকে প্রথমে আপনার নেটওয়ার্কের পেছনের মানচিত্র আনুমানিকভাবে জুম করতে, তারপর মানচিত্রে আপনার নেটওয়ার্ককে আরও নিখুঁতভাবে স্কেল ও ঘোরাতে সাহায্য করে। এই প্রকল্পটি ঠিক যেমন আছে তেমনই থাকে। কিছু রূপান্তর না করে জিওরেফারেন্স করতে, এর বদলে মানচিত্র, বিশ্ব মানচিত্র, সংযুক্ত করুন ব্যবহার করুন।';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='এই প্রকল্পটি ইতিমধ্যে জিওরেফারেন্সড, তাই নেটওয়ার্কটি ইতিমধ্যে মানচিত্রে আছে এবং কিছুই সরানো হয়নি। এটি সঠিক জায়গায় আছে কিনা পরীক্ষা করুন, তারপর মডেলটি এখানে বসান বোতাম এবং এই অবস্থান রাখুন বোতাম চাপুন।';
$ec_lang['lpn_georef_intro']='মডেলটি বসাতে দুটি ধাপ লাগে। ধাপ ১ হলো দ্রুততম: মডেলটি স্থির থাকে এবং আপনি এর পেছনের মানচিত্রটি সরান, যতক্ষণ না আপনার সাইটটি মডেলের নিচে মোটামুটি সঠিক আকারে চলে আসে। এখনও কোনো ঘূর্ণন নেই। ধাপ ২ হলো নিখুঁততম: আপনি মডেলটি নিজেই টেনে আনেন, আকার পরিবর্তন করেন ও ঘোরান। আপনার প্রকল্প শুরুতে সারা পৃথিবীর একটি মানচিত্রে থাকে, তাই প্রথমে আপনার অবস্থান খুঁজুন, তারপর মডেলটি এখানে বসান বোতাম চাপুন।';
$ec_lang['lpn_georef_adjust']='মডেলটি এখন মাটিতে আছে, তাই এটি মানচিত্রের সাথে সরে। মডেলটি সরাতে এটি টেনে আনুন, আকার পরিবর্তন করতে একটি কোণ টেনে আনুন, ঘোরাতে মডেলের উপরের গোল হাতলটি টেনে আনুন। অথবা নিচে ভূমির দূরত্ব ও ঘূর্ণন কোণ লিখুন।';
$ec_lang['lpn_georef_step1']='ধাপ ১ এর ২ — দ্রুত';
$ec_lang['lpn_georef_step2']='ধাপ ২ এর ২ — নিখুঁত';
$ec_lang['lpn_georef_step1_hint']='আপনার প্রকল্পটি স্ক্রিনে যেখানে আছে সেখানেই থাকে। নিচের মানচিত্রটি প্যান ও জুম করুন যতক্ষণ না পেছনের জায়গাটি মোটামুটি সঠিক অবস্থানে ও সঠিক আকারে আসে, তারপর মডেলটি এখানে বসান বোতাম চাপুন।';
$ec_lang['lpn_georef_detach']='আবার তুলে নিন';
$ec_lang['lpn_georef_size_prompt']='পুরো প্রকল্প জুড়ে সাইটটি আনুমানিক কত চওড়া?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='শর্টকাট: {key} চাপুন।';
$ec_lang['lpn_tool_key_hint_two']='শর্টকাট: {key} অথবা {key2} চাপুন।';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='আকৃতির ভেতরের সবকিছু নির্বাচন করতে নির্দেশ অনুযায়ী মানচিত্রে ক্লিক করুন। উইন্ডো, লাসো ও বহুভুজের মধ্যে আকৃতি পরিবর্তন করতে এই বোতামটি আবার চাপুন। নির্বাচন করার সময় Shift চেপে ধরে রাখলে আগের নির্বাচন বজায় থাকে, এবং আপনি যা নির্বাচন করেন তা যোগ বা বাদ (টগল) হয়।';
$ec_lang['lpn_area_selected']='{n}টি নির্বাচিত।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='সেই এলাকায় কিছুই পাওয়া যায়নি।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='মানচিত্রে একটি পাইপের আকৃতি গঠনকারী শীর্ষবিন্দুগুলো যোগ বা মুছুন। একটি শীর্ষবিন্দু যোগ করতে পাইপে ক্লিক করুন, মুছতে একটি শীর্ষবিন্দুতে ক্লিক করুন, এবং সরাতে একটি শীর্ষবিন্দু টেনে আনুন। একটি শীর্ষবিন্দু শুধু আঁকা পথ পরিবর্তন করে, হাইড্রোলিক্স নয়।';
$ec_lang['lpn_tool_undo_tip']='শেষ পরিবর্তনটি পূর্বাবস্থায় ফেরান।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='পুরো নেটওয়ার্ককে উইন্ডোতে ধরান।';
$ec_lang['lpn_tool_zoom_window_tip']='মানচিত্রে একটি বাক্সের দুটি বিপরীত কোণে ক্লিক করুন, অথবা একটি টেনে আনুন, তাতে জুম ইন করতে। সম্পূর্ণ অঙ্কন দেখান-এর জন্য এই বোতামটি আবার চাপুন।';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='জুম ইন। শর্টকাট: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='জুম আউট। শর্টকাট: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='একটি উপাদান তার ID দিয়ে খুঁজুন, অথবা একটি শর্ত পূরণ করে এমন প্রতিটি উপাদান খুঁজুন, এবং সবগুলো একসাথে পরিবর্তন করুন।';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='টুলবার';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='দৃশ্যমানতা';
$ec_lang['lpn_color_legend_open_tip']='দৃশ্যমানতা প্যানেল খুলে এই রঙগুলো পরিবর্তন করতে ক্লিক করুন।';
$ec_lang['lpn_color_node_field']='নোডের রঙ';
$ec_lang['lpn_color_link_field']='পাইপের রঙ';
$ec_lang['lpn_color_ramp_sequential']='অনুক্রমিক';
$ec_lang['lpn_color_ramp_diverging']='বিপরীতমুখী';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='ব্যান্ডের সংখ্যা';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='ব্যান্ড বণ্টন';
$ec_lang['lpn_color_ranges_note']='নিচের সীমাগুলো একবার নির্ধারিত হলে স্থির থাকে; ফলাফল পরিবর্তিত হলেও সেগুলো তা অনুসরণ করে না। উপরে একটি ডেটা শ্রেণিবিন্যাস পদ্ধতি বেছে নিলে সিস্টেমের বর্তমান অবস্থা থেকে সীমাগুলো নির্ধারিত হয়। আপনি হাতে কোনো মান পরিবর্তন করলে, উপরের পদ্ধতিটি নিজে নির্ধারিত হয়ে যায়।';
$ec_lang['lpn_color_criterion_note']='এই পদ্ধতি তার সীমাগুলো একটি নকশা মানদণ্ড থেকে নেয়, তাই এই পদ্ধতি বেছে নেওয়া অবস্থায় রঙের সংখ্যা স্থির থাকে।';
$ec_lang['lpn_color_break_number']='একটি সীমা অবশ্যই একটি সংখ্যা হতে হবে। মানচিত্র অপরিবর্তিত আছে।';
$ec_lang['lpn_color_break_order']='প্রতিটি সীমা তার আগেরটির চেয়ে বড় হতে হবে। মানচিত্র অপরিবর্তিত আছে।';
$ec_lang['lpn_color_break_count']='রঙের সংখ্যার চেয়ে একটি কম সীমা থাকতে হবে। মানচিত্র অপরিবর্তিত আছে।';
$ec_lang['lpn_color_ramp_qualitative']='গুণগত';
$ec_lang['lpn_color_ramp_rainbow']='রংধনু';
$ec_lang['lpn_color_ramp_rainbow_eg']='EPANET-এর সাথে মেলে';
$ec_lang['lpn_color_example_material']='সামগ্রী';
$ec_lang['lpn_color_ramp_ylgnbu']='হলুদ থেকে নীল';
$ec_lang['lpn_color_ramp_rdylbu']='লাল থেকে নীল, হলুদের মধ্য দিয়ে';
$ec_lang['lpn_georef_drop']='মডেলটি এখানে বসান';
$ec_lang['lpn_georef_finish']='এই অবস্থান রাখুন';
$ec_lang['lpn_georef_scale']='অঙ্কন এককপ্রতি ভূমির দূরত্ব';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='আপনার অঙ্কনের এক একক ভূমিতে কতদূর পর্যন্ত পৌঁছায়। একটি সাধারণ গ্রিডে করা অঙ্কন সাধারণত এ বিষয়ে কিছু বলে না, তাই এখানে নির্ধারণ করুন — অথবা যান… কে জিজ্ঞাসা করতে দিন সাইটটি কত চওড়া এবং তা থেকে হিসাব করে নিন।';
$ec_lang['lpn_georef_rotation']='ঘড়ির কাঁটার বিপরীতে ঘোরান (ডিগ্রি)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='পুরো মডেলটি ঘড়ির কাঁটার বিপরীতে কতটা ঘোরাতে হবে, যাতে এর উত্তর দিক সত্যিকারের উত্তরের দিকে থাকে।';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='মডেলটি এখানে স্থায়ীভাবে বসাবেন? এরপরও আপনি এক-একটি উপাদান টেনে সরাতে পারবেন, তবে অঙ্কনটি আর একটি xy প্রকল্প থাকবে না। xy ফিরে পেতে, এই প্রকল্পটি সংরক্ষণ না করে বন্ধ করুন।';
$ec_lang['lpn_georef_done']='এটি এখন একটি lat/lon প্রকল্প। কোনো উপাদান তার প্রকৃত অবস্থানের কাছাকাছি সরাতে টেনে আনুন।';
$ec_lang['lpn_georef_backdrop_unrotated']='পটভূমি চিত্রটি মডেলের সাথে সরানো ও আকার পরিবর্তন করা হয়েছে, কিন্তু ঘোরানো যায়নি। এটি ঠিক করতে মানচিত্র, পটভূমি চিত্র, সরান ব্যবহার করুন।';
$ec_lang['lpn_georef_empty']='সেই ফাইলে কোনো নেটওয়ার্ক নেই, তাই বসানোর মতো কিছু নেই।';
$ec_lang['lpn_georef_unavailable']='বসানোর টুলটি লোড হয়নি। পৃষ্ঠাটি পুনরায় লোড করে আবার চেষ্টা করুন।';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='প্রকল্প পরিবর্তনের আগে "এই স্থাপনা রাখুন" বোতাম দিয়ে স্থাপনা শেষ করুন, অথবা Cancel চাপুন। এই স্থাপনাটি এই প্রকল্পের অন্তর্গত এবং অন্য কোনো প্রকল্পে আপনার সাথে যেতে পারবে না।';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='সংরক্ষণ করার আগে "এই স্থাপনা রাখুন" বোতাম দিয়ে স্থাপনা শেষ করুন, অথবা Cancel চাপুন। প্রকল্পটি এখনও বসানো হচ্ছে, তাই পর্দায় যা আছে তা এখনও ফাইলে যা লেখা হবে তা নয়।';
$ec_lang['lpn_goto_menu']='একটি অক্ষাংশ ও দ্রাঘিমাংশে যান…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='অক্ষাংশ ও দ্রাঘিমাংশ, এই ক্রমে';
$ec_lang['lpn_goto_bad']='এটি একটি অক্ষাংশ ও একটি দ্রাঘিমাংশ নয়। 38 -122 এর মতো চেষ্টা করুন, মাঝে একটি ফাঁকা স্থান দিয়ে।';
$ec_lang['lpn_georef_goto']='যান…';
$ec_lang['lpn_georef_twopt']='দুটি জানা বিন্দু ব্যবহার করুন';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='আপনার অঙ্কনে দুটি বিন্দু আসলে কোথায় তা যদি আপনি আগে থেকেই জানেন, তাহলে মডেলটি সঠিকভাবে বসান। তাদের একটিতে ক্লিক করুন, এর অক্ষাংশ ও দ্রাঘিমাংশ লিখুন, তারপর দ্বিতীয় বিন্দুর জন্য একই কাজ করুন। অবস্থান, স্কেল ও ঘূর্ণন সবই এই দুটি বিন্দু থেকে নির্ধারিত হয়। বেছে নেওয়া বন্ধ করতে এই বোতামটি আবার চাপুন।';
$ec_lang['lpn_georef_twopt_pick1']='আপনার অঙ্কনে এমন একটি বিন্দুতে ক্লিক করুন যার অক্ষাংশ ও দ্রাঘিমাংশ আপনি জানেন।';
$ec_lang['lpn_georef_twopt_pick2']='এখন দ্বিতীয় একটি জানা বিন্দুতে ক্লিক করুন, প্রথমটি থেকে যতটা সম্ভব দূরে।';
$ec_lang['lpn_georef_twopt_same']='এটি আপনি প্রথমে যে বিন্দু বেছে নিয়েছিলেন। একটি ভিন্ন বিন্দু বেছে নিন।';
$ec_lang['lpn_georef_twopt_done']='মডেলটি এখন আপনার দেওয়া দুটি বিন্দুর উপর বসেছে। এটি যাচাই করুন, তারপর এই অবস্থান রাখুন বোতাম চাপুন।';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='নিচের প্যানেল';
$ec_lang['lpn_pane_toggle_tip']='মানচিত্রের নিচের প্যানেলটি দেখান বা লুকান। এতে প্রোফাইল ও প্রতিটি ধরনের অংশের জন্য একটি টেবিল থাকে।';
$ec_lang['lpn_pane_resize']='প্যানেলটি লম্বা বা খাটো করতে টেনে আনুন';
$ec_lang['lpn_pane_tab_junctions']='জাংশন';
$ec_lang['lpn_pane_tab_reservoirs']='জলাধার';
$ec_lang['lpn_pane_tab_tanks']='ট্যাংক';
$ec_lang['lpn_pane_tab_pipes']='পাইপ';
$ec_lang['lpn_pane_tab_pumps']='পাম্প';
$ec_lang['lpn_pane_tab_valves']='ভালভ';
$ec_lang['lpn_pane_tab_tip']='এই ট্যাব এই ধরনের উপাদানগুলো এমন একটি টেবিল হিসেবে দেখায় যা আপনি সাজাতে ও সম্পাদনা করতে পারেন। ফলাফলের কলামগুলো সম্পাদনা করা যায় না।';
$ec_lang['lpn_pane_none']='এই নেটওয়ার্কে এখনও এগুলোর কোনোটিই নেই।';
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
$ec_lang['lpn_pane_text_attached']='সংযুক্ত';
$ec_lang['lpn_pane_not_used']='ব্যবহৃত হয়নি';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='{q} দ্বারা ফিল্টার করা হয়েছে। {all}টির মধ্যে {n}টি দেখানো হচ্ছে।';
$ec_lang['lpn_pane_filter_clear']='সব দেখান';
$ec_lang['lpn_pane_filter_stale']='যে সারিগুলো আর মেলে না: {n}।';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='এই সারণিতে ফিল্টারের সাথে কিছুই মেলে না।';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='জুম ও নির্বাচন করুন';
$ec_lang['lpn_goto_on_map']='মানচিত্রে দেখান';
$ec_lang['lpn_pane_select_on_map']='মানচিত্রে নির্বাচন করুন';
$ec_lang['lpn_pane_unselect_on_map']='মানচিত্রে নির্বাচন বাতিল করুন';


$ec_lang['lpn_pane_print']='টেবিল প্রিন্ট করুন';

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
$ec_lang['lpn_menu_project']='পানি';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='পানি নেটওয়ার্ক মডেলিং সংক্রান্ত সবকিছু এখানে একসাথে আছে, শুধু অ্যানিমেশন চালানোর নিয়ন্ত্রণগুলো বাদে। কোথায় কী আছে তা অনুমান করার দরকার নেই।';
$ec_lang['lpn_tables_menu']='টেবিল';
$ec_lang['lpn_tables_menu_tip']='মানচিত্রের নিচের প্যানেলটি এই নেটওয়ার্কের উপাদানগুলোর একটি টেবিলে খুলুন। প্রতিটি ধরনের উপাদানের জন্য একটি করে টেবিল আছে, এবং আপনি সেখানে তা সাজাতে ও সম্পাদনা করতে পারেন।';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='এই নেটওয়ার্কটি এখনই পুনরায় গণনা করুন। চালান বোতাম খুঁজছেন? স্বয়ংক্রিয়ভাবে পুনরায় গণনা করুন সেটিং চালু থাকা অবস্থায় এটি লুকানো থাকে। বোতামটি ফিরিয়ে আনতে, সেটিংস, হিসাব, হাইড্রোলিক্স-এ স্বয়ংক্রিয়ভাবে পুনরায় গণনা করুন বন্ধ করুন।';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='স্বয়ংক্রিয়ভাবে পুনরায় গণনা করুন';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='এটি চালু থাকলে, আপনার করা প্রতিটি পরিবর্তনের কিছুক্ষণ পরই এই প্রকল্প পুনরায় গণনা করে, এবং গণনা করুন বোতামটি টুলবার থেকে সরিয়ে দেওয়া হয় কারণ তার আর কোনো কাজ থাকে না। একটি বড় নেটওয়ার্কে, প্রতিটি পরিবর্তনের পর গণনা শেষ হওয়ার জন্য অপেক্ষা করা টাইপ করায় বাধা দিলে এটি বন্ধ করুন, তাহলে আপনি কখন চালাবেন তা নিজে বেছে নিতে গণনা করুন বোতামটি ফিরে আসবে।';
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
$ec_lang['lpn_time_run_slow']='এই নেটওয়ার্কটি গণনা করতে {secs} সেকেন্ড লেগেছে, এবং এটি প্রতিটি পরিবর্তনের পর পুনরায় গণনা করার জন্য নির্ধারিত আছে। এটি বন্ধ করে গণনা করুন বোতাম ফিরিয়ে আনতে, সেটিংস-এ, হিসাব, হাইড্রোলিক্স-এর অধীনে “স্বয়ংক্রিয়ভাবে পুনরায় গণনা করুন” বন্ধ করুন।';
$ec_lang['lpn_time_no_report']='এখনও কোনো চালানোর প্রতিবেদন নেই। প্রতিবেদনটি EPANET-এর নিজস্ব লেখা, তাই এই নেটওয়ার্ক EPANET সমাধানকারী দিয়ে গণনা করা হলেই এটি দেখা যায়।';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='সহায়তা';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='স্ক্রিনশট গ্যালারি';
$ec_lang['lpn_help_walkthroughs']='ধাপে ধাপে নির্দেশিকা';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='নেটওয়ার্ক মুছুন';
$ec_lang['lpn_confirm_delete_network']='এই প্রকল্পের প্রতিটি নোড, পাইপ ও টেক্সট লেবেল মুছে ফেলবেন? পটভূমি চিত্র, প্রকল্পের নাম ও আপনার সেটিংস রাখা থাকবে।';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='খুঁজুন ও প্রতিস্থাপন করুন';
$ec_lang['lpn_find_title']='খুঁজুন ও প্রতিস্থাপন করুন';
$ec_lang['lpn_find_scope']='কী অনুসন্ধান করবেন';
$ec_lang['lpn_find_scope_all']='সবকিছু';
$ec_lang['lpn_find_property']='বৈশিষ্ট্য';
$ec_lang['lpn_find_condition']='শর্ত';
$ec_lang['lpn_find_value']='মান';
$ec_lang['lpn_find_btn']='খুঁজুন';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='বর্তমান সারণিতে ফিল্টার করুন';
$ec_lang['lpn_find_filter_tip']='মানচিত্রের নিচের সারণিগুলোর একটিতে এই অনুসন্ধানের সাথে মেলে এমন অংশগুলোই দেখান। অঙ্কন পরিবর্তিত হয় না এবং কিছুই মুছে ফেলা হয় না।';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {all}-এর মধ্যে {n}';
$ec_lang['lpn_find_filter_summary']='{q} দিয়ে ফিল্টার করা হয়েছে। {rows}।';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='এই কোয়েরি কোনো টেবিলে প্রযোজ্য নয়।';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='ধারণ করে';
$ec_lang['lpn_find_op_equals']='সমান';
$ec_lang['lpn_find_op_gt']='বেশি';
$ec_lang['lpn_find_op_lt']='কম';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='খালি';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n}টি পাওয়া গেছে। একটিতে যেতে সেটিতে ক্লিক করুন।';
$ec_lang['lpn_find_shift_hint']='নির্বাচন সেটে না থাকলে যোগ করতে, আর থাকলে অপসারণ করতে টগল করতে Shift+ক্লিক করুন।';

$ec_lang['lpn_find_none']='কিছুই মেলেনি।';
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
$ec_lang['lpn_find_op_top']='{n}টি সর্বোচ্চ';
$ec_lang['lpn_find_op_bottom']='{n}টি সর্বনিম্ন';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='কী খুঁজছেন তা লিখুন।';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='সংযোগ';
$ec_lang['lpn_find_prop_demand_desc']='এই চাহিদা শ্রেণির বিবরণ';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='নোডে কোনো লিংক নেই';
$ec_lang['lpn_find_op_conn_noopen']='নোডে কোনো খোলা লিংক নেই';
$ec_lang['lpn_find_op_conn_nolinksource']='উৎস পর্যন্ত কোনো লিংক পথ নেই';
$ec_lang['lpn_find_op_conn_noopensource']='উৎস পর্যন্ত কোনো খোলা পথ নেই';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='প্রতিটি নোড সংযুক্ত।';
$ec_lang['lpn_find_conn_no_fixed']='এই নেটওয়ার্কে কোনো জলাধার বা ট্যাংক নেই, তাই পৌঁছানোর মতো কোনো উৎস নেই। শুধু নোডে কোনো লিংক নেই এবং নোডে কোনো খোলা লিংক নেই অনুসন্ধান করা যাবে।';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='একই অনুসন্ধান, এক লাইনে লেখা। নিয়ন্ত্রণগুলো পরিবর্তন করলে এই লাইনটি নতুন করে লেখা হয়, এবং এই লাইনে টাইপ করলে নিয়ন্ত্রণগুলো হালনাগাদ হয়।';
$ec_lang['lpn_find_query_label']='কোয়েরি';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='শর্তগুলোকে এবং, অথবা ও () দিয়ে একত্র করুন';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='এবং';
$ec_lang['lpn_find_q_or']='অথবা';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='নিচের কোয়েরিটি নিয়ন্ত্রণ দিয়ে প্রকাশ করা যায় না, তাই সেগুলো লুকানো আছে।';
$ec_lang['lpn_find_q_restore']='পরিবর্তে নিয়ন্ত্রণ ব্যবহার করুন';
$ec_lang['lpn_replace_q_bad']='এই কোয়েরিটি বোঝা যাচ্ছে না, তাই কিছুই পরিবর্তন করা যাবে না। প্রথমে উপরে এটি ঠিক করুন।';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(অক্ষর {n}-এ)';
$ec_lang['lpn_find_q_err_empty']='কোয়েরিটি খালি, তাই কিছুই অনুসন্ধান করা হবে না।';
$ec_lang['lpn_find_q_err_scope']='{w} নামে অনুসন্ধানের মতো কিছু নেই। এর একটি চেষ্টা করুন: {list}';
$ec_lang['lpn_find_q_err_dot']='যা অনুসন্ধান করবেন এবং তার বৈশিষ্ট্যের মাঝে একটি বিন্দু (.) দিন, যেমন Junction.ID';
$ec_lang['lpn_find_q_err_prop']='{scope}-এর কোনো বৈশিষ্ট্য নয়: {w}। এর একটি চেষ্টা করুন: {list}';
$ec_lang['lpn_find_q_err_op']='{prop}-এর জন্য কোনো শর্ত নয়: {w}। এর একটি চেষ্টা করুন: {list}';
$ec_lang['lpn_find_q_err_value']='এই শর্তের পরে একটি মান দরকার: {op}';
$ec_lang['lpn_find_q_err_quote']='টেক্সট মানের চারপাশে উদ্ধৃতি চিহ্ন দিন: {w} কোনো সংখ্যা নয়।';
$ec_lang['lpn_find_q_err_quote_end']='এই উদ্ধৃত টেক্সটের কোনো সমাপনী উদ্ধৃতি চিহ্ন নেই।';
$ec_lang['lpn_find_q_err_close']='এই বন্ধনী ( খোলা হয়েছিল কিন্তু কখনো বন্ধ হয়নি।';
$ec_lang['lpn_find_q_err_open']='এই বন্ধনী ) কিছুই বন্ধ করে না।';
$ec_lang['lpn_find_q_err_end']='এর পরে কিছু আশা করা হয়নি। দুটি অনুসন্ধান {and} বা {or} দিয়ে জোড়া দিন।';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='যা পাওয়া গেছে তা পরিবর্তন করুন';
$ec_lang['lpn_replace_prop']='পরিবর্তনযোগ্য বৈশিষ্ট্য';
$ec_lang['lpn_replace_value']='নতুন মান';
$ec_lang['lpn_replace_source']='নতুন মানের উৎস';
$ec_lang['lpn_replace_asked']='{n}টি নোডের জন্য উচ্চতা অনুরোধ করা হয়েছে। ফলাফল আসছে।';
$ec_lang['lpn_replace_btn']='পরিবর্তন করুন';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='{n}টি উপাদান পরিবর্তন করবেন?';
$ec_lang['lpn_replace_apply']='সেগুলো পরিবর্তন করুন';
$ec_lang['lpn_replace_done']='{n}টি উপাদান পরিবর্তিত হয়েছে। আপনি এটি এক ধাপে পূর্বাবস্থায় ফেরাতে পারবেন।';
$ec_lang['lpn_replace_none']='কিছুই পরিবর্তিত হবে না।';
$ec_lang['lpn_replace_no_value']='নতুন মানটি লিখুন।';
$ec_lang['lpn_replace_scope']='মান পরিবর্তন করতে উপরে একধরনের উপাদান বেছে নিন।';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='প্রোফাইল';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_title']='একটি পথ ধরে প্রোফাইল';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='যে নোড থেকে পথ শুরু হবে সেটিতে ক্লিক করুন।';
$ec_lang['lpn_profile_draw_more']='পথ দেখতে মানচিত্রের উপর দিয়ে সরান। একটি নোড যোগ করতে সেটিতে ক্লিক করুন। শেষ করতে দুইবার ক্লিক করুন। Esc বাতিল করে।';
$ec_lang['lpn_profile_draw_blocked']='{a} থেকে {b} পর্যন্ত কোনো পথ নেই। অন্য একটি নোড বেছে নিন।';
$ec_lang['lpn_profile_tap_start']='যে নোড থেকে পথ শুরু হবে সেটিতে ট্যাপ করুন।';
$ec_lang['lpn_profile_tap_more']='পথ দেখতে একটি নোডে ট্যাপ করুন। এটি যোগ করতে চেপে ধরে রাখুন। শেষ করতে দুইবার ট্যাপ করুন। বাতিল করতে আবার প্রোফাইল চাপুন।';
$ec_lang['lpn_profile_say_idle']='মানচিত্রে নতুন একটি পথ বেছে নিতে আবার প্রোফাইল চাপুন।';
$ec_lang['lpn_profile_none']='এখনও কোনো পথ নেই। মানচিত্রে একটি বেছে নিতে আবার প্রোফাইল চাপুন।';
$ec_lang['lpn_profile_choose']='একটি শুরুর নোড ও একটি শেষের নোড বেছে নিন।';
$ec_lang['lpn_profile_no_path']='এই দুটি নোড কোনো পথ দিয়ে সংযুক্ত নয়।';
$ec_lang['lpn_profile_no_solve']='এখনও কোনো ফলাফল নেই, তাই শুধু ভূমির রেখাটিই আঁকা হয়েছে।';
$ec_lang['lpn_profile_summary']='নোড: {n}, দৈর্ঘ্য: {len} {u}';
$ec_lang['lpn_profile_axis_station']='পথ ধরে দূরত্ব ({u})';
$ec_lang['lpn_profile_axis_elev']='উচ্চতা ও জলশীর্ষ ({u})';
$ec_lang['lpn_profile_ground']='ভূপৃষ্ঠ';
$ec_lang['lpn_profile_hgl']='হাইড্রোলিক গ্রেড লাইন';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='সম্পাদনা';
$ec_lang['lpn_profile_edit_tip']='পথের পুরোটা আবার না এঁকে এর একটি প্রান্ত পরিবর্তন করুন, অথবা এটি থেকে একটি নোড সরিয়ে দিন।';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='পথের যেকোনো বিন্দু সরাতে সেটি টেনে আনুন। আপনি যোগ করা কোনো বিন্দু সরাতে সেটিতে ক্লিক করুন।';
$ec_lang['lpn_profile_edit_tap']='পথের যেকোনো বিন্দু সরাতে সেটি টেনে আনুন। আপনি যোগ করা কোনো বিন্দু সরাতে সেটিতে ট্যাপ করুন।';
$ec_lang['lpn_profile_edit_nowhere']='পথের একটি বিন্দুকে অবশ্যই একটি নোড হতে হবে। পথটি অপরিবর্তিত রইল।';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='সংরক্ষিত পথসমূহ';
$ec_lang['lpn_profile_new']='নতুন সংরক্ষিত পথ…';
$ec_lang['lpn_profile_new_name']='পথ {n}';
$ec_lang['lpn_profile_rename']='পথের নাম পরিবর্তন করুন…';
$ec_lang['lpn_profile_delete']='পথ মুছুন';
$ec_lang['lpn_profile_prompt_name']='এই পথের নাম';
$ec_lang['lpn_profile_delete_confirm']='সংরক্ষিত পথ {name} মুছবেন? অঙ্কনটি নিজে পরিবর্তিত হবে না।';
$ec_lang['lpn_profile_none_saved']='এখনও কোনো সংরক্ষিত পথ নেই';
$ec_lang['lpn_profile_missing']='সংরক্ষিত পথ {name} এমন নোড ব্যবহার করে যা এই প্রকল্পে নেই: {ids}';
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
$ec_lang['lpn_ts_menu']='সময় সিরিজ';
$ec_lang['lpn_ts_tip']='একটি বর্ধিত সময়কাল সিমুলেশন জুড়ে এক বা একাধিক উপাদানকে সময়ের বিপরীতে গ্রাফ করুন।';
$ec_lang['lpn_ts_title']='মান বনাম সময়';
$ec_lang['lpn_ts_group_nodes']='নোড';
$ec_lang['lpn_ts_group_links']='লিংক';
$ec_lang['lpn_ts_add']='নির্বাচিতগুলো যোগ করুন';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='মানচিত্রে সেই ধরনের কিছুই বেছে নেওয়া হয়নি।';
$ec_lang['lpn_ts_clear']='সব সরিয়ে ফেলুন';
$ec_lang['lpn_ts_chip_tip']='গ্রাফ থেকে {id} সরিয়ে ফেলুন';
$ec_lang['lpn_ts_none']='এখনও গ্রাফ করার মতো কিছু নেই। মানচিত্রে উপাদান নির্বাচন করুন এবং নির্বাচিতগুলো যোগ করুন চাপুন।';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='এখনও কোনো বর্ধিত সময়কাল ফলাফল নেই। সিমুলেশন চালাতে চালান চাপুন।';
$ec_lang['lpn_ts_summary']='উপাদান: {n}, প্রতিবেদনের সময়: {steps}';
$ec_lang['lpn_ts_axis_time']='অতিবাহিত সময়';
$ec_lang['lpn_freq_menu']='ফ্রিকোয়েন্সি';
$ec_lang['lpn_freq_tip']='বর্তমান টাইম স্টেপে সব জাংশন বা সব পাইপের একটি মানের ফ্রিকোয়েন্সি বিতরণ গ্রাফ করুন।';
$ec_lang['lpn_freq_title']='মানের বিতরণ';
$ec_lang['lpn_freq_none']='এই মানের জন্য এখনও কোনো ফলাফল নেই, তাই গ্রাফ করার মতো কিছু নেই।';
$ec_lang['lpn_freq_summary']='প্লট করা হয়েছে: {total}-এর মধ্যে {n}';
$ec_lang['lpn_freq_summary_time']='প্লট করা হয়েছে: {total}-এর মধ্যে {n}, {time}-এ';
$ec_lang['lpn_freq_axis_percent']='কম মানের শতাংশ';
$ec_lang['lpn_view_units']='একক';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='সব সংরক্ষণ করুন';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='প্রকল্প{n}';
$ec_lang['lpn_project_copy_suffix']='(কপি)';
$ec_lang['lpn_project_rename']='নাম পরিবর্তন';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='নতুন প্রকল্প…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='নতুন প্রকল্প';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='স্থানাঙ্ক পদ্ধতি';
$ec_lang['lpn_new_coordsys_tip']='আপনার নেটওয়ার্কের স্থানাঙ্ক পদ্ধতি নির্বাচন করুন। এটি স্থায়ী; একটি নেটওয়ার্ককে ভিন্ন স্থানাঙ্কে রূপান্তর করার একমাত্র উপায় হলো "File, Open to new coordinates", এবং এটি আনুমানিক।';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='স্থানীয়, স্কিমাটিক, বা কাস্টম';
$ec_lang['lpn_new_coordsys_local_tip']='জিওরেফারেন্সড নয়। আপনার নিজের ব্যাকগ্রাউন্ড ইমেজ যুক্ত করুন অথবা কোনোটিই নয়।';
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
$ec_lang['lpn_crs_view']='মানচিত্র দৃশ্য দিয়ে ফিল্টার করুন';
$ec_lang['lpn_crs_view_tip']='মানচিত্র যে জায়গাটির দিকে তাকিয়ে আছে তা কভার করে এমন প্রক্ষেপণগুলোই কেবল দেখায়। পুরো তালিকা পড়তে এটি বন্ধ করুন।';
$ec_lang['lpn_crs_place']='স্থানের নাম অনুসন্ধান';
$ec_lang['lpn_crs_place_tip']='একটি শহর, একটি ঠিকানা, বা একটি ল্যান্ডমার্ক টাইপ করুন, এবং মানচিত্র দৃশ্য সেখানে চলে যায়। আপনার টাইপ করা শব্দগুলো OpenStreetMap-এর স্থান-নাম সেবায় যায়, যা প্রথমবার আপনার অনুমতি চায়। একটি নতুন ভৌগোলিক প্রকল্পও এখানে খুঁজে পাওয়া স্থান থেকেই শুরু হয়।';
$ec_lang['lpn_crs_search']='অনুসন্ধান করুন';
$ec_lang['lpn_crs_name']='প্রক্ষেপণের নাম ফিল্টার';
$ec_lang['lpn_crs_name_tip']='আপনি যা টাইপ করেন তা যাদের নামে বা EPSG কোডে আছে কেবল সেই প্রক্ষেপণগুলো দেখায়। একটি জোন নম্বর, বা UTM, বা Mercator লিখে চেষ্টা করুন।';
$ec_lang['lpn_crs_list_tip']='উপরের দুটি ফিল্টারের পর অবশিষ্ট থাকা প্রক্ষেপণগুলো। একটি নির্বাচন করুন এবং Select চাপুন।';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='এখনও কোনো স্থান অনুসন্ধান করা হয়নি, তাই পুরো তালিকা দেখানো হচ্ছে। উপরে একটি স্থান খুঁজুন অথবা তালিকা সংকীর্ণ করতে মানচিত্র জুম করুন।';
$ec_lang['lpn_crs_count']='{total}টির মধ্যে {n}টি প্রক্ষেপণ তালিকাভুক্ত।';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{total}টি স্থানাঙ্ক পদ্ধতির মধ্যে {n}টি এই নেটওয়ার্ককে ধারণ করে।';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(কোনো মানচিত্র নেই)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} তালিকাভুক্ত অল্প কয়েকটি স্থানাঙ্ক পদ্ধতির একটি যার ব্যবহারযোগ্য প্রক্ষেপণ তথ্য নেই। এর অর্থ বিশ্ব মানচিত্র, স্থানের নাম অনুসন্ধান, এবং DEM উচ্চতা কাজ করে না। আপনার স্থানাঙ্কগুলো প্রভাবিত হয় না।';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='নামহীন';
$ec_lang['lpn_crs_none']='জিওরেফারেন্সড নয়';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='একটি প্রকল্প তার নিজস্ব একক ধরে রাখে, তাই এই পছন্দটি শুধু এই প্রকল্পেরই, এবং এখানকার কিছুই ব্রাউজার সেটিং হিসেবে সংরক্ষিত হয় না। নতুন প্রকল্প একটি নির্দিষ্ট উপায়ে শুরু করতে, একটি খালি প্রকল্প আপনার টেমপ্লেট হিসেবে সংরক্ষণ করুন এবং প্রতিবার তার একটি কপি তৈরি করুন।';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='ঢাকা, বাংলাদেশ';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='তৈরি করুন';
$ec_lang['lpn_file_open']='খুলুন…';
$ec_lang['lpn_file_save']='সংরক্ষণ করুন';
$ec_lang['lpn_file_saveas']='নতুন নামে সংরক্ষণ করুন…';
$ec_lang['lpn_file_revert']='সংরক্ষিত সংস্করণে ফিরুন';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='সাম্প্রতিক ফাইল';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='সেই ফাইল খোলার অনুমতি দেওয়া হয়নি, তাই এটি খোলা হয়নি।';
$ec_lang['lpn_recent_gone']='{file} খোলা যায়নি। এটি সরানো, নাম পরিবর্তন বা মুছে ফেলা হয়ে থাকতে পারে, তাই এটি সাম্প্রতিক তালিকা থেকে বাদ দেওয়া হয়েছে।';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='নতুন প্রকল্প';
$ec_lang['lpn_tab_all']='সব প্রকল্প';
$ec_lang['lpn_tab_menu']='প্রকল্প মেনু';
$ec_lang['lpn_tab_duplicate']='অনুলিপি করুন';
$ec_lang['lpn_tab_move_left']='বামে সরান';
$ec_lang['lpn_tab_move_right']='ডানে সরান';
$ec_lang['lpn_tab_unsaved']='ফাইলে সংরক্ষিত হয়নি';
$ec_lang['lpn_import_bad_file']='সেই ফাইলটি এই পৃষ্ঠা থেকে সংরক্ষিত প্রকল্প হিসেবে পড়া যায়নি।';
$ec_lang['lpn_import_no_room']='এই প্রকল্প যোগ করার জন্য যথেষ্ট ব্রাউজার সংরক্ষণাগার অবশিষ্ট নেই। আপনার আর প্রয়োজন নেই এমন একটি প্রকল্প মুছে ফেলে আবার চেষ্টা করুন।';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='ঠিক আছে';
$ec_lang['lpn_file_import_menu']='আমদানি করুন…';
$ec_lang['lpn_file_import_inp']='EPANET ফাইল আমদানি করুন…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='একটি EPANET ফাইল থেকে একটি নেটওয়ার্ক পড়ুন, .inp টেক্সট ফাইল বা EPANET যে .net ফাইল সংরক্ষণ করে তার যেকোনোটি, এবং এই ব্রাউজারে এটি একটি নতুন প্রকল্প হিসেবে সংরক্ষণ করুন।';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='EPANET ফাইল এক্সপোর্ট করুন…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='এই নেটওয়ার্কটি একটি EPANET .inp ফাইল হিসেবে লিখুন এবং ডাউনলোড করুন। আপনি যা লিখেছেন তা ঠিক সেভাবেই লেখা হয়। .inp ফরম্যাট যা ধারণ করতে পারে না তা পরে আপনাকে তালিকা আকারে দেখানো হয়।';
$ec_lang['lpn_status_inp_exported']='{file} এক্সপোর্ট করা হয়েছে।';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n}টি জিনিস যা .inp ফরম্যাট ধারণ করতে পারে না।';
$ec_lang['lpn_inp_export_refused']='এই প্রকল্পটি EPANET ফাইল হিসেবে লেখা যায় না: {detail}';
$ec_lang['lpn_inp_bad_file']='সেই ফাইলটি একটি EPANET নেটওয়ার্ক ফাইল হিসেবে পড়া যায়নি।';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='এটি একটি EPANET .net ফাইলের মতো দেখাচ্ছে, কিন্তু এই পৃষ্ঠা এটি পড়তে পারেনি। EPANET-এ এটি খুলুন এবং সেখানকার ফাইল, রপ্তানি, নেটওয়ার্ক কমান্ড ব্যবহার করে .inp ফাইল হিসেবে সংরক্ষণ করুন, তারপর সেটি আমদানি করুন।';
$ec_lang['lpn_inp_report_heading']='{file} আমদানি করা হয়েছে';
$ec_lang['lpn_inp_report_counts']='{nodes}টি জাংশন, জলাধার ও ট্যাংক, {links}টি পাইপ, পাম্প ও ভালভ, {units} এককে।';
$ec_lang['lpn_inp_report_clean']='ফাইলের সবকিছু চলে এসেছে। কিছুই বাদ পড়েনি।';
$ec_lang['lpn_inp_report_label_anchor']='টেক্সট লেবেলগুলো EPANET যেভাবে বসায় সেভাবেই বসানো হয়েছে, তাদের উপরের বাম কোণ থেকে।';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='EPANET ফাইলে কোনো স্থানাঙ্ক পদ্ধতি থাকে না, তাই এই ফাইলটি শুরুতে জিওরেফারেন্সড থাকবে না। এটি বিশ্ব মানচিত্রে বসাতে, মানচিত্র, বিশ্ব মানচিত্র… ব্যবহার করুন। এর স্থানাঙ্ক রূপান্তর করতে, ফাইল, এভাবে রূপান্তর করুন… ব্যবহার করুন।';
$ec_lang['lpn_inp_report_lead']='এই পৃষ্ঠা EPANET যা করে তার সবকিছু ব্যবহার করে না, কিন্তু আপনার ফাইলের কিছুই ফেলে দেওয়া হয় না। নিচে দেখানো হলো আপনার ফাইলে যা আছে যা এই পৃষ্ঠা ব্যবহার না করেই রাখে, এবং ফাইলটি পড়ার সময় কী পরিবর্তিত হয়েছিল:';
$ec_lang['lpn_inp_drop_headloss']='এই ফাইল হেজেন-উইলিয়ামস সূত্র ব্যবহার করে না। এই পৃষ্ঠা হেজেন-উইলিয়ামস গণনা করে, তাই পাইপের রাফনেস সংখ্যাগুলো ঠিক যেমন লেখা ছিল তেমনই রাখা হয়েছে, কিন্তু এখানকার উত্তর EPANET-এর উত্তরের সাথে মিলবে না।';
$ec_lang['lpn_inp_drop_tank_curve']='এই ট্যাংকগুলোর পাশ সোজা নয়: ফাইলে তাদের আকৃতি একটি কার্ভ হিসেবে দেওয়া আছে। কার্ভটি লাইব্রেরি বাক্সে রাখা হয়, ট্যাংকটি এখনও সেটির কথা বলে, এবং একটি বর্ধিত সময়কাল সিমুলেশন সেই কার্ভের দেওয়া সময়সূচি অনুযায়ী ট্যাংকটি ভরে ও খালি করে। একটি একক মুহূর্তে উভয়ই একই রকম, কারণ পানির উপরিতল সেই স্তর যা ফাইলটি নির্ধারণ করে। ফাইলে লেখা ব্যাস কার্ভের পাশে রাখা হয় এবং এটিই সেই আকার যা দিয়ে একটি কার্ভবিহীন ট্যাংক আঁকা ও সমাধান করা হয়।';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='এই থ্রটল ভালভগুলো থ্রটল ভালভ হিসেবেই এসেছে, ফাইলে দেওয়া একই ক্ষতি বজায় রেখে। উভয় সমাধানকারীই এগুলো সমাধান করতে পারে।';
$ec_lang['lpn_inp_drop_valve_active']='এই ভালভগুলো চাপ বা প্রবাহ নিয়ন্ত্রণ করে, এবং পানির পরিবর্তনের সাথে সাথে সেগুলো নিজে থেকেই খোলে ও বন্ধ হয়। আমদানির সময় এগুলোর কোনো তথ্য হারায়নি, এবং এই পাতাটি EPANET সমাধানকারী দিয়ে এগুলো সমাধান করে, এই নেটওয়ার্কের জন্য সেই সমাধানকারীটি নিজে থেকেই চালু করে।';
$ec_lang['lpn_inp_drop_valve']='এই ভালভগুলো একটি বক্ররেখা বা একটি নির্দিষ্ট চাপ পতন দিয়ে বর্ণনা করা হয়েছে, এবং এই পৃষ্ঠায় এমন কোনো উপাদান নেই। এগুলো খোলা পাইপ হিসেবে এসেছে, তাই নেটওয়ার্কটি এখনও যুক্ত আছে, কিন্তু সেখানে আর চাপ বা প্রবাহ নিয়ন্ত্রণ করার কিছু নেই।';
$ec_lang['lpn_inp_drop_cv']='EPANET-এ এই পাইপগুলো পানিকে শুধু একদিকে যেতে দেয়। এগুলো সাধারণ পাইপ হিসেবে এসেছে, তাই এখন পানি এদের মধ্য দিয়ে যেকোনো দিকে প্রবাহিত হতে পারে।';
$ec_lang['lpn_inp_drop_demands']='এই জাংশনগুলোর একাধিক চাহিদা ছিল। চাহিদাগুলো যোগ করে এই পৃষ্ঠা যে একক চাহিদা ধরে রাখে তাতে মিলিয়ে দেওয়া হয়েছে।';
$ec_lang['lpn_inp_drop_patterns']='এই পৃষ্ঠা চাহিদার প্যাটার্নগুলো পড়েনি, কারণ এর যে অংশ বর্ধিত সময়কাল সিমুলেশন চালায় তা লোড হয়নি। প্রতিটি চাহিদা ফাইলে লেখা সংখ্যাটিই থাকে।';
$ec_lang['lpn_inp_drop_demand_pattern']='এই সংযোগস্থলগুলোর চাহিদা চালানো জুড়ে পরিবর্তিত হয়। তাদের প্যাটার্নগুলো পুরোপুরি এসেছে, এবং আপনি যে চাহিদা দেখছেন তা ঘড়িতে দেখানো মুহূর্তেরটি।';
$ec_lang['lpn_inp_drop_emitters']='এই জাংশনগুলোতে স্প্রিংকলার বা লিক সহগ আছে। এটি রাখা হয়েছে, এটি সমাধান করা হচ্ছে, এবং সেগুলোর প্রতিটির বৈশিষ্ট্যে Emitter coefficient বাক্সে এটি দেখানো হয়।';
$ec_lang['lpn_inp_drop_curve_long']='এই পাম্প বক্ররেখায় তিনটির বেশি বিন্দু ছিল। এর সর্বনিম্ন, মধ্যম ও সর্বোচ্চ বিন্দু রাখা হয়েছে, কারণ এই পৃষ্ঠা সর্বোচ্চ তিনটি বিন্দুতে একটি বক্ররেখা মেলায়।';
$ec_lang['lpn_inp_drop_curve_missing']='এই পাম্প এমন একটি কার্ভের কথা বলে যা ফাইলে নেই। পাম্পটি কোনো কার্ভ ছাড়াই এসেছে, তাই এটি কোনো জলশীর্ষ যোগ করে না।';
$ec_lang['lpn_inp_drop_pump_other']='এই পাম্পটি একটি বক্ররেখা দিয়ে নয়, বরং এটি যে শক্তি টানে তা দিয়ে বর্ণনা করা হয়েছে। এটি কোনো বক্ররেখা ছাড়াই এসেছে, তাই এটি কোনো হেড যোগ করে না।';
$ec_lang['lpn_inp_drop_head_pattern']='এই জলাধারগুলো চালানো জুড়ে ওঠানামা করে। তাদের প্যাটার্নগুলো পুরোপুরি এসেছে, এবং আপনি যে পানির স্তর দেখছেন তা ঘড়িতে দেখানো মুহূর্তেরটি।';
$ec_lang['lpn_inp_drop_pump_speed']='এই পাম্পগুলো তাদের কার্ভ যে গতিতে পরিমাপ করা হয়েছিল তার চেয়ে ভিন্ন গতিতে চলে, অথবা চালানো জুড়ে গতি পরিবর্তন করে। গতি ও তার প্যাটার্ন পুরোপুরি এসেছে, এবং আপনি যে জলশীর্ষ দেখছেন তা ঘড়িতে দেখানো মুহূর্তেরটি।';
$ec_lang['lpn_inp_drop_setting']='এই পাইপ, পাম্প ও ভালভগুলো এমন একটি সেটিং বহন করে যা এই পৃষ্ঠা ধরে রাখতে পারে না। এগুলো খোলা অবস্থায় এসেছে।';
$ec_lang['lpn_inp_drop_rules']='এই ফাইলে নিয়মভিত্তিক নিয়ন্ত্রণ আছে। এই পৃষ্ঠা সেগুলো পড়ে এবং ব্যবহার করে। EPANET সমাধানকারী দিয়ে মডেলটি চালান এবং নিয়মগুলো প্রয়োগ করা হয়, যাতে তাদের প্রতিটি স্তর, চাপ ও প্রবাহ এই প্রকল্প যে এককে দেখাচ্ছে তাতে বসানো হয়। লাইব্রেরি-র অধীনে নিয়ম খুলে একটি পড়ুন বা পরিবর্তন করুন। সেগুলো ঠিক ফাইলে লেখা অবস্থাতেই রাখা হয়, এবং আপনি একটি EPANET ফাইল সংরক্ষণ করলে সেগুলো আবার লেখা হয়।';
$ec_lang['lpn_inp_drop_eps']='এই ফাইলটি একটি বর্ধিত সময়কাল সিমুলেশন বর্ণনা করে। এই পৃষ্ঠার যে অংশ বর্ধিত সময়কাল সিমুলেশন চালায় তা লোড হয়নি, তাই শুধু শুরুর অবস্থাগুলোই এসেছে।';
$ec_lang['lpn_inp_drop_quality']='এই ফাইলটি বর্ণনা করে পানির গুণমান চলার পথে কীভাবে পরিবর্তিত হয়: শুরুতে পানিতে কী আছে, এবং সেই পদার্থ পাইপ ও ট্যাংকে কত দ্রুত বিক্রিয়া করে। এই পৃষ্ঠা এই সংখ্যাগুলো পড়ে এবং ব্যবহার করে। সেটিংস, হিসাব, গুণমান-এ একটি রাসায়নিক বেছে নিন, তারপর মডেলটি চালান, এবং চালানো এগোনোর সাথে সাথে নেটওয়ার্ক জুড়ে ঘনমাত্রা হিসাব করা হয়। লাইনগুলো রাখা হয়, এবং আপনি একটি EPANET ফাইল সংরক্ষণ করলে সেগুলো আবার লেখা হয়।';
$ec_lang['lpn_inp_drop_sources_mixing']='এই ফাইলটি বলে নেটওয়ার্কে কোথায় একটি রাসায়নিক প্রয়োগ করা হয়, এবং একটি ট্যাংকের পানি কীভাবে মেশে। একটি ডোজ যে নোডে যোগ করা হয় সেখানে দেখা যায়, এবং একটি ট্যাংক বলে দেয় সে কোন মিশ্রণ মডেল অনুসরণ করে। ডোজ ও মিশ্রণ মডেল উভয়ই শুধু EPANET সমাধানকারী দিয়ে হিসাব করা হয়।';
$ec_lang['lpn_inp_drop_energy']='এই EPANET ফাইলে পাম্পিং খরচের মডেলিং তথ্য আছে। এই পৃষ্ঠা তা পড়ে এবং ব্যবহার করে। EPANET সমাধানকারী দিয়ে মডেলটি চালান, তারপর পানি, প্রতিবেদন, পাম্প শক্তি খুলে দেখুন প্রতিটি পাম্প কতক্ষণ চলেছে, কতটা শক্তি টেনেছে, কতটা শক্তি ব্যবহার করেছে এবং তার খরচ কত। লাইনগুলো রাখা হয়, এবং আপনি একটি EPANET ফাইল সংরক্ষণ করলে সেগুলো আবার লেখা হয়।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='এই ফাইলটি এর কিছু সংযোগস্থল, পাইপ বা অন্যান্য উপাদানকে ট্যাগ দেয়। প্রতিটি ট্যাগ পুরোপুরি এসেছে, এবং প্রতিটি তার নিজের উপাদানের বৈশিষ্ট্যে বসে আছে, যেখানে আপনি এটি পড়তে বা পরিবর্তন করতে পারেন।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='এই ফাইলে EPANET যে প্রতিবেদন ছাপায় তা কীভাবে সাজানো হবে তার নিজস্ব সেটিংস আছে। আপনি এখানে, প্রতিবেদন, EPANET চালানো-র অধীনে ইঞ্জিনের প্রতিবেদন পড়তে পারেন, তবে তা এই সেটিংসের চাওয়া বিন্যাসের বদলে ইঞ্জিনের নিজস্ব প্রমিত বিন্যাসে বেরিয়ে আসে। লাইনগুলো রাখা হয়, এবং আপনি একটি EPANET ফাইল সংরক্ষণ করলে সেগুলো আবার লেখা হয়।';
$ec_lang['lpn_inp_drop_sections']='এই ফাইলে একটি অংশ আছে যা এই পৃষ্ঠা মোটেও পড়ে না। এখানে এটি ব্যবহার করা হয় না। এটি অক্ষত রাখা হয়, এবং আপনি একটি EPANET ফাইল সংরক্ষণ করলে এটি আবার লেখা হয়।';
$ec_lang['lpn_inp_drop_quality_options']='এই ফাইলে EPANET-এর পানির গুণমান সংক্রান্ত বিকল্পগুলো বলা আছে: Quality বিকল্প, যা পানির গুণমান বিশ্লেষণের ধরন নির্দেশ করে, এবং একটি রাসায়নিকের সাথে যুক্ত দুটি সেটিং, Relative diffusivity ও Quality tolerance। তিনটিই রাখা হয় এবং তিনটিই ব্যবহার করা হয়। পানির বয়স, উৎস ট্রেস ও একটি রাসায়নিক এখানে হিসাব করা হয়, এবং একটি রাসায়নিক চালালে দুটি সেটিং EPANET সমাধানকারীকে দেওয়া হয়। আপনি একটি EPANET ফাইল সংরক্ষণ করলে সবগুলো আবার লেখা হয়।';
$ec_lang['lpn_inp_drop_file_options']='এই ফাইলটি একটি সহায়ক ফাইলের কথা বলে: Map, যাতে স্থানাঙ্ক থাকে, অথবা Hydraulics, যাতে আগে থেকে হিসাব করা হাইড্রোলিক্স থাকে। এই পৃষ্ঠা কোনোটিই খুলতে পারে না, তাই লাইনগুলো যেমন আছে তেমনই রাখা হয় এবং আপনি একটি EPANET ফাইল সংরক্ষণ করলে আবার লেখা হয়।';
$ec_lang['lpn_inp_drop_other_options']='এই ফাইলে এমন বিকল্প বলা আছে যা এই পৃষ্ঠা পড়ে না। এখানে সেগুলো ব্যবহার করা হয় না। সেগুলো রাখা হয় এবং আপনি একটি EPANET ফাইল সংরক্ষণ করলে আবার লেখা হয়।';
$ec_lang['lpn_inp_drop_net_options']='এই EPANET .net ফাইলে এমন সেটিংস বলা আছে যার জন্য এই পৃষ্ঠায় কোনো নিয়ন্ত্রণ নেই, তাই সেগুলোর মান বহন করার বদলে এখানে তালিকাভুক্ত করা হয়েছে। বাকি সবকিছু চলে এসেছে। এগুলো দরকার হলে, EPANET-এ ফাইলটি খুলুন এবং ফাইল, রপ্তানি, নেটওয়ার্ক ব্যবহার করে এটি একটি .inp ফাইল হিসেবে সংরক্ষণ করুন, তারপর সেটি আমদানি করুন।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='এটি একটি EPANET .net ফাইল ছিল। এটি EPANET-এর নিজস্ব প্রকল্প ফাইল, এর কোনো প্রকাশিত বিবরণ নেই, এবং এই পৃষ্ঠা উদাহরণ ফাইল থেকে বিন্যাসটি বুঝে নিয়ে এটি পড়ে, তাই এটি একটি নির্ভরযোগ্য পথ হিসেবে নয়, শুধু আর কিছু না থাকলেই ব্যবহার করুন। .inp ফাইলটি হলো নথিভুক্ত বিন্যাস যা প্রতিটি অন্য প্রোগ্রাম পড়ে: EPANET-এ একটি লিখতে ফাইল, রপ্তানি, নেটওয়ার্ক ব্যবহার করুন, এবং যখনই সম্ভব তার বদলে সেটি আমদানি করুন।';
$ec_lang['lpn_inp_drop_backdrop']='এই ফাইল একটি পটভূমি চিত্রের নাম বলে কিন্তু চিত্রটি নিজেই ধারণ করে না। ফাইল, পটভূমি চিত্র, চিত্র যোগ করুন দিয়ে নিজে এটি যোগ করুন।';
$ec_lang['lpn_inp_drop_dangling']='এই পাইপগুলো এমন একটি জাংশনের নাম বলে যা ফাইলে নেই, তাই সেগুলো বাদ দেওয়া হয়েছে।';
$ec_lang['lpn_inp_drop_units']='এই ফাইলে উল্লেখিত প্রবাহের এককটি এই পৃষ্ঠা চেনে না, তাই প্রতিটি সংখ্যা গ্যালন প্রতি মিনিট ধরে পড়া হয়েছে। উত্তর ব্যবহারের আগে প্রতিটি সংখ্যা পরীক্ষা করুন।';
$ec_lang['lpn_inp_drop_anchor_missing']='এই টেক্সটটি এমন একটি জাংশন, জলাধার বা ট্যাংকের সাথে যুক্ত ছিল যা ফাইলে নেই। এটি ফাইলে যেখানে বসানো ছিল সেখানেই একটি মুক্ত টেক্সট হিসেবে এসেছে, এবং এখন এটি কারও সাথে যুক্ত নয়।';
$ec_lang['lpn_import_notes_heading']='এই প্রকল্পটি একটি EPANET ফাইল থেকে পড়া হয়েছে। সেই ফাইলে যা আছে তার কিছু রাখা হয়েছে কিন্তু এই পৃষ্ঠায় ব্যবহার করা হয় না।';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='একটি ফাইল থেকে {name} খোলা হয়েছে, এবং এটি এই ব্রাউজারে একটি নতুন প্রকল্প হিসেবে যোগ করা হয়েছে।';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='প্রকল্প ফাইল';
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
$ec_lang['lpn_file_upload_explain']='এই ব্রাউজার কোনো ফাইলের সাথে সংযুক্ত হতে পারে না, তাই এখানে ফাইল খোলা আসলে একটি আপলোড: প্রকল্পটি এই ব্রাউজারে কপি করা হয়, এবং আপনার কাজ ফাইলে ফিরিয়ে সংরক্ষণ করার একমাত্র উপায় হলো ফাইল, নতুন নামে সংরক্ষণ করুন দিয়ে ফাইলটি প্রতিস্থাপন করা।';
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
$ec_lang['lpn_file_saveas_tip_download']='আপনার ব্রাউজারের ডাউনলোড সেটিং ব্যবহার করে সংরক্ষণ করে। এই ব্রাউজার কোনো ফাইলের সাথে সংযুক্ত হতে পারে না, তাই সংরক্ষণ করুন নিষ্ক্রিয় এবং শুধু নতুন নামে সংরক্ষণ করুন পাওয়া যায়। আপনি যদি আপনার ব্রাউজারের "প্রতিটি ফাইল কোথায় সংরক্ষণ করব জিজ্ঞাসা করুন" সেটিং চালু করেন, তাহলে আপনি মূল ফাইলটি বেছে নিয়ে সেটি প্রতিস্থাপন করতে পারবেন।';
$ec_lang['lpn_status_uploaded']='প্রকল্প ফাইল আপলোড হয়েছে। এর সাথে কোনো সংযোগ বজায় রাখা যায় না, তাই এতে ফিরিয়ে সংরক্ষণ করার একমাত্র উপায় হলো ফাইল, নতুন নামে সংরক্ষণ করুন ব্যবহার করা।';
$ec_lang['lpn_status_downloaded']='{file} ডাউনলোড হয়েছে। এই ব্রাউজার কোনো ফাইলের সাথে সংযুক্ত হতে পারে না, তাই এই প্রকল্পটি ফাইলে সংরক্ষিত হয়নি হিসেবে চিহ্নিত থাকে।';
$ec_lang['lpn_status_file_opened']='{file} খোলা হয়েছে।';
$ec_lang['lpn_status_already_open']='সেই ফাইলটি ইতিমধ্যে এখানে {name} হিসেবে খোলা আছে, তাই দ্বিতীয় কপি খোলার বদলে এটিতে পরিবর্তন করা হয়েছে।';
$ec_lang['lpn_status_already_open_dirty']='সেই ফাইলটি ইতিমধ্যে এখানে {name} হিসেবে খোলা আছে, যাতে সংরক্ষণ না করা পরিবর্তন আছে। দ্বিতীয় কপি খোলার বদলে এটিতে পরিবর্তন করা হয়েছে। ডিস্কের সংস্করণ চাইলে ফাইল, সংরক্ষিত সংস্করণে ফিরুন ব্যবহার করুন।';
$ec_lang['lpn_status_saved']='{file} সংরক্ষণ করা হয়েছে।';
$ec_lang['lpn_status_reverted']='{file} ডিস্ক থেকে আবার লোড করা হয়েছে।';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='বন্ধ করার আগে {name}-এ আপনার পরিবর্তনগুলো সংরক্ষণ করবেন?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} শুধুমাত্র এই ব্রাউজারে রাখা আছে। ফাইলে সংরক্ষণ না করে বন্ধ করলে এটি চিরতরে হারিয়ে যাবে।';
$ec_lang['lpn_close_discard']='সংরক্ষণ না করে বন্ধ করুন';
$ec_lang['lpn_cancel']='বাতিল';
$ec_lang['lpn_revert_confirm']='আপনার করা পরিবর্তনগুলো ফেলে দিয়ে ডিস্ক থেকে {file} আবার লোড করবেন?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='এই প্রকল্পটি {file} থেকে এসেছিল, কিন্তু সেই ফাইলের সাথে সংযোগ হারিয়ে গেছে। সংযুক্ত হতে ফাইলটি আবার বেছে নিন।';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='ফাইলে লেখা যায়নি। এটি সরানো বা নাম পরিবর্তন করা হয়ে থাকতে পারে, অথবা অনুমতি প্রত্যাহার করা হতে পারে। আপনার কাজ এখনো এই ব্রাউজারে সংরক্ষিত আছে।';
$ec_lang['lpn_file_changed_elsewhere']='আপনি খোলার পর অন্য কেউ এই ফাইলে সংরক্ষণ করেছেন, তাই এখন সংরক্ষণ করলে তাদের কাজ মুছে যাবে। আপনার পরিবর্তনগুলো আপনার নিজের একটি ফাইলে রাখতে ফাইল, নতুন নামে সংরক্ষণ করুন ব্যবহার করুন, অথবা আপনারগুলো ফেলে দিয়ে তাদেরটি লোড করতে ফাইল, সংরক্ষিত সংস্করণে ফিরুন ব্যবহার করুন।';
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
$ec_lang['lpn_lock_somebody']='অন্য কেউ';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} এই ফাইলটি খোলা রেখেছে।';
$ec_lang['lpn_lock_open_readonly']='শুধু-পঠন খুলুন';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='লক ভাঙুন';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='এই ফাইলটি ব্যবহৃত হচ্ছে বলে মনে হচ্ছে।';
$ec_lang['lpn_lock_open_care']='তথ্য হারানো এড়াতে, নিচের বিকল্পগুলো থেকে সাবধানে বেছে নিন।';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='এটি {x} ধরে ব্যবহৃত হচ্ছে।';
$ec_lang['lpn_lock_age_edited']='এটি সর্বশেষ {x} আগে সম্পাদনা করা হয়েছিল।';
$ec_lang['lpn_lock_age_saved']='এটি সর্বশেষ {x} আগে সংরক্ষণ করা হয়েছিল।';
$ec_lang['lpn_lock_age_never_saved']='এখনও এই ফাইলে কিছুই সংরক্ষণ করা হয়নি।';
$ec_lang['lpn_lock_age_unknown']='এটি কতক্ষণ ধরে ব্যবহৃত হচ্ছে, অথবা কখন সর্বশেষ সংরক্ষণ বা সম্পাদনা করা হয়েছিল তার কোনো রেকর্ড নেই।';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"জিজ্ঞাসা করুন" যার কাছে এই ফাইলটি খোলা আছে তাকে জানায় যে আপনি এটি চান, আর অন্য কিছু পরিবর্তন করে না। "শুধু-পঠন খুলুন" আপনাকে এটি দেখতে এবং আপনার ইচ্ছেমতো যেকোনো কিছু পরিবর্তন করতে দেয়, কিন্তু এখানে সংরক্ষণ করতে পারবেন না। "তাদের লক ভেঙে দিন" আপনাকে ফাইলটির উপর সংরক্ষণ করতে দেয়; তাদের অসংরক্ষিত কাজ হারায় না, কিন্তু তারা আর এখানে এটি সংরক্ষণ করতে পারবে না, এবং কাউকে হয়তো দুটো হাতে করে মেলাতে হবে।';
$ec_lang['lpn_lock_ask']='জিজ্ঞাসা করুন';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='কে জিজ্ঞাসা করছে বলে জানাব? আপনার আদ্যক্ষরগুলো আদর্শ। যার কাছে এই ফাইলটি খোলা আছে তার জন্য, এগুলো আমাদের সার্ভারে ফাইলটির লকের সাথে সংরক্ষিত থাকে, এবং ৩০ দিনের মধ্যে মুছে ফেলা হয়।';
$ec_lang['lpn_lock_ask_sent']='যার কাছে এই ফাইলটি খোলা আছে তাকে এটি বন্ধ করতে আমরা অনুরোধ করেছি। তাদের পৃষ্ঠা এখনও খোলা থাকলে তারা এক মিনিটের মধ্যে এটি দেখবে। আর কিছু পরিবর্তিত হয়নি, এবং তারা এটি বন্ধ না করা পর্যন্ত ফাইলটি এখনও তাদেরই।';
$ec_lang['lpn_lock_ask_failed']='আপনার বার্তাটি পৌঁছানো যায়নি। হয় এখন কারও কাছে এই ফাইলটি খোলা নেই, অথবা সার্ভারে পৌঁছানো যায়নি।';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='সেই ফাইলটি খোলা হয়নি, এবং এখানে কিছুই পরিবর্তিত হয়নি। অন্য কেউ এখনও এটি খুলে রেখেছে।';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} এই ফাইলটি সম্পাদনা করতে চায়। আপনি প্রস্তুত হলে, আপনার কাজ সংরক্ষণ করুন এবং এটি হস্তান্তর করতে ফাইল, বন্ধ করুন ব্যবহার করুন।';
$ec_lang['lpn_ago_seconds']='{n} সেকেন্ড';
$ec_lang['lpn_ago_minutes']='{n} মিনিট';
$ec_lang['lpn_ago_hours']='{n} ঘণ্টা';
$ec_lang['lpn_ago_days']='{n} দিন';
$ec_lang['lpn_ago_unknown']='অজানা সময়';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='বার্তা';
$ec_lang['lpn_msglog_heading']='সাম্প্রতিক বার্তা';
$ec_lang['lpn_msglog_empty']='এখনও কোনো বার্তা নেই।';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} আগে';
$ec_lang['lpn_msglog_note']='সবচেয়ে নতুনটি প্রথমে। এই পৃষ্ঠা খোলা থাকা অবস্থায় সর্বশেষ {n}টি বার্তা রাখে, এবং আপনার কম্পিউটারে কিছুই সংরক্ষিত হয় না।';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='শুধু-পঠন: {name} এই ফাইলটি খোলা রেখেছে। আপনি এখানে যা ইচ্ছা পরিবর্তন করতে পারেন, কিন্তু সংরক্ষণ করতে পারবেন না। ভিন্ন ফাইলে সংরক্ষণ করতে ফাইল, নতুন নামে সংরক্ষণ করুন ব্যবহার করুন।';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='সতর্কতা: এই প্রকল্পে লক পরীক্ষা বা তৈরি করতে সার্ভারে পৌঁছানো যায়নি, তাই একই সময়ে একই ফাইল সম্পাদনা করা থেকে কোনো সহকর্মীকে কিছুই আটকাচ্ছে না। লকিং আবার কাজ শুরু করলে আপনাকে জানানো হবে।';
$ec_lang['lpn_lock_storage_error']='সতর্কতা: এই সাইট লক রেকর্ড সংরক্ষণ করতে পারে না, তাই একই সময়ে একই ফাইল সম্পাদনা করা থেকে কোনো সহকর্মীকে কিছুই আটকাচ্ছে না। এটি সার্ভারের একটি সেটআপ ত্রুটি, এখানে আপনার ঠিক করার মতো কিছু নয় — লক ফোল্ডারটি ওয়েব সার্ভার দ্বারা লেখার যোগ্য নয়।';
$ec_lang['lpn_lock_full_error']='সতর্কতা: কোন প্রকল্প কে খুলে রেখেছে তা রেকর্ড করার জায়গা এই সাইটের ফুরিয়ে গেছে, তাই একই সময়ে একই ফাইল সম্পাদনা করা থেকে কোনো সহকর্মীকে কিছুই আটকাচ্ছে না। এটি সার্ভারের একটি সেটআপ ত্রুটি, এখানে আপনার ঠিক করার মতো কিছু নয়।';
$ec_lang['lpn_lock_not_asked']='এই প্রকল্পের জন্য লকিং চলছে না, তাই একই সময়ে একই ফাইল সম্পাদনা করা থেকে কোনো সহকর্মীকে কিছুই আটকাচ্ছে না। এই প্রকল্পের এখনো কোনো শনাক্তকারী নেই, এবং এটি ফাইলে সংরক্ষণ করলে একটি পাবে।';
$ec_lang['lpn_lock_restored']='লকিং আবার কাজ করছে, এবং এই ফাইলটি এখন আপনার সংরক্ষণ করার জন্য উপলব্ধ।';
$ec_lang['lpn_lock_dismiss']='এই বার্তাটি লুকান';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='আপনার প্রকল্প এই কম্পিউটারের একটি ফাইলে সংরক্ষিত হবে। এটি শুধু আপনি চাইলেই সংরক্ষিত হয়, অন্য কোনো সময় নয়, তাই আপনার অজান্তে সেই ফাইলে কিছুই লেখা হয় না।';
$ec_lang['lpn_file_training_2']='যাতে দুজন কখনো একই ফাইল একই সময়ে সম্পাদনা না করেন, এই সাইট কে এটি খুলে রেখেছে তার হিসাব রাখে। কেউ ইতিমধ্যে এটি খুলে রাখলেও, আপনি এটি খুলে দেখতে পারেন, অথবা নিজের একটি কপি রাখতে পারেন।';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='আপনি প্রথমবার সংরক্ষণ করলে, আপনার ব্রাউজার জিজ্ঞাসা করবে এই সাইট ফাইলটি সম্পাদনা করতে পারে কিনা। এই প্রশ্নটি ব্রাউজার থেকে আসে, আমাদের থেকে নয়, এবং হ্যাঁ বলাই সংরক্ষণ করুনকে আপনার কাজ ফিরিয়ে লিখতে দেয়। এটি সাধারণত প্রতি ফাইলে একবারই জিজ্ঞাসা করা হয়।';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='চালিয়ে যান';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='ফাইলটি আবার বেছে নিন';
$ec_lang['lpn_file_reconnect']='এই ফাইলের সাথে পুনরায় সংযুক্ত করুন';
$ec_lang['lpn_file_reconnect_alert']='এই প্রকল্পটি {file} থেকে এসেছিল। এতে লেখার আগে আপনার ব্রাউজারের আবার আপনার অনুমতি প্রয়োজন। নিচে পুনরায় সংযুক্ত করুন।';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='এটি সেই একই ফাইল যা অন্য কেউ খুলে রেখেছে, তাই এর উপর সংরক্ষণ করা যাবে না। ভিন্ন ফাইল বা ভিন্ন নাম বেছে নিন।';
$ec_lang['lpn_saveas_overwrites_project']='সেই ফাইলে ইতিমধ্যে একটি ভিন্ন প্রকল্প আছে, {name}। এখানে সংরক্ষণ করলে এটি সম্পূর্ণ প্রতিস্থাপিত হবে। চালিয়ে যাবেন?';
$ec_lang['lpn_saveas_overwrites_newer']='আপনি শেষবার দেখার পর সেই ফাইলটি পরিবর্তিত হয়েছে, তাই প্রায় নিশ্চিতভাবেই অন্য কেউ এতে সংরক্ষণ করেছে। এখানে সংরক্ষণ করলে তাদের সংস্করণ আপনারটি দিয়ে প্রতিস্থাপিত হবে। চালিয়ে যাবেন?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='এই প্রকল্পের নাম';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='{closed} বন্ধ করা হয়েছে। এখন {opened} দেখানো হচ্ছে।';
$ec_lang['lpn_status_closed_empty']='{closed} বন্ধ করা হয়েছে। একটি নতুন খালি প্রকল্প শুরু করা হয়েছে।';
$ec_lang['lpn_storage_full']='সংরক্ষিত হয়নি। ব্রাউজার সংরক্ষণাগার পূর্ণ বা অনুপলব্ধ, তাই এই ট্যাব বন্ধ করলে আপনার সাম্প্রতিক পরিবর্তনগুলো হারিয়ে যাবে।';
$ec_lang['lpn_storage_unreadable']='সংরক্ষণ করা হয়নি। এই প্রকল্পটি ব্রাউজার সংরক্ষণাগার থেকে পড়া যায়নি। এর সংরক্ষিত কপি ঠিক যেমন আছে তেমনই রাখা হয়েছে এবং তার উপর কিছু লেখা হবে না, তাই এই ট্যাবে কিছুই সংরক্ষণ করা হচ্ছে না। কাজ চালিয়ে যেতে একটি ফাইল খুলুন অথবা একটি নতুন প্রকল্প তৈরি করুন।';
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
$ec_lang['lpn_about_credits']='কৃতজ্ঞতা';
$ec_lang['lpn_help_welcome']='স্বাগত পাতা';
$ec_lang['lpn_about_license']='GNU General Public License v3.0 বা পরবর্তী সংস্করণের অধীনে লাইসেন্সপ্রাপ্ত।';
$ec_lang['lpn_notes_1_term']='এটি কীভাবে সমাধান করা হয়';
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
$ec_lang['lpn_notes_1_def']='EPANET সমাধানকারী এই নেটওয়ার্কটি সমাধান করে। একটি মোট চলার সময় নির্ধারণ করুন এবং প্রতিটি প্রতিবেদন ধাপ পালাক্রমে হিসাব করা হয়: ট্যাংক ভরে ও খালি হয়, চাহিদাগুলো তাদের প্যাটার্ন অনুসরণ করে, এবং টুলবার রানটি প্লে-ব্যাক করে।';
$ec_lang['lpn_notes_2_term']='এটি যা করে না';
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
$ec_lang['lpn_notes_2_def']='পানির গুণমান মডেল করা হয়: পানির বয়স, উৎস ট্রেস, এবং পাইপের দেয়ালে ও পানির মূল অংশে বিক্রিয়া করা একটি রাসায়নিক। সার্জ ও ওয়াটার হ্যামার মডেল করা হয় না: এখানকার প্রতিটি উত্তর স্থিরভাবে প্রবাহিত পানির জন্য, একটি ভালভ হঠাৎ বন্ধ হলে তৈরি চাপ তরঙ্গের জন্য নয়।';
$ec_lang['lpn_notes_3_term']='প্রকল্প সংরক্ষণ';
$ec_lang['lpn_notes_3_def']='প্রতিটি প্রকল্প একটি ট্যাব, এবং আপনি কাজ করার সময় প্রতিটি ট্যাব এই ব্রাউজারে সংরক্ষিত হয়। আপনার ব্রাউজারের ডেটা মুছে ফেললে এগুলো সব মুছে যায়, তাই আপনার কাজ একটি ফাইলে রাখুন: ফাইল, নতুন নামে সংরক্ষণ করুন। একটি ট্যাবে তারকাচিহ্ন মানে এতে এমন পরিবর্তন আছে যা কোনো ফাইলে নেই। আপনি না চাইলে কখনোই কোনো ফাইলে কিছু লেখা হয় না। কিছু ব্রাউজারে একটি প্রকল্প আপনি যে ফাইলে সংরক্ষণ করেন তার সাথে সংযুক্ত হয়, এবং ফাইল, সংরক্ষণ করুন তখন থেকে সেই একই ফাইলে ফিরিয়ে লেখে; অন্যগুলোতে কোনো সংযোগ সম্ভব নয়, তাই সংরক্ষণ করুন নিষ্ক্রিয় থাকে এবং শুধু নতুন নামে সংরক্ষণ করুন পাওয়া যায়। একটি প্রকল্প ফাইল একটি শেয়ার্ড ড্রাইভে রাখা থাকলে, এই পৃষ্ঠা আপনাকে জানায় যদি কোনো সহকর্মী ইতিমধ্যে এটি খুলে রাখে, যাতে দুজন একে অপরের কাজের উপর না লেখেন।';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='পাম্প বক্ররেখা';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='একটি পাম্প H = H₀ − aQ^b অনুসরণ করে, যেখানে H হলো পাম্প যে জলশীর্ষ যোগ করে এবং Q হলো এর মধ্য দিয়ে প্রবাহ। প্রস্তুতকারকের কার্ভ থেকে এক, দুই বা তিনটি বিন্দু লিখুন। তিনটি বিন্দু — শূন্য প্রবাহে জলশীর্ষ, স্বাভাবিক কার্যকরী বিন্দু, এবং সর্বোচ্চ প্রবাহের বিন্দু — সরাসরি H₀, a ও b মেলায়, এবং প্রকাশিত কার্ভকে সবচেয়ে কাছ থেকে অনুসরণ করে। দুটি বিন্দু একটি প্যারাবোলা (b = 2) মেলায় যার শীর্ষবিন্দু শূন্য প্রবাহে থাকে। একটি বিন্দু একটি প্রচলিত নিয়ম ব্যবহার করে: শূন্য প্রবাহে জলশীর্ষ হলো আপনার লেখা জলশীর্ষের ১.৩৩ গুণ, এবং সর্বোচ্চ প্রবাহ হলো আপনার লেখা প্রবাহের ২ গুণ, যা আবার b = 2 দেয়। কোনো বিন্দু না লেখা পাম্প কোনো জলশীর্ষই যোগ করে না। কার্ভটি জলশীর্ষ শূন্যে পৌঁছালে কাটা হয় না, তাই একটি পাম্পকে তার কার্ভ দিতে পারে তার চেয়ে বেশি প্রবাহ চাইলে একটি ঋণাত্মক জলশীর্ষ পাওয়া যায়। সমাধান হলো একটি বড় পাম্প বা একটি ছোট চাহিদা, ভিন্ন কার্ভ মেলানো নয়। একটি কার্ভ তিনটির বেশি বিন্দু ধরে রাখতে পারে, এবং আপনার দেওয়া প্রতিটি বিন্দুই পড়া হয়।';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='টেবিল কলাম সহায়তা';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>কলাম নির্বাচন করুন</td><td>শিরোনামে ক্লিক করুন</td></tr><tr><td>কলাম নির্বাচন যোগ বা প্রসারিত করুন</td><td>Ctrl+ক্লিক অথবা Shift+ক্লিক অন্য শিরোনামে</td></tr><tr><td>নির্বাচিত কলাম(গুলো) সরান (পুনর্বিন্যাস করুন)</td><td>টেনে আনুন অথবা রাইট-ক্লিক বা ⋮ মেনুতে কলাম পরিচালনা করুন… ব্যবহার করুন</td></tr><tr><td>মেনু ⋮ ও সাজানোর তীরচিহ্ন।</td><td>একটি শিরোনামের উপরের কোণে হোভার করুন, অথবা একটি শিরোনামে নির্বাচন করুন বা Tab করুন</td></tr><tr><td>লুকান, সব দেখান, অথবা দৃশ্যমানতা ও ক্রম পরিচালনা করুন</td><td>শিরোনামে রাইট-ক্লিক করুন বা শিরোনামের উপরের ডান কোণে ⋮ মেনু</td></tr><tr><td>কলাম অনুসারে সাজান</td><td>শিরোনামের উপরের ডান কোণে তীরচিহ্ন আইকন</td></tr><tr><td>টেবিলের শেষে নতুন সারি হিসেবে পেস্ট করুন</td><td>রাইট-ক্লিক, শিরোনামের উপরের ডান কোণে ⋮ মেনু, অথবা Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='টেবিল কিবোর্ড শর্টকাট';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>তীর কী</td><td>নেভিগেট করুন।</td></tr><tr><td>Tab, Enter</td><td>প্রবেশ শেষ করুন এবং একটি কক্ষ পাশে / নিচে নেভিগেট করুন।</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>পেছনে নেভিগেট করুন।</td></tr><tr><td>Shift+তীর কী</td><td>নির্বাচন প্রসারিত করুন।</td></tr><tr><td>Ctrl+C</td><td>নির্বাচন কপি করুন।</td></tr><tr><td>Ctrl+D</td><td>নির্বাচনকে এর উপরের সারি থেকে নিচে পূরণ করুন।</td></tr><tr><td>Ctrl+Enter</td><td>নির্বাচনকে সক্রিয় কক্ষের মান দিয়ে পূরণ করুন।</td></tr><tr><td>Ctrl+A</td><td>পুরো টেবিল নির্বাচন করুন।</td></tr><tr><td>Ctrl+Shift+V</td><td>টেবিলের শেষে নতুন সারি হিসেবে পেস্ট করুন।</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>পরবর্তী বা পূর্ববর্তী ট্যাবে যান, তা টেবিল হোক বা গ্রাফ।</td></tr><tr><td>Delete</td><td>একটি কক্ষ পরিষ্কার করুন।</td></tr><tr><td>F2</td><td>সম্পাদনার জন্য একটি কক্ষ খুলুন।</td></tr><tr><td>Esc</td><td>সম্পাদনা বাতিল করুন।</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='রঙের ব্যান্ড সীমা একই থাকে';
$ec_lang['lpn_notes_color_def']='আপনি একটি ডেটা শ্রেণিবিন্যাস পদ্ধতি বেছে নিলে রঙের ব্যান্ড সীমা নির্ধারিত হয়। প্রতিটি সময় ধাপে সেগুলো আবার নির্ধারিত হয় না, কারণ তাহলে প্রতিটি ধাপে রঙগুলোর অর্থ নতুন কিছু হয়ে যেত, যা আপনার সিস্টেম কল্পনা করতে সহায়ক নয়। EPANET একইভাবে কাজ করে। নতুন সীমা পেতে, আবার একটি পদ্ধতি বেছে নিন অথবা আপনার নিজের সীমা লিখুন।';
$ec_lang['lpn_notes_epanet_term']='হেজেন-উইলিয়ামস ধ্রুবক EPANET-এর সাথে মেলানো হয়েছে';
$ec_lang['lpn_notes_epanet_def']='২০২৬ সালের আগস্টে হেজেন-উইলিয়ামস সহগ ও সূচক EPANET-এর সাথে মেলাতে পরিবর্তন করা হয়েছে। জলশীর্ষ ক্ষতির ফলাফল এই পৃষ্ঠার আগের সংস্করণগুলো থেকে সর্বোচ্চ ০.১ শতাংশ ভিন্ন, যা C মানের অনিশ্চয়তার চেয়ে অনেক কম।';
$ec_lang['lpn_notes_engine_term']='এই পৃষ্ঠা কোন EPANET চালায়';
$ec_lang['lpn_notes_engine_def']='এই পৃষ্ঠার EPANET সমাধানকারীটি OWA-EPANET 2.3.5, যা ২০ ফেব্রুয়ারি ২০২৫-এ প্রকাশিত হয়েছে। EPANET তৈরি করে Open Water Analytics, একটি সম্প্রদায় যারা মার্কিন যুক্তরাষ্ট্রের পরিবেশ সুরক্ষা সংস্থার সাথে কাজ করে, যারা ডিসেম্বর ২০১৯-এ 2.2.0 সংস্করণ প্রকাশ করেছিল। চালানোর প্রতিবেদনে একে 2.3.05 বলা হয় কারণ ইঞ্জিনটি শেষ সংখ্যাটি দুই অঙ্কে লেখে। এটি Luke Butler-এর epanet-js 0.9.0-এর মাধ্যমে, MIT লাইসেন্সের অধীনে, এই পৃষ্ঠায় পৌঁছায়, এবং এটি আপনার ব্রাউজারের ভেতরেই চলে: আপনার নেটওয়ার্ক সমাধানের জন্য কখনও কোথাও পাঠানো হয় না।';
$ec_lang['lpn_id_invalid']='কোনো ফাঁকা স্থান বা উদ্ধৃতি চিহ্ন ছাড়া একটি ID লিখুন।';
$ec_lang['lpn_id_taken']='সেই ID ইতিমধ্যে ব্যবহৃত হচ্ছে।';
$ec_lang['lpn_diag_no_fixed_head']='একটি জলাধার বা একটি ট্যাংক যোগ করুন। সমাধান করার আগে নেটওয়ার্কে অন্তত একটি জানা পানির স্তর থাকা প্রয়োজন।';
$ec_lang['lpn_diag_dangling_link']='একটি পাইপ বা পাম্প এমন একটি নোডের সাথে সংযুক্ত যা আর নেই:';
$ec_lang['lpn_diag_unreachable']='এই নোডগুলোর কোনো জলাধারে যাওয়ার পথ নেই:';
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
$ec_lang['lpn_engine_fetching']='EPANET সমাধানকারী আনা হচ্ছে। এটি একবার ডাউনলোড করা হয় এবং তারপর এই ডিভাইসে রাখা হয়, তাই এরপর এটি অফলাইনেও কাজ করে।';
$ec_lang['lpn_engine_ready']='EPANET সমাধানকারী এখন এই ডিভাইসে আছে, এবং অফলাইনে কাজ করে।';
$ec_lang['lpn_engine_fetching_valve']='EPANET সমাধানকারী আনা হচ্ছে, যাতে এই ভালভটি এখনই এবং পরে অফলাইনেও সমাধান করা যায়।';
$ec_lang['lpn_engine_ready_valve']='EPANET সমাধানকারী এখন এই ডিভাইসে আছে। যেসব ভালভ নিজে থেকেই খোলে ও বন্ধ হয়, সেগুলো অফলাইনে কাজ করবে।';
$ec_lang['lpn_engine_unavailable']='EPANET সমাধানকারী আনা যায়নি, যা নিজে থেকে খোলা ও বন্ধ হওয়া ভালভগুলো সমাধান করে। একবার ইন্টারনেটে সংযুক্ত হলে এটি সেই সময় থেকে এই ডিভাইসে রাখা থাকবে।';
$ec_lang['lpn_engine_needed_loading']='আপনি তৈরি করার সময় EPANET সমাধানকারী লোড হচ্ছে। সম্পূর্ণ লোড হলে ফলাফল পাওয়া যাবে।';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='সমাধানকারী লোডিং অগ্রগতি';
$ec_lang['lpn_engine_wait']='সমাধানকারী লোড হচ্ছে। ফলাফল সাময়িকভাবে বিলম্বিত। কাজ চালিয়ে যান।';
$ec_lang['lpn_engine_wait_pct']='সমাধানকারী {percent}% লোড হয়েছে।';
$ec_lang['lpn_engine_wait_bytes']='সমাধানকারী এখন পর্যন্ত {kb} KB লোড হয়েছে। মোট পরিমাণ পাওয়া যাচ্ছে না, তাই সম্পূর্ণতার শতাংশ অজানা।';
$ec_lang['lpn_engine_needed_failed']='EPANET সমাধানকারী এখনও লোড হয়নি, লোড করা যাচ্ছে না, এবং এই নেটওয়ার্ক শুধুমাত্র এটি দিয়েই সমাধান করা যায়। আপনি ইন্টারনেটে সংযুক্ত থাকলে এটি লোড হবে।';
$ec_lang['lpn_diag_valve_needs_epanet']='এই ভালভগুলো নিজে থেকেই খোলে ও বন্ধ হয়, এবং শুধুমাত্র EPANET সমাধানকারীই এগুলো গণনা করতে পারে। EPANET সমাধানকারী লোড করা যায়নি, তাই এই ফলাফলগুলো নেই:';
$ec_lang['lpn_diag_valve_on_fixed_head']='এই ভালভগুলো সরাসরি একটি জলাধার বা ট্যাংকের সাথে যুক্ত, যা ইতিমধ্যে সেখানকার পানির স্তর নির্ধারণ করে ফেলেছে, তাই ভালভের নিয়ন্ত্রণ করার মতো আর কিছু অবশিষ্ট নেই। ভালভ এবং জলাধার বা ট্যাংকের মাঝে একটি ছোট পাইপ বসান:';
$ec_lang['lpn_diag_not_converged']='কোনো সমাধান পাওয়া যায়নি। বাস্তবে অসম্ভব মান, যেমন শূন্য ব্যাস, আছে কিনা পরীক্ষা করুন।';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='সমাধানটি কনভার্জ করেনি। এই সংখ্যাগুলো শেষ পুনরাবৃত্তির (ইটারেশন), কোনো উত্তর নয়। এগুলো ব্যবহার করবেন না।';
$ec_lang['lpn_diag_not_converged_trials']='এটি {iterations} পুনরাবৃত্তির পর থেমে গেছে।';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='এটি {iterations} পুনরাবৃত্তির পর {error} আপেক্ষিক ত্রুটিতে থেমে গেছে, যা {accuracy}-এর নির্ভুলতা সেটিং-এ পৌঁছায়নি।';
$ec_lang['lpn_field_roughness']='রাফনেস';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='হেজেন-উইলিয়ামস C। একটি বড় সংখ্যা মানে একটি মসৃণ পাইপ: নতুন প্লাস্টিকের জন্য প্রায় ১৫০, নতুন স্টিল বা লোহার জন্য ১৩০, এবং পুরনো পাইপের জন্য ১০০।';
$ec_lang['lpn_field_length']='দৈর্ঘ্য';
$ec_lang['lpn_field_from']='থেকে';
$ec_lang['lpn_field_to']='পর্যন্ত';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='ভালভের ধরন';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='ভালভটি কী করে। একটি থ্রটল ভালভ একটি নির্দিষ্ট ক্ষতি বজায় রাখে। অন্য তিনটি একটি চাপ বা প্রবাহ বজায় রাখে, এবং পানির পরিবর্তনের সাথে সাথে পুরোপুরি খোলে, বন্ধ হয়, বা আংশিক বন্ধ হয়। ধরন পরিবর্তন করলে নিচের সেটিংয়ে একটি নতুন শুরুর সংখ্যা বসে, কারণ চাপ প্রবাহ নয় এবং কোনোটিই ক্ষতি সহগ নয়।';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='থ্রটল (TCV)';
$ec_lang['lpn_valve_type_prv']='চাপ হ্রাসকারী (PRV)';
$ec_lang['lpn_valve_type_psv']='চাপ বজায়কারী (PSV)';
$ec_lang['lpn_valve_type_fcv']='প্রবাহ নিয়ন্ত্রণকারী (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='চাপ ভাঙার ভালভ (PBV)';
$ec_lang['lpn_valve_type_gpv']='সাধারণ উদ্দেশ্য (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='চাপ পতন';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='ভালভটি যে চাপ কমিয়ে দেয়। একটি চাপ ভাঙার ভালভ পানি যেদিকেই যাক না কেন, সবসময় ঠিক এই পরিমাণ চাপ সরিয়ে দেয়। এটি ভালভ জুড়ে একটি পতন, ধরে রাখার মতো কোনো চাপ নয়।';
$ec_lang['lpn_inp_drop_gpv_curve']='এই ভালভ এমন একটি জলশীর্ষ ক্ষতির কার্ভের কথা বলে যা ফাইলে নেই। ভালভটি কোনো কার্ভ ছাড়াই এসেছে, তাই আপনি একটি না দেওয়া পর্যন্ত এটি পুরোপুরি খোলা থাকে।';
$ec_lang['lpn_gpv_curve_source']='ভালভ জলশীর্ষ ক্ষতির কার্ভ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='লাইব্রেরি বাক্সে থাকা কার্ভ যা বলে এই ভালভ প্রতিটি প্রবাহে কতটা জলশীর্ষ হারায়। একাধিক ভালভ একই কার্ভ ব্যবহার করতে পারে, এবং সেখানে এটি পরিবর্তন করলে সবগুলোই বদলে যায়। এই ভালভ শুধু রেফারেন্স ধরে রাখে; বিন্দুগুলো নিজে লাইব্রেরি, কার্ভ-এর অধীনে পড়া ও পরিবর্তন করা হয়।';
$ec_lang['lpn_field_valve_setting_pressure']='চাপ সেটিং';
$ec_lang['lpn_field_valve_setting_pressure_tip']='ভালভটি যে চাপ বজায় রাখে। একটি চাপ হ্রাসকারী ভালভ তার ভাটির দিকের চাপ এই মানের সমান বা তার নিচে রাখে। একটি চাপ বজায়কারী ভালভ তার উজানের দিকের চাপ এই মানের সমান বা তার উপরে রাখে।';
$ec_lang['lpn_field_valve_setting_flow']='প্রবাহ সেটিং';
$ec_lang['lpn_field_valve_setting_flow_tip']='ভালভটি সর্বোচ্চ যে পরিমাণ পানি প্রবাহিত হতে দেয়। এর চেয়ে কম পানি প্রবাহিত হতে চাইলে, ভালভটি পুরোপুরি খোলা থাকে এবং কোনো ক্ষতি যোগ করে না।';
$ec_lang['lpn_field_valve_setting']='সেটিং';
$ec_lang['lpn_field_valve_setting_loss']='ক্ষতি সহগ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='থ্রটল ভালভটি কতটা জলশীর্ষ অপসারণ করে, বেগ জলশীর্ষের একটি গুণিতক হিসেবে গণনা করা। পুরোপুরি খোলা ভালভের জন্য ০ ব্যবহার করুন। এই একটি সংখ্যাই একটি থ্রটল ভালভের সম্পূর্ণ ক্ষতি।';
$ec_lang['lpn_field_valve_diameter_tip']='ভালভের মধ্য দিয়ে খোলা অংশের প্রস্থ। এই প্রস্থ থেকে ভালভের মধ্য দিয়ে পানির গতি গণনা করা হয়, এবং সেই গতি থেকে ক্ষতি নির্ণয় করা হয়।';
$ec_lang['lpn_field_valve_km_tip']='ভালভ পুরোপুরি খোলা অবস্থায় ভালভের কাঠামো থেকে হওয়া ক্ষতি, ভালভের সেটিং যা অপসারণ করে তার অতিরিক্ত হিসেবে। এটি বেগ জলশীর্ষের একটি গুণিতক হিসেবে গণনা করা হয়। এটি উপেক্ষা করতে ০ ব্যবহার করুন।';
$ec_lang['lpn_field_km']='স্থানীয় ক্ষতি সহগ, k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='স্থানীয় ক্ষতি, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='পাম্প জলশীর্ষ কার্ভ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='লাইব্রেরি বাক্সে থাকা কার্ভ যা বলে এই পাম্প প্রতিটি প্রবাহে কতটা জলশীর্ষ যোগ করে। একাধিক পাম্প একই কার্ভ ব্যবহার করতে পারে, এবং সেখানে এটি পরিবর্তন করলে সবগুলোই বদলে যায়। এই পাম্প শুধু রেফারেন্স ধরে রাখে; বিন্দুগুলো নিজে লাইব্রেরি, কার্ভ-এর অধীনে পড়া ও পরিবর্তন করা হয়।';
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
$ec_lang['lpn_field_desc']='বিবরণ';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='ট্যাগ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='একটি ট্যাগের যেকোনো অর্থ হতে পারে যা আপনার প্রয়োজন, যেমন একটি চাপ অঞ্চল বা একটি কাজের আদেশ। এখানে বা EPANET-এ কোনো হিসাব এটি পড়ে না। একটি ট্যাগ একটি শব্দ: EPANET প্রথম স্পেসেই পড়া বন্ধ করে দেয়, তাই টাইপ করার সময় একটি স্পেস প্রত্যাখ্যান করা হয়। এটি EPANET ফাইলে এবং তা থেকে বহন করা হয়।';
$ec_lang['lpn_pump_effic_curve']='পাম্প দক্ষতার কার্ভ';
$ec_lang['lpn_pump_effic_curve_tip']='লাইব্রেরি বাক্সে থাকা কার্ভ যা বলে এই পাম্প প্রতিটি প্রবাহে কতটা দক্ষ। একাধিক পাম্প একই কার্ভ ব্যবহার করতে পারে, এবং সেখানে এটি পরিবর্তন করলে সবগুলোই বদলে যায়। এই পাম্প শুধু রেফারেন্স ধরে রাখে; বিন্দুগুলো নিজে লাইব্রেরি, কার্ভ-এর অধীনে পড়া ও পরিবর্তন করা হয়।';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='কোনো কার্ভ বাছাই করা হয়নি';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='কার্ভ';
$ec_lang['lpn_curve_library_link_tip']='লাইব্রেরি বাক্সটি তার কার্ভ বিভাগে খোলে, যেখানে একটি কার্ভ যোগ, বর্ণনা, পরিবর্তন ও মুছে ফেলা যায়। একটি উপাদান জানায় সে কোন কার্ভ ব্যবহার করে।';
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
$ec_lang['lpn_curve_kind_head']='পাম্প জলশীর্ষ';
$ec_lang['lpn_curve_kind_effic']='পাম্প দক্ষতা';
$ec_lang['lpn_curve_kind_volume']='ট্যাংক আয়তন';
$ec_lang['lpn_curve_kind_headloss']='ভালভ জলশীর্ষ ক্ষতি';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='ধরন বলা নেই';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='আয়তন';
$ec_lang['lpn_pump_effic_col']='দক্ষতা';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='এই পাম্পের জন্য কোনো দক্ষতার কার্ভ বাছাই করা হয়নি, তাই এটি পুরো নেটওয়ার্কের জন্য নির্ধারিত দক্ষতা, {percent}-এ চলে।';
$ec_lang['lpn_pump_effic_unstated']='এই পাম্প {name} নামের একটি দক্ষতার কার্ভের কথা বলে, যা এই প্রকল্পে কিছুই নির্ধারণ করে না, তাই এটি পুরো নেটওয়ার্কের জন্য নির্ধারিত দক্ষতা, {percent}-এ চলে।';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='মোড: নির্বাচন। একটি উপাদান বা লেবেল দেখতে বা পরিবর্তন করতে সেটিতে ক্লিক করুন। একটি নোড বা লেবেল সরাতে টেনে আনুন। একটি পাইপের বাঁক যোগ বা মুছতে শীর্ষবিন্দুসমূহ টুল ব্যবহার করুন।';
$ec_lang['lpn_mode_delete']='মোড: মুছুন। একটি উপাদান মুছতে এতে ক্লিক করুন।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='মোড: শীর্ষবিন্দুসমূহ। প্রতিটি পাইপের শীর্ষবিন্দু ছোট বর্গাকার হাতল হিসেবে দেখানো হয়। একটি শীর্ষবিন্দু যোগ করতে পাইপে ক্লিক করুন, মুছতে একটি হাতলে ক্লিক করুন, অথবা সরাতে একটি হাতল টেনে আনুন। এই মোডে মানচিত্রের আর কিছুই পরিবর্তিত হয় না।';
$ec_lang['lpn_mode_zoom_window']='মোড: জুম উইন্ডো। মানচিত্রে একটি বাক্সের দুটি বিপরীত কোণে ক্লিক করুন, অথবা একটি টেনে আনুন, তাতে জুম ইন করতে।';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='কিছুই নির্বাচিত নেই। প্রথমে মানচিত্রে একটি উপাদানে ক্লিক করুন, তারপর Delete চাপুন।';
$ec_lang['lpn_mode_add_junction']='মোড: সংযোগস্থল যোগ করুন। একটি সংযোগস্থল বসাতে মানচিত্রে ক্লিক করুন। উপাদান ও লেবেল পরিবর্তন বা সরাতে নির্বাচন মোডে যান।';
$ec_lang['lpn_mode_add_reservoir']='মোড: জলাধার যোগ করুন। একটি জলাধার বসাতে মানচিত্রে ক্লিক করুন। উপাদান ও লেবেল পরিবর্তন বা সরাতে নির্বাচন মোডে যান।';
$ec_lang['lpn_mode_add_tank']='মোড: ট্যাংক যোগ করুন। একটি ট্যাংক বসাতে মানচিত্রে ক্লিক করুন। উপাদান ও লেবেল পরিবর্তন বা সরাতে নির্বাচন মোডে যান।';
$ec_lang['lpn_mode_add_pipe']='মোড: পাইপ যোগ করুন। দুটি নোড সংযুক্ত করতে একটি নোডে, তারপর আরেকটি নোডে ক্লিক করুন। মাঝখানে খোলা জায়গায় ক্লিক করলে রেখাটি বাঁকানো যায়, অথবা নতুন করে শুরু করতে Escape চাপুন। উপাদান ও লেবেল পরিবর্তন বা সরাতে নির্বাচন মোডে যান।';
$ec_lang['lpn_mode_add_pump']='মোড: পাম্প যোগ করুন। দুটি নোড সংযুক্ত করতে একটি নোডে, তারপর আরেকটি নোডে ক্লিক করুন। মাঝখানে খোলা জায়গায় ক্লিক করলে রেখাটি বাঁকানো যায়, অথবা নতুন করে শুরু করতে Escape চাপুন। উপাদান ও লেবেল পরিবর্তন বা সরাতে নির্বাচন মোডে যান।';
$ec_lang['lpn_mode_add_valve']='মোড: ভালভ যোগ করুন। দুটি নোড সংযুক্ত করতে একটি নোডে, তারপর আরেকটি নোডে ক্লিক করুন। মাঝখানে খোলা জায়গায় ক্লিক করলে রেখাটি বাঁকানো যায়, অথবা নতুন করে শুরু করতে Escape চাপুন। উপাদান ও লেবেল পরিবর্তন বা সরাতে নির্বাচন মোডে যান।';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='মোড: টেক্সট যোগ করুন। একটি টেক্সট বসাতে মানচিত্রে ক্লিক করুন। একটি নোডের কাছে ক্লিক করলে টেক্সটটি সেই নোডের সাথে যুক্ত হয়। উপাদান ও লেবেল পরিবর্তন বা সরাতে নির্বাচন মোডে যান।';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='মানচিত্রে জিনিস পরিবর্তন, সরানো ও টেনে আনতে এই মোড ব্যবহার করুন। এটিই সেই মোড যেখানে পৃষ্ঠাটি ডিফল্টভাবে ফিরে আসে: একটি প্রকল্প খোলার মতো কিছু কাজের পর এটি নিজে থেকেই এখানে ফিরে আসে। Esc দ্বিতীয়বার চাপলে যা নির্বাচিত আছে তা নির্বাচন-মুক্ত হয়ে যায়।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='স্বয়ংক্রিয়';
$ec_lang['lpn_method_switch_confirm']='ঘর্ষণ পদ্ধতি পরিবর্তন করলে আপনার পাইপে ইতিমধ্যে লেখা রুক্ষতার সংখ্যাগুলো পরিবর্তন হয় না, এবং একটি পদ্ধতির জন্য রুক্ষতা অন্যটির জন্য অর্থহীন। এরপর প্রতিটি পাইপ পরীক্ষা করুন। তবুও পরিবর্তন করবেন?';
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
$ec_lang['lpn_field_closed']='বন্ধ';
$ec_lang['lpn_field_closed_tip']='এই পাইপটি বন্ধ করুন যাতে এর মধ্য দিয়ে কোনো পানি প্রবাহিত না হতে পারে। পাইপটি মানচিত্রে থেকে যায় এবং তার সব সংখ্যা ধরে রাখে, এবং আপনি যেকোনো সময় এটি আবার খুলতে পারেন।';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='দ্রাঘিমাংশ';
$ec_lang['lpn_field_lat']='অক্ষাংশ';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='নর্দিং';
$ec_lang['lpn_field_easting']='ইস্টিং';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='N';
$ec_lang['lpn_field_easting_abbr']='E';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='অক্ষা.';
$ec_lang['lpn_field_lon_abbr']='দ্রাঘি.';

// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='এই নোডটি সঠিকভাবে বসাতে একটি স্থানাঙ্ক অবস্থান টাইপ করুন। একটি দৃশ্যকল্পে এই অবস্থানটি শুধু সেই দৃশ্যকল্পেই প্রযোজ্য, ঠিক যেমন এটি টেনে আনলে হয়; ভিত্তিতে এটি নোডটিকে সর্বত্র বসায়।';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='সেটি মানচিত্রের বাইরে। Pseudo Mercator-এ অক্ষাংশের সীমা -85.05 থেকে 85.05 এবং দ্রাঘিমাংশের সীমা -180 থেকে 180।';
$ec_lang['lpn_field_text_size']='আকার গুণক';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='সব জুম স্তরে দেখান';
$ec_lang['lpn_field_text_all_zoom_tip']='আপনি যতই জুম আউট করুন না কেন, এই টেক্সটটি অঙ্কনে রাখুন। এটি আনটিক করলে, দৃশ্য মানচিত্র ও পৃষ্ঠার অধীনে নির্ধারিত লেবেলিং থ্রেশহোল্ডের চেয়ে প্রশস্ত হলে টেক্সটটি অন্য লেবেলগুলোর সাথে লুকিয়ে যায়।';
$ec_lang['lpn_tool_labels']='লেবেল';
$ec_lang['lpn_labels_heading_node']='নোড লেবেল';
$ec_lang['lpn_labels_heading_link']='লিংক লেবেল';
$ec_lang['lpn_labels_mark_extrema']='সর্বোচ্চ ও সর্বনিম্ন মান চিহ্নিত করুন';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='মানচিত্রে প্রতিটি লেবেলযুক্ত বৈশিষ্ট্যের সর্বোচ্চ মানের উপরে একটি রেখা (ওভারলাইন), এবং সর্বনিম্ন মানের নিচে একটি রেখা (আন্ডারলাইন) চিহ্নিত করে।';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='সব কিছুতে প্রয়োগ করুন';
$ec_lang['lpn_settings_apply_to_all_tip']='ইতিমধ্যে আঁকা এই ধরনের প্রতিটি উপাদান এই টেক্সট দিয়ে শুরু হওয়া একটি ID পায়। প্রতিটি তার নিজের সংখ্যা ধরে রাখে। যে ID কোনো সংখ্যায় শেষ হয় না, তা অপরিবর্তিত থাকে।';
$ec_lang['lpn_confirm_apply_prefix']='{n}টি উপাদানের নাম পরিবর্তন করে তাদের ID {prefix} দিয়ে শুরু করবেন? প্রতিটি তার নিজের সংখ্যা ধরে রাখবে।';
$ec_lang['lpn_prefix_applied']='{n}টি উপাদানের নাম পরিবর্তন করা হয়েছে। বাকি {skipped}টি অপরিবর্তিত রাখা হয়েছে।';
$ec_lang['lpn_labels_suffix_gradient_tip']='মানচিত্র লেবেলে জলশীর্ষ ক্ষতির ঢালের পরে যোগ করা টেক্সট। এখানে শতাংশ চিহ্ন লিখবেন না। একক শতাংশ হলে এটি আপনার জন্য যোগ করে দেওয়া হয়।';
$ec_lang['lpn_labels_separator']='মানগুলোর মধ্যে টেক্সট';
$ec_lang['lpn_labels_separator_tip']='একটি লেবেলে একটি বৈশিষ্ট্য থেকে পরেরটির মধ্যে টেক্সট। ডিফল্টে একটি স্পেস।';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='অগ্রাধিকার';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='দুটি নোড লেবেল একে অপরের উপর পড়লে বৈশিষ্ট্যগুলো যে ক্রমে ছেড়ে দেওয়া হয়। ১ নম্বর বৈশিষ্ট্যটি উভয় লেবেলেই প্রথমে ছেড়ে দেওয়া হয়। যখন একটি বৈশিষ্ট্য বাকি থাকে এবং দুটি তখনও একে অপরের উপর পড়ে, তখন পুরো একটি লেবেল লুকিয়ে ফেলা হয়: যে লেবেলের অবশিষ্ট মান দেখানোর মতো সবচেয়ে কম গুরুত্বপূর্ণ, অর্থাৎ সর্বনিম্ন চাহিদা, সীমার মাঝামাঝি চাপ, অথবা প্রতিবেশী নোডের সবচেয়ে কাছের উচ্চতা বা হেড।';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='আগে';
$ec_lang['lpn_labels_col_after']='পরে';
$ec_lang['lpn_labels_col_decimals']='দশমিক';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='দেখান';
$ec_lang['lpn_labels_show_tip']='লেবেলে মানগুলো যে ক্রমে দেখা যায়। ১ নম্বর মানটি প্রথমে আসে: একটি স্তূপীকৃত লেবেলের উপরে, এবং এক লাইনের লেবেলের শুরুতে।';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='একক ব্যবহার করুন';
$ec_lang['lpn_labels_use_units_tip']='পরে বাক্সে ও লেবেলে একক দেখাতে, এবং একক পরিবর্তিত হলে এটিকে সাথে সাথে হালনাগাদ রাখতে টিক দিন। আপনার নিজের পরে টেক্সট টাইপ করতে আনটিক করুন।';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='শুরুর অবস্থা';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='নোডের রঙ';
$ec_lang['lpn_settings_sym_link_colors']='পাইপের রঙ';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='পটভূমি চিত্র…';
$ec_lang['lpn_backdrop_add']='যোগ করুন';
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
$ec_lang['lpn_backdrop_scale']='বেছে স্কেল করুন';
$ec_lang['lpn_backdrop_scale_entry']='ওয়ার্ল্ড ফাইল বা মানচিত্রে এক পিক্সেলের আকার দিয়ে স্কেল করুন';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='বর্তমান আকার থেকে স্কেল করুন, আপনার বাছাই করা একটি বিন্দুকে কেন্দ্র করে';
$ec_lang['lpn_backdrop_scale_from_prompt1']='পটভূমি চিত্রের যে বিন্দুটি তার জায়গায় থেকে যাবে, সেখানে ক্লিক করুন।';
$ec_lang['lpn_backdrop_scale_from_prompt2']='এর বর্তমান আকার থেকে স্কেল করুন। 1 এটিকে অপরিবর্তিত রাখে, 1.1 এটিকে ১০% বড় করে, 0.9 এটিকে ১০% ছোট করে।';
$ec_lang['lpn_backdrop_scale_entry_prompt']='মানচিত্রে এক পিক্সেলের আকার লিখুন, অথবা চিত্রের ওয়ার্ল্ড ফাইলের সম্পূর্ণ বিষয়বস্তু পেস্ট করুন';
$ec_lang['lpn_backdrop_scale_entry_bad']='মানচিত্রে এক পিক্সেলের আকারের জন্য একটি সংখ্যা লিখুন, অথবা ওয়ার্ল্ড ফাইলের সবকটি (ছয়টি) লাইন পেস্ট করুন।';
$ec_lang['lpn_backdrop_wld_bad']='এই ওয়ার্ল্ড ফাইলটি চিত্রকে ঘোরায়, উল্টে দেয় বা অসমভাবে টেনে বড় করে। মানচিত্র শুধু একটি চিত্র সরাতে এবং উভয় দিকে সমান পরিমাণে আকার পরিবর্তন করতে পারে, তাই ফাইলটি ব্যবহার করা হয়নি।';
$ec_lang['lpn_backdrop_unreadable']='আপনার ব্রাউজার এই ছবিটি দেখাতে পারে না। ছবিটি PNG বা JPEG হিসেবে সংরক্ষণ করে আবার যোগ করুন।';
$ec_lang['lpn_backdrop_position']='সরান';
$ec_lang['lpn_backdrop_remove']='সরিয়ে ফেলুন';
$ec_lang['lpn_backdrop_remove_confirm']='পটভূমি চিত্রটি সরিয়ে ফেলবেন?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='বিশ্ব মানচিত্র…';
$ec_lang['lpn_map_attach_tip']='এই প্রকল্পের সাথে বিশ্ব মানচিত্র সংযুক্ত করুন, অন্য কোনোভাবে এটি পরিবর্তন না করে।';
$ec_lang['lpn_map_attach_add']='সংযুক্ত করুন';
$ec_lang['lpn_map_attach_readjust']='পুনরায় সমন্বয় করুন';
$ec_lang['lpn_map_attach_readjust_tip']='মানচিত্র সংযুক্তি প্রক্রিয়ার ধাপ ২-এ ফিরে যান।';
$ec_lang['lpn_map_attach_scale_from']='বর্তমান আকার থেকে স্কেল করুন…';
$ec_lang['lpn_map_attach_scale_from_prompt']='আপনার অঙ্কনের মাঝামাঝি কেন্দ্র করে, মানচিত্রটিকে তার বর্তমান আকার থেকে স্কেল করুন। 1 এটিকে একই রাখে, 1.1 এটিকে ১০% বড় করে, 0.9 এটিকে ১০% ছোট করে।';
$ec_lang['lpn_map_attach_scale_from_bad']='শূন্যের চেয়ে বড় একটি একক সংখ্যা টাইপ করুন।';
$ec_lang['lpn_map_attach_scale_from_done']='মানচিত্রটির আকার পরিবর্তন করা হয়েছে, এবং আপনার অঙ্কন ও তার প্রতিটি স্থানাঙ্ক ঠিক যেমন ছিল তেমনই আছে।';
$ec_lang['lpn_map_attach_none']='এই প্রকল্পের সাথে এখনও কোনো বিশ্ব মানচিত্র সংযুক্ত নেই। প্রথমে মানচিত্র, বিশ্ব মানচিত্র, সংযুক্ত করুন ব্যবহার করুন।';
$ec_lang['lpn_map_attach_remove']='বিচ্ছিন্ন করুন';
$ec_lang['lpn_map_attach_remove_tip']='বিশ্ব মানচিত্রটি সরিয়ে ফেলুন। যেভাবেই হোক অঙ্কন ও তার স্থানাঙ্কগুলো অস্পৃষ্ট থাকে।';
$ec_lang['lpn_map_attach_done']='বিশ্ব মানচিত্রটি এখন আপনার অঙ্কনের পেছনে আছে, এবং আপনার প্রকল্প অপরিবর্তিত আছে। এটি আবার সরাতে মানচিত্র, বিশ্ব মানচিত্র, বিচ্ছিন্ন করুন ব্যবহার করুন।';
$ec_lang['lpn_map_attach_removed']='বিশ্ব মানচিত্রটি চলে গেছে, এবং অঙ্কনটি ঠিক যেমন ছিল তেমনই আছে।';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='আপনার অঙ্কনটি সমগ্র বিশ্বের একটি মানচিত্রে, শূন্য অক্ষাংশ ও শূন্য দ্রাঘিমাংশে সমুদ্রে আছে। প্রথমে আপনার নিজের স্থানটি খুঁজুন: অঙ্কনের পেছনের মানচিত্রটি প্যান ও জুম করুন, একটি স্থানের নাম অনুসন্ধান করুন, অথবা একটি অক্ষাংশ ও দ্রাঘিমাংশ টাইপ করুন। অঙ্কনটি নিজে সরে না।';
$ec_lang['lpn_mapgeo_step1']='ধাপ ১ এর ২: বিশ্বে আপনার স্থানটি খুঁজুন';
$ec_lang['lpn_mapgeo_step2']='ধাপ ২ এর ২: আপনার অঙ্কনের পেছনে মানচিত্রটি মানানসই করুন';
$ec_lang['lpn_mapgeo_hint1']='আপনার অঙ্কনের পেছনের মানচিত্রটি প্যান ও জুম করুন, অথবা একটি স্থান অনুসন্ধান করুন, অথবা একটি অক্ষাংশ ও দ্রাঘিমাংশ টাইপ করুন। তারপর আনুমানিক বসান চাপুন।';
$ec_lang['lpn_mapgeo_readjust_intro']='আপনার অঙ্কনটি আপনি সর্বশেষ যেখানে বসিয়েছিলেন সেখানেই আছে। এটিকে অন্য কোথাও সরাতে, অঙ্কনের পেছনের মানচিত্রটি প্যান ও জুম করুন, একটি স্থানের নাম অনুসন্ধান করুন, অথবা একটি অক্ষাংশ ও দ্রাঘিমাংশ টাইপ করুন। অঙ্কনটি নিজে সরে না।';
$ec_lang['lpn_mapgeo_hint2']='আপনার অঙ্কনের নিচে মানচিত্রটি সরাতে যেকোনো জায়গায় টেনে আনুন। আপনার অঙ্কন ও তার প্রতিটি স্থানাঙ্ক ঠিক যেখানে আছে সেখানেই থাকে। মানচিত্রটি ঠিক হলে এখানে জিওরেফারেন্স করুন চাপুন।';
$ec_lang['lpn_mapgeo_gestures']='জুম আপনার অঙ্কন ও মানচিত্রকে একসাথে সরায়, যাতে আপনি দেখতে পারেন তারা কতটা ভালোভাবে মিলছে। টেনে আনা শুধু মানচিত্রকেই সরায়।';
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
$ec_lang['lpn_mapgeo_dial_turn']='মানচিত্রটি ঘোরান';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} ডিগ্রি';
$ec_lang['lpn_mapgeo_dial_size']='মানচিত্রের আকার';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} গুণ';
$ec_lang['lpn_mapgeo_dial_help']='মানচিত্রটিকে বড়, ছোট বা ঘোরাতে দুটি বার টেনে সরান, অথবা এগুলোর উপরের বাক্সে টাইপ করুন। প্রতিটি বারের মাঝামাঝি হলো ধাপ ১ যা ফিট রেখে যায়, তাই 1 ও 0 মানে এটি যেমন আছে তেমন রাখা। তীর কী উভয়টিতে কাজ করে।';
$ec_lang['lpn_mapgeo_place']='আনুমানিক বসান';
$ec_lang['lpn_mapgeo_finish']='এখানে জিওরেফারেন্স করুন';
$ec_lang['lpn_mapgeo_cancelled']='বিশ্ব মানচিত্রটি যেখানে ছিল সেখানেই ফিরে গেছে, এবং আপনার অঙ্কনটি কখনো সরেনি।';
$ec_lang['lpn_mapgeo_locked']='প্রকল্প পরিবর্তন করা বা সংরক্ষণ করার আগে এখানে জিওরেফারেন্স করুন বোতাম দিয়ে শেষ করুন, অথবা বাতিল করুন চাপুন। বিশ্ব মানচিত্রটি এখনও বসানো হচ্ছে।';
$ec_lang['lpn_backdrop_scale_prompt1']='পটভূমি চিত্রে দুটি বিন্দুতে ক্লিক করুন, যেমন একটি বার স্কেলের দুই প্রান্ত। তারপর তাদের মধ্যের প্রকৃত দূরত্ব লিখুন।';
$ec_lang['lpn_backdrop_scale_prompt2']='দুই বিন্দুর মধ্যে প্রকৃত দূরত্ব';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='সরানোর জন্য ছবির উপর ভিত্তি বিন্দুতে ক্লিক করুন।';
$ec_lang['lpn_backdrop_position_prompt2']='গন্তব্য বিন্দুর পদ্ধতি বেছে নিন, তারপর চালিয়ে যান ক্লিক করুন।';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='পটভূমি চিত্র সমন্বয় করা হচ্ছে।';
$ec_lang['lpn_backdrop_target_label']='সেই বিন্দুটি এখানে সরান:';
$ec_lang['lpn_backdrop_target_node']='একটি নোড';
$ec_lang['lpn_backdrop_target_free']='মানচিত্রের যেকোনো বিন্দু';
$ec_lang['lpn_backdrop_target_coords']='আপনার লেখা স্থানাঙ্ক';
$ec_lang['lpn_backdrop_coords_prompt']='সেই বিন্দুটি যেখানে যাবে সেই X,Y লিখুন';
$ec_lang['lpn_backdrop_continue']='চালিয়ে যান';
$ec_lang['lpn_tool_settings']='সেটিংস';
$ec_lang['lpn_settings_show_titles']='পৃষ্ঠার শিরোনাম দেখান';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='এই শিরোনামগুলো লুকান';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='নির্বাচন সহায়তা দেখান';
$ec_lang['lpn_settings_area_hint_tip']='একটি এলাকা নির্বাচন করার সময় আপনার পরবর্তী ক্লিক কী করবে তা বলে এমন বুদবুদ মানচিত্রের উপর দেখায়।';
$ec_lang['lpn_settings_id_prefixes']='ID উপসর্গ';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='শুরুর মান';
$ec_lang['lpn_settings_defaults_note']='এখন থেকে আপনার তৈরি উপাদানগুলোর জন্য ব্যবহৃত হয়। বিদ্যমান উপাদান পরিবর্তিত হয় না।';
$ec_lang['lpn_settings_push_note']='শুধুমাত্র যেসব বৈশিষ্ট্যের লেবেল এখন দেখানো হচ্ছে সেগুলোই প্রয়োগ করা হয়।';
$ec_lang['lpn_settings_push_btn']='নতুন-উপাদান মানগুলো প্রতিটি বিদ্যমান উপাদানে প্রয়োগ করুন';
$ec_lang['lpn_push_confirm']='বর্তমানে নতুন উপাদানের জন্য নির্ধারিত মান দিয়ে প্রতিটি বিদ্যমান উপাদানের এই বৈশিষ্ট্যগুলো প্রতিস্থাপন করবেন? আপনার লেখা মানগুলো ওভাররাইট হয়ে যাবে। আপনি এটি পূর্বাবস্থায় ফেরাতে পারবেন।';
$ec_lang['lpn_push_properties']='বৈশিষ্ট্য:';
$ec_lang['lpn_push_assets']='নোড ও পাইপ:';
$ec_lang['lpn_push_none_displayed']='এখন কোনো শুরুর মান লেবেল হিসেবে দেখানো হচ্ছে না, তাই প্রয়োগ করার কিছু নেই। লেবেল প্যানেলে আপনার চাওয়া বৈশিষ্ট্যগুলোর লেবেল চালু করুন, তারপর আবার চেষ্টা করুন।';
$ec_lang['lpn_push_nothing']='কোনো বিদ্যমান উপাদানের প্রয়োগ করা বৈশিষ্ট্যগুলোর কোনোটিই নেই।';
$ec_lang['lpn_push_no_change']='প্রতিটি উপাদানের ইতিমধ্যে এই মানগুলো আছে, তাই কিছুই পরিবর্তিত হবে না।';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='কাস্টম বৈশিষ্ট্য';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='আপনার নিজের উদ্দেশ্যে আপনি নিজেই যেসব বৈশিষ্ট্য সংজ্ঞায়িত করেন। এগুলো অন্যান্য সব বৈশিষ্ট্যের মতোই প্রকল্প ও দৃশ্যকল্পের সাথে সংরক্ষিত হয়।';
$ec_lang['lpn_cp_design']='ডিজাইন';
$ec_lang['lpn_cp_design_tip']='প্রতিটি কাস্টম বৈশিষ্ট্যের জন্য একটি সারি, এবং প্রতিটি খুললে দেখায়: Key, Label, Applies to, Validate as, Allow or restrict, সেই নির্বাচন দ্বারা নামকরণ করা অক্ষর ক্ষেত্র, Length lower limit, Length upper limit, Low limit, High limit।';
$ec_lang['lpn_cp_add']='কাস্টম বৈশিষ্ট্য যোগ করুন';
$ec_lang['lpn_cp_add_tip']='ডিজাইন সারণিতে একটি সারি যোগ করে এবং সম্পাদনার জন্য এটি খোলে।';
$ec_lang['lpn_cp_remove_tip']='ডিজাইন সারণি থেকে এই বৈশিষ্ট্যটি সরিয়ে দেয়। আপনার উপাদানগুলোতে ইতিমধ্যে টাইপ করা মানগুলো ফাইলে রাখা থাকে এবং আপনি যদি আবার একই Key ডিজাইন করেন তাহলে সেগুলো ফিরে আসে।';
$ec_lang['lpn_cp_none']='এখনও কোনো কাস্টম বৈশিষ্ট্য ডিজাইন করা হয়নি।';
$ec_lang['lpn_cp_unnamed']='এখনও নামকরণ করা হয়নি';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Key';
$ec_lang['lpn_cp_key_tip']='Key: একটি বৈশিষ্ট্য এই নামে সংরক্ষিত হয়। স্পেস অনুমোদিত নয়, এবং আপনার জন্য একটি প্রিফিক্স যোগ করা হয় যাতে আপনার Key কখনো কোনো বিল্ট-ইন ক্ষেত্রের সাথে সংঘর্ষ না করে।';
$ec_lang['lpn_cp_label']='লেবেল';
$ec_lang['lpn_cp_label_tip']='Label: একজন পাঠক এটি বৈশিষ্ট্যের বাক্সে, Find-এ এবং একটি সারণি কলামের শিরোনামে দেখেন।';
$ec_lang['lpn_cp_applies']='প্রযোজ্য';
$ec_lang['lpn_cp_applies_tip']='Applies to: এই বৈশিষ্ট্য ব্যবহার করে এমন উপাদানের ID প্রিফিক্সের কমা দিয়ে পৃথক করা তালিকা, যেমন J,L,R।';
$ec_lang['lpn_cp_validate']='যাচাইয়ের ধরন';
$ec_lang['lpn_cp_validate_tip']='Validate as: এটি বলে একটি ভালো মান দেখতে কেমন হয়। কেসের নিয়মগুলো কেবল ইংরেজি বর্ণমালা পড়ে, যা একটি বলা সীমাবদ্ধতা। যেকোনো কিছু গ্রহণ করতে Do not validate নির্বাচন করুন।';
$ec_lang['lpn_cp_restrict']='এই অক্ষরগুলো সীমাবদ্ধ করুন';
$ec_lang['lpn_cp_restrict_tip']='Restrict these characters: একটি মান কেবল এখানে তালিকাভুক্ত অক্ষরগুলো ব্যবহার করতে পারে, বা তাদের কোনোটিই নয়, যেখানে "@" মানে যেকোনো অক্ষর; "#" মানে যেকোনো সংখ্যাসূচক অঙ্ক, এবং "-", "." এবং "," অনুমোদিত হলে সেগুলো আপনাকে আলাদাভাবে তালিকাভুক্ত করতে হবে; এবং যেকোনো হোয়াইট স্পেস অক্ষর অবশ্যই অন্য অক্ষরগুলোর মাঝখানে থাকতে হবে।';
$ec_lang['lpn_cp_restrict_mode']='অনুমতি দিন অথবা সীমাবদ্ধ করুন';
$ec_lang['lpn_cp_restrict_mode_tip']='Allow or restrict: দেওয়া অক্ষরগুলো হয় একটি মান ব্যবহার করতে পারে এমন একমাত্র অক্ষর, অথবা এটি ব্যবহার করতে পারে না এমন অক্ষর।';
$ec_lang['lpn_cp_restrict_allow']='কেবল এই অক্ষরগুলোর অনুমতি দিন';
$ec_lang['lpn_cp_minlength']='দৈর্ঘ্যের নিম্ন সীমা';
$ec_lang['lpn_cp_minlength_tip']='Length lower limit: এর চেয়ে ছোট যেকোনো এন্ট্রি চিহ্নিত করা হয়, যা দিয়ে আপনি খালি ও অর্ধেক-টাইপ করা এন্ট্রিগুলো খুঁজে পান।';
$ec_lang['lpn_cp_length']='দৈর্ঘ্যের ঊর্ধ্ব সীমা';
$ec_lang['lpn_cp_length_tip']='Length upper limit: এর চেয়ে লম্বা যেকোনো এন্ট্রি চিহ্নিত করা হয়।';
$ec_lang['lpn_cp_low']='নিম্ন সীমা';
$ec_lang['lpn_cp_low_tip']='Low limit: এটি আপনার প্রত্যাশিত সবচেয়ে ছোট মান। সংখ্যাগুলো সংখ্যা হিসেবে এবং লেখা অভিধানের ক্রমে তুলনা করা হয়।';
$ec_lang['lpn_cp_high']='ঊর্ধ্ব সীমা';
$ec_lang['lpn_cp_high_tip']='High limit: এটি আপনার প্রত্যাশিত সবচেয়ে বড় মান। সংখ্যাগুলো সংখ্যা হিসেবে এবং লেখা অভিধানের ক্রমে তুলনা করা হয়।';
$ec_lang['lpn_cp_val_none']='যাচাই করবেন না';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='সংখ্যা .';
$ec_lang['lpn_cp_val_number_comma']='সংখ্যা ,';
$ec_lang['lpn_cp_val_integer']='পূর্ণ সংখ্যা';
$ec_lang['lpn_cp_val_upper']='সব বড় হাতের অক্ষর';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} মানটি ঠিক যেমন আপনি টাইপ করেছেন তেমনই রাখা হয়।';
$ec_lang['lpn_cp_bad_number']='এই মানটি এই বৈশিষ্ট্যের জন্য প্রয়োজনীয় একটি সংখ্যা নয়।';
$ec_lang['lpn_cp_bad_integer']='এই মানটি এই বৈশিষ্ট্যের জন্য প্রয়োজনীয় একটি পূর্ণ সংখ্যা নয়।';
$ec_lang['lpn_cp_bad_case']='এই মানটি এই বৈশিষ্ট্যের জন্য প্রয়োজনীয় সব বড় হাতের অক্ষরে নেই।';
$ec_lang['lpn_cp_bad_chars']='এই মানটি এমন একটি অক্ষর ব্যবহার করে যা এই বৈশিষ্ট্য অনুমোদন করে না।';
$ec_lang['lpn_cp_bad_space']='হোয়াইট স্পেস কেবল অন্য অক্ষরগুলোর মাঝখানেই অনুমোদিত।';
$ec_lang['lpn_cp_bad_minlength']='এই মানটি এই বৈশিষ্ট্য অনুমোদন করে তার চেয়ে ছোট।';
$ec_lang['lpn_cp_bad_length']='এই মানটি এই বৈশিষ্ট্য অনুমোদন করে তার চেয়ে লম্বা।';
$ec_lang['lpn_cp_bad_low']='এই মানটি এই বৈশিষ্ট্যের নিম্ন সীমার চেয়ে কম।';
$ec_lang['lpn_cp_bad_high']='এই মানটি এই বৈশিষ্ট্যের ঊর্ধ্ব সীমার চেয়ে বেশি।';
$ec_lang['lpn_cp_key_needed']='এই কাস্টম বৈশিষ্ট্যকে স্পেস ছাড়া একটি Key দিন।';
$ec_lang['lpn_cp_key_taken']='অন্য একটি কাস্টম বৈশিষ্ট্য ইতিমধ্যে সেই Key ব্যবহার করছে।';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='দৃশ্যকল্প';
$ec_lang['lpn_scenario_base']='ভিত্তি';
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
$ec_lang['lpn_scenario_overrides']='নিজস্ব মানের সংখ্যা';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='হলুদ বলয়টির অর্থ, এই উপাদানের একটি মান শুধুমাত্র {name} দৃশ্যকল্পের নিজস্ব।';
$ec_lang['lpn_scenario_overrides_tip']='সেই প্রতিটি মান মানচিত্রে একটি হলুদ বলয় দিয়ে চিহ্নিত করা আছে। সেগুলো ছাড়া অঙ্কনটি দেখতে {base}-এ পরিবর্তন করুন।';
$ec_lang['lpn_scenario_menu']='দৃশ্যকল্প';
$ec_lang['lpn_scenario_tip']='অঙ্কনটি এখন যে মানগুলো দেখাচ্ছে এবং পাতাটি যে মানগুলো সমাধান করছে, তার সেট। দৃশ্যকল্প পরিবর্তন করতে, অথবা একটি যোগ, নাম পরিবর্তন, বা মুছে ফেলতে ক্লিক করুন।';
$ec_lang['lpn_scenario_new']='নতুন দৃশ্যকল্প…';
$ec_lang['lpn_scenario_new_name']='দৃশ্যকল্প {n}';
$ec_lang['lpn_scenario_prompt_name']='এই দৃশ্যকল্পের নাম';
$ec_lang['lpn_scenario_rename']='দৃশ্যকল্পের নাম পরিবর্তন করুন…';
$ec_lang['lpn_scenario_delete']='দৃশ্যকল্প মুছুন';
$ec_lang['lpn_scenario_delete_confirm']='{name} দৃশ্যকল্পটি, এবং শুধুমাত্র এটির নিজস্ব {n}টি মান মুছে ফেলবেন? অঙ্কনটি নিজে অপরিবর্তিত থাকবে।';
$ec_lang['lpn_scenario_override']='শুধু এই দৃশ্যকল্পে';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='টিক দেওয়া থাকলে বোঝায় এই দৃশ্যকল্পে এই মানের জন্য একটি এন্ট্রি আছে, এমনকি তা ভিত্তির সংখ্যার মতোই হলেও। আবার ভিত্তির মান ব্যবহার করতে বাক্সটি খালি করুন।';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='ভিত্তি দৃশ্যকল্প: {value}';
$ec_lang['lpn_scenario_deactivated']='{scenario}-এ {id} নেটওয়ার্কের বাইরে। এটি এখনও অঙ্কনে, এবং আপনার অন্যান্য দৃশ্যকল্পে আছে।';
$ec_lang['lpn_scenario_push_btn']='সব দৃশ্যকল্পে ভিত্তির মান প্রয়োগ করুন';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='যেসব বৈশিষ্ট্যের লেবেল এখন দেখানো হচ্ছে, সেগুলোর জন্য প্রতিটি দৃশ্যকল্প ভিত্তির মানে ফিরে যায়। যেকোনো দৃশ্যকল্পে এগুলোর জন্য প্রবেশ করানো মানগুলো বাতিল করা হয়।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='প্রতিটি দৃশ্যকল্পকে এই বৈশিষ্ট্যগুলোর জন্য ভিত্তির মান ব্যবহার করাবেন? যেকোনো দৃশ্যকল্পে এগুলোর জন্য প্রবেশ করানো মানগুলো বাতিল করা হবে। আপনি এটি পূর্বাবস্থায় ফেরাতে পারবেন।';
$ec_lang['lpn_scenario_push_scenarios']='প্রভাবিত দৃশ্যকল্প:';
$ec_lang['lpn_scenario_push_values']='ফেলে দেওয়া মান:';
$ec_lang['lpn_scenario_push_none']='এই বৈশিষ্ট্যগুলোর কোনোটির জন্য কোনো দৃশ্যকল্পের নিজস্ব মান নেই, তাই কিছুই পরিবর্তিত হবে না। কিছুই ফেলে দেওয়া হবে না।';
$ec_lang['lpn_scenario_preset_flow_static']='1. প্রবাহ পরীক্ষা: স্থির';
$ec_lang['lpn_scenario_preset_flow_static_tip']='শূন্য প্রবাহে একটি ডিজাইন নেটওয়ার্কের জন্য প্রবাহ পরীক্ষার ক্যালিব্রেশন। এই দৃশ্যকল্পে সব সংযোগস্থলের চাহিদা ০ সেট করুন।';
$ec_lang['lpn_scenario_preset_flow_mid']='2. প্রবাহ পরীক্ষা: মধ্য';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='প্রথম প্রতিবেদিত প্রবাহে একটি ডিজাইন নেটওয়ার্কের জন্য প্রবাহ পরীক্ষার ক্যালিব্রেশন। এই দৃশ্যকল্পে প্রবাহিত সংযোগস্থলের চাহিদা পরিমাপ করা প্রথম প্রবাহে এবং অন্য সব সংযোগস্থলের চাহিদা ০ সেট করুন।';
$ec_lang['lpn_scenario_preset_flow_max']='3. প্রবাহ পরীক্ষা: সর্বোচ্চ';
$ec_lang['lpn_scenario_preset_flow_max_tip']='প্রতিবেদিত সর্বোচ্চ প্রবাহে একটি ডিজাইন নেটওয়ার্কের জন্য প্রবাহ পরীক্ষার ক্যালিব্রেশন। এই দৃশ্যকল্পে প্রবাহিত সংযোগস্থলের চাহিদা পরিমাপ করা সর্বোচ্চ প্রবাহে এবং অন্য সব সংযোগস্থলের চাহিদা ০ সেট করুন।';
$ec_lang['lpn_scenario_preset_average_day']='4. গড় দিন';
$ec_lang['lpn_scenario_preset_average_day_tip']='চাহিদা গুণক ১: প্রতিটি চাহিদা যেমন লেখা হয়েছে তেমনই, যা গড় দিনের চাহিদা বলে ধরা হয়।';
$ec_lang['lpn_scenario_preset_max_day']='5. সর্বোচ্চ দিন';
$ec_lang['lpn_scenario_preset_max_day_tip']='চাহিদা গুণক গড় দিনের ২.০ গুণ, একটি অস্থায়ী মান। বেশিরভাগ সিস্টেম ১.২ থেকে ৩.০-এর মধ্যে পড়ে (National Research Council, 2006)। আপনার নিজের সিস্টেমের মান সেটিংস, হিসাব, হাইড্রোলিক্স, চাহিদা গুণক-এ সেট করুন।';
$ec_lang['lpn_scenario_preset_peak_hour']='6. পিক ঘণ্টা';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='চাহিদা গুণক গড় দিনের ৩.০ গুণ, একটি অস্থায়ী মান। বেশিরভাগ সিস্টেম ৩.০ থেকে ৬.০-এর মধ্যে পড়ে (National Research Council, 2006)। আপনার নিজের সিস্টেমের মান সেটিংস, হিসাব, হাইড্রোলিক্স, চাহিদা গুণক-এ সেট করুন।';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. অগ্নিনির্বাপণসহ সর্বোচ্চ দিন';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='সর্বোচ্চ দিনের চাহিদা (গুণক ২.০)। এই দৃশ্যকল্পে অগ্নিনির্বাপণ প্রবাহ বিশ্লেষণ রান করুন: এটি এই চাহিদার উপরে প্রতিটি সংযোগস্থলে অগ্নিনির্বাপণ প্রবাহ যোগ করে।';
$ec_lang['lpn_delete_drops_overrides']='এই উপাদানটি মুছে ফেললে আপনার দৃশ্যকল্পগুলোতে এর জন্য থাকা {n}টি মানও ফেলে দেওয়া হবে। চালিয়ে যাবেন?';
$ec_lang['lpn_push_base_only']='এই কাজটি অঙ্কনটিকেই পরিবর্তন করে, তাই এটি শুধুমাত্র {base}-এ করা যায়। {base}-এ যান এবং আবার চেষ্টা করুন।';
$ec_lang['lpn_field_active']='এই নেটওয়ার্কের অংশ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='উপাদানটিকে অঙ্কনে রেখে নেটওয়ার্কের বাইরে রাখতে এই বাক্সটি আনচেক করুন: এটি ধূসর রঙে আঁকা হয় এবং সমাধানকারী এটি উপেক্ষা করে। একটি দৃশ্যকল্পে এভাবেই একটি পাইপ চালু ও বন্ধ করা হয়।';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='এমিটার সূচক';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='স্প্রিংকলার ও লিকের জন্য EPANET-এর এমিটার সমীকরণের সূচক: প্রবাহ = সহগ x চাপ এই সূচকে উন্নীত। এটি শুধুমাত্র সেসব নোডের উত্তর পরিবর্তন করে যেখানে একটি এমিটার আছে, যা আপাতত মানে একটি EPANET ফাইল থেকে পড়া নেটওয়ার্ক।';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='DEM পড়ুন';
$ec_lang['lpn_elev_dem_sample_tip']='এই নোডে DEM-এর উচ্চতা পড়ে নিচে দেখায়। উচ্চতা বাক্সে কিছুই পরিবর্তিত হয় না। DEM-এর অনুভূমিক বিভেদন (রেজল্যুশন) পৃথিবীর বেশিরভাগ জায়গায় প্রায় ৩০ মিটার, এবং ভালো তথ্য থাকা জায়গায় আরও সূক্ষ্ম।';
$ec_lang['lpn_elev_dem_use']='DEM ব্যবহার করুন';
$ec_lang['lpn_elev_dem_use_tip']='এই নোডে DEM-এর উচ্চতা উপরের উচ্চতা বাক্সে বসায়, যা সেখানে আছে তা প্রতিস্থাপন করে। এখনো DEM পড়া না হয়ে থাকলে প্রথমে এটি পড়ে নেয়। একবার পূর্বাবস্থায় ফেরান দিলে তা ফিরে আসে।';
$ec_lang['lpn_elev_dem_none']='এই নোডের জন্য DEM-এ কোনো উচ্চতা নেই।';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM বলছে {v} {u}।';
$ec_lang['lpn_settings_elev_source']='উচ্চতার উৎস';
$ec_lang['lpn_settings_elev_source_tip']='একটি নতুন নোড তার উচ্চতা কোথা থেকে পায়। ভূপৃষ্ঠ Mapbox DEM থেকে পড়া হয়, যা পৃথিবীর বেশিরভাগ জায়গায় প্রায় ৩০ মিটার বিস্তৃত, এবং ভালো তথ্য থাকা জায়গায় আরও সূক্ষ্ম।';
$ec_lang['lpn_settings_elev_source_typed']='উপরে লেখা উচ্চতা';
$ec_lang['lpn_settings_elev_source_dem']='Mapbox DEM ডেটা';
$ec_lang['lpn_settings_accuracy']='নির্ভুলতা';
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
$ec_lang['lpn_settings_default_is']='ডিফল্ট হলো {n}।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='থামার আগে সমাধানকারীকে কতটা কাছাকাছি পৌঁছাতে হবে, যা এক ট্রায়াল থেকে পরের ট্রায়ালে প্রবাহ কতটা পরিবর্তিত হচ্ছে তা দিয়ে মাপা হয়। ছোট সংখ্যা বেশি নির্ভুল কিন্তু বেশি সময় নেয়। উভয় সমাধানকারীই এই একটি বাক্স পড়ে, এবং প্রতিটি সেই পরিবর্তনকে ভিন্ন একটি মোট মানের বিপরীতে মাপে: বিল্ট-ইন সমাধানকারী চাহিদাগুলোর যোগফলের বিপরীতে, EPANET লিংক প্রবাহগুলোর যোগফলের বিপরীতে। খালি রাখলে, এই পৃষ্ঠা EPANET-এর নিজস্ব ডিফল্টের চেয়ে কঠোর একটি নির্ভুলতা ব্যবহার করে।';
$ec_lang['lpn_settings_specific_gravity']='আপেক্ষিক ঘনত্ব';
$ec_lang['lpn_settings_viscosity']='আপেক্ষিক সান্দ্রতা';
$ec_lang['lpn_settings_viscosity_tip']='২০ ডিগ্রি সেলসিয়াসে পানির তুলনায় তরলের সান্দ্রতা। এটি শুধুমাত্র Darcy-Weisbach পদ্ধতিতে উত্তর পরিবর্তন করে।';
$ec_lang['lpn_settings_trials']='সর্বোচ্চ ট্রায়াল';
$ec_lang['lpn_settings_trials_tip']='কনভার্জ না হওয়া একটি নেটওয়ার্কে হাল ছাড়ার আগে সমাধানকারীকে কতগুলো ট্রায়ালের অনুমতি দেওয়া হয়।';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='কনভার্জ না হলে';
$ec_lang['lpn_settings_unbalanced_tip']='যে নেটওয়ার্ক তার ট্রায়াল শেষ করেও এখনো কনভার্জ করেনি তার সাথে কী করা হবে। অতিরিক্ত ট্রায়ালের অনুমতি দিলে প্রায়ই কনভার্জেন্সে পৌঁছানো যায়। থামালে শেষ ট্রায়ালটি যেমন আছে তেমনই প্রতিবেদন করে, যা কোনো সমাধান নয়। শুধুমাত্র EPANET সমাধানকারী এই বাক্সটি পড়ে। বিল্ট-ইন সমাধানকারী সবসময় থামে এবং উত্তরটিকে কনভার্জ হয়নি বলে চিহ্নিত করে।';
$ec_lang['lpn_settings_unbalanced_continue']='অতিরিক্ত ট্রায়ালের অনুমতি দিন';
$ec_lang['lpn_settings_unbalanced_stop']='থামুন এবং শেষ ট্রায়াল প্রতিবেদন করুন';
$ec_lang['lpn_settings_unbalanced_trials']='প্রতিবেদনের আগে অতিরিক্ত ট্রায়াল';
$ec_lang['lpn_settings_unbalanced_trials_tip']='উপরের সর্বোচ্চ সংখ্যা শেষ হওয়ার পর, শেষ ট্রায়াল প্রতিবেদন করার আগে আর কতগুলো ট্রায়ালের অনুমতি দেওয়া হবে। শুধুমাত্র EPANET সমাধানকারী এই বাক্সটি পড়ে।';
$ec_lang['lpn_settings_head_error']='হেড ত্রুটির সীমা';
$ec_lang['lpn_settings_head_error_tip']='থামার আগে সমাধানকারীকে যে অতিরিক্ত পরীক্ষা পাস করতে হবে: যেকোনো একটি পাইপে অবশিষ্ট সবচেয়ে বড় হেড ত্রুটি। শূন্যের অর্থ এই পরীক্ষাটি প্রয়োগ করবেন না। শুধুমাত্র EPANET সমাধানকারী এই বাক্সটি পড়ে।';
$ec_lang['lpn_settings_flow_change']='প্রবাহ পরিবর্তনের সীমা';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='থামার আগে সমাধানকারীকে যে অতিরিক্ত পরীক্ষা পাস করতে হবে: এক ট্রায়াল থেকে পরের ট্রায়ালে যেকোনো একটি পাইপের প্রবাহে সর্বোচ্চ পরিবর্তন। শূন্যের অর্থ এই পরীক্ষাটি প্রয়োগ করবেন না। শুধুমাত্র EPANET সমাধানকারী এই বাক্সটি পড়ে।';
$ec_lang['lpn_settings_damp_limit']='ড্যাম্পিং শুরু হয়';
$ec_lang['lpn_settings_damp_limit_tip']='যে নির্ভুলতায় সমাধানকারী ছোট ধাপ নেওয়া শুরু করে, যা একটি দোদুল্যমান নেটওয়ার্ককে কনভার্জ হতে সাহায্য করতে পারে। শূন্যের অর্থ সমাধানকারী কখনো ড্যাম্প করে না। শুধুমাত্র EPANET সমাধানকারী এই বাক্সটি পড়ে।';
$ec_lang['lpn_settings_option_unset']='উল্লেখ নেই';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='নেটওয়ার্কের প্রতিটি চাহিদায় একবারে প্রয়োগ করা একটি একক গুণক। বর্তমান ব্যবহারের চেয়ে বেশি বা কম হলে সিস্টেম কী করে তা জানতে এটি ব্যবহার করুন। এটি আপনার লেখা সংখ্যাগুলো পরিবর্তন করে না। একটি দৃশ্যকল্প তার নিজস্ব একটি রাখতে পারে, তাই গড় দিন, সর্বোচ্চ দিন ও সর্বোচ্চ ঘণ্টা প্রত্যেকে একটি করে সংখ্যা হয়; প্রকল্পের মানটি ব্যবহার করতে একটি দৃশ্যকল্পে এটি খালি রাখুন।';
$ec_lang['lpn_settings_engine_native']='EPANET সমাধানকারী দিয়ে সমাধান করুন';
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
$ec_lang['lpn_settings_engine_native_tip']='US EPA-এর নিজস্ব EPANET সমাধানকারী চালায়, এখানে আপনার ব্রাউজারে। এই আকারের নেটওয়ার্কে আপনি গতির কোনো পার্থক্য দেখবেন না। দুটি সমাধানকারীই কাছাকাছি উত্তর দেয়, তবে ঠিক এক নয়: EPANET মহাকর্ষের জন্য যে মান ব্যবহার করে তা রাউন্ড করে, তাই এর স্থানীয় ক্ষতি বিল্ট-ইন সমাধানকারীর চেয়ে প্রায় 0.08% কম আসে, এবং ম্যানিং রাফনেসের ক্ষেত্রে এর জলশীর্ষ ক্ষতি প্রায় 0.6% কম আসে। এই বাক্সে প্রথমবার টিক দিলে প্রায় ৬৫০ KB ডাউনলোড হয় এবং তারপর এই ডিভাইসে রাখা হয়।';
$ec_lang['lpn_engine_loading']='EPANET সমাধানকারী লোড হচ্ছে…';
$ec_lang['lpn_engine_failed']='EPANET সমাধানকারী লোড করা যায়নি। এর পরিবর্তে বিল্ট-ইন সমাধানকারী দেখানো হচ্ছে।';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='EPANET সমাধানকারী দিয়ে সমাধান করা হয়েছে, কারণ এই ভালভগুলো নিজে থেকেই খোলে ও বন্ধ হয়:';
$ec_lang['lpn_unit_unknown']='এই অঙ্কনে একটি একক উল্লেখ করা আছে যা এই পৃষ্ঠা দেয় না: {unit}। সবকিছু ঠিক যেভাবে এসেছে সেভাবেই রাখা ও দেখানো হয়েছে, কিছুই পরিবর্তন করা হয়নি। এই পৃষ্ঠা সেই এককটি না জানা পর্যন্ত কোনো উত্তর দেওয়া যাবে না, কারণ এটি কত বড় তা বোঝার কোনো উপায় নেই।';
$ec_lang['lpn_engine_manning_note']='দ্রষ্টব্য: ম্যানিং রাফনেসের ক্ষেত্রে, EPANET বিল্ট-ইন সমাধানকারীর চেয়ে প্রায় ০.৬% কম জলশীর্ষ ক্ষতি গণনা করে।';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='EPANET সমাধানকারী এই নেটওয়ার্কটি গ্রহণ করেনি, তাই এটি চলেনি।';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='EPANET সমাধানকারী বলেছে: {message}';
$ec_lang['lpn_engine_refused_fallback']='স্ক্রিনে দেখানো সংখ্যাগুলো এসেছে বিল্ট-ইন সমাধানকারী থেকে।';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='স্ক্রিনে দেখানো সংখ্যাগুলো এসেছে বিল্ট-ইন সমাধানকারী থেকে। এটি একবারে একটি মুহূর্তের জন্য গণনা করে, তাই এটি শুধু {time} সময়ের নেটওয়ার্ক, যেখানে প্রতিটি ট্যাংক তার শুরুর স্তরেই আছে।';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='এই নিয়ন্ত্রণগুলো এমন একটি উপাদানের নাম বলে যা আর এই প্রকল্পে নেই, তাই সেগুলো বাদ দেওয়া হয়েছে: {ids}';
$ec_lang['lpn_control_unreadable_note']='এই নিয়ন্ত্রণগুলো পড়া যায়নি, তাই সেগুলো বাদ দেওয়া হয়েছে: {ids}';
$ec_lang['lpn_rule_dangling_note']='এই নিয়মগুলো এমন একটি উপাদানের কথা বলে যা আর এই প্রকল্পে নেই, তাই এই চালানোয় সেগুলো উপেক্ষা করা হয়েছে: {ids}';
$ec_lang['lpn_rule_unreadable_note']='এই নিয়মগুলো পড়া যায়নি, তাই এই চালানোয় সেগুলো উপেক্ষা করা হয়েছে: {ids}';
$ec_lang['lpn_settings_text_size']='টেক্সটের আকার (পিক্সেল)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='প্রতীকের আকার (পিক্সেল)';
$ec_lang['lpn_settings_link_width']='পাইপ রেখার প্রস্থ (পিক্সেল)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='প্রবাহ দিকের তীর';
$ec_lang['lpn_settings_show_arrows_tip']='প্রতিটি পাইপে একটি তীর আঁকে যা দেখায় পানি কোন দিকে চলছে। রান করার পর তীরগুলো দেখা যায়, এবং সেগুলো বন্ধ করলে ফলাফল অপরিবর্তিত থাকে। এই সেটিং প্রকল্পের সাথে সংরক্ষিত হয়।';
$ec_lang['lpn_settings_align_labels']='পাইপ লেবেল পাইপের সাথে সারিবদ্ধ করুন';
$ec_lang['lpn_settings_readability_bias']='একটি লেবেল উল্টে দেওয়ার আগে উলম্ব থেকে বামে কত ডিগ্রি';
$ec_lang['lpn_settings_readability_bias_tip']='একটি লেবেল উলম্ব থেকে এই সংখ্যক ডিগ্রির বেশি বামে হেলে গেলে তা সোজা রাখতে উল্টে দেয়।';
$ec_lang['lpn_settings_mask_labels']='লেবেলের পেছনে নিরেট পটভূমি';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='লিডার রেখা নির্ধারিত কোণে স্ন্যাপ করুন';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='মানচিত্রের প্রস্থ এই বা এর কম হলে লেবেল দেখান';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='লেবেলগুলো শুধু তখনই আঁকা হয় যখন মানচিত্রের দৃশ্য এই প্রশস্ত বা এর চেয়ে সংকীর্ণ। প্রতিটি জুমে এগুলো আঁকতে বাক্সটি খালি রাখুন। কোনো জুমেই কখনো লেবেল না আঁকতে 0 টাইপ করুন।';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='সবসময় দেখান';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap_sentence']='নোডকে এর চেয়ে বড় স্কেল হতে বাধা দিন {n} এর দৈর্ঘ্যের গুণ {p} পার্সেন্টাইল পাইপ';
$ec_lang['lpn_settings_symbol_cap_tip']='একটি জাংশনের ব্যাস নেটওয়ার্কের সব পাইপ দৈর্ঘ্যের এই পার্সেন্টাইলের পাইপের দৈর্ঘ্যের এতগুণ হয়ে গেলে এটি মাটিতে বড় হওয়া বন্ধ করে দেয়। মানচিত্রে সেই বিন্দুর পরে, জাংশন, পাইপ ও অন্যান্য প্রতীক মাটিতে বড় হওয়ার বদলে আপনি জুম আউট করার সাথে সাথে স্ক্রিনে ছোট হতে থাকে। জলাধার ও ট্যাংক ব্যতিক্রম এবং প্রতিটি জুমে তাদের স্ক্রিন আকার ধরে রাখে।';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='প্রতীকের অস্বচ্ছতা (0 থেকে 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='পটভূমি চিত্রের অস্বচ্ছতা (0 থেকে 1)';
$ec_lang['lpn_settings_map_display']='মানচিত্রের চেহারা';
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
$ec_lang['lpn_settings_legend_position']='লেবেল কী-টেবিলের অবস্থান';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='কোনোটিই নয়';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='বন্ধ';
$ec_lang['lpn_settings_legend_top_left']='উপরে বামে';
$ec_lang['lpn_settings_legend_top_right']='উপরে ডানে';
$ec_lang['lpn_settings_legend_middle_left']='মাঝে বামে';
$ec_lang['lpn_settings_legend_middle_right']='মাঝে ডানে';
$ec_lang['lpn_settings_legend_bottom_left']='নিচে বামে';
$ec_lang['lpn_settings_legend_bottom_right']='নিচে ডানে';
$ec_lang['lpn_settings_color_node_field']='নোডের রঙ';
$ec_lang['lpn_settings_color_link_field']='পাইপের রঙ';
$ec_lang['lpn_settings_color_ramp']='রঙের স্কিম';
$ec_lang['lpn_settings_color_credits']='কৃতজ্ঞতা স্বীকার';
$ec_lang['lpn_color_ramp_epanet']='নীল থেকে লাল (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='বেগুনি থেকে হলুদ (একটি রঙ থেকে পরেরটি আলাদা করা সহজ)';
$ec_lang['lpn_color_ramp_gray']='হালকা থেকে গাঢ় ধূসর';
$ec_lang['lpn_settings_color_reverse']='রঙের ক্রম উল্টে দিন';
$ec_lang['lpn_color_none']='কোনো রঙ নেই';
$ec_lang['lpn_settings_color_key_position']='রঙের কী-টেবিলের অবস্থান';
$ec_lang['lpn_settings_color_breaks']='রঙের ব্যান্ড সীমা';
$ec_lang['lpn_settings_color_equal_intervals']='সমান ব্যবধান';
$ec_lang['lpn_settings_color_equal_counts']='সমান সংখ্যা';
$ec_lang['lpn_settings_color_no_values']='কাজ করার মতো কোনো মান এখনও নেই। প্রথমে নেটওয়ার্কটি সমাধান করুন।';
$ec_lang['lpn_confirm_restore_defaults']='সব সেটিংস (ID উপসর্গ, শুরুর মান, সমাধানকারীর সেটিংস, মানচিত্রের চেহারা, কী-টেবিলের অবস্থান, ও দৃশ্যমান লেবেল) তাদের মূল মানে পুনরায় সেট করবেন? আপনার নেটওয়ার্ক পরিবর্তিত হয় না। সেটিংস খোলা প্রকল্পের অংশ, তাই আপনার অন্যান্য প্রকল্প নিজেদের সেটিংস রাখে।';
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
$ec_lang['lpn_settings_wipe_btn']='এই পৃষ্ঠার সবকিছু মুছে ফেলুন';
$ec_lang['lpn_confirm_wipe']='এই পৃষ্ঠার জন্য সংরক্ষিত সবকিছু — প্রতিটি প্রকল্প, প্রতিটি পটভূমি চিত্র, সব সেটিংস, ও আপনার একক নির্বাচন — মুছে ফেলে পৃষ্ঠাটি একজন সম্পূর্ণ নতুন দর্শক যেভাবে দেখেন সেভাবে পুনরায় লোড করবেন? এটি পূর্বাবস্থায় ফেরানো যাবে না।';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='এই লিংকটি কপি করুন:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='সময়';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='মোট চলার সময়';
$ec_lang['lpn_time_hyd_step']='হাইড্রোলিক টাইম স্টেপ';
$ec_lang['lpn_time_pattern_step']='প্যাটার্ন টাইম স্টেপ';
$ec_lang['lpn_time_pattern_start']='প্যাটার্নের শুরুর সময়';
$ec_lang['lpn_time_report_step']='রিপোর্ট টাইম স্টেপ';
$ec_lang['lpn_time_report_start']='রিপোর্টের শুরুর সময়';
$ec_lang['lpn_time_clock_start']='শুরুতে ঘড়ির সময়';
$ec_lang['lpn_time_clock_day']='দিন {day}, {clock}';
$ec_lang['lpn_time_format_tip']='একটি সময় ঘণ্টা ও মিনিট আকারে লিখুন, যেমন 2:30। একটি সাধারণ সংখ্যা মানে ঘণ্টা, তাই 8 মানে আট ঘণ্টা। আধা ঘণ্টা হলো 0:30।';
$ec_lang['lpn_time_running']='EPANET সমাধানকারী দিয়ে বর্ধিত সময়কাল সিমুলেশনটি হিসাব করা হচ্ছে।';
$ec_lang['lpn_time_no_engine']='বিল্ট-ইন সমাধানকারী একবারে একটি মুহূর্ত হিসাব করে, তাই এটি শুধুমাত্র {time}-এ নেটওয়ার্ক: প্রতিটি প্যাটার্ন সেই মুহূর্তে পড়া হয়, এবং প্রতিটি ট্যাংক ভরা ও খালি হওয়ার বদলে তার শুরুর স্তরেই থাকে। একবার ইন্টারনেটে সংযুক্ত হয়ে EPANET সমাধানকারী আনুন, যা একটি বর্ধিত সময়কাল সিমুলেশন চালায়।';
$ec_lang['lpn_time_slider']='অতিবাহিত সিমুলেশন সময়';
$ec_lang['lpn_time_no_period']='এই প্রকল্পে কোনো বর্ধিত সময়কাল সিমুলেশন নির্ধারিত নেই, তাই দেখানোর মতো শুধু একটি মুহূর্ত আছে। একটি বর্ধিত সময়কাল সিমুলেশন চালাতে সেটিংস, হিসাব, সময়-এ একটি মোট চলার সময় নির্ধারণ করুন।';
$ec_lang['lpn_time_first']='শুরুতে যান';
$ec_lang['lpn_time_prev']='পেছনে যান';
$ec_lang['lpn_time_play']='চালান';
$ec_lang['lpn_time_play_tip']='অ্যানিমেশন চালান';
$ec_lang['lpn_time_pause_tip']='অ্যানিমেশন বিরতি দিন';
$ec_lang['lpn_time_pause']='বিরতি';
$ec_lang['lpn_time_next']='সামনে যান';
$ec_lang['lpn_time_last']='শেষে যান';
$ec_lang['lpn_time_tank']='ট্যাংক';
$ec_lang['lpn_time_level']='পানির স্তর';
$ec_lang['lpn_time_run']='চালান';
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
$ec_lang['lpn_time_run_done']='চালানো শেষ হয়েছে। প্রতিবেদনের সময়সমূহ: {frames}। ব্যয়িত সময়: {secs} সেকেন্ড।';
$ec_lang['lpn_time_runbox_hide']='এই বাক্সটি আর দেখাবেন না';
$ec_lang['lpn_settings_runbox']='চালানোর অগ্রগতির বাক্স দেখান';
$ec_lang['lpn_settings_runbox_tip']='একটি বাক্স যা জানায় একটি চালানো কতদূর পৌঁছেছে এবং কী পেয়েছে। এটি বন্ধ থাকলে, একটি শেষ হওয়া চালানো পরিবর্তে কয়েক সেকেন্ডের জন্য স্ট্যাটাস লাইনে একই তথ্য জানায়। এটি এই ব্রাউজারের জন্য একটি সেটিং, প্রকল্পের জন্য নয়।';
$ec_lang['lpn_time_run_failed']='চালানো শেষ হয়নি, তাই পরের সময়গুলোর কোনো ফলাফল নেই।';
$ec_lang['lpn_time_run_report']='EPANET চালানোর প্রতিবেদন';
$ec_lang['lpn_time_run_report_copy']='কপি করুন';
$ec_lang['lpn_time_run_report_copied']='কপি করা হয়েছে';
$ec_lang['lpn_time_run_report_tip']='EPANET সমাধানকারী নিজে শেষ রান সম্পর্কে যা মুদ্রণ করেছে: এটি কনভার্জ করেছে কিনা, এবং যা নিয়ে এটি সতর্ক করেছে। এটি সমাধানকারীর নিজের টেক্সট, আমাদের নয়।';

$ec_lang['lpn_time_speed']='গতি';
$ec_lang['lpn_time_speed_tip']='প্লেব্যাক গতি';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='সেটিংস অনুসন্ধান করুন';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='একটি বা একাধিক শব্দ লিখুন সেই সেটিংসগুলো দেখতে যেগুলোতে সবগুলো শব্দের উল্লেখ আছে।';
$ec_lang['lpn_settings_no_match']='কোনো সেটিংসে সেই শব্দের উল্লেখ নেই।';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='সেটিংস বিভাগ তালিকার প্রস্থ';
$ec_lang['lpn_rpane_empty']='এখানে এখনও কিছু ডক করা নেই। পুরো প্রকল্পের সাথে সম্পর্কিত সবকিছু সেটিংসে আছে।';
$ec_lang['lpn_time_settings_open']='সময়ের সেটিংস';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='ভিজ্যুয়ালাইজেশন';
$ec_lang['lpn_settings_sec_map']='মানচিত্র ও পৃষ্ঠা';
$ec_lang['lpn_settings_sec_assets']='উপাদান';
$ec_lang['lpn_settings_sec_calculation']='হিসাব';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='গ্রাহক';
$ec_lang['lpn_labels_customer_note']='একটি গ্রাহক লেবেল এখানে টিক দেওয়া মানগুলো দেখায়। এটি মানচিত্রের অন্য প্রতিটি লেবেলের মতো একই টেক্সট আকারে আঁকা হয়।';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='গ্রাহক লেবেলগুলো শুধু তখনই আঁকা হয় যখন মানচিত্রের দৃশ্য এই প্রশস্ত বা এর চেয়ে সংকীর্ণ। প্রতিটি জুমে এগুলো আঁকতে বাক্সটি খালি রাখুন। কোনো জুমেই কখনো গ্রাহক লেবেল না আঁকতে 0 টাইপ করুন। সব লেবেলের অনুরূপ সেটিংয়ের চেয়ে এটি বড় হলে এর কোনো প্রভাব নেই।';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='বর্তমান দৃশ্য ব্যবহার করুন';
$ec_lang['lpn_settings_page']='পৃষ্ঠা';
$ec_lang['lpn_settings_hydraulics']='হাইড্রোলিক্স';
$ec_lang['lpn_settings_quality']='পানির গুণমান';
$ec_lang['lpn_settings_quality_track']='গুণমান প্যারামিটার';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='চালানো পাইপগুলোর মধ্য দিয়ে কী অনুসরণ করবে তা বেছে নিন: পানি সিস্টেমে কতক্ষণ ধরে আছে, এটি কোথা থেকে এসেছে, নাকি ভ্রমণের সময় বিক্রিয়া করা একটি রাসায়নিক। শুধু রাসায়নিকের জন্যই সহগ দরকার।';
$ec_lang['lpn_settings_quality_source']='ট্রেস নোড';
$ec_lang['lpn_settings_quality_source_tip']='যে নোডের পানি ট্রেস করা হয়। এরপর অন্য প্রতিটি নোড দেখায় তার কতটা পানি সেই নোড থেকে এসেছে।';
$ec_lang['lpn_quality_none']='কিছুই না';
$ec_lang['lpn_quality_trace']='উৎস ট্রেস';
$ec_lang['lpn_quality_chemical']='বিক্রিয়াশীল একটি রাসায়নিক';
$ec_lang['lpn_quality_needs_run']='পানির গুণমান পাইপগুলোর মধ্য দিয়ে পানি চলার সাথে সাথে বহন করা হয়, তাই এর জন্য একটি বর্ধিত সময়কাল সিমুলেশন দরকার: EPANET সমাধানকারী ও একটি মোট চলার সময়। সময়-এর অধীনে একটি মোট চলার সময় নির্ধারণ করুন, তারপর চালান বোতাম চাপুন।';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='রাসায়নিক ও একক';
$ec_lang['lpn_quality_chemical_name_tip']='আপনি যে রাসায়নিকটি পর্যবেক্ষণ করছেন, যেমন ক্লোরিন। ফাঁকা রাখলে EPANET-এর নিজস্ব ডিফল্ট লেবেল Chemical ব্যবহৃত হবে। এটি আপনার রিপোর্টে দেখানো হয়, কিন্তু গণনায় ব্যবহৃত হয় না।';
$ec_lang['lpn_quality_mass_units']='ভরের একক';
$ec_lang['lpn_quality_mass_units_tip']='গুণমান এন্ট্রির একক অংশ, EPANET-এর নিজস্ব দুটি পছন্দ।';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='গুণমান সহনশীলতা';
$ec_lang['lpn_quality_tolerance_tip']='EPANET দুটি সংলগ্ন পানির অংশকে একটি হিসেবে গণ্য করার আগে ঘনমাত্রায় সেগুলো কতটা ভিন্ন হতে পারে। খালি রাখলে EPANET-এর নিজস্ব শুরুর মান 0.01 ব্যবহার করে।';
$ec_lang['lpn_quality_diffusivity']='আপেক্ষিক ব্যাপনশীলতা';
$ec_lang['lpn_quality_diffusivity_tip']='রাসায়নিকটি ক্লোরিনের তুলনায় পানির মধ্য দিয়ে কত সহজে ছড়ায়। খালি রাখলে EPANET-এর নিজস্ব শুরুর মান 1.0 ব্যবহার করে।';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='{chemical} ঘনমাত্রা';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='গড় {chemical} ঘনমাত্রা';
$ec_lang['lpn_quality_initial']='শুরুর গুণমান';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='এই নোড চালানো শুরুর সময় রাসায়নিকটির কতটা ধরে রাখে। একটি জলাধার পুরো চালানো জুড়ে তার নিজস্ব মান ধরে রাখে, যেভাবে সাধারণত একটি পরিশোধনাগার থেকে বেরোনো অবশিষ্টাংশ বলা হয়। এটি খালি রাখলে নোডটি রাসায়নিকের কিছুই ছাড়া শুরু করে।';
$ec_lang['lpn_result_concentration']='ঘনমাত্রা';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='ভ্রমণ ও বিক্রিয়ার পর এই বিন্দুতে রাসায়নিকটির কতটা অবশিষ্ট আছে। একক হলো সেটিংস, পানির গুণমান-এর অধীনে রাসায়নিকের পাশে লেখা এককটি।';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='উৎসের ধরন';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='এই নোড দিয়ে যাওয়া পানিতে কোন ধরনের ডোজ প্রয়োগ করা হয়। ঘনমাত্রা এখানে নেটওয়ার্কে প্রবেশ করা পানিকে উৎসের গুণমান মানে পৌঁছানো হিসেবে ধরে। ভর বুস্টার প্রবাহ যাই হোক না কেন প্রতি মিনিটে রাসায়নিকের একটি ভর যোগ করে। সেটপয়েন্ট বুস্টার এই নোড ছেড়ে যাওয়া ঘনমাত্রাকে উৎসের গুণমান মান পর্যন্ত তোলে, তার বেশি নয়। প্রবাহ-অনুপাতী বুস্টার পানিতে ইতিমধ্যে যা আছে তার সাথে উৎসের গুণমান মান যোগ করে।';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='কিছুই না';
$ec_lang['lpn_source_type_concen']='ঘনমাত্রা';
$ec_lang['lpn_source_type_mass']='ভর বুস্টার';
$ec_lang['lpn_source_type_setpoint']='সেটপয়েন্ট বুস্টার';
$ec_lang['lpn_source_type_flowpaced']='প্রবাহ-অনুপাতী বুস্টার';
$ec_lang['lpn_source_quality']='উৎসের গুণমান';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='ডোজটি কতটা শক্তিশালী। ভর বুস্টার ছাড়া প্রতিটি ধরনের জন্য এটি একটি ঘনমাত্রা, সেটিংস, পানির গুণমান-এর অধীনে রাসায়নিকের পাশে লেখা এককে; একটি ভর বুস্টারের জন্য এটি প্রতি মিনিটে রাসায়নিকের একটি ভর। এটি খালি রাখলে এখানে কিছুই যোগ করা হয় না, যা শূন্যের মতো নয়: শূন্য মানে একটি ফিড চলছে এবং কিছুই যোগ করছে না।';
$ec_lang['lpn_source_pattern']='উৎসের প্যাটার্ন';
$ec_lang['lpn_source_pattern_tip']='একটি সময় প্যাটার্ন যা চালানো জুড়ে ডোজটিকে স্কেল করে, এমন একটি ফিডের জন্য যা ধ্রুবক নয়। কোনো প্যাটার্ন না থাকা মানে প্রতিটি ধাপে ডোজটি একই থাকে।';
$ec_lang['lpn_mixing_model']='মিশ্রণ মডেল';
$ec_lang['lpn_mixing_model_tip']='এই ট্যাংকে ইতিমধ্যে থাকা পানি আগত পানির সাথে কীভাবে মেশে। সম্পূর্ণ মিশ্রণ পুরো ট্যাংক একসাথে নাড়ে। দুই-প্রকোষ্ঠ মিশ্রণ প্রথমে একটি প্রবেশ অঞ্চল ভরে এবং বাকিটা পাঠিয়ে দেয়। FIFO প্লাগ ফ্লো পানিকে সেই ক্রমে চালিয়ে দেয় যে ক্রমে তা এসেছিল। LIFO প্লাগ ফ্লো এটিকে স্তূপ করে, তাই সবশেষে ঢোকা পানি সবার আগে বেরিয়ে যায়। এই পছন্দ পানির বয়স ও অবশিষ্টাংশ বদলায়, এবং এটি কোনো চাপ বা প্রবাহ বদলায় না।';
$ec_lang['lpn_mixing_mixed']='সম্পূর্ণ মিশ্রণ';
$ec_lang['lpn_mixing_2comp']='দুই-প্রকোষ্ঠ মিশ্রণ';
$ec_lang['lpn_mixing_fifo']='FIFO প্লাগ ফ্লো';
$ec_lang['lpn_mixing_lifo']='LIFO প্লাগ ফ্লো';
$ec_lang['lpn_mixing_fraction']='মিশ্রণ ভগ্নাংশ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='ট্যাংক আয়তনের যে অংশ প্রবেশ অঞ্চল দখল করে, 0 থেকে 1 এর মধ্যে। শুধু দুই-প্রকোষ্ঠ মিশ্রণ এটি ব্যবহার করে। এটি খালি রাখলে পুরো ট্যাংকই প্রবেশ অঞ্চল হয়ে যায়, যা EPANET ধরে নেয়।';
$ec_lang['lpn_reaction_bulk']='বাল্ক বিক্রিয়া সহগ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='পানির মূল অংশে বিক্রিয়া, প্রতিটি পাইপের জন্য ব্যবহৃত হয় যার নিজস্ব কোনো মান নেই। একটি ঋণাত্মক সংখ্যা রাসায়নিকটিকে ক্ষয় করে এবং একটি ধনাত্মক সংখ্যা তা বাড়ায়। একটি আমদানি করা EPANET ফাইল অন্য একটি ক্রম না বললে বিক্রিয়াটি প্রথম ক্রমের, তাই সহগটি 1/day-এ একটি হার। একটি খালি বাক্স মানে কোনো বাল্ক বিক্রিয়া নেই।';
$ec_lang['lpn_reaction_wall']='দেয়াল বিক্রিয়া সহগ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='পাইপের দেয়ালে বিক্রিয়া, প্রতিটি পাইপের জন্য ব্যবহৃত হয় যার নিজস্ব কোনো মান নেই। একটি ঋণাত্মক সংখ্যা রাসায়নিকটিকে ক্ষয় করে। একটি আমদানি করা EPANET ফাইল অন্য একটি ক্রম না বললে বিক্রিয়াটি প্রথম ক্রমের, তাই সহগটি প্রতি দিনে একটি দৈর্ঘ্য, প্রকল্পের দৈর্ঘ্য এককে লেখা। একটি খালি বাক্স মানে কোনো দেয়াল বিক্রিয়া নেই।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='শুধু এই পাইপের নিজস্ব মান। এটি খালি রাখলে পাইপটি সেটিংস, পানির গুণমান-এর অধীনে পুরো নেটওয়ার্কের জন্য নির্ধারিত সহগ ব্যবহার করে।';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='বিক্রিয়া সহগ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='এই ট্যাংকে ধরে রাখা পানিতে বিক্রিয়া, 1/day-এ একটি হার হিসেবে। একটি ঋণাত্মক সংখ্যা রাসায়নিকটিকে ক্ষয় করে এবং একটি ধনাত্মক সংখ্যা তা বাড়ায়। পানি যেকোনো পাইপের চেয়ে একটি ট্যাংকে অনেক বেশি সময় থাকে, তাই প্রায়ই এখানেই একটি অবশিষ্টাংশ হারিয়ে যায়। এটি খালি রাখলে ট্যাংকটি সেটিংস, পানির গুণমান-এর অধীনে পুরো নেটওয়ার্কের জন্য নির্ধারিত বাল্ক বিক্রিয়া সহগ ব্যবহার করে।';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='বাল্ক বিক্রিয়া';
$ec_lang['lpn_reaction_wall_short']='দেয়াল বিক্রিয়া';
$ec_lang['lpn_reaction_tank_short']='বিক্রিয়া';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='১/দিন';
$ec_lang['lpn_reaction_day']='দিন';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='বাল্ক বিক্রিয়ার ক্রম';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='পানির মূল অংশে বিক্রিয়ার জন্য ঘনমাত্রাকে যে সূচকে উন্নীত করা হয়। যেকোনো বাস্তব সংখ্যা গ্রহণযোগ্য। ডিফল্ট মান 1, এবং বেশিরভাগ ক্লোরিন ক্ষয় মডেলিংয়ে ব্যবহৃত হয়। 0 হলে হারটি সেখানে কতটা রাসায়নিক আছে তার থেকে স্বাধীন হয়ে যায়।';
$ec_lang['lpn_reaction_order_tank']='ট্যাংক বিক্রিয়ার ক্রম';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='একটি ট্যাংকে ধরে রাখা পানিতে বিক্রিয়ার জন্য ঘনমাত্রাকে যে সূচকে উন্নীত করা হয়, বাল্ক বিক্রিয়ার ক্রম থেকে আলাদা, যাতে একটি ট্যাংক পাইপগুলোর চেয়ে ভিন্ন ক্রমে বিক্রিয়া করতে পারে। যেকোনো বাস্তব সংখ্যা গ্রহণযোগ্য, এবং ডিফল্ট মান 1। EPANET একে ফাইলে ORDER TANK হিসেবে বলে এবং নিজস্ব ইন্টারফেসে এর জন্য কোনো বাক্স দেয় না।';
$ec_lang['lpn_reaction_order_wall']='দেয়াল বিক্রিয়ার ক্রম';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 মানে দেয়াল বিক্রিয়া নির্ধারিত সহগ(গুলো) অনুযায়ী ঘটে। 0 মানে ঘটে না। এটি একটি চালু-বন্ধ সুইচ। ডিফল্ট মান 1।';
$ec_lang['lpn_reaction_order_unstated']='বলা হয়নি';
$ec_lang['lpn_reaction_order_zero']='0, শূন্য ক্রম';
$ec_lang['lpn_reaction_order_first']='1, প্রথম ক্রম';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='সীমাবদ্ধকারী সম্ভাবনা';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='একটি ঘনমাত্রা যার দিকে রাসায়নিকটি এগোয়, শূন্যে ক্ষয় হওয়া বা সীমাহীন বাড়ার বদলে। পানি এর কাছাকাছি পৌঁছানোর সাথে সাথে বিক্রিয়া ধীর হয় এবং সেখানে থেমে যায়। সামঞ্জস্যপূর্ণ একক ব্যবহার করুন। খালি রাখলে কোনো সীমা থাকে না।';
$ec_lang['lpn_reaction_rough_corr']='রুক্ষতা সহসম্পর্ক';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='দেয়াল বিক্রিয়াকে প্রতিটি পাইপের নিজস্ব রুক্ষতার সাথে সহসম্পর্কিত করে, যাতে একটি বেশি রুক্ষ পাইপ দ্রুত বিক্রিয়া করে। এটি নির্ধারণ করা হলে, প্রতিটি পাইপের জন্য তার রুক্ষতা থেকে একটি দেয়াল সহগ বের করা হয়, এবং উপরের একক দেয়াল সহগটি আর ব্যবহৃত হয় না। খালি রাখলে ব্যবহৃত হয় না।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='এই পৃষ্ঠা নিজস্ব কোনো বিক্রিয়া সহগ দেয় না। এর জন্য কোনো প্রমিত পরীক্ষা নেই, এবং একই ধরনের পানির জন্য প্রকাশিত মাঠ পর্যায়ের মান দশ গুণ পর্যন্ত ভিন্ন হয়, তাই এখানে দেওয়া একটি সংখ্যা একটি সুপারিশ হিসেবে পড়া হবে। আপনি যা পরিমাপ করেছেন বা উদ্ধৃত করতে পারেন তা লিখুন, অথবা বিক্রিয়া না করা একটি রাসায়নিকের জন্য বাক্সগুলো খালি রাখুন।';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='শক্তি';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='প্রতিবেদন';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_epanet']='EPANET চালানো';
$ec_lang['lpn_energy_title']='পাম্প শক্তি প্রতিবেদন';
$ec_lang['lpn_energy_menu']='পাম্প শক্তি';
$ec_lang['lpn_energy_efficiency']='পাম্প দক্ষতা (শতাংশ)';
$ec_lang['lpn_energy_efficiency_tip']='প্রতিটি পাম্পের জন্য ব্যবহৃত ওয়্যার-টু-ওয়াটার দক্ষতা যার নিজস্ব কোনো দক্ষতার কার্ভ নেই। কিছুই বলা না থাকলে EPANET 75 শতাংশ ব্যবহার করে।';
$ec_lang['lpn_energy_price']='বিদ্যুতের দাম';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='এক কিলোওয়াট ঘণ্টার দাম কত। এটি প্রতিটি পাম্পে প্রযোজ্য যার নিজস্ব কোনো দাম নেই। এটি খালি রাখলে প্রতিবেদনের প্রতিটি খরচ শূন্য হয়।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='এই পাম্পে এক কিলোওয়াট ঘণ্টার দাম কত। এটি খালি রাখলে পাম্পটি সেটিংস, শক্তি-এর অধীনে পুরো নেটওয়ার্কের জন্য নির্ধারিত দাম দেয়।';
$ec_lang['lpn_energy_price_pattern']='দামের প্যাটার্ন';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='একটি প্যাটার্ন যা প্রতিটি প্যাটার্ন ধাপে দামকে গুণ করে, এভাবেই একটি অফ-পিক হার নির্ধারণ করা হয়। পুরো চালানো জুড়ে একটি দামের জন্য এটি খালি রাখুন।';
$ec_lang['lpn_energy_demand_charge']='সর্বোচ্চ চাহিদা মাশুল';
$ec_lang['lpn_energy_demand_charge_tip']='সিস্টেমের পাম্পগুলোর দাবি করা সর্বোচ্চ লোডের জন্য ইউটিলিটি প্রতি kW-তে কত মাশুল নেয়।';
$ec_lang['lpn_energy_currency']='মুদ্রা';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='এখানে আপনি যা লেখেন তা প্রতিটি অর্থের সংখ্যার পাশে ছাপা হয়। এটি একটি লেবেল। দাম ও খরচ কখনো রূপান্তরিত হয় না, তাই এখানে আপনার লেখা মুদ্রায় দামগুলো লিখুন।';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='এই পৃষ্ঠা নিজস্ব কোনো দাম দেয় না। বিদ্যুতের দাম ইউটিলিটি, দেশ, সময় ও বছরের উপর নির্ভর করে, তাই এখানে দেওয়া একটি সংখ্যা একটি সুপারিশ হিসেবে পড়া হবে। আপনার নিজস্ব ট্যারিফ থেকে দামটি লিখুন।';
$ec_lang['lpn_energy_needs_run']='পাম্প শক্তি হলো চালানো জুড়ে ইন্টিগ্রেট করা ক্ষমতা, তাই এর জন্য একটি বর্ধিত সময়কাল সিমুলেশন দরকার: EPANET সমাধানকারী ও একটি মোট চলার সময়। সেটিংস, হিসাব, সময়-এ একটি মোট চলার সময় নির্ধারণ করুন, চালান বোতাম চাপুন, তারপর পানি, প্রতিবেদন, পাম্প শক্তি খুলুন।';
$ec_lang['lpn_energy_no_pumps']='এই নেটওয়ার্কে কোনো পাম্প নেই, তাই শক্তি টানার মতো কিছু নেই।';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='দৃশ্যকল্প তুলনা';
$ec_lang['lpn_scncmp_menu_tip']='এই প্রকল্পের প্রতিটি দৃশ্যকল্প সমাধান করে সেগুলো পাশাপাশি পড়ুন: প্রতিটিতে সর্বনিম্ন চাপ ও সর্বোচ্চ বেগ।';
$ec_lang['lpn_scncmp_running']='প্রতিটি দৃশ্যকল্প সমাধান করা হচ্ছে…';
$ec_lang['lpn_scncmp_empty']='এখনও কিছু আঁকা হয়নি, তাই সমাধান করার মতো কিছু নেই।';
$ec_lang['lpn_scncmp_col_maxvelocity']='সর্বোচ্চ বেগ';
$ec_lang['lpn_scncmp_at']='{id}-এ {value}';
$ec_lang['lpn_scncmp_current']='(বর্তমানে খোলা)';
$ec_lang['lpn_scncmp_note']='প্রতিটি দৃশ্যকল্প অঙ্কনের একটি কপি থেকে সমাধান করা হয়। এখানে কিছুই প্রকল্প পরিবর্তন করে না, এবং আপনি যে দৃশ্যকল্পে কাজ করছেন তা যেমন ছিল তেমনই থেকে যায়।';
$ec_lang['lpn_energy_over']='{time}-এর বর্ধিত সময়কাল সিমুলেশনের জন্য';
$ec_lang['lpn_energy_col_pump']='পাম্প';
$ec_lang['lpn_energy_col_running']='চালানোর %';
$ec_lang['lpn_energy_col_effic']='দক্ষ.';
$ec_lang['lpn_energy_col_avg_kw']='গড় kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='এই পাম্প চালু থাকাকালীন ব্যবহৃত গড় শক্তি। এটি নিষ্ক্রিয় সময়ের উপর গড় করা হয় না, তাই বর্ধিত সময়কাল সিমুলেশনের বেশিরভাগ সময় নিষ্ক্রিয় থাকা একটি পাম্পও চালু থাকাকালীন ব্যবহৃত শক্তিই দেখায়।';
$ec_lang['lpn_energy_col_peak_kw']='সর্বোচ্চ kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='খরচ';
$ec_lang['lpn_energy_total_kwh']='ব্যবহৃত শক্তি';
$ec_lang['lpn_energy_total_energy_cost']='শক্তির খরচ';
$ec_lang['lpn_energy_peak_kw']='সর্বোচ্চ শক্তি ব্যবহার';
$ec_lang['lpn_energy_total_demand_charge']='সর্বোচ্চ চাহিদার খরচ';
$ec_lang['lpn_energy_total_cost']='মোট খরচ';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='অবস্থা';
$ec_lang['lpn_reports_status_tip']='সর্বশেষ বর্ধিত সময়কাল সিমুলেশনে সময়ক্রমে কী পরিবর্তিত হয়েছে: পাম্প ও ভালভ খোলা বা বন্ধ হওয়া, ট্যাংক ভরাট হওয়া, খালি হওয়া, ভর্তি হয়ে যাওয়া বা শুকিয়ে যাওয়া, এবং যে ধাপগুলো পুরোপুরি কনভার্জ করেনি।';
$ec_lang['lpn_status_title']='অবস্থা প্রতিবেদন';
$ec_lang['lpn_status_needs_run']='অবস্থা প্রতিবেদন একটি বর্ধিত সময়কাল সিমুলেশনে কী পরিবর্তিত হয়েছে তা তালিকাভুক্ত করে। সেটিংস, হিসাব, সময়-এ একটি মোট চলার সময় নির্ধারণ করুন, চালান চাপুন, তারপর পানি, প্রতিবেদন, অবস্থা প্রতিবেদন খুলুন।';
$ec_lang['lpn_status_empty']='এই রানের সময় কোনো অবস্থা পরিবর্তিত হয়নি।';
$ec_lang['lpn_status_col_event']='ঘটনা';
$ec_lang['lpn_status_opened']='{type} {id} এখন খোলা';
$ec_lang['lpn_status_closed']='{type} {id} এখন বন্ধ';
$ec_lang['lpn_status_filling']='{type} {id} এখন ভরাট হচ্ছে';
$ec_lang['lpn_status_emptying']='{type} {id} এখন খালি হচ্ছে';
$ec_lang['lpn_status_full']='{type} {id} এখন ভর্তি';
$ec_lang['lpn_status_dry']='{type} {id} এখন খালি';
$ec_lang['lpn_status_no_converge']='এই ধাপে হাইড্রোলিক সমাধান পুরোপুরি কনভার্জ করেনি; দেখানো সংখ্যাগুলো এর সর্বশেষ পুনরাবৃত্তির।';
$ec_lang['lpn_status_note']='টেবিল প্যানেল ও পূর্ণাঙ্গ প্রতিবেদন-এর মতোই একই বর্ধিত সময়কাল রান থেকে পড়া হয়। শুধু একটি পরিবর্তন তালিকাভুক্ত করা হয়, প্রতিটি ধাপ নয়।';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='পূর্ণাঙ্গ';
$ec_lang['lpn_reports_full_tip']='সর্বশেষ রানের প্রতিটি প্রতিবেদন সময় ধাপে প্রতিটি নোড ও প্রতিটি লিংক, একটি টেবিল হিসেবে যা আপনি ডাউনলোড বা প্রিন্ট করতে পারেন।';
$ec_lang['lpn_full_title']='পূর্ণাঙ্গ প্রতিবেদন';
$ec_lang['lpn_full_needs_run']='পূর্ণাঙ্গ প্রতিবেদন প্রতিটি প্রতিবেদন সময় ধাপে প্রতিটি নোড ও প্রতিটি লিংক তালিকাভুক্ত করে। চালান চাপুন, তারপর পানি, প্রতিবেদন, পূর্ণাঙ্গ প্রতিবেদন খুলুন।';
$ec_lang['lpn_full_note']='প্রতিটি প্রতিবেদন সময় ধাপে প্রতি নোড বা লিংকে একটি সারি, টেবিল প্যানেলে দেখানো এককে। একটি খালি কক্ষ এমন একটি কলাম যা সেই রাশির নেই। ডাউনলোড বা প্রিন্ট প্রতিটি সময় ধাপ বহন করে; নিচের টেবিলটি একবারে একটি দেখায়।';
$ec_lang['lpn_full_step_label']='সময় ধাপ';
$ec_lang['lpn_full_download_csv']='CSV ডাউনলোড করুন';
$ec_lang['lpn_full_print']='প্রতিবেদন প্রিন্ট করুন';
$ec_lang['lpn_full_col_time']='সময়';
$ec_lang['lpn_full_col_type']='ধরন';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n}টি সারি।';
$ec_lang['lpn_energy_no_price']='বিদ্যুতের কোনো দাম বলা নেই, তাই এখানকার প্রতিটি খরচ শূন্য। সেটিংস, শক্তি-এর অধীনে একটি নির্ধারণ করুন।';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='এই নেটওয়ার্ক শূন্য দাম বলছে, তাই এখানকার প্রতিটি খরচ শূন্য। সেটিংস, শক্তি-এর অধীনে এটি পরিবর্তন করুন।';
$ec_lang['lpn_energy_curve_note']='এই পাম্পগুলো একটি দক্ষতার কার্ভের কথা বলে যাতে কোনো বিন্দু নেই: {ids}। এগুলো পুরো নেটওয়ার্কের জন্য নির্ধারিত দক্ষতায় চলেছে।';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_rank']='ক্রম';
$ec_lang['lpn_labels_col_drop']='বাদ';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='নোড ও লিংক';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='সমান ব্যবধান';
$ec_lang['lpn_color_mode_quantile']='কোয়ান্টাইল (সমান সংখ্যা)';
$ec_lang['lpn_color_mode_jenks']='স্বাভাবিক বিরতি (Jenks)';
$ec_lang['lpn_color_mode_stddev']='আদর্শ বিচ্যুতি';
$ec_lang['lpn_color_mode_pretty']='সুন্দর (গোলাকার)';
$ec_lang['lpn_color_mode_log']='লগারিদমিক';
$ec_lang['lpn_color_mode_manual']='নিজে নির্ধারিত';

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
$ec_lang['lpn_library_menu']='লাইব্রেরি';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='প্যাটার্ন';
$ec_lang['lpn_library_patterns_tip']='একটি প্যাটার্ন হলো পুনরাবৃত্ত গুণকের একটি তালিকা। প্রতিটি একটি প্যাটার্ন সময়-ধাপের জন্য প্রযোজ্য, তাই এক ঘণ্টার ধাপে ২৪টি সংখ্যা এমন একটি দিন তৈরি করে যা পুনরাবৃত্ত হয়। ১.৫ গুণক সহ ১০ চাহিদা সেই মুহূর্তে ১৫ হয়ে যায়।';
$ec_lang['lpn_library_curves']='কার্ভ';
$ec_lang['lpn_library_curves_tip']='একটি কার্ভ হলো বিন্দুর একটি তালিকা যা বলে কোনো কিছু কেমন কাজ করে: একটি পাম্প প্রতিটি প্রবাহে কতটা জলশীর্ষ যোগ করে, সেই প্রবাহে এটি কতটা কার্যকর, অথবা একটি ভালভ প্রতিটি প্রবাহে কতটা জলশীর্ষ হারায়।';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='একটি কার্ভ একটি প্রকল্পের অংশ, এবং একটি পাম্প বা ভালভ তার নিজস্ব বৈশিষ্ট্যে জানায় সে কোনটি ব্যবহার করে। একাধিক উপাদান একই কার্ভ ব্যবহার করতে পারে, এবং এখানে সেটি পরিবর্তন করলে সবগুলোই বদলে যায়। একটি পাম্প জলশীর্ষ কার্ভের জন্য চালানো বিন্দুগুলোর মধ্য দিয়ে মেলানো একটি কার্ভ ব্যবহার করে; অন্য প্রতিটি ধরনের জন্য এটি দেখানো বিন্দুগুলোকে সরলরেখা দিয়ে যুক্ত করে।';
$ec_lang['lpn_library_curve_add']='একটি কার্ভ যোগ করুন';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='কার্ভের ধরন';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='সমীকরণ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='বিন্দুগুলোর মধ্য দিয়ে মেলানো কার্ভ, এবং নিচের প্লটে আঁকা রেখা। এটি প্রতিবার দেখানোর সময় বিন্দুগুলো থেকে বের করা হয় এবং কখনো সংরক্ষণ করা হয় না, এবং এর সংখ্যাগুলো উপরের সারণি যে এককে দেখায় সেই এককে। বিল্ট-ইন সমাধানকারী এই সমীকরণের উপর চলে; EPANET সমাধানকারী বিন্দুগুলো নিজেই পড়ে।';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='একটি স্প্রেডশিটে এক বা দুটি কলাম বাছাই করুন, সেগুলো কপি করুন, এবং আপনি যেখানে সেগুলো ফেলতে চান সেই প্রথম কক্ষে পেস্ট করুন। প্রয়োজন অনুযায়ী সারি যোগ করা হয়। আপনি সরাসরি একটি EPANET ফাইল থেকে কপি করা লাইনও পেস্ট করতে পারেন, কার্ভের নামসহ।';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='বিবরণ';
$ec_lang['lpn_library_curve_remove_point']='এই বিন্দুটি সরিয়ে ফেলুন';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='বিন্দুগুলো কপি করুন';
$ec_lang['lpn_library_curve_copy_tip']='প্রতিটি বিন্দু দুটি কলাম হিসেবে কপি করে, একটি স্প্রেডশিটে পেস্ট করার জন্য প্রস্তুত।';
$ec_lang['lpn_library_curve_copy_manual']='এই বিন্দুগুলো কপি করুন';
$ec_lang['lpn_library_curve_used_by']='এই কার্ভ ব্যবহার করা উপাদান';
$ec_lang['lpn_library_curve_unused']='কিছুই এই কার্ভ ব্যবহার করে না।';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='এই কার্ভ {count}টি উপাদান ব্যবহার করে: {ids}। আগে সেগুলোকে অন্য একটি কার্ভের দিকে নির্দেশ করুন, তারপর এটি মুছে ফেলুন।';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='পাইপের ধরন';
$ec_lang['lpn_library_pipetypes_tip']='একটি পাইপের ধরন এমন একটি সংজ্ঞা যা একাধিক পাইপ তাদের ব্যাস, রুক্ষতা ও বিক্রিয়া সহগের জন্য নির্দেশ করতে পারে। সংজ্ঞা সম্পাদনা করলে এটি ব্যবহার করা প্রতিটি পাইপ সম্পাদিত হয়।';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='প্রতিটি প্রকল্পের নিজস্ব পাইপের ধরন লাইব্রেরি আছে। আপনি একটি পাইপের ধরন সংজ্ঞায় বৈশিষ্ট্য খালি রাখতে পারেন। উদাহরণস্বরূপ, রুক্ষতা বলা এবং ব্যাস না বলা একটি পাইপের ধরন ঠিক আছে। আপনি পাইপগুলোর বৈশিষ্ট্য সম্পাদকে পাইপের ধরন সংযুক্ত করেন। এখানে একটি সংজ্ঞা সম্পাদনা করলে এটি নির্দেশ করা প্রতিটি পাইপ পরিবর্তিত হয়।';
$ec_lang['lpn_library_pipetype_add']='একটি পাইপের ধরন যোগ করুন';
$ec_lang['lpn_library_pipetype_blank_tip']='একটি পাইপের ধরন সংজ্ঞায় খালি বৈশিষ্ট্য প্রতিটি পাইপের জন্য আলাদাভাবে প্রবেশ করানোর জন্য রাখা হয়।';
$ec_lang['lpn_library_pipetype_used_by']='এই ধরন ব্যবহার করা পাইপ';
$ec_lang['lpn_library_pipetype_unused']='কিছুই এই পাইপের ধরন ব্যবহার করে না।';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='এই পাইপের ধরন {count}টি পাইপ ব্যবহার করে: {ids}। মুছে ফেলার আগে এটি তাদের থেকে বিচ্ছিন্ন করুন।';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='পাইপের ধরন';
$ec_lang['lpn_field_pipetype_tip']='প্রকল্প লাইব্রেরির যে পাইপের ধরন এই পাইপটি ব্যবহার করে। পাইপের ধরনে অন্তর্ভুক্ত বৈশিষ্ট্যগুলো এখানে সম্পাদনার জন্য নিষ্ক্রিয় থাকে। এখানে সম্পাদনা সক্রিয় করতে পাইপের ধরন থেকে বিচ্ছিন্ন করুন।';
$ec_lang['lpn_pipetype_none']='কোনো পাইপের ধরন নির্বাচিত নয়';
$ec_lang['lpn_pipetype_detach']='পাইপের ধরন থেকে বিচ্ছিন্ন করুন';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='এই পাইপ যে ধরন থেকে মান পড়ে সেগুলো পাইপের নিজের মধ্যে কপি করে এবং ধরনটি ব্যবহার বন্ধ করে দেয়। পাইপের মানগুলো এখন পরিবর্তিত হয় না, এবং এখন থেকে আপনি এই মানগুলো এখানে সম্পাদনা করতে পারবেন।';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='ফিটিংস';
$ec_lang['lpn_library_fittings_tip']='একটি ফিটিংস তালিকা হলো ফিটিং ও তাদের পরিমাণের একটি সেট যা একাধিক পাইপ নির্দেশ করতে পারে। এটি যোগ হয়ে একটি স্থানীয় ক্ষতি সহগ তৈরি করে।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='প্রতিটি প্রকল্পের নিজস্ব ফিটিংস লাইব্রেরি আছে। একটি ফিটিংস তালিকায় প্রতিটির জন্য একটি পরিমাণসহ ফিটিং থাকে, এবং এটি যোগ হয়ে একটি একক স্থানীয় ক্ষতি সহগ তৈরি করে। পাইপ ও পাইপের ধরন উভয়ই একটি তালিকা নির্দেশ করতে পারে।';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='এখানে দেওয়া ফিটিংগুলো EPANET 2.2 ব্যবহারকারী নির্দেশিকার সারণি 3.3-এর তেরোটি ফিটিং। একটি বেছে নিলে এর সহগ সারিতে কপি হয়, যেখানে আপনি এটি পরিবর্তন করতে পারেন। একটি সহগ ফিটিংয়ের আকার ও নির্মাতার উপর নির্ভর করে, তাই এই সারণিকে একটি উত্তরের বদলে একটি শুরুর বিন্দু হিসেবে ধরুন।';
$ec_lang['lpn_library_fittings_add']='একটি ফিটিংস তালিকা যোগ করুন';
$ec_lang['lpn_library_fittings_used_by']='এই ফিটিংস তালিকা ব্যবহার করা পাইপ';
$ec_lang['lpn_library_fittings_unused']='কিছুই এই ফিটিংস তালিকা ব্যবহার করে না।';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='এই ফিটিংস তালিকা {count}টি পাইপ ব্যবহার করে: {ids}। মুছে ফেলার আগে এটি তাদের থেকে বিচ্ছিন্ন করুন।';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='লাইব্রেরি ইম্পোর্ট করুন…';
$ec_lang['lpn_library_import_tip']='অন্য একটি প্রকল্প ফাইল বেছে নিন এবং সেখান থেকে সম্পূর্ণ লাইব্রেরি এই প্রকল্পে কপি করুন। যার নাম এখানে ইতিমধ্যে ব্যবহৃত হয়ে গেছে তা বাদ দিয়ে তালিকাভুক্ত করা হয়, তাই আপনার ইতিমধ্যে থাকা কিছুই পরিবর্তিত হয় না।';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='{file} থেকে কী কপি করবেন তা বেছে নিন';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='আপনি যে লাইব্রেরিগুলো টিক দেন সেগুলো সম্পূর্ণভাবে কপি করা হয়। পরে আপনি যা চান না তা মুছে ফেলুন, অন্য যেকোনো এন্ট্রি মোছার মতোই।';
$ec_lang['lpn_library_import_go']='ইম্পোর্ট করুন';
$ec_lang['lpn_library_import_no_libraries']='সেই প্রকল্প ফাইলে কপি করার মতো কোনো লাইব্রেরি নেই।';
$ec_lang['lpn_library_import_heading']='{file} থেকে ইম্পোর্ট করা হয়েছে';
$ec_lang['lpn_library_import_added']='কপি করা হয়েছে: {names}';
$ec_lang['lpn_library_import_conflict']='বাদ দেওয়া হয়েছে, কারণ এই প্রকল্পে ইতিমধ্যে একই নামে একটি আছে: {names}। এখানে কিছুই পরিবর্তিত হয়নি। দুটোই চাইলে যেকোনো একটির নাম পরিবর্তন করে আবার ইম্পোর্ট করুন।';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='সেই প্রকল্প ফাইলে কপি করার মতো এগুলোর কোনোটিই নেই।';
$ec_lang['lpn_library_import_curve_shape']='এই কার্ভগুলো ফাইলে যেভাবে লেখা ছিল ঠিক সেভাবেই এসেছে, এবং একটি রান এর কোনোটি ব্যবহার করতে পারে না যতক্ষণ না এর প্রথম কলাম প্রতিটি বিন্দু থেকে পরেরটিতে বাড়ে: {names}';
$ec_lang['lpn_library_import_needs_fittings']='এই পাইপের ধরনগুলো এমন একটি ফিটিংস তালিকার কথা বলে যা এই প্রকল্পে নেই: {names}। একই ফাইল থেকে ফিটিংস লাইব্রেরি ইম্পোর্ট করুন এবং এগুলো সেটি খুঁজে পাবে।';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='সতর্কতা: একক মেলে না। যেমন আছে তেমনই ইম্পোর্ট করা হবে। সুপারিশ করা হয় না।';
$ec_lang['lpn_library_import_units_line']='{name}: এই প্রকল্প {mine} দেখায়, ফাইলটি {theirs} দেখায়।';
$ec_lang['lpn_fitting_qty']='পরিমাণ';
$ec_lang['lpn_fitting_name']='ফিটিং';
$ec_lang['lpn_fitting_k']='সহগ';
$ec_lang['lpn_fitting_add']='একটি ফিটিং যোগ করুন';
$ec_lang['lpn_fitting_remove']='সরান';
$ec_lang['lpn_fitting_total']='মোট স্থানীয় ক্ষতি সহগ, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='ফিটিংস তালিকা';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='প্রকল্প লাইব্রেরির একটি ফিটিংস তালিকা। এর পরিমাণ ও সহগগুলো যোগ হয়ে এই পাইপের স্থানীয় ক্ষতি সহগে পরিণত হয়, এবং তখন সহগের বাক্সটি শুধু-পঠনযোগ্য হয়ে যায়। সহগটি নিজে লিখতে এটি অনির্বাচিত রাখুন।';
$ec_lang['lpn_fittings_none']='কোনো ফিটিংস তালিকা নির্বাচিত নয়';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='গ্লোব ভালভ, সম্পূর্ণ খোলা';
$ec_lang['lpn_fitting_angle']='অ্যাঙ্গেল ভালভ, সম্পূর্ণ খোলা';
$ec_lang['lpn_fitting_swingcheck']='সুইং চেক ভালভ, সম্পূর্ণ খোলা';
$ec_lang['lpn_fitting_gate']='গেট ভালভ, সম্পূর্ণ খোলা';
$ec_lang['lpn_fitting_elbow_short']='ছোট ব্যাসার্ধের এলবো';
$ec_lang['lpn_fitting_elbow_medium']='মাঝারি ব্যাসার্ধের এলবো';
$ec_lang['lpn_fitting_elbow_long']='লম্বা ব্যাসার্ধের এলবো';
$ec_lang['lpn_fitting_elbow_45']='৪৫ ডিগ্রি এলবো';
$ec_lang['lpn_fitting_return_bend']='বদ্ধ রিটার্ন বেন্ড';
$ec_lang['lpn_fitting_tee_run']='স্ট্যান্ডার্ড টি, সরাসরি পথে প্রবাহ';
$ec_lang['lpn_fitting_tee_branch']='স্ট্যান্ডার্ড টি, শাখা পথে প্রবাহ';
$ec_lang['lpn_fitting_entrance']='বর্গাকার প্রবেশপথ';
$ec_lang['lpn_fitting_exit']='প্রস্থান';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='অন্য ফিটিং';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='{file} সংরক্ষণ করা হয়েছে';
$ec_lang['lpn_inp_export_flat_lead']='রপ্তানি করা EPANET ফাইলটি এই প্রকল্পের সংখ্যাগতভাবে সমতুল্য। কিন্তু এতে নিম্নলিখিত জিনিসগুলোর কোনো স্থান নেই:';
$ec_lang['lpn_inp_export_flat_types']='এখানে {n}টি পাইপ {t}টি পাইপের ধরন নির্দেশ করে। ফাইলে ওই প্রতিটি পাইপ সংখ্যাগুলোর নিজস্ব একটি কপি বহন করে, তাই উত্তরগুলো একই থাকে। ফাইলটি যা ধরে রাখতে পারে না তা হলো পাইপের ধরনটি নিজেই, তাই একটি সংজ্ঞা সম্পাদনা করলে প্রতিটি পাইপ তা অনুসরণ করে — এমন কিছু শুধু আপনার নিজের প্রকল্প ফাইলেই রেকর্ড হয়।';
$ec_lang['lpn_inp_export_flat_coords']='একটি EPANET ফাইল প্রতিটি নোডের জন্য একটি অবস্থান ধরে রাখে। এই দৃশ্যকল্প তাদের মধ্যে {n}টিকে অন্য কোথাও বসায়, এবং ফাইলে সেই অবস্থানগুলোই থাকে। অন্য প্রতিটি দৃশ্যকল্প শুধু আপনার প্রকল্প ফাইলে তার নিজস্ব অবস্থান রাখে।';
$ec_lang['lpn_inp_export_flat_fittings']='একটি EPANET ফাইল আপনার প্রকল্প ফাইলের এলবো, ভালভ ও টি-এর তালিকা ধরে রাখতে পারে না। এখানে {n}টি পাইপের স্থানীয় ক্ষতি সহগ একটি ফিটিংস তালিকা থেকে যোগ করা হয়। মোটটি ফাইলে ঠিক যেমন আছে তেমনই যায়, তাই উত্তরগুলো সম্পর্কে কিছুই পরিবর্তিত হয় না।';
$ec_lang['lpn_library_controls']='নিয়ন্ত্রণ';
$ec_lang['lpn_library_controls_tip']='একটি নিয়ন্ত্রণ হলো একটি বাক্য, যা পানির স্তর, চাপ বা সময় কোনো শর্ত পূরণ করলে একটি লিংক খোলে বা বন্ধ করে, অথবা তাকে একটি সেটিং দেয়।';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='একটি প্যাটার্ন যোগ করুন';
$ec_lang['lpn_library_pattern_values']='গুণক';
$ec_lang['lpn_library_pattern_values_tip']='গুণকগুলো, ফাঁকা স্থান বা কমা দিয়ে আলাদা করা। আপনার কাছে থাকলে স্প্রেডশিট থেকে একটি কলাম পেস্ট করুন। তালিকাটি চালানো যতক্ষণ চলে ততক্ষণ পুনরাবৃত্ত হয়, তাই এটি পুরো চালানোটি ঢেকে রাখার দরকার নেই।';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n}টি গুণক, প্রতিটি {step} ব্যবধানে, {span} জুড়ে';
$ec_lang['lpn_library_pattern_none']='কোনো প্যাটার্ন নেই';
$ec_lang['lpn_settings_default_pattern']='চাহিদার শুরুর প্যাটার্ন';
$ec_lang['lpn_settings_default_pattern_tip']='যে কোনো জাংশনের নিজস্ব প্যাটার্ন না থাকলে এটি ব্যবহার করে।';
$ec_lang['lpn_library_control_add']='একটি নিয়ন্ত্রণ যোগ করুন';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='EPANET সিনট্যাক্স ব্যবহার করে একটি একক লাইনের নিয়ম। প্রকল্পের একক ধারাবাহিকভাবে ব্যবহার করুন। মূল শব্দগুলো (কীওয়ার্ড) অবশ্যই ইংরেজিতে হতে হবে। উদাহরণ: LINK 12 CLOSED IF NODE 23 ABOVE 20 (ট্যাংক 23-এর স্তর 20 ft ছাড়িয়ে গেলে Link 12 বন্ধ হয়ে যাবে); LINK 12 OPEN IF NODE 130 BELOW 30 (Node 130-এ চাপ 30 psi-এর নিচে নামলে Link 12 খুলে যাবে); LINK PUMP02 1.5 AT TIME 16 (সিমুলেশন শুরুর 16 ঘণ্টা পর PUMP02 পাম্পের আপেক্ষিক গতি 1.5-এ নির্ধারিত হয়); LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM (দুটি নিয়ম: পুরো সিমুলেশন জুড়ে Link 12 বারবার সকাল 10টায় বন্ধ এবং রাত 8টায় খোলা হয়)';
$ec_lang['lpn_library_control_ok']='✓ বোঝা গেছে';
$ec_lang['lpn_library_control_bad']='⚠ বোঝা যায়নি';
$ec_lang['lpn_library_control_missing']='⚠ এই নেটওয়ার্কে {id} নামে কিছু নেই';
$ec_lang['lpn_library_rules']='নিয়ম';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='একটি নিয়ম হলো একটি ছোট অনুচ্ছেদ যা একটি পানির স্তর, চাপ, প্রবাহ বা সময় আপনার নির্ধারিত মানে পৌঁছালে একটি লিংক খোলে বা বন্ধ করে, অথবা তাকে একটি সেটিং দেয়। নিয়ম একসাথে একাধিক জিনিস পরীক্ষা করতে পারে, এবং পরীক্ষা ব্যর্থ হলে কী করতে হবে তাও বলতে পারে।';
$ec_lang['lpn_library_rule_add']='একটি নিয়ম যোগ করুন';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='একটি নিয়ম, EPANET যে শব্দ ব্যবহার করে সেই শব্দে, প্রতি লাইনে একটি ধারা। প্রথম লাইন এটির নাম দেয়: RULE 1। তারপর একটি শর্ত: IF TANK 2 LEVEL BELOW 17.1। তারপর এ ব্যাপারে কী করতে হবে: THEN PUMP 9 STATUS IS OPEN। শেষ লাইন এটিকে র‍্যাঙ্ক দিতে পারে: PRIORITY 1। একাধিক জিনিস পরীক্ষা করতে AND বা OR লাইন যোগ করুন, এবং পরীক্ষা ব্যর্থ হলে কী করতে হবে বলতে ELSE লাইন যোগ করুন। একটি শর্ত একটি নোডে LEVEL, HEAD, GRADE, PRESSURE বা DEMAND পড়তে পারে, একটি লিংকে FLOW, STATUS বা SETTING, অথবা SYSTEM-এ TIME ও CLOCKTIME। এই প্রকল্প যে এককে দেখাচ্ছে সেই এককে সংখ্যাগুলো লিখুন; সেগুলো আপনার জন্য রূপান্তরিত হয়। মূল শব্দগুলো ইংরেজিতেই রাখুন; এগুলোই এই পৃষ্ঠা ও EPANET পড়ে।';
$ec_lang['lpn_library_rule_ok']='✓ এই নিয়মটি পড়া হয়েছে';
$ec_lang['lpn_library_rule_bad']='⚠ এই নিয়মটি পড়া যায়নি';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='মূল চাহিদা';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='প্রদর্শিত সময় ধাপে এই নোড যে প্রবাহ টানে: প্রতিটি মূল চাহিদা তার নিজস্ব প্যাটার্ন দিয়ে গুণ করে যোগ করা হয়। এটি হিসাব করা, টাইপ করা নয়, তাই এটি ঘড়ির সাথে পরিবর্তিত হয় এবং সম্পাদনা করা যায় না।';
$ec_lang['lpn_field_demand_pattern']='চাহিদার প্যাটার্ন';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='বিবরণ';
$ec_lang['lpn_demand_add']='চাহিদা শ্রেণি যোগ করুন';
$ec_lang['lpn_demand_remove']='এই চাহিদা সরান';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='জলশীর্ষের প্যাটার্ন';
$ec_lang['lpn_field_head_pattern_tip']='এই জলাধারের পানির স্তর চালানোর সময় কীভাবে ওঠানামা করে। উপরের জলশীর্ষকে প্যাটার্ন দিয়ে গুণ করা হয়।';
$ec_lang['lpn_field_pump_speed']='আপেক্ষিক গতি';
$ec_lang['lpn_field_pump_speed_tip']='১ মানে এই পাম্প তার কার্ভ যে গতিতে পরিমাপ করা হয়েছিল সেই গতিতে ঘুরছে। ০.৯ মানে একই পাম্প ধীরে ঘুরছে, যা এটি যোগ করা জলশীর্ষ ও পার হওয়া প্রবাহ কমিয়ে দেয়। চালানো চলাকালীন এই সংখ্যার জায়গা একটি গতির প্যাটার্ন নিয়ে নেয়।';
$ec_lang['lpn_field_speed_pattern']='গতির প্যাটার্ন';
$ec_lang['lpn_field_speed_pattern_tip']='এই পাম্পের গতি চালানো জুড়ে কীভাবে ওঠানামা করে। প্রতিটি গুণক সেই সময়ের আপেক্ষিক গতি, এবং এটি স্কেল না করে গতি সেটিংটিকে প্রতিস্থাপন করে, তাই ০ গুণক পাম্পটি থামিয়ে দেয়।';

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
$ec_lang['lpn_search_menu']='নাম দিয়ে একটি জায়গা খুঁজুন…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='নাম দিয়ে একটি শহর, ঠিকানা বা চিহ্নিত স্থান খুঁজুন এবং মানচিত্রটি সেখানে নিয়ে যান। প্রথমবার ব্যবহার করলে এটি আপনার অনুমতি চায়, কারণ আপনি যে শব্দ লেখেন তা OpenStreetMap-এর স্থান-নাম সেবায় যায়।';
$ec_lang['lpn_search_bar']='নাম দিয়ে খুঁজুন…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='নাম দিয়ে খোঁজার সময় আপনি যে শব্দ লেখেন তা nominatim.openstreetmap.org-এ পাঠানো হয়, যা OpenStreetMap Foundation-এর একটি বিনামূল্যের স্থান-নাম সেবা।';
$ec_lang['lpn_search_consent_2']='এটি আপনার প্রকল্পের পেছনের রাস্তার মানচিত্র চিত্র থেকে আলাদা একটি সেবা। সেই চিত্রগুলো শুধু বলে আপনি কোথায় দেখছেন। একটি খোঁজ বলে আপনি কী লিখেছেন। স্থান-নাম সেবাটি আপনার খোঁজার শব্দ ও আপনার IP ঠিকানা পাবে। আমরা আর কিছু পাঠাই না, এবং আপনার খোঁজের কোনো রেকর্ড রাখি না।';
$ec_lang['lpn_search_consent_3']='আমরা কি আপনার খোঁজগুলো স্থান-নাম সেবায় পাঠাতে পারি?';
$ec_lang['lpn_search_consent_4']='আপনি না বললে, এই পাতার বাকি সবকিছু এখন যেমন কাজ করছে ঠিক তেমনই কাজ করতে থাকবে, একটি অক্ষাংশ ও দ্রাঘিমাংশে যান সহ। আমরা একটি হ্যাঁ মনে রাখি যাতে আবার জিজ্ঞাসা করতে না হয়। একটি না মোটেও সংরক্ষণ করা হয় না।';
$ec_lang['lpn_search_refused']='স্থান-নাম খোঁজ বন্ধ আছে, এবং কিছু পাঠানো হয়নি। আপনি এখনও একটি অক্ষাংশ ও দ্রাঘিমাংশে যান ব্যবহার করতে পারেন।';
$ec_lang['lpn_search_prompt']='নাম দিয়ে একটি জায়গা খুঁজুন। একটি শহর, রাস্তা, চিহ্নিত স্থান — উদাহরণস্বরূপ: Petaluma, California';
$ec_lang['lpn_search_empty']='খোঁজার জন্য একটি জায়গার নাম লিখুন।';
$ec_lang['lpn_search_working']='খোঁজা হচ্ছে…';
$ec_lang['lpn_search_busy']='একটি খোঁজ ইতিমধ্যে চলছে। এর উত্তরের জন্য অপেক্ষা করুন।';
$ec_lang['lpn_search_choose']='একাধিক জায়গা মিলেছে। কোনটি?';
$ec_lang['lpn_search_nochoice']='কিছুই বেছে নেওয়া হয়নি, তাই মানচিত্র সরেনি।';
$ec_lang['lpn_search_badchoice']='এটি তালিকার সংখ্যাগুলোর একটি নয়।';
$ec_lang['lpn_search_none']='সেই নামে কিছু পাওয়া যায়নি।';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='স্থান-নাম সেবাটি আমাদের ধীরে চলতে বলছে। এক মিনিট অপেক্ষা করে আবার চেষ্টা করুন।';
$ec_lang['lpn_search_http']='স্থান-নাম সেবাটি একটি ত্রুটি দিয়ে উত্তর দিয়েছে।';
$ec_lang['lpn_search_timeout']='স্থান-নাম সেবাটি সময়মতো উত্তর দেয়নি। এই পাতার বাকি সবকিছু এটি ছাড়াই কাজ করে।';
$ec_lang['lpn_search_unreadable']='স্থান-নাম সেবাটি এমন কিছু দিয়ে উত্তর দিয়েছে যা এই পাতা পড়তে পারেনি।';
$ec_lang['lpn_search_offline']='আমরা স্থান-নাম সেবাটিতে পৌঁছাতে পারিনি। আপনি হয়তো অফলাইনে আছেন। এই পাতার বাকি সবকিছু এটি ছাড়াই কাজ করে, একটি অক্ষাংশ ও দ্রাঘিমাংশে যান সহ।';
$ec_lang['lpn_search_toofast']='প্রতি সেকেন্ডে একটি খোঁজ — স্থান-নাম সেবাটি এতটুকুই অনুমতি দেয়। একটু পরে আবার চেষ্টা করুন।';
$ec_lang['lpn_search_nofetch']='এই ব্রাউজার স্থান-নাম সেবাটিতে পৌঁছাতে পারে না।';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox এটি অনেক পাবলিক উচ্চতা ডেটাসেট থেকে একত্র করে, তাই এটি কতটা ভালো তা সম্পূর্ণভাবে আপনি কোথায় আছেন তার উপর নির্ভর করে। যেখানে একটি জাতীয় লিডার জরিপ আছে, যেমন যুক্তরাষ্ট্রের অধিকাংশ জায়গায় USGS 3DEP ও অন্যত্র তার সমতুল্যগুলো, সেখানে এটি অনুভূমিকভাবে এক মিটারের চেয়ে এবং উল্লম্বভাবে কয়েক দশমাংশ মিটারের চেয়ে ভালো হতে পারে। যেখানে শুধু বৈশ্বিক তথ্য আছে সেখানে এটি অনুভূমিকভাবে প্রায় ৩০ মিটার এবং উল্লম্বভাবে কয়েক মিটার। Mapbox আমাদের বলে না আপনি কোনটি পেয়েছেন। এটিকে একটি জরিপ নয়, বরং একটি কন্টুর মানচিত্র হিসেবে ধরুন: আপনি যার উপর নির্ভর করছেন তা যাচাই করে নিন।';
$ec_lang['lpn_terrain_consent_1']='উচ্চতা পূরণ করলে, যে প্রতিটি নোডের একটি উচ্চতা দরকার তার অবস্থান — এর অক্ষাংশ ও দ্রাঘিমাংশ — api.mapbox.com-এ পাঠানো হয়, সেখানকার ভূমির উচ্চতা জানতে।';
$ec_lang['lpn_terrain_consent_2']='এটি আপনার প্রকল্পের পেছনের মানচিত্র চিত্র থেকে আলাদা একটি বিষয়। সেই চিত্রগুলো শুধু বলে আপনি কোথায় দেখছেন। এই অবস্থানগুলো হলো আপনার নেটওয়ার্ক নিজেই। Mapbox সেই স্থানাঙ্ক ও আপনার IP ঠিকানা পাবে। আমরা আর কিছু পাঠাই না: কোনো নাম নয়, কোনো পাইপ নয়, কোনো প্রকল্প নয়। আমরা এর কোনো রেকর্ড রাখি না, এবং এই প্রশ্নের আপনার উত্তর ছাড়া এই ডিভাইসে কিছুই সংরক্ষণ করা হয় না।';
$ec_lang['lpn_terrain_consent_3']='আমরা কি আপনার নোডগুলোর অবস্থান Mapbox-এ পাঠাতে পারি?';
$ec_lang['lpn_terrain_consent_4']='আপনি না বললে, এই পাতার বাকি সবকিছু এখন যেমন কাজ করছে ঠিক তেমনই কাজ করতে থাকবে, এবং আপনি আগের মতোই নিজে উচ্চতা লিখতে পারবেন। আমরা একটি হ্যাঁ মনে রাখি যাতে আবার জিজ্ঞাসা করতে না হয়। একটি না মোটেও সংরক্ষণ করা হয় না।';
$ec_lang['lpn_terrain_refused']='উচ্চতা পূরণ করা হয়নি, এবং কিছু পাঠানো হয়নি। আপনি আগের মতোই সেগুলো লিখতে পারেন।';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Mapbox DEM থেকে {n}টি নোডের উচ্চতা পূরণ করবেন?';
$ec_lang['lpn_terrain_confirm_default_1']='প্রতিটি নোডের ইতিমধ্যে একটি উচ্চতা আছে, এবং তাদের মধ্যে {n}টি এখনও {v}-তে আছে, যা আপনি লেখা কোনো মান নয় বরং একটি নতুন নোড যে উচ্চতা নিয়ে শুরু হয় সেটি।';
$ec_lang['lpn_terrain_confirm_default_2']='সেই {n}টি নোডের উচ্চতা Mapbox DEM-এর মান দিয়ে প্রতিস্থাপন করবেন?';
$ec_lang['lpn_terrain_keep']='{k}টি নোডের ইতিমধ্যে একটি উচ্চতা আছে এবং সেগুলো স্পর্শ করা হবে না।';
$ec_lang['lpn_terrain_undo']='একবার পূর্বাবস্থায় ফেরান (Ctrl-Z) সবগুলোই ফিরিয়ে আনে।';
$ec_lang['lpn_terrain_requests']='{n}টি অনুরোধ api.mapbox.com-এ।';
$ec_lang['lpn_terrain_busy']='উচ্চতা ইতিমধ্যে পূরণ করা হচ্ছে। এর জন্য অপেক্ষা করুন।';
$ec_lang['lpn_terrain_offmap']='এই নোডগুলোর অবস্থান ভূমিরূপ মানচিত্রের মধ্যে নেই, তাই কিছু পাঠানো হয়নি।';
$ec_lang['lpn_terrain_too_wide']='এই নোডগুলো পৃথিবীর এত বড় অংশ জুড়ে ছড়িয়ে আছে যে একবারে পড়া যায় না ({n}টি টাইল অনুরোধ)। কিছু পাঠানো হয়নি।';
$ec_lang['lpn_terrain_cancelled']='কিছু পরিবর্তিত হয়নি এবং কিছু পাঠানো হয়নি।';
$ec_lang['lpn_terrain_nofetch']='এই ব্রাউজার ভূমিরূপ সেবাটিতে পৌঁছাতে পারে না।';
$ec_lang['lpn_terrain_working']='ভূমির স্তর পড়া হচ্ছে…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='ভূমিরূপ সেবাটি অনুরোধ প্রত্যাখ্যান করেছে ({status}), তাই কোনো উচ্চতা পরিবর্তিত হয়নি। এই সাইটটি যে Mapbox টোকেন ব্যবহার করে তা আপনি যে ওয়েব ঠিকানায় আছেন তা অনুমোদন নাও করতে পারে।';
$ec_lang['lpn_terrain_failed']='আমরা ভূমিরূপ সেবাটিতে পৌঁছাতে পারিনি, তাই কোনো উচ্চতা পরিবর্তিত হয়নি। আপনি হয়তো অফলাইনে আছেন। এই পাতার বাকি সবকিছু এটি ছাড়াই কাজ করে।';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='ভূভাগ পরিষেবা আমাদের ধীর হতে বলছে (429), তাই কোনো উচ্চতা পরিবর্তিত হয়নি। এক মিনিট পর আবার চেষ্টা করুন।';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='ভূভাগ পরিষেবা একটি ত্রুটি ({status}) দিয়ে উত্তর দিয়েছে, তাই কোনো উচ্চতা পরিবর্তিত হয়নি। আপনার নেটওয়ার্কে কোনো সমস্যা নেই।';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='সেই নোডগুলোর কোনোটিরই পৃথিবীতে অবস্থান নেই, তাই কিছুই পাঠানো হয়নি এবং কোনো উচ্চতা পরিবর্তিত হয়নি। ভূপৃষ্ঠ পড়তে অক্ষাংশ ও দ্রাঘিমাংশে একটি প্রকল্প প্রয়োজন, অথবা এমন একটি প্রক্ষেপণে যা এই পৃষ্ঠা বসাতে পারে।';
$ec_lang['lpn_terrain_done']='{n}টি উচ্চতা পূরণ করা হয়েছে।';
$ec_lang['lpn_terrain_missed']='{m}টি পড়া যায়নি এবং এখনও ফাঁকা আছে।';
$ec_lang['lpn_terrain_partial']='{f}টি ভূমিরূপ টাইল উত্তর দেয়নি।';
$ec_lang['lpn_terrain_will_ids']='এই নোডগুলো একটি উচ্চতা পাবে: {ids}';
$ec_lang['lpn_terrain_keep_ids']='সেই নোডগুলো হলো: {ids}';
$ec_lang['lpn_terrain_filled_ids']='এই নোডগুলো একটি উচ্চতা পেয়েছে: {ids}';
$ec_lang['lpn_terrain_blank_ids']='এই নোডগুলোর এখনও কোনো উচ্চতা নেই: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, এবং আরও {n}টি';

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
$ec_lang['lpn_ff_menu']='অগ্নিনির্বাপণ প্রবাহ বিশ্লেষণ…';
$ec_lang['lpn_ff_menu_tip']='সংযোগস্থলগুলো একে একে পরীক্ষা করুন: আপনার নির্ধারিত অবশিষ্ট চাপ ধরে রেখে প্রতিটি কতটা সরবরাহ করতে পারে, এবং সেখানে প্রয়োজনীয় প্রবাহ টানলে অন্য কিছু সীমার বাইরে চলে যায় কিনা।';
$ec_lang['lpn_ff_title']='অগ্নিনির্বাপণ প্রবাহ বিশ্লেষণ';
$ec_lang['lpn_ff_intro']='প্রতিটি সংযোগস্থলকে পালাক্রমে তার বিদ্যমান চাহিদার উপর একটি অগ্নিনির্বাপণ প্রবাহ টানতে বলা হয়। আপনার প্রকল্পে কিছুই পরিবর্তিত হয় না; পুরো রানটি একটি কপিতে করা হয়।';
$ec_lang['lpn_ff_scope']='যেসব সংযোগস্থল পরীক্ষা করতে হবে';
$ec_lang['lpn_ff_all']='সব';
$ec_lang['lpn_ff_selected']='নির্বাচিত';
$ec_lang['lpn_ff_no_junctions']='এই প্রকল্পে এখনও কোনো সংযোগস্থল নেই, তাই পরীক্ষা করার মতো কিছু নেই।';
$ec_lang['lpn_ff_no_selection']='কোনো সংযোগস্থল নির্বাচিত নেই। সংযোগস্থল নির্বাচন করুন, অথবা সব সংযোগস্থল বেছে নিন।';
$ec_lang['lpn_ff_skipped']='{n}টি নির্বাচিত উপাদান জাংশন নয়, তাই সেগুলো পরীক্ষা করা হয়নি।';
$ec_lang['lpn_ff_required']='প্রয়োজনীয় অগ্নিনির্বাপণ প্রবাহ';
$ec_lang['lpn_ff_required_tip']='আপনার ফায়ার কোড বা ফায়ার কর্তৃপক্ষ একটি হাইড্রেন্টে যে প্রবাহ দাবি করে। প্রতিটি সংযোগস্থল এই সংখ্যার বিপরীতে পরীক্ষা করা হয়, যদি না এর নিজস্ব একটি প্রয়োজনীয় অগ্নিনির্বাপণ প্রবাহ থাকে।';
$ec_lang['lpn_ff_required_node_tip']='এই নির্দিষ্ট সংযোগস্থলে যে অগ্নিনির্বাপণ প্রবাহ প্রয়োজন, এটি যে ভূমি ব্যবহারের সেবা দেয় তার জন্য, আপনার ফায়ার কোড বা ফায়ার কর্তৃপক্ষের কাছ থেকে। এটি খালি রাখলে সংযোগস্থলটি অগ্নিনির্বাপণ প্রবাহ বিশ্লেষণ বাক্সের সংখ্যার বিপরীতে পরীক্ষা করা হয়।';
$ec_lang['lpn_ff_residual']='ধরে রাখতে হবে এমন অবশিষ্ট চাপ';
$ec_lang['lpn_ff_residual_tip']='অগ্নিনির্বাপণ প্রবাহ সরবরাহ করার সময়ও সংযোগস্থলটিকে যে চাপ ধরে রাখতে হবে। AWWA M31 ও NFPA 291-এ ২০ psi (১৪০ kPa) ব্যবহার করা হয়।';
$ec_lang['lpn_ff_design']='ডিজাইন যাচাই (সিস্টেমে প্রভাব)';
$ec_lang['lpn_ff_design_tip']='সংযোগস্থলটি প্রবাহ সরবরাহ করতে পারে কিনা তার থেকে ভিন্ন একটি প্রশ্ন: সেখানে সেই প্রবাহ টানলে, অন্য কিছু কি তার সর্বনিম্ন চাপের নিচে নেমে যায় বা তার বেগ সীমা ছাড়িয়ে যায়? এটি পরীক্ষা করতে বেছে নিলে কোনো অতিরিক্ত হিসাব লাগে না।';
$ec_lang['lpn_ff_design_no_selection']='ডিজাইন যাচাইয়ের পরিসর নির্বাচিত-তে সেট করা আছে, কিন্তু কোনো উপাদান নির্বাচিত নেই। উপাদান নির্বাচন করুন, অথবা সব বিকল্পটি নির্বাচন করুন।';

$ec_lang['lpn_ff_minpressure']='অন্যত্র অনুমোদিত সর্বনিম্ন চাপ';
$ec_lang['lpn_ff_minpressure_tip']='অন্য একটি সংযোগস্থল তার অগ্নিনির্বাপণ প্রবাহ টানার সময় যে সংযোগস্থল এর নিচে নেমে যায় তা একটি ডিজাইন সমস্যা হিসেবে প্রতিবেদন করা হয়।';
$ec_lang['lpn_ff_maxvelocity']='অনুমোদিত সর্বোচ্চ বেগ';
$ec_lang['lpn_ff_maxvelocity_tip']='অগ্নিনির্বাপণ প্রবাহ টানার সময় এর উপরে চলা একটি পাইপ একটি ডিজাইন সমস্যা হিসেবে প্রতিবেদন করা হয়।';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='অগ্নিনির্বাপণ প্রবাহ সংযোগস্থল থেকেই টানা হয়। এখানে এই পদ্ধতিটি ব্যবহার করা হয়, এবং এটিই প্রচলিত পদ্ধতি। হাইড্রেন্ট, এর সংযোগ পাইপ ও এর নজল মডেল করা হয় না, তাই একটি বাস্তব হাইড্রেন্ট এখানে দেখানো প্রবাহের চেয়ে কম সরবরাহ করে।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='বিল্ট-ইন সমাধানকারী ব্যবহৃত হয়।';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='এটি EPANET ইঞ্জিন ব্যবহৃত হয়।';
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
$ec_lang['lpn_ff_run_title']='অগ্নিনির্বাপণ প্রবাহ রান';
$ec_lang['lpn_ff_calculate']='রান করুন';
$ec_lang['lpn_ff_stop']='থামুন';
$ec_lang['lpn_ff_working']='কাজ চলছে: {total}টির মধ্যে {done}টি সংযোগস্থল।';
$ec_lang['lpn_ff_stopped']='{total}টির মধ্যে {done}টি সংযোগস্থলের পর থামানো হয়েছে। নিচের ফলাফলগুলো যেগুলো ইতিমধ্যে শেষ হয়েছে।';
$ec_lang['lpn_ff_cost']='এই রানটি পুরো নেটওয়ার্ক {solves} বার সমাধান করেছে।';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='অঙ্কনটি পরিবর্তিত হয়েছে, তাই অগ্নিনির্বাপণ প্রবাহের ফলাফল মুছে ফেলা হয়েছে। এটি আবার রান করুন।';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='রিং পরিষ্কার করুন';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean}টি সংযোগস্থলে কোনো সমস্যা ছিল না। {fire}টি সংযোগস্থল অগ্নিনির্বাপণ প্রবাহে ব্যর্থ হয়েছে। {design}টি সংযোগস্থল সিস্টেমের বাকি অংশে প্রভাব ফেলেছে।';
$ec_lang['lpn_ff_summary_error']='{n}টি সংযোগস্থলের উত্তর পাওয়া যায়নি।';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='প্রতিটি পরীক্ষিত সংযোগস্থল';
$ec_lang['lpn_ff_col_junction']='সংযোগস্থল';
$ec_lang['lpn_ff_col_static']='স্থির চাপ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='কোনো অগ্নিনির্বাপণ প্রবাহ টানার আগে এই সংযোগস্থলে চাপ, সিস্টেমের সাধারণ চাহিদা তখনও চলমান অবস্থায়। এটি মাপার জন্য কিছু বন্ধ করা হয় না, তাই এটি সিস্টেমের জন্য শূন্য-প্রবাহ চাপ নয়; এটি সেই একই চাপ যা মানচিত্র এই সংযোগস্থলে দেখায়। AWWA M31 ও NFPA 291 উভয়ই এই পাঠকে স্থির চাপ বলে, এবং এখান থেকেই একটি অগ্নিনির্বাপণ প্রবাহ পরীক্ষা শুরু হয়।';
$ec_lang['lpn_ff_col_available']='উপলভ্য প্রবাহ';
$ec_lang['lpn_ff_col_required']='প্রয়োজনীয় প্রবাহ';
$ec_lang['lpn_ff_col_residual']='অবশিষ্ট চাপ';
$ec_lang['lpn_ff_col_atrequired']='প্রয়োজনীয় প্রবাহে চাপ';
$ec_lang['lpn_ff_col_affected']='সবচেয়ে খারাপ প্রভাব';
$ec_lang['lpn_ff_col_limit']='ডিজাইন সীমা';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='যাচাই করা হয়নি';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='স্থির চাপ ব্যর্থ, তাই যাচাই করা হয়নি';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='ব্যর্থতার ধরন';
$ec_lang['lpn_ff_mode_fire']='অগ্নি';
$ec_lang['lpn_ff_mode_design']='ডিজাইন';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='নেই';
$ec_lang['lpn_ff_col_solves']='রান';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='চাপ ও বেগ';
$ec_lang['lpn_ff_atleast']='{flow}-এর বেশি';
$ec_lang['lpn_ff_affect_node']='{id} নেমে {pressure}-এ যায়';
$ec_lang['lpn_ff_affect_link']='{id} {velocity}-এ পৌঁছায়';
$ec_lang['lpn_ff_more']='এবং আরও {n}টি প্রভাবিত';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='দেখানো হয়নি এমন সংযোগস্থল: {n}।';
$ec_lang['lpn_ff_design_none']='কোনো সংযোগস্থল তার অগ্নিনির্বাপণ প্রবাহ টানার সময় নির্বাচিত সেটের কিছুই তার সীমার বাইরে যায়নি।';
$ec_lang['lpn_ff_design_off_note']='এই রানে সিস্টেমের বাকি অংশে প্রভাব যাচাই করা হয়নি।';
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
$ec_lang['lpn_ff_iso']='ইন্স্যুরেন্স সার্ভিসেস অফিস (ISO) একটি একক হাইড্রেন্টকে সর্বোচ্চ {flow} কৃতিত্ব দেয়। সেই সীমা এখানে প্রয়োগ করা হয়নি, কারণ একটি নোড কতগুলো হাইড্রেন্ট প্রতিনিধিত্ব করতে পারে তা আমরা জানি না।';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='কোনো অগ্নিনির্বাপণ প্রবাহ টানার আগেই অবশিষ্ট চাপের নিচে';
$ec_lang['lpn_ff_err_converge']='নেটওয়ার্কটি কনভার্জ করেনি।';
$ec_lang['lpn_ff_err_solve']='সমাধানকারী একটি ত্রুটির প্রতিবেদন করেছে এবং কোনো উত্তর দেয়নি।';
$ec_lang['lpn_ff_err_not_junction']='সংযোগস্থল নয়';
$ec_lang['lpn_ff_err_unknown']='কোনো উত্তর নেই। যে কোড প্রতিবেদন করা হয়েছে তা হলো {code}।';

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
$ec_lang['lpn_file_import_survey']='জরিপকৃত বিন্দু ইম্পোর্ট করুন…';
$ec_lang['lpn_file_import_survey_tip']='একটি টেক্সট ফাইল থেকে জরিপকৃত বিন্দুর একটি তালিকা পড়ে এবং প্রতিটি বিন্দুতে একটি জাংশন তৈরি করে, ফাইলটি যা বলে না তার জন্য নতুন-উপাদানের শুরুর মান নিয়ে। কোনো পাইপ আঁকা হয় না, এবং কোনো সারি কখনো নামকরণ ছাড়া বাদ দেওয়া হয় না। এটি এই প্রকল্প ইতিমধ্যে ব্যবহার করা স্থানাঙ্ক পদ্ধতি পড়ে, জিওরেফারেন্সড হোক বা না হোক।';
$ec_lang['lpn_survey_read_error']='সেই ফাইলটি আপনার ডিস্ক থেকে পড়া যায়নি।';
$ec_lang['lpn_survey_cancelled']='কিছুই তৈরি করা হয়নি এবং কিছুই পরিবর্তিত হয়নি।';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='নর্দিং';
$ec_lang['lpn_survey_axis_east']='ইস্টিং';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='সেই ফাইলে কিছুই নেই।';
$ec_lang['lpn_survey_err_unreadable']='সেই ফাইলটি জরিপকৃত বিন্দু তালিকা হিসেবে পড়া যায়নি।';
$ec_lang['lpn_survey_err_ambiguous_coord']='সেই ফাইলের একাধিক কলাম {axis} ({detail}) হতে পারে, এবং এই পৃষ্ঠা তাদের মধ্যে বেছে নেবে না। তাদের একটিকে {axis} নামে রেখে আবার চেষ্টা করুন।';
$ec_lang['lpn_survey_err_no_points']='সেই ফাইলের একটি সারিও জরিপকৃত বিন্দু হিসেবে পড়া যায়নি। পড়া সারি: {detail}';
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
$ec_lang['lpn_survey_format_label']='ফাইল ফরম্যাট:';
$ec_lang['lpn_survey_format_internal']='অভ্যন্তরীণভাবে নির্দিষ্ট';
$ec_lang['lpn_survey_create']='নোড তৈরি করুন';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='প্রথম লাইনটি বাদ দেওয়া হয়েছে: এটি এই পৃষ্ঠা জানে এমন কোনো কলামের নাম দেয় না।';
$ec_lang['lpn_survey_type_label']='উপাদানের ধরন:';
$ec_lang['lpn_survey_confirm_junction']='{n}টি জাংশন পাওয়া গেছে। এগিয়ে যাবেন?';
$ec_lang['lpn_survey_confirm_reservoir']='{n}টি জলাধার পাওয়া গেছে। এগিয়ে যাবেন?';
$ec_lang['lpn_survey_confirm_tank']='{n}টি ট্যাংক পাওয়া গেছে। এগিয়ে যাবেন?';
$ec_lang['lpn_survey_report_junction']='{n}টি জাংশন ইম্পোর্ট করা হয়েছে, {m}টি উচ্চতাসহ।';
$ec_lang['lpn_survey_report_reservoir']='{n}টি জলাধার ইম্পোর্ট করা হয়েছে, {m}টি উচ্চতাসহ।';
$ec_lang['lpn_survey_report_tank']='{n}টি ট্যাংক ইম্পোর্ট করা হয়েছে, {m}টি উচ্চতাসহ।';
$ec_lang['lpn_survey_report_clean']='ফাইলের প্রতিটি বিন্দু এসেছে, এবং আসার পথে কিছুই পরিবর্তিত হয়নি।';
$ec_lang['lpn_survey_report_notes']='ইম্পোর্ট ত্রুটি ও নোট:';
$ec_lang['lpn_survey_sev_error']='ত্রুটি';
$ec_lang['lpn_survey_sev_warning']='সতর্কতা';
$ec_lang['lpn_survey_note_line']='লাইন {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='উপরের ফাইল ফরম্যাটের জন্য খুবই কম কলাম।';
$ec_lang['lpn_survey_note_coord_missing']='{axis} কক্ষটি খালি।';
$ec_lang['lpn_survey_note_bad_coord']='{axis} একটি সংখ্যা হিসেবে পড়া যায় না।';
$ec_lang['lpn_survey_note_coord_range']='{axis} এই প্রকল্পের অনুমোদিত সীমার বাইরে।';
$ec_lang['lpn_survey_note_bad_elev']='অ-সাংখ্যিক উচ্চতা। উচ্চতা ছাড়া ইম্পোর্ট করা হয়েছে।';
$ec_lang['lpn_survey_note_ambiguous_elev']='একাধিক কলাম উচ্চতা হতে পারে, তাই তাদের কোনোটিই পড়া হয়নি।';
$ec_lang['lpn_survey_note_blank_rows']='খালি লাইন বাদ দেওয়া হয়েছে: {detail}।';
$ec_lang['lpn_survey_note_id_duplicate']='নামটি এই ফাইলে আগেই ব্যবহৃত হয়েছে, নতুন নাম নির্ধারণ করা হয়েছে।';
$ec_lang['lpn_survey_note_id_taken']='নামটি ইতিমধ্যে প্রকল্পে আছে, নতুন নাম নির্ধারণ করা হয়েছে।';
$ec_lang['lpn_survey_note_id_invalid']='নামটি এখানে ব্যবহার করা যায় না, নতুন নাম নির্ধারণ করা হয়েছে।';
$ec_lang['lpn_hotkeys_menu_heading']='মেনু';
$ec_lang['lpn_hotkeys_menu_term']='মেনুর কীবোর্ড শর্টকাট';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+অক্ষর</td><td>সেই অক্ষরের মেনুটি খুলুন, তারপর কোনো সারি বেছে নিতে তার অক্ষরটি চাপুন। কীবোর্ড ব্যবহারের সময় অক্ষরগুলো দেখা যায়। Mac-এ Ctrl+Option ব্যবহার করুন।</td></tr><tr><td>F10</td><td>মেনু বারে যান।</td></tr></tbody></table>';
$ec_lang['lpn_graphs_menu']='গ্রাফ';
$ec_lang['lpn_contour_menu']='কনটুর';
$ec_lang['lpn_contour_tip']='মানচিত্রে একটি কনটুর প্লট দেখান: নোডের রংগুলো পাইপ বরাবর ও তার পাশে ছড়িয়ে পড়ে, সাথে লেবেলযুক্ত কনটুর রেখা। এটি ঠিক করতে বা বন্ধ করতে একটি বাক্স খোলে।';
$ec_lang['lpn_contour_plot']='কনটুর প্লট';
$ec_lang['lpn_contour_fill']='ভরাট';
$ec_lang['lpn_contour_fill_tip']='মসৃণ এক শ্রেণি থেকে পরের শ্রেণিতে রংগুলো মিশিয়ে দেয়। ব্যান্ড রঙের কী-এর প্রতিটি শ্রেণিকে সমতলভাবে রাঙায়।';
$ec_lang['lpn_contour_fill_smooth']='মসৃণ';
$ec_lang['lpn_contour_fill_bands']='ব্যান্ড';
$ec_lang['lpn_contour_opacity']='ভরাটের অস্বচ্ছতা';
$ec_lang['lpn_contour_lines']='কনটুর রেখা';
$ec_lang['lpn_contour_interval']='ব্যবধান';
$ec_lang['lpn_contour_buffer']='বাফার';
$ec_lang['lpn_contour_buffer_unit']='× পাইপের মধ্যক দৈর্ঘ্য';
$ec_lang['lpn_contour_buffer_tip']='রংটি প্রতিটি পাইপ থেকে কতদূর পৌঁছায়, পাইপের মধ্যক দৈর্ঘ্যের গুণিতক হিসেবে। বাইরের অংশে এটি ক্রমশ মিলিয়ে যায়।';
$ec_lang['lpn_contour_few']='কনটুর আঁকার জন্য নোড খুব কম।';
$ec_lang['lpn_contour_support']='কনটুর প্লট: {n}টি নোড, {p}টি পাইপ বরাবর এবং তাদের পাশে পাইপের মধ্যক দৈর্ঘ্যের {k} গুণ পর্যন্ত ইন্টারপোলেট করা হয়েছে। পাম্প, ভালভ বা বন্ধ লিংকের ওপর দিয়ে কোনো রং নেই।';
$ec_lang['lpn_contour_support_lines']='প্রতি {i} {u} অন্তর কনটুর রেখা।';
$ec_lang['lpn_contour_too_many']='এই ব্যবধানে কনটুর রেখা অনেক বেশি; আঁকতে ব্যবধান বাড়ান।';
$ec_lang['lpn_contour_dem']='নোডগুলোর মাঝের ভূমি Mapbox DEM থেকে';
$ec_lang['lpn_contour_dem_tip']='নোডগুলোর মাঝখানে চাপ হয়ে যায় ইন্টারপোলেট করা হেড বিয়োগ Mapbox DEM থেকে পাওয়া ভূমির উচ্চতা, তাই যে পাহাড়ে নেটওয়ার্কের কোনো নোড নেই সেখানে এটি সর্বনিম্ন নোড চাপের নিচে নামতে পারে। ভূমিকে কনটুর মানচিত্র হিসেবে ধরুন, জরিপ হিসেবে নয়।';
$ec_lang['lpn_contour_support_dem']='নোডগুলোর মাঝখানে চাপ হলো ইন্টারপোলেট করা হেড বিয়োগ Mapbox DEM থেকে পাওয়া ভূমির উচ্চতা, প্রায় প্রতি {m} মিটারে নমুনা নেওয়া।';
$ec_lang['lpn_contour_dem_failed']='Mapbox DEM থেকে ভূমি পড়া যায়নি, তাই চাপ শুধু নোডগুলোর মাঝে ইন্টারপোলেট করা হয়েছে।';
$ec_lang['lpn_contour_consent_1']='ভূমির ওপর চাপ আঁকতে আপনার নেটওয়ার্ক যে এলাকা জুড়ে আছে তা Mapbox মানচিত্র টাইলের নম্বর হিসেবে api.mapbox.com-এ পাঠানো হয়, সেখানকার ভূমির উচ্চতা পড়ার জন্য।';
$ec_lang['lpn_contour_consent_2']='এটি আপনার প্রকল্পের পেছনের মানচিত্রের ছবিগুলোর থেকে আলাদা প্রশ্ন। ছবিগুলো কেবল বলে আপনি কোথায় তাকিয়ে আছেন। এই টাইলগুলো বলে আপনার নেটওয়ার্ক কোথায়। Mapbox সেই টাইল নম্বর এবং আপনার IP ঠিকানা পাবে। আমরা আর কিছু পাঠাই না: কোনো নাম নয়, কোনো পাইপ নয়, কোনো প্রকল্প নয়। আমরা এর কোনো রেকর্ড রাখি না, এবং এই ডিভাইসে এই প্রশ্নের আপনার উত্তর ছাড়া আর কিছু সংরক্ষিত হয় না।';
$ec_lang['lpn_contour_consent_3']='আমরা কি আপনার নেটওয়ার্কের এলাকার টাইল নম্বর Mapbox-কে পাঠাতে পারি?';
$ec_lang['lpn_contour_consent_4']='আপনি না বললে, এই পৃষ্ঠার বাকি সবকিছু এখনকার মতোই ঠিকঠাক কাজ করবে, এবং কনটুর প্লট শুধু নোডগুলোর মাঝে আঁকা হবে। আমরা হ্যাঁ উত্তরটি মনে রাখি, যাতে আবার জিজ্ঞেস করতে না হয়। না উত্তরটি একেবারেই সংরক্ষিত হয় না।';
$ec_lang['lpn_sysflow_menu']='প্রবাহের ভারসাম্য';
$ec_lang['lpn_sysflow_tip']='বর্ধিত সময়কাল সিমুলেশন জুড়ে সময়ের বিপরীতে মোট উৎপাদিত প্রবাহ ও মোট ব্যবহৃত প্রবাহ গ্রাফে দেখান। ট্যাংক কোনো যোগফলেই ধরা হয় না, তাই যেখানে রেখা দুটি আলাদা হয়ে যায়, সেখানে ট্যাংকগুলো ভরাট বা খালি হচ্ছে।';
$ec_lang['lpn_sysflow_produced']='উৎপাদিত';
$ec_lang['lpn_sysflow_produced_tip']='জলাধার থেকে এবং ঋণাত্মক চাহিদা থেকে নেটওয়ার্কে প্রবেশ করা মোট প্রবাহ।';
$ec_lang['lpn_sysflow_consumed']='ব্যবহৃত';
$ec_lang['lpn_sysflow_consumed_tip']='প্রতিটি ধনাত্মক চাহিদার মোট: সংযোগস্থলে নেটওয়ার্ক থেকে টানা পানি, এবং জলাধারে প্রবেশ করা যেকোনো প্রবাহ।';
$ec_lang['lpn_copy_title']='ফাইলটিকে নতুন কপি হিসেবে চিহ্নিত করবেন?';
$ec_lang['lpn_copy_body']='এই ফাইলটি বলছে এটি {date} তারিখে তৈরি হয়েছে, এবং এই ব্রাউজার এটিকে চিনতে পারছে না। এটি কি মূল ফাইল (একই লক রাখুন) নাকি একটি কপি (নতুন লক তৈরি করুন)?';
$ec_lang['lpn_copy_body_nodate']='এই ব্রাউজার এই ফাইলটিকে চিনতে পারছে না। এটি কি মূল ফাইল (একই লক রাখুন) নাকি একটি কপি (নতুন লক তৈরি করুন)?';
$ec_lang['lpn_copy_original']='মূল; একই লক রাখুন';
$ec_lang['lpn_copy_copy']='একটি কপি; নতুন লক তৈরি করুন';
$ec_lang['lpn_copy_kept_link']='{name} মূল ফাইল হিসেবে খোলা হয়েছে, নতুন জায়গায় সরানো। এখন সংরক্ষণ করলে এই ফাইলেই লেখা হবে।';
$ec_lang['lpn_copy_opened']='{file} একটি কপি হিসেবে খোলা হয়েছে, এর নিজস্ব নতুন লক সহ, যা পরবর্তী ফাইল সংরক্ষণের সাথে সংরক্ষিত হবে।';
$ec_lang['lpn_scenario_basic']='সাধারণ মোড';
$ec_lang['lpn_scenario_basic_tip']='টিক দেওয়া থাকলে, একটি দৃশ্যকল্প শুধুই তাতে আপনার নির্ধারিত মানগুলো। টিক না থাকলে, এই মেনুতে বিকল্পগুলোর প্রিভিউ টেবিলও থাকে, যা দেখায় সেই মানগুলো ক্যাটাগরি অনুযায়ী কীভাবে সাজানো, এবং আপনার মতামত চায়।';
$ec_lang['lpn_alt_title']='বিকল্পগুলোর প্রিভিউ';
$ec_lang['lpn_alt_note']='শুধু পড়ার জন্য। ভিত্তি প্রতিটি ক্যাটাগরির ভিত্তি বিকল্প ব্যবহার করে। প্রতিটি দৃশ্যকল্প যে ক্যাটাগরি পরিবর্তিত হয়েছে তার জন্য নিজস্ব একটি বিকল্প পায়, যা ভিত্তি বিকল্পের একটি সন্তান। সংখ্যাটি হলো তাতে কতগুলো মান পরিবর্তিত হয়েছে।';
$ec_lang['lpn_alt_cat_physical']='ভৌত';
$ec_lang['lpn_alt_cat_demand']='চাহিদা';
$ec_lang['lpn_alt_cat_topology']='উপাদান সক্রিয়করণ';
$ec_lang['lpn_alt_cat_initial']='প্রাথমিক সেটিংস';
$ec_lang['lpn_alt_cat_constituent']='উপাদান-পদার্থ';
$ec_lang['lpn_alt_cat_fireflow']='অগ্নিনির্বাপণ প্রবাহ';
$ec_lang['lpn_alt_cat_energy']='শক্তি খরচ';
$ec_lang['lpn_alt_cat_userdata']='কাস্টম বৈশিষ্ট্য';
$ec_lang['lpn_alt_cat_text']='টেক্সট';
$ec_lang['lpn_reports_calib']='ক্যালিব্রেশন';
$ec_lang['lpn_reports_calib_tip']='একটি ক্যালিব্রেশন ফাইলের পরিমাপ করা মাঠ ডেটার সাথে সর্বশেষ রানের তুলনা করুন: পরিসংখ্যান, একটি সম্পর্ক প্লট, এবং গড়ের তুলনা।';
$ec_lang['lpn_calib_title']='ক্যালিব্রেশন প্রতিবেদন';
$ec_lang['lpn_calib_param']='প্যারামিটার';
$ec_lang['lpn_calib_param_tip']='ক্যালিব্রেশন ফাইল যে রাশিটি পরিমাপ করে। প্রতিটি প্যারামিটারের জন্য একটি করে ফাইল রাখা হয়।';
$ec_lang['lpn_calib_load']='ক্যালিব্রেশন ফাইল লোড করুন…';
$ec_lang['lpn_calib_load_tip']='একটি টেক্সট ফাইল, যার প্রতিটি লাইনে একটি স্থানের নাম, একটি সময় এবং একটি পরিমাপ করা মান থাকে। সময় সিমুলেশনের শুরু থেকে মাপা হয়, দশমিক ঘণ্টায় বা ঘণ্টা:মিনিটে। একটি সেমিকোলন মন্তব্য শুরু করে। শুধু একটি সময় ও একটি মান থাকা লাইন তার ওপরের স্থানের।';
$ec_lang['lpn_calib_none']='এই প্যারামিটারের জন্য কোনো ক্যালিব্রেশন ফাইল লোড করা নেই।';
$ec_lang['lpn_calib_session']='একটি ক্যালিব্রেশন ফাইল শুধু এই সেশনের জন্য রাখা হয়। এটি প্রকল্পের সাথে বা এই ডিভাইসে সংরক্ষিত হয় না।';
$ec_lang['lpn_calib_file']='{file}: {m}টি স্থানে {n}টি পরিমাপ।';
$ec_lang['lpn_calib_units']='ফাইলের মানগুলো এই প্রকল্পের একক অনুযায়ী পড়া হয়: {unit}।';
$ec_lang['lpn_calib_missing']='ফাইলে নাম আছে কিন্তু এই নেটওয়ার্কে নেই: {ids}।';
$ec_lang['lpn_calib_missing_count']='যেসব পরিমাপের স্থান এই নেটওয়ার্কে নেই সেগুলো বাদ দেওয়া হয়েছে: {n}।';
$ec_lang['lpn_calib_bad_lines']='যেসব লাইন পড়া যায়নি, বাদ দেওয়া হয়েছে: {lines}';
$ec_lang['lpn_calib_outside']='এই রান যে সময়গুলোর জন্য প্রতিবেদন করেছে তার বাইরের পরিমাপ বাদ দেওয়া হয়েছে: {n}।';
$ec_lang['lpn_calib_no_value']='যেসব পরিমাপের সময়ে কোনো গণনা করা মান নেই সেগুলো বাদ দেওয়া হয়েছে: {n}।';
$ec_lang['lpn_calib_single']='এটি একক-সময়কালের রান, তাই ফাইলে যে সময়ই দেওয়া থাকুক, প্রতিটি পরিমাপকে এর একমাত্র ফলাফলের সাথে তুলনা করা হয়।';
$ec_lang['lpn_calib_needs_run']='তুলনা করার মতো এখনও কোনো ফলাফল নেই। নেটওয়ার্ক হিসাব করা হলে প্রতিবেদনটি পূর্ণ হবে।';
$ec_lang['lpn_calib_no_pairs']='কোনো পরিমাপের তুলনা করা যায়নি, তাই প্লট করার কিছু নেই।';
$ec_lang['lpn_calib_tab_stats']='পরিসংখ্যান';
$ec_lang['lpn_calib_tab_corr']='সম্পর্ক প্লট';
$ec_lang['lpn_calib_tab_means']='গড়ের তুলনা';
$ec_lang['lpn_calib_col_location']='স্থান';
$ec_lang['lpn_calib_col_n']='পর্যবেক্ষণ সংখ্যা';
$ec_lang['lpn_calib_col_obs_mean']='পর্যবেক্ষিত গড়';
$ec_lang['lpn_calib_col_sim_mean']='গণনা করা গড়';
$ec_lang['lpn_calib_col_mean_err']='গড় ত্রুটি';
$ec_lang['lpn_calib_col_mean_err_tip']='প্রতিটি পর্যবেক্ষিত মান এবং একই সময়ের গণনা করা মানের মধ্যে পরম পার্থক্যগুলোর গড়।';
$ec_lang['lpn_calib_col_rms_err']='RMS ত্রুটি';
$ec_lang['lpn_calib_col_rms_err_tip']='রুট মিন স্কয়ার ত্রুটি: পর্যবেক্ষিত ও গণনা করা মানের মধ্যে পার্থক্যের বর্গগুলোর গড়ের বর্গমূল।';
$ec_lang['lpn_calib_network']='নেটওয়ার্ক';
$ec_lang['lpn_calib_corr_means']='গড়গুলোর মধ্যে সম্পর্ক: {r}';
$ec_lang['lpn_calib_corr_none']='গড়গুলোর মধ্যে সম্পর্ক: এর জন্য অন্তত দুটি স্থান লাগে যাদের গড় আলাদা।';
$ec_lang['lpn_calib_axis_obs']='পর্যবেক্ষিত: {q}';
$ec_lang['lpn_calib_axis_sim']='গণনা করা: {q}';
$ec_lang['lpn_calib_observed']='পর্যবেক্ষিত';
$ec_lang['lpn_calib_computed']='গণনা করা';
$ec_lang['lpn_calib_point']='{id}, {time}: পর্যবেক্ষিত {o}, গণনা করা {s}';
$ec_lang['lpn_calib_corr_note']='প্রতিটি বিন্দু একটি পরিমাপ। বিন্দুগুলো কর্ণ রেখার যত কাছে থাকে, গণনা করা মান পর্যবেক্ষিত মানের তত কাছাকাছি।';
$ec_lang['lpn_calib_ts_point']='{id}-এ পরিমাপ, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='বলয়গুলো ক্যালিব্রেশন ফাইলের পরিমাপ করা মান।';
$ec_lang['lpn_analyze_menu']='বিশ্লেষণ';
$ec_lang['lpn_analyze_menu_tip']='যেসব বিশ্লেষণ নেটওয়ার্কের একটি কপির ওপর চলে: প্রতিটি সংযোগস্থলে অগ্নিনির্বাপণ প্রবাহ, প্রতিটি পাইপ, পাম্প ও ভালভের ক্ষতি, এবং বাড়ানো বা কমানো চাহিদা।';
$ec_lang['lpn_ff_design_off']='নেই';
$ec_lang['lpn_ff_design_all']='সব';
$ec_lang['lpn_ff_design_selected']='নির্বাচিত';
$ec_lang['lpn_ff_rows_more_links']='দেখানো হয়নি এমন লিংক: {n}।';
$ec_lang['lpn_crit_menu']='গুরুত্ব বিশ্লেষণ…';
$ec_lang['lpn_crit_menu_tip']='প্রতিটি পাইপ, পাম্প ও ভালভ একে একে নেটওয়ার্ক থেকে সরিয়ে দেখুন সিস্টেম কী হারায়।';
$ec_lang['lpn_crit_title']='গুরুত্ব বিশ্লেষণ';
$ec_lang['lpn_crit_intro']='প্রতিটি উপাদান একে একে নেটওয়ার্ক থেকে সরানো হয়, এবং সক্রিয় দৃশ্যকল্পে পর্দায় দেখানো সময়ধাপে নেটওয়ার্কটি সমাধান করা হয়। আপনার প্রকল্পে কিছুই পরিবর্তিত হয় না; পুরো রানটি একটি কপির ওপর চলে।';
$ec_lang['lpn_crit_scope']='যেসব লিংক ভাঙা হবে';
$ec_lang['lpn_crit_scope_tip']='সব পাইপ, পাম্প ও ভালভ, অথবা শুধু মানচিত্রে নির্বাচিতগুলো। চালানোর আগে সেটটি বেছে নিন।';
$ec_lang['lpn_crit_scope_all']='সব লিংক';
$ec_lang['lpn_crit_scope_selected']='নির্বাচিত লিংক';
$ec_lang['lpn_crit_minpressure']='অনুমোদিত সর্বনিম্ন চাপ';
$ec_lang['lpn_crit_minpressure_tip']='এটি অগ্নিনির্বাপণ প্রবাহ বিশ্লেষণের অন্যত্র অনুমোদিত সর্বনিম্ন চাপের মতোই একই সংখ্যা। এখানে বদলালে সেখানেও বদলে যায়।';
$ec_lang['lpn_crit_col_asset']='উপাদান';
$ec_lang['lpn_crit_col_unserved']='অসরবরাহকৃত চাহিদা';
$ec_lang['lpn_crit_col_cutoff']='বিচ্ছিন্ন সংযোগস্থল';
$ec_lang['lpn_crit_col_below']='সর্বনিম্নের নিচে সংযোগস্থল';
$ec_lang['lpn_crit_summary']='{total}টি উপাদানের মধ্যে {n}টি চাহিদা অসরবরাহকৃত রাখে বা কোনো সংযোগস্থলকে {pressure}-এর নিচে নামিয়ে দেয়।';
$ec_lang['lpn_crit_baseline_below']='কিছুই না ভেঙে আগে থেকেই এর নিচে থাকা সংযোগস্থল: {n}। এগুলো গোনা হয়নি।';
$ec_lang['lpn_crit_working']='কাজ চলছে: {total}টি উপাদানের মধ্যে {done}টি।';
$ec_lang['lpn_crit_stopped']='{total}টি উপাদানের মধ্যে {done}টির পর থামানো হয়েছে। নিচের ফলাফলগুলো ইতিমধ্যে শেষ হওয়াগুলোর।';
$ec_lang['lpn_crit_no_selection']='কোনো লিংক নির্বাচিত নেই। লিংক নির্বাচন করুন অথবা সব লিংক বেছে নিন।';
$ec_lang['lpn_crit_no_links']='এই প্রকল্পে এখনও কোনো লিংক নেই, তাই ভাঙার মতো কিছু নেই।';
$ec_lang['lpn_crit_busy']='আরেকটি বিশ্লেষণ চলছে। সেটি থামান, অথবা শেষ হওয়া পর্যন্ত অপেক্ষা করুন।';
$ec_lang['lpn_crit_skipped']='নির্বাচিত উপাদানগুলোর {n}টি লিংক নয়, তাই সেগুলো ভাঙা হয়নি।';
$ec_lang['lpn_crit_stale']='অঙ্কন পরিবর্তিত হয়েছে, তাই গুরুত্ব বিশ্লেষণের ফলাফল মুছে ফেলা হয়েছে। আবার চালান।';
$ec_lang['lpn_crit_skipdead']='প্রান্তিক লিংক বাদ দিন';
$ec_lang['lpn_crit_skipdead_tip']='প্রান্তিক লিংক হলো এমন একটি লিংক যা সরালে এমন সংযোগস্থলগুলো বিচ্ছিন্ন হয়ে যায় যেগুলোতে শুধু এর মধ্য দিয়েই পৌঁছানো যায়, এর ওপারে কোনো জলাধার বা ট্যাংক নেই। এর ক্ষতি হলো এর ওপারের সবকিছু, তাই এটি সমাধান করা হয় না। সারসংক্ষেপে বলা থাকে কয়টি বাদ দেওয়া হয়েছে।';
$ec_lang['lpn_crit_skipped_dead']='বাদ দেওয়া প্রান্তিক লিংক: {n}। প্রতিটি তার ওপারের সবকিছু বিচ্ছিন্ন করে।';
