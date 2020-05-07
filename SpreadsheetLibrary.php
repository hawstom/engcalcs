<?php 
require_once ('lib/base.inc.php');
$html_title = $ec_lang['index_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="open source calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>

<h2>All Spreadsheets</h2>

<h4>Manning Pipe Flow Calculator:</h4>&ensp;
<p>
<a href = "spreadsheet/Manning-Pipe-Flow_1.0.php">1.0 Google Sheets</a><br />
<a href = "spreadsheet/Manning-Pipe-Flow_1.1.php">1.1 Google Sheets</a><br />
<a href = "spreadsheet/Manning-Pipe-Flow_2.0.xlsx"><b>2.0 Microsoft Excel</b></a><br />
<a href = "spreadsheet/Manning-Pipe-Flow_2.0.php"><b>2.0 Google Sheets</b></a>
</p>
<?php
echoFooter('main');
?>