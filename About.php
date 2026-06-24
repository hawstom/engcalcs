<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['about_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
	<meta name="Keywords" content="open source hydraulic calculators humanitarian mission contribute GPL" />
';
echoHeader("EngCalcs", $html_title, $html_head, false);
?>
<h2><?=$ec_lang['about_main_desc']?></h2>
<?php echoHelpWanted(); ?>
<?=$ec_lang['about_body_html']?>

<?php echoFeedback(); ?>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
