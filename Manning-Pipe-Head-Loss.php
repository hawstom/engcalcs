<?php 
define('BASE_DIRECTORY', realpath(__DIR__.'/..'));
require_once (BASE_DIRECTORY."/engcalcs/lib/base.inc.php");
$html_title = $ec_lang['mphl_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?php echo $ec_lang['mphl_main_desc']; ?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'q', 'type' => 'number', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'd', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'l', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_pipe_length']),
		Array('name' => 'n', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mpf_manningRoughness'].' <a target="_blank" href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a>'),
		Array( 'name' => 'k', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mphl_total_junction_k']),
),
	//Results
	Array(
		Array('name' => 'a', 'units' => Array('m2','mm2','ft2', 'in2'), 'label' => $ec_lang['mphl_area']),
		Array('name' => 'v', 'units' => Array('mps','ftps','mph'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'hv', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 'hf', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_friction_loss'], 'H<sub>f</sub>'),
		Array('name' => 'hm', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_junction_loss'], 'H<sub>m</sub>'),
		Array('name' => 'hl', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_total_loss'], 'H<sub>l</sub>'),
	)
);
?>
<?php echoFeedback(); ?>
<script type="text/javascript">
EngCalcs.pageCalculator = function(f) {
	var q = f['q'].value / f['qu'].value,
	d = f['d'].value / f['du'].value,
	l = f['l'].value / f['lu'].value,
	n = f['n'].value,
	k = f['k'].value,
	c=1.0,
	g=9.806,
	a,
	v,
	hv,
	hf,
	hm,
	hl,
	tau;
	a = (Math.PI*d*d/4);
	v = q/a;
	// Report heads in pascals (standard SI pressure unit).  Convert meters to pascals with * (1000 * g)
	hv = v * v / (2 * g) * (1000 * g);
	hf = l * v * v * n * n * 6.3496 / (c*c *Math.pow(d,4/3)) * (1000 * g);
	hm = k * hv;
	hl = +hf + +hm;
	document.getElementById('v').innerHTML = (v * f['vu'].value).toFixed(4);
	document.getElementById('hv').innerHTML = (hv * f['hvu'].value).toFixed(4);
	document.getElementById('hf').innerHTML = (hf * f['hfu'].value).toFixed(4);
	document.getElementById('hm').innerHTML = (hm * f['hmu'].value).toFixed(4);
	document.getElementById('hl').innerHTML = (hl * f['hlu'].value).toFixed(4);
}
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("main");
?>