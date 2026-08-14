<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['ip_main_title'];
$html_desc = $ec_lang['ip_main_desc'];
echoHeader("EngCalcs", $html_title, "");
?>
<h2><?=$ec_lang['ip_main_desc']?></h2>
<p class="collapse show d-print-none" id="relatedCalcs">
	<?=$ec_lang['ec_related_calcs']?> <a href="Branched-Network.php"><?=$ec_lang['bpn_main_menu']?></a> &middot; <a href="Looped-Network.php"><?=$ec_lang['lpn_main_menu']?></a> <a data-bs-toggle="collapse" href="#relatedCalcs" aria-expanded="true" aria-controls="relatedCalcs"><?=$ec_lang['view_hide_line']?></a>
</p>
<?php
echoCalculatorForm(
	// Inputs
	Array(
		Array('name' => 'h_supply',        'type' => 'number', 'default' => Array('us' => '30', 'si' => '20'),    'units' => 'partial_head', 'label' => $ec_lang['ip_h_supply']),
		Array('name' => 'elev_supply',     'type' => 'number', 'default' => Array('us' => '165', 'si' => '50'),   'units' => 'distance_site',                                       'label' => $ec_lang['ip_elev_supply']),
		Array('name' => 'q_design',        'type' => 'number', 'default' => Array('us' => '1', 'si' => '4'),    'units' => 'flow_emitter',                                    'label' => $ec_lang['ip_q_design']),
		Array('name' => 'h_design',        'type' => 'number', 'default' => Array('us' => '15', 'si' => '10'),    'units' => 'partial_head', 'label' => $ec_lang['ip_h_design']),
		Array('name' => 'x',               'type' => 'number', 'default' => '0.5',  'units' => NULL,                                                    'label' => $ec_lang['ip_x']),
		Array('name' => 'dp_avg',          'type' => 'number', 'default' => '0',    'units' => 'partial_head', 'label' => $ec_lang['ip_dp_avg']),
		Array('name' => 'visc',            'type' => 'number', 'default' => '1e-6', 'units' => NULL,                                                    'label' => ecLinkTipLabel('https://www.engineersedge.com/fluid_flow/kinematic-viscosity-table.htm', $ec_lang['dw_kinematic_viscosity_short'], $ec_lang['dw_kinematic_viscosity_tip'])),
		Array('name' => 'se',              'type' => 'number', 'default' => Array('us' => '2', 'si' => '0.6'),  'units' => 'distance_medium',                            'label' => $ec_lang['ip_se']),
		Array('name' => 'sl',              'type' => 'number', 'default' => Array('us' => '5', 'si' => '1.5'),  'units' => 'distance_medium',                            'label' => $ec_lang['ip_sl']),
		Array('name' => 'n_e',             'type' => 'number', 'default' => '10',   'units' => NULL,                                                    'label' => $ec_lang['ip_n_e']),
		Array('name' => 'n_l',             'type' => 'number', 'default' => '10',   'units' => NULL,                                                    'label' => $ec_lang['ip_n_l']),
		Array('name' => 'd',               'type' => 'number', 'default' => Array('us' => '0.75', 'si' => '20'),   'units' => 'distance_small',                            'label' => $ec_lang['ip_d']),
		Array('name' => 'h_max_allow',     'type' => 'number', 'default' => '',     'units' => 'partial_head', 'label' => ecTipLabel($ec_lang['ip_max_head'], $ec_lang['ip_max_head_tip'])),
	),
	// Results
	Array(
		Array('name' => 'q_supply',      'units' => 'flow_supply', 'label' => $ec_lang['ip_q_supply']),
		Array('name' => 'h_far',         'units' => 'partial_head', 'label' => $ec_lang['ip_h_far']),
		Array('name' => 'q_critical',    'units' => 'flow_emitter',                                    'label' => $ec_lang['ip_q_critical']),
		Array('name' => 'q_avg_lateral', 'units' => 'flow_emitter',                                    'label' => $ec_lang['ip_q_avg_lateral']),
		Array('name' => 'q_avg_field',   'units' => 'flow_emitter',                                    'label' => $ec_lang['ip_q_avg_field']),
		Array('name' => 'du_estimate',   'units' => NULL,                                                   'label' => $ec_lang['ip_du_estimate']),
		Array('name' => 'q_ratio',       'units' => NULL,                                                   'label' => $ec_lang['ip_q_ratio']),
		Array('name' => 'a_e',           'units' => 'flow_area',                        'label' => $ec_lang['ip_a_e']),
		Array('name' => 'pr',            'units' => 'application_rate',                                   'label' => $ec_lang['ip_pr']),
		Array('name' => 'q_lat',         'units' => 'flow_emitter',                                     'label' => $ec_lang['ip_q_lat']),
		Array('name' => 'q_sys',         'units' => 'flow_emitter',                                     'label' => $ec_lang['ip_q_sys']),
		Array('name' => 't_run',         'units' => NULL,                                                    'label' => $ec_lang['ip_t_run']),
	),
	$flagFormAppend = true
);
function echoCalculatorFormAppend() {
	global $ec_lang;
	$indent_string = "\t\t\t\t\t";
?>
	<p id="ip_msg" class="ec-status-warn"></p>
	<p id="ip_worst_case_warn" class="ec-status-warn"></p>
	<table id="CalcsTable" style='float: left;'>
		<thead>
			<tr>
				<th colspan="16">
					<?=$ec_lang['ip_reach_table_heading']?>
					<a href="javascript:EngCalcs.addSingleCalcRow()">+</a>/<a href="javascript:EngCalcs.deleteSingleCalcRow()">-</a> <?=$ec_lang['points_data_note']?>
				</th>
			</tr>
			<tr>
				<th colspan="7"><?=$ec_lang['ip_group_reach']?></th>
				<th colspan="2"><?=$ec_lang['ip_group_upstream']?></th>
				<th colspan="2"><?=$ec_lang['ip_group_downstream']?></th>
				<th colspan="5"><?=$ec_lang['ip_group_loss']?></th>
			</tr>
			<tr>
				<th><?=$ec_lang['ip_is_lateral']?></th>
				<th><?=$ec_lang['ip_count']?></th>
				<th>
					<?=$ec_lang['ip_length']?><br />
					<?php echoUnitSelect($name = 'lengthu', $units = 'distance_site', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_diameter']?><br />
					<?php echoUnitSelect($name = 'diameteru', $units = 'distance_small', $indent_string); ?>
				</th>
				<th>
					<?=ecLinkTipLabel('https://nepis.epa.gov/Exe/ZyNET.exe/P1007WWU.txt?ZyActionD=ZyDocument&Client=EPA&Index=2000%20Thru%202005&SearchMethod=1&TocRestrict=n&&IntQFieldOp=0&ExtQFieldOp=0&XmlQuery=&File=D%3A%5CZYFILES%5CINDEX%20DATA%5C00THRU05%5CTXT%5C00000024%5CP1007WWU.txt&User=ANONYMOUS&Password=anonymous&SortMethod=h%7C-&MaximumDocuments=1&FuzzyDegree=0&ImageQuality=r75g8/r75g8/x150y150g16/i425&Display=hpfr&DefSeekPage=x&SearchBack=ZyActionL&Back=ZyActionS&BackDesc=Results%20page&MaximumPages=1&ZyEntry=31', $ec_lang['ip_roughness'], $ec_lang['dw_roughness_tip'])?><br />
					<?php echoUnitSelect($name = 'roughnessu', $units = 'roughness', $indent_string); ?>
				</th>
				<th>
					<?=ecLinkTipLabel('https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html', $ec_lang['mphl_total_junction_k_short'], $ec_lang['mphl_total_junction_k_tip'])?>
				</th>
				<th>
					<?=$ec_lang['ip_elev_ds']?><br />
					<?php echoUnitSelect($name = 'elevu', $units = 'distance_site', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_flow']?><br />
					<?php echoUnitSelect($name = 'q_usu', $units = 'flow_emitter', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_press']?><br />
					<?php echoUnitSelect($name = 'h_usu', $units = 'partial_head', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_flow']?><br />
					<?php echoUnitSelect($name = 'q_dsu', $units = 'flow_emitter', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_press']?><br />
					<?php echoUnitSelect($name = 'h_dsu', $units = 'partial_head', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_v617']?><br />
					<?php echoUnitSelect($name = 'vu', $units = 'velocity', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_hv617']?><br />
					<?php echoUnitSelect($name = 'hvu', $units = 'velocity_head', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_hf']?><br />
					<?php echoUnitSelect($name = 'hfu', $units = 'partial_head', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_hm']?><br />
					<?php echoUnitSelect($name = 'hmu', $units = 'partial_head', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_hl']?><br />
					<?php echoUnitSelect($name = 'hlu', $units = 'partial_head', $indent_string); ?>
				</th>
			</tr>
		</thead>
		<tbody id="CalcsBody">
		</tbody>
	</table>
	<div class='d-print-none' style='float:left;'>
		<p>
			<?=$ec_lang['points_data_heading']?>
			<br />
			<button type="button" id="points_data_copy"><?=$ec_lang['points_data_copy']?></button>
			<button type="button" id="points_data_paste"><?=$ec_lang['points_data_paste']?></button>
		</p>
		<textarea id='points_data' cols='30'></textarea>
	</div>
	<div style='clear: both;'></div>
	<p id="ip_elev_warn" class="ec-status-warn"></p>
<?php
}
?>
<?php echoFeedback(); ?>
<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['odt_notes_2_term']?></dt><dd><?=$ec_lang['ip_notes_1_def']?></dd>
	<dt><?=$ec_lang['ip_notes_2_term']?></dt><dd><?=$ec_lang['ip_notes_2_def']?></dd>
	<dt><?=$ec_lang['ip_notes_3_term']?></dt><dd><?=$ec_lang['ip_notes_3_def']?></dd>
	<dt><?=$ec_lang['rc_notes_4_term']?></dt><dd><?=$ec_lang['ip_notes_4_def']?></dd>
	<dt><?=$ec_lang['ip_notes_5_term']?></dt><dd><?=$ec_lang['ip_notes_5_def']?></dd>
</dl>
<script>
EngCalcs.pageConfig = {
	ip_no_solution: <?=json_encode($ec_lang['ip_no_solution'])?>,
	ip_elev_ds_missing_warn: <?=json_encode($ec_lang['ip_elev_ds_missing_warn'])?>,
	ip_pressure_warn: <?=json_encode($ec_lang['ip_pressure_warn'])?>,
	ip_pressure_warn_short: <?=json_encode($ec_lang['ip_pressure_warn_short'])?>,
	ip_pressure_high: <?=json_encode($ec_lang['ip_pressure_high'])?>,
	ip_pressure_high_short: <?=json_encode($ec_lang['ip_pressure_high_short'])?>,
	mhp_vel_high: <?=json_encode($ec_lang['mhp_vel_high'])?>,
	mhp_vel_high_short: <?=json_encode($ec_lang['mhp_vel_high_short'])?>,
	mhp_vel_low: <?=json_encode($ec_lang['mhp_vel_low'])?>,
	mhp_vel_low_short: <?=json_encode($ec_lang['mhp_vel_low_short'])?>,
	ip_worst_case_warn: <?=json_encode($ec_lang['ip_worst_case_warn'])?>
};
</script>
<script src="/engcalcs/js/irrigation-pressure.js?v=<?=filemtime(__DIR__.'/js/irrigation-pressure.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
