<?php 
require_once ("../lib/edc.lib.php");
$html_title = $ec_lang['index_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="open source calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>

<h2>All Spreadsheets</h2>

<h4>Manning Pipe Flow Calculator:</h4>&ensp;
<a href = "spreadsheet/Manning-Pipe-Flow_1.0.ods">1.0 OpenDocument</a></br>&ensp;
<a href = "spreadsheet/Manning-Pipe-Flow_1.0.php">1.0 Google Sheets</a></br>&ensp;
<a href = "spreadsheet/Manning-Pipe-Flow_1.1.ods">1.1 OpenDocument</a></br>&ensp;
<a href = "spreadsheet/Manning-Pipe-Flow_1.1.php">1.1 Google Sheets</a></br>&ensp;<b>
<a href = "spreadsheet/Manning-Pipe-Flow_2.0.ods">2.0 OpenDocument</a></b></br>&ensp;<b>
<a href = "spreadsheet/Manning-Pipe-Flow_2.0.php">2.0 Google Sheets</a></b></p>

<?php
echoFooter();
?>