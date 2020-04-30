<?php 
define('BASE_DIRECTORY', realpath(__DIR__.'/..'));
require_once (BASE_DIRECTORY."/engcalcs/lib/base.inc.php");
$html_title = $ec_lang['ws_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="wier vetedero calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['ws_main_desc']?></h2>
<?php echoHelpWanted(); ?>
<form name="formInput" action="javascript:EngCalcs.calcAndSave(document.forms.formInput, 'Weir-Flow-Simple')" method="post">
	<div>
        <input type="text" style="font-size: 2em; width: 98%" placeholder="Printable Title" /><br />
        <input type="text" style="font-size: 1.5em; width: 98%" placeholder="Printable Subtitle" />
		<input type="number" step="any" class="input" name="l" id="l" /> <?=$ec_lang['ws_weirLength']?><br /><br />
		<input type="number" step="any" class="input" name="h" id="h" /> <?=$ec_lang['ws_headWaterHeight']?><br /><br />
		<input type="number" step="any" class="input" name="cw" id="cw" /> <?=$ec_lang['ws_weirCoefficient']?> <a target="_blank" href="http://epg.modot.org/files/b/bc/749_Broad-Crested_Weir_Coefficients.pdf">?</a><br /><br />
		<input type="submit" name="Submit" value="<?=$ec_lang['wi_save_and_calculate']?>" />
	</div>
</form>
<div>
<?=$ec_lang['calc_results']?>
	<table>
		<tr><td><?=$ec_lang['mpf_flow']?></td><td id="q"><?=$ec_lang['mpf_flow']?></td></tr>
	</table>
</div>
<?php echoFeedback(); ?>
<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
<dt><?=$ec_lang['ws_notes_we_term']?></dt><dd>q = cw * l * h<sup>1.5</sup></dd>
</dl>
<script type="text/javascript">
<!--
EngCalcs.pageCalculator = function(objForm) {
	var l = objForm.l.value,
	h = objForm.h.value,
	cw = objForm.cw.value,
	q
	;
	q = cw * l * Math.pow(h, 1.5);
	document.getElementById('q').innerHTML = q.toFixed(2);
}

<?php
echoCookieScript ();
?>
-->
</script>
<?php
echoFooter("engcalcs");
?>
