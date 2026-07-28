<?php
require_once ('lib/base.inc.php');
//phpinfo();
$html_title = $ec_lang['mpf_main_title'];
$html_desc = $ec_lang['mpf_main_desc'];
echoHeader("EngCalcs", $html_title, "");

?>
<h2><?=$ec_lang['mpf_main_desc']?></h2>
<p class="collapse show d-print-none" id="relatedCalcs">
	<?=$ec_lang['ec_related_calcs']?> <a href="Manning-Pipe-Head-Loss.php"><?=$ec_lang['mphl_main_menu']?></a> &middot; <a href="Branched-Network.php"><?=$ec_lang['bpn_main_menu']?></a> &middot; <a href="Irrigation-Pressure.php"><?=$ec_lang['ip_main_menu']?></a> &middot; <a href="Micro-Hydro-Power.php"><?=$ec_lang['mhp_main_menu']?></a> <a data-bs-toggle="collapse" href="#relatedCalcs" aria-expanded="true" aria-controls="relatedCalcs"><?=$ec_lang['view_hide_line']?></a>
</p>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'd0', 'type' => 'number', 'default' => '1', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'n', 'type' => 'number', 'default' => '0.01', 'units' => NULL, 'label' => '<a target="_blank" href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">'.$ec_lang['mpf_manningRoughness'].'</a>'),
		Array('name' => 'sf', 'type' => 'number', 'default' => '0.001', 'units' => Array('grade','gradePercent'), 'label' => $ec_lang['mpf_friction_slope']),
		Array('name' => 'dd0', 'type' => 'number', 'default' => '0.5', 'units' => Array('depthFrac','depthPercent'), 'label' => $ec_lang['mpf_depth_ratio'], 'control' => solverControlHtml('EngCalcs.solveForDd0();')),
	),
	//Results
	Array(
		Array('name' => 'y', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mtc_flow_depth']),
		Array('name' => 'a', 'units' => Array('m2', 'mm2', 'ft2', 'in2'), 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'a0', 'units' => Array('m2', 'mm2', 'ft2', 'in2'), 'label' => $ec_lang['mpf_pipe_area']),
		Array('name' => 'aa0', 'units' => Array('depthFrac','depthPercent'), 'label' => $ec_lang['mpf_area_ratio']),
		Array('name' => 'pw', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 't', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_top_width']),
		Array('name' => 'v', 'units' => Array('mps','ftps'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'hv', 'units' => Array('mh2o','mmh2o','kpa','bar','kgfcm2','fth2o','inh2o','psi'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 'vel_check', 'units' => NULL, 'label' => $ec_lang['mhp_vel_check']),
		Array('name' => 'f', 'units' => NULL, 'label' => '<a target="_blank" href="https://www.engineeringtoolbox.com/froude-number-d_578.html">'.$ec_lang['mpf_froude_number'].'</a>'),
		Array('name' => 'tau', 'units' => Array('npm2','psf'), 'label' => $ec_lang['mpf_shear_stress']),
		Array('name' => 'q', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => '<span class="ec-help" title="' . htmlspecialchars(strip_tags($ec_lang['mpf_flow_tip'])) . '"><strong>' . $ec_lang['mpf_flow'] . '</strong> <span class="ec-tip">?</span></span>'),
		Array('name' => 'q0', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => $ec_lang['mpf_full_flow']),
		Array('name' => 'qq0', 'units' => Array('depthFrac','depthPercent'), 'label' => $ec_lang['mpf_full_flow_ratio']),
	)
);
?>

<div id="sketch"></div>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<?php echo $ec_lang['mpf_note_1']; ?>

<?php echoFeedback(); ?>

<script>
EngCalcs.pageConfig = {
	mhp_vel_ok_short:   <?=json_encode($ec_lang['mhp_vel_ok_short'])?>,
	mhp_vel_high_short: <?=json_encode($ec_lang['mhp_vel_high_short'])?>,
	mhp_vel_low_short:  <?=json_encode($ec_lang['mhp_vel_low_short'])?>,
	mhp_vel_high:       <?=json_encode($ec_lang['mhp_vel_high'])?>,
	mhp_vel_low:        <?=json_encode($ec_lang['mhp_vel_low'])?>,
	mpf_solver_enter_positive_q: <?=json_encode($ec_lang['mpf_solver_enter_positive_q'])?>,
	mpf_solver_no_solution:      <?=json_encode($ec_lang['mpf_solver_no_solution'])?>
};
</script>
<script src="/engcalcs/js/manning-pipe-flow.js?v=<?=filemtime(__DIR__.'/js/manning-pipe-flow.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
