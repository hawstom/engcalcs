<?php
require_once("../lib/edc.lib.php");
echoHeader("EngCalcs", "Compare languages");
compare_langs($_GET['lang1'], $_GET['lang2']);
echoFooter("main");
?>
