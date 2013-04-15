<?php 
require_once ("../lib/edc.lib.php");
echoHeader("EngCalcs",$ec_lang['t_simpleWeirFlowCalculator']);
?>
<p><a href="../contact.php"><?=$ec_lang['translationHelpWanted']?></a></p>
<form name="formInput" action="javascript:calcAndSave(document.forms.formInput, 'Weir-Flow-Simple')" method="post">
	<div>
		<input type="text" size="6" name="l" id="l" /> <?=$ec_lang['d_weirLength']?><br /><br />
		<input type="text" size="6" name="h" id="h" /> <?=$ec_lang['d_headWaterHeight']?><br /><br />
		<input type="text" size="6" name="cw" id="cw" /> <?=$ec_lang['d_weirCoefficient']?><br /><br />
		<input type="submit" name="Submit" value="<?=$ec_lang['t_saveAndCalculate']?>" />
	</div>
</form>
<div>
<?=$ec_lang['t_results']?>
	<table>
		<tr><td><?=$ec_lang['d_flow']?></td><td id="q"><?=$ec_lang['d_flow']?></td></tr>
	</table>
</div>
<p><a href="../contact.php"><?=$ec_lang['d_feedbackRequest']?></a></p>
<h2>Notes</h2>
<dl>
<dt>Weir Equation</dt><dd>q = cw * length * h<sup>1.5</sup></dd>
</dl>
<script type="text/javascript">
<!--
function pageCalculator(f) {
	var l = f.l.value,
	h = f.h.value,
	cw = f.cw.value,
	q
	;
	q = cw * l * Math.pow(h, 1.5);
	document.getElementById('q').innerHTML = q.toFixed(2);
}
// On load, read cookie and calc.
readAndCalc('Weir-Flow-Simple', document.forms.formInput);
-->
</script>
<?php
echoFooter("main");
?>