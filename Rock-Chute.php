<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['rc_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
	<meta name="Keywords" content="rock chute design riprap sizing Robinson 1998 unit discharge D50 median rock size erosion control grade stabilization" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['rc_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	// Inputs
	Array(
		Array('name' => 'rc_S0', 'type' => 'number', 'default' => '0.2',  'units' => Array('grade', 'gradePercent'), 'label' => $ec_lang['rc_S0']),
		Array('name' => 'rc_qt', 'type' => 'number', 'default' => '0.5',  'units' => Array('m2ps', 'ft2ps'),         'label' => $ec_lang['rc_qt']),
		Array('name' => 'rc_np', 'type' => 'number', 'default' => '0.45', 'units' => NULL, 'label' => $ec_lang['rc_np']),
		Array('name' => 'rc_sg', 'type' => 'number', 'default' => '2.65', 'units' => NULL, 'label' => $ec_lang['rc_sg']),
		Array('name' => 'rc_SD', 'type' => 'number', 'default' => '1.30', 'units' => NULL, 'label' => $ec_lang['rc_SD']),
		Array('name' => 'rc_yn', 'type' => 'number', 'default' => '',     'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['rc_yn']),
	),
	// Results
	Array(
		Array('name' => 'rc_D50',          'units' => Array('mm', 'm', 'in', 'ft'), 'label' => $ec_lang['rc_D50']),
		Array('name' => 'rc_eq_used',      'units' => NULL,                        'label' => $ec_lang['rc_eq_used']),
		Array('name' => 'rc_sg_check',     'units' => NULL,                        'label' => $ec_lang['rc_sg_check']),
		Array('name' => 'rc_SD_check',     'units' => NULL,                        'label' => $ec_lang['rc_SD_check']),
		Array('name' => 'rc_layer',        'units' => Array('mm', 'm', 'in', 'ft'),'label' => $ec_lang['rc_layer']),
		Array('name' => 'rc_crest_radius', 'units' => Array('mm', 'm', 'in', 'ft'),'label' => $ec_lang['rc_crest_radius']),
		Array('name' => 'rc_crest_length', 'units' => Array('m', 'mm', 'ft', 'in'),'label' => $ec_lang['rc_crest_length']),
		Array('name' => 'rc_apron_length', 'units' => Array('m', 'mm', 'ft', 'in'),'label' => $ec_lang['rc_apron_length']),
		Array('name' => 'rc_n_chute',      'units' => NULL,                        'label' => $ec_lang['rc_n_chute']),
		Array('name' => 'rc_Vm',           'units' => Array('mps', 'ftps'),        'label' => $ec_lang['rc_Vm']),
		Array('name' => 'rc_qm',           'units' => Array('m2ps', 'ft2ps'),      'label' => $ec_lang['rc_qm']),
		Array('name' => 'rc_qs',           'units' => Array('m2ps', 'ft2ps'),      'label' => $ec_lang['rc_qs']),
		Array('name' => 'rc_d',            'units' => Array('m', 'mm', 'ft', 'in'),'label' => $ec_lang['rc_d']),
		Array('name' => 'rc_Hp',             'units' => Array('m', 'mm', 'ft', 'in'),'label' => $ec_lang['rc_Hp']),
		Array('name' => 'rc_ponding_check',  'units' => NULL,                        'label' => $ec_lang['rc_ponding_check']),
	)
);
?>

<div id="rc_sketch" style="margin-top:1em;max-width:510px;"></div>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['rc_notes_4_term']?></dt><dd><?=$ec_lang['rc_notes_4_def']?></dd>
</dl>

<?php echoFeedback(); ?>
<script>
EngCalcs.pageConfig = {
	rc_eq1:          '<?=htmlspecialchars($ec_lang['rc_eq1'],          ENT_QUOTES, 'UTF-8')?>',
	rc_eq2:          '<?=htmlspecialchars($ec_lang['rc_eq2'],          ENT_QUOTES, 'UTF-8')?>',
	rc_eq_warn_low:  '<?=htmlspecialchars($ec_lang['rc_eq_warn_low'],  ENT_QUOTES, 'UTF-8')?>',
	rc_eq_warn_high: '<?=htmlspecialchars($ec_lang['rc_eq_warn_high'], ENT_QUOTES, 'UTF-8')?>',
	rc_sg_ok:        '<?=htmlspecialchars($ec_lang['rc_sg_ok'],        ENT_QUOTES, 'UTF-8')?>',
	rc_sg_low:       '<?=htmlspecialchars($ec_lang['rc_sg_low'],       ENT_QUOTES, 'UTF-8')?>',
	rc_sg_high:      '<?=htmlspecialchars($ec_lang['rc_sg_high'],      ENT_QUOTES, 'UTF-8')?>',
	rc_SD_ok:        '<?=htmlspecialchars($ec_lang['rc_SD_ok'],        ENT_QUOTES, 'UTF-8')?>',
	rc_SD_low:       '<?=htmlspecialchars($ec_lang['rc_SD_low'],       ENT_QUOTES, 'UTF-8')?>',
	rc_SD_high:      '<?=htmlspecialchars($ec_lang['rc_SD_high'],      ENT_QUOTES, 'UTF-8')?>',
	rc_pond_ok:      '<?=htmlspecialchars($ec_lang['rc_pond_ok'],      ENT_QUOTES, 'UTF-8')?>',
	rc_pond_warn:    '<?=htmlspecialchars($ec_lang['rc_pond_warn'],    ENT_QUOTES, 'UTF-8')?>'
};
</script>
<script src="/engcalcs/js/rock-chute.js?v=<?=filemtime(__DIR__.'/js/rock-chute.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
