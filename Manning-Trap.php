<?php
require_once ('lib/base.inc.php');
$html_title = $ec_lang['mtc_main_title'];
$html_desc = $ec_lang['mtc_main_desc'];
echoHeader("EngCalcs", $html_title, "");

?>
<h2><?=$ec_lang['mtc_main_desc']?></h2>
<p class="collapse show d-print-none" id="relatedCalcs">
	<?=$ec_lang['ec_related_calcs']?> <a href="Manning-Irregular.php"><?=$ec_lang['mi_menu']?></a> &middot; <a href="Rock-Chute.php"><?=$ec_lang['rc_main_menu']?></a> &middot; <a href="Canal-Seepage.php"><?=$ec_lang['cs_main_menu']?></a> &middot; <a href="Manning-Pipe-Flow.php"><?=$ec_lang['mpf_main_menu']?></a> <a data-bs-toggle="collapse" href="#relatedCalcs" aria-expanded="true" aria-controls="relatedCalcs"><?=$ec_lang['view_hide_line']?></a>
</p>
<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'b', 'type' => 'number', 'default' => Array('us' => '4', 'si' => '1.2'), 'units' => 'distance_medium', 'label' => $ec_lang['mtc_bottom_width']),
		Array('name' => 'z1', 'type' => 'number', 'default' => '2', 'units' => NULL, 'label' => $ec_lang['mtc_side_slope_1']),
		Array('name' => 'z2', 'type' => 'number', 'default' => '2', 'units' => NULL, 'label' => $ec_lang['mtc_side_slope_2']),
		Array('name' => 'n_in', 'type' => 'number', 'default' => '0.025', 'units' => NULL, 'label' => '<a target="_blank" href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">'.$ec_lang['mpf_manningRoughness'].'</a><span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['mtc_iteration_tip'])).'"><span class="ec-tip">?</span></span>'.'<br /> <input type="radio" name="n_radio" id="n_radio_strickler" value="strickler" onchange="EngCalcs.submitForm()" /><label for="n_radio_strickler">Strickler</label> <input type="radio" name="n_radio" id="n_radio_bb" value="bb" onchange="EngCalcs.submitForm()" /><label for="n_radio_bb">B/B</label> <input type="radio" name="n_radio" id="n_radio_pi" value="pi" onchange="EngCalcs.submitForm()" /><label for="n_radio_pi">P&amp;I</label>'),
		Array('name' => 's0', 'type' => 'number', 'default' => '0.001', 'units' => 'slope', 'label' => $ec_lang['mtc_channel_slope']),
		Array('name' => 'y', 'type' => 'number', 'default' => Array('us' => '2', 'si' => '0.6'), 'units' => 'distance_medium', 'label' => $ec_lang['mtc_flow_depth'], 'control' => solverControlHtml('EngCalcs.solveForY();')),
		Array('name' => 'beta', 'type' => 'number', 'default' => '0', 'units' => NULL, 'label' => $ec_lang['mtc_bend_angle']),
		Array('name' => 'sgrock', 'type' => 'number', 'default' => '2.65', 'units' => NULL, 'label' => $ec_lang['mtc_sgrock']),
		Array(
			'name' => 'd50_in', 
			'type' => 'number', 'default' => Array('us' => '6', 'si' => '150'), 
			'units' => 'distance_small', 
			'label' => '<span class="ec-help" title="' . htmlspecialchars(strip_tags($ec_lang['mtc_iteration_tip'])) . '">' . $ec_lang['mtc_d50_in'] . ' <span class="ec-tip">?</span></span>' . '<br /> <input type="radio" name="d50_radio" id="d50_radio_isbash" value="isbash" onchange="EngCalcs.submitForm()" /><label for="d50_radio_isbash">Isbash</label> <input type="radio" name="d50_radio" id="d50_radio_maynord" value="maynord" onchange="EngCalcs.submitForm()" /><label for="d50_radio_maynord">Maynord</label> <input type="radio" name="d50_radio" id="d50_radio_searcy" value="searcy" onchange="EngCalcs.submitForm()" /><label for="d50_radio_searcy">Searcy</label><br />*' . inputHtml('d50_safety', 'number', '1.25', '')),
	),
	//Results
	Array(
		Array('name' => 'a', 'units' => 'flow_area', 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'pw', 'units' => 'distance_medium', 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => 'distance_medium', 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 'v', 'units' => 'velocity', 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'v_check', 'units' => NULL, 'label' => $ec_lang['mhp_vel_check']),
		Array('name' => 'q', 'units' => 'flow_channel', 'label' => '<strong>' . $ec_lang['mpf_flow'] . '</strong> '),
		Array('name' => 'hv', 'units' => 'velocity_head', 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 't', 'units' => 'distance_medium', 'label' => $ec_lang['mpf_top_width']),
		Array('name' => 'froude', 'units' => NULL, 'label' => $ec_lang['mpf_froude_number']),
		Array('name' => 'tau', 'units' => 'stress', 'label' => $ec_lang['mpf_shear_stress']),
		Array('name' => 'n_strickler', 'units' => NULL, 'label' => $ec_lang['mtc_n_strickler']),
		Array('name' => 'n_blodgett', 'units' => NULL, 'label' => $ec_lang['mtc_n_blodgett']),
		Array('name' => 'n_bathurst', 'units' => NULL, 'label' => $ec_lang['mtc_n_bathurst']),
		Array('name' => 'blodgett_v_bathurst', 'units' => NULL, 'label' => $ec_lang['mtc_blodgett_v_bathurst']),
		Array('name' => 'n_pi', 'units' => NULL, 'label' => $ec_lang['mtc_n_pi']),
		Array('name' => 'pi_range_check', 'units' => NULL, 'label' => $ec_lang['mtc_pi_range_check']),
		Array('name' => 'd50_bottom', 'units' => 'distance_small', 'label' => $ec_lang['mtc_d50_bottom']),
		Array('name' => 'd50_z1', 'units' => 'distance_small', 'label' => $ec_lang['mtc_d50_z1']),
		Array('name' => 'd50_z2', 'units' => 'distance_small', 'label' => $ec_lang['mtc_d50_z2']),
		Array('name' => 'd50_mra', 'units' => 'distance_small', 'label' => $ec_lang['mtc_d50_mra']),
		Array('name' => 'd50_searcy', 'units' => 'distance_small', 'label' => $ec_lang['mtc_d50_searcy']),
	)
);
?>

