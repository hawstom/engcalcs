<?php

// All missing text declarations will fall back to English.

// Units (alphabetical order)
// Necessary for calculator units selectors
$ec_lang['u_depthFrac']="fraction";
$ec_lang['u_depthPercent']="%";
$ec_lang['u_ft2']="ft^2";
$ec_lang['u_ft3ps']="cfs";
$ec_lang['u_fth2o']="ft H2O";
$ec_lang['u_ftps']="ft/sec";
$ec_lang['u_ft']="英尺";
$ec_lang['u_gpm']="gpm";
$ec_lang['u_gradePercent']='% rise/run';
$ec_lang['u_grade']="rise/run";
$ec_lang['u_in2']="sq. in.";
$ec_lang['u_inh2o']="in H2O";
$ec_lang['u_in']="英吋s";
$ec_lang['u_kpa']="kPa";
$ec_lang['u_lps']="l/s";
$ec_lang['u_m2']="m^2";
$ec_lang['u_m3ps']="m^3/s";
$ec_lang['u_mgd']="MGD";
$ec_lang['u_mh2o']="m H2O";
$ec_lang['u_mm2']="mm^2";
$ec_lang['u_mmh2o']="mm H2O";
$ec_lang['u_mm']="釐米";
$ec_lang['u_mps']="m/s";
$ec_lang['u_m']="米";
$ec_lang['u_npm2']="N/m^2";
$ec_lang['u_pa']="Pa";
$ec_lang['u_psf']="psf";
$ec_lang['u_psi']="psi";
$ec_lang['u_s']="sec";

// Page text
// In page order for easiest maintenance.
$ec_lang['menu_main_list']='計算器清單';
$ec_lang['menu_main_hydraulics']='水力學';
$ec_lang['menu_main_language']='語言';
$ec_lang['template_translation_help']="Can you help me translate this calculator to your language or host this calculator at your web site?  ";
$ec_lang['template_feedback']='請給我們有價值的建議或嘉許的話。此免費的計算器，是否在每個方面都超出您的預期？';
$ec_lang['index_title']='Free Online Engineering Calculators';
$ec_lang['mpf_main_menu']='曼寧管流';
$ec_lang['mpf_main_title']='免費線上曼寧管流計算器';
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
$ec_lang['mpf_shear_stress']='Average 剪應力(牽引力), tau';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='曼寧管道壓頭損失';
$ec_lang['mphl_main_title']='曼寧粗造度係數, n?';
$ec_lang['mphl_main_desc']='在特定斜率  和深度的均勻梯形流動曼寧公式';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='曼寧公式梯形渠道';
$ec_lang['mtc_main_title']='Free Online Manning Formula Trapezoidal Channel Calculator';
$ec_lang['mtc_main_desc']='在特定斜率  和深度的均勻梯形流動曼寧公式';
// Weir Flow Simple\n// Weir Flow Simple
$ec_lang['ws_main_menu']='簡單的水堰流動';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='不規則的水堰流動';
// Orifice Flow
$ec_lang['or_main_menu']='孔口流量';
$ec_lang['or_main_title']='孔口流量在线计算器（免费）';
$ec_lang['or_main_desc']='孔口流量 — 自由出流或淹没出流';
$ec_lang['or_shape']='孔口形状';
$ec_lang['or_shape_circular']='圆形';
$ec_lang['or_shape_rectangular']='矩形';
$ec_lang['or_diameter']='直径（圆形）或高度（矩形），D';
$ec_lang['or_width']='宽度，W（仅限矩形）';
$ec_lang['or_invert']='孔口底部高程';
$ec_lang['or_hwe']='上游水位高程';
$ec_lang['or_twe']='下游水位高程';
$ec_lang['or_cd']='流量系数，C<sub>d</sub>';
$ec_lang['or_centroid_elev']='形心高程';
$ec_lang['or_head']='有效水头，h';
$ec_lang['or_area']='孔口面积，A';
$ec_lang['or_flow']='流量，Q';
$ec_lang['or_regime']='孔口流态检验';
$ec_lang['or_regime_valid']='自由出流 — 孔口流态有效 ✓';
$ec_lang['or_regime_submerged']='淹没孔口（下游水位高于孔底）— 有效 ✓';
$ec_lang['or_regime_warn']='警告：上游水位低于孔顶 — 非孔口流态';
$ec_lang['or_regime_twe_above_hwe']='Warning: tailwater (TWE) above headwater (HWE) — check inputs';
$ec_lang['or_notes_1_term']='孔口方程';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> &times; A &times; &radic;(2gh)。自由出流：h = HWE &minus; 形心高程。淹没出流（下游水位高于孔底）：h = HWE &minus; TWE。';
$ec_lang['or_notes_2_term']='孔口流态';
$ec_lang['or_notes_2_def']='当上游水位高于孔口顶部时，适用孔口流量方程。当上游水位低于孔顶时，请改用堰流方程。';
$ec_lang['or_notes_3_term']='流量系数';
$ec_lang['or_notes_3_def']='锐缘孔口的 C<sub>d</sub> 约为 0.60&ndash;0.65。圆角或内缩入口的值不同。请参考 <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venture-d_590.html">Engineering Toolbox</a> 或 HEC-RAS 水力学参考手册。';
$ec_lang['or_notes_4_term']='淹没';
$ec_lang['or_notes_4_def']='当下游水位高于孔口底部时，计算器自动采用淹没孔口方程，h = HWE &minus; TWE。当下游水位等于或低于孔底时，采用自由出流假定，h = HWE &minus; 形心高程。';

// Orifice Drain Time
$ec_lang['odt_main_menu']="Orifice Drain Time";
$ec_lang['odt_main_title']="Free Online Orifice Drain Time Calculator";
$ec_lang['odt_main_desc']="Pond Orifice Drain Time &mdash; Conic Volume Method";
$ec_lang['odt_h1_elev']="Starting water surface elevation";
$ec_lang['odt_a1']="Full pond area, A1";
$ec_lang['odt_h2_elev']="Ending water surface elevation";
$ec_lang['odt_h_orifice']='Orifice centroid elevation';
$ec_lang['odt_a0']='Pond area at orifice elevation, A0';
$ec_lang['odt_a_ending']='Ending pond area, A2 (interpolated)';
$ec_lang['odt_d']="Orifice diameter (circular) or height (rectangular), D";
$ec_lang['odt_w']="Orifice width, W (rectangular only)";
$ec_lang['odt_t_sec']="Drain time (seconds)";
$ec_lang['odt_t_min']="Drain time (minutes)";
$ec_lang['odt_t_hr']="Drain time (hours)";
$ec_lang['odt_t_day']="Drain time (days)";
$ec_lang['odt_notes_1_term']="Formula";
$ec_lang['odt_notes_1_def']='t = &radic;H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> &radic;(2g)) &times; (2A<sub>x</sub>/5 + 8&radic;(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) gives drain time from head H to the orifice. Drain time = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) &minus; t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), where H<sub>1</sub> = starting elevation &minus; orifice elevation, H<sub>2</sub> = ending elevation &minus; orifice elevation.';
$ec_lang['odt_notes_2_term']="Method";
$ec_lang['odt_notes_2_def']='The conic volume method models the pond as a conic section between the starting area A<sub>1</sub> at the initial water surface and the area A<sub>0</sub> at the orifice centroid elevation. A<sub>2</sub>, the pond area at the ending elevation, is interpolated from A<sub>1</sub> and A<sub>0</sub> using the conic section model. Drain time from starting to ending elevation equals total drain time from H<sub>1</sub> to orifice minus remaining drain time from H<sub>2</sub> to orifice.';
