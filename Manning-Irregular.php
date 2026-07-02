<?php 
require_once ('lib/base.inc.php');
$html_title = $ec_lang['mi_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?php echo $ec_lang['mi_main_desc'] ?></h2>

<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'ws', 'type' => 'number', 'default' => '1', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mi_waterSurfaceElevation']),
		Array('name' => 's0', 'type' => 'number', 'default' => '0.001', 'units' => Array('grade', 'gradePercent'), 'label' => $ec_lang['mtc_channel_slope']),
	),
	//Results
	Array(
		Array('name' => 'q_617', 'units' => Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), 'label' => $ec_lang['mi_q_617']),
		Array('name' => 'v_check', 'units' => NULL, 'label' => $ec_lang['mtc_vel_check']),
	),
	$flagFormAppend = true
);
function echoCalculatorFormAppend() {
		global $ec_units, $ec_lang;
		$indent_string = "\t\t\t\t\t";
?>
	<table id="CalcsTable" style='float: left;'>
		<thead>
			<tr>
				<th colspan="17">
					<?=$ec_lang['mi_xSecPoints']?>
					<a href="javascript:EngCalcs.addSingleCalcRow()">+</a>/<a href="javascript:EngCalcs.deleteSingleCalcRow()">-</a> <?=$ec_lang['points_data_help']?>
				</th>
			</tr>
			<tr>
				<th colspan="5"><?=$ec_lang['mi_groupPoint']?></th>
				<th colspan="3"><?=$ec_lang['mi_groupSegment']?></th>
				<th colspan="6"><?=$ec_lang['mi_groupRegion']?></th>
			</tr>
			<tr>
				<th>
					<?=$ec_lang['mi_station']?><br />
					<br />
					<?php echoUnitSelect($name = 'stationu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_elevation']?>
					<br />
					<?php echoUnitSelect($name = 'elevationu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_n']?>
				</th>
				<th>
					<?=$ec_lang['mi_is_bank']?>
				</th>
				<th>
					<?=$ec_lang['mi_tau']?>
					<br />
					<?php echoUnitSelect($name = 'tauu', $units = Array('npm2', 'psf'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_t']?>
					<br />
					<?php echoUnitSelect($name = 'tu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_pw']?>
					<br />
					<?php echoUnitSelect($name = 'pwu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_a']?>
					<br />
					<?php echoUnitSelect($name = 'au', $units = Array('m2', 'mm2', 'ft2', 'in2'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_rh']?>
					<br />
					<?php echoUnitSelect($name = 'rhu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_n617']?>
				</th>
				<th>
					<?=$ec_lang['mi_v617']?>
					<br />
					<?php echoUnitSelect($name = 'v617u', $units = Array('mps', 'ftps', 'mph'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_hv617']?>
					<br />
					<?php echoUnitSelect($name = 'hv617u', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_fr617']?>
				</th>
				<th>
					<?=$ec_lang['mi_q617']?>
					<br />
					<?php echoUnitSelect($name = 'q617u', $units = Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), $indent_string); ?>
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
		<textarea id='points_data' cols='25'></textarea>
	</div>
	<div style='clear: both;'></div>

<?php
}
?>
<div id="sketch"></div>
<?php echoFeedback(); ?>
<h2><?=$ec_lang['mi_notes']?></h2>
<dl>
<dt><?=$ec_lang['mi_notes_1_term']?></dt><dd><?=$ec_lang['mi_notes_1_def']?></dd>
<dt><?=$ec_lang['mi_notes_2_term']?></dt><dd><?=$ec_lang['mi_notes_2_def']?></dd>
<dt><?=$ec_lang['mtc_note_2_term']?></dt><dd><?=$ec_lang['mtc_note_2_def']?></dd>
</dl>
<script>
EngCalcs.pageConfig = {
	mtc_vel_ok: <?=json_encode($ec_lang['mtc_vel_ok'])?>,
	mtc_vel_high: <?=json_encode($ec_lang['mtc_vel_high'])?>,
	mtc_vel_low: <?=json_encode($ec_lang['mtc_vel_low'])?>,
	mtc_vel_ok_short: <?=json_encode($ec_lang['mtc_vel_ok_short'])?>,
	mtc_vel_high_short: <?=json_encode($ec_lang['mtc_vel_high_short'])?>,
	mtc_vel_low_short: <?=json_encode($ec_lang['mtc_vel_low_short'])?>
};
</script>
<script src="/engcalcs/js/Manning.lib.js?v=<?=filemtime(__DIR__.'/js/Manning.lib.js')?>"></script>
<script src="/engcalcs/js/manning-irregular.js?v=<?=filemtime(__DIR__.'/js/manning-irregular.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
