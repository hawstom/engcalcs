<?php
require_once ('lib/base.inc.php');
//phpinfo();
$html_title = $ec_lang['dw_main_title'];
$html_desc = $ec_lang['dw_main_desc'];
echoHeader("EngCalcs", $html_title, "");

?>
<h2><?=$ec_lang['dw_main_desc']?></h2>
<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'q', 'type' => 'number', 'default' => Array('us' => '400', 'si' => '25'), 'units' => 'flow_pipe', 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'd', 'type' => 'number', 'default' => Array('us' => '6', 'si' => '150'), 'units' => 'distance_small', 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'l', 'type' => 'number', 'default' => Array('us' => '1000', 'si' => '300'), 'units' => 'distance_medium', 'label' => $ec_lang['mphl_pipe_length']),
		Array('name' => 'e', 'type' => 'number', 'default' => Array('us' => '0.0005', 'si' => '0.15'), 'units' => 'roughness', 'label' => '<a target="_blank" href="https://nepis.epa.gov/Exe/ZyNET.exe/P1007WWU.txt?ZyActionD=ZyDocument&Client=EPA&Index=2000%20Thru%202005&SearchMethod=1&TocRestrict=n&&IntQFieldOp=0&ExtQFieldOp=0&XmlQuery=&File=D%3A%5CZYFILES%5CINDEX%20DATA%5C00THRU05%5CTXT%5C00000024%5CP1007WWU.txt&User=ANONYMOUS&Password=anonymous&SortMethod=h%7C-&MaximumDocuments=1&FuzzyDegree=0&ImageQuality=r75g8/r75g8/x150y150g16/i425&Display=hpfr&DefSeekPage=x&SearchBack=ZyActionL&Back=ZyActionS&BackDesc=Results%20page&MaximumPages=1&ZyEntry=31">'.$ec_lang['dw_roughness'].'</a><span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['dw_roughness_tip'])).'"><span class="ec-tip">?</span></span>'),
		Array('name' => 'v', 'type' => 'number', 'default' => '1e-6', 'units' => NULL, 'label' => '<a target="_blank" href="https://www.engineersedge.com/fluid_flow/kinematic-viscosity-table.htm">'.$ec_lang['dw_kinematic_viscosity'].'</a>'),
		Array( 'name' => 'km', 'type' => 'number', 'default' => '2.0', 'units' => NULL, 'label' => '<a target="_blank" href="https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html">'.$ec_lang['mphl_total_junction_k_short'].'</a><span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['mphl_total_junction_k_tip'])).'"><span class="ec-tip">?</span></span>'),
		// Upstream-first, elevation separate from pressure -- the Task 167 form, borrowed
		// whole from Hazen-Williams under the concept-level label reuse rule, so this
		// costs no new language keys (ROADMAP Task 168).
		Array('name' => 'z_up', 'type' => 'number', 'default' => Array('us' => '100', 'si' => '30'), 'units' => 'distance_medium', 'label' => $ec_lang['hw_elev_up']),
		Array('name' => 'p_up', 'type' => 'number', 'default' => Array('us' => '60', 'si' => '40'), 'units' => 'partial_head', 'label' => $ec_lang['hw_pressure_up']),
		Array('name' => 'z_down', 'type' => 'number', 'default' => Array('us' => '120', 'si' => '36'), 'units' => 'distance_medium', 'label' => $ec_lang['hw_elev_down']),
	),
	//Results
	Array(
		Array('name' => 'a', 'units' => 'flow_area', 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'pw', 'units' => 'distance_small', 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => 'distance_small', 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 'u', 'units' => 'velocity', 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'hv', 'units' => 'velocity_head', 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 'vel_check', 'units' => NULL, 'label' => $ec_lang['mhp_vel_check']),
		Array('name' => 're', 'units' => NULL, 'label' => $ec_lang['dw_reynolds_number']),
		Array('name' => 'regime_label', 'units' => NULL, 'label' => $ec_lang['dw_flow_regime']),
		Array('name' => 'f_method', 'units' => NULL, 'label' => $ec_lang['dw_friction_factor_method']),
		Array('name' => 'f', 'units' => NULL, 'label' => $ec_lang['dw_friction_factor']),
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

<?php echoFeedback(); ?>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<?php echo $ec_lang['hw_note_1']; ?>

<script>
EngCalcs.pageConfig = {
	regime_laminar:      <?=json_encode($ec_lang['dw_regime_laminar'])?>,
	regime_transitional: <?=json_encode($ec_lang['dw_regime_transitional'])?>,
	regime_turbulent:    <?=json_encode($ec_lang['dw_regime_turbulent'])?>,
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
<script src="/engcalcs/js/darcy-weisbach.js?v=<?=filemtime(__DIR__.'/js/darcy-weisbach.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
