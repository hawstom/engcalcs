<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='အပိုင်းကိန်း';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/sec';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% လျောစောင်း';
$ec_lang['u_grade']='လျောစောင်း';
$ec_lang['u_in2']='sq. in.';
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
$ec_lang['u_s']='sec';
$ec_lang['u_hr']='hr';
$ec_lang['u_day']='day';
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
$ec_lang['menu_brand']='HawsEDC တွက်ချက်မှုကိရိယာများ';
$ec_lang['menu_main_hydraulics']='ဟိုက်ဒရောလစ်';
$ec_lang['menu_help']='အကူအညီ';
$ec_lang['menu_libre']='လွတ်လပ်သော ဆော့ဖ်ဝဲ';
$ec_lang['template_welcome']='သင့်ကြောက်ရွံ့မှုများကို တံခါးဝတွင် ချန်ထားပါ; ချစ်ခြင်းမေတ္တာသည် ဤနေရာ၌ ကျွန်ုပ်တို့၏ဘာသာစကားဖြစ်သည်။ သင်သည် အရာခပ်သိမ်းကို ဖျက်ဆီးနေသည်မဟုတ်ပါ။ <a target="_blank" href="https://hawsedc.com/download.php">အခမဲ့ HawsEDC AutoCAD ကိရိယာများ</a>ကိုလည်း ခံစားပါ။';
$ec_lang['template_feedback']='ဒီစာမျက်နှာက စာသားတွေကို ပိုကောင်းအောင် အကြံပြုနိုင်ပါသလား၊ ဒါမှမဟုတ် တခြားဘာအကြံမဆို ရှိပါသလား။ ကူညီချင်ပါသလား၊ ဒါမှမဟုတ် ဒီလိုကိရိယာမျိုး ဖန်တီးတတ်အောင် သင်လေ့လာချင်ပါသလား။ ကျွန်ုပ်ကို ဆက်သွယ်ပါ။';
$ec_lang['template_printable_title']='မှတ်တမ်းတင်ရာ ခေါင်းစဉ်';
$ec_lang['template_printable_subtitle']='မှတ်တမ်းတင်ရာ အမည်ငယ်';
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
$ec_lang['consent_body']='ဤစာမျက်နှာကို ရေတွက်ပြီးကြောင်း မှတ်သားထားရန် ဤဘရောက်ဇာတွင် ဂဏန်းတစ်လုံးပါသော ကွတ်ကီးတစ်ခု သိမ်းဆည်းခွင့်ပြုပါမည်လား။ ၎င်းသည် သင့်အကြောင်း မည်သည့်အရာကိုမျှ၊ သင်ရိုက်ထည့်သည့်အရာကိုမျှ မှတ်တမ်းမတင်ပါ။ ၎င်းမပါလျှင် သင့်ဒုတိယအကြိမ် ဝင်ရောက်ကြည့်ရှုမှုနှင့် အခြားသူတစ်ဦး၏ ပထမအကြိမ် ဝင်ရောက်ကြည့်ရှုမှုကို ခွဲခြားသိနိုင်မည် မဟုတ်ပါ။';
$ec_lang['consent_accept']='ဤတောင်းဆိုချက်ကို လက်ခံမည်';
$ec_lang['consent_accept_all']='အမြဲတမ်း လက်ခံမည်';
$ec_lang['consent_decline']='အမြဲတမ်း ငြင်းပယ်မည်';
$ec_lang['consent_current_granted']='သင်ခွင့်ပြုခဲ့ပါသည်။ ဤဘရောက်ဇာပရိုဖိုင်အတွက် မှတ်တမ်းတင်ခြင်းကို ကန့်သတ်ထားပါသည်။';
$ec_lang['consent_current_denied']='သင်ငြင်းပယ်ခဲ့ပါသည်။ ဤဘရောက်ဇာပရိုဖိုင်အတွက် မှတ်တမ်းတင်ခြင်းကို ကန့်သတ်ရန် ဘာမျှ မသိမ်းဆည်းပါ။';
$ec_lang['consent_region_label']='မှတ်တမ်းတင်ခြင်း ကန့်သတ်ရေးနှင့် ပတ်သက်၍ သင်၏ရွေးချယ်မှု။';
$ec_lang['consent_settings_link']='ကွတ်ကီး ဆက်တင်များ';
$ec_lang['privacy_link']='ကိုယ်ရေးလုံခြုံမှု ကြေညာချက်';
$ec_lang['terms_link']='အသုံးပြုမှု စည်းမျဉ်းများ';
$ec_lang['index_main_title']='အခမဲ့ အွန်လိုင်း အင်ဂျင်နီယာ တွက်ချက်မှုကိရိယာများ';
$ec_lang['index_meta_desc_plain']='ပိုက်၊ ရေလမ်းကြောင်း၊ ရေလွှမ်းတမံနှင့် ဆည်မြောင်းအတွက် အခမဲ့ ဟိုက်ဒရောလစ် အင်ဂျင်နီယာ တွက်ချက်စက်များ။ သင့်ဘရောက်ဇာထဲတွင် အလုပ်လုပ်ပြီး အင်တာနက်မရှိဘဲလည်း (အော့ဖ်လိုင်း) အသုံးပြုနိုင်ပြီး ဘာသာစကား ၂၇ မျိုးဖြင့် ရရှိနိုင်ပါသည်။';
$ec_lang['calc_set_units']='ယူနစ်သတ်မှတ်ရန်:';
$ec_lang['calc_set_units_tip']='အကွက်အားလုံး၏ ယူနစ်ကို တစ်ပြိုင်နက် သတ်မှတ်သည်။ ဖျက်ဆီးခြင်း မရှိပါ - သင်ရိုက်ထည့်ထားသော ဂဏန်းများသည် အတိအကျ ဖြစ်ပြီး၊ တစ်ခုစီကို ယူနစ်အသစ်ဖြင့်သာ ယခုဖတ်ရသည်။ 6 သည် 6 အဖြစ်ဆက်ရှိနေသော်လည်း၊ ယခု မီလီမီတာ 6 အစား လက်မ 6 ကို ဆိုလိုသည်။';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='ပုံမှန်သို့ ပြန်ယူပါ';
$ec_lang['calc_defaults_confirm']='တွက်ချက်မှုကိရိယာကို မူလ ပုံမှန် တန်ဖိုးများသို့ ပြန်လည်သတ်မှတ်မလား?';
$ec_lang['points_data_note']='(သို့မဟုတ် ဒေတာနေရာကို အသုံးပြု၍ ကူးယူ/ကူးထည့်ပါ)';
$ec_lang['points_data_heading']='အမှတ်ဒေတာ<br />(ကော်မာ သို့မဟုတ် tab ဖြင့် ခွဲ)';
$ec_lang['points_data_copy']='ကူးယူ';
$ec_lang['points_data_paste']='ကူးထည့်';
$ec_lang['calc_inputs']='ထည့်သွင်းချက်များ';
$ec_lang['calc_results']='ရလဒ်များ';
$ec_lang['view_hide_line']='[ဤစာကြောင်း ဝှက်ရန်]';
$ec_lang['view_printable']='မှတ်တမ်းတင်နိုင်သောဗားရှင်း (ပြန်ရယူရန် ပြန်လည်တင်/ရှင်းလင်းပါ)';
$ec_lang['ec_name_label']='ဤတွက်ချက်မှုကိုသိမ်းဆည်းပါ:';
$ec_lang['ec_name_placeholder']='အမည်';
$ec_lang['ec_name_tip']='ထည့်သွင်းချက်များကို URL သို့သိမ်းဆည်းကာ စာမှတ်မုံးခြင်း၊ မှတ်တမ်းများ ပြန်လည်ရယူခြင်းနှင့် မျှဝေခြင်းအတွက်ဖြစ်သည်။';
$ec_lang['calc_copy_link']='လင့်ခ် ကူးယူရန်';
$ec_lang['ec_related_calcs']='ဆက်စပ်တွက်ချက်စက်များ:';
$ec_lang['calc_copy_link_done']='ကူးယူပြီးပါပြီ!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Darcy-Weisbach သွတ်ပိုက် ဖိမြင့်ဆင့်ဆုံးရှုံးမှု';
$ec_lang['dw_main_title']='အခမဲ့ အွန်လိုင်း Darcy-Weisbach သွတ်ပိုက် ဖိမြင့်ဆင့်ဆုံးရှုံးမှု တွက်ချက်မှုကိရိယာ';
$ec_lang['dw_main_desc']='သတ်မှတ်အချင်း၊ ကြမ်းတမ်းမှုနှင့် စီးဆင်းမှုတွင် Darcy-Weisbach သွတ်ပိုက် ဖိမြင့်ဆင့်ဆုံးရှုံးမှု';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='ပိုက်နံရံ၏ အကြမ်းတမ်းအမြင့်, e။ ပုံမှန်တန်ဖိုးများ: သံမဏိ (အသစ်) 0.046 mm, သံမဏိ (အသုံးပြုပြီး) 0.15 mm, HDPE 0.003 mm, PVC/uPVC 0.0015 mm, ကွန်ကရစ် 0.3–3 mm။';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="သန့်ရှင်းသောရေအတွက် 20°C တွင် 1×10⁻⁶ m²/s ဖြစ်သည်">ရွေ့လျားမှုဆိုင်ရာ စေးကပ်မှု, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='ရွေ့လျားမှုဆိုင်ရာ စေးကပ်မှု, ν';
$ec_lang['dw_kinematic_viscosity_tip']='သန့်ရှင်းသောရေအတွက် 20°C တွင် 1×10⁻⁶ m²/s ဖြစ်သည်';
$ec_lang['dw_reynolds_number']='Reynolds ကိန်း, Re';
$ec_lang['dw_flow_regime']='စီးဆင်းမှုပုံစံ';
$ec_lang['dw_regime_laminar']='ညင်သာသောစီးဆင်းမှု (laminar)';
$ec_lang['dw_regime_transitional']='အသွင်ကူးပြောင်းမှု (transitional)';
$ec_lang['dw_regime_turbulent']='လှုပ်ရှားသောစီးဆင်းမှု (turbulent)';
$ec_lang['dw_friction_factor_method']='ပွတ်တိုက်မှုကိန်း နည်းလမ်း';
$ec_lang['dw_friction_factor']='ပွတ်တိုက်မှုကိန်း, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Hazen-Williams သွတ်ပိုက် ဖိမြင့်ဆင့်ဆုံးရှုံးမှု';
$ec_lang['hw_main_title']='အခမဲ့ အွန်လိုင်း Hazen-Williams သွတ်ပိုက် ဖိမြင့်ဆင့်ဆုံးရှုံးမှု တွက်ချက်မှုကိရိယာ';
$ec_lang['hw_main_desc']='သတ်မှတ်အချင်း၊ ကြမ်းတမ်းမှုနှင့် စီးဆင်းမှုတွင် Hazen-Williams သွတ်ပိုက် ဖိမြင့်ဆင့်ဆုံးရှုံးမှု';
$ec_lang['hw_hgl_1']='အောက်ဘက် HGL';
$ec_lang['hw_hgl_2']='အပေါ်ဘက် HGL';
$ec_lang['hw_elev_up']='အပေါ်ဘက် အမြင့်';
$ec_lang['hw_pressure_up']='အပေါ်ဘက် ဖိအား';
$ec_lang['hw_elev_down']='အောက်ဘက် အမြင့်';
$ec_lang['hw_pressure_down']='အောက်ဘက် ဖိအား';
$ec_lang['hw_pressure_check']='ဖိအား စစ်ဆေးမှု';
$ec_lang['hw_pressure_ok_short']='အပေါင်းဖိအား';
$ec_lang['hw_pressure_neg_short']='အနုတ်ဖိအား';
$ec_lang['hw_pressure_neg']='အောက်ဘက်ဖိအားသည် သုညအောက် ကျဆင်းနေသည်။ HGL သည် ပိုက်အောက်သို့ ကျဆင်းနေသဖြင့် ပိုက်သည် အပြည့်မစီးနိုင်ဘဲ ဤရလဒ်သည် မှန်ကန်မှု မရှိနိုင်ပါ။';
$ec_lang['hw_roughness']='Hazen-Williams ကိန်း, C';
$ec_lang['hw_note_1']='<dl><dt>ဤတွက်ချက်စက်သည် အစွန်းနှစ်ဖက်ကြား ပိုက်၏ အနေအထား (profile) ကို ထည့်သွင်းတွက်ချက်ခြင်း မရှိပါ။</dt><dd>၎င်းသည် သင်ထည့်သွင်းသော အပေါ်ဘက်နှင့် အောက်ဘက် အမြင့်များကိုသာ အသုံးပြုသည်။ ကြားရှိ တစ်နေရာရာတွင် မြေပြင်သည် အစွန်းနှစ်ဖက်ထက် ပိုမြင့်တက်နေပါက ထိုမြင့်ရာနေရာ၏ ဖိအားသည် ဤနေရာတွင် တင်ပြထားသော ဖိအားများထက် နိမ့်ပါသည်။ ၎င်းကို စစ်ဆေးရန် အပေါ်ဘက်စွန်းမှ မြင့်ရာနေရာအထိ အလျားဖြင့် တွက်ချက်စက်ကို ထပ်မံအသုံးပြုပါ။</dd><dd>HGL သည် ပိုက်အောက်သို့ ကျဆင်းသည့်နေရာများတွင် ရေသည် အနုတ်ဖိအားအောက်တွင် ရှိသည်။ လေသည် ရေထဲမှ ခွဲထွက်လာနိုင်ပြီး၊ နံရံပါးသော ပိုက်ပြိုကျနိုင်ကာ၊ ညစ်ညမ်းသော မြေအောက်ရေသည် ဆက်စပ်ချိတ်ဆက်ရာနေရာများမှ ဝင်ရောက်လာနိုင်သည်။ တစ်လျှောက်လုံးတွင် အပေါင်းဖိအားအောက်တွင် ပိုက်လိုင်းကို ထိန်းထားပြီး၊ မြင့်ရာနေရာတိုင်းတွင် လေထွက်ပေါက် (air valve) တပ်ဆင်ရန် စဉ်းစားပါ။</dd><dt>အပေါ်ဘက်ဖိအားသည် သင်ပေးသွင်းသော နယ်နိမိတ်အခြေအနေ (boundary condition) တစ်ခုဖြစ်သည်။</dt><dd>၎င်းကို ဖိအားတိုင်းစက်မှ၊ ရေတိုင်ကီ ရေမျက်နှာပြင်အမြင့် (ပိုက်အထက်ရှိ ရေအမြင့်) မှ၊ သို့မဟုတ် ရေတင်စက်မျဉ်းကွေး (pump curve) မှ ဖတ်ယူပါ။ ရေတင်စက်သည် ရေစီးနှုန်း မြင့်တက်လာသည်နှင့်အမျှ ဖိအားနည်းလာသောကြောင့်၊ အထက်တွင် ထည့်သွင်းထားသော ရေစီးနှုန်းနှင့် ကိုက်ညီသည့် မျဉ်းကွေးပေါ်ရှိအမှတ်ကို အသုံးပြုပါ။</dd><dt>ဒေသဆိုင်ရာ ဆုံးရှုံးမှု ကိန်းများ (minor/local loss coefficients) ကို သင်ကိုယ်တိုင် ပေါင်းထည့်ပါ။</dt><dd>ပိုက်လိုင်းပေါ်ရှိ ရေတံခါး၊ ကွေးကွေးနေရာ၊ တီးချိတ်၊ မီတာနှင့် ဝင်ပေါက် တိုင်း၏ K တန်ဖိုးများကို စုစုပေါင်းလုပ်ပြီး ၎င်းစုစုပေါင်းကို ထည့်သွင်းပါ။ ပုံမှန်တန်ဖိုးများအတွက် ထိုထည့်သွင်းရေးနေရာရှိ လင့်ခ်ကို လိုက်ပါ။ ရေရှည်ပို့ဆောင်ရေးပင်မပိုက် (long transmission main) တွင် ဤဆုံးရှုံးမှုများသည် ပွတ်တိုက်ဆုံးရှုံးမှုနှင့်နှိုင်းယှဉ်လျှင် သေးငယ်သော်လည်း၊ တိုတောင်းသော စခန်းပိုက်လိုင်း (station piping) တွင် ၎င်းတို့သည် ဆုံးရှုံးမှု အများစုဖြစ်နိုင်သည်။</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Manning မညီမညာ မြောင်းကြောင်း';
$ec_lang['mi_main_title']='အခမဲ့ အွန်လိုင်း Manning ဖြတ်ပိုင်းမညီမညာသော မြောင်းကြောင်း တွက်ချက်မှုကိရိယာ';
$ec_lang['mi_main_desc']='ဖြတ်ပိုင်းမညီမညာသော မြောင်းကြောင်း Manning တစ်သမတ်တည်း စီးဆင်းမှု တွက်ချက်မှုကိရိယာ';
$ec_lang['mi_waterSurfaceElevation']='ရေမျက်နှာပြင် အမြင့်';
$ec_lang['mi_q_617']='<span class="ec-help" title="ဇုန်တစ်ခုစီအတွက် Chow 6-17 ညီမျှခြင်း (အလျင်တူ သဘောတရား) အရ ပေါင်းစပ် n ကို အသုံးပြု၍ ရရှိသည့် ပေါင်းစပ်စီးဆင်းမှု Q">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='အဖြတ်ပိုင်းအမှတ်များ';
$ec_lang['mi_groupPoint']='အမှတ်';
$ec_lang['mi_groupSegment']='အပိုင်း';
$ec_lang['mi_groupRegion']='ဇုန်';
$ec_lang['mi_station']='အကွာမှတ်';
$ec_lang['mi_elevation']='အမြင့်';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />ဇုန်<br />နယ်နိမိတ်<br />(ကမ်း)';
$ec_lang['mi_tau']='အောက်ခြေ<br />ညှပ်ဖိအား<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='ပေါင်းစပ်<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='ပေါင်းစပ် n';
$ec_lang['mi_notes_1_def']='ဤတွက်ချက်မှုကိရိယာသည် Chow 1959၊ ၁၃၆ မျက်နှာ၊ ညီမျှခြင်း 6-17 (6-18 မဟုတ်) ကို အသုံးပြု၍ ဇုန်ပေါင်းစပ် n တွက်ချက်ရာတွင် HEC-RAS ကိုးကားစာအုပ်ကို လိုက်နာသည်။';


$ec_lang['mi_notes_2_term']='ကျောက်အကာ';
$ec_lang['mi_notes_2_def']='ကျောက်အကာ ဒီဇိုင်းဆွဲရန် Manning Trapezoidal Channel Calculator ကို အသုံးပြုပါ။ ဤတွက်ချက်မှုကိရိယာသည် သဘာဝအပိုင်းများအတွက် ပိုသင့်တော်သည်။';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning သွတ်ပိုက် စီးဆင်းမှု';
$ec_lang['mpf_main_title']='အခမဲ့ အွန်လိုင်း Manning သွတ်ပိုက် စီးဆင်းမှု တွက်ချက်မှုကိရိယာ';
$ec_lang['mpf_main_desc']='သတ်မှတ်အစောက်နှင့် နက်ရှိုင်းမှုတွင် Manning ဖော်မြူလာ တစ်သမတ်တည်း သွတ်ပိုက် စီးဆင်းမှု';
$ec_lang['mpf_pipe_diameter']='သွတ်ပိုက် အချင်း, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Manning ကြမ်းတမ်းမှုကိန်း, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">ပွတ်တိုက်မှုအစောက်, S<sub>f</sub></a><span class="ec-help" title="ပိုက်အစောက်နှင့် တူနိုင်။ ရှင်းလင်းချက်အတွက် လင့်ခ်ကိုနှိပ်ပါ (အင်္ဂလိပ်ဘာသာဖြင့်သာ)။"><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='နှိုင်းယှဉ်စီးဆင်းမှုနက်, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='ရေစီးနှုန်း, Q';
$ec_lang['mpf_flow_tip']='ရေစီးနှုန်းနှင့်နက်ရှိုင်းမှုကို အလျားအကန့်အသတ်မဲ့ရှည်သောပိုက်တစ်ခုအတွက် တွက်ချက်ထားသည်။ ဤရေစီးနှုန်းကို ပိုက်ထဲသို့ ဝင်ရောက်စေရန် ပိုမြင့်သောရေတက်ဘက်ရေနက်ရှိုင်းမှု လိုအပ်နိုင်သည်။ အသေးစိတ်အချက်များနှင့် သင်ခန်းစာဗီဒီယိုအတွက် အောက်ပါမှတ်ချက်များကို ကြည့်ပါ။';
$ec_lang['mpf_velocity']='အမြန်နှုန်း, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="ရွေ့လျားစွမ်းအင်ကို ရေတိုင်အမြင့်တစ်ခုအဖြစ် ဖော်ပြသည်, v²/2g">အမြန်နှုန်း ဖိမြင့်, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='စီးဆင်းမှုဧရိယာ, A';
$ec_lang['mpf_pipe_area']='သွတ်ပိုက်ဧရိယာ, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='နှိုင်းယှဉ်ဧရိယာ, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='စိုရွှဲသောပတ်လည်, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='ဟိုက်ဒရောလစ်အချင်းဝက်, R<sub>h</sub>';
$ec_lang['mpf_top_width']='အပေါ်ပိုင်းအကျယ်, T';
$ec_lang['mpf_froude_number']='Froude ကိန်း, Fr';
$ec_lang['mpf_shear_stress']='ပျမ်းမျှ ရွေ့လျှောဖိအား, τ';
$ec_lang['mpf_full_flow']='အပြည့်စီးဆင်းမှု, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='အပြည့်စီးဆင်းမှုနှင့် အချိုး, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt><em>အဆုံးမဲ့ရှည်</em>သောသွတ်ပိုက်အတွင်းရှိ စီးဆင်းမှုနှင့် နက်ရှိုင်းမှုဖြစ်သည်။</dt><dd>သွတ်ပိုက်ထဲသို့ စီးဆင်းမှုသွင်းရန် သိသိသာသာ မြင့်မားသော ရေတက်ဘက်ရေနက်ရှိုင်းမှု လိုအပ်နိုင်သည်။ ရေတက်ဘက်ရေနက်ရှိုင်းမှုရရန် အမြန်နှုန်း ဖိမြင့်အနည်းဆုံး 1.5 ဆကို ထည့်ပါ၊ သို့မဟုတ် အမေရိကန်ပြည်ထောင်စု ဖက်ဒရယ် လမ်းမကြီးစီမံခန့်ခွဲရေးဌာန၏ အခမဲ့ ကြောင်းဖြတ်ပရိုဂရမ်ဖြစ်သည့် <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> ကို အသုံးပြု၍ စံကြောင်းဖြတ် ရေတက်ဘက်ရေတွက်ချက်မှုများအတွက် <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">ကျွန်ုပ်၏ ၂ မိနစ် သင်ခန်းစာကို ကြည့်ပါ</a>။</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>သန့်ရှင်းရေမစီးမြောင်း ဒီဇိုင်းရေးဆွဲနေပါသလား?</dt><dd>ပိုက်လက်း 4 မှ 96 လက်မ (100 မှ 2400 မီလီမီတာ) အထိ m/m၊ mm/m နှင့် ရာခိုင်နှုန်းဖြင့် ဖော်ပြထားသော <a target="_blank" href="/sewslope.php">အနည်းဆုံး မစီးမြောင်း စောင်းချိုးဇယားများ</a>နှင့် <a target="_blank" href="/peakfact.php">အလွန်နည်းသော စီးဆင်းမှုများအတွက် အထွတ်အထိပ်အချိုးအစား</a> လေ့လာချက်ကို ကြည့်ပါ။ နှစ်ခုစလုံးသည် အင်္ဂလိပ်ဘာသာဖြင့်သာ ရေးသားထားသော ကိုးကားစာရွက်စာတမ်းများဖြစ်သည်။</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='အသုံးပြုလိုသော Q တန်ဖိုးကို အပြုသဘောဂဏန်းဖြင့် ထည့်ပါ။';
$ec_lang['mpf_solver_no_solution']='အဖြေမရှိပါ: y/d0 = 93.8% တွင် Q သည် ပိုက်၏ စွမ်းဆောင်ရည်ကို ကျော်လွန်နေသည် (Qmax = {qmax}, ရွေးချယ်ထားသော ယူနစ်များဖြင့်)။';
$ec_lang['mpf_solve_btn']='ဖြေရှင်းရန်';
$ec_lang['mpf_solve_for_flow']='ရေစီးနှုန်းအတွက်, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Manning သွတ်ပိုက် ဖိမြင့်ဆင့်ဆုံးရှုံးမှု';
$ec_lang['mphl_main_title']='အခမဲ့ အွန်လိုင်း Manning သွတ်ပိုက် ဖိမြင့်ဆင့်ဆုံးရှုံးမှု တွက်ချက်မှုကိရိယာ';
$ec_lang['mphl_main_desc']='သတ်မှတ်အပြည့်စီးဆင်းမှုတွင် Manning ဖော်မြူလာ ဖိမြင့်ဆင့်ဆုံးရှုံးမှု';
$ec_lang['mphl_pipe_length']='အရှည်, L';
$ec_lang['mphl_area']='ဧရိယာ, A';
$ec_lang['mphl_total_junction_k']='ဒေသဆိုင်ရာ ဆုံးရှုံးမှုကိန်း, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='ဆုံးရှုံးမှုကိန်း, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='ဒေသဆိုင်ရာ ဆုံးရှုံးမှု ကိန်းသေ၊ km။ ဤဆုံးရှုံးမှုများသည် ပိုက်ဆက်စပ်ရာနေရာ၊ ဝင်ပေါက်၊ ထွက်ပေါက်၊ ဒေါင့်ကွေ့နှင့် ရေပိတ်ခလုတ်များတွင် ဖြစ်ပေါ်ပါသည် — ဓလေ့ထုံးစံအရ "အနည်းငယ်" ဟု ခေါ်ဆိုကြသော်လည်း ဤအသုံးအနှုန်းသည် အနက်အဓိပ္ပာယ်လွဲမှားစေနိုင်ပါသည်၊ ပိုက်တိုတိုတစ်ခုတွင် ၎င်းတို့သည် ပွတ်တိုက်မှုဆုံးရှုံးမှုနှင့် ညီမျှနိုင်သည် သို့မဟုတ် ကျော်လွန်နိုင်ပါသည်။ ပုံမှန်ကိန်း k တန်ဖိုးများမှာ - ထက်မြက်သော စုပ်ဝင်ပေါက် 0.5၊ 45° ဒေါင့်ကွေ့တစ်ခုစီအတွက် 0.2–0.3၊ ဂိတ်အမျိုးအစား ရေပိတ်ခလုတ် (အပြည့်ဖွင့်ထားသော) 0.1၊ လိပ်ပြာပုံ ရေပိတ်ခလုတ် 0.2၊ ထွက်ပေါက် (ရေလှောင်ကန် သို့မဟုတ် လေထုသို့) 1.0 တို့ဖြစ်သည်။ စုစုပေါင်း km အတွက် ပိုက်လိုင်းဆက်စပ်ပစ္စည်းအားလုံး၏ တန်ဖိုးများကို ပေါင်းထည့်ပါ။ မူလသတ်မှတ်ထားသော 2.0 တန်ဖိုးသည် ဝင်ပေါက်တစ်ခု၊ ထွက်ပေါက်တစ်ခုနှင့် 45° ဒေါင့်ကွေ့နှစ်ခုကို ယူဆထားခြင်းဖြစ်သည်။';
$ec_lang['mphl_friction_slope']='ပွတ်တိုက်မှုအစောက်';
$ec_lang['mphl_friction_loss']='ပွတ်တိုက်ဆုံးရှုံးမှု, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='ဒေသဆိုင်ရာ ဆုံးရှုံးမှု, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='စုစုပေါင်းဆုံးရှုံးမှု, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='အောက်ဘက် EGL';
$ec_lang['mphl_egl_2']='အပေါ်ဘက် EGL';
$ec_lang['mphl_hgl_egl_tip']='ပိုက်လိုင်းသည် ဟိုက်ဒရောလစ် အဆင့်မျဉ်းအထက်သို့ မြင့်တက်နေသည့်နေရာတွင် ဤအဖြေသည် မမှန်ကန်နိုင်ပါ။';
$ec_lang['mphl_note_1']='<dl><dt>ဤတွက်စက်သည် အစွန်းနှစ်ဖက်ကြားရှိ ပိုက်၏ အနေအထား (ပရိုဖိုင်) ကို ပုံဖော်တွက်ချက်ခြင်း မရှိပါ။</dt><dd>HGL သည် မည်သည့်နေရာတွင်မဆို ပိုက်၏ထိပ်အောက်သို့ ကျဆင်းသွားပါက ဤတွက်ချက်မှုသည် မမှန်ကန်နိုင်ပါ။</dd><dt>ဖွင့်လှစ်ဝင်ပေါက် (ကြောင်းဖြတ်) အခြေအနေတွင် ဝင်ပေါက်ထိန်းချုပ်မှု အခြေအနေများကို စစ်ဆေးရန် လိုအပ်သည်။</dt><dd>1. အပေါ်ဘက် HGL သည် အပေါ်ဘက် ပုံမှန်နက်ရှိုင်းမှု စီးဆင်းမှုအမြင့် (သို့မဟုတ် သွတ်ပိုက်ထက် နိမ့်) ထက် နိမ့်၍မရပါ။</dd><dd>2. ကြောင်းဖြတ်တစ်ခု၏ ရေတက်ဘက်ရေသည် အပေါ်ဘက် HGL ထက် အပေါ်ဘက် EGL ဖြင့် ပိုကောင်းစွာ ကိုယ်စားပြုသည်။</dd><dd>3. <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> (အမေရိကန်ပြည်ထောင်စု ဖက်ဒရယ်လမ်းပန်းဆက်သွယ်ရေးဌာန၏ အခမဲ့ ကြောင်းဖြတ်ပရိုဂရမ်) ကို အသုံးပြုသည့် ရိုးရှင်းသောစံကြောင်းဖြတ် ရေတက်ဘက်ရေတွက်ချက်မှုများအတွက် <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">ကျွန်ုပ်၏ ၂ မိနစ် သင်ခန်းစာကို ကြည့်ပါ</a>။</dd><dd>4. ဤစာမျက်နှာသည် ထွက်ပေါက်ထိန်းချုပ်မှု အခြေအနေကိုသာ ဖြေရှင်းပေးသည်: ပိုက်တစ်ခုလုံး ရေပြည့်စီးဆင်းနေပြီး၊ အောက်ဘက်အခြေအနေများက ခေါင်းဆုံးကို သတ်မှတ်သည့် အခြေအနေ။ ကြောင်းဖြတ်ဒီဇိုင်းသည် ဝင်ပေါက်ထိန်းချုပ်မှု သို့မဟုတ် ထွက်ပေါက်ထိန်းချုပ်မှု အနက် မည်သည့်အရာက အုပ်စိုးမည်ကို ဆုံးဖြတ်ရသည့်အလုပ်ဖြစ်သောကြောင့်၊ နှစ်မျိုးစလုံး ဖြစ်နိုင်ချေရှိလျှင် HY-8 ကို အမြဲသုံးပါ။</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Manning Trapezoidal မြောင်းကြောင်း';
$ec_lang['mtc_main_title']='အခမဲ့ အွန်လိုင်း Manning ဖော်မြူလာ Trapezoidal မြောင်းကြောင်း တွက်ချက်မှုကိရိယာ';
$ec_lang['mtc_main_desc']='သတ်မှတ်အစောက်နှင့် နက်ရှိုင်းမှုတွင် Manning ဖော်မြူလာ တစ်သမတ်တည်း Trapezoidal မြောင်းကြောင်း စီးဆင်းမှု';
$ec_lang['mtc_bottom_width']='အောက်ပိုင်းအကျယ်, b';
$ec_lang['mtc_side_slope_1']='ဘေးစောက် ၁, z<sub>1</sub> (အလျားဆင့်/ဒေါင်လိုက်)';
$ec_lang['mtc_side_slope_2']='ဘေးစောက် ၂, z<sub>2</sub> (အလျားဆင့်/ဒေါင်လိုက်)';
$ec_lang['mtc_channel_slope']='မြောင်းကြောင်း လျောစောင်း, S';
$ec_lang['mtc_flow_depth']='စီးဆင်းမှုနက်ရှိုင်းမှု, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">ကောက်ကြောင်းထောင့်, β</a><span class="ec-help" title="ကျောက်အကာ အရွယ်အတွက်။ ပုံကြမ်းအတွက် လင့်ခ်ကိုနှိပ်ပါ။"><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="ရေနှင့်နှိုင်းယှဉ်သော သိပ်သည်းဆ။ အကြမ်းချေထားသောကျောက်တုံးအတွက် ပုံမှန်အားဖြင့် ≈ 2.65 ဖြစ်သည်။">ကျောက်တုံးအထူးဆွဲငင်အား, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='ဒီဇိုင်းကျောက်တုံးအရွယ်, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='ဒီဇိုင်း ကျောက်တုံးအရွယ်မှ n (Strickler နည်း)';
$ec_lang['mtc_n_blodgett']='ဒီဇိုင်း ကျောက်တုံးအရွယ်မှ n (Blodgett နည်း)';
$ec_lang['mtc_n_bathurst']='ဒီဇိုင်း ကျောက်တုံးအရွယ်မှ n (Bathurst နည်း)';
$ec_lang['mtc_n_pi']='ဒီဇိုင်း ကျောက်တုံးအရွယ်မှ n (Phillips & Ingersoll နည်း)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett နှင့် Bathurst နှိုင်းယှဉ်မှု';
$ec_lang['mtc_pi_range_check']='P&I အပိုင်းအခြားစစ်ဆေးမှု';
$ec_lang['mtc_pi_ok']='d50 သည် P&I အပိုင်းအခြားအတွင်းရှိသည်';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='အပိုင်းအခြားပြင်ပ';
$ec_lang['mtc_pi_tip']='ဤညီမျှခြင်း ရေတွက်ချက်ရာတွင်အခြေခံခဲ့သော 0.28–0.36 ft ဒေတာအပိုင်းအခြားအပြင်သို့ ရောက်ရှိနေခြင်းဖြစ်သည်— ဒီဇိုင်းအခြေခံအဖြစ်မဟုတ်ဘဲ ခန့်မှန်းစစ်ဆေးမှုတစ်ခုအဖြစ်သာ သဘောထားပါ';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Isbash (1936) နှင့် Maricopa County, Arizona, US အရ.">လိုအပ်သောအောက်ပိုင်းထောင့်ချောင်းကျောက်တုံးအရွယ်, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Isbash (1936) နှင့် Maricopa County, Arizona, US အရ.">လိုအပ်သောဘေးစောက် ၁ ထောင့်ချောင်းကျောက်တုံးအရွယ်, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Isbash (1936) နှင့် Maricopa County, Arizona, US အရ.">လိုအပ်သောဘေးစောက် ၂ ထောင့်ချောင်းကျောက်တုံးအရွယ်, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Maynord, Ruff, and Abt (1989) အရ။ ချောင်းကွေးတစ်ခုတွင် ကျောက်တုံးကို California Division of Highways (1970) အရ ပျမ်းမျှနှုန်း၏ 4/3 ဖြစ်သော ကွေးအရွယ်အနေဖြင့် ချိန်ညှိထားသည်; Maynord ကိုယ်ပိုင် 1.5 မှာ သဘာဝချောင်းများ အတွက် အသုံးပြုသည်။">လိုအပ်သောထောင့်ချောင်းကျောက်တုံးအရွယ်, D<sub>50</sub> (Maynord, Ruff, and Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='လိုအပ်သောထောင့်ချောင်းကျောက်တုံးအရွယ်, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='တစ်သမတ်တည်းစီးဆင်းမှုဆင်ခြင်ချက်များအတွက် ရေအလျင်နှုန်း သင့်တော်သည်။';
$ec_lang['mtc_vel_low']='ရေအလျင်နှုန်း နိမ့်သည် — အနည်ကျမှု အန္တရာယ်ရှိ။';
$ec_lang['mtc_vel_high']='ရေအလျင်နှုန်း မြင့်ပြီး လက်တွေ့ကျမည် မဟုတ်နိုင်ပါ။ ချောင်းအကာ ရေတိုက်စားမှု၊ ကောက်ကြောင်းများတွင် ထပ်တိုးရေနက်မှုနှင့် ကျယ်ပြူးမှုများ သို့မဟုတ် အတားအဆီးများတွင် စွမ်းအင်ဆုံးရှုံးမှုကို စစ်ဆေးပါ။';
$ec_lang['mtc_iteration_tip']='ကြမ်းတမ်းမှု ရွေးချယ်စရာ (Blodgett–Bathurst အကြံပြု) နှင့် ကျောက်တုံးအရွယ် ရွေးချယ်စရာ (Isbash အကြံပြု) ကိုရွေးချယ်ပါက သင်လိုချင်သောစီးဆင်းမှုအတွက် တညီတညာတည်းကျောက်တုံးအရွယ်ရရှိအောင် အလိုအလျောက် ထပ်ခါထပ်ခါတွက်ချက်ပေးမည်။ နည်းလမ်းအပြည့်အစုံအတွက် အောက်ပါမှတ်ချက်များကို ကြည့်ပါ၊ သို့မဟုတ် ကိုယ်ပိုင်ကြမ်းတမ်းမှုတန်ဖိုး (လမ်းညွှန်အတွက် လင့်ခ်ကိုကြည့်ပါ) ထည့်၍ ကျောက်တုံးအရွယ်ကို လျစ်လျူရှုခြင်းဖြင့် ထပ်ခါထပ်ခါတွက်ချက်မှုကို ကျော်နိုင်သည်။';
$ec_lang['mtc_note_1']='<dl><dt>အလိုအလျောက် ကျောက်တုံးအရွယ်နှင့် ကြမ်းတမ်းမှုဒီဇိုင်း ထပ်ခါထပ်ခါတွက်ချက်မှု</dt><dd>ကြမ်းတမ်းမှု ရွေးချယ်စရာ (Blodgett–Bathurst အကြံပြု) နှင့် ဒီဇိုင်းကျောက်တုံးအရွယ် ရွေးချယ်စရာ (Isbash အကြံပြု) ကိုရွေးချယ်ပါ။ တညီတညာတည်းကျောက်တုံးအရွယ်ဖြင့် သင်လိုချင်သောစီးဆင်းမှုရရန် နက်ရှိုင်းမှုနှင့် ကျောက်တုံးအရွယ်လုံခြုံရေးဆေးကို ချိန်ညှိပါ။ ထည့်သွင်းချက်တန်ဖိုးတစ်ခု ပြောင်းလဲသည့်အခါတိုင်း၊ တွက်ချက်မှုကိရိယာသည် အောက်ပါအဆင့်များကို ထပ်ခါထပ်ခါ လုပ်ဆောင်သည်- ၁။ ဒီဇိုင်းကျောက်တုံးအရွယ်မှ ကြမ်းတမ်းမှုကို တွက်ချက်သည်။ ၂။ တောင်းဆိုထားသောကြမ်းတမ်းမှုတွက်ချက်မှုကို ထည့်သွင်းကြမ်းတမ်းမှုသို့ ကူးယူသည်။ ၃။ မြောင်းကြောင်းစီးဆင်းမှုနှင့် လိုအပ်သောကျောက်တုံးအရွယ်ကို တွက်ချက်သည်။ ၄။ ဒီဇိုင်းကျောက်တုံးအရွယ်ကို ချိန်ညှိသည်။ ၅။ ဒီဇိုင်းကျောက်တုံးအရွယ်ရှိ အမှားသည် အလွန်သေးငယ်သည်အထိ ထပ်ခါထပ်ခါ ဆောင်ရွက်သည်။</dd><dt>အခြေခံတွက်ချက်မှုကိရိယာ (ထပ်ခါတလဲလဲမဟုတ်)</dt><dd>သင်လိုချင်သောကြမ်းတမ်းမှုတန်ဖိုးကို ထည့်ပါ။ ဒီဇိုင်းကျောက်တုံးအရွယ်ထည့်သွင်းနေရာကို လျစ်လျူရှုပါ။</dd></dl>';
$ec_lang['mtc_note_2_term']='ရေအလျင်နှုန်းစစ်ဆေးမှု';
$ec_lang['mtc_note_2_def']='ရေအလျင်နှုန်းမြင့်မားမှုသည် ထိုကဲ့သို့ မြင့်မားသော သီးသန့်စွမ်းအင်ကို ဖြစ်ပေါ်စေသည့် အမြင့်ကျဆင်းမှု ကြီးမားစွာ ရှိခဲ့ကြောင်း ဆိုလိုသည်။ ထိုစွမ်းအင်သည် ကျယ်ပြူးမှုများ၊ ကောက်ကြောင်းများ သို့မဟုတ် အတားအဆီးများတွင် မြန်မြန်ဆုံးရှုံးနိုင်သည်။ ဤနေရာအတွက် သင့်တော်မှုရှိကြောင်း စစ်ဆေးပါ။';
$ec_lang['mtc_solver_no_solution']='ဤမြောင်းကြောင်းဒေတာများဖြင့် ပေးထားသော Q အတွက် အဖြေရှာမတွေ့ပါ။';
// Weir Flow Simple
$ec_lang['ws_main_menu']='ရိုးရှင်းသော ဆည်တမံ စီးဆင်းမှု';
$ec_lang['ws_main_title']='အခမဲ့ အွန်လိုင်း ရိုးရှင်းသော ကျယ်ပြန့်ထိပ်ပါ ဆည်တမံ စီးဆင်းမှု တွက်ချက်မှုကိရိယာ';
$ec_lang['ws_main_desc']='ရိုးရှင်းသော ကျယ်ပြန့်ထိပ်ပါ ဆည်တမံ စီးဆင်းမှု တွက်ချက်မှုကိရိယာ';
$ec_lang['ws_weirLength']='ဆည်တမံအရှည်, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="ရေ၏ အလေးချိန်ယူနစ်တစ်ခုအတွက် စွမ်းအင်ဖြစ်ပြီး — ရေတိုင်၏ အမြင့်တစ်ခုအဖြစ် ဖော်ပြသည်၊ ဖိအားမဟုတ်ပါ။">ခေါင်းဆုံး, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='ဆည်တမံကိန်းဂဏန်း, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='မှတ်ချက်များ';
$ec_lang['ws_notes_we_term']='ဆည်တမံညီမျှခြင်း';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='မညီမညာ ဆည်တမံ စီးဆင်းမှု';
$ec_lang['wi_main_title']='အခမဲ့ အွန်လိုင်း အပိုင်းပိုင်း ပြောင်းလဲသောနက်ရှိုင်းမှုနှင့် မညီမညာ ဆည်တမံ စီးဆင်းမှု တွက်ချက်မှုကိရိယာ';
$ec_lang['wi_main_desc']='မညီမညာ ဆည်တမံ စီးဆင်းမှု တွက်ချက်မှုကိရိယာ';
$ec_lang['wi_weirPoints']='ဆည်တမံအမှတ်များ';
$ec_lang['wi_pondingHeight']='ရေဝပ်မှုအမြင့်';
$ec_lang['wi_incrementalFlow']='တိုးမြှင့်စီးဆင်းမှု';
$ec_lang['wi_cumulativeFlow']='စုစုပေါင်းစီးဆင်းမှု';
$ec_lang['wi_notes_we_def']='q = if (length = 0) then 0 else if (slope=0) then cw*length*d<sub>0</sub><sup>1.5</sup> else cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) ဖြင့် d<sub>1</sub> နှင့် d<sub>0</sub> သည် အမြဲတမ်း သုည သို့မဟုတ် အပေါင်းကိန်းများဖြစ်သည်';
// Orifice Flow
$ec_lang['or_main_menu']='ဂေါက်ဝမှ စီးဆင်းမှု';
$ec_lang['or_main_title']='အခမဲ့ အွန်လိုင်း ဂေါက်ဝမှ စီးဆင်းမှု တွက်ချက်မှုကိရိယာ';
$ec_lang['or_main_desc']='ဂေါက်ဝမှ စီးဆင်းမှု — လွတ်လပ်သော သို့မဟုတ် နစ်မွန်းသော';
$ec_lang['or_shape_circular']='စက်ဝိုင်းပုံ';
$ec_lang['or_shape_rectangular']='ထောင့်မှန်စတုဂံပုံ';
$ec_lang['or_diameter']='<span class="ec-help" title="စက်ဝိုင်းအတွက် အချင်း; ထောင့်မှန်အတွက် အမြင့်">အချင်း သို့မဟုတ် အမြင့်, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="ထောင့်မှန်ဖွင့်လှစ်မှုများသာ">အကျယ်, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="ဖွင့်လှစ်မှုအောက်ဘက်">အောက်ခြေအမြင့် <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='ရေတက်ဘက်ရေမြင့်ဆင့်';
$ec_lang['or_twe']='ရေဆင်းဘက်ရေမြင့်ဆင့်';
$ec_lang['or_cd']='ရေထွက်ကိန်း, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='ဗဟိုချက်အမြင့်';
$ec_lang['or_head']='<span class="ec-help" title="ရေ၏ အလေးချိန်ယူနစ်တစ်ခုအတွက် စွမ်းအင်ဖြစ်ပြီး — ရေတိုင်၏ အမြင့်တစ်ခုအဖြစ် ဖော်ပြသည်၊ ဖိအားမဟုတ်ပါ။">ထိရောက်သောခေါင်းဆုံး, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='ဖွင့်လှစ်ဧရိယာ, A';
$ec_lang['or_regime']='ဂေါက်ဝပုံစံစစ်ဆေးမှု';
$ec_lang['or_regime_valid']='လွတ်လပ်သောကျဆင်းမှု';
$ec_lang['or_regime_submerged']='နစ်မွန်းသောဂေါက်ဝ';
$ec_lang['or_regime_submerged_tip']='TWE သည် ဗဟိုချက်အထက်တွင် — ဂေါက်ဝပုံစံ ဆက်လက်မှန်ကန်နေသည်';
$ec_lang['or_regime_warn']='ဂေါက်ဝပုံစံအပြင်ဘက်';
$ec_lang['or_regime_warn_tip']='ရေတက်ဘက်ရေသည် ဂေါက်ဝထိပ်အောက်တွင်ရှိသည်';
$ec_lang['or_regime_twe_above_hwe']='ထည့်သွင်းချက်များ စစ်ဆေးပါ';
$ec_lang['or_regime_twe_above_hwe_tip']='ရေဆင်းဘက်ရေမြင့်ဆင့် (TWE) သည် ရေတက်ဘက်ရေမြင့်ဆင့် (HWE) အထက်တွင်ရှိသည်';
$ec_lang['or_notes_1_term']='ဂေါက်ဝညီမျှခြင်း';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). လွတ်လပ်သောကျဆင်းမှုအတွက်: h = HWE − ဗဟိုချက်. နစ်မွန်းသောစီးဆင်းမှု (အောက်ခြေအပေါ်တွင် TWE): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='ဂေါက်ဝပုံစံ';
$ec_lang['or_notes_2_def']='ရေတက်ဘက်ရေမျက်နှာပြင်သည် ဖွင့်လှစ်မှု၏ ထိပ် (အပေါ်ဆုံးအပိုင်း) အပေါ်တွင်ရှိသောအခါ ဂေါက်ဝစီးဆင်းမှုညီမျှခြင်းများ သက်ဆိုင်သည်။ ရေတက်ဘက်ရေသည် ထိပ်အောက်တွင်ရှိသောအခါ ၎င်းအစား ဆည်တမံညီမျှခြင်းကို အသုံးပြုပါ။';
$ec_lang['or_notes_3_term']='ရေထွက်ကိန်း';
$ec_lang['or_notes_3_def']='C<sub>d</sub> သည် ချွန်ထက်သောဘောင်ပါ ဂေါက်ဝများအတွက် ၀.၆၀–၀.၆၅ ခန့်ဖြစ်သည်။ ဝိုင်းသော သို့မဟုတ် ပြန်ဝင်သောဝင်ပေါက်များသည် ကွဲပြားသောတန်ဖိုးများ အသုံးပြုသည်။ လမ်းညွှန်မှုအတွက် <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> သို့မဟုတ် HEC-RAS Hydraulic Reference Manual ကို ကြည့်ပါ။';
$ec_lang['or_notes_4_term']='နစ်မွန်းမှု';
$ec_lang['or_notes_4_def']='TWE သည် ဖွင့်လှစ်မှု၏ အောက်ခြေအပေါ်တွင်ရှိသောအခါ ဤတွက်ချက်မှုကိရိယာသည် h = HWE − TWE ကိုအသုံးပြု၍ နစ်မွန်းသောဂေါက်ဝညီမျှခြင်းကို အလိုအလျောက်သုံးသည်။ TWE သည် အောက်ခြေတွင်ရှိသော သို့မဟုတ် အောက်တွင်ရှိသောအခါ လွတ်လပ်သောကျဆင်းမှုဟု မှတ်ယူပြီး h = HWE − ဗဟိုချက်ဖြစ်သည်။';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='အသေးစား ရေအားလျှပ်စစ်';
$ec_lang['mhp_main_title']='အခမဲ့ အွန်လိုင်း အသေးစား ရေအားလျှပ်စစ် တွက်ချက်စက်';
$ec_lang['mhp_main_desc']='မြစ်ရေစီးအတိုင်း အသေးစား ရေအားလျှပ်စစ် ထုတ်လုပ်မှု တွက်ချက်စက်';
$ec_lang['mhp_gross_head']='စုစုပေါင်းဖိမြင့်ဆင့်, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="ဖိအားရေပိုက် (ရေပေးပိုက်) အချင်း">ဖိအားရေပိုက် အချင်း, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='အလျား, L';
$ec_lang['mhp_efficiency']='စက်ရုံထိရောက်မှု, η (0–1)';
$ec_lang['mhp_vel_check']='ရေအလျင်နှုန်း စစ်ဆေးမှု';
$ec_lang['mhp_hl_check']='ဖိမြင့်ဆင့်ဆုံးရှုံးမှု စစ်ဆေးမှု';
$ec_lang['mhp_hnet']='အသားတင်ဖိမြင့်ဆင့်, H<sub>net</sub>';
$ec_lang['mhp_power']='ပါဝါထုတ်လုပ်မှု, P';
$ec_lang['mhp_annual_kwh']='P (နှစ်စဉ်စွမ်းအင်)';
$ec_lang['mhp_vel_low']='ရေအလျင်နှုန်း နိမ့်သည်; အနည်ကျမှုနှင့် လေဝင်ရောက်မှု အန္တရာယ်ရှိသည်။';
$ec_lang['mhp_vel_high']='ရေအလျင်နှုန်း မြင့်သည်; အကူးအပြောင်း ဆုံးရှုံးမှုများ၊ ရရှိနိုင်သော စွမ်းအင်နှင့် ရေတုန်ခါမှုကို စစ်ဆေးပါ။';
$ec_lang['mhp_vel_ok_short']='ကောင်း';
$ec_lang['mhp_vel_high_short']='မြင့်';
$ec_lang['mhp_vel_low_short']='နိမ့်';
$ec_lang['mhp_vel_ok_tip']='ဖိအားရေပိုက် ဒီဇိုင်းအတွက် ထိရောက်သောအမြန်နှုန်းအပိုင်းအခြားအတွင်းရှိသည်။';
$ec_lang['mhp_hl_ok_tip']='ဖိမြင့်ဆင့်ဆုံးရှုံးမှုသည် စုစုပေါင်းဖိမြင့်ဆင့်၏ 10% အောက်တွင် ရှိသည်။ ဤပိုက်အရွယ်အစားသည် ကုန်ကျစရိတ် သင့်တင့်သည်။';
$ec_lang['mhp_hl_warn_tip']='ဖိမြင့်ဆင့်ဆုံးရှုံးမှုသည် စုစုပေါင်းဖိမြင့်ဆင့်၏ 10% ကျော်နေသည်။ ပိုကြီးသော ပိုက်ကို စဉ်းစားပါ။';
$ec_lang['mhp_hl_bad_tip']='ဖိမြင့်ဆင့်ဆုံးရှုံးမှုသည် စုစုပေါင်းဖိမြင့်ဆင့်၏ 20% ကျော်နေသည်။ ပိုက်အရွယ်အစားကို ပြန်လည်ချိန်ညှိပါ။';
$ec_lang['mhp_notes_1_term']='ဖိမြင့်ဆင့်ဆုံးရှုံးမှု';
$ec_lang['mhp_notes_1_def']='ဖိအားရေပိုက် စုစုပေါင်းဆုံးရှုံးမှု h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>၊ ဤတွင် h<sub>f</sub> = f(L/D)(v²/2g) သည် Darcy-Weisbach ပွတ်တိုက်ဆုံးရှုံးမှုဖြစ်ပြီး h<sub>m</sub> = k<sub>m</sub>·v²/2g သည် ဝင်ပေါက်၊ ကွေးကွေးနေရာများနှင့် ရေတံခါးများကို ပါဝင်သည်။ အသားတင်ဖိမြင့်ဆင့် H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>။';
$ec_lang['mhp_notes_2_term']='ရေအလျင်နှုန်း';
$ec_lang['mhp_notes_2_def']='ရရှိနိုင်သော အမြင့်ကျဆင်းမှုနှင့် ပိုက်ကုန်ကျစရိတ်အတွက် ရေအလျင်နှုန်း သင့်တော်မှုရှိမရှိ စစ်ဆေးပါ။ အလွန်နိမ့်သော ရေအလျင်နှုန်းသည် ပိုက်အလွန်ကြီးနေခြင်းကို ညွှန်ပြနိုင်ပြီး အလွန်မြင့်သော ရေအလျင်နှုန်းသည် ပွတ်တိုက်ဆုံးရှုံးမှုနှင့် ရေတုန်ခါမှု (water hammer) အန္တရာယ်ကို တိုးစေနိုင်သည်။';
$ec_lang['mhp_notes_3_term']='ဖိမြင့်ဆင့်ဆုံးရှုံးမှု ပစ်မှတ်';
$ec_lang['mhp_notes_3_def']='Penstock (ပေးသွင်းပိုက်) ဆုံးရှုံးမှုသည် စုစုပေါင်းဖိမြင့်ဆင့်၏ ၁၀% အောက်ရှိလျှင် ယေဘုယျအားဖြင့် စီးပွားရေးအရ သင့်တော်သည်။ ပိုက်ကုန်ကျစရိတ်နှင့် ဆုံးရှုံးသော ပါဝါအကြား အကောင်းဆုံး ချိန်ညှိမှုသည် လျှပ်စစ်စွမ်းအင် ဈေးနှုန်း အမြင့်ဆုံး အနေအထားတွင် ၄–၆% ခန့်၌ ကျရောက်လေ့ရှိသည်။';
$ec_lang['mhp_notes_6_term']='ထိရောက်မှု';
$ec_lang['mhp_notes_6_def']='အသေးစား ရေအားလျှပ်စစ်တွင် အသုံးများသော Pelton နှင့် cross-flow တာဘိုင်များအတွက် ပုံမှန်စက်ရုံထိရောက်မှု η သည် 0.70 မှ 0.85 အထိ ရှိသည်။ ဆင်ခြင်တုံတရားရှိသော ပထမဆုံးခန့်မှန်းချက်အဖြစ် 0.75 ကို အသုံးပြုပါ။';
$ec_lang['mhp_notes_7_term']='နှစ်စဉ်စွမ်းအင်';
$ec_lang['mhp_notes_7_def']='နှစ်စဉ်စွမ်းအင်သည် အဆက်မပြတ် အပြည့်အဝ လည်ပတ်မှု (တစ်နှစ်လျှင် ၈၇၆၀ နာရီ) ကို ယူဆသည်။ ရာသီအလိုက် ရေစီးနှုန်း ကွဲပြားမှု၊ ပြုပြင်ထိန်းသိမ်းစဉ် ရပ်ဆိုင်းချိန်နှင့် ဝန်တင်ကိန်းကြောင့် တကယ့်ထုတ်လုပ်မှုသည် ပိုနည်းပါလိမ့်မည်။';

// Orifice Drain Time
$ec_lang['odt_main_menu']='ရေကန် နှင့် တိုင်ကီ ရေထုတ်ချိန်';
$ec_lang['odt_main_title']='အခမဲ့ အွန်လိုင်း ရေကန်၊ ရေလှောင်ကန်နှင့် တိုင်ကီ ရေထုတ်ချိန် တွက်ချက်မှုကိရိယာ (ဂေါက်ဝ)';
$ec_lang['odt_main_desc']='ရေကန်၊ ရေလှောင်ကန် သို့မဟုတ် တိုင်ကီ ရေထုတ်ချိန် — ဂေါက်ဝ ထွက်ပေါက်၊ ကွာဖြတ်ပမာဏနည်းလမ်း';
$ec_lang['odt_h1_elev']='စတင်ရေမျက်နှာပြင်အမြင့်';
$ec_lang['odt_a1']='စတင်ဧရိယာ, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='အဆုံးသတ်ရေမျက်နှာပြင်အမြင့်';
$ec_lang['odt_a0']='ဂေါက်ဝအဆင့်ဧရိယာ, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="အဆုံးသတ်အမြင့်တွင် ကွာဖြတ်ပုံသဏ္ဌာန်မော်ဒယ်မှ ကြားတွက်ချက်">အဆုံးသတ်ဧရိယာ, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='အဆုံးသတ်အမြင့်စစ်ဆေးမှု';
$ec_lang['odt_h2_ok']='အဆုံးသတ်အမြင့်သည် ဂေါက်ဝထိပ်အထက်တွင်ရှိသည်';
$ec_lang['odt_h2_warn']='အဆုံးသတ်အမြင့်သည် ဂေါက်ဝထိပ်တွင် သို့မဟုတ် အောက်တွင်ရှိသည်';
$ec_lang['odt_h2_warn_tip']='ဂေါက်ဝထိပ် = ဗဟိုချက် + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="အချင်း (စက်ဝိုင်း) သို့မဟုတ် အမြင့် (ထောင့်မှန်)">ဂေါက်ဝ D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="ထောင့်မှန်သာ">ဂေါက်ဝအကျယ်, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='ရေချချိန် (စက္ကန့်)';
$ec_lang['odt_t_min']='ရေချချိန် (မိနစ်)';
$ec_lang['odt_t_hr']='ရေချချိန် (နာရီ)';
$ec_lang['odt_t_day']='ရေချချိန် (ရက်)';
$ec_lang['odt_notes_1_term']='ဖော်မြူလာ';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) သည် ခေါင်းဆုံး H မှ ဂေါက်ဝသို့ ရေထုတ်ချိန်ကို ပေးသည်။ ရေထုတ်ချိန် = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), H<sub>1</sub> = စတင်အမြင့် − ဂေါက်ဝအမြင့်, H<sub>2</sub> = အဆုံးသတ်အမြင့် − ဂေါက်ဝအမြင့်.';
$ec_lang['odt_notes_2_term']='နည်းလမ်း';
$ec_lang['odt_notes_2_def']='ကွာဖြတ်ပမာဏနည်းလမ်းသည် အင်တိုင်း သို့မဟုတ် မြောင်းကြောင်းကို ရေမျက်နှာပြင်တွင် စတင်နေရာ A<sub>1</sub> နှင့် ဂေါက်ဝဗဟိုချက်အမြင့်တွင် နေရာ A<sub>0</sub> အကြား ကွာဖြတ်ပိုင်းဟု မော်ဒယ်ပြုသည်။ A<sub>2</sub>၊ အဆုံးသတ်အမြင့်တွင် အင်တိုင်းနေရာ၊ ကွာဖြတ်ပိုင်းမော်ဒယ်ကို အသုံးပြု၍ A<sub>1</sub> နှင့် A<sub>0</sub> မှ ကြားညှိတွက်ချက်သည်။ စတင်မှ အဆုံးသတ်အမြင့်သို့ ရေထုတ်ချိန်သည် H<sub>1</sub> မှ ဂေါက်ဝသို့ စုစုပေါင်းရေထုတ်ချိန်နှင့် H<sub>2</sub> မှ ဂေါက်ဝသို့ ကျန်ရှိသောရေထုတ်ချိန် ခြားနားချက်နှင့် ညီသည်။';
$ec_lang['odt_h1']='<span class="ec-help" title="စတင်ရေမျက်နှာပြင်အမြင့်မှ ဂေါက်ဝဗဟိုချက်အမြင့် နုတ်ချ">စတင်ဖိမြင့်ဆင့်, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='အများဆုံးစီးဆင်းနှုန်း, Q<sub>max</sub>';
$ec_lang['odt_vol']='ထုတ်လွှတ်ပမာဏ';
$ec_lang['odt_sketch_start']='စတင်';
$ec_lang['odt_sketch_end']='အဆုံးသတ်';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='ရေထုတ်ကိရိယာ အကွာအဝေး, S<sub>e</sub>';
$ec_lang['ip_sl']='ဘေးပိုက် အကွာအဝေး, S<sub>l</sub>';
$ec_lang['ip_n_e']='ဘေးပိုက်တစ်ခုလျှင် ရေထုတ်ကိရိယာ အရေအတွက်, n<sub>e</sub>';
$ec_lang['ip_n_l']='ဇုန်တစ်ခုလျှင် ဘေးပိုက် အရေအတွက်, n<sub>l</sub>';
$ec_lang['ip_d']='ပစ်မှတ် ရေသွင်းနက်, d';
$ec_lang['ip_a_e']='ရေထုတ်ကိရိယာတစ်ခုလျှင် ဧရိယာ, A<sub>e</sub>';
$ec_lang['ip_pr']='ရေသွင်းနှုန်း, PR';
$ec_lang['ip_q_lat']='ဘေးပိုက်တစ်ခုလျှင် ရေစီးနှုန်း, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='ဇုန် ရေစီးနှုန်း, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='လည်ပတ်ချိန် (နာရီ)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='မြောင်း ရေစိမ့်ဆင်းမှု';
$ec_lang['cs_main_title']='အခမဲ့ အွန်လိုင်း မြောင်းရေစိမ့်ဆင်းဆုံးရှုံးမှုနှင့် ရေသယ်ပို့ထိရောက်မှု တွက်ချက်စက်';
$ec_lang['cs_main_desc']='မြောင်းရေစိမ့်ဆင်းဆုံးရှုံးမှုနှင့် ရေသယ်ပို့ထိရောက်မှု — ဝင်ရေ-ထွက်ရေ နည်းလမ်း';
$ec_lang['cs_Q_in']='ဝင်ရေစီးနှုန်း, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='ထွက်ရေစီးနှုန်း, Q<sub>out</sub>';
$ec_lang['cs_L']='ပိုက်အပိုင်း အလျား, L';
$ec_lang['cs_Q_loss']='ရေစိမ့်ဆင်း ဆုံးရှုံးနှုန်း, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='တိုင်းတာမှု စစ်ဆေးချက်';
$ec_lang['cs_pct_loss']='ဆုံးရှုံးသောအချိုး';
$ec_lang['cs_Ec']='ရေသယ်ပို့ထိရောက်မှု, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='ထိရောက်မှု အဆင့်သတ်မှတ်ချက်';
$ec_lang['cs_Vol_day']='တစ်နေ့လျှင် ဆုံးရှုံးသောပမာဏ';
$ec_lang['cs_Vol_year']='တစ်နှစ်လျှင် ဆုံးရှုံးသောပမာဏ';
$ec_lang['cs_Q_loss_per_L']='ယူနစ်အလျားတစ်ခုလျှင် ဆုံးရှုံးမှု, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='ရေတန်ဖိုး';
$ec_lang['cs_lining_cost']='အနားကာ ကုန်ကျစရိတ်';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="အနားကာပြီးနောက် ပန်းတိုင်ထားသော ရေသယ်ပို့ထိရောက်မှု; အပိုင်းအစ 0–1">အနားကာ ပန်းတိုင်, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='အနားကာ ဧရိယာ, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='တစ်နှစ်လျှင် ဆုံးရှုံးသောတန်ဖိုး';
$ec_lang['cs_annual_value_recovered']='တစ်နှစ်လျှင် ပြန်လည်ရရှိသောတန်ဖိုး';
$ec_lang['cs_lining_total_cost']='အနားကာ ကုန်ကျစရိတ် စုစုပေါင်း';
$ec_lang['cs_payback_years']='<span class="ec-help" title="ရိုးရှင်းသော ပြန်ဆပ်ကာလ = အနားကာ ကုန်ကျစရိတ် စုစုပေါင်း ÷ တစ်နှစ်လျှင် ပြန်လည်ရရှိသောတန်ဖိုး">ရင်းနှီးငွေ ပြန်ဆပ်ကာလ <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — ရေစိမ့်ဆင်းမှု တွေ့ရှိ';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — တိုင်းတာနိုင်သော ဆုံးရှုံးမှု မရှိပါ';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — တိုင်းတာမှုများကို စစ်ဆေးပါ';
$ec_lang['cs_Ec_good']='ကောင်း — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='အတော်အသင့် — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='ညံ့ — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='ဝင်ရေ-ထွက်ရေ နည်းလမ်းသည် မြောင်းပိုက်အပိုင်း၏ အစနှင့်အဆုံးတွင် ရေစီးနှုန်းကို တိုင်းတာခြင်းဖြင့် ရေစိမ့်ဆင်းမှုကို ခန့်မှန်းသည်: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>။ ရေသယ်ပို့ထိရောက်မှု E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>။ တစ်နှစ်လျှင်ပမာဏသည် အဆက်မပြတ် အပြည့်စီးဆင်းမှု လည်ပတ်နေသည်ဟု ယူဆထားသည်; ရာသီအလိုက် သို့မဟုတ် တစ်ပိုင်းတစ်စ စီးဆင်းသော မြောင်းများအတွက် တကယ့်ဆုံးရှုံးမှုသည် ပိုနည်းပါလိမ့်မည်။';
$ec_lang['cs_notes_2_term']='ထိရောက်မှု အဆင့်သတ်မှတ်ချက်များ';
$ec_lang['cs_notes_2_def']='ပုံမှန် အနားမကာသော မြေမြောင်းများ: E<sub>c</sub> = 60–80%။ ကောင်းစွာ ထိန်းသိမ်းထားသော မြေမြောင်းများ: 75–85%။ ကွန်ကရစ်အနားကာ မြောင်းများ: 90–98%။ ဝင်ရေစီးနှုန်း၏ 30% ကျော် ရေစိမ့်ဆင်းဆုံးရှုံးမှုသည် များသောအားဖြင့် အနားကာ ရင်းနှီးမြှုပ်နှံမှုကို တန်ဖိုးရှိစေသည်။ (USBR, FAO)';
$ec_lang['cs_notes_3_term']='အနားကာ ရင်းနှီးငွေပြန်ဆပ်မှု';
$ec_lang['cs_notes_3_def']='ရေတန်ဖိုးနှင့် အနားကာကုန်ကျစရိတ်ကို မည်သည့်ငွေကြေးဖြင့်မဆို တသမတ်တည်း ထည့်သွင်းပါ။ အနားကာဧရိယာ = ပိုက်အပိုင်းအလျား × စိုစွတ်နယ်နိမိတ် — တိုင်းတာထားသော ရေနက်တွင် မြောင်းဖြတ်ပိုင်း၏ စိုစွတ်သောနယ်နိမိတ် (ကြမ်းခင်းအကျယ်နှင့် စောင်းကာနှစ်ဖက်စလုံး၏ စိုစွတ်မှု)။ တစ်နှစ်လျှင် ပြန်လည်ရရှိသောတန်ဖိုးသည် အနားကာပြီးသော မြောင်းသည် ပန်းတိုင် E<sub>c</sub> ကို အဆက်မပြတ် ရရှိသည်ဟု ယူဆသည်။ ရာသီအလိုက်စီးဆင်းသော မြောင်းများ သို့မဟုတ် အနားကာမှုသည် ပန်းတိုင်ထိရောက်မှုသို့ မရောက်ပါက တကယ့်ပြန်ဆပ်ကာလသည် ပိုကြာပါလိမ့်မည်။';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>၊ ၃ ကြိမ်မြောက်ထုတ်ဝေမှု (2001)။ FAO Irrigation and Drainage Paper 57 (1999)။';
// About
$ec_lang['about_main_menu']='အကြောင်း';
$ec_lang['install_main_menu']='ထည့်သွင်း';
$ec_lang['install_main_title']='EngCalcs ထည့်သွင်းရန်';
$ec_lang['install_main_desc']='အင်တာနက်မရှိဘဲ သုံးရန် သင့်စက်တွင် ထည့်ပါ';
$ec_lang['install_intro']='EngCalcs သည် Progressive Web App (PWA) တစ်ခုဖြစ်သည်။ တစ်ကြိမ်ထည့်သွင်းပြီးလျှင် တွက်ချက်စက်အားလုံးကို အင်တာနက်မလိုဘဲ အပြည့်အဝ အသုံးပြုနိုင်ပါသည်။';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>တွက်ချက်စက်စာမျက်နှာတစ်ခုခုကို Chrome ဖြင့်ဖွင့်ပါ။</li><li>အပေါ်ဘက် လမ်းညွှန်ဘားရှိ <strong>⬇ ထည့်သွင်းရန်</strong> ခလုတ်ကိုနှိပ်ပါ၊ သို့မဟုတ် ဘရောက်ဇာ မီနူး (⋮) ကိုနှိပ်ပြီး <strong>ပင်မစာမျက်နှာသို့ ထည့်ရန်</strong> ကိုရွေးပါ။</li><li>ပေါ်လာသော ညွှန်ကြားချက်ဘောက်တွင် <strong>ထည့်သွင်းရန်</strong> ကိုနှိပ်ပါ။</li><li>EngCalcs သည် သင့်ဖုန်း ပင်မစာမျက်နှာပေါ်တွင်ပေါ်လာပြီး အင်တာနက်မလိုဘဲ အလုပ်လုပ်ပါလိမ့်မည်။</li>';
$ec_lang['install_now_btn']='⬇ ယခုထည့်သွင်းပါ';
$ec_lang['install_prompt_unavailable']='ထည့်သွင်းမှု ညွှန်ကြားချက်ဘောက် မရရှိနိုင်ပါ — ကျေးဇူးပြု၍ သင့်ဘရောက်ဇာ မီနူးကို အသုံးပြုပါ။';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>တွက်ချက်စက်စာမျက်နှာတစ်ခုခုကို Safari ဖြင့်ဖွင့်ပါ။</li><li>အပေါ်သို့ချိန်ညွှန်နေသော မြှားပါသည့် <strong>မျှဝေရန်</strong> ခလုတ်ကိုနှိပ်ပါ။</li><li>အောက်သို့ဆွဲချပြီး <strong>ပင်မစာမျက်နှာသို့ ထည့်ရန်</strong> ကိုနှိပ်ပါ။</li><li><strong>ထည့်ရန်</strong> ကိုနှိပ်ပါ။ EngCalcs သည် သင့်ပင်မစာမျက်နှာပေါ်တွင်ပေါ်လာပါလိမ့်မည်။</li>';
$ec_lang['install_ios_note']='iOS တွင် ထည့်သွင်းရန်အတွက် မျှဝေရန် မီနူးကိုသာ အမြဲအသုံးပြုရပြီး၊ အလိုအလျောက်ပေါ်လာသော ထည့်သွင်းမှု ညွှန်ကြားချက်ဘောက် မရှိပါ။';
$ec_lang['install_desktop_heading']='ကွန်ပျူတာ (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>တွက်ချက်စက်စာမျက်နှာတစ်ခုခုကိုဖွင့်ပါ။</li><li>ဘရောက်ဇာ၏ လိပ်စာဘားရှိ <strong>ထည့်သွင်းမှုသင်္ကေတ</strong> (⊕ သို့မဟုတ် ကွန်ပျူတာပုံ) ကိုနှိပ်ပါ၊ သို့မဟုတ် ဘရောက်ဇာ မီနူးကိုဖွင့်ပြီး <strong>EngCalcs ထည့်သွင်းရန်…</strong> ကိုရွေးပါ။</li><li><strong>ထည့်သွင်းရန်</strong> ကိုနှိပ်ပါ။ EngCalcs သည် သီးခြားအက်ပလီကေးရှင်း ဝင်းဒိုးတစ်ခုအနေဖြင့် ပွင့်လာပါလိမ့်မည်။</li>';
$ec_lang['install_firefox_heading']='Firefox / အခြား ဘရောက်ဇာများ';
$ec_lang['install_firefox_body']='သင့်ဘရောက်ဇာတွင် ထည့်သွင်းရန် ရွေးချယ်စရာ မရှိပါက၊ ဆုံးရှုံးစရာ မရှိပါ - တွက်ချက်စက်များကို ဘရောက်ဇာထဲတွင် ပုံမှန်အတိုင်း အသုံးပြုနိုင်ပြီး၊ သင် ပထမဆုံးအကြိမ် ဝင်ရောက်ကြည့်ရှုပြီးနောက် စာမျက်နှာများကို အင်တာနက်မလိုဘဲ အသုံးပြုနိုင်ရန် အလိုအလျောက် သိမ်းဆည်းပေးပါလိမ့်မည်။ ဒက်စ်တော့ပေါ်ရှိ Firefox သည် ဤသို့ဖြစ်လေ့ရှိသော ဘရောက်ဇာဖြစ်သည်။';
$ec_lang['install_cached_heading']='မည်သည့်အရာများကို သိမ်းဆည်းသနည်း';
$ec_lang['install_cached_body']='EngCalcs ကို ပထမဆုံးအကြိမ် ထည့်သွင်းသည့်အခါ တွက်ချက်စက်စာမျက်နှာများနှင့် ၎င်းတို့ကိုအထောက်အကူပြုသည့်ဖိုင်များ (စကရစ့်နှင့် စတိုင်ဖိုင်များ) အားလုံးကို သင့်စက်ပေါ်တွင် အလိုအလျောက် သိမ်းဆည်းပေးပါသည်။ ထို့နောက် အားလုံးကို အင်တာနက်မလိုဘဲ အသုံးပြုနိုင်ပါသည်။ သင့်ဘာသာစကားရွေးချယ်မှုကို နောက်ဆုံးအွန်လိုင်းဝင်ရောက်ခဲ့သည့်အချိန်မှ မှတ်သားထားပါသည်။';
$ec_lang['contact_main_menu']='ဆက်သွယ်ရန်';
$ec_lang['about_main_title']='HawsEDC အင်ဂျင်နီယာ ကိရိယာများ အကြောင်း';
$ec_lang['about_main_desc']='ရည်ရွယ်ချက်၊ လွတ်လပ်သော ဆော့ဖ်ဝဲနှင့် ပါဝင်ကူညီမှု';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>မစ်ရှင်</h3><p>HawsEDC အင်ဂျင်နီယာ ဂဏန်းတွက်စက်များသည် ကမ္ဘာတစ်ဝန်းရှိ အင်ဂျင်နီယာများနှင့် နေ့တနေ့ပြင်ပကွင်းဆင်းသူများကို ဝန်ဆောင်မှုပေးရန်ရှိသည် — အထူးသဖြင့် ရေအသုံးအနှုန်းနည်းသော၊ အရင်းအမြစ်ကန့်သတ်ထားသော သို့မဟုတ် ဝန်ဆောင်မှုမလုံလောက်သောဒေသများတွင် အလုပ်လုပ်သူများအတွက်ဖြစ်သည်။ ဤကိရိယာများသည် ကျယ်ပြန့်သော လူသားအကျိုးပြုတာဝန်၏ အစိတ်အပိုင်းတစ်ခုဖြစ်သည်: လူတိုင်းကို တတ်နိုင်သမျှ လက်တွေ့ကျကျနှင့် ထိရောက်စွာ ပြောကြားရန် — သူတို့ကို ထာဝရချစ်ကြည်နှစ်သက်ကြောင်းနှင့် တန်ဖိုးထားကြောင်း၊ ကြောက်ရွံ့ဖွယ်ဘာမျှမရှိကြောင်းနှင့် သူတို့သည် အရာအားလုံးကို ပျက်စီးစေမည်မဟုတ်ကြောင်း ပြောကြားရန်ဖြစ်သည်။</p><p>ဂဏန်းတွက်စက်များသည် ယာဉ်ဖြစ်သည်။ ဦးတည်ရာသည် ဝေဒနာမဲ့ကမ္ဘာဖြစ်သည်။</p><h3>လွတ်လပ်သော ပွင့်လင်းအရင်းအမြစ် လိုင်စင်</h3><p>ကုဒ်အားလုံးကို <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 သို့မဟုတ် နောက်ပိုင်း</a> အောက်တွင် ထုတ်ပြန်ထားသည် — အခကြေးငွေအဓိပ္ပာယ်မဟုတ်ဘဲ လွတ်လပ်ခွင့်အဓိပ္ပာယ်ဖြင့် လွတ်လပ်သည်။ တူညီသောစည်းမျဉ်းများအောက်တွင် ကုဒ်ကို အသုံးပြု၊ လေ့လာ၊ ပြောင်းလဲ နှင့် ဖြန့်ဝေနိုင်သည်။</p><p>ဤသည် ဖိတ်ခေါ်ချက်တစ်ခုဖြစ်သည်၊ ဈေးနှုန်းတစ်ခုမဟုတ်ပါ။ ငွေပေးရသော အဆင့်မရှိ၊ ရုတ်တရက် ရုပ်သိမ်းနိုင်သော အခမဲ့အဆင့်လည်း မရှိ၊ ကုဒ်သည် သင့်ပိုင်ဆိုင်မှုဖြစ်လာရန် ကြာမြင့်မှုလည်း မရှိပါ။ ယနေ့ သင်မြင်နေရသော အပြည့်အစုံဗားရှင်းသည် အားလုံးအတွက် ယခုမှစ၍ ထာဝစဉ် အခမဲ့ အသုံးပြုနိုင်ပြီး ပြောင်းလဲနိုင်သည်။</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Source Code</h3><p>ပြည့်စုံသော source code ကို GitHub တွင် အများပြည်သူ ရနိုင်သည်:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>ကုဒ်ကို ကြည့်ရှု၊ ပြဿနာများ တင်ပြ၊ သို့မဟုတ် repository ကို fork ပြုလုပ်နိုင်သည်။</p><h3>ပါဝင်ကမ်းလှမ်းခြင်း</h3><p>အကူအညီအားလုံးကို ကြိုဆိုသည်။ <a href="contact.php">Tom Haws ကို ဆက်သွယ်ပါ</a>။</p><ul><li><strong>ဘာသာပြန်ဆိုခြင်း</strong> — ပိုမိုကောင်းမွန်သော အသုံးအနှုန်းများကို အကြံပြုပါ။ ဘာသာစကားတစ်ခုကို တိုးတက်စေ သို့မဟုတ် အသစ်ထည့်ပါ။</li><li><strong>Bug reports</strong> — မည်သည့် ဂဏန်းတွက်စက်စာမျက်နှာတွင်မဆို တုံ့ပြန်ချက်ဖောင်ကို သုံးပါ၊ သို့မဟုတ် GitHub တွင် ပြဿနာတင်ပြပါ။</li><li><strong>ဂဏန်းတွက်စက်အသစ်များ</strong> — ကွင်းဆင်းသူများနှင့် ဆည်မြောင်းကျွမ်းကျင်သူများကို ဝန်ဆောင်မှုပေးသော ဟိုက်ဒရောလစ် အင်ဂျင်နီယာ ကိရိယာများအတွက် အကြံဉာဏ်များကို အထူးကြိုဆိုသည်။</li><li><strong>Hosting</strong> — ချိတ်ဆက်မှုကန့်သတ်ထားသောဒေသအတွက် ဤဂဏန်းတွက်စက်များကို mirror ပြုလုပ်နိုင်ပါက ကျေးဇူးပြု၍ ဆက်သွယ်ပါ။</li></ul><h3>အင်တာနက်မဲ့ အသုံးပြုခြင်း</h3><p>ဤဂဏန်းတွက်စက်များသည် <strong>Progressive Web App (PWA)</strong> အဖြစ် လုပ်ဆောင်သည်။ အင်တာနက်ချိတ်ဆက်ထားစဉ် ဂဏန်းတွက်စက် မည်သည့်စာမျက်နှာကိုမဆို ဝင်ရောက်ကြည့်ရှုပါ၊ သင့်ဘရောင်ဇာသည် ဂဏန်းတွက်စက်အားလုံးကို အလိုအလျောက် သိမ်းဆည်းမည်ဖြစ်သည်။ ထိုနောက် ဂဏန်းတွက်စက်အားလုံးသည် အင်တာနက်မဲ့ အသုံးပြုနိုင်သည် — အင်တာနက်မလိုအပ်ပါ။</p><p>Android သို့မဟုတ် iOS တွင် EngCalcs ကို သင့်စက်ပစ္စည်းတွင် အက်ပ်တစ်ခုအဖြစ် ထည့်သွင်းရန် ဘရောင်ဇာ၏ "ပင်မမျက်နှာပြင်တွင် ထည့်ပါ" ရွေးချယ်မှုကို အသုံးပြုပါ။ ကွန်ပျူတာတွင် ဘရောင်ဇာ၏ လိပ်စာဘားတွင် ထည့်သွင်းရေး အိုင်ကွန်ကို ရှာဖွေပါ။</p><p>တစ်ကြိမ်သုံးအတွက် ဂဏန်းတွက်စက်တစ်ခုချင်းစီကို ဘရောင်ဇာ၏ "အမည်ဖြင့် သိမ်းဆည်းပါ…" မီနူးကို အသုံးပြု၍ သိမ်းဆည်းနိုင်သည်။</p><h3>ဆက်သွယ်ရန်</h3><p>Tom Haws — ဟိုက်ဒရောလစ် အင်ဂျင်နီယာနှင့် ဤဂဏန်းတွက်စက်များ၏ ရေးသားသူ။<br />မည်သည့် ဂဏန်းတွက်စက်စာမျက်နှာတွင်မဆို တုံ့ပြန်ချက်ဖောင်ကို သုံးပါ သို့မဟုတ် <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a> တွင် source code ကို ဝင်ရောက်ကြည့်ရှုပါ။</p>';
$ec_lang['contactSendMessage']='Tom Haws ထံ မက်ဆေ့ပေးပို့ပါ';
$ec_lang['contactYourName']='သင့်နာမည်:';
$ec_lang['contactYourEmail']='သင့်အီးမေးလ်လိပ်စာ:';
$ec_lang['contactSubject']='အကြောင်းအရာ:';
$ec_lang['contact_message']='မက်ဆေ့:';
$ec_lang['contactSpamPrefix']='ငါးပေါင်း တစ်ညီ';
$ec_lang['contactSpamPostfix']='(ကျေးဇူးပြု၍ စကားလုံးဖြင့် ရေးပါ။ 1=တစ် 2=နှစ် 3=သုံး 4=လေး 5=ငါး 6=ခြောက် 7=ခုနစ် +=ပေါင်း 5+1=6)';
$ec_lang['contactSubmitButton']='မက်ဆေ့တင်ပြရန်';
$ec_lang['contact_success']='ရေးပေးသည့်အချိန်များအတွက် ကျေးဇူးတင်ပါသည်။';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='ကျောက်ထောင်ချောင်း ဒီဇိုင်း (Robinson)';
$ec_lang['rc_main_title']='အခမဲ့ အွန်လိုင်း ကျောက်ထောင်ချောင်း ဒီဇိုင်း တွက်ချက်စက် — Robinson (1998)';
$ec_lang['rc_main_desc']='ကျောက်ထောင်ချောင်း ကျောက်ကာ အရွယ်အစား သတ်မှတ်ခြင်း — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='ချောင်းကြမ်းခင်း လျောစောင်းနှုန်း, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="ကျောက်ထောင်ချောင်း ဝင်ပေါက်တွင် အနံတစ်ယူနစ်လျှင် စီးဆင်းမှု။ ကြမ်းခင်းအနံ B ရှိပြီး စီးဆင်းမှု စုစုပေါင်း Q ရှိသော ချောင်းတစ်ခုအတွက် q_t = Q / B ကို အသုံးပြုပါ။">ယူနစ်စီးဆင်းမှု စုစုပေါင်း, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='ကျောက်ကာ အပေါက်ပါမှုနှုန်း, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="ရေနှင့်နှိုင်းယှဉ်သော သိပ်သည်းဆ။ ပုံမှန် ကျောက်ကြေ (granite) သို့မဟုတ် ကျောက်နက် (basalt) ≈ 2.65 ဖြစ်သည်။ Robinson သက်ဆိုင်မှု အပိုင်းအခြား: 2.54 မှ 2.82။">ကျောက် အလေးချိန်နှုန်း, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="ကျောက်အရွယ်အစားဖြန့်ဝေမှု စံသွေဖည်ချက်။ တစ်ပုံစံတည်း ကျောက် ≈ 1.25။ Robinson သက်ဆိုင်သည့်အပိုင်းအခြား: 1.15 မှ 1.47။">ကျောက်အရွယ်အစားဖြန့်ဝေမှု SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="ရေဝပ်မှု (Hp > yn) ကောင်းသည် — အပေါ်ဘက် ရေတိုက်စားမှုကို လျှော့ချသည်။ (USDA)">ဝင်ပေါက်ချောင်းရှိ ပုံမှန်ရေနက်မှု, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="ညီမျှခြင်း 1 (S0 < 0.10) သို့မဟုတ် ညီမျှခြင်း 2 (0.10-0.40)။ သက်ဆိုင်မှု: D50 15-278 mm, S0 0.02-0.40။ အပိုင်းအခြားပြင်ပ: တွက်ချက်ခန့်မှန်းထားခြင်း။">လိုအပ်သော ကျောက်အလယ်အလတ်အရွယ်အစား, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='အသုံးပြုသော ညီမျှခြင်း';
$ec_lang['rc_sg_check']='အလေးချိန်နှုန်း စစ်ဆေးမှု';
$ec_lang['rc_SD_check']='ကျောက်အရွယ်အစားဖြန့်ဝေမှု SD စစ်ဆေးမှု';
$ec_lang['rc_sg_ok']='sg သည် သက်ဆိုင်သည့် အပိုင်းအခြားအတွင်းရှိသည်';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']='sg သည် Robinson အပိုင်းအခြားအောက် ကျဆင်း';
$ec_lang['rc_sg_low_tip']='သက်ဆိုင်သည့် အပိုင်းအခြား: 2.54–2.82';
$ec_lang['rc_sg_high']='sg သည် Robinson အပိုင်းအခြားထက် ကျော်လွန်';
$ec_lang['rc_sg_high_tip']='သက်ဆိုင်သည့် အပိုင်းအခြား: 2.54–2.82';
$ec_lang['rc_SD_ok']='SD သည် သက်ဆိုင်သည့် အပိုင်းအခြားအတွင်းရှိသည်';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']='SD သည် Robinson အပိုင်းအခြားအောက် ကျဆင်း';
$ec_lang['rc_SD_low_tip']='သက်ဆိုင်သည့် အပိုင်းအခြား: 1.15–1.47';
$ec_lang['rc_SD_high']='SD သည် Robinson အပိုင်းအခြားထက် ကျော်လွန်';
$ec_lang['rc_SD_high_tip']='သက်ဆိုင်သည့် အပိုင်းအခြား: 1.15–1.47';
$ec_lang['rc_layer']='ကျောက်အလွှာ ထူမှု (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='ထိပ်ဆုံး ကွေးမျဉ်း အချင်းဝက် (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='ထိပ်ဆုံး ကွေးမျဉ်း၏ ကွေးလိုက်အလျား';
$ec_lang['rc_apron_length']='<span class="ec-help" title="ချောင်းကျောက်၏ ဖွဲ့စည်းပုံ ထောက်ပံ့မှုအတွက် လိုအပ်သည်။ “ထွက်ပေါက်ပိုင်းနှင့် အောက်ဘက်ချောင်း ခုခံမှုကြောင့် ဖြစ်ပေါ်သော အနည်းဆုံး အောက်ဘက်ရေမျက်နှာ သည် ထွက်ပေါက်ပိုင်းရှိ ကျောက်ကာ တည်ငြိမ်မှုကို သေချာစေရန် လုံလောက်သည်။” (Robinson)">ထွက်ပေါက် ကြိုပြင် အလျား (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='ချောင်းအတွင်း Manning ကြမ်းတမ်းမှုနှုန်း, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="qt ၏ ကျောက်အပေါက်များမှ ဖြတ်သန်းစီးဆင်းသော ပမာဏ။ ကျန်ရှိသော qs သည် မျက်နှာပြင်ပေါ်မှ စီးဆင်းသည်။ ထောင့်ချွန်ကျောက်ကြေအတွက် np မူလတန်ဖိုး = 0.45။">ကျောက်အလွှာ ဖြတ်သန်း ရေအလျင်နှုန်း, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='အလွှာဖြတ်သန်း ယူနစ်စီးဆင်းမှု, q<sub>m</sub>';
$ec_lang['rc_qs']='မျက်နှာပြင် ယူနစ်စီးဆင်းမှု, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='ကျောက်ကာ မျက်နှာပြင်အပေါ် ရေစီးနက်မှု, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="ရေဝပ်မှု (Hp > yn) ကောင်းသည် — အပေါ်ဘက် ရေတိုက်စားမှုကို လျှော့ချသည်။ (USDA)">ဝင်ပေါက် ဆည်တမံ ရေမျက်နှာပြင်အမြင့်, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='ဝင်ပေါက် ရေဝပ်မှု စစ်ဆေးမှု';
$ec_lang['rc_pond_ok']='H<sub>p</sub> > y<sub>n</sub> — အပေါ်ဘက်တွင် ရေဝပ်မှုရှိ';
$ec_lang['rc_pond_ok_tip']='ချောင်းဝင်ပေါက်၏ အပေါ်ဘက်တွင် ရေဝပ်မှုရှိခြင်းသည် ကောင်းသည်; ၎င်းသည် အပေါ်ဘက် ရေတိုက်စားမှုကို လျှော့ချသည်။ (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — ရေဝပ်မှု မရှိ — ဝင်ပေါက် ရေတိုက်စားနိုင်ခြေ';
$ec_lang['rc_pond_warn_tip']='ချောင်းဝင်ပေါက်၏ အပေါ်ဘက်တွင် ရေဝပ်မှု မရှိပါ; အပေါ်ဘက်တွင် ရေတိုက်စားမှု ဖြစ်ပေါ်နိုင်သည်။ (USDA)';
$ec_lang['rc_eq1']='ညီမျှခြင်း 1 (S<sub>0</sub> < 0.10) — ညင်သာသော လျောစောင်း';
$ec_lang['rc_eq2']='ညီမျှခြင်း 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — ကျစောက်သော လျောစောင်း';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — Robinson သက်ဆိုင်မှုအပိုင်းအခြားအောက် ကျဆင်း';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — Robinson သက်ဆိုင်မှုအပိုင်းအခြားထက် ကျော်လွန်';
$ec_lang['rc_notes_1_term']='ကျောက်အရွယ်အစား ညီမျှခြင်းများ';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) သည် ချောင်းလျောစောင်းနှုန်းနှင့် ယူနစ်စီးဆင်းမှုကို အခြေခံ၍ ကျောက်ကာ အလယ်အလတ်အရွယ်အစား D<sub>50</sub> အတွက် စမ်းသပ်ရလဒ် ညီမျှခြင်း နှစ်ခုကို ရေးဆွဲခဲ့သည်။ ညီမျှခြင်း 1 သည် ညင်သာသော လျောစောင်းများအတွက် (S<sub>0</sub> < 0.10) သက်ဆိုင်ပြီး; ညီမျှခြင်း 2 သည် ကျစောက်သော လျောစောင်းများအတွက် (0.10 ≤ S<sub>0</sub> ≤ 0.40) သက်ဆိုင်သည်။ ညီမျှခြင်းနှစ်ခုစလုံးသည် q<sub>t</sub> ကို m²/s ဖြင့် လိုအပ်ပြီး D<sub>50</sub> ကို mm ဖြင့် ပြန်ပေးသည်။ အတည်ပြုထားသော အပိုင်းအခြားမှာ 0.02 ≤ S<sub>0</sub> ≤ 0.40 ဖြစ်သည်။';
$ec_lang['rc_notes_2_term']='ယူနစ်စီးဆင်းမှု';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> သည် ချောင်းထိပ်တွင် ယူနစ်စီးဆင်းမှု စုစုပေါင်း (အနံတစ်ယူနစ်လျှင် စီးဆင်းမှု စုစုပေါင်း) ဖြစ်သည်။ ကြမ်းခင်းအနံ B ရှိပြီး စီးဆင်းမှု စုစုပေါင်း Q သယ်ဆောင်သော ချောင်းတစ်ခုအတွက် q<sub>t</sub> ≈ Q / B ဟု ခန့်မှန်းပါ၊ သို့မဟုတ် ချောင်းဝင်ပေါက်ရှိ အကျပ်ရေနက်မှု အခြေအနေမှ တွက်ချက်ပါ။';
$ec_lang['rc_notes_3_term']='ကျောက်အလွှာ ဖြတ်သန်းစီးဆင်းမှု';
$ec_lang['rc_notes_3_def']='စီးဆင်းမှု စုစုပေါင်း၏ တစ်စိတ်တစ်ပိုင်းသည် ကျောက်ကာ၏ အပေါက်များမှ ဖြတ်သန်းစီးဆင်းသည် (အလွှာစီးဆင်းမှု q<sub>m</sub>); ကျန်ရှိသောအပိုင်းသည် ကျောက်မျက်နှာပြင်အပေါ်မှ စီးဆင်းသည် (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>)။ ရေစီးနက်မှု d ကို ချောင်းကြမ်းတမ်းမှုနှုန်း n ကို အသုံးပြု၍ မျက်နှာပြင်စီးဆင်းမှု q<sub>s</sub> အပေါ် ကျင့်သုံးသည့် Manning’s ညီမျှခြင်းမှ တွက်ချက်သည်။ ထောင့်ချွန်ကျောက်ကြေအတွက် မူလ အပေါက်ပါမှုနှုန်း n<sub>p</sub> = 0.45 ပုံမှန်ဖြစ်သည်။';
$ec_lang['rc_notes_5_term']='သက်ဆိုင်သည့် ကျောက်အရွယ်အစား အပိုင်းအခြား';
$ec_lang['rc_notes_5_def']='ဤညီမျှခြင်းများကို D<sub>50</sub> အပိုင်းအခြား 15 mm မှ 278 mm အထိ အသုံးပြု၍ ရေးဆွဲခဲ့သည်။ ဤအပိုင်းအခြားပြင်ပရှိ ရလဒ်များသည် တွက်ချက်ခန့်မှန်းထားခြင်းဖြစ်ပြီး နောက်ထပ် အင်ဂျင်နီယာဆုံးဖြတ်ချက်နှင့်အတူ အသုံးပြုသင့်သည်။';
$ec_lang['rc_notes_6_term']='ထွက်ပေါက် ကြိုပြင် အမြင့်';
$ec_lang['rc_notes_6_def']='ထွက်ပေါက်ပိုင်းရှိ ကျောက်ကာ၏ ထိပ်ဆုံးအမြင့်သည် အောက်ဘက်ချောင်းကြမ်းခင်းအမြင့်တွင် သို့မဟုတ် ၎င်းအောက်တွင် ရှိသင့်သည်။ ပိုမိုမြင့်ပါက ထွက်ပေါက်ကျောက်သည် တည်ငြိမ်မှုမရှိချေ။';

$ec_lang['rc_notes_7_def']='ဝင်ပေါက်ချောင်းရှိ ပုံမှန်ရေနက်မှုသည် q<sub>t</sub> ကို ဖြတ်သန်းစေရန် လိုအပ်သော ဆည်တမံ ရေမျက်နှာပြင်အမြင့် (H<sub>p</sub>) ထက် နည်းသောအခါ၊ ချောင်းဝင်ပေါက်၏ အပေါ်ဘက်တွင် စီးဆင်းမှု ကန့်သတ်ခြင်း သို့မဟုတ် ရေဝပ်မှု ဖြစ်ပေါ်သည်။ ဤသည် ယေဘုယျအားဖြင့် လက်ခံနိုင်သည် — ရေဝပ်မှုသည် ရေအလျင်နှုန်းကို လျှော့ချပြီး အပေါ်ဘက် ရေတိုက်စားမှုကို တားဆီးသည်။ စစ်ဆေးရန်: ပေးထားသော q<sub>t</sub> နှင့် ထိပ်ဆုံးအနံအတွက် H<sub>p</sub> ကို ရှာဖွေရန် ဆည်တမံရေစီး တွက်ချက်စက်ကို အသုံးပြုပြီး ဝင်ပေါက်ချောင်း ပုံမှန်ရေနက်မှုနှင့် နှိုင်းယှဉ်ပါ။ H<sub>p</sub> သည် ပုံမှန်ရေနက်မှုထက် ကျော်လွန်ပါက ရေဝပ်မှု ဖြစ်ပေါ်လိမ့်မည်။';
$ec_lang['rc_notes_4_term']='ကိုးကားချက်';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). “<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>.” <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS သည် တူညီသော နည်းစနစ်ကို အခြေခံ၍ <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel စာရင်းဇယား</a> တစ်ခုကိုလည်း ထုတ်ပြန်ထားသည်။';
// Sketch labels
$ec_lang['rc_sketch_filter']='စစ်ထုတ်အလွှာ';
$ec_lang['rc_sketch_top_crest_curve']='ထိပ်ဆုံး ကွေးမျဉ်း';
$ec_lang['rc_sketch_outlet_apron']='ထွက်ပေါက် ကြိုပြင်';
$ec_lang['rc_sketch_radius']='အချင်းဝက်';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='ရေသွင်းစနစ် ဖိအား';
$ec_lang['ip_main_title']='အခမဲ့ အွန်လိုင်း ဆည်မြောင်းဖိအားနှင့် ဖြန့်ဝေမှုညီမျှမှု တွက်ချက်စက်';
$ec_lang['ip_main_desc']='စမ်းသပ် ဌာနခွဲ ဖိအားနှင့် ညီမျှမှု ခန့်မှန်းချက်';
$ec_lang['ip_h_supply']='ပေးသွင်းဖိအား';
$ec_lang['ip_elev_supply']='ပေးသွင်းအမြင့်, z<sub>supply</sub>';
$ec_lang['ip_q_design']='ရေထုတ်ကိရိယာ ဒီဇိုင်း ရေစီးနှုန်း, q<sub>design</sub>';
$ec_lang['ip_h_design']='ရေထုတ်ကိရိယာ ဒီဇိုင်း ဖိအား';
$ec_lang['ip_x']='<span class="ec-help" title="ပုံမှန် ဖိအားမညှိသော ရေထုတ်ကိရိယာများအတွက် 0.5; ဖိအားညှိ ရေထုတ်ကိရိယာများအတွက် သုညအနီး">ရေထုတ်ကိရိယာ စီးထွက်ထပ်ကိန်း, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='စမ်းသပ် လမ်းကြောင်း';
$ec_lang['ip_group_reach']='ပိုက်အပိုင်း';
$ec_lang['ip_group_upstream']='ရေအထက်ဘက်';
$ec_lang['ip_group_downstream']='ရေအောက်ဘက်';
$ec_lang['ip_group_loss']='ဆုံးရှုံးမှု';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="အမှန်ခြစ်ထားလျှင်: ဤပိုက်အပိုင်းသည် စမ်းသပ်ဘေးပိုက်၏ အပိုင်းတစ်ခုဖြစ်ပြီး ၎င်းမှ ရေထုတ်ကိရိယာတစ်ခုစီက ရေထုတ်ယူသည်။ အမှန်မခြစ်ထားလျှင်: ဤပိုက်အပိုင်းသည် ပင်မပိုက်ဖြစ်ပြီး စမ်းသပ်လမ်းကြောင်းပေါ်တွင် မရှိသော ဘေးပိုက်များထံ ရေစီးနှုန်းကိုသာ ဆက်လက်ပို့ဆောင်ပေးသည်။">ဘေးပိုက် <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="ဘေးပိုက်အတန်းများ: ဤပိုက်အပိုင်းရှိ ရေထုတ်ကိရိယာများသာ။ ပင်မပိုက်အတန်းများ: ဤပိုက်အပိုင်းမှ ခွဲထွက်သည့် ဤတစ်ခုမှလွဲ၍ အခြားဘေးပိုက်များပေါ်ရှိ ရေထုတ်ကိရိယာ စုစုပေါင်း။ စမ်းသပ်ဘေးပိုက်တွင် ဆုံးသည့် ပင်မပိုက်အပိုင်းအတွက်၊ ၎င်းတွင် ထိုနေရာမှလွန်၍ ပင်မပိုက်တစ်လျှောက်ရှိ ဘေးပိုက်များ သို့မဟုတ် တူညီသောဆုံမှတ်ကို မျှဝေသော ဘေးပိုက်များ (ဥပမာ ဆန့်ကျင်ဘက်ဘေးပိုက်) လည်း ပါဝင်သည် — ၎င်းတို့၏ရေစီးနှုန်းသည်လည်း ဤပိုက်အပိုင်းကိုပင် ဖြတ်သန်းသောကြောင့်ဖြစ်သည်။">ရေထုတ်ကိရိယာများ <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="ဤပိုက်အပိုင်း၏ အောက်ဘက်စွန်းအမြင့်။ အတွင်းအတန်းများတွင် ရွေးချယ်နိုင်သည် (ဗလာထားလျှင် ညီညာသည်ဟု / အထက်ဆုံမှတ်နှင့်တူသည်ဟု ပုံသေယူဆသည်)။ နောက်ဆုံးအတန်းတွင် မဖြစ်မနေလိုအပ်သည်: ထိုတန်ဖိုးသည် နောက်ဆုံးရေထုတ်ကိရိယာ၏ အမြင့်ဖြစ်ပြီး လိုအပ်သောပေးသွင်းဖိအားကို တိုက်ရိုက် သတ်မှတ်သည်။">ရေအောက်ဘက် အမြင့် <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='နောက်ဆုံးရေထုတ်ကိရိယာ အမြင့် (နောက်ဆုံးအတန်း) ကို ဗလာချန်ထားခဲ့ပြီး ညီညာသည်ဟု ပုံသေထားသည် — တိကျသောရလဒ်ရရန် ထည့်သွင်းပါ';
$ec_lang['ip_press']='ဖိအား';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="ပိုက်အပိုင်း စုစုပေါင်းဆုံးရှုံးမှု, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='ဖိအားနိမ့်/အနုတ်ဖိအား — လေထုအောက်ဖိအား အခြေအနေရှိမရှိ စစ်ဆေးပါ';
$ec_lang['ip_pressure_warn_short']='နိမ့်';
$ec_lang['ip_pressure_high']='ဖိအားမြင့်သောနေရာများတွင် ဖိအားလျှော့ချမှု လိုအပ်သည်';
$ec_lang['ip_pressure_high_short']='မြင့်';
$ec_lang['ip_max_head']='အများဆုံးခွင့်ပြု ပိုက်ဖိအား';
$ec_lang['ip_max_head_tip']='ဤတန်ဖိုးထက် ဖိအားပိုသော လိုင်းများကို အမှတ်အသားပြုသည်။ ဖိအားမြင့် စစ်ဆေးမှုကို ကျော်လိုပါက ဗလာချန်ထားပါ။';
$ec_lang['ip_h_far']='နောက်ဆုံးရေထုတ်ကိရိယာ ဖိအား';
$ec_lang['ip_q_supply']='<span class="ec-help" title="ပုံစံထုတ်ထားသော စမ်းသပ်လမ်းကြောင်းထဲသို့ ဝင်သည့်ရေစီးနှုန်းသာဖြစ်သည် — ဇုန်/စနစ်တစ်ခုလုံးအတွက် အောက်ရှိ အသုံးချဒီဇိုင်းအပိုင်းရှိ Q_zone ကို ကြည့်ပါ။">စမ်းသပ်လမ်းကြောင်း ပေးသွင်းရေစီးနှုန်း, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='နောက်ဆုံးရေထုတ်ကိရိယာ ရေစီးနှုန်း, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='ပျမ်းမျှ ရေထုတ်ကိရိယာ ရေစီးနှုန်း (စမ်းသပ်ဘေးပိုက်), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="ပုံမှန်ဘေးပိုက်တစ်ခုသည် ဤစမ်းသပ်ဘေးပိုက်ထက် ဖိအားမည်မျှပိုမြင့် (သို့မဟုတ် ပိုနိမ့်) လည်ပတ်သည်ဟု ခန့်မှန်းသနည်း။ စမ်းသပ်ဘေးပိုက်ကို တမင် အဆိုးဆုံးအခြေအနေဟု ယူဆထားသောကြောင့် ၎င်း၏ကိုယ်ပိုင်ပျမ်းမျှသည် လယ်ကွင်းပျမ်းမျှထက် နည်းသောခန့်မှန်းချက်ဖြစ်သည် — 0 တွင်ထားလျှင် အောက်ရှိ ညီမျှမှုစစ်ဆေးချက်နှင့် အသုံးချဒီဇိုင်းကိန်းဂဏန်းများသည် စမ်းသပ်ဘေးပိုက်၏ (အလားအလာကောင်းလွန်းနိုင်သော) ကိုယ်ပိုင်ပျမ်းမျှကို အတိုင်းအတာအတိုင်း သုံးမည်ဖြစ်သည်။">ခန့်မှန်း Δဖိအား၊ ပျမ်းမျှ နှင့် စမ်းသပ်ဘေးပိုက် နှိုင်းယှဉ်ချက် <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral ကို ဘေးပိုက်အတန်းတစ်ခုစီ၏ ဖိအားအပေါ် အထက်ပါ ဖိအားကွာခြားချက်ကို ပေါင်းထည့်ကာ ပြန်လည်တွက်ချက်ထားသည် — စမ်းသပ်ဘေးပိုက်သည် ကိုယ်စားပြုပိုက်တစ်ခုမဟုတ်ဘဲ အဆိုးဆုံးအခြေအနေအဖြစ် ယူဆထားခြင်းအတွက် ပြင်ဆင်ရန် ကြိုးပမ်းချက်ဖြစ်သည်။ ညီမျှမှုစစ်ဆေးချက်နှင့် အောက်ရှိ အသုံးချဒီဇိုင်းအပိုင်း နှစ်ခုလုံးကို ထောက်ပံ့သည်။">ခန့်မှန်း လယ်ကွင်းပျမ်းမျှ ရေထုတ်ကိရိယာ ရေစီးနှုန်း, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="နောက်ဆုံးရေထုတ်ကိရိယာ၏ တွက်ချက်ထားသောရေစီးနှုန်းကို ခန့်မှန်းလယ်ကွင်းပျမ်းမျှ ရေထုတ်ကိရိယာစီးနှုန်းဖြင့် စား၍ရသည် — ဤသည်မှာ စံပြ အောက်ဆုံးလေးပုံတစ်ပုံ ဖြန့်ဝေမှုညီမျှမှု (အောက်အုပ်စုပျမ်းမျှ ÷ စုစုပေါင်းလူဦးရေပျမ်းမျှ) ၏ ခန့်မှန်းတန်ဖိုးဖြစ်သည်; သို့သော် ဤသည်မှာ ပုံစံထုတ်ထားသော နမူနာငယ်နှင့် အသုံးပြုသူ ခန့်မှန်းချက်မှ ရသည်ဖြစ်ပြီး လယ်ကွင်းတစ်ခုလုံး၏ စာရင်းအင်းနမူနာမှ မဟုတ်ပါ။ 1 နှင့်အထက် တန်ဖိုးများသည် ဖြစ်နိုင်ပြီး မှန်ကန်သည့်တန်ဖိုးများဖြစ်သည်: ၎င်းသည် နောက်ဆုံးရေထုတ်ကိရိယာ၏ ဖိအားသည် ခန့်မှန်းလယ်ကွင်းပျမ်းမျှထက် တူညီ သို့မဟုတ် ပိုမြင့်နေသည်ဟု ဆိုလိုရုံဖြစ်ပြီး အခြားရေထုတ်ကိရိယာတစ်ခုသည် အနိမ့်ဆုံးဖိအားရှိသောနေရာ ဖြစ်နိုင်သည်။ ၎င်းသည် နောက်ဆုံးရေထုတ်ကိရိယာသည် နိမ့်ကျသောမြေပြင်ပေါ်တွင်ရှိခြင်း သို့မဟုတ် Δဖိအားခန့်မှန်းချက် သေးငယ်လွန်းခြင်းကြောင့် ဖြစ်နိုင်သည်။">ညီမျှမှုစစ်ဆေးချက်, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='စမ်းသပ်ရေထုတ်ကိရိယာ ဖိအားသည် ပေးသွင်းဖိအားနှင့် ညီမျှ သို့မဟုတ် ကျော်လွန်နေသည်။ ၎င်းသည် အဆိုးဆုံးအခြေအနေရေထုတ်ကိရိယာ မဖြစ်နိုင်ခြင်း သို့မဟုတ် ပိုက်များကို ပိုသေးအောင်လုပ်နိုင်ခြင်းကြောင့် ဖြစ်နိုင်သည်။';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="ဤသည်မှာ စံညီမျှမှု တိုင်းတာချက်၏ ခန့်မှန်းတန်ဖိုးနှင့် မတူညီပါ။">နောက်ဆုံးရေထုတ်ကိရိယာ ရေစီးနှုန်း ÷ ဒီဇိုင်းရေစီးနှုန်း, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='အဖြေမရှိပါ: လိုအပ်သော ပေးသွင်းဖိအားသည် ထည့်သွင်းထားသော ပေးသွင်းဖိအားထက် ကျော်လွန်နေသည်။ ပေးသွင်းဖိအားကို တိုးမြှင့်ပါ၊ လိုအပ်ချက်ကို လျှော့ချပါ သို့မဟုတ် ပိုကြီးသောပိုက်ကို သုံးပါ။';
$ec_lang['ip_notes_1_def']='နောက်ဆုံး (အဝေးဆုံး) ရေထုတ်ကိရိယာရှိ ဖိအားကို ခန့်မှန်းပြီး၊ စွမ်းအင်မျဉ်းကို ပေးသွင်းရာဘက်သို့ ပိုက်အပိုင်းတစ်ခုပြီးတစ်ခု ပြန်လျှောက်ကာ ပွတ်တိုက်ဆုံးရှုံးမှုနှင့် ဒေသဆိုင်ရာဆုံးရှုံးမှုများကို လမ်းတစ်လျှောက် ပေါင်းထည့်သည်။ ဆုံမှတ်တစ်ခုစီတွင် အမြင့်နှင့် အလျင်ဟက်ဒ်ကို နုတ်၍ ထိုနေရာ၏ တကယ့်ဖိအားကို ဖော်ပြသည်။ ခန့်မှန်းထားသော အဝေးဆုံးအစွန်းဖိအားကို (နှစ်ပိုင်းပိုင်းနည်းဖြင့်) လိုအပ်သည့် ပေးသွင်းဖိအား တွက်ချက်ရလဒ်သည် ထည့်သွင်းထားသော ပေးသွင်းဖိအားနှင့် ကိုက်ညီသည်အထိ ချိန်ညှိသည် — Manning သွတ်ပိုက်စီးဆင်းမှု တွက်ချက်စက်ရှိ ပိုက်ရေစီးနှုန်း ဖြေရှင်းစနစ်က ကိုင်တွယ်သည့် ကွင်းပိတ်ပြဿနာအတိုင်းပင်ဖြစ်ပြီး ဌာနခွဲကွန်ရက်တစ်ခုအထိ ကျယ်ပြန့်စေထားသည်။';
$ec_lang['ip_notes_2_term']='ပင်မပိုက်နှင့် ဘေးပိုက် ပိုက်အပိုင်းများ';
$ec_lang['ip_notes_2_def']='အတန်းတစ်ခုစီသည် ပေးသွင်းရာမှ နောက်ဆုံးရေထုတ်ကိရိယာအထိ ဟိုက်ဒရောလစ်အရ အဆိုးဆုံးဖြစ်သော လမ်းကြောင်းတစ်ခုတည်း (စမ်းသပ်လမ်းကြောင်း) ပေါ်ရှိ ပိုက်အပိုင်းတစ်ခုကို ကိုယ်စားပြုသည်။ ပင်မပိုက် အပိုင်းသည် စမ်းသပ်လမ်းကြောင်းပေါ်တွင် မရှိသော ဘေးပိုက်များထံသို့သာ ရေစီးနှုန်းကို ပို့ဆောင်သောကြောင့် ၎င်း၏ ရေထုတ်ယူမှုသည် ရိုးရှင်းသောမြှောက်ခြင်းသာဖြစ်သည် (ဒီဇိုင်းရေစီးနှုန်း × ပိုက်အပိုင်း၏ ရေထုတ်ကိရိယာ စုစုပေါင်း) — ဒေသဆိုင်ရာ ဖိအားအပေါ် တုံ့ပြန်မှု မရှိပါ။ ပင်မပိုက်သည် မျှဝေသုံးသော ပင်မလိုင်းဖြစ်သောကြောင့် စမ်းသပ်ဘေးပိုက်တွင် ဆုံးသည့် ပင်မပိုက်အပိုင်းတွင် ၎င်း၏ အစွန်းနှစ်ဖက်ကြားရှိ ဘေးပိုက်များသာမက ထိုနေရာမှ ပင်မပိုက်တစ်လျှောက် ဆက်လက်တည်ရှိသော ဘေးပိုက်များ သို့မဟုတ် တူညီသောဆုံမှတ်ကို မျှဝေသော ဘေးပိုက်များ (ဥပမာ ဆန့်ကျင်ဘက်ဘေးပိုက်) ပါ ထည့်တွက်ရမည် — ၎င်းတို့၏ ရေစီးနှုန်းသည် ခွဲမထွက်မီ ထိုပိုက်အပိုင်းကိုပင် ဖြတ်သန်းသောကြောင့်၊ ဤဇယားရှိ အခြားနေရာတွင် ပါသည်ဖြစ်စေ မပါသည်ဖြစ်စေ ထည့်တွက်ရမည်။ ဘေးပိုက်အပိုင်းသည် စမ်းသပ်ဘေးပိုက်ကိုယ်တိုင်၏ အပိုင်းတစ်ခုဖြစ်သည်: ရေထုတ်ကိရိယာ ရေစီးထွက်မှုကို q = k·H<sup>x</sup> မှတစ်ဆင့် တကယ့်ဒေသဆိုင်ရာဖိအားမှ တွက်ချက်ပြီး၊ ပိုက်အပိုင်းအတွင်း ရေထုတ်ကိရိယာတစ်ခုစီ ရေထုတ်ယူသည်နှင့်အမျှ ရေစီးနှုန်း လျော့နည်းလာမှုကို ထည့်တွက်ရန် ပွတ်တိုက်ဆုံးရှုံးမှုကို Christiansen ၏ F(n) မြောက်ဖော်ကိန်းဖြင့် လျှော့ချသည်။';
$ec_lang['ip_notes_3_term']='ကန့်သတ်ချက်များ';
$ec_lang['ip_notes_3_def']='ပုံသေ ပေးသွင်းဖိအားတစ်ခု (ပန့်မျဉ်းကွေးမပါ)၊ စမ်းသပ်လမ်းကြောင်းတစ်ခုတည်း (လယ်ကွင်းတစ်ခုလုံး မဟုတ်) နှင့် ပါရာမီတာနှစ်ခုပါ ရေထုတ်ကိရိယာမျဉ်းကွေး (ဖိအားညှိ ရေထုတ်ကိရိယာကို ခန့်မှန်းရန် ထပ်ကိန်းကို သုညအနီးထားပါ) ကို ပုံစံထုတ်သည်။ ညီမျှမှုအချိုးနှစ်မျိုးကို တမင်ခွဲခြား၍ တင်ပြသည်: q<sub>last</sub>/q<sub>avg,field</sub> သည် စံပြ အောက်ဆုံးလေးပုံတစ်ပုံ ဖြန့်ဝေမှုညီမျှမှု (အောက်အုပ်စုပျမ်းမျှ ÷ စုစုပေါင်းလူဦးရေပျမ်းမျှ) ၏ ခန့်မှန်းတန်ဖိုးဖြစ်သည်; သို့သော် ဤသည်မှာ ပုံစံထုတ်ထားသော နမူနာငယ်နှင့် အသုံးပြုသူ ခန့်မှန်းချက်မှ ရသည်ဖြစ်ပြီး စံပြ လယ်ကွင်းတစ်ခုလုံး၏ စာရင်းအင်းနမူနာမှ မဟုတ်ပါ။ ထို့အပြင် စမ်းသပ်ဘေးပိုက်ကို တမင် အဆိုးဆုံးအခြေအနေဟု ယူဆထားသောကြောင့် ၎င်း၏ မပြင်ဆင်ရသေးသော ကြမ်းတမ်းပျမ်းမျှသည် တကယ့်လယ်ကွင်းပျမ်းမျှထက် နည်းပြီး ညီမျှမှုကို တကယ့်ထက်ပိုကောင်းဟန်ပြမည်ဖြစ်သည်; Δဖိအား ထည့်သွင်းကွက်သည် ထိုစောင်းမှုကို တန်ပြန်ရန်အတွက်ပင် ရှိနေခြင်းဖြစ်သည်။ 1 နှင့်အထက် ညီမျှမှုတန်ဖိုးများ ရှိနိုင်ပြီး မှန်ကန်ပါသည်: ၎င်းသည် နောက်ဆုံးရေထုတ်ကိရိယာ၏ ဖိအားသည် ခန့်မှန်းလယ်ကွင်းပျမ်းမျှနှင့် တူညီ သို့မဟုတ် ပိုမြင့်နေသည်ဟု ဆိုလိုရုံဖြစ်ပြီး အခြားရေထုတ်ကိရိယာတစ်ခုသည် အနိမ့်ဆုံးဖိအားနေရာဖြစ်နိုင်သည်။ ၎င်းသည် နောက်ဆုံးရေထုတ်ကိရိယာ နိမ့်ကျသောမြေပြင်ပေါ်တွင်ရှိခြင်း သို့မဟုတ် Δဖိအားခန့်မှန်းချက် သေးငယ်လွန်းခြင်းကြောင့် ဖြစ်နိုင်သည်။ q<sub>last</sub>/q<sub>design</sub> သည် ထုတ်လုပ်သူ သတ်မှတ်ရေစီးနှုန်းနှင့် နှိုင်းယှဉ်သော ညီမျှမှုမဟုတ်သည့် သီးခြားစစ်ဆေးချက်ဖြစ်သည် — စနစ်တစ်ခုလုံး ဖိအားများလွန်း/နည်းလွန်းခြင်းကို ရှာဖွေရာတွင် အသုံးဝင်သော်လည်း၊ ဒီဇိုင်း/သတ်မှတ်ရေစီးနှုန်းသည် စနစ်၏ တကယ့်ပျမ်းမျှ လုပ်ဆောင်ဖိအားနှင့် သီးခြားစီဖြစ်နေသောကြောင့် ညီမျှမှုကိန်းဂဏန်းနှင့်အတူ သီးခြားဖတ်ရှုရမည့် စစ်ဆေးချက်ဖြစ်သည်။';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). "Irrigation by sprinkling." California Agricultural Experiment Station Bulletin 670။ အသေးစား ရေသွင်းစနစ် ဒီဇိုင်းအတွက် ASAE/ASABE စံနှုန်းများသည် ပေါက်များစွာမှ ပွတ်တိုက်ဆုံးရှုံးမှု တွက်ချက်နည်းတူကို အသုံးပြုသည်။';
$ec_lang['ip_notes_5_term']='အသုံးချ ဒီဇိုင်း';
$ec_lang['ip_notes_5_def']='ရေသွင်းနှုန်းနှင့် စနစ်/ဇုန် ရေစီးနှုန်းတို့သည် ခန့်မှန်း လယ်ကွင်းပျမ်းမျှ ရေထုတ်ကိရိယာစီးနှုန်း (q<sub>avg,field</sub> — စမ်းသပ်ဘေးပိုက်ကိုယ်ပိုင်ပျမ်းမျှကို ထည့်သွင်းထားသော Δဖိအားခန့်မှန်းချက်ဖြင့် ပြင်ဆင်ထားသည်) ကို အသုံးပြုသည်၊ ခန့်မှန်းရိုးရိုးနှုန်းကို မဟုတ်ပါ: PR = q<sub>avg,field</sub> / A<sub>e</sub>၊ ပြင်ဆင်ပြီးသော ပုံစံထုတ်တန်ဖိုးမှ ရရှိသည်။ အကွာအဝေးနှင့် စနစ်တစ်ခုလုံးရှိ ဘေးပိုက်/ရေထုတ်ကိရိယာ အရေအတွက်များသည် ဤနေရာတွင် သီးခြားထည့်သွင်းချက်များဖြစ်သည်၊ အကြောင်းမှာ စမ်းသပ်လမ်းကြောင်းသည် အဆိုးဆုံးအခြေအနေ ဌာနခွဲတစ်ခုကိုသာ ပုံစံထုတ်ပြီး လယ်ကွင်းရှိ ဘေးပိုက်တိုင်းကို ပုံစံမထုတ်သောကြောင့်ဖြစ်သည်။';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='ဌာနခွဲပိုက်ကွန်ရက်';
$ec_lang['bpn_main_title']='အခမဲ့ အွန်လိုင်း ဌာနခွဲပိုက်ကွန်ရက် ဖိအား တွက်ချက်စက် (ပတ်ကွင်း မပါ)';
$ec_lang['bpn_main_desc']='ဌာနခွဲ (သစ်ပင်ပုံစံ) ပိုက်ကွန်ရက် စီးဆင်းမှုနှင့် ဖိအား';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='ငြိမ်သက် ပေးသွင်းဖိမြင့်: ရေစီးနှုန်း သုညတွင် အရင်းအမြစ်ဖိမြင့်။ ပေးသွင်းအမြင့်အထက်ရှိ ရေကန် သို့မဟုတ် ရေတိုင်ကီ ရေမျက်နှာပြင်အမြင့်၊ သို့မဟုတ် ရေတင်စက်၏ ပိတ်ထားချိန်ဖိမြင့်။ ရေတင်စက် သို့မဟုတ် ပြောင်းလဲနေသော ပေးသွင်းမျဉ်းကွေးတစ်ခု သတ်မှတ်ရန် ပေးသွင်းအမှတ် ၂ နှင့် ၃ ကို ထည့်ပါ; ကိရိယာသည် ဒီဇိုင်းရေစီးနှုန်းတွင် ဖိမြင့်ကို ဖတ်ယူသည်။';
$ec_lang['bpn_elev_source']='ပေးသွင်း အမြင့်';
$ec_lang['bpn_q_total']='စုစုပေါင်း ရေစီးနှုန်း';
$ec_lang['bpn_q_total_tip']='အရင်းအမြစ်မှ ထွက်ခွာသော စုစုပေါင်းရေစီးနှုန်း (ကွန်ရက်အတွင်းရှိ လိုအပ်ချက်များ အားလုံး၏ ပေါင်းလဒ်)။';
$ec_lang['bpn_p_min']='အနိမ့်ဆုံး ဖိအား';
$ec_lang['bpn_p_min_tip']='ကွန်ရက်တစ်ခုလုံးတွင် အနိမ့်ဆုံးဖြစ်သော ရေအောက်ဘက်ဖိအား; အရေးကြီးဆုံးပေးသွင်းရာနေရာ။';
$ec_lang['bpn_method']='ပွတ်တိုက်မှု နည်းလမ်း';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='ပိုက်လိုင်းများ';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='ဤပိုက်လိုင်း၏ အမည်။ အခြားလိုင်းများသည် ၎င်းအား ရေအထက်ဘက် ကော်လံတွင် ကိုးကားသည်။';
$ec_lang['bpn_upstream']='ရေအထက်ဘက် ID';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ဤလိုင်းအား ပေးသွင်းသော လိုင်း၏ ID။ ၎င်း၏အပေါ်ရှိ လိုင်းကို တိုက်ရိုက်လိုက်နာစေရန် ဗလာထားပါ (ရိုးရှင်းသော စီးရီးပိုက်လိုင်း)။ အခြားလိုင်းတစ်ခုမှ ခွဲထွက်ရန် ဤနေရာတွင် ID တစ်ခု ထည့်ပါ။';
$ec_lang['bpn_roughness_tip']='ရွေးချယ်ထားသော ပွတ်တိုက်မှုနည်းလမ်းအတွက် ပိုက်ကြမ်းတမ်းမှု: Manning n, Hazen-Williams C, သို့မဟုတ် Darcy-Weisbach ကြမ်းတမ်းမှုအမြင့် e (အလျား တစ်ခု)။ ပုံမှန် ချောမွေ့သော ပလပ်စတစ်ပိုက်: n ခန့် 0.009, C ခန့် 150, e ခန့် 0.0015 mm။';
$ec_lang['bpn_demand']='လိုအပ်ချက်';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='ဤလိုင်း၏ ရေအောက်ဘက်စွန်းတွင် ပေးအပ်သော သတ်မှတ်ရေစီးနှုန်း။';
$ec_lang['bpn_demand_mult']='လိုအပ်ချက် မြှောက်ကိန်း';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='ထိပ်ချိန် သို့မဟုတ် အနာဂတ်ကြီးထွားမှု တွက်ချက်မှုများအတွက် လိုင်းတိုင်း၏ လိုအပ်ချက်ကို တစ်ပြိုင်နက် မြှောက်ပေးသည်။ ထည့်သွင်းထားသည့်အတိုင်း လိုအပ်ချက်များကို အသုံးပြုလိုပါက 1 ကို သုံးပါ။';
$ec_lang['bpn_elev_down']='ရေအောက်ဘက် အမြင့်';
$ec_lang['bpn_q_line']='လိုင်းရေစီးနှုန်း';
$ec_lang['bpn_q_line_tip']='ဤလိုင်းက သယ်ဆောင်သော စုစုပေါင်းရေစီးနှုန်း: ၎င်း၏ ကိုယ်ပိုင်လိုအပ်ချက်နှင့် ၎င်းက ပေးသွင်းသော ရေအောက်ဘက် လိုအပ်ချက်များအားလုံး ပေါင်းထားသည်။';
$ec_lang['bpn_p_down']='ရေအောက်ဘက် ဖိအား';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='ဤလိုင်း၏ ရေအောက်ဘက်ဆုံမှတ်တွင် ဂေ့ချ်ဖိအားဖိမြင့်။ အနှုတ်တန်ဖိုး (အမှတ်အသားပြုထား) သည် လေထုဖိအားအောက် ဖြစ်ကြောင်းညွှန်ပြသည်; ဒီဇိုင်းကို စစ်ဆေးပါ။';
$ec_lang['bpn_sketch_heading']='ကွန်ရက် ပုံကြမ်း';
$ec_lang['bpn_source_label']='အရင်းအမြစ်';
$ec_lang['bpn_line_problem']='ဤလိုင်းသည် အရင်းအမြစ်နှင့် မချိတ်ဆက်ရသေးပါ - ၎င်းသည် အမည်မသိ ရေအထက်ဘက် ID တစ်ခုကို ညွှန်ပြနေသည်၊ မိမိကိုယ်ကို ကိုးကားနေသည်၊ အခြားလိုင်းတစ်ခုက အသုံးပြုပြီးသား ID ကို ထပ်ခါထပ်ခါ သုံးထားသည်၊ (သို့) ပတ်ကွင်းတစ်ခု ဖြစ်နေသည်။ မချိတ်ဆက်ရသေးသော လိုင်းများကို မဖြေရှင်းဘဲ ချန်ထားသည်။';
$ec_lang['bpn_bad_id_short']='ID အမှား';


$ec_lang['bpn_pressure_warn']='နိမ့်/အနှုတ် ဖိအား; လေထုဖိအားအောက် အခြေအနေများကို စစ်ဆေးပါ';
$ec_lang['bpn_pressure_warn_short']='နိမ့်';
$ec_lang['bpn_notes_1_term']='ပုံသေအားဖြင့် စီးရီး၊ ခြွင်းချက်ဖြင့်သာ ဌာနခွဲ';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='ရေအထက်ဘက် ID ကို ဗလာထားလျှင် လိုင်းတစ်ခုသည် ၎င်း၏အပေါ်ရှိလိုင်းကို လိုက်နာသည်; ရိုးရှင်းသော စီးရီးပိုက်လိုင်းတစ်ခု။ ၎င်းမှ ခွဲထွက်ရန် ရေအထက်ဘက်လိုင်း၏ ID ကို ထည့်ပါ။ ထို့ကြောင့်: ပုံသေအားဖြင့် စီးရီး၊ လိုအပ်သောအခါ သစ်ပင်ပုံစံ။';
$ec_lang['bpn_notes_2_term']='ဌာနခွဲကွန်ရက်သာ၊ ပတ်ကွင်း မပါ';
$ec_lang['bpn_notes_2_def']='လိုင်းတိုင်းသည် ရေအထက်ဘက်လိုင်း တစ်ခုတည်းသာ ရှိသည် (သစ်ပင်ပုံစံ)။ ဤကိရိယာသည် ပတ်ကွင်းပါသော ကွန်ရက်များကို မဖြေရှင်းပါ; ထိုကွန်ရက်များသည် ထပ်ခါထပ်ခါ တွက်ချက်သည့် နည်းလမ်းများ (EPANET သို့မဟုတ် ဆင်တူများ) လိုအပ်သည်။ ပတ်ကွင်းများကို ချန်ထားခြင်းက ၎င်းကို ရိုးရှင်းပြီး တိကျစေသည်။';
$ec_lang['bpn_notes_3_term']='လက်ရှိ ဖိအားထိန်းချုပ်မှု မပါ';
$ec_lang['bpn_notes_3_def']='သတ်မှတ် ဒေသဆိုင်ရာဆုံးရှုံးမှု ဗားဗ်တစ်ခု (k-value) ကို ထည့်နိုင်သော်လည်း၊ ဖိအားလျှော့ချသော သို့မဟုတ် ဖိအားထိန်းထားသော ဗားဗ်များ (PRV/PSV) ကို မထည့်နိုင်ပါ။ ၎င်းတို့၏ ဖွင့်/ပိတ် အခြေအနေသည် ရေစီးနှုန်းနှင့် ဖိအားပေါ် မူတည်သောကြောင့် ထပ်ခါထပ်ခါ တွက်ချက်ရန် လိုအပ်စေသည်။';


$ec_lang['bpn_supply2_q']='ပေးသွင်း ရေစီးနှုန်း ၂';
$ec_lang['bpn_supply2_h']='ပေးသွင်း ဖိမြင့် ၂';
$ec_lang['bpn_supply3_q']='ပေးသွင်း ရေစီးနှုန်း ၃';
$ec_lang['bpn_supply3_h']='ပေးသွင်း ဖိမြင့် ၃';
$ec_lang['bpn_supply_pt_tip']='ရွေးချယ်စရာ ပေးသွင်းမျဉ်းကွေး အမှတ် ၂ နှင့် ၃။ ရေတင်စက်တစ်ခု၊ သို့မဟုတ် ပိုမိုပေးသွင်းလေ ဖိမြင့်ကျဆင်းလေဖြစ်သော မည်သည့်အရင်းအမြစ်ကိုမဆို ပုံစံချရန် တစ်ခုစီအတွက် ရေစီးနှုန်းနှင့် ဖိမြင့်ကို ထည့်ပါ; ကိရိယာသည် ဒီဇိုင်းရေစီးနှုန်းတွင် ဖိမြင့်ကို ဖတ်ယူသည်။ အထက်ပါ အမှတ် ၁ သည် ရေစီးနှုန်း သုညရှိ ငြိမ်သက်ဖိမြင့် ဖြစ်သည်။ ဆက်တိုက် ရေကန်ဖိမြင့်တစ်ခုအတွက် ၂ နှင့် ၃ ကို ဗလာထားပါ။';
$ec_lang['bpn_h_supply']='ပေးသွင်း ဖိမြင့်';
$ec_lang['bpn_h_supply_tip']='ဒီဇိုင်းရေစီးနှုန်းတွင် ပေးသွင်းမျဉ်းကွေးမှ ဖတ်ယူထားသော အရင်းအမြစ်ဖိမြင့်။ မျဉ်းကွေးညီညာသောအခါ (ရေကန်) ထည့်သွင်းထားသော အရင်းအမြစ်ဖိမြင့်နှင့် ညီမျှသည်။';
$ec_lang['bpn_supply1_h']='ငြိမ်သက် ပေးသွင်းဖိမြင့်';
$ec_lang['lpn_main_menu']='ရေပေးသွင်း ကွန်ရက်';
$ec_lang['lpn_main_title']='EPANET ဖြေရှင်းစက်ပါသော အခမဲ့ အွန်လိုင်း ရေပေးသွင်း ကွန်ရက် ပုံစံပြုမှု';
$ec_lang['lpn_main_desc']='ရေပေးသွင်းကွန်ရက် ခွဲခြမ်းစိတ်ဖြာမှု - ပတ်ကွင်းပါ ပိုက်ကွန်ရက်ကို ရေးဆွဲပါ (သို့) EPANET ဖိုင်များကို တင်သွင်းပါ';
$ec_lang['lpn_title_units']='{units} ယူနစ်များ';
$ec_lang['lpn_tool_select']='ရွေးချယ်ရန်';
$ec_lang['lpn_tool_add_junction']='ဆက်စပ်နေရာ';
$ec_lang['lpn_tool_add_reservoir']='ရေကန်';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='ရေတိုက်';
$ec_lang['lpn_tool_add_pipe']='ပိုက်လိုင်း';
$ec_lang['lpn_tool_add_pump']='ရေတင်စက်';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='ဗားလ်';
$ec_lang['lpn_tool_add_text']='စာသား';
$ec_lang['lpn_tool_vertices']='အကွေ့မှတ်များ';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='ဖောက်သည်';
$ec_lang['lpn_tool_add_meter_tip']='ဖောက်သည်ရှိရာနေရာကို နှိပ်ပါ၊ ထို့နောက် ၎င်းကို ဝန်ဆောင်ပေးသော ပိုက်လိုင်း (သို့) ဆက်စပ်နေရာကို နှိပ်ပါ။ ဖောက်သည်အား သင်ပေးသည့် လိုအင်သည် ထိုပိုက်လိုင်း၏ အနီးဆုံးအစွန်းရှိ ဆက်စပ်နေရာသို့ ပေါင်းထည့်ပေးသည်။';
$ec_lang['lpn_mode_add_meter']='ဖောက်သည်: ဖောက်သည်ရှိရာနေရာကို နှိပ်ပါ၊ ထို့နောက် ၎င်းကို ဝန်ဆောင်ပေးသော ပိုက်လိုင်း (သို့) ဆက်စပ်နေရာကို နှိပ်ပါ။ သို့မဟုတ် ပယ်ဖျက်ရန် Esc ကို သုံးပါ။';
$ec_lang['lpn_pane_tab_customers']='ဖောက်သည်များ';
$ec_lang['lpn_customer_heading']='ဖောက်သည် {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='ဝန်ဆောင်မှုတစ်ခုလျှင် လိုအင်';
$ec_lang['lpn_field_meter_demand_tip']='ဤဖောက်သည်ရှိ ဝန်ဆောင်မှုတစ်ခုစီ လိုအပ်သည့်ပမာဏ။ ရှာဖွေရန်နှင့် အစားထိုးရန်သည် ဗလာနှင့် 0 အကြား ခြားနားချက်ကို အသုံးချနိုင်သည်။';
$ec_lang['lpn_field_meter_count']='ဝန်ဆောင်မှု အရေအတွက်';
$ec_lang['lpn_field_meter_count_tip']='ဤဖောက်သည်တစ်ဦးတည်းက ကိုယ်စားပြုသော တူညီသည့် ဝန်ဆောင်မှု အရေအတွက်၊ သို့မှသာ ပင်မပိုက်တစ်ခုတစ်လျှောက်ရှိ တစ်အိမ်ထောင်စီ ချိတ်ဆက်မှု ၄၂ ခုကို နေရာတစ်ခုတွင် သင်္ကေတတစ်ခုတည်းအဖြစ် ဖော်ပြနိုင်သည်။ အောက်ပါ စုစုပေါင်းသည် အထက်ပါ လိုအင်ကို ဤအရေအတွက်ဖြင့် မြှောက်ထားသည်။';
$ec_lang['lpn_field_meter_total']='စုစုပေါင်း လိုအင်';
$ec_lang['lpn_field_meter_total_tip']='ဝန်ဆောင်မှုတစ်ခုလျှင် လိုအင်ကို ဝန်ဆောင်မှု အရေအတွက်ဖြင့် မြှောက်ထားသည်။ ဤကိန်းသည် အောက်တွင် အမည်ဖော်ပြထားသော ဆက်စပ်နေရာသို့ ပေါင်းထည့်ပေးသည့် ကိန်းဖြစ်သည်။';
$ec_lang['lpn_field_meter_pipe']='ချိတ်ဆက်ထားသော အစိတ်အပိုင်း';
$ec_lang['lpn_field_meter_pipe_suggest']='အနီးဆုံး အစိတ်အပိုင်းမှာ {id} ဖြစ်သည်။ ဤဖောက်သည်ကို ၎င်းမှ ဝန်ဆောင်ပေးရန် ဤနေရာတွင် ရိုက်ထည့်ပါ။';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='ချိတ်ဆက်ထားသည့်နေရာ';
$ec_lang['lpn_field_meter_node_tip']='ဤဖောက်သည် ချိတ်ဆက်ထားသည့် ဆက်စပ်နေရာ။ ၎င်းအစား ထိုပိုက်လိုင်းတစ်လျှောက်ရှိ အကွာမှတ်တစ်ခုမှ ဝန်ဆောင်ပေးရန် ချိတ်ဆက်မှတ်ကို ပိုက်လိုင်းပေါ်သို့ ဖိဆွဲပါ။';
$ec_lang['lpn_meter_pipe_unknown']='ဤပရောဂျက်တွင် {id} ဟု အမည်ပေးထားသော မည်သည့်အရာမျှ မရှိသောကြောင့်၊ ဖောက်သည်ကို ရှိနေရာတွင်ပင် ထားခဲ့သည်။';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='ဤဖောက်သည်\'၏ လိုအင်သည် run တစ်လျှောက် မည်သို့ မြင့်တက်ကျဆင်းသည်။ ၎င်းသည် စုစုပေါင်း လိုအင်ကို မြှောက်ပေးသောကြောင့်၊ ဤဖောက်သည် ကိုယ်စားပြုသော ဝန်ဆောင်မှုတိုင်းအပေါ် သက်ရောက်သည်။ ပရောဂျက်၏ မူလ လိုအင် ပုံစံ ကို လိုက်နာစေလိုပါက ပုံစံ မရှိပါ တွင် ထားခဲ့ပါ။';
$ec_lang['lpn_meter_pattern_unknown']='ဤပရောဂျက်တွင် {id} ဟု အမည်ပေးထားသော ပုံစံ မရှိသောကြောင့်၊ ဖောက်သည်ကို ရှိနေသည့်အတိုင်းပင် ထားခဲ့သည်။';
$ec_lang['lpn_meter_placed']='ဖောက်သည် {id} ကို ထည့်သွင်းပြီးပါပြီ။ ၎င်း၏ ဖော်ပြချက်နှင့် လိုအင်ကို ဖောက်သည်များ ဇယားတွင် ရိုက်ထည့်နိုင်သည်၊ (သို့) ၎င်း၏ ဘောက်စ်ကို ဖွင့်ရန် ရွေးချယ်ရန်တွင် ၎င်းကို နှိပ်ပါ။';
$ec_lang['lpn_field_meter_pipe_tip']='ဤဝန်ဆောင်မှု ချိတ်ဆက်ထားသည့် အစိတ်အပိုင်း။ ပြောင်းလဲလိုပါက ဤနေရာတွင် (သို့) ဖောက်သည်များ ဇယားတွင် အခြားတစ်ခုကို ရိုက်ထည့်ပါ၊ (သို့) ချိတ်ဆက်မှတ်ကို အခြားအစိတ်အပိုင်းသို့ ဖိဆွဲပါ။';
$ec_lang['lpn_field_meter_station']='ပိုက်လိုင်းတစ်လျှောက် အကွာမှတ် (%)';
$ec_lang['lpn_field_meter_station_tip']='ဝန်ဆောင်မှု ချိတ်ဆက်ထားသည့်နေရာသည် ပိုက်လိုင်း၏ ပထမနေရာမှ ဒုတိယနေရာအထိ ရာခိုင်နှုန်းအနေဖြင့် မည်မျှ ဝေးသည်ကို ဖော်ပြသည်။ 0 သည် တစ်ဖက်တွင်ရှိပြီး 100 သည် အခြားတစ်ဖက်တွင် ရှိသည်။ ပိုက်လိုင်းပေါ်ရှိ စက်ဝိုင်းသည် ညွှန်ပြကိရိယာဖြင့် တူညီသောအလုပ်ကို လုပ်ဆောင်သည်။';
$ec_lang['lpn_field_meter_offset']='ပိုက်လိုင်းမှ ဘေးကွာမှု';
$ec_lang['lpn_field_meter_offset_tip']='အပေါင်းတန်ဖိုးသည် ပိုက်လိုင်း၏ ပထမနေရာမှ ဒုတိယနေရာသို့ ကြည့်လျှင် ညာဘက်ဖြစ်သည်။ ဤနေရာတွင် တန်ဖိုးတစ်ခု ရိုက်ထည့်ခြင်းက ဖောက်သည်ကို ပင်မပိုက်၏ အခြားတစ်ဖက်သို့ ရွှေ့နိုင်ပြီး၊ ဝန်ဆောင်မှုလိုင်းကို ပင်မပိုက်နှင့် အမြဲ ဒေါင်လိုက်ဖြစ်စေသည်။';
$ec_lang['lpn_field_meter_lumped']='ဆက်စပ်နေရာသို့ ပေါင်းထည့်ထားသည်';
$ec_lang['lpn_field_meter_lumped_tip']='အနီးဆုံး ဆက်စပ်နေရာ။ ဤဖောက်သည်\'၏ လိုအင်များကို ထိုနေရာတွင် ပေါင်းထည့်ထားသည်။';
$ec_lang['lpn_node_customers']='ဖောက်သည် လိုအင်များ';
$ec_lang['lpn_node_customers_tip']='ဤနေရာတွင် ထည့်သွင်းထားသော ဖောက်သည်များ စာရင်း (ဤနေရာသည် အနီးဆုံးဖြစ်သောကြောင့်)။ ဖောက်သည် လိုအင်များသည် ဤနေရာတွင် စာရင်းပြုထားသော အခြားလိုအင်များနှင့် ထပ်၍ ပေါင်းထည့်ထားသည်။ ဖောက်သည်တစ်ဦးကို ၎င်းရှိရာ မြေပုံပေါ်တွင် (သို့) ဖောက်သည်များ ဇယားတွင် တည်းဖြတ်နိုင်သည်။';
$ec_lang['lpn_node_customers_sum']='ဖောက်သည် {n} ဦးမှ {total} {unit}';
$ec_lang['lpn_customer_detached']='⚠ ဤဖောက်သည်သည် ပိုက်လိုင်းနှင့် ချိတ်ဆက်မထားသောကြောင့်၊ ၎င်း၏ လိုအင်သည် အဖြေများတွင် မပါဝင်ပါ။ ၎င်းကို ဖျက်ပါ၊ (သို့) ပိုက်လိုင်းတစ်ခု ဆွဲပြီး ဖောက်သည်ကို ၎င်းပေါ်သို့ ရွှေ့ပါ။';
$ec_lang['lpn_customer_fixed_head']='⚠ ထိုပိုက်လိုင်း၏ အနီးဆုံးအစွန်းသည် ပုံသေ ရေမျက်နှာပြင်တစ်ခု ဖြစ်နေသောကြောင့်၊ ဤလိုအင်သည် ပုံဖော်တွက်ချက်မှုကို သက်ရောက်မှု မရှိပါ။';
$ec_lang['lpn_customer_detached_count']='ဖောက်သည် {n} ဦးသည် ပိုက်လိုင်းနှင့် ချိတ်ဆက်မထားပါ။ ၎င်းတို့၏ လိုအင်ကို ထည့်တွက်မထားပါ။';
$ec_lang['lpn_meter_pick_pipe']='ယခု ဤဖောက်သည်ကို ဝန်ဆောင်ပေးမည့် ပိုက်လိုင်း (သို့) ဆက်စပ်နေရာကို နှိပ်ပါ။ ဖောက်သည်သည် သင်ထားသည့်နေရာတွင်ပင် ရှိနေပါလိမ့်မည်။ ပယ်ဖျက်ရန် Escape ကို နှိပ်ပါ။';
$ec_lang['lpn_inp_export_flat_customers']='EPANET ဖိုင်တွင် ဖောက်သည်များ မရှိပါ။ ဤပရောဂျက်ရှိ ဖောက်သည် {n} ဦး၏ လိုအင်သည် ၎င်းတို့ တစ်ဦးစီ ထည့်သွင်းထားသည့် ဆက်စပ်နေရာပေါ်ရှိ လိုအင်အတန်းတစ်ခုအဖြစ် ဖိုင်ထဲသို့ ဝင်ရောက်ပြီး၊ အတန်းတစ်ခုစီကို ဖောက်သည်\'၏ တဂ် ဖြင့် အမည်ပေးထားသည်။ ဖိုင်က မသိမ်းနိုင်သည်မှာ ဖောက်သည်ကိုယ်တိုင်ဖြစ်သည် - ၎င်းရှိရာနေရာ၊ မည်သည့်ပိုက်လိုင်းက ဝန်ဆောင်သည်၊ ထိုပိုက်လိုင်းတစ်လျှောက် မည်သည့်နေရာတွင် ဝန်ဆောင်မှု ချိတ်ဆက်သည်၊ ဖောက်သည်တစ်ဦးက ဝန်ဆောင်မှု အရေအတွက် မည်မျှ ကိုယ်စားပြုသည်။ ၎င်းအားလုံးကို သင့်ကိုယ်ပိုင် ပရောဂျက်ဖိုင်က သိမ်းထားပါသည်။';

$ec_lang['lpn_area_hint_window_start']='ဘောင်၏ထောင့်တစ်ခုကို နှိပ်ပါ။';
$ec_lang['lpn_area_hint_window_go']='အပြီးသတ်ရန် ဆန့်ကျင်ဘက်ထောင့်ကို နှိပ်ပါ။';
$ec_lang['lpn_area_hint_lasso_start']='ဘောင်ဝိုင်း စတင်ရန် နှိပ်ပါ။';
$ec_lang['lpn_area_hint_lasso_go']='ဘောင်ဝိုင်းကို ဆွဲရန် ရွှေ့ပါ။ အပြီးသတ်ရန် နှိပ်ပါ။';
$ec_lang['lpn_area_hint_polygon_start']='ပုံစံကွက်ဧရိယာကို ဆွဲရန် နှိပ်ပါ။ အပြီးသတ်ရန် နှစ်ချက်နှိပ်ပါ။';
$ec_lang['lpn_area_hint_polygon_go']='ထောင့်တစ်ခုစီကို နှိပ်ပါ။ အပြီးသတ်ရန် နောက်ဆုံးထောင့်ကို နှစ်ချက်နှိပ်ပါ။';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='ရွေးချယ်ထားပြီးသားများကို ဆက်လက်ထိန်းထားလျက် ထပ်ထည့်ခြင်း (သို့) ဖယ်ရှားခြင်း (toggle) ပြုလုပ်ရန် ရွေးချယ်နေစဉ် Shift ကို ဖိထားပါ။';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='မြေပုံပေါ်တွင် ဖိထားပြီး သင်လိုချင်သည့် နေရာပတ်လည်ကို ဆွဲပါ၊ ထို့နောက် လက်လွှတ်ပါ။';
$ec_lang['lpn_area_hint_touch_go']='သင်လိုချင်သည့်နေရာ ပတ်လည်ကို ဆွဲပါ၊ အပြီးသတ်ရန် လက်လွှတ်ပါ။';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='ဤအရာကို ပြရန်';
$ec_lang['lpn_multi_title']='{n} ခု ရွေးချယ်ထားသည်';
$ec_lang['lpn_multi_varies']='အမျိုးမျိုး';
$ec_lang['lpn_multi_applied']='{n} ခုပေါ်တွင် {prop} ကို သတ်မှတ်ခဲ့သည်။';
$ec_lang['lpn_multi_no_fields']='ဤနေရာတွင် ၎င်းတို့ အတူတကွ သတ်မှတ်နိုင်သော အရာ တစ်ခုမျှ မရှိပါ။';
$ec_lang['lpn_pane_pasted']='ဆဲလ် {n} ခုကို ကူးထည့်ခဲ့သည်။ {skipped} ခုကို မပြောင်းလဲခဲ့ပါ။';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='အတန်း {n} ကို ကူးထည့်ပြီး ၎င်းတို့ထဲမှ {created} ခုကို ကွန်ရက်သို့ ထည့်သွင်းလိုက်သည်။';
$ec_lang['lpn_pane_pasted_rows_skipped']='အတန်း {n} ကို ကူးထည့်ပြီး ၎င်းတို့ထဲမှ {created} ခုကို ကွန်ရက်သို့ ထည့်သွင်းလိုက်သည်။ ဆဲလ် {skipped} ခုကို မပြောင်းလဲခဲ့ပါ။';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='spreadsheet မှ အတန်းများကို ထည့်ရန် ဤနေရာကို နှိပ်ပြီး ကူးထည့်ပါ။';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='ဇယားအဆုံးတွင် အတန်းအသစ်များအဖြစ် ကူးထည့်ရန်';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='ကူးယူထားသော အတန်းများကို ဤဇယား၏ အောက်ခြေတွင် ထည့်ရန် Ctrl+V ကို နှိပ်ပါ။ ပယ်ဖျက်ရန် Esc ကို နှိပ်ပါ။';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='ဤကူးထည့်မှုတွင် အတန်း {n} ခု ပါဝင်ပြီး၊ ၎င်းတို့ထဲမှ {fit} ခုသည် ဇယားထဲတွင် ဝင်ဆံ့သည်။ ကျန် {extra} ခုကို အောက်ခြေတွင် အတန်းအသစ်များအဖြစ် ထည့်မလား။';
$ec_lang['lpn_pane_paste_overflow_add']='အတန်း {extra} ခု ထည့်ရန်';
$ec_lang['lpn_pane_paste_overflow_fit']='ဝင်ဆံ့သော {fit} ခုကိုသာ ကူးထည့်ရန်';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='ဤကူးထည့်မှုတွင် အတန်း {n} ခု ပါဝင်ပြီး၊ ၎င်းတို့ထဲမှ {fit} ခုသည် ဇယားထဲတွင် ဝင်ဆံ့သည်။ ကျန် {extra} ခုကို အတန်းအသစ်များအဖြစ် ထည့်၍မရပါ - {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='ID {n} ခု မကိုက်ညီပါ။ မည်သို့ပင်ဖြစ်စေ ကူးထည့်မလား။';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='မည်သည့်အရာမျှ မကူးထည့်ခဲ့ပါ။ {reasons}';
$ec_lang['lpn_pane_paste_more']='ဤနေရာတွင် မပြသထားသော ပြဿနာရှိသည့် အတန်းများ - {n}။';
$ec_lang['lpn_pane_paste_no_id']='အတန်း {row}: အတန်းအသစ်တစ်ခုသည် ID တစ်ခု လိုအပ်သည်။';
$ec_lang['lpn_pane_paste_bad_id']='အတန်း {row}: ID {id} တွင် ကွက်လပ် (သို့) ကိုးကားပုဒ် ပါဝင်နေသည်။';
$ec_lang['lpn_pane_paste_id_taken']='အတန်း {row}: ID {id} ကို အသုံးပြုပြီးသားဖြစ်သည်။';
$ec_lang['lpn_pane_paste_id_twice']='အတန်း {row}: ID {id} ကို ဤကူးထည့်မှုအတွင်း နှစ်ကြိမ် သုံးထားသည်။';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='အတန်း {row}: ဆက်စပ်နေရာအသစ်တစ်ခုသည် {first} နှင့် {second} နှစ်ခုစလုံး လိုအပ်သည်။';
$ec_lang['lpn_pane_paste_no_ends']='အတန်း {row}: လိုင်းအသစ်တစ်ခုသည် မှ ဆက်စပ်နေရာနှင့် သို့ ဆက်စပ်နေရာ လိုအပ်သည်။';
$ec_lang['lpn_pane_paste_no_node']='အတန်း {row}: ဆက်စပ်နေရာ {id} မရှိသေးပါ။ ဆက်စပ်နေရာများကို ဦးစွာ ကူးထည့်ပြီးမှ လိုင်းများကို ကူးထည့်ပါ။';
$ec_lang['lpn_pane_paste_same_ends']='အတန်း {row}: မှ နှင့် သို့ သည် ဆက်စပ်နေရာတစ်ခုတည်း ဖြစ်နေသည်။';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='အတန်း {row}: {text} သည် မှန်ကန်သော {col} မဟုတ်ပါ။';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='အတန်း {row}: စာသားအသစ်တစ်ခုသည် {first} နှင့် {second} နှစ်ခုစလုံး လိုအပ်သည်။';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='အတန်း {row}: {id} သည် ဤကွန်ရက်တွင် ဆက်စပ်နေရာ (သို့) ပိုက်လိုင်း မဟုတ်သေးပါ။ ၎င်းကို ဦးစွာ ကူးထည့်ပြီးမှ ဤစာသားကို ကူးထည့်ပါ။';
$ec_lang['lpn_pane_paste_customer_no_position']='အတန်း {row}: ဖောက်သည်အသစ်တစ်ခုသည် {first} နှင့် {second} နှစ်ခုစလုံး လိုအပ်သည်။';
$ec_lang['lpn_pane_paste_no_customer_ref']='အတန်း {row}: ဖောက်သည်အသစ်တစ်ခုသည် ချိတ်ဆက်ထားသော ပိုက်လိုင်း (သို့) ဆက်စပ်နေရာ လိုအပ်သည်။';
$ec_lang['lpn_pane_paste_no_pipe']='အတန်း {row}: ပိုက်လိုင်း {id} မရှိသေးပါ။ ပိုက်လိုင်းများကို ဦးစွာ ကူးထည့်ပြီးမှ ဖောက်သည်များကို ကူးထည့်ပါ။';
$ec_lang['lpn_pane_paste_no_customer_node']='အတန်း {row}: ဆက်စပ်နေရာ {id} မရှိသေးပါ။ ဆက်စပ်နေရာများကို ဦးစွာ ကူးထည့်ပြီးမှ ဖောက်သည်များကို ကူးထည့်ပါ။';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='အတန်း {row}: ဆက်စပ်နေရာ {id} တွင် ဖောက်သည်တစ်ဦး ချိတ်ဆက်ရန် ပိုက်လိုင်း မရှိပါ။';
$ec_lang['lpn_pane_filled']='ဆဲလ် {n} ကို အောက်သို့ဖြည့်ခဲ့သည်။ {skipped} ခုကို မပြောင်းလဲခဲ့ပါ။';
$ec_lang['lpn_pane_filldown']='အောက်သို့ဖြည့်ရန်';
$ec_lang['lpn_pane_fill_none']='ဤရွေးချယ်မှုတွင် အောက်သို့ ဖြည့်နိုင်သည့် မည်သည့်အရာမျှ မရှိပါ။';
$ec_lang['lpn_pane_ctrlenter_filled']='ဆဲလ် {n} ကို ဖြည့်ခဲ့သည်။ {skipped} ခုကို မပြောင်းလဲခဲ့ပါ။';
$ec_lang['lpn_pane_hide_col']='ဤကော်လံကို ဖျောက်ရန်';
$ec_lang['lpn_pane_hide_cols']='ဤကော်လံများကို ဖျောက်ရန်';
$ec_lang['lpn_pane_show_all_cols']='ကော်လံအားလုံးကို ပြရန်';
$ec_lang['lpn_pane_sort_asc']='အငယ်မှအကြီး စီရန်';
$ec_lang['lpn_pane_manage_cols']='ကော်လံများ စီမံရန်…';
$ec_lang['lpn_pane_manage_cols_title']='ကော်လံများ စီမံရန်';
$ec_lang['lpn_pane_manage_cols_show']='ပြရန်';
$ec_lang['lpn_pane_manage_cols_up']='အပေါ်သို့ ရွှေ့ရန်';
$ec_lang['lpn_pane_manage_cols_down']='အောက်သို့ ရွှေ့ရန်';
$ec_lang['lpn_pane_manage_cols_top']='အစသို့ ရွှေ့ရန်';
$ec_lang['lpn_pane_manage_cols_bottom']='အဆုံးသို့ ရွှေ့ရန်';
$ec_lang['lpn_pane_colmenu_tip']='ကော်လံများကို ဖျောက်ရန် (သို့) စီမံရန်';
$ec_lang['lpn_pane_sortarrow_tip']='စီထားမှုကို ပြောင်းပြန်လှန်ရန်';
$ec_lang['lpn_tool_area_window']='ဘောင်ဖြင့် ရွေးချယ်ရန်';
$ec_lang['lpn_tool_area_lasso']='ဘောင်ဝိုင်းဖြင့် ရွေးချယ်ရန်';
$ec_lang['lpn_tool_area_polygon']='ပုံစံကွက်ဖြင့် ရွေးချယ်ရန်';
$ec_lang['lpn_tool_delete']='ဖျက်ရန်';
$ec_lang['lpn_tool_zoom_extent']='ပုံလုံးပြရန်';
$ec_lang['lpn_tool_zoom_window']='ဇူးမ် ဘောင်';
$ec_lang['lpn_zoom_in']='ဇူးမ် ချဲ့ရန်';
$ec_lang['lpn_zoom_out']='ဇူးမ် လျှော့ရန်';
$ec_lang['lpn_new_text']='စာသား';
$ec_lang['lpn_field_text_bold']='စာလုံးထူ';
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
$ec_lang['lpn_field_text_anchor']='ချိတ်ဆက်ထားသည့်နေရာ';
$ec_lang['lpn_field_text_align']='အလျားလိုက် ချိန်ညှိမှု';
$ec_lang['lpn_field_text_align_left']='ဘယ်';
$ec_lang['lpn_field_text_align_center']='အလယ်';
$ec_lang['lpn_field_text_align_right']='ညာ';
$ec_lang['lpn_field_text_valign']='ဒေါင်လိုက် ချိန်ညှိမှု';
$ec_lang['lpn_field_text_valign_top']='အပေါ်';
$ec_lang['lpn_field_text_valign_middle']='အလယ်';
$ec_lang['lpn_field_text_valign_bottom']='အောက်';
$ec_lang['lpn_field_text_rotation']='ထောင့် (ဒီဂရီ)';
$ec_lang['lpn_field_text_match_pipe']='အနီးဆုံး လိုင်း၏ ထောင့်ဘက်သို့ လှည့်ပါ';
$ec_lang['lpn_field_text_flip']='180° လှည့်ရန်';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='ချိတ်ဆက်ထားသော အစိတ်အပိုင်း';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='ဤစာသားကို အစိတ်အပိုင်းတစ်ခုနှင့် လိုက်နိုင်လောက်အောင် နီးကပ်စွာ ထားရှိခဲ့သောကြောင့်၊ ၎င်းသည် ထိုအစိတ်အပိုင်းနှင့်အတူ ရွေ့လျားပြီး ခေါင်းဆောင်မျဉ်းတစ်ခု ရှိသည်။ ခေါင်းဆောင်မျဉ်းပေါ်ရှိ စာသားသည် ၎င်းထိုင်နေသည့် ဘက်မှ အလျားလိုက်နှင့် ဒေါင်လိုက် ချိန်ညှိမှုကို ယူသောကြောင့်၊ ချိတ်ဆက်ထားနေစဉ် ထိုအတန်း နှစ်ခုကို မပေးထားခြင်း ဖြစ်သည်။';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='ဖျန်းစက် ကိန်း';
$ec_lang['lpn_field_emitter_tip']='ဖိအားပေါ်မူတည်သည့် ထပ်တိုး ထွက်စီးမှုတစ်ခု၊ ရေဖျန်းစက်၊ ဖွင့်ထားသော ထွက်ပေါက် (သို့) မော်ဒယ်ပြုလုပ်ထားသော ယိုစိမ့်မှုတစ်ခုအတွက်။ ၎င်းထုတ်လွှတ်သည့် ရေစီးနှုန်းမှာ ဤကိန်းနှင့် ဖိအားကို ဖျန်းစက် ထပ်ကိန်းအထိ တင်ထားသော တန်ဖိုးကို မြှောက်ထားခြင်း ဖြစ်ပြီး၊ ၎င်းကို ကွန်ရက်တစ်ခုလုံးအတွက် ဆက်တင်များ၊ တွက်ချက်မှု၊ ဟိုက်ဒရောလစ် တွင် တစ်ကြိမ်သာ သတ်မှတ်သည်။ သာမန် ဆက်စပ်နေရာတစ်ခုတွင် ဗလာချန်ထားပါ။';
$ec_lang['lpn_field_elev']='အမြင့်';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='ဤနေရာရှိ မြေမျက်နှာပြင် (သို့) ပိုက်အဆင့်။ မည်သည့်သုညမှတ်ကိုမဆို အသုံးပြု၍ တိုင်းတာနိုင်သော်လည်း၊ နေရာတိုင်းတွင် တူညီသောမှတ်ကို အသုံးပြုရမည်။';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='ဖိမြင့်ဆင့်';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='ရေကန်ရှိ ရေမျက်နှာပြင်အဆင့်ကို အမြင့်တစ်ခုအဖြစ် တိုင်းတာသည်၊ ဖိအားအဖြစ် မဟုတ်ပါ။ ရေမျက်နှာပြင်ကို ရေကန်၏အမြင့်တွင် ထားလိုပါက ဗလာချန်ထားပါ။';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='ရေတိုက်ကြမ်းပြင်၏ အမြင့်။ ရေတိုက်ရှိ ရေနက်ရှိုင်းမှုများကို ဤနေရာမှ အပေါ်သို့ တိုင်းတာသည်။';
$ec_lang['lpn_field_tank_level']='ရေနက်ရှိုင်းမှု';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='ရေတိုက်ထဲတွင် ရပ်နေသော ရေ၏ နက်ရှိုင်းမှု၊ ရေတိုက်ကြမ်းပြင်မှ အပေါ်သို့ တိုင်းတာသည်။ ရေမျက်နှာပြင်မှာ ရေတိုက်ကြမ်းပြင်၏ အမြင့်နှင့် ဤနက်ရှိုင်းမှု ပေါင်းထားသည့် တန်ဖိုးဖြစ်သည်။';
$ec_lang['lpn_field_tank_minlevel']='အနိမ့်ဆုံး ရေနက်ရှိုင်းမှု';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='ရေတိုက်ကို အလွတ်အဖြစ် သတ်မှတ်သည့် ရေနက်ရှိုင်းမှု၊ ရေတိုက်ကြမ်းပြင်မှ အပေါ်သို့ တိုင်းတာသည်။';
$ec_lang['lpn_field_tank_maxlevel']='အမြင့်ဆုံး ရေနက်ရှိုင်းမှု';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='ရေတိုက်ကို ပြည့်နေသည်ဟု သတ်မှတ်သည့် ရေနက်ရှိုင်းမှု၊ ရေတိုက်ကြမ်းပြင်မှ အပေါ်သို့ တိုင်းတာသည်။';
$ec_lang['lpn_field_tank_diameter']='ရေတိုက် အချင်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='ရေတိုက်၏ တစ်ဖက်မှ တစ်ဖက်သို့ အနံ။ ၎င်းသည် အမြင့်နှင့် တူညီသော ယူနစ်ဖြင့်ဖော်ပြသည်၊ ပိုက်အချင်း ယူနစ်ဖြင့် မဟုတ်ပါ။ ၎င်းက ရေနက်ရှိုင်းမှု တစ်ခုအတွက် ရေမည်မျှ ဆံ့မည်ကို သတ်မှတ်ပေးသည်။';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='ရေတိုက်ရှိ ရေမျက်နှာပြင် အမြင့် - ရေတိုက်ကြမ်းပြင်၏ အမြင့်နှင့် ရေနက်ရှိုင်းမှု ပေါင်းထားသည့် တန်ဖိုးဖြစ်သည်။ ၎င်းသည် ဖြေရှင်းစက်က ရေတိုက်အတွက် အသုံးပြုသော အဆင့်ဖြစ်သည်။';
$ec_lang['lpn_close']='ပိတ်ရန်';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='ဂုဏ်သတ္တိများ';
$ec_lang['lpn_empty_hint']='ဥပမာတစ်ခု ဖွင့်ရန် ဖိုင် > ပရောဂျက်အသစ် ကိုသုံးပါ။ သို့မဟုတ် ကိရိယာဘားမှ ရေကန်၊ ဆက်စပ်နေရာနှင့် ပိုက်လိုင်း ထည့်ခြင်းဖြင့် စတင်ပါ။';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='သင့်ကွန်ရက်သည် မပျက်စီးပါ။';
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
$ec_lang['lpn_examples_welcome']='EPANET ဖြေရှင်းစက်ဖြင့် ရေပေးရေးကွန်ရက် မော်ဒယ်လုပ်ခြင်းကို ကြိုဆိုပါသည်';
$ec_lang['lpn_examples_heading']='ဥပမာတစ်ခု၏ ကိုယ်ပိုင်မိတ္တူကို ဖွင့်ရန်';
$ec_lang['lpn_examples_sub']='တစ်ခုစီသည် သင့်ကိုယ်ပိုင်မိတ္တူအဖြစ် ဖွင့်ပါသည်။ ပြောင်းလဲပါ၊ သိမ်းဆည်းပါ၊ (သို့) မိတ္တူအသစ်တစ်ခု ပြန်ဖွင့်၍ အစမှ ပြန်စတင်ပါ။';
$ec_lang['lpn_examples_open']='ဖွင့်ရန်';
$ec_lang['lpn_examples_menu']='ဥပမာ ဖွင့်ရန်…';
$ec_lang['lpn_examples_blank']='(သို့) ဤနေရာမှ စတင်ပါ';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='နေရာ - {nodes}၊ ဆက်သွယ်မှု - {links}';
$ec_lang['lpn_examples_failed']='ဥပမာများကို ဖွင့်၍မရခဲ့ပါ။ ပုံဆွဲမှုတစ်ခု စတင်ရန် ဖိုင် > ပရောဂျက်အသစ် ကိုသုံးပါ။';
$ec_lang['lpn_examples_loading']='ဥပမာများ ဖွင့်နေသည်…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='တစ်ခုခု ပြင်ရန်';
$ec_lang['lpn_help_notes']='ဤစာမျက်နှာအကြောင်း မှတ်ချက်များ';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='ဤနေရာတွင် တစ်ခုခု မှားနေပါသလား?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='တစ်ချက် နှိပ်လိုက်ရုံဖြင့် ဤစာမျက်နှာတွင် တစ်ခုခု မှားနေကြောင်း ကျွန်ုပ်တို့ကို အသိပေးပါလိမ့်မည်။ ၎င်းသည် ဤစာမျက်နှာ၏ အမည်၊ သင်ဖတ်နေသော ဘာသာစကား၊ နှင့် မြေပုံပေါ်တွင် စာသား ရှိလျှင် ထိုစာသားကို ပေးပို့သည်။ သင်ရိုက်ထည့်ထားသည့်အရာ၊ လိပ်စာ၊ (သို့) သင့်ပုံကြမ်းမှ မည်သည့်အရာမျှ ၎င်းသည် မပေးပို့ပါ။ ၎င်းသည် သင်ဘယ်သူဖြစ်သည်ကို ကျွန်ုပ်တို့အား မည်သို့မျှ မပြောပြသောကြောင့်၊ ဘယ်သူမျှ ပြန်ရေးနိုင်မည် မဟုတ်ပါ။ ပိုမို ပြောလိုပါက Help, Fix something ကို သုံးပါ။';
$ec_lang['lpn_wrong_thanks']='ကျေးဇူးတင်ပါသည်။ ထိုအချက်အလက် ကျွန်ုပ်တို့ထံ ရောက်ရှိသွားပါပြီ။';
$ec_lang['lpn_status_example_opened']='{name} ကို ဖွင့်ပြီးပါပြီ။ ၎င်းသည် သင့်ကိုယ်ပိုင်မိတ္တူဖြစ်သည် - ဖိုင် > အမည်ပေးသိမ်းရန် ဖြင့် သိမ်းဆည်းပါ။';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='ဤစာမျက်နှာသည် ဆွဲကြောင်းနေရာ၏ အရွယ်အစားကို ရှာဖွေမတွေ့နိုင်ခဲ့သောကြောင့်၊ မြေပုံသည် တွက်ချက်နိုင်ခဲ့သော နောက်ဆုံးမြင်ကွင်းကို ပြသနေသည်။ ဝင်းဒိုးကို အရွယ်အစား ပြန်ညှိလိုက်ပါက ထပ်စမ်းပေးမည်။ ဆက်တိုက် ဖြစ်နေပါက၊ စာမျက်နှာ တိုင်းတာမှုများကို ပိတ်ဆို့ထားသော ဘရောက်ဇာ extension တစ်ခုက အများအားဖြင့် အကြောင်းရင်း ဖြစ်သည်။';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='အခြေခံ ကွန်ရက်၊ L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='ဤနေရာမှ စတင်ပါ။ ရေကန်တစ်ခု၊ စက်တစ်လုံးနှင့် သေးငယ်သော အစိတ်အပိုင်းကွင်းတစ်ခု - ရေကွန်ရက်တစ်ခုအဖြစ် အလုပ်လုပ်နိုင်သေးသည့် အသေးဆုံးအစီအစဉ်။ တစ်စက္ကန့်လျှင် လီတာ၊ မီတာနှင့် မီလီမီတာဖြင့်။';
$ec_lang['lpn_ex_basic_us_title']='အခြေခံ ကွန်ရက်၊ gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='တူညီသော အစပြု ကွန်ရက်ကို မိနစ်လျှင် ဂါလံ၊ ပေနှင့် လက်မဖြင့်။';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 နှင့် စည်းမျဉ်းအခြေပြု ထိန်းချုပ်မှုများ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='EPANET ၏ ကိုယ်ပိုင် နမူနာကွန်ရက်သုံးခုအနက် အသေးဆုံးဖြစ်သည် - ရေကန်တစ်ခု၊ စက်တစ်လုံးနှင့် အစိတ်အပိုင်းကွင်းတစ်ခု။';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='EPANET ၏ နမူနာများမှ ရေတိုက်တစ်ခုပါသော ကိုင်းအမျိုးမျိုးထွက်သော ဖြန့်ဖြူးမှုစနစ်တစ်ခု။';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='EPANET ၏ ကြီးမားသော နမူနာ - ဆက်စပ်နေရာ 92 ခု၊ ရေတိုက် 3 ခုနှင့် ရေကန် 2 ခု (တစ်ခုသည် မြစ်ဖြစ်သည်)။ တကယ့်အရွယ်အစား မော်ဒယ်တစ်ခု မြေပုံပေါ်တွင် မည်သို့ရှိသည်ကို ကြည့်ရှုရန် ဖွင့်ကြည့်ထိုက်ပါသည်။';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3၊ lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='EPANET Net3 ကွန်ရက်ကို Novato, CA ရှိ လတ္တီတွဒ်/လောင်ဂျီတွဒ်သို့ ပြောင်းလဲထားပြီး၊ နောက်ခံတွင် ကမ္ဘာ့မြေပုံ ပါဝင်သည်။';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='မီးငြိမ်းသတ်ရေးစီးနှုန်းကို အများဆုံးနေ့စဉ်လိုအပ်ချက်အပေါ် ပေါင်းထည့်၍ ဖြေရှင်းထားသော စီးပွားရေးနေရာတစ်ခု၊ အချိန်တစ်ခုတည်းတွင်၊ နေရာအစီအစဉ်ပုံပေါ်တွင် ရေးဆွဲထားသည်။';
$ec_lang['lpn_tool_undo']='ပြန်ဖျက်ရန်';
$ec_lang['lpn_confirm_example']='ဤလုပ်ဆောင်ချက်သည် ဥပမာကွန်ရက်ကို သင့်တွင်ရှိပြီးသား ကွန်ရက်ထဲသို့ ထည့်သွင်းလိမ့်မည်။ ဆက်လုပ်မလား။';
$ec_lang['lpn_field_diameter']='အချင်း';
$ec_lang['lpn_demand_tip']='ဤဆက်စပ်နေရာတွင် ကွန်ရက်မှ ထုတ်ယူသော ရေစီးနှုန်း။ ဤနေရာမှ ကွန်ရက်ထဲသို့ ရေထည့်သွင်းလိုပါက အနုတ်ဂဏန်းဖြင့် ထည့်ပါ။';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='ဤယူနစ်သည် သင်ရိုက်ထည့်သော ထည့်သွင်းချက်များ၏ အဓိပ္ပာယ်ကို ဆုံးဖြတ်သည်';
$ec_lang['lpn_units_warn_lead']='{unit} သည် အောက်ပါအတွက် သင်ရိုက်ထည့်သည့် ယူနစ်ဖြစ်သည် -';
$ec_lang['lpn_units_options_head']='ယူနစ်တစ်ခု ပြောင်းလိုက်သောအခါ -';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='ဖျက်ဆီးခြင်း မရှိ';
$ec_lang['lpn_units_nondestructive_desc']='ဖျက်ဆီးခြင်း မရှိ - အကွက်တိုင်းကို ရှိသည့်အတိုင်း ထားပြီး ယူနစ်အသစ်ဖြင့်သာ ပြန်အနက်ဖွင့်သည်။';
$ec_lang['lpn_units_destructive']='ဖျက်ဆီးသည်';
$ec_lang['lpn_units_destructive_desc']='ဖျက်ဆီးသည် - အကွက်တိုင်းကို သင်္ချာနည်းဖြင့် ပြောင်းလဲရေးသားသဖြင့်၊ ကွန်ရက်သည် ပြောင်းလဲမှု သည်းခံချက်အတွင်း ရုပ်ပိုင်းဆိုင်ရာ အတူတူနီးပါး ကျန်ရှိနေသည်။ မူလ ရိုက်ထည့်ချက်များ ပျောက်သွားသည်။ Undo ဖြင့် ၎င်းတို့ ပြန်ရောက်နိုင်သည်။';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='ယခု တန်ဖိုး {n} ခုသည် {unit} ဟု အဓိပ္ပာယ်ရှိလာသည်။ မည်သည့်အရာမျှ ပြန်ရေးထားခြင်း မရှိပါ။';
$ec_lang['lpn_status_converted']='တန်ဖိုး {n} ခုကို {unit} အဖြစ် ပြန်ရေးလိုက်ပါသည်။';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='ကွန်ရက်ကို ပမာဏတစ်ခုအလိုက် အရောင်ခြယ်ပါ၊ ထို့ကြောင့် မြေပုံကြီးကို တစ်ချက်ကြည့်ရုံနှင့် နားလည်နိုင်သည်။ ဖိအားနှင့် ရေအလျင်နှုန်းသည် များသောအားဖြင့် အရေးကြီးဆုံး နှစ်ခုဖြစ်သည်။';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='အရှည်';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='မြေပုံ ကိုဩဒိနိတ်';
$ec_lang['lpn_units_mapcoords_deg']='ဒီဂရီ';
$ec_lang['lpn_units_usft']='US စစ်တမ်း ပေ';
$ec_lang['lpn_units_elevhead']='အမြင့်နှင့် ဖိမြင့်ဆင့်';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='ဖိမြင့်ဆင့်ဆုံးရှုံးမှု အစောက်';
$ec_lang['lpn_result_gradient_tip']='ဖိမြင့်ဆင့်ဆုံးရှုံးမှုကို ပိုက်၏အလျားနှင့် စားခြင်း။ ဒီဇိုင်းကန့်သတ်ချက် တစ်ခုတည်းနှင့် နှိုင်းယှဉ်ရန် အလျားမတူသော ပိုက်များကို ယှဉ်ရန် အသုံးပြုပါ။';
$ec_lang['lpn_result_water_age']='ရေအသက်';
$ec_lang['lpn_result_water_age_tip']='ဤနေရာသို့ ရောက်ရှိသော ရေသည် စနစ်ထဲတွင် မည်မျှကြာ ရှိနေပြီလဲ ဖြစ်သည်။ စီးဆင်းမှုများ တွေ့ဆုံရာနေရာတွင်၊ ရောက်ရှိလာသော ရေသည် အသက်အရွယ် ရောနှောနေပြီး၊ ဤနေရာရှိ ဂဏန်းသည် ရေစီးနှုန်းဖြင့် အလေးချိန်ပေးထားသော ပျမ်းမျှတန်ဖိုး ဖြစ်သည် - တိုတောင်းသော ပိုက်လိုင်းအသစ်တစ်ခုက အဓိက ပေးသွင်းသော ဆက်စပ်နေရာတစ်ခုသည် အသက်အရွယ် နိမ့်စွာ ပြသနိုင်သည်၊ ရှည်လျားသော အဆုံးပိတ်ပိုက်တစ်ခုကလည်း ပေးသွင်းနေသော်လည်းပင်။ ရေတိုက်တစ်ခုတွင် ၎င်းသည် ကိုင်ဆောင်ထားသော ရေ၏ ပျမ်းမျှ အသက်အရွယ်ဖြစ်ပြီး၊ ထို့ကြောင့် နှေးကွေးစွာ လှည့်ပတ်သော ရေတိုက်တစ်ခုသည် ကွန်ရက်တစ်ခုတွင် အကြာဆုံး ရေဟောင်း ဖြစ်လေ့ရှိသည်။ နှိုင်းယှဉ်ရန် စည်းမျဉ်းသတ်မှတ်ထားသော ကန့်သတ်ချက် မရှိသောကြောင့်၊ ဤဂဏန်းကို သင့်ကိုယ်ပိုင်စနစ်နှင့် နှိုင်းယှဉ်၍ ဆုံးဖြတ်ပါ။';
$ec_lang['lpn_result_source_share']='ရင်းမြစ် ဝေစု';
$ec_lang['lpn_result_source_share_tip']='ဤနေရာသို့ ရောက်ရှိသော ရေထဲမှ မည်မျှသည် ခြေရာခံနေရာမှ လာသနည်း ဆိုသည်ကို ပြသသည်။ ၎င်းသည် ရင်းမြစ် ခြေရာခံမှု ခွဲခြမ်းစိတ်ဖြာမှုက အစီရင်ခံသည့်အရာ ဖြစ်သည်။';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='ပျမ်းမျှ ရေအသက်';
$ec_lang['lpn_result_avg_source_share']='ပျမ်းမျှ ရင်းမြစ် ဝေစု';
$ec_lang['lpn_result_avg_concentration']='ပျမ်းမျှ ပါဝင်ပမာဏ';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='ပွတ်တိုက်မှုကိန်း';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='တုံ့ပြန်မှုနှုန်း';
$ec_lang['lpn_result_status']='အခြေအနေ';
$ec_lang['lpn_result_status_open']='ဖွင့်ထားသည်';
$ec_lang['lpn_result_status_closed']='ပိတ်ထားသည်';
$ec_lang['lpn_result_head']='ဖိမြင့်ဆင့်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='ဤနေရာရှိ ရေ၏စွမ်းအင်ကို ရေတိုင်အမြင့်တစ်ခုအဖြစ် ဖော်ပြထားသည်။ ၎င်းသည် လုံးဝ (absolute) အမြင့်ဖြစ်ပြီး၊ ဖိအားမှာမူ ဂိတ်တိုင်းတာချက်တစ်ခု ဖြစ်သည်။';
$ec_lang['lpn_result_pressure']='ဖိအား';
$ec_lang['lpn_result_flow']='ရေစီးနှုန်း';
$ec_lang['lpn_result_velocity']='ရေအလျင်နှုန်း';
$ec_lang['lpn_result_headloss']='ဖိမြင့်ဆင့်ဆုံးရှုံးမှု';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='ဤပရောဂျက်၏ ဆက်တင်များကိုသာ ပြန်လည်သတ်မှတ်သည်။ သင်၏ ပုံနှင့် အခြားပရောဂျက်များကို မပြောင်းလဲပါ။ သင်နှစ်သက်သော ဆက်တင်များကို နောက်တွင်ပြန်သုံးရန် သိမ်းလိုပါက၊ ဆက်တင်များသာပါသော ပရောဂျက်ဖိုင်တစ်ခု သိမ်းဆည်းပါ။';
$ec_lang['lpn_reset_all_tip']='ပရောဂျက်အားလုံး၊ နောက်ခံပုံအားလုံး၊ ဆက်တင်အားလုံးနှင့် သင်၏ယူနစ်ရွေးချယ်မှုများကို ဖျက်ပြီးနောက်၊ ပထမဆုံးအကြိမ် လာရောက်ကြည့်ရှုသူတစ်ဦးမြင်ရသည့်အတိုင်း စာမျက်နှာကို ပြန်ဖွင့်ပေးသည်။ ၎င်းသည် အားလုံးကို ရှင်းလင်းပေးသော တစ်ခုတည်းသော ပြန်လည်သတ်မှတ်ခြင်းဖြစ်သည်။';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='ဤတွက်ချက်စက်သည် ပရောဂျက်ယူနစ်များနှင့် ထည့်သွင်းချက်များကို ရိုက်ထည့်သည့်အတိုင်း သိမ်းဆည်းသည်၊ သို့သော် ယခင်က ဂဏန်းများကို SI ယူနစ်သို့ ပြောင်းလဲပြီး သိမ်းဆည်းခဲ့သည်။ ဤပရောဂျက်ကို ထိုပြောင်းလဲမှုမတိုင်မီ သိမ်းဆည်းခဲ့ခြင်းဖြစ်၍ ၎င်း၏ဂဏန်းများသည် SI ဖြင့် သိမ်းထားသည်။ ၎င်းတို့ကို လက်ရှိယူနစ်များသို့ နောက်ဆုံးတစ်ကြိမ် ပြောင်းလဲမလား။ သင်ဆုံးဖြတ်နိုင်ရန် ပြောင်းလဲမည့် အချင်းအချို့ကို ပြောင်းလဲမီနှင့် ပြောင်းလဲပြီးတန်ဖိုးများနှင့်တကွ ဖော်ပြထားသည် -';
$ec_lang['lpn_v2_restore_yes']='ပြောင်းလဲရန်';
$ec_lang['lpn_v2_restore_never']='မလုပ်ပါနှင့်။ နောက်နောင် ထပ်မမေးပါနှင့်။';
$ec_lang['lpn_v2_restore_no']='လက်ရှိယူနစ်များကို အရင်စစ်ဆေးနိုင်ရန် ပိတ်ပါ';
$ec_lang['lpn_storage_too_new']='ဤပရောဂျက်ကို စာမျက်နှာ၏ ပိုမိုနောက်ပိုင်းဗားရှင်းတစ်ခုက သိမ်းဆည်းခဲ့ခြင်းဖြစ်၍၊ ဤနေရာတွင် ဖွင့်၍မရပါ။';
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
$ec_lang['lpn_tool_file']='ဖိုင်';
$ec_lang['lpn_menu_edit']='တည်းဖြတ်ရန်';
$ec_lang['lpn_menu_insert']='ထည့်သွင်းရန်';
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
$ec_lang['lpn_menu_map']='မြေပုံ';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='လမ်းမြေပုံ ပြရန်';
$ec_lang['lpn_basemap_satellite_show']='ဂြိုဟ်တု ပုံရိပ်များ ပြရန်';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='ပထဝီအညွှန်းတပ်ထားသည်';
$ec_lang['lpn_xymap']='ဒေသန္တရ';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='ပြောင်းလဲရန်…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='{name} ၏ မိတ္တူ';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='ပြောင်းလဲရန်';
$ec_lang['lpn_convas_coordsys_tip']='မိတ္တူကို ပြောင်းလဲမည့် ကိုဩဒိနိတ် စနစ်။ ဤပရောဂျက်၏ စနစ်နှင့် ကွဲပြားပါက၊ နေရာချထားရေး အဆင့် နှစ်ဆင့် ဆက်လက်ပါလာမည်။ မိမိရှိရာနေရာကို သိရှိပြီးသား ပရောဂျက်တစ်ခုသည် အဆင့်နှစ်ဆင့်လုံး ဖြေဆိုပြီးသားအနေဖြင့် ပွင့်လာမည်ဖြစ်၍၊ ၎င်းတို့ကို ရှိသည့်အတိုင်း လက်ခံနိုင်သည် (သို့) ပြောင်းလဲမှုများ ပြုလုပ်နိုင်သည်။';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='လက်ရှိ - {crs}';
$ec_lang['lpn_convas_epsg']='EPSG ကိုဩဒိနိတ် စနစ်';
$ec_lang['lpn_convas_epsg_tip']='EPSG မှတ်ပုံတင်စာရင်းမှ ကိုဩဒိနိတ် စနစ်တစ်ခုကို ရွေးချယ်ပါ။ လတ္တီတွဒ်နှင့် လောင်ဂျီတွဒ်မှာ WGS 84 (EPSG:4326) ဖြစ်သည်။';
$ec_lang['lpn_convas_unnamed']='အမည်မဲ့ (ဒေသန္တရ) ပထဝီအညွှန်း';
$ec_lang['lpn_convas_unnamed_tip']='အရှည် ယူနစ်ဖြင့် ဒေသန္တရ ကိုဩဒိနိတ်များ၊ ကမ္ဘာ့မြေပုံ တွဲထည့်ထားသည်။';
$ec_lang['lpn_convas_none_tip']='အရှည် ယူနစ်ဖြင့် ဒေသန္တရ ကိုဩဒိနိတ်များ၊ ယခုအချိန်တွင် ကမ္ဘာ့မြေပုံ မပါဝင်ပါ။';
$ec_lang['lpn_convas_units_tip']='မိတ္တူကို ပြောင်းလဲမည့် ယူနစ်များ။ မူရင်းသည် ၎င်း၏ကိုယ်ပိုင် ကိန်းများနှင့် ယူနစ်များကို ဆက်ထားပါလိမ့်မည်။';
$ec_lang['lpn_convas_round']='ပြောင်းလဲထားသော တန်ဖိုးများကို ရေဖြတ်ရန်';
$ec_lang['lpn_convas_round_tip']='ဤပြောင်းလဲမှုက ပြန်ရေးသောကိန်းများကိုသာ၊ သင်ရွေးချယ်သော အနီးဆုံးအဆင့်သို့ ရေဖြတ်ပေးသည်။ ယူနစ် မပြောင်းလဲသည့် တန်ဖိုးများကို ရှိသည့်အတိုင်း ထားခဲ့သည်။';
$ec_lang['lpn_convas_round_none']='ရေဖြတ်ခြင်း မရှိပါ';
$ec_lang['lpn_convas_round_flow']='လိုအင်နှင့် ရေစီးနှုန်း';
$ec_lang['lpn_convas_label_col']='နောက်ဆက်';
$ec_lang['lpn_convas_label_tip']='မိတ္တူ၏ မြေပုံ အညွှန်းများပေါ်ရှိ ဤတန်ဖိုးနောက်တွင် ထည့်မည့် စာသား၊ \' mm\' (သို့) \' gpm\' ကဲ့သို့။ အထက်တွင် ရွေးချယ်ထားသော ယူနစ်မှ ကြိုတင်ဖြည့်ထားသည်၊ နောက်ဆက် မလိုလျှင် ရှင်းလင်းပါ။';
$ec_lang['lpn_convas_oneway']='ပြန်ပြောင်းခြင်းသည် ဒုတိယ ပြောင်းလဲမှုတစ်ခု ဖြစ်ပြီး၊ ပြန်ဖျက်ခြင်း မဟုတ်ပါ။ ပြောင်းလဲပြီး ပြန်ပြောင်းလိုက်သော ကိန်းတစ်ခုသည် မူလ ရိုက်ထည့်ခဲ့သည့်အတိုင်း အတိအကျ ပြန်မဖြစ်နိုင်ပါ။';
$ec_lang['lpn_convas_ok']='ပြောင်းလဲရန်';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} သည် အသုံးပြုနိုင်သော ပရိုဂျက်ရှင် အချက်အလက် မပါသော စာရင်းပါ ကိုဩဒိနိတ် စနစ် အနည်းငယ်အနက် တစ်ခု ဖြစ်သောကြောင့်၊ ၎င်းသို့ (သို့) ၎င်းမှ ပြောင်းလဲ၍ မရပါ။ မည်သည့်အရာမျှ မပြောင်းလဲခဲ့ပါ။';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='ပြောင်းလဲပြီး မိတ္တူသည် {name} ဖြစ်သည်။ မူရင်းပရောဂျက်ကို မပြောင်းလဲထားပါ။';
$ec_lang['lpn_convas_cancelled']='မည်သည့်အရာမျှ မပြောင်းလဲခဲ့ပါ။ မိတ္တူကို ပိတ်လိုက်ပြီး၊ မူရင်းပရောဂျက်ကို မပြောင်းလဲထားပါ။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='ဤပရောဂျက်ကို တဲ့ဘ်အသစ်တစ်ခုသို့ ကူးယူပြီး၊ သင်ရွေးချယ်သော ကိုဩဒိနိတ် စနစ်နှင့် ယူနစ်များသို့ မိတ္တူကို ပြောင်းလဲပေးသည်။ ကိုဩဒိနိတ် စနစ် ပြောင်းလဲသည့်အခါ၊ လမ်းညွှန်တစ်ခုက သင့်ကွန်ရက်နောက်ကွယ်ရှိ မြေပုံကို ခန့်မှန်းအားဖြင့် ဇူးမ်လုပ်ပြီး၊ ထို့နောက် သင့်ကွန်ရက်ကို မြေပုံပေါ်တွင် ပို၍တိကျစွာ အတိုင်းအတာချိန်ညှိကာ လှည့်ပေးဖို့ လမ်းညွှန်ပေးပါလိမ့်မည်။ ဤပရောဂျက်ကို ရှိသည့်အတိုင်းပင် ထားခဲ့ပါသည်။ မည်သည့်အရာကိုမျှ မပြောင်းလဲဘဲ ပထဝီအညွှန်း တပ်လိုပါက၊ မြေပုံ > ကမ္ဘာ့မြေပုံ > တွဲထည့်ရန် ကို အစား သုံးပါ။';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='ဤပရောဂျက်ကို ပထဝီအညွှန်း တပ်ထားပြီးသားဖြစ်သောကြောင့်၊ ကွန်ရက်သည် မြေပုံပေါ်တွင် ရှိနေပြီးဖြစ်ပြီး မည်သည့်အရာမျှ မရွှေ့ခဲ့ပါ။ ၎င်းသည် နေရာမှန်တွင် ရှိမရှိ စစ်ဆေးပြီး၊ မော်ဒယ်ကို ဤနေရာတွင် ထားရန် ခလုတ်နှင့် ဤနေရာချထားမှုကို ထားရန် ခလုတ်ကို နှိပ်ပါ။';
$ec_lang['lpn_georef_intro']='မော်ဒယ်ကို ချထားခြင်းသည် အဆင့် နှစ်ဆင့် ရှိသည်။ အဆင့် ၁ သည် လျင်မြန်သော အဆင့်ဖြစ်သည် - မော်ဒယ်ကို ငြိမ်ထားပြီး၊ သင့်နေရာသည် မော်ဒယ်၏ အောက်တွင် ခန့်မှန်း မှန်ကန်သော အရွယ်အစားဖြင့် ရှိလာသည်အထိ နောက်ခံမြေပုံကို ရွှေ့ပါ။ ဤအဆင့်တွင် လှည့်ခြင်း မပါသေးပါ။ အဆင့် ၂ သည် တိကျသော အဆင့်ဖြစ်သည် - မော်ဒယ်ကိုယ်တိုင်ကို ဆွဲပါ၊ အရွယ်ချိန်ညှိပါ၊ လှည့်ပါ။ သင့်ပရောဂျက်သည် အစတွင် ကမ္ဘာတစ်ဝှမ်းလုံး မြေပုံပေါ်၌ ရှိနေသောကြောင့်၊ ဦးစွာ သင့်တည်နေရာကို ရှာပြီး၊ မော်ဒယ်ကို ဤနေရာတွင် ထားရန် ခလုတ်ကို နှိပ်ပါ။';
$ec_lang['lpn_georef_adjust']='မော်ဒယ်သည် ယခု မြေပြင်ပေါ်တွင် ရှိနေပြီး၊ မြေပုံနှင့်အတူ ရွှေ့သွားပါလိမ့်မည်။ မော်ဒယ်ကို ရွှေ့ရန် ဆွဲပါ၊ အရွယ်ချိန်ညှိရန် ထောင့်တစ်ခုကို ဆွဲပါ၊ လှည့်ရန် မော်ဒယ်အပေါ်ရှိ စက်ဝိုင်း လက်ကိုင်ကို ဆွဲပါ။ (သို့) အောက်တွင် မြေပြင်အကွာအဝေးနှင့် လှည့်ထောင့်ကို ရိုက်ထည့်ပါ။';
$ec_lang['lpn_georef_step1']='အဆင့် ၂ ခုအနက် ၁ — လျင်မြန်သော';
$ec_lang['lpn_georef_step2']='အဆင့် ၂ ခုအနက် ၂ — တိကျသော';
$ec_lang['lpn_georef_step1_hint']='သင့်ပရောဂျက်သည် စခရင်ပေါ်တွင် ရှိရာနေရာမှာပင် ရှိနေမည်။ အောက်ခံမြေပုံကို ရွှေ့ပါ၊ ဇူးမ်လုပ်ပါ၊ နောက်ကွယ်ရှိမြေသည် ခန့်မှန်းအားဖြင့် နေရာမှန်၊ အရွယ်မှန် ဖြစ်လာသည်အထိ ပြုလုပ်ပြီးမှ မော်ဒယ်ကို ဤနေရာတွင် ထားရန် ခလုတ်ကို နှိပ်ပါ။';
$ec_lang['lpn_georef_detach']='ပြန်ကောက်ရန်';
$ec_lang['lpn_georef_size_prompt']='ပရောဂျက်တစ်ခုလုံးတွင် နေရာသည် အကျယ်မည်မျှရှိသနည်း?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='ဖြတ်လမ်း - {key} ကို နှိပ်ပါ။';
$ec_lang['lpn_tool_key_hint_two']='ဖြတ်လမ်း - {key} (သို့) {key2} ကို နှိပ်ပါ။';
$ec_lang['lpn_tool_add_junction_tip']='ဆက်စပ်နေရာ ထည့်ရန် မြေပုံကို နှိပ်ပါ - ပိုက်လိုင်းများ ဆုံသည့်နေရာ (သို့) ရေသုံးစွဲသည့်နေရာ။';
$ec_lang['lpn_tool_add_reservoir_tip']='ရေကန်တစ်ခု ထည့်ရန် မြေပုံကို နှိပ်ပါ - ကန့်သတ်မထားသော ရေရင်းမြစ်တစ်ခု၊ ရေအမြင့် တည်ငြိမ်သည်။';
$ec_lang['lpn_tool_add_tank_tip']='ရေတိုက်တစ်ခု ထည့်ရန် မြေပုံကို နှိပ်ပါ - ပြည့်ခြင်း၊ ကုန်ခြင်းဖြင့် ရေအမြင့် မြင့်တက်ကျဆင်းနေသော သိုလှောင်ရုံတစ်ခု။';
$ec_lang['lpn_tool_add_pipe_tip']='ပိုက်လိုင်း ဆွဲရန် နေရာတစ်ခုပြီးတစ်ခု နှိပ်ပါ။';
$ec_lang['lpn_tool_add_pump_tip']='ရေတင်စက် ထည့်ရန် နေရာတစ်ခုပြီးတစ်ခု နှိပ်ပါ။';
$ec_lang['lpn_tool_add_valve_tip']='ဗားလ် ထည့်ရန် နေရာတစ်ခုပြီးတစ်ခု နှိပ်ပါ။';
$ec_lang['lpn_tool_add_text_tip']='ပုံပေါ်တွင် မှတ်ချက်ရေးရန် မြေပုံကို နှိပ်ပါ။';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='ညွှန်ကြားထားသည့်အတိုင်း မြေပုံကို နှိပ်ပါက ပုံသဏ္ဍာန်အတွင်းရှိ အားလုံးကို ရွေးချယ်ပေးသည်။ ပုံသဏ္ဍာန်ကို ဘောင်၊ ဘောင်ဝိုင်းနှင့် ပုံစံကွက် အကြား ပြောင်းလဲရန် ဤခလုတ်ကို ထပ်နှိပ်ပါ။ ရွေးချယ်ထားပြီးသားများကို ဆက်လက်ထိန်းထားလျက် ထပ်ထည့်ခြင်း (သို့) ဖယ်ရှားခြင်း (toggle) ပြုလုပ်ရန် ရွေးချယ်နေစဉ် Shift ကို ဖိထားပါ။';
$ec_lang['lpn_area_selected']='{n} ခု ရွေးချယ်ထားသည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='ထိုဧရိယာတွင် မည်သည့်အရာမျှ မတွေ့ပါ။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='ပိုက်လိုင်း၏ပုံသဏ္ဍာန်ကို ပြုပြင်ပေးသော အကွေ့မှတ်များကို ထည့်ခြင်း၊ ဖယ်ရှားခြင်း လုပ်ပါ။ အကွေ့မှတ်တစ်ခု ထည့်ရန် ပိုက်လိုင်းကို နှိပ်ပါ၊ ဖယ်ရှားရန် အကွေ့မှတ်ကို နှိပ်ပါ၊ ရွှေ့ရန် အကွေ့မှတ်ကို ဖိဆွဲပါ။ အကွေ့မှတ်တစ်ခုသည် ဆွဲထားသော လမ်းကြောင်းကိုသာ ပြောင်းလဲစေပြီး၊ ဟိုက်ဒရောလစ်ကို မထိခိုက်ပါ။';
$ec_lang['lpn_tool_delete_tip']='မြေပုံပေါ်ရှိ မည်သည့်အရာကိုမဆို ဖျက်ရန် နှိပ်ပါ။';
$ec_lang['lpn_tool_undo_tip']='နောက်ဆုံးပြောင်းလဲမှုကို ပြန်ဖျက်ရန်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='ကွန်ရက်တစ်ခုလုံးကို ဝင်းဒိုးထဲ ညီအောင်ချရန်။';
$ec_lang['lpn_tool_zoom_window_tip']='မြေပုံပေါ်တွင် ဘောင်တစ်ခု၏ ဆန့်ကျင်ဘက် ထောင့်နှစ်ခုကို နှိပ်ပါ၊ (သို့) တစ်ခုကို ဖိဆွဲပါ၊ ၎င်းအပေါ်ကို ဇူးမ်ချဲ့ရန်။ ပုံလုံးပြရန် အတွက် ဤခလုတ်ကို ထပ်နှိပ်ပါ။';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='ဇူးမ် ချဲ့ရန်။ ဖြတ်လမ်း - +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='ဇူးမ် လျှော့ရန်။ ဖြတ်လမ်း - -';
$ec_lang['lpn_tool_settings_tip']='ဤပရောဂျက်၏ ဆက်တင်များကို ဖွင့်ရန်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='အစိတ်အပိုင်းတစ်ခုကို ၎င်း၏ ID ဖြင့် ရှာပါ၊ (သို့) အခြေအနေတစ်ခုနှင့် ကိုက်ညီသော အစိတ်အပိုင်းအားလုံးကို ရှာပြီး၊ ၎င်းတို့အားလုံးကို တစ်ပြိုင်နက် ပြောင်းလဲပါ။';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='ကိရိယာဘား သင်္ကေတများ၏ အဓိပ္ပာယ်';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='မြင်နိုင်မှု';
$ec_lang['lpn_pane_right_toggle_tip']='မြေပုံ၏ ညာဘက်ရှိ ဘောင်ကို ပြရန် (သို့) ဖျောက်ရန်။ ၎င်းတွင် အညွှန်းနှင့် အရောင် ရွေးချယ်မှုများ ပါဝင်သည်။';
$ec_lang['lpn_color_legend_open_tip']='‘မြင်နိုင်မှု’ ဘောင်ကိုဖွင့်ပြီး ဤအရောင်များကို ပြောင်းရန် နှိပ်ပါ။';
$ec_lang['lpn_color_node_field']='ဆက်စပ်နေရာများကို ဤအရာအလိုက် အရောင်ခြယ်ရန်';
$ec_lang['lpn_color_link_field']='ပိုက်လိုင်းများကို ဤအရာအလိုက် အရောင်ခြယ်ရန်';
$ec_lang['lpn_color_ramp_sequential']='အဆင့်ဆင့်';
$ec_lang['lpn_color_ramp_diverging']='ကွဲထွက်';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='အပိုင်းအခြား အရေအတွက်';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='အပိုင်းအခြား ခွဲဝေမှု';
$ec_lang['lpn_color_ranges_note']='အောက်ပါ နယ်နိမိတ်များကို သတ်မှတ်လိုက်ပြီးနောက် ပြောင်းလို့မရပါ - ၎င်းတို့သည် အဖြေများ ပြောင်းလဲသည်နှင့်အမျှ လိုက်၍ မပြောင်းပါ။ အထက်ရှိ ဒေတာခွဲခြားနည်းလမ်း တစ်ခုကို ရွေးချယ်ခြင်းက စနစ်၏ လက်ရှိအခြေအနေမှ နယ်နိမိတ်များကို သတ်မှတ်ပေးသည်။ တန်ဖိုးတစ်ခုကို ကိုယ်တိုင် ပြောင်းလိုက်ပါက အထက်ရှိ နည်းလမ်းသည် ကိုယ်တိုင် သတ်မှတ်ရန် သို့ ပြောင်းသွားပါလိမ့်မည်။';
$ec_lang['lpn_color_criterion_note']='ဤနည်းလမ်းသည် ၎င်း၏ နယ်နိမိတ်များကို ဒီဇိုင်း စံနှုန်းတစ်ခုမှ ယူသောကြောင့်၊ ဤနည်းလမ်းကို ရွေးချယ်ထားစဉ် အရောင်အရေအတွက်ကို ပြောင်းလို့မရပါ။';
$ec_lang['lpn_color_break_number']='နယ်နိမိတ်သည် ဂဏန်းတစ်ခု ဖြစ်ရမည်။ မြေပုံ မပြောင်းလဲပါ။';
$ec_lang['lpn_color_break_order']='နယ်နိမိတ်တစ်ခုစီသည် ၎င်းရှေ့ရှိ တစ်ခုထက် ပိုကြီးရမည်။ မြေပုံ မပြောင်းလဲပါ။';
$ec_lang['lpn_color_break_count']='အရောင်အရေအတွက်ထက် နယ်နိမိတ် တစ်ခုနည်းရမည်။ မြေပုံ မပြောင်းလဲပါ။';
$ec_lang['lpn_color_ramp_qualitative']='အမျိုးအစားခွဲ';
$ec_lang['lpn_color_ramp_rainbow']='သက်တံရောင်';
$ec_lang['lpn_color_ramp_rainbow_eg']='EPANET နှင့် တူညီသည်';
$ec_lang['lpn_color_example_material']='ပစ္စည်းအမျိုးအစား';
$ec_lang['lpn_color_ramp_ylgnbu']='အဝါမှ အပြာသို့';
$ec_lang['lpn_color_ramp_rdylbu']='အနီမှ အပြာသို့၊ အဝါကိုဖြတ်၍';
$ec_lang['lpn_georef_drop']='မော်ဒယ်ကို ဤနေရာတွင် ထားရန်';
$ec_lang['lpn_georef_finish']='ဤနေရာချထားမှုကို ထားရှိရန်';
$ec_lang['lpn_georef_scale']='ပုံဆွဲယူနစ်တစ်ခုလျှင် မြေပေါ်အကွာအဝေး';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='သင့်ပုံဆွဲချက်၏ ယူနစ်တစ်ခုသည် မြေပေါ်တွင် မည်မျှ ကျယ်ပြန့်သည်ကို ဆိုလိုသည်။ ရိုးရှင်းသော ဂရစ်ဒ်ပေါ်တွင် ဆွဲထားသည့်ပုံသည် များသောအားဖြင့် ဤအရာကို ဖော်မပြပါ၊ ထို့ကြောင့် ဤနေရာတွင် သတ်မှတ်ပါ — (သို့) ‘သွားရန်…’ ကို နေရာသည် မည်မျှကျယ်သည်ကို မေးခွင့်ပြုပြီး တွက်ချက်စေပါ။';
$ec_lang['lpn_georef_rotation']='နာရီလက်တံပြောင်းပြန် လှည့်ရန် (ဒီဂရီ)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='မော်ဒယ်တစ်ခုလုံး၏ မြောက်ဘက်သည် အမှန်တကယ် မြောက်ဘက်ကို ညွှန်နေအောင် နာရီလက်တံပြောင်းပြန် မည်မျှလှည့်ရမည်ကို ဆိုလိုသည်။';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='မော်ဒယ်ကို ဤနေရာတွင် အမြဲထားလိုက်မလား? နောက်ပိုင်းတွင် အစိတ်အပိုင်းတစ်ခုချင်းစီကို ဆက်ဆွဲနိုင်သေးသော်လည်း ပုံသည် xy ပရောဂျက် မဟုတ်တော့ပါ။ xy ကို ပြန်ရလိုပါက ဤပရောဂျက်ကို မသိမ်းဘဲ ပိတ်ပါ။';
$ec_lang['lpn_georef_done']='ယခု ၎င်းသည် lat/lon ပရောဂျက် ဖြစ်သွားပါပြီ။ မည်သည့်အစိတ်အပိုင်းကိုမဆို ၎င်း၏ အမှန်တကယ် တည်နေရာအနီးသို့ ရွှေ့ရန် ဆွဲပါ။';
$ec_lang['lpn_georef_backdrop_unrotated']='နောက်ခံပုံသည် မော်ဒယ်နှင့်အတူ ရွှေ့ပြီး အရွယ်အစား ပြောင်းခဲ့သော်လည်း၊ လှည့်၍မရခဲ့ပါ။ ချိန်ညှိရန် မြေပုံ၊ နောက်ခံပုံ၊ ရွှေ့ရန် ကို အသုံးပြုပါ။';
$ec_lang['lpn_georef_empty']='ထိုဖိုင်တွင် ကွန်ရက် မပါဝင်သောကြောင့်၊ ချထားစရာ မရှိပါ။';
$ec_lang['lpn_georef_unavailable']='နေရာချထားရေး ကိရိယာ ဖွင့်၍မရပါ။ စာမျက်နှာကို ပြန်ဖွင့်ပြီး ထပ်ကြိုးစားပါ။';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='ပရောဂျက်ပြောင်းလဲခြင်း မပြုလုပ်မီ "ဤနေရာချထားမှုကို ထိန်းသိမ်းမည်" ခလုတ်ဖြင့် နေရာချထားမှုကို အပြီးသတ်ပါ၊ (သို့) Cancel ကို နှိပ်ပါ။ နေရာချထားမှုသည် ဤပရောဂျက်ပိုင်ဖြစ်၍ အခြားပရောဂျက်တစ်ခုသို့ လိုက်ပါ၍မရပါ။';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='သိမ်းဆည်းခြင်း မပြုလုပ်မီ "ဤနေရာချထားမှုကို ထားရှိရန်" ခလုတ်ဖြင့် နေရာချထားမှုကို အပြီးသတ်ပါ၊ (သို့) Cancel ကို နှိပ်ပါ။ ပရောဂျက်ကို ဆက်လက် နေရာချထားနေဆဲဖြစ်၍၊ မျက်နှာပြင်ပေါ်ရှိအရာသည် ဖိုင်ထဲသို့ ရေးသွင်းမည့်အရာနှင့် မတူသေးပါ။';
$ec_lang['lpn_goto_menu']='လတ်တီကျုဒ်နှင့် လောင်ဂျီတွဒ်သို့ သွားရန်…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='ညှိကိန်း ရှိပြီးသား နေရာသို့ မြေပုံကို ရွှေ့ပါ။ မြေပုံတွင် ပေးသည့်အတိုင်း လတ်တီကျုဒ်ကို ဦးစွာ၊ ထို့နောက် လောင်ဂျီတွဒ်ကို ကြားတွင် space ခြားပြီး ရေးပါ - 38 -122';
$ec_lang['lpn_goto_prompt']='လတ်တီကျုဒ်နှင့် လောင်ဂျီတွဒ်၊ ထိုအစီအစဉ်အတိုင်း';
$ec_lang['lpn_goto_bad']='ထိုသည် လတ်တီကျုဒ်တစ်ခုနှင့် လောင်ဂျီတွဒ်တစ်ခု မဟုတ်ပါ။ 38 -122 ကဲ့သို့ ကြားတွင် space ခြားပြီး ထပ်ကြိုးစားပါ။';
$ec_lang['lpn_georef_goto']='သွားရန်…';
$ec_lang['lpn_georef_twopt']='အသိအမှတ် နေရာနှစ်ခုကို အသုံးပြုရန်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='သင့်ပုံရေးမှုပေါ်ရှိ နေရာနှစ်ခု အမှန်တကယ် ဘယ်မှာရှိသည်ကို သင်သိထားပြီးဖြစ်ပါက မော်ဒယ်ကို အတိအကျ ချထားနိုင်သည်။ တစ်ခုကို နှိပ်ပြီး ၎င်း၏ လတ္တီတွဒ်နှင့် လောင်ဂျီတွဒ်ကို ရိုက်ထည့်ပါ၊ ထို့နောက် ဒုတိယအမှတ်အတွက်လည်း ထပ်လုပ်ပါ။ တည်နေရာ၊ အတိုင်းအတာနှင့် လှည့်ခြင်းအားလုံးသည် ထိုအမှတ်နှစ်ခုမှ လိုက်ပါလာသည်။ ရွေးချယ်မှုကို ရပ်တန့်ရန် ဤခလုတ်ကို ထပ်နှိပ်ပါ။';
$ec_lang['lpn_georef_twopt_pick1']='သင့်ပုံရေးမှုပေါ်ရှိ လတ္တီတွဒ်နှင့် လောင်ဂျီတွဒ် သိထားသော အမှတ်တစ်ခုကို နှိပ်ပါ။';
$ec_lang['lpn_georef_twopt_pick2']='ယခု ဒုတိယ အသိအမှတ် နေရာကို ပထမနေရာနှင့် တတ်နိုင်သမျှ ဝေးဝေးတွင် နှိပ်ပါ။';
$ec_lang['lpn_georef_twopt_same']='ထိုအမှတ်သည် သင် ပထမဆုံး ရွေးထားသော အမှတ် ဖြစ်သည်။ တခြားတစ်ခုကို ရွေးပါ။';
$ec_lang['lpn_georef_twopt_done']='မော်ဒယ်သည် ယခု သင်ပေးထားသော အမှတ်နှစ်ခုအပေါ် ရောက်ရှိနေပါပြီ။ စစ်ဆေးပြီးလျှင် ဤနေရာချထားမှုကို ထားရှိရန် ခလုတ်ကို နှိပ်ပါ။';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='အောက်ခံ ဘောင်';
$ec_lang['lpn_pane_toggle_tip']='မြေပုံအောက်ရှိ panel ကို ပြရန် (သို့) ဖျောက်ရန်။ ၎င်းတွင် profile နှင့် အစိတ်အပိုင်း အမျိုးအစားတစ်ခုစီအတွက် ဇယား ပါဝင်သည်။';
$ec_lang['lpn_pane_resize']='ဘောင်ကို အမြင့်ချဲ့ရန် (သို့) လျှော့ရန် ဆွဲပါ';
$ec_lang['lpn_pane_tab_junctions']='ဆက်စပ်နေရာများ';
$ec_lang['lpn_pane_tab_reservoirs']='ရေကန်များ';
$ec_lang['lpn_pane_tab_tanks']='ရေတိုက်များ';
$ec_lang['lpn_pane_tab_pipes']='ပိုက်လိုင်းများ';
$ec_lang['lpn_pane_tab_pumps']='ရေတင်စက်များ';
$ec_lang['lpn_pane_tab_valves']='ဗားလ်များ';
$ec_lang['lpn_pane_tab_tip']='ဤ tab သည် ဤအမျိုးအစား၏ အစိတ်အပိုင်းများကို သင်စီစဉ်နိုင်၊ တည်းဖြတ်နိုင်သော ဇယားအဖြစ် ပြသသည်။ အဖြေ ကော်လံများကို တည်းဖြတ်၍ မရပါ။';
$ec_lang['lpn_pane_none']='ဤကွန်ရက်တွင် ၎င်းတို့ မရှိသေးပါ။';
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
$ec_lang['lpn_pane_text_attached']='ချိတ်ဆက်ထားသည်';
$ec_lang['lpn_pane_not_used']='အသုံးမပြုပါ';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='{q} ဖြင့် စစ်ထုတ်ထားသည်။ {all} အနက် {n} ခု ပြသနေသည်။';
$ec_lang['lpn_pane_filter_clear']='အားလုံး ပြရန်';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='ဤဇယားတွင် စစ်ထုတ်မှုနှင့် ကိုက်ညီသော အရာ တစ်ခုမျှ မရှိပါ။';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='ဇူးမ်ပြီး ရွေးချယ်ရန်';
$ec_lang['lpn_goto_on_map']='မြေပုံပေါ်တွင် ပြရန်';
$ec_lang['lpn_pane_select_on_map']='မြေပုံပေါ်တွင် ရွေးချယ်ရန်';
$ec_lang['lpn_pane_unselect_on_map']='မြေပုံပေါ်တွင် ရွေးချယ်မှု ပယ်ဖျက်ရန်';
$ec_lang['lpn_pane_print']='ဇယားကို ပုံနှိပ်ရန်';
$ec_lang['lpn_pane_print_tip']='သင်ကြည့်နေသော ဇယားကို ပရောဂျက်အမည်၊ ဇယားအမည်နှင့် ခေါင်းစီးများထဲရှိ ယူနစ်များဖြင့် ပုံနှိပ်သည်။ အတန်းများသည် သင်စီထားသည့် အစီအစဉ်အတိုင်း ပုံနှိပ်ပါလိမ့်မည်။';

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
$ec_lang['lpn_menu_project']='ရေ';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='ရေကွန်ရက် မော်ဒယ်ပြုလုပ်ခြင်းနှင့် ပတ်သက်သည့် အရာအားလုံးသည် ဤတစ်နေရာတည်းတွင် ရှိသည်၊ လှုပ်ရှားပြသမှု ထိန်းချုပ်ခလုတ်များမှလွဲ၍။ မည်သည့်အရာက မည်သည့်နေရာတွင် ရှိသည်ကို မှန်းဆစရာ မလိုပါ။';
$ec_lang['lpn_tables_menu']='ဇယားများ';
$ec_lang['lpn_tables_menu_tip']='ဤကွန်ရက်ရှိ အစိတ်အပိုင်းများ၏ ဇယားကို မြေပုံအောက်ရှိ ဘောင်ထဲတွင် ဖွင့်သည်။ အစိတ်အပိုင်း အမျိုးအစားတစ်ခုစီအတွက် ဇယားတစ်ခုစီ ရှိပြီး၊ ထိုနေရာတွင် စီပြီး တည်းဖြတ်နိုင်သည်။';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='ဤကွန်ရက်ကို ယခု ပြန်တွက်ချက်ပါ။ Run ခလုတ်ကို ရှာနေပါသလား? အလိုအလျောက် ပြန်တွက်ချက်ရန် ဆက်တင် ဖွင့်ထားစဉ် ၎င်းကို ဖျောက်ထားသည်။ ခလုတ်ကို ပြန်ရရှိရန်၊ ဆက်တင်များ၊ တွက်ချက်မှု၊ ဟိုက်ဒရောလစ် တွင် အလိုအလျောက် ပြန်တွက်ချက်ရန် ကို ပိတ်ပါ။';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='အလိုအလျောက် ပြန်တွက်ချက်ရန်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='ဤအရာ ဖွင့်ထားစဉ်၊ ဤပရောဂျက်သည် သင်ပြုလုပ်တိုင်း ပြောင်းလဲမှု တစ်ခုစီနောက်တွင် ခဏအတွင်း ပြန်တွက်ချက်ပြီး၊ Calculate ခလုတ်ကို လုပ်စရာ မကျန်တော့သဖြင့် တူးလ်ဘားမှ ဖယ်ရှားလိုက်သည်။ ကွန်ရက်ကြီးတစ်ခုတွင် ပြောင်းလဲမှုတိုင်းကို ပြန်တွက်ချက်နေချိန် ရိုက်ထည့်ရာတွင် အနှောင့်အယှက်ဖြစ်ပါက ၎င်းကို ပိတ်လိုက်ပါ၊ ထို့နောက် Calculate ခလုတ် ပြန်ပေါ်လာပြီး ၎င်းကိုသာ ရွေးချယ်၍ လည်ပတ်နိုင်သည်။';
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
$ec_lang['lpn_time_run_slow']='ဤကွန်ရက်ကို တွက်ချက်ရန် {secs} စက္ကန့် ကြာခဲ့ပြီး၊ ပြောင်းလဲမှုတိုင်းနောက်တွင် ပြန်တွက်ချက်ရန် သတ်မှတ်ထားသည်။ ၎င်းကို ရပ်တန့်ပြီး Calculate ခလုတ် ပြန်ရရန်၊ ဆက်တင်များ ထဲ၊ တွက်ချက်မှု၊ ဟိုက်ဒရောလစ် အောက်ရှိ “အလိုအလျောက် ပြန်တွက်ချက်ရန်” ကို ပိတ်ပါ။';
$ec_lang['lpn_time_no_report']='လည်ပတ်မှု အစီရင်ခံစာ မရှိသေးပါ။ ဤအစီရင်ခံစာသည် EPANET ၏ ကိုယ်ပိုင်စာသားဖြစ်သောကြောင့်၊ ဤကွန်ရက်ကို EPANET ဖြေရှင်းစက်ဖြင့် တွက်ချက်ပြီးမှသာ ပေါ်လာမည်။';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='အကူအညီ';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='မျက်နှာပြင်ဓာတ်ပုံများ';
$ec_lang['lpn_help_walkthroughs']='လမ်းညွှန်များ';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='ကွန်ရက် ဖျက်ရန်';
$ec_lang['lpn_confirm_delete_network']='ဤပရောဂျက်ရှိ နေရာ၊ ပိုက်လိုင်းနှင့် စာသားလေဘယ်လ်အားလုံးကို ဖျက်မလား။ နောက်ခံပုံ၊ ပရောဂျက်အမည်နှင့် သင်၏ဆက်တင်များကို ဆက်ထားပေးမည်။ ဤလုပ်ဆောင်ချက်ကို နောက်ပြန်ဖျက်၍မရပါ။';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='ရှာဖွေရန်နှင့် အစားထိုးရန်';
$ec_lang['lpn_find_title']='ရှာဖွေရန်နှင့် အစားထိုးရန်';
$ec_lang['lpn_find_scope']='မည်သည်ကို ရှာမည်';
$ec_lang['lpn_find_scope_all']='အားလုံး';
$ec_lang['lpn_find_property']='ဂုဏ်သတ္တိ';
$ec_lang['lpn_find_condition']='စည်းကမ်းချက်';
$ec_lang['lpn_find_value']='တန်ဖိုး';
$ec_lang['lpn_find_btn']='ရှာဖွေရန်';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='လက်ရှိဇယားတွင် စစ်ထုတ်ရန်';
$ec_lang['lpn_find_filter_tip']='မြေပုံအောက်ရှိ ဇယားများထဲမှ တစ်ခုတွင် ဤရှာဖွေမှုနှင့် ကိုက်ညီသော အစိတ်အပိုင်းများကိုသာ ပြပါ။ ပုံဆွဲထားသည် မပြောင်းလဲပါ၊ မည်သည့်အရာမျှ ဖျက်ပစ်ခြင်း မရှိပါ။';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {all} အနက် {n}';
$ec_lang['lpn_find_filter_summary']='{q} ဖြင့် စစ်ထုတ်ထားသည်။ {rows}။';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='ဤရှာဖွေချက်သည် မည်သည့်ဇယားနှင့်မျှ သက်ဆိုင်မှု မရှိပါ။';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='ပါဝင်သည်';
$ec_lang['lpn_find_op_equals']='နှင့်ညီသည်';
$ec_lang['lpn_find_op_gt']='ထက်ကြီးသည်';
$ec_lang['lpn_find_op_lt']='ထက်နည်းသည်';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='ဗလာဖြစ်သည်';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} ခု တွေ့ရှိသည်။ တစ်ခုသို့ သွားရန် နှိပ်ပါ။';
$ec_lang['lpn_find_shift_hint']='ရွေးထားစုတွင် မပါလျှင် ထည့်ရန်၊ ပါပြီးသားဖြစ်လျှင် ဖယ်ရှားရန် အသွင်ပြောင်းရန် Shift+click နှိပ်ပါ။';
$ec_lang['lpn_find_none']='မည်သည့်အရာမျှ မကိုက်ညီပါ။';
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
$ec_lang['lpn_find_op_top']='အမြင့်ဆုံး {n}';
$ec_lang['lpn_find_op_bottom']='အနိမ့်ဆုံး {n}';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='ရှာလိုသည်ကို ရိုက်ထည့်ပါ။';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='ဆက်စပ်မှု';
$ec_lang['lpn_find_prop_demand_desc']='ဤလိုအင် အမျိုးအစား၏ ဖော်ပြချက်';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='နေရာတွင် ဆက်သွယ်မှု မရှိ';
$ec_lang['lpn_find_op_conn_noopen']='နေရာတွင် ဖွင့်ထားသော ဆက်သွယ်မှု မရှိ';
$ec_lang['lpn_find_op_conn_nolinksource']='ရင်းမြစ်သို့ ဆက်သွယ်မှု လမ်းကြောင်း မရှိ';
$ec_lang['lpn_find_op_conn_noopensource']='ရင်းမြစ်သို့ ဖွင့်ထားသော လမ်းကြောင်း မရှိ';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='နေရာတိုင်း ဆက်သွယ်ထားသည်။';
$ec_lang['lpn_find_conn_no_fixed']='ဤကွန်ရက်တွင် ရေကန် (သို့) ရေတိုက် မရှိသောကြောင့်၊ ရောက်ရန် ရင်းမြစ် မရှိပါ။ “နေရာတွင် ဆက်သွယ်မှု မရှိ” နှင့် “နေရာတွင် ဖွင့်ထားသော ဆက်သွယ်မှု မရှိ” ကိုသာ ရှာနိုင်သည်။';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='ထိုရှာဖွေမှုအတိုင်းကို စာကြောင်းတစ်ကြောင်းဖြင့် ရေးထားခြင်း ဖြစ်သည်။ ထိန်းချုပ်ကိရိယာများကို ပြောင်းလိုက်ပါက ဤစာကြောင်းကို ပြန်ရေးပေးပြီး၊ ဤစာကြောင်းတွင် ရိုက်ထည့်လိုက်ပါက ထိန်းချုပ်ကိရိယာများကို အပ်ဒိတ်လုပ်ပေးသည်။';
$ec_lang['lpn_find_query_label']='ရှာဖွေချက်';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='အခြေအနေများကို “နှင့်”၊ “သို့မဟုတ်” နှင့် () တို့ဖြင့် ပေါင်းစပ်ပါ';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='နှင့်';
$ec_lang['lpn_find_q_or']='သို့မဟုတ်';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='ထိန်းချုပ်ကိရိယာများသည် အောက်ပါ ရှာဖွေချက်ကို ဖော်ပြ၍မရသောကြောင့်၊ ၎င်းတို့ကို ဖျောက်ထားသည်။';
$ec_lang['lpn_find_q_restore']='ထိန်းချုပ်ကိရိယာများကို အစား အသုံးပြုပါ';
$ec_lang['lpn_replace_q_bad']='ဤရှာဖွေချက်ကို နားလည်၍မရသောကြောင့်၊ မည်သည့်အရာမျှ ပြောင်းလို့ မရပါ။ အပေါ်တွင် အရင် ပြင်ပါ။';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(အက္ခရာ {n} တွင်)';
$ec_lang['lpn_find_q_err_empty']='ရှာဖွေချက် ဗလာဖြစ်နေသောကြောင့်၊ မည်သည့်အရာမျှ ရှာဖွေမည် မဟုတ်ပါ။';
$ec_lang['lpn_find_q_err_scope']='{w} ဟု ခေါ်သော ရှာဖွေရန် မည်သည့်အရာမျှ မရှိပါ။ အောက်ပါများထဲမှ တစ်ခုကို စမ်းကြည့်ပါ - {list}';
$ec_lang['lpn_find_q_err_dot']='ရှာဖွေမည့်အရာနှင့် ၎င်း၏ဂုဏ်သတ္တိကြား အစက်တစ်ခု ထားပါ၊ Junction.ID ကဲ့သို့။';
$ec_lang['lpn_find_q_err_prop']='{scope} ၏ ဂုဏ်သတ္တိ မဟုတ်ပါ - {w}။ အောက်ပါများထဲမှ တစ်ခုကို စမ်းကြည့်ပါ - {list}';
$ec_lang['lpn_find_q_err_op']='{prop} အတွက် အခြေအနေ မဟုတ်ပါ - {w}။ အောက်ပါများထဲမှ တစ်ခုကို စမ်းကြည့်ပါ - {list}';
$ec_lang['lpn_find_q_err_value']='ဤအခြေအနေသည် ၎င်းနောက်တွင် တန်ဖိုးတစ်ခု လိုအပ်သည် - {op}';
$ec_lang['lpn_find_q_err_quote']='စာသားတန်ဖိုးကို ကိုးကားပုဒ်ဖြင့် ခြံရံပါ - {w} သည် ဂဏန်း မဟုတ်ပါ။';
$ec_lang['lpn_find_q_err_quote_end']='ဤကိုးကားထားသော စာသားတွင် ပိတ်ကိုးကားပုဒ် မရှိပါ။';
$ec_lang['lpn_find_q_err_close']='ဤကွင်းဆင်း ( သည် ဖွင့်ထားပြီး တစ်ခါမျှ မပိတ်ခဲ့ပါ။';
$ec_lang['lpn_find_q_err_open']='ဤကွင်းဆင်း ) သည် မည်သည့်အရာကိုမျှ မပိတ်ပါ။';
$ec_lang['lpn_find_q_err_end']='ဤနောက်တွင် မည်သည့်အရာမျှ မမျှော်လင့်ထားပါ။ ရှာဖွေမှုနှစ်ခုကို {and} (သို့) {or} ဖြင့် ဆက်စပ်ပါ။';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='တွေ့ရှိသည့်အရာကို ပြောင်းရန်';
$ec_lang['lpn_replace_prop']='ပြောင်းမည့် ဂုဏ်သတ္တိ';
$ec_lang['lpn_replace_value']='တန်ဖိုးအသစ်';
$ec_lang['lpn_replace_source']='တန်ဖိုးအသစ် ရင်းမြစ်';
$ec_lang['lpn_replace_asked']='ဆက်စပ်နေရာ {n} ခုအတွက် ရေအမြင့်များ တောင်းဆိုလိုက်ပါပြီ။ အဖြေများ လာနေပါပြီ။';
$ec_lang['lpn_replace_btn']='အစားထိုးရန်';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='အစိတ်အပိုင်း {n} ခုကို ပြောင်းမလား။';
$ec_lang['lpn_replace_apply']='၎င်းတို့ကို ပြောင်းရန်';
$ec_lang['lpn_replace_done']='အစိတ်အပိုင်း {n} ခု ပြောင်းပြီးပါပြီ။ ၎င်းကို တစ်ဆင့်တည်းဖြင့် နောက်ပြန်ဆွဲနိုင်သည်။';
$ec_lang['lpn_replace_none']='မည်သည့်အရာမျှ ပြောင်းလဲမည် မဟုတ်ပါ။';
$ec_lang['lpn_replace_no_value']='တန်ဖိုးအသစ်ကို ရိုက်ထည့်ပါ။';
$ec_lang['lpn_replace_scope']='တန်ဖိုးများ ပြောင်းရန် အထက်တွင် အစိတ်အပိုင်း အမျိုးအစားတစ်ခုကို ရွေးချယ်ပါ။';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='ပရိုဖိုင်း';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_tip']='ကွန်ရက်ကို ဖြတ်သန်းသော လမ်းကြောင်းတစ်လျှောက် မြေပြင်နှင့် ဟိုက်ဒရောလစ် အဆင့်မျဉ်းကို ဆွဲသည်။';
$ec_lang['lpn_profile_title']='လမ်းကြောင်းတစ်လျှောက် Profile';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='လမ်းကြောင်းစတင်ရာ ဆက်စပ်နေရာကို နှိပ်ပါ။';
$ec_lang['lpn_profile_draw_more']='လမ်းကြောင်းကို ကြည့်ရန် မြေပုံပေါ်တွင် ရွှေ့ပါ။ ထည့်ရန် ဆက်စပ်နေရာတစ်ခုကို နှိပ်ပါ။ ပြီးဆုံးရန် နှစ်ချက်နှိပ်ပါ။ Esc သည် ပယ်ဖျက်သည်။';
$ec_lang['lpn_profile_draw_blocked']='{a} မှ {b} သို့ လမ်းကြောင်း မရှိပါ။ အခြား ဆက်စပ်နေရာကို ရွေးချယ်ပါ။';
$ec_lang['lpn_profile_tap_start']='လမ်းကြောင်းစတင်ရာ ဆက်စပ်နေရာကို တို့ပါ။';
$ec_lang['lpn_profile_tap_more']='လမ်းကြောင်းကို ကြည့်ရန် ဆက်စပ်နေရာတစ်ခုကို တို့ပါ။ ထည့်ရန် ဖိထားပါ။ ပြီးဆုံးရန် နှစ်ချက်တို့ပါ။ ပယ်ဖျက်ရန် Profile ကို ထပ်နှိပ်ပါ။';
$ec_lang['lpn_profile_say_idle']='မြေပုံပေါ်တွင် လမ်းကြောင်းအသစ်ကို ရွေးချယ်ရန် Profile ကို ထပ်နှိပ်ပါ။';
$ec_lang['lpn_profile_none']='လမ်းကြောင်း မရှိသေးပါ။ မြေပုံပေါ်တွင် တစ်ခု ရွေးချယ်ရန် Profile ကို ထပ်နှိပ်ပါ။';
$ec_lang['lpn_profile_choose']='အစနေရာနှင့် အဆုံးနေရာကို ရွေးပါ။';
$ec_lang['lpn_profile_no_path']='ဤနေရာနှစ်ခုသည် မည်သည့်လမ်းကြောင်းဖြင့်မျှ မချိတ်ဆက်ထားပါ။';
$ec_lang['lpn_profile_no_solve']='ရလဒ် မရှိသေးသောကြောင့် မြေကြောင်းကိုသာ ဆွဲပြထားသည်။';
$ec_lang['lpn_profile_summary']='နေရာ - {n}၊ အရှည် - {len} {u}';
$ec_lang['lpn_profile_axis_station']='လမ်းကြောင်းတစ်လျှောက် အကွာအဝေး ({u})';
$ec_lang['lpn_profile_axis_elev']='အမြင့်နှင့် ဖိမြင့်ဆင့် ({u})';
$ec_lang['lpn_profile_ground']='မြေမျက်နှာပြင်';
$ec_lang['lpn_profile_hgl']='ဖိမြင့်ဆင့် မျဉ်း (HGL)';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='ပြင်ဆင်ရန်';
$ec_lang['lpn_profile_edit_tip']='လမ်းကြောင်းတစ်ဖက်ကို ပြောင်းလဲပါ၊ (သို့) ၎င်းမှ ဆက်စပ်နေရာတစ်ခုကို ဖယ်ရှားပါ၊ လမ်းကြောင်းတစ်ခုလုံးကို ပြန်ဆွဲစရာ မလိုပါ။';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='လမ်းကြောင်းပေါ်ရှိ အမှတ်တစ်ခုခုကို ရွှေ့ရန် ဆွဲပါ။ သင်ထည့်ခဲ့သော အမှတ်တစ်ခုကို ဖယ်ရှားရန် နှိပ်ပါ။';
$ec_lang['lpn_profile_edit_tap']='လမ်းကြောင်းပေါ်ရှိ အမှတ်တစ်ခုခုကို ရွှေ့ရန် ဆွဲပါ။ သင်ထည့်ခဲ့သော အမှတ်တစ်ခုကို ဖယ်ရှားရန် တို့ပါ။';
$ec_lang['lpn_profile_edit_nowhere']='လမ်းကြောင်းပေါ်ရှိ အမှတ်တစ်ခုသည် ဆက်စပ်နေရာ ဖြစ်ရမည်။ လမ်းကြောင်း မပြောင်းလဲပါ။';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='သိမ်းဆည်းထားသော လမ်းကြောင်းများ';
$ec_lang['lpn_profile_new']='လမ်းကြောင်းအသစ် သိမ်းရန်…';
$ec_lang['lpn_profile_new_name']='လမ်းကြောင်း {n}';
$ec_lang['lpn_profile_rename']='လမ်းကြောင်း အမည်ပြောင်းရန်…';
$ec_lang['lpn_profile_delete']='လမ်းကြောင်း ဖျက်ရန်';
$ec_lang['lpn_profile_prompt_name']='ဤလမ်းကြောင်းအတွက် အမည်';
$ec_lang['lpn_profile_delete_confirm']='သိမ်းဆည်းထားသော လမ်းကြောင်း {name} ကို ဖျက်မလား? ပုံဆွဲချက်ကိုယ်တိုင် မပြောင်းလဲပါ။';
$ec_lang['lpn_profile_none_saved']='သိမ်းဆည်းထားသော လမ်းကြောင်း မရှိသေးပါ';
$ec_lang['lpn_profile_missing']='သိမ်းဆည်းထားသော လမ်းကြောင်း {name} သည် ဤပရောဂျက်တွင် မရှိသော ဆက်စပ်နေရာများကို အသုံးပြုသည် - {ids}';
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
$ec_lang['lpn_ts_menu']='အချိန်စီးရီး';
$ec_lang['lpn_ts_tip']='အချိန်ကာလ အတုယူတွက်ချက်မှု တစ်လျှောက် အစိတ်အပိုင်း တစ်ခု (သို့) တစ်ခုထက်ပို၍ကို အချိန်ပေါ်အခြေခံ၍ ဂရပ်ဆွဲရန်။';
$ec_lang['lpn_ts_title']='အချိန်ပေါ် တန်ဖိုးများ';
$ec_lang['lpn_ts_group_tip']='ဂရပ်သည် အမှတ်များကို ပြမည်လား (သို့) မျဉ်းများကို ပြမည်လား။';
$ec_lang['lpn_ts_group_nodes']='အမှတ်များ';
$ec_lang['lpn_ts_group_links']='မျဉ်းများ';
$ec_lang['lpn_ts_quantity_tip']='အချိန်ပေါ် မည်သည့်တန်ဖိုးကို ဂရပ်ဆွဲမည်နည်း။';
$ec_lang['lpn_ts_add']='ရွေးထားသည်များကို ထည့်ရန်';
$ec_lang['lpn_ts_add_tip']='မြေပုံပေါ်တွင် ယခုရွေးချယ်ထားသည့် အရာအားလုံးကို ဂရပ်ပေါ်တင်ရန်။';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='ထိုအမျိုးအစား တစ်ခုမျှ မြေပုံပေါ်တွင် ရွေးချယ်မထားပါ။';
$ec_lang['lpn_ts_clear']='အားလုံး ဖယ်ရှားရန်';
$ec_lang['lpn_ts_chip_tip']='{id} ကို ဂရပ်မှ ဖယ်ရှားရန်';
$ec_lang['lpn_ts_none']='ဂရပ်ဆွဲရန် မည်သည့်အရာမျှ မရှိသေးပါ။ မြေပုံပေါ်တွင် အစိတ်အပိုင်းများကို ရွေးချယ်ပြီး ရွေးထားသည်များကို ထည့်ရန် ကို နှိပ်ပါ။';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='အချိန်ကာလ အတုယူတွက်ချက်မှု အဖြေများ မရှိသေးပါ။ ပုံဖော်တွက်ချက်မှုကို လည်ပတ်ရန် တွက်ချက်ရန် ကို နှိပ်ပါ။';
$ec_lang['lpn_ts_summary']='အစိတ်အပိုင်းများ - {n}၊ အစီရင်ခံ အချိန်များ - {steps}';
$ec_lang['lpn_ts_axis_time']='ကုန်ဆုံးအချိန်';
$ec_lang['lpn_freq_menu']='ကြိမ်နှုန်း';
$ec_lang['lpn_freq_tip']='ဆက်စပ်နေရာအားလုံး (သို့) ပိုက်လိုင်းအားလုံး၏ ဂုဏ်သတ္တိတစ်ခု၏ ကြိမ်နှုန်းဖြန့်ဝေမှုကို လက်ရှိအချိန်အဆင့်တွင် ဂရပ်ဆွဲရန်။';
$ec_lang['lpn_freq_title']='တန်ဖိုးများ ဖြန့်ဝေမှု';
$ec_lang['lpn_freq_group_tip']='ဂရပ်သည် ဆက်စပ်နေရာများကို ပြမည်လား (သို့) ပိုက်လိုင်းများကို ပြမည်လား။';
$ec_lang['lpn_freq_quantity_tip']='မည်သည့်တန်ဖိုးကို ဂရပ်ဆွဲမည်နည်း။';
$ec_lang['lpn_freq_none']='ဤတန်ဖိုးအတွက် အဖြေများ မရှိသေးသောကြောင့်၊ ဂရပ်ဆွဲစရာ မရှိပါ။';
$ec_lang['lpn_freq_summary']='ဂရပ်ဆွဲထားသည် - {total} အနက် {n}';
$ec_lang['lpn_freq_summary_time']='ဂရပ်ဆွဲထားသည် - {total} အနက် {n}၊ {time} တွင်';
$ec_lang['lpn_freq_axis_percent']='ထက်နည်းသော ရာခိုင်နှုန်း';
$ec_lang['lpn_view_units']='ယူနစ်များ';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='အားလုံးကို သိမ်းရန်';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='ပရောဂျက်{n}';
$ec_lang['lpn_project_copy_suffix']='(မိတ္တူ)';
$ec_lang['lpn_project_rename']='အမည်ပြောင်းရန်';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='ပရောဂျက်အသစ်…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='ပရောဂျက်အသစ်';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='ကိုဩဒိနိတ် စနစ်';
$ec_lang['lpn_new_coordsys_tip']='သင့်ကွန်ရက်၏ ကိုဩဒိနိတ် စနစ်ကို ရွေးချယ်ပါ။ ဤအရာသည် အမြဲတမ်း ဖြစ်သည်; ကွန်ရက်တစ်ခုကို ကိုဩဒိနိတ်အသစ်သို့ ပြောင်းနိုင်သော တစ်ခုတည်းသောနည်းမှာ “ဖိုင်၊ ကိုဩဒိနိတ်အသစ်ဖြင့် ဖွင့်ရန်” ဖြစ်ပြီး ခန့်မှန်းသာ ဖြစ်သည်။';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='ဒေသဆိုင်ရာ၊ ပုံစံဇယား သို့မဟုတ် စိတ်ကြိုက်';
$ec_lang['lpn_new_coordsys_local_tip']='ပထဝီရည်ညွှန်း မပြုလုပ်ထားပါ။ သင့်ကိုယ်ပိုင် နောက်ခံပုံကို တွဲထည့်ပါ (သို့) မထည့်ပါနှင့်။';
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
$ec_lang['lpn_crs_view']='မြေပုံမြင်ကွင်းဖြင့် စစ်ထုတ်ရန်';
$ec_lang['lpn_crs_view_tip']='မြေပုံကြည့်နေသော နေရာကို လွှမ်းခြုံသော ပရောဂျက်ရှင်များကိုသာ ပေးသည်။ စာရင်းအပြည့်ကို ဖတ်ရန် ၎င်းကို ပိတ်ပါ။';
$ec_lang['lpn_crs_place']='နေရာအမည် ရှာဖွေရန်';
$ec_lang['lpn_crs_place_tip']='မြို့၊ လိပ်စာ (သို့) မှတ်ဆိတ်တစ်ခုကို ရိုက်ထည့်ပါက၊ မြေပုံ မြင်ကွင်းသည် ထိုနေရာသို့ ရွေ့သွားမည်။ သင်ရိုက်ထည့်သော စကားလုံးများသည် OpenStreetMap ၏ နေရာအမည် ဝန်ဆောင်မှုသို့ သွားပြီး၊ ၎င်းက ပထမဆုံးအကြိမ်တွင် သင့်ခွင့်ပြုချက်ကို မေးမည်။ ပထဝီရေးရာ ပရောဂျက်အသစ်တစ်ခုသည် ဤနေရာတွင် ရှာတွေ့သော နေရာမှာပင် စတင်မည်။';
$ec_lang['lpn_crs_search']='ရှာဖွေရန်';
$ec_lang['lpn_crs_name']='ပရောဂျက်ရှင် အမည် စစ်ထုတ်ရန်';
$ec_lang['lpn_crs_name_tip']='သင်ရိုက်ထည့်သော စာသားပါဝင်သော အမည် (သို့) EPSG ကုဒ်ရှိသည့် ပရောဂျက်ရှင်များကိုသာ ပြသည်။ ဇုန်နံပါတ်၊ (သို့) UTM၊ (သို့) Mercator ကို စမ်းကြည့်ပါ။';
$ec_lang['lpn_crs_list_tip']='အထက်ပါ စစ်ထုတ်မှု နှစ်ခုက ကျန်ခဲ့သော ပရောဂျက်ရှင်များ။ တစ်ခုကို ရွေးပြီး ရွေးချယ်ရန် ကို နှိပ်ပါ။';
$ec_lang['lpn_crs_choose']='ရွေးချယ်ရန်';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='နေရာတစ်ခုမျှ ရှာဖွေထားခြင်း မရှိသေးသောကြောင့်၊ စာရင်းအပြည့်ကို ပေးထားသည်။ အထက်တွင် နေရာတစ်ခု ရှာဖွေပါ (သို့) စာရင်းကို ကျဉ်းစေရန် မြေပုံကို ဇူးမ်ချဲ့ပါ။';
$ec_lang['lpn_crs_count']='{total} အနက် {n} ပရောဂျက်ရှင်ကို စာရင်းပြုထားသည်။';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='ကိုဩဒိနိတ် စနစ် {total} အနက် {n} ခုသည် ဤကွန်ရက်ကို လွှမ်းခြုံသည်။';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(မြေပုံ မရှိ)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} သည် အသုံးပြုနိုင်သော ပရိုဂျက်ရှင် အချက်အလက် မပါသော စာရင်းပါ ကိုဩဒိနိတ် စနစ် အနည်းငယ်အနက် တစ်ခု ဖြစ်သည်။ ဆိုလိုသည်မှာ ကမ္ဘာ့မြေပုံ၊ နေရာအမည် ရှာဖွေခြင်းနှင့် DEM အမြင့်များ အလုပ်မလုပ်ပါ။ သင့် ကိုဩဒိနိတ်များကို မထိခိုက်ပါ။';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='အမည်မဲ့';
$ec_lang['lpn_crs_none']='ပထဝီရည်ညွှန်း မပြုလုပ်ထားပါ';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='ပရောဂျက်တစ်ခုသည် ၎င်းကိုယ်ပိုင် ယူနစ်များကို ကိုင်ဆောင်ထားသောကြောင့်၊ ဤရွေးချယ်မှုသည် ဤပရောဂျက်တစ်ခုတည်း၏ ပိုင်ဆိုင်မှုသာ ဖြစ်ပြီး၊ ဤနေရာရှိ မည်သည့်အရာမျှ ဘရောက်ဇာ ဆက်တင်တစ်ခုအဖြစ် မသိမ်းဆည်းပါ။ ပရောဂျက်အသစ်များကို ပုံစံတစ်ခုအတိုင်း ဖန်တီးလိုပါက၊ ဗလာပရောဂျက်တစ်ခုကို သင့်ပုံစံအဖြစ် သိမ်းထားပြီး၊ အကြိမ်တိုင်း ၎င်း၏ မိတ္တူတစ်စောင် ပြုလုပ်ပါ။';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='မန္တလေး၊ မြန်မာ';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='ဖန်တီးရန်';
$ec_lang['lpn_file_open']='ဖွင့်ရန်…';
$ec_lang['lpn_file_save']='သိမ်းရန်';
$ec_lang['lpn_file_saveas']='တခြားအမည်ဖြင့် သိမ်းရန်…';
$ec_lang['lpn_file_revert']='မူရင်းပြန်ယူရန်';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='လတ်တလော ဖွင့်ခဲ့သော ဖိုင်များ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='{file} ကို သင့်ကွန်ပျူတာတွင် ပြန်ရှာစရာမလိုဘဲ ထပ်ဖွင့်ရန်။';
$ec_lang['lpn_recent_denied']='ထိုဖိုင်ကိုဖွင့်ရန် ခွင့်ပြုချက်မရခဲ့သောကြောင့် မဖွင့်နိုင်ခဲ့ပါ။';
$ec_lang['lpn_recent_gone']='{file} ကို ဖွင့်၍မရပါ။ ၎င်းကို နေရာရွှေ့ထား၊ အမည်ပြောင်းထား သို့မဟုတ် ဖျက်ထားနိုင်သောကြောင့်၊ လတ်တလောစာရင်းမှ ဖယ်ရှားလိုက်ပါသည်။';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='ပရောဂျက်အသစ်';
$ec_lang['lpn_tab_all']='ပရောဂျက်အားလုံး';
$ec_lang['lpn_tab_menu']='ပရောဂျက် မီနူး';
$ec_lang['lpn_tab_duplicate']='ပွားယူရန်';
$ec_lang['lpn_tab_move_left']='ဘယ်ဘက်ရွှေ့ရန်';
$ec_lang['lpn_tab_move_right']='ညာဘက်ရွှေ့ရန်';
$ec_lang['lpn_tab_unsaved']='ဖိုင်တစ်ခုအဖြစ် မသိမ်းဆည်းရသေးပါ';
$ec_lang['lpn_import_bad_file']='ထိုဖိုင်ကို ဤစာမျက်နှာမှ သိမ်းဆည်းထားသော ပရောဂျက်တစ်ခုအဖြစ် ဖတ်၍မရပါ။';
$ec_lang['lpn_import_no_room']='ဤပရောဂျက်ကို ထည့်ရန် ဘရောက်ဇာသိုလှောင်ခန်း လုံလောက်စွာ ကျန်မရှိတော့ပါ။ မလိုအပ်တော့သော ပရောဂျက်တစ်ခုကို ဖျက်ပြီး ထပ်ကြိုးစားပါ။';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='အိုကေ';
$ec_lang['lpn_file_import_inp']='EPANET ဖိုင် တင်သွင်းရန်…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='EPANET ဖိုင်တစ်ခု - .inp စာသားဖိုင် (သို့) EPANET သိမ်းဆည်းသော .net ဖိုင် တစ်ခုခုမှ ကွန်ရက်တစ်ခုကို ဖတ်ယူပြီး၊ ဤဘရောက်ဇာထဲတွင် ပရောဂျက်အသစ်တစ်ခုအဖြစ် သိမ်းဆည်းသည်။';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='EPANET ဖိုင် ထုတ်ရန်…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='ဤကွန်ရက်ကို EPANET .inp ဖိုင်အဖြစ် ရေးပြီး ဒေါင်းလုဒ်ဆွဲပါ။ သင်ရိုက်ထည့်ခဲ့သော ဂဏန်းများကို ရိုက်ထည့်ခဲ့သည့်အတိုင်း အတိအကျ ရေးမည်။ .inp ဖော်မတ်က မသိမ်းနိုင်သည့် အရာများကို နောက်ပိုင်းတွင် စာရင်းပြုစုပေးမည်။';
$ec_lang['lpn_status_inp_exported']='{file} ကို ထုတ်ပြီးပါပြီ။';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='.inp ဖော်မတ်က မသိမ်းနိုင်သည့် အရာ {n} ခု။';
$ec_lang['lpn_inp_export_refused']='ဤပရောဂျက်ကို EPANET ဖိုင်အဖြစ် ရေး၍မရပါ - {detail}';
$ec_lang['lpn_inp_bad_file']='ထိုဖိုင်ကို EPANET ကွန်ရက်ဖိုင်တစ်ခုအဖြစ် ဖတ်၍မရပါ။';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='ဤဖိုင်သည် EPANET .net ဖိုင်နှင့် တူပါသည်၊ သို့သော် ဤစာမျက်နှာက ၎င်းကို ဖတ်၍မရပါ။ EPANET တွင် ၎င်းကိုဖွင့်ပြီး ဖိုင် > တင်ပို့ရန် > ကွန်ရက် ညွှန်ကြားချက်ကို သုံး၍ .inp ဖိုင်တစ်ခုအဖြစ် သိမ်းဆည်းပြီးမှ ထိုဖိုင်ကို တင်သွင်းပါ။';
$ec_lang['lpn_inp_report_heading']='{file} ကို တင်သွင်းပြီးပါပြီ';
$ec_lang['lpn_inp_report_counts']='ဆက်စပ်နေရာ၊ ရေကန်နှင့် ရေတိုက် {nodes} ခု၊ ပိုက်လိုင်း၊ ရေတင်စက်နှင့် ဗားလ် {links} ခု၊ {units} ဖြင့်။';
$ec_lang['lpn_inp_report_clean']='ဖိုင်ထဲရှိ အရာအားလုံး ဝင်ရောက်ခဲ့ပါသည်။ ဘာမျှ ကျန်ခဲ့ခြင်းမရှိပါ။';
$ec_lang['lpn_inp_report_label_anchor']='စာသား အညွှန်းများကို EPANET ချထားသည့်အတိုင်း၊ ၎င်းတို့၏ ဘယ်ဘက်အပေါ်ထောင့်မှစ၍ ချထားပါသည်။';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='EPANET ဖိုင်များတွင် ကိုဩဒိနိတ် စနစ် မပါဝင်ပါ၊ သို့ဖြစ်၍ ဤဖိုင်ကို အစပိုင်းတွင် ပထဝီအညွှန်း မတပ်ထားပါ။ ကမ္ဘာ့မြေပုံပေါ်တွင် ချထားလိုပါက၊ မြေပုံ > ကမ္ဘာ့မြေပုံ… ကို သုံးပါ။ ၎င်း၏ ကိုဩဒိနိတ်များကို ပြောင်းလဲလိုပါက၊ ဖိုင် > ပြောင်းလဲရန်… ကို သုံးပါ။';
$ec_lang['lpn_inp_report_lead']='ဤစာမျက်နှာသည် EPANET လုပ်ဆောင်သမျှကို အသုံးမပြုသော်လည်း၊ သင့်ဖိုင်ထဲရှိ မည်သည့်အရာမျှ ပစ်ပယ်ခြင်း မရှိပါ။ အောက်တွင် သင့်ဖိုင် ကိုင်ဆောင်ထားပြီး ဤစာမျက်နှာက အသုံးမပြုဘဲ ထိန်းသိမ်းထားသောအရာများနှင့် ဖိုင်ကို ဖတ်ယူစဉ် ပြောင်းလဲခဲ့သောအရာများ ဖြစ်သည် -';
$ec_lang['lpn_inp_drop_headloss']='ဤဖိုင်သည် Hazen-Williams ညီမျှခြင်းကို အသုံးမပြုပါ။ ဤစာမျက်နှာက Hazen-Williams ဖြင့် တွက်ချက်သောကြောင့်၊ ပိုက်ကြမ်းတမ်းမှု ဂဏန်းများကို ရေးထားသည့်အတိုင်း တိတိကျကျ ဆက်ထားသော်လည်း၊ ဤနေရာရှိ အဖြေများသည် EPANET ၏ အဖြေများနှင့် မကိုက်ညီပါ။';
$ec_lang['lpn_inp_drop_tank_curve']='ဤရေတိုက်များသည် တည့်မတ်သော နံရံများ မဟုတ်ပါ - ဖိုင်က ၎င်းတို့၏ပုံသဏ္ဌာန်ကို ကွေးမျဉ်းတစ်ခုအဖြစ် ဖော်ပြထားသည်။ ကွေးမျဉ်းကို စာရင်းများ ဘောက်စ်တွင် ဆက်ထိန်းသိမ်းထားပြီး၊ ရေတိုက်သည် ၎င်းကို ဆက်ရည်ညွှန်းနေဆဲဖြစ်ကာ၊ အချိန်ကာလ အတုယူတွက်ချက်မှုတစ်ခုသည် ထိုကွေးမျဉ်း ပေးသည့် အချိန်ဇယားအတိုင်း ရေတိုက်ကို ပြည့်စေ၊ ကုန်စေသည်။ ရေမျက်နှာပြင်သည် ဖိုင်က သတ်မှတ်ထားသော အဆင့် ဖြစ်သောကြောင့်၊ တစ်ချိန်တည်းရှိ အခြေအနေအတွက်မူ နှစ်ခုစလုံး တူညီသည်။ ဖိုင်ထဲတွင် ရေးထားသော အချင်းကို ကွေးမျဉ်းအနီးတွင် ဆက်ထိန်းသိမ်းထားပြီး၊ ကွေးမျဉ်း မရှိသော ရေတိုက်တစ်ခုကို ထိုအချင်းဖြင့် ရေးဆွဲပြီး ဖြေရှင်းသည်။';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='ဤညှစ်ဗားလ်များကို ညှစ်ဗားလ်များအဖြစ်ပင် တင်သွင်းခဲ့ပြီး၊ ဖိုင်ပေးထားသော ဆုံးရှုံးမှုတန်ဖိုးအတိုင်း ဆောင်ကြဉ်းထားသည်။ ဖြေရှင်းစက် နှစ်ခုစလုံးက ၎င်းတို့ကို တွက်ချက်နိုင်သည်။';
$ec_lang['lpn_inp_drop_valve_active']='ဤဗားလ်များသည် ဖိအား (သို့) ရေစီးနှုန်းကို ထိန်းချုပ်ပြီး၊ ရေအခြေအနေ ပြောင်းလဲသည်နှင့်အမျှ ၎င်းတို့ကိုယ်တိုင် ဖွင့်/ပိတ် လုပ်ဆောင်ကြသည်။ တင်သွင်းစဉ်တွင် ၎င်းတို့နှင့်ပတ်သက်သော မည်သည့်အချက်အလက်မျှ ဆုံးရှုံးမသွားခဲ့ပါ၊ ဤစာမျက်နှာက ၎င်းတို့ကို EPANET ဖြေရှင်းစက်ဖြင့် ဖြေရှင်းပေးပြီး၊ ဤကွန်ရက်အတွက် ထိုဖြေရှင်းစက်ကို အလိုအလျောက် ဖွင့်ပေးလိုက်သည်။';
$ec_lang['lpn_inp_drop_valve']='ဤဗားလ်များကို ကွေးမျဉ်းဖြင့် (သို့) တည်ငြိမ်သော ဖိအားကျဆင်းမှုဖြင့် ဖော်ပြထားပြီး၊ ဤစာမျက်နှာတွင် ထိုသို့သော အစိတ်အပိုင်း မရှိပါ။ ၎င်းတို့သည် ဖွင့်ထားသော ပိုက်လိုင်းများအဖြစ် ဝင်ရောက်လာသောကြောင့်၊ ကွန်ရက်သည် ဆက်စပ်နေဆဲ ဖြစ်သော်လည်း၊ ထိုနေရာတွင် ဖိအား (သို့) ရေစီးနှုန်းကို ထိန်းချုပ်သည့်အရာ မရှိတော့ပါ။';
$ec_lang['lpn_inp_drop_cv']='EPANET တွင် ဤပိုက်လိုင်းများသည် ရေကို တစ်ဖက်တည်းသာ ဖြတ်သန်းခွင့်ပြုသည်။ ၎င်းတို့ကို သာမန်ပိုက်လိုင်းများအဖြစ် တင်သွင်းခဲ့သောကြောင့်၊ ယခုအခါ ရေသည် ၎င်းတို့ကို နှစ်ဖက်စလုံးမှ စီးဆင်းနိုင်ပါသည်။';
$ec_lang['lpn_inp_drop_demands']='ဤဆက်စပ်နေရာများတွင် လိုအပ်ချက် တစ်ခုထက်ပို၍ ရှိခဲ့ပါသည်။ လိုအပ်ချက်များကို ဤစာမျက်နှာက ကိုင်ဆောင်သည့် တစ်ခုတည်းသော လိုအပ်ချက်ထဲသို့ ပေါင်းထည့်လိုက်ပါသည်။';
$ec_lang['lpn_inp_drop_patterns']='ဤစာမျက်နှာ၏ အချိန်ကာလ အတုယူတွက်ချက်မှု လုပ်ဆောင်ပေးသည့် အစိတ်အပိုင်းသည် ဖွင့်၍မရသောကြောင့်၊ လိုအပ်ချက် ပုံစံများကို မဖတ်ခဲ့ပါ။ လိုအပ်ချက်တိုင်းသည် ဖိုင်ထဲတွင် ရေးထားသည့်ဂဏန်း ဖြစ်ပါသည်။';
$ec_lang['lpn_inp_drop_demand_pattern']='ဤဆက်စပ်နေရာများသည် run တစ်လျှောက် ၎င်းတို့၏ လိုအပ်ချက်ကို ပြောင်းလဲသည်။ ၎င်းတို့၏ ပုံစံများ အပြည့်အဝ ဝင်လာခဲ့ပြီး၊ သင်မြင်ရသော လိုအပ်ချက်သည် နာရီပြသနေသော အချိန်အတွက်သာ ဖြစ်သည်။';
$ec_lang['lpn_inp_drop_emitters']='ဤဆက်စပ်နေရာများတွင် ရေဖျန်းစက် (သို့) ယိုစိမ့်မှု ကိန်းရှိပါသည်။ ၎င်းကို ဆက်ထားပြီး ဖြေရှင်းလျက်ရှိသော်လည်း၊ ၎င်းကို ကြည့်ရန် (သို့) ပြောင်းလဲရန် ဤစာမျက်နှာတွင် နေရာမရှိသေးပါ။';
$ec_lang['lpn_inp_drop_curve_long']='ဤရေတင်စက် ကွေးမျဉ်းတွင် အမှတ် သုံးခုထက် ပိုရှိခဲ့ပါသည်။ ဤစာမျက်နှာသည် အများဆုံး အမှတ်သုံးခုအထိသာ ကွေးမျဉ်းကို လိုက်လျောညီထွေဖြစ်အောင် ချိန်ညှိသောကြောင့်၊ ၎င်း၏ အနိမ့်ဆုံး၊ အလယ်အလတ်နှင့် အမြင့်ဆုံး အမှတ်များကို ဆက်ထားပါသည်။';
$ec_lang['lpn_inp_drop_curve_missing']='ဤရေတင်စက်သည် ဖိုင်ထဲတွင် မပါသော ကွေးမျဉ်းတစ်ခုကို ရည်ညွှန်းနေသည်။ ကွေးမျဉ်းမပါဘဲ ဝင်လာခဲ့သောကြောင့် ၎င်းသည် ဖိမြင့်ဆင့် မထပ်ပေါင်းပါ။';
$ec_lang['lpn_inp_drop_pump_other']='ဤရေတင်စက်ကို ကွေးမျဉ်းဖြင့် မဟုတ်ဘဲ ၎င်းစားသုံးသည့် စွမ်းအားဖြင့် ဖော်ပြထားသည်။ ကွေးမျဉ်း မပါဘဲ ဝင်ရောက်လာသောကြောင့်၊ ဖိမြင့်ဆင့် မထပ်ပေါင်းပါ။';
$ec_lang['lpn_inp_drop_head_pattern']='ဤရေကန်များသည် run တစ်လျှောက် မြင့်တက်ကျဆင်းနေသည်။ ၎င်းတို့၏ ပုံစံများ အပြည့်အစုံ ဝင်လာပြီး၊ သင်မြင်ရသော ရေအမြင့်သည် နာရီပြသနေသော အခိုက်အတန့်အတွက် ဖြစ်သည်။';
$ec_lang['lpn_inp_drop_pump_speed']='ဤရေတင်စက်များသည် ၎င်းတို့၏ ကွေးမျဉ်း တိုင်းတာစဉ်က မြန်နှုန်း မဟုတ်ဘဲ run လုပ်နေသည်၊ (သို့) run တစ်လျှောက် မြန်နှုန်း ပြောင်းလဲနေသည်။ မြန်နှုန်းနှင့် ၎င်း၏ ပုံစံ အပြည့်အစုံ ဝင်လာပြီး၊ သင်မြင်ရသော ဖိမြင့်ဆင့်သည် နာရီပြသနေသော အခိုက်အတန့်အတွက် ဖြစ်သည်။';
$ec_lang['lpn_inp_drop_setting']='ဤပိုက်လိုင်း၊ ရေတင်စက်နှင့် ဗားလ်များသည် ဤစာမျက်နှာ ကိုင်ဆောင်၍မရသော ဆက်တင်တစ်ခုကို ဆောင်ကြဉ်းထားသည်။ ၎င်းတို့ကို ဖွင့်ထားသည့်အခြေအနေဖြင့် တင်သွင်းခဲ့ပါသည်။';
$ec_lang['lpn_inp_drop_rules']='ဤဖိုင်တွင် စည်းမျဉ်းအခြေခံ ထိန်းချုပ်မှုများ ပါရှိသည်။ ဤစာမျက်နှာက ၎င်းတို့ကို ဖတ်ပြီး အသုံးပြုသည်။ EPANET အင်ဂျင်ဖြင့် မော်ဒယ်ကို run လုပ်ပါက စည်းမျဉ်းများ အသုံးချမည်ဖြစ်ပြီး၊ ၎င်းတို့ရှိ အဆင့်၊ ဖိအားနှင့် ရေစီးနှုန်းတိုင်းကို ဤပရောဂျက် ပြသနေသော ယူနစ်များအတွင်းသို့ ပြောင်းလဲပေးမည်။ စည်းမျဉ်းတစ်ခုကို ဖတ်ရန် (သို့) ပြောင်းရန် စာရင်းများ အောက်ရှိ စည်းမျဉ်းများ ကို ဖွင့်ပါ။ ၎င်းတို့ကို ဖိုင်က ဖော်ပြထားသည့်အတိုင်း အတိအကျ ဆက်ထိန်းသိမ်းထားပြီး၊ EPANET ဖိုင်တစ်ခု သိမ်းလိုက်ပါက ၎င်းတို့ကို ပြန်ရေးပေးမည်။';
$ec_lang['lpn_inp_drop_eps']='ဤဖိုင်သည် အချိန်ကာလ တစ်ခုလုံး အတုယူတွက်ချက်မှု (extended period simulation) ကို ဖော်ပြထားသည်။ ဤစာမျက်နှာ၏ အချိန်ကာလ အတုယူတွက်ချက်မှု လုပ်ဆောင်ပေးသည့် အစိတ်အပိုင်းသည် ဖွင့်၍မရသောကြောင့်၊ အစပိုင်း အခြေအနေများကိုသာ တင်သွင်းခဲ့ပါသည်။';
$ec_lang['lpn_inp_drop_quality']='ဤဖိုင်သည် ရေသည် ခရီးသွားစဉ် ရေအရည်အသွေး မည်သို့ ပြောင်းလဲသည်ကို ဖော်ပြသည် - အစတွင် ရေထဲ၌ မည်သည့်အရာ ပါဝင်သည်၊ ထိုပစ္စည်းသည် ပိုက်များနှင့် ရေတိုက်များအတွင်း မည်မျှမြန်စွာ တုံ့ပြန်သည်။ ဤစာမျက်နှာက ထိုဂဏန်းများကို ဖတ်ပြီး အသုံးပြုသည်။ ဆက်တင်များ၊ တွက်ချက်မှု၊ ရေအရည်အသွေး တွင် ဓာတုပစ္စည်းတစ်ခု ရွေးပြီး၊ EPANET အင်ဂျင်ဖြင့် မော်ဒယ်ကို run လုပ်ပါက၊ run ဆက်လက်လုပ်ဆောင်နေစဉ် ကွန်ရက်တစ်လျှောက် ပါဝင်ပမာဏ (concentration) ကို တွက်ချက်ပေးသည်။ ဤစာကြောင်းများကို ဆက်ထိန်းသိမ်းထားပြီး EPANET ဖိုင်တစ်ခု သိမ်းလိုက်ပါက ၎င်းတို့ကို ပြန်ရေးပေးမည်။';
$ec_lang['lpn_inp_drop_sources_mixing']='ဤဖိုင်က ဓာတုပစ္စည်းတစ်ခုကို ကွန်ရက်ထဲသို့ မည်သည့်နေရာတွင် ထည့်ပေးသည်၊ ရေတိုက်တစ်ခုအတွင်းရှိ ရေက မည်သို့ ရောနှောသည်ကို ဖော်ပြသည်။ ဆေးထည့်ခြင်းသည် ၎င်းကို ထည့်သောနေရာတွင် ပေါ်လာပြီး၊ ရေတိုက်တစ်ခုက မည်သည့် ရောနှောမှု မော်ဒယ်ကို လိုက်နာသည်ကို ဖော်ပြသည်။ ဆေးထည့်ခြင်းနှင့် ရောနှောမှု မော်ဒယ် နှစ်ခုစလုံးကို EPANET အင်ဂျင်ကသာ တွက်ချက်သည်။';
$ec_lang['lpn_inp_drop_energy']='ဤ EPANET ဖိုင်တွင် ရေတင်ကုန်ကျစရိတ် မော်ဒယ်လုပ်ခြင်း ဒေတာများ ပါဝင်သည်။ ဤစာမျက်နှာက ၎င်းကို ဖတ်ပြီး အသုံးပြုသည်။ EPANET အင်ဂျင်ဖြင့် မော်ဒယ်ကို run လုပ်ပြီးနောက်၊ ရေတင်စက်တစ်ခုစီ မည်မျှကြာ run လုပ်ခဲ့သည်၊ မည်မျှ ပါဝါ သုံးခဲ့သည်၊ မည်မျှ စွမ်းအင် သုံးခဲ့သည်၊ ကုန်ကျစရိတ် မည်မျှ ရှိသည်ကို ကြည့်ရန် ရေ၊ အစီရင်ခံစာများ၊ ရေတင်စက် စွမ်းအင် ကို ဖွင့်ပါ။ ဤစာကြောင်းများကို ဆက်ထိန်းသိမ်းထားပြီး EPANET ဖိုင်တစ်ခု သိမ်းလိုက်ပါက ၎င်းတို့ကို ပြန်ရေးပေးမည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='ဤဖိုင်သည် ၎င်း၏ ဆက်စပ်နေရာ၊ ပိုက်လိုင်း (သို့) အခြား အစိတ်အပိုင်း အချို့ကို tag များ ပေးထားသည်။ Tag တိုင်း အပြည့်အစုံ ဝင်လာပြီး၊ တစ်ခုစီသည် ၎င်း၏ ကိုယ်ပိုင် ဂုဏ်သတ္တိများပေါ်တွင် ရှိနေပြီး၊ သင် ၎င်းကို ဖတ်နိုင်သည် (သို့) ပြောင်းနိုင်သည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='ဤဖိုင်တွင် EPANET ကိုယ်တိုင်၏ အစီရင်ခံစာ ပုံနှိပ်ပုံ ဆိုင်ရာ ကိုယ်ပိုင် သတ်မှတ်ချက်များ ပါရှိသည်။ အင်ဂျင်၏ အစီရင်ခံစာကို ဤနေရာ၊ အစီရင်ခံစာများ၊ EPANET run တွင် ဖတ်နိုင်သော်လည်း၊ ၎င်းသည် ဤသတ်မှတ်ချက်များ တောင်းဆိုသည့်ပုံစံအစား အင်ဂျင်၏ စံပုံစံဖြင့် ထွက်လာသည်။ ဤစာကြောင်းများကို ဆက်ထိန်းသိမ်းထားပြီး EPANET ဖိုင်တစ်ခု သိမ်းလိုက်ပါက ၎င်းတို့ကို ပြန်ရေးပေးမည်။';
$ec_lang['lpn_inp_drop_sections']='ဤဖိုင်တွင် ဤစာမျက်နှာက လုံးဝ မဖတ်သော အပိုင်းတစ်ခု ပါရှိသည်။ ဤနေရာတွင် ၎င်းကို အသုံးမပြုပါ။ ၎င်းကို အပြည့်အစုံ ဆက်ထိန်းသိမ်းထားပြီး၊ EPANET ဖိုင်တစ်ခု သိမ်းလိုက်ပါက ၎င်းကို ပြန်ရေးပေးမည်။';
$ec_lang['lpn_inp_drop_quality_options']='ဤဖိုင်သည် EPANET ရေအရည်အသွေး ရွေးချယ်စရာများကို ဖော်ပြသည် - ရေအရည်အသွေး ခွဲခြမ်းစိတ်ဖြာမှု အမျိုးအစားကို အမည်ပေးသော Quality option နှင့်၊ ဓာတုပစ္စည်းတစ်ခုနှင့် ဆက်စပ်နေသော သတ်မှတ်ချက် နှစ်ခုဖြစ်သော Relative diffusivity နှင့် Quality tolerance တို့ ပါဝင်သည်။ သုံးခုစလုံးကို ဆက်ထိန်းသိမ်းထားပြီး၊ သုံးခုစလုံးကို အသုံးပြုသည်။ ရေသက်တမ်း၊ source trace နှင့် ဓာတုပစ္စည်းတစ်ခုကို ဤနေရာတွင် တစ်ခုစီ တွက်ချက်ပေးပြီး၊ ဓာတုပစ္စည်းတစ်ခုကို run လုပ်သောအခါ ဓာတုပစ္စည်း သတ်မှတ်ချက် နှစ်ခုကို EPANET အင်ဂျင်ထံ ပေးအပ်သည်။ EPANET ဖိုင်တစ်ခု သိမ်းလိုက်ပါက ၎င်းတို့ အားလုံးကို ပြန်ရေးပေးမည်။';
$ec_lang['lpn_inp_drop_file_options']='ဤဖိုင်သည် ကူညီဖိုင်တစ်ခုကို ရည်ညွှန်းသည် - ကိုဩဒိနိတ်များ ပါဝင်သော Map (သို့) တွက်ချက်ပြီးသား ဟိုက်ဒရောလစ် ဒေတာ ပါဝင်သော Hydraulics။ ဤစာမျက်နှာက ၎င်းတို့ကို မဖွင့်နိုင်သောကြောင့်၊ စာကြောင်းများကို ရှိသည့်အတိုင်း ဆက်ထိန်းသိမ်းထားပြီး၊ EPANET ဖိုင်တစ်ခု သိမ်းလိုက်ပါက ၎င်းတို့ကို ပြန်ရေးပေးမည်။';
$ec_lang['lpn_inp_drop_demand_model']='ဤဖိုင်သည် ဖိအား-ဦးဆောင် ခွဲခြမ်းစိတ်ဖြာမှု (PDA) တစ်ခုကို တောင်းဆိုသည်၊ ဤနည်းတွင် ဆက်စပ်နေရာတစ်ခုသည် ထိုနေရာ၏ ဖိအားနိမ့်သောအခါ ၎င်း၏ လိုအင်ထက် ပိုနည်းသော ရေရရှိသည်။ ဤစာမျက်နှာက လိုအင်-ဦးဆောင်စနစ်ဖြင့် ဖြေရှင်းပေးသောကြောင့်၊ ဤနေရာရှိ ဆက်စပ်နေရာတိုင်းသည် မည်သည့်ဖိအားရလဒ် ရှိသည်ဖြစ်စေ၊ ဖိုင်တွင် ဖော်ပြထားသော လိုအင်ကို လက်ခံရရှိမည်။ ဤစာကြောင်းကို ဆက်ထိန်းသိမ်းထားပြီး၊ EPANET ဖိုင်တစ်ခု သိမ်းလိုက်ပါက ၎င်းကို ပြန်ရေးပေးမည်။';
$ec_lang['lpn_inp_drop_other_options']='ဤဖိုင်သည် ဤစာမျက်နှာက မဖတ်သော ရွေးချယ်စရာများကို ဖော်ပြသည်။ ဤနေရာတွင် ၎င်းတို့ကို အသုံးမပြုပါ။ ၎င်းတို့ကို ဆက်ထိန်းသိမ်းထားပြီး၊ EPANET ဖိုင်တစ်ခု သိမ်းလိုက်ပါက ၎င်းတို့ကို ပြန်ရေးပေးမည်။';
$ec_lang['lpn_inp_drop_net_options']='ဤ EPANET .net ဖိုင်သည် ဤစာမျက်နှာတွင် ထိန်းချုပ်မှု မရှိသော ဆက်တင်များကို ဖော်ပြထားသောကြောင့်၊ ၎င်းတို့၏ တန်ဖိုးများကို ဆက်ကူးမည့်အစား ဤနေရာတွင် စာရင်းပြုစုထားသည်။ ကျန်အားလုံးကို ဆက်ကူးထားသည်။ ၎င်းတို့ လိုအပ်ပါက EPANET တွင် ဖိုင်ကို ဖွင့်ပြီး File, Export, Network ကို သုံးကာ .inp ဖိုင်တစ်ခုအဖြစ် သိမ်းပြီး၊ ထိုဖိုင်ကို တင်သွင်းပါ။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='ဤဖိုင်သည် EPANET .net ဖိုင်တစ်ခု ဖြစ်ခဲ့သည်။ ၎င်းသည် EPANET ကိုယ်ပိုင် ပရောဂျက်ဖိုင် ဖြစ်ပြီး၊ ထုတ်ပြန်ထားသော ဖော်ပြချက် မရှိသဖြင့်၊ ဤစာမျက်နှာက ဥပမာဖိုင်များမှ ဖော်မတ်ကို ခန့်မှန်းတွက်ချက်၍ ဖတ်ခြင်း ဖြစ်သည်။ ထို့ကြောင့် ယုံကြည်ရသော နည်းလမ်းအဖြစ် မဟုတ်ဘဲ အခြားရွေးချယ်စရာ မရှိသောအခါမှသာ သုံးပါ။ .inp ဖိုင်သည် အခြားပရိုဂရမ်တိုင်း ဖတ်နိုင်သော မှတ်တမ်းတင်ထားသည့် ဖော်မတ် ဖြစ်သည် - EPANET တွင် File, Export, Network ကို သုံးကာ တစ်ခု ရေးပြီး၊ ဖြစ်နိုင်သမျှ ထိုဖိုင်ကို ဤနေရာတွင် တင်သွင်းပါ။';
$ec_lang['lpn_inp_drop_backdrop']='ဤဖိုင်သည် နောက်ခံပုံတစ်ခု၏အမည်ကို ဖော်ပြထားသော်လည်း ပုံကိုယ်တိုင်ကို မပါဝင်ပါ။ ဖိုင် > နောက်ခံပုံ > ပုံထည့်ရန် ကို အသုံးပြု၍ ကိုယ်တိုင်ထည့်ပါ။';
$ec_lang['lpn_inp_drop_dangling']='ဤပိုက်လိုင်းများသည် ဖိုင်ထဲတွင် မပါသော ဆက်စပ်နေရာတစ်ခု၏အမည်ကို ဖော်ပြထားသောကြောင့်၊ ၎င်းတို့ကို ချန်ထားခဲ့ပါသည်။';
$ec_lang['lpn_inp_drop_units']='ဤဖိုင်တွင် အမည်ပေးထားသော ရေစီးနှုန်း ယူနစ်ကို ဤစာမျက်နှာက မသိသောကြောင့်၊ ဂဏန်းတိုင်းကို မိနစ်လျှင် ဂါလံ (gpm) အဖြစ် ဖတ်ခဲ့ပါသည်။ အဖြေများကို အသုံးမပြုမီ ဂဏန်းတိုင်းကို စစ်ဆေးပါ။';
$ec_lang['lpn_inp_drop_anchor_missing']='ဤစာသားသည် ဖိုင်ထဲတွင် မရှိတော့သော ဆက်စပ်နေရာ၊ ရေကန် (သို့) ရေတိုက်တစ်ခုနှင့် တွဲထားခဲ့သည်။ ဖိုင်ကထားခဲ့သည့်နေရာတွင် လွတ်လပ်သော စာသားအဖြစ် ဝင်လာပြီး၊ ယခု မည်သည့်အရာကိုမျှ မလိုက်တော့ပါ။';
$ec_lang['lpn_import_notes_heading']='ဤပရောဂျက်ကို EPANET ဖိုင်တစ်ခုမှ ဖတ်ယူထားသည်။ ထိုဖိုင် ကိုင်ဆောင်ထားသော အချို့အရာများကို ထိန်းသိမ်းထားသော်လည်း ဤစာမျက်နှာတွင် အသုံးမပြုပါ။';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='{name} ကို ဖိုင်တစ်ခုမှ ဖွင့်ပြီး၊ ဤဘရောက်ဇာထဲသို့ ပရောဂျက်အသစ်တစ်ခုအဖြစ် ထည့်သွင်းလိုက်ပါသည်။';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='ပရောဂျက်ဖိုင်';
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
$ec_lang['lpn_file_upload_explain']='ဤဘရောက်ဇာသည် ဖိုင်တစ်ခုနှင့် ချိတ်ဆက်၍မရသောကြောင့်၊ ဤနေရာတွင် ဖိုင်တစ်ခုဖွင့်ခြင်းသည် တင်ပို့ခြင်း (upload) တစ်ခုသာဖြစ်သည် - ပရောဂျက်ကို ဤဘရောက်ဇာထဲသို့ ကူးယူထားပြီး၊ သင့်အလုပ်ကို ဖိုင်ထဲသို့ ပြန်သိမ်းနိုင်သော တစ်ခုတည်းသောနည်းလမ်းမှာ ဖိုင် > တခြားအမည်ဖြင့် သိမ်းရန် ဖြင့် ဖိုင်အား ပြန်ရေးသိမ်းရန်သာ ဖြစ်သည်။';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='ဤစာမျက်နှာမှ သိမ်းဆည်းထားသော ပရောဂျက်ဖိုင်တစ်ခုကို ဖွင့်ပါ။';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='ချိတ်ဆက်ထားသော ဖိုင်ထဲသို့ သိမ်းဆည်းသည်။';
$ec_lang['lpn_file_saveas_tip']='သိမ်းဆည်းရန် ဖိုင်တစ်ခုကို ရွေးချယ်ပါ။ ဤပရောဂျက်သည် ထိုဖိုင်နှင့် ချိတ်ဆက်သွားပြီး၊ ထိုအချိန်မှစ၍ သိမ်းရန် က ထိုဖိုင်ထဲသို့ ရေးသိမ်းပေးပါလိမ့်မည်။';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='သင့်ဘရောက်ဇာ၏ ဒေါင်းလုတ် ဆက်တင်များကို အသုံးပြု၍ သိမ်းဆည်းသည်။ ဤဘရောက်ဇာသည် ဖိုင်တစ်ခုနှင့် ချိတ်ဆက်၍မရသောကြောင့်၊ သိမ်းရန် ကို ပိတ်ထားပြီး တခြားအမည်ဖြင့် သိမ်းရန် ကိုသာ အသုံးပြုနိုင်သည်။ သင့်ဘရောက်ဇာ ဆက်တင် “ဖိုင်တစ်ခုစီကို မည်သည့်နေရာတွင် သိမ်းမည်ကို မေးပါ” ကို ဖွင့်ထားပါက၊ မူရင်းဖိုင်ကို ရွေးချယ်ပြီး ၎င်းအပေါ် ပြန်ရေးသိမ်းနိုင်ပါသည်။';
$ec_lang['lpn_status_uploaded']='ပရောဂျက်ဖိုင်ကို တင်ပို့ပြီးပါပြီ။ ၎င်းနှင့် ဆက်လက်ချိတ်ဆက်၍မရသောကြောင့်၊ ၎င်းထဲသို့ ပြန်သိမ်းနိုင်သော တစ်ခုတည်းသောနည်းလမ်းမှာ ဖိုင် > တခြားအမည်ဖြင့် သိမ်းရန် ကို အသုံးပြုရန်သာ ဖြစ်သည်။';
$ec_lang['lpn_status_downloaded']='{file} ကို ဒေါင်းလုတ်ဆွဲပြီးပါပြီ။ ဤဘရောက်ဇာသည် ဖိုင်တစ်ခုနှင့် ချိတ်ဆက်၍မရသောကြောင့်၊ ဤပရောဂျက်ကို ဖိုင်တစ်ခုသို့ မသိမ်းရသေးဟု ဆက်လက် အမှတ်အသားပြုထားပါသည်။';
$ec_lang['lpn_status_file_opened']='{file} ကို ဖွင့်ပြီးပါပြီ။';
$ec_lang['lpn_status_already_open']='ထိုဖိုင်ကို ဤနေရာတွင် {name} အဖြစ် ဖွင့်ထားပြီးသားဖြစ်သောကြောင့်၊ ဒုတိယမိတ္တူတစ်ခု ထပ်မဖွင့်ဘဲ ထိုဖိုင်ဆီသို့ ပြောင်းလိုက်ပါသည်။';
$ec_lang['lpn_status_already_open_dirty']='ထိုဖိုင်ကို ဤနေရာတွင် {name} အဖြစ် ဖွင့်ထားပြီးသားဖြစ်ပြီး၊ ၎င်းထဲသို့ မသိမ်းရသေးသော ပြောင်းလဲမှုများပါရှိသည်။ ဒုတိယမိတ္တူတစ်ခု ထပ်မဖွင့်ဘဲ ထိုဖိုင်ဆီသို့ ပြောင်းလိုက်ပါသည်။ ဒစ်စ်ခ်ပေါ်ရှိ ဗားရှင်းကို အလိုရှိပါက ဖိုင် > မူရင်းပြန်ယူရန် ကို အသုံးပြုပါ။';
$ec_lang['lpn_status_saved']='{file} ကို သိမ်းဆည်းပြီးပါပြီ။';
$ec_lang['lpn_status_reverted']='{file} ကို ဒစ်စ်ခ်မှ ထပ်မံ ဖွင့်ယူလိုက်ပါသည်။';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='{name} ကို မပိတ်မီ သင့်ပြောင်းလဲမှုများကို သိမ်းမလား။';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} ကို ဤဘရောက်ဇာတွင်သာ သိမ်းဆည်းထားပါသည်။ ဖိုင်တစ်ခုသို့ မသိမ်းဘဲ ပိတ်လိုက်ပါက၊ ၎င်းသည် အပြီးတိုင် ပျောက်ဆုံးသွားပါလိမ့်မည်။';
$ec_lang['lpn_close_discard']='မသိမ်းဘဲ ပိတ်ရန်';
$ec_lang['lpn_cancel']='ပယ်ဖျက်ရန်';
$ec_lang['lpn_revert_confirm']='သင်ပြုလုပ်ထားသော ပြောင်းလဲမှုများကို စွန့်ပစ်ပြီး {file} ကို ဒစ်စ်ခ်မှ ထပ်မံဖွင့်မလား။';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='ဤပရောဂျက်သည် {file} မှ လာခဲ့သော်လည်း၊ ထိုဖိုင်နှင့် ချိတ်ဆက်မှု ပြတ်တောက်သွားပါသည်။ ၎င်းနှင့် ပြန်ချိတ်ဆက်ရန် ဖိုင်ကို ထပ်မံရွေးချယ်ပါ။';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='ဖိုင်ထဲသို့ ရေးသွင်း၍မရပါ။ ၎င်းကို နေရာရွှေ့ထား၊ အမည်ပြောင်းထားနိုင်သည် သို့မဟုတ် ခွင့်ပြုချက် ရုပ်သိမ်းခံရနိုင်ပါသည်။ သင့်အလုပ်ကို ဤဘရောက်ဇာတွင် ဆက်လက်သိမ်းဆည်းထားပါသည်။';
$ec_lang['lpn_file_changed_elsewhere']='သင်ဤဖိုင်ကို ဖွင့်ပြီးနောက် တခြားတစ်ဦးက ၎င်းထဲသို့ သိမ်းဆည်းခဲ့ပါသည်၊ သို့ဖြစ်၍ ယခုသိမ်းလိုက်ပါက ၎င်းတို့၏အလုပ်အပေါ် ပြန်ရေးသိမ်းသွားပါလိမ့်မည်။ သင့်ပြောင်းလဲမှုများကို ကိုယ်ပိုင်ဖိုင်တစ်ခုတွင် ထားလိုပါက ဖိုင် > တခြားအမည်ဖြင့် သိမ်းရန် ကို အသုံးပြုပါ၊ သို့မဟုတ် သင့်ပြောင်းလဲမှုများကို စွန့်ပစ်ပြီး ၎င်းတို့၏ဗားရှင်းကို ဖွင့်လိုပါက ဖိုင် > မူရင်းပြန်ယူရန် ကို အသုံးပြုပါ။';
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
$ec_lang['lpn_lock_somebody']='တခြားတစ်ဦး';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} က ဤဖိုင်ကို ဖွင့်ထားသည်။';
$ec_lang['lpn_lock_open_readonly']='ဖတ်ရန်သာ ဖွင့်ရန်';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='သော့ချိုးရန်';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='ဤဖိုင်ကို အသုံးပြုနေဆဲ ဖြစ်ဟန်တူသည်။';
$ec_lang['lpn_lock_open_care']='ဒေတာ ဆုံးရှုံးမှု ရှောင်ရှားရန်၊ အောက်ပါ ရွေးချယ်စရာများမှ သေချာစွာ ရွေးချယ်ပါ။';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='၎င်းကို {x} ကြာ အသုံးပြုထားသည်။';
$ec_lang['lpn_lock_age_edited']='၎င်းကို {x} အရင်က နောက်ဆုံး တည်းဖြတ်ခဲ့သည်။';
$ec_lang['lpn_lock_age_saved']='၎င်းကို {x} အရင်က နောက်ဆုံး သိမ်းဆည်းခဲ့သည်။';
$ec_lang['lpn_lock_age_never_saved']='ဤဖိုင်သို့ မည်သည့်အရာမျှ မသိမ်းဆည်းရသေးပါ။';
$ec_lang['lpn_lock_age_unknown']='၎င်းကို မည်မျှကြာ အသုံးပြုထားသည်၊ သို့မဟုတ် နောက်ဆုံး မည်သည့်အခါ သိမ်းဆည်း (သို့) တည်းဖြတ်ခဲ့သည်ကို မှတ်တမ်း မရှိပါ။';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='“မေးမြန်းရန်” သည် ဤဖိုင်ကို ဖွင့်ထားသူကို သင်လိုချင်ကြောင်း ပြောပြပေးပြီး၊ အခြားမည်သည့်အရာကိုမျှ ပြောင်းလဲမည် မဟုတ်ပါ။ “ဖတ်ရန်သီးသန့် ဖွင့်ရန်” က သင့်အား ၎င်းကို ကြည့်ခွင့်နှင့် မည်သည့်အရာကိုမဆို လိုသလို ပြောင်းလဲခွင့် ပေးသော်လည်း၊ ဤနေရာတွင် သိမ်းဆည်း၍ မရပါ။ “လော့ခ် ချိုးဖျက်ရန်” က သင့်အား ဖိုင်အပေါ်မှ ထပ်၍ သိမ်းဆည်းခွင့် ပေးသည်၊ ၎င်းတို့၏ မသိမ်းရသေးသော အလုပ်ကို ဆုံးရှုံးမည် မဟုတ်သော်လည်း၊ ၎င်းတို့သည် ဤနေရာတွင် နောက်တစ်ကြိမ် မသိမ်းနိုင်တော့ပါ၊ တစ်ယောက်ယောက်က နှစ်ခုကို လက်ဖြင့် ပေါင်းစည်းပေးရန် လိုအပ်နိုင်သည်။';
$ec_lang['lpn_lock_ask']='မေးမြန်းရန်';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='မေးမြန်းသူအဖြစ် မည်သူ့အမည်ကို ပြောပြရမည်နည်း။ သင့်နာမည်အတိုကောက် အကောင်းဆုံးဖြစ်သည်။ ၎င်းတို့ကို ဤဖိုင်၏ လော့ခ်နှင့်အတူ ကျွန်ုပ်တို့၏ ဆာဗာပေါ်တွင် ဖိုင်ကို ဖွင့်ထားသူ မည်သူ့အတွက်မဆို သိမ်းဆည်းထားပြီး၊ ရက် ၃၀ အတွင်း ဖျက်ပစ်မည်ဖြစ်သည်။';
$ec_lang['lpn_lock_ask_sent']='ဤဖိုင်ကို ဖွင့်ထားသူအား ပိတ်ပေးရန် မေးမြန်းလိုက်ပါပြီ။ ၎င်းတို့၏ စာမျက်နှာ ဖွင့်ထားဆဲဖြစ်ပါက၊ တစ်မိနစ်အတွင်း တွေ့ရပါလိမ့်မည်။ အခြားမည်သည့်အရာမျှ ပြောင်းလဲခြင်း မရှိပါ၊ ၎င်းတို့ မပိတ်မချင်း ဖိုင်သည် ၎င်းတို့ပိုင်ဆိုင်ဆဲ ဖြစ်သည်။';
$ec_lang['lpn_lock_ask_failed']='သင့်စာကို ပေးပို့၍ မရပါ။ ယခု ဤဖိုင်ကို ဖွင့်ထားသူ တစ်ဦးမျှ မရှိခြင်း (သို့) ဆာဗာသို့ မရောက်ရှိနိုင်ခြင်း ဖြစ်နိုင်သည်။';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='ထိုဖိုင်ကို မဖွင့်ခဲ့ပါ၊ ဤနေရာတွင် မည်သည့်အရာမျှ ပြောင်းလဲခြင်း မရှိပါ။ အခြားတစ်ဦးက ၎င်းကို ဖွင့်ထားဆဲ ဖြစ်သည်။';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} က ဤဖိုင်ကို တည်းဖြတ်လိုသည်။ အဆင်သင့်ဖြစ်လျှင်၊ သင့်အလုပ်ကို သိမ်းဆည်းပြီး လွှဲပြောင်းပေးရန် ဖိုင် > ပရောဂျက် ပိတ်ရန် ကို သုံးပါ။';
$ec_lang['lpn_ago_seconds']='{n} စက္ကန့်';
$ec_lang['lpn_ago_minutes']='{n} မိနစ်';
$ec_lang['lpn_ago_hours']='{n} နာရီ';
$ec_lang['lpn_ago_days']='{n} ရက်';
$ec_lang['lpn_ago_unknown']='မသိသောအချိန်';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='မက်ဆေ့ချ်များ';
$ec_lang['lpn_msglog_heading']='လတ်တလော မက်ဆေ့ချ်များ';
$ec_lang['lpn_msglog_empty']='မက်ဆေ့ချ် မရှိသေးပါ။';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} အရင်က';
$ec_lang['lpn_msglog_note']='အသစ်ဆုံးကို ပထမ ဖော်ပြသည်။ ဤစာမျက်နှာသည် ဖွင့်ထားစဉ် နောက်ဆုံး မက်ဆေ့ချ် {n} ခုကို ထိန်းထားပြီး၊ သင့်ကွန်ပျူတာတွင် မည်သည့်အရာမျှ မသိမ်းဆည်းပါ။';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='ဖတ်ရန်သာ - {name} က ဤဖိုင်ကို ဖွင့်ထားသည်။ ဤနေရာတွင် သင်လိုသလို မည်သည့်အရာကိုမဆို ပြောင်းလဲနိုင်သော်လည်း၊ သိမ်း၍မရပါ။ တခြားဖိုင်တစ်ခုသို့ သိမ်းလိုပါက ဖိုင် > တခြားအမည်ဖြင့် သိမ်းရန် ကို အသုံးပြုပါ။';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='သတိပြုပါ - ဤပရောဂျက်အပေါ် သော့ခတ်ခြင်းကို စစ်ဆေးရန် (သို့) ဖန်တီးရန် ဆာဗာကို မရောက်နိုင်ခဲ့ပါ၊ သို့ဖြစ်၍ လုပ်ဖော်ကိုင်ဖက်တစ်ဦးက တူညီသောဖိုင်ကို တစ်ချိန်တည်း တည်းဖြတ်ခြင်းမှ ဟန့်တားနိုင်မည့်အရာ မရှိတော့ပါ။ သော့ခတ်ခြင်း ပြန်လည်အလုပ်လုပ်လာပါက သင့်ကို အကြောင်းကြားပါလိမ့်မည်။';
$ec_lang['lpn_lock_storage_error']='သတိပြုပါ - ဤဆိုက်သည် သော့ခတ်မှတ်တမ်းများကို သိမ်းဆည်း၍မရပါ၊ သို့ဖြစ်၍ လုပ်ဖော်ကိုင်ဖက်တစ်ဦးက တူညီသောဖိုင်ကို တစ်ချိန်တည်း တည်းဖြတ်ခြင်းမှ ဟန့်တားနိုင်မည့်အရာ မရှိတော့ပါ။ ၎င်းသည် ဆာဗာ၏ တပ်ဆင်မှုအမှား ဖြစ်ပြီး၊ ဤနေရာတွင် သင်ပြင်ဆင်နိုင်သော အရာမဟုတ်ပါ — သော့ခတ် ဖိုင်တွဲကို ဝဘ်ဆာဗာက ရေးသွင်းခွင့် မရှိပါ။';
$ec_lang['lpn_lock_full_error']='သတိပြုပါ - မည်သူက မည်သည့်ပရောဂျက်ကို ဖွင့်ထားသည်ကို မှတ်တမ်းတင်ရန် ဤဆိုက်တွင် နေရာကုန်သွားပါသည်၊ သို့ဖြစ်၍ လုပ်ဖော်ကိုင်ဖက်တစ်ဦးက တူညီသောဖိုင်ကို တစ်ချိန်တည်း တည်းဖြတ်ခြင်းမှ ဟန့်တားနိုင်မည့်အရာ မရှိတော့ပါ။ ၎င်းသည် ဆာဗာ၏ တပ်ဆင်မှုအမှား ဖြစ်ပြီး၊ ဤနေရာတွင် သင်ပြင်ဆင်နိုင်သော အရာမဟုတ်ပါ။';
$ec_lang['lpn_lock_not_asked']='ဤပရောဂျက်အတွက် သော့ခတ်ခြင်း အလုပ်မလုပ်နေပါ၊ သို့ဖြစ်၍ လုပ်ဖော်ကိုင်ဖက်တစ်ဦးက တူညီသောဖိုင်ကို တစ်ချိန်တည်း တည်းဖြတ်ခြင်းမှ ဟန့်တားနိုင်မည့်အရာ မရှိတော့ပါ။ ဤပရောဂျက်တွင် သက်သေခံနံပါတ် မရှိသေးပါ၊ ၎င်းကို ဖိုင်တစ်ခုသို့ သိမ်းဆည်းလိုက်ခြင်းက တစ်ခု ပေးပါလိမ့်မည်။';
$ec_lang['lpn_lock_restored']='သော့ခတ်ခြင်း ပြန်လည်အလုပ်လုပ်နေပြီဖြစ်ပြီး၊ ဤဖိုင်ကို ယခုအခါ သင့်ကိုယ်ပိုင်အဖြစ် သိမ်းဆည်းနိုင်ပါပြီ။';
$ec_lang['lpn_lock_dismiss']='ဤစာကို ဖျောက်ရန်';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='သင့်ပရောဂျက်ကို ဤကွန်ပျူတာပေါ်ရှိ ဖိုင်တစ်ခုတွင် သိမ်းဆည်းပါလိမ့်မည်။ သင်တောင်းဆိုချိန်တွင်သာ သိမ်းဆည်းပြီး၊ အခြားအချိန်တွင် သိမ်းဆည်းမည်မဟုတ်သောကြောင့်၊ သင်မသိဘဲ ထိုဖိုင်ထဲသို့ မည်သည့်အရာမျှ ရေးသွင်းမည် မဟုတ်ပါ။';
$ec_lang['lpn_file_training_2']='လူနှစ်ဦးသည် ဖိုင်တစ်ခုတည်းကို တစ်ချိန်တည်း မည်သည့်အခါမျှ တည်းဖြတ်မိမည် မဟုတ်စေရန်၊ ဤဆိုက်က မည်သူ ဖွင့်ထားသည်ကို မှတ်တမ်းတင်ထားပါသည်။ တစ်စုံတစ်ဦးက ၎င်းကို ဖွင့်ထားပြီးသားဖြစ်ပါက၊ သင်သည် ၎င်းကို ဖွင့်ကြည့်နိုင်သေးသည် (သို့) ကိုယ်ပိုင်မိတ္တူတစ်ခု ထားနိုင်သေးသည်။';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='သင်ပထမဆုံးအကြိမ် သိမ်းဆည်းသောအခါ၊ ဤဆိုက်သည် ဖိုင်ကို တည်းဖြတ်ခွင့်ရှိမရှိကို သင့်ဘရောက်ဇာက မေးပါလိမ့်မည်။ ထိုမေးခွန်းသည် ဘရောက်ဇာမှ လာခြင်းဖြစ်ပြီး ကျွန်ုပ်တို့ထံမှ မဟုတ်ပါ၊ ခွင့်ပြုသည်ဟု ဖြေဆိုခြင်းကသာ သိမ်းရန် အား သင့်အလုပ်ကို ပြန်ရေးသွင်းနိုင်စေသည်။ ပုံမှန်အားဖြင့် ဖိုင်တစ်ခုလျှင် တစ်ကြိမ်သာ မေးလေ့ရှိသည်။';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='ဆက်လုပ်ရန်';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='ဖိုင်ကို ထပ်မံရွေးချယ်ရန်';
$ec_lang['lpn_file_reconnect']='ဤဖိုင်နှင့် ပြန်ချိတ်ဆက်ရန်';
$ec_lang['lpn_file_reconnect_alert']='ဤပရောဂျက်သည် {file} မှ လာခဲ့ပါသည်။ ၎င်းထဲသို့ ရေးသွင်းနိုင်ရန် သင့်ဘရောက်ဇာက သင့်ခွင့်ပြုချက်ကို ထပ်မံလိုအပ်ပါသည်။ အောက်တွင် ပြန်ချိတ်ဆက်ပါ။';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='ထိုဖိုင်သည် တခြားတစ်ဦး ဖွင့်ထားသော ဖိုင်တစ်ခုတည်း ဖြစ်သောကြောင့်၊ ၎င်းအပေါ် ပြန်ရေးသိမ်း၍မရပါ။ တခြားဖိုင် (သို့) တခြားအမည်တစ်ခုကို ရွေးချယ်ပါ။';
$ec_lang['lpn_saveas_overwrites_project']='ထိုဖိုင်တွင် တခြားပရောဂျက်တစ်ခု {name} ရှိနှင့်ပြီးသားဖြစ်သည်။ ဤနေရာတွင် သိမ်းလိုက်ပါက ၎င်းကို လုံးဝ အစားထိုးလိုက်ပါလိမ့်မည်။ ဆက်လုပ်မလား။';
$ec_lang['lpn_saveas_overwrites_newer']='သင်နောက်ဆုံးမြင်ခဲ့သည့်အချိန်မှစ၍ ထိုဖိုင်သည် ပြောင်းလဲသွားပါသည်၊ သို့ဖြစ်၍ တစ်စုံတစ်ဦးက ၎င်းထဲသို့ သိမ်းဆည်းခဲ့ခြင်း ဖြစ်နိုင်ချေများပါသည်။ ဤနေရာတွင် သိမ်းလိုက်ပါက ၎င်းတို့၏ဗားရှင်းကို သင့်ဗားရှင်းဖြင့် အစားထိုးလိုက်ပါလိမ့်မည်။ ဆက်လုပ်မလား။';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='ဤပရောဂျက်အတွက် အမည်';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='{closed} ကို ပိတ်လိုက်ပါသည်။ ယခု {opened} ကို ပြသနေပါသည်။';
$ec_lang['lpn_status_closed_empty']='{closed} ကို ပိတ်လိုက်ပါသည်။ ပရောဂျက်အသစ် ဗလာတစ်ခု စတင်လိုက်ပါသည်။';
$ec_lang['lpn_storage_full']='မသိမ်းရသေးပါ။ ဘရောက်ဇာသိုလှောင်ခန်း ပြည့်နေခြင်း (သို့) မရရှိနိုင်ခြင်းကြောင့်၊ ဤတဲ့ဘ်ကို ပိတ်လိုက်သောအခါ သင့်လတ်တလော ပြောင်းလဲမှုများ ပျောက်ဆုံးသွားပါလိမ့်မည်။';
$ec_lang['lpn_storage_unreadable']='မသိမ်းရသေးပါ။ ဤပရောဂျက်ကို ဘရောက်ဇာသိုလှောင်ခန်းမှ ဖတ်၍ မရနိုင်ခဲ့ပါ။ ၎င်း၏ သိမ်းဆည်းထားသော မိတ္တူကို ရှိနေသည့်အတိုင်း ချန်ထားပြီး ပြန်ရေးမည် မဟုတ်ပါ၊ သို့ဖြစ်၍ ဤတဲ့ဘ်ပေါ်ရှိ မည်သည့်အရာမျှ သိမ်းဆည်းခြင်း မရှိပါ။ ဆက်လက်အလုပ်လုပ်ရန် ဖိုင်တစ်ခု ဖွင့်ပါ (သို့) ပရောဂျက်အသစ် ဖန်တီးပါ။';
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
$ec_lang['lpn_about_credits']='ကျေးဇူးတင်လွှာ';
$ec_lang['lpn_help_welcome']='ကြိုဆိုစာမျက်နှာ';
$ec_lang['lpn_about_license']='GNU General Public License v3.0 (သို့) ထို့နောက်ပိုင်း ဗားရှင်း အောက်တွင် လိုင်စင်ရထားသည်။';
$ec_lang['lpn_notes_1_term']='မည်သို့ ဖြေရှင်းသည်';
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
$ec_lang['lpn_notes_1_def']='EPANET ဖြေရှင်းစက်က ဤကွန်ရက်ကို ဖြေရှင်းပေးသည်။ စုစုပေါင်း run အချိန်တစ်ခု သတ်မှတ်ပါက အစီရင်ခံ အဆင့်တိုင်းကို အလှည့်ကျ တွက်ချက်သည် - ရေတိုက်များ ပြည့်၊ ကုန်သွားပြီး၊ လိုအင်များသည် ၎င်းတို့၏ ပုံစံများကို လိုက်နာသည်၊ ကိရိယာဘားက run ကို ပြန်ဖွင့်ပြသည်။';
$ec_lang['lpn_notes_2_term']='မလုပ်ဆောင်သောအရာများ';
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
$ec_lang['lpn_notes_2_def']='ရေအရည်အသွေးကို ပုံစံပြုထားသည် - ရေသက်တမ်း၊ ရင်းမြစ် ခြေရာခံမှု (source trace) နှင့် ပိုက်နံရံများနှင့် ရေအတွင်း ဓာတုပြုမှုရှိသော ဓာတုပစ္စည်းတစ်ခု။ ဆာချ် (surge) နှင့် ရေဒုတ် (water hammer) ကိုမူ ပုံစံမပြုပါ - ဤနေရာရှိ အဖြေတိုင်းသည် တည်ငြိမ်စွာ စီးဆင်းနေပြီးသား ရေအတွက်သာဖြစ်ပြီး၊ ဗားလ်တစ်ခု ရုတ်တရက်ပိတ်လိုက်သည့်အခါ ဖြစ်ပေါ်သော ဖိအားလှိုင်းအတွက် မဟုတ်ပါ။';
$ec_lang['lpn_notes_3_term']='ပရောဂျက်များ သိမ်းဆည်းခြင်း';
$ec_lang['lpn_notes_3_def']='ပရောဂျက်တိုင်းသည် တဲ့ဘ်တစ်ခုဖြစ်ပြီး၊ တဲ့ဘ်တိုင်းကို သင်အလုပ်လုပ်နေစဉ် ဤဘရောက်ဇာတွင် သိမ်းဆည်းထားပါသည်။ သင့်ဘရောက်ဇာဒေတာကို ရှင်းလင်းလိုက်ပါက ၎င်းတို့ အားလုံးကို ဖျက်ပစ်ပါလိမ့်မည်၊ သို့ဖြစ်၍ သင့်အလုပ်ကို ဖိုင် > တခြားအမည်ဖြင့် သိမ်းရန် ဖြင့် ဖိုင်တစ်ခုတွင် ထားပါ။ တဲ့ဘ်တစ်ခုပေါ်ရှိ ကြယ်ပွင့်အမှတ်အသားသည် ဖိုင်ထဲတွင် မပါသော ပြောင်းလဲမှုများ ပါရှိသည်ဟု ဆိုလိုသည်။ သင်တောင်းဆိုမှသာ ဖိုင်တစ်ခုသို့ မည်သည့်အရာမျှ ရေးသွင်းမည် ဖြစ်သည်။ အချို့ဘရောက်ဇာများတွင် ပရောဂျက်သည် သင်သိမ်းဆည်းသော ဖိုင်နှင့် ချိတ်ဆက်သွားပြီး၊ ဖိုင် > သိမ်းရန် သည် ထိုအချိန်မှစ၍ ထိုဖိုင်တစ်ခုတည်းသို့ ပြန်ရေးသိမ်းပေးပါလိမ့်မည်။ အခြားများတွင် ချိတ်ဆက်မှု မဖြစ်နိုင်သောကြောင့်၊ သိမ်းရန် ကို ပိတ်ထားပြီး တခြားအမည်ဖြင့် သိမ်းရန် ကိုသာ အသုံးပြုနိုင်သည်။ ပရောဂျက်ဖိုင်တစ်ခုကို မျှဝေဒရိုက်ဗ်တစ်ခုတွင် ထားရှိသောအခါ၊ လုပ်ဖော်ကိုင်ဖက်တစ်ဦးက ၎င်းကို ဖွင့်ထားပြီးသားလားဟု ဤစာမျက်နှာက ပြောပြပါလိမ့်မည်၊ သို့မှသာ လူနှစ်ဦးသည် တစ်ဦးအပေါ်တစ်ဦး ပြန်ရေးသိမ်းမိမည် မဟုတ်ပါ။';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='ရေတင်စက် ကွေးမျဉ်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='ရေတင်စက်တစ်ခုသည် H = H₀ − aQ^b ဆိုသည့် ညီမျှခြင်းကို လိုက်နာသည်၊ ဤတွင် H မှာ ရေတင်စက်က ထပ်ပေါင်းပေးသော ဖိမြင့်ဆင့်ဖြစ်ပြီး Q မှာ ၎င်းကိုဖြတ်၍ စီးဆင်းသော ရေစီးနှုန်းဖြစ်သည်။ ထုတ်လုပ်သူ၏ ကွေးမျဉ်းမှ အမှတ် တစ်ခု၊ နှစ်ခု (သို့) သုံးခုကို ထည့်သွင်းပါ။ အမှတ်သုံးခု, ရေစီးနှုန်းသုညတွင် ဖိမြင့်ဆင့်၊ ပုံမှန်အလုပ်လုပ်သည့်အမှတ်နှင့် အမြင့်ဆုံးရေစီးနှုန်းရှိသည့်အမှတ်, တို့သည် H₀၊ a နှင့် b ကို တိုက်ရိုက်ချိန်ညှိပေးပြီး ထုတ်ဝေထားသော ကွေးမျဉ်းနှင့် အနီးဆုံး လိုက်ပါသည်။ အမှတ်နှစ်ခုကမူ ရေစီးနှုန်းသုညတွင် အထွတ်ရှိသော ပါရာဘိုလာ (b = 2) တစ်ခုနှင့် ကိုက်ညီစေသည်။ အမှတ်တစ်ခုတည်းကမူ ယေဘုယျစည်းမျဉ်းတစ်ခုကို သုံးသည် - ရေစီးနှုန်းသုညတွင် ဖိမြင့်ဆင့်မှာ သင်ထည့်သွင်းသည့် ဖိမြင့်ဆင့်၏ 1.33 ဆဖြစ်ပြီး၊ အမြင့်ဆုံးရေစီးနှုန်းမှာ သင်ထည့်သွင်းသည့် ရေစီးနှုန်း၏ 2 ဆဖြစ်ပြီး၊ ၎င်းသည်လည်း b = 2 ကို ပေးပါသည်။ အမှတ်တစ်ခုမျှ မထည့်သွင်းထားသော ရေတင်စက်တစ်ခုသည် ဖိမြင့်ဆင့် လုံးဝ ထပ်မပေါင်းပါ။ ဖိမြင့်ဆင့် သုညသို့ရောက်သည့်နေရာတွင် ကွေးမျဉ်းကို ဖြတ်၍ ရပ်တန့်ထားခြင်း မရှိသောကြောင့်၊ ရေတင်စက်တစ်ခုအား ၎င်း၏ကွေးမျဉ်း ပေးနိုင်သည်ထက် ပိုသော ရေစီးနှုန်းကို တောင်းဆိုပါက အနုတ်ဖိမြင့်ဆင့် ရရှိပါလိမ့်မည်။ ဤပြဿနာကို ဖြေရှင်းရန်မှာ ကွေးမျဉ်း အသစ်ချိန်ညှိခြင်း မဟုတ်ဘဲ၊ ရေတင်စက်ကြီးတစ်ခု (သို့) လိုအပ်ချက်နည်းသော ပမာဏတစ်ခု ရွေးချယ်ရန်သာ ဖြစ်သည်။ ကွေးမျဉ်းတစ်ခုသည် အမှတ်သုံးခုထက် ပိုမို ကိုင်ဆောင်နိုင်ပြီး၊ သင်ပေးထားသော အမှတ်တိုင်းကို ဖတ်ပါသည်။';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='ဤစာမျက်နှာပေါ်တွင် ရှိသေးသည်များ';
$ec_lang['lpn_notes_4_def']='ပရောဂျက်တစ်ခုသည် နောက်ခံတွင် လမ်းမြေပုံပါသော တကယ့်မြေပြင်ပေါ်တွင် ရှိနိုင်သည်။ EPANET .inp ဖိုင်များကို ဖတ်ယူနိုင်ပြီး ရေးသားထုတ်နိုင်သည်။ အောက်ခြေ panel သည် လမ်းကြောင်းတစ်လျှောက် profile တစ်ခု ဆွဲပြီး ဆက်စပ်နေရာများကို စာရင်းပြုစုသည်။ အစိတ်အပိုင်းများကို ၎င်းတို့၏ အဖြေများအလိုက် အရောင်ခြယ်နိုင်ပြီး၊ Find က သင်သတ်မှတ်ထားသော အခြေအနေနှင့် ကိုက်ညီသော အစိတ်အပိုင်း အားလုံးကို ရွေးထုတ်ပေးသည်။';
$ec_lang['lpn_notes_6_term']='ဇယား ကော်လံများ အကူအညီ';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>ကော်လံကို ရွေးချယ်ရန်</td><td>ခေါင်းစီးကို နှိပ်ပါ</td></tr><tr><td>ကော်လံ ရွေးချယ်မှုကို ထပ်ထည့်ရန် (သို့) ချဲ့ရန်</td><td>အခြားခေါင်းစီးကို Ctrl+click (သို့) Shift+click နှိပ်ပါ</td></tr><tr><td>ရွေးထားသော ကော်လံ(များ)ကို ရွှေ့ရန် (စီစဉ်ပြန်ရန်)</td><td>ဖိဆွဲပါ (သို့) right-click (သို့) ⋮ မီနူးရှိ ကော်လံများ စီမံရန်… ကို သုံးပါ</td></tr><tr><td>မီနူး ⋮ နှင့် စီမြှားညွှန်။</td><td>ခေါင်းစီး၏ ထောင့်အပေါ်ကို ကာဆာထားပါ၊ (သို့) ခေါင်းစီးထဲသို့ ရွေးချယ် (သို့) Tab ဖြင့် ဝင်ပါ</td></tr><tr><td>ဖျောက်ရန်၊ အားလုံးပြရန်၊ (သို့) မြင်နိုင်မှုနှင့် အစီအစဉ်ကို စီမံရန်</td><td>ခေါင်းစီးကို right-click နှိပ်ပါ (သို့) ခေါင်းစီး၏ ညာဘက်အပေါ်ထောင့်ရှိ ⋮ မီနူး</td></tr><tr><td>ကော်လံအလိုက် စီရန်</td><td>ခေါင်းစီး၏ ညာဘက်အပေါ်ထောင့်ရှိ မြှားသင်္ကေတ</td></tr><tr><td>ဇယားအဆုံးတွင် အတန်းအသစ်များအဖြစ် ကူးထည့်ရန်</td><td>Right-click၊ ခေါင်းစီး၏ ညာဘက်အပေါ်ထောင့်ရှိ ⋮ မီနူး၊ (သို့) Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='ဇယား ကီးဘုတ် ဖြတ်လမ်းများ';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>မြှားခလုတ်များ</td><td>ရွှေ့ရန်။</td></tr><tr><td>Tab, Enter</td><td>ရိုက်ထည့်မှု ပြီးဆုံးပြီး ဆဲလ်တစ်ခု အလျားလိုက် / အောက်သို့ ရွှေ့ရန်။</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>နောက်ပြန် ရွှေ့ရန်။</td></tr><tr><td>Shift+မြှားခလုတ်များ</td><td>ရွေးချယ်မှုကို ချဲ့ရန်။</td></tr><tr><td>Ctrl+C</td><td>ရွေးချယ်ထားသည်ကို ကူးယူရန်။</td></tr><tr><td>Ctrl+D</td><td>ရွေးချယ်ထားသည်ကို ၎င်း၏ထိပ်ဆုံးအတန်းမှ အောက်သို့ ဖြည့်ရန်။</td></tr><tr><td>Ctrl+Enter</td><td>ရွေးချယ်ထားသည်ကို လက်ရှိဆဲလ်\'၏ တန်ဖိုးဖြင့် ဖြည့်ရန်။</td></tr><tr><td>Ctrl+A</td><td>ဇယားတစ်ခုလုံးကို ရွေးချယ်ရန်။</td></tr><tr><td>Ctrl+Shift+V</td><td>ဇယားအဆုံးတွင် အတန်းအသစ်များအဖြစ် ကူးထည့်ရန်။</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>နောက် (သို့) ယခင် ဇယားသို့ ပြောင်းရန်။</td></tr><tr><td>Delete</td><td>ဆဲလ်တစ်ခုကို ရှင်းလင်းရန်။</td></tr><tr><td>F2</td><td>ဆဲလ်တစ်ခုကို တည်းဖြတ်ရန် ဖွင့်ရန်။</td></tr><tr><td>Esc</td><td>တည်းဖြတ်မှုကို ပယ်ဖျက်ရန်။</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='အရောင်အပိုင်း နယ်နိမိတ်များ မပြောင်းလဲပါ';
$ec_lang['lpn_notes_color_def']='အရောင်အပိုင်း နယ်နိမိတ်များကို ဒေတာခွဲခြားနည်းလမ်းတစ်ခု ရွေးချယ်ချိန်တွင် သတ်မှတ်သည်။ ၎င်းတို့ကို အချိန်အဆင့်တိုင်းတွင် ပြန်မသတ်မှတ်ပါ၊ အကြောင်းမှာ ထိုသို့ပြုလုပ်ပါက အရောင်များသည် အဆင့်တိုင်းတွင် အဓိပ္ပာယ်သစ် ဆောင်စေမည်ဖြစ်ပြီး၊ ၎င်းသည် သင့်စနစ်ကို မြင်ယောင်ကြည့်ရန် အထောက်အကူ မဖြစ်ပါ။ EPANET ကလည်း ဤနည်းအတိုင်းပင် လုပ်ဆောင်သည်။ နယ်နိမိတ်အသစ်များ ရလိုပါက နည်းလမ်းတစ်ခုကို ထပ်မံရွေးချယ်ပါ (သို့) သင့်ကိုယ်ပိုင် နယ်နိမိတ်များကို ရိုက်ထည့်ပါ။';
$ec_lang['lpn_notes_epanet_term']='Hazen-Williams ကိန်းသေများသည် EPANET နှင့် ကိုက်ညီသည်';
$ec_lang['lpn_notes_epanet_def']='2026 ခုနှစ် သြဂုတ်လတွင် Hazen-Williams ကိန်းနှင့် ထပ်ကိန်းကို EPANET နှင့် ကိုက်ညီအောင် ပြောင်းလဲခဲ့ပါသည်။ ဖိမြင့်ဆင့်ဆုံးရှုံးမှု အဖြေများသည် ဤစာမျက်နှာ၏ ယခင်ဗားရှင်းများနှင့် 0.1 ရာခိုင်နှုန်းအထိ ကွာခြားနိုင်ပြီး၊ ၎င်းသည် C တန်ဖိုးကိုယ်တိုင်၏ မသေချာမှုထက် များစွာနည်းပါသည်။';
$ec_lang['lpn_notes_engine_term']='ဤစာမျက်နှာက အသုံးပြုသော EPANET ဗားရှင်း';
$ec_lang['lpn_notes_engine_def']='ဤစာမျက်နှာရှိ EPANET ဖြေရှင်းစက်မှာ OWA-EPANET 2.3.5 ဖြစ်ပြီး၊ 2025 ခုနှစ် ဖေဖော်ဝါရီ 20 ရက်တွင် ထုတ်ဝေခဲ့သည်။ EPANET ကို Open Water Analytics အသိုင်းအဝိုင်းက တီထွင်ထားပြီး၊ ၎င်းသည် အမေရိကန် ပတ်ဝန်းကျင် ထိန်းသိမ်းရေးအေဂျင်စီ (EPA) နှင့် ပူးပေါင်း၍ 2019 ခုနှစ် ဒီဇင်ဘာတွင် ဗားရှင်း 2.2.0 ကို ထုတ်ဝေခဲ့သည်။ လည်ပတ်မှု အစီရင်ခံစာက ၎င်းကို 2.3.05 ဟု ခေါ်သည်မှာ အင်ဂျင်က နောက်ဆုံးဂဏန်းကို ဂဏန်းနှစ်လုံးဖြင့် ရေးသောကြောင့်ဖြစ်သည်။ ၎င်းသည် Luke Butler ၏ MIT လိုင်စင်ဖြင့် epanet-js 0.9.0 မှတစ်ဆင့် ဤစာမျက်နှာသို့ ရောက်ရှိပြီး၊ သင်၏ဘရောက်ဇာထဲတွင်သာ လည်ပတ်သည် - သင်၏ကွန်ရက်ကို ဖြေရှင်းရန် မည်သည့်နေရာသို့မျှ ပို့ခြင်း မရှိပါ။';
$ec_lang['lpn_id_invalid']='နေရာလွတ်နှင့် ကိုးကားအမှတ်အသား မပါသော ID တစ်ခုကို ရိုက်ထည့်ပါ။';
$ec_lang['lpn_id_taken']='ထို ID ကို အသုံးပြုပြီးဖြစ်ပါသည်။';
$ec_lang['lpn_diag_no_fixed_head']='ရေကန် (သို့) ရေတိုက်တစ်ခု ထည့်ပါ။ ကွန်ရက်ကို မဖြေရှင်းနိုင်မီ သိရှိပြီးသား ရေမျက်နှာပြင်အဆင့် အနည်းဆုံး တစ်ခု လိုအပ်ပါသည်။';
$ec_lang['lpn_diag_dangling_link']='ပိုက်လိုင်း (သို့) ရေတင်စက်တစ်ခုသည် မရှိတော့သော နေရာတစ်ခုနှင့် ချိတ်ဆက်နေသည် -';
$ec_lang['lpn_diag_unreachable']='ဤနေရာများသည် ရေကန်တစ်ခုသို့ သွားရန် လမ်းကြောင်းမရှိပါ -';
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
$ec_lang['lpn_engine_fetching']='EPANET ဖြေရှင်းစက်ကို ရယူနေသည်။ တစ်ကြိမ်သာ ဒေါင်းလုဒ်လုပ်ပြီး ဤစက်ပေါ်တွင် သိမ်းထားသောကြောင့်၊ နောက်ပိုင်းတွင် အင်တာနက်မလိုဘဲ အလုပ်လုပ်ပါသည်။';
$ec_lang['lpn_engine_ready']='EPANET ဖြေရှင်းစက်သည် ယခု ဤစက်ပေါ်တွင် ရှိပြီး၊ အင်တာနက်မလိုဘဲ အလုပ်လုပ်ပါသည်။';
$ec_lang['lpn_engine_fetching_valve']='EPANET ဖြေရှင်းစက်ကို ရယူနေသည်၊ ထို့ကြောင့် ဤဗားလ်ကို ယခုနှင့် နောက်ပိုင်း အင်တာနက်မလိုဘဲ ဖြေရှင်းနိုင်ပါလိမ့်မည်။';
$ec_lang['lpn_engine_ready_valve']='EPANET ဖြေရှင်းစက်သည် ယခု ဤစက်ပေါ်တွင် ရှိပါသည်။ ၎င်းတို့ကိုယ်တိုင် ဖွင့်/ပိတ် လုပ်ဆောင်သော ဗားလ်များသည် အင်တာနက်မလိုဘဲ အလုပ်လုပ်ပါလိမ့်မည်။';
$ec_lang['lpn_engine_unavailable']='ကိုယ်တိုင် ဖွင့်/ပိတ် လုပ်ဆောင်သော ဗားလ်များကို ဖြေရှင်းပေးသည့် EPANET ဖြေရှင်းစက်ကို ရယူ၍မရခဲ့ပါ။ အင်တာနက်ကို တစ်ကြိမ်သာ ချိတ်ဆက်ပါ၊ ထို့နောက် ဤစက်ပေါ်တွင် သိမ်းထားပါလိမ့်မည်။';
$ec_lang['lpn_engine_needed_loading']='သင်တည်ဆောက်နေစဉ် EPANET ဖြေရှင်းစက်ကို ဖွင့်နေသည်။ အပြည့်အဝ ဖွင့်ပြီးသောအခါ အဖြေများ ရရှိနိုင်ပါလိမ့်မည်။';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='ဖြေရှင်းစက် ဖွင့်နေမှု တိုးတက်မှု';
$ec_lang['lpn_engine_wait']='ဖြေရှင်းစက် ဖွင့်နေသည်။ အဖြေများ ခဏအတွင်း နှောင့်နှေးမည်။ ဆက်လက် အလုပ်လုပ်ပါ။';
$ec_lang['lpn_engine_wait_pct']='ဖြေရှင်းစက် {percent}% ဖွင့်ပြီးပါပြီ။';
$ec_lang['lpn_engine_wait_bytes']='ဖြေရှင်းစက် {kb} KB ယခုအထိ ဖွင့်ပြီးပါပြီ။ စုစုပေါင်း မရနိုင်သောကြောင့်၊ ပြီးဆုံးသည့် ရာခိုင်နှုန်းကို မသိနိုင်ပါ။';
$ec_lang['lpn_engine_needed_failed']='EPANET ဖြေရှင်းစက်ကို မရရှိသေးပါ၊ ဖွင့်၍လည်း မရနိုင်ပါ၊ ဤကွန်ရက်ကို ၎င်းဖြင့်သာ ဖြေရှင်းနိုင်ပါသည်။ အင်တာနက်ချိတ်ဆက်ထားသောအခါ ၎င်းကို ဖွင့်ပါလိမ့်မည်။';
$ec_lang['lpn_diag_valve_needs_epanet']='ဤဗားလ်များသည် ၎င်းတို့ကိုယ်တိုင် ဖွင့်/ပိတ် လုပ်ဆောင်ကြပြီး၊ EPANET ဖြေရှင်းစက်ကသာ ၎င်းတို့ကို တွက်ချက်နိုင်သည်။ EPANET ဖြေရှင်းစက်ကို ဖွင့်၍မရခဲ့ပါ၊ ထို့ကြောင့် အောက်ပါ အဖြေများ ပျောက်ဆုံးနေသည် -';
$ec_lang['lpn_diag_valve_on_fixed_head']='ဤဗားလ်များသည် ရေကန် (သို့) ရေတိုက်တစ်ခုအပေါ် တိုက်ရိုက်ချိတ်ဆက်ထားပြီး၊ ထိုနေရာ၏ ရေအဆင့်ကို ၎င်းက သတ်မှတ်ပြီးသားဖြစ်သောကြောင့်၊ ဗားလ်အတွက် ထိန်းချုပ်စရာ ဘာမျှ မကျန်တော့ပါ။ ဗားလ်နှင့် ရေကန် (သို့) ရေတိုက်ကြားတွင် တိုတောင်းသော ပိုက်လိုင်းတစ်ခု ထည့်ပါ -';
$ec_lang['lpn_diag_not_converged']='အဖြေ မတွေ့ရှိခဲ့ပါ။ အချင်းသုည ကဲ့သို့ လက်တွေ့ဘဝတွင် မဖြစ်နိုင်သော တန်ဖိုးများကို စစ်ဆေးပါ။';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='ဖြေရှင်းမှု အဖြေ မတွေ့ရှိခဲ့ပါ။ ဤဂဏန်းများသည် နောက်ဆုံး ထပ်ခါထပ်ခါ တွက်ချက်မှုသာ ဖြစ်ပြီး အဖြေ မဟုတ်ပါ။ ၎င်းတို့ကို အသုံးမပြုပါနှင့်။';
$ec_lang['lpn_diag_not_converged_trials']='ထပ်ခါထပ်ခါ တွက်ချက်မှု {iterations} ကြိမ်ပြီးနောက် ရပ်တန့်သွားသည်။';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='ထပ်ခါထပ်ခါ တွက်ချက်မှု {iterations} ကြိမ်ပြီးနောက်၊ တိကျမှု သတ်မှတ်ချက် {accuracy} သို့ မရောက်ရှိသေးသော အချိုးအားဖြင့် အမှား {error} တွင် ရပ်တန့်သွားသည်။';
$ec_lang['lpn_field_roughness']='ကြမ်းတမ်းမှု';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Hazen-Williams C။ ဂဏန်းမြင့်လေ ပိုက်ချောမွေ့လေဖြစ်သည် - ပလပ်စတစ်အသစ်အတွက် ခန့်မှန်းခြေ 150၊ သံမဏိ (သို့) သံအသစ်အတွက် 130 နှင့် ပိုက်ဟောင်းအတွက် 100 ခန့်ဖြစ်သည်။';
$ec_lang['lpn_field_length']='အလျား';
$ec_lang['lpn_field_from']='မှ';
$ec_lang['lpn_field_to']='သို့';
$ec_lang['lpn_field_length_tip']='ပိုက်လိုင်း၏ အလျား။ အလိုအလျောက် ဖွင့်ထားလျှင် အလျားကို သင်ရေးဆွဲထားသည့်အတိုင်း တိုင်းတာသည်။ ရေးဆွဲထားသည်နှင့် ကွာခြားသော အလျားကို ရိုက်ထည့်လိုပါက အလိုအလျောက် ကို ပိတ်ပါ။';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='ဗားလ် အမျိုးအစား';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='ဗားလ်က ဘာလုပ်သနည်း။ ညှစ်ဗားလ်က ပုံသေ ဆုံးရှုံးမှုတစ်ခုကို ထိန်းသိမ်းသည်။ ကျန်သုံးမျိုးက ဖိအား (သို့) ရေစီးနှုန်းကို ထိန်းသိမ်းပြီး၊ ရေအခြေအနေပေါ်မူတည်၍ အပြည့်ဖွင့်၊ ပိတ်၊ (သို့) တစ်စိတ်တစ်ပိုင်း ပိတ်လိုက်ကြသည်။ အမျိုးအစား ပြောင်းလိုက်ပါက အောက်ပါ ဆက်တင်တွင် အသစ်စတင် ဂဏန်းတစ်ခု ထည့်ပေးမည်၊ အကြောင်းမှာ ဖိအားသည် ရေစီးနှုန်း မဟုတ်၊ ၎င်းတို့နှစ်ခုစလုံးသည်လည်း ဆုံးရှုံးမှုကိန်း မဟုတ်ကြောင်းဖြစ်သည်။';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='ညှစ်ဗားလ် (TCV)';
$ec_lang['lpn_valve_type_prv']='ဖိအားလျှော့ ဗားလ် (PRV)';
$ec_lang['lpn_valve_type_psv']='ဖိအားထိန်း ဗားလ် (PSV)';
$ec_lang['lpn_valve_type_fcv']='ရေစီးနှုန်းထိန်းချုပ် ဗားလ် (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='ဖိအားချိုးဗားလ် (PBV)';
$ec_lang['lpn_valve_type_gpv']='အထွေထွေအသုံးပြု ဗားလ် (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='ဖိအားကျဆင်းမှု';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='ဗားလ်က ဖယ်ရှားလိုက်သော ဖိအား။ ဖိအားချိုးဗားလ်သည် ရေမည်သို့ပင်စီးနေစေ ဤပမာဏအတိုင်း ဖိအားကို အမြဲတမ်း ဖယ်ရှားသည်။ ၎င်းသည် ဗားလ်ကို ဖြတ်သန်းသော ကျဆင်းမှုဖြစ်ပြီး ထိန်းထားရမည့်ဖိအား မဟုတ်ပါ။';
$ec_lang['lpn_inp_drop_gpv_curve']='ဤဗားလ်သည် ဖိုင်ထဲတွင် မပါရှိသော ဖိမြင့်ဆင့်ဆုံးရှုံးမှု ကွေးမျဉ်းတစ်ခုကို ရည်ညွှန်းနေသည်။ ဗားလ်သည် ကွေးမျဉ်းမပါဘဲ ဝင်လာခဲ့သောကြောင့်၊ သင် ကွေးမျဉ်းတစ်ခု ပေးသည့်အထိ အပြည့်ဖွင့်ထားလိမ့်မည်။';
$ec_lang['lpn_gpv_curve_source']='ဗားလ် ဖိမြင့်ဆင့်ဆုံးရှုံးမှု ကွေးမျဉ်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='ဤဗားလ်သည် စီးဆင်းမှုတစ်ခုစီတွင် မည်မျှ ဖိမြင့်ဆင့် ဆုံးရှုံးသည်ကို ဖော်ပြသော၊ စာရင်းများ ဘောက်စ်ရှိ ကွေးမျဉ်း။ ဗားလ်များစွာသည် တူညီသော ကွေးမျဉ်းကို အသုံးပြုနိုင်ပြီး၊ ထိုနေရာတွင် ၎င်းကို တည်းဖြတ်ခြင်းသည် အားလုံးကို ပြောင်းလဲစေသည်။ ဤဗားလ်သည် ရည်ညွှန်းချက်ကိုသာ ကိုင်ဆောင်ထားပြီး၊ အမှတ်များကိုယ်တိုင်ကို စာရင်းများ၊ ကွေးမျဉ်းများ အောက်တွင် ဖတ်ရှုပြီး တည်းဖြတ်သည်။';
$ec_lang['lpn_field_valve_setting_pressure']='ဖိအား ဆက်တင်';
$ec_lang['lpn_field_valve_setting_pressure_tip']='ဗားလ်က ထိန်းသိမ်းသော ဖိအား။ ဖိအားလျှော့ ဗားလ်က ၎င်း၏ အောက်ရေစီးဘက်ရှိ ဖိအားကို ဤတန်ဖိုး (သို့) ထိုထက် နိမ့်အောင် ထိန်းသိမ်းသည်။ ဖိအားထိန်း ဗားလ်က ၎င်း၏ အထက်ရေစီးဘက်ရှိ ဖိအားကို ဤတန်ဖိုး (သို့) ထိုထက် မြင့်အောင် ထိန်းသိမ်းသည်။';
$ec_lang['lpn_field_valve_setting_flow']='ရေစီးနှုန်း ဆက်တင်';
$ec_lang['lpn_field_valve_setting_flow_tip']='ဗားလ်က ဖြတ်သန်းခွင့်ပြုသော အများဆုံး ရေပမာဏ။ ဤထက်နည်းသော ရေ ဖြတ်သန်းလိုပါက၊ ဗားလ်သည် အပြည့်ဖွင့်ထားပြီး ဆုံးရှုံးမှု မထည့်ပါ။';
$ec_lang['lpn_field_valve_setting']='သတ်မှတ်ချက်';
$ec_lang['lpn_field_valve_setting_loss']='ဆုံးရှုံးမှု ကိန်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='ညှစ်ဗားလ်က ဖယ်ရှားသော ဖိမြင့်ဆင့် ပမာဏ၊ ရေအလျင် ဖိမြင့်ဆင့်၏ အဆများအဖြစ် တွက်ချက်သည်။ ဗားလ် အပြည့်ဖွင့်ထားပါက 0 ကို သုံးပါ။ ဤဂဏန်းတစ်ခုတည်းသည် ညှစ်ဗားလ်၏ ဆုံးရှုံးမှု တစ်ခုလုံးဖြစ်သည်။';
$ec_lang['lpn_field_valve_diameter_tip']='ဗားလ်ထဲက ဖောက်ပေါက်၏ အနံ။ ဗားလ်ကို ဖြတ်သန်းသော ရေ၏ အလျင်ကို ဤအနံမှ တွက်ချက်ပြီး၊ ဆုံးရှုံးမှုကို ထိုအလျင်မှ ဆက်တွက်ချက်သည်။';
$ec_lang['lpn_field_valve_km_tip']='ဗားလ် အပြည့်ဖွင့်ထားစဉ် ဗားလ်ခန္ဓာကိုယ်ကြောင့် ဖြစ်သော ဆုံးရှုံးမှု၊ ဗားလ်ဆက်တင်က ဖယ်ရှားသည့်အပေါ် ထပ်ပေါင်းထည့်သည်။ ၎င်းကို ရေအလျင် ဖိမြင့်ဆင့်၏ အဆများအဖြစ် တွက်ချက်သည်။ လျစ်လျူရှုလိုပါက 0 ကို သုံးပါ။';
$ec_lang['lpn_field_km']='ဒေသဆိုင်ရာ ဆုံးရှုံးမှု ကိန်း၊ k';
$ec_lang['lpn_field_km_tip']='ဤပိုက်လိုင်းပေါ်ရှိ ကွေ့ချိုးမှုများ၊ ဗားလ်များနှင့် ဆက်စပ်ပစ္စည်းများမှ ဆုံးရှုံးမှု၊ ရေအလျင် ဖိမြင့်ဆင့်၏ အဆများအဖြစ် တွက်ချက်သည်။ ဖြောင့်တန်းသော ပိုက်လိုင်း သာမန်တစ်ခုအတွက် 0 ကို သုံးပါ။';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='ဒေသဆိုင်ရာ ဆုံးရှုံးမှု၊ k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='ရေတင်စက် ဖိမြင့်ဆင့် ကွေးမျဉ်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='ဤရေတင်စက်သည် စီးဆင်းမှုတစ်ခုစီတွင် မည်မျှ ဖိမြင့်ဆင့် ထပ်ပေါင်းသည်ကို ဖော်ပြသော၊ စာရင်းများ ဘောက်စ်ရှိ ကွေးမျဉ်း။ ရေတင်စက်များစွာသည် တူညီသော ကွေးမျဉ်းကို အသုံးပြုနိုင်ပြီး၊ ထိုနေရာတွင် ၎င်းကို တည်းဖြတ်ခြင်းသည် အားလုံးကို ပြောင်းလဲစေသည်။ ဤရေတင်စက်သည် ရည်ညွှန်းချက်ကိုသာ ကိုင်ဆောင်ထားပြီး၊ အမှတ်များကိုယ်တိုင်ကို စာရင်းများ၊ ကွေးမျဉ်းများ အောက်တွင် ဖတ်ရှုပြီး တည်းဖြတ်သည်။';
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
$ec_lang['lpn_field_desc']='ဖော်ပြချက်';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='လမ်းထောင့် (သို့) ပိုက်ပြုလုပ်ထားသော ပစ္စည်း ကဲ့သို့၊ သင့်ကိုယ်ပိုင်အသုံးပြုမှုအတွက်။ ၎င်းကို EPANET ဖိုင်ထဲသို့ သယ်ဆောင်သွင်းယူပြီး ထုတ်ယူသည်၊ ၎င်းသည် ထိုအပိုင်း၏ ကိုယ်ပိုင်အတန်း၏ အဆုံးတွင် ထားရှိသည်။ မည်သည့် တွက်ချက်မှုမျှ ၎င်းကို မဖတ်ပါ။ စာကြောင်းချိုးခြင်းသည် ကွက်လပ်တစ်ခု ဖြစ်လာသည်၊ ဖိုင်တွင် ၎င်းကို ထားရန်နေရာ မရှိသောကြောင့်ဖြစ်သည်။';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='တဂ်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Tag သည် ဖိအားဇုန် (သို့) အလုပ်အမိန့်စာ ကဲ့သို့ သင်လိုသလို မည်သည့်အဓိပ္ပါယ်မဆို ဆောင်နိုင်သည်။ ဤနေရာ (သို့) EPANET ရှိ မည်သည့် တွက်ချက်မှုမျှ ၎င်းကို မဖတ်ပါ။ Tag သည် စကားလုံးတစ်လုံးသာ ဖြစ်ရမည် - EPANET သည် ကွက်လပ်ပထမဆုံးတွင် ဖတ်ရှုမှု ရပ်တန့်သောကြောင့်၊ သင်ရိုက်နေစဉ် ကွက်လပ်ကို ငြင်းပယ်မည်။ ၎င်းကို EPANET ဖိုင်ထဲသို့ သယ်ဆောင်ပြီး ထုတ်ဆောင်သည်။';
$ec_lang['lpn_pump_effic_curve']='ရေတင်စက် ထိရောက်မှု ကွေးမျဉ်း';
$ec_lang['lpn_pump_effic_curve_tip']='ဤရေတင်စက်သည် စီးဆင်းမှုတစ်ခုစီတွင် မည်မျှ ထိရောက်သည်ကို ဖော်ပြသော၊ စာရင်းများ ဘောက်စ်ရှိ ကွေးမျဉ်း။ ရေတင်စက်များစွာသည် တူညီသော ကွေးမျဉ်းကို အသုံးပြုနိုင်ပြီး၊ ထိုနေရာတွင် ၎င်းကို တည်းဖြတ်ခြင်းသည် အားလုံးကို ပြောင်းလဲစေသည်။ ဤရေတင်စက်သည် ရည်ညွှန်းချက်ကိုသာ ကိုင်ဆောင်ထားပြီး၊ အမှတ်များကိုယ်တိုင်ကို စာရင်းများ၊ ကွေးမျဉ်းများ အောက်တွင် ဖတ်ရှုပြီး တည်းဖြတ်သည်။';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='ကွေးမျဉ်း မရွေးထားပါ';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='ကွေးမျဉ်းများ';
$ec_lang['lpn_curve_library_link_tip']='ကွေးမျဉ်းတစ်ခုကို ထည့်ခြင်း၊ ဖော်ပြခြင်း၊ တည်းဖြတ်ခြင်းနှင့် ဖျက်ခြင်း ပြုလုပ်ရာ၊ စာရင်းများ ဘောက်စ်ကို ၎င်း၏ ကွေးမျဉ်းများ အပိုင်းတွင် ဖွင့်ပေးသည်။ အစိတ်အပိုင်းတစ်ခုသည် ၎င်းအသုံးပြုနေသော ကွေးမျဉ်းကို ဖော်ပြသည်။';
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
$ec_lang['lpn_curve_kind_head']='ရေတင်စက် ဖိမြင့်ဆင့်';
$ec_lang['lpn_curve_kind_effic']='ရေတင်စက် ထိရောက်မှု';
$ec_lang['lpn_curve_kind_volume']='ရေတိုက် ပမာဏ';
$ec_lang['lpn_curve_kind_headloss']='ဗားလ် ဖိမြင့်ဆင့်ဆုံးရှုံးမှု';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='အမျိုးအစား မဖော်ပြထားပါ';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='ပမာဏ';
$ec_lang['lpn_pump_effic_col']='ထိရောက်မှု';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='ဤရေတင်စက်တွင် ထိရောက်မှု ကွေးမျဉ်း ရွေးမထားသောကြောင့်၊ ၎င်းသည် ကွန်ရက်တစ်ခုလုံးအတွက် သတ်မှတ်ထားသော ထိရောက်မှု {percent} ဖြင့် လည်ပတ်သည်။';
$ec_lang['lpn_pump_effic_unstated']='ဤရေတင်စက်သည် {name} ဟု ခေါ်သော ထိရောက်မှု ကွေးမျဉ်းတစ်ခုကို ရည်ညွှန်းနေသော်လည်း၊ ဤပရောဂျက်တွင် ၎င်းကို အဓိပ္ပါယ်ဖွင့်ဆိုထားခြင်း မရှိသောကြောင့်၊ ကွန်ရက်တစ်ခုလုံးအတွက် သတ်မှတ်ထားသော ထိရောက်မှု {percent} ဖြင့် လည်ပတ်သည်။';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='မုဒ် - ရွေးချယ်ရန်။ အစိတ်အပိုင်းတစ်ခု (သို့) အညွှန်းတစ်ခုကို ကြည့်ရန် (သို့) ပြောင်းလဲရန် နှိပ်ပါ။ ဆက်စပ်နေရာ၊ အကွေ့မှတ် (သို့) အညွှန်းတစ်ခုကို ရွှေ့ရန် ဖိဆွဲပါ။ ပိုက်လိုင်းတစ်ခု၏ အကွေ့များကို ထည့်ရန် (သို့) ဖယ်ရှားရန် အကွေ့မှတ်များ ကိရိယာကို သုံးပါ။';
$ec_lang['lpn_mode_delete']='မုဒ် - ဖျက်ရန်။ အစိတ်အပိုင်းတစ်ခုကို ဖယ်ရှားရန် နှိပ်ပါ။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='မုဒ် - အကွေ့မှတ်များ။ ပိုက်လိုင်းတိုင်း၏ အကွေ့မှတ်များကို လေးထောင့်ပုံ သေးငယ်သော လက်ကိုင်များအဖြစ် ပြထားသည်။ အကွေ့မှတ်တစ်ခု ထည့်ရန် ပိုက်လိုင်းကို နှိပ်ပါ၊ ဖယ်ရှားရန် လက်ကိုင်ကို နှိပ်ပါ၊ (သို့) ရွှေ့ရန် လက်ကိုင်ကို ဖိဆွဲပါ။ ဤမုဒ်တွင် မြေပုံပေါ်ရှိ အခြားအရာ မည်သည်မျှ မပြောင်းလဲပါ။';
$ec_lang['lpn_mode_zoom_window']='မုဒ် - ဇူးမ် ဘောင်။ မြေပုံပေါ်တွင် ဘောင်တစ်ခု၏ ဆန့်ကျင်ဘက် ထောင့်နှစ်ခုကို နှိပ်ပါ၊ (သို့) တစ်ခုကို ဖိဆွဲပါ၊ ၎င်းအပေါ်ကို ဇူးမ်ချဲ့ရန်။';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='မည်သည်ကိုမျှ မရွေးထားပါ။ မြေပုံပေါ်ရှိ အစိတ်အပိုင်းတစ်ခုကို ဦးစွာ နှိပ်ပြီးမှ Delete ကို နှိပ်ပါ။';
$ec_lang['lpn_mode_add_junction']='မုဒ် - ဆက်စပ်နေရာ ထည့်ရန်။ ဆက်စပ်နေရာတစ်ခု ထားရန် မြေပုံကို နှိပ်ပါ။ အစိတ်အပိုင်းများနှင့် အညွှန်းများကို ပြောင်းလဲရန် (သို့) ရွှေ့ရန် ရွေးချယ်ရန် မုဒ်သို့ ပြောင်းပါ။';
$ec_lang['lpn_mode_add_reservoir']='မုဒ် - ရေကန် ထည့်ရန်။ ရေကန်တစ်ခု ထားရန် မြေပုံကို နှိပ်ပါ။ အစိတ်အပိုင်းများနှင့် အညွှန်းများကို ပြောင်းလဲရန် (သို့) ရွှေ့ရန် ရွေးချယ်ရန် မုဒ်သို့ ပြောင်းပါ။';
$ec_lang['lpn_mode_add_tank']='မုဒ် - ရေတိုက် ထည့်ရန်။ ရေတိုက်တစ်ခု ထားရန် မြေပုံကို နှိပ်ပါ။ အစိတ်အပိုင်းများနှင့် အညွှန်းများကို ပြောင်းလဲရန် (သို့) ရွှေ့ရန် ရွေးချယ်ရန် မုဒ်သို့ ပြောင်းပါ။';
$ec_lang['lpn_mode_add_pipe']='မုဒ် - ပိုက်လိုင်း ထည့်ရန်။ ဆက်စပ်နေရာတစ်ခုကို နှိပ်ပြီး၊ ၎င်းတို့ကို ဆက်သွယ်ရန် နောက်ဆက်စပ်နေရာတစ်ခုကို နှိပ်ပါ။ မျဉ်းကို အကွေ့ခံရန် ကြားရှိ ကွက်လပ်နေရာကို နှိပ်ပါ၊ (သို့) အစကနေ ပြန်စရန် Esc ကို နှိပ်ပါ။ အစိတ်အပိုင်းများနှင့် အညွှန်းများကို ပြောင်းလဲရန် (သို့) ရွှေ့ရန် ရွေးချယ်ရန် မုဒ်သို့ ပြောင်းပါ။';
$ec_lang['lpn_mode_add_pump']='မုဒ် - ရေတင်စက် ထည့်ရန်။ ဆက်စပ်နေရာတစ်ခုကို နှိပ်ပြီး၊ ၎င်းတို့ကို ဆက်သွယ်ရန် နောက်ဆက်စပ်နေရာတစ်ခုကို နှိပ်ပါ။ မျဉ်းကို အကွေ့ခံရန် ကြားရှိ ကွက်လပ်နေရာကို နှိပ်ပါ၊ (သို့) အစကနေ ပြန်စရန် Esc ကို နှိပ်ပါ။ အစိတ်အပိုင်းများနှင့် အညွှန်းများကို ပြောင်းလဲရန် (သို့) ရွှေ့ရန် ရွေးချယ်ရန် မုဒ်သို့ ပြောင်းပါ။';
$ec_lang['lpn_mode_add_valve']='မုဒ် - ဗားလ် ထည့်ရန်။ ဆက်စပ်နေရာတစ်ခုကို နှိပ်ပြီး၊ ၎င်းတို့ကို ဆက်သွယ်ရန် နောက်ဆက်စပ်နေရာတစ်ခုကို နှိပ်ပါ။ မျဉ်းကို အကွေ့ခံရန် ကြားရှိ ကွက်လပ်နေရာကို နှိပ်ပါ၊ (သို့) အစကနေ ပြန်စရန် Esc ကို နှိပ်ပါ။ အစိတ်အပိုင်းများနှင့် အညွှန်းများကို ပြောင်းလဲရန် (သို့) ရွှေ့ရန် ရွေးချယ်ရန် မုဒ်သို့ ပြောင်းပါ။';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='မုဒ် - စာသား ထည့်ရန်။ စာသားတစ်ခု ထားရန် မြေပုံကို နှိပ်ပါ။ စာသားကို ဆက်စပ်နေရာတစ်ခုနှင့် ချိတ်ရန် ထိုဆက်စပ်နေရာအနီးကို နှိပ်ပါ။ အစိတ်အပိုင်းများနှင့် အညွှန်းများကို ပြောင်းလဲရန် (သို့) ရွှေ့ရန် ရွေးချယ်ရန် မုဒ်သို့ ပြောင်းပါ။';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='မြေပုံပေါ်ရှိ အရာများကို ပြောင်းလဲရန်၊ ရွှေ့ရန်နှင့် ဆွဲရန် ဤမုဒ်ကို သုံးပါ။ ဤသည်မှာ စာမျက်နှာ ပုံမှန်အားဖြင့် ပြန်ရောက်လာသော မုဒ် ဖြစ်သည် - ပရောဂျက်တစ်ခု ဖွင့်ခြင်းကဲ့သို့သော လုပ်ဆောင်ချက်အချို့ ပြီးနောက် ၎င်းသည် ဤနေရာသို့ အလိုအလျောက် ပြန်ရောက်လာပြီး၊ [Esc] က အခြားမုဒ်မှမဆို သင့်ကို ဤနေရာသို့ ပြန်ခေါ်ဆောင်လာသည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='အညွှန်းတစ်ခုကို ရွှေ့ရန် ဖိဆွဲနိုင်ပါသည်။ ၎င်း၏ အလိုအလျောက်တည်နေရာသို့ ပြန်ပို့ရန် အညွှန်းကို နှစ်ချက်နှိပ်ပါ။';
$ec_lang['lpn_field_auto']='အလိုအလျောက်';
$ec_lang['lpn_method_switch_confirm']='ပွတ်တိုက်မှု နည်းလမ်း ပြောင်းလိုက်ခြင်းသည် သင့်ပိုက်လိုင်းများတွင် ရှိပြီးသား ကြမ်းတမ်းမှု ဂဏန်းများကို မပြောင်းလဲပါ၊ တစ်နည်းလမ်း၏ ကြမ်းတမ်းမှုသည် နောက်နည်းလမ်းတစ်ခုအတွက် အဓိပ္ပာယ်မရှိပါ။ ဤသို့ ပြောင်းပြီးနောက် ပိုက်လိုင်းတိုင်းကို စစ်ဆေးပါ။ မည်သို့ပင်ဖြစ်စေ ပြောင်းမလား။';
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
$ec_lang['lpn_field_closed']='ပိတ်';
$ec_lang['lpn_field_closed_tip']='ဤပိုက်လိုင်းကို ရေမဖြတ်သန်းနိုင်အောင် ပိတ်ပါ။ ပိုက်လိုင်းသည် မြေပုံပေါ်တွင် ဆက်ရှိနေမည်ဖြစ်ပြီး ၎င်း၏ဂဏန်းများ အားလုံးကို ဆက်ထိန်းသိမ်းထားမည်ဖြစ်ကာ၊ အချိန်မရွေး ပြန်ဖွင့်နိုင်ပါသည်။';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='လောင်ဂျီတွဒ်';
$ec_lang['lpn_field_lat']='လတ်တီကျုဒ်';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='မြောက်ဘက် ကိုဩဒိနိတ်';
$ec_lang['lpn_field_easting']='အရှေ့ဘက် ကိုဩဒိနိတ်';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='N';
$ec_lang['lpn_field_easting_abbr']='E';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Lat';
$ec_lang['lpn_field_lon_abbr']='Lon';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='ဤဆက်စပ်နေရာကို အတိအကျ ချထားရန် ကိုဩဒိနိတ် တည်နေရာတစ်ခု ရိုက်ထည့်ပါ။ အခြေအနေတစ်ခုအတွင်းတွင် ဤတည်နေရာသည် ထိုအခြေအနေတွင်သာ သက်ရောက်သည်၊ ဖိဆွဲခြင်းကဲ့သို့ပင်; Base တွင် ၎င်းသည် ဆက်စပ်နေရာကို နေရာတိုင်းတွင် ချထားသည်။';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='၎င်းသည် မြေပုံပြင်ပ ဖြစ်နေသည်။ Pseudo Mercator လတ္တီတွဒ်သည် -85.05 မှ 85.05 အတွင်းနှင့် လောင်ဂျီတွဒ်သည် -180 မှ 180 အတွင်း ရှိသည်။';
$ec_lang['lpn_field_text_size']='အရွယ်အစား အဆများကိန်း';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='ဇူးမ် အဆင့်တိုင်းတွင် ပြရန်';
$ec_lang['lpn_field_text_all_zoom_tip']='ဤစာသားကို မည်မျှပင် ဇူးမ်လျှော့ချသည်ဖြစ်စေ ပုံပေါ်တွင် ဆက်ထားရန်။ အမှန်ခြစ်ကို ဖြုတ်ပါက၊ ကြည့်ရှုမှု (view) သည် “မြေပုံနှင့် စာမျက်နှာ” အောက်ရှိ သတ်မှတ်ထားသော အညွှန်းပြသမှု အနိမ့်ဆုံးအကွာအဝေးထက် ကျယ်လာသည်နှင့်တစ်ပြိုင်နက် ဤစာသားသည် အခြားအညွှန်းများနှင့်အတူ ပျောက်သွားမည်။';
$ec_lang['lpn_tool_labels']='အညွှန်းများ';
$ec_lang['lpn_labels_heading_node']='နေရာ အညွှန်းများ';
$ec_lang['lpn_labels_heading_link']='ဆက်သွယ်မှု အညွှန်းများ';
$ec_lang['lpn_labels_decimals_tip']='ဤအညွှန်းအတွက် ပြသသည့် ဒဿမနေရာများ';
$ec_lang['lpn_labels_mark_extrema']='အမြင့်ဆုံးနှင့် အနိမ့်ဆုံး တန်ဖိုးများကို အမှတ်အသားပြုရန်';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='မြေပုံပေါ်ရှိ အညွှန်းတပ်ထားသော ဂုဏ်သတ္တိတစ်ခုစီ၏ အမြင့်ဆုံးတန်ဖိုးကို အပေါ်တွင် မျဉ်းတစ်ကြောင်း (overline) ဖြင့်လည်းကောင်း၊ အနိမ့်ဆုံးတန်ဖိုးကို အောက်တွင် မျဉ်းတစ်ကြောင်း (underline) ဖြင့်လည်းကောင်း အမှတ်အသားပြုသည်။';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='အားလုံးအပေါ် အသုံးချရန်';
$ec_lang['lpn_settings_apply_to_all_tip']='ဤအမျိုးအစား ရှိပြီးသား ဆွဲထားသော အစိတ်အပိုင်းတိုင်းသည် ဤစာသားဖြင့် အစပြုသော ID တစ်ခု ရရှိပါလိမ့်မည်။ တစ်ခုစီသည် ၎င်း၏ နံပါတ်ကို ဆက်ထိန်းထားပါလိမ့်မည်။ ဂဏန်းနှင့် မဆုံးသော ID ကို မထိခိုက်ပါ။';
$ec_lang['lpn_confirm_apply_prefix']='အစိတ်အပိုင်း {n} ခု၏ ID များကို {prefix} ဖြင့် အစပြုစေရန် အမည်ပြန်ပေးမလား? တစ်ခုစီသည် ၎င်း၏ နံပါတ်ကို ဆက်ထိန်းထားပါလိမ့်မည်။';
$ec_lang['lpn_prefix_applied']='အစိတ်အပိုင်း {n} ခု အမည်ပြန်ပေးပြီးပါပြီ။ အခြား {skipped} ခုကို မထိခိုက်ခဲ့ပါ။';
$ec_lang['lpn_labels_prefix_tip']='မြေပုံအညွှန်းများပေါ်တွင် ဤဂုဏ်သတ္တိရှေ့မှောက် ထည့်သွင်းသော စာသား';
$ec_lang['lpn_labels_suffix_tip']='မြေပုံအညွှန်းများပေါ်တွင် ဤဂုဏ်သတ္တိနောက်တွင် ထည့်သွင်းသော စာသား';
$ec_lang['lpn_labels_suffix_gradient_tip']='မြေပုံအညွှန်းများပေါ်တွင် ဖိမြင့်ဆင့်ဆုံးရှုံးမှု အစောက်နောက်တွင် ထည့်သွင်းသော စာသား။ ဤနေရာတွင် ရာခိုင်နှုန်းသင်္ကေတကို မရိုက်ထည့်ပါနှင့်။ ယူနစ်သည် ရာခိုင်နှုန်းဖြစ်ပါက သင့်အတွက် အလိုအလျောက် ထည့်ပေးပါလိမ့်မည်။';
$ec_lang['lpn_labels_separator']='တန်ဖိုးများကြား စာသား';
$ec_lang['lpn_labels_separator_tip']='အညွှန်းတစ်ခုပေါ်ရှိ တန်ဖိုးတစ်ခုနှင့် နောက်တစ်ခုကြား စာသား။ မူလအားဖြင့် ကွက်လပ်တစ်ခု။';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='ဦးစားပေးအစီအစဉ်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='အညွှန်းတစ်ခု မကိုက်ညီသောအခါ တန်ဖိုးများ ချန်ချရာ အစီအစဉ်။ 1 ကို အကြာဆုံး ထားရှိသည်။';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='ဆက်စပ်နေရာအညွှန်း နှစ်ခု ထပ်နေမည်ဆိုလျှင် တန်ဖိုးများကို ချန်ထားမည့် အစီအစဉ်။ 1 နံပါတ်ပေးထားသော တန်ဖိုးကို ဦးစွာ ချန်ထားသည်။ တန်ဖိုးတစ်ခုသာ ကျန်ပြီး အညွှန်းများ ဆက်ထပ်နေသေးလျှင်၊ အညွှန်းတစ်ခုလုံးကို ဖျောက်ထားမည် - အနိမ့်ဆုံးလိုအပ်ချက်ရှိသော၊ အတိုင်းအတာအလယ်နှင့် ပိုနီးသော ဖိအားရှိသော၊ (သို့) အနီးနားဆက်စပ်နေရာများ၏ တန်ဖိုးနှင့် ပိုတူသော အမြင့် (သို့) ဖိမြင့်ဆင့်ရှိသော အညွှန်း။';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='ရှေ့';
$ec_lang['lpn_labels_col_after']='နောက်';
$ec_lang['lpn_labels_col_decimals']='ဒဿမ';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='ပြရန်';
$ec_lang['lpn_labels_show_tip']='အညွှန်းပေါ်တွင် တန်ဖိုးများ ပေါ်လာသည့် အစီအစဉ်။ နံပါတ် 1 ရသော တန်ဖိုးသည် ပထမဆုံး လာသည် - အထပ်ခွဲအညွှန်း၏ ထိပ်ဆုံးတွင်၊ တစ်ကြောင်းတည်းအညွှန်း၏ အစတွင်။';
$ec_lang['lpn_labels_priority_customer_tip']='ဖောက်သည်အညွှန်းမှ တန်ဖိုးများ ချန်ထားသည့် အစီအစဉ်။ နံပါတ် 1 ရသော တန်ဖိုးကို ပထမဆုံး ချန်ထားသည်။';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='ယူနစ် သုံးရန်';
$ec_lang['lpn_labels_use_units_tip']='“နောက်” ဘောက်စ်နှင့် အညွှန်းပေါ်တွင် ယူနစ်ကို ပြရန်နှင့် ယူနစ်များ ပြောင်းလဲသောအခါ ၎င်းနှင့်အတူ လိုက်ပြောင်းစေရန် အမှန်ခြစ်ခြစ်ပါ။ သင့်ကိုယ်ပိုင် “နောက်” စာသားကို ရိုက်ထည့်လိုပါက အမှန်ခြစ် ဖြုတ်ပါ။';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='အစပြု အခြေအနေ';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='အမှတ် အရောင်များ';
$ec_lang['lpn_settings_sym_link_colors']='မျဉ်း အရောင်များ';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='နောက်ခံပုံ…';
$ec_lang['lpn_backdrop_add']='ထည့်ရန်';
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
$ec_lang['lpn_backdrop_scale']='ရွေးချယ်၍ အတိုင်းအတာ သတ်မှတ်ရန်';
$ec_lang['lpn_backdrop_scale_entry']='ပုံနေရာသတ်မှတ်ဖိုင် (သို့) မြေပုံပေါ်ရှိ ပစ်ဆယ်တစ်ခု၏ အရွယ်အစားဖြင့် အတိုင်းအတာ သတ်မှတ်ရန်';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='လက်ရှိအရွယ်အစားမှ၊ သင်ရွေးချယ်သော အမှတ်တစ်ခုပတ်လည် အတိုင်းအတာ ပြောင်းရန်';
$ec_lang['lpn_backdrop_scale_from_prompt1']='မရွေ့သင့်သော အမှတ်ကို နောက်ခံပုံပေါ်တွင် နှိပ်ပါ။';
$ec_lang['lpn_backdrop_scale_from_prompt2']='၎င်း၏ လက်ရှိအရွယ်အစားမှ အတိုင်းအတာ ပြောင်းပါ။ 1 က အတိုင်းထားမည်၊ 1.1 က 10% ပိုကြီးစေမည်၊ 0.9 က 10% ပိုသေးစေမည်။';
$ec_lang['lpn_backdrop_scale_entry_prompt']='မြေပုံပေါ်ရှိ ပစ်ဆယ်တစ်ခု၏ အရွယ်အစားကို ရိုက်ထည့်ပါ၊ (သို့) ပုံအတွက် ပုံနေရာသတ်မှတ်ဖိုင်၏ အကြောင်းအရာအပြည့်အစုံကို ကူးထည့်ပါ';
$ec_lang['lpn_backdrop_scale_entry_bad']='မြေပုံပေါ်ရှိ ပစ်ဆယ်တစ်ခု၏ အရွယ်အစားအတွက် ဂဏန်းတစ်လုံးကို ရိုက်ထည့်ပါ၊ (သို့) ပုံနေရာသတ်မှတ်ဖိုင်၏ လိုင်းခြောက်လုံးလုံးကို ကူးထည့်ပါ။';
$ec_lang['lpn_backdrop_wld_bad']='ဤပုံနေရာသတ်မှတ်ဖိုင်သည် ပုံကို လှည့်စေခြင်း၊ ပြောင်းပြန်ထင်ဟပ်စေခြင်း (သို့) ဒေါင်လိုက်၊ အလျားလိုက် မတူညီစွာ ဆန့်တန်းစေခြင်းများ ပြုလုပ်ပါသည်။ မြေပုံသည် ပုံတစ်ခုကို ရွှေ့ခြင်းနှင့် လမ်းကြောင်းနှစ်ခုစလုံးတွင် အချိုးတူ အရွယ်အစားပြောင်းခြင်းကိုသာ ပြုလုပ်နိုင်သောကြောင့်၊ ဤဖိုင်ကို အသုံးမပြုခဲ့ပါ။';
$ec_lang['lpn_backdrop_unreadable']='ဤပုံကို သင့်ဘရောက်ဇာက ပြသနိုင်ခြင်း မရှိပါ။ ပုံကို PNG သို့မဟုတ် JPEG အဖြစ် သိမ်းပြီး ထပ်မံထည့်သွင်းပါ။';
$ec_lang['lpn_backdrop_position']='ရွှေ့ရန်';
$ec_lang['lpn_backdrop_remove']='ဖယ်ရှားရန်';
$ec_lang['lpn_backdrop_remove_confirm']='နောက်ခံပုံကို ဖယ်ရှားမလား။';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='ကမ္ဘာ့မြေပုံ…';
$ec_lang['lpn_map_attach_tip']='ဤပရောဂျက်ကို အခြားနည်းလမ်းဖြင့် မပြောင်းလဲဘဲ ကမ္ဘာ့မြေပုံကို တွဲထည့်ရန်။';
$ec_lang['lpn_map_attach_add']='တွဲထည့်ရန်';
$ec_lang['lpn_map_attach_readjust']='ပြန်လည် ချိန်ညှိရန်';
$ec_lang['lpn_map_attach_readjust_tip']='မြေပုံ တွဲထည့်ခြင်း လုပ်ငန်းစဉ်၏ အဆင့် ၂ သို့ ပြန်သွားရန်။';
$ec_lang['lpn_map_attach_scale_from']='လက်ရှိအရွယ်အစားမှ အတိုင်းအတာချိန်ညှိရန်…';
$ec_lang['lpn_map_attach_scale_from_prompt']='မြေပုံကို ၎င်း၏ လက်ရှိအရွယ်အစားမှ၊ သင့်ပုံ၏ အလယ်ဗဟိုအနီးတွင် အတိုင်းအတာချိန်ညှိပါ။ 1 က တူအောင်ထားပြီး၊ 1.1 က 10% ပိုကြီးအောင် ပြုလုပ်ပြီး၊ 0.9 က 10% ပိုသေးအောင် ပြုလုပ်သည်။';
$ec_lang['lpn_map_attach_scale_from_bad']='သုညထက်ကြီးသော ဂဏန်းတစ်လုံးကို ရိုက်ထည့်ပါ။';
$ec_lang['lpn_map_attach_scale_from_done']='မြေပုံကို အရွယ်အစား ပြန်ချိန်ညှိပြီးပါပြီ၊ သင့်ပုံနှင့် ၎င်းအတွင်းရှိ ကိုဩဒိနိတ်တိုင်းသည် ရှိနေသည့်အတိုင်းပင် ဖြစ်နေသည်။';
$ec_lang['lpn_map_attach_none']='ဤပရောဂျက်တွင် ကမ္ဘာ့မြေပုံ တွဲထည့်ထားခြင်း မရှိသေးပါ။ ဦးစွာ မြေပုံ > ကမ္ဘာ့မြေပုံ > တွဲထည့်ရန် ကို သုံးပါ။';
$ec_lang['lpn_map_attach_remove']='ဖြုတ်ရန်';
$ec_lang['lpn_map_attach_remove_tip']='ကမ္ဘာ့မြေပုံကို ဖယ်ရှားရန်။ ပုံနှင့် ၎င်း၏ ကိုဩဒိနိတ်များကို မည်သို့ပင်ဖြစ်စေ မထိခိုက်ပါ။';
$ec_lang['lpn_map_attach_done']='ကမ္ဘာ့မြေပုံသည် ယခု သင့်ပုံနောက်ကွယ်တွင် ရှိနေပြီး၊ သင့်ပရောဂျက်ကို မပြောင်းလဲထားပါ။ ၎င်းကို ထပ်ဖယ်ရှားလိုပါက မြေပုံ > ကမ္ဘာ့မြေပုံ > ဖြုတ်ရန် ကို သုံးပါ။';
$ec_lang['lpn_map_attach_removed']='ကမ္ဘာ့မြေပုံ ပျောက်သွားပြီး၊ ပုံသည် ရှိနေသည့်အတိုင်းပင် ဖြစ်နေသည်။';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='သင့်ပုံသည် လတ္တီတွဒ် သုညနှင့် လောင်ဂျီတွဒ် သုညရှိ ပင်လယ်ပြင်တွင်၊ ကမ္ဘာတစ်ဝှမ်းလုံး မြေပုံပေါ်၌ ရှိနေသည်။ ဦးစွာ သင့်ကိုယ်ပိုင်နေရာကို ရှာပါ - ပုံနောက်ကွယ်ရှိ မြေပုံကို ရွှေ့ပါ၊ ဇူးမ်လုပ်ပါ၊ နေရာအမည် ရှာပါ (သို့) လတ္တီတွဒ်နှင့် လောင်ဂျီတွဒ် ရိုက်ထည့်ပါ။ ပုံကိုယ်တိုင်ကို မရွှေ့ပါ။';
$ec_lang['lpn_mapgeo_step1']='အဆင့် ၂ ခုအနက် ၁: ကမ္ဘာပေါ်ရှိ သင့်နေရာကို ရှာရန်';
$ec_lang['lpn_mapgeo_step2']='အဆင့် ၂ ခုအနက် ၂: ပုံနောက်ကွယ်ရှိ မြေပုံကို ညီအောင် ချိန်ရန်';
$ec_lang['lpn_mapgeo_hint1']='ပုံနောက်ကွယ်ရှိ မြေပုံကို ရွှေ့ပါ၊ ဇူးမ်လုပ်ပါ၊ (သို့) နေရာတစ်ခု ရှာပါ၊ (သို့) လတ္တီတွဒ်နှင့် လောင်ဂျီတွဒ် ရိုက်ထည့်ပါ။ ထို့နောက် ခန့်မှန်းချထားရန် ကို နှိပ်ပါ။';
$ec_lang['lpn_mapgeo_readjust_intro']='သင့်ပုံသည် နောက်ဆုံး ချထားခဲ့သောနေရာတွင် ရှိနေသည်။ အခြားနေရာသို့ ရွှေ့လိုပါက၊ ပုံနောက်ကွယ်ရှိ မြေပုံကို ရွှေ့ပါ၊ ဇူးမ်လုပ်ပါ၊ နေရာအမည် ရှာပါ (သို့) လတ္တီတွဒ်နှင့် လောင်ဂျီတွဒ် ရိုက်ထည့်ပါ။ ပုံကိုယ်တိုင်ကို မရွှေ့ပါ။';
$ec_lang['lpn_mapgeo_hint2']='မြေပုံကို သင့်ပုံအောက်တွင် ရွှေ့ရန် မည်သည့်နေရာကိုမဆို ဖိဆွဲပါ။ သင့်ပုံနှင့် ၎င်းအတွင်းရှိ ကိုဩဒိနိတ်တိုင်းသည် ရှိနေရာတွင်ပင် ဆက်ရှိနေမည်။ မြေပုံမှန်ကန်လာသောအခါ ဤနေရာတွင် ပထဝီအညွှန်း တပ်ရန် ကို နှိပ်ပါ။';
$ec_lang['lpn_mapgeo_gestures']='ဇူးမ်လုပ်ခြင်းက သင့်ပုံနှင့် မြေပုံကို အတူတကွ ရွှေ့ပေးသောကြောင့်၊ ၎င်းတို့ မည်မျှညီညွတ်သည်ကို သင်မြင်နိုင်သည်။ ဖိဆွဲခြင်းက မြေပုံကိုသာ ရွှေ့သည်။';
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
$ec_lang['lpn_mapgeo_dial_turn']='မြေပုံကို လှည့်ရန်';
$ec_lang['lpn_mapgeo_dial_turn_read']='ဒီဂရီ {d}';
$ec_lang['lpn_mapgeo_dial_size']='မြေပုံ အရွယ်အစား';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} ဆ';
$ec_lang['lpn_mapgeo_dial_help']='မြေပုံကို ကြီးအောင် (သို့) သေးအောင် ပြုလုပ်ရန်နှင့် လှည့်ရန်၊ ဘား နှစ်ခုကို ဆွဲပါ (သို့) ၎င်းတို့အပေါ်ရှိ ဘောက်စ်များတွင် ရိုက်ထည့်ပါ။ ဘားတစ်ခုစီ၏ အလယ်သည် အဆင့် ၁ က ချန်ထားခဲ့သော ညီအောင်ချိန်ခြင်းဖြစ်၍၊ 1 နှင့် 0 က မပြောင်းလဲပါနှင့်ဟု ဆိုလိုသည်။ မြှားခလုတ်များ နှစ်ခုစလုံးတွင် အလုပ်လုပ်သည်။';
$ec_lang['lpn_mapgeo_place']='ခန့်မှန်းချထားရန်';
$ec_lang['lpn_mapgeo_finish']='ဤနေရာတွင် ပထဝီအညွှန်း တပ်ရန်';
$ec_lang['lpn_mapgeo_cancelled']='ကမ္ဘာ့မြေပုံသည် ယခင်ရှိနေရာသို့ ပြန်ရောက်သွားပြီး၊ သင့်ပုံကို လုံးဝ မရွှေ့ခဲ့ပါ။';
$ec_lang['lpn_mapgeo_locked']='ပရောဂျက် ပြောင်းခြင်း (သို့) သိမ်းဆည်းခြင်း မပြုလုပ်မီ ဤနေရာတွင် ပထဝီအညွှန်း တပ်ရန် ခလုတ်ဖြင့် ပြီးဆုံးအောင်လုပ်ပါ၊ (သို့) ပယ်ဖျက်ရန် ကို နှိပ်ပါ။ ကမ္ဘာ့မြေပုံကို ချထားနေဆဲ ဖြစ်သည်။';
$ec_lang['lpn_backdrop_scale_prompt1']='အတိုင်းအတာတန်း၏ အစွန်းနှစ်ဖက်ကဲ့သို့သော အမှတ်နှစ်ခုကို နောက်ခံပုံပေါ်တွင် နှိပ်ပါ။ ထို့နောက် ၎င်းတို့အကြား အမှန်တကယ် အကွာအဝေးကို ရိုက်ထည့်ပါ။';
$ec_lang['lpn_backdrop_scale_prompt2']='အမှတ်နှစ်ခုအကြား အမှန်တကယ် အကွာအဝေး';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='ရွှေ့မှုအတွက် အခြေခံအမှတ် (ပုံပေါ်ရှိ) ကို နှိပ်ပါ။';
$ec_lang['lpn_backdrop_position_prompt2']='ဦးတည်ရာအမှတ်အတွက် နည်းလမ်းကို ရွေးချယ်ပြီး၊ ဆက်လုပ်ရန် ကို နှိပ်ပါ။';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='နောက်ခံပုံကို ချိန်ညှိနေသည်။';
$ec_lang['lpn_backdrop_target_label']='ထိုအမှတ်ကို ရွှေ့ရန် -';
$ec_lang['lpn_backdrop_target_node']='နေရာတစ်ခု';
$ec_lang['lpn_backdrop_target_free']='မြေပုံပေါ်ရှိ မည်သည့်အမှတ်မဆို';
$ec_lang['lpn_backdrop_target_coords']='သင်ရိုက်ထည့်သော ကိုဩဒိနိတ်များ';
$ec_lang['lpn_backdrop_coords_prompt']='ထိုအမှတ် ရွှေ့ရမည့် X,Y ကို ရိုက်ထည့်ပါ';
$ec_lang['lpn_backdrop_continue']='ဆက်လုပ်ရန်';
$ec_lang['lpn_tool_settings']='ဆက်တင်များ';
$ec_lang['lpn_settings_show_titles']='စာမျက်နှာ ခေါင်းစဉ်များ ပြရန်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='စာမျက်နှာ ခေါင်းစဉ်နှင့် ပုံရေးဆွဲရာနေရာအထက်ရှိ ကြိုဆိုစာကြောင်းကို ဖျောက်ထားပြီး၊ အလုပ်လုပ်ရန် မြေပုံအတွက် နေရာပိုရရှိစေသည်။ ပုံနှိပ်ခြင်းတွင် သန့်ရှင်းသော မြေပုံမှလွဲ၍ အခြားမည်သည့်အရာကိုမျှ အမြဲ မပြပါ။';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='ဤခေါင်းစဉ်များကို ဖျောက်ရန်';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='ရွေးချယ်မှု အကူအညီကို ပြရန်';
$ec_lang['lpn_settings_area_hint_tip']='ဧရိယာတစ်ခု ရွေးချယ်နေစဉ် သင့်နောက်နှိပ်မှုက မည်သို့ ပြုလုပ်မည်ကို ပြောပြသော ပူဖောင်းကို မြေပုံအပေါ်တွင် ပြသည်။';
$ec_lang['lpn_settings_id_prefixes']='ID ရှေ့ဆက်များ';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='ဖန်တီးစဉ် တန်ဖိုးများ';
$ec_lang['lpn_settings_defaults_note']='ယခုမှစ၍ သင်ဖန်တီးမည့် အစိတ်အပိုင်းများအတွက် အသုံးပြုသည်။ ရှိပြီးသား အစိတ်အပိုင်းများကို မပြောင်းလဲပါ။';
$ec_lang['lpn_settings_push_note']='ယခုအညွှန်းပြထားသော ဂုဏ်သတ္တိများကိုသာ အသုံးချမည်။';
$ec_lang['lpn_settings_push_btn']='ဤ အစိတ်အပိုင်းအသစ် တန်ဖိုးများကို ရှိပြီးသား အစိတ်အပိုင်း အားလုံးအပေါ် အသုံးချရန်';
$ec_lang['lpn_push_confirm']='ရှိပြီးသား အစိတ်အပိုင်း အားလုံးပေါ်ရှိ ဤဂုဏ်သတ္တိများကို အစိတ်အပိုင်းအသစ်များအတွက် ယခုသတ်မှတ်ထားသော တန်ဖိုးများနှင့် အစားထိုးမလား? သင်ရိုက်ထည့်ခဲ့သော တန်ဖိုးများကို အစားထိုးပါလိမ့်မည်။ ဤအရာကို နောက်ပြန်ဆွဲနိုင်သည်။';
$ec_lang['lpn_push_properties']='ဂုဏ်သတ္တိများ -';
$ec_lang['lpn_push_assets']='နေရာများနှင့် ပိုက်လိုင်းများ -';
$ec_lang['lpn_push_none_displayed']='ယခု အစပြုတန်ဖိုး တစ်ခုမျှ အညွှန်းအဖြစ် ပြသနေခြင်း မရှိသောကြောင့်၊ အသုံးချစရာ တစ်ခုမျှ မရှိပါ။ အညွှန်းများ ပြားတွင် သင်လိုချင်သော ဂုဏ်သတ္တိများ၏ အညွှန်းများကို ဖွင့်ပြီး ထပ်ကြိုးစားပါ။';
$ec_lang['lpn_push_nothing']='အသုံးချနေသော ဂုဏ်သတ္တိများထဲမှ မည်သည့်တစ်ခုမျှ ရှိပြီးသား အစိတ်အပိုင်း မည်သည့်တစ်ခုတွင်မျှ မရှိပါ။';
$ec_lang['lpn_push_no_change']='အစိတ်အပိုင်း အားလုံးတွင် ဤတန်ဖိုးများ ရှိပြီးသားဖြစ်၍ မည်သည့်အရာမျှ ပြောင်းလဲမည် မဟုတ်ပါ။';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='စိတ်ကြိုက် ဂုဏ်သတ္တိများ';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='သင့်ကိုယ်ပိုင် ရည်ရွယ်ချက်များအတွက် သင့်ဘာသာ သတ်မှတ်ထားသော ဂုဏ်သတ္တိများ။ ၎င်းတို့ကို အခြားဂုဏ်သတ္တိများအားလုံးကဲ့သို့ ပရောဂျက်နှင့် အခြေအနေများနှင့်အတူ သိမ်းဆည်းထားသည်။';
$ec_lang['lpn_cp_design']='ဒီဇိုင်း';
$ec_lang['lpn_cp_design_tip']='စိတ်ကြိုက် ဂုဏ်သတ္တိတစ်ခုလျှင် တစ်တန်းစီရှိပြီး၊ တစ်ခုစီကို ဖွင့်လိုက်လျှင် ဤအရာများကို ပြသသည် - ကီး၊ အညွှန်း၊ သက်ဆိုင်သည်၊ အတည်ပြုနည်း၊ ခွင့်ပြု (သို့) ကန့်သတ်ရန်၊ ထိုရွေးချယ်မှုက အမည်ပေးထားသော အက္ခရာဘောက်စ်၊ အလျား အနိမ့်ဆုံး ကန့်သတ်ချက်၊ အလျား အများဆုံး ကန့်သတ်ချက်၊ အနိမ့်ဆုံး ကန့်သတ်ချက်၊ အမြင့်ဆုံး ကန့်သတ်ချက်။';
$ec_lang['lpn_cp_add']='စိတ်ကြိုက် ဂုဏ်သတ္တိ ထည့်ရန်';
$ec_lang['lpn_cp_add_tip']='ဒီဇိုင်းဇယားထဲသို့ တန်းတစ်ခု ထည့်ပြီး တည်းဖြတ်ရန် ဖွင့်ပေးသည်။';
$ec_lang['lpn_cp_remove_tip']='ဤဂုဏ်သတ္တိကို ဒီဇိုင်းဇယားမှ ဖယ်ရှားသည်။ သင့်အစိတ်အပိုင်းများပေါ်တွင် ရိုက်ထည့်ပြီးသား တန်ဖိုးများကို ဖိုင်ထဲတွင် ဆက်ထိန်းထားပြီး၊ ထပ်တူ ကီးဖြင့် ထပ်ဒီဇိုင်းရေးလျှင် ပြန်ပေါ်လာမည်။';
$ec_lang['lpn_cp_none']='စိတ်ကြိုက် ဂုဏ်သတ္တိ တစ်ခုမျှ ဒီဇိုင်းရေးဆွဲထားခြင်း မရှိသေးပါ။';
$ec_lang['lpn_cp_unnamed']='အမည်မပေးရသေးပါ';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='ကီး';
$ec_lang['lpn_cp_key_tip']='ကီး - ဂုဏ်သတ္တိတစ်ခုကို ဤအမည်အောက်တွင် သိမ်းဆည်းသည်။ ကွက်လပ်များ ခွင့်မပြုပါ၊ သင့်ကီးသည် တည်ဆောက်ပါ ဘောက်စ်တစ်ခုနှင့် အဘယ်အခါမျှ မတိုက်မိစေရန် ရှေ့ဆက်တစ်ခုကို သင့်အတွက် ထည့်ပေးထားသည်။';
$ec_lang['lpn_cp_label']='အညွှန်း';
$ec_lang['lpn_cp_label_tip']='အညွှန်း - ဖတ်ရှုသူသည် ဤအရာကို ဂုဏ်သတ္တိဘောက်စ်ပေါ်တွင်၊ ရှာဖွေရန်တွင်နှင့် ဇယားကော်လံ၏ ထိပ်ဆုံးတွင် တွေ့ရသည်။';
$ec_lang['lpn_cp_applies']='သက်ဆိုင်သည်';
$ec_lang['lpn_cp_applies_tip']='သက်ဆိုင်သည် - ဤဂုဏ်သတ္တိကို အသုံးပြုသော အစိတ်အပိုင်းများအတွက် ID ရှေ့ဆက် စာရင်းကို ကော်မာဖြင့် ပိုင်းခြားရေးရန်၊ ဥပမာ J,L,R။';
$ec_lang['lpn_cp_validate']='အတည်ပြုနည်း';
$ec_lang['lpn_cp_validate_tip']='အတည်ပြုနည်း - ကောင်းမွန်သော တန်ဖိုးတစ်ခု မည်သို့ရှိမည်ကို ဆိုလိုသည်။ စာလုံးကြီး/အသေး စည်းမျဉ်းများသည် အင်္ဂလိပ် အက္ခရာများကိုသာ ဖတ်နိုင်ပြီး၊ ၎င်းသည် ဖော်ပြထားသော ကန့်သတ်ချက် ဖြစ်သည်။ မည်သည့်အရာကိုမဆို လက်ခံရန် "အတည်မပြုပါနှင့်" ကို ရွေးပါ။';
$ec_lang['lpn_cp_restrict']='ဤအက္ခရာများကို ကန့်သတ်ရန်';
$ec_lang['lpn_cp_restrict_tip']='ဤအက္ခရာများကို ကန့်သတ်ရန် - တန်ဖိုးတစ်ခုသည် ဤနေရာတွင် စာရင်းပြုထားသော အက္ခရာများကိုသာ အသုံးပြုနိုင်သည်၊ (သို့) ၎င်းတို့ထဲမှ မည်သည့်တစ်ခုကိုမျှ မသုံးရပါ၊ ဤနေရာတွင် "@" က မည်သည့်စာလုံးကိုမဆို ဆိုလိုပြီး; "#" က မည်သည့်ဂဏန်းကိုမဆို ဆိုလိုကာ၊ "-"၊ "."၊ နှင့် "," တို့ကို ခွင့်ပြုလိုပါက သီးခြားစာရင်းပြုရမည်; နှင့် ကွက်လပ်အက္ခရာများသည် အခြားအက္ခရာများကြားတွင်သာ ရှိရမည်။';
$ec_lang['lpn_cp_restrict_mode']='ခွင့်ပြု (သို့) ကန့်သတ်ရန်';
$ec_lang['lpn_cp_restrict_mode_tip']='ခွင့်ပြု (သို့) ကန့်သတ်ရန် - ပေးထားသော အက္ခရာများသည် တန်ဖိုးတစ်ခု အသုံးပြုနိုင်သည့် တစ်ခုတည်းသော အက္ခရာများ ဖြစ်စေ၊ (သို့) အသုံးမပြုနိုင်သည့် အက္ခရာများ ဖြစ်စေ ဖြစ်သည်။';
$ec_lang['lpn_cp_restrict_allow']='ဤအက္ခရာများကိုသာ ခွင့်ပြုရန်';
$ec_lang['lpn_cp_minlength']='အလျား အနိမ့်ဆုံး ကန့်သတ်ချက်';
$ec_lang['lpn_cp_minlength_tip']='အလျား အနိမ့်ဆုံး ကန့်သတ်ချက် - ၎င်းထက် တိုသော ထည့်သွင်းချက်ကို အမှတ်အသားပြုမည်၊ ၎င်းက ဗလာနှင့် တစ်ဝက်ရိုက်ထားသော ထည့်သွင်းချက်များကို ရှာဖွေရာတွင် အသုံးဝင်သည်။';
$ec_lang['lpn_cp_length']='အလျား အများဆုံး ကန့်သတ်ချက်';
$ec_lang['lpn_cp_length_tip']='အလျား အများဆုံး ကန့်သတ်ချက် - ၎င်းထက် ရှည်သော ထည့်သွင်းချက်ကို အမှတ်အသားပြုမည်။';
$ec_lang['lpn_cp_low']='အနိမ့်ဆုံး ကန့်သတ်ချက်';
$ec_lang['lpn_cp_low_tip']='အနိမ့်ဆုံး ကန့်သတ်ချက် - ဤသည်မှာ သင်မျှော်လင့်ထားသော အသေးဆုံးတန်ဖိုး ဖြစ်သည်။ ဂဏန်းများကို ဂဏန်းများအဖြစ်နှင့် စာသားများကို အဘိဓာန်အစီအစဉ်ဖြင့် နှိုင်းယှဉ်သည်။';
$ec_lang['lpn_cp_high']='အမြင့်ဆုံး ကန့်သတ်ချက်';
$ec_lang['lpn_cp_high_tip']='အမြင့်ဆုံး ကန့်သတ်ချက် - ဤသည်မှာ သင်မျှော်လင့်ထားသော အကြီးဆုံးတန်ဖိုး ဖြစ်သည်။ ဂဏန်းများကို ဂဏန်းများအဖြစ်နှင့် စာသားများကို အဘိဓာန်အစီအစဉ်ဖြင့် နှိုင်းယှဉ်သည်။';
$ec_lang['lpn_cp_val_none']='အတည်မပြုပါနှင့်';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='ဂဏန်း .';
$ec_lang['lpn_cp_val_number_comma']='ဂဏန်း ,';
$ec_lang['lpn_cp_val_integer']='ကိန်းပြည့်';
$ec_lang['lpn_cp_val_upper']='စာလုံးကြီးအားလုံး';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} တန်ဖိုးကို သင်ရိုက်ထည့်ခဲ့သည့်အတိုင်း အတိအကျ ဆက်ထိန်းထားသည်။';
$ec_lang['lpn_cp_bad_number']='ဤတန်ဖိုးသည် ဤဂုဏ်သတ္တိအတွက် လိုအပ်သည့်အတိုင်း ဂဏန်းတစ်ခု မဟုတ်ပါ။';
$ec_lang['lpn_cp_bad_integer']='ဤတန်ဖိုးသည် ဤဂုဏ်သတ္တိအတွက် လိုအပ်သည့်အတိုင်း ကိန်းပြည့်တစ်ခု မဟုတ်ပါ။';
$ec_lang['lpn_cp_bad_case']='ဤတန်ဖိုးသည် ဤဂုဏ်သတ္တိအတွက် လိုအပ်သည့်အတိုင်း စာလုံးကြီးအားလုံး မဟုတ်ပါ။';
$ec_lang['lpn_cp_bad_chars']='ဤတန်ဖိုးသည် ဤဂုဏ်သတ္တိက ခွင့်မပြုသော အက္ခရာတစ်ခုကို သုံးထားသည်။';
$ec_lang['lpn_cp_bad_space']='ကွက်လပ်ကို အခြားအက္ခရာများကြားတွင်သာ ခွင့်ပြုသည်။';
$ec_lang['lpn_cp_bad_minlength']='ဤတန်ဖိုးသည် ဤဂုဏ်သတ္တိ ခွင့်ပြုသည်ထက် တိုသည်။';
$ec_lang['lpn_cp_bad_length']='ဤတန်ဖိုးသည် ဤဂုဏ်သတ္တိ ခွင့်ပြုသည်ထက် ရှည်သည်။';
$ec_lang['lpn_cp_bad_low']='ဤတန်ဖိုးသည် ဤဂုဏ်သတ္တိ၏ အနိမ့်ဆုံး ကန့်သတ်ချက်ထက် နိမ့်နေသည်။';
$ec_lang['lpn_cp_bad_high']='ဤတန်ဖိုးသည် ဤဂုဏ်သတ္တိ၏ အမြင့်ဆုံး ကန့်သတ်ချက်ထက် မြင့်နေသည်။';
$ec_lang['lpn_cp_key_needed']='ဤစိတ်ကြိုက် ဂုဏ်သတ္တိကို ကွက်လပ်မပါသော ကီးတစ်ခု ပေးပါ။';
$ec_lang['lpn_cp_key_taken']='အခြားစိတ်ကြိုက် ဂုဏ်သတ္တိတစ်ခုက ထိုကီးကို အသုံးပြုပြီးသားဖြစ်သည်။';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='အခြေအနေ';
$ec_lang['lpn_scenario_base']='အခြေခံ';
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
$ec_lang['lpn_scenario_overrides']='ကိုယ်ပိုင်တန်ဖိုး အရေအတွက်';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='မီးရောင်ဝါ (amber) စက်ဝိုင်းသည် ဤအစိတ်အပိုင်းက {name} အခြေအနေတစ်ခုတည်း ပိုင်ဆိုင်သော တန်ဖိုးတစ်ခု ကိုင်ဆောင်ထားကြောင်း ဆိုလိုသည်။';
$ec_lang['lpn_scenario_overrides_tip']='ထိုတန်ဖိုးများအားလုံးကို မြေပုံပေါ်တွင် မီးရောင်ဝါ (amber) စက်ဝိုင်းဖြင့် အမှတ်အသားပြုထားသည်။ ၎င်းတို့မပါဘဲ ပုံကို ကြည့်ရန် {base} သို့ ပြောင်းပါ။';
$ec_lang['lpn_scenario_menu']='အခြေအနေများ';
$ec_lang['lpn_scenario_tip']='ပုံတွင် ပြသနေပြီး၊ ဤစာမျက်နှာက ယခုဖြေရှင်းနေသော တန်ဖိုးအစုအဝေး။ အခြေအနေများ ပြောင်းရန်၊ (သို့) တစ်ခု ထပ်ထည့်ရန်၊ အမည်ပြောင်းရန်၊ ဖျက်ရန် နှိပ်ပါ။';
$ec_lang['lpn_scenario_new']='အခြေအနေအသစ်…';
$ec_lang['lpn_scenario_new_name']='အခြေအနေ {n}';
$ec_lang['lpn_scenario_prompt_name']='ဤအခြေအနေအတွက် အမည်';
$ec_lang['lpn_scenario_rename']='အခြေအနေ အမည်ပြောင်းရန်…';
$ec_lang['lpn_scenario_delete']='အခြေအနေ ဖျက်ရန်';
$ec_lang['lpn_scenario_delete_confirm']='အခြေအနေ {name} နှင့် ၎င်းတစ်ခုတည်း ပိုင်ဆိုင်သော တန်ဖိုး {n} ခုကို ဖျက်မလား။ ပုံကိုယ်တိုင်ကို မပြောင်းလဲပါ။';
$ec_lang['lpn_scenario_override']='ဤအခြေအနေတွင်သာ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='အမှန်ခြစ်ထားပါက ဤတန်ဖိုးသည် ဤအခြေအနေတစ်ခုတည်းသာ ပိုင်ဆိုင်သည်ဟု ဆိုလိုသည်၊ အခြေခံ၏ ဂဏန်းနှင့် တူနေသော်လည်း ဖြစ်သည်။ အခြေခံ တန်ဖိုးကို ပြန်သုံးလိုပါက အမှန်ခြစ်ကို ဖျက်ပါ။';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='အခြေခံ အခြေအနေ - {value}';
$ec_lang['lpn_scenario_deactivated']='{id} သည် {scenario} တွင် ကွန်ရက်ထဲမှ ပယ်ထားသည်။ ပုံထဲတွင်နှင့် သင်၏ အခြားအခြေအနေများတွင် ဆက်ရှိနေသေးသည်။';
$ec_lang['lpn_scenario_push_btn']='အခြေခံ တန်ဖိုးများကို အခြေအနေအားလုံးအပေါ် အသုံးချရန်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='ယခု ပြသနေသော ဂုဏ်သတ္တိများအတွက် အခြေအနေအားလုံးသည် အခြေခံ တန်ဖိုးသို့ ပြန်သွားမည်။ ထိုအခြေအနေများ တစ်ခုတည်း ပိုင်ဆိုင်သော တန်ဖိုးများကို ပယ်ချမည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='ဤဂုဏ်သတ္တိများအတွက် အခြေအနေအားလုံးကို အခြေခံ တန်ဖိုးများ သုံးစေမလား။ ထိုအခြေအနေများ တစ်ခုတည်း ပိုင်ဆိုင်သော တန်ဖိုးများကို ပယ်ချမည်။ ဤလုပ်ဆောင်ချက်ကို နောက်ပြန်ဆွဲနိုင်ပါသည်။';
$ec_lang['lpn_scenario_push_scenarios']='သက်ရောက်မည့် အခြေအနေများ -';
$ec_lang['lpn_scenario_push_values']='ပယ်ချမည့် တန်ဖိုးများ -';
$ec_lang['lpn_scenario_push_none']='ဤဂုဏ်သတ္တိများ မည်သည့်တစ်ခုအတွက်မျှ မည်သည့်အခြေအနေမျှ ကိုယ်ပိုင်တန်ဖိုး မရှိသောကြောင့်၊ မည်သည့်အရာမျှ ပြောင်းလဲမည် မဟုတ်ပါ။ ဘာမျှ ပယ်ချမည် မဟုတ်ပါ။';
$ec_lang['lpn_delete_drops_overrides']='ဤအစိတ်အပိုင်းကို ဖျက်ခြင်းသည် သင်၏ အခြေအနေများ ၎င်းအတွက် ကိုင်ဆောင်ထားသော တန်ဖိုး {n} ခုကိုပါ ပယ်ချမည်။ ဆက်လုပ်မလား?';
$ec_lang['lpn_push_base_only']='ဤလုပ်ဆောင်ချက်သည် ပုံကိုယ်တိုင်ကို ပြောင်းလဲသောကြောင့်၊ {base} တွင်သာ ပြုလုပ်နိုင်သည်။ {base} သို့ ပြောင်းပြီး ထပ်ကြိုးစားပါ။';
$ec_lang['lpn_field_active']='ဤကွန်ရက်၏ အစိတ်အပိုင်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='ဤဘောက်စ်ကို အမှန်ခြစ် ဖျက်ပါက အစိတ်အပိုင်းသည် ပုံပေါ်တွင် ဆက်ရှိနေသော်လည်း ကွန်ရက်ထဲမှ ပယ်ထားမည် - မီးခိုးရောင်ဖြင့် ဆွဲထားပြီး ဖြေရှင်းစက်က လျစ်လျူရှုမည်။ အခြေအနေတစ်ခုအတွင်း အဆိုပြုထားသော ပိုက်လိုင်းတစ်ခုကို ဤနည်းဖြင့် ဖွင့်/ပိတ် ပြုလုပ်သည်။';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='ဖျန်းစက် ထပ်ကိန်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='ဖျန်းစက်များနှင့် ယိုစိမ့်မှုများအတွက် EPANET ၏ ဖျန်းစက် ညီမျှခြင်းရှိ ထပ်ကိန်း − ရေစီးနှုန်း = ကိန်းသေ x ဖိအား ကို ဤထပ်ကိန်းအထိ တင်ထားသော တန်ဖိုး။ ဆက်စပ်နေရာတစ်ခုတွင် ဖျန်းစက် ရှိမှသာ အဖြေအပေါ် သက်ရောက်ပြီး၊ ယခုအချိန်တွင် ဆိုလိုသည်မှာ EPANET ဖိုင်တစ်ခုမှ ဖတ်ယူထားသော ကွန်ရက်ကိုသာ ဆိုလိုသည်။';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='DEM ဖတ်ရန်';
$ec_lang['lpn_elev_dem_sample_tip']='ဤဆက်စပ်နေရာရှိ DEM ၏ ရေအမြင့်ကို ဖတ်ယူပြီး အောက်တွင် ပြသသည်။ အမြင့် ဘောက်စ်ထဲရှိ မည်သည့်အရာမျှ မပြောင်းလဲပါ။ အလျားလိုက် DEM ခွဲခြားနိုင်စွမ်းမှာ ကမ္ဘာ့နေရာအများစုအတွက် ခန့်မှန်း 30 မီတာ ဖြစ်ပြီး၊ ပိုကောင်းသော ဒေတာ ရှိသည့်နေရာများတွင် ပိုသေးငယ်သည်။';
$ec_lang['lpn_elev_dem_use']='DEM သုံးရန်';
$ec_lang['lpn_elev_dem_use_tip']='ဤဆက်စပ်နေရာရှိ DEM ၏ ရေအမြင့်ကို အထက်ရှိ အမြင့် ဘောက်စ်ထဲသို့ ထည့်ပြီး၊ ရှိပြီးသားတန်ဖိုးကို အစားထိုးမည်။ DEM ကို မဖတ်ရသေးပါက ပထမဦးစွာ ဖတ်ယူမည်။ Undo တစ်ကြိမ်ဖြင့် ၎င်းကို ပြန်ရောက်စေနိုင်သည်။';
$ec_lang['lpn_elev_dem_none']='DEM တွင် ဤဆက်စပ်နေရာအတွက် ရေအမြင့် မရှိပါ။';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM အဆိုအရ {v} {u} ဖြစ်သည်။';
$ec_lang['lpn_settings_elev_source']='ရေအမြင့် ရင်းမြစ်';
$ec_lang['lpn_settings_elev_source_tip']='ဆက်စပ်နေရာအသစ်တစ်ခုသည် ၎င်း၏ ရေအမြင့်ကို မည်သည့်နေရာမှ ရရှိသည်။ မြေမျက်နှာပြင်ကို Mapbox DEM မှ ဖတ်ယူပြီး၊ ၎င်းသည် ကမ္ဘာ့နေရာအများစုအတွက် ခန့်မှန်း 30 မီတာ ကျယ်ပြီး ပိုကောင်းသော ဒေတာ ရှိသည့်နေရာများတွင် ပိုသေးငယ်သည်။';
$ec_lang['lpn_settings_elev_source_typed']='အထက်တွင် ရိုက်ထည့်ထားသော အမြင့်';
$ec_lang['lpn_settings_elev_source_dem']='Mapbox DEM (မြေပြင်ဒေတာ)';
$ec_lang['lpn_settings_accuracy']='တိကျမှု';
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
$ec_lang['lpn_settings_default_is']='ပုံမှန်တန်ဖိုးမှာ {n} ဖြစ်သည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='ဖြေရှင်းစက်သည် ရပ်တန့်မီ မည်မျှနီးကပ်ရမည်ကို ဆိုလိုပြီး၊ ထပ်ခါထပ်ခါ တွက်ချက်မှု တစ်ခုနှင့် တစ်ခုကြား ရေစီးနှုန်းများ မည်မျှ ဆက်ပြောင်းနေသေးသည်ကို တိုင်းတာသည်။ ဂဏန်းငယ်လေ ပိုတိကျပြီး ပိုကြာလေ ဖြစ်သည်။ ဖြေရှင်းစက် နှစ်ခုစလုံးသည် ဤဘောက်စ်တစ်ခုတည်းကို ဖတ်ယူပြီး၊ တစ်ခုစီသည် ထိုပြောင်းလဲမှုကို မတူညီသော စုစုပေါင်းတန်ဖိုးနှင့် တိုင်းတာသည် - တွင်ပါ ဖြေရှင်းစက်က လိုအင်များ၏ ပေါင်းလဒ်နှင့်၊ EPANET က ပိုက်လိုင်း ရေစီးနှုန်းများ၏ ပေါင်းလဒ်နှင့်။ ဗလာထားခဲ့ပါက ဤစာမျက်နှာသည် EPANET ကိုယ်တိုင်၏ ပုံမှန်တန်ဖိုးထက် တင်းကျပ်သော တိကျမှုကို အသုံးပြုသည်။';
$ec_lang['lpn_settings_specific_gravity']='အထူးဆွဲငင်အား';
$ec_lang['lpn_settings_specific_gravity_tip']='ရေနှင့် နှိုင်းယှဉ်သော အရည်၏ အလေးချိန်။ ၎င်းသည် ဂိတ်ချ် (gauge) ဖတ်မည့် ဖိအားများကို ပြောင်းလဲစေပြီး၊ ရေစီးနှုန်းများကို မပြောင်းလဲပါ။';
$ec_lang['lpn_settings_viscosity']='အချိုးအားဖြင့် စေးကပ်မှု';
$ec_lang['lpn_settings_viscosity_tip']='ဆယ်လ်စီးယပ် ဒီဂရီ 20 ရှိ ရေနှင့် နှိုင်းယှဉ်သော အရည်၏ စေးကပ်မှု။ Darcy-Weisbach နည်းလမ်းအောက်တွင်သာ အဖြေကို ပြောင်းလဲစေသည်။';
$ec_lang['lpn_settings_trials']='အများဆုံး ထပ်ခါထပ်ခါ တွက်ချက်မှု အကြိမ်ရေ';
$ec_lang['lpn_settings_trials_tip']='အဖြေ မတွေ့နိုင်သော ကွန်ရက်တစ်ခုတွင် ဖြေရှင်းစက်က လက်လျှော့မီ ခွင့်ပြုမည့် ထပ်ခါထပ်ခါ တွက်ချက်မှု အကြိမ်ရေ။';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='အဖြေ မတွေ့ပါက';
$ec_lang['lpn_settings_unbalanced_tip']='ထပ်ခါထပ်ခါ တွက်ချက်မှု ကုန်သွားပြီးနောက်လည်း အဖြေ မတွေ့သေးသော ကွန်ရက်တစ်ခုကို မည်သို့ ဆောင်ရွက်မည်နည်း။ ထပ်ခါထပ်ခါ တွက်ချက်မှု ထပ်ခွင့်ပြုခြင်းဖြင့် များသောအားဖြင့် အဖြေ တွေ့တတ်သည်။ ရပ်တန့်ခြင်းက နောက်ဆုံး ထပ်ခါထပ်ခါ တွက်ချက်မှုကို ရှိသည့်အတိုင်း အစီရင်ခံပြီး၊ ၎င်းသည် အဖြေ မဟုတ်ပါ။ EPANET ဖြေရှင်းစက်ကသာ ဤဘောက်စ်ကို ဖတ်ယူသည်။ တွင်ပါ ဖြေရှင်းစက်သည် အမြဲ ရပ်တန့်ပြီး အဖြေကို \'အဖြေ မတွေ့\' ဟု အမှတ်အသားပြုသည်။';
$ec_lang['lpn_settings_unbalanced_continue']='ထပ်ခါထပ်ခါ တွက်ချက်မှု ထပ်ခွင့်ပြုရန်';
$ec_lang['lpn_settings_unbalanced_stop']='ရပ်တန့်ပြီး နောက်ဆုံး ထပ်ခါထပ်ခါ တွက်ချက်မှုကို အစီရင်ခံရန်';
$ec_lang['lpn_settings_unbalanced_trials']='အစီရင်ခံမီ ထပ်ခါထပ်ခါ တွက်ချက်မှု ထပ်အကြိမ်ရေ';
$ec_lang['lpn_settings_unbalanced_trials_tip']='အထက်ပါ အများဆုံးကန့်သတ်ချက် ကုန်သွားပြီးနောက်၊ နောက်ဆုံး ထပ်ခါထပ်ခါ တွက်ချက်မှုကို အစီရင်ခံမီ ထပ်မံခွင့်ပြုမည့် ထပ်ခါထပ်ခါ တွက်ချက်မှု အကြိမ်ရေ။ EPANET ဖြေရှင်းစက်ကသာ ဤဘောက်စ်ကို ဖတ်ယူသည်။';
$ec_lang['lpn_settings_head_error']='ဖိမြင့်ဆင့် အမှား ကန့်သတ်ချက်';
$ec_lang['lpn_settings_head_error_tip']='ဖြေရှင်းစက် ရပ်တန့်မီ ဖြတ်သန်းရမည့် နောက်ထပ် စစ်ဆေးမှုတစ်ခု - ပိုက်လိုင်းတစ်ခုတည်းတွင် ကျန်ရှိနေသော အကြီးဆုံး ဖိမြင့်ဆင့် အမှား။ သုညဆိုလျှင် ဤစစ်ဆေးမှုကို အသုံးမပြုပါ။ EPANET ဖြေရှင်းစက်ကသာ ဤဘောက်စ်ကို ဖတ်ယူသည်။';
$ec_lang['lpn_settings_flow_change']='ရေစီးနှုန်း ပြောင်းလဲမှု ကန့်သတ်ချက်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='ဖြေရှင်းစက် ရပ်တန့်မီ ဖြတ်သန်းရမည့် နောက်ထပ် စစ်ဆေးမှုတစ်ခု - ပိုက်လိုင်းတစ်ခုတည်း၏ ရေစီးနှုန်းတွင် ထပ်ခါထပ်ခါ တွက်ချက်မှု တစ်ခုနှင့်တစ်ခုကြား အများဆုံး ပြောင်းလဲမှု။ သုညဆိုလျှင် ဤစစ်ဆေးမှုကို အသုံးမပြုပါ။ EPANET ဖြေရှင်းစက်ကသာ ဤဘောက်စ်ကို ဖတ်ယူသည်။';
$ec_lang['lpn_settings_damp_limit']='ဖိနှိပ်မှု (damping) စတင်သည့်နေရာ';
$ec_lang['lpn_settings_damp_limit_tip']='ဖြေရှင်းစက်သည် ငယ်ငယ်သော အဆင့်များ စတင်ယူမည့် တိကျမှု အဆင့်၊ ၎င်းသည် တုန်ခါနေသော ကွန်ရက်တစ်ခု အဖြေ တွေ့စေရန် ကူညီနိုင်သည်။ သုညဆိုလျှင် ဖြေရှင်းစက်သည် ဘယ်သောအခါမျှ ဖိနှိပ်မှု (damp) မပြုလုပ်ပါ။ EPANET ဖြေရှင်းစက်ကသာ ဤဘောက်စ်ကို ဖတ်ယူသည်။';
$ec_lang['lpn_settings_option_unset']='မဖော်ပြထားပါ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='ကွန်ရက်ရှိ လိုအင်တိုင်းအပေါ် တစ်ပြိုင်နက် အသုံးပြုသော ကိန်းသေ တစ်ခုတည်း။ လက်ရှိအသုံးပြုမှုထက် ပိုသော (သို့) နည်းသော အခြေအနေတွင် စနစ်က မည်သို့ လုပ်ဆောင်မည်ကို မေးရန် သုံးပါ။ သင်ရိုက်ထည့်ခဲ့သော ဂဏန်းများကို မပြောင်းလဲပါ။ အခြေအနေတစ်ခုသည် ၎င်း၏ ကိုယ်ပိုင်တန်ဖိုး ကိုင်ဆောင်နိုင်သဖြင့်၊ ပျမ်းမျှနေ့၊ အများဆုံးနေ့နှင့် အထွတ်အထိပ် နာရီအတွက် တစ်ခုစီ ဂဏန်းတစ်ခုစီ ရှိစေနိုင်သည်။ အခြေအနေတစ်ခုတွင် ပရောဂျက်၏ တန်ဖိုးကို သုံးလိုပါက ဗလာထားပါ။';
$ec_lang['lpn_settings_engine_native']='EPANET ဖြေရှင်းစက်ဖြင့် ဖြေရှင်းရန်';
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
$ec_lang['lpn_settings_engine_native_tip']='ဖြစ်နိုင်သည့်အခါတိုင်း တွင်ပါ ဖြေရှင်းစက်ကို အသုံးပြုရန် ဤအမှန်ခြစ်ကို ဖွင့်ပါ။ သို့မဟုတ်ပါက US EPA ၏ EPANET ဖြေရှင်းစက်ကို အမြဲတမ်း အသုံးပြုပါလိမ့်မည်။ တွင်ပါ ဖြေရှင်းစက်ကို ကာလရှည် simulation များ (extended period simulation) သို့မဟုတ် အလုပ်လုပ်နေသော PRV၊ PSV (သို့) FCV အတွက် အသုံးမပြုပါ။ EPANET ဖြေရှင်းစက်ကို ပထမဆုံးအကြိမ် အသုံးပြုသောအခါ၊ ခန့်မှန်းခြေ 650 KB ကို ဒေါင်းလုဒ်လုပ်ပြီး ဤစက်ပေါ်တွင် သိမ်းထားပါလိမ့်မည်။ ပိုက်လိုင်းတစ်ခုတွင် ဒေသဆိုင်ရာ (local) ဆုံးရှုံးမှု ပါရှိသည့်နေရာတွင်၊ ဖြေရှင်းစက်နှစ်ခုသည် နောက်ဆုံးဂဏန်းများတွင် ကွဲလွဲသည် - EPANET သည် ဆွဲငင်အားအတွက် သုံးသည့်တန်ဖိုးကို ဂဏန်းချုံ့ ထားသောကြောင့်၊ ၎င်း၏ ဒေသဆိုင်ရာ ဆုံးရှုံးမှုများသည် အတိအကျ ပုံသေနည်းထက် အနည်းငယ်သာ နိမ့်ထွက်လာသည်။';
$ec_lang['lpn_engine_loading']='EPANET ဖြေရှင်းစက်ကို ဖွင့်နေသည်…';
$ec_lang['lpn_engine_failed']='EPANET ဖြေရှင်းစက်ကို ဖွင့်၍မရခဲ့ပါ။ ယင်းအစား တွဲထားသော ဖြေရှင်းစက်ကို ပြသနေပါသည်။';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='ဤဗားလ်များသည် ၎င်းတို့ကိုယ်တိုင် ဖွင့်/ပိတ် လုပ်ဆောင်သောကြောင့်၊ EPANET ဖြေရှင်းစက်ဖြင့် ဖြေရှင်းထားသည် -';
$ec_lang['lpn_unit_unknown']='ဤပုံသည် ဤစာမျက်နှာက မပေးသော ယူနစ်တစ်ခုကို ဖော်ပြထားသည် - {unit}။ ဝင်လာသည့်အတိုင်း အရာအားလုံးကို ထိန်းသိမ်းပြသထားပြီး၊ မည်သည့်အရာမျှ ပြောင်းလဲမထားပါ။ ဤစာမျက်နှာအား ထိုယူနစ်ကို မသင်ကြားရသေးသရွေ့ မည်သည့်အရာမျှ တွက်ချက်၍မရပါ၊ အကြောင်းမှာ ၎င်း၏ အရွယ်အစားကို မသိသောကြောင့်ဖြစ်သည်။';
$ec_lang['lpn_engine_manning_note']='မှတ်ချက် - Manning ကြမ်းတမ်းမှုကို သုံးသောအခါ EPANET သည် Manning ညီမျှခြင်းရှိ သင်္ကေတကိန်းကို ဂဏန်းချုံ့ ထားသောကြောင့်၊ ဖိမြင့်ဆင့်ဆုံးရှုံးမှုသည် အတိအကျ ပုံသေနည်းထက် ခန့်မှန်းခြေ 0.6% နိမ့်ထွက်လာသည်။';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='EPANET ဖြေရှင်းစက်က ဤကွန်ရက်ကို လက်မခံသောကြောင့် မလည်ပတ်ခဲ့ပါ။';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='EPANET ဖြေရှင်းစက်က ဆိုသည် - {message}';
$ec_lang['lpn_engine_refused_fallback']='စခရင်ပေါ်ရှိ ဂဏန်းများသည် တွင်းထဲပါ ဖြေရှင်းစက်မှ ရခဲ့ခြင်း ဖြစ်သည်။';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='စခရင်ပေါ်ရှိ ဂဏန်းများသည် တွင်းထဲပါ ဖြေရှင်းစက်မှ ရခဲ့ခြင်း ဖြစ်သည်။ ၎င်းသည် တစ်ကြိမ်လျှင် တစ်အခိုက်အတန့်ကိုသာ တွက်ချက်သောကြောင့်၊ ဤအရာသည် {time} အချိန်ကာလရှိ ကွန်ရက်သာ ဖြစ်ပြီး၊ ရေတိုက်တိုင်းသည် ၎င်း၏ အစပြု ရေအမြင့်တွင် ဆက်ရှိနေသည်။';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='ဤထိန်းချုပ်မှုများသည် ဤပရောဂျက်ထဲတွင် မရှိတော့သော အစိတ်အပိုင်းတစ်ခု၏ အမည်ကို ဆောင်ထားသောကြောင့် ချန်ခဲ့သည် - {ids}';
$ec_lang['lpn_control_unreadable_note']='ဤထိန်းချုပ်မှုများကို ဖတ်၍ မရသောကြောင့် ချန်ခဲ့သည် - {ids}';
$ec_lang['lpn_rule_dangling_note']='ဤစည်းမျဉ်းများသည် ဤပရောဂျက်တွင် မရှိတော့သော အစိတ်အပိုင်းတစ်ခုကို ရည်ညွှန်းထားသောကြောင့်၊ ဤ run တွင် လျစ်လျူရှုခဲ့သည် - {ids}';
$ec_lang['lpn_rule_unreadable_note']='ဤစည်းမျဉ်းများကို မဖတ်နိုင်ခဲ့သောကြောင့်၊ ဤ run တွင် လျစ်လျူရှုခဲ့သည် - {ids}';
$ec_lang['lpn_settings_text_size']='စာသား အရွယ်အစား (ပစ်ဆယ်များ)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='သင်္ကေတ အရွယ်အစား (ပစ်ဆယ်များ)';
$ec_lang['lpn_settings_link_width']='ပိုက်လိုင်း အကျယ် (ပစ်ဆယ်များ)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='ရေစီးဦးတည်ချက် မြားများ';
$ec_lang['lpn_settings_show_arrows_tip']='ပိုက်လိုင်းတစ်ခုစီပေါ်တွင် ရေမည်သို့ စီးဆင်းနေသည်ကို ပြသော မြားတစ်ခု ဆွဲပေးသည်။ မြားများသည် run တစ်ခု ပြီးနောက် ပေါ်လာပြီး၊ ၎င်းတို့ကို ပိတ်လိုက်ခြင်းက အဖြေများကို မပြောင်းလဲပါ။ ဤဆက်တင်ကို ပရောဂျက်နှင့်အတူ သိမ်းဆည်းသည်။';
$ec_lang['lpn_settings_align_labels']='ပိုက်အညွှန်းများကို ပိုက်လိုင်းနှင့် ညီညွတ်အောင် တန်းရန်';
$ec_lang['lpn_settings_readability_bias']='အညွှန်းသည် ဒေါင်လိုက်မှ ဘယ်ဘက်သို့ ဒီဂရီ ဤမျှထက်ပိုစောင်းလျှင် အောက်ခေါင်းစိုက် ပြန်လှည့်ပါ';
$ec_lang['lpn_settings_readability_bias_tip']='အညွှန်းသည် ဒေါင်လိုက်မှ ဘယ်ဘက်သို့ ဤဒီဂရီအရေအတွက်ထက် ပိုစောင်းနေလျှင်၊ တည့်မတ်နေစေရန် အညွှန်းကို ပြန်လှည့်ပေးသည်။';
$ec_lang['lpn_settings_mask_labels']='အညွှန်းများ၏နောက်ကွယ်တွင် အစိုင်အခဲ နောက်ခံ';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='ခေါင်းဆောင်မျဉ်းများကို သတ်မှတ်ထားသော ထောင့်များသို့ ကပ်စေရန်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='အညွှန်းတစ်ခုကို ၎င်းအမည်ပေးထားသော အရာနှင့် ခွာ၍ ဆွဲသောအခါ၊ ၎င်းသို့ ပြန်သွားသော မျဉ်းသည် သင်ဆွဲသည့်နေရာနှင့် နီးစပ်ဆုံး သတ်မှတ်ထားသော ထောင့်ပေါ်သို့ ဆွဲငင်ခံရသည်။ ဆက်ဆွဲနေပါက ကပ်ခြင်း (snap) လွှတ်သွားပြီး မည်သည့် ထောင့်ကိုမဆို ရွေးနိုင်ဆဲ ဖြစ်သည်။ ပိတ်ထားလျှင် အလွတ်ဆွဲနိုင်ပြီး၊ ဤစာမျက်နှာက အစဉ်အမြဲ ပြုလုပ်ခဲ့သည့် နည်းလမ်းပင် ဖြစ်သည်။';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='ဤမြေပုံ အကျယ် (သို့) ၎င်းထက်နည်းသို့ ဇူးမ်လုပ်သောအခါ အညွှန်းများ ပြရန်';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='မြေပုံ ကြည့်ရှုမှု ဤအကျယ် (သို့) ၎င်းထက်ကျဉ်းစဉ်တွင်သာ အညွှန်းများကို ဆွဲသည်။ ဇူးမ် အဆင့်တိုင်းတွင် ဆွဲစေလိုပါက ဘောက်စ်ကို ဗလာထားပါ။ မည်သည့် ဇူးမ်အဆင့်တွင်မျှ အညွှန်း လုံးဝ မဆွဲစေလိုပါက 0 ကို ရိုက်ထည့်ပါ။';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='အမြဲ ပြရန်';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='အမှတ်များကို ဤထက် ပိုမကြီးစေရန် ကန့်သတ်ရန် -';
$ec_lang['lpn_settings_symbol_cap_mid']='ဆမြောက်အထိ ရာခိုင်နှုန်း';
$ec_lang['lpn_settings_symbol_cap_post']='ရှိ ပိုက်၏ အလျား';
$ec_lang['lpn_settings_symbol_cap_tip']='ဆက်စပ်နေရာတစ်ခု၏ အချင်းသည် ကွန်ရက်ရှိ ပိုက်အလျားအားလုံး၏ ဤရာခိုင်နှုန်းအမှတ်ရှိ ပိုက်အလျား၏ ဤဆအထိ ရောက်ရှိသောအခါ၊ မြေပြင်ပေါ်တွင် ကြီးထွားခြင်း ရပ်တန့်သည်။ ထိုအမှတ်ကို ကျော်လွန်ပြီးနောက်၊ မြေပုံပေါ်ရှိ ဆက်စပ်နေရာများ၊ ပိုက်လိုင်းများနှင့် အခြားသင်္ကေတများသည် သင် ဇူးမ်လျှော့ချသည်နှင့်အမျှ မြေပြင်ပေါ်တွင် ကြီးထွားမည့်အစား၊ စခရင်ပေါ်တွင် ကျုံ့သွားသည်။ ရေကန်များနှင့် ရေတိုက်များသည် ခြွင်းချက်ဖြစ်ပြီး ဇူးမ်အဆင့်တိုင်းတွင် ၎င်းတို့၏ စခရင်အရွယ်အစားကို ထိန်းထားသည်။';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='သင်္ကေတ မြင်နိုင်မှု (0 မှ 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='နောက်ခံပုံ မြင်နိုင်မှု (0 မှ 1)';
$ec_lang['lpn_settings_map_display']='အသွင်အပြင်';
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
$ec_lang['lpn_settings_legend_position']='အညွှန်းများ သော့ချက် တည်နေရာ';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='မရှိ';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='ပိတ်ထားသည်';
$ec_lang['lpn_settings_legend_top_left']='ဘယ်ဘက်အပေါ်';
$ec_lang['lpn_settings_legend_top_right']='ညာဘက်အပေါ်';
$ec_lang['lpn_settings_legend_middle_left']='ဘယ်ဘက် အလယ်';
$ec_lang['lpn_settings_legend_middle_right']='ညာဘက် အလယ်';
$ec_lang['lpn_settings_legend_bottom_left']='ဘယ်ဘက်အောက်';
$ec_lang['lpn_settings_legend_bottom_right']='ညာဘက်အောက်';
$ec_lang['lpn_settings_color_node_field']='ဆက်စပ်နေရာ အရောင်';
$ec_lang['lpn_settings_color_link_field']='ပိုက်လိုင်း အရောင်';
$ec_lang['lpn_settings_color_ramp']='အရောင်အစီအစဉ်';
$ec_lang['lpn_settings_color_credits']='ကျေးဇူးတင်စကား';
$ec_lang['lpn_color_ramp_epanet']='အပြာမှ အနီသို့ (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='ခရမ်းရောင်မှ အဝါရောင်သို့ (အရောင်တစ်ခုနှင့် တစ်ခု ခွဲခြားရန် ပိုလွယ်သည်)';
$ec_lang['lpn_color_ramp_gray']='ဖျော့သောမှ အနက်ရောင် မီးခိုးရောင်သို့';
$ec_lang['lpn_settings_color_reverse']='အရောင်အစီအစဉ်ကို ပြောင်းပြန်လှန်ရန်';
$ec_lang['lpn_color_none']='အရောင် မထားရန်';
$ec_lang['lpn_settings_color_key_position']='အရောင် သော့ချက် တည်နေရာ';
$ec_lang['lpn_settings_color_breaks']='အရောင်အပိုင်း နယ်နိမိတ်များ';
$ec_lang['lpn_settings_color_equal_intervals']='အကွာအဝေး တူညီစွာ ခွဲရန်';
$ec_lang['lpn_settings_color_equal_counts']='အရေအတွက် တူညီစွာ ခွဲရန်';
$ec_lang['lpn_settings_color_no_values']='အသုံးပြုရန် တန်ဖိုးများ မရှိသေးပါ။ ကွန်ရက်ကို အရင်ဖြေရှင်းပါ။';
$ec_lang['lpn_confirm_restore_defaults']='ဆက်တင်အားလုံး (ID ရှေ့ဆက်များ၊ အစပြုတန်ဖိုးများ၊ ဖြေရှင်းစက် ဆက်တင်များ၊ မြေပုံ အသွင်အပြင်၊ မြေပုံသော့ချက် တည်နေရာနှင့် မြင်ရသော အညွှန်းများ) ကို ၎င်းတို့၏ မူရင်းတန်ဖိုးများသို့ ပြန်လည်သတ်မှတ်မလား။ သင့်ကွန်ရက်ကို မပြောင်းလဲပါ။ ဆက်တင်များသည် ဖွင့်ထားသော ပရောဂျက်နှင့် သက်ဆိုင်သောကြောင့်၊ သင့်အခြားပရောဂျက်များသည် ၎င်းတို့ကိုယ်ပိုင်ဆက်တင်များကို ဆက်ထားပါလိမ့်မည်။';
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
$ec_lang['lpn_settings_wipe_btn']='အသစ်ပြန်စရန်';
$ec_lang['lpn_confirm_wipe']='အသစ်ပြန်စရန်၊ ဤစာမျက်နှာအတွက် သိမ်းဆည်းထားသော အရာအားလုံး — ပရောဂျက်တိုင်း၊ နောက်ခံပုံတိုင်း၊ ဆက်တင်အားလုံးနှင့် သင့်ယူနစ်ရွေးချယ်မှုများ — ကို ဖျက်မလား။ စာမျက်နှာသည် လာရောက်ကြည့်ရှုသူ လုံးဝအသစ်တစ်ဦးက မြင်ရသည့်အတိုင်း အတိအကျ ပြန်ဖွင့်ပါလိမ့်မည်။ ၎င်းကို နောက်ပြန်ပြင်၍မရပါ။';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='ဤလင့်ခ်ကို ကူးယူပါ -';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='အချိန်';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='စုစုပေါင်း လည်ပတ်ချိန်';
$ec_lang['lpn_time_hyd_step']='ဟိုက်ဒရောလစ် အချိန်အဆင့်';
$ec_lang['lpn_time_pattern_step']='ပုံစံ အချိန်အဆင့်';
$ec_lang['lpn_time_pattern_start']='ပုံစံ စတင်ချိန်';
$ec_lang['lpn_time_report_step']='အစီရင်ခံ အချိန်အဆင့်';
$ec_lang['lpn_time_report_start']='အစီရင်ခံ စတင်ချိန်';
$ec_lang['lpn_time_clock_start']='အစတွင် နာရီအချိန်';
$ec_lang['lpn_time_clock_day']='နေ့ {day}၊ {clock}';
$ec_lang['lpn_time_format_tip']='အချိန်ကို 2:30 ကဲ့သို့ နာရီနှင့် မိနစ်ဖြင့် ရေးပါ။ ဂဏန်းရိုးရိုးသည် နာရီကို ဆိုလိုသည်၊ ထို့ကြောင့် 8 ဆိုလျှင် ရှစ်နာရီ ဖြစ်သည်။ တစ်နာရီ ထက်ဝက်ကို 0:30 ဟု ရေးသည်။';
$ec_lang['lpn_time_running']='EPANET ဖြေရှင်းစက်ဖြင့် အချိန်ကာလ အတုယူတွက်ချက်မှုကို တွက်ချက်နေသည်။';
$ec_lang['lpn_time_no_engine']='တွင်ပါ ဖြေရှင်းစက်သည် အခိုက်တစ်ခုတည်းကို တစ်ကြိမ်စီ တွက်ချက်သောကြောင့်၊ ဤသည်မှာ {time} တွင်သာ ကွန်ရက် ဖြစ်သည် - ပုံစံတိုင်းကို ထိုအခိုက်၌ ဖတ်ယူပြီး၊ ရေတိုက်တိုင်းသည် ပြည့်ခြင်း၊ ကုန်ခြင်း မလုပ်ဘဲ ၎င်း၏ အစပြု အဆင့်၌ပင် ဆက်ရှိနေသည်။ အချိန်ကာလတစ်ခုလုံးကို run လုပ်ပေးသော EPANET ဖြေရှင်းစက်ကို ရယူရန် အင်တာနက်ကို တစ်ကြိမ် ချိတ်ဆက်ပါ။';
$ec_lang['lpn_time_slider']='ကုန်လွန်သွားသော simulation အချိန်';
$ec_lang['lpn_time_no_period']='ဤပရောဂျက်တွင် အချိန်ကာလ အတုယူတွက်ချက်မှု သတ်မှတ်ထားခြင်း မရှိသောကြောင့်၊ ပြရန် အခိုက်တစ်ခုသာ ရှိသည်။ အချိန်ကာလ အတုယူတွက်ချက်မှုတစ်ခု run လုပ်ရန်၊ ဆက်တင်များ၊ တွက်ချက်မှု၊ အချိန် တွင် စုစုပေါင်း လည်ပတ်ချိန် ကို သတ်မှတ်ပါ။';
$ec_lang['lpn_time_first']='အစသို့ သွားရန်';
$ec_lang['lpn_time_prev']='တစ်ဆင့် နောက်ပြန်';
$ec_lang['lpn_time_play']='ဖွင့်ရန်';
$ec_lang['lpn_time_play_tip']='လှုပ်ရှားပြသမှု ဖွင့်ရန်';
$ec_lang['lpn_time_pause_tip']='လှုပ်ရှားပြသမှု ခေတ္တရပ်ရန်';
$ec_lang['lpn_time_pause']='ခေတ္တရပ်ရန်';
$ec_lang['lpn_time_next']='တစ်ဆင့် ရှေ့ဆက်';
$ec_lang['lpn_time_last']='အဆုံးသို့ သွားရန်';
$ec_lang['lpn_time_tank']='ရေတိုက်';
$ec_lang['lpn_time_level']='ရေအမြင့်';
$ec_lang['lpn_time_run']='တွက်ချက်ရန်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='ဤကွန်ရက်ကို ဟိုက်ဒရောလစ် အချိန်အဆင့်တိုင်းတွင် ဖြေရှင်းသည်။';
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
$ec_lang['lpn_time_run_done']='လည်ပတ်မှု ပြီးဆုံးပါပြီ။ အစီရင်ခံချိန်များ - {frames}။ ကြာချိန် - {secs} စက္ကန့်။';
$ec_lang['lpn_time_runbox_hide']='ဤဘောက်စ်ကို နောက်ထပ် မပြပါနှင့်';
$ec_lang['lpn_settings_runbox']='run တိုးတက်မှု ဘောက်စ်ကို ပြရန်';
$ec_lang['lpn_settings_runbox_tip']='run တစ်ခုသည် မည်မျှ ရောက်ရှိပြီးနှင့် မည်သည့်အရာကို တွေ့ရှိသည်ကို အစီရင်ခံသော ဘောက်စ်တစ်ခု။ ပိတ်ထားပါက၊ ပြီးဆုံးသွားသော run သည် ထိုအချက်အလက်ကို အနေအထား လိုင်းတွင် စက္ကန့်အနည်းငယ်မျှ ပြသမည့်အစား ဖြစ်သည်။ ဤသည်မှာ ပရောဂျက်အတွက် မဟုတ်ဘဲ ဤဘရောက်ဇာအတွက် ဆက်တင်တစ်ခု ဖြစ်သည်။';
$ec_lang['lpn_time_run_failed']='လည်ပတ်မှု မပြီးဆုံးခဲ့သောကြောင့်၊ နောက်ပိုင်းချိန်များအတွက် ရလဒ် မရှိပါ။';
$ec_lang['lpn_time_run_report']='EPANET လည်ပတ်မှု အစီရင်ခံစာ';
$ec_lang['lpn_time_run_report_copy']='ကူးယူရန်';
$ec_lang['lpn_time_run_report_copied']='ကူးယူပြီးပါပြီ';
$ec_lang['lpn_time_run_report_tip']='EPANET ဖြေရှင်းစက်ကိုယ်တိုင် နောက်ဆုံး run အကြောင်း ပုံနှိပ်ခဲ့သည့်အရာ - အဖြေ တွေ့ခဲ့သလား၊ နှင့် သတိပေးခဲ့သော မည်သည့်အရာမဆို။ ၎င်းသည် ဖြေရှင်းစက်ကိုယ်တိုင်၏ စာသားဖြစ်ပြီး ကျွန်ုပ်တို့၏ စာသား မဟုတ်ပါ။';

$ec_lang['lpn_time_speed']='မြန်နှုန်း';
$ec_lang['lpn_time_speed_tip']='ပြန်ဖွင့်ပြမှု မြန်နှုန်း';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='ဆက်တင်များ ရှာဖွေရန်';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='စကားလုံးတစ်လုံး (သို့) စကားလုံးများစွာ ရိုက်ထည့်ပါက ၎င်းတို့အားလုံးပါဝင်သော ဆက်တင်များကို ပြသမည်။';
$ec_lang['lpn_settings_no_match']='ထိုစကားလုံးပါဝင်သော ဆက်တင် မရှိပါ။';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='ဆက်တင်များ အပိုင်း စာရင်း၏ အကျယ်';
$ec_lang['lpn_rpane_empty']='ဤနေရာတွင် မည်သည့်အရာမျှ မတပ်ဆင်ရသေးပါ။ ပရောဂျက်တစ်ခုလုံးနှင့် သက်ဆိုင်သော အရာအားလုံးသည် ဆက်တင်များတွင် ရှိသည်။';
$ec_lang['lpn_time_settings_open']='အချိန် ဆက်တင်များ';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='ပုံရိပ်ပြသမှု';
$ec_lang['lpn_settings_sec_map']='မြေပုံနှင့် စာမျက်နှာ';
$ec_lang['lpn_settings_sec_assets']='အစိတ်အပိုင်းများ';
$ec_lang['lpn_settings_sec_calculation']='တွက်ချက်မှု';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='ဖောက်သည်';
$ec_lang['lpn_labels_customer_note']='ဖောက်သည် အညွှန်းသည် ဤနေရာတွင် အမှန်ခြစ်ထားသော တန်ဖိုးများကို ပြသသည်။ ၎င်းကို မြေပုံပေါ်ရှိ အခြားအညွှန်းများ အားလုံးနှင့် အရွယ်အစား တူညီစွာ ဆွဲသည်။';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='ဖောက်သည် အညွှန်းများကို မြေပုံ ကြည့်ရှုမှု ဤအကျယ် (သို့) ၎င်းထက်ကျဉ်းစဉ်တွင်သာ ဆွဲသည်။ ဇူးမ် အဆင့်တိုင်းတွင် ဆွဲစေလိုပါက ဘောက်စ်ကို ဗလာထားပါ။ မည်သည့် ဇူးမ်အဆင့်တွင်မျှ ဖောက်သည် အညွှန်း လုံးဝ မဆွဲစေလိုပါက 0 ကို ရိုက်ထည့်ပါ။ အညွှန်းအားလုံးအတွက် တူညီသော ဆက်တင်ထက် ကြီးနေပါက ဤဆက်တင်သည် သက်ရောက်မှု မရှိပါ။';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='လက်ရှိ ကြည့်ရှုမှုကို သုံးရန်';
$ec_lang['lpn_settings_page']='စာမျက်နှာ';
$ec_lang['lpn_settings_page_note']='ဤတွက်ချက်စက်တွင်သာ သိမ်းထားပြီး ပရောဂျက်ထဲတွင် မသိမ်းပါ။';
$ec_lang['lpn_settings_hydraulics']='ဟိုက်ဒရောလစ်';
$ec_lang['lpn_settings_quality']='ရေအရည်အသွေး';
$ec_lang['lpn_settings_quality_track']='အရည်အသွေး ကန့်သတ်ချက်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='run တစ်ခုသည် ပိုက်လိုင်းများ တစ်လျှောက် မည်သည့်အရာကို ခြေရာခံသင့်သည်ကို ရွေးပါ - ရေသည် စနစ်ထဲတွင် မည်မျှကြာအောင် ရှိနေခဲ့သည်၊ မည်သည့်နေရာမှ လာသည်၊ (သို့) ခရီးသွားစဉ် တုံ့ပြန်သော ဓာတုပစ္စည်းတစ်ခု။ ဓာတုပစ္စည်းသာလျှင် ကိန်းများ လိုအပ်သည်။';
$ec_lang['lpn_settings_quality_source']='ခြေရာခံ ဆက်စပ်နေရာ';
$ec_lang['lpn_settings_quality_source_tip']='ရေကို ခြေရာခံမည့် ဆက်စပ်နေရာ။ အခြားဆက်စပ်နေရာတိုင်းသည် ထိုနေရာမှ လာသော ၎င်းတို့၏ ရေ ပါဝင်နှုန်းကို ပြသပါလိမ့်မည်။';
$ec_lang['lpn_quality_none']='မရှိ';
$ec_lang['lpn_quality_trace']='ရင်းမြစ် ခြေရာခံမှု';
$ec_lang['lpn_quality_chemical']='တုံ့ပြန်သော ဓာတုပစ္စည်း';
$ec_lang['lpn_quality_needs_run']='ရေအရည်အသွေးကို ရေသည် ခရီးသွားသည်နှင့်အမျှ ပိုက်များတစ်လျှောက် သယ်ဆောင်သွားသောကြောင့်၊ EPANET အင်ဂျင်နှင့် စုစုပေါင်း run အချိန် ပါဝင်သော အချိန်ကာလ အတုယူတွက်ချက်မှု လိုအပ်သည်။ အချိန် အောက်တွင် စုစုပေါင်း လည်ပတ်ချိန် ကို သတ်မှတ်ပြီး တွက်ချက်ရန် ခလုတ်ကို နှိပ်ပါ။';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='ဓာတုပစ္စည်းနှင့် ယူနစ်';
$ec_lang['lpn_quality_chemical_name_tip']='သင်ခြေရာခံနေသော ဓာတုပစ္စည်း၊ ဥပမာ ကလိုရင်း။ EPANET ၏ မူလ ပုံသေအမည် Chemical ကို အသုံးပြုရန် ဤနေရာကို ဗလာချန်ထားပါ။ သင့်အစီရင်ခံစာများတွင် ပြသသော်လည်း တွက်ချက်မှုများတွင် အသုံးမပြုပါ။';
$ec_lang['lpn_quality_mass_units']='ဒြပ်ထု ယူနစ်များ';
$ec_lang['lpn_quality_mass_units_tip']='အရည်အသွေး ရေးသွင်းမှု၏ ယူနစ်ဝက်၊ EPANET ကိုယ်တိုင်၏ ရွေးချယ်စရာ နှစ်ခု။';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='အရည်အသွေး သည်းခံနိုင်မှု';
$ec_lang['lpn_quality_tolerance_tip']='EPANET က ရေအစိတ်အပိုင်း နှစ်ခုကို တစ်ခုတည်းအဖြစ် သတ်မှတ်ခြင်း မပြုမီ၊ ကပ်လျက်ရှိသော ရေအစိတ်အပိုင်း နှစ်ခု၏ ပါဝင်ပမာဏ ကွာခြားနိုင်သည့် ပမာဏ။ ဗလာထားပါက EPANET ၏ မူလ 0.01 ကို သုံးသည်။';
$ec_lang['lpn_quality_diffusivity']='အချိုးအစား ပျံ့နှံ့နိုင်စွမ်း';
$ec_lang['lpn_quality_diffusivity_tip']='ဓာတုပစ္စည်းသည် ကလိုရင်းနှင့် နှိုင်းယှဉ်လျှင် ရေထဲတွင် မည်မျှလွယ်ကူစွာ ပျံ့နှံ့သည်။ ဗလာထားပါက EPANET ၏ မူလ 1.0 ကို သုံးသည်။';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='{chemical} ပါဝင်ပမာဏ';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='ပျမ်းမျှ {chemical} ပါဝင်ပမာဏ';
$ec_lang['lpn_quality_initial']='အစပိုင်း အရည်အသွေး';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='run စတင်သည့်အခါ ဤနေရာ ကိုင်ဆောင်ထားသော ဓာတုပစ္စည်း ပမာဏ။ ရေကန်တစ်ခုသည် run တစ်ခုလုံးအတွက် ၎င်းကိုယ်ပိုင် တန်ဖိုးကို ကိုင်ဆောင်ထားပြီး၊ ၎င်းသည် သန့်စင်ရေးစက်ရုံမှ ထွက်လာသော ကြွင်းကျန်ပမာဏကို ပုံမှန်အားဖြင့် ဖော်ပြသည့်နည်း ဖြစ်သည်။ ဗလာထားလိုက်ပါက ထိုနေရာသည် ဓာတုပစ္စည်း လုံးဝမပါဘဲ စတင်သည်။';
$ec_lang['lpn_result_concentration']='ပါဝင်ပမာဏ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='ခရီးသွားပြီး တုံ့ပြန်ပြီးနောက် ဤနေရာတွင် ဓာတုပစ္စည်း မည်မျှ ကျန်ရှိသည်။ ယူနစ်များသည် ဆက်တင်များ၊ ရေအရည်အသွေး အောက်ရှိ ဓာတုပစ္စည်းအနီးတွင် အမည်ပေးထားသော ယူနစ်များ ဖြစ်သည်။';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='အရင်းအမြစ် အမျိုးအစား';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='ဤနေရာသည် ၎င်းကို ဖြတ်၍ စီးဆင်းနေသော ရေအပေါ် မည်သည့် အမျိုးအစား ဆေးထည့်မှုကို အသုံးချသည်။ Concentration သည် ဤနေရာမှ ကွန်ရက်ထဲသို့ ဝင်လာသော ရေကို Source quality တန်ဖိုးဖြင့် ရောက်ရှိလာသည်ဟု သတ်မှတ်သည်။ Mass booster သည် စီးဆင်းမှု မည်မျှ ရှိသည်ဖြစ်စေ၊ မိနစ်တိုင်း ဓာတုပစ္စည်း ထုထည်တစ်ခု ထပ်ပေါင်းသည်။ Setpoint booster သည် ဤနေရာမှ ထွက်ခွာသော ပါဝင်ပမာဏကို Source quality တန်ဖိုးအထိသာ မြှင့်တင်သည်။ Flow-paced booster သည် ရေထဲတွင် ရှိပြီးသားအပေါ် Source quality တန်ဖိုးကို ထပ်ပေါင်းသည်။';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='မရှိ';
$ec_lang['lpn_source_type_concen']='ပါဝင်ပမာဏ (Concentration)';
$ec_lang['lpn_source_type_mass']='ထုထည် တိုးမြှင့်ခြင်း (Mass booster)';
$ec_lang['lpn_source_type_setpoint']='ကန့်သတ်ချက် တိုးမြှင့်ခြင်း (Setpoint booster)';
$ec_lang['lpn_source_type_flowpaced']='စီးဆင်းမှုအလိုက် တိုးမြှင့်ခြင်း (Flow-paced booster)';
$ec_lang['lpn_source_quality']='အရင်းအမြစ် အရည်အသွေး';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='ဆေးထည့်မှု မည်မျှ ပြင်းသည်။ Mass booster မှလွဲ၍ အခြားအမျိုးအစားတိုင်းအတွက်၊ ဤသည်မှာ ဆက်တင်များ၊ ရေအရည်အသွေး အောက်ရှိ ဓာတုပစ္စည်းအနီးတွင် အမည်ပေးထားသော ယူနစ်များဖြင့် ပါဝင်ပမာဏ ဖြစ်သည်; Mass booster အတွက်မူ ၎င်းသည် မိနစ်တစ်ခုလျှင် ဓာတုပစ္စည်း ထုထည် ဖြစ်သည်။ ဗလာထားလိုက်ပါက ဤနေရာတွင် မည်သည့်အရာမျှ မထပ်ပေါင်းပါ၊ ၎င်းသည် သုညနှင့် မတူပါ - သုညဆိုသည်မှာ လည်ပတ်နေသော်လည်း မည်သည့်အရာမျှ မထပ်ပေါင်းသော ဆေးထည့်မှု ဖြစ်သည်။';
$ec_lang['lpn_source_pattern']='အရင်းအမြစ် ပုံစံ';
$ec_lang['lpn_source_pattern_tip']='run တစ်လျှောက် ဆေးထည့်မှုကို ချိန်ညှိပေးသော အချိန် ပုံစံ၊ တသမတ်တည်း မဟုတ်သော ဆေးထည့်မှုအတွက်။ ပုံစံ မရှိပါက ဆေးထည့်မှုသည် အဆင့်တိုင်းတွင် တူညီသည်ဟု ဆိုလိုသည်။';
$ec_lang['lpn_mixing_model']='ရောနှောမှု မော်ဒယ်';
$ec_lang['lpn_mixing_model_tip']='ဤရေတိုက်ထဲတွင် ရှိပြီးသား ရေသည် ဝင်လာသော ရေနှင့် မည်သို့ ရောနှောသည်။ Complete mixing သည် ရေတိုက်တစ်ခုလုံးကို တစ်ပြိုင်နက် လှုပ်ရှားစေသည်။ Two-compartment mixing သည် ဝင်ပေါက်ဇုန်ကို ဦးစွာ ဖြည့်ပြီး ကျန်ရေကို ဆက်လက်ပေးပို့သည်။ FIFO plug flow သည် ရေကို ရောက်ရှိလာသည့်အစီအစဉ်အတိုင်း အတွင်းသို့ ရွှေ့ပေးသည်။ LIFO plug flow သည် ၎င်းကို စုပုံထားသောကြောင့်၊ နောက်ဆုံးဝင်ရေသည် ပထမဆုံးထွက်ရေ ဖြစ်သည်။ ရွေးချယ်မှုသည် ရေအသက်အရွယ်နှင့် ကြွင်းကျန်ပမာဏကို ပြောင်းလဲစေပြီး၊ ဖိအား (သို့) စီးဆင်းမှု မည်သည့်အရာကိုမျှ မပြောင်းလဲစေပါ။';
$ec_lang['lpn_mixing_mixed']='အပြည့်အဝ ရောနှောမှု (Complete mixing)';
$ec_lang['lpn_mixing_2comp']='နှစ်ပိုင်း ရောနှောမှု (Two-compartment mixing)';
$ec_lang['lpn_mixing_fifo']='FIFO plug flow';
$ec_lang['lpn_mixing_lifo']='LIFO plug flow';
$ec_lang['lpn_mixing_fraction']='ရောနှောမှု ဆက်စပ်ကိန်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='ဝင်ပေါက်ဇုန်ကသုံးသော ရေတိုက် ပမာဏ၏ ဝေစုကို 0 နှင့် 1 ကြားတွင် ဖော်ပြသည်။ Two-compartment mixing တစ်ခုတည်းသာ ၎င်းကို သုံးသည်။ ဗလာထားလိုက်ပါက ရေတိုက်တစ်ခုလုံးသည် ဝင်ပေါက်ဇုန် ဖြစ်သွားမည်ဖြစ်ပြီး၊ ၎င်းသည် EPANET က ယူဆထားသည့်အတိုင်း ဖြစ်သည်။';
$ec_lang['lpn_reaction_bulk']='အားလုံးထဲ တုံ့ပြန်မှု ကိန်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='ကိုယ်ပိုင် တန်ဖိုး မကိုင်ဆောင်သော ပိုက်တိုင်းအတွက် အသုံးပြုသော၊ ရေ၏ ကိုယ်ထည်အတွင်း ဖြစ်ပေါ်သည့် တုံ့ပြန်မှု။ အနုတ်ဂဏန်းသည် ဓာတုပစ္စည်းကို ယိုယွင်းစေပြီး အပေါင်းဂဏန်းသည် တိုးစေသည်။ တင်သွင်းထားသော EPANET ဖိုင်တစ်ခုက အခြားအဆင့်ကို ဖော်ပြထားခြင်း မရှိလျှင်၊ တုံ့ပြန်မှုသည် ပထမအဆင့် ဖြစ်ပြီး၊ ကိန်းသည် 1/day ရှိ နှုန်းတစ်ခု ဖြစ်သည်။ ဗလာထားသော ဘောက်စ်သည် အားလုံးထဲ တုံ့ပြန်မှု မရှိကြောင်း ဆိုလိုသည်။';
$ec_lang['lpn_reaction_wall']='နံရံ တုံ့ပြန်မှု ကိန်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='ကိုယ်ပိုင် တန်ဖိုး မကိုင်ဆောင်သော ပိုက်တိုင်းအတွက် အသုံးပြုသော၊ ပိုက်နံရံ၌ ဖြစ်ပေါ်သည့် တုံ့ပြန်မှု။ အနုတ်ဂဏန်းသည် ဓာတုပစ္စည်းကို ယိုယွင်းစေသည်။ တင်သွင်းထားသော EPANET ဖိုင်တစ်ခုက အခြားအဆင့်ကို ဖော်ပြထားခြင်း မရှိလျှင်၊ တုံ့ပြန်မှုသည် ပထမအဆင့် ဖြစ်ပြီး၊ ကိန်းသည် ပရောဂျက် အလျားယူနစ်ဖြင့် ရေးထားသော တစ်နေ့လျှင် အလျား ဖြစ်သည်။ ဗလာထားသော ဘောက်စ်သည် နံရံ တုံ့ပြန်မှု မရှိကြောင်း ဆိုလိုသည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='ဤပိုက်တစ်ခုတည်း ကိုယ်တိုင်။ ဗလာထားလိုက်ပါက ဤပိုက်သည် ဆက်တင်များ၊ ရေအရည်အသွေး အောက်ရှိ ကွန်ရက်တစ်ခုလုံးအတွက် သတ်မှတ်ထားသော ကိန်းကို သုံးသည်။';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='တုံ့ပြန်မှု ကိန်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='ဤရေတိုက်ထဲ ကိုင်ဆောင်ထားသော ရေရှိ တုံ့ပြန်မှု၊ 1/day ရှိ နှုန်းတစ်ခုအဖြစ်။ အနုတ်ဂဏန်းသည် ဓာတုပစ္စည်းကို ယိုယွင်းစေပြီး အပေါင်းဂဏန်းသည် တိုးစေသည်။ ရေသည် မည်သည့်ပိုက်တွင်ထက်မဆို ရေတိုက်တစ်ခုတွင် ပိုကြာအောင် ရပ်တန့်နေတတ်သောကြောင့်၊ ကြွင်းကျန်ပမာဏ ဆုံးရှုံးရာနေရာသည် များသောအားဖြင့် ဤနေရာ ဖြစ်သည်။ ဗလာထားလိုက်ပါက ရေတိုက်သည် ဆက်တင်များ၊ ရေအရည်အသွေး အောက်ရှိ ကွန်ရက်တစ်ခုလုံးအတွက် သတ်မှတ်ထားသော အားလုံးထဲ တုံ့ပြန်မှု ကိန်းကို သုံးသည်။';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='အားလုံးထဲ တုံ့ပြန်မှု';
$ec_lang['lpn_reaction_wall_short']='နံရံ တုံ့ပြန်မှု';
$ec_lang['lpn_reaction_tank_short']='တုံ့ပြန်မှု';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/ရက်';
$ec_lang['lpn_reaction_day']='ရက်';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='အားလုံးထဲ တုံ့ပြန်မှု အဆင့်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='ရေ၏ ကိုယ်ထည်အတွင်း တုံ့ပြန်မှုအတွက် ပြင်းအား (concentration) ကို ချီးမြှင့်သည့် ထပ်ကိန်း (exponent)။ အစစ်ဂဏန်း မည်သည့်တန်ဖိုးမဆို ခွင့်ပြုသည်။ 1 သည် ပုံမှန်တန်ဖိုးဖြစ်ပြီး ကလိုရင်း ယိုယွင်းမှု မော်ဒယ်တင်ခြင်း အများစုတွင် သုံးသည်။ 0 က ဓာတုပစ္စည်း မည်မျှရှိသည်နှင့် မသက်ဆိုင်ဘဲ နှုန်းကို ထားရှိစေသည်။';
$ec_lang['lpn_reaction_order_tank']='ရေတိုက် တုံ့ပြန်မှု အဆင့်';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='ရေတိုက်ထဲ ကိုင်ဆောင်ထားသော ရေတွင် တုံ့ပြန်မှုအတွက် ပြင်းအားကို ချီးမြှင့်သည့် ထပ်ကိန်း၊ ရေတိုက်တစ်ခုသည် ပိုက်များနှင့် မတူညီသော အဆင့်တွင် တုံ့ပြန်နိုင်စေရန် အားလုံးထဲ တုံ့ပြန်မှု အဆင့်နှင့် သီးခြားထားသည်။ အစစ်ဂဏန်း မည်သည့်တန်ဖိုးမဆို ခွင့်ပြုပြီး 1 သည် ပုံမှန်တန်ဖိုးဖြစ်သည်။ EPANET က ၎င်းကို ဖိုင်ထဲတွင် ORDER TANK ဟု ဖော်ပြပြီး ၎င်း၏ကိုယ်ပိုင် interface တွင် ဘောက်စ် မပေးထားပါ။';
$ec_lang['lpn_reaction_order_wall']='နံရံ တုံ့ပြန်မှု အဆင့်';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 ဆိုသည်မှာ ပေးထားသော ကိန်း(များ)အတိုင်း နံရံတုံ့ပြန်မှု ဖြစ်ပေါ်သည်ဟု ဆိုလိုသည်။ 0 ဆိုသည်မှာ မဖြစ်ပေါ်ပါ။ ၎င်းသည် ဖွင့်/ပိတ် ခလုတ်တစ်ခု ဖြစ်သည်။ ပုံမှန်တန်ဖိုးမှာ 1 ဖြစ်သည်။';
$ec_lang['lpn_reaction_order_unstated']='မဖော်ပြထားပါ';
$ec_lang['lpn_reaction_order_zero']='0၊ သုည အဆင့်';
$ec_lang['lpn_reaction_order_first']='1၊ ပထမ အဆင့်';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='ကန့်သတ် စွမ်းရည်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='ဓာတုပစ္စည်းသည် သုညသို့ ယိုယွင်းသွားခြင်း (သို့) အဆုံးမရှိ တိုးပွားသွားခြင်းအစား ရွေ့လျားသွားသည့် ပြင်းအားတစ်ခု။ ရေသည် ၎င်းအနီးသို့ ရောက်လာသည်နှင့်အမျှ တုံ့ပြန်မှုသည် နှေးလာပြီး ထိုနေရာတွင် ရပ်တန့်သွားသည်။ တသမတ်တည်း ယူနစ်များကို သုံးပါ။ ဗလာထားပါက ကန့်သတ်ချက် မရှိပါ။';
$ec_lang['lpn_reaction_rough_corr']='ကြမ်းတမ်းမှု ဆက်စပ်ချက်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='နံရံတုံ့ပြန်မှုကို ပိုက်တစ်ခုစီ၏ ကြမ်းတမ်းမှုနှင့် ဆက်စပ်စေသဖြင့် ပိုကြမ်းတမ်းသော ပိုက်သည် ပိုမြန်စွာ တုံ့ပြန်သည်။ ၎င်းကို သတ်မှတ်ထားလျှင် ပိုက်တစ်ခုစီအတွက် နံရံ ကိန်းတစ်ခုကို ထိုပိုက်၏ ကြမ်းတမ်းမှုမှ တွက်ချက်ပြီး၊ အထက်ရှိ နံရံကိန်းတစ်ခုတည်းကို နောက်တစ်ဖန် မသုံးတော့ပါ။ ဗလာထားပါက အသုံးမပြုပါ။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='ဤစာမျက်နှာသည် ကိုယ်ပိုင် တုံ့ပြန်မှု ကိန်း တစ်ခုမျှ မပေးပါ။ ၎င်းအတွက် စံသတ်မှတ်ထားသော စမ်းသပ်မှု မရှိသကဲ့သို့၊ ထုတ်ဝေထားသော လက်တွေ့ကွင်းဆင်း တန်ဖိုးများသည် ရေအမျိုးအစားတူညီသော်လည်း ဆယ်ဆအထိ ကွာခြားနိုင်သောကြောင့်၊ ဤနေရာတွင် ပေးသော ဂဏန်းတစ်ခုကို အကြံပြုချက်တစ်ခုအဖြစ် ဖတ်မှတ်ပါလိမ့်မည်။ သင်ကိုယ်တိုင် တိုင်းတာထားသော (သို့) ကိုးကားနိုင်သော တန်ဖိုးတစ်ခုကို ထည့်ပါ၊ (သို့) မတုံ့ပြန်သော ဓာတုပစ္စည်းတစ်ခုအတွက် ဘောက်စ်များကို ဗလာထားပါ။';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='စွမ်းအင်';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='အစီရင်ခံစာများ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='ကွန်ရက်တစ်ခု တွက်ချက်ပြီးနောက် ဤစာမျက်နှာက ထုတ်လုပ်သော ပြီးစီးသော အဖြေများ - ရေတင်စက်များ ကုန်ကျစရိတ်၊ အခြေအနေများ မည်သို့ နှိုင်းယှဉ်သည်၊ EPANET ဖြေရှင်းစက်ကိုယ်တိုင် ပုံနှိပ်ခဲ့သောအရာ။';
$ec_lang['lpn_reports_epanet']='EPANET run (လည်ပတ်မှု)';
$ec_lang['lpn_energy_title']='ရေတင်စက် စွမ်းအင် အစီရင်ခံစာ';
$ec_lang['lpn_energy_menu']='ရေတင်စက် စွမ်းအင်';
$ec_lang['lpn_energy_menu_tip']='နောက်ဆုံး အချိန်ကာလ အတုယူတွက်ချက်မှုတွင် ရေတင်စက်တစ်ခုစီ မည်မျှ အချိုးဖြင့် လည်ပတ်ခဲ့သည်၊ မည်မျှ ပါဝါ သုံးခဲ့သည်၊ ကုန်ကျစရိတ် မည်မျှ ရှိသည်။';
$ec_lang['lpn_energy_efficiency']='ရေတင်စက် ထိရောက်မှု (ရာခိုင်နှုန်း)';
$ec_lang['lpn_energy_efficiency_tip']='ကိုယ်ပိုင် ထိရောက်မှု ကွေးမျဉ်း မကိုင်ဆောင်သော ရေတင်စက်တိုင်းအတွက် အသုံးပြုသော ကြိုးမှရေအထိ ထိရောက်မှု။ မည်သည့်အရာမျှ မဖော်ပြထားလျှင် EPANET သည် ၇၅ ရာခိုင်နှုန်း သုံးသည်။';
$ec_lang['lpn_energy_price']='ပါဝါ ဈေးနှုန်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='ကီလိုဝပ်နာရီတစ်ခု၏ ကုန်ကျစရိတ်။ ၎င်းသည် ကိုယ်ပိုင် ဈေးနှုန်း မကိုင်ဆောင်သော ရေတင်စက်တိုင်းအတွက် သက်ရောက်သည်။ ဗလာထားလိုက်ပါက အစီရင်ခံစာရှိ ကုန်ကျစရိတ်တိုင်းသည် သုည ဖြစ်သွားမည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='ဤရေတင်စက်တွင် ကီလိုဝပ်နာရီတစ်ခု၏ ကုန်ကျစရိတ်။ ဗလာထားလိုက်ပါက ရေတင်စက်သည် ဆက်တင်များ၊ စွမ်းအင် အောက်ရှိ ကွန်ရက်တစ်ခုလုံးအတွက် သတ်မှတ်ထားသော ဈေးနှုန်းကို ပေးသည်။';
$ec_lang['lpn_energy_price_pattern']='ဈေးနှုန်း ပုံစံ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='ပုံစံ အဆင့်တိုင်းတွင် ဈေးနှုန်းကို မြှောက်ပေးသော ပုံစံတစ်ခု၊ အလုပ်များချိန်မဟုတ်သော နှုန်းထားတစ်ခုကို ဖော်ပြသည့်နည်း ဖြစ်သည်။ run တစ်လျှောက် ဈေးနှုန်းတစ်ခုတည်းအတွက် ဗလာထားပါ။';
$ec_lang['lpn_energy_demand_charge']='အမြင့်ဆုံး လိုအင် ကုန်ကျစရိတ်';
$ec_lang['lpn_energy_demand_charge_tip']='စနစ်ထဲရှိ ရေတင်စက်များ လိုအင်ပြုသော အမြင့်ဆုံး ဝန်အတွက် ဌာနက kW တစ်ခုလျှင် မည်မျှ ကောက်ခံသည်။';
$ec_lang['lpn_energy_currency']='ငွေကြေး';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='ဤနေရာတွင် သင်ရေးထားသည့်အရာသည် ငွေကြေးဂဏန်းတိုင်း၏ ဘေးတွင် ပုံနှိပ်ပေးသည်။ ၎င်းသည် အညွှန်းတစ်ခုသာ ဖြစ်သည်။ ဈေးနှုန်းများနှင့် ကုန်ကျစရိတ်များကို မည်သည့်အခါမျှ ပြောင်းလဲပေးခြင်း မရှိသောကြောင့်၊ ဤနေရာတွင် သင်ရေးထားသော ငွေကြေးဖြင့် ဈေးနှုန်းများကို ရေးပါ။';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='ဤစာမျက်နှာသည် ကိုယ်ပိုင် ဈေးနှုန်း တစ်ခုမျှ မပေးပါ။ ပါဝါ ကုန်ကျစရိတ်သည် ဌာန၊ နိုင်ငံ၊ အချိန်နှင့် နှစ်ပေါ် မူတည်သောကြောင့်၊ ဤနေရာတွင် ပေးသော ဂဏန်းတစ်ခုကို အကြံပြုချက်တစ်ခုအဖြစ် ဖတ်မှတ်ပါလိမ့်မည်။ သင့်ကိုယ်ပိုင် နှုန်းထားမှ ဈေးနှုန်းကို ထည့်ပါ။';
$ec_lang['lpn_energy_needs_run']='ရေတင်စက် စွမ်းအင်သည် run တစ်လျှောက် ပေါင်းစည်းထားသော ပါဝါ ဖြစ်သောကြောင့်၊ EPANET အင်ဂျင်နှင့် စုစုပေါင်း run အချိန် ပါဝင်သော အချိန်ကာလ အတုယူတွက်ချက်မှု လိုအပ်သည်။ ဆက်တင်များ၊ တွက်ချက်မှု၊ အချိန် တွင် စုစုပေါင်း လည်ပတ်ချိန် ကို သတ်မှတ်ပြီး၊ တွက်ချက်ရန် ခလုတ်ကို နှိပ်ပါ၊ ထို့နောက် ရေ၊ အစီရင်ခံစာများ၊ ရေတင်စက် စွမ်းအင် ကို ဖွင့်ပါ။';
$ec_lang['lpn_energy_no_pumps']='ဤကွန်ရက်တွင် ရေတင်စက် မရှိသောကြောင့်၊ ပါဝါ ဆွဲသုံးနေသည့်အရာ မရှိပါ။';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='အခြေအနေ နှိုင်းယှဉ်ချက်';
$ec_lang['lpn_scncmp_menu_tip']='ဤပရောဂျက်ရှိ အခြေအနေတိုင်းကို ဖြေရှင်းပြီး ယှဉ်တွဲကြည့်ပါ - တစ်ခုစီရှိ အနိမ့်ဆုံးဖိအားနှင့် အမြင့်ဆုံးအလျင်။';
$ec_lang['lpn_scncmp_running']='အခြေအနေတိုင်းကို ဖြေရှင်းနေသည်…';
$ec_lang['lpn_scncmp_empty']='မည်သည့်အရာမျှ မရေးဆွဲထားသေးသောကြောင့်၊ ဖြေရှင်းရန် မည်သည့်အရာမျှ မရှိပါ။';
$ec_lang['lpn_scncmp_col_maxvelocity']='အမြင့်ဆုံးအလျင်';
$ec_lang['lpn_scncmp_at']='{id} တွင် {value}';
$ec_lang['lpn_scncmp_current']='(ယခုဖွင့်ထားသည်)';
$ec_lang['lpn_scncmp_note']='အခြေအနေတိုင်းကို ပုံကြမ်း၏ မိတ္တူတစ်စောင်မှ ဖြေရှင်းသည်။ ဤနေရာရှိ မည်သည့်အရာမျှ ပရောဂျက်ကို မပြောင်းလဲစေပါ၊ သင်အလုပ်လုပ်နေသော အခြေအနေကိုလည်း ယခင်အတိုင်းပင် ချန်ထားသည်။';
$ec_lang['lpn_energy_over']='{time} ၏ အချိန်ကာလ အတုယူတွက်ချက်မှုအတွက်';
$ec_lang['lpn_energy_col_pump']='ရေတင်စက်';
$ec_lang['lpn_energy_col_running']='run ၏ %';
$ec_lang['lpn_energy_col_effic']='ထိရောက်မှု';
$ec_lang['lpn_energy_col_avg_kw']='ပျမ်းမျှ kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='ဤရေတင်စက် လည်ပတ်နေစဉ် သုံးသော ပျမ်းမျှ ပါဝါ။ အလုပ်မလုပ်သော ကာလများကို ပျမ်းမျှမတွက်ထားသောကြောင့်၊ အချိန်ကာလ အတုယူတွက်ချက်မှု အများစုတွင် အလုပ်မလုပ်ခဲ့သော ရေတင်စက်တစ်ခုသည်လည်း ၎င်း လည်ပတ်စဉ် သုံးခဲ့သော ပါဝါကို ဖော်ပြသေးသည်။';
$ec_lang['lpn_energy_col_peak_kw']='အမြင့်ဆုံး kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='ကုန်ကျစရိတ်';
$ec_lang['lpn_energy_total_kwh']='သုံးစွဲခဲ့သော စွမ်းအင်';
$ec_lang['lpn_energy_total_energy_cost']='စွမ်းအင် ကုန်ကျစရိတ်';
$ec_lang['lpn_energy_peak_kw']='အမြင့်ဆုံး ပါဝါ သုံးစွဲမှု';
$ec_lang['lpn_energy_total_demand_charge']='အမြင့်ဆုံး လိုအင် ကုန်ကျစရိတ်';
$ec_lang['lpn_energy_total_cost']='စုစုပေါင်း ကုန်ကျစရိတ်';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='အခြေအနေ';
$ec_lang['lpn_reports_status_tip']='နောက်ဆုံး အချိန်ကာလ အတုယူတွက်ချက်မှုတစ်လျှောက် အချိန်အစီအစဉ်အတိုင်း ပြောင်းလဲသွားသည်များ - ရေတင်စက်များနှင့် ဗားလ်များ ဖွင့်ခြင်း (သို့) ပိတ်ခြင်း၊ ရေတိုက်များ ပြည့်ခြင်း၊ ကုန်ခြင်း၊ ပြည့်သွားခြင်း (သို့) ခန်းခြောက်သွားခြင်း၊ ပြီး အပြည့်အဝ မစုစည်းနိုင်ခဲ့သော အဆင့်များ။';
$ec_lang['lpn_status_title']='အခြေအနေ အစီရင်ခံစာ';
$ec_lang['lpn_status_needs_run']='အခြေအနေ အစီရင်ခံစာသည် အချိန်ကာလ အတုယူတွက်ချက်မှုအတွင်း ပြောင်းလဲသွားသည်များကို စာရင်းပြုစုသည်။ ဆက်တင်များ၊ တွက်ချက်မှု၊ အချိန် တွင် စုစုပေါင်း လည်ပတ်ချိန် ကို သတ်မှတ်ပြီး၊ တွက်ချက်ရန် ကို နှိပ်ပါ၊ ထို့နောက် ရေ၊ အစီရင်ခံစာများ၊ အခြေအနေ အစီရင်ခံစာ ကို ဖွင့်ပါ။';
$ec_lang['lpn_status_empty']='ဤ run အတွင်း မည်သည့်အခြေအနေမျှ မပြောင်းလဲခဲ့ပါ။';
$ec_lang['lpn_status_col_event']='ဖြစ်ရပ်';
$ec_lang['lpn_status_opened']='{type} {id} ဖွင့်လိုက်သည်';
$ec_lang['lpn_status_closed']='{type} {id} ပိတ်လိုက်သည်';
$ec_lang['lpn_status_filling']='{type} {id} ရေတက်နေသည်';
$ec_lang['lpn_status_emptying']='{type} {id} ရေကျနေသည်';
$ec_lang['lpn_status_full']='{type} {id} ပြည့်နေသည်';
$ec_lang['lpn_status_dry']='{type} {id} ခန်းခြောက်နေသည်';
$ec_lang['lpn_status_no_converge']='ဤအဆင့်ရှိ ဟိုက်ဒရောလစ် အဖြေသည် အပြည့်အဝ မစုစည်းနိုင်ခဲ့ပါ; ပြထားသော ကိန်းများသည် ၎င်း၏ နောက်ဆုံး ထပ်ခါထပ်ခါ တွက်ချက်မှု ဖြစ်သည်။';
$ec_lang['lpn_status_note']='ဇယားများ panel နှင့် အပြည့်အစုံ အစီရင်ခံစာ တို့ကို ဖတ်ရာ အချိန်ကာလ အတုယူတွက်ချက်မှု run တစ်ခုတည်းမှ ဖတ်ထားသည်။ ပြောင်းလဲမှုတစ်ခုကိုသာ စာရင်းပြုစုထားပြီး၊ အဆင့်တိုင်းကို မဟုတ်ပါ။';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='အပြည့်အစုံ';
$ec_lang['lpn_reports_full_tip']='နောက်ဆုံး run ၏ အစီရင်ခံ အချိန်အဆင့်တိုင်းရှိ ဆက်စပ်နေရာတိုင်းနှင့် လိုင်းတိုင်းကို၊ သင်ဒေါင်းလုတ်ချ (သို့) ပရင့်ထုတ်နိုင်သော ဇယားတစ်ခုအဖြစ်။';
$ec_lang['lpn_full_title']='အပြည့်အစုံ အစီရင်ခံစာ';
$ec_lang['lpn_full_needs_run']='အပြည့်အစုံ အစီရင်ခံစာသည် အစီရင်ခံ အချိန်အဆင့်တိုင်းရှိ ဆက်စပ်နေရာတိုင်းနှင့် လိုင်းတိုင်းကို စာရင်းပြုစုသည်။ တွက်ချက်ရန် ကို နှိပ်ပါ၊ ထို့နောက် ရေ၊ အစီရင်ခံစာများ၊ အပြည့်အစုံ အစီရင်ခံစာ ကို ဖွင့်ပါ။';
$ec_lang['lpn_full_note']='ဆက်စပ်နေရာ (သို့) လိုင်းတစ်ခုစီ၊ အစီရင်ခံ အချိန်အဆင့်တစ်ခုစီအတွက် အတန်းတစ်ခု၊ ဇယားများ panel ပေါ်တွင် ပြထားသော ယူနစ်များဖြင့်။ ဗလာဆဲလ်သည် ထိုပမာဏ မရှိသော ကော်လံဖြစ်သည်။ ဒေါင်းလုတ်ချခြင်း (သို့) ပရင့်ထုတ်ခြင်းသည် အချိန်အဆင့်တိုင်းကို သယ်ဆောင်သည်; အောက်ပါ ဇယားသည် တစ်ကြိမ်လျှင် တစ်ခုကိုသာ ပြသသည်။';
$ec_lang['lpn_full_step_label']='အချိန် အဆင့်';
$ec_lang['lpn_full_download_csv']='CSV ဒေါင်းလုတ်ချရန်';
$ec_lang['lpn_full_print']='အစီရင်ခံစာ ပရင့်ထုတ်ရန်';
$ec_lang['lpn_full_col_time']='အချိန်';
$ec_lang['lpn_full_col_type']='အမျိုးအစား';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='အတန်း {n} ခု။';
$ec_lang['lpn_energy_no_price']='ပါဝါ ဈေးနှုန်း မဖော်ပြထားသောကြောင့်၊ ဤနေရာရှိ ကုန်ကျစရိတ်တိုင်းသည် သုည ဖြစ်သည်။ ဆက်တင်များ၊ စွမ်းအင် အောက်တွင် တစ်ခု သတ်မှတ်ပါ။';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='ဤကွန်ရက်သည် ဈေးနှုန်း သုညဟု ဖော်ပြထားသောကြောင့်၊ ဤနေရာရှိ ကုန်ကျစရိတ်တိုင်းသည် သုည ဖြစ်သည်။ ဆက်တင်များ၊ စွမ်းအင် အောက်တွင် ပြောင်းပါ။';
$ec_lang['lpn_energy_curve_note']='ဤရေတင်စက်များသည် အမှတ်မပါသော ထိရောက်မှု ကွေးမျဉ်းကို ရည်ညွှန်းသည် - {ids}။ ၎င်းတို့သည် ကွန်ရက်တစ်ခုလုံးအတွက် သတ်မှတ်ထားသော ထိရောက်မှုဖြင့် လည်ပတ်ခဲ့သည်။';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_rank']='အဆင့်';
$ec_lang['lpn_labels_col_drop']='ချန်ရန်';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='ဆက်စပ်နေရာနှင့် ဆက်သွယ်မှု';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='ညီမျှသော အကွာအဝေး';
$ec_lang['lpn_color_mode_quantile']='Quantile (အရေအတွက် ညီမျှ)';
$ec_lang['lpn_color_mode_jenks']='သဘာဝ ပိုင်းခြားမှု (Jenks)';
$ec_lang['lpn_color_mode_stddev']='စံသွေဖည်မှု';
$ec_lang['lpn_color_mode_pretty']='လှပသော (ဂဏန်းလုံး)';
$ec_lang['lpn_color_mode_log']='လော်ဂရစ်သမ်';
$ec_lang['lpn_color_mode_manual']='ကိုယ်တိုင် သတ်မှတ်ရန်';

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
$ec_lang['lpn_library_menu']='စာရင်းများ';
$ec_lang['lpn_library_menu_tip']='ဤပရောဂျက်၏ လိုအင်ပုံစံများ၊ ရေတင်စက် မျဉ်းကွေးများနှင့် ထိန်းချုပ်မှု စည်းမျဉ်းများကို စီမံပါ။';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='ပုံစံများ';
$ec_lang['lpn_library_patterns_tip']='ပုံစံတစ်ခုသည် ထပ်ခါထပ်ခါ ဖြစ်နေသော မြှောက်ကိန်း စာရင်းတစ်ခု ဖြစ်သည်။ တစ်ခုစီသည် ပုံစံ အချိန်ခြေလှမ်း တစ်ခုအတွက် အသုံးပြုသဖြင့်၊ တစ်နာရီ ခြေလှမ်းဖြင့် ဂဏန်း 24 လုံးသည် ထပ်ခါထပ်ခါ ဖြစ်နေသော တစ်နေ့တာ ဖြစ်လာသည်။ 1.5 မြှောက်ကိန်းရှိသော လိုအင် 10 သည် ထိုအခိုက်အတန့်တွင် 15 ဖြစ်သည်။';
$ec_lang['lpn_library_curves']='မျဉ်းကွေးများ';
$ec_lang['lpn_library_curves_tip']='ကွေးမျဉ်းတစ်ခုသည် တစ်ခုခု၏ စွမ်းဆောင်ရည်ကို ဖော်ပြသည့် အမှတ်များစာရင်း ဖြစ်သည် - ရေတင်စက်တစ်ခုသည် စီးဆင်းမှုတစ်ခုစီတွင် မည်မျှ ဖိမြင့်ဆင့် ထပ်ပေါင်းသည်၊ ထိုစီးဆင်းမှုတွင် မည်မျှ ထိရောက်သည်၊ (သို့) ဗားလ်တစ်ခုသည် စီးဆင်းမှုတစ်ခုစီတွင် မည်မျှ ဖိမြင့်ဆင့် ဆုံးရှုံးသည်။';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='ကွေးမျဉ်းများကို ရေတင်စက်များနှင့် ဗားလ်များတွင် တွဲထားသည်။ ရေတင်စက် ဖိမြင့်ဆင့် ကွေးမျဉ်းအတွက်၊ run သည် ပြထားသည့်အတိုင်း အမှတ်များကို ဖြတ်၍ ကိုက်ညီအောင်ဆွဲထားသော ကွေးမျဉ်းကို အသုံးပြုသည်; အခြားအမျိုးအစားတိုင်းအတွက်မူ ပြထားသည့်အတိုင်း အမှတ်များကို တည့်တည့်မျဉ်းများဖြင့် ချိတ်ဆက်သည်။';
$ec_lang['lpn_library_curve_add']='ကွေးမျဉ်း ထည့်ရန်';
$ec_lang['lpn_library_curve_type_tip']='ဤကွေးမျဉ်းက ဖော်ပြသည့်အရာ';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='ကွေးမျဉ်း အမျိုးအစား';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='ညီမျှခြင်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='အမှတ်များကို ဖြတ်၍ ကိုက်ညီအောင်ဆွဲထားသော ကွေးမျဉ်းနှင့် အောက်ပါ ဇယားပေါ်တွင် ဆွဲထားသော မျဉ်း။ ၎င်းကို ပြသတိုင်း အမှတ်များမှ ပြန်လည် တွက်ချက်ပြီး၊ မည်သည့်အခါမျှ မသိမ်းဆည်းထားပါ။ ၎င်း၏ ဂဏန်းများသည် အထက်ရှိ ဇယားပြသည့် ယူနစ်များ ဖြစ်သည်။ တွင်ပါ ဖြေရှင်းစက်သည် ဤညီမျှခြင်းအပေါ် အခြေခံ run လုပ်ပြီး; EPANET အင်ဂျင်ကမူ အမှတ်များကိုယ်တိုင်ကို ဖတ်သည်။';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='spreadsheet တစ်ခုတွင် ကော်လံတစ်ခု (သို့) နှစ်ခုကို ရွေးပြီး ကူးယူကာ၊ သင်ချင်သည့် ပထမဆုံး ကွက်ထဲသို့ ကူးထည့်ပါ။ လိုအပ်သလို အတန်းများကို ထပ်ထည့်ပေးသည်။ EPANET ဖိုင်တစ်ခုမှ တိုက်ရိုက် ကူးယူထားသော ကွေးမျဉ်းအမည်ပါ ကြောင်းများကိုလည်း ကူးထည့်နိုင်သည်။';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='ဖော်ပြချက်';
$ec_lang['lpn_library_curve_note_tip']='ဤကွေးမျဉ်းသည် မည်သည့်အရာ ဖြစ်သည်ကို သင့်ကိုယ်ပိုင် စကားလုံးများဖြင့်။ ၎င်းကို EPANET ဖိုင်တစ်ခုတွင် ကွေးမျဉ်းအပေါ်၌ ရေးထားပြီး ထိုနေရာမှ ပြန်ဖတ်သည်။';
$ec_lang['lpn_library_curve_remove_point']='ဤအမှတ်ကို ဖယ်ရှားရန်';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='အမှတ်များ ကူးယူရန်';
$ec_lang['lpn_library_curve_copy_tip']='အမှတ်တိုင်းကို ကော်လံနှစ်ခုအဖြစ် ကူးယူပြီး spreadsheet တစ်ခုထဲသို့ ကူးထည့်ရန် အသင့်ဖြစ်စေသည်။';
$ec_lang['lpn_library_curve_copy_manual']='ဤအမှတ်များကို ကူးယူရန်';
$ec_lang['lpn_library_curve_used_by']='ဤကွေးမျဉ်းကို အသုံးပြုနေသော အစိတ်အပိုင်းများ';
$ec_lang['lpn_library_curve_unused']='ဤကွေးမျဉ်းကို မည်သည့်အရာမျှ မသုံးပါ။';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='ဤကွေးမျဉ်းကို အစိတ်အပိုင်း {count} ခု အသုံးပြုနေသည် - {ids}။ ၎င်းတို့ကို အခြားကွေးမျဉ်းတစ်ခုသို့ ဦးစွာ ညွှန်ပြပြီးမှ ဤတစ်ခုကို ဖျက်ပါ။';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='ပိုက်အမျိုးအစားများ';
$ec_lang['lpn_library_pipetypes_tip']='ပိုက်အမျိုးအစားတစ်ခုသည် ပိုက်များစွာ ၎င်းတို့၏ အချင်း၊ ကြမ်းတမ်းမှုနှင့် တုံ့ပြန်မှု ကိန်းများအတွက် ကိုးကားနိုင်သော အနက်ဖွင့်ဆိုချက် ဖြစ်သည်။ အနက်ဖွင့်ဆိုချက်ကို တည်းဖြတ်ခြင်းက ၎င်းကို အသုံးပြုသော ပိုက်တိုင်းကို တည်းဖြတ်စေသည်။';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='ပရောဂျက်တစ်ခုစီတွင် မိမိကိုယ်ပိုင် ပိုက်အမျိုးအစား စာရင်း ရှိသည်။ ပိုက်အမျိုးအစား အနက်ဖွင့်ဆိုချက်တွင် ဂုဏ်သတ္တိများကို ဗလာထားနိုင်သည်။ ဥပမာ - ကြမ်းတမ်းမှုကို ဖော်ပြထားပြီး အချင်း မဖော်ပြထားသော ပိုက်အမျိုးအစားသည် ရပါသည်။ သင်သည် ပိုက်အမျိုးအစားများကို ပိုက်များ၏ ဂုဏ်သတ္တိတည်းဖြတ်ကိရိယာတွင် ချိတ်ဆက်ပါသည်။ ဤနေရာတွင် အနက်ဖွင့်ဆိုချက်တစ်ခုကို တည်းဖြတ်ခြင်းက ၎င်းကို ကိုးကားသော ပိုက်တိုင်းကို ပြောင်းလဲစေသည်။';
$ec_lang['lpn_library_pipetype_add']='ပိုက်အမျိုးအစား ထည့်ရန်';
$ec_lang['lpn_library_pipetype_blank_tip']='ပိုက်အမျိုးအစား အနက်ဖွင့်ဆိုချက်ရှိ ဗလာ ဂုဏ်သတ္တိများကို ပိုက်တစ်ခုစီအတွက် သီးခြား ရိုက်ထည့်ရန် ချန်ထားခြင်း ဖြစ်သည်။';
$ec_lang['lpn_library_pipetype_used_by']='ဤအမျိုးအစားကို အသုံးပြုနေသော ပိုက်များ';
$ec_lang['lpn_library_pipetype_unused']='ဤပိုက်အမျိုးအစားကို မည်သည့်အရာမျှ မသုံးပါ။';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='ဤပိုက်အမျိုးအစားကို ပိုက် {count} ခု အသုံးပြုနေသည် - {ids}။ ဖျက်ခြင်းမပြုမီ ၎င်းတို့မှ ဖြုတ်ချပါ။';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='ပိုက်အမျိုးအစား';
$ec_lang['lpn_field_pipetype_tip']='ဤပိုက် အသုံးပြုနေသော ပရောဂျက် စာရင်းရှိ ပိုက်အမျိုးအစား။ ပိုက်အမျိုးအစားတွင် ပါဝင်သော ဂုဏ်သတ္တိများကို ဤနေရာတွင် တည်းဖြတ်၍မရအောင် ပိတ်ထားသည်။ ဤနေရာတွင် တည်းဖြတ်နိုင်ရန် ပိုက်အမျိုးအစားမှ ဖြုတ်ချပါ။';
$ec_lang['lpn_pipetype_none']='ပိုက်အမျိုးအစား မရွေးချယ်ရသေးပါ';
$ec_lang['lpn_pipetype_detach']='ပိုက်အမျိုးအစားမှ ဖြုတ်ချရန်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='ဤပိုက် ၎င်း၏အမျိုးအစားမှ ဖတ်နေသော တန်ဖိုးများကို ပိုက်ကိုယ်တိုင်ထဲသို့ ကူးယူပြီး အမျိုးအစား အသုံးပြုမှုကို ရပ်တန့်သည်။ ပိုက်၏ တန်ဖိုးများ ယခုအချိန်တွင် မပြောင်းလဲပါ၊ ယခုမှစပြီး ဤနေရာတွင် ဤတန်ဖိုးများကို တည်းဖြတ်နိုင်ပါသည်။';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='ချိတ်ဆက်ပစ္စည်းများ';
$ec_lang['lpn_library_fittings_tip']='ချိတ်ဆက်ပစ္စည်း စာရင်းသည် ပိုက်များစွာ ကိုးကားနိုင်သော ချိတ်ဆက်ပစ္စည်းနှင့် ၎င်းတို့၏ အရေအတွက်များ စုစည်းထားချက် ဖြစ်သည်။ ၎င်းသည် ဒေသဆိုင်ရာ ဆုံးရှုံးမှု ကိန်းတစ်ခု အဖြစ် ပေါင်းလဒ်ထုတ်သည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='ပရောဂျက်တစ်ခုစီတွင် မိမိကိုယ်ပိုင် ချိတ်ဆက်ပစ္စည်း စာရင်း ရှိသည်။ ချိတ်ဆက်ပစ္စည်း စာရင်းတွင် ချိတ်ဆက်ပစ္စည်းတစ်ခုစီအတွက် အရေအတွက်ပါ ရှိပြီး ဒေသဆိုင်ရာ ဆုံးရှုံးမှု ကိန်းတစ်ခုအဖြစ် ပေါင်းလဒ်ထုတ်သည်။ ပိုက်နှင့် ပိုက်အမျိုးအစား နှစ်မျိုးလုံးက စာရင်းတစ်ခုကို ကိုးကားနိုင်သည်။';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='ဤနေရာတွင် ပေးထားသော ချိတ်ဆက်ပစ္စည်းများသည် EPANET 2.2 အသုံးပြုသူ လက်စွဲ၏ ဇယား 3.3 ရှိ ဆယ့်သုံးမျိုး ဖြစ်သည်။ တစ်ခုကို ရွေးချယ်ခြင်းက ၎င်း၏ ကိန်းကို အတန်းထဲသို့ ကူးယူပေးပြီး၊ သင်ပြောင်းလဲနိုင်သည်။ ကိန်းတစ်ခုသည် ချိတ်ဆက်ပစ္စည်း၏ အရွယ်အစားနှင့် ထုတ်လုပ်သူပေါ် မူတည်၍ ကွာခြားနိုင်သောကြောင့်၊ ဤဇယားကို အဖြေတစ်ခုအနေဖြင့် မဟုတ်ဘဲ အစတစ်ခုအနေဖြင့်သာ သဘောထားပါ။';
$ec_lang['lpn_library_fittings_add']='ချိတ်ဆက်ပစ္စည်း စာရင်း ထည့်ရန်';
$ec_lang['lpn_library_fittings_used_by']='ဤချိတ်ဆက်ပစ္စည်း စာရင်းကို အသုံးပြုနေသော ပိုက်များ';
$ec_lang['lpn_library_fittings_unused']='ဤချိတ်ဆက်ပစ္စည်း စာရင်းကို မည်သည့်အရာမျှ မသုံးပါ။';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='ဤချိတ်ဆက်ပစ္စည်း စာရင်းကို ပိုက် {count} ခု အသုံးပြုနေသည် - {ids}။ ဖျက်ခြင်းမပြုမီ ၎င်းတို့မှ ဖြုတ်ချပါ။';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='စာရင်းများ တင်သွင်းရန်…';
$ec_lang['lpn_library_import_tip']='အခြားပရောဂျက်ဖိုင်တစ်ခုကို ရွေးချယ်ပြီး ၎င်းမှ စာရင်းများတစ်ခုလုံးကို ဤပရောဂျက်ထဲသို့ ကူးယူပါ။ ဤနေရာတွင် အမည်တူ ရှိပြီးသားအရာများကို ကျော်သွားပြီး စာရင်းပြုစုသည်၊ သို့ဖြစ်၍ သင့်တွင် ရှိပြီးသား မည်သည့်အရာမျှ ပြောင်းလဲမည် မဟုတ်ပါ။';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='{file} မှ ကူးယူမည့်အရာကို ရွေးချယ်ပါ';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='သင် အမှန်ခြစ်ထားသော စာရင်းတစ်ခုစီကို တစ်ခုလုံး ကူးယူသည်။ နောက်ပိုင်းတွင် မလိုချင်သည်များကို၊ အခြားမှတ်တမ်းတစ်ခုကို ဖျက်သကဲ့သို့ ဖျက်ပါ။';
$ec_lang['lpn_library_import_go']='တင်သွင်းရန်';
$ec_lang['lpn_library_import_no_libraries']='ထိုပရောဂျက်ဖိုင်တွင် ကူးယူရန် စာရင်းများ မရှိပါ။';
$ec_lang['lpn_library_import_heading']='{file} မှ တင်သွင်းခဲ့သည်';
$ec_lang['lpn_library_import_added']='ကူးယူခဲ့သည် - {names}';
$ec_lang['lpn_library_import_conflict']='ကျော်သွားခဲ့သည်၊ အကြောင်းမှာ ဤပရောဂျက်တွင် အမည်တူ တစ်ခု ရှိပြီးသားဖြစ်သည် - {names}။ ဤနေရာတွင် မည်သည့်အရာမျှ မပြောင်းလဲခဲ့ပါ။ နှစ်ခုလုံး လိုချင်ပါက တစ်ခုခု၏ အမည်ကို ပြောင်းပြီး ထပ်မံတင်သွင်းပါ။';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='ထိုပရောဂျက်ဖိုင်တွင် ကူးယူရန် ၎င်းတို့ထဲမှ တစ်ခုမျှ မရှိပါ။';
$ec_lang['lpn_library_import_curve_shape']='ဤကွေးမျဉ်းများကို ဖိုင်ရေးထားသည့်အတိုင်း အတိအကျ ကူးယူခဲ့ပါသည်၊ ၎င်းတို့၏ ပထမကော်လံသည် အမှတ်တစ်ခုမှ နောက်တစ်ခုသို့ မမြင့်တက်မချင်း run တစ်ခုက အသုံးမပြုနိုင်ပါ - {names}';
$ec_lang['lpn_library_import_needs_fittings']='ဤပိုက်အမျိုးအစားများသည် ဤပရောဂျက်တွင် မရှိသော ချိတ်ဆက်ပစ္စည်း စာရင်းကို ရည်ညွှန်းထားသည် - {names}။ တူညီသော ဖိုင်မှ ချိတ်ဆက်ပစ္စည်း စာရင်းကို တင်သွင်းပါက ၎င်းတို့ တွေ့ရှိပါလိမ့်မည်။';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='သတိပေးချက် - ယူနစ် မကိုက်ညီပါ။ ရှိသည့်အတိုင်း တင်သွင်းပါမည်။ အကြံပြု မထားပါ။';
$ec_lang['lpn_library_import_units_line']='{name}: ဤပရောဂျက်က {mine} ကို ပြသည်၊ ဖိုင်က {theirs} ကို ပြသည်။';
$ec_lang['lpn_fitting_qty']='အရေအတွက်';
$ec_lang['lpn_fitting_name']='ချိတ်ဆက်ပစ္စည်း';
$ec_lang['lpn_fitting_k']='ကိန်း';
$ec_lang['lpn_fitting_add']='ချိတ်ဆက်ပစ္စည်း ထည့်ရန်';
$ec_lang['lpn_fitting_remove']='ဖယ်ရှားရန်';
$ec_lang['lpn_fitting_total']='စုစုပေါင်း ဒေသဆိုင်ရာ ဆုံးရှုံးမှု ကိန်း၊ k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='ချိတ်ဆက်ပစ္စည်း စာရင်း';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='ပရောဂျက်စာရင်းမှ ချိတ်ဆက်ပစ္စည်း စာရင်းတစ်ခု။ ၎င်း၏ အရေအတွက်များနှင့် ကိန်းများကို ဤပိုက်၏ ဒေသဆိုင်ရာ ဆုံးရှုံးမှု ကိန်းထဲသို့ ပေါင်းလဒ်ထုတ်ပြီး၊ ကိန်း ဘောက်စ်ကို ဖတ်ရန်သာ ဖြစ်စေသည်။ ကိန်းကို ကိုယ်တိုင် ရိုက်ထည့်ရန် ဤနေရာကို မရွေးချယ်ဘဲ ချန်ထားပါ။';
$ec_lang['lpn_fittings_none']='ချိတ်ဆက်ပစ္စည်း စာရင်း မရွေးချယ်ရသေးပါ';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='ဂလုတ် ဗားလ်၊ အပြည့်ဖွင့်ထားသော';
$ec_lang['lpn_fitting_angle']='ထောင့် ဗားလ်၊ အပြည့်ဖွင့်ထားသော';
$ec_lang['lpn_fitting_swingcheck']='ခါးဝိုက် ချက်ဗားလ်၊ အပြည့်ဖွင့်ထားသော';
$ec_lang['lpn_fitting_gate']='ဂိတ် ဗားလ်၊ အပြည့်ဖွင့်ထားသော';
$ec_lang['lpn_fitting_elbow_short']='အနံနည်း ဒေါင့်ကွေ့';
$ec_lang['lpn_fitting_elbow_medium']='အလယ်အလတ် ဒေါင့်ကွေ့';
$ec_lang['lpn_fitting_elbow_long']='အနံများ ဒေါင့်ကွေ့';
$ec_lang['lpn_fitting_elbow_45']='45 ဒီဂရီ ဒေါင့်ကွေ့';
$ec_lang['lpn_fitting_return_bend']='ပိတ်ထားသော ပြန်ကွေ့';
$ec_lang['lpn_fitting_tee_run']='စံ တီးချိတ်၊ တန်းလိုက်ဖြတ်၍ စီးဆင်းခြင်း';
$ec_lang['lpn_fitting_tee_branch']='စံ တီးချိတ်၊ အကိုင်းမှ ဖြတ်၍ စီးဆင်းခြင်း';
$ec_lang['lpn_fitting_entrance']='စတုရန်း ဝင်ပေါက်';
$ec_lang['lpn_fitting_exit']='ထွက်ပေါက်';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='အခြား ချိတ်ဆက်ပစ္စည်း';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='{file} ကို သိမ်းဆည်းပြီးပါပြီ';
$ec_lang['lpn_inp_export_flat_lead']='ထုတ်ယူထားသော EPANET ဖိုင်သည် ဤပရောဂျက်နှင့် ဂဏန်းအရ ညီမျှသည်။ သို့သော် အောက်ပါအရာများအတွက် နေရာမရှိပါ -';
$ec_lang['lpn_inp_export_flat_types']='ဤနေရာရှိ ပိုက် {n} ခုသည် ပိုက်အမျိုးအစား {t} မျိုးကို ကိုးကားသည်။ ဖိုင်ထဲတွင် ထိုပိုက်တစ်ခုစီသည် ဂဏန်းများကို ၎င်းကိုယ်ပိုင် မိတ္တူအနေဖြင့် ဆောင်သောကြောင့် အဖြေများ ထပ်တူညီသည်။ ဖိုင်ကမူ ပိုက်အမျိုးအစားကိုယ်တိုင်ကို မထားနိုင်သဖြင့်၊ အနက်ဖွင့်ဆိုချက်တစ်ခုကို တည်းဖြတ်ပြီး ပိုက်တိုင်း လိုက်ပါလာစေခြင်းကို သင့်ပရောဂျက်ဖိုင်ကသာ မှတ်တမ်းတင်ထားသည်။';
$ec_lang['lpn_inp_export_flat_coords']='EPANET ဖိုင်တစ်ခုသည် ဆက်စပ်နေရာတစ်ခုစီအတွက် တည်နေရာတစ်ခုကို ကိုင်ဆောင်သည်။ ဤအခြေအနေသည် ၎င်းတို့ထဲမှ {n} ခုကို အခြားနေရာတွင် ထားသည်၊ ၎င်းတို့သည် ဖိုင်ရှိ တည်နေရာများ ဖြစ်သည်။ အခြားအခြေအနေတိုင်းသည် ၎င်း၏ကိုယ်ပိုင် တည်နေရာများကို သင့်ပရောဂျက်ဖိုင်တွင်သာ ထိန်းထားသည်။';
$ec_lang['lpn_inp_export_flat_fittings']='EPANET ဖိုင်သည် သင့်ပရောဂျက်ဖိုင်ရှိ ဒေါင့်ကွေ့၊ ဗားလ်နှင့် တီးချိတ်များ၏ စာရင်းကို မထားနိုင်ပါ။ ဤနေရာရှိ ပိုက် {n} ခု၏ ဒေသဆိုင်ရာ ဆုံးရှုံးမှု ကိန်းကို ချိတ်ဆက်ပစ္စည်း စာရင်းမှ ပေါင်းလဒ်ထုတ်ထားသည်။ စုစုပေါင်းသည် ရှိနေသည့်အတိုင်း ဖိုင်ထဲသို့ ဝင်သောကြောင့် အဖြေများအတွက် မည်သည့်အရာမျှ မပြောင်းလဲပါ။';
$ec_lang['lpn_library_controls']='ထိန်းချုပ်မှုများ';
$ec_lang['lpn_library_controls_tip']='ထိန်းချုပ်မှုတစ်ခုသည် ရေအမြင့်၊ ဖိအား (သို့) အချိန်တစ်ခုက ဆိုသည့်အခါ ဆက်သွယ်မှုတစ်ခုကို ဖွင့် (သို့) ပိတ်ပေးသော၊ (သို့) သတ်မှတ်ချက် ပေးသော၊ ဝါကျတစ်ကြောင်း ဖြစ်သည်။';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='ပုံစံတစ်ခု ထည့်ရန်';
$ec_lang['lpn_library_pattern_values']='မြှောက်ကိန်းများ';
$ec_lang['lpn_library_pattern_values_tip']='မြှောက်ကိန်းများကို space (သို့) comma ဖြင့် ခြားပါ။ spreadsheet ကော်လံတစ်ခု ရှိပါက ကူးထည့်နိုင်သည်။ စာရင်းသည် လည်ပတ်မှု ကြာချိန်တစ်လျှောက် ထပ်ခါထပ်ခါ ဖြစ်နေသောကြောင့်၊ လည်ပတ်မှု တစ်ခုလုံးကို လွှမ်းခြုံရန် မလိုအပ်ပါ။';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='မြှောက်ကိန်း {n} လုံး၊ {step} စီ ကွာဝေး၍ {span} ကို လွှမ်းခြုံသည်';
$ec_lang['lpn_library_pattern_none']='ပုံစံ မရှိပါ';
$ec_lang['lpn_settings_default_pattern']='မူလ လိုအင် ပုံစံ';
$ec_lang['lpn_settings_default_pattern_tip']='ပုံစံ မရှိသော ဆက်စပ်နေရာတိုင်းသည် ဤတစ်ခုကို အသုံးပြုသည်။';
$ec_lang['lpn_library_control_add']='ထိန်းချုပ်မှုတစ်ခု ထည့်ရန်';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='EPANET syntax သုံးထားသော စာကြောင်းတစ်ကြောင်းပါ စည်းမျဉ်း။ ပရောဂျက်ယူနစ်များကို တသမတ်တည်း အသုံးပြုပါ။ သော့ချက်စာလုံးများကို အင်္ဂလိပ်ဘာသာဖြင့်သာ ရေးရပါမည်။ ဥပမာများ - LINK 12 CLOSED IF NODE 23 ABOVE 20 (ရေတိုက် 23 ၏ အဆင့်သည် ပေ 20 ကျော်လွန်သောအခါ Link 12 ကို ပိတ်လိုက်ပါမည်); LINK 12 OPEN IF NODE 130 BELOW 30 (Node 130 ရှိ ဖိအားသည် psi 30 အောက်ကျဆင်းသောအခါ Link 12 ကို ဖွင့်လိုက်ပါမည်); LINK PUMP02 1.5 AT TIME 16 (simulation စတင်ပြီး ၁၆ နာရီ ကြာချိန်တွင် ရေတင်စက် PUMP02 ၏ အချိုးကျ အမြန်နှုန်းကို 1.5 ဟု သတ်မှတ်ပါမည်); LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM (စည်းမျဉ်းနှစ်ခု - Link 12 ကို simulation တစ်လျှောက် နံနက် 10 နာရီတိုင်း ပိတ်ပြီး ညနေ 8 နာရီတိုင်း ဖွင့်ပါမည်)';
$ec_lang['lpn_library_control_ok']='✓ နားလည်ပါပြီ';
$ec_lang['lpn_library_control_bad']='⚠ နားမလည်ပါ';
$ec_lang['lpn_library_control_missing']='⚠ ဤကွန်ရက်တွင် {id} ဟု ခေါ်သော အရာ မရှိပါ';
$ec_lang['lpn_library_rules']='စည်းမျဉ်းများ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='စည်းမျဉ်းတစ်ခုသည် ရေအမြင့်၊ ဖိအား၊ စီးဆင်းမှု (သို့) အချိန်တစ်ခုသည် သင်သတ်မှတ်ထားသည့် တန်ဖိုးသို့ ရောက်ရှိသည့်အခါ၊ လင့်ခ်တစ်ခုကို ဖွင့်ခြင်း (သို့) ပိတ်ခြင်း၊ (သို့) ၎င်းအား ဆက်တင်တစ်ခု ပေးခြင်း ပြုလုပ်သော ဝါကျတိုတစ်ခု ဖြစ်သည်။ စည်းမျဉ်းများသည် တစ်ခုထက်ပို၍ တစ်ပြိုင်နက် စစ်ဆေးနိုင်ပြီး၊ စစ်ဆေးမှု မအောင်မြင်သောအခါ မည်သို့ ဆောင်ရွက်ရမည်ကိုလည်း ဖော်ပြနိုင်သည်။';
$ec_lang['lpn_library_rule_add']='စည်းမျဉ်း ထည့်ရန်';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='EPANET သုံးသော စကားလုံးများဖြင့်၊ တစ်ကြောင်းလျှင် ဝါကျအပိုင်းတစ်ခုနှင့် စည်းမျဉ်းတစ်ခု။ ပထမကြောင်းက ၎င်းကို အမည်ပေးသည် - RULE 1။ ထို့နောက် အခြေအနေတစ်ခု - IF TANK 2 LEVEL BELOW 17.1။ ထို့နောက် ၎င်းအတွက် ဆောင်ရွက်ရမည့်အရာ - THEN PUMP 9 STATUS IS OPEN။ နောက်ဆုံးကြောင်းက ၎င်းကို အဆင့်သတ်မှတ်နိုင်သည် - PRIORITY 1။ တစ်ခုထက်ပို၍ စစ်ဆေးရန် AND (သို့) OR ကြောင်းများ ထည့်ပါ၊ စစ်ဆေးမှု မအောင်မြင်သောအခါ ဆောင်ရွက်ရမည့်အရာအတွက် ELSE ကြောင်းများ ထည့်ပါ။ အခြေအနေတစ်ခုသည် node တစ်ခုပေါ်ရှိ LEVEL, HEAD, GRADE, PRESSURE (သို့) DEMAND၊ link တစ်ခုပေါ်ရှိ FLOW, STATUS (သို့) SETTING၊ (သို့) SYSTEM ပေါ်ရှိ TIME နှင့် CLOCKTIME ကို ဖတ်နိုင်သည်။ ဂဏန်းများကို ဤပရောဂျက် ပြသနေသော ယူနစ်များဖြင့် ရေးပါ; ၎င်းတို့ကို သင့်အတွက် ပြောင်းလဲပေးသည်။ သော့ချက်စကားလုံးများကို အင်္ဂလိပ်လို ချန်ထားပါ; ၎င်းတို့သည် ဤစာမျက်နှာနှင့် EPANET ဖတ်သည့်အရာ ဖြစ်သည်။';
$ec_lang['lpn_library_rule_ok']='✓ ဤစည်းမျဉ်းကို ဖတ်ခဲ့ပါသည်';
$ec_lang['lpn_library_rule_bad']='⚠ ဤစည်းမျဉ်းကို မဖတ်နိုင်ခဲ့ပါ';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='အခြေခံ လိုအင်';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='ပြသထားသော အချိန်အဆင့်တွင် ဤဆက်စပ်နေရာ ထုတ်ယူသော ရေစီးနှုန်း - အခြေခံ လိုအင်တစ်ခုစီကို ၎င်း၏ ကိုယ်ပိုင် ပုံစံနှင့် မြှောက်ပြီး ပေါင်းထားသည်။ ၎င်းကို တွက်ချက်ထားခြင်းဖြစ်ပြီး ရိုက်ထည့်ထားခြင်း မဟုတ်သောကြောင့်၊ နာရီနှင့်အမျှ ပြောင်းလဲပြီး ပြင်ဆင်၍ မရပါ။';
$ec_lang['lpn_field_demand_pattern']='လိုအင် ပုံစံ';
$ec_lang['lpn_field_demand_pattern_tip']='ဤဆက်စပ်နေရာ၏ လိုအင်သည် run တစ်လျှောက် မည်သို့ မြင့်တက်ကျဆင်းသည်။ ပုံစံ မရှိပါ တွင် ထားခဲ့ပါက ဆက်စပ်နေရာသည် ပရောဂျက်၏ မူလ လိုအင် ပုံစံ ကို အစား လိုက်နာမည်။';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='ဖော်ပြချက်';
$ec_lang['lpn_field_demand_category_tip']='ဤလိုအင် အမျိုးအစား၏ အမည် (သို့) ဖော်ပြချက်။';
$ec_lang['lpn_demand_add']='လိုအင် အမျိုးအစား ထည့်ရန်';
$ec_lang['lpn_demand_add_tip']='ဤဆက်စပ်နေရာတွင် ကိုယ်ပိုင် အခြေခံလိုအင်၊ ပုံစံနှင့် ဖော်ပြချက်ပါသော လိုအင် အမျိုးအစား နောက်တစ်ခု ထည့်ပါ။ အမျိုးအစားများကို ပေါင်းသည်။';
$ec_lang['lpn_demand_remove']='ဤလိုအင်ကို ဖယ်ရှားရန်';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='ဖိမြင့်ဆင့် ပုံစံ';
$ec_lang['lpn_field_head_pattern_tip']='ဤရေကန်၏ ရေအမြင့်သည် လည်ပတ်မှုတစ်လျှောက် မည်သို့ မြင့်တက်ကျဆင်းသည်။ အထက်ပါ ဖိမြင့်ဆင့်ကို ပုံစံနှင့် မြှောက်သည်။';
$ec_lang['lpn_field_pump_speed']='နှိုင်းရ မြန်နှုန်း';
$ec_lang['lpn_field_pump_speed_tip']='1 သည် ဤရေတင်စက် ၎င်း၏ မျဉ်းကွေးကို တိုင်းတာစဉ်က မြန်နှုန်းဖြင့် လည်ပတ်နေခြင်း ဖြစ်သည်။ 0.9 သည် ထိုရေတင်စက်ပင် ပိုနှေးစွာ လည်ပတ်နေခြင်းဖြစ်ပြီး၊ ၎င်း ထည့်ပေးသော ဖိမြင့်ဆင့်နှင့် ဖြတ်သန်းစေသော စီးဆင်းမှုကို လျှော့ချသည်။ မြန်နှုန်း ပုံစံတစ်ခုသည် လည်ပတ်မှု ဖြစ်နေစဉ် ဤဂဏန်းအစား အစားထိုးသည်။';
$ec_lang['lpn_field_speed_pattern']='မြန်နှုန်း ပုံစံ';
$ec_lang['lpn_field_speed_pattern_tip']='ဤရေတင်စက်၏ မြန်နှုန်းသည် run တစ်လျှောက် မည်သို့ မြင့်တက်ကျဆင်းသည်။ မြှောက်ကိန်းတစ်ခုစီသည် run ၏ ထိုအပိုင်းအတွက် နှိုင်းရ မြန်နှုန်း ဖြစ်ပြီး၊ Speed ဆက်တင်ကို အချိုးကျချဲ့ခြင်းအစား အစားထိုးသောကြောင့်၊ 0 မြှောက်ကိန်းသည် ရေတင်စက်ကို ရပ်စေသည်။';

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
$ec_lang['lpn_search_menu']='နေရာအမည်ဖြင့် ရှာဖွေရန်…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='မြို့တစ်မြို့၊ လိပ်စာတစ်ခု (သို့) အထိမ်းအမှတ်တစ်ခုကို အမည်ဖြင့် ရှာပြီး မြေပုံကို ထိုနေရာသို့ ရွှေ့ပါ။ ပထမဆုံး အသုံးပြုသောအခါ သင့်ခွင့်ပြုချက်ကို တောင်းသည်၊ အကြောင်းမှာ သင်ရိုက်ထည့်သော စကားလုံးများသည် OpenStreetMap ၏ နေရာအမည် ဝန်ဆောင်မှုသို့ သွားရောက်သောကြောင့် ဖြစ်သည်။';
$ec_lang['lpn_search_bar']='အမည်ဖြင့် ရှာဖွေရန်…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='နေရာအမည်ဖြင့် ရှာဖွေခြင်းသည် သင်ရိုက်ထည့်သော စကားလုံးများကို OpenStreetMap Foundation ၏ အခမဲ့ နေရာအမည် ဝန်ဆောင်မှုဖြစ်သော nominatim.openstreetmap.org သို့ ပို့သည်။';
$ec_lang['lpn_search_consent_2']='ဤသည် သင့်ပရောဂျက်နောက်ကွယ်ရှိ လမ်းမြေပုံ ပုံရိပ်များနှင့် မတူသော ဝန်ဆောင်မှု တစ်ခု ဖြစ်သည်။ ပုံရိပ်များက သင် ကြည့်နေသောနေရာကိုသာ ပြောသည်။ ရှာဖွေမှုတစ်ခုက သင်ရိုက်ထည့်သည့်အရာကို ပြောသည်။ နေရာအမည် ဝန်ဆောင်မှုသည် သင်၏ ရှာဖွေမှု စကားလုံးများနှင့် သင်၏ IP address ကို လက်ခံရရှိမည်။ ကျွန်ုပ်တို့ အခြားမည်သည့်အရာမျှ မပို့ဘဲ၊ သင်၏ ရှာဖွေမှုများ မှတ်တမ်းလည်း မထားပါ။';
$ec_lang['lpn_search_consent_3']='သင်၏ ရှာဖွေမှုများကို နေရာအမည် ဝန်ဆောင်မှုသို့ ပို့ခွင့်ပြုပါမည်လား။';
$ec_lang['lpn_search_consent_4']='သင် မဟုတ်ပါ ဟု ဆိုပါက၊ ဤစာမျက်နှာပေါ်ရှိ အခြားအရာအားလုံးသည် ယခုအတိုင်း ဆက်အလုပ်လုပ်နေမည်ဖြစ်ပြီး၊ လတ္တီတွဒ်နှင့် လောင်ဂျီတွဒ်တစ်ခုသို့ သွားရန် အပါအဝင် ဖြစ်သည်။ ဟုတ်ကဲ့ ဟူသော အဖြေကို နောက်တစ်ကြိမ် မမေးရန် မှတ်ထားပါမည်။ မဟုတ်ပါ ဟူသော အဖြေကို လုံးဝ မသိမ်းဆည်းပါ။';
$ec_lang['lpn_search_refused']='နေရာအမည် ရှာဖွေမှု ပိတ်ထားပြီး၊ မည်သည့်အရာမျှ မပို့ခဲ့ပါ။ လတ္တီတွဒ်နှင့် လောင်ဂျီတွဒ်တစ်ခုသို့ သွားရန်ကို ဆက်လက် အသုံးပြုနိုင်သည်။';
$ec_lang['lpn_search_prompt']='နေရာအမည်ဖြင့် ရှာဖွေပါ။ မြို့၊ လမ်း၊ အထိမ်းအမှတ် - ဥပမာ Petaluma, California';
$ec_lang['lpn_search_empty']='ရှာဖွေရန် နေရာအမည်တစ်ခု ရိုက်ထည့်ပါ။';
$ec_lang['lpn_search_working']='ရှာဖွေနေသည်…';
$ec_lang['lpn_search_busy']='ရှာဖွေမှုတစ်ခု လည်ပတ်နေဆဲ ဖြစ်သည်။ အဖြေရရန် စောင့်ပါ။';
$ec_lang['lpn_search_choose']='နေရာတစ်ခုထက်ပို၍ ကိုက်ညီသည်။ မည်သည်ကို ရွေးမလဲ။';
$ec_lang['lpn_search_nochoice']='မည်သည့်အရာမျှ မရွေးချယ်ခဲ့သောကြောင့်၊ မြေပုံ မရွှေ့ခဲ့ပါ။';
$ec_lang['lpn_search_badchoice']='ထိုအရာသည် စာရင်းထဲရှိ ဂဏန်းများထဲမှ တစ်ခု မဟုတ်ပါ။';
$ec_lang['lpn_search_none']='ထိုအမည်အတွက် မည်သည့်အရာမျှ ရှာမတွေ့ပါ။';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='နေရာအမည် ဝန်ဆောင်မှုက ကျွန်ုပ်တို့ကို နှေးအောင် လုပ်ခိုင်းနေသည်။ တစ်မိနစ် စောင့်ပြီး ထပ်ကြိုးစားပါ။';
$ec_lang['lpn_search_http']='နေရာအမည် ဝန်ဆောင်မှုက အမှားတစ်ခုဖြင့် ပြန်ဖြေခဲ့သည်။';
$ec_lang['lpn_search_timeout']='နေရာအမည် ဝန်ဆောင်မှုက အချိန်မီ ပြန်မဖြေခဲ့ပါ။ ဤစာမျက်နှာပေါ်ရှိ အခြားအရာအားလုံးသည် ၎င်းမပါဘဲ အလုပ်လုပ်သည်။';
$ec_lang['lpn_search_unreadable']='နေရာအမည် ဝန်ဆောင်မှုက ဤစာမျက်နှာ ဖတ်၍မရသော အရာတစ်ခုဖြင့် ပြန်ဖြေခဲ့သည်။';
$ec_lang['lpn_search_offline']='နေရာအမည် ဝန်ဆောင်မှုကို ရောက်ရှိနိုင်ခြင်း မရှိခဲ့ပါ။ သင် အော့ဖ်လိုင်း ဖြစ်နေနိုင်သည်။ ဤစာမျက်နှာပေါ်ရှိ အခြားအရာအားလုံးသည်၊ လတ္တီတွဒ်နှင့် လောင်ဂျီတွဒ်တစ်ခုသို့ သွားရန် အပါအဝင်၊ ၎င်းမပါဘဲ အလုပ်လုပ်သည်။';
$ec_lang['lpn_search_toofast']='တစ်စက္ကန့်လျှင် ရှာဖွေမှုတစ်ခု - ၎င်းသည် နေရာအမည် ဝန်ဆောင်မှု ခွင့်ပြုသည့်အတိုင်း ဖြစ်သည်။ ခဏနေမှ ထပ်ကြိုးစားပါ။';
$ec_lang['lpn_search_nofetch']='ဤဘရောက်ဇာသည် နေရာအမည် ဝန်ဆောင်မှုကို ရောက်ရှိနိုင်ခြင်း မရှိပါ။';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox သည် ဤဒေတာကို လူသိများသော အမြင့်ဒေတာအစုံများ (public elevation datasets) အများအပြားမှ စုစည်းထားသောကြောင့်၊ ၎င်း၏ ကောင်းမွန်မှုသည် သင်ရှိရာနေရာအပေါ် လုံးဝ မူတည်သည်။ အမေရိကန်နိုင်ငံ၏ အများစုတွင် ရှိသော USGS 3DEP ကဲ့သို့သော အမျိုးသားရေး lidar စစ်တမ်းများနှင့် အခြားနေရာများ၏ ၎င်းနှင့်ဆင်တူသော ဒေတာများ ရှိသည့်နေရာတွင်၊ အလျားလိုက် တစ်မီတာထက် ပိုကောင်းပြီး ဒေါင်လိုက် မီတာ၏ ဒဿမတစ်စိတ်တစ်ပိုင်း အတိအကျ ဖြစ်နိုင်သည်။ ကမ္ဘာလုံးဆိုင်ရာ ဒေတာသာ ရှိသည့်နေရာတွင် အလျားလိုက် ခန့်မှန်း 30 မီတာနှင့် ဒေါင်လိုက် မီတာ အများအပြား ဖြစ်သည်။ သင်ရရှိသည်မှာ မည်သည့်တစ်ခုမှန်းကို Mapbox က ပြောမပြပါ။ ၎င်းကို စစ်တမ်းတစ်ခုအဖြစ် မဟုတ်ဘဲ ကွန်တိုးမြေပုံတစ်ခုအဖြစ် သဘောထားပြီး၊ သင်မှီခိုအားထားသော မည်သည့်အရာကိုမဆို စစ်ဆေးပါ။';
$ec_lang['lpn_terrain_consent_1']='ရေအမြင့်များ ဖြည့်ခြင်းသည် လိုအပ်သော ဆက်စပ်နေရာတစ်ခုစီ၏ တည်နေရာ - ၎င်း၏ လတ္တီတွဒ်နှင့် လောင်ဂျီတွဒ် - ကို ထိုနေရာ၏ မြေပြင်အမြင့် ရှာရန် api.mapbox.com သို့ ပို့သည်။';
$ec_lang['lpn_terrain_consent_2']='ဤသည် သင့်ပရောဂျက်နောက်ကွယ်ရှိ မြေပုံ ပုံရိပ်များနှင့် မတူသော မေးခွန်းတစ်ခု ဖြစ်သည်။ ပုံရိပ်များက သင် ကြည့်နေသောနေရာကိုသာ ပြောသည်။ ဤတည်နေရာများသည် သင့်ကွန်ရက်ပင် ဖြစ်သည်။ Mapbox သည် ထိုကိုသော်များနှင့် သင်၏ IP address ကို လက်ခံရရှိမည်။ ကျွန်ုပ်တို့ အခြားမည်သည့်အရာမျှ မပို့ပါ - အမည်မရှိ၊ ပိုက်မရှိ၊ ပရောဂျက် မရှိ။ ကျွန်ုပ်တို့ ၎င်း၏ မှတ်တမ်းလည်း မထားဘဲ၊ ဤမေးခွန်း၏ အဖြေမှလွဲ၍ ဤစက်ပေါ်တွင် မည်သည့်အရာမျှ မသိမ်းဆည်းပါ။';
$ec_lang['lpn_terrain_consent_3']='သင်၏ ဆက်စပ်နေရာ တည်နေရာများကို Mapbox သို့ ပို့ခွင့်ပြုပါမည်လား။';
$ec_lang['lpn_terrain_consent_4']='သင် မဟုတ်ပါ ဟု ဆိုပါက၊ ဤစာမျက်နှာပေါ်ရှိ အခြားအရာအားလုံးသည် ယခုအတိုင်း ဆက်အလုပ်လုပ်နေမည်ဖြစ်ပြီး၊ ယခင်ကလို ရေအမြင့်များကို ကိုယ်တိုင် ရိုက်ထည့်နိုင်သည်။ ဟုတ်ကဲ့ ဟူသော အဖြေကို နောက်တစ်ကြိမ် မမေးရန် မှတ်ထားပါမည်။ မဟုတ်ပါ ဟူသော အဖြေကို လုံးဝ မသိမ်းဆည်းပါ။';
$ec_lang['lpn_terrain_refused']='ရေအမြင့်များ ဖြည့်မထားဘဲ၊ မည်သည့်အရာမျှ မပို့ခဲ့ပါ။ ယခင်ကလို ကိုယ်တိုင် ရိုက်ထည့်နိုင်သည်။';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='ဆက်စပ်နေရာ {n} ခု၏ ရေအမြင့်ကို Mapbox DEM မှ ဖြည့်မလား?';
$ec_lang['lpn_terrain_confirm_default_1']='ဆက်စပ်နေရာတိုင်း ရေအမြင့် ရှိပြီးသား ဖြစ်ပြီး၊ ၎င်းတို့ထဲမှ {n} ခုသည် သင်ရိုက်ထည့်ခဲ့သည့်တန်ဖိုးမဟုတ်ဘဲ၊ ဆက်စပ်နေရာအသစ်တစ်ခု အစပြုသည့် ရေအမြင့်ဖြစ်သော {v} တွင် ရှိနေဆဲ ဖြစ်သည်။';
$ec_lang['lpn_terrain_confirm_default_2']='ထို ဆက်စပ်နေရာ {n} ခု၏ ရေအမြင့်ကို Mapbox DEM မှ တန်ဖိုးများဖြင့် အစားထိုးမလား?';
$ec_lang['lpn_terrain_keep']='ဆက်စပ်နေရာ {k} ခုသည် ရေအမြင့် ရှိပြီးသားဖြစ်ပြီး ထိမထားပါ။';
$ec_lang['lpn_terrain_undo']='Undo တစ်ကြိမ် (Ctrl-Z) ဖြင့် ၎င်းတို့အားလုံးကို ပြန်ရောက်စေနိုင်သည်။';
$ec_lang['lpn_terrain_requests']='api.mapbox.com သို့ တောင်းဆိုမှု {n} ခု။';
$ec_lang['lpn_terrain_busy']='ရေအမြင့်များကို ဖြည့်နေဆဲ ဖြစ်သည်။ ၎င်းတို့အတွက် စောင့်ပါ။';
$ec_lang['lpn_terrain_offmap']='ဤဆက်စပ်နေရာ တည်နေရာများသည် မြေပြင်မြေပုံပေါ်တွင် မရှိသောကြောင့်၊ မည်သည့်အရာမျှ မပို့ခဲ့ပါ။';
$ec_lang['lpn_terrain_too_wide']='ဤဆက်စပ်နေရာများသည် တစ်ကြိမ်တည်း ဖတ်ရန် ကမ္ဘာမြေ၏ ကျယ်ပြန့်လွန်းသော နေရာအတိုင်းအတာတွင် ပျံ့နှံ့နေသည် (tile တောင်းဆိုမှု {n} ခု)။ မည်သည့်အရာမျှ မပို့ခဲ့ပါ။';
$ec_lang['lpn_terrain_cancelled']='မည်သည့်အရာမျှ မပြောင်းလဲခဲ့ဘဲ၊ မည်သည့်အရာမျှ မပို့ခဲ့ပါ။';
$ec_lang['lpn_terrain_nofetch']='ဤဘရောက်ဇာသည် မြေပြင် ဝန်ဆောင်မှုကို ရောက်ရှိနိုင်ခြင်း မရှိပါ။';
$ec_lang['lpn_terrain_working']='မြေပြင်ကို ဖတ်နေသည်…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='မြေပြင် ဝန်ဆောင်မှုသည် တောင်းဆိုမှုကို ပယ်ချခဲ့သဖြင့် ({status})၊ မည်သည့် ရေအမြင့်မျှ ပြောင်းလဲမခံရပါ။ ဤဆိုက်အသုံးပြုသော Mapbox token သည် သင်ရှိနေသော ဝဘ်လိပ်စာကို ခွင့်မပြုပေလိမ့်မည်။';
$ec_lang['lpn_terrain_failed']='မြေပြင် ဝန်ဆောင်မှုကို ရောက်ရှိနိုင်ခြင်း မရှိသောကြောင့်၊ မည်သည့် ရေအမြင့်မျှ မပြောင်းလဲခဲ့ပါ။ သင် အော့ဖ်လိုင်း ဖြစ်နေနိုင်သည်။ ဤစာမျက်နှာပေါ်ရှိ အခြားအရာအားလုံးသည် ၎င်းမပါဘဲ အလုပ်လုပ်သည်။';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='မြေပြင် ဝန်ဆောင်မှုက ကျွန်ုပ်တို့အား နှေးကွေးစေရန် တောင်းဆိုနေသည် (429)၊ သို့ဖြစ်၍ မည်သည့် ရေအမြင့်မျှ မပြောင်းလဲခဲ့ပါ။ တစ်မိနစ်အကြာတွင် ထပ်ကြိုးစားပါ။';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='မြေပြင် ဝန်ဆောင်မှုက အမှားတစ်ခုနှင့် ပြန်လည်ဖြေကြားခဲ့သည် ({status})၊ သို့ဖြစ်၍ မည်သည့် ရေအမြင့်မျှ မပြောင်းလဲခဲ့ပါ။ သင့်ကွန်ရက်တွင် မည်သည့်အရာမျှ မမှားပါ။';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='ထိုဆက်စပ်နေရာများ တစ်ခုမျှ ကမ္ဘာမြေပေါ်တွင် တည်နေရာ မရှိသောကြောင့်၊ မည်သည့်အရာမျှ မပို့ခဲ့ပြီး မည်သည့် ရေအမြင့်မျှ မပြောင်းလဲခဲ့ပါ။ မြေပြင်ကို ဖတ်ရှုရန်အတွက် လတ္တီတွဒ်နှင့် လောင်ဂျီတွဒ်ဖြင့် ရှိသော ပရောဂျက်၊ (သို့) ဤစာမျက်နှာ ချထားနိုင်သော ပရိုဂျက်ရှင်တစ်ခုပေါ်ရှိ ပရောဂျက်တစ်ခု လိုအပ်သည်။';
$ec_lang['lpn_terrain_done']='ရေအမြင့် {n} ခု ဖြည့်ပြီးပါပြီ။';
$ec_lang['lpn_terrain_missed']='{m} ခုကို ဖတ်၍မရခဲ့သဖြင့် အလွတ်ဖြစ်နေဆဲ ဖြစ်သည်။';
$ec_lang['lpn_terrain_partial']='terrain tile {f} ခု ပြန်မဖြေခဲ့ပါ။';
$ec_lang['lpn_terrain_will_ids']='ဤဆက်စပ်နေရာများသည် ရေအမြင့် ရရှိပါလိမ့်မည် - {ids}';
$ec_lang['lpn_terrain_keep_ids']='ထိုဆက်စပ်နေရာများမှာ - {ids}';
$ec_lang['lpn_terrain_filled_ids']='ဤဆက်စပ်နေရာများသည် ရေအမြင့် ရရှိခဲ့သည် - {ids}';
$ec_lang['lpn_terrain_blank_ids']='ဤဆက်စပ်နေရာများတွင် ရေအမြင့် လုံးဝ မရှိသေးပါ - {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}၊ နှင့် နောက်ထပ် {n} ခု';

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
$ec_lang['lpn_ff_menu']='မီးငြိမ်းသတ်ရေးစီးနှုန်း ခွဲခြမ်းစိတ်ဖြာချက်…';
$ec_lang['lpn_ff_menu_tip']='ဆက်စပ်နေရာများကို တစ်ခုချင်းစီ စစ်ဆေးသည် - သင်သတ်မှတ်ထားသော ကျန်ရှိဖိအားကို ဆက်ထိန်းထားစဉ် တစ်ခုစီက မည်မျှ ပေးနိုင်သနည်း၊ ထိုနေရာတွင် လိုအပ်သော ရေစီးနှုန်းကို ဆွဲယူခြင်းက အခြားအရာတစ်ခုခုကို ကန့်သတ်ချက်များထက် ကျော်လွန်စေမလား။';
$ec_lang['lpn_ff_title']='မီးငြိမ်းသတ်ရေးစီးနှုန်း ခွဲခြမ်းစိတ်ဖြာမှု';
$ec_lang['lpn_ff_intro']='ဆက်စပ်နေရာတစ်ခုစီအား ၎င်းတွင် ရှိပြီးသား လိုအင်အပေါ် ထပ်ပေါင်း၍ မီးငြိမ်းသတ်ရေးစီးနှုန်းတစ်ခု ဆွဲယူရန် အလှည့်ကျ တောင်းဆိုသည်။ သင့်ပရောဂျက်ထဲရှိ မည်သည့်အရာမျှ မပြောင်းလဲပါ။ run တစ်ခုလုံးကို မိတ္တူတစ်စောင်ပေါ်တွင် ပြုလုပ်သည်။';
$ec_lang['lpn_ff_scope']='စစ်ဆေးမည့် ဆက်စပ်နေရာများ';
$ec_lang['lpn_ff_scope_tip']='run မလုပ်မီ အစုအဝေးကို ရွေးပါ။ ကြီးမားသော စနစ်တစ်ခုရှိ ဆက်စပ်နေရာအားလုံးကို စစ်ဆေးခြင်းသည် မိနစ်များ ကြာနိုင်သည်။';
$ec_lang['lpn_ff_scope_all']='ဆက်စပ်နေရာ အားလုံး';
$ec_lang['lpn_ff_scope_selected']='ရွေးထားသော ဆက်စပ်နေရာများ';
$ec_lang['lpn_ff_no_junctions']='ဤပရောဂျက်တွင် ဆက်စပ်နေရာ မရှိသေးသောကြောင့်၊ စစ်ဆေးစရာ မရှိပါ။';
$ec_lang['lpn_ff_no_selection']='ဆက်စပ်နေရာ မည်သည်ကိုမျှ မရွေးထားပါ။ မြေပုံပေါ်တွင် တစ်ခု ရွေးပါ၊ (သို့) ဆက်စပ်နေရာ အားလုံးကို စစ်ဆေးပါ။';
$ec_lang['lpn_ff_skipped']='ရွေးထားသော အစိတ်အပိုင်း {n} ခုသည် ဆက်စပ်နေရာများ မဟုတ်သောကြောင့်၊ ၎င်းတို့ကို မစမ်းသပ်ခဲ့ပါ။';
$ec_lang['lpn_ff_required']='လိုအပ်သော မီးငြိမ်းသတ်ရေးစီးနှုန်း';
$ec_lang['lpn_ff_required_tip']='သင်၏ မီးဘေးကာကွယ်ရေး ဥပဒေ (သို့) မီးသတ်ဌာနက ဟိုက်ဒရင့်တစ်ခုတွင် တောင်းဆိုသော ရေစီးနှုန်း။ ဆက်စပ်နေရာတစ်ခုသည် ၎င်း၏ကိုယ်ပိုင် လိုအပ်သော မီးငြိမ်းသတ်ရေးစီးနှုန်း မရှိလျှင်၊ ဤဂဏန်းနှင့် စစ်ဆေးမည်။';
$ec_lang['lpn_ff_required_own']='ကိုယ်ပိုင် လိုအပ်သော မီးငြိမ်းသတ်ရေးစီးနှုန်း ကိုင်ဆောင်ထားသော ဆက်စပ်နေရာများကို ၎င်းတန်ဖိုးနှင့် အစား စစ်ဆေးမည်။ ၎င်းတို့၏ အရေအတွက် - {n}။';
$ec_lang['lpn_ff_required_node_tip']='ဤဆက်စပ်နေရာက ဝန်ဆောင်မှုပေးနေသော မြေအသုံးချမှုအတွက်၊ သင်၏ မီးဘေးကာကွယ်ရေး ဥပဒေ (သို့) မီးသတ်ဌာနအရ လိုအပ်သော မီးငြိမ်းသတ်ရေးစီးနှုန်း။ ဗလာထားလိုက်ပါက ဆက်စပ်နေရာကို မီးငြိမ်းသတ်ရေးစီးနှုန်း ခွဲခြမ်းစိတ်ဖြာမှု ဘောက်စ်ရှိ ဂဏန်းနှင့် စစ်ဆေးမည်။';
$ec_lang['lpn_ff_residual']='ဆက်ထိန်းထားရမည့် ကျန်ရှိဖိအား';
$ec_lang['lpn_ff_residual_tip']='မီးငြိမ်းသတ်ရေးစီးနှုန်း ပေးဆောင်နေစဉ် ဆက်စပ်နေရာက ဆက်ထိန်းထားရမည့် ဖိအား။ AWWA M31 နှင့် NFPA 291 တို့သည် 20 psi (140 kPa) ကို သုံးသည်။';
$ec_lang['lpn_ff_design']='ဒီဇိုင်း စစ်ဆေးမှု (စနစ်အပေါ် သက်ရောက်မှု)';
$ec_lang['lpn_ff_design_tip']='ဆက်စပ်နေရာက ရေစီးနှုန်းကို ပေးနိုင်သလားဟူသော မေးခွန်းနှင့် ခွဲထားသော မေးခွန်းတစ်ခု - ထိုနေရာတွင် ထိုရေစီးနှုန်းကို ဆွဲယူထားစဉ်၊ အခြားအရာတစ်ခုခုသည် ၎င်း၏ အနည်းဆုံးဖိအားအောက် ကျဆင်းသည် (သို့) ၎င်း၏ အလျင်ကန့်သတ်ချက်ကို ကျော်လွန်သလား။ ၎င်းကို စစ်ဆေးရန် ရွေးချယ်ခြင်းသည် နောက်ထပ် တွက်ချက်မှု ကုန်ကျစရိတ် မရှိပါ။';
$ec_lang['lpn_ff_design_off']='မစစ်ဆေးပါ';
$ec_lang['lpn_ff_design_all']='အခြား ဆက်စပ်နေရာ အားလုံးနှင့် ပိုက်လိုင်း အားလုံး';
$ec_lang['lpn_ff_design_selected']='ရွေးချယ်ထားသော ဆက်စပ်နေရာများနှင့် ၎င်းတို့၏ ပိုက်လိုင်းများ';
$ec_lang['lpn_ff_design_no_selection']='ဒီဇိုင်း စစ်ဆေးမှုကို ရွေးချယ်ထားသော ဆက်စပ်နေရာများအဖြစ် သတ်မှတ်ထားသော်လည်း၊ မည်သည့်ဆက်စပ်နေရာကိုမျှ မရွေးချယ်ထားပါ။ မြေပုံပေါ်တွင် အချို့ကို ရွေးပါ၊ (သို့) အားလုံး ကို သတ်မှတ်ပါ။';
$ec_lang['lpn_ff_minpressure']='အခြားနေရာများတွင် ခွင့်ပြုထားသော အနိမ့်ဆုံးဖိအား';
$ec_lang['lpn_ff_minpressure_tip']='အခြားဆက်စပ်နေရာတစ်ခုက ၎င်း၏ မီးငြိမ်းသတ်ရေးစီးနှုန်းကို ဆွဲယူနေစဉ်၊ ဤဖိအားအောက် ကျဆင်းသွားသော ဆက်စပ်နေရာကို ဒီဇိုင်းပြဿနာတစ်ခုအဖြစ် အစီရင်ခံမည်။';
$ec_lang['lpn_ff_maxvelocity']='ခွင့်ပြုထားသော အမြင့်ဆုံးအလျင်';
$ec_lang['lpn_ff_maxvelocity_tip']='မီးငြိမ်းသတ်ရေးစီးနှုန်းကို ဆွဲယူနေစဉ်၊ ဤအလျင်အထက် ရေစီးနေသော ပိုက်လိုင်းကို ဒီဇိုင်းပြဿနာတစ်ခုအဖြစ် အစီရင်ခံမည်။';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='မီးငြိမ်းသတ်ရေးစီးနှုန်းကို ဆက်စပ်နေရာကိုယ်တိုင်၌ ဆွဲယူသည်။ ၎င်းသည် ဤနေရာတွင် အသုံးပြုသော နည်းလမ်းဖြစ်ပြီး၊ ယေဘုယျအားဖြင့် သုံးလေ့ရှိသော နည်းလမ်းလည်း ဖြစ်သည်။ ဟိုက်ဒရင့်၊ ၎င်း၏ ဘေးတွဲပိုက်လိုင်းနှင့် ၎င်း၏ ပိုက်ဝမ်းကို ပုံစံမပြုထားသောကြောင့်၊ တကယ့်ဟိုက်ဒရင့်သည် ဤနေရာတွင် ပြထားသော ရေစီးနှုန်းထက် နည်းသော ရေစီးနှုန်းသာ ပေးနိုင်သည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='တွင်ပါ ဖြေရှင်းစက်ကို အသုံးပြုထားသည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='EPANET အင်ဂျင်ကို အသုံးပြုထားသည်။';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='ရရှိနိုင်သော မီးငြိမ်းသတ်ရေးစီးနှုန်းသည် ရှာဖွေမှုတစ်ခုဖြစ်သောကြောင့်၊ စစ်ဆေးသော ဆက်စပ်နေရာတစ်ခုစီအတွက် ကွန်ရက်တစ်ခုလုံးကို ခန့်မှန်း ၁၆ ကြိမ် ဖြေရှင်းသည်။ ကြီးမားသော စနစ်တစ်ခုသည် မိနစ်များ ကြာနိုင်သည်။ မည်သည့်အချိန်တွင်မဆို ရပ်တန့်နိုင်ပြီး၊ ရှိပြီးသား တွက်ချက်ထားသည့်အရာကို ဆက်ထားနိုင်သည်။';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='စခရင်ပေါ်တွင် ယခုပြသနေသော အချိန်အဆင့်ကိုသာ စစ်ဆေးသည်။ မီးငြိမ်းသတ်ရေးစီးနှုန်းကို ပုံမှန်အားဖြင့် အများဆုံးနေ့စဉ် လိုအင်အပေါ် ထပ်ပေါင်း၍ စစ်ဆေးသောကြောင့်၊ run မလုပ်မီ ကွန်ရက်ကို ထိုအခြေအနေသို့ သတ်မှတ်ပါ။';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='မီးငြိမ်းသတ်ရေးစီးနှုန်း run';
$ec_lang['lpn_ff_calculate']='စတင်ရန်';
$ec_lang['lpn_ff_stop']='ရပ်တန့်ရန်';
$ec_lang['lpn_ff_working']='လုပ်ဆောင်နေဆဲ - ဆက်စပ်နေရာ {total} ခုအနက် {done} ခု။';
$ec_lang['lpn_ff_stopped']='ဆက်စပ်နေရာ {total} ခုအနက် {done} ခု ပြီးနောက် ရပ်တန့်သွားသည်။ အောက်ပါ အဖြေများသည် ပြီးစီးပြီးသား အဖြေများ ဖြစ်သည်။';
$ec_lang['lpn_ff_cost']='ဤ run သည် ကွန်ရက်တစ်ခုလုံးကို {solves} ကြိမ် ဖြေရှင်းခဲ့သည်။';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='ပုံဆွဲချက် ပြောင်းလဲသွားသောကြောင့်၊ မီးငြိမ်းသတ်ရေးစီးနှုန်း အဖြေများကို ရှင်းလင်းလိုက်သည်။ ထပ်မံ Run ပါ။';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='ဝိုင်းကွင်းများ ရှင်းလင်းရန်';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='ဆက်စပ်နေရာ {clean} ခုတွင် ချွတ်ယွင်းချက် မရှိခဲ့ပါ။ ဆက်စပ်နေရာ {fire} ခုသည် မီးငြိမ်းသတ်ရေးစီးနှုန်း မအောင်မြင်ခဲ့ပါ။ ဆက်စပ်နေရာ {design} ခုသည် စနစ်၏ ကျန်အစိတ်အပိုင်းကို ထိခိုက်ခဲ့သည်။';
$ec_lang['lpn_ff_summary_error']='ဆက်စပ်နေရာ {n} ခုကို အဖြေ ရှာမတွေ့ခဲ့ပါ။';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='စစ်ဆေးခဲ့သော ဆက်စပ်နေရာ အားလုံး';
$ec_lang['lpn_ff_col_junction']='ဆက်စပ်နေရာ';
$ec_lang['lpn_ff_col_static']='တည်ငြိမ်ဖိအား';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='မီးငြိမ်းသတ်ရေးစီးနှုန်း မဆွဲယူမီ၊ စနစ်၏ ပုံမှန် လိုအင်များ ဆက်လည်ပတ်နေဆဲ ဤဆက်စပ်နေရာရှိ ဖိအား။ ၎င်းကို တိုင်းတာရန် မည်သည့်အရာမျှ ပိတ်ထားခြင်း မရှိသောကြောင့်၊ ၎င်းသည် စနစ်အတွက် စီးဆင်းမှုသုည ဖိအား မဟုတ်ပါ - ၎င်းသည် မြေပုံက ဤဆက်စပ်နေရာတွင် ပြသနေသော ဖိအားပင် ဖြစ်သည်။ AWWA M31 နှင့် NFPA 291 နှစ်ခုစလုံးက ဤဖတ်ချက်ကို static pressure ဟု ခေါ်ဆိုပြီး၊ မီးငြိမ်းသတ်ရေးစီးနှုန်း စမ်းသပ်မှု တစ်ခု၏ အစပြု နေရာ ဖြစ်သည်။';
$ec_lang['lpn_ff_col_available']='ရနိုင်သော စီးနှုန်း';
$ec_lang['lpn_ff_col_required']='လိုအပ်သော စီးနှုန်း';
$ec_lang['lpn_ff_col_residual']='ကျန်ရှိဖိအား';
$ec_lang['lpn_ff_col_atrequired']='လိုအပ်သည့်စီးနှုန်းတွင် ဖိအား';
$ec_lang['lpn_ff_col_affected']='အဆိုးဆုံး သက်ရောက်မှု';
$ec_lang['lpn_ff_col_limit']='ဒီဇိုင်း ကန့်သတ်ချက်';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='မစစ်ဆေးရသေးပါ';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='တည်ငြိမ်ဖိအား မအောင်မြင်သောကြောင့် မစစ်ဆေးရပါ';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='မအောင်မြင်မှု အမျိုးအစား';
$ec_lang['lpn_ff_mode_fire']='မီး';
$ec_lang['lpn_ff_mode_design']='ဒီဇိုင်း';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='မရှိ';
$ec_lang['lpn_ff_col_solves']='Run အကြိမ်ရေ';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='ဖိအားနှင့် အလျင်';
$ec_lang['lpn_ff_atleast']='{flow} ထက် ပို၍';
$ec_lang['lpn_ff_affect_node']='{id} သည် {pressure} သို့ ကျဆင်းသည်';
$ec_lang['lpn_ff_affect_link']='{id} သည် {velocity} သို့ ရောက်ရှိသည်';
$ec_lang['lpn_ff_more']='နှင့် ထပ်မံ {n} ခု ထိခိုက်ခဲ့သည်';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='ဆက်စပ်နေရာ ထပ်မံ {n} ခုကို မပြပါ။';
$ec_lang['lpn_ff_design_none']='ဆက်စပ်နေရာ မည်သည်က မီးငြိမ်းသတ်ရေးစီးနှုန်းကို ဆွဲယူနေစဉ်ဖြစ်စေ၊ ရွေးထားသော အစုအဝေးရှိ မည်သည့်အရာမျှ ၎င်း၏ ကန့်သတ်ချက်များထက် ကျော်လွန်ခြင်း မရှိခဲ့ပါ။';
$ec_lang['lpn_ff_design_off_note']='ဤ run တွင် စနစ်၏ ကျန်အစိတ်အပိုင်းအပေါ် သက်ရောက်မှုကို မစစ်ဆေးခဲ့ပါ။';
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
$ec_lang['lpn_ff_iso']='အာမခံ ဝန်ဆောင်မှု ရုံး (Insurance Services Office, ISO) သည် ဟိုက်ဒရင့်တစ်ခုလျှင် အများဆုံး {flow} ကိုသာ ခန့်မှန်းသတ်မှတ်သည်။ ဆက်စပ်နေရာတစ်ခုသည် ဟိုက်ဒရင့် မည်မျှ ကိုယ်စားပြုသည်ကို ကျွန်ုပ်တို့ မသိသောကြောင့်၊ ထိုကန့်သတ်ချက်ကို ဤနေရာတွင် အသုံးမပြုခဲ့ပါ။';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='မီးငြိမ်းသတ်ရေးစီးနှုန်း မဆွဲယူမီကတည်းက ကျန်ရှိဖိအားအောက် ကျဆင်းနေပြီ';
$ec_lang['lpn_ff_err_converge']='ကွန်ရက်၏ အဖြေ မတွေ့ရှိခဲ့ပါ။';
$ec_lang['lpn_ff_err_solve']='ဖြေရှင်းစက်က အမှားတစ်ခု အစီရင်ခံပြီး အဖြေ မပေးခဲ့ပါ။';
$ec_lang['lpn_ff_err_not_junction']='ဆက်စပ်နေရာ မဟုတ်ပါ';
$ec_lang['lpn_ff_err_unknown']='အဖြေ မရှိပါ။ အစီရင်ခံထားသော ကုဒ်မှာ {code} ဖြစ်သည်။';

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
$ec_lang['lpn_file_import_survey']='စစ်တမ်းကောက်ယူထားသော အမှတ်များ တင်သွင်းရန်…';
$ec_lang['lpn_file_import_survey_tip']='စာသားဖိုင်တစ်ခုမှ စစ်တမ်းကောက်ယူထားသော အမှတ်စာရင်းကို ဖတ်ပြီး၊ အမှတ်တစ်ခုစီတွင် ဆက်စပ်နေရာတစ်ခု ပြုလုပ်ပေးသည်၊ ဖိုင်က ဖော်ပြမထားသည့်အရာများအတွက် အစိတ်အပိုင်းအသစ် ဆက်တင်များကို အသုံးပြုသည်။ ပိုက်လိုင်းများ ဆွဲမည် မဟုတ်ပါ၊ အမည်ဖော်ပြခြင်း မရှိဘဲ မည်သည့်အတန်းကိုမျှ ချန်ထားမည် မဟုတ်ပါ။ ဤပရောဂျက် ယခုအသုံးပြုနေသော ကိုဩဒိနိတ် စနစ်ကို ဖတ်သည်၊ ပထဝီအညွှန်း တပ်ထားသည်ဖြစ်စေ မဖြစ်စေ။';
$ec_lang['lpn_survey_read_error']='ထိုဖိုင်ကို သင့်ဒစ်စ်မှ ဖတ်၍ မရပါ။';
$ec_lang['lpn_survey_cancelled']='မည်သည့်အရာမျှ မဖန်တီးခဲ့ပြီး မည်သည့်အရာမျှ မပြောင်းလဲခဲ့ပါ။';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='မြောက်ဘက်';
$ec_lang['lpn_survey_axis_east']='အရှေ့ဘက်';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='ထိုဖိုင်တွင် မည်သည့်အရာမျှ မပါဝင်ပါ။';
$ec_lang['lpn_survey_err_unreadable']='ထိုဖိုင်ကို စစ်တမ်းကောက်ယူထားသော အမှတ်စာရင်းအဖြစ် ဖတ်၍ မရပါ။';
$ec_lang['lpn_survey_err_ambiguous_coord']='ထိုဖိုင်ရှိ ကော်လံတစ်ခုထက်ပို၍ {axis} ({detail}) ဖြစ်နိုင်ပြီး၊ ဤစာမျက်နှာက ၎င်းတို့အကြား ရွေးချယ်ပေးမည် မဟုတ်ပါ။ တစ်ခုကို {axis} အဖြစ် အမည်ပေးထားခဲ့ပြီး ထပ်ကြိုးစားပါ။';
$ec_lang['lpn_survey_err_no_points']='ထိုဖိုင်ရှိ အတန်းတစ်ခုမျှ စစ်တမ်းကောက်ယူထားသော အမှတ်တစ်ခုအဖြစ် ဖတ်၍ မရခဲ့ပါ။ ဖတ်ခဲ့သော အတန်းများ - {detail}';
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
$ec_lang['lpn_survey_format_label']='ဖိုင် ပုံစံ -';
$ec_lang['lpn_survey_format_internal']='ဖိုင်တွင်းက သတ်မှတ်ထားသည်';
$ec_lang['lpn_survey_create']='ဆက်စပ်နေရာများ ဖန်တီးရန်';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='ပထမစာကြောင်းကို ကျော်သွားခဲ့သည် - ၎င်းက ဤစာမျက်နှာ သိသော ကော်လံများကို အမည်ပေးမထားပါ။';
$ec_lang['lpn_survey_type_label']='အစိတ်အပိုင်း အမျိုးအစား -';
$ec_lang['lpn_survey_confirm_junction']='ဆက်စပ်နေရာ {n} ခု တွေ့ရှိသည်။ ဆက်လက်လုပ်ဆောင်မလား။';
$ec_lang['lpn_survey_confirm_reservoir']='ရေကန် {n} ခု တွေ့ရှိသည်။ ဆက်လက်လုပ်ဆောင်မလား။';
$ec_lang['lpn_survey_confirm_tank']='ရေတိုက် {n} ခု တွေ့ရှိသည်။ ဆက်လက်လုပ်ဆောင်မလား။';
$ec_lang['lpn_survey_report_junction']='ဆက်စပ်နေရာ {n} ခု တင်သွင်းခဲ့သည်၊ {m} ခုတွင် အမြင့် ပါဝင်သည်။';
$ec_lang['lpn_survey_report_reservoir']='ရေကန် {n} ခု တင်သွင်းခဲ့သည်၊ {m} ခုတွင် အမြင့် ပါဝင်သည်။';
$ec_lang['lpn_survey_report_tank']='ရေတိုက် {n} ခု တင်သွင်းခဲ့သည်၊ {m} ခုတွင် အမြင့် ပါဝင်သည်။';
$ec_lang['lpn_survey_report_clean']='ဖိုင်ရှိ အမှတ်တိုင်းသည် ကူးလာခဲ့ပြီး၊ တင်သွင်းစဉ်တွင် မည်သည့်အရာမျှ မပြောင်းလဲခဲ့ပါ။';
$ec_lang['lpn_survey_report_notes']='တင်သွင်းမှု အမှားများနှင့် မှတ်ချက်များ -';
$ec_lang['lpn_survey_sev_error']='အမှား';
$ec_lang['lpn_survey_sev_warning']='သတိပေးချက်';
$ec_lang['lpn_survey_note_line']='စာကြောင်း {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='အထက်ပါ ဖိုင် ပုံစံအတွက် ကော်လံ နည်းလွန်းသည်။';
$ec_lang['lpn_survey_note_coord_missing']='{axis} ဆဲလ်သည် ဗလာဖြစ်နေသည်။';
$ec_lang['lpn_survey_note_bad_coord']='{axis} ကို ဂဏန်းတစ်ခုအဖြစ် ဖတ်၍ မရပါ။';
$ec_lang['lpn_survey_note_coord_range']='{axis} သည် ဤပရောဂျက် ခွင့်ပြုသော အကွာအဝေးပြင်ပ ရှိသည်။';
$ec_lang['lpn_survey_note_bad_elev']='ဂဏန်းမဟုတ်သော အမြင့်။ အမြင့် မပါဘဲ တင်သွင်းခဲ့သည်။';
$ec_lang['lpn_survey_note_ambiguous_elev']='ကော်လံတစ်ခုထက်ပို၍ အမြင့် ဖြစ်နိုင်သောကြောင့်၊ ၎င်းတို့ထဲမှ တစ်ခုမျှ မဖတ်ခဲ့ပါ။';
$ec_lang['lpn_survey_note_blank_rows']='ဗလာ စာကြောင်းများ ကျော်သွားခဲ့သည် - {detail}။';
$ec_lang['lpn_survey_note_id_duplicate']='အမည်ကို ဤဖိုင်တွင် ယခင်က အသုံးပြုပြီးသားဖြစ်ပြီး၊ အမည်အသစ် သတ်မှတ်ပေးထားသည်။';
$ec_lang['lpn_survey_note_id_taken']='အမည်သည် ပရောဂျက်တွင် ရှိပြီးသားဖြစ်ပြီး၊ အမည်အသစ် သတ်မှတ်ပေးထားသည်။';
$ec_lang['lpn_survey_note_id_invalid']='အမည်ကို ဤနေရာတွင် အသုံးပြု၍ မရပါ၊ အမည်အသစ် သတ်မှတ်ပေးထားသည်။';
