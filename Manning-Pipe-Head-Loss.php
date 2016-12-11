<?php 
require_once ("../lib/edc.lib.php");
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
		Array('q',Array('m3ps','lps','mld','ft3ps','gpm','mgd'),$ec_lang['mpf_flow']),
		Array('d0',Array('m','mm','ft','in'),$ec_lang['mpf_pipe_diameter']),
		Array('l',Array('m','mm','ft','in'),$ec_lang['mphl_pipe_length']),
		Array('n',NULL,'<span title="Typical roughness values for plastics, clay, and concrete range from 0.009 to 0.013">'.$ec_lang['mpf_manningRoughness'].' <a href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a></span>'),
		Array('k',NULL,$ec_lang['mphl_total_junction_k']),
),
	//Results
	Array(
		Array('v',Array('mps','ftps','mph'),$ec_lang['mpf_velocity']),
		Array('hv',Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'),$ec_lang['mpf_velocity_head']),
		Array('hf',Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'),$ec_lang['mphl_friction_loss'], 'H<sub>f</sub>'),
		Array('hm',Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'),$ec_lang['mphl_junction_loss'], 'H<sub>m</sub>'),
		Array('hl',Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'),$ec_lang['mphl_total_loss'], 'H<sub>l</sub>'),
	)
);
?>
<?php echoFeedback(); ?>
<script type="text/javascript">
function pageCalculator(f) {
	var q = f['q'].value / f['qu'].value,
	d0 = f['d0'].value / f['d0u'].value,
	l = f['l'].value / f['lu'].value,
	n = f['n'].value,
	k = f['k'].value,
	c=1.0,
	g=9.806,
	v,
	hv,
	hf,
	hm,
	hl,
	tau;
	v = q/(Math.PI*d0*d0/4);
	// Report heads in pascals.  Convert meters to pascals with * (1000 * g)
	hv = v * v / (2 * g) * (1000 * g);
	hf = l * v * v * n * n * 6.3496 / (c*c *Math.pow(d0,4/3)) * (1000 * g);
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