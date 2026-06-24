<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['cs_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
	<meta name="Keywords" content="canal seepage loss conveyance efficiency inflow outflow irrigation water loss lining" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['cs_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	// Inputs
	Array(
		Array('name' => 'cs_Q_in',  'type' => 'number', 'default' => '1.000', 'units' => Array('m3ps','lps','ft3ps'), 'label' => $ec_lang['cs_Q_in']),
		Array('name' => 'cs_Q_out', 'type' => 'number', 'default' => '0.900', 'units' => Array('m3ps','lps','ft3ps'), 'label' => $ec_lang['cs_Q_out']),
	),
	// Results
	Array(
		Array('name' => 'cs_Q_loss',   'units' => Array('m3ps','lps','ft3ps'),          'label' => $ec_lang['cs_Q_loss']),
		Array('name' => 'cs_loss_check','units' => NULL,                                 'label' => $ec_lang['cs_loss_check']),
		Array('name' => 'cs_pct_loss', 'units' => Array('depthPercent','depthFrac'),     'label' => $ec_lang['cs_pct_loss']),
		Array('name' => 'cs_Ec',       'units' => Array('depthPercent','depthFrac'),     'label' => $ec_lang['cs_Ec']),
		Array('name' => 'cs_Ec_check', 'units' => NULL,                                  'label' => $ec_lang['cs_Ec_check']),
		Array('name' => 'cs_Vol_day',  'units' => Array('m3','ft3','acft'),              'label' => $ec_lang['cs_Vol_day']),
		Array('name' => 'cs_Vol_year', 'units' => Array('m3','ft3','acft'),              'label' => $ec_lang['cs_Vol_year']),
	)
);
?>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['cs_notes_1_term']?></dt><dd><?=$ec_lang['cs_notes_1_def']?></dd>
	<dt><?=$ec_lang['cs_notes_2_term']?></dt><dd><?=$ec_lang['cs_notes_2_def']?></dd>
	<dt><?=$ec_lang['cs_notes_3_term']?></dt><dd><?=$ec_lang['cs_notes_3_def']?></dd>
</dl>

<?php echoFeedback(); ?>
<script>
EngCalcs.pageConfig = {
	loss_positive: '<?=htmlspecialchars($ec_lang['cs_loss_positive'], ENT_QUOTES, 'UTF-8')?>',
	loss_zero:     '<?=htmlspecialchars($ec_lang['cs_loss_zero'],     ENT_QUOTES, 'UTF-8')?>',
	loss_negative: '<?=htmlspecialchars($ec_lang['cs_loss_negative'], ENT_QUOTES, 'UTF-8')?>',
	Ec_good:       '<?=htmlspecialchars($ec_lang['cs_Ec_good'],       ENT_QUOTES, 'UTF-8')?>',
	Ec_fair:       '<?=htmlspecialchars($ec_lang['cs_Ec_fair'],       ENT_QUOTES, 'UTF-8')?>',
	Ec_poor:       '<?=htmlspecialchars($ec_lang['cs_Ec_poor'],       ENT_QUOTES, 'UTF-8')?>'
};
</script>
<script src="/engcalcs/js/canal-seepage.js?v=<?=filemtime(__DIR__.'/js/canal-seepage.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
