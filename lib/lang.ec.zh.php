<?php

// 简体中文 — All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='比例';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='平方英尺';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='英尺';
$ec_lang['u_fth2o']='英尺水柱';
$ec_lang['u_ftps']='英尺/秒';
$ec_lang['u_gpm']='加仑/分钟';
$ec_lang['u_gradePercent']='% 坡度';
$ec_lang['u_grade']='坡度';
$ec_lang['u_in2']='平方英寸';
$ec_lang['u_inh2o']='英寸水柱';
$ec_lang['u_in']='英寸';
$ec_lang['u_knpcm2']='千牛/厘米^2';
$ec_lang['u_knpm2']='千牛/米^2';
$ec_lang['u_kpa']='千帕';
$ec_lang['u_lps']='升/秒';
$ec_lang['u_m2']='米^2';
$ec_lang['u_m3ps']='米^3/秒';
$ec_lang['u_mgd']='百万加仑/天';
$ec_lang['u_imgd']='英制百万加仑/天';
$ec_lang['u_afd']='英亩英尺/天';
$ec_lang['u_lpm']='升/分钟';
$ec_lang['u_cmh']='米^3/小时';
$ec_lang['u_cmd']='米^3/天';
$ec_lang['u_mh2o']='米水柱';
$ec_lang['u_mld']='百万升/天';
$ec_lang['u_m']='米';
$ec_lang['u_mm2']='毫米^2';
$ec_lang['u_mmh2o']='毫米水柱';
$ec_lang['u_mm']='毫米';
$ec_lang['u_mps']='米/秒';
$ec_lang['u_npm2']='牛/米^2';
$ec_lang['u_pa']='帕';
$ec_lang['u_psf']='磅/英尺^2';
$ec_lang['u_psi']='磅/英寸^2';
$ec_lang['u_bar']='巴';
$ec_lang['u_kgfcm2']='千克力/厘米^2';
$ec_lang['u_s']='秒';
$ec_lang['u_hr']='小时';
$ec_lang['u_day']='天';
$ec_lang['u_lph']='L/hr';
$ec_lang['u_gph']='gal/hr';
$ec_lang['u_mmph']='mm/hr';
$ec_lang['u_inph']='in/hr';
$ec_lang['u_acft']='英亩-英尺';
$ec_lang['u_ft3']='英尺^3';
$ec_lang['u_m3']='米^3';
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
$ec_lang['menu_brand']='HawsEDC 计算器';
$ec_lang['menu_main_hydraulics']='水力学';
$ec_lang['menu_help']='帮助';
$ec_lang['menu_libre']='自由软件';
$ec_lang['template_welcome']='把恐惧留在门外；这里说爱的语言。你没有毁掉一切。同时享用免费的 <a target="_blank" href="https://hawsedc.com/download.php">HawsEDC AutoCAD 工具。</a>';
$ec_lang['template_feedback']='您能否为本页面的措辞提出更好的建议，或者还有别的想法？您想帮忙，还是想学习制作这样的工具？欢迎与我联系。';
$ec_lang['template_printable_title']='可打印标题';
$ec_lang['template_printable_subtitle']='可打印副标题';
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
$ec_lang['consent_body']='是否允许我们在此浏览器保存一个一位数的 cookie，用于记住本页面已被计数？它不会记录关于您的任何信息，也不会记录您输入的任何内容。如果没有它，我们将无法区分您的第二次访问和另一个人的第一次访问。';
$ec_lang['consent_accept']='同意本次';
$ec_lang['consent_accept_all']='同意，以后不再询问';
$ec_lang['consent_decline']='拒绝，以后不再询问';
$ec_lang['consent_current_granted']='您已同意。我们据此限制本浏览器的访问记录次数。';
$ec_lang['consent_current_denied']='您已拒绝。我们不保存任何内容，以限制本浏览器的访问记录次数。';
$ec_lang['consent_region_label']='您关于限制访问记录的选择。';
$ec_lang['consent_settings_link']='Cookie 设置';
$ec_lang['privacy_link']='隐私声明';
$ec_lang['terms_link']='使用条款';
$ec_lang['index_main_title']='免费在线工程计算器';
$ec_lang['index_meta_desc_plain']='免费的水力工程计算器，涵盖管道、渠道、堰和灌溉。可在浏览器中直接运行，支持离线使用，并提供27种语言。';
$ec_lang['calc_set_units']='单位设置：';
$ec_lang['calc_set_units_tip']='一次性设置所有字段的单位。此操作不具破坏性：您输入的数字保持不变，只是现在按新单位解读。6 仍然是 6，但现在表示 6 英寸而不是 6 毫米。';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='恢复默认值';
$ec_lang['calc_defaults_confirm']='将计算器重置为原始默认值吗？';
$ec_lang['points_data_note']='（或使用数据区域复制/粘贴）';
$ec_lang['points_data_heading']='计算数据<br />（使用“复制”查看格式）';
$ec_lang['points_data_copy']='复制';
$ec_lang['points_data_paste']='粘贴';
$ec_lang['calc_inputs']='输入';
$ec_lang['calc_results']='结果';
$ec_lang['view_hide_line']='隐藏此行';
$ec_lang['view_printable']='打印版本（刷新页面可恢复）';
$ec_lang['ec_name_label']='保存此计算：';
$ec_lang['ec_name_placeholder']='名称';
$ec_lang['ec_name_tip']='将这些输入值保存到网址中以便书签、历史记录和分享';
$ec_lang['calc_copy_link']='复制链接';
$ec_lang['ec_related_calcs']='相关计算器：';
$ec_lang['calc_copy_link_done']='已复制！';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='达西-韦斯巴赫管道水头损失';
$ec_lang['dw_main_title']='免费在线达西-韦斯巴赫管道水头损失计算器';
$ec_lang['dw_main_desc']='在给定管径、粗糙度和流量条件下的达西-韦斯巴赫管道水头损失';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='管壁的绝对粗糙度高度 e。典型值：钢管（新）0.046 mm，钢管（旧）0.15 mm，HDPE 0.003 mm，PVC/uPVC 0.0015 mm，混凝土 0.3–3 mm。';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="20°C清水的运动粘度约为1×10⁻⁶ m²/s">运动粘度，ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='运动粘度，ν';
$ec_lang['dw_kinematic_viscosity_tip']='20°C清水的运动粘度约为1×10⁻⁶ m²/s';
$ec_lang['dw_reynolds_number']='雷诺数，Re';
$ec_lang['dw_flow_regime']='流态';
$ec_lang['dw_regime_laminar']='层流';
$ec_lang['dw_regime_transitional']='过渡流';
$ec_lang['dw_regime_turbulent']='紊流';
$ec_lang['dw_friction_factor_method']='摩擦系数计算方法';
$ec_lang['dw_friction_factor']='摩擦系数，f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='哈森-威廉管道水头损失';
$ec_lang['hw_main_title']='免费在线哈森-威廉管道水头损失计算器';
$ec_lang['hw_main_desc']='在给定管径、粗糙度和流量条件下的哈森-威廉管道水头损失';
$ec_lang['hw_hgl_1']='下游测压管水头线';
$ec_lang['hw_hgl_2']='上游测压管水头线';
$ec_lang['hw_elev_up']='上游高程';
$ec_lang['hw_pressure_up']='上游压力';
$ec_lang['hw_elev_down']='下游高程';
$ec_lang['hw_pressure_down']='下游压力';
$ec_lang['hw_pressure_check']='压力检查';
$ec_lang['hw_pressure_ok_short']='正压力';
$ec_lang['hw_pressure_neg_short']='负压力';
$ec_lang['hw_pressure_neg']='下游压力低于零。测压管水头线低于管道，管道将无法满流，本结果可能无效。';
$ec_lang['hw_roughness']='哈森-威廉系数，C';
$ec_lang['hw_note_1']='<dl><dt>本计算器不考虑两端之间的管道高程变化。</dt><dd>计算仅使用您输入的上游和下游高程。若地面在两端之间某处高于两端高程，该最高点处的实际压力将低于本计算器报告的任何压力。请针对从上游端到该最高点的管长重新运行本计算器进行检验。</dd><dd>当测压管水头线低于管道时，管内水处于负压状态。此时空气会从水中析出，薄壁管道可能发生塌陷，脏污地下水也可能从接口处被吸入。应使管线各处保持正压，并考虑在每个最高点设置进排气阀。</dd><dt>上游压力是您提供的边界条件。</dt><dd>可从压力表读取，也可根据水箱水位（管道以上的水深）或水泵特性曲线确定。水泵在流量增大时所提供的压力会降低，因此应使用与上方所输入流量相匹配的曲线上的点。</dd><dt>局部水头损失系数需自行累加。</dt><dd>将管线上每个阀门、弯头、三通、水表和进水口的 K 值相加，并输入其总和。可通过该输入项旁的链接查看典型值。在长距离输水干管中，这些损失相对于沿程摩擦损失而言较小，但在较短的站内管道中，它们可能占损失的大部分。</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='曼宁不规则断面明渠';
$ec_lang['mi_main_title']='免费在线曼宁不规则断面明渠计算器';
$ec_lang['mi_main_desc']='不规则断面明渠曼宁均匀流计算器';
$ec_lang['mi_waterSurfaceElevation']='水面高程';
$ec_lang['mi_q_617']='<span class="ec-help" title="综合流量 Q，按 Chow 6-17 公式（等流速法）对各分区采用综合 n 值计算">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='横断面测点';
$ec_lang['mi_groupPoint']='测点';
$ec_lang['mi_groupSegment']='分段';
$ec_lang['mi_groupRegion']='分区';
$ec_lang['mi_station']='桩号';
$ec_lang['mi_elevation']='高程';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>、Q 分区边界（岸坡）';
$ec_lang['mi_tau']='底部切应力 τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='综合<br />n 值';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='综合 n 值';
$ec_lang['mi_notes_1_def']='本计算器遵循 HEC-RAS 参考手册的方法，采用 Chow（1959）第 136 页公式 6-17（而非 6-18）计算各分区的综合 n 值。';


$ec_lang['mi_notes_2_term']='石材护坡';
$ec_lang['mi_notes_2_def']='如需设计护坡石材，请使用曼宁梯形渠道计算器。本计算器更适用于天然断面。';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='曼宁管流';
$ec_lang['mpf_main_title']='免费在线曼宁管流计算器';
$ec_lang['mpf_main_desc']='在给定坡度和水深条件下的曼宁公式均匀管流';
$ec_lang['mpf_pipe_diameter']='管径，d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='曼宁糙率系数，n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">摩擦坡度，S<sub>f</sub></a><span class="ec-help" title="有时等于管道坡度。点击链接查看说明（仅英文）。"><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='相对水深，y/d<sub>0</sub>';
$ec_lang['mpf_flow']='流量，Q';
$ec_lang['mpf_flow_tip']='流量与水深按无限长管道计算。要使该流量进入管道，可能需要更高的上游水深。详情及教学视频见下方注释。';
$ec_lang['mpf_velocity']='流速，v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="以水柱高度表示的动能，v²/2g">流速水头，h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='过水面积，A';
$ec_lang['mpf_pipe_area']='管道断面面积，A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='面积比，A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='湿周，P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='水力半径，R<sub>h</sub>';
$ec_lang['mpf_top_width']='水面宽，T';
$ec_lang['mpf_froude_number']='弗劳德数，Fr';
$ec_lang['mpf_shear_stress']='平均切应力，τ';
$ec_lang['mpf_full_flow']='满流流量，Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='流量比，Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>这是<em>无限长</em>管道内部的流量和水深。</dt><dd>使水流进入管道可能需要明显更高的上游水位。请在水深基础上至少加 1.5 倍流速水头来估算上游水位，或 <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">参见 2 分钟教程</a>，了解使用 <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>（美国联邦公路管理局提供的免费涵洞计算程序）进行标准涵洞水位计算的方法。</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>正在设计生活污水管道？</dt><dd>请参阅 <a target="_blank" href="/sewslope.php">最小污水管道坡度表</a>（适用于4至96英寸（100至2400毫米）管道，以m/m、mm/m和百分比给出），以及 <a target="_blank" href="/peakfact.php">极低流量高峰系数</a>研究报告。两者均仅提供英文版本。</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='请输入正值目标流量 Q。';
$ec_lang['mpf_solver_no_solution']='无解：在 y/d0 = 93.8% 处，Q 已超过管道通流能力（所选单位下 Qmax = {qmax}）。';
$ec_lang['mpf_solve_btn']='求解';
$ec_lang['mpf_solve_for_flow']='对于流量，Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='曼宁管道水头损失';
$ec_lang['mphl_main_title']='免费在线曼宁管道水头损失计算器';
$ec_lang['mphl_main_desc']='在给定满流流量条件下的曼宁公式水头损失';
$ec_lang['mphl_pipe_length']='管道长度，L';
$ec_lang['mphl_area']='面积，A';
$ec_lang['mphl_total_junction_k']='局部损失系数，k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='损失系数，k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='局部水头损失系数 km。这些损失发生在管道连接处、入口、出口、弯头和阀门；英文中习惯称其为"次要"（minor）损失，但这一说法容易造成误导——在较短管路中，局部损失可能等于甚至超过沿程摩擦损失。典型 k 值：尖角进口 0.5，每个 45° 弯头 0.2–0.3，闸阀（全开）0.1，蝶阀 0.2，出口（至水库或大气）1.0。将所有管件系数相加即为总 km。默认值 2.0 假设包含一个入口、一个出口和两个 45° 弯头。';
$ec_lang['mphl_friction_slope']='摩擦坡度';
$ec_lang['mphl_friction_loss']='沿程水头损失，h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='局部水头损失，h<sub>m</sub>';
$ec_lang['mphl_total_loss']='总水头损失，h<sub>L</sub>';
$ec_lang['mphl_egl_1']='下游能量坡降线';
$ec_lang['mphl_egl_2']='上游能量坡降线';
$ec_lang['mphl_hgl_egl_tip']='当管道高于水力坡降线时，此结果可能不成立。';
$ec_lang['mphl_note_1']='<dl><dt>本计算器不模拟两端之间的管道剖面。</dt><dd>若测压管水头线在任一位置低于管顶，本计算结果可能不适用。</dd><dt>对于开口进水口（涵洞）情况，需检验进口控制条件。</dt><dd>1. 上游测压管水头线不得低于上游正常水深处高程（也不得低于管顶！）。</dd><dd>2. 涵洞水位更宜用上游能量坡降线而非测压管水头线表示。</dd><dd>3. <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">参见 2 分钟教程</a>，了解使用 <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>（美国联邦公路管理局提供的免费涵洞计算程序）进行简单标准涵洞水位计算的方法。</dd><dd>4. 本页仅求解出流控制情况：管道满流，由下游条件决定水头。涵洞设计的任务是判断进流控制还是出流控制起控制作用，因此在两者都可能起作用时应使用 HY-8。</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='曼宁梯形渠道';
$ec_lang['mtc_main_title']='免费在线曼宁公式梯形渠道计算器';
$ec_lang['mtc_main_desc']='给定坡度和水深条件下的曼宁公式梯形渠道均匀流计算器';
$ec_lang['mtc_bottom_width']='渠底宽度，b';
$ec_lang['mtc_side_slope_1']='边坡 1，z<sub>1</sub>（水平/垂直）';
$ec_lang['mtc_side_slope_2']='边坡 2，z<sub>2</sub>（水平/垂直）';
$ec_lang['mtc_channel_slope']='渠道坡度，S';
$ec_lang['mtc_flow_depth']='水深，y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">弯道角度，β</a><span class="ec-help" title="用于护坡粒径设计。点击链接查看示意图。"><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="密度与水的比值。碎石典型值 ≈ 2.65。">石材比重，sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='设计石材粒径，D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='设计石材粒径对应的 n 值（Strickler 法）';
$ec_lang['mtc_n_blodgett']='设计石材粒径对应的 n 值（Blodgett 法）';
$ec_lang['mtc_n_bathurst']='设计石材粒径对应的 n 值（Bathurst 法）';
$ec_lang['mtc_n_pi']='设计石材粒径对应的 n 值（Phillips & Ingersoll 法）';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett 法与 Bathurst 法对比';
$ec_lang['mtc_pi_range_check']='P&I 范围检查';
$ec_lang['mtc_pi_ok']='d50 在 P&I 范围内';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 英尺（Phillips & Ingersoll，1998）';
$ec_lang['mtc_pi_out_of_range']='超出范围';
$ec_lang['mtc_pi_tip']='超出该公式所依据的 0.28–0.36 英尺数据范围进行外推，仅供粗略参考，不可作为设计依据';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="依据 Isbash（1936）及美国亚利桑那州马里科帕县（Maricopa County）标准。">渠底所需棱角石材粒径，D<sub>50</sub>（Isbash 与 MC）<span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="依据 Isbash（1936）及美国亚利桑那州马里科帕县（Maricopa County）标准。">边坡 1 所需棱角石材粒径，D<sub>50</sub>（Isbash 与 MC）<span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="依据 Isbash（1936）及美国亚利桑那州马里科帕县（Maricopa County）标准。">边坡 2 所需棱角石材粒径，D<sub>50</sub>（Isbash 与 MC）<span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="依据 Maynord、Ruff 和 Abt（1989）。弯道处按平均流速的 4/3 确定石料粒径，依据美国加利福尼亚州公路局（1970）；Maynord 本人提出的 1.5 倍系数适用于天然河道。">所需棱角石材粒径，D<sub>50</sub>（Maynord、Ruff 和 Abt，1989）<span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='所需棱角石材粒径，D<sub>50</sub>（Searcy，1967）';
$ec_lang['mtc_vel_ok']='流速符合均匀流假设，属合理范围。';
$ec_lang['mtc_vel_low']='流速偏低，存在泥沙淤积风险。';
$ec_lang['mtc_vel_high']='流速偏高，可能不符合实际；请检查渠道衬砌的冲刷、弯道处所需的附加水深，以及扩散段或障碍物处的能量损失。';
$ec_lang['mtc_iteration_tip']='选择糙率计算方法（推荐 Blodgett–Bathurst 法）和石材粒径计算方法（推荐 Isbash 法），即可自动迭代求出满足目标流量的统一石材粒径。完整方法见下方注释；也可直接输入自定义糙率值（点击链接查看指南）并忽略石材粒径，以跳过迭代。';
$ec_lang['mtc_note_1']='<dl><dt>石材粒径与糙率自动迭代设计</dt><dd>选择糙率计算方法（推荐 Blodgett–Bathurst 法）和设计石材粒径方法（推荐 Isbash 法）。调整水深和石材粒径安全系数，以在统一石材粒径下达到目标流量。每次修改输入值时，计算器都会重复以下步骤：1. 由设计石材粒径计算糙率。2. 将所求糙率复制到输入糙率。3. 计算渠道流量和所需石材粒径。4. 调整设计石材粒径。5. 重复上述步骤，直至设计石材粒径的误差极小。</dd><dt>基础计算器（不迭代）</dt><dd>直接输入所需的糙率值，忽略设计石材粒径输入区域。</dd></dl>';
$ec_lang['mtc_note_2_term']='流速校核';
$ec_lang['mtc_note_2_def']='流速过高说明存在较大的高程落差，从而产生了较高的比能。该能量可能在扩散段、弯道或障碍物处迅速耗散。请核实这在现场条件下是否合理。';
$ec_lang['mtc_solver_no_solution']='在当前渠道输入条件下，未找到满足给定流量 Q 的解。';
// Weir Flow Simple
$ec_lang['ws_main_menu']='简单堰流';
$ec_lang['ws_main_title']='免费在线简单宽顶堰流计算器';
$ec_lang['ws_main_desc']='简单宽顶堰流计算器';
$ec_lang['ws_weirLength']='堰长，L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="单位重量水体的能量——以水柱高度表示，而非压力">水头，h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='堰流系数，C<sub>w</sub>';
$ec_lang['ws_notes_heading']='注释';
$ec_lang['ws_notes_we_term']='堰流方程';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='不规则堰流';
$ec_lang['wi_main_title']='免费在线分段变深不规则堰流计算器';
$ec_lang['wi_main_desc']='不规则堰流计算器';
$ec_lang['wi_weirPoints']='堰体测点';
$ec_lang['wi_pondingHeight']='蓄水高度';
$ec_lang['wi_incrementalFlow']='分段流量';
$ec_lang['wi_cumulativeFlow']='累计流量';
$ec_lang['wi_notes_we_def']='q = 若（堰长 = 0）则 0，若（坡度=0）则 cw*堰长*d<sub>0</sub><sup>1.5</sup>，否则 cw/(2.5*坡度) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>)，其中 d<sub>1</sub> 和 d<sub>0</sub> 始终为正值或零';
// Orifice Flow
$ec_lang['or_main_menu']='孔口流量';
$ec_lang['or_main_title']='免费在线孔口流量计算器';
$ec_lang['or_main_desc']='孔口流量 — 自由出流或淹没出流';
$ec_lang['or_shape_circular']='圆形';
$ec_lang['or_shape_rectangular']='矩形';
$ec_lang['or_diameter']='<span class="ec-help" title="圆形取直径；矩形取高度">直径或高度，D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="仅适用于矩形孔口">宽度，W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="孔口底部">底部高程 <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='上游水位高程';
$ec_lang['or_twe']='下游水位高程';
$ec_lang['or_cd']='流量系数，C<sub>d</sub>';
$ec_lang['or_centroid_elev']='形心高程';
$ec_lang['or_head']='<span class="ec-help" title="单位重量水体的能量——以水柱高度表示，而非压力">有效水头，h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='孔口面积，A';
$ec_lang['or_regime']='孔口流态检验';
$ec_lang['or_regime_valid']='自由出流';
$ec_lang['or_regime_submerged']='淹没孔口';
$ec_lang['or_regime_submerged_tip']='下游水位（TWE）高于形心 — 孔口流态仍然有效';
$ec_lang['or_regime_warn']='非孔口流态';
$ec_lang['or_regime_warn_tip']='上游水位低于孔口顶部（孔顶）';
$ec_lang['or_regime_twe_above_hwe']='请检查输入';
$ec_lang['or_regime_twe_above_hwe_tip']='下游水位（TWE）高于上游水位（HWE）';
$ec_lang['or_notes_1_term']='孔口方程';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh)。自由出流：h = HWE − 形心高程。淹没出流（下游水位高于孔底）：h = HWE − TWE。';
$ec_lang['or_notes_2_term']='孔口流态';
$ec_lang['or_notes_2_def']='当上游水位高于孔口顶部时，适用孔口流量方程。当上游水位低于孔顶时，请改用堰流方程。';
$ec_lang['or_notes_3_term']='流量系数';
$ec_lang['or_notes_3_def']='锐缘孔口的 C<sub>d</sub> 约为 0.60–0.65。圆角或内缩入口的值不同。请参考 <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> 或 HEC-RAS 水力学参考手册。';
$ec_lang['or_notes_4_term']='淹没';
$ec_lang['or_notes_4_def']='当下游水位高于孔口底部时，计算器自动采用淹没孔口方程，h = HWE − TWE。当下游水位等于或低于孔底时，采用自由出流假定，h = HWE − 形心高程。';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='微型水力发电';
$ec_lang['mhp_main_title']='免费在线微型水力发电计算器';
$ec_lang['mhp_main_desc']='径流式微型水力发电功率计算器';
$ec_lang['mhp_gross_head']='毛水头，H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="压力管道（供水管）直径">压力管道直径，D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='长度，L';
$ec_lang['mhp_efficiency']='机组效率，η（0–1）';
$ec_lang['mhp_vel_check']='流速校核';
$ec_lang['mhp_hl_check']='水头损失校核';
$ec_lang['mhp_hnet']='净水头，H<sub>net</sub>';
$ec_lang['mhp_power']='输出功率，P';
$ec_lang['mhp_annual_kwh']='年发电量（以 P 折算）';
$ec_lang['mhp_vel_low']='流速过低，存在泥沙淤积和掺气风险。';
$ec_lang['mhp_vel_high']='流速偏高，请检查过渡段损失、可用能量和水锤风险。';
$ec_lang['mhp_vel_ok_short']='正常';
$ec_lang['mhp_vel_high_short']='高';
$ec_lang['mhp_vel_low_short']='低';
$ec_lang['mhp_vel_ok_tip']='流速处于压力管道设计的高效范围内。';
$ec_lang['mhp_hl_ok_tip']='水头损失低于毛水头的 10%。此管径经济合理。';
$ec_lang['mhp_hl_warn_tip']='水头损失超过毛水头的 10%。请考虑增大管径。';
$ec_lang['mhp_hl_bad_tip']='水头损失超过毛水头的 20%。请增大管径。';
$ec_lang['mhp_notes_1_term']='水头损失';
$ec_lang['mhp_notes_1_def']='压力管道总损失 h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>，其中 h<sub>f</sub> = f(L/D)(v²/2g) 为达西-魏斯巴赫（Darcy-Weisbach）沿程摩擦损失，h<sub>m</sub> = k<sub>m</sub>·v²/2g 为进口、弯管和阀门造成的局部损失。净水头 H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>。';
$ec_lang['mhp_notes_2_term']='流速';
$ec_lang['mhp_notes_2_def']='核实流速相对于可用落差和管道造价是否合理。流速过低可能表明管径偏大；流速过高会增大摩擦损失并加大水锤风险。';
$ec_lang['mhp_notes_3_term']='水头损失目标';
$ec_lang['mhp_notes_3_def']='压力管道（引水管）水头损失低于毛水头的 10% 通常是经济的。当电价处于较高水平时，管道造价与电力损失之间的最优平衡点通常出现在约 4–6% 处。';
$ec_lang['mhp_notes_6_term']='效率';
$ec_lang['mhp_notes_6_def']='微水电中常用的 Pelton 和贯流式水轮机典型机组效率 η 为 0.70 至 0.85。保守起见，初步估算可取 0.75。';
$ec_lang['mhp_notes_7_term']='年发电量';
$ec_lang['mhp_notes_7_def']='年发电量假设全年满负荷连续运行（8760 小时/年）。实际发电量将因季节性流量变化、维护停机和负荷因子而偏低。';

