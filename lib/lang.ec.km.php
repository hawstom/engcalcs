<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='ប្រភាគ';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/sec';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% ឡើង/ចម្ងាយផ្ដេក';
$ec_lang['u_grade']='ឡើង/ចម្ងាយផ្ដេក';
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
$ec_lang['u_afd']='ac-ft/ថ្ងៃ';
$ec_lang['u_lpm']='L/នាទី';
$ec_lang['u_cmh']='m^3/h';
$ec_lang['u_cmd']='m^3/ថ្ងៃ';
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
$ec_lang['menu_brand']='HawsEDC ម៉ាស៊ីនគណនា';
$ec_lang['menu_main_hydraulics']='វិស្វកម្មហ៊ីដ្រូលីក';
$ec_lang['menu_help']='ជំនួយ';
$ec_lang['menu_libre']='កម្មវិធីសេរី';
$ec_lang['template_welcome']='ទម្លាក់ការភ័យខ្លាចរបស់អ្នកនៅក្រៅទ្វារ; ក្ដីស្រឡាញ់ត្រូវបានប្រើសម្រាប់ភាសាទីនេះ។ អ្នកមិនបំផ្លាញអ្វីទាំងអស់ឡើយ។ រីករាយជាមួយ <a target="_blank" href="https://hawsedc.com/download.php">ឧបករណ៍ HawsEDC AutoCAD ឥតគិតថ្លៃ</a> ផងដែរ។';
$ec_lang['template_feedback']='តើអ្នកអាចណែនាំពាក្យសម្ដីឱ្យប្រសើរជាងនេះនៅលើទំព័រនេះ ឬអ្វីផ្សេងទៀតបានទេ? តើអ្នកចង់ជួយ ឬចង់រៀនបង្កើតឧបករណ៍បែបនេះដែរឬទេ? សូមទាក់ទងខ្ញុំ។';
$ec_lang['template_printable_title']='ចំណងជើងដែលអាចបោះពុម្ព';
$ec_lang['template_printable_subtitle']='ចំណងជើងរងដែលអាចបោះពុម្ព';
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
$ec_lang['consent_body']='តើយើងអាចរក្សាលេខមួយខ្ទង់ក្នុងទំព័រនីមួយៗ នៅក្នុងទំហំផ្ទុករបស់កម្មវិធីរុករកនេះ ដើម្បីការពារយើងកុំឲ្យកត់ត្រាការចូលមើលដដែលៗបានទេ?';
$ec_lang['consent_accept']='យល់ព្រមលើសំណើនេះ';
$ec_lang['consent_accept_all']='យល់ព្រមជានិច្ច';
$ec_lang['consent_decline']='បដិសេធជានិច្ច';
$ec_lang['consent_current_granted']='អ្នកបានអនុញ្ញាតរឿងនេះ។ យើងកំណត់ការកត់ត្រាសម្រាប់ទម្រង់កម្មវិធីរុករកនេះ។';
$ec_lang['consent_current_denied']='អ្នកបានបដិសេធរឿងនេះ។ យើងមិនរក្សាទុកអ្វីទាំងអស់ ដើម្បីកំណត់ការកត់ត្រាសម្រាប់ទម្រង់កម្មវិធីរុករកនេះ។';
$ec_lang['consent_region_label']='ជម្រើសរបស់អ្នកអំពីការកំណត់ការកត់ត្រា។';
$ec_lang['consent_settings_link']='ការកំណត់ខូគី';
$ec_lang['privacy_link']='សេចក្ដីជូនដំណឹងឯកជនភាព';
$ec_lang['terms_link']='លក្ខខណ្ឌប្រើប្រាស់';
$ec_lang['index_main_title']='ម៉ាស៊ីនគណនាវិស្វកម្មតាមអ៊ីនធឺណិតឥតគិតថ្លៃ';
$ec_lang['index_meta_desc_plain']='ម៉ាស៊ីនគណនាវិស្វកម្មធារាសាស្ត្រឥតគិតថ្លៃ សម្រាប់បំពង់ ប្រឡាយ ស្ទីង និងការស្រោចស្រព។ វាដំណើរការនៅក្នុងកម្មវិធីរុករករបស់អ្នក ដំណើរការបានទោះមិនមានអ៊ីនធឺណិត ហើយមានជាភាសាចំនួន 27។';
$ec_lang['calc_set_units']='កំណត់ឯកតា:';
$ec_lang['calc_set_units_tip']='កំណត់ឯកតារបស់រាល់ចន្លោះបញ្ចូលក្នុងពេលតែមួយ។ មិនកែប្រែលេខ៖ លេខដែលអ្នកបានវាយបញ្ចូលនៅតែដដែលគ្រប់យ៉ាង គ្រាន់តែឥឡូវអានក្នុងឯកតាថ្មី។ លេខ 6 នៅតែជា 6 ប៉ុន្តែឥឡូវមានន័យ 6 អ៊ីង ជំនួសឱ្យ 6 មីលីម៉ែត្រ។';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='កំណត់ឡើងវិញតម្លៃលំនាំដើម';
$ec_lang['calc_defaults_confirm']='កំណត់ឡើងវិញម៉ាស៊ីនគណនាទៅតម្លៃលំនាំដើមដែលបានកំណត់ដើម?';
$ec_lang['points_data_note']='(ឬ ចម្លង/បិទភ្ជាប់ ដោយប្រើផ្ទៃទិន្នន័យ)';
$ec_lang['points_data_heading']='ទិន្នន័យចំណុច<br />(បំបែកដោយក្បៀស ឬ tab)';
$ec_lang['points_data_copy']='ចម្លង';
$ec_lang['points_data_paste']='បិទភ្ជាប់';
$ec_lang['calc_inputs']='ទិន្នន័យបញ្ចូល';
$ec_lang['calc_results']='លទ្ធផល';
$ec_lang['view_hide_line']='លាក់បន្ទាត់នេះ';
$ec_lang['view_printable']='កំណែដែលអាចបោះពុម្ព (ផ្ទុកឡើងវិញ/ធ្វើឱ្យស្រស់ ដើម្បីស្ដារ)';
$ec_lang['ec_name_label']='រក្សាទុកការគណនានេះ៖';
$ec_lang['ec_name_placeholder']='ឈ្មោះ';
$ec_lang['ec_name_tip']='រក្សាទុកទិន្នន័យបញ្ចូលនេះទៅក្នុង URL សម្រាប់ការចាប់ផ្តើមវិញ ប្រវត្តិ ឬការចែងលែង';
$ec_lang['calc_copy_link']='ចម្លងតំណ';
$ec_lang['ec_related_calcs']='ម៉ាស៊ីនគណនាដែលពាក់ព័ន្ធ៖';
$ec_lang['calc_copy_link_done']='បានចម្លង!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Darcy-Weisbach ការបាត់បង់ទំនាប់ទឹកក្នុងបំពង់';
$ec_lang['dw_main_title']='ម៉ាស៊ីនគណនា Darcy-Weisbach ការបាត់បង់ទំនាប់ទឹកក្នុងបំពង់ ឥតគិតថ្លៃ';
$ec_lang['dw_main_desc']='ការបាត់បង់ទំនាប់ក្នុងបំពង់ Darcy-Weisbach តាមប្រឡោះ ភាពរញ៉េរញ៉ៃ និងលំហូរដែលបានកំណត់';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='កម្ពស់ភាពរញ៉េរញ៉ៃដាច់ខាត, e, នៃជញ្ជាំងបំពង់។ តម្លៃធម្មតា: ដែកថែប (ថ្មី) 0.046 mm, ដែកថែប (ចាស់) 0.15 mm, HDPE 0.003 mm, PVC/uPVC 0.0015 mm, បេតុង 0.3–3 mm។';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s សម្រាប់ទឹកស្អាតនៅ 20°C">ភាពខាប់ស៊ីណេម៉ាទិក, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='ភាពខាប់ស៊ីណេម៉ាទិក, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s សម្រាប់ទឹកស្អាតនៅ 20°C';
$ec_lang['dw_reynolds_number']='លេខ Reynolds, Re';
$ec_lang['dw_flow_regime']='របៀបហូរ';
$ec_lang['dw_regime_laminar']='លំហូរស្រទប់';
$ec_lang['dw_regime_transitional']='លំហូរផ្លាស់ប្ដូរ';
$ec_lang['dw_regime_turbulent']='លំហូររញ្ជួយ';
$ec_lang['dw_friction_factor_method']='វិធីសាស្ត្រកត្តាកកិត';
$ec_lang['dw_friction_factor']='កត្តាកកិត, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Hazen-Williams ការបាត់បង់ទំនាប់ទឹកក្នុងបំពង់';
$ec_lang['hw_main_title']='ម៉ាស៊ីនគណនា Hazen-Williams ការបាត់បង់ទំនាប់ទឹកក្នុងបំពង់ ឥតគិតថ្លៃ';
$ec_lang['hw_main_desc']='ការបាត់បង់ទំនាប់ក្នុងបំពង់ Hazen-Williams តាមប្រឡោះ ភាពរញ៉េរញ៉ៃ និងលំហូរដែលបានកំណត់';
$ec_lang['hw_hgl_1']='HGL ចំហៀងក្រោម';
$ec_lang['hw_hgl_2']='HGL ចំហៀងលើ';
$ec_lang['hw_elev_up']='កម្ពស់ចំហៀងលើ';
$ec_lang['hw_pressure_up']='សម្ពាធចំហៀងលើ';
$ec_lang['hw_elev_down']='កម្ពស់ចំហៀងក្រោម';
$ec_lang['hw_pressure_down']='សម្ពាធចំហៀងក្រោម';
$ec_lang['hw_pressure_check']='ត្រួតពិនិត្យសម្ពាធ';
$ec_lang['hw_pressure_ok_short']='សម្ពាធវិជ្ជមាន';
$ec_lang['hw_pressure_neg_short']='សម្ពាធអវិជ្ជមាន';
$ec_lang['hw_pressure_neg']='សម្ពាធចំហៀងក្រោមទាបជាងសូន្យ។ HGL ធ្លាក់ចុះក្រោមបំពង់ ដូច្នេះបំពង់នឹងមិនហូរពេញទេ ហើយលទ្ធផលនេះអាចមិនត្រឹមត្រូវ។';
$ec_lang['hw_roughness']='មេគុណ Hazen-Williams, C';
$ec_lang['hw_note_1']='<dl><dt>ម៉ាស៊ីនគណនានេះមិនធ្វើគំរូទម្រង់បំពង់រវាងចុងទាំងពីរទេ។</dt><dd>វាប្រើតែកម្ពស់ចំហៀងលើ និងចំហៀងក្រោមដែលអ្នកបញ្ចូលប៉ុណ្ណោះ។ ប្រសិនបើដីលើកកម្ពស់ខ្ពស់ជាងចុងទាំងពីរនៅចំណុចណាមួយចន្លោះនោះ សម្ពាធនៅចំណុចខ្ពស់នោះនឹងទាបជាងសម្ពាធណាមួយដែលបានរាយការណ៍នៅទីនេះ។ សូមគណនាម្ដងទៀតសម្រាប់ប្រវែងពីចុងខាងលើដល់ចំណុចខ្ពស់នោះ ដើម្បីត្រួតពិនិត្យ។</dd><dd>កន្លែងណាដែល HGL ធ្លាក់ចុះក្រោមបំពង់ ទឹកស្ថិតនៅក្រោមសម្ពាធអវិជ្ជមាន។ ខ្យល់នឹងចេញពីទឹក បំពង់ជញ្ជាំងស្ដើងអាចរលំបាក់ ហើយទឹកក្រោមដីកខ្វក់អាចត្រូវបានទាញចូលតាមថ្នាំបំពង់។ រក្សាបំពង់ឲ្យស្ថិតនៅក្រោមសម្ពាធវិជ្ជមានគ្រប់ទីកន្លែង ហើយពិចារណាដាក់វ៉ាល់ខ្យល់ (air valve) នៅរាល់ចំណុចខ្ពស់។</dd><dt>សម្ពាធចំហៀងលើ គឺជាលក្ខខណ្ឌព្រំដែនដែលអ្នកផ្ដល់ឲ្យ។</dt><dd>អានតម្លៃពីម៉ែត្រ (gauge) ពីកម្រិតទឹកក្នុងធុងស្តុក (កម្ពស់ទឹកខាងលើបំពង់) ឬពីខ្សែកោងម៉ាស៊ីនបូម។ ម៉ាស៊ីនបូមផ្ដល់សម្ពាធតិចជាងនៅពេលលំហូរកើនឡើង ដូច្នេះសូមប្រើចំណុចលើខ្សែកោងដែលត្រូវនឹងលំហូរដែលបានបញ្ចូលខាងលើ។</dd><dt>សូមបូកសរុបមេគុណការបាត់បង់មូលដ្ឋាន (local) ដោយខ្លួនអ្នក។</dt><dd>បូកសរុបតម្លៃ K សម្រាប់រាល់វ៉ាល់ ចំណុចកោង តភ្ជាប់បីផ្លូវ (tee) ម៉ែត្រ និងច្រកចូលនីមួយៗនៅលើបន្ទាត់ ហើយបញ្ចូលផលបូកនោះ។ តាមតំណភ្ជាប់នៅចំណុចបញ្ចូលនោះ ដើម្បីមើលតម្លៃធម្មតា។ លើបំពង់មេបញ្ជូនទឹកវែង ការបាត់បង់ទាំងនេះមានទំហំតូចបើប្រៀបធៀបនឹងកកិត ប៉ុន្តែក្នុងបំពង់ខាងក្នុងស្ថានីយខ្លីៗ ការបាត់បង់ទាំងនេះអាចជាភាគច្រើននៃការបាត់បង់សរុប។</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Manning ប្រឡាយខណ្ឌកាត់មិនទៀងទាត់';
$ec_lang['mi_main_title']='ម៉ាស៊ីនគណនា Manning សម្រាប់ប្រឡាយខណ្ឌកាត់មិនទៀងទាត់ ឥតគិតថ្លៃ';
$ec_lang['mi_main_desc']='ម៉ាស៊ីនគណនាលំហូរឯកសណ្ឋាន Manning សម្រាប់ប្រឡាយខណ្ឌកាត់មិនទៀងទាត់';
$ec_lang['mi_waterSurfaceElevation']='កម្ពស់ផ្ទៃទឹក';
$ec_lang['mi_q_617']='<span class="ec-help" title="លំហូរផ្សំ Q ដោយប្រើ n ផ្សំសម្រាប់ក្នុងតំបន់និមួយៗ តាមរូបមន្ត Chow 6-17 ដែលមានល្បឿនស្មើគ្នា">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='ចំណុចខណ្ឌកាត់';
$ec_lang['mi_groupPoint']='ចំណុច';
$ec_lang['mi_groupSegment']='ផ្នែក';
$ec_lang['mi_groupRegion']='តំបន់';
$ec_lang['mi_station']='ស្ថា';
$ec_lang['mi_elevation']='កម្ពស់';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />ព្រំដែន<br />តំបន់<br />(ច្រាំង)';
$ec_lang['mi_tau']='ភាពកិន<br />បាត<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n<br />ផ្សំ';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='n ផ្សំ';
$ec_lang['mi_notes_1_def']='ម៉ាស៊ីនគណនានេះអនុវត្តតាមសៀវភៅណែនាំ HEC-RAS ក្នុងការគណនា n ផ្សំសម្រាប់តំបន់ ដោយប្រើវិធីសាស្ត្រ Chow 1959, ទំព័រ 136, សមីការ 6-17 (មិនមែន 6-18)។';


$ec_lang['mi_notes_2_term']='ស្រទាប់ថ្មការពារ';
$ec_lang['mi_notes_2_def']='ប្រើម៉ាស៊ីនគណនា Manning ប្រឡាយជ្រូងចតុកោណ ដើម្បីរចនាស្រទាប់ថ្មការពារ។ ម៉ាស៊ីនគណនានេះសមស្របជាងសម្រាប់ខណ្ឌធម្មជាតិ។';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning ការហូរទឹកក្នុងបំពង់';
$ec_lang['mpf_main_title']='ម៉ាស៊ីនគណនា Manning ការហូរទឹកក្នុងបំពង់ ឥតគិតថ្លៃ';
$ec_lang['mpf_main_desc']='រូបមន្ត Manning ការហូរទឹកបំពង់ឯកសណ្ឋានជាមួយ ជម្រាល និងជម្រៅដែលបានកំណត់';
$ec_lang['mpf_pipe_diameter']='ប្រឡោះបំពង់, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='ភាពក្រញ៉ោងម៉ាន់នីង, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">ជម្រាលកកិត, S<sub>f</sub></a><span class="ec-help" title="ជួនកាល ស្មើនឹងជម្រាលបំពង់។ តាមតំណភ្ជាប់សម្រាប់ការពន្យល់ (ជាភាសាអង់គ្លេសតែប៉ុណ្ណោះ)។"><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='សមាមាត្រជម្រៅហូរ, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='លំហូរ, Q';
$ec_lang['mpf_flow_tip']='លំហូរ និងជម្រៅត្រូវបានគណនាសម្រាប់បំពង់វែងគ្មានទីបញ្ចប់។ ដើម្បីទាញលំហូរនេះចូលទៅក្នុងបំពង់ ប្រហែលជាត្រូវការជម្រៅទឹកខាងលើខ្ពស់ជាងនេះ។ សូមមើលចំណាំខាងក្រោមសម្រាប់ព័ត៌មានលម្អិត និងវីដេអូបង្រៀន។';
$ec_lang['mpf_velocity']='ល្បឿន, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="ថាមពលស៊ីនេទិចជាកម្ពស់ជួរឈរទឹក, v²/2g">ទំនាប់ល្បឿន, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='ផ្ទៃហូរ, A';
$ec_lang['mpf_pipe_area']='ផ្ទៃបំពង់, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='សមាមាត្រផ្ទៃ, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='បរិវេណសើម, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='កាំធារ, R<sub>h</sub>';
$ec_lang['mpf_top_width']='ទទឹងខាងលើ, T';
$ec_lang['mpf_froude_number']='លេខ Froude, Fr';
$ec_lang['mpf_shear_stress']='តានតឹងកាត់មធ្យម, τ';
$ec_lang['mpf_full_flow']='ហូរពេញ, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='សមាមាត្រទៅនឹងហូរពេញ, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>នេះជាការហូរ និងជម្រៅនៅខាងក្នុងបំពង់ <em>វែងឥតកំណត់</em>។</dt><dd>ការទទួលទឹកចូលបំពង់អាចត្រូវការជម្រៅទឹកខាងលើខ្ពស់ជាងច្រើន។ បន្ថែមយ៉ាងហោចណាស់ 1.5 ដងទំនាប់ល្បឿន ដើម្បីទទួលបានជម្រៅទឹកខាងលើ ឬ <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">មើលការណែនាំ 2 នាទីរបស់ខ្ញុំ</a> សម្រាប់ការគណនាទំនាប់ទឹក culvert ស្ដង់ដារ ដោយប្រើ <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> ដែលជាកម្មវិធីគណនា culvert ឥតគិតថ្លៃ ពីរដ្ឋបាលផ្លូវហាយវេសហព័ន្ធសហរដ្ឋអាមេរិក។</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>តើអ្នកកំពុងរចនាបំពង់លូទឹកកខ្វក់ (sanitary sewer)?</dt><dd>សូមមើល <a target="_blank" href="/sewslope.php">តារាងជម្រាលអប្បបរមាបំពង់លូ</a> សម្រាប់បំពង់ទំហំ 4 ដល់ 96 អ៊ិន្ឈ៍ (100 ដល់ 2400 mm) ដែលបានផ្ដល់ជា m/m, mm/m និងភាគរយ ព្រមទាំង <a target="_blank" href="/peakfact.php">ការសិក្សាអំពីមេគុណកំពូល (peaking factors) សម្រាប់លំហូរទាបខ្លាំង</a>។ ឯកសារយោងទាំងពីរនេះមានតែជាភាសាអង់គ្លេសប៉ុណ្ណោះ។</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='សូមបញ្ចូល Q គោលដៅជាចំនួនវិជ្ជមាន។';
$ec_lang['mpf_solver_no_solution']='គ្មានដំណោះស្រាយ៖ Q លើសសមត្ថភាពបំពង់នៅ y/d0 = 93.8% (Qmax = {qmax} គិតជាឯកតាដែលបានជ្រើសរើស)។';
$ec_lang['mpf_solve_btn']='ដោះស្រាយ';
$ec_lang['mpf_solve_for_flow']='សម្រាប់លំហូរ, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Manning ការបាត់បង់ទំនាប់ក្នុងបំពង់';
$ec_lang['mphl_main_title']='ម៉ាស៊ីនគណនា Manning ការបាត់បង់ទំនាប់ក្នុងបំពង់ ឥតគិតថ្លៃ';
$ec_lang['mphl_main_desc']='រូបមន្ត Manning ការបាត់បង់ទំនាប់ ជាមួយការហូរពេញ';
$ec_lang['mphl_pipe_length']='ប្រវែងបំពង់, L';
$ec_lang['mphl_area']='ផ្ទៃ, A';
$ec_lang['mphl_total_junction_k']='មេគុណការបាត់បង់មូលដ្ឋាន, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='មេគុណការបាត់បង់, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='ការបាត់បង់មូលដ្ឋាន (ការបាត់បង់ក្នុងតំបន់) មេគុណ, km។ ការបាត់បង់ទាំងនេះកើតឡើងនៅចំណុចតភ្ជាប់បំពង់ ច្រកចូល ច្រកចេញ ចំណុចបត់ និងសន្ទះបិទបើក — ពាក្យអង់គ្លេស "minor" (មានន័យត្រង់ថា តូច) ត្រូវបានប្រើតាមទម្លាប់ ប៉ុន្តែអាចធ្វើឲ្យយល់ច្រឡំ ព្រោះនៅក្នុងបំពង់ខ្លី ការបាត់បង់ទាំងនេះអាចស្មើ ឬច្រើនជាងការបាត់បង់ដោយកកិត។ តម្លៃ k ធម្មតា: ច្រកចូលមុតស្រួច 0.5, ចំណុចបត់ 45° នីមួយៗ 0.2–0.3, សន្ទះទ្វារ (បើកពេញ) 0.1, សន្ទះមេអំបៅ 0.2, ច្រកចេញ (ទៅអាងស្តុក ឬបរិយាកាស) 1.0។ បូកសរុបគ្រឿងបំពាក់ទាំងអស់ ដើម្បីទទួលបាន km សរុប។ លំនាំដើម 2.0 សន្មតថាមានច្រកចូលមួយ ច្រកចេញមួយ និងចំណុចបត់ 45° ពីរ។';
$ec_lang['mphl_friction_slope']='ជម្រាលកកិត';
$ec_lang['mphl_friction_loss']='ការបាត់បង់ដោយកកិត, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='ការបាត់បង់មូលដ្ឋាន, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='ការបាត់បង់សរុប, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='EGL ចំហៀងក្រោម';
$ec_lang['mphl_egl_2']='EGL ចំហៀងលើ';
$ec_lang['mphl_hgl_egl_tip']='លទ្ធផលនេះអាចមិនត្រឹមត្រូវ ក្នុងករណីបំពង់ឡើងខ្ពស់លើសខ្សែថ្ពល់ធារាសាស្ត្រ។';
$ec_lang['mphl_note_1']='<dl><dt>ម៉ាស៊ីនគណនានេះមិនធ្វើគំរូទម្រង់បំពង់រវាងចុងទាំងពីរទេ។</dt><dd>ប្រសិនបើ HGL ធ្លាក់ចុះក្រោមផ្នែកខាងលើនៃបំពង់ត្រង់ចំណុចណាមួយ ការគណនានេះអាចមិនត្រឹមត្រូវ។</dd><dt>សម្រាប់លក្ខខណ្ឌចំហ (culvert) ចាំបាច់ត្រូវពិនិត្យលក្ខខណ្ឌត្រួតពិនិត្យធាតុចូល។</dt><dd>1. HGL ខាងលើ មិនអាចទាបជាងកម្ពស់ហូរជម្រៅធម្មតា ខាងលើ (ឬទាបជាងបំពង់!)។</dd><dd>2. ទំនាប់ទឹក culvert ត្រូវបានតំណាងប្រសើរជាងដោយ EGL ខាងលើ ជាជាង HGL ខាងលើ។</dd><dd>3. មើល <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">ការណែនាំ 2 នាទីរបស់ខ្ញុំ</a> សម្រាប់ការគណនាទំនាប់ទឹក culvert ស្ដង់ដារ ដោយប្រើ <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> ដែលជាកម្មវិធីគណនា culvert ឥតគិតថ្លៃ ពីរដ្ឋបាលផ្លូវហាយវេសហព័ន្ធសហរដ្ឋអាមេរិក។</dd><dd>4. ទំព័រនេះដោះស្រាយតែករណីត្រួតពិនិត្យផ្នែកចេញ (outlet control) ប៉ុណ្ណោះ គឺករណីបំពង់ហូរពេញ ដែលលក្ខខណ្ឌនៅខាងក្រោមជាអ្នកកំណត់ទំនាប់ទឹក។ ការរចនា culvert គឺជាការសម្រេចថាតើត្រួតពិនិត្យផ្នែកចូល (inlet control) ឬត្រួតពិនិត្យផ្នែកចេញ (outlet control) ជាអ្នកគ្រប់គ្រង ដូច្នេះប្រើ HY-8 រាល់ពេលដែលអាចជាករណីណាមួយក្នុងចំណោមទាំងពីរ។</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Manning ប្រឡាយជ្រូងចតុកោណ';
$ec_lang['mtc_main_title']='ម៉ាស៊ីនគណនា Manning ប្រឡាយជ្រូងចតុកោណ ឥតគិតថ្លៃ';
$ec_lang['mtc_main_desc']='រូបមន្ត Manning សម្រាប់លំហូរឯកសណ្ឋានក្នុងប្រឡាយជ្រូងចតុកោណ តាមជម្រាល និងជម្រៅដែលបានកំណត់';
$ec_lang['mtc_bottom_width']='ទទឹងខាងក្រោម, b';
$ec_lang['mtc_side_slope_1']='ជម្រាលចំហៀង 1, z<sub>1</sub> (ផ្ដេក/បញ្ឈរ)';
$ec_lang['mtc_side_slope_2']='ជម្រាលចំហៀង 2, z<sub>2</sub> (ផ្ដេក/បញ្ឈរ)';
$ec_lang['mtc_channel_slope']='ជម្រាលប្រឡាយ, S';
$ec_lang['mtc_flow_depth']='ជម្រៅហូរ, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">មុំបត់, β</a><span class="ec-help" title="សម្រាប់ការកំណត់ទំហំថ្មការពារ។ តាមតំណភ្ជាប់សម្រាប់គំនូសតាង។"><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="ដង់ស៊ីតេធៀបនឹងទឹក។ ជាធម្មតា ≈ 2.65 សម្រាប់ថ្មកិន។">ទម្ងន់ជាក់លាក់ថ្ម, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='ទំហំថ្មរចនា, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n ពីទំហំថ្មរចនា (វិធីសាស្ត្រ Strickler)';
$ec_lang['mtc_n_blodgett']='n ពីទំហំថ្មរចនា (វិធីសាស្ត្រ Blodgett)';
$ec_lang['mtc_n_bathurst']='n ពីទំហំថ្មរចនា (វិធីសាស្ត្រ Bathurst)';
$ec_lang['mtc_n_pi']='n ពីទំហំថ្មរចនា (វិធីសាស្ត្រ Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett ទល់នឹង Bathurst';
$ec_lang['mtc_pi_range_check']='ការត្រួតពិនិត្យដែនកំណត់ P&I';
$ec_lang['mtc_pi_ok']='d50 ស្ថិតក្នុងដែនកំណត់ P&I';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 ហ្វីត (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='ក្រៅដែនកំណត់';
$ec_lang['mtc_pi_tip']='កំពុងប៉ាន់ស្មានលើសពីដែនទិន្នន័យ 0.28–0.36 ហ្វីត ដែលសមីការនេះបានមកពី — សូមចាត់ទុកជាការត្រួតពិនិត្យប្រហាក់ប្រហែល មិនមែនជាមូលដ្ឋានរចនាឡើយ';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="តាមលោក Isbash (1936) និង Maricopa County រដ្ឋ Arizona សហរដ្ឋអាមេរិក។">ទំហំថ្មខ្ចាញ់ខាងក្រោមដែលត្រូវការ, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="តាមលោក Isbash (1936) និង Maricopa County រដ្ឋ Arizona សហរដ្ឋអាមេរិក។">ទំហំថ្មខ្ចាញ់ជម្រាលចំហៀង 1 ដែលត្រូវការ, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="តាមលោក Isbash (1936) និង Maricopa County រដ្ឋ Arizona សហរដ្ឋអាមេរិក។">ទំហំថ្មខ្ចាញ់ជម្រាលចំហៀង 2 ដែលត្រូវការ, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="តាមលោក Maynord, Ruff, and Abt (1989)។ នៅចំណុចបត់ ថ្មត្រូវបានកំណត់ទំហំសម្រាប់ល្បឿននៅចំណុចបត់ស្មើនឹង 4/3 នៃល្បឿនមធ្យម តាម California Division of Highways (1970); ចំណែកតម្លៃ 1.5 ផ្ទាល់ខ្លួនរបស់ Maynord អនុវត្តចំពោះប្រឡាយធម្មជាតិ។">ទំហំថ្មខ្ចាញ់ដែលត្រូវការ, D<sub>50</sub> (Maynord, Ruff, and Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='ទំហំថ្មខ្ចាញ់ដែលត្រូវការ, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='ល្បឿនសមស្របសម្រាប់សន្មតការហូរឯកសណ្ឋាន។';
$ec_lang['mtc_vel_low']='ល្បឿនទាប បង្កហានិភ័យឲ្យមានការស្រកកកនៃដីល្បាប់។';
$ec_lang['mtc_vel_high']='ល្បឿនខ្ពស់ ហើយអាចមិនសមហេតុផល។ សូមពិនិត្យការហូរច្រោះនៃស្រទាប់ការពារប្រឡាយ ជម្រៅបន្ថែមនៅកន្លែងបត់ និងការបាត់បង់ថាមពលនៅតំបន់ពង្រីក ឬកន្លែងស្ទះ។';
$ec_lang['mtc_iteration_tip']='ជ្រើសរើសជម្រើសភាពក្រញ៉ោង (ណែនាំ Blodgett–Bathurst) និងជម្រើសទំហំថ្ម (ណែនាំ Isbash) ដើម្បីឲ្យម៉ាស៊ីនគណនាធ្វើម្ដងទៀតដោយស្វ័យប្រវត្តិរហូតដល់បានទំហំថ្មឯកសណ្ឋានសម្រាប់លំហូរគោលដៅរបស់អ្នក។ សូមមើលចំណាំខាងក្រោមសម្រាប់វិធីសាស្ត្រពេញលេញ ឬបញ្ចូលតម្លៃភាពក្រញ៉ោងផ្ទាល់ខ្លួន (សូមមើលតំណភ្ជាប់សម្រាប់ការណែនាំ) និងមិនអើពើនឹងទំហំថ្ម ដើម្បីរំលងការធ្វើម្ដងទៀត។';
$ec_lang['mtc_note_1']='<dl><dt>ការធ្វើម្ដងទៀតដោយស្វ័យប្រវត្តិនៃការរចនាទំហំថ្ម និងភាពក្រញ៉ោង</dt><dd>ជ្រើសរើសជម្រើសភាពក្រញ៉ោង (ណែនាំ Blodgett–Bathurst) និងជម្រើសទំហំថ្មរចនា (ណែនាំ Isbash)។ កែសម្រួលជម្រៅ និងកត្តាសុវត្ថិភាពទំហំថ្ម ដើម្បីទទួលបានលំហូរគោលដៅជាមួយទំហំថ្មឯកសណ្ឋាន។ រាល់ពេលអ្នកផ្លាស់ប្ដូរតម្លៃបញ្ចូលណាមួយ ម៉ាស៊ីនគណនានឹងធ្វើជំហានទាំងនេះម្ដងទៀត៖ 1. ភាពក្រញ៉ោងត្រូវបានគណនាពីទំហំថ្មរចនា។ 2. ការគណនាភាពក្រញ៉ោងដែលទទួលបានត្រូវបានចម្លងទៅតម្លៃភាពក្រញ៉ោងបញ្ចូល។ 3. លំហូរប្រឡាយ និងទំហំថ្មដែលត្រូវការត្រូវបានគណនា។ 4. ទំហំថ្មរចនាត្រូវបានកែសម្រួល។ 5. ធ្វើម្ដងទៀតរហូតដល់កំហុសនៃទំហំថ្មរចនាមានតម្លៃតូចណាស់។</dd><dt>ម៉ាស៊ីនគណនាមូលដ្ឋាន (គ្មានការធ្វើម្ដងទៀត)</dt><dd>បញ្ចូលតម្លៃភាពក្រញ៉ោងដែលអ្នកចង់បាន។ មិនចាំបាច់យកចិត្តទុកដាក់ចំពោះផ្ទៃបញ្ចូលទំហំថ្មរចនានោះទេ។</dd></dl>';
$ec_lang['mtc_note_2_term']='ការពិនិត្យល្បឿន';
$ec_lang['mtc_note_2_def']='ល្បឿនខ្ពស់បង្ហាញថាមានការធ្លាក់កម្ពស់ដ៏ធំដែលបង្កើតថាមពលជាក់លាក់ខ្ពស់បែបនេះ។ ថាមពលនោះអាចបាត់បង់យ៉ាងឆាប់រហ័សនៅតំបន់ពង្រីក ការបត់ ឬការស្ទះ។ សូមផ្ទៀងផ្ទាត់ថាតើនេះសមហេតុផលសម្រាប់ទីតាំងនេះ។';
$ec_lang['mtc_solver_no_solution']='រកមិនឃើញដំណោះស្រាយសម្រាប់ Q ដែលបានផ្ដល់ ជាមួយនឹងធាតុចូលប្រឡាយទាំងនេះ។';
// Weir Flow Simple
$ec_lang['ws_main_menu']='ការហូរស្ទីងសាមញ្ញ';
$ec_lang['ws_main_title']='ម៉ាស៊ីនគណនាការហូរស្ទីងកំពូលទទឹងសាមញ្ញតាមអនឡាញ ឥតគិតថ្លៃ';
$ec_lang['ws_main_desc']='ម៉ាស៊ីនគណនាការហូរស្ទីងកំពូលទទឹងសាមញ្ញ';
$ec_lang['ws_weirLength']='ប្រវែងស្ទីង, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="ថាមពលក្នុងមួយឯកតាទម្ងន់ទឹក — កម្ពស់ជួរឈរទឹក មិនមែនសម្ពាធទេ">ក្បាលទឹក, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='មេគុណស្ទីង, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='កំណត់ចំណាំ';
$ec_lang['ws_notes_we_term']='សមីការស្ទីង';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='ការហូរស្ទីងកំពូលមិនទៀងទាត់';
$ec_lang['wi_main_title']='ម៉ាស៊ីនគណនាការហូរស្ទីងតាមអនឡាញ ឥតគិតថ្លៃ — ចែកជាចម្រៀក ជម្រៅប្រែប្រួល និងកំពូលមិនទៀងទាត់';
$ec_lang['wi_main_desc']='ម៉ាស៊ីនគណនាការហូរស្ទីងកំពូលមិនទៀងទាត់';
$ec_lang['wi_weirPoints']='ចំណុចស្ទីង';
$ec_lang['wi_pondingHeight']='កម្ពស់ទឹកជាំ';
$ec_lang['wi_incrementalFlow']='លំហូរជាដំណាក់កាល';
$ec_lang['wi_cumulativeFlow']='លំហូរសរុប';
$ec_lang['wi_notes_we_def']='q = ប្រសិនបើ (ចម្ងាយ = 0) នោះ 0 បើមិនដូច្នេះទេ ប្រសិនបើ (ជម្រាល=0) នោះ cw*ចម្ងាយ*d<sub>0</sub><sup>1.5</sup> បើមិនដូច្នេះទេ cw/(2.5*ជម្រាល) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) ដែល d<sub>1</sub> និង d<sub>0</sub> តែងតែវិជ្ជមាន ឬ សូន្យ';
// Orifice Flow
$ec_lang['or_main_menu']='ការហូរប្រហោង';
$ec_lang['or_main_title']='ម៉ាស៊ីនគណនាការហូរប្រហោងតាមអនឡាញ ឥតគិតថ្លៃ';
$ec_lang['or_main_desc']='ការហូរប្រហោង — សេរី ឬ ជ្រុក';
$ec_lang['or_shape_circular']='មូល';
$ec_lang['or_shape_rectangular']='ចតុកោណ';
$ec_lang['or_diameter']='<span class="ec-help" title="អង្កត់ផ្ចិតសម្រាប់រន្ធមូល; កម្ពស់សម្រាប់រន្ធចតុកោណ">អង្កត់ផ្ចិត ឬ កម្ពស់, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="សម្រាប់រន្ធចតុកោណប៉ុណ្ណោះ">ទទឹង, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="បាតនៃរន្ធ">កម្ពស់បាតរន្ធ <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='កម្ពស់ទឹកខាងលើ';
$ec_lang['or_twe']='កម្ពស់ទឹកខាងក្រោម';
$ec_lang['or_cd']='មេគុណលំហូរ, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='កម្ពស់ចំណុចកណ្ដាល';
$ec_lang['or_head']='<span class="ec-help" title="ថាមពលក្នុងមួយឯកតាទម្ងន់ទឹក — កម្ពស់ជួរឈរទឹក មិនមែនសម្ពាធទេ">ក្បាលទឹកប្រសិទ្ធិ, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='ផ្ទៃរន្ធ, A';
$ec_lang['or_regime']='ការពិនិត្យរបបហូរប្រហោង';
$ec_lang['or_regime_valid']='ហូរចេញសេរី';
$ec_lang['or_regime_submerged']='ប្រហោងជ្រុក';
$ec_lang['or_regime_submerged_tip']='កម្ពស់ទឹកខាងក្រោមនៅលើចំណុចកណ្ដាល — របបហូរប្រហោងនៅតែត្រឹមត្រូវ';
$ec_lang['or_regime_warn']='ក្រៅរបបហូរប្រហោង';
$ec_lang['or_regime_warn_tip']='កម្ពស់ទឹកខាងលើនៅក្រោមកំពូល';
$ec_lang['or_regime_twe_above_hwe']='ពិនិត្យទិន្នន័យបញ្ចូល';
$ec_lang['or_regime_twe_above_hwe_tip']='កម្ពស់ទឹកខាងក្រោម (TWE) នៅលើកម្ពស់ទឹកខាងលើ (HWE)';
$ec_lang['or_notes_1_term']='សមីការប្រហោង';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh)។ សម្រាប់ការហូរចេញសេរី: h = HWE − ចំណុចកណ្ដាល។ សម្រាប់ការហូរជ្រុក (TWE លើបាតរន្ធ): h = HWE − TWE។';
$ec_lang['or_notes_2_term']='របបហូរប្រហោង';
$ec_lang['or_notes_2_def']='សមីការការហូរប្រហោងអនុវត្តនៅពេលផ្ទៃទឹកខាងលើស្ថិតនៅលើកំពូល (ខាងលើ) នៃរន្ធ។ នៅពេលទឹកខាងលើនៅក្រោមកំពូល សូមប្រើសមីការស្ទីងជំនួសវិញ។';
$ec_lang['or_notes_3_term']='មេគុណលំហូរ';
$ec_lang['or_notes_3_def']='C<sub>d</sub> ស្ថិតក្នុងចន្លោះប្រហែល 0.60–0.65 សម្រាប់ប្រហោងគែមមុត។ ធាតុចូលមូល ឬបញ្ច្រាស (re-entrant) ប្រើតម្លៃខុសគ្នា។ សូមមើល <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> ឬ HEC-RAS Hydraulic Reference Manual សម្រាប់ការណែនាំបន្ថែម។';
$ec_lang['or_notes_4_term']='ការជ្រុក';
$ec_lang['or_notes_4_def']='នៅពេល TWE ស្ថិតនៅលើបាតរន្ធ ម៉ាស៊ីនគណនានេះនឹងអនុវត្តសមីការប្រហោងជ្រុកដោយស្វ័យប្រវត្តិ ដោយប្រើ h = HWE − TWE។ នៅពេល TWE ស្ថិតនៅ ឬ ក្រោមបាតរន្ធ ការហូរចេញសេរីត្រូវបានសន្មត និង h = HWE − ចំណុចកណ្ដាល។';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='ថាមពលវារីអគ្គិសនីខ្នាតតូច';
$ec_lang['mhp_main_title']='ម៉ាស៊ីនគណនាថាមពលវារីអគ្គិសនីខ្នាតតូចលើអនឡាញ ឥតគិតថ្លៃ';
$ec_lang['mhp_main_desc']='ម៉ាស៊ីនគណនាផលិតថាមពលវារីអគ្គិសនីខ្នាតតូច ថាមពលទឹករត់';
$ec_lang['mhp_gross_head']='ក្បាលទឹកសរុប, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="អង្កត់ផ្ចិតបំពង់សម្ពាធ (បំពង់ផ្គត់ផ្គង់)">អង្កត់ផ្ចិតបំពង់សម្ពាធ, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='ប្រវែង, L';
$ec_lang['mhp_efficiency']='ប្រសិទ្ធភាពរោងចក្រ, η (0–1)';
$ec_lang['mhp_vel_check']='ការត្រួតពិនិត្យល្បឿន';
$ec_lang['mhp_hl_check']='ការត្រួតពិនិត្យការបាត់បង់ក្បាលទឹក';
$ec_lang['mhp_hnet']='ក្បាលទឹកសុទ្ធ, H<sub>net</sub>';
$ec_lang['mhp_power']='ថាមពលផ្តល់ចេញ, P';
$ec_lang['mhp_annual_kwh']='P ជាថាមពលប្រចាំឆ្នាំ';
$ec_lang['mhp_vel_low']='ល្បឿនទាប — ហានិភ័យនៃការស្រកកករបាតកករ និងការចូលខ្យល់ក្នុងទឹក។';
$ec_lang['mhp_vel_high']='ល្បឿនខ្ពស់ — ត្រួតពិនិត្យការបាត់បង់ដោយផ្លាស់ប្តូរផ្នែក ថាមពលដែលមាន និងហានិភ័យការទះទឹកក្នុងបំពង់ (water hammer)។';
$ec_lang['mhp_vel_ok_short']='ល្អ';
$ec_lang['mhp_vel_high_short']='ខ្ពស់';
$ec_lang['mhp_vel_low_short']='ទាប';
$ec_lang['mhp_vel_ok_tip']='ល្បឿននេះស្ថិតក្នុងចន្លោះមានប្រសិទ្ធភាពសម្រាប់ការរចនាបំពង់សម្ពាធ។';
$ec_lang['mhp_hl_ok_tip']='ការបាត់បង់ថ្ពល់ក្រោម 10% នៃថ្ពល់សរុប។ ទំហំបំពង់នេះមានប្រសិទ្ធភាពសេដ្ឋកិច្ច។';
$ec_lang['mhp_hl_warn_tip']='ការបាត់បង់ថ្ពល់លើសពី 10% នៃថ្ពល់សរុប។ សូមពិចារណាប្រើបំពង់ធំជាងនេះ។';
$ec_lang['mhp_hl_bad_tip']='ការបាត់បង់ថ្ពល់លើសពី 20% នៃថ្ពល់សរុប។ សូមប្ដូរទំហំបំពង់។';
$ec_lang['mhp_notes_1_term']='ការបាត់បង់ក្បាលទឹក';
$ec_lang['mhp_notes_1_def']='ការបាត់បង់សរុបក្នុងបំពង់សម្ពាធ h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, ដែល h<sub>f</sub> = f(L/D)(v²/2g) ជាការបាត់បង់ដោយកកិតតាមរូបមន្ត Darcy-Weisbach ហើយ h<sub>m</sub> = k<sub>m</sub>·v²/2g គ្របដណ្ដប់ការបាត់បង់នៅច្រកចូល ការបត់ និងវ៉ាល់។ ក្បាលទឹកសុទ្ធ H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>។';
$ec_lang['mhp_notes_2_term']='ល្បឿន';
$ec_lang['mhp_notes_2_def']='ត្រួតពិនិត្យថាតើល្បឿនសមស្របតាមកម្ពស់ធ្លាក់ដែលមាន និងតម្លៃបំពង់។ ល្បឿនទាបពេកអាចបញ្ជាក់ថាបំពង់ធំពេក ចំណែកល្បឿនលឿនពេកអាចបង្កើនការបាត់បង់ដោយកកិត និងហានិភ័យនៃការទះទឹកក្នុងបំពង់ (water hammer)។';
$ec_lang['mhp_notes_3_term']='គោលដៅការបាត់បង់ក្បាលទឹក';
$ec_lang['mhp_notes_3_def']='ការបាត់បង់ក្នុងបំពង់ផ្គត់ផ្គង់ (Penstock) ក្រោម 10% នៃក្បាលទឹកសរុប ជាទូទៅមានប្រសិទ្ធភាពសេដ្ឋកិច្ចល្អ។ តុល្យភាពដ៏ល្អបំផុតរវាងតម្លៃបំពង់ និងថាមពលដែលបាត់បង់ ជាធម្មតាធ្លាក់ចន្លោះ 4–6% ក្នុងករណីអគ្គិសនីមានតម្លៃខ្ពស់។';
$ec_lang['mhp_notes_6_term']='ប្រសិទ្ធភាព';
$ec_lang['mhp_notes_6_def']='ប្រសិទ្ធភាពរោងចក្រធម្មតា η ស្ថិតចន្លោះ 0.70 ដល់ 0.85 សម្រាប់ទួរប៊ីនប្រភេទ Pelton និង cross-flow ដែលប្រើជាទូទៅក្នុងប្រព័ន្ធវារីអគ្គិសនីខ្នាតតូច។ ប្រើ 0.75 ជាការប៉ាន់ស្មានដំបូងបែបប្រុងប្រយ័ត្ន។';
$ec_lang['mhp_notes_7_term']='ថាមពលប្រចាំឆ្នាំ';
$ec_lang['mhp_notes_7_def']='ថាមពលប្រចាំឆ្នាំសន្មតថាមានប្រតិបត្តិការហូរពេញជានិច្ច (8760 ម៉ោង/ឆ្នាំ)។ ការផលិតជាក់ស្តែងនឹងទាបជាងនេះ ដោយសារការប្រែប្រួលលំហូរតាមរដូវ ការឈប់ថែទាំ និងកត្តាបន្ទុក (load factor)។';

// Orifice Drain Time
$ec_lang['odt_main_menu']='ស្រះ និងធុង — ពេលបង្ហូរទឹក';
$ec_lang['odt_main_title']='ម៉ាស៊ីនគណនាពេលបង្ហូរទឹកស្រះ អាង ឬ ធុងតាមអនឡាញ ឥតគិតថ្លៃ (ប្រហោង)';
$ec_lang['odt_main_desc']='ស្រះ អាង ឬ ធុង — ពេលបង្ហូរទឹកតាមច្រកចេញប្រហោង, វិធីសាស្ត្របរិមាណកោណ';
$ec_lang['odt_h1_elev']='កម្ពស់ផ្ទៃទឹកចាប់ផ្ដើម';
$ec_lang['odt_a1']='ផ្ទៃចាប់ផ្ដើម, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='កម្ពស់ផ្ទៃទឹកចុងក្រោយ';
$ec_lang['odt_a0']='ផ្ទៃនៅកម្ពស់ប្រហោង, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="គណនាដោយ interpolation ពីគំរូ conic នៅកម្ពស់ចុងក្រោយ">ផ្ទៃចុងក្រោយ, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='ការពិនិត្យកម្ពស់ចុងក្រោយ';
$ec_lang['odt_h2_ok']='កម្ពស់ចុងក្រោយនៅលើកំពូលប្រហោង';
$ec_lang['odt_h2_warn']='កម្ពស់ចុងក្រោយស្ថិតនៅ ឬ ក្រោមកំពូលប្រហោង';
$ec_lang['odt_h2_warn_tip']='កំពូលប្រហោង = ចំណុចកណ្ដាល + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="អង្កត់ផ្ចិត (ករណីមូល) ឬ កម្ពស់ (ករណីចតុកោណ)">ប្រហោង D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="សម្រាប់ចតុកោណប៉ុណ្ណោះ">ទទឹងប្រហោង, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='ពេលបង្ហូរ (វ)';
$ec_lang['odt_t_min']='ពេលបង្ហូរ (នាទី)';
$ec_lang['odt_t_hr']='ពេលបង្ហូរ (ម៉ោង)';
$ec_lang['odt_t_day']='ពេលបង្ហូរ (ថ្ងៃ)';
$ec_lang['odt_notes_1_term']='រូបមន្ត';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) ផ្តល់ពេលបង្ហូរពីក្បាលទឹក H ទៅប្រហោង។ ពេលបង្ហូរ = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), ដែល H<sub>1</sub> = កម្ពស់ចាប់ផ្ដើម − កម្ពស់ប្រហោង, H<sub>2</sub> = កម្ពស់ចុងក្រោយ − កម្ពស់ប្រហោង។';
$ec_lang['odt_notes_2_term']='វិធីសាស្ត្រ';
$ec_lang['odt_notes_2_def']='វិធីសាស្ត្រ conic volume ចាត់ទុកស្រះ ឬ អាង ជាផ្នែក conic រវាងផ្ទៃដំបូង A<sub>1</sub> នៅផ្ទៃទឹកដំបូង និងផ្ទៃ A<sub>0</sub> នៅកម្ពស់ចំណុចកណ្ដាលប្រហោង។ A<sub>2</sub> ជាផ្ទៃស្រះនៅកម្ពស់ចុងក្រោយ ត្រូវបានគណនាដោយ interpolation ពី A<sub>1</sub> និង A<sub>0</sub> ដោយប្រើគំរូ conic section។ ពេលបង្ហូរពីកម្ពស់ដំបូងដល់កម្ពស់ចុងក្រោយ ស្មើនឹងពេលបង្ហូរសរុបពី H<sub>1</sub> ដល់ប្រហោង ដកពេលបង្ហូរនៅសល់ពី H<sub>2</sub> ដល់ប្រហោង។';
$ec_lang['odt_h1']='<span class="ec-help" title="កម្ពស់ផ្ទៃទឹកចាប់ផ្ដើម ដក កម្ពស់ចំណុចកណ្ដាលប្រហោង">ក្បាលទឹកចាប់ផ្ដើម, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='លំហូរអតិបរមា, Q<sub>max</sub>';
$ec_lang['odt_vol']='បរិមាណដែលបានបង្ហូរ';
$ec_lang['odt_sketch_start']='ចាប់ផ្ដើម';
$ec_lang['odt_sketch_end']='ចប់';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='គម្លាតរវាងក្បាលបញ្ចេញទឹក, S<sub>e</sub>';
$ec_lang['ip_sl']='គម្លាតរវាងបំពង់រង, S<sub>l</sub>';
$ec_lang['ip_n_e']='ចំនួនក្បាលបញ្ចេញទឹកក្នុងបំពង់រងមួយ, n<sub>e</sub>';
$ec_lang['ip_n_l']='ចំនួនបំពង់រងក្នុងតំបន់មួយ, n<sub>l</sub>';
$ec_lang['ip_d']='ជម្រៅដាក់ទឹកគោលដៅ, d';
$ec_lang['ip_a_e']='ផ្ទៃដីក្នុងក្បាលបញ្ចេញទឹកមួយ, A<sub>e</sub>';
$ec_lang['ip_pr']='អត្រាដាក់ទឹក, PR';
$ec_lang['ip_q_lat']='លំហូរក្នុងបំពង់រងមួយ, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='លំហូរតំបន់, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='ពេលដំណើរការ (ម៉ោង)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='ការជ្រាបទឹកប្រឡាយ';
$ec_lang['cs_main_title']='ម៉ាស៊ីនគណនាការជ្រាបទឹកប្រឡាយ និងប្រសិទ្ធភាពដឹកជញ្ជូនឥតគិតថ្លៃតាមអ៊ីនធឺណិត';
$ec_lang['cs_main_desc']='ការបាត់បង់ដោយការជ្រាបទឹកប្រឡាយ និងប្រសិទ្ធភាពដឹកជញ្ជូន — វិធីសាស្ត្រលំហូរចូល-ចេញ';
$ec_lang['cs_Q_in']='លំហូរចូល, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='លំហូរចេញ, Q<sub>out</sub>';
$ec_lang['cs_L']='ប្រវែងចម្រៀកប្រឡាយ, L';
$ec_lang['cs_Q_loss']='អត្រាការជ្រាបទឹក, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='ការត្រួតពិនិត្យការវាស់ស្ទង់';
$ec_lang['cs_pct_loss']='ប្រភាគនៃការជ្រាបទឹក';
$ec_lang['cs_Ec']='ប្រសិទ្ធភាពដឹកជញ្ជូន, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='ការវាយតម្លៃប្រសិទ្ធភាព';
$ec_lang['cs_Vol_day']='បរិមាណជ្រាបទឹកប្រចាំថ្ងៃ';
$ec_lang['cs_Vol_year']='បរិមាណជ្រាបទឹកប្រចាំឆ្នាំ';
$ec_lang['cs_Q_loss_per_L']='អត្រាជ្រាបទឹកក្នុងមួយឯកតាប្រវែង, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='តម្លៃទឹក';
$ec_lang['cs_lining_cost']='ថ្លៃស្រទាប់';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="គោលដៅប្រសិទ្ធភាពដឹកជញ្ជូនក្រោយពេលធ្វើស្រទាប់; ប្រភាគ 0–1">គោលដៅស្រទាប់, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='ផ្ទៃស្រទាប់, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='តម្លៃប្រចាំឆ្នាំដែលបាត់បង់';
$ec_lang['cs_annual_value_recovered']='តម្លៃប្រចាំឆ្នាំដែលទទួលបានមកវិញ';
$ec_lang['cs_lining_total_cost']='ថ្លៃស្រទាប់សរុប';
$ec_lang['cs_payback_years']='<span class="ec-help" title="ការសងវិញសាមញ្ញ = ថ្លៃស្រទាប់សរុប ÷ តម្លៃប្រចាំឆ្នាំដែលទទួលបានមកវិញ">រយៈពេលសងវិញ <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — រកឃើញការជ្រាបទឹក';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — គ្មានការជ្រាបទឹកអាចវាស់បាន';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — ពិនិត្យការវាស់ស្ទង់';
$ec_lang['cs_Ec_good']='ល្អ — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='មធ្យម — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='ខ្សោយ — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='វិធីសាស្ត្រលំហូរចូល-ចេញ ប៉ាន់ស្មានការជ្រាបទឹកដោយវាស់លំហូរនៅក្បាល និងចុងចម្រៀកប្រឡាយ: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>។ ប្រសិទ្ធភាពដឹកជញ្ជូន E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>។ បរិមាណប្រចាំឆ្នាំសន្មតថាប្រតិបត្តិការហូរពេញជានិច្ច; ការជ្រាបទឹកជាក់ស្តែងទាបជាងនេះសម្រាប់ប្រឡាយប្រើតាមរដូវ ឬហូរមិនពេញ។';
$ec_lang['cs_notes_2_term']='ការវាយតម្លៃប្រសិទ្ធភាព';
$ec_lang['cs_notes_2_def']='ប្រឡាយដីធម្មតាគ្មានស្រទាប់ការពារ: E<sub>c</sub> = 60–80%។ ប្រឡាយដីដែលថែទាំបានល្អ: 75–85%។ ប្រឡាយស្រទាប់បេតុង: 90–98%។ ការជ្រាបទឹកលើសពី 30% នៃលំហូរចូល ជាទូទៅសមស្របនឹងវិនិយោគលើការធ្វើស្រទាប់ការពារ។ (USBR, FAO)';
$ec_lang['cs_notes_3_term']='ការត្រឡប់វិនិយោគស្រទាប់';
$ec_lang['cs_notes_3_def']='បញ្ចូលតម្លៃទឹក និងថ្លៃដើមស្រទាប់ជារូបិយប័ណ្ណណាមួយ ដោយប្រើឲ្យស្របគ្នា។ ផ្ទៃស្រទាប់ = ប្រវែងចម្រៀកប្រឡាយ × បរិវេណសើម — បរិវេណសើមនៃផ្នែកកាត់ខ្នាតប្រឡាយនៅជម្រៅលំហូរដែលបានវាស់ (ទទឹងបាត បូកនឹងជម្រាលសើមទាំងពីរចំហៀង)។ តម្លៃប្រចាំឆ្នាំដែលទទួលបានមកវិញសន្មតថាប្រឡាយដែលបានស្រទាប់សម្រេចបាននូវគោលដៅ E<sub>c</sub> ជាប់ជានិច្ច។ រយៈពេលសងវិញជាក់ស្តែងនឹងវែងជាងនេះ សម្រាប់ប្រឡាយប្រើតាមរដូវ ឬប្រសិនបើស្រទាប់មិនឈានដល់ប្រសិទ្ធភាពគោលដៅ។';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, ការបោះពុម្ពទី 3 (2001)។ FAO Irrigation and Drainage Paper 57 (1999)។';
// About
$ec_lang['about_main_menu']='អំពី';
$ec_lang['install_main_menu']='ដំឡើង';
$ec_lang['install_main_title']='ដំឡើង EngCalcs';
$ec_lang['install_main_desc']='បន្ថែមទៅឧបករណ៍របស់អ្នកសម្រាប់ប្រើដោយគ្មានអ៊ីនធឺណិត';
$ec_lang['install_intro']='EngCalcs គឺជាកម្មវិធីវេបទំនើប (Progressive Web App - PWA)។ នៅពេលដំឡើងរួច ម៉ាស៊ីនគណនាទាំងអស់អាចដំណើរការពេញលេញដោយគ្មានអ៊ីនធឺណិត — មិនចាំបាច់មានការតភ្ជាប់អ៊ីនធឺណិតទេ។';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>បើកទំព័រម៉ាស៊ីនគណនាណាមួយក្នុងកម្មវិធី Chrome។</li><li>ចុចប៊ូតុង <strong>⬇ ដំឡើង</strong> នៅលើរបារនាំផ្លូវខាងលើ ឬចុចម៉ឺនុយកម្មវិធីរុករក (⋮) ហើយជ្រើសរើស <strong>បន្ថែមទៅអេក្រង់ដើម</strong>។</li><li>ចុច <strong>ដំឡើង</strong> នៅក្នុងសារដែលបង្ហាញឡើង។</li><li>EngCalcs នឹងបង្ហាញនៅលើអេក្រង់ដើមរបស់អ្នក ហើយអាចដំណើរការដោយគ្មានអ៊ីនធឺណិត។</li>';
$ec_lang['install_now_btn']='⬇ ដំឡើងឥឡូវនេះ';
$ec_lang['install_prompt_unavailable']='សារដំឡើងមិនអាចប្រើបានទេ — សូមប្រើម៉ឺនុយកម្មវិធីរុករករបស់អ្នកជំនួសវិញ។';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>បើកទំព័រម៉ាស៊ីនគណនាណាមួយក្នុងកម្មវិធី Safari។</li><li>ចុចប៊ូតុង <strong>ចែករំលែក</strong> (រូបប្រអប់មានព្រួញចង្អុលឡើងលើ)។</li><li>រំកិលចុះក្រោម ហើយចុច <strong>បន្ថែមទៅអេក្រង់ដើម</strong>។</li><li>ចុច <strong>បន្ថែម</strong>។ EngCalcs នឹងបង្ហាញនៅលើអេក្រង់ដើមរបស់អ្នក។</li>';
$ec_lang['install_ios_note']='នៅលើ iOS ការដំឡើងតែងតែប្រើម៉ឺនុយចែករំលែក — គ្មានសារដំឡើងស្វ័យប្រវត្តិទេ។';
$ec_lang['install_desktop_heading']='កុំព្យូទ័រតុ (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>បើកទំព័រម៉ាស៊ីនគណនាណាមួយ។</li><li>ចុច <strong>រូបតំណាងដំឡើង</strong> (⊕ ឬរូបតំណាងកុំព្យូទ័រ) នៅក្នុងរបារអាសយដ្ឋានរបស់កម្មវិធីរុករក ឬបើកម៉ឺនុយកម្មវិធីរុករក ហើយជ្រើសរើស <strong>ដំឡើង EngCalcs…</strong></li><li>ចុច <strong>ដំឡើង</strong>។ EngCalcs នឹងបើកជាបង្អួចកម្មវិធីដាច់ដោយឡែក។</li>';
$ec_lang['install_firefox_heading']='Firefox / កម្មវិធីរុករកផ្សេងទៀត';
$ec_lang['install_firefox_body']='Firefox មិនគាំទ្រការដំឡើង PWA នៅលើកុំព្យូទ័រតុទេ។ អ្នកនៅតែអាចប្រើម៉ាស៊ីនគណនាទាំងអស់បានធម្មតាក្នុងកម្មវិធីរុករក — បន្ទាប់ពីចូលមើលលើកដំបូង ទំព័រនានានឹងត្រូវបានរក្សាទុកជាមុនដោយស្វ័យប្រវត្តិសម្រាប់ការប្រើប្រាស់ដោយគ្មានអ៊ីនធឺណិត។';
$ec_lang['install_cached_heading']='អ្វីខ្លះត្រូវបានរក្សាទុកជាមុន';
$ec_lang['install_cached_body']='នៅពេលអ្នកដំឡើង EngCalcs ជាលើកដំបូង ទំព័រម៉ាស៊ីនគណនាទាំងអស់ និងឯកសារគាំទ្ររបស់វា (script, style) នឹងត្រូវបានរក្សាទុកនៅលើឧបករណ៍របស់អ្នកដោយស្វ័យប្រវត្តិ។ បន្ទាប់ពីនោះ អ្វីៗទាំងអស់នឹងដំណើរការដោយគ្មានការតភ្ជាប់អ៊ីនធឺណិត។ ជម្រើសភាសារបស់អ្នកនឹងត្រូវបានចងចាំពីការចូលមើលតាមអនឡាញចុងក្រោយរបស់អ្នក។';
$ec_lang['contact_main_menu']='ទំនាក់ទំនង';
$ec_lang['about_main_title']='អំពី HawsEDC ម៉ាស៊ីនគណនាវិស្វកម្ម';
$ec_lang['about_main_desc']='បេសកកម្ម កម្មវិធីសេរី និងការចូលរួម';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>បេសកកម្ម</h3><p>ម៉ាស៊ីនគណនាវិស្វកម្ម HawsEDC មានឡើងដើម្បីបម្រើដល់វិស្វករ និងកម្មករវាលស្រែទូទាំងពិភពលោក — ជាពិសេសសម្រាប់អ្នកដែលធ្វើការនៅក្នុងតំបន់ខ្វះខាតទឹក ធនធានមានកំណត់ ឬតំបន់ដែលខ្វះការបម្រើ។ ឧបករណ៍ទាំងនេះជាផ្នែកមួយនៃបេសកកម្មមនុស្សធម៌ទូលំទូលាយ: ប្រាប់មនុស្សគ្រប់រូបតាមវិធីដ៏ជាក់ស្ដែង និងមានប្រសិទ្ធភាពបំផុតថា ពួកគេត្រូវបានស្រឡាញ់ និងឲ្យតម្លៃជារៀងរហូត ថាពួកគេមិនមានអ្វីត្រូវខ្លាចទេ ហើយថាពួកគេនឹងមិនបំផ្លាញអ្វីទាំងអស់ទេ។</p><p>ម៉ាស៊ីនគណនាជាយានជំនិះ។ ទិសដៅគឺពិភពលោកមួយដែលគ្មានទុក្ខវេទនា។</p><h3>អាជ្ញាប័ណ្ណកម្មវិធីសេរី និងប្រភពបើកចំហ</h3><p>កូដទាំងអស់ត្រូវបានចេញផ្សាយក្រោម <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 ឬក្រោយ</a> — សេរីក្នុងន័យសេរីភាព។ អ្នកអាចប្រើប្រាស់ សិក្សា កែប្រែ និងចែកចាយកូដឡើងវិញក្រោមលក្ខខណ្ឌដូចគ្នា។</p><p>នេះជាការអញ្ជើញ មិនមែនជាតម្លៃទេ។ គ្មានកម្រិតបង់ប្រាក់ គ្មានកម្រិតឥតគិតថ្លៃដែលអាចត្រូវដកហូតវិញ ហើយគ្មានការពន្យារពេលមុននឹងកូដក្លាយជារបស់អ្នក។ កំណែពេញលេញដែលអ្នកឃើញនាថ្ងៃនេះ គឺឥតគិតថ្លៃសម្រាប់មនុស្សគ្រប់គ្នា ទាំងឥឡូវនេះ និងជារៀងរហូត សម្រាប់ការប្រើប្រាស់ និងកែប្រែ។</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>កូដប្រភព</h3><p>កូដប្រភពពេញលេញអាចរកបានជាសាធារណៈនៅ GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>អ្នកអាចរុករកកូដ ដាក់ស្នើបញ្ហា ឬ fork repository នៅទីនោះ។</p><h3>ការចូលរួម</h3><p>ជំនួយគ្រប់ប្រភេទត្រូវបានស្វាគមន៍។ <a href="contact.php">ទាក់ទង Tom Haws</a>។</p><ul><li><strong>ការបកប្រែ:</strong> ស្នើពាក្យសម្តីល្អជាងមុន។ កែលម្អ ឬបន្ថែមភាសាថ្មី។</li><li><strong>របាយការណ៍កំហុស:</strong> ប្រើទម្រង់មតិកែលម្អនៅក្នុងទំព័រម៉ាស៊ីនគណនាណាមួយ ឬដាក់ស្នើបញ្ហានៅ GitHub។</li><li><strong>ម៉ាស៊ីនគណនាថ្មី:</strong> គំនិតសម្រាប់ឧបករណ៍វិស្វកម្មអ៊ីដ្រូលីកដែលបម្រើដល់កម្មករវាល និងអ្នកជំនាញស្រោចស្រព ត្រូវបានស្វាគមន៍ជាពិសេស។</li><li><strong>ការបង្ហោះ:</strong> ប្រសិនបើអ្នកអាចធ្វើ mirror ម៉ាស៊ីនគណនាទាំងនេះសម្រាប់តំបន់ដែលមានការតភ្ជាប់អ៊ីនធឺណិតមានកំណត់ សូមទាក់ទងខ្ញុំ។</li></ul><h3>ការប្រើប្រាស់ក្រៅបណ្តាញ</h3><p>ម៉ាស៊ីនគណនាទាំងនេះដំណើរការជា <strong>កម្មវិធីវេបជឿនលឿន (Progressive Web App - PWA)</strong>។ ចូលទៅកាន់ទំព័រម៉ាស៊ីនគណនាណាមួយពេលមានការតភ្ជាប់អ៊ីនធឺណិត ហើយកម្មវិធីរុករករបស់អ្នកនឹងរក្សាទុកម៉ាស៊ីនគណនាទាំងអស់ដោយស្វ័យប្រវត្តិ។ បន្ទាប់ពីនោះ ម៉ាស៊ីនគណនាទាំងអស់ដំណើរការក្រៅបណ្តាញ — មិនចាំបាច់ប្រើអ៊ីនធឺណិត។</p><p>នៅលើ Android ឬ iOS ប្រើជម្រើស "បន្ថែមទៅអេក្រង់ដើម" ក្នុងកម្មវិធីរុករករបស់អ្នក ដើម្បីដំឡើង EngCalcs ជាកម្មវិធីនៅលើឧបករណ៍របស់អ្នក។ នៅលើកុំព្យូទ័រ ស្វែងរករូបតំណាងដំឡើងនៅក្នុងរបារអាសយដ្ឋានកម្មវិធីរុករករបស់អ្នក។</p><p>អ្នកក៏អាចរក្សាទុកម៉ាស៊ីនគណនាណាមួយដោយប្រើម៉ឺនុយ "រក្សាទុកជា…" ក្នុងកម្មវិធីរុករករបស់អ្នកសម្រាប់ការប្រើប្រាស់ក្រៅបណ្តាញម្តងម្កាល។</p><h3>ទំនាក់ទំនង</h3><p>Tom Haws — វិស្វករធារាសាស្ត្រ និងអ្នកបង្កើតម៉ាស៊ីនគណនាទាំងនេះ។<br />ប្រើទម្រង់មតិនៅក្នុងទំព័រម៉ាស៊ីនគណនាណាមួយ ឬចូលទៅកាន់កូដប្រភពនៅ <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>។</p>';
$ec_lang['contactSendMessage']='ផ្ញើសារទៅ Tom Haws';
$ec_lang['contactYourName']='ឈ្មោះ​ របស់​ អ្នក:';
$ec_lang['contactYourEmail']='អាសយ​ ដ្ឋាន​ អ៊ីម៉ែល​ របស់​ អ្នក:';
$ec_lang['contactSubject']='ប្រធានបទ:';
$ec_lang['contact_message']='សារ:';
$ec_lang['contactSpamPrefix']='ប្រាំ​ បូក​ មួយ​ ស្មើ​ នឹង';
$ec_lang['contactSpamPostfix']='(សូម​ សរសេរ​ ជា​ ពាក្យ​។ 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='ផ្ញើ​ សារ';
$ec_lang['contact_success']='សូមថ្លែងអរគុណដែលបានចំណាយពេលសរសេរ។';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='រចនាប្រឡាយថ្មជម្រាល (Robinson)';
$ec_lang['rc_main_title']='ម៉ាស៊ីនគណនារចនាប្រឡាយថ្មជម្រាលលើអនឡាញ ឥតគិតថ្លៃ — Robinson (1998)';
$ec_lang['rc_main_desc']='ការកំណត់ទំហំថ្មការពារសម្រាប់ប្រឡាយថ្មជម្រាល — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='ជម្រាលបាតច្រក, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="លំហូរក្នុងមួយឯកតាទទឹងនៅច្រកចូលប្រឡាយថ្មជម្រាល។ សម្រាប់ប្រឡាយដែលមានទទឹងបាត B និងលំហូរសរុប Q ប្រើ q_t = Q / B។">ចំណុះប្រតិបត្តិការក្នុងមួយអង្គងសរុប, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='ភាពប្រហោងថ្មការពារ, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="ដង់ស៊ីតេធៀបនឹងទឹក។ ថ្មក្រានីត ឬបាសាល់កិនធម្មតា ≈ 2.65។ ជួរត្រឹមត្រូវតាម Robinson: 2.54 ដល់ 2.82។">ទំងន់ចំពោះថ្ម, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="គម្លាតស្តង់ដារនៃការចាត់ថ្នាក់ទំហំថ្ម។ ថ្មសមភាព ≈ 1.25។ ជួរត្រឹមត្រូវតាម Robinson: 1.15 ដល់ 1.47។">ការចាត់ថ្នាក់ទំហំថ្ម SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="ទឹកដាំង (Hp > yn) ជាការល្អ — កាត់បន្ថយការហូរច្រោះខាងលើ។ (USDA)">ជម្រៅធម្មតានៅក្នុងប្រឡាយច្រកចូល, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="សមីការ 1 (S0 < 0.10) ឬសមីការ 2 (0.10-0.40)។ ជួរត្រឹមត្រូវ: D50 15-278 mm, S0 0.02-0.40។ ក្រៅជួរ: ជាតម្លៃប៉ាន់ស្មានពីក្រៅជួរ។">ទំហំថ្មមធ្យមដែលត្រូវការ, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='សមីការដែលបានប្រើ';
$ec_lang['rc_sg_check']='ការត្រួតពិនិត្យទំងន់ចំពោះ';
$ec_lang['rc_SD_check']='ការត្រួតពិនិត្យការចាត់ថ្នាក់ទំហំថ្ម SD';
$ec_lang['rc_sg_ok']='sg ស្ថិតក្នុងជួរត្រឹមត្រូវ';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']='sg ក្រោមជួរ Robinson';
$ec_lang['rc_sg_low_tip']='ជួរត្រឹមត្រូវ: 2.54–2.82';
$ec_lang['rc_sg_high']='sg លើសជួរ Robinson';
$ec_lang['rc_sg_high_tip']='ជួរត្រឹមត្រូវ: 2.54–2.82';
$ec_lang['rc_SD_ok']='SD ស្ថិតក្នុងជួរត្រឹមត្រូវ';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']='SD ក្រោមជួរ Robinson';
$ec_lang['rc_SD_low_tip']='ជួរត្រឹមត្រូវ: 1.15–1.47';
$ec_lang['rc_SD_high']='SD លើសជួរ Robinson';
$ec_lang['rc_SD_high_tip']='ជួរត្រឹមត្រូវ: 1.15–1.47';
$ec_lang['rc_layer']='កម្រាស់ស្រទាប់ថ្ម (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='កាំខ្សែកោងកំពូល (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='ប្រវែងធ្នូនៃខ្សែកោងកំពូល';
$ec_lang['rc_apron_length']='<span class="ec-help" title="ត្រូវការសម្រាប់ការទ្រទ្រង់រចនាសម្ព័ន្ធនៃថ្មនៅច្រក។ “ទឹកខាងក្រោមអប្បបរមាដែលកើតឡើងដោយសារតែផលនៃចម្រៀកច្រកចេញ និងភាពទប់ទល់នៃប្រឡាយខាងក្រោម គឺគ្រប់គ្រាន់ដើម្បីធានាស្ថិរភាពនៃថ្មការពារនៅចម្រៀកច្រកចេញ។” (Robinson)">ប្រវែងបន្ទះការពារច្រកចេញ (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='ភាពរដុប Manning ក្នុងច្រក, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="ចំណែកនៃ qt ដែលហូរកាត់ប្រហោងថ្ម។ ចំណែកនៅសល់ qs ហូរនៅលើផ្ទៃ។ np លំនាំដើម = 0.45 សម្រាប់ថ្មកិនជ្រួញកែងជ្រុង។">ល្បឿនហូរកាត់ស្រទាប់ថ្មការពារ, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='លំហូរក្នុងមួយអង្គងតាមស្រទាប់ថ្ម, q<sub>m</sub>';
$ec_lang['rc_qs']='លំហូរក្នុងមួយអង្គងលើផ្ទៃ, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='ជម្រៅទឹកលើផ្ទៃថ្មការពារ, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="ទឹកដាំងខាងលើ (Hp > yn) ជាការល្អ — កាត់បន្ថយការហូរច្រោះខាងលើ។ (USDA)">ក្បាលទឹកស្ទីងច្រកចូល, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='ការត្រួតពិនិត្យទឹកដាំងច្រកចូល';
$ec_lang['rc_pond_ok']='H<sub>p</sub> > y<sub>n</sub> — មានទឹកដាំងខាងលើ';
$ec_lang['rc_pond_ok_tip']='ទឹកដាំងខាងលើច្រកចូលជាការល្អ; វាកាត់បន្ថយការហូរច្រោះខាងលើ។ (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — គ្មានទឹកដាំង — អាចមានការហូរច្រោះនៅច្រកចូល';
$ec_lang['rc_pond_warn_tip']='គ្មានទឹកដាំងខាងលើច្រកចូល; ការហូរច្រោះអាចកើតមានខាងលើ។ (USDA)';
$ec_lang['rc_eq1']='សមីការ 1 (S<sub>0</sub> < 0.10) — ជម្រាលស្រាល';
$ec_lang['rc_eq2']='សមីការ 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — ជម្រាលចោត';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — ក្រោមជួរផ្ទៀងផ្ទាត់របស់ Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — លើសជួរផ្ទៀងផ្ទាត់របស់ Robinson';
$ec_lang['rc_notes_1_term']='សមីការកំណត់ទំហំថ្ម';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) បានបង្កើតសមីការជាក់ស្តែងពីរសម្រាប់កំណត់ទំហំថ្មការពារមធ្យម D<sub>50</sub> ដោយផ្អែកលើជម្រាលច្រក និងចំណុះប្រតិបត្តិការក្នុងមួយអង្គង។ សមីការទី 1 ប្រើសម្រាប់ជម្រាលស្រាល (S<sub>0</sub> < 0.10); សមីការទី 2 ប្រើសម្រាប់ជម្រាលចោត (0.10 ≤ S<sub>0</sub> ≤ 0.40)។ សមីការទាំងពីរត្រូវការ q<sub>t</sub> ជា m²/s ហើយផ្តល់លទ្ធផល D<sub>50</sub> ជា mm។ ជួរផ្ទៀងផ្ទាត់គឺ 0.02 ≤ S<sub>0</sub> ≤ 0.40។';
$ec_lang['rc_notes_2_term']='ចំណុះប្រតិបត្តិការក្នុងមួយអង្គង';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> គឺជាចំណុះប្រតិបត្តិការក្នុងមួយអង្គងសរុបនៅកំពូលច្រក (លំហូរសរុបក្នុងមួយឯកតាទទឹង)។ សម្រាប់ប្រឡាយដែលមានទទឹងបាត B ដឹកលំហូរសរុប Q ប៉ាន់ស្មាន q<sub>t</sub> ≈ Q / B ឬគណនាវាពីលក្ខខណ្ឌជម្រៅសំខាន់ (critical depth) នៅច្រកចូល។';
$ec_lang['rc_notes_3_term']='លំហូរកាត់ស្រទាប់ថ្មការពារ';
$ec_lang['rc_notes_3_def']='ចំណែកមួយនៃលំហូរសរុបហូរកាត់ប្រហោងនៃថ្មការពារ (លំហូរតាមស្រទាប់ q<sub>m</sub>); ចំណែកនៅសល់ហូរនៅលើផ្ទៃថ្ម (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>)។ ជម្រៅទឹក d ត្រូវបានគណនាពីសមីការ Manning អនុវត្តទៅលើលំហូរផ្ទៃ q<sub>s</sub> ដោយប្រើភាពរដុបច្រក n។ ភាពប្រហោងលំនាំដើម n<sub>p</sub> = 0.45 ជាតម្លៃធម្មតាសម្រាប់ថ្មកិនជ្រួញកែងជ្រុង។';
$ec_lang['rc_notes_5_term']='ជួរទំហំថ្មត្រឹមត្រូវ';
$ec_lang['rc_notes_5_def']='សមីការទាំងនេះត្រូវបានបង្កើតឡើងដោយប្រើជួរ D<sub>50</sub> ពី 15 mm ដល់ 278 mm។ លទ្ធផលក្រៅជួរនេះជាតម្លៃប៉ាន់ស្មានពីក្រៅជួរ (extrapolated) ហើយគួរប្រើដោយផ្អែកលើការវិនិច្ឆ័យបន្ថែមរបស់វិស្វករ។';
$ec_lang['rc_notes_6_term']='កម្រិតបន្ទះការពារច្រកចេញ';
$ec_lang['rc_notes_6_def']='កម្រិតកំពូលនៃថ្មការពារនៅចម្រៀកច្រកចេញ គួរស្ថិតនៅកម្រិត ឬក្រោមកម្រិតបាតប្រឡាយខាងក្រោម។ ប្រសិនបើខ្ពស់ជាងនេះ ថ្មនៅច្រកចេញនឹងមិនមានស្ថិរភាព។';

$ec_lang['rc_notes_7_def']='នៅពេលជម្រៅធម្មតានៅក្នុងប្រឡាយច្រកចូល តូចជាងក្បាលទឹកស្ទីង (H<sub>p</sub>) ដែលត្រូវការសម្រាប់ឲ្យ q<sub>t</sub> ហូរកាត់បាន នោះលំហូរនឹងចង្អៀត ឬកើតមានទឹកដាំងខាងលើច្រកចូល។ ជាទូទៅនេះអាចទទួលយកបាន — ទឹកដាំងកាត់បន្ថយល្បឿន និងទប់ស្កាត់ការហូរច្រោះខាងលើ។ ដើម្បីត្រួតពិនិត្យ: ប្រើម៉ាស៊ីនគណនាលំហូរស្ទីង ដើម្បីរកតម្លៃ H<sub>p</sub> សម្រាប់ q<sub>t</sub> និងទទឹងកំពូល ដែលបានផ្ដល់ ហើយប្រៀបធៀបជាមួយជម្រៅធម្មតានៃប្រឡាយច្រកចូល។ ប្រសិនបើ H<sub>p</sub> លើសជម្រៅធម្មតា នោះទឹកដាំងនឹងកើតមាន។';
$ec_lang['rc_notes_4_term']='ឯកសារយោង';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS ក៏បានបោះពុម្ពផ្សាយ <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">សន្លឹកកិច្ចការ Excel</a> ដោយផ្អែកលើវិធីសាស្ត្រដូចគ្នា។';
// Sketch labels
$ec_lang['rc_sketch_filter']='តម្រង';
$ec_lang['rc_sketch_top_crest_curve']='ខ្សែកោងកំពូល';
$ec_lang['rc_sketch_outlet_apron']='បន្ទះការពារច្រកចេញ';
$ec_lang['rc_sketch_radius']='កាំ';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='សម្ពាធស្រោចស្រព';
$ec_lang['ip_main_title']='ម៉ាស៊ីនគណនាសម្ពាធស្រោចស្រព និងឯកសណ្ឋានភាពចែកចាយ ឥតគិតថ្លៃតាមអ៊ីនធឺណិត';
$ec_lang['ip_main_desc']='សម្ពាធសាខាសាកល្បង និងការប៉ាន់ស្មានឯកសណ្ឋានភាព';
$ec_lang['ip_h_supply']='សម្ពាធផ្គត់ផ្គង់';
$ec_lang['ip_elev_supply']='កម្ពស់ផ្គត់ផ្គង់, z<sub>supply</sub>';
$ec_lang['ip_q_design']='លំហូររចនារបស់ក្បាលបញ្ចេញទឹក, q<sub>design</sub>';
$ec_lang['ip_h_design']='សម្ពាធរចនារបស់ក្បាលបញ្ចេញទឹក';
$ec_lang['ip_x']='<span class="ec-help" title="0.5 សម្រាប់ក្បាលបញ្ចេញទឹកធម្មតាដែលមិនទូទាត់សម្ពាធ; ជិត 0 សម្រាប់ក្បាលបញ្ចេញទឹកដែលទូទាត់សម្ពាធ">និទស្សន្តលំហូររបស់ក្បាលបញ្ចេញទឹក, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='ផ្លូវសាកល្បង';
$ec_lang['ip_group_reach']='ចម្រៀកបំពង់';
$ec_lang['ip_group_upstream']='ខាងលើទឹក';
$ec_lang['ip_group_downstream']='ខាងក្រោមទឹក';
$ec_lang['ip_group_loss']='ការបាត់បង់';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="បានធីក: ចម្រៀកនេះជាផ្នែកនៃបំពង់រងសាកល្បង ដែលក្បាលបញ្ចេញទឹកនីមួយៗទាញយកទឹកចេញ។ មិនបានធីក: ចម្រៀកនេះជាបំពង់មេ ដែលគ្រាន់តែបញ្ជូនលំហូរទៅបំពង់រងដែលមិនស្ថិតលើផ្លូវសាកល្បង។">បំពង់រង <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="ជួរបំពង់រង: ក្បាលបញ្ចេញទឹកក្នុងចម្រៀកនេះតែប៉ុណ្ណោះ។ ជួរបំពង់មេ: ចំនួនសរុបនៃក្បាលបញ្ចេញទឹកលើបំពង់រងផ្សេងទៀតដែលបែកចេញពីចម្រៀកនេះ។ សម្រាប់ចម្រៀកនៅត្រង់កន្លែងបែកចេញរបស់បំពង់រងសាកល្បងខ្លួនឯង ត្រូវរាប់បញ្ចូលទាំងបំពង់រងទាំងឡាយដែលនៅបន្តទៀតតាមបំពង់មេហួសពីចំណុចនោះ ឬដែលចែករំលែកថ្នាំងតែមួយ (ឧ. បំពង់រងនៅម្ខាងទៀត) — លំហូររបស់វាក៏ឆ្លងកាត់ចម្រៀកនេះដែរ។">ក្បាលបញ្ចេញទឹក <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="កម្ពស់ចុងខាងក្រោមទឹកនៃចម្រៀកនេះ។ ជាជម្រើសសម្រាប់ជួរខាងក្នុង (បើទុកទទេ នឹងចាត់ទុកជារាបស្មើ / ស្មើនឹងថ្នាំងខាងលើ)។ ចាំបាច់សម្រាប់ជួរចុងក្រោយ: តម្លៃនោះជាកម្ពស់ក្បាលបញ្ចេញទឹកចុងក្រោយ ដែលកំណត់ដោយផ្ទាល់នូវសម្ពាធផ្គត់ផ្គង់ដែលត្រូវការ។">កម្ពស់ក្រោម <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='កម្ពស់ក្បាលបញ្ចេញទឹកចុងក្រោយ (ជួរចុងក្រោយ) ត្រូវបានទុកទទេ និងបានកំណត់លំនាំដើមទៅរាបស្មើ — សូមបញ្ចូលវាដើម្បីទទួលបានលទ្ធផលត្រឹមត្រូវ';
$ec_lang['ip_flow']='លំហូរ';
$ec_lang['ip_press']='សម្ពាធ';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="ការបាត់បង់សរុបនៃចម្រៀក, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='សម្ពាធទាប/អវិជ្ជមាន — ពិនិត្យលក្ខខណ្ឌក្រោមបរិយាកាស';
$ec_lang['ip_pressure_warn_short']='ទាប';
$ec_lang['ip_pressure_high']='កន្លែងសម្ពាធខ្ពស់ត្រូវការការកាត់បន្ថយសម្ពាធ';
$ec_lang['ip_pressure_high_short']='ខ្ពស់';
$ec_lang['ip_max_head']='សម្ពាធអនុញ្ញាតអតិបរមា';
$ec_lang['ip_max_head_tip']='ខ្សែបំពង់ដែលមានសម្ពាធលើសពីតម្លៃនេះនឹងត្រូវបានសម្គាល់។ ទុកទទេដើម្បីរំលងការត្រួតពិនិត្យសម្ពាធខ្ពស់។';
$ec_lang['ip_h_far']='សម្ពាធក្បាលបញ្ចេញទឹកចុងក្រោយ';
$ec_lang['ip_q_supply']='<span class="ec-help" title="លំហូរដែលចូលតែក្នុងផ្លូវសាកល្បងដែលបានធ្វើគំរូប៉ុណ្ណោះ មិនមែនតំបន់/ប្រព័ន្ធទាំងមូលទេ — សម្រាប់សរុបទាំងប្រព័ន្ធ សូមមើល Q_zone ក្នុងផ្នែករចនាខាងក្រោម។">លំហូរផ្គត់ផ្គង់នៃផ្លូវសាកល្បង, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='លំហូរក្បាលបញ្ចេញទឹកចុងក្រោយ, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='លំហូរមធ្យមរបស់ក្បាលបញ្ចេញទឹក (បំពង់រងសាកល្បង), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="តាមការប៉ាន់ស្មានរបស់អ្នក បំពង់រងធម្មតា/មធ្យមដំណើរការនៅសម្ពាធខ្ពស់ជាង (ឬទាបជាង) បំពង់រងសាកល្បងនេះប៉ុន្មាន។ បំពង់រងសាកល្បងត្រូវបានជ្រើសដោយចេតនាជាករណីអាក្រក់បំផុតដែលសន្មត ដូច្នេះមធ្យមរបស់វាខ្លួនឯងជាតំណាងលម្អៀងទាបនៃមធ្យមទាំងវាល — បើទុកនៅ 0 ការត្រួតពិនិត្យឯកសណ្ឋានភាព និងតួលេខរចនាខាងក្រោមនឹងប្រើមធ្យម (ប្រហែលជាសុទិដ្ឋិនិយម) របស់បំពង់រងសាកល្បងដូចដើម។">ប៉ាន់ស្មាន Δសម្ពាធ, មធ្យមធៀបនឹងបំពង់រងសាកល្បង <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral ត្រូវបានគណនាឡើងវិញនៅសម្ពាធនៃជួរបំពង់រងនីមួយៗ បូកនឹងភាពខុសគ្នានៃសម្ពាធដែលបានបញ្ចូលខាងលើ — ជាការប៉ុនប៉ងកែតម្រូវការដែលបំពង់រងសាកល្បងជាករណីអាក្រក់បំផុតដែលសន្មត មិនមែនជាតំណាង។ ផ្គត់ផ្គង់ទាំងការត្រួតពិនិត្យឯកសណ្ឋានភាព ទាំងផ្នែករចនាខាងក្រោម។">ប៉ាន់ស្មានលំហូរមធ្យមរបស់ក្បាលបញ្ចេញទឹកទាំងវាល, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="លំហូរដែលបានគណនានៃក្បាលបញ្ចេញទឹកចុងក្រោយ ចែកនឹងលំហូរមធ្យមប៉ាន់ស្មានរបស់ក្បាលបញ្ចេញទឹកទាំងវាល — នេះជាការប៉ាន់ស្មាននៃឯកសណ្ឋានភាពចែកចាយមួយភាគបួនក្រោមតាមស្តង់ដារ (មធ្យមក្រុមទាប ÷ មធ្យមសរុប) ប៉ុន្តែមកពីគំរូតូចមួយ និងការកែតម្រូវដែលអ្នកប្រើប៉ាន់ស្មាន មិនមែនពីគំរូស្ថិតិទាំងវាលទេ។ តម្លៃ 1 ឬលើសអាចកើតមាន ហើយត្រឹមត្រូវ: វាគ្រាន់តែមានន័យថាសម្ពាធរបស់ក្បាលបញ្ចេញទឹកចុងក្រោយស្ថិតនៅស្មើ ឬលើសមធ្យមទាំងវាលដែលបានប៉ាន់ស្មាន ដូច្នេះក្បាលបញ្ចេញទឹកផ្សេងទៀតទើបជាចំណុចទាបបំផុត។ អាចដោយសារក្បាលបញ្ចេញទឹកចុងក្រោយស្ថិតលើដីទាប ឬដោយសារការប៉ាន់ស្មាន Δសម្ពាធតូចពេក។">ការត្រួតពិនិត្យឯកសណ្ឋានភាព, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='សម្ពាធនៅក្បាលបញ្ចេញទឹកសាកល្បង ស្មើ ឬលើសសម្ពាធផ្គត់ផ្គង់។ វាទំនងជាមិនមែនក្បាលបញ្ចេញទឹកករណីអាក្រក់បំផុតទេ ឬមួយក៏អាចប្រើបំពង់តូចជាងនេះបាន។';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="ខុសពីការប៉ាន់ស្មានស្តង់ដារនៃរង្វាស់ឯកសណ្ឋានភាពរបស់យើង។">លំហូរក្បាលបញ្ចេញទឹកចុងក្រោយ ÷ លំហូររចនា, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='គ្មានដំណោះស្រាយ៖ សម្ពាធផ្គត់ផ្គង់ដែលត្រូវការលើសពីសម្ពាធផ្គត់ផ្គង់ដែលបានបញ្ចូល។ បង្កើនសម្ពាធផ្គត់ផ្គង់ កាត់បន្ថយតម្រូវការ ឬប្រើបំពង់ធំជាង។';
$ec_lang['ip_notes_1_def']='ប៉ាន់ស្មានសម្ពាធនៅក្បាលបញ្ចេញទឹកចុងក្រោយ (ឆ្ងាយបំផុត) បន្ទាប់មកតាមដានខ្សែថាមពលត្រឡប់ទៅរកការផ្គត់ផ្គង់វិញ ចម្រៀកម្ដងមួយៗ ដោយបូកបន្ថែមការបាត់បង់ដោយកកិត និងការបាត់បង់មូលដ្ឋានតាមផ្លូវ។ កម្ពស់ និងកម្ពស់ល្បឿនត្រូវបានដកចេញនៅថ្នាំងនីមួយៗ ដើម្បីរាយការណ៍សម្ពាធពិតប្រាកដនៅទីនោះ។ សម្ពាធចុងឆ្ងាយដែលបានប៉ាន់ស្មានត្រូវបានកែតម្រូវ (វិធីចែកពាក់កណ្ដាល) រហូតដល់សម្ពាធផ្គត់ផ្គង់ដែលត្រូវការដែលបានគណនា ស្មើនឹងសម្ពាធផ្គត់ផ្គង់ដែលបានបញ្ចូល — ជាបញ្ហារង្វិលបិទដូចគ្នាដែលដោះស្រាយដោយកម្មវិធីគណនាលំហូរបំពង់លើម៉ាស៊ីនគណនា Manning Pipe Flow ដែលពង្រីកទៅបណ្ដាញបែកសាខា។';
$ec_lang['ip_notes_2_term']='ចម្រៀកបំពង់មេ ធៀបនឹងចម្រៀកបំពង់រង';
$ec_lang['ip_notes_2_def']='ជួរនីមួយៗជាចម្រៀកមួយតាមផ្លូវអាក្រក់បំផុតខាងធារាសាស្ត្រតែមួយ (ផ្លូវសាកល្បង) ពីការផ្គត់ផ្គង់ដល់ក្បាលបញ្ចេញទឹកចុងក្រោយ។ ចម្រៀកបំពង់មេគ្រាន់តែបញ្ជូនលំហូរទៅបំពង់រងដែលមិនស្ថិតលើផ្លូវសាកល្បង ដូច្នេះការទាញយកទឹករបស់វាជាការគុណធម្មតា (លំហូររចនា × ចំនួនក្បាលបញ្ចេញទឹកសរុបនៃចម្រៀក) — គ្មានភាពរសើបនឹងសម្ពាធមូលដ្ឋានទេ។ បំពង់មេជាបំពង់ដើមរួម ដូច្នេះចម្រៀកនៅត្រង់កន្លែងបែកចេញរបស់បំពង់រងសាកល្បងខ្លួនឯង ត្រូវរាប់បញ្ចូលមិនត្រឹមតែបំពង់រងរវាងចុងទាំងពីររបស់វាទេ ប៉ុន្តែទាំងបំពង់រងទាំងឡាយដែលនៅបន្តទៀតតាមបំពង់មេហួសពីកន្លែងបែកចេញនោះ ឬដែលចែករំលែកថ្នាំងតែមួយ (ឧ. បំពង់រងនៅម្ខាងទៀត) — លំហូររបស់វាឆ្លងកាត់ចម្រៀកដដែលនោះមុននឹងបែកចេញ ទោះបីវាមាននៅកន្លែងផ្សេងក្នុងតារាងនេះឬអត់ក៏ដោយ។ ចម្រៀកបំពង់រងជាផ្នែកនៃបំពង់រងសាកល្បងខ្លួនឯង: លំហូរក្បាលបញ្ចេញទឹកត្រូវបានគណនាពីសម្ពាធមូលដ្ឋានពិតតាម q = k·H<sup>x</sup> ហើយការបាត់បង់ដោយកកិតត្រូវបានកាត់បន្ថយដោយមេគុណ F(n) របស់ Christiansen ដើម្បីគិតបញ្ចូលការថយចុះលំហូរនៅពេលក្បាលបញ្ចេញទឹកនីមួយៗក្នុងចម្រៀកទាញយកទឹក។';
$ec_lang['ip_notes_3_term']='ដែនកំណត់';
$ec_lang['ip_notes_3_def']='ធ្វើគំរូសម្ពាធផ្គត់ផ្គង់ថេរមួយ (គ្មានខ្សែកោងម៉ាស៊ីនបូម) ផ្លូវសាកល្បងតែមួយ (មិនមែនវាលទាំងមូល) និងខ្សែកោងក្បាលបញ្ចេញទឹកពីរប៉ារ៉ាម៉ែត្រ (កំណត់និទស្សន្តជិត 0 ដើម្បីប្រហាក់ប្រហែលក្បាលបញ្ចេញទឹកទូទាត់សម្ពាធ)។ សមាមាត្រពីរផ្សេងគ្នាត្រូវបានរាយការណ៍ ដោយបំបែកដោយចេតនា: q<sub>last</sub>/q<sub>avg,field</sub> ជាការប៉ាន់ស្មាននៃឯកសណ្ឋានភាពចែកចាយមួយភាគបួនក្រោមតាមស្តង់ដារ (មធ្យមក្រុមទាប ÷ មធ្យមសរុប) ប៉ុន្តែគណនាពីក្បាលបញ្ចេញទឹកដែលបានធ្វើគំរូរបស់បំពង់រងសាកល្បងខ្លួនឯង ហើយកែតម្រូវដោយការប៉ាន់ស្មាន Δសម្ពាធដែលបានបញ្ចូល មិនមែនពីគំរូស្ថិតិទាំងវាលទេ — បំពង់រងសាកល្បងត្រូវបានជ្រើសដោយចេតនាជាករណីអាក្រក់បំផុតដែលសន្មត ដូច្នេះមធ្យមឆៅមិនកែតម្រូវរបស់វានឹងបន្ថយមធ្យមទាំងវាលពិត ហើយធ្វើឲ្យឯកសណ្ឋានភាពមើលទៅល្អជាងការពិត; ប្រអប់ Δសម្ពាធមានឡើងជាពិសេសដើម្បីទប់ទល់នឹងភាពលម្អៀងនោះ។ តម្លៃ 1 ឬលើសនៅតែអាចកើតមាន (ឧ. ការប៉ាន់ស្មាន Δសម្ពាធតូចពេក ឬផ្លូវចុះជម្រាលអំណោយផល)។ q<sub>last</sub>/q<sub>design</sub> ជាការត្រួតពិនិត្យផ្សេង ដែលមិនទាក់ទងនឹងឯកសណ្ឋានភាព ធៀបនឹងលំហូរកំណត់របស់ក្រុមហ៊ុនផលិត — មានប្រយោជន៍សម្រាប់រកឃើញប្រព័ន្ធដែលមានសម្ពាធខ្ពស់ពេក ឬទាបពេកជារួម ប៉ុន្តែមិនអាចជំនួសតួលេខឯកសណ្ឋានភាពទេ ព្រោះលំហូររចនា/កំណត់គ្មានទំនាក់ទំនងចាំបាច់ជាមួយសម្ពាធប្រតិបត្តិការមធ្យមពិតរបស់ប្រព័ន្ធ។';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942)។ “ស្រោចស្រពដោយបាញ់ស្រោច។” California Agricultural Experiment Station Bulletin 670។ ស្តង់ដារ ASAE/ASABE សម្រាប់ការរចនាប្រព័ន្ធស្រោចស្រពខ្នាតតូច ប្រើវិធីសាស្ត្រការបាត់បង់ដោយកកិតច្រើនច្រកដូចគ្នា។';
$ec_lang['ip_notes_5_term']='ការរចនាការដាក់ទឹក';
$ec_lang['ip_notes_5_def']='អត្រាដាក់ទឹក និងលំហូរប្រព័ន្ធ/តំបន់ ប្រើលំហូរមធ្យមប៉ាន់ស្មានរបស់ក្បាលបញ្ចេញទឹកទាំងវាល (q<sub>avg,field</sub> — មធ្យមរបស់បំពង់រងសាកល្បងខ្លួនឯង កែតម្រូវដោយការប៉ាន់ស្មាន Δសម្ពាធដែលបានបញ្ចូល) មិនមែនអត្រាទាយស្មានទេ: PR = q<sub>avg,field</sub> / A<sub>e</sub> ផ្គត់ផ្គង់ដោយតម្លៃគំរូដែលបានកែតម្រូវ។ គម្លាត និងចំនួនបំពង់រង/ក្បាលបញ្ចេញទឹកទាំងប្រព័ន្ធជាការបញ្ចូលដាច់ដោយឡែកនៅទីនេះ ព្រោះផ្លូវសាកល្បងធ្វើគំរូតែសាខាករណីអាក្រក់បំផុតមួយប៉ុណ្ណោះ មិនមែនបំពង់រងនីមួយៗក្នុងវាលទេ។';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='បណ្ដាញបំពង់បែកសាខា';
$ec_lang['bpn_main_title']='ម៉ាស៊ីនគណនាសម្ពាធបណ្ដាញបំពង់បែកសាខា ឥតគិតថ្លៃតាមអ៊ីនធឺណិត (គ្មានរង្វិលបិទ)';
$ec_lang['bpn_main_desc']='លំហូរ និងសម្ពាធនៃបណ្ដាញបំពង់បែកសាខា (ដូចមែកឈើ)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='សម្ពាធផ្គត់ផ្គង់ថេរ: សម្ពាធនៃប្រភពទឹកនៅពេលគ្មានលំហូរ (លំហូរសូន្យ)។ កម្រិតទឹកអាងស្តុក ឬធុងទឹកខ្ពស់ជាងកម្ពស់ចំណុចផ្គត់ផ្គង់ ឬសម្ពាធបិទរបស់ម៉ាស៊ីនបូម។ បន្ថែមចំណុចផ្គត់ផ្គង់ទី ២ និង ៣ ដើម្បីកំណត់ខ្សែកោងម៉ាស៊ីនបូម ឬខ្សែកោងផ្គត់ផ្គង់ប្រែប្រួល; ឧបករណ៍នេះអានយកសម្ពាធត្រង់លំហូររចនា។';
$ec_lang['bpn_elev_source']='កម្ពស់ផ្គត់ផ្គង់';
$ec_lang['bpn_q_total']='លំហូរសរុប';
$ec_lang['bpn_q_total_tip']='លំហូរសរុបចេញពីប្រភព (ផលបូកនៃតម្រូវការទាំងអស់ក្នុងបណ្ដាញ)។';
$ec_lang['bpn_p_min']='សម្ពាធទាបបំផុត';
$ec_lang['bpn_p_min_tip']='សម្ពាធក្រោមទាបបំផុតនៅកន្លែងណាមួយក្នុងបណ្ដាញ; ជាចំណុចផ្ដល់ទឹកសំខាន់បំផុតដែលត្រូវប្រុងប្រយ័ត្ន។';
$ec_lang['bpn_method']='វិធីសាស្ត្រកកិត';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='ខ្សែបំពង់';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='ឈ្មោះខ្សែបំពង់នេះ។ ខ្សែបំពង់ផ្សេងទៀតយោងទៅវានៅក្នុងជួរឈរ ID ខាងលើ។';
$ec_lang['bpn_upstream']='ID ខាងលើ';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID នៃខ្សែបំពង់ដែលផ្គត់ផ្គង់ទឹកមកខ្សែនេះ។ ទុកទទេ ដើម្បីឲ្យខ្សែនេះបន្តពីខ្សែដែលនៅពីលើដោយផ្ទាល់ (បំពង់ជាប់គ្នាធម្មតា)។ បញ្ចូល ID នៅទីនេះ ដើម្បីបែកសាខាចេញពីខ្សែផ្សេង។';
$ec_lang['bpn_roughness_tip']='ភាពរញ៉េរញ៉ៃបំពង់សម្រាប់វិធីសាស្ត្រកកិតដែលបានជ្រើសរើស: Manning n, Hazen-Williams C, ឬកម្ពស់ភាពរញ៉េរញ៉ៃ Darcy-Weisbach e (ជារង្វាស់ប្រវែង)។ បំពង់ប្លាស្ទិករលោងធម្មតា: n ប្រហែល 0.009, C ប្រហែល 150, e ប្រហែល 0.0015 mm។';
$ec_lang['bpn_demand']='តម្រូវការ';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='លំហូរថេរដែលបញ្ជូនចេញត្រង់ចុងក្រោមទឹករបស់ខ្សែបំពង់នេះ។ ទុកទទេសម្រាប់ខ្សែដែលគ្រាន់តែបញ្ជូនលំហូរបន្តទៅមុខប៉ុណ្ណោះ។';
$ec_lang['bpn_demand_mult']='កត្តាគុណតម្រូវការ';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='គុណតម្រូវការគ្រប់ខ្សែបំពង់ក្នុងពេលតែមួយ សម្រាប់ការគណនាម៉ោងខ្ពស់បំផុត ឬកំណើនអនាគត។ ប្រើ 1 សម្រាប់តម្រូវការដូចដែលបានបញ្ចូល។';
$ec_lang['bpn_elev_down']='កម្ពស់ក្រោម';
$ec_lang['bpn_q_line']='លំហូរខ្សែបំពង់';
$ec_lang['bpn_q_line_tip']='លំហូរសរុបដែលខ្សែបំពង់នេះផ្ទុក: រួមទាំងតម្រូវការផ្ទាល់ខ្លួន បូកនឹងគ្រប់តម្រូវការនៅខាងក្រោមទាំងអស់ដែលវាផ្គត់ផ្គង់។';
$ec_lang['bpn_p_down']='សម្ពាធក្រោម';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='សម្ពាធវាស់ (gauge) នៅថ្នាំងខាងក្រោមទឹករបស់ខ្សែបំពង់នេះ។ តម្លៃអវិជ្ជមាន (ដែលបានសម្គាល់) មានន័យថាសម្ពាធក្រោមបរិយាកាស; សូមពិនិត្យការរចនា។';
$ec_lang['bpn_sketch_heading']='ប្លង់បណ្ដាញ';
$ec_lang['bpn_show_length']='ប្រវែង';
$ec_lang['bpn_show_diameter']='អង្កត់ផ្ចិត';
$ec_lang['bpn_show_q']='លំហូរ';
$ec_lang['bpn_show_p']='សម្ពាធ';
$ec_lang['bpn_source_label']='ប្រភព';
$ec_lang['bpn_line_problem']='បន្ទាត់នេះមិនបានភ្ជាប់ទៅប្រភពទេ៖ វាចង្អុលទៅ ID ដើមទឹកមួយដែលមិនស្គាល់ ចង្អុលទៅខ្លួនឯង ធ្វើម្ដងទៀត ID ដែលបន្ទាត់មួយផ្សេងទៀតបានប្រើរួច ឬបង្កើតជារង្វិលបិទ។ បន្ទាត់ដែលមិនបានភ្ជាប់ត្រូវបានទុកមិនដោះស្រាយ។';
$ec_lang['bpn_bad_id_short']='ID មិនត្រឹមត្រូវ';


$ec_lang['bpn_pressure_warn']='សម្ពាធទាប/អវិជ្ជមាន; ពិនិត្យលក្ខខណ្ឌក្រោមបរិយាកាស';
$ec_lang['bpn_pressure_warn_short']='ទាប';
$ec_lang['bpn_notes_1_term']='តភ្ជាប់ជាប់គ្នាជាលំនាំដើម បែកសាខាតែពេលចាំបាច់';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='ទុក ID ខាងលើទទេ ខ្សែបំពង់នឹងបន្តពីខ្សែដែលនៅពីលើដោយស្វ័យប្រវត្តិ; ជាបំពង់ជាប់គ្នាធម្មតា។ បញ្ចូល ID នៃខ្សែខាងលើ ដើម្បីបែកសាខាចេញពីវា។ ដូច្នេះ: តភ្ជាប់ជាប់គ្នាជាលំនាំដើម ហើយបែកជាសាខានៅពេលអ្នកត្រូវការ។';
$ec_lang['bpn_notes_2_term']='តែបណ្ដាញបែកសាខា គ្មានរង្វិលបិទ';
$ec_lang['bpn_notes_2_def']='ខ្សែបំពង់នីមួយៗមានខ្សែខាងលើតែមួយប៉ុណ្ណោះ (រចនាសម្ព័ន្ធបែកសាខាដូចមែកឈើ)។ ឧបករណ៍នេះមិនអាចដោះស្រាយបណ្ដាញដែលមានរង្វិលបិទបានទេ; បណ្ដាញបែបនោះត្រូវការវិធីសាស្ត្រធ្វើម្ដងទៀត (ដូចជា EPANET)។ ការមិនរាប់បញ្ចូលរង្វិលបិទនេះហើយដែលធ្វើឲ្យវាសាមញ្ញ និងត្រឹមត្រូវ។';
$ec_lang['bpn_notes_3_term']='គ្មានឧបករណ៍បញ្ជាសម្ពាធសកម្ម';
$ec_lang['bpn_notes_3_def']='អ្នកអាចបន្ថែមវ៉ាល់បាត់បង់មូលដ្ឋានថេរមួយ (តម្លៃ k) ប៉ុន្តែមិនអាចបន្ថែមវ៉ាល់កាត់បន្ថយសម្ពាធ ឬវ៉ាល់រក្សាសម្ពាធ (PRV/PSV) បានទេ។ ស្ថានភាពបើក/បិទរបស់វ៉ាល់ទាំងនោះអាស្រ័យលើលំហូរ និងសម្ពាធ ដែលនឹងបង្ខំឲ្យធ្វើការគណនាម្ដងទៀត។';


$ec_lang['bpn_supply2_q']='លំហូរផ្គត់ផ្គង់ ២';
$ec_lang['bpn_supply2_h']='សម្ពាធផ្គត់ផ្គង់ ២';
$ec_lang['bpn_supply3_q']='លំហូរផ្គត់ផ្គង់ ៣';
$ec_lang['bpn_supply3_h']='សម្ពាធផ្គត់ផ្គង់ ៣';
$ec_lang['bpn_supply_pt_tip']='ចំណុចខ្សែកោងផ្គត់ផ្គង់ ២ និង ៣ ជាជម្រើស។ បញ្ចូលលំហូរ និងសម្ពាធសម្រាប់ចំណុចនីមួយៗ ដើម្បីតំណាងឲ្យម៉ាស៊ីនបូម ឬប្រភពណាមួយដែលសម្ពាធថយចុះនៅពេលបញ្ជូនទឹកកាន់តែច្រើន; ឧបករណ៍នេះអានយកសម្ពាធត្រង់លំហូររចនា។ ចំណុចទី ១ ខាងលើជាសម្ពាធថេរនៅពេលគ្មានលំហូរ (លំហូរសូន្យ)។ ទុកចំណុចទី ២ និង ៣ ទទេ សម្រាប់សម្ពាធអាងស្តុកថេរ។';
$ec_lang['bpn_h_supply']='សម្ពាធផ្គត់ផ្គង់';
$ec_lang['bpn_h_supply_tip']='សម្ពាធប្រភពត្រង់លំហូររចនា អានពីខ្សែកោងផ្គត់ផ្គង់។ ស្មើនឹងសម្ពាធប្រភពដែលបានបញ្ចូល ពេលខ្សែកោងរាបស្មើ (អាងស្តុក)។';
$ec_lang['bpn_show_elevation']='កម្ពស់';
$ec_lang['bpn_supply1_h']='សម្ពាធផ្គត់ផ្គង់ថេរ';
$ec_lang['lpn_main_menu']='បណ្ដាញផ្គត់ផ្គង់ទឹក';
$ec_lang['lpn_main_title']='ម៉ាស៊ីនគណនាបណ្ដាញចែកចាយទឹកឥតគិតថ្លៃតាមអ៊ីនធឺណិត ដោយប្រើឧបករណ៍ដោះស្រាយ EPANET';
$ec_lang['lpn_main_desc']='ការវិភាគបណ្ដាញផ្គត់ផ្គង់ទឹក៖ គូរបណ្ដាញបំពង់រង្វិលបិទ ឬនាំចូលឯកសារ EPANET';
$ec_lang['lpn_title_units']='ខ្នាតវាស់ {units}';
$ec_lang['lpn_tool_select']='ជ្រើសរើស';
$ec_lang['lpn_tool_add_junction']='ថ្នាំង';
$ec_lang['lpn_tool_add_reservoir']='អាងស្តុក';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='ធុងទឹក';
$ec_lang['lpn_tool_add_pipe']='ខ្សែបំពង់';
$ec_lang['lpn_tool_add_pump']='ម៉ាស៊ីនបូម';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='វ៉ាល់';
$ec_lang['lpn_tool_add_text']='អក្សរ';
$ec_lang['lpn_tool_vertices']='ចំណុចកំណត់';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='អតិថិជន';
$ec_lang['lpn_tool_add_meter_tip']='ចុចលើកន្លែងអតិថិជននៅ រួចចុចលើបំពង់ ឬថ្នាំងដែលបម្រើវា។ តម្រូវការដែលអ្នកផ្ដល់ឲ្យអតិថិជននេះ ត្រូវបានបន្ថែមទៅថ្នាំងនៅចុងដែលនៅជិតបំផុតនៃបំពង់នោះ។';
$ec_lang['lpn_mode_add_meter']='អតិថិជន៖ ចុចលើកន្លែងដែលអតិថិជននៅ រួចចុចលើបំពង់ ឬថ្នាំងដែលបម្រើវា។ ឬចុច Esc ដើម្បីបោះបង់។';
$ec_lang['lpn_pane_tab_customers']='អតិថិជន';
$ec_lang['lpn_customer_heading']='អតិថិជន {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='តម្រូវការក្នុងមួយសេវា';
$ec_lang['lpn_field_meter_demand_tip']='អ្វីដែលសេវានីមួយៗនៅអតិថិជននេះត្រូវការ។ រក និងជំនួស អាចប្រើប្រាស់ភាពខុសគ្នារវាងប្រអប់ទទេ និង 0 បាន។';
$ec_lang['lpn_field_meter_count']='ចំនួនសេវា';
$ec_lang['lpn_field_meter_count_tip']='តើអតិថិជននេះតំណាងឲ្យសេវាដូចគ្នាប៉ុន្មាន ដូច្នេះការតភ្ជាប់លំនៅដ្ឋានតែមួយចំនួនសែសិបពីរតាមបណ្ដោយបំពង់មេមួយ អាចជានិមិត្តសញ្ញាតែមួយនៅកន្លែងតែមួយ។ តម្លៃសរុបខាងក្រោមគឺជាតម្រូវការខាងលើគុណនឹងចំនួននេះ។';
$ec_lang['lpn_field_meter_total']='តម្រូវការសរុប';
$ec_lang['lpn_field_meter_total_tip']='តម្រូវការក្នុងមួយសេវា គុណនឹងចំនួនសេវា។ នេះជាចំនួនដែលបន្ថែមទៅថ្នាំងដែលមានឈ្មោះខាងក្រោម។';
$ec_lang['lpn_field_meter_pipe']='ធាតុដែលបានភ្ជាប់';
$ec_lang['lpn_field_meter_pipe_suggest']='ធាតុដែលនៅជិតបំផុតគឺ {id}។ វាយបញ្ចូលវានៅទីនេះដើម្បីបម្រើអតិថិជននេះពីវា។';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='ភ្ជាប់ទៅ';
$ec_lang['lpn_field_meter_node_tip']='ថ្នាំងដែលអតិថិជននេះភ្ជាប់ទៅ។ អូសចំណុចតភ្ជាប់ទៅលើបំពង់មួយ ដើម្បីបម្រើវាពីចំណុចមួយតាមបណ្ដោយបំពង់នោះជំនួសវិញ។';
$ec_lang['lpn_meter_pipe_unknown']='គ្មានអ្វីនៅក្នុងគម្រោងនេះមានឈ្មោះ {id} ទេ ដូច្នេះអតិថិជននេះត្រូវបានទុកនៅកន្លែងដដែល។';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='របៀបដែលតម្រូវការរបស់អតិថិជននេះឡើង និងចុះពេញការដំណើរការ។ វាគុណនឹងតម្រូវការសរុប ដូច្នេះវាប៉ះពាល់ដល់សេវានីមួយៗដែលអតិថិជននេះតំណាងឲ្យ។ ទុកវានៅ គ្មានលំនាំ ដើម្បីតាម លំនាំតម្រូវការលំនាំដើម របស់គម្រោង។';
$ec_lang['lpn_meter_pattern_unknown']='គ្មានលំនាំណាមួយនៅក្នុងគម្រោងនេះមានឈ្មោះ {id} ទេ ដូច្នេះអតិថិជននេះត្រូវបានទុកដដែល។';
$ec_lang['lpn_meter_placed']='អតិថិជន {id} ត្រូវបានបន្ថែម។ ការពិពណ៌នា និងតម្រូវការរបស់វាអាចវាយបញ្ចូលនៅក្នុងតារាងអតិថិជន ឬចុចលើវានៅក្នុងរបៀបជ្រើសរើសដើម្បីបើកប្រអប់របស់វា។';
$ec_lang['lpn_field_meter_pipe_tip']='ធាតុដែលសេវានេះភ្ជាប់ទៅ។ វាយបញ្ចូលមួយផ្សេងទៀតនៅទីនេះ ឬនៅក្នុងតារាងអតិថិជនដើម្បីផ្លាស់ប្ដូរវា ឬអូសចំណុចតភ្ជាប់ទៅធាតុមួយផ្សេងទៀត។';
$ec_lang['lpn_field_meter_station']='ចំណុចតាមបណ្ដោយបំពង់ (%)';
$ec_lang['lpn_field_meter_station_tip']='ចម្ងាយប៉ុន្មានតាមបណ្ដោយបំពង់ដែលសេវានេះភ្ជាប់ទៅ គិតជាភាគរយនៃបំពង់ គិតពីថ្នាំងទីមួយរបស់វាទៅដល់ថ្នាំងទីពីរ។ 0 គឺនៅចុងម្ខាង ហើយ 100 គឺនៅចុងម្ខាងទៀត។ រង្វង់នៅលើបំពង់ធ្វើដូចគ្នាដោយប្រើទ្រនិចចង្អុល។';
$ec_lang['lpn_field_meter_offset']='គម្លាតពីបំពង់';
$ec_lang['lpn_field_meter_offset_tip']='តម្លៃវិជ្ជមាននៅខាងស្ដាំបំពង់ ពេលក្រឡេកមើលពីថ្នាំងទីមួយរបស់វាទៅថ្នាំងទីពីរ។ ការវាយបញ្ចូលតម្លៃនៅទីនេះអាចផ្លាស់ទីអតិថិជនទៅម្ខាងទៀតនៃបំពង់មេ ហើយវាតែងតែធ្វើឲ្យបន្ទាត់សេវាកែងនឹងបំពង់មេ។';
$ec_lang['lpn_field_meter_lumped']='បន្ថែមទៅថ្នាំង';
$ec_lang['lpn_field_meter_lumped_tip']='ថ្នាំងដែលនៅជិតបំផុត; តម្រូវការរបស់អតិថិជននេះត្រូវបានបន្ថែមទៅទីនោះ។';
$ec_lang['lpn_node_customers']='តម្រូវការអតិថិជន';
$ec_lang['lpn_node_customers_tip']='បញ្ជីអតិថិជនដែលបានបន្ថែមនៅថ្នាំងនេះ (ព្រោះនេះជាថ្នាំងដែលនៅជិតបំផុត)។ តម្រូវការអតិថិជនគឺបន្ថែមលើតម្រូវការផ្សេងទៀតដែលរាយនៅទីនេះ។ អតិថិជនមួយត្រូវបានកែសម្រួលនៅកន្លែងវាស្ថិតនៅលើផែនទី ឬនៅក្នុងតារាងអតិថិជន។';
$ec_lang['lpn_node_customers_sum']='{total} {unit} ពីអតិថិជន {n}';
$ec_lang['lpn_customer_detached']='⚠ អតិថិជននេះមិនបានភ្ជាប់ទៅបំពង់ណាមួយទេ ដូច្នេះតម្រូវការរបស់វាមិននៅក្នុងចម្លើយទេ។ លុបវាចោល ឬគូរបំពង់មួយ រួចផ្លាស់ទីអតិថិជនទៅលើវា។';
$ec_lang['lpn_customer_fixed_head']='⚠ ចុងដែលនៅជិតនៃបំពង់នោះមានផ្ទៃទឹកថេរមួយ ដូច្នេះតម្រូវការនេះមិនប៉ះពាល់ដល់ការក្លែងធ្វើទេ។';
$ec_lang['lpn_customer_detached_count']='អតិថិជន {n} មិនបានភ្ជាប់ទៅបំពង់ណាមួយទេ។ តម្រូវការរបស់ពួកគេមិនត្រូវបានរាប់បញ្ចូលទេ។';
$ec_lang['lpn_meter_pick_pipe']='ឥឡូវចុចលើបំពង់ ឬថ្នាំងដែលបម្រើអតិថិជននេះ។ អតិថិជននេះនៅតែជាប់នៅកន្លែងដែលអ្នកដាក់វា។ ចុច Escape ដើម្បីបោះបង់។';
$ec_lang['lpn_inp_export_flat_customers']='ឯកសារ EPANET គ្មានអតិថិជនទេ។ តម្រូវការរបស់អតិថិជន {n} នៅក្នុងគម្រោងនេះចូលទៅក្នុងឯកសារជាជួរដេកតម្រូវការនៅលើថ្នាំងដែលនីមួយៗត្រូវបានបន្ថែមទៅ ហើយជួរដេកនីមួយៗត្រូវបានដាក់ឈ្មោះតាមស្លាកសម្គាល់របស់អតិថិជននោះ។ អ្វីដែលឯកសារមិនអាចផ្ទុកបានគឺខ្លួនអតិថិជនផ្ទាល់៖ កន្លែងវាស្ថិតនៅ បំពង់មួយណាបម្រើវា កន្លែងណាតាមបណ្ដោយបំពង់នោះដែលសេវាភ្ជាប់ទៅ និងចំនួនសេវាប៉ុន្មានដែលអតិថិជនមួយតំណាងឲ្យ។ ឯកសារគម្រោងផ្ទាល់ខ្លួនរបស់អ្នករក្សាទុកនូវទាំងអស់នោះ។';

$ec_lang['lpn_area_hint_window_start']='ចុចលើជ្រុងមួយនៃបង្អួច។';
$ec_lang['lpn_area_hint_window_go']='ចុចលើជ្រុងម្ខាងទៀតដើម្បីបញ្ចប់។';
$ec_lang['lpn_area_hint_lasso_start']='ចុចដើម្បីចាប់ផ្ដើមគូររាង។';
$ec_lang['lpn_area_hint_lasso_go']='អូសដើម្បីគូររាង។ ចុចដើម្បីបញ្ចប់។';
$ec_lang['lpn_area_hint_polygon_start']='ចុចដើម្បីគូរផ្ទៃរាងពហុកោណ។ ចុចទ្វេដងដើម្បីបញ្ចប់។';
$ec_lang['lpn_area_hint_polygon_go']='ចុចលើជ្រុងនីមួយៗ។ ចុចទ្វេដងលើជ្រុងចុងក្រោយដើម្បីបញ្ចប់។';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='សង្កត់គ្រាប់ចុច Shift ខណៈកំពុងជ្រើសរើស ដើម្បីបន្តជាមួយការជ្រើសរើសដែលមានស្រាប់ ដោយបន្ថែម ឬដកអ្វីដែលអ្នកជ្រើសរើស (ត្រឡប់)។';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='ចុចលើផែនទី ហើយអូសព័ទ្ធជុំវិញអ្វីដែលអ្នកចង់បាន រួចលើកម្រាមដៃ។';
$ec_lang['lpn_area_hint_touch_go']='អូសព័ទ្ធជុំវិញអ្វីដែលអ្នកចង់បាន រួចលើកម្រាមដៃដើម្បីបញ្ចប់។';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='បង្ហាញនេះ';
$ec_lang['lpn_multi_title']='បានជ្រើសរើស {n}';
$ec_lang['lpn_multi_varies']='ខុសៗគ្នា';
$ec_lang['lpn_multi_applied']='បានកំណត់ {prop} លើ {n}។';
$ec_lang['lpn_multi_no_fields']='ធាតុទាំងនេះគ្មានអ្វីអាចកំណត់ជាមួយគ្នានៅទីនេះទេ។';
$ec_lang['lpn_pane_pasted']='បានបិទភ្ជាប់ក្រឡា {n}។ ក្រឡា {skipped} មិនបានផ្លាស់ប្ដូរទេ។';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='បានបិទភ្ជាប់ជួរដេក {n} ហើយបានបន្ថែម {created} ក្នុងចំណោមនោះទៅបណ្ដាញ។';
$ec_lang['lpn_pane_pasted_rows_skipped']='បានបិទភ្ជាប់ជួរដេក {n} ហើយបានបន្ថែម {created} ក្នុងចំណោមនោះទៅបណ្ដាញ។ ក្រឡា {skipped} មិនត្រូវបានផ្លាស់ប្ដូរទេ។';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='ចុចទីនេះ រួចបិទភ្ជាប់ជួរដេកពីសៀវភៅបញ្ជីមួយដើម្បីបន្ថែមពួកវា។';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='បិទភ្ជាប់ជាជួរដេកថ្មីនៅចុងតារាង';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='ចុច Ctrl+V ដើម្បីបន្ថែមជួរដេកដែលបានចម្លងទៅខាងក្រោមតារាងនេះ។ ចុច Esc ដើម្បីបោះបង់។';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='ការបិទភ្ជាប់នេះមានជួរដេក {n} ហើយមាន {fit} ក្នុងចំណោមនោះសមនឹងតារាង។ បន្ថែម {extra} ទៀតជាជួរដេកថ្មីនៅខាងក្រោមដែរឬទេ?';
$ec_lang['lpn_pane_paste_overflow_add']='បន្ថែមជួរដេក {extra}';
$ec_lang['lpn_pane_paste_overflow_fit']='បិទភ្ជាប់តែ {fit} ដែលសមប៉ុណ្ណោះ';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='ការបិទភ្ជាប់នេះមានជួរដេក {n} ហើយមាន {fit} ក្នុងចំណោមនោះសមនឹងតារាង។ {extra} ទៀតមិនអាចបន្ថែមជាជួរដេកថ្មីបានទេ៖ {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='លេខសម្គាល់ {n} មិនត្រូវគ្នាទេ។ នៅតែបិទភ្ជាប់ដែរឬទេ?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='គ្មានអ្វីត្រូវបានបិទភ្ជាប់ទេ។ {reasons}';
$ec_lang['lpn_pane_paste_more']='ជួរដេកដែលមានបញ្ហាមិនបានបង្ហាញនៅទីនេះ៖ {n}។';
$ec_lang['lpn_pane_paste_no_id']='ជួរដេក {row}៖ ជួរដេកថ្មីមួយត្រូវការលេខសម្គាល់។';
$ec_lang['lpn_pane_paste_bad_id']='ជួរដេក {row}៖ លេខសម្គាល់ {id} មានដកឃ្លា ឬសញ្ញាសម្រង់នៅក្នុងវា។';
$ec_lang['lpn_pane_paste_id_taken']='ជួរដេក {row}៖ លេខសម្គាល់ {id} កំពុងប្រើរួចហើយ។';
$ec_lang['lpn_pane_paste_id_twice']='ជួរដេក {row}៖ លេខសម្គាល់ {id} ត្រូវបានប្រើពីរដងនៅក្នុងការបិទភ្ជាប់នេះ។';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='ជួរដេក {row}៖ ថ្នាំងថ្មីមួយត្រូវការទាំង {first} និង {second}។';
$ec_lang['lpn_pane_paste_no_ends']='ជួរដេក {row}៖ តំណថ្មីមួយត្រូវការថ្នាំង ពី និងថ្នាំង ទៅ។';
$ec_lang['lpn_pane_paste_no_node']='ជួរដេក {row}៖ ថ្នាំង {id} មិនទាន់មាននៅឡើយទេ។ សូមបិទភ្ជាប់ថ្នាំងរបស់អ្នកមុនសិន រួចទើបតំណរបស់អ្នក។';
$ec_lang['lpn_pane_paste_same_ends']='ជួរដេក {row}៖ ថ្នាំង ពី និង ទៅ គឺជាថ្នាំងតែមួយ។';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='ជួរដេក {row}៖ {text} មិនមែនជា {col} ត្រឹមត្រូវទេ។';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).

// {id} is what the Text table's own Attached to cell named.






$ec_lang['lpn_pane_filled']='បានបំពេញចុះក្រោមក្រឡា {n}។ {skipped} មិនត្រូវបានផ្លាស់ប្ដូរទេ។';
$ec_lang['lpn_pane_filldown']='បំពេញចុះក្រោម';
$ec_lang['lpn_pane_fill_none']='គ្មានអ្វីនៅក្នុងជម្រើសនេះអាចបំពេញចុះក្រោមបានទេ។';
$ec_lang['lpn_pane_ctrlenter_filled']='បានបំពេញក្រឡា {n}។ {skipped} មិនត្រូវបានផ្លាស់ប្ដូរទេ។';
$ec_lang['lpn_pane_hide_col']='លាក់ជួរឈរនេះ';
$ec_lang['lpn_pane_hide_cols']='លាក់ជួរឈរទាំងនេះ';
$ec_lang['lpn_pane_show_all_cols']='បង្ហាញជួរឈរទាំងអស់';
$ec_lang['lpn_pane_sort_asc']='តម្រៀបឡើង';
$ec_lang['lpn_pane_manage_cols']='គ្រប់គ្រងជួរឈរ…';
$ec_lang['lpn_pane_manage_cols_title']='គ្រប់គ្រងជួរឈរ';
$ec_lang['lpn_pane_manage_cols_show']='បង្ហាញ';
$ec_lang['lpn_pane_manage_cols_up']='ផ្លាស់ទីឡើងលើ';
$ec_lang['lpn_pane_manage_cols_down']='ផ្លាស់ទីចុះក្រោម';
$ec_lang['lpn_pane_manage_cols_top']='ផ្លាស់ទីទៅដើម';
$ec_lang['lpn_pane_manage_cols_bottom']='ផ្លាស់ទីទៅចុង';
$ec_lang['lpn_pane_colmenu_tip']='លាក់ ឬគ្រប់គ្រងជួរឈរ';
$ec_lang['lpn_pane_sortarrow_tip']='ត្រឡប់ការតម្រៀប';
$ec_lang['lpn_tool_area_window']='ជ្រើសរើសបង្អួច';
$ec_lang['lpn_tool_area_lasso']='ជ្រើសរើសដោយខ្សែរូបភាព';
$ec_lang['lpn_tool_area_polygon']='ជ្រើសរើសពហុកោណ';
$ec_lang['lpn_tool_delete']='លុប';
$ec_lang['lpn_tool_zoom_extent']='ពង្រីកឲ្យសមនឹងអេក្រង់';
$ec_lang['lpn_tool_zoom_window']='បង្អួចពង្រីក';
$ec_lang['lpn_zoom_in']='ពង្រីក';
$ec_lang['lpn_zoom_out']='បង្រួម';
$ec_lang['lpn_new_text']='អត្ថបទ';
$ec_lang['lpn_field_text_bold']='អក្សរដិត';
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

$ec_lang['lpn_field_text_align']='ការតម្រឹមផ្ដេក';
$ec_lang['lpn_field_text_align_left']='ខាងឆ្វេង';
$ec_lang['lpn_field_text_align_center']='កណ្ដាល';
$ec_lang['lpn_field_text_align_right']='ខាងស្ដាំ';
$ec_lang['lpn_field_text_valign']='ការតម្រឹមបញ្ឈរ';
$ec_lang['lpn_field_text_valign_top']='ខាងលើ';
$ec_lang['lpn_field_text_valign_middle']='កណ្ដាល';
$ec_lang['lpn_field_text_valign_bottom']='ខាងក្រោម';
$ec_lang['lpn_field_text_rotation']='មុំ (អង្សា)';
$ec_lang['lpn_field_text_match_pipe']='បង្វិលទៅតាមមុំនៃតំណជិតបំផុត';
$ec_lang['lpn_field_text_flip']='បង្វិល 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='ធាតុដែលបានភ្ជាប់';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='អត្ថបទនេះត្រូវបានដាក់នៅជិតធាតុមួយល្មម ដូច្នេះវាដើរតាមធាតុនោះ ហើយមានបន្ទាត់នាំ។ អត្ថបទនៅលើបន្ទាត់នាំយកការតម្រឹមផ្ដេក និងបញ្ឈររបស់វាពីជ្រុងដែលវានៅជាប់ ដែលជាមូលហេតុដែលជួរទាំងពីរនោះមិនត្រូវបានផ្ដល់ជូននៅពេលវានៅជាប់ភ្ជាប់។';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='មេគុណឧបករណ៍បាញ់';
$ec_lang['lpn_field_emitter_tip']='លំហូរបន្ថែមមួយដែលអាស្រ័យលើសម្ពាធ សម្រាប់ឧបករណ៍បាញ់ទឹក ច្រកចេញបើក ឬការលេចធ្លាយដែលបានធ្វើគំរូ។ លំហូរដែលវាបញ្ចេញគឺមេគុណនេះគុណនឹងសម្ពាធលើកជាស្វ័យគុណនៃឧបករណ៍បាញ់ ដែលកំណត់តែម្ដងសម្រាប់បណ្ដាញទាំងមូលនៅក្រោម ការកំណត់, ការគណនា, ធារាសាស្ត្រ។ ទុកឲ្យនៅទទេនៅលើថ្នាំងធម្មតាមួយ។';
$ec_lang['lpn_field_elev']='កម្ពស់';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='កម្រិតដីឬបំពង់នៅថ្នាំងនេះ។ វាស់ពីចំណុចសូន្យណាមួយដែលអ្នកចង់បាន ដរាបណាថ្នាំងទាំងអស់ប្រើចំណុចសូន្យតែមួយ។';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='ថ្ពល់';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='កម្រិតផ្ទៃទឹកនៅក្នុងអាងស្តុក វាស់ជាកម្ពស់ មិនមែនជាសម្ពាធទេ។ ទុកទទេ ដើម្បីឲ្យផ្ទៃទឹកស្ថិតនៅកម្ពស់អាងស្តុក។';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='កម្ពស់បាតធុងទឹក។ ជម្រៅទឹកក្នុងធុងវាស់ឡើងលើពីទីនេះ។';
$ec_lang['lpn_field_tank_level']='ជម្រៅទឹក';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='ជម្រៅទឹកនៅក្នុងធុងទឹក វាស់ឡើងលើពីបាតធុង។ ផ្ទៃទឹកគឺជាកម្ពស់បាតធុងបូកនឹងជម្រៅនេះ។';
$ec_lang['lpn_field_tank_minlevel']='ជម្រៅទឹកទាបបំផុត';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='ជម្រៅទឹកដែលធុងទឹកត្រូវបានចាត់ទុកជាទទេ វាស់ឡើងលើពីបាតធុង។';
$ec_lang['lpn_field_tank_maxlevel']='ជម្រៅទឹកខ្ពស់បំផុត';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='ជម្រៅទឹកដែលធុងទឹកត្រូវបានចាត់ទុកជាពេញ វាស់ឡើងលើពីបាតធុង។';
$ec_lang['lpn_field_tank_diameter']='អង្កត់ផ្ចិតធុងទឹក';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='ទទឹងធុងទឹកពីចំហៀងមួយទៅចំហៀងមួយ។ វាមានខ្នាតវាស់ដូចខ្នាតវាស់កម្ពស់ មិនមែនខ្នាតវាស់អង្កត់ផ្ចិតបំពង់ទេ។ វាកំណត់ថាជម្រៅដែលបានផ្ដល់មួយផ្ទុកទឹកបានប៉ុន្មាន។';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='កម្ពស់ផ្ទៃទឹកក្នុងធុងទឹក៖ កម្ពស់បាតធុងបូកនឹងជម្រៅទឹក។ នេះជាកម្រិតដែលឧបករណ៍ដោះស្រាយប្រើសម្រាប់ធុងទឹក។';
$ec_lang['lpn_close']='បិទ';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='លក្ខណៈសម្បត្តិ';
$ec_lang['lpn_empty_hint']='ប្រើម៉ឺនុយឯកសារ, គម្រោងថ្មី ដើម្បីបើកគំរូមួយ។ ឬចាប់ផ្ដើមដោយបន្ថែមអាងស្តុក ថ្នាំង និងបំពង់ពីរបារឧបករណ៍។';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='បណ្ដាញរបស់អ្នកនៅដដែល។';
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
$ec_lang['lpn_examples_welcome']='សូមស្វាគមន៍មកកាន់ការធ្វើគំរូបណ្ដាញផ្គត់ផ្គង់ទឹក ដោយប្រើឧបករណ៍ដោះស្រាយ EPANET';
$ec_lang['lpn_examples_heading']='បើកគំរូមួយ';
$ec_lang['lpn_examples_sub']='គំរូនីមួយៗបើកជាច្បាប់ចម្លងផ្ទាល់ខ្លួនរបស់អ្នក។ ផ្លាស់ប្ដូរវា រក្សាទុកវា ឬបើកច្បាប់ចម្លងថ្មីមួយ ហើយចាប់ផ្ដើមម្ដងទៀត។';
$ec_lang['lpn_examples_open']='បើក';
$ec_lang['lpn_examples_menu']='បើកគំរូ…';
$ec_lang['lpn_examples_blank']='ឬចាប់ផ្ដើមជាមួយផែនទីទទេ';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_close']='បិទ';
$ec_lang['lpn_examples_size']='ថ្នាំង៖ {nodes}, តំណ៖ {links}';
$ec_lang['lpn_examples_failed']='មិនអាចផ្ទុកគំរូបានទេ។ សូមប្រើម៉ឺនុយឯកសារ, គម្រោងថ្មី ដើម្បីចាប់ផ្ដើមគំនូរមួយ។';
$ec_lang['lpn_examples_loading']='កំពុងផ្ទុកគំរូ…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='ជួសជុលអ្វីមួយ';
$ec_lang['lpn_help_notes']='កំណត់ចំណាំអំពីទំព័រនេះ';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='មានអ្វីខុសនៅទីនេះ?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='ការចុចម្ដងប្រាប់យើងថាមានអ្វីមួយខុសនៅលើទំព័រនេះ។ វាផ្ញើឈ្មោះទំព័រនេះ ភាសាដែលអ្នកកំពុងអាន និងសារនៅលើផែនទី ប្រសិនបើមាន។ វាមិនផ្ញើអ្វីដែលអ្នកបានវាយបញ្ចូល គ្មានអាសយដ្ឋាន ហើយគ្មានអ្វីទាំងអស់ចេញពីគំនូររបស់អ្នកទេ។ គ្មាននរណាម្នាក់អាចឆ្លើយតបមកវិញបានទេ ព្រោះនេះមិនប្រាប់អ្វីអំពីអ្នកជានរណានោះទេ។ ប្រើ ជំនួយ, ជួសជុលអ្វីមួយ នៅពេលអ្នកចង់និយាយបន្ថែម។';
$ec_lang['lpn_wrong_thanks']='អរគុណ។ សារនោះបានមកដល់យើងហើយ។';
$ec_lang['lpn_status_example_opened']='បានបើក {name}។ វាជាច្បាប់ចម្លងរបស់អ្នក៖ សូមរក្សាទុកវាតាមរយៈ ឯកសារ, រក្សាទុកជា។';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='ទំព័រនេះមិនអាចគណនាទំហំតំបន់គំនូរបានទេ ដូច្នេះផែនទីកំពុងបង្ហាញទិដ្ឋភាពចុងក្រោយដែលវាអាចគណនាបាន។ ការប្ដូរទំហំបង្អួចនឹងឲ្យវាព្យាយាមម្ដងទៀត។ ប្រសិនបើវានៅតែកើតឡើងជានិច្ច កម្មវិធីបន្ថែមរបស់កម្មវិធីរុករកដែលទប់ស្កាត់ការវាស់ទំព័រ ជាមូលហេតុធម្មតា។';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='បណ្ដាញមូលដ្ឋាន, L/s (ប្រព័ន្ធម៉ែត្រិក)';
$ec_lang['lpn_ex_basic_si_desc']='ចាប់ផ្ដើមនៅទីនេះ។ អាងស្តុកមួយ ម៉ាស៊ីនបូមមួយ និងរង្វិលបិទតូចមួយ៖ ការរៀបចំតូចបំផុតដែលនៅតែដំណើរការជាបណ្ដាញទឹក។ លីត្រក្នុងមួយវិនាទី ជាមួយម៉ែត្រ និងមីលីម៉ែត្រ។';
$ec_lang['lpn_ex_basic_us_title']='បណ្ដាញមូលដ្ឋាន, gpm (សហរដ្ឋអាមេរិក)';
$ec_lang['lpn_ex_basic_us_desc']='បណ្ដាញចាប់ផ្ដើមដូចគ្នា ជាហ្គាឡុងក្នុងមួយនាទី ជាមួយហ្វីត និងអ៊ីញ។';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='តូចបំផុតនៃបណ្ដាញគំរូទាំងបីរបស់ EPANET ខ្លួនឯង៖ អាងស្តុកមួយ ម៉ាស៊ីនបូមមួយ និងរង្វិលបិទតែមួយ។';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='ប្រព័ន្ធចែកចាយបែកសាខាមួយ ជាមួយធុងទឹកមួយ ពីគំរូរបស់ EPANET។';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='គំរូធំរបស់ EPANET៖ ថ្នាំង 92 ធុងទឹក 3 និងអាងស្តុក 2 ដែលមួយក្នុងចំណោមនោះជាទន្លេ។ គួរបើកមើលដើម្បីឃើញថាម៉ូដែលទំហំពិតមួយមើលទៅដូចម្ដេចនៅលើផែនទី។';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='បណ្ដាញដូចគ្នានឹង EPANET Net3 ប៉ុន្តែដាក់ចុះនៅទីកន្លែងណាមួយលើពិភពលោក៖ កូអរដោនេរបស់វាគឺទទឹង និងបណ្ដោយភូមិសាស្ត្រ ហើយមានផែនទីផ្លូវគូរនៅពីក្រោយ។';
$ec_lang['lpn_ex_elm_street_title']='មជ្ឈមណ្ឌល Elm Street';
$ec_lang['lpn_ex_elm_street_desc']='តំបន់ពាណិជ្ជកម្មមួយ ដែលបានដោះស្រាយសម្រាប់លំហូរពន្លត់អគ្គីភ័យ បន្ថែមលើតម្រូវការទឹកខ្ពស់បំផុតប្រចាំថ្ងៃ គិតត្រឹមមួយពេលវេលា គូរនៅលើផែនការទីតាំង។';
$ec_lang['lpn_tool_undo']='ត្រឡប់ក្រោយ';
$ec_lang['lpn_confirm_example']='នេះនឹងបន្ថែមគំរូទៅបណ្ដាញដែលអ្នកមានស្រាប់។ បន្តទេ?';
$ec_lang['lpn_field_diameter']='អង្កត់ផ្ចិត';
$ec_lang['lpn_demand_tip']='លំហូរដែលទាញយកចេញពីបណ្ដាញនៅថ្នាំងនេះ។ បញ្ចូលលេខអវិជ្ជមាន សម្រាប់លំហូរដែលបញ្ចូលទៅក្នុងបណ្ដាញត្រង់ចំណុចនេះ។';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='ឯកតានេះកំណត់ន័យលេខរបស់អ្នក';
$ec_lang['lpn_units_warn_lead']='{unit} ជាឯកតារបស់អ្វីដែលអ្នកបញ្ចូលសម្រាប់៖';
$ec_lang['lpn_units_options_head']='នៅពេលអ្នកប្ដូរឯកតា៖';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='មិនកែប្រែលេខ';
$ec_lang['lpn_units_nondestructive_desc']='មិនកែប្រែលេខ៖ ទុកចំណុចបញ្ចូលនីមួយៗឲ្យនៅដដែល ហើយអានវាឡើងវិញក្នុងឯកតាថ្មី។';
$ec_lang['lpn_units_destructive']='កែប្រែលេខ';
$ec_lang['lpn_units_destructive_desc']='កែប្រែលេខ៖ សរសេរចំណុចបញ្ចូលនីមួយៗឡើងវិញដោយការបំលែងគណិតវិទ្យា ដូច្នេះបណ្ដាញនៅតែស្ទើរតែដូចដើមផ្នែករូបវិទ្យា ក្នុងដែនកំណត់នៃការបំលែង។ វាបាត់បង់ចំណុចបញ្ចូលដើម។ ត្រឡប់ក្រោយនាំវាមកវិញ។';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} តម្លៃឥឡូវនេះមានន័យ {unit}។ គ្មានអ្វីត្រូវបានសរសេរឡើងវិញឡើយ។';
$ec_lang['lpn_status_converted']='{n} តម្លៃត្រូវបានសរសេរឡើងវិញទៅជា {unit}។';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='ដាក់ពណ៌បណ្ដាញតាមបរិមាណមួយ ដូច្នេះផែនទីធំមួយអាចអានបានក្នុងមួយភ្នែក។ សម្ពាធ និងល្បឿន ជាពីរបញ្ហាដែលសំខាន់ជាធម្មតា។';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='ប្រវែង និងកូអរដោនេផែនទី';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='កូអរដោនេផែនទី';
$ec_lang['lpn_units_mapcoords_deg']='អង្សា';
$ec_lang['lpn_units_usft']='ហ្វីតស្ទង់សហរដ្ឋអាមេរិក';
$ec_lang['lpn_units_elevhead']='កម្ពស់ និងថ្ពល់';
$ec_lang['lpn_units_pressure']='សម្ពាធ';
$ec_lang['lpn_units_flow']='លំហូរ';
$ec_lang['lpn_units_velocity']='ល្បឿន';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='ជម្រាលការបាត់បង់ថ្ពល់';
$ec_lang['lpn_result_gradient_tip']='ការបាត់បង់ថ្ពល់ចែកនឹងប្រវែងបំពង់។ ប្រើវាដើម្បីប្រៀបធៀបបំពង់ដែលមានប្រវែងខុសគ្នា ធៀបនឹងដែនកំណត់រចនាតែមួយ។';
$ec_lang['lpn_result_water_age']='អាយុទឹក';
$ec_lang['lpn_result_water_age_tip']='តើទឹកដែលមកដល់ចំណុចនេះស្ថិតនៅក្នុងប្រព័ន្ធអស់រយៈពេលប៉ុន្មាន។ កន្លែងលំហូរជួបគ្នា ទឹកដែលមកដល់ផ្ទុកអាយុលាយបញ្ចូលគ្នា ហើយលេខនៅទីនេះជាមធ្យមរបស់ពួកវាដែលថ្លឹងតាមលំហូរ៖ ថ្នាំងមួយដែលទទួលទឹកភាគច្រើនពីបំពង់ចម្បងខ្លីនិងថ្មី បង្ហាញអាយុទាប ទោះបីជាចុងបំពង់វែងមួយក៏ចិញ្ចឹមវាដែរ។ នៅក្នុងធុងទឹក វាជាអាយុមធ្យមនៃទឹកដែលផ្ទុក ដែលជាមូលហេតុដែលធុងទឹកមួយផ្លាស់ប្ដូរទឹកយឺត ជាធម្មតាមានទឹកចាស់បំផុតនៅក្នុងបណ្ដាញ។ គ្មានដែនកំណត់បទប្បញ្ញត្តិសម្រាប់ប្រៀបធៀបនឹងវាទេ ដូច្នេះសូមវាយតម្លៃលេខនេះធៀបនឹងប្រព័ន្ធផ្ទាល់ខ្លួនរបស់អ្នក។';
$ec_lang['lpn_result_source_share']='ចំណែកប្រភព';
$ec_lang['lpn_result_source_share_tip']='តើទឹកប៉ុន្មានភាគរយដែលមកដល់ចំណុចនេះមកពីថ្នាំងតាមដាន។ នេះជាអ្វីដែលការវិភាគ ការតាមដានប្រភព រាយការណ៍។';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='អាយុទឹកជាមធ្យម';
$ec_lang['lpn_result_avg_source_share']='ចំណែកប្រភពជាមធ្យម';
$ec_lang['lpn_result_avg_concentration']='កំហាប់ជាមធ្យម';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='មេគុណកកិត';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='អត្រាប្រតិកម្ម';
$ec_lang['lpn_result_status']='ស្ថានភាព';
$ec_lang['lpn_result_status_open']='បើក';
$ec_lang['lpn_result_status_closed']='បិទ';
$ec_lang['lpn_result_head']='ថ្ពល់';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='ថាមពលទឹកនៅថ្នាំងនេះ សរសេរជាកម្ពស់ជួរឈរទឹក។ វាជាកម្ពស់ មិនមែនជាសម្ពាធទេ។';
$ec_lang['lpn_result_pressure']='សម្ពាធ';
$ec_lang['lpn_result_flow']='លំហូរ';
$ec_lang['lpn_result_velocity']='ល្បឿន';
$ec_lang['lpn_result_headloss']='ការបាត់បង់ថ្ពល់';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='កំណត់ឡើងវិញតែការកំណត់របស់គម្រោងនេះប៉ុណ្ណោះ។ គំនូរ និងគម្រោងផ្សេងទៀតរបស់អ្នកមិនផ្លាស់ប្ដូរទេ។ ដើម្បីរក្សាទុកការកំណត់ដែលអ្នកចូលចិត្តសម្រាប់ប្រើឡើងវិញ សូមរក្សាទុកឯកសារគម្រោងដែលមានតែការកំណត់ប៉ុណ្ណោះ។';
$ec_lang['lpn_reset_all_tip']='លុបគម្រោងទាំងអស់ រូបភាពផ្ទៃខាងក្រោយទាំងអស់ ការកំណត់ទាំងអស់ និងជម្រើសខ្នាតវាស់របស់អ្នក រួចផ្ទុកទំព័រឡើងវិញដូចអ្នកចូលមើលលើកដំបូង។ នេះជាការកំណត់ឡើងវិញតែមួយគត់ដែលលុបអ្វីៗទាំងអស់។';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='ម៉ាស៊ីនគណនានេះរក្សាទុកខ្នាតវាស់ និងតម្លៃបញ្ចូលរបស់គម្រោងតាមអ្វីដែលបានវាយបញ្ចូល ប៉ុន្តែពីមុនវាបំប្លែងលេខទៅជា SI សម្រាប់ការផ្ទុក។ គម្រោងនេះត្រូវបានរក្សាទុកមុនពេលមានការផ្លាស់ប្ដូរនោះ ដូច្នេះលេខរបស់វាត្រូវបានផ្ទុកជា SI។ តើបំប្លែងវាម្ដងចុងក្រោយទៅជាខ្នាតវាស់បច្ចុប្បន្នទេ? ដើម្បីឲ្យអ្នកវិនិច្ឆ័យ នេះជាអង្កត់ផ្ចិតមួយចំនួនដែលនឹងត្រូវបំប្លែង ជាមួយតម្លៃមុន និងក្រោយ:';
$ec_lang['lpn_v2_restore_yes']='បំប្លែង';
$ec_lang['lpn_v2_restore_never']='ទេ។ កុំសួរម្ដងទៀត។';
$ec_lang['lpn_v2_restore_no']='បិទ ដើម្បីឲ្យខ្ញុំពិនិត្យខ្នាតវាស់បច្ចុប្បន្នសិន';
$ec_lang['lpn_storage_too_new']='គម្រោងនេះត្រូវបានរក្សាទុកដោយកំណែថ្មីជាងនៃទំព័រនេះ ដូច្នេះមិនអាចបើកនៅទីនេះបានទេ។';
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
$ec_lang['lpn_tool_file']='ឯកសារ';
$ec_lang['lpn_menu_edit']='កែសម្រួល';
$ec_lang['lpn_menu_insert']='បញ្ចូល';
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
$ec_lang['lpn_menu_map']='ផែនទី';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='បង្ហាញផែនទីផ្លូវ';
$ec_lang['lpn_basemap_satellite_show']='បង្ហាញរូបភាពផ្កាយរណប';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='ភូមិសាស្ត្រ';
$ec_lang['lpn_xymap']='មូលដ្ឋាន';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='បម្លែងជា…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='ច្បាប់ចម្លងនៃ {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='បម្លែងជា';
$ec_lang['lpn_convas_coordsys_tip']='ប្រព័ន្ធកូអរដោនេដែលច្បាប់ចម្លងត្រូវបានបម្លែងទៅ។ នៅពេលវាខុសពីប្រព័ន្ធរបស់គម្រោងនេះ ជំហានកំណត់ទីតាំងពីរតាមក្រោយមក។ គម្រោងមួយដែលដឹងរួចហើយថាខ្លួនស្ថិតនៅទីណា បើកជំហានទាំងពីរនោះជាមួយចម្លើយរួចហើយ ដូច្នេះអ្នកអាចទទួលយកវាដូចដែលវាមាន ឬធ្វើការផ្លាស់ប្ដូរ។';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='បច្ចុប្បន្ន៖ {crs}';
$ec_lang['lpn_convas_epsg']='ប្រព័ន្ធកូអរដោនេ EPSG';
$ec_lang['lpn_convas_epsg_tip']='ជ្រើសរើសប្រព័ន្ធកូអរដោនេមួយពីបញ្ជី EPSG។ រយៈទទឹង និងបណ្ដោយភូមិសាស្ត្រគឺ WGS 84 (EPSG:4326)។';
$ec_lang['lpn_convas_unnamed']='តម្រៀបភូមិសាស្ត្រគ្មានឈ្មោះ (មូលដ្ឋាន)';
$ec_lang['lpn_convas_unnamed_tip']='កូអរដោនេមូលដ្ឋាននៅក្នុងឯកតាប្រវែង ជាមួយផែនទីពិភពលោកភ្ជាប់។';
$ec_lang['lpn_convas_none_tip']='កូអរដោនេមូលដ្ឋាននៅក្នុងឯកតាប្រវែង ដោយគ្មានផែនទីពិភពលោកឥឡូវនេះ។';
$ec_lang['lpn_convas_units_tip']='ឯកតាដែលច្បាប់ចម្លងត្រូវបានបម្លែងទៅ។ ច្បាប់ដើមរក្សាលេខ និងឯកតាផ្ទាល់ខ្លួនរបស់វា។';
$ec_lang['lpn_convas_round']='បង្គត់តម្លៃដែលបានបម្លែង';
$ec_lang['lpn_convas_round_tip']='បង្គត់តែលេខដែលការបម្លែងនេះសរសេរឡើងវិញប៉ុណ្ណោះ ទៅជំហានដែលនៅជិតបំផុតដែលអ្នកជ្រើសរើស។ តម្លៃដែលឯកតារបស់វាមិនផ្លាស់ប្ដូរ ត្រូវបានទុកដូចដើម។';
$ec_lang['lpn_convas_round_none']='គ្មានការបង្គត់';
$ec_lang['lpn_convas_round_flow']='តម្រូវការ និងលំហូរ';
$ec_lang['lpn_convas_label_col']='បច្ច័យ';
$ec_lang['lpn_convas_label_tip']='អក្សរបន្ថែមបន្ទាប់ពីតម្លៃនេះនៅលើស្លាកផែនទីរបស់ច្បាប់ចម្លង ដូចជា \' mm\' ឬ \' gpm\'។ បំពេញមុនពីឯកតាដែលបានជ្រើសរើសខាងលើ; សម្អាតវាចោលសម្រាប់គ្មានបច្ច័យ។';
$ec_lang['lpn_convas_oneway']='ការបម្លែងត្រឡប់មកវិញគឺជាការបម្លែងលើកទីពីរ មិនមែនជាការមិនធ្វើវិញទេ។ លេខមួយដែលបានបម្លែង ហើយបម្លែងត្រឡប់មកវិញ អាចនឹងមិនត្រឡប់មកដូចវាយបញ្ចូលដើមឡើយ។';
$ec_lang['lpn_convas_ok']='បម្លែង';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} គឺជាមួយក្នុងចំណោមប្រព័ន្ធកូអរដោនេមួយចំនួនតូចដែលរាយក្នុងបញ្ជី ដោយគ្មានព័ត៌មានប្រែក្លាយដែលអាចប្រើបាន ដូច្នេះវាមិនអាចបម្លែងទៅ ឬពីវាបានទេ។ គ្មានអ្វីត្រូវបានបម្លែងទេ។';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='ច្បាប់ចម្លងដែលបានបម្លែងគឺ {name}។ គម្រោងដើមមិនផ្លាស់ប្ដូរទេ។';
$ec_lang['lpn_convas_cancelled']='គ្មានអ្វីត្រូវបានបម្លែងទេ។ ច្បាប់ចម្លងត្រូវបានបិទ ហើយគម្រោងដើមមិនផ្លាស់ប្ដូរទេ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='ចម្លងគម្រោងនេះទៅផ្ទាំងថ្មីមួយ ហើយបម្លែងច្បាប់ចម្លងទៅប្រព័ន្ធកូអរដោនេ និងឯកតាដែលអ្នកជ្រើសរើស។ នៅពេលប្រព័ន្ធកូអរដោនេផ្លាស់ប្ដូរ អ្នកជំនួយការមួយនាំអ្នកឲ្យពង្រីក/បង្រួមផែនទីនៅពីក្រោយបណ្ដាញរបស់អ្នកប្រហែល រួចប្ដូរទំហំ និងបង្វិលបណ្ដាញរបស់អ្នកលើផែនទីឲ្យកាន់តែជិតបំផុត។ គម្រោងនេះនៅតែដូចវាមានយ៉ាងពិតប្រាកដ។ ដើម្បីតម្រៀបភូមិសាស្ត្រដោយមិនបម្លែងអ្វីទាំងអស់ សូមប្រើ ផែនទី, ផែនទីពិភពលោក, ភ្ជាប់ជំនួសវិញ។';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='គម្រោងនេះត្រូវបានតម្រៀបភូមិសាស្ត្ររួចហើយ ដូច្នេះបណ្ដាញនេះនៅលើផែនទីរួចហើយ ហើយគ្មានអ្វីត្រូវបានផ្លាស់ទីទេ។ ពិនិត្យមើលថាវានៅត្រឹមកន្លែងត្រឹមត្រូវ រួចចុចប៊ូតុង ដាក់គំរូនៅទីនេះ និងប៊ូតុង រក្សាទីតាំងនេះ។';
$ec_lang['lpn_georef_intro']='ការដាក់គំរូធ្វើឡើងជាពីរជំហាន។ ជំហានទី 1 ជាជំហានលឿន៖ គំរូនៅស្ថិតស្ថេរ ហើយអ្នកផ្លាស់ទីផែនទីនៅពីក្រោយវា រហូតដល់តំបន់របស់អ្នកស្ថិតនៅក្រោមគំរូតាមទំហំប្រហែលត្រូវ។ មិនទាន់មានការបង្វិលនៅឡើយទេ។ ជំហានទី 2 ជាជំហានត្រឹមត្រូវ៖ អ្នកអូស ប្ដូរទំហំ និងបង្វិលគំរូខ្លួនឯង។ គម្រោងរបស់អ្នកនៅលើផែនទីពិភពលោកទាំងមូលនៅដំបូង ដូច្នេះសូមរកទីតាំងរបស់អ្នកជាមុនសិន រួចចុចប៊ូតុង ដាក់គំរូនៅទីនេះ។';
$ec_lang['lpn_georef_adjust']='គំរូឥឡូវនេះនៅលើដីហើយ ដូច្នេះវាផ្លាស់ទីជាមួយផែនទី។ អូសគំរូដើម្បីផ្លាស់ទីវា អូសជ្រុងដើម្បីប្ដូរទំហំវា អូសដងតូចមូលនៅខាងលើគំរូដើម្បីបង្វិលវា។ ឬវាយចម្ងាយដីផែន និងមុំបង្វិលនៅខាងក្រោម។';
$ec_lang['lpn_georef_step1']='ជំហានទី ១ នៃ ២ — លឿន';
$ec_lang['lpn_georef_step2']='ជំហានទី ២ នៃ ២ — ត្រឹមត្រូវ';
$ec_lang['lpn_georef_step1_hint']='គម្រោងរបស់អ្នកនៅតែនៅកន្លែងដដែលលើអេក្រង់។ អូស និងពង្រីក/បង្រួមផែនទីនៅពីក្រោមវា រហូតដល់ដីនៅពីក្រោយវាស្ថិតនៅកន្លែង និងទំហំប្រហែលត្រូវ រួចចុច ដាក់គំរូនៅទីនេះ។';
$ec_lang['lpn_georef_detach']='លើកយកមកវិញ';
$ec_lang['lpn_georef_size_prompt']='តំបន់នេះមានទទឹងប្រហែលប៉ុន្មាន គិតទូទាំងគម្រោង?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='ផ្លូវកាត់៖ ចុច {key}។';
$ec_lang['lpn_tool_key_hint_two']='ផ្លូវកាត់៖ ចុច {key} ឬ {key2}។';
$ec_lang['lpn_tool_add_junction_tip']='ចុចលើផែនទីដើម្បីបន្ថែមថ្នាំង៖ ចំណុចមួយកន្លែងបំពង់ជួបគ្នា ឬកន្លែងប្រើទឹក។';
$ec_lang['lpn_tool_add_reservoir_tip']='ចុចលើផែនទីដើម្បីបន្ថែមអាងស្តុក៖ ប្រភពមួយដែលរក្សាកម្ពស់ទឹកថេរមួយ។';
$ec_lang['lpn_tool_add_tank_tip']='ចុចលើផែនទីដើម្បីបន្ថែមធុងទឹក៖ ការស្តុកទុកមួយដែលកម្រិតទឹករបស់វាឡើង និងចុះ ខណៈវាបំពេញ និងបង្ហូរ។';
$ec_lang['lpn_tool_add_pipe_tip']='ចុចលើថ្នាំងមួយ រួចថ្នាំងមួយទៀត ដើម្បីគូរបំពង់មួយភ្ជាប់ពួកវា។';
$ec_lang['lpn_tool_add_pump_tip']='ចុចលើថ្នាំងមួយ រួចថ្នាំងមួយទៀត ដើម្បីដាក់ម៉ាស៊ីនបូមមួយភ្ជាប់ពួកវា។';
$ec_lang['lpn_tool_add_valve_tip']='ចុចលើថ្នាំងមួយ រួចថ្នាំងមួយទៀត ដើម្បីដាក់វ៉ាល់មួយភ្ជាប់ពួកវា។';
$ec_lang['lpn_tool_add_text_tip']='ចុចលើផែនទីដើម្បីសរសេរកំណត់ចំណាំមួយនៅលើគំនូរ។';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='ចុចលើផែនទីតាមការណែនាំ ដើម្បីជ្រើសរើសអ្វីៗទាំងអស់ខាងក្នុងរាងនោះ។ ចុចប៊ូតុងនេះម្ដងទៀតដើម្បីប្ដូររាងរវាងបង្អួច ខ្សែរូបភាព និងពហុកោណ។ សង្កត់គ្រាប់ចុច Shift ខណៈកំពុងជ្រើសរើស ដើម្បីបន្តជាមួយការជ្រើសរើសដែលមានស្រាប់ ដោយបន្ថែម ឬដកអ្វីដែលអ្នកជ្រើសរើស (ត្រឡប់)។';
$ec_lang['lpn_area_selected']='បានជ្រើសរើស {n}។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='រកមិនឃើញអ្វីនៅក្នុងតំបន់នោះទេ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='បន្ថែម និងលុបចំណុចកំណត់ដែលកំណត់រាងបំពង់នៅលើផែនទី។ ចុចលើបំពង់ដើម្បីបន្ថែមចំណុចកំណត់ ចុចលើចំណុចកំណត់ដើម្បីលុបវា ហើយអូសចំណុចកំណត់ដើម្បីផ្លាស់ទីវា។ ចំណុចកំណត់ផ្លាស់ប្ដូរតែផ្លូវគំនូរប៉ុណ្ណោះ មិនមែនធារាសាស្ត្រទេ។';
$ec_lang['lpn_tool_delete_tip']='ចុចលើអ្វីមួយនៅលើផែនទីដើម្បីលុបវាចេញ។';
$ec_lang['lpn_tool_undo_tip']='ត្រឡប់ការផ្លាស់ប្ដូរចុងក្រោយ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='ដាក់បណ្ដាញទាំងមូលឲ្យសមនឹងបង្អួច។';
$ec_lang['lpn_tool_zoom_window_tip']='ចុចជ្រុងទល់មុខគ្នាពីរនៃប្រអប់មួយ ឬអូសមួយ នៅលើផែនទី ដើម្បីពង្រីកចូលទៅវា។ ចុចប៊ូតុងនេះម្ដងទៀតសម្រាប់ ពង្រីកឲ្យសមនឹងអេក្រង់។';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='ពង្រីក។ ផ្លូវកាត់៖ +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='បង្រួម។ ផ្លូវកាត់៖ -';
$ec_lang['lpn_tool_settings_tip']='បើកការកំណត់សម្រាប់គម្រោងនេះ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='រកធាតុមួយតាមលេខសម្គាល់របស់វា ឬរកគ្រប់ធាតុដែលត្រូវនឹងលក្ខខណ្ឌមួយ ហើយផ្លាស់ប្ដូរពួកវាទាំងអស់ក្នុងពេលតែមួយ។';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='អត្ថន័យរូបតំណាងលើរបារឧបករណ៍';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='ភាពមើលឃើញ';
$ec_lang['lpn_pane_right_toggle_tip']='បង្ហាញ ឬលាក់ផ្ទាំងនៅខាងស្ដាំផែនទី។ វាមានជម្រើសស្លាក និងពណ៌។';
$ec_lang['lpn_color_legend_open_tip']='ចុចដើម្បីបើកផ្ទាំងភាពមើលឃើញ ហើយប្ដូរពណ៌ទាំងនេះ។';
$ec_lang['lpn_color_node_field']='ដាក់ពណ៌ថ្នាំងតាម';
$ec_lang['lpn_color_link_field']='ដាក់ពណ៌បំពង់តាម';
$ec_lang['lpn_color_ramp_sequential']='លំដាប់';
$ec_lang['lpn_color_ramp_diverging']='ពីរទិស';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='ចំនួនជួរ';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='របៀបចែកជួរ';
$ec_lang['lpn_color_ranges_note']='ព្រំដែនខាងក្រោមត្រូវបានកំណត់ថេរនៅពេលកំណត់រួច; ពួកវាមិនតាមលទ្ធផលនៅពេលវាផ្លាស់ប្ដូរទេ។ ការជ្រើសរើសវិធីសាស្ត្រចាត់ថ្នាក់ទិន្នន័យខាងលើ កំណត់ព្រំដែនពីស្ថានភាពបច្ចុប្បន្នរបស់ប្រព័ន្ធ។ ប្រសិនបើអ្នកផ្លាស់ប្ដូរតម្លៃណាមួយដោយដៃ វិធីសាស្ត្រខាងលើនឹងក្លាយទៅជា ដោយដៃ។';
$ec_lang['lpn_color_criterion_note']='ព្រំដែនជួរមកពីស្តង់ដារការរចនាមួយ ដូច្នេះចំនួនជួរនៅថេរ ខណៈជម្រើសនេះកំពុងប្រើ។';
$ec_lang['lpn_color_break_number']='ព្រំដែនជួរមួយត្រូវតែជាលេខ។ ផែនទីមិនផ្លាស់ប្ដូរទេ។';
$ec_lang['lpn_color_break_order']='ព្រំដែនជួរនីមួយៗត្រូវធំជាងព្រំដែនមុន។ ផែនទីមិនផ្លាស់ប្ដូរទេ។';
$ec_lang['lpn_color_break_count']='ត្រូវមានព្រំដែនតិចជាងចំនួនជួរមួយ។ ផែនទីមិនផ្លាស់ប្ដូរទេ។';
$ec_lang['lpn_color_ramp_qualitative']='ចំណាត់ថ្នាក់';
$ec_lang['lpn_color_ramp_rainbow']='ឥន្ទធនូ';
$ec_lang['lpn_color_ramp_rainbow_eg']='ដូច EPANET';
$ec_lang['lpn_color_example_status']='ស្ថានភាព';
$ec_lang['lpn_color_example_material']='សម្ភារៈ';
$ec_lang['lpn_color_ramp_ylgnbu']='លឿងទៅខៀវ';
$ec_lang['lpn_color_ramp_rdylbu']='ក្រហមទៅខៀវ ឆ្លងកាត់លឿង';
$ec_lang['lpn_georef_drop']='ដាក់គំរូនៅទីនេះ';
$ec_lang['lpn_georef_finish']='រក្សាទីតាំងនេះ';
$ec_lang['lpn_georef_cancel']='បោះបង់';
$ec_lang['lpn_georef_scale']='ចម្ងាយដីក្នុងឯកតាគំនូរមួយ';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='ចម្ងាយប៉ុន្មាននៅលើដីដែលឯកតាមួយនៃគំនូររបស់អ្នកគ្របដណ្ដប់។ គំនូរធ្វើនៅលើក្រឡាចត្រង្គធម្មតាជាធម្មតាមិនប្រាប់អំពីរឿងនេះទេ ដូច្នេះកំណត់វានៅទីនេះ — ឬឲ្យ ទៅកាន់… សួរអ្នកថាតំបន់នោះមានទទឹងប៉ុន្មាន ហើយគណនាឲ្យ។';
$ec_lang['lpn_georef_rotation']='បង្វិលច្រាសទ្រនិចនាឡិកា (អង្សា)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='បង្វិលគំរូទាំងមូលច្រាសទ្រនិចនាឡិកាប៉ុន្មាន ដូច្នេះទិសខាងជើងរបស់វាចង្អុលទៅខាងជើងពិត។';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='ដាក់គំរូនៅទីនេះជាអចិន្ត្រៃយ៍ឬ? អ្នកនៅតែអូសធាតុនីមួយៗបានក្រោយពីនេះ ប៉ុន្តែគំនូរនឹងលែងជាគម្រោង xy ទៀតហើយ។ ដើម្បីយក xy មកវិញ សូមបិទគម្រោងនេះដោយមិនរក្សាទុក។';
$ec_lang['lpn_georef_done']='នេះជាគម្រោង lat/lon ហើយ។ អូសធាតុណាមួយដើម្បីផ្លាស់វាទៅជិតកន្លែងពិតរបស់វា។';
$ec_lang['lpn_georef_backdrop_unrotated']='រូបភាពផ្ទៃខាងក្រោយត្រូវបានផ្លាស់ទី និងប្ដូរទំហំតាមគំរូ ប៉ុន្តែមិនអាចបង្វិលបានទេ។ សូមប្រើ ផែនទី, រូបភាពផ្ទៃខាងក្រោយ, ផ្លាស់ទី ដើម្បីតម្រឹមវា។';
$ec_lang['lpn_georef_empty']='ឯកសារនោះគ្មានបណ្ដាញនៅក្នុងវាទេ ដូច្នេះគ្មានអ្វីត្រូវដាក់ទេ។';
$ec_lang['lpn_georef_unavailable']='ឧបករណ៍ដាក់ទីតាំងមិនបានផ្ទុកឡើយ។ សូមផ្ទុកទំព័រឡើងវិញ ហើយសាកល្បងម្ដងទៀត។';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='សូមបញ្ចប់ការដាក់ទីតាំងជាមួយប៊ូតុង "រក្សាទុកទីតាំងនេះ" ឬចុច បោះបង់ មុននឹងប្ដូរគម្រោង។ ការដាក់ទីតាំងនេះជារបស់គម្រោងនេះ ហើយមិនអាចទៅតាមអ្នកទៅគម្រោងផ្សេងបានទេ។';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='សូមបញ្ចប់ការដាក់ទីតាំងជាមួយប៊ូតុង "រក្សាទីតាំងនេះ" ឬចុច បោះបង់ មុននឹងរក្សាទុក។ គម្រោងនេះនៅតែកំពុងដាក់ទីតាំង ដូច្នេះអ្វីដែលនៅលើអេក្រង់មិនទាន់ជាអ្វីដែលនឹងសរសេរទៅឯកសារនោះទេ។';
$ec_lang['lpn_goto_menu']='ទៅកាន់ទទឹង និងបណ្ដោយ…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='ផ្លាស់ផែនទីទៅកន្លែងមួយដែលអ្នកមានកូអរដោនេរួចហើយ។ ទទឹងមុន រួចបណ្ដោយ តាមរបៀបផែនទីផ្ដល់ជូន ដោយមានចន្លោះមួយរវាងពួកវា៖ 38 -122';
$ec_lang['lpn_goto_prompt']='ទទឹង និងបណ្ដោយ តាមលំដាប់នេះ';
$ec_lang['lpn_goto_bad']='នេះមិនមែនជាទទឹងមួយ និងបណ្ដោយមួយទេ។ សូមសាកល្បង 38 -122 ដោយមានចន្លោះមួយរវាងពួកវា។';
$ec_lang['lpn_georef_goto']='ទៅកាន់…';
$ec_lang['lpn_georef_twopt']='ប្រើចំណុចដែលដឹងស្រាប់ពីរ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='កំណត់ទីតាំងគំរូឲ្យបានត្រឹមត្រូវ នៅពេលអ្នកដឹងរួចហើយថាចំណុចពីរនៅលើគំនូររបស់អ្នកស្ថិតនៅទីណាជាក់ស្ដែង។ ចុចលើចំណុចមួយក្នុងចំណោមនោះ វាយបញ្ចូលរយៈទទឹង និងបណ្ដោយភូមិសាស្ត្ររបស់វា រួចធ្វើដូចគ្នាសម្រាប់ចំណុចទីពីរ។ ទីតាំង មាត្រដ្ឋាន និងការបង្វិលទាំងអស់ត្រូវបានកំណត់ដោយផ្អែកលើចំណុចទាំងពីរនោះ។ ចុចប៊ូតុងនេះម្ដងទៀតដើម្បីឈប់ជ្រើសរើស។';
$ec_lang['lpn_georef_twopt_pick1']='ចុចលើចំណុចមួយនៅលើគំនូររបស់អ្នកដែលអ្នកដឹងរយៈទទឹង និងបណ្ដោយភូមិសាស្ត្ររបស់វា។';
$ec_lang['lpn_georef_twopt_pick2']='ឥឡូវចុចលើចំណុចដែលដឹងស្រាប់ទីពីរ ដែលនៅឆ្ងាយបំផុតពីចំណុចទីមួយតាមដែលអាចធ្វើទៅបាន។';
$ec_lang['lpn_georef_twopt_same']='នោះជាចំណុចដែលអ្នកបានជ្រើសរើសមុន។ សូមជ្រើសរើសចំណុចផ្សេង។';
$ec_lang['lpn_georef_twopt_done']='ឥឡូវនេះគំរូស្ថិតនៅលើចំណុចទាំងពីរដែលអ្នកបានផ្ដល់។ សូមពិនិត្យមើលវា រួចចុចប៊ូតុង រក្សាទីតាំងនេះ។';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='ផ្ទាំងខាងក្រោម';
$ec_lang['lpn_pane_toggle_tip']='បង្ហាញ ឬលាក់ផ្ទាំងនៅខាងក្រោមផែនទី។ វាមានទម្រង់បណ្ដោយ និងតារាងសម្រាប់ធាតុនីមួយៗប្រភេទ។';
$ec_lang['lpn_pane_resize']='អូសដើម្បីធ្វើឲ្យផ្ទាំងខ្ពស់ ឬទាបជាង';
$ec_lang['lpn_pane_tab_junctions']='ថ្នាំង';
$ec_lang['lpn_pane_tab_reservoirs']='អាងស្តុក';
$ec_lang['lpn_pane_tab_tanks']='ធុងទឹក';
$ec_lang['lpn_pane_tab_pipes']='បំពង់';
$ec_lang['lpn_pane_tab_pumps']='ម៉ាស៊ីនបូម';
$ec_lang['lpn_pane_tab_valves']='វ៉ាល់';
$ec_lang['lpn_pane_tab_tip']='ផ្ទាំងនេះបង្ហាញធាតុប្រភេទនេះជាតារាងមួយ ដែលអ្នកអាចតម្រៀប និងកែសម្រួល។ ជួរឈរលទ្ធផលមិនអាចកែសម្រួលបានទេ។';
$ec_lang['lpn_pane_none']='បណ្ដាញនេះមិនទាន់មានធាតុទាំងនេះនៅឡើយទេ។';
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
$ec_lang['lpn_pane_text_attached']='បានភ្ជាប់';
$ec_lang['lpn_pane_not_used']='មិនបានប្រើ';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='បានត្រងដោយ {q}។ កំពុងបង្ហាញ {n} ក្នុងចំណោម {all}។';
$ec_lang['lpn_pane_filter_clear']='បង្ហាញទាំងអស់';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='គ្មានអ្វីនៅក្នុងតារាងនេះត្រូវនឹងតម្រងទេ។';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='ពង្រីក និងជ្រើសរើស';



$ec_lang['lpn_pane_print']='បោះពុម្ពតារាង';
$ec_lang['lpn_pane_print_tip']='បោះពុម្ពតារាងដែលអ្នកកំពុងមើល ជាមួយឈ្មោះគម្រោង ឈ្មោះតារាង និងឯកតានៅក្នុងក្បាលជួរឈរ។ ជួរដេកបោះពុម្ពតាមលំដាប់ដែលអ្នកបានតម្រៀប។';

// **HIDE MAP READOUTS IS RETIRED, 2026-09-22** (Tom: "Hide map readouts was a print prep command.
// But it isn't very useful any more. Let's remove it."). lpn_clean_map, lpn_clean_map_off and
// lpn_clean_map_tip were deleted with the row; nothing else read them.
// THE PROJECT MENU (ROADMAP Task 467). Tom, 2026-08-20: "Maybe we can have a Project menu with
// Settings, Library, and Report under it?" Its rows borrow the names they already have --
// lpn_menu_settings, lpn_library_menu, lpn_time_run_report -- so a door cannot drift from the thing
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
$ec_lang['lpn_menu_project']='ទឹក';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='អ្វីៗទាំងអស់អំពីការធ្វើគំរូបណ្ដាញទឹកមាននៅទីនេះជាកន្លែងតែមួយ លើកលែងតែប៊ូតុងបញ្ជាចាក់ចលនា។ មិនចាំបាច់ស្មានថាអ្វីនៅឯណាទេ។';
$ec_lang['lpn_tables_menu']='តារាង';
$ec_lang['lpn_tables_menu_tip']='បើកបន្ទះខាងក្រោមផែនទីទៅលើតារាងផ្នែកនានាក្នុងបណ្ដាញនេះ។ មានតារាងមួយសម្រាប់ផ្នែកនីមួយៗប្រភេទ ហើយអ្នកអាចតម្រៀប និងកែសម្រួលវានៅទីនោះបាន។';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='គណនាបណ្ដាញនេះឡើងវិញឥឡូវនេះ។ កំពុងរកប៊ូតុង ដំណើរការ? ខណៈគម្រោងនេះគណនាឡើងវិញបន្ទាប់ពីរាល់ការផ្លាស់ប្ដូរ របារឧបករណ៍គ្មានប៊ូតុង ដំណើរការ ទេ។ បិទ “គណនាឡើងវិញដោយស្វ័យប្រវត្តិ” នៅក្នុង ការកំណត់ ក្រោម ការគណនា, ធារាសាស្ត្រ ហើយប៊ូតុងនោះនឹងត្រឡប់មកវិញ។';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='គណនាឡើងវិញដោយស្វ័យប្រវត្តិ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='នៅពេលបើកជម្រើសនេះ គម្រោងនេះគណនាឡើងវិញភ្លាមៗបន្ទាប់ពីរាល់ការផ្លាស់ប្ដូរដែលអ្នកធ្វើ ហើយប៊ូតុង គណនា ត្រូវបានដកចេញពីរបារឧបករណ៍ ព្រោះគ្មានអ្វីនៅសល់ឲ្យវាធ្វើទៀតទេ។ បិទជម្រើសនេះនៅលើបណ្ដាញធំមួយ ដែលការរង់ចាំគណនាឡើងវិញរាល់ការផ្លាស់ប្ដូរជាឧបសគ្គដល់ការវាយបញ្ចូល ហើយប៊ូតុង គណនា នឹងត្រឡប់មកវិញ ដើម្បីអ្នកជ្រើសពេលណាដំណើរការ។';
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
$ec_lang['lpn_time_run_slow']='បណ្ដាញនេះចំណាយពេល {secs} វិនាទីដើម្បីគណនា ហើយវាត្រូវបានកំណត់ឲ្យគណនាឡើងវិញបន្ទាប់ពីរាល់ការផ្លាស់ប្ដូរ។ ដើម្បីបញ្ឈប់វា ហើយឲ្យប៊ូតុង គណនា ត្រឡប់មកវិញ សូមបិទ “គណនាឡើងវិញដោយស្វ័យប្រវត្តិ” នៅក្នុង ការកំណត់ ក្រោម ការគណនា, ធារាសាស្ត្រ។';
$ec_lang['lpn_time_no_report']='មិនទាន់មានរបាយការណ៍ដំណើរការនៅឡើយទេ។ របាយការណ៍នេះជាអត្ថបទផ្ទាល់របស់ EPANET ដូច្នេះវានឹងបង្ហាញនៅពេលបណ្ដាញនេះត្រូវបានគណនាដោយឧបករណ៍ដោះស្រាយ EPANET។';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
$ec_lang['lpn_menu_settings']='ការកំណត់';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='ជំនួយ';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='វិចិត្រសាលរូបភាពអេក្រង់';
$ec_lang['lpn_help_walkthroughs']='មគ្គុទ្ទេសក៍';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='លុបបណ្ដាញ';
$ec_lang['lpn_confirm_delete_network']='លុបថ្នាំង ខ្សែបំពង់ និងស្លាកអក្សរទាំងអស់ក្នុងគម្រោងនេះមែនទេ? រូបភាពផ្ទៃខាងក្រោយ ឈ្មោះគម្រោង និងការកំណត់របស់អ្នកនៅតែរក្សាទុក។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='រក និងជំនួស';
$ec_lang['lpn_find_title']='រក និងជំនួស';
$ec_lang['lpn_find_scope']='អ្វីត្រូវរក';
$ec_lang['lpn_find_scope_all']='ទាំងអស់';
$ec_lang['lpn_find_property']='លក្ខណៈសម្បត្តិ';
$ec_lang['lpn_find_condition']='លក្ខខណ្ឌ';
$ec_lang['lpn_find_value']='តម្លៃ';
$ec_lang['lpn_find_btn']='រក';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='ត្រងក្នុងតារាងបច្ចុប្បន្ន';
$ec_lang['lpn_find_filter_tip']='បង្ហាញតែផ្នែកដែលត្រូវនឹងសំណួរនេះនៅក្នុងតារាងណាមួយខាងក្រោមផែនទី។ គំនូរមិនផ្លាស់ប្ដូរទេ ហើយគ្មានអ្វីត្រូវបានលុបទេ។';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}៖ {n} នៃ {all}';
$ec_lang['lpn_find_filter_summary']='បានត្រងដោយ {q}។ {rows}។';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='សំណួរនេះមិនអនុវត្តចំពោះតារាងណាមួយទេ។';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='មាន';
$ec_lang['lpn_find_op_equals']='ស្មើនឹង';
$ec_lang['lpn_find_op_gt']='ធំជាង';
$ec_lang['lpn_find_op_lt']='តូចជាង';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='ទទេ';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} ត្រូវបានរកឃើញ។ ចុចមួយដើម្បីទៅកាន់វា។';

$ec_lang['lpn_find_none']='គ្មានអ្វីត្រូវគ្នាទេ។';
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
$ec_lang['lpn_find_op_top']='ខ្ពស់បំផុត {n}';
$ec_lang['lpn_find_op_bottom']='ទាបបំផុត {n}';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='វាយអ្វីដែលត្រូវរក។';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='ការតភ្ជាប់';
$ec_lang['lpn_find_prop_demand_desc']='ការពិពណ៌នាអំពីប្រភេទតម្រូវការនេះ';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='គ្មានតំណភ្ជាប់នៅថ្នាំង';
$ec_lang['lpn_find_op_conn_noopen']='គ្មានតំណភ្ជាប់បើកនៅថ្នាំង';
$ec_lang['lpn_find_op_conn_nolinksource']='គ្មានផ្លូវតំណភ្ជាប់ទៅប្រភព';
$ec_lang['lpn_find_op_conn_noopensource']='គ្មានផ្លូវបើកទៅប្រភព';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
$ec_lang['lpn_find_conn_unlinked']='គ្មានតំណភ្ជាប់នៅថ្នាំង';
$ec_lang['lpn_find_conn_noopen']='គ្មានតំណភ្ជាប់បើកនៅថ្នាំង';
$ec_lang['lpn_find_conn_nolinksource']='គ្មានផ្លូវតំណភ្ជាប់ទៅប្រភព';
$ec_lang['lpn_find_conn_noopensource']='គ្មានផ្លូវបើកទៅប្រភព';
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='ថ្នាំងទាំងអស់ត្រូវបានតភ្ជាប់។';
$ec_lang['lpn_find_conn_no_fixed']='បណ្ដាញនេះគ្មានអាងស្តុក ឬធុងទឹកទេ ដូច្នេះគ្មានប្រភពត្រូវទៅដល់ទេ។ អាចស្វែងរកបានតែ គ្មានតំណភ្ជាប់នៅថ្នាំង និង គ្មានតំណភ្ជាប់បើកនៅថ្នាំង ប៉ុណ្ណោះ។';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='ការស្វែងរកដូចគ្នា ដែលសរសេរជាបន្ទាត់តែមួយ។ ការផ្លាស់ប្ដូរប្រដាប់ត្រួតត្រានឹងសរសេរបន្ទាត់នេះឡើងវិញ ហើយការវាយបញ្ចូលក្នុងបន្ទាត់នេះនឹងធ្វើឲ្យប្រដាប់ត្រួតត្រាទាន់សម័យ។';
$ec_lang['lpn_find_query_label']='សំណួរ';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='រួមបញ្ចូលលក្ខខណ្ឌជាមួយ AND, OR និង ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='និង';
$ec_lang['lpn_find_q_or']='ឬ';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='ប្រដាប់ត្រួតត្រាមិនអាចបង្ហាញសំណួរខាងក្រោមបានទេ ដូច្នេះពួកវាត្រូវបានលាក់។';
$ec_lang['lpn_find_q_restore']='ប្រើប្រដាប់ត្រួតត្រាវិញ';
$ec_lang['lpn_replace_q_bad']='សំណួរនេះមិនអាចយល់បានទេ ដូច្នេះគ្មានអ្វីអាចផ្លាស់ប្ដូរបានទេ។ សូមកែវាខាងលើសិន។';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(នៅតួអក្សរ {n})';
$ec_lang['lpn_find_q_err_empty']='សំណួរនេះទទេ ដូច្នេះគ្មានអ្វីនឹងត្រូវបានស្វែងរកទេ។';
$ec_lang['lpn_find_q_err_scope']='គ្មានអ្វីមានឈ្មោះ {w} ត្រូវស្វែងរកទេ។ សូមសាកល្បងមួយក្នុងចំណោម៖ {list}';
$ec_lang['lpn_find_q_err_dot']='ដាក់ចំណុចរវាងអ្វីត្រូវស្វែងរក និងលក្ខណៈសម្បត្តិរបស់វា ដូចជា Junction.ID';
$ec_lang['lpn_find_q_err_prop']='មិនមែនជាលក្ខណៈសម្បត្តិរបស់ {scope} ទេ៖ {w}។ សូមសាកល្បងមួយក្នុងចំណោម៖ {list}';
$ec_lang['lpn_find_q_err_op']='មិនមែនជាលក្ខខណ្ឌសម្រាប់ {prop} ទេ៖ {w}។ សូមសាកល្បងមួយក្នុងចំណោម៖ {list}';
$ec_lang['lpn_find_q_err_value']='លក្ខខណ្ឌនេះត្រូវការតម្លៃមួយបន្ទាប់ពីវា៖ {op}';
$ec_lang['lpn_find_q_err_quote']='ដាក់សញ្ញាសម្រង់ជុំវិញតម្លៃអត្ថបទ៖ {w} មិនមែនជាលេខទេ។';
$ec_lang['lpn_find_q_err_quote_end']='អត្ថបទដែលមានសញ្ញាសម្រង់នេះគ្មានសញ្ញាសម្រង់បិទទេ។';
$ec_lang['lpn_find_q_err_close']='វង់ក្រចក ( នេះត្រូវបានបើក ប៉ុន្តែមិនដែលបិទទេ។';
$ec_lang['lpn_find_q_err_open']='វង់ក្រចក ) នេះមិនបានបិទអ្វីទេ។';
$ec_lang['lpn_find_q_err_end']='គ្មានអ្វីត្រូវរំពឹងទុកបន្ទាប់ពីនេះទេ។ ភ្ជាប់ការស្វែងរកពីរដោយ {and} ឬ {or}។';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='ប្ដូរអ្វីដែលបានរកឃើញ';
$ec_lang['lpn_replace_prop']='លក្ខណៈសម្បត្តិត្រូវប្ដូរ';
$ec_lang['lpn_replace_value']='តម្លៃថ្មី';
$ec_lang['lpn_replace_source']='ប្រភពតម្លៃថ្មី';
$ec_lang['lpn_replace_asked']='បានស្នើសុំកម្ពស់សម្រាប់ថ្នាំង {n}។ លទ្ធផលកំពុងមកដល់។';
$ec_lang['lpn_replace_btn']='ជំនួស';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='ប្ដូរធាតុ {n}?';
$ec_lang['lpn_replace_apply']='ប្ដូរពួកវា';
$ec_lang['lpn_replace_done']='ធាតុ {n} ត្រូវបានប្ដូរ។ អ្នកអាចត្រឡប់ក្រោយសកម្មភាពនេះក្នុងជំហានតែមួយ។';
$ec_lang['lpn_replace_none']='គ្មានអ្វីនឹងផ្លាស់ប្ដូរទេ។';
$ec_lang['lpn_replace_no_value']='វាយបញ្ចូលតម្លៃថ្មី។';
$ec_lang['lpn_replace_scope']='ជ្រើសរើសប្រភេទធាតុមួយខាងលើ ដើម្បីប្ដូរតម្លៃលើវា។';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='ទម្រង់បណ្ដោយ';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_tip']='គូរផ្ទៃដី និងខ្សែថ្ពល់ធារាសាស្ត្រ តាមផ្លូវមួយឆ្លងកាត់បណ្ដាញ។';
$ec_lang['lpn_profile_title']='ទម្រង់បណ្ដោយតាមផ្លូវមួយ';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='ចុចថ្នាំងកន្លែងផ្លូវចាប់ផ្ដើម។';
$ec_lang['lpn_profile_draw_more']='អូសកណ្ដុរលើផែនទីដើម្បីមើលផ្លូវ។ ចុចថ្នាំងមួយដើម្បីបន្ថែមវា។ ចុចទ្វេដងដើម្បីបញ្ចប់។ សូមចុច Esc ដើម្បីលុបចោល។';
$ec_lang['lpn_profile_draw_blocked']='គ្មានផ្លូវពី {a} ទៅ {b} ទេ។ ជ្រើសរើសថ្នាំងផ្សេងទៀត។';
$ec_lang['lpn_profile_tap_start']='ប៉ះថ្នាំងកន្លែងផ្លូវចាប់ផ្ដើម។';
$ec_lang['lpn_profile_tap_more']='ប៉ះថ្នាំងមួយដើម្បីមើលផ្លូវ។ ចុចសង្កត់ឲ្យបានយូរដើម្បីបន្ថែមវា។ ប៉ះទ្វេដងដើម្បីបញ្ចប់។ ចុច ទម្រង់បណ្ដោយ ម្ដងទៀតដើម្បីលុបចោល។';
$ec_lang['lpn_profile_say_idle']='ចុច ទម្រង់បណ្ដោយ ម្ដងទៀត ដើម្បីជ្រើសរើសផ្លូវថ្មីនៅលើផែនទី។';
$ec_lang['lpn_profile_none']='មិនទាន់មានផ្លូវនៅឡើយទេ។ ចុច ទម្រង់បណ្ដោយ ម្ដងទៀត ដើម្បីជ្រើសរើសមួយនៅលើផែនទី។';
$ec_lang['lpn_profile_choose']='ជ្រើសរើសថ្នាំងចាប់ផ្ដើម និងថ្នាំងបញ្ចប់មួយ។';
$ec_lang['lpn_profile_no_path']='ថ្នាំងទាំងពីរនេះមិនត្រូវបានភ្ជាប់ដោយផ្លូវណាមួយទេ។';
$ec_lang['lpn_profile_no_solve']='មិនទាន់មានលទ្ធផលនៅឡើយទេ ដូច្នេះមានតែខ្សែផ្ទៃដីត្រូវបានគូរប៉ុណ្ណោះ។';
$ec_lang['lpn_profile_summary']='ថ្នាំង៖ {n}, ប្រវែង៖ {len} {u}';
$ec_lang['lpn_profile_axis_station']='ចម្ងាយតាមផ្លូវ ({u})';
$ec_lang['lpn_profile_axis_elev']='កម្ពស់ និងថ្ពល់ ({u})';
$ec_lang['lpn_profile_ground']='ផ្ទៃដី';
$ec_lang['lpn_profile_hgl']='ខ្សែថ្ពល់ធារាសាស្ត្រ';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='កែសម្រួល';
$ec_lang['lpn_profile_edit_tip']='ប្ដូរចុងម្ខាងនៃផ្លូវ ឬដកថ្នាំងមួយចេញពីវា ដោយមិនចាំបាច់គូរផ្លូវទាំងមូលឡើងវិញ។';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='អូសចំណុចណាមួយលើផ្លូវដើម្បីផ្លាស់ទីវា។ ចុចលើចំណុចដែលអ្នកបានបន្ថែម ដើម្បីដកវាចេញ។';
$ec_lang['lpn_profile_edit_tap']='អូសចំណុចណាមួយលើផ្លូវដើម្បីផ្លាស់ទីវា។ ប៉ះលើចំណុចដែលអ្នកបានបន្ថែម ដើម្បីដកវាចេញ។';
$ec_lang['lpn_profile_edit_nowhere']='ចំណុចនៅលើផ្លូវត្រូវតែជាថ្នាំងមួយ។ ផ្លូវនៅដដែលមិនផ្លាស់ប្ដូរទេ។';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='ផ្លូវដែលបានរក្សាទុក';
$ec_lang['lpn_profile_new']='ផ្លូវរក្សាទុកថ្មី…';
$ec_lang['lpn_profile_new_name']='ផ្លូវ {n}';
$ec_lang['lpn_profile_rename']='ប្ដូរឈ្មោះផ្លូវ…';
$ec_lang['lpn_profile_delete']='លុបផ្លូវ';
$ec_lang['lpn_profile_prompt_name']='ឈ្មោះសម្រាប់ផ្លូវនេះ';
$ec_lang['lpn_profile_delete_confirm']='លុបផ្លូវដែលបានរក្សាទុក {name} មែនទេ? គំនូរខ្លួនវាមិនត្រូវបានផ្លាស់ប្ដូរទេ។';
$ec_lang['lpn_profile_none_saved']='មិនទាន់មានផ្លូវដែលបានរក្សាទុកនៅឡើយទេ';
$ec_lang['lpn_profile_missing']='ផ្លូវដែលបានរក្សាទុក {name} ប្រើថ្នាំងដែលមិននៅក្នុងគម្រោងនេះ៖ {ids}';
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
$ec_lang['lpn_ts_menu']='ស៊េរីពេលវេលា';
$ec_lang['lpn_ts_tip']='គូរក្រាបធាតុមួយ ឬច្រើនតាមពេលវេលា ពេញការក្លែងធ្វើលើរយៈពេលមួយ។';
$ec_lang['lpn_ts_title']='តម្លៃតាមពេលវេលា';
$ec_lang['lpn_ts_group_tip']='តើក្រាបបង្ហាញថ្នាំង ឬតំណ។';
$ec_lang['lpn_ts_group_nodes']='ថ្នាំង';
$ec_lang['lpn_ts_group_links']='តំណ';
$ec_lang['lpn_ts_quantity_tip']='តម្លៃមួយណាត្រូវគូរតាមពេលវេលា។';
$ec_lang['lpn_ts_add']='បន្ថែមអ្វីបានជ្រើស';
$ec_lang['lpn_ts_add_tip']='ដាក់អ្វីៗគ្រប់យ៉ាងដែលកំពុងជ្រើសរើសនៅលើផែនទីទៅក្រាប។';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='គ្មានធាតុប្រភេទនោះត្រូវបានជ្រើសរើសនៅលើផែនទីទេ។';
$ec_lang['lpn_ts_clear']='លុបទាំងអស់';
$ec_lang['lpn_ts_chip_tip']='ដក {id} ចេញពីក្រាប';
$ec_lang['lpn_ts_none']='មិនទាន់មានអ្វីត្រូវគូរនៅឡើយទេ។ ជ្រើសរើសធាតុនៅលើផែនទី រួចចុច បន្ថែមអ្វីបានជ្រើស។';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='មិនទាន់មានលទ្ធផលការក្លែងធ្វើលើរយៈពេលមួយនៅឡើយទេ។ ចុច ដំណើរការ ដើម្បីធ្វើការក្លែងធ្វើនេះ។';
$ec_lang['lpn_ts_summary']='ធាតុ៖ {n} ពេលវេលារាយការណ៍៖ {steps}';
$ec_lang['lpn_ts_axis_time']='ពេលវេលាកន្លងផុត';
$ec_lang['lpn_view_units']='ខ្នាតវាស់';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='រក្សាទុកទាំងអស់';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='គម្រោង{n}';
$ec_lang['lpn_project_copy_suffix']='(ច្បាប់ចម្លង)';
$ec_lang['lpn_project_rename']='ប្ដូរឈ្មោះ';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='គម្រោងថ្មី…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='គម្រោងថ្មី';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='ប្រព័ន្ធកូអរដោនេ';
$ec_lang['lpn_new_coordsys_tip']='ជ្រើសរើសប្រព័ន្ធកូអរដោនេនៃបណ្ដាញរបស់អ្នក។ វានេះជាអចិន្ត្រៃយ៍ មធ្យោបាយតែមួយគត់ដែលអ្នកអាចបម្លែងបណ្ដាញមួយទៅជាកូអរដោនេផ្សេងគឺដោយប្រើ “ឯកសារ, បើកទៅកូអរដោនេថ្មី” ហើយវាប្រហែលៗប៉ុណ្ណោះ។';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='មូលដ្ឋាន, គំនូសតាង ឬផ្ទាល់ខ្លួន';
$ec_lang['lpn_new_coordsys_local_tip']='មិនមានប្រព័ន្ធតម្រៀបភូមិសាស្ត្រទេ។ ភ្ជាប់រូបភាពផ្ទៃខាងក្រោយផ្ទាល់ខ្លួនរបស់អ្នក ឬគ្មានទាល់តែសោះ។';
// ---- THE COORDINATE SYSTEM BOX -----------------------------------------------------------------
// Tom's summary: it "uses the map view as a UX element to filter the universe of projections to the
// ones applicable to the project (view). Lets the user filter by name and select a projection at
// any time." (His own words, kept verbatim; "projection" in visitor strings became "coordinate
// system" on 2026-09-25 -- don't expose the word "projection".) Two filters over one catalogue, and
// the catalogue itself is not keyed: a coordinate system's NAME is the EPSG register's own, exactly
// as the OpenStreetMap credit is, and a GIS reader in any language looks for those characters.
$ec_lang['lpn_new_crs']='ប្រព័ន្ធតម្រៀបផែនទី';
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25). Shared by the New project box and Convert as, so
// it names the box's own subject rather than either caller's radio label.
$ec_lang['lpn_crsbox_title']='ប្រព័ន្ធកូអរដោនេ';
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='ត្រងតាមទិដ្ឋភាពផែនទី';
$ec_lang['lpn_crs_view_tip']='ផ្ដល់ជូនតែប្រព័ន្ធតម្រៀបដែលគ្របដណ្ដប់កន្លែងដែលផែនទីកំពុងសម្លឹងទៅ។ បិទដើម្បីអានបញ្ជីទាំងមូល។';
$ec_lang['lpn_crs_place']='ស្វែងរកឈ្មោះកន្លែង';
$ec_lang['lpn_crs_place_tip']='វាយបញ្ចូលទីក្រុង អាសយដ្ឋាន ឬចំណុចសម្គាល់មួយ ហើយទិដ្ឋភាពផែនទីនឹងផ្លាស់ទីទៅទីនោះ។ ពាក្យដែលអ្នកវាយបញ្ចូលទៅកាន់សេវាឈ្មោះកន្លែងរបស់ OpenStreetMap ដែលនឹងសុំការអនុញ្ញាតពីអ្នកនៅលើកទីមួយ។ គម្រោងភូមិសាស្ត្រថ្មីមួយក៏ចាប់ផ្ដើមនៅកន្លែងដែលអ្នករកឃើញនៅទីនេះដែរ។';
$ec_lang['lpn_crs_search']='ស្វែងរក';
$ec_lang['lpn_crs_name']='តម្រងឈ្មោះប្រព័ន្ធតម្រៀប';
$ec_lang['lpn_crs_name_tip']='បង្ហាញតែប្រព័ន្ធតម្រៀបដែលឈ្មោះ ឬលេខកូដ EPSG របស់វាមានអ្វីដែលអ្នកវាយបញ្ចូល។ សាកល្បងវាយលេខតំបន់ ឬ UTM ឬ Mercator។';
$ec_lang['lpn_crs_list']='ប្រព័ន្ធតម្រៀប';
$ec_lang['lpn_crs_list_tip']='ប្រព័ន្ធតម្រៀបដែលនៅសល់ពីតម្រងទាំងពីរខាងលើ។ ជ្រើសរើសមួយ រួចចុច ជ្រើសរើស។';
$ec_lang['lpn_crs_choose']='ជ្រើសរើស';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='មិនទាន់មានកន្លែងណាមួយត្រូវបានស្វែងរកនៅឡើយទេ ដូច្នេះបញ្ជីទាំងមូលត្រូវបានផ្ដល់ជូន។ ស្វែងរកកន្លែងមួយខាងលើ ឬពង្រីកផែនទីដើម្បីបង្រួមបញ្ជី។';
$ec_lang['lpn_crs_count']='ប្រព័ន្ធតម្រៀប {n} ក្នុងចំណោម {total} ត្រូវបានរាយ។';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} នៃប្រព័ន្ធកូអរដោនេ {total} គ្របដណ្ដប់លើបណ្ដាញនេះ។';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(គ្មានផែនទី)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} គឺជាមួយក្នុងចំណោមប្រព័ន្ធកូអរដោនេមួយចំនួនតូចដែលរាយក្នុងបញ្ជី ដោយគ្មានព័ត៌មានប្រែក្លាយដែលអាចប្រើបាន។ នេះមានន័យថា ផែនទីពិភពលោក ការស្វែងរកឈ្មោះកន្លែង និងកម្ពស់ DEM មិនដំណើរការទេ។ កូអរដោនេរបស់អ្នកមិនរងផលប៉ះពាល់ទេ។';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='គ្មានឈ្មោះ';
$ec_lang['lpn_crs_none']='មិនមានប្រព័ន្ធតម្រៀបភូមិសាស្ត្រ';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='គម្រោងមួយរក្សាទុកឯកតារបស់ខ្លួន ដូច្នេះជម្រើសនេះជារបស់គម្រោងនេះតែម្នាក់ឯង ហើយគ្មានអ្វីនៅទីនេះត្រូវបានរក្សាទុកជាការកំណត់កម្មវិធីរុករកទេ។ ដើម្បីចាប់ផ្ដើមគម្រោងថ្មីតាមរបៀបជាក់លាក់មួយ សូមរក្សាទុកគម្រោងទទេមួយជាគំរូរបស់អ្នក ហើយចម្លងវារាល់ពេល។';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='សៀមរាប, កម្ពុជា';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='បង្កើត';
$ec_lang['lpn_file_open']='បើក…';
$ec_lang['lpn_file_save']='រក្សាទុក';
$ec_lang['lpn_file_saveas']='រក្សាទុកជា…';
$ec_lang['lpn_file_revert']='ត្រឡប់មកវិញ';
$ec_lang['lpn_file_close']='បិទ';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='ឯកសារថ្មីៗ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='បើក {file} ម្ដងទៀត ដោយមិនចាំបាច់ស្វែងរកវានៅក្នុងកុំព្យូទ័ររបស់អ្នក។';
$ec_lang['lpn_recent_denied']='សិទ្ធិបើកឯកសារនោះមិនត្រូវបានផ្ដល់ឲ្យទេ ដូច្នេះវាមិនត្រូវបានបើកទេ។';
$ec_lang['lpn_recent_gone']='មិនអាចបើក {file} បានទេ។ វាប្រហែលជាត្រូវបានផ្លាស់ទី ប្ដូរឈ្មោះ ឬលុប ដូច្នេះវាត្រូវបានដកចេញពីបញ្ជីឯកសារថ្មីៗ។';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='គម្រោងថ្មី';
$ec_lang['lpn_tab_all']='គម្រោងទាំងអស់';
$ec_lang['lpn_tab_menu']='ម៉ឺនុយគម្រោង';
$ec_lang['lpn_tab_duplicate']='ចម្លង';
$ec_lang['lpn_tab_move_left']='ផ្លាស់ទីទៅឆ្វេង';
$ec_lang['lpn_tab_move_right']='ផ្លាស់ទីទៅស្ដាំ';
$ec_lang['lpn_tab_unsaved']='មិនទាន់រក្សាទុកទៅឯកសារ';
$ec_lang['lpn_import_bad_file']='ឯកសារនោះមិនអាចអានជាគម្រោងដែលរក្សាទុកពីទំព័រនេះបានទេ។';
$ec_lang['lpn_import_no_room']='ទំហំផ្ទុករបស់កម្មវិធីរុករកមិនគ្រប់គ្រាន់ដើម្បីបន្ថែមគម្រោងនេះទេ។ សូមលុបគម្រោងដែលអ្នកលែងត្រូវការ រួចសាកល្បងម្ដងទៀត។';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='យល់ព្រម';
$ec_lang['lpn_file_import_inp']='នាំចូលឯកសារ EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='អានបណ្ដាញចេញពីឯកសារ EPANET ទាំងឯកសារអត្ថបទ .inp ឬឯកសារ .net ដែល EPANET រក្សាទុក រួចរក្សាទុកវានៅក្នុងកម្មវិធីរុករកនេះជាគម្រោងថ្មី។';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='នាំចេញឯកសារ EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='សរសេរបណ្ដាញនេះជាឯកសារ EPANET .inp មួយ ហើយទាញយកវា។ លេខដែលអ្នកបានវាយ ត្រូវបានសរសេរឲ្យដូចអ្វីដែលអ្នកបានវាយបេះបិទ។ អ្វីៗដែលទម្រង់ .inp មិនអាចផ្ទុកបាន ត្រូវបានរាយឲ្យអ្នកឃើញនៅពេលក្រោយ។';
$ec_lang['lpn_status_inp_exported']='បាននាំចេញ {file}។';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} រឿងដែលទម្រង់ .inp មិនអាចផ្ទុកបាន។';
$ec_lang['lpn_inp_export_refused']='គម្រោងនេះមិនអាចសរសេរជាឯកសារ EPANET បានទេ៖ {detail}';
$ec_lang['lpn_inp_bad_file']='ឯកសារនោះមិនអាចអានជាឯកសារបណ្ដាញ EPANET បានទេ។';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='នេះមើលទៅដូចជាឯកសារ .net របស់ EPANET ប៉ុន្តែទំព័រនេះមិនអាចអានវាបានទេ។ សូមបើកវានៅក្នុង EPANET ហើយប្រើពាក្យបញ្ជាឯកសារ, នាំចេញ, បណ្ដាញ នៅទីនោះ ដើម្បីរក្សាទុកជាឯកសារ .inp រួចនាំចូលឯកសារនោះ។';
$ec_lang['lpn_inp_report_heading']='បាននាំចូល {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} ថ្នាំង អាងស្តុក និងធុងទឹក, {links} បំពង់ ម៉ាស៊ីនបូម និងវ៉ាល់, គិតជា {units}។';
$ec_lang['lpn_inp_report_clean']='អ្វីៗគ្រប់យ៉ាងក្នុងឯកសារត្រូវបាននាំចូលគ្រប់ជ្រុងជ្រោយ។ គ្មានអ្វីត្រូវបានលុបចោលឡើយ។';
$ec_lang['lpn_inp_report_label_anchor']='ស្លាកអត្ថបទត្រូវបានដាក់តាមរបៀបដែល EPANET ដាក់ពួកវា គិតចាប់ពីជ្រុងខាងលើឆ្វេងរបស់វា។';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='ឯកសារ EPANET មិនមានប្រព័ន្ធកូអរដោនេទេ ដូច្នេះឯកសារនេះនឹងមិនត្រូវបានតម្រៀបភូមិសាស្ត្រតាំងពីដំបូងទេ។ ដើម្បីដាក់វានៅលើផែនទីពិភពលោក សូមប្រើ ផែនទី, ផែនទីពិភពលោក… ដើម្បីបម្លែងកូអរដោនេរបស់វា សូមប្រើ ឯកសារ, បម្លែងជា…';
$ec_lang['lpn_inp_report_lead']='ទំព័រនេះមិនប្រើអ្វីៗគ្រប់យ៉ាងដូច EPANET ធ្វើទេ ប៉ុន្តែគ្មានអ្វីនៅក្នុងឯកសាររបស់អ្នកត្រូវបានបោះបង់ចោលទេ។ ខាងក្រោមនេះជាអ្វីដែលឯកសាររបស់អ្នកផ្ទុក ដែលទំព័រនេះរក្សាទុកដោយមិនប្រើ និងអ្វីដែលបានផ្លាស់ប្ដូរនៅពេលឯកសារនោះត្រូវបានអាន៖';
$ec_lang['lpn_inp_drop_headloss']='ឯកសារនេះមិនប្រើរូបមន្ត Hazen-Williams ទេ។ ទំព័រនេះគណនាតាម Hazen-Williams ដូច្នេះលេខភាពរដិបរដុបបំពង់ត្រូវបានរក្សាទុកដូចដែលបានសរសេរជាក់លាក់ ប៉ុន្តែចម្លើយនៅទីនេះនឹងមិនត្រូវនឹងចម្លើយក្នុង EPANET ទេ។';
$ec_lang['lpn_inp_drop_tank_curve']='ធុងទឹកទាំងនេះមិនមានជញ្ជាំងត្រង់ទេ៖ ឯកសារផ្ដល់រូបរាងរបស់វាជាខ្សែកោង។ ខ្សែកោងនេះត្រូវបានរក្សាទុកនៅក្នុងប្រអប់ បណ្ណាល័យ ធុងទឹកនៅតែសំដៅទៅវា ហើយការក្លែងធ្វើលើរយៈពេលមួយបំពេញ និងបង្ហូរធុងទឹកតាមកាលវិភាគដែលខ្សែកោងនោះផ្ដល់។ ភ្លែតតែមួយផ្ដល់ចម្លើយដូចគ្នា ព្រោះផ្ទៃទឹកគឺជាកម្រិតដែលឯកសារកំណត់។ អង្កត់ផ្ចិតដែលសរសេរនៅក្នុងឯកសារត្រូវបានរក្សាទុកនៅជាប់ខ្សែកោង ហើយវាជាអ្វីដែលធុងទឹកគ្មានខ្សែកោងត្រូវបានគូរ និងដោះស្រាយជាមួយ។';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='វ៉ាល់ត្រួតពិនិត្យរបាំងលំហូរទាំងនេះចូលមកជាវ៉ាល់ត្រួតពិនិត្យរបាំងលំហូរ ដោយផ្ទុកការបាត់បង់ដូចដែលឯកសារបានផ្ដល់។ ឧបករណ៍ដោះស្រាយណាមួយអាចគណនាវាបាន។';
$ec_lang['lpn_inp_drop_valve_active']='វ៉ាល់ទាំងនេះត្រួតពិនិត្យសម្ពាធ ឬលំហូរ ហើយបើក និងបិទដោយខ្លួនឯងតាមការផ្លាស់ប្ដូរទឹក។ គ្មានអ្វីអំពីវាត្រូវបាត់បង់ក្នុងពេលនាំចូលឡើយ ហើយទំព័រនេះដោះស្រាយវាដោយប្រើឧបករណ៍ដោះស្រាយ EPANET ដោយបើកឧបករណ៍ដោះស្រាយនោះដោយខ្លួនឯងសម្រាប់បណ្ដាញនេះ។';
$ec_lang['lpn_inp_drop_valve']='វ៉ាល់ទាំងនេះត្រូវបានពិពណ៌នាដោយខ្សែកោង ឬដោយការធ្លាក់ចុះសម្ពាធថេរមួយ ហើយទំព័រនេះគ្មានធាតុបែបនេះទេ។ វាចូលមកជាបំពង់បើក ដូច្នេះបណ្ដាញនៅតែភ្ជាប់គ្នា ប៉ុន្តែគ្មានអ្វីកាន់សម្ពាធ ឬលំហូរនៅទីនោះទៀតទេ។';
$ec_lang['lpn_inp_drop_cv']='នៅក្នុង EPANET បំពង់ទាំងនេះអនុញ្ញាតឲ្យទឹកហូរតែទិសមួយប៉ុណ្ណោះ។ វាចូលមកជាបំពង់ធម្មតា ដូច្នេះទឹកអាចហូរបានទាំងពីរទិសឥឡូវនេះ។';
$ec_lang['lpn_inp_drop_demands']='ថ្នាំងទាំងនេះមានតម្រូវការច្រើនជាងមួយ។ តម្រូវការត្រូវបានបូកបញ្ចូលគ្នាទៅជាតម្រូវការតែមួយដែលទំព័រនេះផ្ទុក។';
$ec_lang['lpn_inp_drop_patterns']='ទំព័រនេះមិនបានអានលំនាំតម្រូវការទេ ព្រោះផ្នែកនៃវាដែលដំណើរការការក្លែងធ្វើលើរយៈពេលមួយ មិនបានផ្ទុកឡើយ។ តម្រូវការនីមួយៗគឺជាលេខដែលសរសេរនៅក្នុងឯកសារ។';
$ec_lang['lpn_inp_drop_demand_pattern']='ថ្នាំងទាំងនេះផ្លាស់ប្ដូរតម្រូវការរបស់ពួកវាពេញការដំណើរការ។ លំនាំរបស់ពួកវាចូលមកទាំងស្រុង ហើយតម្រូវការដែលអ្នកឃើញ គឺជាតម្លៃសម្រាប់ភ្លែតដែលនាឡិកាកំពុងបង្ហាញ។';
$ec_lang['lpn_inp_drop_emitters']='ថ្នាំងទាំងនេះមានមេគុណលិចទឹក ឬកន្លែងលេច។ វាត្រូវបានរក្សាទុក និងកំពុងត្រូវបានដោះស្រាយ ប៉ុន្តែនៅឡើយគ្មានកន្លែងនៅលើទំព័រនេះដើម្បីមើល ឬផ្លាស់ប្ដូរវាទេ។';
$ec_lang['lpn_inp_drop_curve_long']='ខ្សែកោងម៉ាស៊ីនបូមនេះមានចំណុចច្រើនជាងបី។ ចំណុចទាបបំផុត កណ្ដាល និងខ្ពស់បំផុតត្រូវបានរក្សាទុក ព្រោះទំព័រនេះសម្របខ្សែកោងទៅនឹងចំណុចបីជាអតិបរមា។';
$ec_lang['lpn_inp_drop_curve_missing']='ម៉ាស៊ីនបូមនេះសំដៅទៅខ្សែកោងមួយដែលមិននៅក្នុងឯកសារទេ។ ម៉ាស៊ីនបូមចូលមកដោយគ្មានខ្សែកោង ដូច្នេះវាមិនបន្ថែមថ្ពល់ទេ។';
$ec_lang['lpn_inp_drop_pump_other']='ម៉ាស៊ីនបូមនេះត្រូវបានពិពណ៌នាតាមកម្លាំងដែលវាទាញ ជាជាងតាមខ្សែកោង។ វាចូលមកដោយគ្មានខ្សែកោង ដូច្នេះវាមិនបន្ថែមថ្ពល់ទេ។';
$ec_lang['lpn_inp_drop_head_pattern']='អាងស្តុកទាំងនេះឡើង និងចុះកម្រិតទឹកពេញការដំណើរការ។ លំនាំរបស់ពួកវាបានចូលមកគ្រប់ជ្រុងជ្រោយ ហើយកម្រិតទឹកដែលអ្នកឃើញ គឺជាកម្រិតសម្រាប់ភ្លែតដែលនាឡិកាកំពុងបង្ហាញ។';
$ec_lang['lpn_inp_drop_pump_speed']='ម៉ាស៊ីនបូមទាំងនេះដំណើរការក្នុងល្បឿនផ្សេងពីល្បឿនដែលខ្សែកោងរបស់វាត្រូវបានវាស់ ឬប្ដូរល្បឿនពេញការដំណើរការ។ ល្បឿន និងលំនាំរបស់វាបានចូលមកគ្រប់ជ្រុងជ្រោយ ហើយថ្ពល់ដែលអ្នកឃើញ គឺជាតម្លៃសម្រាប់ភ្លែតដែលនាឡិកាកំពុងបង្ហាញ។';
$ec_lang['lpn_inp_drop_setting']='បំពង់ ម៉ាស៊ីនបូម និងវ៉ាល់ទាំងនេះមានការកំណត់ដែលទំព័រនេះមិនអាចផ្ទុកបានទេ។ វាចូលមកជាបើក។';
$ec_lang['lpn_inp_drop_rules']='ឯកសារនេះមានការត្រួតពិនិត្យតាមក្បួន។ ទំព័រនេះអានពួកវា ហើយប្រើពួកវា។ ដំណើរការគំរូជាមួយឧបករណ៍ដោះស្រាយ EPANET ហើយក្បួនត្រូវបានអនុវត្ត ដោយកម្រិតទឹក សម្ពាធ និងលំហូរគ្រប់តម្លៃនៅក្នុងវា ត្រូវបានប្ដូរទៅឯកតាដែលគម្រោងនេះកំពុងបង្ហាញ។ បើក ក្បួន នៅក្រោម បណ្ណាល័យ ដើម្បីអាន ឬប្ដូរក្បួនមួយ។ ពួកវាត្រូវបានរក្សាទុកយ៉ាងពិតប្រាកដតាមអ្វីដែលឯកសារកំណត់ ហើយត្រូវបានសរសេរត្រឡប់វិញ ប្រសិនបើអ្នករក្សាទុកជាឯកសារ EPANET។';
$ec_lang['lpn_inp_drop_eps']='ឯកសារនេះពិពណ៌នាការក្លែងធ្វើដែលដំណើរការលើរយៈពេលមួយ។ ផ្នែកនៃទំព័រនេះដែលដំណើរការការក្លែងធ្វើលើរយៈពេលមួយ មិនបានផ្ទុកឡើយ ដូច្នេះមានតែលក្ខខណ្ឌចាប់ផ្ដើមប៉ុណ្ណោះដែលចូលមក។';
$ec_lang['lpn_inp_drop_quality']='ឯកសារនេះពិពណ៌នាពីរបៀបដែលគុណភាពទឹកផ្លាស់ប្ដូរនៅពេលវាធ្វើដំណើរ៖ អ្វីមាននៅក្នុងទឹកតាំងពីដើម និងល្បឿនដែលសារធាតុនោះប្រតិកម្មនៅក្នុងបំពង់ និងក្នុងធុងទឹក។ ទំព័រនេះអានលេខទាំងនោះ ហើយប្រើវា។ ជ្រើសរើសសារធាតុគីមីមួយនៅក្រោម ការកំណត់, ការគណនា, គុណភាពទឹក រួចដំណើរការគំរូជាមួយឧបករណ៍ដោះស្រាយ EPANET ហើយកំហាប់ត្រូវបានគណនាតាមបណ្ដាញនៅពេលការដំណើរការបន្ត។ បន្ទាត់ទាំងនោះត្រូវបានរក្សាទុក ហើយត្រូវបានសរសេរត្រឡប់វិញ ប្រសិនបើអ្នករក្សាទុកជាឯកសារ EPANET។';
$ec_lang['lpn_inp_drop_sources_mixing']='ឯកសារនេះប្រាប់ថាសារធាតុគីមីមួយត្រូវបានចាក់បញ្ចូលនៅកន្លែងណានៅក្នុងបណ្ដាញ និងរបៀបដែលទឹកនៅក្នុងធុងទឹកលាយបញ្ចូលគ្នា។ កម្រិតដូសបង្ហាញនៅលើថ្នាំងដែលវាត្រូវបានបន្ថែម ហើយធុងទឹកនីមួយៗប្រាប់ថាតើវាធ្វើតាមគំរូការលាយមួយណា។ ទាំងកម្រិតដូស និងគំរូការលាយ ត្រូវបានគណនាដោយឧបករណ៍ដោះស្រាយ EPANET តែប៉ុណ្ណោះ។';
$ec_lang['lpn_inp_drop_energy']='ឯកសារ EPANET នេះមានទិន្នន័យគំរូចំណាយថាមពលបូម។ ទំព័រនេះអាន ហើយប្រើវា។ ដំណើរការគំរូជាមួយឧបករណ៍ដោះស្រាយ EPANET រួចបើក ទឹក, របាយការណ៍, ថាមពលបូម ដើម្បីមើលថាតើម៉ាស៊ីនបូមនីមួយៗដំណើរការប៉ុន្មាន វាទាញថាមពលប៉ុន្មាន វាប្រើថាមពលប៉ុន្មាន និងវាចំណាយប៉ុន្មាន។ បន្ទាត់ទាំងនោះត្រូវបានរក្សាទុក ហើយត្រូវបានសរសេរត្រឡប់វិញ ប្រសិនបើអ្នករក្សាទុកជាឯកសារ EPANET។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='ឯកសារនេះដាក់ស្លាកសម្គាល់ទៅថ្នាំង បំពង់ ឬធាតុផ្សេងទៀតរបស់វាមួយចំនួន។ ស្លាកសម្គាល់នីមួយៗចូលមកទាំងស្រុង ហើយនីមួយៗនៅក្នុងលក្ខណៈសម្បត្តិផ្ទាល់ខ្លួនរបស់ធាតុនោះ ដែលអ្នកអាចអាន ឬប្ដូរវានៅទីនោះ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='ឯកសារនេះផ្ទុកការកំណត់ផ្ទាល់ខ្លួនរបស់ EPANET សម្រាប់របៀបដែលវាធ្វើទ្រង់ទ្រាយរបាយការណ៍ដែលវាបោះពុម្ព។ អ្នកអាចអានរបាយការណ៍របស់ឧបករណ៍ដោះស្រាយនៅទីនេះ ក្រោម របាយការណ៍, ការដំណើរការ EPANET ប៉ុន្តែវាចេញមកតាមទ្រង់ទ្រាយស្ដង់ដាររបស់ឧបករណ៍ ជំនួសឲ្យទ្រង់ទ្រាយដែលការកំណត់ទាំងនេះស្នើសុំ។ បន្ទាត់ទាំងនោះត្រូវបានរក្សាទុក ហើយត្រូវបានសរសេរត្រឡប់វិញ ប្រសិនបើអ្នករក្សាទុកជាឯកសារ EPANET។';
$ec_lang['lpn_inp_drop_sections']='ឯកសារនេះផ្ទុកផ្នែកមួយដែលទំព័រនេះមិនអានទាល់តែសោះ។ គ្មានអ្វីនៅទីនេះប្រើវាទេ។ វាត្រូវបានរក្សាទុកទាំងស្រុង ហើយត្រូវបានសរសេរត្រឡប់វិញ ប្រសិនបើអ្នករក្សាទុកជាឯកសារ EPANET។';
$ec_lang['lpn_inp_drop_quality_options']='ឯកសារនេះចែងជម្រើសគុណភាពទឹករបស់ EPANET៖ Quality ដែលកំណត់ប្រភេទនៃការវិភាគគុណភាពទឹក និងការកំណត់ពីរដែលទាក់ទងនឹងសារធាតុគីមី គឺ Relative diffusivity និង Quality tolerance។ ទាំងបីត្រូវបានរក្សាទុក ហើយទាំងបីត្រូវបានប្រើ។ អាយុទឹក ការតាមដានប្រភព និងសារធាតុគីមីមួយ ត្រូវបានគណនានៅទីនេះម្នាក់ៗ ហើយការកំណត់សារធាតុគីមីទាំងពីរត្រូវបានប្រគល់ទៅឧបករណ៍ដោះស្រាយ EPANET នៅពេលអ្នកដំណើរការសារធាតុគីមីមួយ។ ទាំងអស់នេះត្រូវបានសរសេរត្រឡប់វិញ ប្រសិនបើអ្នករក្សាទុកជាឯកសារ EPANET។';
$ec_lang['lpn_inp_drop_file_options']='ឯកសារនេះយោងទៅឯកសារជំនួយមួយ៖ Map ដែលផ្ទុកកូអរដោនេ ឬ Hydraulics ដែលផ្ទុកលទ្ធផលធារាសាស្ត្រដែលបានគណនារួច។ ទំព័រនេះមិនអាចបើកឯកសារទាំងពីរប្រភេទនេះទេ ដូច្នេះបន្ទាត់ទាំងនោះត្រូវបានរក្សាទុកដដែល ហើយត្រូវបានសរសេរត្រឡប់វិញ ប្រសិនបើអ្នករក្សាទុកជាឯកសារ EPANET។';
$ec_lang['lpn_inp_drop_demand_model']='ឯកសារនេះស្នើសុំការវិភាគជំរុញដោយសម្ពាធ (PDA) ដែលក្នុងនោះថ្នាំងមួយទទួលបានតិចជាងតម្រូវការរបស់វា នៅពេលសម្ពាធនៅទីនោះទាប។ ទំព័រនេះដោះស្រាយបែបជំរុញដោយតម្រូវការ ដូច្នេះថ្នាំងគ្រប់ដែលនៅទីនេះទទួលបានតម្រូវការដែលឯកសារចែង មិនថាលទ្ធផលសម្ពាធជាអ្វីនោះទេ។ បន្ទាត់នេះត្រូវបានរក្សាទុក ហើយត្រូវបានសរសេរត្រឡប់វិញ ប្រសិនបើអ្នករក្សាទុកជាឯកសារ EPANET។';
$ec_lang['lpn_inp_drop_other_options']='ឯកសារនេះចែងជម្រើសដែលទំព័រនេះមិនអានទេ។ គ្មានអ្វីនៅទីនេះប្រើវាទេ។ ពួកវាត្រូវបានរក្សាទុក ហើយត្រូវបានសរសេរត្រឡប់វិញ ប្រសិនបើអ្នករក្សាទុកជាឯកសារ EPANET។';
$ec_lang['lpn_inp_drop_net_options']='ឯកសារ .net EPANET នេះចែងការកំណត់ដែលទំព័រនេះគ្មានប្រដាប់ត្រួតត្រា ដូច្នេះតម្លៃរបស់ពួកវាត្រូវបានរាយនៅទីនេះជាជាងត្រូវបានយកមកប្រើ។ អ្វីៗផ្សេងទៀតបានចូលមកទាំងអស់។ ប្រសិនបើអ្នកត្រូវការពួកវា សូមបើកឯកសារនោះនៅក្នុង EPANET ហើយប្រើ File, Export, Network ដើម្បីរក្សាទុកជាឯកសារ .inp រួចនាំចូលឯកសារនោះវិញ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='នេះជាឯកសារ .net របស់ EPANET។ នោះជាឯកសារគម្រោងផ្ទាល់ខ្លួនរបស់ EPANET ដែលគ្មានការពិពណ៌នាបោះពុម្ពផ្សាយ ហើយទំព័រនេះអានវាដោយស្វែងយល់ទម្រង់ចេញពីឯកសារគំរូ ដូច្នេះប្រើវាតែពេលអ្នកគ្មានជម្រើសអ្វីផ្សេងទៀត មិនមែនជាផ្លូវដែលអាចទុកចិត្តបានទេ។ ឯកសារ .inp គឺជាទម្រង់ដែលមានឯកសារពិពណ៌នា ហើយកម្មវិធីផ្សេងទៀតគ្រប់មួយអានបាន៖ នៅក្នុង EPANET ប្រើ File, Export, Network ដើម្បីសរសេរមួយ ហើយនាំចូលវាជំនួសវិញនៅពេលណាដែលអ្នកអាចធ្វើបាន។';
$ec_lang['lpn_inp_drop_backdrop']='ឯកសារនេះហៅឈ្មោះរូបភាពផ្ទៃខាងក្រោយមួយ ប៉ុន្តែមិនផ្ទុករូបភាពនោះខ្លួនឯងទេ។ សូមបន្ថែមវាដោយខ្លួនអ្នកតាមរយៈ ឯកសារ, រូបភាពផ្ទៃខាងក្រោយ, បន្ថែមរូបភាព។';
$ec_lang['lpn_inp_drop_dangling']='បំពង់ទាំងនេះហៅឈ្មោះថ្នាំងមួយដែលមិននៅក្នុងឯកសារ ដូច្នេះវាត្រូវបានលុបចោល។';
$ec_lang['lpn_inp_drop_units']='ខ្នាតវាស់លំហូរដែលមានឈ្មោះនៅក្នុងឯកសារនេះ មិនមែនជាខ្នាតដែលទំព័រនេះស្គាល់ទេ ដូច្នេះលេខទាំងអស់ត្រូវបានអានជាហ្គាឡុងក្នុងមួយនាទី។ សូមពិនិត្យលេខគ្រប់ចំនួន មុននឹងប្រើចម្លើយទាំងនោះ។';
$ec_lang['lpn_inp_drop_anchor_missing']='អត្ថបទនេះត្រូវបានភ្ជាប់ទៅថ្នាំង អាងស្តុក ឬធុងទឹកមួយ ដែលមិននៅក្នុងឯកសារនេះទេ។ វាបានចូលមកជាអត្ថបទសេរីនៅកន្លែងដែលឯកសារដាក់វា ហើយវាមិនតាមអ្វីទាំងអស់ទៀតទេឥឡូវនេះ។';
$ec_lang['lpn_import_notes_heading']='គម្រោងនេះត្រូវបានអានចេញពីឯកសារ EPANET។ អ្វីមួយចំនួនដែលឯកសារនោះផ្ទុក ត្រូវបានរក្សាទុក ប៉ុន្តែមិនត្រូវបានប្រើនៅលើទំព័រនេះទេ។';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='បានបើក {name} ពីឯកសារមួយ ហើយបានបន្ថែមវាទៅកម្មវិធីរុករកនេះជាគម្រោងថ្មី។';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='ឯកសារគម្រោង';
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
$ec_lang['lpn_file_upload_explain']='កម្មវិធីរុករកនេះមិនអាចភ្ជាប់ទៅឯកសារបានទេ ដូច្នេះការបើកឯកសារនៅទីនេះគឺជាការផ្ទុកឡើងជាក់ស្ដែង៖ គម្រោងត្រូវបានចម្លងចូលទៅកម្មវិធីរុករកនេះ ហើយមធ្យោបាយតែមួយគត់ដើម្បីរក្សាទុកការងាររបស់អ្នកត្រឡប់ទៅឯកសារវិញគឺសរសេរជាន់ពីលើឯកសារនោះដោយប្រើ ឯកសារ, រក្សាទុកជា។';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='បើកឯកសារគម្រោងដែលបានរក្សាទុកពីទំព័រនេះ។';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='រក្សាទុកទៅឯកសារដែលបានភ្ជាប់។';
$ec_lang['lpn_file_saveas_tip']='ជ្រើសរើសឯកសារមួយដើម្បីរក្សាទុក។ គម្រោងនេះភ្ជាប់ទៅឯកសារនោះ ហើយរក្សាទុកនឹងសរសេរទៅវាចាប់ពីពេលនោះតទៅ។';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='រក្សាទុកដោយប្រើការកំណត់ទាញយករបស់កម្មវិធីរុករករបស់អ្នក។ កម្មវិធីរុករកនេះមិនអាចភ្ជាប់ទៅឯកសារបានទេ ដូច្នេះរក្សាទុកត្រូវបានបិទ ហើយមានតែរក្សាទុកជាទេដែលអាចប្រើបាន។ បើអ្នកបើកការកំណត់កម្មវិធីរុករក "សួរកន្លែងរក្សាទុកសម្រាប់ឯកសារនីមួយៗ" អ្នកអាចជ្រើសរើសឯកសារដើម ហើយសរសេរជាន់ពីលើវា។';
$ec_lang['lpn_status_uploaded']='ឯកសារគម្រោងត្រូវបានផ្ទុកឡើង។ គ្មានការភ្ជាប់ណាមួយអាចរក្សាបានទេ ដូច្នេះមធ្យោបាយតែមួយគត់ដើម្បីរក្សាទុកត្រឡប់ទៅវាវិញគឺដោយប្រើ ឯកសារ, រក្សាទុកជា។';
$ec_lang['lpn_status_downloaded']='បានទាញយក {file}។ កម្មវិធីរុករកនេះមិនអាចភ្ជាប់ទៅឯកសារបានទេ ដូច្នេះគម្រោងនេះនៅតែសម្គាល់ថាមិនទាន់រក្សាទុកទៅឯកសារ។';
$ec_lang['lpn_status_file_opened']='បានបើក {file}។';
$ec_lang['lpn_status_already_open']='ឯកសារនោះកំពុងបើកនៅទីនេះជា {name} រួចហើយ ដូច្នេះនេះបានប្ដូរទៅវាជាជាងបើកច្បាប់ចម្លងទីពីរ។';
$ec_lang['lpn_status_already_open_dirty']='ឯកសារនោះកំពុងបើកនៅទីនេះជា {name} រួចហើយ ជាមួយការផ្លាស់ប្ដូរដែលអ្នកមិនទាន់រក្សាទុកទៅវា។ នេះបានប្ដូរទៅវាជាជាងបើកច្បាប់ចម្លងទីពីរ។ ប្រើ ឯកសារ, ត្រឡប់មកវិញ បើអ្នកចង់បានកំណែនៅលើថាសវិញ។';
$ec_lang['lpn_status_saved']='បានរក្សាទុក {file}។';
$ec_lang['lpn_status_reverted']='បានផ្ទុក {file} ម្ដងទៀតពីថាស។';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='រក្សាទុកការផ្លាស់ប្ដូររបស់អ្នកទៅ {name} មុននឹងបិទវាទេ?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} ត្រូវបានរក្សាទុកនៅក្នុងកម្មវិធីរុករកនេះតែប៉ុណ្ណោះ។ បើអ្នកបិទវាដោយមិនរក្សាទុកទៅឯកសារមួយ វានឹងបាត់អស់កល្បជានិច្ច។';
$ec_lang['lpn_close_discard']='បិទដោយមិនរក្សាទុក';
$ec_lang['lpn_cancel']='បោះបង់';
$ec_lang['lpn_revert_confirm']='បោះបង់ការផ្លាស់ប្ដូរដែលអ្នកបានធ្វើ ហើយផ្ទុក {file} ម្ដងទៀតពីថាសមែនទេ?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='គម្រោងនេះមកពី {file} ប៉ុន្តែការភ្ជាប់ទៅឯកសារនោះបានបាត់ទៅហើយ។ សូមជ្រើសរើសឯកសារនោះម្ដងទៀត ដើម្បីភ្ជាប់ទៅវា។';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='មិនអាចសរសេរទៅឯកសារបានទេ។ វាប្រហែលជាត្រូវបានផ្លាស់ទី ប្ដូរឈ្មោះ ឬសិទ្ធិត្រូវបានដកហូតវិញ។ ការងាររបស់អ្នកនៅតែត្រូវបានរក្សាទុកនៅក្នុងកម្មវិធីរុករកនេះ។';
$ec_lang['lpn_file_changed_elsewhere']='មានគេផ្សេងទៀតបានរក្សាទុកទៅឯកសារនេះចាប់តាំងពីអ្នកបានបើកវា ដូច្នេះការរក្សាទុកឥឡូវនេះនឹងសរសេរជាន់ពីលើការងាររបស់ពួកគេ។ ប្រើ ឯកសារ, រក្សាទុកជា ដើម្បីរក្សាការផ្លាស់ប្ដូររបស់អ្នកនៅក្នុងឯកសារផ្ទាល់ខ្លួន ឬ ឯកសារ, ត្រឡប់មកវិញ ដើម្បីបោះបង់ការផ្លាស់ប្ដូររបស់អ្នក ហើយផ្ទុករបស់ពួកគេវិញ។';
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
$ec_lang['lpn_lock_somebody']='អ្នកណាម្នាក់ផ្សេងទៀត';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} កំពុងបើកឯកសារនេះ។';
$ec_lang['lpn_lock_open_readonly']='បើកបានតែអានប៉ុណ្ណោះ';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='បំបែកសោរបស់ពួកគេ';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='ឯកសារនេះហាក់ដូចជាកំពុងប្រើ។';
$ec_lang['lpn_lock_open_care']='ដើម្បីជៀសវាងការបាត់បង់ទិន្នន័យ សូមជ្រើសរើសដោយប្រុងប្រយ័ត្នពីជម្រើសខាងក្រោម។';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='វាត្រូវបានប្រើអស់រយៈពេល {x}។';
$ec_lang['lpn_lock_age_edited']='វាត្រូវបានកែសម្រួលចុងក្រោយ {x} មុន។';
$ec_lang['lpn_lock_age_saved']='វាត្រូវបានរក្សាទុកចុងក្រោយ {x} មុន។';
$ec_lang['lpn_lock_age_never_saved']='គ្មានអ្វីត្រូវបានរក្សាទុកទៅឯកសារនេះនៅឡើយទេ។';
$ec_lang['lpn_lock_age_unknown']='គ្មានកំណត់ត្រាអំពីរយៈពេលដែលវាត្រូវបានប្រើ ឬពេលដែលវាត្រូវបានរក្សាទុក ឬកែសម្រួលចុងក្រោយឡើយ។';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"សួរ" ប្រាប់អ្នកណាដែលកំពុងបើកឯកសារនេះថាអ្នកចង់បានវា ហើយមិនផ្លាស់ប្ដូរអ្វីផ្សេងទៀតទេ។ "បើកបានតែអាន" អនុញ្ញាតឲ្យអ្នកមើលវា និងផ្លាស់ប្ដូរអ្វីក៏ដោយ ដោយមិនអាចរក្សាទុកនៅទីនេះបានទេ។ "បំបែកការចាក់សោ" អនុញ្ញាតឲ្យអ្នករក្សាទុកជាន់ពីលើឯកសារ; ការងារដែលពួកគេមិនទាន់រក្សាទុករបស់ពួកគេមិនបាត់បង់ទេ ប៉ុន្តែពួកគេនឹងលែងអាចរក្សាទុកវានៅទីនេះទៀតហើយ ហើយនរណាម្នាក់ប្រហែលជាត្រូវបញ្ចូលគ្នាទាំងពីរដោយដៃ។';
$ec_lang['lpn_lock_ask']='សួរ';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='តើគួរប្រាប់ថាអ្នកណាកំពុងសួរ? អក្សរកាត់ឈ្មោះរបស់អ្នកល្អបំផុត។ វាត្រូវបានផ្ញើទៅអ្នកណាដែលកំពុងបើកឯកសារនេះ ហើយត្រូវបានផ្ទុកតែក្នុងកម្មវិធីរុករកនេះប៉ុណ្ណោះ។';
$ec_lang['lpn_lock_ask_sent']='យើងបានសួរអ្នកណាដែលកំពុងបើកឯកសារនេះឲ្យបិទវា។ ពួកគេនឹងឃើញវាក្នុងរយៈពេលមិនដល់មួយនាទី ប្រសិនបើទំព័ររបស់ពួកគេនៅតែបើក។ គ្មានអ្វីផ្សេងទៀតបានផ្លាស់ប្ដូរទេ ហើយឯកសារនេះនៅតែជារបស់ពួកគេរហូតដល់ពួកគេបិទវា។';
$ec_lang['lpn_lock_ask_failed']='សារបស់អ្នកមិនអាចផ្ញើបានទេ។ ប្រហែលជាគ្មាននរណាម្នាក់កំពុងបើកឯកសារនេះឥឡូវនេះទេ ឬម៉ាស៊ីនមេមិនអាចទាក់ទងបានទេ។';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='ឯកសារនោះមិនត្រូវបានបើកទេ ហើយគ្មានអ្វីនៅទីនេះផ្លាស់ប្ដូរទេ។ អ្នកណាម្នាក់ផ្សេងទៀតនៅតែកំពុងបើកវា។';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} ចង់កែសម្រួលឯកសារនេះ។ នៅពេលអ្នកត្រៀមរួច សូមរក្សាទុកការងាររបស់អ្នក ហើយប្រើ ឯកសារ, បិទគម្រោង ដើម្បីប្រគល់វា។';
$ec_lang['lpn_ago_seconds']='{n} វិនាទី';
$ec_lang['lpn_ago_minutes']='{n} នាទី';
$ec_lang['lpn_ago_hours']='{n} ម៉ោង';
$ec_lang['lpn_ago_days']='{n} ថ្ងៃ';
$ec_lang['lpn_ago_unknown']='ពេលវេលាមិនស្គាល់';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='សារ';
$ec_lang['lpn_msglog_heading']='សារថ្មីៗ';
$ec_lang['lpn_msglog_empty']='មិនទាន់មានសារនៅឡើយទេ។';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} មុន';
$ec_lang['lpn_msglog_note']='ថ្មីបំផុតមុន។ ទំព័រនេះរក្សាទុកសារចុងក្រោយ {n} ខណៈវាកំពុងបើក ហើយគ្មានអ្វីត្រូវបានផ្ទុកនៅលើកុំព្យូទ័ររបស់អ្នកទេ។';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='បានតែអាន៖ {name} កំពុងបើកឯកសារនេះ។ អ្នកអាចផ្លាស់ប្ដូរអ្វីៗនៅទីនេះបានតាមចិត្ត ប៉ុន្តែអ្នកមិនអាចរក្សាទុកបានទេ។ ប្រើ ឯកសារ, រក្សាទុកជា ដើម្បីរក្សាទុកទៅឯកសារផ្សេង។';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='ប្រយ័ត្ន៖ មិនអាចទាក់ទងម៉ាស៊ីនមេដើម្បីពិនិត្យ ឬបង្កើតសោលើគម្រោងនេះបានទេ ដូច្នេះគ្មានអ្វីរារាំងមិត្តរួមការពីការកែប្រែឯកសារដូចគ្នានៅពេលតែមួយទេ។ អ្នកនឹងត្រូវបានប្រាប់ ប្រសិនបើការចាក់សោចាប់ផ្ដើមដំណើរការឡើងវិញ។';
$ec_lang['lpn_lock_storage_error']='ប្រយ័ត្ន៖ គេហទំព័រនេះមិនអាចរក្សាទុកកំណត់ត្រាសោបានទេ ដូច្នេះគ្មានអ្វីរារាំងមិត្តរួមការពីការកែប្រែឯកសារដូចគ្នានៅពេលតែមួយទេ។ នេះជាកំហុសក្នុងការដំឡើងនៅលើម៉ាស៊ីនមេ មិនមែនអ្វីដែលអ្នកអាចជួសជុលនៅទីនេះទេ — ថតសោមិនអាចសរសេរបានដោយម៉ាស៊ីនមេគេហទំព័រ។';
$ec_lang['lpn_lock_full_error']='ប្រយ័ត្ន៖ គេហទំព័រនេះអស់ទំហំសម្រាប់កត់ត្រាថាអ្នកណាកំពុងបើកគម្រោងណា ដូច្នេះគ្មានអ្វីរារាំងមិត្តរួមការពីការកែប្រែឯកសារដូចគ្នានៅពេលតែមួយទេ។ នេះជាកំហុសក្នុងការដំឡើងនៅលើម៉ាស៊ីនមេ មិនមែនអ្វីដែលអ្នកអាចជួសជុលនៅទីនេះទេ។';
$ec_lang['lpn_lock_not_asked']='ការចាក់សោមិនកំពុងដំណើរការសម្រាប់គម្រោងនេះទេ ដូច្នេះគ្មានអ្វីរារាំងមិត្តរួមការពីការកែប្រែឯកសារដូចគ្នានៅពេលតែមួយទេ។ កម្មវិធីរុករកនេះមិនទាន់មានឈ្មោះកត់ត្រាសម្រាប់អ្នកនៅឡើយ ឬគម្រោងគ្មានលេខសម្គាល់ទេ — ការរក្សាទុកគម្រោងទៅឯកសារកំណត់ទាំងពីរនេះ។';
$ec_lang['lpn_lock_restored']='ការចាក់សោកំពុងដំណើរការឡើងវិញ ហើយឯកសារនេះឥឡូវនេះជារបស់អ្នកសម្រាប់រក្សាទុក។';
$ec_lang['lpn_lock_dismiss']='លាក់សារនេះ';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='គម្រោងរបស់អ្នកនឹងត្រូវបានរក្សាទុកនៅក្នុងឯកសារមួយនៅលើកុំព្យូទ័រនេះ។ វាត្រូវបានរក្សាទុកនៅពេលអ្នកសុំ ហើយពុំមានពេលណាផ្សេងទៀតទេ ដូច្នេះគ្មានអ្វីត្រូវបានសរសេរទៅឯកសារនោះដោយអ្នកមិនដឹងខ្លួនទេ។';
$ec_lang['lpn_file_training_2']='ដើម្បីកុំឲ្យមនុស្សពីរនាក់កែប្រែឯកសារតែមួយក្នុងពេលតែមួយ គេហទំព័រនេះកត់ត្រាថាអ្នកណាកំពុងបើកវា។ ប្រសិនបើអ្នកណាម្នាក់កំពុងបើកវារួចហើយ អ្នកនៅតែអាចបើក និងមើលវាបាន ឬរក្សាទុកច្បាប់ចម្លងផ្ទាល់ខ្លួន។';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='លើកទីមួយដែលអ្នករក្សាទុក កម្មវិធីរុករករបស់អ្នកនឹងសួរថាតើគេហទំព័រនេះអាចកែប្រែឯកសារនោះបានឬទេ។ សំណួរនោះមកពីកម្មវិធីរុករក មិនមែនមកពីយើងទេ ហើយការឆ្លើយថាបានគឺជាអ្វីដែលអនុញ្ញាតឲ្យរក្សាទុកសរសេរការងាររបស់អ្នកត្រឡប់ទៅវិញ។ ជាធម្មតាវាត្រូវបានសួរតែម្ដងគត់ក្នុងមួយឯកសារ។';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='បន្ត';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='ជ្រើសរើសឯកសារម្ដងទៀត';
$ec_lang['lpn_file_reconnect']='ភ្ជាប់ទៅឯកសារនេះឡើងវិញ';
$ec_lang['lpn_file_reconnect_alert']='គម្រោងនេះមកពី {file}។ កម្មវិធីរុករករបស់អ្នកត្រូវការសិទ្ធិពីអ្នកម្ដងទៀត មុននឹងអាចសរសេរទៅវាបាន។ ភ្ជាប់ឡើងវិញខាងក្រោម។';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='នោះជាឯកសារដូចគ្នាដែលអ្នកណាម្នាក់ផ្សេងទៀតកំពុងបើក ដូច្នេះមិនអាចរក្សាទុកជាន់ពីលើវាបានទេ។ ជ្រើសរើសឯកសារ ឬឈ្មោះផ្សេង។';
$ec_lang['lpn_saveas_overwrites_project']='ឯកសារនោះកំពុងផ្ទុកគម្រោងផ្សេងមួយរួចហើយ គឺ {name}។ ការរក្សាទុកនៅទីនេះនឹងជំនួសវាទាំងស្រុង។ បន្តទេ?';
$ec_lang['lpn_saveas_overwrites_newer']='ឯកសារនោះបានផ្លាស់ប្ដូរចាប់តាំងពីអ្នកបានឃើញវាចុងក្រោយ ដូច្នេះស្ទើរតែប្រាកដថាមានអ្នកណាម្នាក់ផ្សេងទៀតបានរក្សាទុកទៅវារួចហើយ។ ការរក្សាទុកនៅទីនេះនឹងជំនួសកំណែរបស់ពួកគេដោយកំណែរបស់អ្នក។ បន្តទេ?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='ឈ្មោះសម្រាប់គម្រោងនេះ';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='បានបិទ {closed}។ ឥឡូវនេះកំពុងបង្ហាញ {opened}។';
$ec_lang['lpn_status_closed_empty']='បានបិទ {closed}។ បានចាប់ផ្ដើមគម្រោងទទេថ្មីមួយ។';
$ec_lang['lpn_storage_full']='មិនបានរក្សាទុកទេ។ ទំហំផ្ទុករបស់កម្មវិធីរុករកពេញ ឬមិនអាចប្រើបាន ដូច្នេះការផ្លាស់ប្ដូរថ្មីៗរបស់អ្នកនឹងបាត់ នៅពេលអ្នកបិទផ្ទាំងនេះ។';
$ec_lang['lpn_storage_unreadable']='មិនបានរក្សាទុកទេ។ គម្រោងនេះមិនអាចអានពីទំហំផ្ទុករបស់កម្មវិធីរុករកបានទេ។ ច្បាប់ចម្លងដែលបានផ្ទុករបស់វានៅតែដដែលបេះបិទ ហើយនឹងមិនត្រូវបានសរសេរជាន់ពីលើទេ ដូច្នេះគ្មានអ្វីនៅលើផ្ទាំងនេះកំពុងត្រូវបានរក្សាទុកទេ។ បើកឯកសារមួយ ឬបង្កើតគម្រោងថ្មីមួយ ដើម្បីបន្តធ្វើការ។';
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
$ec_lang['lpn_about_credits']='កិត្តិយស';
$ec_lang['lpn_help_welcome']='ទំព័រស្វាគមន៍';
$ec_lang['lpn_about_license']='ត្រូវបានផ្ដល់អាជ្ញាប័ណ្ណក្រោម GNU General Public License v3.0 ឬក្រោយ។';
$ec_lang['lpn_notes_1_term']='របៀបដែលវាត្រូវបានដោះស្រាយ';
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
$ec_lang['lpn_notes_1_def']='ភ្លែតនីមួយៗត្រូវបានដោះស្រាយដោយប្រើក្បួនដោះស្រាយជម្រាលសកលដូចគ្នានឹង EPANET ប្រើដែរ។ កំណត់ រយៈពេលដំណើរការសរុប ហើយឧបករណ៍ដោះស្រាយ EPANET គណនារាល់ជំហានរាយការណ៍ម្ដងម្ដង៖ ធុងទឹកបំពេញ និងបង្ហូរ តម្រូវការតាមលំនាំរបស់វា ហើយរបារឧបករណ៍លេងការដំណើរការត្រឡប់វិញ។ ឧបករណ៍ដោះស្រាយខាងក្នុងគណនាតែមួយភ្លែតម្ដងៗ ហើយរក្សាធុងទឹកនីមួយៗនៅកម្រិតចាប់ផ្ដើមរបស់វា។';
$ec_lang['lpn_notes_2_term']='មិនធ្វើគំរូ';
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
$ec_lang['lpn_notes_2_def']='គីមីវិទ្យាគុណភាពទឹកមិនត្រូវបានធ្វើគំរូទេ; អាយុទឹក និងការតាមដានប្រភពត្រូវបានធ្វើគំរូ។ ចំពោះវ៉ាល់៖ វ៉ាល់ត្រួតពិនិត្យរបាំងលំហូរដំណើរការនៅក្នុងឧបករណ៍ដោះស្រាយណាមួយ ចំណែកឯវ៉ាល់ដែលកំណត់ទីតាំងផ្ទាល់ខ្លួនរបស់វា (PRV, PSV, FCV) ត្រូវបានដោះស្រាយដោយឧបករណ៍ដោះស្រាយ EPANET ដែលទំព័រនេះបើកដោយខ្លួនឯង នៅពេលបណ្ដាញរបស់អ្នកមានវ៉ាល់ប្រភេទនោះមួយ។';
$ec_lang['lpn_notes_3_term']='ការរក្សាទុកគម្រោង';
$ec_lang['lpn_notes_3_def']='គម្រោងនីមួយៗគឺជាផ្ទាំងមួយ ហើយផ្ទាំងនីមួយៗត្រូវបានរក្សាទុកនៅក្នុងកម្មវិធីរុករកនេះខណៈពេលអ្នកធ្វើការ។ ការជម្រះទិន្នន័យកម្មវិធីរុករករបស់អ្នកលុបវាទាំងអស់ ដូច្នេះសូមរក្សាការងាររបស់អ្នកនៅក្នុងឯកសារមួយ៖ ឯកសារ, រក្សាទុកជា។ សញ្ញាផ្កាយ (*) នៅលើផ្ទាំងមួយមានន័យថាវាផ្ទុកការផ្លាស់ប្ដូរដែលមិននៅក្នុងឯកសារ។ គ្មានអ្វីត្រូវបានសរសេរទៅឯកសារឡើយ លុះត្រាតែអ្នកសុំ។ នៅក្នុងកម្មវិធីរុករកខ្លះ គម្រោងមួយភ្ជាប់ទៅឯកសារដែលអ្នករក្សាទុកវា ហើយ ឯកសារ, រក្សាទុក សរសេរត្រឡប់ទៅឯកសារដដែលនោះចាប់ពីពេលនោះតទៅ; នៅក្នុងកម្មវិធីរុករកផ្សេងទៀត គ្មានការភ្ជាប់អាចធ្វើទៅបានទេ ដូច្នេះរក្សាទុកត្រូវបានបិទ ហើយមានតែរក្សាទុកជាទេដែលអាចប្រើបាន។ នៅពេលឯកសារគម្រោងមួយត្រូវបានរក្សានៅលើដ្រាយវ៍ដែលចែករំលែក ទំព័រនេះប្រាប់អ្នកថាតើមិត្តរួមការណាមួយកំពុងបើកវារួចហើយឬអត់ ដើម្បីកុំឲ្យមនុស្សពីរនាក់សរសេរជាន់លើគ្នា។';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='ខ្សែកោងម៉ាស៊ីនបូម';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='ម៉ាស៊ីនបូមមួយធ្វើតាម H = H₀ − aQ^b ដែល H ជាថ្ពល់ដែលម៉ាស៊ីនបូមបន្ថែម ហើយ Q ជាលំហូរឆ្លងកាត់វា។ បញ្ចូលមួយ ពីរ ឬបីចំណុចពីខ្សែកោងរបស់ក្រុមហ៊ុនផលិត។ បីចំណុច — ថ្ពល់ត្រង់លំហូរសូន្យ ចំណុចធ្វើការធម្មតា និងចំណុចលំហូរខ្ពស់បំផុត — សម្របទៅ H₀, a និង b ដោយផ្ទាល់ ហើយតាមខ្សែកោងដែលបានបោះពុម្ពស្អិតបំផុត។ ពីរចំណុចសម្របទៅប៉ារ៉ាបូល (b = 2) ដែលកំពូលរបស់វានៅត្រង់លំហូរសូន្យ។ ចំណុចមួយប្រើក្បួនធម្មតា៖ ថ្ពល់ត្រង់លំហូរសូន្យគឺ ១.៣៣ × ថ្ពល់ដែលអ្នកបញ្ចូល ហើយលំហូរខ្ពស់បំផុតគឺ ២ × លំហូរដែលអ្នកបញ្ចូល ដែលផ្ដល់ b = 2 ដដែល។ ម៉ាស៊ីនបូមមួយដែលគ្មានចំណុចត្រូវបានបញ្ចូលមិនបន្ថែមថ្ពល់ទាល់តែសោះ។ ខ្សែកោងមិនត្រូវបានកាត់ចេញត្រង់ចំណុចដែលថ្ពល់ឈានដល់សូន្យទេ ដូច្នេះការសុំម៉ាស៊ីនបូមឲ្យផ្ដល់លំហូរច្រើនជាងអ្វីដែលខ្សែកោងរបស់វាអាចផ្ដល់បាន ផ្ដល់ថ្ពល់អវិជ្ជមាន។ ដំណោះស្រាយគឺម៉ាស៊ីនបូមធំជាង ឬតម្រូវការតូចជាង មិនមែនការសម្របខ្សែកោងផ្សេងទេ។ ខ្សែកោងមួយអាចមានចំណុចច្រើនជាងបី។ ឧបករណ៍ដោះស្រាយខាងក្នុងអានតែបីចំណុច គឺទីមួយ កណ្ដាល និងចុងក្រោយ ដើម្បីសមតាមសមីការខាងលើ; ឧបករណ៍ដោះស្រាយ EPANET អានគ្រប់ចំណុចដែលអ្នកបានផ្ដល់។';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='ក៏មាននៅលើទំព័រនេះដែរ';
$ec_lang['lpn_notes_4_def']='គម្រោងមួយអាចដាក់នៅលើដីពិត ដោយមានផែនទីផ្លូវនៅពីក្រោយវា។ ឯកសារ EPANET .inp អាចត្រូវបានអាន និងសរសេរចេញ។ ផ្ទាំងខាងក្រោមគូរទម្រង់បណ្ដោយតាមផ្លូវមួយ ហើយរាយបញ្ជីថ្នាំង។ ធាតុអាចត្រូវបានលាបពណ៌តាមលទ្ធផលរបស់ពួកវា ហើយ រក រកមើលរាល់ធាតុដែលត្រូវនឹងលក្ខខណ្ឌដែលអ្នកបានកំណត់។';
$ec_lang['lpn_notes_6_term']='ជំនួយជួរឈរតារាង';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>ជ្រើសរើសជួរឈរ</td><td>ចុចលើក្បាល</td></tr><tr><td>បន្ថែម ឬពង្រីកជម្រើសជួរឈរ</td><td>Ctrl+ចុច ឬ Shift+ចុចលើក្បាលមួយទៀត</td></tr><tr><td>ផ្លាស់ទី (តម្រៀបលំដាប់ឡើងវិញ) ជួរឈរដែលបានជ្រើសរើស</td><td>អូស ឬប្រើ គ្រប់គ្រងជួរឈរ… នៅក្នុងម៉ឺនុយចុចខាងស្ដាំ ឬ ⋮</td></tr><tr><td>ម៉ឺនុយ ⋮ និងព្រួញតម្រៀប។</td><td>ដាក់ទ្រនិចលើជ្រុងខាងលើនៃក្បាលមួយ ឬជ្រើសរើស ឬចុច Tab ចូលក្បាលមួយ</td></tr><tr><td>លាក់ បង្ហាញទាំងអស់ ឬគ្រប់គ្រងភាពមើលឃើញ និងលំដាប់</td><td>ចុចស្ដាំលើក្បាល ឬម៉ឺនុយ ⋮ នៅជ្រុងខាងលើស្ដាំនៃក្បាល</td></tr><tr><td>តម្រៀបតាមជួរឈរ</td><td>រូបតំណាងព្រួញនៅជ្រុងខាងលើស្ដាំនៃក្បាល</td></tr><tr><td>បិទភ្ជាប់ជាជួរដេកថ្មីនៅចុងតារាង</td><td>ចុចស្ដាំ ម៉ឺនុយ ⋮ នៅជ្រុងខាងលើស្ដាំនៃក្បាល ឬ Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='ផ្លូវកាត់ក្តារចុចតារាង';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Arrow keys</td><td>រុករក។</td></tr><tr><td>Tab, Enter</td><td>បញ្ចប់ការវាយបញ្ចូល ហើយរុករកឆ្លង / ចុះក្រឡាមួយ។</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>រុករកថយក្រោយ។</td></tr><tr><td>Shift+arrow keys</td><td>ពង្រីកជម្រើស។</td></tr><tr><td>Ctrl+C</td><td>ចម្លងជម្រើស។</td></tr><tr><td>Ctrl+D</td><td>បំពេញជម្រើសចុះពីជួរដេកខាងលើរបស់វា។</td></tr><tr><td>Ctrl+Enter</td><td>បំពេញជម្រើសដោយតម្លៃក្រឡាសកម្ម។</td></tr><tr><td>Ctrl+A</td><td>ជ្រើសរើសតារាងទាំងមូល។</td></tr><tr><td>Ctrl+Shift+V</td><td>បិទភ្ជាប់ជាជួរដេកថ្មីនៅចុងតារាង។</td></tr><tr><td>Delete</td><td>សម្អាតក្រឡាមួយ។</td></tr><tr><td>F2</td><td>បើកក្រឡាមួយដើម្បីកែសម្រួលវា។</td></tr><tr><td>Esc</td><td>បោះបង់ការកែសម្រួល។</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='ព្រំដែនក្រុមពណ៌នៅតែដដែល';
$ec_lang['lpn_notes_color_def']='ព្រំដែនក្រុមពណ៌ត្រូវបានកំណត់នៅពេលអ្នកជ្រើសរើសវិធីសាស្ត្រចាត់ថ្នាក់ទិន្នន័យ។ ពួកវាមិនត្រូវបានកំណត់ម្ដងទៀតនៅរាល់ចំណុចពេលវេលាទេ ព្រោះនោះនឹងធ្វើឲ្យពណ៌មានន័យថ្មីរាល់ចំណុចពេលវេលា ហើយវាមិនជួយឲ្យមើលឃើញប្រព័ន្ធរបស់អ្នកបានច្បាស់ទេ។ EPANET ក៏ដំណើរការបែបនេះដែរ។ ដើម្បីទទួលបានព្រំដែនថ្មី សូមជ្រើសរើសវិធីសាស្ត្រម្ដងទៀត ឬវាយបញ្ចូលព្រំដែនផ្ទាល់ខ្លួនរបស់អ្នក។';
$ec_lang['lpn_notes_epanet_term']='ថេរ Hazen-Williams ត្រូវគ្នានឹង EPANET';
$ec_lang['lpn_notes_epanet_def']='នៅខែសីហា ២០២៦ មេគុណ និងនិទស្សន្ត Hazen-Williams ត្រូវបានផ្លាស់ប្ដូរឲ្យត្រូវគ្នានឹង EPANET។ លទ្ធផលការបាត់បង់ថ្ពល់ខុសពីកំណែមុនរបស់ទំព័រនេះរហូតដល់ ០.១ ភាគរយ ដែលតូចជាងភាពមិនប្រាកដច្បាស់នៃតម្លៃ C ខ្លួនឯងឆ្ងាយណាស់។';
$ec_lang['lpn_notes_engine_term']='EPANET មួយណាដែលទំព័រនេះប្រើ';
$ec_lang['lpn_notes_engine_def']='ឧបករណ៍ដោះស្រាយ EPANET នៅលើទំព័រនេះគឺ OWA-EPANET 2.3.5 ចេញផ្សាយថ្ងៃទី 20 ខែកុម្ភៈ ឆ្នាំ 2025។ EPANET ត្រូវបានបង្កើតឡើងដោយ Open Water Analytics ដែលជាសហគមន៍ធ្វើការជាមួយទីភ្នាក់ងារការពារបរិស្ថានសហរដ្ឋអាមេរិក (US EPA) ដែលបានចេញផ្សាយកំណែ 2.2.0 នៅខែធ្នូ ឆ្នាំ 2019។ របាយការណ៍ដំណើរការហៅវាថា 2.3.05 ព្រោះម៉ាស៊ីននេះសរសេរលេខចុងក្រោយជាពីរខ្ទង់។ វាមកដល់ទំព័រនេះតាមរយៈ epanet-js 0.9.0 ដោយ Luke Butler ក្រោមអាជ្ញាប័ណ្ណ MIT ហើយវាដំណើរការនៅក្នុងកម្មវិធីរុករករបស់អ្នក៖ បណ្ដាញរបស់អ្នកមិនត្រូវបានផ្ញើទៅកន្លែងណាមួយដើម្បីដោះស្រាយឡើយ។';
$ec_lang['lpn_id_invalid']='បញ្ចូលលេខសម្គាល់ដោយគ្មានចន្លោះ និងគ្មានសញ្ញាសម្រង់។';
$ec_lang['lpn_id_taken']='លេខសម្គាល់នោះកំពុងប្រើរួចហើយ។';
$ec_lang['lpn_diag_no_fixed_head']='បន្ថែមអាងស្តុក ឬធុងទឹកមួយ។ បណ្ដាញនេះត្រូវការកម្រិតទឹកដែលដឹងហើយយ៉ាងតិចមួយ មុននឹងអាចដោះស្រាយបាន។';
$ec_lang['lpn_diag_dangling_link']='បំពង់ ឬម៉ាស៊ីនបូមមួយភ្ជាប់ទៅថ្នាំងមួយដែលលែងមានទៀតហើយ៖';
$ec_lang['lpn_diag_unreachable']='ថ្នាំងទាំងនេះគ្មានផ្លូវទៅអាងស្តុកទេ៖';
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
$ec_lang['lpn_engine_fetching']='កំពុងទាញយកឧបករណ៍ដោះស្រាយ EPANET។ វាត្រូវបានទាញយកតែម្ដង ហើយបន្ទាប់មករក្សាទុកនៅក្នុងឧបករណ៍នេះ ដូច្នេះវាដំណើរការដោយគ្មានអ៊ីនធឺណិតបន្ទាប់ពីនោះ។';
$ec_lang['lpn_engine_ready']='ឧបករណ៍ដោះស្រាយ EPANET ស្ថិតនៅក្នុងឧបករណ៍នេះឥឡូវនេះ ហើយដំណើរការដោយគ្មានអ៊ីនធឺណិត។';
$ec_lang['lpn_engine_fetching_valve']='កំពុងទាញយកឧបករណ៍ដោះស្រាយ EPANET ដូច្នេះវ៉ាល់នេះអាចដោះស្រាយបានឥឡូវនេះ និងដោយគ្មានអ៊ីនធឺណិតនៅពេលក្រោយ។';
$ec_lang['lpn_engine_ready_valve']='ឧបករណ៍ដោះស្រាយ EPANET ស្ថិតនៅក្នុងឧបករណ៍នេះឥឡូវនេះ។ វ៉ាល់ដែលបើក និងបិទដោយខ្លួនឯង នឹងដំណើរការដោយគ្មានអ៊ីនធឺណិត។';
$ec_lang['lpn_engine_unavailable']='មិនអាចទាញយកឧបករណ៍ដោះស្រាយ EPANET បានទេ ដែលជាអ្វីដែលដោះស្រាយវ៉ាល់ដែលបើក និងបិទដោយខ្លួនឯង។ សូមភ្ជាប់អ៊ីនធឺណិតម្ដង ហើយវានឹងត្រូវបានរក្សាទុកនៅក្នុងឧបករណ៍នេះចាប់ពីពេលនោះមក។';
$ec_lang['lpn_engine_needed_loading']='កំពុងផ្ទុកឧបករណ៍ដោះស្រាយ EPANET ខណៈអ្នកកំពុងកសាង។ លទ្ធផលនឹងអាចប្រើបានពេលផ្ទុករួចទាំងស្រុង។';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='វឌ្ឍនភាពផ្ទុកឧបករណ៍ដោះស្រាយ';
$ec_lang['lpn_engine_wait']='កំពុងផ្ទុកឧបករណ៍ដោះស្រាយ។ លទ្ធផលពន្យារពេលមួយភ្លែត។ បន្តធ្វើការ។';
$ec_lang['lpn_engine_wait_pct']='ឧបករណ៍ដោះស្រាយបានផ្ទុក {percent}%។';
$ec_lang['lpn_engine_wait_bytes']='ឧបករណ៍ដោះស្រាយបានផ្ទុក {kb} KB រហូតមកដល់ពេលនេះ។ ចំនួនសរុបមិនមានទេ ដូច្នេះភាគរយនៃការបញ្ចប់មិនស្គាល់ទេ។';
$ec_lang['lpn_engine_needed_failed']='ឧបករណ៍ដោះស្រាយ EPANET មិនទាន់ត្រូវបានផ្ទុកនៅឡើយទេ មិនអាចផ្ទុកបានទេ ហើយបណ្ដាញនេះអាចដោះស្រាយបានដោយវាតែប៉ុណ្ណោះ។ វានឹងត្រូវបានផ្ទុកនៅពេលអ្នកភ្ជាប់អ៊ីនធឺណិត។';
$ec_lang['lpn_diag_valve_needs_epanet']='វ៉ាល់ទាំងនេះបើក និងបិទដោយខ្លួនឯង ហើយមានតែឧបករណ៍ដោះស្រាយ EPANET ប៉ុណ្ណោះដែលអាចគណនាវាបាន។ ឧបករណ៍ដោះស្រាយ EPANET មិនអាចផ្ទុកបានទេ ដូច្នេះលទ្ធផលទាំងនេះបាត់៖';
$ec_lang['lpn_diag_valve_on_fixed_head']='វ៉ាល់ទាំងនេះត្រូវបានតភ្ជាប់ដោយផ្ទាល់ទៅអាងស្តុក ឬធុងទឹក ដែលកំណត់កម្រិតទឹកនៅទីនោះរួចហើយ ដូច្នេះគ្មានអ្វីនៅសល់សម្រាប់វ៉ាល់ត្រួតពិនិត្យទេ។ សូមដាក់បំពង់ខ្លីមួយរវាងវ៉ាល់ និងអាងស្តុក ឬធុងទឹក៖';
$ec_lang['lpn_diag_not_converged']='រកមិនឃើញដំណោះស្រាយទេ។ សូមពិនិត្យរកតម្លៃដែលមិនអាចមានក្នុងជីវិតពិត ដូចជាអង្កត់ផ្ចិតសូន្យ។';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='ដំណោះស្រាយមិនប្រសព្វគ្នាទេ។ លេខទាំងនេះជាជុំចុងក្រោយ មិនមែនជាចម្លើយទេ។ សូមកុំប្រើវា។';
$ec_lang['lpn_diag_not_converged_trials']='វាឈប់បន្ទាប់ពី {iterations} ជុំ។';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='វាឈប់បន្ទាប់ពី {iterations} ជុំ ដោយមានកំហុសដែលទាក់ទងស្មើ {error} ដែលមិនទាន់ដល់ការកំណត់ភាពត្រឹមត្រូវ {accuracy}។';
$ec_lang['lpn_field_roughness']='ភាពរដិបរដុប';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Hazen-Williams C។ លេខខ្ពស់ជាងមានន័យថាបំពង់រលោងជាង៖ ប្រហែល ១៥០ សម្រាប់ប្លាស្ទិកថ្មី ១៣០ សម្រាប់ដែក ឬដែកថ្មី និង ១០០ សម្រាប់បំពង់ចាស់។';
$ec_lang['lpn_field_length']='ប្រវែង';
$ec_lang['lpn_field_from']='ពី';
$ec_lang['lpn_field_to']='ទៅ';
$ec_lang['lpn_field_length_tip']='ប្រវែងបំពង់។ ជាមួយ ស្វ័យប្រវត្តិ បើក ប្រវែងត្រូវបានវាស់ពីអ្វីដែលអ្នកបានគូរ។ បិទ ស្វ័យប្រវត្តិ ដើម្បីវាយបញ្ចូលប្រវែងផ្សេងពីការគូរ។';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='ប្រភេទវ៉ាល់';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='អ្វីដែលវ៉ាល់ធ្វើ។ វ៉ាល់ប្រភេទ “ការបាត់បង់ថេរ” រក្សាការបាត់បង់ថេរមួយ។ ប្រភេទបីទៀតរក្សាសម្ពាធ ឬលំហូរមួយ ហើយបើកពេញ បិទ ឬបិទដោយផ្នែកទៅតាមការផ្លាស់ប្ដូរទឹក។ ការប្ដូរប្រភេទដាក់លេខចាប់ផ្ដើមថ្មីនៅក្នុងការកំណត់ខាងក្រោម ព្រោះសម្ពាធមិនមែនជាលំហូរទេ ហើយទាំងពីរក៏មិនមែនជាមេគុណការបាត់បង់ដែរ។';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='ការបាត់បង់ថេរ (TCV)';
$ec_lang['lpn_valve_type_prv']='កាត់បន្ថយសម្ពាធ (PRV)';
$ec_lang['lpn_valve_type_psv']='រក្សាសម្ពាធ (PSV)';
$ec_lang['lpn_valve_type_fcv']='ត្រួតត្រាលំហូរ (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='ការកាត់បន្ថយសម្ពាធថេរ (PBV)';
$ec_lang['lpn_valve_type_gpv']='គោលបំណងទូទៅ (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='ការធ្លាក់សម្ពាធ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='សម្ពាធដែលវ៉ាល់ដកចេញ។ វ៉ាល់កាត់បន្ថយសម្ពាធថេរដកចេញនូវសម្ពាធនេះជានិច្ច មិនថាទឹកហូរទិសណាទេ។ វាជាការធ្លាក់សម្ពាធឆ្លងកាត់វ៉ាល់ មិនមែនជាសម្ពាធត្រូវរក្សាទេ។';
$ec_lang['lpn_inp_drop_gpv_curve']='វ៉ាល់នេះសំដៅទៅខ្សែកោងការបាត់បង់ថ្ពល់មួយ ដែលមិននៅក្នុងឯកសារទេ។ វ៉ាល់នេះចូលមកដោយគ្មានខ្សែកោង ដូច្នេះវានៅតែបើកពេញ រហូតដល់អ្នកផ្ដល់វាមួយ។';
$ec_lang['lpn_gpv_curve_source']='ខ្សែកោងការបាត់បង់ថ្ពល់វ៉ាល់';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='ខ្សែកោងនៅក្នុងប្រអប់ បណ្ណាល័យ ដែលប្រាប់ថាវ៉ាល់នេះបាត់បង់ថ្ពល់ប៉ុន្មាននៅលំហូរនីមួយៗ។ វ៉ាល់ជាច្រើនអាចប្រើខ្សែកោងតែមួយ ហើយការកែប្រែវានៅទីនោះផ្លាស់ប្ដូរពួកវាទាំងអស់។ វ៉ាល់នេះមានតែសេចក្ដីយោងប៉ុណ្ណោះ ចំណុចខ្លួនឯងត្រូវបានអាន និងកែសម្រួលនៅក្រោម បណ្ណាល័យ, ខ្សែកោង។';
$ec_lang['lpn_field_valve_setting_pressure']='ការកំណត់សម្ពាធ';
$ec_lang['lpn_field_valve_setting_pressure_tip']='សម្ពាធដែលវ៉ាល់រក្សា។ វ៉ាល់កាត់បន្ថយសម្ពាធរក្សាសម្ពាធនៅចំហៀងខាងក្រោមទឹករបស់វា ស្មើ ឬទាបជាងតម្លៃនេះ។ វ៉ាល់រក្សាសម្ពាធរក្សាសម្ពាធនៅចំហៀងខាងលើទឹករបស់វា ស្មើ ឬខ្ពស់ជាងតម្លៃនេះ។';
$ec_lang['lpn_field_valve_setting_flow']='ការកំណត់លំហូរ';
$ec_lang['lpn_field_valve_setting_flow_tip']='បរិមាណទឹកច្រើនបំផុតដែលវ៉ាល់អនុញ្ញាតឲ្យហូរកាត់។ នៅពេលទឹកតិចជាងនេះចង់ហូរកាត់ វ៉ាល់ឈរបើកពេញ ហើយមិនបន្ថែមការបាត់បង់ណាមួយឡើយ។';
$ec_lang['lpn_field_valve_setting']='ការកំណត់';
$ec_lang['lpn_field_valve_setting_loss']='មេគុណការបាត់បង់';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='ថ្ពល់ប៉ុន្មានដែលវ៉ាល់ប្រភេទការបាត់បង់ថេរដកចេញ រាប់ជាពហុគុណនៃថ្ពល់ល្បឿន។ ប្រើ ០ សម្រាប់វ៉ាល់ដែលឈរបើកពេញ។ លេខតែមួយនេះគឺជាការបាត់បង់ទាំងអស់របស់វ៉ាល់ប្រភេទនេះ។';
$ec_lang['lpn_field_valve_diameter_tip']='ទទឹងច្រកបើកកាត់តាមវ៉ាល់។ ល្បឿនទឹកកាត់តាមវ៉ាល់ត្រូវបានគណនាពីទទឹងនេះ ហើយការបាត់បង់កើតឡើងបន្តពីល្បឿននោះ។';
$ec_lang['lpn_field_valve_km_tip']='ការបាត់បង់ពីខ្លួនវ៉ាល់ខណៈវ៉ាល់ឈរបើកពេញ បន្ថែមលើអ្វីដែលការកំណត់វ៉ាល់ដកចេញ។ វារាប់ជាពហុគុណនៃថ្ពល់ល្បឿន។ ប្រើ ០ ដើម្បីមិនរាប់វា។';
$ec_lang['lpn_field_km']='មេគុណការបាត់បង់មូលដ្ឋាន, k';
$ec_lang['lpn_field_km_tip']='ការបាត់បង់ពីកែង វ៉ាល់ និងគ្រឿងបំពាក់នៅលើបំពង់នេះ រាប់ជាចំនួនគុណនៃថ្ពល់ល្បឿន។ ប្រើ ០ សម្រាប់បំពង់ត្រង់ធម្មតា។';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='ការបាត់បង់មូលដ្ឋាន, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='ខ្សែកោងថ្ពល់ម៉ាស៊ីនបូម';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='ខ្សែកោងនៅក្នុងប្រអប់ បណ្ណាល័យ ដែលប្រាប់ថាម៉ាស៊ីនបូមនេះបន្ថែមថ្ពល់ប៉ុន្មាននៅលំហូរនីមួយៗ។ ម៉ាស៊ីនបូមជាច្រើនអាចប្រើខ្សែកោងតែមួយ ហើយការកែប្រែវានៅទីនោះផ្លាស់ប្ដូរពួកវាទាំងអស់។ ម៉ាស៊ីនបូមនេះមានតែសេចក្ដីយោងប៉ុណ្ណោះ ចំណុចខ្លួនឯងត្រូវបានអាន និងកែសម្រួលនៅក្រោម បណ្ណាល័យ, ខ្សែកោង។';
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
$ec_lang['lpn_field_desc']='ការពិពណ៌នា';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='សម្រាប់ការប្រើប្រាស់ផ្ទាល់ខ្លួនរបស់អ្នក ដូចជាជ្រុងផ្លូវ ឬសម្ភារៈដែលបំពង់មួយផលិតឡើង។ វាចូល និងចេញជាមួយឯកសារ EPANET ជាកន្លែងវានៅចុងជួរដេកផ្ទាល់ខ្លួនរបស់ធាតុនោះ។ គ្មានការគណនាណាមួយអានវាទេ។ ការចុះបន្ទាត់ក្លាយជាដកឃ្លាមួយ ព្រោះឯកសារគ្មានកន្លែងដាក់វាទេ។';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='ស្លាកសម្គាល់';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='ស្លាកសម្គាល់អាចមានអត្ថន័យអ្វីក៏បានតាមតម្រូវការរបស់អ្នក ដូចជាតំបន់សម្ពាធ ឬលេខបញ្ជាការងារ។ គ្មានការគណនានៅទីនេះ ឬនៅក្នុង EPANET អានវាទេ។ ស្លាកសម្គាល់ជាពាក្យតែមួយ៖ EPANET ឈប់អានត្រង់ដកឃ្លាដំបូង ដូច្នេះដកឃ្លាមួយត្រូវបានបដិសេធនៅពេលអ្នកវាយបញ្ចូល។ វាចូល និងចេញជាមួយឯកសារ EPANET។';
$ec_lang['lpn_pump_effic_curve']='ខ្សែកោងប្រសិទ្ធភាពម៉ាស៊ីនបូម';
$ec_lang['lpn_pump_effic_curve_tip']='ខ្សែកោងនៅក្នុងប្រអប់ បណ្ណាល័យ ដែលប្រាប់ថាម៉ាស៊ីនបូមនេះមានប្រសិទ្ធភាពប៉ុន្មាននៅលំហូរនីមួយៗ។ ម៉ាស៊ីនបូមជាច្រើនអាចប្រើខ្សែកោងតែមួយ ហើយការកែប្រែវានៅទីនោះផ្លាស់ប្ដូរពួកវាទាំងអស់។ ម៉ាស៊ីនបូមនេះមានតែសេចក្ដីយោងប៉ុណ្ណោះ ចំណុចខ្លួនឯងត្រូវបានអាន និងកែសម្រួលនៅក្រោម បណ្ណាល័យ, ខ្សែកោង។';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='គ្មានខ្សែកោងបានជ្រើសរើស';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='ខ្សែកោង';
$ec_lang['lpn_curve_library_link_tip']='បើកប្រអប់ បណ្ណាល័យ លើផ្នែក ខ្សែកោង ជាកន្លែងខ្សែកោងមួយត្រូវបានបន្ថែម ពិពណ៌នា កែសម្រួល និងលុប។ ធាតុនីមួយៗប្រាប់ថាតើវាប្រើខ្សែកោងមួយណា។';
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
$ec_lang['lpn_curve_kind_head']='ថ្ពល់ម៉ាស៊ីនបូម';
$ec_lang['lpn_curve_kind_effic']='ប្រសិទ្ធភាពម៉ាស៊ីនបូម';
$ec_lang['lpn_curve_kind_volume']='ទំហំធុងទឹក';
$ec_lang['lpn_curve_kind_headloss']='ការបាត់បង់ថ្ពល់វ៉ាល់';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='មិនបានចែងប្រភេទ';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='ទំហំ';
$ec_lang['lpn_pump_effic_col']='ប្រសិទ្ធភាព';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='ម៉ាស៊ីនបូមនេះគ្មានខ្សែកោងប្រសិទ្ធភាពបានជ្រើសរើសទេ ដូច្នេះវាដំណើរការនៅប្រសិទ្ធភាពដែលបានកំណត់សម្រាប់បណ្ដាញទាំងមូល គឺ {percent}។';
$ec_lang['lpn_pump_effic_unstated']='ម៉ាស៊ីនបូមនេះសំដៅលើខ្សែកោងប្រសិទ្ធភាពមួយឈ្មោះ {name} ដែលគ្មានអ្វីនៅក្នុងគម្រោងនេះកំណត់ ដូច្នេះវាដំណើរការនៅប្រសិទ្ធភាពដែលបានកំណត់សម្រាប់បណ្ដាញទាំងមូល គឺ {percent}។';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='របៀប៖ ជ្រើសរើស។ ចុចធាតុ ឬស្លាកមួយ ដើម្បីមើល ឬផ្លាស់ប្ដូរវា។ អូសដើម្បីផ្លាស់ទីថ្នាំង ចំណុចកំណត់ ឬស្លាកមួយ។ ប្រើឧបករណ៍ ចំណុចកំណត់ ដើម្បីបន្ថែម ឬដកចំណុចកោងក្នុងបំពង់មួយ។';
$ec_lang['lpn_mode_delete']='របៀប៖ លុប។ ចុចធាតុមួយដើម្បីលុបវា។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='របៀប៖ ចំណុចកំណត់។ ចំណុចកំណត់របស់បំពង់នីមួយៗត្រូវបានបង្ហាញជាដងអូសការ៉េតូចៗ។ ចុចលើបំពង់ដើម្បីបន្ថែមចំណុចកំណត់ ចុចលើដងអូសដើម្បីលុបវា ឬអូសដងអូសដើម្បីផ្លាស់ទីវា។ គ្មានអ្វីផ្សេងទៀតនៅលើផែនទីត្រូវបានផ្លាស់ប្ដូរនៅក្នុងរបៀបនេះទេ។';
$ec_lang['lpn_mode_zoom_window']='របៀប៖ បង្អួចពង្រីក។ ចុចជ្រុងទល់មុខគ្នាពីរនៃប្រអប់មួយ ឬអូសមួយ នៅលើផែនទី ដើម្បីពង្រីកចូលទៅវា។';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='គ្មានអ្វីត្រូវបានជ្រើសរើសទេ។ ចុចលើធាតុមួយនៅលើផែនទីជាមុនសិន រួចចុច លុប។';
$ec_lang['lpn_mode_add_junction']='របៀប៖ បន្ថែមថ្នាំង។ ចុចលើផែនទីដើម្បីដាក់ថ្នាំងមួយ។ ប្ដូរទៅរបៀបជ្រើសរើសដើម្បីផ្លាស់ប្ដូរ ឬផ្លាស់ទីធាតុ និងស្លាក។';
$ec_lang['lpn_mode_add_reservoir']='របៀប៖ បន្ថែមអាងស្តុក។ ចុចលើផែនទីដើម្បីដាក់អាងស្តុកមួយ។ ប្ដូរទៅរបៀបជ្រើសរើសដើម្បីផ្លាស់ប្ដូរ ឬផ្លាស់ទីធាតុ និងស្លាក។';
$ec_lang['lpn_mode_add_tank']='របៀប៖ បន្ថែមធុងទឹក។ ចុចលើផែនទីដើម្បីដាក់ធុងទឹកមួយ។ ប្ដូរទៅរបៀបជ្រើសរើសដើម្បីផ្លាស់ប្ដូរ ឬផ្លាស់ទីធាតុ និងស្លាក។';
$ec_lang['lpn_mode_add_pipe']='របៀប៖ បន្ថែមបំពង់។ ចុចថ្នាំងមួយ រួចថ្នាំងមួយទៀត ដើម្បីភ្ជាប់វា។ ចុចលើទំហំទំនេររវាងវា ដើម្បីបត់បន្ទាត់ ឬចុច Esc ដើម្បីចាប់ផ្ដើមឡើងវិញ។ ប្ដូរទៅរបៀបជ្រើសរើសដើម្បីផ្លាស់ប្ដូរ ឬផ្លាស់ទីធាតុ និងស្លាក។';
$ec_lang['lpn_mode_add_pump']='របៀប៖ បន្ថែមម៉ាស៊ីនបូម។ ចុចថ្នាំងមួយ រួចថ្នាំងមួយទៀត ដើម្បីភ្ជាប់វា។ ចុចលើទំហំទំនេររវាងវា ដើម្បីបត់បន្ទាត់ ឬចុច Esc ដើម្បីចាប់ផ្ដើមឡើងវិញ។ ប្ដូរទៅរបៀបជ្រើសរើសដើម្បីផ្លាស់ប្ដូរ ឬផ្លាស់ទីធាតុ និងស្លាក។';
$ec_lang['lpn_mode_add_valve']='របៀប៖ បន្ថែមវ៉ាល់។ ចុចលើថ្នាំងមួយ បន្ទាប់មកថ្នាំងមួយទៀត ដើម្បីភ្ជាប់ពួកវា។ ចុចលើទំហំទំនេររវាងវា ដើម្បីបត់បន្ទាត់ ឬចុច Esc ដើម្បីចាប់ផ្ដើមឡើងវិញ។ ប្ដូរទៅរបៀបជ្រើសរើសដើម្បីផ្លាស់ប្ដូរ ឬផ្លាស់ទីធាតុ និងស្លាក។';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='របៀប៖ បន្ថែមអក្សរ។ ចុចលើផែនទីដើម្បីដាក់ស្លាកអក្សរមួយ។ ចុចជិតថ្នាំងមួយដើម្បីភ្ជាប់អក្សរនោះទៅថ្នាំងនោះ។ ប្ដូរទៅរបៀបជ្រើសរើសដើម្បីផ្លាស់ប្ដូរ ឬផ្លាស់ទីធាតុ និងស្លាក។';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='ប្រើរបៀបនេះដើម្បីផ្លាស់ប្ដូរ ផ្លាស់ទី និងអូសវត្ថុនៅលើផែនទី។ នេះជារបៀបដែលទំព័រនេះត្រឡប់ទៅដោយលំនាំដើម៖ វាត្រឡប់មកទីនេះដោយខ្លួនឯង បន្ទាប់ពីសកម្មភាពខ្លះ ដូចជាការបើកគម្រោងមួយ ហើយគ្រាប់ចុច [Esc] នាំអ្នកមកទីនេះវិញពីរបៀបផ្សេងទៀតណាមួយ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='អ្នកអាចអូសស្លាកមួយដើម្បីផ្លាស់ទីវា។ ចុចទ្វេដងលើស្លាកមួយដើម្បីបញ្ជូនវាត្រឡប់ទៅទីតាំងស្វ័យប្រវត្តិរបស់វា។';
$ec_lang['lpn_field_auto']='ស្វ័យប្រវត្តិ';
$ec_lang['lpn_method_switch_confirm']='ការប្ដូរវិធីសាស្ត្រកកិតមិនផ្លាស់ប្ដូរលេខភាពក្រញ៉ោងដែលបានវាយបញ្ចូលរួចលើបំពង់របស់អ្នកទេ ហើយភាពក្រញ៉ោងសម្រាប់វិធីសាស្ត្រមួយគ្មានន័យសម្រាប់វិធីសាស្ត្រមួយទៀតឡើយ។ សូមត្រួតពិនិត្យបំពង់ទាំងអស់បន្ទាប់ពីនេះ។ ប្ដូរវាទោះជាយ៉ាងណា?';
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
$ec_lang['lpn_field_closed']='បិទ';
$ec_lang['lpn_field_closed_tip']='បិទបំពង់នេះ ដើម្បីកុំឲ្យទឹកអាចហូរកាត់វាបាន។ បំពង់នៅតែស្ថិតលើផែនទី និងរក្សាលេខទាំងអស់របស់វា ហើយអ្នកអាចបើកវាម្ដងទៀតបានគ្រប់ពេល។';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='បណ្ដោយ';
$ec_lang['lpn_field_lat']='ទទឹង';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='ទិសខាងជើង';
$ec_lang['lpn_field_easting']='ទិសខាងកើត';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='ជ';
$ec_lang['lpn_field_easting_abbr']='ក';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.


// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='វាយបញ្ចូលទីតាំងកូអរដោនេមួយ ដើម្បីដាក់ថ្នាំងនេះឲ្យបានច្បាស់លាស់។ នៅក្នុងសេណារីយ៉ូមួយ ទីតាំងនេះអនុវត្តតែក្នុងសេណារីយ៉ូនោះប៉ុណ្ណោះ ដូចការអូសវាដែរ; នៅក្នុង មូលដ្ឋាន វាដាក់ថ្នាំងនេះនៅគ្រប់ទីកន្លែង។';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='នោះនៅក្រៅផែនទី។ រយៈទទឹង Pseudo Mercator មានចន្លោះពី -85.05 ដល់ 85.05 ហើយបណ្ដោយមានចន្លោះពី -180 ដល់ 180។';
$ec_lang['lpn_field_text_size']='កត្តាគុណទំហំ';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='បង្ហាញនៅគ្រប់កម្រិតពង្រីកទាំងអស់';
$ec_lang['lpn_field_text_all_zoom_tip']='រក្សាអក្សរនេះនៅលើគំនូរ ទោះបីអ្នកបង្រួមឆ្ងាយប៉ុនណាក៏ដោយ។ ដកធីកវាចេញ ហើយអក្សរនេះនឹងលាក់ជាមួយស្លាកផ្សេងទៀត នៅពេលទិដ្ឋភាពទូលាយជាងកម្រិតកំណត់ស្លាកដែលបានកំណត់នៅក្រោម ផែនទី និងទំព័រ។';
$ec_lang['lpn_tool_labels']='ស្លាក';
$ec_lang['lpn_labels_heading_node']='ស្លាកថ្នាំង';
$ec_lang['lpn_labels_heading_link']='ស្លាកតំណ';
$ec_lang['lpn_labels_decimals_tip']='ចំនួនខ្ទង់ទសភាគបង្ហាញសម្រាប់ស្លាកនេះ';
$ec_lang['lpn_labels_mark_extrema']='សម្គាល់តម្លៃខ្ពស់បំផុត និងទាបបំផុត';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='គូរបន្ទាត់មួយពីលើតម្លៃខ្ពស់បំផុតនៃប្រភេទដែលមានស្លាកនីមួយៗលើផែនទី (បន្ទាត់លើ) និងបន្ទាត់មួយពីក្រោមតម្លៃទាបបំផុតនៃប្រភេទនោះ (បន្ទាត់ក្រោម) ដើម្បីឲ្យអ្នកអាចរកឃើញតម្លៃខ្ពស់បំផុត និងទាបបំផុត ដោយមិនចាំបាច់អានលេខ។';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='អនុវត្តទៅគ្រប់ធាតុ';
$ec_lang['lpn_settings_apply_to_all_tip']='ធាតុគ្រប់មួយប្រភេទនេះដែលបានគូររួចហើយ ទទួលបានលេខសម្គាល់ចាប់ផ្ដើមដោយអត្ថបទនេះ។ នីមួយៗរក្សាលេខរបស់វា។ លេខសម្គាល់ដែលមិនបញ្ចប់ដោយលេខ ត្រូវបានទុកចោលមិនប៉ះពាល់។';
$ec_lang['lpn_confirm_apply_prefix']='ប្ដូរឈ្មោះធាតុ {n} ដើម្បីឲ្យលេខសម្គាល់របស់វាចាប់ផ្ដើមដោយ {prefix} មែនទេ? នីមួយៗរក្សាលេខរបស់វា។';
$ec_lang['lpn_prefix_applied']='បានប្ដូរឈ្មោះធាតុ {n}។ ធាតុផ្សេងទៀត {skipped} ត្រូវបានទុកចោលមិនប៉ះពាល់។';
$ec_lang['lpn_labels_prefix_tip']='អត្ថបទបង្ហាញនៅមុនតម្លៃនេះលើផែនទី';
$ec_lang['lpn_labels_suffix_tip']='អត្ថបទបង្ហាញនៅក្រោយតម្លៃនេះលើផែនទី';
$ec_lang['lpn_labels_suffix_gradient_tip']='អត្ថបទបង្ហាញនៅក្រោយជម្រាលនៃការបាត់បង់ថ្ពល់លើផែនទី។ សូមកុំវាយសញ្ញាភាគរយនៅទីនេះ។ វាត្រូវបានបន្ថែមឲ្យដោយស្វ័យប្រវត្តិ នៅពេលឯកតាជាភាគរយ។';
$ec_lang['lpn_labels_separator']='អត្ថបទរវាងតម្លៃ';
$ec_lang['lpn_labels_separator_tip']='អត្ថបទរវាងតម្លៃមួយ និងតម្លៃបន្ទាប់នៅលើស្លាកមួយ។ លំនាំដើមជាចន្លោះមួយ។';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='អាទិភាព';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='លំដាប់ដែលតម្លៃត្រូវលុបចោល នៅពេលស្លាកមួយមិនសមទៅនឹងទំហំ។ លេខ 1 ត្រូវរក្សាទុកយូរបំផុត។';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='លំដាប់ដែលលក្ខណៈសម្បត្តិត្រូវបានលះបង់ នៅពេលស្លាកថ្នាំងពីរជាន់គ្នា។ លក្ខណៈសម្បត្តិដែលមានលេខ 1 ត្រូវបានលះបង់មុនគេ នៅលើស្លាកទាំងពីរ។ នៅពេលនៅសល់លក្ខណៈសម្បត្តិមួយ ហើយពួកវានៅតែជាន់គ្នា ស្លាកទាំងមូលមួយត្រូវបានលាក់៖ ស្លាកណាដែលតម្លៃដែលនៅសល់របស់វាមានតម្លៃទាបបំផុតសម្រាប់បង្ហាញ ដែលមានន័យថាតម្រូវការទាបបំផុត សម្ពាធនៅជិតកណ្ដាលជួរបំផុត ឬកម្ពស់ ឬថ្ពល់ដែលនៅជិតនឹងថ្នាំងជិតខាងបំផុត។';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='មុន';
$ec_lang['lpn_labels_col_after']='ក្រោយ';
$ec_lang['lpn_labels_col_decimals']='ខ្ទង់ទសភាគ';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='បង្ហាញ';
$ec_lang['lpn_labels_show_tip']='លំដាប់ដែលតម្លៃលេចឡើងនៅលើស្លាកមួយ។ តម្លៃដែលមានលេខ 1 មកមុនគេ៖ នៅកំពូលនៃស្លាកដែលមានច្រើនជាន់ និងនៅដើមស្លាកមួយបន្ទាត់។';
$ec_lang['lpn_labels_priority_customer_tip']='លំដាប់ដែលតម្លៃត្រូវបានទម្លាក់ចេញពីស្លាកអតិថិជនមួយ។ តម្លៃដែលមានលេខ 1 ត្រូវបានទម្លាក់ចេញមុនគេ។';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='ប្រើឯកតា';
$ec_lang['lpn_labels_use_units_tip']='ធីកដើម្បីបង្ហាញឯកតានៅក្នុងប្រអប់ បន្ទាប់ និងនៅលើស្លាក ហើយរក្សាវាឲ្យស្របគ្នានៅពេលឯកតាផ្លាស់ប្ដូរ។ ដកធីកចេញដើម្បីវាយបញ្ចូលអក្សរ បន្ទាប់ ផ្ទាល់ខ្លួនរបស់អ្នក។';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='ស្ថានភាពដំបូង';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='ពណ៌ថ្នាំង';
$ec_lang['lpn_settings_sym_link_colors']='ពណ៌តំណ';
$ec_lang['lpn_field_id']='លេខសម្គាល់';
$ec_lang['lpn_backdrop_menu']='រូបភាពផ្ទៃខាងក្រោយ…';
$ec_lang['lpn_backdrop_add']='បន្ថែម';
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
$ec_lang['lpn_backdrop_scale']='កំណត់មាត្រដ្ឋានដោយចុចចំណុច';
$ec_lang['lpn_backdrop_scale_entry']='កំណត់មាត្រដ្ឋានតាមឯកសារកូអរដោនេផែនទី ឬតាមទំហំភីកសែលមួយលើផែនទី';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='កំណត់មាត្រដ្ឋានពីទំហំបច្ចុប្បន្ន ជុំវិញចំណុចមួយដែលអ្នកជ្រើសរើស';
$ec_lang['lpn_backdrop_scale_from_prompt1']='ចុចលើចំណុចនៅលើរូបភាពផ្ទៃខាងក្រោយ ដែលគួរស្ថិតនៅកន្លែងដដែល។';
$ec_lang['lpn_backdrop_scale_from_prompt2']='កំណត់មាត្រដ្ឋានពីទំហំបច្ចុប្បន្នរបស់វា។ 1 រក្សាវាដដែល 1.1 ធ្វើឲ្យវាធំជាង 10% រីឯ 0.9 ធ្វើឲ្យវាតូចជាង 10%។';
$ec_lang['lpn_backdrop_scale_entry_prompt']='បញ្ចូលទំហំភីកសែលមួយលើផែនទី ឬបិទភ្ជាប់មាតិកាពេញលេញនៃឯកសារកូអរដោនេផែនទីសម្រាប់រូបភាព';
$ec_lang['lpn_backdrop_scale_entry_bad']='វាយបញ្ចូលលេខមួយសម្រាប់ទំហំភីកសែលមួយលើផែនទី ឬបិទភ្ជាប់ទាំងប្រាំមួយបន្ទាត់នៃឯកសារកូអរដោនេផែនទី។';
$ec_lang['lpn_backdrop_wld_bad']='ឯកសារកូអរដោនេផែនទីនេះបង្វិល ត្រឡប់ ឬលាតសន្ធឹងរូបភាពមិនស្មើគ្នា។ ផែនទីអាចផ្លាស់ទី និងប្តូរទំហំរូបភាពដោយកម្រិតដូចគ្នាទាំងពីរទិសប៉ុណ្ណោះ ដូច្នេះឯកសារនេះមិនត្រូវបានប្រើទេ។';
$ec_lang['lpn_backdrop_unreadable']='កម្មវិធីរុករករបស់អ្នកមិនអាចបង្ហាញរូបភាពនេះបានទេ។ សូមរក្សាទុកជា PNG ឬ JPEG រួចបញ្ចូលម្ដងទៀត។';
$ec_lang['lpn_backdrop_position']='ផ្លាស់ទី';
$ec_lang['lpn_backdrop_remove']='លុប';
$ec_lang['lpn_backdrop_remove_confirm']='លុបរូបភាពផ្ទៃខាងក្រោយមែនទេ?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='ផែនទីពិភពលោក…';
$ec_lang['lpn_map_attach_tip']='ភ្ជាប់ផែនទីពិភពលោកទៅគម្រោងនេះ ដោយមិនផ្លាស់ប្ដូរវាតាមមធ្យោបាយផ្សេងទៀតទេ។';
$ec_lang['lpn_map_attach_add']='ភ្ជាប់';
$ec_lang['lpn_map_attach_readjust']='លៃតម្រូវឡើងវិញ';
$ec_lang['lpn_map_attach_readjust_tip']='ត្រឡប់ទៅជំហានទី 2 នៃដំណើរការភ្ជាប់ផែនទី។';
$ec_lang['lpn_map_attach_scale_from']='ធ្វើមាត្រដ្ឋានពីទំហំបច្ចុប្បន្ន…';
$ec_lang['lpn_map_attach_scale_from_prompt']='ធ្វើមាត្រដ្ឋានផែនទីពីទំហំបច្ចុប្បន្នរបស់វា ជុំវិញកណ្ដាលគំនូររបស់អ្នក។ 1 រក្សាវាដដែល 1.1 ធ្វើឲ្យវាធំជាង 10% 0.9 ធ្វើឲ្យវាតូចជាង 10%។';
$ec_lang['lpn_map_attach_scale_from_bad']='វាយបញ្ចូលលេខតែមួយធំជាងសូន្យ។';
$ec_lang['lpn_map_attach_scale_from_done']='ផែនទីត្រូវបានប្ដូរទំហំ ហើយគំនូររបស់អ្នក និងកូអរដោនេគ្រប់មួយនៅក្នុងវានៅដដែលយ៉ាងពិតប្រាកដ។';
$ec_lang['lpn_map_attach_none']='មិនទាន់មានផែនទីពិភពលោកភ្ជាប់ទៅគម្រោងនេះនៅឡើយទេ។ សូមប្រើ ផែនទី, ផែនទីពិភពលោក, ភ្ជាប់ មុនសិន។';
$ec_lang['lpn_map_attach_remove']='ផ្ដាច់';
$ec_lang['lpn_map_attach_remove_tip']='ដកផែនទីពិភពលោកចេញ។ គំនូរ និងកូអរដោនេរបស់វាមិនប៉ះពាល់ទេ ទោះក្នុងករណីណាក៏ដោយ។';
$ec_lang['lpn_map_attach_done']='ផែនទីពិភពលោកឥឡូវនេះនៅពីក្រោយគំនូររបស់អ្នក ហើយគម្រោងរបស់អ្នកមិនផ្លាស់ប្ដូរទេ។ សូមប្រើ ផែនទី, ផែនទីពិភពលោក, ផ្ដាច់ ដើម្បីដកវាចេញម្ដងទៀត។';
$ec_lang['lpn_map_attach_removed']='ផែនទីពិភពលោកបានបាត់ទៅ ហើយគំនូរនៅដដែលយ៉ាងពិតប្រាកដ។';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='គំនូររបស់អ្នកនៅលើផែនទីពិភពលោកទាំងមូល នៅក្នុងមហាសមុទ្រត្រង់រយៈទទឹង និងបណ្ដោយភូមិសាស្ត្រសូន្យ។ សូមរកទីកន្លែងផ្ទាល់ខ្លួនរបស់អ្នកជាមុនសិន៖ អូស និងពង្រីក/បង្រួមផែនទីនៅពីក្រោយគំនូរ ស្វែងរកឈ្មោះកន្លែងមួយ ឬវាយបញ្ចូលរយៈទទឹង និងបណ្ដោយភូមិសាស្ត្រមួយ។ គំនូរខ្លួនឯងមិនផ្លាស់ទីទេ។';
$ec_lang['lpn_mapgeo_step1']='ជំហានទី 1 នៃ 2៖ រកទីកន្លែងរបស់អ្នកនៅលើពិភពលោក';
$ec_lang['lpn_mapgeo_step2']='ជំហានទី 2 នៃ 2៖ ដាក់ផែនទីឲ្យសមនឹងគំនូររបស់អ្នក';
$ec_lang['lpn_mapgeo_hint1']='អូស និងពង្រីក/បង្រួមផែនទីនៅពីក្រោយគំនូររបស់អ្នក ឬស្វែងរកកន្លែងមួយ ឬវាយបញ្ចូលរយៈទទឹង និងបណ្ដោយភូមិសាស្ត្រមួយ។ បន្ទាប់មកចុច ដាក់ប្រហែល។';
$ec_lang['lpn_mapgeo_readjust_intro']='គំនូររបស់អ្នកនៅកន្លែងដែលអ្នកបានដាក់វាចុងក្រោយ។ ដើម្បីផ្លាស់ទីវាទៅកន្លែងផ្សេង សូមអូស និងពង្រីក/បង្រួមផែនទីនៅពីក្រោយគំនូរ ស្វែងរកឈ្មោះកន្លែងមួយ ឬវាយបញ្ចូលរយៈទទឹង និងបណ្ដោយភូមិសាស្ត្រមួយ។ គំនូរខ្លួនឯងមិនផ្លាស់ទីទេ។';
$ec_lang['lpn_mapgeo_hint2']='អូសកន្លែងណាមួយដើម្បីរអិលផែនទីនៅក្រោមគំនូររបស់អ្នក។ គំនូររបស់អ្នក និងកូអរដោនេគ្រប់មួយនៅក្នុងវានៅតែនៅកន្លែងដដែលយ៉ាងពិតប្រាកដ។ ចុច តម្រៀបភូមិសាស្ត្រនៅទីនេះ នៅពេលផែនទីត្រឹមត្រូវហើយ។';
$ec_lang['lpn_mapgeo_gestures']='ការពង្រីក/បង្រួមផ្លាស់ទីគំនូររបស់អ្នក និងផែនទីជាមួយគ្នា ដូច្នេះអ្នកអាចមើលឃើញថាតើពួកវាតម្រឹមគ្នាបានល្អប៉ុនណា។ ការអូសផ្លាស់ទីតែផែនទីប៉ុណ្ណោះ។';
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
$ec_lang['lpn_mapgeo_dial_turn']='បង្វិលផែនទី';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} អង្សា';
$ec_lang['lpn_mapgeo_dial_size']='ទំហំផែនទី';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} ដង';
$ec_lang['lpn_mapgeo_dial_help']='អូសរបាររំកិលទាំងពីរ ឬវាយបញ្ចូលនៅក្នុងប្រអប់ខាងលើពួកវា ដើម្បីធ្វើឲ្យផែនទីធំ ឬតូចជាង និងបង្វិលវា។ កណ្ដាលនៃរបារនីមួយៗគឺជាជំហានទី 1 ដែលទុកនៅឆ្វេង ដូច្នេះ 1 និង 0 មានន័យថាទុកវាមិនប្ដូរ។ គ្រាប់ចុចព្រួញដំណើរការនៅលើទាំងពីរ។';
$ec_lang['lpn_mapgeo_place']='ដាក់ប្រហែល';
$ec_lang['lpn_mapgeo_finish']='តម្រៀបភូមិសាស្ត្រនៅទីនេះ';
$ec_lang['lpn_mapgeo_cancelled']='ផែនទីពិភពលោកបានត្រឡប់ទៅកន្លែងដើមរបស់វា ហើយគំនូររបស់អ្នកមិនដែលផ្លាស់ទីទេ។';
$ec_lang['lpn_mapgeo_locked']='បញ្ចប់ជាមួយប៊ូតុង តម្រៀបភូមិសាស្ត្រនៅទីនេះ ឬចុច បោះបង់ មុននឹងប្ដូរគម្រោង ឬរក្សាទុក។ ផែនទីពិភពលោកនៅតែកំពុងត្រូវបានដាក់។';
$ec_lang['lpn_backdrop_scale_prompt1']='ចុចពីរចំណុចលើរូបភាពផ្ទៃខាងក្រោយ ដូចជាចុងទាំងពីរនៃរបារមាត្រដ្ឋាន។ បន្ទាប់មកវាយចម្ងាយពិតប្រាកដរវាងចំណុចទាំងពីរ។';
$ec_lang['lpn_backdrop_scale_prompt2']='ចម្ងាយពិតប្រាកដរវាងចំណុចទាំងពីរ';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='ចុចចំណុចគោល (លើរូបភាព) សម្រាប់ការផ្លាស់ទី។';
$ec_lang['lpn_backdrop_position_prompt2']='ជ្រើសរើសវិធីសម្រាប់ចំណុចដែលត្រូវទៅដល់ រួចចុច បន្ត។';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='កំពុងកែសម្រួលរូបភាពផ្ទៃខាងក្រោយ។';
$ec_lang['lpn_backdrop_target_label']='ផ្លាស់ទីចំណុចនោះទៅ៖';
$ec_lang['lpn_backdrop_target_node']='ថ្នាំងមួយ';
$ec_lang['lpn_backdrop_target_free']='ចំណុចណាមួយលើផែនទី';
$ec_lang['lpn_backdrop_target_coords']='កូអរដោនេដែលអ្នកវាយបញ្ចូល';
$ec_lang['lpn_backdrop_coords_prompt']='វាយ X,Y ដែលចំណុចនោះគួរផ្លាស់ទីទៅ';
$ec_lang['lpn_backdrop_continue']='បន្ត';
$ec_lang['lpn_tool_settings']='ការកំណត់';
$ec_lang['lpn_settings_show_titles']='បង្ហាញចំណងជើងទំព័រ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='លាក់ក្បាលទំព័រ និងបន្ទាត់ស្វាគមន៍ខាងលើគំនូរ ដើម្បីឲ្យផែនទីមានកន្លែងច្រើនជាង។ ការបោះពុម្ពមិនផ្លាស់ប្ដូរទេ។';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='លាក់ចំណងជើងទាំងនេះ';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='បង្ហាញជំនួយការជ្រើសរើស';
$ec_lang['lpn_settings_area_hint_tip']='បង្ហាញពពុះនៅលើផែនទីដែលប្រាប់ថាការចុចបន្ទាប់របស់អ្នកនឹងធ្វើអ្វី ខណៈអ្នកកំពុងជ្រើសរើសតំបន់មួយ។';
$ec_lang['lpn_settings_id_prefixes']='បុព្វបទលេខសម្គាល់';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='តម្លៃពេលបង្កើតថ្មី';
$ec_lang['lpn_settings_defaults_note']='ប្រើសម្រាប់ធាតុដែលអ្នកបង្កើតចាប់ពីពេលនេះតទៅ។ ធាតុដែលមានស្រាប់មិនផ្លាស់ប្ដូរទេ។';
$ec_lang['lpn_settings_push_note']='មានតែលក្ខណៈសម្បត្តិដែលស្លាករបស់វាកំពុងបង្ហាញឥឡូវនេះប៉ុណ្ណោះដែលត្រូវបានអនុវត្ត។';
$ec_lang['lpn_settings_push_btn']='អនុវត្តតម្លៃចាប់ផ្ដើមទៅធាតុទាំងអស់';
$ec_lang['lpn_push_confirm']='ជំនួសលក្ខណៈសម្បត្តិទាំងនេះនៅលើធាតុដែលមានស្រាប់ទាំងអស់ដោយតម្លៃចាប់ផ្ដើមបច្ចុប្បន្នមែនទេ? តម្លៃដែលអ្នកបានវាយបញ្ចូលនឹងត្រូវបានសរសេរជាន់ពីលើ។ អ្នកអាចត្រឡប់ក្រោយសកម្មភាពនេះបាន។';
$ec_lang['lpn_push_properties']='លក្ខណៈសម្បត្តិ៖';
$ec_lang['lpn_push_assets']='ថ្នាំង និងបំពង់៖';
$ec_lang['lpn_push_none_displayed']='គ្មានតម្លៃចាប់ផ្ដើមណាមួយកំពុងបង្ហាញជាស្លាកឥឡូវនេះទេ ដូច្នេះគ្មានអ្វីត្រូវអនុវត្តទេ។ បើកស្លាកសម្រាប់លក្ខណៈសម្បត្តិដែលអ្នកចង់បាននៅក្នុងបន្ទះស្លាក រួចសាកល្បងម្ដងទៀត។';
$ec_lang['lpn_push_nothing']='គ្មានធាតុមានស្រាប់ណាមួយមានលក្ខណៈសម្បត្តិណាមួយក្នុងចំណោមដែលកំពុងអនុវត្តទេ។';
$ec_lang['lpn_push_no_change']='ធាតុគ្រប់យ៉ាងមានតម្លៃទាំងនេះរួចហើយ ដូច្នេះគ្មានអ្វីនឹងផ្លាស់ប្ដូរទេ។';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='លក្ខណៈសម្បត្តិផ្ទាល់ខ្លួន';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='លក្ខណៈសម្បត្តិដែលអ្នកកំណត់ដោយខ្លួនឯង សម្រាប់គោលបំណងផ្ទាល់ខ្លួនរបស់អ្នក។ វាត្រូវបានរក្សាទុកជាមួយគម្រោង និងសេណារីយ៉ូ ដូចលក្ខណៈសម្បត្តិផ្សេងទៀតទាំងអស់។';
$ec_lang['lpn_cp_design']='ការរចនា';
$ec_lang['lpn_cp_design_tip']='មួយជួរក្នុងមួយលក្ខណៈសម្បត្តិផ្ទាល់ខ្លួន ហើយនីមួយៗបើកឲ្យបង្ហាញ៖ លេខសម្គាល់, ស្លាក, អនុវត្តចំពោះ, ផ្ទៀងផ្ទាត់ជា, អនុញ្ញាត ឬដាក់កម្រិត, វាលអក្សរដែលដាក់ឈ្មោះដោយជម្រើសនោះ, ដែនកំណត់ចំនួនតួអក្សរទាប, ដែនកំណត់ចំនួនតួអក្សរខ្ពស់, ដែនកំណត់ទាប, ដែនកំណត់ខ្ពស់។';
$ec_lang['lpn_cp_add']='បន្ថែមលក្ខណៈសម្បត្តិផ្ទាល់ខ្លួន';
$ec_lang['lpn_cp_add_tip']='បន្ថែមជួរមួយទៅតារាងរចនា ហើយបើកវាសម្រាប់ការកែសម្រួល។';
$ec_lang['lpn_cp_remove']='លុបចេញ';
$ec_lang['lpn_cp_remove_tip']='លុបលក្ខណៈសម្បត្តិនេះចេញពីតារាងរចនា។ តម្លៃដែលបានវាយបញ្ចូលរួចហើយនៅលើធាតុរបស់អ្នកនៅតែស្ថិតនៅក្នុងឯកសារ ហើយនឹងវិលត្រឡប់មកវិញ ប្រសិនបើអ្នករចនាលេខសម្គាល់ដដែលនោះម្ដងទៀត។';
$ec_lang['lpn_cp_none']='មិនទាន់មានលក្ខណៈសម្បត្តិផ្ទាល់ខ្លួនណាមួយត្រូវបានរចនានៅឡើយទេ។';
$ec_lang['lpn_cp_unnamed']='មិនទាន់មានឈ្មោះនៅឡើយទេ';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='លេខសម្គាល់';
$ec_lang['lpn_cp_key_tip']='លេខសម្គាល់៖ លក្ខណៈសម្បត្តិមួយត្រូវបានរក្សាទុកក្រោមឈ្មោះនេះ។ គ្មានចន្លោះស្រកត្រូវបានអនុញ្ញាតទេ ហើយបុព្វបទមួយត្រូវបានបន្ថែមឲ្យអ្នកដោយស្វ័យប្រវត្តិ ដូច្នេះលេខសម្គាល់របស់អ្នកមិនអាចប៉ះទង្គិចជាមួយវាលដែលមានស្រាប់បានឡើយ។';
$ec_lang['lpn_cp_label']='ស្លាក';
$ec_lang['lpn_cp_label_tip']='ស្លាក៖ អ្នកអានឃើញអត្ថបទនេះនៅលើប្រអប់លក្ខណៈសម្បត្តិ នៅក្នុង ស្វែងរក និងនៅក្បាលជួរឈរតារាង។';
$ec_lang['lpn_cp_applies']='អនុវត្តចំពោះ';
$ec_lang['lpn_cp_applies_tip']='អនុវត្តចំពោះ៖ បញ្ជីបុព្វបទលេខសម្គាល់ដែលបំបែកដោយក្បៀស សម្រាប់ធាតុដែលប្រើលក្ខណៈសម្បត្តិនេះ ដូចជា J,L,R។';
$ec_lang['lpn_cp_validate']='ផ្ទៀងផ្ទាត់ជា';
$ec_lang['lpn_cp_validate_tip']='ផ្ទៀងផ្ទាត់ជា៖ នេះប្រាប់ថាតម្លៃល្អមួយមើលទៅដូចម្ដេច។ ច្បាប់ករណីអក្សរអានតែអក្ខរក្រមអង់គ្លេសប៉ុណ្ណោះ ដែលជាដែនកំណត់ដែលបានចែងច្បាស់។ ជ្រើសរើស កុំផ្ទៀងផ្ទាត់ ដើម្បីទទួលយកអ្វីក៏ដោយ។';
$ec_lang['lpn_cp_restrict']='ដាក់កម្រិតតួអក្សរទាំងនេះ';
$ec_lang['lpn_cp_restrict_tip']='ដាក់កម្រិតតួអក្សរទាំងនេះ៖ តម្លៃមួយអាចប្រើបានតែតួអក្សរដែលបានរាយនៅទីនេះ ឬគ្មានតួណាមួយក្នុងចំណោមនោះទេ ដែល "@" មានន័យថាអក្សរណាមួយ "#" មានន័យថាខ្ទង់លេខណាមួយ ហើយអ្នកត្រូវរាយ "-", "." និង "," ដាច់ដោយឡែក ប្រសិនបើត្រូវបានអនុញ្ញាត ហើយតួអក្សរចន្លោះស្រកណាមួយត្រូវតែស្ថិតនៅចន្លោះតួអក្សរផ្សេងទៀត។';
$ec_lang['lpn_cp_restrict_mode']='អនុញ្ញាត ឬដាក់កម្រិត';
$ec_lang['lpn_cp_restrict_mode_tip']='អនុញ្ញាត ឬដាក់កម្រិត៖ តួអក្សរដែលបានផ្ដល់ ជាតួដែលតម្លៃមួយអាចប្រើបានតែប៉ុណ្ណោះ ឬតួដែលវាមិនអាចប្រើបានឡើយ។';
$ec_lang['lpn_cp_restrict_allow']='អនុញ្ញាតតែតួអក្សរទាំងនេះ';
$ec_lang['lpn_cp_restrict_deny']='ដាក់កម្រិតតួអក្សរទាំងនេះ';
$ec_lang['lpn_cp_minlength']='ដែនកំណត់ចំនួនតួអក្សរទាប';
$ec_lang['lpn_cp_minlength_tip']='ដែនកំណត់ចំនួនតួអក្សរទាប៖ ការវាយបញ្ចូលខ្លីជាងនេះនឹងត្រូវបានសម្គាល់ ដែលជាមធ្យោបាយអ្នករកឃើញការវាយបញ្ចូលទទេ និងពាក់កណ្ដាល។';
$ec_lang['lpn_cp_length']='ដែនកំណត់ចំនួនតួអក្សរខ្ពស់';
$ec_lang['lpn_cp_length_tip']='ដែនកំណត់ចំនួនតួអក្សរខ្ពស់៖ ការវាយបញ្ចូលវែងជាងនេះនឹងត្រូវបានសម្គាល់។';
$ec_lang['lpn_cp_low']='ដែនកំណត់ទាប';
$ec_lang['lpn_cp_low_tip']='ដែនកំណត់ទាប៖ នេះជាតម្លៃតូចបំផុតដែលអ្នករំពឹងទុក។ លេខត្រូវបានប្រៀបធៀបជាលេខ ហើយអត្ថបទត្រូវបានប្រៀបធៀបតាមលំដាប់វចនានុក្រម។';
$ec_lang['lpn_cp_high']='ដែនកំណត់ខ្ពស់';
$ec_lang['lpn_cp_high_tip']='ដែនកំណត់ខ្ពស់៖ នេះជាតម្លៃធំបំផុតដែលអ្នករំពឹងទុក។ លេខត្រូវបានប្រៀបធៀបជាលេខ ហើយអត្ថបទត្រូវបានប្រៀបធៀបតាមលំដាប់វចនានុក្រម។';
$ec_lang['lpn_cp_val_none']='កុំផ្ទៀងផ្ទាត់';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='លេខ .';
$ec_lang['lpn_cp_val_number_comma']='លេខ ,';
$ec_lang['lpn_cp_val_integer']='លេខគត់';
$ec_lang['lpn_cp_val_upper']='អក្សរធំទាំងអស់';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}៖ {reason} តម្លៃនេះនៅតែដដែលដូចអ្នកបានវាយបញ្ចូល។';
$ec_lang['lpn_cp_bad_number']='តម្លៃនេះមិនមែនជាលេខតាមដែលលក្ខណៈសម្បត្តិនេះទាមទារឡើយ។';
$ec_lang['lpn_cp_bad_integer']='តម្លៃនេះមិនមែនជាលេខគត់តាមដែលលក្ខណៈសម្បត្តិនេះទាមទារឡើយ។';
$ec_lang['lpn_cp_bad_case']='តម្លៃនេះមិនមែនជាអក្សរធំទាំងអស់តាមដែលលក្ខណៈសម្បត្តិនេះទាមទារឡើយ។';
$ec_lang['lpn_cp_bad_chars']='តម្លៃនេះប្រើតួអក្សរដែលលក្ខណៈសម្បត្តិនេះមិនអនុញ្ញាត។';
$ec_lang['lpn_cp_bad_space']='ចន្លោះស្រកត្រូវបានអនុញ្ញាតតែនៅចន្លោះតួអក្សរផ្សេងទៀតប៉ុណ្ណោះ។';
$ec_lang['lpn_cp_bad_minlength']='តម្លៃនេះខ្លីជាងអ្វីដែលលក្ខណៈសម្បត្តិនេះអនុញ្ញាត។';
$ec_lang['lpn_cp_bad_length']='តម្លៃនេះវែងជាងអ្វីដែលលក្ខណៈសម្បត្តិនេះអនុញ្ញាត។';
$ec_lang['lpn_cp_bad_low']='តម្លៃនេះទាបជាងដែនកំណត់ទាបនៃលក្ខណៈសម្បត្តិនេះ។';
$ec_lang['lpn_cp_bad_high']='តម្លៃនេះខ្ពស់ជាងដែនកំណត់ខ្ពស់នៃលក្ខណៈសម្បត្តិនេះ។';
$ec_lang['lpn_cp_key_needed']='សូមផ្ដល់លេខសម្គាល់មួយដែលគ្មានចន្លោះស្រកឲ្យលក្ខណៈសម្បត្តិផ្ទាល់ខ្លួននេះ។';
$ec_lang['lpn_cp_key_taken']='លក្ខណៈសម្បត្តិផ្ទាល់ខ្លួនផ្សេងទៀតកំពុងប្រើលេខសម្គាល់នោះរួចហើយ។';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='សេណារីយ៉ូ';
$ec_lang['lpn_scenario_base']='មូលដ្ឋាន';
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
$ec_lang['lpn_scenario_overrides']='ចំនួនតម្លៃផ្ទាល់ខ្លួន';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='រង្វង់ពណ៌លឿងទុំមានន័យថាធាតុនេះមានតម្លៃដែលជារបស់សេណារីយ៉ូ {name} តែម្នាក់ឯង។';
$ec_lang['lpn_scenario_overrides_tip']='តម្លៃនីមួយៗទាំងនោះត្រូវបានសម្គាល់នៅលើផែនទីដោយរង្វង់ពណ៌លឿងទុំ។ ប្ដូរទៅ {base} ដើម្បីមើលគំនូរដោយគ្មានពួកវា។';
$ec_lang['lpn_scenario_menu']='សេណារីយ៉ូ';
$ec_lang['lpn_scenario_tip']='សំណុំតម្លៃដែលគំនូរកំពុងបង្ហាញ និងទំព័រកំពុងដោះស្រាយឥឡូវនេះ។ ចុចដើម្បីប្ដូរសេណារីយ៉ូ ឬដើម្បីបន្ថែម ប្ដូរឈ្មោះ ឬលុបមួយ។';
$ec_lang['lpn_scenario_new']='សេណារីយ៉ូថ្មី…';
$ec_lang['lpn_scenario_new_name']='សេណារីយ៉ូ {n}';
$ec_lang['lpn_scenario_prompt_name']='ឈ្មោះសម្រាប់សេណារីយ៉ូនេះ';
$ec_lang['lpn_scenario_rename']='ប្ដូរឈ្មោះសេណារីយ៉ូ…';
$ec_lang['lpn_scenario_delete']='លុបសេណារីយ៉ូ';
$ec_lang['lpn_scenario_delete_confirm']='លុបសេណារីយ៉ូ {name} និងតម្លៃ {n} ដែលជារបស់វាតែម្នាក់ឯង? គំនូរខ្លួនវាមិនត្រូវបានផ្លាស់ប្ដូរទេ។';
$ec_lang['lpn_scenario_override']='តែក្នុងសេណារីយ៉ូនេះប៉ុណ្ណោះ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='ធីកមានន័យថាតម្លៃនេះជារបស់សេណារីយ៉ូនេះតែម្នាក់ឯង សូម្បីតែពេលវាជាលេខដូចគ្នានឹងមូលដ្ឋានក៏ដោយ។ ដកធីកចេញ ដើម្បីប្រើតម្លៃមូលដ្ឋានវិញ។';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='សេណារីយ៉ូមូលដ្ឋាន៖ {value}';
$ec_lang['lpn_scenario_deactivated']='{id} ស្ថិតនៅក្រៅបណ្ដាញនៅក្នុង {scenario}។ វានៅតែស្ថិតលើគំនូរ និងនៅក្នុងសេណារីយ៉ូផ្សេងទៀតរបស់អ្នក។';
$ec_lang['lpn_scenario_push_btn']='អនុវត្តតម្លៃមូលដ្ឋានទៅគ្រប់សេណារីយ៉ូ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='សេណារីយ៉ូគ្រប់មួយត្រឡប់ទៅតម្លៃមូលដ្ឋានវិញ សម្រាប់លក្ខណៈសម្បត្តិដែលស្លាករបស់វាកំពុងបង្ហាញឥឡូវនេះ។ តម្លៃដែលជារបស់សេណារីយ៉ូទាំងនោះតែម្នាក់ឯង ត្រូវបានបោះបង់ចោល។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='ធ្វើឲ្យសេណារីយ៉ូគ្រប់មួយប្រើតម្លៃមូលដ្ឋានសម្រាប់លក្ខណៈសម្បត្តិទាំងនេះ? តម្លៃដែលជារបស់សេណារីយ៉ូទាំងនោះតែម្នាក់ឯង ត្រូវបានបោះបង់ចោល។ អ្នកអាចមិនធ្វើវិញនូវសកម្មភាពនេះបាន។';
$ec_lang['lpn_scenario_push_scenarios']='សេណារីយ៉ូដែលរងផលប៉ះពាល់៖';
$ec_lang['lpn_scenario_push_values']='តម្លៃដែលនឹងត្រូវបោះបង់ចោល៖';
$ec_lang['lpn_scenario_push_none']='គ្មានសេណារីយ៉ូណាមួយមានតម្លៃផ្ទាល់ខ្លួនសម្រាប់លក្ខណៈសម្បត្តិទាំងនេះទេ ដូច្នេះគ្មានអ្វីនឹងផ្លាស់ប្ដូរឡើយ។ គ្មានអ្វីត្រូវបានបោះបង់ចោលទេ។';
$ec_lang['lpn_delete_drops_overrides']='ការលុបធាតុនេះក៏បោះបង់ចោលតម្លៃ {n} ដែលសេណារីយ៉ូរបស់អ្នកកាន់សម្រាប់វាដែរ។ បន្តទេ?';
$ec_lang['lpn_push_base_only']='សកម្មភាពនេះផ្លាស់ប្ដូរគំនូរខ្លួនវា ដូច្នេះវាអាចធ្វើបានតែនៅក្នុង {base} ប៉ុណ្ណោះ។ សូមប្ដូរទៅ {base} ហើយសាកល្បងម្ដងទៀត។';
$ec_lang['lpn_field_active']='ជាផ្នែកនៃបណ្ដាញនេះ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='ដកធីកចេញពីប្រអប់នេះ ដើម្បីទុកធាតុនៅលើគំនូរ ប៉ុន្តែនៅក្រៅបណ្ដាញ៖ វាត្រូវបានគូរជាពណ៌ប្រផេះ ហើយឧបករណ៍ដោះស្រាយមិនរាប់វាទេ។ នៅក្នុងសេណារីយ៉ូមួយ នេះជាវិធីដែលបំពង់ដែលស្នើឡើងត្រូវបានបើក និងបិទ។';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='និទស្សន្តកន្លែងលេច';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='និទស្សន្តនៅក្នុងសមីការឧបករណ៍ចំណោចទឹករបស់ EPANET សម្រាប់ឧបករណ៍បាញ់ទឹក និងការលេច៖ លំហូរ = មេគុណ x សម្ពាធលើកអំណាចដល់និទស្សន្តនេះ។ វាផ្លាស់ប្ដូរចម្លើយតែនៅកន្លែងដែលថ្នាំងមួយមានឧបករណ៍ចំណោចទឹកប៉ុណ្ណោះ ដែលឥឡូវនេះមានន័យថាបណ្ដាញដែលបានអានពីឯកសារ EPANET។';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='អាន DEM';
$ec_lang['lpn_elev_dem_sample_tip']='អានកម្ពស់ DEM នៅថ្នាំងនេះ ហើយបង្ហាញវានៅខាងក្រោម។ គ្មានអ្វីនៅក្នុងប្រអប់ កម្ពស់ ត្រូវបានផ្លាស់ប្ដូរទេ។ គុណភាពដោះស្រាយផ្ដេកនៃ DEM មានប្រហែល 30 ម៉ែត្រ សម្រាប់ភាគច្រើននៃផែនដី ហើយកាន់តែល្អិតជាងនេះនៅកន្លែងដែលមានទិន្នន័យប្រសើរជាង។';
$ec_lang['lpn_elev_dem_use']='ប្រើ DEM';
$ec_lang['lpn_elev_dem_use_tip']='ដាក់កម្ពស់ DEM នៅថ្នាំងនេះទៅក្នុងប្រអប់ កម្ពស់ ខាងលើ ដោយជំនួសអ្វីដែលមាននៅទីនោះ។ វាអាន DEM មុនសិន ប្រសិនបើមិនទាន់បានអានទេ។ ការមិនធ្វើវិញម្ដង នាំវាត្រឡប់មកវិញ។';
$ec_lang['lpn_elev_dem_none']='DEM គ្មានកម្ពស់សម្រាប់ថ្នាំងនេះទេ។';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM ប្រាប់ថា {v} {u}។';
$ec_lang['lpn_settings_elev_source']='ប្រភពកម្ពស់';
$ec_lang['lpn_settings_elev_source_tip']='កន្លែងដែលថ្នាំងថ្មីទទួលបានកម្ពស់របស់វា។ ផ្ទៃដីត្រូវបានអានពី Mapbox DEM ដែលមានទទឹងប្រហែល 30 ម៉ែត្រ លើភាគច្រើននៃផែនដី ហើយកាន់តែល្អិតជាងនេះនៅកន្លែងដែលមានទិន្នន័យប្រសើរជាង។';
$ec_lang['lpn_settings_elev_source_typed']='កម្ពស់ដែលបានវាយបញ្ចូលខាងលើ';
$ec_lang['lpn_settings_elev_source_dem']='ស្រទាប់ Mapbox DEM';
$ec_lang['lpn_settings_accuracy']='ភាពត្រឹមត្រូវ';
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
$ec_lang['lpn_settings_default_is']='តម្លៃលំនាំដើមគឺ {n}។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='ថាតើឧបករណ៍ដោះស្រាយត្រូវជិតប៉ុណ្ណាមុននឹងឈប់ វាស់ជាទំហំដែលលំហូរនៅតែផ្លាស់ប្ដូរពីជុំមួយទៅជុំបន្ទាប់។ លេខតូចជាងមានភាពត្រឹមត្រូវជាង ប៉ុន្តែចំណាយពេលច្រើនជាង។ ឧបករណ៍ដោះស្រាយទាំងពីរអានប្រអប់តែមួយនេះ ហើយនីមួយៗវាស់ការផ្លាស់ប្ដូរនោះធៀបនឹងផលបូកខុសគ្នា៖ ឧបករណ៍ដោះស្រាយខាងក្នុងធៀបនឹងផលបូកនៃតម្រូវការ EPANET ធៀបនឹងផលបូកនៃលំហូរតំណ។ ទុកទទេ ទំព័រនេះប្រើភាពត្រឹមត្រូវតឹងជាងលំនាំដើមផ្ទាល់របស់ EPANET។';
$ec_lang['lpn_settings_specific_gravity']='ទម្ងន់ជាក់លាក់';
$ec_lang['lpn_settings_specific_gravity_tip']='ទម្ងន់នៃវត្ថុរាវធៀបនឹងទឹក។ វាផ្លាស់ប្ដូរសម្ពាធដែលឧបករណ៍វាស់អាចអាន មិនមែនលំហូរទេ។';
$ec_lang['lpn_settings_viscosity']='ភាពខាប់ទាក់ទង';
$ec_lang['lpn_settings_viscosity_tip']='ភាពខាប់នៃវត្ថុរាវធៀបនឹងទឹកនៅ 20 អង្សាសេ។ វាផ្លាស់ប្ដូរចម្លើយតែក្រោមវិធីសាស្ត្រ Darcy-Weisbach ប៉ុណ្ណោះ។';
$ec_lang['lpn_settings_trials']='ជុំអតិបរមា';
$ec_lang['lpn_settings_trials_tip']='ចំនួនជុំដែលត្រូវបានអនុញ្ញាត មុននឹងឧបករណ៍ដោះស្រាយបោះបង់លើបណ្ដាញដែលមិនប្រសព្វគ្នា។';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='ប្រសិនបើវាមិនប្រសព្វគ្នា';
$ec_lang['lpn_settings_unbalanced_tip']='អ្វីត្រូវធ្វើជាមួយបណ្ដាញដែលបានប្រើអស់ជុំរបស់វា ហើយនៅតែមិនប្រសព្វគ្នា។ ការអនុញ្ញាតឲ្យមានជុំបន្ថែម ជាញឹកញាប់នាំឲ្យប្រសព្វគ្នា។ ការឈប់ រាយការណ៍ជុំចុងក្រោយតាមស្ថានភាពរបស់វា ដែលមិនមែនជាដំណោះស្រាយទេ។ មានតែឧបករណ៍ដោះស្រាយ EPANET ប៉ុណ្ណោះដែលអានប្រអប់នេះ។ ឧបករណ៍ដោះស្រាយខាងក្នុងតែងតែឈប់ ហើយសម្គាល់ចម្លើយថាមិនប្រសព្វគ្នា។';
$ec_lang['lpn_settings_unbalanced_continue']='អនុញ្ញាតឲ្យមានជុំបន្ថែម';
$ec_lang['lpn_settings_unbalanced_stop']='ឈប់ ហើយរាយការណ៍ជុំចុងក្រោយ';
$ec_lang['lpn_settings_unbalanced_trials']='ជុំបន្ថែមមុននឹងរាយការណ៍';
$ec_lang['lpn_settings_unbalanced_trials_tip']='ចំនួនជុំបន្ថែមទៀតត្រូវអនុញ្ញាត បន្ទាប់ពីអតិបរមាខាងលើត្រូវបានប្រើអស់ មុននឹងជុំចុងក្រោយត្រូវបានរាយការណ៍។ មានតែឧបករណ៍ដោះស្រាយ EPANET ប៉ុណ្ណោះដែលអានប្រអប់នេះ។';
$ec_lang['lpn_settings_head_error']='កម្រិតកំហុសថ្ពល់';
$ec_lang['lpn_settings_head_error_tip']='ការធ្វើតេស្តបន្ថែមមួយដែលឧបករណ៍ដោះស្រាយត្រូវតែឆ្លងកាត់ មុននឹងឈប់៖ កំហុសថ្ពល់ធំបំផុតដែលនៅសល់ក្នុងបំពង់មួយណាមួយ។ សូន្យមានន័យថាកុំអនុវត្តតេស្តនេះ។ មានតែឧបករណ៍ដោះស្រាយ EPANET ប៉ុណ្ណោះដែលអានប្រអប់នេះ។';
$ec_lang['lpn_settings_flow_change']='កម្រិតការផ្លាស់ប្ដូរលំហូរ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='ការធ្វើតេស្តបន្ថែមមួយដែលឧបករណ៍ដោះស្រាយត្រូវតែឆ្លងកាត់ មុននឹងឈប់៖ ការផ្លាស់ប្ដូរអតិបរមានៃលំហូរបំពង់មួយណាមួយ ពីជុំមួយទៅជុំបន្ទាប់។ សូន្យមានន័យថាកុំអនុវត្តតេស្តនេះ។ មានតែឧបករណ៍ដោះស្រាយ EPANET ប៉ុណ្ណោះដែលអានប្រអប់នេះ។';
$ec_lang['lpn_settings_damp_limit']='ការបន្ធូរចាប់ផ្ដើមនៅ';
$ec_lang['lpn_settings_damp_limit_tip']='ភាពត្រឹមត្រូវដែលឧបករណ៍ដោះស្រាយចាប់ផ្ដើមប្រើជំហានតូចជាង ដែលអាចជួយបណ្ដាញកំពុងញ័រឲ្យប្រសព្វគ្នា។ សូន្យមានន័យថាឧបករណ៍ដោះស្រាយមិនដែលបន្ធូរទេ។ មានតែឧបករណ៍ដោះស្រាយ EPANET ប៉ុណ្ណោះដែលអានប្រអប់នេះ។';
$ec_lang['lpn_settings_option_unset']='មិនបានចែង';
$ec_lang['lpn_settings_demand_multiplier']='មេគុណគុណតម្រូវការ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='កត្តាតែមួយដែលអនុវត្តទៅតម្រូវការទាំងអស់ក្នុងបណ្ដាញក្នុងពេលតែមួយ។ ប្រើវាដើម្បីសួរថាតើប្រព័ន្ធធ្វើអ្វីនៅកម្រិតការប្រើប្រាស់ច្រើន ឬតិចជាងបច្ចុប្បន្ន។ វាមិនផ្លាស់ប្ដូរលេខដែលអ្នកបានវាយបញ្ចូលទេ។ សេណារីយ៉ូអាចមានតម្លៃផ្ទាល់ខ្លួនរបស់វា ដូច្នេះថ្ងៃមធ្យម ថ្ងៃអតិបរមា និងម៉ោងកំពូល នីមួយៗមានលេខមួយ; ទុកវាទទេនៅក្នុងសេណារីយ៉ូ ដើម្បីប្រើតម្លៃរបស់គម្រោង។';
$ec_lang['lpn_settings_engine_native']='ដោះស្រាយដោយប្រើឧបករណ៍ដោះស្រាយ EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='ដំណើរការឧបករណ៍ដោះស្រាយ EPANET ពី US EPA នៅទីនេះក្នុងកម្មវិធីរុករករបស់អ្នក។ លើបណ្ដាញទំហំនេះ អ្នកនឹងមិនឃើញភាពខុសគ្នានៃល្បឿនទេ។ ឧបករណ៍ដោះស្រាយទាំងពីរផ្ដល់ចម្លើយស្របគ្នាយ៉ាងជិតស្និទ្ធ ប៉ុន្តែមិនដូចគ្នាបេះបិទឡើយ៖ EPANET បង្គត់តម្លៃទំនាញផែនដីដែលវាប្រើ ដូច្នេះការបាត់បង់មូលដ្ឋាន (local) របស់វាចេញមកទាបជាងឧបករណ៍ដោះស្រាយខាងក្នុងប្រហែល 0.08% ហើយជាមួយភាពក្រញ៉ោងម៉ាន់នីង ការបាត់បង់ថ្ពល់របស់វាចេញមកទាបជាងប្រហែល 0.6%។ លើកទីមួយដែលអ្នកជាប់សញ្ញានៅប្រអប់នេះ ទិន្នន័យប្រមាណ 650 KB ត្រូវបានទាញយក ហើយរក្សាទុកនៅក្នុងឧបករណ៍នេះ។';
$ec_lang['lpn_engine_loading']='កំពុងផ្ទុកឧបករណ៍ដោះស្រាយ EPANET…';
$ec_lang['lpn_engine_failed']='មិនអាចផ្ទុកឧបករណ៍ដោះស្រាយ EPANET បានទេ។ កំពុងបង្ហាញឧបករណ៍ដោះស្រាយដែលភ្ជាប់មកជាមួយជំនួសវិញ។';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='ដោះស្រាយដោយប្រើឧបករណ៍ដោះស្រាយ EPANET ព្រោះវ៉ាល់ទាំងនេះបើក និងបិទដោយខ្លួនឯង៖';
$ec_lang['lpn_unit_unknown']='គំនូរនេះប្រើឯកតាមួយដែលទំព័រនេះមិនផ្ដល់ជូន៖ {unit}។ អ្វីៗទាំងអស់ត្រូវបានរក្សាទុក និងបង្ហាញឲ្យដូចគ្នាបេះបិទនឹងអ្វីដែលបានចូលមក ហើយគ្មានអ្វីត្រូវបានផ្លាស់ប្ដូរឡើយ។ គ្មានចម្លើយអាចផ្ដល់ជូនបានទេ រហូតដល់ទំព័រនេះស្គាល់ឯកតានោះ ព្រោះគ្មានវិធីដឹងថាវាធំប៉ុនណានោះទេ។';
$ec_lang['lpn_engine_manning_note']='ចំណាំ៖ ជាមួយភាពក្រញ៉ោងម៉ាន់នីង EPANET គណនាការបាត់បង់ថ្ពល់ទាបជាងឧបករណ៍ដោះស្រាយដែលភ្ជាប់មកជាមួយប្រហែល ០.៦%។';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='ឧបករណ៍ដោះស្រាយ EPANET មិនទទួលយកបណ្ដាញនេះទេ ដូច្នេះវាមិនបានដំណើរការឡើយ។';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='ឧបករណ៍ដោះស្រាយ EPANET បាននិយាយថា៖ {message}';
$ec_lang['lpn_engine_refused_fallback']='លេខនៅលើអេក្រង់មកពីឧបករណ៍ដោះស្រាយដែលភ្ជាប់មកជាមួយជំនួសវិញ។';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='លេខនៅលើអេក្រង់មកពីឧបករណ៍ដោះស្រាយដែលភ្ជាប់មកជាមួយជំនួសវិញ។ វាគណនាតែមួយភ្លែតម្ដងៗ ដូច្នេះនេះជាបណ្ដាញនៅ {time} ប៉ុណ្ណោះ ជាមួយធុងទឹកនីមួយៗនៅតែជាប់នឹងកម្រិតចាប់ផ្ដើមរបស់វា។';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='ច្បាប់ត្រួតពិនិត្យទាំងនេះនិយាយពីធាតុមួយដែលលែងមាននៅក្នុងគម្រោងនេះទៀតហើយ ដូច្នេះពួកវាត្រូវបានលុបចេញ៖ {ids}';
$ec_lang['lpn_control_unreadable_note']='ច្បាប់ត្រួតពិនិត្យទាំងនេះមិនអាចអានបានទេ ដូច្នេះពួកវាត្រូវបានលុបចេញ៖ {ids}';
$ec_lang['lpn_rule_dangling_note']='ក្បួនទាំងនេះសំដៅលើធាតុមួយដែលលែងមាននៅក្នុងគម្រោងនេះទៀតហើយ ដូច្នេះពួកវាត្រូវបានមិនអើពើក្នុងការដំណើរការនេះ៖ {ids}';
$ec_lang['lpn_rule_unreadable_note']='ក្បួនទាំងនេះមិនអាចអានបានទេ ដូច្នេះពួកវាត្រូវបានមិនអើពើក្នុងការដំណើរការនេះ៖ {ids}';
$ec_lang['lpn_settings_text_size']='ទំហំអក្សរ (ភិចសែល)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='ទំហំសញ្ញា (ភិចសែល)';
$ec_lang['lpn_settings_link_width']='កម្រាស់ខ្សែបំពង់ (ភិចសែល)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='ព្រួញទិសលំហូរ';
$ec_lang['lpn_settings_show_arrows_tip']='គូរព្រួញនៅលើបំពង់នីមួយៗ បង្ហាញទិសដែលទឹកកំពុងហូរ។ ព្រួញលេចឡើងបន្ទាប់ពីដំណើរការមួយ ហើយបិទវាមិនផ្លាស់ប្ដូរលទ្ធផលទេ។ ការកំណត់នេះត្រូវបានរក្សាទុកជាមួយគម្រោង។';
$ec_lang['lpn_settings_align_labels']='តម្រឹមស្លាកបំពង់តាមបំពង់';
$ec_lang['lpn_settings_readability_bias']='អង្សាពីខាងឆ្វេងបន្ទាត់បញ្ឈរ មុននឹងស្លាកមួយត្រូវបានបង្វិលត្រឡប់';
$ec_lang['lpn_settings_readability_bias_tip']='បង្វិលស្លាកមួយត្រឡប់ ដើម្បីរក្សាទុកឲ្យវានៅត្រង់ នៅពេលវាទេពីខាងឆ្វេងបន្ទាត់បញ្ឈរលើសពីចំនួនអង្សានេះ។';
$ec_lang['lpn_settings_mask_labels']='ផ្ទៃខាងក្រោយតាន់ពណ៌ពីក្រោយស្លាក';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='ស្អិតបន្ទាត់នាំទៅមុំកំណត់';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='នៅពេលអ្នកអូសស្លាកចេញឆ្ងាយពីធាតុដែលវាដាក់ឈ្មោះ បន្ទាត់ត្រឡប់ទៅរកវានឹងត្រូវទាញឲ្យទៅជិតមុំកំណត់ដែលនៅជិតបំផុត ប្រសិនបើអ្នកអូសទៅជិតវា។ បន្តអូស ហើយការស្អិតនឹងលែងទាញ ដូច្នេះមុំណាមួយនៅតែអាចប្រើបាន។ បិទ អូសដោយសេរី ដែលជាអ្វីដែលទំព័រនេះធ្លាប់ធ្វើជានិច្ច។';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='បង្ហាញស្លាកនៅពេលពង្រីកដល់ទទឹងផែនទីនេះ ឬតូចជាង';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='ស្លាកត្រូវបានគូរតែខណៈទិដ្ឋភាពផែនទីមានទទឹងនេះ ឬតូចជាងប៉ុណ្ណោះ។ ទុកប្រអប់ទទេ ដើម្បីគូរពួកវានៅគ្រប់កម្រិតពង្រីក។ វាយបញ្ចូល 0 ដើម្បីមិនដែលគូរស្លាកមួយ នៅកម្រិតពង្រីកណាមួយឡើយ។';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='បង្ហាញជានិច្ច';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='ការពារថ្នាំងមិនឲ្យពង្រីកលើសពី';
$ec_lang['lpn_settings_symbol_cap_mid']='ដង នៃប្រវែងនៃ';
$ec_lang['lpn_settings_symbol_cap_post']='បំពង់ភាគរយទី';
$ec_lang['lpn_settings_symbol_cap_tip']='ថ្នាំងមួយឈប់ធំឡើងនៅលើដីនៅពេលអង្កត់ផ្ចិតរបស់វាស្មើនឹងចំនួនដងនេះនៃប្រវែងបំពង់នៅភាគរយនេះនៃប្រវែងបំពង់ទាំងអស់នៅក្នុងបណ្ដាញ។ លើសពីចំណុចនោះនៅលើផែនទី ថ្នាំង បំពង់ និងនិមិត្តសញ្ញាផ្សេងទៀតតូចចុះនៅលើអេក្រង់ ខណៈអ្នកបង្រួម ជំនួសឲ្យការធំឡើងនៅលើដី។ អាងស្តុក និងធុងទឹកជាករណីលើកលែង ហើយរក្សាទំហំអេក្រង់របស់ពួកវានៅគ្រប់កម្រិតពង្រីក។';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='ភាពស្រអាប់សញ្ញា (០ ដល់ ១)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='ភាពស្រអាប់រូបភាពផ្ទៃខាងក្រោយ (០ ដល់ ១)';
$ec_lang['lpn_settings_map_display']='រូបរាងផែនទី';
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
$ec_lang['lpn_settings_legend_position']='ទីតាំងតារាងសញ្ញាស្លាក';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='គ្មាន';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='បិទ';
$ec_lang['lpn_settings_legend_top_left']='កំពូលឆ្វេង';
$ec_lang['lpn_settings_legend_top_right']='កំពូលស្ដាំ';
$ec_lang['lpn_settings_legend_middle_left']='កណ្ដាលឆ្វេង';
$ec_lang['lpn_settings_legend_middle_right']='កណ្ដាលស្ដាំ';
$ec_lang['lpn_settings_legend_bottom_left']='បាតឆ្វេង';
$ec_lang['lpn_settings_legend_bottom_right']='បាតស្ដាំ';
$ec_lang['lpn_settings_color_node_field']='ពណ៌ថ្នាំង';
$ec_lang['lpn_settings_color_link_field']='ពណ៌បំពង់';
$ec_lang['lpn_settings_color_ramp']='ប្រព័ន្ធពណ៌';
$ec_lang['lpn_settings_color_credits']='ការទទួលស្គាល់';
$ec_lang['lpn_color_ramp_epanet']='ខៀវទៅក្រហម (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='ស្វាយទៅលឿង (ងាយសម្គាល់ពណ៌មួយពីមួយទៀត)';
$ec_lang['lpn_color_ramp_gray']='ប្រផេះស្រាលទៅប្រផេះខ្មៅ';
$ec_lang['lpn_settings_color_reverse']='បញ្ច្រាសលំដាប់ពណ៌';
$ec_lang['lpn_color_none']='គ្មានពណ៌';
$ec_lang['lpn_settings_color_key_position']='ទីតាំងតារាងសញ្ញាពណ៌';
$ec_lang['lpn_settings_color_breaks']='ព្រំដែនជួរពណ៌';
$ec_lang['lpn_settings_color_equal_intervals']='ចន្លោះស្មើគ្នា';
$ec_lang['lpn_settings_color_equal_counts']='ចំនួនស្មើគ្នា';
$ec_lang['lpn_settings_color_no_values']='មិនទាន់មានតម្លៃសម្រាប់ប្រើនៅឡើយទេ។ សូមដោះស្រាយបណ្ដាញជាមុនសិន។';
$ec_lang['lpn_confirm_restore_defaults']='កំណត់ការកំណត់ទាំងអស់ឡើងវិញ (បុព្វបទលេខសម្គាល់ តម្លៃចាប់ផ្ដើម ការកំណត់ឧបករណ៍ដោះស្រាយ រូបរាងផែនទី ទីតាំងតារាងសញ្ញា និងស្លាកដែលមើលឃើញ) ទៅតម្លៃដើមរបស់វាមែនទេ? បណ្ដាញរបស់អ្នកមិនផ្លាស់ប្ដូរទេ។ ការកំណត់ជារបស់គម្រោងដែលកំពុងបើក ដូច្នេះគម្រោងផ្សេងទៀតរបស់អ្នករក្សាការកំណត់ផ្ទាល់ខ្លួនរបស់វា។';
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
$ec_lang['lpn_settings_wipe_btn']='លុបអ្វីៗទាំងអស់នៅលើទំព័រនេះ';
$ec_lang['lpn_confirm_wipe']='លុបអ្វីៗទាំងអស់ដែលបានរក្សាទុកសម្រាប់ទំព័រនេះ — គម្រោងគ្រប់មួយ រូបភាពផ្ទៃខាងក្រោយគ្រប់មួយ ការកំណត់ទាំងអស់ និងជម្រើសខ្នាតវាស់របស់អ្នក — រួចផ្ទុកទំព័រឡើងវិញដូចអ្នកចូលមើលថ្មីម្នាក់នឹងឃើញមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='ចម្លងតំណនេះ៖';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='ពេលវេលា';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='រយៈពេលដំណើរការសរុប';
$ec_lang['lpn_time_hyd_step']='ចន្លោះពេលធារាសាស្ត្រ';
$ec_lang['lpn_time_pattern_step']='ចន្លោះពេលលំនាំ';
$ec_lang['lpn_time_pattern_start']='ពេលចាប់ផ្ដើមលំនាំ';
$ec_lang['lpn_time_report_step']='ចន្លោះពេលរបាយការណ៍';
$ec_lang['lpn_time_report_start']='ពេលចាប់ផ្ដើមរបាយការណ៍';
$ec_lang['lpn_time_clock_start']='ម៉ោងនាឡិកានៅពេលចាប់ផ្ដើម';
$ec_lang['lpn_time_clock_day']='ថ្ងៃទី {day}, {clock}';
$ec_lang['lpn_time_format_tip']='សរសេរពេលវេលាជាម៉ោង និងនាទី ដូចជា 2:30។ លេខធម្មតាមានន័យជាម៉ោង ដូច្នេះ 8 មានន័យប្រាំបីម៉ោង។ កន្លះម៉ោងគឺ 0:30។';
$ec_lang['lpn_time_running']='កំពុងគណនារយៈពេលទាំងមូល ដោយប្រើឧបករណ៍ដោះស្រាយ EPANET។';
$ec_lang['lpn_time_no_engine']='ឧបករណ៍ដោះស្រាយខាងក្នុងគណនាតែមួយភ្លែតម្ដងៗ ដូច្នេះនេះជាបណ្ដាញនៅ {time} ប៉ុណ្ណោះ៖ តម្គុណលំនាំគ្រប់មួយត្រូវបានអានត្រង់ភ្លែតនោះ ហើយធុងទឹកនីមួយៗនៅតែជាប់នឹងកម្រិតចាប់ផ្ដើមរបស់វា ជំនួសឲ្យការបំពេញ និងបង្ហូរ។ ភ្ជាប់អ៊ីនធឺណិតម្ដង ដើម្បីទាញយកឧបករណ៍ដោះស្រាយ EPANET ដែលដំណើរការការក្លែងធ្វើលើរយៈពេលមួយ។';
$ec_lang['lpn_time_slider']='ពេលវេលា';
$ec_lang['lpn_time_no_period']='គម្រោងនេះមិនមានការក្លែងធ្វើលើរយៈពេលមួយកំណត់ទេ ដូច្នេះមានតែភ្លែតមួយប៉ុណ្ណោះដែលត្រូវបង្ហាញ។ កំណត់ រយៈពេលដំណើរការសរុប នៅក្នុង ការកំណត់, ការគណនា, ពេលវេលា ដើម្បីដំណើរការការក្លែងធ្វើលើរយៈពេលមួយ។';
$ec_lang['lpn_time_first']='ទៅដើម';
$ec_lang['lpn_time_prev']='ថយក្រោយ';
$ec_lang['lpn_time_play']='លេង';
$ec_lang['lpn_time_play_tip']='លេងចលនា';
$ec_lang['lpn_time_pause_tip']='ផ្អាកចលនា';
$ec_lang['lpn_time_pause']='ផ្អាក';
$ec_lang['lpn_time_next']='ទៅមុខ';
$ec_lang['lpn_time_last']='ទៅចុង';
$ec_lang['lpn_time_tank']='ធុងទឹក';
$ec_lang['lpn_time_level']='កម្រិតទឹក';
$ec_lang['lpn_time_run']='ដំណើរការ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='ដោះស្រាយបណ្ដាញនេះនៅរាល់ជំហានពេលវេលាធារាសាស្ត្ររបស់វា ចាប់ពីដើមដំណើរការរហូតដល់ចុង។';
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
$ec_lang['lpn_time_run_done']='ការដំណើរការបានបញ្ចប់។ ពេលវេលារបាយការណ៍៖ {frames}។ ពេលវេលាចំណាយ៖ {secs} វិនាទី។';
$ec_lang['lpn_time_runbox_hide']='កុំបង្ហាញប្រអប់នេះទៀត';
$ec_lang['lpn_settings_runbox']='បង្ហាញប្រអប់វឌ្ឍនភាពដំណើរការ';
$ec_lang['lpn_settings_runbox_tip']='ប្រអប់មួយដែលរាយការណ៍ថាតើដំណើរការមួយបានទៅដល់កម្រិតណា និងអ្វីដែលវារកឃើញ។ នៅពេលបិទ ការដំណើរការមួយដែលបានបញ្ចប់និយាយអ្វីដដែលនៅក្នុងបន្ទាត់ស្ថានភាពសម្រាប់រយៈពេលពីរបីវិនាទីជំនួសវិញ។ នេះជាការកំណត់សម្រាប់កម្មវិធីរុករកនេះ មិនមែនសម្រាប់គម្រោងទេ។';
$ec_lang['lpn_time_run_failed']='ការដំណើរការមិនបានបញ្ចប់ទេ ដូច្នេះគ្មានលទ្ធផលសម្រាប់ពេលវេលាក្រោយៗទេ។';
$ec_lang['lpn_time_run_report']='របាយការណ៍ដំណើរការ EPANET';
$ec_lang['lpn_time_run_report_copy']='ចម្លង';
$ec_lang['lpn_time_run_report_copied']='បានចម្លង';
$ec_lang['lpn_time_run_report_tip']='អ្វីដែលឧបករណ៍ដោះស្រាយ EPANET ខ្លួនឯងបានបោះពុម្ពអំពីការដំណើរការចុងក្រោយ៖ របៀបដែលវាចុះចត និងអ្វីៗដែលវាព្រមានអំពី។ វាជាអត្ថបទផ្ទាល់របស់ឧបករណ៍ដោះស្រាយ មិនមែនរបស់យើងទេ។';

$ec_lang['lpn_time_speed']='ល្បឿន';
$ec_lang['lpn_time_speed_tip']='ល្បឿននៃការចាក់ត្រឡប់។';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_menu_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='ស្វែងរកការកំណត់';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='វាយពាក្យមួយដើម្បីមើលតែការកំណត់ដែលនិយាយពីវា។ ការពន្យល់ក៏ត្រូវបានស្វែងរកដែរ មិនមែនត្រឹមតែឈ្មោះទេ។';
$ec_lang['lpn_settings_no_match']='គ្មានការកំណត់ណាមួយនិយាយពីពាក្យនោះទេ។';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='ទទឹងបញ្ជីផ្នែក ការកំណត់';
$ec_lang['lpn_rpane_empty']='មិនទាន់មានអ្វីនៅទីនេះនៅឡើយទេ។ អ្វីៗដែលជារបស់គម្រោងទាំងមូល នៅក្នុងការកំណត់។';
$ec_lang['lpn_time_settings_open']='ការកំណត់ពេលវេលា';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='ការមើលឃើញទិន្នន័យ';
$ec_lang['lpn_settings_sec_map']='ផែនទី និងទំព័រ';
$ec_lang['lpn_settings_sec_assets']='តម្លៃលំនាំដើមសម្រាប់ធាតុថ្មី';
$ec_lang['lpn_settings_sec_calculation']='ការគណនា';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='អតិថិជន';
$ec_lang['lpn_labels_customer_note']='ស្លាកអតិថិជនមួយបង្ហាញតម្លៃដែលបានធីកនៅទីនេះ។ វាត្រូវបានគូរនៅទំហំអក្សរដូចគ្នានឹងស្លាកផ្សេងទៀតទាំងអស់នៅលើផែនទី។';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='ស្លាកអតិថិជនត្រូវបានគូរតែខណៈទិដ្ឋភាពផែនទីមានទទឹងនេះ ឬតូចជាងប៉ុណ្ណោះ។ ទុកប្រអប់ទទេ ដើម្បីគូរពួកវានៅគ្រប់កម្រិតពង្រីក។ វាយបញ្ចូល 0 ដើម្បីមិនដែលគូរស្លាកអតិថិជនមួយ នៅកម្រិតពង្រីកណាមួយឡើយ។ វាគ្មានប្រសិទ្ធិភាពទេ ប្រសិនបើវាធំជាងការកំណត់ស្រដៀងគ្នាសម្រាប់ស្លាកទាំងអស់។';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='ប្រើទិដ្ឋភាពបច្ចុប្បន្ន';
$ec_lang['lpn_settings_page']='ទំព័រ';
$ec_lang['lpn_settings_page_note']='រក្សាទុកនៅក្នុងម៉ាស៊ីនគណនានេះ មិនមែននៅក្នុងគម្រោងទេ។';
$ec_lang['lpn_settings_hydraulics']='ធារាសាស្ត្រ';
$ec_lang['lpn_settings_quality']='គុណភាពទឹក';
$ec_lang['lpn_settings_quality_track']='ប៉ារ៉ាម៉ែត្រគុណភាព';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='ជ្រើសរើសអ្វីដែលការដំណើរការគួរតាមដានតាមបំពង់៖ រយៈពេលប៉ុន្មានដែលទឹកបាននៅក្នុងប្រព័ន្ធ វាមកពីណា ឬសារធាតុគីមីមួយដែលប្រតិកម្មខណៈវាធ្វើដំណើរ។ មានតែសារធាតុគីមីប៉ុណ្ណោះដែលត្រូវការមេគុណ។';
$ec_lang['lpn_settings_quality_source']='ថ្នាំងតាមដាន';
$ec_lang['lpn_settings_quality_source_tip']='ថ្នាំងដែលទឹករបស់វាត្រូវបានតាមដាន។ ថ្នាំងផ្សេងទៀតទាំងអស់នឹងបង្ហាញចំណែកទឹករបស់វាដែលមកពីថ្នាំងនោះ។';
$ec_lang['lpn_quality_none']='គ្មានអ្វី';
$ec_lang['lpn_quality_age']='អាយុទឹក';
$ec_lang['lpn_quality_trace']='ការតាមដានប្រភព';
$ec_lang['lpn_quality_chemical']='សារធាតុគីមីមួយដែលប្រតិកម្ម';
$ec_lang['lpn_quality_needs_run']='គុណភាពទឹកត្រូវបានផ្ទុកតាមបំពង់ ខណៈទឹកធ្វើដំណើរ ដូច្នេះវាត្រូវការការក្លែងធ្វើលើរយៈពេលមួយ៖ ឧបករណ៍ដោះស្រាយ EPANET និងរយៈពេលដំណើរការសរុប។ កំណត់ រយៈពេលដំណើរការសរុប នៅក្រោម ពេលវេលា រួចចុច ដំណើរការ។';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='សារធាតុគីមី និងឯកតា';
$ec_lang['lpn_quality_chemical_name_tip']='ឈ្មោះសារធាតុគីមី និងឯកតាដែលកំហាប់របស់វាត្រូវបានសរសេរ៖ ឧទាហរណ៍ សរសេរ Chlorine mg/L ជាធាតុតែមួយ។ នេះជាស្លាកសម្គាល់មួយ។ EPANET មិនបំលែងកំហាប់ទេ ដូច្នេះកំហាប់ និងមេគុណនីមួយៗនៅក្នុងគម្រោងត្រូវតែសរសេរជាឯកតាទាំងនេះរួចជាស្រេច។';
$ec_lang['lpn_quality_mass_units']='ឯកតាម៉ាស់';
$ec_lang['lpn_quality_mass_units_tip']='ឯកតាជាផ្នែកមួយនៃធាតុគុណភាព ជម្រើសពីរផ្ទាល់ខ្លួនរបស់ EPANET។';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='ភាពអត់ធ្មត់គុណភាព';
$ec_lang['lpn_quality_tolerance_tip']='តើផ្នែកទឹកពីរដែលនៅជាប់គ្នាអាចខុសគ្នាប៉ុន្មាននៅក្នុងកំហាប់ មុននឹង EPANET ចាត់ទុកពួកវាជាមួយតែមួយ។ ទុកទទេប្រើលំនាំដើមផ្ទាល់ខ្លួនរបស់ EPANET គឺ 0.01។';
$ec_lang['lpn_quality_diffusivity']='ភាពសាយភាយទាក់ទង';
$ec_lang['lpn_quality_diffusivity_tip']='តើសារធាតុគីមីនេះសាយភាយតាមទឹកលឿនប៉ុនណា ធៀបនឹងក្លរីន។ ទុកទទេប្រើលំនាំដើមផ្ទាល់ខ្លួនរបស់ EPANET គឺ 1.0។';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='កំហាប់ {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='កំហាប់ {chemical} មធ្យម';
$ec_lang['lpn_quality_initial']='គុណភាពដំបូង';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='ថ្នាំងនេះមានសារធាតុគីមីប៉ុន្មាននៅពេលការដំណើរការចាប់ផ្ដើម។ អាងស្តុកមួយរក្សាតម្លៃផ្ទាល់ខ្លួនរបស់វាពេញការដំណើរការទាំងមូល ដែលជារបៀបធម្មតាសម្រាប់ចែងកម្រិតដែលនៅសល់ចេញពីរោងចក្រព្យាបាល។ ទុកវាទទេ ហើយថ្នាំងនោះចាប់ផ្ដើមដោយគ្មានសារធាតុគីមីនោះទេ។';
$ec_lang['lpn_result_concentration']='កំហាប់';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='សារធាតុគីមីនៅសល់ប៉ុន្មាននៅចំណុចនេះ បន្ទាប់ពីវាបានធ្វើដំណើរ និងធ្វើប្រតិកម្ម។ ឯកតាគឺជាឯកតាដែលបានចែងនៅជាប់សារធាតុគីមីនោះ ក្រោម ការកំណត់, គុណភាពទឹក។';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='ប្រភេទប្រភព';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='ប្រភេទដូសដែលថ្នាំងនេះដាក់ទៅលើទឹកឆ្លងកាត់វា។ កំហាប់ចាត់ទុកទឹកចូលបណ្ដាញត្រង់ទីនេះថាមកដល់នៅតម្លៃ គុណភាពប្រភព។ ម៉ាស៊ីនបន្ថែមម៉ាស់ បន្ថែមម៉ាស់សារធាតុគីមីរាល់នាទី មិនថាលំហូរប៉ុន្មានទេ។ ម៉ាស៊ីនកំណត់ចំណុចដល់ លើកកំហាប់ចេញពីថ្នាំងនេះឡើងដល់តម្លៃ គុណភាពប្រភព ហើយមិនលើសពីនោះទេ។ ម៉ាស៊ីនតាមអត្រាលំហូរ បន្ថែមតម្លៃ គុណភាពប្រភព ទៅនឹងអ្វីដែលមាននៅក្នុងទឹករួចហើយ។';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='គ្មាន';
$ec_lang['lpn_source_type_concen']='កំហាប់';
$ec_lang['lpn_source_type_mass']='ម៉ាស៊ីនបន្ថែមម៉ាស់';
$ec_lang['lpn_source_type_setpoint']='ម៉ាស៊ីនកំណត់ចំណុចដល់';
$ec_lang['lpn_source_type_flowpaced']='ម៉ាស៊ីនតាមអត្រាលំហូរ';
$ec_lang['lpn_source_quality']='គុណភាពប្រភព';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='ដូសនេះខ្លាំងប៉ុណ្ណា។ សម្រាប់ប្រភេទទាំងអស់លើកលែងម៉ាស៊ីនបន្ថែមម៉ាស់ នេះជាកំហាប់មួយ ជាឯកតាដែលបានចែងនៅជាប់សារធាតុគីមីនោះ ក្រោម ការកំណត់, គុណភាពទឹក; សម្រាប់ម៉ាស៊ីនបន្ថែមម៉ាស់ វាជាម៉ាស់សារធាតុគីមីក្នុងមួយនាទី។ ទុកវាទទេ ហើយគ្មានអ្វីត្រូវបានបន្ថែមនៅទីនេះទេ ដែលមិនដូចគ្នានឹងសូន្យទេ៖ សូន្យគឺជាដូសដែលកំពុងដំណើរការ ហើយបន្ថែមអ្វីទាំងអស់ទេ។';
$ec_lang['lpn_source_pattern']='លំនាំប្រភព';
$ec_lang['lpn_source_pattern_tip']='លំនាំពេលវេលាមួយដែលធ្វើមាត្រដ្ឋានដូសនេះពេញការដំណើរការ សម្រាប់ម៉ាស៊ីនដែលមិនថេរ។ គ្មានលំនាំមានន័យថាដូសនេះដូចគ្នារាល់ជំហាន។';
$ec_lang['lpn_mixing_model']='គំរូការលាយ';
$ec_lang['lpn_mixing_model_tip']='របៀបដែលទឹកដែលមាននៅក្នុងធុងទឹកនេះរួចហើយ លាយជាមួយទឹកចូលថ្មី។ ការលាយពេញលេញកូរធុងទឹកទាំងមូលក្នុងពេលតែមួយ។ ការលាយពីរផ្នែក បំពេញតំបន់ចូលមុន រួចហើយបញ្ជូនផ្នែកនៅសល់បន្ត។ លំហូរចេញមុនចូលមុន (FIFO) ផ្លាស់ទីទឹកតាមលំដាប់ដែលវាបានមកដល់។ លំហូរចេញក្រោយចូលមុន (LIFO) ជង់វា ដូច្នេះទឹកចូលចុងក្រោយគឺជាទឹកចេញមុនគេ។ ជម្រើសនេះផ្លាស់ប្ដូរអាយុទឹក និងកំហាប់នៅសល់ ហើយវាមិនផ្លាស់ប្ដូរសម្ពាធ ឬលំហូរណាមួយឡើយ។';
$ec_lang['lpn_mixing_mixed']='ការលាយពេញលេញ';
$ec_lang['lpn_mixing_2comp']='ការលាយពីរផ្នែក';
$ec_lang['lpn_mixing_fifo']='លំហូរចេញមុនចូលមុន (FIFO)';
$ec_lang['lpn_mixing_lifo']='លំហូរចេញក្រោយចូលមុន (LIFO)';
$ec_lang['lpn_mixing_fraction']='ចំណែកនៃការលាយ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='ចំណែកនៃទំហំធុងទឹកដែលតំបន់ចូលកាន់កាប់ រវាង 0 និង 1។ មានតែការលាយពីរផ្នែកប៉ុណ្ណោះដែលប្រើវា។ ទុកវាទទេ ហើយធុងទឹកទាំងមូលក្លាយជាតំបន់ចូល ដែលជាអ្វីដែល EPANET សន្មត។';
$ec_lang['lpn_reaction_bulk']='មេគុណប្រតិកម្មក្នុងខ្លួនទឹក';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='ប្រតិកម្មនៅក្នុងខ្លួនទឹក ប្រើសម្រាប់បំពង់គ្រប់មួយដែលគ្មានតម្លៃផ្ទាល់ខ្លួន។ លេខអវិជ្ជមានបំបែកសារធាតុគីមី ហើយលេខវិជ្ជមានបង្កើនវា។ ប្រតិកម្មនេះជាលំដាប់ទីមួយ លុះត្រាតែឯកសារ EPANET ដែលបាននាំចូលចែងលំដាប់ផ្សេង ដូច្នេះមេគុណនេះជាអត្រាគិតជា 1/ថ្ងៃ។ ប្រអប់ទទេមានន័យថាគ្មានប្រតិកម្មក្នុងខ្លួនទឹកទេ។';
$ec_lang['lpn_reaction_wall']='មេគុណប្រតិកម្មនៅជញ្ជាំងបំពង់';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='ប្រតិកម្មនៅជញ្ជាំងបំពង់ ប្រើសម្រាប់បំពង់គ្រប់មួយដែលគ្មានតម្លៃផ្ទាល់ខ្លួន។ លេខអវិជ្ជមានបំបែកសារធាតុគីមី។ ប្រតិកម្មនេះជាលំដាប់ទីមួយ លុះត្រាតែឯកសារ EPANET ដែលបាននាំចូលចែងលំដាប់ផ្សេង ដូច្នេះមេគុណនេះជាប្រវែងក្នុងមួយថ្ងៃ សរសេរជាឯកតាប្រវែងរបស់គម្រោង។ ប្រអប់ទទេមានន័យថាគ្មានប្រតិកម្មនៅជញ្ជាំងទេ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='បំពង់នេះតែម្នាក់ឯង។ ទុកវាទទេ ហើយបំពង់នេះប្រើមេគុណដែលបានកំណត់សម្រាប់បណ្ដាញទាំងមូល ក្រោម ការកំណត់, គុណភាពទឹក។';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='មេគុណប្រតិកម្ម';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='ប្រតិកម្មនៅក្នុងទឹកដែលធុងទឹកនេះផ្ទុក ជាអត្រាគិតជា 1/ថ្ងៃ។ លេខអវិជ្ជមានបំបែកសារធាតុគីមី ហើយលេខវិជ្ជមានបង្កើនវា។ ទឹកនៅក្នុងធុងទឹកយូរជាងនៅក្នុងបំពង់ណាមួយច្រើន ដូច្នេះទីនេះជាកន្លែងញឹកញាប់ដែលកំហាប់នៅសល់ត្រូវបានបាត់បង់។ ទុកវាទទេ ហើយធុងទឹកនេះប្រើមេគុណប្រតិកម្មក្នុងខ្លួនទឹកដែលបានកំណត់សម្រាប់បណ្ដាញទាំងមូល ក្រោម ការកំណត់, គុណភាពទឹក។';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='ប្រតិកម្មក្នុងខ្លួនទឹក';
$ec_lang['lpn_reaction_wall_short']='ប្រតិកម្មនៅជញ្ជាំង';
$ec_lang['lpn_reaction_tank_short']='ប្រតិកម្ម';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/ថ្ងៃ';
$ec_lang['lpn_reaction_day']='ថ្ងៃ';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='លំដាប់ប្រតិកម្មក្នុងខ្លួនទឹក';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='ដឺក្រេដែលកំហាប់ត្រូវបានលើកអំណាចនៅក្នុងប្រតិកម្មក្នុងខ្លួនទឹក។ មួយគឺជាលំដាប់ទីមួយ ដែលជាអ្វីដែលការបំបែកក្លរីនភាគច្រើនត្រូវបានធ្វើគំរូ ហើយជាអ្វីដែល EPANET សន្មតនៅពេលគ្មានអ្វីត្រូវបានចែង។ សូន្យធ្វើឲ្យអត្រានេះថេរ ដោយមិនអាស្រ័យលើបរិមាណសារធាតុគីមីនៅទីនោះទេ។ នេះមិនមែនជាមេគុណទេ៖ វាផ្លាស់ប្ដូរអត្ថន័យរបស់មេគុណក្នុងខ្លួនទឹក ដូច្នេះការប្ដូរវាផ្លាស់ប្ដូរចម្លើយគ្រប់មួយ ទោះបីមេគុណមិនបានផ្លាស់ប្ដូរក៏ដោយ។';
$ec_lang['lpn_reaction_order_tank']='លំដាប់ប្រតិកម្មធុងទឹក';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='លំដាប់ដូចគ្នា សម្រាប់ទឹកដែលឈរនៅក្នុងធុងទឹក ដែលអាចធ្វើប្រតិកម្មខុសពីទឹកដែលកំពុងផ្លាស់ទីនៅក្នុងបំពង់។ EPANET សន្មតលេខ 1 នៅពេលគ្មានអ្វីត្រូវបានចែង។ ប្រអប់ទទេមានន័យថាគ្មានអ្វីត្រូវបានចែងទេ ហើយតម្លៃលំនាំដើមផ្ទាល់ខ្លួនរបស់ឧបករណ៍ដោះស្រាយនៅតែប្រើ។';
$ec_lang['lpn_reaction_order_wall']='លំដាប់ប្រតិកម្មនៅជញ្ជាំង';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='តើប្រតិកម្មនៅជញ្ជាំងបំពង់អាស្រ័យលើបរិមាណសារធាតុគីមីនៅក្នុងទឹកដែរឬទេ។ លំដាប់ទីមួយមានន័យថាមែន ហើយមេគុណនៅជញ្ជាំងគឺជាប្រវែងក្នុងមួយថ្ងៃ។ លំដាប់សូន្យមានន័យថាមិនមែនទេ ហើយមេគុណក្លាយជាម៉ាស់ក្នុងផ្ទៃក្នុងមួយថ្ងៃវិញ។ EPANET អនុញ្ញាតតែពីរនេះប៉ុណ្ណោះ ដែលជាមូលហេតុដែលនេះជាប្រអប់ជ្រើសរើស មិនមែនជាលេខទេ។ វាក៏កំណត់ថាទំព័រនេះបំលែងមេគុណនៅជញ្ជាំងយ៉ាងណាដែរ ដូច្នេះជួរខាងលើវាមានអត្ថន័យខុសគ្នាទៅតាមអ្វីដែលអ្នកជ្រើសរើសនៅទីនេះ។';
$ec_lang['lpn_reaction_order_unstated']='មិនបានចែង';
$ec_lang['lpn_reaction_order_zero']='0, លំដាប់សូន្យ';
$ec_lang['lpn_reaction_order_first']='1, លំដាប់ទីមួយ';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='សក្ដានុពលកំណត់';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='កំហាប់មួយដែលសារធាតុគីមីផ្លាស់ទីទៅរក ជាជាងបំបែកទៅសូន្យ ឬកើនឡើងគ្មានទីបញ្ចប់។ ប្រតិកម្មយឺតចុះនៅពេលទឹកកាន់តែជិតវា ហើយឈប់នៅទីនោះ។ វាត្រូវបានសរសេរជាឯកតាដូចគ្នានឹងសារធាតុគីមីខ្លួនឯង ហើយ EPANET មិនបំលែងកំហាប់ឲ្យនរណាម្នាក់ទេ ដូច្នេះសរសេរវាជាឯកតាដែលបានចែងនៅជាប់សារធាតុគីមីនោះ។ ទុកវាទទេ ហើយគ្មានដែនកំណត់ទេ។';
$ec_lang['lpn_reaction_rough_corr']='ទំនាក់ទំនងជាមួយភាពក្រញ៉ោង';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='ភ្ជាប់ប្រតិកម្មនៅជញ្ជាំងទៅនឹងភាពក្រញ៉ោងផ្ទាល់ខ្លួនរបស់បំពង់នីមួយៗ ជាជាងលេខតែមួយសម្រាប់បណ្ដាញទាំងមូល ដែលជារបៀបធ្វើឲ្យបំពង់ក្រញ៉ោងជាងគេ ធ្វើប្រតិកម្មលឿនជាង។ នៅពេលកំណត់ ទំព័រនេះ និង EPANET គណនាមេគុណនៅជញ្ជាំងសម្រាប់បំពង់នីមួយៗពីភាពក្រញ៉ោងរបស់បំពង់នោះ ហើយមេគុណនៅជញ្ជាំងតែមួយខាងលើលែងត្រូវបានប្រើទៀតហើយ។ ទុកវាទទេ ហើយវាមិនត្រូវបានប្រើទាល់តែសោះ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='ទំព័រនេះមិនផ្ដល់មេគុណប្រតិកម្មផ្ទាល់ខ្លួនរបស់វាទេ។ គ្មានតេស្តស្តង់ដារសម្រាប់វាទេ ហើយតម្លៃដែលបានបោះពុម្ពផ្សាយសម្រាប់ទឹកប្រភេទដូចគ្នាខុសគ្នារហូតដល់ដប់ដង ដូច្នេះលេខមួយផ្ដល់ជូននៅទីនេះនឹងត្រូវបានអានថាជាការណែនាំមួយ។ បញ្ចូលលេខមួយដែលអ្នកបានវាស់ ឬអាចដកស្រង់បាន ឬទុកប្រអប់ទទេសម្រាប់សារធាតុគីមីដែលមិនធ្វើប្រតិកម្ម។';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='ថាមពល';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='របាយការណ៍';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='ចម្លើយចុងក្រោយដែលទំព័រនេះផ្ដល់ ក្រោយពីបណ្ដាញមួយត្រូវបានគណនា៖ ម៉ាស៊ីនបូមចំណាយអ្វីខ្លះ សេណារីយ៉ូប្រៀបធៀបគ្នាយ៉ាងណា និងអ្វីដែលឧបករណ៍ដោះស្រាយ EPANET ខ្លួនឯងបានបោះពុម្ព។';
$ec_lang['lpn_reports_epanet']='ការដំណើរការ EPANET';
$ec_lang['lpn_energy_title']='របាយការណ៍ថាមពលម៉ាស៊ីនបូម';
$ec_lang['lpn_energy_menu']='ថាមពលម៉ាស៊ីនបូម';
$ec_lang['lpn_energy_menu_tip']='ចំណែកនៃការដំណើរការដែលម៉ាស៊ីនបូមនីមួយៗបានបើក កម្លាំងអគ្គិសនីដែលវាប្រើ និងចំណាយប៉ុន្មានពេញការគណនាឆ្លងកាត់ពេលវេលាចុងក្រោយ។';
$ec_lang['lpn_energy_efficiency']='ប្រសិទ្ធភាពម៉ាស៊ីនបូម (ភាគរយ)';
$ec_lang['lpn_energy_efficiency_tip']='ប្រសិទ្ធភាពពីខ្សែភ្លើងទៅទឹក ប្រើសម្រាប់ម៉ាស៊ីនបូមគ្រប់គ្រឿងដែលគ្មានខ្សែកោងប្រសិទ្ធភាពផ្ទាល់ខ្លួន។ EPANET ប្រើ 75 ភាគរយ នៅពេលគ្មានតម្លៃត្រូវបានចែង។';
$ec_lang['lpn_energy_price']='តម្លៃអគ្គិសនី';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='កម្លាំងអគ្គិសនីមួយគីឡូវ៉ាត់ម៉ោងចំណាយប៉ុន្មាន។ វាអនុវត្តចំពោះម៉ាស៊ីនបូមគ្រប់គ្រឿងដែលគ្មានតម្លៃផ្ទាល់ខ្លួន។ ទុកវាទទេ ហើយចំណាយគ្រប់យ៉ាងនៅក្នុងរបាយការណ៍ស្មើសូន្យ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='កម្លាំងអគ្គិសនីមួយគីឡូវ៉ាត់ម៉ោងចំណាយប៉ុន្មាននៅម៉ាស៊ីនបូមនេះ។ ទុកវាទទេ ហើយម៉ាស៊ីនបូមនេះប្រើតម្លៃដែលបានកំណត់សម្រាប់បណ្ដាញទាំងមូល ក្រោម ការកំណត់, ថាមពល។';
$ec_lang['lpn_energy_price_pattern']='លំនាំតម្លៃ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='លំនាំមួយដែលគុណតម្លៃនៅជំហាននីមួយៗនៃលំនាំ ដែលជារបៀបចែងអត្រាក្រៅម៉ោងខ្ពស់។ ទុកវាទទេសម្រាប់តម្លៃតែមួយពេញការដំណើរការទាំងមូល។';
$ec_lang['lpn_energy_demand_charge']='ថ្លៃតម្រូវការកំពូល';
$ec_lang['lpn_energy_demand_charge_tip']='អ្វីដែលក្រុមហ៊ុនផ្គត់ផ្គង់អគ្គិសនីគិតថ្លៃក្នុងមួយ kW សម្រាប់បន្ទុកកំពូលដែលម៉ាស៊ីនបូមក្នុងប្រព័ន្ធទាមទារ។';
$ec_lang['lpn_energy_currency']='រូបិយប័ណ្ណ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='អ្វីដែលអ្នកសរសេរនៅទីនេះត្រូវបានបោះពុម្ពនៅជាប់តួលេខប្រាក់នីមួយៗ។ វាជាស្លាកសម្គាល់មួយ។ តម្លៃ និងចំណាយមិនត្រូវបានបំលែងទេ ដូច្នេះសូមសរសេរតម្លៃជារូបិយប័ណ្ណដែលអ្នកបានសរសេរនៅទីនេះ។';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='ទំព័រនេះមិនផ្ដល់តម្លៃផ្ទាល់ខ្លួនរបស់វាទេ។ អ្វីដែលកម្លាំងអគ្គិសនីចំណាយអាស្រ័យលើក្រុមហ៊ុនផ្គត់ផ្គង់ ប្រទេស ម៉ោង និងឆ្នាំ ដូច្នេះលេខមួយផ្ដល់ជូននៅទីនេះនឹងត្រូវបានអានថាជាការណែនាំមួយ។ បញ្ចូលតម្លៃពីអត្រាកម្រិតរបស់អ្នកផ្ទាល់។';
$ec_lang['lpn_energy_needs_run']='ថាមពលម៉ាស៊ីនបូមគឺជាកម្លាំងអគ្គិសនីបូកសរុបពេញការដំណើរការ ដូច្នេះវាត្រូវការការគណនាឆ្លងកាត់ពេលវេលា៖ ឧបករណ៍ដោះស្រាយ EPANET និងរយៈពេលដំណើរការសរុប។ កំណត់ រយៈពេលដំណើរការសរុប នៅក្នុង ការកំណត់, ការគណនា, ពេលវេលា ចុចប៊ូតុង ដំណើរការ រួចបើក ទឹក, របាយការណ៍, ថាមពលម៉ាស៊ីនបូម។';
$ec_lang['lpn_energy_no_pumps']='បណ្ដាញនេះគ្មានម៉ាស៊ីនបូមទេ ដូច្នេះគ្មានអ្វីកំពុងប្រើកម្លាំងអគ្គិសនីទេ។';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='ការប្រៀបធៀបសេណារីយ៉ូ';
$ec_lang['lpn_scncmp_menu_tip']='ដោះស្រាយសេណារីយ៉ូគ្រប់មួយនៅក្នុងគម្រោងនេះ ហើយអានពួកវារួមគ្នា៖ សម្ពាធទាបបំផុត និងល្បឿនខ្ពស់បំផុតនៅក្នុងនីមួយៗ។';
$ec_lang['lpn_scncmp_running']='កំពុងដោះស្រាយសេណារីយ៉ូគ្រប់មួយ…';
$ec_lang['lpn_scncmp_empty']='គ្មានអ្វីត្រូវបានគូរនៅឡើយទេ ដូច្នេះគ្មានអ្វីត្រូវដោះស្រាយឡើយ។';
$ec_lang['lpn_scncmp_col_minpressure']='សម្ពាធទាបបំផុត';
$ec_lang['lpn_scncmp_col_maxvelocity']='ល្បឿនខ្ពស់បំផុត';
$ec_lang['lpn_scncmp_at']='{value} នៅ {id}';
$ec_lang['lpn_scncmp_current']='(កំពុងបើកឥឡូវនេះ)';
$ec_lang['lpn_scncmp_note']='សេណារីយ៉ូគ្រប់មួយត្រូវបានដោះស្រាយពីច្បាប់ចម្លងនៃគំនូរ។ គ្មានអ្វីនៅទីនេះផ្លាស់ប្ដូរគម្រោងទេ ហើយសេណារីយ៉ូដែលអ្នកកំពុងធ្វើការនៅត្រូវបានទុកឲ្យនៅដដែល។';
$ec_lang['lpn_energy_over']='សម្រាប់ការគណនាឆ្លងកាត់ពេលវេលា {time}';
$ec_lang['lpn_energy_col_pump']='ម៉ាស៊ីនបូម';
$ec_lang['lpn_energy_col_running']='% នៃការដំណើរការ';
$ec_lang['lpn_energy_col_effic']='ប្រសិទ្ធភាព';
$ec_lang['lpn_energy_col_avg_kw']='kW មធ្យម';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='កម្លាំងអគ្គិសនីជាមធ្យមដែលប្រើនៅពេលម៉ាស៊ីនបូមនេះកំពុងបើក។ វាមិនត្រូវបានយកមធ្យមលើពេលឈប់ដំណើរការទេ ដូច្នេះម៉ាស៊ីនបូមមួយដែលឈប់ដំណើរការភាគច្រើននៃការគណនាឆ្លងកាត់ពេលវេលា នៅតែរាយការណ៍កម្លាំងអគ្គិសនីដែលវាបានប្រើពេលកំពុងបើក។';
$ec_lang['lpn_energy_col_peak_kw']='kW កំពូល';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='ចំណាយ';
$ec_lang['lpn_energy_total_kwh']='ថាមពលបានប្រើ';
$ec_lang['lpn_energy_total_energy_cost']='ចំណាយថាមពល';
$ec_lang['lpn_energy_peak_kw']='ការប្រើប្រាស់កម្លាំងអគ្គិសនីកំពូល';
$ec_lang['lpn_energy_total_demand_charge']='ថ្លៃតម្រូវការកំពូល';
$ec_lang['lpn_energy_total_cost']='ចំណាយសរុប';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='ស្ថានភាព';
$ec_lang['lpn_reports_status_tip']='អ្វីដែលបានផ្លាស់ប្ដូរពេញការក្លែងធ្វើលើរយៈពេលចុងក្រោយ តាមលំដាប់ពេលវេលា៖ ម៉ាស៊ីនបូម និងវ៉ាល់បើក ឬបិទ ធុងទឹកបំពេញ បង្ហូរ ពេញ ឬស្ងួត និងជំហានដែលមិនប្រសព្វគ្នាពេញលេញ។';
$ec_lang['lpn_status_title']='របាយការណ៍ស្ថានភាព';
$ec_lang['lpn_status_needs_run']='របាយការណ៍ស្ថានភាពរាយអ្វីដែលបានផ្លាស់ប្ដូរអំឡុងពេលការក្លែងធ្វើលើរយៈពេលមួយ។ កំណត់ រយៈពេលដំណើរការសរុប នៅក្នុង ការកំណត់, ការគណនា, ពេលវេលា ចុច ដំណើរការ រួចបើក ទឹក, របាយការណ៍, របាយការណ៍ស្ថានភាព។';
$ec_lang['lpn_status_empty']='គ្មានអ្វីផ្លាស់ប្ដូរស្ថានភាពក្នុងអំឡុងការដំណើរការនេះទេ។';
$ec_lang['lpn_status_col_time']='ពេលវេលា';
$ec_lang['lpn_status_col_event']='ព្រឹត្តិការណ៍';
$ec_lang['lpn_status_opened']='{type} {id} បានបើក';
$ec_lang['lpn_status_closed']='{type} {id} បានបិទ';
$ec_lang['lpn_status_filling']='{type} {id} កំពុងបំពេញ';
$ec_lang['lpn_status_emptying']='{type} {id} កំពុងបង្ហូរ';
$ec_lang['lpn_status_full']='{type} {id} ពេញ';
$ec_lang['lpn_status_dry']='{type} {id} ស្ងួត';
$ec_lang['lpn_status_no_converge']='ដំណោះស្រាយធារាសាស្ត្រនៅជំហាននេះមិនប្រសព្វគ្នាពេញលេញទេ; លេខដែលបានបង្ហាញគឺជុំចុងក្រោយរបស់វា។';
$ec_lang['lpn_status_note']='អានពីការដំណើរការលើរយៈពេលដូចគ្នានឹងផ្ទាំងតារាង និងរបាយការណ៍ពេញលេញ។ មានតែការផ្លាស់ប្ដូរប៉ុណ្ណោះដែលបានរាយ មិនមែនរាល់ជំហានទេ។';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='ពេញលេញ';
$ec_lang['lpn_reports_full_tip']='ថ្នាំង និងតំណគ្រប់មួយ នៅជំហានពេលវេលារាយការណ៍គ្រប់ជំហាននៃការដំណើរការចុងក្រោយ ជាតារាងតែមួយដែលអ្នកអាចទាញយក ឬបោះពុម្ព។';
$ec_lang['lpn_full_title']='របាយការណ៍ពេញលេញ';
$ec_lang['lpn_full_needs_run']='របាយការណ៍ពេញលេញរាយថ្នាំង និងតំណគ្រប់មួយ នៅជំហានពេលវេលារាយការណ៍គ្រប់ជំហាន។ ចុច ដំណើរការ រួចបើក ទឹក, របាយការណ៍, របាយការណ៍ពេញលេញ។';
$ec_lang['lpn_full_note']='ជួរដេកមួយក្នុងមួយថ្នាំង ឬតំណ ក្នុងមួយជំហានពេលវេលារាយការណ៍ ក្នុងឯកតាដែលបានបង្ហាញនៅលើផ្ទាំងតារាង។ ក្រឡាទទេជាជួរឈរដែលបរិមាណនោះគ្មាន។ ការទាញយក ឬបោះពុម្ពនាំយកគ្រប់ជំហានពេលវេលា; តារាងខាងក្រោមបង្ហាញតែមួយក្នុងមួយពេល។';
$ec_lang['lpn_full_step_label']='ជំហានពេលវេលា';
$ec_lang['lpn_full_download_csv']='ទាញយក CSV';
$ec_lang['lpn_full_print']='បោះពុម្ពរបាយការណ៍';
$ec_lang['lpn_full_col_time']='ពេលវេលា';
$ec_lang['lpn_full_col_type']='ប្រភេទ';
$ec_lang['lpn_full_col_id']='លេខសម្គាល់';
$ec_lang['lpn_full_row_count']='ជួរដេក {n}។';
$ec_lang['lpn_energy_no_price']='គ្មានតម្លៃអគ្គិសនីត្រូវបានចែងទេ ដូច្នេះចំណាយគ្រប់យ៉ាងនៅទីនេះស្មើសូន្យ។ កំណត់មួយនៅក្រោម ការកំណត់, ថាមពល។';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='បណ្ដាញនេះចែងតម្លៃស្មើសូន្យ ដូច្នេះចំណាយគ្រប់យ៉ាងនៅទីនេះស្មើសូន្យ។ ប្ដូរវានៅក្រោម ការកំណត់, ថាមពល។';
$ec_lang['lpn_energy_curve_note']='ម៉ាស៊ីនបូមទាំងនេះហៅខ្សែកោងប្រសិទ្ធភាពដែលគ្មានចំណុចទេ៖ {ids}។ ពួកវាបានដំណើរការនៅប្រសិទ្ធភាពដែលបានកំណត់សម្រាប់បណ្ដាញទាំងមូល។';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_rank']='លំដាប់';
$ec_lang['lpn_labels_col_drop']='ដក';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='ថ្នាំង និងតំណ';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='ចន្លោះស្មើគ្នា';
$ec_lang['lpn_color_mode_quantile']='Quantile (ចំនួនស្មើគ្នា)';
$ec_lang['lpn_color_mode_jenks']='ការបំបែកធម្មជាតិ (Jenks)';
$ec_lang['lpn_color_mode_stddev']='គម្លាតគំរូ';
$ec_lang['lpn_color_mode_pretty']='ស្អាត (បង្គត់)';
$ec_lang['lpn_color_mode_log']='លោការីត';
$ec_lang['lpn_color_mode_pressure']='សម្ពាធ';
$ec_lang['lpn_color_mode_manual']='ដោយដៃ';

// ---- LIBRARIES (ROADMAP Tasks 462 and 460) ---------------------------------------------------
// The document has carried patterns, curves and controls since Task 423; nothing on the page could
// see one. This is that interface. Tom, 2026-08-20: "for Water Networks, I think we also need the
// following in a group: Libraries (Patterns, Curves, Controls, Pumps, Pipes, Custom), Settings,
// Simulate, Transport, Time selectors."
//
// ONE NAME, THREE DOORS: the toolbar button, the Edit menu row and the box's own title all read
// this key, exactly as lpn_menu_settings serves the Settings box's three.
// Plural, because it is a shelf of them: a user opens Libraries to reach the patterns, not to reach
// "the library".
$ec_lang['lpn_library_menu']='បណ្ណាល័យ';
$ec_lang['lpn_library_menu_tip']='គ្រប់គ្រងលំនាំតម្រូវការ ខ្សែកោងម៉ាស៊ីនបូម និងច្បាប់ត្រួតពិនិត្យសម្រាប់គម្រោងនេះ។';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='លំនាំ';
$ec_lang['lpn_library_patterns_tip']='លំនាំគឺជាបញ្ជីតម្គុណដែលធ្វើម្ដងទៀត។ តម្គុណនីមួយៗអនុវត្តសម្រាប់ចន្លោះពេលលំនាំមួយ ដូច្នេះលេខ 24 ក្នុងជំហានមួយម៉ោង បង្កើតជាថ្ងៃមួយដែលធ្វើម្ដងទៀត។ តម្រូវការ 10 ជាមួយតម្គុណ 1.5 គឺស្មើ 15 នៅភ្លែតនោះ។';
$ec_lang['lpn_library_curves']='ខ្សែកោង';
$ec_lang['lpn_library_curves_tip']='ខ្សែកោងគឺជាបញ្ជីចំណុចដែលប្រាប់ពីរបៀបដែលអ្វីមួយដំណើរការ៖ តើម៉ាស៊ីនបូមបន្ថែមថ្ពល់ប៉ុន្មាននៅលំហូរនីមួយៗ តើវាមានប្រសិទ្ធភាពប៉ុន្មាននៅលំហូរនោះ ឬតើវ៉ាល់មួយបាត់បង់ថ្ពល់ប៉ុន្មាននៅលំហូរនីមួយៗ។';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='ខ្សែកោងមួយជារបស់គម្រោង ហើយម៉ាស៊ីនបូម ឬវ៉ាល់មួយចង្អុលបញ្ជាក់ថាតើវាប្រើខ្សែកោងមួយណានៅក្នុងលក្ខណៈសម្បត្តិផ្ទាល់ខ្លួនរបស់វា។ ធាតុច្រើនអាចប្រើខ្សែកោងតែមួយ ហើយការកែសម្រួលវានៅទីនេះផ្លាស់ប្ដូរធាតុទាំងអស់នោះ។ សម្រាប់ខ្សែកោងថ្ពល់ម៉ាស៊ីនបូម ការដំណើរការប្រើខ្សែកោងដែលសមតាមចំណុចទាំងនោះ ដូចបានបង្ហាញ; សម្រាប់ប្រភេទផ្សេងទៀតទាំងអស់ វាភ្ជាប់ចំណុចទាំងនោះដោយបន្ទាត់ត្រង់ ដូចបានបង្ហាញ។';
$ec_lang['lpn_library_curve_add']='បន្ថែមខ្សែកោង';
$ec_lang['lpn_library_curve_type_tip']='ខ្សែកោងនេះពិពណ៌នាអ្វី';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='ប្រភេទខ្សែកោង';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='សមីការ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='ខ្សែកោងដែលបានសម្របតាមចំណុច និងបន្ទាត់ដែលបានគូរនៅលើក្រាបខាងក្រោម។ វាត្រូវបានគណនារាល់ពេលដែលវាត្រូវបានបង្ហាញ ហើយមិនត្រូវបានរក្សាទុកទេ ហើយលេខរបស់វាគឺជាឯកតាដែលតារាងខាងលើបង្ហាញ។ ឧបករណ៍ដោះស្រាយខាងក្នុងដំណើរការលើសមីការនេះ; ឧបករណ៍ដោះស្រាយ EPANET អានចំណុចខ្លួនឯង។';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='ជ្រើសរើសមួយ ឬពីរជួរឈរនៅក្នុងសៀវភៅបញ្ជី ចម្លងវា ហើយបិទភ្ជាប់ចូលទៅក្នុងក្រឡាទីមួយដែលអ្នកចង់ឲ្យវាចុះចត។ ជួរដេកត្រូវបានបន្ថែមតាមតម្រូវការ។ អ្នកក៏អាចបិទភ្ជាប់ជួរដែលបានចម្លងផ្ទាល់ពីឯកសារ EPANET បានដែរ រួមទាំងឈ្មោះខ្សែកោង។';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='ការពិពណ៌នា';
$ec_lang['lpn_library_curve_note_tip']='ខ្សែកោងនេះជាអ្វី តាមពាក្យផ្ទាល់ខ្លួនរបស់អ្នក។ វាត្រូវបានសរសេរនៅខាងលើខ្សែកោងនៅក្នុងឯកសារ EPANET ហើយត្រូវបានអានត្រឡប់ពីទីនោះ។';
$ec_lang['lpn_library_curve_remove_point']='លុបចំណុចនេះ';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='ចម្លងចំណុច';
$ec_lang['lpn_library_curve_copy_tip']='ចម្លងចំណុចនីមួយៗជាពីរជួរឈរ រួចរាល់សម្រាប់បិទភ្ជាប់ចូលទៅសៀវភៅបញ្ជីមួយ។';
$ec_lang['lpn_library_curve_copy_manual']='ចម្លងចំណុចទាំងនេះ';
$ec_lang['lpn_library_curve_used_by']='ធាតុដែលកំពុងប្រើខ្សែកោងនេះ';
$ec_lang['lpn_library_curve_unused']='គ្មានអ្វីកំពុងប្រើខ្សែកោងនេះទេ។';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='ខ្សែកោងនេះកំពុងប្រើដោយធាតុ {count}៖ {ids}។ សូមប្ដូរពួកវាឲ្យប្រើខ្សែកោងផ្សេងជាមុនសិន រួចលុបខ្សែកោងនេះ។';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='ប្រភេទបំពង់';
$ec_lang['lpn_library_pipetypes_tip']='ប្រភេទបំពង់គឺជានិយមន័យមួយ ដែលបំពង់ច្រើនអាចយោងទៅសម្រាប់អង្កត់ផ្ចិត ភាពក្រញ៉ោង និងមេគុណប្រតិកម្មរបស់វា។ ការកែសម្រួលនិយមន័យនេះកែសម្រួលបំពង់ទាំងអស់ដែលប្រើវា។';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='គម្រោងនីមួយៗមានបណ្ណាល័យប្រភេទបំពង់ផ្ទាល់ខ្លួន។ អ្នកអាចទុកលក្ខណៈសម្បត្តិខ្លះទទេនៅក្នុងនិយមន័យប្រភេទបំពង់មួយ។ ឧទាហរណ៍ ប្រភេទបំពង់ដែលចែងភាពក្រញ៉ោង តែគ្មានអង្កត់ផ្ចិត គឺអាចធ្វើបាន។ អ្នកភ្ជាប់ប្រភេទបំពង់ទៅបំពង់នៅក្នុងកម្មវិធីកែសម្រួលលក្ខណៈសម្បត្តិរបស់វា។ ការកែសម្រួលនិយមន័យនៅទីនេះផ្លាស់ប្ដូរបំពង់ទាំងអស់ដែលយោងទៅវា។';
$ec_lang['lpn_library_pipetype_add']='បន្ថែមប្រភេទបំពង់';
$ec_lang['lpn_library_pipetype_blank_tip']='លក្ខណៈសម្បត្តិទទេនៅក្នុងនិយមន័យប្រភេទបំពង់មួយ ត្រូវបានទុកឲ្យបញ្ចូលដោយឡែកសម្រាប់បំពង់នីមួយៗ។';
$ec_lang['lpn_library_pipetype_used_by']='បំពង់ដែលកំពុងប្រើប្រភេទនេះ';
$ec_lang['lpn_library_pipetype_unused']='គ្មានអ្វីកំពុងប្រើប្រភេទបំពង់នេះទេ។';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='ប្រភេទបំពង់នេះកំពុងប្រើដោយបំពង់ {count}៖ {ids}។ សូមផ្ដាច់វាចេញពីពួកវាមុននឹងលុប។';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='ប្រភេទបំពង់';
$ec_lang['lpn_field_pipetype_tip']='ប្រភេទបំពង់នៅក្នុងបណ្ណាល័យគម្រោងដែលបំពង់នេះប្រើ។ លក្ខណៈសម្បត្តិដែលមាននៅក្នុងប្រភេទបំពង់ត្រូវបានបិទមិនឲ្យកែសម្រួលនៅទីនេះទេ។ ផ្ដាច់ប្រភេទបំពង់ដើម្បីបើកការកែសម្រួលនៅទីនេះ។';
$ec_lang['lpn_pipetype_none']='គ្មានប្រភេទបំពង់ត្រូវបានជ្រើសរើសទេ';
$ec_lang['lpn_pipetype_detach']='ផ្ដាច់ចេញពីប្រភេទបំពង់';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='ចម្លងតម្លៃដែលបំពង់នេះអានពីប្រភេទរបស់វា ចូលទៅក្នុងបំពង់ផ្ទាល់ខ្លួន ហើយឈប់ប្រើប្រភេទនោះ។ តម្លៃរបស់បំពង់មិនផ្លាស់ប្ដូរឥឡូវនេះទេ ហើយចាប់ពីពេលនេះទៅ អ្នកអាចកែសម្រួលតម្លៃទាំងនេះនៅទីនេះបាន។';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='គ្រឿងបំពង់';
$ec_lang['lpn_library_fittings_tip']='បញ្ជីគ្រឿងបំពង់គឺជាសំណុំនៃគ្រឿងបំពង់ និងបរិមាណរបស់វា ដែលបំពង់ច្រើនអាចយោងទៅ។ វារួមបូកបញ្ចូលគ្នាទៅជាមេគុណនៃការបាត់បង់មូលដ្ឋានតែមួយ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='គម្រោងនីមួយៗមានបណ្ណាល័យគ្រឿងបំពង់ផ្ទាល់ខ្លួន។ បញ្ជីគ្រឿងបំពង់មួយមានគ្រឿងបំពង់ជាមួយបរិមាណសម្រាប់នីមួយៗ ហើយវារួមបូកបញ្ចូលគ្នាទៅជាមេគុណនៃការបាត់បង់មូលដ្ឋានតែមួយ។ ទាំងបំពង់ និងប្រភេទបំពង់អាចយោងទៅបញ្ជីមួយបាន។';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='គ្រឿងបំពង់ដែលបានផ្ដល់ជូននៅទីនេះ គឺជាដប់បីមុខនៅក្នុងតារាង 3.3 នៃសៀវភៅណែនាំអ្នកប្រើ EPANET 2.2។ ការជ្រើសរើសមួយចម្លងមេគុណរបស់វាចូលទៅជួរដេក ដែលអ្នកអាចផ្លាស់ប្ដូរបាន។ មេគុណមួយអាស្រ័យលើទំហំ និងម៉ាកនៃគ្រឿងបំពង់នោះ ដូច្នេះចាត់ទុកតារាងនេះជាចំណុចចាប់ផ្ដើម មិនមែនជាចម្លើយចុងក្រោយទេ។';
$ec_lang['lpn_library_fittings_add']='បន្ថែមបញ្ជីគ្រឿងបំពង់';
$ec_lang['lpn_library_fittings_used_by']='បំពង់ដែលកំពុងប្រើបញ្ជីគ្រឿងបំពង់នេះ';
$ec_lang['lpn_library_fittings_unused']='គ្មានអ្វីកំពុងប្រើបញ្ជីគ្រឿងបំពង់នេះទេ។';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='បញ្ជីគ្រឿងបំពង់នេះកំពុងប្រើដោយបំពង់ {count}៖ {ids}។ សូមផ្ដាច់វាចេញពីពួកវាមុននឹងលុប។';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='នាំចូលបណ្ណាល័យ…';
$ec_lang['lpn_library_import_tip']='ជ្រើសរើសឯកសារគម្រោងមួយផ្សេងទៀត ហើយចម្លងបណ្ណាល័យទាំងមូលពីវាចូលទៅគម្រោងនេះ។ អ្វីៗដែលឈ្មោះរបស់វាត្រូវបានប្រើរួចហើយនៅទីនេះ ត្រូវបានរំលង ហើយបានរាយ ដូច្នេះគ្មានអ្វីដែលអ្នកមានរួចហើយត្រូវបានផ្លាស់ប្ដូរទេ។';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='ជ្រើសរើសអ្វីត្រូវចម្លងពី {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='បណ្ណាល័យនីមួយៗដែលអ្នកធីក ត្រូវបានចម្លងទាំងមូល។ លុបអ្វីដែលអ្នកមិនចង់បានពេលក្រោយ តាមរបៀបដែលអ្នកលុបធាតុផ្សេងទៀតណាមួយ។';
$ec_lang['lpn_library_import_go']='នាំចូល';
$ec_lang['lpn_library_import_no_libraries']='ឯកសារគម្រោងនោះគ្មានបណ្ណាល័យត្រូវចម្លងទេ។';
$ec_lang['lpn_library_import_heading']='បាននាំចូលពី {file}';
$ec_lang['lpn_library_import_added']='បានចម្លងចូល៖ {names}';
$ec_lang['lpn_library_import_conflict']='បានរំលង ព្រោះគម្រោងនេះមានធាតុឈ្មោះដូចគ្នារួចហើយ៖ {names}។ គ្មានអ្វីនៅទីនេះត្រូវបានផ្លាស់ប្ដូរទេ។ ប្ដូរឈ្មោះមួយក្នុងចំណោមពួកវា រួចនាំចូលម្ដងទៀត ប្រសិនបើអ្នកចង់បានទាំងពីរ។';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='ឯកសារគម្រោងនោះគ្មានធាតុទាំងនេះត្រូវចម្លងទេ។';
$ec_lang['lpn_library_import_curve_shape']='ខ្សែកោងទាំងនេះចូលមកយ៉ាងពិតប្រាកដតាមអ្វីដែលឯកសារបានសរសេរ ហើយការដំណើរការមួយមិនអាចប្រើវាបានទេ លុះត្រាតែជួរឈរទីមួយរបស់វាកើនឡើងពីចំណុចមួយទៅចំណុចបន្ទាប់៖ {names}';
$ec_lang['lpn_library_import_needs_fittings']='ប្រភេទបំពង់ទាំងនេះសំដៅទៅបញ្ជីគ្រឿងបំពង់ដែលគម្រោងនេះគ្មាន៖ {names}។ នាំចូលបណ្ណាល័យគ្រឿងបំពង់ពីឯកសារដូចគ្នា ហើយពួកវានឹងរកឃើញវា។';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='ការព្រមាន៖ ឯកតាមិនត្រូវគ្នា។ នឹងត្រូវបាននាំចូលដូចមានស្រាប់។ មិនណែនាំទេ។';
$ec_lang['lpn_library_import_units_line']='{name}៖ គម្រោងនេះបង្ហាញ {mine} ឯកសារបង្ហាញ {theirs}។';
$ec_lang['lpn_fitting_qty']='បរិមាណ';
$ec_lang['lpn_fitting_name']='គ្រឿងបំពង់';
$ec_lang['lpn_fitting_k']='មេគុណ';
$ec_lang['lpn_fitting_add']='បន្ថែមគ្រឿងបំពង់';
$ec_lang['lpn_fitting_remove']='លុប';
$ec_lang['lpn_fitting_total']='មេគុណនៃការបាត់បង់មូលដ្ឋានសរុប, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='បញ្ជីគ្រឿងបំពង់';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='បញ្ជីគ្រឿងបំពង់ពីបណ្ណាល័យគម្រោង។ បរិមាណ និងមេគុណរបស់វារួមបូកបញ្ចូលគ្នាទៅជាមេគុណនៃការបាត់បង់មូលដ្ឋានរបស់បំពង់នេះ ហើយប្រអប់មេគុណក្លាយជាអានតែប៉ុណ្ណោះបន្ទាប់ពីនោះ។ ទុកវាមិនជ្រើសរើសដើម្បីវាយបញ្ចូលមេគុណដោយខ្លួនឯង។';
$ec_lang['lpn_fittings_none']='គ្មានបញ្ជីគ្រឿងបំពង់ត្រូវបានជ្រើសរើសទេ';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='វ៉ាល់ Globe, បើកពេញលេញ';
$ec_lang['lpn_fitting_angle']='វ៉ាល់ Angle, បើកពេញលេញ';
$ec_lang['lpn_fitting_swingcheck']='វ៉ាល់ Swing check, បើកពេញលេញ';
$ec_lang['lpn_fitting_gate']='វ៉ាល់ Gate, បើកពេញលេញ';
$ec_lang['lpn_fitting_elbow_short']='កែងកាំខ្លី';
$ec_lang['lpn_fitting_elbow_medium']='កែងកាំមធ្យម';
$ec_lang['lpn_fitting_elbow_long']='កែងកាំវែង';
$ec_lang['lpn_fitting_elbow_45']='កែង ៤៥ដឺក្រេ';
$ec_lang['lpn_fitting_return_bend']='ដងកោងត្រឡប់បិទ';
$ec_lang['lpn_fitting_tee_run']='សន្លាក់ T ស្តង់ដារ, លំហូរឆ្លងតាមខ្សែសំខាន់';
$ec_lang['lpn_fitting_tee_branch']='សន្លាក់ T ស្តង់ដារ, លំហូរឆ្លងតាមសាខា';
$ec_lang['lpn_fitting_entrance']='ច្រកចូលកែង';
$ec_lang['lpn_fitting_exit']='ច្រកចេញ';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='គ្រឿងបំពង់ផ្សេងទៀត';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='បានរក្សាទុក {file}';
$ec_lang['lpn_inp_export_flat_lead']='ឯកសារ EPANET ដែលបាននាំចេញ ស្មើនឹងគម្រោងនេះខាងលេខ។ ប៉ុន្តែវាគ្មានកន្លែងសម្រាប់អ្វីៗខាងក្រោមទេ៖';
$ec_lang['lpn_inp_export_flat_types']='បំពង់ {n} នៅទីនេះយោងទៅប្រភេទបំពង់ {t}។ នៅក្នុងឯកសារ បំពង់នីមួយៗនោះមានច្បាប់ចម្លងលេខផ្ទាល់ខ្លួន ដូច្នេះចម្លើយនៅតែដដែល។ អ្វីដែលឯកសារមិនអាចផ្ទុកបានគឺប្រភេទបំពង់ខ្លួនឯង ដូច្នេះការកែសម្រួលនិយមន័យមួយ ហើយឲ្យបំពង់ទាំងអស់ដើរតាម គឺជាអ្វីដែលមានតែឯកសារគម្រោងផ្ទាល់ខ្លួនរបស់អ្នកទេដែលកត់ត្រា។';
$ec_lang['lpn_inp_export_flat_coords']='ឯកសារ EPANET ផ្ទុកទីតាំងមួយសម្រាប់ថ្នាំងនីមួយៗ។ សេណារីយ៉ូនេះដាក់ {n} ក្នុងចំណោមវាទៅកន្លែងផ្សេង ហើយទីតាំងទាំងនោះគឺជាទីតាំងនៅក្នុងឯកសារ។ សេណារីយ៉ូផ្សេងទៀតគ្រប់មួយរក្សាទីតាំងផ្ទាល់ខ្លួនរបស់វានៅក្នុងឯកសារគម្រោងរបស់អ្នកតែម្នាក់ឯង។';
$ec_lang['lpn_inp_export_flat_fittings']='ឯកសារ EPANET មិនអាចផ្ទុកបញ្ជីកែង វ៉ាល់ និងសន្លាក់ T នៅក្នុងឯកសារគម្រោងរបស់អ្នកបានទេ។ មេគុណនៃការបាត់បង់មូលដ្ឋានរបស់បំពង់ {n} នៅទីនេះ ត្រូវបានរួមបូកពីបញ្ជីគ្រឿងបំពង់មួយ។ ចំនួនសរុបចូលទៅក្នុងឯកសារដូចវាឈរនោះឯង ដូច្នេះគ្មានអ្វីអំពីចម្លើយផ្លាស់ប្ដូរទេ។';
$ec_lang['lpn_library_controls']='ច្បាប់ត្រួតពិនិត្យ';
$ec_lang['lpn_library_controls_tip']='ច្បាប់ត្រួតពិនិត្យគឺជាប្រយោគមួយដែលបើក ឬបិទតំណមួយ ឬផ្ដល់ការកំណត់ដល់វា នៅពេលកម្រិតទឹក សម្ពាធ ឬពេលវេលាបញ្ជាក់ឲ្យធ្វើដូច្នេះ។';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='បន្ថែមលំនាំមួយ';
$ec_lang['lpn_library_pattern_values']='តម្គុណ';
$ec_lang['lpn_library_pattern_values_tip']='តម្គុណនានា បំបែកដោយចន្លោះ ឬសញ្ញាក្បៀស។ បិទភ្ជាប់ជួរឈរពីសៀវភៅបញ្ជីអេឡិចត្រូនិកបើអ្នកមាន។ បញ្ជីនេះធ្វើម្ដងទៀតរហូតដល់ការដំណើរការចប់ ដូច្នេះវាមិនចាំបាច់គ្របដណ្ដប់ពេញការដំណើរការទាំងមូលទេ។';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='តម្គុណ {n}, ដាច់ពីគ្នា {step}, គ្របដណ្ដប់ {span}';
$ec_lang['lpn_library_pattern_none']='គ្មានលំនាំ';
$ec_lang['lpn_settings_default_pattern']='លំនាំតម្រូវការលំនាំដើម';
$ec_lang['lpn_settings_default_pattern_tip']='ថ្នាំងគ្រប់ដែលគ្មានលំនាំប្រើលំនាំនេះ។';
$ec_lang['lpn_library_control_add']='បន្ថែមច្បាប់ត្រួតពិនិត្យមួយ';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='ប្រយោគមួយ ដោយប្រើពាក្យដែល EPANET ប្រើ។ មានទម្រង់បួន៖ LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1, និង LINK 12 CLOSED AT CLOCKTIME 3 AM។ ជំនួសឲ្យ OPEN ឬ CLOSED អ្នកអាចសរសេរជាលេខមួយ ដែលជាការកំណត់វ៉ាល់ ឬល្បឿនម៉ាស៊ីនបូម។ សូមទុកពាក្យគន្លឹះជាភាសាអង់គ្លេស ព្រោះនោះជាអ្វីដែលទំព័រនេះអាន។';
$ec_lang['lpn_library_control_ok']='✓ បានយល់';
$ec_lang['lpn_library_control_bad']='⚠ មិនបានយល់';
$ec_lang['lpn_library_control_missing']='⚠ បណ្ដាញនេះគ្មានអ្វីមួយឈ្មោះ {id} ទេ';
$ec_lang['lpn_library_rules']='ក្បួន';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='ក្បួនមួយជាកថាខណ្ឌខ្លីមួយ ដែលបើក ឬបិទតំណមួយ ឬផ្ដល់ការកំណត់មួយ នៅពេលកម្រិតទឹក សម្ពាធ លំហូរ ឬពេលវេលា ឈានដល់តម្លៃដែលអ្នកកំណត់។ ក្បួនអាចធ្វើតេស្តលើសពីមួយក្នុងពេលតែមួយ ហើយអាចប្រាប់ថាត្រូវធ្វើអ្វីនៅពេលតេស្តបរាជ័យ។';
$ec_lang['lpn_library_rule_add']='បន្ថែមក្បួន';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='ក្បួនមួយ ជាមួយពាក្យដែល EPANET ប្រើ មួយឃ្លាក្នុងមួយបន្ទាត់។ បន្ទាត់ដំបូងដាក់ឈ្មោះវា៖ RULE 1។ បន្ទាប់មកលក្ខខណ្ឌមួយ៖ IF TANK 2 LEVEL BELOW 17.1។ បន្ទាប់មកអ្វីត្រូវធ្វើ៖ THEN PUMP 9 STATUS IS OPEN។ បន្ទាត់ចុងក្រោយអាចដាក់អាទិភាព៖ PRIORITY 1។ បន្ថែមបន្ទាត់ AND ឬ OR ដើម្បីធ្វើតេស្តលើសពីមួយ និងបន្ទាត់ ELSE ដើម្បីប្រាប់ថាត្រូវធ្វើអ្វីនៅពេលតេស្តបរាជ័យ។ លក្ខខណ្ឌមួយអាចអាន LEVEL, HEAD, GRADE, PRESSURE ឬ DEMAND នៅលើថ្នាំងមួយ, FLOW, STATUS ឬ SETTING នៅលើតំណមួយ ឬ TIME និង CLOCKTIME នៅលើ SYSTEM។ សរសេរលេខតាមឯកតាដែលគម្រោងនេះកំពុងបង្ហាញ ពួកវាត្រូវបានបំលែងជូនអ្នក។ ទុកពាក្យគន្លឹះជាភាសាអង់គ្លេស ព្រោះនោះជាអ្វីដែលទំព័រនេះ និង EPANET អាន។';
$ec_lang['lpn_library_rule_ok']='✓ ក្បួននេះត្រូវបានអាន';
$ec_lang['lpn_library_rule_bad']='⚠ ក្បួននេះមិនអាចអានបានទេ';
$ec_lang['lpn_library_rule_missing']='⚠ បណ្ដាញនេះគ្មានអ្វីមួយឈ្មោះ {id} ទេ';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='តម្រូវការមូលដ្ឋាន';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='លំហូរដែលថ្នាំងនេះទាញនៅជំហានពេលវេលាដែលបានបង្ហាញ៖ តម្រូវការមូលដ្ឋាននីមួយៗគុណនឹងលំនាំផ្ទាល់របស់វា ហើយបូកបញ្ចូលគ្នា។ វាត្រូវបានគណនា មិនមែនវាយបញ្ចូលទេ ដូច្នេះវាផ្លាស់ប្ដូរតាមនាឡិកា ហើយមិនអាចកែសម្រួលបានទេ។';
$ec_lang['lpn_field_demand_pattern']='លំនាំតម្រូវការ';
$ec_lang['lpn_field_demand_pattern_tip']='របៀបដែលតម្រូវការរបស់ថ្នាំងនេះឡើង និងចុះពេញការដំណើរការ។ ទុកវានៅ គ្មានលំនាំ ដើម្បីតាមលំនាំផ្ទាល់របស់គម្រោង។';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='ការពិពណ៌នា';
$ec_lang['lpn_field_demand_category_tip']='ឈ្មោះ ឬការពិពណ៌នានៃប្រភេទតម្រូវការនេះ។';
$ec_lang['lpn_demand_add']='បន្ថែមប្រភេទតម្រូវការ';
$ec_lang['lpn_demand_add_tip']='បន្ថែមប្រភេទតម្រូវការមួយទៀតនៅថ្នាំងនេះ ដោយមានតម្រូវការមូលដ្ឋាន លំនាំ និងការពិពណ៌នាផ្ទាល់ខ្លួន។ ប្រភេទទាំងនេះបូកបញ្ចូលគ្នា។';
$ec_lang['lpn_demand_remove']='ដកតម្រូវការនេះចេញ';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='លំនាំកម្ពស់';
$ec_lang['lpn_field_head_pattern_tip']='របៀបដែលកម្រិតទឹករបស់អាងស្តុកនេះឡើង និងចុះពេញការដំណើរការ។ កម្ពស់ខាងលើត្រូវបានគុណដោយលំនាំ។';
$ec_lang['lpn_field_pump_speed']='ល្បឿនប្រៀបធៀប';
$ec_lang['lpn_field_pump_speed_tip']='1 មានន័យថាម៉ាស៊ីនបូមនេះកំពុងបង្វិលក្នុងល្បឿនដែលខ្សែកោងរបស់វាត្រូវបានវាស់។ 0.9 ជាម៉ាស៊ីនបូមដដែលបង្វិលយឺតជាង ដែលបន្ថយកម្ពស់ដែលវាបន្ថែម និងលំហូរដែលវាឲ្យឆ្លងកាត់។ លំនាំល្បឿនមួយចូលជំនួសលេខនេះខណៈពេលការដំណើរការកំពុងបន្ត។';
$ec_lang['lpn_field_speed_pattern']='លំនាំល្បឿន';
$ec_lang['lpn_field_speed_pattern_tip']='របៀបដែលល្បឿនរបស់ម៉ាស៊ីនបូមនេះឡើង និងចុះពេញការដំណើរការ។ តម្គុណនីមួយៗគឺជាល្បឿនប្រៀបធៀបសម្រាប់ផ្នែកនោះនៃការដំណើរការ ហើយវាជំនួសការកំណត់ ល្បឿន ជំនួសឲ្យការគុណវា ដូច្នេះតម្គុណ 0 បញ្ឈប់ម៉ាស៊ីនបូម។';

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
$ec_lang['lpn_search_menu']='ស្វែងរកទីកន្លែងតាមឈ្មោះ…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='រកទីក្រុង ផ្លូវ ឬចំណុចសម្គាល់តាមឈ្មោះ ហើយផ្លាស់ទីផែនទីទៅទីនោះ។ ការប្រើលើកទីមួយសួរការអនុញ្ញាតពីអ្នក ព្រោះពាក្យដែលអ្នកវាយបញ្ចូលទៅដល់សេវាឈ្មោះទីកន្លែងរបស់ OpenStreetMap។';
$ec_lang['lpn_search_bar']='ស្វែងរកតាមឈ្មោះ…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='ការស្វែងរកតាមឈ្មោះទីកន្លែងផ្ញើពាក្យដែលអ្នកវាយបញ្ចូលទៅកាន់ nominatim.openstreetmap.org ដែលជាសេវាឈ្មោះទីកន្លែងឥតគិតថ្លៃរបស់ OpenStreetMap Foundation។';
$ec_lang['lpn_search_consent_2']='នេះជាសេវាផ្សេងពីរូបភាពផែនទីផ្លូវនៅពីក្រោយគម្រោងរបស់អ្នក។ រូបភាពទាំងនោះប្រាប់តែថាអ្នកកំពុងមើលទីណា។ ការស្វែងរកមួយប្រាប់ថាអ្នកបានវាយបញ្ចូលអ្វី។ សេវាឈ្មោះទីកន្លែងនឹងទទួលបានពាក្យស្វែងរករបស់អ្នក និងអាសយដ្ឋាន IP របស់អ្នក។ យើងផ្ញើគ្មានអ្វីផ្សេងទៀតទេ ហើយយើងមិនរក្សាកំណត់ត្រានៃការស្វែងរករបស់អ្នកឡើយ។';
$ec_lang['lpn_search_consent_3']='តើយើងអាចផ្ញើការស្វែងរករបស់អ្នកទៅសេវាឈ្មោះទីកន្លែងបានទេ?';
$ec_lang['lpn_search_consent_4']='ប្រសិនបើអ្នកឆ្លើយថាទេ អ្វីៗផ្សេងទៀតទាំងអស់នៅលើទំព័រនេះនៅតែដំណើរការដូចឥឡូវនេះជាក់លាក់ រួមទាំង ទៅកាន់រយៈទទឹង និងបណ្ដោយភូមិសាស្ត្រមួយ។ យើងចងចាំចម្លើយ បាទ/ចាស ដូច្នេះយើងមិនចាំបាច់សួរម្ដងទៀតទេ។ ចម្លើយ ទេ មិនត្រូវបានរក្សាទុកទាល់តែសោះ។';
$ec_lang['lpn_search_refused']='ការស្វែងរកតាមឈ្មោះទីកន្លែងត្រូវបានបិទ ហើយគ្មានអ្វីត្រូវបានផ្ញើទេ។ អ្នកនៅតែអាចប្រើ ទៅកាន់រយៈទទឹង និងបណ្ដោយភូមិសាស្ត្រមួយ។';
$ec_lang['lpn_search_prompt']='ស្វែងរកទីកន្លែងតាមឈ្មោះ។ ទីក្រុង ផ្លូវ ចំណុចសម្គាល់ — ឧទាហរណ៍៖ Petaluma, California';
$ec_lang['lpn_search_empty']='វាយបញ្ចូលឈ្មោះទីកន្លែងដើម្បីស្វែងរក។';
$ec_lang['lpn_search_working']='កំពុងស្វែងរក…';
$ec_lang['lpn_search_busy']='ការស្វែងរកមួយកំពុងដំណើរការរួចហើយ។ សូមរង់ចាំវាឆ្លើយតប។';
$ec_lang['lpn_search_choose']='មានទីកន្លែងច្រើនជាងមួយត្រូវគ្នា។ មួយណា?';
$ec_lang['lpn_search_nochoice']='គ្មានអ្វីត្រូវបានជ្រើសរើសទេ ដូច្នេះផែនទីមិនបានផ្លាស់ទីទេ។';
$ec_lang['lpn_search_badchoice']='នោះមិនមែនជាលេខមួយក្នុងបញ្ជីទេ។';
$ec_lang['lpn_search_none']='រកមិនឃើញអ្វីសម្រាប់ឈ្មោះនោះទេ។';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='សេវាឈ្មោះទីកន្លែងកំពុងសុំឲ្យយើងយឺតជាង។ សូមរង់ចាំមួយនាទី ហើយសាកល្បងម្ដងទៀត។';
$ec_lang['lpn_search_http']='សេវាឈ្មោះទីកន្លែងបានឆ្លើយតបជាមួយកំហុសមួយ។';
$ec_lang['lpn_search_timeout']='សេវាឈ្មោះទីកន្លែងមិនបានឆ្លើយតបទាន់ពេលទេ។ អ្វីៗផ្សេងទៀតទាំងអស់នៅលើទំព័រនេះដំណើរការដោយគ្មានវា។';
$ec_lang['lpn_search_unreadable']='សេវាឈ្មោះទីកន្លែងបានឆ្លើយតបជាមួយអ្វីមួយដែលទំព័រនេះមិនអាចអានបានទេ។';
$ec_lang['lpn_search_offline']='យើងមិនអាចទាក់ទងសេវាឈ្មោះទីកន្លែងបានទេ។ អ្នកប្រហែលជាកំពុងគ្មានអ៊ីនធឺណិត។ អ្វីៗផ្សេងទៀតទាំងអស់នៅលើទំព័រនេះដំណើរការដោយគ្មានវា រួមទាំង ទៅកាន់រយៈទទឹង និងបណ្ដោយភូមិសាស្ត្រមួយ។';
$ec_lang['lpn_search_toofast']='ការស្វែងរកមួយក្នុងមួយវិនាទី — នោះជាអ្វីដែលសេវាឈ្មោះទីកន្លែងអនុញ្ញាត។ សាកល្បងម្ដងទៀតក្នុងពេលបន្តិចទៀត។';
$ec_lang['lpn_search_nofetch']='កម្មវិធីរុករកនេះមិនអាចទាក់ទងសេវាឈ្មោះទីកន្លែងបានទេ។';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox ប្រមូលផ្ដុំវាមកពីសំណុំទិន្នន័យកម្ពស់សាធារណៈជាច្រើន ដូច្នេះគុណភាពរបស់វាអាស្រ័យទាំងស្រុងលើទីតាំងអ្នក។ កន្លែងណាដែលមានការស្ទង់ lidar ថ្នាក់ជាតិ ដូចជា USGS 3DEP ក្នុងផ្នែកភាគច្រើននៃសហរដ្ឋអាមេរិក និងសមមូលរបស់វានៅកន្លែងផ្សេងទៀត វាអាចល្អជាងមួយម៉ែត្រតាមផ្ដេក និងប៉ុន្មានភាគដប់នៃម៉ែត្រតាមបញ្ឈរ។ កន្លែងណាដែលមានតែទិន្នន័យសកលប៉ុណ្ណោះ វាមានប្រហែល 30 ម៉ែត្រតាមផ្ដេក និងច្រើនម៉ែត្រតាមបញ្ឈរ។ Mapbox មិនប្រាប់យើងថាអ្នកទទួលបានប្រភេទណានោះទេ។ សូមចាត់ទុកវាដូចផែនទីខ្សែកម្ពស់ មិនមែនការស្ទង់មតិទេ៖ ពិនិត្យអ្វីៗដែលអ្នកពឹងផ្អែក។';
$ec_lang['lpn_terrain_consent_1']='ការបំពេញកម្ពស់ផ្ញើទីតាំងរបស់ថ្នាំងនីមួយៗដែលត្រូវការកម្ពស់មួយ — រយៈទទឹង និងបណ្ដោយភូមិសាស្ត្ររបស់វា — ទៅកាន់ api.mapbox.com ដើម្បីរកមើលកម្ពស់ដីនៅទីនោះ។';
$ec_lang['lpn_terrain_consent_2']='នេះជាសំណួរផ្សេងពីរូបភាពផែនទីនៅពីក្រោយគម្រោងរបស់អ្នក។ រូបភាពទាំងនោះប្រាប់តែថាអ្នកកំពុងមើលទីណា។ ទីតាំងទាំងនេះគឺជាបណ្ដាញរបស់អ្នកផ្ទាល់។ Mapbox នឹងទទួលបានកូអរដោនេទាំងនោះ និងអាសយដ្ឋាន IP របស់អ្នក។ យើងផ្ញើគ្មានអ្វីផ្សេងទៀតទេ៖ គ្មានឈ្មោះ គ្មានបំពង់ គ្មានគម្រោង។ យើងមិនរក្សាកំណត់ត្រាអំពីវាឡើយ ហើយគ្មានអ្វីត្រូវបានផ្ទុកទៅលើឧបករណ៍នេះទេ លើកលែងតែចម្លើយរបស់អ្នកចំពោះសំណួរនេះ។';
$ec_lang['lpn_terrain_consent_3']='តើយើងអាចផ្ញើទីតាំងថ្នាំងរបស់អ្នកទៅ Mapbox បានទេ?';
$ec_lang['lpn_terrain_consent_4']='ប្រសិនបើអ្នកឆ្លើយថាទេ អ្វីៗផ្សេងទៀតទាំងអស់នៅលើទំព័រនេះនៅតែដំណើរការដូចឥឡូវនេះជាក់លាក់ ហើយអ្នកនៅតែអាចវាយបញ្ចូលកម្ពស់ដោយខ្លួនឯងដូចមុន។ យើងចងចាំចម្លើយ បាទ/ចាស ដូច្នេះយើងមិនចាំបាច់សួរម្ដងទៀតទេ។ ចម្លើយ ទេ មិនត្រូវបានរក្សាទុកទាល់តែសោះ។';
$ec_lang['lpn_terrain_refused']='កម្ពស់មិនត្រូវបានបំពេញទេ ហើយគ្មានអ្វីត្រូវបានផ្ញើឡើយ។ អ្នកអាចវាយបញ្ចូលពួកវាដូចមុន។';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='បំពេញកម្ពស់ថ្នាំង {n} ពី Mapbox DEM មែនទេ?';
$ec_lang['lpn_terrain_confirm_default_1']='ថ្នាំងគ្រប់មានកម្ពស់រួចហើយ ហើយ {n} ក្នុងចំណោមនោះនៅតែជាប់នឹង {v} ដែលជាកម្ពស់ដែលថ្នាំងថ្មីមួយចាប់ផ្ដើមជាមួយ មិនមែនតម្លៃដែលអ្នកបានវាយបញ្ចូលទេ។';
$ec_lang['lpn_terrain_confirm_default_2']='ជំនួសកម្ពស់ថ្នាំង {n} នោះដោយតម្លៃពី Mapbox DEM មែនទេ?';
$ec_lang['lpn_terrain_keep']='ថ្នាំង {k} មានកម្ពស់រួចហើយ ហើយនឹងមិនត្រូវប៉ះពាល់ទេ។';
$ec_lang['lpn_terrain_undo']='ត្រឡប់ក្រោយម្ដង (Ctrl-Z) នាំពួកវាទាំងអស់មកវិញ។';
$ec_lang['lpn_terrain_requests']='{n} សំណើទៅ api.mapbox.com។';
$ec_lang['lpn_terrain_busy']='កម្ពស់កំពុងត្រូវបានបំពេញរួចហើយ។ សូមរង់ចាំពួកវា។';
$ec_lang['lpn_terrain_offmap']='ទីតាំងថ្នាំងទាំងនេះមិននៅលើផែនទីផ្ទៃដីទេ ដូច្នេះគ្មានអ្វីត្រូវបានផ្ញើឡើយ។';
$ec_lang['lpn_terrain_too_wide']='ថ្នាំងទាំងនេះលាតសន្ធឹងលើផែនដីច្រើនពេកមិនអាចអានក្នុងលើកតែមួយបានទេ (សំណើក្រឡាផែនទី {n})។ គ្មានអ្វីត្រូវបានផ្ញើឡើយ។';
$ec_lang['lpn_terrain_cancelled']='គ្មានអ្វីត្រូវបានផ្លាស់ប្ដូរទេ ហើយគ្មានអ្វីត្រូវបានផ្ញើឡើយ។';
$ec_lang['lpn_terrain_nofetch']='កម្មវិធីរុករកនេះមិនអាចទាក់ទងសេវាផ្ទៃដីបានទេ។';
$ec_lang['lpn_terrain_working']='កំពុងអានផ្ទៃដី…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='សេវាភូមិសណ្ឋានបានបដិសេធសំណើនេះ ({status}) ដូច្នេះគ្មានកម្ពស់ណាមួយត្រូវបានផ្លាស់ប្ដូរទេ។ សញ្ញាសម្គាល់ Mapbox ដែលគេហទំព័រនេះប្រើ ប្រហែលជាមិនអនុញ្ញាតអាសយដ្ឋានគេហទំព័រដែលអ្នកកំពុងប្រើទេ។';
$ec_lang['lpn_terrain_failed']='យើងមិនអាចទាក់ទងសេវាផ្ទៃដីបានទេ ដូច្នេះគ្មានកម្ពស់ត្រូវបានផ្លាស់ប្ដូរទេ។ អ្នកប្រហែលជាកំពុងគ្មានអ៊ីនធឺណិត។ អ្វីៗផ្សេងទៀតទាំងអស់នៅលើទំព័រនេះដំណើរការដោយគ្មានវា។';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='សេវាភូមិសណ្ឋានកំពុងសុំឲ្យយើងបន្ថយល្បឿន (429) ដូច្នេះគ្មានកម្ពស់ណាមួយត្រូវបានផ្លាស់ប្ដូរទេ។ សូមសាកល្បងម្ដងទៀតក្នុងមួយនាទី។';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='សេវាភូមិសណ្ឋានបានឆ្លើយតបដោយកំហុសមួយ ({status}) ដូច្នេះគ្មានកម្ពស់ណាមួយត្រូវបានផ្លាស់ប្ដូរទេ។ គ្មានអ្វីខុសជាមួយបណ្ដាញរបស់អ្នកទេ។';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='គ្មានថ្នាំងណាមួយក្នុងចំណោមទាំងនោះមានទីតាំងនៅលើផែនដីទេ ដូច្នេះគ្មានអ្វីត្រូវបានផ្ញើ ហើយគ្មានកម្ពស់ណាមួយត្រូវបានផ្លាស់ប្ដូរទេ។ ការអានផ្ទៃដីត្រូវការគម្រោងមួយនៅក្នុងរយៈទទឹង និងបណ្ដោយភូមិសាស្ត្រ ឬមួយនៅលើប្រែក្លាយមួយដែលទំព័រនេះអាចកំណត់ទីតាំងបាន។';
$ec_lang['lpn_terrain_done']='កម្ពស់ {n} ត្រូវបានបំពេញ។';
$ec_lang['lpn_terrain_missed']='{m} មិនអាចអានបានទេ ហើយនៅតែទទេ។';
$ec_lang['lpn_terrain_partial']='ក្រឡាផ្ទៃដី {f} មិនបានឆ្លើយតបទេ។';
$ec_lang['lpn_terrain_will_ids']='ថ្នាំងទាំងនេះនឹងទទួលបានកម្ពស់៖ {ids}';
$ec_lang['lpn_terrain_keep_ids']='ថ្នាំងទាំងនោះគឺ៖ {ids}';
$ec_lang['lpn_terrain_filled_ids']='ថ្នាំងទាំងនេះទទួលបានកម្ពស់៖ {ids}';
$ec_lang['lpn_terrain_blank_ids']='ថ្នាំងទាំងនេះនៅតែគ្មានកម្ពស់៖ {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids} និងមានទៀត {n}';

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
$ec_lang['lpn_ff_menu']='ការវិភាគលំហូរពន្លត់អគ្គីភ័យ…';
$ec_lang['lpn_ff_menu_tip']='ធ្វើតេស្តថ្នាំងម្ដងមួយៗ៖ ថ្នាំងនីមួយៗអាចផ្ដល់បានប៉ុន្មាន ខណៈនៅតែរក្សាសម្ពាធសល់ដែលអ្នកបានកំណត់ ហើយតើការទាញលំហូរដែលត្រូវការនៅទីនោះ ជំរុញឲ្យធាតុផ្សេងទៀតឲ្យលើសពីដែនកំណត់ដែរឬទេ?';
$ec_lang['lpn_ff_title']='ការវិភាគលំហូរពន្លត់អគ្គីភ័យ';
$ec_lang['lpn_ff_intro']='ថ្នាំងនីមួយៗម្ដងមួយៗ ត្រូវបានស្នើសុំឲ្យទាញលំហូរពន្លត់អគ្គីភ័យបន្ថែមលើតម្រូវការដែលវាមានរួចហើយ។ គ្មានអ្វីនៅក្នុងគម្រោងរបស់អ្នកត្រូវបានផ្លាស់ប្ដូរទេ; ការដំណើរការទាំងមូលធ្វើឡើងលើច្បាប់ចម្លងមួយ។';
$ec_lang['lpn_ff_scope']='ថ្នាំងត្រូវធ្វើតេស្ត';
$ec_lang['lpn_ff_scope_tip']='ជ្រើសរើសសំណុំមុននឹងអ្នកដំណើរការ។ ការធ្វើតេស្តថ្នាំងគ្រប់ក្នុងប្រព័ន្ធធំមួយ អាចចំណាយពេលច្រើននាទី។';
$ec_lang['lpn_ff_scope_all']='ថ្នាំងគ្រប់';
$ec_lang['lpn_ff_scope_selected']='តែថ្នាំងដែលបានជ្រើសរើសប៉ុណ្ណោះ';
$ec_lang['lpn_ff_no_junctions']='គម្រោងនេះមិនទាន់មានថ្នាំងនៅឡើយទេ ដូច្នេះគ្មានអ្វីត្រូវធ្វើតេស្តទេ។';
$ec_lang['lpn_ff_no_selection']='គ្មានថ្នាំងណាមួយត្រូវបានជ្រើសរើសទេ។ សូមជ្រើសរើសមួយនៅលើផែនទី ឬធ្វើតេស្តថ្នាំងគ្រប់។';
$ec_lang['lpn_ff_skipped']='ធាតុ {n} ដែលបានជ្រើសរើសមិនមែនជាថ្នាំងទេ ដូច្នេះពួកវាមិនត្រូវបានសាកល្បងទេ។';
$ec_lang['lpn_ff_required']='លំហូរពន្លត់អគ្គីភ័យដែលត្រូវការ';
$ec_lang['lpn_ff_required_tip']='លំហូរដែលក្រម ឬអាជ្ញាធរពន្លត់អគ្គីភ័យរបស់អ្នកតម្រូវនៅចំណុចទឹកអគ្គីភ័យ។ ថ្នាំងនីមួយៗត្រូវបានធ្វើតេស្តធៀបនឹងលេខនេះ លុះត្រាតែវាមានលំហូរពន្លត់អគ្គីភ័យដែលត្រូវការផ្ទាល់ខ្លួនរបស់វា។';
$ec_lang['lpn_ff_required_own']='ថ្នាំងដែលមានលំហូរពន្លត់អគ្គីភ័យដែលត្រូវការផ្ទាល់ខ្លួន ត្រូវបានធ្វើតេស្តធៀបនឹងលេខនោះជំនួសវិញ។ ចំនួនរបស់ពួកវា៖ {n}។';
$ec_lang['lpn_ff_required_node_tip']='លំហូរពន្លត់អគ្គីភ័យដែលត្រូវការនៅថ្នាំងជាក់លាក់នេះ សម្រាប់ការប្រើប្រាស់ដីដែលវាបម្រើ ដកស្រង់ពីក្រម ឬអាជ្ញាធរពន្លត់អគ្គីភ័យរបស់អ្នក។ ទុកវាទទេ ហើយថ្នាំងនេះនឹងត្រូវបានធ្វើតេស្តធៀបនឹងលេខនៅក្នុងប្រអប់ ការវិភាគលំហូរពន្លត់អគ្គីភ័យ។';
$ec_lang['lpn_ff_residual']='សម្ពាធសល់ត្រូវរក្សា';
$ec_lang['lpn_ff_residual_tip']='សម្ពាធដែលថ្នាំងត្រូវតែនៅតែរក្សា ខណៈកំពុងផ្ដល់លំហូរពន្លត់អគ្គីភ័យ។ AWWA M31 និង NFPA 291 ប្រើ 20 psi (140 kPa)។';
$ec_lang['lpn_ff_design']='ត្រួតពិនិត្យការរចនា (ផលប៉ះពាល់លើប្រព័ន្ធ)';
$ec_lang['lpn_ff_design_tip']='ជាសំណួរដាច់ដោយឡែកពីថាតើថ្នាំងអាចផ្ដល់លំហូរបានឬអត់៖ ជាមួយលំហូរនោះត្រូវបានទាញនៅទីនោះ តើមានធាតុផ្សេងទៀតធ្លាក់ក្រោមសម្ពាធអប្បបរមារបស់វា ឬលើសដែនកំណត់ល្បឿនរបស់វាដែរឬទេ? ការជ្រើសរើសត្រួតពិនិត្យវាមិនចំណាយការគណនាបន្ថែមទេ។';
$ec_lang['lpn_ff_design_off']='កុំត្រួតពិនិត្យ';
$ec_lang['lpn_ff_design_all']='ថ្នាំងផ្សេងទៀតទាំងអស់ និងបំពង់ទាំងអស់';


$ec_lang['lpn_ff_minpressure']='សម្ពាធទាបបំផុតដែលអនុញ្ញាតនៅកន្លែងផ្សេង';
$ec_lang['lpn_ff_minpressure_tip']='ថ្នាំងមួយដែលធ្លាក់ក្រោមកម្រិតនេះ ខណៈមួយទៀតកំពុងទាញលំហូរពន្លត់អគ្គីភ័យរបស់វា ត្រូវបានរាយការណ៍ជាបញ្ហារចនា។';
$ec_lang['lpn_ff_maxvelocity']='ល្បឿនខ្ពស់បំផុតដែលអនុញ្ញាត';
$ec_lang['lpn_ff_maxvelocity_tip']='បំពង់មួយដែលរត់លើសកម្រិតនេះ ខណៈលំហូរពន្លត់អគ្គីភ័យកំពុងត្រូវបានទាញ ត្រូវបានរាយការណ៍ជាបញ្ហារចនា។';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='លំហូរពន្លត់អគ្គីភ័យត្រូវបានទាញនៅថ្នាំងខ្លួនឯង។ នោះជាវិធីសាស្ត្រដែលប្រើនៅទីនេះ ហើយវាជាវិធីធម្មតា។ ចំណុចទឹកអគ្គីភ័យ បំពង់ចំហៀងរបស់វា និងក្បាលច្រាំងរបស់វា មិនត្រូវបានធ្វើគំរូទេ ដូច្នេះចំណុចទឹកអគ្គីភ័យពិតប្រាកដផ្ដល់លំហូរតិចជាងលេខដែលបានបង្ហាញនៅទីនេះ។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='នេះត្រូវបានគណនាដោយប្រើឧបករណ៍ដោះស្រាយខាងក្នុង។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='នេះត្រូវបានគណនាដោយប្រើឧបករណ៍ដោះស្រាយ EPANET។';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='លំហូរពន្លត់អគ្គីភ័យដែលអាចមាន គឺជាការស្វែងរកមួយ ដូច្នេះបណ្ដាញទាំងមូលត្រូវបានដោះស្រាយប្រហែលដប់ប្រាំមួយដងសម្រាប់ថ្នាំងនីមួយៗដែលបានធ្វើតេស្ត។ ប្រព័ន្ធធំមួយចំណាយពេលច្រើននាទី។ អ្នកអាចបញ្ឈប់វានៅពេលណាក៏បាន ហើយរក្សាទុកអ្វីដែលបានគណនារួច។';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='មានតែជំហានពេលវេលាដែលកំពុងបង្ហាញលើអេក្រង់ឥឡូវនេះប៉ុណ្ណោះដែលត្រូវបានធ្វើតេស្ត។ លំហូរពន្លត់អគ្គីភ័យតាមធម្មតាត្រូវបានធ្វើតេស្តបន្ថែមលើតម្រូវការថ្ងៃអតិបរមា ដូច្នេះកំណត់បណ្ដាញទៅតាមស្ថានភាពនោះមុននឹងអ្នកដំណើរការ។';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='ការដំណើរការលំហូរពន្លត់អគ្គីភ័យ';
$ec_lang['lpn_ff_calculate']='ដំណើរការ';
$ec_lang['lpn_ff_stop']='បញ្ឈប់';
$ec_lang['lpn_ff_working']='កំពុងធ្វើការ៖ {done} នៃ {total} ថ្នាំង។';
$ec_lang['lpn_ff_stopped']='បានបញ្ឈប់បន្ទាប់ពី {done} នៃ {total} ថ្នាំង។ លទ្ធផលខាងក្រោមគឺជាលទ្ធផលដែលបានបញ្ចប់រួច។';
$ec_lang['lpn_ff_cost']='ការដំណើរការនេះបានដោះស្រាយបណ្ដាញទាំងមូល {solves} ដង។';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='គំនូរបានផ្លាស់ប្ដូរ ដូច្នេះលទ្ធផលលំហូរពន្លត់អគ្គីភ័យត្រូវបានលុបចោល។ សូមដំណើរការវាម្ដងទៀត។';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='សម្អាតរង្វង់';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} ថ្នាំងគ្មានបញ្ហាអ្វីទេ។ {fire} ថ្នាំងបរាជ័យក្នុងលំហូរពន្លត់អគ្គីភ័យ។ {design} ថ្នាំងប៉ះពាល់ដល់ផ្នែកផ្សេងទៀតរបស់ប្រព័ន្ធ។';
$ec_lang['lpn_ff_summary_error']='{n} ថ្នាំងមិនអាចមានចម្លើយបានទេ។';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='ថ្នាំងគ្រប់ដែលបានធ្វើតេស្ត';
$ec_lang['lpn_ff_col_junction']='ថ្នាំង';
$ec_lang['lpn_ff_col_static']='សម្ពាធថេរ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='សម្ពាធនៅថ្នាំងនេះមុនពេលលំហូរពន្លត់អគ្គីភ័យណាមួយត្រូវបានទាញយក ខណៈតម្រូវការធម្មតារបស់ប្រព័ន្ធនៅតែដំណើរការ។ គ្មានអ្វីត្រូវបានបិទដើម្បីវាស់វាទេ ដូច្នេះនេះមិនមែនជាសម្ពាធលំហូរសូន្យសម្រាប់ប្រព័ន្ធទេ វាជាសម្ពាធដូចគ្នានឹងអ្វីដែលផែនទីបង្ហាញនៅថ្នាំងនេះ។ AWWA M31 និង NFPA 291 ទាំងពីរហៅការអានតម្លៃនេះថាសម្ពាធថេរ ហើយវាជាកន្លែងដែលការធ្វើតេស្តលំហូរពន្លត់អគ្គីភ័យចាប់ផ្ដើម។';
$ec_lang['lpn_ff_col_available']='លំហូរដែលអាចមាន';
$ec_lang['lpn_ff_col_required']='លំហូរដែលត្រូវការ';
$ec_lang['lpn_ff_col_residual']='សម្ពាធសល់ដែលបានរក្សា';
$ec_lang['lpn_ff_col_atrequired']='សម្ពាធនៅលំហូរដែលត្រូវការ';
$ec_lang['lpn_ff_col_affected']='ផលប៉ះពាល់អាក្រក់បំផុត';
$ec_lang['lpn_ff_col_limit']='ដែនកំណត់រចនា';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='មិនបានត្រួតពិនិត្យ';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='សម្ពាធថេរបរាជ័យ ដូច្នេះមិនបានត្រួតពិនិត្យ';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='របៀបបរាជ័យ';
$ec_lang['lpn_ff_mode_fire']='អគ្គីភ័យ';
$ec_lang['lpn_ff_mode_design']='រចនា';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='គ្មាន';
$ec_lang['lpn_ff_col_solves']='ការដំណើរការ';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_pressure']='សម្ពាធ';
$ec_lang['lpn_ff_limit_velocity']='ល្បឿន';
$ec_lang['lpn_ff_limit_both']='សម្ពាធ និងល្បឿន';
$ec_lang['lpn_ff_atleast']='ច្រើនជាង {flow}';
$ec_lang['lpn_ff_affect_node']='{id} ធ្លាក់ចុះដល់ {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} ឈានដល់ {velocity}';
$ec_lang['lpn_ff_more']='និងមានទៀត {n} ត្រូវបានប៉ះពាល់';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='ថ្នាំងបន្ថែម {n} មិនត្រូវបានបង្ហាញទេ។';
$ec_lang['lpn_ff_design_none']='គ្មានធាតុណាមួយក្នុងសំណុំដែលបានជ្រើសរើសលើសដែនកំណត់របស់វា ខណៈថ្នាំងណាមួយកំពុងទាញលំហូរពន្លត់អគ្គីភ័យរបស់វានោះទេ។';
$ec_lang['lpn_ff_design_off_note']='ផលប៉ះពាល់ទៅលើផ្នែកផ្សេងទៀតរបស់ប្រព័ន្ធ មិនត្រូវបានត្រួតពិនិត្យក្នុងការដំណើរការនេះទេ។';
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
$ec_lang['lpn_ff_iso']='ការិយាល័យសេវាធានារ៉ាប់រង (ISO) ផ្ដល់ចំណុចទឹកអគ្គីភ័យតែមួយនូវកម្រិតកិត្តិយសយ៉ាងច្រើនបំផុត {flow}។ កម្រិតកិត្តិយសនោះមិនត្រូវបានអនុវត្តនៅទីនេះទេ ព្រោះយើងមិនដឹងថាថ្នាំងមួយអាចតំណាងឲ្យចំណុចទឹកអគ្គីភ័យប៉ុន្មានទេ។';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='ធ្លាក់ក្រោមសម្ពាធសល់រួចហើយ មុននឹងលំហូរពន្លត់អគ្គីភ័យណាមួយត្រូវបានទាញ';
$ec_lang['lpn_ff_err_converge']='បណ្ដាញមិនប្រសព្វគ្នាទេ។';
$ec_lang['lpn_ff_err_solve']='ឧបករណ៍ដោះស្រាយបានរាយការណ៍កំហុសមួយ ហើយមិនបានផ្ដល់ចម្លើយទេ។';
$ec_lang['lpn_ff_err_not_junction']='មិនមែនជាថ្នាំង';
$ec_lang['lpn_ff_err_unknown']='គ្មានចម្លើយទេ។ កូដដែលបានរាយការណ៍គឺ {code}។';

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
$ec_lang['lpn_file_import_survey']='នាំចូលចំណុចស្ទង់…';
$ec_lang['lpn_file_import_survey_tip']='អានបញ្ជីចំណុចស្ទង់ពីឯកសារអត្ថបទមួយ ហើយបង្កើតថ្នាំងមួយនៅចំណុចនីមួយៗ ដោយយកការកំណត់ធាតុថ្មីសម្រាប់អ្វីៗដែលឯកសារមិនបានចែង។ គ្មានបំពង់ត្រូវបានគូរទេ ហើយគ្មានជួរដេកណាមួយត្រូវបានបោះបង់ដោយមិនប្រាប់ឈ្មោះទេ។ វាអានប្រព័ន្ធកូអរដោនេដែលគម្រោងនេះកំពុងប្រើរួចហើយ ទោះជាបានតម្រៀបភូមិសាស្ត្រ ឬអត់ក៏ដោយ។';
$ec_lang['lpn_survey_read_error']='ឯកសារនោះមិនអាចអានពីថាសរបស់អ្នកបានទេ។';
$ec_lang['lpn_survey_cancelled']='គ្មានអ្វីត្រូវបានបង្កើត ហើយគ្មានអ្វីត្រូវបានផ្លាស់ប្ដូរទេ។';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='ទិសខាងជើង';
$ec_lang['lpn_survey_axis_east']='ទិសខាងកើត';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='ឯកសារនោះគ្មានអ្វីនៅក្នុងវាទេ។';
$ec_lang['lpn_survey_err_unreadable']='ឯកសារនោះមិនអាចអានជាបញ្ជីចំណុចស្ទង់បានទេ។';
$ec_lang['lpn_survey_err_ambiguous_coord']='ជួរឈរច្រើនជាងមួយនៅក្នុងឯកសារនោះអាចជា {axis} ({detail}) ហើយទំព័រនេះនឹងមិនជ្រើសរើសរវាងពួកវាទេ។ ទុកមួយក្នុងចំណោមពួកវាឲ្យមានឈ្មោះថា {axis} រួចសាកល្បងម្ដងទៀត។';
$ec_lang['lpn_survey_err_no_points']='គ្មានជួរដេកណាមួយសោះនៃឯកសារនោះអាចអានជាចំណុចស្ទង់បានទេ។ ជួរដេកដែលបានអាន៖ {detail}';
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
$ec_lang['lpn_survey_format_label']='ទ្រង់ទ្រាយឯកសារ៖';
$ec_lang['lpn_survey_format_internal']='បានបញ្ជាក់ខាងក្នុង';
$ec_lang['lpn_survey_create']='បង្កើតថ្នាំង';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='បន្ទាត់ដំបូងត្រូវបានរំលង៖ វាមិនប្រាប់ឈ្មោះជួរឈរណាមួយដែលទំព័រនេះស្គាល់ទេ។';
$ec_lang['lpn_survey_type_label']='ប្រភេទធាតុ៖';
$ec_lang['lpn_survey_confirm_junction']='រកឃើញថ្នាំង {n}។ បន្តទេ?';
$ec_lang['lpn_survey_confirm_reservoir']='រកឃើញអាងស្តុក {n}។ បន្តទេ?';
$ec_lang['lpn_survey_confirm_tank']='រកឃើញធុងទឹក {n}។ បន្តទេ?';
$ec_lang['lpn_survey_report_junction']='បាននាំចូលថ្នាំង {n} ក្នុងនោះ {m} មានកម្ពស់។';
$ec_lang['lpn_survey_report_reservoir']='បាននាំចូលអាងស្តុក {n} ក្នុងនោះ {m} មានកម្ពស់។';
$ec_lang['lpn_survey_report_tank']='បាននាំចូលធុងទឹក {n} ក្នុងនោះ {m} មានកម្ពស់។';
$ec_lang['lpn_survey_report_clean']='ចំណុចគ្រប់ចំណុចនៅក្នុងឯកសារបានចូលមក ហើយគ្មានអ្វីត្រូវបានផ្លាស់ប្ដូរនៅពេលចូលមកនោះទេ។';
$ec_lang['lpn_survey_report_notes']='កំហុស និងចំណាំនៃការនាំចូល៖';
$ec_lang['lpn_survey_sev_error']='កំហុស';
$ec_lang['lpn_survey_sev_warning']='ការព្រមាន';
$ec_lang['lpn_survey_note_line']='បន្ទាត់ {line}៖ {sev}៖ {code}៖ {text}';
$ec_lang['lpn_survey_note_row_short']='ជួរឈរតិចពេកសម្រាប់ទ្រង់ទ្រាយឯកសារខាងលើ។';
$ec_lang['lpn_survey_note_coord_missing']='ក្រឡា {axis} ទទេ។';
$ec_lang['lpn_survey_note_bad_coord']='{axis} មិនអានជាលេខទេ។';
$ec_lang['lpn_survey_note_coord_range']='{axis} នៅក្រៅដែនកំណត់ដែលគម្រោងនេះអនុញ្ញាត។';
$ec_lang['lpn_survey_note_bad_elev']='កម្ពស់មិនមែនជាលេខ។ បាននាំចូលដោយគ្មានកម្ពស់។';
$ec_lang['lpn_survey_note_ambiguous_elev']='ជួរឈរច្រើនជាងមួយអាចជាកម្ពស់ ដូច្នេះគ្មានមួយណាត្រូវបានអានទេ។';
$ec_lang['lpn_survey_note_blank_rows']='បន្ទាត់ទទេត្រូវបានរំលង៖ {detail}។';
$ec_lang['lpn_survey_note_id_duplicate']='ឈ្មោះត្រូវបានប្រើពីមុននៅក្នុងឯកសារនេះរួចហើយ ឈ្មោះថ្មីមួយត្រូវបានផ្ដល់ជូន។';
$ec_lang['lpn_survey_note_id_taken']='ឈ្មោះមាននៅក្នុងគម្រោងរួចហើយ ឈ្មោះថ្មីមួយត្រូវបានផ្ដល់ជូន។';
$ec_lang['lpn_survey_note_id_invalid']='ឈ្មោះនេះមិនអាចប្រើនៅទីនេះបានទេ ឈ្មោះថ្មីមួយត្រូវបានផ្ដល់ជូន។';
