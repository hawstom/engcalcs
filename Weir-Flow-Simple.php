<?php 
require_once ("../lib/edc.lib.php");
$html_title = $ec_lang['ws_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="wier vetedero calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['ws_main_desc']?></h2>
<p><a href="../contact.php"><?=$ec_lang['template_translation_help']?></a></p>
<form name="formInput" action="javascript:calcAndSave(document.forms.formInput, 'Weir-Flow-Simple')" method="post">
	<div>
		<input type="text" size="6" name="l" id="l" /> <?=$ec_lang['ws_weirLength']?><br /><br />
		<input type="text" size="6" name="h" id="h" /> <?=$ec_lang['ws_headWaterHeight']?><br /><br />
		<input type="text" size="6" name="cw" id="cw" /> <?=$ec_lang['ws_weirCoefficient']?><br /><br />
		<input type="submit" name="Submit" value="<?=$ec_lang['wi_save_and_calculate']?>" />
	</div>
</form>
<div>
<?=$ec_lang['calc_results']?>
	<table>
		<tr><td><?=$ec_lang['mpf_flow']?></td><td id="q"><?=$ec_lang['mpf_flow']?></td></tr>
	</table>
</div>
<p><a href="../contact.php"><?=$ec_lang['template_feedback']?></a></p>
<h2><?=$ec_lang['ws_notes_heading']?></h2>$ec_lang['ws_notes_heading']
<dl>
<dt><?=$ec_lang['ws_notes_we_term']?></dt><dd>q = cw * l * h<sup>1.5</sup></dd>
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