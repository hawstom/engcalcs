<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['ds_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
	<meta name="Keywords" content="drip irrigation sprinkler application rate precipitation rate distribution uniformity emitter lateral calculator" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['ds_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	// Inputs
	Array(
		Array('name' => 'q_avg', 'type' => 'number', 'default' => '2',   'units' => Array('lph','gph'),            'label' => $ec_lang['ds_q_avg']),
		Array('name' => 'q_min', 'type' => 'number', 'default' => '1.6', 'units' => Array('lph','gph'),            'label' => $ec_lang['ds_q_min']),
		Array('name' => 'se',    'type' => 'number', 'default' => '0.6', 'units' => Array('m','mm','ft','in'),     'label' => $ec_lang['ds_se']),
		Array('name' => 'sl',    'type' => 'number', 'default' => '1',   'units' => Array('m','mm','ft','in'),     'label' => $ec_lang['ds_sl']),
		Array('name' => 'n_e',   'type' => 'number', 'default' => '20',  'units' => NULL,                          'label' => $ec_lang['ds_n_e']),
		Array('name' => 'n_l',   'type' => 'number', 'default' => '10',  'units' => NULL,                          'label' => $ec_lang['ds_n_l']),
		Array('name' => 'd',     'type' => 'number', 'default' => '25',  'units' => Array('mm','m','in','ft'),     'label' => $ec_lang['ds_d']),
	),
	// Results
	Array(
		Array('name' => 'a_e',     'units' => Array('m2','mm2','ft2','in2'),       'label' => $ec_lang['ds_a_e']),
		Array('name' => 'pr',      'units' => Array('mmph','inph'),                'label' => $ec_lang['ds_pr']),
		Array('name' => 'du',      'units' => Array('depthPercent','depthFrac'),   'label' => $ec_lang['ds_du']),
		Array('name' => 'du_check','units' => NULL,                                'label' => $ec_lang['ds_du_check']),
		Array('name' => 'q_lat',   'units' => Array('lph','gph'),                  'label' => $ec_lang['ds_q_lat']),
		Array('name' => 'q_sys',   'units' => Array('lph','gph'),                  'label' => $ec_lang['ds_q_sys']),
		Array('name' => 't_run',   'units' => NULL,                                'label' => $ec_lang['ds_t_run']),
	)
);
?>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['ds_notes_1_term']?></dt><dd><?=$ec_lang['ds_notes_1_def']?></dd>
	<dt><?=$ec_lang['ds_notes_2_term']?></dt><dd><?=$ec_lang['ds_notes_2_def']?></dd>
	<dt><?=$ec_lang['ds_notes_3_term']?></dt><dd><?=$ec_lang['ds_notes_3_def']?></dd>
</dl>

<?php echoFeedback(); ?>
<script>
EngCalcs.pageConfig = {
	du_excellent: '<?=htmlspecialchars($ec_lang['ds_du_excellent'], ENT_QUOTES, 'UTF-8')?>',
	du_good:      '<?=htmlspecialchars($ec_lang['ds_du_good'],      ENT_QUOTES, 'UTF-8')?>',
	du_acceptable:'<?=htmlspecialchars($ec_lang['ds_du_acceptable'], ENT_QUOTES, 'UTF-8')?>',
	du_poor:      '<?=htmlspecialchars($ec_lang['ds_du_poor'],       ENT_QUOTES, 'UTF-8')?>'
};
</script>
<script src="/engcalcs/js/drip-sprinkler.js?v=<?=filemtime(__DIR__.'/js/drip-sprinkler.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
