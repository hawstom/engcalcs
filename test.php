<?php 
require_once ('../lib/edc.lib.php');
echoHeader('EngCalcs',$ec_lang['t_manningTrapFlowCalculator']);
?>
<h2><?=$ec_lang['d_manningTrapFlowCalculator']?></h2>
<p><?=$ec_lang['translationHelpWanted']?></p>

<form name="formInput" action="javascript:calcAndSave(document.forms.formInput, 'Manning-Trap-Flow')" method="post">
	<div>
		<input type="text" size="6" name="b" id="b" value="1" />
		<select name="bu">
			<option value="1"><?=$ec_lang['meters']?></option>
			<option value="1000"><?=$ec_lang['mm']?></option>
			<option value="3.2808"><?=$ec_lang['feet']?></option>
			<option value="39.37"><?=$ec_lang['inches']?></option>
		</select>
		<?=$ec_lang['d_bottomWidth']?><br /><br />

		<input type="text" size="6" name="z1" id="z1" value="4" />
		<?=$ec_lang['d_sideSlope1']?><br /><br />

		<input type="text" size="6" name="z2" id="z2" value="4" />
		<?=$ec_lang['d_sideSlope2']?><br /><br />

		<span title="Typical roughness values for plastics, clay, and concrete range from 0.009 to 0.013"><input type="text" size="6" name="n" id="n" value="0.03" /> <?=$ec_lang['d_manningRoughness']?> <a href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a></span><br /><br />
		<input type="text" size="6" name="s0" id="s0" value="0.001" /> <?=$ec_lang['d_channelSlope']?><br /><br />

		<input type="text" size="6" name="y" id="y" value="1" />
		<select name="yu">
			<option value="1"><?=$ec_lang['meters']?></option>
			<option value="1000"><?=$ec_lang['mm']?></option>
			<option value="3.2808"><?=$ec_lang['feet']?></option>
			<option value="39.37"><?=$ec_lang['inches']?></option>
		</select>
		<?=$ec_lang['d_flowDepth']?><br /><br />

		<input type="submit" name="Submit" value="<?=$ec_lang['t_saveAndCalculate']?>" />
	</div>
<p><a href="../contact.php"><?=$ec_lang['d_feedbackRequest']?></a></p>
<div>
<?=$ec_lang['t_results']?>
	<table>
		<tr><td><?=$ec_lang['d_flow']?></td><td id="q"><?=$ec_lang['d_flow']?></td>
		<td>
		<select name="qu" id="qu">
			<option value="1"><?=$ec_lang['m3psec']?></option>
			<option value="35.313"><?=$ec_lang['ft3psec']?></option>
			<option value="15849"><?=$ec_lang['gpm']?></option>
			<option value="22.822"><?=$ec_lang['mgd']?></option>
		</select>
		</td>
		</tr>
		<tr><td><?=$ec_lang['d_velocity']?></td><td id="v"><?=$ec_lang['d_velocity']?></td>
		<td>
		<select name="vu" id="vu">
			<option value="1"><?=$ec_lang['mpsec']?></option>
			<option value="3.2808"><?=$ec_lang['fpsec']?></option>
			<option value="2.237"><?=$ec_lang['mph']?></option>
		</select>
		</td>
		</tr>
		<tr><td><?=$ec_lang['d_flowArea']?></td><td id="a"><?=$ec_lang['d_flowArea']?></td>
		<td>
		<select name="au">
			<option value="1"><?=$ec_lang['m2']?></option>
			<option value="1000000"><?=$ec_lang['mm2']?></option>
			<option value="10.764"><?=$ec_lang['ft2']?></option>
			<option value="1550"><?=$ec_lang['in2']?></option>
		</select>
		</td>
		</tr>
		<tr><td><?=$ec_lang['d_wettedPerimeter']?></td><td id="pw"><?=$ec_lang['d_wettedPerimeter']?></td>
		<td>
		<select name="pwu">
			<option value="1"><?=$ec_lang['meters']?></option>
			<option value="1000"><?=$ec_lang['mm']?></option>
			<option value="3.2808"><?=$ec_lang['feet']?></option>
			<option value="39.37"><?=$ec_lang['inches']?></option>
		</select>
		</td>
		</tr>
		<tr><td><?=$ec_lang['d_hydraulicRadius']?></td><td id="rh"><?=$ec_lang['d_hydraulicRadius']?></td>
		<td>
		<select name="rhu">
			<option value="1"><?=$ec_lang['meters']?></option>
			<option value="1000"><?=$ec_lang['mm']?></option>
			<option value="3.2808"><?=$ec_lang['feet']?></option>
			<option value="39.37"><?=$ec_lang['inches']?></option>
		</select>
		</td>
		</tr>
		<tr><td><?=$ec_lang['d_topWidth']?></td><td id="t"><?=$ec_lang['d_topWidth']?></td>
		<td>
		<select name="tu">
			<option value="1"><?=$ec_lang['meters']?></option>
			<option value="1000"><?=$ec_lang['mm']?></option>
			<option value="3.2808"><?=$ec_lang['feet']?></option>
			<option value="39.37"><?=$ec_lang['inches']?></option>
		</select>
		</td>
		</tr>
		<tr><td><?=$ec_lang['d_froudeNumber']?></td><td id="f"><?=$ec_lang['d_froudeNumber']?></td></tr>
		<tr><td><?=$ec_lang['d_shearStress']?></td><td id="tau"><?=$ec_lang['d_shearStress']?></td>
		<td>
		<select name="tauu">
			<option value="1"><?=$ec_lang['npm2']?></option>
			<option value="0.02089"><?=$ec_lang['psf']?></option>
		</select>
		</td>
		</tr>
	</table>
	<br /><br />
</form>
</div>
<script type="text/javascript">
<!--
function pageCalculator(f) {
	var 
	c = 1.0,
	g = 9.806,
	gammawater = 9806,
	b = f.b.value / f.bu.value,
	y = f.y.value / f.yu.value,
	z1 = parseFloat(f.z1.value),
	z2 = parseFloat(f.z2.value),
	s0 = parseFloat(f.s0.value),
	n = parseFloat(f.n.value),
	a,
	pw,
	rh,
	t,
	v,
	q,
	froude,
	tau;
	a = y * (b + (z1 + z2) * y / 2);
	pw = b + y * (Math.sqrt(1 + z1 * z1) + Math.sqrt(1 + z2 * z2));
	rh = a / pw;
	t = b + y * (z1 + z2);	
	v = c/n*Math.pow(rh,2/3)*Math.pow(s0,0.5);
	q = v*a;
	froude = v * Math.sqrt(t/(g * a * Math.cos(Math.atan(s0))));
	tau = gammawater * y * s0;
	document.getElementById('q').innerHTML = (q * f.qu.value).toFixed(2);
	document.getElementById('v').innerHTML = (v * f.vu.value).toFixed(2);
	document.getElementById('a').innerHTML = (a * f.au.value).toFixed(2);
	document.getElementById('pw').innerHTML = (pw * f.pwu.value).toFixed(2);
	document.getElementById('rh').innerHTML = (rh * f.rhu.value).toFixed(2);
	document.getElementById('t').innerHTML = (t * f.tu.value).toFixed(2);
	document.getElementById('f').innerHTML = froude.toFixed(2);
	document.getElementById('tau').innerHTML = (tau * f.tauu.value).toFixed(2);
}
// On load, read cookie and calc.
readAndCalc('Manning-Trap-Flow', document.forms.formInput);
-->
</script>
<?php
echoFooter("main");
?>