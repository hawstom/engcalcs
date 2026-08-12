<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['rc_main_title'];
$html_desc = $ec_lang['rc_main_desc'];
echoHeader("EngCalcs", $html_title, "");
?>
<h2><?=$ec_lang['rc_main_desc']?></h2>
<?php
echoCalculatorForm(
	// Inputs
	Array(
		Array('name' => 'rc_S0', 'type' => 'number', 'default' => '0.2',  'units' => 'slope', 'label' => $ec_lang['rc_S0']),
		Array('name' => 'rc_qt', 'type' => 'number', 'default' => Array('us' => '5', 'si' => '0.5'),  'units' => 'unit_discharge',         'label' => $ec_lang['rc_qt']),
		Array('name' => 'rc_np', 'type' => 'number', 'default' => '0.45', 'units' => NULL, 'label' => $ec_lang['rc_np']),
		Array('name' => 'rc_sg', 'type' => 'number', 'default' => '2.65', 'units' => NULL, 'label' => $ec_lang['rc_sg']),
		Array('name' => 'rc_SD', 'type' => 'number', 'default' => '1.30', 'units' => NULL, 'label' => $ec_lang['rc_SD']),
		Array('name' => 'rc_yn', 'type' => 'number', 'default' => '',     'units' => 'distance_medium', 'label' => $ec_lang['rc_yn']),
	),
	// Results
	Array(
		Array('name' => 'rc_D50',          'units' => 'distance_small', 'label' => $ec_lang['rc_D50']),
		Array('name' => 'rc_eq_used',      'units' => NULL,                        'label' => $ec_lang['rc_eq_used']),
		Array('name' => 'rc_sg_check',     'units' => NULL,                        'label' => $ec_lang['rc_sg_check']),
		Array('name' => 'rc_SD_check',     'units' => NULL,                        'label' => $ec_lang['rc_SD_check']),
		Array('name' => 'rc_layer',        'units' => 'distance_small','label' => $ec_lang['rc_layer']),
		Array('name' => 'rc_crest_radius', 'units' => 'distance_medium','label' => $ec_lang['rc_crest_radius']),
		Array('name' => 'rc_crest_length', 'units' => 'distance_medium','label' => $ec_lang['rc_crest_length']),
		Array('name' => 'rc_apron_length', 'units' => 'distance_medium','label' => $ec_lang['rc_apron_length']),
		Array('name' => 'rc_n_chute',      'units' => NULL,                        'label' => $ec_lang['rc_n_chute']),
		Array('name' => 'rc_Vm',           'units' => 'velocity',        'label' => $ec_lang['rc_Vm']),
		Array('name' => 'rc_qm',           'units' => 'unit_discharge',      'label' => $ec_lang['rc_qm']),
		Array('name' => 'rc_qs',           'units' => 'unit_discharge',      'label' => $ec_lang['rc_qs']),
		Array('name' => 'rc_d',            'units' => 'distance_medium','label' => $ec_lang['rc_d']),
		Array('name' => 'rc_Hp',             'units' => 'distance_medium','label' => $ec_lang['rc_Hp']),
		Array('name' => 'rc_ponding_check',  'units' => NULL,                        'label' => $ec_lang['rc_ponding_check']),
	)
);
?>

<div id="rc_sketch" style="margin-top:1em;max-width:510px;"></div>

<?php echoFeedback(); ?>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<?php
// ROADMAP Task 290: SIX OF THESE SEVEN NOTES WERE WRITTEN, TRANSLATED INTO 26 LANGUAGES, AND
// RENDERED BY NOTHING. Only note 4 (the Robinson citation) was on the page; 1, 2, 3, 5, 6 and 7
// existed as keys nobody displayed. Found 2026-08-12 by key_hygiene_check.php, which is the first
// thing here that could see them -- a missing <dt>/<dd> pair looks like nothing at all on a page,
// and translating one looks like ordinary work.
//
// Restored in LANGUAGE-FILE ORDER, which puts the Reference last where a citation belongs. That
// order is 1,2,3,5,6,7,4 -- note 4 was authored later and appended, so key number does not track
// reading order here and a loop over 1..7 would put the bibliography in the middle.
//
// rc_notes_7_term did not exist in ANY language: note 7 had a body and no heading, which is why
// only half the pair showed up as unreferenced. Written 2026-08-12.
//
// Content re-checked against the code before restoring, on the lpn_notes_4_def lesson that a
// sprint will faithfully translate a stale claim: the 0.45 porosity default matches rc_np in this
// file, and note 1's 0.02-0.40 slope validity range matches the guard in js/rock-chute.js.
?>
<dl>
	<dt><?=$ec_lang['rc_notes_1_term']?></dt><dd><?=$ec_lang['rc_notes_1_def']?></dd>
	<dt><?=$ec_lang['rc_notes_2_term']?></dt><dd><?=$ec_lang['rc_notes_2_def']?></dd>
	<dt><?=$ec_lang['rc_notes_3_term']?></dt><dd><?=$ec_lang['rc_notes_3_def']?></dd>
	<dt><?=$ec_lang['rc_notes_5_term']?></dt><dd><?=$ec_lang['rc_notes_5_def']?></dd>
	<dt><?=$ec_lang['rc_notes_6_term']?></dt><dd><?=$ec_lang['rc_notes_6_def']?></dd>
	<dt><?=$ec_lang['rc_notes_7_term']?></dt><dd><?=$ec_lang['rc_notes_7_def']?></dd>
	<dt><?=$ec_lang['rc_notes_4_term']?></dt><dd><?=$ec_lang['rc_notes_4_def']?></dd>
</dl>
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
