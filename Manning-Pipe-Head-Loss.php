<?php 
require_once ("../lib/edc.lib.php");
echoHeader("EngCalcs",$ec_lang['t_manningPipeHeadLossCalculator']);
?>
<h2><?php echo $ec_lang['d_manningPipeLossCalculator']; ?></h2>
<p><a href="../contact.php"><?=$ec_lang['translationHelpWanted']?></a></p>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('q',Array('m3ps','lps','ft3ps','gpm','mgd'),$ec_lang['d_flow']),
		Array('d0',Array('m','mm','ft','in'),$ec_lang['d_pipeDiameter']),
		Array('l',Array('m','mm','ft','in'),$ec_lang['d_pipeLength']),
		Array('n',NULL,'<span title="Typical roughness values for plastics, clay, and concrete range from 0.009 to 0.013">'.$ec_lang['d_manningRoughness'].' <a href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a></span>'),
		Array('k',NULL,$ec_lang['d_totalJunctionK']),
),
	//Results
	Array(
		Array('v',Array('mps','ftps','mph'),$ec_lang['d_velocity']),
		Array('hv',Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'),$ec_lang['d_velocityHead']),
		Array('hf',Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'),$ec_lang['d_frictionLoss'], 'H<sub>f</sub>'),
		Array('hm',Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'),$ec_lang['d_junctionLoss'], 'H<sub>m</sub>'),
		Array('hl',Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'),$ec_lang['d_totalLoss'], 'H<sub>l</sub>'),
	)
);
?>
<div class="left"><p><a href="../contact.php"><?=$ec_lang['d_feedbackRequest']?></a></p></div>
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