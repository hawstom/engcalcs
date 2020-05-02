<?php
error_reporting(E_ALL & ~E_NOTICE);
define('BASE_DIRECTORY', realpath(__DIR__.'/..'));
require_once (BASE_DIRECTORY."/engcalcs/lib/base.inc.php");
echoHeader("EngCalcs", "Compare languages");
compare_langs($_GET['lang1'], $_GET['lang2']);
echoFooter("EngCalcs");
?>
