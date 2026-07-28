<?php 
require_once ('lib/base.inc.php');
$html_title = $ec_lang['ws_main_title'];
$html_desc = $ec_lang['ws_main_desc'];
echoHeader("EngCalcs", $html_title, "");

?>
<h2><?=$ec_lang['ws_main_desc']?></h2>
<p class="collapse show d-print-none" id="relatedCalcs">
	<?=$ec_lang['ec_related_calcs']?> <a href="Weir-Flow-Irregular.php"><?=$ec_lang['wi_menu']?></a> &middot; <a href="Orifice.php"><?=$ec_lang['or_main_menu']?></a> &middot; <a href="Orifice-Drain-Time.php"><?=$ec_lang['odt_main_menu']?></a> <a data-bs-toggle="collapse" href="#relatedCalcs" aria-expanded="true" aria-controls="relatedCalcs"><?=$ec_lang['view_hide_line']?></a>
</p>
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