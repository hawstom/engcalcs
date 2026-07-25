<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['ip_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
	<meta name="Keywords" content="irrigation pressure drip sprinkler emitter distribution uniformity main lateral friction loss christiansen" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['ip_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	// Inputs
	Array(
		Array('name' => 'h_supply',        'type' => 'number', 'default' => '7',    'units' => Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), 'label' => $ec_lang['ip_h_supply']),
		Array('name' => 'elev_supply',     'type' => 'number', 'default' => '50',   'units' => Array('m', 'ft'),                                       'label' => $ec_lang['ip_elev_supply']),
		Array('name' => 'q_design',        'type' => 'number', 'default' => '4',    'units' => Array('lph', 'gph'),                                    'label' => $ec_lang['ip_q_design']),
		Array('name' => 'h_design',        'type' => 'number', 'default' => '6',    'units' => Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), 'label' => $ec_lang['ip_h_design']),
		Array('name' => 'x',               'type' => 'number', 'default' => '0.5',  'units' => NULL,                                                    'label' => $ec_lang['ip_x']),
		Array('name' => 'dp_avg',          'type' => 'number', 'default' => '0',    'units' => Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), 'label' => $ec_lang['ip_dp_avg']),
		Array('name' => 'visc',            'type' => 'number', 'default' => '1e-6', 'units' => NULL,                                                    'label' => '<a target="_blank" href="https://www.engineersedge.com/fluid_flow/kinematic-viscosity-table.htm">'.$ec_lang['dw_kinematic_viscosity_short'].'</a><span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['dw_kinematic_viscosity_tip'])).'"><span class="ec-tip">?</span></span>'),
		Array('name' => 'se',              'type' => 'number', 'default' => '0.5',  'units' => Array('m', 'mm', 'ft', 'in'),                            'label' => $ec_lang['ip_se']),
		Array('name' => 'sl',              'type' => 'number', 'default' => '0.5',  'units' => Array('m', 'mm', 'ft', 'in'),                            'label' => $ec_lang['ip_sl']),
		Array('name' => 'n_e',             'type' => 'number', 'default' => '10',   'units' => NULL,                                                    'label' => $ec_lang['ip_n_e']),
		Array('name' => 'n_l',             'type' => 'number', 'default' => '10',   'units' => NULL,                                                    'label' => $ec_lang['ip_n_l']),
		Array('name' => 'd',               'type' => 'number', 'default' => '25',   'units' => Array('mm', 'm', 'in', 'ft'),                            'label' => $ec_lang['ip_d']),
		Array('name' => 'h_max_allow',     'type' => 'number', 'default' => '',     'units' => Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['ip_max_head_tip'])).'">'.$ec_lang['ip_max_head'].' <span class="ec-tip">?</span></span>'),
	),
	// Results
	Array(
		Array('name' => 'q_supply',      'units' => Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd', 'lph', 'gph'), 'label' => $ec_lang['ip_q_supply']),
		Array('name' => 'h_far',         'units' => Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), 'label' => $ec_lang['ip_h_far']),
		Array('name' => 'q_critical',    'units' => Array('lph', 'gph'),                                    'label' => $ec_lang['ip_q_critical']),
		Array('name' => 'q_avg_lateral', 'units' => Array('lph', 'gph'),                                    'label' => $ec_lang['ip_q_avg_lateral']),
		Array('name' => 'q_avg_field',   'units' => Array('lph', 'gph'),                                    'label' => $ec_lang['ip_q_avg_field']),
		Array('name' => 'du_estimate',   'units' => NULL,                                                   'label' => $ec_lang['ip_du_estimate']),
		Array('name' => 'q_ratio',       'units' => NULL,                                                   'label' => $ec_lang['ip_q_ratio']),
		Array('name' => 'a_e',           'units' => Array('m2', 'mm2', 'ft2', 'in2'),                        'label' => $ec_lang['ip_a_e']),
		Array('name' => 'pr',            'units' => Array('mmph', 'inph'),                                   'label' => $ec_lang['ip_pr']),
		Array('name' => 'q_lat',         'units' => Array('lph', 'gph'),                                     'label' => $ec_lang['ip_q_lat']),
		Array('name' => 'q_sys',         'units' => Array('lph', 'gph'),                                     'label' => $ec_lang['ip_q_sys']),
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
					<?=$ec_lang['ip_reach_table_title']?>
					<a href="javascript:EngCalcs.addSingleCalcRow()">+</a>/<a href="javascript:EngCalcs.deleteSingleCalcRow()">-</a> <?=$ec_lang['points_data_help']?>
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
					<?php echoUnitSelect($name = 'lengthu', $units = Array('m', 'ft'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_diameter']?><br />
					<?php echoUnitSelect($name = 'diameteru', $units = Array('mm', 'in', 'm', 'ft'), $indent_string); ?>
				</th>
				<th>
					<a target="_blank" href="https://nepis.epa.gov/Exe/ZyNET.exe/P1007WWU.txt?ZyActionD=ZyDocument&Client=EPA&Index=2000%20Thru%202005&SearchMethod=1&TocRestrict=n&&IntQFieldOp=0&ExtQFieldOp=0&XmlQuery=&File=D%3A%5CZYFILES%5CINDEX%20DATA%5C00THRU05%5CTXT%5C00000024%5CP1007WWU.txt&User=ANONYMOUS&Password=anonymous&SortMethod=h%7C-&MaximumDocuments=1&FuzzyDegree=0&ImageQuality=r75g8/r75g8/x150y150g16/i425&Display=hpfr&DefSeekPage=x&SearchBack=ZyActionL&Back=ZyActionS&BackDesc=Results%20page&MaximumPages=1&ZyEntry=31"><?=$ec_lang['ip_roughness']?></a><span class="ec-help" title="<?=htmlspecialchars(strip_tags($ec_lang['dw_roughness_tip']))?>"><span class="ec-tip">?</span></span><br />
					<?php echoUnitSelect($name = 'roughnessu', $units = Array('mm', 'in', 'm', 'ft'), $indent_string); ?>
				</th>
				<th>
					<a target="_blank" href="https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html"><?=$ec_lang['mphl_total_junction_k_short']?></a><span class="ec-help" title="<?=htmlspecialchars(strip_tags($ec_lang['mphl_total_junction_k_tip']))?>"><span class="ec-tip">?</span></span>
				</th>
				<th>
					<?=$ec_lang['ip_elev_ds']?><br />
					<?php echoUnitSelect($name = 'elevu', $units = Array('m', 'ft'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_flow']?><br />
					<?php echoUnitSelect($name = 'q_usu', $units = Array('lph', 'gph', 'lps', 'm3ps', 'ft3ps', 'gpm'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_press']?><br />
					<?php echoUnitSelect($name = 'h_usu', $units = Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_flow']?><br />
					<?php echoUnitSelect($name = 'q_dsu', $units = Array('lph', 'gph', 'lps', 'm3ps', 'ft3ps', 'gpm'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_press']?><br />
					<?php echoUnitSelect($name = 'h_dsu', $units = Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_v617']?><br />
					<?php echoUnitSelect($name = 'vu', $units = Array('mps', 'ftps'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_hv617']?><br />
					<?php echoUnitSelect($name = 'hvu', $units = Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_hf']?><br />
					<?php echoUnitSelect($name = 'hfu', $units = Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_hm']?><br />
					<?php echoUnitSelect($name = 'hmu', $units = Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_hl']?><br />
					<?php echoUnitSelect($name = 'hlu', $units = Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), $indent_string); ?>
				</th>
			</tr>
		</thead>
		<tbody id="CalcsBody">
		</tbody>
	</table>
	<div class='d-print-none' style='float:left;'>
		<p>
			<?=$ec_lang['points_data_title']?>
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
