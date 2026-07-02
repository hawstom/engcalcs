<?php
require_once ('lib/base.inc.php');
//phpinfo();
$html_title = $ec_lang['mpf_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['mpf_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<div class="d-print-none" id="mpf-solver">
	<p>
		<strong><?=$ec_lang['mpf_solve_for_dd0']?></strong> — <?=$ec_lang['mpf_solve_desc']?><br>
		<?=$ec_lang['mpf_flow']?>:
		<input class="input" type="number" step="any" id="solver_q" value="1.0" />
		<select id="solver_qu">
<?php foreach (['m3ps','lps','mld','ft3ps','gpm','mgd'] as $qu): ?>
			<option value="<?=$ec_units[$qu]?>"><?=$ec_lang['u_'.$qu]?></option>
<?php endforeach; ?>
		</select>
		<button type="button" onclick="EngCalcs.solveForDd0();"><?=$ec_lang['mpf_solve_button']?></button>
		<span id="solver_msg" style="color:red;margin-left:0.5em;"></span>
	</p>
</div>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'd0', 'type' => 'number', 'default' => '1', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'n', 'type' => 'number', 'default' => '0.01', 'units' => NULL, 'label' => '<a target="_blank" href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">'.$ec_lang['mpf_manningRoughness'].'</a>'),
		Array('name' => 's0', 'type' => 'number', 'default' => '0.001', 'units' => Array('grade','gradePercent'), 'label' => $ec_lang['mpf_friction_slope']),
		Array('name' => 'dd0', 'type' => 'number', 'default' => '0.5', 'units' => Array('depthFrac','depthPercent'), 'label' => $ec_lang['mpf_depth_ratio']),
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
		Array('name' => 'hv', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 'vel_check', 'units' => NULL, 'label' => $ec_lang['mhp_vel_check']),
		Array('name' => 'f', 'units' => NULL, 'label' => '<a target="_blank" href="https://www.engineeringtoolbox.com/froude-number-d_578.html">'.$ec_lang['mpf_froude_number'].'</a>'),
		Array('name' => 'tau', 'units' => Array('npm2','psf'), 'label' => $ec_lang['mpf_shear_stress']),
		Array('name' => 'q', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => '<strong>' . $ec_lang['mpf_flow'] . '</strong> ' . $ec_lang['mpf_see_notes']),
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
	mhp_vel_low:        <?=json_encode($ec_lang['mhp_vel_low'])?>
};
</script>
<script src="/engcalcs/js/manning-pipe-flow.js?v=<?=filemtime(__DIR__.'/js/manning-pipe-flow.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