<div id="sketch"></div>

<?php echoFeedback(); ?>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<?php echo $ec_lang['mtc_note_1']; ?>
<dl>
	<dt><?=$ec_lang['mtc_note_2_term']?></dt>
	<dd><?=$ec_lang['mtc_note_2_def']?></dd>
</dl>
<script>
EngCalcs.pageConfig = {
	mtc_vel_ok: <?=json_encode($ec_lang['mtc_vel_ok'])?>,
	mtc_vel_high: <?=json_encode($ec_lang['mhp_vel_high'])?>,
	mtc_vel_low: <?=json_encode($ec_lang['mtc_vel_low'])?>,
	mhp_vel_ok_short: <?=json_encode($ec_lang['mhp_vel_ok_short'])?>,
	mhp_vel_high_short: <?=json_encode($ec_lang['mhp_vel_high_short'])?>,
	mhp_vel_low_short: <?=json_encode($ec_lang['mhp_vel_low_short'])?>,
	mtc_pi_ok: <?=json_encode($ec_lang['mtc_pi_ok'])?>,
	mtc_pi_ok_tip: <?=json_encode($ec_lang['mtc_pi_ok_tip'])?>,
	mtc_pi_out_of_range: <?=json_encode($ec_lang['mtc_pi_out_of_range'])?>,
	mtc_pi_tip: <?=json_encode($ec_lang['mtc_pi_tip'])?>,
	mpf_solver_enter_positive_q: <?=json_encode($ec_lang['mpf_solver_enter_positive_q'])?>,
	mtc_solver_no_solution: <?=json_encode($ec_lang['mtc_solver_no_solution'])?>
};
</script>
<script src="/engcalcs/js/Manning.lib.js?v=<?=filemtime(__DIR__.'/js/Manning.lib.js')?>"></script>
<script src="/engcalcs/js/manning-trap.js?v=<?=filemtime(__DIR__.'/js/manning-trap.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
