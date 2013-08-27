<?php 
require_once ('../lib/edc.lib.php');
echoHeader('EngCalcs',$ec_lang['t_manningTrapFlowCalculator']);
?>
<h2><?=$ec_lang['d_manningTrapFlowCalculator']?></h2>
<p><a href="../contact.php"><?=$ec_lang['translationHelpWanted']?></a></p>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('b', Array('m', 'mm', 'ft', 'in'), $ec_lang['d_bottomWidth']),
		Array('z1', NULL, $ec_lang['d_sideSlope1']),
		Array('z2', NULL, $ec_lang['d_sideSlope2']),
		Array('n', NULL, '<span title="Typical roughness values for plastics, clay, and concrete range from 0.009 to 0.013">'.$ec_lang['d_manningRoughness'].' <a href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a></span>'),
		Array('s0',  Array('grade', 'gradePercent'), $ec_lang['d_channelSlope']),
		Array('y',  Array('m', 'mm', 'ft', 'in'), $ec_lang['d_flowDepth']),
		Array('beta', NULL, 'Bend Angle (for riprap sizing)'),
		Array('sgrock', NULL, 'Stone specific gravity (2.65)')
	),
	//Results
	Array(
		Array('a', Array('m2', 'mm2', 'ft2', 'in2'), $ec_lang['d_flowArea']),
		Array('pw', Array('m', 'mm', 'ft', 'in'), $ec_lang['d_wettedPerimeter']),
		Array('rh', Array('m', 'mm', 'ft', 'in'), $ec_lang['d_hydraulicRadius']),
		Array('v', Array('mps', 'ftps', 'mph'), $ec_lang['d_velocity']),
		Array('q', Array('m3ps', 'lps', 'ft3ps', 'gpm', 'mgd'), $ec_lang['d_flow']),
		Array('hv', Array('m', 'mm', 'ft', 'in'), $ec_lang['d_velocityHead']),
		Array('t', Array('m', 'mm', 'ft', 'in'), $ec_lang['d_topWidth']),
		Array('f', NULL, $ec_lang['d_froudeNumber']),
		Array('tau', Array('npm2', 'psf'), $ec_lang['d_shearStress']),
		Array('d50_strickler', Array('m', 'mm', 'ft', 'in'), '<span title="per Strickler (Adjust n so this equals your design lining size)">Implied riprap size based on n</span>'),
		Array('d50_bottom', Array('m', 'mm', 'ft', 'in'), '<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required bottom angular riprap size, D50, Maricopa County</span>'),
		Array('d50_z1', Array('m', 'mm', 'ft', 'in'), '<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required side slope 1 angular riprap size, D50, Maricopa County</span>'),
		Array('d50_z2', Array('m', 'mm', 'ft', 'in'), '<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required side slope 2 angular riprap size, D50, Maricopa County</span>'),
		Array('d50_mra', Array('m', 'mm', 'ft', 'in'), 'Required angular riprap size, D50, per Maynord, Ruff, and Abt (1989)'),
		Array('d50_searcy', Array('m', 'mm', 'ft', 'in'), 'Required angular riprap size, D50, per Searcy (1967)'), 
	)
);
?>

<div class="left"><p><a href="../contact.php"><?=$ec_lang['d_feedbackRequest']?></a></p></div>
<script type="text/javascript">
var pageCalculator = function(f) {
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
	beta = f['beta'].value,
	sgrock = f['sgrock'].value,
	a,
	pw,
	rh,
	t,
	v,
	hv,
	q,
	froude,
	tau,
	c_isbash,
	d50_bottom,
	d50_z1,
	d50_z2;
	a = y * (b + (z1 + z2) * y / 2);
	pw = b + y * (Math.sqrt(1 + z1 * z1) + Math.sqrt(1 + z2 * z2));
	rh = a / pw;
	t = b + y * (z1 + z2);	
	v = c/n*Math.pow(rh,2/3)*Math.pow(s0,0.5);
	hv=v * v / (2 * g)
	q = v*a;
	froude = v * Math.sqrt(t/(g * a * Math.cos(Math.atan(s0))));
	tau = gammawater * y * s0;
	c_isbash = (beta <= 30) ? 1.2 : 0.86;
	d50_strickler = Math.pow(n * 21.2, 6);
	d50_mra = 0.031 * Math.pow(v, 2.5) / (Math.pow(sgrock - 1, 0.25) * Math.pow(y, 0.25) * ((beta <= 30) ? 1 : 1.5));
	d50_searcy = 0.022 * v * v;
	d50_bottom = riprap_size(y, a, hv, 1000, s0, c_isbash, sgrock);
	d50_z1 = riprap_size(y, a, hv, z1, s0, c_isbash, sgrock);
	d50_z2 = riprap_size(y, a, hv, z2, s0, c_isbash, sgrock);
	$("#q").html((q * f['qu'].value).toFixed(4));
	//document.getElementById('q').innerHTML = (q * f['qu'].value).toFixed(2);
	document.getElementById('v').innerHTML = (v * f['vu'].value).toFixed(2);
	document.getElementById('hv').innerHTML = (hv * f['hvu'].value).toFixed(2);
	document.getElementById('a').innerHTML = (a * f['au'].value).toFixed(2);
	document.getElementById('pw').innerHTML = (pw * f['pwu'].value).toFixed(2);
	document.getElementById('rh').innerHTML = (rh * f['rhu'].value).toFixed(2);
	document.getElementById('t').innerHTML = (t * f['tu'].value).toFixed(2);
	document.getElementById('f').innerHTML = froude.toFixed(2);
	document.getElementById('tau').innerHTML = (tau * f['tauu'].value).toFixed(2);
	document.getElementById('d50_strickler').innerHTML = (d50_strickler * f['d50_strickleru'].value).toFixed(2);
	document.getElementById('d50_bottom').innerHTML = (d50_bottom * f['d50_bottomu'].value).toFixed(2);
	document.getElementById('d50_z1').innerHTML = (d50_z1 * f['d50_z1u'].value).toFixed(2);
	document.getElementById('d50_z2').innerHTML = (d50_z2 * f['d50_z2u'].value).toFixed(2);
	document.getElementById('d50_mra').innerHTML = (d50_mra * f['d50_mrau'].value).toFixed(2);
	document.getElementById('d50_searcy').innerHTML = (d50_searcy * f['d50_searcyu'].value).toFixed(2);
};
var riprap_size = function(y, a, hv, z, s0, c, sgrock) {
	var d50;
	if (s0 < 0.02) {
		// Isbash
		d50 = hv / (c * c * Math.cos(Math.atan(1 / z)) * (sgrock - 1));
	} else if (s0 < 0.1) {
		// Robinson
		d50 = 1.413 * Math.pow(a / y, 0.529) * Math.pow(s0, 0.794);
	} else if (s0 < 0.4) {
		// Robinson
		d50 = 0.4623 * Math.pow(a / y, 0.529) * Math.pow(s0, 0.307);
	} else {
		d50 = '-';
	}
	return d50;
};
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("main");
?>