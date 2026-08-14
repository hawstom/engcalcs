<?php 
require_once ('lib/base.inc.php');
$html_title = $ec_lang['index_main_title'];
$html_desc = $ec_lang['index_meta_desc_plain'];
echoHeader("EngCalcs", $html_title, "", false);
echoFooter("EngCalcs");
// Omit last closing tag is good practice