// Orifice Drain Time
$ec_lang['odt_main_menu']='池塘与水箱排水时间';
$ec_lang['odt_main_title']='免费在线池塘、蓄水池和水箱排水时间计算器（孔口）';
$ec_lang['odt_main_desc']='池塘、蓄水池或水箱排水时间 — 孔口出流，锥体体积法';
$ec_lang['odt_h1_elev']='初始水面高程';
$ec_lang['odt_a1']='初始面积，A<sub>1</sub>';
$ec_lang['odt_h2_elev']='终止水面高程';
$ec_lang['odt_a0']='孔口高程处面积，A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="根据锥形截面模型在终止高程处插值得出">终止面积，A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='终止高程校验';
$ec_lang['odt_h2_ok']='终止高程高于孔口顶部';
$ec_lang['odt_h2_warn']='终止高程等于或低于孔口顶部';
$ec_lang['odt_h2_warn_tip']='孔口顶部 = 形心 + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="直径（圆形）或高度（矩形）">孔口 D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="仅适用于矩形">孔口宽度，W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='排水时间（秒）';
$ec_lang['odt_t_min']='排水时间（分钟）';
$ec_lang['odt_t_hr']='排水时间（小时）';
$ec_lang['odt_t_day']='排水时间（天）';
$ec_lang['odt_notes_1_term']='公式';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) 给出从水头 H 至孔口的排水时间。排水时间 = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>)，其中 H<sub>1</sub> = 初始高程 − 孔口高程，H<sub>2</sub> = 终止高程 − 孔口高程。';
$ec_lang['odt_notes_2_term']='方法';
$ec_lang['odt_notes_2_def']='锥体体积法将池塘或调蓄池模型化为初始水面面积 A<sub>1</sub> 与孔口形心高程处面积 A<sub>0</sub> 之间的锥形截面。终止高程处的池塘面积 A<sub>2</sub> 由 A<sub>1</sub> 和 A<sub>0</sub> 按锥形截面模型插值得出。从初始到终止高程的排水时间等于从 H<sub>1</sub> 到孔口的总排水时间减去从 H<sub>2</sub> 到孔口的剩余排水时间。';
$ec_lang['odt_h1']='<span class="ec-help" title="初始水面高程减去孔口形心高程">初始水头，H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='最大流量，Q<sub>max</sub>';
$ec_lang['odt_vol']='排出水量';
$ec_lang['odt_sketch_start']='开始';
$ec_lang['odt_sketch_end']='结束';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='滴头间距，S<sub>e</sub>';
$ec_lang['ip_sl']='毛管间距，S<sub>l</sub>';
$ec_lang['ip_n_e']='每条毛管滴头数，n<sub>e</sub>';
$ec_lang['ip_n_l']='每个灌区毛管数，n<sub>l</sub>';
$ec_lang['ip_d']='目标灌水深度，d';
$ec_lang['ip_a_e']='每个滴头控制面积，A<sub>e</sub>';
$ec_lang['ip_pr']='灌水强度，PR';
$ec_lang['ip_q_lat']='每条毛管流量，Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='灌区流量，Q<sub>zone</sub>';
$ec_lang['ip_t_run']='运行时间（小时）';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='渠道渗漏';
$ec_lang['cs_main_title']='免费在线渠道渗漏损失与输水效率计算器';
$ec_lang['cs_main_desc']='渠道渗漏损失 & 输水效率 — 进出流量差值法';
$ec_lang['cs_Q_in']='入流，Q<sub>in</sub>';
$ec_lang['cs_Q_out']='出流，Q<sub>out</sub>';
$ec_lang['cs_L']='渠段长度，L';
$ec_lang['cs_Q_loss']='渗漏损失流量，Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='测量核实';
$ec_lang['cs_pct_loss']='损失比例';
$ec_lang['cs_Ec']='输水效率，E<sub>c</sub>';
$ec_lang['cs_Ec_check']='效率等级';
$ec_lang['cs_Vol_day']='日渗漏水量';
$ec_lang['cs_Vol_year']='年渗漏水量';
$ec_lang['cs_Q_loss_per_L']='单位长度损失，Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='水价值';
$ec_lang['cs_lining_cost']='衬砌成本';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="衬砌后的输水效率目标；分数 0–1">衬砌目标，E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='衬砌面积，L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='年损失价值';
$ec_lang['cs_annual_value_recovered']='年回收价值';
$ec_lang['cs_lining_total_cost']='衬砌总成本';
$ec_lang['cs_payback_years']='<span class="ec-help" title="简单回收期 = 衬砌总成本 ÷ 年回收价值">投资回收期 <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — 检测到渗漏';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — 无可测损失';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — 请检查测量数据';
$ec_lang['cs_Ec_good']='良好 — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='一般 — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='差 — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='进出流量差值法通过测量渠段首尾的流量来估算渗漏量：Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>。输水效率 E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>。年渗漏水量按全年满流连续运行估算；季节性或非满流渠道的实际损失会更低。';
$ec_lang['cs_notes_2_term']='效率等级';
$ec_lang['cs_notes_2_def']='典型无衬砌土渠：E<sub>c</sub> = 60–80%。维护良好的土渠：75–85%。混凝土衬砌渠道：90–98%。渗漏损失超过入流量 30% 时，通常值得投资衬砌。（美国垦务局、联合国粮农组织）';
$ec_lang['cs_notes_3_term']='衬砌投资回收';
$ec_lang['cs_notes_3_def']='请输入统一货币单位下的水价值和衬砌成本。衬砌面积 = 渠段长度 × 湿周 — 即测量流量水深处渠道横断面的湿周（渠底宽度加两侧湿润边坡长度）。年回收价值假设衬砌渠道持续达到目标 E<sub>c</sub>。季节性渠道或衬砌未达目标效率时，实际投资回收期将更长。';
$ec_lang['cs_notes_4_def']='美国垦务局（USBR）<em>量水手册</em>第3版（2001年）。联合国粮农组织灌溉与排水文件第57号（1999年）。';
// About
$ec_lang['about_main_menu']='关于';
$ec_lang['install_main_menu']='安装';
$ec_lang['install_main_title']='安装 EngCalcs';
$ec_lang['install_main_desc']='添加到您的设备以供离线使用';
$ec_lang['install_intro']='EngCalcs 是一款渐进式网络应用（PWA）。安装后，所有计算器均可完全离线使用，无需联网。';
$ec_lang['install_android_heading']='Android（Chrome）';
$ec_lang['install_android_steps_html']='<li>在 Chrome 中打开任意计算器页面。</li><li>点击顶部导航栏中的<strong>⬇ 安装</strong>按钮，或点击浏览器菜单（⋮），选择<strong>添加到主屏幕</strong>。</li><li>在弹出的提示中点击<strong>安装</strong>。</li><li>EngCalcs 将出现在您的主屏幕上，并可离线使用。</li>';
$ec_lang['install_now_btn']='⬇ 立即安装';
$ec_lang['install_prompt_unavailable']='安装提示不可用——请改用浏览器菜单。';
$ec_lang['install_ios_heading']='iOS（Safari）';
$ec_lang['install_ios_steps_html']='<li>在 Safari 中打开任意计算器页面。</li><li>点击<strong>分享</strong>按钮（带向上箭头的方框图标）。</li><li>向下滚动，点击<strong>添加到主屏幕</strong>。</li><li>点击<strong>添加</strong>。EngCalcs 将出现在您的主屏幕上。</li>';
$ec_lang['install_ios_note']='在 iOS 上，安装始终通过“分享”菜单完成——不会自动弹出安装提示。';
$ec_lang['install_desktop_heading']='桌面版（Chrome / Edge）';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>打开任意计算器页面。</li><li>点击浏览器地址栏中的<strong>安装图标</strong>（⊕ 或电脑图标），或打开浏览器菜单并选择<strong>安装 EngCalcs…</strong></li><li>点击<strong>安装</strong>。EngCalcs 将作为独立应用窗口打开。</li>';
$ec_lang['install_firefox_heading']='Firefox / 其他浏览器';
$ec_lang['install_firefox_body']='Firefox 桌面版不支持安装 PWA。您仍可在浏览器中正常使用所有计算器——首次访问后，页面会自动缓存以供离线使用。';
$ec_lang['install_cached_heading']='缓存的内容';
$ec_lang['install_cached_body']='首次安装 EngCalcs 时，所有计算器页面及其相关文件（脚本、样式）会自动保存到您的设备上。此后，一切功能均可在无网络连接的情况下使用。您的语言选择会根据上次在线访问时的设置自动记住。';
$ec_lang['contact_main_menu']='联系';
$ec_lang['about_main_title']='关于 HawsEDC 工程计算器';
$ec_lang['about_main_desc']='使命、自由软件与贡献';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>使命</h3><p>HawsEDC 工程计算器旨在为全球工程师和现场工作者服务——尤其是在缺水、资源匮乏或服务不足地区工作的人。这些工具是更广泛人道主义使命的一部分：以最实际、最有效的方式告诉每一个人，<a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">他们永远是被爱和珍视的，他们不必害怕，也不会毁掉一切</a>。</p><p>计算器是载体，目标是一个没有苦难的世界。</p><h3>自由开源许可证</h3><p>所有代码均在 <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU 通用公共许可证 v3.0 或更高版本</a>下发布——自由，如同"言论自由"中的自由，而非"免费啤酒"中的免费。您可以在相同条款下使用、研究、修改和再分发代码。</p><p>提供它的网站自 2010 年起一直免费开放；即使有一天无法继续，这套软件仍归您自己运行。</p><p>版权所有 © 2009–2026 Thomas Gail Haws。</p><h3>源代码</h3><p>完整源代码在 GitHub 上公开提供：</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>您可以在那里浏览代码、提交问题或 fork 仓库。</p><h3>参与贡献</h3><p>欢迎任何形式的帮助。<a href="contact.php">联系 Tom Haws</a>。</p><ul><li><strong>翻译：</strong>提出更好的措辞建议，改进或新增语言。</li><li><strong>错误报告：</strong>使用任意计算器页面上的反馈表单，或在 GitHub 上提交问题。</li><li><strong>新计算器：</strong>特别欢迎为现场工作者和灌溉从业者服务的水力工程工具创意。</li><li><strong>托管镜像：</strong>如果您能为连接受限地区镜像这些计算器，请联系我。</li></ul><h3>离线使用</h3><p>联网时打开任意一个计算器一次，之后断网时所有计算器仍可继续使用：您的浏览器会随着使用把整套工具存储下来。其机制是<strong>渐进式网络应用（PWA）</strong>，如果您想了解的话。此后，所有计算器均可离线使用——无需网络连接。</p><p>在 Android 或 iOS 上，使用浏览器的"添加到主屏幕"功能，将 EngCalcs 作为应用安装到您的设备上。在桌面端，请在浏览器地址栏中找到安装图标。</p><p>您也可以使用浏览器的"另存为…"菜单保存任意单个计算器，以便临时离线使用。</p><h3>联系方式</h3><p>Tom Haws——水力工程师，这些计算器的创始人。<br />请使用任意计算器页面上的反馈表单，或访问 <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a> 上的源代码。</p>';
$ec_lang['contactSendMessage']='给 Tom Haws 发送消息';
$ec_lang['contactYourName']='您的姓名：';
$ec_lang['contactYourEmail']='您的电子邮件地址：';
$ec_lang['contactSubject']='主题：';
$ec_lang['contact_message']='留言：';
$ec_lang['contactSpamPrefix']='五加一等于';
$ec_lang['contactSpamPostfix']='（请用英文拼写。1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6）';
$ec_lang['contactSubmitButton']='发送消息';
$ec_lang['contact_success']='感谢您抽出宝贵的时间来写信。';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='块石陡槽设计（Robinson）';
$ec_lang['rc_main_title']='免费在线块石陡槽设计计算器 — Robinson (1998)';
$ec_lang['rc_main_desc']='陡槽护坡尺寸设计 — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='陡槽底坡, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="陡槽进口处单宽流量。对于底宽为 B、总流量为 Q 的渠道，取 q_t = Q / B。">总单宽流量, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='护坡孔隙率, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="密度与水的比值。典型碎花岗岩或玄武岩 ≈ 2.65。Robinson 有效范围：2.54 至 2.82。">岩石比重，sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="级配标准差。均匀块石 ≈ 1.25。Robinson 有效范围：1.15 至 1.47。">级配标准差 SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="壅水（Hp > yn）为有利现象——可减少上游冲刷。（USDA）">进口渠道正常水深, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="公式 1（S0 < 0.10）或公式 2（0.10–0.40）。适用范围：D50 15–278 mm，S0 0.02–0.40。超出范围时为外推值。">所需中值块石粒径, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='所用公式';
$ec_lang['rc_sg_check']='比重检验';
$ec_lang['rc_SD_check']='级配标准差检验';
$ec_lang['rc_sg_ok']='sg 在有效范围内';
$ec_lang['rc_sg_ok_tip']='2.54–2.82（Robinson）';
$ec_lang['rc_sg_low']='sg 低于 Robinson 有效范围';
$ec_lang['rc_sg_low_tip']='有效范围：2.54–2.82';
$ec_lang['rc_sg_high']='sg 高于 Robinson 有效范围';
$ec_lang['rc_sg_high_tip']='有效范围：2.54–2.82';
$ec_lang['rc_SD_ok']='SD 在有效范围内';
$ec_lang['rc_SD_ok_tip']='1.15–1.47（Robinson）';
$ec_lang['rc_SD_low']='SD 低于 Robinson 有效范围';
$ec_lang['rc_SD_low_tip']='有效范围：1.15–1.47';
$ec_lang['rc_SD_high']='SD 高于 Robinson 有效范围';
$ec_lang['rc_SD_high_tip']='有效范围：1.15–1.47';
$ec_lang['rc_layer']='护坡厚度（2 × D<sub>50</sub>）';
$ec_lang['rc_crest_radius']='顶部堰顶曲线半径（40 × D<sub>50</sub>）';
$ec_lang['rc_crest_length']='顶部堰顶曲线弧长';
$ec_lang['rc_apron_length']='<span class="ec-help" title="护坦对陡槽护坡起结构支撑作用，为其所必需。“由出口段及下游渠道阻力所形成的最小尾水，足以确保出口段护坡的稳定性。”（Robinson）">出口护坦长度（15 × D<sub>50</sub>） <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='陡槽曼宁糙率, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="流经岩石孔隙的 qt 比例。其余 qs 在表面流动。默认 np = 0.45（适用于棱角形碎石）。">通过块石层的流速, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='通过块石层的单宽流量, q<sub>m</sub>';
$ec_lang['rc_qs']='表面单宽流量, q<sub>s</sub>（q<sub>t</sub> − q<sub>m</sub>）';
$ec_lang['rc_d']='护坡表面以上水深, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="壅水（Hp > yn）为有利现象——可减少上游冲刷。（USDA）">进口堰顶水头, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='进口壅水检验';
$ec_lang['rc_pond_ok']='H<sub>p</sub> > y<sub>n</sub> — 上游壅水';
$ec_lang['rc_pond_ok_tip']='陡槽进口上游发生壅水是有利的，可减少上游冲刷。（USDA）';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — 无壅水 — 进口存在冲刷风险';
$ec_lang['rc_pond_warn_tip']='陡槽进口上游无壅水，可能发生上游冲刷。（USDA）';
$ec_lang['rc_eq1']='公式 1（S<sub>0</sub> < 0.10）— 缓坡';
$ec_lang['rc_eq2']='公式 2（0.10 ≤ S<sub>0</sub> ≤ 0.40）— 陡坡';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — 低于 Robinson 验证范围';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — 高于 Robinson 验证范围';
$ec_lang['rc_notes_1_term']='块石尺寸公式';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) 根据陡槽坡度和单宽流量，建立了两个计算护坡中值粒径 D<sub>50</sub> 的经验公式。公式 1 适用于缓坡（S<sub>0</sub> < 0.10）；公式 2 适用于陡坡（0.10 ≤ S<sub>0</sub> ≤ 0.40）。两个公式均要求 q<sub>t</sub> 的单位为 m²/s，输出 D<sub>50</sub> 单位为 mm。经验证范围为 0.02 ≤ S<sub>0</sub> ≤ 0.40。';
$ec_lang['rc_notes_2_term']='单宽流量';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> 为陡槽堰顶处的总单宽流量（单位宽度上的总流量）。对于底宽为 B、总流量为 Q 的渠道，可近似取 q<sub>t</sub> ≈ Q / B，或由陡槽进口的临界水深条件计算得出。';
$ec_lang['rc_notes_3_term']='通过块石层的水流';
$ec_lang['rc_notes_3_def']='总流量的一部分经由护坡孔隙渗流（层内流 q<sub>m</sub>）；其余部分沿护坡表面流动（q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>）。表面水深 d 由曼宁公式根据陡槽糙率 n 对表面流量 q<sub>s</sub> 求解得出。默认孔隙率 n<sub>p</sub> = 0.45，适用于棱角形碎石。';
$ec_lang['rc_notes_5_term']='有效块石粒径范围';
$ec_lang['rc_notes_5_def']='该公式的开发数据中 D<sub>50</sub> 范围为 15 mm 至 278 mm。超出此范围的计算结果为外推值，使用时应结合额外的工程判断。';
$ec_lang['rc_notes_6_term']='出口护坦高程';
$ec_lang['rc_notes_6_def']='出口段护坡顶面高程应不高于下游渠道底高程。若高于下游河床，出口护坡将不稳定。';

$ec_lang['rc_notes_7_def']='当进口渠道正常水深小于通过 q<sub>t</sub> 所需的堰顶水头（H<sub>p</sub>）时，陡槽进口上游将出现受阻壅水。这通常是可以接受的——壅水可降低流速，防止上游冲刷。检验方法：使用堰流计算器，根据给定的 q<sub>t</sub> 和堰顶宽度求出 H<sub>p</sub>，并与进口渠道正常水深比较。若 H<sub>p</sub> 超过正常水深，则将发生壅水。';
$ec_lang['rc_notes_4_term']='参考文献';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS 亦发布了基于同一方法的 <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel 计算表</a>。';
// Sketch labels
$ec_lang['rc_sketch_filter']          = '过滤层';
$ec_lang['rc_sketch_top_crest_curve'] = '顶部堰顶曲线';
$ec_lang['rc_sketch_outlet_apron']    = '出口护坦';
$ec_lang['rc_sketch_radius']          = '半径';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='灌溉压力';
$ec_lang['ip_main_title']='免费在线灌溉压力与分布均匀度计算器';
$ec_lang['ip_main_desc']='测试毛管压力与均匀度估算';
$ec_lang['ip_h_supply']='供水压力';
$ec_lang['ip_elev_supply']='供水高程，z<sub>supply</sub>';
$ec_lang['ip_q_design']='滴头设计流量，q<sub>design</sub>';
$ec_lang['ip_h_design']='滴头设计压力';
$ec_lang['ip_x']='<span class="ec-help" title="标准非压力补偿滴头取0.5；压力补偿滴头接近0">滴头流量指数，x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='测试路径';
$ec_lang['ip_group_reach']='管段';
$ec_lang['ip_group_upstream']='上游';
$ec_lang['ip_group_downstream']='下游';
$ec_lang['ip_group_loss']='损失';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="选中：该管段是测试毛管的一部分，各滴头从中取水。未选中：该管段为干管，仅将流量输送给不在测试路径上的其他毛管。">毛管 <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="毛管行：仅指该管段内的滴头数。干管行：指从该管段分支出去、除本毛管外其他毛管上的滴头总数。对于止于测试毛管的干管管段，还应包括沿干管继续向下游延伸的任何毛管，或共用同一接点的毛管（例如对侧毛管）——它们的流量同样从该管段分出。">滴头数 <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="该管段下游端的高程。中间行可选（留空则默认为平坡，即与上方节点相同）。最后一行为必填项：该值即为最后滴头的高程，直接决定所需供水压力。">下游高程 <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='最后滴头高程（最后一行）留空，已默认为平坡——请输入该值以获得准确结果';
$ec_lang['ip_press']='压力';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="管段总损失，h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='低压或负压——请检查是否存在低于大气压的情况';
$ec_lang['ip_pressure_warn_short']='低';
$ec_lang['ip_pressure_high']='高压部位需要减压';
$ec_lang['ip_pressure_high_short']='高';
$ec_lang['ip_max_head']='最大允许管道压力';
$ec_lang['ip_max_head_tip']='压力超过该值的管线将被标记。留空则跳过高压检查。';
$ec_lang['ip_h_far']='最后滴头压力';
$ec_lang['ip_q_supply']='<span class="ec-help" title="仅为进入所建模测试路径的流量——整个灌区/系统的流量见下方灌水设计中的 Q_zone。">测试路径供水流量，Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='最后滴头流量，q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='平均滴头流量（测试毛管），q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="估计典型（平均）毛管相较于该测试毛管的压力高出（或低于）多少。测试毛管被有意设定为最不利情况，因此其自身平均值会低估田间平均值——若留空为0，下方的均匀度检查和灌水设计数值将直接采用测试毛管自身（可能偏乐观）的平均值。">估计Δ压力，平均毛管与测试毛管之差 <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="在每条毛管行的压力上加上前面输入的压力差后，重新计算q_avg_lateral——用以修正测试毛管被设定为最不利情况（而非代表性情况）所带来的偏差。该值同时用于下方的均匀度检查和灌水设计部分。">估计田间平均滴头流量，q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="最后滴头的计算流量除以估计的田间平均滴头流量——这是对标准低四分之一分布均匀度（低分组平均值÷总体平均值）的近似，但数据来自小规模模型样本和用户估计的修正值，而非全田统计样本。数值等于或大于1也是可能且有效的：这仅表示最后滴头的压力已达到或高于估计的田间平均值，说明压力最低点在其他滴头上——原因可能是最后滴头位于低处，或Δ压力估计值过小。">均匀度检查，q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='测试滴头处的压力≥供水压力。该滴头可能并非最不利情况，或管径可设计得更小。';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="这与我们对标准均匀度指标的近似值不同。">最后滴头流量 ÷ 设计流量，q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='无解：所需供水压力超过输入的供水压力。请增加供水压力、降低需求，或使用更大管径。';
$ec_lang['ip_notes_1_def']='先假设最后（最远）滴头处的压力，然后沿能量坡降线逐管段向供水端回推，依次累加沿程损失和局部损失。在每个节点处减去高程差和流速水头，得出该处的实际压力。通过二分法反复调整假设的远端压力，直到计算出的所需供水压力与输入的供水压力一致——这与曼宁管流计算器中管流求解器所处理的同一闭环问题相同，只是扩展到了分支管网。';
$ec_lang['ip_notes_2_term']='干管与毛管管段';
$ec_lang['ip_notes_2_def']='表中每一行代表从供水端到最后滴头的单一水力最不利路径（测试路径）上的一个管段。干管管段仅向不在测试路径上的毛管输送流量，因此其取水量按简单乘积计算（设计流量 × 该管段的滴头总数）——不涉及局部压力的影响。干管是共用的主干管道，因此止于测试毛管的干管管段，不仅要包括其两端点之间分出的毛管，还必须包括沿干管继续向下游延伸的任何毛管，或共用同一接点的毛管（例如对侧毛管）——它们的流量在分流之前都要经过这同一管段，无论它们是否在本表其他位置出现。毛管管段则是测试毛管自身的一段：滴头流量通过实际局部压力按 q = k·H<sup>x</sup> 计算，沿程损失则按 Christiansen 的 F(n) 系数折减，以反映该管段内每个滴头取水导致流量逐段递减的情况。';
$ec_lang['ip_notes_3_term']='局限性';
$ec_lang['ip_notes_3_def']='本模型仅考虑一个固定供水压力（不含泵曲线）、一条测试路径（而非整个田块），以及一个双参数滴头流量曲线（将指数设为接近0可近似模拟压力补偿滴头）。报告中给出两个不同的均匀度比值，二者有意保持独立：q<sub>last</sub>/q<sub>avg,field</sub> 是对标准低四分之一分布均匀度（低分组平均值÷总体平均值）的近似，但其数据来自小规模模型样本和用户估计的修正值，而非标准的全田统计样本。此外，测试毛管被有意设定为最不利情况，因此其未经修正的原始平均值会低估真实的田间平均值，使均匀度看起来比实际更好；Δ压力输入项正是为了抵消这一偏差而设置的。均匀度数值等于或大于1仍是可能的：这仅表示最后滴头的压力已达到或高于估计的田间平均值，说明压力最低点在其他滴头上——原因可能是最后滴头位于低处，或Δ压力估计值过小。q<sub>last</sub>/q<sub>design</sub> 是另一项不同的、非均匀度性质的检查，用于与制造商额定流量进行对比——有助于发现系统整体超压或欠压，但它是与均匀度数值分开阅读的独立检查，因为设计/额定流量与系统实际的平均运行压力无关。';
$ec_lang['ip_notes_4_def']='Christiansen, J.E.（1942年）。“Irrigation by sprinkling.” 加利福尼亚州农业试验站公报670号。ASAE/ASABE 微灌设计标准采用相同的多出口沿程损失计算方法。';
$ec_lang['ip_notes_5_term']='灌水设计';
$ec_lang['ip_notes_5_def']='灌水强度和系统/灌区流量采用估计的田间平均滴头流量（q<sub>avg,field</sub>——即测试毛管自身平均值经输入的Δ压力估计修正后的结果），而非凭空猜测的速率：PR = q<sub>avg,field</sub> / A<sub>e</sub>，由修正后的模型值提供。间距及系统范围内的毛管/滴头数量在此为独立输入项，因为测试路径仅模拟一条最不利分支，而非田间所有毛管。';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='分支管网';
$ec_lang['bpn_main_title']='免费在线分支管网（无环路）压力计算器';
$ec_lang['bpn_main_desc']='分支（树状）管网流量与压力';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='静态供水水头：零流量时的水源水头。可以是高于供水高程的水库或水箱水位，也可以是水泵的关闭扬程。添加供水点 2 和点 3 可定义水泵或变化的供水曲线；本工具会读取设计流量下的水头。';
$ec_lang['bpn_elev_source']='供水高程';
$ec_lang['bpn_q_total']='总流量';
$ec_lang['bpn_q_total_tip']='离开水源的总流量（管网中所有需水量之和）。';
$ec_lang['bpn_p_min']='最低压力';
$ec_lang['bpn_p_min_tip']='管网中任意位置的最低下游压力；即关键供水点。';
$ec_lang['bpn_method']='摩擦计算方法';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='管线';
$ec_lang['bpn_id']='编号';
$ec_lang['bpn_id_tip']='该管线的名称。其他管线在"上游"列中引用该名称。';
$ec_lang['bpn_upstream']='上游编号';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='为该管线供水的上游管线编号。留空则默认衔接其正上方的管线（即简单串联管道）。填写编号即可从其他管线分支。';
$ec_lang['bpn_roughness_tip']='所选摩擦计算方法对应的管道粗糙度：Manning 的 n、Hazen-Williams 的 C，或 Darcy-Weisbach 的粗糙度高度 e（长度单位）。典型光滑塑料管：n 约为 0.009，C 约为 150，e 约为 0.0015 mm。';
$ec_lang['bpn_demand']='需水量';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='该管线下游端交付的固定流量。';
$ec_lang['bpn_demand_mult']='需水量倍数';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='同时缩放所有管线的需水量，用于计算高峰时段或未来增长情景。若按原始输入的需水量计算，请使用 1。';
$ec_lang['bpn_elev_down']='下游高程';
$ec_lang['bpn_q_line']='管线流量';
$ec_lang['bpn_q_line_tip']='该管线输送的总流量：其自身需水量加上其下游所供给的全部需水量。';
$ec_lang['bpn_p_down']='下游压力';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='该管线下游节点处的相对压力水头。负值（会被标记）表示低于大气压，需检查设计。';
$ec_lang['bpn_sketch_heading']='管网示意图';
$ec_lang['bpn_source_label']='水源';
$ec_lang['bpn_line_problem']='该管线未与水源连通：它指向了未知的上游编号、指向自身、与另一管线重复使用了同一编号，或形成了环路。未连通的管线不会被求解。';
$ec_lang['bpn_bad_id_short']='错误编号';


$ec_lang['bpn_pressure_warn']='压力过低/为负；请检查是否存在低于大气压的情况';
$ec_lang['bpn_pressure_warn_short']='过低';
$ec_lang['bpn_notes_1_term']='默认串联，特殊情况才分支';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='上游编号留空时，管线默认衔接其正上方的管线，即简单的串联管道。填写上游管线编号即可从该管线分支。因此：默认串联，需要时才形成树状分支。';
$ec_lang['bpn_notes_2_term']='仅支持分支管网，不支持环路';
$ec_lang['bpn_notes_2_def']='每条管线都只有一条上游管线（呈树状结构）。本工具不求解带环路的管网；环路管网需要迭代方法（如 EPANET 等）求解。不含环路正是本工具保持简单且精确的原因。';
$ec_lang['bpn_notes_3_term']='不含主动压力控制装置';
$ec_lang['bpn_notes_3_def']='可以添加固定局部损失阀门（k 值），但不能添加减压阀或维压阀（PRV/PSV）。这类阀门的开闭状态取决于流量和压力，会导致需要迭代求解。';


$ec_lang['bpn_supply2_q']='供水流量 2';
$ec_lang['bpn_supply2_h']='供水水头 2';
$ec_lang['bpn_supply3_q']='供水流量 3';
$ec_lang['bpn_supply3_h']='供水水头 3';
$ec_lang['bpn_supply_pt_tip']='可选的供水曲线点 2 和点 3。分别输入流量和水头，用于模拟水泵或任何随供水量增大而水头下降的水源；本工具会读取设计流量下的水头。上方的点 1 为零流量时的静态水头。若为水头恒定的水库，可将点 2 和点 3 留空。';
$ec_lang['bpn_h_supply']='供水水头';
$ec_lang['bpn_h_supply_tip']='设计流量下的水源水头，取自供水曲线。当曲线平坦（即水库）时，等于所输入的水源水头。';
$ec_lang['bpn_supply1_h']='静态供水水头';
$ec_lang['lpn_main_menu']='供水管网';
$ec_lang['lpn_main_title']='免费在线供水管网建模工具（搭载 EPANET 求解器）';
$ec_lang['lpn_main_desc']='供水管网分析：绘制环状管网或导入 EPANET 文件';
$ec_lang['lpn_title_units']='{units} 单位';
$ec_lang['lpn_tool_select']='选择';
$ec_lang['lpn_tool_add_junction']='节点';
$ec_lang['lpn_tool_add_reservoir']='水库';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='水箱';
$ec_lang['lpn_tool_add_pipe']='管道';
$ec_lang['lpn_tool_add_pump']='水泵';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='阀门';
$ec_lang['lpn_tool_add_text']='文字';
$ec_lang['lpn_tool_vertices']='折点';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='用户';
$ec_lang['lpn_tool_add_meter_tip']='点击用户所在的位置，然后点击为其供水的管道或节点。您为该用户设定的需水量会加到该管道靠近该处一端的节点上。';
$ec_lang['lpn_mode_add_meter']='模式：用户。点击用户所在的位置，然后点击为其供水的管道或节点。或按 Esc 取消。';
$ec_lang['lpn_pane_tab_customers']='用户';
$ec_lang['lpn_customer_heading']='用户 {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='每户需水量';
$ec_lang['lpn_field_meter_demand_tip']='该用户名下每户所需的水量。“查找和替换”可利用空白与 0 之间的区别。';
$ec_lang['lpn_field_meter_count']='户数';
$ec_lang['lpn_field_meter_count_tip']='该用户代表的相同用户数量，这样干管沿线的四十二户独立住宅接管就可以在一处用一个符号表示。下方的合计等于上方的需水量乘以该户数。';
$ec_lang['lpn_field_meter_total']='合计需水量';
$ec_lang['lpn_field_meter_total_tip']='每户需水量乘以户数。这就是加到下方所列节点上的数值。';
$ec_lang['lpn_field_meter_pipe']='连接元件';
$ec_lang['lpn_field_meter_pipe_suggest']='最近的元件是 {id}。在此输入即可让该用户由它供水。';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='连接至';
$ec_lang['lpn_field_meter_node_tip']='该用户所连接的节点。将连接点拖到某条管道上，即可改由该管道沿线某处为其供水。';
$ec_lang['lpn_meter_pipe_unknown']='本项目中没有名为 {id} 的对象，因此该用户保持原位不变。';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='该用户的需水量在运行过程中如何升降。它作用于合计需水量，因此会影响该用户所代表的每一户。保持为“无模式”即可跟随项目的默认需水模式。';
$ec_lang['lpn_meter_pattern_unknown']='本项目中没有名为 {id} 的模式，因此该用户保持原样不变。';
$ec_lang['lpn_meter_placed']='已添加用户 {id}。可在“用户”表格中填写其说明和需水量，或在“选择”模式下点击它以打开其属性框。';
$ec_lang['lpn_field_meter_pipe_tip']='该用户所连接的元件。在此处或“用户”表格中输入另一个元件即可更改，也可将连接点拖到另一个元件上。';
$ec_lang['lpn_field_meter_station']='沿管道的位置（%）';
$ec_lang['lpn_field_meter_station_tip']='该用户接入管道的位置，以管道从第一个节点到第二个节点的百分比表示。0 表示在一端，100 表示在另一端。管道上的圆点可用指针实现同样的效果。';
$ec_lang['lpn_field_meter_offset']='与管道的偏移';
$ec_lang['lpn_field_meter_offset_tip']='正值表示从管道第一个节点看向第二个节点时的右侧。在此输入数值可将用户移到干管的另一侧，且接户管始终与干管垂直。';
$ec_lang['lpn_field_meter_lumped']='计入节点';
$ec_lang['lpn_field_meter_lumped_tip']='最近的节点；该用户的需水量会加到此节点上。';
$ec_lang['lpn_node_customers']='用户需水量';
$ec_lang['lpn_node_customers_tip']='添加在此节点（因为这是最近的节点）的用户列表。用户需水量是在此处列出的其他需水量之外另加的。用户可在地图上其所在位置或在“用户”表格中编辑。';
$ec_lang['lpn_node_customers_sum']='来自 {n} 个用户的 {total} {unit}';
$ec_lang['lpn_customer_detached']='⚠ 该用户未连接到任何管道，因此其需水量未计入结果。请删除它，或绘制一条管道并将该用户移到其上。';
$ec_lang['lpn_customer_fixed_head']='⚠ 该管道靠近的一端是固定水位，因此该需水量不影响模拟结果。';
$ec_lang['lpn_customer_detached_count']='有 {n} 个用户未连接到管道，其需水量未被计入。';
$ec_lang['lpn_meter_pick_pipe']='现在点击为该用户供水的管道或节点。该用户会保持在您放置的位置。按 Escape 取消。';
$ec_lang['lpn_inp_export_flat_customers']='EPANET 文件不含用户。本项目中 {n} 个用户的需水量会作为一行需水量数据写入其各自所加节点，每行都以该用户的标记命名。文件无法保存的是用户本身：它所在的位置、由哪条管道供水、沿该管道接入的位置，以及一个用户代表多少户。这些信息都保留在您自己的项目文件中。';

