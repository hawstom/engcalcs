<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['bpn_main_title'];
$html_desc = $ec_lang['bpn_main_desc'];
echoHeader("EngCalcs", $html_title, "");
?>
<h2><?=$ec_lang['bpn_main_desc']?></h2>
<p class="collapse show d-print-none" id="relatedCalcs">
	<?=$ec_lang['ec_related_calcs']?> <a href="Looped-Network.php"><?=$ec_lang['lpn_main_menu']?></a> <a data-bs-toggle="collapse" href="#relatedCalcs" aria-expanded="true" aria-controls="relatedCalcs"><?=$ec_lang['view_hide_line']?></a>
</p>
<?php
echoCalculatorForm(
	// Inputs
	Array(
		Array('name' => 'elev_source', 'type' => 'number', 'default' => Array('us' => '330', 'si' => '100'),  'units' => 'distance_site', 'label' => $ec_lang['bpn_elev_source']),
		Array('name' => 'h_source1',   'type' => 'number', 'default' => Array('us' => '60', 'si' => '40'),   'units' => 'partial_head', 'label' => ecTipLabel($ec_lang['bpn_supply1_h'], $ec_lang['bpn_h_source_tip'])),
		Array('name' => 'h_source2',   'type' => 'number', 'default' => '',     'units' => 'partial_head', 'label' => ecTipLabel($ec_lang['bpn_supply2_h'], $ec_lang['bpn_supply_pt_tip'])),
		Array('name' => 'q_source2',   'type' => 'number', 'default' => '',     'units' => 'flow_node', 'label' => $ec_lang['bpn_supply2_q']),
		Array('name' => 'h_source3',   'type' => 'number', 'default' => '',     'units' => 'partial_head', 'label' => $ec_lang['bpn_supply3_h']),
		Array('name' => 'q_source3',   'type' => 'number', 'default' => '',     'units' => 'flow_node', 'label' => $ec_lang['bpn_supply3_q']),
		Array('name' => 'visc',        'type' => 'number', 'default' => '1e-6', 'units' => NULL, 'label' => ecLinkTipLabel('https://www.engineersedge.com/fluid_flow/kinematic-viscosity-table.htm', $ec_lang['dw_kinematic_viscosity_short'], $ec_lang['dw_kinematic_viscosity_tip'])),
		Array('name' => 'h_max_allow', 'type' => 'number', 'default' => '',     'units' => 'partial_head', 'label' => ecTipLabel($ec_lang['ip_max_head'], $ec_lang['ip_max_head_tip'])),
		Array('name' => 'demand_mult', 'type' => 'number', 'default' => '1',    'units' => NULL, 'label' => ecTipLabel($ec_lang['bpn_demand_mult'], $ec_lang['bpn_demand_mult_tip'])),
	),
	// Results
	Array(
		Array('name' => 'q_total',  'units' => 'flow_total', 'label' => ecTipLabel($ec_lang['bpn_q_total'], $ec_lang['bpn_q_total_tip'])),
		Array('name' => 'h_supply', 'units' => 'partial_head', 'label' => ecTipLabel($ec_lang['bpn_h_supply'], $ec_lang['bpn_h_supply_tip'])),
		Array('name' => 'p_min',    'units' => 'partial_head', 'label' => ecTipLabel($ec_lang['bpn_p_min'], $ec_lang['bpn_p_min_tip'])),
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
				<th><?=ecTipLabel($ec_lang['bpn_id'], $ec_lang['bpn_id_tip'])?></th>
				<th><?=ecTipLabel($ec_lang['bpn_upstream'], $ec_lang['bpn_upstream_tip'])?></th>
				<th>
					<?=$ec_lang['ip_length']?><br />
					<?php echoUnitSelect($name = 'lengthu', $units = 'distance_site', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_diameter']?><br />
					<?php echoUnitSelect($name = 'diameteru', $units = 'distance_small', $indent_string); ?>
				</th>
				<th>
					<?=ecTipLabel('<span id="bpn_roughness_symbol">C</span>', $ec_lang['bpn_roughness_tip'])?><br />
					<?php echoUnitSelect($name = 'roughnessu', $units = 'roughness', $indent_string); ?>
				</th>
				<th>
					<span class="ec-narrowcol"><?=ecLinkTipLabel('https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html', $ec_lang['mphl_total_junction_k_short'], $ec_lang['mphl_total_junction_k_tip'])?></span>
				</th>
				<th>
					<?=ecTipLabel($ec_lang['bpn_demand'], $ec_lang['bpn_demand_tip'])?><br />
					<?php echoUnitSelect($name = 'demandu', $units = 'flow_node', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['bpn_elev_down']?><br />
					<?php echoUnitSelect($name = 'elevu', $units = 'distance_site', $indent_string); ?>
				</th>
				<th>
					<?=ecTipLabel($ec_lang['bpn_q_line'], $ec_lang['bpn_q_line_tip'])?><br />
					<?php echoUnitSelect($name = 'q_lineu', $units = 'flow_node', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_v617']?><br />
					<?php echoUnitSelect($name = 'vu', $units = 'velocity', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['ip_hl']?><br />
					<?php echoUnitSelect($name = 'hlu', $units = 'partial_head', $indent_string); ?>
				</th>
				<th>
					<?=ecTipLabel($ec_lang['bpn_p_down'], $ec_lang['bpn_p_down_tip'])?><br />
					<?php echoUnitSelect($name = 'p_downu', $units = 'partial_head', $indent_string); ?>
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
	<dt><?=$ec_lang['bpn_notes_epanet_term']?></dt><dd><?=$ec_lang['bpn_notes_epanet_def']?></dd>
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
<script src="/engcalcs/js/PipeHydraulics.lib.js?v=<?=filemtime(__DIR__.'/js/PipeHydraulics.lib.js')?>"></script>
<script src="/engcalcs/js/branched-network.js?v=<?=filemtime(__DIR__.'/js/branched-network.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
