<?php 
require_once ('lib/base.inc.php');
$html_title = $ec_lang['mi_main_title'];
$html_desc = $ec_lang['mi_main_desc'];
echoHeader("EngCalcs", $html_title, "");
?>
<h2><?php echo $ec_lang['mi_main_desc'] ?></h2>
<p class="collapse show d-print-none" id="relatedCalcs">
	<?=$ec_lang['ec_related_calcs']?> <a href="Looped-Network.php"><?=$ec_lang['lpn_main_menu']?></a> &middot; <a href="Manning-Trap.php"><?=$ec_lang['mtc_menu']?></a> &middot; <a href="Manning-Pipe-Flow.php"><?=$ec_lang['mpf_main_menu']?></a> &middot; <a href="Weir-Flow-Irregular.php"><?=$ec_lang['wi_menu']?></a> <a data-bs-toggle="collapse" href="#relatedCalcs" aria-expanded="true" aria-controls="relatedCalcs"><?=$ec_lang['view_hide_line']?></a>
</p>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		// These two travel with the seeded cross-section in js/manning-irregular.js -- the seed now
		// copies whatever the server rendered here rather than carrying its own copy, so a water
		// surface changed on one side and not the other opens on a dry or a drowned channel.
		Array('name' => 'ws', 'type' => 'number', 'default' => Array('us' => '6', 'si' => '2'), 'units' => 'distance_medium', 'label' => $ec_lang['mi_waterSurfaceElevation']),
		Array('name' => 's0', 'type' => 'number', 'default' => '0.0025', 'units' => 'slope', 'label' => $ec_lang['mtc_channel_slope']),
	),
	//Results
	Array(
		Array('name' => 'q_617', 'units' => 'flow_channel', 'label' => $ec_lang['mi_q_617']),
		Array('name' => 'v_check', 'units' => NULL, 'label' => $ec_lang['mhp_vel_check']),
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
					<a href="javascript:EngCalcs.addSingleCalcRow()">+</a>/<a href="javascript:EngCalcs.deleteSingleCalcRow()">-</a> <?=$ec_lang['points_data_note']?>
				</th>
			</tr>
			<tr>
				<th colspan="4"><?=$ec_lang['mi_groupPoint']?></th>
				<th colspan="4"><?=$ec_lang['mi_groupSegment']?></th>
				<th colspan="6"><?=$ec_lang['mi_groupRegion']?></th>
			</tr>
			<tr>
				<th>
					<?=$ec_lang['mi_station']?><br />
					<br />
					<?php echoUnitSelect($name = 'stationu', $units = 'distance_medium', $indent_string); ?>
				</th>
				<th>
					<span class="ec-narrowcol"><?=$ec_lang['mi_elevation']?></span>
					<br />
					<?php echoUnitSelect($name = 'elevationu', $units = 'distance_medium', $indent_string); ?>
				</th>
				<th>
					<span class="ec-narrowcol"><?=$ec_lang['mi_is_bank']?></span>
				</th>
				<th>
					<span class="ec-narrowcol" style="width:3.5em"><?=$ec_lang['mi_tau']?></span>
					<br />
					<?php echoUnitSelect($name = 'tauu', $units = 'stress', $indent_string); ?>
				</th>
				<th>
					<a target="_blank" href="<?=ecRefUrl('manning_n')?>"><?=$ec_lang['mi_n']?></a>
				</th>
				<th>
					<?=$ec_lang['mi_t']?>
					<br />
					<?php echoUnitSelect($name = 'tu', $units = 'distance_medium', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_pw']?>
					<br />
					<?php echoUnitSelect($name = 'pwu', $units = 'distance_medium', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_a']?>
					<br />
					<?php echoUnitSelect($name = 'au', $units = 'flow_area', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_rh']?>
					<br />
					<?php echoUnitSelect($name = 'rhu', $units = 'distance_medium', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_n617']?>
				</th>
				<th>
					<?=$ec_lang['mi_v617']?>
					<br />
					<?php echoUnitSelect($name = 'v617u', $units = 'velocity', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_hv617']?>
					<br />
					<?php echoUnitSelect($name = 'hv617u', $units = 'velocity_head', $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_fr617']?>
				</th>
				<th>
					<?=$ec_lang['mi_q617']?>
					<br />
					<?php echoUnitSelect($name = 'q617u', $units = 'flow_channel', $indent_string); ?>
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
		<textarea id='points_data' cols='25'></textarea>
	</div>
	<div style='clear: both;'></div>

<?php
}
?>
<?php echoFeedback(); ?>

<div id="sketch"></div>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
<dt><?=$ec_lang['mi_notes_1_term']?></dt><dd><?=$ec_lang['mi_notes_1_def']?></dd>
<dt><?=$ec_lang['mi_notes_2_term']?></dt><dd><?=$ec_lang['mi_notes_2_def']?></dd>
<dt><?=$ec_lang['mi_notes_3_term']?></dt><dd><?=$ec_lang['mi_notes_3_def']?></dd>
<dt><?=$ec_lang['mtc_note_2_term']?></dt><dd><?=$ec_lang['mtc_note_2_def']?></dd>
</dl>
<script>
EngCalcs.pageConfig = {
	mtc_vel_ok: <?=json_encode($ec_lang['mtc_vel_ok'])?>,
	mtc_vel_high: <?=json_encode($ec_lang['mtc_vel_high'])?>,
	mtc_vel_low: <?=json_encode($ec_lang['mtc_vel_low'])?>,
	mhp_vel_ok_short: <?=json_encode($ec_lang['mhp_vel_ok_short'])?>,
	mhp_vel_high_short: <?=json_encode($ec_lang['mhp_vel_high_short'])?>,
	mhp_vel_low_short: <?=json_encode($ec_lang['mhp_vel_low_short'])?>
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