$ec_lang['lpn_area_hint_window_start']='点击窗口选框的一个角。';
$ec_lang['lpn_area_hint_window_go']='点击对角以完成选择。';
$ec_lang['lpn_area_hint_lasso_start']='点击以开始绘制轮廓线。';
$ec_lang['lpn_area_hint_lasso_go']='移动鼠标以绘制轮廓线，点击以完成。';
$ec_lang['lpn_area_hint_polygon_start']='点击以绘制多边形区域，双击以完成。';
$ec_lang['lpn_area_hint_polygon_go']='依次点击各个顶点，双击最后一个顶点以完成。';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='选择时按住 Shift 键可在现有选择基础上继续操作，将所选内容加入或移出（切换）选择集。';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='在地图上按住并围绕所需内容拖动，然后松开。';
$ec_lang['lpn_area_hint_touch_go']='围绕所需内容拖动，松开即可完成。';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='显示此提示';
$ec_lang['lpn_multi_title']='已选择 {n} 个';
$ec_lang['lpn_multi_varies']='不一致';
$ec_lang['lpn_multi_applied']='已对 {n} 个元件设置 {prop}。';
$ec_lang['lpn_multi_no_fields']='这些元件没有可在此处一起设置的属性。';
$ec_lang['lpn_pane_pasted']='已粘贴 {n} 个单元格，{skipped} 个未作更改。';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='已粘贴 {n} 行，其中 {created} 行已添加到管网中。';
$ec_lang['lpn_pane_pasted_rows_skipped']='已粘贴 {n} 行，其中 {created} 行已添加到管网中。{skipped} 个单元格未被更改。';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='点击此处，粘贴电子表格中的行以添加它们。';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='粘贴为表格末尾的新行';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='按 Ctrl+V 将复制的行添加到此表格底部。按 Esc 取消。';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='此次粘贴共有 {n} 行，其中 {fit} 行可放入表格。是否将其余 {extra} 行作为新行添加到底部？';
$ec_lang['lpn_pane_paste_overflow_add']='添加 {extra} 行';
$ec_lang['lpn_pane_paste_overflow_fit']='只粘贴可放入的 {fit} 行';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='此次粘贴共有 {n} 行，其中 {fit} 行可放入表格。其余 {extra} 行无法作为新行添加：{reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='有 {n} 个 ID 不匹配。仍要粘贴吗？';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='未粘贴任何内容。{reasons}';
$ec_lang['lpn_pane_paste_more']='此处未显示的有问题的行：{n}。';
$ec_lang['lpn_pane_paste_no_id']='第 {row} 行：新行需要一个 ID。';
$ec_lang['lpn_pane_paste_bad_id']='第 {row} 行：ID {id} 中含有空格或引号。';
$ec_lang['lpn_pane_paste_id_taken']='第 {row} 行：ID {id} 已被使用。';
$ec_lang['lpn_pane_paste_id_twice']='第 {row} 行：ID {id} 在此次粘贴中被使用了两次。';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='第 {row} 行：新节点需要同时给出 {first} 和 {second}。';
$ec_lang['lpn_pane_paste_no_ends']='第 {row} 行：新连接线需要“起点”节点和“终点”节点。';
$ec_lang['lpn_pane_paste_no_node']='第 {row} 行：节点 {id} 尚不存在。请先粘贴节点，再粘贴连接线。';
$ec_lang['lpn_pane_paste_same_ends']='第 {row} 行：“起点”和“终点”是同一个节点。';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='第 {row} 行：{text} 不是有效的 {col}。';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='第 {row} 行：新的文字需要同时给出 {first} 和 {second}。';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='第 {row} 行：{id} 尚不是此管网中的节点或管道。请先粘贴它，再粘贴此文字。';
$ec_lang['lpn_pane_paste_customer_no_position']='第 {row} 行：新的用户需要同时给出 {first} 和 {second}。';
$ec_lang['lpn_pane_paste_no_customer_ref']='第 {row} 行：新的用户需要连接到一条管道或一个节点。';
$ec_lang['lpn_pane_paste_no_pipe']='第 {row} 行：管道 {id} 尚不存在。请先粘贴您的管道，再粘贴您的用户。';
$ec_lang['lpn_pane_paste_no_customer_node']='第 {row} 行：节点 {id} 尚不存在。请先粘贴您的节点，再粘贴您的用户。';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='第 {row} 行：节点 {id} 没有可供用户连接的管道。';

