<?php

// All missing text declarations will fall back to English.

// Base words
// Do not use. Type entire page text phrase below.
$ec_lang['and']="and";
$ec_lang['area']="area";
$ec_lang['bottom']="bottom";
$ec_lang['calculate']="calculate";
$ec_lang['calculator']="calculator";
$ec_lang['calculators']="$ec_lang[calculator]s";
$ec_lang['channel']="channel";
$ec_lang['coefficient']="coefficient";
$ec_lang['contents']="contents";
$ec_lang['crest']="crest";
$ec_lang['cumulative']="cumulative";
$ec_lang['depth']="depth";
$ec_lang['diameter']="diameter";
$ec_lang['engineering']="engineering";
$ec_lang['engineers']="engineers";
$ec_lang['feet']="feet";
$ec_lang['flow']="flow";
$ec_lang['formula']="formula";
$ec_lang['full']="full";
$ec_lang['freeOnline']="free online";
$ec_lang['given']="given";
$ec_lang['head']="head";
$ec_lang['headwater']="headwater";
$ec_lang['height']="height";
$ec_lang['horizontal']="horizontal";
$ec_lang['hydraulic']="hydraulic";
$ec_lang['hydraulics']="hydraulics";
$ec_lang['incremental']="incremental";
$ec_lang['irregular']="irregular";
$ec_lang['length']="length";
$ec_lang['loss']="loss";
$ec_lang['manning']="Manning";
$ec_lang['measurement']="measurements";
$ec_lang['of']="of";
$ec_lang['or']="or";
$ec_lang['pipe']="pipe";
$ec_lang['points']="points";
$ec_lang['ponding']="ponding";
$ec_lang['pressure']="pressure";
$ec_lang['radius']="radius";
$ec_lang['ratio']="ratio";
$ec_lang['results']="results";
$ec_lang['roughness']="roughness";
$ec_lang['save']="save";
$ec_lang['side']="side";
$ec_lang['slope']="slope";
$ec_lang['system']="system";
$ec_lang['to']="to";
$ec_lang['trapezoidal']="trapezoidal";
$ec_lang['uniform']="uniform";
$ec_lang['variable']="variable";
$ec_lang['velocity']="velocity";
$ec_lang['vertical']="vertical";
$ec_lang['weir']="weir";
$ec_lang['wettedperimeter']="wetted perimeter";
$ec_lang['width']="width";

// Units
// Necessary for calculator units selectors
$ec_lang['u_ft']="英尺";
$ec_lang['u_ft2']="ft^2";
$ec_lang['u_ftps']="ft/sec";
$ec_lang['u_ft3ps']="cfs";
$ec_lang['u_gpm']="gpm";
$ec_lang['u_in']="英吋s";
$ec_lang['u_in2']="sq. in.";
$ec_lang['u_lps']="l/s";
$ec_lang['u_m']="米";
$ec_lang['u_m2']="m^2";
$ec_lang['u_mgd']="MGD";
$ec_lang['u_mps']="m/s";
$ec_lang['u_m3ph']="m^3/hr";
$ec_lang['u_m3ps']="m^3/s";
$ec_lang['u_mm']="釐米";
$ec_lang['u_mm2']="mm^2";
$ec_lang['u_mph']="miles/hr";
$ec_lang['u_npm2']="N/m^2";
$ec_lang['u_pa']="Pa";
$ec_lang['u_kpa']="kPa";
$ec_lang['u_mh2o']="m H2O";
$ec_lang['u_mmh2o']="mm H2O";
$ec_lang['u_psf']="psf";
$ec_lang['u_psi']="psi";
$ec_lang['u_fth2o']="ft H2O";
$ec_lang['u_inh2o']="in H2O";
$ec_lang['u_s']="sec";
$ec_lang['u_grade']="rise/run";
$ec_lang['u_gradePercent']='% rise/run';
$ec_lang['u_depthFrac']="fraction";
$ec_lang['u_depthPercent']="%";

