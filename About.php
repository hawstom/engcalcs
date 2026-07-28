<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['about_main_title'];
$html_desc = $ec_lang['about_main_desc'];
echoHeader("EngCalcs", $html_title, "", false);
?>
<h2><?=$ec_lang['about_main_desc']?></h2>
<?php echoHelpWanted(); ?>
<?=$ec_lang['about_body_html']?>

<?php echoFeedback(); ?>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
