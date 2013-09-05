<?php 
require_once ("../lib/edc.lib.php");
$html_title = $ec_lang['index_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="open source calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("Normal", $html_title, $html_head);
echoEngCalcsMenu();
echoFooter();
?>

