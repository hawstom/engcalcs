<?php
require_once ('lib/base.inc.php');
//phpinfo();
$html_title = $ec_lang['hw_main_title'];
$html_desc = $ec_lang['hw_main_desc'];
echoHeader("EngCalcs", $html_title, "");

?>
<h2><?=$ec_lang['hw_main_desc']?></h2>
<p class="collapse show d-print-none" id="relatedCalcs">
	<?=$ec_lang['ec_related_calcs']?> <a href="Darcy-Weisbach.php"><?=$ec_lang['dw_main_menu']?></a> &middot; <a href="Manning-Pipe-Head-Loss.php"><?=$ec_lang['mphl_main_menu']?></a> &middot; <a href="Manning-Pipe-Flow.php"><?=$ec_lang['mpf_main_menu']?></a> &middot; <a href="Branched-Network.php"><?=$ec_lang['bpn_main_menu']?></a> <a data-bs-toggle="collapse" href="#relatedCalcs" aria-expanded="true" aria-controls="relatedCalcs"><?=$ec_lang['view_hide_line']?></a>
</p>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'q', 'type' => 'number', 'default' => Array('us' => '400', 'si' => '25'), 'units' => 'flow_pipe', 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'd', 'type' => 'number', 'default' => Array('us' => '6', 'si' => '150'), 'units' => 'distance_small', 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'l', 'type' => 'number', 'default' => Array('us' => '1000', 'si' => '300'), 'units' => 'distance_medium', 'label' => $ec_lang['mphl_pipe_length']),
		Array('name' => 'c', 'type' => 'number', 'default' => '130', 'units' => NULL, 'label' => '<a target="_blank" href="https://www.engineeringtoolbox.com/hazen-williams-coefficients-d_798.html">'.$ec_lang['hw_roughness'].'</a>'),
		Array( 'name' => 'km', 'type' => 'number', 'default' => '2.0', 'units' => NULL, 'label' => '<a target="_blank" href="https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html">'.$ec_lang['mphl_total_junction_k_short'].'</a><span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['mphl_total_junction_k_tip'])).'"><span class="ec-tip">?</span></span>'),
		// Upstream is what a waterline engineer KNOWS (tank level, pump discharge, city
		// main); the downstream residual is what they want (ROADMAP Task 167). Elevation
		// and pressure are separate fields because that is how the two numbers reach them
		// -- elevations off a profile, pressure off a gauge -- and because keeping them
		// apart is what lets the page check for a negative downstream pressure instead of
		// warning about it in prose.
		Array('name' => 'z_up', 'type' => 'number', 'default' => Array('us' => '100', 'si' => '30'), 'units' => 'distance_medium', 'label' => $ec_lang['hw_elev_up']),
		Array('name' => 'p_up', 'type' => 'number', 'default' => Array('us' => '60', 'si' => '40'), 'units' => 'partial_head', 'label' => $ec_lang['hw_pressure_up']),
		Array('name' => 'z_down', 'type' => 'number', 'default' => Array('us' => '120', 'si' => '36'), 'units' => 'distance_medium', 'label' => $ec_lang['hw_elev_down']),
	),
	//Results
	Array(
		Array('name' => 'a', 'units' => 'flow_area', 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'pw', 'units' => 'distance_small', 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => 'distance_small', 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 'v', 'units' => 'velocity', 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'hv', 'units' => 'velocity_head', 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 'vel_check', 'units' => NULL, 'label' => $ec_lang['mhp_vel_check']),
		Array('name' => 'sf', 'units' => 'slope', 'label' => $ec_lang['mphl_friction_slope']),
		Array('name' => 'tau', 'units' => 'stress', 'label' => $ec_lang['mpf_shear_stress']),
		Array('name' => 'hf', 'units' => 'partial_head', 'label' => $ec_lang['mphl_friction_loss']),
		Array('name' => 'hm', 'units' => 'partial_head', 'label' => $ec_lang['mphl_junction_loss']),
		Array('name' => 'hl', 'units' => 'partial_head', 'label' => $ec_lang['mphl_total_loss']),
		Array('name' => 'p_down', 'units' => 'partial_head', 'label' => $ec_lang['hw_pressure_down']),
		Array('name' => 'p_check', 'units' => NULL, 'label' => $ec_lang['hw_pressure_check']),
		Array('name' => 'hgl_up', 'units' => 'total_head', 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['mphl_hgl_egl_tip'])).'">'.$ec_lang['hw_hgl_2'].' <span class="ec-tip">?</span></span>'),
		Array('name' => 'egl_up', 'units' => 'total_head', 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['mphl_hgl_egl_tip'])).'">'.$ec_lang['mphl_egl_2'].' <span class="ec-tip">?</span></span>'),
		Array('name' => 'egl_down', 'units' => 'total_head', 'label' => $ec_lang['mphl_egl_1']),
		Array('name' => 'hgl_down', 'units' => 'total_head', 'label' => $ec_lang['hw_hgl_1']),
	)
);

?>

<div id="sketch"></div>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<?php echo $ec_lang['hw_note_1']; ?>

<?php echoFeedback(); ?>

<script>
EngCalcs.pageConfig = {
	mhp_vel_ok_short:   <?=json_encode($ec_lang['mhp_vel_ok_short'])?>,
	mhp_vel_high_short: <?=json_encode($ec_lang['mhp_vel_high_short'])?>,
	mhp_vel_low_short:  <?=json_encode($ec_lang['mhp_vel_low_short'])?>,
	mhp_vel_high:       <?=json_encode($ec_lang['mhp_vel_high'])?>,
	mhp_vel_low:        <?=json_encode($ec_lang['mhp_vel_low'])?>,
	hw_pressure_ok_short:  <?=json_encode($ec_lang['hw_pressure_ok_short'])?>,
	hw_pressure_neg_short: <?=json_encode($ec_lang['hw_pressure_neg_short'])?>,
	hw_pressure_neg:       <?=json_encode($ec_lang['hw_pressure_neg'])?>
};
</script>
<script src="/engcalcs/js/hazen-williams.js?v=<?=filemtime(__DIR__.'/js/hazen-williams.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
