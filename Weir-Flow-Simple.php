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
		Array('name' => 'l', 'type' => 'number', 'default' => '1', 'units' => NULL, 'label' => $ec_lang['ws_weirLength']),
		Array('name' => 'h', 'type' => 'number', 'default' => '1', 'units' => NULL, 'label' => $ec_lang['ws_headWaterHeight']),
		Array('name' => 'cw', 'type' => 'number', 'default' => '3', 'units' => NULL, 'label' => '<a target="_blank" href="http://epg.modot.org/files/b/bc/749_Broad-Crested_Weir_Coefficients.pdf">'.$ec_lang['ws_weirCoefficient'].'</a>'),
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
<dt><?=$ec_lang['ws_notes_we_term']?></dt><dd>Q = C<sub>w</sub> &times; l &times; h<sup>1.5</sup></dd>
</dl>
<script src="/engcalcs/js/weir-flow-simple.js?v=<?=filemtime(__DIR__.'/js/weir-flow-simple.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice