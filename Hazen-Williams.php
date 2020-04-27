<?php
define('BASE_DIRECTORY', realpath(__DIR__.'/..'));
require_once (BASE_DIRECTORY."/engcalcs/lib/base.inc.php");
//phpinfo();
$html_title = $ec_lang['hw_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['hw_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'q', 'type' => 'number', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'd', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'l', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_pipe_length']),
		Array('name' => 'c', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['hw_roughness']),
		Array( 'name' => 'k', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mphl_total_junction_k']),
	),
	//Results
	Array(
		Array('name' => 'a', 'units' => Array('m2','mm2','ft2','in2'), 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'pw', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 'v', 'units' => Array('mps','ftps','mph'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'hv', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 'sf', 'units' => Array('grade','gradePercent'), 'label' => $ec_lang['hw_friction_slope']),
		Array('name' => 'tau', 'units' => Array('npm2','psf'), 'label' => $ec_lang['mpf_shear_stress']),
		Array('name' => 'hf', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_friction_loss'], 'H<sub>f</sub>'),
		Array('name' => 'hm', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_junction_loss'], 'H<sub>m</sub>'),
		Array('name' => 'hl', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_total_loss'], 'H<sub>l</sub>'),
	)
);

?>

<div id="sketch"></div>

<?php echoFeedback(); ?>

<script type="text/javascript">
EngCalcs.pageCalculator = function(objForm) {
	var
	khw = 0.849,
	g = 9.806,
	gammawater = 9806,
	// Convert input values from form to SI
	d = objForm['d'].value / objForm['du'].value,
	c = objForm['c'].value,
	km = objForm['k'].value,
	l = objForm['l'].value / objForm['lu'].value,
	q = objForm['q'].value / objForm['qu'].value,
	a,
	pw,
	rh,
	v,
	hv,
	sf,
	hf,
	hm,
	hl,
	tau; // End declaring variables. Begin calculations.
	a = Math.PI * Math.pow(d, 2) / 4;
	pw = Math.PI * d;
	rh = d / 4;
	v = q / a;
	// From 7.8828/d^4.8704 * (Q/(k*C))^1.852 at Wikipedia Hazen-Williams article.
	sf = 7.8828 / Math.pow(d, 4.8704) * Math.pow(q / (khw * c), 1.852);
	tau = gammawater * rh * sf;
	// For units selector, report heads in pascals (standard SI pressure unit).  Convert meters to pascals with * (1000 * g)
	hv = v * v / (2 * g) * (1000 * g);
	hf = sf * l  * (1000 * g);
	hm = hv * km;
	hl = +hf + +hm;

	// Write results to page.
	document.getElementById('v').innerHTML = (v * objForm['vu'].value).toFixed(4);
	document.getElementById('hv').innerHTML = (hv * objForm['hvu'].value).toFixed(4);
	document.getElementById('a').innerHTML = (a * objForm['au'].value).toFixed(4);
	document.getElementById('pw').innerHTML = (pw * objForm['pwu'].value).toFixed(4);
	document.getElementById('rh').innerHTML = (rh * objForm['rhu'].value).toFixed(4);
	document.getElementById('sf').innerHTML = (sf * objForm['sfu'].value).toFixed(4);
	document.getElementById('tau').innerHTML = (tau * objForm['tauu'].value).toFixed(4);
	document.getElementById('hf').innerHTML = (hf * objForm['hfu'].value).toFixed(4);
	document.getElementById('hm').innerHTML = (hm * objForm['hmu'].value).toFixed(4);
	document.getElementById('hl').innerHTML = (hl * objForm['hlu'].value).toFixed(4);
}

<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("main");
?>