$ec_lang['lpn_pane_filled']='已向下填充 {n} 个单元格。{skipped} 个未被更改。';
$ec_lang['lpn_pane_filldown']='向下填充';
$ec_lang['lpn_pane_fill_none']='此选区内没有可向下填充的内容。';
$ec_lang['lpn_pane_ctrlenter_filled']='已填充 {n} 个单元格。{skipped} 个未被更改。';
$ec_lang['lpn_pane_hide_col']='隐藏此列';
$ec_lang['lpn_pane_hide_cols']='隐藏这些列';
$ec_lang['lpn_pane_show_all_cols']='显示所有列';
$ec_lang['lpn_pane_sort_asc']='升序排序';
$ec_lang['lpn_pane_manage_cols']='管理列…';
$ec_lang['lpn_pane_manage_cols_title']='管理列';
$ec_lang['lpn_pane_manage_cols_show']='显示';
$ec_lang['lpn_pane_manage_cols_up']='上移';
$ec_lang['lpn_pane_manage_cols_down']='下移';
$ec_lang['lpn_pane_manage_cols_top']='移到最前';
$ec_lang['lpn_pane_manage_cols_bottom']='移到最后';
$ec_lang['lpn_pane_colmenu_tip']='隐藏或管理列';
$ec_lang['lpn_pane_sortarrow_tip']='反转排序顺序';
$ec_lang['lpn_tool_area_window']='选择窗口';
$ec_lang['lpn_tool_area_lasso']='选择套索';
$ec_lang['lpn_tool_area_polygon']='选择多边形';
$ec_lang['lpn_tool_delete']='删除';
$ec_lang['lpn_tool_zoom_extent']='缩放至全图';
$ec_lang['lpn_tool_zoom_window']='窗口缩放';
$ec_lang['lpn_zoom_in']='放大';
$ec_lang['lpn_zoom_out']='缩小';
$ec_lang['lpn_new_text']='文字';
$ec_lang['lpn_field_text_bold']='粗体文字';
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
$ec_lang['lpn_field_text_anchor']='附加于';
$ec_lang['lpn_field_text_align']='水平对齐方式';
$ec_lang['lpn_field_text_align_left']='左对齐';
$ec_lang['lpn_field_text_align_center']='居中';
$ec_lang['lpn_field_text_align_right']='右对齐';
$ec_lang['lpn_field_text_valign']='垂直对齐方式';
$ec_lang['lpn_field_text_valign_top']='顶部';
$ec_lang['lpn_field_text_valign_middle']='居中';
$ec_lang['lpn_field_text_valign_bottom']='底部';
$ec_lang['lpn_field_text_rotation']='角度（度）';
$ec_lang['lpn_field_text_match_pipe']='转向与最近管道相同的角度';
$ec_lang['lpn_field_text_flip']='旋转180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='附着的元件';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='该文字放置的位置足够靠近某个元件，因此会随该元件一起移动，并带有引线。带引线的文字的水平和垂直对齐方式由其所在的一侧决定，这就是为什么在附着状态下不提供这两行设置。';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='喷射（漏损）系数';
$ec_lang['lpn_field_emitter_tip']='一种取决于压力的额外出流，用于喷头、敞开出水口或模拟的漏损。其释放的流量等于该系数乘以压力的喷射（漏损）指数次幂，该指数在"设置"、"计算"、"水力计算"下为整个管网统一设置一次。普通节点请将此项留空。';
$ec_lang['lpn_field_elev']='高程';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='该节点的地面或管道标高。基准面可任意选取，只要所有节点使用同一基准即可。';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='水头';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='水库的水面标高，以高度表示，而非压力。留空则水面标高取节点高程。';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='水箱底部的高程。水箱内的水深均从此处向上测量。';
$ec_lang['lpn_field_tank_level']='水深';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='水箱中当前水的深度，从水箱底部向上测量。水面标高等于水箱底部高程加上该深度。';
$ec_lang['lpn_field_tank_minlevel']='最低水深';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='视为水箱已排空时的水深，从水箱底部向上测量。';
$ec_lang['lpn_field_tank_maxlevel']='最高水深';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='视为水箱已充满时的水深，从水箱底部向上测量。';
$ec_lang['lpn_field_tank_diameter']='水箱直径';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='水箱的横向宽度（直径）。其单位与高程相同，而非管径单位。它决定了给定水深所容纳的水量。';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='水箱内水面的标高：水箱底部高程加上水深。求解器使用此标高作为水箱的水位。';
$ec_lang['lpn_close']='关闭';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='属性';
$ec_lang['lpn_empty_hint']='使用"文件"菜单中的"新建项目"打开示例。或者从工具栏开始添加水库、节点和管道。';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='您的管网完好无损。';
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
$ec_lang['lpn_examples_welcome']='欢迎使用基于 EPANET 求解器的供水管网建模工具';
$ec_lang['lpn_examples_heading']='打开示例的副本';
$ec_lang['lpn_examples_sub']='每个示例都会作为您自己的副本打开。您可以修改并保存它，也可以打开一份全新的副本重新开始。';
$ec_lang['lpn_examples_open']='打开';
$ec_lang['lpn_examples_menu']='打开示例…';
$ec_lang['lpn_examples_blank']='或从此处开始';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='{nodes} 个节点，{links} 条管道';
$ec_lang['lpn_examples_failed']='无法加载示例。请使用"文件"菜单中的"新建项目"开始绘图。';
$ec_lang['lpn_examples_loading']='正在加载示例…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='提出更正';
$ec_lang['lpn_help_notes']='本页说明';
$ec_lang['lpn_help_hotkeys']='表格与快捷键';
$ec_lang['lpn_hotkeys_tables_heading']='表格';
$ec_lang['lpn_hotkeys_map_heading']='地图';
$ec_lang['lpn_hotkeys_map_term']='地图键盘快捷键';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 或 Esc</td><td>选择。</td></tr><tr><td>2</td><td>添加节点。</td></tr><tr><td>3</td><td>添加水库。</td></tr><tr><td>4</td><td>添加水池。</td></tr><tr><td>5</td><td>添加管道。</td></tr><tr><td>6</td><td>添加水泵。</td></tr><tr><td>7</td><td>添加阀门。</td></tr><tr><td>8</td><td>添加用户。</td></tr><tr><td>9</td><td>添加文字。</td></tr><tr><td>Delete</td><td>删除所选内容。</td></tr><tr><td>Ctrl+Z</td><td>撤销上一次更改。</td></tr><tr><td>+ 或 =</td><td>放大。</td></tr><tr><td>-</td><td>缩小。</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='这里有问题吗？';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='点击一次即可告诉我们本页面存在问题。它会发送本页面名称、您正在阅读的语言，以及地图上的提示信息（如果有）。它不会发送您输入的任何内容、任何地址，也不会发送您绘图中的任何内容。没有人能够回复您，因为这不会告诉我们您是谁。如果您想说明更多情况，请使用“帮助”、“提出更正”。';
$ec_lang['lpn_wrong_thanks']='谢谢，我们已收到。';
$ec_lang['lpn_status_example_opened']='已打开 {name}。这是您自己的副本：请使用"文件"菜单中的"另存为"保存它。';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='本页面无法确定绘图区域的尺寸，因此地图显示的是上一次能够计算出的视图。调整窗口大小会让它重新尝试。如果这种情况持续出现，通常是因为某个浏览器扩展程序阻止了页面尺寸的测量。';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='基本管网，升/秒（公制）';
$ec_lang['lpn_ex_basic_si_desc']='从这里开始。一个水库、一台水泵和一个小环路：能作为一个供水管网运行的最小配置。单位为升每秒，配以米和毫米。';
$ec_lang['lpn_ex_basic_us_title']='基本管网，加仑/分钟（美制）';
$ec_lang['lpn_ex_basic_us_desc']='与上例相同的起始管网，单位为加仑每分钟，配以英尺和英寸。';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1（含基于规则的控制）';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='EPANET 自带的三个示例管网中最小的一个：一个水库、一台水泵和一个环路。';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='来自 EPANET 示例、带有一个水箱的分支配水系统。';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='EPANET 的大型示例：92 个节点、3 个水箱和 2 个水库（其中一个为河流水源）。值得打开看看真实规模的模型在地图上是什么样子。';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3，经纬度';
$ec_lang['lpn_ex_net3_world_desc']='与 EPANET Net3 相同的管网，被放置在地球上一个任意位置：其坐标为经度和纬度，并在其后绘有街道地图。';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='一个商业场地案例，在最大日用水量的基础上叠加消防流量，求解某一时刻的工况，绘制在场地平面图之上。';
$ec_lang['lpn_tool_undo']='撤销';
$ec_lang['lpn_confirm_example']='这会将示例添加到您现有的管网中。是否继续？';
$ec_lang['lpn_field_diameter']='管径';
$ec_lang['lpn_demand_tip']='此节点取出的流量。若要向管网中输入流量，请在此处输入负数。';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='此单位决定您输入内容的含义';
$ec_lang['lpn_units_warn_lead']='{unit} 是您在此处输入内容的单位：';
$ec_lang['lpn_units_options_head']='更改单位时：';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='非破坏性';
$ec_lang['lpn_units_nondestructive_desc']='非破坏性：保留每个输入值不变，只按新单位重新解读。';
$ec_lang['lpn_units_destructive']='破坏性';
$ec_lang['lpn_units_destructive_desc']='破坏性：对每个输入值进行数学换算并重写，使管网在换算误差范围内保持物理上基本不变。原始输入值会丢失，撤销可将其恢复。';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} 个数值现在按 {unit} 解读，未作任何改写。';
$ec_lang['lpn_status_converted']='{n} 个数值已被改写为 {unit}。';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='按某一数量为管网着色，便于在大型地图上一眼看清全局。压力和流速通常是最重要的两项。';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='长度';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='地图坐标';
$ec_lang['lpn_units_mapcoords_deg']='度';
$ec_lang['lpn_units_usft']='美国测量英尺';
$ec_lang['lpn_units_elevhead']='高程与水头';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='水力坡降';
$ec_lang['lpn_result_gradient_tip']='水头损失除以管道长度。用于比较不同长度管道相对于同一设计限值的表现。';
$ec_lang['lpn_result_water_age']='水龄';
$ec_lang['lpn_result_water_age_tip']='到达该点的水在系统中已停留的时长。在水流交汇处，到达的水混合了不同水龄的水，此处的数值是按流量加权得到的平均值：即使还有一条长的死端管道也在为该节点供水，只要主要由一条较短的新主管供水，该节点显示的水龄仍然较低。对于水箱，该数值是箱内所存水的平均水龄，这也是为什么周转缓慢的水箱通常是管网中水龄最老的水。此项没有可比照的法定限值，请根据自己管网的实际情况判断该数值。';
$ec_lang['lpn_result_source_share']='来源占比';
$ec_lang['lpn_result_source_share_tip']='到达该点的水中，有多少来自追踪节点。这正是“来源追踪”分析所给出的结果。';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='平均水龄';
$ec_lang['lpn_result_avg_source_share']='平均来源占比';
$ec_lang['lpn_result_avg_concentration']='平均浓度';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='摩擦系数';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='反应速率';
$ec_lang['lpn_result_status']='状态';
$ec_lang['lpn_result_status_open']='开启';
$ec_lang['lpn_result_status_closed']='关闭';
$ec_lang['lpn_result_head']='水头';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='该节点处水的能量，以水柱高度表示。它是一个绝对高度，而压力是相对测量值（表压）。';
$ec_lang['lpn_result_pressure']='压力';
$ec_lang['lpn_result_flow']='流量';
$ec_lang['lpn_result_velocity']='流速';
$ec_lang['lpn_result_headloss']='水头损失';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='仅重置本项目的设置。您的绘图和其他项目不会受影响。若要保存常用设置以便复用，可保存一个只含设置的项目文件。';
$ec_lang['lpn_reset_all_tip']='删除全部项目、全部背景图片、全部设置以及您的单位选择，然后按首次访问者所见的样子重新加载页面。这是唯一会清除所有内容的重置。';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='本计算器现在按输入原样存储项目单位和数值，但此前曾将数值转换为国际单位制（SI）后存储。该项目保存于此更改之前，因此其数值以 SI 存储。是否再转换一次为当前单位？为便于您判断，以下列出几个将被转换的管径，附转换前后的数值：';
$ec_lang['lpn_v2_restore_yes']='转换';
$ec_lang['lpn_v2_restore_never']='不。以后不再询问。';
$ec_lang['lpn_v2_restore_no']='关闭，让我先检查当前单位';
$ec_lang['lpn_storage_too_new']='该项目由更新版本的页面保存，此处无法打开。';
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
$ec_lang['lpn_tool_file']='文件';
$ec_lang['lpn_menu_edit']='编辑';
$ec_lang['lpn_menu_insert']='插入';
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
$ec_lang['lpn_menu_map']='地图';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='显示街道地图';
$ec_lang['lpn_basemap_satellite_show']='显示卫星影像';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='配准';
$ec_lang['lpn_xymap']='本地';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='转换为…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='{name} 的副本';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='转换为';
$ec_lang['lpn_convas_coordsys_tip']='副本要转换到的坐标系。若与本项目不同，随后会出现两个定位步骤。若项目已经知道自己的位置，这两个步骤会预先给出答案，您可以直接接受，也可以更改。';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='当前：{crs}';
$ec_lang['lpn_convas_epsg']='EPSG 坐标系';
$ec_lang['lpn_convas_epsg_tip']='从 EPSG 注册库中选择一个坐标系。纬度和经度对应 WGS 84（EPSG:4326）。';
$ec_lang['lpn_convas_unnamed']='未命名（本地）配准';
$ec_lang['lpn_convas_unnamed_tip']='以长度单位表示的本地坐标，并附有世界地图。';
$ec_lang['lpn_convas_none_tip']='以长度单位表示的本地坐标，暂不附有世界地图。';
$ec_lang['lpn_convas_units_tip']='副本要转换到的单位。原项目保留其自身的数值和单位。';
$ec_lang['lpn_convas_round']='对转换后的数值取整';
$ec_lang['lpn_convas_round_tip']='仅对此次转换所改写的数值取整，舍入到您选择的步长。单位未改变的数值保持不变。';
$ec_lang['lpn_convas_round_none']='不取整';
$ec_lang['lpn_convas_round_flow']='需水量和流量';
$ec_lang['lpn_convas_label_col']='后缀';
$ec_lang['lpn_convas_label_tip']='添加在副本地图标签该数值之后的文字，例如“ mm”或“ gpm”。默认根据上方所选单位填入；清空即表示不加后缀。';
$ec_lang['lpn_convas_oneway']='转换回去是另一次转换，而不是撤销。转换后再转换回来的数值，可能与最初输入的不完全相同。';
$ec_lang['lpn_convas_ok']='转换';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} 是所列坐标系中少数没有可用投影信息的一种，因此无法与其相互转换。未进行任何转换。';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='转换后的副本是 {name}。原项目未发生改变。';
$ec_lang['lpn_convas_cancelled']='未进行任何转换。副本已关闭，原项目未发生改变。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='将本项目复制到一个新标签页，并将副本转换为您选择的坐标系和单位。坐标系发生变化时，会有一个向导引导您先大致缩放管网背后的地图，再更精细地缩放和旋转地图上的管网。本项目本身完全不变。若只想配准而不转换任何内容，请改用“地图”、“世界地图”、“附加”。';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='本项目已经过配准，因此管网已经在地图上，未移动任何内容。请检查其位置是否正确，然后依次按“将模型放在此处”按钮和“保留此位置”按钮。';
$ec_lang['lpn_georef_intro']='放置模型分两个步骤。第 1 步是粗略的：模型保持不动，您移动其下方的地图，直到现场大致位于模型下方、大小大致相符为止，这一步暂不涉及旋转。第 2 步是精确的：您直接拖动、缩放和旋转模型本身。项目一开始位于整个世界地图上，因此请先找到您的位置，然后点击“将模型放在此处”。';
$ec_lang['lpn_georef_adjust']='模型现在已经固定在地面上，会跟随地图一起移动。拖动模型可移动它，拖动一角可调整其大小，拖动模型上方的圆形手柄可旋转它。也可以在下方直接输入地面距离和旋转角度。';
$ec_lang['lpn_georef_step1']='第 1 步（共 2 步）——快速';
$ec_lang['lpn_georef_step2']='第 2 步（共 2 步）——精确';
$ec_lang['lpn_georef_step1_hint']='您的项目会保持在屏幕上原来的位置不动。请平移和缩放其下方的地图，直到背景大致位于正确的位置、大小大致正确，然后点击“将模型放在此处”。';
$ec_lang['lpn_georef_detach']='重新拿起';
$ec_lang['lpn_georef_size_prompt']='整个项目场地大约有多宽？';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}：{tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='快捷键：按 {key}。';
$ec_lang['lpn_tool_key_hint_two']='快捷键：按 {key} 或 {key2}。';
$ec_lang['lpn_tool_add_junction_tip']='点击地图以添加节点：管道相汇或用水的位置。';
$ec_lang['lpn_tool_add_reservoir_tip']='点击地图以添加水库：水位固定不变的无限水源。';
$ec_lang['lpn_tool_add_tank_tip']='点击地图以添加水箱：随充放水而水位升降的蓄水设施。';
$ec_lang['lpn_tool_add_pipe_tip']='依次点击一个节点和另一个节点，在两者之间绘制一条管道。';
$ec_lang['lpn_tool_add_pump_tip']='依次点击一个节点和另一个节点，在两者之间放置一台水泵。';
$ec_lang['lpn_tool_add_valve_tip']='依次点击一个节点和另一个节点，在两者之间放置一个阀门。';
$ec_lang['lpn_tool_add_text_tip']='点击地图以在图上写一条注记。';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='按照提示在地图上点击，以选中形状内的所有内容。再次点击此按钮可在窗口、套索和多边形之间切换选择形状。选择时按住 Shift 键可在现有选择基础上继续操作，将所选内容加入或移出（切换）选择集。';
$ec_lang['lpn_area_selected']='已选择 {n} 个。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='该区域内未找到任何内容。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='添加或删除塑造管道形状的折点。点击管道可添加折点，点击折点可删除它，拖动折点可移动它。折点只改变绘制的路径，不改变水力计算结果。';
$ec_lang['lpn_tool_delete_tip']='点击地图上的任意元件即可将其删除。';
$ec_lang['lpn_tool_undo_tip']='撤销上一次更改。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='将整个管网缩放至窗口大小。';
$ec_lang['lpn_tool_zoom_window_tip']='在地图上点击一个方框的两个对角，或拖出一个方框，即可放大到该区域。再次按此按钮可执行“缩放至全图”。';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='放大。快捷键：+';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='缩小。快捷键：-';
$ec_lang['lpn_tool_settings_tip']='打开本项目的设置。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='按 ID 查找元件，或查找所有满足条件的元件，并一次性全部更改。';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='工具栏';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='可见性';
$ec_lang['lpn_pane_right_toggle_tip']='显示或隐藏地图右侧的面板。其中包含标签和颜色的选项。';
$ec_lang['lpn_color_legend_open_tip']='点击可打开"可见性"面板并更改这些颜色。';
$ec_lang['lpn_color_node_field']='节点着色依据';
$ec_lang['lpn_color_link_field']='管道着色依据';
$ec_lang['lpn_color_ramp_sequential']='顺序渐变';
$ec_lang['lpn_color_ramp_diverging']='发散渐变';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='区间数量';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='区间划分方式';
$ec_lang['lpn_color_ranges_note']='下方的边界值一旦设定即固定不变，不会随结果变化而跟随调整。在上方选择一种数据分类方法会根据系统当前状态设定这些边界值。如果您手动更改任意数值，上方的方法会变为“手动”。';
$ec_lang['lpn_color_criterion_note']='此方法的边界值来自某项设计标准，因此在选用该方法期间颜色数量是固定的。';
$ec_lang['lpn_color_break_number']='边界值必须是一个数字。地图未作任何更改。';
$ec_lang['lpn_color_break_order']='每个边界值都必须大于前一个。地图未作任何更改。';
$ec_lang['lpn_color_break_count']='边界数量应比颜色数量少一个。地图未作任何更改。';
$ec_lang['lpn_color_ramp_qualitative']='定性配色';
$ec_lang['lpn_color_ramp_rainbow']='彩虹色';
$ec_lang['lpn_color_ramp_rainbow_eg']='与 EPANET 一致';
$ec_lang['lpn_color_example_material']='材质';
$ec_lang['lpn_color_ramp_ylgnbu']='黄至蓝';
$ec_lang['lpn_color_ramp_rdylbu']='红至蓝，经黄色过渡';
$ec_lang['lpn_georef_drop']='将模型放在此处';
$ec_lang['lpn_georef_finish']='保留此位置';
$ec_lang['lpn_georef_scale']='每绘图单位对应的地面距离';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='您绘图上的一个单位在地面上对应多远的距离。在普通网格上绘制的图纸通常不带有这个信息，因此请在此处设置——也可以让"前往…"询问场地宽度，由系统计算出来。';
$ec_lang['lpn_georef_rotation']='逆时针旋转角度（度）';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='整个模型需要逆时针旋转多少度，才能使其北向正对正北。';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='要永久将模型放置在此处吗？之后您仍可以拖动单个元件，但该图纸将不再是 xy 项目。如需恢复为 xy，请在不保存的情况下关闭本项目。';
$ec_lang['lpn_georef_done']='此项目现在是经纬度项目。拖动任意元件，可将其移动到更接近实际位置的地方。';
$ec_lang['lpn_georef_backdrop_unrotated']='背景图片已随模型一起移动和缩放，但无法随之旋转。请使用“地图”、“背景图片”、“移动”来对齐它。';
$ec_lang['lpn_georef_empty']='该文件中没有管网，因此没有可放置的内容。';
$ec_lang['lpn_georef_unavailable']='放置工具未能加载。请重新加载页面后再试一次。';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='请先用“保留此位置”按钮完成放置，或按取消，然后再切换项目。此放置属于当前项目，无法带到另一个项目中。';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='请先点击"保留此位置"按钮完成放置，或点击"取消"，然后再保存。该项目仍处于放置过程中，因此屏幕上显示的内容尚不是将要写入文件的内容。';
$ec_lang['lpn_goto_menu']='前往某一经纬度…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='将地图移动到您已知坐标的位置。先纬度、后经度，与地图标注顺序一致，两者之间以空格分隔：38 -122';
$ec_lang['lpn_goto_prompt']='纬度和经度，按此顺序';
$ec_lang['lpn_goto_bad']='这不是一组有效的纬度和经度。请尝试 38 -122，两者之间以空格分隔。';
$ec_lang['lpn_georef_goto']='前往…';
$ec_lang['lpn_georef_twopt']='使用两个已知点';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='当您已知道图纸上两个点的真实位置时，可借此精确放置模型。点击其中一点，输入其纬度和经度，然后对第二个点做同样操作。位置、比例和旋转角度都将由这两个点推算得出。再次点击此按钮可停止选取。';
$ec_lang['lpn_georef_twopt_pick1']='点击图纸上一个您知道纬度和经度的点。';
$ec_lang['lpn_georef_twopt_pick2']='现在点击第二个已知点，与第一个点尽量远。';
$ec_lang['lpn_georef_twopt_same']='这就是您先前点击的那个点。请选择另一个点。';
$ec_lang['lpn_georef_twopt_done']='模型现在已定位在您给出的这两个点上。请检查无误后，点击“保留此位置”。';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='底部面板';
$ec_lang['lpn_pane_toggle_tip']='显示或隐藏地图下方的面板。其中包含剖面图和各类元件的表格。';
$ec_lang['lpn_pane_resize']='拖动可调整面板高度';
$ec_lang['lpn_pane_tab_junctions']='节点';
$ec_lang['lpn_pane_tab_reservoirs']='水库';
$ec_lang['lpn_pane_tab_tanks']='水箱';
$ec_lang['lpn_pane_tab_pipes']='管道';
$ec_lang['lpn_pane_tab_pumps']='水泵';
$ec_lang['lpn_pane_tab_valves']='阀门';
$ec_lang['lpn_pane_tab_tip']='此标签页将这类元件显示为一个可排序、可编辑的表格。结果列不可编辑。';
$ec_lang['lpn_pane_none']='此管网目前还没有这类元件。';
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
$ec_lang['lpn_pane_text_attached']='已附着';
$ec_lang['lpn_pane_not_used']='未使用';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='已按 {q} 过滤，显示 {all} 项中的 {n} 项。';
$ec_lang['lpn_pane_filter_clear']='显示全部';
$ec_lang['lpn_pane_filter_stale']='不再匹配的行：{n}。';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='此表中没有与过滤条件匹配的内容。';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='缩放并选中';
$ec_lang['lpn_goto_on_map']='在地图上定位';
$ec_lang['lpn_pane_select_on_map']='在地图上选中';
$ec_lang['lpn_pane_unselect_on_map']='在地图上取消选中';
$ec_lang['lpn_pane_print']='打印表格';

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
$ec_lang['lpn_menu_project']='水务';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='有关水网建模的所有内容都集中在这里，动画播放控制除外。您无需猜测各项功能的位置。';
$ec_lang['lpn_tables_menu']='表格';
$ec_lang['lpn_tables_menu_tip']='在地图下方打开面板，显示此管网中各部件的表格。每种部件对应一个表格，您可以在其中排序和编辑。';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='立即重新计算此管网。找不到“计算”按钮？开启“自动重新计算”设置时，该按钮会被隐藏。请在“设置”的“计算”下“水力计算”中关闭“自动重新计算”，使按钮重新出现。';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='自动重新计算';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='开启此项后，本项目会在您每次更改后不久自动重新计算，工具栏上的"计算"按钮也会随之移除，因为它已无事可做。在大型管网中，如果每次更改都要等待重新计算会妨碍输入，可关闭此项，"计算"按钮便会恢复，由您自行选择运行时机。';
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
$ec_lang['lpn_time_run_slow']='此管网计算耗时 {secs} 秒，且设置为每次更改后自动重新计算。要停止这一行为并恢复"计算"按钮，请在"设置"的"计算"下"水力计算"中关闭"自动重新计算"。';
$ec_lang['lpn_time_no_report']='目前还没有运行报告。该报告是 EPANET 自身生成的文本，只有在本管网使用 EPANET 求解器计算之后才会出现。';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='帮助';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='截图库';
$ec_lang['lpn_help_walkthroughs']='教程';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='删除管网';
$ec_lang['lpn_confirm_delete_network']='删除本项目中的所有节点、管道和文字标签？背景图片、项目名称和设置会保留。';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='查找与替换';
$ec_lang['lpn_find_title']='查找与替换';
$ec_lang['lpn_find_scope']='搜索范围';
$ec_lang['lpn_find_scope_all']='全部';
$ec_lang['lpn_find_property']='属性';
$ec_lang['lpn_find_condition']='条件';
$ec_lang['lpn_find_value']='数值';
$ec_lang['lpn_find_btn']='查找';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='在当前表格中过滤';
$ec_lang['lpn_find_filter_tip']='只在地图下方的某个表格中显示与此查询匹配的部分。绘图内容不会改变，也不会删除任何内容。';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}：{all} 个中的 {n} 个';
$ec_lang['lpn_find_filter_summary']='按 {q} 筛选。{rows}。';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='此查询不适用于任何表格。';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='包含';
$ec_lang['lpn_find_op_equals']='等于';
$ec_lang['lpn_find_op_gt']='大于';
$ec_lang['lpn_find_op_lt']='小于';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='为空';
// {n} is a whole number.
$ec_lang['lpn_find_count']='找到 {n} 个。点击其中之一即可跳转到该处。';
$ec_lang['lpn_find_shift_hint']='按住 Shift 点击可切换：若尚未选中则加入选择集，若已选中则从选择集中移除。';
$ec_lang['lpn_find_none']='未找到匹配项。';
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
$ec_lang['lpn_find_op_top']='最高 {n} 个';
$ec_lang['lpn_find_op_bottom']='最低 {n} 个';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='请输入要查找的内容。';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='连通性';
$ec_lang['lpn_find_prop_demand_desc']='该需水类别的说明';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='节点无连接线';
$ec_lang['lpn_find_op_conn_noopen']='节点无开放连接线';
$ec_lang['lpn_find_op_conn_nolinksource']='无连接线通往水源';
$ec_lang['lpn_find_op_conn_noopensource']='无开放路径通往水源';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='所有节点均已连接。';
$ec_lang['lpn_find_conn_no_fixed']='此管网没有水库或水箱，因此没有可到达的水源。只能搜索“节点无连接线”和“节点无开放连接线”。';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='同一个搜索，写成一行文字。更改上方的控件会重写这一行，而在这里输入内容也会更新那些控件。';
$ec_lang['lpn_find_query_label']='查询';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='用 AND、OR 和 () 组合条件';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='且';
$ec_lang['lpn_find_q_or']='或';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='下面的查询无法用控件表示，因此控件已被隐藏。';
$ec_lang['lpn_find_q_restore']='改用控件';
$ec_lang['lpn_replace_q_bad']='无法理解此查询，因此不会做任何更改。请先修正上面的内容。';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='（位于第 {n} 个字符）';
$ec_lang['lpn_find_q_err_empty']='查询为空，因此不会搜索任何内容。';
$ec_lang['lpn_find_q_err_scope']='没有名为 {w} 的搜索对象。请尝试以下之一：{list}';
$ec_lang['lpn_find_q_err_dot']='请在要搜索的对象与其属性之间加一个点，例如 节点.ID';
$ec_lang['lpn_find_q_err_prop']='不是 {scope} 的属性：{w}。请尝试以下之一：{list}';
$ec_lang['lpn_find_q_err_op']='不是 {prop} 可用的条件：{w}。请尝试以下之一：{list}';
$ec_lang['lpn_find_q_err_value']='此条件后面需要一个值：{op}';
$ec_lang['lpn_find_q_err_quote']='请给文本值加上引号：{w} 不是数字。';
$ec_lang['lpn_find_q_err_quote_end']='此引号文本缺少结束引号。';
$ec_lang['lpn_find_q_err_close']='此括号 ( 已打开但未闭合。';
$ec_lang['lpn_find_q_err_open']='此括号 ) 没有对应的开括号。';
$ec_lang['lpn_find_q_err_end']='此处不应再有内容。请用 {and} 或 {or} 连接两个搜索条件。';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='更改查找到的内容';
$ec_lang['lpn_replace_prop']='要更改的属性';
$ec_lang['lpn_replace_value']='新数值';
$ec_lang['lpn_replace_source']='新值来源';
$ec_lang['lpn_replace_asked']='已为 {n} 个节点请求高程。结果正在返回中。';
$ec_lang['lpn_replace_btn']='替换';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='要更改 {n} 个元件吗？';
$ec_lang['lpn_replace_apply']='更改它们';
$ec_lang['lpn_replace_done']='已更改 {n} 个元件。您可以一步撤销此操作。';
$ec_lang['lpn_replace_none']='不会有任何更改。';
$ec_lang['lpn_replace_no_value']='请输入新数值。';
$ec_lang['lpn_replace_scope']='请在上方选择要更改数值的一种元件。';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='剖面图';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_tip']='沿贯穿管网的一条路线，绘制地面和水力坡降线。';
$ec_lang['lpn_profile_title']='沿路线的剖面图';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='点击路径起点的节点。';
$ec_lang['lpn_profile_draw_more']='在地图上移动以查看路径。点击节点将其加入路径。双击完成。按 Esc 取消。';
$ec_lang['lpn_profile_draw_blocked']='没有从 {a} 到 {b} 的路径。请选择其他节点。';
$ec_lang['lpn_profile_tap_start']='点按路径起点的节点。';
$ec_lang['lpn_profile_tap_more']='点按节点以查看路径。长按将其加入路径。双击完成。再次点按"剖面图"以取消。';
$ec_lang['lpn_profile_say_idle']='再次点按"剖面图"以在地图上选择新路径。';
$ec_lang['lpn_profile_none']='尚无路径。再次点按"剖面图"以在地图上选择一条。';
$ec_lang['lpn_profile_choose']='请选择一个起点节点和一个终点节点。';
$ec_lang['lpn_profile_no_path']='这两个节点之间没有任何路线相连。';
$ec_lang['lpn_profile_no_solve']='尚无求解结果，因此只绘制了地面线。';
$ec_lang['lpn_profile_summary']='节点数：{n}，长度：{len} {u}';
$ec_lang['lpn_profile_axis_station']='沿路线的距离（{u}）';
$ec_lang['lpn_profile_axis_elev']='高程与水头（{u}）';
$ec_lang['lpn_profile_ground']='地面';
$ec_lang['lpn_profile_hgl']='水力坡降线';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='编辑';
$ec_lang['lpn_profile_edit_tip']='更改路线的一端，或从路线上去掉一个节点，而无需重新绘制整条路线。';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='拖动路线上的任意一点即可移动它。点击您添加的某个点即可将其从路线上去掉。';
$ec_lang['lpn_profile_edit_tap']='拖动路线上的任意一点即可移动它。点按您添加的某个点即可将其从路线上去掉。';
$ec_lang['lpn_profile_edit_nowhere']='路线上的点必须是一个节点。路线未被更改。';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='已保存的路线';
$ec_lang['lpn_profile_new']='新建保存的路线…';
$ec_lang['lpn_profile_new_name']='路线 {n}';
$ec_lang['lpn_profile_rename']='重命名路线…';
$ec_lang['lpn_profile_delete']='删除路线';
$ec_lang['lpn_profile_prompt_name']='此路线的名称';
$ec_lang['lpn_profile_delete_confirm']='删除保存的路线“{name}”？图纸本身不会被更改。';
$ec_lang['lpn_profile_none_saved']='尚无已保存的路线';
$ec_lang['lpn_profile_missing']='已保存的路线“{name}”使用了本项目中不存在的节点：{ids}';
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
$ec_lang['lpn_ts_menu']='时间序列';
$ec_lang['lpn_ts_tip']='在一次延时模拟中，绘制一个或多个元件随时间变化的图形。';
$ec_lang['lpn_ts_title']='数值随时间变化';
$ec_lang['lpn_ts_group_tip']='图中显示的是节点还是连接线。';
$ec_lang['lpn_ts_group_nodes']='节点';
$ec_lang['lpn_ts_group_links']='连接线';
$ec_lang['lpn_ts_quantity_tip']='要绘制哪个数值随时间变化的图形。';
$ec_lang['lpn_ts_add']='添加所选';
$ec_lang['lpn_ts_add_tip']='将地图上当前所选的全部内容都加入图中。';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='地图上未选中该类元件。';
$ec_lang['lpn_ts_clear']='全部移除';
$ec_lang['lpn_ts_chip_tip']='将 {id} 从图中移除';
$ec_lang['lpn_ts_none']='目前没有可绘制的内容。请在地图上选择元件，然后按“添加所选”。';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='尚无延时模拟结果。请按“计算”运行模拟。';
$ec_lang['lpn_ts_summary']='元件数：{n}，报告时刻数：{steps}';
$ec_lang['lpn_ts_axis_time']='经过时间';
$ec_lang['lpn_freq_menu']='频率';
$ec_lang['lpn_freq_tip']='绘制某一属性在当前时间步下，所有节点或所有管道上的频率分布图。';
$ec_lang['lpn_freq_title']='数值分布';
$ec_lang['lpn_freq_group_tip']='图中显示的是节点还是管道。';
$ec_lang['lpn_freq_quantity_tip']='要绘制哪个数值的图形。';
$ec_lang['lpn_freq_none']='该数值尚无结果，因此无内容可绘制。';
$ec_lang['lpn_freq_summary']='已绘制：{n}（共 {total}）';
$ec_lang['lpn_freq_summary_time']='已绘制：{n}（共 {total}），时刻：{time}';
$ec_lang['lpn_freq_axis_percent']='低于该值的百分比';
$ec_lang['lpn_view_units']='单位';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='全部保存';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='项目{n}';
$ec_lang['lpn_project_copy_suffix']='（副本）';
$ec_lang['lpn_project_rename']='重命名';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='新建项目…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='新建项目';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='坐标系';
$ec_lang['lpn_new_coordsys_tip']='选择您管网的坐标系。此选择是永久性的；将管网转换为不同坐标的唯一方法是使用"文件"、"在地图上打开 xy 文件…"，且转换结果是近似值。';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='本地、示意性或自定义';
$ec_lang['lpn_new_coordsys_local_tip']='未配准。可附加您自己的背景图片，或不附加任何图片。';
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
$ec_lang['lpn_crs_view']='按地图视图筛选';
$ec_lang['lpn_crs_view_tip']='仅显示覆盖当前地图所显示位置的投影。关闭此项可查看完整列表。';
$ec_lang['lpn_crs_place']='地名搜索';
$ec_lang['lpn_crs_place_tip']='输入城镇、地址或地标名称，地图视图会移动到该处。您输入的文字会发送到 OpenStreetMap 的地名服务，首次使用时会请求您的许可。新建的地理项目也会从这里查找到的地点开始。';
$ec_lang['lpn_crs_search']='搜索';
$ec_lang['lpn_crs_name']='投影名称筛选';
$ec_lang['lpn_crs_name_tip']='仅显示名称或 EPSG 代码中包含您所输入内容的投影。可以尝试输入带号、UTM 或 Mercator。';
$ec_lang['lpn_crs_list_tip']='经过以上两项筛选后剩下的投影。选择一项后点击"选择"。';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='尚未搜索任何地点，因此显示完整列表。请在上方搜索地点，或缩放地图以缩小范围。';
$ec_lang['lpn_crs_count']='已列出 {total} 个投影中的 {n} 个。';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{total} 个坐标系中有 {n} 个覆盖本管网。';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='（无地图）';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} 是所列坐标系中少数没有可用投影信息的一种。这意味着世界地图、地名搜索和 DEM 高程功能都无法使用，但您的坐标不受影响。';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='未命名';
$ec_lang['lpn_crs_none']='未配准';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='项目会保留自己的单位设置，因此这一选择只属于该项目本身，不会作为浏览器设置保存。若要让新项目按特定方式开始，请将一个空项目保存为模板，并在每次需要时复制它。';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='杭州市西湖区';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='创建';
$ec_lang['lpn_file_open']='打开…';
$ec_lang['lpn_file_save']='保存';
$ec_lang['lpn_file_saveas']='另存为…';
$ec_lang['lpn_file_revert']='还原';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='最近使用的文件';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='再次打开 {file}，无需在电脑中查找该文件。';
$ec_lang['lpn_recent_denied']='未获得打开该文件的权限，因此未能打开。';
$ec_lang['lpn_recent_gone']='无法打开 {file}。它可能已被移动、重命名或删除，因此已从最近列表中移除。';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='新建项目';
$ec_lang['lpn_tab_all']='全部项目';
$ec_lang['lpn_tab_menu']='项目菜单';
$ec_lang['lpn_tab_duplicate']='复制';
$ec_lang['lpn_tab_move_left']='左移';
$ec_lang['lpn_tab_move_right']='右移';
$ec_lang['lpn_tab_unsaved']='尚未保存到文件';
$ec_lang['lpn_import_bad_file']='该文件无法作为本页面保存的项目读取。';
$ec_lang['lpn_import_no_room']='浏览器存储空间不足，无法添加该项目。请删除一个不再需要的项目后重试。';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='确定';
$ec_lang['lpn_file_import_menu']='导入…';
$ec_lang['lpn_file_import_inp']='导入 EPANET 文件…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='从 EPANET 文件中读取管网，可以是 .inp 文本文件，也可以是 EPANET 保存的 .net 文件，并将其作为新项目保存在本浏览器中。';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='导出 EPANET 文件…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='将此管网写入 EPANET .inp 文件并下载。您输入的数字会按原样精确写出。.inp 格式无法保存的内容会在之后列给您看。';
$ec_lang['lpn_status_inp_exported']='已导出 {file}。';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='有 {n} 项内容是 .inp 格式无法保存的。';
$ec_lang['lpn_inp_export_refused']='此项目无法写入为 EPANET 文件：{detail}';
$ec_lang['lpn_inp_bad_file']='该文件无法作为 EPANET 管网文件读取。';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='这看起来是一个 EPANET .net 文件，但本页面无法读取它。请在 EPANET 中打开它，使用其中的"文件"、"导出"、"管网"命令另存为 .inp 文件，然后再导入该文件。';
$ec_lang['lpn_inp_report_heading']='已导入 {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} 个节点、水库和水箱，{links} 条管道、水泵和阀门，单位为 {units}。';
$ec_lang['lpn_inp_report_clean']='文件中的全部内容均已成功导入，没有遗漏。';
$ec_lang['lpn_inp_report_label_anchor']='文字标签的定位方式与 EPANET 相同，均以左上角为基准点。';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='EPANET 文件不含坐标系，因此该文件起初不会经过配准。要将其放到世界地图上，请使用“地图”、“世界地图…”；要转换其坐标，请使用“文件”、“转换为…”';
$ec_lang['lpn_inp_report_lead']='本页面并未使用 EPANET 的全部功能，但您文件中的内容都不会被丢弃。以下是您文件中被保留但未被使用的内容，以及文件读入时发生的更改：';
$ec_lang['lpn_inp_drop_headloss']='该文件未使用 Hazen-Williams 公式。本页面按 Hazen-Williams 公式计算，因此管道糙率数值已按原样保留，但这里得到的结果将与 EPANET 中的结果不一致。';
$ec_lang['lpn_inp_drop_tank_curve']='这些水箱不是直壁的：文件以曲线形式给出其形状。该曲线被保存在“库”框中，水箱仍引用它，延时模拟会按该曲线给出的规律为水箱充水和放水。单一时刻的结果两种情况相同，因为水面标高就是文件设定的水位。文件中所写的直径会与曲线一同保留，并作为该水箱在没有曲线时的绘制和求解依据。';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='这些节流阀（TCV）已作为节流阀导入，保留了文件中给定的相同损失。两种求解器均可对其求解。';
$ec_lang['lpn_inp_drop_valve_active']='这些阀门用于控制压力或流量，会随水流变化自行开闭。导入过程中未丢失任何设定，本页面将使用 EPANET 求解器对其求解，并为该管网自动启用该求解器。';
$ec_lang['lpn_inp_drop_valve']='这些阀门是按曲线或固定压降来描述的，而本页面没有这样的元件类型。它们被作为开放管道导入，因此管网仍然连通，但那里不再有任何东西控制压力或流量。';
$ec_lang['lpn_inp_drop_cv']='在 EPANET 中，这些管道只允许水单向流动。它们已作为普通管道导入，因此水现在可能双向流动。';
$ec_lang['lpn_inp_drop_demands']='这些节点原有多个需水量。这些需水量已合并为本页面所支持的单一需水量。';
$ec_lang['lpn_inp_drop_patterns']='本页面未读取需水模式，因为其中用于运行延时模拟的部分未能加载。每个需水量均为文件中写明的数值。';
$ec_lang['lpn_inp_drop_demand_pattern']='这些节点的需水量会在运行过程中变化。它们的模式已完整导入，您看到的需水量是时钟当前所指时刻对应的数值。';
$ec_lang['lpn_inp_drop_emitters']='这些节点带有喷洒或漏损系数。该系数已被保留并参与求解，但本页面目前尚无法查看或修改它。';
$ec_lang['lpn_inp_drop_curve_long']='该水泵曲线超过三个点。已保留其最低点、中间点和最高点，因为本页面最多按三个点拟合曲线。';
$ec_lang['lpn_inp_drop_curve_missing']='该水泵引用了一条不在文件中的曲线。该水泵已导入为无曲线，因此不产生水头。';
$ec_lang['lpn_inp_drop_pump_other']='此水泵是按其消耗的功率来描述的，而不是按曲线描述。导入时没有曲线，因此它不会产生水头。';
$ec_lang['lpn_inp_drop_head_pattern']='这些水库的水位会在运行过程中升降变化。它们的模式已完整导入，您看到的水位是时钟当前所示时刻的水位。';
$ec_lang['lpn_inp_drop_pump_speed']='这些水泵的运行转速与其曲线测定时的转速不同，或在运行过程中转速会发生变化。转速及其模式已完整导入，您看到的水头是时钟当前所示时刻的水头。';
$ec_lang['lpn_inp_drop_setting']='这些管道、水泵和阀门带有本页面无法保存的设定值。它们已被导入为开放状态。';
$ec_lang['lpn_inp_drop_rules']='此文件包含基于规则的控制。本页面会读取并使用它们。使用 EPANET 引擎运行模型后，这些规则会被执行，其中的每一个水位、压力和流量都会换算为本项目当前显示的单位。请在“库”下打开“规则”来查看或修改其中一条。它们会按文件中原本的写法完整保留，如果您保存为 EPANET 文件，也会被写回。';
$ec_lang['lpn_inp_drop_eps']='此文件描述了一次延时模拟。本页面用于运行延时模拟的部分未能加载，因此只导入了初始条件。';
$ec_lang['lpn_inp_drop_quality']='此文件描述了水质在传输过程中如何变化：水中最初含有什么，以及该物质在管道和水箱中反应的速度。本页面会读取并使用这些数值。请在“设置”、“计算”、“水质”下选择一种化学物质，然后使用 EPANET 引擎运行模型，浓度就会随着运行沿管网被逐步计算出来。这些内容会被保留，如果您保存为 EPANET 文件，也会被写回。';
$ec_lang['lpn_inp_drop_sources_mixing']='此文件说明了化学物质在管网中投加的位置，以及水箱中水的混合方式。投加量显示在被投加的节点上，水箱则说明其采用的混合模型。投加量和混合模型均只能由 EPANET 引擎计算。';
$ec_lang['lpn_inp_drop_energy']='此 EPANET 文件包含水泵运行成本模型数据。本页面会读取并使用这些数据。使用 EPANET 引擎运行模型后，打开“水务”、“报告”、“水泵能耗”，即可查看每台水泵的运行时长、所耗功率、用电量及相应费用。这些内容会被保留，如果您保存为 EPANET 文件，也会被写回。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='此文件为部分节点、管道或其他元件设置了标记。每个标记都已完整导入，并保存在各自元件的属性中，您可以在那里查看或修改它。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='此文件包含 EPANET 自身用于设置其打印报告格式的选项。您可以在此处的“报告”、“EPANET 运行”下查看引擎的报告，但它会按引擎的标准格式输出，而不是按这些设置所要求的格式。这些内容会被保留，如果您保存为 EPANET 文件，也会被写回。';
$ec_lang['lpn_inp_drop_sections']='此文件包含一个本页面完全不读取的部分。这里不会用到它。它会被完整保留，如果您保存为 EPANET 文件，会被写回。';
$ec_lang['lpn_inp_drop_quality_options']='此文件设置了 EPANET 的水质选项：Quality 选项（指定水质分析的种类），以及两项与化学物质相关的设置——相对扩散系数和水质容差。这三项均会被保留并被使用。水龄、来源追踪和化学物质均在本页面计算，其中两项化学物质设置会在您运行化学物质分析时交给 EPANET 引擎。如果您保存为 EPANET 文件，全部内容都会被写回。';
$ec_lang['lpn_inp_drop_file_options']='此文件引用了一个辅助文件：Map（保存坐标），或 Hydraulics（保存已经算好的水力结果）。本页面无法打开这两种文件，因此这些行会保持原样，并在您保存为 EPANET 文件时被写回。';
$ec_lang['lpn_inp_drop_demand_model']='此文件要求进行压力驱动分析（PDA），即节点在压力较低时获得的水量会少于其需水量。本页面采用需水量驱动的方式求解，因此这里的每个节点都会获得文件中写明的全部需水量，无论最终压力是多少。该行会被保留，如果您保存为 EPANET 文件，会被写回。';
$ec_lang['lpn_inp_drop_other_options']='此文件设置了本页面不读取的选项。这里不会用到它们。它们会被保留，并在您保存为 EPANET 文件时被写回。';
$ec_lang['lpn_inp_drop_net_options']='此 EPANET .net 文件设置了本页面没有对应控件的选项，因此它们的数值列在此处，而不会被本页面采用。其余内容均已导入。如果您需要这些设置，请在 EPANET 中打开该文件，使用“文件”、“导出”、“网络”将其另存为 .inp 文件，然后导入该文件。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='这是一个 EPANET .net 文件。这是 EPANET 自己的项目文件格式，没有公开的说明文档，本页面是通过分析示例文件摸索出该格式来读取它的，因此只应在别无选择时使用，而非作为可靠途径。.inp 文件才是有文档记录、每个程序都能读取的格式：请在 EPANET 中使用“文件”、“导出”、“网络”生成一个 .inp 文件，并尽量改为导入该文件。';
$ec_lang['lpn_inp_drop_backdrop']='该文件指定了一张背景图片，但未包含图片本身。请使用"文件"、"背景图片"、"添加图片"自行添加。';
$ec_lang['lpn_inp_drop_dangling']='这些管道所指定的节点不在文件中，因此未被导入。';
$ec_lang['lpn_inp_drop_units']='该文件中标明的流量单位不是本页面已知的单位，因此所有数值均按加仑每分钟读取。请在使用结果前核对每一个数值。';
$ec_lang['lpn_inp_drop_anchor_missing']='此文本原本附着在文件中不存在的节点、水库或水箱上。它已作为独立文本导入到文件所标注的位置，现在不再依附于任何对象。';
$ec_lang['lpn_import_notes_heading']='此项目是从 EPANET 文件读入的。该文件中的部分内容会被保留，但本页面不会使用它们。';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='已从文件打开 {name}，并将其作为新项目添加到本浏览器中。';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='项目文件';
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
$ec_lang['lpn_file_upload_explain']='本浏览器无法连接到文件，因此在此打开文件其实是一次上传：项目会被复制到本浏览器中，唯一将成果写回该文件的方法是使用"文件"、"另存为"覆盖该文件。';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='打开从本页面保存的项目文件。';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='保存到已连接的文件。';
$ec_lang['lpn_file_saveas_tip']='选择要保存到的文件。此项目将连接到该文件，此后"保存"会写入该文件。';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='使用浏览器的下载设置进行保存。本浏览器无法连接到文件，因此"保存"不可用，只能使用"另存为"。若开启浏览器的"每次下载前询问保存位置"设置，即可选中原文件将其覆盖。';
$ec_lang['lpn_status_uploaded']='项目文件已上传。无法与其保持连接，因此唯一写回该文件的方法是使用"文件"、"另存为"。';
$ec_lang['lpn_status_downloaded']='已下载 {file}。本浏览器无法连接到文件，因此该项目仍标记为尚未保存到文件。';
$ec_lang['lpn_status_file_opened']='已打开 {file}。';
$ec_lang['lpn_status_already_open']='该文件已在此处以 {name} 打开，因此已切换到该项目，而非再打开一份副本。';
$ec_lang['lpn_status_already_open_dirty']='该文件已在此处以 {name} 打开，且含有尚未保存到该文件的更改。已切换到该项目，而非再打开一份副本。如需改用磁盘上的版本，请使用"文件"、"还原"。';
$ec_lang['lpn_status_saved']='已保存 {file}。';
$ec_lang['lpn_status_reverted']='已从磁盘重新载入 {file}。';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='关闭前是否将更改保存到 {name}？';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} 仅保存在本浏览器中。若不将其保存到文件即关闭，它将永久丢失。';
$ec_lang['lpn_close_discard']='不保存并关闭';
$ec_lang['lpn_cancel']='取消';
$ec_lang['lpn_revert_confirm']='放弃您所做的更改，并从磁盘重新载入 {file}？';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='此项目来自 {file}，但与该文件的连接已丢失。请重新选择该文件以恢复连接。';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='无法写入该文件。它可能已被移动或重命名，或写入权限已被撤销。您的成果仍保存在本浏览器中。';
$ec_lang['lpn_file_changed_elsewhere']='自您打开此文件以来，其他人已保存过它，因此现在保存会覆盖对方的成果。使用"文件"、"另存为"将您的更改保存到您自己的文件中，或使用"文件"、"还原"放弃您的更改并载入对方的版本。';
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
$ec_lang['lpn_lock_somebody']='其他人';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} 已打开此文件。';
$ec_lang['lpn_lock_open_readonly']='以只读方式打开';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='解除锁定';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='此文件似乎正在被使用。';
$ec_lang['lpn_lock_open_care']='为避免数据丢失，请从下面的选项中谨慎选择。';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='它已被使用了 {x}。';
$ec_lang['lpn_lock_age_edited']='它最后一次编辑是在 {x} 前。';
$ec_lang['lpn_lock_age_saved']='它最后一次保存是在 {x} 前。';
$ec_lang['lpn_lock_age_never_saved']='此文件尚未保存过任何内容。';
$ec_lang['lpn_lock_age_unknown']='没有记录显示它已被使用多久，或最后一次保存或编辑的时间。';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='“询问”会告诉正在打开此文件的人您想要使用它，除此之外不改变任何内容。“以只读方式打开”让您可以查看它并随意更改任何内容，但无法保存到这里。“解除锁定”让您可以保存并覆盖此文件；对方尚未保存的工作不会丢失，但他们将无法再保存到这里，可能需要有人手动合并两者。';
$ec_lang['lpn_lock_ask']='询问';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='应该说是谁在询问？使用您的姓名缩写最为合适。它会随此文件的锁一起保存在我们的服务器上，供正在打开此文件的人查看，并在 30 天内删除。';
$ec_lang['lpn_lock_ask_sent']='我们已请求正在打开此文件的人将其关闭。如果对方的页面仍处于打开状态，他们会在一分钟内看到请求。其他一切均未改变，在对方关闭之前，此文件仍归他们使用。';
$ec_lang['lpn_lock_ask_failed']='您的消息未能送达。可能目前没有人打开此文件，也可能是无法连接到服务器。';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='该文件未被打开，此处也未发生任何改变。其他人仍在打开它。';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} 想要编辑此文件。请在准备好后保存您的工作，并使用“文件”、“关闭项目”将其移交。';
$ec_lang['lpn_ago_seconds']='{n} 秒';
$ec_lang['lpn_ago_minutes']='{n} 分钟';
$ec_lang['lpn_ago_hours']='{n} 小时';
$ec_lang['lpn_ago_days']='{n} 天';
$ec_lang['lpn_ago_unknown']='未知时长';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='消息';
$ec_lang['lpn_msglog_heading']='最近的消息';
$ec_lang['lpn_msglog_empty']='尚无消息。';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} 前';
$ec_lang['lpn_msglog_note']='最新的排在最前。本页面在打开期间保留最近 {n} 条消息，且不在您的计算机上保存任何内容。';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='只读：{name} 已打开此文件。您可以在此随意更改任何内容，但无法保存。请使用"文件"、"另存为"保存到其他文件。';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='请注意：无法连接服务器以检查或创建此项目的锁定，因此没有任何机制阻止同事同时编辑同一文件。若锁定功能恢复正常，系统会通知您。';
$ec_lang['lpn_lock_storage_error']='请注意：本站点无法保存锁定记录，因此没有任何机制阻止同事同时编辑同一文件。这是服务器端的配置问题，您在此处无法修复——锁定文件夹对 Web 服务器不可写。';
$ec_lang['lpn_lock_full_error']='请注意：本站点记录项目打开状态的空间已用尽，因此没有任何机制阻止同事同时编辑同一文件。这是服务器端的配置问题，您在此处无法修复。';
$ec_lang['lpn_lock_not_asked']='此项目未启用锁定功能，因此没有任何机制阻止同事同时编辑同一文件。该项目尚无标识符，将其保存到文件即可获得一个。';
$ec_lang['lpn_lock_restored']='锁定功能已恢复正常，此文件现在可供您保存。';
$ec_lang['lpn_lock_dismiss']='隐藏此消息';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='您的项目将保存在本电脑上的一个文件中。它只在您主动要求时才会保存，其他任何时候都不会，因此不会有内容在您不知情的情况下被写入该文件。';
$ec_lang['lpn_file_training_2']='为避免两人同时编辑同一文件，本站点会记录该文件当前是谁打开的。若已有人打开，您仍可以打开并查看，或保留一份自己的副本。';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='首次保存时，浏览器会询问是否允许本站点编辑该文件。这个提问来自浏览器本身，而非我们，回答"是"才能让"保存"把您的成果写回该文件。通常每个文件只会询问一次。';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='继续';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='重新选择该文件';
$ec_lang['lpn_file_reconnect']='重新连接该文件';
$ec_lang['lpn_file_reconnect_alert']='此项目来自 {file}。浏览器需要您再次授权才能写入该文件。请在下方重新连接。';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='这与他人已打开的文件相同，因此无法保存覆盖。请选择其他文件或其他名称。';
$ec_lang['lpn_saveas_overwrites_project']='该文件已保存了另一个项目 {name}。在此保存将完全覆盖它。是否继续？';
$ec_lang['lpn_saveas_overwrites_newer']='自您上次查看以来该文件已发生变化，几乎可以肯定是其他人已保存过它。在此保存将用您的版本覆盖对方的版本。是否继续？';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='此项目的名称';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='已关闭 {closed}。当前显示 {opened}。';
$ec_lang['lpn_status_closed_empty']='已关闭 {closed}。已新建一个空项目。';
$ec_lang['lpn_storage_full']='未保存。浏览器存储空间已满或不可用，因此关闭此标签页时您近期的更改将丢失。';
$ec_lang['lpn_storage_unreadable']='未保存。此项目无法从浏览器存储中读取。其存储的副本将保持原样，不会被覆盖，因此此标签页中的内容不会被保存。请打开一个文件或新建一个项目以继续操作。';
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
$ec_lang['lpn_about_credits']='致谢';
$ec_lang['lpn_help_welcome']='欢迎页面';
$ec_lang['lpn_about_license']='根据 GNU 通用公共许可证 v3.0 或更高版本授权。';
$ec_lang['lpn_notes_1_term']='求解方式';
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
$ec_lang['lpn_notes_1_def']='每个时刻都采用与 EPANET 相同的全局梯度算法求解。设置总运行时长后，EPANET 求解器会依次算出每个报告时刻：水箱充放水，需水量随各自的模式变化，工具栏可播放整个运行过程。内置求解器一次只计算一个时刻，并让每个水箱保持在其起始水位。';
$ec_lang['lpn_notes_2_term']='本工具不做的事';
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
$ec_lang['lpn_notes_2_def']='水质化学反应未建模；水龄和来源追踪已建模。关于阀门：节流阀（TCV）在两种求解器下均可使用，而能自行设定开度的阀门（PRV、PSV、FCV）由 EPANET 求解器求解，当管网中含有此类阀门时，本页面会自动启用该求解器。';
$ec_lang['lpn_notes_3_term']='保存项目';
$ec_lang['lpn_notes_3_def']='每个项目对应一个标签页，且在您操作时即保存在本浏览器中。清除浏览器数据会将它们全部删除，因此请把成果保存到文件中：使用"文件"、"另存为"。标签页上的星号表示其中含有尚未保存到文件的更改。除非您主动要求，否则不会有任何内容写入文件。在部分浏览器中，项目会连接到您保存的文件，此后"文件"、"保存"会写回该文件；在另一些浏览器中无法建立此连接，因此"保存"不可用，只能使用"另存为"。当项目文件保存在共享磁盘上时，本页面会提示您该文件是否已被同事打开，以避免两人互相覆盖成果。';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='水泵曲线';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='水泵遵循 H = H₀ − aQ^b，其中 H 是水泵增加的水头，Q 是通过水泵的流量。可输入制造商曲线上的一个、两个或三个点。三个点——零流量时的水头、正常工作点和最大流量点——可直接拟合出 H₀、a 和 b，最贴合已发布的曲线。两个点则拟合出顶点在零流量处的抛物线（b = 2）。若只输入一个点，则按常用经验法则处理：零流量水头取所输入水头的 1.33 倍，最大流量取所输入流量的 2 倍，同样得到 b = 2。未输入任何点的水泵不增加任何水头。曲线在水头降至零时不会被截断，因此若要求水泵输出超出其曲线上限的流量，会得到负的水头。解决办法是换用更大的水泵或降低需水量，而不是更换拟合曲线的方式。一条曲线可以保存三个以上的数据点，您所给出的每一个点都会被读取。';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='本页面还提供';
$ec_lang['lpn_notes_4_def']='项目可以放置在真实地面上，背后绘有街道地图。EPANET .inp 文件既可以读入，也可以写出。底部面板可沿一条路线绘制剖面图，并列出沿线的节点。元件可以按其计算结果着色，“查找”功能可以找出所有满足您设定条件的元件。';
$ec_lang['lpn_notes_6_term']='表格列帮助';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>选择列</td><td>点击表头</td></tr><tr><td>添加或扩展列选择</td><td>Ctrl+click 或 Shift+click 另一个表头</td></tr><tr><td>移动（重新排列）所选的列</td><td>拖动，或在右键菜单或 ⋮ 菜单中使用“管理列…”</td></tr><tr><td>⋮ 菜单和排序箭头。</td><td>将指针悬停在表头的右上角，或选中表头或按 Tab 键移入表头</td></tr><tr><td>隐藏、显示全部或管理可见性与顺序</td><td>右键点击表头，或点击表头右上角的 ⋮ 菜单</td></tr><tr><td>按列排序</td><td>表头右上角的箭头图标</td></tr><tr><td>粘贴为表格末尾的新行</td><td>右键点击、表头右上角的 ⋮ 菜单，或 Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='表格键盘快捷键';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>方向键</td><td>移动。</td></tr><tr><td>Tab、Enter</td><td>完成输入并向右/向下移动一个单元格。</td></tr><tr><td>Shift+Tab、Shift+Enter</td><td>向反方向移动。</td></tr><tr><td>Shift+方向键</td><td>扩展选区。</td></tr><tr><td>Ctrl+C</td><td>复制所选内容。</td></tr><tr><td>Ctrl+D</td><td>用选区顶行的内容向下填充选区。</td></tr><tr><td>Ctrl+Enter</td><td>用活动单元格的数值填充选区。</td></tr><tr><td>Ctrl+A</td><td>选中整个表格。</td></tr><tr><td>Ctrl+Shift+V</td><td>粘贴为表格末尾的新行。</td></tr><tr><td>Ctrl+Shift+PageDown、Ctrl+Shift+PageUp</td><td>切换到下一个或上一个标签页，无论是表格还是图形。</td></tr><tr><td>Delete</td><td>清空单元格。</td></tr><tr><td>F2</td><td>打开单元格进行编辑。</td></tr><tr><td>Esc</td><td>取消编辑。</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='颜色区间的边界值保持不变';
$ec_lang['lpn_notes_color_def']='颜色区间的边界值在您选择数据分类方法时设定，此后不会随每个时间步重新设定，因为那样会使颜色在每个时刻代表不同的含义，不利于直观了解您的系统。EPANET 也采用同样的方式。若要获得新的边界值，请重新选择一种方法，或自行输入边界值。';
$ec_lang['lpn_notes_epanet_term']='Hazen-Williams 常数已与 EPANET 一致';
$ec_lang['lpn_notes_epanet_def']='2026 年 8 月，Hazen-Williams 系数和指数已调整为与 EPANET 一致。水头损失结果与本页面早期版本相比最多相差 0.1%，这远小于 C 值本身的不确定性。';
$ec_lang['lpn_notes_engine_term']='本页面运行的 EPANET 版本';
$ec_lang['lpn_notes_engine_def']='本页面使用的 EPANET 求解器是 OWA-EPANET 2.3.5，发布于 2025 年 2 月 20 日。EPANET 由 Open Water Analytics 社区开发，该社区与美国环境保护局合作，后者于 2019 年 12 月发布了 2.2.0 版。运行报告中显示为 2.3.05，是因为引擎将最后一位数字写成两位。它通过 Luke Butler 基于 MIT 许可证发布的 epanet-js 0.9.0 接入本页面，并在您的浏览器内运行：您的管网从不会被发送到别处求解。';
$ec_lang['lpn_id_invalid']='请输入不含空格和引号的 ID。';
$ec_lang['lpn_id_taken']='该 ID 已被使用。';
$ec_lang['lpn_diag_no_fixed_head']='请添加一个水库或水箱。管网在求解前需要至少一个已知水位。';
$ec_lang['lpn_diag_dangling_link']='有管道或水泵连接到一个已不存在的节点：';
$ec_lang['lpn_diag_unreachable']='以下节点没有通往水库的路径：';
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
$ec_lang['lpn_engine_fetching']='正在获取 EPANET 求解器。它只需下载一次，此后会保存在本设备上，因此之后可以离线使用。';
$ec_lang['lpn_engine_ready']='EPANET 求解器现已保存在本设备上，可以离线使用。';
$ec_lang['lpn_engine_fetching_valve']='正在获取 EPANET 求解器，以便现在求解此阀门，并在以后离线使用。';
$ec_lang['lpn_engine_ready_valve']='EPANET 求解器现已保存在本设备上。能够自动开闭的阀门此后可以离线求解。';
$ec_lang['lpn_engine_unavailable']='无法获取 EPANET 求解器，而它正是用于求解能够自动开闭的阀门。请连接一次互联网，此后它就会保存在本设备上。';
$ec_lang['lpn_engine_needed_loading']='正在加载 EPANET 求解器，您可以继续绘制。加载完成后即可获得结果。';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='求解器加载进度';
$ec_lang['lpn_engine_wait']='正在加载求解器。结果会稍有延迟。您可以继续操作。';
$ec_lang['lpn_engine_wait_pct']='求解器已加载 {percent}%。';
$ec_lang['lpn_engine_wait_bytes']='求解器目前已加载 {kb} KB。总大小未知，因此无法得知完成百分比。';
$ec_lang['lpn_engine_needed_failed']='EPANET 求解器尚未加载，目前也无法加载，而此管网只能由它求解。连接互联网后即可加载。';
$ec_lang['lpn_diag_valve_needs_epanet']='以下阀门会自行开闭，只有 EPANET 求解器才能计算它们。由于无法加载 EPANET 求解器，缺少这些结果：';
$ec_lang['lpn_diag_valve_on_fixed_head']='以下阀门直接连接在水库或水箱上，而水库或水箱已经确定了该处的水位，因此阀门无可控制的对象。请在阀门与水库或水箱之间加入一段短管：';
$ec_lang['lpn_diag_not_converged']='未找到解。请检查是否存在现实中不可能出现的数值，例如管径为零。';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='求解未收敛。这些数字是最后一次试算的结果，不是答案。请勿使用。';
$ec_lang['lpn_diag_not_converged_trials']='在进行 {iterations} 次试算后停止。';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='在进行 {iterations} 次试算、相对误差为 {error} 后停止，未达到 {accuracy} 的精度设置。';
$ec_lang['lpn_field_roughness']='糙率';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Hazen-Williams C 值。数值越大表示管壁越光滑：新塑料管约为 150，新钢管或铸铁管约为 130，老旧管道约为 100。';
$ec_lang['lpn_field_length']='长度';
$ec_lang['lpn_field_from']='起点';
$ec_lang['lpn_field_to']='终点';
$ec_lang['lpn_field_length_tip']='管道的长度。开启"自动"时，长度按您绘制的图形测量得出。关闭"自动"可输入与图形不同的长度。';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='阀门类型';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='阀门的作用方式。节流阀维持固定的损失。其余三种维持某一压力或流量，会随水流变化而全开、关闭或部分关闭。更改类型会将下方设定值重置为新的初始数值，因为压力、流量与损失系数彼此并非同一物理量。';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='节流（TCV）';
$ec_lang['lpn_valve_type_prv']='减压（PRV）';
$ec_lang['lpn_valve_type_psv']='维压（PSV）';
$ec_lang['lpn_valve_type_fcv']='流量控制（FCV）';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='减压定值（PBV）';
$ec_lang['lpn_valve_type_gpv']='通用（GPV）';
$ec_lang['lpn_field_valve_setting_drop']='压力降';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='该阀门带走的压力。减压定值阀无论水流方向如何，始终恰好去除这一压力值。这是一个跨阀门的压力降，而不是要维持的压力值。';
$ec_lang['lpn_inp_drop_gpv_curve']='此阀门引用了一条不在文件中的水头损失曲线。该阀门已导入为无曲线，因此在您给它指定曲线之前将保持全开状态。';
$ec_lang['lpn_gpv_curve_source']='阀门水头损失曲线';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='“库”框中说明该阀门在各流量下损失多少水头的曲线。多个阀门可以使用同一条曲线，在那里编辑会同时改变它们全部。此阀门只保存对该曲线的引用；各数据点本身在“库”、“曲线”中读取和编辑。';
$ec_lang['lpn_field_valve_setting_pressure']='压力设定值';
$ec_lang['lpn_field_valve_setting_pressure_tip']='阀门维持的压力。减压阀（PRV）将其下游侧压力维持在此数值或以下；维压阀（PSV）将其上游侧压力维持在此数值或以上。';
$ec_lang['lpn_field_valve_setting_flow']='流量设定值';
$ec_lang['lpn_field_valve_setting_flow_tip']='阀门允许通过的最大流量。当所需通过的水量小于该值时，阀门保持全开，不产生任何损失。';
$ec_lang['lpn_field_valve_setting']='设定值';
$ec_lang['lpn_field_valve_setting_loss']='损失系数';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='节流阀（TCV）消除的水头，以流速水头的倍数计。阀门全开时取 0。该数值即为节流阀损失的全部。';
$ec_lang['lpn_field_valve_diameter_tip']='阀门通道开口的宽度。水流经过阀门的速度由此宽度算出，损失则由该流速决定。';
$ec_lang['lpn_field_valve_km_tip']='阀门全开时阀体本身造成的损失，叠加在阀门设定值所消除的损失之上，以流速水头的倍数计。忽略该项时取 0。';
$ec_lang['lpn_field_km']='局部损失系数，k';
$ec_lang['lpn_field_km_tip']='该管道上弯头、阀门和管件造成的损失，以流速水头的倍数计。直管无附件时取 0。';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='局部损失，k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='水泵水头曲线';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='“库”框中说明该水泵在各流量下增加多少水头的曲线。多个水泵可以使用同一条曲线，在那里编辑会同时改变它们全部。此水泵只保存对该曲线的引用；各数据点本身在“库”、“曲线”中读取和编辑。';
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
$ec_lang['lpn_field_desc']='说明';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='供您自己使用，例如街角位置或管道材质。它会随 EPANET 文件一同导入和导出，位于该部件所在行的末尾。任何计算都不会读取它。换行会变成空格，因为文件中没有地方可以保存换行符。';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='标记';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='标记可以表示您需要的任何含义，例如压力分区或工单编号。此处及 EPANET 中的任何计算都不会读取它。标记只能是一个词：EPANET 遇到第一个空格就停止读取，因此输入时会拒绝空格。它会随 EPANET 文件一同导入和导出。';
$ec_lang['lpn_pump_effic_curve']='水泵效率曲线';
$ec_lang['lpn_pump_effic_curve_tip']='“库”框中说明该水泵在各流量下效率高低的曲线。多个水泵可以使用同一条曲线，在那里编辑会同时改变它们全部。此水泵只保存对该曲线的引用；各数据点本身在“库”、“曲线”中读取和编辑。';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='未选择曲线';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='曲线';
$ec_lang['lpn_curve_library_link_tip']='打开“库”框的“曲线”部分，可在此添加、描述、编辑和删除曲线。元件本身只说明它使用哪条曲线。';
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
$ec_lang['lpn_curve_kind_head']='水泵水头';
$ec_lang['lpn_curve_kind_effic']='水泵效率';
$ec_lang['lpn_curve_kind_volume']='水箱容积';
$ec_lang['lpn_curve_kind_headloss']='阀门水头损失';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='未说明类型';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='容积';
$ec_lang['lpn_pump_effic_col']='效率';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='此水泵未选择效率曲线，因此按全网设定的效率 {percent} 运行。';
$ec_lang['lpn_pump_effic_unstated']='此水泵引用了名为 {name} 的效率曲线，但本项目中没有定义该曲线，因此按全网设定的效率 {percent} 运行。';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='模式：选择。点击某个元件或标签以查看或更改它。拖动可移动节点、折点或标签。使用“折点”工具可添加或删除管道上的弯折。';
$ec_lang['lpn_mode_delete']='模式：删除。点击某个元件即可将其移除。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='模式：折点。每条管道的所有折点都以小方块手柄的形式显示在地图上。点击管道可添加折点，点击手柄可删除它，或拖动手柄以移动它。此模式下地图上的其他内容不会改变。';
$ec_lang['lpn_mode_zoom_window']='模式：窗口缩放。在地图上点击一个方框的两个对角，或拖出一个方框，即可放大到该区域。';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='尚未选中任何内容。请先在地图上点击一个元件，然后按 Delete 键。';
$ec_lang['lpn_mode_add_junction']='模式：添加节点。点击地图以放置节点。切换到“选择”模式可更改或移动元件和标签。';
$ec_lang['lpn_mode_add_reservoir']='模式：添加水库。点击地图以放置水库。切换到“选择”模式可更改或移动元件和标签。';
$ec_lang['lpn_mode_add_tank']='模式：添加水箱。点击地图以放置水箱。切换到“选择”模式可更改或移动元件和标签。';
$ec_lang['lpn_mode_add_pipe']='模式：添加管道。点击一个节点，再点击另一个节点，将它们连接起来。点击中间的空白处可弯折管线，按 Escape 键可重新开始。切换到“选择”模式可更改或移动元件和标签。';
$ec_lang['lpn_mode_add_pump']='模式：添加水泵。点击一个节点，再点击另一个节点，将它们连接起来。点击中间的空白处可弯折管线，按 Escape 键可重新开始。切换到“选择”模式可更改或移动元件和标签。';
$ec_lang['lpn_mode_add_valve']='模式：添加阀门。点击一个节点，再点击另一个节点，将它们连接起来。点击中间的空白处可弯折管线，按 Escape 键可重新开始。切换到“选择”模式可更改或移动元件和标签。';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='模式：添加文字。点击地图以放置一个文字。点击靠近某节点的位置可将该文字附加到该节点。切换到“选择”模式可更改或移动元件和标签。';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='使用此模式可在地图上更改、移动和拖动内容。这是本页面默认返回的模式：在打开项目等某些操作之后，会自动回到此模式；在任何其他模式下按 [Esc] 键也会返回此模式。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='您可以拖动标签以移动它。双击标签可使其回到自动位置。';
$ec_lang['lpn_field_auto']='自动';
$ec_lang['lpn_method_switch_confirm']='更改摩擦计算方法不会改变您已在管道中输入的糙率数值，而某一方法下的糙率对另一方法而言没有意义。更改后请检查每条管道。仍要更改吗？';
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
$ec_lang['lpn_field_closed']='关闭';
$ec_lang['lpn_field_closed_tip']='关闭该管道，使水流无法通过。管道仍保留在图中并保留其所有数值，您可以随时重新打开它。';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='经度';
$ec_lang['lpn_field_lat']='纬度';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='北坐标';
$ec_lang['lpn_field_easting']='东坐标';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='北';
$ec_lang['lpn_field_easting_abbr']='东';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='纬';
$ec_lang['lpn_field_lon_abbr']='经';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='输入一个坐标位置可精确放置此节点。在某个方案中，此位置仅适用于该方案，与拖动的效果相同；在“基础”方案中，则会将该节点放置到所有位置。';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='该位置超出地图范围。伪墨卡托投影的纬度范围为 -85.05 至 85.05，经度范围为 -180 至 180。';
$ec_lang['lpn_field_text_size']='大小倍数';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='在所有缩放级别都显示';
$ec_lang['lpn_field_text_all_zoom_tip']='无论缩小到多远，都在图上保留此文字。取消勾选后，一旦视图宽度超过“地图和页面”中设置的标注阈值，此文字会与其他标签一同隐藏。';
$ec_lang['lpn_tool_labels']='标签';
$ec_lang['lpn_labels_heading_node']='节点标签';
$ec_lang['lpn_labels_heading_link']='连接线标签';
$ec_lang['lpn_labels_decimals_tip']='该标签显示的小数位数';
$ec_lang['lpn_labels_mark_extrema']='标出最高值和最低值';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='在地图上为每个已标注属性的最高值画一条线（上划线），为其最低值画一条线（下划线），使您无需逐一读数即可看出最高值和最低值。';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='应用到全部';
$ec_lang['lpn_settings_apply_to_all_tip']='已绘制的每一个此类元件的 ID 都会改为以此文字开头。每个元件都会保留其编号。ID 不以数字结尾的元件将保持不变。';
$ec_lang['lpn_confirm_apply_prefix']='将 {n} 个元件重命名，使其 ID 以 {prefix} 开头？每个元件都会保留其编号。';
$ec_lang['lpn_prefix_applied']='已重命名 {n} 个元件。另有 {skipped} 个未作更改。';
$ec_lang['lpn_labels_prefix_tip']='添加在该属性前面的地图标签文字';
$ec_lang['lpn_labels_suffix_tip']='添加在该属性后面的地图标签文字';
$ec_lang['lpn_labels_suffix_gradient_tip']='添加在地图标签中水力坡降后面的文字。请勿在此输入百分号，当单位为百分比时会自动为您添加。';
$ec_lang['lpn_labels_separator']='数值之间的文字';
$ec_lang['lpn_labels_separator_tip']='一个属性与下一个属性之间的分隔文字。默认为一个空格。';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='优先级';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='标签放不下时数值被舍弃的顺序。1 保留得最久。';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='当两个节点标签重叠时，各属性被放弃显示的先后顺序。编号为 1 的属性在两个标签上都最先被放弃。当只剩一个属性、两者仍然重叠时，会整体隐藏其中一个标签：隐藏的是剩余数值最不值得显示的那个标签，也就是需水量最低、压力最接近区间中值，或高程或水头与相邻节点最接近的那个。';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='前';
$ec_lang['lpn_labels_col_after']='后';
$ec_lang['lpn_labels_col_decimals']='小数位';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='显示';
$ec_lang['lpn_labels_show_tip']='数值在标签上出现的顺序。编号为 1 的数值排在最前：在堆叠式标签中位于最上方，在单行标签中位于最前面。';
$ec_lang['lpn_labels_priority_customer_tip']='数值从用户标签中被省略的顺序。编号为 1 的数值最先被省略。';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='使用单位';
$ec_lang['lpn_labels_use_units_tip']='勾选后，会在“后缀”框和标签上显示单位，并在单位更改时同步更新。取消勾选可自行输入“后缀”文字。';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='初始状态';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='节点颜色';
$ec_lang['lpn_settings_sym_link_colors']='连接线颜色';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='背景图片…';
$ec_lang['lpn_backdrop_add']='添加';
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
$ec_lang['lpn_backdrop_scale']='选点设置比例';
$ec_lang['lpn_backdrop_scale_entry']='按配准文件或地图上一个像素的大小设置比例';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='以当前大小为基础缩放，围绕您选取的点';
$ec_lang['lpn_backdrop_scale_from_prompt1']='在背景图片上点击应保持不动的那个点。';
$ec_lang['lpn_backdrop_scale_from_prompt2']='以当前大小为基础缩放。1 表示大小不变，1.1 表示放大10%，0.9 表示缩小10%。';
$ec_lang['lpn_backdrop_scale_entry_prompt']='输入地图上一个像素的大小，或粘贴该图片配准文件的完整内容';
$ec_lang['lpn_backdrop_scale_entry_bad']='请输入一个数字表示地图上一个像素的大小，或粘贴配准文件的全部六行内容。';
$ec_lang['lpn_backdrop_wld_bad']='此配准文件会旋转、镜像或不均匀拉伸图片。地图只能平移图片并按相同比例整体缩放，因此未使用该文件。';
$ec_lang['lpn_backdrop_unreadable']='您的浏览器无法显示这张图片。请将它另存为 PNG 或 JPEG 后重新添加。';
$ec_lang['lpn_backdrop_position']='移动';
$ec_lang['lpn_backdrop_remove']='移除';
$ec_lang['lpn_backdrop_remove_confirm']='移除背景图片？';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='世界地图…';
$ec_lang['lpn_map_attach_tip']='将世界地图附加到本项目，不做任何其他改动。';
$ec_lang['lpn_map_attach_add']='附加';
$ec_lang['lpn_map_attach_readjust']='重新调整';
$ec_lang['lpn_map_attach_readjust_tip']='返回地图附加流程的第 2 步。';
$ec_lang['lpn_map_attach_scale_from']='以当前大小为基准缩放…';
$ec_lang['lpn_map_attach_scale_from_prompt']='以您管网图的中心为基准，按当前大小缩放地图。1 表示不变，1.1 表示放大 10%，0.9 表示缩小 10%。';
$ec_lang['lpn_map_attach_scale_from_bad']='请输入一个大于零的数字。';
$ec_lang['lpn_map_attach_scale_from_done']='地图大小已调整，您的管网图及其中每个坐标均保持不变。';
$ec_lang['lpn_map_attach_none']='本项目尚未附加世界地图。请先使用“地图”、“世界地图”、“附加”。';
$ec_lang['lpn_map_attach_remove']='分离';
$ec_lang['lpn_map_attach_remove_tip']='移除世界地图。无论如何，管网图及其坐标都不受影响。';
$ec_lang['lpn_map_attach_done']='世界地图现在位于您的管网图后面，本项目未发生改变。可使用“地图”、“世界地图”、“分离”再次将其移除。';
$ec_lang['lpn_map_attach_removed']='世界地图已移除，管网图保持不变。';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='您的管网图目前位于世界地图上纬度为零、经度为零的海洋中。请先找到您自己的位置：平移和缩放管网图背后的地图、搜索地名，或输入纬度和经度。管网图本身不会移动。';
$ec_lang['lpn_mapgeo_step1']='第 1 步（共 2 步）：找到您在世界上的位置';
$ec_lang['lpn_mapgeo_step2']='第 2 步（共 2 步）：使地图与您的管网图对齐';
$ec_lang['lpn_mapgeo_hint1']='平移和缩放管网图背后的地图，或搜索地点，或输入纬度和经度，然后按“大致放置”。';
$ec_lang['lpn_mapgeo_readjust_intro']='您的管网图位于上次放置的位置。要将其移到别处，请平移和缩放管网图背后的地图、搜索地名，或输入纬度和经度。管网图本身不会移动。';
$ec_lang['lpn_mapgeo_hint2']='在任意位置拖动，即可在您的管网图下方滑动地图。您的管网图及其中每个坐标都会保持原位不变。地图对齐后，按“在此配准”。';
$ec_lang['lpn_mapgeo_gestures']='缩放会将您的管网图和地图一起移动，方便您查看两者的对齐情况。拖动则只移动地图。';
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
$ec_lang['lpn_mapgeo_dial_turn']='旋转地图';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} 度';
$ec_lang['lpn_mapgeo_dial_size']='地图大小';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} 倍';
$ec_lang['lpn_mapgeo_dial_help']='拖动这两个滑条，或在其上方的框中输入数值，即可放大或缩小地图并旋转它。每个滑条的中点是上一步对齐的结果，因此 1 和 0 均表示保持不变。方向键对两者都适用。';
$ec_lang['lpn_mapgeo_place']='大致放置';
$ec_lang['lpn_mapgeo_finish']='在此配准';
$ec_lang['lpn_mapgeo_cancelled']='世界地图已恢复原位，您的管网图从未移动过。';
$ec_lang['lpn_mapgeo_locked']='在切换项目或保存之前，请按“在此配准”按钮完成操作，或按“取消”。世界地图目前仍处于放置过程中。';
$ec_lang['lpn_backdrop_scale_prompt1']='在背景图片上点击两个点，例如比例尺的两端。然后输入这两点之间的实际距离。';
$ec_lang['lpn_backdrop_scale_prompt2']='两点之间的实际距离';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='在图片上点击移动操作的基准点。';
$ec_lang['lpn_backdrop_position_prompt2']='选择目标点的确定方式，然后点击"继续"。';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='正在调整背景图片。';
$ec_lang['lpn_backdrop_target_label']='将该点移动到：';
$ec_lang['lpn_backdrop_target_node']='某个节点';
$ec_lang['lpn_backdrop_target_free']='地图上的任意一点';
$ec_lang['lpn_backdrop_target_coords']='您输入的坐标';
$ec_lang['lpn_backdrop_coords_prompt']='输入该点应移动到的 X、Y 坐标';
$ec_lang['lpn_backdrop_continue']='继续';
$ec_lang['lpn_tool_settings']='设置';
$ec_lang['lpn_settings_show_titles']='显示页面标题';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='隐藏页面标题和绘图上方的欢迎语，为地图的操作留出更多空间。打印时始终只显示简洁的地图。';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='隐藏这些标题';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='显示选择提示';
$ec_lang['lpn_settings_area_hint_tip']='在选择区域时，于地图上方显示气泡提示，说明下一次点击的作用。';
$ec_lang['lpn_settings_id_prefixes']='ID 前缀';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='创建值';
$ec_lang['lpn_settings_defaults_note']='适用于您此后新建的元件。已有元件不受影响。';
$ec_lang['lpn_settings_push_note']='仅应用当前正在显示标签的属性。';
$ec_lang['lpn_settings_push_btn']='将这些新元件的默认值应用到每一个已有元件';
$ec_lang['lpn_push_confirm']='将这些属性的数值应用到每一个已有元件，替换所有方案下的现有数值？您手动输入的数值将被覆盖。此操作可撤销。';
$ec_lang['lpn_push_properties']='属性：';
$ec_lang['lpn_push_assets']='节点和管道：';
$ec_lang['lpn_push_none_displayed']='当前没有任何起始值以标签形式显示，因此没有可应用的内容。请先在"标签"面板中开启所需属性的标签，然后重试。';
$ec_lang['lpn_push_nothing']='没有任何已有元件具有正在应用的这些属性。';
$ec_lang['lpn_push_no_change']='所有元件已经具有这些数值，因此不会有任何变化。';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='自定义属性';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='由您自己定义、用于自身目的的属性。它们与所有其他属性一样，随项目和方案一起存储。';
$ec_lang['lpn_cp_design']='设计';
$ec_lang['lpn_cp_design_tip']='每个自定义属性占一行，展开后显示：键、标签、适用于、验证方式、允许或限制、由该选择命名的字符字段、长度下限、长度上限、下限、上限。';
$ec_lang['lpn_cp_add']='添加自定义属性';
$ec_lang['lpn_cp_add_tip']='在设计表格中添加一行，并将其打开以供编辑。';
$ec_lang['lpn_cp_remove_tip']='从设计表格中移除此属性。已在您的元件上输入的数值仍保留在文件中，如果您再次设计相同的键，这些数值会重新出现。';
$ec_lang['lpn_cp_none']='尚未设计任何自定义属性。';
$ec_lang['lpn_cp_unnamed']='尚未命名';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='键';
$ec_lang['lpn_cp_key_tip']='键：属性以此名称存储。不允许使用空格，系统会自动为您添加前缀，确保您的键不会与内置字段冲突。';
$ec_lang['lpn_cp_label']='标签';
$ec_lang['lpn_cp_label_tip']='标签：这是读者在属性框、"查找"以及表格列标题中看到的文字。';
$ec_lang['lpn_cp_applies']='适用于';
$ec_lang['lpn_cp_applies_tip']='适用于：使用该属性的元件的 ID 前缀列表，以逗号分隔，例如 J,L,R。';
$ec_lang['lpn_cp_validate']='验证方式';
$ec_lang['lpn_cp_validate_tip']='验证方式：说明合格数值应具备的形式。大小写规则仅识别英文字母，这是一项已声明的限制。选择"不验证"可接受任何内容。';
$ec_lang['lpn_cp_restrict']='限制这些字符';
$ec_lang['lpn_cp_restrict_tip']='限制这些字符：数值只能使用此处列出的字符，或者不能使用其中任何字符，其中 "@" 表示任意字母；"#" 表示任意数字，若要允许使用 "-"、"." 和 ","，必须单独列出；空白字符必须夹在其他字符之间。';
$ec_lang['lpn_cp_restrict_mode']='允许或限制';
$ec_lang['lpn_cp_restrict_mode_tip']='允许或限制：给定的字符要么是数值唯一可以使用的字符，要么是数值不能使用的字符。';
$ec_lang['lpn_cp_restrict_allow']='仅允许这些字符';
$ec_lang['lpn_cp_minlength']='长度下限';
$ec_lang['lpn_cp_minlength_tip']='长度下限：任何更短的输入都会被标记，以此可以找出空白或输入了一半的条目。';
$ec_lang['lpn_cp_length']='长度上限';
$ec_lang['lpn_cp_length_tip']='长度上限：任何更长的输入都会被标记。';
$ec_lang['lpn_cp_low']='下限';
$ec_lang['lpn_cp_low_tip']='下限：这是您预期的最小值。数字按数值比较，文本按字典顺序比较。';
$ec_lang['lpn_cp_high']='上限';
$ec_lang['lpn_cp_high_tip']='上限：这是您预期的最大值。数字按数值比较，文本按字典顺序比较。';
$ec_lang['lpn_cp_val_none']='不验证';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='数字 .';
$ec_lang['lpn_cp_val_number_comma']='数字 ,';
$ec_lang['lpn_cp_val_integer']='整数';
$ec_lang['lpn_cp_val_upper']='全部大写';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}：{reason}该数值仍会按您输入的内容原样保留。';
$ec_lang['lpn_cp_bad_number']='该数值不是本属性所要求的数字。';
$ec_lang['lpn_cp_bad_integer']='该数值不是本属性所要求的整数。';
$ec_lang['lpn_cp_bad_case']='该数值不是本属性所要求的全部大写形式。';
$ec_lang['lpn_cp_bad_chars']='该数值使用了本属性不允许的字符。';
$ec_lang['lpn_cp_bad_space']='空白字符只能出现在其他字符之间。';
$ec_lang['lpn_cp_bad_minlength']='该数值短于本属性允许的长度。';
$ec_lang['lpn_cp_bad_length']='该数值长于本属性允许的长度。';
$ec_lang['lpn_cp_bad_low']='该数值低于本属性的下限。';
$ec_lang['lpn_cp_bad_high']='该数值高于本属性的上限。';
$ec_lang['lpn_cp_key_needed']='请为此自定义属性指定一个不含空格的键。';
$ec_lang['lpn_cp_key_taken']='另一个自定义属性已经使用了该键。';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='方案';
$ec_lang['lpn_scenario_base']='基础';
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
$ec_lang['lpn_scenario_overrides']='自有数值数';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='琥珀色圆环表示此元件持有仅属于方案“{name}”的数值。';
$ec_lang['lpn_scenario_overrides_tip']='每一个这样的数值都会在地图上以琥珀色圆环标出。切换到{base}即可查看没有这些数值的图纸。';
$ec_lang['lpn_scenario_menu']='情景';
$ec_lang['lpn_scenario_tip']='图中当前显示、页面正在求解的这套数值。点击可切换方案，或新建、重命名、删除方案。';
$ec_lang['lpn_scenario_new']='新建方案…';
$ec_lang['lpn_scenario_new_name']='方案 {n}';
$ec_lang['lpn_scenario_prompt_name']='该方案的名称';
$ec_lang['lpn_scenario_rename']='重命名方案…';
$ec_lang['lpn_scenario_delete']='删除方案';
$ec_lang['lpn_scenario_delete_confirm']='删除方案"{name}"及其专属的 {n} 个数值？图形本身不会改变。';
$ec_lang['lpn_scenario_override']='仅限本方案';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='勾选表示该数值仅属于本方案，即使其数值与基础方案相同。取消勾选可重新使用基础方案的数值。';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='基础情景：{value}';
$ec_lang['lpn_scenario_deactivated']='{id} 在方案"{scenario}"中已移出管网，但仍保留在图中，也仍存在于您的其他方案中。';
$ec_lang['lpn_scenario_push_btn']='将基础方案数值应用于所有方案';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='所有方案中当前显示标签的属性都将恢复为基础方案的数值，各方案专属的数值将被舍弃。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='使所有方案对这些属性都采用基础方案的数值？各方案专属的数值将被舍弃。此操作可撤销。';
$ec_lang['lpn_scenario_push_scenarios']='受影响的方案：';
$ec_lang['lpn_scenario_push_values']='将被舍弃的数值：';
$ec_lang['lpn_scenario_push_none']='没有任何方案对这些属性拥有自有数值，因此不会有任何变化，也不会舍弃任何数值。';
$ec_lang['lpn_scenario_preset_flow_static']='1. 流量测试：静态';
$ec_lang['lpn_scenario_preset_flow_static_tip']='针对设计管网在零流量下的流量测试校准。在此方案中，将所有节点的需水量设为 0。';
$ec_lang['lpn_scenario_preset_flow_mid']='2. 流量测试：中等';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='针对设计管网在所报告的第一个流量下的流量测试校准。在此方案中，将出流节点的需水量设为所测的第一个流量，其他所有节点的需水量设为 0。';
$ec_lang['lpn_scenario_preset_flow_max']='3. 流量测试：最大';
$ec_lang['lpn_scenario_preset_flow_max_tip']='针对设计管网在所报告的最大流量下的流量测试校准。在此方案中，将出流节点的需水量设为所测的最大流量，其他所有节点的需水量设为 0。';
$ec_lang['lpn_scenario_preset_average_day']='4. 平均日';
$ec_lang['lpn_scenario_preset_average_day_tip']='需水量倍数为 1：每一处需水量均按输入值计，视为平均日需水量。';
$ec_lang['lpn_scenario_preset_max_day']='5. 最大日';
$ec_lang['lpn_scenario_preset_max_day_tip']='需水量倍数为平均日的 2.0 倍，仅为占位数值。多数系统介于 1.2 至 3.0 之间（National Research Council, 2006）。请在“设置”“计算”“水力计算”中设置您自己系统的需水量倍数。';
$ec_lang['lpn_scenario_preset_peak_hour']='6. 高峰时段';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='需水量倍数为平均日的 3.0 倍，仅为占位数值。多数系统介于 3.0 至 6.0 之间（National Research Council, 2006）。请在“设置”“计算”“水力计算”中设置您自己系统的需水量倍数。';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. 消防加最大日';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='最大日需水量（倍数 2.0）。请在此方案中运行消防流量分析：它会在此需水量之上，在每个节点叠加消防流量。';
$ec_lang['lpn_delete_drops_overrides']='删除此元件也会丢弃您各方案中为其保存的 {n} 个数值。是否继续？';
$ec_lang['lpn_push_base_only']='此操作会更改图形本身，因此只能在"{base}"中执行。请切换到"{base}"后重试。';
$ec_lang['lpn_field_active']='属于本管网';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='取消勾选此项可使该元件保留在图纸上，但不参与管网：它会以灰色绘制，求解器会忽略它。在方案中，这正是开启或关闭一条拟建管道的方式。';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='喷射（漏损）指数';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='EPANET 喷射（漏损）方程中的指数：流量 = 系数 × 压力的该指数次方。它只在某节点带有喷射（漏损）时才会影响结果，目前这意味着该管网是从 EPANET 文件读入的。';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='读取 DEM';
$ec_lang['lpn_elev_dem_sample_tip']='读取此节点处 DEM 的高程，并显示在下方。“高程”框中的内容不会被改变。DEM 的水平分辨率在地球大部分地区约为 30 米，在有更好数据的地方会更精细。';
$ec_lang['lpn_elev_dem_use']='使用 DEM';
$ec_lang['lpn_elev_dem_use_tip']='将此节点处 DEM 的高程填入上方的“高程”框，替换其中原有的数值。如果尚未读取 DEM，会先读取。撤销一次即可恢复原值。';
$ec_lang['lpn_elev_dem_none']='DEM 中没有此节点的高程数据。';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM 给出的值为 {v} {u}。';
$ec_lang['lpn_settings_elev_source']='高程来源';
$ec_lang['lpn_settings_elev_source_tip']='新节点的高程从何而来。地面高程读取自 Mapbox DEM，其分辨率在地球大部分地区约为 30 米，在有更好数据的地方会更精细。';
$ec_lang['lpn_settings_elev_source_typed']='上方输入的高程';
$ec_lang['lpn_settings_elev_source_dem']='Mapbox 高程模型（DEM）';
$ec_lang['lpn_settings_accuracy']='精度';
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
$ec_lang['lpn_settings_default_is']='默认值为 {n}。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='求解器必须达到多接近才会停止，以流量在相邻两次试算之间仍在变化的幅度衡量。数值越小越精确，耗时也越长。两种求解器都读取同一个框，但各自用不同的总量来衡量这个变化：内置求解器用需水量之和，EPANET 用管道流量之和。留空时，本页面使用比 EPANET 自身默认值更严格的精度。';
$ec_lang['lpn_settings_specific_gravity']='比重';
$ec_lang['lpn_settings_specific_gravity_tip']='流体相对于水的重量比。它会改变压力表读数，但不会改变流量。';
$ec_lang['lpn_settings_viscosity']='相对粘度';
$ec_lang['lpn_settings_viscosity_tip']='流体相对于 20 摄氏度水的粘度。只有在使用达西-韦斯巴赫方法时才会影响结果。';
$ec_lang['lpn_settings_trials']='最大试算次数';
$ec_lang['lpn_settings_trials_tip']='求解器在放弃一个无法收敛的管网之前，允许进行的最大试算次数。';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='未收敛时的处理方式';
$ec_lang['lpn_settings_unbalanced_tip']='当管网用完试算次数仍未收敛时该如何处理。允许额外试算通常能够达到收敛。停止会按当前状态报告最后一次试算的结果，这并不是一个解。只有 EPANET 求解器会读取此框。内置求解器总是会停止，并将结果标记为未收敛。';
$ec_lang['lpn_settings_unbalanced_continue']='允许额外试算';
$ec_lang['lpn_settings_unbalanced_stop']='停止并报告最后一次试算';
$ec_lang['lpn_settings_unbalanced_trials']='报告前的额外试算次数';
$ec_lang['lpn_settings_unbalanced_trials_tip']='在用完上方的最大试算次数后，报告最后一次试算结果之前，还允许进行多少次试算。只有 EPANET 求解器会读取此框。';
$ec_lang['lpn_settings_head_error']='水头误差限值';
$ec_lang['lpn_settings_head_error_tip']='求解器停止前必须通过的附加检验：任意一条管道中剩余的最大水头误差。设为零表示不进行此项检验。只有 EPANET 求解器会读取此框。';
$ec_lang['lpn_settings_flow_change']='流量变化限值';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='求解器停止前必须通过的附加检验：任意一条管道的流量在相邻两次试算之间的最大变化。设为零表示不进行此项检验。只有 EPANET 求解器会读取此框。';
$ec_lang['lpn_settings_damp_limit']='阻尼启动精度';
$ec_lang['lpn_settings_damp_limit_tip']='求解器开始采用更小步长的精度阈值，这有助于振荡的管网收敛。设为零表示求解器永不启用阻尼。只有 EPANET 求解器会读取此框。';
$ec_lang['lpn_settings_option_unset']='未设置';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='同时应用于管网中每一处需水量的单一系数。用它来考察系统在高于或低于当前用水量时的表现。它不会改变您输入的数字。一个方案可以拥有自己的倍数，因此平均日、最大日和高峰小时可以各自对应一个数字；在方案中将其留空即表示沿用本项目的数值。';
$ec_lang['lpn_settings_engine_native']='使用 EPANET 求解器计算';
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
$ec_lang['lpn_settings_engine_native_tip']='勾选此项可在可能的情况下使用内置求解器；否则将始终使用美国环保署（EPA）提供的 EPANET 求解器。延时模拟以及存在启用中的 PRV、PSV 或 FCV 的情况下，不会使用内置求解器。首次使用 EPANET 求解器时会下载约 650 KB 数据，此后保存在本设备上。当管道存在局部（次要）水头损失时，两种求解器在末位数字上会有差异：EPANET 对其重力所用数值进行了取整，因此其局部水头损失会比精确算法略低。';
$ec_lang['lpn_engine_loading']='正在加载 EPANET 求解器…';
$ec_lang['lpn_engine_failed']='无法加载 EPANET 求解器，改用内置求解器。';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='因以下阀门会自行开闭，本次求解使用了 EPANET 求解器：';
$ec_lang['lpn_unit_unknown']='此图纸中标明的单位 {unit} 不是本页面提供的单位。所有内容均按原样保留和显示，未作任何更改。在本页面识别该单位之前无法给出结果，因为无法判断其大小。';
$ec_lang['lpn_engine_manning_note']='注意：使用曼宁糙率时，EPANET 计算出的水头损失比内置求解器约低 0.6%。';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='EPANET 求解器未接受此管网，因此未能运行。';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='EPANET 求解器提示：{message}';
$ec_lang['lpn_engine_refused_fallback']='屏幕上显示的数值改由内置求解器提供。';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='屏幕上显示的数值改由内置求解器提供。它每次只计算一个时刻，因此这仅是 {time} 时刻的管网状态，所有水箱仍处于初始水位。';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='以下控制规则所指的元件已不在此项目中，因此已被略过：{ids}';
$ec_lang['lpn_control_unreadable_note']='以下控制规则无法读取，因此已被略过：{ids}';
$ec_lang['lpn_rule_dangling_note']='以下规则引用了本项目中已不存在的元件，因此本次运行已忽略它们：{ids}';
$ec_lang['lpn_rule_unreadable_note']='以下规则无法读取，因此本次运行已忽略它们：{ids}';
$ec_lang['lpn_settings_text_size']='文字大小（像素）';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='符号大小（像素）';
$ec_lang['lpn_settings_link_width']='管道线宽（像素）';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='流向箭头';
$ec_lang['lpn_settings_show_arrows_tip']='在每条管道上绘制箭头，显示水流方向。箭头会在运行后出现，关闭此项不会改变计算结果。此设置会随项目一起保存。';
$ec_lang['lpn_settings_align_labels']='管道标签与管道对齐';
$ec_lang['lpn_settings_readability_bias']='标签向左偏离竖直方向超过多少度时上下翻转（度）';
$ec_lang['lpn_settings_readability_bias_tip']='当标签向左偏离竖直方向超过此角度时，将其上下翻转，使其保持正向朝上。';
$ec_lang['lpn_settings_mask_labels']='标签背后加不透明背景';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='引出线吸附到固定角度';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='当您将标签拖离其所指的对象时，若拖动方向接近某个固定角度，回指的引出线会被吸附到最近的那个固定角度上。继续拖动即可脱离吸附，因此任何角度仍然可用。关闭此项则自由拖动，这是本页面一直以来的方式。';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='当地图缩放到此宽度或更窄时显示标签';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='只有当地图视图宽度等于或小于此值时才会绘制标签。留空则在任何缩放级别都绘制标签。输入 0 则在任何缩放级别都不绘制标签。';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='始终显示';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='限制节点放大不超过';
$ec_lang['lpn_settings_symbol_cap_mid']='倍的';
$ec_lang['lpn_settings_symbol_cap_post']='百分位管道长度';
$ec_lang['lpn_settings_symbol_cap_tip']='一旦节点的地面直径达到本管网中该百分位管道长度的这么多倍，该节点就停止在地面尺度上继续放大。超过这一点后，节点、管道及其他符号会随着缩小地图而在屏幕上变小，而不再按地面尺度放大。水库和水箱是例外，它们在任何缩放级别下都保持相同的屏幕尺寸。';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='符号不透明度（0 到 1）';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='背景图片不透明度（0 到 1）';
$ec_lang['lpn_settings_map_display']='外观';
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
$ec_lang['lpn_settings_legend_position']='标签图例位置';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='无';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='关闭';
$ec_lang['lpn_settings_legend_top_left']='左上';
$ec_lang['lpn_settings_legend_top_right']='右上';
$ec_lang['lpn_settings_legend_middle_left']='左中';
$ec_lang['lpn_settings_legend_middle_right']='右中';
$ec_lang['lpn_settings_legend_bottom_left']='左下';
$ec_lang['lpn_settings_legend_bottom_right']='右下';
$ec_lang['lpn_settings_color_node_field']='节点颜色';
$ec_lang['lpn_settings_color_link_field']='管道颜色';
$ec_lang['lpn_settings_color_ramp']='配色方案';
$ec_lang['lpn_settings_color_credits']='致谢';
$ec_lang['lpn_color_ramp_epanet']='蓝到红（EPANET）';
$ec_lang['lpn_color_ramp_viridis']='紫到黄（更易区分相邻颜色）';
$ec_lang['lpn_color_ramp_gray']='浅灰到深灰';
$ec_lang['lpn_settings_color_reverse']='反转配色顺序';
$ec_lang['lpn_color_none']='不着色';
$ec_lang['lpn_settings_color_key_position']='颜色图例位置';
$ec_lang['lpn_settings_color_breaks']='色带边界值';
$ec_lang['lpn_settings_color_equal_intervals']='等间距';
$ec_lang['lpn_settings_color_equal_counts']='等数量';
$ec_lang['lpn_settings_color_no_values']='目前尚无可用数值。请先求解管网。';
$ec_lang['lpn_confirm_restore_defaults']='将所有设置（ID 前缀、起始值、求解器设置、地图外观、图例位置和可见标签）重置为原始值？您的管网不会受影响。设置属于当前打开的项目，因此您的其他项目会保留各自的设置。';
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
$ec_lang['lpn_settings_wipe_btn']='重新开始';
$ec_lang['lpn_confirm_wipe']='要重新开始吗？这将删除为本页面保存的全部内容：每个项目、每张背景图片、所有设置以及您的单位选择。页面将重新加载为全新访问者所见的样子。此操作无法撤销。';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='复制此链接：';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='时间';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='总运行时长';
$ec_lang['lpn_time_hyd_step']='水力时间步长';
$ec_lang['lpn_time_pattern_step']='模式时间步长';
$ec_lang['lpn_time_pattern_start']='模式起始时间';
$ec_lang['lpn_time_report_step']='报告时间步长';
$ec_lang['lpn_time_report_start']='报告起始时间';
$ec_lang['lpn_time_clock_start']='起始时刻的时钟时间';
$ec_lang['lpn_time_clock_day']='第 {day} 天，{clock}';
$ec_lang['lpn_time_format_tip']='请以小时和分钟的形式输入时间，例如 2:30。单独一个数字表示小时，例如 8 表示 8 小时。半小时可写作 0:30。';
$ec_lang['lpn_time_running']='正在使用 EPANET 求解器计算延时模拟。';
$ec_lang['lpn_time_no_engine']='内置求解器一次只能算出一个时刻，因此这里显示的仅是 {time} 时刻的管网状态：每个模式都按该时刻取值，每个水箱仍处于起始水位，而不会随时间充放水。请连接一次互联网以获取 EPANET 求解器，它可以运行延时模拟。';
$ec_lang['lpn_time_slider']='已用模拟时间';
$ec_lang['lpn_time_no_period']='此项目未设置延时模拟，因此只有一个时刻可以显示。请在“设置”、“计算”、“时间”中设置总运行时长，以运行延时模拟。';
$ec_lang['lpn_time_first']='跳到开始';
$ec_lang['lpn_time_prev']='后退一步';
$ec_lang['lpn_time_play']='播放';
$ec_lang['lpn_time_play_tip']='播放动画';
$ec_lang['lpn_time_pause_tip']='暂停动画';
$ec_lang['lpn_time_pause']='暂停';
$ec_lang['lpn_time_next']='前进一步';
$ec_lang['lpn_time_last']='跳到结束';
$ec_lang['lpn_time_tank']='水箱';
$ec_lang['lpn_time_level']='水位';
$ec_lang['lpn_time_run']='计算';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='按管网的每个水力时间步，从运行开始一直计算到运行结束。';
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
$ec_lang['lpn_time_run_done']='运行已完成。报告时刻：{frames}。耗时：{secs} 秒。';
$ec_lang['lpn_time_runbox_hide']='不再显示此框';
$ec_lang['lpn_settings_runbox']='显示运行进度框';
$ec_lang['lpn_settings_runbox_tip']='一个用于报告运行进度及其结果的框。关闭此项后，运行完成时会改为在状态栏中显示相同的信息，持续几秒钟。这是针对本浏览器的设置，而非项目的设置。';
$ec_lang['lpn_time_run_failed']='运行未能完成，因此没有后续时刻的结果。';
$ec_lang['lpn_time_run_report']='EPANET 运行报告';
$ec_lang['lpn_time_run_report_copy']='复制';
$ec_lang['lpn_time_run_report_copied']='已复制';
$ec_lang['lpn_time_run_report_tip']='EPANET 求解器就上一次运行自行输出的内容：是否收敛，以及它给出的任何警告。这是求解器自己的原文，并非本页面撰写。';

