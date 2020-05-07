<?php 
require_once ('lib/base.inc.php');
$html_title = $ec_lang['ws_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="wier vetedero calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['ws_main_desc']?></h2>
<?php echoHelpWanted(); ?>
<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'l', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['ws_weirLength']),
		Array('name' => 'h', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['ws_headWaterHeight']),
		Array('name' => 'cw', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['ws_weirCoefficient'].'<a target="_blank" href="http://epg.modot.org/files/b/bc/749_Broad-Crested_Weir_Coefficients.pdf">?</a>'),
	),
	//Results
	Array(
		Array('name' => 'q', 'units' => NULL, 'label' => $ec_lang['mpf_flow']),
	),
	$flagFormAppend = false, $flagHideUnits = true
);
?>
<?php echoFeedback(); ?>
<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
<dt><?=$ec_lang['ws_notes_we_term']?></dt><dd>q = cw * l * h<sup>1.5</sup></dd>
</dl>
<script>
<!--
EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.readFormInput(objForm, 'l', hasUnits = false);
	this.readFormInput(objForm, 'h', hasUnits = false);
	this.readFormInput(objForm, 'cw', hasUnits = false);
	this.var.q = this.var.cw * this.var.l * Math.pow(this.var.h, 1.5);
	this.writeFormResult(objForm, 'q', precision = 2, hasUnits = false);
}
EngCalcs.pageCalculatorInitialize = function () {
}
<?php
echoCookieScript ();
?>
-->
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice