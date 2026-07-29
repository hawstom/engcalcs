<?php 
require_once ('lib/base.inc.php');
$html_title = $ec_lang['mphl_main_title'];
$html_desc = $ec_lang['mphl_main_desc'];
echoHeader("EngCalcs", $html_title, "");

?>
<h2><?php echo $ec_lang['mphl_main_desc']; ?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'q', 'type' => 'number', 'default' => Array('us' => '10', 'si' => '0.3'), 'units' => 'flow_channel', 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'd', 'type' => 'number', 'default' => Array('us' => '24', 'si' => '600'), 'units' => 'distance_small', 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'l', 'type' => 'number', 'default' => Array('us' => '200', 'si' => '60'), 'units' => 'distance_medium', 'label' => $ec_lang['mphl_pipe_length']),
		Array('name' => 'n', 'type' => 'number', 'default' => '0.013', 'units' => NULL, 'label' => '<a target="_blank" href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">'.$ec_lang['mpf_manningRoughness'].'</a>'),
		Array( 'name' => 'k', 'type' => 'number', 'default' => '2.0', 'units' => NULL, 'label' => '<a target="_blank" href="https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html">'.$ec_lang['mphl_total_junction_k_short'].'</a><span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['mphl_total_junction_k_tip'])).'"><span class="ec-tip">?</span></span>'),
		Array('name' => 'egl1', 'type' => 'number', 'default' => '0', 'units' => 'total_head', 'label' => $ec_lang['mphl_egl_1']),
),
	//Results
	Array(
		Array('name' => 'a', 'units' => 'flow_area', 'label' => $ec_lang['mphl_area']),
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
		Array('name' => 'hgl1', 'units' => 'total_head', 'label' => $ec_lang['hw_hgl_1']),
		Array('name' => 'egl2', 'units' => 'total_head', 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['mphl_hgl_egl_tip'])).'">'.$ec_lang['mphl_egl_2'].' <span class="ec-tip">?</span></span>'),
		Array('name' => 'hgl2', 'units' => 'total_head', 'label' => '<span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['mphl_hgl_egl_tip'])).'">'.$ec_lang['hw_hgl_2'].' <span class="ec-tip">?</span></span>'),
	)
);
?>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<?php echo $ec_lang['mphl_note_1']; ?>

<?php echoFeedback(); ?>
<script>
EngCalcs.pageConfig = {
	mhp_vel_ok_short:   <?=json_encode($ec_lang['mhp_vel_ok_short'])?>,
	mhp_vel_high_short: <?=json_encode($ec_lang['mhp_vel_high_short'])?>,
	mhp_vel_low_short:  <?=json_encode($ec_lang['mhp_vel_low_short'])?>,
	mhp_vel_high:       <?=json_encode($ec_lang['mhp_vel_high'])?>,
	mhp_vel_low:        <?=json_encode($ec_lang['mhp_vel_low'])?>
};
</script>
<script src="/engcalcs/js/manning-pipe-head-loss.js?v=<?=filemtime(__DIR__.'/js/manning-pipe-head-loss.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
