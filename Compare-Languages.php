<?php
error_reporting(E_ALL & ~E_NOTICE);
require_once ('lib/base.inc.php');
echoHeader("EngCalcs", "Compare languages");
compare_langs($_GET['lang1'], $_GET['lang2']);
echoFooter("EngCalcs");
// Omit last closing tag is good practice