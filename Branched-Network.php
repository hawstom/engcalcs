<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['bpn_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['bpn_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	// Inputs
	Array(
		Array('name' => 'elev_source', 'type' => 'number', 'default' => '100',  'units' => Array('m', 'ft'), 'label' => $ec_lang['bpn_elev_source']),
		Array('name' => 'h_source1',   'type' => 'number', 'default' => '30',   'units' => Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['bpn_h_source_tip'])).'">'.$ec_lang['bpn_supply1_h'].' <span class="ec-tip">?</span></span>'),
		Array('name' => 'h_source2',   'type' => 'number', 'default' => '',     'units' => Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['bpn_supply_pt_tip'])).'">'.$ec_lang['bpn_supply2_h'].' <span class="ec-tip">?</span></span>'),
		Array('name' => 'q_source2',   'type' => 'number', 'default' => '',     'units' => Array('lps', 'm3ps', 'gpm', 'ft3ps', 'lph', 'gph'), 'label' => $ec_lang['bpn_supply2_q']),
		Array('name' => 'h_source3',   'type' => 'number', 'default' => '',     'units' => Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), 'label' => $ec_lang['bpn_supply3_h']),
		Array('name' => 'q_source3',   'type' => 'number', 'default' => '',     'units' => Array('lps', 'm3ps', 'gpm', 'ft3ps', 'lph', 'gph'), 'label' => $ec_lang['bpn_supply3_q']),
		Array('name' => 'visc',        'type' => 'number', 'default' => '1e-6', 'units' => NULL, 'label' => '<a target="_blank" href="https://www.engineersedge.com/fluid_flow/kinematic-viscosity-table.htm">'.$ec_lang['dw_kinematic_viscosity_short'].'</a><span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['dw_kinematic_viscosity_tip'])).'"><span class="ec-tip">?</span></span>'),
		Array('name' => 'h_max_allow', 'type' => 'number', 'default' => '',     'units' => Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['ip_max_head_tip'])).'">'.$ec_lang['ip_max_head'].' <span class="ec-tip">?</span></span>'),
		Array('name' => 'demand_mult', 'type' => 'number', 'default' => '1',    'units' => NULL, 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['bpn_demand_mult_tip'])).'">'.$ec_lang['bpn_demand_mult'].' <span class="ec-tip">?</span></span>'),
	),
	// Results
	Array(
		Array('name' => 'q_total',  'units' => Array('lps', 'm3ps', 'gpm', 'ft3ps', 'mld', 'mgd', 'lph', 'gph'), 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['bpn_q_total_tip'])).'">'.$ec_lang['bpn_q_total'].' <span class="ec-tip">?</span></span>'),
		Array('name' => 'h_supply', 'units' => Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['bpn_h_supply_tip'])).'">'.$ec_lang['bpn_h_supply'].' <span class="ec-tip">?</span></span>'),
		Array('name' => 'p_min',    'units' => Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['bpn_p_min_tip'])).'">'.$ec_lang['bpn_p_min'].' <span class="ec-tip">?</span></span>'),
	),
	$flagFormAppend = true
);
function echoCalculatorFormAppend() {
	global $ec_lang;
	$indent_string = "\t\t\t\t\t";
?>
	<p>
		<label for="method"><strong><?=$ec_lang['bpn_method']?></strong></label>
		<select name="method" id="method" onchange="EngCalcs.submitForm()">
			<option value="hw"><?=$ec_lang['bpn_method_hw']?></option>
			<option value="dw"><?=$ec_lang['bpn_method_dw']?></option>
			<option value="manning"><?=$ec_lang['bpn_method_manning']?></option>
		</select>
	</p>
	<p id="bpn_topology_warn" class="ec-status-warn"></p>
	<table id="CalcsTable" style="float: left;">
		<thead>
			<tr>
				<th colspan="12">
					<?=$ec_lang['bpn_line_table_title']?>
					<a href="javascript:EngCalcs.addSingleCalcRow()">+</a>/<a href="javascript:EngCalcs.deleteSingleCalcRow()">-</a> <?=$ec_lang['points_data_help']?>
				</th>
			</tr>
			<tr>
				<th><span class="ec-help" title="<?=htmlspecialchars(strip_tags($ec_lang['bpn_id_tip']))?>"><?=$ec_lang['bpn_id']?> <span class="ec-tip">?</span></span></th>
				<th><span class="ec-help" title="<?=htmlspecialchars(strip_tags($ec_lang['bpn_upstream_tip']))?>"><?=$ec_lang['bpn_upstream']?> <span class="ec-tip">?</span></span></th>
				<th>
					<?=$ec_lang['ip_length']?><br />
					<?php echoUnitSelect($name = 'lengthu', $units = Array('m', 'ft'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_diameter']?><br />
					<?php echoUnitSelect($name = 'diameteru', $units = Array('mm', 'in', 'm', 'ft'), $indent_string); ?>
				</th>
				<th>
					<span class="ec-help" title="<?=htmlspecialchars(strip_tags($ec_lang['bpn_roughness_tip']))?>"><span id="bpn_roughness_symbol">C</span> <span class="ec-tip">?</span></span><br />
					<?php echoUnitSelect($name = 'roughnessu', $units = Array('mm', 'in', 'm', 'ft'), $indent_string); ?>
				</th>
				<th>
					<span class="ec-narrowcol"><a target="_blank" href="https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html"><?=$ec_lang['mphl_total_junction_k_short']?></a><span class="ec-help" title="<?=htmlspecialchars(strip_tags($ec_lang['mphl_total_junction_k_tip']))?>"><span class="ec-tip">?</span></span></span>
				</th>
				<th>
					<span class="ec-help" title="<?=htmlspecialchars(strip_tags($ec_lang['bpn_demand_tip']))?>"><?=$ec_lang['bpn_demand']?> <span class="ec-tip">?</span></span><br />
					<?php echoUnitSelect($name = 'demandu', $units = Array('lps', 'm3ps', 'gpm', 'ft3ps', 'lph', 'gph'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['bpn_elev_down']?><br />
					<?php echoUnitSelect($name = 'elevu', $units = Array('m', 'ft'), $indent_string); ?>
				</th>
				<th>
					<span class="ec-help" title="<?=htmlspecialchars(strip_tags($ec_lang['bpn_q_line_tip']))?>"><?=$ec_lang['bpn_q_line']?> <span class="ec-tip">?</span></span><br />
					<?php echoUnitSelect($name = 'q_lineu', $units = Array('lps', 'm3ps', 'gpm', 'ft3ps', 'lph', 'gph'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_v617']?><br />
					<?php echoUnitSelect($name = 'vu', $units = Array('mps', 'ftps'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_hl']?><br />
					<?php echoUnitSelect($name = 'hlu', $units = Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), $indent_string); ?>
				</th>
				<th>
					<span class="ec-help" title="<?=htmlspecialchars(strip_tags($ec_lang['bpn_p_down_tip']))?>"><?=$ec_lang['bpn_p_down']?> <span class="ec-tip">?</span></span><br />
					<?php echoUnitSelect($name = 'p_downu', $units = Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi'), $indent_string); ?>
				</th>
			</tr>
		</thead>
		<tbody id="CalcsBody">
		</tbody>
	</table>
	<div class="d-print-none" style="float:left;">
		<p>
			<?=$ec_lang['points_data_title']?>
			<br />
			<button type="button" id="points_data_copy"><?=$ec_lang['points_data_copy']?></button>
			<button type="button" id="points_data_paste"><?=$ec_lang['points_data_paste']?></button>
		</p>
		<textarea id="points_data" cols="30"></textarea>
	</div>
	<div style="clear: both;"></div>
<?php
}
?>

<h2><?=$ec_lang['bpn_sketch_title']?></h2>
<p class="d-print-none">
	<label><input type="checkbox" id="bpn_show_length" onchange="EngCalcs.bpnToggleSketch('length', this.checked)" /> <span style="color:#2e7d32"><?=$ec_lang['bpn_show_length']?></span></label>
	<label><input type="checkbox" id="bpn_show_diameter" onchange="EngCalcs.bpnToggleSketch('diameter', this.checked)" /> <span style="color:#bf4b2b"><?=$ec_lang['bpn_show_diameter']?></span></label>
	<label><input type="checkbox" id="bpn_show_q" onchange="EngCalcs.bpnToggleSketch('q', this.checked)" /> <span style="color:#1565c0"><?=$ec_lang['bpn_show_q']?></span></label>
	<label><input type="checkbox" id="bpn_show_elevation" onchange="EngCalcs.bpnToggleSketch('elevation', this.checked)" /> <span style="color:#8b5a2b"><?=$ec_lang['bpn_show_elevation']?></span></label>
	<label><input type="checkbox" id="bpn_show_p" onchange="EngCalcs.bpnToggleSketch('p', this.checked)" /> <span style="color:#455a64"><?=$ec_lang['bpn_show_p']?></span></label>
</p>
<div id="bpn_sketch" style="overflow-x:auto"></div>

<?php echoFeedback(); ?>
<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['bpn_notes_1_term']?></dt><dd><?=$ec_lang['bpn_notes_1_def']?></dd>
	<dt><?=$ec_lang['bpn_notes_2_term']?></dt><dd><?=$ec_lang['bpn_notes_2_def']?></dd>
	<dt><?=$ec_lang['bpn_notes_3_term']?></dt><dd><?=$ec_lang['bpn_notes_3_def']?></dd>
</dl>
<script>
EngCalcs.pageConfig = {
	bpn_topology_warn: <?=json_encode($ec_lang['bpn_topology_warn'])?>,
	bpn_topology_warn_short: <?=json_encode($ec_lang['bpn_topology_warn_short'])?>,
	bpn_pressure_warn: <?=json_encode($ec_lang['bpn_pressure_warn'])?>,
	bpn_pressure_warn_short: <?=json_encode($ec_lang['bpn_pressure_warn_short'])?>,
	ip_pressure_high: <?=json_encode($ec_lang['ip_pressure_high'])?>,
	ip_pressure_high_short: <?=json_encode($ec_lang['ip_pressure_high_short'])?>,
	mhp_vel_high: <?=json_encode($ec_lang['mhp_vel_high'])?>,
	mhp_vel_high_short: <?=json_encode($ec_lang['mhp_vel_high_short'])?>,
	mhp_vel_low: <?=json_encode($ec_lang['mhp_vel_low'])?>,
	mhp_vel_low_short: <?=json_encode($ec_lang['mhp_vel_low_short'])?>,
	bpn_source_label: <?=json_encode($ec_lang['bpn_source_label'])?>
};
</script>
<script src="/engcalcs/js/branched-network.js?v=<?=filemtime(__DIR__.'/js/branched-network.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
