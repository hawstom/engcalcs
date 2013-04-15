<?php 
/**
 * Tom's design notes
 * 2010-07-15
 * After reading some best practices articles, I think
 * -Use <tables> to lay out form
 * -Use <label for="">
 * I like this document http://msdn.microsoft.com/en-us/library/95xdeeha%28VS.71%29.aspx
 */
require_once ('../lib/edc.lib.php');
echoHeader('EngCalcs',$ec_lang['t_manningTrapFlowCalculator']);
?>
<h2><?=$ec_lang['d_manningTrapFlowCalculator']?></h2>
<p><a href="../contact.php"><?=$ec_lang['translationHelpWanted']?></a></p>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('b',Array('m','mm','ft','in'),$ec_lang['d_bottomWidth']),
		Array('z1',NULL,$ec_lang['d_sideSlope1']),
		Array('z2',NULL,$ec_lang['d_sideSlope2']),
		Array('n',NULL,'<span title="Typical roughness values for plastics, clay, and concrete range from 0.009 to 0.013">'.$ec_lang['d_manningRoughness'].' <a href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a></span>'),
		Array('s0',Array('grade','gradePercent'),$ec_lang['d_channelSlope']),
		Array('y',Array('m','mm','ft','in'),$ec_lang['d_flowDepth']),
	),
	//Results
	Array(
		Array('a',Array('m2','mm2','ft2','in2'),$ec_lang['d_flowArea']),
		Array('pw',Array('m','mm','ft','in'),$ec_lang['d_wettedPerimeter']),
		Array('rh',Array('m','mm','ft','in'),$ec_lang['d_hydraulicRadius']),
		Array('v',Array('mps','ftps','mph'),$ec_lang['d_velocity']),
		Array('q',Array('m3ps','lps','ft3ps','gpm','mgd'),$ec_lang['d_flow']),
		Array('hv',Array('m','mm','ft','in'),$ec_lang['d_velocityHead']),
		Array('t',Array('m','mm','ft','in'),$ec_lang['d_topWidth']),
		Array('f',NULL,$ec_lang['d_froudeNumber']),
		Array('tau',Array('npm2','psf'),$ec_lang['d_shearStress']),
	)
);
?>

<div class="left"><p><a href="../contact.php"><?=$ec_lang['d_feedbackRequest']?></a></p></div>
<script type="text/javascript">
function pageCalculator(f) {
	var 
	c = 1.0,
	g = 9.806,
	gammawater = 9806,
	b = f['b'].value / f['bu'].value,
	y = f['y'].value / f['yu'].value,
	// Use unary + to convert form values to numbers 
	// so when we add z1 and z2 they don't get concatenated.
	z1 = +f['z1'].value,
	z2 = +f['z2'].value,
	s0 = f['s0'].value / f['s0u'].value,
	n = f['n'].value,
	a,
	pw,
	rh,
	t,
	v,
	hv,
	q,
	froude,
	tau;
	a = y * (b + (z1 + z2) * y / 2);
	pw = b + y * (Math.sqrt(1 + z1 * z1) + Math.sqrt(1 + z2 * z2));
	rh = a / pw;
	t = b + y * (z1 + z2);	
	v = c/n*Math.pow(rh,2/3)*Math.pow(s0,0.5);
	hv=v * v / (2 * g)
	q = v*a;
	froude = v * Math.sqrt(t/(g * a * Math.cos(Math.atan(s0))));
	tau = gammawater * y * s0;
	document.getElementById('q').innerHTML = (q * f['qu'].value).toFixed(2);
	document.getElementById('v').innerHTML = (v * f['vu'].value).toFixed(2);
	document.getElementById('hv').innerHTML = (hv * f['hvu'].value).toFixed(2);
	document.getElementById('a').innerHTML = (a * f['au'].value).toFixed(2);
	document.getElementById('pw').innerHTML = (pw * f['pwu'].value).toFixed(2);
	document.getElementById('rh').innerHTML = (rh * f['rhu'].value).toFixed(2);
	document.getElementById('t').innerHTML = (t * f['tu'].value).toFixed(2);
	document.getElementById('f').innerHTML = froude.toFixed(2);
	document.getElementById('tau').innerHTML = (tau * f['tauu'].value).toFixed(2);
}
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("main");
?>