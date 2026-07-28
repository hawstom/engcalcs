<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['rc_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
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
	rc_eq1:          <?=json_encode($ec_lang['rc_eq1'])?>,
	rc_eq2:          <?=json_encode($ec_lang['rc_eq2'])?>,
	rc_eq_warn_low:  <?=json_encode($ec_lang['rc_eq_warn_low'])?>,
	rc_eq_warn_high: <?=json_encode($ec_lang['rc_eq_warn_high'])?>,
	rc_sg_ok:        <?=json_encode($ec_lang['rc_sg_ok'])?>,
	rc_sg_ok_tip:    <?=json_encode($ec_lang['rc_sg_ok_tip'])?>,
	rc_sg_low:       <?=json_encode($ec_lang['rc_sg_low'])?>,
	rc_sg_low_tip:   <?=json_encode($ec_lang['rc_sg_low_tip'])?>,
	rc_sg_high:      <?=json_encode($ec_lang['rc_sg_high'])?>,
	rc_sg_high_tip:  <?=json_encode($ec_lang['rc_sg_high_tip'])?>,
	rc_SD_ok:        <?=json_encode($ec_lang['rc_SD_ok'])?>,
	rc_SD_ok_tip:    <?=json_encode($ec_lang['rc_SD_ok_tip'])?>,
	rc_SD_low:       <?=json_encode($ec_lang['rc_SD_low'])?>,
	rc_SD_low_tip:   <?=json_encode($ec_lang['rc_SD_low_tip'])?>,
	rc_SD_high:      <?=json_encode($ec_lang['rc_SD_high'])?>,
	rc_SD_high_tip:  <?=json_encode($ec_lang['rc_SD_high_tip'])?>,
	rc_pond_ok:      <?=json_encode($ec_lang['rc_pond_ok'])?>,
	rc_pond_ok_tip:  <?=json_encode($ec_lang['rc_pond_ok_tip'])?>,
	rc_pond_warn:    <?=json_encode($ec_lang['rc_pond_warn'])?>,
	rc_pond_warn_tip:<?=json_encode($ec_lang['rc_pond_warn_tip'])?>,
	rc_sketch_filter:         '<?=$ec_lang['rc_sketch_filter']?>',
	rc_sketch_top_crest_curve:'<?=$ec_lang['rc_sketch_top_crest_curve']?>',
	rc_sketch_outlet_apron:   '<?=$ec_lang['rc_sketch_outlet_apron']?>',
	rc_sketch_radius:         '<?=$ec_lang['rc_sketch_radius']?>'
};
</script>
<script src="/engcalcs/js/rock-chute.js?v=<?=filemtime(__DIR__.'/js/rock-chute.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