// Symbols
// Do not use. Type entire page text phrase below.
$ec_lang['s_d']="d";
$ec_lang['s_d0']="$ec_lang[s_d]<sub>0</sub>";
$ec_lang['s_hv']="h<sub>v</sub>";
$ec_lang['s_n']="n";
$ec_lang['s_q']="q";
$ec_lang['s_v']="v";

// Combined words
// Do not use. Type entire page text phrase below.
$ec_lang['bottomWidth']="$ec_lang[bottom] $ec_lang[width]";
$ec_lang['channelSlope']="$ec_lang[channel] $ec_lang[slope]";
$ec_lang['flowCalculator']="$ec_lang[flow] $ec_lang[calculator]";
$ec_lang['flowDepth']="$ec_lang[flow] $ec_lang[depth]";
$ec_lang['frictionLoss']="Friction loss";
$ec_lang['junctionLoss']="Junction loss";
$ec_lang['totalLoss']="totalLoss";
$ec_lang['manningFormula']="$ec_lang[manning] $ec_lang[formula]";
$ec_lang['sideSlope1']="$ec_lang[side] $ec_lang[slope] 1 (horiz./vert.)";
$ec_lang['sideSlope2']="$ec_lang[side] $ec_lang[slope] 2 (horiz./vert.)";

// Page text
// Note: In the process of rearranging the language variables into page order for easier maintenance.
$ec_lang['menu_main_list']='計算器清單';
$ec_lang['menu_main_hydraulics']='水力學';
$ec_lang['menu_main_language']='語言';
$ec_lang['menu_sub1_manning']='曼寧公式»';
$ec_lang['template_translation_help']="Can you help me translate this calculator to your language or host this calculator at your web site?  ";
$ec_lang['template_feedback']='請給我們有價值的建議或嘉許的話。此免費的計算器，是否在每個方面都超出您的預期？';
$ec_lang['index_title']=ec_title("$ec_lang[freeOnline] $ec_lang[engineering] $ec_lang[calculators]");
$ec_lang['mpf_main_menu']='曼寧管流';
$ec_lang['mpf_main_title']=ec_title("免費線上曼寧管流計算器");
$ec_lang['mpf_main_desc']='在特定斜率和深度均勻管流  的曼寧公式';
$ec_lang['calc_set_units']='單位設定';
$ec_lang['calc_results']='結果:';
// Manning Pipe Flow
$ec_lang['mpf_pipe_diameter']='管徑,d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='曼寧粗造度係數, n?';
$ec_lang['mpf_friction_slope']=' 壓力斜率（是否可能等於管道坡度 <a target="_blank"
href="../pressureslope.php">?</a>), S<sub>0</sub>';
$ec_lang['mpf_depth_ratio']='全深百分比（或比例）（如果全

深流動 100％或 1）';
$ec_lang['mpf_flow']='流量,q';
$ec_lang['mpf_velocity']='流速, v';
$ec_lang['mpf_velocity_head']='速度壓頭, hv';
$ec_lang['mpf_flow_area']='流動面積';
$ec_lang['mpf_wetted_perimeter']='濕周';
$ec_lang['mpf_hydraulic_radius']='水力半徑';
$ec_lang['mpf_top_width']='頂部寬度, T';
$ec_lang['mpf_froude_number']='Froude 數, F';
$ec_lang['mpf_shear_stress']='剪應力(牽引力), tau';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='曼寧管道壓頭損失';
$ec_lang['mphl_main_title']='曼寧粗造度係數, n?';
$ec_lang['mphl_main_desc']='在特定斜率  和深度的均勻梯形流動曼寧公式';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='曼寧公式梯形渠道';
$ec_lang['mtc_main_title']=ec_title("$ec_lang[freeOnline] $ec_lang[mtc_menu] $ec_lang[calculator]");
$ec_lang['mtc_main_desc']='在特定斜率  和深度的均勻梯形流動曼寧公式';
// Weir Flow Simple\n// Weir Flow Simple
$ec_lang['ws_main_menu']='簡單的水堰流動';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='不規則的水堰流動';
d1<sup>2.5</sup>) where d1 and d0 are always positive or zero';
