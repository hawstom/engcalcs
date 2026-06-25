<?php 
require_once ('lib/base.inc.php');
$html_title = $ec_lang['index_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="open source calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head, false);
echoFooter("EngCalcs");
// Omit last closing tag is good practice