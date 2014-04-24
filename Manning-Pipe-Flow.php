<?php 
require_once('../lib/edc.lib.php');
$html_title = $ec_lang['mpf_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['mpf_main_desc']?></h2>
<p><a href="../contact.php"><?=$ec_lang['template_translation_help']?></a></p>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('d0',Array('m','mm','ft','in'),$ec_lang['mpf_pipe_diameter']),
		Array('n',NULL,'<span title="Typical roughness values for plastics, clay, and concrete range from 0.009 to 0.013">'.$ec_lang['mpf_manningRoughness'].' <a href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a></span>'),
		Array('s0',Array('grade','gradePercent'),$ec_lang['mpf_friction_slope']),
		Array('dd0',Array('depthFrac','depthPercent'),$ec_lang['mpf_depth_ratio']),
	),
	//Results
	Array(
		Array('q',Array('m3ps','lps','ft3ps','gpm','mgd'),$ec_lang['mpf_flow']),
		Array('v',Array('mps','ftps','mph'),$ec_lang['mpf_velocity']),
		Array('hv',Array('m','mm','ft','in'),$ec_lang['mpf_velocity_head']),
		Array('a',Array('m2','mm2','ft2','in2'),$ec_lang['mpf_flow_area']),
		Array('pw',Array('m','mm','ft','in'),$ec_lang['mpf_wetted_perimeter']),
		Array('rh',Array('m','mm','ft','in'),$ec_lang['mpf_hydraulic_radius']),
		Array('t',Array('m','mm','ft','in'),$ec_lang['mpf_top_width']),
		Array('f',NULL,$ec_lang['mpf_froude_number']),
		Array('tau',Array('npm2','psf'),$ec_lang['mpf_shear_stress']),
	)
);
?>

<div class="left"><p><a href="../contact.php"><?=$ec_lang['template_feedback']?></a></p></div>

<script type="text/javascript">
function pageCalculator(f) {
	var 
	c = 1.0,
	g = 9.806,
	gammawater = 9806,
	d0 = f['d0'].value / f['d0u'].value,
	s0 = f['s0'].value / f['s0u'].value,
	n = f['n'].value,
	dd0 = f['dd0'].value / f['dd0u'].value,
	y = dd0 * d0,
	theta,
	a,
	pw,
	rh,
	t,
	v,
	hv,
	q,
	froude,
	tau;
	theta = Math.acos(1 - 2 * dd0);
	a = (theta - Math.sin(theta) * Math.cos(theta)) * Math.pow(d0, 2) / 4;
	pw = theta * d0;
	rh = d0 / (4 * theta) * (theta - Math.sin(theta) * Math.cos(theta));
	t = d0 * Math.sin(theta);
	
	v = c/n*Math.pow(rh,2/3)*Math.pow(s0,0.5);
	hv = v * v / (2 * g);
	q = v*a;
	froude = v * Math.sqrt(t/(g * a * Math.cos(Math.atan(s0))));
	tau = gammawater * y * s0;
	document.getElementById('q').innerHTML = (q * f['qu'].value).toFixed(4);
	document.getElementById('v').innerHTML = (v * f['vu'].value).toFixed(4);
	document.getElementById('hv').innerHTML = (hv * f['hvu'].value).toFixed(4);
	document.getElementById('a').innerHTML = (a * f['au'].value).toFixed(4);
	document.getElementById('pw').innerHTML = (pw * f['pwu'].value).toFixed(4);
	document.getElementById('rh').innerHTML = (rh * f['rhu'].value).toFixed(4);
	document.getElementById('t').innerHTML = (t * f['tu'].value).toFixed(4);
	document.getElementById('f').innerHTML = froude.toFixed(2);
	document.getElementById('tau').innerHTML = (tau * f['tauu'].value).toFixed(4);
}

<?php echoCookieScript(); ?>
  </script>
<?php
echoFooter("main");
?>
