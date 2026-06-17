<?php
require_once ('lib/base.inc.php');
$html_title = $ec_lang['mtc_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="wier vetedero calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['mtc_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'b', 'type' => 'number', 'default' => '1', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_bottom_width']),
		Array('name' => 'z1', 'type' => 'number', 'default' => '4', 'units' => NULL, 'label' => $ec_lang['mtc_side_slope_1']),
		Array('name' => 'z2', 'type' => 'number', 'default' => '4', 'units' => NULL, 'label' => $ec_lang['mtc_side_slope_2']),
		Array('name' => 'n_in', 'type' => 'number', 'default' => '0.03', 'units' => NULL, 'label' => $ec_lang['mpf_manningRoughness'].' <a target="_blank" href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a>'.'<br /> <input type="radio" name="n_radio" id="n_radio_strickler" value="strickler" onchange="EngCalcs.submitForm()" /><label for="n_radio_strickler">Strickler</label> <input type="radio" name="n_radio" id="n_radio_bb" value="bb" onchange="EngCalcs.submitForm()" /><label for="n_radio_bb">B/B</label> '.$ec_lang['mpf_see_notes']),
		Array('name' => 's0', 'type' => 'number', 'default' => '0.001', 'units' => Array('grade', 'gradePercent'), 'label' => $ec_lang['mtc_channel_slope']),
		Array('name' => 'y', 'type' => 'number', 'default' => '1', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_flow_depth']),
		Array('name' => 'beta', 'type' => 'number', 'default' => '0', 'units' => NULL, 'label' => $ec_lang['mtc_bend_angle']),
		Array('name' => 'sgrock', 'type' => 'number', 'default' => '2.65', 'units' => NULL, 'label' => $ec_lang['mtc_sgrock']),
		Array(
			'name' => 'd50_in', 
			'type' => 'number', 'default' => '0.1', 
			'units' => Array('m', 'mm', 'ft', 'in'), 
			'label' => $ec_lang['mtc_d50_in'] . '<br /> <input type="radio" name="d50_radio" id="d50_radio_isbash" value="isbash" onchange="EngCalcs.submitForm()" /><label for="d50_radio_isbash">Isbash</label> <input type="radio" name="d50_radio" id="d50_radio_maynord" value="maynord" onchange="EngCalcs.submitForm()" /><label for="d50_radio_maynord">Maynord</label> <input type="radio" name="d50_radio" id="d50_radio_searcy" value="searcy" onchange="EngCalcs.submitForm()" /><label for="d50_radio_searcy">Searcy</label><br />*' . inputHtml('d50_safety', 'number', '1.25', '') . ' ' . $ec_lang['mpf_see_notes']),
	),
	//Results
	Array(
		Array('name' => 'a', 'units' => Array('m2', 'mm2', 'ft2', 'in2'), 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'pw', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 'v', 'units' => Array('mps', 'ftps'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'q', 'units' => Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), 'label' => '<strong>' . $ec_lang['mpf_flow'] . '</strong> '),
		Array('name' => 'hv', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 't', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_top_width']),
		Array('name' => 'froude', 'units' => NULL, 'label' => $ec_lang['mpf_froude_number']),
		Array('name' => 'tau', 'units' => Array('npm2', 'psf'), 'label' => $ec_lang['mpf_shear_stress']),
		Array('name' => 'n_strickler', 'units' => NULL, 'label' => $ec_lang['mtc_n_strickler']),
		Array('name' => 'n_blodgett', 'units' => NULL, 'label' => $ec_lang['mtc_n_blodgett']),
		Array('name' => 'n_bathurst', 'units' => NULL, 'label' => $ec_lang['mtc_n_bathurst']),
		Array('name' => 'blodgett_v_bathurst', 'units' => NULL, 'label' => $ec_lang['mtc_blodgett_v_bathurst']),
		Array('name' => 'd50_bottom', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_bottom']),
		Array('name' => 'd50_z1', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_z1']),
		Array('name' => 'd50_z2', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_z2']),
		Array('name' => 'd50_mra', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_mra']),
		Array('name' => 'd50_searcy', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_searcy']),
	)
);
?>

<div id="sketch"></div>

<?php echo $ec_lang['mtc_note_1']; ?>

<?php echoFeedback(); ?>
<script src="/engcalcs/js/Manning.lib.js?v=5"></script>
<script src="/engcalcs/js/manning-trap.js?v=1"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