$ec_lang['lpn_time_speed']='速度';
$ec_lang['lpn_time_speed_tip']='回放速度';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='搜索设置';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='输入一个或多个词，即可看到同时提及这些词的设置项。';
$ec_lang['lpn_settings_no_match']='没有设置项提及该词。';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='“设置”分区列表的宽度';
$ec_lang['lpn_rpane_empty']='这里目前还没有停靠任何内容。属于整个项目的设置都在"设置"中。';
$ec_lang['lpn_time_settings_open']='时间设置';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='可视化';
$ec_lang['lpn_settings_sec_map']='地图与页面';
$ec_lang['lpn_settings_sec_assets']='新元件默认值';
$ec_lang['lpn_settings_sec_calculation']='计算';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='用户';
$ec_lang['lpn_labels_customer_note']='用户标签显示此处勾选的数值，其文字大小与地图上其他标签相同。';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='只有当地图视图宽度等于或小于此值时才会绘制用户标签。留空则在任何缩放级别都绘制。输入 0 则在任何缩放级别都不绘制用户标签。若此值大于“所有标签”的同类设置，则不起作用。';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='使用当前视图';
$ec_lang['lpn_settings_page']='页面';
$ec_lang['lpn_settings_hydraulics']='水力计算';
$ec_lang['lpn_settings_quality']='水质';
$ec_lang['lpn_settings_quality_track']='水质参数';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='选择本次运行要沿管道追踪的内容：水在系统中停留的时长、水的来源，或是一种在传输过程中发生反应的化学物质。只有化学物质需要设置反应系数。';
$ec_lang['lpn_settings_quality_source']='追踪节点';
$ec_lang['lpn_settings_quality_source_tip']='被追踪其水的去向的节点。其他每个节点都会显示其水中来自该节点的比例。';
$ec_lang['lpn_quality_none']='无';
$ec_lang['lpn_quality_trace']='来源追踪';
$ec_lang['lpn_quality_chemical']='会发生反应的化学物质';
$ec_lang['lpn_quality_needs_run']='水质会随着水流沿管道传播，因此需要延时模拟：EPANET 引擎和总运行时长。请先在“时间”下设置总运行时长，然后点击“计算”按钮。';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='化学物质及单位';
$ec_lang['lpn_quality_chemical_name_tip']='您正在追踪的化学物质，例如氯。留空则使用 EPANET 自身的默认标签 Chemical。会显示在您的报告中，但不用于计算。';
$ec_lang['lpn_quality_mass_units']='质量单位';
$ec_lang['lpn_quality_mass_units_tip']='水质输入中的单位部分，是 EPANET 自身提供的两种选择。';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='水质容差';
$ec_lang['lpn_quality_tolerance_tip']='两个相邻水体在浓度上相差多少之内，EPANET 仍会将它们视为同一个。留空则使用 EPANET 自身的默认值 0.01。';
$ec_lang['lpn_quality_diffusivity']='相对扩散系数';
$ec_lang['lpn_quality_diffusivity_tip']='该化学物质在水中扩散的难易程度，相对于氯而言。留空则使用 EPANET 自身的默认值 1.0。';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='{chemical} 浓度';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='平均 {chemical} 浓度';
$ec_lang['lpn_quality_initial']='初始水质';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='运行开始时该节点所含化学物质的量。水库在整个运行期间保持自己设定的数值不变，这通常用于表示水厂出水口的余量。留空则该节点在运行开始时不含该化学物质。';
$ec_lang['lpn_result_concentration']='浓度';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='该化学物质经过传输和反应后，在此处剩余的量。单位与“设置”、“水质”中该化学物质旁标注的单位相同。';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='投加类型';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='该节点对流经的水施加何种投加方式。“浓度”将进入管网的水视为达到“投加浓度”数值。“质量投加”每分钟投加固定质量的化学物质，与流量无关。“设定值投加”将离开该节点的浓度提升到“投加浓度”数值，且不超过该值。“随流投加”将“投加浓度”数值叠加到水中已有的浓度上。';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='无';
$ec_lang['lpn_source_type_concen']='浓度';
$ec_lang['lpn_source_type_mass']='质量投加';
$ec_lang['lpn_source_type_setpoint']='设定值投加';
$ec_lang['lpn_source_type_flowpaced']='随流投加';
$ec_lang['lpn_source_quality']='投加浓度';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='投加强度。除质量投加外，其余类型均为浓度，单位与“设置”、“水质”中该化学物质旁标注的单位相同；质量投加则为每分钟投加的化学物质质量。留空表示此处不投加，这与数值为零不同：数值为零表示投加装置在运行，只是投加量为零。';
$ec_lang['lpn_source_pattern']='投加模式';
$ec_lang['lpn_source_pattern_tip']='在运行过程中调整投加量的时间模式，用于投加量并非恒定的情形。不设置模式表示每个时间步的投加量都相同。';
$ec_lang['lpn_mixing_model']='混合模型';
$ec_lang['lpn_mixing_model_tip']='水箱中原有的水与流入的水如何混合。“完全混合”将整个水箱同时搅匀。“两分区混合”先充满进水区，再将其余部分向外传递。“先进先出活塞流”按水进入的先后顺序依次通过。“后进先出活塞流”将水逐层堆叠，最后进入的水最先流出。此选择会改变水龄和余量，但不会改变任何压力或流量。';
$ec_lang['lpn_mixing_mixed']='完全混合';
$ec_lang['lpn_mixing_2comp']='两分区混合';
$ec_lang['lpn_mixing_fifo']='先进先出活塞流';
$ec_lang['lpn_mixing_lifo']='后进先出活塞流';
$ec_lang['lpn_mixing_fraction']='混合分区比例';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='进水区占水箱容积的比例，取值在 0 到 1 之间。只有“两分区混合”会用到它。留空则整个水箱都是进水区，这也是 EPANET 的默认假设。';
$ec_lang['lpn_reaction_bulk']='水体反应系数';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='水体本身发生的反应，用于所有未单独设置该系数的管道。负值表示化学物质衰减，正值表示其增加。除非导入的 EPANET 文件另行说明反应级数，否则反应按一级反应处理，因此该系数是以 1/天 为单位的速率。留空表示没有水体反应。';
$ec_lang['lpn_reaction_wall']='管壁反应系数';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='在管壁处发生的反应，用于所有未单独设置该系数的管道。负值表示化学物质衰减。除非导入的 EPANET 文件另行说明反应级数，否则反应按一级反应处理，因此该系数以项目所用长度单位表示的“长度/天”为单位。留空表示没有管壁反应。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='仅适用于此管道。留空则该管道采用“设置”、“水质”中为全网设置的系数。';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='反应系数';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='此水箱中所存水的反应，以 1/天 为单位的速率表示。负值表示化学物质衰减，正值表示其增长。水在水箱中停留的时间远长于在任何管道中的停留时间，因此余量往往在这里损失。留空则该水箱采用“设置”、“水质”中为全网设置的水体反应系数。';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='水体反应';
$ec_lang['lpn_reaction_wall_short']='管壁反应';
$ec_lang['lpn_reaction_tank_short']='反应';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/天';
$ec_lang['lpn_reaction_day']='天';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='水体反应级数';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='水体中反应所使用的浓度指数。允许任意实数。默认值为 1，大多数余氯衰减建模都使用此值。取 0 表示反应速率与所含化学物质的量无关。';
$ec_lang['lpn_reaction_order_tank']='水箱反应级数';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='水箱中所存水体反应所使用的浓度指数，与水体反应级数分开设置，因此水箱可以采用与管道不同的反应级数。允许任意实数，默认值为 1。EPANET 在文件中将其记为 ORDER TANK，其自身界面并未提供输入框。';
$ec_lang['lpn_reaction_order_wall']='管壁反应级数';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='取 1 表示管壁反应按给定的系数发生；取 0 表示不发生。这是一个开关式设置。默认值为 1。';
$ec_lang['lpn_reaction_order_unstated']='未说明';
$ec_lang['lpn_reaction_order_zero']='0，零级';
$ec_lang['lpn_reaction_order_first']='1，一级';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='极限浓度';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='化学物质趋向的浓度值，而不是衰减至零或无限增长。当水中浓度接近此值时，反应逐渐减慢并最终停止。请使用统一的单位。留空表示没有极限值。';
$ec_lang['lpn_reaction_rough_corr']='粗糙度相关系数';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='将管壁反应与各管道自身的粗糙度关联，粗糙度越大，反应越快。设置此值后，会根据每条管道自身的粗糙度分别算出其管壁系数，上方统一的管壁系数将不再使用。留空则不使用此项。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='本页面不提供自己的反应系数。目前没有标准的测定方法，同类水质的已发表系数彼此可相差十倍之多，因此此处提供的任何数值都会被当作一种建议。请填入您自己测得的数值，或有据可查的数值；对于不发生反应的化学物质，可将输入框留空。';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='能耗';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='报告';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='有关水泵能耗费用、方案比较、EPANET 求解器报告、与实测数据的率定，以及在延时模拟之后的状态报告和完整报告的报告。';
$ec_lang['lpn_reports_epanet']='EPANET 运行';
$ec_lang['lpn_energy_title']='水泵能耗报告';
$ec_lang['lpn_energy_menu']='水泵能耗';
$ec_lang['lpn_energy_menu_tip']='在最近一次延时模拟中，各水泵开启的时长比例、所耗功率及花费。';
$ec_lang['lpn_energy_efficiency']='水泵效率（百分比）';
$ec_lang['lpn_energy_efficiency_tip']='用于所有未自带效率曲线的水泵的线到水效率。若未设置，EPANET 使用 75%。';
$ec_lang['lpn_energy_price']='电价';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='每千瓦时的电费。适用于所有未单独设置电价的水泵。留空则报告中的所有费用均为零。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='此水泵所用的每千瓦时电费。留空则该水泵采用“设置”、“能耗”中为全网设置的电价。';
$ec_lang['lpn_energy_price_pattern']='电价模式';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='在每个模式时间步对电价进行倍乘的模式，用于表示低谷电价等情形。留空则整个运行期间使用同一电价。';
$ec_lang['lpn_energy_demand_charge']='峰值需量电费';
$ec_lang['lpn_energy_demand_charge_tip']='供电单位针对系统中水泵所需峰值负荷，按每千瓦收取的费用。';
$ec_lang['lpn_energy_currency']='货币';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='您在此处填写的内容会显示在每个金额数字旁边，仅作为标签使用。价格和费用不会被换算，因此请按您在此处填写的货币单位书写价格。';
$ec_lang['lpn_energy_kwh']='千瓦时';
$ec_lang['lpn_energy_kw']='千瓦';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='本页面不提供自己的电价。电力费用因供电单位、国家、时段和年份而异，因此此处提供的任何数值都会被当作一种建议。请填入您自己电费单上的价格。';
$ec_lang['lpn_energy_needs_run']='水泵能耗是功率对运行时间的积分，因此需要延时模拟：EPANET 引擎和总运行时长。请在“设置”、“计算”、“时间”中设置总运行时长，点击“计算”按钮，然后打开“水务”、“报告”、“水泵能耗”。';
$ec_lang['lpn_energy_no_pumps']='此管网中没有水泵，因此没有任何耗电设备。';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='方案对比';
$ec_lang['lpn_scncmp_menu_tip']='求解本项目中的每一个方案，并将它们并排显示：各方案中的最低压力和最高流速。';
$ec_lang['lpn_scncmp_running']='正在求解每一个方案…';
$ec_lang['lpn_scncmp_empty']='尚未绘制任何内容，因此没有可求解的对象。';
$ec_lang['lpn_scncmp_col_maxvelocity']='最高流速';
$ec_lang['lpn_scncmp_at']='{id} 处的 {value}';
$ec_lang['lpn_scncmp_current']='（当前打开）';
$ec_lang['lpn_scncmp_note']='每个方案都是基于绘图副本求解的。此处的操作不会更改本项目，您正在使用的方案也会保持不变。';
$ec_lang['lpn_energy_over']='延时模拟时长：{time}';
$ec_lang['lpn_energy_col_pump']='水泵';
$ec_lang['lpn_energy_col_running']='运行占比';
$ec_lang['lpn_energy_col_effic']='效率';
$ec_lang['lpn_energy_col_avg_kw']='平均千瓦';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='此水泵运行期间使用的平均功率。它不按闲置时段平均，因此即使某台水泵在延时模拟的大部分时间里都处于闲置状态，它报告的仍是运行期间实际使用的功率。';
$ec_lang['lpn_energy_col_peak_kw']='峰值千瓦';
$ec_lang['lpn_energy_col_kwh']='千瓦时';
$ec_lang['lpn_energy_col_cost']='费用';
$ec_lang['lpn_energy_total_kwh']='耗电量';
$ec_lang['lpn_energy_total_energy_cost']='电费';
$ec_lang['lpn_energy_peak_kw']='峰值用电功率';
$ec_lang['lpn_energy_total_demand_charge']='峰值需量费用';
$ec_lang['lpn_energy_total_cost']='总费用';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='状态';
$ec_lang['lpn_reports_status_tip']='上一次延时模拟期间按时间顺序发生的变化：水泵和阀门的开启或关闭，水箱的充水、放水、充满或排空，以及未能完全收敛的步骤。';
$ec_lang['lpn_status_title']='状态报告';
$ec_lang['lpn_status_needs_run']='状态报告列出延时模拟期间发生的变化。请在“设置”、“计算”、“时间”中设定“总运行时长”，按“计算”，然后打开“水力”、“报告”、“状态报告”。';
$ec_lang['lpn_status_empty']='本次运行期间没有状态发生变化。';
$ec_lang['lpn_status_col_event']='事件';
$ec_lang['lpn_status_opened']='{type} {id} 刚刚开启';
$ec_lang['lpn_status_closed']='{type} {id} 刚刚关闭';
$ec_lang['lpn_status_filling']='{type} {id} 现在正在充水';
$ec_lang['lpn_status_emptying']='{type} {id} 现在正在放水';
$ec_lang['lpn_status_full']='{type} {id} 刚刚充满';
$ec_lang['lpn_status_dry']='{type} {id} 刚刚排空';
$ec_lang['lpn_status_no_converge']='该步骤的水力解未能完全收敛；所示数值为其最后一次迭代的结果。';
$ec_lang['lpn_status_note']='读取自与“表格”面板和“完整报告”相同的延时模拟运行。这里只列出发生变化的项，而不是每一个步骤。';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='完整';
$ec_lang['lpn_reports_full_tip']='上一次运行中每个报告时刻下的每个节点和每条连接线，汇总为一个可下载或打印的表格。';
$ec_lang['lpn_full_title']='完整报告';
$ec_lang['lpn_full_needs_run']='完整报告列出每个报告时刻下的每个节点和每条连接线。请按“计算”，然后打开“水力”、“报告”、“完整报告”。';
$ec_lang['lpn_full_note']='每个报告时刻下的每个节点或连接线各占一行，单位与“表格”面板中显示的相同。空白单元格表示该量没有此列的数值。下载或打印包含所有时刻；下方表格一次只显示一个时刻。';
$ec_lang['lpn_full_step_label']='时刻';
$ec_lang['lpn_full_download_csv']='下载 CSV';
$ec_lang['lpn_full_print']='打印报告';
$ec_lang['lpn_full_col_time']='时间';
$ec_lang['lpn_full_col_type']='类型';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} 行。';
$ec_lang['lpn_energy_no_price']='未设置电价，因此此处所有费用均为零。请在“设置”、“能耗”中设置电价。';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='此管网设置的电价为零，因此此处所有费用均为零。请在“设置”、“能耗”中更改电价。';
$ec_lang['lpn_energy_curve_note']='以下水泵引用了没有数据点的效率曲线：{ids}。它们按全网设定的效率运行。';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_rank']='排名';
$ec_lang['lpn_labels_col_drop']='省略';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='节点与连接线';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='等间隔';
$ec_lang['lpn_color_mode_quantile']='分位数（等数量）';
$ec_lang['lpn_color_mode_jenks']='自然断点（Jenks）';
$ec_lang['lpn_color_mode_stddev']='标准差';
$ec_lang['lpn_color_mode_pretty']='美观取整';
$ec_lang['lpn_color_mode_log']='对数';
$ec_lang['lpn_color_mode_manual']='手动';

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
$ec_lang['lpn_library_menu']='库';
$ec_lang['lpn_library_menu_tip']='管理此项目的需水模式、水泵曲线和控制规则。';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='模式';
$ec_lang['lpn_library_patterns_tip']='模式是一组循环重复的乘数。每个乘数适用于一个模式时间步；例如以 1 小时为步长的 24 个数字构成一个循环的一天。需水量为 10、乘数为 1.5 时，该时刻的需水量即为 15。';
$ec_lang['lpn_library_curves']='曲线';
$ec_lang['lpn_library_curves_tip']='曲线是一组说明某项性能的数据点：例如水泵在各流量下增加多少水头、在该流量下效率多高，或阀门在各流量下损失多少水头。';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='曲线附加于水泵和阀门。对于水泵水头曲线，运行时使用的是按各数据点拟合出的曲线，如图所示；对于其他类型，则用直线依次连接各数据点，如图所示。';
$ec_lang['lpn_library_curve_add']='添加曲线';
$ec_lang['lpn_library_curve_type_tip']='此曲线所描述的内容';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='曲线类型';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='方程';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='通过各数据点拟合出的曲线，也就是下方图中所绘制的线。它每次显示时都会重新计算，从不保存，其数值单位与上方表格中所用的单位相同。内置求解器基于此方程运行；EPANET 引擎则直接读取各数据点本身。';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='在电子表格中选择一列或两列，复制后粘贴到您想要放置数据的第一个单元格中，行会按需自动添加。您也可以直接粘贴从 EPANET 文件中复制的行，包括曲线名称。';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='说明';
$ec_lang['lpn_library_curve_note_tip']='用您自己的话说明这条曲线是什么。它会写在 EPANET 文件中该曲线上方，并从那里读回。';
$ec_lang['lpn_library_curve_remove_point']='删除此点';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='复制数据点';
$ec_lang['lpn_library_curve_copy_tip']='将每个数据点复制为两列，可直接粘贴到电子表格中。';
$ec_lang['lpn_library_curve_copy_manual']='复制这些数据点';
$ec_lang['lpn_library_curve_used_by']='使用此曲线的元件';
$ec_lang['lpn_library_curve_unused']='没有元件使用此曲线。';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='此曲线正被 {count} 个元件使用：{ids}。请先将它们改为指向其他曲线，然后再删除此曲线。';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='管道类型';
$ec_lang['lpn_library_pipetypes_tip']='管道类型是一种定义，多条管道可引用它来确定管径、粗糙度和反应系数。编辑此定义会同时改变所有使用它的管道。';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='每个项目都有自己的管道类型库。管道类型定义中的属性可以留空，例如只指定粗糙度而不指定管径的管道类型是允许的。您可在管道的属性编辑器中为其附加管道类型。在此处编辑定义会改变所有引用它的管道。';
$ec_lang['lpn_library_pipetype_add']='添加管道类型';
$ec_lang['lpn_library_pipetype_blank_tip']='管道类型定义中留空的属性，需在每条管道上单独填写。';
$ec_lang['lpn_library_pipetype_used_by']='使用此类型的管道';
$ec_lang['lpn_library_pipetype_unused']='没有管道使用此管道类型。';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='此管道类型正被 {count} 条管道使用：{ids}。请先将它们从此类型分离，然后再删除此类型。';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='管道类型';
$ec_lang['lpn_field_pipetype_tip']='此管道所使用的、来自项目库的管道类型。管道类型中包含的属性在此处无法编辑。将管道类型分离后即可在此处编辑。';
$ec_lang['lpn_pipetype_none']='未选择管道类型';
$ec_lang['lpn_pipetype_detach']='从管道类型分离';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='将此管道从其类型读取的数值复制到管道本身，并停止使用该类型。此时管道的数值不会改变，此后您即可在此处编辑这些数值。';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='管件';
$ec_lang['lpn_library_fittings_tip']='管件清单是一组管件及其数量，多条管道均可引用。它们汇总为一个局部水头损失系数。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='每个项目都有自己的管件库。管件清单中每种管件都有对应的数量，并汇总为一个局部水头损失系数。管道和管道类型均可引用同一份清单。';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='此处提供的管件是 EPANET 2.2 用户手册表 3.3 中的十三种。选择其中一种会将其系数复制到该行中，您可在此更改。系数取决于管件的规格和制造商，因此请将此表视为起点，而非最终答案。';
$ec_lang['lpn_library_fittings_add']='添加管件清单';
$ec_lang['lpn_library_fittings_used_by']='使用此管件清单的管道';
$ec_lang['lpn_library_fittings_unused']='没有管道使用此管件清单。';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='此管件清单正被 {count} 条管道使用：{ids}。请先将它们从此清单分离，然后再删除此清单。';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='导入库…';
$ec_lang['lpn_library_import_tip']='选择另一个项目文件，将其中的整个库复制到本项目中。名称在本项目中已被占用的条目会被跳过并列出，因此不会更改您已有的任何内容。';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='选择要从 {file} 复制的内容';
$ec_lang['lpn_library_import_count']='{name}（{count}）';
$ec_lang['lpn_library_import_note']='每个勾选的库都会被整体复制。之后可按删除其他条目的方式删除不需要的内容。';
$ec_lang['lpn_library_import_go']='导入';
$ec_lang['lpn_library_import_no_libraries']='该项目文件没有可复制的库。';
$ec_lang['lpn_library_import_heading']='从 {file} 导入';
$ec_lang['lpn_library_import_added']='已复制：{names}';
$ec_lang['lpn_library_import_conflict']='已跳过，因为本项目已有同名条目：{names}。此处未做任何更改。若两者都需要，请将其中一个重命名后再次导入。';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='该项目文件中没有这些内容可供复制。';
$ec_lang['lpn_library_import_curve_shape']='以下曲线按文件所写的内容原样导入，但在其第一列从每个点到下一个点都递增之前，运行无法使用它们：{names}';
$ec_lang['lpn_library_import_needs_fittings']='以下管道类型引用了本项目没有的管件列表：{names}。从同一文件导入管件库后，它们即可找到该列表。';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='警告：单位不一致。将按原样导入。不建议这样做。';
$ec_lang['lpn_library_import_units_line']='{name}：本项目显示为 {mine}，文件显示为 {theirs}。';
$ec_lang['lpn_fitting_qty']='数量';
$ec_lang['lpn_fitting_name']='管件';
$ec_lang['lpn_fitting_k']='系数';
$ec_lang['lpn_fitting_add']='添加管件';
$ec_lang['lpn_fitting_remove']='移除';
$ec_lang['lpn_fitting_total']='局部损失系数合计，k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='管件清单';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='来自项目库的管件清单。其中管件的数量和系数会汇总为该管道的局部损失系数，此时系数输入框将变为只读。不选择此项即可自行输入系数。';
$ec_lang['lpn_fittings_none']='未选择管件清单';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='截止阀，全开';
$ec_lang['lpn_fitting_angle']='角阀，全开';
$ec_lang['lpn_fitting_swingcheck']='旋启式止回阀，全开';
$ec_lang['lpn_fitting_gate']='闸阀，全开';
$ec_lang['lpn_fitting_elbow_short']='短半径弯头';
$ec_lang['lpn_fitting_elbow_medium']='中等半径弯头';
$ec_lang['lpn_fitting_elbow_long']='长半径弯头';
$ec_lang['lpn_fitting_elbow_45']='45 度弯头';
$ec_lang['lpn_fitting_return_bend']='封闭式回弯管';
$ec_lang['lpn_fitting_tee_run']='标准三通，流经直通';
$ec_lang['lpn_fitting_tee_branch']='标准三通，流经支管';
$ec_lang['lpn_fitting_entrance']='方形入口';
$ec_lang['lpn_fitting_exit']='出口';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='其他管件';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='已保存 {file}';
$ec_lang['lpn_inp_export_flat_lead']='导出的 EPANET 文件在数值上与本项目等效，但它无法容纳以下内容：';
$ec_lang['lpn_inp_export_flat_types']='此处有 {n} 条管道引用了 {t} 种管道类型。在文件中，每条管道都会各自携带一份完整的数值副本，因此计算结果不变。文件无法保留管道类型本身，因此“编辑一个定义即可让所有引用它的管道随之改变”这一特性，只有您自己的项目文件才能记录。';
$ec_lang['lpn_inp_export_flat_coords']='EPANET 文件为每个节点只保存一个位置。本方案将其中 {n} 个节点放在了别处，文件中保存的就是这些位置。其他每个方案的位置仅保留在您自己的项目文件中。';
$ec_lang['lpn_inp_export_flat_fittings']='EPANET 文件无法保留项目文件中弯头、阀门和三通的清单。此处有 {n} 条管道的局部损失系数是由管件清单汇总得出的。汇总值会原样写入文件，因此计算结果不受影响。';
$ec_lang['lpn_library_controls']='控制规则';
$ec_lang['lpn_library_controls_tip']='控制规则是一句话：当水位、压力或时间达到指定条件时，开启或关闭某条连接线，或为其设定数值。';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='添加模式';
$ec_lang['lpn_library_pattern_values']='乘数';
$ec_lang['lpn_library_pattern_values_tip']='各乘数以空格或逗号分隔。如有电子表格中的一列数据，可直接粘贴。该列表会在整个运行期间循环使用，因此无需覆盖整个运行时长。';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} 个乘数，间隔 {step}，共覆盖 {span}';
$ec_lang['lpn_library_pattern_none']='无模式';
$ec_lang['lpn_settings_default_pattern']='默认需水模式';
$ec_lang['lpn_settings_default_pattern_tip']='未指定模式的每个节点都使用此模式。';
$ec_lang['lpn_library_control_add']='添加控制规则';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='用 EPANET 语法写成的一行规则。请使用统一的项目单位。关键字必须为英文。示例：LINK 12 CLOSED IF NODE 23 ABOVE 20（当水箱 23 的水位超过 20 英尺时，关闭管线 12）；LINK 12 OPEN IF NODE 130 BELOW 30（当节点 130 的压力低于 30 psi 时，打开管线 12）；LINK PUMP02 1.5 AT TIME 16（在模拟开始后第 16 小时，将水泵 PUMP02 的相对转速设为 1.5）；LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM（两条规则：整个模拟期间，管线 12 每天上午 10 点关闭、晚上 8 点打开）。';
$ec_lang['lpn_library_control_ok']='✓ 已理解';
$ec_lang['lpn_library_control_bad']='⚠ 未能理解';
$ec_lang['lpn_library_control_missing']='⚠ 此管网中没有名为 {id} 的对象';
$ec_lang['lpn_library_rules']='规则';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='规则是一小段文字，当水位、压力、流量或时间达到您设定的数值时，用来打开或关闭一条连接线，或为其设定一个数值。规则可以同时测试多个条件，也可以说明测试失败时该怎么做。';
$ec_lang['lpn_library_rule_add']='添加规则';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='使用 EPANET 的写法书写一条规则，每行一个子句。第一行为其命名：RULE 1。接着是条件：IF TANK 2 LEVEL BELOW 17.1。然后是应采取的操作：THEN PUMP 9 STATUS IS OPEN。最后一行可以设定优先级：PRIORITY 1。使用 AND 或 OR 行来测试多个条件，使用 ELSE 行来说明测试失败时该怎么做。条件可以读取节点上的 LEVEL、HEAD、GRADE、PRESSURE 或 DEMAND，连接线上的 FLOW、STATUS 或 SETTING，或者 SYSTEM 上的 TIME 和 CLOCKTIME。数值请按本项目当前显示的单位书写，会自动为您换算。关键字请保留英文原样，它们是本页面和 EPANET 所识别的内容。';
$ec_lang['lpn_library_rule_ok']='✓ 已读取此规则';
$ec_lang['lpn_library_rule_bad']='⚠ 无法读取此规则';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='基本需水量';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='此节点在当前时间步的取水流量：每个基本需水量乘以其各自的模式值后相加得出。该数值是计算得出的，不能手动输入，因此会随时钟变化，也无法编辑。';
$ec_lang['lpn_field_demand_pattern']='需水模式';
$ec_lang['lpn_field_demand_pattern_tip']='此节点的需水量在运行期间如何升降变化。保留为“无模式”则改为跟随项目的“默认需水模式”。';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='说明';
$ec_lang['lpn_field_demand_category_tip']='该需水类别的名称或说明。';
$ec_lang['lpn_demand_add']='添加需水类别';
$ec_lang['lpn_demand_add_tip']='为该节点添加另一个需水类别，各自拥有自己的基本需水量、模式和说明。各类别的需水量会相加。';
$ec_lang['lpn_demand_remove']='删除此项需水量';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='水头模式';
$ec_lang['lpn_field_head_pattern_tip']='此水库的水位在运行期间如何升降变化。上方的水头会乘以该模式的乘数。';
$ec_lang['lpn_field_pump_speed']='相对转速';
$ec_lang['lpn_field_pump_speed_tip']='1 表示此水泵以其曲线测定时的转速运转。0.9 表示同一水泵转速较慢，因而降低其增加的水头和通过的流量。运行期间，转速模式会取代此处的数值。';
$ec_lang['lpn_field_speed_pattern']='转速模式';
$ec_lang['lpn_field_speed_pattern_tip']='此水泵的转速在运行期间如何升降。每个乘数就是该时段的相对转速，它会取代“转速设定值”而非按比例缩放，因此乘数为 0 时水泵停止运转。';

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
$ec_lang['lpn_search_menu']='按名称搜索地点…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='按名称查找城镇、地址或地标，并将地图移动到该处。首次使用时会请求您的许可，因为您输入的文字会发送到 OpenStreetMap 的地名服务。';
$ec_lang['lpn_search_bar']='按名称搜索…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='按地名搜索会将您输入的文字发送到 nominatim.openstreetmap.org，即 OpenStreetMap 基金会提供的免费地名服务。';
$ec_lang['lpn_search_consent_2']='这与您项目背后的街道地图图片是不同的服务。图片只显示您在查看哪里，而搜索会显示您输入了什么。地名服务将会收到您的搜索词和您的 IP 地址。我们不会发送任何其他内容，也不会保留您搜索记录的任何副本。';
$ec_lang['lpn_search_consent_3']='我们可以将您的搜索内容发送给地名服务吗？';
$ec_lang['lpn_search_consent_4']='如果您选择"否"，本页面的其他所有功能都会照常运作，包括"前往指定的经纬度"。我们会记住您选择的"是"，以免再次询问；选择"否"则完全不会被保存。';
$ec_lang['lpn_search_refused']='地名搜索已关闭，未发送任何内容。您仍可以使用"前往指定的经纬度"。';
$ec_lang['lpn_search_prompt']='按名称搜索地点：城镇、街道或地标，例如：Petaluma, California';
$ec_lang['lpn_search_empty']='请输入要搜索的地名。';
$ec_lang['lpn_search_working']='正在搜索…';
$ec_lang['lpn_search_busy']='已有一个搜索正在进行，请等待其返回结果。';
$ec_lang['lpn_search_choose']='找到多个匹配地点，请选择其中一个。';
$ec_lang['lpn_search_nochoice']='未作选择，因此地图没有移动。';
$ec_lang['lpn_search_badchoice']='该数字不在列表之中。';
$ec_lang['lpn_search_none']='未找到该名称对应的地点。';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='地名服务要求我们放慢请求速度。请稍候一分钟后重试。';
$ec_lang['lpn_search_http']='地名服务返回了一个错误。';
$ec_lang['lpn_search_timeout']='地名服务未能及时响应。本页面的其他功能不受影响，仍可正常使用。';
$ec_lang['lpn_search_unreadable']='地名服务返回的内容本页面无法解析。';
$ec_lang['lpn_search_offline']='无法连接到地名服务，您可能已离线。本页面的其他功能不受影响，包括"前往指定的经纬度"。';
$ec_lang['lpn_search_toofast']='地名服务限制每秒最多一次搜索。请稍等片刻后重试。';
$ec_lang['lpn_search_nofetch']='此浏览器无法连接到地名服务。';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox 是从许多公开的高程数据集拼合而成的，因此其精度完全取决于您所在的位置。在存在国家级激光雷达测量的地区，例如美国大部分地区的 USGS 3DEP 及其他地区的同类数据，精度可以优于水平 1 米、垂直几十厘米。而在只有全球数据的地区，精度约为水平 30 米、垂直数米。Mapbox 并不会告诉我们您得到的是哪一种。请将其当作等高线图而非实测成果：对任何您要依赖的数值都请自行核实。';
$ec_lang['lpn_terrain_consent_1']='填入高程会将每个需要高程的节点位置——其纬度和经度——发送到 api.mapbox.com，以查询该处的地面高度。';
$ec_lang['lpn_terrain_consent_2']='这与您项目背后的地图图片是不同的问题。图片只显示您在查看哪里，而这些位置本身就是您的管网。Mapbox 将会收到这些坐标和您的 IP 地址。我们不会发送任何其他内容：没有名称、没有管道数据、没有项目内容。我们不保留任何记录，除了您对本问题的回答之外，本设备上不会保存任何内容。';
$ec_lang['lpn_terrain_consent_3']='我们可以将您的节点位置发送给 Mapbox 吗？';
$ec_lang['lpn_terrain_consent_4']='如果您选择"否"，本页面的其他所有功能都会照常运作，您仍可以像以前一样自行输入高程。我们会记住您选择的"是"，以免再次询问；选择"否"则完全不会被保存。';
$ec_lang['lpn_terrain_refused']='未填入高程，也未发送任何内容。您仍可以像以前一样自行输入。';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='要从 Mapbox DEM 填入 {n} 个节点的高程吗？';
$ec_lang['lpn_terrain_confirm_default_1']='每个节点都已有高程，其中 {n} 个仍为 {v}——这是新节点的起始高程，而非您输入的数值。';
$ec_lang['lpn_terrain_confirm_default_2']='要用 Mapbox DEM 的数值替换这 {n} 个节点的高程吗？';
$ec_lang['lpn_terrain_keep']='{k} 个节点已有高程，将不会被改动。';
$ec_lang['lpn_terrain_undo']='一次撤销（Ctrl-Z）即可将它们全部恢复。';
$ec_lang['lpn_terrain_requests']='{n} 次请求发往 api.mapbox.com。';
$ec_lang['lpn_terrain_busy']='正在填入高程，请稍候。';
$ec_lang['lpn_terrain_offmap']='这些节点的位置不在地形图范围内，因此未发送任何内容。';
$ec_lang['lpn_terrain_too_wide']='这些节点分布范围过大，无法一次性读取（需要 {n} 次图块请求）。未发送任何内容。';
$ec_lang['lpn_terrain_cancelled']='未作任何更改，也未发送任何内容。';
$ec_lang['lpn_terrain_nofetch']='此浏览器无法连接到地形服务。';
$ec_lang['lpn_terrain_working']='正在读取地面高程…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='地形服务拒绝了此请求（{status}），因此没有更改任何高程。本网站使用的 Mapbox 令牌可能不允许您当前所在的网址访问。';
$ec_lang['lpn_terrain_failed']='无法连接到地形服务，因此未更改任何高程。您可能已离线。本页面的其他功能不受影响，仍可正常使用。';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='地形服务要求我们放慢请求速度（429），因此未更改任何高程。请稍后再试。';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='地形服务返回了一个错误（{status}），因此未更改任何高程。您的管网本身没有问题。';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='这些节点都没有地球上的实际位置，因此未发送任何请求，也未更改任何高程。读取地表高程需要一个使用纬度和经度的项目，或一个本页面能够定位的投影坐标系项目。';
$ec_lang['lpn_terrain_done']='已填入 {n} 个高程。';
$ec_lang['lpn_terrain_missed']='{m} 个未能读取，仍为空白。';
$ec_lang['lpn_terrain_partial']='{f} 个地形图块未返回结果。';
$ec_lang['lpn_terrain_will_ids']='以下节点将获得高程：{ids}';
$ec_lang['lpn_terrain_keep_ids']='这些节点是：{ids}';
$ec_lang['lpn_terrain_filled_ids']='以下节点已获得高程：{ids}';
$ec_lang['lpn_terrain_blank_ids']='以下节点仍没有高程：{ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}，以及另外 {n} 个';

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
$ec_lang['lpn_ff_menu']='消防流量分析…';
$ec_lang['lpn_ff_menu_tip']='逐个测试节点：每个节点在维持您设定的余压前提下，最多能提供多少流量；若在该节点抽取所需流量，是否会使其他部位超出限值？';
$ec_lang['lpn_ff_title']='消防流量分析';
$ec_lang['lpn_ff_intro']='依次让管网中的每个节点在其现有需水量之外再抽取一份消防流量。您的项目不会被更改；整个运行都在一份副本上进行。';
$ec_lang['lpn_ff_scope']='要测试的节点';
$ec_lang['lpn_ff_scope_tip']='请在运行前选择测试范围。在大型系统中测试每一个节点可能需要几分钟。';
$ec_lang['lpn_ff_all']='全部';
$ec_lang['lpn_ff_selected']='所选';
$ec_lang['lpn_ff_no_junctions']='此项目目前还没有节点，因此没有可测试的对象。';
$ec_lang['lpn_ff_no_selection']='未选中任何节点。请选择节点，或选择“全部”选项。';
$ec_lang['lpn_ff_skipped']='所选元素中有 {n} 个不是节点，因此未进行测试。';
$ec_lang['lpn_ff_required']='所需消防流量';
$ec_lang['lpn_ff_required_tip']='您的消防规范或消防部门要求消火栓提供的流量。除非某节点自带所需消防流量，否则都按此数值进行测试。';
$ec_lang['lpn_ff_required_own']='有 {n} 个节点自带所需消防流量，将按其自身数值进行测试。';
$ec_lang['lpn_ff_required_node_tip']='该特定节点根据其所服务用地性质，按您的消防规范或消防部门要求所需的消防流量。留空则按“消防流量分析”框中的数值对该节点进行测试。';
$ec_lang['lpn_ff_residual']='需维持的余压';
$ec_lang['lpn_ff_residual_tip']='节点在提供消防流量的同时必须维持的压力。AWWA M31 和 NFPA 291 采用 20 psi（140 kPa）。';
$ec_lang['lpn_ff_design']='设计校核（对系统的影响）';
$ec_lang['lpn_ff_design_tip']='这是一个独立的问题：抽取该流量后，是否有其他部位的压力低于其下限，或流速超过其限值？勾选此项不会增加额外的计算量。';
$ec_lang['lpn_ff_design_no_selection']='设计校核范围已设置为“所选”，但目前未选中任何元件。请选择元件，或选择“全部”选项。';
$ec_lang['lpn_ff_minpressure']='其他部位允许的最低压力';
$ec_lang['lpn_ff_minpressure_tip']='当某个节点正在抽取其消防流量时，若其他节点的压力低于此值，则报告为设计问题。';
$ec_lang['lpn_ff_maxvelocity']='允许的最高流速';
$ec_lang['lpn_ff_maxvelocity_tip']='当抽取消防流量时，若某条管道的流速超过此值，则报告为设计问题。';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='消防流量在节点本身抽取。这是本页面采用的方法，也是常规做法。消火栓、其支管和喷嘴均未建模，因此实际消火栓能提供的流量会小于此处显示的数值。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='使用内置求解器。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='使用 EPANET 求解器。';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='可提供的消防流量是通过搜索得到的，因此每个被测试的节点都要对整个管网求解大约十六次。大型系统可能需要几分钟。您可以随时停止，并保留已经算出的结果。';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='仅测试当前屏幕上显示的这一时刻。消防流量通常应在最大日需水量的基础上测试，请先将管网设为该工况再运行。';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='消防流量运行';
$ec_lang['lpn_ff_calculate']='运行';
$ec_lang['lpn_ff_stop']='停止';
$ec_lang['lpn_ff_working']='正在处理：{total} 个节点中的第 {done} 个。';
$ec_lang['lpn_ff_stopped']='已在 {total} 个节点中完成 {done} 个后停止。下方结果为已完成的部分。';
$ec_lang['lpn_ff_cost']='此次运行共对整个管网求解了 {solves} 次。';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='图纸已更改，消防流量结果已被清除。请重新运行。';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='清除环带';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} 个节点一切正常。{fire} 个节点未能满足消防流量。{design} 个节点影响了系统的其他部位。';
$ec_lang['lpn_ff_summary_error']='{n} 个节点未能得出结果。';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='已测试的全部节点';
$ec_lang['lpn_ff_col_junction']='节点';
$ec_lang['lpn_ff_col_static']='静态压力';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='该节点在抽取任何消防流量之前的压力，系统正常需水仍在运行。测量时未关闭任何设备，因此这并非零流量压力；它与地图上该节点显示的压力相同。AWWA M31 和 NFPA 291 均将此读数称为静态压力，也是消防流量测试的起点。';
$ec_lang['lpn_ff_col_available']='可提供流量';
$ec_lang['lpn_ff_col_required']='所需流量';
$ec_lang['lpn_ff_col_residual']='实际余压';
$ec_lang['lpn_ff_col_atrequired']='所需流量下的压力';
$ec_lang['lpn_ff_col_affected']='最严重影响';
$ec_lang['lpn_ff_col_limit']='设计限值';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='未检查';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='静态压力未达标，因此未检查';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='失败方式';
$ec_lang['lpn_ff_mode_fire']='消防';
$ec_lang['lpn_ff_mode_design']='设计';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='无';
$ec_lang['lpn_ff_col_solves']='求解次数';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='压力和流速';
$ec_lang['lpn_ff_atleast']='大于 {flow}';
$ec_lang['lpn_ff_affect_node']='{id} 降至 {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} 达到 {velocity}';
$ec_lang['lpn_ff_more']='另有 {n} 个受影响';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='还有 {n} 个节点未显示。';
$ec_lang['lpn_ff_design_none']='在任何节点抽取其消防流量期间，所选范围内没有任何部位超出限值。';
$ec_lang['lpn_ff_design_off_note']='本次运行未检查对系统其他部位的影响。';
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
$ec_lang['lpn_ff_iso']='美国保险服务局（ISO）为单个消火栓认可的流量上限为 {flow}。由于我们不知道一个节点可能代表多少个消火栓，此处未应用该上限。';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='在抽取任何消防流量之前，压力已低于余压要求';
$ec_lang['lpn_ff_err_converge']='管网未能收敛。';
$ec_lang['lpn_ff_err_solve']='求解器报告了错误，未给出结果。';
$ec_lang['lpn_ff_err_not_junction']='不是节点';
$ec_lang['lpn_ff_err_unknown']='没有结果。返回的代码为 {code}。';

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
$ec_lang['lpn_file_import_survey']='导入测量点…';
$ec_lang['lpn_file_import_survey_tip']='从文本文件中读取测量点列表，并在每个点创建一个节点，文件未说明的内容一律采用新建元件的设置。不会绘制管道，也不会有任何行在未被指明的情况下被丢弃。读取时使用本项目已在使用的坐标系，无论是否已配准。';
$ec_lang['lpn_survey_read_error']='无法从您的磁盘读取该文件。';
$ec_lang['lpn_survey_cancelled']='未创建任何内容，也未更改任何内容。';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='北坐标';
$ec_lang['lpn_survey_axis_east']='东坐标';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='该文件中没有任何内容。';
$ec_lang['lpn_survey_err_unreadable']='该文件无法作为测量点列表读取。';
$ec_lang['lpn_survey_err_ambiguous_coord']='该文件中有多列都可能是 {axis}（{detail}），本页面不会替您做出选择。请只将其中一列命名为 {axis}，然后重试。';
$ec_lang['lpn_survey_err_no_points']='该文件中没有一行能够被读取为测量点。已读取的行：{detail}';
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
$ec_lang['lpn_survey_format_label']='文件格式：';
$ec_lang['lpn_survey_format_internal']='由文件内部指定';
$ec_lang['lpn_survey_create']='创建节点';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='第一行已跳过：其中未包含本页面能识别的任何列名。';
$ec_lang['lpn_survey_type_label']='元件类型：';
$ec_lang['lpn_survey_confirm_junction']='找到 {n} 个节点。是否继续？';
$ec_lang['lpn_survey_confirm_reservoir']='找到 {n} 个水库。是否继续？';
$ec_lang['lpn_survey_confirm_tank']='找到 {n} 个水箱。是否继续？';
$ec_lang['lpn_survey_report_junction']='已导入 {n} 个节点，其中 {m} 个含有高程。';
$ec_lang['lpn_survey_report_reservoir']='已导入 {n} 个水库，其中 {m} 个含有高程。';
$ec_lang['lpn_survey_report_tank']='已导入 {n} 个水箱，其中 {m} 个含有高程。';
$ec_lang['lpn_survey_report_clean']='文件中的每个点都已成功导入，导入过程中未做任何更改。';
$ec_lang['lpn_survey_report_notes']='导入错误和说明：';
$ec_lang['lpn_survey_sev_error']='错误';
$ec_lang['lpn_survey_sev_warning']='警告';
$ec_lang['lpn_survey_note_line']='第 {line} 行：{sev}：{code}：{text}';
$ec_lang['lpn_survey_note_row_short']='列数少于上方文件格式所需的数量。';
$ec_lang['lpn_survey_note_coord_missing']='{axis} 单元格为空。';
$ec_lang['lpn_survey_note_bad_coord']='{axis} 无法解析为数字。';
$ec_lang['lpn_survey_note_coord_range']='{axis} 超出本项目允许的范围。';
$ec_lang['lpn_survey_note_bad_elev']='高程不是数字，已在不含高程的情况下导入。';
$ec_lang['lpn_survey_note_ambiguous_elev']='有多列都可能是高程，因此都未被读取。';
$ec_lang['lpn_survey_note_blank_rows']='已跳过空行：{detail}。';
$ec_lang['lpn_survey_note_id_duplicate']='该名称在此文件中已使用过，已分配新名称。';
$ec_lang['lpn_survey_note_id_taken']='该名称在项目中已被使用，已分配新名称。';
$ec_lang['lpn_survey_note_id_invalid']='该名称在此处不可用，已分配新名称。';
$ec_lang['lpn_hotkeys_menu_heading']='菜单';
$ec_lang['lpn_hotkeys_menu_term']='菜单键盘快捷键';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+字母</td><td>打开带有该字母的菜单，然后按某一行的字母选择它。使用键盘时会显示这些字母。在 Mac 上，请使用 Ctrl+Option。</td></tr><tr><td>F10</td><td>转到菜单栏。</td></tr></tbody></table>';
$ec_lang['lpn_graphs_menu']='图形';
$ec_lang['lpn_contour_menu']='等值线';
$ec_lang['lpn_contour_tip']='在地图上显示等值线图：节点的颜色沿管道及其两侧扩散，并带有标注的等值线。打开一个框可调整它或将其关闭。';
$ec_lang['lpn_contour_plot']='等值线图';
$ec_lang['lpn_contour_fill']='填充';
$ec_lang['lpn_contour_fill_tip']='“平滑”使颜色从一个等级渐变到下一个等级。“分级”将色键的每个等级以单一颜色填平。';
$ec_lang['lpn_contour_fill_smooth']='平滑';
$ec_lang['lpn_contour_fill_bands']='分级';
$ec_lang['lpn_contour_opacity']='填充不透明度';
$ec_lang['lpn_contour_lines']='等值线';
$ec_lang['lpn_contour_interval']='间隔';
$ec_lang['lpn_contour_buffer']='缓冲范围';
$ec_lang['lpn_contour_buffer_unit']='× 管道长度中位数';
$ec_lang['lpn_contour_buffer_tip']='颜色从每条管道向外延伸的距离，以管道长度中位数的倍数表示。在外侧部分逐渐淡出。';
$ec_lang['lpn_contour_few']='节点太少，无法绘制等值线。';
$ec_lang['lpn_contour_support']='等值线图：{n} 个节点，沿 {p} 条管道插值，并延伸到其两侧最多 {k} 倍管道长度中位数的范围。水泵、阀门或关闭的连接线处没有颜色。';
$ec_lang['lpn_contour_support_lines']='每 {i} {u} 一条等值线。';
$ec_lang['lpn_contour_too_many']='在此间隔下等值线过多；请加大间隔后再绘制。';
$ec_lang['lpn_contour_dem']='节点之间的地面来自 Mapbox DEM';
$ec_lang['lpn_contour_dem_tip']='在节点之间，压力等于插值得到的水头减去来自 Mapbox DEM 的地面高度，因此在管网没有节点的山丘上，它可能低于最低节点压力。请把地面视为等高线地图，而非测量成果。';
$ec_lang['lpn_contour_support_dem']='在节点之间，压力等于插值得到的水头减去来自 Mapbox DEM 的地面高程，约每 {m} m 取样一次。';
$ec_lang['lpn_contour_dem_failed']='无法从 Mapbox DEM 读取地面数据，因此压力仅在节点之间插值。';
$ec_lang['lpn_contour_consent_1']='在地面上绘制压力时，会把您的管网所覆盖的区域（以 Mapbox 地图瓦片编号表示）发送到 api.mapbox.com，以读取该处的地面高度。';
$ec_lang['lpn_contour_consent_2']='这与您项目背后的地图图片是不同的问题。那些图片只说明您在看哪里，而这些瓦片说明您的管网在哪里。Mapbox 将收到这些瓦片编号和您的 IP 地址。我们不发送其他任何内容：没有名称，没有管道，没有项目。我们不保留任何记录，除了您对此问题的回答外，本设备上不存储任何内容。';
$ec_lang['lpn_contour_consent_3']='我们可以把您的管网所在区域的瓦片编号发送给 Mapbox 吗？';
$ec_lang['lpn_contour_consent_4']='如果您选择否，本页面的其他一切仍照常工作，等值线图仅在节点之间绘制。我们会记住“是”，以免再次询问。“否”则完全不会被存储。';
$ec_lang['lpn_sysflow_menu']='流量平衡';
$ec_lang['lpn_sysflow_tip']='在延时模拟期间，绘制产生的总流量和消耗的总流量随时间变化的图形。水池不计入任一总量，因此两条线分开的地方，就是水池正在充水或放水。';
$ec_lang['lpn_sysflow_produced']='产生';
$ec_lang['lpn_sysflow_produced_tip']='由水库和负需水量流入管网的总流量。';
$ec_lang['lpn_sysflow_consumed']='消耗';
$ec_lang['lpn_sysflow_consumed_tip']='所有正需水量之和：节点处从管网取走的水，以及流入水库的任何流量。';
$ec_lang['lpn_copy_title']='将文件标记为新副本？';
$ec_lang['lpn_copy_body']='此文件表明它创建于 {date}，而本浏览器不认识它。这是原始文件（保留同一把锁）还是副本（生成新锁）？';
$ec_lang['lpn_copy_body_nodate']='本浏览器不认识此文件。这是原始文件（保留同一把锁）还是副本（生成新锁）？';
$ec_lang['lpn_copy_original']='原始文件；保留同一把锁';
$ec_lang['lpn_copy_copy']='副本；生成新锁';
$ec_lang['lpn_copy_kept_link']='已将 {name} 作为原始文件打开，它已被移到新位置。现在“保存”会写入此文件。';
$ec_lang['lpn_copy_opened']='已将 {file} 作为副本打开，它带有自己的新锁，将在下次保存文件时一并保存。';
$ec_lang['lpn_scenario_basic']='基本模式';
$ec_lang['lpn_scenario_basic_tip']='勾选时，方案就是您在其中设置的数值。取消勾选时，此菜单还会提供“备选方案预览”表，显示这些数值如何按类别分组，并欢迎您提出反馈。';
$ec_lang['lpn_alt_title']='备选方案预览';
$ec_lang['lpn_alt_note']='只读。基础方案对每个类别都使用基础备选方案。每个方案对任何有更改的类别都有自己的备选方案，它是基础备选方案的子项。数字是其更改过的数值个数。';
$ec_lang['lpn_alt_cat_physical']='物理';
$ec_lang['lpn_alt_cat_demand']='需水量';
$ec_lang['lpn_alt_cat_topology']='元件启用';
$ec_lang['lpn_alt_cat_initial']='初始设置';
$ec_lang['lpn_alt_cat_constituent']='组分';
$ec_lang['lpn_alt_cat_fireflow']='消防流量';
$ec_lang['lpn_alt_cat_energy']='能耗费用';
$ec_lang['lpn_alt_cat_userdata']='自定义属性';
$ec_lang['lpn_alt_cat_text']='文字';
$ec_lang['lpn_reports_calib']='率定';
$ec_lang['lpn_reports_calib_tip']='将率定文件中的现场实测数据与最近一次运行比较：统计量、相关图和均值比较。';
$ec_lang['lpn_calib_title']='率定报告';
$ec_lang['lpn_calib_param']='参数';
$ec_lang['lpn_calib_param_tip']='率定文件所测量的量。每个参数保留一个文件。';
$ec_lang['lpn_calib_load']='载入率定文件…';
$ec_lang['lpn_calib_load_tip']='一个文本文件，每行包含位置 ID、时间和实测值。时间自模拟开始起算，用十进制小时或 时:分 表示。分号开始一段注释。只有时间和数值的行，属于其上方的那个位置。';
$ec_lang['lpn_calib_none']='此参数尚未载入率定文件。';
$ec_lang['lpn_calib_session']='率定文件仅在本次会话中保留，不会随项目保存，也不会保存在本设备上。';
$ec_lang['lpn_calib_file']='{file}：{m} 个位置共 {n} 个测量值。';
$ec_lang['lpn_calib_units']='文件中的数值按本项目的单位读取：{unit}。';
$ec_lang['lpn_calib_missing']='文件中提到但本管网中没有的位置：{ids}。';
$ec_lang['lpn_calib_missing_count']='因位置不在本管网中而被跳过的测量值：{n}。';
$ec_lang['lpn_calib_bad_lines']='无法读取而被跳过的行：{lines}';
$ec_lang['lpn_calib_outside']='超出本次运行所报告时刻的测量值，已跳过：{n}。';
$ec_lang['lpn_calib_no_value']='在其时刻没有计算值的测量值，已跳过：{n}。';
$ec_lang['lpn_calib_single']='这是单时段运行，因此无论文件给出什么时间，每个测量值都与其唯一的结果比较。';
$ec_lang['lpn_calib_needs_run']='尚无可比较的结果。管网计算完成后，报告才会填入内容。';
$ec_lang['lpn_calib_no_pairs']='没有任何测量值可供比较，因此没有可绘制的内容。';
$ec_lang['lpn_calib_tab_stats']='统计量';
$ec_lang['lpn_calib_tab_corr']='相关图';
$ec_lang['lpn_calib_tab_means']='均值比较';
$ec_lang['lpn_calib_col_location']='位置';
$ec_lang['lpn_calib_col_n']='观测数';
$ec_lang['lpn_calib_col_n_tip']='观测数：在此位置上参与比较的测量值个数。';
$ec_lang['lpn_calib_col_obs_mean']='观测均值';
$ec_lang['lpn_calib_col_sim_mean']='计算均值';
$ec_lang['lpn_calib_col_mean_err']='平均误差';
$ec_lang['lpn_calib_col_mean_err_tip']='每个观测值与同一时刻计算值之差的绝对值的平均数。';
$ec_lang['lpn_calib_col_rms_err']='均方根误差';
$ec_lang['lpn_calib_col_rms_err_tip']='均方根误差：观测值与计算值之差的平方的平均数的平方根。';
$ec_lang['lpn_calib_network']='管网';
$ec_lang['lpn_calib_corr_means']='均值之间的相关系数：{r}';
$ec_lang['lpn_calib_corr_none']='均值之间的相关系数：至少需要两个均值不同的位置。';
$ec_lang['lpn_calib_axis_obs']='观测值：{q}';
$ec_lang['lpn_calib_axis_sim']='计算值：{q}';
$ec_lang['lpn_calib_observed']='观测值';
$ec_lang['lpn_calib_computed']='计算值';
$ec_lang['lpn_calib_point']='{id}，{time}：观测值 {o}，计算值 {s}';
$ec_lang['lpn_calib_corr_note']='每个点代表一个测量值。点越靠近对角线，计算值与观测值就越吻合。';
$ec_lang['lpn_calib_ts_point']='{id} 处在 {time} 的测量值：{v}';
$ec_lang['lpn_calib_ts_note']='圆环是率定文件中的实测值。';
$ec_lang['lpn_analyze_menu']='分析';
$ec_lang['lpn_analyze_menu_tip']='在副本上运行管网的各种分析：每个节点的消防流量、每条管道、水泵和阀门的损失，以及按比例放大或缩小的需水量。';
$ec_lang['lpn_ff_design_off']='无';
$ec_lang['lpn_ff_design_all']='全部';
$ec_lang['lpn_ff_design_selected']='所选';
$ec_lang['lpn_ff_rows_more_links']='还有 {n} 条连接线未显示。';
$ec_lang['lpn_crit_menu']='关键性分析…';
$ec_lang['lpn_crit_menu_tip']='依次将每条管道、水泵和阀门从管网中移除，看看系统会损失什么。';
$ec_lang['lpn_crit_title']='关键性分析';
$ec_lang['lpn_crit_intro']='依次将每个元件从管网中移除，并在当前方案下、屏幕上所显示的时间步求解管网。您的项目不会被更改；整个运行都在一份副本上进行。';
$ec_lang['lpn_crit_scope']='要断开的连接线';
$ec_lang['lpn_crit_scope_tip']='全部管道、水泵和阀门，或仅限在地图上选中的那些。请在运行前选择范围。';
$ec_lang['lpn_crit_scope_all']='全部连接线';
$ec_lang['lpn_crit_scope_selected']='所选连接线';
$ec_lang['lpn_crit_minpressure']='允许的最低压力';
$ec_lang['lpn_crit_minpressure_tip']='这与消防流量分析中其他位置的“允许的最低压力”是同一个数值。在此处更改，那里也会随之改变。';
$ec_lang['lpn_crit_col_asset']='元件';
$ec_lang['lpn_crit_col_unserved']='未满足的需水量';
$ec_lang['lpn_crit_col_cutoff']='被切断的节点';
$ec_lang['lpn_crit_col_below']='低于最低压力的节点';
$ec_lang['lpn_crit_summary']='在 {total} 个元件中，有 {n} 个会使需水量得不到满足，或使某个节点的压力低于 {pressure}。';
$ec_lang['lpn_crit_baseline_below']='在没有任何断开时已经低于该压力的节点：{n}。它们不计入。';
$ec_lang['lpn_crit_working']='处理中：{done} / {total} 个元件。';
$ec_lang['lpn_crit_stopped']='已在 {done} / {total} 个元件后停止。下方的结果是已经完成的那些。';
$ec_lang['lpn_crit_no_selection']='未选中任何连接线。请选择连接线，或选择“全部连接线”。';
$ec_lang['lpn_crit_no_links']='此项目目前还没有连接线，因此没有可断开的对象。';
$ec_lang['lpn_crit_busy']='另一项分析正在运行。请停止它，或等待其完成。';
$ec_lang['lpn_crit_skipped']='所选元素中有 {n} 个不是连接线，因此未被断开。';
$ec_lang['lpn_crit_stale']='图形已更改，因此关键性分析结果已被清除。请重新运行。';
$ec_lang['lpn_crit_skipdead']='跳过死端';
$ec_lang['lpn_crit_skipdead_tip']='死端连接线是指：移除它会切断只能经由它到达的节点，且其后没有水库或水池。它的损失就是其后的一切，因此不进行求解。摘要会说明跳过了多少条。';
$ec_lang['lpn_crit_skipped_dead']='已跳过的死端连接线：{n}。每一条都会切断其后的一切。';
